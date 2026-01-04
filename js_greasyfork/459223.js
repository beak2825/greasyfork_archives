// ==UserScript==
// @name         Haiwaikan Playlist
// @namespace    http://tampermonkey.net/
// @version      0.5.6
// @description  Add playlist
// @author       pb8DvwQkfRR
// @license      MIT
// @match        https://haiwaikan.com/index.php/vod/play/id/*
// @match        https://haiwaikan.com/index.php/vod/detail/id/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=haiwaikan.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @connect      temp.sh
// @downloadURL https://update.greasyfork.org/scripts/459223/Haiwaikan%20Playlist.user.js
// @updateURL https://update.greasyfork.org/scripts/459223/Haiwaikan%20Playlist.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var titleEl = document.querySelector('.stui-content__detail .title, .stui-player__detail .title');
    var m3utitle = titleEl.innerHTML.replace(/<[^>].*>/g, '');
    var m3uheader = `#EXTM3U\n#EXT-X-PLAYLIST-TYPE:VOD\n#EXT-X-VERSION:4\n`;
    var m3uinfo = `#EXTALB:${m3utitle}`;
    var m3uep = `#EXTINF:-1, ${m3utitle}`;
    var ct = Array.from(document.querySelectorAll('.copy_text'));
    var m3ulinks = ct.map(el => {
        var m3ulink = el.querySelector('.hidden-xs').textContent.replace('$', '');
        var desp = el.textContent.split('$')[0];
        return `${m3uep}${desp}\n${m3ulink}`;
    });
    var m3uoutput = `${m3uheader}${m3uinfo}\n${m3ulinks.join('\n')}\n#EXT-X-ENDLIST`;
    var eps = `(${ct[0].textContent.split('$')[0]}${ct.length > 1 ? `-${ct[ct.length-1].textContent.split('$')[0]}` : ''})`;
    var fileName = `${m3utitle}${eps}.m3u`;

    var isMobile = window.matchMedia("(any-pointer:coarse)").matches;
    var playlistDiv = document.querySelector('#playlist');
    var stateDiv = document.createElement("div");
    stateDiv.id = "stateDiv";

    var footDiv = document.querySelector('.stui-foot');
    var m3uDiv = document.createElement("pre");
    m3uDiv.textContent = m3uoutput;
    m3uDiv.style.whiteSpace = "pre-wrap";
    m3uDiv.style.wordBreak = "break-word";
    m3uDiv.style.display = "flex";
    m3uDiv.style.flexDirection = "column";
    m3uDiv.style.alignItems = "center";
    m3uDiv.style.marginTop = "10px";

    var buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";

    var downloadButton = document.createElement("button");
    downloadButton.id = "downloadButton";
    downloadButton.textContent = "下载列表";
    downloadButton.style.backgroundColor = "#4CAF50";
    downloadButton.style.color = "white";
    downloadButton.style.margin = "10px";
    downloadButton.style.padding = "10px 15px";
    downloadButton.style.borderRadius = "4px";

    downloadButton.onclick = function() {
        var blob = new Blob([m3uoutput], {type: "application/mpegurl"});
        var link = document.createElement("a");
        link.download = fileName;
        link.href = URL.createObjectURL(blob);
        link.click();
        downloadButton.textContent = "已下载!";
        var resetButton = function() {
            downloadButton.textContent = "下载列表";
        }
        setTimeout(resetButton, 3000);
    }

    var copyButton = document.createElement("button");
    copyButton.id = "copyButton";
    copyButton.textContent = "复制";
    copyButton.style.backgroundColor = "#4CAF50";
    copyButton.style.color = "white";
    copyButton.style.margin = "10px";
    copyButton.style.padding = "10px 15px";
    copyButton.style.borderRadius = "4px";

    copyButton.addEventListener("click", function() {
        if(isMobile) {
            var textArea = document.createElement("textarea");
            textArea.value = m3uoutput;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
        } else {
            GM_setClipboard(m3uoutput);
        }
        copyButton.textContent = "已复制!";
        var resetButton = function() {
            copyButton.textContent = "复制";
        }
        setTimeout(resetButton, 3000);
    });

    var sendButton = document.createElement("button");
    sendButton.id = "sendButton";
    sendButton.textContent = "发送 temp.sh";
    sendButton.style.backgroundColor = "#4CAF50";
    sendButton.style.color = "white";
    sendButton.style.margin = "10px";
    sendButton.style.padding = "10px 15px";
    sendButton.style.borderRadius = "4px";

    sendButton.addEventListener("click", function() {
        var resetButton = function() {
            sendButton.textContent = "发送 temp.sh";
        }
        sendButton.disabled = true;
        sendButton.style.cursor = 'not-allowed';
        sendButton.style.backgroundColor = "gray";
        var formData = new FormData();
        formData.append('uploadfile', new Blob([m3uoutput], { type: 'application/mpegurl' }), fileName);
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://temp.sh/upload",
            data: formData,
            timeout: 5000,
            ontimeout: function () {
                sendButton.textContent = "请求超时";
            },
            onload: function(response) {
                var url = response.responseText
                stateDiv.innerHTML = `
                <div style="padding: 15px; border-bottom: 1px solid #eee"><a href=${url}>${fileName}</a></div>
                <div id="openin" style="display: flex; margin-top: 20px; justify-content: center; padding-bottom: 15px; gap: 1rem">
                <a href="iina://weblink?url=${url}"><img style="width: 3rem" src="https://npm.elemecdn.com/alist-web@latest/dist/images/iina.webp"></a>
                <a href="potplayer://${url}"><img style="width: 3rem" src="https://npm.elemecdn.com/alist-web@latest/dist/images/potplayer.webp"></a>
                <a href="vlc://${url}"><img style="width: 3rem" src="https://npm.elemecdn.com/alist-web@latest/dist/images/vlc.webp"VLC</a>
                <a href="nplayer-${url}"><img style="width: 3rem" src="https://npm.elemecdn.com/alist-web@latest/dist/images/nplayer.webp"></a>
                <a href="infuse://x-callback-url/play?url=${url}"><img style="width: 3rem" src="https://npm.elemecdn.com/alist-web@latest/dist/images/infuse.webp"></a>
                <a href="aptv://add?url=${url}"><img style="width: 3rem" src="https://is4-ssl.mzstatic.com/image/thumb/Purple116/v4/ed/70/8d/ed708ddf-7343-2ccb-e391-2701118ee4ce/AppIcon-0-85-220-4-2x.png/217x0w.webp"></a>
                </div>
                `;
                document.getElementById("stateDiv").scrollIntoView({
                    behavior: 'smooth',
                    block: "center"
                });
                GM_setClipboard(url);
                stateDiv.style.textAlignLast = "center";
                stateDiv.style.marginTop = "30px";
                stateDiv.style.backgroundColor = "#fff";
                stateDiv.style.borderRadius = "5px";
                stateDiv.style.border = "1px solid #eee";
                stateDiv.style.boxShadow = "0 5px 10px #eee";
                function updateStateDiv() {
                    var isLandscape = window.innerWidth >= 768;
                    stateDiv.style.borderRadius = isLandscape ? "5px" : "0";
                    stateDiv.style.border = isLandscape ? "1px solid #eee" : "0";
                    stateDiv.style.boxShadow = isLandscape ? "0 5px 10px #eee" : "none";
                }
                window.addEventListener("resize", updateStateDiv);
                window.addEventListener("load", updateStateDiv);
            },
            onreadystatechange: function() {
                if (this.readyState === XMLHttpRequest.DONE) {
                    sendButton.textContent = "已复制 URL!";
                } else {
                    sendButton.textContent = "发送中...";
                }
            },
            onloadend: function() {
                setTimeout(resetButton, 3000);
                sendButton.disabled = false;
                sendButton.style.backgroundColor = "#4CAF50";
                sendButton.style.cursor = '';
            }
        })
    });

    function updateButtonContainer() {
        var isLandscape = window.innerWidth >= 768;
        buttonContainer.appendChild(copyButton);
        buttonContainer.appendChild(downloadButton);
        buttonContainer.appendChild(sendButton);
        buttonContainer.style.transform = isLandscape ? "translateY(50%)" : "";
        buttonContainer.style.position = isLandscape ? "fixed" : "";
        buttonContainer.style.flexDirection = isLandscape ? "column" : "";
        buttonContainer.style.right = isLandscape ? `${window.innerWidth * 0.03}px` : "";
        buttonContainer.style.minWidth = isLandscape ? "150px" : "";
        buttonContainer.style.maxWidth = isLandscape ? "150px" : "";
        buttonContainer.style.bottom = isLandscape ? "50%" : "";
        buttonContainer.style.transition = isLandscape ? "all 0.3s" : "";
        buttonContainer.style.opacity = isLandscape ? "0.8" : "";
        buttonContainer.style.backgroundColor = isLandscape ? "rgba(255, 255, 255, 0.4)" : "";
        buttonContainer.style.border = isLandscape ? "1px solid rgba(204, 204, 204, 0.4)" : "";
        buttonContainer.style.borderRadius = isLandscape ? "5px" : "";
        buttonContainer.addEventListener("mouseout", function(){
            this.style.opacity = isLandscape ? "0.8" : "";
        });
        buttonContainer.addEventListener("mouseover", function(){
            this.style.opacity = isLandscape ? "1" : "";
        });
    }
    if (document.readyState == 'complete') {
        updateButtonContainer();
    }
    window.addEventListener("load", updateButtonContainer);
    window.addEventListener("resize", updateButtonContainer);
    footDiv.parentNode.insertBefore(m3uDiv, footDiv);
    m3uDiv.insertBefore(buttonContainer, m3uDiv.firstChild);
    playlistDiv.parentNode.insertBefore(stateDiv, playlistDiv);
})();

