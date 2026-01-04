// ==UserScript==
// @name         Goodreads Giveaway Helper
// @namespace    oddjob.hopto.org
// @version      0.4.8
// @description  Goodreads Giveaway Helper 1) Can hide giveaways with poor chances. 2) Hi-light books by authors on your shelves. 3) Speed up entry, and even automatically scan giveaways for authors on your shelves. Now deals with Giveaways for which you can't uncheck "add to read shelf!"
// @author       Guido van Helvoort
// @match        https://www.goodreads.com/giveaway*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31750/Goodreads%20Giveaway%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/31750/Goodreads%20Giveaway%20Helper.meta.js
// ==/UserScript==
(function () {
	var mytemplate = {};

	mytemplate["menu.html"] = "<div id=\"container\"\n" +
		"	style=\"font-family: Lato,\\'Helvetica Neue\\',Helvetica,Arial,sans-serif;font-size: 100%;padding: 5px; overflow: hidden; width: 400px; background-color: rgb(244, 241, 234); border-color: rgb(71, 5,12); border-width: 2px; border-style: solid;\">\n" +
		"	<style> .siteHeader__topFullImageContainer {display: none;}\n" +
		"	</style>\n" +
		"	<h3 class=\"textColor\" style=\"padding-top: 0; margin-top: 0;\">Guido's Goodreads Giveaway Helper v 0.4.8</h3>\n" +
		"\n" +
		"	<div class=\"section\" style=\"margin: 10px; padding: 10px; border: 1px solid rgb(71, 5,12);\">\n" +
		"		<h4 class=\"textColor\"\n" +
		"			style=\"padding-top: 0; margin-top: 0; margin-bottom: 4px;\">\n" +
		"			Hide giveaways with less than X books available\n" +
		"		</h4>\n" +
		"\n" +
		"		<div class=\"status\"\n" +
		"			style=\"font-size: 11px; font-weight: bold; margin-left: 5px; margin-bottom: 10px;\">\n" +
		"			Status:&nbsp;<span id=\"gghMinimumGiveawaysStatus\" class=\"activestatus off\" style=\"color: tomato;\">Off - enter a minimum giveaway amount and click save</span>\n" +
		"		</div>\n" +
		"\n" +
		"		<input id=\"gghMinimumGiveaways\" value=\"5\" />\n" +
		"		<button id=\"gghSetMinimumGiveaways\">Save</button>\n" +
		"		<button id=\"gghDisableMinimumGiveaways\">Disable</button>\n" +
		"	</div>\n" +
		"\n" +
		"	<div class=\"section\" style=\"margin: 10px; padding: 10px; border: 1px solid rgb(71, 5,12);\">\n" +
		"		<h4 class=\"textColor\" style=\"padding-top: 0; margin-top: 0; margin-bottom: 4px;\">Auto-enter giveaways</h4>\n" +
		"		<label><input id=\"gghAddressCheck\" type=\"checkbox\" checked />Auto Select Address</label><br />\n" +
		"		<label><input id=\"gghTermsCheck\" type=\"checkbox\" checked />Auto Agree Terms & Conditions</label><br />\n" +
		"		<label><input id=\"gghToReadCheck\" type=\"checkbox\" checked />Prevent adding giveaways to your to-read shelf\"</label><br />\n" +
		"		<label><input id=\"gghEnterCheck\" type=\"checkbox\" />Auto click \"Enter giveaway\"</label>\n" +
		"	</div>\n" +
		"\n" +
		"	<div class=\"section\" style=\"margin: 10px; padding: 10px; border: 1px solid rgb(71, 5,12);\">\n" +
		"\n" +
		"		<h3>ADVANCED: you need an <a href=\"https://www.goodreads.com/api/keys\" target=\"_blank\">api key</a> for this functionality</h3>\n" +
		"\n" +
		"		<h4 class=\"textColor\" style=\"padding-top: 0; margin-top: 0; margin-bottom: 4px;\">Alert me about authors on all my shelves</h4>\n" +
		"\n" +
		"		<div class=\"status\" style=\"font-size: 11px; font-weight: bold; margin-left: 5px; margin-bottom: 10px;\">\n" +
		"			Status:&nbsp;\n" +
		"			<span id =\"gghAuthorsStatus\" class=\"activestatus off\" style=\"color: tomato;\">Not initialized, click \"load my authors\"</span>\n" +
		"		</div>\n" +
		"\n" +
		"		<button id=\"gghAddKey\">Set API Key</button>\n" +
		"		<button id=\"gghLoadAuthors\">Load My Authors</button>\n" +
		"		<button id=\"gghDisableAuthors\">Disable</button>\n" +
		"\n" +
		"		<hr />\n" +
		"\n" +
		"		<h4 class=\"textColor\" style=\"padding-top: 0; margin-top: 0; margin-bottom: 4px;\">Auto-open giveaways in a new tab</h4>\n" +
		"\n" +
		"		<label><input id=\"gghAutonOpenCheck\" type=\"checkbox\" />Auto open matched authors in a new tab</label><br />\n" +
		"\n" +
		"		<hr />\n" +
		"\n" +
		"		<h4 class=\"textColor\" style=\"padding-top: 0; margin-top: 0; margin-bottom: 4px;\">Auto Scan all pages</h4>\n" +
		"		<button id=\"gghScan\">Scan All Giveaway Pages</button>\n" +
		"\n" +
		"	</div>\n" +
		"\n" +
		"	<span><a href=\"https://www.paypal.me/guidovanhelvoort\">This is free, if you love it, buy me a beer</a></span>\n" +
		"\n" +
		"</div>\n" +
		"";
	/**
	 * Helpers
	 **/

	function xmlToJson(xml) {
		// Create the return object
		var obj = {};

		if (xml.nodeType == 1) { // element
			// do attributes
			if (xml.attributes.length > 0) {
				obj["@attributes"] = {};
				for (var j = 0; j < xml.attributes.length; j++) {
					var attribute = xml.attributes.item(j);
					obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
				}
			}
		} else if (xml.nodeType == 3) { // text
			obj = xml.nodeValue;
		}

		// do children
		if (xml.hasChildNodes()) {
			for (var i = 0; i < xml.childNodes.length; i++) {
				var item = xml.childNodes.item(i);
				var nodeName = item.nodeName;
				if (typeof (obj[nodeName]) == "undefined") {
					obj[nodeName] = xmlToJson(item);
				} else {
					if (typeof (obj[nodeName].push) == "undefined") {
						var old = obj[nodeName];
						obj[nodeName] = [];
						obj[nodeName].push(old);
					}
					obj[nodeName].push(xmlToJson(item));
				}
			}
		}
		return obj;
	}

	var defaultDiacriticsRemovalMap = [{
			'base': 'A',
			'letters': '\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F'
	},
		{
			'base': 'AA',
			'letters': '\uA732'
	},
		{
			'base': 'AE',
			'letters': '\u00C6\u01FC\u01E2'
	},
		{
			'base': 'AO',
			'letters': '\uA734'
	},
		{
			'base': 'AU',
			'letters': '\uA736'
	},
		{
			'base': 'AV',
			'letters': '\uA738\uA73A'
	},
		{
			'base': 'AY',
			'letters': '\uA73C'
	},
		{
			'base': 'B',
			'letters': '\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181'
	},
		{
			'base': 'C',
			'letters': '\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E'
	},
		{
			'base': 'D',
			'letters': '\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779\u00D0'
	},
		{
			'base': 'DZ',
			'letters': '\u01F1\u01C4'
	},
		{
			'base': 'Dz',
			'letters': '\u01F2\u01C5'
	},
		{
			'base': 'E',
			'letters': '\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E'
	},
		{
			'base': 'F',
			'letters': '\u0046\u24BB\uFF26\u1E1E\u0191\uA77B'
	},
		{
			'base': 'G',
			'letters': '\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E'
	},
		{
			'base': 'H',
			'letters': '\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D'
	},
		{
			'base': 'I',
			'letters': '\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197'
	},
		{
			'base': 'J',
			'letters': '\u004A\u24BF\uFF2A\u0134\u0248'
	},
		{
			'base': 'K',
			'letters': '\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2'
	},
		{
			'base': 'L',
			'letters': '\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780'
	},
		{
			'base': 'LJ',
			'letters': '\u01C7'
	},
		{
			'base': 'Lj',
			'letters': '\u01C8'
	},
		{
			'base': 'M',
			'letters': '\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C'
	},
		{
			'base': 'N',
			'letters': '\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4'
	},
		{
			'base': 'NJ',
			'letters': '\u01CA'
	},
		{
			'base': 'Nj',
			'letters': '\u01CB'
	},
		{
			'base': 'O',
			'letters': '\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C'
	},
		{
			'base': 'OI',
			'letters': '\u01A2'
	},
		{
			'base': 'OO',
			'letters': '\uA74E'
	},
		{
			'base': 'OU',
			'letters': '\u0222'
	},
		{
			'base': 'OE',
			'letters': '\u008C\u0152'
	},
		{
			'base': 'oe',
			'letters': '\u009C\u0153'
	},
		{
			'base': 'P',
			'letters': '\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754'
	},
		{
			'base': 'Q',
			'letters': '\u0051\u24C6\uFF31\uA756\uA758\u024A'
	},
		{
			'base': 'R',
			'letters': '\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782'
	},
		{
			'base': 'S',
			'letters': '\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784'
	},
		{
			'base': 'T',
			'letters': '\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786'
	},
		{
			'base': 'TZ',
			'letters': '\uA728'
	},
		{
			'base': 'U',
			'letters': '\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244'
	},
		{
			'base': 'V',
			'letters': '\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245'
	},
		{
			'base': 'VY',
			'letters': '\uA760'
	},
		{
			'base': 'W',
			'letters': '\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72'
	},
		{
			'base': 'X',
			'letters': '\u0058\u24CD\uFF38\u1E8A\u1E8C'
	},
		{
			'base': 'Y',
			'letters': '\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE'
	},
		{
			'base': 'Z',
			'letters': '\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762'
	},
		{
			'base': 'a',
			'letters': '\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250'
	},
		{
			'base': 'aa',
			'letters': '\uA733'
	},
		{
			'base': 'ae',
			'letters': '\u00E6\u01FD\u01E3'
	},
		{
			'base': 'ao',
			'letters': '\uA735'
	},
		{
			'base': 'au',
			'letters': '\uA737'
	},
		{
			'base': 'av',
			'letters': '\uA739\uA73B'
	},
		{
			'base': 'ay',
			'letters': '\uA73D'
	},
		{
			'base': 'b',
			'letters': '\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253'
	},
		{
			'base': 'c',
			'letters': '\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184'
	},
		{
			'base': 'd',
			'letters': '\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A'
	},
		{
			'base': 'dz',
			'letters': '\u01F3\u01C6'
	},
		{
			'base': 'e',
			'letters': '\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD'
	},
		{
			'base': 'f',
			'letters': '\u0066\u24D5\uFF46\u1E1F\u0192\uA77C'
	},
		{
			'base': 'g',
			'letters': '\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F'
	},
		{
			'base': 'h',
			'letters': '\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265'
	},
		{
			'base': 'hv',
			'letters': '\u0195'
	},
		{
			'base': 'i',
			'letters': '\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131'
	},
		{
			'base': 'j',
			'letters': '\u006A\u24D9\uFF4A\u0135\u01F0\u0249'
	},
		{
			'base': 'k',
			'letters': '\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3'
	},
		{
			'base': 'l',
			'letters': '\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747'
	},
		{
			'base': 'lj',
			'letters': '\u01C9'
	},
		{
			'base': 'm',
			'letters': '\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F'
	},
		{
			'base': 'n',
			'letters': '\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5'
	},
		{
			'base': 'nj',
			'letters': '\u01CC'
	},
		{
			'base': 'o',
			'letters': '\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275'
	},
		{
			'base': 'oi',
			'letters': '\u01A3'
	},
		{
			'base': 'ou',
			'letters': '\u0223'
	},
		{
			'base': 'oo',
			'letters': '\uA74F'
	},
		{
			'base': 'p',
			'letters': '\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755'
	},
		{
			'base': 'q',
			'letters': '\u0071\u24E0\uFF51\u024B\uA757\uA759'
	},
		{
			'base': 'r',
			'letters': '\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783'
	},
		{
			'base': 's',
			'letters': '\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B'
	},
		{
			'base': 't',
			'letters': '\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787'
	},
		{
			'base': 'tz',
			'letters': '\uA729'
	},
		{
			'base': 'u',
			'letters': '\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289'
	},
		{
			'base': 'v',
			'letters': '\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C'
	},
		{
			'base': 'vy',
			'letters': '\uA761'
	},
		{
			'base': 'w',
			'letters': '\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73'
	},
		{
			'base': 'x',
			'letters': '\u0078\u24E7\uFF58\u1E8B\u1E8D'
	},
		{
			'base': 'y',
			'letters': '\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF'
	},
		{
			'base': 'z',
			'letters': '\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763'
	}
];

	var diacriticsMap = {};
	for (var i = 0; i < defaultDiacriticsRemovalMap.length; i++) {
		var letters = defaultDiacriticsRemovalMap[i].letters;
		for (var j = 0; j < letters.length; j++) {
			diacriticsMap[letters[j]] = defaultDiacriticsRemovalMap[i].base;
		}
	}

	function removeDiacritics(str) {
		return str.replace(/[^\u0000-\u007E]/g, function (a) {
			return diacriticsMap[a] || a;
		});
	}

	var gghIsMainPage = window.location.href === 'https://www.goodreads.com/giveaway';
	var gghIsDetailPage = window.location.href.indexOf('giveaway/show') !== -1;
	var gghIsAddressPage = window.location.href.indexOf('giveaway/enter_choose_address') !== -1;
	var gghIsLastEntryPage = window.location.href.indexOf('giveaway/enter_print_giveaway') !== -1 || window.location.href.indexOf('enter_kindle_giveaway') !== -1;

	jQuery(document).keyup(function (e) {
		if (e.keyCode == 27) { // escape key maps to keycode `27`
			localStorage.removeItem('gghelper_scanMode');
			alert('auto scan ended - whoo that was scary!');
		}
	});

	/**
	 * Actual code
	 **/

	window.setTimeout(function () {
		var ids, bookid, unsubCheck;

		unsubCheck = function () {
			// if we have book ids to unsubscribe go and do that
			//var ids = localStorage.getItem('gghelper_unsubids');
			var storedIds = JSON.parse(localStorage.getItem('gghelper_unsubids_v2')),
				requests = [],
				i, l;

			if (storedIds) {
				for (i = 0, l = storedIds.length; i < l; i++) {
					var ids = storedIds[i];
					console.log('unsub posting.... ', ids);
					requests.push(
						jQuery.ajax({
							type: "POST",
							url: "/review/destroy/" + ids,
							success: function (xml) {
								console.log('unsubbed!' + ids);

								var index = storedIds.indexOf(ids);
								if (index !== -1) {
									storedIds.splice(index, 1);
								}

							},
							error: function (xml) {
								console.log('unsuccess unsub')
							}
						})
					);
					jQuery.when.apply(jQuery, requests).done(function () {
						//console.log('do something when all AJAX requests have completed here...');
						localStorage.removeItem('gghelper_unsubids_v2');
					});
				}
			} else {
				console.log('nothing to unsub? ', storedIds);
			}

		}

		var bookId;

		var isBookOnShelf = function (id) {
			var dfd = jQuery.Deferred(),
				url = "/review/show_by_user_and_book.xml?book_id=" + id;

			url += '&key=' + localStorage.getItem('gghelper_apiKey');
			url += '&user_id=' + qcdata.uid;

			jQuery.ajax({
				type: "GET",
				url: url,
				success: function (xml) {
					// this book has a review for the current user and thus is on a shelf
					console.log('all good here')

					dfd.resolve(id);
				},
				error: function (xml) {
					// this book has no review for the current user
					console.log('error here')
					dfd.reject(id);
				},
				always: function (a, b, c, d, e) {
					console.log('is this a thing', a, b, c, d, e);
				}
			});

			return dfd.promise();
		}

		if (gghIsDetailPage || gghIsAddressPage || gghIsLastEntryPage) {
			// Other (non list page logic)
			// TODO expose this as settings too
			if (gghIsAddressPage) {
				// auto click select address
				if (localStorage.getItem('gghelper_addressCheck') !== 'off') {
					jQuery('.gr-button.gr-button--small').click();
				}
			} else if (gghIsLastEntryPage) {
				if (localStorage.getItem('gghelper_termsCheck') !== 'off') {
					jQuery('#termsCheckBox').click();
				}
				if (localStorage.getItem('gghelper_toReadCheck') !== 'off') {
					// New! some but not all books no longer have the option to NOT add the book to add to read
					if (jQuery('#want_to_read').length === 0) {

						// we will inject the old checkbox like it used to be
						jQuery('form[name=entry_form]').find('.stacked:last').before('<div class="stacked">... but Goodreads Giveaway Helper will try to remove this book from your Want to Read shelf (only if you didn\'t add it yourself already prior entering this giveaway)</div>');

						// TODO probably will need stack support

						// Save the book ID, we will later submit a request to remove the book from to read
						bookId = jQuery('.bookTitle').attr('href').split('show/')[1].split('-')[0];

						console.log('hijacking submit for now ', bookId);
						// Preventing form submit here. We want to check first if the book was already on a user's to read shelf
						// If it is, we don't have to do anything, if it wasn't then we set the book up for future removal from the to
						// read list
						jQuery('form[name=entry_form]').submit(function (e) {
							e.preventDefault();
							console.log('preventing default')

							var continueSubmit = function () {
								jQuery('form[name=entry_form]').off('submit');
								jQuery('#giveawaySubmitButton').prop('disabled', false);
								jQuery('#giveawaySubmitButton').click();
							}

							/*
							jQuery.when( isBookOnShelf(bookId) ).done(
								function( status ) {
									console.log("book was already added by user on a shelf" );
									continueSubmit();
								})
								.fail(function() {	function( status ) {
									console.log("book is not on shelf, setting up for future removal" );
									//localStorage.setItem('gghelper_unsubids', bookId);

									var storedIds = JSON.parse(localStorage.getItem("gghelper_unsubids_v2")) || [];
									storedIds.push(bookId);
									localStorage.setItem("gghelper_unsubids_v2", JSON.stringify(storedIds));


									continueSubmit();
								}
							);*/

							jQuery.when(isBookOnShelf(bookId)).done(function (a, b, c) {
									console.log("book was already added by user on a shelf");
									continueSubmit();
								})
								.fail(function () {
									console.log("book is not on shelf, setting up for future removal");
									//localStorage.setItem('gghelper_unsubids', bookId);

									var storedIds = JSON.parse(localStorage.getItem("gghelper_unsubids_v2")) || [];
									storedIds.push(bookId);
									localStorage.setItem("gghelper_unsubids_v2", JSON.stringify(storedIds));


									continueSubmit();
								});


						});
					} else {
						// old fashioned click
						jQuery('#want_to_read').click();
					}

				}

				if (localStorage.getItem('gghelper_enterCheck') === 'on') {
					jQuery('#giveawaySubmitButton').click();
				}

			} else if (gghIsDetailPage) {
				unsubCheck();
			}
		} else {
			// main list page logic (longest part of the code)

			/**
			 * Append the overlay div
			 **/

			var newHTML = document.createElement('div');
			newHTML.style.position = "absolute";
			newHTML.style.right = 20 + 'px';
			newHTML.style.top = 50 + 'px';
			newHTML.innerHTML = mytemplate["menu.html"];
			document.body.appendChild(newHTML);

			/**
			 * Add button & checkbox listeners
			 **/

			// Hide giveaway listeners
			document.getElementById("gghSetMinimumGiveaways").onclick = function () {
				var val = parseInt(document.getElementById('gghMinimumGiveaways').value || 0);
				localStorage.setItem('gghelper_minimumGiveaways', val);
				hideTheCheapos();
			};
			document.getElementById("gghDisableMinimumGiveaways").onclick = function () {
				localStorage.removeItem('gghelper_minimumGiveaways');
				hideTheCheapos();
			};

			// Checkboxes for Auto-enter
			document.getElementById("gghAddressCheck").addEventListener('change', function (event) {
				var on = event.target.checked;
				localStorage.setItem('gghelper_addressCheck', on ? 'on' : 'off');
			});
			document.getElementById("gghTermsCheck").addEventListener('change', function (event) {
				var on = event.target.checked;
				localStorage.setItem('gghelper_termsCheck', on ? 'on' : 'off');
			});
			document.getElementById("gghToReadCheck").addEventListener('change', function (event) {
				var on = event.target.checked;
				localStorage.setItem('gghelper_toReadCheck', on ? 'on' : 'off');
			});
			document.getElementById("gghEnterCheck").addEventListener('change', function (event) {
				var on = event.target.checked;
				localStorage.setItem('gghelper_enterCheck', on ? 'on' : 'off');
			});
			document.getElementById("gghAutonOpenCheck").addEventListener('change', function (event) {
				var on = event.target.checked;
				var authors = localStorage.getItem('gghelper_yourAuthors');

				if (authors) {
					localStorage.setItem('gghelper_autoEnter', on ? 'on' : 'off');
					autoEnterDisplay();
					checkThyAuthors();
				} else {
					localStorage.setItem('gghelper_autoEnter', 'off');
					document.getElementById("gghAutonOpenCheck").checked = false;
					alert('load up authors you\'re looking for first in the section above');
				}
			});

			document.getElementById("gghDisableAuthors").onclick = function () {
				localStorage.removeItem('gghelper_yourAuthors');
				checkThyAuthors();
			};

			document.getElementById("gghAddKey").onclick = function () {
				var key = prompt("Please enter your goodreads api key", "");

				if (key !== null && key !== '') {
					localStorage.setItem('gghelper_apiKey', key);
				}
			};
			document.getElementById("gghLoadAuthors").onclick = function () {
				var key = localStorage.getItem('gghelper_apiKey');
				if (!Boolean(key)) {
					alert('You have to set an API key first to be able to load your authors. Get one free at https://www.goodreads.com/api/keys');
					return;
				}

				var statusDiv = document.getElementById('gghAuthorsStatus');
				statusDiv.innerHTML = 'Loading up authors, this can take a while depending on your amount of books (500 authors is about 20 seconds)';

				var maxpage = 200;
				var newAuthors = [];
				var getAuthors = function () {
					statusDiv.innerHTML += '..';
					var dfd = jQuery.Deferred();
					var page = 0;
					// var shelves = ['read', 'to-read'];
					var shelves = ['all']; // probably didn't need the shelves logic grrrrrs
					var shelf = shelves.pop();
					var hitApi = function () {
						page++;
						console.log('hitting api for page ' + page);

						if (!qcdata.uid) {
							alert('Are you signed in? I dont see your user id ');
							//console.log('something wrong, cant find user id ')
						}

						jQuery.ajax({
							type: "GET",
							url: "/review/list/" + qcdata.uid + ".xml?key=" + key + "&v=2&id=" + qcdata.uid + "&per_page=" + maxpage + "&shelf=" + shelf + "&page=" + page,
							dataType: "xml",
							success: function (xml) {
								var i, l;
								var json = xmlToJson(xml);
								var reviews = json.GoodreadsResponse.reviews.review;

								for (i = 0, l = reviews.length; i < l; i++) {
									var author = reviews[i].book.authors.author.name['#text'];
									author = jQuery.trim(author.replace(/\s\s+/g, ' '));
									newAuthors.push(author);
								}

								// check if we need to check the next page
								if (reviews.length === maxpage) {
									console.log('but wait! theres more!');
									hitApi();
								} else {
									if (shelves.length > 0) {
										console.log('done with shelf ' + shelf);
										shelf = shelves.pop();
										console.log('now doing shelf ' + shelf);
										page = 0;
										hitApi();
									} else {
										console.log('that\'s all folks');
										dfd.resolve();
									}
								}

							},
							error: function () {
								console.log("An error occurred while processing XML file.");
								dfd.resolve();
							}
						});
					};
					hitApi();

					return dfd;
				};

				getAuthors().done(
					function () {
						newAuthors = jQuery.unique(newAuthors);
						console.log('done! finished!');
						console.log(newAuthors);
						console.log(newAuthors.length);
						localStorage.setItem('gghelper_yourAuthors', JSON.stringify(newAuthors));
						checkThyAuthors();
					}
				);

			};

			/*

					document.getElementById("gghAutoEnter").onclick = function() {
						var authors = localStorage.getItem('gghelper_yourAuthors');

						if (authors) {
							localStorage.setItem('gghelper_autoEnter', 'on');
							autoEnterDisplay();
							checkThyAuthors();
						} else {
							alert ('load up authors you\'re looking for first in the section above');
						}

					};

					document.getElementById("gghDisableAutoEnter").onclick = function() {
						localStorage.removeItem('gghelper_autoEnter');
						autoEnterDisplay();
					};

			*/

			document.getElementById("gghScan").onclick = function () {
				var autoEnter = localStorage.getItem('gghelper_autoEnter');

				if (autoEnter) {

					var r = confirm("Warning! This will hit the 'next' button automatically until the last page. Any matching author giveaway will be opened in a new page (make sure to have pop ups enabled). During any time you can hit the ESCAPE key and the auto scan should halt. Enjoy!");
					if (r === true) {
						localStorage.setItem('gghelper_scanMode', 'on');
						doScan();
					}


				} else {
					alert('auto enter should be on for this');
				}
			};


			/**
			 * Main functions
			 **/

			// initalize auto enter checkboxes
			function autoEnterChecks() {
				document.getElementById("gghAddressCheck").checked = (localStorage.getItem('gghelper_addressCheck') !== 'off');
				document.getElementById("gghTermsCheck").checked = (localStorage.getItem('gghelper_termsCheck') !== 'off');
				document.getElementById("gghToReadCheck").checked = (localStorage.getItem('gghelper_toReadCheck') !== 'off');
				document.getElementById("gghEnterCheck").checked = (localStorage.getItem('gghelper_enterCheck') === 'on');
			}

			// reads localStorage and sees if there are authors to highlight on the current page
			function checkThyAuthors() {
				var authors = localStorage.getItem('gghelper_yourAuthors'),
					statusDiv = document.getElementById('gghAuthorsStatus');

				if (jQuery.type(authors) === 'string') {
					authors = JSON.parse(authors);
				}

				if (authors && authors.length > 0) {
					statusDiv.innerHTML = 'On! Loaded up with ' + authors.length + ' authors, and you will get an alert if a giveaway page has one of your authors of interest';
					statusDiv.style.color = 'green';
					authorHighlighter(authors);
				} else {
					statusDiv.innerHTML = 'Not initialized, set API Key and click "load my authors"';
					statusDiv.style.color = 'tomato';
				}
			}

			// reads localStorage preference to see which books are not interesting to see due to low availability
			function hideTheCheapos() {
				var minimumBooks = localStorage.getItem('gghelper_minimumGiveaways');

				jQuery('.giveawayListItem:hidden').show();

				if (minimumBooks) {
					document.getElementById('gghMinimumGiveaways').value = minimumBooks;
					document.getElementById('gghMinimumGiveawaysStatus').innerHTML = 'On! Hiding books with ' + minimumBooks + ' or less.';
					document.getElementById('gghMinimumGiveawaysStatus').style.color = 'green';
					jQuery('.giveawayListItem').each(function (index, item) {
						var limit = parseInt(jQuery.trim(jQuery(jQuery(item).find('.giveawayDetailItem')[2]).text().split('Availability:')[1].split('cop')[0]));

						if (limit <= minimumBooks) {
							item.hide();
						}

						/* slower old number check in case limit look up turns out too hacky
						for (var i = 1; (i - 1) < minimumBooks; i++ ) {
							var detail = jQuery(item).find('.giveawayDetailItem:contains("' + i + (i === 1 ? ' copy' : ' copies') + '")');
							if (detail.length > 0) {
								item.hide();
							}
						}
						*/
					});
				} else {
					document.getElementById('gghMinimumGiveawaysStatus').innerHTML = 'Off - enter a minimum giveaway amount and click save';
					document.getElementById('gghMinimumGiveawaysStatus').style.color = 'tomato';
				}
			}

			// used by checkThyAuthors to see which to highlight
			function authorHighlighter(authors) {
				jQuery('.authorName:visible').each(function (index, el) {
					var i, l, a, found = false,
						$parent,
						giveawayButton,
						url,
						autoEnter = Boolean(localStorage.getItem('gghelper_autoEnter')),
						aa;

					a = removeDiacritics(jQuery(el).find('span').text());
					a = a.replace(/\s\s+/g, ' ');

					for (i = 0, l = authors.length; i < l; i++) {
						if (removeDiacritics(authors[i]) == a) {
							jQuery(el).css('background-color', 'hotpink');
							$parent = jQuery(el).closest('.giveawayListItem');
							$parent.show(); // always show authors we like
							$parent.css('background-color', 'AntiqueWhite');
							aa = a;
							found = true;
							giveawayButton = $parent.find('.gr-button');

							if (giveawayButton.length === 0) {
								// already entered this giveaway
								return;
							}

							url = giveawayButton.attr('href');

							if (typeof (url) !== 'string' || url.indexOf('undefined') > -1) {
								// something wrong
								console.log('check out:', $parent, a);
								return;
							}

							if (autoEnter && url) {

								window.open(url, '_blank');
							} else if (url) {
								alert('Golly! I found ' + a);
							} else {
								// we're entered already
							}
						}
					}
				});
			}

			function autoEnterDisplay() {
				document.getElementById("gghAutonOpenCheck").checked = (localStorage.getItem('gghelper_autoEnter') === 'on');
			}

			function doScan() {
				var scanMode = localStorage.getItem('gghelper_scanMode'),
					$nextBtn = jQuery('.next_page');
				localStorage.setItem('gghelper_autoEnter', 'on');
				autoEnterDisplay();

				if (scanMode === 'on') {
					if (gghIsMainPage && jQuery('#header_error_container').is(':visible')) {
						// this can happen when the tool tries to enter a giveaway you already won
						// The page redirect to the main giveaway page with the error message
						// "Sorry, you can't enter this giveaway since you've already won this book."
						// In this case we don't want to start another scanning session.
					} else if ($nextBtn.hasClass('disabled')) {
						localStorage.removeItem('gghelper_scanMode');
						alert('Done scanning! If I found anything for you, they should have opened in new tabs');
					} else {
						window.setTimeout(function () {
							window.location.href = jQuery('.next_page').attr('href');
						}, 500);

					}
				}

			}

			/**
			 * Init
			 **/

			hideTheCheapos();
			autoEnterChecks();
			checkThyAuthors();
			autoEnterDisplay();
			doScan();


		} // end of main list page logic


	}, 500); // end timeout delay so the page def rendered
})(); // end plugin
