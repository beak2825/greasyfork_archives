// ==UserScript==
// @name         New Match Analyzer CN
// @version      0.1
// @description  新的简易版比赛分析
// @match        *trophymanager.com/matches*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1304483
// @downloadURL https://update.greasyfork.org/scripts/529694/New%20Match%20Analyzer%20CN.user.js
// @updateURL https://update.greasyfork.org/scripts/529694/New%20Match%20Analyzer%20CN.meta.js
// ==/UserScript==

function installFunc(source) {
/*
  // Check for function input.
  if ('function' == typeof source) {
    // Execute this function with no arguments, by adding parentheses.
    // One set around the function, required for valid syntax, and a
    // second empty set calls the surrounded function.
    source = '(' + source + ')();'
  }
*/
  // Create a script node holding this  source code.
  var script = document.createElement('script');
  script.setAttribute("type", "application/javascript");
  script.textContent = source;

  // Insert the script node into the page, so it will run
  document.body.appendChild(script);
}

/*
Taken from http://www.tomhoppe.com/index.php/2008/03/dynamically-adding-css-through-javascript/
*/
function addCss(cssCode) {
var styleElement = document.createElement("style");
  styleElement.type = "text/css";
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = cssCode;
  } else {
    styleElement.appendChild(document.createTextNode(cssCode));
  }
  document.getElementsByTagName("head")[0].appendChild(styleElement);
}


window.addEventListener('load', function (e)
{
	installFunc( generatePage );
	installFunc( addCss );

	addCss(".big { height: 30px; width: 200px; position: fixed; bottom: 0px; left: 10px; z-index: 10; background-color: #6c9922}");
	addCss(".analyze { left: 0px; top: 5px; height: 20px; position: relative; width: 60px; float: left; text-align: center; }");
	addCss(".analyze:hover {cursor: pointer; }");
	addCss(".saverep { left: 20px; top: 5px; height: 20px; position: relative; width: 60px; float: left; text-align: center; }");
	addCss(".saverep:hover { background: url(https://mymatchanalyzer.com/mma/saverep_hover.png); cursor: pointer; }");

	let div = document.createElement("div");
	div.setAttribute("class", "big");

	div.innerHTML = '<div class="analyze" onclick="generatePage();">Analyze</div><div class="saverep" onclick="generatePage();">Save</div>';
	document.body.appendChild(div);

}, false);

