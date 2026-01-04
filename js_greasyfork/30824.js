// ==UserScript==
// @name          liChess.org Current Match Score
// @namespace     http://userstyles.org
// @description	  lichessCurrentMatch
// @author        ceberous
// @homepage      https://creatitees.info
// @include       https://lichess.org/*
// @require		  http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @run-at        document-start
// @version       0.3
// @downloadURL https://update.greasyfork.org/scripts/30824/liChessorg%20Current%20Match%20Score.user.js
// @updateURL https://update.greasyfork.org/scripts/30824/liChessorg%20Current%20Match%20Score.meta.js
// ==/UserScript==

( function() {

	var lastRecordedMatch;
	var wPlayers;
	var wCurrentScores;

	if (!String.prototype.format) {
	  String.prototype.format = function() {
	    var args = arguments;
	    return this.replace(/{(\d+)}/g, function(match, number) { 
	      return typeof args[number] != 'undefined'
	        ? args[number]
	        : match
	      ;
	    });
	  };
	}

	function normalizeString( wString ) {

	    wString = wString.split("");
	    var wL = wString.length;
	    var wF = "";
	    for ( var i = 0; i < wL; ++i ) {
	        var c = wString[i].charCodeAt(0);
	        if ( c === 10 ) { continue; }
	        if ( c === 32 ) {
	            if ( wF.length < 1 ) { continue; }
	            var x = i + 1;
	            if ( x < wL ) {
	                var d = wString[x].charCodeAt(0);
	                if ( d != 32 && d != 10 ) {
	                    wF = wF + " ";
	                }
	            }
	        }
	        else { wF = wF + wString[i]; }
	    }
	    return wF;

	}

	function scoreStringToINT( wScoreString ) {
		
		var wNumRegEx = new RegExp( "[0-9]" );
		var wTMP = wScoreString.split("");
		var wFinal = "";
		var wAddon = 0;
		for ( var i = 0; i < wTMP.length; ++i ) {
			if ( !wNumRegEx.test( wTMP[i] ) ) {
				wAddon = 0.5;
			}
			else {
				wFinal = wFinal + wTMP[i];
			}
		}
		wFinal = parseInt( wFinal );
		wFinal = wFinal + wAddon;
		return wFinal;

	}

	function getCurrentPlayers() {

		var wPlayers = $(".players").children();
		var wPLen = $(".players").children().length; 
		if ( wPLen < 1 ) { return undefined; }
	    var wWhitePlayer = $(wPlayers[0]).children();
	    wWhitePlayer = $(wWhitePlayer[0]).attr("href");
	    wWhitePlayer = wWhitePlayer.split("/@/")[1];
	    var wBlackPlayer = $(wPlayers[1]).children();
	    wBlackPlayer = $(wBlackPlayer[0]).attr("href");
	    wBlackPlayer = wBlackPlayer.split("/@/")[1];
	    //alert( wWhitePlayer + " vs " + wBlackPlayer );
	    return [ wWhitePlayer , wBlackPlayer ];

	}

	function getCurrentScore() {

		var wScores = {};

		$(".score").each( function( indx , elem ) {
			var wPN = $(elem).next("th.user").text().split(" ");
			wPN = wPN.length > 1 ? wPN[1] : wPN[0];
			var wScore = normalizeString( $(elem).text() );
			wScores[wPN] = scoreStringToINT( wScore );
		});

		return wScores;

	}

	function insertIntoScoreTable( wScore1 , wScore2 ) {

		//var wP1 = "<td><th class='score win'>{0}</th></td>".format( wScore1 );
		//var wP2 = "<td><th class='score lose'>{0}</th></td>".format( wScore2 );

		var wP1 = "<td><a>{0}</a></td>".format( wScore1 );
		var wP2 = "<td><a>{0}</a></td>".format( wScore2 );

		console.log( wP1 );
		console.log( wP2 );

		var wS = $('.crosstable > table > tbody').children();
		var wPOS = $(wS[0]).children().length - 1;
		var wP1CH = $( wS[0] ).children();
		var wP2CH = $( wS[1] ).children();
		$( wP1CH ).eq( wPOS ).after(wP1);
		$( wP2CH ).eq( wPOS ).after(wP2);

	}

	$(document).ready(function() {

		lastRecordedMatch = localStorage.getItem( "lastRecordedMatch" );
	    wPlayers = getCurrentPlayers();
	    if ( !wPlayers ) { return; }
	    console.log( wPlayers );
	    wCurrentScores = getCurrentScore();

	    var key1 = wPlayers[0] + "@/vs/@" + wPlayers[1];
	    var key2 = wPlayers[1] + "@/vs/@" + wPlayers[0];

	    var wFresh = true;
	    var wKey;
	    var wLSK1 = localStorage.getItem( key1 );
	    var wLSK2;
	    if ( wLSK1 === null ) {
	    	wLSK2 = localStorage.getItem( key2 );
	    	if ( wLSK2 === null ) {
	    		wKey = key1;
	    	}
	    	else {
	    		wFresh = false;
	    		wKey = key2;
	    	}
	    }
	    else {
	    	wFresh = false;
	    	wKey = key1;
	    }

	    //console.log( "Fresh ? = " + wFresh );
	    //console.log( "using key --> " + wKey );

	    var wTMPN = wKey.split("@/vs/@");
	    if ( wFresh ) {
	    	var wOBJ = {
	    		p1: {
	    			name: wTMPN[0],
	    			totalScore: wCurrentScores[ wTMPN[0] ],
	    			currentMatch: 0,
	    		},
	    		p2: {
	    			name: wTMPN[1],
	    			totalScore: wCurrentScores[ wTMPN[1] ],
	    			currentMatch: 0,
	    		},
	    	};
	    	wOBJ = JSON.stringify( wOBJ );
	    	localStorage.setItem( wKey , wOBJ );
	    	localStorage.setItem( "lastRecordedMatch" , wKey );
	    }
	    else {

	    	var wOldScores = JSON.parse( localStorage.getItem( wKey ) );
	    	var wP1OldScore = wOldScores.p1.totalScore;
	    	var wP2OldScore = wOldScores.p2.totalScore;
			
			//console.log( "\nOld Scores =" );
	    	//console.log( wP1OldScore );
	    	//console.log( wP2OldScore );

	    	//console.log( "\n\nNew Scores = ");
	    	//console.log( wCurrentScores );

	    	var wP1ScoreDiff , wP2ScoreDiff;

	    	// Were in the same match
	    	if ( lastRecordedMatch === wKey ) {

	    		//console.log("same match");

	    		wP1ScoreDiff = wCurrentScores[ wTMPN[0] ] - wP1OldScore;
	    		wP2ScoreDiff = wCurrentScores[ wTMPN[1] ] - wP2OldScore;

	    		wP1ScoreDiff = isNaN( wP1ScoreDiff ) ? 0.5 : wP1ScoreDiff;
	    		wP2ScoreDiff = isNaN( wP2ScoreDiff ) ? 0.5 : wP2ScoreDiff;	    		

	    		console.log( "Current Match Differences = " );
	    		console.log( wTMPN[0] + " -P1-Diff = " + wP1ScoreDiff );
	    		console.log( wTMPN[1] + " -P2-Diff = " + wP2ScoreDiff );

	    		wOldScores.p1.currentMatch = wP1ScoreDiff;
	    		wOldScores.p2.currentMatch = wP2ScoreDiff;

	    		wOldScores = JSON.stringify( wOldScores );
	    		localStorage.setItem( wKey , wOldScores );
	    		localStorage.setItem( "lastRecordedMatch" , wKey );

	    	}
	    	else { // this is a new matchup

	    		//console.log("not the same match");
	    		localStorage.removeItem( lastRecordedMatch );

				wP1ScoreDiff = wCurrentScores[ wTMPN[0] ] - wP1OldScore;
	    		wP2ScoreDiff = wCurrentScores[ wTMPN[1] ] - wP2OldScore;

	    		wP1ScoreDiff = isNaN( wP1ScoreDiff ) ? 0.5 : wP1ScoreDiff;
	    		wP2ScoreDiff = isNaN( wP2ScoreDiff ) ? 0.5 : wP2ScoreDiff;

	    		console.log( "Current Match Differences = " );
	    		console.log( wTMPN[0] + " -P1-Diff = " + wP1ScoreDiff );
	    		console.log( wTMPN[1] + " -P2-Diff = " + wP2ScoreDiff );

	    	}

	    	insertIntoScoreTable( wP1ScoreDiff , wP2ScoreDiff );

	    }

	});

})();