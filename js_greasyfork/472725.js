
// ==UserScript==
// @name         抖音无水印视频下载⭕豆豆
// @version      0.0.7
// @description  抖音无水印视频下载⭕豆豆⭕持续更新。
// @author       ian
// @match        *://*.douyin.com/*
// @match        *://www.xiaohongshu.com/*
// @icon         https://lh3.googleusercontent.com/PJ6q1Vkbj1RLuWEz1R6CsrjFEePkfnjypoga0vqDyneoUp6ZVai24meYkgfcWXP9ecBAuxxqB42Vf5KIRwrFnjgV=w128-h128-e365-rj-sc0x00ffffff
// @grant        GM_addStyle
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @license      ian-6.0-or-later
// @namespace douyin_video_downloader
// @downloadURL https://update.greasyfork.org/scripts/472725/%E6%8A%96%E9%9F%B3%E6%97%A0%E6%B0%B4%E5%8D%B0%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E2%AD%95%E8%B1%86%E8%B1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/472725/%E6%8A%96%E9%9F%B3%E6%97%A0%E6%B0%B4%E5%8D%B0%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E2%AD%95%E8%B1%86%E8%B1%86.meta.js
// ==/UserScript==


(function() {
    'use strict';


    let css=`.ianDownload {
	    border-radius:6px;
        background-color: rgb(45 45 45 / 50%);
    }
    .ianDownload:hover {
        background-color: #41424c;
    }
    `;

    GM_addStyle(css);
    let Warehouse=[];



    //添加下载按钮
    function downloadInit() {
        try{
            document.querySelector('.ianDownload').parentNode.remove();
        }catch (e) {}
        try{
            let TIPS = document.querySelectorAll(".xg-tips");
            for(let d=0;d<=TIPS.length;d++){
                console.log(701,TIPS[d].getAttribute("lang-key"))
                if(TIPS[d].getAttribute("lang-key")=="PAUSE_TIPS"){
                    let xgright=TIPS[d].parentNode.parentNode.parentNode.querySelector(".xg-right-grid");
                    if(!xgright.querySelector(".ianDownload")){
                        let fixButton = document.createElement('xg-icon');
                        fixButton.className="xgplayer-playback-setting";
                        fixButton.innerHTML='<div class="xgplayer-setting-playbackRatio ianDownload" >下载</div>';
                        xgright.appendChild(fixButton);
                        try {
                            let btn = document.querySelector('.ianDownload')
                            btn.addEventListener('click', function(e) {
                                e.stopPropagation();
                                downloaparse(Warehouse);
                            })

                        } catch(err) {}
                    }
                }
            }
        }catch (e) {}
    }


    //id匹配
     function Match_id(modal_id,itemArr) {
         try {
             for(let i=0;i<itemArr.length;i++){
                 if(itemArr[i].includes(modal_id)){

                     console.log(201,'id')
                      return itemArr[i];
                     break;
                 }
             }
         } catch(err) {}
     }


    //解析
    function downloaparse(itemArr) {
        try{
            //清空数组数据\多余按钮
            Warehouse.length = 0;
        }catch (e) {}

        console.log(itemArr)
        let video_blob=0,modal_id=0,url;

        try {

            let dn=document.querySelector('.ianDownload').parentNode.parentNode.parentNode.parentNode.parentNode.querySelector("video");
            let source=dn.firstChild.src;
            console.log(8888,source);
            if(source){
                    // 打开一个页面，重定向
                    let newWin = window.open('about:blank');
                    newWin.location.href = source;
            }

        } catch(err) {}



        try {
            let videoArr=document.querySelectorAll('#sliderVideo');
            for(let u=0;u<videoArr.length;u++){
                let data=videoArr[u].dataset.e2e,source=videoArr[u].dataset.e2eVid;
                if(data=="feed-active-video"){
                    modal_id=source;

                    url=Match_id(modal_id,itemArr);

                    let URL=itemArr[0]

                    console.log(91,url)



                    break;
                }
            }
        } catch(err) {}

    }



    // 防抖函数延迟执行事件
    let divClick = function () {
         downloadInit();
    }

    // 封装防抖函数
    function debounce(fn, delay, ...arg) {
        let timer = null;
        return function () {
            timer && clearTimeout(timer);
            timer = setTimeout(() => {
                fn.apply(this, arg);
            }, delay)
        }
    }


     // 监测事件
    document.addEventListener("DOMContentLoaded", function () {
        document.addEventListener("wheel", debounce(divClick,1000),false);
        document.addEventListener("click", debounce(divClick,1000),false);
    });

    //嗅探
    let config = {entryTypes: ['resource', 'mark', 'measure']};
    let monitor = new PerformanceObserver(list => {
        try {
            list.getEntries().forEach(entry => {
                let xhr=decodeURIComponent(entry.name).replace(/[\\]/g, '');
                if(xhr.match(/tos\-cn\-ve/)){
                    Warehouse.push(xhr);
                    console.log(7008,xhr);
                    downloadInit();
                    throw Error();
                }
            });
        } catch(err) {}
    });
    monitor.observe(config);
    window.performance.mark('registered-observer');

})();

