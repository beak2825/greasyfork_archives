// ==UserScript==
// @name         Duolingo IME Auto-Toggler
// @namespace    mog86uk-duolingo-ime-auto-toggler
// @version      0.2
// @description  Automatically toggles between IME on and off states when doing the Japanese, Korean, and Chinese Duolingo courses (and their reverse trees).
// @author       mog86uk (a.k.a. testmoogle)
// @include      /^https?:\/\/www\.duolingo\.(com|cn)($|\/.*$)/
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/371886/Duolingo%20IME%20Auto-Toggler.user.js
// @updateURL https://update.greasyfork.org/scripts/371886/Duolingo%20IME%20Auto-Toggler.meta.js
// ==/UserScript==

/*
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!! This userscript is for FIREFOX only !!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

(function () {
    'use strict';
    var lastTitle;

    function addGlobalStyleId(css, id) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        style.id = id;
        head.appendChild(style);
    }

    addGlobalStyleId('', 'styleAutoIME');

    function main() {
	    var j4e, k4e, z4e, e4j, e4k, e4z;

	    // Japanese for English speakers
	    j4e =`
			textarea[placeholder="Type in Japanese"],
			input[placeholder="Type in Japanese"] {
				ime-mode: active;
			}
			textarea[placeholder="Type in English"],
			input[placeholder="Type in English"] {
				ime-mode: disabled;
			}`;

	    // Korean for English speakers
		k4e =`
			textarea[placeholder="Type in Korean"],
		    input[placeholder="Type in Korean"] {
		        ime-mode: active;
		    }
		    textarea[placeholder="Type in English"],
		    input[placeholder="Type in English"] {
		        ime-mode: disabled;
		    }`;

	    // Chinese for English speakers
	    z4e =`
	    	textarea[placeholder="Type in Chinese"],
	        input[placeholder="Type in Chinese"] {
	            ime-mode: active;
	        }
	        textarea[placeholder="Type in English"],
	        input[placeholder="Type in English"] {
	            ime-mode: inactive;
	        }`;

	    // English for Japanese speakers (a.k.a. "Japanese reverse tree")
	    e4j =`
	    	textarea[placeholder="日本語で入力してください"],
	        input[placeholder="日本語で入力してください"] {
	            ime-mode: active;
	        }
	        textarea[placeholder="英語で入力してください"],
	        input[placeholder="英語で入力してください"] {
	            ime-mode: disabled;
	        }`;

	    // English for Korean speakers (a.k.a. "Korean reverse tree")
	    e4k =`
	    	textarea[placeholder="한국어로 입력"],
	        input[placeholder="한국어로 입력"] {
	            ime-mode: active;
	        }
	        textarea[placeholder="영어로 입력"],
	        input[placeholder="영어로 입력"] {
	            ime-mode: disabled;
	        }`;

	    // English for Chinese speakers (a.k.a. "Chinese reverse tree")
	    e4z =`
	    	textarea[placeholder="使用中文键入"],
	        input[placeholder="使用中文键入"] {
	            ime-mode: active;
	        }
	        textarea[placeholder="使用英语键入"],
	        input[placeholder="使用英语键入"] {
	            ime-mode: inactive;
	        }`;

	    switch (document.title) {
	    	case "Duolingo | Learn Japanese for free":
	        	document.getElementById('styleAutoIME').innerHTML = j4e;
	            break;
	    	case "Duolingo | Learn Korean for free":
	        	document.getElementById('styleAutoIME').innerHTML = k4e;
	            break;
	    	case "Duolingo | Learn Chinese for free":
	        	document.getElementById('styleAutoIME').innerHTML = z4e;
	            break;
	    	case "Duolingo | 無料で英語を学ぼう":
	    		document.getElementById('styleAutoIME').innerHTML = e4j;
	            break;
	    	case "듀오링고 | 무료로 영어를 배우세요.":
	    		document.getElementById('styleAutoIME').innerHTML = e4k;
	            break;
	    	case "多邻国 | 免费学习英语":
	    		document.getElementById('styleAutoIME').innerHTML = e4z;
	            break;
	    }
	}

    function checkTitle() {
        if (lastTitle != document.title) {
            main();
            lastTitle = document.title;
        }
        setTimeout(checkTitle, 2000);
    }

    checkTitle();
})();
