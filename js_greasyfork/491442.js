// ==UserScript==
// @name         Stats Xente Script
// @namespace    http://tampermonkey.net/
// @version      0.182
// @description  Stats Xente Script for inject own data on Managerzone site
// @author       xente
// @match        https://www.managerzone.com/*
// @icon         https://statsxente.com/MZ1/View/Images/main_icon.png
// @license      GNU
// @connect      statsxente.com
// @connect      managerzone.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @require      https://code.jquery.com/jquery-3.7.1.js
// @downloadURL https://update.greasyfork.org/scripts/491442/Stats%20Xente%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/491442/Stats%20Xente%20Script.meta.js
// ==/UserScript==



(function () {
    'use strict';

    /*let keys = GM_listValues();
    keys.forEach(function(key) {
        console.log(key+" "+GM_getValue(key))
    });*/

    /*let actual_version="0.9666"
    console.log(GM_info.script.version)

    if(GM_info.script.version!=actual_version){
        console.log("here")
        keys = GM_listValues();
                keys.forEach(function (key) {
                    GM_deleteValue(key);
                });
    }*/
    let filter_initial_date=getDate(true)
    let filter_final_date=getDate(false)
    let changeDates=true
    let tacticsMap = new Map();
    let cats=[]
    let cats_stats = {}
    let statsKeys = {}
    let teams_data = "";
    let teams_stats = "";
    let searchClassName = ""
    let players = []
    let lines = []
    let gk_line = ""
    let skills_names = []
    let su_line = "unsetted";
    let fl_data=[]
    let langs = new Map();

    setCSSStyles()
    createModalMenu()
    waitToDOMById(createModalEventListeners,"saveButton",5000)
    setLangSportCats()
    getUsernameData()
    checkScriptVersion()
    getSelects()

    function getDate(first_of_month){
        let hoy = new Date();
        let day="01"
        let year = hoy.getFullYear();
        let month = String(hoy.getMonth() + 1).padStart(2, '0');
        if(!first_of_month){
            day = String(hoy.getDate()).padStart(2, '0');
        }
        return `${year}-${month}-${day}`
    }


    /// FUNCTIONS MENU
    setTimeout(function () {
        const urlParams = new URLSearchParams(window.location.search);
        if ((urlParams.has('p')) && (urlParams.get('p') === 'league') && (GM_getValue("leagueFlag"))) {
            waitToDOM(leagues, ".nice_table", 0,7000)
            waitToDOMById(topScorersTableEventListener,"league_tab_top_scorers",5000)
        }

        if ((urlParams.has('p')) && (urlParams.get('p') === 'federations')
            && (urlParams.get('sub') === 'league') && (GM_getValue("federationFlag"))) {
            waitToDOM(clashLeagues, ".nice_table", 0,7000)
        }

        if ((urlParams.has('p')) && (urlParams.get('p') === 'federations')
            && (urlParams.get('sub') === 'clash') && (GM_getValue("federationFlag"))) {
            getDeviceFormat()
            waitToDOM(clash, ".fed_badge", 0,7000)
            waitToDOMById(clashEloMatches, "latest-challenges",7000)
        }

        if ((urlParams.has('p')) && (urlParams.get('p') === 'match')
            && (urlParams.get('sub') === 'result') && (GM_getValue("matchFlag"))) {


            waitToDOM(heatMap,".scoreboard_container", 0,7000)


            setTimeout(function () {
                waitToDOM(match, ".hitlist.statsLite.marker", 0,7000)
            }, 2000);
        }

        if ((urlParams.has('p')) && (urlParams.get('p') === 'players') && (!urlParams.has('pid'))&&(!urlParams.has('tid'))
            && (GM_getValue("playersFlag"))) {
            getDeviceFormat()
            waitToDOM(playersPage, ".playerContainer", 0,7000)
            waitToDOM(scoutReportEventListeners, ".playerContainer", 0,7000)
        }

        if ((urlParams.has('p')) && (urlParams.get('p') === 'players') && (urlParams.has('tid')) && (!urlParams.has('pid')) ) {
            getDeviceFormat()
            waitToDOM(playersPageStatsAll, ".player_name", 0,7000)
            waitToDOM(scoutReportEventListeners, ".player_name", 0,7000)
        }

        if ((urlParams.has('p')) && (urlParams.get('p') === 'players') && (urlParams.has('pid'))) {
            getDeviceFormat()
            waitToDOM(playersPageStats, ".player_name", 0,7000)
            waitToDOM(scoutReportEventListeners, ".player_name", 0,7000)
        }


        if ((urlParams.has('p')) && (urlParams.get('p') === 'rank') && (urlParams.get('sub') === 'countryrank')
            && (GM_getValue("countryRankFlag"))) {
            countryRank();
        }

        if ((urlParams.has('p')) && (urlParams.get('p') === 'clubhouse')) {
            StatsXenteNextMatchesClubhouse()
            matchPredictor()
        }

        if (![...urlParams].length) {
            StatsXenteNextMatchesClubhouse()
            matchPredictor()
        }


        if ((urlParams.has('p')) && (urlParams.get('p') === 'friendlyseries')
            && (urlParams.get('sub') === 'standings')&& (GM_getValue("flFlag"))) {
            waitToDOM(friendlyCupsAndLeagues, ".nice_table", 0,7000)
        }

        if ((urlParams.has('p')) && (urlParams.get('p') === 'friendlyseries')&& (GM_getValue("flFlag"))){
            waitToDOMById(topScorersTableEventListener,"ui-id-4",5000)
        }


        if ((urlParams.has('p')) && (urlParams.get('p') === 'cup') && (urlParams.get('sub') === 'groupplay')&& (GM_getValue("cupFlag"))) {
            waitToDOM(friendlyCupsAndLeagues, ".nice_table", 0,7000)
        }


        if ((urlParams.has('p')) && (urlParams.get('p') === 'private_cup') && (urlParams.get('sub') === 'groupplay')&& (GM_getValue("cupFlag"))) {
            waitToDOM(friendlyCupsAndLeagues, ".nice_table", 0,7000)
        }



        if ((urlParams.has('p')) && (urlParams.get('p') === 'match') && (urlParams.get('sub') === 'played')) {

            if(!urlParams.has('hidescore')){



                if ((!urlParams.has('tid'))&&(GM_getValue("tacticsResultsFlag"))){
                    waitToDOM(tactisResumeData, ".group", 0,7000)
                }
                if(GM_getValue("eloPlayedMatchesFlag")){
                    waitToDOM(lastMatchesELO, ".group", 0,7000)
                }

                if(GM_getValue("eloNextMatchesFlag")){
                    waitToDOM(nextMatches, ".group", 0,7000)
                }
            }else{

                if(GM_getValue("eloNextMatchesFlag")){
                    if(GM_getValue("eloHiddenPlayedMatchesFlag")){
                        waitToDOM(nextMatches, ".group", 0,7000)
                    }
                }

            }

        }




        if ((urlParams.has('p')) && (urlParams.get('p') === 'match') && (urlParams.get('sub') === 'scheduled')) {
            if(GM_getValue("eloNextMatchesFlag")){
                waitToDOM(nextMatches, ".group", 0,7000)
            }
        }


        if ((urlParams.has('p')) && (urlParams.get('p') === 'team') && (GM_getValue("teamPageFlag"))) {
            teamPage()
        }



        if ((urlParams.has('p')) && (urlParams.get('p') === 'profile')) {
            waitToDOM(profilePage, ".flex-wrap", 0,7000)
        }

        if ((urlParams.has('p')) && (urlParams.get('p') === 'rank') && (urlParams.has('sub')) &&
            (urlParams.get('sub') === 'userrank')) {
            usersRank()
        }

        if ((urlParams.has('p')) && (urlParams.get('p') === 'rank')){
            eloRanks()
        }

        /* if ((urlParams.has('p')) && (urlParams.get('p') === 'clubhouse')){
            eloRanks()
        }*/

        if ((urlParams.has('p')) && (urlParams.get('p') === 'cup') && (urlParams.has('sub')) &&
            (urlParams.get('sub') === 'list')) {
            cupsListEventListener()
        }


        if ((urlParams.has('p')) && (urlParams.get('p') === 'private_cup') && (urlParams.has('cuptype')) &&
            (urlParams.get('cuptype') === 'partner')) {
            cupsListEventListener()
        }





        if ((urlParams.has('p')) && (urlParams.get('p') === 'training_report')&& (GM_getValue("trainingReportFlag"))) {
            getDeviceFormat()
            waitToDOMById(trainingReport,"training_report",5000)
        }

        if ((urlParams.has('p')) && (urlParams.get('p') === 'statistics')){
            statsPage()
            statsPageEventListeners()
        }

        if ((urlParams.has('p')) && (urlParams.get('p') === 'national_teams')&& (GM_getValue("nationalTeamFlag"))) {
            waitToDOMById(nationalTeamPage,"nt-tabs",5000)
        }



        if ((urlParams.has('p')) && (urlParams.get('p') !== 'players')){
            const elementos = document.querySelectorAll('.player_link'); //Adds stats icon in players page, when click on player info
            elementos.forEach(function (elemento) {
                elemento.addEventListener('click', function () {
                    getDeviceFormat()
                    waitToDOM(playersPageStats, ".player_name", 0,7000)
                    waitToDOM(scoutReportEventListeners, ".player_name", 0,7000)
                });
            });
        }
    }, 1000);


    function tactisResumeData(){
        tacticsMap.clear();
        let elements0 = document.querySelectorAll('.odd');

        let flagCount=true;

        let fechaFormateada=filter_initial_date

        elements0.forEach(element0 => {

            let ddDate=element0.previousElementSibling
            if((ddDate) && (ddDate.classList.contains('group'))){
                if((document.getElementById("final_date_stx"))&&((document.getElementById("final_date_stx").value!==""))){
                    function parseDDMMYYYY(fechaStr) {
                        const [dd, mm, yyyy] = fechaStr.split('-');
                        return new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
                    }

                    function parseYYYYMMDD(fechaStr) {
                        return new Date(`${fechaStr}T00:00:00`);
                    }

                    let fechaCompararStr =ddDate.innerText;
                    let fechaInicioStr = document.getElementById("initial_date_stx").value;
                    let fechaFinStr = document.getElementById("final_date_stx").value

                    let fechaComparar = parseDDMMYYYY(fechaCompararStr);
                    let fechaInicio = parseYYYYMMDD(fechaInicioStr);
                    let fechaFin = parseYYYYMMDD(fechaFinStr);



                    if(changeDates===true){
                        let [dia, mes, anio] = fechaCompararStr.split("-");
                        fechaFormateada = `${anio}-${mes}-${dia}`;
                    }

                    if(changeDates===false){
                        if(fechaComparar >= fechaInicio && fechaComparar <= fechaFin) {
                            flagCount=true;
                        } else {
                            flagCount=false;
                        }
                    }

                }


            }
            if(flagCount){
                let score=element0.querySelectorAll(".bold.score-cell-wrapper.textCenter.flex-grow-0")
                if(score.length>0){
                    let isHome=false;
                    let tactics=element0.querySelectorAll(".gradientSunriseIcon");
                    let tactic_name=tactics[0].innerHTML
                    if (!tacticsMap.has(tactic_name)) {
                        tacticsMap.set(tactic_name, { pj: 0, g: 0,e:0,p: 0,gf:0,gc:0,diff:0});
                    }


                    let home=element0.querySelectorAll(".home-team-column.flex-grow-1");
                    let asHm= home[0].getElementsByTagName("a")
                    if (asHm[0].innerHTML.includes("<strong>")) {
                        isHome=true;
                    }

                    let away=element0.querySelectorAll(".away-team-column.flex-grow-1");
                    let as= score[0].getElementsByTagName("a");
                    let [homeGoals, awayGoals] = (as[1].innerText.split(" - ").map(Number))
                    if(isHome){
                        if(homeGoals>awayGoals){
                            let actualTactic = tacticsMap.get(tactic_name);
                            actualTactic.pj += 1;
                            actualTactic.g += 1;
                            actualTactic.gf += homeGoals;
                            actualTactic.gc += awayGoals;
                            tacticsMap.delete(tactic_name);
                            tacticsMap.set(tactic_name,actualTactic)
                        }

                        if(homeGoals<awayGoals){
                            let actualTactic = tacticsMap.get(tactic_name);
                            actualTactic.pj += 1;
                            actualTactic.p += 1;
                            actualTactic.gf += homeGoals;
                            actualTactic.gc += awayGoals;
                            tacticsMap.delete(tactic_name);
                            tacticsMap.set(tactic_name,actualTactic)
                        }

                        if(homeGoals===awayGoals){
                            let actualTactic = tacticsMap.get(tactic_name);
                            actualTactic.pj += 1;
                            actualTactic.e += 1;
                            actualTactic.gf += homeGoals;
                            actualTactic.gc += awayGoals;
                            tacticsMap.delete(tactic_name);
                            tacticsMap.set(tactic_name,actualTactic)
                        }
                    }else{


                        if(homeGoals>awayGoals){
                            let actualTactic = tacticsMap.get(tactic_name);
                            actualTactic.pj += 1;
                            actualTactic.p += 1;
                            actualTactic.gf += awayGoals;
                            actualTactic.gc += homeGoals;
                            tacticsMap.delete(tactic_name);
                            tacticsMap.set(tactic_name,actualTactic)
                        }

                        if(homeGoals<awayGoals){
                            let actualTactic = tacticsMap.get(tactic_name);
                            actualTactic.pj += 1;
                            actualTactic.g += 1;
                            actualTactic.gf += awayGoals;
                            actualTactic.gc += homeGoals;
                            tacticsMap.delete(tactic_name);
                            tacticsMap.set(tactic_name,actualTactic)
                        }

                        if(homeGoals===awayGoals){
                            let actualTactic = tacticsMap.get(tactic_name);
                            actualTactic.pj += 1;
                            actualTactic.e += 1;
                            actualTactic.gf += awayGoals;
                            actualTactic.gc += homeGoals;
                            tacticsMap.delete(tactic_name);
                            tacticsMap.set(tactic_name,actualTactic)
                        }


                    }




                }
            }
        });

        let firstTactic = tacticsMap.keys().next().value;
        if(document.getElementById("changeTactic")){
            firstTactic = document.getElementById("changeTactic").value;
        }
        if(document.getElementById("showMenu")){
            document.getElementById("showMenu").remove()
        }
        tactisResultsResume(firstTactic)
        document.getElementById("initial_date_stx").value=fechaFormateada
    }

    function tactisResultsResume(actual_tactic){
        let tables=document.getElementById("matches_sub_nav");
        let flag=false

        if(document.getElementById("selectDivTactic")){
            document.getElementById("changeTactic").innerHTML = "";
            for (let key of tacticsMap.keys()) {
                let option = document.createElement("option");
                if(actual_tactic === key){
                    option.selected=true;
                }
                option.value = key;
                option.textContent = key;
                document.getElementById("changeTactic").appendChild(option);
            }
        }


        let styleTable = " style='margin: 0 auto; display:none; text-align:center;'";
        let styleIcon = ""
        let styleSep = " style='display:none;'";
        if (GM_getValue("show_tactic_filter") === true) {
            styleTable = " style='margin: 0 auto; text-align:center;'";
            styleIcon = " active"
            styleSep = "style='padding-top:5px;'";
        }
        var txt=""
        var insertEventListeners=false;
        if(!document.getElementById("moreInfo")){

            txt += '<div id="moreInfo" class="expandable-icon' + styleIcon + '" style="margin: 0 auto; cursor:pointer; background-color:' + GM_getValue("bg_native") + ';"><div id="line1" class="line"></div><div  id="line2" class="line"></div></div></center>';
            txt+="<div id='sep' "+styleSep+"></br></div>"
            insertEventListeners=true;
        }else{
            flag=true}


        /* txt+=`
   <center>`*/
        if(!document.getElementById("selectDivTactic")){
            txt+="<div id='selectDivTactic' "+styleTable+">Tactics: <select id='changeTactic'>"
            for (let [clave, valor] of tacticsMap) {
                txt+="<option value='"+clave+"'>"+clave+"</option>"
            }
            txt+=`</select> Initial date: <input id='initial_date_stx' type='date' value='${filter_initial_date}'> Final Date: <input id='final_date_stx' type='date' value='${filter_final_date}'>
 <button class="btn-save" style="width: 6.6em; height:1.5em; padding: 0 0; color:white; background-color:rgb(228, 200, 0); font-family: 'Roboto'; font-weight:bold; font-size:revert;"
 id="filterStx"><i class="bi bi-funnel-fill" style="font-style:normal;"> Filter</i></button>`
        }

        let tableDisplay=""
        if(document.getElementById("selectDivTactic")){

            let elem = document.getElementById("selectDivTactic");

            if (window.getComputedStyle(elem).display === "none") {
                tableDisplay="display: none;"
            }
        }

        txt+=`<table id=showMenu style="margin: 0 auto; text-align:center; min-width:200px; border-collapse: collapse; margin-top: 10px; ${tableDisplay};">
  <thead style="background-color:${GM_getValue("bg_native")}; color:${GM_getValue("color_native")};"><tr>
  <th style="padding:5px; margin: 0 auto; text-align:center;">M</th>
  <th style="padding:5px; margin: 0 auto; text-align:center;">W</th>
  <th style="padding:5px; margin: 0 auto; text-align:center;">D</th>
  <th style="padding:5px; margin: 0 auto; text-align:center;">L</th>
  <th style="padding:5px; margin: 0 auto; text-align:center;">+</th>
  <th style="padding:5px; margin: 0 auto; text-align:center;">-</th>
  <th style="padding:5px; margin: 0 auto; text-align:center;">=</th>
  </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 5px; text-align:center;">${tacticsMap.get(actual_tactic).pj}</td>
      <td style="padding: 5px; text-align:center;">${tacticsMap.get(actual_tactic).g}</td>
      <td style="padding: 5px; text-align:center;">${tacticsMap.get(actual_tactic).e}</td>
      <td style="padding: 5px; text-align:center;">${tacticsMap.get(actual_tactic).p}</td>
      <td style="padding: 5px; text-align:center;">${tacticsMap.get(actual_tactic).gf}</td>
      <td style="padding: 5px; text-align:center;">${tacticsMap.get(actual_tactic).gc}</td>
      <td style="padding: 5px; text-align:center;">${tacticsMap.get(actual_tactic).gf-tacticsMap.get(actual_tactic).gc}</td>
    </tr>
    </tbody>
  </table></div></center>
`
        if(flag){
            document.getElementById("selectDivTactic").insertAdjacentHTML('afterend',txt);
        }else{
            //document.getElementById("moreInfo").insertAdjacentHTML('afterend',txt);
            tables.insertAdjacentHTML('afterend',txt);
        }

        document.getElementById("filterStx").addEventListener("click", function() {
            changeDates=false
            tactisResumeData()
            changeDates=true

        });



        document.getElementById("changeTactic").addEventListener("change", function(event) {
            let valorSeleccionado = event.target.value;
            if(document.getElementById("showMenu")){
                document.getElementById("showMenu").remove()
            }
            tactisResultsResume(valorSeleccionado)
        });

        document.getElementById("initial_date_stx").addEventListener("change", function() {
            filter_initial_date=document.getElementById("initial_date_stx").value
        });

        document.getElementById("final_date_stx").addEventListener("change", function() {
            filter_final_date=document.getElementById("final_date_stx").value
        });

        if(insertEventListeners){
            if (GM_getValue("show_tactic_filter") === true) {
                document.getElementById("line2").style.transform = 'rotateZ(0deg)';
                document.getElementById("line1").style.transform = 'rotateZ(180deg)';
                document.getElementById("moreInfo").style.transform = 'rotateZ(0deg)';
            }


            document.getElementById("moreInfo").addEventListener('click', function () {
                document.getElementById("moreInfo").classList.toggle('active');

                if (document.getElementById("moreInfo").classList.contains("active")) {
                    document.getElementById("line2").style.transform = 'rotateZ(0deg)';
                    document.getElementById("line1").style.transform = 'rotateZ(180deg)';
                    document.getElementById("moreInfo").style.transform = 'rotateZ(0deg)';
                    $('#sep').fadeIn(1);
                    $('#selectDivTactic').fadeIn('slow');
                    $('#showMenu').fadeIn('slow');
                } else {
                    document.getElementById("line2").style.transform = 'rotateZ(45deg)';
                    document.getElementById("line1").style.transform = 'rotateZ(-45deg)';
                    document.getElementById("moreInfo").style.transform = 'rotateZ(45deg)';
                    $('#sep').fadeOut('slow');
                    $('#selectDivTactic').fadeOut('slow');
                    $('#showMenu').fadeOut('slow');
                }

            });

        }



    }





    function nationalTeamPage(){
        let tables=document.getElementById("ui-tabs-1").getElementsByTagName("table");
        let primerTd = tables[0].querySelector('tr:first-child td:first-child');
        let dataTable=primerTd.getElementsByTagName("table");
        let ntName = dataTable[0].querySelector('tr:first-child td:nth-child(2)');
        let clase="loader-"+window.sport
        primerTd.innerHTML +=
            "</br>" +
            "<div id='hp_loader'>" +
            "<div style='text-align:center;'><b>Loading...</b></div>" +
            "<div id='loader' class='" + clase + "' style='height:25px'></div>" +
            "</div>";
        var national_team=ntName.innerText;
        national_team=national_team.replace("U21", "").trim();
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://statsxente.com/MZ1/Functions/tamper_detailed_teams_nt.php?currency=" + GM_getValue("currency") + "&sport=" + window.sport + "&national_team="+encodeURIComponent(national_team),
            headers: {
                "Content-Type": "application/json"
            },
            onerror: function() {
                notifySnackBarError("Detailed Teams");
            },
            onload: function (response) {

                let jsonResponse = JSON.parse(response.responseText);

                let aux=national_team

                let top="TOP 11"

                if(window.sport==="hockey"){
                    top="TOP 21"
                }

                getDeviceFormat()
                let teamTable='<div style="overflow-x: auto; width:98%; display: block;justify-content: center;align-items: center;max-height: 100%; text-align: center;">'
                let style="max-width: 100%; overflow-x: auto; display: block; width:50%;"
                if(window.stx_device==="computer"){
                    style="width:90%;"
                }
                teamTable+='<table class="matchValuesTable" style="'+style+'"><thead><tr>'
                teamTable+='<th id=thTransparent0 style="background-color:transparent; border:0;"></th>'
                teamTable+='<th style="border-top-left-radius: 5px;">Value</th>'
                teamTable+='<th >'+top+'</th>'
                teamTable+='<th>Salary</th>'
                teamTable+='<th>Age</th>'
                teamTable+='<th style="border-top-right-radius: 5px;">Players</th>'
                teamTable+='</tr></thead><tbody>'

                let valor=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor']))
                let valorLM="-"
                let valor11=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor11']))
                let elo="-"
                let edad=Number.parseFloat(jsonResponse[aux]['edad']).toFixed(2)
                let salario=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['salario']))
                let numJugs=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['numJugadores']))
                teamTable+='<tr><th style="border-bottom-left-radius: 5px; border-top-left-radius: 5px;">Top Leagues</th><td style="border-bottom:1px solid '+GM_getValue("bg_native")+';">'+valor+'</td>'
                teamTable+='<td style="border-bottom:1px solid '+GM_getValue("bg_native")+';">'+valor11+'</td>'
                teamTable+='<td style="border-bottom:1px solid '+GM_getValue("bg_native")+';">'+salario+'</td>'
                teamTable+='<td style="border-bottom:1px solid '+GM_getValue("bg_native")+';">'+edad+'</td>'
                teamTable+='<td style="border-bottom:1px solid '+GM_getValue("bg_native")+';border-right:1px solid '+GM_getValue("bg_native")+';">'+numJugs+'</td>'
                teamTable+='</tr>'
                teamTable+='</tbody></table>'

                //TABLA 2
                teamTable+='</br><table id=tableElo class="matchValuesTable" style="'+style+'"><thead><tr>'
                teamTable+='<th id=thTransparent1 style="background-color:red; border:0;"></th>'
                teamTable+='<th style="border-top-left-radius: 5px;">LM Value</th>'
                teamTable+='<th>ELO</th>'
                teamTable+='<th style="border-top-right-radius: 5px;">ELO Pos</th>'
                teamTable+='</tr></thead><tbody>'

                valorLM=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valorLM']))
                elo=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['elo']))
                teamTable+='<tr><th style="border-top-left-radius: 5px;">Senior</th>'
                teamTable+='<td style=" '+GM_getValue("bg_native")+';">'+valorLM+'</td>'
                teamTable+='<td style="'+GM_getValue("bg_native")+';">'+elo+'</td>'
                teamTable+='<td style="'+GM_getValue("bg_native")+'; border-right:1px solid '+GM_getValue("bg_native")+';">'+jsonResponse[aux]['elo_pos']+'</td>'
                teamTable+='</tr>'


                teamTable+='</td></tr>'




                valorLM=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valorLM21']))
                elo=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['elo21']))
                teamTable+='<tr><th style="border-bottom-left-radius: 5px;">U21</th>'
                teamTable+='<td style=" '+GM_getValue("bg_native")+'; border-bottom:1px solid '+GM_getValue("bg_native")+';">'+valorLM+'</td>'
                teamTable+='<td style="'+GM_getValue("bg_native")+'; border-bottom:1px solid '+GM_getValue("bg_native")+';">'+elo+'</td>'
                teamTable+='<td style="'+GM_getValue("bg_native")+'; border-bottom:1px solid '+GM_getValue("bg_native")+'; border-right:1px solid '+GM_getValue("bg_native")+';">'+jsonResponse[aux]['elo21_pos']+'</td>'
                teamTable+='</tr>'


                teamTable+='<tr><td colspan=10><span style="font-size:smaller;">The LM Value and ELO data refer to the national teams, while the other values are aggregates from the Top Division to Div1.3</span></td></tr>'
                teamTable+='<tr><td colspan=10>'
                teamTable+='<button class="btn-save" style="color:'+GM_getValue("color_native")+'; background-color:'+GM_getValue("bg_native")
                teamTable+='; font-family: \'Roboto\'; font-weight:bold; font-size:revert;" id="eloHistoryButton"><i class="bi bi-clock-history"'
                teamTable+=' style="font-style:normal;"> ELO History</i></button>'


                teamTable+='&nbsp;<button class="btn-save" style="color:'+GM_getValue("color_native")+'; background-color:'+GM_getValue("bg_native")
                teamTable+='; font-family: \'Roboto\'; font-weight:bold; font-size:revert; width:9em;" id="leaguesMapButton"><i class="bi bi-geo-alt"'
                teamTable+=' style="font-style:normal;"> Leagues Map</i></button>'

                teamTable+='&nbsp;<button class="btn-save" style="color:'+GM_getValue("color_native")+'; background-color:'+GM_getValue("bg_native")
                teamTable+='; font-family: \'Roboto\'; font-weight:bold; font-size:revert; width:9em;" id="eloMapButton"><i class="bi bi-geo"'
                teamTable+=' style="font-style:normal;"> ELO Map</i></button>'

                teamTable+='</td></tr>'
                teamTable+='</tbody></table></div>'


                // let divToInserT=document.getElementById("streakAndCupInfo")
                let primerTd = tables[0].querySelector('tr:first-child td:first-child');
                primerTd.innerHTML+=teamTable

                document.getElementById("hp_loader").remove()

                let color=GM_getValue("bg_native")
                let darkerColor = darkenColor(color, 25);

                document.styleSheets[0].insertRule(
                    '.btn-save:hover { background-color: '+darkerColor+' !important; }',
                    document.styleSheets[0].cssRules.length
                );


                document.getElementById("eloHistoryButton").addEventListener('click', function () {
                    let link = "https://statsxente.com/MZ1/Functions/graphLoader.php?graph=elo_history_nt&national_team=" + national_team+"&sport=" + window.sport
                    openWindow(link, 0.95, 1.25);
                });

                document.getElementById("leaguesMapButton").addEventListener('click', function () {
                    let path="lecturaGraficoPaises"
                    if(window.sport==="hockey"){
                        path="lecturaGraficoPaisesHockey"

                    }
                    let link = "https://statsxente.com/MZ1/Functions/"+path+".php?tamper=yes&region=world&id=0&idioma="+window.lang
                    openWindow(link, 0.95, 1.25);
                });


                document.getElementById("eloMapButton").addEventListener('click', function () {
                    let path="lecturaGraficoPaises"
                    if(window.sport==="hockey"){
                        path="lecturaGraficoPaisesHockey"

                    }
                    let link = "https://statsxente.com/MZ1/Functions/"+path+".php?by_elo=yes&tamper=yes&region=world&id=0&idioma="+window.lang
                    openWindow(link, 0.95, 1.25);
                });





                const thElements = document.querySelectorAll('table.matchValuesTable th');
                thElements.forEach(th => {
                    th.style.backgroundColor = GM_getValue("bg_native");
                    th.style.color = GM_getValue("color_native");
                });
                document.getElementById("thTransparent0").style.backgroundColor="transparent";
                document.getElementById("thTransparent1").style.backgroundColor="transparent";
            }
        });

    }


//BUTTONS EVENTS LISTENERS
    const urlParams = new URLSearchParams(window.location.search);
    if ((urlParams.get('p') === 'friendlyseries')||(urlParams.get('p') === 'federations')){
        waitToDOMById(tableFLAndClashEventListener,"ui-id-2",5000)
    }

    if ((urlParams.get('p') === 'cup')||(urlParams.get('p') === 'private_cup')){
        waitToDOMById(tableCupsEventListener,"ui-id-4",5000)
    }
    waitToDOMById(tableLeaguesEventListener,"league_tab_table",5000)


    function scoutReportEventListeners(){
        document.querySelectorAll('.player_icon_placeholder.scout_report')
            .forEach(element => {
                element.addEventListener('click', function () {
                    let countsMap = new Map();
                    setTimeout(() => {
                        let starsSpans = document.querySelectorAll('span.stars');
                        starsSpans.forEach((span, index) => {
                            let is = span.querySelectorAll('i.fa.fa-star.fa-2x.lit');
                            countsMap.set(index, is.length);
                        });
                        let dl = document.querySelector('dl');
                        let dd = document.createElement('dd');
                        dd.style.display = 'block';
                        dd.style.justifyContent = 'center';
                        dd.style.alignItems = 'center';
                        dd.innerHTML = `
  <button class="btn-save" id="showScout" style="
    display: block;
    align-items: center;
    justify-content: center;
    gap: 0.4em;
    width: 25em;
    height: 1.75em;
    padding: 0 10px;
    color: white;
    background-color: rgb(228, 200, 0);
    font-family: 'Roboto',serif;
    font-weight: bold;
    font-size: revert;
    border: none;
    cursor: pointer;
    border-radius: 3px;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
  ">
    <img src="https://statsxente.com/MZ1/View/Images/main_icon.png" width="15" height="15" alt="icon">
    <span>Scout Analysis</span>
  </button>

`;

                        if (dl) {
                            dl.appendChild(dd);
                        }
                        let btn = document.getElementById('showScout');
                        btn.addEventListener('click', () => {
                            let link="https://statsxente.com/MZ1/View/scoutReportAnalyzer.php?tamper=yes&sport="+window.sport+"&maxStar="+countsMap.get(0)+"&minStar="+countsMap.get(1)+"&sp="+countsMap.get(2);
                            openWindow(link, 0.95, 1.25);
                        });





                    }, 1000);


                });
            });
    }

    function profilePage(){
        let elems=document.getElementsByClassName("flex-wrap");
        let tables=elems[0].getElementsByTagName("table");
        let segundoTr = tables[1].rows[0]
        let username = segundoTr.cells[1].innerText
        var html='<fieldset class="grouping"><legend>ELO Data</legend><div id=streakAndCupInfo></div></fieldset>'
        elems[0].insertAdjacentHTML("afterend",html);

        let divToInserT=document.getElementById("streakAndCupInfo")
        let clase="loader-"+window.sport
        divToInserT.innerHTML =
            "</br>" +
            "<center><div id='hp_loader'>" +
            "<div style='text-align:center;'><b>Loading...</b></div>" +
            "<div id='loader' class='" + clase + "' style='height:25px; width:50%;'></div>" +
            "</div></center>" +
            divToInserT.innerHTML;
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://statsxente.com/MZ1/Functions/tamper_detailed_teams.php?currency=" + GM_getValue("currency") + "&sport=" + window.sport + "&username="+username,
            headers: {
                "Content-Type": "application/json"
            },
            onerror: function(err) {
                notifySnackBarError("Detailed Teams");
            },
            onload: function (response) {
                let jsonResponse = JSON.parse(response.responseText);
                let aux=jsonResponse["username"]
                let top="TOP 11"
                let team_id=jsonResponse["username"]
                let team_name=jsonResponse["team_name"]

                if(window.sport==="hockey"){
                    top="TOP 21"
                }

                getDeviceFormat()
                let teamTable='<div style="width:100%; display: block;justify-content: center;align-items: center;max-height: 100%; text-align: center;">'
                let style="max-width: 100%; overflow-x: auto; display: block; width:100%;"
                let style2=""
                if(window.stx_device==="computer"){
                    style=""
                    style2="<center>"
                }
                teamTable+=  style2+'<table class="matchValuesTable" style="'+style+'"><thead><tr>'
                teamTable+='<th id=thTransparent0 style="background-color:transparent; border:0;"></th>'
                teamTable+='<th style="border-top-left-radius: 5px;">Value</th><th>LM Value</th>'
                teamTable+='<th >'+top+'</th><th>ELO</th>'
                teamTable+='<th>ELO Pos</th>'
                teamTable+='<th>Age</th>'
                teamTable+='<th>Salary</th>'
                teamTable+='<th>Players</th>'
                teamTable+='<th style="border-top-right-radius: 5px;"></th>'
                teamTable+='</tr></thead><tbody>'
                let valor=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor']))
                let valorLM=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valorUPSenior']))
                let valor11=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor11']))
                let elo=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['elo']))
                let edad= Number.parseFloat(jsonResponse[aux]['edad']).toFixed(2)
                let salario=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['salario']))
                let numJugs=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['numJugadores']))
                teamTable+='<tr><th style="border-top-left-radius: 5px;">Senior</th><td>'+valor+'</td><td>'+valorLM+'</td><td>'+valor11+'</td><td>'+elo+'</td>'
                teamTable+='<td>'+jsonResponse[aux]['elo_pos']+'</td><td>'+edad+'</td><td>'+salario+'</td>'
                teamTable+='<td>'+numJugs+'</td>'
                teamTable+='<td style="border-right:1px solid '+GM_getValue("bg_native")+';">'
                teamTable+='<img alt="" style="cursor:pointer;" id="seniorButton" src="https://statsxente.com/MZ1/View/Images/detail.png" width="20px" height="20px"/>'

                teamTable+='</td></tr>'

                valor=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor23']))
                valorLM=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valorUPSUB23']))
                valor11=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor11_23']))
                elo=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['elo23']))
                edad=Number.parseFloat(jsonResponse[aux]['age23']).toFixed(2)
                salario=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['salary23']))
                numJugs=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['players23']))
                teamTable+='<tr><th>U23</th><td>'+valor+'</td><td>'+valorLM+'</td><td>'+valor11+'</td><td>'+elo+'</td>'
                teamTable+='<td>'+jsonResponse[aux]['elo23_pos']+'</td><td>'+edad+'</td><td>'+salario+'</td>'
                teamTable+='<td>'+numJugs+'</td>'
                teamTable+='<td style="border-right:1px solid '+GM_getValue("bg_native")+';">'
                teamTable+='<img alt="" style="cursor:pointer;" id="sub23Button" src="https://statsxente.com/MZ1/View/Images/detail.png" width="20px" height="20px"/>'
                teamTable+='</td></tr>'



                valor=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor21']))
                valorLM=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valorUPSUB21']))
                valor11=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor11_21']))
                elo=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['elo21']))
                edad=Number.parseFloat(jsonResponse[aux]['age21']).toFixed(2)
                salario=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['salary21']))
                numJugs=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['players21']))
                teamTable+='<tr><th>U21</th><td>'+valor+'</td><td>'+valorLM+'</td><td>'+valor11+'</td><td>'+elo+'</td>'
                teamTable+='<td>'+jsonResponse[aux]['elo21_pos']+'</td><td>'+edad+'</td><td>'+salario+'</td>'
                teamTable+='<td>'+numJugs+'</td>'
                teamTable+='<td style="border-right:1px solid '+GM_getValue("bg_native")+';">'
                teamTable+='<img alt="" style="cursor:pointer;" id="sub21Button" src="https://statsxente.com/MZ1/View/Images/detail.png" width="20px" height="20px"/>'
                teamTable+='</td></tr>'




                valor=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor18']))
                valorLM=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valorUPSUB18']))
                valor11=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor11_18']))
                elo=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['elo18']))
                edad=Number.parseFloat(jsonResponse[aux]['age18']).toFixed(2)
                salario=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['salary18']))
                numJugs=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['players18']))
                teamTable+='<tr><th style="border-bottom-left-radius: 5px;">U18</th><td style="border-bottom:1px solid '+GM_getValue("bg_native")+';">'+valor+'</td>'
                teamTable+='<td style="border-bottom:1px solid '+GM_getValue("bg_native")+';">'+valorLM+'</td>'
                teamTable+='<td style="border-bottom:1px solid '+GM_getValue("bg_native")+';">'+valor11+'</td>'
                teamTable+='<td style="border-bottom:1px solid '+GM_getValue("bg_native")+';">'+elo+'</td>'
                teamTable+='<td style="border-bottom:1px solid '+GM_getValue("bg_native")+';">'+jsonResponse[aux]['elo18_pos']+'</td>'
                teamTable+='<td style="border-bottom:1px solid '+GM_getValue("bg_native")+';">'+edad+'</td><td style="border-bottom:1px solid '+GM_getValue("bg_native")+';">'+salario+'</td>'
                teamTable+='<td style="border-bottom:1px solid '+GM_getValue("bg_native")+';">'+numJugs+'</td>'
                teamTable+='<td style="border-radius: 0 0 10px 0; border-bottom:1px solid '+GM_getValue("bg_native")+'; border-right:1px solid '+GM_getValue("bg_native")+';">'
                teamTable+='<img alt="" style="cursor:pointer;" id="sub18Button" src="https://statsxente.com/MZ1/View/Images/detail.png" width="20px" height="20px"/>'
                teamTable+='</td></tr>'
                teamTable+='<tr><td colspan=10>'
                teamTable+='<button class="btn-save" style="color:'+GM_getValue("color_native")+'; background-color:'+GM_getValue("bg_native")
                teamTable+='; font-family: \'Roboto\'; font-weight:bold; font-size:revert;" id="eloHistoryButton"><i class="bi bi-clock-history"'
                teamTable+=' style="font-style:normal;"> ELO History</i></button></tr>'
                teamTable+='</tbody></table></div>'


                let divToInserT=document.getElementById("streakAndCupInfo")
                divToInserT.innerHTML=teamTable+divToInserT.innerHTML

                document.getElementById("hp_loader").remove()

                let color=GM_getValue("bg_native")
                let darkerColor = darkenColor(color, 25);

                document.styleSheets[0].insertRule(
                    '.btn-save:hover { background-color: '+darkerColor+' !important; }',
                    document.styleSheets[0].cssRules.length
                );


                document.getElementById("eloHistoryButton").addEventListener('click', function () {
                    let link = "https://statsxente.com/MZ1/Functions/graphLoader.php?graph=elo_history&team_id=" + team_id+"&sport=" + window.sport
                    openWindow(link, 0.95, 1.25);
                });



                document.getElementById("seniorButton").addEventListener('click', function () {
                    let link = "https://www.statsxente.com/MZ1/Functions/tamper_teams_stats.php?team_id=" + team_id +
                        "&category=senior&elo_category=SENIOR&sport=" + window.sport+ "&idioma=" + window.lang+"&team_name="
                        +team_name+"&divisa=" + GM_getValue("currency")
                    openWindow(link, 0.95, 1.25);
                });
                document.getElementById("sub23Button").addEventListener('click', function () {
                    let link = "https://www.statsxente.com/MZ1/Functions/tamper_teams_stats.php?team_id=" + team_id +
                        "&category=SUB23&elo_category=U23&sport=" + window.sport+ "&idioma=" + window.lang+"&team_name="
                        +team_name+"&divisa=" + GM_getValue("currency")
                    openWindow(link, 0.95, 1.25);
                });

                document.getElementById("sub21Button").addEventListener('click', function () {
                    let link = "https://www.statsxente.com/MZ1/Functions/tamper_teams_stats.php?team_id=" + team_id +
                        "&category=SUB21&elo_category=U21&sport=" + window.sport+ "&idioma=" + window.lang+"&team_name="
                        +team_name+"&divisa=" + GM_getValue("currency")
                    openWindow(link, 0.95, 1.25);
                });


                document.getElementById("sub18Button").addEventListener('click', function () {
                    let link = "https://www.statsxente.com/MZ1/Functions/tamper_teams_stats.php?team_id=" + team_id +
                        "&category=SUB18&elo_category=U18&sport=" + window.sport+ "&idioma=" + window.lang+"&team_name="
                        +team_name+"&divisa=" + GM_getValue("currency")
                    openWindow(link, 0.95, 1.25);
                });



                const thElements = document.querySelectorAll('table.matchValuesTable th');
                thElements.forEach(th => {
                    th.style.backgroundColor = GM_getValue("bg_native");
                    th.style.color = GM_getValue("color_native");
                });
                document.getElementById("thTransparent0").style.backgroundColor="transparent";
            }
        });



    }

    function statsPageEventListeners(){

        let mainDiv = document.querySelectorAll('.statsTabs');
        let uls = mainDiv[0].querySelectorAll('ul');
        let lis = uls[0].querySelectorAll('li');

        lis.forEach(li => {
            li.addEventListener('click', () => {
                setTimeout(function() {
                    statsPage()
                }, 1000);

            });
        });

    }

    function tableLeaguesEventListener(){
        document.getElementById("league_tab_table").addEventListener('click', function () {
            if (document.getElementById("showMenu") === null) {
                waitToDOM(leagues, ".nice_table", 0,7000)
            }
        });

    }

    function tableCupsEventListener(){
        document.getElementById("ui-id-4").parentNode.addEventListener('click', function () {
            if (document.getElementById("showMenu") === null) {
                if(GM_getValue("cupFlag")){
                    waitToDOM(friendlyCupsAndLeagues, ".nice_table", 0,7000)
                }
            }


            viewButtonCupsEventListener()


        });


    }

    function viewButtonCupsEventListener(){
        document.addEventListener('click', function(event) {
            if ((event.target) &&((event.target.parentNode.id === 'view_btn')||(event.target.parentNode.parentNode.id === 'view_btn'))) {
                setTimeout(function () {
                    if (document.getElementById("showMenu") === null) {
                        if(GM_getValue("cupFlag")){
                            if(!document.getElementById("showMenu")){
                                waitToDOM(friendlyCupsAndLeagues, ".nice_table", 0,7000)
                            }
                        }
                    }
                }, 1000);
            }
        });

    }

    function tableFLAndClashEventListener(){
        document.getElementById("ui-id-2").parentNode.addEventListener('click', function () {
            if (document.getElementById("showMenu") === null) {
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.get('fsid')) {
                    if(GM_getValue("flFlag")){
                        waitToDOM(friendlyCupsAndLeagues, ".nice_table", 0,7000)
                    }
                } else {
                    waitToDOM(clashLeagues, ".nice_table", 0,7000)
                }

            }
        });
    }

    async function showTopScorersData(button_id_el){

        let flagShow = true
        let idComp="null"
        if (button_id_el === "ui-id-4") {
            fl_data = await fetchExistsFL(urlParams.get('fsid'))
            idComp = fl_data['id']
            if (idComp === "null") {
                flagShow = false
            }
        }
        if(flagShow){
            let minValueText=" Min Goals:"
            if(window.sport==="hockey"){minValueText=" Min Time:"}
            let posSelect=GM_getValue("posSelect_"+window.sport)
            let stats_select=GM_getValue("statsSelect_"+window.sport)
            let min_values=GM_getValue("minValues")
            let sortSelect = '<select style="width: 4.5em;" id="sortValue"><option value="DESC">Desc</option><option value="ASC">Asc</option></select>';

            let txt = 'Sort: ' + sortSelect + 'Pos: ' + posSelect
            txt+=' Matches: <input style="width:2.25em;" type="text" id="pj" value="0" placeholder="Minimium matches" data-np-intersection-state="visible"> '
            txt+=' <span id="minValueText">'+minValueText+'</span> <input style="width:2.25em;" type="text" id="minValue" value="0" placeholder="Minimium matches" data-np-intersection-state="visible"> '
            txt+='Stats:'+ stats_select + ' Teams:'
            let ri = document.getElementsByClassName("floatRight")
            let selects = ri[1].querySelectorAll("select");

            let li = document.getElementsByClassName("floatLeft")
            let spans = ri[1].querySelectorAll("span");

            let clone = spans[0].cloneNode(true);
            li[0].appendChild(clone);
            //spans[0].remove();

            let select = selects[0]
            select.style.width = "10em"
            select.querySelectorAll("option").forEach(option => {
                option.removeAttribute("selected");
            });

            const nuevoOption = document.createElement("option");
            nuevoOption.textContent = "All"; // Texto visible
            nuevoOption.value = "-1"; // Valor del option
            nuevoOption.selected = true;

            select.insertBefore(nuevoOption, select.firstChild);
            select.selectedIndex = 1;
            select.dispatchEvent(new Event('change'));
            select.selectedIndex = 0;
            select.dispatchEvent(new Event('change'));


            spans[0].insertAdjacentHTML("beforebegin", '<button class="btn-save" style="width: 6.6em; height:1.75em; padding: 0 0; color:' + GM_getValue("color_native") + '; background-color:' + GM_getValue("bg_native") + '; font-family: \'Roboto\'; font-weight:bold; font-size:revert;" id="showStats"><i class="bi bi-bar-chart-fill" style="font-style:normal;"> Show Stats</i></button>');
            spans[0].remove();
            ri[1].innerHTML = txt + ri[1].innerHTML

            let tables = document.getElementsByClassName("hitlist hitlist-compact-list-included tablesorter marker")
            let table = tables[0]



            document.getElementById('valor').addEventListener('change', function(e) {
                document.getElementById("minValueText").innerText=" Min "+min_values[e.target.value]+":"
            });


            document.getElementById("showStats").addEventListener('click', function () {
                let texto = select.id;
                let idSelect = select.id
                let parts = texto.split("_");
                let league_id = parts[parts.length - 1];
                if (idComp !== "null") {
                    league_id=idComp
                }
                let selectValor = document.getElementById("valor");
                let selectedValue = selectValor.value;
                let urlParams = new URLSearchParams(window.location.search);

                let typeKey
                if (urlParams.has('type')) {
                    typeKey = urlParams.get("type")
                } else {
                    typeKey = "friendlyseries"
                }


                let txt = "https://statsxente.com/MZ1/Functions/tamper_player_stats_records.php?table=" + statsKeys[typeKey+"_"+window.sport] + "&pj=" + document.getElementById("pj").value + "&idLiga=" + league_id +
                    "&valor=" + encodeURIComponent(selectedValue) + "&equipo=" + document.getElementById(idSelect).value + "&categoria=" + cats_stats[typeKey]
                    + "&ord="+document.getElementById("sortValue").value+"&posicion=" + document.getElementById("positionValue").value+"&minValue="+document.getElementById("minValue").value;
                let keyValue = selectValor.options[selectValor.selectedIndex].text;
                let teamId = document.getElementById(idSelect).value
                let ris = document.getElementsByClassName("floatRight")
                let clase = "loader-" + window.sport
                ris[1].insertAdjacentHTML("afterend", "<div id='hp_loader'></br></br></br><div style='width:50%; margin: 0 auto; text-align: center;'><b>Loading...</b><div id='loader' class='" + clase + "' style='height:25px'></div></div></div>");
                playerStatsOnTopScores(table, txt, selectedValue, keyValue, teamId)

            });
        }
    }

    function topScorersTableEventListener() {
        if (!document.getElementById('showStats')) {
            let button_id_el="none"
            if (document.getElementById("league_tab_top_scorers")) {
                button_id_el="league_tab_top_scorers"
            } else {
                button_id_el="ui-id-4"
            }
            document.getElementById(button_id_el).addEventListener('click',function () {

                waitToDOMArgs(showTopScorersData, ".hitlist.hitlist-compact-list-included.tablesorter.marker", 0,7000,button_id_el)
            });

        }

    }

    function cupsListEventListener(){
        document.getElementById("ui-id-3").parentNode.addEventListener('click', function () {
            if (document.getElementById("showMenu") === null) {
                waitToDOM(showCountriesAndTeamIds, ".hitlist.hitlist-compact-list-included", 0,7000)

            }

        });
    }


//Workers
    const workerCode = `
self.onmessage = function (e) {
    const { elementos, sport, skillsNames, tacticsList, flagStats } = e.data;
    let players = [];
    let lines = [];
    let gk_line = "";
    let su_line = "";

    // Procesar cada elemento
    for (let i = 0; i < elementos.length; i++) {
        let playerValues = {
            id: elementos[i].id,
            skills: [],
            lines: [],
            tacticsPosition: {},
            tactics: [],
            age: parseInt(elementos[i].age),
        };

        // Procesar tácticas y líneas
        for (let j = 0; j < elementos[i].tactics.length; j++) {
            const tactic = elementos[i].tactics[j].name;
            const line = elementos[i].tactics[j].line;

            if(sport=="soccer"){
            if (line.includes(",")) {
                                var fin = line.indexOf(',');
                                su_line = line.substring(0, fin);
                            }


            }


            playerValues.tactics.push(tactic);
            playerValues.tacticsPosition[tactic] = line;

            // Usar un Set para evitar líneas duplicadas
            if (!lines.includes(line)) {
                lines.push(line);
                playerValues.lines.push(line);
            }
        }
        var key=0;
        if(sport=="soccer"){
        key=1;
        }

        // Procesar habilidades
        for (let j = 0; j < elementos[i].skills.length-key; j++) {
            playerValues.skills.push(elementos[i].skills[j]);
        }

        players.push(playerValues);
    }

    // Enviar datos procesados al hilo principal
    self.postMessage({ players:players, lines: [...new Set(lines)], gk_line:gk_line, su_line:su_line, tacticsList: [...new Set(tacticsList)], skillsNames:skillsNames });
};
`;


//Match Predictor
    function matchPredictor(){
        getDeviceFormat()
        let elementos = document.querySelectorAll('.match-predictor-wrapper');
        if(elementos.length>0) {
            let tables = elementos[0].querySelectorAll('.hitlist.match-list');
            if(tables.length>0) {
                let filas = tables[0].querySelectorAll('table tr');
                let linkIds = ""
                let contIds = 0

                filas.forEach(fila => {
                    let primerTd = fila.querySelector('td');
                    if (primerTd) {
                        let enlace = primerTd.querySelector('a');
                        if (enlace) {
                            let urlObj = new URL(enlace.href);
                            let params = new URLSearchParams(urlObj.search);
                            let midValue = params.get('mid');
                            linkIds += "&idPartido" + contIds + "=" + midValue
                            contIds++
                            let clase = "loader-" + window.sport
                            primerTd.innerHTML += "</br><div id='hp_loader" + midValue + "'><div id='loader' class='" + clase + "' style='width:8em; height:1.5em;'></div>"


                        }
                    }
                });

                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://statsxente.com/MZ1/Functions/tamper_elo_predictor_nt.php?currency=" + GM_getValue("currency") + "&sport=" + window.sport + linkIds,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    onerror: function() {
                        notifySnackBarError("Predictor Event");
                    },
                    onload: function (response) {
                        let jsonResponse = JSON.parse(response.responseText);
                        filas.forEach(fila => {
                            let primerTd = fila.querySelector('td');
                            if (primerTd) {
                                let enlace = primerTd.querySelector('a');
                                if (enlace) {
                                    let urlObj = new URL(enlace.href);
                                    let params = new URLSearchParams(urlObj.search);
                                    let midValue = params.get('mid');
                                    let elo_home = new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[midValue]['elo_home']))
                                    let elo_away = new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[midValue]['elo_away']))
                                    let lm_home
                                    let lm_away
                                    if (window.stx_device === "computer") {
                                        lm_home = new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[midValue]['lm_home']))
                                        lm_away = new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[midValue]['lm_away']))
                                    } else {
                                        lm_home = Math.round(jsonResponse[midValue]['lm_home'] / 1_000_000) + "M";
                                        lm_away = Math.round(jsonResponse[midValue]['lm_away'] / 1_000_000) + "M";
                                    }
                                    primerTd.innerHTML += "<b>ELO:</b> " + elo_home + " - " + elo_away + "</br><b>LMV:</b> " + lm_home + " - " + lm_away
                                    document.getElementById("hp_loader" + midValue).remove();

                                }
                            }
                        });


                    }
                });
            }
        }
    }
//Shot ids and countries on cups lists
    function showCountriesAndTeamIds(){
        let elements = document.querySelectorAll('.ui-tabs-nav.ui-helper-reset.ui-helper-clearfix.ui-widget-header.ui-corner-all');
        let secondUl = elements[1];
        let newLi = document.createElement('li');
        newLi.innerHTML = '<button class="btn-save" style="margin-top: 3px; width: 6.6em; height:1.75em; padding: 0 0; color:' + GM_getValue("color_native") +'; background-color:' + GM_getValue("bg_native")+' ;font-family: Roboto; font-weight:bold; font-size:revert;" id="showData"><i class="bi bi-plus-circle" style="font-style:normal;"> Show More</i></button>';
        secondUl.appendChild(newLi);

        document.getElementById("showData").parentNode.addEventListener('click', function () {
            let aElement = document.querySelector('a[href="#joined_cups"]')
            var table_id=1;
            var cols_default=4
            if (aElement) {
                let parentLi = aElement.closest('li'); // Busca el li más cercano padre
                if (parentLi && parentLi.classList.contains('ui-tabs-active')) {
                    table_id=0
                    cols_default=5
                }
            }

            let tables = document.querySelectorAll('.hitlist.hitlist-compact-list-included');
            if(tables[table_id].rows[0].cells.length>cols_default){

                let lastColIndex = tables[table_id].rows[0].cells.length - 1;
                for (let row of tables[table_id].rows) {
                    if (row.cells.length > lastColIndex) {
                        row.deleteCell(lastColIndex);
                    }
                }
                lastColIndex = tables[table_id].rows[0].cells.length - 1;
                for (let row of tables[table_id].rows) {
                    if (row.cells.length > lastColIndex) {
                        row.deleteCell(lastColIndex);
                    }
                }

            }

            let cont=0;
            tables[table_id].querySelectorAll('tr').forEach(row => {
                let tds = row.querySelectorAll('td');
                let newCell = document.createElement('td'); // Crear una nueva celda
                if(cont===0){
                    newCell.textContent = 'Team ID';
                }else{
                    let team_data=extractTeamData(tds[3].getElementsByTagName("a"));
                    let team_id_search=team_data[0]
                    newCell.textContent = team_id_search;
                }
                row.appendChild(newCell);
                cont++
            });

            //Country
            cont=0;
            tables[table_id].querySelectorAll('tr').forEach(row => {
                let tds = row.querySelectorAll('td');

                let newCell = document.createElement('td'); // Crear una nueva celda
                if(cont==0){
                    newCell.textContent = 'Country';
                }else{
                    let team_data=extractTeamData(tds[3].getElementsByTagName("a"));
                    let team_id_search=team_data[0]
                    let imgs=tds[3].querySelectorAll('img')

                    let clase = "loader-" + window.sport
                    var loader="<div id='hp_loader'></br><div style='width:50%; margin: 0 auto; text-align: center;'><div id='loader' class='" + clase + "' style='height:15px'></div></div></div>";


                    newCell.innerHTML = loader;


                    new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: "https://www.managerzone.com/xml/manager_data.php?sport_id=" + window.sport_id + "&team_id="+team_id_search,
                            headers: {
                                "Content-Type": "application/json"
                            },
                            onload: function (response) {
                                let parser = new DOMParser();
                                let xmlDoc = parser.parseFromString(response.responseText, "text/xml");
                                let userData = xmlDoc.getElementsByTagName("UserData");
                                resolve(userData[0].getAttribute("countryShortname"));

                            },
                            onerror: function () {
                                notifySnackBarError("Manager Data");
                                reject("none");
                            }
                        });
                    }).then(teamCountry => {
                        if(imgs.length===0){
                            let flag='<img title="España" src="img/flags/12/'+teamCountry.toLowerCase()+'.png" width="12" height="12" style="border: none" alt="">'
                            let spans=tds[3].querySelectorAll('span')
                            spans[0].innerHTML=flag+" "+spans[0].innerHTML
                        }
                        newCell.textContent = teamCountry.toLowerCase(); // Aquí insertas el valor recibido
                    }).catch(()=>{newCell.textContent = 'Error';});
                }




                row.appendChild(newCell);
                cont++
            });






        });

    }
//Stats Page
    function statsPage(){
        let elemento = document.getElementById('showGrafStats');
        if (elemento) {
            elemento.remove();
        }

        let team_id=""
        let urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('tid')){
            team_id=urlParams.get("tid")
        }else{

            if(window.sport==="soccer"){
                if ((GM_getValue("soccer_team_id") === undefined) || (GM_getValue("soccer_team_id") === "")){
                    let div=document.getElementById("infoAboutTeam")
                    let dds=div.getElementsByTagName("dd")
                    let spans=dds[0].getElementsByTagName("span")
                    let raw_id=spans[2].innerText
                    let id=raw_id.replace(')', '')
                    id=id.replace('(', '')
                    GM_setValue("soccer_team_id",id)
                }
                team_id=GM_getValue("soccer_team_id")
            }else{
                if ((GM_getValue("hockey_team_id") === undefined) || (GM_getValue("hockey_team_id") === "")){
                    let div=document.getElementById("infoAboutTeam")
                    let dds=div.getElementsByTagName("dd")
                    let spans=dds[0].getElementsByTagName("span")
                    let raw_id=spans[2].innerText
                    let id=raw_id.replace(')', '')
                    id=id.replace('(', '')
                    GM_setValue("hockey_team_id",id)
                }
                team_id=GM_getValue("hockey_team_id")
            }

        }

        if (!document.getElementById('eloReviewTable')) {
            let clase="loader-"+window.sport
            let divLoader =
                "</br>" +
                "<div id='hp_loader' style='text-align:center; margin: 0 auto; width:50%;'>" +
                "<div style='text-align:center;'><b>Loading...</b></div>" +
                "<div id='loader' class='" + clase + "' style='height:25px'></div>" +
                "</div>";
            document.getElementById("statsTabs-1").insertAdjacentHTML("beforebegin",divLoader);
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://statsxente.com/MZ1/Functions/tamper_elo_review.php?sport=" + window.sport + "&team_id="+team_id,
                headers: {
                    "Content-Type": "application/json"
                },
                onerror: function(err) {
                    notifySnackBarError("ELO Review");
                },
                onload: function (response) {
                    let jsonResponse = JSON.parse(response.responseText);
                    let thStyle="style='background-color: "+GM_getValue("bg_native")+"; color: "+GM_getValue("color_native")+";'"
                    let thStyleLeft="style='background-color: "+GM_getValue("bg_native")+"; color: "+GM_getValue("color_native")+"; text-align:left;'"
                    let table='<br><h3>ELO Review</h3>'
                    let style='max-width: 100%; overflow-x: auto; display: block; width:100%;'
                    let style2=""
                    getDeviceFormat()
                    if(window.stx_device==="computer"){
                        style="width:65%;"
                        style2="<center>"
                    }
                    table+='<div style="display: block;justify-content: center;align-items: center;max-height: 100%; text-align: center;">'

                    table+=style2+'<table id="eloReviewTable" class="matchValuesTable" style="'+style+' background-color: transparent;'
                    table+=' border: 0px; color: '+GM_getValue("color_native")+'; margin: 5px 0;"><thead><tr>'
                    table+='<th id=thTransparent0 style="background-color:transparent; border:0;"></th>'
                    table+="<th style='border-top-left-radius: 5px; background-color: "+GM_getValue("bg_native")+"; color: "+GM_getValue("color_native")+";'>Min</th><th "+thStyle+">Avg</th><th  "+thStyle+">Max</th>"
                    table+="<th  style='background-color: "+GM_getValue("bg_native")+"; color: "+GM_getValue("color_native")+"; text-align:left;'>ELO</th>"
                    table+="<th  style='background-color: "+GM_getValue("bg_native")+"; color: "+GM_getValue("color_native")+"; text-align:left;'>ELO Pos</th>"
                    table+="<th  "+thStyleLeft+">Change Week</th><th  "+thStyleLeft+">Change Month</th>"
                    table+="<th style='border-top-right-radius: 5px; background-color: "+GM_getValue("bg_native")+"; color: "+GM_getValue("color_native")+"; text-align:left;'>Change Year</th>"
                    // table+="<th style='background-color: "+GM_getValue("bg_native")+"; color: "+GM_getValue("color_native")+"; text-align:left;'>ELO</th>"
                    // table+="<th style='border-top-right-radius: 5px; background-color: "+GM_getValue("bg_native")+"; color: "+GM_getValue("color_native")+"; text-align:center;'>ELO Pos</th>"
                    table+="</tr></thead>"
                    table+="<tbody><tr>"

                    let lista=["senior","U23","U21","U18"];
                    for (let i = 0; i < lista.length; i++) {
                        var tmp_cat=lista[i]
                        var bottomStyle=""
                        if(i===0){
                            table+="<th style='border-top-left-radius: 5px; background-color: "+GM_getValue("bg_native")+"; color: "+GM_getValue("color_native")+";'>Senior</th>"
                        }else{
                            if(tmp_cat==="U18"){
                                table+="<th style='border-bottom-left-radius: 5px; background-color: "+GM_getValue("bg_native")+"; color: "+GM_getValue("color_native")+";'>U18</th>"
                                bottomStyle="border-bottom:1px solid "+GM_getValue("bg_native")
                            }else{
                                table+="<th  "+thStyle+">"+tmp_cat+"</th>"
                            }

                        }
                        table+="<td style='"+bottomStyle+";'>"+new Intl.NumberFormat(window.userLocal, {minimumFractionDigits: 2,maximumFractionDigits: 2}).format(jsonResponse[tmp_cat]['min']);+"</td>";
                        table+="<td style='"+bottomStyle+";'>"+new Intl.NumberFormat(window.userLocal, {minimumFractionDigits: 2,maximumFractionDigits: 2}).format(jsonResponse[tmp_cat]['avg']);+"</td>";
                        table+="<td style='"+bottomStyle+";'>"+new Intl.NumberFormat(window.userLocal, {minimumFractionDigits: 2,maximumFractionDigits: 2}).format(jsonResponse[tmp_cat]['max']);+"</td>";

                        table+="<td style='text-align: left; "+bottomStyle+"; font-weight: bold;'>"
                        table+=new Intl.NumberFormat(window.userLocal, {minimumFractionDigits: 2,maximumFractionDigits: 2}).format(jsonResponse[tmp_cat]['actual_elo'])+"</td>";

                        table+="<td style='text-align: center; "+bottomStyle+";'>"
                        table+=new Intl.NumberFormat(window.userLocal).format(jsonResponse[tmp_cat]['ranking'])+"</td>";


                        let symbol=""
                        let status="down"
                        if(jsonResponse[tmp_cat]['week']>0){
                            symbol="&nbsp;"
                            status="up"
                        }
                        if(jsonResponse[tmp_cat]['week']===0){
                            symbol="&nbsp;"
                            status="cir_amarillo"
                        }

                        table+="<td style='text-align: left;"+bottomStyle+";'>"
                        table+="<img alt='' src='https://statsxente.com/MZ1/View/Images/"+status+".png' width='10px' height='10px'/>"
                        table+=symbol
                        table+=new Intl.NumberFormat(window.userLocal, {minimumFractionDigits: 2,maximumFractionDigits: 2}).format(jsonResponse[tmp_cat]['week'])+"</td>";


                        symbol=""
                        status="down"
                        if(jsonResponse[tmp_cat]['month']>0){
                            symbol="&nbsp;"
                            status="up"
                        }
                        if(jsonResponse[tmp_cat]['month']===0){
                            symbol="&nbsp;"
                            status="cir_amarillo"
                        }

                        table+="<td style='text-align: left;"+bottomStyle+";'>"
                        table+="<img alt='' src='https://statsxente.com/MZ1/View/Images/"+status+".png' width='10px' height='10px'/>"
                        table+=symbol
                        table+=new Intl.NumberFormat(window.userLocal, {minimumFractionDigits: 2,maximumFractionDigits: 2}).format(jsonResponse[tmp_cat]['month'])+"</td>";

                        symbol=""
                        status="down"
                        if(jsonResponse[tmp_cat]['year']>0){
                            symbol="&nbsp;"
                            status="up"
                        }
                        if(jsonResponse[tmp_cat]['year']===0){
                            symbol="&nbsp;"
                            status="cir_amarillo"
                        }

                        //table+="<td style='text-align: left; border-right:1px solid "+GM_getValue("bg_native")+";"+bottomStyle+";'>"
                        table+="<td style='text-align: left; "+bottomStyle+";  border-right:1px solid "+GM_getValue("bg_native")+";"+bottomStyle+";'>"
                        table+="<img alt='' src='https://statsxente.com/MZ1/View/Images/"+status+".png' width='10px' height='10px'/>"
                        table+=symbol
                        table+=new Intl.NumberFormat(window.userLocal, {minimumFractionDigits: 2,maximumFractionDigits: 2}).format(jsonResponse[tmp_cat]['year'])+"</td>";




                        table+="</tr><tr>"

                    }

                    table+="<tr><td colspan=9>"

                    table+='<button class="btn-save" style="color:'+GM_getValue("color_native")+'; background-color:'+GM_getValue("bg_native")+'; font-family: \'Roboto\'; font-weight:bold;'
                    table+=' font-size:revert;" id="eloHistoryButton"><i class="bi bi-clock-history" style="font-style:normal;"> ELO History</i></button></td>'
                    table+="</tr></thead></table></center></div>"
                    document.getElementById("statsTabs-1").insertAdjacentHTML("beforebegin",table);
                    document.getElementById("hp_loader").remove()
                    document.getElementById("eloHistoryButton").addEventListener('click', function () {
                        let link = "https://statsxente.com/MZ1/Functions/graphLoader.php?graph=elo_history&team_id=" + team_id+"&sport=" + window.sport
                        openWindow(link, 0.95, 1.25);
                    });
                }

            });

        }
        let elements = document.querySelectorAll('.leagueStats');
        elements[elements.length-1].insertAdjacentHTML("beforebegin", '<button class="btn-save" style="width: 8em; height:1.75em; padding: 0 0; color:' + GM_getValue("color_native") + '; background-color:' + GM_getValue("bg_native") + '; font-family: \'Roboto\'; font-weight:bold; font-size:revert;" id="showGrafStats"><i class="bi bi-bar-chart-fill" style="font-style:normal;"> Show Graph</i></button></br></br>');
        let listItems = elements[elements.length-1].querySelectorAll('li')
        let as = listItems[0].querySelectorAll('a')
        let urlObj = new URL(as[0].href);
        let params = new URLSearchParams(urlObj.search);
        let type = params.get('type');
        let tid = params.get('tid');
        var link="https://statsxente.com/MZ1/Graficos/graficoHistoricoDivisiones.php?idioma="+window.lang+"&category="+type+"&sport="+window.sport+"&team_id="+tid

        document.getElementById("showGrafStats").addEventListener("click", function() {
            openWindow(link, 0.95, 1.25);
        });



        elemento = document.getElementById('showGrafScorers');
        if (elemento) {
            elemento.remove();
        }

        elements = document.querySelectorAll('.topScorers');
        let topScorersHtml='<button class="btn-save" style="width: 8em; height:1.75em; padding: 0 0; color:' + GM_getValue("color_native") + '; background-color:' + GM_getValue("bg_native") + '; font-family: \'Roboto\'; font-weight:bold; font-size:revert;" id="showGrafScorers">'
        topScorersHtml+='<i class="bi bi-bar-chart-fill" style="font-style:normal;"> Show Graph</i></button> '
        if(window.sport==="hockey"){
            topScorersHtml+='Order By: <select id="sortScorers" style="color:' + GM_getValue("color_native") + '; background-color:' + GM_getValue("bg_native")+'; padding: 6px 3px; border-radius: 3px;">'
            topScorersHtml+='<option value="goals">Goals</option><option value="assists">Assists</option><option value="points">Points</option></select></br></br>';
        }
        elements[elements.length-1].insertAdjacentHTML("beforebegin",topScorersHtml)
        listItems = elements[elements.length-1].querySelectorAll('li')
        as = listItems[0].querySelectorAll('a')
        urlObj = new URL(as[0].href);
        params = new URLSearchParams(urlObj.search);
        type = params.get('type');
        tid = params.get('tid');
        let link1=""
        document.getElementById("showGrafScorers").addEventListener("click", function() {
            if(window.sport==="soccer"){
                link1="https://statsxente.com/MZ1/Functions/graphLoader.php?graph=top_scorers&idioma="+window.lang+"&category="+type+"&sport="+window.sport+"&team_id="+tid+"&limit=15"
            }else{
                link1="https://statsxente.com/MZ1/Functions/graphLoader.php?graph=top_scorers_hockey&idioma="+window.lang+"&category="+type+"&sport="+window.sport+"&team_id="+tid+"&limit=15&sort="+document.getElementById("sortScorers").value
            }
            openWindow(link1, 0.95, 1.25);
        });



        ///Bans

        elemento = document.getElementById('showGrafBans');
        if (elemento) {
            elemento.remove();
        }

        elements = document.querySelectorAll('.topBadBoys');
        let topBansHtml='<button class="btn-save" style="width: 8em; height:1.75em; padding: 0 0; color:' + GM_getValue("color_native") + '; background-color:' + GM_getValue("bg_native") + '; font-family: \'Roboto\'; font-weight:bold; font-size:revert;" id="showGrafBans">'
        topBansHtml+='<i class="bi bi-bar-chart-fill" style="font-style:normal;"> Show Graph</i></button> '
        if(window.sport==="soccer"){
            topBansHtml+='Order By: <select id="sortScorers" style="color:' + GM_getValue("color_native") + '; background-color:' + GM_getValue("bg_native")+'; padding: 6px 3px; border-radius: 3px;">'
            topBansHtml+='<option value="points">Points</option><option value="yellow">Yellows</option><option value="red">Reds</option></select></br></br>';
        }
        elements[elements.length-1].insertAdjacentHTML("beforebegin",topBansHtml)
        listItems = elements[elements.length-1].querySelectorAll('li')
        as = listItems[0].querySelectorAll('a')
        urlObj = new URL(as[0].href);
        params = new URLSearchParams(urlObj.search);
        type = params.get('type');
        tid = params.get('tid');
        let link2=""
        document.getElementById("showGrafBans").addEventListener("click", function() {
            if(window.sport==="soccer"){
                link2="https://statsxente.com/MZ1/Functions/graphLoader.php?graph=top_bans&idioma="+window.lang+"&category="+type+"&sport="+window.sport+"&team_id="+tid+"&limit=15&sort="+document.getElementById("sortScorers").value
            }else{
                link2="https://statsxente.com/MZ1/Functions/graphLoader.php?graph=top_bans_hockey&idioma="+window.lang+"&category="+type+"&sport="+window.sport+"&team_id="+tid+"&limit=15"
            }
            openWindow(link2, 0.95, 1.25);
        });


    }
//ELO Rankings
    function eloRanks(){
        let original = document.getElementById("leftmenu_rank_national");
        //let original = document.getElementById("sub_page_nav_rank_national");

        const elo_aux_cats = new Map();
        elo_aux_cats.set("u18_elo", "ELO U18");
        elo_aux_cats.set("u21_elo", "ELO U21");
        elo_aux_cats.set("u23_elo","ELO U23");
        elo_aux_cats.set("senior_elo", "ELO Senior");

        elo_aux_cats.forEach((valor, clave) => {
            let clon = original.cloneNode(true);
            clon.id = clave;
            original.parentNode.insertBefore(clon, original.nextSibling);
            let contenedor = document.getElementById(clave);
            let enlace = contenedor.querySelector("a");
            enlace.textContent = valor;
            enlace.innerHTML='<img alt="" src="https://statsxente.com/MZ1/View/Images/main_icon.png" style="width: 15px; height: 15px; border: none; vertical-align: middle; padding: 0 4px 0 0; margin: 0;">'+enlace.innerHTML
            enlace.removeAttribute("href");
            enlace.addEventListener("click", function(event) {
                event.preventDefault();
                let link="https://statsxente.com/MZ1/Functions/redirect.php?l="+clave+"_"+window.sport+"&i="+window.lang+"&d="+GM_getValue("currency")
                openWindow(link, 0.95, 1.25);
            });
        });
    }
//Training Report
    function trainingReport(){
        if(!document.getElementById("trainingDaysId")){
            let elem=document.getElementsByClassName("headerPanel")
            elem[0].id="trainingDaysId"


            document.getElementById("trainingDaysId").addEventListener('click', function () {
                setTimeout(function () {
                    waitToDOMById(trainingReport,"training_report",5000)
                }, 500);


            });
        }
        let key="ball"
        if(window.sport==="hockey"){
            key="puck"
        }

        let promesas = [];
        let clase="loader-"+window.sport
        if(window.stx_device==="computer"){
            let elements0 = document.querySelectorAll('.dailyReportRightColumn');
            elements0.forEach(element0 => {
                let previousTd = element0.previousElementSibling.previousElementSibling.previousElementSibling;
                if((!previousTd.innerHTML.includes("training_graph_icon"))&&(previousTd.innerHTML.includes("<img"))){
                    let loaders=previousTd.getElementsByClassName("containerLoaderDiv")
                    if(loaders.length>0){
                        loaders[0].innerHTML='<div id="hp_loader" class="'+clase+'" style="gap: 10px;display:inline-block; width:25%"></div>'+loaders[0].innerHTML;
                    }else{
                        previousTd.innerHTML='<div id="hp_loader" class="'+clase+'" style="gap: 10px;display:inline-block; width:25%"></div>'+previousTd.innerHTML
                        previousTd.innerHTML="<div class=containerLoaderDiv style='display: flex; align-items: center;gap: 8px;'>"+previousTd.innerHTML+"</div>"
                    }
                }
                if(element0.innerHTML.includes(key)){
                    let skills = element0.previousElementSibling.previousElementSibling;
                    let number_skills=skills.getElementsByClassName("skillBallSeparator")

                    if(number_skills.length>3){

                        let player_td = element0.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling;
                        let player_as=player_td.getElementsByTagName("a")
                        let link=player_as[0].href
                        promesas.push(fetchAndProcessPlayerData(link,previousTd.innerText,previousTd,window.stx_device))
                    }
                }

            });

        }else{

            let elements0 = document.querySelectorAll('.playerColumn.hitlist-compact-list-column');
            elements0.forEach(element0 => {
                let dl=element0.getElementsByClassName("hitlist-compact-list markers")
                let newDL = document.createElement("dl");
                newDL.className="hitlist-compact-list markers";
                newDL.innerHTML='<div id="hp_loader" class="'+clase+'" style="display:inline-block; width:15%"></div>'
                dl[0].appendChild(newDL)

                if(element0.innerHTML.includes(key)){
                    let number_skills=element0.getElementsByClassName("skillBallSeparator")

                    if(number_skills.length>3){

                        let player_as=element0.getElementsByTagName("a")
                        let link=player_as[0].href
                        let toChange=element0.getElementsByClassName("responsive-show floatRight")
                        promesas.push(fetchAndProcessPlayerData(link,toChange[0].innerText,toChange[0],window.stx_device))
                    }
                }
            });





        }

        Promise.all(promesas)
            .then(() => {
                const elementos = document.querySelectorAll('.'+clase);
                elementos.forEach(elemento => elemento.remove());
            })
            .catch(() => {
                const elementos = document.querySelectorAll('.'+clase);
                elementos.forEach(elemento => elemento.remove());
            });



    }
//Show ELO diff on clash matches
    function clashEloMatches() {
        let div = document.getElementById("latest-challenges")
        let tables = div.getElementsByTagName("table")
        if (tables.length > 0) {
            let table = tables[0]


            let rows = table.querySelectorAll("tr");

            let linkIds = ""
            let contIds = 0

            rows.forEach(row => {
                let tds = row.querySelectorAll("td");
                let secondTd = tds[1];
                let as = secondTd.getElementsByTagName("a")
                let urlObj = new URL("https://www.managerzone.com/" + as[0].getAttribute('href'));
                let params = new URLSearchParams(urlObj.search);
                let mid = params.get('mid');
                linkIds += "&idPartido" + contIds + "=" + mid
                contIds++
            });


            GM_xmlhttpRequest({
                method: "GET",
                url: "https://statsxente.com/MZ1/Functions/tamper_clash_matches_elo.php?currency=" + GM_getValue("currency") + "&sport=" + window.sport + linkIds,
                headers: {
                    "Content-Type": "application/json"
                },
                onerror: function () {notifySnackBarError("Clash ELO Matches")},
                onload: function (response) {

                    let jsonResponse = JSON.parse(response.responseText);
                    rows.forEach(row => {
                        let tds = row.querySelectorAll("td");
                        let secondTd = tds[1];
                        let as = secondTd.getElementsByTagName("a")
                        let urlObj = new URL("https://www.managerzone.com/" + as[0].getAttribute('href'));
                        let params = new URLSearchParams(urlObj.search);
                        let mid = params.get('mid');
                        let lastTd = row.querySelector("td:last-child");
                        if (lastTd) {
                            const clonedTd = lastTd.cloneNode(true);
                            let diff = jsonResponse[mid]
                            if (diff === undefined) {
                                clonedTd.innerHTML = `
  <div style="display: flex; align-items: center;">
  </div>
`;
                            }else{
                                diff = diff.toFixed(2)
                                clonedTd.innerHTML = `
  <div style="display: flex; align-items: center;">
    <img width='10px' height='10px' src='https://statsxente.com/MZ1/View/Images/diff_elo.png' alt=""/>
    <b style="margin-left: 5px;">${diff}</b>
  </div>
`;
                            }
                            clonedTd.style.width = "4em"
                            clonedTd.style.textAlign = "left"
                            row.appendChild(clonedTd);
                        }
                        lastTd.style.width = "3em"
                    });
                }

            });
        }
    }
//Users ranking page
    function usersRank(){
        let initialValues = {};
        initialValues["senior"] = GM_getValue("league_default_senior");

        let linkIds = ""
        let tabla = document.getElementById("userRankTable");


        let values = new Map();
        values.set('valor23', 'U23 Value');
        values.set('valor21', 'U21 Value');
        values.set('valor18', 'U18 Value');
        values.set('salario', 'Salary');
        values.set('valorUPSenior', 'LM Value');
        values.set('valorUPSUB23', 'U23 LM Value');
        values.set('valorUPSUB21', 'U21 LM Value');
        values.set('valorUPSUB18', 'U18 LM Value');
        values.set('edad', 'Age');
        if (window.sport === "soccer") {
            values.set('valor11', 'TOP 11');
            values.set('valor11_23', 'U23 TOP 11');
            values.set('valor11_21', 'U21 TOP 11');
            values.set('valor11_18', 'U18 TOP 11');
        } else {
            values.set('valor11', 'TOP 21');
            values.set('valor11_23', 'U23 TOP 21');
            values.set('valor11_21', 'U21 TOP 21');
            values.set('valor11_18', 'U18 TOP 21');
        }
        values.set('noNac', 'Foreigners');
        values.set('elo', 'ELO Score');
        values.set('elo23', 'U23 ELO Score');
        values.set('elo21', 'U21 ELO Score');
        values.set('elo18', 'U18 ELO Score');
        values.set('numJugadores', 'Number of players');
        values.set('leagues_all', 'Leagues');
        values.set('world_leagues_all', 'World Leagues');
        values.set('youth_leagues_all', 'Youth Leagues');
        values.set('world_youth_leagues_all', 'Youth World Leagues');
        values.set('federation_leagues', 'Federation Leagues');
        values.set('cup', 'Cups');
        values.set('cup_u23', 'U23 Cups');
        values.set('cup_u21', 'U21 Cups');
        values.set('cup_u18', 'U18 Cups');
        values.set('special_cup', 'Special Cups');

        let contenidoNuevo = '<div id=testClick style="margin: 0 auto;">';
        getNativeTableStyles();

        ///MENU TABLE
        contenidoNuevo += "<table id=showMenu style='margin: 0 auto;'><thead style='border-color:white; margin: 0 auto; background-color:" + GM_getValue("bg_native") + "; color:" + GM_getValue("color_native") + ";'>"
        contenidoNuevo +="<tr>";
        contenidoNuevo += '<th style="text-align:center; margin: 0 auto; padding:4px;" colspan="4">Values</th>'
        contenidoNuevo += "</tr>";

        let styleTable = " style='margin: 0 auto; display:none;'";
        let styleIcon = ""
        let styleSep = "style='padding-top:5px;'";

        if (GM_getValue("show_league_selects") === true) {
            styleTable = " style='margin: 0 auto;'";
            styleIcon = " active"
            styleSep = " style='display:none;'";
        }


        contenidoNuevo += "<tr><td></td><td colspan='2' style='padding-top:5px;'>";
        contenidoNuevo += '<div id="moreInfo" class="expandable-icon' + styleIcon + '" style="margin: 0 auto; cursor:pointer; background-color:' + GM_getValue("bg_native") + ';"><div id="line1" class="line"></div><div  id="line2" class="line"></div></div></center>';
        contenidoNuevo += "</td><td></td></tr>";
        contenidoNuevo += "<tr><td colspan='5' id='separatorTd'" + styleSep + "></td></tr>";
        contenidoNuevo += "</table></center>";
        contenidoNuevo += '<table id=show3' + styleTable + '><tr><td><label>';

        if ("valor" === initialValues["senior"]) {
            contenidoNuevo += '<input class="statsxente" type="checkbox" checked id="valor" value="Value">Value</label></td>';
        } else {
            contenidoNuevo += '<input class="statsxente" type="checkbox" id="valor" value="Value">Value</label></td>';
        }

        values.forEach(function (valor, clave) {

            if (clave === "valorUPSenior") {
                contenidoNuevo += "</tr><tr>";
            }

            if (clave === "valor11") {
                contenidoNuevo += "</tr><tr>";
            }
            if (clave === "elo") {
                contenidoNuevo += "</tr><tr>";
            }

            if (clave === "leagues") {
                contenidoNuevo += "</tr><tr>";
            }

            if (clave === "leagues_all") {
                contenidoNuevo += "</tr><tr>";
            }

            if (clave === "cup") {
                contenidoNuevo += "</tr><tr>";
            }

            if (clave === initialValues["senior"]) {
                contenidoNuevo += '<td><label><input class="statsxente" type="checkbox" checked value="' + valor + '" id="' + clave + '">' + valor + '</label></td>';
            } else {
                contenidoNuevo += '<td><label><input class="statsxente" type="checkbox" value="' + valor + '" id="' + clave + '">' + valor + '</label></td>';
            }
        });
        contenidoNuevo += "</tr></table></center>"
        contenidoNuevo += "</div></br>";
        values.set('valor', 'Value');

        tabla.insertAdjacentHTML('beforebegin', contenidoNuevo);

        if (GM_getValue("show_league_selects") === true) {
            document.getElementById("line2").style.transform = 'rotateZ(0deg)';
            document.getElementById("line1").style.transform = 'rotateZ(180deg)';
            document.getElementById("moreInfo").style.transform = 'rotateZ(0deg)';
        }
        values.forEach(function (valor, clave) {
            let elemento = document.getElementById(clave);
            elemento.addEventListener('click', handleClickUserRank);
        });
        (function () {
            document.getElementById("moreInfo").addEventListener('click', function () {
                document.getElementById("moreInfo").classList.toggle('active');

                if (document.getElementById("moreInfo").classList.contains("active")) {
                    document.getElementById("line2").style.transform = 'rotateZ(0deg)';
                    document.getElementById("line1").style.transform = 'rotateZ(180deg)';
                    document.getElementById("moreInfo").style.transform = 'rotateZ(0deg)';
                    $('#separatorTd').fadeOut(1);
                    document.getElementById("separatorTd").style.paddingTop = "5px";
                    $('#show3').fadeIn('slow');
                } else {
                    document.getElementById("line2").style.transform = 'rotateZ(45deg)';
                    document.getElementById("line1").style.transform = 'rotateZ(-45deg)';
                    document.getElementById("moreInfo").style.transform = 'rotateZ(45deg)';
                    $('#separatorTd').fadeIn(1);
                    $('#show3').fadeOut('slow');
                }

            });
        })();



        const filas = document.querySelectorAll("#userRankTable tr");
        let contIds=0;
        for (let i = 1; i < filas.length; i++) {
            const fila = filas[i];
            const tercerTd = fila.children[4];
            const cuartoTd = fila.children[5];

            let data=extractTeamData(fila.children[3].getElementsByTagName("a"))
            linkIds += "&idEquipo" + contIds + "=" + data[0]
            contIds++;
            if (tercerTd && cuartoTd) {
                tercerTd.innerHTML = cuartoTd.innerHTML + " " + tercerTd.innerHTML;
                cuartoTd.innerHTML=""
            }
        }

        let nuevaCeldaEncabezado = document.querySelector("#userRankTable th:last-of-type");
        nuevaCeldaEncabezado.innerHTML = "<a href='#'>"+values.get(initialValues["senior"])+"</a>"
        nuevaCeldaEncabezado.style.textAlign = 'center';
        nuevaCeldaEncabezado.style.maxWidth = '8.5em';
        nuevaCeldaEncabezado.style.width = '8.5em';
        nuevaCeldaEncabezado.style.whiteSpace = 'nowrap';
        nuevaCeldaEncabezado.style.overflow = 'hidden';
        nuevaCeldaEncabezado.style.textOverflow = 'ellipsis';
        nuevaCeldaEncabezado.id="stx_value"

        document.getElementById("stx_value").addEventListener("click", function () {
            setTimeout(function () {
                ordenarTabla(5, false, "userRankTable",false);
            }, 20);
        });





        GM_xmlhttpRequest({
            method: "GET",
            url: "https://statsxente.com/MZ1/Functions/tamper_teams.php?currency=" + GM_getValue("currency") + "&sport=" + window.sport + linkIds,
            headers: {
                "Content-Type": "application/json"
            },
            onerror: function (err) { notifySnackBarError("Teams")},
            onload: function (response) {
                teams_data = JSON.parse(response.responseText);
                const filas = document.querySelectorAll("#userRankTable tr");
                for (let i = 1; i < filas.length; i++) {
                    const fila = filas[i];
                    const tercerTd = fila.children[5];
                    let data=extractTeamData(fila.children[3].getElementsByTagName("a"))
                    tercerTd.innerText=new Intl.NumberFormat(window.userLocal).format(Math.round(teams_data[data[0]]['elo']))
                    tercerTd.align = "center";
                }
            }});
    }
//Next matches page
    function nextMatches(){


        let selectElements = document.getElementsByName('limit');
        if (selectElements.length > 0) {
            let selectElement = selectElements[0];
            selectElement.addEventListener('change', function() {
                if(GM_getValue("eloNextMatchesFlag")){
                    waitToDOM(nextMatches, ".group", 0,7000)
                }
            });
        }
        selectElements = document.getElementsByName('selectType');
        if (selectElements.length > 0) {
            let selectElement = selectElements[0];
            selectElement.addEventListener('change', function() {
                if(GM_getValue("eloNextMatchesFlag")){
                    waitToDOM(nextMatches, ".group", 0,7000)
                }
            });
        }

        let played_div_menu=document.getElementById("matches_sub_nav")
        let div_show_scores=played_div_menu.getElementsByClassName("flex-grow-0")
        let showScoreSpan=div_show_scores[0].getElementsByTagName("span")

        showScoreSpan[1].addEventListener('click', function() {
            let urlParamsAux = new URLSearchParams(window.location.search);
            if ((!urlParamsAux.has('tid'))&&(GM_getValue("tacticsResultsFlag"))){
                waitToDOM(tactisResumeData, ".group", 0,7000)
            }

            if(GM_getValue("eloPlayedMatchesFlag")){
                waitToDOM(lastMatchesELO, ".group", 0,7000)
            }
        });

        let my_team_id=""
        if(window.sport==="soccer"){
            if ((GM_getValue("soccer_team_id") === undefined) || (GM_getValue("soccer_team_id") === "")){
                GM_setValue("soccer_team_id", document.getElementById("tid1").value)
            }
            my_team_id=GM_getValue("soccer_team_id")
        }else{
            if ((GM_getValue("hockey_team_id") === undefined) || (GM_getValue("hockey_team_id") === "")){
                GM_setValue("hockey_team_id", document.getElementById("tid1").value)
            }
            my_team_id=GM_getValue("hockey_team_id")
        }


        let team_id=""
        let flagMyTeam=true
        let urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('tid')){
            team_id=urlParams.get("tid")
            flagMyTeam=false
        }else{
            team_id=my_team_id
        }


        let team_ids=[]
        let linkIds=""
        let contIds=0
        let cIds=""
        let contCIds=0
        let comps=[]
        let comp_ids=[]
        let elements0 = document.querySelectorAll('.odd');

        elements0.forEach(element0 => {
            let cat=element0.getElementsByClassName("responsive-hide match-reference-text-wrapper flex-grow-0");
            if(cat.length>0){
                let links = cat[0].querySelectorAll('a');

                if(links.length>0){
                    let urlObj = new URL("https://www.managerzone.com" + links[0].getAttribute('href'));
                    let params = new URLSearchParams(urlObj.search);
                    let type = params.get('type');

                    if(type===null){
                        var flagInsert=true

                        if((params.get('p')==="cup")||(params.get('p')==="private_cup")){


                            if(links[0].textContent.includes("U23")){
                                flagInsert=false
                                comps[params.get('cid')]="U23"
                            }else{
                                if(links[0].textContent.includes("U21")){
                                    flagInsert=false
                                    comps[params.get('cid')]="U21"
                                }else{


                                    if(links[0].textContent.includes("U18")){
                                        flagInsert=false
                                        comps[params.get('cid')]="U18"
                                    }else{
                                        flagInsert=true
                                        comps[params.get('cid')]="SENIOR";
                                    }
                                }
                            }
                            if((flagInsert)&&(params.get('p')==="private_cup")){
                                comp_ids.push(params.get('cid'));
                                cIds += "&idComp" + contCIds + "=" + params.get('cid')
                                contCIds++;
                            }
                        }else{

                            let id=0;

                            switch(params.get('p')){
                                case "cup":
                                    id=params.get('cid');
                                    break;
                                case "private_cup":
                                    id=params.get('cid');
                                    break;
                                case "friendly_series":
                                    id=params.get('fsid');
                                    break;
                                case "friendlyseries":
                                    id=params.get('fsid');
                                    break;

                            }

                            if (!comp_ids.includes(id)) {
                                comp_ids.push(id);
                                cIds += "&idComp" + contCIds + "=" + id
                                contCIds++;
                            }
                        }


                    }
                }
            }



            let elements1 = element0.querySelectorAll('.teams-wrapper .flex-grow-1');
            elements1.forEach(element1 => {
                let elements2 = element1.querySelectorAll('.clippable');
                elements2.forEach(element2 => {
                    let urlObj = new URL("https://www.managerzone.com/" + element2.getAttribute('href'));

                    let params = new URLSearchParams(urlObj.search);
                    let tidValue = params.get('tid');
                    if(tidValue!==null){
                        if (!team_ids.includes(tidValue)) {
                            team_ids.push(tidValue);
                            linkIds += "&idEquipo" + contIds + "=" + tidValue
                            contIds++;
                        }
                    }
                });
            });
        });

        if (!team_ids.includes(team_id)) {
            linkIds += "&idEquipo" + contIds + "=" + team_id
            contIds++;
        }

        if (!team_ids.includes(my_team_id)) {
            linkIds += "&idEquipo" + contIds + "=" + my_team_id
        }
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://statsxente.com/MZ1/Functions/tamper_elo_values.php?sport=" + window.sport + linkIds+cIds,
            headers: {
                "Content-Type": "application/json"
            },
            onerror: function() {
                notifySnackBarError("ELO Values");
            },
            onload: function (response) {
                let rawJSON = JSON.parse(response.responseText);
                let jsonResponse=rawJSON["teams"]


                for (let key in rawJSON["comps"]) {
                    comps[key]=rawJSON["comps"][key]['restriction']
                }

                let elements0 = document.querySelectorAll('.odd:not(.uxx)');
                elements0.forEach(element0 => {
                    let elements1 = element0.querySelectorAll('.teams-wrapper .flex-grow-1');
                    elements1.forEach(element1 => {
                        let elements2 = element1.querySelectorAll('.clippable');
                        elements2.forEach(element2 => {
                            let urlObj = new URL("https://www.managerzone.com/" + element2.getAttribute('href'));
                            let params = new URLSearchParams(urlObj.search);
                            let tidValue = params.get('tid');
                            if(tidValue!==null){
                                tidValue=parseInt(tidValue)
                                let valor=0;
                                if (jsonResponse[tidValue]?.SENIOR) {
                                    valor = new Intl.NumberFormat(window.userLocal).format(Number.parseFloat(jsonResponse[tidValue]["SENIOR"]).toFixed(0))
                                }
                                element1.innerHTML+="</br>"+valor;
                            }else{

                                if(!flagMyTeam){
                                    tidValue=parseInt(my_team_id)
                                }else{
                                    tidValue=parseInt(team_id)
                                }
                                let valor=0;
                                if (jsonResponse[tidValue]?.SENIOR) {
                                    valor = new Intl.NumberFormat(window.userLocal).format(Number.parseFloat(jsonResponse[tidValue]["SENIOR"]).toFixed(0))
                                }
                                element1.innerHTML+="</br>"+valor;
                            }
                        });
                    });
                });

                let temp_cats=[]

                temp_cats["u23"] = "U23";
                temp_cats["u21"] = "U21";
                temp_cats["u18"] = "U18";
                temp_cats["u23_world"] = "U23";
                temp_cats["u21_world"] = "U21";
                temp_cats["u18_world"] = "U18";






                elements0 = document.querySelectorAll('.odd.uxx');

                elements0.forEach(element0 => {
                    let cat=element0.getElementsByClassName("responsive-hide match-reference-text-wrapper flex-grow-0");
                    let links = cat[0].querySelectorAll('a');
                    let type
                    let href=""
                    if(links[0]!==undefined){
                        href=links[0].getAttribute('href')
                    }

                    let urlObj = new URL("https://www.managerzone.com/" +href);
                    let params = new URLSearchParams(urlObj.search);
                    type = params.get('type');

                    let elo_type="SENIOR"
                    if(type==null){
                        if(params.get('cid')!=null){
                            elo_type=comps[params.get('cid')]
                        }
                        if(params.get('fsid')!=null){
                            elo_type=comps[params.get('fsid')]
                        }
                    }else{
                        elo_type=temp_cats[type]
                    }

                    let elements1 = element0.querySelectorAll('.teams-wrapper .flex-grow-1');
                    elements1.forEach(element1 => {
                        let elements2 = element1.querySelectorAll('.clippable');
                        elements2.forEach(element2 => {
                            let urlObj = new URL("https://www.managerzone.com/" + element2.getAttribute('href'));
                            let params = new URLSearchParams(urlObj.search);
                            let tidValue = params.get('tid');
                            if(tidValue!==null){
                                tidValue=parseInt(tidValue)
                                let valor=0;
                                if(jsonResponse[tidValue] && jsonResponse[tidValue][elo_type] !== undefined){
                                    valor = new Intl.NumberFormat(window.userLocal).format(Number.parseFloat(jsonResponse[tidValue][elo_type]).toFixed(0))
                                }
                                element1.innerHTML+="</br>"+valor;
                            }else{
                                if(!flagMyTeam){
                                    tidValue=parseInt(my_team_id)
                                }else{
                                    tidValue=parseInt(team_id)
                                }
                                let valor=0;
                                if(jsonResponse[tidValue] && jsonResponse[tidValue][elo_type] !== undefined){
                                    valor = new Intl.NumberFormat(window.userLocal).format(Number.parseFloat(jsonResponse[tidValue][elo_type]).toFixed(0))
                                }
                                element1.innerHTML+="</br>"+valor;
                            }
                        });
                    });
                });
            }
        });


    }
//Team page
    function teamPage(){

        let divToInserT=document.getElementById("streakAndCupInfo")
        let clase="loader-"+window.sport
        divToInserT.innerHTML =
            "</br>" +
            "<div id='hp_loader'>" +
            "<div style='text-align:center;'><b>Loading...</b></div>" +
            "<div id='loader' class='" + clase + "' style='height:25px'></div>" +
            "</div>" +
            divToInserT.innerHTML;


        let u23_type="",u21_type="",u18_type=""
        let team_name_div=document.getElementsByClassName("teamDataText clippable");
        const team_name=encodeURI(team_name_div[0].textContent)
        let team_id=""
        let urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('tid')){
            team_id=urlParams.get("tid")
        }else{





            if(window.sport==="soccer"){
                if ((GM_getValue("soccer_team_id") === undefined) || (GM_getValue("soccer_team_id") === "")){
                    let div=document.getElementById("infoAboutTeam")
                    let dds=div.getElementsByTagName("dd")
                    let spans=dds[0].getElementsByTagName("span")
                    let raw_id=spans[2].innerText
                    let id=raw_id.replace(')', '')
                    id=id.replace('(', '')
                    GM_setValue("soccer_team_id",id)
                }
                team_id=GM_getValue("soccer_team_id")
            }else{
                if ((GM_getValue("hockey_team_id") === undefined) || (GM_getValue("hockey_team_id") === "")){
                    let div=document.getElementById("infoAboutTeam")
                    let dds=div.getElementsByTagName("dd")
                    let spans=dds[0].getElementsByTagName("span")
                    let raw_id=spans[2].innerText
                    let id=raw_id.replace(')', '')
                    id=id.replace('(', '')
                    GM_setValue("hockey_team_id",id)
                }
                team_id=GM_getValue("hockey_team_id")
            }

        }

        let main_div=document.getElementById("infoAboutTeam")
        let dds = main_div.querySelectorAll('dd');

        dds.forEach(dd => {
            let as = dd.querySelectorAll('a');
            if(as.length>0){
                let href = as[0].getAttribute('href');
                let urlParams = new URLSearchParams(href.split('?')[1]);
                let type = urlParams.get('type');
                if(type.includes("u23")){
                    u23_type=window.cats[type]
                }
                if(type.includes("u21")){
                    u21_type=window.cats[type]
                }
                if(type.includes("u18")){
                    u18_type=window.cats[type]
                }
            }
        });

        GM_xmlhttpRequest({
            method: "GET",
            url: "https://statsxente.com/MZ1/Functions/tamper_detailed_teams.php?currency=" + GM_getValue("currency") + "&sport=" + window.sport + "&idEquipo="+team_id,
            headers: {
                "Content-Type": "application/json"
            },
            onerror: function() {
                notifySnackBarError("Detailed Teams");
            },
            onload: function (response) {

                let jsonResponse = JSON.parse(response.responseText);

                let aux=team_id

                let top="TOP 11"

                if(window.sport==="hockey"){
                    top="TOP 21"
                }

                getDeviceFormat()
                let teamTable='<div style="width:100%; display: block;justify-content: center;align-items: center;max-height: 100%; text-align: center;">'
                let style="max-width: 100%; overflow-x: auto; display: block; width:100%;"
                if(window.stx_device==="computer"){
                    style=""
                }
                teamTable+='<table class="matchValuesTable" style="'+style+'"><thead><tr>'
                teamTable+='<th id=thTransparent0 style="background-color:transparent; border:0;"></th>'
                teamTable+='<th style="border-top-left-radius: 5px;">Value</th><th>LM Value</th>'
                teamTable+='<th >'+top+'</th><th>ELO</th>'
                teamTable+='<th>ELO Pos</th>'
                teamTable+='<th>Age</th>'
                teamTable+='<th>Salary</th>'
                teamTable+='<th>Players</th>'
                teamTable+='<th style="border-top-right-radius: 5px;"></th>'
                teamTable+='</tr></thead><tbody>'
                let valor=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor']))
                let valorLM=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valorUPSenior']))
                let valor11=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor11']))
                let elo=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['elo']))
                let edad= Number.parseFloat(jsonResponse[aux]['edad']).toFixed(2)
                let salario=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['salario']))
                let numJugs=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['numJugadores']))
                teamTable+='<tr><th style="border-top-left-radius: 5px;">Senior</th><td>'+valor+'</td><td>'+valorLM+'</td><td>'+valor11+'</td><td>'+elo+'</td>'
                teamTable+='<td>'+jsonResponse[aux]['elo_pos']+'</td><td>'+edad+'</td><td>'+salario+'</td>'
                teamTable+='<td>'+numJugs+'</td>'
                teamTable+='<td style="border-right:1px solid '+GM_getValue("bg_native")+';">'
                teamTable+='<img alt="" style="cursor:pointer;" id="seniorButton" src="https://statsxente.com/MZ1/View/Images/detail.png" width="20px" height="20px"/>'

                teamTable+='</td></tr>'

                valor=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor23']))
                valorLM=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valorUPSUB23']))
                valor11=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor11_23']))
                elo=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['elo23']))
                edad=Number.parseFloat(jsonResponse[aux]['age23']).toFixed(2)
                salario=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['salary23']))
                numJugs=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['players23']))
                teamTable+='<tr><th>U23</th><td>'+valor+'</td><td>'+valorLM+'</td><td>'+valor11+'</td><td>'+elo+'</td>'
                teamTable+='<td>'+jsonResponse[aux]['elo23_pos']+'</td><td>'+edad+'</td><td>'+salario+'</td>'
                teamTable+='<td>'+numJugs+'</td>'
                teamTable+='<td style="border-right:1px solid '+GM_getValue("bg_native")+';">'
                teamTable+='<img alt="" style="cursor:pointer;" id="sub23Button" src="https://statsxente.com/MZ1/View/Images/detail.png" width="20px" height="20px"/>'
                teamTable+='</td></tr>'



                valor=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor21']))
                valorLM=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valorUPSUB21']))
                valor11=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor11_21']))
                elo=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['elo21']))
                edad=Number.parseFloat(jsonResponse[aux]['age21']).toFixed(2)
                salario=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['salary21']))
                numJugs=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['players21']))
                teamTable+='<tr><th>U21</th><td>'+valor+'</td><td>'+valorLM+'</td><td>'+valor11+'</td><td>'+elo+'</td>'
                teamTable+='<td>'+jsonResponse[aux]['elo21_pos']+'</td><td>'+edad+'</td><td>'+salario+'</td>'
                teamTable+='<td>'+numJugs+'</td>'
                teamTable+='<td style="border-right:1px solid '+GM_getValue("bg_native")+';">'
                teamTable+='<img alt="" style="cursor:pointer;" id="sub21Button" src="https://statsxente.com/MZ1/View/Images/detail.png" width="20px" height="20px"/>'
                teamTable+='</td></tr>'




                valor=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor18']))
                valorLM=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valorUPSUB18']))
                valor11=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor11_18']))
                elo=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['elo18']))
                edad=Number.parseFloat(jsonResponse[aux]['age18']).toFixed(2)
                salario=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['salary18']))
                numJugs=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['players18']))
                teamTable+='<tr><th style="border-bottom-left-radius: 5px;">U18</th><td style="border-bottom:1px solid '+GM_getValue("bg_native")+';">'+valor+'</td>'
                teamTable+='<td style="border-bottom:1px solid '+GM_getValue("bg_native")+';">'+valorLM+'</td>'
                teamTable+='<td style="border-bottom:1px solid '+GM_getValue("bg_native")+';">'+valor11+'</td>'
                teamTable+='<td style="border-bottom:1px solid '+GM_getValue("bg_native")+';">'+elo+'</td>'
                teamTable+='<td style="border-bottom:1px solid '+GM_getValue("bg_native")+';">'+jsonResponse[aux]['elo18_pos']+'</td>'
                teamTable+='<td style="border-bottom:1px solid '+GM_getValue("bg_native")+';">'+edad+'</td><td style="border-bottom:1px solid '+GM_getValue("bg_native")+';">'+salario+'</td>'
                teamTable+='<td style="border-bottom:1px solid '+GM_getValue("bg_native")+';">'+numJugs+'</td>'
                teamTable+='<td style="border-radius: 0 0 10px 0; border-bottom:1px solid '+GM_getValue("bg_native")+'; border-right:1px solid '+GM_getValue("bg_native")+';">'
                teamTable+='<img alt="" style="cursor:pointer;" id="sub18Button" src="https://statsxente.com/MZ1/View/Images/detail.png" width="20px" height="20px"/>'
                teamTable+='</td></tr>'
                teamTable+='<tr><td colspan=10>'
                teamTable+='<button class="btn-save" style="color:'+GM_getValue("color_native")+'; background-color:'+GM_getValue("bg_native")
                teamTable+='; font-family: \'Roboto\'; font-weight:bold; font-size:revert;" id="eloHistoryButton"><i class="bi bi-clock-history"'
                teamTable+=' style="font-style:normal;"> ELO History</i></button></tr>'
                teamTable+='</tbody></table></div>'


                let divToInserT=document.getElementById("streakAndCupInfo")
                divToInserT.innerHTML=teamTable+divToInserT.innerHTML

                document.getElementById("hp_loader").remove()

                let color=GM_getValue("bg_native")
                let darkerColor = darkenColor(color, 25);

                document.styleSheets[0].insertRule(
                    '.btn-save:hover { background-color: '+darkerColor+' !important; }',
                    document.styleSheets[0].cssRules.length
                );


                document.getElementById("eloHistoryButton").addEventListener('click', function () {
                    let link = "https://statsxente.com/MZ1/Functions/graphLoader.php?graph=elo_history&team_id=" + team_id+"&sport=" + window.sport
                    openWindow(link, 0.95, 1.25);
                });



                document.getElementById("seniorButton").addEventListener('click', function () {
                    let link = "https://www.statsxente.com/MZ1/Functions/tamper_teams_stats.php?team_id=" + team_id +
                        "&category=senior&elo_category=SENIOR&sport=" + window.sport+ "&idioma=" + window.lang+"&team_name="
                        +team_name+"&divisa=" + GM_getValue("currency")
                    openWindow(link, 0.95, 1.25);
                });
                document.getElementById("sub23Button").addEventListener('click', function () {
                    let link = "https://www.statsxente.com/MZ1/Functions/tamper_teams_stats.php?team_id=" + team_id +
                        "&category="+u23_type+"&elo_category=U23&sport=" + window.sport+ "&idioma=" + window.lang+"&team_name="
                        +team_name+"&divisa=" + GM_getValue("currency")
                    openWindow(link, 0.95, 1.25);
                });

                document.getElementById("sub21Button").addEventListener('click', function () {
                    let link = "https://www.statsxente.com/MZ1/Functions/tamper_teams_stats.php?team_id=" + team_id +
                        "&category="+u21_type+"&elo_category=U21&sport=" + window.sport+ "&idioma=" + window.lang+"&team_name="
                        +team_name+"&divisa=" + GM_getValue("currency")
                    openWindow(link, 0.95, 1.25);
                });


                document.getElementById("sub18Button").addEventListener('click', function () {
                    let link = "https://www.statsxente.com/MZ1/Functions/tamper_teams_stats.php?team_id=" + team_id +
                        "&category="+u18_type+"&elo_category=U18&sport=" + window.sport+ "&idioma=" + window.lang+"&team_name="
                        +team_name+"&divisa=" + GM_getValue("currency")
                    openWindow(link, 0.95, 1.25);
                });



                const thElements = document.querySelectorAll('table.matchValuesTable th');
                thElements.forEach(th => {
                    th.style.backgroundColor = GM_getValue("bg_native");
                    th.style.color = GM_getValue("color_native");
                });
                document.getElementById("thTransparent0").style.backgroundColor="transparent";
            }
        });
    }
//Last matches page
    function lastMatchesELO(){
        let urlParamsAux = new URLSearchParams(window.location.search);
        let selectElements = document.getElementsByName('limit');
        if (selectElements.length > 0) {
            let selectElement = selectElements[0];
            selectElement.addEventListener('change', function() {
                if ((!urlParamsAux.has('tid'))&&(GM_getValue("tacticsResultsFlag"))){
                    setTimeout(function () { waitToDOM(tactisResumeData, ".group", 0,7000)}, 100);

                }

                if(GM_getValue("eloNextMatchesFlag")){
                    //waitToDOM(nextMatches, ".group", 0,7000)
                }
                if(GM_getValue("eloPlayedMatchesFlag")){
                    waitToDOM(lastMatchesELO, ".group", 0,7000)
                }
            });
        }
        selectElements = document.getElementsByName('selectType');
        if (selectElements.length > 0) {
            let selectElement = selectElements[0];
            selectElement.addEventListener('change', function() {
                if ((!urlParamsAux.has('tid'))&&(GM_getValue("tacticsResultsFlag"))){
                    setTimeout(function () { waitToDOM(tactisResumeData, ".group", 0,7000)}, 100);
                }
                if(GM_getValue("eloNextMatchesFlag")){
                    //waitToDOM(nextMatches, ".group", 0,7000)
                }
                if(GM_getValue("eloPlayedMatchesFlag")){
                    waitToDOM(lastMatchesELO, ".group", 0,7000)
                }
            });
        }


        const today = new Date();

        today.setDate(today.getDate() + 2);
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        let finalDate = `${year}-${month}-${day}`;

        let initialDate="undefined"



        let elems = document.getElementsByClassName("group");
        Array.from(elems).forEach(function(elem) {
            initialDate=getParsedValidDateText(elem.innerText)
        });

        getUsernameData()


        let team_id
        let urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('tid')){
            team_id=urlParams.get("tid")
        }else{

            if(window.sport==="soccer"){
                team_id=GM_getValue("soccer_team_id")
            }else{
                team_id=GM_getValue("hockey_team_id")
            }

            if(team_id===undefined){
                team_id=document.getElementById("tid1").value
            }

        }

        let clase="loader-"+window.sport
        elems = document.getElementsByClassName("bold score-cell-wrapper textCenter flex-grow-0");
        Array.from(elems).forEach(function(elem) {
            elem.innerHTML+="</br><div id='hp_loader' class='"+clase+"'></div>"

        });


        GM_xmlhttpRequest({
            method: "GET",
            url: "https://statsxente.com/MZ1/Functions/tamper_elo_matches.php?sport=" + window.sport + "&team_id="+team_id+"&initial_date="+initialDate+"&final_date="+finalDate,
            headers: {
                "Content-Type": "application/json"
            },
            onerror: function () {notifySnackBarError("ELO Played Matches")},
            onload: function (response) {
                let jsonResponse = JSON.parse(response.responseText);
                let elems = document.getElementsByClassName("bold score-cell-wrapper textCenter flex-grow-0");

                Array.from(elems).forEach(function(elem) {

                    let links = elem.getElementsByClassName('score-hidden gray');
                    let href = links[0].getAttribute('href');
                    let urlParams = new URLSearchParams(href.split('?')[1]);
                    let mid = parseInt(urlParams.get('mid'));

                    if(mid in jsonResponse){

                        let diff=jsonResponse[mid]['score']-jsonResponse[mid]['old_score']
                        diff = diff.toFixed(2)

                        let symbol="";
                        let status="down";
                        if(diff>0){
                            symbol="+";
                            status="up";
                        }

                        elem.innerHTML+="<div id='showELOChange' style='display: flex;align-items: center;'>"+symbol+diff+"<img alt='' src='https://statsxente.com/MZ1/View/Images/"+status+".png' width='10px' height='10px'/></div>";
                    }


                });

                const elementos = document.querySelectorAll('.'+clase);
                elementos.forEach(elemento => elemento.remove());

            }



        });






    }
//Federation clash page
    function clash() {

        let badges = document.getElementsByClassName("fed_badge");
        let regex = /fid=(\d+)/;
        let srcLocal = badges[0].getAttribute('src');
        let local_id = srcLocal.match(regex);
        let src_away = badges[1].getAttribute('src');
        let away_id = src_away.match(regex);
        let names = document.getElementsByClassName("name-score text-ellipsis")
        let homeName=encodeURIComponent(names[0].innerText)
        let awayName=encodeURIComponent(names[1].innerText)
        let elems = document.getElementsByClassName("top-pane__deadline");
        let tabla = elems[0]

        GM_xmlhttpRequest({
            method: "GET",
            url: "https://statsxente.com/MZ1/Functions/tamper_federations_clash_data.php?currency=" + GM_getValue("currency") + "&sport=" + window.sport +"&home="+local_id[1]+"&away="+away_id[1],
            headers: {
                "Content-Type": "application/json"
            },
            onerror: function() {
                notifySnackBarError("Federations Data");
            },
            onload: function (response) {
                let jsonResponse = JSON.parse(response.responseText);



                let contenidoNuevo = "</br></br><table class='hitlist challenges-list' style='width:45%; margin: 0 auto; table-layout:unset; border-collapse:collapse; margin: 0 auto; padding: 7px;'><thead><tr>"
                contenidoNuevo+="<th style='border-top-left-radius: 5px; padding: 5px; font-weight: bold;'>Clash Compare</td>"
                contenidoNuevo+="<th style='border-top-right-radius: 5px; padding: 5px; font-weight: bold;'>Clash Matcher</td></tr>"
                contenidoNuevo+="</thead><tr><td style='border-bottom-left-radius: 5px; background-color:#ffffe5; padding: 5px;'><img alt='' id=clashCompare src='https://www.statsxente.com/MZ1/View/Images/clash_compare.png' style='width:45px; height:45px; cursor:pointer;'/></center></td>"
                contenidoNuevo+=""
                contenidoNuevo+="<td style='border-bottom-right-radius: 5px; background-color:#ffffe5; padding: 5px;'><img alt='' id=clashMatcher src='https://www.statsxente.com/MZ1/View/Images/clash_icon.png' style='width:45px; height:45px; cursor:pointer;'/></center></td>"
                contenidoNuevo+="</tr></table></center></br>";
                contenidoNuevo+="<table style='width:65%;margin: 0 auto; table-layout:unset;' class='hitlist challenges-list'><thead><tr>"
                contenidoNuevo+="<th colspan='2'>Rank</th><th>Value</th><th>LM Value</th><th>ELO Score</th></tr></thead>"
                contenidoNuevo+="<tbody>"

                contenidoNuevo+="<tr class='odd'>"

                contenidoNuevo+="<td style='text-align:right;'><img alt='' src='https://www.managerzone.com/dynimg/pic.php?type=federation&fid="+local_id[1]+"&size=medium&sport="+window.sport+"' width=35px height=35px/></td>"
                contenidoNuevo+="<td style='text-align:left;'>#"+jsonResponse[local_id[1]]["table_index"]+"</td>"

                let valor = new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[local_id[1]]["value"]))
                contenidoNuevo+="<td style='margin: 0 auto;'>"+valor+"</td>"
                valor = new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[local_id[1]]["valueLM"]))
                contenidoNuevo+="<td style='margin: 0 auto;'>"+valor+"</td>"
                valor = new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[local_id[1]]["elo"]))
                contenidoNuevo+="<td style='margin: 0 auto;'>"+valor+"</td>"

                contenidoNuevo+="</tr>"

                contenidoNuevo+="<tr class='even'>"
                contenidoNuevo+="<td style='text-align:right;'><img alt='' src='https://www.managerzone.com/dynimg/pic.php?type=federation&fid="+away_id[1]+"&size=medium&sport="+window.sport+"' width=35px height=35px/></td>"
                contenidoNuevo+="<td style='text-align:left;'>#"+jsonResponse[away_id[1]]["table_index"]+"</td>"


                valor = new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[away_id[1]]["value"]))
                contenidoNuevo+="<td style='margin: 0 auto;'>"+valor+"</td>"
                valor = new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[away_id[1]]["valueLM"]))
                contenidoNuevo+="<td style='margin: 0 auto;'>"+valor+"</td>"
                valor = new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[away_id[1]]["elo"]))
                contenidoNuevo+="<td style='margin: 0 auto;'>"+valor+"</td>"

                contenidoNuevo+="</tr>"

                contenidoNuevo+="</tbody>"
                contenidoNuevo+="</table></center>"
                tabla.insertAdjacentHTML('beforeend', contenidoNuevo)

                document.getElementById("clashCompare").addEventListener('click', function () {
                    let link = "https://statsxente.com/MZ1/Functions/loadClashFederationData.php?tamper=yes&fid=" + local_id[1] + "&fid1=" + away_id[1] + "&fede=" + homeName + "&fede1=" + awayName + "&idioma=" + window.lang + "&divisa=" + GM_getValue("currency") + "&sport=" + window.sport;
                    openWindow(link, 0.95, 1.25);
                });

                document.getElementById("clashMatcher").addEventListener('click', function () {
                    let link = "https://statsxente.com/MZ1/View/tamper_clashMatcher.php?fid=" + local_id[1] + "&fid1=" + away_id[1]+"&idioma=" + window.lang + "&divisa=" + GM_getValue("currency") + "&sport=" + window.sport;
                    openWindow(link, 0.95, 1.25);
                });

                names[0].innerText="(#"+jsonResponse[local_id[1]]["table_index"]+")"+names[0].innerText;
                names[1].innerText="(#"+jsonResponse[away_id[1]]["table_index"]+")"+names[1].innerText;




















                let tables = document.querySelectorAll('.hitlist');
                let table=tables[2]
                if(window.stx_device==="computer"){
                    const thead = table.querySelector("thead");
                    if (thead.children.length === 0) {
                        const th1 = document.createElement("th");
                        th1.innerText = "Equipo";
                        const th2 = document.createElement("th");
                        th2.innerText = "Resultado";
                        const nuevaFila = document.createElement("tr");
                        nuevaFila.appendChild(th1);
                        nuevaFila.appendChild(th2);
                        thead.appendChild(nuevaFila);
                    }

                }




                const colCount =  table.rows[0].cells.length;

                let eloCol=0
                let lmCol=1
                if(colCount>2){

                    eloCol=5
                    lmCol=6

                }


                table.id="clash_table";
                let contIds = 0
                let linkIds = ""
                let teamNameElement=""

                let index_init=0
                if(window.stx_device==="computer"){
                    index_init=1
                }


                for (let i = index_init; i < table.rows.length; i++) {
                    let row = table.rows[i];
                    if(window.stx_device==="computer"){
                        let thirdColumnCell = row.cells[eloCol];
                        teamNameElement = thirdColumnCell.querySelector('.team-name');

                        let href = teamNameElement.getAttribute('href');
                        let urlParams = new URLSearchParams(href.split('?')[1]);
                        let tid = urlParams.get('tid');
                        linkIds += "&idEquipo" + contIds + "=" + tid
                        contIds++

                    }else{
                        let flexs_elements = row.querySelector('.flex-grow-1');
                        if(flexs_elements){
                            let as=flexs_elements.getElementsByTagName("a")
                            let team_data=extractTeamData(as)


                            linkIds += "&idEquipo" + contIds + "=" + team_data[0]
                            contIds++


                        }

                    }

                }

                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://statsxente.com/MZ1/Functions/tamper_teams.php?currency=" + GM_getValue("currency") + "&sport=" + window.sport + linkIds,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    onerror: function(err) {
                        notifySnackBarError("Tamper Teams");
                    },
                    onload: function (response) {
                        let jsonResponse = JSON.parse(response.responseText);


                        let valor=0
                        let tid=0
                        if(window.stx_device==="computer"){
                            for (let i = 0; i < table.rows.length; i++) {
                                let row = table.rows[i];


                                if(i>0){

                                    let thirdColumnCell = row.cells[eloCol];
                                    let teamNameElement = thirdColumnCell.querySelector('.team-name');
                                    let href = teamNameElement.getAttribute('href');
                                    let urlParams = new URLSearchParams(href.split('?')[1]);
                                    tid = urlParams.get('tid');


                                }


                                let newCell1 = row.insertCell(eloCol);
                                if (i === 0) {

                                    let th = document.createElement('th');
                                    th.innerHTML = "ELO";
                                    th.style.width="50px";
                                    th.id="elo_th"
                                    newCell1.replaceWith(th);

                                } else {
                                    valor = new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[tid]["elo"]))
                                    newCell1.innerHTML = valor;
                                }

                                let newCell = row.insertCell(lmCol);
                                if (i === 0) {

                                    let th1 = document.createElement('th');
                                    th1.innerHTML = "LM Value";
                                    th1.style.width="80px";
                                    th1.id="lm_th"
                                    newCell.replaceWith(th1);
                                } else {
                                    valor = new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[tid]["valorUPSenior"]))
                                    newCell.innerHTML = valor;
                                }


                                if(eloCol===0){
                                    let rankCell = row.insertCell(eloCol);

                                    if (i === 0) {


                                        let th2 = document.createElement('th'); // Creamos un elemento 'th'
                                        th2.innerHTML = "Rank";
                                        th2.style.width="50px";
                                        rankCell.replaceWith(th2);


                                    }else{
                                        rankCell.innerHTML = i

                                    }
                                }



                            }


                            if(eloCol===0){
                                eloCol++;
                                lmCol++;
                            }

                            document.getElementById("elo_th").addEventListener("click", function () {

                                ordenarTabla(eloCol, false, "clash_table",true);
                            });


                            document.getElementById("lm_th").addEventListener("click", function () {

                                ordenarTabla(lmCol, false, "clash_table",true);
                            });


                        }else{

                            //MOBILE VIEW

                            for (let i = 0; i < table.rows.length; i++) {
                                let row = table.rows[i];


                                let flexs_elements = row.querySelector('.flex-grow-1');
                                if(flexs_elements){
                                    let as=flexs_elements.getElementsByTagName("a")
                                    let team_data=extractTeamData(as)
                                    let valor = new Intl.NumberFormat(window.userLocal).format(Number.parseFloat(jsonResponse[team_data[0]]["valorUPSenior"]).toFixed(0))
                                    let elo = new Intl.NumberFormat(window.userLocal).format(Number.parseFloat(jsonResponse[team_data[0]]["elo"]).toFixed(0))
                                    let txt="<table><tr><td>LM Value</td><td>"+valor+"</td></tr><tr><td>ELO</td><td>"+elo+"</td></tr></table>"


                                    flexs_elements.innerHTML+=txt
                                }


                            }

                        }

                    }



                });





            }

        });


    }
//Player stats on Top Scorers table
    function playerStatsOnTopScores(table,link,valor,keyValue,teamId){
        GM_xmlhttpRequest({
            method: "GET",
            url: link,
            headers: {
                "Content-Type": "application/json"
            },
            onerror: function() {
                notifySnackBarError("Players stats");
            },
            onload: function (response) {
                let jsonResponse = JSON.parse(response.responseText);
                let cont=0;
                let flag=false;

                let tbody=table.querySelectorAll("tbody");

                let thead=table.querySelectorAll("thead");
                let rows=thead[0].querySelectorAll("tr");
                if(rows[0].cells[3].id!=="position"){
                    flag=true;
                    rows[0].insertCell(5).innerHTML = '<div style="text-align: center;">Stats Xente</div>';
                    rows[0].insertCell(3).innerHTML = "Position";
                    rows[0].cells[3].id = "position";
                    rows[0].cells[3].style.textDecoration = "underline"

                }
                let ths=thead[0].querySelectorAll("th")
                let aTh= ths[4].querySelectorAll("a")
                aTh[0].textContent=keyValue

                tbody[0].querySelectorAll("tr").forEach(row => {
                    row.classList.remove('highlight_row');
                    if(row.style.display==="none"){row.style.display="table-row"}

                    if(cont<jsonResponse.length){
                        if(teamId>-1){
                            if(teamId===jsonResponse[cont]["idEquipo"]){
                                row.classList.add('highlight_row');
                            }
                        }
                        let tds = row.querySelectorAll("td");
                        var buttonData='<div style="text-align: center;"><img alt="" id="stx_pl_'+jsonResponse[cont]["idJugador"]+'" src="https://statsxente.com/MZ1/View/Images/main_icon.png" style="cursor:pointer; width: 17px; height: 17px; border: none; vertical-align: middle; padding: 0 4px 0 0; margin: 0;"></div>'
                        var keyTable=4;
                        var keyTable1=3;
                        if(flag){
                            row.insertCell(3).innerHTML = "<img alt='' src='https://statsxente.com/MZ1/View/Images/"+jsonResponse[cont]["img"]+".png' width='10px' height='10px'/> "+jsonResponse[cont]["posicion"];
                            row.insertCell(6).innerHTML=buttonData
                        }else{
                            tds[3].innerHTML="<img alt='' src='https://statsxente.com/MZ1/View/Images/"+jsonResponse[cont]["img"]+".png' width='10px' height='10px'/> "+jsonResponse[cont]["posicion"];
                            tds[6].innerHTML=buttonData
                            keyTable1=4;
                            keyTable=5;
                        }


                        (function (currentId, currentTeamId, currentSport, lang, team_name, player_name) {
                            document.getElementById("stx_pl_" + currentId).addEventListener('click', function () {

                                let link = "https://statsxente.com/MZ1/Functions/tamper_player_stats.php?sport=" + currentSport
                                    + "&player_id=" + currentId + "&team_id=" + currentTeamId + "&idioma=" + lang + "&divisa=" + GM_getValue("currency") +
                                    "&team_name=" + encodeURIComponent(team_name) + "&player_name=" + encodeURIComponent(player_name)
                                openWindow(link, 0.95, 1.25);
                            });
                        })(jsonResponse[cont]["idJugador"],jsonResponse[cont]["idEquipo"], window.sport, window.lang,jsonResponse[cont]["equipo"],jsonResponse[cont]["nombre"]);


                        //Player
                        let player=tds[1].getElementsByClassName("player_link")
                        player[0].textContent=jsonResponse[cont]["nombre"]
                        let as = tds[1].querySelectorAll("a");
                        as[0].href="?p=players&pid="+jsonResponse[cont]["idJugador"];
                        let images = tds[1].querySelectorAll("img");
                        images[0].src="nocache-929/img/flags/12/"+jsonResponse[cont]["paisJugador"]+".png";

                        //Team
                        let team=tds[2].querySelectorAll("a")
                        if(team.length===0){
                            tds[2].innerHTML='<img title="Spain" src="https://www.managerzone.com/nocache-930/img/flags/12/es.png" width="12" height="12" style="border: none" alt="">&nbsp;<a href="/?p=team&amp;tid=771617" title="Xente" style="text-transform: uppercase;">STX</a>'
                        }
                        team=tds[2].querySelectorAll("a")
                        team[0].textContent=jsonResponse[cont]["equipo"]
                        images = tds[2].querySelectorAll("img");
                        images[0].src="nocache-929/img/flags/12/"+jsonResponse[cont]["paisEquipo"]+".png";
                        as = tds[2].querySelectorAll("a");
                        as[0].href="?p=team&tid="+jsonResponse[cont]["idEquipo"];
                        team[0].style.textTransform="none"

                        //Played Matches
                        tds[keyTable1].innerHTML=jsonResponse[cont]["numPartidos"]

                        if(valor=="pos/numPartidos"){
                            let parsedValue=jsonResponse[cont][valor]
                            const minutos = Math.floor(parsedValue / 60);
                            const restoSegundos = parsedValue % 60;
                            const posesion = `${String(minutos).padStart(2, '0')}:${String(restoSegundos).padStart(2, '0')}`;
                            tds[keyTable].innerHTML=posesion
                        }else{

                            if(valor.includes("mins")){
                                tds[keyTable].innerHTML=jsonResponse[cont][valor]
                            }else{


                                if((valor.includes("*"))||(valor.includes("/"))||(valor.includes("nota"))||(valor.includes("dist"))){

                                    tds[keyTable].innerHTML=jsonResponse[cont][valor].toFixed(2)
                                }else{
                                    tds[keyTable].innerHTML=jsonResponse[cont][valor]
                                }
                            }

                        }


                    }else{
                        row.style.display = 'none';
                    }

                    cont++;

                });



                deleteCols(table,7)
                document.getElementById("hp_loader").remove()

            }


        });



    }
//Leagues page
    async function leagues() {
        let tablesSearch=document.getElementsByClassName("nice_table")
        let clear = tablesSearch[0].previousElementSibling;
        let selectsDiv=clear.querySelectorAll('select');
        let selectKey=0;
        if(selectsDiv.length>1){
            selectKey=1;
        }
        let idLiga=selectsDiv[selectKey].value
        let typeKey
        let urlParams1 = new URLSearchParams(window.location.search);
        if (urlParams1.has('type')) {
            typeKey = urlParams1.get("type")
        } else {
            typeKey = "friendlyseries"
        }

        GM_xmlhttpRequest({
            method: "GET",
            url: "http://statsxente.com/MZ1/Functions/tamper_teams_stats_records.php?table="+statsKeys[typeKey+"_"+window.sport]+"&idLiga="+idLiga+"&categoria="+cats_stats[typeKey],
            headers: {
                "Content-Type": "application/json"
            },
            onerror: function() {
                notifySnackBarError("Teams");
            },
            onload: function (response) {
                teams_stats=JSON.parse(response.responseText);
            },
        });



        let urlParams = new URLSearchParams(window.location.search);
        let initialValues = {};
        initialValues["senior"] = GM_getValue("league_default_senior");
        initialValues["world"] = GM_getValue("league_default_senior");
        initialValues["u23"] = GM_getValue("league_default_u23");
        initialValues["u21"] = GM_getValue("league_default_u21");
        initialValues["u18"] = GM_getValue("league_default_u18");
        initialValues["u23_world"] = GM_getValue("league_default_u23");
        initialValues["u21_world"] = GM_getValue("league_default_u21");
        initialValues["u18_world"] = GM_getValue("league_default_u18");

        let eloKeys = {};
        eloKeys["senior"] = "elo"
        eloKeys["world"] = "elo"
        eloKeys["u23"] = "elo23"
        eloKeys["u21"] ="elo21"
        eloKeys["u18"] = "elo18"
        eloKeys["u23_world"] = "elo23"
        eloKeys["u21_world"] = "elo21"
        eloKeys["u18_world"] = "elo18"

        let linkIds = ""
        let elems = document.getElementsByClassName("nice_table");
        let tabla = elems[0]
        tabla.style.overflowX = 'auto';
        tabla.style.display='block'
        tabla.style.maxWidth='100%'
        let thSegundo = tabla.querySelector("thead th:nth-child(2)");
        thSegundo.style.width = "250px";


        let values = new Map();
        values.set('valor23', 'U23 Value');
        values.set('valor21', 'U21 Value');
        values.set('valor18', 'U18 Value');
        values.set('salario', 'Salary');
        values.set('valorUPSenior', 'LM Value');
        values.set('valorUPSUB23', 'U23 LM Value');
        values.set('valorUPSUB21', 'U21 LM Value');
        values.set('valorUPSUB18', 'U18 LM Value');
        values.set('edad', 'Age');
        if (window.sport === "soccer") {
            values.set('valor11', 'TOP 11');
            values.set('valor11_23', 'U23 TOP 11');
            values.set('valor11_21', 'U21 TOP 11');
            values.set('valor11_18', 'U18 TOP 11');
        } else {
            values.set('valor11', 'TOP 21');
            values.set('valor11_23', 'U23 TOP 21');
            values.set('valor11_21', 'U21 TOP 21');
            values.set('valor11_18', 'U18 TOP 21');
        }

        values.set('noNac', 'Foreigners');
        values.set('elo', 'ELO Score');
        values.set('elo23', 'U23 ELO Score');
        values.set('elo21', 'U21 ELO Score');
        values.set('elo18', 'U18 ELO Score');
        values.set('numJugadores', 'Number of players');

        if (urlParams.get('type') === "senior") {
            values.set('leagues', 'Leagues');
            values.set('world_leagues_all', 'World Leagues');
            values.set('youth_leagues_all', 'Youth Leagues');
            values.set('world_youth_leagues_all', 'Youth World Leagues');
            values.set('federation_leagues', 'Federation Leagues');
        }


        if (urlParams.get('type') === "world") {
            values.set('leagues_all', 'Leagues');
            values.set('world_leagues', 'World Leagues');
            values.set('youth_leagues_all', 'Youth Leagues');
            values.set('world_youth_leagues_all', 'Youth World Leagues');
            values.set('federation_leagues', 'Federation Leagues');
        }


        if ((urlParams.get('type').includes("u")) && (!urlParams.get('type').includes("_"))) {
            let actual_cat = urlParams.get('type').toUpperCase();
            GM_setValue("actual_league_cat", actual_cat)
            values.set('leagues_all', 'Leagues');
            values.set('world_leagues_all', 'World Leagues');
            values.set('youth_leagues', actual_cat + ' Youth Leagues');
            values.set('world_youth_leagues_all', 'Youth World Leagues');
            values.set('federation_leagues', 'Federation Leagues');
        }


        if ((urlParams.get('type').includes("u")) && (urlParams.get('type').includes("_"))) {
            let actual_cat = urlParams.get('type').substring(0, 3).toUpperCase();
            GM_setValue("actual_league_cat", actual_cat)
            values.set('leagues_all', 'Leagues');
            values.set('world_leagues_all', 'World Leagues');
            values.set('youth_leagues_all', 'Youth Leagues');
            values.set('world_youth_leagues', actual_cat + ' Youth World Leagues');
            values.set('federation_leagues', 'Federation Leagues');
        }
        values.set('cup', 'Cups');
        values.set('cup_u23', 'U23 Cups');
        values.set('cup_u21', 'U21 Cups');
        values.set('cup_u18', 'U18 Cups');
        values.set('special_cup', 'Special Cups');
        values.set('transfer_value', 'Transfers Cost');
        values.set('transfer_value23', 'U23 Transfers Cost');
        values.set('transfer_value21', 'U21 Transfers Cost');

        values.set('elo_promedio', 'Average ELO');

        values.set('tmvalueSenior', 'LM Transfers Cost');
        values.set('tmvalueSUB23', 'U23 LM Transfers Cost');
        values.set('tmvalueSUB21', 'U21 LM Transfers Cost');

        let contenidoNuevo = '<div id=testClick style="margin: 0 auto;">';


        getNativeTableStyles();

        let idProgress = "noProgress";
        if (urlParams.get('type') === "senior") {
            idProgress = "divProgress"
        }


        let widthTable = "1.5em"
        ///MENU TABLE
        contenidoNuevo += "<table id=showMenu style='width:95%; margin: 0 auto;'><thead style='margin: 0 auto; background-color:" + GM_getValue("bg_native") + "; color:" + GM_getValue("color_native") + ";'><tr>";
        contenidoNuevo += '<th style="text-align:center; margin: 0 auto; padding:4px;">Stats</th>'
        contenidoNuevo +='<th  style="text-align:center; margin: 0 auto; padding:4px;">Graph</th>';
        contenidoNuevo += "<th style='text-align:center; margin: 0 auto; padding:4px;'>History</th>";
        contenidoNuevo += "<th style='text-align:center; margin: 0 auto; padding:4px;'>Top Players</th></tr></thead>";
        contenidoNuevo += "<tr>";
        contenidoNuevo += "<td style='margin: 0 auto; text-align:center; padding:4px; max-width: " + widthTable + "; width:" + widthTable + ";'><img alt='' id='detailDivision' style='cursor:pointer;' src=https://statsxente.com/MZ1/View/Images/detail.png width=25 height=25/></td>";
        contenidoNuevo += "<td style='margin: 0 auto; text-align:center; padding:4px; max-width:" + widthTable + ";  width:" + widthTable + ";'><img alt='' id='graphDivision' style='cursor:pointer;' src=https://statsxente.com/MZ1/View/Images/report.png width=31 height=25/></td>";
        if (idProgress === "noProgress") {
            contenidoNuevo += "<td style='margin: 0 auto; text-align:center; padding:4px; max-width: " + widthTable + ";  width: " + widthTable + ";'><img alt='' id='" + idProgress + "' style='cursor:pointer;' src=https://statsxente.com/MZ1/View/Images/graph_disabled.png width=25 height=25/></td>";
        } else {
            contenidoNuevo += "<td style='margin: 0 auto; text-align:center; padding:4px; max-width: " + widthTable + ";  width: " + widthTable + ";'><img alt='' id='" + idProgress + "' style='cursor:pointer;' src=https://statsxente.com/MZ1/View/Images/graph.png width=25 height=25/></td>";
        }
        contenidoNuevo += "<td style='margin: 0 auto; text-align:center; padding:4px; max-width: " + widthTable + ";  width: " + widthTable + ";'><img alt='' id='topPlayersDivision' style='cursor:pointer;' src=https://statsxente.com/MZ1/View/Images/top-10.png width=25 height=25/></td>";
        contenidoNuevo += "</tr>";

        let styleTable = " style='width:95%; margin: 0 auto; display:none;'";
        let styleIcon = ""
        let styleSep = "style='padding-top:5px;'";

        if (GM_getValue("show_league_selects") === true) {
            styleTable = " style='width:95%; margin: 0 auto;'";
            styleIcon = " active"
            styleSep = " style='display:none;'";
        }


        contenidoNuevo += "<tr><td></td><td colspan='2'>";
        contenidoNuevo += '<div id="moreInfo" class="expandable-icon' + styleIcon + '" style="margin: 0 auto; cursor:pointer; background-color:' + GM_getValue("bg_native") + ';"><div id="line1" class="line"></div><div  id="line2" class="line"></div></div></center>';
        contenidoNuevo += "</td><td></td></tr>";
        contenidoNuevo += "<tr><td colspan='5' id='separatorTd'" + styleSep + "></td></tr>";
        contenidoNuevo += "</table></center>";
        contenidoNuevo += '<table id=show3' + styleTable + '><tr><td><label>';

        if ((urlParams.get('type') === 'senior') || (urlParams.get('type') === 'world')) {
            if ("valor" === initialValues[urlParams.get('type')]) {
                contenidoNuevo += '<input class="statsxente" type="checkbox" checked id="valor" value="Value">Value</label></td>';
            } else {
                contenidoNuevo += '<input class="statsxente" type="checkbox" id="valor" value="Value">Value</label></td>';
            }
        } else {
            contenidoNuevo += '<input class="statsxente" type="checkbox" id="valor" value="Value">Value</label></td>';
        }

        values.forEach(function (valor, clave) {

            if (clave === "valorUPSenior") {
                contenidoNuevo += "</tr><tr>";
            }

            if (clave === "valor11") {
                contenidoNuevo += "</tr><tr>";
            }
            if (clave === "elo") {
                contenidoNuevo += "</tr><tr>";
            }

            if (clave === "leagues") {
                contenidoNuevo += "</tr><tr>";
            }

            if (clave === "leagues_all") {
                contenidoNuevo += "</tr><tr>";
            }

            if (clave === "cup") {
                contenidoNuevo += "</tr><tr>";
            }

            if (clave === "transfer_value") {
                contenidoNuevo += "</tr><tr>";
            }


            if (clave === "tmvalueSenior") {
                contenidoNuevo += "<td></td>";
            }
            if (clave === "tmvalueSenior") {
                contenidoNuevo += "</tr><tr>";
            }


            if (clave === initialValues[urlParams.get('type')]) {
                contenidoNuevo += '<td><label><input class="statsxente" type="checkbox" checked value="' + valor + '" id="' + clave + '">' + valor + '</label></td>';
            } else {
                contenidoNuevo += '<td><label><input class="statsxente" type="checkbox" value="' + valor + '" id="' + clave + '">' + valor + '</label></td>';
            }
        });

        let cats_elo = {}
        cats_elo["senior"] = "SENIOR";
        cats_elo["world"] = "SENIOR";
        cats_elo["u23"] = "U23";
        cats_elo["u21"] = "U21";
        cats_elo["u18"] = "U18";
        cats_elo["u23_world"] = "U23";
        cats_elo["u21_world"] = "U21";
        cats_elo["u18_world"] = "U18";

        //RELLENO EN BLANCO TABLA
        contenidoNuevo += "<td></td>";
        contenidoNuevo += "<td></td>";


        let cats_temp=["SENIOR","U23","U21","U18"];
        contenidoNuevo += "</tr>"
        contenidoNuevo +="<tr style='margin: 0 auto; text-align: center;'>"
        contenidoNuevo += '<td colspan="2"><label><input class="statsxente" type="checkbox" value="ELOCompare" id="ELOCompare">ELO Compare</label></td>';
        contenidoNuevo += '<td colspan="1"></td>';
        contenidoNuevo += '<td colspan="2"><label><input class="statsxente" type="checkbox" value="TeamStats" id="TeamStats">Team Stats</label></td>';
        contenidoNuevo +="</tr>"
        contenidoNuevo +='<tr style="margin: 0 auto; text-align: center; display:none;" id="trELOCompare"><td colspan="5">Category: '
        contenidoNuevo+='<select id="catSelect" style="background-color: '+GM_getValue("bg_native")+'; padding: 6px 3px; border-radius: 3px; width: 9em; border-color: white; color: '+GM_getValue("color_native")
        contenidoNuevo+='; font-family: Roboto; font-weight: bold; font-size: revert;">'
        for (let i = 0; i < cats_temp.length; i++) {
            let tmp=""
            if(cats_elo[urlParams.get('type')]===cats_temp[i]){
                tmp="selected"
            }
            contenidoNuevo+="<option value='"+cats_temp[i]+"' "+tmp+">"+cats_temp[i]+"</option>"
        }
        contenidoNuevo +='</select>  <button class="btn-save" style="color:'+GM_getValue("color_native")+'; background-color:'+GM_getValue("bg_native")+'; font-family: \'Roboto\'; font-weight:bold; font-size:revert;" id="eloCompareButton"><i class="bi bi-graph-up" style="font-style:normal;"> ELO Compare</i></button></td></tr>'

        //Team Stats data
        contenidoNuevo +='<tr style="margin: 0 auto; text-align: center; display:none;" id="trTeamStats"><td colspan="5">Stats: '
        contenidoNuevo+='<select id="statsSelect" style="background-color: '+GM_getValue("bg_native")+'; padding: 6px 3px; border-radius: 3px; width: 9em; border-color: white; color: '+GM_getValue("color_native")
        contenidoNuevo+='; font-family: Roboto; font-weight: bold; font-size: revert;">'
        contenidoNuevo+=GM_getValue("statsTeamsSelect_"+window.sport)

        contenidoNuevo +='</select>'
        contenidoNuevo +="</table></center>"
        contenidoNuevo += "</div></br>";
        values.set('valor', 'Value');
        let color=GM_getValue("bg_native")
        let darkerColor = darkenColor(color, 25);
        document.styleSheets[0].insertRule(
            '.btn-save:hover { background-color: '+darkerColor+' !important; }',
            document.styleSheets[0].cssRules.length
        );

        elems = document.getElementsByClassName("nice_table");
        tabla = elems[0]
        tabla.insertAdjacentHTML('beforebegin', contenidoNuevo);




        //Team Stats

        document.getElementById("TeamStats").addEventListener('click', function () {

            let checkboxes = document.querySelectorAll('.statsxente');
            checkboxes.forEach(function (checkbox) {
                if (checkbox.id !== "TeamStats") {
                    checkbox.checked = false;
                }
            });

            if(document.getElementById("trTeamStats").style.display==="none"){
                document.getElementById("trTeamStats").style.display="table-row";
                document.getElementById("trELOCompare").style.display="none";
            }else{
                document.getElementById("trTeamStats").style.display="none";
            }

        });


        document.getElementById("statsSelect").addEventListener('change', function () {

            let elems = document.getElementsByClassName("nice_table");
            let tabla = elems[0]
            let filas = tabla.getElementsByTagName("tbody")[0].getElementsByTagName("tr");

            for (let i = 0; i < filas.length; i++) {
                if (checkClassNameExists(filas[i], searchClassName)) {
                    let celda = filas[i].cells[1];
                    let team_data=extractTeamData(celda.getElementsByTagName("a"));
                    let id=team_data[0]
                    let celdas = filas[i].getElementsByTagName("td");
                    let ultimaCelda = celdas[celdas.length - 2];
                    let selects = document.getElementsByTagName('select');
                    let index_select = 1;
                    if (selects[index_select] === undefined) {
                        index_select = 0;
                    }
                    let valor=0
                    if (teams_stats[id] === undefined) {
                        valor = -1
                    } else {

                        let parsedValue=evaluarExpresion(document.getElementById("statsSelect").value,teams_stats[id])
                        valor = new Intl.NumberFormat(window.userLocal).format(Number.parseFloat(parsedValue).toFixed(2))
                        if(document.getElementById("statsSelect").value=="pos/numPartidos"){
                            const minutos = Math.floor(parsedValue / 60);
                            const restoSegundos = parsedValue % 60;
                            valor=`${String(minutos).padStart(2, '0')}:${String(restoSegundos).padStart(2, '0')}`;
                        }

                    }

                    ultimaCelda.innerHTML = valor;
                }
            }




            let thead = tabla.querySelector('thead');
            let tr = thead.querySelectorAll('tr');
            let td = tr[0].querySelectorAll('th');
            let select = document.getElementById("statsSelect");
            td[td.length - 2].textContent = select.options[select.selectedIndex].text



        });




        document.getElementById("eloCompareButton").style.padding = "5px 3px";
        document.getElementById("eloCompareButton").style.width = "9em";

        document.getElementById("eloCompareButton").addEventListener('click', function () {
            let elems = document.getElementsByClassName("nice_table");
            let tabla = elems[0]
            let link="https://statsxente.com/MZ1/Functions/graphLoader.php?graph=elo_compare&lang="+window.lang+"&category="+document.getElementById("catSelect").value+"&sport="+window.sport
            let cont=0
            for (let i = 0; i < tabla.rows.length; i++) {
                let fila = tabla.rows[i];
                if (fila.cells.length > 1) {
                    let checkboxes = fila.cells[1].querySelectorAll("input[type='checkbox']");
                    checkboxes.forEach(function(checkbox) {
                        if(checkbox.checked){
                            if(cont<5){
                                link+="&team_name"+cont+"="+encodeURIComponent(checkbox.value)+"&team_id"+cont+"="+checkbox.id
                                cont++;
                            }
                        }
                    });
                }
            }
            openWindow(link, 0.95, 1.25);
        });
        document.getElementById("ELOCompare").addEventListener('click', function () {
            let checkboxes = document.querySelectorAll('.statsxente');
            checkboxes.forEach(function (checkbox) {
                if (checkbox.id !== "ELOCompare") {
                    checkbox.checked = false;
                }
            });
            if(!document.getElementById("eloCompareCol")){
                let elems = document.getElementsByClassName("nice_table");
                let tabla = elems[0]
                for (let fila of tabla.rows) {
                    const nuevaCelda = fila.rowIndex === 0 ? document.createElement('th') : document.createElement('td');
                    if(fila.rowIndex>0){
                        let team_data=extractTeamData(fila.cells[1].getElementsByTagName('a'))
                        nuevaCelda.innerHTML = '<input class="statsxente1" type="checkbox" value="'+team_data[1]+'" id="'+team_data[0]+'">';
                    }

                    fila.insertBefore(nuevaCelda, fila.cells[1]);
                    if(fila.rowIndex===0){
                        fila.cells[1].id="eloCompareCol"
                        fila.cells[2].style.width="175px"
                    }
                }
            }else{
                let elems = document.getElementsByClassName("nice_table");
                let table = elems[0]
                let th = document.getElementById("eloCompareCol");
                let columnIndex = th.cellIndex;
                for (let i = 0; i < table.rows.length; i++) {
                    let row = table.rows[i];
                    let cell = row.cells[columnIndex];
                    if (cell.style.display === 'none') {
                        cell.style.display = '';
                        th.style.fontWeight = 'normal';
                    } else {
                        cell.style.display = 'none';
                        th.style.fontWeight = 'bold';
                    }
                }
            }

            if(document.getElementById("trELOCompare").style.display==="none"){
                document.getElementById("trELOCompare").style.display="table-row";
                document.getElementById("trTeamStats").style.display="none";

            }else{
                document.getElementById("trELOCompare").style.display="none";
            }

        });

        if (GM_getValue("show_league_selects") === true) {
            document.getElementById("line2").style.transform = 'rotateZ(0deg)';
            document.getElementById("line1").style.transform = 'rotateZ(180deg)';
            document.getElementById("moreInfo").style.transform = 'rotateZ(0deg)';
        }

        values.forEach(function (valor, clave) {
            let elemento = document.getElementById(clave);
            elemento.addEventListener('click', handleClick);
        });

        let nuevaCeldaEncabezado = document.createElement("th");
        nuevaCeldaEncabezado.textContent = values.get(initialValues[urlParams.get('type')]);
        nuevaCeldaEncabezado.style.textAlign = 'center';
        nuevaCeldaEncabezado.style.maxWidth = '6.5em';
        nuevaCeldaEncabezado.style.width = '6.5em';
        nuevaCeldaEncabezado.style.whiteSpace = 'nowrap';
        nuevaCeldaEncabezado.style.overflow = 'hidden';
        nuevaCeldaEncabezado.style.textOverflow = 'ellipsis';
        document.getElementsByClassName("seriesHeader")[0].appendChild(nuevaCeldaEncabezado);

        nuevaCeldaEncabezado = document.createElement("th");
        nuevaCeldaEncabezado.textContent = "Stats Xente";
        nuevaCeldaEncabezado.style.textAlign = 'center';
        document.getElementsByClassName("seriesHeader")[0].appendChild(nuevaCeldaEncabezado);


        if (tabla.getElementsByTagName("tbody")[0].innerHTML.includes("mazyar")) {
            searchClassName = "responsive-hide"
        }

        let contIds = 0
        let filasDatos = tabla.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
        for (let i = 0; i < filasDatos.length; i++) {
            if (checkClassNameExists(tabla.rows[i + 1], searchClassName)) {
                let celda = tabla.rows[i + 1].cells[1];
                let team_data=extractTeamData(celda.getElementsByTagName("a"));
                let id=team_data[0]
                let equipo=team_data[1]
                linkIds += "&idEquipo" + contIds + "=" + id
                contIds++
                celda.innerHTML += "<input type='hidden' id='team_" + id + "' value='" + equipo + "'/>"
            }

        }
        let cat = cats[urlParams.get('type')]
        let enlace = document.getElementById('league_tab_schedule');
        let href = enlace.href;
        let url = new URL(href);
        let league_id = url.searchParams.get('sid');



        ///DIV PROGRESS
        setTimeout(function () {


            if (idProgress !== "noProgress") {
                (function (currentId, currentLSport, lang) {
                    document.getElementById("divProgress").addEventListener('click', function () {

                        let link = "https://statsxente.com/MZ1/Graficos/graficoProgresoDivision.php?idLiga=" + currentId + "&idioma=" + lang + "&divisa=" + GM_getValue("currency") + "&deporte=" + currentLSport;
                        openWindow(link, 0.95, 1.25);
                    });
                })(league_id, window.lsport, window.lang);

            }


            (function () {
                document.getElementById("moreInfo").addEventListener('click', function () {
                    document.getElementById("moreInfo").classList.toggle('active');

                    if (document.getElementById("moreInfo").classList.contains("active")) {
                        document.getElementById("line2").style.transform = 'rotateZ(0deg)';
                        document.getElementById("line1").style.transform = 'rotateZ(180deg)';
                        document.getElementById("moreInfo").style.transform = 'rotateZ(0deg)';
                        $('#separatorTd').fadeOut(1);
                        document.getElementById("separatorTd").style.paddingTop = "5px";
                        $('#show3').fadeIn('slow');
                    } else {
                        document.getElementById("line2").style.transform = 'rotateZ(45deg)';
                        document.getElementById("line1").style.transform = 'rotateZ(-45deg)';
                        document.getElementById("moreInfo").style.transform = 'rotateZ(45deg)';
                        $('#separatorTd').fadeIn(1);
                        $('#show3').fadeOut('slow');
                    }



                });
            })();

            (function (currentId, currentLSport, lang, currentCat) {
                document.getElementById("detailDivision").addEventListener('click', function () {
                    let url_ = "https://statsxente.com/MZ1/Functions/lecturaStatsDivisionesHistorico2.0.php"
                    if (window.sport === "hockey") {
                        url_ = "https://statsxente.com/MZ1/Functions/lecturaStatsDivisionesHockeyHistorico.php"
                    }

                    let link = url_ + "?tamper=yes&modal=yes&idLiga=" + currentId + "&idioma=" + lang + "&categoria=" + currentCat + "&season=75&season_actual=75";
                    openWindow(link, 0.95, 1.25);
                });
            })(league_id, window.lsport, window.lang, cat);

            (function (currentId, sport, lang) {
                document.getElementById("topPlayersDivision").addEventListener('click', function () {
                    let url_ = "https://statsxente.com/MZ1/Functions/tamper_top_players_division.php"
                    if (window.sport === "hockey") {
                        url_ = "https://statsxente.com/MZ1/Functions/tamper_top_players_division_hockey.php"
                    }
                    let link = url_ + "?league_id=" + currentId + "&sport=" + sport + "&category=" + cat + "&idioma=" + lang;
                    openWindow(link, 0.95, 1.25);
                });
            })(league_id, window.sport, window.lang, cat);

            (function (currentId, currentLSport, lang, currentCat) {
                document.getElementById("graphDivision").addEventListener('click', function () {
                    let url_sport = ""
                    if (window.sport === "hockey") {
                        url_sport = "Hockey"
                    }
                    let link = "https://statsxente.com/MZ1/View/filtroGraficoLinealDivisiones" + url_sport + ".php?tamper=yes&idLiga=" + currentId + "&idioma=" + lang + "&categoria=" + currentCat + "&season=75&season_actual=75&modal=yes&valor=nota";
                    openWindow(link, 0.95, 1.25);
                });
            })(league_id, window.lsport, window.lang, cat);


        }, 200);


        GM_xmlhttpRequest({
            method: "GET",
            url: "https://statsxente.com/MZ1/Functions/tamper_teams.php?currency=" + GM_getValue("currency") + "&sport=" + window.sport + linkIds,
            headers: {
                "Content-Type": "application/json"
            },
            onload: function (response) {
                let cat = window.cats[urlParams.get('type')]
                let jsonResponse = JSON.parse(response.responseText);
                teams_data = jsonResponse;
                let divELO=0;
                let filasDatos = tabla.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
                for (let i = 0; i < filasDatos.length; i++) {
                    if (checkClassNameExists(filasDatos[i], searchClassName)) {
                        let celda = filasDatos[i].cells[1];
                        let team_data=extractTeamData(celda.getElementsByTagName("a"));
                        let id=team_data[0]
                        let equipo=team_data[1]

                        divELO += parseFloat(jsonResponse[id][eloKeys[urlParams.get('type')]])

                        let nuevaColumna = document.createElement("td");
                        let valor = 0;
                        if (jsonResponse[id] && jsonResponse[id][initialValues[urlParams.get('type')]] !== undefined) {
                            valor = new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[id][initialValues[urlParams.get('type')]]))
                        }
                        nuevaColumna.innerHTML = valor
                        nuevaColumna.style.textAlign = 'center';
                        filasDatos[i].appendChild(nuevaColumna);

                        let eloType = 1

                        if (window.sport === "soccer") { eloType = 2 }
                        if (cat.includes("SUB")) { eloType = 3 }


                        let flagSenior = 0, flagSub23 = 0, flagSub21 = 0, flagSub18 = 0;
                        if (jsonResponse[id]["elo"] > 0) { flagSenior = 1 }
                        if (jsonResponse[id]["elo23"] > 0) { flagSub23 = 1 }
                        if (jsonResponse[id]["elo21"] > 0) { flagSub21 = 1 }
                        if (jsonResponse[id]["elo18"] > 0) { flagSub18 = 1 }

                        let buttonDisplay = "display:block;";
                        nuevaColumna = document.createElement("td");
                        nuevaColumna.style.margin = '0 auto';
                        nuevaColumna.style.textAlign = 'center';
                        let iner = "<img alt='' src='https://statsxente.com/MZ1/View/Images/detail.png' width='" + GM_getValue("league_image_size") + "px' height='" + GM_getValue("league_image_size") + "px' id='but" + id + "' style='cursor:pointer;'/>";
                        if (GM_getValue("league_graph_button") === "checked") {
                            buttonDisplay = ""
                        } else {
                            buttonDisplay = "display:none;";
                        }
                        iner += "<img alt='' src='https://statsxente.com/MZ1/View/Images/graph.png' width='" + GM_getValue("league_image_size") + "px' height='" + GM_getValue("league_image_size") + "px' id='but1" + id + "' style='cursor:pointer; " + buttonDisplay + "'/>";

                        if (GM_getValue("league_report_button") === "checked") {
                            buttonDisplay = ""
                        } else {
                            buttonDisplay = "display:none;";
                        }
                        iner += "<img alt='' src='https://statsxente.com/MZ1/View/Images/report.png' width='" + GM_getValue("league_image_size") + "px' height='" + GM_getValue("league_image_size") + "px' id='but2" + id + "' style='cursor:pointer; " + buttonDisplay + "'/>";

                        if (GM_getValue("league_calendar_button") === "checked") {
                            buttonDisplay = ""
                        } else {
                            buttonDisplay = "display:none;";
                        }
                        iner += " <img alt='' src='https://statsxente.com/MZ1/View/Images/calendar.png' width='" + GM_getValue("league_image_size") + "px' height='" + GM_getValue("league_image_size") + "px' id='but3" + id + "' style='cursor:pointer; " + buttonDisplay + "'/>";
                        cat = cats[urlParams.get('type')]
                        nuevaColumna.innerHTML = iner
                        filasDatos[i].appendChild(nuevaColumna);
                        nuevaColumna = document.createElement("td");


                        (function (currentId, currentLSport, lang) {
                            document.getElementById("but1" + currentId).addEventListener('click', function () {
                                let link = "https://statsxente.com/MZ1/Functions/graphLoader.php?graph=team_progress&idEquipo=" + currentId + "&idioma=" + lang + "&divisa=" + GM_getValue("currency") + "&deporte=" + currentLSport;
                                openWindow(link, 0.95, 1.25);
                            });
                        })(id, window.lsport, window.lang);

                        (function (currentId, currentLSport, lang) {
                            document.getElementById("but2" + currentId).addEventListener('click', function () {
                                let src = "filtroGraficoEquiposHistoricoHockey";
                                if (currentLSport === "F") {
                                    src = "filtroGraficoLinealEquiposHistorico";
                                }
                                let link = "https://statsxente.com/MZ1/View/" + src + ".php?tamper=yes&categoria=" + cat + "&idEquipo=" + currentId + "&idioma=" + lang + "&modal=yes&valor=nota&season=75&season_actual=75&equipo=-"
                                openWindow(link, 0.95, 1.25);
                            });
                        })(id, window.lsport, window.lang,cat);

                        (function (currentId, currentEquipo, currentCat, currentSport, lang) {
                            document.getElementById("but" + currentId).addEventListener('click', function () {

                                let link = "https://statsxente.com/MZ1/View/filtroStatsEquiposHistorico.php?tamper=no&idEquipo=" + currentId + "&idioma=" + lang + "&modal=yes&deporte=" + currentSport + "&season=77&season_actual=77&categoria=" + currentCat + "&equipo=" + currentEquipo + "&cerrar=no";
                                openWindow(link, 0.95, 1.25);
                            });
                        })(id, equipo, cat, window.sport, window.lang);

                        (function (currentId, type, currentCat, currentSport, lang, flagS, flagS23, flagS21, flagS18) {
                            document.getElementById("but3" + currentId).addEventListener('click', function () {
                                let link = "https://statsxente.com/MZ1/Graficos/graficoRachaEquipoELO.php?tamper=yes&team_id=" + currentId + "&idioma=" + lang + "&deporte=" + currentSport + "&type=" + type + "&cat=" + currentCat + "&flagSenior=" +
                                    flagS + "&flagSub23=" + flagS23 + "&flagSub21=" + flagS21 + "&flagSub18=" + flagS18;
                                openWindow(link, 0.95, 1.25);
                            });
                        })(id, eloType, cats_elo[urlParams.get('type')], window.sport, window.lang, flagSenior, flagSub23, flagSub21, flagSub18);

                    }

                }
                let headers = document.querySelectorAll('div.baz.bazCenter div.win_bg h1.win_title');
                headers[0].innerHTML+="<b> | ELO: "+Intl.NumberFormat(window.userLocal).format(Math.round(divELO))+" |</b>"
                let thead = document.getElementsByClassName("seriesHeader")[0]
                let ths = thead.querySelectorAll("th");
                ths.forEach(function (th, index) {
                    th.addEventListener("click", function () {
                        if (index === 1) {
                            ordenarTablaText(index, true, "nice_table",true);
                        } else {
                            ordenarTabla(index, true, "nice_table",true);
                        }

                    });
                });
            }
        });






    }
//Clash leagues page
    function clashLeagues() {

        document.getElementById("division-select").addEventListener('change', function () {
            setTimeout(function () {
                clashLeagues();
            }, 2000);
        });


        document.getElementById("season-select").addEventListener('change', function () {
            setTimeout(function () {
                clashLeagues();
            }, 2000);
        });




        let elems = document.getElementsByClassName("nice_table");
        let tabla = elems[0]
        let thSegundo = tabla.querySelector("thead th:nth-child(2)");
        thSegundo.style.width = "250px";
        let values = new Map();
        values.set('valueLM', 'LM Value');
        values.set('elo', 'ELO Score');
        values.set('teams_count', 'Number of teams');
        values.set('table_index', 'Rank Position');

        let contenidoNuevo = '<div id=testClick style="margin: 0 auto; text-align:center;">'
        getNativeTableStyles();

        ///MENU TABLE
        contenidoNuevo += "<table id=showMenu style='margin: 0 auto; text-align:center;'><thead style='background-color:" + GM_getValue("bg_native") + "; color:" + GM_getValue("color_native") + ";'><tr>";
        contenidoNuevo += '<th style="padding:4px; margin: 0 auto; text-align:center;" colspan="3">Values</th></tr></thead>';
        contenidoNuevo += "<tr>";
        contenidoNuevo += "</tr></table>";
        contenidoNuevo += '<table id=show3 style="margin: 0 auto; text-align:center;"><tr><td><label>';
        contenidoNuevo += '<input class="statsxente" type="checkbox" checked id="value" value="Value">Value</label></td>';


        values.forEach(function (valor, clave) {
            contenidoNuevo += '<td><label><input class="statsxente" type="checkbox" value="' + valor + '" id="' + clave + '">' + valor + '</label></td>';
        });
        contenidoNuevo += "</tr></table>"
        contenidoNuevo += "</div></br>";

        values.set('value', 'Value');
        elems = document.getElementsByClassName("nice_table");
        tabla = elems[0]
        tabla.insertAdjacentHTML('beforebegin', contenidoNuevo);



        values.forEach(function (valor, clave) {

            let elemento = document.getElementById(clave);
            elemento.addEventListener('click', handleClickClash);

        });
        let nuevaCeldaEncabezado = document.createElement("th");
        nuevaCeldaEncabezado.textContent = "Value";
        nuevaCeldaEncabezado.style.textAlign = 'center';

        document.getElementsByClassName("nice_table")[0].querySelector('thead').querySelector('tr').appendChild(nuevaCeldaEncabezado);

        nuevaCeldaEncabezado = document.createElement("th");
        nuevaCeldaEncabezado.textContent = "Stats Xente";
        nuevaCeldaEncabezado.style.textAlign = 'center';
        document.getElementsByClassName("nice_table")[0].querySelector('thead').querySelector('tr').appendChild(nuevaCeldaEncabezado);


        let contIds = 0
        let linkIds = ""
        let filasDatos = tabla.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
        for (let i = 0; i < filasDatos.length; i++) {
            let celda = tabla.rows[i + 1].cells[1];
            let imagen = celda.querySelector('img');
            let url = new URL(imagen.src);
            let id = url.searchParams.get('fid');
            linkIds += "&id" + contIds + "=" + id
            contIds++
        }


        GM_xmlhttpRequest({
            method: "GET",
            url: "https://statsxente.com/MZ1/Functions/tamper_federations.php?currency=" + GM_getValue("currency") + "&sport=" + window.sport + linkIds,
            headers: {
                "Content-Type": "application/json"
            },
            onload: function (response) {
                let jsonResponse = JSON.parse(response.responseText);
                teams_data = jsonResponse;
                let filasDatos = tabla.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
                for (let i = 0; i < filasDatos.length; i++) {
                    let celda = tabla.rows[i + 1].cells[1];
                    let imagen = celda.querySelector('img');
                    let url = new URL(imagen.src);
                    let id = url.searchParams.get('fid');
                    let nuevaColumna = document.createElement("td");
                    let valor = 0

                    valor = new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[id]["value"]))
                    nuevaColumna.innerHTML = valor
                    nuevaColumna.style.textAlign = 'center';
                    filasDatos[i].appendChild(nuevaColumna);


                    nuevaColumna = document.createElement("td");
                    nuevaColumna.style.margin = '0 auto';
                    nuevaColumna.style.textAlign = 'center';
                    nuevaColumna.innerHTML = "<img alt='' src='https://statsxente.com/MZ1/View/Images/detail.png' width='20px' height='20px' id='but" + id + "' style='cursor:pointer;'/>"
                    filasDatos[i].appendChild(nuevaColumna);


                    (function (currentId, currentSport, lang) {
                        document.getElementById("but" + currentId).addEventListener('click', function () {

                            let link = "https://statsxente.com/MZ1/Functions/loadClashFederationDetail.php?tamper=yes&idioma=" +
                                lang + "&modal_to_close=myModal&divisa=" + GM_getValue("currency") + "&fid=" + currentId + "&sport=" + currentSport + "&modal=yes";
                            openWindow(link, 0.95, 1.25);
                        });
                    })(id, window.sport, window.lang);

                }
            }
        });

        let thead = document.getElementsByClassName("nice_table")[0].querySelector('thead')
        let ths = thead.querySelectorAll("th");
        ths.forEach(function (th, index) {
            th.addEventListener("click", function () {
                ordenarTabla(index, true, "nice_table",true);
            });
        });
    }
//Cups and FL's page
    async function friendlyCupsAndLeagues() {

        let urlParams = new URLSearchParams(window.location.search);
        let age_restriction
        let idComp="null"
        let link = "https://www.managerzone.com" + document.getElementById("ui-id-1").getAttribute('href')
        if (urlParams.get('fsid')) {
            fl_data= await fetchExistsFL(urlParams.get('fsid'))
            idComp=fl_data['id']
            age_restriction = await fetchAgeRestriction(link);
        } else {
            age_restriction = await fetchCupAgeRestriction(link);
        }


        if(idComp!=="null"){
            let urlParams1 = new URLSearchParams(window.location.search);
            let typeKey
            if (urlParams1.has('type')) {
                typeKey = urlParams1.get("type")
            } else {
                typeKey = "friendlyseries"
            }

            GM_xmlhttpRequest({
                method: "GET",
                url: "http://statsxente.com/MZ1/Functions/tamper_teams_stats_records.php?table="+statsKeys[typeKey+"_"+window.sport]+"&idLiga="+idComp+"&categoria="+cats_stats[typeKey],
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function (response) {
                    teams_stats=JSON.parse(response.responseText);
                },
            });
        }




        let detected_cat = "senior"
        if (age_restriction !== "none") {


            switch (age_restriction) {
                case "U23":
                    detected_cat = "u23"
                    break;
                case "U21":
                    detected_cat = "u21"
                    break;
                case "U18":
                    detected_cat = "u18"
                    break;
            }

        }



        let initialValues = {};
        initialValues["senior"] = GM_getValue("league_default_senior");
        initialValues["world"] = GM_getValue("league_default_senior");
        initialValues["u23"] = GM_getValue("league_default_u23");
        initialValues["u21"] = GM_getValue("league_default_u21");
        initialValues["u18"] = GM_getValue("league_default_u18");
        initialValues["u23_world"] = GM_getValue("league_default_u23");
        initialValues["u21_world"] = GM_getValue("league_default_u21");
        initialValues["u18_world"] = GM_getValue("league_default_u18");

        let linkIds = ""
        let elems = document.getElementsByClassName("nice_table");
        let tabla = elems[0]
        getDeviceFormat()
        if(window.stx_device!=="computer"){
            tabla.style.overflowX = 'auto';
            tabla.style.display='block'
            tabla.style.maxWidth='100%'
        }
        let thSegundo = tabla.querySelector("thead th:nth-child(2)");
        thSegundo.style.width = "250px";


        let values = new Map();
        values.set('valor23', 'U23 Value');
        values.set('valor21', 'U21 Value');
        values.set('valor18', 'U18 Value');
        values.set('salario', 'Salary');
        values.set('valorUPSenior', 'LM Value');
        values.set('valorUPSUB23', 'U23 LM Value');
        values.set('valorUPSUB21', 'U21 LM Value');
        values.set('valorUPSUB18', 'U18 LM Value');
        values.set('edad', 'Age');
        if (window.sport === "soccer") {
            values.set('valor11', 'TOP 11');
            values.set('valor11_23', 'U23 TOP 11');
            values.set('valor11_21', 'U21 TOP 11');
            values.set('valor11_18', 'U18 TOP 11');
        } else {
            values.set('valor11', 'TOP 21');
            values.set('valor11_23', 'U23 TOP 21');
            values.set('valor11_21', 'U21 TOP 21');
            values.set('valor11_18', 'U18 TOP 21');
        }

        values.set('noNac', 'Foreigners');
        values.set('elo', 'ELO Score');
        values.set('elo23', 'U23 ELO Score');
        values.set('elo21', 'U21 ELO Score');
        values.set('elo18', 'U18 ELO Score');
        values.set('numJugadores', 'Number of players');
        values.set('leagues', 'Leagues');
        values.set('world_leagues_all', 'World Leagues');
        values.set('youth_leagues_all', 'Youth Leagues');
        values.set('world_youth_leagues_all', 'Youth World Leagues');
        values.set('federation_leagues', 'Federation Leagues');
        values.set('cup', 'Cups');
        values.set('cup_u23', 'U23 Cups');
        values.set('cup_u21', 'U21 Cups');
        values.set('cup_u18', 'U18 Cups');
        values.set('special_cup', 'Special Cups');
        values.set('transfer_value', 'Transfers Cost');
        values.set('transfer_value23', 'U23 Transfers Cost');
        values.set('transfer_value21', 'U21 Transfers Cost');

        values.set('elo_promedio', 'Average ELO');

        values.set('tmvalueSenior', 'LM Transfers Cost');
        values.set('tmvalueSUB23', 'U23 LM Transfers Cost');
        values.set('tmvalueSUB21', 'U21 LM Transfers Cost');

        let contenidoNuevo = '<div id="testClick" style="margin: 0 auto; text-align:center;">'
        getNativeTableStyles();

        ///MENU TABLE
        contenidoNuevo += "<table id=showMenu style='margin: 0 auto; text-align:center;'><thead style='background-color:" + GM_getValue("bg_native") + "; color:" + GM_getValue("color_native") + ";'><tr>";
        contenidoNuevo += '<th style="padding:4px; margin: 0 auto; text-align:center;" colspan="4">Stats Xente</th>';
        contenidoNuevo += "</tr></thead>";
        let styleTable = " style='width:93%; display:none;'";
        let styleIcon = ""
        let styleSep = "style='padding-top:5px;'";

        if (GM_getValue("show_league_selects") === true) {
            styleTable = " style='width:93%; margin: 0 auto; text-align:left;'";
            styleIcon = " active"
            styleSep = " style='display:none;'";

        }

        contenidoNuevo += "<tr><td></td><td style='padding-top:5px' colspan='2'>";
        contenidoNuevo += '<div id="moreInfo" class="expandable-icon' + styleIcon + '" style="margin: 0 auto; text-align:center; cursor:pointer; background-color:' + GM_getValue("bg_native") + ';"><div id="line1" class="line"></div><div  id="line2" class="line"></div></div></center>';
        contenidoNuevo += "</td><td></td></tr>";
        contenidoNuevo += "<tr><td colspan='5' id='separatorTd'" + styleSep + "></td></tr>";
        contenidoNuevo += "</table>";


        contenidoNuevo += '<table id=show3' + styleTable + '><tr><td><label>';

        if ("valor" === initialValues[detected_cat]) {
            contenidoNuevo += '<input class="statsxente" type="checkbox" checked id="valor" value="Value">Value</label></td>';
        } else {
            contenidoNuevo += '<input class="statsxente" type="checkbox" id="valor" value="Value">Value</label></td>';
        }


        values.forEach(function (valor, clave) {

            if (clave === "valorUPSenior") {
                contenidoNuevo += "</tr><tr>";
            }

            if (clave === "valor11") {
                contenidoNuevo += "</tr><tr>";
            }
            if (clave === "elo") {
                contenidoNuevo += "</tr><tr>";
            }

            if (clave === "leagues") {
                contenidoNuevo += "</tr><tr>";
            }

            if (clave === "leagues_all") {
                contenidoNuevo += "</tr><tr>";
            }

            if (clave === "cup") {
                contenidoNuevo += "</tr><tr>";
            }

            if (clave === "transfer_value") {
                contenidoNuevo += "</tr><tr>";
            }


            if (clave === "tmvalueSenior") {
                contenidoNuevo += "<td></td>";
            }
            if (clave === "tmvalueSenior") {
                contenidoNuevo += "</tr><tr>";
            }

            if (clave === initialValues[detected_cat]) {
                contenidoNuevo += '<td><label><input class="statsxente" type="checkbox" checked value="' + valor + '" id="' + clave + '">' + valor + '</label></td>';
            } else {
                contenidoNuevo += '<td><label><input class="statsxente" type="checkbox" value="' + valor + '" id="' + clave + '">' + valor + '</label></td>';
            }
        });
        contenidoNuevo += "</tr>"

        let cats_elo = {}
        cats_elo["senior"] = "SENIOR";
        cats_elo["world"] = "SENIOR";
        cats_elo["u23"] = "U23";
        cats_elo["u21"] = "U21";
        cats_elo["u18"] = "U18";
        cats_elo["u23_world"] = "U23";
        cats_elo["u21_world"] = "U21";
        cats_elo["u18_world"] = "U18";

        let disabled=""
        if(idComp==="null"){
            disabled="disabled"
        }

        let cats_temp=["SENIOR","U23","U21","U18"];
        contenidoNuevo +="<tr style='margin: 0 auto; text-align: center;'>"
        contenidoNuevo += '<td colspan="2"><label><input class="statsxente" type="checkbox" value="ELOCompare" id="ELOCompare">ELO Compare</label></td>';
        contenidoNuevo += '<td colspan="1"></td>';
        contenidoNuevo += '<td colspan="2"><label><input class="statsxente" type="checkbox" value="TeamStats" id="TeamStats" '+disabled+'>Team Stats</label></td>';
        contenidoNuevo +="</tr>"
        contenidoNuevo +='<tr style="margin: 0 auto; text-align: center; display:none;" id="trELOCompare"><td colspan="5">Category: '
        contenidoNuevo+='<select id="catSelect" style="background-color: '+GM_getValue("bg_native")+'; padding: 6px 3px; border-radius: 3px; width: 9em; border-color: white; color: '+GM_getValue("color_native")
        contenidoNuevo+='; font-family: Roboto; font-weight: bold; font-size: revert;">'
        for (let i = 0; i < cats_temp.length; i++) {
            let tmp=""
            if(cats_elo[urlParams.get('type')]===cats_temp[i]){
                tmp="selected"
            }
            contenidoNuevo+="<option value='"+cats_temp[i]+"' "+tmp+">"+cats_temp[i]+"</option>"
        }
        contenidoNuevo +='</select>  <button class="btn-save" style="color:'+GM_getValue("color_native")+'; background-color:'+GM_getValue("bg_native")+'; font-family: \'Roboto\'; font-weight:bold; font-size:revert;" id="eloCompareButton"><i class="bi bi-graph-up" style="font-style:normal;"> ELO Compare</i></button></td></tr>'

        //Team Stats data
        contenidoNuevo +='<tr style="margin: 0 auto; text-align: center; display:none;" id="trTeamStats"><td colspan="5">Stats: '
        contenidoNuevo+='<select id="statsSelect" style="background-color: '+GM_getValue("bg_native")+'; padding: 6px 3px; border-radius: 3px; width: 9em; border-color: white; color: '+GM_getValue("color_native")
        contenidoNuevo+='; font-family: Roboto; font-weight: bold; font-size: revert;">'
        contenidoNuevo +=GM_getValue("statsTeamsSelect_"+window.sport)
        contenidoNuevo +='</select>'





        contenidoNuevo+="</table></center>"
        contenidoNuevo += "</div></br>";


        if(idComp!=="null"){

            contenidoNuevo +="<table style='width:80%; margin: 0 auto; text-align:center;'><tr>"
            let color=GM_getValue("bg_native")
            contenidoNuevo +='<td><button class="btn-comp-fed" style="color:'+GM_getValue("color_native")+'; background-color:'+GM_getValue("bg_native")+'; font-family: \'Roboto\'; font-weight:bold; font-size:revert;" id="todos">All against all</button></td>'
            contenidoNuevo += '<td><button class="btn-comp-fed" style="color:'+GM_getValue("color_native")+'; background-color:'+GM_getValue("bg_native")+'; font-family: \'Roboto\'; font-weight:bold; font-size:revert;" id="directosSIN">Direct confrontations [Without ties]</button></td>'
            contenidoNuevo += '<td><button class="btn-comp-fed" style="color:'+GM_getValue("color_native")+'; background-color:'+GM_getValue("bg_native")+'; font-family: \'Roboto\'; font-weight:bold; font-size:revert;" id="directosCON">Direct confrontations [With ties]</button></td>'
            contenidoNuevo +="</tr>"

            contenidoNuevo += '<tr><td colspan="3"><button class="btn-comp-fed" style="color:'+GM_getValue("color_native")+'; background-color:'+GM_getValue("bg_native")+'; font-family: \'Roboto\'; font-weight:bold; font-size:revert;" id="desgloseSIN">Users Points [Without ties]</button>'
            contenidoNuevo += '&nbsp;<button class="btn-comp-fed" style="color:'+GM_getValue("color_native")+'; background-color:'+GM_getValue("bg_native")+'; font-family: \'Roboto\'; font-weight:bold; font-size:revert;" id="desgloseCON">Users Points [With ties]</button></td>'

            contenidoNuevo +="</tr>"

            contenidoNuevo +="</table></br>"



            let darkerColor = darkenColor(color, 25);

            document.styleSheets[0].insertRule(
                '.btn-comp-fed:hover { background-color: '+darkerColor+' !important; }',
                document.styleSheets[0].cssRules.length
            );

            values.set('valor', 'Value');
            elems = document.getElementsByClassName("nice_table");
            tabla = elems[0]
            tabla.insertAdjacentHTML('beforebegin', contenidoNuevo);


            ///COM FED BUTTONS
            document.getElementById("todos").addEventListener('click', function () {
                let link = "https://statsxente.com/MZ1/View/FEDCOMP_ContraTodos_VIEW.php?tamper=yes&id="+idComp+"&idioma="+ window.lang
                openWindow(link, 0.75, 1.1);
            });
            document.getElementById("directosSIN").addEventListener('click', function () {
                let link = "https://statsxente.com/MZ1/View/FEDCOMP_Directos_VIEW.php?tamper=yes&id="+idComp+"&idioma="+ window.lang
                openWindow(link, 0.75, 1.1);
            });
            document.getElementById("directosCON").addEventListener('click', function () {
                let link = "https://statsxente.com/MZ1/View/FEDCOMP_DirectosEmpates_VIEW.php?tamper=yes&id="+idComp+"&idioma="+ window.lang
                openWindow(link, 0.75, 1.1);
            });

            document.getElementById("desgloseSIN").addEventListener('click', function () {
                let link = "https://statsxente.com/MZ1/Lecturas/getDesglosePuntosFede.php?tamper=yes&idComp="+idComp+"&idioma="+ window.lang+"&idLiga="+urlParams.get('fsid')
                openWindow(link, 0.75, 1.1);
            });

            document.getElementById("desgloseCON").addEventListener('click', function () {
                let link = "https://statsxente.com/MZ1/Lecturas/getDesglosePuntosFedeEmpates.php?tamper=yes&idComp="+idComp+"&idioma="+ window.lang+"&idLiga="+urlParams.get('fsid')
                openWindow(link, 0.75, 1.1);
            });

        }else{

            values.set('valor', 'Value');
            elems = document.getElementsByClassName("nice_table");
            tabla = elems[0]
            tabla.insertAdjacentHTML('beforebegin', contenidoNuevo);

        }



        //Team Stats

        document.getElementById("TeamStats").addEventListener('click', function () {

            let checkboxes = document.querySelectorAll('.statsxente');
            checkboxes.forEach(function (checkbox) {
                if (checkbox.id !== "TeamStats") {
                    checkbox.checked = false;
                }
            });

            if(document.getElementById("trTeamStats").style.display==="none"){
                document.getElementById("trTeamStats").style.display="table-row";
                document.getElementById("trELOCompare").style.display="none";
            }else{
                document.getElementById("trTeamStats").style.display="none";
            }

        });


        document.getElementById("statsSelect").addEventListener('change', function () {

            let elems = document.getElementsByClassName("nice_table");
            let tabla = elems[0]
            let filas = tabla.getElementsByTagName("tbody")[0].getElementsByTagName("tr");

            for (let i = 0; i < filas.length; i++) {
                if (checkClassNameExists(filas[i], searchClassName)) {
                    let celda = filas[i].cells[1];
                    let team_data=extractTeamData(celda.getElementsByTagName("a"));
                    let id=team_data[0]
                    let celdas = filas[i].getElementsByTagName("td");
                    let ultimaCelda = celdas[celdas.length - 2];
                    let selects = document.getElementsByTagName('select');
                    let index_select = 1;
                    if (selects[index_select] === undefined) {
                        index_select = 0;
                    }
                    let valor=0
                    if (teams_stats[id] === undefined) {
                        valor = -1
                    } else {
                        let parsedValue=evaluarExpresion(document.getElementById("statsSelect").value,teams_stats[id])
                        valor = new Intl.NumberFormat(window.userLocal).format(Number.parseFloat(parsedValue).toFixed(2))

                    }

                    ultimaCelda.innerHTML = valor;
                }
            }




            let thead = tabla.querySelector('thead');
            let tr = thead.querySelectorAll('tr');
            let td = tr[0].querySelectorAll('th');
            let select = document.getElementById("statsSelect");
            td[td.length - 2].textContent = select.options[select.selectedIndex].text



        });


        document.getElementById("eloCompareButton").style.padding = "5px 3px";
        document.getElementById("eloCompareButton").style.width = "9em";

        document.getElementById("eloCompareButton").addEventListener('click', function () {
            let elems = document.getElementsByClassName("nice_table");
            let tabla = elems[0]
            let link="https://statsxente.com/MZ1/Functions/graphLoader.php?graph=elo_compare&lang="+window.lang+"&category="+document.getElementById("catSelect").value+"&sport="+window.sport
            let cont=0
            for (let i = 0; i < tabla.rows.length; i++) {
                let fila = tabla.rows[i];
                if (fila.cells.length > 1) {
                    let checkboxes = fila.cells[1].querySelectorAll("input[type='checkbox']");
                    checkboxes.forEach(function(checkbox) {
                        if(checkbox.checked){
                            if(cont<5){
                                link+="&team_name"+cont+"="+encodeURIComponent(checkbox.value)+"&team_id"+cont+"="+checkbox.id
                                cont++;
                            }
                        }
                    });
                }
            }
            openWindow(link, 0.95, 1.25);
        });
        document.getElementById("ELOCompare").addEventListener('click', function () {
            let checkboxes = document.querySelectorAll('.statsxente');
            checkboxes.forEach(function (checkbox) {
                if (checkbox.id !== "ELOCompare") {
                    checkbox.checked = false;
                }
            });
            if(!document.getElementById("eloCompareCol")){
                let elems = document.getElementsByClassName("nice_table");
                let tabla = elems[0]
                for (let fila of tabla.rows) {
                    const nuevaCelda = fila.rowIndex === 0 ? document.createElement('th') : document.createElement('td');
                    if(fila.rowIndex>0){
                        let team_data=extractTeamData(fila.cells[1].getElementsByTagName('a'))
                        nuevaCelda.innerHTML = '<input class="statsxente1" type="checkbox" value="'+team_data[1]+'" id="'+team_data[0]+'">';
                    }

                    fila.insertBefore(nuevaCelda, fila.cells[1]);
                    if(fila.rowIndex===0){
                        fila.cells[1].id="eloCompareCol"
                        fila.cells[2].style.width="175px"
                    }
                }
            }else{
                let elems = document.getElementsByClassName("nice_table");
                let table = elems[0]
                let th = document.getElementById("eloCompareCol");
                let columnIndex = th.cellIndex;
                for (let i = 0; i < table.rows.length; i++) {
                    let row = table.rows[i];
                    let cell = row.cells[columnIndex];
                    if (cell.style.display === 'none') {
                        cell.style.display = '';
                        th.style.fontWeight = 'normal';
                    } else {
                        cell.style.display = 'none';
                        th.style.fontWeight = 'bold';
                    }
                }
            }

            if(document.getElementById("trELOCompare").style.display==="none"){
                document.getElementById("trELOCompare").style.display="table-row";
                document.getElementById("trTeamStats").style.display="none";

            }else{
                document.getElementById("trELOCompare").style.display="none";
            }

        });






        if (GM_getValue("show_league_selects") === true) {

            document.getElementById("line2").style.transform = 'rotateZ(0deg)';
            document.getElementById("line1").style.transform = 'rotateZ(180deg)';
            document.getElementById("moreInfo").style.transform = 'rotateZ(0deg)';
        }


        values.forEach(function (valor, clave) {

            let elemento = document.getElementById(clave);
            elemento.addEventListener('click', handleClick);

        });

        let thWidth="7.5em"

        if(idComp!=="null"){
            thWidth="5.5em"
        }

        let nuevaCeldaEncabezado = document.createElement("th");
        nuevaCeldaEncabezado.textContent = values.get(initialValues[detected_cat]);
        nuevaCeldaEncabezado.style.textAlign = 'center';
        nuevaCeldaEncabezado.style.maxWidth = thWidth;
        nuevaCeldaEncabezado.style.width = thWidth;
        nuevaCeldaEncabezado.style.whiteSpace = 'nowrap';
        nuevaCeldaEncabezado.style.overflow = 'hidden';
        nuevaCeldaEncabezado.style.textOverflow = 'ellipsis';

        let ser = document.getElementsByClassName("seriesHeader")


        let table_index = 0;
        for (let kl = 0; kl < ser.length; kl++) {
            if (document.getElementsByClassName("seriesHeader")[kl].parentNode.parentNode.className === "nice_table") {
                table_index = kl
            }


        }

        let widthTeam="180px"

        if(idComp!=="null"){
            widthTeam="150px";
        }


        document.getElementsByClassName("seriesHeader")[table_index].cells[1].style.width = widthTeam
        document.getElementsByClassName("seriesHeader")[table_index].appendChild(nuevaCeldaEncabezado);

        if(idComp!=="null"){

            let nuevaColumna1 =  document.getElementsByClassName("seriesHeader")[table_index].insertCell(2);
            nuevaColumna1.outerHTML = "<th>Federation</th>"
            nuevaColumna1.style.textAlign = 'center';


            let tds = document.querySelectorAll('.nice_table td');
            let ths = document.querySelectorAll('.nice_table th');

            tds.forEach(td => {
                td.style.paddingLeft = "3px";
                td.style.paddingRight = "3px";
            });

            ths.forEach(th => {
                th.style.paddingLeft = "3px";
                th.style.paddingRight = "3px";
            });

        }


        nuevaCeldaEncabezado = document.createElement("th");
        nuevaCeldaEncabezado.textContent = "Stats Xente";
        nuevaCeldaEncabezado.style.textAlign = 'center';
        document.getElementsByClassName("seriesHeader")[table_index].appendChild(nuevaCeldaEncabezado);


        if (tabla.getElementsByTagName("tbody")[0].innerHTML.includes("mazyar")) {
            searchClassName = "responsive-hide"
        }

        let contIds = 0
        let filasDatos = tabla.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
        for (let i = 0; i < filasDatos.length; i++) {
            if (checkClassNameExists(tabla.rows[i + 1], searchClassName)) {
                let celda = tabla.rows[i + 1].cells[1];
                let team_data=extractTeamData(celda.getElementsByTagName("a"));
                let id=team_data[0]
                let equipo=team_data[1]

                linkIds += "&idEquipo" + contIds + "=" + id
                contIds++
                celda.innerHTML += "<input type='hidden' id='team_" + id + "' value='" + equipo + "'/>"
            }

        }



        ///DIV PROGRESS
        setTimeout(function () {


            (function () {
                document.getElementById("moreInfo").addEventListener('click', function () {
                    document.getElementById("moreInfo").classList.toggle('active');

                    if (document.getElementById("moreInfo").classList.contains("active")) {
                        document.getElementById("line2").style.transform = 'rotateZ(0deg)';
                        document.getElementById("line1").style.transform = 'rotateZ(180deg)';
                        document.getElementById("moreInfo").style.transform = 'rotateZ(0deg)';
                        $('#separatorTd').fadeOut(1);
                        document.getElementById("separatorTd").style.paddingTop = "5px";
                        $('#show3').fadeIn('slow');
                    } else {
                        document.getElementById("line2").style.transform = 'rotateZ(45deg)';
                        document.getElementById("line1").style.transform = 'rotateZ(-45deg)';
                        document.getElementById("moreInfo").style.transform = 'rotateZ(45deg)';
                        $('#separatorTd').fadeIn(1);
                        $('#show3').fadeOut('slow');
                    }



                });
            })();

        }, 200);

        GM_xmlhttpRequest({
            method: "GET",
            url: "https://statsxente.com/MZ1/Functions/tamper_teams.php?currency=" + GM_getValue("currency") + "&sport=" + window.sport + linkIds,
            headers: {
                "Content-Type": "application/json"
            },
            onload: function (response) {
                let jsonResponse = JSON.parse(response.responseText);
                teams_data = jsonResponse;
                let filasDatos = tabla.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
                for (let i = 0; i < filasDatos.length; i++) {
                    if (checkClassNameExists(filasDatos[i], searchClassName)) {
                        let celda = filasDatos[i].cells[1]
                        let team_data=extractTeamData(celda.getElementsByTagName("a"));
                        let id=team_data[0]
                        let equipo=team_data[1]

                        let nuevaColumna = document.createElement("td");
                        let valor = 0;

                        if (jsonResponse[id] && jsonResponse[id][initialValues[detected_cat]] !== undefined) {
                            valor = new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[id][initialValues[detected_cat]]))
                        }
                        nuevaColumna.innerHTML = valor
                        nuevaColumna.style.textAlign = 'center';
                        filasDatos[i].appendChild(nuevaColumna);


                        if(idComp!=="null"){
                            let nuevaColumna1 = filasDatos[i].insertCell(2);
                            nuevaColumna1.innerHTML = "<img alt='' src='https://www.managerzone.com/dynimg/pic.php?type=federation&fid="+fl_data["federations"][fl_data['teams'][id]['nombreFede']]['idFede']+"&size=small&sport=soccer' width='10px' height='10px'/> <span style='color:red;'>"+fl_data['teams'][id]['nombreFede']+"</span>";
                            nuevaColumna1.style.textAlign = 'left';
                        }

                        let eloType = 1
                        if (window.sport === "soccer") { eloType = 2 }
                        let cats_elo = {}
                        cats_elo["senior"] = "SENIOR";
                        cats_elo["seniorw"] = "SENIOR";
                        cats_elo["SUB23"] = "U23";
                        cats_elo["SUB21"] = "U21";
                        cats_elo["SUB18"] = "U18";
                        cats_elo["SUB23w"] = "U23";
                        cats_elo["SUB21w"] = "U21";
                        cats_elo["SUB18w"] = "U18";

                        let cat = cats[detected_cat]
                        if(cat!=="senior"){eloType=3}


                        let flagSenior = 0, flagSub23 = 0, flagSub21 = 0, flagSub18 = 0;
                        if (jsonResponse[id]["elo"] > 0) { flagSenior = 1 }
                        if (jsonResponse[id]["elo23"] > 0) { flagSub23 = 1 }
                        if (jsonResponse[id]["elo21"] > 0) { flagSub21 = 1 }
                        if (jsonResponse[id]["elo18"] > 0) { flagSub18 = 1 }

                        let buttonDisplay = "display:block;";
                        nuevaColumna = document.createElement("td");
                        nuevaColumna.style.margin = '0 auto';
                        nuevaColumna.style.textAlign = 'center';
                        let iner = "<img alt='' src='https://statsxente.com/MZ1/View/Images/detail.png' width='" + GM_getValue("league_image_size") + "px' height='" + GM_getValue("league_image_size") + "px' id='but" + id + "' style='cursor:pointer;'/>";
                        if (GM_getValue("league_graph_button") === "checked") {
                            buttonDisplay = ""
                        } else {
                            buttonDisplay = "display:none;";
                        }
                        iner += "<img alt='' src='https://statsxente.com/MZ1/View/Images/graph.png' width='" + GM_getValue("league_image_size") + "px' height='" + GM_getValue("league_image_size") + "px' id='but1" + id + "' style='cursor:pointer; " + buttonDisplay + "'/>";

                        if (GM_getValue("league_report_button") === "checked") {
                            buttonDisplay = ""
                        } else {
                            buttonDisplay = "display:none;";
                        }
                        iner += "<img alt='' src='https://statsxente.com/MZ1/View/Images/report.png' width='" + GM_getValue("league_image_size") + "px' height='" + GM_getValue("league_image_size") + "px' id='but2" + id + "' style='cursor:pointer; " + buttonDisplay + "'/>";

                        if (GM_getValue("league_calendar_button") === "checked") {
                            buttonDisplay = ""
                        } else {
                            buttonDisplay = "display:none;";
                        }
                        iner += " <img alt='' src='https://statsxente.com/MZ1/View/Images/calendar.png' width='" + GM_getValue("league_image_size") + "px' height='" + GM_getValue("league_image_size") + "px' id='but3" + id + "' style='cursor:pointer; " + buttonDisplay + "'/>";
                        iner += "</center>";

                        nuevaColumna.innerHTML = iner
                        filasDatos[i].appendChild(nuevaColumna);
                        nuevaColumna = document.createElement("td");
                        (function (currentId, currentLSport, lang) {
                            document.getElementById("but1" + currentId).addEventListener('click', function () {
                                let link = "https://statsxente.com/MZ1/Graficos/graficoProgresoEquipo.php?idEquipo=" + currentId + "&idioma=" + lang + "&divisa=" + GM_getValue("currency") + "&deporte=" + currentLSport;
                                openWindow(link, 0.95, 1.25);
                            });
                        })(id, window.lsport, window.lang);


                        (function (currentId, currentLSport, lang, currentCat) {
                            document.getElementById("but2" + currentId).addEventListener('click', function () {
                                let src = "filtroGraficoEquiposHistoricoHockey";
                                if (currentLSport === "F") {
                                    src = "filtroGraficoLinealEquiposHistorico";
                                }

                                let link = "https://statsxente.com/MZ1/View/" + src + ".php?tamper=yes&categoria=" + currentCat + "&idEquipo=" + currentId + "&idioma=" + lang + "&modal=yes&valor=nota&season=75&season_actual=75&equipo=-"
                                openWindow(link, 0.95, 1.25);
                            });
                        })(id, window.lsport, window.lang, cat);


                        (function (currentId, currentEquipo, currentCat, currentSport, lang) {
                            document.getElementById("but" + currentId).addEventListener('click', function () {
                                let link = "https://statsxente.com/MZ1/View/filtroStatsEquiposHistorico.php?tamper=no&idEquipo=" + currentId + "&idioma=" + lang + "&modal=yes&deporte=" + currentSport + "&season=77&season_actual=77&categoria=" + currentCat + "&equipo=" + currentEquipo + "&cerrar=no";
                                openWindow(link, 0.95, 1.25);
                            });
                        })(id, equipo, cat, window.sport, window.lang);




                        (function (currentId, type, currentCat, currentSport, lang, flagS, flagS23, flagS21, flagS18) {
                            document.getElementById("but3" + currentId).addEventListener('click', function () {
                                let link = "https://statsxente.com/MZ1/Graficos/graficoRachaEquipoELO.php?tamper=yes&team_id=" + currentId + "&idioma=" + lang + "&deporte=" + currentSport + "&type=" + type + "&cat=" + currentCat + "&flagSenior=" +
                                    flagS + "&flagSub23=" + flagS23 + "&flagSub21=" + flagS21 + "&flagSub18=" + flagS18;
                                openWindow(link, 0.95, 1.25);
                            });
                        })(id, eloType, cats_elo[cat], window.sport, window.lang, flagSenior, flagSub23, flagSub21, flagSub18);

                    }

                }
                let thead = document.getElementsByClassName("seriesHeader")[table_index]
                let ths = thead.querySelectorAll("th");
                ths.forEach(function (th, index) {
                    th.addEventListener("click", function () {
                        ordenarTabla(index, true, "nice_table",true);
                    });
                });
            }
        });


    }



    function heatMap(){
        let links = document.querySelectorAll("a.matchIcon.large.shadow");
        links.forEach(function(link) {
            let icon = link.querySelector("i");
            if (icon && icon.textContent.trim() === "2D") {
                link.addEventListener("click", function() {


                    let overlay = document.getElementById('game-overlay-close');

                    let intervalId = setInterval(() => {
                        let style = window.getComputedStyle(overlay);
                        if (style.display === 'none') {


                            let div = document.getElementById("gameContent");
                            let button='</br><button id="showHeatMap" class="btn-save" style="border: 2px solid white; color:'+GM_getValue("color_native")+'; background-color:'+GM_getValue("bg_native")+'; font-family: \'Roboto\'; font-weight:bold;font-size:revert; width:7em; padding: 2px 2px;">'
                            button+='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-radar" viewBox="0 0 16 16">'
                            button+='<path d="M6.634 1.135A7 7 0 0 1 15 8a.5.5 0 0 1-1 0 6 6 0 1 0-6.5 5.98v-1.005A5 5 0 1 1 13 8a.5.5 0 0 1-1 0 4 4 0 1 0-4.5 3.969v-1.011A2.999 2.999 0 1 1 11 8a.5.5 0 0 1-1 0 2 2 0 1 0-2.5 1.936v-1.07a1 1 0 1 1 1 0V15.5a.5.5 0 0 1-1 0v-.518a7 7 0 0 1-.866-13.847"/></svg>'
                            button+=' Heat Map</button>'

                            div.insertAdjacentHTML('beforeend', button);
                            let elemento = document.getElementById('showHeatMap');
                            elemento.addEventListener('click', function() {
                                let mapaGoles = {};
                                let mapaPenalties = {};
                                let mapaCards = {};
                                let mapaSaves = {};
                                let mapaMisses={}

                                let urlParamsAux = new URLSearchParams(window.location.search);

                                let match_id=urlParamsAux.get("mid")
                                GM_xmlhttpRequest({
                                    method: "GET",
                                    url: "https://www.managerzone.com/matchviewer/getMatchFiles.php?type=stats&mid="+match_id+"&sport="+window.sport,
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    onload: function (response) {
                                        let parser = new DOMParser();
                                        let xmlDoc = parser.parseFromString(response.responseText, "text/xml");
                                        let players = xmlDoc.getElementsByTagName("Player");


                                        for (let i = 0; i < players.length; i++) {
                                            let player = players[i];
                                            let nombre = player.getAttribute("name");
                                            let goles = player.getElementsByTagName("Goal");

                                            if (goles.length > 0) {
                                                mapaGoles[nombre] = [];
                                                for (let j = 0; j < goles.length; j++) {
                                                    let gol = goles[j];
                                                    let toDecrement=-3;
                                                    if(window.sport==="soccer"){toDecrement=0}
                                                    mapaGoles[nombre].push({
                                                        frame: gol.getAttribute("frame")-toDecrement,
                                                        time: gol.getAttribute("time")
                                                    });
                                                }
                                            }


                                            let penalties = player.getElementsByTagName("Penalty");
                                            if (penalties.length > 0) {
                                                mapaPenalties[nombre] = [];
                                                for (let j = 0; j < penalties.length; j++) {
                                                    let penalty = penalties[j];
                                                    let toDecrement=0;
                                                    if(window.sport==="soccer"){toDecrement=4}
                                                    mapaPenalties[nombre].push({
                                                        frame: penalty.getAttribute("frame")-toDecrement,
                                                        time: penalty.getAttribute("time")
                                                    });
                                                }
                                            }

                                            let cards = player.getElementsByTagName("Card");
                                            if (cards.length > 0) {
                                                mapaCards[nombre] = [];
                                                for (let j = 0; j < cards.length; j++) {
                                                    let card = cards[j];
                                                    let toDecrement=0;
                                                    if(window.sport==="soccer"){toDecrement=10}
                                                    mapaCards[nombre].push({
                                                        frame: card.getAttribute("frame")-toDecrement,
                                                        time: card.getAttribute("time"),type:card.getAttribute("type")
                                                    });
                                                }
                                            }

                                            let saves = player.getElementsByTagName("Save");
                                            if (saves.length > 0) {
                                                mapaSaves[nombre] = [];
                                                for (let j = 0; j < saves.length; j++) {
                                                    let save = saves[j];
                                                    let toDecrement=-2;
                                                    if(window.sport==="soccer"){
                                                        toDecrement=-2
                                                        mapaSaves[nombre].push({
                                                            frame: save.getAttribute("frame")-toDecrement,
                                                            time: save.getAttribute("time"),team_id:save.getAttribute("team")
                                                        });
                                                    }else{
                                                        toDecrement=5
                                                        mapaSaves[nombre].push({
                                                            frame: save.getAttribute("frame")-toDecrement,
                                                            time: save.getAttribute("time"),team_id:save.parentNode.getAttribute("teamId")
                                                        });
                                                    }


                                                }
                                            }

                                            let misses = player.getElementsByTagName("Miss");
                                            if (misses.length > 0) {
                                                mapaMisses[nombre] = [];
                                                for (let j = 0; j < misses.length; j++) {
                                                    let miss = misses[j];
                                                    let toDecrement=0;
                                                    if(window.sport==="soccer"){toDecrement=6}
                                                    mapaMisses[nombre].push({
                                                        frame: miss.getAttribute("frame")-toDecrement,
                                                        time: miss.getAttribute("time")
                                                    });
                                                }
                                            }





                                        }

                                    }
                                });

                                let porAncho=0.95;let porAlto=0.9;
                                let ventanaAncho = (window.innerWidth) * porAncho
                                let ventanaAlto = (window.innerHeight) * porAlto
                                let ventanaIzquierda = (window.innerWidth - ventanaAncho) / 2;
                                let ventanaArriba = (window.innerHeight - ventanaAlto) / 2;
                                let opcionesVentana = "width=" + ventanaAncho +
                                    ",height=" + ventanaAlto +
                                    ",left=" + ventanaIzquierda +
                                    ",top=" + ventanaArriba;
                                var link="https://statsxente.com/MZ1/View/heatMapHockey.php"
                                if(window.sport==="soccer"){
                                    link="https://statsxente.com/MZ1/View/heatMapSoccer.php"
                                }
                                var newWin = window.open(link, '_blank',opcionesVentana);
                                let mapa = {};
                                for (let team of MyGame.prototype.mzlive.m_match.m_teams) {
                                    for (let player of team.m_players) {
                                        mapa[player.m_id]={"name":player.m_name,"id":player.m_id,"team_name":team.m_name,"team_id":team.m_teamId}
                                    }
                                }
                                window.addEventListener('message', (event) => {
                                    if (event.data === 'readyToReceive') {
                                        newWin.postMessage({ miData: MyGame.prototype.mzlive.m_match.matchBuffer, teams:mapa,
                                            map_goals:mapaGoles,map_penalties:mapaPenalties,map_cards:mapaCards,
                                            map_saves:mapaSaves,map_misses:mapaMisses}, '*');
                                    }
                                });

                            });

                            clearInterval(intervalId);
                        }
                    }, 500); //




                });
            }
        });

    }


//Match page
    async function match() {




        let team_div = document.getElementsByClassName("flex-grow-0 textCenter team-table block")
        if (team_div.length===0){
            team_div = document.getElementsByClassName("flex-grow-0 textCenter team-table no-match-buttons block")
        }
        let teams_ = []
        let urlParams = new URLSearchParams(window.location.search);
        var match_id=urlParams.get("mid")
        let cats_temp=["SENIOR","U23","U21","U18"];
        let cats_elo = {}
        cats_elo["senior"] = "SENIOR";
        cats_elo["U23"] = "U23";
        cats_elo["U21"] = "U21";
        cats_elo["U18"] = "U18";
        cats_elo["national_team"] = "SENIOR";
        cats_elo["national_team_U21"] = "U21";

        let statsTable = Array.from(document.getElementsByClassName("hitlist statsLite marker")).filter(element => {
            const classes = Array.from(element.classList);
            return classes.length === 3 && classes.includes("hitlist") && classes.includes("statsLite") && classes.includes("marker");
        });
        let tfoot=statsTable[0].getElementsByTagName("tfoot")
        if(tfoot.length===0){


            GM_xmlhttpRequest({
                method: "GET",
                url: "https://statsxente.com/MZ1/Functions/tamper_elo_change_match.php?sport=" + window.sport + "&match_id="+match_id,
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function (response) {
                    var elo_data= JSON.parse(response.responseText);
                    var newT = '</br><div style="text-align: center;"><div style="width: 4.5em; text" class="matchIcon  large shadow"><i style="color: black;"><img alt="" width="16px" height="12px" src="https://statsxente.com/MZ1/View/Images/diff_elo.png"> '
                    newT+=elo_data['elo_variation'].toFixed(2)+'</i></div></br></br>'
                    newT+='<select id="catSelect" style="background-color: '+GM_getValue("bg_native")+'; padding: 6px 3px; border-radius: 3px; width: 9em; border-color: '+GM_getValue("bg_native")+'; color: '+GM_getValue("color_native")
                    newT+='; font-family: Roboto; font-weight: bold; font-size: revert;">'
                    for (let i = 0; i < cats_temp.length; i++) {
                        let tmp=""
                        if(cats_elo[elo_data['elo_category']]===cats_temp[i]){
                            tmp="selected"
                        }
                        newT+="<option value='"+cats_temp[i]+"' "+tmp+">"+cats_temp[i]+"</option>"
                    }
                    let tid="";let tid1="";
                    getDeviceFormat()
                    if(window.stx_device!=="computer"){
                        let ps = document.querySelectorAll('p.responsive-show');
                        let as_ = ps[0].querySelectorAll('a');

                        let urlObj = new URL("https://www.managerzone.com/" + as_[0].getAttribute("href"));
                        let params = new URLSearchParams(urlObj.search);
                        tid = params.get('tid');

                        urlObj = new URL("https://www.managerzone.com/" + as_[1].getAttribute("href"));
                        params = new URLSearchParams(urlObj.search);
                        tid1 = params.get('tid');

                    }

                    newT +='</select>  <button class="btn-save" style="color:'+GM_getValue("color_native")+'; background-color:'+GM_getValue("bg_native")+'; font-family: \'Roboto\'; font-weight:bold;'
                    newT+='font-size:revert; width:9em; padding: 5px 3px;" id="eloCompareButton"><i class="bi bi-graph-up" style="font-style:normal;"> ELO Compare</i></button>'
                    newT+="</br> </br>"
                    if(window.stx_device!=="computer"){
                        newT+='<button id="spy_'+tid+'" class="btn-save" style="color:'+GM_getValue("color_native")+'; background-color:'+GM_getValue("bg_native")+'; font-family: \'Roboto\'; font-weight:bold;font-size:revert; width:7em; padding: 2px 2px;">'
                        newT+='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-incognito" viewBox="0 0 16 16">'
                        newT+='<path fill-rule="evenodd" d="m4.736 1.968-.892 3.269-.014.058C2.113 5.568 1 6.006 1 6.5 1 7.328 4.134 8 8 8s7-.672 7-1.5c0-.494-1.113-.932-2.83-1.205l-.014-.058-.892-3.27c-.146-.533-.698-.849-1.239-.734C9.411 1.363 8.62 1.5 8 1.5s-1.411-.136-2.025-.267c-.541-.115-1.093.2-1.239.735m.015 3.867a.25.25 0 0 1 .274-.224c.9.092 1.91.143 2.975.143a30 30 0 0 0 2.975-.143.25.25 0 0 1 .05.498c-.918.093-1.944.145-3.025.145s-2.107-.052-3.025-.145a.25.25 0 0 1-.224-.274M3.5 10h2a.5.5 0 0 1 .5.5v1a1.5 1.5 0 0 1-3 0v-1a.5.5 0 0 1 .5-.5m-1.5.5q.001-.264.085-.5H2a.5.5 0 0 1 0-1h3.5a1.5 1.5 0 0 1 1.488 1.312 3.5 3.5 0 0 1 2.024 0A1.5 1.5 0 0 1 10.5 9H14a.5.5 0 0 1 0 1h-.085q.084.236.085.5v1a2.5 2.5 0 0 1-5 0v-.14l-.21-.07a2.5 2.5 0 0 0-1.58 0l-.21.07v.14a2.5 2.5 0 0 1-5 0zm8.5-.5h2a.5.5 0 0 1 .5.5v1a1.5 1.5 0 0 1-3 0v-1a.5.5 0 0 1 .5-.5"/></svg>'
                        newT+=' Home</button>'



                        newT+=' <button id="spy_'+tid1+'" class="btn-save" style="color:'+GM_getValue("color_native")+'; background-color:'+GM_getValue("bg_native")+'; font-family: \'Roboto\'; font-weight:bold;font-size:revert; width:7em; padding: 2px 2px;">'
                        newT+='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-incognito" viewBox="0 0 16 16">'
                        newT+='<path fill-rule="evenodd" d="m4.736 1.968-.892 3.269-.014.058C2.113 5.568 1 6.006 1 6.5 1 7.328 4.134 8 8 8s7-.672 7-1.5c0-.494-1.113-.932-2.83-1.205l-.014-.058-.892-3.27c-.146-.533-.698-.849-1.239-.734C9.411 1.363 8.62 1.5 8 1.5s-1.411-.136-2.025-.267c-.541-.115-1.093.2-1.239.735m.015 3.867a.25.25 0 0 1 .274-.224c.9.092 1.91.143 2.975.143a30 30 0 0 0 2.975-.143.25.25 0 0 1 .05.498c-.918.093-1.944.145-3.025.145s-2.107-.052-3.025-.145a.25.25 0 0 1-.224-.274M3.5 10h2a.5.5 0 0 1 .5.5v1a1.5 1.5 0 0 1-3 0v-1a.5.5 0 0 1 .5-.5m-1.5.5q.001-.264.085-.5H2a.5.5 0 0 1 0-1h3.5a1.5 1.5 0 0 1 1.488 1.312 3.5 3.5 0 0 1 2.024 0A1.5 1.5 0 0 1 10.5 9H14a.5.5 0 0 1 0 1h-.085q.084.236.085.5v1a2.5 2.5 0 0 1-5 0v-.14l-.21-.07a2.5 2.5 0 0 0-1.58 0l-.21.07v.14a2.5 2.5 0 0 1-5 0zm8.5-.5h2a.5.5 0 0 1 .5.5v1a1.5 1.5 0 0 1-3 0v-1a.5.5 0 0 1 .5-.5"/></svg>'
                        newT+=' Away</button>'
                    }



                    document.getElementById("match-tactic-facts-wrapper").insertAdjacentHTML('afterbegin', newT);

                    if(window.stx_device!=="computer"){
                        (function (currentId,lang) {
                            document.getElementById("spy_" + currentId).addEventListener('click', function () {
                                let urlParamsAux = new URLSearchParams(window.location.search);
                                let link = "https://statsxente.com/MZ1/Functions/graphLoader.php?tamper=yes&graph=spyTactic&tolerance=25&limit=100&match_id="+urlParamsAux.get('mid')+"&team_id=" + currentId + "&idioma=" + lang + "&divisa=" + GM_getValue("currency");
                                openWindow(link, 0.95, 1.25);
                            });
                        })(tid,window.lang);

                        (function (currentId,lang) {
                            document.getElementById("spy_" + currentId).addEventListener('click', function () {
                                let urlParamsAux = new URLSearchParams(window.location.search);
                                let link = "https://statsxente.com/MZ1/Functions/graphLoader.php?tamper=yes&graph=spyTactic&tolerance=25&limit=100&match_id="+urlParamsAux.get('mid')+"&team_id=" + currentId + "&idioma=" + lang + "&divisa=" + GM_getValue("currency");
                                openWindow(link, 0.95, 1.25);
                            });
                        })(tid1,window.lang);

                    }

                    document.getElementById("eloCompareButton").addEventListener('click', function () {
                        let keyRedirect="elo_compare"
                        if(elo_data['elo_category'].includes("national_team")){
                            keyRedirect="elo_compare_nt"
                        }

                        let url="https://statsxente.com/MZ1/Functions/graphLoader.php?graph="+keyRedirect+"&lang="+window.lang
                            +"&category="+document.getElementById("catSelect").value+"&sport="+window.sport
                        let contenedor = document.getElementById('match-info-wrapper');
                        let links = contenedor.querySelectorAll('a');
                        let cont=0;
                        links.forEach(link => {
                            if ((link.href.includes('tid='))&&(cont<2)) {
                                let urlParams = new URLSearchParams(link.href);
                                let team_id=urlParams.get("tid")
                                url+="&team_name"+cont+"="+encodeURIComponent(link.innerText)+"&team_id"+cont+"="+team_id
                                cont++
                            }
                        });

                        openWindow(url, 0.95, 1.25);

                    });



                }});

        }else{


            var newT = '</br><div style="text-align: center;"><div style="width: 4.5em; display:none;" class="matchIcon  large shadow"><i style="color: black;"><img alt="" width="16px" height="12px" src="https://statsxente.com/MZ1/View/Images/diff_elo.png"> '
            newT+='0</i></div>'
            newT+='<select id="catSelect" style="background-color: '+GM_getValue("bg_native")+'; padding: 6px 3px; border-radius: 3px; width: 9em; border-color: '+GM_getValue("bg_native")+'; color: '+GM_getValue("color_native")
            newT+='; font-family: Roboto; font-weight: bold; font-size: revert;">'
            for (let i = 0; i < cats_temp.length; i++) {
                let tmp=""
                newT+="<option value='"+cats_temp[i]+"' "+tmp+">"+cats_temp[i]+"</option>"
            }
            newT +='</select>  <button class="btn-save" style="color:'+GM_getValue("color_native")+'; background-color:'+GM_getValue("bg_native")+'; font-family: \'Roboto\'; font-weight:bold;'
            newT+='font-size:revert; width:9em; padding: 5px 3px;" id="eloCompareButton"><i class="bi bi-graph-up" style="font-style:normal;"> ELO Compare</i></button>'
            document.getElementById("match-tactic-facts-wrapper").insertAdjacentHTML('afterbegin', newT);



            document.getElementById("eloCompareButton").addEventListener('click', function () {
                let contenedor = document.getElementById('match-info-wrapper');
                let imgs = contenedor.querySelectorAll('img');
                let flag=false
                for (const img of imgs) {
                    if(img.outerHTML.includes("nocache-936/img/flags/64/mz.png")){
                        flag=true;
                        break;
                    }

                }

                let keyRedirect="elo_compare"
                if(flag){
                    keyRedirect="elo_compare_nt"
                }
                let url="https://statsxente.com/MZ1/Functions/graphLoader.php?graph="+keyRedirect+"&lang="+window.lang
                    +"&category="+document.getElementById("catSelect").value+"&sport="+window.sport

                let links = contenedor.querySelectorAll('a');
                let cont=0;
                links.forEach(link => {
                    if ((link.href.includes('tid='))&&(cont<2)) {
                        let urlParams = new URLSearchParams(link.href);
                        let team_id=urlParams.get("tid")
                        url+="&team_name"+cont+"="+encodeURIComponent(link.innerText)+"&team_id"+cont+"="+team_id
                        cont++
                    }
                });

                openWindow(url, 0.95, 1.25);

            });





        }


        let linkIds=""
        let contIds=0
        for (let x = 0; x < 2; x++) {
            let as = team_div[x].getElementsByTagName("a")
            let urlObj = new URL("https://www.managerzone.com/" + as[0].getAttribute('href'));
            let params = new URLSearchParams(urlObj.search);
            let tidValue = params.get('tid');
            teams_[x] = { "team_name": as[0].innerHTML, "team_id": tidValue, "inserted": "" }
            linkIds += "&idEquipo" + contIds + "=" + tidValue
            contIds++
        }


        GM_xmlhttpRequest({
            method: "GET",
            url: "https://statsxente.com/MZ1/Functions/tamper_teams.php?currency=" + GM_getValue("currency") + "&sport=" + window.sport + linkIds,
            headers: {
                "Content-Type": "application/json"
            },
            onload: function (response) {

                let jsonResponse = JSON.parse(response.responseText);
                const divs = document.querySelectorAll('div'); // Selecciona todos los divs
                const divsConAltura15px = Array.from(divs).filter(div => {
                    const computedStyle = window.getComputedStyle(div);
                    return computedStyle.height === '15px' && div.innerHTML === "";
                });


                for(let m=0;m<2;m++){

                    let aux=teams_[m]['team_id']

                    let top="TOP 11"

                    if(window.sport==="hockey"){
                        top="TOP 21"
                    }

                    let teamTable='<div style="display: flex;flex-direction: column;justify-content: center;align-items: center;flex-wrap: wrap;max-height: 100%;">'

                    if(window.sport==="soccer"){
                        teamTable+='<button id="spy_'+aux+'" class="btn-save" style="color:'+GM_getValue("color_native")+'; background-color:'+GM_getValue("bg_native")+'; font-family: \'Roboto\'; font-weight:bold;font-size:revert; width:7em; padding: 2px 2px;">'
                        teamTable+='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-incognito" viewBox="0 0 16 16">'
                        teamTable+='<path fill-rule="evenodd" d="m4.736 1.968-.892 3.269-.014.058C2.113 5.568 1 6.006 1 6.5 1 7.328 4.134 8 8 8s7-.672 7-1.5c0-.494-1.113-.932-2.83-1.205l-.014-.058-.892-3.27c-.146-.533-.698-.849-1.239-.734C9.411 1.363 8.62 1.5 8 1.5s-1.411-.136-2.025-.267c-.541-.115-1.093.2-1.239.735m.015 3.867a.25.25 0 0 1 .274-.224c.9.092 1.91.143 2.975.143a30 30 0 0 0 2.975-.143.25.25 0 0 1 .05.498c-.918.093-1.944.145-3.025.145s-2.107-.052-3.025-.145a.25.25 0 0 1-.224-.274M3.5 10h2a.5.5 0 0 1 .5.5v1a1.5 1.5 0 0 1-3 0v-1a.5.5 0 0 1 .5-.5m-1.5.5q.001-.264.085-.5H2a.5.5 0 0 1 0-1h3.5a1.5 1.5 0 0 1 1.488 1.312 3.5 3.5 0 0 1 2.024 0A1.5 1.5 0 0 1 10.5 9H14a.5.5 0 0 1 0 1h-.085q.084.236.085.5v1a2.5 2.5 0 0 1-5 0v-.14l-.21-.07a2.5 2.5 0 0 0-1.58 0l-.21.07v.14a2.5 2.5 0 0 1-5 0zm8.5-.5h2a.5.5 0 0 1 .5.5v1a1.5 1.5 0 0 1-3 0v-1a.5.5 0 0 1 .5-.5"/></svg> Spy Tactic</button>'

                    }


                    teamTable+='<table class="matchValuesTable"><thead><tr>'
                    teamTable+='<th id=thTransparent'+m+' style="background-color:transparent; border:0;"></th>'
                    teamTable+='<th style="border-top-left-radius: 5px;">Value</th><th>LM Value</th>'
                    teamTable+='<th >'+top+'</th><th style="border-top-right-radius: 5px;">ELO</th></tr></thead><tbody>'
                    let valor=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor']))
                    let valorLM=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valorUPSenior']))
                    let valor11=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor11']))
                    let elo=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['elo']))
                    teamTable+='<tr><th style="border-top-left-radius: 5px;">Senior</th><td>'+valor+'</td><td>'+valorLM+'</td><td>'+valor11+'</td><td style="border-right:1px solid '+GM_getValue("bg_native")+';">'+elo+'</td></tr>'

                    valor=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor23']))
                    valorLM=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valorUPSUB23']))
                    valor11=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor11_23']))
                    elo=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['elo23']))
                    teamTable+='<tr><th>U23</th><td>'+valor+'</td><td>'+valorLM+'</td><td>'+valor11+'</td><td style="border-right:1px solid '+GM_getValue("bg_native")+';">'+elo+'</td></tr>'


                    valor=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor21']))
                    valorLM=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valorUPSUB21']))
                    valor11=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor11_21']))
                    elo=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['elo21']))
                    teamTable+='<tr><th>U21</th><td>'+valor+'</td><td>'+valorLM+'</td><td>'+valor11+'</td><td style="border-right:1px solid '+GM_getValue("bg_native")+';">'+elo+'</td></tr>'

                    valor=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor18']))
                    valorLM=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valorUPSUB18']))
                    valor11=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor11_18']))
                    elo=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['elo18']))
                    teamTable+='<tr><th style="border-bottom-left-radius: 5px;">U18</th><td style="border-bottom:1px solid '+GM_getValue("bg_native")+';">'+valor+'</td>'
                    teamTable+='<td style="border-bottom:1px solid '+GM_getValue("bg_native")+';">'+valorLM+'</td>'
                    teamTable+='<td style="border-bottom:1px solid '+GM_getValue("bg_native")+';;">'+valor11+'</td>'
                    teamTable+='<td style="border-radius: 0 0 10px 0; border-bottom:1px solid '+GM_getValue("bg_native")+'; border-right:1px solid '+GM_getValue("bg_native")+';">'+elo+'</td></tr>'


                    teamTable+='</tbody></table></div>'

                    divsConAltura15px[m].insertAdjacentHTML('afterend',teamTable);
                    if(window.sport==="soccer"){
                        (function (currentId,lang) {
                            document.getElementById("spy_" + currentId).addEventListener('click', function () {
                                let urlParamsAux = new URLSearchParams(window.location.search);
                                let link = "https://statsxente.com/MZ1/Functions/graphLoader.php?tamper=yes&graph=spyTactic&tolerance=25&limit=100&match_id="+urlParamsAux.get('mid')+"&team_id=" + currentId + "&idioma=" + lang + "&divisa=" + GM_getValue("currency");
                                openWindow(link, 0.95, 1.25);
                            });
                        })(aux,window.lang);


                    }

                }


                const thElements = document.querySelectorAll('table.matchValuesTable th');

// Cambia el color de fondo de cada <th>
                thElements.forEach(th => {
                    th.style.backgroundColor = GM_getValue("bg_native");
                    th.style.color = GM_getValue("color_native");

                });
                document.getElementById("thTransparent0").style.backgroundColor="transparent";
                document.getElementById("thTransparent1").style.backgroundColor="transparent";




            }
        });



        let elems = document.getElementsByClassName("hitlist " + window.sport + " statsLite marker tablesorter");
        if(elems.length) {
            for (let x = 0; x < 2; x++) {
                let linkIds = ""
                let contIds = 0;
                let tabla = elems[x]
                let filas = tabla.getElementsByTagName("tr");
                let fila = filas[1];

                for (let i = 2; i < filas.length - 1; i++) {

                    fila = filas[i];
                    let tds = fila.getElementsByTagName("td");
                    let as_ = tds[2].getElementsByTagName("a");
                    let urlObj = new URL("https://www.managerzone.com/" + as_[0].getAttribute("href"));
                    let params = new URLSearchParams(urlObj.search);
                    let pid = params.get('pid');

                    linkIds += "&id" + contIds + "=" + pid
                    contIds++;
                }

                let link = "http://statsxente.com/MZ1/Functions/tamper_check_stats_player.php?sport=" + window.sport + linkIds
                teams_[x]["inserted"] = await fetchExistPlayers(link);

            }


            elems = document.getElementsByClassName("hitlist " + window.sport + " statsLite marker tablesorter");
            for (let x = 0; x < 2; x++) {
                if (teams_[x]['inserted']['total'] > 0) {
                    let tabla = elems[x]
                    let firstTrThead = tabla.querySelector('thead td');
                    let currentColspan = firstTrThead.getAttribute('colspan');
                    currentColspan = parseInt(currentColspan, 10) + 1;
                    firstTrThead.setAttribute('colspan', currentColspan);
                    let secondTrThead = tabla.querySelector('thead tr:nth-of-type(2)')
                    let newTd = document.createElement('td');
                    newTd.textContent = '';
                    secondTrThead.appendChild(newTd);
                    let filas = tabla.getElementsByTagName("tr");
                    let dato = document.createElement("td");
                    let tfoot = tabla.querySelector("tfoot");
                    let primeraFilaTfoot = tfoot.querySelector("tr");
                    let primerTDTfoot = primeraFilaTfoot.querySelector("td");
                    primerTDTfoot.setAttribute("colspan", "9");

                    let elems2 = document.getElementsByClassName("listHeadColor");
                    let lista = elems2[0]

                    let nuevoElementoDD = document.createElement("dd");
                    nuevoElementoDD.textContent = "Nuevo elemento";
                    nuevoElementoDD.className = "c6"
                    lista.appendChild(nuevoElementoDD);

                    for (let i = 2; i < filas.length - 1; i++) {
                        let fila = filas[i];

                        let tds = fila.getElementsByTagName("td");
                        let as_ = tds[2].getElementsByTagName("a");
                        let urlObj = new URL("https://www.managerzone.com/" + as_[0].getAttribute("href"));
                        let params = new URLSearchParams(urlObj.search);
                        let pid = params.get('pid');
                        if (teams_[x]['inserted'][pid] === "yes") {
                            dato = document.createElement("td");
//aa

                            dato.innerHTML = "<img alt='' src='https://statsxente.com/MZ1/View/Images/main_icon.png' width='20px' height='20px' id='but" + pid + "' style='cursor:pointer;'/>"
                            fila.appendChild(dato);


                            (function (currentId, currentTeamId, currentSport, lang, team_name, player_name) {
                                document.getElementById("but" + currentId).addEventListener('click', function () {

                                    let link = "http://statsxente.com/MZ1/Functions/tamper_player_stats.php?sport=" + currentSport
                                        + "&player_id=" + currentId + "&team_id=" + currentTeamId + "&idioma=" + lang + "&divisa=" + GM_getValue("currency") +
                                        "&team_name=" + encodeURIComponent(team_name) + "&player_name=" + encodeURIComponent(player_name)
                                    openWindow(link, 0.95, 1.25);
                                });
                            })(pid, teams_[x]['team_id'], window.sport, window.lang, teams_[x]['team_name'], as_[0].innerHTML);


                        } else {
                            dato = document.createElement("td");
                            fila.appendChild(dato);
                        }
                    }
                }
            }

        }


    }
//Players page
    async function playersPage() {
        const blob = new Blob([workerCode], { type: "application/javascript" });
        const workerURL = URL.createObjectURL(blob);
        const worker = new Worker(workerURL);
        const tacticsList = [];
        const sport= window.sport
        const elementos = Array.from(document.getElementsByClassName('playerContainer')).map((el) => {
            const playerId = el.querySelector('.player_id_span').textContent.trim();
            const age = el.querySelector('.dg_playerview_info table td').textContent.split(':')[1].trim();
            const skills = Array.from(el.querySelectorAll('.skills-container .skillval')).map(skill => {
                const cleanedText = skill.textContent.trim().replace(/[()]/g, ''); // Reemplaza ( y ) con ''
                return parseInt(cleanedText, 10);
            });

            let tactics

            if(sport==="soccer"){

                tactics = Array.from(el.querySelectorAll('.player_tactic.gradientSunriseIcon'))
                    .map(t => ({
                        name: t.textContent.split('(')[0].trim(),
                        line: t.textContent.split('(')[1].split(')')[0].trim(),
                    }))
                    .filter((value, index, self) => {
                        const tacticString = `${value.name}-${value.line}`;
                        return self.findIndex(t => `${t.name}-${t.line}` === tacticString) === index;
                    });



            }else{


                tactics = Array.from(el.querySelectorAll('.player_tactic.gradientSunriseIcon'))
                    .map(t => {
                        const textContent = t.textContent.trim();
                        const [namePart, linePart] = textContent.split('(');

                        const name = namePart.trim();
                        let line = '';

                        if (linePart) {
                            line = linePart.replace(')', '').trim();
                            if (line.includes(':')) {
                                line = line.split(':')[0].trim();
                            }else{
                                gk_line=line
                            }
                        }


                        return { name, line };
                    })
                    .filter((value, index, self) => {
                        const tacticString = `${value.name}-${value.line}`;
                        return self.findIndex(t => `${t.name}-${t.line}` === tacticString) === index;
                    });

            }





            tactics.forEach(tactic => {
                tacticsList.push(tactic.name);
            });

            return { id: playerId, age, skills, tactics };
        });
        const skillsNames = Array.from(document.querySelectorAll('.player_skills .clippable')).map(el => el.textContent.trim()).filter((value, index, self) => self.indexOf(value) === index);
        let flagStats = true
        let urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('tid')) {
            flagStats = false

        }

        if(flagStats){
            let team_id
            if(window.sport==="soccer"){

                if ((GM_getValue("soccer_team_id") === undefined) || (GM_getValue("soccer_team_id") === "")){
                    let div_player=document.getElementById("thePlayers_0")
                    let h2s=div_player.getElementsByTagName("h2");
                    let as=h2s[0].getElementsByTagName("a")
                    let urlObj = new URL("https://www.managerzone.com/"+as[0].getAttribute("href"));
                    let params = new URLSearchParams(urlObj.search);
                    let tid = params.get('tid');
                    GM_setValue("soccer_team_id",tid)
                }


                team_id=GM_getValue("soccer_team_id")
            }else{
                if ((GM_getValue("hockey_team_id") === undefined) || (GM_getValue("hockey_team_id") === "")){
                    let div_player=document.getElementById("thePlayers_0")
                    let h2s=div_player.getElementsByTagName("h2");
                    let as=h2s[0].getElementsByTagName("a")
                    let urlObj = new URL("https://www.managerzone.com/"+as[0].getAttribute("href"));
                    let params = new URLSearchParams(urlObj.search);
                    let tid = params.get('tid');
                    GM_setValue("hockey_team_id",tid)
                }
                team_id=GM_getValue("hockey_team_id")
            }
            let elementos1 = document.getElementsByClassName('playerContainer');
            for (let i = 0; i < elementos1.length; i++) {
                let ids = elementos1[i].getElementsByClassName('player_id_span');
                let playerName = elementos1[i].querySelector('.player_name').textContent
                let elementos_ = elementos1[i].getElementsByClassName('p_sublinks');
                let txt = '<span id=but' + ids[0].textContent + ' class="player_icon_placeholder"><a href="#" onclick="return false"'
                txt += 'title="Stats Xente" class="player_icon"><span class="player_icon_wrapper">'
                txt += '<span class="player_icon_image" style="background-image: url(\'https://www.statsxente.com/MZ1/View/Images/main_icon_mini.png\'); width: 21px; height: 18px; background-size: auto;'
                txt += 'z-index: 0;"></span><span class="player_icon_text"></span></span></a></span>'

                let index=0
                if(window.stx_device!=="computer"){index=1}
                elementos_[index].innerHTML += txt;



                (function (currentId, currentTeamId, currentSport, lang, team_name, player_name) {
                    document.getElementById("but" + currentId).addEventListener('click', function () {
                        let link = "http://statsxente.com/MZ1/Functions/tamper_player_stats.php?sport=" + currentSport
                            + "&player_id=" + currentId + "&team_id=" + currentTeamId + "&idioma=" + lang + "&divisa=" + GM_getValue("currency") +
                            "&team_name=" + encodeURIComponent(team_name) + "&player_name=" + encodeURIComponent(player_name)
                        openWindow(link, 0.95, 1.25);
                    });
                })(ids[0].textContent, team_id, window.sport, window.lang, "[undefined]", playerName);




            }


        }

        if(sport==="soccer"){
            skillsNames.pop();
            //GK Line detect
            const playerImages = document.querySelectorAll('.player-image');
            const elementWithGK1 = Array.from(playerImages).find(el => {
                return el.innerHTML.includes('gk=1');
            });



            let tactics1 = elementWithGK1.parentNode.getElementsByClassName("player_tactic gradientSunriseIcon")
            let ini = tactics1[0].textContent.indexOf('(');
            let fin = tactics1[0].textContent.indexOf(')');
            gk_line = tactics1[0].textContent.substring(ini + 2, fin - 1);


        }
        worker.postMessage({ elementos, sport, skillsNames, tacticsList, flagStats});
        worker.onmessage = function (e) {
            const players=e.data.players
            const lines=e.data.lines
            const tacticsList=e.data.tacticsList
            const skillsNames= e.data.skillsNames

            su_line=e.data.su_line

            if(su_line===""){
                su_line="unsetted"
            }

            const container = document.getElementById("squad-search-toggle");
            let contenidoNuevo = "<div id='containerTactics' style='background-color: #e3e3e3; margin: 0 auto; text-align:center;'></br>";
            contenidoNuevo += "<div id=selectDiv>Choose Tactic: <select id=tactics_select>";
            contenidoNuevo += "<option value='All Team' selected>All Team</option>";


            for (let x = 0; x < tacticsList.length; x++) {
                let selected="";
                contenidoNuevo += `<option ${selected} value='${tacticsList[x]}'>${tacticsList[x]}</option>`;
            }

            contenidoNuevo += "</select></div></br><div id=divMenu></div></center></div>";
            container.innerHTML = contenidoNuevo + container.innerHTML;

            document.getElementById("tactics_select").addEventListener('change', function () {
                const selectedTactic = this.value;
                document.getElementById("divMenu").innerHTML = ""
                skillDistrib(selectedTactic, players, lines, skillsNames,gk_line,su_line);
            });

            skillDistrib("All Team", players, lines, skillsNames,gk_line,su_line);


            maximizationsPlayersPage()



        };
    }
    async function maximizationsPlayersPage(){
        let elementos1 = document.getElementsByClassName('weeklyReportBox weeklyReportBoxResponsive');
        let elementosConBall = Array.from(elementos1).filter(el => el.innerHTML.includes('ball')&& el.innerHTML.includes('improvement'));
        for (let i = 0; i < elementosConBall.length; i++) {
            let improvementDiv=elementosConBall[i].getElementsByClassName("improvementLabel")
            let trainedSkill=elementosConBall[i].getElementsByClassName("clippable")
            let skills=elementosConBall[i].parentNode.parentNode.parentNode.parentNode.getElementsByClassName("player_skills player_skills_responsive")
            let elementosConHola = Array.from(skills[0].getElementsByClassName("clippable")).filter(el => el.innerText.includes(trainedSkill[0].innerText));
            let currentTd = elementosConHola[0].closest('td');
            if(currentTd.nextElementSibling?.nextElementSibling?.nextElementSibling?.nextElementSibling?.nextElementSibling.innerHTML.includes("maxed")){
                improvementDiv[0].style.backgroundColor="#db5d5d"
            }
        }
    }
    async function skillDistrib(tactic,players, lines, skills_names,gk_line,su_line) {
        let t = tactic
        let l=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        if (window.sport === "hockey") {
            l = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0]
        }

        let li_t = {}
        for (let i = 0; i < lines.length; i++) {
            li_t[lines[i]] = [...l];
        }

        let no_gk_line = "Tactic -(" + gk_line + ")"
        li_t["Team"] = [...l];
        li_t["U23"] = [...l];
        li_t["U21"] = [...l];
        li_t["U18"] = [...l];
        li_t["Tactic"] = [...l];
        li_t[no_gk_line] = [...l];

        let i,j
        for (i = 0; i < players.length; i++) {
            if (players[i]['tactics'].includes(t)) {
                for (j = 0; j < players[i]['skills'].length; j++) {
                    li_t[players[i]['tacticsPosition'][t]][j] += players[i]['skills'][j]
                    li_t['Tactic'][j] += players[i]['skills'][j]
                    if (players[i]['tacticsPosition'][t] !== gk_line) {
                        li_t[no_gk_line][j] += players[i]['skills'][j]
                    }
                }
                li_t[players[i]['tacticsPosition'][t]][j] += 1
                li_t['Tactic'][j] += 1
                if (players[i]['tacticsPosition'][t] !== gk_line) {
                    li_t[no_gk_line][j] += 1
                }
            } else {

                for (let j = 0; j < players[i]['skills'].length; j++) {
                    if (players[i]['age'] <= 23) {
                        li_t['U23'][j] += players[i]['skills'][j]
                    }
                    if (players[i]['age'] <= 23) {
                        li_t['U21'][j] += players[i]['skills'][j]
                    }
                    if (players[i]['age'] <= 23) {
                        li_t['U18'][j] += players[i]['skills'][j]
                    }
                    li_t['Team'][j] += players[i]['skills'][j]
                }

                if (players[i]['age'] <= 23) {
                    li_t['U23'][li_t["U23"].length - 1] += 1
                }

                if (players[i]['age'] <= 21) {
                    li_t['U21'][li_t["U21"].length - 1] += 1
                }
                if (players[i]['age'] <= 18) {
                    li_t['U18'][li_t["U18"].length - 1] += 1
                }
                li_t['Team'][li_t["Team"].length - 1] += 1
            }
        }

        const container = document.getElementById("divMenu")
        let contenidoNuevo = "<table id=showMenu style='max-width: 100%; overflow-x: auto; display: block; width:95%;font-size:13px; margin: 0 auto; text-align:center;'><thead style='background-color:" + GM_getValue("bg_native") + "; color:" + GM_getValue("color_native") + ";'><tr>";
        contenidoNuevo += '<th style="padding:4px; margin: 0 auto; text-align:center;">Line</th>'
        for (let q = 0; q < skills_names.length; q++) {
            contenidoNuevo += '<th style="padding:4px; margin: 0 auto; text-align:center;">' + skills_names[q] + '</th>'
        }
        contenidoNuevo += '</tr></thead>';
        let l_aux = lines
        l_aux = l_aux.filter(item => item !== gk_line);
        l_aux.sort((a, b) => {
            let numA = parseInt(a.substring(1), 10);
            let numB = parseInt(b.substring(1), 10);
            return numA - numB;
        });

        l_aux.unshift(gk_line);
        l_aux.push("Tactic");
        l_aux.push(no_gk_line);

        if (window.sport === "hockey") {
            if (li_t["L4"][10] === 0) {
                let index = l_aux.indexOf('L4');
                if (index !== -1) {
                    l_aux.splice(index, 1);
                }
            }
        }

        if (t === "All Team") {
            l_aux = ["Team", "U23", "U21", "U18"]
        }
        l_aux = l_aux.filter(item => !item.includes(su_line));

        for (let w = 0; w < l_aux.length; w++) {
            let key = l_aux[w]
            if (li_t.hasOwnProperty(key)) {
                contenidoNuevo += "<tr>";
                contenidoNuevo += "<td style='padding:2px; margin: 0 auto; text-align:center;'><strong>" + key + "</strong></td>";
                for (let x = 0; x < li_t[key].length - 1; x++) {
                    contenidoNuevo += "<td style='padding:2px; margin: 0 auto; text-align:center;'>" + Math.round(li_t[key][x] / li_t[key][li_t[key].length - 1] * 100) / 100 + "</td>";
                }
                contenidoNuevo += "</tr>";
            }
        }
        container.innerHTML += contenidoNuevo;
    }
//Players links to stats
    async function playersPageStats() {
        let element = document.getElementById('thePlayers_0');
        let elementos_ = element.getElementsByClassName('p_sublinks');
        let subheaders = element.getElementsByClassName('subheader clearfix');
        let enlace = subheaders[0].querySelector('.subheader a');
        let urlObj = new URL("https://www.managerzone.com/" + enlace.getAttribute('href'));
        let params = new URLSearchParams(urlObj.search);
        let tid = params.get('tid');
        let playerName = enlace.querySelector('.player_name').textContent
        let ids = element.getElementsByClassName('player_id_span');
        let txt = '<span id=but' + ids[0].textContent + ' class="player_icon_placeholder"><a href="#" onclick="return false"'
        txt += 'title="Stats Xente" class="player_icon"><span class="player_icon_wrapper">'
        txt += '<span class="player_icon_image" style="background-image: url(\'https://www.statsxente.com/MZ1/View/Images/main_icon_mini.png\'); width: 21px; height: 18px; background-size: auto;'
        txt += 'z-index: 0;"></span><span class="player_icon_text"></span></span></a></span>'

        let index=0
        if(window.stx_device!=="computer"){
            index=1
        }
        elementos_[index].innerHTML += txt;
        (function (currentId, currentTeamId, currentSport, lang, team_name, player_name) {
            document.getElementById("but" + currentId).addEventListener('click', function () {
                let link = "http://statsxente.com/MZ1/Functions/tamper_player_stats.php?sport=" + currentSport
                    + "&player_id=" + currentId + "&team_id=" + currentTeamId + "&idioma=" + lang + "&divisa=" + GM_getValue("currency") +
                    "&team_name=" + encodeURIComponent(team_name) + "&player_name=" + encodeURIComponent(player_name)
                openWindow(link, 0.95, 1.25);
            });
        })(ids[0].textContent, tid, window.sport, window.lang, "[undefined]", playerName);
    }
//Country ranking page
    function countryRank() {
        let table_values = ["players", "age", "value", "top11", "salary", "elo", "elo21", "lm", "lmu21"]
        let newContent = "<div style='margin: 0 auto; text-align:center;'>";
        newContent += '<label><input class="statsxente" type="checkbox" checked id="value" value="Value">Value</label>';
        if (window.sport === "soccer") {
            newContent += '<label><input class="statsxente" type="checkbox" id="top11" value="TOP 11">TOP 11</label>';
        } else {
            newContent += '<label><input class="statsxente" type="checkbox" id="top11" value="TOP 21">TOP 21</label>';
        }

        newContent += '<label><input class="statsxente" type="checkbox" id="players" value="Players">Players</label>';
        newContent += '<label><input class="statsxente" type="checkbox" id="salary" value="Salary">Salary</label>';
        newContent += '<label><input class="statsxente" type="checkbox" id="age" value="Age">Age</label>';
        newContent += '<label><input class="statsxente" type="checkbox" checked id="elo" value="Elo">ELO</label>';
        newContent += '<label><input class="statsxente" type="checkbox" checked id="elo21" value="U21 ELO">U21 ELO</label>';
        newContent += '<label><input class="statsxente" type="checkbox" checked id="lm" value="LM">LM</label>';
        newContent += '<label><input class="statsxente" type="checkbox" checked id="lmu21" value="U21 LM">U21 LM</label>';

        let contenedor = document.getElementById('countryRankTable');
        getDeviceFormat()
        if(window.stx_device!=="computer"){
            contenedor.style.overflowX = 'auto'
            contenedor.style.display='block'
            contenedor.style.maxWidth='100%'
        }
        contenedor.insertAdjacentHTML('beforebegin', newContent);

        GM_xmlhttpRequest({
            method: "GET",
            url: "https://statsxente.com/MZ1/Functions/tamper_national_teams.php?currency=" + GM_getValue("currency") + "&sport=" + window.sport,
            headers: {
                "Content-Type": "application/json"
            },
            onload: function (response) {
                let data = JSON.parse(response.responseText);

                let type = 1;
                if (window.sport === "soccer") {
                    type = 2
                }
                let table = document.getElementById('countryRankTable');

                for (let i = 0; i < table.rows.length; i++) {
                    let row = table.rows[i];
                    let insertIndex = row.cells.length - 1;
                    let raw_str = row.cells[3].innerHTML
                    row.deleteCell(3);
                    let cell_name = row.cells[2]
                    if (i > 0) {
                        cell_name.innerHTML = raw_str + " " + cell_name.innerHTML
                    }
                    let index = 0;
                    let cell0 = row.insertCell(insertIndex + index);
                    index++;
                    let cell1 = row.insertCell(insertIndex + index);
                    index++;
                    let cell2 = row.insertCell(insertIndex + index);
                    index++;
                    let cell3 = row.insertCell(insertIndex + index);
                    index++;
                    let cell4 = row.insertCell(insertIndex + index);
                    index++;
                    let cell5 = row.insertCell(insertIndex + index);
                    index++;
                    let cell6 = row.insertCell(insertIndex + index);
                    index++;
                    let cell7 = row.insertCell(insertIndex + index);
                    index++;
                    let cell8 = row.insertCell(insertIndex + index);
                    index++;
                    let cell9 = row.insertCell(insertIndex + index);



                    if (i === 0) {
                        cell0.outerHTML = "<th id='players_th' style='display:none;' class='header'><a href='#'>Players</a></th>";
                        cell1.outerHTML = "<th id='age_th' class='header' style='display:none;'><a href='#'>Age</a></th>";
                        cell2.outerHTML = "<th id='value_th' class='header' style='display:table-cell;'><a href='#'>Value</a></th>";
                        cell3.outerHTML = "<th id='top11_th' class='header' style='display:none;'><a href='#'>Top11</a></th>";
                        cell4.outerHTML = "<th id='salary_th' class='header' style='display:none;'><a href='#'>Salary</a></th>";
                        cell5.outerHTML = "<th id='elo_th' class='header' style='display:table-cell;'><a href='#'>ELO</a></th>";
                        cell6.outerHTML = "<th id='elo21_th' class='header' style='display:table-cell;'><a href='#'>U21 ELO</a></th>";
                        cell7.outerHTML = "<th id='lm_th' class='header' style='display:table-cell;'><a href='#'>LM</a></th>";
                        cell8.outerHTML = "<th id='lmu21_th' class='header' style='display:table-cell;'><a href='#'>U21 LM</a></th>";
                        cell9.outerHTML = "<th id='image' class='header' style='display:table-cell;'><a href='#'></a></th>";
                    } else {
                        let ini = raw_str.indexOf("s_");
                        let fin = raw_str.indexOf(".", ini + 1);
                        let c_code = raw_str.substring(ini + 2, fin)
                        cell0.innerHTML = new Intl.NumberFormat(window.userLocal).format(Math.round(data[c_code]["numJugadores"]))
                        cell0.className = "players"
                        cell0.style.display = "none"

                        cell1.innerHTML = new Intl.NumberFormat(window.userLocal, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data[c_code]["edad"])
                        cell1.className = "age"
                        cell1.style.display = "none"

                        cell2.innerHTML = new Intl.NumberFormat(window.userLocal).format(Math.round(data[c_code]["valor"]))
                        cell2.className = "value"
                        cell2.style.display = "table-cell"

                        cell3.innerHTML = new Intl.NumberFormat(window.userLocal).format(Math.round(data[c_code]["valor11"]))
                        cell3.className = "top11"
                        cell3.style.display = "none"

                        cell4.innerHTML = new Intl.NumberFormat(window.userLocal).format(Math.round(data[c_code]["salario"]))
                        cell4.className = "salary"
                        cell4.style.display = "none"

                        cell5.innerHTML = new Intl.NumberFormat(window.userLocal).format(Math.round(data[c_code]["elo"]))
                        cell5.className = "elo"
                        cell5.style.display = "table-cell"

                        cell6.innerHTML = new Intl.NumberFormat(window.userLocal).format(Math.round(data[c_code]["elo21"]))
                        cell6.className = "elo21"
                        cell6.style.display = "table-cell"

                        cell7.innerHTML = new Intl.NumberFormat(window.userLocal).format(Math.round(data[c_code]["valorLM"]))
                        cell7.className = "lm"
                        cell7.style.display = "table-cell"

                        cell8.innerHTML = new Intl.NumberFormat(window.userLocal).format(Math.round(data[c_code]["valorLM21"]))
                        cell8.className = "lmu21"
                        cell8.style.display = "table-cell"

                        cell9.innerHTML = '<img alt="" style="cursor:pointer;" src="https://statsxente.com/MZ1/View/Images/calendar.png" width="20" height="20">'
                        let actual_id = "image" + i
                        cell9.id = actual_id
                        cell9.style.display = "table-cell";


                        (function (id, code, type_) {
                            document.getElementById(id).addEventListener('click', function () {
                                let link = "https://www.statsxente.com/MZ1/Graficos/graficoRachaEquipoELONT.php?tamper=yes&team_id=" + data[code]["idSenior"] +
                                    "&team_id_u21=" + data[code]["idSub21"] + "&idioma=" + window.lang + "&type=" + type_ + "&cat=SENIOR&sport=" + window.sport;
                                openWindow(link, 0.95, 1.25);
                            });
                        })(actual_id, c_code, type);
                    }
                }

                setTimeout(function () {
                    for (let f = 0; f < table_values.length; f++) {

                        (function (actual_value, f) {

                            document.getElementById(actual_value + "_th").addEventListener('click', function () {
                                if (document.getElementById(actual_value + "_th").className === "header") {
                                    document.getElementById(actual_value + "_th").className = "header headerSortDown";
                                } else {

                                    if (document.getElementById(actual_value + "_th").className === "header headerSortDown") {
                                        document.getElementById(actual_value + "_th").className = "header headerSortUp";
                                    } else {
                                        document.getElementById(actual_value + "_th").className = "header headerSortDown";
                                    }

                                }
                                let index_ = 3 + f
                                ordenarTabla(index_, false, "countryRankTable",false)
                            });
                            document.getElementById(actual_value).addEventListener('click', function () {
                                let display = "table-cell"
                                if (document.getElementById(actual_value + "_th").style.display === "table-cell") {
                                    display = "none"
                                }
                                let elementos = document.getElementsByClassName(actual_value)
                                Array.prototype.forEach.call(elementos, function (elemento) {
                                    let aux_display = "table-cell"
                                    if (document.getElementById(actual_value + "_th").style.display === "table-cell") {
                                        aux_display = "none"
                                    }
                                    elemento.style.display = aux_display;
                                });
                                document.getElementById(actual_value + "_th").style.display = display
                            });
                        })(table_values[f], f);
                    }
                }, 1000);
            }
        });
    }
//Stats Xente competitions matches
    function StatsXenteNextMatchesClubhouse() {
        let h1Elements = document.querySelectorAll('h1.box_dark');
        let team_name = h1Elements[0].innerText
        let team_id = document.getElementById("tid1").value;

        GM_xmlhttpRequest({
            method: "GET",
            url: "https://statsxente.com/MZ1/Functions/tamper_user_next_matches.php?team_id=" + team_id,
            headers: {
                "Content-Type": "application/json"
            },
            onload: function (response) {
                let data = JSON.parse(response.responseText);
                if (data.length > 0) {


                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "http://www.managerzone.com/xml/team_matchlist.php?sport_id=" + window.sport_id + "&team_id=" + team_id + "&match_status=2&limit=100",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        onload: function (response) {

                            let matchesDate = []
                            let parser = new DOMParser();
                            let xmlDoc = parser.parseFromString(response.responseText, "text/xml");
                            let matches = xmlDoc.getElementsByTagName("Match");

                            let last_date = ""


                            for (let i = 0; i < matches.length; i++) {
                                let dateOnly = matches[i].getAttribute("date").split(" ")[0];
                                last_date = dateOnly
                                let teams = matches[i].getElementsByTagName("Team");

                                for (let j = 0; j < teams.length; j++) {
                                    if (teams[j].getAttribute("teamId") !== team_id) {
                                        matchesDate.push(teams[j].getAttribute("teamId") + "-" + dateOnly)

                                    }
                                }


                            }




                            let newContent = `
    <div id="tour-container" class="widgets-container">
        <div class="flex-wrap hub-widget-container">
            <div class="flex-grow-1 box_dark">
                <div id="clubhouse-widget-tour" class="widget-content clearfix">
                    <i class="fa minimize-button fa-minus-square" aria-hidden="true" data-time="1722549599"></i>
                    <span class="fa fa-stack fa-2x floatRight">
                        <i class="fa fa-circle fa-stack-2x fa-inverse"></i>
                        <i class="fa fa-thumbs-up fa-stack-1x green" aria-hidden="true"></i>
                </span>
                <h3 style="background-image: url('https://www.statsxente.com/MZ1/View/Images/main_icon.png');">Stats Xente</h3>
                <div class="widget-content-wrapper">
                    <div class="flex-wrap" style="margin-bottom: 35px;">
                        <div class="flex-grow-0" style="margin: 0 auto">
                            <img src="https://www.statsxente.com/MZ1/View/Images/main_icon.png" alt="" width="130" height="130">
                        </div>
                        <div class="flex-grow-1 textLeft">`

                            data.forEach(function (match_data) {

                                let dateObj1 = new Date(last_date);
                                let dateObj2 = new Date(match_data['fecha']);


                                let icon_ = "fa-check-square"
                                let style_ = ""
                                let flagFriendly = false;
                                if (dateObj1 < dateObj2) {
                                    icon_ = "fa-calendar-minus-o"
                                    style_ = "style='color:#e5ac00;'"
                                    flagFriendly = true;
                                } else {

                                    if (matchesDate.includes(match_data['rival_id'] + "-" + match_data['fecha'])) {
                                        if (window.sport === "hockey") {
                                            style_ = "style='color:#6d93fd;'"
                                        }
                                    } else {
                                        icon_ = "fa-times-square"
                                        style_ = "style='color:#AD4039;'"
                                        flagFriendly = true;


                                    }

                                }


                                let match = '<img alt="" src="https://www.managerzone.com/dynimg/badge.php?team_id=' + match_data['idEquipoLocal'] + '&sport="' + window.sport + ' width="15px" height="15px"/> '
                                    + team_name + ' - ' + match_data['rival_name'] + ' <img alt="" src="https://www.managerzone.com/dynimg/badge.php?team_id=' + match_data['idEquipoVisitante'] + '&sport="' + window.sport + ' width="15px" height="15px"/>'
                                if (match_data['field'] === "away") {
                                    match = '<img alt="" src="https://www.managerzone.com/dynimg/badge.php?team_id=' + match_data['idEquipoLocal'] + '&sport="' + window.sport + ' width="15px" height="15px"/> '
                                        + match_data['rival_name'] + ' - ' + team_name + ' <img alt="" src="https://www.managerzone.com/dynimg/badge.php?team_id=' + match_data['idEquipoVisitante'] + '&sport="' + window.sport + ' width="15px" height="15px"/>'
                                }


                                newContent += '<fieldset class="grouping self box_light_on_dark flex-nowrap" style="max-width: 555px; margin-left: 10px;">'
                                newContent += '<legend>' + match_data['clash_name'] + '</legend>'
                                newContent += '<div class="flex-grow-0 mission-icon">'
                                newContent += '<i class="fa ' + icon_ + ' green fa-2x t-checked" aria-hidden="true" ' + style_ + '></i>'
                                newContent += '</div>'
                                newContent += '<div class="flex-grow-1 mission">'

                                let link = "CompAmis_CALENDAR_View.php?" + 'id=' + match_data['idComp']
                                if (match_data['comp'] === "cup") {
                                    link = 'CompAmis_Cup_CALENDAR_View.php?grupo=' + match_data['grupo'] + '&id=' + match_data['idComp']
                                }


                                newContent += '<p><b><a href="https://www.statsxente.com/MZ1/View/' + link + '" target="_blank">' + match + '</a></b>'
                                newContent += "</br></p>"
                                newContent += 'Date: ' + match_data['fecha']
                                if (flagFriendly) {
                                    newContent += "<a href='https://www.managerzone.com/?p=challenges&challenge-tid=" + match_data['rival_id'] + "'><i class='fa fa-thumbs-up fa-lg challenge-thumb' aria-hidden='true'></i></a>"
                                }


                                newContent += '</p>'
                                newContent += '</div>'
                                newContent += '</fieldset>'
                            });




                            newContent += `</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`;




                            let contenedor = document.getElementById('tour-container');
                            if (data.length > 0) {
                                contenedor.insertAdjacentHTML('beforebegin', newContent);

                            }


                        }

                    });

                }


            }
        });

    }



//HANDLERS FUNCTIONS
    function handleClick(event) {

        if(document.getElementById("eloCompareCol")){
            document.getElementById("trELOCompare").style.display="none";
            let elems = document.getElementsByClassName("nice_table");
            let table = elems[0]
            let th = document.getElementById("eloCompareCol");
            let columnIndex = th.cellIndex;
            for (let i = 0; i < table.rows.length; i++) {
                let row = table.rows[i];
                if (row.cells.length > columnIndex) {
                    row.deleteCell(columnIndex);
                }
            }
        }

        if(document.getElementById("trTeamStats").style.display==="table-row"){
            document.getElementById("trTeamStats").style.display="none";
        }

        let urlParams = new URLSearchParams(window.location.search);
        let elems = document.getElementsByClassName("nice_table");
        let tabla = elems[0]
        let filas = tabla.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
        let thSegundo = tabla.querySelector("thead th:nth-child(2)");

        if (urlParams.get('fsid')) {
            thSegundo.style.width = "180px";
        } else {
            thSegundo.style.width = "250px";
        }


        for (let i = 0; i < filas.length; i++) {
            if (checkClassNameExists(filas[i], searchClassName)) {
                let celda = filas[i].cells[1];
                let team_data=extractTeamData(celda.getElementsByTagName("a"));
                let id=team_data[0]
                let celdas = filas[i].getElementsByTagName("td");
                let ultimaCelda = celdas[celdas.length - 2];
                let selects = document.getElementsByTagName('select');
                let index_select = 1;
                if (selects[index_select] === undefined) {
                    index_select = 0;
                }


                let selectedIndex = selects[index_select].selectedIndex;
                let selectedOption = selects[index_select].options[selectedIndex];
                let selectedText = selectedOption.text;



                let key_actual_league = "Top";
                if (selectedText.includes(".")) {
                    key_actual_league = selectedText.substring(0, 4)
                }

                let valor = 0;

                if (teams_data[id] === undefined) {
                    valor = 0
                } else {

                    let table_key = "";
                    let agg_value = 0;
                    let cat

                    switch (event.target.id) {
                        case 'edad':
                            valor = new Intl.NumberFormat(window.userLocal, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(teams_data[id][event.target.id])
                            break;
                        case "leagues":
                            table_key = "league"
                            agg_value = teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                            valor = "(" + teams_data[id]['league_' + key_actual_league] + '/' + agg_value + ")"
                            break;

                        case "world_leagues":
                            table_key = "world_league"
                            agg_value = teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                            valor = "(" + teams_data[id][table_key + '_' + key_actual_league] + '/' + agg_value + ")"
                            break;

                        case "youth_leagues":
                            cat = GM_getValue("actual_league_cat").toLowerCase()
                            table_key = "league_" + cat
                            agg_value = teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                            valor = "(" + teams_data[id][table_key + '_' + key_actual_league] + '/' + agg_value + ")"
                            break;

                        case "world_youth_leagues":
                            cat = GM_getValue("actual_league_cat").toLowerCase()
                            table_key = "world_league_" + cat
                            agg_value = teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                            valor = "(" + teams_data[id][table_key + '_' + key_actual_league] + '/' + agg_value + ")"
                            break;

                        case "leagues_all":
                            table_key = "league"
                            valor = teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                            break;


                        case "world_leagues_all":
                            table_key = "world_league"
                            valor = teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                            break;

                        case "youth_leagues_all":
                            table_key = "league_u23"
                            valor += teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                            table_key = "league_u21"
                            valor += teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                            table_key = "league_u18"
                            valor += teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                            break;

                        case "world_youth_leagues_all":
                            table_key = "world_league_u23"
                            valor += teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                            table_key = "world_league_u21"
                            valor += teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                            table_key = "world_league_u18"
                            valor += teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                            break;

                        case "federation_leagues":
                            table_key = "federation_league"
                            agg_value = teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                            valor = agg_value
                            break;


                        default:
                            valor = new Intl.NumberFormat(window.userLocal).format(Math.round(teams_data[id][event.target.id]))
                            break;


                    }
                }

                ultimaCelda.innerHTML = valor;
            }
        }
        let checkboxes = document.querySelectorAll('.statsxente');
        let thead = tabla.querySelector('thead');
        let tr = thead.querySelectorAll('tr');
        let td = tr[0].querySelectorAll('th');
        td[td.length - 2].textContent = event.target.value;
        checkboxes.forEach(function (checkbox) {
            if (checkbox.id !== event.target.id) {
                checkbox.checked = false;
            }
        });
    }
    function handleClickClash(event) {
        let elems = document.getElementsByClassName("nice_table");
        let tabla = elems[0]
        let filas = tabla.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
        let thSegundo = tabla.querySelector("thead th:nth-child(2)");
        thSegundo.style.width = "250px";
        for (let i = 0; i < filas.length; i++) {
            let celda = tabla.rows[i + 1].cells[1];
            let imagen = celda.querySelector('img');
            let url = new URL(imagen.src);
            let id = url.searchParams.get('fid');


            let celdas = filas[i].getElementsByTagName("td");
            let ultimaCelda = celdas[celdas.length - 2];

            let valor = 0;

            if (teams_data[id] === undefined) {
                valor = 0
            } else {
                if (event.target.id === "edad") {
                    valor = new Intl.NumberFormat(window.userLocal, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(teams_data[id][event.target.id])
                } else {
                    valor = new Intl.NumberFormat(window.userLocal).format(Math.round(teams_data[id][event.target.id]))
                }

            }

            ultimaCelda.innerHTML = valor;
        }
        let checkboxes = document.querySelectorAll('.statsxente');
        let thead = tabla.querySelector('thead');
        let tr = thead.querySelectorAll('tr');
        let td = tr[0].querySelectorAll('th');
        td[td.length - 2].textContent = event.target.value;
        checkboxes.forEach(function (checkbox) {
            if (checkbox.id !== event.target.id) {
                checkbox.checked = false;
            }
        });
    }
    function handleClickUserRank(event) {
        let tabla = document.getElementById("userRankTable");
        let filas = tabla.getElementsByTagName("tbody")[0].getElementsByTagName("tr");

        for (let i = 0; i < filas.length; i++) {
            let celda = filas[i].cells[3];
            let team_data=extractTeamData(celda.getElementsByTagName("a"));
            let id=team_data[0]
            let celdas = filas[i].getElementsByTagName("td");
            let ultimaCelda = celdas[celdas.length - 1];
            let selects = document.getElementsByTagName('select');
            let index_select = 1;
            if (selects[index_select] === undefined) {
                index_select = 0;
            }


            let selectedIndex = selects[index_select].selectedIndex;
            let selectedOption = selects[index_select].options[selectedIndex];
            let selectedText = selectedOption.text;



            let key_actual_league = "Top";
            if (selectedText.includes(".")) {
                key_actual_league = selectedText.substring(0, 4)
            }

            let valor = 0;

            if (teams_data[id] === undefined) {
                valor = 0
            } else {

                let table_key = "";
                let agg_value = 0;
                let cat

                switch (event.target.id) {
                    case 'edad':
                        valor = new Intl.NumberFormat(window.userLocal, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(teams_data[id][event.target.id])
                        break;
                    case "leagues":
                        table_key = "league"
                        agg_value = teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                        valor = "(" + teams_data[id]['league_' + key_actual_league] + '/' + agg_value + ")"
                        break;

                    case "world_leagues":
                        table_key = "world_league"
                        agg_value = teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                        valor = "(" + teams_data[id][table_key + '_' + key_actual_league] + '/' + agg_value + ")"
                        break;

                    case "youth_leagues":
                        cat = GM_getValue("actual_league_cat").toLowerCase()
                        table_key = "league_" + cat
                        agg_value = teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                        valor = "(" + teams_data[id][table_key + '_' + key_actual_league] + '/' + agg_value + ")"
                        break;

                    case "world_youth_leagues":
                        cat = GM_getValue("actual_league_cat").toLowerCase()
                        table_key = "world_league_" + cat
                        agg_value = teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                        valor = "(" + teams_data[id][table_key + '_' + key_actual_league] + '/' + agg_value + ")"
                        break;

                    case "leagues_all":
                        table_key = "league"
                        valor = teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                        break;


                    case "world_leagues_all":
                        table_key = "world_league"
                        valor = teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                        break;

                    case "youth_leagues_all":
                        table_key = "league_u23"
                        valor += teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                        table_key = "league_u21"
                        valor += teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                        table_key = "league_u18"
                        valor += teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                        break;

                    case "world_youth_leagues_all":
                        table_key = "world_league_u23"
                        valor += teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                        table_key = "world_league_u21"
                        valor += teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                        table_key = "world_league_u18"
                        valor += teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                        break;

                    case "federation_leagues":
                        table_key = "federation_league"
                        agg_value = teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                        valor = agg_value
                        break;


                    default:
                        valor = new Intl.NumberFormat(window.userLocal).format(Math.round(teams_data[id][event.target.id]))
                        break;


                }
            }

            ultimaCelda.innerHTML = valor;

        }
        let checkboxes = document.querySelectorAll('.statsxente');
        let thead = tabla.querySelector('thead');
        let tr = thead.querySelectorAll('tr');
        let td = tr[0].querySelectorAll('th');
        td[td.length - 1].innerHTML = '<a href="#">'+event.target.value+'</a>'
        checkboxes.forEach(function (checkbox) {
            if (checkbox.id !== event.target.id) {
                checkbox.checked = false;
            }
        });
    }

//FETCH FUNCTIONS
    function fetchSelects() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://statsxente.com/MZ1/Functions/tamper_selects.php",
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function (response) {
                    let jsonResponse = JSON.parse(response.responseText);
                    GM_setValue("posSelect_soccer",jsonResponse['posSelect_soccer'])
                    GM_setValue("statsSelect_soccer",jsonResponse['statsSelect_soccer'])
                    GM_setValue("statsTeamsSelect_soccer",jsonResponse["statsTeamSelect_soccer"])
                    GM_setValue("posSelect_hockey",jsonResponse['posSelect_hockey'])
                    GM_setValue("statsSelect_hockey",jsonResponse['statsSelect_hockey'])
                    GM_setValue("statsTeamsSelect_hockey",jsonResponse["statsTeamSelect_hockey"])
                    GM_setValue("minValues",jsonResponse["minValues"])
                    resolve(jsonResponse)
                },
                onerror: function () {
                    reject("none");
                }
            });
        });
    }


    function fetchExistsFL(id) {
        return new Promise((resolve, reject) => {

            GM_xmlhttpRequest({
                method: "GET",
                url: "https://statsxente.com/MZ1/Functions/tamper_check_fl.php?fl_id="+id,
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function (response) {

                    let jsonResponse = JSON.parse(response.responseText);
                    resolve(jsonResponse)
                },
                onerror: function () {
                    reject("none");
                }
            });
        });
    }
    function fetchAgeRestriction(url) {
        return new Promise((resolve, reject) => {

            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function (response) {
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(response.responseText, "text/html");
                    let strongElements = doc.getElementsByTagName("b");
                    let nextSibling = strongElements[1].nextSibling;
                    try {
                        while (nextSibling && nextSibling.nodeName === "BR") {
                            nextSibling = nextSibling.nextSibling;
                        }

                        if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE) {
                            let age_restriction = nextSibling.textContent.trim();
                            resolve(age_restriction);
                        } else {
                            resolve("none");
                        }
                    } catch (error) {
                        reject("none");
                    }
                },
                onerror: function () {
                    reject("none");
                }
            });
        });
    }
    function fetchCupAgeRestriction(url) {
        return new Promise((resolve, reject) => {

            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function (response) {
                    let parser = new DOMParser();
                    try {
                        let doc = parser.parseFromString(response.responseText, "text/html")
                        let tables = doc.getElementsByTagName("table");

                        Array.from(tables).forEach((table) => {
                            if(table.querySelector("#set_default_tactic")){
                                let tds = table.getElementsByTagName("td");
                                resolve(tds[5].innerHTML)
                            }
                        });
                        let table = tables[1]
                        let tds = table.getElementsByTagName("td");
                        resolve(tds[5].innerHTML)
                    } catch (error) {
                        reject("Error fetching age restriction");
                    }
                },
                onerror: function () {
                    reject("none");
                }
            });
        });
    }
    function fetchExistTeam(url) {
        return new Promise((resolve, reject) => {

            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function (response) {
                    let jsonResponse = JSON.parse(response.responseText);
                    resolve(jsonResponse['inserted'])
                },
                onerror: function () {
                    reject("no");
                }
            });
        });
    }
    function fetchExistPlayers(url) {
        return new Promise((resolve, reject) => {

            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function (response) {
                    let jsonResponse = JSON.parse(response.responseText);
                    resolve(jsonResponse)
                },
                onerror: function () {
                    reject("no");
                }
            });
        });
    }
    function fetchAndProcessPlayerData(link,skill,toChange,device) {
        return new Promise((resolve, reject) => {

                GM_xmlhttpRequest({
                    method: 'GET',
                    url:link,
                    onload: function (response) {

                        let parser = new DOMParser();
                        let doc = parser.parseFromString(response.responseText, 'text/html');

                        let player_cointainer=doc.getElementById("thePlayers_0")

                        let elements = player_cointainer.querySelectorAll('.skillval');
                        elements.forEach(element => {

                            let previousTd = element.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling;
                            let maxs = element.getElementsByClassName("maxed")

                            let clips = previousTd.getElementsByClassName("clippable")
                            if((clips[0].innerText.trim()===skill.trim())&&(maxs.length>0)){

                                if(device!=="computer"){
                                    toChange.style.padding="3px"
                                }
                                toChange.style.backgroundColor="#db5d5d"
                                toChange.style.fontWeight="bold"
                                toChange.style.borderRadius="5px"


                            }


                        });
                        resolve("Done")
                    },
                    onerror: function (error) {
                        reject(error);
                    }
                });

            }
        );

    }

//UTILS FUNCTIONS
    function deleteCols(tabla,numColumnas) {
        let filas = tabla.rows;

        for (let i = 0; i < filas.length; i++) {
            // Recorremos las celdas desde la última hasta la columna X+1
            while (filas[i].cells.length > numColumnas) {
                filas[i].deleteCell(numColumnas); // Elimina la columna después de las primeras X
            }
        }
    }

    function waitToDOMArgs(function_to_execute, classToSearch, elementIndex,miliseconds,...args) {
        let interval = setInterval(function () {
            let elements = document.querySelectorAll(classToSearch);
            if (elements.length > 0 && elements[elementIndex]) {
                clearInterval(interval);
                clearTimeout(timeout);
                function_to_execute(...args);
            }
        }, 100);


        let timeout = setTimeout(function () {
            clearInterval(interval);
        }, miliseconds);
    }


    function waitToDOM(function_to_execute, classToSearch, elementIndex,miliseconds) {
        let interval = setInterval(function () {
            let elements = document.querySelectorAll(classToSearch);
            if (elements.length > 0 && elements[elementIndex]) {
                clearInterval(interval);
                clearTimeout(timeout);
                function_to_execute();
            }
        }, 100);


        let timeout = setTimeout(function () {
            clearInterval(interval);
        }, miliseconds);
    }

    function waitToDOMByIdArgs(function_to_execute, idToSearch,miliseconds,...args) {
        let interval = setInterval(function () {
            let element = document.getElementById(idToSearch);
            if (element) {
                clearInterval(interval);
                clearTimeout(timeout);
                function_to_execute(...args);
            }
        }, 100);


        let timeout = setTimeout(function () {
            clearInterval(interval);
        }, miliseconds);
    }



    function waitToDOMById(function_to_execute, idToSearch,miliseconds) {
        let interval = setInterval(function () {
            let element = document.getElementById(idToSearch);
            if (element) {
                clearInterval(interval);
                clearTimeout(timeout);
                function_to_execute();
            }
        }, 100);


        let timeout = setTimeout(function () {
            clearInterval(interval);
        }, miliseconds);
    }
    function openWindow(link, porAncho, porAlto) {
        let ventanaAncho = (window.innerWidth) * porAncho
        let ventanaAlto = (window.innerHeight) * porAlto
        let ventanaIzquierda = (window.innerWidth - ventanaAncho) / 2;
        let ventanaArriba = (window.innerHeight - ventanaAlto) / 2;
        let opcionesVentana = "width=" + ventanaAncho +
            ",height=" + ventanaAlto +
            ",left=" + ventanaIzquierda +
            ",top=" + ventanaArriba;

        if ((GM_getValue("tabsConfig") === false) && (GM_getValue("windowsConfig") === true)) {
            window.open(link, "_blank", opcionesVentana);
        }
        if ((GM_getValue("tabsConfig") === true) && (GM_getValue("windowsConfig") === false)) {
            window.open(link, "_blank");
        }
    }
    function ordenarTabla(col, byClassName, param,putSortIconFlag) {
        let table
        if (byClassName) {
            let elems = document.getElementsByClassName(param);
            table = elems[0]
        } else {
            table = document.getElementById(param)
        }
        if(putSortIconFlag){putSortIcon(col, table)}
        let rows = Array.from(table.tBodies[0].rows);
        let isAsc = document.getElementById("ord_table").value === "ascendente";

        let parseNumberToOrder = (str) => {
            let s = str.trim().replace(/\s+/g, '');
            s = s.replace(/,/g, '');
            let num = parseFloat(s);
            return isNaN(num) ? 0 : num;
        };

        let lang = window.userLocal.slice(0,2);
        rows.sort(function (a, b) {
            var aNum,bNum;

            if((lang==="fr")||(lang==="ru")){
                aNum = parseNumberToOrder(a.cells[col].textContent);
                bNum = parseNumberToOrder(b.cells[col].textContent);

            }else{

                aNum = parseFloat(a.cells[col].textContent.trim().replace(/\./g, '').replace(/\,/g, '')) || 0;
                bNum = parseFloat(b.cells[col].textContent.trim().replace(/\./g, '').replace(/\,/g, '')) || 0;

            }
            return isAsc ? aNum - bNum : bNum - aNum;
        });

        rows.forEach(function (row) {
            table.tBodies[0].appendChild(row);
        });

        if (isAsc) {
            document.getElementById("ord_table").value = "descendente";
        } else {
            document.getElementById("ord_table").value = "ascendente";
        }

        let filas = table.getElementsByTagName("tr");
        for (let i = 1; i < filas.length; i++) {
            let primeraCelda = filas[i].getElementsByTagName("td")[0];
            primeraCelda.textContent = i;
        }


    }


    async function getSelects(){
        const actual_date=getActualDate()
        if(actual_date!==GM_getValue("date_checked_selects")){
            GM_setValue("date_checked_selects", actual_date)
            await fetchSelects()
        }
    }



    function ordenarTablaText(col, byClassName, param,putSortIconFlag) {
        let table = document.getElementById(param)
        let rows = Array.from(table.tBodies[0].rows);
        let isAsc = document.getElementById("ord_table").value === "ascendente";
        if(putSortIconFlag){putSortIcon(col, table)}
        rows.sort(function (a, b) {
            let aText = a.cells[col].textContent.toLowerCase().trim();
            let bText = b.cells[col].textContent.toLowerCase().trim();
            if (aText < bText) {
                return isAsc ? -1 : 1;
            }
            if (aText > bText) {
                return isAsc ? 1 : -1;
            }
            return 0;
        });

        rows.forEach(function (row) {
            table.tBodies[0].appendChild(row);
        });

        if (isAsc) {
            document.getElementById("ord_table").value = "descendente";
        } else {
            document.getElementById("ord_table").value = "ascendente";
        }


        let filas = table.getElementsByTagName("tr");
        for (let i = 1; i < filas.length; i++) {
            let primeraCelda = filas[i].getElementsByTagName("td")[0];
            primeraCelda.textContent = i;
        }

    }
    function checkClassNameExists(element, className) {
        if (className === "") {
            return true;
        } else {
            return element.classList.contains(className);
        }
    }
    function getCookie(nombre) {
        let regex = new RegExp("(?:(?:^|.*;\\s*)" + nombre + "\\s*\\=\\s*([^;]*).*$)|^.*$");
        let valorCookie = document.cookie.replace(regex, "$1");
        return decodeURIComponent(valorCookie);
    }
    function generateValuesSelect(cat) {


        let defaults = new Map();
        defaults.set('senior', 'valor');
        defaults.set('u23', 'valor23');
        defaults.set('u21', 'valor21');
        defaults.set('u18', 'valor18');

        let values = new Map();
        values.set('valor', 'Value');
        values.set('valor23', 'U23 Value');
        values.set('valor21', 'U21 Value');
        values.set('valor18', 'U18 Value');
        values.set('salario', 'Salary');
        values.set('valorUPSenior', 'LM Value');
        values.set('valorUPSUB23', 'U23 LM Value');
        values.set('valorUPSUB21', 'U21 LM Value');
        values.set('valorUPSUB18', 'U18 LM Value');
        values.set('edad', 'Age');
        values.set('valor11', 'TOP 11/21');
        values.set('valor11_23', 'U23 TOP 11/21');
        values.set('valor11_21', 'U21 TOP 11/21');
        values.set('valor11_18', 'U18 TOP 11/21');
        values.set('noNac', 'Foreigners');
        values.set('elo', 'ELO Score');
        values.set('elo23', 'U23 ELO Score');
        values.set('elo21', 'U21 ELO Score');
        values.set('elo18', 'U18 ELO Score');
        values.set('numJugadores', 'Number of players');


        let default_value = GM_getValue("league_default_" + cat, defaults.get(cat))
        GM_setValue("league_default_" + cat, default_value)

        let select = "<select id='league_default_select_" + cat + "' style='width:9em;'>";
        values.forEach((valor, clave) => {
            let checked = ""
            if (clave === default_value) {
                checked = "selected"
            }
            select += "<option " + checked + " value='" + clave + "'>" + valor + "</option>";
        });
        select += "</select>"
        return select;

    }
    function createLeagueConfigOptionsListeners() {

        let defaults = new Map();
        defaults.set('senior', 'valor');
        defaults.set('u23', 'valor23');
        defaults.set('u21', 'valor21');
        defaults.set('u18', 'valor18');

        defaults.forEach((valor, clave) => {
            document.getElementById("league_default_select_" + clave).addEventListener('change', function () {

                let selectElement = document.getElementById("league_default_select_" + clave);
                GM_setValue("league_default_" + clave, selectElement.value)
            });

        });
        document.getElementById("league_graph_check").addEventListener('click', function () {
            if (document.getElementById("league_graph_check").checked) {
                GM_setValue("league_graph_button", "checked")
            } else {
                GM_setValue("league_graph_button", "")
            }
        });
        document.getElementById("league_report_check").addEventListener('click', function () {
            if (document.getElementById("league_report_check").checked) {
                GM_setValue("league_report_button", "checked")
            } else {
                GM_setValue("league_report_button", "")
            }
        });

        document.getElementById("league_calendar_check").addEventListener('click', function () {
            if (document.getElementById("league_calendar_check").checked) {
                GM_setValue("league_calendar_button", "checked")
            } else {
                GM_setValue("league_calendar_button", "")
            }

        });

    }
    function createModalMenu() {
        let newElement = document.createElement("div");
        newElement.id = "legendDiv";
        newElement.className = "stx_legend";
        let txtToInsert= '<div style="writing-mode: tb-rl;-webkit-writing-mode: vertical-rl; margin: 0 auto; text-align:center;">'
        if(GM_getValue("available_new_version")==="yes"){
            txtToInsert+='<img alt="" src="https://statsxente.com/MZ1/View/Images/alert.png" style="width:15px;height:15px;"/>'
        }
        txtToInsert+='<img alt="" src="https://statsxente.com/MZ1/View/Images/main_icon.png" style="width:25px;height:25px;"/>'
        txtToInsert+='</div>';
        newElement.innerHTML=txtToInsert;
        let body = document.body;
        body.appendChild(newElement);

        let newModalElement = document.createElement('div');
        newModalElement.innerHTML = '<div id="snackbar_stx" style="margin: 0 auto; text-align:center;"></div><div id="myModal_cargando-stx" class="modal_cargando-stx"><div class="modal-content_cargando-stx"  id="modal_content_div_cargando-stx"><div id="contenido_modal_cargando-stx" style="overflow-x:auto; background-color:#f2f2f200;"></div></div></div>'
        body.insertBefore(newModalElement, body.firstChild);

        if (GM_getValue("leagueFlag") === undefined) {
            GM_setValue("leagueFlag", true)
        }

        if (GM_getValue("matchFlag") === undefined) {
            GM_setValue("matchFlag", true)
        }

        if (GM_getValue("federationFlag") === undefined) {
            GM_setValue("federationFlag", true)
        }

        if (GM_getValue("playersFlag") === undefined) {
            GM_setValue("playersFlag", true)
        }

        if (GM_getValue("countryRankFlag") === undefined) {
            GM_setValue("countryRankFlag", true)
        }


        if (GM_getValue("league_graph_button") === undefined) {
            GM_setValue("league_graph_button", "checked")
        }

        if (GM_getValue("league_report_button") === undefined) {
            GM_setValue("league_report_button", "checked")
        }

        if (GM_getValue("league_calendar_button") === undefined) {
            GM_setValue("league_calendar_button", "checked")
        }

        if (GM_getValue("windowsConfig") === undefined) {
            GM_setValue("windowsConfig", true)
        }

        if (GM_getValue("tabsConfig") === undefined) {
            GM_setValue("tabsConfig", false)
        }

        if (GM_getValue("show_league_selects") === undefined) {
            GM_setValue("show_league_selects", true)
        }

        if (GM_getValue("show_tactic_filter") === undefined) {
            GM_setValue("show_tactic_filter", true)
        }


        if (GM_getValue("league_image_size") === undefined) {
            GM_setValue("league_image_size", 20)
        }

        if (GM_getValue("eloNextMatchesFlag") === undefined) {
            GM_setValue("eloNextMatchesFlag", true)
        }

        if (GM_getValue("eloPlayedMatchesFlag") === undefined) {
            GM_setValue("eloPlayedMatchesFlag", true)
        }

        if (GM_getValue("teamPageFlag") === undefined) {
            GM_setValue("teamPageFlag", true)
        }

        if (GM_getValue("trainingReportFlag") === undefined) {
            GM_setValue("trainingReportFlag", true)
        }
        if (GM_getValue("eloHiddenPlayedMatchesFlag") === undefined) {
            GM_setValue("eloHiddenPlayedMatchesFlag", true)
        }

        if (GM_getValue("flFlag") === undefined) {
            GM_setValue("flFlag", true)
        }

        if (GM_getValue("cupFlag") === undefined) {
            GM_setValue("cupFlag", true)
        }

        if (GM_getValue("nationalTeamFlag") === undefined) {
            GM_setValue("nationalTeamFlag", true)
        }

        if (GM_getValue("tacticsResultsFlag") === undefined) {
            GM_setValue("tacticsResultsFlag", true)
        }








        let leagueFlag = "", matchFlag = "", federationFlag = "", playersFlag = "", countryRankFlag = "",eloNextMatchesFlag="",
            eloPlayedMatchesFlag="",teamFlag="",trainingReportFlag="",eloHiddenPlayedMatchesFlag="",flFlag="",cupFlag="",nationalTeamFlag="",tacticsResultsFlag=""

        if (GM_getValue("federationFlag")) federationFlag = "checked"
        if (GM_getValue("matchFlag")) matchFlag = "checked"
        if (GM_getValue("leagueFlag")) leagueFlag = "checked"
        if (GM_getValue("playersFlag")) playersFlag = "checked"
        if (GM_getValue("countryRankFlag")) countryRankFlag = "checked"
        if (GM_getValue("eloNextMatchesFlag")) eloNextMatchesFlag = "checked"
        if (GM_getValue("eloPlayedMatchesFlag")) eloPlayedMatchesFlag = "checked"
        if (GM_getValue("teamPageFlag")) teamFlag = "checked"
        if (GM_getValue("trainingReportFlag")) trainingReportFlag = "checked"
        if (GM_getValue("eloHiddenPlayedMatchesFlag")) eloHiddenPlayedMatchesFlag = "checked"
        if (GM_getValue("flFlag")) flFlag = "checked"
        if (GM_getValue("cupFlag")) cupFlag = "checked"
        if (GM_getValue("nationalTeamFlag")) nationalTeamFlag = "checked"
        if (GM_getValue("tacticsResultsFlag")) tacticsResultsFlag = "checked"









        let newContent = '<div style="margin: 0 auto; text-align:center;"><img alt="" id="closeButton" src="https://statsxente.com/MZ1/View/Images/error.png" style="width:40px; height:40px; cursor:pointer;"/></div></br></br>'
        newContent += '<div style="margin: 0 auto; text-align:center;" id=alert_tittle class="caja_mensaje_50">Config</div><div id="div1" class="modal_div_content_main"  style="display: flex; flex-direction: column; overflow: auto; max-width: 100%;">'
        newContent +='</br><table style="width:75%; margin: 0 auto; text-align:left;"><tbody><tr>';
        newContent += '<td><label class="containerPeqAmarillo">League<input type="checkbox" id="leagueSelect" ' + leagueFlag + '><span class="checkmarkPeqAmarillo"></span></td>'
        newContent += '<td><label class="containerPeqAmarillo">Federation<input type="checkbox" id="federationSelect" ' + federationFlag + '><span class="checkmarkPeqAmarillo"></span></td>'
        newContent += '<td><label class="containerPeqAmarillo">Match<input type="checkbox" id="matchSelect" ' + matchFlag + '><span class="checkmarkPeqAmarillo"></span></td>'
        newContent += '<td><label class="containerPeqAmarillo">ELO Changes<input type="checkbox" id="eloPlayedSelect" ' + eloPlayedMatchesFlag + '><span class="checkmarkPeqAmarillo"></span></td>'
        newContent += '<td><label class="containerPeqAmarillo">Training Report<input type="checkbox" id="trainingReportSelect" ' + trainingReportFlag + '><span class="checkmarkPeqAmarillo"></span></td>'
        newContent += '</tr><tr>'
        newContent += '<td><label class="containerPeqAmarillo">Players<input type="checkbox" id="playersSelect" ' + playersFlag + '><span class="checkmarkPeqAmarillo"></span></td>'
        newContent += '<td><label class="containerPeqAmarillo">Country Rank<input type="checkbox" id="countryRankSelect" ' + countryRankFlag + '><span class="checkmarkPeqAmarillo"></span></td>'
        newContent += '<td><label class="containerPeqAmarillo">Team<input type="checkbox" id="teamSelect" ' + teamFlag + '><span class="checkmarkPeqAmarillo"></span></td>'
        newContent += '<td><label class="containerPeqAmarillo">ELO Teams Scores<input type="checkbox" id="eloScheduledSelect" ' + eloNextMatchesFlag + '><span class="checkmarkPeqAmarillo"></span></td>'
        newContent += '<td><label class="containerPeqAmarillo">Cups<input type="checkbox" id="cupFlagSelect" ' + cupFlag + '><span class="checkmarkPeqAmarillo"></span></td>'
        newContent += '</tr><tr>'
        newContent += '<td><label class="containerPeqAmarillo">ELO Hidden Played Matches<input type="checkbox" id="eloHiddenPlayedMatchesSelect" ' + eloHiddenPlayedMatchesFlag + '><span class="checkmarkPeqAmarillo"></span></td>'

        newContent += '<td><label class="containerPeqAmarillo">Friendly Leagues<input type="checkbox" id="flFlagSelect" ' + flFlag + '><span class="checkmarkPeqAmarillo"></span></td>'

        newContent += '<td><label class="containerPeqAmarillo">National Team<input type="checkbox" id="nationalTeamFlagSelect" ' + nationalTeamFlag + '><span class="checkmarkPeqAmarillo"></span></td>'

        newContent += '<td><label class="containerPeqAmarillo">Tactics Results<input type="checkbox" id="tacticsResultsFlagSelect" ' + tacticsResultsFlag + '><span class="checkmarkPeqAmarillo"></span></td>'


        newContent += "</tr></tbody></table>"

        newContent += "<hr>"
        newContent += "<h3 style='text-align: left; padding-left:7px;'>Leagues Config</h3>"

        newContent += "<table style='margin: 0 auto; text-align:center;'><tr>"
        newContent += "<td>Default Senior Param: <td>" + generateValuesSelect('senior') + "</td>";
        newContent += "<td>Default U23 Param: <td>" + generateValuesSelect('u23') + "</td>";
        newContent += "<td>Default U21 Param: <td>" + generateValuesSelect('u21') + "</td>";
        newContent += "<td>Default U18 Param: <td>" + generateValuesSelect('u18') + "</td>";

        newContent += "</tr><tr>"


        let checked_graph = GM_getValue("league_graph_button")
        let checked_report = GM_getValue("league_report_button")
        let checked_calendar = GM_getValue("league_calendar_button")

        newContent += "<td style='margin: 0 auto; text-align:center;' colspan='8'><table style='margin: 0 auto; text-align:center;'><tr><td><label><input " + checked_graph + " type='checkbox' value='graph' class='textMiddle' id='league_graph_check'><img alt='' class='textMiddle' src='https://statsxente.com/MZ1/View/Images/graph.png' width='20px' height='20px'/> <span class='textMiddle'>Progress</span></label></td>"
        newContent += "<td style='margin: 0 auto; text-align:center;'><label><input " + checked_report + " type='checkbox' value='graph' id='league_report_check' class='textMiddle'><img alt='' class='textMiddle' src='https://statsxente.com/MZ1/View/Images/report.png' width='20px' height='20px'/> <span class='textMiddle'>Graph</span></label></td>"

        newContent += "<td style='margin: 0 auto; text-align:center;'><label><input " + checked_calendar + " type='checkbox' value='graph' id='league_calendar_check' class='textMiddle'><img alt='' class='textMiddle' src='https://statsxente.com/MZ1/View/Images/calendar.png' width='20px' height='20px'/> <span class='textMiddle'>ELO Matches</span></label></td></tr></table></td>"

        newContent += '</tr><tr>';

        newContent += '<td colspan="4"><label><span class="textMiddle">Icons Size</span> <input class="textMiddle" id="slider_input" class="range-slider_input" type="range" value="' + GM_getValue("league_image_size") + '" min="10" max="30">'
        newContent += '<img alt="" class="textMiddle" id="testImage" src="https://statsxente.com/MZ1/View/Images/calendar.png" width="20px" height="20px"/>'
        newContent += '<span class="textMiddle" style="padding-left:10px;" id="sizeImageLeagueSpan"> (' + GM_getValue("league_image_size") + ')</span></label></center></td>'



        let checkedLeagueSelects = ""
        if (GM_getValue("show_league_selects")) {
            checkedLeagueSelects = "checked"
        }

        newContent += '<td style=\'margin: 0 auto; text-align:center;\' colspan="4"><label class="textMiddle"><input ' + checkedLeagueSelects + ' type="checkbox" class="textMiddle" value="graph" id="show_league_checkbox">Show selects</label></center></td>'
        newContent += "</tr></table>"
        newContent += "<hr>"
        newContent += "<h3 style='text-align: left; padding-left:7px;'>Played Matches Config</h3>"
        newContent += "<table style='display:flex;'><tr><td>"

        let filterTacticCheck = ""
        if (GM_getValue("show_tactic_filter")) {
            filterTacticCheck = "checked"
        }



        newContent += "<label><input type='checkbox' id='show_tactic_checkbox' " + filterTacticCheck + ">Show Tactic Filter</label>";
        newContent += "</td></tr></table>"



        newContent += "<hr>"
        newContent += "<h3 style='text-align: left; padding-left:7px;'>Tabs Config</h3>"
        newContent += "<table style='display:flex;'><tr><td>"

        let checkedTab = ""
        if (GM_getValue("tabsConfig")) {
            checkedTab = "checked"
        }

        let checkedWin = ""
        if (GM_getValue("windowsConfig")) {
            checkedWin = "checked"
        }


        newContent += "<label><input type='checkbox' id='windowsConfig' " + checkedWin + ">Windows</label>";
        newContent += "<label><input type='checkbox' id='tabsConfig' " + checkedTab + ">Tabs</label>";
        newContent += "</td></tr></table>"



        newContent += '<div style="padding-bottom:10px; margin: 0 auto; text-align:center;">'
        if(GM_getValue("available_new_version")==="yes"){
            newContent += '<h2>New vesion available: '+GM_getValue("stx_latest_version")+'</h2>'
        }

        if(GM_getValue("available_new_version")==="yes"){
            newContent += '<button class="btn-update" id="updateButton"><i class="bi bi-arrow-down-circle-fill" style="font-style:normal;"> Update</i></button>'
        }
        newContent+="<div style='text-align: center;'><h4>Changes History:</h4>";
        newContent += '<a href="https://www.managerzone.com/?p=forum&sub=topic&topic_id=13032964&forum_id=10&sport=soccer" target="_blank"><button class="btn-update"><i class="bi bi-eye-fill" style="font-style:normal;"> Details</i></button></a></div>'
        newContent +="</br>";
        newContent +='<button class="btn-save" id="saveButton"><i class="bi bi-house-door-fill" style="font-style:normal;">Save</i></button>'
        newContent+='<button id="reloadSelects" class="btn-delete" style="margin-left:10px; width:10em; background-color:#ff9800;"><i class="bi bi-arrow-clockwise" style="font-style:normal;">Reload Selects</i></button>'

        newContent+='<button id="deleteButton" class="btn-delete" style="margin-left:10px;"><i class="bi bi-trash-fill" style="font-style:normal;">Reset</i></button>'
        newContent+='</div>';
        newContent += '</div></center></br></br>';
        document.getElementById("contenido_modal_cargando-stx").innerHTML = newContent
        createLeagueConfigOptionsListeners();
        document.getElementById("contenido_modal_cargando-stx").style.width = "75%";
        document.getElementById("myModal_cargando-stx").style.display = "none"
        getNativeTableStyles()

        document.getElementById("alert_tittle").style.backgroundColor = GM_getValue("bg_native")

        if(GM_getValue("available_new_version")==="yes"){

            document.getElementById("updateButton").addEventListener('click', function () {
                GM_setValue("date_checked_version","-")
                window.open("https://update.greasyfork.org/scripts/491442/Stats%20Xente%20Script.user.js", "_blank");
            });
        }





        document.getElementById("legendDiv").addEventListener('click', function () {

            if (document.getElementById("myModal_cargando-stx").style.display === "none") {
                document.getElementById("myModal_cargando-stx").style.display = "flex";
            } else {
                document.getElementById("myModal_cargando-stx").style.display = "none";
            }

        });


        document.getElementById("closeButton").addEventListener('click', function () {
            document.getElementById("myModal_cargando-stx").style.display = "none";
        });


        document.getElementById("saveButton").addEventListener('click', function () {
            window.location.reload();
        });




        (function () {
            document.getElementById("deleteButton").addEventListener('click', function () {
                let keys = GM_listValues();
                keys.forEach(function (key) {
                    GM_deleteValue(key);
                });
                window.location.reload();
            });
        })();

        (function () {
            document.getElementById("reloadSelects").addEventListener('click', function () {
                GM_setValue("date_checked_selects","0")
                getSelects()
                window.location.reload();
            });
        })();





        // }, 3000);

    }
    function getNativeTableStyles() {
        let elemento = document.querySelector('.subheader.clearfix');
        if (elemento) {
            let estilo = getComputedStyle(elemento);
            let bg = estilo.backgroundColor
            let color = "white"
            if (estilo.backgroundColor === "rgba(0, 0, 0, 0)") {
                bg = "#a9b0b4"
            }
            GM_setValue("bg_native", bg)
            GM_setValue("color_native", color)
        }


    }


    function evaluarExpresion(expresion, datos) {
        // Reemplazamos las claves en la expresión con sus valores reales
        Object.keys(datos).forEach(clave => {
            expresion = expresion.replace(new RegExp(`\\b${clave}\\b`, 'g'), datos[clave]);
        });

        // Evaluamos la expresión de manera segura usando Function
        return new Function(`return ${expresion};`)();
    }




    function getDeviceFormat(){
        if(!document.getElementById("deviceFormatStx")){
            var script = document.createElement('script');
            script.textContent = `
        var newElemenDeviceSTX = document.createElement("input");
        newElemenDeviceSTX.id= "deviceFormatStx";
        newElemenDeviceSTX.type = "hidden";
        newElemenDeviceSTX.value=window.device;
        document.body.appendChild(newElemenDeviceSTX);

`;
            document.documentElement.appendChild(script);
            script.remove();

            window.stx_device=document.getElementById("deviceFormatStx").value
        }
    }
    function extractTeamData(as){
        let main_a=""
        Array.from(as).forEach(a => {
            if (a.href.includes('tid')) {
                main_a=a
            }
        })
        let href = main_a.getAttribute('href');
        let urlParams = new URLSearchParams(href.split('?')[1]);
        return [urlParams.get('tid'),main_a.textContent]

    }
    function createModalEventListeners() {
        document.getElementById('leagueSelect').addEventListener('click', function () {
            GM_setValue("leagueFlag", !GM_getValue("leagueFlag"))
        });


        document.getElementById('federationSelect').addEventListener('click', function () {
            GM_setValue("federationFlag", !GM_getValue("federationFlag"))
        });

        document.getElementById('matchSelect').addEventListener('click', function () {
            GM_setValue("matchFlag", !GM_getValue("matchFlag"))
        });

        document.getElementById('playersSelect').addEventListener('click', function () {
            GM_setValue("playersFlag", !GM_getValue("playersFlag"))
        });

        document.getElementById('countryRankSelect').addEventListener('click', function () {
            GM_setValue("countryRankFlag", !GM_getValue("countryRankFlag"))
        });

        document.getElementById('eloPlayedSelect').addEventListener('click', function () {

            GM_setValue("eloPlayedMatchesFlag", !GM_getValue("eloPlayedMatchesFlag"))
        });

        document.getElementById('eloScheduledSelect').addEventListener('click', function () {
            GM_setValue("eloNextMatchesFlag", !GM_getValue("eloNextMatchesFlag"))
        });

        document.getElementById('eloHiddenPlayedMatchesSelect').addEventListener('click', function () {
            GM_setValue("eloHiddenPlayedMatchesFlag", !GM_getValue("eloHiddenPlayedMatchesFlag"))
        });


        document.getElementById('teamSelect').addEventListener('click', function () {
            GM_setValue("teamPageFlag", !GM_getValue("teamPageFlag"))
        });

        document.getElementById('trainingReportSelect').addEventListener('click', function () {
            GM_setValue("trainingReportFlag", !GM_getValue("trainingReportFlag"))
        });

        document.getElementById('flFlagSelect').addEventListener('click', function () {
            GM_setValue("flFlag", !GM_getValue("flFlag"))
        });

        document.getElementById('cupFlagSelect').addEventListener('click', function () {
            GM_setValue("cupFlag", !GM_getValue("cupFlag"))
        });

        document.getElementById('nationalTeamFlagSelect').addEventListener('click', function () {
            GM_setValue("nationalTeamFlag", !GM_getValue("nationalTeamFlag"))
        });

        document.getElementById('tacticsResultsFlagSelect').addEventListener('click', function () {
            GM_setValue("tacticsResultsFlag", !GM_getValue("tacticsResultsFlag"))
        });





        document.getElementById('show_league_checkbox').addEventListener('click', function () {
            GM_setValue("show_league_selects", !GM_getValue("show_league_selects"))
        });

        document.getElementById('show_tactic_checkbox').addEventListener('click', function () {
            GM_setValue("show_tactic_filter", !GM_getValue("show_tactic_filter"))
        });






        document.getElementById('windowsConfig').addEventListener('click', function () {

            document.getElementById('tabsConfig').checked = !document.getElementById('windowsConfig').checked;

            GM_setValue("windowsConfig", !GM_getValue("windowsConfig"))
            GM_setValue("tabsConfig", !GM_getValue("tabsConfig"))


        });


        document.getElementById('tabsConfig').addEventListener('click', function () {
            document.getElementById('windowsConfig').checked = !document.getElementById('tabsConfig').checked;
            GM_setValue("windowsConfig", !GM_getValue("windowsConfig"))
            GM_setValue("tabsConfig", !GM_getValue("tabsConfig"))


        });





        (function () {
            document.getElementById("slider_input").addEventListener('input', function () {
                document.getElementById("testImage").style.width = document.getElementById("slider_input").value + "px";
                document.getElementById("testImage").style.height = document.getElementById("slider_input").value + "px";

                document.getElementById("sizeImageLeagueSpan").innerText = "(" + document.getElementById("slider_input").value + ")"


                GM_setValue("league_image_size", document.getElementById("slider_input").value)


            });
        })();

    }
    function setLangSportCats() {


        langs.set('es', 'SPANISH');
        langs.set('ar', 'SPANISH')
        langs.set('en', 'ENGLISH');
        langs.set('br', 'PORTUGUES');
        langs.set('pt', 'PORTUGUES');
        langs.set('pl', 'POLISH');
        langs.set('ro', 'ROMANIAN');
        langs.set('tr', 'TURKISH');

        let lanCookie = getCookie("MZLANG");
        if (langs.has(lanCookie)) {
            window.lang = langs.get(lanCookie);
        } else {
            window.lang = "ENGLISH";
        }
        let sportCookie=getSportByMessenger()
        if(sportCookie===""){
            sportCookie = getCookie("MZSPORT");
        }
        if(sportCookie===""){
            sportCookie=getSportByLink()
        }
        if(sportCookie===""){
            sportCookie=getSportByScript()
        }

        let lsport = "F"
        let sport_id = 1;
        if (sportCookie === "hockey") {
            lsport = "H";
            sport_id = 2;
        }

        cats["senior"] = "senior";
        cats["world"] = "seniorw";
        cats["u23"] = "SUB23";
        cats["u21"] = "SUB21";
        cats["u18"] = "SUB18";
        cats["u23_world"] = "SUB23w";
        cats["u21_world"] = "SUB21w";
        cats["u18_world"] = "SUB18w";


        cats_stats["senior"] = "senior";
        cats_stats["world"] = "senior";
        cats_stats["u23"] = "SUB23";
        cats_stats["u21"] = "SUB21";
        cats_stats["u18"] = "SUB18";
        cats_stats["u23_world"] = "SUB23";
        cats_stats["u21_world"] = "SUB21";
        cats_stats["u18_world"] = "SUB18";
        cats_stats["friendlyseries"] = "senior";


        statsKeys["senior_soccer"] = 1
        statsKeys["world_soccer"] = 5
        statsKeys["u23_soccer"] = 3
        statsKeys["u21_soccer"] = 3
        statsKeys["u18_soccer"] = 3
        statsKeys["u23_world_soccer"] = 7
        statsKeys["u21_world_soccer"] = 7
        statsKeys["u18_world_soccer"] = 7
        statsKeys["friendlyseries_soccer"] = 9;
        statsKeys["senior_hockey"] = 2
        statsKeys["world_hockey"] = 6
        statsKeys["u23_hockey"] = 4
        statsKeys["u21_hockey"] = 4
        statsKeys["u18_hockey"] = 4
        statsKeys["u23_world_hockey"] = 8
        statsKeys["u21_world_hockey"] = 8
        statsKeys["u18_world_hockey"] = 8
        statsKeys["friendlyseries_hockey"] = 10;


        window.cats = cats;
        window.sport = sportCookie;
        window.lsport = lsport;
        window.sport_id = sport_id;
        window.userLocal = navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;

    }
    function getSportByLink(){
        let element = document.getElementById("settings-wrapper");
        if (element) {
            let firstLink = element.getElementsByTagName("a")[0];
            if (firstLink) {
                if(firstLink.href.includes("soccer")){
                    return "hockey"
                }else{
                    return "soccer"
                }
            }
        }
    }
    function getSportByScript(){
        const script = document.createElement('script');
        script.textContent = `
    let newElement = document.createElement("input");
        newElement.id= "stx_sport";
        newElement.type = "hidden";
        newElement.value=window.ajaxSport;
        let body = document.body;
        body.appendChild(newElement);

`;
        document.documentElement.appendChild(script);
        script.remove();
        return document.getElementById("stx_sport").value
    }
    function getSportByMessenger() {
        if (document.getElementById("messenger")) {

            if ((document.getElementById("messenger").className === "soccer") || (document.getElementById("messenger").className === "hockey")) {
                return document.getElementById("messenger").className
            }
        }
        return ""
    }
    function getUsernameData() {
        if ((GM_getValue("currency") === undefined) || (GM_getValue("currency") === "")
            ||(GM_getValue("soccer_team_id") === undefined) || (GM_getValue("soccer_team_id") === "")
            ||(GM_getValue("hockey_team_id") === undefined) || (GM_getValue("hockey_team_id") === "")) {
            let username = document.getElementById("header-username").innerText
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://www.managerzone.com/xml/manager_data.php?sport_id=" + window.sport_id + "&username=" + username,
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function (response) {

                    let parser = new DOMParser();
                    let xmlDoc = parser.parseFromString(response.responseText, "text/xml");
                    let userTeamsData = xmlDoc.getElementsByTagName("Team");
                    let index = 1;

                    if (userTeamsData[0].getAttribute("sport")==="soccer"){
                        GM_setValue("soccer_team_id", userTeamsData[0].getAttribute("teamId"))
                    }
                    if (userTeamsData[0].getAttribute("sport")==="hockey"){
                        GM_setValue("hockey_team_id", userTeamsData[0].getAttribute("teamId"))
                    }


                    if (userTeamsData[1].getAttribute("sport")==="soccer"){
                        GM_setValue("soccer_team_id", userTeamsData[1].getAttribute("teamId"))
                    }
                    if (userTeamsData[1].getAttribute("sport")==="hockey"){
                        GM_setValue("hockey_team_id", userTeamsData[1].getAttribute("teamId"))
                    }



                    if (userTeamsData[0].getAttribute("sport") === window.sport) {
                        index = 0;
                    }
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "https://www.managerzone.com/xml/team_playerlist.php?sport_id=" + window.sport_id + "&team_id=" + userTeamsData[index].getAttribute("teamId"),
                        headers: {
                            "Content-Type": "application/json"
                        },
                        onload: function (response) {
                            let parser = new DOMParser();
                            let xmlDoc = parser.parseFromString(response.responseText, "text/xml");
                            let team_data = xmlDoc.getElementsByTagName("TeamPlayers");
                            GM_setValue("currency", team_data[0].getAttribute("teamCurrency"))
                        }
                    });
                }
            });

        }


    }
    function getActualDate(){
        const fechaActual = new Date();
        const year = fechaActual.getFullYear();
        const month = String(fechaActual.getMonth() + 1).padStart(2, '0');
        const day = String(fechaActual.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    function compareVersions(installedVersion, latestVersion) {
        const installedParts = installedVersion.split('.').map(Number);
        const latestParts = latestVersion.split('.').map(Number);
        for (let i = 0; i < Math.max(installedParts.length, latestParts.length); i++) {
            const installed = installedParts[i] || 0;
            const latest = latestParts[i] || 0;
            if (installed < latest) {
                GM_setValue("available_new_version","yes")
                notifySnackBarNewVersion()
            }else{
                GM_setValue("available_new_version","no")
            }
        }

    }
    function getParsedValidDateText(text){
        let initialDate="undefined"
        let fecha=text
        if(fecha.includes("-")){

            let [day, month, year] = fecha.split("-");
            initialDate = `${year}-${month}-${day}`;
        }
        if(fecha.includes("/")){
            let [day, month, year] = fecha.split("/");
            initialDate = `${year}-${month}-${day}`;

        }

        return initialDate



    }

    function notifySnackBarError(id){

        let x = document.getElementById("snackbar_stx");
        let txt = "<img alt='' src='https://statsxente.com/MZ1/View/Images/main_icon.png' width='25px' height='25px'> <span style='color:#f44336; font-size: 17px;'>[Stats Xente Script] </span>"
        txt+="Error getting data: "+id
        x.innerHTML = txt;
        x.className = "showSnackBar_stx";
        setTimeout(function () { x.className = x.className.replace("showSnackBar_stx", ""); }, 4000);
        let clase="loader-"+window.sport
        let elementos = document.querySelectorAll('.'+clase);
        elementos.forEach(elemento => elemento.remove());


    }


    function notifySnackBarNewVersion(){
        if(GM_getValue("stx_notified_version")!==GM_getValue("stx_latest_version")){
            GM_setValue("stx_notified_version",GM_getValue("stx_latest_version"))
            let x = document.getElementById("snackbar_stx");
            let txt = "<img alt='' src='https://statsxente.com/MZ1/View/Images/main_icon.png' width='25px' height='25px'> <span style='color:#2da8ef; font-size: 17px;'>Stats Xente Script: </span>New version available</br></br>"
            txt+="<button type='button' id='button-snackbar-update'><i class='bi bi-arrow-down-circle-fill' style='font-style:normal;'>&nbsp;UPDATE&nbsp;</i></button>"
            txt+="&nbsp;<a href='https://www.managerzone.com/?p=forum&sub=topic&topic_id=13032964&forum_id=10&sport=soccer' target='_blank'><button type='button' id='button-snackbar-update'><i class='bi bi-eye-fill' style='font-style:normal;'>&nbsp;DETAILS&nbsp;</i></button></a>"
            x.innerHTML = txt;
            x.className = "showSnackBar_stx";
            document.getElementById("button-snackbar-update").addEventListener('click', function () {
                GM_setValue("date_checked_version","-")
                window.open("https://update.greasyfork.org/scripts/491442/Stats%20Xente%20Script.user.js", "_blank");
            });
            setTimeout(function () { x.className = x.className.replace("showSnackBar_stx", ""); }, 8000);
        }
    }
    async function checkScriptVersion(){
        const actual_date=getActualDate()
        if(actual_date!==GM_getValue("date_checked_version")){
            GM_setValue("date_checked_version", actual_date)
            const greasyForkURL = 'https://greasyfork.org/es/scripts/491442-stats-xente-script';
            fetch(greasyForkURL)
                .then(response => response.text())
                .then(data => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(data, 'text/html');
                    const versionElement = doc.querySelector('dd.script-show-version');
                    const latestVersion = versionElement ? versionElement.textContent.trim() : 'No se encontró versión';
                    const installedVersion = GM_info.script.version;
                    GM_setValue("stx_latest_version",latestVersion)
                    compareVersions(installedVersion, latestVersion);
                })
                .catch(error => {
                    console.error('Error al obtener la versión del script:', error);
                });



        }

    }
    function putSortIcon(a, tabla_) {
        let filaEncabezado = tabla_.querySelector('thead tr');
        let celdas = filaEncabezado.getElementsByTagName('th');
        if (celdas.length === 0) {
            celdas = filaEncabezado.getElementsByTagName('td');
        }
        let elementos = tabla_.querySelectorAll('.bi.bi-arrow-down-short');
        elementos.forEach(function (elemento) {
            elemento.remove();
        })

        elementos = tabla_.querySelectorAll('.bi.bi-arrow-up-short');
        elementos.forEach(function (elemento) {
            elemento.remove();
        })



        let iconAsc = '<svg class="bi bi-arrow-up-short" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="12" height="12" viewBox="0 0 320 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M182.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8l256 0c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"/></svg>'
        let iconDesc = '<svg class="bi bi-arrow-down-short" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="12" height="12" viewBox="0 0 320 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8l256 0c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z"/></svg>'

        let icon = iconAsc;
        if (document.getElementById("ord_table").value === "descendente") {
            icon = iconDesc;
        }


        celdas[a].innerHTML = icon + celdas[a].innerHTML;
    }
    function darkenColor(rgb, percent) {
        let result = rgb.match(/\d+/g);

        // Convertir los valores RGB a enteros
        let r = parseInt(result[0]);
        let g = parseInt(result[1]);
        let b = parseInt(result[2]);
        // Reducir cada componente en un porcentaje
        r = Math.floor(r * (1 - percent / 100));
        g = Math.floor(g * (1 - percent / 100));
        b = Math.floor(b * (1 - percent / 100));

        // Asegurarse de que los valores estén dentro del rango válido (0-255)
        r = Math.max(0, Math.min(255, r));
        g = Math.max(0, Math.min(255, g));
        b = Math.max(0, Math.min(255, b));

        // Convertir de vuelta a hexadecimal y retornar el valor oscuro
        return "#" + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }).join("");
    }
    function setCSSStyles(){
        let link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css?family=Roboto&display=swap';
        link.rel = 'stylesheet';

        let link1 = document.createElement('link');
        link1.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css';
        link1.rel = 'stylesheet';
        document.head.appendChild(link)
        document.head.appendChild(link1)

        let inputHidden = document.createElement('input');
        inputHidden.type = 'hidden';
        inputHidden.id = 'ord_table';
        inputHidden.value = 'ascendente';
        document.body.appendChild(inputHidden);
        GM_addStyle(`#snackbar_stx {
  visibility: hidden;
  position: fixed;
  /*display: flex;*/
  align-items: center;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 350px;
  background-color: #323232;
  color: #ffffffb3;
  text-align: center;
  border-radius: 2px;
  padding: 16px;
  z-index: 1;
  bottom: 30px;
  font-size: 17px;
  border-radius: 5px;
  box-shadow: 0 3px 5px -1px #0003, 0 6px 10px #00000024, 0 1px 18px #0000001f;
}

#snackbar_stx.showSnackBar_stx {
  visibility: visible;
  -webkit-animation: fadein 0.5s, fadeout 0.5s 8s forwards;
  animation: fadein 0.5s, fadeout 0.5s 8s forwards;
}

@-webkit-keyframes fadein {
  from {bottom: 0; opacity: 0;}
  to {bottom: 30px; opacity: 1;}
}

@keyframes fadein {
  from {bottom: 0; opacity: 0;}
  to {bottom: 30px; opacity: 1;}
}

@-webkit-keyframes fadeout {
  from {bottom: 30px; opacity: 1;}
  to {bottom: 0; opacity: 0;}
}

@keyframes fadeout {
  from {bottom: 30px; opacity: 1;}
  to {bottom: 0; opacity: 0;}
}


.divAlert {
  width: 75%;
  padding: 4px 3px;
  border-radius: 4px;
  border-style: solid;
  border-width: 1px;
  font-size: 13px;
    background-color: #ffc107;
    color: #161515;
    border-color: #ffffff;
    font-weight: bold;
    text-shadow: 1px 1px #ffffff;
}.modal_cargando-stx {
        display: none;
        /* Hidden by default */
        position: fixed;
        /* Stay in place */
        z-index: 150;
        /* Sit on top */
        padding-top: 25px;
        /* Location of the box */
        left: 0;
        top: 0;
        width: 100%;
        /* Full width */
        height: 100%;
        /* Full height */
        overflow: auto;
        /* Enable scroll if needed */
        background-color: rgb(0, 0, 0);
        /* Fallback color */
        background-color: rgba(0, 0, 0, 0.75);
        /* Black w/ opacity */
        justify-content: center;
        align-items: center;
    }

    .modal-content_cargando-stx {
    position:relative;
border-radius:7px;
        background-color: #fefefe00;
        width: 90%;
        height: 40%;
        display: flex;
        justify-content: center;
        align-items: center;
    }


.btn-save{
width:8em;
border-color:transparent;
border-radius: 3px;
  display: inline-block;
  padding: 10px 5px;
  text-shadow: 0 1px 0 rgba(255,255,255,0.3);
  box-shadow: 0 1px 1px rgba(0,0,0,0.3);
  cursor:pointer;
  color: white;
  font-family: 'Roboto', sans-serif;
  background-color: #3CC93F;/*Color de fondo*/
}
.btn-save:hover{
  background-color: #37B839;/*Color de fondo*/
}
.btn-save:active{
  background-color: #29962A;/*Color de fondo*/
}


.btn-update{
width:8em;
border-color:transparent;
border-radius: 3px;
  display: inline-block;
  padding: 10px 5px;
  text-shadow: 0 1px 0 rgba(255,255,255,0.3);
  box-shadow: 0 1px 1px rgba(0,0,0,0.3);
  cursor:pointer;
  color: white;
  font-family: 'Roboto', sans-serif;
  background-color: #2da8ef;/*Color de fondo*/
}
.btn-update:hover{
  background-color: #2187c2;/*Color de fondo*/
}
.btn-update:active{
  background-color: #2187c2;/*Color de fondo*/
}


.btn-comp-fed{
width:17em;
font-family: 'Roboto', sans-serif;
border:1px solid black;
border-radius: 5px;
  display: inline-block;
  padding: 7px 3px;
  cursor:pointer;
  color: white;
  background-color: #2da8ef;/*Color de fondo*/
}
.btn-comp-fed:hover{
  background-color: #2187c2;/*Color de fondo*/
}
.btn-comp-fed:active{
  background-color: #2187c2;/*Color de fondo*/
}

.btn-delete{
width:8em;
border-color:transparent;
border-radius: 3px;
  display: inline-block;
  padding: 10px 5px;
  text-decoration: none;
  text-shadow: 0 1px 0 rgba(255,255,255,0.3);
  box-shadow: 0 1px 1px rgba(0,0,0,0.3);
  cursor:pointer;
  color: white;
  font-family: 'Roboto', sans-serif;
  background-color: #e6413e;/*Color de fondo*/
}
.btn-delete:hover{
  background-color: #C93832;/*Color de fondo*/
}
.btn-delete:active{
  background-color: #ad2a24;/*Color de fondo*/
}

    .cerrar {
    position: absolute;
    top: 0;
    right: 0;
    padding: 5px;
    cursor: pointer;
    color: #fff;
  }

    .close_cargando-stx {
        color: #aaaaaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
    }

    .close_cargando-stx:hover,
    .close_cargando-stx:focus {
        color: #000;
        text-decoration: none;
        cursor: pointer;
    }.stx_legend {
    z-index:300;
    position: fixed;
    bottom: 60%;
    right: 1px;
    border: 1px solid #2bacf5;
  padding-right: 13px;
    padding-left: 3px;
    padding-top: 3px;
     padding-bottom: 3px;
    width: 14px;
    font-size: 13px;
    border-radius: 4px;
    text-shadow: 1px 1px 3px #676767;
    background-color: #246355;
    color: #246355;
    cursor: default;
         cursor: pointer;
}.loader {
  width: 100%;
  height: 15px;
  border-radius: 40px;
  color: #ffc107;
  border: 2px solid;
  position: relative;
  overflow: hidden;
}
.loader::before {
  content: "";
  position: absolute;
  margin: 2px;
  width: 14px;
  top: 0;
  bottom: 0;
  left: -20px;
  border-radius: inherit;
  background: currentColor;
  box-shadow: -10px 0 12px 3px currentColor;
  clip-path: polygon(0 5%, 100% 0,100% 100%,0 95%,-30px 50%);
  animation: l14 1s infinite linear;
}
@keyframes l14 {
  100% {left: calc(100% + 20px)}
}
.containerPeqAmarillo {
  text-wrap: nowrap;
  display: block;
  position: relative;
  padding-left: 27px;
  margin-bottom: 12px;
  font-size:small;
  padding-top:5px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default checkbox */
.containerPeqAmarillo input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmarkPeqAmarillo {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #a1a1a1;
}

/* On mouse-over, add a grey background color */
.containerPeqAmarillo:hover input ~ .checkmarkPeqAmarillo {
  background-color: #5c5151;
}

/* When the checkbox is checked, add a blue background */
.containerPeqAmarillo input:checked ~ .checkmarkPeqAmarillo {
  background-color: #FFCC00;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmarkPeqAmarillo:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.containerPeqAmarillo input:checked ~ .checkmarkPeqAmarillo:after {
  display: block;
}

/* Style the checkmark/indicator */
.containerPeqAmarillo .checkmarkPeqAmarillo:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
#showMenu {
    text-align: left;
    border-collapse: collapse;
    width: 75%;
    font-size: 14px;
    font-family: 'Roboto', sans-serif
  }

 /* #showMenu th,td {
    padding: 4px;
  }*/

  #showMenu td {
    background-color: white;
  }

  #showMenu thead {
    background-color: #246355;
    border-bottom: solid 2px #0F362D;
    color: white;
  }

  #showMenu tfoot {
    font-family: 'Righteous', cursive;
    background-color: #246355;
    border-bottom: solid 5px #0F362D;
    font-size: 13px;
    color: white;
  }



  #showMenu tr td,
  th {
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  #showMenu th:first-child {
    border-top-left-radius: 5px;
  }

  #showMenu th:last-child {
    border-top-right-radius: 5px;
  }

  #showMenu tr {
    background-color: transparent;
    border-color: transparent;
    font-family: 'Roboto';
  }

  #show3{

  width: 75%;
  background-color: transparent;
      border-collapse: separate;
    border-spacing: 0;
  }



  #show3 td {
    background-color: white;
  }

 #show3 tr:last-child td:last-child {
    border-bottom-right-radius: 5px;
}


#show3 tr:last-child td:first-child {
    border-bottom-left-radius: 5px;
}

.caja_mensaje_50 {
    font-family: 'Roboto', sans-serif;
    background: #98D398;
    color: #FFFFFF;
    font-weight: bold;
    padding: 4px;
    text-align: center;
    width: 50%;
    font-size: 2.0em;
    border-radius: 5px;
}

.modal_div_content_main{
width: 100%;
background-color: #f2f2f2;
    min-height: 115px;
    border-radius: 5px;
}




  .expandable-icon {
    right: 0px;
    top: 0px;
    transform: rotateZ(45deg);
    border-radius: 5px;
    width: 20px;
    height: 20px;
    background: rgb(12, 47, 94);
    transition: all .3s;
  }

.expandable-item.active .expandable-icon{
  transform: rotateZ(0);
}

  .expandable-icon .line {
    width: 15px;
    height: 2px;
    background: white;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    transition: all .4s;
  }

  .expandable-icon .line:nth-child(1) {
    transform: rotateZ(45deg);
  }

  .expandable-icon .line:nth-child(2) {
    transform: rotateZ(-45deg);
  }


    .imgMiddle {
      display: inline-block;
      vertical-align: middle;
    }

    .textMiddle {
      display: inline-block;
      vertical-align: middle;
    }


     table.matchValuesTable {
        border-collapse: collapse;
        width: 80%;
        margin: 5px 0;
        z-index:20;
        position: relative;

    }
    table.matchValuesTable th, table.matchValuesTable td {
        border: 1px solid #ddd;
        text-align: center;
        padding: 6px;
         border: 0px;
    }
    table.matchValuesTable th {
        background-color: #e4c800;
        color: white;
         border: 0px;
    }

    table.matchValuesTable th:first-child {
  border-top: none; /* Quita el borde superior de la primera celda del encabezado */
}


#button-snackbar-update{
color: #2da8ef;
background-color: transparent;
border: 1px solid #2da8ef;
padding: .15rem .50rem;
font-size: 0.90rem;
line-height: 1.5;
border-radius: .25rem;
cursor:pointer;
}

#button-snackbar-update:hover{
color: white;
background-color: #2da8ef;
border: 1px solid #2da8ef;
padding: .15rem .50rem;
font-size: 0.90rem;
line-height: 1.5;
border-radius: .25rem;
cursor:pointer;
}.loader-soccer {
  width: 100%;
  height: 15px;
  border-radius: 40px;
  color: #5d7f13;
  border: 2px solid;
  position: relative;
  overflow: hidden;
}
.loader-soccer::before {
  content: "";
  position: absolute;
  margin: 2px;
  width: 14px;
  top: 0;
  bottom: 0;
  left: -20px;
  border-radius: inherit;
  background: currentColor;
  box-shadow: -10px 0 12px 3px currentColor;
  clip-path: polygon(0 5%, 100% 0,100% 100%,0 95%,-30px 50%);
  animation: l14 1s infinite linear;
}

.loader-hockey {
  width: 100%;
  height: 15px;
  border-radius: 40px;
  color: #148cac;
  border: 2px solid;
  position: relative;
  overflow: hidden;
}
.loader-hockey::before {
  content: "";
  position: absolute;
  margin: 2px;
  width: 14px;
  top: 0;
  bottom: 0;
  left: -20px;
  border-radius: inherit;
  background: currentColor;
  box-shadow: -10px 0 12px 3px currentColor;
  clip-path: polygon(0 5%, 100% 0,100% 100%,0 95%,-30px 50%);
  animation: l14 1s infinite linear;
}
@keyframes l14 {
  100% {left: calc(100% + 20px)}
}
  `)

    }


    async function playersPage1() {
        setTimeout(function () {
            let player_images
            let elementos = document.getElementsByClassName('playerContainer');

            let player_values = {}
            let tactics_list = []

            let urlParams = new URLSearchParams(window.location.search);
            let flagStats = true
            if (urlParams.has('tid')) {
                flagStats = false
            }

            if (flagStats) {
                let habil_container = elementos[0].getElementsByClassName("player_skills")
                let habil = habil_container[0].getElementsByClassName("clippable")

                if (window.sport === "hockey") {
                    for (let q = 1; q < habil.length; q++) {
                        skills_names.push(habil[q].textContent)
                    }
                } else {

                    for (let q = 0; q < habil.length - 1; q++) {
                        skills_names.push(habil[q].textContent)
                    }
                    player_images = document.getElementsByClassName("player-image soccer")
                }
            }

            let ids_ = []

            for (let i = 0; i < elementos.length; i++) {
                let ids = elementos[i].getElementsByClassName('player_id_span');

                let elementos_ = elementos[i].getElementsByClassName('p_sublinks');

                let subheaders = elementos[i].getElementsByClassName('subheader clearfix');


                let enlace = subheaders[0].querySelector('.subheader a');
                let playerName = enlace.querySelector('.player_name').textContent

                ids_.push({ "id": ids[0].textContent, "name": playerName });


                let txt = '<span id=but' + ids[0].textContent + ' class="player_icon_placeholder"><a href="#" onclick="return false"'
                txt += 'title="Stats Xente" class="player_icon"><span class="player_icon_wrapper">'
                txt += '<span class="player_icon_image" style="background-image: url(\'https://www.statsxente.com/MZ1/View/Images/main_icon_mini.png\'); width: 21px; height: 18px; background-size: auto;'
                txt += 'z-index: 0;"></span><span class="player_icon_text"></span></span></a></span>'

                let index=0
                if(window.stx_device!=="computer"){index=1}
                elementos_[index].innerHTML += txt;

                if (flagStats) {
                    let flag_gk = false;
                    let age_div = elementos[i].getElementsByClassName('dg_playerview_info');
                    let age_table = age_div[0].getElementsByTagName('table')[0];

                    let ini_age = age_table.getElementsByTagName('td')[0].textContent.indexOf(":")
                    let age = age_table.getElementsByTagName('td')[0].textContent.substring(ini_age + 2, ini_age + 4);


                    if ((window.sport === "soccer") && (player_images[i].innerHTML.includes("gk=1"))) {
                        flag_gk = true
                    }

                    let tactics = elementos[i].getElementsByClassName('player_tactic gradientSunriseIcon');

                    player_values = {
                        "id": ids[0].textContent,
                        "skills": [],
                        "lines": [],
                        "tactics-position": {},
                        "tactics": [],
                        "age": parseInt(age)
                    }

                    for (let j = 0; j < tactics.length; j++) {
                        let fin = 0;
                        let line = ""
                        let ini = tactics[j].textContent.indexOf('(');
                        let tactic = tactics[j].textContent.substring(0, ini - 1);

                        if (window.sport === "hockey") {

                            if (!tactics[j].textContent.includes(":")) {
                                ini = tactics[j].textContent.indexOf('(');
                                fin = tactics[j].textContent.indexOf(')');
                                line = tactics[j].textContent.substring(ini + 2, fin - 1);
                                gk_line = line;
                            } else {
                                ini = tactics[j].textContent.indexOf('(');
                                fin = tactics[j].textContent.indexOf(':');
                                line = tactics[j].textContent.substring(ini + 2, fin);
                            }

                        } else {
                            ini = tactics[j].textContent.indexOf('(');
                            fin = tactics[j].textContent.indexOf(')');
                            line = tactics[j].textContent.substring(ini + 2, fin - 1);
                            if (flag_gk) {
                                gk_line = line;
                            }
                            if (tactics[j].textContent.includes(",")) {
                                ini = tactics[j].textContent.indexOf('(');
                                fin = tactics[j].textContent.indexOf(',');
                                su_line = tactics[j].textContent.substring(ini + 2, fin);
                            }
                        }

                        if (!player_values['lines'].includes(line)) {
                            player_values['lines'].push(line);
                        }
                        if (!player_values['tactics'].includes(tactic)) {
                            player_values['tactics'].push(tactic);
                        }

                        player_values['tactics-position'][tactic] = line

                        if ((!lines.includes(line))) {
                            lines.push(line);
                        }

                        if (!tactics_list.includes(tactic)) {
                            tactics_list.push(tactic);
                        }


                    }
                    let skills_container=elementos[i].getElementsByClassName('skills-container floatLeft clearfix')
                    let skills = skills_container[0].getElementsByClassName('skillval');

                    if (window.sport === "hockey") {

                        for (let j = 1; j < skills.length; j++) {
                            let cleanedText = skills[j].textContent.replace(')', '');
                            cleanedText = cleanedText.replace('(', '');
                            let number = parseInt(cleanedText, 10);
                            player_values['skills'].push(number);
                        }

                    } else {
                        for (let j = 0; j < skills.length - 1; j++) {

                            let cleanedText = skills[j].textContent.replace(')', '');
                            cleanedText = cleanedText.replace('(', '');
                            let number = parseInt(cleanedText, 10);
                            player_values['skills'].push(number);
                        }
                    }
                    players.push(player_values)
                }
            }
            if (flagStats) {
                const container = document.getElementById("squad-search-toggle")
                let contenidoNuevo = "<div id='containerTactics' style='background-color: #e3e3e3; margin: 0 auto; text-align:center;'></br>"
                contenidoNuevo += "<div id=selectDiv>Choose Tactic: <select id=tactics_select>"
                contenidoNuevo += "<option value='All Team'>All Team</option>"
                for (let x = 0; x < tactics_list.length; x++) {
                    let selected = ""
                    if (x === 0) {
                        selected = "selected=''";
                    }
                    contenidoNuevo += "<option " + selected + " value='" + tactics_list[x] + "'>" + tactics_list[x] + "</option>"
                }
                contenidoNuevo += "</select></div></br><div id=divMenu></div></center></div>"
                container.innerHTML = contenidoNuevo + container.innerHTML;
                skillDistrib(tactics_list[0]);
                document.getElementById("tactics_select").addEventListener('change', function () {
                    let select = document.getElementById('tactics_select');
                    let valorSeleccionado = select.value;
                    document.getElementById("divMenu").innerHTML = ""
                    skillDistrib(valorSeleccionado)
                });
            }

            let team_id
            if(window.sport==="soccer"){
                team_id=GM_getValue("soccer_team_id")
            }else{
                team_id=GM_getValue("hockey_team_id")
            }


            for (let i = 0; i < ids_.length; i++) {
                (function (currentId, currentTeamId, currentSport, lang, team_name, player_name) {
                    document.getElementById("but" + currentId).addEventListener('click', function () {
                        let link = "http://statsxente.com/MZ1/Functions/tamper_player_stats.php?sport=" + currentSport
                            + "&player_id=" + currentId + "&team_id=" + currentTeamId + "&idioma=" + lang + "&divisa=" + GM_getValue("currency") +
                            "&team_name=" + encodeURIComponent(team_name) + "&player_name=" + encodeURIComponent(player_name)
                        openWindow(link, 0.95, 1.25);
                    });
                })(ids_[i]['id'], team_id, window.sport, window.lang, "[undefined]", ids_[i]['name']);
            }

        }, 1000);
    }
    function skillDistrib1(tactic) {
        let t = tactic
        let l=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        if (window.sport === "hockey") {
            l = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }

        let li_t = {}
        for (let i = 0; i < lines.length; i++) {
            li_t[lines[i]] = [...l];
        }

        let no_gk_line = "Tactic -(" + gk_line + ")"
        li_t["Team"] = [...l];
        li_t["U23"] = [...l];
        li_t["U21"] = [...l];
        li_t["U18"] = [...l];
        li_t["Tactic"] = [...l];
        li_t[no_gk_line] = [...l];

        let i,j
        for (i = 0; i < players.length; i++) {
            if (players[i]['tactics'].includes(t)) {
                for (j = 0; j < players[i]['skills'].length; j++) {
                    li_t[players[i]['tactics-position'][t]][j] += players[i]['skills'][j]
                    li_t['Tactic'][j] += players[i]['skills'][j]
                    if (players[i]['tactics-position'][t] !== "Po") {
                        li_t[no_gk_line][j] += players[i]['skills'][j]
                    }
                }
                li_t[players[i]['tactics-position'][t]][j] += 1
                li_t['Tactic'][j] += 1
                if (players[i]['tactics-position'][t] !== "Po") {
                    li_t[no_gk_line][j] += 1
                }
            } else {

                for (let j = 0; j < players[i]['skills'].length; j++) {
                    if (players[i]['age'] <= 23) {
                        li_t['U23'][j] += players[i]['skills'][j]
                    }
                    if (players[i]['age'] <= 23) {
                        li_t['U21'][j] += players[i]['skills'][j]
                    }
                    if (players[i]['age'] <= 23) {
                        li_t['U18'][j] += players[i]['skills'][j]
                    }
                    li_t['Team'][j] += players[i]['skills'][j]
                }

                if (players[i]['age'] <= 23) {
                    li_t['U23'][li_t["U23"].length - 1] += 1
                }

                if (players[i]['age'] <= 21) {
                    li_t['U21'][li_t["U21"].length - 1] += 1
                }
                if (players[i]['age'] <= 18) {
                    li_t['U18'][li_t["U18"].length - 1] += 1
                }
                li_t['Team'][li_t["Team"].length - 1] += 1
            }
        }

        const container = document.getElementById("divMenu")
        let contenidoNuevo = "<table id=showMenu style='width:95%;font-size:13px; margin: 0 auto; text-align:center;'><thead style='background-color:" + GM_getValue("bg_native") + "; color:" + GM_getValue("color_native") + ";'><tr>";
        contenidoNuevo += '<th style="padding:4px; margin: 0 auto; text-align:center;">Line</th>'
        for (let q = 0; q < skills_names.length; q++) {
            contenidoNuevo += '<th style="padding:4px; margin: 0 auto; text-align:center;">' + skills_names[q] + '</th>'
        }
        contenidoNuevo += '</tr></thead>';
        let l_aux = lines
        l_aux = l_aux.filter(item => item !== gk_line);
        l_aux.sort((a, b) => {
            let numA = parseInt(a.substring(1), 10);
            let numB = parseInt(b.substring(1), 10);
            return numA - numB;
        });

        l_aux.unshift(gk_line);
        l_aux.push("Tactic");
        l_aux.push(no_gk_line);

        if (window.sport === "hockey") {
            if (li_t["L4"][10] === 0) {
                let index = l_aux.indexOf('L4');
                if (index !== -1) {
                    l_aux.splice(index, 1);
                }
            }
        }

        if (t === "All Team") {
            l_aux = ["Team", "U23", "U21", "U18"]
        }

        l_aux = l_aux.filter(item => !item.includes(su_line));

        for (let w = 0; w < l_aux.length; w++) {
            let key = l_aux[w]
            if (li_t.hasOwnProperty(key)) {
                contenidoNuevo += "<tr>";
                contenidoNuevo += "<td style='padding:2px; margin: 0 auto; text-align:center;'><strong>" + key + "</strong></td>";
                for (let x = 0; x < li_t[key].length - 1; x++) {
                    contenidoNuevo += "<td style='padding:2px; margin: 0 auto; text-align:center;'>" + Math.round(li_t[key][x] / li_t[key][li_t[key].length - 1] * 100) / 100 + "</td>";
                }
                contenidoNuevo += "</tr>";

            }
        }
        container.innerHTML += contenidoNuevo;
    }
    function getParsedValidDate(texto) {
        let fecha = new Date(texto);
        if (!isNaN(fecha.getTime())) {
            return fecha.toISOString().split('T')[0];
        } else {
            let hoy = new Date();
            hoy.setDate(hoy.getDate() - 5);
            return hoy.toISOString().split('T')[0];
        }
    }
    function ordenarTablaq(columna, byClassName, param) {
        let tabla
        if (byClassName) {
            let elems = document.getElementsByClassName(param);
            tabla = elems[0]
        } else {
            tabla = document.getElementById(param)
        }
        let filas, switching, i, x, y, debeCambiar, direccion, cambioRealizado;
        switching = true;
        direccion = document.getElementById("ord_table").value
        while (switching) {
            switching = false;
            filas = tabla.rows;
            for (i = 1; i < (filas.length - 1); i++) {
                debeCambiar = false;
                x = filas[i].getElementsByTagName("td")[columna];
                y = filas[i + 1].getElementsByTagName("td")[columna];
                let xValue = parseFloat(x.innerHTML.replace(/\./g, "").replace(/[^0-9,-]+/g, "").replace(",", "."));
                let yValue = parseFloat(y.innerHTML.replace(/\./g, "").replace(/[^0-9,-]+/g, "").replace(",", "."));
                if (direccion === "ascendente") {
                    if (isNaN(xValue)) {
                        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                            debeCambiar = true;
                            break;
                        }
                    } else {
                        if (xValue > yValue) {
                            debeCambiar = true;
                            break;
                        }
                    }
                } else if (direccion === "descendente") {
                    if (isNaN(xValue)) {
                        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                            debeCambiar = true;
                            break;
                        }
                    } else {
                        if (xValue < yValue) {
                            debeCambiar = true;
                            break;
                        }
                    }
                }
            }



            if (debeCambiar) {
                filas[i].parentNode.insertBefore(filas[i + 1], filas[i]);
                switching = true;
                cambioRealizado = true;
            } else {
                if (!cambioRealizado && direccion === "descendente") {
                    //direccion = "ascendente";
                    switching = true;
                }
            }
        }

        if (document.getElementById("ord_table").value === "descendente") {
            document.getElementById("ord_table").value = "ascendente";
        } else {
            document.getElementById("ord_table").value = "descendente";
        }


        filas = tabla.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
        for (i = 0; i < filas.length; i++) {
            let primerTd = filas[i].querySelector("td");
            primerTd.innerHTML = (i + 1);
        }
    }

    function playersPageStatsAll(){
        let params = new URLSearchParams(window.location.search)
        let tid = params.get('tid')
        let elementos1 = document.getElementsByClassName('playerContainer')
        for (let i = 0; i < elementos1.length; i++) {
            let playerName = elementos1[i].querySelector('.player_name').textContent
            let ids = elementos1[i].getElementsByClassName('player_id_span')
            let elementos_ = elementos1[i].getElementsByClassName('p_sublinks')
            let txt = '<span id=but' + ids[0].textContent + ' class="player_icon_placeholder"><a href="#" onclick="return false"'
            txt += 'title="Stats Xente" class="player_icon"><span class="player_icon_wrapper">'
            txt += '<span class="player_icon_image" style="background-image: url(\'https://www.statsxente.com/MZ1/View/Images/main_icon_mini.png\'); width: 21px; height: 18px; background-size: auto;'
            txt += 'z-index: 0;"></span><span class="player_icon_text"></span></span></a></span>'

            let index=0
            if(window.stx_device!=="computer"){index=1}
            elementos_[index].innerHTML += txt;


            (function (currentId, currentTeamId, currentSport, lang, team_name, player_name) {
                document.getElementById("but" + currentId).addEventListener('click', function () {
                    let link = "http://statsxente.com/MZ1/Functions/tamper_player_stats.php?sport=" + currentSport
                        + "&player_id=" + currentId + "&team_id=" + currentTeamId + "&idioma=" + lang + "&divisa=" + GM_getValue("currency") +
                        "&team_name=" + encodeURIComponent(team_name) + "&player_name=" + encodeURIComponent(player_name)
                    openWindow(link, 0.95, 1.25);
                });
            })(ids[0].textContent, tid, window.sport, window.lang, "[undefined]", playerName);

        }

    }


    function parseNumber(numStr) {
        if (/^\d{1,3}(,\d{3})*\.\d+$/.test(numStr)) {
            return parseFloat(numStr.replace(/,/g, ''));
        }


        if (/^\d{1,3}(\.\d{3})*,\d+$/.test(numStr)) {
            return parseFloat(numStr.replace(/\./g, '').replace(',', '.'));
        }

        if (/^\d{1,3}(,\d{3})+$/.test(numStr)) {
            return parseFloat(numStr.replace(/,/g, ''));
        }

        if (/^\d{1,3}(\.\d{3})+$/.test(numStr)) {
            return parseFloat(numStr.replace(/\./g, ''));
        }
        return parseFloat(numStr.replace(',', '.'));
    }
})();
