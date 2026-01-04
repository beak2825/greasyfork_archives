// ==UserScript==
// @name				Alienware Arena Giveaway Keys Checker
// @name:ja				Alienware Arena ギブアウェイキー チェッカー
// @name:zh-CN				Alienware Arena 赠品密钥检查器
// @name:zh-TW				Alienware Arena 贈品密鑰檢查器
// @license				GPL-3.0
// @namespace				https://twitch.tv/kikka1225
// @version				1.9.3
// @description				Generate a button in the top left corner of the page to check the available country and remaining keys.
// @description:ja			ページの左上に、利用可能な国と残りのキーを確認するためのボタンを生成します。
// @description:zh-CN			在页面左上角生成一个按钮，用于检查可用的国家/地区和剩余密钥。
// @description:zh-TW			在頁面左上角產生一個按鈕，以查看可用的國家/地區和剩餘的密鑰。
// @author				Saulios & Misha
// @match				*://*.alienwarearena.com/ucf/show/*/Giveaway/*
// @match				*://*.alienwarearena.com/ucf/Giveaway
// @icon				data:image/webp;base64,UklGRmQEAABXRUJQVlA4IFgEAAAQFgCdASpaAFoAPm0ylkekIqIspHZrmZANiWQAv2xWECfK/kz+QHYQdI+Fej7tHnS+KX0ivMB5zvSAf0n/M9ZL6AHSsft56QDyNDWoZ2ZX44vpL2DP1o6ID2VSftZa4e9NF9BFIYpv7LM/gdaKHEIXpwhQxskxDiNaqk+1LrzGK+JK5ODt6WEJK6iiMBCTDygJsQtOBAsNO9+0UgbiNCKwer1RWr/7G1JQmreJlJNdg5hiI3VW8HKeAAD+ubJ7JuE2f/UGFOZFFj//EMShCERN2Z28b8ofZ34CKzIJVgbOrRmLp//nHpHjhAmBAOnVDZ/yfRD/t1ZwzDerm+r1RPkQzXNnXBMwt64Q5Mjz4GVcZF8be2A3gc7WOmZkJDRdSgMHAJ1L1VHBWKupG1uH+biA7g9nrXu2jd9JPF1FRShz46dXB13FQtcs4RRePGaU0vgJC/D/o252tWPE2S1F0GI6Ux7dr4XkSLrHoGOxei0zWMBXDfheSpB01f5xge2fTdEl/0TveavbTUnsSxXzLLIMB2Hwd7P+LDTab/XdufQKdkUJn2sLhIHddWgxpt1gDbAQ8bXm/ZlQiAsAc/OWkj2SfzhL+4zogOIcbrEr2LVGPgYsnPSupzIF3N4MNujbvGAq6/LgG6Dh+6voPM0cD/8ci/38Hw9IY0/eC8h3XfWm9xgmBYoiWuzQ2Pt1/pEJnLxEqUupdPWTlOG9wyZ4rSWhHM1l6eOcEUG7FxO7MVsTWzcfH6EdeNiy8Rk/S/DbdTa/CHJqTKlPdxNvI1XBTs7j4ArulK0CUPuLl8ospJ2Xr/TCfbzPXdF68QtYheYsLtSQTNNWgMq4dm6w4VBFM+j0BppbmsH/X8aN184PTe2c5OnqYmyoxeqS4MD5LVfss0k93wN6VIQ/s5hzCcdj+NDvZB/6MCkcyAwz6awMBNGyfz7UVxOv5IWB4i4/aj5VTxMMCX++8kcFOv0eP0X25jTTfm0beAlqkjxcVsxc5a7GuCPMWut6Wz9jqk0i9/zn5/sRBaZeXNV6I6Z7DDjKR+p4+5t/6iz9Rd3J7vztncuRkjledVSnUI5XJcGvT2U0p+Zm2NEzdFn3BQNtENIbgYnLeQu/vKqX8nuQoP8rQODSopxfiocdfFLKgy/97ykCNM7HyYdmGvThhBDR68JutTs1h3K+6qIyKtAxGQMCAwom+HmzAKr6ooYdi80m69kp85TP6tnLTnyDw+mqnIRWDwSs5axLCJLt/rr3/lcRw1mjFC2BwMya4+IJKWeNQk8P9FE8IL48RP/iwN1nF+v9De7fyf+hnje4cwq/L/zkw4vY0WlfZC36ofPLm9+qChJfiTbzrU+KbTHqYFRGQAHxLRT59CURVc0dRaw1zw+KpcVLk01/jz70wZ6a0V4v8YPOUKRDF9s5l0HD36/kyHYojf2KrN++/qgF3wdSp4WUojZOFTqOdxXThPjKAPOqPH6IcJR0WOf2+bAAAA==
// @grant				none
// @run-at				document-idle
// @supportURL				https://github.com/Mishasama/UserScript/issues
// @homepageURL				https://github.com/Mishasama/UserScript/tree/master/Misha's%20US/AWA%20GA%20Keys%20Checker/
// @contributionURL			https://ko-fi.com/mishasama
// @contributionAmount			1￥
// @compatible				Chrome
// @compatible				Edge
// @compatible				Firefox
// @downloadURL https://update.greasyfork.org/scripts/499807/Alienware%20Arena%20Giveaway%20Keys%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/499807/Alienware%20Arena%20Giveaway%20Keys%20Checker.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// ボタンのテキストを設定する関数
	function getButtonText() {
		const lang = navigator.language || navigator.userLanguage;
		switch (lang) {
			case 'ja':
				return '残りのキーを確認';
			case 'zh-CN':
				return '检查剩余密钥';
			case 'zh-TW':
				return '檢查剩餘密鑰';
			default:
				return 'Check Keys';
		}
	}

	// メッセージのテキストを設定する関数
	function getMessageText(type) {
		const lang = navigator.language || navigator.userLanguage;
		const messages = {
			'withKeys': {
				'ja': 'キーがある国：',
				'zh-CN': '有密钥的国家：',
				'zh-TW': '有密鑰的國家：',
				'en': 'Countries with keys:'
			},
			'withoutKeys': {
				'ja': 'キーがない国：',
				'zh-CN': '没有密钥的国家：',
				'zh-TW': '沒有密鑰的國家：',
				'en': 'Countries without keys:'
			},
			'allOut': {
				'ja': 'すべて終了！このギブアウェイにはもうキーが残っていません！',
				'zh-CN': '全部派完了！本次赠送活动中的密钥被抢光了！',
				'zh-TW': '全部發完了！本次贈送活動中的密鑰壹個都不剩了！',
				'en': 'All out! There are no more keys left in this giveaway!'
			},
			'everyCountry': {
				'ja': 'すべての国にキーがあります！',
				'zh-CN': '所有的国家都有密钥！',
				'zh-TW': '每個國家都有密鑰！',
				'en': 'Every country has keys available!'
			},
			'keyAvailability': {
				'ja': 'キー在庫状況：',
				'zh-CN': '密钥库存情况：',
				'zh-TW': '密鑰庫存狀況：',
				'en': 'Key Availability:'
			}
		};
		return messages[type][lang] || messages[type]['en'];
	}

	// ボタンを作成してスタイルを設定
	const button = document.createElement('button');
	button.textContent = getButtonText();
	button.style.position = 'fixed';
	button.style.top = '100px';
	button.style.left = '100px';
	button.style.padding = '10px 20px';
	button.style.backgroundColor = '#007bff';
	button.style.color = '#fff';
	button.style.border = 'none';
	button.style.borderRadius = '5px';
	button.style.cursor = 'pointer';
	button.style.zIndex = '1000';
	button.style.whiteSpace = 'pre-wrap'; // 多行表示のサポート

	// 閉じるボタンを作成してスタイルを設定
	const closeButton = document.createElement('button');
	closeButton.textContent = '×';
	closeButton.style.position = 'fixed';
	closeButton.style.top = '100px';
	closeButton.style.left = `calc(${button.style.left} - 30px)`; // メインボタンの左側
	closeButton.style.padding = '10px';
	closeButton.style.backgroundColor = '#dc3545';
	closeButton.style.color = '#fff';
	closeButton.style.border = 'none';
	closeButton.style.borderRadius = '5px';
	closeButton.style.cursor = 'pointer';
	closeButton.style.zIndex = '1000';

	// ボタンをクリックしたときに実行する関数
	let originalText = getButtonText();
	button.onclick = function() {
		if (button.textContent === originalText) {
			var country_with_keys = [];
			var country_without_keys = [];
			var countries = new function () {
				var list = [{
		code: "AF",
		name: "Afghanistan"}, {
		code: "AX",
		name: "Aland Islands"}, {
		code: "AL",
		name: "Albania"}, {
		code: "DZ",
		name: "Algeria"}, {
		code: "AS",
		name: "American Samoa"}, {
		code: "AD",
		name: "Andorra"}, {
		code: "AO",
		name: "Angola"}, {
		code: "AI",
		name: "Anguilla"}, {
		code: "AQ",
		name: "Antarctica"}, {
		code: "AG",
		name: "Antigua and Barbuda"}, {
		code: "AR",
		name: "Argentina"}, {
		code: "AM",
		name: "Armenia"}, {
		code: "AW",
		name: "Aruba"}, {
		code: "AU",
		name: "Australia"}, {
		code: "AT",
		name: "Austria"}, {
		code: "AZ",
		name: "Azerbaijan"}, {
		code: "BS",
		name: "Bahamas"}, {
		code: "BH",
		name: "Bahrain"}, {
		code: "BD",
		name: "Bangladesh"}, {
		code: "BB",
		name: "Barbados"}, {
		code: "BY",
		name: "Belarus"}, {
		code: "BE",
		name: "Belgium"}, {
		code: "BZ",
		name: "Belize"}, {
		code: "BJ",
		name: "Benin"}, {
		code: "BM",
		name: "Bermuda"}, {
		code: "BT",
		name: "Bhutan"}, {
		code: "BO",
		name: "Bolivia"}, {
		code: "BQ",
		name: "Bonaire, Sint Eustatius and Saba"}, {
		code: "BA",
		name: "Bosnia and Herzegovina"}, {
		code: "BW",
		name: "Botswana"}, {
		code: "BV",
		name: "Bouvet Island"}, {
		code: "BR",
		name: "Brazil"}, {
		code: "IO",
		name: "British Indian Ocean Territory"}, {
		code: "BN",
		name: "Brunei Darussalam"}, {
		code: "BG",
		name: "Bulgaria"}, {
		code: "BF",
		name: "Burkina Faso"}, {
		code: "BI",
		name: "Burundi"}, {
		code: "CV",
		name: "Cabo Verde"}, {
		code: "KH",
		name: "Cambodia"}, {
		code: "CM",
		name: "Cameroon"}, {
		code: "CA",
		name: "Canada"}, {
		code: "KY",
		name: "Cayman Islands"}, {
		code: "CF",
		name: "Central African Republic"}, {
		code: "TD",
		name: "Chad"}, {
		code: "CL",
		name: "Chile"}, {
		code: "CN",
		name: "China"}, {
		code: "CX",
		name: "Christmas Island"}, {
		code: "CC",
		name: "Cocos (Keeling) Islands"}, {
		code: "CO",
		name: "Colombia"}, {
		code: "KM",
		name: "Comoros"}, {
		code: "CG",
		name: "Congo"}, {
		code: "CD",
		name: "Congo"}, {
		code: "CK",
		name: "Cook Islands"}, {
		code: "CR",
		name: "Costa Rica"}, {
		code: "CI",
		name: "Côte d\"Ivoire"}, {
		code: "HR",
		name: "Croatia"}, {
		code: "CU",
		name: "Cuba"}, {
		code: "CW",
		name: "Curaçao"}, {
		code: "CY",
		name: "Cyprus"}, {
		code: "CZ",
		name: "Czech Republic"}, {
		code: "DK",
		name: "Denmark"}, {
		code: "DJ",
		name: "Djibouti"}, {
		code: "DM",
		name: "Dominica"}, {
		code: "DO",
		name: "Dominican Republic"}, {
		code: "EC",
		name: "Ecuador"}, {
		code: "EG",
		name: "Egypt"}, {
		code: "SV",
		name: "El Salvador"}, {
		code: "GQ",
		name: "Equatorial Guinea"}, {
		code: "ER",
		name: "Eritrea"}, {
		code: "EE",
		name: "Estonia"}, {
		code: "ET",
		name: "Ethiopia"}, {
		code: "FK",
		name: "Falkland Islands"}, {
		code: "FO",
		name: "Faroe Islands"}, {
		code: "FJ",
		name: "Fiji"}, {
		code: "FI",
		name: "Finland"}, {
		code: "FR",
		name: "France"}, {
		code: "GF",
		name: "French Guiana"}, {
		code: "PF",
		name: "French Polynesia"}, {
		code: "TF",
		name: "French Southern Territories"}, {
		code: "GA",
		name: "Gabon"}, {
		code: "GM",
		name: "Gambia"}, {
		code: "GE",
		name: "Georgia"}, {
		code: "DE",
		name: "Germany"}, {
		code: "GH",
		name: "Ghana"}, {
		code: "GI",
		name: "Gibraltar"}, {
		code: "GR",
		name: "Greece"}, {
		code: "GL",
		name: "Greenland"}, {
		code: "GD",
		name: "Grenada"}, {
		code: "GP",
		name: "Guadeloupe"}, {
		code: "GU",
		name: "Guam"}, {
		code: "GT",
		name: "Guatemala"}, {
		code: "GG",
		name: "Guernsey"}, {
		code: "GN",
		name: "Guinea"}, {
		code: "GW",
		name: "Guinea-Bissau"}, {
		code: "GY",
		name: "Guyana"}, {
		code: "HT",
		name: "Haiti"}, {
		code: "HM",
		name: "Heard Island and McDonald Islands"}, {
		code: "VA",
		name: "Holy See"}, {
		code: "HN",
		name: "Honduras"}, {
		code: "HK",
		name: "Hong Kong"}, {
		code: "HU",
		name: "Hungary"}, {
		code: "IS",
		name: "Iceland"}, {
		code: "IN",
		name: "India"}, {
		code: "ID",
		name: "Indonesia"}, {
		code: "IR",
		name: "Iran"}, {
		code: "IQ",
		name: "Iraq"}, {
		code: "IE",
		name: "Ireland"}, {
		code: "IM",
		name: "Isle of Man"}, {
		code: "IL",
		name: "Israel"}, {
		code: "IT",
		name: "Italy"}, {
		code: "JM",
		name: "Jamaica"}, {
		code: "JP",
		name: "Japan"}, {
		code: "JE",
		name: "Jersey"}, {
		code: "JO",
		name: "Jordan"}, {
		code: "KZ",
		name: "Kazakhstan"}, {
		code: "KE",
		name: "Kenya"}, {
		code: "KI",
		name: "Kiribati"}, {
		code: "KP",
		name: "Korea"}, {
		code: "KR",
		name: "Korea"}, {
		code: "KW",
		name: "Kuwait"}, {
		code: "KG",
		name: "Kyrgyzstan"}, {
		code: "LA",
		name: "Lao"}, {
		code: "LV",
		name: "Latvia"}, {
		code: "LB",
		name: "Lebanon"}, {
		code: "LS",
		name: "Lesotho"}, {
		code: "LR",
		name: "Liberia"}, {
		code: "LY",
		name: "Libya"}, {
		code: "LI",
		name: "Liechtenstein"}, {
		code: "LT",
		name: "Lithuania"}, {
		code: "LU",
		name: "Luxembourg"}, {
		code: "MO",
		name: "Macao"}, {
		code: "MK",
		name: "Macedonia"}, {
		code: "MG",
		name: "Madagascar"}, {
		code: "MW",
		name: "Malawi"}, {
		code: "MY",
		name: "Malaysia"}, {
		code: "MV",
		name: "Maldives"}, {
		code: "ML",
		name: "Mali"}, {
		code: "MT",
		name: "Malta"}, {
		code: "MH",
		name: "Marshall Islands"}, {
		code: "MQ",
		name: "Martinique"}, {
		code: "MR",
		name: "Mauritania"}, {
		code: "MU",
		name: "Mauritius"}, {
		code: "YT",
		name: "Mayotte"}, {
		code: "MX",
		name: "Mexico"}, {
		code: "FM",
		name: "Micronesia"}, {
		code: "MD",
		name: "Moldova"}, {
		code: "MC",
		name: "Monaco"}, {
		code: "MN",
		name: "Mongolia"}, {
		code: "ME",
		name: "Montenegro"}, {
		code: "MS",
		name: "Montserrat"}, {
		code: "MA",
		name: "Morocco"}, {
		code: "MZ",
		name: "Mozambique"}, {
		code: "MM",
		name: "Myanmar"}, {
		code: "NA",
		name: "Namibia"}, {
		code: "NR",
		name: "Nauru"}, {
		code: "NP",
		name: "Nepal"}, {
		code: "NL",
		name: "Netherlands"}, {
		code: "NC",
		name: "New Caledonia"}, {
		code: "NZ",
		name: "New Zealand"}, {
		code: "NI",
		name: "Nicaragua"}, {
		code: "NE",
		name: "Niger"}, {
		code: "NG",
		name: "Nigeria"}, {
		code: "NU",
		name: "Niue"}, {
		code: "NF",
		name: "Norfolk Island"}, {
		code: "MP",
		name: "Northern Mariana Islands"}, {
		code: "NO",
		name: "Norway"}, {
		code: "OM",
		name: "Oman"}, {
		code: "PK",
		name: "Pakistan"}, {
		code: "PW",
		name: "Palau"}, {
		code: "PS",
		name: "Palestine"}, {
		code: "PA",
		name: "Panama"}, {
		code: "PG",
		name: "Papua New Guinea"}, {
		code: "PY",
		name: "Paraguay"}, {
		code: "PE",
		name: "Peru"}, {
		code: "PH",
		name: "Philippines"}, {
		code: "PN",
		name: "Pitcairn"}, {
		code: "PL",
		name: "Poland"}, {
		code: "PT",
		name: "Portugal"}, {
		code: "PR",
		name: "Puerto Rico"}, {
		code: "QA",
		name: "Qatar"}, {
		code: "RE",
		name: "Réunion"}, {
		code: "RO",
		name: "Romania"}, {
		code: "RU",
		name: "Russia"}, {
		code: "RW",
		name: "Rwanda"}, {
		code: "BL",
		name: "Saint Barthélemy"}, {
		code: "SH",
		name: "Saint Helena, Ascension and Tristan da Cunha"}, {
		code: "KN",
		name: "Saint Kitts and Nevis"}, {
		code: "LC",
		name: "Saint Lucia"}, {
		code: "MF",
		name: "Saint Martin"}, {
		code: "PM",
		name: "Saint Pierre and Miquelon"}, {
		code: "VC",
		name: "Saint Vincent and the Grenadines"}, {
		code: "WS",
		name: "Samoa"}, {
		code: "SM",
		name: "San Marino"}, {
		code: "ST",
		name: "Sao Tome and Principe"}, {
		code: "SA",
		name: "Saudi Arabia"}, {
		code: "SN",
		name: "Senegal"}, {
		code: "RS",
		name: "Serbia"}, {
		code: "SC",
		name: "Seychelles"}, {
		code: "SL",
		name: "Sierra Leone"}, {
		code: "SG",
		name: "Singapore"}, {
		code: "SX",
		name: "Sint Maarten"}, {
		code: "SK",
		name: "Slovakia"}, {
		code: "SI",
		name: "Slovenia"}, {
		code: "SB",
		name: "Solomon Islands"}, {
		code: "SO",
		name: "Somalia"}, {
		code: "ZA",
		name: "South Africa"}, {
		code: "GS",
		name: "South Georgia and the South Sandwich Islands"}, {
		code: "SS",
		name: "South Sudan"}, {
		code: "ES",
		name: "Spain"}, {
		code: "LK",
		name: "Sri Lanka"}, {
		code: "SD",
		name: "Sudan"}, {
		code: "SR",
		name: "Suriname"}, {
		code: "SJ",
		name: "Svalbard and Jan Mayen"}, {
		code: "SZ",
		name: "Swaziland"}, {
		code: "SE",
		name: "Sweden"}, {
		code: "CH",
		name: "Switzerland"}, {
		code: "SY",
		name: "Syrian Arab Republic"}, {
		code: "TW",
		name: "Taiwan"}, {
		code: "TJ",
		name: "Tajikistan"}, {
		code: "TZ",
		name: "Tanzania"}, {
		code: "TH",
		name: "Thailand"}, {
		code: "TL",
		name: "Timor-Leste"}, {
		code: "TG",
		name: "Togo"}, {
		code: "TK",
		name: "Tokelau"}, {
		code: "TO",
		name: "Tonga"}, {
		code: "TT",
		name: "Trinidad and Tobago"}, {
		code: "TN",
		name: "Tunisia"}, {
		code: "TR",
		name: "Turkey"}, {
		code: "TM",
		name: "Turkmenistan"}, {
		code: "TC",
		name: "Turks and Caicos Islands"}, {
		code: "TV",
		name: "Tuvalu"}, {
		code: "UG",
		name: "Uganda"}, {
		code: "UA",
		name: "Ukraine"}, {
		code: "AE",
		name: "United Arab Emirates"}, {
		code: "GB",
		name: "United Kingdom"}, {
		code: "US",
		name: "United States of America"}, {
		code: "UM",
		name: "United States Minor Outlying Islands"}, {
		code: "UY",
		name: "Uruguay"}, {
		code: "UZ",
		name: "Uzbekistan"}, {
		code: "VU",
		name: "Vanuatu"}, {
		code: "VE",
		name: "Venezuela"}, {
		code: "VN",
		name: "Vietnam"}, {
		code: "VG",
		name: "Virgin Islands (British)"}, {
		code: "VI",
		name: "Virgin Islands (U.S.)"}, {
		code: "WF",
		name: "Wallis and Futuna"}, {
		code: "EH",
		name: "Western Sahara"}, {
		code: "YE",
		name: "Yemen"}, {
		code: "ZM",
		name: "Zambia"}, {
		code: "ZW",
		name: "Zimbabwe"}, {
		code: "AN",
		name: "Netherlands Antilles"}, {
		code: "CS",
		name: "Serbia and Montenegro"}, {
		code: "AC",
		name: "Ascension Island"}, {
		code: "CP",
		name: "Clipperton Island"}, {
		code: "DG",
		name: "Diego Garcia"}, {
		code: "EA",
		name: "Ceuta, Melilla"}, {
		code: "EU",
		name: "European Union"}, {
		code: "IC",
		name: "Canary Islands"}, {
		code: "TA",
		name: "Tristan da Cunha"}, {
		code: "QO",
		name: "Outlying Oceania"}
    ];
				var codes = {};

				for (var i = 0; i < list.length; ++i) {
					var entry = list[i];
					codes[entry.code] = entry;
				}

				this.getEntry = function (code) {
					return codes[code];
				};
			};

			for (var country in countryKeys) {
				var get_country = countries.getEntry(country);
				var get_country_name = get_country.name
				if (countryKeys[country].length === 0) {
					country_without_keys.push(" " + get_country_name);
				} else {
					country_with_keys.push(" " + get_country_name);
				}
			};
			country_with_keys.sort();
			country_without_keys.sort();
			if (country_with_keys.length !== 0) {
				country_with_keys[0] = country_with_keys[0].split(" ").join("");
			}
			if (country_without_keys.length !== 0) {
				country_without_keys[0] = country_without_keys[0].split(" ").join("");
			}

			let content = '';
			if (country_without_keys.length !== 0 && country_with_keys.length !== 0) {
				content += `${getMessageText('withKeys')}\n${country_with_keys.toString()}\n`;
			} else if (country_with_keys.length === 0) {
				content += `${getMessageText('allOut')}\n`;
				button.style.backgroundColor = '#dc3545'; // すべてのキーが配布されると、ボタンは赤色で表示されます。
			} else {
				content += `${getMessageText('everyCountry')}\n`;
			}
			for (var country in countryKeys) {
				if (countryKeys[country].length === 0) {
					continue
				};
				for (var level in countryKeys[country]) {
					content += `${getMessageText('keyAvailability')}\nTier: ${level} - Keys: ${countryKeys[country][level]}\n`;
				};
				break
			};
			if (country_without_keys.length !== 0 && country_with_keys.length !== 0) {
				content += `${getMessageText('withoutKeys')}\n${country_without_keys.toString()}\n`;
			}

			button.textContent = content;
			if (country_with_keys.length !== 0) {
				button.style.backgroundColor = '#28a745'; // 変更後の背景色
			}
		} else {
			button.textContent = originalText;
			button.style.backgroundColor = '#007bff'; // 元の背景色
		}
	};

	// 閉じるボタンをクリックしたときに実行する関数
	closeButton.onclick = function() {
		document.body.removeChild(button);
		document.body.removeChild(closeButton);
	};

	// ボタンをページに追加
	document.body.appendChild(button);
	document.body.appendChild(closeButton);
})();

