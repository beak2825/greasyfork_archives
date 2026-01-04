// ==UserScript==
// @name         [TDK] Arama Yardımcısı
// @namespace    https://github.com/nhtctn
// @version      1.8
// @description  TDK'nın sözlük sitesinde URL'den arama yapmaya olanak sağlar (URL örneği: http://sozluk.gov.tr/?ara=KAİDE), tarayıcı geçmişinde aranan kelimeler için kayıt oluşturur ve site anasayfasında eski aramaları gösterir.
// @author       nht.ctn & Magnum357
// @match        *://sozluk.gov.tr/*
// @match        *://www.sozluk.gov.tr/*
// @icon         data:image/png;base64,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

// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @run-at       document-idle

// @require	 https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
/* global $ */
/*jshint esversion: 6 */
// @downloadURL https://update.greasyfork.org/scripts/384593/%5BTDK%5D%20Arama%20Yard%C4%B1mc%C4%B1s%C4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/384593/%5BTDK%5D%20Arama%20Yard%C4%B1mc%C4%B1s%C4%B1.meta.js
// ==/UserScript==
(function() {
	'use strict';

	/*
	 ** [ ESSENTIALS ]
	 */

	var urlParams = new URLSearchParams(window.location.search);
	var word = urlParams.get('ara') || urlParams.get('q');
	var dict = urlParams.get('dic');
	var inputEl = document.querySelector('#tdk-srch-input');
	var formEl = document.querySelector('#tdk-srch-form');
	var buttonEl = document.querySelector('#tdk-search-btn');
	var suggestionPanelEl = document.querySelector('.autocmp');
	if (GM_getValue("pastArray") == null) GM_setValue("pastArray", []);
	var enter = `
`;

  // Notify users
  versionNotifier();

  // Storage update
	storageUpt();

	// Show the result by a query when the page opened
	if (word != undefined) {
    setTimeout(function() {showResult(word, dict);}, 200); // Wait for official search param run. Otherwise it loops endlessly.
		setWord(word, dict);
	}

	// Select the first suggestion on the enter press
	inputEl.addEventListener('keypress', goToFirstSuggestion);

	// Refresh query
	formEl.onsubmit = realTimeSearch;

	function showResult(s_word, s_dict) {
		// If specified, select dictionary to search
		if (s_dict) {
			var dictList = $('#dictList1, #dictList2').find('input[type="checkbox"]').map(function(i, item) {
				return $(item).attr("id");
			}).get();
			var checks = s_dict.split(" ");
			for (let x = 0; x < dictList.length; x++) {
				var d = dictList[x];
				if (checks.includes(d)) {
					$('#' + d).prop('checked', true);
				} else {
					$('#' + d).prop('checked', false);
				}
			}
		}

		inputEl.value = s_word;
		buttonEl.click();
	}

	function setWord(s_word, s_dict) {
		// Browser History
		if (history.pushState) {
			// Refresh the query and write it history
			var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?ara=' + s_word + (s_dict ? '&dic=' + s_dict.replace(/ /g, "+") : '');
			window.history.pushState({}, '', newurl);
		}

		// Script History (maximum 1000 entry)
		var pastArray = GM_getValue("pastArray");
		if (pastArray.length == 0 || s_word != pastArray[pastArray.length - 1].word || s_dict != pastArray[pastArray.length - 1].dict) {
			let item = {
				word: s_word,
				time: new Date().getTime(),
				dict: s_dict
			};
			pastArray[pastArray.length] = item;
		} else {
			pastArray[pastArray.length - 1].time = new Date().getTime(); // If the word searched for second time, just update the time.
		}
		var cleaner = (pastArray.length > 1000) ? 1 : 0; // If the word number goes beyond 1000, it will delete one word for each new word. The number will remain 1000.
		GM_setValue("pastArray", pastArray.splice(cleaner, 1000));
	}

	function realTimeSearch() {
		var realWord = inputEl.value;
		var realDict = $('#dictList1, #dictList2').find('input[type="checkbox"]:checked').map(function(i, item) {
			return $(item).attr("id");
		}).get().toString().replace(/,/g, " ");
		if (realWord.length > 0 && realDict.length > 0) {
			realDict = (realDict == "gts") ? null : realDict;
			setWord(realWord, realDict);
			addPastToPage();
		}
	}

	function goToFirstSuggestion(e) {
		if (e.keyCode == 13) {
			var wordEl = suggestionPanelEl.querySelector('.selected');

			if (wordEl != undefined) {
				inputEl.value = wordEl.innerText;
			}
		}
	}

	/*
	 ** [ HIDING SIGN LANGUAGE ]
	 */

	var signLangContHTML = `
<div id="signs_648" class="card">
    <div class="card-header" id="headingThree">
        <h5 class="mb-0">
            <button class="btn collapsed" btn-link="" collapsed="" type="button" data-toggle="collapse" data-target="#isaret-gts0" aria-expanded="false" aria-controls="collapseThree">
                <strong style="padding:5px;font-size:15px">İşaret Dili</strong>
            </button>
        </h5>
    </div>
    <div id="isaret-gts0" class="collapse">
        <div id="isaretler-gts0" class="card-body">
        </div>
    </div>
</div>
`;

	var accordionHTML = `<div class="accordion accordion_648" id="accordionExample-gts1"> </div>`;

	waitForKeyElements('div#isaretBulunan', hideSignLang);

	function hideSignLang() {
    var signs = document.querySelector('div#isaretSoz');
    if (document.querySelector('.accordion_648') == null) {
      signs.parentElement.insertAdjacentHTML("afterend", accordionHTML);
    }
    signs.parentElement.style.display = "none";


		var oldSignHTML = document.querySelector('div#signs_648');
		if (oldSignHTML == null) {
		  document.querySelector('div.accordion_648').insertAdjacentHTML("beforeend", signLangContHTML);
		}

		var signContainer = document.querySelector('div#isaretler-gts0');

    if (document.querySelector('#isaretler-gts0 > .isaret-sar') == null) {
      signContainer.insertAdjacentElement("afterbegin", document.querySelector('.isaret-sar'));
    }
    if (document.querySelector('#isaretler-gts0 > #isaretSozluk') == null) {
      signContainer.insertAdjacentElement("afterbegin", document.querySelector('#isaretSozluk'));
    }
	}

	/*
	 ** [ PAST MODULE ]
	 */

	var pastContainerHTML = `
<div class="contain">
    <div id="past" style="padding: 0 5px;">
        <span class="thumbnail text-center" style="height: auto;">
            <h4 class="text-danger" style="color:red; font-weight:bolder; margin: 15px 0;">Geçmiş</h4>
            <ul class="pastUl">
            </ul>
            <div style="margin: 15px; text-align: left;">
                <button id="deletePast" class="btn" type="button"> <strong style="padding:5px;font-size:15px">Geçmişi Sil</strong> </button>
            </div>
        </span>
    </div>
</div>
`;

	// Sonradan eklenebilir:
	// <button class="btn" type="button"> <strong style="padding:5px;font-size:15px">Geçmiş Detayları</strong> </button>

	let styles = `
.pastUl {margin: 15px; list-style: none; overflow: auto;}
.wordElements, .wordElements:hover {color:#cd853f; font-size:18px; font-weight: 700; margin: 0 10px 5px 10px; display: inline-block;}
`;
	addStyle(styles);

	addPastToPage();
	document.querySelector('button#deletePast').onclick = function() {
		deleteWord("all");
	};
	waitForKeyElements('div#bulunmayan-gts.hata', function() {
		deleteWord("last");
	}, false);

	function addPastToPage() {
		// Container
		var pastContainer = document.querySelector('div#past > span > ul');
		if (pastContainer == null) {
			document.querySelector('div#kelime').parentElement.parentElement.parentElement.insertAdjacentHTML("afterbegin", pastContainerHTML);
		}

		// Words
		getPast();
	}

	function getPast() {
		var wordElements = '';
		var counter = 0;
		var pastArray = GM_getValue("pastArray");
		for (var x = pastArray.length - 1; x > -1 && counter < 40; x--) {
			if (wordElements.indexOf('?ara=' + pastArray[x].word + '"') <= 0) {
				wordElements += '<a href="http://sozluk.gov.tr/?ara=' + pastArray[x].word + (pastArray[x].dict != null ? '&dic=' + pastArray[x].dict.replace(/ /g, "+") : '') + '" class="wordElements" title="' + convertDate(pastArray[x].time) + '">' + pastArray[x].word + '</a>';
				counter++;
			}
		}
		document.querySelector('div#past > span > ul').innerHTML = wordElements;
	}

	function convertDate(milliseconds) {
		var months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
		var d = new Date(milliseconds);
		var newDate = d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear() + ' (' + d.getHours().toString().padStart(2, "0") + ':' + d.getMinutes().toString().padStart(2, "0") + ')';
		return newDate;
	}

	function deleteWord(type) {
		if (type == "all") {
			var c = confirm("Arama geçmişinizi silmek istediğinize emin misiniz?");
			if (c) {
				GM_setValue("pastArray", []);
				document.querySelector('div#past > span > ul').innerHTML = '';
			}
		} else if (type == "last") {
			var pastArray = GM_getValue("pastArray");
			pastArray.splice(pastArray.length - 1, 1);
			GM_setValue("pastArray", pastArray);
			document.querySelector('div#past > span > ul > a').remove();
		} else if (isNumber(type)) {
			// En mükemmel kod henüz yazılmamış olandır.
		}
	}

	function isNumber(val) {
		return (val >= 0 || val < 0);
	}

  function versionNotifier() {
    let message = null;

    if (GM_info.script.version == 1.8 && GM_getValue("scriptVer") != 1.8) {
      message = `TDK Arama Yardımcısı Betiği:${enter+enter}Betiğin 1.8 sürümü başarıyla yüklendi.${enter+enter}Bilgilendirme:${enter}TDK sözlük sitesi, yakın zamanda url ile kelime aramayı mümkün kılan bir özellik ekledi. Sitede arattığınız kelimenin yanındaki paylaş butonuna tıklayarak kelime url'sini bulabilirsiniz.${enter+enter}https://sozluk.gov.tr/?ara=kelime${enter+enter}Url ile kelime arama dışındaki özelliklere ihtiyacınız yoksa bu betiği artık kaldırabilirsiniz.${enter+enter}Arama geçmişi kutusu, tarayıcı geçmişinde kayıt, işaret dili gizleme, url ile farklı sözlük tiplerinde arama gibi özellikler için betiği kullanmaya devam edebilirsiniz. Betik, artık site varsayılanı ile aynı biçimi kullanacaktır.${enter+enter}https://sozluk.gov.tr/?ara=kaide`;
    }

    if (message) {
      console.log(message);
      alert(message);
    }
  }

	function storageUpt() {
		try {
			// İlk verisonlu sürüme (1.6) geçiş. Kelime ve zaman kütüphanelerini birleştirilip tek obje yap. ========
			if (GM_getValue("scriptVer") == null && GM_getValue("pastArray_word") != null) {
				var newPast = [];
				var oldPast_word = GM_getValue("pastArray_word");
				var oldPast_time = GM_getValue("pastArray_time");
				for (let x = 0; x < oldPast_word.length; x++) {
					newPast[x] = {
						word: oldPast_word[x],
						time: oldPast_time[x],
						dict: null
					};
				}
				GM_setValue("pastArray", newPast);
				GM_setValue("pastArray_word", null);
				GM_setValue("pastArray_time", null);
				GM_setValue("scriptVer", 1.6);
				alert("TDK Arama Yardımcısı Betiği:" + enter + enter + "Güncelleme işlemi tamamlandı. Bu yeni sürümde URL üzerinden TDK'nın diğer sözlüklerini de aramaya dahil edebilirsiniz. Derleme Sözlüğü, Atasözleri ve Deyimler Sözlüğü vs. Daha fazla ayrıntı için Greasyfork'taki eklenti görsellerine bakın.");
			}
      // Rutin sürüm bilgisi güncelleme
			else if (GM_info.script.version > (GM_getValue("scriptVer") || 0) ) {
				GM_setValue("scriptVer", GM_info.script.version);
			}
		} catch (err) {
			alert("TDK Arama Yardımcısı Betiği:" + enter + enter + "Güncelleme işlemi sırasında bir sorun oluştu." + enter + "Sürüm " + GM_getValue("scriptVer") + " => Sürüm " + GM_info.script.version + enter + enter + "Lütfen aşağıdaki hata mesajı ile birlikte uygulama yazarına haber verin." + enter + enter + err.message);
		}
	}

	function addStyle (style) {
		document.head.appendChild(document.createElement('style')).textContent = style;
	}

  function waitForKeyElements (
      selectorTxt,    /* Required: The jQuery selector string that specifies the desired element(s). */
      actionFunction, /* Required: The code to run when elements are found. It is passed a jNode to the matched element. */
      bWaitOnce,      /* Optional: If false, will continue to scan for new elements even after the first match is found. */
      iframeSelector  /* Optional: If set, identifies the iframe to search. */
  ) {
      var targetNodes, btargetsFound;

      if (typeof iframeSelector == "undefined")
          targetNodes = $(selectorTxt);
      else
          targetNodes = $(iframeSelector).contents().find(selectorTxt);

      if (targetNodes && targetNodes.length > 0) {
          btargetsFound = true;
          /*--- Found target node(s).  Go through each and act if they are new. */
          targetNodes.each(function() {
              var jThis        = $(this);
              var alreadyFound = jThis.data('alreadyFound') || false;

              if (!alreadyFound) {
                  //--- Call the payload function.
                  var cancelFound = actionFunction(jThis);
                  if (cancelFound)
                      btargetsFound = false;
                  else
                      jThis.data('alreadyFound', true);
              }
          });
      }
      else {
          btargetsFound = false;
      }

      //--- Get the timer-control variable for this selector.
      var controlObj  = waitForKeyElements.controlObj  ||  {};
      var controlKey  = selectorTxt.replace(/[^\w]/g, "_");
      var timeControl = controlObj[controlKey];

      //--- Now set or clear the timer as appropriate.
      if (btargetsFound && bWaitOnce && timeControl) {
          //--- The only condition where we need to clear the timer.
          clearInterval(timeControl);
          delete controlObj[controlKey];
      }
      else {
          //--- Set a timer, if needed.
          if (!timeControl) {
              timeControl = setInterval(function() {
                      waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector);
                  },
                  300
              );
              controlObj [controlKey] = timeControl;
          }
      }
      waitForKeyElements.controlObj = controlObj;
  }
})();