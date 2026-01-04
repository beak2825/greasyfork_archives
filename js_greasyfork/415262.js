// ==UserScript==
// @name DuckDuckGo | Apple Search
// @namespace @Gelo02_
// @version 1.2.1
// @description UserScript that revamps DuckDuckGo to make it look more Apple-ish
// @author Gerard López López
// @grant GM_addStyle
// @run-at document-start
// @include http://duckduckgo.com/*
// @include https://duckduckgo.com/*
// @include http://*.duckduckgo.com/*
// @include https://*.duckduckgo.com/*
// @downloadURL https://update.greasyfork.org/scripts/415262/DuckDuckGo%20%7C%20Apple%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/415262/DuckDuckGo%20%7C%20Apple%20Search.meta.js
// ==/UserScript==


window.addEventListener('load', function() {
    var favicon = document.querySelector('link[rel~="icon"]');
    var clone = favicon.cloneNode(!0);
    clone.href = "https://i.ibb.co/8mCYmyW/Apple-Search-Favicon.png";
    favicon.parentNode.removeChild(favicon);
    document.head.appendChild(clone);
}, false);


//Page Title
var newtitle = document.title;
newtitle = newtitle.replace('at DuckDuckGo','');
document.title = newtitle;

var newtitle = document.title;
newtitle = newtitle.replace('DuckDuckGo — Privacy, simplified.','Apple Search');
document.title = newtitle;

var newtitle = document.title;
newtitle = newtitle.replace('DuckDuckGo','Apple Search');
document.title = newtitle;



//Black Logo: https://i.ibb.co/SPNSDf9/Apple-Search-Black.png
//Grey Logo: https://i.ibb.co/JCPpzpH/Apple-Search-Gray.png


