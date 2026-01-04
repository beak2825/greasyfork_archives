// ==UserScript==
// @name        Bitcoindata extension
// @namespace   Violentmonkey Scripts
// @match       *://*.bitcointalk.org/index.php?action=post*
// @match       *://*.altcoinstalks.com/index.php?action=post*
// @grant       none
// @version     0.2
// @author      bitmover
// @license     MIT
// @description A web browser extension that provides additional features to bitcointalk.org and altcoinstalks.com, such as price image, address balance, transaction details.
// @downloadURL https://update.greasyfork.org/scripts/488031/Bitcoindata%20extension.user.js
// @updateURL https://update.greasyfork.org/scripts/488031/Bitcoindata%20extension.meta.js
// ==/UserScript==

const newButtonsWrap = document.createElement("div");
newButtonsWrap.style.margin = '0px 0px 5px 0px';

const textArea = document.querySelector("textarea");
const parentElement = textArea.parentNode;
parentElement.insertBefore(newButtonsWrap, textArea);

const bitcoinAPI = [
    {
        name: '\u20BF Price',
        description: 'Bitcoin Price',
        url: '[url=https://bitcoindata.science/bitcointalk-api.html#local-price][img height=16]https://bitcoindata.science/api/localprice.php?coin=bitcoin&amount=1'
    },
    {
        name: 'Fiat Price',
        description: 'Fiat currency price in bitcoin',
        url: '[url=https://bitcoindata.science/bitcointalk-api.html#fiattobtc][img height=16]https://bitcoindata.science/api/fiattobtc.php?fiatamount=10'
    },
    {
        name: 'Address Balance',
        description: 'Balance of any bitcoin address',
        url: '[url=https://bitcoindata.science/bitcointalk-api.html#address-balance][img height=16]https://bitcoindata.science/api/addressbalance.php?address=***YOUR_ADDRESS***'
    },
    {
        name: 'Transaction',
        description: 'Details of a bitcoin transaction',
        url: '[url=https://bitcoindata.science/bitcointalk-api.html#transaction][img]https://bitcoindata.science/api/transaction.php?id=***TRANSACTION_ID***'
    },
    {
        name: 'Fees',
        description: 'Recommended Fees',
        url: '[url=https://bitcoindata.science/bitcointalk-api.html#bitcoin-fees][img height=100]https://bitcoindata.science/api/bitcoinfees.php?'
    },
];


// imported bitcointalk functions
// Remember the current position.
function storeCaret(text) {
    // Only bother if it will be useful.
    if (typeof (text.createTextRange) != "undefined")
        text.caretPos = document.selection.createRange().duplicate();
}

// Replaces the currently selected text with the passed text.
function replaceText(text, textarea) {
    // Attempt to create a text range (IE).
    if (typeof (textarea.caretPos) != "undefined" && textarea.createTextRange) {
        var caretPos = textarea.caretPos;

        caretPos.text = caretPos.text.charAt(caretPos.text.length - 1) == ' ' ? text + ' ' : text;
        caretPos.select();
    }
    // Mozilla text range replace.
    else if (typeof (textarea.selectionStart) != "undefined") {
        var begin = textarea.value.substr(0, textarea.selectionStart);
        var end = textarea.value.substr(textarea.selectionEnd);
        var scrollPos = textarea.scrollTop;

        textarea.value = begin + text + end;

        if (textarea.setSelectionRange) {
            textarea.focus();
            textarea.setSelectionRange(begin.length + text.length, begin.length + text.length);
        }
        textarea.scrollTop = scrollPos;
    }
    // Just put it on the end.
    else {
        textarea.value += text;
        textarea.focus(textarea.value.length - 1);
    }
}

function addImage(imgURL) {
    replaceText(imgURL + '&currency='+ selectElement.value +'&hex='+ colorInput.value.substring(1) + (boldCheckbox.checked === true ? '&bold' : '' ) + '[/img][/url]', document.forms.postmodify.message);
}

bitcoinAPI.forEach(i => {
    const button = document.createElement('input');
    button.type = 'button';
    button.style.margin = '1px 2px 1px 1px';
    button.name = i.name;
    button.alt = i.name;
    button.title = i.description;
    button.value = i.name;
    button.tabIndex = 4;
    button.onclick = () => addImage(i.url);
    newButtonsWrap.appendChild(button);
});

// customization area
const verticalLine = document.createElement('span');
verticalLine.style.borderRight = '1px solid #888';
verticalLine.style.margin = '0px 3px';
newButtonsWrap.appendChild(verticalLine);

