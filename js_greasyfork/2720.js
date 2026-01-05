// ==UserScript==
// @name        personnel package data
// @namespace   DeepRoute
// @include     http://deeproute.com/?js=weekbyweek*
// @include     http://www.deeproute.com/?js=weekbyweek*
// @include     http://deeproute.com/default.asp?js=weekbyweek*
// @include     http://www.deeproute.com/default.asp?js=weekbyweek*
// @include     http://deeproute.com/?js=scrimmine
// @grant		GM_xmlhttpRequest
// @connect	    deeproute.com
// @version     1.7.0
// @description   a program to parse game logs for the deeproute.com football game
// @downloadURL https://update.greasyfork.org/scripts/2720/personnel%20package%20data.user.js
// @updateURL https://update.greasyfork.org/scripts/2720/personnel%20package%20data.meta.js
// ==/UserScript==

// temporary coverage string parameter
var expectedCoverageString = ""; // ex: Cover 3
var expectedCoverage2String = ""; // ex: Tampa

// temporary down/distance parameters to be modified
var downMin = 1;
var downMax = 4;
var distMin = -10; // -10 default is arbitrary "smallest possible" value
var distMax = 100; // 100 default is arbitrary "largest possible" value

var teamlist=[];
var abbrlist=[];

var teams=[];
var abbrs=[];
var weeks=[];

var teamID=[], links=[], readcount=0, readtarget=1, detailedPackageStats=[], packageYards=[];
var sumPackageStats=[], sumDownStats=[], sumAllPackages =[];
var WRSplitStats=[];
var WRPlayerStats=[];
var IDPStats=[];
var RBPlayerStats=[];
var rushGainSplits=[];
var defPkgSplitStats =[];
var defPkgs=[];
var conversionStats=[];
var passDistSplitStats=[];
var sackStats=[];
var kickoffStats_array=[];
var puntStats_array=[];
var fieldGoalStats_array=[];

var showOffense = 1;
var showBothTeams = 0;
var runPassSplits = 0;
var WRTargetSplits = 0;
var WRProductionSplits = 0;
var individualWRStats = 0;
var individualDefenderStats = 0;
var individualRunnerStats = 0;
var defPkgSplits = 0;
var conversions = 0;
var passDistSplits = 0;
var showSacks = 0;
var kickoffStats_bol = 0;
var puntStats_bol = 0;
var fieldGoalStats_bol = 0;

var Preseason = 0;
var RegularSeason = 0;
var Postseason = 0;

var shortSplit = 3;
var longSplit = 7;

var withPens = 0;
var isFirstRun = 1;

/*************************************/
/***** Generic Utility Functions *****/
/*************************************/

function isTeam(inteam) { // return 1 if inteam is a team name, 0 otherwise
	for (var x=0; x<teams.length; x++) {
		if (teams[x] == inteam) {
			return 1;
		}
	}
	return 0;
}

function getTeamIndex(inteam) {
	for (var x=0; x<teams.length; x++) {
		if (teams[x] == inteam) {
			return x;
		}
	}
	return -1;
}

function getAllTeamsIndex(inteam) {
	for (var x=0; x<teamlist.length; x++) {
		if (teamlist[x] == inteam) {
			return x;
		}
	}
	return -1;
}

function getTeamIndexFromAbbr(inabbr) {
	for (var x=0; x<abbrs.length; x++) {
		if (abbrs[x] == inabbr) {
			return x;
		}
	}
	return -1;
}

function isAbbr(inabbr) {
	for (var x=0; x<abbrs.length; x++) {
		if (abbrs[x] == inabbr) {
			return 1;
		}
	}
	return 0;
}

/*function correctAbbr(inabbr, showOffense) {
	var isGiven = isAbbr(inabbr);
	if (isGiven) {
		return 1;
	} else {
		return !showOffense;
	}
}*/

function correctAbbr(offAbbr, defAbbr, showOffense) {
	var offGiven = isAbbr(offAbbr);
	var defGiven = isAbbr(defAbbr);
	if (showOffense) {
		return offGiven;
	} else {
		return defGiven;
	}
}

function getOtherAbbr(inabbr, abbr1, abbr2) {
	if (inabbr == abbr1) {
		return abbr2;
	}
	else if (inabbr == abbr2) {
		return abbr1;
	}
	else {
		alert("abbr '" + inabbr + "' did not match '" + abbr1 + "' or '" + abbr2 + "'");
	}
}

function isID(inid) {
	for (var x=0; x<teamID.length; x++) {
		if (teamID[x]==inid) return 1;
	}
	return 0;
}

function getDistToGo(inTogo, inEndToGo) {
	var distToGo=0;
	if (inTogo=="inches") {
		distToGo=0.1;
	} else if (inTogo=="Foot~") {
		distToGo=0.33;
	} else if (inTogo=="< 1") {
		distToGo=0.67;
	} else {
		distToGo=parseInt(inTogo);
		if (isNaN(distToGo)) {
			return -1;
		}
	}
	if (inEndToGo=="+") {
		distToGo+=0.25;
	} else if (inEndToGo=="-") {
		distToGo-=0.25;
	}
	return distToGo;
}

function convertDownToInt(downString) {
	var downInt = -1;
	if (downString == "1st") {
		downInt = 1;
	}
	else if (downString == "2nd") {
		downInt = 2;
	}
	else if (downString == "3rd") {
		downInt = 3;
	}
	else if (downString == "4th") {
		downInt = 4;
	}

	return downInt;
}

function getPkgid(inPkg) {
	var pkgid=-1;
	if (inPkg=="H F T 1 2" || inPkg=="HFT12") {
		pkgid=0;
	} else if (inPkg=="H F T t 1" || inPkg=="HFTt1") {
		pkgid=1;
	} else if (inPkg=="H T t 1 2" || inPkg=="HTt12") {
		pkgid=2;
	} else if (inPkg=="H F 1 2 3" || inPkg=="HF123") {
		pkgid=3;
	} else if (inPkg=="H T 1 2 3" || inPkg=="HT123") {
		pkgid=4;
	} else if (inPkg=="H 1 2 3 4" || inPkg=="H1234") {
		pkgid=5;
	} else if (inPkg=="T 1 2 3 4" || inPkg=="T1234") {
		pkgid=6;
	} else if (inPkg=="1 2 3 4 5" || inPkg=="12345") {
		pkgid=7;
	}
	return pkgid;
}

function getDefPkgid(inPkg) {
	var pkgid = -1;
	if (inPkg=="4-3-4") {
		pkgid=0;
	} else if (inPkg=="4-2-5") {
		pkgid=1;
	} else if (inPkg=="4-1-6") {
		pkgid=2;
	} else if (inPkg=="4-0-7") {
		pkgid=3;
	} else if (inPkg=="4-4-3") {
		pkgid=4;
	} else if (inPkg=="3-4-4") {
		pkgid=5;
	} else if (inPkg=="3-3-5") {
		pkgid=6;
	} else if (inPkg=="3-2-6") {
		pkgid=7;
	} else if (inPkg=="3-1-7") {
		pkgid=8;
	} else if (inPkg=="3-0-8") {
		pkgid=9;
	} else if (inPkg=="3-5-3") {
		pkgid=10;
	} else if (inPkg=="5-2-4") {
		pkgid=11;
	} else if (inPkg=="5-3-3") {
		pkgid=12;
	} else if (inPkg=="5-4-2") {
		pkgid=13;
	} else if (inPkg=="6-1-4") {
		pkgid=14;
	} else if (inPkg=="6-2-3") {
		pkgid=15;
	} else if (inPkg=="6-3-2") {
		pkgid=16;
	} else if (inPkg=="7-2-2") {
		pkgid=17;
	} else if (inPkg=="7-3-1") {
		pkgid=18;
	}
	return pkgid;
}

function fillDefPkgs() {
	defPkgs[0] = "4-3-4";
	defPkgs[1] = "4-2-5";
	defPkgs[2] = "4-1-6";
	defPkgs[3] = "4-0-7";
	defPkgs[4] = "4-4-3";
	defPkgs[5] = "3-4-4";
	defPkgs[6] = "3-3-5";
	defPkgs[7] = "3-2-6";
	defPkgs[8] = "3-1-7";
	defPkgs[9] = "3-0-8";
	defPkgs[10] = "3-5-3";
	defPkgs[11] = "5-2-4";
	defPkgs[12] = "5-3-3";
	defPkgs[13] = "5-4-2";
	defPkgs[14] = "6-1-4";
	defPkgs[15] = "6-2-3";
	defPkgs[16] = "6-3-2";
	defPkgs[17] = "7-2-2";
	defPkgs[18] = "7-3-1";
}

function getWRID(WR) {
	if (WR == "WR1") {
		return 0;
	}
	if (WR == "WR2") {
		return 1;
	}
	if (WR == "WR3") {
		return 2;
	}
	if (WR == "WR4") {
		return 3;
	}
	if (WR == "WR5") {
		return 4;
	}
	if (WR == "TE1") {
		return 5;
	}
	if (WR == "TE2") {
		return 6;
	}
	if (WR == "HB " || WR == "HB") {
		return 7;
	}
	if (WR == "FB " || WR == "FB") {
		return 8;
	}
	else {
		return -1;
	}
}

// NOTE: Function incomplete
function getDefID(def) {
	var id = -1;
	if (def == "C1 <") {
		id = 0;
	}
	else if (def == "C2 <") {
		id = 1;
	}
	return id;
}

function getFieldGoalDistId(dist) {
	// PAT, 0-20, 20-30, 30-40, 40-50, 50+
	var id = -1;
	if (dist < 20) {
		id = 1;
	}
	else if (dist < 30) {
		id = 2;
	}
	else if (dist < 40) {
		id = 3;
	}
	else if (dist < 50) {
		id = 4;
	}
	else {
		id = 5;
	}
	return id;
}

function getPuntFieldPositionId(yardline) {
	// own goal to own 40, own 40 to opp 40, opp 40 to opp goal
	var id = -1;
	var distToGoal = getDistToGoal(yardline, 1);

	if (distToGoal > 60) {
		id = 0;
	}
	else if (distToGoal > 40) {
		id = 1;
	}
	else if (distToGoal > -1) {
		id = 2;
	}

	return id;
}

// convert a yardline (eg, "Opp 43") into distance from the goal line
// "Opp 43" would be 43 yards as the Offensive team, 57 yards as the Defensive team
// the Offensive team is defined as the team currently posessing the ball
function getDistToGoal(yardline, asOffense) {
	var fieldSide;
	var distToGoal;

	if (yardline.includes("Midfield")) {
		distToGoal = 50;
	}
	else {
		fieldSide = yardline.substring(0, 3);
		distToGoal = parseInt(yardline.substring(4));

		if ((asOffense && fieldSide === "Own") || (!asOffense && fieldSide == "Opp")) {
			distToGoal = 100 - distToGoal;
		}
	}

	return distToGoal;
}

function calculatePercent(numerator, denominator) {
	var result = 0;
	if (denominator !== 0) {
		result = numerator / denominator;
	}
	return (result*100).toFixed(1);
}

function calculateAverage(numerator, denominator) {
	var result = 0;
	if (denominator !== 0) {
		result = numerator / denominator;
	}
	return result.toFixed(1);
}

function calculatePercentOrNone(numerator, denominator) {
	if (denominator === 0) {
		return "-";
	}
	else {
		return calculatePercent(numerator, denominator);
	}
}

function checkRunPass(run, pass, pkgid, downDistID, yards, isSuccess) {
		detailedPackageStats[downDistID][pkgid][pass][0]++;
		detailedPackageStats[downDistID][pkgid][pass][1]+=yards;
		detailedPackageStats[downDistID][pkgid][pass][2]+=isSuccess;
		return;
}

function getSuccess(yards, distToGo, down, isTouchdown) {
	var isSuccess=-1;
	if (isTouchdown==1) {
		isSuccess = 1;
	}
	else if (yards >= getDistToSuccess(distToGo, down)) {
		isSuccess = 1;
	}
	else {
		isSuccess = 0;
	}
	return isSuccess;
}

function getDistToSuccess(distToGo, down) {
	var distToSuccess = -1;

	if (down=="1st") {
		distToSuccess = distToGo*0.45;
	}
	else if (down=="2nd") {
		distToSuccess = distToGo*0.6;
	}
	else if (down=="3rd" || down=="4th") {
		distToSuccess = distToGo;
	}

	return distToSuccess;
}

function makeTableLable(name) {
	var lable = '<span style="background-color:white"> ' + name + ' </span>';
	return lable;
}

/* Functions to check and add to Individual Player Lists */

function checkWRList(id, name, position) {
	var index = -1;
	var pos = position.substring(0, 2);
	for (var x=0; x<WRPlayerStats.length; x++) {
		if (WRPlayerStats[x][0] == id) {
			index = x;
			if (WRPlayerStats[index][11].indexOf(pos) == -1) {
				WRPlayerStats[index][11] = WRPlayerStats[index][11] + "/" + pos;
			}
		}
	}
	if (index == -1) {
		var stats = new Array(14); // player ID, name, 1st opt passes, targets, yards, successes, GCOVs, INTs, Drops, dump passes, dist downfield, position, catches, PDEF
		for (var i=0; i<14; i++) {
			stats[i] = 0;
		}
		index = WRPlayerStats.length;
		WRPlayerStats[index] = stats;
		WRPlayerStats[index][0] = id;
		WRPlayerStats[index][1] = name;
		WRPlayerStats[index][11] = pos;
	}
	return index;
}

function checkRBList(id, name, position) {
	var index = -1;
	var pos = position.substring(0, 2);
	for (var x=0; x<RBPlayerStats.length; x++) {
		if (RBPlayerStats[x][0] == id) {
			index = x;
			if (RBPlayerStats[index][2].indexOf(pos) == -1) {
				RBPlayerStats[index][2] = RBPlayerStats[index][2] + "/" + pos;
			}
		}
	}
	if (index == -1) {
		var stats = new Array(8); // player ID, name, position, ATT, Yards, successes, yards to 1st down, yards to success
		for (var i=0; i<8; i++) {
			stats[i] = 0;
		}
		index = RBPlayerStats.length;
		RBPlayerStats[index] = stats;
		RBPlayerStats[index][0] = id;
		RBPlayerStats[index][1] = name;
		RBPlayerStats[index][2] = pos;
	}
	return index;
}

function checkIDPList(id, name) {
	var index = -1;
	for (var x=0; x<IDPStats.length; x++) {
		if (IDPStats[x][0] == id) {
			index = x;
		}
	}
	if (index == -1) {
		var stats = new Array(20); // player ID, name, 1st opt passes, targets, yards, successes, GCOVs, cv INTs, Drops, dump passes, dist downfield, position (MT), catches, cv PDEF, cv TKL, rm INT, rm PDEF, rm TKL, run TKL, run STOP
		for (var i=0; i<20; i++) {
			stats[i] = 0;
		}
		index = IDPStats.length;
		IDPStats[index] = stats;
		IDPStats[index][0] = id;
		IDPStats[index][1] = name;
	}
	return index;
}

function coverageMatchesExpected(coverage1, coverage2) {
	var match1 = (expectedCoverageString === "" || expectedCoverageString === coverage1.trim());
	var match2 = (expectedCoverage2String === "" || expectedCoverage2String === coverage2.trim());
	var isMatch = match1 && match2;

	//alert("comparing '" + expectedCoverageString + "' to '" + coverage1 + "' and '" + expectedCoverage2String + "' to '" + coverage2 + "', result: " + isMatch);

	return isMatch;
}

/* Table construction functions for Rushing and Passing splits table */

function make_old_r_p_table(SR_def, YPP_def, OPP_def, ORP_def) {
	var label="<th colspan='3'> Runs </th> <th colspan='3'> Passes </th>";
	var stat_defs="<td>" + ORP_def + "</td> <td>" + YPP_def + "</td> <td>" + SR_def + "</td> <td>" + OPP_def + "</td> <td>" + YPP_def + "</td> <td>" + SR_def + "</td>";
	var table =
			"<table border='1'> <tr>" +
			"<th rowspan='3'> Down and Distance </th> <th colspan='6'> HFT12 </th> <th colspan='6'> HFTt1 </th> <th colspan='6'> HTt12 </th> <th colspan='6'> HF123 </th> <th colspan='6'> HT123 </th> <th colspan='6'> H1234 </th> <th colspan='6'> T1234 </th> <th colspan='6'> 12345 </th> <th colspan='6'> All </th> <tr> " +
			label + label + label + label + label + label + label + label + label + "<tr>" +
			stat_defs + stat_defs + stat_defs + stat_defs + stat_defs + stat_defs + stat_defs + stat_defs + stat_defs + "<tr>" +
			addtr("1st down", 0) +
			addtr("2nd and 0-" + shortSplit, 1) +
			addtr("2nd and " + shortSplit + "-" + longSplit, 2) +
			addtr("2nd and " + longSplit + "+", 3) +
			addtr("3rd/4th and 0-" + shortSplit, 4) +
			addtr("3rd/4th and " + shortSplit + "-" + longSplit, 5) +
			addtr("3rd/4th and " + longSplit + "+", 6) +
			addSumTr("all") +
			"</table>";
	return table;
}

function makePlaytypeTableSection(pkgid, downDistID, isPassPlay) {
	var tableSection=
		"<td>" + detailedPackageStats[downDistID][pkgid][isPassPlay][0] +
		"</td> <td>" + getYPA(downDistID, pkgid, isPassPlay) +
		"</td> <td>" + getSuccessRate(downDistID, pkgid, isPassPlay) + "%" +
		"</td> ";
	return tableSection;
}

function makeDDPTableSection(pkgid, downDistID) {
	var tableSection=
		makePlaytypeTableSection(pkgid, downDistID, 0) +
		makePlaytypeTableSection(pkgid, downDistID, 1);
	return tableSection;
}

function addtr(downDist, downDistID) {
	var tr="<tr> <th> " + downDist +
		": </th>" +
		makeDDPTableSection(0, downDistID) +
		makeDDPTableSection(1, downDistID) +
		makeDDPTableSection(2, downDistID) +
		makeDDPTableSection(3, downDistID) +
		makeDDPTableSection(4, downDistID) +
		makeDDPTableSection(5, downDistID) +
		makeDDPTableSection(6, downDistID) +
		makeDDPTableSection(7, downDistID) +
		makeDDTableSection(downDistID);
	return tr;
}

function makePkgPlaytypeTableSection(pkgid, isPassPlay) {
	var tableSection=
		"<td>" + sumPackageStats[pkgid][isPassPlay][0] +
		"</td> <td>" + getPkgYPA(pkgid, isPassPlay) +
		"</td> <td>" + getPkgSuccessRate(pkgid, isPassPlay) + "%" +
		"</td>";
	return tableSection;
}

function makePkgTableSection(pkgid) {
	var tableSection=
		makePkgPlaytypeTableSection(pkgid, 0) +
		makePkgPlaytypeTableSection(pkgid, 1);
	return tableSection;
}

function addSumTr(downDist) {
	var tr="<tr> <th> " + downDist +
		": </th>" +
		makePkgTableSection(0) +
		makePkgTableSection(1) +
		makePkgTableSection(2) +
		makePkgTableSection(3) +
		makePkgTableSection(4) +
		makePkgTableSection(5) +
		makePkgTableSection(6) +
		makePkgTableSection(7) +
		" </td>";
	return tr;
}

function makeDDPlaytypeTableSection(downDistID, isPassPlay) {
	var tableSection=
		"<td>" + sumDownStats[downDistID][isPassPlay][0] +
		"</td> <td>" + getDD_YPA(downDistID, isPassPlay) +
		"</td> <td>" + getDD_SuccessRate(downDistID, isPassPlay) + "%" +
		"</td>";
	return tableSection;
}

function makeDDTableSection(downDistID) {
	var tableSection=
		makeDDPlaytypeTableSection(downDistID, 0) +
		makeDDPlaytypeTableSection(downDistID, 1);
	return tableSection;
}

/* Utility functions for Rushing and Passing Splits table */

function getYRD(downDistID, pkgid, isPassPlay) {
	return (detailedPackageStats[downDistID][pkgid][isPassPlay][1]).toFixed(2);
}

function getYPA(downDistID, pkgid, isPassPlay) {
	var YPA=0;
	if (detailedPackageStats[downDistID][pkgid][isPassPlay][0]>0) {
		YPA=(detailedPackageStats[downDistID][pkgid][isPassPlay][1]/detailedPackageStats[downDistID][pkgid][isPassPlay][0]).toFixed(1);
	}
	return YPA;
}

function getSuccessRate(downDistID, pkgid, isPassPlay) {
	var successRate=0;
	if (detailedPackageStats[downDistID][pkgid][isPassPlay][0]>0) {
		successRate=(detailedPackageStats[downDistID][pkgid][isPassPlay][2]/detailedPackageStats[downDistID][pkgid][isPassPlay][0])*100;
	}
	return successRate.toFixed(0);
}

function getPkgYRD(pkgid, isPassPlay) {
	return (sumPackageStats[pkgid][isPassPlay][1]).toFixed(2);
}

function getPkgYPA(pkgid, isPassPlay) {
	var YPA=0;
	if (sumPackageStats[pkgid][isPassPlay][0]>0) {
		YPA=(sumPackageStats[pkgid][isPassPlay][1]/sumPackageStats[pkgid][isPassPlay][0]).toFixed(1);
	}
	return YPA;
}

function getPkgSuccessRate(pkgid, isPassPlay) {
	var successRate=0;
	if (sumPackageStats[pkgid][isPassPlay][0]>0) {
		successRate=(sumPackageStats[pkgid][isPassPlay][2]/sumPackageStats[pkgid][isPassPlay][0])*100;
	}
	return successRate.toFixed(0);
}

function getDD_YRD(downDistID, isPassPlay) {
	return (sumDownStats[downDistID][isPassPlay][1]).toFixed(2);
}

function getDD_YPA(downDistID, isPassPlay) {
	var YPA=0;
	if (sumDownStats[downDistID][isPassPlay][0]>0) {
		YPA=(sumDownStats[downDistID][isPassPlay][1]/sumDownStats[downDistID][isPassPlay][0]).toFixed(1);
	}
	return YPA;
}

function getDD_SuccessRate(downDistID, isPassPlay) {
	var successRate=0;
	if (sumDownStats[downDistID][isPassPlay][0]>0) {
		successRate=(sumDownStats[downDistID][isPassPlay][2]/sumDownStats[downDistID][isPassPlay][0])*100;
	}
	return successRate.toFixed(0);
}

/* Table construction functions for Reciever Target Splits table */

