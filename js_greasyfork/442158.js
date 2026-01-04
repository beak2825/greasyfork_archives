// ==UserScript==
// @name         撸女吧
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  撸女吧需要翻页才能看.不想翻页,一下自动加载到第一页看的方便.
// @author       You
// @match        https://www.lunu.cc/web/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lunu.cc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442158/%E6%92%B8%E5%A5%B3%E5%90%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/442158/%E6%92%B8%E5%A5%B3%E5%90%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var nums=document.querySelectorAll("#dm-fy > li").length-2;
    if(location.href.indexOf("page=")>5)
    {
        console.log(location.href);
        console.log("这里不行");
    }
    else
    {
        for(var i=2;i<=nums;i++)
        {
            $.ajax({
                url: location.href+"?page="+i,
                success: function(data){
                    var v1= data. indexOf("<img",200);
                    v1= data. indexOf("<img",v1+50);
                    v1= data. indexOf("src=\"",v1);
                    v1+=5;
                    var v2= data. indexOf("\"",v1+20);
                    var str=data.substr(v1,v2-v1);
                    console.log(str);
                    var img=new Image();
                    img.src=str;
                    document.querySelector("#container > main > article > div.entry > p").appendChild(img);
                }
            });
        }
    }

})();