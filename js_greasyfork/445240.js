// ==UserScript==
// @name         Jojos EpikChat spam filter
// @namespace    https://greasyfork.org/users/393739-jojoooooo
// @version      0.2
// @description  EpikChat spam filter
// @author       Jojoooooo
// @match        https://www.epikchat.com/chat
// @icon         https://www.google.com/s2/favicons?sz=64&domain=epikchat.com
// @grant        GM.setValue
// @grant        GM.getValue
// @require      https://code.jquery.com/jquery-1.11.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445240/Jojos%20EpikChat%20spam%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/445240/Jojos%20EpikChat%20spam%20filter.meta.js
// ==/UserScript==
'use strict';

var blockedWords = [];
GM.getValue("jojo_epikchat_blockedWords", []).then(gmBlockedWords => {
	GM.getValue("jojo_epikchat_filterType", "censor").then(gmFilterType => {
		var filterType = "censor";
		if (gmFilterType) {
			filterType = gmFilterType;
		}

		for (const word of gmBlockedWords) {
			blockedWords.push(word);
		}

		function addBlockedWord(blockedWord) {
			if (!blockedWords.includes(blockedWord))
				blockedWords.push(blockedWord);
		}

		function removeBlockedWord(blockedWord) {
			blockedWords.splice(blockedWords.indexOf(blockedWord), 1);
		}

		/************ ADD SPAM FILTER OPTION TO SETTINGS ************/
		var settingsGroup = $('#chatSettings_modal * .list-group')[0];
		var settingsGroupItem = document.createElement("div");
		settingsGroupItem.className = "list-group-item m-a-0 settings-list";
		settingsGroupItem.dataset.section = "filter";

		var settingsIcon = document.createElement("i");
		settingsIcon.className = "fas fa-fw fa-filter";

		var settingsSpan = document.createElement("span");
		settingsSpan.className = "title";
		settingsSpan.textContent = "Spam filter";
		settingsSpan.style = "padding-left: 13px;";

		settingsGroupItem.appendChild(settingsIcon);
		settingsGroupItem.appendChild(settingsSpan);
		var hrElement = document.createElement("hr");
		settingsGroup.appendChild(hrElement);
		settingsGroup.appendChild(settingsGroupItem);

		var settingsModal = $('#chatSettings_modal > .modal-dialog')[0];
		var spamFilterContent = document.createElement("div");
		spamFilterContent.className = "modal-content filter collapse";
		spamFilterContent.style = "display: none;";
		spamFilterContent.innerHTML = `
<div class="modal-header" style="height:59px;">
	<h4 class="modal-title"><i class="fas fa-fw fa-arrow-left section-close" style="cursor:pointer; margin-right:6px;"></i>Spam filter</h4>
</div>
<div class="modal-body" style="min-height: 250px;">
	<span>
		<input class="form-control form-text" type="text" style="width: 75%;float: left;" id="filterWordInput"/>
		<button class="form-control form-button btn-primary" style="width: 20%;float: left;padding:  0;margin-top: 0;margin-bottom: 10px;margin-left: 5%;" id="addFilterWordButton">Add</button>
	</span>
	<select id="filteredWords" class="form-control" multiple style="width: 100%;">
	</select>
	<button id="removeFilterWordButton" class="form-control form-button btn-danger">Remove</button>
	<div class="setting">
		<div class="setting-title">Filter type</div>
		<ul class="list-group" style="margin-top:10px;margin-bottom: 0;">
			<li class="list-group-item">
				<div style="color: #cdcdcd;font-size: 15px;position: absolute;right: 9px;">
					<i class="fa fa-solid fa-asterisk"></i>
					<i class="fa fa-solid fa-asterisk"></i>
					<i class="fa fa-solid fa-asterisk"></i>
				</div>
				<div class="radio custom-control custom-radio m-a-0">
					<label>Censor (*****)<input type="radio" id="censorRadioButton" name="filterType"  value="censor"/>
						<span class="custom-control-indicator"></span></label>
				</div>
			</li>
			<li class="list-group-item">
				<div style="color: #cdcdcd;font-size: 15px;position: absolute;right: 9px;">
					<i class="fa fa-solid fa-eraser"></i>
				</div>
				<div class="radio custom-control custom-radio m-a-0">
					<label>Remove message<input type="radio" name="filterType" id="removeMessageRadioButton" value="removeMessage"/>
						<span class="custom-control-indicator"></span></label>
				</div>
			</li>
		</ul>
	</div>
</div>
<p class="p-a text-center text-muted small">Messages containing blocked words will not be shown in the chat.</p>
`;

		settingsModal.appendChild(spamFilterContent);

		if (filterType == "censor") {
			$("#censorRadioButton").prop("checked", true);
		} else if (filterType == "removeMessage") {
			$("#removeMessageRadioButton").prop("checked", true);
		}

		function changeFilterType(ft) {
			filterType = ft;
			GM.setValue("jojo_epikchat_filterType", filterType);
		}

		$('#censorRadioButton').change(function (val) {
			if (val.target.checked) {
				changeFilterType("censor");
			}
		});

		$('#removeMessageRadioButton').change(function (val) {
			if (val.target.checked) {
				changeFilterType("removeMessage");
			}
		});
		/************ END OF ADD SPAM FILTER OPTION TO SETTINGS ************/


		//Fill the list of blocked words in the settings menu
		function fillFilteredWordsSelect() {
			var filteredWordsSelect = $("#filteredWords")[0];

			while (filteredWordsSelect.firstChild) {
				filteredWordsSelect.removeChild(filteredWordsSelect.firstChild);
			}

			blockedWords.sort().forEach(f => {
				var option = document.createElement("option");
				option.text = f;
				option.value = f;
				filteredWordsSelect.appendChild(option);
			});
		}

		fillFilteredWordsSelect();

		//Add a blocked word to the list
		$('#addFilterWordButton').click(function () {
			var filterWord = $('#filterWordInput').val();
			if (filterWord.length > 0) {
				addBlockedWord(filterWord);
				GM.setValue("jojo_epikchat_blockedWords", blockedWords);
				fillFilteredWordsSelect();
				$('#filterWordInput').val('');
			}
		});

		//Remove a blocked word from the list
		$('#removeFilterWordButton').click(function () {
			var filteredWordsSelect = $("#filteredWords")[0];
			var selectedFilteredWords = filteredWordsSelect.selectedOptions;
			for (var i = 0; i < selectedFilteredWords.length; i++) {
				removeBlockedWord(selectedFilteredWords[i].value);
			}
			GM.setValue("blockedWords", blockedWords);
			fillFilteredWordsSelect();
		});

		var onListAdd = listAdd;
		//Override the list add function (created by Epikchat) to check for blocked words

		function decodeEntity(inputStr) {
			var textarea = document.createElement("textarea");
			textarea.innerHTML = inputStr;
			return textarea.value;
		}

		listAdd = function (type, listToAddTo, data) {
			var containsSpam = false;
			if (type === "messages") {
				blockedWords.forEach(blockedWord => {
					var decoded = decodeEntity(data.message);
					if (decoded.includes(blockedWord)) {
						containsSpam = true;
						if (filterType == "censor") {
							var replaceString = "";
							for (var i = 0; i < blockedWord.length; i++) {
								replaceString += "*";
							}
							data.message = decoded.replaceAll(blockedWord, replaceString);
						}
					}
				});
			}
			if (filterType !== "removeMessage" || !containsSpam) {
				onListAdd(type, listToAddTo, data);
			}
		}
	})
});