(function() {
let css = `
	.header__logo {
		background-image: url('https://i.ibb.co/SPNSDf9/Apple-Search-Black.png') !important;
        background-size: 100px 23px;
        width: 100px;
        height: 23px;
	}
	#logo_homepage_link {
		background-image: url('https://i.ibb.co/SPNSDf9/Apple-Search-Black.png');
		object-fit: contain;
		height: 75px;
		width: 300px;
		margin: auto;
		margin-top: 28px;
	}
	.logo-wrap--home {
		display: grid;
		justify-content: center;
	}
	.logo-wrap--home::After {
		display: flex;
		content: "Apple Search";
		font-size: 36px;
		color: #de5833;
		margin: auto;
	}

	.tag-home__item {
		font-size: 0;
	}
	.tag-home__item::before {
		content: "Search, simplified";
		font-size: 18px;
	}
	.hide--screen-xs {
		font-size: 18px;
	}

	/* HEADER BUTTON */
	#wedonttrack {
		font-size: 0;
	}
	#wedonttrack::before {
		content: "Search, simplified";
		font-size: 15px;
	}

	/* SIDEBAR NAV */
	.nav-menu__list > ul:last-child:after {
		content: '*Search*';
		color: #de5833;
	}

	/*** FOOTER CARDS ***/
	.footer__card__icon[src="/assets/icons/hatched.svg"] ~ .footer__card__title {
		font-size: 0;
	}
	.footer__card__icon[src="/assets/icons/hatched.svg"] ~ .footer__card__title::before {
		content: "Learn About Apple Search";
		font-size: 15px;
	}

	.footer__card__icon[src="/assets/icons/private-searches.svg"] ~ .footer__card__title {
		font-size: 0;
	}
	.footer__card__icon[src="/assets/icons/private-searches.svg"] ~ .footer__card__title::before {
		content: "Fine-tune Your Search";
		font-size: 15px;
	}

	.footer__card__icon[src="/assets/icons/spread.svg"] ~ .footer__card__title {
		font-size: 0;
	}
	.footer__card__icon[src="/assets/icons/spread.svg"] ~ .footer__card__title::before {
		content: "Help Spread Apple Search";
		font-size: 15px;
	}

	.footer__card__icon[src="/assets/icons/mailbox.svg"] ~ .footer__card__title {
		font-size: 0;
	}
	.footer__card__icon[src="/assets/icons/mailbox.svg"] ~ .footer__card__title::before {
		content: "Search in Your Inbox";
		font-size: 15px;
	}

	.footer__card__icon[src="/assets/icons/milestone.svg"] ~ .footer__card__title {
		font-size: 0;
	}
	.footer__card__icon[src="/assets/icons/milestone.svg"] ~ .footer__card__title::before {
		content: "Say Goodbye To Trackers";
		font-size: 15px;
	}
	.footer__card__icon[src="/assets/icons/milestone.svg"] ~ .footer__text {
		font-size: 0;
	}
	.footer__card__icon[src="/assets/icons/milestone.svg"] ~ .footer__text::before {
		font-size: 13px;
		content: "Learn how you can free yourself from trackers for good.";
	}
	.search__button:hover, .search__button:focus, .search:hover .search__button:focus, .search--header.has-text.search--hover .search__button:hover, .search--header.has-text.search--focus .search__button:hover, .search--home.has-text .search__button:focus, .search--home.has-text .search__button:hover {
		background-color: #0270E4;
		color: white;
}
	.search:hover .search__button, .search__input:focus ~ .search__button, .search--header.has-text.search--hover .search__button, .search--header.has-text.search--focus .search__button, .search--home.has-text .search__button {
		background-color: #0270E4;
		color: white;
}
	.set-main .frm__section-label {
		color: #0270E4;
}
	a {
		font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}

	.modal--dropdown--settings .settings-dropdown--section .frm__field.is-checked .frm__switch .frm__switch__label.btn {
		background-color: #0270E4;
}
	.btn--primary, .is-checked .frm__switch__label {
		background-color: #0270E4;
		border-color: #0270E4;
}
    .wmd-button[id] > span {
        background-image: url("https://svgshare.com/i/9T3.svg") !important;
}

`;

if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();


//Replace DuckDuckGo! with Apple Search

(function () {
    'use strict';


    /*
        NOTE:
            You can use \\* to match actual asterisks instead of using it as a wildcard!
            The examples below show a wildcard in use and a regular asterisk replacement.
    */

    var words = {
    ///////////////////////////////////////////////////////


        // Syntax: 'Search word' : 'Replace word',
        // Burger Menu,
        'DuckDuckGo!' : 'Apple Search',
        'DuckDuckGo' : 'Apple Search',



    ///////////////////////////////////////////////////////
    '':''};
    //////////////////////////////////////////////////////////////////////////////
    // This is where the real code is
    // Don't edit below this
    //////////////////////////////////////////////////////////////////////////////

    var regexs = [], replacements = [],
        tagsWhitelist = ['PRE', 'BLOCKQUOTE', 'CODE', 'INPUT', 'BUTTON', 'TEXTAREA'],
        rIsRegexp = /^\/(.+)\/([gim]+)?$/,
        word, text, texts, i, userRegexp;

    // prepareRegex by JoeSimmons
    // used to take a string and ready it for use in new RegExp()
    function prepareRegex(string) {
        return string.replace(/([\[\]\^\&\$\.\(\)\?\/\\\+\{\}\|])/g, '\\$1');
    }

    // function to decide whether a parent tag will have its text replaced or not
    function isTagOk(tag) {
        return tagsWhitelist.indexOf(tag) === -1;
    }

    delete words['']; // so the user can add each entry ending with a comma,
                      // I put an extra empty key/value pair in the object.
                      // so we need to remove it before continuing

    // convert the 'words' JSON object to an Array
    for (word in words) {
        if ( typeof word === 'string' && words.hasOwnProperty(word) ) {
            userRegexp = word.match(rIsRegexp);

            // add the search/needle/query
            if (userRegexp) {
                regexs.push(
                    new RegExp(userRegexp[1], 'g')
                );
            } else {
                regexs.push(
                    new RegExp(prepareRegex(word).replace(/\\?\*/g, function (fullMatch) {
                        return fullMatch === '\\*' ? '*' : '[^ ]*';
                    }), 'g')
                );
            }

            // add the replacement
            replacements.push( words[word] );
        }
    }

    // do the replacement
    texts = document.evaluate('//body//text()[ normalize-space(.) != "" ]', document, null, 6, null);
    for (i = 0; text = texts.snapshotItem(i); i += 1) {
        if ( isTagOk(text.parentNode.tagName) ) {
            regexs.forEach(function (value, index) {
                text.data = text.data.replace( value, replacements[index] );
            });
        }
    }

}());