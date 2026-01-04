// ==UserScript==
// @name         富学宝典
// @namespace    *://iedu.foxconn.com/
// @version      1.05
// @description  注释：1.实现富学宝典的后台播放（可倍速），2.进入对应的页面自动完成视频或阅读任务，3.部分浏览器会阻止视频自动播放，需要开放对应的权限，4.执行任务的顺序是从上到下
// @author       dieout
// @license      MIT
// @run-at       document-end
// @match        *://iedu.foxconn.com/public/user/playCourse?*
// @match        *://iedu.foxconn.com/public/play/play*
// @match        *://10.134.149.121/*
// @icon         http://video.fulearn.com/images/logo2.png
// @downloadURL https://update.greasyfork.org/scripts/512628/%E5%AF%8C%E5%AD%A6%E5%AE%9D%E5%85%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/512628/%E5%AF%8C%E5%AD%A6%E5%AE%9D%E5%85%B8.meta.js
// ==/UserScript==
var lang = (navigator.systemLanguage ? navigator.systemLanguage: navigator.language);
//获取浏览器配置语言 #括号内是个运算，运算过后赋值给lang，当?前的内容为true时把?后的值赋给lang，为False时把:后的值赋给lang
var text = lang.substr(0, 2); //获取lang字符串的前两位
var status = 0;
if (text == 'zh') {
    status = 0;
} else {
    status = 1;
}
//设置清晰度(无效)
// sd:标清
// hd:高清
var clarity = "hd";
//倍速设置
//volvo:1.0X
//saab:1.25X
//opel:1.5X
//audi:2.0X
// var Double_speed = "volvo";
//默认为1倍速
var Double_speed = "audi";


var rate = 1;

(function() {
    Refresh();
    window.onload = readPdf();
})();


async function readPdf() {
    //pdf自动阅读,临时解决办法，刷新iframe
    let j = 0;
    let i = 0;
    for (; j < document.getElementsByTagName("dd").length;) {
        if (status == 0) {
            if (document.getElementsByTagName("dd")[j].children[1].innerText != "已完成") {
                i = j;
                break;
            } else {++j;
                   }
        } else {
            if (document.getElementsByTagName("dd")[j].children[1].innerText != "Finished") {
                i = j;
                break;
            } else {++j;
                   }
        }
    }
    if(j == document.getElementsByTagName("dd").length ){
        alert("本章已全部完成！请手动切换到下一章。");
        return;
    }
    for (; i < document.getElementsByTagName("dd").length; i++) {
        //开始阅读pdf
        // alert("变量:"+ document.getElementsByTagName("dd").length);
        document.getElementsByTagName("dd")[i].click();
        console.log(document.getElementsByClassName("pdfwarp dpn").length);
        // alert("变量1:"+ document.getElementsByClassName("pdfwarp dpn").length);
        if (document.getElementsByClassName("pdfwarp dpn").length > 0) {
            document.getElementsByClassName("pdfwarp dpn")[0].children[2].click();
            // alert("变量2:"+ document.getElementsByTagName("dd")[i].children[1].innerText);
            if (document.getElementsByTagName("dd")[i].children[1].innerText != "已完成") {
                // alert("变量3:"+ document.getElementsByTagName("video").length);
                // if (document.getElementsByTagName("video").length > 0) {
                //     //id="realvideo_html5_api"
                //     break;
                // }

                await sleep(3000);
                // palyfirstpdf();
                // alert("2024" );
                while (document.getElementsByTagName("dd")[i].children[1].innerText != "已完成") {
                    console.log(document.getElementsByTagName("dd")[i].children[1].innerText);
                    // alert( document.getElementsByTagName("dd")[i].children[1].innerText);//调试
                    document.getElementById("pdf").contentWindow.document.getElementsByClassName("toolbarButton pageDown")[0].click();
                    await sleep(1000);
                    document.getElementById("pdf").contentWindow.document.getElementsByClassName("toolbarButton pageDown")[0].click();
                    await sleep(1000);
                    document.getElementById("pdf").contentWindow.document.getElementsByClassName("toolbarButton pageDown")[0].click();
                    await sleep(1000);
                    document.getElementById("pdf").contentWindow.document.getElementsByClassName("toolbarButton pageUp")[0].click();
                    await sleep(1000);
                    if(document.getElementsByTagName("dd")[i].children[1].innerText == "已完成") break;
                }
            } else if (document.getElementsByTagName("dd")[i].children[1].innerText != "Finished") {
                if (document.getElementsByTagName("video").length > 0) {
                    break;
                }
                await sleep(3000);
                while (document.getElementsByTagName("dd")[i].children[1].innerText != "Finished") {
                    document.getElementById("pdf").contentWindow.document.getElementsByClassName("toolbarButton pageDown")[0].click();
                    await sleep(1000);
                    document.getElementById("pdf").contentWindow.document.getElementsByClassName("toolbarButton pageDown")[0].click();
                    await sleep(1000);
                    document.getElementById("pdf").contentWindow.document.getElementsByClassName("toolbarButton pageDown")[0].click();
                    await sleep(1000);
                    document.getElementById("pdf").contentWindow.document.getElementsByClassName("toolbarButton pageUp")[0].click();
                    await sleep(1000);
                    if(document.getElementsByTagName("dd")[i].children[1].innerText == "Finished") break;
                }
            } else {
                if (document.getElementsByTagName("video").length > 0) {
                    break;
                }
                continue;
            }
        }
    }
    if(i == document.getElementsByTagName("dd").length){
        alert("本章已全部完成！请手动切换到下一章。");
        // alert("11");
        // return;
                if (document.getElementById("realvideo_html5_api")) {
                    //id="realvideo_html5_api"
                    // alert("变量3:");
                    main();

                }
    }
    //main();
}

