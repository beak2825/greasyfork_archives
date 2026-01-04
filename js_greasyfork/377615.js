// ==UserScript==
// @name         WhatsApp Web Country Flags
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Inserts flag images in front of phone numbers not saved as contact.
// @author       Tobias Deißler
// @match        https://web.whatsapp.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377615/WhatsApp%20Web%20Country%20Flags.user.js
// @updateURL https://update.greasyfork.org/scripts/377615/WhatsApp%20Web%20Country%20Flags.meta.js
// ==/UserScript==

"use strict";

const callingCodeToCountryTable =
{
    "886": "tw",
    "93": "af",
    "355": "al",
    "213": "dz",
    "1 (684)": "as",
    "376": "ad",
    "244": "ao",
    "1 (264)": "ai",
    "672": "aq",
    "1 (268)": "ag",
    "54": "ar",
    "374": "am",
    "297": "aw",
    "61": "au",
    "43": "at",
    "994": "az",
    "1 (242)": "bs",
    "973": "bh",
    "880": "bd",
    "1 (246)": "bb",
    "375": "by",
    "32": "be",
    "501": "bz",
    "229": "bj",
    "1 (441)": "bm",
    "975": "bt",
    "591": "bo",
    "599": "bq",
    "387": "ba",
    "267": "bw",
    "47": "bv",
    "55": "br",
    "246": "io",
    "1 (284)": "vg",
    "673": "bn",
    "359": "bg",
    "226": "bf",
    "257": "bi",
    "238": "cv",
    "855": "kh",
    "237": "cm",
    "1": "ca",
    "1 (345)": "ky",
    "236": "cf",
    "235": "td",
    "56": "cl",
    "86": "cn",
    "852": "hk",
    "853": "mo",
    "61 (891)": "cc",
    "57": "co",
    "269": "km",
    "242": "cg",
    "682": "ck",
    "506": "cr",
    "385": "hr",
    "53": "cu",
    "599": "cw",
    "357": "cy",
    "420": "cz",
    "225": "ci",
    "850": "kp",
    "243": "cd",
    "45": "dk",
    "253": "dj",
    "1 (767)": "dm",
    "1 (809)": "do",
    "1 (829)": "do",
    "1 (849)": "do",
    "593": "ec",
    "20": "eg",
    "503": "sv",
    "240": "gq",
    "291": "er",
    "372": "ee",
    "251": "et",
    "500": "fk",
    "298": "fo",
    "679": "fj",
    "358": "fi",
    "33": "fr",
    "594": "gf",
    "689": "pf",
    "262": "tf",
    "241": "ga",
    "220": "gm",
    "995": "ge",
    "49": "de",
    "233": "gh",
    "350": "gi",
    "30": "gr",
    "299": "gl",
    "1 (473)": "gd",
    "590": "gp",
    "1 (671)": "gu",
    "502": "gt",
    "44": "gg",
    "224": "gn",
    "245": "gw",
    "592": "gy",
    "509": "ht",
    "672": "hm",
    "39 (06)": "va",
    "504": "hn",
    "36": "hu",
    "354": "is",
    "91": "in",
    "62": "id",
    "98": "ir",
    "964": "iq",
    "353": "ie",
    "44": "im",
    "972": "il",
    "39": "it",
    "1 (876)": "jm",
    "81": "jp",
    "44": "je",
    "962": "jo",
    "7": "kz",
    "254": "ke",
    "686": "ki",
    "965": "kw",
    "996": "kg",
    "856": "la",
    "371": "lv",
    "961": "lb",
    "266": "ls",
    "231": "lr",
    "218": "ly",
    "423": "li",
    "370": "lt",
    "352": "lu",
    "261": "mg",
    "265": "mw",
    "60": "my",
    "960": "mv",
    "223": "ml",
    "356": "mt",
    "692": "mh",
    "596": "mq",
    "222": "mr",
    "230": "mu",
    "262": "yt",
    "52": "mx",
    "691": "fm",
    "377": "mc",
    "976": "mn",
    "382": "me",
    "1 (664)": "ms",
    "212": "ma",
    "258": "mz",
    "95": "mm",
    "264": "na",
    "674": "nr",
    "977": "np",
    "31": "nl",
    "687": "nc",
    "64": "nz",
    "505": "ni",
    "227": "ne",
    "234": "ng",
    "683": "nu",
    "672": "nf",
    "1 (670)": "mp",
    "47": "no",
    "968": "om",
    "92": "pk",
    "680": "pw",
    "507": "pa",
    "675": "pg",
    "595": "py",
    "51": "pe",
    "63": "ph",
    "870": "pn",
    "48": "pl",
    "351": "pt",
    "1": "pr",
    "974": "qa",
    "82": "kr",
    "373": "md",
    "40": "ro",
    "7": "ru",
    "250": "rw",
    "262": "re",
    "590": "bl",
    "290": "sh",
    "1 (869)": "kn",
    "1 (758)": "lc",
    "590": "mf",
    "508": "pm",
    "1 (784)": "vc",
    "685": "ws",
    "378": "sm",
    "239": "st",
    "966": "sa",
    "221": "sn",
    "381": "rs",
    "248": "sc",
    "232": "sl",
    "65": "sg",
    "1 (721)": "sx",
    "421": "sk",
    "386": "si",
    "677": "sb",
    "252": "so",
    "27": "za",
    "500": "gs",
    "211": "ss",
    "34": "es",
    "94": "lk",
    "970": "ps",
    "249": "sd",
    "597": "sr",
    "268": "sz",
    "46": "se",
    "41": "ch",
    "963": "sy",
    "992": "tj",
    "66": "th",
    "389": "mk",
    "670": "tl",
    "228": "tg",
    "690": "tk",
    "676": "to",
    "1 (868)": "tt",
    "216": "tn",
    "90": "tr",
    "993": "tm",
    "1 (649)": "tc",
    "688": "tv",
    "256": "ug",
    "380": "ua",
    "971": "ae",
    "44": "gb",
    "255": "tz",
    "1 (340)": "vi",
    "1": "us",
    "598": "uy",
    "998": "uz",
    "678": "vu",
    "58": "ve",
    "84": "vn",
    "681": "wf",
    "212": "eh",
    "967": "ye",
    "260": "zm",
    "263": "zw",
    "358": "ax"
};

