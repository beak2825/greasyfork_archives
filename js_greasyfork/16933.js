// ==UserScript==
// @name         SportsFantasyMatrix
// @namespace    http://tampermonkey.net/
// @version      0.1.5.2021
// @description  try to take over the world!
// @author       Alexey Seklenkov
// @match        https://www.sports.ru/fantasy/basketball/team/*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16933/SportsFantasyMatrix.user.js
// @updateURL https://update.greasyfork.org/scripts/16933/SportsFantasyMatrix.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';
var teams = [];
var games = [];
var gameDays = [];
var unqGameDays = [];
var unqWeeks = [];
var headColStyle = "position:absolute; width:5em; left:0; top:auto;";

var weekOddTeamOddColor = "#E5E5E5";
var weekOddTeamEvenColor = "#FFFFFF";
var weekEvenTeamOddColor = "#ADD69D";
var weekEvenTeamEvenColor = "#CBE5C1";
var tableBorderColor = "#BABABA";
var gameColor1 = "#B3CDA6";
var gameColor2 = "#96BB86";
var gameColor3 = "#7AA865";
var gameColor4 = "#628C4E";
var gameColor5 = "#4B6B3C";

function Team(id, shortNameEng, shortNameRus, fullNameRus, img, url, textColor){
    this.id = id;
    this.url = url;
    this.shortNameEng = shortNameEng;
    this.shortNameRus = shortNameRus;
    this.fullNameRus = fullNameRus;
    this.img = img;
    this.textColor = textColor;
}

