/* This program is free software. It comes without any warranty, to 
 * the extent permitted by applicable law. You can redistribute it 
 * and/or modify it under the terms of the Do What The Fuck You Want 
 * To Public License, Version 2, as published by Sam Hocevar. See 
 * http://www.wtfpl.net/ for more details. */ 

// ==UserScript== 

// @name        Transfermarkt 3 to 1 
// @namespace   fussball 
// @include     http://fussballcup.de/ 
// @version    	0.1
// @description displays 3 pages in 1 when viewing Transfermarkt 
// @author 	Philipp 
// @downloadURL https://update.greasyfork.org/scripts/440931/Transfermarkt%203%20to%201.user.js
// @updateURL https://update.greasyfork.org/scripts/440931/Transfermarkt%203%20to%201.meta.js
// ==/UserScript==   


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
    if(searchResults.children.length == 2){
        // only one page available
        searchResults = searchResults.children[1];
    }else{
        // more than one page available
        searchResults = searchResults.children[2];
    }
    return searchResults.children[2].children;
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





var testObj = "3to1_success"

function getAppendChildren(playerTable){
    return function(players){
        for(var x=0; x<players.length; x++){
            playerTable.appendChild(players[x]);
        }
    }
}

function changes(){
    // check for need to do anything
    current_url = window.location.href;
    if (current_url.indexOf('module=transfermarket') == -1){
        return
    }
    if (current_url.indexOf('action=index') == -1){
        return
    }

    // yes, it's transferemarkt page
    if(document.getElementById(testObj) != null){
        // allready added
        return;
    }

    // mark 3to1 success
    document.getElementsByClassName('container transfermarket')[0].id = testObj;

    // execute 3to1
    var currentPage = getCurrentPlayerMarketPage();
    var maxPage = getMaxPlayerMarketPages();

    if (currentPage >= maxPage){
        // nothing to do
        return;
    }

    // add next 2 pages
    var updateTo = currentPage + 2;
    if(updateTo > maxPage){
        updateTo = maxPage;
    }

    var playerTable = document.getElementsByClassName('table-container')[0];
    playerTable = playerTable.getElementsByTagName('table')[0];
    playerTable = playerTable.getElementsByTagName('tbody')[0];
    for(var x=currentPage+1; x<=updateTo; x++){
        findPlayersOnMarket(getAppendChildren(playerTable), x);
    }

}


window.setTimeout(function() { changes() }, 2500);
window.setInterval(function() { changes() }, 5000);
