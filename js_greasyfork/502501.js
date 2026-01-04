// ==UserScript==
// @name        YTDL（ローカルServerバージョン）
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.8.1
// @description  ボタンを押して動画を取得
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/502501/YTDL%EF%BC%88%E3%83%AD%E3%83%BC%E3%82%AB%E3%83%ABServer%E3%83%90%E3%83%BC%E3%82%B8%E3%83%A7%E3%83%B3%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/502501/YTDL%EF%BC%88%E3%83%AD%E3%83%BC%E3%82%AB%E3%83%ABServer%E3%83%90%E3%83%BC%E3%82%B8%E3%83%A7%E3%83%B3%EF%BC%89.meta.js
// ==/UserScript==
const serverURL = "http://127.0.0.1:10270/";

function YTdownloadTools(){
        function add_btn() {
        let btnHTML = '';
        const btntag = btnHTML = '<button id="YT_DL_btn" style="background: none; border: none; cursor: pointer; float: left; font-size: 1em; height: 4em; outline: none; overflow: visible; padding: 0px 0px 0em; position: relative; width: 48px; display: flex; align-items: center;"><svg height="90%" version="1.1" viewBox="0 0 36 36" width="90%"><path d="M25,17 L17,17 L17,23 L25,23 L25,17 L25,17 Z M29,25 L29,10.98 C29,9.88 28.1,9 27,9 L9,9 C7.9,9 7,9.88 7,10.98 L7,25 C7,26.1 7.9,27 9,27 L27,27 C28.1,27 29,26.1 29,25 L29,25 Z M27,25.02 L9,25.02 L9,10.97 L27,10.97 L27,25.02 L27,25.02 Z" fill="#ff9999"></path></svg></button>'
        if(typeof trustedTypes !== "undefined"){
            btnHTML = trustedTypes.createPolicy('myCustomPolicy', {
                createHTML: (string) => string
            }).createHTML(btntag);
        }
        const ytbtn = document.getElementById('YT_DL_btn');
        if(!ytbtn){
            document.getElementsByClassName('ytp-right-controls')[0].insertAdjacentHTML('beforeend', btnHTML);
            document.getElementById('YT_DL_btn').addEventListener('click', ()=> setTimeout(sendText(URLget()),300));
        }




        if(location.href.indexOf('&list') !== -1){

            let playlistPanel;
            const Plist = setInterval(()=>{
                playlistPanel = document.querySelector('#secondary > #secondary-inner > ytd-playlist-panel-renderer#playlist');
                if(playlistPanel){
                    clearInterval(Plist);
                    document.getElement
                    const playlist_items = playlistPanel.querySelectorAll('ytd-playlist-panel-video-renderer');
                    add_downloadbtn(playlist_items, playlistPanel);
                }
            },500)
            }

        function add_downloadbtn(items, Panel){
            if(Panel.querySelectorAll('.playList_downloadBtn').length) return;
            const menu = Panel.querySelector('#playlist-action-menu');
            const AllBtn = document.createElement('button');
            AllBtn.textContent = 'All';
            AllBtn.onclick = () => {
                items.forEach((i)=>{
                    sendText(i.querySelector('a').href);
                })
            }
            if(menu.firstChild){
                menu.appendChild(AllBtn);
            }else{
                menu.parentElement.parentElement.appendChild(AllBtn);
            }


            items.forEach((i)=>{
                const addbtn = document.createElement('button');
                addbtn.classList.add('playList_downloadBtn');
                addbtn.textContent = 'V';
                addbtn.onclick = () => sendText(i.querySelector('a').href);
                i.appendChild(addbtn);
            });
        }
    };
    add_btn();

    function extract(s){
        let len = s.indexOf('watch?v=');
        let id;
        console.log(len)
        if(len != -1) {
            id = s.substring(len + 8 ,len + 19);
        }else{

            len = s.indexOf('live/')
            id = s.substring(len + 5 ,len + 16);
        }
        return id;
    }
    function URLget(){
        const URL = location.href;
        return URL;
    };

    function createJSON(movieID){

    }

    function changeTitleColor(){
            const title = document.querySelector('yt-formatted-string.style-scope.ytd-watch-metadata')
        title.style.color = 'red';
        setTimeout(()=>{
            title.style.color = 'white';
        },3000)
    }

    function sendText(url){
        const movieID = extract(url);
        TextPost(movieID);
        changeTitleColor();
    }

}


//ここからURL切り替え感知
//https://qiita.com/nanasi-1/items/dbaee5d609c2199e861b
window.addEventListener('load', () => {
    observer.observe(document.body, {
        subtree: true,
        childList: true,
        attributes: true,
        characterData: true
    });
});


let oldUrl = '';

const observer = new MutationObserver(() => {
    setTimeout(() => {
        if(oldUrl !== location.href) {
            oldUrl = location.href; // oldUrlを更新
            if(oldUrl.match(/https:\/\/www\.youtube\.com\/watch\?v=*/) !== null || oldUrl.match(/https:\/\/www\.youtube\.com\/live\/*/) !== null){
                window.dispatchEvent(new CustomEvent('urlChange'));　// イベントを発火
            }
        }
    }, 500);
});

window.addEventListener('urlChange', () => {
   console.log('プレイヤーページ');
   YTdownloadTools();
    //ダウンロードツール呼び出し
});



function TextPost(text){

    GM_xmlhttpRequest({
        method: "POST",
        url: serverURL,
        data: "text=" + encodeURIComponent(text),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function(response) {
            console.log("Response:", response.responseText);
        },
        onerror: function(error) {
            console.error("Error:", error);
        }
    });

}