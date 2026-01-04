// ==UserScript==
// @name         free-ss.site 生成全部链接
// @version      1.2
// @description  将所有分享ss链接全部显示，方便统一复制使用
// @author       mumumi
// @connect      test.cityfun.com.cn
// @include      *://free-ss.site*
// @match        *://free-ss.site*
// @require      http://cdn.jsdelivr.net/npm/js-base64@2.4.3/base64.min.js
// @require      http://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @namespace    http://tampermonkey.net/
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @note         2021-03-02_1.1  修复Firefox下的bug
// @note         2021-03-09_1.2  修复总条数少于10时Max取真实条数
// @note         2019-5-5_0.4    推送SSR订阅
// @note         2019-2-11_0.3   新增生成SSR订阅
// @note         2017-1-31_0.2   不直接显示连接，变为两个复制按钮，点击即可复制所有链接，新增SSR链接（带备注与分组信息）
// @note         2017-1-26_0.1   成功打开页面后直接展示所有ss链接
// @downloadURL https://update.greasyfork.org/scripts/389870/free-sssite%20%E7%94%9F%E6%88%90%E5%85%A8%E9%83%A8%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/389870/free-sssite%20%E7%94%9F%E6%88%90%E5%85%A8%E9%83%A8%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==


console.log("in");
(function() {
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
        var exitTime = now.getTime() + 30000;
        while (true) {
            if (document.querySelector("tbody:nth-child(2)") != null && document.querySelector("tr:nth-child(6)") != null)
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
    $(document).ready(function() {
        var ntv=self.setInterval(function() {
            loop();
            console.log('loop over');
            var ss_links = "<p id='ss-links' style='border-style:double;text-align:left;display:none'></p>";
            var ssr_links = "<p id='ssr-links' style='border-style:double;text-align:left;display:none'></p>";
            var ssrs_links = "<p id='ssrs-links' style='border-style:double;text-align:left;display:none'></p>";
            var link_btn = "<ul><li class='aff'><p style='margin: 0;' id='link_num'></p></li><li class='aff'><button id='btn_ss'>复制所有SS链接</button></li><li class='aff'><button id='btn_ssr'>复制所有SSR链接</button></li><li class='aff'><button id='b_ssr'>复制SSR订阅</button></li></ul>";
            $(".main").append(ss_links);
            $(".main").append(ssr_links);
            $(".main").append(ssrs_links);
            $(".main").append('<textarea id="forCopy" style="position: absolute;top: 0;left: 0;opacity: 0;z-index: -10;"> </textarea>');
            $(".main").prepend(link_btn);
            var ss_links_str = [];
            var ssr_links_str = [];
            var ssrs_links_str = [];
            $("tbody td>i.fa-qrcode[style='cursor:pointer']").closest("tbody").find("tr").each(
                (i, el) => {
                    let tds = $(el).find("td");
                    var ss = 'ss://'+b64($(tds).eq(3).text()+':'+$(tds).eq(4).text()+'@'+$(tds).eq(1).text()+':'+$(tds).eq(2).text()),
                        //ssr = 'ssr://'+b64($(tds).eq(1).text()+':'+$(tds).eq(2).text()+':origin:'+$(tds).eq(3).text()+':plain:'+b64($(tds).eq(4).text())+'/?obfsparam=&protoparam=&remarks='+b64(getTime($(tds).eq(5).text())+'-'+$(tds).eq(6).text()+'-'+$(tds).eq(1).text()+'-'+$(tds).eq(0).text().replace(/[↑↓]/g,'').replace(/\//g,'_'))+'&group=TU1NU1NS'),
                        ssr = 'ssr://'+b64($(tds).eq(1).text()+':'+$(tds).eq(2).text()+':origin:'+$(tds).eq(3).text()+':plain:'+b64($(tds).eq(4).text())+'/?obfsparam=&protoparam=&remarks='+b64(getTime($(tds).eq(5).text())+'-'+$(tds).eq(6).text()+'-'+$(tds).eq(1).text()+'-'+$(tds).eq(0).text().replace(/[↑↓]/g,'').replace(/\//g,'.'))+'&group=TU1NU1NS');
                    var ssrs = ssr;
                    $("#ss-links").append(ss+'<br>');
                    $("#ssr-links").append(ssr+'<br>');
                    $("#ssrs-links").append(ssrs+'<br>');
                    ss_links_str.push(ss);
                    ssr_links_str.push(ssr);
                    ssrs_links_str.push(ssrs);
                }
            )
            document.getElementById('btn_ss').addEventListener('click',function(ev){
                copy(ss_links_str.join('\r\n'));
            });
            document.getElementById('btn_ssr').addEventListener('click',function(ev){
                copy(ssr_links_str.join('\r\n'));
            });
            var sss = b64(ssrs_links_str.join('\r\n'), false);
            var sss10 = b64('MAX=10\r\n'+ssrs_links_str.join('\r\n'), false);
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
                ssrs_links_str = [];
                $("tbody td>i.fa-qrcode[style='cursor:pointer']").closest("tbody").find("tr").each(
                    (i, el) => {
                        let tds = $(el).find("td");
                        var ssrs = 'ssr://'+b64($(tds).eq(1).text()+':'+$(tds).eq(2).text()+':origin:'+$(tds).eq(3).text()+':plain:'+b64($(tds).eq(4).text())+'/?obfsparam=&protoparam=&remarks='+b64(getTime($(tds).eq(5).text())+'-'+$(tds).eq(6).text()+'-'+$(tds).eq(1).text()+'-'+$(tds).eq(0).text().replace(/[↑↓]/g,'').replace(/\//g,'.'))+'&group=TU1NU1NS');
                        ssrs_links_str.push(ssrs);
                    }
                )
                if (ssrs_links_str.length > 0) {
                    var max = 10;
                    if (ssrs_links_str.length < 10) {
                        max = ssrs_links_str.length;
                    }
                    var sss = b64(ssrs_links_str.join('\r\n'), false);
                    var sss10 = b64('MAX='+max+'\r\n'+ssrs_links_str.join('\r\n'), false);
                    var formData = new FormData();
                    formData.append('data', sss);
                    $.ajax({url:"https://test.cityfun.com.cn/wxser/cache/ssr-all",type:"POST",data:formData,contentType:false,processData:false,cache:false,async:true,xhrFields:{withCredentials:true},crossDomain:true,success:function(data){alert(data.responseText);}})
                    formData = new FormData();
                    formData.append('data', sss10);
                    $.ajax({url:"https://test.cityfun.com.cn/wxser/cache/ssr",type:"POST",data:formData,contentType:false,processData:false,cache:false,async:true,xhrFields:{withCredentials:true},crossDomain:true,success:function(data){alert(data.responseText);}})
                }
                copy(sss);
            });
            //console.log(ssrs_links_str);
            if (ssrs_links_str.length > 0) {
                var formData = new FormData();
                formData.append('data', sss);
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: "https://test.cityfun.com.cn/wxser/cache/ssr-all",
                    data:formData,
                    onload: function (response) {
                        console.log(response.responseText, "success");
                    }
                })
                formData = new FormData();
                formData.append('data', sss10);
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: "https://test.cityfun.com.cn/wxser/cache/ssr",
                    data:formData,
                    onload: function (response) {
                        console.log(response.responseText, "success");
                    }
                })
            }
            // $.ajax({url:"https://test.cityfun.com.cn/wxser/cache/ssr",type:"POST",data:formData,contentType:false,processData:false,cache:false,async:true,success:function(data){alert(data.responseText);}})
            window.clearInterval(ntv)
        }, 10000)
        });
})();