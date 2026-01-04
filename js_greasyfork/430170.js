// ==UserScript==
// @name         LinkCheatGuardian_BiliBili
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  对b23.tv/xxxx这样的链接，直接获取到真实地址的标题，以免用户点进去自己不想看到的内容
// @author       wlx0079
// @match        *://www.bilibili.com/video/*
// @icon         https://i0.hdslb.com/bfs/album/5b628d8d94bbf2f80f8006f1f6865a3f977e51d2.jpg
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/430170/LinkCheatGuardian_BiliBili.user.js
// @updateURL https://update.greasyfork.org/scripts/430170/LinkCheatGuardian_BiliBili.meta.js
// ==/UserScript==

//Update: 0801-01:42 只采集/video，采用hashmap缓存策略减少访问量，时间间隔调大，访问太多要验证码的==
//Update: 0801-11:35 采用异步更新的方式，一个较长间隔请求未访问的网址，一个较短间隔从内存中更新内容
//Update: 0802-00:14 添加播放量显示
//Update: 0806-19:10 使用TamperMonkey自带的levelDB进行存储，提高了访问速度和请求量，减少被验证码的可能性，间接性避免了有大量锻炼时无法正常显示的bug，优化显示

var hashmap = new Map()

function getTitle(text){
    var myReg = new RegExp("<title.*title>");
    var title
    try
    {
        var nt = text.match(myReg)[0];
        title = nt.split("<")[1];
        title = title.split(">")[1];
        title = title.split("_哔哩哔哩_bilibili")[0]
    } catch( error){
        return "@"
    }
    return title;
}

function getPlayTimes(text){
   var myReg = new RegExp("\"总播放数[0-9]*\"");
    var title = text.match(myReg)[0];
    return title;
}


function httpGet(theUrl,theSpan)
{
    GM_xmlhttpRequest({
        url: theUrl,
        method :"GET",
        onload:function(xhr){
            if(!hashmap.has(theSpan.innerHTML)){
               var name = getTitle(xhr.responseText)
               if(name == "@"){
                   return
               }
               var playtimes = getPlayTimes(xhr.responseText)
               var newContent =
                   theSpan.innerHTML + "<p>"+
                                          "<vi style=\"font-family:verdana; color:rgb(70,60,220); font-weight:800; font-size:10pt\"> #诈骗检测："+ name +"</vi>" +
                                          "<vi style=\"font-family:verdana; color:rgb(170,60,220); font-weight:800; font-size:8pt\">#"+ playtimes+"</vi>" +
                                       "</p>" ;
               GM_setValue(theSpan.innerHTML,newContent)
               GM_setValue(newContent,"success")
               theSpan.innerHTML = newContent
            }
        }
    });
}


function getRequest(){
    var links = document.getElementsByTagName("a")
    for (var i = 0 ; i < links.length ; ++i){
        var url = links[i].href;
        if (url.search("b23.tv") != -1 ){
            var try_content = GM_getValue(links[i].innerHTML, "fail")
            if(try_content == "fail" ){
                httpGet(url,links[i])
            }
        }
    }
}

function Alter(){
    var links = document.getElementsByTagName("a")
    for (var i = 0 ; i < links.length ; ++i){
        var url = links[i].href;
        if (url.search("b23.tv") != -1 ){
            var try_content = GM_getValue(links[i].innerHTML, "fail")
            if(try_content != "fail" && try_content != "success"){
                links[i].innerHTML = try_content
            }
        }
    }
}




setInterval(getRequest,2500)
setInterval(Alter,500)



