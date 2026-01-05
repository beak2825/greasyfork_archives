// ==UserScript==
// @name           stfu
// @namespace      2
// @description    silence of the spam
// @version        2.06
// @include        http://blogs.crikey.com.au/*
// @include        http://www.crikey.com.au/*
// @include        https://blogs.crikey.com.au/*
// @include        https://www.crikey.com.au/*
// @require 	   https://greasyfork.org/scripts/1884-gm-config/code/GM_config.js?version=4836
//                 https://greasyfork.org/en/scripts/18683-stfu
// @downloadURL https://update.greasyfork.org/scripts/18683/stfu.user.js
// @updateURL https://update.greasyfork.org/scripts/18683/stfu.meta.js
// ==/UserScript==
// Ver 2.01
// New major version to deal with New, souped-up Crikey
// The first rule of stfu: stfu about stfu
// Ver 2.02
// Settings optionally at the bottom
// Ver 2.03
// Fixed issue with cccp v5.22 
// Ver 2.04
// Fixed issues caused by Crikey updates
// Ver 2.05
// Removed debug code
// Ver 2.06
// Fixed https URLs in @include
var scriptVer = '2.06';
////////////////////////////////////////////////////////////////////////////////
/*jslint browser: true */
/*global GM_config, GM_registerMenuCommand */
////////////////////////////////////////////////////////////////////////////////
//don't run in iframes
if (window.top !== window.self) {return;}
////////////////////////////////////////////////////////////////////////////////
// Config settings dialog
GM_config.storage = 'stfu';
GM_config.init('stfu - Ver ' + scriptVer,
	{
		authorsFilter: {
			label: 'Author filter (use the format: \'bob1234|L. Ron Hubbard|Joseph Smith, Jr.\')',
			type: 'text',
			'default': 'bob1234',
			size:50
		},
		wordsFilter: {
			label: 'Word/phrase filter (use the format: \'programmatic specificity|leadership rumblings\')',
			type: 'text',
			'default': '',
			size:50
		},
		settingsBottom: {
			label: 'Place Settings bar at the bottom',
            type: 'checkbox',
            'default': false
		}
	},
	{
		save: function() { location.reload(); } // reload the page when configuration was changed
	}
);
////////////////////////////////////////////////////////////////////////////////
function showConfigSTFU() {GM_config.open();}
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//  Declare Global Hashtable
var gh = [];
////////////////////////////////////////////////////////////////////////////////
// Run if DOM is ready, otherwise add a listerner to wait
if (document.readyState == "complete" || document.readyState == "loaded" || document.readyState == "interactive") {main();}
else {window.addEventListener('DOMContentLoaded',function(e){main();});}
////////////////////////////////////////////////////////////////////////////////
//  Init Global Hash Variables
function initGlobalHash() {
    // Filters
    gh["flt.authors"]  = GM_config.get('authorsFilter').toLowerCase();
    gh["flt.words"]    = GM_config.get('wordsFilter').toLowerCase();
}
////////////////////////////////////////////////////////////////////////////////

function main() {
    console.log('stfu: main()');
    initGlobalHash();
    stfuNavBar();
    stfuFilters();
}
////////////////////////////////////////////////////////////////////////////////
//  Create a new stfu_nav <div> with space for settings
function stfuNavBar() {
    var comments = document.getElementById("comments");
    if (! comments) {return;}

    var stfu_nav = document.createElement('div');
    stfu_nav.id = "stfu_nav";
   
    if (GM_config.get('settingsBottom')) {
        comments.appendChild(stfu_nav);
    } else {
        comments.insertBefore(stfu_nav,comments.firstChild);
    }

    var nav = ["hlp","set","rec"];
    var alg = ["left","center","right"];

    var tbl = document.createElement('table');
    stfu_nav.appendChild(tbl);
    var row = document.createElement('tr');
    tbl.appendChild(row);

    for (var i = 0; i < nav.length; i++) {
        var td = document.createElement('td');
        td.width = '33%';
        row.appendChild(td);
        var dv = document.createElement('div');
        dv.id = 'stfu_' + nav[i];
        dv.style = "text-align: " +  alg[i] + ";";
        td.appendChild(dv);
    }
    // Add the stfu Settings Link
    var set = document.createElement("a");
    document.getElementById("stfu_set").appendChild(set);
    set.innerHTML = "stfu Settings";
    set.addEventListener("click", showConfigSTFU, false);
}
////////////////////////////////////////////////////////////////////////////////
function toggleComment(){
  var elem = this.parentNode.nextSibling;
  if (elem.style.display == 'none') {
    elem.style.display = 'block';
    this.innerHTML = this.innerHTML.replace(/Show Comment/g,'Hide Comment');
  } else {
    elem.style.display = 'none';
    this.innerHTML = this.innerHTML.replace(/Hide Comment/g,'Show Comment');
  }
}
////////////////////////////////////////////////////////////////////////////////
function  stfuFilters() {
    console.log('stfu: stfuFilters()');
    if ( document.getElementsByClassName("comment-list").length === 0) {return;}
    var afon = ( gh["flt.authors"] !== null && gh["flt.authors"].replace(/\s*/,'').length > 0 );
    var wfon = ( gh["flt.words"  ] !== null && gh["flt.words"  ].replace(/\s*/,'').length > 0 );
    if ( ! afon && ! wfon ) {return;}
	var af = '^' + gh["flt.authors"].replace(/\|/g,'$|^') + '$';
	var wf = gh["flt.words"];

    var ol = document.getElementsByClassName("comment-list")[0];
    var cl = ol.getElementsByTagName("li");
//    console.log('stfu: cl.length = ' + cl.length);
    for ( var i = 0 ; i < cl.length; i++ ) {
        var author = getAuthor(cl[i].firstChild);
//        console.log('stfu: author = ' + author);
        if (afon && author.match(af)) {stfuFilter(cl[i], author, 'Author');}
        if ( ! wfon) {continue;}
        var text = cl[i].getElementsByClassName('comment-content')[0].innerHTML.toLowerCase();
        if (text.match(wf)) {stfuFilter(cl[i], author, 'Words');}

    }
}
//----------------------------------------------------------------------------//
function  getAuthor(e) {
    var author;
    var a = e.parentNode.getElementsByClassName('fn')[0];
    if ( a.firstChild.innerHTML === undefined ) {
        author = a.innerHTML;
    } else {
        author = a.firstChild.innerHTML;
    }
    return author.toLowerCase();
}
//----------------------------------------------------------------------------//
function  stfuFilter(e, author, reason) {
    if ( e.style.display == 'none') {return;}
    e.style.display = 'none';
    var p = document.createElement('p');
    var a = document.createElement('a');
    a.addEventListener("click", toggleComment, true);
    p.appendChild(a);
    e.parentNode.insertBefore(p,e);
    a.innerHTML = author + ' - Show Comment (' + reason + ')';
}