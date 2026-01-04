// ==UserScript==
// @name         AdminInputer
// @namespace    http://tampermonkey.net/
// @version      1.6.0
// @description  phpcms adminHelper!
// @author       whiteCat
// @require      https://cdn.jsdelivr.net/npm/hotkeys-js@3.7.2/dist/hotkeys.min.js
// @match        *://admin.pw88.com/index.php?m=content&c=content&a=add*
// @match        *://admin.pw88.com/index.php?m=content&c=content&a=init*
// @match        *://admin.3310.com/index.php?m=content&c=content&a=add*
// @match        *://admin.8q98.com/index.php?m=content&c=content&a=add*
// @match        *://admin.07xz.com/index.php?m=content&c=content&a=add*
// @match        *://admin.07xz.com/index.php?m=content&c=content&a=init*
// @match        *://admin.29xz.com/index.php?m=content&c=content&a=add*
// @match        *://admin.29xz.com/index.php?m=content&c=content&a=init*
// @match        *://admin.ucbug.cc/index.php?m=content&c=content&a=add*
// @match        *://admin.ucbug.cc/index.php?m=content&c=content&a=init*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407231/AdminInputer.user.js
// @updateURL https://update.greasyfork.org/scripts/407231/AdminInputer.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var title;
    var invokeCount = 0;
    var secondTitle;
    var version;
    var keywords;
    var hostname;
    var gameSuffixList = new Array('安卓版','手机版','手游','中文版','汉化版','官方版','最新版');
    var breakSuffixList = new Array('破解版','付费破解版','内购破解版','无限金币版','变态版','bt版');
    var appSuffixList = new Array('安卓版','手机版','最新版','官方版','app','免费版');
    var hentaiSuffixList = new Array('福利版','午夜福利版','污版','深夜福利版','无限制版','成年版','老司机版','色版','成人版','无限观看版','绅士版','开车版');
    //deal the big open page
    var openLink = $("a.add.fb").attr("onclick");
    if (typeof(openLink) != "undefined"){
        var newLink = openLink.substring(0,openLink.indexOf(")"))+",1013)";
        $("a.add.fb").attr("onclick",newLink);
    }
    //Create Random Number
    function randomNum(minNum,maxNum){
        switch(arguments.length){
            case 1:
                return parseInt(Math.random()*minNum+1,10);
                break;
            case 2:
                return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
                break;
            default:
                return 0;
                break;
        }
    }
    // ensure two diffrent number
    function differNumber(minNum,maxNum){
        var randomNumList = new Array();
        var n1 = randomNum(minNum,maxNum);
        var n2;
        randomNumList.push(n1);
        do{
        n2 = randomNum(minNum,maxNum);
        }
        while(n1 == n2);
        randomNumList.push(n2);
        return randomNumList;
    }
    //block alert
    //window.alert=function(){}
    //Judge Site
    function AutoInput(type,tagStr){
        hostname = window.location.host;
        if(hostname == "admin.07xz.com"){
            return AutoInput07(type,tagStr);
        }if(hostname == "admin.29xz.com"){
            if(invokeCount == 0){
                title = $("#title").val();
            }
            invokeCount++;
            return AutoInput29(type,tagStr);
        }
        if(hostname == "admin.ucbug.cc"){
            if(invokeCount == 0){
                title = $("#title").val();
            }
            invokeCount++;
            return AutoInputUC(type,tagStr);
        }
    }
    // Hotkey
    // type 1 is game 2 is app 3 is breakVersion
    hotkeys('alt+q', function() {AutoInput(2,',');});
    hotkeys('alt+w', function() {AutoInput(1,',');});
    hotkeys('alt+e', function() {AutoInput(3,',');});
    hotkeys('alt+a', function() {title = $("#title").val();});
    //Auto Deal Input 07Site
    function AutoInput07(type,tagStr){
        var keywordsList = new Array();
        // title
        title = $("#title").val();
        // version
        version = $('#version').val();
        if(!version.includes('v')){
            $('#version').val('v'+version);
        }
        if(type==1){
            $("#seo_title").val(title+gameSuffixList[randomNum(0,gameSuffixList.length-1)]+"-"+title+gameSuffixList[randomNum(0,gameSuffixList.length-1)]+"下载");
            secondTitle = $("#seo_title").val();
            $("#keywords").val(title+","+secondTitle.replace("-",","));
            keywordsList.push(title+gameSuffixList[randomNum(0,gameSuffixList.length-1)]+"下载");
            keywordsList.push(title+gameSuffixList[randomNum(0,gameSuffixList.length-1)]+"下载");
        }if(type==2){
            $("#seo_title").val(title+appSuffixList[randomNum(0,appSuffixList.length-1)]+"-"+title+appSuffixList[randomNum(0,appSuffixList.length-1)]+"下载");
            secondTitle = $("#seo_title").val();
            $("#keywords").val(title+","+secondTitle.replace("-",",")).toString;
            keywordsList.push(title+appSuffixList[randomNum(0,appSuffixList.length-1)]+"下载");
            keywordsList.push(title+appSuffixList[randomNum(0,appSuffixList.length-1)]+"下载");
        }if(type==3){
            $("#seo_title").val(title+breakSuffixList[randomNum(0,breakSuffixList.length-1)]+"-"+title+breakSuffixList[randomNum(0,breakSuffixList.length-1)]+"下载");
            secondTitle = $("#seo_title").val();
            $("#keywords").val(title+","+secondTitle.replace("-",",")).toString;
            keywordsList.push(title+breakSuffixList[randomNum(0,breakSuffixList.length-1)]+"下载");
            keywordsList.push(title+breakSuffixList[randomNum(0,breakSuffixList.length-1)]+"下载");
        }
        keywords = $("#keywords").val();
        var positions = new Array();
        var pos = keywords.indexOf(tagStr);
        while(pos > -1){
            positions.push(pos);
            pos = keywords.indexOf(tagStr,pos + 1);
        }
        keywordsList.push(keywords.substring(0,positions[0]));
        keywordsList.push(keywords.substring(positions[0]+1,positions[1]));
        keywordsList.push(keywords.substring(positions[1]+1,keywords.length));
        $("input[name='jietupic_alt[]']").each(function(i){
                $(this).val(keywordsList[i]);
            });
    }
    //Auto Deal Input 29Site
    function AutoInput29(type,tagStr){
         var tkey;
        // version
        version = $('#version').val();
        if(!version.includes('v')){
            $('#version').val('v'+version);
        }
        if(type==1){
            $("#title").val(title+gameSuffixList[randomNum(0,gameSuffixList.length-1)]);
            tkey = $("#tkey").val(title+gameSuffixList[randomNum(0,gameSuffixList.length-1)]+"下载");
        }if(type==2){
            $("#title").val(title+appSuffixList[randomNum(0,appSuffixList.length-1)]);
            $("#tkey").val(title+appSuffixList[randomNum(0,appSuffixList.length-1)]+"下载");
        }if(type==3){
            $("#title").val(title+breakSuffixList[randomNum(0,breakSuffixList.length-1)]);
            $("#tkey").val(title+breakSuffixList[randomNum(0,breakSuffixList.length-1)]+"下载");
        }
        keywords = $("#keywords").val($("#title").val()+","+$("#tkey").val()+","+title);
    }
    // UCbug Site
    function AutoInputUC(type,tagStr){
        var tkey;
        if(type==1){
            add_multifile('downfiles');
            $("input[name='downfiles_fileurl[]']").val("https://020326.com/");
            $("#iosdownfiles").val("https://020326.com/");
            $("#_3").attr("checked", 'checked');
            var videoVersion = "v"+randomNum(1,3)+"."+randomNum(0,9);
            $('#version').val(videoVersion);
            var videoSize = randomNum(11,38)+"."+randomNum(0,9)+"MB";
            $('#filesize').val(videoSize);
        }if(type==2){}
        if(type==3){
            var numList = differNumber(0,hentaiSuffixList.length-1);
            $("#title").val(title+hentaiSuffixList[numList[0]]);
            $("#seo_title").val(title+hentaiSuffixList[numList[1]]+"下载");
        }
        var vsetitle = $('#seo_title').val();
        $('#keywords').val($('#title').val()+","+vsetitle+","+title+"下载");
        $("input[name='jietupic_alt[]']").val(vsetitle);
    }
})();