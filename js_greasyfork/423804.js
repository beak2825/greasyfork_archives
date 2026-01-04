// ==UserScript==
// @name         酷狗音乐直接下载不用下载软件
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  【酷狗音乐】免费歌曲下载
// @author       MrHao
// @match        https://www.kugou.com/song/
// @match        http://www.kugou.com/song/
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/423804/%E9%85%B7%E7%8B%97%E9%9F%B3%E4%B9%90%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD%E4%B8%8D%E7%94%A8%E4%B8%8B%E8%BD%BD%E8%BD%AF%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/423804/%E9%85%B7%E7%8B%97%E9%9F%B3%E4%B9%90%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD%E4%B8%8D%E7%94%A8%E4%B8%8B%E8%BD%BD%E8%BD%AF%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("==================================KUGOU=Hack=By=MrHao==================================")
    function getURLParameter(url, name) {
        return (RegExp(name + '=' + '(.+?)(&|$)').exec(url)||[,null])[1];
    }


    var down_load=document.getElementsByClassName("btnArea2 clearfix")[0]
    down_load.innerHTML="";
    console.log(down_load)
    //创建下载按钮
    var button = document.createElement("button");
    button.id = "down_load";
	button.textContent = "下载";
	button.style.width = "230px";
	button.style.height = "50px";
    button.style.color = "#fff";
    button.style.cursor="pointer";
    button.style.background = "#000";

   let mp3_Link
   let mp3_Name
    //绑定按键点击功能

    down_load.appendChild(button)
    button.onclick = function (){
    let hash= getURLParameter(location.href,'hash')
    let album_id= getURLParameter(location.href,'album_id')
    let url="https://wwwapi.kugou.com/yy/index.php?"
             +"r=play/getdata&callback=jQuery1910039301040953223954_1615862197461"
             +"&hash="+hash
             +"&dfid=4WGH8E0P3b2y3Ze9cT1Du111"
             +"&mid=c460457c691decf3ce5c6e761b65c7d1"
             +"&platid=4"
             +"&album_id="+album_id
             +"&_=1615862197462";
        GM_xmlhttpRequest({
        method: "post",
        url: url,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        onload: function(r) {
            let jsonTxt = r.responseText
            let num = jsonTxt.indexOf("{");
            let json = jsonTxt.substr(num,jsonTxt.length).replace(");","");
            json = JSON.parse(json)
            mp3_Link = json.data.play_url
            mp3_Name = json.data.song_name
            GM_download(mp3_Link,mp3_Name+".mp3")
        }
    })
		return;
	};


})();