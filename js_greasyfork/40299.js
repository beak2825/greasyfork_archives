// ==UserScript==
// @name          icourse Downloader
// @namespace
// @description   get urls of video courses and copy to clipboard
// @include       https://www.icourse163.org/learn/*
// @version       0.9.0
// @version 0.0.1.20180405103144
// @namespace https://greasyfork.org/users/38547
// @downloadURL https://update.greasyfork.org/scripts/40299/icourse%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/40299/icourse%20Downloader.meta.js
// ==/UserScript==
(function () {
    'use strict';
	create_button();
	function btn_onclick(){
		var img_addr = document.getElementsByTagName("source")[0].src;
		if (img_addr){
			var patt1 = /http.*(?=\?)/;
            var res = img_addr.match(patt1);
            var obj = document.getElementById("down_video_url");
            obj.value = res;
            obj.type ="";
            obj.select();
            document.execCommand('copy');
            obj.type = "hidden";
            alert('复制完成！');
		}
		else {
			alert("none!");
		}
	}

	function create_button(){
        var ul_tag = document.getElementsByClassName('f-cb')[2];
        var btn = document.createElement("div");
        var t = document.createTextNode("Download");
        btn.appendChild(t);
        btn.style="background-color: green; border: 2px solid green; border-radius: 2px; color: white; padding: 0px 15px; font-size: 14px; cursor: pointer; height: 21px; margin-left: 7px; margin-top: opx; line-height: 21px; font-weight: 500; display: inline-block;";
        btn.setAttribute('id','down_video_btn');
        btn.onclick = btn_onclick;
        ul_tag.appendChild(btn);
        //create input form
        var input1 = document.createElement("input");
        input1.id ="down_video_url";
        input1.value="";
        input1.type="hidden";
        ul_tag.appendChild(input1);
    }


  })();