teams.push(new Team(0, "ATL", "АТЛ", "Атланта", "https://s5o.ru/fantasy/images/shirts/basketball/nba/Atlanta-Hawks.png", "https://www.sports.ru/fantasy/basketball/player/info/150/1985081.html", "black")); //Янг
teams.push(new Team(1, "BKN", "БКН", "Бруклин", "https://s5o.ru/fantasy/images/shirts/basketball/nba/San-Antonio-Spurs.png", "https://www.sports.ru/fantasy/basketball/player/info/150/1796920.html", "white")); //Ирвинг
teams.push(new Team(2, "BOS", "АТЛ", "Бостон", "https://s5o.ru/fantasy/images/shirts/basketball/nba/Boston-Celtics.gif", "https://www.sports.ru/fantasy/basketball/player/info/150/38368.html", "white")); //Дюрант
teams.push(new Team(3, "CHA", "АТЛ", "Шарлотт", "https://s5o.ru/fantasy/images/shirts/basketball/nba/Charlotte-Bobcats.png", "https://www.sports.ru/fantasy/basketball/player/info/150/198048.html", "white" )); //Хейвард
teams.push(new Team(4, "CHI", "АТЛ", "Чикаго", "https://s5o.ru/fantasy/images/shirts/basketball/nba/Chicago-Bulls.png", "https://www.sports.ru/fantasy/basketball/player/info/150/1887633.html", "white")); //Лавин
teams.push(new Team(5, "CLE", "АТЛ", "Кливленд", "https://s5o.ru/fantasy/images/shirts/basketball/nba/Cleveland-Cavaliers.gif", "https://www.sports.ru/fantasy/basketball/player/info/150/1810360.html", "white")); //Драммонд
teams.push(new Team(6, "DAL", "АТЛ", "Даллас", "https://s5o.ru/fantasy/images/shirts/basketball/nba/Dallas-Mavericks.png", "https://www.sports.ru/fantasy/basketball/player/info/150/1923275.html", "black")); //Лука
teams.push(new Team(7, "DEN", "АТЛ", "Денвер", "https://s5o.ru/fantasy/images/shirts/basketball/nba/Denver-Nuggets.gif", "https://www.sports.ru/fantasy/basketball/player/info/150/1887865.html", "black")); //Йокич
teams.push(new Team(8, "DET", "АТЛ", "Детройт", "https://s5o.ru/fantasy/images/shirts/basketball/nba/Detroit-Pistons.gif", "https://www.sports.ru/fantasy/basketball/player/info/150/38391.html", "white")); //Гриффин
teams.push(new Team(9, "GSW", "АТЛ", "Голден Стэйт", "https://s5o.ru/fantasy/images/shirts/basketball/nba/Golden-State-Warriors.png", "https://www.sports.ru/fantasy/basketball/player/info/150/38600.html", "white")); //Карри
teams.push(new Team(10,"HOU", "АТЛ", "Хьюстон", "https://s5o.ru/fantasy/images/shirts/basketball/nba/Houston-Rockets.png", "https://www.sports.ru/fantasy/basketball/player/info/150/38254.html", "white")); //Харден
teams.push(new Team(11,"IND", "АТЛ", "Индиана", "https://s5o.ru/fantasy/images/shirts/basketball/nba/Indiana-Pacers.gif", "https://www.sports.ru/fantasy/basketball/player/info/150/1850142.html", "white")); //Оладипо
teams.push(new Team(12,"LAC", "АТЛ", "Клипперс", "https://s5o.ru/fantasy/images/shirts/basketball/nba/Los-Angeles-Clippers.gif", "https://www.sports.ru/fantasy/basketball/player/info/150/198014.html", "white")); //Джордж
teams.push(new Team(13,"LAL", "АТЛ", "Лейкерс", "https://s5o.ru/fantasy/images/shirts/basketball/nba/Los-Angeles-Lakers.gif", "https://www.sports.ru/fantasy/basketball/player/info/150/38615.html", "white")); //Джеймс
teams.push(new Team(14,"MEM", "АТЛ", "Мемфис", "https://s5o.ru/fantasy/images/shirts/basketball/nba/Memphis-Grizzlies.gif", "https://www.sports.ru/fantasy/basketball/player/info/150/2014914.html", "white")); //Морэнт
teams.push(new Team(15,"MIA", "АТЛ", "Майами", "https://s5o.ru/fantasy/images/shirts/basketball/nba/Miami-Heat.png", "https://www.sports.ru/fantasy/basketball/player/info/150/2014969.html", "white")); //Хирро
teams.push(new Team(16,"MIL", "АТЛ", "Милуоки", "https://s5o.ru/fantasy/images/shirts/basketball/nba/Milwaukee-Bucks.gif", "https://www.sports.ru/fantasy/basketball/player/info/150/1850092.html", "white")); //Янис
teams.push(new Team(17,"MIN", "АТЛ", "Миннесота", "https://s5o.ru/fantasy/images/shirts/basketball/nba/Minnesota-Timberwolves.gif", "https://www.sports.ru/fantasy/basketball/player/info/150/1916604.html", "white")); //Таунс
teams.push(new Team(18,"NOP", "АТЛ", "Новый Орлеан", "https://s5o.ru/fantasy/images/shirts/basketball/nba/New-Orleans-Hornets.gif", "https://www.sports.ru/fantasy/basketball/player/info/150/2014918.html", "white")); //Зайон
teams.push(new Team(19,"NYK", "АТЛ", "Нью-Йорк", "https://s5o.ru/fantasy/images/shirts/basketball/nba/New-York-Knicks.gif", "https://www.sports.ru/fantasy/basketball/player/info/150/1887627.html", "white")); //Рэндл
teams.push(new Team(20,"OKC", "АТЛ", "Оклахома-Сити", "https://s5o.ru/fantasy/images/shirts/basketball/nba/Oklahoma-City-Thunder.png", "https://www.sports.ru/fantasy/basketball/player/info/150/1985124.html", "white")); //Шэй
teams.push(new Team(21,"ORL", "АТЛ", "Орландо", "https://s5o.ru/fantasy/images/shirts/basketball/nba/Orlando-Magic.gif", "https://www.sports.ru/fantasy/basketball/player/info/150/1784460.html", "white")); //Вуч
teams.push(new Team(22,"PHI", "АТЛ", "Филадельфия", "https://s5o.ru/fantasy/images/shirts/basketball/nba/Philadelphia-76ers.gif", "https://www.sports.ru/fantasy/basketball/player/info/150/1887623.html", "white")); //Эмбид
teams.push(new Team(23,"PHX", "АТЛ", "Финикс", "https://s5o.ru/fantasy/images/shirts/basketball/nba/Phoenix-Suns.gif", "https://www.sports.ru/fantasy/basketball/player/info/150/1916614.html", "white")); //Букер
teams.push(new Team(24,"POR", "АТЛ", "Портленд", "https://s5o.ru/fantasy/images/shirts/basketball/nba/Portland-Trail-Blazers.png", "https://www.sports.ru/fantasy/basketball/player/info/150/1812024.html", "white")); //Лиллард
teams.push(new Team(25,"SAC", "АТЛ", "Сакраменто", "https://s5o.ru/fantasy/images/shirts/basketball/nba/Sacramento-Kings.gif", "https://www.sports.ru/fantasy/basketball/player/info/150/1963235.html", "white")); //Фокс
teams.push(new Team(26,"SAS", "АТЛ", "Сан-Антонио", "https://s5o.ru/fantasy/images/shirts/basketball/nba/San-Antonio-Spurs.png", "https://www.sports.ru/fantasy/basketball/player/info/150/38767.html", "white")); //Миллс
teams.push(new Team(27,"TOR", "АТЛ", "Торонто", "https://s5o.ru/fantasy/images/shirts/basketball/nba/Toronto-Raptors.gif", "https://www.sports.ru/fantasy/basketball/player/info/150/1947874.html", "white")); //Сиакам
teams.push(new Team(28,"UTA", "АТЛ", "Юта", "https://s5o.ru/fantasy/images/shirts/basketball/nba/Utah-Jazz.gif", "https://www.sports.ru/fantasy/basketball/player/info/150/1847180.html", "white")); //Гобер
teams.push(new Team(29,"WAS", "АТЛ", "Вашингтон", "https://s5o.ru/fantasy/images/shirts/basketball/nba/Washington-Wizards.png", "https://www.sports.ru/fantasy/basketball/player/info/150/38588.html", "white")); //Уэстбрук

