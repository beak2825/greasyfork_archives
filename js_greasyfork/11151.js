// ==UserScript==
// @name        Diamond Dynasty Stat Keeper
// @description Add up and show stat totals from a specific group of box scores.
// @namespace   baseballsimulator.com
// @include     http://theshownation.com/boxscores/*
// @version     1
// @grant       GM_log
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/11151/Diamond%20Dynasty%20Stat%20Keeper.user.js
// @updateURL https://update.greasyfork.org/scripts/11151/Diamond%20Dynasty%20Stat%20Keeper.meta.js
// ==/UserScript==


window.scrollBy(0, 80);

var box = document.createElement('div');
	box.id = 'center_div';
	
	//box.setAttribute('style', 'position:fixed; top:'+window.innerHeight/4+'px; left:'+window.innerWidth/4+'px; border:2px solid #000; background:#D7F2FF; color:#000; padding:20px; -moz-border-radius:4px; -moz-appearance:none;');
	box.setAttribute('style', 'position:fixed; top:'+10+'px; left:'+10+'px; border:2px solid #000; background:#D7F2FF; color:#000; padding:20px; -moz-border-radius:4px; -moz-appearance:none; height:900px; overflow:auto;');	

// Center it right after it's added
alignCenter('center_div');


// Center it when page resizes
window.addEventListener('resize', function(e){alignCenter('center_div')}, false);

var thisURL = document.URL;

var thisURLID = thisURL.substring(thisURL.lastIndexOf('/')+1);

var urls = GM_getValue('urls', '');


var htmlString2 = GM_getValue('box', '');
box.innerHTML = htmlString2;

var toggle = GM_getValue('toggle', 0);

if(urls.indexOf(thisURLID) == -1){

	toggle = 0;

}

if(toggle == 1){

	document.body.appendChild(box);	

}
	

