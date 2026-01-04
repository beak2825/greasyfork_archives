// ==UserScript==
// @name         拷贝漫画PC显示评论
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  改自Byaidu的拷贝漫画增强插件，只保留评论的加载和发送功能，并重做了ui
// @author       ljw2487
// @match        *://*.copymanga.com/*
// @match        *://*.copymanga.org/*
// @match        *://*.copymanga.net/*
// @match        *://*.copymanga.info/*
// @match        *://*.copymanga.site/*
// @match        *://*.copymanga.tv/*
// @match        *://copymanga.com/*
// @match        *://copymanga.org/*
// @match        *://copymanga.net/*
// @match        *://copymanga.info/*
// @match        *://copymanga.site/*
// @match        *://copymanga.tv/*
// @license      GNU General Public License v3.0 or later
// @resource     element_css https://unpkg.com/element-ui@2.15.0/lib/theme-chalk/index.css
// @resource     animate_css https://unpkg.com/animate.css@4.1.1/animate.min.css
// @require      https://unpkg.com/vue@2.6.12/dist/vue.min.js
// @require      https://unpkg.com/element-ui@2.15.0/lib/index.js
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/store.js@1.0.4/store.js
// @require      https://unpkg.com/jquery@3.5.1/dist/jquery.min.js
// @require      https://unpkg.com/jszip@3.1.5/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://unpkg.com/crypto-js@4.1.1/crypto-js.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/464656/%E6%8B%B7%E8%B4%9D%E6%BC%AB%E7%94%BBPC%E6%98%BE%E7%A4%BA%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/464656/%E6%8B%B7%E8%B4%9D%E6%BC%AB%E7%94%BBPC%E6%98%BE%E7%A4%BA%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

// 更新了在漫画详情页显示已读章节的字样

// retry 拦截器
axios.interceptors.response.use(undefined, (err) => {
  return new Promise((resolve)=>{setTimeout(()=>{resolve()},1000)}).then(() => axios(err.config));
});

function route() {
    console.log('LOAD SUCCESSED', window.document.title)
    // /comic/gengjuesezhuanshengtaiguotoule/chapter/bf86c68c-195a-11ec-943d-00163e0ca5bd
    if (/^\/comic\/.*\/.*$/.test(location.pathname)) comicPage(1)
    else if (/^\/comic\/[^\/]*$/.test(location.pathname)) tablePage(1);
    else if (/^\/h5\/comicContent\/.*\/.*$/.test(location.pathname)) comicPage(0)
    else if (/^\/h5\/details\/comic\/[^\/]*$/.test(location.pathname)) tablePage(0);
}
route()
///////////////////////////////////////////////////////////////////////
async function loadCSS(){
    var element_css, animate_css;
    if (typeof(GM_getResourceText)=='undefined'){
        await axios.get('https://unpkg.com/element-ui@2.15.0/lib/theme-chalk/index.css')
        .then(function (response) {
            element_css = response.data;
        })
        await axios.get('https://unpkg.com/animate.css@4.1.1/animate.min.css')
        .then(function (response) {
            animate_css = response.data;
        })
    }else{
        element_css = GM_getResourceText("element_css");
        animate_css = GM_getResourceText("animate_css");
    }
    GM_addStyle(element_css);
    GM_addStyle(animate_css);
}
/////////////////////////////////////////////////////////////////////
async function tablePage(isPC) {
    // loadCSS()
    let comicName
    if (isPC) {
        comicName = window.location.pathname.split('/')[2]
        console.log("isPC=", isPC, comicName)
    }
    else {
        comicName = window.location.pathname.split('/')[4]
        return console.log("isPC=", isPC, comicName, "H5模式自带历史功能所以终止函数")
    }
    let token = await cookieStore.get('token');
    if (!token) return console.log("未登录 -> 所以访问不到历史记录")

    let findTarget = function(result) {
        let targetElement = document.getElementsByClassName('table-default-right')[0]
        if (targetElement) {
            return modifyDom(targetElement, result)
        }
        else {
            console.log('targetElement Not Found')
            // 若未找到target元素的话则进行监听，但按理说请求队列到这一步时target元素已经加载了
            // 创建一个 MutationObserver 实例，监听目标节点的子节点变化
            var observer = new MutationObserver(function(mutationsList) {
                for (var mutation of mutationsList) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0 && mutation.target.className === "upLoop") {
                        // 检查是否有新添加的节点是具有类名为 'table-default-right' 的元素
                        // var addedNodes = Array.from(mutation.addedNodes);
                        // var tableDefaultRightElements = addedNodes.filter(function(node) {
                        //     return node.classList && node.classList.contains('table-default-right');
                        // });
                        // if (tableDefaultRightElements.length > 0) {
                        //     console.log(2, tableDefaultRightElements)
                        // 停止监听
                        //     observer.disconnect();
                        // }
                        // 而当upLoop找到时，target元素相当于是肯定能找到了，所以不需要上面的方法了
                        targetElement = document.getElementsByClassName('table-default-right')[0]
                    }
                }
                modifyDom(targetElement, result)
                observer.disconnect();
            });
            // 选择需要观察变化的节点
            let targetNode = document.getElementsByTagName('main')[0]
            // 配置观察器的选项
            let config = { childList: true, subtree: true };
            // 开始观察
            observer.observe(targetNode, config);
        }
    }

    let modifyDom = function (element, res) {
        let span = document.createElement('span')
        let a = document.createElement('a')
        span.innerText = "已阅读到："
        if (res) {
            a.href = `/comic/${res.path_word}/chapter/${res.chapter_id}`
            a.target = "_blank"
            a.innerText = res.chapter_name
        }
        else {
            a.href = '#'
            a.innerText = '未阅读'
            a.style.cssText = 'pointer-events: none; color: gray; text-decoration: none;'
        }
        element.insertBefore(a, element.firstChild);
        element.insertBefore(span, element.firstChild);
    }

    await axios.get('https://api.mangacopy.com/api/v3/comic2/' + comicName + '/query?platform=1&_update=true',{
        headers: {'authorization': 'Token ' + token.value}
    }).then(function (response) {
        console.log('res', response)
        let result = response.data.results.browse
        if (result) findTarget(result)
        else findTarget(false)
    }).catch(function (err) {
        console.log('err', err)
    });
}



