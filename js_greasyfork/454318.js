// ==UserScript==
// @name         skip open external link alert
// @description  for gamer site
// @namespace    ref_redir
// @author       Covenant
// @version      1.0
// @license      MIT
// @homepage
// @match        https://ref.gamer.com.tw/redir.php?url=*
// @match        https://www.gamer.com.tw/*
// @match        https://forum.gamer.com.tw/*
// @match        https://home.gamer.com.tw/*
// @match        https://webcache.googleusercontent.com/search?q=cache:https://forum.gamer.com.tw/*
// @match        https://webcache.googleusercontent.com/search?q=cache:https://home.gamer.com.tw/*
// @icon         data:image/svg+xml,<svg width="26" height="23" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.434 1.462.402 18.612C-.74 20.563.687 23 2.966 23h20.068c2.28 0 3.706-2.437 2.564-4.387L15.566 1.463c-1.142-1.95-3.99-1.95-5.132 0z" fill="%239B9B9B"/><path d="M13.995 17.357c.253.25.395.566.395.956s-.143.725-.395.975c-.289.25-.609.37-1.004.37s-.719-.14-.968-.39c-.288-.25-.41-.565-.41-.955s.126-.71.41-.956c.253-.25.573-.37.968-.37s.735.125 1.004.37zm.181-9.64-.383 7.679a.673.673 0 0 1-.675.635h-.238c-.36 0-.66-.28-.675-.635l-.383-7.679a.671.671 0 0 1 .675-.702h1c.387 0 .695.32.675.702h.004z" fill="%23fff"/></svg>
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/454318/skip%20open%20external%20link%20alert.user.js
// @updateURL https://update.greasyfork.org/scripts/454318/skip%20open%20external%20link%20alert.meta.js
// ==/UserScript==
var baha_ref_redir=GM_getValue('baha_ref_redir', 3000);
var baha_ref_redir_replace=GM_getValue('baha_ref_redir_replace', false);
function fn_url(url){
    let obj_url=new URL(url);
    let params=obj_url.searchParams;
    //let params=new URLSearchParams(obj_url.search);
    return [obj_url,params];
}
//console.log("break");
function main_01() {
    var txt=document.querySelectorAll('div>p');
    for(let i = 0; i < txt.length; i++){
        if(txt[i].style.color=='blue'&&(txt[i].innerText.search(new RegExp("Https://", "i"))==0||txt[i].innerText.search(new RegExp("Http://", "i"))==0)){
            window.location.replace(txt[i].innerText);
        }
    }
}
(function() {
    'use strict';
    let url=fn_url(document.location);
    if(url[0].host.search(new RegExp("ref.gamer.com.tw", "i"))==0||url[0].host.search(new RegExp("www.gamer.com.tw", "i"))==0){
        GM_registerMenuCommand("0秒跳轉⚡", () => {
            GM_setValue('baha_ref_redir',1);
        });
        GM_registerMenuCommand("3秒跳轉🔔", () => {
            GM_setValue('baha_ref_redir',3000);
        });
        GM_registerMenuCommand("5秒跳轉⏳", () => {
            GM_setValue('baha_ref_redir',5000);
        });
        console.log(baha_ref_redir);
        window.onload = function(){
            var timeoutID = window.setInterval(( () => main_01() ), baha_ref_redir);//延遲3秒
        };
    }else if(url[0].host.search(new RegExp("forum.gamer.com.tw", "i"))==0||url[0].host.search(new RegExp("home.gamer.com.tw", "i"))==0||url[0].host.search(new RegExp("webcache.googleusercontent.com", "i"))==0){
        if(baha_ref_redir_replace){
            GM_registerMenuCommand("還原提醒不明連結", () => {
                GM_setValue('baha_ref_redir_replace',!baha_ref_redir_replace);
            });
        }else if(url[0].host.search(new RegExp("home.gamer.com.tw", "i"))==0||url[0].host.search(new RegExp("webcache.googleusercontent.com", "i"))==0){
            GM_registerMenuCommand("啟用移除redir.php(beta)", () => {
                GM_setValue('baha_ref_redir_replace',!baha_ref_redir_replace);
            });
        }
        if(baha_ref_redir_replace){
            let anchor=document.querySelectorAll('a');
            for(let i = 0; i < anchor.length; i++){
                if(anchor[i].href.search(new RegExp("https://ref.gamer.com.tw/redir.php\\?url=", "i"))==0){
                    anchor[i].href=decodeURIComponent(anchor[i].href).replace(/https:\/\/ref.gamer.com.tw\/redir\.php\?url=/i, '');
                    anchor[i].title="redir";
                }
            }
        }
    }
})();