var teams =  document.evaluate("//div[@class='large-12 columns']/table/tbody/tr/td/a",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

var visitorTeam = '(' + teams.snapshotItem(0).textContent + ')';
var homeTeam = '(' + teams.snapshotItem(1).textContent + ')';

var teamChoices =  document.evaluate("//div[@class='large-6 columns']/h3[@class='sub-title']/img",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

var attendance =  document.evaluate("//ul[@class='clear-table']",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
attendance = attendance.snapshotItem(0);

var teamChoicesVisitor = teamChoices.snapshotItem(0);
var teamChoicesHome = teamChoices.snapshotItem(1);


var myButtonV = document.createElement("a");
myButtonV.setAttribute('class', 'link-to-back button small');
myButtonV.name = 'Visitor';
myButtonV.innerHTML = 'Save';

var myButtonH = document.createElement("a");
myButtonH.setAttribute('class', 'link-to-back button small');
myButtonH.name = 'Home';
myButtonH.innerHTML = 'Save';

var myButtonReset = document.createElement("a");
myButtonReset.setAttribute('class', 'link-to-back button small');
myButtonReset.name = 'Reset Stat Keeper';
myButtonReset.innerHTML = 'Reset Stat Keeper';

if(urls.indexOf(thisURLID) == -1){

	teamChoicesVisitor.parentNode.appendChild(myButtonV,teamChoicesVisitor);
	teamChoicesHome.parentNode.appendChild(myButtonH,teamChoicesHome);

}

attendance.parentNode.appendChild(myButtonReset,attendance);

var theScores = document.evaluate("//div[@class='row boxscore-wrap']/div[@class='large-1 columns text-center boxscore-score']",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

var theScoresVisitor = trim(theScores.snapshotItem(0).textContent);
var theScoresHome = trim(theScores.snapshotItem(1).textContent);


var totalsCount = 0;
var indPitchingStats;
var indBattingStats;

var indPitchingStatsV = '';
var indPitchingStatsH = '';

var indBattingStatsV = '';
var indBattingStatsH = '';

var pitchingStats;
var battingStats;

var pitchingStatsTeamV;
var pitchingStatsTeamH;

var battingStatsTeamV;
var battingStatsTeamH;

var boxscore;
var boxscores =  document.evaluate("//div[@class='large-6 columns'][1]/table/tbody/tr|//div[@class='large-6 columns'][2]/table/tbody/tr",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

for (var i = 0; i < boxscores.snapshotLength; i++) {

	boxscore = boxscores.snapshotItem(i);
	boxscore = boxscore.innerHTML;
	boxscoreArray = boxscore.split('<td>');

	if(boxscore.indexOf('Totals') != -1){

		totalsCount = totalsCount + 1;

	}

	if(totalsCount > 1){

		theTeam = homeTeam;
		theTeam2 = 'Home';
	}
	else
	{

		theTeam = visitorTeam;
		theTeam2 = 'Visitor';

	}	

	if(totalsCount < 3){		

		//theTeam2 = teams.snapshotItem(0).textContent;
		//theTeam2 = 'Visitor';
		opponent = teams.snapshotItem(1).textContent

	}
	else
	{

		//theTeam2 = teams.snapshotItem(1).textContent;
		//theTeam2 = 'Home';		
		opponent = teams.snapshotItem(0).textContent
	}	


	if(boxscoreArray.length == 9){			

		boxscoreArray[1] = trim(boxscoreArray[1].replace(/<\/?[^>]+(>|$)/g, ""));//pitcher
		boxscoreArray[2] = trim(boxscoreArray[2].replace(/<\/?[^>]+(>|$)/g, ""));//ip
		boxscoreArray[3] = trim(boxscoreArray[3].replace(/<\/?[^>]+(>|$)/g, ""));//h
		boxscoreArray[4] = trim(boxscoreArray[4].replace(/<\/?[^>]+(>|$)/g, ""));//r
		boxscoreArray[5] = trim(boxscoreArray[5].replace(/<\/?[^>]+(>|$)/g, ""));//er
		boxscoreArray[6] = trim(boxscoreArray[6].replace(/<\/?[^>]+(>|$)/g, ""));//BB
		boxscoreArray[7] = trim(boxscoreArray[7].replace(/<\/?[^>]+(>|$)/g, ""));//SO	



		if(theScoresVisitor < 20 && theScoresHome < 20){
		
			if(boxscoreArray.length == 9){

				if(boxscoreArray[1] == 'Totals'){

					if(totalsCount < 3){					

						//var pitches = visitorPitchCountPAVG;
						theTeam2 = 'Visitor';
				
					}
					else
					{

						//var pitches = homePitchCountPAVG;
						theTeam2 = 'Home';

					}



					//GM_log(boxscoreArray[1] + " " + boxscoreArray[2] + " " + boxscoreArray[3] + " " + boxscoreArray[4] + " " + boxscoreArray[5] + " " + boxscoreArray[6] + " " + theTeam2 + " " + thisURLID + " " + mysqlYesterdaysDate);

					pitchingStats = boxscoreArray[2] + "," + boxscoreArray[3] + "," + boxscoreArray[4] + "," + boxscoreArray[5] + "," + boxscoreArray[6] + "," + boxscoreArray[7] + "*";



					if(theTeam2 == 'Visitor'){

						pitchingStatsTeamV =  pitchingStats;

					}


					if(theTeam2 == 'Home'){

						pitchingStatsTeamH =  pitchingStats;

					}

					inningsPitched = boxscoreArray[2];

					//var pitchStats = GM_getValue('pitchStats','');

					//if(pitchStats.indexOf(pitchingStats) == -1){

						//pitchStats = pitchStats + pitchingStats + '|';
						//GM_setValue('pitchStats', pitchStats);				

					//}


				}
				else
				{

					var indWins = 0;
					var indLosses = 0;
					var indHolds = 0;
					var indSaves = 0;
					var indBlownSaves = 0;

					if(boxscoreArray[1].indexOf('(W)') != -1){

						boxscoreArray[1] = boxscoreArray[1].replace(' (W)','');
						indWins = 1;

					}

					if(boxscoreArray[1].indexOf('(L)') != -1){

						boxscoreArray[1] = boxscoreArray[1].replace(' (L)','');
						indLosses = 1;

					}

					if(boxscoreArray[1].indexOf('(H)') != -1){

						boxscoreArray[1] = boxscoreArray[1].replace(' (H)','');
						indHolds = 1;

					}					

					if(boxscoreArray[1].indexOf('(S)') != -1){

						boxscoreArray[1] = boxscoreArray[1].replace(' (S)','');
						indSaves = 1;

					}

					if(boxscoreArray[1].indexOf('(BS)') != -1){

						boxscoreArray[1] = boxscoreArray[1].replace(' (BS)','');
						indBlownSaves = 1;

					}					

					indPitchingStats = boxscoreArray[1]  + "," + boxscoreArray[2] + "," + boxscoreArray[3] + "," + boxscoreArray[4] + "," + boxscoreArray[5] + "," + boxscoreArray[6] + "," + boxscoreArray[7] +  "," + indWins + "," + indLosses + "," +indHolds + "," + indSaves + "," + indBlownSaves + "|";


					if(theTeam2 == 'Visitor'){

						indPitchingStatsV = indPitchingStatsV + indPitchingStats;

					}
					if(theTeam2 == 'Home'){

						indPitchingStatsH = indPitchingStatsH + indPitchingStats;

					}


				}			

			}


		}		

	}

	if(boxscoreArray.length == 10){

		//http://theshownation.com/boxscores/15045393

		boxscoreArray[1] = trim(boxscoreArray[1].replace(/<\/?[^>]+(>|$)/g, ""));//batter
		boxscoreArray[2] = trim(boxscoreArray[2].replace(/<\/?[^>]+(>|$)/g, ""));//AB
		boxscoreArray[3] = trim(boxscoreArray[3].replace(/<\/?[^>]+(>|$)/g, ""));//runs
		boxscoreArray[4] = trim(boxscoreArray[4].replace(/<\/?[^>]+(>|$)/g, ""));//Hits
		boxscoreArray[5] = trim(boxscoreArray[5].replace(/<\/?[^>]+(>|$)/g, ""));//RBIs
		boxscoreArray[6] = trim(boxscoreArray[6].replace(/<\/?[^>]+(>|$)/g, ""));//BB
		boxscoreArray[7] = trim(boxscoreArray[7].replace(/<\/?[^>]+(>|$)/g, ""));//SO
		boxscoreArray[8] = trim(boxscoreArray[8].replace(/<\/?[^>]+(>|$)/g, ""));//HR				

		if(theScoresVisitor < 20 && theScoresHome < 20){


			if(boxscoreArray[1] == 'Totals'){

				battingStats = boxscoreArray[2] + "," + boxscoreArray[3] + "," + boxscoreArray[4] + "," + boxscoreArray[5] + "," + boxscoreArray[6] + "," + boxscoreArray[7] + "," + boxscoreArray[8] + "*";

				if(theTeam2 == 'Visitor'){

					battingStatsTeamV =  battingStats;

				}

				if(theTeam2 == 'Home'){

					battingStatsTeamH =  battingStats;

				}

			}
			else
			{

				if(boxscoreArray[1].substring(1,2) == '-'){			

					boxscoreArray[1] = boxscoreArray[1].replace(boxscoreArray[1].substring(0,2),'');
				
				}


				boxscoreArray[1] = boxscoreArray[1].replace('PH-','');

				indBattingStats =  boxscoreArray[1] + "," + boxscoreArray[2] + "," + boxscoreArray[3] + "," + boxscoreArray[4] + "," + boxscoreArray[5] + "," + boxscoreArray[6] + "," + boxscoreArray[7] + "," + boxscoreArray[8] + "|";


					if(theTeam2 == 'Visitor'){

						indBattingStatsV = indBattingStatsV + indBattingStats;

					}

					if(theTeam2 == 'Home'){

						indBattingStatsH = indBattingStatsH + indBattingStats;

					}

			}			

		}

	}	

}

/*
indPitchingStatsV =  indPitchingStatsV.substring(0,indPitchingStatsV.length - 1);
indPitchingStatsV = indPitchingStatsV + "*";

indPitchingStatsH =  indPitchingStatsH.substring(0,indPitchingStatsH.length - 1);
indPitchingStatsH = indPitchingStatsH + "*";

indBattingStatsV =  indBattingStatsV.substring(0,indBattingStatsV.length - 1);
indBattingStatsV = indBattingStatsV + "*";

indBattingStatsH =  indBattingStatsH.substring(0,indBattingStatsH.length - 1);
indBattingStatsH = indBattingStatsH + "*";
*/

  var timeNow = new Date();
  var hours   = timeNow.getHours();
  var minutes = timeNow.getMinutes();
  var seconds = timeNow.getSeconds();
  var timeString = "" + ((hours > 12) ? hours - 12 : hours);
  timeString  += ((minutes < 10) ? ":0" : ":") + minutes;
  timeString  += ((seconds < 10) ? ":0" : ":") + seconds;
  timeString  += (hours >= 12) ? " P.M." : " A.M.";


function trim(stringToTrim) {
	return stringToTrim.replace(/^\s+|\s+$/g,"");
}

function alignCenter(e) {
var node = (typeof e=='string') ? document.getElementById(e) : ((typeof e=='object') ? e : false);
if(!window || !node || !node.style) {return;}
var style = node.style, beforeDisplay = style.display, beforeOpacity = style.opacity;
if(style.display=='none') style.opacity='0';
if(style.display!='') style.display = '';
style.top = Math.floor((window.innerHeight/2)-(node.offsetHeight/2)) + 'px';
style.left = Math.floor((window.innerWidth/2)-(node.offsetWidth/2)) + 'px';
style.display = beforeDisplay;
style.opacity = beforeOpacity;
}

var teamAB = 0;
var teamR = 0;
var teamH = 0;
var teamRBI = 0;
var teamBB = 0;
var teamSO = 0;
var teamHR = 0;
var teamAVG;

var teamPIP = 0;
var teamPH = 0;				
var teamPR = 0;				
var teamPER = 0;
var teamPBB = 0;
var teamPSO = 0;
var teamPERA;

//var toggle = 0;


var htmlString = '<div class="large-6 columns"><table><thead><tr class="table-header"><td>BATTER</td><td>POS</td><td>AB</td><td>R</td><td>H</td><td>RBI</td><td>BB</td><td>SO</td><td>HR</td><td>AVG</td></tr></thead>';

document.addEventListener('click', function(event) {

		
		if(toggle == 1){

			document.body.removeChild(box);
			toggle = 0;
			GM_setValue('toggle', 0);

		}
		else
		{

			if(box.innerHTML != '' && event.target.name != 'Reset Stat Keeper' && event.target.name != 'Visitor' && event.target.name != 'Home'){

				document.body.appendChild(box);
				toggle = 1;
				GM_setValue('toggle', 1);

			}


		}
		

		var indStats = GM_getValue('indStats', '');
		var indPStats = GM_getValue('indPStats', '');

		var indStatsArray = indStats.split('|');		

		var teamStats = GM_getValue('teamStats', '');

		var teamStatsArray = teamStats.split('*');

		for (var i = 0; i < teamStatsArray.length; i++) {

			var teamStatsArrayRecord = teamStatsArray[i].split(',');

			if(teamStatsArrayRecord.length > 2){

				teamAB = parseInt(teamAB) + parseInt(teamStatsArrayRecord[0]);
				teamR = parseInt(teamR) + parseInt(teamStatsArrayRecord[1]);				
				teamH = parseInt(teamH) + parseInt(teamStatsArrayRecord[2]);
				teamRBI = parseInt(teamRBI) + parseInt(teamStatsArrayRecord[3]);
				teamBB = parseInt(teamBB) + parseInt(teamStatsArrayRecord[4]);
				teamSO = parseInt(teamSO) + parseInt(teamStatsArrayRecord[5]);
				teamHR = parseInt(teamHR) + parseInt(teamStatsArrayRecord[6]);

			}

		}


		var teamPStats = GM_getValue('teamPStats', '');

		var teamPStatsArray = teamPStats.split('*');

		for (var i = 0; i < teamPStatsArray.length; i++) {

			var teamPStatsArrayRecord = teamPStatsArray[i].split(',');

			if(teamPStatsArrayRecord.length > 2){

				teamPIP = parseInt(teamPIP) + parseInt(teamPStatsArrayRecord[0]);
				teamPH = parseInt(teamPH) + parseInt(teamPStatsArrayRecord[1]);				
				teamPR = parseInt(teamPR) + parseInt(teamPStatsArrayRecord[2]);				
				teamPER = parseInt(teamPER) + parseInt(teamPStatsArrayRecord[3]);
				teamPBB = parseInt(teamPBB) + parseInt(teamPStatsArrayRecord[4]);
				teamPSO = parseInt(teamPSO) + parseInt(teamPStatsArrayRecord[5]);


			}

		}		


	if(event.target.name == 'Visitor'){

		if(urls.indexOf(thisURLID) == -1){

			urls = urls + thisURLID + ',';
			GM_setValue('urls', urls);
		}		

		//Batting
		///////////////////
		var newString = '';
		var newStringAB = 0;
		var newStringR = 0;
		var newStringH = 0;
		var newStringRBI = 0;
		var newStringBB = 0;
		var newStringSO = 0;
		var newStringHR = 0;
		var newStringAVG;

		indStats = indStats + indBattingStatsV;

		GM_setValue('indStats', indStats);

		indBattingStatsVArray = indBattingStatsV.split('|');

		indStatsArray = indStats.split('|');

		for (var i = 0; i < indStatsArray.length; i++) {

			var indStatsArrayRecord = indStatsArray[i].split(',');	

			for (var j = 0; j < indStatsArray.length; j++) {

				var indStatsArrayRecord2 = indStatsArray[j].split(',');	

				if(indStatsArrayRecord[0] == indStatsArrayRecord2[0]){				

					newStringAB = newStringAB + parseFloat(indStatsArrayRecord2[2]);
					newStringR = newStringR + parseFloat(indStatsArrayRecord2[3]);
					newStringH = newStringH + parseFloat(indStatsArrayRecord2[4]);
					newStringRBI = newStringRBI + parseFloat(indStatsArrayRecord2[5]);
					newStringBB = newStringBB + parseFloat(indStatsArrayRecord2[6]);
					newStringSO = newStringSO + parseFloat(indStatsArrayRecord2[7]);
					newStringHR = newStringHR + parseFloat(indStatsArrayRecord2[8]);
					newStringAVG = newStringH/newStringAB;
					newStringAVG = newStringAVG.toFixed(3);

				}

			}

			if(newString.indexOf(indStatsArrayRecord[0]) == -1 && newStringAB != 0){

				newString = newString  + indStatsArrayRecord[0] + "," + indStatsArrayRecord[1] + "," + newStringAB + "," + newStringR + "," + newStringH + "," + newStringRBI + "," + newStringBB + "," + newStringSO + "," + newStringHR + "|";

				htmlString = htmlString + '<tr><td>' + indStatsArrayRecord[0] + '</td><td>' + indStatsArrayRecord[1] + '</td><td>' + newStringAB + '</td><td>' + newStringR + '</td><td>' + newStringH + '</td><td>' + newStringRBI + '</td><td>' + newStringBB + '</td><td>' + newStringSO + '</td><td>' + newStringHR + '</td><td>' + newStringAVG + '</td></tr>';
				


			}

			newStringAB = 0;
			newStringR = 0;
			newStringH = 0;
			newStringRBI = 0;
			newStringBB = 0;
			newStringSO = 0;
			newStringHR = 0;			

		}


		battingStatsTeamVArray = battingStatsTeamV.split(',');

		teamAB = parseInt(teamAB) + parseInt(battingStatsTeamVArray[0]);
		teamR = parseInt(teamR) + parseInt(battingStatsTeamVArray[1]);
		teamH = parseInt(teamH) + parseInt(battingStatsTeamVArray[2]);
		teamRBI = parseInt(teamRBI) + parseInt(battingStatsTeamVArray[3]);
		teamBB = parseInt(teamBB) + parseInt(battingStatsTeamVArray[4]);
		teamSO = parseInt(teamSO) + parseInt(battingStatsTeamVArray[5]);
		teamHR = parseInt(teamHR) + parseInt(battingStatsTeamVArray[6]);
		teamAVG = teamH/teamAB;
		teamAVG = teamAVG.toFixed(3);

		teamStats = teamStats + battingStatsTeamV;

		GM_setValue('teamStats', teamStats);

		htmlString = htmlString + '<tr><td><strong>Totals</strong></td><td></td><td><strong>'+teamAB+'</strong></td><td><strong>'+teamR+'</strong></td><td><strong>'+teamH+'</strong></td><td><strong>'+teamRBI+'</strong></td><td><strong>'+teamBB+'</strong></td><td><strong>'+teamSO+'</strong></td><td><strong>'+teamHR+'</strong></td><td><strong>'+teamAVG+'</strong></td></tr></table>';

		//box.innerHTML = teamAB;


		//Pitching
		///////////////////
		
		htmlString = htmlString + '<table><tr class="table-header"><td>Pitcher</td><td>IP</td><td>H</td><td>ER</td><td>BB</td><td>SO</td><td>ERA</td><td>W/L</td><td>HLD</td><td>SV/BS</td></tr>';

		var newPString = '';
		var newPStringIP = 0;
		var newPStringH = 0;
		var newPStringR = 0;
		var newPStringER = 0;
		var newPStringBB = 0;
		var newPStringSO = 0;
		var newPStringW = 0;
		var newPStringL = 0;
		var newPStringHLD = 0;
		var newPStringS = 0;
		var newPStringBS = 0;
		var newPStringERA;

		var teamW = 0;
		var teamL = 0;
		var teamHLD = 0;
		var teamSV = 0;
		var teamBS = 0;		

		indPStats = indPStats + indPitchingStatsV;

		GM_setValue('indPStats', indPStats);		

		indPStatsArray = indPStats.split('|');

		//get team win totals
		for (var i = 0; i < indPStatsArray.length; i++) {		

			var indPStatsArrayRecord = indPStatsArray[i].split(',');

			if(indPStatsArrayRecord[0] != ''){

				teamW = teamW + parseFloat(indPStatsArrayRecord[7]);
				teamL = teamL + parseFloat(indPStatsArrayRecord[8]);
				teamHLD = teamHLD + parseFloat(indPStatsArrayRecord[9]);
				teamSV = teamSV + parseFloat(indPStatsArrayRecord[10]);
				teamBS = teamBS + parseFloat(indPStatsArrayRecord[11]);

			}			

		}		

		for (var i = 0; i < indPStatsArray.length; i++) {

			var indPStatsArrayRecord = indPStatsArray[i].split(',');	

			for (var j = 0; j < indPStatsArray.length; j++) {

				var indPStatsArrayRecord2 = indPStatsArray[j].split(',');	

				if(indPStatsArrayRecord[0] == indPStatsArrayRecord2[0]){				

					newPStringIP = newPStringIP + parseFloat(indPStatsArrayRecord2[1]);
					newPStringH = newPStringH + parseFloat(indPStatsArrayRecord2[2]);
					newPStringR = newPStringR + parseFloat(indPStatsArrayRecord2[3]);
					newPStringER = newPStringER + parseFloat(indPStatsArrayRecord2[4]);
					newPStringBB = newPStringBB + parseFloat(indPStatsArrayRecord2[5]);
					newPStringSO = newPStringSO + parseFloat(indPStatsArrayRecord2[6]);
					newPStringW = newPStringW + parseFloat(indPStatsArrayRecord2[7]);
					newPStringL = newPStringL + parseFloat(indPStatsArrayRecord2[8]);
					newPStringHLD = newPStringHLD + parseFloat(indPStatsArrayRecord2[9]);
					newPStringS = newPStringS + parseFloat(indPStatsArrayRecord2[10]);
					newPStringBS = newPStringBS + parseFloat(indPStatsArrayRecord2[11]);

					newPStringERA = newPStringER/newPStringIP;
					newPStringERA = newPStringERA * 9;
					newPStringERA = newPStringERA.toFixed(2);

					if(isNaN(newPStringERA) == true){

						newPStringERA = '0.00';

					}
				}

			}

			if(newPString.indexOf(indPStatsArrayRecord[0]) == -1){

				newPString = newPString  + indPStatsArrayRecord[0] + "," + newPStringIP + "," + newPStringH + "," + newPStringR + "," + newPStringER + "," + newPStringBB + "," + newPStringSO + "|";

				htmlString = htmlString + '<tr><td>' + indPStatsArrayRecord[0] + '</td><td>' + newPStringIP + '</td><td>' + newPStringH + '</td><td>' + newPStringER + '</td><td>' + newPStringBB + '</td><td>' + newPStringSO + '</td><td>' + newPStringERA + '</td><td>' + newPStringW + '-' + newPStringL + '</td><td>' + newPStringHLD + '</td><td>' + newPStringS + '-' + newPStringBS + '</td></tr>';


			}

			newPStringIP = 0;
			newPStringH = 0;
			newPStringR = 0;
			newPStringER = 0;
			newPStringBB = 0;
			newPStringSO = 0;
			newPStringERA = 0;
			newPStringW = 0;
			newPStringL = 0;
			newPStringHLD = 0;
			newPStringS = 0;
			newPStringBS = 0;			

		}


		pitchingStatsTeamVArray = pitchingStatsTeamV.split(',');

		teamPIP = parseInt(teamPIP) + parseInt(pitchingStatsTeamVArray[0]);
		teamPH = parseInt(teamPH) + parseInt(pitchingStatsTeamVArray[1]);
		teamPR = parseInt(teamPR) + parseInt(pitchingStatsTeamVArray[2]);
		teamPER = parseInt(teamPER) + parseInt(pitchingStatsTeamVArray[3]);
		teamPBB = parseInt(teamPBB) + parseInt(pitchingStatsTeamVArray[4]);
		teamPSO = parseInt(teamPSO) + parseInt(pitchingStatsTeamVArray[5]);

		teamPERA = teamPER/teamPIP;
		teamPERA = teamPERA * 9;
		teamPERA = teamPERA.toFixed(2);

		teamPStats = teamPStats + pitchingStatsTeamV;

		GM_setValue('teamPStats', teamPStats);

		htmlString = htmlString + '<tr><td><strong>Totals</strong></td><td><strong>'+teamPIP+'</strong></td><td><strong>'+teamPH+'</strong></td><td><strong>'+teamPER+'</strong></td><td><strong>'+teamPBB+'</strong></td><td><strong>'+teamPSO+'</strong></td><td><strong>'+teamPERA+'</strong></td><td><strong>'+teamW + '-' + teamL + '</strong></td><td><strong>' + teamHLD + '</strong></td><td><strong>' + teamSV + '-' + teamBS + '</strong></td></tr></table>';
		

		htmlString = htmlString + '</table></div>';

		box.innerHTML = htmlString;


		/*
		if(toggle == 0 && event.target.name != 'Reset Stat Keeper'){

			GM_setValue('box', htmlString);
			document.body.appendChild(box);	
			toggle = 1;

		}
		*/	

		GM_setValue('box', htmlString);
		GM_setValue('toggle', 1);
		window.location=thisURL;
		


	}//if(event.target.name == 'Visitor')		

	if(event.target.name == 'Home'){

		if(urls.indexOf(thisURLID) == -1){

			urls = urls + thisURLID + ',';
			GM_setValue('urls', urls);
		}		


		//Batting
		///////////////////
		var newString = '';
		var newStringAB = 0;
		var newStringR = 0;
		var newStringH = 0;
		var newStringRBI = 0;
		var newStringBB = 0;
		var newStringSO = 0;
		var newStringHR = 0;

		indStats = indStats + indBattingStatsH;

		GM_setValue('indStats', indStats);

		indBattingStatsHArray = indBattingStatsH.split('|');

		indStatsArray = indStats.split('|');

		for (var i = 0; i < indStatsArray.length; i++) {

			var indStatsArrayRecord = indStatsArray[i].split(',');	

			for (var j = 0; j < indStatsArray.length; j++) {

				var indStatsArrayRecord2 = indStatsArray[j].split(',');	

				if(indStatsArrayRecord[0] == indStatsArrayRecord2[0]){				

					newStringAB = newStringAB + parseFloat(indStatsArrayRecord2[2]);
					newStringR = newStringR + parseFloat(indStatsArrayRecord2[3]);
					newStringH = newStringH + parseFloat(indStatsArrayRecord2[4]);
					newStringRBI = newStringRBI + parseFloat(indStatsArrayRecord2[5]);
					newStringBB = newStringBB + parseFloat(indStatsArrayRecord2[6]);
					newStringSO = newStringSO + parseFloat(indStatsArrayRecord2[7]);
					newStringHR = newStringHR + parseFloat(indStatsArrayRecord2[8]);

					newStringAVG = newStringH/newStringAB;
					newStringAVG = newStringAVG.toFixed(3);					

				}

			}

			if(newString.indexOf(indStatsArrayRecord[0]) == -1 && newStringAB != 0){

				newString = newString  + indStatsArrayRecord[0] + "," + indStatsArrayRecord[1] + "," + newStringAB + "," + newStringR + "," + newStringH + "," + newStringRBI + "," + newStringBB + "," + newStringSO + "," + newStringHR + "|";

				htmlString = htmlString + '<tr><td>' + indStatsArrayRecord[0] + '</td><td>' + indStatsArrayRecord[1] + '</td><td>' + newStringAB + '</td><td>' + newStringR + '</td><td>' + newStringH + '</td><td>' + newStringRBI + '</td><td>' + newStringBB + '</td><td>' + newStringSO + '</td><td>' + newStringHR + '</td><td>' + newStringAVG + '</td></tr>';				


			}

			newStringAB = 0;
			newStringR = 0;
			newStringH = 0;
			newStringRBI = 0;
			newStringBB = 0;
			newStringSO = 0;
			newStringHR = 0;			

		}

		battingStatsTeamHArray = battingStatsTeamH.split(',');

		teamAB = parseInt(teamAB) + parseInt(battingStatsTeamHArray[0]);
		teamR = parseInt(teamR) + parseInt(battingStatsTeamHArray[1]);
		teamH = parseInt(teamH) + parseInt(battingStatsTeamHArray[2]);
		teamRBI = parseInt(teamRBI) + parseInt(battingStatsTeamHArray[3]);
		teamBB = parseInt(teamBB) + parseInt(battingStatsTeamHArray[4]);
		teamSO = parseInt(teamSO) + parseInt(battingStatsTeamHArray[5]);
		teamHR = parseInt(teamHR) + parseInt(battingStatsTeamHArray[6]);

		teamAVG = teamH/teamAB;
		teamAVG = teamAVG.toFixed(3);		

		teamStats = teamStats + battingStatsTeamH;

		GM_setValue('teamStats', teamStats);

		htmlString = htmlString + '<tr><td><strong>Totals</strong></td><td></td><td><strong>'+teamAB+'</strong></td><td><strong>'+teamR+'</strong></td><td><strong>'+teamH+'</strong></td><td><strong>'+teamRBI+'</strong></td><td><strong>'+teamBB+'</strong></td><td><strong>'+teamSO+'</strong></td><td><strong>'+teamHR+'</strong></td><td><strong>'+teamAVG+'</strong></td></tr></table>';

		//box.innerHTML = teamAB;

		//Pitching
		///////////////////
		
		htmlString = htmlString + '<table><tr class="table-header"><td>Pitcher</td><td>IP</td><td>H</td><td>ER</td><td>BB</td><td>SO</td><td>ERA</td><td>W/L</td><td>HLD</td><td>SV/BS</td></tr>';	
		
		var newPString = '';
		var newPStringIP = 0;
		var newPStringH = 0;
		var newPStringR = 0;
		var newPStringER = 0;
		var newPStringBB = 0;
		var newPStringSO = 0;
		var newPStringW = 0;
		var newPStringL = 0;
		var newPStringHLD = 0;
		var newPStringS = 0;
		var newPStringBS = 0;		
		var newPStringERA;	

		var teamW = 0;
		var teamL = 0;
		var teamHLD = 0;
		var teamSV = 0;
		var teamBS = 0;	

		indPStats = indPStats + indPitchingStatsH;

		GM_setValue('indPStats', indPStats);		

		indPStatsArray = indPStats.split('|');

		//get team win totals
		for (var i = 0; i < indPStatsArray.length; i++) {		

			var indPStatsArrayRecord = indPStatsArray[i].split(',');

			if(indPStatsArrayRecord[0] != ''){

				teamW = teamW + parseFloat(indPStatsArrayRecord[7]);
				teamL = teamL + parseFloat(indPStatsArrayRecord[8]);
				teamHLD = teamHLD + parseFloat(indPStatsArrayRecord[9]);
				teamSV = teamSV + parseFloat(indPStatsArrayRecord[10]);
				teamBS = teamBS + parseFloat(indPStatsArrayRecord[11]);

			}			

		}

		for (var i = 0; i < indPStatsArray.length; i++) {

			var indPStatsArrayRecord = indPStatsArray[i].split(',');	

			for (var j = 0; j < indPStatsArray.length; j++) {

				var indPStatsArrayRecord2 = indPStatsArray[j].split(',');	

				if(indPStatsArrayRecord[0] == indPStatsArrayRecord2[0]){				

					newPStringIP = newPStringIP + parseFloat(indPStatsArrayRecord2[1]);
					newPStringH = newPStringH + parseFloat(indPStatsArrayRecord2[2]);
					newPStringR = newPStringR + parseFloat(indPStatsArrayRecord2[3]);
					newPStringER = newPStringER + parseFloat(indPStatsArrayRecord2[4]);
					newPStringBB = newPStringBB + parseFloat(indPStatsArrayRecord2[5]);
					newPStringSO = newPStringSO + parseFloat(indPStatsArrayRecord2[6]);
					newPStringW = newPStringW + parseFloat(indPStatsArrayRecord2[7]);
					newPStringL = newPStringL + parseFloat(indPStatsArrayRecord2[8]);
					newPStringHLD = newPStringHLD + parseFloat(indPStatsArrayRecord2[9]);
					newPStringS = newPStringS + parseFloat(indPStatsArrayRecord2[10]);
					newPStringBS = newPStringBS + parseFloat(indPStatsArrayRecord2[11]);	


					newPStringERA = newPStringER/newPStringIP;
					newPStringERA = newPStringERA * 9;
					newPStringERA = newPStringERA.toFixed(2);

					if(isNaN(newPStringERA) == true){

						newPStringERA = '0.00';

					}					

				}

			}

			if(newPString.indexOf(indPStatsArrayRecord[0]) == -1){

				newPString = newPString  + indPStatsArrayRecord[0] + "," + newPStringIP + "," + newPStringH + "," + newPStringR + "," + newPStringER + "," + newPStringBB + "," + newPStringSO + "|";

				htmlString = htmlString + '<tr><td>' + indPStatsArrayRecord[0] + '</td><td>' + newPStringIP + '</td><td>' + newPStringH + '</td><td>' + newPStringER + '</td><td>' + newPStringBB + '</td><td>' + newPStringSO + '</td><td>' + newPStringERA + '</td><td>' + newPStringW + '-' + newPStringL + '</td><td>' + newPStringHLD + '</td><td>' + newPStringS + '-' + newPStringBS + '</td></tr>';				


			}

			newPStringIP = 0;
			newPStringH = 0;
			newPStringR = 0;
			newPStringER = 0;
			newPStringBB = 0;
			newPStringSO = 0;
			newPStringERA = 0;
			newPStringW = 0;
			newPStringL = 0;
			newPStringHLD = 0;
			newPStringS = 0;
			newPStringBS = 0;	


		}		

		pitchingStatsTeamHArray = pitchingStatsTeamH.split(',');

		teamPIP = parseInt(teamPIP) + parseInt(pitchingStatsTeamHArray[0]);
		teamPH = parseInt(teamPH) + parseInt(pitchingStatsTeamHArray[1]);
		teamPR = parseInt(teamPR) + parseInt(pitchingStatsTeamHArray[2]);
		teamPER = parseInt(teamPER) + parseInt(pitchingStatsTeamHArray[3]);
		teamPBB = parseInt(teamPBB) + parseInt(pitchingStatsTeamHArray[4]);
		teamPSO = parseInt(teamPSO) + parseInt(pitchingStatsTeamHArray[5]);

		teamPERA = teamPER/teamPIP;
		teamPERA = teamPERA * 9;
		teamPERA = teamPERA.toFixed(2);

		teamPStats = teamPStats + pitchingStatsTeamH;

		GM_setValue('teamPStats', teamPStats);

		htmlString = htmlString + '<tr><td><strong>Totals</strong></td><td><strong>'+teamPIP+'</strong></td><td><strong>'+teamPH+'</strong></td><td><strong>'+teamPER+'</strong></td><td><strong>'+teamPBB+'</strong></td><td><strong>'+teamPSO+'</strong></td><td><strong>'+teamPERA+'</strong></td><td><strong>'+ teamW + '-' + teamL +'</strong></td><td><strong>' + teamHLD + '</strong></td><td><strong>' + teamSV + '-' + teamBS +'</strong></td></tr></table>';		
		
		htmlString = htmlString + '</table></div>';	
		box.innerHTML = htmlString;		

		/*
		if(event.target.name != 'Reset Stat Keeper'){

			GM_setValue('box', htmlString);
			document.body.appendChild(box);
			toggle = 1;

		}
		*/

		GM_setValue('box', htmlString);
		GM_setValue('toggle', 1);
		window.location=thisURL;		
	}



	if(event.target.name == 'Reset Stat Keeper'){		

		GM_setValue('teamStats', '');
		GM_setValue('teamPStats', '');
		GM_setValue('indStats', '');
		GM_setValue('indPStats', '');
		GM_setValue('urls', '');
		GM_setValue('box', '');

		window.location=thisURL;
	
	}



}, true);	



