// ==UserScript==
// @name        RM_PasteImages
// @namespace   Paste Them All!!!
// @match       http://redmine.mango.local/*
// @grant       none
// @version     2.2
// @author      -
// @description Paste images from clipboard directly to RM (ctrl+v) 
// @downloadURL https://update.greasyfork.org/scripts/407428/RM_PasteImages.user.js
// @updateURL https://update.greasyfork.org/scripts/407428/RM_PasteImages.meta.js
// ==/UserScript==

function insertText( txtarea, text ) {
      var start = txtarea.selectionStart;
      var end = txtarea.selectionEnd;
      var finText = txtarea.value.substring(0, start) + text + txtarea.value.substring(end);
      txtarea.value = finText;
      txtarea.focus();
      txtarea.selectionEnd = ( start == end )? (end + text.length) : end ;
}

function pasteHandler(e) {
      if (e.clipboardData) {
      var items = e.clipboardData.items;
      if (items) {
         for (var i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
                var blob = items[i].getAsFile();
                var fd = new FormData();
                var formData = new FormData();
                formData.append("uploadedFile", blob, 'file.png');
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "http://screenshots.pase80.myjino.ru");
                xhr.send(formData);
                xhr.onload = function() {
                    insertText(e.target, '!http://screenshots.pase80.myjino.ru/'+xhr.response+'!'+"\r\n");
                };
            }
         }
      }
   } 
}

window.addEventListener("paste", pasteHandler);
