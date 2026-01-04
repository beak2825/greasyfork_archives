// ==UserScript==
// @name         pixiv cookie
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  pixiv网址保存
// @author       You
// @match        https://www.pixiv.net/*
// @icon         https://th.bing.com/th/id/R06b25491d2665ecdb4a7b4dd6cdf1f55?rik=F3h8jaxrHDnWIg&riu=http%3a%2f%2fwww.desktx.com%2fd%2ffile%2fwallpaper%2fcomic%2f20170323%2fdc29dea28681f6a2b8e7ee36527a917f.jpg&ehk=jKqVoVBZuLOdPtu3jcOXaEtAud83bUUl5QfJan0MFS8%3d&risl=&pid=ImgRaw
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427467/pixiv%20cookie.user.js
// @updateURL https://update.greasyfork.org/scripts/427467/pixiv%20cookie.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var el=event.target
    var num=0
    //————————————————————————————————创建cookie
    function setCookie(cname,cvalue,exdays){
        var cookie_all=cname
        for(var i=0;i<20;i++){
            cookie_all=cookie_all+"1"
        }
        exdays=-1
        cookie_all=cname+"="+cvalue+"; "+exdays
        var d = new Date();
        d.setTime(d.getTime()+(exdays*24*60*60*1000));
        var expires = "expires="+d.toGMTString();
        document.cookie = cookie_all;
        num=num+1
    }
    //————————————————————————————————调取cookie
    function getCookie(cname){
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name)==0){
                return c.substring(name.length,c.length);
            }
        }
        return "";
    }
    //————————————————————————————————使用cookie
    function checkCookie(){
        window.addEventListener('contextmenu',function (event){
            if(event.altKey){
                var url=window.location.href
                var matchrule=/pixivid/
                var results=document.cookie.match(matchrule)
                console.log(results)
                if(results==null){
                    num=0
                }
                setCookie("pixivid"+num,url,30);
            }
            var user=getCookie("pixivid");
            var x = document.cookie
            console.log(x)
            event.preventDefault()
        })
        //————————————————————————————————删除cookie
        function delCookie(name){
            var date = new Date();
            date.setTime(date.getTime() - 10000);
            document.cookie = name + "=a; expires=" + date.toGMTString();
        }
        //————————————————————————————————
        window.addEventListener('contextmenu',function (event){
            if(event.ctrlKey){
                //————————————————————————————————下载txt
                function download(filename, text) {
                    var element = document.createElement('a');
                    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
                    element.setAttribute('download', filename);
                    element.style.display = 'none';
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                }
                //————————————————————————————————
                var cookie_split=document.cookie.split(";")
                var cookie_txt
                var p=0
                //————————————————————————————————从cookie中匹配pixivid相关cookie
                for(var k=0;k<cookie_split.length;k++){
                    var cookie_match=cookie_split[k].match("pixivid")
                    if(cookie_match!=null){
                        var cookie_url=cookie_match.input.split("=")[1]
                        if(cookie_txt!=null){
                            cookie_txt=cookie_txt+";"+cookie_url
                            p++
                        }
                        else{
                            cookie_txt=cookie_url
                        }
                    }
                }
                download("hello.txt",cookie_txt);
                for(var o=0;o<p+1;o++){
                    delCookie("pixivid"+o)
                }
            }
            event.preventDefault()
        })
    }
    checkCookie()
})();