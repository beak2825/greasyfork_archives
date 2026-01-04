// ==UserScript==
// @name     Watch Random Games
// @description     On BaseballReference adds a link to a YouTube search for a random baseball game.
// @namespace   baseballsimulator.com
// @include     https://www.baseball-reference.com/teams/*-schedule-scores.shtml
// @version  1
// @downloadURL https://update.greasyfork.org/scripts/376329/Watch%20Random%20Games.user.js
// @updateURL https://update.greasyfork.org/scripts/376329/Watch%20Random%20Games.meta.js
// ==/UserScript==

var thisURL = document.URL;

theYear = thisURL.substring(thisURL.lastIndexOf('/') + 1,thisURL.lastIndexOf('/') + 5);

var theLink;

var gameNumbers = document.evaluate("//table[@id='team_schedule']/tbody/tr/th[@data-stat='team_game']",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
var dates = document.evaluate("//table[@id='team_schedule']/tbody/tr/td[@data-stat='date_game']",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
var teams = document.evaluate("//table[@id='team_schedule']/tbody/tr/td[@data-stat='team_ID']",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
var locations = document.evaluate("//table[@id='team_schedule']/tbody/tr/td[@data-stat='homeORvis']",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
var opponents = document.evaluate("//table[@id='team_schedule']/tbody/tr/td[@data-stat='opp_ID']",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

myRandom = Math.floor(Math.random() * 162) + 1; 

var gameNumber;
var theDate;
var newMonth;
var newDate;
var newTeam;
var newOpponent;
var location;
var searchString;
var youTubeURL = 'https://www.youtube.com/results?search_query=';
var anchorTextDate;
var anchorTextString;

for (var i = 0; i < gameNumbers.snapshotLength; i++) {
  
	gameNumber = gameNumbers.snapshotItem(i);  
  
  if(i == myRandom){
    
    theDate = dates.snapshotItem(i).textContent;
    theDate = theDate.substring(theDate.indexOf(',') + 2);
    
    theMonth = theDate.substring(0,3);
    theDay = theDate.substring(4);
    
    if(theDay < 10){
     
      theDay = 0 + theDay;
      
    }
    
		switch(theMonth) {
  		case 'Mar':
    		newMonth = 'March';
    	break;
  		case 'Apr':
    		newMonth = 'April';
    	break;    
  		case 'Jun':
    		newMonth = 'June';
    	break;        
  		case 'Jul':
    		newMonth = 'July';
    	break;        
  		case 'Aug':
    		newMonth = 'August';
    	break;        
  		case 'Sep':
    		newMonth = 'September';
    	break;        
  		case 'Oct':
    		newMonth = 'October';
    	break;  
			default:
			newMonth = theMonth;        
		}
    
    newDate = newMonth + '+' + theDay + '%2C+' + theYear;
    anchorTextDate = newMonth + ' ' + theDay + ', ' + theYear;
    
    theDate = theDate.replace(theMonth,newMonth);
    
    //newDate
    
		theTeam = teams.snapshotItem(i).textContent;
    
		switch(theTeam) {
  		case 'SFG':
    		newTeam = 'SFN';
    	break;
  		case 'TBR':
    		newTeam = 'TBA';
    	break;    
  		case 'NYY':
    		newTeam = 'NYA';
    	break;        
  		case 'NYM':
    		newTeam = 'NYN';
    	break;        
  		case 'KCR':
    		newTeam = 'KCA';
    	break;        
  		case 'CHC':
    		newTeam = 'CHN';
    	break;        
  		case 'CHW':
    		newTeam = 'CHA';
    	break;
			default:
			newTeam = theTeam;
		}    
    
    //newTeam
    
    
	theOpponent = opponents.snapshotItem(i).textContent;  
    
		switch(theOpponent) {
  		case 'SFG':
    		newOpponent = 'SFN';
    	break;
  		case 'TBR':
    		newOpponent = 'TBA';
    	break;    
  		case 'NYY':
    		newOpponent = 'NYA';
    	break;        
  		case 'NYM':
    		newOpponent = 'NYN';
    	break;        
  		case 'KCR':
    		newOpponent = 'KCA';
    	break;        
  		case 'CHC':
    		newOpponent = 'CHN';
    	break;        
  		case 'CHW':
    		newOpponent = 'CHA';
    	break;
			default:
			newOpponent = theOpponent;        
		}    
    
    
	location = locations.snapshotItem(i).textContent; 
    
	if(location == '@'){
    
    searchString = newTeam + '+at+' + newOpponent + '+-+' + newDate;
    anchorTextString = newTeam + ' AT ' + newOpponent + ' - ' + anchorTextDate;
    
  }
    else
    {
    
    searchString = newOpponent + '+at+' + newTeam + '+-+' + newDate;  
		anchorTextString = newOpponent + ' AT ' + newTeam + ' - ' + anchorTextDate;      
      
    }
    
    
		youTubeURL = youTubeURL + searchString;

  }
  
}

var aboveRecordLocation = document.evaluate("//p/strong",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

aboveRecordLocation = aboveRecordLocation.snapshotItem(0);	

var theLink = document.createElement("p");


theLink.innerHTML = '<a href="'+youTubeURL+'" target="_blank">YouTube: '+anchorTextString+'</a>';

aboveRecordLocation.parentNode.insertBefore(theLink,aboveRecordLocation);
