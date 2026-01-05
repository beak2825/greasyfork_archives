// ==UserScript==
// @name         Powerplay Manager EOR calculator
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Scripts calculates and displays effective overall ratings for all player positions
// @author       Luke Jakimowicz
// @match        http://soccer.powerplaymanager.com/*/overview-of-players.html
// @match        https://soccer.powerplaymanager.com/*/overview-of-players.html
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/26535/Powerplay%20Manager%20EOR%20calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/26535/Powerplay%20Manager%20EOR%20calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    var players = [];
    $(".main_content").find("table").addClass("original-table");
    var tableRow = $(".main_content").find("table tbody").first().find("tr");
    var tableColumns = ["name", "position", "age", "", "avq", "cl", "goalkeeping", "defense", "midfield", "offense", "shooting", "passing", "technique", "speed", "heading", "experience", "or", "side"];
    var skillRatios = [
        { position: "gk", goalkeeping: 100, defense: 0, midfield: 0, offense: 0, shooting: 0, passing: 25, technique: 75, speed: 75, heading: 25},
        { position: "cd", goalkeeping: 0, defense: 100, midfield: 0, offense: 0, shooting: 0, passing: 50, technique: 50, speed: 50, heading: 50},
        { position: "fb", goalkeeping: 0, defense: 100, midfield: 0, offense: 0, shooting: 0, passing: 50, technique: 50, speed: 75, heading: 25},
        { position: "cm", goalkeeping: 0, defense: 0, midfield: 100, offense: 0, shooting: 0, passing: 75, technique: 75, speed: 25, heading: 25},
        { position: "wm", goalkeeping: 0, defense: 0, midfield: 100, offense: 0, shooting: 0, passing: 50, technique: 50, speed: 75, heading: 25},
        { position: "cf", goalkeeping: 0, defense: 0, midfield: 0, offense: 100, shooting: 75, passing: 25, technique: 50, speed: 75, heading: 25},
        { position: "wf", goalkeeping: 0, defense: 0, midfield: 0, offense: 100, shooting: 75, passing: 50, technique: 75, speed: 75, heading: 25}
    ];
    
    tableRow.each(function() {
        var player = {};
        $(this).find("td").each(function(index) {
            if (tableColumns[index].length > 0) {
                var tableItem = $(this).text();
                if (tableColumns[index] === "cl") tableItem = tableItem.substr(0,1);
                if (tableColumns[index] === "name") tableItem = $(this).html();
                if (!isNaN(tableItem)) tableItem = parseInt(tableItem, 10);
                player[tableColumns[index]] = tableItem;
            }
        });
        players.push(player);        
    });
        
    for (var p=0; p<players.length; p++) {

        var eorPlayer = {};

        for (var r=0; r<skillRatios.length; r++) {
            var ratioSum =  skillRatios[r].goalkeeping + 
                            skillRatios[r].defense + 
                            skillRatios[r].midfield + 
                            skillRatios[r].offense + 
                            skillRatios[r].shooting + 
                            skillRatios[r].passing + 
                            skillRatios[r].technique + 
                            skillRatios[r].speed + 
                            skillRatios[r].heading;

            var skillValues = [];

            if (skillRatios[r].goalkeeping > 0) skillValues.push(players[p].goalkeeping / skillRatios[r].goalkeeping);
            if (skillRatios[r].defense > 0)     skillValues.push(players[p].defense / skillRatios[r].defense);
            if (skillRatios[r].midfield > 0)    skillValues.push(players[p].midfield / skillRatios[r].midfield);
            if (skillRatios[r].offense > 0)     skillValues.push(players[p].offense / skillRatios[r].offense);
            if (skillRatios[r].shooting > 0)    skillValues.push(players[p].shooting / skillRatios[r].shooting);
            if (skillRatios[r].passing > 0)     skillValues.push(players[p].passing / skillRatios[r].passing);
            if (skillRatios[r].techique > 0)    skillValues.push(players[p].technique / skillRatios[r].technique);
            if (skillRatios[r].speed > 0)       skillValues.push(players[p].speed / skillRatios[r].speed);
            if (skillRatios[r].heading > 0)     skillValues.push(players[p].heading / skillRatios[r].heading);

            var lowestSkill = Math.min.apply(null, skillValues);
            players[p]["eor_"+skillRatios[r].position] = Math.floor(lowestSkill * ratioSum);

            
        }

        
    }

    function drawEorTable() {

        $("#eor-container").remove();
        var eorTableHTML = "<div id='eor-container'>";

        var activeStyle = "cursor: pointer; display: block; float: left; background-color: #3ba33d; color: #fff; padding: 0px; width: 150px; height:40px; line-height: 40px;margin-right: 10px; margin-bottom: 20px;";
        var inactiveStyle = "cursor: pointer; display: block; float: left; background-color: #343434; color: #fff; padding: 0px; width: 150px; height: 40px; line-height: 40px;margin-right: 10px; margin-bottom: 20px;";

        var toggleActive = "text-decoration: none; text-align:center; cursor: pointer; display: inline-block; background-color: #3ba33d; color: #fff; padding: 0px; width: 50px; height:40px; line-height: 40px;margin-left: 10px;";
        var toggleInactive = "text-decoration: none; text-align:center; cursor: pointer; display: inline-block; background-color: #c0c0c0; color: #fff; padding: 0px; width: 50px; height:40px; line-height: 40px;margin-left: 10px;";

        eorTableHTML += "<a class='regularTab active' style='"+activeStyle+"'>Regular View</a><a class='eorTab' style='"+inactiveStyle+"'>Loading EOR Data</a>";
        eorTableHTML += "<div class='eorToggles' style='width: 200px; text-align: right; float: right; height: 40px; margin-bottom: 20px; line-height: 40px;'>";
        eorTableHTML += "<img src='http://i1.wp.com/cdnjs.cloudflare.com/ajax/libs/galleriffic/2.0.1/css/loader.gif' style='width: 24px; height: 24px; display: block; margin-top: 8px; float: right;' class='eor-spinner'/>";
        eorTableHTML += "<a class='eor-exp active' style='"+toggleActive+" display: none;'>EXP</a>";
        eorTableHTML += "<a class='eor-chem active' style='"+toggleActive+" display: none;'>CHEM</a>";
        eorTableHTML += "<a class='eor-energy active' style='"+toggleActive+" display: none;'>ENE</a>";
        eorTableHTML += "</div>"
        eorTableHTML += "<table id='table-eor' class='table eor-table' cellspacing=0 cellpadding=0 style='border-collapse: collapse'>";
        eorTableHTML += "<thead><tr><td style='max-width: 300px;' class='th1'>Name</td><td class='th2'>Age</td><td class='th1'>GK</td><td class='th2'>FB</td><td class='th1'>CD</td><td class='th2'>WM</td><td class='th1'>CM</td><td class='th2'>WF</td><td class='th1'>CF</td></tr></thead><tbody>";
        for (var p=0; p<players.length; p++) {

            eorTableHTML += "<tr data-exp='"+players[p].experience+"' style='border-bottom: solid 1px #3ba33d !important'>";
            eorTableHTML += "<td class='left_align tr0td1'>"+players[p].name+"</td>";
            eorTableHTML += "<td class='tr0td2'>"+players[p].age+"</td>";
            eorTableHTML += "<td class='tr0td1 eor' data-eor='"+players[p].eor_gk+"'>"+players[p].eor_gk+"</td>";
            eorTableHTML += "<td class='tr0td2 eor' data-eor='"+players[p].eor_fb+"'>"+players[p].eor_fb+"</td>";
            eorTableHTML += "<td class='tr0td1 eor' data-eor='"+players[p].eor_cd+"'>"+players[p].eor_cd+"</td>";
            eorTableHTML += "<td class='tr0td2 eor' data-eor='"+players[p].eor_wm+"'>"+players[p].eor_wm+"</td>";
            eorTableHTML += "<td class='tr0td1 eor' data-eor='"+players[p].eor_cm+"'>"+players[p].eor_cm+"</td>";
            eorTableHTML += "<td class='tr0td2 eor' data-eor='"+players[p].eor_wf+"'>"+players[p].eor_wf+"</td>";
            eorTableHTML += "<td class='tr0td1 eor' data-eor='"+players[p].eor_cf+"'>"+players[p].eor_cf+"</td>";
            eorTableHTML += "</tr>";
        }
        eorTableHTML += "</tbody></table><br/><br/></div>";
        $(eorTableHTML).insertBefore($(".main_content").find(".original-table"));

        var sortTable = new SortableTable(document.getElementById("table-eor"),
        ["String", "Number", "Number", "Number", "Number", "Number", "Number", "Number", "Number"]);

        getExtraData();

        $(".regularTab").on("click", function(e) {
            e.preventDefault();
            if (!$(this).hasClass("active")) {
                $(".eorTab").removeClass("active").attr("style", inactiveStyle);
                $(this).attr("style", activeStyle)
                $(".original-table").show();
                $(".eor-table, .eorToggles").hide();
            }
        });

        $(".eorTab").on("click", function(e) {
            e.preventDefault();
            if (!$(this).hasClass("active") && $(this).hasClass("loaded")) {
                $(".regularTab").removeClass("active").attr("style", inactiveStyle);
                $(this).attr("style", activeStyle)
                $(".original-table").hide();
                $(".eor-table, .eorToggles").show();
                $(".eor-exp, .eor-chem, .eor-energy").css("display", "inline-block");
            }
        });

        $(".eor-exp, .eor-chem, .eor-energy").on("click", function(e) {
            e.preventDefault();
            if (!$(this).hasClass("active")) {
                $(this).attr("style", toggleActive).addClass("active");
            } else {
                $(this).attr("style", toggleInactive).removeClass("active");
            }          
            updateTable();  
        });


        $(".eor-table").hide();

    }

    drawEorTable();
    
})();

