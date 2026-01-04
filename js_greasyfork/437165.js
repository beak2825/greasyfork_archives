// ==UserScript==
// @name         2ch/5ch Image Inserter
// @namespace    https://gist.github.com/NO-ob/ed240ac8ccdb4a2775eb0857968c50e4/raw/5chImageInserter.user.js
// @homepage     https://gist.github.com/NO-ob/mangadex-scripts
// @version      0.5
// @description  Embeds images on 2/5chan reader sites
// @author       NO_ob
// @include      */r/*/*/*
// @include      */test/read.cgi/*/*
// @include      */read.php/*/*
// @include      */log/*/*/*/
// @include      *.5ch.net/*/*
// @include      *.2ch.sc/test/read.cgi/*/*
// @include      none
// @include      document-idle
// @icon         https://5ch.net/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/437165/2ch5ch%20Image%20Inserter.user.js
// @updateURL https://update.greasyfork.org/scripts/437165/2ch5ch%20Image%20Inserter.meta.js
// ==/UserScript==
var useHREF = false;
var insertRunning = false;
var urlRegex;
(function() {
    'use strict';
    (new MutationObserver(check)).observe(document, {childList: true, subtree: true});
})();

function check(changes, observer) {
    if (!document.querySelector("div#scriptRan")) {
        if((document.querySelectorAll("dd > a").length > 0) || (document.querySelectorAll("div.res > a").length > 0) || (document.querySelectorAll("span.escaped > a").length > 0)|| (document.querySelectorAll("div.threadview_response_body > a").length > 0)) {
            if(!insertRunning){
                imageInsert();
            }
        }
    }
}
function imageInsert(){
    insertRunning = true;
    let style = `.scriptImage {max-width: 100%;max-height: 100vh;width: auto;margin: auto;}`
        let styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = style;
        document.head.appendChild(styleSheet);
    let linkElements = null;
    if (document.querySelectorAll("dd > a").length > 0){
        replaceTrimmedLinksInPosts("dd");
        linkElements = document.querySelectorAll("dd > a");
    } else if (document.querySelectorAll("div.res > a").length > 0) {
        replaceTrimmedLinksInPosts("div.res");
        linkElements = document.querySelectorAll("div.res > a");
    } else if (document.querySelectorAll("span.escaped > a").length > 0){
        replaceTrimmedLinksInPosts("span.escaped");
        useHREF = true;
        urlRegex = new RegExp("(?:[\?]+)(https?:\/\/[a-zA-Z0-9-_.\/+%?]+)","gm");
        linkElements = document.querySelectorAll("span.escaped > a");
    } else if (document.querySelectorAll("div.threadview_response_body > a").length > 0){
        replaceTrimmedLinksInPosts("div.threadview_response_body");
        useHREF=true;
        linkElements = document.querySelectorAll("div.threadview_response_body > a");
    }
        console.log("Elements Found:  " + linkElements.length);
        for (let i = 0; i < linkElements.length ; i++){
            if (i==0){
                let elem = document.createElement("div");
                elem.setAttribute("id", "scriptRan");
                linkElements[i].parentElement.appendChild(elem);
            }
            let url = useHREF ? linkElements[i].href : linkElements[i].innerHTML;
            if (urlRegex != null){
                let matches = [...url.matchAll(urlRegex)];
                if (matches.length > 0){
                url = matches[0][1];
                }
            }
            if (url.includes(":orig")){
                url = url.replace(":orig","");
            }
            if (isImageURL(url)){
                let tmpElem;
                console.log("Inserting: " + url);
                if(linkElements[i].innerHTML.toLowerCase().endsWith(".mp4")){
                    tmpElem = document.createElement("video");
                    tmpElem.setAttribute("src",url);
                    tmpElem.setAttribute("class","scriptImage");
                    tmpElem.controls = true;
                } else {
                    tmpElem = document.createElement("img");
                    tmpElem.setAttribute("src",url);
                    tmpElem.setAttribute("class","scriptImage");
                }
                console.log(linkElements[i].innerHTML);
                linkElements[i].parentNode.replaceChild(tmpElem, linkElements[i]);
            } else {
                console.log("Skipping: " + url);
            }
        }
        console.log("Insert done!");
        insertRunning = false;
}

function isImageURL(url){
    return url.toLowerCase().includes(".png")||
           url.toLowerCase().includes(".jpg")||
           url.toLowerCase().includes(".jpeg")||
           url.toLowerCase().includes(".mp4")||
           url.toLowerCase().includes(".gif");
}

function replaceTrimmedLinksInPosts(postBodySelector){
document.querySelectorAll(postBodySelector).forEach((textSpan) => {
        let inner = textSpan.innerHTML;
 		let re = new RegExp("(?<!h)(ttps?:\/\/[a-zA-Z0-9-_.\/+%?]+)", 'gm');
        let matches = [...inner.matchAll(re)];
        console.log(matches);
        matches.forEach((url) => {
            console.log("replacing " + url[0] + " in " + inner);
            inner = inner.replace(url[0],'<a class="'+(isImageURL(url[0])? 'image':'reply_link')+'" href="h'+ url[0]+'" target="_blank">h'+url[0]+'</a>');
        });
        textSpan.innerHTML = inner;
        });
}