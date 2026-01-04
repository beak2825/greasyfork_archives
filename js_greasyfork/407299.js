// ==UserScript==
// @resource icon1 http://tampermonkey.net/favicon.ico
// @name         customs
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  try to take over the world!
// @author       yao
// @match

// @include https://www.buyoyo.com/*
// @grant        none
//@require  http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/407299/customs.user.js
// @updateURL https://update.greasyfork.org/scripts/407299/customs.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    
    var button = $("<input class='myBtn' type='button' value='报关' />");
    button.css({
        "width":"70",
        "display": "inline-block",
        "zoom": "1",
        "display": "inline",
        "vertical-align": "baseline",
        "margin": "0 2px",
        "outline": "none",
        "cursor": "pointer",
        "height": "27px",
        "text-align": "center",
        "text-decoration": "none",
        "font": "14px/100% Arial, Helvetica, sans-serif",
        "text-shadow": "0 1px 1px rgba(0,0,0,.3)",
        "-webkit-border-radius": ".5em",
        "-moz-border-radius": ".5em",
        "border-radius": ".5em",
        "-webkit-box-shadow": "0 1px 2px rgba(0,0,0,.2)",
        "-moz-box-shadow": "0 1px 2px rgba(0,0,0,.2)",
        "box-shadow": "0 1px 2px rgba(0,0,0,.2)",
        "border": "solid 1px #555",
        "background": "#6e6e6e",
        "background": "-webkit-gradient(linear, left top, left bottom, from(#888), to(#575757))",
        "background": "-moz-linear-gradient(top,  #888,  #575757)",
        "filter":  "progid:DXImageTransform.Microsoft.gradient(startColorstr='#888888', endColorstr='#575757')"

    });

    button.click(function(){
        // 修改标题
        Array.prototype.slice.call( document.getElementById('cartForm').parentNode.getElementsByTagName('tr') ).flatMap(i=>Array.prototype.slice.call(i.getElementsByTagName('a'))).map(i=>i.innerHTML = i.innerHTML+ "(DVD版)")
        // 修改介质
        Array.prototype.slice.call( document.getElementById('cartForm').parentNode.getElementsByTagName('tr')).map(i=>Array.prototype.slice.call(i.getElementsByTagName('td'))[6]).filter(i=> typeof i !== 'undefined').map(i=>i.getElementsByTagName('b')[0]).filter(i=> typeof i !== 'undefined').map(i=>i.parentNode.parentNode.children[4].innerHTML="DVD")
        // 修改重量
        Array.prototype.slice.call( document.getElementById('cartForm').parentNode.getElementsByTagName('tr')).map(i=>Array.prototype.slice.call(i.getElementsByTagName('td'))[6]).filter(i=> typeof i !== 'undefined').map(i=>i.getElementsByTagName('b')[0]).filter(i=> typeof i !== 'undefined').map(i=>i.parentNode.parentNode.children[5].innerHTML="1.0(DU)")
        // 修改单价
        Array.prototype.slice.call( document.getElementById('cartForm').parentNode.getElementsByTagName('tr')).map(i=>Array.prototype.slice.call(i.getElementsByTagName('td'))[6]).filter(i=> typeof i !== 'undefined').map(i=>i.getElementsByTagName('b')[0]).filter(i=> typeof i !== 'undefined').map(i=>i.innerHTML = "HK$13.5")
        // 修改数量
        Array.prototype.slice.call( document.getElementById('cartForm').parentNode.getElementsByTagName('tr')).map(i=>Array.prototype.slice.call(i.getElementsByTagName('td'))[6]).filter(i=> typeof i !== 'undefined').map(i=>i.getElementsByTagName('b')[0]).filter(i=> typeof i !== 'undefined').map(i=>i.parentNode.parentNode.children[7].children[0].value=1)
        // 修改单行总价
         Array.prototype.slice.call( document.getElementById('cartForm').parentNode.getElementsByTagName('tr')).map(i=>Array.prototype.slice.call(i.getElementsByTagName('td'))[6]).filter(i=> typeof i !== 'undefined').map(i=>i.getElementsByTagName('b')[0]).filter(i=> typeof i !== 'undefined').map(i=>i.parentNode.parentNode.children[8].innerHTML = "HK$" + parseInt(i.parentNode.parentNode.children[7].children[0].value) * 13.5)
        // 修改总重量
        Array.prototype.slice.call(document.querySelector('#cartForm').parentNode.parentNode.nextElementSibling.nextElementSibling.nextElementSibling.getElementsByTagName('b'))[0].innerHTML = Array.prototype.slice.call( document.getElementById('cartForm').parentNode.getElementsByTagName('tr')).map(i=>Array.prototype.slice.call(i.getElementsByTagName('td'))[6]).filter(i=> typeof i !== 'undefined').map(i=>i.getElementsByTagName('b')[0]).filter(i=> typeof i !== 'undefined').map(i=>i.parentNode.parentNode.children[5]).length
        // 修改总价
        Array.prototype.slice.call(document.querySelector('#cartForm').parentNode.parentNode.nextElementSibling.nextElementSibling.nextElementSibling.getElementsByTagName('b'))[1].innerHTML = "HK$" + Array.prototype.slice.call( document.getElementById('cartForm').parentNode.getElementsByTagName('tr')).map(i=>Array.prototype.slice.call(i.getElementsByTagName('td'))[6]).filter(i=> typeof i !== 'undefined').map(i=>i.getElementsByTagName('b')[0]).filter(i=> typeof i !== 'undefined').map(i=>i.parentNode.parentNode.children[5]).length * 13.5
        alert("修改完成");
    });
   document.querySelector('#cartForm').parentNode.parentNode.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.getElementsByTagName('tr')[2].children[0].appendChild(button[0])

    
})();