function make_WR_target_table(FIRST_def, TGT_def, DMP_def, DIST_def) {
	var stat_defs = "<td>" + FIRST_def + "</td> <td>" + TGT_def + "</td> <td>" + DIST_def + "</td> <td>" + DMP_def + "</td>";
	var table =
		"<table border='2'> <tr>" +
		"<th rowspan='2'>Package</th> <th rowspan='2'>WR</th> <th colspan='4'>1st Down</th> <th colspan='4'>2nd and 0-"+shortSplit+
		"</th> <th colspan='4'>2nd and "+shortSplit+"-"+longSplit+"</th> <th colspan='4'>2nd and "+longSplit+
		"+</th> <th colspan='4'>3rd/4th and 0-"+shortSplit+"</th> <th colspan='4'>3rd/4th and "+shortSplit+"-"+longSplit+
		"</th> <th colspan='4'>3rd/4th and "+longSplit+"+</th> <th colspan='4'>Total</th>" +
		"<tr>" + stat_defs + stat_defs + stat_defs + stat_defs + stat_defs + stat_defs + stat_defs + stat_defs +
		addWrTgtPkgTr("HFT12", "WR1", "WR2", "TE1", "HB", "FB") +
		addWrTgtPkgTr("HFTt1", "WR1", "TE1", "TE2", "HB", "FB") +
		addWrTgtPkgTr("HTt12", "WR1", "WR2", "TE1", "TE2", "HB") +
		addWrTgtPkgTr("HF123", "WR1", "WR2", "WR3", "HB", "FB") +
		addWrTgtPkgTr("HT123", "WR1", "WR2", "WR3", "TE1", "HB") +
		addWrTgtPkgTr("H1234", "WR1", "WR2", "WR3", "WR4", "HB") +
		addWrTgtPkgTr("T1234", "WR1", "WR2", "WR3", "WR4", "TE1") +
		addWrTgtPkgTr("12345", "WR1", "WR2", "WR3", "WR4", "WR5") + // */
		"</table>";
	return table;
}

function addWrTgtPkgTr(pkg, wr1, wr2, wr3, wr4, wr5) {
	var pkgid = getPkgid(pkg);
	var row = "<tr> <th rowspan='5'>" + pkg + "</th> <th>" + wr1 + "</th>";
	for (var i=0; i<8; i++) {
		row = row.concat("<td>" + getFirst(wr1, pkgid, i) + "</td> <td>" + getTGTs(wr1, pkgid, i) + "</td> <td>" + getAveDist(wr1, pkgid, i) + "</td> <td>" + getDumpoffs(wr1, pkgid, i) + "</td>");
	}
	row = row.concat(addWrTgtTr(pkgid, wr2));
	row = row.concat(addWrTgtTr(pkgid, wr3));
	row = row.concat(addWrTgtTr(pkgid, wr4));
	row = row.concat(addWrTgtTr(pkgid, wr5));
	return row;
}

function addWrTgtTr(pkgid, wr) {
	var row = "<tr> <th>" + wr + "</th>";
	for (var i=0; i<8; i++) {
		row = row.concat("<td>" + getFirst(wr, pkgid, i) + "</td> <td>" + getTGTs(wr, pkgid, i) + "</td> <td>" + getAveDist(wr, pkgid, i) + "</td> <td>" + getDumpoffs(wr, pkgid, i) + "</td>");
	}
	return row;
}

/* Utility Functions for Reciever Target Splits table */
/* For each of these functions, a downDistID of 7 means "get the data across all down/distance combinations" */

function getFirst(wr, pkgid, downDistID) {
	var wrid = getWRID(wr);
	if (wrid == -1) {
		alert("wrid = -1, WR = " + wr);
	}

	var total = 0;
	if (downDistID < 7) {
		total = WRSplitStats[pkgid][downDistID][wrid][0] + WRSplitStats[pkgid][downDistID][wrid][1];
	}
	else {
		for (var i=0; i<7; i++) {
			total += (WRSplitStats[pkgid][i][wrid][0] + WRSplitStats[pkgid][i][wrid][1]);
		}
	}
	return total;
}

function getTGTs(wr, pkgid, downDistID) {
	var wrid = getWRID(wr);
	var total = 0;
	if (downDistID < 7) {
		total = WRSplitStats[pkgid][downDistID][wrid][5] - WRSplitStats[pkgid][downDistID][wrid][2];
	}
	else {
		for (var i=0; i<7; i++) {
			total += (WRSplitStats[pkgid][i][wrid][5] - WRSplitStats[pkgid][i][wrid][2]);
		}
	}
	return total;
}

function getDumpoffs(wr, pkgid, downDistID) {
	var wrid = getWRID(wr);
	var total = 0;
	if (downDistID < 7) {
		total = WRSplitStats[pkgid][downDistID][wrid][2];
	}
	else {
		for (var i=0; i<7; i++) {
			total += WRSplitStats[pkgid][i][wrid][2];
		}
	}
	return total;
}

function getAveDist(wr, pkgid, downDistID) {
	var wrid = getWRID(wr);
	var dist = 0;
	var atts = 0;

	if (downDistID < 7) {
		dist = WRSplitStats[pkgid][downDistID][wrid][4];
		atts = WRSplitStats[pkgid][downDistID][wrid][5] - (WRSplitStats[pkgid][downDistID][wrid][2] + WRSplitStats[pkgid][downDistID][wrid][3]);
	}
	else {
		for (var i=0; i<7; i++) {
			dist += WRSplitStats[pkgid][i][wrid][4];
			atts += WRSplitStats[pkgid][i][wrid][5] - (WRSplitStats[pkgid][i][wrid][2] + WRSplitStats[pkgid][i][wrid][3]);
		}
	}

	if (dist === 0) {
		return 0;
	}
	else {
		return (dist/atts).toFixed(1);
	}
}

/* Table construction functions for Reciever Production Splits table */

function make_WR_production_table(GCOVpct_def, SR_def, YPT_def, INTpct_def) {
	var stat_defs = "<td>" + GCOVpct_def + "</td> <td>" + SR_def + "</td> <td>" + YPT_def + "</td> <td>" + INTpct_def + "</td>";
	var table =
		"<table border='2'> <tr>" +
		"<th rowspan='2'>Package</th> <th rowspan='2'>WR</th> <th colspan='4'>1st Down</th> <th colspan='4'>2nd and 0-"+shortSplit+
		"</th> <th colspan='4'>2nd and "+shortSplit+"-"+longSplit+"</th> <th colspan='4'>2nd and "+longSplit+
		"+</th> <th colspan='4'>3rd/4th and 0-"+shortSplit+"</th> <th colspan='4'>3rd/4th and "+shortSplit+"-"+longSplit+
		"</th> <th colspan='4'>3rd/4th and "+longSplit+"+</th> <th colspan='4'>Total</th>" +
		"<tr>" + stat_defs + stat_defs + stat_defs + stat_defs + stat_defs + stat_defs + stat_defs + stat_defs +
		addWrProdPkgTr("HFT12", "WR1", "WR2", "TE1", "HB", "FB") +
		addWrProdPkgTr("HFTt1", "WR1", "TE1", "TE2", "HB", "FB") +
		addWrProdPkgTr("HTt12", "WR1", "WR2", "TE1", "TE2", "HB") +
		addWrProdPkgTr("HF123", "WR1", "WR2", "WR3", "HB", "FB") +
		addWrProdPkgTr("HT123", "WR1", "WR2", "WR3", "TE1", "HB") +
		addWrProdPkgTr("H1234", "WR1", "WR2", "WR3", "WR4", "HB") +
		addWrProdPkgTr("T1234", "WR1", "WR2", "WR3", "WR4", "TE1") +
		addWrProdPkgTr("12345", "WR1", "WR2", "WR3", "WR4", "WR5") +
		"</table>";
	return table;
}

function addWrProdPkgTr_OLD(pkg, wr1, wr2, wr3, wr4, wr5) {
	var pkgid = getPkgid(pkg);
	var row =
		"<tr> <th rowspan='5'>" + pkg + "</th> <th>" + wr1 + "</th> <td>" +
		getGCOVpct(wr1, pkgid, 0) + "</td> <td>" + getWrSR(wr1, pkgid, 0) + "</td> <td>" + getYPT(wr1, pkgid, 0) + "</td> <td>" + getINTpct(wr1, pkgid, 0) + "</td> <td>" +
		getGCOVpct(wr1, pkgid, 1) + "</td> <td>" + getWrSR(wr1, pkgid, 1) + "</td> <td>" + getYPT(wr1, pkgid, 1) + "</td> <td>" + getINTpct(wr1, pkgid, 1) + "</td> <td>" +
		getGCOVpct(wr1, pkgid, 2) + "</td> <td>" + getWrSR(wr1, pkgid, 2) + "</td> <td>" + getYPT(wr1, pkgid, 2) + "</td> <td>" + getINTpct(wr1, pkgid, 2) + "</td> <td>" +
		getGCOVpct(wr1, pkgid, 3) + "</td> <td>" + getWrSR(wr1, pkgid, 3) + "</td> <td>" + getYPT(wr1, pkgid, 3) + "</td> <td>" + getINTpct(wr1, pkgid, 3) + "</td> <td>" +
		getGCOVpct(wr1, pkgid, 4) + "</td> <td>" + getWrSR(wr1, pkgid, 4) + "</td> <td>" + getYPT(wr1, pkgid, 4) + "</td> <td>" + getINTpct(wr1, pkgid, 4) + "</td> <td>" +
		getGCOVpct(wr1, pkgid, 5) + "</td> <td>" + getWrSR(wr1, pkgid, 5) + "</td> <td>" + getYPT(wr1, pkgid, 5) + "</td> <td>" + getINTpct(wr1, pkgid, 5) + "</td> <td>" +
		getGCOVpct(wr1, pkgid, 6) + "</td> <td>" + getWrSR(wr1, pkgid, 6) + "</td> <td>" + getYPT(wr1, pkgid, 6) + "</td> <td>" + getINTpct(wr1, pkgid, 6) + "</td>" +
		addWrProdTr(pkgid, wr2) + addWrProdTr(pkgid, wr3) + addWrProdTr(pkgid, wr4) + addWrProdTr(pkgid, wr5);
	return row;
}

function addWrProdPkgTr(pkg, wr1, wr2, wr3, wr4, wr5) {
	var pkgid = getPkgid(pkg);
	var row = "<tr> <th rowspan='5'>" + pkg + "</th> <th>" + wr1 + "</th>";
	for (var i=0; i<8; i++) {
		row = row.concat(" <td>" + getGCOVpct(wr1, pkgid, i) + "</td> <td>" + getWrSR(wr1, pkgid, i) + "</td> <td>" + getYPT(wr1, pkgid, i) + "</td> <td>" + getINTpct(wr1, pkgid, i) + "</td>");
	}
	row = row.concat(addWrProdTr(pkgid, wr2));
	row = row.concat(addWrProdTr(pkgid, wr3));
	row = row.concat(addWrProdTr(pkgid, wr4));
	row = row.concat(addWrProdTr(pkgid, wr5));
	return row;
}

function addWrProdTr(pkgid, wr) {
	var row = "<tr> <th>" + wr + "</th>";
	for (var i=0; i<8; i++) {
		row = row.concat(" <td>" + getGCOVpct(wr, pkgid, i) + "</td> <td>" + getWrSR(wr, pkgid, i) + "</td> <td>" + getYPT(wr, pkgid, i) + "</td> <td>" + getINTpct(wr, pkgid, i) + "</td>");
	}
	return row;
}

function addWrProdTr_OLD(pkgid, wr) {
	var row = "<tr> <th>" + wr + "</th> <td>" + getGCOVpct(wr, pkgid, 0) + "</td> <td>" + getWrSR(wr, pkgid, 0) + "</td> <td>" + getYPT(wr, pkgid, 0) + "</td> <td>" + getINTpct(wr, pkgid, 0) + "</td>" +
		"<td>" + getGCOVpct(wr, pkgid, 1) + "</td> <td>" + getWrSR(wr, pkgid, 1) + "</td> <td>" + getYPT(wr, pkgid, 1) + "</td> <td>" + getINTpct(wr, pkgid, 1) + "</td>" +
		"<td>" + getGCOVpct(wr, pkgid, 2) + "</td> <td>" + getWrSR(wr, pkgid, 2) + "</td> <td>" + getYPT(wr, pkgid, 2) + "</td> <td>" + getINTpct(wr, pkgid, 2) + "</td>" +
		"<td>" + getGCOVpct(wr, pkgid, 3) + "</td> <td>" + getWrSR(wr, pkgid, 3) + "</td> <td>" + getYPT(wr, pkgid, 3) + "</td> <td>" + getINTpct(wr, pkgid, 3) + "</td>" +
		"<td>" + getGCOVpct(wr, pkgid, 4) + "</td> <td>" + getWrSR(wr, pkgid, 4) + "</td> <td>" + getYPT(wr, pkgid, 4) + "</td> <td>" + getINTpct(wr, pkgid, 4) + "</td>" +
		"<td>" + getGCOVpct(wr, pkgid, 5) + "</td> <td>" + getWrSR(wr, pkgid, 5) + "</td> <td>" + getYPT(wr, pkgid, 5) + "</td> <td>" + getINTpct(wr, pkgid, 5) + "</td>" +
		"<td>" + getGCOVpct(wr, pkgid, 6) + "</td> <td>" + getWrSR(wr, pkgid, 6) + "</td> <td>" + getYPT(wr, pkgid, 6) + "</td> <td>" + getINTpct(wr, pkgid, 6) + "</td>";
	return row;
}

/* Utility functions for Reciever Production Splits table */

function getWrSR(wr, pkgid, downDistID) {
	var wrid = getWRID(wr);
	var SC = 0;
	var targets = 0;

	if (downDistID < 7) {
		SC = WRSplitStats[pkgid][downDistID][wrid][7];
		targets = WRSplitStats[pkgid][downDistID][wrid][5];
	}
	else {
		for (var i=0; i<7; i++) {
			SC += WRSplitStats[pkgid][i][wrid][7];
			targets += WRSplitStats[pkgid][i][wrid][5];
		}
	}

	var SR = calculatePercentOrNone(SC, targets);
	return "<span title='" + SC + " successful plays in " + targets + " targets'>" + SR + "</span>%";
}

function getYPT(wr, pkgid, downDistID) {
	var wrid = getWRID(wr);
	var yards = 0;
	var targets = 0;

	if (downDistID < 7) {
		yards = WRSplitStats[pkgid][downDistID][wrid][6];
		targets = WRSplitStats[pkgid][downDistID][wrid][5];
	}
	else {
		for (var i=0; i<7; i++) {
			yards += WRSplitStats[pkgid][i][wrid][6];
			targets += WRSplitStats[pkgid][i][wrid][5];
		}
	}

	var YPT = calculateAverage(yards, targets);
	return "<span title='" + yards.toFixed(1) + " recieving yards in " + targets + " targets'>" + YPT + "</span>";
}

function getGCOVpct(wr, pkgid, downDistID) {
	var wrid = getWRID(wr);
	var firstOpts = 0;
	var gcovs = 0;

	if (downDistID < 7) {
		firstOpts = WRSplitStats[pkgid][downDistID][wrid][0] + WRSplitStats[pkgid][downDistID][wrid][1];
		gcovs = WRSplitStats[pkgid][downDistID][wrid][0];
	}
	else {
		for (var i=0; i<7; i++) {
			firstOpts += (WRSplitStats[pkgid][i][wrid][0] + WRSplitStats[pkgid][i][wrid][1]);
			gcovs += WRSplitStats[pkgid][i][wrid][0];
		}
	}

	var GCOVpct = calculatePercentOrNone(gcovs, firstOpts);
	return "<span title='" + gcovs + " GCOVs in " + firstOpts + " first option checks'>" + GCOVpct + "</span>%";
}

function getINTpct(wr, pkgid, downDistID) {
	var wrid = getWRID(wr);
	var ints = 0;
	var targets = 0;

	if (downDistID < 7) {
		ints = WRSplitStats[pkgid][downDistID][wrid][8];
		targets = WRSplitStats[pkgid][downDistID][wrid][5];
	}
	else {
		for (var i=0; i<7; i++) {
			ints += WRSplitStats[pkgid][i][wrid][8];
			targets += WRSplitStats[pkgid][i][wrid][5];
		}
	}

	var INTpct = calculatePercentOrNone(ints, targets);
	return "<span title='" + ints + " Interceptions in " + targets + " target(s)'>" + INTpct + "</span>%";
}

/* Table construction functions for 3rd/4th Downs table */

function getPassDistRowHeader(i) {
	var header = "";
	if (i === 0) {
		header = "Dumpoff";
	}
	else if (i == 1) {
		header = "Behind LOS";
	}
	else if (i == 2) {
		header = "0-1 yards";
	}
	else if (i == 3) {
		header = "1-2 yards";
	}
	else if (i == 4) {
		header = "2-3 yards";
	}
	else if (i == 5) {
		header = "3-4 yards";
	}
	else if (i == 6) {
		header = "4-5 yards";
	}
	else if (i == 7) {
		header = "5-6 yards";
	}
	else if (i == 8) {
		header = "6-7 yards";
	}
	else if (i == 9) {
		header = "7-8 yards";
	}
	else if (i == 10) {
		header = "8-9 yards";
	}
	else if (i == 11) {
		header = "9-10 yards";
	}
	else if (i == 12) {
		header = "10-12 yards";
	}
	else if (i == 13) {
		header = "12-14 yards";
	}
	else if (i == 14) {
		header = "14-16 yards";
	}
	else if (i == 15) {
		header = "16-18 yards";
	}
	else if (i == 16) {
		header = "18-20 yards";
	}
	else {
		header = "20+ yards";
	}
	return header;
}

function makeConversionTable() {
	var table = "<table border='1' cellpadding='10'><th>Distance</th><th>ATT</th><th>FD</th><th>Pct</th><th>Y/FD</th><th>Y/Stp</th>";
	for (var i=0; i<10; i++) {
		table = table.concat(makeConversionTr(i, i+1, i));
	}
	for (var j=0; j<6; j++) {
		table = table.concat(makeConversionTr(2*j+10, 2*j+12, j+10));
	}
	table = table.concat("</table>");
	return table;
}

function makeConversionTr(min, max, i) {
	var tr = "<tr><th>&nbsp;" + min + " - " + max + "&nbsp;</th><td> " + conversionStats[i][0] + "</td><td>" + conversionStats[i][1] + "</td><td>" + getConversionPct(i) + "% </td><td>" + getYrdPerFD(i) + "</td><td>" + getYrdPerStp(i) + "</td>";
	return tr;
}

/* Utility functions for 3rd/4th Downs table */

function getConversionPct(i) {
	var pct;
	if (conversionStats[i][0] === 0) {
		pct = "-";
	}
	else {
		pct = ((conversionStats[i][1]/conversionStats[i][0])*100).toFixed(1);
	}
	return pct;
} // */

function getYrdPerFD(i) {
	var YPF;
	if (conversionStats[i][1] === 0) {
		YPF = "-";
	}
	else {
		YPF = (conversionStats[i][2]/conversionStats[i][1]).toFixed(1);
	}
	return YPF;
}

function getYrdPerStp(i) {
	var YPS;
	var stops = conversionStats[i][0] - conversionStats[i][1];
	if (stops === 0) {
		YPS = "-";
	}
	else {
		YPS = (conversionStats[i][3]/stops).toFixed(1);
	}
	return YPS;
}

function get3rd4thDownDistID(dist) {
	var id = -1;
	if (dist >= 0 && dist <= 1) {
		id=0;
	} else if (dist <= 2) {
		id=1;
	} else if (dist <= 3) {
		id=2;
	} else if (dist <= 4) {
		id=3;
	} else if (dist <= 5) {
		id=4;
	} else if (dist <= 6) {
		id=5;
	} else if (dist <= 7) {
		id=6;
	} else if (dist <= 8) {
		id=7;
	} else if (dist <= 9) {
		id=8;
	} else if (dist <= 10) {
		id=9;
	} else if (dist <= 12) {
		id=10;
	} else if (dist <= 14) {
		id=11;
	} else if (dist <= 16) {
		id=12;
	} else if (dist <= 18) {
		id=13;
	} else if (dist <= 20) {
		id=14;
	} else {
		id=15;
	}
	return id;
}

function getPassDistID(dist) {
	var id = -1;
	if (dist < 0) {
		id=1;
	} else if (dist <= 1) {
		id=2;
	} else if (dist <= 2) {
		id=3;
	} else if (dist <= 3) {
		id=4;
	} else if (dist <= 4) {
		id=5;
	} else if (dist <= 5) {
		id=6;
	} else if (dist <= 6) {
		id=7;
	} else if (dist <= 7) {
		id=8;
	} else if (dist <= 8) {
		id=9;
	} else if (dist <= 9) {
		id=10;
	} else if (dist <= 10) {
		id=11;
	} else if (dist <= 12) {
		id=12;
	} else if (dist <= 14) {
		id=13;
	} else if (dist <= 16) {
		id=14;
	} else if (dist <= 18) {
		id=15;
	} else if (dist <= 20) {
		id=16;
	} else {
		id=17;
	}
	return id;
}

/*******************************************/
/* * * * SINGLE-FUNCTION STAT TABLES * * * */
/*******************************************/

function makeDefPkgSplitsTable() {
	var table = "<table border='1'><th>Package</th><th>Total Plays</th><th>Run Plays</th><th>Pass Plays</th>";
	var sumTot = 0;
	var sumPass = 0;
	var sumRun = 0;
	for (var i=0; i<19; i++) {
		table = table.concat("<tr><td> " + defPkgs[i] + " </td> <td> " + defPkgSplitStats[i][0] + " </td><td> " + defPkgSplitStats[i][1] + " </td><td> " + defPkgSplitStats[i][2] + " </td>");

		sumTot += defPkgSplitStats[i][0];
		sumRun += defPkgSplitStats[i][1];
		sumPass += defPkgSplitStats[i][2];
	}
	table = table.concat("<tr><td> All </td> <td> " + sumTot + "</td><td>" + sumRun + "</td><td>" + sumPass + "</td> </table>");
	return table;
}

