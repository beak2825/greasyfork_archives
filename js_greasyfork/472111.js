// ==UserScript==
// @name         EpicGamesDB Price Helper
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Show converted price in EpicGamesDB
// @author       You
// @match        https://epicgamesdb.info/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=epicgamesdb.info
// @grant        none
// @license      GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/472111/EpicGamesDB%20Price%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/472111/EpicGamesDB%20Price%20Helper.meta.js
// ==/UserScript==

const GetCurrencyRateMap = async (base_country) => {
    let response = await fetch(`https://api.exchangerate-api.com/v4/latest/${base_country}`);
    return (await response.json()).rates;
};

const GetConvertedRate = (rate_map, target_country) => {
    return rate_map[target_country];
};

const ConvertCountryCodeToCurrencyCode = (country_code) => {
    const code_map = {
        AD: "EUR",
        AE: "AED",
        AF: "AFN",
        AG: "XCD",
        AI: "XCD",
        AL: "ALL",
        AM: "AMD",
        AN: "ANG",
        AO: "AOA",
        AQ: "USD",
        AR: "USD",
        AS: "USD",
        AT: "EUR",
        AU: "AUD",
        AW: "AWG",
        AX: "EUR",
        AZ: "AZN",
        BA: "BAM",
        BB: "BBD",
        BD: "BDT",
        BE: "EUR",
        BF: "XOF",
        BG: "BGN",
        BH: "BHD",
        BI: "BIF",
        BJ: "XOF",
        BL: "EUR",
        BM: "BMD",
        BN: "BND",
        BO: "USD",
        BQ: "USD",
        BR: "BRL",
        BS: "BSD",
        BT: "BTN",
        BV: "NOK",
        BW: "BWP",
        BY: "BYN",
        BZ: "BZD",
        CA: "CAD",
        CC: "AUD",
        CD: "CDF",
        CF: "XAF",
        CG: "CDF",
        CH: "CHF",
        CI: "XOF",
        CK: "NZD",
        CL: "CLP",
        CM: "XAF",
        CN: "CNY",
        CO: "COP",
        CR: "CRC",
        CU: "CUC",
        CV: "CVE",
        CW: "ANG",
        CX: "AUD",
        CY: "EUR",
        CZ: "CZK",
        DE: "EUR",
        DJ: "DJF",
        DK: "DKK",
        DM: "DOP",
        DO: "DOP",
        DZ: "DZD",
        EC: "USD",
        EE: "EUR",
        EG: "USD",
        EH: "MAD",
        ER: "ERN",
        ES: "EUR",
        ET: "ETB",
        FI: "EUR",
        FJ: "FJD",
        FK: "FKP",
        FM: "USD",
        FO: "DKK",
        FR: "EUR",
        GA: "XAF",
        GB: "GBP",
        GD: "XCD",
        GE: "USD",
        GF: "EUR",
        GG: "GBP",
        GH: "GHS",
        GI: "GIP",
        GL: "DKK",
        GM: "GMD",
        GN: "GNF",
        GP: "EUR",
        GQ: "XAF",
        GR: "EUR",
        GS: "GEL",
        GT: "GTQ",
        GU: "USD",
        GW: "XOF",
        GY: "GYD",
        HK: "HKD",
        HM: "AUD",
        HN: "HNL",
        HR: "EUR",
        HT: "HTG",
        HU: "HUF",
        ID: "IDR",
        IE: "EUR",
        IL: "ILS",
        IM: "GBP",
        IN: "INR",
        IO: "USD",
        IQ: "IQD",
        IR: "IRR",
        IS: "ISK",
        IT: "EUR",
        JE: "GBP",
        JM: "JMD",
        JO: "JOD",
        JP: "JPY",
        KE: "KES",
        KG: "KGS",
        KH: "KHR",
        KI: "AUD",
        KM: "KMF",
        KN: "XCD",
        KP: "KPW",
        KR: "KRW",
        KW: "KWD",
        KY: "KYD",
        KZ: "KZT",
        LA: "LAK",
        LB: "LBP",
        LC: "XCD",
        LI: "CHF",
        LK: "LKR",
        LR: "LRD",
        LS: "LSL",
        LT: "EUR",
        LU: "EUR",
        LV: "EUR",
        LY: "LYD",
        MA: "MAD",
        MC: "EUR",
        MD: "MDL",
        ME: "EUR",
        MF: "EUR",
        MG: "MGA",
        MH: "USD",
        MK: "MKD",
        ML: "XOF",
        MM: "MMK",
        MN: "MNT",
        MO: "MOP",
        MP: "USD",
        MQ: "EUR",
        MR: "MRU",
        MS: "XCD",
        MT: "EUR",
        MU: "MUR",
        MV: "MVR",
        MW: "MWK",
        MX: "MXN",
        MY: "MYR",
        MZ: "MZN",
        NA: "NAD",
        NC: "XPF",
        NE: "NGN",
        NF: "AUD",
        NG: "NGN",
        NI: "NIO",
        NL: "EUR",
        NO: "NOK",
        NP: "NPR",
        NR: "AUD",
        NU: "NZD",
        NZ: "NZD",
        OM: "OMR",
        PA: "PAB",
        PE: "PEN",
        PF: "XPF",
        PG: "PGK",
        PH: "PHP",
        PK: "PKR",
        PL: "PLN",
        PM: "EUR",
        PN: "NZD",
        PR: "USD",
        PS: "ILS",
        PT: "EUR",
        PW: "USD",
        PY: "PYG",
        QA: "QAR",
        RE: "EUR",
        RO: "RON",
        RS: "RSD",
        RU: "RUB",
        RW: "RWF",
        SA: "SAR",
        SB: "SBD",
        SC: "SCR",
        SD: "SDG",
        SE: "SEK",
        SG: "SGD",
        SH: "SHP",
        SI: "EUR",
        SJ: "NOK",
        SK: "EUR",
        SL: "SLL",
        SM: "EUR",
        SN: "XOF",
        SO: "SOS",
        SR: "SRD",
        SS: "SSP",
        ST: "STN",
        SV: "SVC",
        SX: "ANG",
        SY: "SYP",
        SZ: "SZL",
        TC: "USD",
        TD: "XAF",
        TF: "EUR",
        TG: "XOF",
        TH: "THB",
        TJ: "TJS",
        TK: "NZD",
        TL: "USD",
        TM: "TMT",
        TN: "TND",
        TO: "TOP",
        TR: "TRY",
        TT: "TTD",
        TV: "AUD",
        TW: "TWD",
        TZ: "TZS",
        UA: "UAH",
        UG: "UGX",
        UM: "USD",
        US: "USD",
        UY: "UYU",
        UZ: "UZS",
        VA: "EUR",
        VC: "XCD",
        VE: "VES",
        VG: "USD",
        VI: "USD",
        VN: "VND",
        VU: "VUV",
        WF: "XPF",
        WS: "USD",
        YE: "YER",
        YT: "EUR",
        ZA: "ZAR",
        ZM: "ZMW",
        ZW: "ZWL"
      };
    return code_map[country_code];
};

