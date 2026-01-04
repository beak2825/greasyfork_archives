// ==UserScript==
// @name         AO3: [Wrangling] When did I last wrangle?
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @description  turns the last wrangled date into a "X days ago" message, and highlights it if more than 10 days ago
// @author       escctrl
// @version      1.2
// @match        *://*.archiveofourown.org/tag_wranglers/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468393/AO3%3A%20%5BWrangling%5D%20When%20did%20I%20last%20wrangle.user.js
// @updateURL https://update.greasyfork.org/scripts/468393/AO3%3A%20%5BWrangling%5D%20When%20did%20I%20last%20wrangle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const last = document.getElementById('user-page').querySelector("span.datetime");

    // skip this script if we're not looking at our own wrangling page where no date is displayed
    if (!last) return;

    const t = last.children;

    // hide the <p> containing the last wrangled time
    last.parentElement.style.display = 'none';
    // removes the intro sentence about assigned fandoms (first three childNodes) but leaves the <p> for improved compatibility with other scripts
    let m = document.getElementById('user-page').querySelector('p:has(a[href$="/tag_wranglers"])').childNodes;
    for (let i=0; i<3; i++) {
        m[0].parentNode.removeChild(m[0]);
    }

    var n = document.createElement('span');
    n.id = 'lastwrangled';
    n.style.fontSize = 'smaller';
    n.title = last.innerText.replaceAll("\n", ' ');

    document.querySelector('head').innerHTML += `<style type="text/css">
    #lastwrangled { font-size: 0.7em; padding-left: 1em; }
    #lastwrangled span { position: relative; z-index: 1; color: white; }
    #lastwrangled .good::before, #lastwrangled .late::before {content: ""; position: absolute; width: calc(100% + 4px); height: 115%; right: -2px; bottom: -2px; z-index: -1; transform: rotate(-3deg); }
    #lastwrangled .good::before { background-color: #a4a4a4; }
    #lastwrangled .late::before { background-color: #e62b2b; }
    </style>`;

    // fixing the months (from text to integer representation)
    const months = { 'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12' };
    var month = months[t[2].innerText];

    // fixing the time (from 12-hour to 24-hour, e.g. 2am -> 2 -> 02:xx, 4pm -> 16 -> 16:xx, 12am -> 12-12 = 00:xx, 12pm -> 24-12 = 12:xx
    var time = t[4].innerText.match(/(\d*):(\d*)(AM|PM)/i);
    var hour = time[3] == 'PM' ? parseInt(time[1])+12 : parseInt(time[1]);
    if (hour == 12 || hour == 24) hour = hour-12;
    time = hour.toString().padStart(2, '0') + ':' + time[2];

    // switching timezone name from Ruby to UTC offset that JS understands
    // several timezones are output as an offset only. Plenty of timezones are missing, those are in comments (can be added if I missed one or they are supported later)
    // cities are listed where the TZ acronym is ambiguous
    const zones = new Object({
        '-12:00': ['-12'],
        '-11:00': ['-11', 'SST'], //'NUT'
        '-10:00': ['-10', 'HST'], //'TAHT', 'CKT'
      //'-09:30': ['MART'],
        '-09:00': ['-09', 'HDT', 'AKST'], //'GAMT'
        '-08:00': ['-08', 'AKDT', 'PST'],
        '-07:00': ['-07', 'PDT', 'MST'],
        '-06:00': ['-06', 'MDT', 'Central Time (US & Canada)', 'Central America', 'Chihuahua', 'Guadalajara', 'Mexico City', 'Monterrey', 'Saskatchewan'], //'EAST', 'GALT'
        '-05:00': ['-05', 'CDT', 'EST'], //'ECT', 'ACT',  'CIST', 'COT', 'CST', 'EASST', 'PET'
        '-04:00': ['-04', 'EDT', 'AST'], //'AMT', 'BOT', 'CDT', 'CIDST', 'CLT', 'FKT', 'GYT', 'PYT','VET'
        '-03:30': ['NST'],
        '-03:00': ['-03', 'ADT'], //'BRT',  'AMST', 'ART', 'CLST', 'FKST', 'GFT', 'P', 'PMST', 'PYST', 'ROTT', 'SRT', 'UYT', 'WARST', 'WGT'
        '-02:30': ['NDT'],
        '-02:00': ['-02'], //'BRST', 'GST', 'FNT', 'PMDT', 'UYST', 'WGST'
        '-01:00': ['-01'], //'CVT', 'AZOT', 'EGT'
        '+00:00': ['+00', 'UTC', 'GMT', 'WET'], //'WT', 'AZOST', 'EGST'
        '+01:00': ['+01', 'BST', 'WEST', 'CET', 'Dublin'], // 'WAT', 'WST'
        '+02:00': ['+02', 'CEST', 'EET', 'CAT', 'SAST', 'Jerusalem'],
        '+03:00': ['+03', 'EEST', 'IDT', 'MSK', 'EAT'], // 'AST', 'FET', 'SYOT', 'TRT'
        '+03:30': ['+0330'], // 'IRST'
        '+04:00': ['+04'], //'GST', 'AMT', 'AZT', 'D', 'GET', 'KUYT', 'MSD', 'MUT', 'RET', 'SAMT', 'SCT'
        '+04:30': ['+0430'], //'IRDT', 'AFT'
        '+05:00': ['+05', 'PKT'], //'AMST', 'AQTT', 'AZST', 'E', 'MAWT', 'MVT', 'ORAT', 'TFT', 'TJT', 'TMT', 'UZT', 'YEKT'
        '+05:30': ['+0530', 'Chennai', 'Kolkata', 'Mumbai', 'New Delhi'],
        '+05:45': ['+0545'], // 'NPT'
        '+06:00': ['+06'], //'ALMT', 'BST', 'BTT', 'IOT', 'KGT', 'OMST', 'QYZT', 'VOST', 'YEKST'
        '+06:30': ['+0630'], //'MMT', 'CCT'
        '+07:00': ['+07', 'WIB'], //'KRAT', 'CXT', 'DAVT', 'HOVT', 'ICT', 'NOVST', 'NOVT', 'OMSST'
        '+08:00': ['+08', 'Beijing', 'Chongqing', 'Taipei', 'HKT', 'AWST'], //'ULAT', 'BNT', 'CAST', 'CHOT', 'HOVST', 'IRKT', 'KRAST', 'MYT', 'PHT', 'SGT', 'WITA'
      //'+08:45': [], //'ACWST'
        '+09:00': ['+09', 'JST', 'KST'], //'CHOST', 'IRKST', 'PWT', 'TLT', 'ULAST', 'WIT'
        '+09:30': ['ACST'],
        '+10:00': ['+10', 'AEST', 'ChST'], //'CHUT', 'DDUT', 'K', 'PGT', 'VLAT', 'YAKST', 'YAPT'
        '+10:30': ['ACDT'], //'LHDT'
        '+11:00': ['+11', 'AEDT'], //'SRET', 'BST', 'KOST', 'L', 'LHDT', 'MAGT', 'NCT', 'NFT', 'PONT', 'SAKT', 'SBT', 'VLAST', 'VUT'
        '+12:00': ['+12', 'NZST'], //'ANAT', 'ANAST', 'FJT', 'GILT', 'M', 'MAGST', 'MHT', 'NFDT', 'NRT', 'PETST', 'PETT', 'TVT', 'WAKT', 'WFT'
        '+12:45': ['+1245'], //'CHAST'
        '+13:00': ['+13', 'NZDT'], //'TKT', 'FJST', 'PHOT', 'TOT', 'WST'
        '+13:45': ['+1345'], //'CHADT'
        '+14:00': ['+14'] //'TOST', 'LINT'
    });
    var offset = '';
    for (let [key, value] of Object.entries(zones)) {
        // Ao3 only offers the city to distinguish ambiguous acronyms. Thankfully the limited TZ set in Preferences only has that problem with IST and CST.
        if ((t[5].innerText == 'IST' && value.includes(t[5].title)) ||
            (t[5].innerText == 'CST' && value.includes(t[5].title)) ||
            (value.includes(t[5].innerText))) {
            offset = key;
        }
        // fallback in case I missed a timezone. day count could be off by a day, but better than nothing
        else offset = '+00:00';
    }

    // translate last wrangled time into JS object with which we can do math
    const mytime = new Date(`${t[3].innerText}-${month}-${t[1].innerText}T${time}${offset}`);

    const countfandoms = document.getElementById('user-page').querySelectorAll('.assigned table tbody tr').length;

    // diff between now and last wrangled, turned from milliseconds into days, rounded to closest full number
    const indays = Math.round((new Date() - mytime) / (1000 * 3600 * 24));
    n.innerHTML = " (it's been <span>"+ indays + ((indays == 1) ? " day" : " days") +"</span> since you last wrangled a tag in your "+ countfandoms +" fandoms)";

    // if more than 10 days ago, highlight!
    n.children[0].className = (indays > 10) ? 'late' : 'good';

    document.querySelector('.assigned h3').appendChild(n);

})();