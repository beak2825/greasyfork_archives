// ==UserScript==
// @name         Bots
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       yorares
// @match        http*://*.triburile.ro/*
// @include        http*://*.die-staemme.de/*
// @include        http*://*.staemme.ch/*
// @include        http*://*.tribalwars.net/*
// @include        http*://*.tribalwars.nl/*
// @include        http*://*.plemiona.pl/*
// @include        http*://*.tribalwars.se/*
// @include        http*://*.tribalwars.com.br/*
// @include        http*://*.tribos.com.pt/*
// @include        http*://*.divokekmeny.cz/*
// @include        http*://*.bujokjeonjaeng.org/*
// @include        http*://*.triburile.ro/*
// @include        http*://*.voyna-plemyon.ru/*
// @include        http*://*.fyletikesmaxes.gr/*
// @include        http*://*.tribalwars.no.com/*
// @include        http*://*.divoke-kmene.sk/*
// @include        http*://*.klanhaboru.hu/*
// @include        http*://*.tribalwars.dk/*
// @include        http*://*.plemena.net/*
// @include        http*://*.tribals.it/*
// @include        http*://*.klanlar.org/*
// @include        http*://*.guerretribale.fr/*
// @include        http*://*.guerrastribales.es/*
// @include        http*://*.tribalwars.fi/*
// @include        http*://*.tribalwars.ae/*
// @include        http*://*.tribalwars.co.uk/*
// @include        http*://*.vojnaplemen.si/*
// @include        http*://*.genciukarai.lt/*
// @include        http*://*.wartribes.co.il/*
// @include        http*://*.plemena.com.hr/*
// @include        http*://*.perangkaum.net/*
// @include        http*://*.tribalwars.jp/*
// @include        http*://*.tribalwars.bg/*
// @include        http*://*.tribalwars.asia/*
// @include        http*://*.tribalwars.us/*
// @include        http*://*.tribalwarsmasters.net/*
// @include        http*://*.perangkaum.net/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34745/Bots.user.js
// @updateURL https://update.greasyfork.org/scripts/34745/Bots.meta.js
// ==/UserScript==

