// ==UserScript==
// @name         	iSubtitles.org Auto-filter Languages
// @description		See subtitles of only the pre-selected language(s) on subtitles page on iSubtitles.org.
// @name:fr			Langues de filtrage automatique iSubtitles.org
// @name:de			iSubtitles.org Sprachen automatisch filtern
// @name:ru			iSubtitles.org Автофильтр Языки
// @name:es			iSubtitles.org Idiomas de filtro automático
// @description:fr	Voir les sous-titres de la ou des langues présélectionnées uniquement sur la page des sous-titres sur iSubtitles.org.
// @description:de	Siehe Untertitel nur der vorgewählten Sprache (n) auf der Seite mit den Untertiteln auf iSubtitles.org.
// @description:ru	Смотрите субтитры только на предварительно выбранных языках на странице субтитров на iSubtitles.org.
// @description:es	Vea los subtítulos de solo los idiomas preseleccionados en la página de subtítulos en iSubtitles.org.
// @namespace    	iamMG
// @license			MIT
// @version     	1.0
// @include        	/https?:\/\/isubtitles.org\/.+-subtitles/
// @author       	iamMG
// @run-at			document-end
// @grant        	none
// @copyright		2020, iamMG (https://openuserjs.org/users/iamMG)
// @downloadURL https://update.greasyfork.org/scripts/398284/iSubtitlesorg%20Auto-filter%20Languages.user.js
// @updateURL https://update.greasyfork.org/scripts/398284/iSubtitlesorg%20Auto-filter%20Languages.meta.js
// ==/UserScript==

(function() {
    'use strict';
	//Only these language strings are allowed:
	//albanian, arabic, armenian, azerbaijani, basque, belarusian, bengali, big-5-code, bosnian, brazillian-portuguese, bulgarian, burmese, cambodian-khmer,
	//catalan, chinese-bg-code, croatian, czech, danish, dutch, english, esperanto, estonian, farsi-persian, finnish, french, georgian, german, greek,
	//greenlandic, hebrew, hindi, hungarian, icelandic, indonesian, italian, japanese, kannada, korean, kurdish, latvian, lithuanian, macedonian, malay,
	//malayalam, manipuri, mongolian, nepali, norwegian, pashto, polish, portuguese, punjabi, rohingya, romanian, russian, serbian, sinhala, slovak,
	//slovenian, somali, spanish, sundanese, swahili, swedish, tagalog, tamil, telugu, thai, turkish, ukrainian, ukranian, urdu, vietnamese, yoruba.

	//Separate all required languages with hyphens. Example:
	//var langString = 'english-danish-spanish';
	var langString = 'english';
    if (!location.pathname.match(/\/.+\/.+-subtitles/)) location.replace(location.href.replace('-subtitles', `/${langString}-subtitles`));
})();