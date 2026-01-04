// ==UserScript==
// @name         从chrome插件市场下载crx文件
// @name:en      download crx from chrome extention store
// @namespace    https://chrome.google.com/
// @version      0.3
// @description  给chrome插件市场页面添加一个下载crx文件的按钮
// @description:en  Add a button what click to download crx from chrome extention store
// @match        https://chrome.google.com/webstore/detail/*
// @author       Arcret
// @license      MIT
// @supportURL   https://gist.github.com/LiuQixuan/323e58b3e743ccb7fbc2f5c644f82618
// @icon         https://ssl.gstatic.com/chrome/webstore/images/icon_144px.png
// @grant        none
// @run-at document-end

/* jshint esversion: 6 */
/* jshint esversion: 10 */
// @downloadURL https://update.greasyfork.org/scripts/421435/%E4%BB%8Echrome%E6%8F%92%E4%BB%B6%E5%B8%82%E5%9C%BA%E4%B8%8B%E8%BD%BDcrx%E6%96%87%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/421435/%E4%BB%8Echrome%E6%8F%92%E4%BB%B6%E5%B8%82%E5%9C%BA%E4%B8%8B%E8%BD%BDcrx%E6%96%87%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let version = "103.0.1264.77"
    let appid = location.pathname.split('detail/')[1].split('/')[1]
    let appname = location.pathname.split('detail/')[1].split('/')[0]
    let downloadurl = `https://clients2.google.com/service/update2/crx?response=redirect&prodversion=${version}&acceptformat=crx3&x=id%3D${appid}%26installsource%3Dondemand%26uc`
    let downloadInnerText = /zh/i.test( navigator.language)?(/(?:tw)|(?:hk)/i.test(navigator.language)?'下載CRX文檔':'下载CRX文件'):'Download CRX File'
    let html = `<style>
        .h-e-f-Ra-c.e-f-oh-Md-zb-k>div[role="button"]:nth-of-type(1):hover{
            background-color: #174EA6;
        }
    </style>
    <div role="button" style="margin-right:20px;display:inline-block" class="g-c g-c-wb">
        <div class="g-c-Hf">
            <div class="g-c-x">
                <a style="color:white;text-decoration: none;" href="${downloadurl}" download="${appname}">${downloadInnerText}</a>
            </div>
        </div>
    </div>`
    setTimeout(()=>document.querySelector('.h-e-f-Ra-c.e-f-oh-Md-zb-k')?.insertAdjacentHTML('afterbegin', html),5000)
})();