const GetCurrentCountryCode = () => {
    return document.cookie.split(";").filter((item) => item.includes("countryCode"))[0].split("=")[1];
};

const GetCountryPriceElements = () => {
    return document.querySelectorAll("#__next > div > div.container.mt-3 > div > div.flex-grow-1 > table > tbody > tr");
};

const GetCountryCodeFromElement = (element) => {
    return element.querySelector("td:nth-child(1) > span").innerText;
};

const GetPriceFromElement = (element) => {
    return parseFloat(
        element
        .querySelector("td:nth-child(2)")
        .innerText
        .match(/(?:\d{1,3},)*\d{1,3}(?:\.\d+)?/)[0]
        .replace(/,/g, '')
    );
};

const AddConvertedPriceToElement = (element, formatted_content) => {
    let converted_price_element = document.createElement("td");
    converted_price_element.innerText = formatted_content;
    element.appendChild(converted_price_element);
};

const main = async () => {
    let current_country_code = "US";
    try
    {
        current_country_code = GetCurrentCountryCode();
    }
    catch (error)
    {
        console.info("Failed to get current country code, use US as default");
    }
    let current_currency_code = ConvertCountryCodeToCurrencyCode(current_country_code);
    let rate_map = await GetCurrencyRateMap(current_currency_code);

    let elements = GetCountryPriceElements();
    let rows = Array.from(
        elements,
        element => {
            let locale_country_code = GetCountryCodeFromElement(element);
            let locale_currency_code = ConvertCountryCodeToCurrencyCode(locale_country_code);
            let locale_price = GetPriceFromElement(element);
            let converted_rate = GetConvertedRate(rate_map, locale_currency_code);
            let converted_price = (locale_price / converted_rate).toFixed(2);
            AddConvertedPriceToElement(element, `${current_currency_code} ${converted_price}`);
            element.converted_price = converted_price;
            return element;
        }
    );
    rows.sort(
        (a, b) => {
            return a.converted_price - b.converted_price;
        }
    );
    let table = document.querySelector("table tbody");
    rows.forEach(row => table.appendChild(row));

    let header_element = document.querySelector("#__next > div > div.container.mt-3 > div > div.flex-grow-1 > table > thead > tr");
    let converted_price_header_element = document.createElement("th");
    converted_price_header_element.innerText = "Converted Price";
    header_element.appendChild(converted_price_header_element);
};
main();