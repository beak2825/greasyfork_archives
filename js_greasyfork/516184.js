// ==UserScript==
// @name         catbox.moe paste
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  follow /denali999 on twitch!
// @author       (osu! denali) (twitch /denali999)
// @match        https://catbox.moe/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=catbox.moe
// @grant        none
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/516184/catboxmoe%20paste.user.js
// @updateURL https://update.greasyfork.org/scripts/516184/catboxmoe%20paste.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var dz;
    Dropzone.options.dropzoneUpload.init = function() {
		this.on("success", function(file, responseText) {

			var para = document.createElement("div");
			var textHolder = document.createElement("span");
			var t = document.createTextNode(responseText);
			para.appendChild(textHolder);
			textHolder.appendChild(t);
			para.className = "responseText";
			textHolder.className = "textHolder";

			file.previewTemplate.appendChild(para);
			file.previewTemplate.style.borderColor = "#23B748";
			file.previewTemplate.childNodes[3].childNodes[0].style.backgroundColor = "#23B748";

			$(file.previewTemplate).find("span.textHolder").on('click', function(event) {


				if (event.which === 2 && !$(this).hasClass('disabled')) {

					window.open($(this).text(),'_blank');
					$(this).removeClass('disabled');
					return;

				} else if (event.which === 1 && !$(this).hasClass('disabled')) {

					var selection = window.getSelection();
					var range = document.createRange();
					range.selectNodeContents(textHolder);
					selection.removeAllRanges();
					selection.addRange(range);

					document.execCommand('copy');

					var oldtext = $(this).text();
					$(this).text("Copied!");

					$(this).fadeTo("slow", 0, function() {
						$(this).text(oldtext);
						$(this).fadeTo(0, 1);
						$(this).removeClass('disabled');
					});
				}

				$(this).addClass('disabled');

			});

		});

		this.on("error", function(file, responseText) {
			file.previewTemplate.childNodes[3].childNodes[0].style.backgroundColor = "#FF5C5C";
		});

        dz = this;
	};
    addEventListener("paste", (event) => {
        const items = (event.clipboardData || event.originalEvent.clipboardData).items;
        if (items.length == 1) {
            var item = items[0]
            if (item.kind === 'file') {
                // adds the file to your dropzone instance
                dz.addFile(item.getAsFile())
            }
        }
    })
})();