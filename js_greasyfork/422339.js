// ==UserScript==
// @name         知乎屏蔽盐选
// @namespace    https://github.com/KingCheni/Zhihu-Block-YanXuan
// @version      1.1
// @description  一键屏蔽知乎的盐选内容
// @author       KingChen
// @match        https://*.zhihu.com/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/422339/%E7%9F%A5%E4%B9%8E%E5%B1%8F%E8%94%BD%E7%9B%90%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/422339/%E7%9F%A5%E4%B9%8E%E5%B1%8F%E8%94%BD%E7%9B%90%E9%80%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let zhihu = {};
    zhihu.init = () => {
        const STYLE = `
        <style>
            @font-face {
                font-family: 'iconfont';  /* project id 2391192 */
                src: url('//at.alicdn.com/t/font_2391192_433g5hxfntq.eot');
                src: url('//at.alicdn.com/t/font_2391192_433g5hxfntq.eot?#iefix') format('embedded-opentype'),
                url('//at.alicdn.com/t/font_2391192_433g5hxfntq.woff2') format('woff2'),
                url('//at.alicdn.com/t/font_2391192_433g5hxfntq.woff') format('woff'),
                url('//at.alicdn.com/t/font_2391192_433g5hxfntq.ttf') format('truetype'),
                url('//at.alicdn.com/t/font_2391192_433g5hxfntq.svg#iconfont') format('svg');
            }
            .iconfont {
                font-family: "iconfont" !important;
                font-size: 16px;
                font-style: normal;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
            .icon-zhihu:before {
                content: "\\e600";
            }
            .helper-btn{
                position:fixed;
                top:100px;
                right:50px;
                z-index:1;
            }
            .helper-icon{
                position:relative;
                display:inline-block;
                font-size:18px;
                padding:10px;
                margin:0;
                border-radius:50%;
                cursor:pointer;
                transform:scale(1);
                transition:transform 300ms ease 0s, border-radius 200ms ease 0s, opacity 0.2s ease 0s;
            }
            .color-default{
                color:#fff;
                background-color:#0066ff;
                box-shadow:rgb(0 102 255 / 60%) 0px 1px 4px 0px;
            }
            .helper-icon:hover{
                opacity:.8;
            }
            .helper-icon:active{
                transform:scale(0.9);
            }
            .helper-tip{
                display:block;
                position:absolute;
                right:-5px;
                bottom:-2px;
                border-radius:20px;
                background-color:#f44336;
                font-size:10px;
                padding-left:4px;
                padding-right:4px;
                margin: 0;
                font-style:normal;
            }
            .helper-tip[data-value='0']{
                display:none;
            }
        </style>
        `;
        const HTML = `<div class="helper-btn"><span class="helper-icon color-default iconfont icon-zhihu"><i class="helper-tip" data-value="0">0</i></span></div > `;
        $("head").append(STYLE);
        $("body").append(HTML);
    }
    zhihu.setTipValue = () => {
        let value = parseInt($(".helper-tip").attr("data-value"));
        value++;
        $(".helper-tip").attr("data-value", value);
        $(".helper-tip").text(value);
    }
    zhihu.blockFunction = (obj) => {
        zhihu.setTipValue();
        $(obj.this).attr("data-hidden", "true");
        $(obj.this).hide()
        console.log($(obj.this));
    }
    zhihu.match = (obj) => {
        if (obj.fullMatch) {
            if (obj.text === obj.value) {
                zhihu.blockFunction(obj);
            }
        } else {
            if (obj.text.indexOf(obj.value) != -1) {
                zhihu.blockFunction(obj);
            }
        }
    }
    zhihu.blockAccount = (obj) => {
        obj.text = $(obj.this).find(".UserLink-link").text();
        obj.fullMatch = obj.fullMatch || false;
        zhihu.match(obj);
    }
    zhihu.blockTag = (obj) => {
        obj.text = $(obj.this).find(".KfeCollection-OrdinaryLabel-content").text()
        obj.fullMatch = obj.fullMatch || false;
        zhihu.match(obj);
    }
    zhihu.clear = () => {
        $(".Card").find(".List-item").each(function() {
            const tagValue = decodeURIComponent("%E7%9B%90%E9%80%89");
            const username = "盐选";
            if ($(this).attr("data-hidden") !== "true") {
                zhihu.blockTag({ this: this, value: tagValue })
                zhihu.blockAccount({ this: this, value: username })
            }
        })
    }
    zhihu.timer = setInterval(function() {
        if ($(".Card").find(".List-item").length > 0) {
            zhihu.clear();
            clearInterval(zhihu.timer);
        }
    }, 1000)
    zhihu.onMouseScroll = (e) => {
        //e.preventDefault();
        var wheel = e.originalEvent.wheelDelta || -e.originalEvent.detail;
        var delta = Math.max(-1, Math.min(1, wheel));
        if (delta < 0) {
            //console.log('向下滚动');
            zhihu.clear();
        } else {
            //console.log('向上滚动');
        }
    }
    $(document).on('mousewheel DOMMouseScroll', zhihu.onMouseScroll);
    zhihu.init();
})();