jQuery(function($){
    var scris;
    $("body").prepend("<div id='botStart' style=' position: absolute; top: 40%; left: 5%'></div>");
    if(JSON.parse(localStorage.getItem("start")) === 0){scris = "Start";}else{scris = "Stop";}
    $("#botStart").append("<input type='button' value='"+scris+"' style=' font-size: 20px; background-color: white;color: black;border: 2px solid #f44336;'/>");
    $("#botStart").click(function(){if(JSON.parse(localStorage.getItem("start")) === 0){localStorage.setItem("start", JSON.stringify(1));location.reload();}else{localStorage.setItem("start", JSON.stringify(0));}location.reload();});
    if($("#popup_box_daily_bonus").length >0){$("#popup_box_daily_bonus").remove();}
    var waitTime = Math.floor((Math.random() * 5000) + 1);
    var villArray = JSON.parse(localStorage.getItem("sate"));
    var url = window.location.href;
    var splitPlus = url.split(/[^A-Za-z0-9.\/:]/g);
    var idSat = splitPlus[2];
    var barbArray = JSON.parse(localStorage.getItem("coordonateBarb"));
    var r = JSON.parse(localStorage.getItem("iLastSate"));
    var i;
    var waitTimeSw = Math.floor((Math.random() * (40000 - 10000 + 1)) + 10000);
    var obiect = JSON.parse(localStorage.getItem("obiect"));
    var idleTime = 0;

    console.log(splitPlus);
    console.log(obiect);
    if (typeof JSON.parse(localStorage.getItem("iLastSate")) !== 'undefined' && JSON.parse(localStorage.getItem("iLastSate")) !== null){r = JSON.parse(localStorage.getItem("iLastSate"));}else{
        r = 0;
        localStorage.setItem("iLastSate", JSON.stringify(r));}
    if(r >= JSON.parse(localStorage.getItem("sate")).length){ r = 0;localStorage.setItem("iLastSate", JSON.stringify(r));}
    function removeBarb(){
        let lastBarb = obiect.ultimulBarbar;
        var indexN = barbArray.indexOf(lastBarb);
        barbArray.splice(indexN,1);
        obiect.modificat = 1;
        localStorage.setItem("obiect", JSON.stringify(obiect));
        localStorage.setItem("coordonateBarb", JSON.stringify(barbArray));
    }
    function barbsInteli(){
        if(obiect.modificat === 1){
            var cheile = Object.keys(obiect);
            var unde = cheile.indexOf("modificat");
            console.log("cheile si unde",cheile,typeof unde);
            for(i=0;i < unde;i++){
                obiect[cheile[i]].splice(1,1,1);
                console.log("modificat",obiect,i);
                var valorile = Object.values(obiect[cheile[i]]);
                for(j=3;j<valorile.length;j++){
                    console.log("al doilea for",j);
                    if(barbArray.indexOf(valorile[j]) == -1){
                        valorile.splice(j,1);
                    }
                }
                obiect[cheile[i]] = valorile;
                localStorage.setItem("obiect", JSON.stringify(obiect));
            }
            obiect.modificat = 0;
        }
        if(obiect[idSat].length < 3){obiect[idSat].splice(2,1,3);}
        if(obiect[idSat][1] === 1){
            for(i=0;i<barbArray.length;i++){

                var x = Math.abs(Number(obiect[idSat][0].split('|')[0]) - Number(barbArray[i].split('|')[0]));
                var y = Math.abs(Number(obiect[idSat][0].split('|')[1]) - Number(barbArray[i].split('|')[1]));

                var distanta = Math.sqrt((x*x) + (y*y));
                console.log("-1 ala",obiect[idSat].indexOf(barbArray[i]),distanta);
                if(distanta <= obiect.distanta && obiect[idSat].indexOf(barbArray[i]) == -1){
                    obiect[idSat].push(barbArray[i]);
                }
            }
            obiect[idSat].splice(1,1,0);
        }

        if(obiect[idSat][2] >= obiect[idSat].length){obiect[idSat].splice(2,1,3);}
        $(".target-input-field").val(obiect[idSat][obiect[idSat][2]]);
        obiect.ultimulBarbar = obiect[idSat][obiect[idSat][2]];
        obiect[idSat].splice(2,1,obiect[idSat][2]+1);
        localStorage.setItem("obiect", JSON.stringify(obiect));
        setTimeout(function(){$("#target_attack").click();}, waitTime);

    }
    function setUnits(unit,ce){
        if(ce === 0){$("#unit_input_spear").val(unit);}
        else if(ce === 1){$("#unit_input_sword").val(unit);}
        else if(ce === 2){$("#unit_input_axe").val(unit);}
        else if(ce === 3){$("#unit_input_light").val(unit);}
        else if(ce === 4){$("#unit_input_marcher").val(unit);}
        else if(ce === 5){$("#unit_input_heavy").val(unit);}
    }
    function changeSat(ind,vill){
        ind+=1;
        localStorage.setItem("iLastSate", JSON.stringify(ind));
        if(ind > JSON.parse(localStorage.getItem("sate")).length){ ind = 1;localStorage.setItem("iLastSate", JSON.stringify(ind));}
        console.log("Timp pana schimba: ",Math.round((waitTimeSw/1000)* 10) / 10, "secunde");

        setTimeout(function(){window.location.href = vill;}, waitTimeSw);
    }
    function getValuesAv(){
        var curata = function(html){
            html = html.replace('(','');
            html = html.replace(')','');
            html = parseInt(html);
            return html;};

        var availableUnitsLight = curata($("#units_entry_all_light").html());
        var availableUnitsSpear = curata($("#units_entry_all_spear").html());
        var availableUnitsSword = curata($("#units_entry_all_sword").html());
        var availableUnitsAxe = curata($("#units_entry_all_axe").html());
        var availableUnitsMarcher = curata($("#units_entry_all_marcher").html());
        var availablecalutTare = curata($("#units_entry_all_heavy").html());

        console.log(availableUnitsLight,"light");
        console.log(availableUnitsSpear,"spear");
        console.log(availableUnitsSword,"sword");
        console.log(availableUnitsAxe,"axe");
        console.log(availableUnitsMarcher,"Marcher");
        console.log(availablecalutTare,"Heavy");
        return [availableUnitsSpear, availableUnitsSword, availableUnitsAxe, availableUnitsLight, availableUnitsMarcher,availablecalutTare];
    }
    if (JSON.parse(localStorage.getItem("start")) === 1 && splitPlus[0] === "https://ro59.triburile.ro/game.php"){
        console.log("merge");
        var idleInterval = setInterval(timerIncrement(), 60000); // 1 minute

        //Zero the idle timer on mouse movement.
        $(this).mousemove(function (e) {
            idleTime = 0;
        });
        $(this).keypress(function (e) {
            idleTime = 0;
        });
    }

    function timerIncrement() {
        idleTime = idleTime + 1;
        if (idleTime > 10) { // 11 minutes
            changeSat(r,villArray[r]);
        }
    }
    if(splitPlus.length < 2 || splitPlus[2] === "expired"){
        $(".world_button_active:first").click();
    }else if (splitPlus[2] === "welcome" || splitPlus[4] === "intro") {
        changeSat(r,villArray[r]);
    }

    if(splitPlus[3] === "screen"&& splitPlus[4] === "place" && splitPlus[5] !== "try" && JSON.parse(localStorage.getItem("start")) === 1){
        console.log("Esti in piata centrala");
        var avUnits = getValuesAv();
        var pulei = JSON.parse(localStorage.getItem("pulei"));
        var sabie = JSON.parse(localStorage.getItem("sabie"));
        var topor = JSON.parse(localStorage.getItem("topor"));
        var calut = JSON.parse(localStorage.getItem("calut"));
        var calutTare = JSON.parse(localStorage.getItem("calutTare"));
        var calutArcher = JSON.parse(localStorage.getItem("calutArcas"));

        if (pulei <= avUnits[0] && pulei !== 0 && pulei !== 'undefined' && pulei !== null){setUnits(pulei,0);barbsInteli();}
        else if (sabie <= avUnits[1] && sabie !== 0 && sabie !== 'undefined' && sabie !== null){setUnits(sabie,1);barbsInteli();}
        else if (topor <= avUnits[2] && topor !== 0 && topor !== 'undefined' && topor !== null){setUnits(topor,2);barbsInteli();}
        else if (calut <= avUnits[3] && calut !== 0 && calut !== 'undefined' && calut !== null){setUnits(calut,3);barbsInteli();}
        else if (calutArcher <= avUnits[4] && calutArcher !== 0 && calutArcher !== 'undefined' && calutArcher !== null){setUnits(calutArcher,4);barbsInteli();}
        else if (calutTare <= avUnits[5] && calutTare !== 0 && calutTare !== 'undefined' && calutTare !== null){setUnits(calutTare,5);barbsInteli();}
        else {changeSat(r,villArray[r]);}

    }
    if(url.slice(-55) == "game.php?screen=welcome&intro&oscreen=overview_villages"){changeSat(r,villArray[r]);}
    if(splitPlus[5] ==="try" && splitPlus[6] === "confirm" && JSON.parse(localStorage.getItem("start")) === 1){
        if($(".error_box").length >0){changeSat(r,villArray[r]);}
        var jucator = $("td");
        var juca;
        for (j=0;j<jucator.length;j++){if(jucator[j].innerHTML == "Jucător:"){removeBarb();changeSat(r,villArray[r]); juca = 1;}console.log(j,"jucator",juca);}console.log("try confirm");
        if(juca !== 1){setTimeout(function(){ $("#troop_confirm_go").click();}, waitTime);}
    }else if (splitPlus[5] ==="try" && splitPlus[6] === "confirm" && JSON.parse(localStorage.getItem("start")) === 0){
        $("#content_value").append("<input type='text' id='cand' style='width:300px;font-size:25px;' placeholder=' ex: 2017-10-27 02:16:00'/><input type='button' value='Ataca' id='ataca'/><p id='show' style='font-size:20px;'>Ex: 2017-10-27 02:16:00</p>");
        $("#ataca").click(function(){
            var timpArr;
            var timp;
            function msToTime(duration) {
                var milliseconds = parseInt((duration%1000)/100), seconds = parseInt((duration/1000)%60), minutes = parseInt((duration/(1000*60))%60), hours = parseInt((duration/(1000*60*60))%24);

                hours = (hours < 10) ? "0" + hours : hours;
                minutes = (minutes < 10) ? "0" + minutes : minutes;
                seconds = (seconds < 10) ? "0" + seconds : seconds;

                return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
            }

            var jucator = $("td");
            for (j=0;j<jucator.length;j++){if(jucator[j].innerHTML == "Durată:"){timp = jucator[j+1].innerHTML;}console.log(j);}
            timpArr = timp.split(":");
            var secunde = (parseInt(timpArr[2]) * 1000) + ( parseInt(timpArr[1]) * 60000) + (parseInt(timpArr[0]) * 3600000);
            var diff = Math.abs(new Date($("#cand").val()) - new Date()) -secunde;
            setInterval(function(){diff = Math.abs(new Date($("#cand").val()) - new Date()) -secunde;}, 100);

            setTimeout(function(){ $("#troop_confirm_go").click();}, diff);
            console.log(diff);
            setInterval(function(){$("#show").html(msToTime(diff));}, 100);
        });


    }

});