// ==UserScript==
// @name         阿里翻译精简
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @license      MIT
// @description  阿里翻译精简精简
// @author       AiniyoMua
// @match        *://translate.alibaba.com/*
// @match        https://translate.alibaba.com/
// @home-url     https://greasyfork.org/zh-CN/scripts/452274
// @homepageURL  https://greasyfork.org/zh-CN/scripts/452274
// @grant        GM_addStyle
// @run-at       document-start
// @icon         data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAUFSURBVEhL1VZpV5NXEO7PtIAQEAuigLigVXAB0cqmRRCkPVi1+qW1VOgp9JStrQptj2DJQkISSEKAQBay7+HpzH2z5w2NX9rTOWcO4b33zjMz95m58xH+I/n/AEejh/B6Y3C75dXjiSMcTiR3F5cPAmbQlRUvHj/ewcijbVkdHbVidtaFSORo8A8CdjiiuNW1ifIKFT4ul9cyWrt02QC9IZg8JS8lAycSh5iedqJKoSYAJcqPq0jVOXqsbFWAK2o0+OZbmzhTTEoGdjqjaG01CMNnmnT4ccohojIaMzr9k0M4xFHf7TZhfz+aPF0oJQPPLzhxvEojgPvvW7C3F0muZISvov70mtjTcm4dy8u+5EqhlATMLG29tC4M1p1aw9yCC4cyWTykjwNDW2Jfda0Gkz/YBSHlpCTg7185KH1qkcLu7k04XcVTaKCUl1UoCVyJ4RErXAex5Equ/COw3R5FU5MUbfUJDV5N2hGPFydNKJRAW7tR7D9L6Vaq/CIT+XIkMO+fmLAnI1DhYqseNlsmWl7Ptsm/GfjFC5s4wxkaH7cjGIwnd2TkSGCTKYTmlnUyoEalQoOpKWdyRRK/P4E9Ym6CeoXPH4dmzS/Y3tG5IRxl7bptgtUaznGQpSgwe/5weAsVlVy3KlxpM4qWmC3v3nkx9tUOFohs/Pf8RT05yIBStLWfaNHTa4HZHCLgXOSiwCp1gOpVKwww8Nz8QU5D4H49OGQh4xqcalhL72M9cVKDe1RyP8+4oNcHEQrnhUsiCxyJHGJkZBuVVVK0Nzs2KK2Ze2IHfvn1AI3USFJgx8qUaGzW4fMBMxYX3aLOuV/npzglssBLv3vQ1Mx3q0JNrRqrq7mN4IBK5MFg5hrOnddjitrpuj5A5RNFLJZB4wpQa/zQ6oI51VAA7PPFMfjQSnclGf2M6jYQyH1plld8aL++gc4uE2YonVxy2dHx30AgLhweIlunG3UYeLAFf5adAmCl0ocLrVLdsq689+aki+/r/apf1KfXGy+oaf6fM3Z/YAujX2yLWmY7Tc1aWLcz7M4B5rv9+rlNlA5v7u83C3bnCx/OdoYZy1G/fuPG9Y5NcQXdvWZKfRB3e8ziyvjlervoSRM0DcyGODUXqCQYtLZOA40mIPu0MRDXLvdhmy2CJ0930XBGl77zunrq5/NSP/9ufJ9YLj0cTNLUdJIGZtZyx0lFy3fDY0y+8EFO2Zu3bgwPW6mcckuJf9/pNqfParVBqm8p3cx8NQXDjgtg9sxoDOHTq/zeKsl7LVaV/vT98UaPJyZYOzHpwLUbG1BQ3+a9bFBRrRYd7sbNDZykpsGjD9tkYR709JrS2Xg0ui1YL4CZkc8p2opKldgwRjMV1yEzc5dSOTPnwpdjO7jabkizXQDSpHH7jgkvX+7hjz892DQFheHdXeksK2cyO92NZ7X0usUkYMtWWHjMCwx8+YoBPX1m9BK5Om9toq5BiwrRTGjkofUGKg8eBmZmD2CxhImAcZEVjpIJ1tdvEWdT2nbNmG5GHNxvr90S8NKSR3xIRVJMT9Zp8eTZDv4iEnJG5B55/l5PjsqdT2nfPYsErKOu0kIRV9eooaAmn6M0SfBz+PTZrpirOHVxYjpHKCei3dKYy/deYIu0vl5Lr5xDAmbPmals2EADXLbyNx7amM3FwPKFB8N8Oyk10UsVpiYkgFnYppxZ8b00vLQctT+1lgb+dwX4G5Nnjg4jYjetAAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/452274/%E9%98%BF%E9%87%8C%E7%BF%BB%E8%AF%91%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/452274/%E9%98%BF%E9%87%8C%E7%BF%BB%E8%AF%91%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==

(function() {
// 注意！ 注意！ 注意！  请在设置的运行时期选择 document-start，以获得更好的无感知体验
// 注意！ 注意！ 注意！  请在设置的运行时期选择 document-start，以获得更好的无感知体验
let css = `
body{min-width:300px !important;}
textarea,#pre,.output-hint{line-height: 28px !important;font-size: 18px !important;font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif !important;}
.anticon.anticon-copy.copy{color: #5F6368 !important;font-size: 20px !important;}
.operate{bottom: 22px !important;}
.example{box-shadow:0 2px 2px rgba(0,0,0,.22) !important;}
.alicdn-icon{filter:invert(80%) !important;}
.banner{height: 0px; !important;}
.core-advantages{display: none !important;}
.mask-layer{display: none !important;}
.banner-title{display: none !important;}
.banner-button{display: none !important;}
.cases{display: none !important;}
.contact{display: none !important;}
.other{display: none !important;}
.scenarios{display: none !important;}
.footer{bottom:0px !important;position:fixed !important;width:100% !important;}
.address{background:rgba(0,0,0,0) !important;border-top: 0px !important;}
.translation-details{display: none !important;}
.smart-translation{height:100vh !important;}
.translation-title{display: none !important;}
`
// 匹配竖屏，避免产生奇奇怪怪的错位
// 更改输入框，输出框字体风格、字体大小、行高，使用谷歌翻译的风格
// 把复制按钮调大一些
// 复制按钮上移
// 输入框输出框添加阴影
// 把白色logo反相成黑色
// 其他的是屏蔽推广，我忘记哪个打哪个了，自己在控制台对比吧

// 注入css
GM_addStyle(css);
// 聚焦输入框
window.onload = function(){document.querySelector("#source").focus()};

// var title=document.querySelector("#core-translation > h1");
// title.innerText = "阿里翻译";
})();