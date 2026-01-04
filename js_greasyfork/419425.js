// ==UserScript==
// @name         四川大学快速学习
// @namespace    https://greasyfork.org/zh-CN/users/707063-genexy
// @version      202303271329
// @description  四川大学快速学习辅助工具，进入课程等待学习
// @author       流浪的蛊惑
// @run-at       document-end
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js
// @match        *://*.chaoxing.com/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/419425/%E5%9B%9B%E5%B7%9D%E5%A4%A7%E5%AD%A6%E5%BF%AB%E9%80%9F%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/419425/%E5%9B%9B%E5%B7%9D%E5%A4%A7%E5%AD%A6%E5%BF%AB%E9%80%9F%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==
/*MD5加密算法开始*/
var hexcase=0,chrsz=8;
function md5(s){return binl2hex(core_md5(str2binl(s), s.length * chrsz));}
function core_md5(x, len)
{
    x[len >> 5] |= 0x80 << ((len) % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;
    var a =  1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d =  271733878;
    for(var i = 0; i < x.length; i += 16)
    {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
        d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
        c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
        b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
        a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
        d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
        c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
        b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
        a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
        d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
        c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
        b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
        a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
        d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
        c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
        b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);
        a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
        d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
        c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
        b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
        a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
        d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
        c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
        b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
        a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
        d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
        c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
        b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
        a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
        d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
        c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
        b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);
        a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
        d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
        c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
        b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
        a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
        d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
        c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
        b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
        a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
        d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
        c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
        b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
        a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
        d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
        c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
        b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);
        a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
        d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
        c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
        b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
        a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
        d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
        c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
        b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
        a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
        d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
        c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
        b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
        a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
        d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
        c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
        b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);
        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
    }
    return Array(a, b, c, d);
}
function md5_cmn(q, a, b, x, s, t)
{
    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
    return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
    return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
    return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
    return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}
