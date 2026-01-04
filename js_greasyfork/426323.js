// ==UserScript==
// @name         删除百度其他人都在搜
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  移除百度搜索的  其他人都在搜 以及 底部的相关搜索
// @author       tyl
// @connect    baidu.com
// @include    *://ipv6.baidu.com/*
// @include    *://www.baidu.com/*
// @include    *://www1.baidu.com/*
// @include    *://m.baidu.com/*
// @include    *://xueshu.baidu.com/s*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426323/%E5%88%A0%E9%99%A4%E7%99%BE%E5%BA%A6%E5%85%B6%E4%BB%96%E4%BA%BA%E9%83%BD%E5%9C%A8%E6%90%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/426323/%E5%88%A0%E9%99%A4%E7%99%BE%E5%BA%A6%E5%85%B6%E4%BB%96%E4%BA%BA%E9%83%BD%E5%9C%A8%E6%90%9C.meta.js
// ==/UserScript==

//-----------------------------------------------------------------------------------------
//0.配置相关
//是否移除其他人都在搜
var otherFlag = true;
//是否移除 相关搜索
var rsFlag = true;

// 具体的广告移除函数
function removeAd() {


    //①移除 其他人都在搜
    if (otherFlag) {
        var nodeList = document.querySelectorAll('div[tpl="recommend_list"]');

        debugger
        for (let i = 0; i < nodeList.length; i++) {
            nodeList[i].style.display = 'none'
        }
    }

    //②移除底部的 相关搜索
    if (rsFlag) {
        var rsNode = document.getElementById("rs");
        debugger

        if (rsNode) {
            // console.log("尝试删除rsNode")
            rsNode.style.display = 'none'
        }
    }


}

//去除广告的相关步骤
function reload() {
//-----------------------------------------------------------------------------------------
//0.一开始就执行一次
    removeAd();
//-----------------------------------------------------------------------------------------
//2.每次点击列表时再移除一次广告
//给整个内容父标签绑定点击事件，当子标签被点击则冒泡，触发移除广告的函数
    let content_left = document.querySelector('#content_left');

    //用onclick是因为，他只能绑定一次，可以避免重复绑定事件
    content_left.onclick = function (event) {
        //每次点击，就调用一次移除广告的函数。因为广告是根据点击内容来获取的
        removeAd();
    }
//-----------------------------------------------------------------------------------------
//3.给每个点击后会出现 ‘为你推荐’ 的盒子，添加点击事件
    var seDefaultList = document.querySelectorAll('div[tpl="se_com_default"]');

    for (let i = 0; i < seDefaultList.length; i++) {

        seDefaultList[i].searchCount = 0;//记录查找次数

        //用onclick是因为，他只能绑定一次，可以避免重复绑定事件
        seDefaultList[i].onclick = function () {
            //去除此元素下面的广告 为你推荐 wntj
            //此时可能还没加载出来，如果没加载处理，等待200毫米再执行一次
            seDefaultList[i].tempInterval = setInterval(function () {
                var wntj = seDefaultList[i].querySelector('.new-pmd');//开始查找 ‘为你推荐’
                seDefaultList[i].searchCount++;//每找一次记录一次
                console.log('找一次')
                if (wntj) {
                    console.log('找到了')
                    wntj.style.display = 'none';//如果找到了，就隐藏
                    clearInterval(seDefaultList[i].tempInterval);//清除定时器
                } else if (seDefaultList[i].searchCount > 10) {
                    //超过5次还没找到，就不找了
                    console.log('不找了')
                    clearInterval(seDefaultList[i].tempInterval);
                }
            }, 200)
        };

    }
}

//一开始调用一次
reload();

//4. 因为每次更新页面数据，之前选择的对象都会重置。所以每隔1秒绑定一次事件
setInterval(function () {
    reload();
}, 1000);

