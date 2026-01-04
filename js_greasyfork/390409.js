// ==UserScript==
// @name         www.youneed.win全部链接
// @version      0.7
// @description  将所有分享ss链接全部显示，方便统一复制使用
// @author       mumumi
// @match        *://flywind.ml/free-ssr*
// @match        *://www.youneed.win/free-ssr*
// @match        *://youneed.win/free-ssr*
// @require      http://cdn.jsdelivr.net/npm/js-base64@2.4.3/base64.min.js
// @require      http://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @run-at       document-end
// @namespace    http://tampermonkey.net/
// @grant        GM_xmlhttpRequest

// @downloadURL https://update.greasyfork.org/scripts/390409/wwwyouneedwin%E5%85%A8%E9%83%A8%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/390409/wwwyouneedwin%E5%85%A8%E9%83%A8%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

function change(t){
    if(t<10){
        return "0"+t;
    }else{
        return ""+t;
    }
}
function getTime(t = '') {
    var date = new Date();
    var mon = change(date.getMonth() + 1);
    var day = change(date.getDate());
    var hour = change(date.getHours());
    var minute = change(date.getMinutes());
    if (t.indexOf(':') > 0) {
        var arr = t.split(':');
        return mon + day + arr[0] + arr[1];
    } else {
        return mon + day + hour + minute;
    }
}
function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}
function loop() {
    var now = new Date();
    var exitTime = now.getTime() + 3000;
    while (true) {
        if ($('tbody').length > 1 && $('tr').length > 10)
            return;
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}
function b64(str, isShort = true) {
    var b64Str = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(str));
    // var b64Str = Base64.encodeURI(str);
    b64Str = b64Str.replace(/\//g, '_').replace(/\+/g, '-');
    if (isShort) {
        b64Str = b64Str.replace(/=/g, '');
    }
	return b64Str;
}
function copy(str){
    var input = document.getElementById("forCopy");
    input.value = str; // 修改文本框的内容
    input.select(); // 选中文本
    document.execCommand("copy"); // 执行浏览器复制命令
    alert("链接复制成功");
}
(function() {
    $(document).ready(function() {
        var ntv=self.setInterval(function() {
            loop();
            console.log('loop over');
            var ss_links = "<p id='ss-links' style='border-style:double;text-align:left;display:none'></p>";
            var ssr_links = "<p id='ssr-links' style='border-style:double;text-align:left;display:none'></p>";
            var ssrs_links = "<p id='ssrs-links' style='border-style:double;text-align:left;display:none'></p>";
            var link_btn = "<ul><li class='aff'><p style='margin: 0;' id='link_num'></p></li><li class='aff'><button id='btn_ss'>复制所有SS链接</button></li><li class='aff'><button id='btn_ssr'>复制所有SSR链接</button></li><li class='aff'><button id='b_ssr'>复制SSR订阅</button></li></ul>";
            $("h2.post-title").append(ss_links);
            $("h2.post-title").append(ssr_links);
            $("h2.post-title").append(ssrs_links);
            $("h2.post-title").append('<textarea id="forCopy" style="position: absolute;top: 0;left: 0;opacity: 0;z-index: -10;"> </textarea>');
            $("h2.post-title").prepend(link_btn);
            var ss_links_str = [];
            var ssr_links_str = [];
            var ssrs_links_str = [];
            var tStr = $("#post-box > div > section > p:nth-child(1)").text().trim().split("：")[1];
            //$("tbody td>a:contains('右键复制链接')").closest("tbody").find("tr").each(
            $("tbody td>a:contains('码')").closest("tbody").find("tr").each(
                (i, el) => {
                    let tds = $(el).find("td");
                    var ss = 'ss://'+b64($(tds).eq(4).text()+':'+$(tds).eq(3).text()+'@'+$(tds).eq(1).text()+':'+$(tds).eq(2).text()),
                        ssr = 'ssr://'+b64($(tds).eq(1).text()+':'+$(tds).eq(2).text()+':'+$(tds).eq(5).text()+':'+$(tds).eq(4).text()+':'+$(tds).eq(6).text()+':'+b64($(tds).eq(3).text())+'/?remarks='+b64(getTime(tStr)+'-'+$(tds).eq(1).text())+'&group=U211U211Um1p');
                    var ssrs = ssr;
                    $("#ss-links").append(ss+'\r\n');
                    $("#ssr-links").append(ssr+'\r\n');
                    $("#ssrs-links").append(ssrs+'\r\n');
                    ss_links_str.push(ss);
                    ssr_links_str.push(ssr);
                    ssrs_links_str.push(ssrs);
                }
            )
            document.getElementById('btn_ss').addEventListener('click',function(ev){
                copy(document.getElementById("ss-links").innerText);
            });
            document.getElementById('btn_ssr').addEventListener('click',function(ev){
                copy(document.getElementById("ssr-links").innerText);
            });
            var sss = b64(ssrs_links_str.join('\r\n'), false);
            var sss10 = b64('MAX=20\r\n'+ssrs_links_str.join('\r\n'), false);
            document.getElementById('b_ssr').addEventListener('click',function(ev){
                function b64(str, isShort = true) {
                    var b64Str = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(str));
                    // var b64Str = Base64.encodeURI(str);
                    b64Str = b64Str.replace(/\//g, '_').replace(/\+/g, '-');
                    if (isShort) {
                        b64Str = b64Str.replace(/=/g, '');
                    }
                    return b64Str;
                }
                ssrs_str = document.getElementById("ssrs-links").innerText;
                if (ssrs_str.length > 0) {
                    var sss = b64(ssrs_str, false);
                    var sss10 = b64('MAX=10\r\n'+ssrs_str, false);
                    var formData = new FormData();
                    formData.append('data', sss);
                    $.ajax({url:"https://test.cityfun.com.cn/wxser/cache/ynw-all",type:"POST",data:formData,contentType:false,processData:false,cache:false,async:true,xhrFields:{withCredentials:true},crossDomain:true,success:function(data){alert(data.responseText);}})
                    formData = new FormData();
                    formData.append('data', sss10);
                    $.ajax({url:"https://test.cityfun.com.cn/wxser/cache/ynw",type:"POST",data:formData,contentType:false,processData:false,cache:false,async:true,xhrFields:{withCredentials:true},crossDomain:true,success:function(data){alert(data.responseText);}})
                }
                copy(sss);
            });
            if (ssrs_links_str.length > 0) {
                var formData = new FormData();
                formData.append('data', sss);
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: "https://test.cityfun.com.cn/wxser/cache/ynw-all",
                    data:formData,
                    onload: function (response) {
                        console.log(response.responseText);
                    }
                })
                formData = new FormData();
                formData.append('data', sss10);
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: "https://test.cityfun.com.cn/wxser/cache/ynw",
                    data:formData,
                    onload: function (response) {
                        console.log(response.responseText);
                    }
                })
            }
            var headObj = document.getElementsByTagName("head")[0];
            var scriptObj = document.createElement("script");
            scriptObj.language = "javaScript";
            scriptObj.type = "text/JavaScript";
            scriptObj.src = "https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js";
            headObj.appendChild(scriptObj);
            // $.ajax({url:"https://test.cityfun.com.cn/wxser/cache/ynw",type:"POST",data:formData,contentType:false,processData:false,cache:false,async:true,success:function(data){alert(data.responseText);}})
            window.clearInterval(ntv)
        },1500);
        window.__copy_text_to_clipboard__ = true;
        function copyToClipboard(str) {
            const textAreaElement = document.createElement('textarea');
            const iframe = this.__copy_text_to_clipboard__ ? document.createElement('iframe') : textAreaElement;
            iframe.style.display = 'none';
            textAreaElement.value = str;
            document.body.appendChild(iframe);
            if (this.__copy_text_to_clipboard__) {
                iframe.contentDocument.body.append(textAreaElement)
            }
            textAreaElement.select();
            document.execCommand('copy');
            document.body.removeChild(iframe);
        }
        var ntv1=setInterval(function() {
            var a=[];document.querySelectorAll('a[href^="ssr://"]').forEach(x => {a.push(x.getAttribute("href"))});console.log(a.join("\r\n"));copyToClipboard(a.join("\r\n"));
            window.clearInterval(ntv1);
        },100);
        });
})();