// ==UserScript==
// @name         No SEO-speak
// @namespace    https://greasyfork.org/de/users/580795
// @version      0.4.6
// @description  Entfernt SEO-Sprech
// @author       b1100101
// @match        http*://*.de/*
// @grant        GM_setValue
// @grant        GM_getValue

// @downloadURL https://update.greasyfork.org/scripts/459218/No%20SEO-speak.user.js
// @updateURL https://update.greasyfork.org/scripts/459218/No%20SEO-speak.meta.js
// ==/UserScript==
/* eslint-disable no-multi-spaces */

const debug = 2;

var mycounter = 0;
var mycounterAll = 0;

const defaultRegexes = [

    { id:  30, regex: /Rechnern?s? aus Cupertino/g,                       replaceValue: "Macs",               site: /mactechnews.de/ },
    { id:  31, regex: /(Notebooks|Laptops) (oder|und) Desktops aus Cupertino/g,     replaceValue: "Macs",               site: /mactechnews.de/ },
    { id:  32, regex: /(Notebooks|Laptops) (oder|und) Desktops mit Apple Silicon/g, replaceValue: "Mx Macs",            site: /mactechnews.de/ },
    { id:  35, regex: /Computer aus Cupertino/g,                          replaceValue: "Macs",               site: /mactechnews.de/ },

    { id:  40, regex: /Smartphones (oder|und) Tablets aus Cupertino/g,    replaceValue: "iPhones $1 iPads",   site: /mactechnews.de/ },
    { id:  41, regex: /Smartphone(s?) aus Cupertino/g,                    replaceValue: "iPhone$1",           site: /mactechnews.de/ },
    { id:  45, regex: /Tablet(s?) aus Cupertino/g,                        replaceValue: "iPad$1",             site: /mactechnews.de/ },

    { id:  50, regex: /Smartwatch-Modellen aus Cupertino/g,               replaceValue: "Apple Watches",      site: /mactechnews.de/ },
    { id:  51, regex: /Smartwatch(\w*) aus Cupertino/g,                   replaceValue: "Apple Watch",        site: /mactechnews.de/ },


    { id:  100, regex: /[Dd]as Unternehmen aus Cupertino/g,                replaceValue: "Apple",       site: /mactechnews.de/ },
    { id:  101, regex: /[Dd][ae]s kalifornische.? Unternehmen(.?)/g,       replaceValue: "Apple$1",     site: /mactechnews.de/ },
    { id:  101, regex: /[Dd]er kalifornische.? Konzern(.?)/g,              replaceValue: "Apple$1",     site: /mactechnews.de/ },
    { id:  102, regex: /[Dd]em kalifornischen Unternehmen/g,               replaceValue: "Apple",       site: /mactechnews.de/ },
    { id:  103, regex: /(b|B)(ei)? dem Unternehmen aus Cupertino/g,        replaceValue: "$1$2 Apple",  site: /heise.de/ },
    { id:  104, regex: /im Unternehmen aus Cupertino/g,                    replaceValue: "bei Apple",   site: /mactechnews.de/ },
    { id:  105, regex: /(dass?) Cupertino/g,                               replaceValue: "$1 Apple",    site: /mactechnews.de/ },
    { id:  106, regex: /der iPhone-Konzern/g,                              replaceValue: "Apple",       site: /mactechnews.de/ },

    { id:  20, regex: /aus Cupertino/g,                                   replaceValue: "von Apple",          site: /mactechnews.de/ },
    { id:  21, regex: /in Cupertino/g,                                    replaceValue: "bei Apple",          site: /mactechnews.de/ },
    { id:  22, regex: /In Cupertino/g,                                    replaceValue: "Bei Apple",          site: /mactechnews.de/ },

    { id:  160, regex: /Cupertino/g,                                       replaceValue: "Apple",       site: /mactechnews.de/ },
    { id:  165, regex: /des kalifornischen Unternehmens/g,                 replaceValue: "Apples",      site: /mactechnews.de/ },
    { id:  166, regex: /[dD]as kalifornische Unternehmen/g,                replaceValue: "Apple",       site: /mactechnews.de/ },


    /* TwitterX */
    { id:  200, regex: /[iI]m Sozialen Netzwerk X/g,                       replaceValue: "auf Twitter",       site: /.*\.de/ },
    { id:  200, regex: /(\S+) Online-Plattform X/g,                       replaceValue: "Twitter",       site: /.*\.de/ },
    { id:  200, regex: /(be)?im Onlinedienst X/g,                             replaceValue: "auf Twitter",       site: /.*\.de/ },
    { id:  201, regex: /([Dd]e[rm]|[iI]m) Kurznachrichtendienst X/g,                  replaceValue: "Twitter",       site: /.*\.de/ },
    { id:  201, regex: /([Dd]e[rm]|[iI]m) Kurznachrichten-?([dD]ienst|[pP]lattform) X/g,                  replaceValue: "Twitter",       site: /.*\.de/ },
    { id:  201, regex: /(den)? Dienst X/g,                                        replaceValue: "Twitter",       site: /.*\.de/ },
    { id:  201, regex: /(der )?(Internet.?)Plattform X/g,                  replaceValue: "Twitter",       site: /.*\.de/ },
    { id:  202, regex: /([aA]uf|[vV]on|[bB]ei),? "?X"?,? (\((ehemals|vormals|damals|früher) "?[tT]witter"?\))?/g, replaceValue: "$1 Twitter",       site: /.*\.de/ },
    { id:  203, regex: /X.?Nutzer/g,                                       replaceValue: "Twitter Nutzer",    site: /.*\.de/ },
    //{ id:  203, regex: /X-(\S+)/g,                                       replaceValue: "Twitter-$1",    site: /.*\.de/ },
    { id:  204, regex: /"?X"?,?.?\(?(ehemals|vormals|damals|früher) "?[tT]witter?"\)?/g,                   replaceValue: "Twitter",                  site: /.*\.de/ },
    { id:  205, regex: /(hat|mit|auf|bei) X /g,                                    replaceValue: "$1 Twitter ",                  site: /.*\.de/ },
    { id:  205, regex: /X\/Twitter/g,                                      replaceValue: "Twitter ",                  site: /.*\.de/ },
    { id:  205, regex: /\(?(ehemals|vormals|damals|früher) [tT]witter\)?/g,      replaceValue: "",                  site: /.*\.de/ },
    
   // { id:  206, regex: /(?<!Series)([^a-z^A-Z^0-9])X([^a-z^A-Z^0-9])/g,        replaceValue: "$1Twitter$2",       site: /.*\.de/ },



/* Sternchensprech */
    //{ id:  10, regex: /([\^ ])(\S+\S+\S+)\S+in(nen)? (\w+\w+\w+)? -?(\2)/g,     replaceValue: "$1$2",         site: /.*/g },
    //{ id:  11, regex: /([\^ ])(\S+\S+\S+)(\S*) (\w*)?\w* -?(\2)in(nen)?\b/g,   replaceValue: "$1$2$3",       site: /.*/g },

  //{ id:  10, regex: /\b(\S+\S+\S+)\S+[^e^ ]in(nen)? (\w+\w+\w+)? -?(\1)/g,        replaceValue: "$1",           site: /.*/g },
    { id:  10, regex: /\b(\S\S\S)\S+[^e^ ]in(nen)? (und|oder|sowie) -?(\1)/g,        replaceValue: "$1",           site: /.*/g },
    { id:  11, regex: /\b(\w+) (\w+)in(nen)? \w+ (\1\w) (\2)/g,               replaceValue: "$4 $5",           site: /.*/g },
    { id:  12, regex: /\Kundinnen (und|oder|sowie) Kunden/g,        replaceValue: "Kunden",           site: /.*/g },

    //{ id:  15, regex: /\b(\S\S\S)(\S*) (\w*)?\w* -?(\1)[^e]in(nen)?\b/g,   replaceValue: "$1$2",         site: /.*/g }, // "Bericht aus Berlin" triggert, erweiterung um \S+ macht es zu langsam
    { id:  15, regex: /\b(\S\S\S*)(\S*) (und|oder|sowie) -?(\1)[^e]in(nen)?\b/g,   replaceValue: "$1$2",         site: /.*/g },
    { id:  16, regex: /Frauen und Männer(n?)/g,                               replaceValue: "Menschen",     site: /.*/g },
];

