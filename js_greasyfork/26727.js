// ==UserScript==
// @name     网易云音乐歌曲封面下载
// @namespace   网易云音乐歌曲封面下载
// @version      0.8
// @description  歌曲封面下载,优化网易云音乐歌曲歌词下载
// @author       opentdoor
// @match        http://music.163.com/*
// @match        https://music.163.com/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/26727/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E6%AD%8C%E6%9B%B2%E5%B0%81%E9%9D%A2%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/26727/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E6%AD%8C%E6%9B%B2%E5%B0%81%E9%9D%A2%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
(function(root) {
    'use strict';
    function Downloader() {
        // request
        function FileRequest(url, progress, callback) {
            var req = GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onprogress: function (res) {
                    if (progress) progress(res);
                },
                overrideMimeType: "text/plain;charset=x-user-defined",
                onreadystatechange: function (res) {
                    if (res.readyState == 4) {
                        if (res.status == 200) {
                            var str = res.response;
                            var ta1 = [];
                            for (var i = 0; i < str.length; i++) {
                                ta1[i] = str.charCodeAt(i) & 0x00ff;
                            }
                            var ua8 = new Uint8Array(ta1);
                            var blob = new Blob([ua8]);
                            callback(blob, res.status);
                        } else {
                            callback(null, res.status);
                        }
                    }
                }
            });
        };
        //save file
        function SaveFile(blob, filename) {
            if (root.navigator.msSaveBlob) {
                root.navigator.msSaveBlob(blob, filename);
            } else {
                var anchor = root.document.createElement('a');
                var url = root.URL.createObjectURL(blob);
                anchor.download = filename;
                anchor.href = url;
                var evt = root.document.createEvent("MouseEvents");
                evt.initEvent("click", true, true);
                anchor.dispatchEvent(evt);
                root.URL.revokeObjectURL(url);
            }
        }
        //interface
        function FileDownload(url, filename, downloading, success, error) {
            FileRequest(url, downloading, function (blob, status) {
                if (status == 200) {
                    SaveFile(blob, filename);
                    if (typeof success == 'function') success();
                } else {
                    if (typeof error == 'function') error(status);
                }
            });
        }
        this.FileDownload = FileDownload;
        var anthorEvents = {
            onprogress: function (res) {
                console.log(res);
                if (res.lengthComputable) {
                    this.anchor.innerHTML = `下载:${(res.loaded*100 / res.total).toFixed(2)}%`;
                } else {
                    this.anchor.innerHTML = "下载:" + anthorEvents.calcLength(res.loaded);
                }
            },
            calcLength: function (b) {
                b = Number(b) / 1024;
                if (b < 1024) {
                    return b.toFixed(1) + "KB";
                }
                b = b / 1024;
                if (b < 1024) {
                    return b.toFixed(2) + "MB";
                }
                b = b / 1024;
                return b.toFixed(3) + "GB";
            },
            onsuccess: function () {
                this.anchor.innerHTML = this.Html;
                this.doing = false;
            },
            onerror: function () {
                this.anchor.innerHTML = "下载失败";
                this.handler = setTimeout(function (t) {
                    t.anchor.innerHTML = t.Html;
                    t.doing = false;
                }, 2000, this);
            },
            onAnthorClick: function (e) {
                e = e || event;
                var a = this.anchor;
                var ex = /([\w\s]+)(\.\w)(\?.*)?$/i.exec(a.href || "");
                var name = a.download || a.title;
                if (ex) {
                    if (!name && ex.length > 1) name = ex[1];
                    if (name && name.indexOf('.') == -1 && ex.length > 2) name += ex[2];
                }
                if (!name || !a.href) return;
                e.preventDefault();
                if (this.doing) return;
                this.doing = true;
                FileDownload(a.href, name, anthorEvents.onprogress.bind(this), anthorEvents.onsuccess.bind(this), anthorEvents.onerror.bind(this));
            }
        };
        //interface
        function BindAnthor(a) {
            var env = { Html: a.innerHTML, anchor: a };
            a.addEventListener('click', anthorEvents.onAnthorClick.bind(env), true);
        }
        this.BindAnthor = BindAnthor;
    }
    //main
    var ggx=function(){
        var ww=document.getElementById("g_iframe").contentWindow;
        var do2=ww.document;
        var aa=do2.querySelector("a[data-action='outchain']");
        var info=do2.querySelectorAll("div.cnt .s-fc4 .s-fc7");
        console.log(info);
        var name=do2.querySelector(".f-ff2")&&info&&info.length>1?do2.querySelector(".f-ff2").innerText+"-"+info[0].innerText+"-"+info[1].innerText:document.title.replace(/\-.*$/i,'');
        var dl=new Downloader();
        if(aa){
            var a=do2.createElement('a');
            a.href= do2.querySelector(".j-img").dataset["src"];
            a.download=name+'.jpg';
            a.innerHTML='封面下载';
            a.classList.add("des");
            a.classList.add("s-fc7");
            var br=do2.createElement("br");
            var tgxz=do2.querySelector('.cnt .desc');
            if(tgxz&&tgxz.childNodes[0]&&tgxz.childNodes[0].textContent=="下载："){
                var lastA=tgxz.querySelector("a:last-of-type");
                if(lastA&&(lastA.innerHTML||"").indexOf("封面")>-1){
                  tgxz.removeChild(lastA);
                    a.innerHTML='封面';
                    if(aa.parentElement.querySelector('a:last-of-type').innerHTML=='封面下载')
                        aa.parentElement.removeChild(aa.parentElement.querySelector('a:last-of-type'));
                }
            tgxz.appendChild(a);
             dl.BindAnthor(a);
            }
           else 
            {
            if(aa.parentElement.querySelector('a:last-of-type').innerHTML=='封面下载')
              aa.parentElement.removeChild(aa.parentElement.querySelector('a:last-of-type'));
            else aa.parentElement.appendChild(br);
            aa.parentElement.appendChild(a);
            dl.BindAnthor(a);
            }
        }else{
            return;
        }
        //优化歌曲歌词下载
        do2.querySelector("div.cnt").addEventListener('mouseenter',function(e){
            if(e.target.tagName=="A"&&e.target.target=='_blank'&&!e.target.nnbk)
            {
                e.target.nnbk=true;
                var regx=/(\.mp3|\.flac|\.ape|\.mp4)(\?.*)?$/i;
                var mh=regx.exec(e.target.href);
                if(mh&&mh.length)
                { e.target.download=name+mh[1];
                 dl.BindAnthor(e.target);
                }
                if(/^data\:text\/plain/i.test(e.target.href))  e.target.download=name+".lrc";

            }
        },true);
    };
    var ggx2=function(){ setTimeout(ggx,50);setTimeout(ggx,2000); };
    if(document.getElementById("g_iframe")) document.getElementById("g_iframe").addEventListener('load',ggx2,false);
})(window);
