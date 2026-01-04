// ==UserScript==
// @name 网页朗读
// @description 使用百度语音合成接口，对文字进行朗读。
// @version 0.0.1.202200301095130
// @match *
// @namespace https://greasyfork.org/users/420865
// @downloadURL https://update.greasyfork.org/scripts/438581/%E7%BD%91%E9%A1%B5%E6%9C%97%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/438581/%E7%BD%91%E9%A1%B5%E6%9C%97%E8%AF%BB.meta.js
// ==/UserScript==

/****
    *步骤：
    *1、将文本内容分隔为每段小于500字符的数组，函数splitStr()；
    *2、遍历文章片段数组，将所有文章片段转换为base64音频，并存入base64音频数组，函数getbase64Audio()；
    *3、播放base64音频，函数playAudio()。其中依赖base64ToBlob()函数；
    *4、将base64音频转blob文件对象，可用于Audio标签播放，函数base64ToBlob()。
****/

// 初始化：朗读音色，默认磁性男声。个人认为磁性男声、清澈女声相对来说好听一点。尤其是磁性男声朗读起来抑扬顿挫，节奏感比较好。语速、音调设置为4比较舒服。
// 4003-磁性男声、4105-清澈女声、4106-情感男声、4115-情感男声、4119-甜美女声、4117-情感女声、4100-成熟女声、4103-可爱女童
// spd-语速、pit-音调
var SPEAKER = "type=tns&per=4003&spd=4&pit=4&vol=5&aue=6&tex=";

// 初始化：正文选择器、下一页/章选择器、目录页选择器、正文容器、下一页/章地址容器、目录页地址容器、结束页判定标志、base64音频容器
var contentSelector = "";
var nextPageSelector = "";
var muluPageSelector = "";
var pageContent = "";
var nextPageUrl = "";
var muluPageUrl = "";
var endBoolean = true;
var base64AudioArr = [];

// 初始化：播放器
var myaudio = document.createElement("audio");
document.querySelector("body").appendChild(myaudio);
myaudio.controls = "controls";
myaudio.style.cssText = "position: fixed; left: 50%; margin-left: -150px; top: 100px; z-index: 100;";

// 初始化：通过网站域名匹配相应的选择器
switch (window.location.host) {
case "m.99mk.com":
    contentSelector = "#chaptercontent";
    nextPageSelector = "#pb_next";
    muluPageSelector = "#pb_mulu";
    break;
case "www.99mk.com":
    contentSelector = "#content";
    nextPageSelector = "div.page_chapter > ul > li:nth-child(3) > a";
    muluPageSelector = "div.page_chapter > ul > li:nth-child(2) > a";
    break;
case "www.18xsorg.com":
    contentSelector = "#content";
    nextPageSelector = "#pager_next";
    muluPageSelector = "#pager_current";
    break;
case "www.23xo.com":
    contentSelector = "#book_text";
    nextPageSelector = "#mains > div > div.book_content_text_next > a:nth-child(4)";
    muluPageSelector = "#mains > div > div.book_content_text_next > a:nth-child(2)";
    break;
case "www.x2552.com":
    contentSelector = "#contents";
    nextPageSelector = "#amain > dl > dd:nth-child(3) > h3 > a:nth-child(3)";
    muluPageSelector = "#amain > dl > dd:nth-child(3) > h3 > a:nth-child(2)";
    break;
case "www.guancha.cn":
    contentSelector = ".content.all-txt";
    nextPageSelector = "#mains > div > div.book_content_text_next > a:nth-child(4)";
    muluPageSelector = "#mains > div > div.book_content_text_next > a:nth-child(2)";
    break;
case "www.tywx.me":
    contentSelector = "#content";
    nextPageSelector = "#pager_next";
    muluPageSelector = "#pager_current";
    break;
case "m.tywx.me":
    contentSelector = "#chaptercontent";
    nextPageSelector = "#pt_next";
    muluPageSelector = "#pt_mulu";
    break;
case "m.xxbiqudu.com":
    contentSelector = "#content > div.text";
    nextPageSelector = "div.navigator-nobutton > ul > li:nth-child(4) > a";
    muluPageSelector = "div.navigator-nobutton > ul > li:nth-child(2) > a";
    break;
case "m.dabiquge.com":
    contentSelector = "#chaptercontent";
    nextPageSelector = "#pb_next";
    muluPageSelector = "#pb_mulu";
    break;
case "m.147xs.org":
    contentSelector = "#nr";
    nextPageSelector = "#pt_next";
    muluPageSelector = "#pt_mulu";
    break;
case "m.wlaidu.com":
    contentSelector = "#txtuup.TxtContent";
    nextPageSelector = "#PageSet > :last-child";
    muluPageSelector = "div.m > a";
    break;
case "m.vipxs.la":
    contentSelector = "#nr1";
    nextPageSelector = "#pb_next";
    muluPageSelector = "#pb_mulu";
    break;
case "wap.aixswx.com":
    contentSelector = "#txt";
    nextPageSelector = ".pager > a:nth-child(3)";
    muluPageSelector = ".pager > a:nth-child(2)";
    break;
case "m.bookbao.tw":
    contentSelector = "#chaptercontent";
    nextPageSelector = "#pt_next";
    muluPageSelector = "#pt_mulu";
    break;
default:
    alert("这是一个新网站，请在程序中加入新的域名信息。");
    throw new Error('抛出错误，以此终止后续语句的执行：这是一个新网站，请在程序中加入新的域名信息。');
}

