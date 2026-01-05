// ==UserScript==
// @name        Voyages destinations
// @namespace   https://gist.github.com/kriswebdev
// @description Supprime certains pays des destinations de voyage
// @grant       GM_addStyle
// @include     http*://www.nouvelles-frontieres.fr/*
// @include     http*://*.lastminute.com/*
// @include     http*://*.promovacances.com/*
// @require	http://code.jquery.com/jquery-2.1.1.js
// @updateUrl	https://greasyfork.org/scripts/3868-voyages-destinations/code/Voyages%20destinations.user.js
// @version     1.3
// @downloadURL https://update.greasyfork.org/scripts/3868/Voyages%20destinations.user.js
// @updateURL https://update.greasyfork.org/scripts/3868/Voyages%20destinations.meta.js
// ==/UserScript==

var blocked =  new Array(
/Maroc/i,
/Tunisie/i,
/Egypte/i,
/Turquie/i,
/Seychelles/i,
/Senegal/i,
/Sénégal/i,
/Andalousie/i,
/Croatie/i,
/France/i,
/Djerba/i
);

// URL Decomposer
// Copyleft - Nox
// { domain:"store.monkey.com",
//   sld:"monkey",
//   tld:"com",
//   rootdomain:"monkey.com",
//   path:"app/63942/",
//   args:"l=french",
//   protocol:"http",
//   rooturl:"http://store.monkey.com",
//   base:"http://store.monkey.com/app/63942" }
function decomposeURL(weburl, pgallerycontainer, handler) {//console.log('decomposeURL', weburl, pgallerycontainer, handler);
	var webmatch=weburl.match(/((https?):\/\/([^\/]+))\/?([^\?]*)[\?]?(.*)/);
	var webmatchbase=weburl.match(/(https?:\/\/[^]+)\/[^\/]*/);
	if(!webmatchbase) webmatchbase=webmatch[1]; else webmatchbase=webmatchbase[1];
	if(webmatch) {
		var webmatchd=webmatch[3].split(".");
		return {'domain':webmatch[3], 'sld':webmatchd[webmatchd.length-2], 'tld':webmatchd[webmatchd.length-1], 'rootdomain':webmatchd[webmatchd.length-2]+"."+webmatchd[webmatchd.length-1], 'path':webmatch[4], 'args':webmatch[5], 'protocol':webmatch[2], 'rooturl':webmatch[1], 'base':webmatchbase};
	} else return {};
}


var site = decomposeURL(window.location.href);

switch(site['rootdomain']) {
    case "nouvelles-frontieres.fr":
        $("h4.caps.bold.noir").each(function( index ) {
            //console.log( index + ": " + $(this).text() );
            pays =  $(this).text();
            for (var j=0, len=blocked.length;j<len;j++) {
                if(pays.match(blocked[j])) {
                    //console.log("MATCH!");
                    $(this).closest("div.results-prod-impair, div.results-prod-pair").remove();
                }
            }
        });
        break;
    case "lastminute.com":
        $("div.heading > h2").each(function( index ) {
            //console.log( index + ": " + $(this).text() );
            pays =  $(this).text(); // has leading \s's
            for (var j=0, len=blocked.length;j<len;j++) {
                if(pays.match(blocked[j])) {
                    //console.log( index + ": " + $(this).text() );
                    $(this).closest("div.holder").remove();
                }
            }
        });
        break;
}

function runner() {
    
    switch(site['rootdomain']) {
       case "promovacances.com":
       if(unsafeWindow.KV) {
           unsafeWindow.KV.messageAttente.hide = rewriteHide;
           console.log("rewritten");
           doer();
       } else window.setTimeout(runner, 2000);
           break;
    }
    
}

function doer() {console.log("doer");
    $("li span.blue.fsize11").each(function( index ) {
                console.log( index + ": " + $(this).text() );
                pays =  $(this).text().replace(/\s+\-.+$/g,""); // has leading \s's
                console.log(index+"= "+pays);
                //$(this).text(index);
                for (var j=0, len=blocked.length;j<len;j++) {
                    if(pays.match(blocked[j])) {
                        console.log( index + "[MATCH] " + $(this).text() );
                        //this.parentNode.removeChild(this);
                        $(this).closest("li").remove();
                        
                        }
                }
            });
}

window.setTimeout(runner, 2000);

function rewriteHide() {
    namespace = unsafeWindow.KV.messageAttente;
    if(namespace.background !== false) namespace.background.fadeOut("fast");
    if(namespace.messageDOM !== false) namespace.messageDOM.fadeOut("fast");
    console.log("doer called");
    window.setTimeout(doer, 2000);
}