// player ID, name, 1st opt passes, targets, yards, successes, GCOVs, INTs, Drops, dump passes, dist downfield, POS, catches, PDEF
function makeIndividualWRStatTable() {
	var SR_def="<span title='Success Rate: Percentage of plays in which this reciever was targeted which are considered successful (meaning the offense is better off after them than they were before). A successful play is defined here as one which gains 45% of the required yardage on 1st down, 60% on 2nd down, and 100% on 3rd or 4th down. Definition paraphrased from footballoutsiders.com'>SR</span>";
	var FIRST_def="<span title='First Option Checks: The number of plays in which this reciever was the QBs first read. This inclues both GCOVs and passing targets (no dumpoffs)'>1st Opt</span>";
	var TGT_def="<span title='Targets: The number of passes thrown to this reciever.'>TGT</span>";
	var CMP_def="<span title='Completions: the number of completed passes thrown to this reciever.'>COMP</span>";
	var DMP_def="<span title='Dumpoff Targets: The number of dumpoff passes thrown to this reciever.'>Dumpoffs</span>";
	var DIST_def="<span title='Average Depth of Target: the average distance downfield of all passes thrown to this reciever, exluding dumpoffs and drops.'>ADoT</span>";
	var YPT_def="<span title='Yards per Target: The average number of yards gained on passes to this reciever'>Y/T</span>";
	var GCOV_def="<span title='Good Coverages: the number of times this reciever was the QBs first read but was not thrown to'>GCOV</span>";
	var GCOVpct_def="<span title='Good Coverage Percentage: the percentage of first option looks to this reciever which result in a GCOV instead of a pass attempt'>GCOV%</span>";
	var INT_def="<span title='Interceptions: the number of interceptions on passes thrown to this reciever'>INT</span>";
	var INTpct_def="<span title='Interception Rate: the percentage of passes thrown to this reciever which result in an interception by the defense'>INT%</span>";
	var PDEF_def="<span title='Pass Deflections: the number of passes thrown to this reciever which were knocked down by a defender. This does not include interceptions'>PDEF</span>";
	var PDEFpct_def="<span title='Pass Deflection Percentage: the percentage of passes thrown to this reciever which were knocked down by a defender'>PDEF%</span>";
	var SC_def="<span title='Success Count: the number of plays in which this player was targeted which were a net positive for the offense'>SC</span>";

	var table = "<table border='1' cellpadding='5'><th>Name</th><th>POS</th><th>" + FIRST_def + "</th><th>" + TGT_def + "</th><th>" + CMP_def + "</th><th>COMP%</th><th>Yards</th><th>" +
		YPT_def + "</th><th>" + SC_def + "</th><th>" + SR_def + "</th><th>" + GCOV_def + "</th><th>" + GCOVpct_def + "</th><th>" + INT_def + "</th><th>" + INTpct_def +
		"</th><th>" + PDEF_def + "</th><th>" + PDEFpct_def + "</th><th>" + DMP_def + "</th><th>" + DIST_def + "</th>";
	for (var i=0; i<WRPlayerStats.length; i++) {
		table = table.concat("<tr><td>" + WRPlayerStats[i][1] +
			"</td><td>" + WRPlayerStats[i][11] +
			"</td><td>" + (WRPlayerStats[i][2] + WRPlayerStats[i][6]) +
			"</td><td>" + WRPlayerStats[i][3] +
			"</td><td>" + WRPlayerStats[i][12] +
			"</td><td>" + calculatePercent(WRPlayerStats[i][12], WRPlayerStats[i][3]) + "%" +
			"</td><td>" + WRPlayerStats[i][4].toFixed(1) +
			"</td><td>" + calculateAverage(WRPlayerStats[i][4], WRPlayerStats[i][3]) +
			"</td><td>" + WRPlayerStats[i][5] +
			"</td><td>" + calculatePercent(WRPlayerStats[i][5], WRPlayerStats[i][3]) + "%" +
			"</td><td>" + WRPlayerStats[i][6] +
			"</td><td>" + calculatePercent(WRPlayerStats[i][6], WRPlayerStats[i][2] + WRPlayerStats[i][6]) + "%" +
			"</td><td>" + WRPlayerStats[i][7] +
			"</td><td>" + calculatePercent(WRPlayerStats[i][7], WRPlayerStats[i][3]) + "%" +
			"</td><td>" + WRPlayerStats[i][13] +
			"</td><td>" + calculatePercent(WRPlayerStats[i][13], WRPlayerStats[i][3]) + "%" +
			"</td><td>" + WRPlayerStats[i][9] +
			"</td><td>" + calculateAverage(WRPlayerStats[i][10], WRPlayerStats[i][3] - WRPlayerStats[i][8] - WRPlayerStats[i][9]) +
			"</td>");
	}
	table = table.concat("</table>");
	return table;
}

// player ID, name, 1st opt passes, targets, yards, successes, GCOVs, cv INTs, Drops, dump passes, dist downfield, position (MT), catches, cv PDEF, cv TKL, rm INT, rm PDEF, rm TKL, run TKL, run STOP
function makeIDPStatTable() {
	var SR_def="<span title='Success Rate: Percentage of plays in which this player was targeted which are considered successful (meaning the offense is better off after them than they were before). A successful play is defined here as one which gains 45% of the required yardage on 1st down, 60% on 2nd down, and 100% on 3rd or 4th down. Definition paraphrased from footballoutsiders.com'>SR</span>";
	var FIRST_def="<span title='First Option Checks: The number of plays in which this player was in coverage against the QBs first read. This inclues both GCOVs and passing targets (no dumpoffs)'>1st Opt</span>";
	var TGT_def="<span title='Targets: The number of passes thrown to this player in coverage.'>TGT</span>";
	var CMP_def="<span title='Completions: the number of completed passes thrown to the reciever this player was covering.'>COMP</span>";
	var DMP_def="<span title='Dumpoff Targets: The number of dumpoff passes thrown to the reciever this player was covering.'>Dumpoffs</span>";
	var DIST_def="<span title='Average Depth of Target: the average distance downfield of all passes thrown to the reciever this player was covering, exluding dumpoffs and drops.'>ADoT</span>";
	var YRD_def="<span title='Yards: The number of yards gained on passes to the reciever this player was covering'>Yards</span>";
	var YPT_def="<span title='Yards per Target: The average number of yards gained on passes to the reciever this player was covering'>Y/T</span>";
	var GCOV_def="<span title='Good Coverages: the number of times this player prevented the QB from throwing to their first read'>GCOV</span>";
	var GCOVpct_def="<span title='Good Coverage Percentage: the percentage of first option looks to the reciever this player was covering which result in a GCOV instead of a pass attempt'>GCOV%</span>";
	var cvINT_def="<span title='Coverage Interceptions: the number of passes thrown to the reciever this player was covering which were intercepted by this player'>covINT</span>";
	var INTpct_def="<span title='Interception Rate: the percentage of passes to the reciever this player was covering which were intercepted by this player'>INT%</span>";
	var cvPDEF_def="<span title='Coverage Pass Deflections: the number of passes thrown to the reciever this player was covering which were knocked down by this player. This does not include interceptions'>covPDEF</span>";
	var PDEFpct_def="<span title='Pass Deflection Percentage: the percentage of passes to the reciever this player was covering which they were able to knock down'>PDEF%</span>";
	var SC_def="<span title='Success Count: the number of plays in which this player was targeted which were a net positive for the offense'>SC</span>";
	var cvTKL_def="<span title='Coverage Tackles: the number of times this player tackled the reciever they were covering'>covTKL</span>";
	var runTKL_def="<span title='Run Play Tackles: tackles made by this player on run plays, including designed runs and scrambles'>runTKL</span>";
	var runSTP_def="<span title='Run Play Stops: tackles made by this player on run plays which were unsuccessful for the offense'>runSTP</span>";
	var rmINT_def="<span title='Roamer Interceptions: the number of passes thrown to recievers this player was NOT covering which were intercepted by this player'>rmINT</span>";
	var rmPDEF_def="<span title='Roamer Pass Deflections: the number of passes thrown to recievers this player was NOT covering which were knocked down by this player. This does not include interceptions'>rmPDEF</span>";
	var rmTKL_def="<span title='Roamer Tackles: the number of times this player tackled a reciever they were NOT covering'>rmTKL</span>";

	var table = "<table border='1' cellpadding='5'><th>Name</th><th>" + FIRST_def + "</th><th>" + TGT_def + "</th><th>" + CMP_def + "</th><th>COMP%</th><th>" + YRD_def + "</th><th>" +
		YPT_def + "</th><th>" + SC_def + "</th><th>" + SR_def + "</th><th>" + GCOV_def + "</th><th>" + GCOVpct_def + "</th><th>" + cvINT_def + "</th><th>" + INTpct_def +
		"</th><th>" + cvPDEF_def + "</th><th>" + PDEFpct_def + "</th><th>" + cvTKL_def + "</th><th>" + DMP_def + "</th><th>" + DIST_def + "</th><th>" + rmINT_def + "</th><th>" +
		rmPDEF_def + "</th><th>" + rmTKL_def + "</th><th>" + runTKL_def + "</th><th>" + runSTP_def + "</th>";
	for (var i=0; i<IDPStats.length; i++) {
		table = table.concat("<tr><td>" + IDPStats[i][1] +
			"</td><td>" + (IDPStats[i][2] + IDPStats[i][6]) +
			"</td><td>" + IDPStats[i][3] +
			"</td><td>" + IDPStats[i][12] +
			"</td><td>" + calculatePercent(IDPStats[i][12], IDPStats[i][3]) + "%" +
			"</td><td>" + IDPStats[i][4].toFixed(1) +
			"</td><td>" + calculateAverage(IDPStats[i][4], IDPStats[i][3]) +
			"</td><td>" + IDPStats[i][5] +
			"</td><td>" + calculatePercent(IDPStats[i][5], IDPStats[i][3]) + "%" +
			"</td><td>" + IDPStats[i][6] +
			"</td><td>" + calculatePercent(IDPStats[i][6], IDPStats[i][2] + IDPStats[i][6]) + "%" +
			"</td><td>" + IDPStats[i][7] +
			"</td><td>" + calculatePercent(IDPStats[i][7], IDPStats[i][3]) + "%" +
			"</td><td>" + IDPStats[i][13] +
			"</td><td>" + calculatePercent(IDPStats[i][13], IDPStats[i][3]) + "%" +
			"</td><td>" + IDPStats[i][14] +
			"</td><td>" + IDPStats[i][9] +
			"</td><td>" + calculateAverage(IDPStats[i][10], IDPStats[i][3] - IDPStats[i][8] - IDPStats[i][9]) +
			"</td><td>" + IDPStats[i][15] +
			"</td><td>" + IDPStats[i][16] +
			"</td><td>" + IDPStats[i][17] +
			"</td><td>" + IDPStats[i][18] +
			"</td><td>" + IDPStats[i][19] +
			"</td>");
	}
	table = table.concat("</table>");
	return table;
}

// player ID, name, position, ATT, Yards, successes, yards to 1st down, yards to success
function makeIndividualRBStatTable() {
	var ATT_def = "<span title='Rushing Attempts: the number of times this player ran the ball as part of a designed running play. This includes QB run plays, but not sacks or scrambles'>ATT</span>";
	var SC_def = "<span title='Success Count: the number of plays in which this player ran the ball which are considered successful (meaning the offense is better off after them than they were before). A successful play is defined here as one which gains 45% of the required yardage on 1st down, 60% on 2nd down, and 100% on 3rd or 4th down. Definition paraphrased from footballoutsiders.com'>SC</span>";
	var SR_def = "<span title='Success Rate: percentage of plays on which this player ran the ball which are considered successful'>SR</span>";
	var YT1D_def = "<span title='Yards to 1st Down: the average number of yards required to pick up a first down on plays where this player ran the ball'>YT1D</span>";
	var YTS_def = "<span title='Yards to Success: the average number of yards required for a successful play on plays where this player ran the ball'>YTS</span>";

	var table = "<table border='1'><th>Name</th><th>POS</th><th>" + ATT_def + "</th><th>Yards</th><th>YPC</th><th>" + SC_def + "</th><th>" + SR_def + "</th><th>" + YT1D_def + "</th><th>" + YTS_def + "</th>";
	for (var i=0; i<RBPlayerStats.length; i++) {
		table = table.concat("<tr><td>" + RBPlayerStats[i][1] +
			"</td><td>" + RBPlayerStats[i][2] +
			"</td><td>" + RBPlayerStats[i][3] +
			"</td><td>" + RBPlayerStats[i][4].toFixed(1) +
			"</td><td>" + calculateAverage(RBPlayerStats[i][4], RBPlayerStats[i][3]) +
			"</td><td>" + RBPlayerStats[i][5] +
			"</td><td>" + calculatePercent(RBPlayerStats[i][5], RBPlayerStats[i][3]) + "%" +
			"</td><td>" + calculateAverage(RBPlayerStats[i][6], RBPlayerStats[i][3]) +
			"</td><td>" + calculateAverage(RBPlayerStats[i][7], RBPlayerStats[i][3]) +
			"</td>");
	}
	table = table.concat("</table>");
	return table;
}

function makePassDistSplitTable() {
	var table = "<table border='1'><th>Pass Distance</th><th>ATT</th><th>COMP</th><th>COMP%</th><th>Yards</th><th>Y/A</th>" +
		"<th>Successes</th><th>SR</th><th>INT</th><th>INT%</th><th>ANYA</th><th>ave Pass Dist</th><th>aveYAC</th><th>ave dist to go</th>";
	for (var i=0; i<18; i++) {
		table = table.concat("<tr><td>" + getPassDistRowHeader(i) + "</td><td>" + passDistSplitStats[i][0] +
			"</td><td>" + passDistSplitStats[i][1] +
			"</td><td>" + calculatePercent(passDistSplitStats[i][1], passDistSplitStats[i][0]) + "%" +
			"</td><td>" + passDistSplitStats[i][3].toFixed(1) +
			"</td><td>" + calculateAverage(passDistSplitStats[i][3], passDistSplitStats[i][0]) +
			"</td><td>" + passDistSplitStats[i][2] +
			"</td><td>" + calculatePercent(passDistSplitStats[i][2], passDistSplitStats[i][0]) + "%" +
			"</td><td>" + passDistSplitStats[i][7] +
			"</td><td>" + calculatePercent(passDistSplitStats[i][7], passDistSplitStats[i][0]) + "%" +
			"</td><td>" + calculateAverage(passDistSplitStats[i][3] + (20 * passDistSplitStats[i][8]) - (45 * passDistSplitStats[i][7]), passDistSplitStats[i][0]) +
			"</td><td>" + calculateAverage(passDistSplitStats[i][4], passDistSplitStats[i][0]) +
			"</td><td>" + calculateAverage(passDistSplitStats[i][5], passDistSplitStats[i][1]) +
			"</td><td>" + calculateAverage(passDistSplitStats[i][6], passDistSplitStats[i][0]) +
			"</td>");
	}
	table = table.concat("</table>");
	return table;
}

function makeSacksTable() {
	// pass plays, passes, immediate sacks, cover sacks, pressure scrambles, cover scrambles, scramble sacks, dumpoffs, throw aways

	var teamType = "Pass Rush";
	if (showOffense) {
		teamType = "Pass Blocking";
	}

	// create new array for the combined stats from all teams
	var sackStatsTotals = new Array(9);
	for (var i=0; i<9; i++) {
		sackStatsTotals[i] = 0;
	}

	var TGT_def = "<span title='Targets: pass plays which resulted in a pass thrown to an elegible reciever'>TGT</span>";
	var TGTPct_def = "<span title='Target Percentage: percentage of all pass plays which resulted in a pass thrown to an elegible reciever'>TGT%</span>";
	var ImdSk_def = "<span title='Imediate Sacks: sacks which occured very quickly, before the quarterback could make his first read'>Imediate Sacks</span>";
	var ImdSkPct_def = "<span title='Imediate Sack Percentage: percentage of all pass plays which ended in an Imediate Sack'>ImdSk%</span>";
	var CovSk_def = "<span title='Coverage Sacks: sacks which occured after a GCOV (meaning the quarterback has progressed past his first read). Scramble sacks are not included.'>Cover Sacks</span>";
	var CovSkPct_def = "<span title='Coverage Sack Percentage: percentage of all pass plays which ended in a non-scramble Coverage sack'>CovSk%</span>";
	var PresScram_def = "<span title='Pressure Scrambles: plays where the quarterback was forced to scramble due to pressure'>PresScram</span>";
	var PresScramPct_def = "<span title='Pressure Scramble Percentage: percentage of all pass plays where the quarterback was forced to scramble due to pressure'>PresScram%</span>";
	var CovScram_def = "<span title='Coverage Scrambles: plays where the quarterback was forced to scramble because none of the recievers were open'>CovScram</span>";
	var CovScramPct_def = "<span title='Coverage Scramble Percentage: percentage of all pass plays where the quarterback was forced to scramble because none of the recievers were open'>CovScram%</span>";
	var ScramSk_def = "<span title='Scramble Sacks: plays where the quarterback was sacked after attempting to scramble'>Scramble Sacks</span>";
	var ScramSkPct_def = "<span title='Sacks Per Scramble: percentage of scrambles which resulted in a sack'>Sk/Scram%</span>";
	var Dump_def = "<span title='Dumpoffs: plays where the quarterback decided to dump the ball off to a reciever outside the planned progression'>Dumpoffs</span>";
	var DumpPct_def = "<span title='Dumpoff Percentage: percentage of all pass plays where the quarterback dumped the ball off'>Dump%</span>";
	var TA_def = "<span title='Throwaways: plays where the quarterback intentionally threw the ball away. Includes intentional grounding penalties.'>Throwaways</span>";
	var TAPct_def = "<span title='Throwaway Percentage: percentage of all pass plays where the quarterback threw the ball away'>TA%</span>";

	var table = "<table border='1'><th>" + teamType + "</th><th>Pass Plays</th><th>" + TGT_def + "</th><th>" + TGTPct_def + "</th><th>" + ImdSk_def + "</th><th>" + ImdSkPct_def + "</th><th>" + CovSk_def + "</th><th>" + CovSkPct_def + "</th><th>" + PresScram_def + "</th><th>" + PresScramPct_def + "</th><th>" + CovScram_def + "</th><th>" + CovScramPct_def + "</th><th>" + ScramSk_def + "</th><th>" + ScramSkPct_def + "</th><th>" + Dump_def + "</th><th>" + DumpPct_def + "</th><th>" + TA_def + "</th><th>" + TAPct_def + "</th>";

	for (var j=0; j<abbrs.length; j++) {
		table = table.concat("<tr><th>" + abbrs[j] + "</th><td>" + sackStats[j][0] + "</td><td>" + (sackStats[j][1] - sackStats[j][8]) + "</td><td>" + calculatePercent(sackStats[j][1] - sackStats[j][8], sackStats[j][0]) + "%</td><td>" + sackStats[j][2] + "</td><td>" + calculatePercent(sackStats[j][2], sackStats[j][0]) + "%</td><td>" + sackStats[j][3] + "</td><td>" + calculatePercent(sackStats[j][3], sackStats[j][0]) + "%</td><td>" + sackStats[j][4] + "</td><td>" + calculatePercent(sackStats[j][4], sackStats[j][0]) + "%</td><td>" + sackStats[j][5] + "</td><td>" + calculatePercent(sackStats[j][5], sackStats[j][0]) + "%</td><td>" + sackStats[j][6] + "</td><td>" + calculatePercent(sackStats[j][6], sackStats[j][4] + sackStats[j][5]) + "%</td><td>" + sackStats[j][7] + "</td><td>" + calculatePercent(sackStats[j][7], sackStats[j][0]) + "%</td><td>" + sackStats[j][8] + "</td><td>" + calculatePercent(sackStats[j][8], sackStats[j][0]) + "%</td>");

		for (var k=0; k<9; k++) {
			sackStatsTotals[k] += sackStats[j][k];
		}
	}

	if (abbrs.length > 1) {
		// don't do a "total" row if there is only one team
		table = table.concat("<tr><td>Total</td><td>" + sackStatsTotals[0] + "</td><td>" + (sackStatsTotals[1] - sackStatsTotals[8]) + "</td><td>" + calculatePercent(sackStatsTotals[1] - sackStatsTotals[8], sackStatsTotals[0]) + "%</td><td>" + sackStatsTotals[2] + "</td><td>" + calculatePercent(sackStatsTotals[2], sackStatsTotals[0]) + "%</td><td>" + sackStatsTotals[3] + "</td><td>" + calculatePercent(sackStatsTotals[3], sackStatsTotals[0]) + "%</td><td>" + sackStatsTotals[4] + "</td><td>" + calculatePercent(sackStatsTotals[4], sackStatsTotals[0]) + "%</td><td>" + sackStatsTotals[5] + "</td><td>" + calculatePercent(sackStatsTotals[5], sackStatsTotals[0]) + "%</td><td>" + sackStatsTotals[6] + "</td><td>" + calculatePercent(sackStatsTotals[6], sackStatsTotals[4] + sackStatsTotals[5]) + "%</td><td>" + sackStatsTotals[7] + "</td><td>" + calculatePercent(sackStatsTotals[7], sackStatsTotals[0]) + "%</td><td>" + sackStatsTotals[8] + "</td><td>" + calculatePercent(sackStatsTotals[8], sackStatsTotals[0]) + "%</td>");
	}

	table = table.concat("</table>");
	return table;
}

function makeKickoffsTable() {
	// kickoffs, touchbacks, returned kicks, net landing spot of returned kicks, net returned spot of returned kicks, kicks returned short of the 25, KRTDs

	var teamType = "Kicking Team";
	if (showOffense) {
		teamType = "Recieving Team";
	}

	// create new array for the combined stats from all teams
	var kickoffStatTotals = new Array(7);
	for (var k=0; k<7; k++) {
		kickoffStatTotals[k] = 0;
	}

	var table = "<table border='1'><th>" + teamType + "</th><th>Kickoffs</th><th>Touchbacks</th><th>TB%</th><th>Avg kick returned from</th><th>Avg field position on returns</th><th>Yards Per Kick Return</th><th>KRTD</th><th>KRTD%</th><th>KR <25yd line</th><th>\<25%</th><th>Avg field position</th>";

	for (var i=0; i<abbrs.length; i++) {
		table = table.concat("<tr><th>" + abbrs[i] + "</th><td>" +
			kickoffStats_array[i][0] + "</td><td>" +
			kickoffStats_array[i][1] + "</td><td>" +
			calculatePercent(kickoffStats_array[i][1], kickoffStats_array[i][0]) + "%</td><td>" +
			calculateAverage(kickoffStats_array[i][3], kickoffStats_array[i][2]) + "</td><td>" +
			calculateAverage(kickoffStats_array[i][4], kickoffStats_array[i][2]) + "</td><td>" +
			calculateAverage(kickoffStats_array[i][4]-kickoffStats_array[i][3], kickoffStats_array[i][2]) + "</td><td>" +
			kickoffStats_array[i][6] + "</td><td>" +
			calculatePercent(kickoffStats_array[i][6], kickoffStats_array[i][2]) + "%</td><td>" +
			kickoffStats_array[i][5] + "</td><td>" +
			calculatePercent(kickoffStats_array[i][5], kickoffStats_array[i][2]) + "%</td><td>" +
			calculateAverage((kickoffStats_array[i][1] * 25) + kickoffStats_array[i][4], kickoffStats_array[i][0]) + "</td>");

		for (var j=0; j<7; j++) {
			kickoffStatTotals[j] += kickoffStats_array[i][j];
		}
	}

	if (abbrs.length > 1) {
		// don't do a "total" row if there is only one team
		table = table.concat("<tr><td>Total</td><td>" + kickoffStatTotals[0] + "</td><td>" + kickoffStatTotals[1] + "</td><td>" + calculatePercent(kickoffStatTotals[1], kickoffStatTotals[0]) + "%</td><td>" + calculateAverage(kickoffStatTotals[3], kickoffStatTotals[2]) + "</td><td>" + calculateAverage(kickoffStatTotals[4], kickoffStatTotals[2]) + "</td><td>" + calculateAverage(kickoffStatTotals[4]-kickoffStatTotals[3], kickoffStatTotals[2]) + "</td><td>" + kickoffStatTotals[6] + "</td><td>" + calculatePercent(kickoffStatTotals[6], kickoffStatTotals[2]) + "%</td><td>" + kickoffStatTotals[5] + "</td><td>" + calculatePercent(kickoffStatTotals[5], kickoffStatTotals[2]) + "%</td><td>" + calculateAverage((kickoffStatTotals[1] * 25) + kickoffStatTotals[4], kickoffStatTotals[0]) + "</td>");
	}

	table = table.concat("</table>");
	return table;
}

