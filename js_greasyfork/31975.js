// ==UserScript==
// @name        煎蛋吐槽管理器
// @namespace   mtdwss@gmail.com

// @include     http://jandan.net/duan*
// @include     http://jandan.net/pic*
// @include     http://jandan.net/ooxx*
// @include     http://jandan.net/qa*
// @include     http://jandan.net/pond*
// @include     http://jandan.net/zhoubian*

// @include     https://jandan.net/duan*
// @include     https://jandan.net/pic*
// @include     https://jandan.net/ooxx*
// @include     https://jandan.net/qa*
// @include     https://jandan.net/pond*
// @include     https://jandan.net/zhoubian*

// @require     https://cdn.bootcss.com/vue/2.4.2/vue.min.js
// @description save jandan.net's tucao
// @version     2.0.0
// @grant       none
/*jshint esversion: 6 */
// @downloadURL https://update.greasyfork.org/scripts/31975/%E7%85%8E%E8%9B%8B%E5%90%90%E6%A7%BD%E7%AE%A1%E7%90%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/31975/%E7%85%8E%E8%9B%8B%E5%90%90%E6%A7%BD%E7%AE%A1%E7%90%86%E5%99%A8.meta.js
// ==/UserScript==
(function () {
  if (window.top != window.self) return;

  var Exceptions = {
    BreakException: {},
    FetchJsonDoneException: {},
  }


  /**
   * 用于进行网络交互
   * @class
   */
  function Net() {
    /**
     * 使用get方法发送请求，默认接收json格式
     * @param {string} url 
     * @param {object} params 
     * @param {string} type 
     * @return {Promise} 成功为返回数据
     */
    var _get = function (url, params = {}, type = "json") {
      return new Promise((resolve, reject) => {
        $.ajax({
          url: url,
          data: params,
          type: "GET",
          dataType: type,
          success: data => resolve(data),
          error: err => reject(err),
        })
      })
    };

    /**
     * 异步方法同步处理，顺序获取一个post下面的所有吐槽
     * @param {string} postId 
     * @return {Promise} 成功为吐槽列表
     */
    var GetAllTucao = function (postId) {
      var start = false;

      function getFoo() {
        return new Promise((resolve, reject) => {
          var url = '/tucao/' + postId;
          if (start !== false) url += '/n/' + start;
          $.get(url, data => resolve(data))
        })
      }

      const g = function* () {
        try {
          while (true) {
            yield getFoo();
          }
        } catch (e) {
          console.log(e);
        }
      };

      function run(generator) {
        return new Promise((resolve, reject) => {

          const it = generator();

          function go(action, tucao_list) {
            action.value.then(function (tucao_data) {
              if (action.done) {
                resolve(tucao_list);
                return;
              }
              tucao_list = tucao_list.concat(tucao_data.tucao);
              if (!tucao_data.has_next_page) {
                resolve(tucao_list);
              } else {
                start = tucao_list[tucao_list.length - 1].comment_ID;
                return go(it.next(), tucao_list);
              }
            }, function (error) {
              return go(it.throw(error));
            });
          }

          go(it.next(), []);
        });
      }

      return new Promise((resolve, reject) => {
        run(g).then(data => {
          var result = {};
          data.forEach(element => {
            result[element.comment_ID] = element;
          });
          resolve(result);
        });
      })
    }

    return {
      GetAllTucao,
      GetHtml: _get,
    }
  };

  var net = Net();

  /**
   * 用于进行indexedDb的存储相关行为
   * @class
   */
  function Storage() {
    var db = null,
      //db名称
      DB_NAME = 'jcdb',
      //post表名称
      POST_TABLE = 'jcpost',
      //comment表名称
      COMMENT_TABLE = 'jccomment';
    var _this = this;
    /**
     * 初始化存储
     * @return {Promise} 成功后直接回调
     */
    var Init = function () {
      return new Promise(function (resolve, reject) {
        if (!'indexedDB' in window) {
          reject('not support indexedDB');
          return false;
        }
        var openRequest = indexedDB.open(DB_NAME, 2);
        /**
         * 数据库版本升级
         * @param {Exception} e 
         */
        openRequest.onupgradeneeded = function (e) {
          console.log("Upgrading...");
          db = e.target.result;
          if (!db.objectStoreNames.contains(DB_NAME)) {
            try {
              var store1 = db.createObjectStore(COMMENT_TABLE, {
                keyPath: "tucaoId"
              });
              var store2 = db.createObjectStore(POST_TABLE, {
                keyPath: "postId"
              });

              store1.createIndex("postId", "postId", {
                unique: false
              });
              store1.createIndex("date", "date", {
                unique: false
              });

              store2.createIndex("pageCate", "pageCate", {
                unique: false
              });
              store2.createIndex("updateDate", "updateDate", {
                unique: false
              });

              store2.createIndex("cate,date", ["pageCate", "updateDate"], {
                unique: false
              })

            } catch (err) {
              console.dir(err);
              reject(err);
            }
          }
        }

        /**
         * 数据库成功打开
         * @param {Exception} e 
         * @return {Promise.resolve} 直接回调
         */
        openRequest.onsuccess = function (e) {
          console.log("Open success!");
          db = e.target.result;
          resolve();
        }

        /**
         * 数据库打开错误
         * @param {Exception} e 
         * @return {Promise.reject} 携带错误信息拒绝
         */
        openRequest.onerror = function (e) {
          console.log("Error");
          console.dir(e);
          reject(e);
        }
      })
    };

    /**
     * 添加/更新评论
     * @param {obj} comment 评论内容实体
     * @param {bool} update_post 是否更新所在post的信息
     */
    var AddComment = function (comment, update_post) {
      return new Promise(function (resolve, reject) {
        GetPostInfo(comment.postId).then(data => {
          if (!update_post) return Promise.resolve();
          _put(POST_TABLE, {
            postId: comment.postId,
            updateDate: comment.date,
            pageCate: comment.page_cate,
            pageNo: comment.page_no,
            count: data && data.count ? data.count + 1 : 1,
          })
        }).then(() => {
          delete comment.page_no;
          _put(COMMENT_TABLE, comment)
        }).then(() => {
          resolve();
        }).catch(err => {
          reject(err);
        })
      })
    }

    /**
     * 添加/更新post信息
     * @param {obj} post 
     */
    var AddPost = function (post) {
      return new Promise((resolve, reject) => {
        _put(POST_TABLE, post).then(() => resolve()).catch(err => {
          reject(err)
        });
      })
    }

    /**
     * 根据索引和store名称，获取符合条件的指定条数内容
     * @param {string} store_name store名称
     * @param {string} idx 索引名称
     * @param {string} key 索引条件
     * @param {number} limit 获取条数
     */
    var _get_all = function (store_name, idx, key, limit) {
      return new Promise(function (resolve, reject) {
        var t = db.transaction([store_name], 'readonly');
        var store = t.objectStore(store_name);
        var index = store.index(idx);
        var range = IDBKeyRange.only(key);
        var getAllRequest = index.getAll(range, limit);
        getAllRequest.onsuccess = function () {
          resolve(getAllRequest.result);
        }
        getAllRequest.onerror = function (err) {
          reject(err);
        }
      })
    }

    /**
     * 获取不同页面下的所有post，固定最大50条
     * @param {string} cate 页面分类，如ooxx、pic、duan
     */
    var GetPostsByCate = function (cate) {
      return new Promise(function (resolve, reject) {
        _get_all(POST_TABLE, 'pageCate', cate, 50).then(data => {
          data.sort((a, b) => {
            var dateA = new Date(a.updateDate);
            var dateB = new Date(b.updateDate);
            if (dateA < dateB) return 1;
            if (dateA > dateB) return -1;
            return 0;
          })
          resolve(data);
        }).catch(err => {
          reject(err)
        });
      })
    };

    /**
     * 获取post下的所有吐槽，固定最大50条
     * @param {string} postId 
     */
    var GetCommentsByPostId = function (postId) {
      return new Promise(function (resolve, reject) {
        _get_all(COMMENT_TABLE, 'postId', postId, 50).then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
      })
    };

    /**
     * 获取store实体
     * @param {string} store_name store名称
     * @param {string} mode 打开模式
     */
    var _get_store = function (store_name, mode = 'readonly') {
      var t = db.transaction([store_name], mode);
      var store = t.objectStore(store_name);
      return store;
    }

    /**
     * 根据postid获取post的信息
     * @param {string} postId 
     */
    var GetPostInfo = function (postId) {
      return new Promise(function (resolve, reject) {
        _get(POST_TABLE, postId).then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        })
      });
    }

    /**
     * 根据commentid获取吐槽的信息
     * @param {string} commentId 
     * @return {Promise}
     */
    var GetCommentInfo = function (commentId) {
      return new Promise(function (resolve, reject) {
        _get(COMMENT_TABLE, commentId).then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        })
      });
    }

    /**
     * 从特定的store，获取指定id的实体
     * @param {string} store_name 
     * @param {string} key 
     * @return {Promise}
     */
    var _get = function (store_name, key) {
      return new Promise(function (resolve, reject) {
        var request = _get_store(store_name).get(key);
        request.onsuccess = function () {
          // console.log(request.result);
          resolve(request.result);
        }
        request.onerror = function (err) {
          console.dir(err);
          reject(err);
        }
      })
    }

    /**
     * 添加/更新内容到指定store
     * @param {string} store_name 
     * @param {string} value 
     * @return {Promise}
     */
    var _put = function (store_name, value) {
      return new Promise(function (resolve, reject) {
        var request = _get_store(store_name, 'readwrite').put(value);
        request.onsuccess = function () {
          console.log(request.result);
          resolve(request.result);
        }
        request.onerror = function (err) {
          console.dir(err);
          reject(err);
        }
      })
    }

    /**
     * 删除指定store下的指定条目
     * @param {string} store_name 
     * @param {string} key 
     * @return {Promise}
     */
    var _delete = function (store_name, key) {
      return new Promise(function (resolve, reject) {
        var request = _get_store(store_name, 'readwrite').delete(key);
        request.onsuccess = function () {
          resolve();
        }
        request.onerror = function (err) {
          console.dir(err);
          reject(err);
        }
      })
    };

    /**
     * 删除post
     * @param {string} postId 
     * @return {Promise}
     */
    var DeletePost = function (postId) {
      return new Promise((resolve, reject) => {
        _delete(POST_TABLE, postId).then(() => {
          resolve();
        }).catch(err => {
          reject(err);
        })
      });
    };

    /**
     * 删除吐槽
     * @param {string} commentId 
     */
    var DeleteComment = function (commentId) {
      return new Promise(function (resolve, reject) {
        GetCommentInfo(commentId).then(c => {
          GetPostInfo(c.postId).then(p => {
            _delete(COMMENT_TABLE, commentId).then(() => {
              if (p.count <= 1) _delete(POST_TABLE, p.postId).catch(err => {
                reject(err)
              });
              else {
                p.count -= 1;
                _put(POST_TABLE, p).catch(err => {
                  reject(err)
                });
              }
            }).catch(err => {
              reject(err);
            });
          });
        });
      });
    };
    return {
      Init,
      AddComment,
      GetCommentsByPostId,
      GetPostsByCate,
      DeletePost,
      AddPost,
      GetPostInfo,
    };
  }
  var storage = Storage();

  $.jcsaver = {
    //固定的页面
    jc_pages: [{
        id: 'ooxx',
        name: '妹子图',
      }, {
        id: 'pic',
        name: '无聊图',
      },
      {
        id: 'duan',
        name: '段子',
      },
      {
        id: 'qa',
        name: '问答',
      },
      {
        id: 'pond',
        name: '鱼塘',
      },
      {
        id: 'zhoubian',
        name: '周边',
      },

    ],
    st_index_prefix: "jc_index_",
    st_index_key: "",
    st_item_prefix: "jc_",
    st_db: null,
    page_cate: undefined,
    //自定义css
    jc_css: `
#jc_area {
text-align: left;
text-indent: 0;
width: 50%;
min-height: 300px;
background-color: #f2f2f2;
z-index: 100000;
position: fixed;
top: 10px;
left: 25%;
border: 1px solid;
list-style: none;
}
#jc_area > .jc_switch_bar span {
display: table-cell;
background-color: #bfbfbf;
cursor: pointer;
text-align: center;
line-height: 30px;
}
.jc_switch_bar span:hover {
background-color: #737373;
color: white;
}

.current_tab {
background: #636363 !important;
color: white;
}
#jc_area > .jc_switch_bar {
display: table;
width: 100%;
}
#jc_btn {
padding: 2px 10px;
height: 50px;
background-color: rgba(100, 100, 100, 0.6);
z-index: 100000;
text-align: center;
line-height: 50px;
position: fixed;
bottom: 10px;
right: 10px;
border-radius: 5px 5px 5px 5px;
}
#jc_btn > span {
cursor: pointer;
text-decoration: underline;
}
.jc_bar > span {
display: block;
float: right;
margin-right: 20px;
width: 20px;
text-align: center;
height: 15px;
margin-top: 5px;
line-height: 15px;
border-radius: 5px;
cursor: pointer;
color: white;
font-size: 10px;
box-shadow: 1px 1px 1px #6c6c6c;
}
.jc_bar > span.jc_go{
  background-color: #008f52;
}
.jc_bar > span.jc_del{
  background-color: #959595;
}
a.jc_exp{
  cursor: pointer;
}
.jc_bar {
line-height: 30px;
}
.jc_bar0 {
background-color: #c9c9c9;
}
.jc_hint {
  height: 24px;
  width: 24px;
  line-height: 24px;
  text-align: center;
  color: green;
  cursor: pointer;
}
strong.jc_hint:before {
  content: '[';
}
strong.jc_hint:after {
  content: '条回复]';
}
.jc_sync {
  position: absolute;
  left: -70px;
  -webkit-animation: sync-color 1.0s infinite ease-in-out;
  animation: sync-color 1.0s infinite ease-in-out;
  font-weight: 900;
  font-size: 13px;
}
@-webkit-keyframes sync-color {
  0% {
    color: gray;
  }
  100% {
    color: red;
  }
}

@keyframes sync-color {
  0% { 
    color: gray;
  }
  100% {
    color: red;
  }
}
  `,
    //自定义vue HTML
    jc_html: $(`
<div id="jc_main">
<div id="jc_area" v-show="show">
    <div class="jc_switch_bar"><span v-for="page in pages" v-bind:page="page.id" v-on:click="current_page = page.id; refresh();" v-bind:class="page.id==current_page?'current_tab jc_tab':'jc_tab'">{{ page.name }}</span></div>
    <div class="jc_list_area">
        <div v-for="(item,idx) in items" v-bind:class="'jc_bar jc_bar'+idx%2">&#9679;
            <a v-bind:cno="item.k" v-on:click="loadComments(item.postId, item.visable)" class="jc_exp">第{{ item.pageNo }}页 第{{ item.postId }}楼 {{ item.count }}条评论<span class="reply-total" v-if="item.reply_total_count > 0">，{{ item.reply_total_count }}条回复<span/></a>
            <span class="jc_go" title="Go to this location"><a v-bind:href="item|getUrl" target="blank" style="color:white;">&#9992;</a></span>
            </span>
            <span class="jc_del" v-on:click="deletePost(item.postId).then(() => {refresh();}).catch(e => {console.dir(e);});" title="Delete this comment">&#10005;</span>
            <div class="jc_comments" v-show="item.visable">
                <div v-for="comment in item.comments">{{ comment.date+':' }} <strong class='jc_hint' v-bind:title="comment.reply_count + '条回复'" v-show="comment.reply_count > 0">{{ comment.reply_count }}</strong><strong>{{ comment.content|removeHTMLTags }}</strong></div>
            </div>
        </div>
    </div>
</div>
<div id="jc_btn">
    <div class="jc_sync" v-show="syncing">
      syncing...
    </div>
    <span class="show" v-on:click="show = !show">
    <span v-if="show">关闭</span>
    <span v-else>打开</span>
    </span>
    <span class="settings">设置</span>
    <span class="resync" v-on:click="if(syncing)return;syncing=true;sync(()=>{syncing=false})">同步</span>
</div>
</div>
  `),
    //当前页面序号
    jc_current_page: "",
    /**
     * 当页面初始化的时候触发，用于解析页面hash确定是否需要跳转。
     */
    onPageLoad: function () {
      var myregexp = /#comment-\d+/g;
      var hash = myregexp.exec($(location).attr('hash'));
      if (hash === null || hash === undefined || hash.length <= 0) return;
      hash = hash[0];
      if ($(hash).length > 0) {
        console.log('在当前页');
        var post_id = hash.split('-')[1];
        storage.GetPostInfo(post_id).then(post => {
          console.log('post信息', post);
          if (post && post.pageNo != $.jcsaver.jc_current_page) {
            post.pageNo = $.jcsaver.jc_current_page;
            storage.AddPost(post).then(() => {
              console.log("post更新完成", post.postId, post.pageNo);
            });
          }
        })
        return;
      }
      console.log('不在当前页');
      if (parseInt($('.commentlist li').eq(0).attr('id').split('-')[1]) < parseInt(hash.split('-')[1])) {
        var next_page = $('.next-comment-page').eq(0);
        if (next_page.length == 1) {
          next_page = next_page.attr('href').split('-')[1].split('#')[0];
          $.jcsaver.turnPage(next_page, hash);
          return;
        }
      }
      if (parseInt($('.commentlist li').eq(-1).attr('id').split('-')[1]) > parseInt(hash.split('-')[1])) {
        var next_page = $('.previous-comment-page').eq(0);
        if (next_page.length == 1) {
          next_page = next_page.attr('href').split('-')[1].split('#')[0];
          $.jcsaver.turnPage(next_page, hash);
          return;
        }
      }
      alert("你寻找的post id:" + hash + "已经被删除！");
    },
    // 翻页
    turnPage: function (pageNo, hash) {
      var url = '//jandan.net/' + $.jcsaver.getPageKey() + '/page-' + pageNo + hash;
      console.log(url);
      if (confirm('你寻找的post id:' + hash + ' 在当前页不存在，是否跳转到\n' + url + '\n继续寻找?')) window.location.href = url;
    },
    /**
     * 监听到ajax成功后执行，用于解析成功后的数据
     * @param {event} event
     * @param {xhr} xhr
     * @param {settings} settings
     */
    onAjaxSuccess: function (event, xhr, settings) {
      if (settings.url == "/jandan-tucao.php" && xhr.responseJSON.code == "0") {
        var data = xhr.responseJSON.data;

        var value = {};
        value.tucaoId = data.comment_ID;
        value.postId = data.comment_post_ID;
        value.date = data.comment_date;
        value.content = data.comment_content;
        value.author = data.comment_author;
        value.page_cate = $.jcsaver.getPageKey();
        value.page_no = $.jcsaver.jc_current_page;

        storage.AddComment(value, true).catch(err => {
          alert("保存失败！请查看控制台日志！");
        });
      }
    },

    /**
     * 初始化
     */
    init: function () {
      //获取页面分类，比如pic、ooxx、duan
      var pageKey = $.jcsaver.getPageKey();
      var _this = this;
      if ($.inArray(pageKey, $.jcsaver.jc_pages.map(page => page.id)) < 0) {
        console.log('Jandan_tucao_saver: current page not match!');
        return false;
      }
      //初始化存储
      storage.Init().then(e => {
        _this.jc_current_page = null;
        //获取页码
        var result = new RegExp('page-([^&#]*)').exec(window.location.href);
        if (result != null) {
          _this.jc_current_page = parseFloat(result[1]);
          return Promise.resolve();
        } else {
          var next_page_url = $('.previous-comment-page').eq(0).attr('href');
          net.GetHtml(next_page_url, {}, 'text').then(data => {
            result = new RegExp('Newer Comments" href=([^&#]*)page-([^&#]*)').exec(data)
            _this.jc_current_page = parseFloat(result[2]);
            return Promise.resolve();
          })
        }
      }).then(() => {
        $.jcsaver.onPageLoad();
        _this.st_index_key = _this.st_index_prefix + pageKey;
        $style = $("<style></style>");
        $style.text(_this.jc_css);
        $("head").append($style);
        $("body").append(_this.jc_html);
        initVue();
        jc_vue.current_page = pageKey;
        jc_vue.refresh();
      }).catch(err => {
        console.log(err);
        alert('An error occured!');
      })
    },
    /**
     * 获取当前页面分类
     */
    getPageKey: function () {
      if ($.jcsaver.page_cate) return $.jcsaver.page_cate;
      var url = window.location.href;
      var subPath = url.split("/");
      $.jcsaver.page_cate = subPath[3];
      return $.jcsaver.page_cate;
    },
  };


  var jc_vue = undefined;
  var initVue = function () {
    jc_vue = new Vue({
      el: "#jc_main",
      data: {
        pages: $.jcsaver.jc_pages,
        items: [],
        show: false,
        current_page: "",
        syncing: false,
      },
      filters: {
        //根据post信息获取跳转到的页面地址
        getUrl: function (post) {
          return "/" + post.pageCate + "/page-" + post.pageNo + "#comment-" + post.postId;
        },
        /**
         * 去掉HTML标签
         */
        removeHTMLTags: function (string) {
          return string.replace(/(<([^>]+)>)/ig, '');
        }
      },
      methods: {
        /**
         * 刷新自己所有历史吐槽得到的回复，手动触发。
         * @return {undefined} 回调函数
         */
        sync: function (callback) {
          var promiseArray = [];
          jc_vue.pages.forEach(page => {
            var page_key = page.id;
            promiseArray.push(
              new Promise((resolve, reject) => {
                var subPromiseArray = [];
                storage.GetPostsByCate(page_key).then(post_list => {
                  post_list.forEach(post => {
                    var promise = new Promise((subResolve, subReject) => {
                      var post_total_reply = 0;
                      storage.GetCommentsByPostId(post.postId).then(comments => {
                        net.GetAllTucao(post.postId).then(tucao_list => {
                          console.log('post', post.postId, '吐槽数量', Object.keys(tucao_list).length);
                          comments.forEach(comment => {
                            let current_comment_reply_count = 0;
                            for (var key in tucao_list) {
                              if (tucao_list.hasOwnProperty(key)) {
                                var tucao = tucao_list[key];
                                if (tucao.comment_content.includes('data-id="' + comment.tucaoId + '"')) {
                                  // console.log('FFFFFFFFFFFFFFUUUUUUUUUUUUUUUUUUUUUKKKKKKKKKKKKKKKKKKKKK', comment);
                                  console.log('遇到回复，回复id：', tucao.comment_ID, "被回复id：", comment.tucaoId);
                                  current_comment_reply_count += 1;
                                  post_total_reply += 1;
                                  break;
                                }
                              }
                            };
                            if (current_comment_reply_count != comment.reply_count) {
                              comment.reply_count = current_comment_reply_count;
                              storage.AddComment(comment, false).then(() => {
                                console.log('comment 更新完成', comment);
                                // console.log('SSSSSSSSSSSSSSSSUUUUUUUUUUUUUUUUUUUUCCCCCCCCCCCCCCCCCCCCCCCEEEEEEEEEEEEEEEEESSSSSSSSSSS');
                              })
                            }
                            if (post.reply_total_count != post_total_reply) {
                              post.reply_total_count = post_total_reply;
                              storage.AddPost(post).then(() => {
                                console.log('post 更新完成', post);
                                // console.log('SSSSSSSSSSSSSSSSUUUUUUUUUUUUUUUUUUUUCCCCCCCCCCCCCCCCCCCCCCCEEEEEEEEEEEEEEEEESSSSSSSSSSS');
                              })
                            }
                          })
                          subResolve();
                        }).catch(err => {
                          console.dir(err)
                        });
                      })
                    });
                    subPromiseArray.push(promise);
                  });
                }).then(() => {
                  Promise.all(subPromiseArray).then((data) => {
                    console.log(page_key, '完成');
                    resolve();
                  }).catch(e => {
                    console.log(e);
                    alert(e);
                  })
                })
              })
            )
          });
          Promise.all(promiseArray).then(() => {
            console.log('全部完成');
            if (typeof (callback) == 'function') callback();
          })
        },
        /**
         * 刷新
         */
        refresh: function () {
          storage.GetPostsByCate(jc_vue.current_page).then(data => {
            // console.log(data);
            jc_vue.items = data;
          })
        },
        /**
         * 加载post下面的所有吐槽。
         */
        loadComments: function (postId, visable) {
          if (visable) visable = false;
          else visable = true;
          try {
            jc_vue.items.forEach((element, idx) => {
              if (element.postId == postId) {
                jc_vue.$set(jc_vue.items[idx], 'visable', visable);
                if (!visable) throw Exceptions.BreakException;
                storage.GetCommentsByPostId(postId).then(data => {
                  console.log(data);
                  jc_vue.$set(jc_vue.items[idx], 'comments', data);
                  throw Exceptions.BreakException;
                }).catch(e => {
                  if (e !== Exceptions.BreakException) {
                    alert(e);
                    throw e;
                  }
                })
              }
            });
          } catch (e) {
            if (e !== Exceptions.BreakException) throw e;
          }
        },
        /**
         * 删除post
         */
        deletePost: function (postId) {
          return new Promise((resolve, reject) => {
            storage.DeletePost(postId).then(() => {
              resolve();
            }).catch(e => {
              reject(e);
            });
          })
        },
      }
    });
  }

  $.jcsaver.init();
  $(document).ajaxSuccess((event, xhr, settings) => {
    $.jcsaver.onAjaxSuccess(event, xhr, settings);
  });
})();