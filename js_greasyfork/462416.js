// ==UserScript==
// @name         R74n Unit Converter Mod Test
// @namespace    http://tampermonkey.net/
// @version      1.11.10
// @description  Experimental mod for R74n's Unit Converter.
// @author       An Orbit
// @match        https://r74n.com/convert*
// @icon         https://R74n.com/icons/favicon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462416/R74n%20Unit%20Converter%20Mod%20Test.user.js
// @updateURL https://update.greasyfork.org/scripts/462416/R74n%20Unit%20Converter%20Mod%20Test.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //momentum of top speed 2010 MC = (unitdata.weight["2010 mini cooper curb weight"] / 1000) * unitdata.speed["2010 mini cooper top speed"];

    if(!unitdata) {
        alert("Failed to load unitdata! (Try refreshing?)");
        return false;
    };

    window.getCurrentType = function() {
        var selector = document.getElementById("TypeSelect");
        var selectee = selector.options[selector.selectedIndex];
        return selectee.value;
    };

    window.onload = function() {
        window.pageLoadTime = Date.now()
    };

    window.rebuildAndResetLists = function(type) {
        if(typeof(currenttype) == "undefined") {
            return false;
        };

        document.getElementById("UnitSelect1").innerHTML = Object.keys(unitdata[type]).map(x => `<option unit="${x}" value="${x}-1">${x}</option>`).sort().join("");
        document.getElementById("UnitSelect2").innerHTML = Object.keys(unitdata[type]).map(x => `<option unit="${x}" value="${x}-2">${x}</option>`).sort().join("");

        document.getElementById("UnitSelect1").selectedIndex = 0;
        unit1 = document.getElementById("UnitSelect1").childNodes[0].getAttribute("unit");

        document.getElementById("UnitSelect2").selectedIndex = 1;
        unit2 = document.getElementById("UnitSelect2").childNodes[1].getAttribute("unit");
        update();

        return true;
    };

    var exchangeRateManualOverrides = {
        XAU: 1958.35
    };

    /*exchangerate.host API request*/
    var requestURL = 'https://api.exchangerate.host/latest?amount=1000&base=USD';
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();

    request.onload = function() {
        var response = request.response;
        console.log(response);
        var rates = response?.rates;
        var symbols = Object.keys(rates);
        var symbolNameList = {"AUD": "Australia Dollar", "GBP": "Great Britain Pound", "EUR": "Euro", "JPY": "Japan Yen", "CHF": "Switzerland Franc", "USD": "USA Dollar", "AFN": "Afghanistan Afghani", "ALL": "Albania Lek", "DZD": "Algeria Dinar", "AOA": "Angola Kwanza", "ARS": "Argentina Peso", "AMD": "Armenia Dram", "AWG": "Aruba Florin", "AUD": "Australia Dollar", "ATS": "Austria Schilling", "BEF": "Belgium Franc", "AZN": "Azerbaijan New Manat", "BSD": "Bahamas Dollar", "BHD": "Bahrain Dinar", "BDT": "Bangladesh Taka", "BBD": "Barbados Dollar", "BYR": "Belarus Ruble", "BZD": "Belize Dollar", "BMD": "Bermuda Dollar", "BTN": "Bhutan Ngultrum", "BOB": "Bolivia Boliviano", "BAM": "Bosnia Mark", "BWP": "Botswana Pula", "BRL": "Brazil Real", "GBP": "Great Britain Pound", "BND": "Brunei Dollar", "BGN": "Bulgaria Lev", "BIF": "Burundi Franc", "XOF": "CFA Franc BCEAO", "XAF": "CFA Franc BEAC", "XPF": "CFP Franc", "KHR": "Cambodia Riel", "CAD": "Canada Dollar", "CVE": "Cape Verde Escudo", "KYD": "Cayman Islands Dollar", "CLP": "Chili Peso", "China Yuan/Renminbi": "CNY", "COP": "Colombia Peso", "KMF": "Comoros Franc", "CDF": "Congo Franc", "CRC": "Costa Rica Colon", "HRK": "Croatia Kuna", "CUC": "Cuba Convertible Peso", "CUP": "Cuba Peso", "CYP": "Cyprus Pound", "CZK": "Czech Koruna", "DKK": "Denmark Krone", "DJF": "Djibouti Franc", "DOP": "Dominican Republich Peso", "XCD": "East Caribbean Dollar", "EGP": "Egypt Pound", "SVC": "El Salvador Colon", "EEK": "Estonia Kroon", "ETB": "Ethiopia Birr", "EUR": "Euro", "FKP": "Falkland Islands Pound", "FIM": "Finland Markka", "FJD": "Fiji Dollar", "GMD": "Gambia Dalasi", "GEL": "Georgia Lari", "DMK": "Germany Mark", "GHS": "Ghana New Cedi", "GIP": "Gibraltar Pound", "GRD": "Greece Drachma", "GTQ": "Guatemala Quetzal", "GNF": "Guinea Franc", "GYD": "Guyana Dollar", "HTG": "Haiti Gourde", "HNL": "Honduras Lempira", "HKD": "Hong Kong Dollar", "HUF": "Hungary Forint", "ISK": "Iceland Krona", "INR": "India Rupee", "IDR": "Indonesia Rupiah", "IRR": "Iran Rial", "IQD": "Iraq Dinar", "IED": "Ireland Pound", "ILS": "Israel New Shekel", "ITL": "Italy Lira", "JMD": "Jamaica Dollar", "JPY": "Japan Yen", "JOD": "Jordan Dinar", "KZT": "Kazakhstan Tenge", "KES": "Kenya Shilling", "KWD": "Kuwait Dinar", "KGS": "Kyrgyzstan Som", "LAK": "Laos Kip", "LVL": "Latvia Lats", "LBP": "Lebanon Pound", "LSL": "Lesotho Loti", "LRD": "Liberia Dollar", "LYD": "Libya Dinar", "LTL": "Lithuania Litas", "LUF": "Luxembourg Franc", "MOP": "Macau Pataca", "MKD": "Macedonia Denar", "MGA": "Malagasy Ariary", "MWK": "Malawi Kwacha", "MYR": "Malaysia Ringgit", "MVR": "Maldives Rufiyaa", "MTL": "Malta Lira", "MRO": "Mauritania Ouguiya", "MUR": "Mauritius Rupee", "MXN": "Mexico Peso", "MDL": "Moldova Leu", "MNT": "Mongolia Tugrik", "MAD": "Morocco Dirham", "MZN": "Mozambique New Metical", "MMK": "Myanmar Kyat", "ANG": "NL Antilles Guilder", "NAD": "Namibia Dollar", "NPR": "Nepal Rupee", "NLG": "Netherlands Guilder", "NZD": "New Zealand Dollar", "NIO": "Nicaragua Cordoba Oro", "NGN": "Nigeria Naira", "KPW": "North Korea Won", "NOK": "Norway Kroner", "OMR": "Oman Rial", "PKR": "Pakistan Rupee", "PAB": "Panama Balboa", "PGK": "Papua New Guinea Kina", "PYG": "Paraguay Guarani", "PEN": "Peru Nuevo Sol", "PHP": "Philippines Peso", "PLN": "Poland Zloty", "PTE": "Portugal Escudo", "QAR": "Qatar Rial", "RON": "Romania New Lei", "RUB": "Russia Rouble", "RWF": "Rwanda Franc", "WST": "Samoa Tala", "Sao Tome/Principe Dobra": "STD", "SAR": "Saudi Arabia Riyal", "RSD": "Serbia Dinar", "SCR": "Seychelles Rupee", "SLL": "Sierra Leone Leone", "SGD": "Singapore Dollar", "SKK": "Slovakia Koruna", "SIT": "Slovenia Tolar", "SBD": "Solomon Islands Dollar", "SOS": "Somali Shilling", "ZAR": "South Africa Rand", "KRW": "South Korea Won", "ESP": "Spain Peseta", "LKR": "Sri Lanka Rupee", "SHP": "St Helena Pound", "SDG": "Sudan Pound", "SRD": "Suriname Dollar", "SZL": "Swaziland Lilangeni", "SEK": "Sweden Krona", "CHF": "Switzerland Franc", "SYP": "Syria Pound", "TWD": "Taiwan Dollar", "TZS": "Tanzania Shilling", "THB": "Thailand Baht", "Tonga Pa'anga": "TOP", "Trinidad/Tobago Dollar": "TTD", "TND": "Tunisia Dinar", "TRY": "Turkish New Lira", "TMM": "Turkmenistan Manat", "USD": "USA Dollar", "UGX": "Uganda Shilling", "UAH": "Ukraine Hryvnia", "UYU": "Uruguay Peso", "AED": "United Arab Emirates Dirham", "VUV": "Vanuatu Vatu", "VEB": "Venezuela Bolivar", "VND": "Vietnam Dong", "YER": "Yemen Rial", "ZMK": "Zambia Kwacha", "ZWD": "Zimbabwe Dollar", "BYN": "Belarusian ruble", "CLF": "Chilean unit of account", "CNH": "Chinese yuan (offshore)", "CNY": "Chinese yuan", "ERN": "Eritrean nakfa", "GGP": "Guernsey pound", "IMP": "Manx pound", "JEP": "Jersey pound", "MRU": "Mauritanian ouguiya", "SSP": "South Sudanese pound", "STD": "São Tomé and Príncipe dobra (old)", "STN": "São Tomé and Príncipe dobra", "TJS": "Tajikistani Somoni", "TMT": "Turkmenistani Manat", "TOP": "Tongan paʻanga", "TTD": "Trinidad & Tobago Dollar", "UZS": "Uzbekistani Som", "VES": "Venezuelan Bolívar", "XAG": "Silver Ounces", "XAU": "Gold Ounces", "XDR": "Special Drawing Rights", "XPD": "Palladium Ounces", "XPT": "Platinum Ounces", "ZMW": "Zambian Kwacha", "ZWL": "Zimbabwean RTGS Dollar"};
        for(let i = 0; i < symbols.length; i++) {
            var symbol = symbols[i];
            if(["USD","BTC"].includes(symbol)) { continue };
            var rate = rates[symbol];
            if(typeof(rate) == "number") {
                var fullName = symbolNameList[symbol];
                if(fullName) {
                    fullName = `${fullName.toLowerCase()} (${symbol.toLowerCase()})`;
                };
                unitdata.money[fullName ?? symbol] = exchangeRateManualOverrides[symbol] ?? (1 / (rate / 1000));
            };
        };
        rebuildAndResetLists(getCurrentType());

        if(unitdata.money["japan yen (jpy)"]) {
            unitdata.money["embléme o.p."] = unitdata.money["japan yen (jpy)"] * 52000;
            unitdata.money["j.e.j. muse point (purchase)"] = unitdata.money["japan yen (jpy)"] * 100;
            unitdata.money["j.e.j. muse point (use)"] = unitdata.money["japan yen (jpy)"];
        };

        if(unitdata.money["south korea won (krw)"]) {
            unitdata.money["loona total debt"] = unitdata.money["south korea won (krw)"] * 3e9;
            unitdata.money["squid game prize pool"] = unitdata.money["south korea won (krw)"] * 45600000000;
            unitdata.money["south korean minimum wage-hour (2023)"] = 9620 * unitdata.money["south korea won (krw)"]; //https://www.minimumwage.go.kr/english/main.do
            unitdata.money["south korean median wage-hour (2021)"] = (2500000 / 209) * unitdata.money["south korea won (krw)"]; //209 number from the site above, and I'm assuming for convenience that KBS also used that number in https://news.kbs.co.kr/news/view.do?ncd=7615398#:~:text=%EC%A0%84%EC%B2%B4%20%EC%9E%84%EA%B8%88%EA%B7%BC%EB%A1%9C%EC%9E%90%20%EC%86%8C%EB%93%9D%EC%9D%98,%EB%A7%8C%20%EC%9B%90%EC%9D%B417.8%25%EC%9E%85%EB%8B%88%EB%8B%A4.
            var goldPerOzT = unitdata.money["gold ounces (xau)"] ?? 1958.35;
            var loonaDebt = unitdata.money["loona total debt"]; /*KRW is stored as its multiple in USD*/
            var goldOzTrInLoonaDebt = loonaDebt/goldPerOzT;
            var ozTrToGramFactor = 31.1034768;
            var goldGrams = goldOzTrInLoonaDebt * ozTrToGramFactor;
            var goldDensityGramsPerCm3 = 19.3;
            var goldVolumeCm3 = goldGrams/goldDensityGramsPerCm3;
            var goldVolumeM3 = goldVolumeCm3 * unitdata.volume["cubic centimeter"];
            unitdata.volume["loona total debt (m^3 of gold)"] = goldVolumeM3;
        };
    };

    /*coincap.io API request*/
    var requestURL2 = 'https://api.coincap.io/v2/assets';
    var request2 = new XMLHttpRequest();
    request2.open('GET', requestURL2);
    request2.responseType = 'json';
    request2.send();

    request2.onload = function() {
        var response = request2.response;
        console.log(response);
        var data = response.data;
        for(let j = 0; j < data.length; j++) {
            var currency = data[j];
            var name = currency.name;
            var symbol = currency.symbol;
            var usd = currency.priceUsd;
            if(["BTC"].includes(symbol)) { continue };
            var fullName = `${name.toLowerCase()} (${symbol.toLowerCase()})`;
            unitdata.money[fullName] = parseFloat(usd);
        };
    };

    unitdata.money["2010 mini cooper (original msrp)"] = 18800;
    unitdata.money["R74n GOLD (1 month)"] = 2.99;
    unitdata.money["R74n GOLD+ (1 month)"] = 4.99;
    unitdata.money["british guiana 1¢ magenta stamp (last sale)"] = 8307000;
    /*for consistency with "US household income"*/
    unitdata.money["US minimum wage-hour"] = 7.25;
    unitdata.money["US median wage-hour (2021)"] = 17.02;
    unitdata.money["fortnite gift card"] = 19.99;
    unitdata.money["US defense budget (2023)"] = 1.73e12;
    unitdata.money["international space station"] = 150e9;

    function mpgToSqmUS(mpg) {
        var gpm = 1/mpg;
        var cf = 2.35214583e-6;
        return gpm * cf;
    };
    function mpgToSqmUK(mpg) {
        var gpm = 1/mpg;
        var cf = 2.82481053e-6;
        return gpm * cf;
    };

	function smoot(name,heightM) {
		unitdata.length[name] = heightM;
		unitdata.length[`deca${name}`] = heightM*10;
		unitdata.length[`hecto${name}`] = heightM*100;
		unitdata.length[`kilo${name}`] = heightM*1e3;
		unitdata.length[`myria${name}`] = heightM*1e4;
		unitdata.length[`mega${name}`] = heightM*1e6;
		unitdata.length[`giga${name}`] = heightM*1e9;
		unitdata.length[`tera${name}`] = heightM*1e12;
		unitdata.length[`peta${name}`] = heightM*1e15;
		unitdata.length[`exa${name}`] = heightM*1e18;
		unitdata.length[`zetta${name}`] = heightM*1e21;
		unitdata.length[`yotta${name}`] = heightM*1e24;
		unitdata.length[`ronna${name}`] = heightM*1e27;
		unitdata.length[`quetta${name}`] = heightM*1e30;
		unitdata.length[`deci${name}`] = heightM/10;
		unitdata.length[`centi${name}`] = heightM/100;
		unitdata.length[`milli${name}`] = heightM/1e3;
		unitdata.length[`demi${name}`] = heightM/1e4;
		unitdata.length[`micro${name}`] = heightM/1e6;
		unitdata.length[`nano${name}`] = heightM/1e9;
		unitdata.length[`pico${name}`] = heightM/1e12;
		unitdata.length[`femto${name}`] = heightM/1e15;
		unitdata.length[`atto${name}`] = heightM/1e18;
		unitdata.length[`zepto${name}`] = heightM/1e21;
		unitdata.length[`yocto${name}`] = heightM/1e24;
		unitdata.length[`ronto${name}`] = heightM/1e27;
		unitdata.length[`quecto${name}`] = heightM/1e30;
	}
    smoot("haseul",1.56);
    smoot("smoot",1.7);
    //altuve is already in vanilla UC
    unitdata.length["distance from goiky to yoyleland"] = unitdata.length.mile * 2763;
    unitdata.length.parsec = 30856775814913673n; /*big unit consistency*/
    unitdata.length.furlong = 201.168;
    unitdata.length.kibimeter = 2**10;
    unitdata.length.mebimeter = 2**20;
    unitdata.length.gibimeter = 2**30;
    unitdata.length.tebimeter = 2**40;
    unitdata.length.pebimeter = 2**50;
    unitdata.length.exbimeter = 2**60;
    unitdata.length.zebimeter = 2**70;
    unitdata.length.yobimeter = 2**80;
    unitdata.length.robimeter = 2**90;
    unitdata.length.quebimeter = 2**100;
    unitdata.potrzebie = 0.0022633484517438173216473; //https://en.wikipedia.org/wiki/List_of_humorous_units_of_measurement#Potrzebie

    /*value scales with the length, so for an inch it would be a factor of 25.4*/
    function mmThingPressurePa(densityKgm3) {
        return densityKgm3 * 9.80665 / 1000;
    };

    unitdata.pressure["millimeter of liquid osmium"] = mmThingPressurePa(20000);
    unitdata.pressure["R74meter of liquid honey"] = mmThingPressurePa(1415) * (unitdata.length.R74meter / unitdata.length.millimeter)
    unitdata.pressure["haseul of liquid honey"] = mmThingPressurePa(1415) * (unitdata.length.haseul / unitdata.length.millimeter) /*god why*/
    unitdata.pressure["inch of liquid osmium"] = mmThingPressurePa(20000) * (unitdata.length.inch / unitdata.length.millimeter);
    unitdata.pressure["millimeter of liquid iron"] = mmThingPressurePa(6980) * (unitdata.length.inch / unitdata.length.millimeter)
    unitdata.pressure["millimeter of liquid iron"] = mmThingPressurePa(1000) * (unitdata.length.inch / unitdata.length.millimeter)
    unitdata.pressure["meter of water"] = unitdata.pressure["millimeter of water"] * 1000
    unitdata.pressure["2010 mini cooper per square inch"] = unitdata.pressure["pound per square inch"] * 2679;
    unitdata.pressure["pressure at bottom of mariana trench"] = 1086 * unitdata.pressure.bar;
    /*bugfix*/
    unitdata.pressure["inch of mercury"] = 3386.39;

    unitdata.pepper.resiniferatoxin = 16e9;
    unitdata.pepper.capsaicin = 16e6;
    unitdata.pepper["jalapeño"] = 2500;
    unitdata.pepper["spicy jalapeño"] = 8000;
    unitdata.pepper["pepper spray"] = 2e6;
    unitdata.pepper["spicy pepper spray"] = 53e5;

    function dateFunction(unitName,functionName,startTimeUnixMillis) {
        if(functionName.match(/^[A-Za-z_$][[A-Za-z0-9_$]+$/)) {
            window[functionName] = function() {
                return (Date.now() - startTimeUnixMillis)/1000;
            };
            unitdata.time[unitName] = [`X*${functionName}()`, `X/${functionName}()`]
        } else {
            throw new Error("Invalid function name for eval statements")
        }
    };
    unitdata.time["geometry dash 2.1-2.2 wait"] = (1703037584000 - 1484620440000)/1000;
    unitdata.time["everglow return of the girl hiatus"] = (1692354581000 - 1638349256000)/1000;
    dateFunction("time since blackpink's last comeback","getTimeSinceBP",1663589603633.959); //probably not exact but whatever, this value from some weird json in an archived version of Typa Girl's YT page (view-source:https://web.archive.org/web/20220921120104id_/https://www.youtube.com/watch?v=UhxW9Njqqu0) acts as an upper bound with better than day precision (would have used PV but it was a pre-release single) don't ask me why it has microsecond precision
    dateFunction("time since fortnite early access","getTimeSinceFortnite",1500670314000);
    /*revealed on 1474815605000, solo released on 1475593203000*/
    dateFunction("time since heejin debut","getTimeSinceHeejinReveal",1474815605000);
    /*loona debut on august 19, 2018 at 5:00 kst (utc+9) with the loonabirth concert, and we're losing a lot of precision now*/
    dateFunction("time since loona debut","getTimeSinceLoonabirth",1534665600000);
    /*for my personal convenience because i don't feel like making another mod just for one changing unit
    video length has millisecond precision (215.201), but reddit comments are only have second precision
    (as 1661127638.0 except that the decimal isn't used and is always .0)*/
    dateFunction("time the mod author stanned loona for","getTimeSinceAuthorIsOrbit",1661127423000);
    dateFunction("time since wjsn's last comeback","getTimeSinceLastSequence",1657011620000); //from Videos.list on https://www.youtube.com/watch?v=z0YLZmcARRU Last Sequence snippet.publishedAt

    window.getTimeSpentHere = function() {
        return (Date.now() - pageLoadTime)/1000;
    }; unitdata.time["time spent on this page"] = ['X*getTimeSpentHere()', 'X/getTimeSpentHere()'];

    unitdata.time["light-gigahaseul"] = 1560e6/299792458;
    unitdata.time["julian year"] = 31557600;
    unitdata.time["newjeans ditto perfect all-kill hours"] = 655 * unitdata.time.hour;
    unitdata.time["newjeans ditto length"] = 186; /*stated length varies from 3:05 to 3:07.454694*/
    unitdata.time["giga-annum"] = unitdata.time.year * 1000000000n;
    unitdata.time["tera-annum"] = unitdata.time.year * 1000000000000n;
    unitdata.time.kalpa = unitdata.time.year * 4320000000n;
    unitdata.time["month of brahma"] = unitdata.time.year * 259200000000n;
    unitdata.time["maha-kalpa"] = unitdata.time.year * 311040000000000n;
    unitdata.time.microfortnight = 1.2096;
    unitdata.time["lifespan of confederate states"] = unitdata.time.day * 1511; /*numerous different dates exist corresponding to various states of reduced existence/non-existence*/
    unitdata.time["everglow discography"] = 6793.388; //all file lengths summed, as of All My Girls, each rounded to the millisecond
    var IuPakBySong = { //source: https://koreansalestwt.blogspot.com/2020/04/paks-records-perfect-all-kills.html
        "Nagging": 1,
        "Good Day": 1,
        "The Story Only I Didn't Know": 1, //There is no record of Only I Didn't Know's *total* hours but we know it had at least 1 PAK-hour https://twitter.com/iu_stats/status/1312369409046896640
        "You & I": 74,
        "The Red Shoes": 2,
        "Friday": 2,
        "My Old Story": 5,
        "Leon": 136,
        "Twenty-Three": 10,
        "Through the Night": 51,
        "Can't Love You Anymore": 12,
        "Palette": 22,
        "Autumn Morning": 16,
        "Bbibbi": 3,
        "Love Poem": 55,
        "Blueming": 142,
        "Give You My Heart": 22,
        "Eight": 134,
        "Celebrity": 462,
        "Lilac": 265,
        "Strawberry Moon": 146,
        "Love Wins All": 340
    }; unitdata.time["iu total perfect all kill hours (lower bound)"] = Object.values(IuPakBySong).reduce(function(a,b) { return a+b }) * unitdata.time.hour;
    unitdata.time.clarke = unitdata.time.day; //still on Potrzebie;
    unitdata.time.mingo = unitdata.time.clarke * 10; //"
    unitdata.time.cowznofski = unitdata.time.clarke * 100; //"

    /*1,560,000,000 m / (299,792,458 m/s) = 5.20359989s; 5.20359989s * (55 J/s) = 286.197994 J*/
    unitdata.energy["light-gigahaseul-H7"] = 1560e6 / 299792458 * 55;
    /*baguette info from https://www.fatsecret.com/calories-nutrition/generic/baguette?portionid=319823&portionamount=1.000
    consistent with https://www.nutritionix.com/i/usda/french-bread-1-baguette/5759dbc95f51862d386fd92e*/
    unitdata.energy["22 inch baguette"] = 3715392;

    unitdata["energy density"] = {};
    unitdata["energy density"]["nanojoule per cubic meter"] = 1e-9;
    unitdata["energy density"]["joule per cubic millmeter"] = 1e-9;

    unitdata["energy density"]["microjoule per cubic meter"] = 1e-6;
    unitdata["energy density"]["joule per cubic hectometer"] = 1e-6;

    unitdata["energy density"]["millijoule per cubic meter"] = 1e-3;
    unitdata["energy density"]["joule per cubic decameter"] = 1e-3;

    unitdata["energy density"]["joule per cubic meter"] = 1;

    unitdata["energy density"]["kilojoule per cubic meter"] = 1e3;
    unitdata["energy density"]["joule per cubic decimeter"] = 1e3;

    unitdata["energy density"]["megajoule per cubic meter"] = 1e6;
    unitdata["energy density"]["joule per cubic centimeter"] = 1e6;

    unitdata["energy density"]["gigajoule per cubic meter"] = 1e9;
    unitdata["energy density"]["joule per cubic millimeter"] = 1e9;
    unitdata["energy density"]["megajoule per liter"] = 1e9;

    /*baguette is 324 grams and bread density is 0.22 to 0.27g/cm3
    with influence from https://www.researchgate.net/figure/Density-fibre-and-AX-contents-GI-of-French-baguette-exhibiting-different-textures_tbl1_244993580
    342 g / 0.25 g cm^-3 = 1368 cm^3
    FS stats give 10 cal in^-3; 888/10=88.8; 1 in^3 = 16.387 cm^3; 1368 cm^3 = 83.48 in^3; 83.48 in^3 is outside of rounding error but still close to 88.8 in^3
    888 kcal / 1368 cm^3 = 649.122807 cal cm^-3; 649.122807 cal cm^-3 * 4.184 J cal^-1 = 2715.92982 J cm^-3; 2715.92982 J cm^-3 * 1000000 cm^3 m^-3 = 2715929820 J m^-3;*/
    unitdata["energy density"]["baguette"] = 2715929820;
    /* https://drexel.edu/~/media/Files/greatworks/pdf_sum10/WK8_Layton_EnergyDensities.ashx#:~:text=When%20measured%20using%20the%20methods,0.5%20to%2050%20J%2Fm3. */
    unitdata["energy density"]["the sun"] = 0.0000015;
    /*crude oil has 44 MJ/kg; oil density is about 900kg/m^3;
    44 MJ kg^-1 * 900 kg m^-3 = 39600 MJ m^-3 = 39.6 GJ/m^-3*/
    unitdata["energy density"].oil = 39.6e9;
    unitdata["energy density"].uranium = 1.539842e18;
    unitdata["energy density"].tnt = 6.92;

    unitdata.area["uk gallon per mile"] = mpgToSqmUS(1);
    unitdata.area["us gallon per mile"] = mpgToSqmUK(1);
    unitdata.area["2010 mini cooper fuel economy (city)"] = mpgToSqmUS(28);
    unitdata.area["2010 mini cooper fuel economy (highway)"] = mpgToSqmUS(37);
    unitdata.area["liter per kilometer"] = 0.000001; /*equivalent to mm^2*/
    unitdata.area["earth surface area"] = 510.1e12;
    unitdata.area["square light year"] = 9460730472580800n ** 2n;
    unitdata.area["square parsec"] = 30856775814913673n ** 2n;

    unitdata.volume["minecraft ingot"] = 1/9;
    unitdata.volume["minecraft nugget"] = 1/81;
    unitdata.volume["cubic light year"] = 9460730472580800n ** 3n;
    unitdata.volume["cubic parsec"] = 30856775814913673n ** 3n;
    unitdata.volume.ngogn = 0.0000115945597121586041;
    unitdata.volume["cubic potrzebie"] = 0.0000000115945597121586041;

    unitdata.beauty["loona member"] = 2147483.647;
    unitdata.beauty["arbitrarily chosen loona member"] = 3221225.471;
    unitdata.beauty["someone's mom"] = -1;
    /*bugfix*/
    unitdata.beauty["launched ship"] = 0.001;

    window.logN = function(number,base) {
        return Math.log(number) / Math.log(base);
    };

    unitdata.temperature.felsius = ['(X-16)*5/7', '(X*7/5)+16']; //xkcd
    unitdata.temperature.fies = ['(2000*X-300)/37', '((X*37)+300)/2000'] //https://www.youtube.com/watch?v=HYx8lQofTIM
    unitdata.temperature["troll degrees"] = ['(7**(X/11.3))-273.15', 'Math.max(-30,11.3*logN(X+273.15,7))'];

    /*emergency manual fix*/
    unitdata.data.kilobyte = 1000;
    unitdata.data.kilobit = 125;
    /*content*/
    unitdata.data["~dfff1c.tmp"] = -2; /*https://scp-wiki.wikidot.com/log-of-anomalous-items*/
    unitdata.data["eicar test file"] = 68;
    unitdata.data["lena image"] = 510688;
    unitdata.data["kim lip - eclipse (4k)"] = 754121441;
    unitdata.data["average loona song"] = 7935393.510729614; /*average size of all mp3 files in Loona Archive GD's discography + Version Up*/
    unitdata.data["kelly-bootle standard unit"] = 1012;
    unitdata.data["intel kilobyte"] = 1023.937528;
    unitdata.data["baker's kilobyte"] = 1152;
    window.getDrivemakerKilobyteBytes = function() {
        return 1024-(4*(new Date().getFullYear() - 1979));
    };
    unitdata.data["drivemaker's kilobyte"] = ['X*getDrivemakerKilobyteBytes()', 'X/getDrivemakerKilobyteBytes()'];
    unitdata.data["ibm 5081 punch card"] = 100; /*800 bits*/;
    unitdata.data["ds/hd 3.5 inch floppy disk"] = 1474560;
    unitdata.data["doom.wad v1.9"] = 11159840;
    unitdata.data["sandboxels index.html"] = 517052; //as of 2023-07-18
    unitdata.data["all terraria mods"] = 8332710802; //"
    unitdata.data["average terraria mod"] = 1062303.7738; //"
    unitdata.data["calamity mod"] = 39187200; //"
    unitdata.data["frackin' universe"] = 743825840; //" and i had to download the ******* mod for this
    unitdata.data["windows api word"] = 2;
    unitdata.data["windows api dword"] = 4;
    unitdata.data["windows api qword"] = 8;
    unitdata.data["system/360 halfword"] = 2;
    unitdata.data["system/360 word"] = 4;
    unitdata.data["system/360 doubleword"] = 8;
    unitdata.data["z/architecture quadword"] = 16;
    unitdata.data["quaternary digit"] = 0.25;
    unitdata.data["octal digit"] = 0.375;
    unitdata.data["hex digit"] = 0.5;
    unitdata.data["duotrigesimal digit"] = 0.625;
    unitdata.data["tetrasexagesimal digit"] = 0.75;

    unitdata.death["2021 US motor vehicle deaths"] = 42915;
    /*
    unitdata.death["9/11"] = 2977;
    unitdata.death["Great Chinese Famine"] = 4e7;
    unitdata.death.Holodomor = 39e5;
    unitdata.death.Stalin = 95e5;
    unitdata.death["Holocaust total deaths"] = 13684448;
    unitdata.death["Holocaust Jewish deaths"] = 6e6;
    */
    unitdata.death["20th century smallpox deaths"] = 3e8;

    unitdata.voltage.lemon = 0.7;
    unitdata.voltage.battery = 1.5;
    unitdata.voltage["9-volt battery"] = 9;
    unitdata.voltage["car battery"] = 12.6;

    unitdata.weight["earth mass"] = 5.9722e27;
    unitdata.weight["sagittarius a*"] = 8.26e36;
    unitdata.weight.apple = 100;
    unitdata.weight["big apple"] = 250;
    unitdata.weight.pineapple = 1002;
    unitdata.weight.strawberry = 9;
    /*blood plum weight unknown, japanese paper suggests another ungodly wide range
     https://www.jstage.jst.go.jp/article/hrj/18/1/18_39/_pdf/-char/ja */
    unitdata.weight.manhattan = unitdata.weight["US ton"] * 125000000;
    unitdata.weight["2010 mini cooper curb weight"] = 2679 * (unitdata.weight.pound / unitdata.weight.kilogram) * 1000; /*varies wildly*/
    var goldDensityKgM3 = 19300;
    unitdata.weight["gold nugget"] = goldDensityKgM3 / 81 * 1000;
    unitdata.weight["gold ingot"] = goldDensityKgM3 / 9 * 1000;
    unitdata.weight["gold apple"] = (unitdata.weight["gold ingot"] * 8) + unitdata.weight.apple;
    unitdata.weight["gold block"] = goldDensityKgM3 * 1000;
    unitdata.weight["enchanted golden apple"] = (unitdata.weight["gold block"] * 8) + unitdata.weight.apple;
    var ironDensityKgM3 = 7874;
    unitdata.weight["iron block"] = ironDensityKgM3;
    unitdata.weight["iron ingot"] = ironDensityKgM3 / 9;
    unitdata.weight["iron nugget"] = ironDensityKgM3 / 81;
    unitdata.weight["$10,000 usd"] = 100;
    unitdata.weight["cm^3 of iron"] = 7.874;
    unitdata.weight["cm^3 of gold"] = 19.3;
    unitdata.weight["cm^3 of sand"] = 1.6;
    unitdata.weight["cm^3 of mean basalt"] = 2.949;
    unitdata.weight["cm^3 of mean gabbro"] = 2.957;
    unitdata.weight["cm^3 of mean granite"] = 2.75;
    var cm3_in_ft3 = 28316.8;
    unitdata.weight["ft^3 of iron"] = 7.874 * cm3_in_ft3;
    unitdata.weight["ft^3 of gold"] = 19.3 * cm3_in_ft3;
    unitdata.weight["ft^3 of sand"] = 1.6 * cm3_in_ft3;
    unitdata.weight["ft^3 of mean basalt"] = 2.949 * cm3_in_ft3;
    unitdata.weight["ft^3 of mean gabbro"] = 2.957 * cm3_in_ft3;
    unitdata.weight["ft^3 of mean granite"] = 2.75 * cm3_in_ft3;
    var cm3_in_m3 = 1e6;
    unitdata.weight["sand block"] = 1.6 * cm3_in_m3;
    unitdata.weight["basalt block"] = 2.949 * cm3_in_m3;
    unitdata.weight["stone block"] = 2.957 * cm3_in_m3;
    unitdata.weight["granite block"] = 2.75 * cm3_in_m3;
    var cm3_in_km3 = 1e15;
    unitdata.weight["km^3 of sand"] = 1.6 * cm3_in_km3;
    unitdata.weight["km^3 of mean basalt"] = 2.949 * cm3_in_km3;
    unitdata.weight["km^3 of mean gabbro"] = 2.957 * cm3_in_km3;
    unitdata.weight["km^3 of mean granite"] = 2.75 * cm3_in_km3;
    var cm3_in_mi3 = 4168000000000000;
    unitdata.weight["mi^3 of sand"] = 1.6 * cm3_in_mi3;
    unitdata.weight["mi^3 of mean basalt"] = 2.949 * cm3_in_mi3;
    unitdata.weight["mi^3 of mean gabbro"] = 2.957 * cm3_in_mi3;
    unitdata.weight["mi^3 of mean granite"] = 2.75 * cm3_in_mi3;
    unitdata.weight.blintz = 36.43131601793834974563; //given specific g. of 3.1416 / water density at 4*c of 0.9998395 = 3.14210430774139249349 g/cm3; that density times 1 ngogn (1000 cubic potrzebies or 0.0000115945597121586041 m^3, or 11.5945597121586041 cm^3) = 36.43131601793834974563 g

    unitdata.number["n-illion (short scale)"] = ["10**(3*X + 3)","(Math.log10(X)-3)/3"];
    unitdata.number["n-illion (long scale)"] = ["10**(6*X)","(Math.log10(X))/6"];
    unitdata.number["minecraft inventory"] = 2368;
    unitdata.number["minecraft double chest"] = 3456;
    unitdata.number["minecraft full shulker box chest"] = 27*64*27;
    unitdata.number["minecraft full shulker box double chest"] = 54*64*27;
    unitdata.number.octad = 1e8;
    /*fix typo*/
    unitdata.number.myriad = 1e4;
    delete unitdata.number.myrid;

    unitdata.speed ??= {};
    unitdata.speed["meter per second"] ??= 1;
    unitdata.speed["meter per minute"] ??= 1/60;
    unitdata.speed["meter per hour"] ??= 1/3600;
    unitdata.speed["meter per day"] ??= 1/86400;
    unitdata.speed["kilometer per second"] ??= 1000;
    unitdata.speed["kilometer per minute"] ??= 1000/60;
    unitdata.speed["kilometer per hour"] ??= 1000/3600;
    unitdata.speed["kilometer per day"] ??= 1000/86400;
    unitdata.speed["foot per second"] ??= 0.3048;
    unitdata.speed["foot per minute"] ??= 0.3048/60;
    unitdata.speed["foot per hour"] ??= 0.3048/3600;
    unitdata.speed["foot per day"] ??= 0.3048/86400;
    unitdata.speed["inch per second"] ??= 0.0254;
    unitdata.speed["inch per minute"] ??= 0.0254/60;
    unitdata.speed["inch per hour"] ??= 0.0254/3600;
    unitdata.speed["inch per day"] ??= 0.0254/86400;
    unitdata.speed["mile per second"] ??= 1609.344;
    unitdata.speed["mile per minute"] ??= 26.8224;
    unitdata.speed["mile per hour"] ??= 0.44704;
    var mph = unitdata.speed["mile per hour"];
    var kph = unitdata.speed["kilometer per hour"];
    unitdata.speed["mile per day"] ??= 0.44704/24;
    unitdata.speed["furlong per fortnight"] ??= 201.168 / (86400 * 14);
    unitdata.speed["furlong per day"] ??= 201.168 / 86400;
    unitdata.speed.knot = 1852/3600;
    unitdata.speed["speed of sound in air (20c)"] ??= 343;
    unitdata.speed["speed of light"] ??= 299792458;
    unitdata.speed["operation plumbbob bore cap"] = 125000 * mph;
    unitdata.speed["earth escape velocity"] = 11186;
    unitdata.speed["jupiter escape velocity"] = 59500;
    unitdata.speed["solar escape velocity"] = 617500;
    unitdata.speed["lunar escape velocity"] = 2380;
    unitdata.speed["space shuttle orbital speed"] = 28000 * kph;
    unitdata.speed.ThrustSSC = 341;
    unitdata.speed["continental drift"] = 0.025/31557600;
    unitdata.speed.snail = 0.03*mph;
    unitdata.speed.walking = 1.42;
    unitdata.speed.running = 6*mph;
    unitdata.speed.sprinting = 14.2*mph; /*https://marathonhandbook.com/average-human-sprint-speed/*/
    unitdata.speed["fast sprinting"] = 18.23*mph;
    unitdata.speed["usain bolt"] = 27.78*mph;
    unitdata.speed["florence griffith-joyner"] = 100 / 10.49;
    unitdata.speed["peregrine falcon (flight)"] = 30*mph;
    unitdata.speed["peregrine falcon (dive)"] = 240*mph;
    unitdata.speed["cheetah (top speed)"] = 115*kph;
    unitdata.speed["cheetah (normal)"] = 40*mph;
    unitdata.speed["titanic impact speed"] = 20.5 * 1852/3600;
    unitdata.speed["musket ball"] = 450;
    unitdata.speed["ak-47 round"] = 710;
    unitdata.speed["human terminal velocity (flat)"] = 200;
    unitdata.speed["human terminal velocity (diving)"] = 270;
    unitdata.speed["plane takeoff"] = 180*mph;
    unitdata.speed["plane cruising"] = 500*1852/3600;
    unitdata.speed["2010 mini cooper top speed"] = 126*mph;
    unitdata.speed["1940s vw beetle top speed"] = 60*mph;
    unitdata.speed["1950s vw beetle top speed"] = 71*mph;
    unitdata.speed["1970s vw beetle top speed"] = 82*mph;
    unitdata.speed["a5 vw beetle top speed"] = 120*mph;
    unitdata.speed["lsr vw beetle top speed"] = 205*mph;
    unitdata.speed["lamborghini huracan top speed"] = 202*mph;

    /*generate metric units for D/A/V*/
    var metricPrefixes = {quecto: -30, ronto: -27, yocto: -24, zepto: -21, atto: -18, femto: -15, pico: -12, nano: -9, micro: -6, dimi: -4, milli: -3, centi: -2, deci: -1, "": 0, deca: 1, hecto: 2, kilo: 3, myria: 4, mega: 6, giga: 9, tera: 12, peta: 15, exa: 18, zetta: 21, yotta: 24, ronna: 27, quetta: 30};

    /*derivative*/
    unitdata.hypervolume = {};

    for(var prefix in metricPrefixes) {
        var exponent = metricPrefixes[prefix];
        var dimensionalTypes = [["length", ""], ["area","square "], ["volume","cubic "], ["hypervolume","quartic "]];
        for(var q = 0; q < dimensionalTypes.length; q++) {
            var typeData = dimensionalTypes[q];
            var type = typeData[0];
            var typePrefix = typeData[1];
            var exponentMultiplier = q + 1;

            var newUnitNameM = `${typePrefix}${prefix}meter`;
            var newUnitValueM = Number(`1e${exponent*exponentMultiplier}`);
            unitdata[type][newUnitNameM] = newUnitValueM;

            var newUnitNameP = `${typePrefix}${prefix}parsec`;
            var newUnitValueP = exponent >= 0 ? (30856775814913673n * (10n**BigInt(exponent))) ** BigInt(exponentMultiplier) : (30856775814913673 * (10**exponent)) ** exponentMultiplier;
            unitdata[type][newUnitNameP] = newUnitValueP;
        };
    };

    /*general metricizer*/
    for(var prefixAgain in metricPrefixes) {
        var exponentAgain = metricPrefixes[prefixAgain];
        var units = [["data","byte",1],["data","bit",0.125],/*["energy","gram of TNT",4184],["energy","gram of coal",29307.6],["energy","gram of uranium",79496000],*/["speed","knot",1852/3600]];
        for(var s = 0; s < units.length; s++) {
            var typeAgain = units[s][0];
            var baseUnit = units[s][1];
            var baseValue = units[s][2] ?? 1;
            var newName = prefixAgain + baseUnit;
            if(typeAgain == "data" && exponentAgain < 0) { //attobits are useless
                continue
            };
            if(!Number.isInteger(baseUnit) || exponentAgain < 0) {
                unitdata[typeAgain][newName] ??= baseValue * (10 ** exponentAgain);
            } else {
                unitdata[typeAgain][newName] = (exponentAgain >= 0 && Number.isInteger(baseValue)) ? BigInt(baseValue) * (10n ** BigInt(exponentAgain)) : baseValue * (10 ** exponentAgain);
            };
        };
    };

    /*binary data units*/
    var binaryPrefixes = ["kibi", "mebi", "gibi", "tebi", "pebi", "exbi", "zebi", "yobi", "robi", "quebi"];
    for(var prefixIndex = 0; prefixIndex < binaryPrefixes.length; prefixIndex++) {
        unitdata.data[binaryPrefixes[prefixIndex] + "byte"] = 1024n ** BigInt(prefixIndex + 1);
        /*Object.defineProperty( unitdata.data, binaryPrefixes[prefixIndex], { value: exponentBinary, writable: false, enumerable: true, configurable: true } );
        console.log(exponentBinary);*/
        unitdata.data[binaryPrefixes[prefixIndex] + "bit"] = (1024n ** BigInt(prefixIndex + 1)) / 8n;
    };

    function idb(num) {
        if(typeof(num) == "bigint") {
            return "bigint";
        } else {
            return Number.isInteger(num) ? "integer" : "decimal";
        };
    };

    function multiplyWithUnknownBigint(n1,n2) {
        if(n1 == undefined || n2 == undefined) {
            throw new Error(`Undefined values: n1: ${n1 == undefined}, n2: ${n2 == undefined}`);
        };
        if(typeof(n1) == "bigint" && typeof(n2) == "bigint") {
            return n1 * n2;
        } else {
            var t1 = idb(n1);
            var t2 = idb(n2);
            if(t1 == "decimal" && t2 == "decimal") {
                return n1 * n2;
            };
            if(t1 == "integer" && t2 == "integer") {
                return n1 * n2;
            };
            if(t1 == "bigint") {
                n1 = Number(n1);
            };
            if(t2 == "bigint") {
                n2 = Number(n2);
            };
            return n1 * n2;
        };
    };

    unitdata.power["hella h7 bulb"] = 55;
    unitdata.power["base 2010 mini cooper"] = 118 * unitdata.power.horsepower;

    unitdata.energy.erg = 1e-7;
    unitdata.energy["kilogram mass-energy"] = 89875517873681764n;
    unitdata.energy["gram of TNT"] = 4184;
    unitdata.energy["kilogram of TNT"] = 4184e3;
    unitdata.energy["ton of TNT"] = 4184e6;
    unitdata.energy["kiloton of TNT"] = 4184e9;
    unitdata.energy["megaton of TNT"] = 4184e12;
    var Kt = unitdata.energy["kiloton of TNT"];
    unitdata.energy["little boy"] = multiplyWithUnknownBigint(15n,Kt);
    unitdata.energy["fat man"] = multiplyWithUnknownBigint(21n,Kt)
    unitdata.energy["tsar bomba"] = multiplyWithUnknownBigint(50000n,Kt);
    unitdata.energy["krakatoa eruption"] = multiplyWithUnknownBigint(200000n,Kt);
    unitdata.energy["chicxulub impact"] = multiplyWithUnknownBigint(72000000n,Kt);
    unitdata.energy.supernova = 10n**44n;
    unitdata.energy["solar mass-energy"] = 17877e43;

    /*derived unit for the mass of an amount of TNT that would release as much energy as a Hella H7 standard halogen bulb would use in the time that it takes light to travel 1 billion times LOONA Haseul's height
    from where light-gigahaseul-h7 is defined: 1,560,000,000 m / (299,792,458 m/s) = 5.20359989s; 5.20359989s * (55 J/s) = 286.197994 J
    286.197994J * (0.00023900573614 g/J) / 68.4029622mg*/
    unitdata.weight["tnt-light-giga-haseul-H7"] = unitdata.energy["light-gigahaseul-H7"] / unitdata.energy["gram of TNT"];

    unitdata.viscosity ??= {};
    unitdata.viscosity.petapoise = 1e15;
    unitdata.viscosity.terapoise = 1e12;
    unitdata.viscosity.gigapoise = 1e9;
    unitdata.viscosity.megapoise = 1e6;
    unitdata.viscosity.kilopoise = 1e3;
    unitdata.viscosity.hectopoise = 100;
    unitdata.viscosity.decapoise = 10;
    unitdata.viscosity.poise = 1;
    unitdata.viscosity.decipoise = 0.1;
    unitdata.viscosity.centipoise = 0.01;
    unitdata.viscosity.millipoise = 0.001;
    unitdata.viscosity["nanobar-second"] = 0.001;
    unitdata.viscosity["nmHg-second (SI)"] = 0.00133322;
    unitdata.viscosity["microtorr-second"] = 101325 / 760 / 100000;
    unitdata.viscosity["millipascal-second"] = 0.01;
    unitdata.viscosity["centipascal-second"] = 0.1;
    unitdata.viscosity["decipascal-second"] = 1;
    unitdata.viscosity["microbar-second"] = 1;
    unitdata.viscosity["gram per centimeter-second"] = 1;
    unitdata.viscosity["µmHg-second (SI)"] = 1.33322;
    unitdata.viscosity["millitorr-second"] = 101325 / 760 / 100;
    unitdata.viscosity["pascal-second"] = 10;
    unitdata.viscosity["decapascal-second"] = 100;
    unitdata.viscosity["gram per meter-second"] = 100;
    unitdata.viscosity["hectopascal-second"] = 1e3;
    unitdata.viscosity["millibar-second"] = 1e3;
    unitdata.viscosity["mmHg-second (SI)"] = 1333.22;
    unitdata.viscosity["torr-second"] = 101325 / 760 * 10;
    unitdata.viscosity["kilopascal-second"] = 1e4;
    unitdata.viscosity["centibar-second"] = 1e4;
    unitdata.viscosity["decibar-second"] = 1e5;
    unitdata.viscosity["kilogram per meter-second"] = 1e5;
    unitdata.viscosity["bar-second"] = 1e6;
    unitdata.viscosity["atmosphere-second"] = 1013250;
    unitdata.viscosity["megapascal-second"] = 1e7;
    unitdata.viscosity["gigapascal-second"] = 1e10;
    unitdata.viscosity["terapascal-second"] = 1e13;
    unitdata.viscosity["petapascal-second"] = 1e16;

    unitdata.concentration ??= {}; //1 = 100%
    unitdata.concentration.uno = 1; //https://en.wikipedia.org/wiki/Parts-per_notation
    unitdata.concentration.half = 1/2;
    unitdata.concentration.third = 1/3;
    unitdata.concentration.fourth = 1/4;
    unitdata.concentration.fifth = 1/5;
    unitdata.concentration.sixth = 1/6;
    unitdata.concentration.seventh = 1/7;
    unitdata.concentration.eighth = 1/8;
    unitdata.concentration.ninth = 1/9;
    unitdata.concentration.tenth = 0.1;
    unitdata.concentration.twentieth = 0.05;
    unitdata.concentration.percent = 1e-2;
    unitdata.concentration["specific gravity proof"] = 0.005715;
    unitdata.concentration["US proof"] = 0.005;
    unitdata.concentration["per mille"] = 1e-3;
    unitdata.concentration["part per thousand"] = 1e-3;
    unitdata.concentration["per myriad"] = 1e-4;
    unitdata.concentration["per cent mille"] = 1e-5;
    unitdata.concentration["part per million"] = 1e-6;
    unitdata.concentration["mg/kg"] = 1e-6;
    unitdata.concentration["part per billion"] = 1e-9;
    unitdata.concentration["µg/kg"] = 1e-9;
    unitdata.concentration["part per trillion"] = 1e-12;
    unitdata.concentration["ng/kg"] = 1e-12;
    unitdata.concentration["part per quadrillion"] = 1e-15;

    /*Create missing options for type dropdown*/
    var accessibleOptions = Array.from(document.getElementById("TypeSelect").options).map(optionElement => optionElement.getAttribute("value"));
    var allOptions = Object.keys(unitdata);
    var missingOptions = allOptions.filter(function(opt) { return opt && !(accessibleOptions.includes(opt)) && Object.keys(unitdata[opt]).length > 0 });
    for(var jeonheejinthefirstmemberofloona = 0; jeonheejinthefirstmemberofloona < missingOptions.length; jeonheejinthefirstmemberofloona++) {
        var optionValue = missingOptions[jeonheejinthefirstmemberofloona];
        var newOption = document.createElement("option");
        newOption.setAttribute("value",optionValue);
        var spacedName = optionValue.replaceAll("-"," ");
        newOption.innerText = spacedName[0].toUpperCase() + spacedName.slice(1);
        document.getElementById("TypeSelect").appendChild(newOption);
    };

    /*force lists to update (this is horrible but i got errors trying to make it not update on every selection)*/
    document.getElementById("TypeSelect").onchange = function() {
        selectType(this);
        rebuildAndResetLists(getCurrentType());
        /*var sortButtons = Array.from(document.querySelector('[name="sortbtn"]').parentElement.childNodes);
        var selectedButton = sortButtons.filter(function(node) { return node.tagName?.toLowerCase() == "input" && node.getAttribute("selected") != null });
        if(selectedButton.length > 0) {
            selectedButton[0].onclick()
        }*/
    }

})();