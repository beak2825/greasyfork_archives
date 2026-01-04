// ==UserScript==
// @name        龙空 - 世界清净了
// @namespace   Violentmonkey Scripts
// @match       *://lkong.cn/forum/*
// @match       *://lkong.cn/
// @match       *://lkong.cn/index/thread
// @version     0.1.2
// @author      eaudouce
// @description 屏蔽列表中版宠的帖子
// @require     https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// ==/@require     http://lkong.cn/lkong/template/lkong/js/jquery-1.12.1.min.js==
// @require     https://cdn.bootcss.com/vue/2.6.11/vue.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM.getValue
// @grant       GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/422594/%E9%BE%99%E7%A9%BA%20-%20%E4%B8%96%E7%95%8C%E6%B8%85%E5%87%80%E4%BA%86.user.js
// @updateURL https://update.greasyfork.org/scripts/422594/%E9%BE%99%E7%A9%BA%20-%20%E4%B8%96%E7%95%8C%E6%B8%85%E5%87%80%E4%BA%86.meta.js
// ==/UserScript==
(function(){
  'use strict';
  console.log('start');
  // GMsetValue('banUserList', ['camahl']);

  var timer;
  function hide_banchong() {
    var user_list = GMgetValue('banUserList');
    $('.onefeed').show();
    if(user_list instanceof Array) {
      for(var i=0; i<user_list.length; i++) {
        $('#thefeed .author a[dataitem="name_'+user_list[i]+'"]').parents('.onefeed').hide();
        $('#thefeed .lkong_username[title="'+user_list[i]+'"]').parents('.onefeed').hide();
      }
    }
  }

  $('#lkong_content').on('DOMNodeInserted', '#thefeed', function() {
    if(timer) clearTimeout(timer);
    timer = setTimeout(hide_banchong, 200);
  });

  const comEdit = {
    template: `<li>
      <a href="#" @click="switchEditor">拒看版宠</a>
      <div v-if="isShow" class="user-list-editor">
        <div>
          <button @click="closeEditor">关闭x</button>
        </div>
        <ul>
          <li v-for="(user,index) in userList" :key="index">
            <input v-model.trim="userList[index]" placeholder="用户名" @change="isChanged=1">
            <button @click="deleteUser(index)">删除-</button>
          </li>
        </ul>
        <div>
          <button @click="saveUserList" class="bigger">保存</button>
          <button @click="addUser">增加+</button>
          <button @click="addBlack">导入黑名单+</button>
        </div>
        <div>
          <p>使用说明：</p>
          <p>1、可增加、删除、修改用户</p>
          <p>2、用户名一定要正确，不要有空格</p>
          <p>3、增加/删除/导入用户后，点保存才能生效</p>
        </div>
      </div>
    </li>`,
    data() {
      return {
        isShow: 0,
        isChanged: 0,
        userList: []
      }
    },
    methods: {
      switchEditor() {
        if(this.isShow) {
          this.closeEditor()
        } else {
          this.userList = GMgetValue('banUserList', []);
          this.isShow = 1
        }
      },
      saveUserList() {
        let userList = this.userList.filter(function(item, index, arr) {
          return item && item.trim() && arr.indexOf(item, 0) === index;
        });
        GMsetValue('banUserList', userList);
        this.userList = userList;
        setTimeout(() => {
          this.isShow = 0;
          this.isChanged = 0;
          hide_banchong();
        }, 500);
      },
      closeEditor() {
        if (this.isChanged) {
          let cf = confirm("有改动，未保存就关闭吗?");
          if (cf) {
            this.isShow = 0;
            this.isChanged = 0;
          } else {
            return false;
          }
        } else {
          this.isShow = 0;
          this.isChanged = 0;
        }
      },
      addUser() {
        this.userList.splice(this.userList.length, 0, '');
      },
      deleteUser(index) {
        var user = this.userList[index];
        this.userList.splice(index, 1);
        if(user) this.isChanged = 1;
      },
      // 从版主碌木的代码里扒到了黑名单接口
      addBlack() {
        var _this = this;
        $.get('http://lkong.cn/setting/index.php?mod=ajax&action=getblack', function(html){
          var userList = _this.userList;
          $(html).find('a[dataitem]').each(function () {
            userList.splice(userList.length, 0, $(this).html().trim());
          });
          userList = userList.filter(function(item, index, arr) {
            return item && item.trim() && arr.indexOf(item, 0) === index;
          });
          _this.userList = userList;
          _this.isChanged = 1;
          alert('导入黑名单完成，记得点保存');
        })
      }
    },
    mounted: function() {
      this.userList = GMgetValue('banUserList', []);
    }
  };

  GMaddStyle(`.user-list-editor{z-index:999998;position:absolute;background:#3a3a3acc;color:white;text-align:center;overflow:auto;padding:10px 16px}
    .user-list-editor>ul>li{list-style-type:none;display:block;margin-bottom:3px;float:none}
    .user-list-editor input{border:1px solid #999;padding:3px;margin-right:5px;border-radius:3px;width:100px}
    .user-list-editor p{color:#D9F0FB}
    .user-list-editor button{display:inline-block;padding:3px;margin:2px;color:#3a3a3a;background:#fff;border:0}
    .user-list-editor .bigger{font-size:16px;padding:5px 10px;background:#D9F0FB}`);

  Vue.prototype.$tele = new Vue();
  $('.header-nav>ul').append('<li id="refuse-to-see-sb"></li>');
  new Vue({
    el: "#refuse-to-see-sb",
    render: h => h(comEdit)
  });

  /*-- 通用 --*/
  function GMgetValue(name, value) {
    if (typeof GM_getValue === "function") {
      return GM_getValue(name, value);
    } else {
      return GM.getValue(name, value);
    }
  }

  function GMsetValue(name, value) {
    if (typeof GM_setValue === "function") {
      GM_setValue(name, value);
    } else {
      GM.setValue(name, value);
    }
  }

  function GMaddStyle(css) {
    var myStyle = document.createElement('style');
    myStyle.textContent = css;
    var doc = document.head || document.documentElement;
    doc.appendChild(myStyle);
  }

})()