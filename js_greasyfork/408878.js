// ==UserScript==
// @name         Xuetangx Caption Crawler
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Download Xuetangx Captions
// @author       RabbitHu
// @match        http://*.xuetangx.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408878/Xuetangx%20Caption%20Crawler.user.js
// @updateURL https://update.greasyfork.org/scripts/408878/Xuetangx%20Caption%20Crawler.meta.js
// ==/UserScript==


var close_after_download = false;

function fake_click(obj) {
    var ev = document.createEvent("MouseEvents");
    ev.initMouseEvent(
        "click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null
    );
    obj.dispatchEvent(ev);
}

function download(name, data) {
    var urlObject = window.URL || window.webkitURL || window;

    var downloadData = new Blob([data]);

    var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
    save_link.href = urlObject.createObjectURL(downloadData);
    save_link.download = name;
    fake_click(save_link);
}

function download_caption(){
    document.getElementsByClassName('xt_video_player_word_break')[0].click();
    var title = document.getElementsByClassName('active')[2].innerText.split('\n')[0];
    var caption = document.getElementsByClassName('xt_video_player_caption_aside')[0].innerText;
    download(title + ".txt", caption);
    if(close_after_download) window.close();
}

function try_download_caption(){
    var try_download_caption_interval = setInterval(function(){
        if(document.getElementsByClassName('xt_video_player_word_break').length){
            download_caption();
            try_download_caption_interval = window.clearInterval(try_download_caption_interval);
        }
        console.log('try_download_caption');
    }, 100);
}

function create_download_button(){
    if(!document.getElementsByClassName('wrapper-downloads')[0]) return;
    var li_element = document.createElement("li");
    var a_element = document.createElement("a");
    a_element.onclick = function(){
        try_download_caption();
    }
    a_element.setAttribute("one-link-mark","yes");
    li_element.setAttribute("class", "video-tracks video-download-button");
    a_element.innerHTML = "下载本节字幕";
    li_element.appendChild(a_element);
    document.getElementsByClassName('wrapper-downloads')[0].appendChild(li_element);
}

function create_download_all_button(){
    if(!document.getElementsByClassName('wrapper-downloads')[0]) return;
    var li_element = document.createElement("li");
    var a_element = document.createElement("a");
    a_element.onclick = function(){
        var msg = "接下来将打开多个新标签页用于下载字幕。如果未能成功下载/只能下载一个字幕文件，请检查浏览器是否拦截了弹窗（一般会在地址栏右边有标志）。";
        if (confirm(msg)==true){
			console.log('Download All!');
            download_all();
		}
    }
    a_element.setAttribute("one-link-mark","yes");
    li_element.setAttribute("class", "video-tracks video-download-button");
    a_element.innerHTML = "下载课程全部字幕";
    li_element.appendChild(a_element);
    document.getElementsByClassName('wrapper-downloads')[0].appendChild(li_element);
}

function instant_download(){
    console.log('Instant Download Running...');
    try_download_caption();
    //window.close();
}

function download_all(){
    var navs = document.getElementsByTagName('nav');
    var course_nav = navs[0];
    for(var i = 0; i < navs.length; i++){
        if(navs[i].ariaLabel){
            course_nav = navs[i];
        }
    }
    var str = course_nav.innerHTML;
    console.log(str);
    var urls = Array.from(str.matchAll('href *= *"/(.*)/"'));
    var open_windows = [];
    var cur_url_index = 0, max_open_windows = 5;
    var open_window_url = setInterval(function(){
        for(var i = 0; i < max_open_windows; i++){
            if(!!open_windows[i] && open_windows[i].closed){
                open_windows[i] = null;
            }
            if(!open_windows[i] && cur_url_index < urls.length){
                open_windows[i] = window.open('http://' + window.location.href.split('/')[2] + '/' + urls[cur_url_index][1] + '?instant_download');
                cur_url_index++;
            }
        }
        if(cur_url_index >= urls.length){
            open_window_url = window.clearInterval(open_window_url);
        }
    }, 100);
}

window.onload = function(){
    console.log('Xuetangx Caption Crawler Running!');
    create_download_button();
    create_download_all_button();
    const urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has('instant_download')){
        if(!document.getElementsByClassName('seq_video').length){
            window.close();
        }
        close_after_download = true;
        instant_download();
    }
}
