// ==UserScript==
// @name         cnmooc meida link
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       yooooki
// @match        http://cnmooc.org/study/unit/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29225/cnmooc%20meida%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/29225/cnmooc%20meida%20link.meta.js
// ==/UserScript==

//currently support video and document


function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    link.click();
}

function f(){
    if(document.getElementsByClassName('video-play video-play-temp')[0]){
    console.log('111');
    var t=document.getElementsByClassName('jwmain')[0].children[0].children[0].src;
    prompt('video link:',t);
    //window.open(t);
    //downloadURI(t,'video');
    }
    else e();
}
function ff(){
    if(document.getElementsByClassName('video-play video-play-temp')[0]){
    var t=document.getElementsByClassName('jwmain')[0].children[0].children[0].src;
    //prompt('video link:',t);
    //window.open(t);
    downloadURI(t,'video.mp4');
    }
    else ee();
}
function fff(){
    if(document.getElementsByClassName('video-play video-play-temp')[0]){
    var t=document.getElementsByClassName('jwmain')[0].children[0].children[0].src;
    //prompt('video link:',t);
    document.getElementsByClassName('jwvideo')[0].children[0].pause();
    window.open(t);
    //downloadURI(t,'video');
    }
    else eee();
}

function e(){
    var t=document.getElementsByClassName('video-show')[0].children[1].text;
    var r=/isSlideShow\("(.+?)"\)/;
    var link="http://cnmooc.org"+r.exec(t)[1];
    prompt('document link:',link);
    //window.open(t);
    //downloadURI(t,'video');
}
function ee(){
    var t=document.getElementsByClassName('video-show')[0].children[1].text;
    var r=/isSlideShow\("(.+?)"\)/;
    var link="http://cnmooc.org"+r.exec(t)[1];
    //prompt('video link:',t);
    //window.open(t);
    downloadURI(link,'document');
}
function eee(){
    var t=document.getElementsByClassName('video-show')[0].children[1].text;
    var r=/isSlideShow\("(.+?)"\)/;
    var link="http://cnmooc.org"+r.exec(t)[1];
    //prompt('video link:',t);
    window.open(link);
    //downloadURI(t,'video');
}



document.getElementById('backCourse').text='下载';
document.getElementById('backCourse').outerHTML=document.getElementById('backCourse').outerHTML;
document.getElementById('backCourse').onclick=ff;

document.getElementsByClassName('ln-item ln-learn')[0].outerHTML=document.getElementsByClassName('ln-item ln-learn')[0].outerHTML;
document.getElementsByClassName('ln-item ln-learn')[0].text='显示地址';
document.getElementsByClassName('ln-item ln-learn')[0].onclick=f;

document.getElementsByClassName('ln-item btn-faq')[0].outerHTML=document.getElementsByClassName('ln-item btn-faq')[0].outerHTML;
document.getElementsByClassName('ln-item btn-faq')[0].textContent='在新窗口打开';
document.getElementsByClassName('ln-item btn-faq')[0].onclick=fff;