const flagImagesFolderPath = "https://raw.githubusercontent.com/todeit02/whatsapp_web_country_flags_userscript/master/flags";
const phoneNumberChatSelector = ".WJuYU";
const initialInsertId = "main";
const insertingFlagsClass = "phoneNumberCountryFlag";

debugger;
const messageInsertObserver = new MutationObserver(insertFlags);
const observerOptions = { childList: true, subtree: true };
messageInsertObserver.observe(document, observerOptions);


function insertFlags(mutationRecords)
{
    const addedPhoneNumberNodes = extractPhoneNumberNodes(mutationRecords);
    for(let i = 0; i < addedPhoneNumberNodes.length; i++)
    {
        const alreadyHasFlag = Array.from(addedPhoneNumberNodes[i].parentElement.children).some(nodeSibling => nodeSibling.classList.contains(insertingFlagsClass));
        if(!alreadyHasFlag)
        {
            insertFlag(addedPhoneNumberNodes[i]);
        }
    }
};


function insertFlag(phoneNumberNode)
{
    const phoneNumber = phoneNumberNode.textContent;
    
    for(let testingCallingCode of Object.keys(callingCodeToCountryTable))
    {
        // bug: possible longer match
        if(phoneNumber.startsWith('+' + testingCallingCode))
        {
            const containedCountryFlag = createFlagImageInContainerNode(callingCodeToCountryTable[testingCallingCode]);    
            phoneNumberNode.parentElement.insertBefore(containedCountryFlag, phoneNumberNode);
            break;
        }
    }
}


function createFlagImageInContainerNode(iso31661alpha2countryCode)
{
    const countryFlagContainer = document.createElement("div");
    countryFlagContainer.style.display = "flex";
    countryFlagContainer.style.alignItems = "center";

    const countryFlag = new Image();
    countryFlag.classList.add(insertingFlagsClass);
    countryFlag.style.marginRight = "0.4em";
    countryFlag.style.height = "1em";    
    countryFlag.src = flagImagesFolderPath + '/' + iso31661alpha2countryCode + ".png";
    countryFlag.title = iso31661alpha2countryCode;

    countryFlagContainer.appendChild(countryFlag);

    return countryFlagContainer;
}


function extractPhoneNumberNodes(mutationRecords)
{
    const phoneNumberNodes = [];

    mutationRecords.forEach(mutationRecord =>
    {
        mutationRecord.addedNodes.forEach(addedNode =>
        {
            const shouldContainPhoneNumberNodes = addedNode.getAttribute('role') === 'row' || addedNode.id === initialInsertId;
            if(!shouldContainPhoneNumberNodes) return;

            const phoneNumberNodesInElement = addedNode.querySelectorAll(phoneNumberChatSelector);
            phoneNumberNodes.push(...phoneNumberNodesInElement);
        });
    });

    return phoneNumberNodes;
}
