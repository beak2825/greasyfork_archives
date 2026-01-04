// ==UserScript==
// @name              片源网智能过滤脚本
// @namespace         PianYuanFilter
// @version           0.1
// @description       一个过滤片源网列表重复电影的脚本
// @author            Panda
// @match             *://pianyuan.la/*
// @match             *://pianyuan.org/*
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @require           https://cdn.bootcss.com/sweetalert/2.1.2/sweetalert.min.js
// @run-at            document-idle
// @grant             none
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/439853/%E7%89%87%E6%BA%90%E7%BD%91%E6%99%BA%E8%83%BD%E8%BF%87%E6%BB%A4%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/439853/%E7%89%87%E6%BA%90%E7%BD%91%E6%99%BA%E8%83%BD%E8%BF%87%E6%BB%A4%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getUrlParam (name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(window.location.href) || [, ''])[1].replace(/\+/g, '%20')) || null
    }

    var page = getUrlParam("p");

    let showMovies = sessionStorage.getItem("showMovies");

    if(showMovies === null || page === null || page === '1'){
        showMovies = new Array();
    }else{
        showMovies = showMovies.split("\r")
    }

    //let showMovies = new Array();

    $("td.dt").each(function(i){
        let movieNameStr = $(this).text();

        if(movieNameStr){
            let indexStar = movieNameStr.indexOf("《");
            let indexEnd = movieNameStr.substring(indexStar+1).indexOf(",");
            let movieName;

            if(indexStar !== -1 && indexEnd !== -1){
                movieName = movieNameStr.substring(indexStar+1,indexStar+indexEnd+1);
            }

            if(movieName && showMovies.indexOf(movieName) !== -1){
                $(this).parent().remove();
            }else {
                showMovies.push(movieName);
            }
        }
    });

    sessionStorage.setItem("showMovies", showMovies.join("\r"));

    $("tr:last").after("<tr class='even'><td class='dt prel nobr' colspan='3' style='text-align:center;font-weight:bold;'>总过滤："+ showMovies.length + "个</td></tr>")

})();