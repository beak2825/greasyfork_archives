// ==UserScript==
// @name         百度-CSDN 去质器
// @namespace    http://www.baidu.com/
// @version      0.3
// @license MIT
// @description  为了不在CSDN垃圾堆里捡食吃，直接把垃圾堆干掉
// @author       XXX
// @match        http://www.baidu.com/*
// @include      *://www.baidu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441822/%E7%99%BE%E5%BA%A6-CSDN%20%E5%8E%BB%E8%B4%A8%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/441822/%E7%99%BE%E5%BA%A6-CSDN%20%E5%8E%BB%E8%B4%A8%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("#kw").blur(()=>{
        const val = $("#kw").val()
        let keyWord = val.split(/\s+/)

        if(keyWord[keyWord.length - 1] !== "-csdn") {
            $("#kw").val(val + " -csdn")
        }
    })

    function loadPageVar (sVar) {
        return decodeURI(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI(sVar).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    }
    function searchParse(){
        undefined
        var resultObj = {};
        var search = window.location.search;
        if(search && search.length > 1){
            var _search = search.substring(1);
            var items = _search.split('&');
            for(var index = 0 ; index < items.length ; index++ ){
                if(! items[index]){
                    continue;
                }
                var kv = items[index].split('=');
                resultObj[kv[0]] = typeof kv[1] === "undefined" ? "":kv[1];
            }
        }
        return resultObj;
    }
    const search = searchParse()
    let wd = loadPageVar("wd")
    if(wd){
        wd = decodeURI(wd).split(/\s+/)
        if ((wd[wd.length-1] !== "-csdn")){
            wd.push("-csdn")
            wd = wd.join(" ")

            var objectToQueryString = function objectToQueryString(obj) {
                return Object.keys(obj).map(function (key) {
                    return "".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(obj[key]));
                }).join('&');
            };
            search.wd = wd
            const res = objectToQueryString(search);
            window.location.search = res
            console.log(res)
        }
    }
})();