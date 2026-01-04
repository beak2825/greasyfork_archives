// ==UserScript==
// @name         GoogleTranslate_paperHelper
// @version      2.8.0
// @description  ez way to C and V
// @author       NDM
// @include      https://translate.google.com*

// @grant        unsafeWindow
// @namespace https://greasyfork.org/users/180333
// @downloadURL https://update.greasyfork.org/scripts/40713/GoogleTranslate_paperHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/40713/GoogleTranslate_paperHelper.meta.js
// ==/UserScript==


(function () {

	classList = []
	classList["inputText"] = ['text-dummy', 'D5aOJc'];
	classList["outputText"] = ['tlid-translation', 'J0lOec'];
	classList["buttonArea"] = ['tlid-input-button-container', 'hgbeOc'];
	classList["textSource"] = ['tlid-source-text-input', 'er8xn'];
	function getElement(s = '') {
		r = document.getElementsByClassName(classList[s][0]);
		return r[0] ? r[0] : document.getElementsByClassName(classList[s][1])[0];
	}



	var buttonSite = getElement('buttonArea');
	var newButton1 = document.createElement("span");
	var newButton3 = document.createElement("span");
	var newButton4 = document.createElement("span");
	var s = ""
	newButton1.innerHTML = "排版";
	newButton1.style.borderStyle = "solid";
	newButton1.style.cursor = "pointer";
	newButton1.className = "mishka";
	newButton1.onclick = () => {

		source = getElement("textSource");
		//preprocessing
		source.value = source.value.replace(/\n/g, " ");
		source.value = source.value.replace(/\;/g, ";.");
		source.value = source.value.replace(/i\.e\./g, "i*e*");   // i.e.
		source.value = source.value.replace(" al.", " al");  // ... al. 


		//format
		source.value = source.value.replace(/\. /g, ".\n\n");
		source.value = source.value.replace(/\? /g, "?\n\n");
		source.value = source.value.replace(/\! /g, "!\n\n");
		source.value = source.value.replace(/i\*e\*/g, "i.e."); // i.e.
		source.value = source.value.replace(/  /g, " ");
		source.value = source.value.replace(/\n /g, "\n");
		source.value = source.value.replace(/\;\./g, ";");
		// s = source.value.split(".\n\n");
		source.value += "\n\n";

		s = "done"
	}

	newButton3.innerHTML = "比對(英+中)";
	newButton3.style.borderStyle = "solid";
	newButton3.style.cursor = "pointer";
	newButton3.className = "mishka";
	newButton3.onclick = () => {
		org = getElement('inputText');
		tran = getElement('outputText');
		orgText = org.innerHTML.split('\n')
		tranText = tran.innerText.split('\n')

		var r = true
		if (tranText.length >= orgText.length * 1.5)
			r = confirm("已產生比對結果，再執行會毀掉畫面，仍要執行?\n若要重新比對，先讓Goolge重新翻譯")
		if (r == false)
			return

		result = ''
		for (var i = 0; i <= tranText.length; i++) {
			if (orgText[i] == null)
				break

			if (orgText[i] != '')
				temp = '<span  style="color:blue;">' + orgText[i] + '</span>' + '<br>' + '<span>' + tranText[i] + '</span><br>'
			else
				temp = '<br>'
			result += temp
		}
		tran.innerHTML = result

	}
	newButton4.innerHTML = "比對(中+英)";
	newButton4.style.borderStyle = "solid";
	newButton4.style.cursor = "pointer";
	newButton4.className = "mishka";
	newButton4.onclick = () => {
		org = getElement('inputText');
		tran = getElement('outputText');
		orgText = org.innerHTML.split('\n')
		tranText = tran.innerText.split('\n')

		var r = true
		if (tranText.length >= orgText.length * 1.5)
			r = confirm("已產生比對結果，再執行會毀掉畫面，仍要執行?\n若要重新比對，先讓Goolge重新翻譯")
		if (r == false)
			return

		result = ''
		for (var i = 0; i <= tranText.length; i++) {
			if (orgText[i] == null)
				break

			if (orgText[i] != '')
				temp = '<span>' + tranText[i] + '</span>' + '<br>' + '<span style="color:blue;font-size:10pt">&nbsp;&nbsp;&nbsp;&nbsp;' + orgText[i] + '</span><br>'
			else
				temp = '<br>'
			result += temp
		}
		tran.innerHTML = result

	}

	buttonSite.appendChild(newButton1);
	buttonSite.appendChild(newButton3);
	buttonSite.appendChild(newButton4);



	var cssId = 'mishka';  // you could encode the css path itself to generate id..
	if (!document.getElementById(cssId)) {
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.id = cssId;
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.href = 'https://raw.githack.com/aniki0220/Paper-Translate-Format-Helper-in-Google-Translator/master/style.css';
		link.media = 'all';
		head.appendChild(link);
	}

})();
