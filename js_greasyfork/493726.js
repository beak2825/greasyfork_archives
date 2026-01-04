// ==UserScript==
// @name         Vidload
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Download vk video
// @author       SuperG
// @match        https://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493726/Vidload.user.js
// @updateURL https://update.greasyfork.org/scripts/493726/Vidload.meta.js
// ==/UserScript==

(function() {
    console.log('VIDLOAD started');

    function processVideos() {

        var videos = document.querySelectorAll(".mv_actions_block");

        videos.forEach(function(vid){

            if (!vid.closest('.vidload-container')) {
                var container = document.createElement("div");
                container.classList.add("vidload-container");

                const btnTemplate = document.createElement("button");
                btnTemplate.innerHTML = 'Download';
                btnTemplate.addEventListener('click', function() {
                    findVideoLinks(vid);
                });

                container.appendChild(vid.cloneNode(true));
                container.appendChild(btnTemplate);
                vid.parentNode.replaceChild(container, vid);
            }
        });
    }

    // callback for MutationObserver
    function handleMutation(mutationsList, observer) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                processVideos();
            }
        }
    }

    var observer = new MutationObserver(handleMutation);

    observer.observe(document.body, { childList: true, subtree: true });

    processVideos();

    var style = document.createElement('style');
    style.textContent = `
        .vidload-container {
            position: relative;
        }
        .vidload-container button {
            position: absolute;
            top: -10px;
            left: 10px;
            z-index: 9999;
        }
    `;
    document.head.appendChild(style);

    function findVideoLinks(vid){
        var currentURL = window.location.href;
        let url = currentURL.split('=')[1];

        var xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);

        xhr.onload = function() {
        if (xhr.status === 200) {
            var responseData = xhr.responseText;

            var regex = /"url\d+":\s*"(.*?)"/g;

            var matches = responseData.match(regex);

            const overlay = document.createElement('div');
            overlay.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0, 0, 0, 0.7);z-index: 999;`;

            const info = document.createElement('div');
            info.style.cssText = `color:white;position:fixed;top:30%;left:50%;transform:translate(-50%,-50%);z-index:9999;text-align:center;font-size:1.5em;`
            info.innerText = `Видео доступно для скачивания`;

            const close = document.createElement('button');
            close.style.cssText = `color:white;position:fixed;top:10%;left:90%;transform:translate(-50%,-50%);z-index:9999;text-align:center;font-size:3em;`
            close.innerText = `X`;
            close.onclick = closeall;

            const ress=['240','360','480','720'];
            var i=45;
            matches.forEach(function(url){
                ress.forEach(function(res){
                    if (url.includes(res)){
                        const link = document.createElement('a');
                        link.style.cssText = `color:white;position:fixed;top:${i}%;left:50%;transform:translate(-50%,-50%);z-index:9999;text-align:center;font-size:1.5em;`
                        link.href = url.slice(10,-1);
                        link.text = res+'p';
                        link.classList.add('downlink');
                        link.onclick = closeall;

                        document.body.appendChild(link);

                        i+=10;
                    };
                });
            });

            function closeall(){
                overlay.parentNode.removeChild(overlay);
                info.parentNode.removeChild(info);
                close.parentNode.removeChild(close);

                var links = document.querySelectorAll(".downlink");
                links.forEach(function(link){
                    link.parentNode.removeChild(link);
                });
            };

            document.body.appendChild(overlay);
            document.body.appendChild(info);
            document.body.appendChild(close);

        }
    };
    xhr.send();
    }
})();