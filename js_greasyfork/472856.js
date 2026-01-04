// ==UserScript==
// @name         NomenChat/Box3
// @namespace    https://github.com/helloyork
// @version      0.1
// @description  NomenChat/Box3浮窗
// @author       Nomen
// @match        https://box3.codemao.cn/e/*
// @icon         https://github.com/helloyork/lib/blob/main/Nomen.png?raw=true
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472856/NomenChatBox3.user.js
// @updateURL https://update.greasyfork.org/scripts/472856/NomenChatBox3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let main = (async()=>{
        if(!window || !document)return;
        function loadSource(src){
            return new Promise(r=>{
                fetch(src).then(v=>v.text()).then(v=>r(v));
            })
        }
        async function initButton(){
            let b = document.createElement("div");
            b.innerHTML=await loadSource("https://raw.githubusercontent.com/helloyork/lib/main/Box3/nomenchat.html");
            document.body.appendChild(b);
        };
        await initButton();
        var button = document.getElementById('circle-button');
        var iframeContainer = document.getElementById('iframe-container');
        var robotIcon = document.getElementById('robot-icon');
        var closeIcon = document.getElementById('close-icon');

        button.addEventListener('click', function () {
            if (iframeContainer.classList.contains('show')) {
                iframeContainer.classList.remove('show');
                closeIcon.style.display = 'none';
                robotIcon.style.display = 'block';
                iframeContainer.addEventListener('transitionend', function() {
                    if (!iframeContainer.classList.contains('show')) {
                        iframeContainer.style.display = "none";
                    }
                }, {once: true});
            } else {
                iframeContainer.style.display = "block";
                setTimeout(function(){
                    iframeContainer.classList.add('show');
                },0);
                closeIcon.style.display = 'block';
                robotIcon.style.display = 'none';
            }
        });
    });
    setTimeout(main,2000)
})();