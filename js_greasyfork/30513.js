/* This program is free software. It comes without any warranty, to 
 * the extent permitted by applicable law. You can redistribute it 
 * and/or modify it under the terms of the Do What The Fuck You Want 
 * To Public License, Version 2, as published by Sam Hocevar. See 
 * http://www.wtfpl.net/ for more details. */ 

// ==UserScript== 

// @name        Transfermarkt Nation Filter 
// @namespace   fussball 
// @include     https://fussballcup.de/ 
// @version    	0.1.2
// @description Filter Transfermarkt 
// @author 	Philipp, edited by mot33 / 2018
// @connect <value>
// @downloadURL https://update.greasyfork.org/scripts/30513/Transfermarkt%20Nation%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/30513/Transfermarkt%20Nation%20Filter.meta.js
// ==/UserScript==   

var injectObj = 'show_german_switch';


/**
 *	e. g. Gracemonkey won't let us access custom script from webpage (e. g. as <a href=javascript:...) 
 *	use this scirpt to inject JS-Code directely in DOM-tree so you can access this code from web page 
 */
function injectJS(code, id){
	var scriptId = "custom_script_" + id;
	if(document.getElementById(scriptId)){
		// element allready added; ignore!
		return;
	}

	var script = document.createElement('script');
	script.id = "script_" + id;
	script.appendChild(document.createTextNode(code));
	(document.body || document.head || document.documentElement).appendChild(script);
}


injectJS(`
current_view_other = true;
current_view_german = true;

var flag_filter = "flag_filer_table_ok";


/**
 * really simple log system
 */
function logError(msg){
	console.log("ERROR   ==> " + appName + ": " + msg);
}

function logWarning(msg){
}

function logInfo(msg){
}


var timeout = 5000;
/**
* Simply creates async html request with url theURL; calls back callback with result string as first parameter
*
* Case of error; null is returned as result String
*/
function httpGetAsync(theUrl, callback){
	logInfo('send Http request: ' + theUrl);


	var xmlHttp = new XMLHttpRequest();

   	xmlHttp.onreadystatechange = function() { 
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
			logInfo('http request returned: ' + xmlHttp.responseText);
			callback(xmlHttp.responseText);
		}
	}

    	xmlHttp.open('GET', theUrl, true); // true for asynchronous 
   	xmlHttp.send(null);

	// handle timeout
	window.setTimeout(function(){
		if (xmlHttp.readyState != 4 || xmlHttp.status != 200){
			// something went wrong
			// cancel
			xmlHttp.abort();
			// call callback with error
			callback(null);
		}
	}, timeout);
}

/**
 * @constructor
 * @param {Array[String]} params - Array containing all parameter (
 * @param {string} callback - to be called with result String as first parameter
 */

function httpRequestFootball(params, callback){
    var paramString = '';
    var preAnd = '';
    for (var i=0; i<params.length; i++){
        var para = params[i];
        paramString += preAnd + (para[0] + '=' + para[1]);
        preAnd = '&';
    }
	httpGetAsync('/index.php?w=' + worldId + '&' + paramString, callback);
}																



function getMaxPlayerMarketPages(){
    var searchResults = document.getElementsByClassName('table-container')[0];
    if(searchResults.children.length == 2){
        // only one page available
        return 1;        
    }else{
        // more than one page available
        var avail_pages = searchResults.children[1].children;
        avail_pages = avail_pages[avail_pages.length - 1].innerHTML;
        return parseInt(avail_pages);                        
    }
}

function getCurrentPlayerMarketPage(){
    var searchResults = document.getElementsByClassName('table-container')[0];
    if(searchResults.children.length == 2){
        // only one page available
        return 1;        
    }else{
        // more than one page available
        return parseInt(searchResults.getElementsByTagName('strong')[0].innerHTML);
    }

}

function pageToPlayers(page){
    var searchResults = page.getElementsByClassName('table-container')[0];
    odds = searchResults.getElementsByClassName('odd');
    evens = searchResults.getElementsByClassName('even');
    ret = new Array(odds.length + evens.length);
    for(var i=0; i<odds.length; i++){
            ret[2*i] = odds[i];
            ret[2*i+1] = evens[i];
    }
    if(odds.length > evens.length){
        ret[odds.length + evens.length -1] = odds[odds.length - 1];
    }
    return ret;
}

/**
*	synchron (blocking) function
*	not cached; downloads content
*	will search all players 
*   call callback with first parameter: list of all found players
*/
function findPlayersOnMarket(callback, page){
	httpRequestFootball([['area', 'user'],
                         ['module', 'transfermarket'],
                         ['action', 'index'],
                         ['path', 'index.php'],
                         ['layout', 'none'],
                         ['club', ''],
                         ['_qf__searchform', ''],

                         ['pos', page*25-25],
                         ],
                        function(resultString){
                            var parser = document.createElement('html');
                            parser.innerHTML = JSON.parse(resultString).content;
                            callback(pageToPlayers(parser));
                        });

}





function showAll(){
    set_visible(true, true);
}

function showNoGerman(){
    set_visible(false, true);
}


function set_visible(german, other){
    current_view_german = german;
    current_view_other = other;

    // set flag: if table modified, this element should (!) be deleted!
    var div = document.createElement('div');
    div.id = flag_filter;
    document.getElementsByClassName('container transfermarket')[0].appendChild(div); 

    // generate visibility flags
    german = german ? '' : 'none';
    other = other ? '' : 'none';

    // show / hide + color adjust
    is_odd = true;

    var players = pageToPlayers(document);
    for(var x=0; x<players.length; x++){
        try{
            // show/hide
            var player = players[x];
            if(player.children[0].children[0].src.endsWith('DEU.gif')){
                // german player
                player.style.display = german;
            }else{
                // other
                player.style.diplay = other;
            }

            // color adjust
            if(player.style.display == ''){
                if(is_odd){
                    player.className = "odd";
                }else{
                    player.className = "even";
                }
                is_odd = !is_odd;
            }
        }catch(err){
            console.log(err);
        }
    }
}

// automatic adjust
function fix_changes(){
    if(document.getElementById(flag_filter) == null){
        // need to update!
        set_visible(current_view_german, current_view_other);
    }
}

window.setInterval(function() { fix_changes() }, 1000);

`, 'transfermarket_filter');


function transfermarkt_filter (){
    // check for need to do anything
    current_url = window.location.href;
    if (current_url.indexOf('module=transfermarket') == -1){
        return;
    }
    if (current_url.indexOf('action=index') == -1){
        return;
    }

    // yes, it's transferemarkt page
    if(document.getElementById(injectObj) != null){
        // allready added
        return;
    }

    
    var s = '&#10148; <a href=javascript:showAll()>Alle Spieler</a><br />&#10148; <a href=javascript:showNoGerman()>Nur Ausländische Spieler<br /> </a> &#10148; <a target= _blank href=http://forum.fussballcup.de/forumdisplay.php?f=20()>Spieler Angebote aus dem Forum</a>';
	var div = document.createElement('div');
    div.id = injectObj;
	div.innerHTML = s;

    document.getElementsByClassName('table-container')[0].children[0].appendChild(div);
}




window.setInterval(function() { transfermarkt_filter ();}, 2500);