// download chemistry and energy information

function getExtraData() {

    var eorRows = $("#table-eor tbody").find("tr");
    $("#table-eor").data("downloads", eorRows.length);    

    eorRows.each(function(i) {

        var nameCell = $(this).find(".left_align");
        nameCell.parent().attr("id", "eor_player"+i);

        var playerName = nameCell.html();
        
        var startPos = playerName.lastIndexOf("href")+6;
        var endPos = playerName.indexOf("\"", startPos);
        var playerUrl = playerName.substr(startPos,endPos-startPos);
        
        setTimeout(function() { getPlayer(playerUrl, nameCell.parent()) }, i*200);
    });

}

function getPlayer(url, row) {

    /*
    var date = new Date();
    var n = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    console.log("--- "+n);
    console.log("Downloading player data");
    */

    $.get(url, function(data) {

        var startPos = data.lastIndexOf("Che = Chemistry")+55;
        var endPos = data.indexOf("%", startPos);
        
        var chemistry = parseInt(data.substr(startPos, endPos-startPos), 10);
        row.data("chemistry", chemistry);

        startPos = data.lastIndexOf("Current energy")+16;
        endPos = data.indexOf("<", startPos);
        
        var energy = parseInt(data.substr(startPos, endPos-startPos), 10);
        row.data("energy", energy);
        

        $("#table-eor").data("downloads", parseInt($("#table-eor").data("downloads"), 10)-1);
        if (parseInt($("#table-eor").data("downloads"), 10) === 0) {
            $(".eor-spinner").hide();
            $(".eorTab").show().html("EOR View").addClass("loaded");
            updateTable();
        }
      
    });
}