function MyDate(year, mounth, date){
    this.year = year;
    this.mounth = mounth;
    this.date = date;
}

function Game(team, opp, date, week, place){
    this.team = team;
    this.opp = opp;
    this.date = date;
    this.week = week;
    this.place = place;
}

function GameDay(date, week){
    this.date = date;
    this.week = week;
}

function compareGameDay(a,b) {
    if(a.week/1 < b.week/1)
        return -1;
    else if(a.week/1 > b.week/1)
        return 1;
    else if(a.date.year/1  < b.date.year/1 )
        return -1;
    else if(a.date.year/1  > b.date.year/1 )
        return 1;
    else if(a.date.mounth/1  < b.date.mounth/1 )
        return -1;
    else if(a.date.mounth/1  > b.date.mounth/1 )
        return 1;
    else if(a.date.date/1  < b.date.date/1 )
        return -1;
    else if(a.date.date/1  > b.date.date/1 )
        return 1;
    else
        return 0;

}

function getIndexOfGameDay(gameDays, gameDay){
    for(var i = 0; i < gameDays.length; i++){
        if(compareGameDay(gameDays[i], gameDay) == 0){
            return i;
        }
    }
    return -1;
}

function findTeamByFullNameRus(name){
    for(var i = 0; i < teams.length; i++){
        if(teams[i].fullNameRus == name){
            return teams[i];
        }
    }
}

function findTeamIdByFullNameRus(name){
    for(var i = 0; i < teams.length; i++){
        if(teams[i].fullNameRus == name){
            return teams[i].id;
        }
    }
    return -1;
}

function getNumberOfGames(week, team){
    var num = 0;
    for(var i = 0; i < games.length; i++){
        if(games[i].team == team && games[i].week == week) num=num+1;
    }
    return num;
}

