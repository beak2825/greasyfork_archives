// ==UserScript==
// @name         Bugs_template
// @namespace    http://www.akuvox.com/
// @version      0.4
// @description  Bugs_template!
// @author       zhixian.yang
// @match        http://192.168.10.17/zentao/*
// @match        http://zentao.akuvox.local/zentao/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485959/Bugs_template.user.js
// @updateURL https://update.greasyfork.org/scripts/485959/Bugs_template.meta.js
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
                var need = document.getElementById("modulemenu").querySelector('li.active[data-id="story"]').querySelector('a').textContent
                if(need){
                          var elements= document.getElementsByClassName("ke-edit-iframe")
                          for (var i = 0, len = elements.length; i < len; i++) {
                              console.log(elements[i].contentWindow.document.getElementsByClassName('article-content'))
                              //2.在iframe中获取body与span
                              var item_span = elements[i].contentWindow.document.getElementsByClassName('kindeditor-ph')
                              var item_body = elements[i].contentWindow.document.getElementsByClassName('article-content')
                              console.log(item_body[0].childNodes.length)
                              if(item_body[0].childNodes.length == 0 &&i == len-1){
                        //3.去除span的文字内容
                                  item_span[0].textContent = ""
                                  item_body[0].innerHTML = commitStr
                    }
            }
                }

        }
getCommitId();
})();