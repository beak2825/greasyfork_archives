// ==UserScript==
// @name            MTB News Forum Fixer
// @description:de  Behebt ein paar nervige Sachen im MTB-News Forum
// @namespace       sp00n.namespace
// @include         http://www.mtb-news.de/forum/t/*
// @include         https://www.mtb-news.de/forum/t/*
// @version         1.4
// @grant           none
// @description Behebt ein paar nervige Sachen im MTB-News Forum
// @downloadURL https://update.greasyfork.org/scripts/31040/MTB%20News%20Forum%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/31040/MTB%20News%20Forum%20Fixer.meta.js
// ==/UserScript==

var string = document.body.innerHTML;


// Fehlerhafte Umlaute korrigieren
string = string.replace(/ÃÂ¼/g, 'ü');
string = string.replace(/Ã¼/g, 'ü');
string = string.replace(/Ã¤/g, 'ä');
string = string.replace(/Ã¶/g, 'ö');
string = string.replace(/â¢/g, '-');
string = string.replace(/â/g, '-');
string = string.replace(/â¬/g, '€');
string = string.replace(/Ã/g, 'ß');
string = string.replace(/â/g, '"');
string = string.replace(/â/g, '"');
string = string.replace(/Ã/g, 'Ü');
string = string.replace(/Ã/g, 'Ö');
string = string.replace(/Ã/g, 'Ä');



// Entferne ad.zanox.com aus den Links
// http://ad.zanox.com/ppc/?30352176C2051769796&zpar0=[[f]]&ULP=[[http://www.chainreactioncycles.com/de/de/evoc-fr-tour-30l-2015/rp-prod131477?utm_source=Google&utm_medium=Shopping&utm_name=Switzerland&gclid=CjwKEAjwrpGuBRCkqeXpn-rt5hsSJAC9rxrPjbTdd8HZD2CaaA42Q_Q2JjWFor8yg5NLAgDJB-yvDRoCZzPw_wcB&gclsrc=aw.ds]]
string = string.replace(/http:\/\/ad\.zanox\.com\/.+ULP=\[\[(.+)\]\]/g, '$1');



// Und der Tapatalk Unsinn
string = string.replace(/(\<br\>\n)*Gesendet .+ Tapatalk.*/gi, '');
string = string.replace(/(\<br\>\n)*Sent .+ Tapatalk.*/gi, '');
string = string.replace(/(\<br\>\n)*Via Tapatalk.*/gi, '');
string = string.replace(/(\<br\>\n)*\[.*tapatalk\].*/gi, '');



// Shimpanso... wtf
string = string.replace(/Shimpanso/gi, 'Shimano');
string = string.replace(/Schimpanso/gi, 'Shimano');


document.body.innerHTML = string;