// ==UserScript==
// @name         tumblr favs
// @namespace    http://tampermonkey.net/
// @version      0.1
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @description  download your tumblr likes by visiting your likes- automatically scrolls down and downloads all urls one after the other
// @author       You
// @match        https://www.tumblr.com/likes
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/375517/tumblr%20favs.user.js
// @updateURL https://update.greasyfork.org/scripts/375517/tumblr%20favs.meta.js
// ==/UserScript==


function direct_download(url) {
    var filename = url.match('[^/]*$')[0];
    var arg = { url: url, name: filename };
    //console.log(arg);
    GM_download(arg);
}



let todoSrc = {}
function rememberSrc(url){
    if (!todoSrc[url] && todoSrc[url] !== 1){
        todoSrc[url] = 0
        console.log("adding  url: ...", url.substr(-20));
    }else {
        console.log("NOT add url: ...", url.substr(-20), todoSrc[url], url);
    }
}

function doDownloads(){

    console.log("downloading?")
    Object.keys(todoSrc).forEach(
        (k) => {
            if (todoSrc[k] === 0){ // not done yet
                console.log("downloading? ", todoSrc[k], k)
                todoSrc[k] = 1 // done
                setTimeout(() => direct_download(k), downloadBreak)
                downloadBreak += 500
            }
        });
    setTimeout(doDownloads, 6000)
}


let downloadBreak = 0

function addDownloads(){
    //console.log($(".post_media_photo.image"))//.forEach((e) => console.log(e.src))
    $(".post_media_photo.image").each(
        (i,e) => {
            console.log(e.src);
            rememberSrc(e.src);
//             setTimeout(() => direct_download(e.src), downloadBreak)
//             downloadBreak += 300
        })
    //console.log("figs",$("figure").find("image").length)
    jQuery("figure img").each(
        (i,e) => {
            console.log(e.src);
            rememberSrc(e.src);
//             setTimeout(() => direct_download(e.src), downloadBreak)
//             downloadBreak += 300
        })

    jQuery("source").each(
        (i,e) => {
            console.log(e.src);
            rememberSrc(e.src);
//             setTimeout(() => direct_download(e.src), downloadBreak)
//             downloadBreak += 300
        })
}

let lastScrollHeight = -1;
let downCnt = 0;
function gotoBottom(){
   //var element = document.getElementById(id);

    console.log("going down", document.body.scrollHeight)
    if (lastScrollHeight < document.body.scrollHeight ) {

        window.scrollTo(0,document.body.scrollHeight);
        lastScrollHeight = document.body.scrollHeight
        downCnt += 1

    }
    addDownloads()


     if (downCnt < 9999){
        setTimeout(gotoBottom, 3000)
     }
   //window.scrollTop = window.scrollHeight - window.clientHeight;
}



(function() {
    'use strict';


    setTimeout(gotoBottom, 1000)
    setTimeout(doDownloads, 5000)
    // Your code here...
})();