// ==UserScript==
// @name         ArrayTotems (outdated)
// @namespace    http://tampermonkey.net/
// @version      0
// @description  Create totem resourcepack from array
// @author       ericsson
// @match        https://spea.cc/totem/
// @icon         https://spea.cc/totem/icon.png
// @run-at       document-end
// @license      MIT
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/460532/ArrayTotems%20%28outdated%29.user.js
// @updateURL https://update.greasyfork.org/scripts/460532/ArrayTotems%20%28outdated%29.meta.js
// ==/UserScript==
(function () {
    // Whitelist
	'use strict';
    unsafeWindow.dl = function(){var e=parseFloat($("#versions").val());var t=$("#versions option:selected").text();var a;var n;console.log(e);switch(e){case 3:n="assets/minecraft/mcpatcher/cit/totem_of_undying";a="type=item\nitems=totem\ntexture=%NAME%.png\nnbt.display.Name=ipattern:%NAME%";break;case 3.1:n="assets/minecraft/mcpatcher/cit/totem_of_undying";a="type=item\nmatchItems=totem_of_undying\ntexture=%NAME%.png\nnbt.display.Name=ipattern:%NAME%";break;case 4:case 5:case 6:case 7:case 8:case 9:n="assets/minecraft/optifine/cit/totem_of_undying";a="type=item\nmatchItems=totem_of_undying\ntexture=%NAME%.png\nnbt.display.Name=ipattern:%NAME%";break}e=parseInt(e);console.log(e,n,a);var s=new JSZip;s.file("pack.mcmeta",JSON.stringify({pack:{pack_format:e,description:"§7Custom §cTotem of Undying§7 Pack"}}));s.file("pack.png",canvasImg.src.substr(canvasImg.src.indexOf(",")+1),{base64:true});var i=s.folder(n);$("tr").each((function(){var e=$(this).attr("id");console.log(e);if(e){try{var t=$(this).find(".inp").val().toLowerCase();i.file(t+".png",$(this).find("img").attr("src").split(",")[1],{base64:true});i.file(t+".properties",a.replace("%NAME%",t).replace("%NAME%",t))}catch(e){console.log(e)}}}));s.generateAsync({type:"blob"}).then((function(e){saveAs(e,"Totems-"+t.replace(" ","")+".zip")}))}

	var names; // ["ericsson_", "Shimochka", "Ilyaxin"]

	var whitelist_ = document.createElement("button");
	whitelist_.innerHTML = "MegaWhitelist";
	whitelist_.style = "top:0;right:0;position:absolute;z-index:99999;background-color: #596673;border: 2px solid #647382;color: white;padding: 16px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;margin: 4px 2px;transition-duration: 0.4s;cursor: pointer;";
	document.body.appendChild(whitelist_);
	whitelist_.onclick = function () {
		names = JSON.parse(prompt("Type array\ne.g. [\"ericsson_\", \"Shimochka\"]"));
		console.log(names);
		names.forEach((value, key, array) => {
			newrow();
			$("#username" + key).val(value);
			skinfromname(key)
		});
	};

    // Resubmit
    var resubmit_ = document.createElement("button");
	resubmit_.innerHTML = "Resubmit";
	resubmit_.style = "top:0;left:0;position:absolute;z-index:99999;background-color: #596673;border: 2px solid #647382;color: white;padding: 16px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;margin: 4px 2px;transition-duration: 0.4s;cursor: pointer;";
	document.body.appendChild(resubmit_);
	resubmit_.onclick = function () {
        $(document).ready(function() {
            $("td.fin:empty").each(function() {
                var id = $(this).parent().attr("id");
                skinfromname(id);
            });
        });
	};

    // Clean list
    var clearlist_ = document.createElement("button");
	clearlist_.innerHTML = "Clean";
	clearlist_.style = "top:64;left:0;position:absolute;z-index:99999;background-color: #596673;border: 2px solid #647382;color: white;padding: 16px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;margin: 4px 2px;transition-duration: 0.4s;cursor: pointer;";
	document.body.appendChild(clearlist_);
	clearlist_.onclick = function () {
        var arr = JSON.parse(getCookie("r2totem"));
        for (elem in arr) {
            if (arr[elem]) {
                removerow(elem);
            }
        }
        //setCookie("r2totem", "[]", 0);
        //location.reload()
	};
})();