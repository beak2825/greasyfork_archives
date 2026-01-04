// ==UserScript==
// @name         PIXIVLOG
// @namespace    http://tampermonkey.net/
// @version      0.01
// @author       Ericthe
// @include      https://www.pixiv.net/artworks/*
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @connect      *
// @description  无
// @downloadURL https://update.greasyfork.org/scripts/416084/PIXIVLOG.user.js
// @updateURL https://update.greasyfork.org/scripts/416084/PIXIVLOG.meta.js
// ==/UserScript==

$(document).ready(function(){
    $("#root").append("<div id='getUgoiraLink'>点击获取动图链接</div>");
    $("body").delegate("#getUgoiraLink","click", getUgoiraLink);
});

function getUgoiraLink(event) {
	event.preventDefault();
    var id = getId();
    var arr = $("a[href='/artworks/" + id + "']");
    var date = $(arr[0]).find("img").attr('src').match(/\/(\d*\/){6,}/)[0];
    var url = "https://i.pximg.net/img-zip-ugoira/img" + date + id + "_ugoira1920x1080.zip";
    $('#getUgoiraLink').after("<a href=" + url + "><font color='#00FFFF'>下载</font></a>");
}

function getId() {
	var id = document.URL.slice(31);
	return id;
}