/*function makeKickoffsTableRow(statArray) {
	var row = "<tr><td>" + statArray[0] + "</td><td>" + statArray[1] + "</td><td>" + calculatePercent(statArray[1], statArray[0]) + "%</td><td>" + calculateAverage(statArray[3], statArray[2]) + "</td><td>" + calculateAverage(statArray[4], statArray[2]) + "</td><td>" + calculateAverage(statArray[4]-statArray[3], statArray[2]) + "</td><td>" + statArray[5] + "</td><td>" + calculatePercent(statArray[5], statArray[2]) + "%</td><td>" + calculateAverage((statArray[1] * 25) + statArray[4], statArray[0]) + "</td>";
	return row;
} // */

function makeFieldGoalsTable() {
	// PAT, 0-20, 20-30, 30-40, 40-50, 50+
	// attempted, made, blocked

	// create new array for the combined stats from all teams
	var fieldGoalStatTotals = new Array(6);
	for (var k=0; k<6; k++) {
		fieldGoalStatTotals[k] = new Array(3);
		for (var l=0; l<3; l++) {
			fieldGoalStatTotals[k][l] = 0;
		}
	}

	var FGStatHeader = "<th><span title='Field Goals Made'>FGM</span></th><th><span title='Field Goal Attempts'>FGA</span></th><th><span title='Field Goal Percentage'>FG%</span></th><th><span title='Blocked field goals'>FG BLK</span></th>";

	var table = "<table border='1'><th></th><th colspan='4'>Extra Points</th><th colspan='4'>0-20 yards</th><th colspan='4'>20-30 yards</th><th colspan='4'>30-40 yards</th><th colspan='4'>40-50 yards</th><th colspan='4'>50+ yards</th><th colspan='4'>All Field Goals</th><tr><th></th><th>XPM</th><th>XPA</th><th>XP%</th><th>XP BLK</th>" + FGStatHeader + FGStatHeader + FGStatHeader + FGStatHeader + FGStatHeader + FGStatHeader;

	for (var i=0; i<abbrs.length; i++) {
		// sum and store the totals for each team across all ranges
		var teamFGM = 0;
		var teamFGA = 0;
		var teamFGBLK = 0;

		table = table.concat("<tr><th>" + abbrs[i] + "</th>");

		// add columns for Extra Points and each distance split
		for (var m=0; m<6; m++) {
			table = table.concat("<td>" + fieldGoalStats_array[i][m][1] + "</td><td>" + fieldGoalStats_array[i][m][0] + "</td><td>" + calculatePercentOrNone(fieldGoalStats_array[i][m][1], fieldGoalStats_array[i][m][0]) + "%</td><td>" + fieldGoalStats_array[i][m][2] + "</td>");
			if (m > 0) {
				teamFGM += fieldGoalStats_array[i][m][1];
				teamFGA += fieldGoalStats_array[i][m][0];
				teamFGBLK += fieldGoalStats_array[i][m][2];
			}

			// add to multi-team totals
			for (var n=0; n<3; n++) {
				fieldGoalStatTotals[m][n] += fieldGoalStats_array[i][m][n];
			}
		}

		// add totals column for all FGs by this team
		table = table.concat("<td>" + teamFGM + "</td><td>" + teamFGA + "</td><td>" + calculatePercentOrNone(teamFGM, teamFGA) + "%</td><td>" + teamFGBLK + "</td>");
	}

	if (abbrs.length > 1) {
		// don't do a "total" row if there is only one team

		// sum and store the totals for all teams across all ranges
		var allFGM = 0;
		var allFGA = 0;
		var allFGBLK = 0;

		table = table.concat("<tr><th>Total</th>");
		for (var p=0; p<6; p++) {
			table = table.concat("<td>" + fieldGoalStatTotals[p][1] + "</td><td>" + fieldGoalStatTotals[p][0] + "</td><td>" + calculatePercentOrNone(fieldGoalStatTotals[p][1], fieldGoalStatTotals[p][0]) + "%</td><td>" + fieldGoalStatTotals[p][2] + "</td>");

			if (p > 0) {
				allFGM += fieldGoalStatTotals[p][1];
				allFGA += fieldGoalStatTotals[p][0];
				allFGBLK += fieldGoalStatTotals[p][2];
			}
		}

		// add totals column for all FGs by all teams
		table = table.concat("<td>" + allFGM + "</td><td>" + allFGA + "</td><td>" + calculatePercentOrNone(allFGM, allFGA) + "%</td><td>" + allFGBLK + "</td>");
	}

	table = table.concat("</table>");
	return table;
}

function makePuntStatsTable() {
	// own goal to own 40, own 40 to opp 40, opp 40 to opp goal
	// punts, gross yards, punt landing spot, touchbacks, returns, return yards, blocks, block yards

	// create new array for the combined stats of all teams
	var puntStatTotals = new Array(3);
	for (var i=0; i<3; i++) {
		puntStatTotals[i] = new Array(8);
		for (var j=0; j<8; j++) {
			puntStatTotals[i][j] = 0;
		}
	}

	var teamType = "Punting Team";
	if (showOffense) {
		teamType = "Return Team";
	}

	var puntStatHeader = "<th>Punts</th><th>AVG</th><th>NET</th><th>Avg Start</th><th>Touchbacks</th><th>TB%</th><th>RET</th><th>RET%</th><th>Yrd/RET</th><th>BLK</th><th>Yrd/BLK</th>";
	var table = "<table border='1'><th rowspan='2'>" + teamType + "</th><th colspan='11'>Own 0 to Own 40</th><th colspan='11'>Own 40 to Opp 40</th><th colspan='11'>Opp 40 to Opp 0</th><tr>" + puntStatHeader + puntStatHeader + puntStatHeader;

	for (var k=0; k<abbrs.length; k++) {
		table = table.concat("<tr><th>" + abbrs[k] + "</th>");

		for (var l=0; l<3; l++) {
			var netYards = puntStats_array[k][l][1] - puntStats_array[k][l][3] * 20 - puntStats_array[k][l][5];
			table = table.concat("<td>" + puntStats_array[k][l][0] + "</td><td>" + calculateAverage(puntStats_array[k][l][1], puntStats_array[k][l][0]) + "</td><td>" + calculateAverage(netYards, puntStats_array[k][l][0]) + "</td><td>" + calculateAverage(puntStats_array[k][l][2], puntStats_array[k][l][0] + puntStats_array[k][l][6]) + "</td><td>" + puntStats_array[k][l][3] + "</td><td>" + calculatePercent(puntStats_array[k][l][3], puntStats_array[k][l][0]) + "%</td><td>" + puntStats_array[k][l][4] + "</td><td>" + calculatePercent(puntStats_array[k][l][4], puntStats_array[k][l][0]) + "%</td><td>" + calculateAverage(puntStats_array[k][l][5], puntStats_array[k][l][4]) + "</td><td>" + puntStats_array[k][l][6] + "</td><td>" + calculateAverage(puntStats_array[k][l][7], puntStats_array[k][l][6]) + "</td>");

			// add to mulit-team totals
			for (var m=0; m<8; m++) {
				puntStatTotals[l][m] += puntStats_array[k][l][m];
			}
		}
	}

	if (abbrs.length > 1) {
		// don't do a "total" row if there is only one team

		table = table.concat("<tr><th>Total</th>");

		for (var n=0; n<3; n++) {
			var totalNetYards = puntStatTotals[n][1] - puntStatTotals[n][3] * 20 - puntStatTotals[n][5];
			table = table.concat("<td>" + puntStatTotals[n][0] + "</td><td>" + calculateAverage(puntStatTotals[n][1], puntStatTotals[n][0]) + "</td><td>" + calculateAverage(totalNetYards, puntStatTotals[n][0]) + "</td><td>" + calculateAverage(puntStatTotals[n][2], puntStatTotals[n][0] + puntStatTotals[n][6]) + "</td><td>" + puntStatTotals[n][3] + "</td><td>" + calculatePercent(puntStatTotals[n][3], puntStatTotals[n][0]) + "%</td><td>" + puntStatTotals[n][4] + "</td><td>" + calculatePercent(puntStatTotals[n][4], puntStatTotals[n][0]) + "%</td><td>" + calculateAverage(puntStatTotals[n][5], puntStatTotals[n][4]) + "</td><td>" + puntStatTotals[n][6] + "</td><td>" + calculateAverage(puntStatTotals[n][7], puntStatTotals[n][6]) + "</td>");
		}
	}

	table = table.concat("</table>");
	return table;
}

