// ==UserScript==
// @name         显示91地址
// @version      1.0.0
// @description  次数是无限的，但精力是有限的。
// @author       master
// @include      *://*91p*n.com/*
// @namespace    http:///
// @match        http:///[target_uri]/
// @downloadURL https://update.greasyfork.org/scripts/431281/%E6%98%BE%E7%A4%BA91%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/431281/%E6%98%BE%E7%A4%BA91%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = window.location.href;

    // Your code here...
    if (/view_video/.test(url)) {

        var styles = 'font-size:20px;font-weight:bold;color:#ff8800;cursor:pointer;';
        var border = 'border: 1px solid;margin-right:10px;padding:3px;';
        var list = document.getElementById("search_form")

        var video = document.getElementById('player_one_html5_api');
        var sources = video.getElementsByTagName('source');
        var source_url = sources[0].src;
        console.log('source_url', source_url)

        let num = source_url.lastIndexOf('/')+1
        let name = source_url.substring(num)
        console.log('name', name)

        var newItem = document.createElement("div");
        newItem.style = "margin-bottom:10px";
        var source = document.createElement("input");
        source.id = "sourcesrc";
        source.style = styles + border + ";width:100%";
        source.value = source_url;
        newItem.appendChild(source);
        list.insertBefore(newItem,list.childNodes[0]);

//         source.addEventListener('click', function(){
//             window.location.href="m3u8down://baseUrl=" + window.btoa(source_url);
//         })
    }
})();