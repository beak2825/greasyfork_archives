// ==UserScript==
// @name         huiyi8 音效下载
// @namespace    https://www.jianshu.com/u/15893823363f
// @version      1.0
// @description  点击素材页面名字旁边的下载按钮下载，自动保存为名字的音频格式
// @author       Zszen John
// @match        https://*.huiyi8.com/sc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378583/huiyi8%20%E9%9F%B3%E6%95%88%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/378583/huiyi8%20%E9%9F%B3%E6%95%88%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var audioLink = $("audio source");
    var mp3Url = audioLink.attr("src");
    var title = $(".workTitle");
    var mp3Name = title.text();
    //alert(mp3Name);
    var downloadBt = $(' <img src="https://image.flaticon.com/icons/svg/181/181523.svg"></img>');
    title.append(downloadBt);
    downloadBt.css({"width":30});
    downloadBt.click(()=>{
        //window.open(mp3Url);
        var exts = mp3Url.split(".");
        export_raw(mp3Name+"."+exts[exts.length-1], mp3Url);
    });
    // Your code here...

   	 function fake_click(obj) {
	    var ev = document.createEvent("MouseEvents");
	    ev.initMouseEvent(
	        "click", true, false, window, 0, 0, 0, 0, 0
	        , false, false, false, false, 0, null
	        );
	    obj.dispatchEvent(ev);
	}

	function export_raw(name, data) {
	    var urlObject = window.URL || window.webkitURL || window;

	    var export_blob = new Blob([data]);

	    var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
	    save_link.href = urlObject.createObjectURL(export_blob);
	    save_link.download = name;
	    fake_click(save_link);
	}
})();