function parsePBP(intext) {
	var startPtr=0, playPtr, ptr2, ptr3, ptr4, ptr5, ptr6, ptr7, ptr8, ptr9, scorePtr, touchdownPtr;
	var kickoffPtr, onsidesPtr, fieldGoalPtr, puntPtr, endSpecialTeamsPtr, extraPointPtr, coveragePtr;
	var pkg, defpkg, form, play, yard, yard2, yardline, comp, scramble, INT, incomplete, loss, isTouchdown, isSuccess;
	var down, togo, distToGo=0, endToGo, gameTime, penalty, noPlay=0, tmp=0, endptr, dumpoff, first_read, preptr=0;
	var pkgid, defpkgid, formid, playid, downDistID, index, run, handoff, sneak, pass, att, tmparr, sack, GCOV;
	var pressScram, coverScram, throwAway, pdef, tkl;
	var WR, WRID, WRpID, WRName, GCOVd, GCOVdpID, GCOVdID, GCOVdName, GCOVer, GCOVerID, GCOVerName, passDefenderpID, passDefenderName;
	var kickerName, kickerTeamName, returnTeamName;
	var RB, RBpID=-1, RBName;
	var defPlaymaker, defPlaymakerpID=-1, defPlaymakerName;
	var startNext, startThis=0, attYard, attYard2, drop, hadYards, tempYardCounter=0;
	var attempts=0, scrambles=0, sacks=0;
	var name1, name2, abbr1, abbr2, name1Index, name2Index, name1AllTeamsIndex, name2AllTeamsIndex;
	var abbr, otherAbbr, offAbbr, defAbbr, scoringAbbr, scoredOnAbbr;
	var bothTeamsValid;
	var kickoff=0, onsides=0, fieldGoal=0, punt=0, extraPoint=0;
	var touchback, kickReturn, squib, kickoffLandingSpot, kickoffReturnSpot, kickReturnInside25, kickReturnTouchdown;
	var fieldGoalDist, fieldGoalMade, fieldGoalBlocked;
	var puntDist, puntLandingSpot, puntBlock, puntBlockYards, puntReturn, puntReturnYards, puntReturnSpot, puntReturnTouchdown;
	var timeoutPtr = 0;
	var coverageCall1="", coverageCall2="", coverageCall3="";

	readcount++;
	var newDiv = document.getElementById('scout_count');
	newDiv.innerHTML= '<span style="background-color:white">' + readcount.toString() + ' of ' + readtarget + ' games</span>';

	// scan for two team names at the top of the log, get team abbrs for each and set them as abbr1, abbr2.
	// on each play, check abbr against one of them, if abbr1 isEqual set defAbbr to abbr2, vice versa.
	// (not yet implemented)

	//alert("started to read the log");

	if (preptr===0) {
		ptr2=intext.indexOf("<center>", preptr);
		if (ptr2!=-1) {
			preptr = ptr2;
		}
	}

	//if (abbrs.length > 1) {
	ptr2=intext.indexOf(" wins the flip and will receive.", preptr);
	if (ptr2!=-1) {
		// get recieving team name (team1)
		ptr3=intext.lastIndexOf("<b>", ptr2);
		if (ptr3!=-1) {
			ptr4=intext.indexOf("</b>", ptr3+3);
			if (ptr4!=-1) {
				name1 = intext.substring(ptr3+3, ptr4);
			}
		}
		// get kicking team name (team2)
		ptr3=intext.indexOf("<b>", ptr2);
		if (ptr3!=-1) {
			ptr4=intext.indexOf("</b>", ptr3+3);
			if (ptr4!=-1) {
				name2 = intext.substring(ptr3+3, ptr4);
			}
		}

		name1AllTeamsIndex = getAllTeamsIndex(name1);
		name2AllTeamsIndex = getAllTeamsIndex(name2);

		name1Index = getTeamIndex(name1);
		name2Index = getTeamIndex(name2);

		if (name1Index != -1 && name2Index != -1) {
			bothTeamsValid = 1;
			abbr1 = abbrs[name1Index];
			abbr2 = abbrs[name2Index];
			//alert(name1 + " with abbr " + abbr1 + " at " + name1Index + ", " + name2 + " with abbr " + abbr2 + " at " + name2Index);
		}
		else {
			bothTeamsValid = 0;

			if (name1AllTeamsIndex != -1 && name2AllTeamsIndex != -1) {
				abbr1 = abbrlist[name1AllTeamsIndex];
				abbr2 = abbrlist[name2AllTeamsIndex];

				//alert("Recording one team. " + name1 + " with abbr " + abbr1 + " at " + name1Index + ", " + name2 + " with abbr " + abbr2 + " at " + name2Index);
			}
			else {
				alert("invalid names: " + name1 + " at " + name1Index + ", " + name2 + " at " + name2Index);
			}
		}
	}
	else {
		alert("could not find coin flip");
	}
	//alert("defPlaymakerpID = " + defPlaymakerpID);
	//}

	while (1) {
		tmp++; // increment

		timeoutPtr = intext.indexOf(" time outs remaining.", preptr);
		//if (timeoutPtr != -1)

		kickoffPtr=intext.indexOf("Kickoff by", preptr);
		onsidesPtr=intext.indexOf("is lining up to try an onside kick.", preptr);
		fieldGoalPtr=intext.indexOf(" is coming on for a ", preptr);
		puntPtr=intext.indexOf("is lined up to punt", preptr);
		endSpecialTeamsPtr=intext.indexOf("The play required ", preptr);

		playPtr=intext.indexOf("Offensive Package Was", preptr); // find next "Offensive Package Was" after preptr

		if (kickoffPtr >= 0 && kickoffPtr < endSpecialTeamsPtr && (kickoffPtr < playPtr || playPtr < 0)) {
			kickoff = 1;
			endptr = endSpecialTeamsPtr;
			//alert("Found kickoff: " + tmp);
		}
		else if (onsidesPtr >= 0 && onsidesPtr < endSpecialTeamsPtr && (onsidesPtr < playPtr || playPtr < 0)) {
			onsides = 1;
			endptr = endSpecialTeamsPtr;
			//alert("Found onsides kick: " + tmp);
		}
		else if (fieldGoalPtr >= 0 && fieldGoalPtr < endSpecialTeamsPtr && (fieldGoalPtr < playPtr || playPtr < 0)) {
			fieldGoal = 1;
			endptr = endSpecialTeamsPtr;
		}
		else if (puntPtr >= 0 && puntPtr < endSpecialTeamsPtr && (puntPtr < playPtr || playPtr < 0)) {
			punt = 1;
			endptr = endSpecialTeamsPtr;
			//alert("Found punt! tmp = " + tmp);
		}
		else {
			endptr=playPtr;
		}

		if (!(kickoff || onsides || fieldGoal || punt) && playPtr < 0) {
			//alert("finished reading the log");
			//alert("found " + tmp + " plays");
			break; // if no more offensive plays, leave
		}
		else if (!(kickoff || onsides) && endptr >= 0) { // if a scrimmage play

			ptr3=intext.lastIndexOf("<span style='font-size:13;'>", endptr); // find start of the final PBP line from this play

			ptr7=intext.indexOf("Two Minute Warning", ptr3); // if imediately before the two minute warning, look for the line before it
			if (ptr7!=-1 && ptr7 < endptr) {
				ptr4=ptr3-28;
				ptr3=intext.lastIndexOf("<span style='font-size:13;'>", ptr4);
			}

			touchdownPtr=intext.indexOf("ouchdown", ptr3); // find next touchdown after start of the final PBP line
			if (touchdownPtr>ptr3 && touchdownPtr < endptr) { // if the touchdown is after the start of the final PBP line and before the package info
				isTouchdown=1;
				ptr3=intext.lastIndexOf("<span style='font-size:13;'>", endptr-5); // sets ptr3 to the final PBP line
			}
			coveragePtr=intext.lastIndexOf("was the man covering on the play");
			if (coveragePtr!=-1 && coveragePtr < endptr) {
				ptr3=intext.lastIndexOf("<span style='font-size:13;'>", ptr3-5);
			}

			coveragePtr=intext.indexOf("was the man covering on the play", preptr);
			if (coveragePtr!=-1 && coveragePtr < endptr) {
				ptr7=intext.lastIndexOf("&lookatplayer=", coveragePtr);
				if (ptr7!=-1 && ptr7<coveragePtr) {
					ptr8=intext.indexOf("&", ptr7+14);
					if (ptr8!=-1 && ptr8<coveragePtr) {
						passDefenderpID = parseInt(intext.substring(ptr7+14, ptr8));
						ptr9=intext.indexOf("<b>", ptr8);
						if (ptr9!=-1 && ptr9<coveragePtr) {
							passDefenderName = intext.substring(ptr9+3, coveragePtr-9);
						}
					}
				}
			}
			else {
				passDefenderpID = -1;
			}

			startNext=intext.indexOf("<span style='font-size:13;'>", endptr); // find the first PBP line on the next play (to find penalties)

			pkg=intext.substring(endptr+29, endptr+38); // get the offensive personel package
			pkgid=getPkgid(pkg);

			ptr4=intext.indexOf("Defensive Package Was", endptr);
			if (ptr4!=-1 && ptr4 < startNext) {
				defpkg=intext.substring(ptr4+29, ptr4+34);
				defpkgid=getDefPkgid(defpkg);
			}

			ptr5=intext.indexOf("<b>Coverage : </b>", ptr4)+18;
			if (ptr5!=-1 && ptr5 < startNext) {
				ptr6=intext.indexOf("; ", ptr5);
				if (ptr6!=-1 && ptr6 < startNext) {
					coverageCall1 = intext.substring(ptr5, ptr6);
					ptr7=intext.indexOf("; ", ptr6+2);
					if (ptr7!=-1 && ptr7 < startNext) {
						coverageCall2 = intext.substring(ptr6+2, ptr7);
					}
					else {
						ptr7 = ptr6;
					}
					ptr8=intext.indexOf("<br>", ptr7+2);
					if (ptr8!=-1 && ptr8 < startNext) {
						coverageCall3 = intext.substring(ptr7+2, ptr8);
					}
				}
			}
			if (coverageCall2 === -1 && coverageCall3 !== -1) {
				coverageCall2 = coverageCall3;
				coverageCall3 = -1;
			}
			//alert("Coverage: '" + coverageCall1 + "', '" + coverageCall2 + "', '" + coverageCall3 + "'");

			if (startThis === 0) {
				startThis=preptr;
			}
			ptr4=intext.indexOf("2 Point Conversion.", preptr);
			if (ptr4!=-1 && ptr4<endptr) {
				preptr=ptr4;
			}

			ptr4=intext.indexOf("<b>", ptr3); // find location of first bolding on last line
			ptr5=intext.indexOf("</b>", ptr4+3); // find location of close of first bolding
			abbr=intext.substring(ptr4+3, ptr5); // get bolded text (offensive team abbr)
			otherAbbr = getOtherAbbr(abbr, abbr1, abbr2);

			ptr4=intext.indexOf("<b>", ptr5+4); // find second bolding: quarter and time remaining
			ptr7=intext.indexOf("</b>", ptr4+3);
			gameTime=intext.substring(ptr4+3, ptr7); // store string with quarter and time remaining.

			/*if (tmp > 157 && tmp < 164) {
				alert("tmp = " + tmp + ", gameTime = " + gameTime + ", abbr = " + abbr + ", otherAbbr = " + otherAbbr);
			} // */

			ptr4=intext.indexOf("<b>", ptr7+4); // third bolding: down and distance
			//ptr7=intext.indexOf("</b>", ptr4+3);
			down=intext.substring(ptr4+4, ptr4+7); // store down ("1st", "2nd", etc)
			ptr7=intext.indexOf(";", ptr4); // find end of distance ("Foot~", "13+", etc)
			togo=intext.substring(ptr4+12, ptr7); // store distance
			endToGo=intext.substring(ptr7-1, ptr7); // get the final char before the ";", which may or not be a "+" or "-"

			ptr5=intext.indexOf(")", ptr7+2);
			yardline = intext.substring(ptr7+2, ptr5); // get the yardline in string form (e.g. "Opp 43")

			/***************************/
			/******* Field Goals *******/
			/***************************/

			if (fieldGoal) {
				//endptr = endSpecialTeamsPtr;

				// The offense is the kicking team
				offAbbr = abbr;
				defAbbr = otherAbbr;

				var FGDistPtr1, FGDistPtr2, FGDecimalDistPtr1, FGDecimalDistPtr2, FGMadePtr1, FGMadePtr2, FGBlkPtr1, FGBlkPtr2;
				var FGMadeStr, FGDistYards, FGDistDecimals;
				fieldGoalBlocked = 0;

				FGDistPtr1 = intext.indexOf(" coming on for a ", preptr);
				if (FGDistPtr1 != -1 && FGDistPtr1 < endptr) {
					FGDistPtr1 += 37;
					FGDistPtr2 = intext.indexOf("</span>", FGDistPtr1);
					FGDistYards = intext.substring(FGDistPtr1, FGDistPtr2);

					FGDecimalDistPtr1 = intext.indexOf("class='supz'>", FGDistPtr2);
					FGDecimalDistPtr1 += 13;
					FGDecimalDistPtr2 = intext.indexOf("</span>", FGDecimalDistPtr1);
					FGDistDecimals = intext.substring(FGDecimalDistPtr1, FGDecimalDistPtr2);

					fieldGoalDist = parseInt(FGDistYards) + parseInt(FGDistDecimals)/100;

					FGMadePtr1 = intext.indexOf("</span> away is ", FGDistPtr2);
					if (FGMadePtr1 != -1 && FGMadePtr1 < endptr) {
						FGMadePtr1 += 16;
						FGMadePtr2 = intext.indexOf("!", FGMadePtr1);
						FGMadeStr = intext.substring(FGMadePtr1, FGMadePtr2);

						if (FGMadeStr === "good") {
							fieldGoalMade = 1;
						}
						else if (FGMadeStr === "no good") {
							fieldGoalMade = 0;
						}
						else {
							alert("field goal neither good nor no good: '" + FGMadeStr + "'");
						}
					}
					else {
						FGBlkPtr1 = intext.indexOf(" was BLOCKED backwards for ", FGDistPtr2);
						if (FGBlkPtr1 != -1 && FGBlkPtr1 < endptr) {
							FGBlkPtr2 = intext.indexOf(" yards and recovered by the ", FGBlkPtr1);
							if (FGBlkPtr2 != -1 && FGBlkPtr2 < endptr) {
								var recoveryTeam = intext.substring(FGBlkPtr2+28, FGBlkPtr2+35);
								if (recoveryTeam === "defense") {
									// blocked kick recovered by the defense, the play will have read in the wrong abbreviation. Swap them.
									offAbbr = otherAbbr;
									defAbbr = abbr;
								}
								else if (recoveryTeam !== "offense") {
									alert("Blocked field goal recovered by unknown team '" + recoveryTeam + "'");
								}
							}
							//alert("Field goal blocked! dist = " + fieldGoalDist + ", time = " + gameTime + ", offAbbr = " + offAbbr + ", defAbbr = " + defAbbr);
							fieldGoalBlocked = 1;
							fieldGoalMade = 0;

						}
					}

					//alert("found field goal attempt. distance = " + fieldGoalDist + ", made = " + fieldGoalMade + ", time = " + gameTime + ", tmp = " + tmp + ", offAbbr = " + offAbbr);
				}
			}

			/***************************/
			/********** Punts **********/
			/***************************/

			else if (punt) {
				//endptr = endSpecialTeamsPtr;

				// the offense is the return team
				offAbbr = otherAbbr;
				defAbbr = abbr;

				var puntDistPtr1, puntDistPtr2, puntDecimalDistPtr1, puntDecimalDistPtr2, puntResultPtr;
				var puntReturnDistPtr1, puntReturnDistPtr2, returnDecimalPtr1, returnDecimalPtr2;
				var returnYards, returnDecimals;
				var puntDistYards = 0;
				var puntDistDecimals = 0;
				var returnDistYards = 0;
				var returnDistDecimals = 0;
				var puntBlockReturnYards = 0;
				var puntReturnDistStr;
				var puntReturnYardLine;
				var puntReturnFieldSide;

				puntDistPtr1 = intext.indexOf("</b></a> for <span class='supza'>", preptr);
				if (puntDistPtr1 != -1 && puntDistPtr1 < endptr) { // if successfully punted
					puntDistPtr2 = intext.indexOf("</span>", puntDistPtr1);
					puntDistYards = intext.substring(puntDistPtr1+33, puntDistPtr2);
					puntDecimalDistPtr1 = puntDistPtr2+32;
					puntDecimalDistPtr2 = intext.indexOf("</span>", puntDecimalDistPtr1);
					puntDistDecimals = intext.substring(puntDecimalDistPtr1, puntDecimalDistPtr2);

					puntDist = parseInt(puntDistYards) + parseInt(puntDistDecimals)/100;

					//alert("puntDist = " + puntDist + ", yards = " + puntDistYards + ", decimals = " + puntDistDecimals);

					puntResultPtr = intext.indexOf(" yards; touchback.", puntDecimalDistPtr2);
					if (puntResultPtr != -1 && puntResultPtr < endptr) {
						puntReturn = 0;
						touchback = 1;
						//alert("Punt touchback! time = " + gameTime);
					}
					else {
						puntResultPtr = intext.indexOf(" yards; no return.", puntDecimalDistPtr2);
						if (puntResultPtr != -1 && puntResultPtr < endptr) {
							puntReturn = 0;
							touchback = 0;
							//alert("Punt not returnable! time = " + gameTime);
						}
						else {
							puntResultPtr = intext.indexOf(" yards.. looks to be returnable.", puntDecimalDistPtr2);
							if (puntResultPtr != -1 && puntResultPtr < endptr) {
								puntReturn = 1;
								touchback = 0;
								//alert("Punt returned! time = " + gameTime);

								// find the yardline the punt was returned to
								puntReturnDistPtr1 = intext.indexOf(" yards to the ", puntResultPtr);
								if (puntReturnDistPtr1 != -1 && puntReturnDistPtr1 < endptr) {
									puntReturnDistPtr1 += 14;
									puntReturnDistPtr2 = intext.indexOf(" yardline.", puntReturnDistPtr1);
									if (puntReturnDistPtr2 != -1 && puntReturnDistPtr2 < endptr) {
										puntReturnDistStr = intext.substring(puntReturnDistPtr1, puntReturnDistPtr2);
										// punt return yards are currently innacurate, the are derrived from the imprecice yardlines
										// instead of the much more precise listed return distances
										//puntReturnYards = parseInt(FGDistYards) + parseInt(FGDistDecimals)/100;
										if (puntReturnDistStr.includes("Midfield")) {
											puntReturnSpot = 50;
											puntReturnYardLine = "50";
											puntReturnFieldSide = "midfield";
										}
										else {
											puntReturnFieldSide = puntReturnDistStr.substring(0, 3);
											puntReturnYardLine = puntReturnDistStr.substring(4, puntReturnDistStr.length);
											puntReturnSpot = parseInt(puntReturnYardLine);
											if (puntReturnFieldSide == "Opp") {
												puntReturnSpot = 100 - puntReturnSpot;
											}
										}

										touchdownPtr = intext.indexOf("TOUCHDOWN!", puntReturnDistPtr2);
										if (touchdownPtr != -1 && touchdownPtr < endptr) {
											puntReturnTouchdown = 1;
											isTouchdown = 1;
										}
										//alert("punt returned to the '" + puntReturnFieldSide + "' '" + puntReturnYardLine + "', '" + puntReturnSpot + "' yards from the goal line");
									}
								}
							}
						}
					}
				}
				else { // if blocked
					puntBlock = 1;
					puntDistPtr1 = intext.indexOf(" was BLOCKED backwards for <span class='supza'>", preptr);
					if (puntDistPtr1 != -1 && puntDistPtr1 < endptr) {
						puntDistPtr2 = intext.indexOf("</span>", puntDistPtr1);
						puntDistYards = intext.substring(puntDistPtr1+47, puntDistPtr2);
						puntDecimalDistPtr1 = puntDistPtr2+32;
						puntDecimalDistPtr2 = intext.indexOf("</span>", puntDecimalDistPtr1);
						puntDistDecimals = intext.substring(puntDecimalDistPtr1, puntDecimalDistPtr2);

						puntBlockYards = parseInt(puntDistYards) + parseInt(puntDistDecimals)/100;

						var recoveryPtr = intext.indexOf(" and recovered by the defense.", puntDecimalDistPtr2);
						if (recoveryPtr != -1 && recoveryPtr < endptr) {
							// the blocked punt was recovered by the defense and potentially returned
							// the block and the return are considered separate plays in the log, with separate times shown
							endptr = intext.indexOf("The play required ", endSpecialTeamsPtr+20);

							puntReturnDistPtr1 = intext.indexOf("The blocked punt was returned ", endSpecialTeamsPtr);
							if (puntReturnDistPtr1 != -1 && puntReturnDistPtr1 < endptr) { // if the blocked punt is returned
								puntReturnDistPtr2 = intext.indexOf(" for a TOUCHDOWN", puntReturnDistPtr1);
								if (puntReturnDistPtr2 === -1 || puntReturnDistPtr2 >= endptr) { // if the blocked punt is not returned for a touchdown
									puntReturnDistPtr2 = intext.indexOf(" yards.", puntReturnDistPtr1);
								}
								returnDistYards = intext.substring(puntReturnDistPtr1+30, puntReturnDistPtr2);
								puntBlockReturnYards = parseInt(returnDistYards);
							}
						}
						//alert("Punt blocked backwards " + puntBlockYards + " yards and returned " + puntBlockReturnYards + " yards.");
						puntBlockYards += puntBlockReturnYards;
					}
					else {
						alert("Blocked punt not parsed properly! timestamp = " + gameTime + ", offAbbr = " + offAbbr + ", defAbbr = " + defAbbr);
					}
				}
			}

			/***************************/
			/***** Offensive Plays *****/
			/***************************/

			else { // not a special teams scrimmage play
				// the offense is the offense
				offAbbr = abbr;
				defAbbr = otherAbbr;

				ptr4=intext.indexOf("a gain of", preptr); // find next "a gain of", if it exists and is before the end move it to ptr5
				loss=0;
				hadYards=1;
				if (ptr4!=-1 && ptr4<endptr) {
					ptr5=ptr4;
				}
				else {
					ptr4=intext.indexOf("a LOSS of", preptr); // do previous for "a loss of"
					if (ptr4!=-1 && ptr4<endptr) {
						ptr5=ptr4; loss=1;
					}
					else {
						ptr4=intext.indexOf(" gains ", preptr); // do previous for "gains"
						if (ptr4!=-1 && ptr4<endptr) {
							ptr5=ptr4;
						}
						else {
							ptr4=intext.indexOf(" loses ", preptr); // do previous for "loses"
							if (ptr4!=-1 && ptr4<endptr) {
								ptr5=ptr4; loss=1;
							}
							else {
								ptr4=intext.indexOf(" keeps it and runs ", preptr);
								if (ptr4!=-1 && ptr4<endptr) {
									ptr5=ptr4;
								}
								else {
									ptr4=intext.indexOf("SACKED", preptr);
									if (ptr4!=-1 && ptr4<endptr) {
										ptr5=ptr4;
										loss=1;
									}
									else {
										ptr5=-1; // set ptr to -1 (no loss or gain on the play)
										hadYards=0;
									} // else
								} // else
							} // else
						} // else
					} // else
				} // else
				if (ptr5!=-1) { // if a play happened
					ptr4=intext.indexOf("class='supza'>", ptr5); // find tag for yardage
					if (ptr4!=-1 && ptr4<endptr) { // if yardage happened
						ptr5=intext.indexOf("</span>", ptr4+14); // find end of yardage tag
						yard=intext.substring(ptr4+14, ptr5); // get full yardage
						ptr4=intext.indexOf("class='supz'>", ptr5);
						ptr5=intext.indexOf("</span>", ptr4+13);
						yard2=intext.substring(ptr4+13, ptr5); // get decimal yardage
						if (loss === 0) { // combine into one value
							yard=parseInt(yard) + parseInt(yard2)/100;
						} else if (loss==1) {
							yard= -1 * (Math.abs(parseInt(yard)) + parseInt(yard2)/100);
						} // */
					} // if ptr4!=-1 ...
					else yard=0;
				} // if ptr5!=-1
				else yard=0;

				ptr4=intext.indexOf("penalty", startThis); // test if play was a penalty
				if (ptr4!=-1 && ptr4<startNext) {
					ptr4=intext.indexOf("enalty <b>declined</b>", startThis);
					if (ptr4!=-1 && ptr4<startNext) {
						//alert("penalty declined! game time = " + gameTime);
						penalty=0;
						noPlay=0;
					}
					else {
						penalty=1;
						ptr4=intext.indexOf(" assessed at the end of ", startThis);
						if (ptr4!=-1 && ptr4<startNext) {
							noPlay = 0;
						}
						else {
							ptr4=intext.indexOf("enalty <b>accepted</b>", startThis);
							if (ptr4!=-1 && ptr4<startNext) {
								//alert("penalty accepted! game time = " + gameTime);
								noPlay = 1;
							}
							else {
								ptr4=intext.indexOf(" yard penalty; Automatic First Down!", startThis);
								if (ptr4!=-1 && ptr4<startNext) {
									noPlay = 1;
								}
								else {
									noPlay = 0;
								}
							}
						}
					}
				}
				else {
					penalty=0;
					noPlay=0;
				}

				ptr4=intext.indexOf(" primary option was ", preptr); // test for GCOVs
				if (ptr4!=-1 && ptr4<endptr) {
					GCOV=1;
					GCOVd = intext.substring(ptr4+20, ptr4+23);
					GCOVdID = getWRID(GCOVd);

					// get name and ID for the reciever
					ptr5=intext.indexOf("&lookatplayer=", ptr4);
					if (ptr5!=-1 && ptr5<ptr4+100) {
						ptr4=intext.indexOf("&", ptr5+14);
						if (ptr4!=-1 && ptr4<ptr5+30) { // if a player with an id longer than 16 digits exists, this will break
							GCOVdpID = intext.substring(ptr5+14, ptr4);
							GCOVdpID = parseInt(GCOVdpID);

							ptr5=intext.indexOf("<b>", ptr4+11);
							if (ptr5!=-1 && ptr5<ptr4+17) {
								ptr4=intext.indexOf("</b>", ptr5+3);
								if (ptr4!=-1 && ptr4<ptr5+50) {
									GCOVdName = intext.substring(ptr5+3, ptr4);
								}
							}
						}
					}

					coveragePtr=intext.indexOf(" Good coverage by ", ptr4);
					if (coveragePtr!=-1 && coveragePtr<endptr) {
						GCOVer = intext.substring(coveragePtr+18, coveragePtr+22);
					}

					// get name and ID for the defender
					ptr5=intext.indexOf("</a> on the play.", coveragePtr);
					if (ptr5!=-1 && ptr5<endptr) {
						ptr4=intext.lastIndexOf("&lookatplayer=", ptr5);
						if (ptr4!=-1 && ptr4<ptr5) {
							coveragePtr=intext.indexOf("&", ptr4+14);
							if (coveragePtr!=-1 && coveragePtr<ptr5) {
								GCOVerID = parseInt(intext.substring(ptr4+14, coveragePtr));
								ptr7=intext.indexOf("<b>", ptr4+14);
								if (ptr7!=-1 && ptr7<ptr5) {
									GCOVerName = intext.substring(ptr7+3, ptr5-4);
								}
							}
						}
					}
					//alert("GCOV by the " + GCOVer + ". Name = " + GCOVerName + ", pID = " + GCOVerID);
				}
				else {
					GCOV=0;
					GCOVd=-1;
					GCOVdID=-1;
					GCOVdpID=-1;
					GCOVerID=-1;
				}

				ptr4=intext.indexOf("dump it off", preptr); // test if play was a dumpoff
				if (ptr4!=-1 && ptr4<endptr) {
					dumpoff=1;
				}
				else {
					dumpoff=0;
				}

				ptr4=intext.indexOf("threw the ball away", preptr); // check for throwaways
				if (ptr4!=-1 && ptr4<endptr) {
					throwAway = 1;
				}
				else {
					throwAway = 0;
				}

				ptr4=intext.indexOf("scrambles..", preptr);
				if (ptr4!=-1 && ptr4<endptr) {
					scramble=1;
					WRID = -1;
					WRpID = -1;
					passDefenderpID = -1;
				}
				else {
					scramble=0;
				}

				ptr4=intext.indexOf("t see anyone open ", preptr);
				if (ptr4!=-1 && ptr4<endptr) {
					coverScram = 1;
					scramble = 1;
				}
				else {
					coverScram = 0;
				}

				ptr4=intext.indexOf("under pressure and has decided to run", preptr);
				if (ptr4!=-1 && ptr4<endptr) {
					pressScram = 1;
					scramble = 1;
				}
				else {
					pressScram = 0;
				}

				ptr4=intext.indexOf("INTERCEPTED by", preptr);
				if (ptr4!=-1 && ptr4<endptr) {
					INT = 1;
					//pdef = 1;
					comp = 0;
					defPlaymaker = intext.substring(ptr4+15, ptr4+19);
					ptr5 = intext.indexOf("&lookatplayer=", ptr4);
					if (ptr5!=-1 && ptr5<endptr) {
						ptr6 = intext.indexOf("&", ptr5+14);
						if (ptr6!=-1 && ptr6<endptr) {
							defPlaymakerpID = parseInt(intext.substring(ptr5+14, ptr6));
							ptr7 = intext.indexOf("<b>", ptr6);
							if (ptr7!=-1 && ptr7<endptr) {
								ptr8 = intext.indexOf("</b>", ptr7+3);
								defPlaymakerName = intext.substring(ptr7+3, ptr8);
							}
						}
					}
				}
				else {
					INT = 0;
				}

				ptr4=intext.indexOf(".. credit ", preptr); // pass deflections
				if (ptr4!=-1 && ptr4<endptr) {
					pdef = 1;
					comp = 0;
					defPlaymaker = intext.substring(ptr4+15, ptr4+19);
					ptr5 = intext.indexOf("&lookatplayer=", ptr4);
					if (ptr5!=-1 && ptr5<endptr) {
						ptr6 = intext.indexOf("&", ptr5+14);
						if (ptr6!=-1 && ptr6<endptr) {
							defPlaymakerpID = parseInt(intext.substring(ptr5+14, ptr6));
							ptr7 = intext.indexOf("<b>", ptr6);
							if (ptr7!=-1 && ptr7<endptr) {
								ptr8 = intext.indexOf("</b>", ptr7+3);
								defPlaymakerName = intext.substring(ptr7+3, ptr8);
							}
						}
					}
				}
				else {
					//if (INT == 0) {
					pdef = 0;
					//}
				}

				ptr4=intext.indexOf("tackled by ", preptr); // tackles
				if (ptr4!=-1 && ptr4<endptr) {
					tkl = 1;
					defPlaymaker = intext.substring(ptr4+15, ptr4+19);
					ptr5 = intext.indexOf("&lookatplayer=", ptr4);
					if (ptr5!=-1 && ptr5<endptr) {
						ptr6 = intext.indexOf("&", ptr5+14);
						if (ptr6!=-1 && ptr6<endptr) {
							defPlaymakerpID = parseInt(intext.substring(ptr5+14, ptr6));
							ptr7 = intext.indexOf("<b>", ptr6);
							if (ptr7!=-1 && ptr7<endptr) {
								ptr8 = intext.indexOf("</b>", ptr7+3);
								defPlaymakerName = intext.substring(ptr7+3, ptr8);
							}
						}
					}
				}
				else {
					ptr4=intext.indexOf("ridden out of bounds by ", preptr);
					if (ptr4!=-1 && ptr4<endptr) {
						tkl = 1;
						defPlaymaker = intext.substring(ptr4+15, ptr4+19);
						ptr5 = intext.indexOf("&lookatplayer=", ptr4);
						if (ptr5!=-1 && ptr5<endptr) {
							ptr6 = intext.indexOf("&", ptr5+14);
							if (ptr6!=-1 && ptr6<endptr) {
								defPlaymakerpID = parseInt(intext.substring(ptr5+14, ptr6));
								ptr7 = intext.indexOf("<b>", ptr6);
								if (ptr7!=-1 && ptr7<endptr) {
									ptr8 = intext.indexOf("</b>", ptr7+3);
									defPlaymakerName = intext.substring(ptr7+3, ptr8);
								}
							}
						}
					}
					else {
						tkl = 0;
					}
				} // */

				pass=0; // test if pass play
				ptr4=intext.indexOf(" pass ", preptr);
				if (ptr4!=-1 && ptr4<endptr) {
					pass=1;
					ptr5=intext.indexOf("<b>AMAZING</b> catch by ", preptr);
					if (ptr5!=-1 && ptr5<endptr) {
						comp = 1;
						WR = intext.substring(ptr5+24, ptr5+27);
						WRID = getWRID(WR);

						ptr6=intext.indexOf("&lookatplayer=", ptr5+27);
						if (ptr6!=-1 && ptr6<ptr5+100) {
							ptr7=intext.indexOf("&", ptr6+14);
							if (ptr7!=-1 && ptr7<ptr6+30) {
								WRpID = intext.substring(ptr6+14, ptr7);
								WRpID = parseInt(WRpID);

								ptr5=intext.indexOf("<b>", ptr7+11);
								if (ptr5!=-1 && ptr5<ptr7+17) {
									ptr6=intext.indexOf("</b>", ptr5+3);
									if (ptr6!=-1 && ptr6<ptr5+50) {
										WRName = intext.substring(ptr5+3, ptr6);
									}
								}
							}
						}
						//alert("Amazing catch by " + WR + ". Name = " + WRName + ", pID = " + WRpID);
					}
					else {
						WRID = -1;
						WRpID = -1;
					}
				}

				ptr4=intext.indexOf(" throwing ", preptr);
				if (ptr4!=-1 && ptr4<endptr) {
					pass=1;
				}

				ptr4=intext.indexOf("threw the ball away", preptr);
				if (ptr4!=-1 && ptr4<endptr) {
					pass=1;
					comp=0;
					WRID=-1;
					WRpID=-1;
					passDefenderpID=-1;
				}

				ptr4=intext.indexOf(" Pass by", preptr);
				if (ptr4!=-1 && ptr4<endptr) {
					pass=1;
					ptr5=intext.indexOf(" to ", ptr4);
					ptr6=intext.indexOf(",to ", ptr4);
					if (ptr5!=-1 && ptr5<endptr && intext.substring(ptr5+4, ptr5+7)!="exe") {
						WR = intext.substring(ptr5+4, ptr5+7);

						ptr8=intext.indexOf("&lookatplayer=", ptr5+27);
						if (ptr8!=-1 && ptr8<ptr5+100) {
							ptr7=intext.indexOf("&", ptr8+14);
							if (ptr7!=-1 && ptr7<ptr8+30) {
								WRpID = intext.substring(ptr8+14, ptr7);
								WRpID = parseInt(WRpID);

								ptr9=intext.indexOf("<b>", ptr7+11);
								if (ptr9!=-1 && ptr9<ptr7+17) {
									ptr8=intext.indexOf("</b>", ptr9+3);
									if (ptr8!=-1 && ptr8<ptr9+50) {
										WRName = intext.substring(ptr9+3, ptr8);
									}
								}
							}
						}
						//alert("Pass thrown to " + WR + ". Name = " + WRName + ", pID = " + WRpID);
					}
					else if (ptr6!=-1 && ptr6<endptr) {
						WR = intext.substring(ptr6+4, ptr6+7);

						ptr8=intext.indexOf("&lookatplayer=", ptr6+27);
						if (ptr8!=-1 && ptr8<ptr6+100) {
							ptr7=intext.indexOf("&", ptr8+14);
							if (ptr7!=-1 && ptr7<ptr8+30) {
								WRpID = intext.substring(ptr8+14, ptr7);
								WRpID = parseInt(WRpID);

								ptr9=intext.indexOf("<b>", ptr7+11);
								if (ptr9!=-1 && ptr9<ptr7+17) {
									ptr8=intext.indexOf("</b>", ptr9+3);
									if (ptr8!=-1 && ptr8<ptr9+50) {
										WRName = intext.substring(ptr9+3, ptr8);
									}
								}
							}
						}
						//alert("Pass thrown to " + WR + ". Name = " + WRName + ", pID = " + WRpID);
					}
					else {
						ptr5=intext.indexOf("DROPPED by ", preptr);
						if (ptr5!=-1 && ptr5<endptr) {
							WR = intext.substring(ptr5+11, ptr5+14);
							//alert("drop by " + WR + ", readcount = " + readcount + ", tmp = " + tmp + ", offAbbr = " + offAbbr);
							drop = 1;
							comp = 0;

							ptr8=intext.indexOf("&lookatplayer=", ptr5+27);
							if (ptr8!=-1 && ptr8<ptr5+100) {
								ptr7=intext.indexOf("&", ptr8+14);
								if (ptr7!=-1 && ptr7<ptr8+30) {
									WRpID = intext.substring(ptr8+14, ptr7);
									WRpID = parseInt(WRpID);

									ptr9=intext.indexOf("<b>", ptr7+11);
									if (ptr9!=-1 && ptr9<ptr7+17) {
										ptr8=intext.indexOf("</b>", ptr9+3);
										if (ptr8!=-1 && ptr8<ptr9+50) {
											WRName = intext.substring(ptr9+3, ptr8);
										}
									}
								}
							}
							//alert("Pass dropped by " + WR + ". Name = " + WRName + ", pID = " + WRpID);
						}
						else {
							WRID = -1;
							WRpID = -1;
							drop = 0;
						}
					}
					if (WR != "exe") {
						WRID = getWRID(WR);
					}
					else {
						WRID = -1;
						WRpID = -1;
					} // */
				}
				ptr4=intext.indexOf(" <b>COMPLETE</b> ", preptr);
				if (ptr4!=-1 && ptr4<endptr) {
					comp = 1;
				}
				else {
					comp = 0;
				}

				if (pass===0 && scramble==1) {
					pass=1;
				}
				if (pass) {
					att=1;
				}
				else {
					att=0;
				}
				if (scramble) {
					att=0;
				}
				ptr4=intext.indexOf("SACKED", preptr); // test if play was a sack
				if (ptr4!=-1 && ptr4<endptr) {
					att=0;
					pass=1;
					sack=1;
				}
				else {
					sack=0;
				}

				if (att === 0) {
					WRID = -1;
					WRpID = -1;
					passDefenderpID = -1;
				}

				run=0;
				ptr4=intext.indexOf(" Handoff to ", preptr);
				if (ptr4!=-1 && ptr4<endptr) {
					run=1;
					handoff=1;

					RB = intext.substring(ptr4+12, ptr4+15);

					ptr6=intext.indexOf("&lookatplayer=", ptr4+27);
					if (ptr6!=-1 && ptr6<ptr4+100) {
						ptr7=intext.indexOf("&", ptr6+14);
						if (ptr7!=-1 && ptr7<ptr6+30) {
							RBpID = intext.substring(ptr6+14, ptr7);
							RBpID = parseInt(RBpID);

							ptr9=intext.indexOf("<b>", ptr7+11);
							if (ptr9!=-1 && ptr9<ptr7+17) {
								ptr8=intext.indexOf("</b>", ptr9+3);
								if (ptr8!=-1 && ptr8<ptr9+50) {
									RBName = intext.substring(ptr9+3, ptr8);
									//alert("Handoff! Pos = " + RB + ", pID = " + RBpID + ", Name = " + RBName);
								}
							}
						}
					}
					//alert("Handoff! RB = " + RB + ", game time = " + gameTime);
				}

				ptr4=intext.indexOf(" keeps it and runs ", preptr);
				if (ptr4!=-1 && ptr4<endptr) {
					run=1;
					sneak=1;

					//alert("Keeper! RB = " + RB + ", gameTime = " + gameTime);

					ptr6=intext.indexOf("&lookatplayer=", ptr4-150);
					if (ptr6!=-1 && ptr6<ptr4) {
						ptr7=intext.indexOf("&", ptr6+14);
						//alert("Keeper! RB = " + RB + ", gameTime = " + gameTime);
						if (ptr7!=-1 && ptr7<ptr6+30) {
							RBpID = intext.substring(ptr6+14, ptr7);
							RBpID = parseInt(RBpID);

							ptr9=intext.indexOf("<b>", ptr7+11);
							if (ptr9!=-1 && ptr9<ptr7+17) {
								ptr8=intext.indexOf("</b>", ptr9+3);
								if (ptr8!=-1 && ptr8<ptr9+50) {
									RBName = intext.substring(ptr9+3, ptr8);
								}
							}
						}

						ptr5=intext.lastIndexOf("<a target", ptr6);
						if (ptr5!=-1) {
							RB = intext.substring(ptr5-3, ptr5);
						}
						//alert("Keeper! Pos = " + RB + ", pID = " + RBpID + ", Name = " + RBName);
					}
				}
				if (run==1 && (scramble==1 || sack==1)) {
					run=0;
				} // */

				if (att == 1) {
					ptr4=intext.indexOf(" yard(s) downfield, ", preptr);
					if (ptr4!=-1 && ptr4<endptr) {
						ptr5=intext.indexOf("class='supza'>", ptr4-70);
						if (ptr5!=-1 && ptr5<endptr) {
							ptr4=intext.indexOf("</span>", ptr5+14);
							var sign = intext.substring(ptr5+14, ptr5+15);
							attYard=intext.substring(ptr5+14, ptr4);
							ptr5=intext.indexOf("class='supz'>", ptr4);
							ptr4=intext.indexOf("</span>", ptr5+13);
							attYard2=intext.substring(ptr5+13, ptr4);
							if (sign == "-") {
								attYard = -1 * (Math.abs(parseInt(attYard)) + parseInt(attYard2)/100);
							}
							else {
								attYard = parseInt(attYard) + parseInt(attYard2)/100;
							}
						}
					}
				}
				else {
					attYard = "";
				}

				/*if (correctAbbr(abbr, showOffense) && hadYards && (noPlay == 0)) {
					tempYardCounter+=yard;
					alert("Play with yardage: offense moved " + yard.toFixed(2) + ". down/dist = " + down + " and " + togo + ", game time = " + gameTime + ".\nYards thus far = " + tempYardCounter.toFixed(2));
				} // */
			} // end non special teams scrimmage plays
		}
		else { // non-scrimmage play
			//alert("SPECIAL TEAMS! kickoff = " + kickoff + ", onsides = " + onsides + ", fieldGoal = " + fieldGoal + ", punt = " + punt + ", tmp = " + tmp);
			var kickerPtr1, kickerPtr2, kickerTeamPtr1, kickerTeamPtr2, kickDistPtr1, kickDistPtr2, returnDistPtr1, returnDistPtr2;
			var returnerPtr1, returnerPtr2;
			var gotKickerInfo = 0;
			var kickDistStr, returnDistStr, returnYardLine, returnFieldSide;

			endptr = endSpecialTeamsPtr;

			if (kickoff) {
				//alert("it's a kickoff! kickoffPtr = " + kickoffPtr);
				//alert("kickoff surroundings: '" + intext.substring(kickoffPtr-200, kickoffPtr+200) + "'");
				kickerPtr1 = intext.indexOf("<b>", kickoffPtr); // find the name of the kicker
				if (kickerPtr1 != -1 && kickerPtr1 < endptr) {
					kickerPtr2 = intext.indexOf("</b>", kickerPtr1+3);
					if (kickerPtr2 != -1 && kickerPtr2 < endptr) {
						kickerName = intext.substring(kickerPtr1+3, kickerPtr2);
						kickerTeamPtr1 = intext.indexOf("<b>", kickerPtr2+4); // find the name of the kicking team
						if (kickerTeamPtr1 != -1 && kickerTeamPtr1 < endptr) {
							kickerTeamPtr2 = intext.indexOf("</b>", kickerTeamPtr1+3);
							if (kickerTeamPtr2 != -1 && kickerTeamPtr2 < endptr) {
								kickerTeamName = intext.substring(kickerTeamPtr1+3, kickerTeamPtr2);
								var nameIndex = getAllTeamsIndex(kickerTeamName);
								defAbbr = abbrlist[nameIndex];
								//alert("found a kickoff");
								if (defAbbr == abbr1) {
									offAbbr = abbr2;
									returnTeamName = name2;
								}
								else if (defAbbr == abbr2) {
									offAbbr = abbr1;
									returnTeamName = name1;
								}
								else {
									alert("defAbbr '" + defAbbr + "' does not match '" + abbr1 + "' or '" + abbr2 + "'");
								}

								gotKickerInfo = 1;
								//alert("Kicker name = " + kickerName + ", kicking team name = " + kickerTeamName + ", defAbbr = " + defAbbr);
							}
						}
					}
				}
				else {
					alert("Couldn't find kicker. kickerPtr1 = " + kickerPtr1 + ". Surroundings: '" + intext.substring(kickoffPtr-200, kickoffPtr) + "' SPLIT HERE '" + intext.substring(kickoffPtr, kickoffPtr+200) + "'");
					//alert("endptr = '" + intext.substring(endptr, endptr+50) + "'");
				}
				if (gotKickerInfo) {
					//alert("kickerTeamPtr2 surroundings: '" + intext.substring(kickerTeamPtr2-50, kickerTeamPtr2) + "[BREAK HERE]" + intext.substring(kickerTeamPtr2, kickerTeamPtr2+50) + "'");
					kickDistPtr1 = intext.indexOf("Ball travels to their ", kickerTeamPtr2);
					if (kickDistPtr1 != -1 && kickDistPtr1 < endptr) {
						//alert("Got distPtr1");
						kickDistPtr2 = intext.indexOf(" yardline", kickDistPtr1+22);
						if (kickDistPtr2 != -1 && kickDistPtr2 < endptr) {
							kickDistStr = intext.substring(kickDistPtr1+22, kickDistPtr2);
							//alert("kick travels to the '" + kickDistStr + "'");
							touchback = 0;
							kickoffLandingSpot = parseInt(intext.substring(kickDistPtr1+25, kickDistPtr2));
							//alert("kickoffLandingSpot = " + kickoffLandingSpot);
							returnerPtr1 = intext.indexOf("<b>", kickDistPtr2);
							if (returnerPtr1 != -1 && returnerPtr1 < endptr) {
								returnerPtr2 = intext.indexOf("</b>", returnerPtr1+3);
								if (returnerPtr2 != -1 && returnerPtr2 < endptr) {
									// extract returner name here
								}
							}
							returnDistPtr1 = intext.indexOf(" yards to the ", kickDistPtr2);
							if (returnDistPtr1 != -1 && returnDistPtr1 < endptr) {
								returnDistPtr1 += 14;
								returnDistPtr2 = intext.indexOf(".", returnDistPtr1);
								if (returnDistPtr2 != -1 && returnDistPtr2 < endptr) {
									returnDistStr = intext.substring(returnDistPtr1, returnDistPtr2);
									if (returnDistStr.includes("Midfield")) {
										kickoffReturnSpot = 50;
										returnYardLine = "50";
										returnFieldSide = "midfield";
									}
									else {
										returnFieldSide = returnDistStr.substring(0, 3);
										returnYardLine = returnDistStr.substring(4, returnDistStr.length);
										kickoffReturnSpot = parseInt(returnYardLine);
										if (returnFieldSide == "Opp") {
											kickoffReturnSpot = 100 - kickoffReturnSpot;
										}
									}
									if (kickoffReturnSpot < 25) {
										kickReturnInside25 = 1;
									}
									else {
										kickReturnInside25 = 0;
									}

									touchdownPtr = intext.indexOf("TOUCHDOWN!", returnDistPtr2);
									if (touchdownPtr != -1 && touchdownPtr < endptr) {
										kickReturnTouchdown = 1;
										isTouchdown = 1;
									}
									//alert("kickoff returned to the '" + returnFieldSide + "' '" + returnYardLine + "', '" + kickoffReturnSpot + "' yards from the goal line");
								}
							}
						}
					}
					else {
						kickDistPtr1 = intext.indexOf(" Ball travels into the endzone.", kickerTeamPtr2);
						if (kickDistPtr1 != -1) {
							touchback = 1;
							endptr = kickDistPtr1;
							//alert("Touchback! Surroundings: '" + intext.substring(kickerTeamPtr2-100, kickerTeamPtr2) + "' SPLIT HERE '" + intext.substring(kickerTeamPtr2, kickerTeamPtr2+200) + "'");
							//alert("endptr = '" + intext.substring(endptr, endptr+50) + "'");
						}
					}
				}
			}
		}

		if (isTouchdown) {
			// locate the extra point attempt, if any
			scorePtr = intext.indexOf("<tr><td bgcolor=\"#eeee99\">", touchdownPtr); // find the score indicator after the touchdown
			extraPointPtr=intext.indexOf("Extra Point attempt by ", preptr);
			if (extraPointPtr!=-1 && extraPointPtr < scorePtr) {
				ptr8=intext.indexOf(" is Good!", extraPointPtr);
				if (ptr8!=-1 && ptr8 < scorePtr) {
					fieldGoalMade = 1;
					extraPoint = 1;
				}
				else {
					ptr9=intext.indexOf(" is No Good!", extraPointPtr);
					if (ptr9!=-1 && ptr9 < scorePtr) {
						fieldGoalMade = 0;
						extraPoint = 1;
					}
					else {
						alert("Extra point attempt neither Good nor No Good! tmp = " + tmp);
					}
				}
				//alert("Extra point attempt after KRTD! tmp = " + tmp + ", isTouchdown = " + isTouchdown);
			}
		}


		/*********************************************************/
		/*********************************************************/
		/* * * * * * * * * START RECORDING STATS * * * * * * * * */
		/*********************************************************/
		/*********************************************************/


		distToGo = getDistToGo(togo, endToGo);

		var distToSuccess = getDistToSuccess(distToGo, down);

		var downInt = convertDownToInt(down);

		isSuccess = getSuccess(yard, distToGo, down, isTouchdown);

		if (correctAbbr(offAbbr, defAbbr, showOffense) && (run==1 || pass==1) && distToGo!=-1 && isSuccess!=-1 && pkgid>=0 && pkgid<=7 && (noPlay===0) || withPens) {
			if (down=="1st") {
				downDistID=0;
				checkRunPass(run, pass, pkgid, downDistID, yard, isSuccess);
			} else if (down=="2nd") {
				if (distToGo>=0 && distToGo<=shortSplit) {
					downDistID=1;
				} else if (distToGo>shortSplit && distToGo<=longSplit) {
					downDistID=2;
				} else if (distToGo>longSplit) {
					downDistID=3;
				}
				checkRunPass(run, pass, pkgid, downDistID, yard, isSuccess);
			} else if (down=="3rd" || down=="4th") {
				if (distToGo>=0 && distToGo<=shortSplit) {
					downDistID=4;
				} else if (distToGo>shortSplit && distToGo<=longSplit) {
					downDistID=5;
				} else if (distToGo>longSplit) {
					downDistID=6;
				}
				checkRunPass(run, pass, pkgid, downDistID, yard, isSuccess);
			}
		} // if isAbbr(abbr) ...

		if (correctAbbr(offAbbr, defAbbr, showOffense) && (WRTargetSplits || WRProductionSplits) && (noPlay===0 || withPens) &&
			(downMin <= downInt) && (downMax >= downInt) && (distMin <= distToGo) && (distMax >= distToGo)) {
			if (att==1 && WRID!=-1) {
				if (WRID <= -1) {
					alert("Something broke. WRID = " + WRID + ", readcount = " + readcount + ", tmp = " + tmp);
				}
				WRSplitStats[pkgid][downDistID][WRID][5]++; // increment targets
				WRSplitStats[pkgid][downDistID][WRID][6] += yard; // add to yards
				if (dumpoff===0 && GCOV===0) {
					WRSplitStats[pkgid][downDistID][WRID][1]++; // increment first option passes
				}
				else if (dumpoff) {
					WRSplitStats[pkgid][downDistID][WRID][2]++; // increment dumpoff passes
				}
				if (dumpoff===0 && attYard!=="") {
					WRSplitStats[pkgid][downDistID][WRID][4]+=attYard; // add to attempted yards
				}
				if (dumpoff===0 && attYard==="") {
					WRSplitStats[pkgid][downDistID][WRID][3]++; // increment drops on downfield passes and passes batted at the line
				}
				if (isSuccess == 1) {
					WRSplitStats[pkgid][downDistID][WRID][7]++; // increment successes
				} // */
				if (INT == 1) {
					WRSplitStats[pkgid][downDistID][WRID][8]++; // increment interceptions
				}
			} // */

			if (WRID == GCOVdID && WRID!=-1) {
				alert("Something broke. WR = " + WR + " (" + WRID + "), GCOVd = " + GCOVd + " (" + GCOVdID + "), tmp = " + tmp + ", abbr = " + abbr + ", downDistID = " + downDistID + ", game time = " + gameTime);
			}

			if (GCOVdID!=-1) {
				WRSplitStats[pkgid][downDistID][GCOVdID][0]++; // increment GCOVs
			}
		}

		if (defPkgSplits && (showBothTeams || correctAbbr(offAbbr, defAbbr, !showOffense) || bothTeamsValid) && (noPlay === 0 || withPens) &&
			(downMin <= downInt) && (downMax >= downInt) && (distMin <= distToGo) && (distMax >= distToGo)) {
			defPkgSplitStats[defpkgid][0]++;
			if (run) {
				defPkgSplitStats[defpkgid][1]++;
			}
			else if (pass) {
				defPkgSplitStats[defpkgid][2]++;
			}
			/*else {
				alert("run = 0, pass = 0, tmp = " + tmp);
			} // */
		}

		if (conversions && (showBothTeams || correctAbbr(offAbbr, defAbbr, showOffense)) && (noPlay === 0 || withPens) && (down == "3rd" || down == "4th") && !(punt || fieldGoal)) {
			//alert(down + " and " + distToGo + " from the " + yardline + ". offAbbr = " + offAbbr + ", tmp = " + tmp);
			downDistID = get3rd4thDownDistID(distToGo);
			if (downDistID == -1) {
				alert("downDistID == -1");
			}
			else {
				conversionStats[downDistID][0]++;
				if (isSuccess) {
					conversionStats[downDistID][1]++;
					conversionStats[downDistID][2] += yard;
				}
				else {
					conversionStats[downDistID][3] += yard;
				}
			}
		}

		if (individualWRStats && (showBothTeams || correctAbbr(offAbbr, defAbbr, showOffense)) && (noPlay === 0 || withPens) &&
			(downMin <= downInt) && (downMax >= downInt) && (distMin <= distToGo) && (distMax >= distToGo)) {
			index = -1;

			//alert("offAbbr = " + offAbbr + ", tmp = " + tmp + ", GCOVdName = " + GCOVdName + ", WRName = " + WRName);

			// player ID, name, 1st opt passes, targets, yards, successes, GCOVs, INTs, Drops, dump passes, dist downfield, position, catches
			if (GCOVdpID != -1) {
				//alert("GCOV of reciever " + GCOVdName + ". tmp = " + tmp);
				index = checkWRList(GCOVdpID, GCOVdName, GCOVd);
				WRPlayerStats[index][6]++; // increment GCOVs
			}
			if (WRpID != -1) {
				//alert("pass targeted at reciever " + WRName + ". tmp = " + tmp);
				index = checkWRList(WRpID, WRName, WR);
				WRPlayerStats[index][3]++; // increment targets
				WRPlayerStats[index][4] += yard;
				if (GCOV === 0 && dumpoff === 0) {
					WRPlayerStats[index][2]++; // increment 1st option passes
				}
				if (dumpoff === 0 && attYard !== "" && !isNaN(attYard)) {
					WRPlayerStats[index][10] += attYard;
				}
				else if (dumpoff === 0 && (attYard === "" || isNaN(attYard))) {
					WRPlayerStats[index][8]++; // increment drops (and passes batted down at the line)
				}
				else {
					WRPlayerStats[index][9]++; // increment dumpoffs
				}
				if (isSuccess) {
					WRPlayerStats[index][5]++;
				}
				if (comp) {
					WRPlayerStats[index][12]++; // increment completions
				}
				if (INT) {
					WRPlayerStats[index][7]++; // increment interceptions
				}
				if (pdef) {
					WRPlayerStats[index][13]++; // increment pass deflections
				}
			}
		}

		if (individualRunnerStats && (showBothTeams || correctAbbr(offAbbr, defAbbr, showOffense)) && (noPlay === 0 || withPens) &&
			(downMin <= downInt) && (downMax >= downInt) && (distMin <= distToGo) && (distMax >= distToGo) && distToSuccess != -1) {
			index = -1;

			// player ID, name, position, Attempts, Yards, successes, yards to 1st down, yards to success
			if (RBpID != -1) {
				//alert("handoff to " + RB + " " + RBName + ", offAbbr = " + offAbbr + ", gameTime = " + gameTime);
				index = checkRBList(RBpID, RBName, RB);

				RBPlayerStats[index][3]++; // increment attempts
				RBPlayerStats[index][4] += yard;
				if (isSuccess) {
					RBPlayerStats[index][5]++;
				}
				RBPlayerStats[index][6] += distToGo;
				RBPlayerStats[index][7] += distToSuccess; // */
			}
		}

		if (individualDefenderStats && (showBothTeams || correctAbbr(offAbbr, defAbbr, !showOffense) || bothTeamsValid) && (noPlay === 0 || withPens) &&
			(downMin <= downInt) && (downMax >= downInt) && (distMin <= distToGo) && (distMax >= distToGo) && coverageMatchesExpected(coverageCall1, coverageCall2)) {
			index = -1;

			// player ID, name, 1st opt passes, targets, yards, successes, GCOVs, INTs, Drops, dump passes, dist downfield, catches
			if (GCOVerID != -1) {
				//alert("GCOV of reciever " + GCOVdName + ". tmp = " + tmp);
				index = checkIDPList(GCOVerID, GCOVerName);
				IDPStats[index][6]++; // increment GCOVs
			}
			if (passDefenderpID != -1) {
				/*if (passDefenderName == "Some Cornerback") {
					alert("found " + passDefenderName + " at " + gameTime + ". offAbbr = " + offAbbr + ", defAbbr = " + defAbbr + ", touchdown = " + isTouchdown + ", kickoff = " + kickoff);
				} // */
				//alert("pass targeted at reciever " + WRName + ". tmp = " + tmp);
				index = checkIDPList(passDefenderpID, passDefenderName);
				IDPStats[index][3]++; // increment targets
				IDPStats[index][4] += yard;
				if (GCOV === 0 && dumpoff === 0) {
					IDPStats[index][2]++; // increment 1st option passes
				}
				if (dumpoff === 0 && attYard !== "") {
					IDPStats[index][10] += attYard;
				}
				else if (dumpoff === 0 && attYard === "") {
					IDPStats[index][8]++; // increment drops (and passes batted down at the line)
				}
				else {
					IDPStats[index][9]++; // increment dumpoffs
				}
				if (isSuccess) {
					IDPStats[index][5]++;
				}
				if (comp) {
					IDPStats[index][12]++; // increment completions
				}
			}
			if (defPlaymakerpID != -1) {
				index = checkIDPList(defPlaymakerpID, defPlaymakerName);

				// if playmaker was in coverage
				if (defPlaymakerpID == passDefenderpID) {
					if (INT) {
						IDPStats[index][7]++; // increment cv interceptions
					}
					if (pdef) {
						IDPStats[index][13]++; // increment cv pass deflections.
					}
					if (tkl) {
						IDPStats[index][14]++; // increment cvTKL
					}
				}
				else if (run == 1) {
					if (tkl) {
						IDPStats[index][18]++; // increment run TKL
						if (!isSuccess) {
							IDPStats[index][19]++; // increment run Stops
						}
					}
				}
				else {
					if (INT) {
						IDPStats[index][15]++; // increment rm interceptions
					}
					if (pdef) {
						IDPStats[index][16]++; // increment rm pass deflections.
					}
					if (tkl) {
						IDPStats[index][17]++; // increment rmTKL
					}
				}
			}
		}

		if (passDistSplits && (showBothTeams || correctAbbr(offAbbr, defAbbr, showOffense)) && (noPlay === 0 || withPens) && (attYard !== "" || dumpoff) &&
			(downMin <= downInt) && (downMax >= downInt) && (distMin <= distToGo) && (distMax >= distToGo)) {
			var distID = -1;
			if (dumpoff) {
				distID = 0;
			}
			else {
				distID = getPassDistID(attYard);
			}

			if (attYard === "") {
				attYard = yard;
			}

			// att, comp, success, yards, attYards, YAC, YTG
			passDistSplitStats[distID][0]++; // increment attempts
			passDistSplitStats[distID][4]+=attYard;
			passDistSplitStats[distID][6]+=distToGo;
			if (comp) {
				passDistSplitStats[distID][1]++; // increment completions
				passDistSplitStats[distID][3]+=yard;
				passDistSplitStats[distID][5]+= (yard - attYard);
			}
			if (isSuccess) {
				passDistSplitStats[distID][2]++; // increment successes
			}
			if (INT) {
				passDistSplitStats[distID][7]++; // increment interceptions
			}
			if (isTouchdown) {
				passDistSplitStats[distID][8]++; // increment touchdowns
			}
		}

		if (showSacks && (showBothTeams || correctAbbr(offAbbr, defAbbr, showOffense)) && (noPlay === 0 || withPens || throwAway)) {
			var sacksTeamIndex;
			if (showOffense) {
				sacksTeamIndex = getTeamIndexFromAbbr(offAbbr);
			}
			else {
				sacksTeamIndex = getTeamIndexFromAbbr(defAbbr);
			}

			// pass plays, passes, immediate sacks, cover sacks, pressure scrambles, cover scrambles, scramble sacks, dumpoffs, throw aways
			if (pass) {
				sackStats[sacksTeamIndex][0]++; // increment pass plays
			}
			if (att) {
				sackStats[sacksTeamIndex][1]++; // increment pass attempts
			}
			if (sack) {
				if (scramble) {
					sackStats[sacksTeamIndex][6]++; // increment scramble sacks
					//alert("found scrample sack at play " + tmp + "! Total: " + sackStats[sacksTeamIndex][6]);
				}
				else if (GCOV) {
					sackStats[sacksTeamIndex][2]++; // increment cover sacks
				}
				else {
					sackStats[sacksTeamIndex][3]++; // increment immediate sacks
				}
			}
			// no pressure scrambles
			if (coverScram) {
				sackStats[sacksTeamIndex][5]++; // increment cover scrambles
			}
			if (dumpoff) {
				sackStats[sacksTeamIndex][7]++; // increment dumpoffs
			}
			if (throwAway) {
				sackStats[sacksTeamIndex][8]++; // increment throw aways
			}
		}

		// Only works with individual teams
		if (kickoffStats_bol && correctAbbr(offAbbr, defAbbr, showOffense) && (noPlay === 0 || withPens) && kickoff) {
			// kickoffs, touchbacks, returned kicks, net landing spot of returned kicks, net returned spot of returned kicks, kicks returned short of the 25, KRTDs

			// set the correct abbreviation
			// TODO: find a more efficient way to do this across all tables
			var kickoffsTeamIndex = getTeamIndex(kickerTeamName);
			if (showOffense) {
				kickoffsTeamIndex = getTeamIndex(returnTeamName);
			}
			//alert("kicking team is '" + kickerTeamName + "', return team is '" + returnTeamName + "', team index is " + kickoffsTeamIndex);

			kickoffStats_array[kickoffsTeamIndex][0]++; // increment kickoffs
			if (touchback) {
				kickoffStats_array[kickoffsTeamIndex][1]++; // increment touchbacks
			}
			else {
				kickoffStats_array[kickoffsTeamIndex][2]++; // increment kick returns
				kickoffStats_array[kickoffsTeamIndex][3]+=kickoffLandingSpot;
				kickoffStats_array[kickoffsTeamIndex][4]+=kickoffReturnSpot;
				if (kickReturnInside25) {
					kickoffStats_array[kickoffsTeamIndex][5]++; // increment kicks returned short of the 25
				}
				if (kickReturnTouchdown) {
					kickoffStats_array[kickoffsTeamIndex][6]++; // increment kick return touchdowns
				}
			}
		}

		// TODO: this needs to be adjusted to account for extra points on kick return (and punt return?) touchdowns
		// the following commented line is an initial attempt towards that end
		// if (fieldGoalStats_bol && (showBothTeams || ((kickoff && correctAbbr(offAbbr, defAbbr, showOffense)) || (!kickoff && correctAbbr(abbr, otherAbbr, showOffense)))) && (noPlay === 0 || withPens) && (fieldGoal || extraPoint)) {
		if (fieldGoalStats_bol && (noPlay === 0 || withPens) && ((showBothTeams || correctAbbr(offAbbr, defAbbr, showOffense)) && fieldGoal) ||
			((showBothTeams || correctAbbr(offAbbr, defAbbr, showOffense)) && extraPoint)) {
			// PAT, 0-20, 20-30, 30-40, 40-50, 50+
			// attempted, made, blocked
			var fieldGoalsTeamIndex;
			if (showOffense) {
				fieldGoalsTeamIndex = getTeamIndexFromAbbr(offAbbr);
			}
			else {
				fieldGoalsTeamIndex = getTeamIndexFromAbbr(defAbbr);
			}

			var fieldGoalDistId;
			if (extraPoint) {
				fieldGoalDistId = 0;
			}
			else {
				fieldGoalDistId = getFieldGoalDistId(fieldGoalDist);
				//alert("recording field goal attempt! distance = " + fieldGoalDist + ", distId = " + fieldGoalDistId + ", gameTime = " + gameTime + ", tmp = " + tmp + ", made = " + fieldGoalMade);
			}

			fieldGoalStats_array[fieldGoalsTeamIndex][fieldGoalDistId][0]++; // increment field goal attempts
			if (fieldGoalMade) {
				fieldGoalStats_array[fieldGoalsTeamIndex][fieldGoalDistId][1]++; // increment made field goals
			}
			if (fieldGoalBlocked) {
				fieldGoalStats_array[fieldGoalsTeamIndex][fieldGoalDistId][2]++; // increment blocked field goals
			}
		}

		if (puntStats_bol && (noPlay === 0 || withPens) && (showBothTeams || correctAbbr(offAbbr, defAbbr, showOffense)) && punt) {
			// own goal to own 40, own 40 to opp 40, opp 40 to opp goal
			// punts, gross yards, punt landing spot, touchbacks, returns, return yards, blocks, block yards
			var puntTeamIndex;
			if (showOffense) {
				puntTeamIndex = getTeamIndexFromAbbr(offAbbr);
			}
			else {
				puntTeamIndex = getTeamIndexFromAbbr(defAbbr);
			}

			var puntFieldPosId = getPuntFieldPositionId(yardline);

			if (puntFieldPosId === -1) {
				alert("Recording a punt! gameTime = " + gameTime + ", yardline = " + yardline + ", puntFieldPosId = " + puntFieldPosId + ", offAbbr = " + offAbbr + ", defAbbr = " + defAbbr);
			} // */

			// The field position of the return team following the punt
			// this value starts as the field position prior to the punt, and is adjusted as other stats are recorded
			var netFieldPosition = getDistToGoal(yardline, 1);

			if (puntBlock) {
				puntStats_array[puntTeamIndex][puntFieldPosId][6]++; // increment blocked punts
				puntStats_array[puntTeamIndex][puntFieldPosId][7] += puntBlockYards;
				netFieldPosition += puntBlockYards;
			}
			else {
				puntStats_array[puntTeamIndex][puntFieldPosId][0]++; // increment punts
				puntStats_array[puntTeamIndex][puntFieldPosId][1] += puntDist; // add gross punt yardage
				netFieldPosition -= puntDist;

				if (touchback) {
					puntStats_array[puntTeamIndex][puntFieldPosId][3]++; // increment touchbacks
					netFieldPosition = 20;
				}
				else if (puntReturn) {
					puntStats_array[puntTeamIndex][puntFieldPosId][4]++; // increment punt returns
					puntStats_array[puntTeamIndex][puntFieldPosId][5] += (puntReturnSpot - netFieldPosition); // calculate and add punt return yards
					netFieldPosition = puntReturnSpot;
				}
			}
			puntStats_array[puntTeamIndex][puntFieldPosId][2] += netFieldPosition; // add net post-punt field position
		}

		// reset all variables for the next play

		isTouchdown = 0;
		isSuccess = 0;
		kickoff = 0;
		onsides = 0;
		fieldGoal = 0;
		punt = 0;
		extraPoint = 0;
		fieldGoalMade = 0;
		fieldGoalBlocked = 0;
		fieldGoalDist = -1;
		kickReturnTouchdown = 0;
		puntDist = 0;
		puntBlock = 0;
		puntBlockYards = 0;
		touchback = 0;
		pass = 0;
		att = 0;
		comp = 0;
		sack = 0;
		run = 0;
		handoff = 0;
		INT = 0;
		penalty = 0;
		noPlay = 0;
		WRID = -1;
		WRpID = -1;
		RBpID = -1;
		attYard = "";
		GCOV=0;
		GCOVd=-1;
		GCOVdID=-1;
		GCOVdpID=-1;
		GCOVerID=-1;
		defPlaymakerpID = -1;
		passDefenderpID = -1;
		coverageCall1 = "";
		coverageCall2 = "";
		coverageCall3 = "";

		startThis=startNext;
		preptr=endptr+21;

	} // while(1)

	if (readcount<readtarget) {
		//alert("readcount = " + readcount + ", readtarget = " + readtarget + ", continuing!");
		readLog();
	}
	else {
		//alert("finished with games!");
		var SR_def="<span title='Success Rate: Percentage of plays which are considered successful (meaning the offense is better off after them than they were before). A successful play is defined here as one which gains 45% of the required yardage on 1st down, 60% on 2nd down, and 100% on 3rd or 4th down. Definition paraphrased from footballoutsiders.com'>SR</span>";
		var YPP_def="<span title='Net yards per play'>Y/P</span>";
		var OPP_def="<span title='Offensive Pass Plays: All plays in which the offense originally intended to throw the ball. Includes passes, scrambles, and sacks.'>OPP</span>";
		var ORP_def="<span title='Offensive Run Plays: All plays in which the offense originally intended to run the ball. Includes handoffs and QB sneaks.'>ORP</span>";
		var FIRST_def="<span title='First Option Looks: The number of plays in which this reciever was the QBs first read. This inclues both GCOVs and passing targets (no dumpoffs)'>1st Opt</span>";
		var TGT_def="<span title='Downfield Passing Targets: The number of passes thrown to this reciever, excluding dumpoffs.'>TGT</span>";
		var DMP_def="<span title='Dumpoff Targets: The number of dumpoff passes thrown to this reciever.'>Dump</span>";
		var DIST_def="<span title='Average Distance Downfield: the average distance downfield of all passes thrown to this reciever, exluding dumpoffs and drops.'>Dist</span>";
		var YPT_def="<span title='Yards per Target: The average number of yards gained on a pass to this reciever'>Y/T</span>";
		var GCOVpct_def="<span title='Good Coverage Percentage: the percentage of first option looks to this reciever which result in a GCOV instead of a pass attempt'>GCOV%</span>";
		var INTpct_def="<span title='Interception Rate: the percentage of passes to this reciever which result in an interception by the defense'>INT%</span>";
		var SC_def="<span title='Success Count: the number of plays in which this player was targeted which were a net positive for the offense'>SR</span>";

		var tables = "";

		newDiv = document.getElementById('scout_count');

		if (runPassSplits) {
			var a, b, c, d;
			for (a=0; a<7; a++) {
				for (c=0; c<2; c++) {
					for (d=0; d<3; d++) {
						for (b=0; b<8; b++) {
							sumDownStats[a][c][d]+=detailedPackageStats[a][b][c][d];
						}
					}
				}
			}

			for (b=0; b<8; b++) {
				for (c=0; c<2; c++) {
					for (d=0; d<3; d++) {
						for (a=0; a<7; a++) {
							sumPackageStats[b][c][d]+=detailedPackageStats[a][b][c][d];
						}
					}
				}
			}

			/*for (var a=0; a<7; a++) {
				for (var b=0; b<2; b++) {
					for (var c=0; c<3; c++) {
						sumAllPackages[a][b] += sumPackageStats
					}
				}
			} // */

			tables = tables.concat(makeTableLable("Rushing and Passing Splits") + make_old_r_p_table(SR_def, YPP_def, OPP_def, ORP_def));
		}
		if (WRTargetSplits) {
			tables = tables.concat(makeTableLable("Reciever Target Splits") + make_WR_target_table(FIRST_def, TGT_def, DMP_def, DIST_def));
		}
		if (WRProductionSplits) {
			tables = tables.concat(makeTableLable("Reciever Production Splits") + make_WR_production_table(GCOVpct_def, SR_def, YPT_def, INTpct_def));
		}
		if (defPkgSplits) {
			tables = tables.concat(makeTableLable("Defensive Package Splits") + makeDefPkgSplitsTable());
		}
		if (conversions) {
			tables = tables.concat(makeTableLable("3rd/4th Downs") + makeConversionTable());
		}
		if (individualWRStats) {
			tables = tables.concat(makeTableLable("Individual Reciever Stats") + makeIndividualWRStatTable());
		}
		if (individualDefenderStats) {
			tables = tables.concat(makeTableLable("Individual Defensive Player Stats") + makeIDPStatTable());
		}
		if (individualRunnerStats) {
			tables = tables.concat(makeTableLable("Individual Runner Stats") + makeIndividualRBStatTable());
		}
		if (passDistSplits) {
			tables = tables.concat(makeTableLable("Pass Results By Distance") + makePassDistSplitTable());
		}
		if (showSacks) {
			tables = tables.concat(makeTableLable("Sack Stats") + makeSacksTable());
		}
		if (kickoffStats_bol) {
			tables = tables.concat(makeTableLable("Kickoff Stats") + makeKickoffsTable());
		}
		if (fieldGoalStats_bol) {
			tables = tables.concat(makeTableLable("Field Goal Stats") + makeFieldGoalsTable());
		}
		if (puntStats_bol) {
			tables = tables.concat(makeTableLable("Punt Stats") + makePuntStatsTable());
		}

		newDiv.innerHTML = tables;
	}
}

