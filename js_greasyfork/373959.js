// ==UserScript==
// @name          Auto jmup into wooyun mirror site
// @name:zh-TW   烏雲自動跳轉
// @namespace    HTTP://WWW.RUSSIAVK.COM/
// @version      0.2
// @description  Auto jmup into mirror-site of wooyun from www.wooyun.org
// @description:zh-TW 烏雲自動跳轉到鏡像網站
// @author       WWW.RUSSIAVK.CN
// @supportURL   huanxiangxr21@gmail.com
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=huanxiangxr21@gmail.com&item_name=Greasy+Fork+donation
// @match        http://www.wooyun.org/*
// @require      https://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/373959/Auto%20jmup%20into%20wooyun%20mirror%20site.user.js
// @updateURL https://update.greasyfork.org/scripts/373959/Auto%20jmup%20into%20wooyun%20mirror%20site.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let d=document,
        href=location.href.replace('wooyun.org','anquan.us/static')+'.html',
        TestUrl,
        r,
        index=href.substr(href.indexOf('1')+1,1),
        find="location.href=href;console.log('找到了');",
        UnFind="console.log('此链接错误开始');";
        r=Cheak(href);
    console.log(href);
    if(r!==true){
        eval(UnFind);
        Auto(index);
    }
    else{
        eval(find);
    }
    function Auto(index){
        for(let i=0;i<=5;i++){
            if(i!==index){//continue;
                TestUrl=href.replace('1'+index,'1'+i);
                console.log(TestUrl);
                if(Cheak(TestUrl)==true){
                    find=find.replace('=href','="'+TestUrl+'"');
                    eval(find);
                }
                else{
                    eval(UnFind.replace('开始',''));
                }
            }
        }
    }
    function Cheak(URL){
        $.ajax({
            type: 'GET',
            url:URL,
            async:false,
            success:function(data,statusTXT){
                r=true;
            }
        });
        return r
    }
})();