function getGamesOfDate(myDate){
    var tempGames = [];
    for(var i = 0; i < games.length; i++){
        var gameMyDate = games[i].date;
        if(gameMyDate.year == myDate.year && gameMyDate.mounth == myDate.mounth && gameMyDate.date == myDate.date){
            tempGames.push(games[i]);
        }
    }
    return tempGames;
}

function createTable(){
    var tableOutter = document.createElement('div');
    tableOutter.setAttribute("id", "FantasyMatrixTableOutterAlx");
    tableOutter.setAttribute("style", "overflow-x: scroll;");

    var table = document.createElement('table');
    table.setAttribute("id", "FantasyMatrixTableAlx");
    table.setAttribute("class", "stat-table");
    table.setAttribute("style", "margin-left:5em;");
    table.style.width="auto";
    table.style.cssText += " border-color: " + tableBorderColor + " !important;";
    table.style.cssText += " border-width: 2px;";
    var header = table.createTHead();
    var row = header.insertRow(0);
    var cell = row.insertCell(0);
    cell.setAttribute("style", headColStyle);
    //cell.innerHTML = "<b>...</b>";

    for(var i = 0; i < teams.length; i++){
        var tr = document.createElement('tr');
        tr.setAttribute("id", teams[i].id + "TeamRowAlx");
        tr.setAttribute("team", teams[i].id);
        var td = document.createElement('td');
        //td.setAttribute("style", "border-width: 1px; border-style: solid; border-color: rgb(216, 216, 216);");
        var img = document.createElement('img');
        img.setAttribute("src", teams[i].img);
        td.innerHTML = teams[i].shortNameEng;
        td.setAttribute("class", "score-td");
        td.setAttribute("style", headColStyle);
        //td.appendChild(img);
        tr.appendChild(td);
        table.appendChild(tr);
    }
    tableOutter.appendChild(table);
    document.getElementById("FantasyMatrixAriaAlx").appendChild(tableOutter);
}

function addDayToTable(gameDay){
    var table = document.getElementById("FantasyMatrixTableAlx");
    var header = table.getElementsByTagName("thead")[0];
    var headerRow = header.getElementsByTagName("tr")[0];
    var headerCell = headerRow.insertCell(-1);
    var formated_date = gameDay.date.date + "." + gameDay.date.mounth;
    var background = weekOddTeamEvenColor;
    if(gameDay.week % 2 == 0){
        background = weekEvenTeamEvenColor;
    }
    headerCell.innerHTML = "<b>" + formated_date + "</b>";
    headerCell.style.background = background;
    headerCell.setAttribute("type", "gameCell");
    headerCell.setAttribute("week", gameDay.week);
    headerCell.style.display = "none";

    var rows = table.getElementsByTagName("tr");
    for(var i = 1; i < rows.length; i++){


        var cellColor = weekEvenTeamOddColor;
        if(i % 2 == 0)
            cellColor = weekEvenTeamEvenColor;

        var cell = rows[i].insertCell(-1);
        cell.innerHTML = "";
        cell.style.background = cellColor;
        cell.style.display = "none";
        cell.setAttribute("type", "gameCell");
        cell.setAttribute("date", gameDay.date.year.toString() + gameDay.date.mounth.toString() + gameDay.date.date.toString());
        cell.setAttribute("week", gameDay.week);
        cell.setAttribute("team", rows[i].getAttribute("team"));
        cell.setAttribute("class", "name-td alLeft bordR");
    }
}

