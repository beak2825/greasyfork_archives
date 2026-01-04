// ==UserScript==
// @name         Saratov GASO Archive Images Saver List&Book
// @namespace    Alexander V.
// @license      MIT
// @version      0.5
// @description  Открывает возможность сохранить картинки из архивного портала ГАСО
// @author       Alexander V.
// @match        https://archivesaratov.ru/archive1/unit*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archivesaratov.ru
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/515730/Saratov%20GASO%20Archive%20Images%20Saver%20ListBook.user.js
// @updateURL https://update.greasyfork.org/scripts/515730/Saratov%20GASO%20Archive%20Images%20Saver%20ListBook.meta.js
// ==/UserScript==
function ReplaceContentInContainer(selector, content) {
  var nodeList = document.querySelectorAll(selector);
  for (var i = 0, length = nodeList.length; i < length; i++) {
     nodeList[i].innerHTML = nodeList[i].innerHTML + content;
  }
}
function save_image(src) {
      var link = document.createElement('a');
      link.href = "https://archivesaratov.ru" + src;
      link.download = src.slice(src.lastIndexOf ("fod"),src.length) + ".jpg";
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
}

function save_images(i,src,start_number) {
  setTimeout(function() {
      var link = document.createElement('a');
      var list = parseInt(i) + parseInt(start_number);
      //alert ("https://archivesaratov.ru" + src + list);
      link.href = "https://archivesaratov.ru" + src + list;
      link.download = src.slice(src.lastIndexOf ("fod"),src.length) + list + ".jpg";
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
  }, 400 * i);
}

(function() {
    'use strict';
    if (document.querySelectorAll(".mt-3").length == 0)
    {
        if (document.getElementById("viewer") !== null)
        {
            ReplaceContentInContainer(".mb-3", "<button type='button' id='save-btn' data-id='0' data-archive='2' class='btn btn-primary additem-btn ml-3'> <i class='fas fa-briefcase' title='Скачать лист'></i> <span>Скачать лист</span></button><button type='button' id='save-btn-all' data-id='0' data-archive='3' class='btn btn-primary additem-btn ml-3'> <i class='fas fa-briefcase' title='Скачать дело'></i> <span>Скачать дело</span></button>");

            const $btn = document.querySelector('#save-btn');
            $btn.onclick = function() {
                var src = document.getElementById("viewer").getElementsByTagName("img")[0].getAttribute("src");
                save_image(src); }

            const $btn_all = document.querySelector('#save-btn-all');
            $btn_all.onclick = function() {
            var text_list = document.querySelector("#page-to").value;
            var max_list = text_list.slice(text_list.lastIndexOf ("из")+3,text_list.length);

            var result1 = prompt('Введите номер первого листа',1);
            var result2 = prompt('Введите номер последнего листа',max_list);

            var src = document.getElementById("viewer").getElementsByTagName("img")[0].getAttribute("src");
            var src_complete = src.slice (0,src.lastIndexOf ("&n=")+3);
            for (let i = 0; i <= parseInt(result2)-parseInt(result1); i++) {
               save_images(i,src_complete,parseInt(result1));}
            }
        }

    };
})();