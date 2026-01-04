// ==UserScript==
// @name         网梯课堂助手————继续教育网课自动挂机脚本
// @namespace    1620535041@qq.com
// @version      1.7
// @description  自动挂机网梯课堂
// @homepage     https://www.zhaofupeng.com/
// @author       zfp123123
// @match        *://*.webtrn.cn/learnspace/learn/learn/*/index.action*
// @run-at       document-start
// @require      https://greasyfork.org/scripts/18715-hooks/code/Hooks.js?version=661566
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/397336/%E7%BD%91%E6%A2%AF%E8%AF%BE%E5%A0%82%E5%8A%A9%E6%89%8B%E2%80%94%E2%80%94%E2%80%94%E2%80%94%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E8%AF%BE%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/397336/%E7%BD%91%E6%A2%AF%E8%AF%BE%E5%A0%82%E5%8A%A9%E6%89%8B%E2%80%94%E2%80%94%E2%80%94%E2%80%94%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E8%AF%BE%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

const NEXT_TAG_TEXT = `<span style="color:#19be6b;">【自动下一P】</span> `;

function nextP(){

}

function findVideo(element){
    if(!element) element = [window.document];
    for(let item of element){
        let document = item.nodeName === 'IFRAME' ? item.contentDocument : item;
        let videos = document.querySelectorAll('video');
        if(videos.length > 0){
            return videos;
        } else if (document.querySelectorAll('iframe').length > 0){
            let res = findVideo(document.querySelectorAll('iframe'));
            if(res) return res;
        }
    }
}

function autoPlay() {
    const mainContent = document.getElementsByClassName('contentIframe')[0];
    mainContent.addEventListener("load",function(){
        const mainFrame = mainContent.contentDocument.getElementById("mainFrame");
        mainFrame.addEventListener("load",function(){
            const $ = window.jQuery;
            //视频重新加载时再执行一次脚本
            mainFrame.addEventListener("load",function(){autoPlay();});
            if(location.pathname.indexOf('blue') > -1)
            {
                const menus = [...$(mainContent).contents().find(".vcon").find("li")];            //左侧菜单
                const selectMenu = $(mainContent).contents().find(".vcon").find("li.select")[0];  //当前选中的菜单
                const selectMenuIndex = menus.findIndex(e=>e===selectMenu);                          //当前选中菜单的游标

                const nextBtn = $(mainContent).contents().find(".rtarr")[0];                      //标签栏下一个按钮
                const tabs = [...$(mainContent).contents().find(".menub")];                       //标签栏
                const selectTab = $(mainContent).contents().find(".menubu")[0];                   //当前选中的标签
                const selectTabIndex = tabs.findIndex(e=>e===selectTab);                             //当前选中标签的游标

                nextP = function(){
                    if(tabs.length - selectTabIndex >1){
                        nextBtn.click();
                    }else if(menus.length - selectMenuIndex > 1){
                        menus[selectMenuIndex + 1].click();
                        $(menus[selectMenuIndex + 1]).find("a").click()
                    }
                }
            }else if(location.pathname.indexOf('templatethree') > -1 ||
                     location.pathname.indexOf('templateeight') > -1)
            {
                const title = $(mainFrame).contents().find(".s_title").text();
                const items = [...$(mainContent).contents().find('.s_point').filter("[itemtype='video']")];
                const selectedItem = items.find(e=>e.children[2].innerText.match(title));
                const selectedItemIndex = items.indexOf(selectedItem);
                items.forEach((i)=>{
                    if(i.children[2].innerHTML.match(NEXT_TAG_TEXT)){
                        i.children[2].innerHTML = i.children[2].innerHTML.replace(NEXT_TAG_TEXT,'');
                    }
                });

                if(items.length - selectedItemIndex > 0){
                    const nextItem = items[selectedItemIndex + 1];
                    if(!nextItem.children[2].innerHTML.match(NEXT_TAG_TEXT)){
                        nextItem.children[2].innerHTML = `${NEXT_TAG_TEXT}${nextItem.children[2].innerText}`;
                    }
                    nextP = function(){
                        nextItem.click();
                    }
                }
            }

            let interval = setInterval(() => {
                let videos = findVideo();
                if(videos && videos.length > 0){
                    for(let v of videos){
                        v.addEventListener('ended',function(){
                            videoIntervals.forEach(e=>clearInterval(e));
                            nextP();
                        });
                        videoIntervals.push(setInterval(() => {
                            if( v.volume !== 0)
                                v.volume = 0;
                            if(v.playbackRate !== 1.5)
                                v.playbackRate = 1.5;
                        }, 100));
                    }
                    clearInterval(interval);
                }
            }, 100);

            const studyType = $(mainFrame)[0].contentWindow._maq[11][1];
            if(!(studyType !== 'video' || studyType !== 'courseware'))
            {
                nextP();
            }

        });
    });
}

var videoIntervals =[];

(function() {
    'use strict';
    /**
     * 关闭30分钟每次的检查
     */
    Hooks.set(window, "jQuery", function ( target, propertyName, ignored, jQuery ) {
        Hooks.method(jQuery, "studyTime", function ( target, methodName, method, thisArg, args ) {
            args[0].clickAuth = false;
            args[0].periodRemind = false;
            args[0].randomRemind = false;
            console.log('已关闭30分钟每次的检查');
            return Hooks.Reply.method( arguments );
        });
        return Hooks.Reply.set( arguments );
    });
    document.addEventListener('DOMContentLoaded',function(){
        autoPlay();
    });
})();