// bold
const label = document.createElement('label');
label.htmlFor = 'bold';
label.style.margin = '1px 2px 1px 1px';
label.innerHTML = '<small>Bold:</small>';
newButtonsWrap.appendChild(label);
const boldCheckbox = document.createElement('input');
boldCheckbox.type = 'checkbox';
boldCheckbox.value = '';
boldCheckbox.style.margin = '1px 5px 1px 1px';
boldCheckbox.id = 'bold';
newButtonsWrap.appendChild(boldCheckbox);

const currencyCodes = ["AED",
    "AFN",
    "ALL",
    "AMD",
    "ANG",
    "AOA",
    "ARS",
    "AUD",
    "AWG",
    "AZN",
    "BAM",
    "BBD",
    "BDT",
    "BGN",
    "BHD",
    "BIF",
    "BMD",
    "BND",
    "BOB",
    "BRL",
    "BSD",
    "BTC",
    "BTN",
    "BWP",
    "BYN",
    "BYR",
    "BZD",
    "CAD",
    "CDF",
    "CHF",
    "CLF",
    "CLP",
    "CNY",
    "COP",
    "CRC",
    "CUC",
    "CUP",
    "CVE",
    "CZK",
    "DJF",
    "DKK",
    "DOP",
    "DZD",
    "EGP",
    "ERN",
    "ETB",
    "EUR",
    "FJD",
    "FKP",
    "GBP",
    "GEL",
    "GGP",
    "GHS",
    "GIP",
    "GMD",
    "GNF",
    "GTQ",
    "GYD",
    "HKD",
    "HNL",
    "HRK",
    "HTG",
    "HUF",
    "IDR",
    "ILS",
    "IMP",
    "INR",
    "IQD",
    "IRR",
    "ISK",
    "JEP",
    "JMD",
    "JOD",
    "JPY",
    "KES",
    "KGS",
    "KHR",
    "KMF",
    "KPW",
    "KRW",
    "KWD",
    "KYD",
    "KZT",
    "LAK",
    "LBP",
    "LKR",
    "LRD",
    "LSL",
    "LTL",
    "LVL",
    "LYD",
    "MAD",
    "MDL",
    "MGA",
    "MKD",
    "MMK",
    "MNT",
    "MOP",
    "MRU",
    "MUR",
    "MVR",
    "MWK",
    "MXN",
    "MYR",
    "MZN",
    "NAD",
    "NGN",
    "NIO",
    "NOK",
    "NPR",
    "NZD",
    "OMR",
    "PAB",
    "PEN",
    "PGK",
    "PHP",
    "PKR",
    "PLN",
    "PYG",
    "QAR",
    "RON",
    "RSD",
    "RUB",
    "RWF",
    "SAR",
    "SBD",
    "SCR",
    "SDG",
    "SEK",
    "SGD",
    "SHP",
    "SLE",
    "SLL",
    "SOS",
    "SRD",
    "STD",
    "SVC",
    "SYP",
    "SZL",
    "THB",
    "TJS",
    "TMT",
    "TND",
    "TOP",
    "TRY",
    "TTD",
    "TWD",
    "TZS",
    "UAH",
    "UGX",
    "USD",
    "UYU",
    "UZS",
    "VEF",
    "VES",
    "VND",
    "VUV",
    "WST",
    "XAF",
    "XAG",
    "XAU",
    "XCD",
    "XDR",
    "XOF",
    "XPF",
    "YER",
    "ZAR",
    "ZMK",
    "ZMW",
    "ZWL"
];

const currencyText = document.createElement('small');
currencyText.innerText = 'Fiat:'
currencyText.style.margin = '1px 2px 1px 1px';
newButtonsWrap.appendChild(currencyText);
const selectElement = document.createElement('select');
selectElement.id = 'selectCurrency';
selectElement.onchange = '';

currencyCodes.forEach(code => {
    const option = document.createElement("option");
    option.value = code;
    (code === 'USD') ? option.selected = true : '';
    option.textContent = code;
    selectElement.appendChild(option);
});
newButtonsWrap.appendChild(selectElement);

const hexText = document.createElement('small');
hexText.innerText = ' Color:'
hexText.style.margin = '1px 4px 1px 1px';
newButtonsWrap.appendChild(hexText);
const colorInput = document.createElement("input");
colorInput.setAttribute("type", "color");
colorInput.id = 'hexSelector';
colorInput.style = 'width: 30px; height:20px; padding: 1px; margin:1px 2px 1px 1px;position: absolute;';
newButtonsWrap.appendChild(colorInput);