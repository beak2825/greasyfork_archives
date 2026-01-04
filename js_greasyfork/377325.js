// ==UserScript==
// @name         保持专注_keepFocused
// @namespace    http://tampermonkey.net/
// @version      2021.4.25.2229
// @description  临时屏蔽指定url，给自己一个清净(只屏蔽首页，防止摸鱼，但详情页不屏蔽，便于从搜索引擎进入查找资料)
// @author       番茄导弹
// @match        *://*/*
// @grant        none
// @license MIT
// @copyright 2019, https://greasyfork.org/zh-CN/scripts/377325-keepfocused
// @downloadURL https://update.greasyfork.org/scripts/377325/%E4%BF%9D%E6%8C%81%E4%B8%93%E6%B3%A8_keepFocused.user.js
// @updateURL https://update.greasyfork.org/scripts/377325/%E4%BF%9D%E6%8C%81%E4%B8%93%E6%B3%A8_keepFocused.meta.js
// ==/UserScript==




// =======================================
// =======================================
// ============ 配置文件开始 ===============
// =======================================
// =======================================

//这里是黑名单
var 黑名单 = [
    "test.com", // 只屏蔽 test.com, 不会屏蔽 www.test.com
    "www.test.com", //只屏蔽 www.test.com, 不会屏蔽 其他子域名
     "test.com/hot", // 只屏蔽 test.com/hot （test.com域名下的hot主目录）
    // 暂不支持通配符，后续可能会支持 "*.test.com", // 会屏蔽test.com和 任意子域名的test.com（如www.test.com, abc.test.com，等等）


    "zhihu.com/hot", "www.zhihu.com/hot", // 知乎hot页
    "V2ex.com", "www.V2ex.com", // v2ex 首页
    "zhihu.com", "www.zhihu.com", // 知乎首页

    "bilibili.com","www.bilibili.com",// bilibili首页
    "youtube.com","www.youtube.com",// bilibili首页

];

var 提示 = "懵逼树上懵逼果，懵逼树下你和我"; // 拦截网址后的提示文字

var 弱提示 = "来自 keepFocused on Tampermonkey的问候"; // 友情提示

// =======================================
// =======================================
// ============ 配置文件结束 ===============
// =======================================
// =======================================


// =======================================
// =======================================
// ============ 核心代码开始 ===============
// =======================================
// =======================================

(function() {
    'use strict';

    // Your code here...

    黑名单 = 黑名单.map(t => {
        t = t.toLowerCase() // 全部转换为小写，防止失误域名用了大写
        if(t.substr(t.length-1,1)=="/"){// 删除结尾的斜杠 /
            t.substring(0, t.length - 1);
        }

        return t

    });

    var url=new URL(window.location.href) // 获取当前打开的网址


    if(黑名单.indexOf(url.host) >= 0){ // 如果当前网址在黑名单, 就执行if语句内的代码
        //console.log("当前网址在黑名单< from keepFocused on Tampermonkey")

          if(url.pathname=="/"){// 当前页面是根目录，直接拉黑

                console.log("1当前网址在黑名单 < from keepFocused on Tampermonkey");
                document.body.innerHTML= "<div style=\"display: flex;justify-content: center;align-items: center;\"><h1 style=\"margin-top: 40px;font-size: 50px\">" + 提示 + "</h1></div><span style=\" font-size: small; color: #e0dbdb; \">" + 弱提示 + "<span>";

          }else{ // 如果当前页面不是网站根目录，将继续判断当前url是否被拉黑

             //  console.log("黑名单网址-当前页面不是网站根目录,< from keepFocused on Tampermonkey")

            if( 黑名单.indexOf(url.host+url.pathname) >= 0){ // 如果当前url 在黑名单
               // console.log("黑名单网址- 当前url 在黑名单< from keepFocused on Tampermonkey")


                console.log("2当前网址在黑名单 < from keepFocused on Tampermonkey");
                document.body.innerHTML= "<div style=\"display: flex;justify-content: center;align-items: center;\"><h1 style=\"margin-top: 40px;font-size: 50px\">" + 提示 + "</h1></div><span style=\" font-size: small; color: #e0dbdb; \">" + 弱提示 + "<span>";
            }

          }





       
    }


})();

// =======================================
// =======================================
// ============ 核心代码结束 ===============
// =======================================
// =======================================

