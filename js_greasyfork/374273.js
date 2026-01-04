// ==UserScript==
// @name         知网商店下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://mall.cnki.net/magazine/*
// @match        http://mall.cnki.net/*
// @match        http://mallonline.cnki.net/CnkiReadFile/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        unsafeWindow
// @require      https://cdn.jsdelivr.net/npm/file-saver@1.3.8/FileSaver.min.js
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/374273/%E7%9F%A5%E7%BD%91%E5%95%86%E5%BA%97%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/374273/%E7%9F%A5%E7%BD%91%E5%95%86%E5%BA%97%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    var res,flen,stdon,furl,name,name1,name2;
    stdon=document.createElement('a');
    stdon.id="startdownload";
    stdon.innerHTML="开始下载";
    stdon.style.background = '#0077D1';
    stdon.style.cursor = 'pointer';
    if(location.href.indexOf('CnkiReadFile')>-1){
        furl=location.href;
        console.log(furl);
    GM_xmlhttpRequest({
            method: "GET",
            url: furl,
            headers:({
                "User-Agent":"ReaderEx 2.3",
                "Request-Action":"fileinfo"
            }),
            onload: function(response) {
                res=response.responseXML;
                console.log(res);
                flen=res.querySelector('length').innerHTML;
                name=res.querySelector('filename').innerHTML;
                console.log("bytes=0-"+flen);
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: furl,
                    onloadstart:function(){alert('开始下载，请稍后！')},
                    headers:({
                        "User-Agent":"ReaderEx 2.3",
                        "Accept-Range":"bytes=0-"+flen,
                        "Range":"bytes=0-"+flen
                    }),
                    responseType:"blob",
                    onload:function(res){
                        let r = res.response;
                        saveAs(r,name);
                    }
                });
            }});
    }
    if(location.href.indexOf('onlineread')>-1){
        name1=document.title.split('-')[0];
        name=name1+".pdf";
        furl=viewurl;
        GM_xmlhttpRequest({
            method: "GET",
            url: furl,
            headers:({
                "User-Agent":"ReaderEx 2.3",
                "Request-Action":"fileinfo"
            }),
            onload: function(response) {
                res=response.responseXML;
                flen=res.querySelector('length').innerHTML;
                console.log("bytes=0-"+flen);
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: furl,
                    onloadstart:function(){alert('开始下载，请稍后！')},
                    headers:({
                        "User-Agent":"ReaderEx 2.3",
                        "Accept-Range":"bytes=0-"+flen,
                        "Range":"bytes=0-"+flen
                    }),
                    responseType:"blob",
                    onload:function(res){
                        let r = res.response;
                        saveAs(r,name);
                    }
                });
            }});
    }else{
        if(location.href.indexOf('Article')>-1){
            name1=$('#changeText > h1')[0].innerText;
            name=name1+".pdf";
            document.querySelector('#changeText > p:nth-child(3) > a:nth-child(2)').after(stdon);
        };
        if(location.href.indexOf('magadetail')>-1){
            name1=$('#bookbox > h1')[0].innerText;
            name2=$('#bookbox > h2')[0].innerText;
            name=name1+name2+".pdf";
            document.querySelector('.v3handbagbutt2').after(stdon);
        };
        $('#startdownload').click(function(){
            var wzurl=$('#startdownload').prev()[0].href;
            //console.log(wzurl);
            var wzres=$.get(wzurl,function(data,status){
                //console.log(data);
                var parser = new DOMParser();
                var doc = parser.parseFromString(data, "text/html");
                var wzscript=doc.querySelectorAll('script');
                wzscript=wzscript[2].innerText;
                eval(wzscript);//console.log([viewurl,sCode]);
                furl=viewurl;
                GM_xmlhttpRequest({
                    method: "GET",
                    url: furl,
                    headers:({
                        "User-Agent":"ReaderEx 2.3",
                        "Request-Action":"fileinfo"
                    }),
                    onloadstart:function(){alert('开始下载，请稍后！')},
                    onload: function(response) {
                        res=response.responseXML;
                        flen=res.querySelector('length').innerHTML;
                        console.log("bytes=0-"+flen);
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: furl,
                            headers:({
                                "User-Agent":"ReaderEx 2.3",
                                "Accept-Range":"bytes=0-"+flen,
                                "Range":"bytes=0-"+flen
                            }),
                            responseType:"blob",
                            onload:function(res){
                                let r = res.response;
                                console.log(r);
                                saveAs(r,name);
                            }
                        });
                    }});
            });

        });
    };

    // Your code here...
})();