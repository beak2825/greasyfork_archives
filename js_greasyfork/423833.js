// ==UserScript==
// @name         酷我音乐免费下载
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  【酷我音乐】免费歌曲下载2
// @author       MrHao
// @match        http://www.kuwo.cn/*
// @match        https://www.kuwo.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/423833/%E9%85%B7%E6%88%91%E9%9F%B3%E4%B9%90%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/423833/%E9%85%B7%E6%88%91%E9%9F%B3%E4%B9%90%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
(function() {
    'use strict';
    console.log("==================================KUWO_List=Hack=By=MrHao==================================")
run();
function run (){
     setTimeout(function init() {
try{
        var rows
        if(location.href.indexOf("search")>0){
            rows = document.getElementsByClassName("search_list")[0].childNodes;
        }else if(location.href.indexOf("rankList")>0){
            rows = document.getElementsByClassName("rank_list")[0].childNodes;
        }else if(location.href.indexOf("singer_detail")>0){
             rows = document.getElementsByClassName("singer_list")[0].childNodes;
        }
        for (var i = 0; i <= rows.length-1; i++) {

            let href = rows[i].childNodes[2].childNodes[0].href;
            var button2 = document.createElement("button");
            button2.textContent = "下载";
            button2.style.border= "none";
            button2.style.background="#fff0";
            button2.style.marginLeft= "10px";
            button2.style.fontSize= "large";
            button2.onclick=function () {
                let timestamp = (new Date).getTime();
                let jsonTxt = href;
                let num = href.lastIndexOf("/");
                let json = jsonTxt.substr(num+1, jsonTxt.length).replace(");", "");
                let rid = json.replace("/", "")

                let url="http://www.kuwo.cn/api/v1/www/music/playUrl?mid="+rid+"&type=music&httpsStatus=1&reqId=c4423541-62ec-11ec-8987-8d72733d6d4a"
                let name = "http://m.kuwo.cn/newh5/singles/songinfoandlrc" +
                    "?musicId=" + rid +
                    "&httpsStatus=1" +
                    "&reqId=f8236d61-5316-11ec-953f-e502222bdd34";
                GM_xmlhttpRequest({
                    method: "get",
                    url: name,
                    onload: function(r) {
                        let jsonTxt = r.response;
                        let json = JSON.parse(jsonTxt)
                        //console.log(json)
                        let songName = json.data.lrclist[0].lineLyric;
                        down(url, songName)
                    }
                });

                return;

            };
             rows[i].childNodes[2].appendChild(button2);
        }
}catch(err){
run()
}
    },1000);
}

    function down(url, name) {
        GM_xmlhttpRequest({
            method: "get",
            url: url,
            onload: function(r) {
                console.log(r)
                let jsonTxt = r.response;
                let json = JSON.parse(jsonTxt) ;
                GM_download(json.data.url, name + ".mp3")
            }
        });
    }



     function getURLParameter(url, name) {
        return (RegExp(name + '=' + '(.+?)(&|$)').exec(url)||[,null])[1];
    }


    var down_load=document.getElementsByClassName("btns")[0]
    var child = down_load.lastChild;


    var button = document.createElement("button");
    button.id = "down_load";
	button.textContent = "下载";
	button.style.width = "113px";
	button.style.height = "40px";
    button.style.color = "#000";
    button.style.background = "#f2f2f2";
    button.style.borderRadius = "22px";
    button.style.border = "none";
    button.style.fontSize = "16px";
    button.style.cursor = "pointer";
    button.style.color = "inherit";
    down_load.appendChild(button)

    button.onclick = function (){
    let timestamp = (new Date).getTime()
    let jsonTxt = location.href
    let num = location.href.lastIndexOf("/");
    let json = jsonTxt.substr(num,jsonTxt.length).replace(");","");
    let rid = json.replace("/","")

    let url="http://www.kuwo.cn/api/v1/www/music/playUrl?mid="+rid+"&type=music&httpsStatus=1&reqId=c4423541-62ec-11ec-8987-8d72733d6d4a"
    let name="http://m.kuwo.cn/newh5/singles/songinfoandlrc"
         +"?musicId="+rid
         +"&httpsStatus=1"
         +"&reqId=f8253ce0-8bba-11eb-8129-2d426b8a6ecc"
    GM_xmlhttpRequest({
        method: "get",
        url: name,
        onload: function(r) {
            let jsonTxt = r.response
            let json = JSON.parse(jsonTxt)
            //console.log(json.data.lrclist[0].lineLyric)
            let songName = json.data.lrclist[0].lineLyric
            down(url,songName)
        }
    });

		return;
	};
    // Your code here...

})();