function generatePage() {
    // 创建覆盖层容器
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'black';
    overlay.style.zIndex = '9999';

    // 添加标题和内容
    overlay.innerHTML = `
        <h1 style="padding: 20px;">凑活版Analyzer</h1>
        <button id="close-btn" style="margin: 20px;">关闭</button>
        <button id="analyse-btn" style="margin: 20px;">分析</button>
    `;

    // 关闭按钮逻辑
    const closeBtn = overlay.querySelector('#close-btn');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });
    const analyseBtn = overlay.querySelector('#analyse-btn');
    analyseBtn.addEventListener('click', () => {
        infomationDiv(overlay);
        analyseBtn.style.display = 'none';;
    });

    // 将覆盖层添加到页面
    document.body.appendChild(overlay);

    function infomationDiv(parentDiv) {
        let clubDiv = document.createElement('div');
        clubDiv.innerHTML = getClubDiv();
        parentDiv.appendChild(clubDiv);
        clubDiv.innerHTML += getStadiumTable();
        let reportDiv = document.createElement('div');
        //reportDiv.innerHTML = getReportDiv();
        parentDiv.appendChild(reportDiv);
    }

    function getClubDiv() {
        var html="<table border='1' style='width: fit-content'>";
        html+="<tbody>";

        html+="<tr>";
        html+="<th>";
        html+="俱乐部";
        html+="</th>";
        html+="<td>";
        html+=getClubName(match_data.club.home);
        html+="</td>";
        html+="<td>";
        html+=getClubName(match_data.club.away);
        html+="</td>";
        html+="</tr>";

        html+="<tr>";
        html+="<th>";
        html+="俱乐部ID";
        html+="</th>";
        html+="<td>";
        html+=getClubID(match_data.club.home);
        html+="</td>";
        html+="<td>";
        html+=getClubID(match_data.club.away);
        html+="</td>";
        html+="</tr>";

        html+="<tr>";
        html+="<th>";
        html+="比赛心态";
        html+="</th>";
        html+="<td>";
        html+=getMentality("home");
        html+="</td>";
        html+="<td>";
        html+=getMentality("away");
        html+="</td>";
        html+="</tr>";

        html+="<tr>";
        html+="<th>";
        html+="进攻方式";
        html+="</th>";
        html+="<td>";
        html+=getAttackStyle("home");
        html+="</td>";
        html+="<td>";
        html+=getAttackStyle("away");
        html+="</td>";
        html+="</tr>";

        html+="<tr>";
        html+="<th>";
        html+="进攻方向";
        html+="</th>";
        html+="<td>";
        html+=getFocus("home");
        html+="</td>";
        html+="<td>";
        html+=getFocus("away");
        html+="</td>";
        html+="</tr>";

        html+="<tr>";
        html+="<th>";
        html+="控球率";
        html+="</th>";
        html+="<td>";
        html+=getPossession("home");
        html+="</td>";
        html+="<td>";
        html+=getPossession("away");
        html+="</td>";
        html+="</tr>";

        html+="</tbody>";
        html+="</table>";
        return html;
    }

    function getStadiumTable() {
        var html="<table border='1' style='width: fit-content'>";
        html+="<tbody>";

        html+="<tr>";
        html+="<th>";
        html+="球场";
        html+="</th>";
        html+="<td>";
        html+=getStadiumName();
        html+="</td>";
        html+="</tr>";

        html+="<tr>";
        html+="<th>";
        html+="比赛类型"
        html+="</th>";
        html+="<td>";
        html+=getMatchType();
        html+="</td>";
        html+="</tr>";

        html+="<tr>";
        html+="<th>";
        html+="比赛名称"
        html+="</th>";
        html+="<td>";
        html+=getTournament();
        html+="</td>";
        html+="</tr>";

        html+="<tr>";
        html+="<th>";
        html+="观众人数"
        html+="</th>";
        html+="<td>";
        html+=getAttendance()+"/"+getStadiumSeats();
        html+="</td>";
        html+="</tr>";

        html+="<tr>";
        html+="<th>";
        html+="天气"
        html+="</th>";
        html+="<td>";
        html+=getWeather();
        html+="</td>";
        html+="</tr>";

        html+="<tr>";
        html+="<th>";
        html+="球场情况"
        html+="</th>";
        html+="<td>";
        html+=getCondition();
        html+="</td>";
        html+="</tr>";

        html+="<tr>";
        html+="<th>";
        html+="比赛时间"
        html+="</th>";
        html+="<td>";
        html+=getTime();
        html+="</td>";
        html+="</tr>";

        html+="</tbody>";
        html+="</table>";
        return html;
    }

    function getReportDiv() {
        return;
    }

    function getReport() {
        const reports= match_data.report;
        //reports.forEach
    }

    function getPossession(team) {
        return match_data.match_data.possession[team]+"%";
    }

    function getFocus(team) {
        return focus_type_language_ar[match_data.match_data.focus_side[team]-1];
    }

    function getAttackStyle(team) {
        return style_language_ar[match_data.match_data.start_attacking_style[team]];
    }

    function getMentality(team) {
        return mentality_language_ar[match_data.match_data.start_mentality[team]];
    }

    function getTime() {
        return match_data.match_data.regular_last_min;
    }

    function getStadiumName() {
        return match_data.match_data.venue.name;
    }

    function getMatchType() {
        return get_match_type_lang(match_data.match_data.venue.matchtype);
    }

    function getTournament() {
        return match_data.match_data.venue.tournament;
    }

    function getCondition() {
        return match_data.match_data.venue.pitch_condition;
    }

    function getWeather() {
        return match_data.match_data.venue.weather;
    }

    function getAttendance() {
        return match_data.match_data.attendance;
    }

    function getStadiumSeats() {
        return match_data.match_data.venue.capacity;
    }

    function getClubName(club) {
        return club.club_name;
    }

    function getClubID(club) {
        return club.id;
    }

    function get_match_type_lang(type) {
        if (type == "clc" || type == "uec" || type == "clg" || type == "ueg") { return match_type_language_ar["international_cup"]; }
        else if (type.charAt(0) == "p") { return match_type_language_ar["cup"]; }
        else if (type == "l") { return match_type_language_ar["league"]; }
        else if (type == "f") { return match_type_language_ar["friendly"]; }
        else if (type == "fl") { return match_type_language_ar["friendly_league"]; }
        return "-";
    }

    const focus_type_language_ar=[
        "平衡",
        "左",
        "中间",
        "右"];
}
