// ==UserScript==
// @name        [ 2 in 1 ] The Best Youtube Downloader and End screen remover, [Download: 320Kbps MP3 / 4K MP4]
// @description Download any video and/or audio from youtube.com in HIGH Quality and remove annoying end-screens
// @homepage    https://products.agarmen.com/
// @namespace   https://agarmen.com/
// @version     1.7
// @date        2021-03-01
// @author      #EMBER
// @compatible  chrome
// @compatible  firefox
// @compatible  opera
// @compatible  safari
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @match       *://*.youtube.com/*
// @match       *://*.yt-download.org/*
// @downloadURL https://update.greasyfork.org/scripts/422747/%5B%202%20in%201%20%5D%20The%20Best%20Youtube%20Downloader%20and%20End%20screen%20remover%2C%20%5BDownload%3A%20320Kbps%20MP3%20%204K%20MP4%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/422747/%5B%202%20in%201%20%5D%20The%20Best%20Youtube%20Downloader%20and%20End%20screen%20remover%2C%20%5BDownload%3A%20320Kbps%20MP3%20%204K%20MP4%5D.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let intvl, i = 0,
        loop = 1E3;
    document.body.onload = addConfirm;
    let isYoutube = false;
    const downUrl = "https://yt-download.org/api/button/mp";
    const audioDownUrl = "https://ytmp3x.com/";
        setInterval(function() {
            if ((document.getElementById("polymer-app") || document.getElementById("masthead") || window.Polymer) && window.location.href.indexOf("watch?v=") > 0)
            {
                isYoutube = true;
                callYoutube();
            }
            if(window.location.href.indexOf("yt-download") > 0)
                callExternal();
        }, loop);

    function callYoutube()
    {
      if(document.getElementById("downloadBtn") == null)
         addDownloadBtn();
      if(document.getElementById("removedess") == null)
         addESR();
      if(document.getElementById("removedess") != null)
         removeEndScreens("ytp-ce-element");
    }

    function callExternal()
    {
     if(document.getElementById("adblockalert") == null)
         adBlockAlert();
    }

    function adBlockAlert()
    {
        let el = document.createElement("h1");
        el.setAttribute("id", "adblockalert");
        el.style.textAlign = "center";
        el.style.fontWeight = "bold";
        el.style.fontSize = "22px";
        el.innerHTML = "*Attention: This is an external website and the contained ads in this site are not related to the script! Please use "+
        "<a target=\"_blank\" style=\"color:blue\" href=\"https://adblockplus.org/\">AdBlock Plus</a> or any other ad blockers to download files without seeing ads!";
        let rclass = document.getElementsByClassName('antialiased')[0];
        rclass.insertBefore(el, document.getElementsByClassName('hero')[0]);
    }

    function removeEndScreens(className) {
        let elements = document.getElementsByClassName(className);
        let ress = document.getElementById("removedess");
        while (elements.length > 0) {
            if (elements[0].parentNode.removeChild(elements[0])) {
                i++;
                ress.innerHTML = '<span title="Total removed EndScreens: ' + i + '">[' + i + ']</span>';
                console.log("Removed ES Count: " + i);
            }
        }
    }

     function DownloadConfirm(cond) {
            let link = downUrl + (cond ? "3" : "4");
            link += "?url="+ window.location.href;
            window.open(link, '_blank');
            return false;
        }

   function generateButton(text, color, eventListenerValue, titleText, isLeft) {
    const btn = document.createElement("button");
    btn.style.padding = "10px 20px";
    btn.style.backgroundColor = color;
    btn.style.color = "#fff";
    btn.style.border = "none";
    btn.style.borderRadius = "10px";
    btn.style.position = "absolute";
    btn.style.cursor = "pointer";
    btn.style.fontSize = "16px";
    btn.style.fontWeight = "bold";
    btn.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
    btn.innerText = text;
    btn.title = titleText;
    btn.addEventListener('click', () => { DownloadConfirm(eventListenerValue); });

    if (isLeft) {
        btn.style.left = "6px";
        btn.style.bottom = "6px";
    } else {
        btn.style.right = "6px";
        btn.style.bottom = "6px";
    }
       return btn;
}


    function extClicked(e)
    {
        let link = audioDownUrl + getVidId(window.location.href);
        window.open(link);
        e.preventDefault();
        return false;
    }

    function addConfirm(){
        const div = document.createElement("div");
        const br = document.createElement("br");
        div.id = "confirmDiv";
        div.setAttribute("draggable", "true");
        div.style.display = "none";
        div.style.textAlign = "center";
        div.style.left = "50%";
        div.style.top = "50%";
        div.style.transform = "translate(-50%, -50%)";
        div.style.padding = "20px";
        div.style.zIndex = "500";
        div.style.position = "fixed";
        div.style.background = "linear-gradient(135deg, #659df7, #6e5df5)";
        div.style.borderRadius = "20px";
        div.style.boxShadow = "0 0 20px rgba(0, 0, 0, 0.3)";
        div.style.width = "300px";
        div.style.height = "150px";
        div.style.fontFamily = "Arial, sans-serif";
        div.style.color = "#fff";
        div.style.fontSize = "16px";
        div.style.lineHeight = "1.5";
        div.style.overflow = "hidden";
        makeElementDraggable(div);

        const h1 = document.createElement("h1");
        h1.innerText = "Download as";
        h1.id = "downloadTitle";
        h1.style.textAlign = "center";

        const ext = document.createElement("a"); // Create an anchor element
        ext.setAttribute("target", "_blank");
        ext.setAttribute("style", "text-decoration:none;");
        ext.setAttribute("href", "#");
        ext.setAttribute("title", "Service provider: ytmp3x.com");
        ext.textContent = "Cut and Download"; // Set text content

        ext.style.fontSize = "14px";
        ext.style.color = "#cfc7c6"; // Blue color
        ext.style.cursor = "pointer";

        ext.addEventListener('click', function(e) {
            extClicked(e);
        });

        // Hover effect
        ext.addEventListener('mouseenter', function() {
            this.style.textDecoration = "underline";
        });

        ext.addEventListener('mouseleave', function() {
            this.style.textDecoration = "none";
        });
        const closeBtn = document.createElement("span");
        closeBtn.style.marginTop = "2";
        closeBtn.style.marginRight = "2";
        closeBtn.style.float = "right";
        closeBtn.innerText = "✖";
        closeBtn.style.fontWeight = "bold";
        closeBtn.style.color = "red";
        closeBtn.title = "Close switcher";
        closeBtn.style.fontSize = "17px";
        closeBtn.style.cursor = "pointer";
        closeBtn.addEventListener('click', ()=>{div.style.display = 'none';});

        const btnMp3 = generateButton("MP3","#cccc00", true, "Download as audio", true);
        const btnMp4 = generateButton("MP4","#4d8a54", false, "Download as video", false);

        div.appendChild(closeBtn);
        div.appendChild(h1);
        div.appendChild(btnMp3);
        div.appendChild(br);
        div.append(ext);
        div.appendChild(btnMp4);

        const content = document.getElementById("content");
        const secDiv = document.getElementById("masthead-container");
        if(content != null && div != null && secDiv != null)
        content.insertBefore(div, secDiv);
    }

    function changeText() {
        let ele = document.getElementById("removedess");
        let size = "";
        if (ele.style.fontSize === "14px")
            size = "28px";
        else
            size = "14px";
        ele.style.fontSize = size;
    }

    function clickDownload() {
        let btn = $("#downloadBtn");
        if (btn != null && !clicked)
            btn.click();
        clicked = false;
    }

    function addESR() {
        console.log("ESR added");
        let el = document.createElement("span");
        el.id = "removedess";
        el.style.textAlign = "center";
        el.style.cursor = "pointer";
        el.style.color = "#00FFFF";
        el.style.fontSize = "28px";
        el.addEventListener("click", changeText);
        const downloadBtn = document.getElementById("downloadBtn");
        if(downloadBtn !== null)
            document.getElementById("owner").insertBefore(el, downloadBtn);
    }

     function writeTitle() {
            let videohref = document.getElementById("videohref");
            if (window.location.href != downUrl + getVidId()) {
                videohref.title = getVideoName();
                videohref.href = downUrl + getVidId();
            }
            return false;
        }

        function getVideoName() {
            let title = null;
            let subStart = 0;
            let ret = null;
            title = document.getElementsByTagName("title")[0].innerHTML;
            ret = (title.length > 0) ? title.substring(subStart, title.length - 10) : "video";
            return getLang() + " " + ret;
        }

        function getLang() {
            let tx = "Download";
            switch (document.documentElement.lang) {
                case "en":
                    tx = "Download";
                    break;
                case "ru":
                    tx = "Скачать";
                    break;
                case "az":
                    tx = "Yüklə";
                    break;
            }
            return tx;
        }

        function getVidId(url) {
            let video_id = window.location.search.split('v=')[1];
            let ampPosition = video_id.indexOf('&');
            if (ampPosition != -1) {
                video_id = video_id.substring(0, ampPosition);
            }
            return url ? video_id : window.location;
        }

    function actionClick(){
    let div = document.getElementById("confirmDiv");
            if(div == null)
            {
                //alert("Confirmation DIV was not loaded correctly. Initializing...");
                console.log("Confirmation DIV was not loaded correctly. Initializing...");
                addConfirm();
                actionClick();
                return;
            }
            div.style.display = (div.style.display === "none") ? "block" : "none";
    }

    function addDownloadBtn() {
        let buttonDiv = document.createElement("div");
        buttonDiv.id = "downloadBtn";
        buttonDiv.onmouseover = writeTitle;
        let btn = document.createElement("button");
        btn.id = "videohref";
        btn.innerText = "Download";
        btn.style.height = "38px";
        btn.style.backgroundColor = 'rgb(3, 235, 161)';
        btn.style.right = "10px";
        btn.style.textAlign = "right";
        btn.style.margin = "3px 3px";
        btn.style.padding = "7px 10px";
        btn.style.border = "0";
        btn.style.cursor = "pointer";
        btn.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
        btn.style.borderRadius = "20px";
        btn.style.fontFamily = "Tahoma";
        btn.title = getVideoName();
        btn.addEventListener('click', actionClick);
        buttonDiv.appendChild(btn);
        const subPanel = document.getElementById("owner");
        const subBtn = document.getElementById("subscribe-button");
        subPanel.insertBefore(buttonDiv, subBtn);
    }

    function makeElementDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        if (e.button === 2 || e.button === 1 || e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.tagName === 'SPAN') {
            // If the target of the mousedown event is a button, a, span and right mouse button, prevent dragging
            return;
        }
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
        element.style.cursor = "grabbing"; // Change cursor style when dragging starts
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        element.style.cursor = "default";
    }
}

    // Script by #EMBER
})();