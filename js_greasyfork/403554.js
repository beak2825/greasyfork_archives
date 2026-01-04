// ==UserScript==
// @name         Preview mode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://tilda.cc/page*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403554/Preview%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/403554/Preview%20mode.meta.js
// ==/UserScript==

(function() {
	'use strict';
	$(document).ready(function(){
		if ($("#allrecords").length && $("#allrecords").attr("data-tilda-mode") == "preview") {
			$("[data-record-type='131'] pre").each((i, item) => {
				var a = $(item).text()

				var libraries = "";
				var inlineScripts = "";

				while(1) {
					if (a.indexOf("<sc") != -1) {
						var start = a.indexOf("<script");
						var end = a.indexOf("</script>");
						// console.log(`script removing ${start}, ${end}`)
						var script = a.slice(start, end + 9);
						a = a.replace(script, "")

						if (script.indexOf("></script>") != -1) {
							libraries += script;
						} else {
							inlineScripts += script;
						}
						continue;
					};
					break;
				}



				$(item).append("<div class='scripts'><div class='libraries'></div><div class='inlineScripts'></div><div class='styles'></div></div>");
				$(item).find(".styles").html(a)
				$(item).find(".libraries").html(libraries);
				setTimeout(() => {
					$(item).find(".inlineScripts").html(inlineScripts);
				}, 1500)
				$(item).parents(".t-rec").css("display", "none")
			})
		}
	})
})();



