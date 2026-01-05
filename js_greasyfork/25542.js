// ==UserScript==
// @name         polylineHelper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://aplus.alibaba-inc.com/aplus/analysis/spm/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25542/polylineHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/25542/polylineHelper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function waitingforuser(cbk){
        var timer;
        function fn(){
            if(typeof window.user === 'object' && window.user !== null) {
                window.clearInterval(timer);
                cbk(window.user);
            }
        }
        timer = window.setInterval(fn, 1000);
    }
    var util = {};
    util.async = function(url, param, callback){
        // 缺省 param 参数
        if (typeof param == "function") {
            callback = param;
            param = null;
        }
        // 如果用户指定了 param
        if (param && typeof param == "object") {
            if (typeof window.dims == 'object') {
                param = util.extend({}, window.dims, param);
            }
            var p = [];
            for (var key in param) p.push(key +"="+ encodeURIComponent(param[key]));
            p = p.join("&");
            if (p) url = url + (url.indexOf("?") > -1 ? "&" : "?") + p;
        }
        var promise = $.ajax(url,{
              dataType: "jsonp"
            });
        // 如果有指定的回调函数
        if (typeof callback == "function") {
            promise = promise.done(function(data){
                callback(data);
            });
        }

        return promise;
    };
    //$('#dailog_contain').prepend('<div><a onclick="switchToPercent(true)">百分比</a> <a onclick="switchToPercent(false)">绝对数字</a></div>');
    waitingforuser(function(user){
        console.log(user);
        var oldFn = user.downLoadPolyline;
        user.downLoadPolyline = function(option){
            changePolyline(user);
            oldFn(option);
        };
    });

    function changePolyline(user) {
        var data = JSON.parse(JSON.stringify(user.PolylineData));
        console.log(data);
        var series = data.data.series;
        var totals = [];
        var i,len,j,l,s;
        for(i=0,len=series.length; i<len; i++) {
            s = series[i].data;
            for(j=0,l=s.length; j<l; j++) {
                if(i===0) totals[j] =0;
                totals[j] += (+s[j]);
            }
        }

        for(i=0,len=series.length; i<len; i++) {
            s = series[i].data;
            for(j=0,l=s.length; j<l; j++) {
                data.data.series[i].data[j] = ((+series[i].data[j])*100/totals[j]).toFixed(2);
            }
        }

        var chromeIdx = -1;
        for(i=0,len=data.data.legend.length;i<len;i++) {
            if(data.data.legend[i]==='Chrome') {
                chromeIdx = i;
            }
        }

        if(chromeIdx>-1) {
            data.data.legend.splice(chromeIdx, 1);
            data.data.series.splice(chromeIdx, 1);
        }

        user.set("PolylineData",data);
    }
})();