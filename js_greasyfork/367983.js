// ==UserScript==
// @name         [skypesky 出品]电影天堂 电影天堂2018 阳光电影 在线电影迅雷下载(2019-02-24)最新版
// @author       skypesky
// @namespace    http://skypesky.cn/thunderdownload
// @version      19.02.24
// @description  点击链接直接迅雷下载视频,电视剧,游戏文件

// @include      http*://www.dytt8.net/html/*
// @include      http*://www.dy2018.com/*
// @include      http*://www.ygdy8.com/html/*

// @updateUrl    https://greasyfork.org/scripts/367983-%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82-%E7%94%B5%E5%BD%B1%E7%BD%91%E7%AB%99-%E7%82%B9%E5%87%BB%E9%93%BE%E6%8E%A5%E7%9B%B4%E6%8E%A5%E4%BD%BF%E7%94%A8%E8%BF%85%E9%9B%B7%E4%B8%8B%E8%BD%BD-skypesky/code/%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%20%E7%94%B5%E5%BD%B1%E7%BD%91%E7%AB%99%20%E7%82%B9%E5%87%BB%E9%93%BE%E6%8E%A5%E7%9B%B4%E6%8E%A5%E4%BD%BF%E7%94%A8%E8%BF%85%E9%9B%B7%E4%B8%8B%E8%BD%BD(skypesky).user.js
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367983/%5Bskypesky%20%E5%87%BA%E5%93%81%5D%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%20%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%822018%20%E9%98%B3%E5%85%89%E7%94%B5%E5%BD%B1%20%E5%9C%A8%E7%BA%BF%E7%94%B5%E5%BD%B1%E8%BF%85%E9%9B%B7%E4%B8%8B%E8%BD%BD%282019-02-24%29%E6%9C%80%E6%96%B0%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/367983/%5Bskypesky%20%E5%87%BA%E5%93%81%5D%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%20%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%822018%20%E9%98%B3%E5%85%89%E7%94%B5%E5%BD%B1%20%E5%9C%A8%E7%BA%BF%E7%94%B5%E5%BD%B1%E8%BF%85%E9%9B%B7%E4%B8%8B%E8%BD%BD%282019-02-24%29%E6%9C%80%E6%96%B0%E7%89%88.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const websiteConfigList = [{
            "url": "http://www.dytt8.net/html/gndy/jddy/*",
            'testUrl': 'http://www.dytt8.net/html/gndy/dyzz/20180508/56825.html',
            "description": "电影天堂",
            "rule": /\/\/www.dytt8.net\//,
            "copy": {
                "selector": "a[thunderpid]",
                "ruleList": [
                    /thunder:\/\/[^"']*/
                ],
                "removeEventArray": [
                    "click",
                ],
                "removeAtrributeArray": [
                    "onclick"
                ]
            },
            "paste": {
                "attr": "href",
            }
        },
        {
            "url": "http*://www.dy2018.com/i/*",
            'testUrl': 'https://www.dy2018.com/i/99185.html',
            "description": "电影天堂2018",
            "rule": /\/\/www.dy2018.com\//,
            "copy": {
                "selector": "a[thunderpid]",
                "ruleList": [
                    /thunder:\/\/[^"']*/
                ],
                "removeEventArray": [
                    "click",
                ],
                "removeAtrributeArray": [
                    "onclick"
                ]
            },
            "paste": {
                "attr": "href",
            }
        },
        {
            "url": "http*://www.ygdy8.com/* ",
            'testUrl': 'http://www.ygdy8.com/html/gndy/jddy/20161114/52499.html',
            "description": "阳光电影",
            "rule": /\/\/www.ygdy8.com\//,
            "copy": {
                "selector": "a[thunderpid]",
                "ruleList": [
                    /thunder:\/\/[^"']*/
                ],
                "removeEventArray": [
                    "click",
                ],
                "removeAtrributeArray": [
                    "onclick"
                ]
            },
            "paste": {
                "attr": "href",
            }
        },
    ];

    $(function () {
        Controller.run(websiteConfigList, (websiteConfig) => {
            ThunderDownload.changeLink(websiteConfig);
        });
    });

})();


const Controller = {
    select: function (websiteConfigList) {
        if (websiteConfigList == 'undefined' || !websiteConfigList || !websiteConfigList.length) {
            return -1;
        }
        // 获取当前的路径
        let url = window.location.href;
        // 匹配路径
        for (let i = 0; i < websiteConfigList.length; ++i) {
            if (websiteConfigList[i].rule.test(url)) {
                return i;
            }
        }
        return -1;
    },
    run: function (websiteConfigList, callback) {
        let index = this.select(websiteConfigList);
        if (index != -1) {
            console.log("路径匹配成功!" + websiteConfigList[index].description);
            callback(websiteConfigList[index]);
        } else {
            console.error("路径匹配失败!" + websiteConfigList[index].description);
        }
    }
}

const ValidTool = {
    arrayNotEmpty: function (arrayObject) {
        if (typeof arrayObject == "undefined" || !arrayObject || arrayObject.length == 0) {
            return false;
        }
        return true;
    },
    arrayIsEmpty: function (arrayObject) {
        return !this.arrayNotEmpty(arrayObject);
    },
    selectorIsNull: function (selector) {
        return $(selector).length == 0;
    }
}

const ThunderDownload = {
    // 移除某些属性
    removeAtrribute: function (selector, removeAtrributeArray) {
        if (ValidTool.arrayIsEmpty(removeAtrributeArray) || ValidTool.selectorIsNull(selector)) {
            return;
        }
        for (let i = 0; i < removeAtrributeArray.length; ++i) {
            $(selector).removeAttr(removeAtrributeArray[i]);
        }
    },
    /*
     **
     ** @desc: 移除某个元素的很多个事件,比如让body不再绑定onclick, onblur事件等等
     ** @param: selector => 元素选择器
     **         removeEventArray => 移除事件的列表
     **
     */
    removeEvent: function (selector, removeEventArray) {
        if (ValidTool.arrayIsEmpty(removeEventArray) || ValidTool.selectorIsNull(selector)) {
            return;
        }
        for (let i = 0; i < removeEventArray.length; ++i) {
            $(selector).unbind(removeEventArray[i]);
        }
    },
    // 从某个元素的内容中提取出下载链接来
    getDownloadUrl: function (selector, ruleList) {
        if (ValidTool.arrayIsEmpty(ruleList) || ValidTool.selectorIsNull(selector)) {
            return;
        }
        for (let i = 0; i < ruleList.length; ++i) {
            // 匹配成功返回匹配的字符串
            if (ruleList[i].test($(selector).prop('outerHTML'))) {
                return $(selector).prop('outerHTML').match(ruleList[i])[0];
            }
        }
        // 匹配失败返回null
        return null;
    },
    changeLink: function (websiteConfig) {
        // 注册一个定时器
        let task = setInterval(() => {
            // 获取所有要修改的链接元素
            let linkArray = $(websiteConfig.copy.selector);
            // 元素存在
            if (ValidTool.arrayNotEmpty(linkArray)) {

                // 即使是一部电视剧,也能完美支持
                for (let index = 0; index < linkArray.length; ++index) {

                    // one step, 去除改元素的onclick事件
                    this.removeEvent(linkArray[index], websiteConfig.copy.removeEventArray);



                    // two step, 获取下载链接
                    let downloadUrl = this.getDownloadUrl(linkArray[index], websiteConfig.copy.ruleList);

                    console.log("index: " + index);
                    console.log("downloadUrl: " + downloadUrl);

                    // 下载链接为null,跳过此次执行
                    if (!downloadUrl) {
                        continue;
                    }

                    // 给元素添加属性
                    $(linkArray[index]).attr(websiteConfig.paste.attr, downloadUrl);
                    // 去除元素的属性
                    this.removeAtrribute(websiteConfig.copy.selector, websiteConfig.copy.removeAtrributeArray);
                }
                // 关闭定时器
                clearInterval(task);
            }
        }, 50);
    },

};