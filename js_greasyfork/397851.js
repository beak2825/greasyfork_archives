// ==UserScript==
// @name        Language Switcher for Google™
// @author      gb.ianni shunf4
// @namespace   gb.ianni
// @version     2.3.4
// @copyright   Copyright 2015-2022 gb.ianni shunf4
// @description a port of Language Switcher for Google™ Chome extension (https://chrome.google.com/webstore/detail/language-switcher-for-goo/jbbappjmafnnhhalfbhdhiemchcgejcp) to userscript.js
// @include *://www.google.com/*
// @include *://www.google.ad/*
// @include *://www.google.ae/*
// @include *://www.google.com.af/*
// @include *://www.google.com.ag/*
// @include *://www.google.com.ai/*
// @include *://www.google.am/*
// @include *://www.google.co.ao/*
// @include *://www.google.com.ar/*
// @include *://www.google.as/*
// @include *://www.google.at/*
// @include *://www.google.com.au/*
// @include *://www.google.az/*
// @include *://www.google.ba/*
// @include *://www.google.com.bd/*
// @include *://www.google.be/*
// @include *://www.google.bf/*
// @include *://www.google.bg/*
// @include *://www.google.com.bh/*
// @include *://www.google.bi/*
// @include *://www.google.bj/*
// @include *://www.google.com.bn/*
// @include *://www.google.com.bo/*
// @include *://www.google.com.br/*
// @include *://www.google.bs/*
// @include *://www.google.co.bw/*
// @include *://www.google.by/*
// @include *://www.google.com.bz/*
// @include *://www.google.ca/*
// @include *://www.google.cd/*
// @include *://www.google.cf/*
// @include *://www.google.cg/*
// @include *://www.google.ch/*
// @include *://www.google.ci/*
// @include *://www.google.co.ck/*
// @include *://www.google.cl/*
// @include *://www.google.cm/*
// @include *://www.google.cn/*
// @include *://www.google.com.co/*
// @include *://www.google.co.cr/*
// @include *://www.google.com.cu/*
// @include *://www.google.cz/*
// @include *://www.google.de/*
// @include *://www.google.dj/*
// @include *://www.google.dk/*
// @include *://www.google.dm/*
// @include *://www.google.com.do/*
// @include *://www.google.dz/*
// @include *://www.google.com.ec/*
// @include *://www.google.ee/*
// @include *://www.google.com.eg/*
// @include *://www.google.es/*
// @include *://www.google.com.et/*
// @include *://www.google.fi/*
// @include *://www.google.com.fj/*
// @include *://www.google.fm/*
// @include *://www.google.fr/*
// @include *://www.google.ga/*
// @include *://www.google.ge/*
// @include *://www.google.gg/*
// @include *://www.google.com.gh/*
// @include *://www.google.com.gi/*
// @include *://www.google.gl/*
// @include *://www.google.gm/*
// @include *://www.google.gp/*
// @include *://www.google.gr/*
// @include *://www.google.com.gt/*
// @include *://www.google.gy/*
// @include *://www.google.com.hk/*
// @include *://www.google.hn/*
// @include *://www.google.hr/*
// @include *://www.google.ht/*
// @include *://www.google.hu/*
// @include *://www.google.co.id/*
// @include *://www.google.ie/*
// @include *://www.google.co.il/*
// @include *://www.google.im/*
// @include *://www.google.co.in/*
// @include *://www.google.iq/*
// @include *://www.google.is/*
// @include *://www.google.it/*
// @include *://www.google.je/*
// @include *://www.google.com.jm/*
// @include *://www.google.jo/*
// @include *://www.google.co.jp/*
// @include *://www.google.co.ke/*
// @include *://www.google.com.kh/*
// @include *://www.google.ki/*
// @include *://www.google.kg/*
// @include *://www.google.co.kr/*
// @include *://www.google.com.kw/*
// @include *://www.google.kz/*
// @include *://www.google.la/*
// @include *://www.google.com.lb/*
// @include *://www.google.li/*
// @include *://www.google.lk/*
// @include *://www.google.co.ls/*
// @include *://www.google.lt/*
// @include *://www.google.lu/*
// @include *://www.google.lv/*
// @include *://www.google.com.ly/*
// @include *://www.google.co.ma/*
// @include *://www.google.md/*
// @include *://www.google.me/*
// @include *://www.google.mg/*
// @include *://www.google.mk/*
// @include *://www.google.ml/*
// @include *://www.google.mn/*
// @include *://www.google.ms/*
// @include *://www.google.com.mt/*
// @include *://www.google.mu/*
// @include *://www.google.mv/*
// @include *://www.google.mw/*
// @include *://www.google.com.mx/*
// @include *://www.google.com.my/*
// @include *://www.google.co.mz/*
// @include *://www.google.com.na/*
// @include *://www.google.com.nf/*
// @include *://www.google.com.ng/*
// @include *://www.google.com.ni/*
// @include *://www.google.ne/*
// @include *://www.google.nl/*
// @include *://www.google.no/*
// @include *://www.google.com.np/*
// @include *://www.google.nr/*
// @include *://www.google.nu/*
// @include *://www.google.co.nz/*
// @include *://www.google.com.om/*
// @include *://www.google.com.pa/*
// @include *://www.google.com.pe/*
// @include *://www.google.com.ph/*
// @include *://www.google.com.pk/*
// @include *://www.google.pl/*
// @include *://www.google.pn/*
// @include *://www.google.com.pr/*
// @include *://www.google.ps/*
// @include *://www.google.pt/*
// @include *://www.google.com.py/*
// @include *://www.google.com.qa/*
// @include *://www.google.ro/*
// @include *://www.google.ru/*
// @include *://www.google.rw/*
// @include *://www.google.com.sa/*
// @include *://www.google.com.sb/*
// @include *://www.google.sc/*
// @include *://www.google.se/*
// @include *://www.google.com.sg/*
// @include *://www.google.sh/*
// @include *://www.google.si/*
// @include *://www.google.sk/*
// @include *://www.google.com.sl/*
// @include *://www.google.sn/*
// @include *://www.google.sm/*
// @include *://www.google.st/*
// @include *://www.google.com.sv/*
// @include *://www.google.td/*
// @include *://www.google.tg/*
// @include *://www.google.co.th/*
// @include *://www.google.com.tj/*
// @include *://www.google.tk/*
// @include *://www.google.tl/*
// @include *://www.google.tm/*
// @include *://www.google.tn/*
// @include *://www.google.to/*
// @include *://www.google.com.tr/*
// @include *://www.google.tt/*
// @include *://www.google.com.tw/*
// @include *://www.google.co.tz/*
// @include *://www.google.com.ua/*
// @include *://www.google.co.ug/*
// @include *://www.google.co.uk/*
// @include *://www.google.com.uy/*
// @include *://www.google.co.uz/*
// @include *://www.google.com.vc/*
// @include *://www.google.co.ve/*
// @include *://www.google.vg/*
// @include *://www.google.co.vi/*
// @include *://www.google.com.vn/*
// @include *://www.google.vu/*
// @include *://www.google.ws/*
// @include *://www.google.rs/*
// @include *://www.google.co.za/*
// @include *://www.google.co.zm/*
// @include *://www.google.co.zw/*
// @downloadURL https://update.greasyfork.org/scripts/397851/Language%20Switcher%20for%20Google%E2%84%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/397851/Language%20Switcher%20for%20Google%E2%84%A2.meta.js
// ==/UserScript==

