// ==UserScript==
// @name         padawan_qqxiangce_download
// @namespace    padawan
// @version      0.2
// @description  download of qqxiangce pictures
// @author       padawan
// @license MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.2.0/jszip.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.js
// @require      https://libs.baidu.com/jquery/1.10.2/jquery.min.js
// @match        http*://user.qzone.qq.com/*
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/519540/padawan_qqxiangce_download.user.js
// @updateURL https://update.greasyfork.org/scripts/519540/padawan_qqxiangce_download.meta.js
// ==/UserScript==

// =====================================================
//                     Utilities
// =====================================================

function display_str(str_1){
    $("body").append(" <div id='flowwindow' style='right: 10px;top: 50px;background: #111111;color:#FFFFFF;overflow: auto;z-index: 9999;position: fixed;padding:5px;text-align:left;width: auto;min-width:300px;max-width:800px;height:auto;max-height:400px;scrollbars=yes;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;'>"+str_1+"</div>");
    //$("body").append(" <div id='flowwindow' style='right: 10px;top: 50px;background: #EEEEEE;color:#000000;overflow: auto;z-index: 9999;position: fixed;padding:5px;text-align:left;width: auto;min-width:200px;max-width:700px;height:auto;min-height:600px;scrollbars=yes;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;'>"+str_1+"</div>");
    function set_minsize(){
        var oDiv = document.getElementById("flowwindow");
        const width_orgin=document.documentElement.clientWidth
        var count=0
        //console.log(width_orgin)
        oDiv.ondblclick = function(){
        //oDiv.style.width = "auto";
            if(count==0){
              oDiv.style.height ="50px";
              count++
            }
            else{
              oDiv.style.height =width_orgin+"px";
              count--
            }
        }
    }
    set_minsize()
}

function add_download_btn(){
    // var txtelement = `<input type="text" value="发送Url到ytp" id="title_ex" style="width:400px"><br />`
    // const root = document.querySelector('#flowwindow')
    // root.insertAdjacentHTML("afterbegin",txtelement)
    // document.querySelector('#title_ex').value="发送Url到ytp"

    var btnelement = `<br /><a id="SendUrlBtn" class="btn" style="width:100px;height:30px;border:2px solid blue;background-color:green;color:white;margin-right: 10px" >Download</ a>`;
    const root = document.querySelector('#flowwindow')
    root.insertAdjacentHTML("afterbegin",btnelement)
    document.querySelector("#SendUrlBtn").innerHTML="Download"

    var btnelement_=document.querySelector("#SendUrlBtn")
    btnelement_.addEventListener('click', download_pics);
}

async function download_pics(){
    const folder_title=document.querySelector("#js-module-container > div.page-photo-list.photo-list-guest.j-pl-contianer-inner > div.photo-list-head.j-pl-header-normal > div.album-info > div.j-pl-albuminfo > div.j-pl-albuminfo-others.j-pl-popup-wrap > div.profile.profile-edit1 > strong").innerHTML
    const page=document.querySelector("span.cur.c-tx2").innerHTML
    console.log(folder_title)
    const elements = document.querySelectorAll(".j-pl-photoitem")
    const pattern=/(^http:.*?)mnull&bo=(.*?)&rf=.*?$/g
    for(var i=0;i<elements.length;i++){
        var element=elements[i]
        var url=element.querySelector("img.j-pl-photoitem-img").src
        console.log(url)
        var photo_title=element.querySelector("span[title]").innerHTML
        console.log(photo_title)
        var new_url=url.replace(pattern,"$1b&bo=$2&rf=viewer_4&t=5")
        console.log(new_url)
        file_name=folder_title+"_"+page+"_"+photo_title+"_"+i+".jpg"
        console.log(file_name)
       GM_download(new_url, file_name, function(response) {
           console.log(response);
           });
    }
}

(function() {
    'use strict';

    // 函数，当目标元素加载后将被调用
    function onElementLoaded(element) {
        console.log('元素加载完成:', element);
        // 在这里写你的逻辑
        display_str("批量下载QQ相册")
        add_download_btn();
    }

    // 创建一个观察器实例并传入一个回调函数
    const observer = new MutationObserver(function(mutations, me) {
        // 查找页面上带有 'floor-show' 类的元素
        const element = document.querySelector("#js-module-container > div.page-photo-list.photo-list-guest.j-pl-contianer-inner")
        if (element) {
            onElementLoaded(element); // 调用函数
            me.disconnect(); // 停止观察
            return;
        }
    });

    // 开始观察文档对象模型（DOM）的变化，配置对象指定了我们想要观察的变化类型
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();

