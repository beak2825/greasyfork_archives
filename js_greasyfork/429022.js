// ==UserScript==
// @name         为 Google 自动添加搜索指令
// @namespace    Chalkim
// @version      0.2
// @description  添加你所喜欢的指令，默认添加 -csdn -baijiahao -小???网
// @author       Chalkim
// @match        https://www.google.com/search*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429022/%E4%B8%BA%20Google%20%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0%E6%90%9C%E7%B4%A2%E6%8C%87%E4%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/429022/%E4%B8%BA%20Google%20%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0%E6%90%9C%E7%B4%A2%E6%8C%87%E4%BB%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认参数列表
    var defaultParm = [
        "-csdn",
        "-baijiahao",
        "-小???网"
    ];

    var urlChange = false;
    var oq = getQueryVariable("q");
    var parms = oq.split("+");

    var defaultParmMap = new Map();
    defaultParm.map(
        function(value){
            value = encodeParm(value);
            defaultParmMap.set(value, false);
        }
    );

    function encodeParm(p) {
        p = encodeURI(p);
        p = p.replace(/\?/g, "%3F");
        p = p.replace(/\&/g, "%26");
        return p;
    }

    parms.map(
        function(value){
            console.log(value);
            if(defaultParmMap.has(value)) {
                defaultParmMap.set(value, true);
            }
        }
    );

    defaultParmMap.forEach(
        function(value, key){
            if(!value){
                urlChange = true;
                parms.push(key);
            }
        }
    );

    if(urlChange){
        var nq = parms.join("+");
        var currentURL = window.location.href.toString();
        var newURL = changeURLArg(currentURL, "q", nq);
        window.location.replace(newURL);
    }

    function changeURLArg(url, arg, arg_val) {
        var pattern = arg + '=([^&]*)';
        var replaceText = arg + '=' + arg_val;
        if (url.match(pattern)) {
            var tmp = '(' + arg + '=)([^&]*)';
            console.log(tmp);
            var reg = new RegExp(tmp, 'gi');
            console.log(reg);
            tmp = url.replace(reg, replaceText);
            return tmp;
        } else {
            if (url.match('[\?]')) {
                return url + '&' + replaceText;
            } else {
                return url + '?' + replaceText;
            }
        }
    }


    function getQueryVariable(variable)
    {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
        return(false);
    }
})();