function initializeArrays() {
	var a, b, c, d, pkgs, plays, stats, tmp;
	detailedPackageStats=new Array(7); // initialize stat array (1st down, 2nd & short, 2nd & medium, 2nd & long, 3rd/4th & short, 3rd/4th & medium, 3rd/4th & long)
	for (a=0; a<7; a++) {
		pkgs=new Array(8); // initialize row of packages (HFT12, HFTt1, HTt12, HF123, HT123, H1234, T1234, 12345)
		for (b=0; b<8; b++) {
			plays=new Array(2); // initialize row of play types (run/pass/unknown)
			for (c=0; c<2; c++) {
				stats=new Array(3); // initialize row of stats (plays, yards, successes)
				for (d=0; d<3; d++) {
					stats[d]=0; // initialize each slot in the array (filled in the ParsePBP function)

				}
				plays[c]=stats;
			}
			pkgs[b]=plays;
		}
		detailedPackageStats[a]=pkgs;
	}

	/*packageStats=new Array(7); // initialize stat array (1st down, 2nd & short, 2nd & medium, 2nd & long, 3rd/4th & short, 3rd/4th & medium, 3rd/4th & long)
	for (a=0; a<7; a++) {
		pkgs=new Array(8);  // initialize row of packages (HFT12, HFTt1, HTt12, HF123, HT123, H1234, T1234, 12345)
		for (b=0; b<8; b++) {
			tmp=new Array(2); // initialize row of play types (run/pass/unknown)
			for (c=0; c<2; c++) {
				tmp[c]=0;  // initialize each slot in the array (filled in the ParsePBP function)
			}
			pkgs[b]=tmp;
		}
		packageStats[a]=pkgs;
	}*/

	packageYards=new Array(7);
	for (a=0; a<7; a++) {
		pkgs=new Array(8);
		for (b=0; b<8; b++) {
			tmp=new Array(2);
			for (c=0; c<2; c++) {
				tmp[c]=0;
			}
			pkgs[b]=tmp;
		}
		packageYards[a]=pkgs;
	}

	sumPackageStats=new Array(8);
	for (b=0; b<8; b++) {
		plays=new Array(2);
		for (c=0; c<2; c++) {
			stats=new Array(3);
			for (d=0; d<3; d++) {
				stats[d]=0;
			}
			plays[c]=stats;
		}
		sumPackageStats[b]=plays;
	}

	sumDownStats=new Array(7);
	for (a=0; a<7; a++) {
		plays=new Array(2);
		for (c=0; c<2; c++) {
			stats=new Array(3);
			for (d=0; d<3; d++) {
				stats[d]=0;
			}
			plays[c]=stats;
		}
		sumDownStats[a]=plays;
	}

	sumAllPackages = new Array(2);
	for (a=0; a<2; a++) {
		stats = new Array(3);
		for (b=0; b<3; b++) {
			stats[b] = 0;
		}
		sumAllPackages[a] = stats;
	} // */

	WRSplitStats= new Array(8);
	for (a=0; a<8; a++) { // 8 packages
		var DDs=new Array(7);
		for (b=0; b<7; b++) { // 7 down and distance combos
			var WRs=new Array(9);
			for (c=0; c<9; c++) { // 9 recievers
				stats=new Array(9);
				for (d=0; d<9; d++) { // 9 stats (to date) - GCOVs, 1st opt passes, dump passes, drops, dist downfield, targets, yards, successes, INTs.
					stats[d] = 0;
				}
				WRs[c]=stats;
			}
			DDs[b]=WRs;
		}
		WRSplitStats[a]=DDs;
	}

	defPkgSplitStats= new Array(19);
	for (a=0; a<19; a++) {
		stats = new Array(3); // 3 stats: total snaps, run plays, pass plays.
		for (b=0; b<3; b++) {
			stats[b] = 0;
		}
		defPkgSplitStats[a] = stats;
	}

	conversionStats = new Array(16);
	for (a=0; a<16; a++) {
		stats = new Array(4); // 4 stats: attempts, conversions, yards on conversions, yards on stops.
		for (b=0; b<4; b++) {
			stats[b] = 0;
		}
		conversionStats[a] = stats;
	}

	passDistSplitStats = new Array(18);
	for (a=0; a<18; a++) {
		stats = []; // att, comp, success, yards, attYards, YAC, YTG, INT, TD
		for (b=0; b<9; b++) {
			stats[b] = 0;
		}
		passDistSplitStats[a] = stats;
	} // */
}

