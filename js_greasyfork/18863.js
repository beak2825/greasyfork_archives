// ==UserScript==
// @name        Torn City - BBCode to HTML
// @namespace   Xiphias[187717]
// @description Reformats those old BBCode profile signatures into the new format of HTML that RESPO uses.
// @include       http://www.torn.com/profiles.php*
// @include       http://torn.com/profiles.php*
// @include       https://www.torn.com/profiles.php*
// @include       https://torn.com/profiles.php*
// @include       http://www.torn.com/forums.php*
// @include       http://torn.com/forums.php*
// @include       https://www.torn.com/forums.php*
// @include       https://torn.com/forums.php*
// @include       http://www.torn.com/old_forums.php*
// @include       http://torn.com/old_forums.php*
// @include       https://www.torn.com/old_forums.php*
// @include       https://torn.com/old_forums.php*
// @version       1.0.0
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/18863/Torn%20City%20-%20BBCode%20to%20HTML.user.js
// @updateURL https://update.greasyfork.org/scripts/18863/Torn%20City%20-%20BBCode%20to%20HTML.meta.js
// ==/UserScript==
/**
 *  Bazaar modifications
 *  http://www.torn.com/bazaar.php#/p=bazaar&userID=449649
 *
 *  Faction modification also maybe
 */

