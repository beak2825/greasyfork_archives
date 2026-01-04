// ==UserScript==
// @name         获取youneed.win免费v2ray的url
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  F12调出控制台查看
// @author       ipez
// @match        https://www.youneed.win/free-v2ray
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403852/%E8%8E%B7%E5%8F%96youneedwin%E5%85%8D%E8%B4%B9v2ray%E7%9A%84url.user.js
// @updateURL https://update.greasyfork.org/scripts/403852/%E8%8E%B7%E5%8F%96youneedwin%E5%85%8D%E8%B4%B9v2ray%E7%9A%84url.meta.js
// ==/UserScript==

(function() {

$(document).ready(function(){
        var newElement = "<tr>";
        newElement += "<td colspan='10' align='right'>&nbsp;批量获取v2ray链接，F12打开console控制台：";
            newElement += "<button type='button' id='getInfoBtn' class='btn' value=''>获取</button>";
            newElement += "</tr>";
            $("h2")[0].lastChild.after($(newElement)[0]);
            addBtnEvent("getInfoBtn");
        });

    function addBtnEvent(id){
        $("#"+id).bind("click",function(){
            getInfo();
        });
    }

function getInfo(){
 function utf8ToBase64(str){
  return btoa(unescape(encodeURIComponent(str)));
}
var v2 = document.querySelectorAll("#post-box > div > section > div > table > tbody > tr")
var v2ray_LinkList = [];
var v2ray_obj={};
var v2ray_LinkList_obj=[];
for (var i=0; i<v2.length; i++) {
// 	{
// "v": "2",
// "ps": "备注别名",
// "add": "111.111.111.111",
// "port": "32000",
// "id": "1386f85e-657b-4d6e-9d56-78badb75e1fd",
// "aid": "100",
// "net": "tcp",
// "type": "none",
// "host": "www.bbb.com",
// "path": "/",
// "tls": "tls"
// }
	v2ray_obj["v"]="2"
    v2ray_obj["add"]=v2[i].children[1].innerText
	v2ray_obj["ps"]=v2ray_obj["add"]
    v2ray_obj["port"]=v2[i].children[2].innerText
    v2ray_obj["id"]=v2[i].children[3].innerText
    v2ray_obj["aid"]=0
    v2ray_obj["net"]=v2[i].children[4].innerText
    v2ray_obj["type"]="none"
    v2ray_obj["host"]=""
    v2ray_obj["path"]=v2[i].children[5].innerText
    v2ray_obj["tls"]=v2[i].children[6].innerText
    v2ray_LinkList_obj.push('vmess://'+utf8ToBase64(JSON.stringify(v2ray_obj)));
     //v2ray_LinkList_obj.push(JSON.stringify(v2ray_obj))
}
console.log(v2ray_LinkList_obj.join('\n\n'))
//console.log(v2ray_LinkList.join('\n'))
alert("请按F12,查看console")
}

})();