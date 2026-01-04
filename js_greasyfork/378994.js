// ==UserScript==
// @name         RARBG Big Previewer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  RARBG torrents link big preview
// @author       wszgrcy,rampageX
// @match        http*://rarbg.to/torrents.php*
// @match        http*://rarbg.is/torrents.php*
// @match        http*://rarbgprx.org/torrents.php*
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @icon         https://rarbgprx.org/favicon.ico
// @namespace    https://greasyfork.org/zh-CN/scripts/378994-rarbg-big-previewer
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378994/RARBG%20Big%20Previewer.user.js
// @updateURL https://update.greasyfork.org/scripts/378994/RARBG%20Big%20Previewer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var newLink;
    setTimeout(function () {
        newPos();
    },0);
    tdMousseoverChange();


})();



function tdMousseoverChange() {
    newLink="";
    var arrayimg=new Array();
    var i=0;
    $('tr.lista2 td+td.lista a[onmouseover~=return]').each(function () {
        var oldFunction=$(this).attr("onmouseover");
        var linkStartNum=oldFunction.indexOf("src=")+6;
        var linkEndNum=oldFunction.indexOf("jpg")+3;
        var newFunction1=oldFunction.substr(0,linkStartNum);
        var newFunction2=oldFunction.substr(linkEndNum,999);
        var link=oldFunction.substr(linkStartNum,linkEndNum-linkStartNum);
        var newFunction3=changeLink(link);
        //console.log(newFunction1+"|"+newFunction3+"|"+newFunction2);
        $(this).attr("onmouseover",newFunction1+newFunction3+newFunction2);

        preLoad(arrayimg,i,newFunction3);
    });

}
function changeLink(link) /*修改链接*/{
    /*
     * 三种链接形式
     * */
    console.log(link);
    var isTvdb=link.indexOf("tvdb");
    var isChangeTvdb=link.indexOf("banner_optimized");
    var checkoldlink=link.indexOf("static");
    if(checkoldlink!=-1&&isTvdb==-1)
    {

        //普通图片将要修改
        var imgLink1=link.substr(0, checkoldlink);
        var imgLink2="posters2";
        var lastGNum=link.lastIndexOf("/");
        var imgLink3=link.substr(lastGNum,999);
        var imgLink4=link.substr(lastGNum+1,1);
        newLink=imgLink1+imgLink2+"/"+imgLink4+imgLink3;
        //console.log("1改为"+newLink);
    }
    else if(isTvdb!=-1&&checkoldlink!=-1) {
        var tvdbLink1 = link.substr(0, link.indexOf("small"));
        var tvdbLink2 = "banner_optimized.jpg";
        newLink = tvdbLink1 + tvdbLink2;
        //console.log("2改为"+newLink);
    }
    else if (isTvdb==-1&&checkoldlink==-1)
    {
        newLink=link.replace("over","poster");
        //console.log("3改为"+newLink);
    }

    return newLink;
}
//预加载图片
function preLoad(arrayimg,i,newFunction3) {
    setTimeout(function () {
        arrayimg[i]=new Image();
        arrayimg[i].src="https:"+newFunction3;
        i++;
    },0);
}

function newPos() {
    var pop = document.getElementById("overlib");
//    var xoffset = 55;
//    var el = "";
    document.onmousemove = function(k) {
 //       var h;
 //       h = k.pageX;//当前坐标x
 //       h += xoffset;
 //       pop.style.top = document.body.scrollTop+550 + "px";
 //       pop.style.left = h + "px";
        var e = event || window.event;
        var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
        var x = e.pageX || e.clientX + scrollX;
        var y = e.pageY || e.clientY + scrollY;
        pop.style.top = y-205 + "px";
        pop.style.left = x+105 + "px";

    };
}