function addWeekTogglerToTable(week){
    var table = document.getElementById("FantasyMatrixTableAlx");
    var header = table.getElementsByTagName("thead")[0];
    var headerRow = header.getElementsByTagName("tr")[0];
    var headerCell = headerRow.insertCell(-1);
    var background = weekOddTeamEvenColor;
    if(week % 2 == 0){
        background = weekEvenTeamEvenColor;
    }
    headerCell.innerHTML = '<div style="width:3em;"><b> W#' + week + '</b></div>';
    headerCell.style.background = background;
    headerCell.setAttribute("type", "weekTogler");

    var rows = table.getElementsByTagName("tr");
    for(var i = 1; i < rows.length; i++){

        var gamesNum = Number(getNumberOfGames(week, i-1));
        var cell = rows[i].insertCell(-1);

        var cellColor = gameColor1;
        if(gamesNum == 2)
            cellColor = gameColor2;
        if(gamesNum == 3)
            cellColor = gameColor3;
        if(gamesNum == 4)
            cellColor = gameColor4;
        if(gamesNum > 4)
            cellColor = gameColor5;


        var btn = document.createElement("BUTTON");        // Create a <button> element
        btn.style.width="100%";
        btn.style.height="100%";
        btn.style.cursor="pointer";
        btn.style.border="none";
        btn.innerText = "" + gamesNum;       // Create a text node
        btn.style.background = cellColor;
        btn.onclick=function(e){
            e = e || window.event;
            var target = e.target || e.srcElement;
            target = target.parentNode;
            var week = target.getAttribute("week");
            toggleWeek(week);
        };

        cell.appendChild(btn);
        cell.setAttribute("type", "weekTogler");
        cell.setAttribute("week", week);
        cell.setAttribute("team", rows[i].getAttribute("team"));
        cell.setAttribute("toggle", "true");
        //cell.setAttribute("class", "name-td alLeft bordR");
    }
}

function toggleWeek(week){
    var togglerCells = document.querySelectorAll("[type=\"weekTogler\"][week=\"" + week + "\"]");
    if (togglerCells.length < 1) return;
    var toggleString = togglerCells[0].getAttribute("toggle");
    var toggle = (toggleString === "true");
    for(var i = 0; i < togglerCells.length; i++){
        togglerCells[i].setAttribute("toggle", (!toggle).toString());
    }

    var gameCells = document.querySelectorAll("[type=\"gameCell\"][week=\"" + week + "\"]");
    var display = "none";
    if(toggle){
        display = "";
        if(togglerCells[0].getAttribute("loaded") !== "true"){
            showExecTime(addGamesOfTheWeek, [games, week]);
        }
    }


    for(var i = 0; i < gameCells.length; i++){
        gameCells[i].style.display = display;
    }
    togglerCells[0].setAttribute("loaded", "true");
}

function addGameToTable(game){
    var dateStr = game.date.year.toString() + game.date.mounth.toString() + game.date.date.toString();
    var gameCell = document.querySelectorAll("td[date=\""+dateStr+"\"][week=\""+game.week+"\"][team=\"" + game.team + "\"]")[0];
    //console.log("td[date=\""+dateStr+"\"][week=\""+game.week+"\"][team=\"" + game.team + "\"]");
    if(gameCell === undefined) return;
    var oppTeam = teams[game.opp];
    var opp = "???";
    var teamImg = "";
    if(game.opp>-1 && game.opp<30){
        opp = teams[game.opp].shortNameEng;
        teamImg = teams[game.opp].img;
        if(game.place == "В гостях"){
            opp = "@" + opp;
        }
    }
    gameCell.style.backgroundImage = "url(" + teamImg + ")";
    gameCell.style.backgroundRepeat="no-repeat";
    gameCell.style.backgroundPosition="top center";
    gameCell.style.color=oppTeam.textColor;
    gameCell.style.cssText += " padding-left: 10px !important;";
    gameCell.style.cssText += " padding-right: 10px !important;";
    gameCell.style.cssText += " text-align: center !important;";
    gameCell.style.cssText += " font-size: 0.7em;";
    gameCell.setAttribute("valign", "bottom");
    gameCell.innerHTML = '<div style="bottom:0; height: 10px">'+ opp+'</div>';
    /*gameCell.style.position="relative";
    var text = document.createElement('div');
    text.innerHTML = opp.fontsize(0.5) + "";
    text.style.position="absolute";
    text.style.bottom = "0";
    text.style.lineHeight = "normal";
    gameCell.appendChild(text);*/

}

function addGamesOfTheWeek(games, week){
    for(var i = 0; i < games.length; i++){
        if (games[i].week === week) addGameToTable(games[i]);
    }
}