// initialize arrays for tables with a separate row for each team
function initializeMultiTeamArrays() {
	var a, b, c;

	sackStats = new Array(abbrs.length);
	for (a=0; a<abbrs.length; a++) {
		sackStats[a] = new Array(9); // pass plays, passes, immediate sacks, cover sacks, pressure scrambles, cover scrambles, scramble sacks, dumpoffs, throw aways
		for (b=0; b<9; b++) {
			sackStats[a][b] = 0;
		}
	}

	kickoffStats_array = new Array(abbrs.length);
	for (a=0; a<abbrs.length; a++) {
		kickoffStats_array[a] = new Array(7); // kickoffs, touchbacks, returned kicks, net landing spot of returned kicks, net returned spot of returned kicks, kicks returned short of the 25, KRTDs
		for (b=0; b<7; b++) {
			kickoffStats_array[a][b] = 0;
		}
	}

	fieldGoalStats_array = new Array(abbrs.length);
	for (a=0; a<abbrs.length; a++) {
		fieldGoalStats_array[a] = new Array(6); // PAT, 0-20, 20-30, 30-40, 40-50, 50+
		for (b=0; b<6; b++) {
			fieldGoalStats_array[a][b] = new Array(3); // attempted, made, blocked
			for (c=0; c<3; c++) {
				fieldGoalStats_array[a][b][c] = 0;
			}
		}
	}

	puntStats_array = new Array(abbrs.length);
	for (a=0; a<abbrs.length; a++) {
		puntStats_array[a] = new Array(3); // own goal to own 40, own 40 to opp 40, opp 40 to opp goal
		for (b=0; b<3; b++) {
			puntStats_array[a][b] = new Array(8); // punts, gross yards, punt landing spot, touchbacks, returns, return yards, blocks, block yards
			for (c=0; c<8; c++) {
				puntStats_array[a][b][c] = 0;
			}
		}
	}
}


function readLog() {

	GM_xmlhttpRequest({
			method: 'GET',
			url: 'http://deeproute.com/default.asp?js=loggerinc&viewpbp=' + links[readcount],
			headers: {
				 'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
				 'Accept': 'application/atom+xml,application/xml,text/xml',
			},
			onload: function(detail) {
					parsePBP(detail.responseText);
			},
		});
}


function startReadLog() {

	if (readcount>=readtarget) return;

	readtarget=links.length;

	var target = document.getElementById('scout_button_table');
	var newDiv;
	if (isFirstRun) {
		newDiv = document.createElement('div');
		newDiv.setAttribute("id", "scout_count");
		isFirstRun = 0;
	}
	else {
		newDiv = document.getElementById('scout_count');
	}
	newDiv.innerHTML='<span style="background-color:white">0 of ' + readtarget + ' games</span>';
	if (target) {
		target.parentNode.insertBefore(newDiv, target.nextSibling);
	}
	//alert("through startReadLog");

	readLog();
}


function parseStanding(intext)
{
	var ptr1=0, ptr2, ptr3, ptr4, name, abbr;
		while (ptr1>=0) {
				ptr2=intext.indexOf("class=sbu", ptr1);
				if (ptr2<0) {
					break;
				}
				ptr3=intext.indexOf("<b>", ptr2);
				ptr4=intext.indexOf("<br>", ptr3);
				name=intext.substring(ptr3+3, ptr4) + ' ';
				ptr3=intext.indexOf("</b>", ptr4+4);
				name+=intext.substring(ptr4+4, ptr3);

				ptr2=intext.indexOf("class=norm>", ptr3);
				ptr3=intext.indexOf("</a>", ptr2+11);
				abbr=intext.substring(ptr2+11, ptr3);

				teamlist[teamlist.length]=name;
				abbrlist[abbrlist.length]=abbr;

			ptr1=ptr3+4;
		}

		startFunc();
}

// pull the team names and abbrs from the team preseason stats page
function parseTeamStatsForAbbrs(intext) {
	var ptr1, ptr2, ptr3, ptr4, name, abbr, idnum;

	ptr1 = intext.indexOf("<th>ANYA</th>", 0);
	while (ptr1 >= 0) {
		ptr2 = intext.indexOf("myteamno=", ptr1);
		if (ptr2 < 0) {
			break;
		}

		ptr3 = intext.indexOf("\">", ptr2);
		idnum = intext.substring(ptr2+9, ptr3);
		ptr4 = intext.indexOf("</a>", ptr3);
		name = intext.substring(ptr3+2, ptr4);

		ptr2 = intext.indexOf("<b>", ptr4);
		ptr3 = intext.indexOf("</b>", ptr2+3);
		abbr = intext.substring(ptr2+3, ptr3);

		teamlist[idnum-1]=name;
		abbrlist[idnum-1]=abbr;

		ptr1=ptr3+4;
	}

	startFunc();
}


function getElementsByClassName(classname, par){
	 var a=[];
	 var re = new RegExp('\\b' + classname + '\\b');
	 var els = par.getElementsByTagName("*"); // node list of every element under par (document, presumably the scedule page?)
	 for(var i=0,j=els.length; i<j; i++){ // while i is less than the number of elements under par
			if(re.test(els[i].className)){ // if an element includes "team_checkbox", push the element into a
				 a.push(els[i]);
			}
	 }
	 return a;
}

