// ==UserScript==
// @name         CSDN 免登复制，展开文章
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  首次尝试写插件，
// @author       coder_zhang
// @match        https://blog.csdn.net/*/article/details/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.4/jquery.min.js
// @require      https://unpkg.com/coco-message@2.0.3/coco-message.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471250/CSDN%20%E5%85%8D%E7%99%BB%E5%A4%8D%E5%88%B6%EF%BC%8C%E5%B1%95%E5%BC%80%E6%96%87%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/471250/CSDN%20%E5%85%8D%E7%99%BB%E5%A4%8D%E5%88%B6%EF%BC%8C%E5%B1%95%E5%BC%80%E6%96%87%E7%AB%A0.meta.js
// ==/UserScript==
(function () {
  "use strict";

  //   免登录复制
  (function notSignCopy() {
    const codes = $("#content_views pre code");
    codes.css("user-select", "text");
    //   删除登录复制按钮
    const signBtn = $(".hljs-button.signin");
    signBtn.remove();
  })();

  //   展开全文
  (function extendContent() {
    // 展开
    $("#article_content").css({
      overflow: "auto",
      height: "auto",
    });

    // 删除展开遮层按钮
    $(".hide-article-box.hide-article-pos").remove();
  })();

  //   自定义右键菜单
  (function customContextMenu() {
    //   右键菜单
    const contextMenu = $(`<ul>
        <li action="copy">复制</li>
    </ul>`)
    .css({
        position: "absolute",
        top: 10,
        right: 10,
        width: "200px",
        // height: "30px",
        listStyle:"none",
        background: "gainsboro",
        border: "solid 1px darkgrey",
        padding: "10px",

    }).hide()

    const contextMenuDatas = {
      selected_string:''
    }

    //   右键菜单
    $(document.documentElement).on("contextmenu", function (e) {
        e.preventDefault();
        contextMenuDatas.selected_string = window.getSelection().toString();
        contextMenu.css({
          top: e.pageY,
          left: e.pageX,
        });
        contextMenu.show();
        return false;
      })
    $(document.body).on('click',function(){
        contextMenu.hide();
    })

    // 给菜单项添加事件
    const actions = {
      copy: function () {
        copyStr(contextMenuDatas.selected_string);
        cocoMessage.success(`Successfully copied`)
        contextMenuDatas.selected_string = '';
        function copyStr(str) {
          const textarea = document.createElement("textarea");
          textarea.value = str;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
        }
      },
    }
    contextMenu.children('li').css({
      padding:"4px 10px"
    }).on('mouseenter',function(){
      $(this).css({
        background: "lightblue",
      })
    }).on('mouseleave',function(){
      $(this).css({
        background: "none",
      })
    }).on('click',function(e){
      e.preventDefault();
      const action = $(this).attr('action');
      actions[action]();
    })

    contextMenu.appendTo(document.body);
  })();
})();
