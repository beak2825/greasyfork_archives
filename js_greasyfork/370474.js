// ==UserScript==
// @name         百度文库下载
// @namespace    http://oibit.cn/
// @version      1.0.2
// @description  百度文库下载接口
// @author       LangHu
// @match        *://wenku.baidu.com/view/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/370474/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/370474/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

$(document).ready(function() {
    var requestUrl = "aHR0cDovL2Rvd25sb2FkLm9pYml0LmNuLz91cmw9";
    var Base64={enKey:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",deKey:new Array(-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,62,-1,-1,-1,63,52,53,54,55,56,57,58,59,60,61,-1,-1,-1,-1,-1,-1,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,-1,-1,-1,-1,-1,-1,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,-1,-1,-1,-1,-1),encode:function(src){var str=new Array();var ch1,ch2,ch3;var pos=0;while(pos+3<=src.length){ch1=src.charCodeAt(pos++);ch2=src.charCodeAt(pos++);ch3=src.charCodeAt(pos++);str.push(this.enKey.charAt(ch1>>2),this.enKey.charAt(((ch1<<4)+(ch2>>4))&63));str.push(this.enKey.charAt(((ch2<<2)+(ch3>>6))&63),this.enKey.charAt(ch3&63))}if(pos<src.length){ch1=src.charCodeAt(pos++);str.push(this.enKey.charAt(ch1>>2));if(pos<src.length){ch2=src.charCodeAt(pos);str.push(this.enKey.charAt(((ch1<<4)+(ch2>>4))&63));str.push(this.enKey.charAt(ch2<<2&63),"=")}else{str.push(this.enKey.charAt(ch1<<4&63),"==")}}return str.join("")},decode:function(src){var str=new Array();var ch1,ch2,ch3,ch4;var pos=0;src=src.replace(/[^A-Za-z0-9\+\/]/g,"");while(pos+4<=src.length){ch1=this.deKey[src.charCodeAt(pos++)];ch2=this.deKey[src.charCodeAt(pos++)];ch3=this.deKey[src.charCodeAt(pos++)];ch4=this.deKey[src.charCodeAt(pos++)];str.push(String.fromCharCode((ch1<<2&255)+(ch2>>4),(ch2<<4&255)+(ch3>>2),(ch3<<6&255)+ch4))}if(pos+1<src.length){ch1=this.deKey[src.charCodeAt(pos++)];ch2=this.deKey[src.charCodeAt(pos++)];if(pos<src.length){ch3=this.deKey[src.charCodeAt(pos)];str.push(String.fromCharCode((ch1<<2&255)+(ch2>>4),(ch2<<4&255)+(ch3>>2)))}else{str.push(String.fromCharCode((ch1<<2&255)+(ch2>>4)))}}return str.join("")}};
    $('#doc-header-test h1').append('<button id="script_download" style="background:#FF0000"> 点击直接下载 </button>');
    $('#script_download').click(function() {
        window.open(Base64.decode(requestUrl) + Base64.encode(window.location.href));
    });
});
