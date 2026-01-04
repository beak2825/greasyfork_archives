// ==UserScript==
// @icon            http://res.hpoi.net.cn/gk/res/img/favicon.ico
// @name            Exhobby For Hpoi
// @namespace       [url=exhobby.net]exhobby[/url]
// @author          exhobby
// @description     Add exhobby for hpoi.net
// @match           *://*.hpoi.net/hobby/*
// @match           *://*.hpoi.net/album/*
// @match           *://*.hpoi.net.cn/hobby/*
// @match           *://*.hpoi.net.cn/album/*
// @version         1.0.0
// @grant           GM_addStyle
// @grant           GM_xmlhttpRequest
// @grant           GM_download
// @downloadURL https://update.greasyfork.org/scripts/382359/Exhobby%20For%20Hpoi.user.js
// @updateURL https://update.greasyfork.org/scripts/382359/Exhobby%20For%20Hpoi.meta.js
// ==/UserScript==
(function () {
    'use strict';
    var versionCode = 1;
    var base_url_n = "https://res.e39x.com/pic/n/", base_url_s = "https://res.e39x.com/pic/s/";
    var location = window.location;
    var type = location.pathname.indexOf('hobby') > 0 ? "hobby" : "album";

    var target,exUrl;
    try {
        var tmp = $("#addfav").attr("onclick");
        var favId = type=='hobby'? tmp.substring(tmp.indexOf("('") + 2, tmp.indexOf("')")) : tmp.substring(tmp.indexOf("('") + 2, tmp.indexOf("',"));
        if(favId){
            exUrl = 'http://www.exhobby.net/get/pic?id='+favId;
        }
    }
    catch(err) {}

    if (type == "hobby") {
       target = $(".hpoi-entry-label-box");
    } else {
        target = $(".hpoi-entry-label-box");
        if(!target || !target.length){
          target = $(".pic-tag-header").parent();
        }
    }

    if(!exUrl){
          tmp = location.pathname.split("/");
          exUrl = 'http://www.exhobby.net/get/pic?itemId='+tmp[2] + "&itemType="+ tmp[1] ;
    }

    if(!target || !exUrl){
        alert("Please update ExHobby!");
    }else{
        $(`<div id="exhobby-loading" style="font-size:18px;font-weight: bold;margin-top:30px;margin-bottom:30px"> ExHobby loading...</div>`).insertAfter(target);
    }

  GM_xmlhttpRequest({
        method: 'POST',
        url: exUrl,
        onload: response => {
            $("#exhobby-loading").remove()
            var rs=JSON.parse(response.responseText);
            var title = "by ExHobby";
            if(rs.map.pluginVersion && rs.map.pluginVersion > versionCode){
                title = `<a href="https://greasyfork.org/zh-CN/scripts/382359-exhobby-for-hpoi" target="_blank">Click here to update Exhobby</a>`;
            }
            if (rs.map.list && rs.map.list.length > 0) {
                var box =
                     `<div style="margin-top:30px;overflow: auto;">
                        <div style="">
                           <div style="float:left;font-size:18px;font-weight: bold;">${title}</div>
                           <a style="float:left;margin-left:20px;margin-top:5px" target="_blank" href="${rs.map.url}">More >></a>
                        </div>
                        <br><br>
                        <div>
                           <div id="exhobby-pic-box" style="height:120px;overflow: hidden;"></div>
                        </div>
                     </div>`;
                $(box).insertAfter(target);

                for (var k in rs.map.list) {
                   var img =
                   `<div style="padding:1px;float:left">
                         <a class="outside-pic" target="_blank" href="${rs.map.url}">
                            <img style="height:120px" src="${base_url_s}${rs.map.list[k].path}">
                         </a>
                   </div>`;
                    $("#exhobby-pic-box").append(img);
                }
            }
        }
    });
})();