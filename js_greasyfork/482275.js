// ==UserScript==
// @name         Shark BWeb
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  清除附加
// @author       Shark
// @match        https://www.bilibili.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482275/Shark%20BWeb.user.js
// @updateURL https://update.greasyfork.org/scripts/482275/Shark%20BWeb.meta.js
// ==/UserScript==


//删除定位
function del(e){
    if (document.querySelector(e)) {
        document.querySelector(e).parentNode.removeChild(document.querySelector(e));
    }
}
//删除元素
function delad(){
    var a = document.querySelectorAll(".feed-card")

    function dele(e){
        e.parentNode.removeChild(e);
    }
    a.forEach(e => {
        if(e.querySelector(".bili-video-card__info--ad")!=null){
            dele(e)
        }
    });

}

// 阻止默认的滚动行为函数
function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.returnValue = false;
}

// 监听滚动事件
function disableScroll() {
    window.addEventListener('wheel', preventDefault, { passive: false });
}



(function () {

    // 调用函数来禁用滚动
    disableScroll();
    //删除轮播
    del("#i_cecream > div.bili-feed4 > main > div.feed2 > div > div.container.is-version8 > div.recommended-swipe.grid-anchor")
    //设置超出
    setTimeout(function() {
        document.querySelector("#i_cecream > div.bili-feed4 > main > div.feed2 > div > div.container.is-version8 > div:nth-child(6)").style.marginTop = "40px";
        document.querySelector("#i_cecream > div.bili-feed4 > main > div.feed2 > div > div.container.is-version8 > div:nth-child(7)").style.marginTop = "40px";
    }, 10); // 1000 毫秒 = 1 秒


    //删除广告和推广
    delad()

    // 一秒后执行函数 x

    setTimeout(function() {
        if(document.querySelector("#i_cecream > div.bili-feed4 > main > div.feed2 > div > div.container.is-version8 > div:nth-child(10)").classList.contains("floor-single-card")){
            del("#i_cecream > div.bili-feed4 > main > div.feed2 > div > div.container.is-version8 > div:nth-child(10)")
        }
        console.log("ok")




        //将刷新绑定
        document.querySelector("#i_cecream > div.bili-feed4 > main > div.feed2 > div > div.feed-roll-btn > button").addEventListener("click",function (){

            setTimeout(function() {
                document.querySelector("#i_cecream > div.bili-feed4 > main > div.feed2 > div > div.container.is-version8 > div:nth-child(6)").style.marginTop = "40px";
                document.querySelector("#i_cecream > div.bili-feed4 > main > div.feed2 > div > div.container.is-version8 > div:nth-child(7)").style.marginTop = "40px";
            }, 1000); // 1000 毫秒 = 1 秒
            delad()

        })
        
    }, 2000); // 1000 毫秒 = 1 秒











    // Your code here...
})();