// 开始启动程序
// 抓取正文
getHtml(window.location.href);

function getHtml(url) {
    // 抓取网页，提取正文、下一页/下一章网址、目录页网址
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var tempHtml = document.createElement("p");
            tempHtml.innerHTML = this.responseText;
            pageContent = tempHtml.querySelector(contentSelector).innerText;
            var tempNext = tempHtml.querySelector(nextPageSelector);
            var tempMuLu = tempHtml.querySelector(muluPageSelector);
            if (tempNext == null) {
                alert("下一页选择器错误！请重新编辑。");
                myaudio.remove();
                return;
            }
            tempNext.href ? nextPageUrl = tempNext.href : nextPageUrl = "";
            if (tempMuLu == null) {
                alert("目录页选择器错误！请重新编辑。");
                myaudio.remove();
                return;
            }
            tempMuLu.href ? muluPageUrl = tempMuLu.href : muluPageUrl = "";
            endBoolean = Boolean(nextPageUrl == muluPageUrl || nextPageUrl == "");
            // 把本页的正文替换为下页的正文
            document.querySelector(contentSelector).innerText = pageContent;
            nextPageUrl == "" ? console.log("已是最后一页！") : document.querySelector(nextPageSelector).href = nextPageUrl;
            main();
        }
    }
    ;
}

function main() {
    // 步骤 1
    var strArr = splitStr(pageContent);
    // 步骤 2
    base64AudioArr = new Array(strArr.length);
    for (var i = 0; i < strArr.length; i++) {
        var xmlhttp = new XMLHttpRequest();
        getbase64Audio(xmlhttp, i, SPEAKER + encodeURI(strArr[i]));
    }
    // 步骤 3
    // 设置一个定时器，2秒一个周期，检测base64音频数组第一个元素是否装填。
    var timeoutID = setInterval(starPlay, 500);
    function starPlay() {
        if (base64AudioArr[0] != undefined) {
            // 如果base64音频数组第一个元素已装填，则开始播放。
            clearInterval(timeoutID);
            playAudio();
        }
    }
}

function splitStr(text) {
    //  将文章分隔为每段小于500字符的数组
    var firstNo = 0;
    var endNo = 0;
    var tempStr = "";
    var arr = [];
    for (var i = 0; i < text.length; ) {
        tempStr = text.substr(i, 500);
        endNo = tempStr.lastIndexOf("。") + 1;
        if (endNo > 0) {
            //出现过500个字符串中都没有一个句号的情况。
            tempStr = text.substr(i, endNo);
            i = i + endNo;
            console.log(i);
            arr.push(tempStr);
        } else {
            i = i + 500;
            console.log(i);
            arr.push(tempStr);
        }
    }
    return arr;
}

function getbase64Audio(xhttp, no, str) {
    // 从百度语音合成中获取文字转base64音频
    xhttp.open("POST", "https://ai.baidu.com/aidemo", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(str);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            base64AudioArr[no] = obj.data;
        }
    }
    ;
}

function playAudio() {
    // 播放base64音频，依赖base64ToBlob()函数。
    var i = 0;
    var audioBlob = base64ToBlob(base64AudioArr[i]);
    myaudio.src = window.URL.createObjectURL(audioBlob);
    myaudio.play();
    myaudio.onended = function() {
        i = i + 1;
        if (i < base64AudioArr.length) {
            audioBlob = base64ToBlob(base64AudioArr[i]);
            myaudio.src = window.URL.createObjectURL(audioBlob);
            myaudio.play();
        } else {
            //  判断是否有下一页，或者是否到全文结尾
            if (endBoolean) {
                alert("音频播放完成");
                myaudio.remove();
            } else {
                // 抓取下一页正文
                getHtml(nextPageUrl);
            }
        }
    }
    ;
}

function base64ToBlob(base64) {
    // 将base64音频转blob文件对象
    var audioSrc = base64;
    // 拼接最终的base64
    var arr = audioSrc.split(',');
    var array = arr[0].match(/:(.*?);/);
    var mime = (array && array.length > 1 ? array[1] : type) || type;
    // 去掉url的头，并转化为byte
    var bytes = window.atob(arr[1]);
    // 处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length);
    // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }
    return new Blob([ab],{
        type: mime
    });
}
