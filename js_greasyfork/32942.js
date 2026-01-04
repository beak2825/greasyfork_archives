// ==UserScript==
// @name         Lofter(乐乎)原图查看下载
// @namespace    LofterSpider
// @homepage     https://github.com/LanlingKira/lofter
// @version      0.1.2
// @description  下载lofter上的超清原图，prprprpr
// @author       兰陵
// @match        *://*.lofter.com/post/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/32942/Lofter%28%E4%B9%90%E4%B9%8E%29%E5%8E%9F%E5%9B%BE%E6%9F%A5%E7%9C%8B%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/32942/Lofter%28%E4%B9%90%E4%B9%8E%29%E5%8E%9F%E5%9B%BE%E6%9F%A5%E7%9C%8B%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
(function() {
    "use strict";
    var css = document.createElement("style");
    css.type = "text/css";
    css.id = "spidercss";
    var cssText = "#lofterspider{position:fixed;top:0;left:50%;width:100%;height:100%;background:rgba(229,229,229,.95);padding:0;margin:0 auto;font-size:16px;-ms-transform:translateX(-50%);-o-transform:translateX(-50%);-moz-transform:translateX(-50%);-webkit-transform:translateX(-50%);transform:translateX(-50%);z-index:9999999999999}#lofterspider p:first-child{position:absolute;left:0;top:0;width:100%;margin:0;padding:10px;background:#fff;box-shadow:0 0 4px rgba(0,0,0,.2);text-align:center;font-size:1.5em;color:#555}#spiderclose{position:absolute;right:12px;margin:0;padding:10px 0 10px 16px;font-size:1.5em;border-left:1px solid #555;font-weight:700;color:#555}#lofterspider ul{position:relative;top:15%;margin:0;padding:0}#lofterspider ul li{width:20%;text-align:center;float:left;padding-bottom:5px;list-style:none}#lofterspider ul li img{width:90%}#lofterspider ul li img:hover{opacity:.6}#lofterspider ul li p{color:#555;margin:0}#lofterspider ul li p a{margin:auto 10px;color:#673ab7;text-decoration:none}#spiderboprt{position:fixed;top:7px;right:15px;margin:0 5px 0 0;z-index:9999999999999}#spiderboprt a,#spiderboprt em{height:23px;line-height:23px;float:left;background:url(//l.bst.126.net/rsc/img/control/operatenew24.png?005) no-repeat}#spiderboprt a{padding:0 2px 0 0;cursor:pointer;text-decoration:none;background-position:right 0}#spiderboprt a:hover em,#spiderboprt em{color:#fff;padding:0 5px 0 26px;white-space:nowrap;font-weight:400;font-style:normal}#spiderboprt em{background-position:0 -750px;font-size:12px}#spiderboprt a:hover{background-position:right -870px}#spiderboprt a:hover em{background-position:0 -780px}";
    css.innerHTML = cssText;
    if (document.getElementById("spidercss") == undefined) {
        document.getElementsByTagName("head")[0].appendChild(css);
    }
    if (document.getElementById("spiderboprt") == undefined) {
        var Scope = document.getElementById("control_frame");
        Scope.style.right = "77px";
        var boprt = document.createElement("div");
        boprt.id = "spiderboprt";
        Scope.parentNode.insertBefore(boprt, Scope.nextSibling);
        document.getElementById("spiderboprt").innerHTML = "<a><em>下载</em></a>";
    }
    var i, j = document.getElementsByClassName("imgclasstag").length, preg = /(.*?)\.(jpg|png|jpeg|gif)/i, k = "";
    for (i = 0; j > i; i++) {
        var imgurl = document.getElementsByClassName("imgclasstag")[i].getAttribute("bigimgsrc").match(preg)[0];
        var ext = imgurl.match(/\.(jpg|png|jpeg|gif)/i)[0];
        k += '<li><img src="' + imgurl + '?imageView&thumbnail=350y350&enlarge=1&quality=90&type=jpg"><p>' + (i + 1) + '.<a href="' + imgurl + '" target="_blank">查看原图</a><a href="' + imgurl + '" download="' + document.title + " - " + document.location.pathname.substring(6) + "[" + (i + 1) + "]" + ext + '">下载原图</a></p></li>';
    }
    function Append(k) {
        var pElement = document.createElement("div");
        pElement.id = "lofterspider";
        document.body.appendChild(pElement);
        var LofterSpider = document.getElementById("lofterspider");
        LofterSpider.innerHTML = "<p>" + document.title + '</p><p id="spiderclose">X</p><ul>' + k + '</ul><p style="position:fixed;bottom:0;right:10px;color:#555;margin:0;height:24px"><i>请遵守作品协议</i></p>';
        document.getElementsByTagName("body")[0].style.overflow = "hidden";
    }
    function Close() {
        var LofterSpider = document.getElementById("lofterspider");
        LofterSpider.parentNode.removeChild(LofterSpider);
        document.getElementsByTagName("body")[0].style.overflow = "";
    }
    function Download(a) {
        var oldhtml = a.innerHTML;
        GM_xmlhttpRequest({
            method:"GET",
            url:a.href,
            responseType:"blob",
            overrideMimeType:"text/plain; charset=x-user-defined",
            onprogress:function(xhr) {
                if (xhr.lengthComputable) {
                    a.innerHTML = (xhr.loaded / xhr.total * 100).toFixed(2) + "%";
                }
            },
            onload:function(xhr) {
                if (this.readyState == 4 && this.status == 200) {
                    var blob = this.response;
                    saveFile(blob, a.download);
                    a.innerHTML = oldhtml;
                    a.isDownload = false;
                }
            }
        });
    }
    function saveFile(blob, filename) {
        if (window.navigator.msSaveBlob) {
            window.navigator.msSaveBlob(blob, filename);
        } else {
            var a = document.createElement("a");
            var url = URL.createObjectURL(blob);
            a.href = url;
            a.download = filename;
            var evt = document.createEvent("MouseEvents");
            evt.initEvent("click", true, true);
            a.dispatchEvent(evt);
            URL.revokeObjectURL(url);
        }
    }
    function Lofter() {
        Append(k);
        var ars = document.querySelectorAll("a[href][download]");
        for (var l = 0; l < ars.length; l++) {
            var a = ars[l];
            a.addEventListener("click", function(e) {
                e.preventDefault();
                if (!this.isDownload) Download(this);
                this.isDownload = true;
                return false;
            }, true);
        }
        document.getElementById("spiderclose").onclick = function() {
            Close();
        };
    }
    document.getElementById("spiderboprt").onclick = function() {
        Lofter();
    };
    document.onkeydown = function(e) {
        e = e || event;
        if (document.getElementById("lofterspider") != undefined && e.keyCode == 27) {
            Close();
        }
    };
})();