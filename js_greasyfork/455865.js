// ==UserScript==
// @name         Anki-Connect-addNotes
// @namespace    */*
// @version      0.1
// @description  本插件通过向页面注入一个功能按钮，来调用Anki-Connect向Anki中添加卡片。
// @author       otc
// @match        */*
// @icon         *
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455865/Anki-Connect-addNotes.user.js
// @updateURL https://update.greasyfork.org/scripts/455865/Anki-Connect-addNotes.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function addNotes(){
        var mdUrl = ['<a href="',document.URL,'">',document.title,'</a>'].join("")
        var data = JSON.stringify({
            "action": "addNotes",
            "version": 6,
            "params": {
                "notes": [
                    {
                        "deckName": "Default",
                        "modelName": "Basic",
                        "fields": {
                            "Front": mdUrl
                        },
                        "tags": []
                    }
                ]
            }
        });
        GM_xmlhttpRequest({
            method: "post",
            url: 'http://127.0.0.1:8765',
            data: data,
            headers: { "Content-Type":"application/json" },
            onload: function(r) {
                console.log("添加至Anki成功！",r);
            }
        });
    }

    function addButton(){
        let Container = document.createElement('div');
        Container.id = "add-notes-container";
        Container.style.position="fixed"
        Container.style.left="0"
        Container.style.top="0"
        Container.style['z-index']="999999"
        Container.innerHTML =`<button id="addNotes" style="position:absolute; left:30px; top:20px">
  Add2Anki
</button>
`

        document.body.appendChild(Container);

        let button = document.getElementById("addNotes");
        button.onclick=addNotes;
    }
    addButton();
})();