function updateTable() {

    var exp = false, chem = false, energy = false;

    if ($(".eor-exp").hasClass("active")) exp = true;
    if ($(".eor-chem").hasClass("active")) chem = true;
    if ($(".eor-energy").hasClass("active")) energy = true;

    var eorRows = $("#table-eor tbody").find("tr");
    
    eorRows.each(function(i) {

        var playerExp = parseInt($(this).data("exp"), 10);
        var playerChem = parseInt($(this).data("chemistry"), 10);
        var playerEnergy = parseInt($(this).data("energy"), 10);

        $(this).find(".eor").each(function() {
            var multiplier = 1;
            var originalValue = parseInt($(this).data("eor"), 10);

            if (exp) multiplier *= playerExp*0.002+1;
            if (chem) multiplier *= playerChem*0.002+1;
            if (energy) multiplier *= playerEnergy*0.01;

            var newValue = Math.floor(originalValue*multiplier);
            $(this).html(newValue);
        });

        var maxValue = 0;
        $(this).find(".eor").each(function() {
            if (parseInt($(this).html(), 10) > maxValue) {
                $(this).parent().find(".eor").css("font-weight", "normal");
                $(this).css("font-weight", "bold");
                maxValue = parseInt($(this).html(), 10);
            } else if (parseInt($(this).html(), 10) >= maxValue) {
                $(this).css("font-weight", "bold");
                maxValue = parseInt($(this).html(), 10);
            }
        });

    });

    /*

    if (exp) {
        multiplier = (E4*0,002+1)
    }*/
}