function buildGameList(input)
{
	var ptr1, ptr2, ptr3, ptr4, id, id2, name, endptr;

	teams=[];
	abbrs=[];
	weeks=[];

	var checkbox = getElementsByClassName('team_checkbox', document); // array of elements including the term "team_checkbox" in the (scedule?) page.

	for (var i=0; i < checkbox.length; i++) {		// for each element in checkbox
		 if (checkbox[i].checked) {					// if the checkbox for this team is checked
				teams[teams.length]=teamlist[i];	// add team and team abbreviation to appropriate array
				abbrs[abbrs.length]=abbrlist[i];
		 }
	}

	if (teams.length === 0) {
		alert("Please select a valid team");
	}


	ptr1=input.indexOf("\"teaminfo\"", 0);			// location of the first occurence of "teaminfo\" in input (the scedule page?)
	if (ptr1<0) ptr1=input.indexOf("teaminfo ", 0);	// if "teaminfo\" is not there, find first occurence of "teaminfo " in input
	endptr=input.indexOf("hidden", ptr1+8);			// location of "hidden" in input, starting 8 chars after "teaminfo"

	while (1) {
		ptr2=input.indexOf("!", ptr1); 				// ptr2 = location of "!" after 'teaminfo' (old ptr2 for later loops)
		if (ptr2 > endptr) break;					// if "!" is after "hidden", break
		ptr3=input.indexOf("^", ptr2+1);			// ptr3 = location of "^" starting 1 char after "!"
		id=input.substring(ptr2+1, ptr3);			// id = all chars between the "!" and "^"
		ptr2=input.indexOf("^", ptr3+1);			// ptr2 = location of "^" starting one char after "^"
		name=input.substring(ptr3+1, ptr2);			// name = all chars between "^" and "^"
		if (isTeam(name)) teamID[teamID.length]=id;	// if id is a valid team name, adds id to teamID array
		ptr1=ptr2;
	}

	if (Preseason) {
		for (i=0; i<4; i++) {
			if (document.getElementById("X-" + (i+1)).checked) {
				weeks[weeks.length]="X-" + (i+1) + "-".toString();
			}
		}
	}
	if (RegularSeason) {
		for (i=0; i<16; i++) {
			if (document.getElementById("R-" + (i+1)).checked) {
				weeks[weeks.length]="R-" + (i+1) + "-".toString();
			}
		}
	}
	if (Postseason) {
		for (i=0; i<4; i++) {
			if (document.getElementById("P-" + (i+1)).checked) {
				weeks[weeks.length]="P-" + (i+1) + "-".toString();
			}
		}
	}

	endptr=input.indexOf("\"topper\"", ptr1+7);

	var weekcount = 0;
	while (weekcount < weeks.length) {
		ptr1=input.indexOf(weeks[weekcount], 0);
		while (ptr1 != -1 && ptr1 < endptr) {
			ptr2=input.indexOf("Y!", ptr1);
			if (ptr2 > endptr || ptr2<0) break;
			ptr3=input.indexOf("^", ptr2+2);
			id=input.substring(ptr2+2, ptr3);
			ptr2=input.indexOf("^", ptr3+1);
			id2=input.substring(ptr3+1, ptr2);

			if (isID(id) || isID(id2)) {
				ptr3=input.indexOf("^", ptr2+1);
				ptr2=input.indexOf("^", ptr3+1);
				ptr3=input.indexOf("^", ptr2+1);
				links[links.length]=input.substring(ptr2+1, ptr3);
			}
			ptr1=input.indexOf(weeks[weekcount], ptr1+3);
		}
		weekcount++;
	}
}


function fillGames(season) {
	var i;
	var string = "<br><table border=\"0\" cellpadding=\"1\" style=\"margin-left:20px;\" id=\"" + season + "_spoiler_table\"><col width=\"40\"><col width=\"40\">";
	if (season == "pre") {
		for (i=0; i<4; i++) {
			string = string.concat("<tr><td colspan=\"2\"><input type=\"checkbox\" name=\"week\" class=\"pre_checkbox\" id=\"X-" + (i+1) + "\" checked=\"checked\"><span onclick=\"selectThisWeekOnly(\'pre\', " + i+1 + ")\">Week " + (i+1) + "</span></input></td>");
		}
	}
	else if (season == "reg") {
		for (i=0; i<16; i++) {
			string = string.concat("<tr><td colspan=\"2\"><input type=\"checkbox\" name=\"week\" class=\"reg_checkbox\" id=\"R-" + (i+1) + "\" checked=\"checked\"><span onclick=\"selectThisWeekOnly(\'reg\', " + i+1 + ")\">Week " + (i+1) + "</span></input></td>");
		}
	}
	else if (season == "post") {
		for (i=0; i<4; i++) {
			string = string.concat("<tr><td colspan=\"2\"><input type=\"checkbox\" name=\"week\" class=\"post_checkbox\" id=\"P-" + (i+1) + "\" checked=\"checked\"><span onclick=\"selectThisWeekOnly(\'post\', " + i+1 + ")\">Week " + (i+1) + "</span></input></td>");
		}
	}
	string = string.concat("</table>");
	return string;
}

function selectThisWeekOnly(seasonAbr, week) {
	var els = document.getElementsByClassName(seasonAbr + "_checkbox");

	Array.from(els).forEach((el) => {
		var parsedWeek = parseInt(el.id.substring(2, el.id.length));
		if (parsedWeek == week) {
			el.checked = true;
		}
		else {
			el.checked = false;
		}
	});
}

function addButtons(season) {
	var className = season + "_checkbox";
	var buttonDiv1 = document.createElement('div');
	buttonDiv1.innerHTML = '<input type="button" style="font-size: 6pt; font-weight: bold; width: 100%; height: 15px" value="Clear All">';
	buttonDiv1.addEventListener('click', function() {
		var checkbox = getElementsByClassName(className, document);
		for (var i=0; i < checkbox.length; i++) {
			checkbox[i].checked=false;
		}
	}, true); // */

	var buttonDiv2 = document.createElement('div');
	buttonDiv2.innerHTML = '<input type="button" style="font-size: 6pt; font-weight: bold; width: 100%; height: 15px" value="Select All">';
	buttonDiv2.addEventListener('click', function() {
		var checkbox = getElementsByClassName(className, document);
		for (var i=0; i < checkbox.length; i++) {
			checkbox[i].checked=true;
		}
	}, true); // */

	var spoilerTable = document.getElementById(season + "_spoiler_table");
	var newTR = document.createElement('tr');
	var newTD1 = document.createElement('td');
	var newTD2 = document.createElement('td');
	newTD1.appendChild(buttonDiv1);
	newTD2.appendChild(buttonDiv2);
	newTR.appendChild(newTD1);
	newTR.appendChild(newTD2);
	spoilerTable.appendChild(newTR);
} // */

function getGameDropdown(season) {
	var gameDropdown =
		"<a id=\"" + season + "_show_id\" onclick=\"document.getElementById('" + season + "_spoiler_id').style.display=''; document.getElementById('" + season + "_spoiler_span').style.display=''; document.getElementById('" + season + "_show_id').style.display='none';\" class=\"link\">" +
		" vv</a> <a id=\"" + season + "_spoiler_id\" style=\"display: none\" onclick=\"document.getElementById('" + season + "_spoiler_id').style.display='none'; document.getElementById('" + season + "_spoiler_span').style.display='none'; document.getElementById('" + season + "_show_id').style.display='';\" class=\"link\">" +
		" ^^ </a> <span id=\"" + season + "_spoiler_span\" style=\"display: none\">" + fillGames(season) + " </span>"; // */
	return gameDropdown;
}

function makeButtontableTeamRows() {
	var buttontable = document.createElement('table');
	buttontable.setAttribute('cellspacing', '0');
	buttontable.setAttribute('cellpadding', '0');
	buttontable.setAttribute('border', '1');
	buttontable.setAttribute('id', 'scout_button_table');

	for (var z=0; z<teamlist.length; z++) {
		var newtr2;

		if (z % 8 === 0) {
			 newtr2=document.createElement('tr');
			 buttontable.appendChild(newtr2);
		}

		var newtd2 = document.createElement('td');
		newtd2.setAttribute('align', 'center');
		var newtd3 = document.createElement('td');
		newtd3.setAttribute('align', 'center');

		var checkbox = document.createElement('input');
		checkbox.setAttribute('class', 'team_checkbox');
		checkbox.setAttribute("type", "checkbox");
		checkbox.setAttribute("name", "teamlistid");
		checkbox.setAttribute('align', 'center');
		checkbox.setAttribute("teamlistid", z);
		var tmpdiv=document.createElement('div');
		tmpdiv.align='center';
		tmpdiv.innerHTML = '<b>'+teamlist[z]+'</b>';
		newtd2.appendChild(checkbox);
		newtd3.appendChild(tmpdiv);
		newtr2.appendChild(newtd2);
		newtr2.appendChild(newtd3);
	}

	return buttontable;
}

function makeButtontableOptionRows(buttontable) {
	// create new row and append to table
	var newtr3=document.createElement('tr');
	buttontable.appendChild(newtr3);

	// create new division and append to row
	var newtd4 = selectOffDefBoth();
	newtr3.appendChild(newtd4);

	// create new division and append to row
	var newtd5 = selectStatTables();
	newtr3.appendChild(newtd5);

	// create new division and append to row
	var newtd6 = selectPreRegPost();
	newtr3.appendChild(newtd6);

	// create new division and append to row
	var newtd7 = selectWithPens();
	newtr3.appendChild(newtd7);

	return buttontable;
}

function selectOffDefBoth() {
	var newtd4 = document.createElement('td');
	newtd4.setAttribute('colspan', '4');
	var newDiv4 = document.createElement('div');
	newDiv4.innerHTML = '<input type="radio" name="unit" id="offense" checked="checked">  For this team (team offense/team players) <br>' +
		'<input type="radio" name="unit" id="defense">  Against this team (team defense/opposing players) <br>' +
		'<input type="radio" name="unit" id="both"> Both teams';
	newtd4.appendChild(newDiv4);

	return newtd4;
}

function selectStatTables() {
	var runPassDef = "<span title='displays total plays, yards per play, and success rate for both runs and passes'>Rushing and passing splits</span>";
	var targetsDef = "<span title='displays 1st option looks, targets, average distance downfield, and dumpoffs to each possible reciever'>Reciever target splits</span>";
	var productionDef = "<span title='displays GCOV%, yards per target, success rate, and interception rate for each possible reciever'>Reciever production splits</span>";
	var defPkgSplitsDef = "<span title='displays number of snaps for each defensive package'>Defensive package splits</span>";
	var thirdFourthDownsDef = "<span title='displays 3rd and 4th down conversion attempts and success rate for a wide variety of distances'>3rd/4th downs</span>";
	var WRStatsDef = "<span title='displays 1st option checks, yards per target, success rate, and various other statistics for each individual reciever'>Individual reciever stats</span>";
	var RBStatsDef = "<span title='displays YPC, success rate, and and other rushing statistics'>Individual rushing stats</span>";
	var IDPStatsDef = "<span title='displays 1st option checks, yards per target, success rate, and various other statistics for the recievers matched up against each individual defensive player'>Individual defensive player stats</span>";
	var passDistStatsDef = "<span title='displays completion percentage, interception rate, average YAC, and other statistics for passes of various distances'>Pass results by distance</span>";
	var passRushStatsDef = "<span title='displays sacks, throwaways, scrambles, and other plays which help guage how much pressure is applied to the quarterback'>Pressure stats</span>";
	var kickoffStatsDef = "<span title='displays stats for kickoffs'>Kickoff stats</span>";
	var fieldGoalStatsDef = "<span title='displays statistics for field goals and extra points, split by distance'>Field Goal Stats</span>";
	var puntStatsDef = "<span title='displays statistics for punts, split by field position'>Punting Stats</span>";

	var newtd5 = document.createElement('td');
	newtd5.setAttribute('colspan', '4');
	var newDiv5 = document.createElement('div');
	newDiv5.innerHTML =
		'<span class="teamSplitHeader"><b>Team Level Situational Splits</b></span><br>' +
		'<input type="checkbox" name="other" id="runPass">  ' + runPassDef + ' <br> ' +
		'<input type="checkbox" name="other" id="targets">  ' + targetsDef + ' <br> ' +
		'<input type="checkbox" name="other" id="production"> ' + productionDef + ' <br> ' +
		'<input type="checkbox" name="other" id="conversions"> ' + thirdFourthDownsDef + ' <br>' +
		'<input type="checkbox" name="other" id="passDist"> ' + passDistStatsDef + ' <br>' +
		'<input type="checkbox" name="other" id="defPkgSplits"> ' + defPkgSplitsDef + ' <br>' +
		'<span class="teamStatHeader"><b>Team Level Statistics</b></span><br>' +
		'<input type="checkbox" name="other" id="sacks"> ' + passRushStatsDef + ' <br>' +
		'<input type="checkbox" name="other" id="kickoffs"> ' + kickoffStatsDef + ' <br>' +
		'<input type="checkbox" name="other" id="fieldGoals"> ' + fieldGoalStatsDef + ' <br>' +
		'<input type="checkbox" name="other" id="punts"> ' + puntStatsDef + ' <br>' + // */
		'<span class="playerStatHeader"><b>Individual Player Statistics</b></span><br>' +
		'<input type="checkbox" name="other" id="recievers"> ' + WRStatsDef + ' <br>' +
		'<input type="checkbox" name="other" id="runners"> ' + RBStatsDef + ' <br>' +
		'<input type="checkbox" name="other" id="defenders"> ' + IDPStatsDef + ' <br>' +
		''; // Hanging end of string to make new additions more convenient
	newtd5.appendChild(newDiv5);

	return newtd5;
}

function selectPreRegPost() {
	var newtd6 = document.createElement('td');
	newtd6.setAttribute('colspan', '3');
	var newDiv6 = document.createElement('div');

	/*var pre = document.createElement('input');
	pre.setAttribute("type", "checkbox");
	pre.setAttribute("name", "season");
	pre.setAttribute("id", "pre");
	pre.checked = false;
	var reg = document.createElement('input');
	reg.setAttribute("type", "checkbox");
	reg.setAttribute("name", "season");
	reg.setAttribute("id", "reg");
	reg.checked = false;
	var post = document.createElement('input');
	post.setAttribute("type", "checkbox");
	post.setAttribute("name", "season");
	post.setAttribute("id", "post");
	post.checked = false;
	pre.insertAdjacentHTML(' Preseason ' + getGameDropdown("pre") + ' <br> ');
	/*newDiv6.appendChild(pre);
	reg.insertAdjacentHTML(' Regular season ' + getGameDropdown("reg") + ' <br> ');
	newDiv6.appendChild(reg);
	post.insertAdjacentHTML(' Postseason ' + getGameDropdown("post") + ' <br> ');
	newDiv6.appendChild(post); // */
	newDiv6.innerHTML =
		'<input type="checkbox" name="season" id="pre"> Preseason ' + getGameDropdown("pre") + ' <br> ' +
		'<input type="checkbox" name="season" id="reg" checked="checked"> Regular season ' + getGameDropdown("reg") + ' <br> ' +
		'<input type="checkbox" name="season" id="post" checked="checked"> Postseason ' + getGameDropdown("post"); // */
	newtd6.appendChild(newDiv6);

	return newtd6;
}

function selectWithPens() {
	var withPensDef = "<span title='If this box is checked, statistics produced will include plays which were nullified by a penalty and not included in official statistics. If the box is not checked, these plays will be left out'> Include nullified plays ";

	var newtd7 = document.createElement('td');
	newtd7.setAttribute('colspan', '1');
	var newDiv7 = document.createElement('div');
	newDiv7.innerHTML =
	'<input type="checkbox" name="pens" id="withPens">' + withPensDef;
	newtd7.appendChild(newDiv7);

	return newtd7;
}

function startFunc ()
{
	var input=document.body.innerHTML, ptr1, ptr2, ptr3, id, id2, name, endptr;
	var withGameDropdown = 0;
	var selectedTable;

	var target = document.getElementById('imonstatus');

	var buttontable = makeButtontableTeamRows();
	buttontable = makeButtontableOptionRows(buttontable);

	var newtr=document.createElement('tr');
	buttontable.appendChild(newtr);
	var newtd1 = document.createElement('td');
	newtd1.setAttribute('colspan', '2');
	var newDiv2 = document.createElement('div');
	newDiv2.align = 'center';
	newDiv2.innerHTML = '<input type="button" style="font-size: 10pt; font-weight: bold; width: 100%; height: 30px" value="Start">';
	newDiv2.addEventListener('click', function() {
		if (document.getElementById("offense").checked) {
			showOffense = 1;
		} else {
			showOffense = 0;
		}

		if (document.getElementById("both").checked) {
			showBothTeams = 1;
		}
		else {
			showBothTeams = 0;
		}

		runPassSplits = 0;
		WRTargetSplits = 0;
		WRProductionSplits = 0;
		defPkgSplits = 0;
		conversions = 0;
		individualWRStats = 0;
		individualRunnerStats = 0;
		individualDefenderStats = 0;
		passDistSplits = 0;
		showSacks = 0;
		kickoffStats_bol = 0;
		fieldGoalStats_bol = 0;
		puntStats_bol = 0;

		selectedTable = 0;

		if (document.getElementById("runPass").checked) {
			runPassSplits = 1;
			selectedTable = 1;
		}
		if (document.getElementById("targets").checked) {
			WRTargetSplits = 1;
			selectedTable = 1;
		}
		if (document.getElementById("production").checked) {
			WRProductionSplits = 1;
			selectedTable = 1;
		} // */
		if (document.getElementById("defPkgSplits").checked) {
			defPkgSplits = 1;
			selectedTable = 1;
		}
		if (document.getElementById("conversions").checked) {
			conversions = 1;
			selectedTable = 1;
		}
		if (document.getElementById("recievers").checked) {
			individualWRStats = 1;
			selectedTable = 1;
		}
		if (document.getElementById("runners").checked) {
			individualRunnerStats = 1;
			selectedTable = 1;
		}
		if (document.getElementById("defenders").checked) {
			individualDefenderStats = 1;
			selectedTable = 1;
		}
		if (document.getElementById("sacks").checked) {
			showSacks = 1;
			selectedTable = 1;
		}
		if (document.getElementById("passDist").checked) {
			passDistSplits = 1;
			selectedTable = 1;
		}
		if (document.getElementById("kickoffs").checked) {
			kickoffStats_bol = 1;
			selectedTable = 1;
		}
		if (document.getElementById("fieldGoals").checked) {
			fieldGoalStats_bol = 1;
			selectedTable = 1;
		}
		if (document.getElementById("punts").checked) {
			puntStats_bol = 1;
			selectedTable = 1;
		} // */

		if (document.getElementById("pre").checked) {
			Preseason = 1;
		}
		if (document.getElementById("reg").checked) {
			RegularSeason = 1;
		}
		if (document.getElementById("post").checked) {
			Postseason = 1;
		}

		if (document.getElementById("withPens").checked) {
			withPens = 1;
		} else {
			withPens = 0;
		}

		if (selectedTable === 0) {
			alert("You have not selected the statistics you want displayed");
		}
		else {
			buildGameList(input);
			initializeMultiTeamArrays();
			startReadLog();
		}
	}, true); // "Start" button, runs script
	newtd1.appendChild(newDiv2);
	newtr.appendChild(newtd1);

	var newtd2 = document.createElement('td');
	newtd2.setAttribute('colspan', '2');
	var newDiv3 = document.createElement('div');
	newDiv3.align = 'center';
	newDiv3.innerHTML = '<input type="button" style="font-size: 10pt; font-weight: bold; width: 100%; height: 30px" value="Select all teams">';
	newDiv3.addEventListener('click', function() {
			var checkbox = getElementsByClassName('team_checkbox', document);
			for (var i=0; i < checkbox.length; i++) {
				checkbox[i].checked=true;
			}
	}, true);
	newtd2.appendChild(newDiv3);
	newtr.appendChild(newtd2);

	var newtd3 = document.createElement('td');
	newtd3.setAttribute('colspan', '2');
	var newDivA = document.createElement('div');
	newDivA.align = 'center';
	newDivA.innerHTML = '<input type="button" style="font-size: 10pt; font-weight: bold; width: 100%; height: 30px" value="Clear selected teams">';
	newDivA.addEventListener('click', function() {
		var checkbox = getElementsByClassName('team_checkbox', document);
		for (var i=0; i < checkbox.length; i++) {
			checkbox[i].checked=false;
		}
	}, true);
	newtd3.appendChild(newDivA);
	newtr.appendChild(newtd3);

	var newtd8 = document.createElement('td');
	newtd8.setAttribute('colspan', '2');
	var newDivB = document.createElement('div');
	newDivB.align = 'center';
	newDivB.innerHTML = '<input type="button" style="font-size: 10pt; font-weight: bold; width: 100%; height: 30px" value="Reset">';
	newDivB.addEventListener('click', function() {
		if (readcount >= readtarget) {
			readcount = 0;
			readtarget = 1;
			links=[];
			// 1/2/2018: old bug hidden by a typo. Commented to be safe. Correct names are teamlist and abbrlist.
			// should these two be teams=[] and abbrs=[]?
			//teamList=[];
			//abbrList=[];
			teamID=[];
			WRPlayerStats=[];
			RBPlayerStats=[];
			IDPStats=[];
			initializeArrays();

			Preseason = 0;
			RegularSeason = 0;
			Postseason = 0;
			document.getElementById('scout_count').innerHTML="";
		}
		else {
			document.getElementById('scout_count').innerHTML='<span style="background-color:white">There is currently nothing to reset</span>';
		}
	}, true);
	newtd8.appendChild(newDivB);
	newtr.appendChild(newtd8);


	if (target) {
		target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.insertBefore(buttontable, target.parentNode.parentNode.parentNode.parentNode.parentNode.nextSibling);
	}

	addButtons("pre");
	addButtons("reg");
	addButtons("post");

	// dumb hackey way of injecting a javascript function
	// better idea would be to replace all these html strings with actual code, like above
	var script = document.createElement("script");
	script.appendChild(document.createTextNode('('+ selectThisWeekOnly +')();'));
	(document.body || document.head || document.documentElement).appendChild(script);
}


window.setTimeout( function() {

	var input=document.body.innerHTML;
	var URI=document.body.baseURI;
	var ptr1, ptr2, ptr3, year, league;

	fillDefPkgs();
	initializeArrays();

	// check if this is the scrimmage page
	ptr1=URI.indexOf("scrimmine", 0);
	if (ptr1!=-1) {
		//alert("scrimage");
	}
	else {
		ptr1=input.indexOf("imonyear", 0);
		ptr2=input.indexOf("value=\"", ptr1);
		ptr3=input.indexOf("\"", ptr2+7);
		if (ptr1<0 || ptr2<0 || ptr3<0) {
			alert("Can't find year");
			return;
		}
		year=input.substring(ptr2+7, ptr3);

		ptr1=input.indexOf("imonlg", 0);
		ptr2=input.indexOf("value=\"", ptr1);
		ptr3=input.indexOf("\"", ptr2+7);
		if (ptr1<0 || ptr2<0 || ptr3<0) {
			alert("Can't find league number");
			return;
		}
		league=input.substring(ptr2+7, ptr3);

		GM_xmlhttpRequest({
			method: 'GET',
			url: 'http://deeproute.com/?sel=lgleaderbyteam&year=' + year + '&myleagueno=' + league + '&typer=X&stat=2',
			headers: {
				 'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
				 'Accept': 'application/atom+xml,application/xml,text/xml',
			},
			onload: function(detail) {
					parseTeamStatsForAbbrs(detail.responseText);
			},
		});
	}

}, 100);
