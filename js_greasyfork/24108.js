// ==UserScript==
// @name         长江大学图书馆查询优化
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  将长江大学图书馆索引出来的列表里的武汉校区藏书筛选出来
// @author       clannadxr
// @include        *://calis.yangtzeu.edu.cn:8000/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24108/%E9%95%BF%E6%B1%9F%E5%A4%A7%E5%AD%A6%E5%9B%BE%E4%B9%A6%E9%A6%86%E6%9F%A5%E8%AF%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/24108/%E9%95%BF%E6%B1%9F%E5%A4%A7%E5%AD%A6%E5%9B%BE%E4%B9%A6%E9%A6%86%E6%9F%A5%E8%AF%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
$(".expressServiceTab").tabs('select', 0);

var allDivs,thisDiv;
allDivs = document.evaluate(
    '//div[contains(@id,"holdingPreviewDiv")]',
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);

/*var navList = document.getElementsByClassName('facetList')[1];
var newDiv = document.createElement('div');
newDiv.setAttribute('class','facetContainer');
var newOl = document.createElement('ol');
newOl.setAttribute('id','curlibcodeFacetSetting');
var newH4 = document.createElement('h4');
newH4.innerHTML='<a href="#">查询优化设置</a>';
var list1 = document.createElement('li');


newOl.appendChild(newH4);
newDiv.appendChild(newOl);
navList.insertBefore(newDiv,navList.firstChild);


alert(navList.innerHTML);
*/

var timer = setInterval(filterWuHan,10);

function filterWuHan(){
    if(allDivs.snapshotLength>0) {
        if (isTabsDone()===true){
            for (var i = 0; i < allDivs.snapshotLength; i++) {
                thisDiv = allDivs.snapshotItem(i);
                var trs = thisDiv.getElementsByTagName('tr');
                for (var j = 1;j<trs.length;j++) {
                    if (trs[j].getElementsByTagName('td')[2].innerHTML.indexOf('武汉校区') !== -1){
                        trs[j].style.backgroundColor="#ff0";
                        var parentTr = trs[j].parentNode.parentNode.parentNode.parentNode.parentNode;
                        parentTr.style.borderStyle='solid';
                        parentTr.style.borderWidth='5px';
                        parentTr.style.borderColor='red';
                    }
                }
            }
            clearInterval(timer);
            $(".expressServiceTab").tabs('select', 0);//tab收回
        }

    }
}
function isTabsDone(){
    var flag = true;
    if(allDivs.snapshotLength>0) {
        for (var i = 0; i < allDivs.snapshotLength; i++) {
            thisDiv = allDivs.snapshotItem(i);
            flag= flag && (thisDiv.innerHTML.indexOf("记录")>0 || thisDiv.innerHTML.indexOf("table")>0) ;
        }
        return flag;
    }
    return false;
}
