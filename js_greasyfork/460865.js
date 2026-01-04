// ==UserScript==
// @name         AcFun屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  acfun屏蔽!
// @author       You
// @match        https://live.acfun.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460865/AcFun%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/460865/AcFun%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==
//


// 显示时间
function showTime()
{
    const nowdate = new Date();
    var year = nowdate.getFullYear();
    var month = nowdate.getMonth() + 1;
    var date = nowdate.getDate();
    var day = nowdate.getDay();
    var week = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    var h = nowdate.getHours();
    var m = nowdate.getMinutes();
    var s = nowdate.getSeconds();
    return year + "年" + month + "月" + date + "日" + week[day] + " " + h + ":" + m + ":" + s;
}

let imageAddressSet = new Set();

// 检查直播列表
function checkLiveListItem()
{
    let zhiboList = document.getElementsByClassName("live-list-item list-item");
    let blackList = new Set(["10506739", "38393515"]);

    let hrefLabel = "";
    let idValue = "";
    let idPos = 0;

    let imageSrc = "";
    let imageAddress = "";
    let imageAddressPos = 0;

    for (let count = 0; count < zhiboList.length; count++)
    {
        if (blackList.size === 0)
        {
            break;
        }

        hrefLabel = zhiboList[count].firstElementChild;
        idPos = hrefLabel.href.lastIndexOf('/');
        idValue = hrefLabel.href.substring(idPos + 1);

        if (blackList.has(idValue))
        {
            // 获取图片路径然后存储
            imageSrc = hrefLabel.children[1].firstElementChild.src;
            //console.log(imageSrc12.tagName); // tagName 输出标签名
            //console.log(imageSrc12.className); // className 输出标签的 class 的字符串 例如 <p class="123">
            if (imageSrc)
            {
                imageAddressPos = imageSrc.lastIndexOf('?');
                imageAddress = imageSrc.substring(0, imageAddressPos);
                imageAddressSet.add(imageAddress);
                //console.log("获取图片路径然后存储" + imageAddress);
            }
            zhiboList[count].remove();
            blackList.delete(idValue);
            imageSrc = "";
        }
    }

    checkSideWrapper();
}

// 检查大电视
function checkSideWrapper()
{
    //console.log("imageAddressSet size", imageAddressSet.size);
    if (imageAddressSet.size)
    {
        let side_wrapper_list = document.getElementsByClassName("side-item ");
        let imageSrc = "";
        let imageAddress = "";
        let imageAddressPos = 0;

        for (let count = 0; count < side_wrapper_list.length; count++)
        {
            imageSrc = side_wrapper_list[count].firstElementChild.firstElementChild.src;
            imageAddressPos = imageSrc.lastIndexOf('?');
            imageAddress = imageSrc.substring(0, imageAddressPos);

            if (imageAddressSet.has(imageAddress))
            {
                side_wrapper_list[count].remove();
                imageAddressSet.delete(imageAddress);
                //console.log("大电视" + imageAddress);
                imageSrc = "";
            }
        }
    }

    console.log("AcFun 屏蔽执行完毕 " + showTime());
}

(function() {
    'use strict';
    // Your code here...

    // 定时执行
    let time = 30000; // 1000 = 1秒, 这里是30秒
    setInterval(() => {checkLiveListItem()}, time);
    // Your code here...
})();