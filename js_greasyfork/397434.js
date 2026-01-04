
// ==UserScript==
// @name		B站广告屏蔽+隐藏部分板块+自定义背景
// @namespace           http://tampermonkey.net/
// @version		1.003
// @author		Original author：tjxwork    The second author：DengD
// @license          	MIT
// @description	        适配了新版本，去除了左侧小电视、帮助，右侧滑动条等内容，体验更清爽，添加了自定义背景功能
// @include		*://*bilibili.com/*
// @downloadURL https://update.greasyfork.org/scripts/397434/B%E7%AB%99%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD%2B%E9%9A%90%E8%97%8F%E9%83%A8%E5%88%86%E6%9D%BF%E5%9D%97%2B%E8%87%AA%E5%AE%9A%E4%B9%89%E8%83%8C%E6%99%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/397434/B%E7%AB%99%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD%2B%E9%9A%90%E8%97%8F%E9%83%A8%E5%88%86%E6%9D%BF%E5%9D%97%2B%E8%87%AA%E5%AE%9A%E4%B9%89%E8%83%8C%E6%99%AF.meta.js
// ==/UserScript==



(function() {var css = "";

 if (false || (new RegExp("^https://www.bilibili.com/")).test(document.location.href))
                 css += [

                     /*横条广告*/
                     ".banner-card {display: none;}",
                     /*左侧小电视*/
                     ".mascot {display: none;}",
                     ".ear {display: none;}",
                     /*右侧滑动条*/
                     ".elevator {display: none;}",
                     ".list-box {display: none;}",
                     /*左侧帮助按钮*/
                     ".contact-help {display: none;}",
                     /*最下方导航*/
                     ".international-footer {display: none;}",

                     "#bili_app {display: none;}",

                     /*推广*/
                     "#reportFirst2 {display: none;}",

                     /*直播*/
                     "#bili_live {display: none;}",
                     ".nav-list>[sortindex=\"0\"] {display: none;}",

                     /*国创*/
                     "#bili_guochuang {display: none;}",
                     ".nav-list>[sortindex=\"2\"] {display: none;}",

                     /*漫画*/
                     "#bili_manga {display: none;}",
                     ".nav-list>[sortindex=\"3\"] {display: none;}",

                     /*音乐*/
                     "#bili_music {display: none;}",
                     ".nav-list>[sortindex=\"4\"] {display: none;}",

                     /*舞蹈*/
                     "#bili_dance {display: none;}",
                     " .nav-list>[sortindex=\"5\"] {display: none;}",

                     /*阅读*/
                     "#bili_read {display: none;}",
                     " .nav-list>[sortindex=\"15\"] {display: none;}",


                     /*时尚*/
                     "#bili_fashion {display: none;}",
                     ".nav-list>[sortindex=\"11\"] {display: none;}",

                     /*娱乐*/
                     "#bili_ent {display: none;}",
                     " .nav-list>[sortindex=\"13\"] {display: none;}",

                     /*特别推荐(最后一行)*/
                     " #bili_report_spe_rec {display: none;}",


                     /*如需更换背景，将背景上传至图床后，粘贴连接至url后即可*/
                     "html:not([stylus-iframe]) body:before { content: '';    opacity: .3; position: fixed;    top: 0;    right: 0;    bottom: 0;    left: 0;    z-index: -100;    background-image: url(https://s2.ax1x.com/2020/03/06/3LxWBd.jpg);    background-position: center bottom;    background-attachment: fixed;    background-repeat: no-repeat; }",
                     /*如需取消部分屏蔽功能，请删除对应代码*/
                     "body:after { content: ''; position: fixed; top: 0;  bottom: 0;   left: 0;    right: 0;    width: 1700px;    margin: auto;    background-image: linear-gradient(to right, transparent, rgba(255, 255, 255, 1) 120px, rgba(255, 255, 255, 1) calc(100% - 120px), transparent);    z-index: -1;},"



                 ].join("\n");
if (false || (new RegExp("^(http|https)://bangumi.bilibili.com/anime/(\\d*|\\d*\\/)$")).test(document.location.href))
                 css += [

                 ].join("\n");
             else {
                 var node = document.createElement("style");
                 node.type = "text/css";
                 node.appendChild(document.createTextNode(css));
                 var heads = document.getElementsByTagName("head");
                 if (heads.length > 0) {
                     heads[0].appendChild(node);
                 }
                 var bodys = document.getElementsByTagName("body");
                 if (bodys.length > 0) {
                     bodys[0].appendChild(node);
                 }
             }

            })();
