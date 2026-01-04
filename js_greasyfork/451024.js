// ==UserScript==
// @name         微信公众号文章中qq音乐的批量获取
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  获取到了console的log中
// @author       You
// @match        https://mp.weixin.qq.com/s/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @require    http://code.jquery.com/jquery-1.11.0.min.js

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451024/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E4%B8%ADqq%E9%9F%B3%E4%B9%90%E7%9A%84%E6%89%B9%E9%87%8F%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/451024/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E4%B8%ADqq%E9%9F%B3%E4%B9%90%E7%9A%84%E6%89%B9%E9%87%8F%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function() {


    let mysonglist=document.querySelectorAll("qqmusic");

    for (let i=0;i<mysonglist.length;i++)
    {
        setTimeout(function(){
            try{
                var mysongid= mysonglist[i].attributes["mid"].value;

                let myurl="https://mp.weixin.qq.com/mp/qqmusic?action=get_song_info&song_mid="+mysongid+"&uin=&key=&pass_ticket=&wxtoken=777&devicetype=&clientversion=&__biz=Mzg3OTEwMTIxMg==&appmsg_token=&x5=0&f=json";
                $.getJSON(myurl,function(result){
                    let testJson = eval("(" + result.resp_data + ")");

                    if(testJson.msg=="ok"){
                        let mysongname=testJson.songlist[0].song_name;
                        let songurl=testJson.songlist[0].song_play_url;
                        console.log(mysongname+"|"+songurl);
                   }

                });
            }
            catch(error){}
        }  ,500*(i+1));

    }
})();