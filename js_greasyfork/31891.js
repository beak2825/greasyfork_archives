// ==UserScript==
// @name         临时屏蔽送书贴直到公布结果那天
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  送书贴一般留言之后意义不大，屏蔽到公布结果那天取消屏蔽
// @author       zjsxwc
// @match        https://www.v2ex.com/
// @grant        none
// @locale       zh-CN
// @downloadURL https://update.greasyfork.org/scripts/31891/%E4%B8%B4%E6%97%B6%E5%B1%8F%E8%94%BD%E9%80%81%E4%B9%A6%E8%B4%B4%E7%9B%B4%E5%88%B0%E5%85%AC%E5%B8%83%E7%BB%93%E6%9E%9C%E9%82%A3%E5%A4%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/31891/%E4%B8%B4%E6%97%B6%E5%B1%8F%E8%94%BD%E9%80%81%E4%B9%A6%E8%B4%B4%E7%9B%B4%E5%88%B0%E5%85%AC%E5%B8%83%E7%BB%93%E6%9E%9C%E9%82%A3%E5%A4%A9.meta.js
// ==/UserScript==

(function() {
    //临时屏蔽 https://www.v2ex.com/t/379031#reply91
    var endDate = "2017-08-04";
    var title = "顺丰到付，送几本《 Python 地理空间分析指南（第 2 版）》";
    
    var FormattableDate = function(){
        var date = new Date();
        this._date = date;
        $(["getMonth","getDate","getHours","getMinutes","getSeconds","getMilliseconds","getFullYear","toString"]).each(function(_,attrName){
            this[attrName] = function(){
                return date[attrName]();
            };
        }.bind(this));
    };
    FormattableDate.prototype.format = function(fmt) {
        var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        for(var k in o) {
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt;
    };
    
    var currentDate = new FormattableDate().format("yyyy-MM-dd");
    if (currentDate >= endDate) {
        return;
    }
    
    $('a').each(function(_,a){
        var content = $(a).text();
        if (content == title) {
            var $targetEle = $(a).closest(".cell");
            if ($targetEle) {
                $targetEle.remove();
            }
        }
    });
})();