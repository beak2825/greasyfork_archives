// ==UserScript==
// @name         pixiv.cat极简辅助
// @namespace    https://pixiv.cat/
// @version      0.4
// @description  当pixiv.cat因为图片个数而无法显示时可通过此脚本在新标签页打开所有图片
// @author       Pikaqian
// @match        https://pixiv.cat/*
// @icon         https://pixiv.cat/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427174/pixivcat%E6%9E%81%E7%AE%80%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/427174/pixivcat%E6%9E%81%E7%AE%80%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var body = document.getElementsByTagName ("p")[0];
    var inner=body.innerHTML
    //var result=inner.match(i)
    const match_number=/[0-9]*[0-9]/
    var result_1=inner.match(match_number)
    console.log(result_1[0])
    var picture=result_1[0]
    if(picture>=15){
    picture=15
    }
    var url=window.location.href
    var url_1=url.split(".png")
    for(var t=picture;t>0;t--){
        var url_final=url_1[0]+"-"+t+".png"
        window.open(url_final)
    console.log(url_final)
    }

    window.opener = null
    window.open('','_self')
    window.close()
})();