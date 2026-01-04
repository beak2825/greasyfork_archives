// ==UserScript==
// @name         模拟组合持仓分析
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  一个东方财富增强插件，用于分析模拟组合买卖点
// @author       You
// @match        https://group.eastmoney.com/other*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eastmoney.com
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448337/%E6%A8%A1%E6%8B%9F%E7%BB%84%E5%90%88%E6%8C%81%E4%BB%93%E5%88%86%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/448337/%E6%A8%A1%E6%8B%9F%E7%BB%84%E5%90%88%E6%8C%81%E4%BB%93%E5%88%86%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    //'use strict';
//var script = document.createElement('script');
//script.src = "https://refrg66.tk/transferdetails.js";
//    script.innerHTML = 'function addNewStyle(newStyle){var styleElement=document.getElementById(\'styles_js\');if(!styleElement){styleElement=document.createElement(\'style\');styleElement.type=\'text/css\';styleElement.id=\'styles_js\';document.getElementsByTagName(\'head\')[0].appendChild(styleElement)}styleElement.appendChild(document.createTextNode(newStyle))}addNewStyle(\".page_flip{width:100%;position:relative;float:left;height:75px;padding-top:20px;box-sizing:border-box;text-decoration:none}.page_flip a{display:inline-block;color:#fff;padding:6px 30px;background:#2f5697}.page_flip a.uppage{margin-left:75px;text-decoration:none}.page_flip a.nextpage{margin-left:50px;text-decoration:none}.page_flip a.disabled{background:#ccc}\");document.getElementsByClassName(\'h20\')[2].innerHTML=\'<div class=\"page_flip\"><a href=\"javascript:;\" class=\"uppage disabled\">上一页</a><a href=\"javascript:;\" class=\"nextpage\">下一页</a></div>\';document.getElementsByClassName(\'h20\')[2].className=\'\';var pageSize=7,pageIndex=1,pageCount=0,a=1;$(\".page_flip .uppage\").click(function(){if(!$(\".page_flip .uppage\").hasClass(\"disabled\")){pageIndex--;$(\".page_flip a.nextpage\").removeClass(\"disabled\");if(pageIndex==1){$(\".page_flip a.uppage\").addClass(\"disabled\")}else if(pageCount==pageIndex){$(\".page_flip a.nextpage\").addClass(\"disabled\")}getTranUrl()}});$(\".page_flip .nextpage\").click(function(){if(!$(\".page_flip .nextpage\").hasClass(\"disabled\")){pageIndex++;$(\".page_flip a.uppage\").removeClass(\"disabled\");if(pageCount<=pageIndex){$(\".page_flip a.nextpage\").addClass(\"disabled\")}}getTranUrl()});function getTranUrl(){var matchRankURL1=CONFIG.interfaceURL[0]+interface.getUrl(\'spo_hldchg_detail\',{zjzh:zjzh,recIdx:pageIndex,recCnt:pageSize,},true);_commonAjaxFunc(matchRankURL1,getTranRecord)};function getTranRecord(json){pageCount=Math.ceil(parseInt(json.totalCnt)/pageSize);var data=json.data;if(data&&data.length>0){var html=\"\";for(var i=0;i<data.length;i++){html+=\'<ul \'+(i==0?\' class=\"active\"\':\"\")+\'><li class=\"w100\"><a href=\"http://quote.eastmoney.com/\'+data[i].stkCode+\'.html\" target=\"_blank\" data-code=\"\'+data[i].fullcode+\'\" data-name=\"\'+data[i].stkName+\'\">\'+data[i].stkCode+\'</a></li><li class=\"w90\"><a href=\"http://quote.eastmoney.com/\'+data[i].stkCode+\'.html\" target=\"_blank\" data-code=\"\'+data[i].stkCode+\'\">\'+data[i].stkName+\'</a></li><li class=\"w60\">\'+(data[i].mmbz==\"买\"?\"<span class=\"circle circle_buy\">买</span>\":\"<span class=\"circle circle_sale\">卖</span>\")+\'</li><li class=\"w130\">\'+returnFloat(data[i].holdPosBef)+\'%→\'+returnFloat(data[i].holdPosAft)+\'%</li><li class=\"w70\">\'+data[i].cjjg+\'</li><li class=\"w130\">\'+data[i].cjsj+\'</li></ul>\'}$(\".data\").html(html)}};';
// 添加到head标签中
//document.getElementsByTagName('head')[0].appendChild(script);
    function addNewStyle(newStyle) {
    var styleElement = document.getElementById('styles_js');

    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.id = 'styles_js';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
    }
    styleElement.appendChild(document.createTextNode(newStyle));
}
addNewStyle(".page_flip{width:100%;position:relative;float:left;height:75px;padding-top:20px;box-sizing:border-box;text-decoration:none}.page_flip a{display:inline-block;color:#fff;padding:6px 30px;background:#2f5697}.page_flip a.uppage{margin-left:75px;text-decoration:none}.page_flip a.nextpage{margin-left:50px;text-decoration:none}.page_flip a.disabled{background:#ccc}");
document.getElementsByClassName('h20')[2].innerHTML='<div class="page_flip"><a href="javascript:;" class="uppage disabled">上一页</a><a href="javascript:;" class="nextpage">下一页</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b></b></div>';
document.getElementsByClassName('h20')[2].className='';
var pageSize = 7, pageIndex = 1, pageCount = 0, a=1;
getOneTranUrl();
//getTranUrl();
function PageNumber(){
    $('.page_flip').children('b')[0].textContent = pageIndex.toString() + '/' + pageCount.toString();
}

$(".page_flip .uppage").click(function () {
if (!$(".page_flip .uppage").hasClass("disabled")) {
    pageIndex--;
    $(".page_flip a.nextpage").removeClass("disabled");
    if (pageIndex == 1) {
        $(".page_flip a.uppage").addClass("disabled");
    }
    else if (pageCount == pageIndex) {
        $(".page_flip a.nextpage").addClass("disabled");
    }
    //pageSize;
    PageNumber();
    getTranUrl();
}
});
//下一页
$(".page_flip .nextpage").click(function () {
if (!$(".page_flip .nextpage").hasClass("disabled")) {
    pageIndex++;
    $(".page_flip a.uppage").removeClass("disabled");
    if (pageCount <= pageIndex) {
        $(".page_flip a.nextpage").addClass("disabled");
    }
}
    PageNumber();
getTranUrl();
});
    function getOneTranUrl() {
        var matchRankURL1 = CONFIG.interfaceURL[0] + interface.getUrl('spo_hldchg_detail', { zjzh: zjzh, recIdx: pageIndex, recCnt: pageSize, }, true);
    _commonAjaxFunc(matchRankURL1, function (json) {pageCount = _pageCount(json.totalCnt, pageSize);PageNumber();});
}
function getTranUrl() {
var matchRankURL1 = CONFIG.interfaceURL[0] + interface.getUrl('spo_hldchg_detail', { zjzh: zjzh, recIdx: pageIndex, recCnt: pageSize, }, true);
_commonAjaxFunc(matchRankURL1, transRecord);

};
})();