function core_hmac_md5(key, data)
{
    var bkey = str2binl(key);
    if(bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);
    var ipad = Array(16), opad = Array(16);
    for(var i = 0; i < 16; i++)
    {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }
    var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
    return core_md5(opad.concat(hash), 512 + 128);
}
function safe_add(x, y)
{
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
}
function bit_rol(num, cnt)
{
    return (num << cnt) | (num >>> (32 - cnt));
}
function str2binl(str)
{
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for(let i=0;i<str.length * chrsz;i+= chrsz)
        bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
    return bin;
}
function binl2hex(binarray)
{
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for(let i = 0; i < binarray.length * 4; i++)
    {
        str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
            hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
    }
    return str;
}
/*MD5加密算法结束*/
function addXMLRequestCallback(callback){//监听请求
    var oldSend, i;
    if( XMLHttpRequest.callbacks ) {
        XMLHttpRequest.callbacks.push( callback );
    } else {
        XMLHttpRequest.callbacks = [callback];
        oldSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(){//监听发送
            for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
                XMLHttpRequest.callbacks[i]( this );
            }
            oldSend.apply(this, arguments);
        }
    }
}
var oenc="";
function dovideo(data,objn){//提交学习进度
    $.ajax({
        method:"GET",
        url:data,
        success:function(e){
            vplay=true;
            tlsj=0
            localStorage.setItem(objn,"");
        }
    });
}
var vplay=true,tlsj=0;
(function() {
    'use strict';
    var nbtn=document.getElementsByClassName("orientationright");
    var tjbtn=document.getElementsByClassName("Btn_blue_1 marleft10");
    var jjbtn=document.getElementsByClassName("marTop30");
    var video=document.getElementsByTagName("video");
    var audio=document.getElementsByTagName("audio");
    var title=document.getElementsByTagName("h1");
    var coursetree=document.getElementById("coursetree");
    var gcdjs=0;
    setInterval(function(){
        if(video.length>0 && vplay){
            tlsj=0;
            video[0].play();
            video[0].muted=true;
            video[0].addEventListener("play", function(){//监听暂停
                vplay=false;
            });
            video[0].addEventListener("pause", function(){//监听暂停
                video[0].play();
            });
        }
        if(video.length>0){
            let obj=JSON.parse($("iframe", parent.document)[0].getAttribute("data"));
            localStorage.setItem(obj.objectid,video[0].currentTime);
        }
        if(coursetree!=null){//课程导航
            gcdjs++;
            if(gcdjs>6){
                gcdjs=0;
                let gnext=false;
                let ga=coursetree.getElementsByTagName("a");
                for(let i=0;i<ga.length;i++){
                    let gdq=document.getElementById("cur"+ga[i].getAttribute("href").split(",")[2].split("'")[1]);
                    if(gnext){
                        if(gdq.getElementsByTagName("span")[1].outerHTML.indexOf("blue")==-1){
                            ga[i].click();
                            break;
                        }
                    }else{
                        if(gdq.outerHTML.indexOf("currents")>-1){
                            if(gdq.getElementsByTagName("span")[1].outerHTML.indexOf("blue")>-1){
                                gnext=true;
                            }
                        }
                    }
                }

            }
        }
        if(audio.length>0 && vplay){
            tlsj=0;
            audio[0].play();
            audio[0].muted=true;
            audio[0].addEventListener("play", function(){//监听暂停
                vplay=false;
            });
            audio[0].addEventListener("pause", function(){//监听暂停
                audio[0].play();
            });
        }
        if(audio.length>0){
            if(audio[0].currentTime>32){
                location.reload();
            }
        }
        if(title.length>0){
            let obj={};
            try
            {
                obj=JSON.parse($("#iframe").contents().find("iframe")[0].getAttribute("data"));
            }
            catch(err)
            {
                obj={objectid:"err"};
            }
            let gct=localStorage.getItem(obj.objectid);
            title[0].innerText="学习时间："+(tlsj++)+" 秒，当前播放时间："+gct+"秒";
            if(tlsj>60 || (gct==null && tlsj>40)){
                if(localStorage.getItem(obj.objectid+",nbtn")!=null){
                    localStorage.removeItem(obj.objectid+",nbtn");
                }
                vplay=true;
                tlsj=0;
                let gzjcs=document.getElementById("dct2");
                if(gzjcs!=null){
                    if(localStorage.getItem("学习完成")==null){
                        gzjcs.click();
                    }else{
                        localStorage.removeItem("学习完成");
                        location.reload();
                    }
                }else{
                    if(localStorage.getItem("学习完成")==null){
                        nbtn[0].click();
                    }else{
                        localStorage.removeItem("学习完成");
                        location.reload();
                    }
                }
            }
        }
        if(nbtn.length>0){
            let obj={};
            try
            {
                obj=JSON.parse($("#iframe").contents().find("iframe")[0].getAttribute("data"));
            }
            catch(err)
            {
                obj={objectid:"err"};
            }
            if(localStorage.getItem(obj.objectid+",nbtn")!=null){
                localStorage.removeItem(obj.objectid+",nbtn");
                tlsj=0;
                let gzjcs=document.getElementById("dct2");
                if(gzjcs!=null){
                    if(localStorage.getItem("学习完成")==null){
                        gzjcs.click();
                    }else{
                        localStorage.removeItem("学习完成");
                        location.reload();
                    }
                }else{
                    if(localStorage.getItem("学习完成")==null){
                        nbtn[0].click();
                    }else{
                        localStorage.removeItem("学习完成");
                        location.reload();
                    }
                }
            }
        }
    },1000);
    addXMLRequestCallback( function( xhr ) {
        xhr.addEventListener("load", function(){
            if (xhr.readyState==4 && xhr.status==200) {
                if (xhr.responseURL.includes("playingTime=")){
                    let dat=JSON.parse(xhr.responseText);
                    let bdhtml=xhr.responseURL,prnhtml,gurl
                    prnhtml = bdhtml.substring(bdhtml.indexOf("clazzId=")+8);
                    prnhtml = prnhtml.substring(0,prnhtml.indexOf("&"));
                    let clazzId=prnhtml;
                    prnhtml = bdhtml.substring(bdhtml.indexOf("userid=")+7);
                    prnhtml = prnhtml.substring(0,prnhtml.indexOf("&"));
                    let userid=prnhtml;
                    prnhtml = bdhtml.substring(bdhtml.indexOf("jobid=")+6);
                    prnhtml = prnhtml.substring(0,prnhtml.indexOf("&"));
                    let jobid=prnhtml;
                    prnhtml = bdhtml.substring(bdhtml.indexOf("objectId=")+9);
                    prnhtml = prnhtml.substring(0,prnhtml.indexOf("&"));
                    let objectId=prnhtml;
                    prnhtml = bdhtml.substring(bdhtml.indexOf("playingTime=")+12);
                    prnhtml = prnhtml.substring(0,prnhtml.indexOf("&"));
                    let playingTime=prnhtml;
                    prnhtml = bdhtml.substring(bdhtml.indexOf("duration=")+9);
                    prnhtml = prnhtml.substring(0,prnhtml.indexOf("&"));
                    let duration=prnhtml;
                    prnhtml = bdhtml.substring(bdhtml.indexOf("clipTime=")+9);
                    prnhtml = prnhtml.substring(0,prnhtml.indexOf("&"));
                    let clipTime=prnhtml;
                    let enc="["+clazzId+"]["+userid+"]["+jobid+"]["+objectId+"]["+(duration*1000)+"][d_yHJ!$pdA~5]["+(duration*1000)+"]["+clipTime+"]";
                    if(dat.isPassed){
                        if(localStorage.getItem(objectId)!=null){
                            localStorage.removeItem(objectId);
                        }
                        vplay=true;
                        tlsj=0;
                        localStorage.setItem(objectId+",nbtn","");
                    }else{
                        setInterval(function(){
                            let gct=localStorage.getItem(objectId);
                            if(gct!=null){
                                if(gct-playingTime>30){
                                    localStorage.setItem("学习完成","");
                                    localStorage.removeItem(objectId);
                                    if(oenc!=enc){
                                        tlsj=0;
                                        oenc=enc;
                                        gurl = bdhtml.substring(0,bdhtml.indexOf("enc=")+4);
                                        prnhtml = bdhtml.substring(bdhtml.indexOf("enc=")+4);
                                        gurl+=md5(enc)+prnhtml.substring(prnhtml.indexOf("&"));
                                        bdhtml=gurl;
                                        gurl = bdhtml.substring(0,bdhtml.indexOf("playingTime=")+12);
                                        prnhtml = bdhtml.substring(bdhtml.indexOf("playingTime=")+12);
                                        gurl+=duration+prnhtml.substring(prnhtml.indexOf("&"));
                                        dovideo(gurl,objectId+",nbtn");
                                    }
                                }
                            }
                        },1000);
                    }
                }
            }
        });
    });
})();