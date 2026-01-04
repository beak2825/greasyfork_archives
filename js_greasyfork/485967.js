// ==UserScript==
// @name         Bugs_template
// @namespace    http://www.akuvox.com/
// @version      0.7
// @description  Bugs_template!
// @author       zhixian.yang
// @match        http://192.168.10.17/zentao/*
// @match        http://zentao.akuvox.local/zentao/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485967/Bugs_template.user.js
// @updateURL https://update.greasyfork.org/scripts/485967/Bugs_template.meta.js
// ==/UserScript==
(function() {

          function getCommitId() {
              //定义模板
       var commitStr = "<strong>[产品问题原因]</strong><br>" +
    "请在此次简要描述该bug产生的原因<br>" +
    "<strong>[解决办法]</strong><br>" +
    "请在此处简要描述解决问题的办法<br>" +
    "<strong>[提交分支]</strong><br>" +
    "请在此处描述该bug修复时提交&合并的分支及revision号<br>";

            //1.首先获取iframe元素
            //两个场景：1.编辑；2.直接备注
                var need = document.getElementById("modulemenu").querySelector('li.active[data-id="story"]').querySelector('a') ? document.getElementById("modulemenu").querySelector('li.active[data-id="story"]').querySelector('a').textContent : null;
                var need_bug = document.getElementById("titlebar").querySelector('a.story-title')?document.getElementById("titlebar").querySelector('a.story-title').textContent : null;
                var need_bug_front = document.getElementById("titlebar").querySelector('.heading strong[style="color: "]')?document.getElementById("titlebar").querySelector('.heading strong[style="color: "]').textContent : null;
                var is_bug_patt = /【.*bug.*】/i
                var is_bug = is_bug_patt.test(need_bug)
                var is_bug_front = is_bug_patt.test(need_bug_front)
                var flag =is_bug || is_bug_front
                if(need && flag){//判断是 1.需求 并且是 2.bug
                          var elements= document.getElementsByClassName("ke-edit-iframe")
                          console.log(elements[0].contentWindow.document.getElementsByClassName('article-content'))
             //2.在iframe中获取body与span
                          var item_span = elements[0].contentWindow.document.getElementsByClassName('kindeditor-ph')
                          var item_body = elements[0].contentWindow.document.getElementsByClassName('article-content')
                          console.log(item_body[0].childNodes.length)
             //3.去除span的文字内容并在body中拼接
                          item_span[0].textContent = ""
                          item_body[0].innerHTML += commitStr
                }
        }
getCommitId();
})();