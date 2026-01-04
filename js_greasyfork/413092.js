// ==UserScript==
// @name YaConnect.TranslitEmail
// @description Script for Yandex.Connect to transliterate name and surname to mail address
// @author Antiokh
// @license MIT
// @version 1.1
// @include https://connect.yandex.ru/portal/admin*
// @require        https://code.jquery.com/jquery-3.2.1.min.js
// @namespace https://greasyfork.org/users/395037
// @downloadURL https://update.greasyfork.org/scripts/413092/YaConnectTranslitEmail.user.js
// @updateURL https://update.greasyfork.org/scripts/413092/YaConnectTranslitEmail.meta.js
// ==/UserScript==

// wrap the script in a closure (opera, ie)
// do not spoil the global scope
// The script can be transformed into a bookmarklet easily :)
(function(window, undefined ) {

	// normalized window
	var w;
	if (unsafeWindow != "undefined"){
		w = unsafeWindow
	} else {
		w = window;
	}

	// You can inject almost any javascript library here.
	// Just pass the w as the window reference,
        // e.g. jquery.min.js embedding:
	// (function(a,b){function ci(a) ... a.jQuery=a.$=d})(w);


	// do not run in frames
	if (w.self != w.top){
		return;
	}

	// additional url check.
	// Google Chrome do not treat @match as intended sometimes.
	if (/https:\/\/connect.yandex.ru\/portal\/admin/.test(w.location.href)){
		//Below is the userscript code itself


        function bindemail() {
            try {
                makeemail();
            } catch (err) {}
        }
			function transliterate(text, engToRus) {
					var rus = "\u0449   \u0448  \u0447  \u0446  \u044E  \u044F  \u0451  \u0436  \u044A  \u044B  \u044D  \u0430 \u0431 \u0432 \u0433 \u0434 \u0435 \u0437 \u0438 \u0439 \u043A \u043B \u043C \u043D \u043E \u043F \u0440 \u0441 \u0442 \u0443 \u0444 \u0445 \u044C".split(/ +/g);
					var eng = "shh sh ch ts yu ya yo zh '' y  e  a b v g d e z i j k l m n o p r s t u f kh '".split(/ +/g);
					var x;
					for(x = 0; x < rus.length; x++) {
						text = text.split(engToRus ? eng[x] : rus[x]).join(engToRus ? rus[x] : eng[x]);
						text = text.split(engToRus ? eng[x].toUpperCase() : rus[x].toUpperCase()).join(engToRus ? rus[x].toUpperCase() : eng[x].toUpperCase());
					}
					return text;
			}

			function makeemail() { $('div.user-nickname input').val((transliterate($('input[name="name[first][ru]"]').val()).charAt(0) + '.' + transliterate($('input[name="name[last][ru]"]').val())).toLowerCase().replace("'",""));
								 }

$(document).ready(function() {
    let timerId = setInterval(bindemail, 200);
});





	}
})(window);