function makehttpsObject() {
    try {return new XMLHttpRequest();}
    catch (error) {}
    try {return new ActiveXObject("Msxml2.XMLhttps");}
    catch (error) {}
    try {return new ActiveXObject("Microsoft.XMLhttps");}
    catch (error) {}

    throw new Error("Could not create https request object.");
}

function addMatrixTab() {
    var tabContaner = document.getElementsByClassName("tabs-container mB20")[0];
    if(tabContaner === undefined){
        console.log("нет вкладок");
        return false;
    }

    var tabs = tabContaner.getElementsByClassName("tabs mB20")[0];
    var a = document.createElement("a");
    a.appendChild(document.createTextNode("Матрица"));
    a.setAttribute("class", "tab"); // added line
    a.setAttribute("href", "#"); // added line
    tabs.appendChild(a);

    var tabsArea = tabContaner.getElementsByTagName("div")[1];
    var ul = tabsArea.getElementsByTagName("ul")[0];
    var li = document.createElement("li");
    li.setAttribute("class", "panel"); // added line
    li.setAttribute("style", "display: none;"); // added line
    li.setAttribute("id", "FantasyMatrixAriaAlx");
    //li.innerHTML = content;
    ul.appendChild(li);
    return true;
}

function parseGames(html, team){
    console.log(team.url);
    var el = document.createElement('html');
    el.innerHTML = html;
    var cal = el.querySelector('#calendar');
    var table = cal.getElementsByTagName('tbody')[0];
    var trs = table.getElementsByTagName('tr');

    for(var i = 0; i < trs.length; i++){
        var tds = trs[i].getElementsByTagName('td');

        var dateWeek = tds[0].innerText.split("|неделя ");
        var dateStr = dateWeek[0];
        var dateParts = dateStr.split('.');
        var date = new MyDate (Number(dateParts[2]), Number(dateParts[1]), Number(dateParts[0]));
        var week = dateWeek[1];
        var oppStr = tds[1].getElementsByTagName('a')[0].innerText;
        var oppTeamId = findTeamIdByFullNameRus(oppStr);
        var place = tds[2].innerText.trim();

        //gameDays.push(new GameDay(date, week));
        games.push(new Game(team.id, oppTeamId, date, week, place));
        if(unqWeeks.indexOf(week) == -1) unqWeeks.push(week);
        if(getIndexOfGameDay(unqGameDays, new GameDay(date, week)) == -1) unqGameDays.push(new GameDay(date, week));
    }

}

function getGames(){
    var request = makehttpsObject();
    var start = new Date().getTime();

    /*for(var i = 0; i < teams.length; i++){
        request.open("GET", teams[i].url, false);
        request.send(null);
        if (request.readyState == 4)
            parseGames(request.responseText, teams[i]);
        console.log(teams[i].shortNameEng + ".......done");
    }  */
    games = [];
    gameDays = [];
    unqGameDays = [];
    unqWeeks = [];

    var i = 0;
    request.open("GET", teams[i].url, true);
    request.onload = function (e) {
        if (request.readyState === 4) {
            if (request.status === 200) {
                parseGames(request.responseText, teams[i]);
                i++;
                document.getElementById("RefreshButtonAlx").innerText = i + "/"+teams.length;
                if(i < teams.length){
                    request.open("GET", teams[i].url, true);
                    request.send(null);
                }
                if(i >= teams.length){
                    unqGameDays = unqGameDays.sort(compareGameDay);
                    saveInCache("gamesAlx", games);
                    saveInCache("unqGameDaysAlx", unqGameDays);
                    saveInCache("unqWeeksAlx", unqWeeks);
                    document.getElementById("RefreshButtonAlx").innerText = "Обновить";
                    document.getElementById("RefreshButtonAlx").disabled = false;
                    fillTheTable(false);
                    console.log(".......done");
                }
            } else {
                console.error(xhr.statusText);
            }
        }
    };
    request.onerror = function (e) {
        console.error(xhr.statusText);
    };
    request.send(null);
    document.getElementById("RefreshButtonAlx").disabled = true;
    document.getElementById("RefreshButtonAlx").innerText = 0 + "/"+teams.length;

    var end = new Date().getTime();
    var time = end - start;
}


