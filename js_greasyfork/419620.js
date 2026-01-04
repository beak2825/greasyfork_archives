// ==UserScript==
// @name         M3u8&mp4 Detect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @run-at       document-start
// @match        http*://*/*
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_log
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/419620/M3u8mp4%20Detect.user.js
// @updateURL https://update.greasyfork.org/scripts/419620/M3u8mp4%20Detect.meta.js
// ==/UserScript==

let menu_id = {};
function handler_m3u8(url){
    if(menu_id[url] == undefined){
        let idx = Object.keys(menu_id).length+1;
        let _id = GM_registerMenuCommand(`[${idx}] m3u8 open and copy`, function(){
            GM_openInTab(url);
            let out = document.title.replace(/\||<|>|\?|\*|:|\/|\\|"|\n/g, ' ');
            let cmd = `ffmpeg -i "${url}" -vcodec copy -acodec copy -absf aac_adtstoasc "${out}.mp4"\n`;
            GM_setClipboard(cmd);
        });
        GM_registerMenuCommand(`[${idx}] copy command`, function(){
            let out = document.title.replace(/\||<|>|\?|\*|:|\/|\\|"|\n/g, ' ');
            let cmd = `ffmpeg -i "${url}" -vcodec copy -acodec copy -absf aac_adtstoasc "${out}.mp4"\n`;
            GM_setClipboard(cmd);
        });

        menu_id[url] = _id;
    }
}

function handler_mp4(url){
    if(menu_id[url] == undefined){
        let idx = Object.keys(menu_id).length+1;
        let _id = GM_registerMenuCommand(`[${idx}] mp4 open`, function(){
            GM_openInTab(url);
            GM_setClipboard(url);
        });
        GM_registerMenuCommand(`[${idx}] mp4 open`, function(){
            let out = document.title.replace(/\||<|>|\?|\*|:|\/|\\|"|\n/g, ' ');
            GM_download(url, `${out}.mp4`);
        });
        menu_id[url] = _id;
    }
}

(function(open) {
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener("readystatechange", function() {
            //console.log(this.readyState);
        }, false);
        let url = arguments[1];
        if(/http.*\.m3u8.*/.test(url)){
            GM_log(url);
            GM_notification({
                'text': url,
                'title': "Got m3u8 url ",
                'timeout': 2000,
            });

            handler_m3u8(url);
        }
        else if(/http.*\.mp4.*/.test(url)){
            GM_log(url);
            GM_notification({
                'text': url,
                'title': "Got mp4 url ",
                'timeout': 2000,
            });
            handler_m3u8(url);
        }
        open.apply(this, arguments);
    };
})(XMLHttpRequest.prototype.open);

