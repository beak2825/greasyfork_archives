  // ==UserScript==
  // @name         自动填写地址脚本
  // @namespace    http://tampermonkey.net/
  // @version      1.2
  // @description  自动填写地址
  // @author       You
  // @description       作者Lucien
  // @match             *://shoppingcart.aliexpress.com/*
  // @grant        none
  // @require      https://code.jquery.com/jquery-1.12.4.js
  // @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.14.0/xlsx.min.js
// @downloadURL https://update.greasyfork.org/scripts/374627/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%9C%B0%E5%9D%80%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/374627/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%9C%B0%E5%9D%80%E8%84%9A%E6%9C%AC.meta.js
  // ==/UserScript==


  (function () {
    'use strict';
    var wb; //读取完成的数据
    var rABS = false; //是否将文件读取为二进制字符串
    var objArr
    var sortArr = [{
      "Countries": "Angola",
      "AddressSort": "AO",
      "phoneSort": "244"
    }, {
      "Countries": "Afghanistan",
      "AddressSort": "AF",
      "phoneSort": "93"
    }, {
      "Countries": "Albania",
      "AddressSort": "AL",
      "phoneSort": "355"
    }, {
      "Countries": "Algeria",
      "AddressSort": "DZ",
      "phoneSort": "213"
    }, {
      "Countries": "Andorra",
      "AddressSort": "AD",
      "phoneSort": "376"
    }, {
      "Countries": "Anguilla",
      "AddressSort": "AI",
      "phoneSort": "1264"
    }, {
      "Countries": "Antigua and Barbuda",
      "AddressSort": "AG",
      "phoneSort": "1268"
    }, {
      "Countries": "Argentina",
      "AddressSort": "AR",
      "phoneSort": "54"
    }, {
      "Countries": "Armenia",
      "AddressSort": "AM",
      "phoneSort": "374"
    }, {
      "Countries": "Ascension",
      "phoneSort": "247"
    }, {
      "Countries": "Australia",
      "AddressSort": "AU",
      "phoneSort": "61"
    }, {
      "Countries": "Austria",
      "AddressSort": "AT",
      "phoneSort": "43"
    }, {
      "Countries": "Azerbaijan",
      "AddressSort": "AZ",
      "phoneSort": "994"
    }, {
      "Countries": "Bahamas",
      "AddressSort": "BS",
      "phoneSort": "1242"
    }, {
      "Countries": "Bahrain",
      "AddressSort": "BH",
      "phoneSort": "973"
    }, {
      "Countries": "Bangladesh",
      "AddressSort": "BD",
      "phoneSort": "880"
    }, {
      "Countries": "Barbados",
      "AddressSort": "BB",
      "phoneSort": "1246"
    }, {
      "Countries": "Belarus",
      "AddressSort": "BY",
      "phoneSort": "375"
    }, {
      "Countries": "Belgium",
      "AddressSort": "BE",
      "phoneSort": "32"
    }, {
      "Countries": "Belize",
      "AddressSort": "BZ",
      "phoneSort": "501"
    }, {
      "Countries": "Benin",
      "AddressSort": "BJ",
      "phoneSort": "229"
    }, {
      "Countries": "Bermuda Is.",
      "AddressSort": "BM",
      "phoneSort": "1441"
    }, {
      "Countries": "Bolivia",
      "AddressSort": "BO",
      "phoneSort": "591"
    }, {
      "Countries": "Botswana",
      "AddressSort": "BW",
      "phoneSort": "267"
    }, {
      "Countries": "Brazil",
      "AddressSort": "BR",
      "phoneSort": "55"
    }, {
      "Countries": "Brunei",
      "AddressSort": "BN",
      "phoneSort": "673"
    }, {
      "Countries": "Bulgaria",
      "AddressSort": "BG",
      "phoneSort": "359"
    }, {
      "Countries": "Burkina-faso",
      "AddressSort": "BF",
      "phoneSort": "226"
    }, {
      "Countries": "Burma",
      "AddressSort": "MM",
      "phoneSort": "95"
    }, {
      "Countries": "Burundi",
      "AddressSort": "BI",
      "phoneSort": "257"
    }, {
      "Countries": "Cameroon",
      "AddressSort": "CM",
      "phoneSort": "237"
    }, {
      "Countries": "Canada",
      "AddressSort": "CA",
      "phoneSort": "1"
    }, {
      "Countries": "Cayman Is.",
      "phoneSort": "1345"
    }, {
      "Countries": "Central African Republic",
      "AddressSort": "CF",
      "phoneSort": "236"
    }, {
      "Countries": "Chad",
      "AddressSort": "TD",
      "phoneSort": "235"
    }, {
      "Countries": "Chile",
      "AddressSort": "CL",
      "phoneSort": "56"
    }, {
      "Countries": "China",
      "AddressSort": "CN",
      "phoneSort": "86"
    }, {
      "Countries": "Colombia",
      "AddressSort": "CO",
      "phoneSort": "57"
    }, {
      "Countries": "Congo",
      "AddressSort": "CG",
      "phoneSort": "242"
    }, {
      "Countries": "Cook Is.",
      "AddressSort": "CK",
      "phoneSort": "682"
    }, {
      "Countries": "Costa Rica",
      "AddressSort": "CR",
      "phoneSort": "506"
    }, {
      "Countries": "Cuba",
      "AddressSort": "CU",
      "phoneSort": "53"
    }, {
      "Countries": "Cyprus",
      "AddressSort": "CY",
      "phoneSort": "357"
    }, {
      "Countries": "Czech Republic",
      "AddressSort": "CZ",
      "phoneSort": "420"
    }, {
      "Countries": "Denmark",
      "AddressSort": "DK",
      "phoneSort": "45"
    }, {
      "Countries": "Djibouti",
      "AddressSort": "DJ",
      "phoneSort": "253"
    }, {
      "Countries": "Dominica Rep.",
      "AddressSort": "DO",
      "phoneSort": "1890"
    }, {
      "Countries": "Ecuador",
      "AddressSort": "EC",
      "phoneSort": "593"
    }, {
      "Countries": "Egypt",
      "AddressSort": "EG",
      "phoneSort": "20"
    }, {
      "Countries": "EI Salvador",
      "AddressSort": "SV",
      "phoneSort": "503"
    }, {
      "Countries": "Estonia",
      "AddressSort": "EE",
      "phoneSort": "372"
    }, {
      "Countries": "Ethiopia",
      "AddressSort": "ET",
      "phoneSort": "251"
    }, {
      "Countries": "Fiji",
      "AddressSort": "FJ",
      "phoneSort": "679"
    }, {
      "Countries": "Finland",
      "AddressSort": "FI",
      "phoneSort": "358"
    }, {
      "Countries": "France",
      "AddressSort": "FR",
      "phoneSort": "33"
    }, {
      "Countries": "French Guiana",
      "AddressSort": "GF",
      "phoneSort": "594"
    }, {
      "Countries": "Gabon",
      "AddressSort": "GA",
      "phoneSort": "241"
    }, {
      "Countries": "Gambia",
      "AddressSort": "GM",
      "phoneSort": "220"
    }, {
      "Countries": "Georgia",
      "AddressSort": "GE",
      "phoneSort": "995"
    }, {
      "Countries": "Germany",
      "AddressSort": "DE",
      "phoneSort": "49"
    }, {
      "Countries": "Ghana",
      "AddressSort": "GH",
      "phoneSort": "233"
    }, {
      "Countries": "Gibraltar",
      "AddressSort": "GI",
      "phoneSort": "350"
    }, {
      "Countries": "Greece",
      "AddressSort": "GR",
      "phoneSort": "30"
    }, {
      "Countries": "Grenada",
      "AddressSort": "GD",
      "phoneSort": "1809"
    }, {
      "Countries": "Guam",
      "AddressSort": "GU",
      "phoneSort": "1671"
    }, {
      "Countries": "Guatemala",
      "AddressSort": "GT",
      "phoneSort": "502"
    }, {
      "Countries": "Guinea",
      "AddressSort": "GN",
      "phoneSort": "224"
    }, {
      "Countries": "Guyana",
      "AddressSort": "GY",
      "phoneSort": "592"
    }, {
      "Countries": "Haiti",
      "AddressSort": "HT",
      "phoneSort": "509"
    }, {
      "Countries": "Honduras",
      "AddressSort": "HN",
      "phoneSort": "504"
    }, {
      "Countries": "Hongkong",
      "AddressSort": "HK",
      "phoneSort": "852"
    }, {
      "Countries": "Hungary",
      "AddressSort": "HU",
      "phoneSort": "36"
    }, {
      "Countries": "Iceland",
      "AddressSort": "IS",
      "phoneSort": "354"
    }, {
      "Countries": "India",
      "AddressSort": "IN",
      "phoneSort": "91"
    }, {
      "Countries": "Indonesia",
      "AddressSort": "ID",
      "phoneSort": "62"
    }, {
      "Countries": "Iran",
      "AddressSort": "IR",
      "phoneSort": "98"
    }, {
      "Countries": "Iraq",
      "AddressSort": "IQ",
      "phoneSort": "964"
    }, {
      "Countries": "Ireland",
      "AddressSort": "IE",
      "phoneSort": "353"
    }, {
      "Countries": "Israel",
      "AddressSort": "IL",
      "phoneSort": "972"
    }, {
      "Countries": "Italy",
      "AddressSort": "IT",
      "phoneSort": "39"
    }, {
      "Countries": "Ivory Coast",
      "phoneSort": "225"
    }, {
      "Countries": "Jamaica",
      "AddressSort": "JM",
      "phoneSort": "1876"
    }, {
      "Countries": "Japan",
      "AddressSort": "JP",
      "phoneSort": "81"
    }, {
      "Countries": "Jordan",
      "AddressSort": "JO",
      "phoneSort": "962"
    }, {
      "Countries": "Kampuchea (Cambodia )",
      "AddressSort": "KH",
      "phoneSort": "855"
    }, {
      "Countries": "Kazakstan",
      "AddressSort": "KZ",
      "phoneSort": "327"
    }, {
      "Countries": "Kenya",
      "AddressSort": "KE",
      "phoneSort": "254"
    }, {
      "Countries": "Korea",
      "AddressSort": "KR",
      "phoneSort": "82"
    }, {
      "Countries": "Kuwait",
      "AddressSort": "KW",
      "phoneSort": "965"
    }, {
      "Countries": "Kyrgyzstan",
      "AddressSort": "KG",
      "phoneSort": "331"
    }, {
      "Countries": "Laos",
      "AddressSort": "LA",
      "phoneSort": "856"
    }, {
      "Countries": "Latvia",
      "AddressSort": "LV",
      "phoneSort": "371"
    }, {
      "Countries": "Lebanon",
      "AddressSort": "LB",
      "phoneSort": "961"
    }, {
      "Countries": "Lesotho",
      "AddressSort": "LS",
      "phoneSort": "266"
    }, {
      "Countries": "Liberia",
      "AddressSort": "LR",
      "phoneSort": "231"
    }, {
      "Countries": "Libya",
      "AddressSort": "LY",
      "phoneSort": "218"
    }, {
      "Countries": "Liechtenstein",
      "AddressSort": "LI",
      "phoneSort": "423"
    }, {
      "Countries": "Lithuania",
      "AddressSort": "LT",
      "phoneSort": "370"
    }, {
      "Countries": "Luxembourg",
      "AddressSort": "LU",
      "phoneSort": "352"
    }, {
      "Countries": "Macao",
      "AddressSort": "MO",
      "phoneSort": "853"
    }, {
      "Countries": "Madagascar",
      "AddressSort": "MG",
      "phoneSort": "261"
    }, {
      "Countries": "Malawi",
      "AddressSort": "MW",
      "phoneSort": "265"
    }, {
      "Countries": "Malaysia",
      "AddressSort": "MY",
      "phoneSort": "60"
    }, {
      "Countries": "Maldives",
      "AddressSort": "MV",
      "phoneSort": "960"
    }, {
      "Countries": "Mali",
      "AddressSort": "ML",
      "phoneSort": "223"
    }, {
      "Countries": "Malta",
      "AddressSort": "MT",
      "phoneSort": "356"
    }, {
      "Countries": "Mariana Is",
      "phoneSort": "1670"
    }, {
      "Countries": "Martinique",
      "phoneSort": "596"
    }, {
      "Countries": "Mauritius",
      "AddressSort": "MU",
      "phoneSort": "230"
    }, {
      "Countries": "Mexico",
      "AddressSort": "MX",
      "phoneSort": "52"
    }, {
      "Countries": "Moldova, Republic of",
      "AddressSort": "MD",
      "phoneSort": "373"
    }, {
      "Countries": "Monaco",
      "AddressSort": "MC",
      "phoneSort": "377"
    }, {
      "Countries": "Mongolia",
      "AddressSort": "MN",
      "phoneSort": "976"
    }, {
      "Countries": "Montserrat Is",
      "AddressSort": "MS",
      "phoneSort": "1664"
    }, {
      "Countries": "Morocco",
      "AddressSort": "MA",
      "phoneSort": "212"
    }, {
      "Countries": "Mozambique",
      "AddressSort": "MZ",
      "phoneSort": "258"
    }, {
      "Countries": "Namibia",
      "AddressSort": "NA",
      "phoneSort": "264"
    }, {
      "Countries": "Nauru",
      "AddressSort": "NR",
      "phoneSort": "674"
    }, {
      "Countries": "Nepal",
      "AddressSort": "NP",
      "phoneSort": "977"
    }, {
      "Countries": "Netheriands Antilles",
      "phoneSort": "599"
    }, {
      "Countries": "Netherlands",
      "AddressSort": "NL",
      "phoneSort": "31"
    }, {
      "Countries": "New Zealand",
      "AddressSort": "NZ",
      "phoneSort": "64"
    }, {
      "Countries": "Nicaragua",
      "AddressSort": "NI",
      "phoneSort": "505"
    }, {
      "Countries": "Niger",
      "AddressSort": "NE",
      "phoneSort": "227"
    }, {
      "Countries": "Nigeria",
      "AddressSort": "NG",
      "phoneSort": "234"
    }, {
      "Countries": "North Korea",
      "AddressSort": "KP",
      "phoneSort": "850"
    }, {
      "Countries": "Norway",
      "AddressSort": "NO",
      "phoneSort": "47"
    }, {
      "Countries": "Oman",
      "AddressSort": "OM",
      "phoneSort": "968"
    }, {
      "Countries": "Pakistan",
      "AddressSort": "PK",
      "phoneSort": "92"
    }, {
      "Countries": "Panama",
      "AddressSort": "PA",
      "phoneSort": "507"
    }, {
      "Countries": "Papua New Cuinea",
      "AddressSort": "PG",
      "phoneSort": "675"
    }, {
      "Countries": "Paraguay",
      "AddressSort": "PY",
      "phoneSort": "595"
    }, {
      "Countries": "Peru",
      "AddressSort": "PE",
      "phoneSort": "51"
    }, {
      "Countries": "Philippines",
      "AddressSort": "PH",
      "phoneSort": "63"
    }, {
      "Countries": "Poland",
      "AddressSort": "PL",
      "phoneSort": "48"
    }, {
      "Countries": "French Polynesia",
      "AddressSort": "PF",
      "phoneSort": "689"
    }, {
      "Countries": "Portugal",
      "AddressSort": "PT",
      "phoneSort": "351"
    }, {
      "Countries": "Puerto Rico",
      "AddressSort": "PR",
      "phoneSort": "1787"
    }, {
      "Countries": "Qatar",
      "AddressSort": "QA",
      "phoneSort": "974"
    }, {
      "Countries": "Reunion",
      "phoneSort": "262"
    }, {
      "Countries": "Romania",
      "AddressSort": "RO",
      "phoneSort": "40"
    }, {
      "Countries": "Russia",
      "AddressSort": "RU",
      "phoneSort": "7"
    }, {
      "Countries": "Saint Lueia",
      "AddressSort": "LC",
      "phoneSort": "1758"
    }, {
      "Countries": "Saint Vincent",
      "AddressSort": "VC",
      "phoneSort": "1784"
    }, {
      "Countries": "Samoa Eastern",
      "phoneSort": "684"
    }, {
      "Countries": "Samoa Western",
      "phoneSort": "685"
    }, {
      "Countries": "San Marino",
      "AddressSort": "SM",
      "phoneSort": "378"
    }, {
      "Countries": "Sao Tome and Principe",
      "AddressSort": "ST",
      "phoneSort": "239"
    }, {
      "Countries": "Saudi Arabia",
      "AddressSort": "SA",
      "phoneSort": "966"
    }, {
      "Countries": "Senegal",
      "AddressSort": "SN",
      "phoneSort": "221"
    }, {
      "Countries": "Seychelles",
      "AddressSort": "SC",
      "phoneSort": "248"
    }, {
      "Countries": "Sierra Leone",
      "AddressSort": "SL",
      "phoneSort": "232"
    }, {
      "Countries": "Singapore",
      "AddressSort": "SG",
      "phoneSort": "65"
    }, {
      "Countries": "Slovakia",
      "AddressSort": "SK",
      "phoneSort": "421"
    }, {
      "Countries": "Slovenia",
      "AddressSort": "SI",
      "phoneSort": "386"
    }, {
      "Countries": "Solomon Is",
      "AddressSort": "SB",
      "phoneSort": "677"
    }, {
      "Countries": "Somali",
      "AddressSort": "SO",
      "phoneSort": "252"
    }, {
      "Countries": "South Africa",
      "AddressSort": "ZA",
      "phoneSort": "27"
    }, {
      "Countries": "Spain",
      "AddressSort": "ES",
      "phoneSort": "34"
    }, {
      "Countries": "Sri Lanka",
      "AddressSort": "LK",
      "phoneSort": "94"
    }, {
      "Countries": "St.Lucia",
      "AddressSort": "LC",
      "phoneSort": "1758"
    }, {
      "Countries": "St.Vincent",
      "AddressSort": "VC",
      "phoneSort": "1784"
    }, {
      "Countries": "Sudan",
      "AddressSort": "SD",
      "phoneSort": "249"
    }, {
      "Countries": "Suriname",
      "AddressSort": "SR",
      "phoneSort": "597"
    }, {
      "Countries": "Swaziland",
      "AddressSort": "SZ",
      "phoneSort": "268"
    }, {
      "Countries": "Sweden",
      "AddressSort": "SE",
      "phoneSort": "46"
    }, {
      "Countries": "Switzerland",
      "AddressSort": "CH",
      "phoneSort": "41"
    }, {
      "Countries": "Syria",
      "AddressSort": "SY",
      "phoneSort": "963"
    }, {
      "Countries": "Taiwan",
      "AddressSort": "TW",
      "phoneSort": "886"
    }, {
      "Countries": "Tajikstan",
      "AddressSort": "TJ",
      "phoneSort": "992"
    }, {
      "Countries": "Tanzania",
      "AddressSort": "TZ",
      "phoneSort": "255"
    }, {
      "Countries": "Thailand",
      "AddressSort": "TH",
      "phoneSort": "66"
    }, {
      "Countries": "Togo",
      "AddressSort": "TG",
      "phoneSort": "228"
    }, {
      "Countries": "Tonga",
      "AddressSort": "TO",
      "phoneSort": "676"
    }, {
      "Countries": "Trinidad and Tobago",
      "AddressSort": "TT",
      "phoneSort": "1809"
    }, {
      "Countries": "Tunisia",
      "AddressSort": "TN",
      "phoneSort": "216"
    }, {
      "Countries": "Turkey",
      "AddressSort": "TR",
      "phoneSort": "90"
    }, {
      "Countries": "Turkmenistan",
      "AddressSort": "TM",
      "phoneSort": "993"
    }, {
      "Countries": "Uganda",
      "AddressSort": "UG",
      "phoneSort": "256"
    }, {
      "Countries": "Ukraine",
      "AddressSort": "UA",
      "phoneSort": "380"
    }, {
      "Countries": "United Arab Emirates",
      "AddressSort": "AE",
      "phoneSort": "971"
    }, {
      "Countries": "United Kingdom",
      "AddressSort": "GB",
      "phoneSort": "44"
    }, {
      "Countries": "United States of America",
      "AddressSort": "US",
      "phoneSort": "1"
    }, {
      "Countries": "Uruguay",
      "AddressSort": "UY",
      "phoneSort": "598"
    }, {
      "Countries": "Uzbekistan",
      "AddressSort": "UZ",
      "phoneSort": "233"
    }, {
      "Countries": "Venezuela",
      "AddressSort": "VE",
      "phoneSort": "58"
    }, {
      "Countries": "Vietnam",
      "AddressSort": "VN",
      "phoneSort": "84"
    }, {
      "Countries": "Yemen",
      "AddressSort": "YE",
      "phoneSort": "967"
    }, {
      "Countries": "Yugoslavia",
      "AddressSort": "YU",
      "phoneSort": "381"
    }, {
      "Countries": "Zimbabwe",
      "AddressSort": "ZW",
      "phoneSort": "263"
    }, {
      "Countries": "Zaire",
      "AddressSort": "ZR",
      "phoneSort": "243"
    }, {
      "Countries": "Zambia",
      "AddressSort": "ZM",
      "phoneSort": "260"
    }]
    var zhouArr = [{
      "longname": "Alabama",
      "sortname": "AL"
    }, {
      "longname": "Alaska",
      "sortname": "AK"
    }, {
      "longname": "Arizona",
      "sortname": "AZ"
    }, {
      "longname": "Arkansas",
      "sortname": "AR"
    }, {
      "longname": "California",
      "sortname": "CA"
    }, {
      "longname": "Colorado",
      "sortname": "CO"
    }, {
      "longname": "Connecticut",
      "sortname": "CT"
    }, {
      "longname": "Delaware",
      "sortname": "DE"
    }, {
      "longname": "Florida",
      "sortname": "FL"
    }, {
      "longname": "Georgia",
      "sortname": "GA"
    }, {
      "longname": "Hawaii",
      "sortname": "HI"
    }, {
      "longname": "Idaho",
      "sortname": "ID"
    }, {
      "longname": "Illinois",
      "sortname": "IL"
    }, {
      "longname": "Indiana",
      "sortname": "IN"
    }, {
      "longname": "Iowa",
      "sortname": "IA"
    }, {
      "longname": "Kansas",
      "sortname": "KS"
    }, {
      "longname": "Kentucky",
      "sortname": "KY"
    }, {
      "longname": "Louisiana",
      "sortname": "LA"
    }, {
      "longname": "Maine",
      "sortname": "ME"
    }, {
      "longname": "Maryland",
      "sortname": "MD"
    }, {
      "longname": "Massachusetts",
      "sortname": "MA"
    }, {
      "longname": "Michigan",
      "sortname": "MI"
    }, {
      "longname": "Minnesota",
      "sortname": "MN"
    }, {
      "longname": "Mississippi",
      "sortname": "MS"
    }, {
      "longname": "Missouri",
      "sortname": "MO"
    }, {
      "longname": "Montana",
      "sortname": "MT"
    }, {
      "longname": "Nebraska",
      "sortname": "NE"
    }, {
      "longname": "Nevada",
      "sortname": "NV"
    }, {
      "longname": "New hampshire",
      "sortname": "NH"
    }, {
      "longname": "New jersey",
      "sortname": "NJ"
    }, {
      "longname": "New mexico",
      "sortname": "NM"
    }, {
      "longname": "New York",
      "sortname": "NY"
    }, {
      "longname": "North Carolina",
      "sortname": "NC"
    }, {
      "longname": "North Dakota",
      "sortname": "ND"
    }, {
      "longname": "Ohio",
      "sortname": "OH"
    }, {
      "longname": "Oklahoma",
      "sortname": "OK"
    }, {
      "longname": "Oregon",
      "sortname": "OR"
    }, {
      "longname": "Pennsylvania",
      "sortname": "PA"
    }, {
      "longname": "Rhode island",
      "sortname": "RI"
    }, {
      "longname": "South carolina",
      "sortname": "SC"
    }, {
      "longname": "South dakota",
      "sortname": "SD"
    }, {
      "longname": "Tennessee",
      "sortname": "TN"
    }, {
      "longname": "Texas",
      "sortname": "TX"
    }, {
      "longname": "Utah",
      "sortname": "UT"
    }, {
      "longname": "Vermont",
      "sortname": "VT"
    }, {
      "longname": "Virginia",
      "sortname": "VA"
    }, {
      "longname": "Washington",
      "sortname": "WA"
    }, {
      "longname": "West Virginia",
      "sortname": "WV"
    }, {
      "longname": "Wisconsin",
      "sortname": "WI"
    }, {
      "longname": "Wyoming",
      "sortname": "WY"
    }]
    let DIV = $(
      `
         <div style="width: 300px;height: 300px;background:rgba(255,204,204,1);position: fixed;top: 50px;right: 100px;z-index:999999">
    		<div style="width: 300px;height: 50px;text-align: right;">
    			<span style="width: 50px;height: 50px;background: red;display: inline-block;text-align: center;line-height: 50px;cursor: pointer;">
    				关闭
    			</span>
    		</div>
    		<div style="width: 300px;height: 60px;line-height: 60px;text-indent: 60px;position: relative;">
    			<input type="file"/ onchange="importf(this)" style="width: 200px;background: transparent;outline: none;cursor: pointer;">
    			<span style="width: 95px;height: 30px;background:rgba(255,204,204,1);cursor: pointer;display: inline-block;position: absolute;left: 30px;top: 15px;text-indent: 0;line-height: 30px;">上传订单列表:</span>
    		</div>
    		<div style="width: 300px;height: 60px;line-height: 60px;text-indent: 30px;">
    			<span style="margin-right: 10px;">选择商品</span>
    			<select name="selectshop" onchange='changeshop()'>
                    <option value="0">选择订单</option>
                </select>
    		</div>
            <div style="width: 300px;height: 60px;line-height: 60px;text-indent: 30px;color:red;font-size:20px">
    			当前第 <span id="prevIndex">  </span>单  <span style="margin-right: 30px;"></span>  购买<span id="shopnum"></span>件
    		</div>
    		<div style="width: 300px;height: 60px;line-height: 60px;text-indent: 30px;">
    			<button style="cursor: pointer;" onclick="test()">
    				自动填写地址
    			</button>
    		</div>
    	</div>
     `
    )
    $('body').append(DIV)
    window.importf = function (obj) { //导入
      if (!obj.files) {
        return;
      }
      var f = obj.files[0];
      var reader = new FileReader();
      reader.onload = function (e) {
        var data = e.target.result;
        if (rABS) {
          wb = XLSX.read(btoa(fixdata(data)), { //手动转化
            type: 'base64'
          });
        } else {
          wb = XLSX.read(data, {
            type: 'binary'
          });
        }
        localStorage.setItem('alipayshops', JSON.stringify(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])));
        objArr = JSON.parse(localStorage.getItem('alipayshops'));
        localStorage.setItem('prevshop', JSON.stringify(objArr[0]))
        $('#prevIndex').html('<span style="color:red">当前未选择订单</span>');
        $('#shopnum').html('0');
        selectFun()
      };
      if (rABS) {
        reader.readAsArrayBuffer(f);
      } else {
        reader.readAsBinaryString(f);
      }
    }
    window.fixdata = function (data) { //文件流转BinaryString
      var o = "",
        l = 0,
        w = 10240;
      for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l *
        w + w)));
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
      return o;
    }
    window.selectFun = function () {
      var SelectShop = $("[name='selectshop']")
      SelectShop.html('<option value="0">选择订单</option>')
      objArr.forEach((element, index) => {
        if (element['order-id']) {
          SelectShop.append(`<option dataindex = ` + index + ` value=` + element['order-id'] + `>` + '第' + (
            index + 1) + '单' + ` </option>`)
        }
      })
      $('#shopnum').html(objArr[0].Number)
    }
    window.changeshop = function () {
      var selectIndex = Number($("[name='selectshop']").get(0).selectedIndex) - 1
      $('#shopnum').html(objArr[selectIndex]['quantity-purchased'])
      localStorage.setItem('prevshop', JSON.stringify(objArr[selectIndex]))
      localStorage.setItem('prevshopIndex', selectIndex)
      window.location.href = objArr[selectIndex].Source
    }
    if (localStorage.getItem('alipayshops')) {
      objArr = JSON.parse(localStorage.getItem('alipayshops'))
      console.log(objArr)
      selectFun()
    }

    if (localStorage.getItem('prevshop')) {
      $('#prevIndex').html((Number(localStorage.getItem('prevshopIndex')) + 1) + "/" + objArr.length)
      $('#shopnum').html(JSON.parse(localStorage.getItem('prevshop'))['quantity-purchased']);
    }
    let temp = '';
    let activeObj;
    let stateSelectTag = $($('.sa-form-control.sa-form-field.sa-select-input.sa-province-wrapper .ui-textfield.ui-textfield-system')[1]);    

    window.test = function () {
      if (localStorage.getItem('prevshop')) {
        var activeObj = JSON.parse(localStorage.getItem('prevshop'));
      } else {
        alert('请选择订单')
        return;
      }
      if (activeObj.Country == 'US') {
        for (var i = 0; i < zhouArr.length; i++) {
          if (activeObj.State == zhouArr[i].sortname) {
            stateSelectTag.val(zhouArr[i].longname);
            return;
          }
        }
      } else {
        stateSelectTag.val(activeObj.State);
      }
      $("[name='contactPerson']").val(activeObj.ContactName);
      $("[name='address']").val(activeObj.StreetAddress1);
      $("[name='address2']").val(activeObj.StreetAddress2);
      stateSelectTag.val(activeObj.State);
      $("[name='city']").val(activeObj.City);
      $("[name='address2']").val(activeObj.StreetAddress2);
      $("[name='zip']").val(activeObj.PostalCode);
      $("[name='mobileNo']").val(activeObj.Mobile);
      for (var j = 0; j < sortArr.length; j++) {
        if (sortArr[j].AddressSort == activeObj.Country) {
          $("[name='country']").find("option").attr("selected", false)
          if (activeObj.Country == 'GB') activeObj.Country = 'UK';
          $("[name='country']").find("option[value=" + activeObj.Country + "]").attr("selected", true);
          $("[name='phoneCountry']").val('+' + sortArr[j].phoneSort);
          return;
        }
      }

    }

  })();