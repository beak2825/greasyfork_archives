// ==UserScript==
// @name           Font Substitution v3
// @description    Substitutes arbitrary fonts on webpages
// @author         Alan Davies
// @copyright      2015, Alan Davies
// @version        3.0.2
// @date           2015-08-26
// @namespace      FontSub3
// @include        *
// @grant          GM_addStyle
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/12007/Font%20Substitution%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/12007/Font%20Substitution%20v3.meta.js
// ==/UserScript==

var globalDebug = false;

if (globalDebug) console.log("Font substitution start");

var fontMap = new Map([
	[ "arial",			"Verdana" ],
	[ "helvetica",		"Verdana" ],
	[ "courier",		"Consolas" ],
	[ "courier new",	"Consolas" ]
]);

var weights = [ "normal" , "bold" ];
var styles = [ "normal" , "italic" ];

function Capitalize(string)
{
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function OverrideFontFaces()
{
	for (let fontSub of fontMap)
	{
		for (w = 0; w < weights.length; ++w)
		{
			let weight = weights[w];

			for (s = 0; s < styles.length; ++s)
			{
				let style = styles[s];
			
				let replacementFont = fontSub[1];
				if (weight != "normal")
					replacementFont = replacementFont + " " + Capitalize(weight);

				if (style != "normal")
					replacementFont = replacementFont + " " + Capitalize(style);

				let css =
					"@font-face {" +
						"font-family: \'" + fontSub[0] + "\'; " +
						"src: local(\'" + replacementFont + "\'); " +
						"font-weight: " + weight + "; " +
						"font-style: " + style + "; " +
					"}";

				if (globalDebug) console.log("Adding CSS: " + css);

				GM_addStyle(css);
			}
		}
	}
}

var done = false;

// create an observer instance
var observer = new MutationObserver(function(mutations) {
	if (globalDebug) console.log("Mutation event");
	
	// Add the font face overrides once we have a body element
	if (!done && (null != document.body))
	{
		observer.disconnect();
		OverrideFontFaces();
		done = true;
	}
});

observer.observe(document, { childList: true, attributes: false, characterData: false, subtree: true });
