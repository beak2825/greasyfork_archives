// ==UserScript==
// @id             Depositfiles Helper
// @name           Depositfiles Download
// @namespace      http://userscripts.org/scripts/show/159211
// @version        0.1
// @history        0.1 Realese
// @include        http://depositfiles.com/*/files/*
// @include        http://depositfiles.com/files/*
// @include        http://dfiles.ru/*/files/*
// @include        http://dfiles.ru/files/*
// @Download http://userscripts.org/scripts/source/159211.user.js
// @require	http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js?ver=1.6.1
// @description Depositfiles Downloader 0.1
// @downloadURL https://update.greasyfork.org/scripts/2977/Depositfiles%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/2977/Depositfiles%20Download.meta.js
// ==/UserScript==
if (this.opera) {

	var autodownload = true;

} else {
	GM_registerMenuCommand("Remover o ---- configuração", function() {
		GM_deleteValue("auto")
	});
	if (GM_getValue('auto') == undefined) {
		if (confirm('Configuração inicial script\n para repor um item de menu nos comandos de script\n\nVocê quer usar o Depositfiles Helper')) {
			var autodownload = true;
			GM_setValue('auto', true);
		} else {
			var autodownload = false;
			GM_setValue('auto', false);
		}
	} else if (GM_getValue('auto') != undefined) {
		var autodownload = GM_getValue('auto')
	}
}
$(function() {
	var d = new FormData;
	d.append("gateway_result", 1);
	$("table.chousetype").before('<div id="wait" style="font-size:18px;color:green">\С\к\а\ч\и\в\а\н\и\е \с\к\о\р\о \н\а\ч\н\ё\т\с\я, \п\о\д\о\ж\д\и\т\е \п\о\ж\а\л\у\й\с\т\а...</div>');
	var a = location.href.split("/")[3],
		a = -1 != a.indexOf("files") ? "http://depositfiles.com/" + unsafeWindow.lang + "/" + a + "/" + location.href.split("/")[4] : location.href;
	GM_xmlhttpRequest({
		method: "POST",
		data: d,
		url: a,
		headers: {
			"User-Agent": "Mozilla/5.0 (Windows; U; Windows NT 5.1; ru; rv:1.8.1.20) DepositFiles/FileManager 0.9.9.206",
			Accept: "*/*"
		},
		onload: function(b) {
			if (4 == b.readyState) {
				var a = b.responseText,
					c = document.createElement("iframe");
				c.style.visibility = "hidden";
				c.style.width = "0";
				c.style.height = "0";
				document.documentElement.appendChild(c);
				b = c.contentDocument;
				document.documentElement.removeChild(c);
				b.documentElement.innerHTML = a;
				a = b.getElementsByClassName("repeat")[0];
				b = b.getElementsByClassName("ip")[0];
				if ("undefined" != typeof a) var d = a.getElementsByTagName("a")[0].getAttribute("href");
				$("#wait").remove();
				b ? $("table.chousetype").html(b.innerHTML) : ($("table.chousetype").html('<div style="background:lightblue;text-align:center;height:30px;"><a href="' + d + '" style="font-size: 20px;">Download</a></div>'), autodownload && (location.href = d))
			}
		}
	})
});