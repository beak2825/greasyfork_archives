// ==UserScript==
// @name         Bundle Key Lister
// @namespace    https://greasyfork.org/de/scripts/394604-bundle-key-lister
// @version      0.3
// @description  Show a list of the steam keys
// @author       Guitar Hero
// @grant        none
// @match        https://www.humblebundle.com/downloads*
// @downloadURL https://update.greasyfork.org/scripts/394604/Bundle%20Key%20Lister.user.js
// @updateURL https://update.greasyfork.org/scripts/394604/Bundle%20Key%20Lister.meta.js
// ==/UserScript==

(function() {
    'use strict';

	function insertBefore(el, referenceNode) {
		referenceNode.parentNode.insertBefore(el, referenceNode);
	}

	function getKeyList() {
		var keyList = '';
		document.querySelectorAll('.key-redeemer').forEach(function(item){
			keyList += "<br>" + item.querySelector('.heading-text').innerText.trim() + ": ";
            var keyField = item.querySelector('.keyfield.redeemed .keyfield-value');
            if (keyField == null || keyField.innerText == null) {
				keyList += "N/A";
                return;
			}
			keyList += keyField.innerText.trim();
		});
		return keyList;
	}

	function generateBox() {
		var keyBox = document.querySelector(".key-container").parentElement;

		var captionBox = document.createElement("div");
		captionBox.setAttribute("class", "wrapper");
		captionBox.innerHTML = "<h3 style='font-size:2em; font-weight:bold; text-transform:uppercase;'>Steam Key Summary</h3>";

		var keyListBox = document.createElement("div");
		keyListBox.setAttribute("class", "wrapper");
		keyListBox.innerHTML = "LOADING...";
		keyListBox.setAttribute("id", "key-list-box");
		keyListBox.setAttribute("style", "font-weight:bold;");

        var buttonBox = document.createElement("div");
		buttonBox.setAttribute("class", "wrapper");
        buttonBox.setAttribute("style", "margin-top:50px; text-align: center;");
		buttonBox.innerHTML = "<button class='bundleKeyListerButtonRevealAll' style='font-size:1.5em; font-weight:bold; padding: 10px 40px;'>Reveal ALL keys!<br/>(Warning: Use at your own risk)</button>";

		var outerBox = document.createElement("div");
		outerBox.setAttribute("class", "whitebox-redux small");
        outerBox.insertAdjacentElement("afterbegin", buttonBox);
		outerBox.insertAdjacentElement("afterbegin", keyListBox);
		outerBox.insertAdjacentElement("afterbegin", captionBox);

		insertBefore(outerBox, keyBox);
	}

	function setKeyListToBox() {
		console.log("KEY BOX length? "+(document.querySelectorAll('.key-redeemer').length));
		if (document.querySelectorAll('.key-redeemer').length == 0) {
			setTimeout(setKeyListToBox, 2000);
			return;
		}
		document.querySelector("#key-list-box").innerHTML = getKeyList();
	}

    function addRevealButtonListener() {
        document.querySelector(".bundleKeyListerButtonRevealAll").addEventListener('click', ()=> {
            console.log("Clicked: reveal ALL keys!");
            if (!confirm("Are you sure you want to reveal ALL keys?")) {
                return;
            }
            document.querySelectorAll('.key-container .keyfield:not(.redeemed) .keyfield-value').forEach(keyButton => {
                console.log(keyButton);
                keyButton.click();
            });
            document.querySelector("#key-list-box").innerHTML = "LOADING...";
            setTimeout(setKeyListToBox, 5000);
        });
    }

	generateBox();
	setKeyListToBox();
    addRevealButtonListener();

})();