async function main() {
    'use strict';
    let video = document.getElementsByTagName("video");
    let i = 0;
    let j = 0;
    // alert("变量1:"+ document.getElementsByTagName("dd").length);
    for (; j < document.getElementsByTagName("dd").length;) {
        if (status == 0) {
            if (document.getElementsByTagName("dd")[j].children[1].innerText != "已完成") {
                i = j;
                break;
            } else {++j;
                   }
        } else {
            if (document.getElementsByTagName("dd")[j].children[1].innerText != "Finished") {
                i = j;
                break;
            } else {++j;
                   }
        }
    }
    if(j == document.getElementsByTagName("dd").length ){
        alert("本章已全部完成！请手动切换到下一章。");
        alert("123");
        return;
    }
    //隐藏视频上的账号信息
    if (document.getElementsByClassName("vjs-userName").length > 0) {
        document.getElementsByClassName("vjs-userName")[0].style.display = "none";
        document.getElementsByClassName("vjs-userName")[0].style.visibility = "hidden";
        document.getElementsByClassName("vjs-userName")[0].innerText = "";
    }
    //视频播放
    for (; i < document.getElementsByTagName("dd").length; i++) {
        alert("变量2:"+ document.getElementsByTagName("dd")[i].children[1].innerText);
        document.getElementsByTagName("dd")[i].click(); //dianji(i,this); 调用网页中自带的函数
        video = document.getElementsByTagName("video");
        // video.play();
        // document.querySelector('video').play();
        if(document.getElementById("pdf").style.display != "none"){
            readPdf();
        }
        if (status == 0) {
            if (video.length != 0 && document.getElementsByTagName("dd")[i].children[1].innerText != "已完成") {
                let id = video[0].getAttribute("id"); //realvideo_html5_api
                let mp4 = document.getElementById(id);
                //设置默认为高清播放模式
                let select = document.getElementsByTagName("select")[0];
                select.autocomplete="off";
                for (let z = 0; z < select.options.length; ++z) {
                    if (select.options[z].value == clarity) {
                        select.options[z].selected = true;
                        break;
                    }
                }
                //设置倍速播放
                let select2 = document.getElementsByTagName("select")[1];
                select2.autocomplete="off";
                for (let y = 0; y < select2.options.length; ++y) {
                    if (select2.options[y].value == Double_speed) {
                        select2.options[y].selected = true;
                        if(Double_speed == "saab"){
                            rate =1.25
                        }else if(Double_speed == "opel"){
                            rate =1.5
                        }else if(Double_speed == "audi"){
                            rate =2
                        }
                        break;
                    }
                }
                mp4.muted = true; //静音播放
                while (document.getElementsByTagName("dd")[i].children[1].innerText != "已完成") {
                    console.log(document.getElementsByTagName("dd")[i].children[1].innerText);
                    await sleep(1000)
                    document.querySelector('video').playbackRate = rate;
                    mp4.play();
                    if(document.getElementsByTagName("dd")[i].children[1].innerText == "已完成") break;
                }
            }
        } else {
            if (video.length != 0 && document.getElementsByTagName("dd")[i].children[1].innerText != "Finished") {
                document.getElementsByTagName("dd")[i].click(); //dianji(i,this); 调用网页中自带的函数
                let id = video[0].getAttribute("id"); //realvideo_html5_api
                let mp4 = document.getElementById(id);
                //设置默认为高清播放模式
                 let select = document.getElementsByTagName("select")[0];
                 select2.autocomplete="off";
                 for (let z = 0; z < select.options.length; ++z) {
                     if (select.options[z].value == clarity) {
                         select.options[z].selected = true;
                         break;
                    }
                }
                //设置倍速播放
                let select2 = document.getElementsByTagName("select")[1];
                select2.autocomplete="off";
                for (let y = 0; y < select2.options.length; ++y) {
                    if (select2.options[y].value == Double_speed) {
                        select2.options[y].selected = true;
                        if(Double_speed == "saab"){
                            rate =1.25
                        }else if(Double_speed == "opel"){
                            rate =1.5
                        }else if(Double_speed == "audi"){
                            rate =2
                        }
                        break;
                    }
                }
                mp4.muted = true; //静音播放
                while (document.getElementsByTagName("dd")[i].children[1].innerText != "Finished") {
                    console.log(document.getElementsByTagName("dd")[i].children[1].innerText);
                    await sleep(1000)
                    document.querySelector('video').playbackRate = rate;
                    mp4.play();
                    if(document.getElementsByTagName("dd")[i].children[1].innerText == "Finished") break;
                }
            }
        }
    }
    if(i == document.getElementsByTagName("dd").length){
        alert("本章已全部完成！请手动切换到下一章。");
        return;
    }
};
//刷新页面
function Refresh() {
    // Reload every 10 minutes to avoid video jam
    let k2 = 0;
    for (; k2 < document.getElementsByTagName("dd").length;) {
        if (status == 0) {
            if (document.getElementsByTagName("dd")[k2].children[1].innerText != "已完成") {
                setTimeout(()=>{
                    location.reload()
                },600000); //每10分钟重新加载一次，避免视频卡住
                break;
            } else {++k2;
                   }
        } else {
            if (document.getElementsByTagName("dd")[k2].children[1].innerText != "Finished") {
                setTimeout(()=>{
                    location.reload()
                },600000); //每10分钟重新加载一次，避免视频卡住
                break;
            } else {
                ++k2;
            }
        }
    }
    if(k2 == document.getElementsByTagName("dd").length){
        alert("本章已全部完成！请手动切换到下一章。");
    }
}
//休眠等待
function sleep(time) {
    return new Promise((resolve)=>setTimeout(resolve, time));
}