// ==UserScript==
// @name         GYM
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Easy to see ratios for special gyms
// @author       You
// @match        https://www.torn.com/gym.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40821/GYM.user.js
// @updateURL https://update.greasyfork.org/scripts/40821/GYM.meta.js
// ==/UserScript==

var content = "gymroot"
var targetNode = document.getElementById(content);
var tenTrain = 24721;
var secondTrain = 64664;
var firstTrain = 137593;

var config = { childList: true, subtree: true, characterData: true};

var callback = function() {
    var georgeAct = $("#gymroot > div > div.gymDetailsWrapper___3VNUg > div > div.actionWrapper___3NfiR > div > div > button.button___3FsOI");

    for (var i = 1; i < 24; i++) {
        $("#gym-" + i).hide();
    }

    $("#gym-24").click(function() {
        georgeAct.click();
    })

    $("#gym-26").click(function() {
        georgeAct.click();
    })

    $("#gym-27").click(function() {
        georgeAct.click();
    })

    var text1 = $("#strength-val").text();
    var text2 = $("#speed-val").text();
    var text3 = $("#defense-val").text();
    var text4 = $("#dexterity-val").text();
    console.log(text1 + " " + text2 + " " + text3 + " " + text4);
    var gymJ = $("#gymroot > div > div.notificationWrapper___1qCTW > div > div.notificationText___3D79L > p:nth-child(1)");
    var gym = gymJ.text();
    var gym2 = $("#gymroot > div > div.gymContentWrapper___2DeUj > div > div > div > p");
    console.log(gym);

    $("#gymroot > div > div.gymContentWrapper___2DeUj > div > ul > li.dexterity___1YdUM.success___2Yd4r > div.propertyContent___1hg0- > div:nth-child(2) > button").click(function() {
        gymJ.text("Welcome");
        gymJ.append('<div class="metaldog"></div>');
        console.log("modifying text: " + gymJ.text());
        test();
    });

    test();
    function test(clicked) {

        if (gymJ.text().includes("Welcome") || clicked) {
            var arr = text1.split(",");
            var result1 = arr[0] + arr[1] + arr[2];

            var arr2 = text2.split(",");
            var result2 = arr2[0] + arr2[1] + arr2[2];

            var arr3 = text3.split(",");
            var result3 = arr3[0] + arr3[1] + arr3[2];

            var arr4 = text4.split(",");
            var result4 = arr4[0] + arr4[1] + arr4[2];

            var str = parseInt(result1,10);
            var speed = parseInt(result2,10);
            var def = parseInt(result3,10);
            var dex = parseInt(result4,10);

            var stats = [str,speed,def,dex];
            var maxStat = Math.max.apply(Math.max, stats);
            var statIndex = stats.indexOf(maxStat);

            var secondMaxStat  = secondMax(stats);
            console.log(secondMaxStat);

            var strtotal = str + speed;
            var deftotal = def + dex;
            var strdef = strtotal / deftotal;
            var defstr = deftotal / strtotal;

            console.log(strtotal + " " + deftotal + " " + strdef + " " + defstr);

            var ratio = 0;
            var prntStat = "";
            var eUsed = "";
            var combUsed = "";

            var mixed = 24;
            var highest = 24;
            var fadeSingle = "";
            var firstSingle = 0;
            var firstMix = 0;
            var secondMix = 0;
            var divStr = "#gymroot > div > div.gymContentWrapper___2DeUj > div > ul > li.strength___1GeGr";
            var divSpeed = "#gymroot > div > div.gymContentWrapper___2DeUj > div > ul > li.speed___1o1b_";
            var divDef = "#gymroot > div > div.gymContentWrapper___2DeUj > div > ul > li.defense___311kR";
            var divDex = "#gymroot > div > div.gymContentWrapper___2DeUj > div > ul > li.dexterity___1YdUM";
            var fadeMixed1 = "";
            var fadeMixed2 = "";

            // str/speed special combo
            if (statIndex == 0 || statIndex == 1) {
                if (statIndex == 0) {
                    // str
                    firstSingle = str;

                    fadeSingle = divStr;
                    highest = 27;
                } else {
                    //speed
                    firstSingle = speed;

                    fadeSingle = divSpeed;
                    highest = 29;
                }
                if (gym.includes("Frontline")) {
                    $(fadeSingle).fadeTo(0,0.2);
                }
                firstMix = strtotal;
                secondMix = deftotal;
                fadeMixed1 = divStr;
                fadeMixed2 = divSpeed;

                mixed = 26;
            }

            // def/dex special combo
            if (statIndex == 2 || statIndex == 3) {
                // defence
                if (statIndex == 2) {
                    firstSingle = def;

                    fadeSingle = divDef;
                    highest = 28;
                } else {
                    // dex
                    firstSingle = dex;

                    fadeSingle = divDex;
                    highest = 30;
                }
                if (gym.includes("Balboas")) {
                    $(fadeSingle).fadeTo(0,0.2);
                }
                firstMix = deftotal;
                secondMix = strtotal;
                fadeMixed1 = divDef;
                fadeMixed2 = divDex;

                mixed = 25;
            }

            ratio = firstSingle/secondMaxStat;
            eUsed = (firstSingle/1.25 - secondMaxStat) / secondTrain * 25;
            prntStat = "Sing e: " + eUsed.toFixed(0);

            combUsed = (firstMix/1.25 - secondMix) / tenTrain * 10;
            prntStat += " Comb e: " + combUsed.toFixed(0);
            gymJ.text(prntStat + " ||||| Sing:" + ratio.toFixed(3) + " comb:" + (firstMix/secondMix).toFixed(3)).css('color', 'black');

            if (gym.includes("George")) {
                $(fadeMixed1).fadeTo(0, 0.2);
                $(fadeMixed2).fadeTo(0, 0.2);
            }

            // balboas 25 (def+dex)
            // frontline 26 (str+spd)
            // gym 3000 27 (str)
            // mr. iso 28 (def)
            // total rebound 29 (spd)
            // elites 30 (dex)

        } else {
            return
        }
    }
}

var observer = new MutationObserver(callback);
observer.observe(targetNode, config);

var secondMax = function (arr){
    var max = Math.max.apply(null, arr), // get the max of the array
        maxi = arr.indexOf(max);
    arr[maxi] = -Infinity; // replace max in the array with -infinity
    var secondMax = Math.max.apply(null, arr); // get the new max
    arr[maxi] = max;
    return secondMax;
};