//Уже не нужна
function getUnqGameDays(){
    unqGameDays = gameDays.sort(compareGameDay).filter(function(item, pos, ar) {
        return !pos || compareGameDay(item, ar[pos - 1]);
    })
}

function clearTable(){
    var togglerCells = document.querySelectorAll("[type=\"weekTogler\"]");
    var gameCells = document.querySelectorAll("[type=\"gameCell\"]");
    for(var i = 0; i < togglerCells.length; i++){
        togglerCells[i].parentNode.removeChild(togglerCells[i]);

    }
    for(var i = 0; i < gameCells.length; i++){
        gameCells[i].parentNode.removeChild(gameCells[i]);

    }
}

function fillTheTable(fromCache){
    var table = document.getElementById("FantasyMatrixTableAlx");
    table.style.display = "";
    clearTable();
    if(fromCache) {
        games = [];
        gameDays = [];
        unqGameDays = [];
        unqWeeks = [];
        games = getFromCache("gamesAlx");
        unqGameDays = getFromCache("unqGameDaysAlx");
        unqWeeks = getFromCache("unqWeeksAlx");
    }
    else {

    }

    if(unqGameDays === undefined || games === undefined || unqWeeks === undefined){
        table.style.display = "none";
        return;
    }

    var lastWeek = 0;
    for(var i = 0; i < unqGameDays.length; i++){
        if(lastWeek != unqGameDays[i].week){
            addWeekTogglerToTable(unqGameDays[i].week);
            lastWeek = unqGameDays[i].week;
        }
        addDayToTable(unqGameDays[i]);
    }
    //for(var i = 0; i < games.length; i++){
    //     if (games[i].week == 2) addGameToTable(games[i]);
    //}
}

function bakeCookie(name, value) {
    var cookie = [name, '=', JSON.stringify(value), '; domain=.sports.ru; path=/;'].join('');
    document.cookie = cookie;
}

function readCookie(name) {
    var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
    result && (result = JSON.parse(result[1]));
    return result;
}

function saveInCache(name, value){
    localStorage[name] = JSON.stringify(value);
}

function getFromCache(name){
    var stored = localStorage[name];
    var myVar;
    if (stored) myVar = JSON.parse(stored);
    return myVar;
}

function showExecTime(func, args){
    var t0 = performance.now();
    func.apply(this, args);;
    var t1 = performance.now();
    console.log("Call to "+func.name+" took " + (t1 - t0) + " milliseconds.");
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
if(!addMatrixTab()) return;

var tabAria = document.getElementById("FantasyMatrixAriaAlx");
var btn = document.createElement("BUTTON");        // Create a <button> element
btn.setAttribute("id", "RefreshButtonAlx");
btn.style.width="100%";
btn.innerText = "Обновить";
btn.onclick=function(){
    getGames();
    //console.log(JSON.stringify(gameDays));
};


showExecTime(createTable, null);
showExecTime(fillTheTable, [true]);


tabAria.appendChild(btn);

/* var outter = document.getElementById("FantasyMatrixTableOutterAlx");
var table = document.getElementById("FantasyMatrixTableAlx");
var down = false;
var oldX;
var oldY;
table.onmousedown=function(event){
    down = true;
    oldX = event.clientX;
    oldY = event.clientY;
    console.log("table");
};
table.onmouseup=function(event){
    down = false;
};
table.onmousemove=function(event){
    if(down){
        outter.scrollLeft += oldX - event.clientX;
        oldX = event.clientX;
        oldY = event.clientY;
    }
}; */

//bakeCookie("testAlx", "alalal");
//games = readCookie("gamesAlx");

//console.log(JSON.stringify(unqGameDays));
//console.log(JSON.stringify(games));
//console.log('Execution time request: ' + time);
//console.log(JSON.stringify(gameDays));
//console.log(JSON.stringify(unqWeeks));
// Your code here...