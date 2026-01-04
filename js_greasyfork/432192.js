// ==UserScript==
// @name         AvitoTool 
// @version      0.0.3
// @description  Позволяет скрывать объявления на сайте avito.ru
// @author       pp
// @include      https://www.avito.ru/*
// @grant none
// @namespace https://greasyfork.org/users/814032
// @downloadURL https://update.greasyfork.org/scripts/432192/AvitoTool.user.js
// @updateURL https://update.greasyfork.org/scripts/432192/AvitoTool.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var AvitoTool = {
		verbose: false,
		name: 'AvitoTool',
		keyHash: 'avitotool:hidden:elements',
		getHiddenElements: function() {
			return JSON.parse(localStorage.getItem(AvitoTool.keyHash));
		},
		setHiddenElements: function(arr, id) {
			AvitoTool.log('added new hidden element: ' + id);
			return localStorage.setItem(AvitoTool.keyHash, JSON.stringify(arr));
		},
		addHiddenElement: function(id) {
			var hiddenElementsArr = this.getHiddenElements();
			if (hiddenElementsArr !== null && hiddenElementsArr.length > 0) {
				hiddenElementsArr.push(id);
			} else {
				hiddenElementsArr = [id];
			}
			this.setHiddenElements(hiddenElementsArr, id);
		},
		addHideButton: function() {
			document.querySelectorAll('div[class^="items-items"] > div[data-marker^="item"]').forEach(function (item, index) {
				var hideButton = '<div class="item-hide"><button type="button" class="hide-button-' + item.dataset.itemId + ' button-button-eBrUW button-button-CmK9a button-size-s-r9SeD button-default-_Uj_C" aria-busy="false"><span class="button-textBox-_SF60"><div class="button-button__text_wrapper-AHKCO"><span class="text-text-LurtD text-size-s-BxGpL">Скрыть объявление</span></div></span></button></div>';

				item.querySelector('div[class^="iva-item-actions"]').innerHTML += hideButton;
				document.querySelector('button.hide-button-' + item.dataset.itemId).addEventListener("click", function(e){
					var hiddenElementsArr = AvitoTool.getHiddenElements();
					if (hiddenElementsArr != null && !hiddenElementsArr.includes(item.dataset.itemId)) {
						AvitoTool.addHiddenElement(item.dataset.itemId);
					} else if (hiddenElementsArr == null) {
						AvitoTool.addHiddenElement(item.dataset.itemId);
					} else {
						AvitoTool.log('element id: ' + item.dataset.itemId + ' already added');
					}
					
					AvitoTool.hideByItemId(item.dataset.itemId);
					e.preventDefault();
				});
			});
		},
		hideByItemId: function(id) {
			var hideElem = document.querySelector('div[data-item-id="' + id + '"]');
			if (hideElem != null)
				hideElem.style.display = 'none';

		},
		hideElements: function() {
			var hiddenElementsArr = this.getHiddenElements();
			if (hiddenElementsArr != null) {
				hiddenElementsArr.forEach(function(itemId, index) {
					AvitoTool.hideByItemId(itemId);
				});
			}
		},
		loaded: function() {
			AvitoTool.log("loaded");
		},
		run: function() {
			document.onreadystatechange = function () {
				if (document.readyState == "complete") {
					AvitoTool.addHideButton();
					AvitoTool.loaded();
				}
			}

			AvitoTool.hideElements();
		},
		log: function(o) {
			if (AvitoTool.verbose) {
				console.log(AvitoTool.name + ' >> ' + o);
			}
		}
	};
  
	AvitoTool.run();

})();