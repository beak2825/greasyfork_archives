// ==UserScript==
// @name         ddrk-m3u8解析修复版
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  点击视频播放按钮，解析低端影视ddrk.me/ddys.tv视频播放地址为m3u8，并直接下载。
// @author       Lonelam
// @match        https://ddrk.me/*
// @match        https://ddys.tv/*
// @grant  none
// @downloadURL https://update.greasyfork.org/scripts/426898/ddrk-m3u8%E8%A7%A3%E6%9E%90%E4%BF%AE%E5%A4%8D%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/426898/ddrk-m3u8%E8%A7%A3%E6%9E%90%E4%BF%AE%E5%A4%8D%E7%89%88.meta.js
// ==/UserScript==
 
 
window._fetch = fetch;
window.fetch = (src) => {
    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
    let p = window._fetch(src);
    if (src.includes && src.includes('9543/video?id=')) {
        p.then((resp)=> {
 
            var movie_name = /^https?:\/\/ddrk.(me|tv)\/(.*)\//.exec(location.href)[2] || 'unknown-movie';
            let ep_name = new URL(location.href).searchParams.get('ep') || '0';
            var file_name = prompt("捕获到m3u8请求，请输入视频标题，如不需要下载m3u8请点取消开始播放",movie_name+'-'+ep_name);
            if (file_name) {
                resp.clone().json().then((data) => {
                    let pint = pako.ungzip(data.pin,{to:'string'});
 
                    if (file_name) {
                        download(file_name +".m3u8", pint);
                    }
                })
            }
        });
 
    }
    return p;
}