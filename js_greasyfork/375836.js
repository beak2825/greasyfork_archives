// ==UserScript==
// @name         WLGY-Amazon
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.amazon.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375836/WLGY-Amazon.user.js
// @updateURL https://update.greasyfork.org/scripts/375836/WLGY-Amazon.meta.js
// ==/UserScript==

(function() {
    'use strict';
alert('new version');
    var nameI18n = {
        'Prime Video':'会员视频',
        'Music, CDs &amp; Vinyl':'音乐和CD',
        'Digital Music':'数字音乐',
        'Kindle Store':'Kindle库',
        'Arts &amp; Crafts':'艺术',
        'Automotive':'汽车用品',
        'Baby':'婴儿',
        'Beauty &amp; Personal Care':'美妆个护',
        'Books':'图书',
        'Computers':'计算机',
        'Electronics':'电子设备',
        'Women\'s Fashion':'女士时尚',
        'Men\'s Fashion':'男士时尚',
//         'Girls\' Fashion':'XXX',
//         'Boys\' Fashion':'XXX',
//         'Health &amp; Household':'XXX',
//         'Home &amp; Kitchen':'XXX',
//         'Industrial &amp; Scientific':'XXX',
//         'Luggage':'XXX',
//         'Movies &amp; Television':'XXX',
//         'Pet Supplies':'XXX',
//         'Software':'XXX',
//         'Sports &amp; Outdoors':'XXX',
//         'Tools &amp; Home Improvement':'XXX',
//         'Toys &amp; Games':'XXX',
//         'Video Games':'XXX',
//         'Deals':'XXX'
    };

    var tsx=new Date().getTime();
    var lbs = document.getElementsByClassName("nav-line-2");
    var lb1 = lbs[5]
    //alert(lb1.textContent);
    lb1.innerText = "商品分类";

    var yourAmazon = document.getElementById("nav-your-amazon");
    yourAmazon.innerText = "你的亚马逊";

    var list = document.getElementsByClassName("nav-template nav-flyout-content nav-tpl-itemList");
    var elements = list[1].getElementsByTagName("a");
    for(var i = 0 ; i < elements.length ; i++){
        //console.log(elements[i].innerHTML);
        console.log(elements[i].children[0].innerText);
        var value = nameI18n[elements[i].children[0].innerText];
        if (typeof (value) != "undefined") {
            elements[i].children[0].innerText = value ;
        }

        //elements[i].innerHTML = nameI18n[elements[i].innerHTML];
    }
//    elements[0].innerHTML = "会员视频";
//    elements[1].innerHTML = "音乐和CD";
    // Your code here...
})();
