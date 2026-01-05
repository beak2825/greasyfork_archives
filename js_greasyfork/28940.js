// ==UserScript==
// @name         NyasoYun
// @namespace    https://nyaso.com/#pan
// @version      0.7
// @description  检测喵搜百度云搜索结果是否失效
// @author       pojtt
// @match        *://*.nyaso.com/pan/*
// @match        *://*.nyaso.net/pan/*
// @match        https://pan.baidu.com/404
// @grant        GM_xmlhttpRequest
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/28940/NyasoYun.user.js
// @updateURL https://update.greasyfork.org/scripts/28940/NyasoYun.meta.js
// ==/UserScript==

var Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = Base64._utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
        }
        return output;
    },
    decode: function(input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = Base64._utf8_decode(output);
        return output;
    },
    _utf8_encode: function(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    },
    _utf8_decode: function(utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
};

(function() {
    var prev = $(".pages a:first").attr('href');
    var next = $(".pages a:last").attr('href');
    $(".pages").html('<a class="button" href="'+prev+'">回头看看</a><a style="margin-left:12px" class="button button-primary" href="'+next+'">继续瞧瞧 (｀･ω･´ ) </a>');
    $("a.button").bind('click',function(){location=$(this).attr('href');return false;});
    if (localStorage.checkfail == 0) {
        $("#NyasoYun").text('失效检测已关闭，点击开启');
        $("#NyasoYun").removeAttr('target');
        $("#NyasoYun").attr('href', 'javascript:localStorage.checkfail=1;location.reload()');
        return false;
    }
    if (location.href == 'https://pan.baidu.com/404') {
        var hash = (Math.random().toString(36).substr(2)+Math.random().toString(36).substr(2)+Math.random().toString(36).substr(2)).toUpperCase().substr(0,31);
        document.cookie="BAIDUID="+hash+"; domain=.baidu.com; path=/share/";
        document.cookie="BAIDUID="+hash+"; domain=.baidu.com; path=/s/";
    }else{
        $("#NyasoYun").after('<iframe src="https://pan.baidu.com/404" style="width:0;height:0;display:none"></iframe>');
        if ($(".u-full-width tr").length>1)
            $("#NyasoYun").text('失效链接检测中…');
        var num = fail = total = 0;
        $(".u-full-width tr").each(function(){
            if ($(this).find('a.pan').length>0) {
                var data = $(this).find('a.pan').attr('data');
                var url = Base64.decode(data).replace(/http:/,'https:').replace(/pan.baidu.com/,'yun.baidu.com')+"#"+$(this).attr('id');
                total++;
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    onload: function(response) {
                        if (response.responseText.indexOf('页面不存在')>0) {
                            $("#NyasoYun").text('百度云请求过于频繁！');
                            localStorage.checkfail = 0;
                            return false;
                        } else if (response.responseText.indexOf('链接不存在')>0) {
                            fail++;
                            var id = response.finalUrl.split('#').pop();
                            var tr = $("#"+id).find("a:first");
                            tr.attr('style','text-decoration:line-through;color:#dcdcdc;font-style:italic');
                            tr.text(tr.text()+'（失效）');
                        }
                        num++;
                        if (num==total)
                            $("#NyasoYun").text('存活百度云：'+(total-fail)+'/'+total);
                    }
                });
            }

        });
    }
})();