var regURL = /\s*((?:https?|s?ftp):\/\/(?:(?:(?:(?:[a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(?:%[\da-f]{2})|[!\$&\'\(\)\*\+,;=]|:)*@)?(?:(?:(?:\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(?:\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(?:\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(?:\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(?:(?:(?:[a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(?:(?:[a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])(?:[a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*(?:[a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(?:(?:[a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(?:(?:[a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])(?:[a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*(?:[a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(?::\d*)?)(?:\/(?:(?:(?:[a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(?:%[\da-f]{2})|[!\$&\'\(\)\*\+,;=]|:|@)+(?:\/(?:(?:[a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(?:%[\da-f]{2})|[!\$&\'\(\)\*\+,;=]|:|@)*)*)?)?(?:\?(?:(?:(?:[a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(?:%[\da-f]{2})|[!\$&\'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(?:#(?:(?:(?:[a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(?:%[\da-f]{2})|[!\$&\'\(\)\*\+,;=]|:|@)|\/|\?)*)?)\s*/gi;

// JS function to convert BBCode and HTML code - http;//coursesweb.net/javascript/
var BBCodeHTML = function () {
	var me = this; // stores the object instance
	var token_match = /{[A-Z_]+[0-9]*}/ig;

	// regular expressions for the different bbcode tokens
	var tokens = {
		//'URL' : '\\s*((?:(?:[a-z][a-z\\d+\\-.]*:\\/{2}(?:(?:[a-z0-9\\-._~\\!$&\'*+,;=:@|]+|%[\\dA-F]{2})+|[0-9.]+|\\[[a-z0-9.]+:[a-z0-9.]+:[a-z0-9.:]+\\])(?::\\d*)?(?:\\/(?:[a-z0-9\\-._~\\!$&\'*+,;=:@|]+|%[\\dA-F]{2})*)*(?:\\?(?:[a-z0-9\\-._~\\!$&\'*+,;=:@\\/?|]+|%[\\dA-F]{2})*)?(?:#(?:[a-z0-9\\-._~\\!$&\'*+,;=:@\\/?|]+|%[\\dA-F]{2})*)?)|(?:www\\.(?:[a-z0-9\\-._~\\!$&\'*+,;=:@|]+|%[\\dA-F]{2})+(?::\\d*)?(?:\\/(?:[a-z0-9\\-._~\\!$&\'*+,;=:@|]+|%[\\dA-F]{2})*)*(?:\\?(?:[a-z0-9\\-._~\\!$&\'*+,;=:@\\/?|]+|%[\\dA-F]{2})*)?(?:#(?:[a-z0-9\\-._~\\!$&\'*+,;=:@\\/?|]+|%[\\dA-F]{2})*)?)))\\s*',
		//'URL' : '\\s*((?:https?|s?ftp):\\/\\/(((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&\'\\(\\)\\*\\+,;=]|:)*@)?(((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5]))|((([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.)+(([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.?)(:\\d*)?)(\\/((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&\'\\(\\)\\*\\+,;=]|:|@)+(\\/(([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&\'\\(\\)\\*\\+,;=]|:|@)*)*)?)?(\\?((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&\'\\(\\)\\*\\+,;=]|:|@)|[\\uE000-\\uF8FF]|\\/|\\?)*)?(#((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&\'\\(\\)\\*\\+,;=]|:|@)|\\/|\\?)*)?)\\s*', //http://stackoverflow.com/questions/2723140/validating-url-with-jquery-without-the-validate-plugin
		'URL' : '\\s*((?:https?|s?ftp):\\/\\/(?:(?:(?:(?:[a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(?:%[\\da-f]{2})|[!\\$&\'\\(\\)\\*\\+,;=]|:)*@)?(?:(?:(?:\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(?:\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(?:\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(?:\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5]))|(?:(?:(?:[a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(?:(?:[a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])(?:[a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*(?:[a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.)+(?:(?:[a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(?:(?:[a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])(?:[a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*(?:[a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.?)(?::\\d*)?)(?:\\/(?:(?:(?:[a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(?:%[\\da-f]{2})|[!\\$&\'\\(\\)\\*\\+,;=]|:|@)+(?:\\/(?:(?:[a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(?:%[\\da-f]{2})|[!\\$&\'\\(\\)\\*\\+,;=]|:|@)*)*)?)?(?:\\?(?:(?:(?:[a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(?:%[\\da-f]{2})|[!\\$&\'\\(\\)\\*\\+,;=]|:|@)|[\\uE000-\\uF8FF]|\\/|\\?)*)?(?:#(?:(?:(?:[a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(?:%[\\da-f]{2})|[!\\$&\'\\(\\)\\*\\+,;=]|:|@)|\\/|\\?)*)?)\\s*', //http://stackoverflow.com/questions/2723140/validating-url-with-jquery-without-the-validate-plugin
		'LINK' : '([a-z0-9\-\./]+[^"\' ]*)',
		'EMAIL' : '((?:[\\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*(?:[\\w\!\#$\%\'\*\+\-\/\=\?\^\`{\|\}\~]|&)+@(?:(?:(?:(?:(?:[a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(?:\\d{1,3}\.){3}\\d{1,3}(?:\:\\d{1,5})?))',
		'TEXT' : '(.*?)',
		'SIMPLETEXT' : '([a-zA-Z0-9-+.,_ ]+)',
		'INTTEXT' : '([a-zA-Z0-9-+,_. ]+)',
		'IDENTIFIER' : '([a-zA-Z0-9-_]+)',
		'COLOR' : '([a-zA-Z]+|#[0-9abcdefABCDEF]+)',
		'NUMBER' : '([0-9]+)',
		'FLASHLINKIFICATION' : '\\[flash=(\\d+)x(\\d+)]<a.*?href="((?:(?:[a-z][a-z\\d+\\-.]*:\\/{2}(?:(?:[a-z0-9\\-._~\\!$&\'*+,;=:@|]+|%[\\dA-F]{2})+|[0-9.]+|\\[[a-z0-9.]+:[a-z0-9.]+:[a-z0-9.:]+\\])(?::\\d*)?(?:\\/(?:[a-z0-9\\-._~\\!$&\'*+,;=:@|]+|%[\\dA-F]{2})*)*(?:\\?(?:[a-z0-9\\-._~\\!$&\'*+,;=:@\\/?|]+|%[\\dA-F]{2})*)?(?:#(?:[a-z0-9\\-._~\\!$&\'*+,;=:@\\/?|]+|%[\\dA-F]{2})*)?)|(?:www\\.(?:[a-z0-9\\-._~\\!$&\'*+,;=:@|]+|%[\\dA-F]{2})+(?::\\d*)?(?:\\/(?:[a-z0-9\\-._~\\!$&\'*+,;=:@|]+|%[\\dA-F]{2})*)*(?:\\?(?:[a-z0-9\\-._~\\!$&\'*+,;=:@\\/?|]+|%[\\dA-F]{2})*)?(?:#(?:[a-z0-9\\-._~\\!$&\'*+,;=:@\\/?|]+|%[\\dA-F]{2})*)?)))".*?>.*?</a>.*?\\[/flash\\]'
	};

	var bbcode_matches = []; // matches for bbcode to html

	var html_tpls = []; // html templates for html to bbcode

	var html_matches = []; // matches for html to bbcode

	var bbcode_tpls = []; // bbcode templates for bbcode to html

	/**
	 * Turns a bbcode into a regular rexpression by changing the tokens into
	 * their regex form
	 */
	var _getRegEx = function (str) {
		var matches = str.match(token_match);
		var nrmatches = matches.length;
		var i = 0;
		var replacement = '';

		if (nrmatches <= 0) {
			return new RegExp(preg_quote(str), 'g'); // no tokens so return the escaped string
		}

		for (; i < nrmatches; i += 1) {
			// Remove {, } and numbers from the token so it can match the
			// keys in tokens
			var token = matches[i].replace(/[{}0-9]/gi, '');

			if (tokens[token]) {
				// Escape everything before the token
				replacement += preg_quote(str.substr(0, str.indexOf(matches[i]))) + tokens[token];

				// Remove everything before the end of the token so it can be used
				// with the next token. Doing this so that parts can be escaped
				str = str.substr(str.indexOf(matches[i]) + matches[i].length);
			}
		}

		replacement += preg_quote(str); // add whatever is left to the string

		return new RegExp(replacement, 'gi');
	};

	/**
	 * Turns a bbcode template into the replacement form used in regular expressions
	 * by turning the tokens in $1, $2, etc.
	 */
	var _getTpls = function (str) {
		var matches = str.match(token_match);
		var nrmatches = matches.length;
		var i = 0;
		var replacement = '';
		var positions = {};
		var next_position = 0;

		if (nrmatches <= 0) {
			return str; // no tokens so return the string
		}

		for (; i < nrmatches; i += 1) {
			// Remove {, } and numbers from the token so it can match the
			// keys in tokens
			var token = matches[i].replace(/[{}0-9]/gi, '');
			var position;

			// figure out what $# to use ($1, $2)
			if (positions[matches[i]]) {
				position = positions[matches[i]]; // if the token already has a position then use that
			} else {
				// token doesn't have a position so increment the next position
				// and record this token's position
				next_position += 1;
				position = next_position;
				positions[matches[i]] = position;
			}

			if (tokens[token]) {
				replacement += str.substr(0, str.indexOf(matches[i])) + '$' + position;
				str = str.substr(str.indexOf(matches[i]) + matches[i].length);
			}
		}

		replacement += str;

		return replacement;
	};

	/**
	 * Adds a bbcode to the list
	 */
	me.addBBCode = function (bbcode_match, bbcode_tpl) {
		// add the regular expressions and templates for bbcode to html
		bbcode_matches.push(_getRegEx(bbcode_match));
		html_tpls.push(_getTpls(bbcode_tpl));

		// add the regular expressions and templates for html to bbcode
		html_matches.push(_getRegEx(bbcode_tpl));
		bbcode_tpls.push(_getTpls(bbcode_match));
	};

	/**
	 * Turns all of the added bbcodes into html
	 */
	me.bbcodeToHtml = function (str) {
		var nrbbcmatches = bbcode_matches.length;
		var i = 0;

		for (; i < nrbbcmatches; i += 1) {
			str = str.replace(bbcode_matches[i], html_tpls[i]);
		}

		return str;
	};

	/**
	 * Turns html into bbcode
	 */
	me.htmlToBBCode = function (str) {
		var nrhtmlmatches = html_matches.length;
		var i = 0;

		for (; i < nrhtmlmatches; i += 1) {
			str = str.replace(html_matches[i], bbcode_tpls[i]);
		}

		return str;
	}

	/**
	 * Quote regular expression characters plus an optional character
	 * taken from phpjs.org
	 */
	function preg_quote(str, delimiter) {
		return (str + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
	}

	// adds BBCodes and their HTML
	me.addBBCode('[b]{TEXT}[/b]', '<strong>{TEXT}</strong>');
	me.addBBCode('[i]{TEXT}[/i]', '<em>{TEXT}</em>');
	me.addBBCode('[u]{TEXT}[/u]', '<span style="text-decoration:underline;">{TEXT}</span>');
	me.addBBCode('[s]{TEXT}[/s]', '<span style="text-decoration:line-through;">{TEXT}</span>');
	me.addBBCode('[o]{TEXT}[/o]', '<span style="text-decoration:overline;">{TEXT}</span>');
	me.addBBCode('[url={URL}]{TEXT}[/url]', '<a href="{URL}" title="link" target="_blank">{TEXT}</a>');
	me.addBBCode('[url]{URL}[/url]', '<a href="{URL}" title="link" target="_blank">{URL}</a>');
	me.addBBCode('[url={LINK}]{TEXT}[/url]', '<a href="{LINK}" title="link" target="_blank">{TEXT}</a>');
	me.addBBCode('[url]{LINK}[/url]', '<a href="{LINK}" title="link" target="_blank">{LINK}</a>');
	me.addBBCode('[img={URL} width={NUMBER1} height={NUMBER2}]{TEXT}[/img]', '<img src="{URL}" width="{NUMBER1}" height="{NUMBER2}" alt="{TEXT}" />');
	me.addBBCode('[img]{URL}[/img]', '<img src="{URL}" alt="{URL}" />');
	me.addBBCode('[img={LINK} width={NUMBER1} height={NUMBER2}]{TEXT}[/img]', '<img src="{LINK}" width="{NUMBER1}" height="{NUMBER2}" alt="{TEXT}" />');
	me.addBBCode('[img]{LINK}[/img]', '<img src="{LINK}" alt="{LINK}" />');
	me.addBBCode('[imgurl={URL}]{TEXT}[/imgurl]', '<a href="{URL}">{TEXT}</a>');
	me.addBBCode('[color={COLOR}]{TEXT}[/color]', '<span style="color: {COLOR};">{TEXT}</span>');
	me.addBBCode('[colour={COLOR}]{TEXT}[/colour]', '<span style="color: {COLOR};">{TEXT}</span>');
	me.addBBCode('[size=1]{TEXT}[/size]', '<span style="font-size: 8px;">{TEXT}</span>');
	me.addBBCode('[size=2]{TEXT}[/size]', '<span style="font-size: 10px;">{TEXT}</span>');
	me.addBBCode('[size=3]{TEXT}[/size]', '<span style="font-size: 12px;">{TEXT}</span>');
	me.addBBCode('[size=4]{TEXT}[/size]', '<span style="font-size: 14px;">{TEXT}</span>');
	me.addBBCode('[size=5]{TEXT}[/size]', '<span style="font-size: 16px;">{TEXT}</span>');
	me.addBBCode('[size=6]{TEXT}[/size]', '<span style="font-size: 18px;">{TEXT}</span>');
	me.addBBCode('[size=7]{TEXT}[/size]', '<span style="font-size: 20px;">{TEXT}</span>');
	me.addBBCode('[size={NUMBER}]{TEXT}[/size]', '<!-- {NUMBER} --><span style="font-size: 20px;">{TEXT}</span>');
	me.addBBCode('[cen]{TEXT}[/cen]', '<div style="text-align: center;">{TEXT}</div>');
	me.addBBCode('[left]{TEXT}[/left]', '<div style="text-align: left;">{TEXT}</div>');
	me.addBBCode('[right]{TEXT}[/right]', '<div style="text-align: right;">{TEXT}</div>');
	me.addBBCode('[font={SIMPLETEXT}]{TEXT}[/font]', '<span style="font-family: {SIMPLETEXT};">{TEXT}</span>');
	me.addBBCode('[profile]{NUMBER}[/profile]', '<a href="http://www.torn.com/profiles.php?XID={NUMBER}" title="User [{NUMBER}]">[{NUMBER}]</a>');
	me.addBBCode('[faction]{NUMBER}[/faction]', '<a href="http://www.torn.com/factions.php?step=profile&ID={NUMBER}" title="Faction [{NUMBER}]">[{NUMBER}]</a>');
	me.addBBCode('[mail]{EMAIL}[/mail]', '<a href="mailto:{EMAIL}">{EMAIL}</a>');
	//me.addBBCode('[flash={NUMBER1}x{NUMBER2}]{TEXT}[/flash]', '<!-- Flash is currently not working with Torn. Height: {NUMBER1}, Width: {NUMBER2}, Url: {TEXT} -->'); // Flash is not working, placeholder html comment added for now.
	me.addBBCode('{FLASHLINKIFICATION}', '<embed height="{FLASHLINKIFICATION1}" width="{FLASHLINKIFICATION2}" wmode="transparent" allownetworking="internal" allowscriptaccess="never" type="application/x-shockwave-flash" src="{FLASHLINKIFICATION3}">');
	me.addBBCode('[flash={NUMBER1}x{NUMBER2}]"{TEXT}"[/flash]', '<div><embed height="{NUMBER1}" width="{NUMBER2}" wmode="transparent" allownetworking="internal" allowscriptaccess="never" type="application/x-shockwave-flash" src="{TEXT}"></div>');
	me.addBBCode('[flash={NUMBER1}x{NUMBER2}]{TEXT}[/flash]', '<div><embed height="{NUMBER1}" width="{NUMBER2}" wmode="transparent" allownetworking="internal" allowscriptaccess="never" type="application/x-shockwave-flash" src="{TEXT}"></div>');
	me.addBBCode('[highlight={COLOR}]{TEXT}[/highlight]', '<span style="background-color:{COLOR}">{TEXT}</span>');
	me.addBBCode('[quote="{TEXT1}"]{TEXT2}[/quote]', '<div class="quote"><cite>{TEXT1}</cite><p>{TEXT2}</p></div>');
	me.addBBCode('[quote]{TEXT}[/quote]', '<br/><cite style="display: inline; margin: 2px; padding: 2px;" >{TEXT}</cite><br/>');
	me.addBBCode('[code]{TEXT}[/code]', '<code style="background:#F8F8FF; border:black dashed 1px; padding:6px">{TEXT}</code>');
	me.addBBCode('[blockquote]{TEXT}[/blockquote]', '<blockquote>{TEXT}</blockquote>');
};

function cleanup(elem) {
	elem = elem.replace(/(seconds yet! You better stay and rest.)/gi, '$1<br/>');
	elem = elem.replace(/\.?\s*(Congratulations! You lost \d+\% of your drug addiction for \$[\d,]+\.)\s*/gi, ' $1 ');
	elem = elem.replace(/\.(You are in hospital for)/gi, '. $1');
	elem = elem.replace(/(\w)(You are in hospital for another)/gi, '$1. $2');
	elem = elem.replace(/\.(You will be in jail)/gi, '. $1');
	elem = elem.replace(/(So far this week, [\d,\.]+ tickets have been purchased, the pot is \$[\d,\.]+!)/gi, '<br/>$1<br/>');
	elem = elem.replace(/(You have bought \d+ tickets and have \d+ casino tokens left.)/gi, '<br/>$1<br/>');
	elem = elem.replace(/(You have \d+ casino tokens and a current streak of \$[\d,\.]+)/gi, '<br/>$1<br/>');
	elem = elem.replace(/(BANG! You watch)/gi, '<br/>$1');
	elem = elem.replace(/(You will be in jail for another .*? yet!)\s*/gi, '$1<br/>');
	elem = elem.replace(/((?:(?:\b[^\s\(\)]*?)|(?:[^\s\(\)]{1,15})) hit with (?:their|his|her).*?for \d+ damage)/gi, '<br/>$1<br/>');
	//elem = elem.replace(/(\b[^\s\(\)]*? hit with their.*?for \d+ damage)/gi, '<br/>$1');
	elem = elem.replace(/(You roll [\w\d\.\-_]*)[\*]+/gi, '$1****');
	elem = elem.replace(/(Operation.*?\(lvl \d+.\)\s*(?:\(age \d+.\))?\s*Done)/gi, '<br/>$1<br/>');
	elem = elem.replace(/(You have been awarded the \b.*?\b award!\s*)/gi, '$1<br/>');
	elem = elem.replace(/(\d{1,4}\/\d{1,2}\/\d{1,4}\s*The.*?award!)\s*/gi, '$1<br/>');
	elem = elem.replace(/([\-=_\*~\.]{14,})/g, '<br/>$1<br/>');
	elem = elem.replace(/(x{20,})/gi, '<br/>$1<br/>');
	elem = elem.replace(/(You have won the bet.*?and won \$(?:[\d,]+)!(?:\s*Your check will be held in the bank for up to 24 hours.)?)/g, '<br/>$1<br/>');
	elem = elem.replace(/(\[\/img\])(?:<br>)?/gi, '$1<br/>');
	elem = elem.replace(/(\[img\])(\[img\])+/gi, '[img]');
	elem = elem.replace(/(?:<br>)?(\[img.*?\])/gi, '<br/>$1');
	elem = elem.replace(/>(?:\brn\b)</gi, '><br/><');
	elem = elem.replace(/>\b(?:rn)+\b</gi, '><br/><br/><');
	elem = elem.replace(/\b(?:rn)+\b/gi, '<br/><br/>');
	elem = elem.replace(/(rn){2,}/gi, '<br/><br/>');
	elem = elem.replace(/\[View\]/g, '[View]<br/>');
	elem = elem.replace(/(You found.*?while walking around the city!)/gi, '<br/>$1<br/>');
	elem = elem.replace(/((?:\d+\.\s*)?Using your.*?damage(?:\s*\(\d+\))?)/g, '<br/>$1<br/>');
	elem = elem.replace(/\.?(You roll.*?over and then fish (?:her|his) wallet out from (?:her|his) back pocket)\.\s*(You count.*? home happy)\.?/gi, '<br/>$1. $2. <br/>');
	console.log(elem + " - " + !regURL.test(elem));
	if (elem.length < 500 && !elem.match(regURL)) {
		elem = elem.replace(/((?:(?:20)?\d{1,2}\/\d{1,2}\/\d{1,4}\s*\d{1,2}:\d{1,2}(?::\d{1,2})?\s*(?:AM|PM))|(?:(?:20)?\d{1,2}\/\d{1,2}\/\d{1,4})|(?:(?:(?:\d{1,2}:)?\d{1,2}:\d{1,2})\s*(?:AM|PM)))/gi, '<br/>$1');
		elem = elem.replace(/((?:(?:\d{1,2}\/\d{1,2}\/\d{1,2}\s*\d{1,2}:\d{1,2}(?::\d{1,2})?\s*(?:AM|PM))|(?:\d{1,2}\/\d{1,2}\/\d{1,2})|(?:(?:(?:\d{1,2}:)?\d{1,2}:\d{1,2})\s*(?:AM|PM)))?\s*You were sent)/gi, '<br/>$1');
	}
	return elem;
}

function IsJsonString(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}

function forumSignatures(html) {
	if (html.find('.post-container').length > 0) {
		var signatures = $('.post-container').find('.profile-sign'); // Find all signatures on the page

		var bbcodeParser = new BBCodeHTML();

		signatures.each(function () {
			var cleaned = cleanup($(this).html());
			var parsed = bbcodeParser.bbcodeToHtml(cleaned);
			var parsed = htmlUnescape(parsed);
			$(this).html(parsed);
		});
	}
}

function setAjaxListener() {
	var forum_url = 'forums.php?';
	var old_forum_url = 'old_forums.php';
	$('body').ajaxComplete(function (e, xhr, settings) {
		var url = settings.url;
		if (url.indexOf(forum_url) >= 0 && url.indexOf(old_forum_url) < 0) {

			var response = xhr.responseText;

			if (!IsJsonString(response)) {
				var html = $(response);
				forumSignatures(html);
			}
		}
	});

}

function createBlockquote(child, username, userid, content) {

	// Create elements
	var bq = document.createElement("blockquote");
	var p = document.createElement("p");
	var strong = document.createElement("strong");
	var a = document.createElement("a");
	var div_content = document.createElement("div");

	// Apply CSS
	bq.style.cssText = "border-right: 1px solid #ccc; border-bottom: 1px solid #ccc; border-top: 2px solid #ccc; border-left: 1px solid #ccc; margin-top: 5px; margin-bottom: 2px; margin-left: 3px; margin-right: 2px;";
	p.style.cssText = "margin-bottom: 0; margin-top: 0; padding-bottom: 5px; padding-top: 5px; padding-right: 6px;";
	a.style.cssText = "color: #069; text-decoration: none; padding-left: 6px;";
	div_content.style.cssText = "padding-left: 6px; padding-bottom: 5px; padding-top: 3px; padding-right: 6px;";

	// Populate elements
	a.href = "http://www.torn.com/profiles.php?XID=" + userid;
	a.textContent = username + " [" + userid + "]";
	div_content.textContent = content;

	// Combine elements
	strong.appendChild(a);
	p.appendChild(strong);
	bq.appendChild(p);
	bq.appendChild(div_content);

	if (child != null) {
		bq.appendChild(child);
		return bq;
	}

	return bq;
}

// does not work http://www.torn.com/old_forums.php?forumID=2&ID=15536508&factionID=0&companyID=0&worldwar=0&start=0
/**
 *  Fixes BBCode quotes to HTML blockquotes.
 *  Also works for nested quotes.
 *
 *  input: The string to manipulate.
 *  start_index: start of the substring we want to fix.
 *  end_index: end of the substring we want to fix.
 */

function fixquotes(input, start_index, end_index) {
	var original_input = input;
	var substr = input.substring(start_index, end_index);
	var q_start = substr.match(/\[quote\]\[i\]By/gi);
	var q_end = substr.match(/\[\/quote\]/gi);
	if (q_start == null || q_end == null) {
		return original_input;
	}

	var username = substr.match(/\[quote\]\[i\]By ([\S]*?) /i);
	var userid = substr.match(/\[quote\]\[i\]By [\S]*? \[(\d+)\]/i);
	var content = substr.match(/\[quote\]\[i\]By [\S]*? \[\d+\]\[\/i\](.*)\[\/quote\]/i);
	if (username == null || userid == null || content == null) {
		return original_input; // This means it did not work and we should return without changes.
	}
	var blockquote = createBlockquote(null, username[1], userid[1], content[1]);
	return original_input.replace(substr, blockquote.outerHTML);
}
/**
 *  Find each index of a substring in a string.
 */

function locations(substring, string, offset) {
	var a = [],
	i =  - 1;
	while ((i = string.indexOf(substring, i + 1)) >= 0)
		a.push(i + offset);
	return a;
}
/**
 *  Find all none overlapping quote ranges.
 */

function getQuoteRanges(starts, ends) {
	var startStack = [];
	var endStack = [];
	var foundRanges = [];

	var i = 0;
	var j = 0;
	while (i < starts.length) {

		if (starts[i] < ends[j]) {
			startStack.push(starts[i]);
			i++;
		} else {
			endStack.push(ends[j]);
			j++;
		}

		if (hasEqualHeight(startStack, endStack)) {
			foundRanges.push([startStack.pop(), endStack.pop()]);
		} else if (startStack.length >= endStack.length && endStack.length > 0) {
			foundRanges.push([startStack.pop(), endStack.pop()]);
		}
	}
	while (j < ends.length) {
		endStack.push(ends[j]);
		j++;

		if (hasEqualHeight(startStack, endStack)) {
			foundRanges.push([startStack.pop(), endStack.pop()]);
		} else if (startStack.length >= endStack.length && endStack.length > 0) {
			foundRanges.push([startStack.pop(), endStack.pop()]);
		}
	}
	return foundRanges;
}

function hasEqualHeight(s, e) {
	return s.length == e.length;
}


function fixAllQuotes(input) {
	var quotes_map = {};
	var qss = locations('[quote]', input, 0);
	var qes = locations('[/quote]', input, 8);
	var quote_ranges = getQuoteRanges(qss, qes);
	var quote_ranges_length = quote_ranges.length;
	for (var i = 0; i < quote_ranges_length; i++) {
		var qs = quote_ranges[0][0];
		var qe = quote_ranges[0][1];
		input = fixquotes(input, qs, qe);
		return htmlUnescape(fixAllQuotes(input));
	}
	return input;
}

// I needed the opposite function today, so adding here too:
function htmlUnescape(value) {
	return String(value)
	.replace(/&quot;/g, '"')
	.replace(/&#39;/g, "'")
	.replace(/&lt;/g, '<')
	.replace(/&gt;/g, '>')
	.replace(/&amp;/g, '&');
}

function old_forum_cleanup(elem) {
	elem = elem.replace(/([\-]{6,})/g, '<br/>$1<br/>');
	elem = elem.replace(/([=]{6,})/g, '<br/>$1<br/>');
	elem = elem.replace(/([_]{6,})/g, '<br/>$1<br/>');
	elem = elem.replace(/([\*]{6,})/g, '<br/>$1<br/>');
	elem = elem.replace(/([~]{6,})/g, '<br/>$1<br/>');
	elem = elem.replace(/([\.]{6,})/g, '<br/>$1<br/>');
	elem = elem.replace(/\/images\/items\/(\d+).jpg/gi, "/images/items/$1/large.jpg");
	elem = elem.replace(/\/images\/items\/(\d+)s.jpg/gi, "/images/items/$1/small.jpg");
	elem = elem.replace(/\/images\/items\/(\d+)m.jpg/gi, "/images/items/$1/medium.jpg");
    elem = elem.replace(/((?:Manual labor|MAN):\s*\d+(?:[\.,]\d+)?)((?:Intelligence|INT):\s*\d+(?:[\.,]\d+)?)((?:Endurance|END):\s*\d+(?:[\.,]\d+)?)/gi, "<br/>$1<br/>$2<br/>$3<br/>");
	return elem;
}

function oldForumFix(bbcodeParser) {

	// The setup of the old forums is not so easy to traverse through and find what you want.
	// What I have observed is that the content of a post is placed every 3 rows.
	var rowsWithPostContent;

	var rowsWithPostContent = $('.content-wrapper').find('table[width="100%"] tr:nth-child(3n) > td');
	if (rowsWithPostContent[0] !== undefined && rowsWithPostContent[0] != null && rowsWithPostContent[0].getAttribute("valign") != null) { // We are on page 2+
		rowsWithPostContent = $('.content-wrapper').find('table[width="100%"] tr:nth-child(3n+4) > td');
	} else {
		// We are on the first page;
	}

	if (rowsWithPostContent.length > 0) {
		rowsWithPostContent.each(function () {
			var quotesFixed = htmlUnescape(fixAllQuotes(this.innerHTML));
			var cleaned = old_forum_cleanup(quotesFixed);
			var parsed = bbcodeParser.bbcodeToHtml(cleaned);
			$(this).html(parsed);
		});
	}
}

function runScript() {
	var bbcodeParser = new BBCodeHTML(); // creates object instance of BBCodeHTML()
    
	var url = window.location.href;
	console.log(url);
	if (url.indexOf("profiles.php") >= 0) {
		console.log("profiles");
		var profilesignature = $('.profile-container.profile-signature');

		if (profilesignature.length > 0) {

			profilesignature.css("word-wrap", "break-word");
            console.log(profilesignature);
			// Profile page only
			profilesignature.each(function () {
                //
                var test = $(this).html().replace(/\n/g, "<br>"); // Replace newline chars with BR
                test = test.replace(/\t/g, "&#9;");
				//var cleaned = cleanup(test);
				var parsed = bbcodeParser.bbcodeToHtml(test);
				$(this).html(parsed);
			});
		}
	} else if (url.indexOf("forums.php") >= 0 && url.indexOf("old_forums.php") < 0) {
		console.log("forums");
		// Forums page only
		var signatures = $('.post-container').find('.profile-sign');
		if (signatures.length > 0) {
			signatures.each(function () {
				var cleaned = cleanup($(this).html());
				var parsed = bbcodeParser.bbcodeToHtml(cleaned);
				$(this).html(parsed);
			});
		}
	} else if (url.indexOf("old_forums.php") >= 0) {
		oldForumFix(bbcodeParser);
	}

}

/*************************************
 *      RUN THE SCRIPT
 *************************************/
runScript() 