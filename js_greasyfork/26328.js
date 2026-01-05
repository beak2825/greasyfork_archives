// ==UserScript==
// @name           E-Hentai Flags on Gallery Thumbnails
// @description    Adds some fancy-ass flag icons above gallery thumbnails.
// @include        http://e-hentai.org/*
// @include        https://e-hentai.org/*
// @include        http://g.e-hentai.org/*
// @include        https://g.e-hentai.org/*
// @include        http://exhentai.org/*
// @include        https://exhentai.org/*
// @run-at         document-end
// @version        0.1.2
// @locale         en
// @namespace      https://sleazyfork.org/en/users/2168-etc/flags
// @downloadURL https://update.greasyfork.org/scripts/26328/E-Hentai%20Flags%20on%20Gallery%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/26328/E-Hentai%20Flags%20on%20Gallery%20Thumbnails.meta.js
// ==/UserScript==

var LANGUAGES = [
	{ name: 'jp', regex: '' },
	{ name: 'en', regex: 'eng(?:lish)?' },
	{ name: 'ch', regex: 'chinese|中国翻訳' },
	{ name: 'nl', regex: 'dutch' },
	{ name: 'fr', regex: 'french' },
	{ name: 'ge', regex: 'german' },
	{ name: 'hu', regex: 'hungarian' },
	{ name: 'it', regex: 'italian' },
	{ name: 'ko', regex: [ 'korean', '[\\u1100-\\u11FF\\u3130-\\u318F\\uA960-\\uA97F\\uAC00-\\uD7AF\\uD7B0-\\uD7FF]' ] },
	{ name: 'pl', regex: 'polish' },
	{ name: 'pt', regex: 'portugu.se?(?:-br)?' },
	{ name: 'ru', regex: 'russian' },
	{ name: 'es', regex: 'spanish|espa.ol' },
	{ name: 'th', regex: 'thai[\\u0e00-\\u0e7f\\s]*' },
	{ name: 'vi', regex: 'vietnamese[a-z\\u00c0-\\u00ff\\u1ea0-\\u1eff\\s]*' },
];

//----- Regex -----

var LANGUAGES_REGEX = null;

var getLanguageRegex = function() {
	if (LANGUAGES_REGEX) return LANGUAGES_REGEX;
	var temp = [ ];
	LANGUAGES.forEach(language => {
		if (language.regex.constructor == String)
			temp.push('[{[(]' + language.regex + '[)\\]}]');
		else {
			var regexes = [ ];
			regexes.push('[{[(]' + language.regex[0] + '[)\\]}]');
			language.regex.slice(1).forEach(function(value) { regexes.push(value); });
			temp.push(regexes.join('|'));
		}
	});
	LANGUAGES_REGEX = new RegExp('(' + temp.join(')|(') + ')', 'i');
	return LANGUAGES_REGEX;
};

var matchLanguage = function(title) {
    var matches = title.match(getLanguageRegex());
    if (!matches) return 0;
    for (var i=2;i<matches.length;++i) {
        if (matches[i])
            return (i - 1);
    }
    return 0;
};

//----- DOM -----

var walk = function() {
    [].slice.call(document.querySelectorAll('.gl3t'), 0).forEach(target => {
        if (target.hasAttribute('processed')) return;
        target.setAttribute('processed', true);
        var language = matchLanguage(target.previousSibling.textContent);
        var flag = document.createElement('div');
        flag.className = 'eh-flag ' + LANGUAGES[language].name;
        target.appendChild(flag);
    });
};

//----- Init -----

var style = document.createElement('style');
style.innerHTML = `
.eh-flag {
    background: url(data:image/png;base64,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);
    width: 44px;
    height: 30px;
    position: absolute;
    top: 0;
    right: 0;
}

.eh-flag.jp { background-position: 0 0; }
.eh-flag.en { background-position: -44px 0; }
.eh-flag.ch { background-position: -88px 0; }
.eh-flag.nl { background-position: -132px 0; }
.eh-flag.fr { background-position: -176px 0; }
.eh-flag.ge { background-position: -220px 0; }
.eh-flag.hu { background-position: -264px 0; }
.eh-flag.it { background-position: -308px 0; }
.eh-flag.ko { background-position: -352px 0; }
.eh-flag.pl { background-position: -396px 0; }
.eh-flag.pt { background-position: -440px 0; }
.eh-flag.ru { background-position: -484px 0; }
.eh-flag.es { background-position: -528px 0; }
.eh-flag.th { background-position: -572px 0; }
.eh-flag.vi { background-position: -616px 0; }
.gl3t { position: relative; }
`;
document.head.appendChild(style);

var debouncer = null;
document.body.addEventListener('DOMNodeInserted', e => {
    if (debouncer !== null) clearTimeout(debouncer);
    debouncer = setTimeout(walk, 100);
});

walk();