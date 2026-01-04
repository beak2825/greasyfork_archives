// ==UserScript==
// @name        UWA 替换页签脚本
// @namespace   Violentmonkey Scripts
// @match       https://www.uwa4d.com/u/got/*
// @match       https://www.uwa4d.com/u/pipeline/*
// @require     https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @grant       GM_getValue
// @version     1.1
// @author      Isle
// @description 2022/11/29 下午7:10:49
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460551/UWA%20%E6%9B%BF%E6%8D%A2%E9%A1%B5%E7%AD%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/460551/UWA%20%E6%9B%BF%E6%8D%A2%E9%A1%B5%E7%AD%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(function () {
    'use strict';

    window.onload = function () {
        setTimeout(function () {
            //console.log("替换页签")
            //var title = 'Title'
            var titleInfoList = document.getElementsByClassName('el-breadcrumb__inner')
            var titleString = ''
            //            var i;
            //            for (i = 0; i < titleInfoList.length; i++) {
            //                titleString = titleString+'|'+titleInfoList[i].textContent.toString();
            //                console.log(titleInfoList[i]);
            //            }
            //    titleInfoList.forEach(element => {
            //        titleString = titleString+'|'+element;
            //    });
            var mainTitleList = document.querySelector('.cascader-wrapper .title')
            titleString = ''+titleInfoList[0].textContent.replace(/^\s*|\s*$/g,"") + '-' + mainTitleList.textContent.replace(/^\s*|\s*$/g,"") +'-' + titleInfoList[2].textContent.replace(/^\s*|\s*$/g,"");
            document.getElementsByTagName("title")[0].innerText = titleString;
        }, 1000);
    }
    setTimeout(function () {
            //console.log("替换页签")
            //var title = 'Title'
            var titleInfoList = document.getElementsByClassName('el-breadcrumb__inner')
            var titleString = ''
            //            var i;
            //            for (i = 0; i < titleInfoList.length; i++) {
            //                titleString = titleString+'|'+titleInfoList[i].textContent.toString();
            //                console.log(titleInfoList[i]);
            //            }
            //    titleInfoList.forEach(element => {
            //        titleString = titleString+'|'+element;
            //    });
            var mainTitleList = document.querySelector('.cascader-wrapper .title')
            titleString = ''+titleInfoList[0].textContent.replace(/^\s*|\s*$/g,"") + '-' + mainTitleList.textContent.replace(/^\s*|\s*$/g,"") +'-' + titleInfoList[2].textContent.replace(/^\s*|\s*$/g,"");
            document.getElementsByTagName("title")[0].innerText = titleString;
        }, 1000);

})();