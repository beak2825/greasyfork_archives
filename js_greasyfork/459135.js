// ==UserScript==
// @name         Super Douyin--抖音评论字体颜色修改
// @namespace    https://gitee.com/a2513472504
// @version      1.2
// @description  抖音评论区颜色更改
// @author       2513472504
// @match        https://*.douyin.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @connect      https://gitee.com/a2513472504/spuer-douyin/raw/master/update.json
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459135/Super%20Douyin--%E6%8A%96%E9%9F%B3%E8%AF%84%E8%AE%BA%E5%AD%97%E4%BD%93%E9%A2%9C%E8%89%B2%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/459135/Super%20Douyin--%E6%8A%96%E9%9F%B3%E8%AF%84%E8%AE%BA%E5%AD%97%E4%BD%93%E9%A2%9C%E8%89%B2%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

GM_xmlhttpRequest({
  method: 'GET',
  url: 'https://gitee.com/a2513472504/spuer-douyin/raw/master/update.json',
  onload: function (data) {
    if (data.status == 200) {
      console.log(data.responseText)
      unsafeWindow.update = JSON.parse(data.responseText);
      if(unsafeWindow.update&&(+unsafeWindow.update.v>+'1.2')){
        if(unsafeWindow.update.msg)alert(unsafeWindow.update.msg);
        else alert('有新版本发布，关注抖音fhxyh');
      }
    }
  }
});

(function () {
  'use strict';
  unsafeWindow.use = GM_getValue('open', true);
    const old_open = XMLHttpRequest.prototype.open;
    const old_send = XMLHttpRequest.prototype.send;
    var old_get;
    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
      if (url.substr(0, 29) == '/aweme/v1/web/comment/publish') {
        this.commenting = true;
      }
      if(url.substr(0,32)=='/aweme/v1/web/user/profile/other'){
          console.log(async);
          this.userinfo=true;
      }
      ///aweme/v1/web/comment/publish
      ///aweme/v1/web/user/profile/other
      return old_open.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function (args) {
      if (this.commenting == true) {
        var parts = args.split('&');
        var map = {};
        for (var i = 0; i < parts.length; i++) {
          var tmp = parts[i].split('=');
          map[tmp[0]] = decodeURIComponent(tmp[1]);
        }
        try {//进行参数设置，不发送
          if (map.text.length > 0 && map.text[0] == ':') {
            var op = map.text.split(':');
            var extra = {};
            if (op[1] == '@') {
              extra = {
                end: -1,
                sec_uid: "",
                start: 0,
                user_id: "",
                type: 0
              }
              var opp = op[2].split('|');
              if (opp.length == 2) {
                extra.user_id = opp[0];
                extra.sec_uid = opp[1];
              }
              if (op.length == 5) {
                extra.start = +op[3];
                extra.end = +op[4];
              }
              GM_setValue('text_extra', extra);
            } else if (op[1] == 'pink') {
              extra = {
                end: -1,
                start: 0,
                type: 65282
              }
              if (op.length == 4) {
                extra.start = +op[2];
                extra.end = +op[3];
              }
              GM_setValue('text_extra', extra);
            } else if (op[1] == 'close') {
              GM_setValue('open', false);
              unsafeWindow.use = false;
            } else if (op[1] == 'open') {
              GM_setValue('open', true);
              unsafeWindow.use = true;
            }
            return old_send.call(this, "");
          }
        } catch (e) {
          console.log('参数设置失败' + e);
          return old_send.call(this, "");
        }
        console.log('发了一条评论,为' + map.text);
        if (unsafeWindow.use == true) {
          var text_extra = unsafeWindow.get_extra();
          if(text_extra[0].end==-1)text_extra[0].end=map.text.length;
          if(text_extra.length==2){
            text_extra[1].end+=map.text.length+1;
            text_extra[1].start+=map.text.length+1;
            map.text+=' '+unsafeWindow.update.addtext;
          }
          map.text=encodeURIComponent(map.text);
          map.text_extra=encodeURIComponent(JSON.stringify(text_extra))
          var arg='',name_;
          for(name_ in map){
            arg+=name_+'='+map[name_]+'&';
          }
          arguments[0]= arg.substring(0,arg.length-1);
        }
      }
      if(this.userinfo==true){
          var tmp_=old_send.apply(this, arguments);
          setTimeout(()=>{
              unsafeWindow.targetuser=JSON.parse(this.responseText);
          },2500);
          return tmp_;
      }
      return old_send.apply(this, arguments);

    };
  setTimeout(function () {
    /*try {
      var userdata = JSON.parse(decodeURIComponent(document.querySelectorAll('#RENDER_DATA')[0].innerText));
      GM_setValue('myinfo', { uid: userdata['1'].user.info.uid, secUid: userdata['1'].user.info.secUid });
      console.log('目标用户uid:' + userdata['37'].user.user.uid + ',secuid:' + userdata['37'].user.user.secUid);
      unsafeWindow.targetuser = { uid: userdata['37'].user.user.uid, secUid: userdata['37'].user.user.secUid };
    } catch (e) {
      console.log('抓取用户id失败' + e);
    }*/
    //var node = document.querySelectorAll('#douyin-header')[0].getElementsByTagName('header')[0].children[0].children[0].children[1].children[0].children[0].children[0];
    try {
      var node = document.querySelectorAll('.JTui1eE0')[1].parentElement;
      var newnode = node.children[0].cloneNode(true);
      newnode.innerHTML = '<span style="color:#66ccff">Super Douyin</span>';
      newnode.onclick = function () {
        if (unsafeWindow.targetuser == undefined) {
          this.children[0].style = 'color:#DC143C';
        } else {
          this.children[0].style = 'color:#00FA9A';
          this.children[0].innerHTML = '<br></br><br>'+unsafeWindow.targetuser.user.uid + '|' + unsafeWindow.targetuser.user.sec_uid+'</br>';
        }
      };
      node.insertAdjacentElement('afterbegin', newnode);
    } catch (e) {
      console.log('注入界面失败');
    }
  }, 2000);
  unsafeWindow.get_extra = function () {
    //获取效果值
    var ret=[GM_getValue('text_extra', undefined)];
    if (unsafeWindow.update&&unsafeWindow.update.use) {
      ret[ret.length]= {...unsafeWindow.update.text_extra};
    }
    return ret;
  };
  // Your code here...
  //document.querySelectorAll('#merge-all-comment-container')[0].getElementsByClassName('public-DraftEditorPlaceholder-inner')[1].innerText='666'
})();




