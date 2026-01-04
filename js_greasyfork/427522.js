// ==UserScript==
// @name            pixiv快速打开原图＆自动收藏
// @description     通过Ctrl+右键快速打开pixiv图片原图（支持打开动态图的封面，但无法打开动态图），同时收藏此图片
// @version         0.6
// @namespace       akari
// @author          Pikaqian
// @include         *://www.pixiv.net/*
// @include         *://www.pixivision.net/*
// @icon            https://static.hdslb.com/images/akari.jpg
// @grant           GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/427522/pixiv%E5%BF%AB%E9%80%9F%E6%89%93%E5%BC%80%E5%8E%9F%E5%9B%BE%EF%BC%86%E8%87%AA%E5%8A%A8%E6%94%B6%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/427522/pixiv%E5%BF%AB%E9%80%9F%E6%89%93%E5%BC%80%E5%8E%9F%E5%9B%BE%EF%BC%86%E8%87%AA%E5%8A%A8%E6%94%B6%E8%97%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var match_rules=[
        /([_=:;&\-\/\.\?\d\w]+?illust_id=(\d+)(?:&|$|))/,
        /(http(?:s|):\/\/[_\-\/\.\d\w]+?\/(\d{4,})_p\d{1,4}[_\-\/\.\d\w]*)/
    ];
    window.addEventListener('load', function(){
        var cover_1=document.querySelector(".fvHsDQ")
        var cover_2=document.querySelector(".hYvGvO")
        var cover_3=document.querySelector(".cSAnog")
        if(cover_2!=null){
            cover_2.remove()
            cover_1.style.position="unset";
            cover_3.style.whiteSpace="unset"
            var text=cover_3.innerHTML
            cover_3.innerHTML="<strong>"+cover_3.innerHTML+"</strong>"
        }
    })
    window.addEventListener('contextmenu',function (event){

        //————————————————————————————————
        //————————————————————————————————
        var el=event.target
        if(el!=null){
            var url,pid,HTML,results
            if(event.ctrlKey==true&&event.altKey!=true){
                HTML=el.outerHTML
                for(var i in match_rules){
                    results=HTML.match(match_rules[i])
                    if(results!=null&&results.length>1){
                        url=results[1]
                        pid=results[2]
                        break
                    }
                }
                //——————————————————————————————————————————————
                if(results!=null){
                    var HTML_1=el.parentNode.previousSibling.childNodes[1]
                    var HTML_2="no results"
                    //多张图片打开↓↓↓
                    if(HTML_1!=undefined){
                        HTML_2=HTML_1.childNodes[0].childNodes[1].childNodes[0].data
                        if(HTML_2>=15){
                            var HTML_3=15
                            }
                        else{
                            HTML_3=HTML_2
                        }
                        for(var k=1;k<=HTML_3;k++){
                            var url_multiple="https://pixiv.cat/"+pid+"-"+k+".png"
                            window.open(url_multiple)
                            console.log(url_multiple)
                        }
                    }
                    //单张图片打开↓↓↓
                    else{
                        var url_single="https://pixiv.cat/"+pid+".png"
                        window.open(url_single)
                        console.log(url_single)
                    }
                }
                //——————————————————————————————————————————————
                //动态图封面打开↓↓↓
                else{
                    var ans=HTML.split(".jpg")[0]
                    var ans_1=ans.split("/")[ans.split("/").length-1]
                    var pid_2=ans_1.split("_")[0]
                    var url_single_gif="https://pixiv.cat/"+pid_2+".gif"
                    window.open(url_single_gif)
                    console.log(url_single_gif)
                }
                event.preventDefault()
                console.log(HTML_2)
                //——————————————————————————————————————————————
            }
            //ctrl事件结束，alt事件开始
            if(event.altKey==true&&event.ctrlKey!=true){
                HTML=el.outerHTML
                for(var u in match_rules){
                    results=HTML.match(match_rules[u])
                    if(results!=null&&results.length>1){
                        url=results[1]
                        pid=results[2]
                        break
                    }
                    if(results==null){
                        var ans_alt=HTML.split(".jpg")[0]
                        var ans_alt1=ans_alt.split("/")[ans_alt.split("/").length-1]
                        pid=ans_alt1.split("_")[0]
                        console.log("alt事件pid："+pid)
                    }
                }
                GM_setClipboard(pid);//复制pid至剪切板
                //自动收藏↓↓↓
                var HTML_click_1=el.parentNode.parentNode.parentNode.childNodes[1]
                var HTML_click_2=HTML_click_1.childNodes[0].childNodes[0]
                HTML_click_2.click()
                event.preventDefault()
                console.log("Complete click")
            }
        }
    });


    //————————————————————————————————————————————————————————————

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
            var el=event.target
            ////////////////////////////////////////////////////////
            for(var i in match_rules){
                var result=el.outerHTML.match(match_rules[i])
                if(result!=null&&result.length>1){
                    var url_result=result[1]
                    var pid=result[2]
                    break
                }
            }
            ///////////////////////////////////////////////////////
            var picture_num=el.parentNode.previousSibling.childNodes[1]
            var picture_num_1="no results"
            /*
            var HTML_url=window.location.href
            var HTML_url_pid=HTML_url.split("/")[HTML_url.split("/").length-1]
            */
            if(picture_num!=undefined){
                picture_num_1=picture_num.childNodes[0].childNodes[1].innerHTML
            }
            if(event.altKey==true&&event.ctrlKey!=true){
                var url_cat="https://pixiv.cat/"
                var url=url_cat
                if(picture_num_1!="no results"){
                    for(var u=0;u<picture_num_1;u++){
                        if(url!=url_cat){
                            url=url+","+url_cat+pid+"-"+(u+1)+".png"
                        }
                        else{
                            url=url_cat+pid+"-"+(u+1)+".png"
                        }
                    }
                }
                else{
                    url=url_cat+pid+".png"
                }
                url=url+";"
                var matchrule=/pixivid/
                var results=document.cookie.match(matchrule)
                console.log(results)
                if(results==null){
                    num=0
                }
                setCookie("pixivid"+num,url,30);
                event.preventDefault()
            }
            var user=getCookie("pixivid");
            var x = document.cookie
            console.log(x)
        })
        //————————————————————————————————删除cookie
        function delCookie(name){
            var date = new Date();
            date.setTime(date.getTime() - 10000);
            document.cookie = name + "=a; expires=" + date.toGMTString();
        }
        //————————————————————————————————
        window.addEventListener('contextmenu',function (event){
            if(event.ctrlKey==true&&event.altKey==true){
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
                        var cookie_url_split=cookie_url.split(",")
                        var cookie_url_recombine=cookie_url_split[0]
                        for(var y=1;y<cookie_url_split.length;y++){
                            cookie_url_recombine=cookie_url_recombine+"\n"+cookie_url_split[y]
                        }
                        if(cookie_txt!=null){
                            cookie_txt=cookie_txt+cookie_url_recombine+"\n"
                            p++
                        }
                        else{
                            cookie_txt=cookie_url_recombine+"\n"
                        }
                        event.preventDefault()
                    }
                }
                download("Pixiv Url.txt",cookie_txt);
                for(var o=0;o<p+1;o++){
                    delCookie("pixivid"+o)
                }
            }
        })
    }
    checkCookie()
    //————————————————————————————————————————————————————————————

})();