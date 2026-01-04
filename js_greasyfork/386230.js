// ==UserScript==
// @name         StreamCloud Plus
// @namespace    https://openuserjs.org/scripts/katmai.mobil/StreamCloud_Plus
// @version      0.4
// @description  ByPass Coutdown and load a HTML5 player downloadable.
// @author       katmai
// @include      http://streamcloud.eu/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// @copyright    2019, katmai.mobil (https://openuserjs.org/users/katmai.mobil)
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/386230/StreamCloud%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/386230/StreamCloud%20Plus.meta.js
// ==/UserScript==

var $ = window.jQuery;

var op = "download2";
var id = $("input[name=id]").val();
var fname = $("input[name=fname]").val();
var referer = $("input[name=referer]").val();
var hash = $("input[name=hash]").val();
var imhuman = $("input[name=imhuman]").val();

GM.xmlHttpRequest({
    method: "POST",
    url: window.location.href,
    data: "op=" + op + "&usr_login=&id=" + id + "&fname=" + fname + "&referer=" + referer + "&hash=" + hash + "&imhuman=" + imhuman,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Referer": window.location.href
    },
    onload: function(response) {
        var url = response.responseText.split("file: \"")[1].split('"')[0];
        var codigo_video = "<div><video width='100%' height='100%' controls controlsList='nodownload'><source src='" + url + "' type='video/mp4'></video></div>";
        var info_link = "https://upload.wikimedia.org/wikipedia/commons/5/5a/Info_Simple_bw.svg";
        var codigo_info = '<p style="color:black;"><img src="'+ info_link +'" style="float:left;width:24px;height:24px;margin-right:5px;"/> Use RightButton on videoplayer for more options</p>'
        $("#login").html(codigo_video + "<br><br>" + codigo_info);
    }
});
