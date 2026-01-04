// ==UserScript==
// @name         Bangumi哀悼模式
// @namespace    http://tampermonkey.net/
// @version      2025-01-09
// @description  为Bangumi启用哀悼模式
// @license      MIT
// @author       Justitia
// @match        https://bgm.tv/
// @match        https://bangumi.tv/
// @match        https://chii.in/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bgm.tv
// @require     https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/523543/Bangumi%E5%93%80%E6%82%BC%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/523543/Bangumi%E5%93%80%E6%82%BC%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 哀悼日期
    const anniversaryList = [
    1.12, //1947年同日知名地下党员刘胡兰同志被反动派残忍杀害，享年仅14岁。
    1.13, //1988年同日蒋经国逝世。
    1.14, //1938年同日新疆军阀盛世才清洗异已，杀300多人。
    1.15, //1970年同日云南省通海县发生7.5级地震，造成至少15,621人死亡。
    1.18, //国际小熊维尼日。
    1.19, //1895年甲午海战中日军从成山头登陆，后进占威海卫。
    1.20, //1841年同日香港遭英军控制。
    1.24, //印度萝莉节
    1.25, //1941年同日日军残忍杀害1237名村民，史称潘家峪惨案
    1.27, //国际大屠杀纪念日
    1.28 //1932年同日，一二八事变爆发
    ]

    const today = dayjs();
    if(anniversaryList.includes(Number(today.format('M.D')))){
    GM_addStyle(`*{
    filter: grayscale(100%);
    filter: gray;
    }`)
    }

})();