// ==UserScript==
// @name         GOS scraper
// @namespace    https://www.gatesofsurvival.com
// @version      0.70
// @description  try to take over the world!
// @author       Opal
// @match        https://www.gatesofsurvival.com/game/index.php?page=main
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36422/GOS%20scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/36422/GOS%20scraper.meta.js
// ==/UserScript==
    extraButtonCode = "<div id=\"extra2\" class = \"classy\"><li class=\"classy\">Opal's Addons</li></div>";
    outputButtonCode ="<div id=\"output2\" class = \"classy\"><li class=\"classy\">---</li></div>";
    outputButton2Code ="<div id=\"output3\" class = \"classy\"><li class=\"classy\">---</li></div>";
    $("#logout").after(extraButtonCode);
    $("#extra2").after(outputButtonCode);
    $("#output2").after(outputButton2Code);
    $("#extra2").click(function(){
        var textNodes = $("#page > center table[width='80%'] tr").children('*').contents();
        var arr = ["0"];
        var skillTitles = [];
        var skillValues = [];



        var transferIndex = 0;
        $.each(textNodes, function(index, value){

            var zoop = $(value);
            var zoopText = zoop.text().trim();
            if (value.nodeType === 1 && (zoop.html().indexOf('Level') > -1))
            {
                arr.push(zoopText);
                skillTitles.push(zoopText);
            } else if (value.nodeType === 3 && zoopText !== '' && zoopText !== '\n'){
                //&& (arr[arr.length-1].indexOf('Level') > -1)
                console.log(zoopText);
                zoop = zoopText.split(",").join("");
                var maxValue = /\s\d+\s(?!\/)/;
                var found = zoop.match(maxValue);
                if (found){
                    zoop = found[0];
                }
                skillLevel = zoop.replace(": ","");
                arr.push(skillLevel);
                skillValues.push(skillLevel);
            }
        });
        var outputForm = "<form><input type = \"text\" id=\"outputform\" value=\"\">";
        var outputForm3 = "<form><input type = \"text\" id=\"outputform3\" value=\"\">";
        arr.splice(0, 1);
        var output = skillValues.join(",");
        $("#output2").html(outputForm);
        $("#output3").html(outputForm3);
        $("#outputform").val((skillValues.join("\t")));
        console.log(skillTitles);
        $("#outputform3").val((skillTitles.join("\t")));
    });