var debug = false;

cLog("Start");

//
// Parses and puts in a hash map CGI URL parameters.
//
cLog("Window href:" + window.location.href);

//debugLayer = { 'FORM3' : 1, 'PROF' : 1 };
debugLayer = { 'INJ': 1 };

var vars = null;
function getUrlVars() {
    if (!vars) {
        vars = [];
        var hash;
        var positionQ = window.location.href.indexOf('?');
        var positionS = window.location.href.indexOf('#');

        if (positionQ > 0 && positionS > 0)
            position = Math.min(positionQ, positionS);
        else if (positionQ > 0)
            position = positionQ;
        else position = positionS;

        var hashes = window.location.href.slice(position + 1).split(/&|#/);

        for (var i = 0; i < hashes.length; i++) {
            cLog('VALUE:' + hashes[i]);
            hash = hashes[i].split('=');
            //vars.push(hash[0]);
            vars[hash[0]] = hash[1];

        }
        // Possibly missing hl value is filled with languages value corresponding to TLD value
        if (!vars['hl'])
            vars['hl'] = domainsToLang[getTLD()];
        // Possibly missing lr value is filled with languages value corresponding to TLD value
        if (!vars['lr'])
            vars['lr'] = "lang_" + domainsToLang[getTLD()];
    }
    return vars;
}

function getTLD() {
    var tld = window.location.href.match(/\.(\w+?)(\/|$)/)[1];
    cLog('TLD=' + tld);
    return tld;
}
cLog('TLD:' + getTLD());

//
// Main
//


//var addPath = "/html/body/div/*/div/div[2]/div";
//var addPath = "/html/body/div/div/div[2]/div[@id='resultStats']";
//var addPath = "/html/body/div[@id='main']/div[@id='cnt']/div[@id='subform_ctrl']";
//var addSelector = '#resultStats';
var addPaths = ["//*[@id='resultStats']", "//*[@id='gbx1']"];

//
// Add Possible Injection points below
//
// Places where to try injection of Language switcher box
// var addSelectors = { "#resultStats": 1, "#slim_appbar": 1, "#extabar": 1, "#topabar": 1, ".med": 1, ".g": 1, ".appbar": 1 };
var addSelectors = [ ["#rhs > div:first-of-type", "addBeforeElem", ""], ["#appbar", "addAfterElem", "float:right;"], ];
var languageVars = ["hl", "#hl"];
var documentFormName = 'gbqf';

/*
 *   Injected Code for querying as a different language
 */
var labels = ["en-US", "it", "fr", "de", "es", "cn/hk", "jp", "ru", "nl"];
//,"nl","ru","gr","jp","tr","cn","arb","il");

var languages = ["en", "it", "fr", "de", "es", "zh-CN", "ja", "ru", "nl"];
//,"nl","ru","el","ja","tr","zh-CN","ar","iw");

var domains = ["com", "it", "fr", "de", "es", "com.hk", "co.jp", "ru", "nl"];
var tlds = ["com", "it", "fr", "de", "es", "cn", "jp", "ru", "nl"];

var wikipediaDomains = ["en", "it", "fr", "de", "es", "zh", "ja", "ru", "nl"];

var domainsToLang = [];

for (var i = 0; i < domains.length; i++) {
    domainsToLang[tlds[i]] = languages[i];
}

var injectedObjectName = 'AGB_language_switcher';

var status = new Array();

var radioOn = "checked=\"checked\"";
var radioOff = "";

for (var i = 0; i < labels.length; i++) {
    if ("lang_" + languages[i] != getUrlVars()["lr"])
        status[languages[i]] = radioOff;
    else
        status[languages[i]] = radioOn;
}

cLog("GetURlVars=" + getUrlVars());
cLog("n_lang is=" + getUrlVars()["n_lang"]);
cLog("hl is=" + getUrlVars()["hl"]);
cLog("lr is=" + getUrlVars()["lr"]);
cLog("q is=" + getUrlVars()["q"]);
cLog("Languages[n_lang] is=" + status[getUrlVars()["hl"]]);


var inject = "<div id='" + injectedObjectName + "' class='q qs'><br>Ask again on another local version: \
<table  width='100%' border='0' cellpadding='0' cellspacing='0' style='position:static'><td> \
<table border='0' cellpadding='0' cellspacing='0'> \
<tbody><tr><th scope='row' align='left'>Google:</th>";

//
// Prepare code for radio buttons to be injected in Google page results
//

var googleInjectFuncMap = {};

for (let i = 0; i < languages.length; i++) {
    googleInjectFuncMap["label_g_" + languages[i]] = function() {
        var a = window.location.href.slice(0);
        a = a.replace(/google\.(.*?)\//, 'google.' + domains[i] + '/');
        if (!a.match(/(\?|\&)hl=/)) {
            a = a + '&hl=';
        }
        if (!a.match(/(\?|\&)lr=/)) {
            a = a + '&lr=';
        }
        a = a.replace(/hl=(.*?)(&|$)/, 'hl=' + languages[i] + '$2');
        a = a.replace(/lr=(.*?)(&|$)/, 'lr=lang_' + languages[i] + '$2');
        window.location.href = a;
    }

    //var clicInject = "document."+documentFormName+".hl.value ='"+languages[i]+"'; document."+documentFormName+".submit(); ";
    cLog("Injecting " + domains[i] + " code");

    var checked = ("lang_" + languages[i] == getUrlVars()["lr"]) && (tlds[i] == getTLD() || true);

    inject += "<td nowrap valign='middle'><label id='label_g_" + languages[i] + "' for=il \
        style=\"font-size:large;\"><input id='g_" + languages[i] + "' " + (checked ? ' checked ' : '') + "type=radio name=n_lang value='" + languages[i] + "'>" + labels[i] + "</label></td>";
}
inject += "<td>&nbsp;&nbsp;&nbsp;</td>";
cLog("This is what I'm injecting:" + inject);
/*
function getClicFunction(i)
{
    return function() { document[documentFormName].hl.value = languages[i]; document[documentFormName].submit(); };
}
for (var i = 0; i < languages.length; i++)
    {
        inject.append($('<td>').attr({ 'valign' : 'middle' })
                            .append($('<input>').attr( { id : 'g_'+languages[i], type : 'radio', name : 'n_lang', value : languages[i]}
                            )
                      ));
    }
*/
//
// Adds Wikipedia radio buttons. Constructs xx.wikipedia.org for xx taken from wikipediaDomains[]
//
inject += "</tr><tr><th scope='row' align='left'>Wikipedia:</th>";
var query = getUrlVars()["q"];
for (var i = 0; i < languages.length; i++) {
    var clicWikiInject = "window.location = 'http://" + wikipediaDomains[i] + ".wikipedia.org/?search=" + query + "';";

    inject += "<td nowrap valign='middle'><input id=g_w" + languages[i] + " type=radio name=n_lang value='w" + languages[i] + "' \
                             onClick=\""+ clicWikiInject + "\"><label for=il>" + labels[i] + "</label></td>";

}
inject += "<td>&nbsp;&nbsp;&nbsp;</td></tr></tbody></table></td></table>";

tryInjection();
document.addEventListener("DOMNodeInserted", function (event) {
    var element = event.target;
    //cLog("Node INSERTED "+element.name);
    //if (element.className == 'med') {
    tryInjection();
    //}
});

var alreadyInjected = false;
function tryInjection() {
    if (alreadyInjected) return;
    var placeToInject = null;
    if (!document.getElementById(injectedObjectName)) {
        lLog("Starting injection", "INJ");

        var selector;
        var insertMethod;
        var extraStyles;
        for (var pair of addSelectors) {
            selector = pair[0];
            insertMethod = pair[1];
            extraStyles = pair[2];
            lLog("Attempting injection point: " + selector, "INJ");
            if (placeToInject = document.querySelectorAll(selector)[0]) {
                lLog("Matched Selector:" + selector, "INJ"); break;
            }
        }
        lLog("Place to inject:" + placeToInject, "INJ");
        if (placeToInject) {
            //placeToInject.innerHTML = "<td>"+inject+"</td></div>" + placeToInject.innerHTML;
            // document.querySelectorAll("#appbar").forEach(el => { el.style.zIndex = 999 });
            document.querySelectorAll(selector).forEach(el => {
                var mainElem = new DOMParser().parseFromString(inject, "text/html").body.firstChild;
                if (insertMethod === "addBeforeElem") {
                    el.before(mainElem);
                } else {
                    el.after(mainElem);
                }
                mainElem.setAttribute("style", extraStyles);
            });
            for (var labelId in googleInjectFuncMap) {
                document.getElementById(labelId).onclick = googleInjectFuncMap[labelId];
            }
            alreadyInjected = true;
        }
        lLog("Ending injection", "INJ");

    }
    else lLog("Looks like there is already a language_switcher here.", "INJ2");
}

function cLog(str) {
    if (debug) console.log(str);
}

/**
 * main logging function
 * @param str  String to be printed
 * @param level debugLayer triggering the printout. Will be printed only if level is in the currently active debugLayers
 */

function lLog(str, level) {
    //console.log("Logging:"+str);
    if (!isNaN(level))
        str += " USING NUMBERS FOR DEBUG LEVELS IS DEPRECATED - ";
    else if (level.match(/PROF/)) {
        str = this.debug.getPace() + "\n" + str;
    };
    //	console.log("mid Logging:"+this.debugLayer+" "+this.localLog);

    if (debugLayer == level || debugLayer == "ALL" || (debugLayer instanceof Object && debugLayer[level])) { cLog(str); }
    //console.log("end Logging:"+str);

};

//
// XPath evaluation wrapping function.
//
function xpath(query, node) {
    return document.evaluate(query, node, null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
}

//
// Returns the first element of a given XPath query
//
function fXPath(query, node) {
    var elements = xpath(query, node);
    return elements.snapshotItem(0);
}

//
// Returns the last element of a given XPath query
//
function lXPath(query, node) {
    cLog("Asking for " + query);
    var elements = xpath(query, node);
    cLog("Elements are " + elements.snapshotLength);
    return elements.snapshotItem(elements.snapshotLength - 1);
}

//
// 0-ize NaN and non-number strings
//
function normalize(str) {
    var temp = (str != null) ? parseInt(str) : 0;
    return (isNaN(temp)) ? 0 : temp;
}
