// ==UserScript==
// @name         GOS scraper Alternate
// @namespace    https://www.gatesofsurvival.com
// @version      0.1
// @description  try to take over the world!
// @author       Opal
// @match        https://www.gatesofsurvival.com/game/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/28072/GOS%20scraper%20Alternate.user.js
// @updateURL https://update.greasyfork.org/scripts/28072/GOS%20scraper%20Alternate.meta.js
// ==/UserScript==
    extraButtonCode = "<div id=\"extra2\" class = \"classy\"><li class=\"btn2\">Opal's Addons</li></div>";
    outputButtonCode ="<div id=\"output2\" class = \"classy\"><li class=\"btn2\">---</li></div>";
    outputButton2Code ="<div id=\"output3\" class = \"classy\"><li class=\"btn2\">---</li></div>";
    $("#change_character2").after(extraButtonCode);
    $("#extra2").after(outputButtonCode);
    $("#output2").after(outputButton2Code);
    $("#extra2").click(function(){
        var textNodes = $("tr").children('*').contents();
        var arr = ["0"];
        var skillTitles = [];
        var skillValues = [];



        var transferIndex = 0;
        $.each(textNodes, function(index, value){

            var zoop = $(value);
            if (value.nodeType === 1 && (zoop.html().indexOf('Level') > -1))
            {
                arr.push(zoop.text());
                console.log(transferIndex);
                transferIndex=transferIndex+1;
                skillTitles.push(zoop.text());
            } else if (value.nodeType === 3 ){
                //&& (arr[arr.length-1].indexOf('Level') > -1)
                zoop = zoop.text().split(",").join("");
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
        console.log(skillValues);
        $("#outputform3").val((skillTitles.join("\t")));
    });




