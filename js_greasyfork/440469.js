// ==UserScript==
// @name         Nitro Type Race Stats V2 | ND
// @version      2.2
// @description  Get your stats displayed while racing!
// @author       Nate Dogg
// @match        https://www.nitrotype.com/race
// @match        https://www.nitrotype.com/race/*
// @namespace https://greasyfork.org/users/805959
// @downloadURL https://update.greasyfork.org/scripts/440469/Nitro%20Type%20Race%20Stats%20V2%20%7C%20ND.user.js
// @updateURL https://update.greasyfork.org/scripts/440469/Nitro%20Type%20Race%20Stats%20V2%20%7C%20ND.meta.js
// ==/UserScript==




// english.(languge.ru.ri.r.cs.j.s.s.beat)
window.onload = function(){/*ak3.1.2.3.00.01010.1001.10.01010.INTERNAL.EXPORT()*/
    var x = document.querySelectorAll(".list--inline")[0];

    var mother = document.querySelectorAll("structure-content")
    // chlid.2X.execute(vy=PI(3s).permission(EXTERNAL))_
    var parsedItem;

    var racesPlayed;
    var sessionRaces;
    var avgSpeed;
    var displayname;
    var username;
    var experience;
    var level;
    var title;
    var nitrosused;
    var money;

    if (localStorage.getItem('persist:nt')){
        resetVariables()

    }

    function resetVariables(){
        parsedItem = JSON.parse(JSON.parse(localStorage.getItem("persist:nt")).user);

        racesPlayed = parsedItem["racesPlayed"];
                racesPlayed = racesPlayed.toLocaleString()
        sessionRaces = parsedItem["sessionRaces"];
        avgSpeed = parsedItem["avgSpeed"];
        displayname = parsedItem["displayName"];
        username = parsedItem["username"];
        experience = parsedItem["experience"];
                experience = experience.toLocaleString()
        level = parsedItem["level"];
                level = level.toLocaleString()
        title = parsedItem["title"];
        nitrosused = parsedItem["nitrosUsed"];
                nitrosused = nitrosused.toLocaleString()
        money = parsedItem["money"];
                money = money.toLocaleString()
    }

//    dash-actions ok ok

        const style = document.createElement('style');
        style.innerHTML = `
      .experiment{
    height: auto;
    width: 100%;
    background: #343744;
    z-index: 1;
    position: absolute;
    border: 1px solid #444;
    box-sizing: border-box;
    padding: 7.5px 12.5px;
    color: #ccc;
    border-radius: 2.5px;

    }
    `;
    document.head.appendChild(style);

    function C(){
        var total_races_elem = document.createElement("div")
            total_races_elem.className = "experiment";

            total_races_elem.innerHTML = "Total races: <b>" + racesPlayed + "</b>　|　 Current session: <b>" + sessionRaces + "</b> 　|　 Average speed: <b>" + avgSpeed + "</b> 　|　 Cash: <b>" + money + "</b> 　|　 Season Level: <b>"+level+"</b> 　|　 Experience: <b>"+experience+"</b>";


            document.querySelector("#raceContainer").appendChild(total_races_elem);
    }

    C()



    var interval = setInterval(function() {
                if (document.querySelector(".race-results") == null || document.querySelector(".race-results") == 'undefined'){
                    return
                } else {
                     clearInterval(interval);
                     resetVariables()
                     C()
                }

            }, 500);





}