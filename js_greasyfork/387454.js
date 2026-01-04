// ==UserScript==
// @name         A Gelbooru Viewer
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Adds a download button and makes thumbnails a little bigger. Make shure to add (.png, .jpeg, .jpg, etc) to the tampermonkey download whitelist
// @author       Anonymous
// @match        https://gelbooru.com/*page=post*s=list*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/387454/A%20Gelbooru%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/387454/A%20Gelbooru%20Viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...

    function setCustomStyles(){
        const customStyles = document.createElement("style");
        customStyles.innerHTML = "" +
            ".thumbnail-preview {" +
            "max-width: unset;"+
            "width: 30%;" +
            "min-height: 200px;" +
            "max-height: unset;" +
            "height: 500px;"+
            "}" +
            ".thumbnail-preview span {display: contents;}"+
            ".thumbnail-preview a {display: contents;}"+
            ".thumbnail-preview button {width: 100%; height: 25px; background-color: blue; color: white; text-decoration:none;border:none;}"+
            ".thumbnail-preview button[disabled] {background-color: gray; color: black;}"+
            ".thumbnail-preview button[data-done] {background-color: green;}"+
            ".thumbnail-preview button.secondary {background-color: gray;}"+
            ".thumbnail-preview img {"+
            "object-fit: contain;" +
            "width: 100%;" +
            "height: calc(100% - 50px);" +
            "} "+
            ".next-page-message-container {display:flex;align-items:center;width:100%;height:100px;margin:0;background-color:darkgray;} "+
            ".next-page-message-container p {width:fit-content;margin:auto;font-size:3em;}";

        document.head.appendChild(customStyles);
    }

    function parsePaginationInfo(doc){
        let currentPage,
            nextPage, nextPageUrl,
            previousPage,previousPageUrl;

        const currentPageEl = doc.querySelector(".pagination b");
        if (currentPageEl){
            currentPage = currentPageEl.innerText;
        } else {
            console.debug("cant parse current page");
        }

        const aList = Array.from(doc.querySelectorAll(".pagination a"));

        for (let i=0; i < aList.length; i++){
            const a = aList[i];
            const altText = a.getAttribute("alt");
            if (!altText) { continue }

            switch(altText){
                case "next": {
                    nextPage = altText;
                    nextPageUrl = a.href;
                    break;
                }
                case "back": {
                    previousPage = altText;
                    previousPageUrl = a.href;
                    break;
                }
            }
        }

        const alertIfNotFound = (name, value) => {
            if (!value) { console.debug( name + " was not found"); }
        }
        alertIfNotFound("nextPage", nextPage);
        alertIfNotFound("previousPage", previousPage);

        return {currentPage,
                nextPage, nextPageUrl,
                previousPage,previousPageUrl}
    }

    function parseThumbPreview(el){
        const a = el.querySelector("a");
        const img = el.querySelector("img");

        if (!a || !img){
            throw new Error("parse error " + el.outerHTML);
        }

        const thumbUrl = img.src;
        const pageUrl = a.href;

        if (!thumbUrl || !pageUrl) {
            throw new Error("parse error " + el.outerHTML);
        }

        return {thumbUrl, pageUrl}
    }

    function parseDetailPage(doc){
        let originalImageUrl = undefined;
        doc.querySelectorAll("#tag-list a").forEach(a=>{
            if (a.innerText === "Original image"){
                originalImageUrl = a.href;
            }
        });

        if (!originalImageUrl) {
            throw new Error("parse error");
        }

        return {originalImageUrl}
    }

    async function getDetailPageDoc(url){
        const response = await fetch(url, {method:"GET"});
        if (!response.ok){ throw new Error("request error", response) }
        const text = await response.text();
        return new DOMParser().parseFromString(text,"text/html");
    }

    async function downloadImage(url, saveAs=false){
        const name = url.substring(url.lastIndexOf("/")+1);

        return new Promise((resolve, reject)=>{
            GM_download({
                url,
                name,
                saveAs,
                onload: (data)=>{
                    console.debug("GM_download.onload", data);
                    resolve();
                },
                onerror: (e)=>{
                    console.debug("GM_download.onerror", e);
                    reject(e);
                }
            });
        });
    }

    async function downloadOriginalFromDetailPage(url){
        const doc = await getDetailPageDoc(url);
        console.debug("page fetched");
        const data = parseDetailPage(doc);
        console.debug("page parsed", data);

        await downloadImage(data.originalImageUrl);
        console.debug("image downloaded");
        return;

    }

    // https://stackoverflow.com/questions/1038727/how-to-get-browser-width-using-javascript-code
    function getWidth() {
        return Math.max(
            document.body.scrollWidth,
            document.documentElement.scrollWidth,
            document.body.offsetWidth,
            document.documentElement.offsetWidth,
            document.documentElement.clientWidth
        );
    }

    function getHeight() {
        return Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight,
            document.documentElement.clientHeight
        );
    }

    function openChildWindow(url,name="page",w=null,h=null) {
        // http://www.nigraphic.com/blog/java-script/how-open-new-window-popup-center-screen

        if (!w) { w = getWidth() * 0.8; }
        if (!h) { h = getHeight() * 0.8; }

        const dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
        const dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

        const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        const left = ((width / 2) - (w / 2)) + dualScreenLeft;
        const top = ((height / 2) - (h / 2)) + dualScreenTop;
        const windowref = window.open(url, name, `width=${w},height=${h},top=${top},left=${left},resizable,location=no,toolbar=no,menubar=no,status=no,titlebar=0`);
    }


    function setOnScrollBottomHandler(handler){
        window.onscroll = function(e) {
            let pageHeight=document.documentElement.offsetHeight,
                windowHeight=window.innerHeight,
                scrollPosition=window.scrollY || window.pageYOffset || document.body.scrollTop + (document.documentElement && document.documentElement.scrollTop || 0);

            if (pageHeight*0.98 <= (windowHeight+scrollPosition)) {
                console.debug('bottom reached');
                handler(e);
            }
        };
    }

    function addButtons(){
        document.querySelectorAll(".thumbnail-preview").forEach(el=>{
            const item = parseThumbPreview(el);

            const button = document.createElement("button");
            button.innerText = "download";
            button.addEventListener("click", async e=> {
                try{
                    button.setAttribute("disabled","disabled");
                    button.innerText = "downloading..."
                    await downloadOriginalFromDetailPage(item.pageUrl);
                    button.removeAttribute("disabled");
                    button.dataset.done=true;
                    button.innerText = "done";
                }
                catch(e) {
                    button.innerText = "error";
                    console.error(e);
                }

            });

            const openPageButton = document.createElement("button");
            openPageButton.classList.add("secondary");
            openPageButton.innerText = "open details";
            openPageButton.onclick = (e) => {
                e.preventDefault();
                openChildWindow(item.pageUrl, "Detail");
            }

            el.appendChild(button);
            el.appendChild(openPageButton);
        });
    }

    function addLoadOnScrollBottom(){
        const pagination = parsePaginationInfo(document);

        if (pagination.nextPage) {
            const nextPageMessageContainer = document.createElement("footer");
            const nextPageMessageEl = document.createElement("p");
            nextPageMessageEl.innerText = "loading next page";
            nextPageMessageContainer.classList.add("next-page-message-container");
            nextPageMessageContainer.appendChild(nextPageMessageEl);
            document.body.appendChild(nextPageMessageContainer);

            // Hide lasts br to show next page message sooner
            const containerPushBr = Array.from(document.querySelectorAll(".contain-push br"));
            let count = 0, limit=6;
            for (let i=containerPushBr.length - 1;i >= 0 && count < limit ;i--){
                containerPushBr[i].style.display = "none";
                count++;
            }

            setOnScrollBottomHandler(e=>{window.location.replace(pagination.nextPageUrl)})
        }
    }

    function init(){
        setCustomStyles();
        addButtons();
        addLoadOnScrollBottom();
    }

    init();

})();