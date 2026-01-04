// ==UserScript==
// @name         山东大学评教
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://bkjws.sdu.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411663/%E5%B1%B1%E4%B8%9C%E5%A4%A7%E5%AD%A6%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/411663/%E5%B1%B1%E4%B8%9C%E5%A4%A7%E5%AD%A6%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==
function hyx_fill_in(){
	var i;
	for(i = 0; i <= 20; i++){
		str_root = "input#zbda_";
		var str = str_root + i.toString();
		if(i == 19){
			$(str)[2].click();
		}
		else{
			$(str)[0].click();
		}
	}
	$("textarea#zbda_21").val("内容充实，主题明确，讲解生动，受益匪浅");
}

(function() {
	var hyx_button = "<div id = 'game_gauge' style = 'width: 50px; height: 50px; position: fixed; left: 65%; top: 0%; z-index: 9999; transform: rotateY(180deg);'><img src = 'http://localhost/Web/picture_web/arrow.jpg'></img></div>";
    var hyx_div = document.createElement("div");
    document.body.appendChild(hyx_div);
	hyx_div.innerHTML = hyx_button;
	$("div#game_gauge").click(function(){
		hyx_fill_in();
		$("a#tjButtonId").click();
		$("button.aui_state_highlight").click();
	});
})();