async function comicPage(isPC) {
    loadCSS()
    var comic, chapter, htmlBody, newDiv, newStyle
    if (isPC) comic = window.location.pathname.split('/')[2]
    else comic = window.location.pathname.split('/')[3]
    chapter = window.location.pathname.split('/')[4]
    console.log('Comic:', comic,'|| Chapter:', chapter)
    //
    htmlBody = document.getElementsByTagName('body')[0]
    console.log(htmlBody)
    newDiv = document.createElement('div')
    newDiv.innerHTML = `
    <div id="app" class="sideComment">
      <el-button
        @click="switchCommentButton"
        class="showComment"
        :style=" showComment ? 'background-color: rgba(0, 0, 0, 0.8) !important;' : ''"
      >
        查看评论({{comment_count}})
      </el-button>
      <transition name="slide">
        <div v-if="showComment" :key="elementKey">
          <el-input
            v-model="comment_input"
            placeholder="吐槽"
            style="width: 300px; margin: 20px"
            class="commentCreate"
            @keyup.enter.native="send_comment"
            @focus="is_input=1"
            @blur="is_input=0"
          >
            <el-button slot="append" type="primary" @click="send_comment" class="commentSend">
              发表
            </el-button>
          </el-input>
          <ul style="margin-top:0;" class="commentList">
            <template v-for="(item, index) in comment_data">
              <li style="display:inline-block;">
                <span class="comment" v-bind:index="index">{{item.user_name}} : {{item.comment}}</span>
              </li>
            </template>
          <ul>
        </div>
      </transition>
    </div>`
    newStyle = document.createElement('style')
    newStyle.innerHTML = `
    <style>
      button { border: none; }
      button:active { border: none; }
      button:focus { outline: none; }
      .el-button { border: none; }

      .slide-enter-active,
      .slide-leave-active {
        transition: transform 0.5s;
      }

      .slide-enter {
        transform: translateX(100%);
      }

      .slide-leave-to {
        transform: translateX(100%);
      }
      .sideComment {
        position: fixed;
        right: 15px;
        top: 10%;
        bottom: 10%;
        text-align: right;
        color: white;
        z-index:100;
      }
      .showComment {
        position: relative;
        right: 0px;
        border-radius: 999px;
        color: #777777 !important;
        background-color: rgba(0, 0, 0, 0.3) !important;
        outline: none;
      }
      .showComment:hover {
        color: #b3b3b3 !important;
        background-color: rgba(0, 0, 0, 0.7) !important;
      }
      .commentCreate {
        position: relative !important;
        margin: 15px 0 !important;
        border-radius: 999px !important;
      }
      .el-input__inner::placeholder {
        color: #777777 !important;
      }
      .el-input__inner {
        padding-right: 70px;
        color: #b3b3b3 !important;
        border-radius: 999px !important;
        border: none !important;
        background-color: rgba(0, 0, 0, 0.3) !important;
      }
      .el-input__inner:focus {
        border: none !important;
        color: #b3b3b3 !important;
        background-color: rgba(0, 0, 0, 0.8) !important;
      }
      .el-input-group__append {
        position: absolute !important;
        top: 10px;
        right: 30px;
        border: none !important;
        background-color: rgba(0, 0, 0, 0) !important;
      }
      .commentSend {
        color: #777777 !important;
        border-radius: 999px !important;
      }
      .commentSend:hover {
        color: #b3b3b3 !important;
      }
      .commentList {
        position: absolute;
        display: flex;
        flex-direction: column;
        top: 112px;
        bottom: 0;
        margin: 0;
        padding: 0;
        overflow: auto;
        list-style: none;
      }
      .commentList::-webkit-scrollbar {
        display: none;
      }
      .commentList:hover > li {
        color: rgba(179, 179, 179, 1);
        background-color: rgba(0, 0, 0, 0.9);
        transition: all 0.3s ease-in-out;
      }
      .commentList > li {
        box-sizing: border-box;
        display: inline-block;
        margin-bottom: 15px;
        width: 300px;
        padding: 12px 20px;
        text-align: left;
        word-wrap: break-word;
        color: rgba(179, 179, 179, 0.4);
        border-radius: 22px;
        border: none;
        background-color: rgba(0, 0, 0, 0.4);
        transition: all 0.3s ease-in-out;
      }
      .new-comic-size-1 {
        max-width: 100% !important;
        min-width: 100% !important;
      }
      .container-fluid {
        padding-right: 0px;
        padding-left: 0px;
      }
      .comicContent-footer-txt {
        width: 140px !important;
      }
    </style>`
    // 添加评论相关元素
    htmlBody.appendChild(newDiv)
    htmlBody.appendChild(newStyle)
    // 调整图片展示宽度
    // let containerBox = document.getElementsByClassName('container-fluid')[0]
    // containerBox.style.cssText = ' padding-right: 0; padding-left: 0; '
    let container = document.getElementsByClassName('container')[0]
    let content = document.getElementsByClassName('comicContent-list')[0]
    if(window.innerWidth < 1240) {
        container.classList.add('new-comic-size-1')
        content.classList.add('new-comic-size-1')
    }
    // 调整高清显示
    // let list = content.getElementsByTagName('li')
    // console.log(list[0])
    // for (let i of list ){
    //     console.log(i);
    // }
    // 初始化数据
    let showComment = store.get('commentButtonState') == true
    // vue
    const app = new Vue({
        el: '#app',
        data: {
            comment_data: [], // 评论数据源
            comment_input: '',
            comment_count: 0,
            showComment: showComment,
            elementKey: 0,
            windowWidth: null
        },
        watch: {
            windowWidth (newVal, oldVal) {
                if(newVal <= 1240 && oldVal > 1240) {
                    container.classList.add('new-comic-size-1')
                    content.classList.add('new-comic-size-1')
                }
                if(newVal > 1240 && oldVal <= 1240) {
                    container.classList.remove('new-comic-size-1')
                    content.classList.remove('new-comic-size-1')
                }
            }
        },
        mounted () {
            const debounce = (fn, delay) => {
                let timer
                return function() {
                    if(timer) {
                        clearTimeout(timer)
                    }
                    timer = setTimeout(() => {
                        fn()
                    }, delay)
                }
            }
            const cancelDebounce = debounce(this.showWindowWidth, 50)
            window.addEventListener('resize', cancelDebounce)
        },
        destoryed() {
            window.removeEventListener('resize', cancelDebounce)
        },
        methods: {
            send_comment: async function () {
                let token = await cookieStore.get('token');
                await axios.post(
                    'https://api.mangacopy.com/api/v3/member/roast',
                    'chapter_id=' + chapter + '&roast=' + this.comment_input + '&_update=true',
                    {
                    headers: {
                        'authorization': 'Token ' + token.value
                    }
                }).then(function (response) {
                    app.comment_input = '';
                    console.log('评论成功：', response.data.message)
                });
                await this.load_comment();
            },
            load_comment: async function () {
                await axios.get('https://api.mangacopy.com/api/v3/roasts?chapter_id=' + chapter + '&limit=100&offset=0&_update=true')
                .then(function (response) {
                    let list = response.data.results.list
                    app.comment_data = list
                    app.comment_count = list.length
                    // 控制台展示评论
                    // console.log('↓↓↓↓评论列表↓↓↓↓')
                    // for (var i = 0; i < list.length; i++) {
                    //     console.log(list[i].user_name, ' : ', list[i].comment)
                    // }
                    // console.log('↑↑↑↑评论列表↑↑↑↑')
                    // console.log('评论请发送：app.send_comment(评论内容)')
                })
            },
            switchCommentButton() {
                let buttonState = !app.showComment
                this.showComment = buttonState
                // GM_setValue("commentButtonState", buttonState)
                store.set('commentButtonState', this.showComment)
            },
            showWindowWidth() {
                let windowWidth = window.innerWidth
                app.windowWidth = windowWidth
            }
        }
    });
    app.load_comment()
}