(function() {
  'use strict';

  if(window.location.href.match("bitcoin.de")   ||
     window.location.href.match(/.*amazon.*/g)  ||
     window.location.href.match(/.*mediamarkt.*/g)  ||
     window.location.href.match(/.*social.anoxinon.*/g)) {
     return;
  }

  // create a TreeWalker of all text nodes
  //var allTextNodes = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  var allTextNodes = document.createTreeWalker(document.body,
                                               NodeFilter.SHOW_TEXT,
                                               (node) => node.nodeValue.trim().match(/\s*{/g) || node.nodeValue.trim().startsWith("<")  ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT);

  var tmpnode, tmptxt;

  if(debug >= 3) {
    var time = Date.now();
    if(debug >= 4) alert("test Anfang " + time);
  }

  while (allTextNodes.nextNode()) {
    tmpnode = allTextNodes.currentNode;

    //var time = Date.now();
    if(debug >= 3) mycounterAll++;

    defaultRegexes.forEach(function(myReplacement) {
      if(window.location.href.match(myReplacement.site)) {
        //if(myReplacement.site.test(window.location.href) ) {
        tmptxt = tmpnode.nodeValue;
        if(tmpnode.nodeValue.match(myReplacement.regex)) {
          //if(debug >= 2) tmpnode.nodeValue = tmptxt.replace(myReplacement.regex, "❗" + myReplacement.replaceValue + "❗ (" + tmpnode.nodeValue + ")");
          if(debug) tmpnode.nodeValue = tmptxt.replace(myReplacement.regex, "❗" + myReplacement.replaceValue + "❗");
          else      tmpnode.nodeValue = tmptxt.replace(myReplacement.regex, myReplacement.replaceValue);
        }
        //}
      }
    });

    //var time2 = Date.now();
    //if(time2-time > 50) alert(tmpnode.nodeValue);
  }

  if(debug >= 3) {
    var time2 = Date.now();
    var timeErgebnis = time2-time;
    alert("No-SEO-Speak Ende \n" +
          "Anz. Nodes:\t" + mycounterAll + "\n" +
          "Startzeit:\t\t" + time + "\n" +
          "Endezeit:\t" + time2 + "\n" +
          "Differenz:\t" + timeErgebnis);
  }
})();