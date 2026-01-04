// ==UserScript==
// @name         Travian Rallypoint filter
// @namespace    http://tampermonkey.net/
// @license MIT
//
// @version      0.7
// @description  Buildt in filter separating rally point entries for travian.
// @author       bbbkada@gmail.com
// @include      *://*.travian.*/build.php?*gid=16&tt=1*
// @include      *://*.travian.*/build.php?*&tt=1&gid=16
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/449795/Travian%20Rallypoint%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/449795/Travian%20Rallypoint%20filter.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function runMain() {
        var attacks = attackList.getElementsByClassName("troop_details");
        // alert(userHost + " : " + attackStatus);

        const resourceArray = [0,0,0,0,0,0,0];

        var returns = attackList.getElementsByClassName("inReturn");
        console.log("returns: " + returns.length);

        for (var r = 0 ; r < returns.length ; r++){
            var resString = "";
            var values = returns.item(r).getElementsByClassName("value");
            // var myBox = document.createElement("div");
            for (var res = 0 ; res < values.length ; res++) {
                resString = resString + values.item(res).innerText + " ";
                if (Number(values.item(res).innerText) >= 0) {
                   resourceArray[res] += Number(values.item(res).innerText);
                }
            }
        }

        console.log(resourceArray[0]);
        document.getElementById('rs1').innerHTML = resourceArray[0];
        document.getElementById('rs2').innerHTML = resourceArray[1];
        document.getElementById('rs3').innerHTML = resourceArray[2];
        document.getElementById('rs4').innerHTML = resourceArray[3];


        console.log("nr: " + attacks.length);
        for (var i = 0 ; i < attacks.length ; i++){
            // var myBox = document.createElement("div");
            // myBox.setAttribute("style", "width:10px;");
            // var attack = attacks[i].parentNode.getElementsByClassName("outAttack")[0].innerHTML.replace("(","");

            var abortButton = attacks[i].getElementsByClassName("abort");
            // var troopHeadLine = attacks[i].getElementsByClassName("outAttack");

            // attacks[i].style.display = "";

            if (abortButton.length < 1 && stoppableStatus == "on" ) {
                attacks[i].style.display = "none";
            } else if (!attacks[i].classList.contains("outAttack") && !attacks[i].classList.contains("inAttack") && attackStatus == "on"){
                attacks[i].style.display = "none";
            } else if (!attacks[i].classList.contains("outSpy") && scoutStatus == "on"){
                attacks[i].style.display = "none";
            } else {
                attacks[i].style.display = "";
            }
        }
    }

    function toggleFilter(){
        if (stoppableStatus == "on"){
            stoppableFilterButt.src = Images.stopOff;
            stoppableStatus = "off";
            GM_setValue(userHost + "_stoppablefilterstatus",'off');
            runMain();
        } else {
            stoppableFilterButt.src = Images.stopOn;
            stoppableStatus = "on";
            GM_setValue(userHost + "_stoppablefilterstatus",'on');
            attackFilterButt.src = Images.attackOff;
            attackStatus = "off";
            GM_setValue(userHost + "attackfiltstat",'off');
            scoutFilterButt.src = Images.scoutOff;
            scoutStatus = "off";
            GM_setValue(userHost + "scoutfiltstat",'off');
            runMain();
        };
    };

    function toggleAttack(){
        if (attackStatus == "on"){
            attackFilterButt.src = Images.attackOff;
            attackStatus = "off";
            GM_setValue(userHost + "attackfiltstat",'off');
            runMain();
        } else {
            attackFilterButt.src = Images.attackOn;
            attackStatus = "on";
            GM_setValue(userHost + "attackfiltstat",'on');
            stoppableFilterButt.src = Images.stopOff;
            stoppableStatus = "off";
            GM_setValue(userHost + "_stoppablefilterstatus",'off');
            scoutFilterButt.src = Images.scoutOff;
            scoutStatus = "off";
            GM_setValue(userHost + "scoutfiltstat",'off');
            // alert(userHost);
            runMain();
        };
    };

        function toggleScout(){
        if (scoutStatus == "on"){
            scoutFilterButt.src = Images.scoutOff;
            scoutStatus = "off";
            GM_setValue(userHost + "scoutfiltstat",'off');
            runMain();
        } else {
            scoutFilterButt.src = Images.scoutOn;
            scoutStatus = "on";
            GM_setValue(userHost + "scoutfiltstat",'on');
            stoppableFilterButt.src = Images.stopOff;
            stoppableStatus = "off";
            GM_setValue(userHost + "_stoppablefilterstatus",'off');
            attackFilterButt.src = Images.attackOff;
            attackStatus = "off";
            GM_setValue(userHost + "attackfiltstat",'off');
            // alert(userHost);
            runMain();
        };
    };

    var Doc = {
        New : function(tt,attrs){
            var newElement = document.createElement(tt);
            if (attrs !== undefined) {
                for(var xi = 0; xi < attrs.length; xi++) {
                    newElement.setAttribute(attrs[xi][0], attrs[xi][1]);
                }
            }
            return newElement;
        },

        Element : function(eid){
            return document.getElementById(eid);
        }
    }
    var Images = {
        stopOff : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFMAAAAeCAMAAABnqtKAAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQAAADIQGzIQHDQRHTQSHjUTHzcUHzcVIDgWIToYJDsZJTwdJz4dKD8eKUAfKkAgKkAgK0IhLEIiLUMjLkQkL0QlMEkqNUssN0wtN0wtOEwuOE0vOU8wOlAyPFI0PlQ2QFU4Qlc6RFg8RlxASV9DTGBETmBFT2JHUGNIUWRKU2VKVGdNVmhOV2lQWGtRWWtSWm1UXG1UXW9VXnBXX3BYYHFZYXNaYnRcZHRdZXVeZnZfZ3dgaHhhaHhhaXtja3tkbHxlbXxmbn1nb39obn5ocIBrcYJscoNtdINudYRvdoRwdoRwd4hzeYhzeoh0eoh0e4x4fo16gJB+hJJ/hpWCh5SCiZeEipeFi5iHjZqIjZqJj5uKkJyLkJ+Nk5+Pk56OlKCPk6CPlKCPlaCQlqGRl6OTmaWVmaSVmqWWm6eXnKeYnaiZmqqanqubn6mboKudoKucoaydoa2fo62fpK+gpa+hprChprCjqLGkqbSnqrSnq7SprLWprbWprraqrbaqrrirrbirr7msr7mtsLmtsbuvs72ytr6zt7+0uMK2tcC1ucC2ucS4uMS6vcS7vsi9vMe8wMi/wci/wsnAw83FyM/HydDJy9DJzNLKzdPLztTLzdTMz9TN0NbP0tnT1drU1tzW19zW2NzX2d3Y2d3Y2uHb2+Db3OHc3uPd3+Te2uPe4OTe4OTf4eTg4eXh4ubi4ufj5OTk5OXl5ejk4ejk5ejl5unm5+jo6Ovo6e3q6+/r7O/s7fHu6PDt7vHv8PPw7vTy6/Xx7/Px8vTz8/b08fX09Pb19ff29vX39/f6+vj29/v58/z59v389f/99v789/r4+Pn5+fv6+Pv6+fv7+vv8/Pz4+Pz7+P37+fz6+vz7+/38+P38+v38+//++/38/P39/f39/v7+/P7+/f3+/v///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB+JBcAAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGHRFWHRTb2Z0d2FyZQBwYWludC5uZXQgNC4xLjVkR1hSAAADK0lEQVRIS7WW53sMYRDAmQhCcDpRc3qLTnSi1yCiC6JEd3qILmp0okUQohNRQxC9hyBOpFx2ZWf+jpj33eWSC8/jw9582Xd+O/O7d2/ufW6L5XPcNC+Ejp1JSUZuTghnUtItIzMphPOW6U5jYWboTjIrpM2dThVVA4sQSRHyHyUuTkI07vFKNriS/yhx3Sez2HhxV+WPV3RidOikEIgEo8Rjg0Fkk7T9+T4Rl1nAwyeelDWZ+F2UCYV0KJmqJAVBJIgF5xbp/F0ibc4ZqaXDfr4NP4V3INYhctnx8x1feD86KQA2SScTy7qCJdLmdB6BaLsd6fRICJz7mGjHuPHbkOxTDx8MsqWodKTn81nBBxjEzwlclEK8TzUsaC/bLBHctH106FXhcHV+qdzkikIY1Rladr5DrYBjLKnW5nytlUy2stV5EUpnAcY19lEpEupzHkxkWatQV78AKH/pL868A/Wgx0mkaxCn0eLSL4iml3lhtzZ5Q69KLtVssJVoWEOyX0dMhGjaAquIgurkkSUC59Xih/cY8RcnarSiWqkYdp7RKKA1k7MQi9ZJvGg0RLNV4Ws48IzORc2DPdoW8X3ugocaz6hf9dCQEJ8WDIo6P6n3aw4STgf5dWGSCPtU60SedLvuDltVBlHwSO0EfYayc7Mn59FwRauwltpWbO/fq/9sIZE2p5MwTSX/DpgAcURDGzA4DJfZyeejbhDJfc4ol7bS6zUh7MbIEpwvBxXZObwZqtn6L1fanM6wyee1/Z4zc59C4DPaD8vfH+3QJ0ezwprc+XD6hw16JxyvMTpnNRyjabATN0LHixd8ByNWWE+HYP3HD8dOFHVmxDTlQY7RMhz9AGJojjeA/5tvirWNL3itIMdCGAjQDb8pLQH6wh7aBKMA2r5EhAjNsaQSQO0BfIwKO5HP1s0zn3Pysin9XjKmEj2Qp806Ie82pSPZgO69F0B58pVLkDD17mvRxISbUm4I4upETBebF8HD1X4T6xSd2Lz/WaKHTqTtj1PJNG5yZGXyc+gEpJOyFhT/Z4kRkkibc0amhLS5z2luuOW/2C3vDO54tzH7HSw//xcxcgIMIduzwAAAAABJRU5ErkJggg==',
        stopOn : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFMAAAAeCAMAAABnqtKAAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQAAADIQGzIQHDQRHTQSHjUTHzcUHzcVIDgWIToYJDsZJTwdJz4dKD8eKUAfKkAgKkAgK0IhLEIiLUMjLkQkL0QlMEkqNUssN0wtN0wtOEwuOE0vOU8wOlAyPFI0PlQ2QFU4Qlc6RFg8RmR+EVxASV9DTGBETmBFT2JHUGNIUWRKU2VKVGdNVmhOV2lQWGtRWWtSWm1UXG1UXW9VXnBXX3BYYHFZYXNaYnRcZHRdZXVeZnZfZ3dgaHhhaHhhaXtja3tkbHxlbXxmbn1nb39obn5ocGqFEnaUFIBrcYJscoNtdINudYRvdoRwdoRwd4hzeYhzeoh0eoh0e4x4fo16gJB+hJJ/houvGJnAGprAHJrAHZ7DJZ7DJrnUYpWCh5SCiZeEipeFi5iHjZqIjZqJj5uKkJyLkJ+Nk5+Pk56OlKCPk6CPlKCPlaCQlqGRl6OTmaWVmaSVmqWWm6eXnKeYnaiZmqqanqubn6mboKudoKucoaydoa2fo62fpK+gpa+hprChprCjqLGkqbSnqrSnq7SprLWprbWprraqrbaqrrirrbirr7msr7mtsLmtsbuvs72ytr6zt7+0uMK2tcC1ucC2ucS4uMS6vcS7vsi9vMe8wMi/wci/wsvfitTln8nAw83FyM/HydDJy9DJzNLKzdPLztTLzdTMz9TN0NbP0tnT1drU1tzW19zW2NzX2d3Y2d3Y2uHb2+Db3OHc3uPd3+Te2uPe4OTe4OTf4eTg4eXh4ubi4ufj5OTk5OXl5ejk4ejk5ejl5unm5+jo6Ovo6e3q6+/r7O/s7fHu6PDt7vHv8PPw7vTy6/Xx7/Px8vTz8/b08fX09Pb19ff29vX39/f6+vj29/v58/z59v389f/99v789/r4+Pn5+fv6+Pv6+fv7+vv8/Pz4+Pz7+P37+fz6+vz7+/38+P38+v38+//++/38/P39/f39/v7+/P7+/f3+/v///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACtDN+MAAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGHRFWHRTb2Z0d2FyZQBwYWludC5uZXQgNC4xLjVkR1hSAAADPUlEQVRIS7WW6VtNURTGWYkQXTOZr3nMrMzzPIbM80yGzC6KlFnGRJkyJWPmORQhs8gQ6krpOkdnrb8ga597PtSJ5+nD6f1w917vXvt39tnr7ufsAlmse8ZJ4JgZG6vFxkgwY2OjtcggCWb04fHGaaRgMvjQKOPUi3n5yCRjlJMpo6z5QiLI5eQhRcckRG2Me+oEvZOHFP062YuMEqMyP14Si2Cp6ZqTwwgCLcVhs+aIFN1+Iq4xgYNrFEkBafhDpAmEypDSZNXJbgSB6HBsUplair5GspPPn/f+Z/ABRNpEmjrjzwdueD12J5uxVWWyY9qYLUXPPAbhVivS2WHgufgZ0e7JU3YiWWcfPehliZfpWOdXCyaGsRG1yHNFPPE6ZR+v/UwzBfKkXSO8b4hH6JnfytS/LhEGu0MT9wfUFFiTSDY34rZyHFmKV+CON10AmFzPVaYgqMHxRCLTBonau3WHklf/wcwMqw6dTiPdhPMKrXR6TTS32GuruX4CvS28WrHADqLBdch6C/EuhNN2WEfkVTWTTIG4pDK/vMNQZozWMVEhv/JFIph5TqHuzdi5AJFons6dugMVS1lu/YFrdDF4CYQo28V+7oUnCteoZwXvWbNcG7MxLhfzi/yoUn/BtJFbO3buwgHZPI0r3bKjzVKOjWB4KreFboOYuc2R43C4rrhsoBalWnl06bOQjTE6JmGSTB6t8TacJxpUm42jcI2ZfD6qeZG6znklktYWfUcI+zCoEMe+ICMzhzRE+Zf6J9Pvp8+MS0qo4/zfL8DzJYWCb+Lx1t0yFDME/F4KZ39aoOvtkxVHZKyHEzQH9uAWaHPlcs0BiC6b6Ahs+vzxxKnczNSIBlzICUqqrSdABC1yBvBISJHMzWtCUT+yLYd+AB0wRWoC0ANCaCsMB2jxBhECFduq0gBV+vLByslEPlv3zn3NyPxFyTFx+InosXrazFMz71MykgUoJlEY0vPvnIKEnx6+E5PY4Unxd4SjZyImix0R4uIq4lc45pl2x+L83xS7VEfHlNK0QVZ6Gr+H3QGVSenLCv43RZNw9DUyQjmYhinfmPwtjh7b2zDVsn/f8+HOkB93G6PvYFlZfwH3T2a9zEkdVQAAAABJRU5ErkJggg==',
        attackOn: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFMAAAAeCAMAAABnqtKAAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQAAADMQHDQRHTURHjQSHjgWITsYJDsZJTwaJjwbJz4dKD8eKUAfKkEhLEIiLkcmMUcnMksrNkssN0wtN0wtOEwuOE0vOU8wOk8xO08xPFAzPVM0P1Q2QFc6RFg8RmR+EV1CS19DTGBFT2FGT2JGUGVLVGdNVmhOV2lQWGtRWWxTXG1UXW9VXm9WX3NaYnNbY3RcZHVeZndgaHhhaHliantja3tnbnxmbn1nb39pcGqFEnaUFIBqcYRwd4hzeoh0e4l1fIp2fY16gY98g5B9g5B+hJF/hYuvGJnAGprAHJrAHZ7DJZ7DJrnUYpOAh5OBiJSBiJeEipeGjJiGjJqJj56Nkp6Nk5+Pk5+OlKCPlaGRl6KSmKSVmqWWm6eYnaian6mboKudoa2eo6+gpa+hprCip7Snq7SorLaqrressLirsLissLissb+zt7+0uMC1uMG3usO5u8S6vcS7vsi/wsvfitTln8vBxMzDxszEx8/HydLLzdPLztTNz9jR097X2d3Y2d3Y2uDa3OHc3uTg4eTg4ufj5OTk5OXk5ejk5enm5+jo6O3q6+/s7e/u7/Hv8PPx8vTy8vb19ff29vj3+Pj4+Pv6+/z8/Pz9/f7+/v///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABr1bKwAAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGHRFWHRTb2Z0d2FyZQBwYWludC5uZXQgNC4xLjVkR1hSAAACQklEQVRIS7WW+XdLURDHDZHYSmntRKtFQ4lSaunitsQeqZ0oae2ktLHX1qAVUrvWnflnY+bmxskikeO8fH949833znzem/vuOe9OS7HeOyfBMTOZtLEzEmYymbCRQxJm4vFx53RQmAx+dMg57WFeBZnkjCrPRETriyQocMpIyWVq1HZKhK8p39FZhpphjMKUUsw+aBdneJjvWy6Jw9NZzMZymX/6QGxY4Z5ip62eo+kBcdJMm6K8xsgrKs2Mw0u4qfHs8upgMAj14Xv4pq8z8llS+tXVSVLLEKNniG4HTsZtzT+Zp0EvbNa4Y/5cn88HNf6BOEDv2sW/9E8vAGwntQCHYIBCEOnpsjV/ZbJpZwlXd+srkCDcuJ4j6GXnHepxGEFVw8YgqdnP4Lymup3ZRcI8XJT5At5qgjChfzNHrnNSMHr/MsSwaZdJUABdTOieE/mSyzyWw8zWfvB43O46otYWjjzMpC3Q1gEx8naaBDULeJbo2irPXWNkdCR/Pa1PVLsteifaA690uzCrmHnd/Z3fPKb9W02CWvkEQua7n6g2hlGp9XwIY/KAeQE8sGgiTo1++nEDnusL3PstGKIRF6kmvAiDFNbUusQWpXvPZWapY50Z9tXS05nQzPsfTtEGgN3cO4VcUNVPapMs0HgDwNIHJjejokx+Z6MJoskxHr/J5euU8Yg+2FH08ZO9yahgf1pfJEGBU0ZKif0pS1PolJFSvPf/Vw7TMVWMyf/ixNG9jmlN+v9egTNDJc42Tp/BUqnf6iWilqzNrF8AAAAASUVORK5CYII=',
        attackOff : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFMAAAAeCAMAAABnqtKAAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQAAADMQHDQRHTURHjQSHjgWITsYJDsZJTwaJjwbJz4dKD8eKUAfKkEhLEIiLkcmMUcnMksrNkssN0wtN0wtOEwuOE0vOU8wOk8xO08xPFAzPVM0P1Q2QFc6RFg8Rl1CS19DTGBFT2FGT2JGUGVLVGdNVmhOV2lQWGtRWWxTXG1UXW9VXm9WX3NaYnNbY3RcZHVeZndgaHhhaHliantja3tnbnxmbn1nb39pcIBqcYRwd4hzeoh0e4l1fIp2fY16gY98g5B9g5B+hJF/hZOAh5OBiJSBiJeEipeGjJiGjJqJj56Nkp6Nk5+Pk5+OlKCPlaGRl6KSmKSVmqWWm6eYnaian6mboKudoa2eo6+gpa+hprCip7Snq7SorLaqrressLirsLissLissb+zt7+0uMC1uMG3usO5u8S6vcS7vsi/wsvBxMzDxszEx8/HydLLzdPLztTNz9jR097X2d3Y2d3Y2uDa3OHc3uTg4eTg4ufj5OTk5OXk5ejk5enm5+jo6O3q6+/s7e/u7/Hv8PPx8vTy8vb19ff29vj3+Pj4+Pv6+/z8/Pz9/f7+/v///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACMVt0QAAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGHRFWHRTb2Z0d2FyZQBwYWludC5uZXQgNC4xLjVkR1hSAAACJ0lEQVRIS9WW61fSQRCGe4ugm2Vp90LTSsoiy7K8tFoQdi+y0O6FpXSzK5VGod21nfmXaXbZw6FA5Jx+fOj9wO68M/McZg7nsItyog/eyeCEmc262BsZZjabcZFHMsyM50x38VJ5JnslS/vfmETkbCMTlDhVlPzJ1KRdyohelzi6yFBLrFFaUok5hG7jjI/LveOKcSRdxGytllmYg6hli39OnK5miRZHjJNnuhIVtMZfTZWZabzEbU3nN9dHo1E0xx/Q26HexGdTMqyuz7LaRJQ8x3w3cjrtehZknoVe267p8OqVoVAIDeGRNDC4Y/0v/TMI4BCrNTSGEY4hMdDnesoyxXRZpu39+hoyTHt2SYRBcd6TnsIEqQYxRlktf4aLmpuOFDdVZr7AO82IM4X3SeS7YBrePLyKFLUdtQUK6BNC/4rEl0rMYp1AIOD3NzF3dkgUECbvR1cPUhzstQVqGSTLfGNb4L41CrK0on06m7nxYPJecgCvdLdh1gnzpv+7fPOUDh+wBWrrE8SkXtOpemtYVZr9MSZNelWETq6bTnNrmH/cwnN9SWa/gzGe8LFqo8sY5bjmzg2uaYHZe3ba43gjP12Kdvn94wzvBo7J7BzzoW6Y1V6zoKkWYOMjW1uQpZXbp9vCNPPspJzfzMfXOesxf3Sn0acZdynI0srtM7+aEqeKknn36VZT4lRRMv/s/yBLqx3TW9Xkv7gmb4ZavG28foPlcr8B8mLP+3uuEiIAAAAASUVORK5CYII=',
        scoutOn : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFMAAAAeCAMAAABnqtKAAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHLUExUReTk5Ojo6OXk5dTln7nUYouvGMvfipnAGmqFEv////7+/vz9/czMzNfX15qamhISEhgYGAAAACEhIdbW1rW1tY6OjgYGBpCQkPz8/J6entHR0VtbW01NTcbGxsPDw/Ly8pGRkXNzc6KiotDQ0JSUlHJycpaWloeHhzs7O1hYWIyMjCMjIx8fH5eXl52dnXBwcOrq6vn5+RUVFT09Pd7e3klJSXp6ejQ0NFpaWi0tLS4uLpKSkiUlJWBgYFlZWVZWVhERERAQEEpKSi8vL1dXV0xMTGJiYpiYmLq6uioqKsvLy1RUVLe3t/r6+tjY2I+Pj0FBQQgICJrAHJycnB0dHcrKyicnJ319fdnZ2UJCQl5eXjAwMKenp57DJubm5mZmZomJibOzs1BQUE9PT1xcXFFRUSIiIprAHVJSUk5OTjMzM29vb9TU1L6+vg0NDRQUFEZGRoSEhNzc3Lm5uQQEBIuLi4qKihkZGcTExLa2tmdnZzg4OFNTU+Li4vT09N3d3fX19YGBgQEBAW1tbSYmJjExMXx8fK2trc/Pz7CwsGtra8DAwAcHB+Hh4dLS0v39/ePj4/Pz89vb2+Xl5fDw8J7DJXaUFGR+EQAAABg5gJYAAACZdFJOU///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////APNecBsAAAAJcEhZcwAADsIAAA7CARUoSoAAAAIdSURBVEhLtZb5U9NQEIDbiscGoa5aRFFahFrUgkJB8WhBDkEqXlCUGy8UFQ8EVEDlEhUVRVDz57r78qRN0wmM8/L98PbIyzfJJjOJSydc6hA6XXe7Za0GdrrdHlkpgp2eLVnq2MpOYtt2dewQl+qYE9TgvFPTNNlnTIWAOtYtlo7Zma1ly0MG2s4cmW0aMtg6c727cPceWVjZ65NJKpmcKfeh5e2D/P0HZGWl4KBMktAc7J2HsNBI/IGiwxSKS4JHKBSGaCk9CseOhwNlAOUnAid5k2BDZ0VlpIpjVbj61OkiCGFN8MxZgHPnqReNQW3dhfoGaGyKXmzmXYJMTn5sSVouYawVIB6h/HKbtwTgCl5dd8K1ekqu5/LOfwjnDTsnQHtHXgI6b3Lairdo7Yoazm5yVscpaerp5aMS4ewzOa30hwfAO8jZbeyn9c5dw3mPnPcLuB+qHEpwTPIgfZ6yv87DYXj0mJMnOELr0yCUP6NYQ86YcNJsnhtRsME8fS9G4eXYOEy8eg1vJmFq+u07H76HEeydmZ0j5/yCfzSH7vzDsDwh4zMyk4jgGC5SMokY/gifShG9n6mcR4wvkfPLV5z+toB1UzzoFOycAK7lNhG//xChwi8CaCtGXPlJy+qaUSSxvJ+yv0l4VHS/smJs50lb+YT0TlqDriHtJPt5/i8mpzIcc9K32PPrtzL+GN93B/4ZnPi3Uf0Pput/AUCzr1F6tAFoAAAAAElFTkSuQmCC',
        scoutOff : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFMAAAAeCAMAAABnqtKAAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGtUExUReTk5Ojo6OXk5f////7+/vz9/czMzNfX1/3+/v39/ZqamhISEhgYGAAAACEhIdbW1rW1tY6OjgYGBpCQkPz8/J6entHR0VtbW01NTcbGxsPDw/Ly8pGRkXNzc6KiotDQ0JSUlHJycpaWloeHhzs7O1hYWIyMjCMjIx8fH5eXl52dnXBwcOrq6vn5+RUVFT09Pd7e3klJSXp6ejQ0NFpaWi0tLS4uLpKSkiUlJWBgYFlZWVZWVhERERAQEEpKSi8vL1dXV0xMTGJiYpiYmPz7+7q6uioqKsvLy1RUVLe3t/r6+tjY2I+Pj0FBQQgICJycnB0dHcrKyicnJ319fdnZ2UJCQl5eXjAwMKenp+bm5mZmZomJibOzs1BQUE9PT1xcXFFRUSIiIk5OTjMzM29vb9TU1L6+vg0NDRQUFEZGRoSEhNzc3Lm5uQQEBIuLi4qKihkZGcTExLa2tmdnZzg4OFNTU+Li4vT09N3d3fX19YGBgQEBAW1tbSYmJjExMXx8fK2trc/Pz7CwsGtra8DAwAcHB+Hh4dLS0uPj4/Hx8fPz89vb2+Xl5e/v7wAAAEt1LQIAAACPdFJOU/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8A8W0UKQAAAAlwSFlzAAAOwgAADsIBFShKgAAAAhhJREFUSEu1lmlTE0EQQBN6kCO0GkRRCEgMaAQhoCgmIogoBMQjXoAnh+KByO2BgIonIPub6d7pwg2bSlJk91Vl+tjZVzW9HzIeg/A4h6kzDK9Xamdgp9ebJ5VDsDPPcadrgFOIj5FO7oiPkU7uiI8BUEpJm+HC1sliS7IzX+XLI43aVyCZRhVCEf3SwQbxMTZnsa8E9x+Qws5BvyRWUjkt51Clh6Ds8BGp7JQfleQ/NIf0zmNYoZPKQFU1heM1wRMUKkK01NbByVPhwGmA+obAGd5kktHZ2BRp5tgcbjl7rgpC2Bo8fwGg7SL1ojG41H65oxOudEWvdl/jbUwqp/nZdrjeg7FegHiE8r5+Xw3ADRzYccLNDkpuFbOJdzOZnQC375Qm4O49TnvxPq0Potr5kJwtcUq6Bof4qZDCaWc4/Ah8jzl7gsO0Pn2mnc/JOVLO/VDTaIKjBfEx5jylLSg1MgbjLzh9iRO0vgpC/WuKreSMmU6azRsdTTKc3f92Et5NvYfpmVmYm4eFxQ8f/fgJJnDo89IXci6vVE4W0MlXx+SFLM6eiOAUfqVkHjH8Db7XIvrWqFxGjP8g589fuPh7BdsXeNBWxMdIx4LnT78Zi/6aoXFdn0Jt6LixScu/reTPSoiP2T1PPQfrG/R41xYq7B3xMcnz1KOxdbLYkv7se0R8jHRyR3wu4MZ/sSt3BjfuNk7fwQxjG+owWaZvdkTjAAAAAElFTkSuQmCC'
    };
    var attackList = document.getElementById('build');
    //var filterContainer = attackList.getElementByClassName("filterContainer")[0];

    function getUserId(){
    var navi = document.getElementById("sidebarBoxActiveVillage");
        var navi_p = navi.getElementsByClassName("playerName")[0];
        //var profile_link = navi_p.getElementsByTagName("a")[1].innerText;
        // alert(profile_link);
        return navi_p.innerText;
    };

    var user_id = getUserId();
    var userHost = window.location.hostname.split(".")[0]+"_"+user_id;
    var attackStatus = GM_getValue(userHost + "attackfiltstat");
    var stoppableStatus = GM_getValue(userHost + "_stoppablefilterstatus",'off');
    var scoutStatus = GM_getValue(userHost + "scoutfiltstat",'off');

    var stoppableFilterButt = Doc.New("img",[['src',Images.stopOff],['width','83px'],['height','30px'],["id","stoppableFilterButt"]]);
    var attackFilterButt = Doc.New("img",[['src',Images.attackOff],['width','83px'],['height','30px'],["id","attackFilterButt"]]);
    var scoutFilterButt = Doc.New("img",[['src',Images.scoutOff],['width','83px'],['height','30px'],["id","scoutFilterButt"]]);

    if (stoppableStatus == "on") {
        stoppableFilterButt.src = Images.stopOn;
    }
    if (attackStatus == "on") {
        attackFilterButt.src = Images.attackOn;
    }
    if (scoutStatus == "on") {
       scoutFilterButt.src = Images.scoutOn;
    }

    var resDiv = document.createElement('div');
    resDiv.className = "inLineIconList resourceWrapper";
    resDiv.setAttribute("style", "position:absolute;left:27px;top:160px;height:20px;z-index:99;");
    //resDiv.innerHTML += "Returning resources: &nbsp;";
    resDiv.innerHTML += "<div class='inLineIcon resources'><i class='r1'></i><span id='rs1' class='value'></span></div>";
    resDiv.innerHTML += "<div class='inLineIcon resources'><i class='r2'></i><span id='rs2' class='value'></span></div>";
    resDiv.innerHTML += "<div class='inLineIcon resources'><i class='r3'></i><span id='rs3' class='value'></span></div>";
    resDiv.innerHTML += "<div class='inLineIcon resources'><i class='r4'></i><span id='rs4' class='value'></span></div>";

    var cntDiv1 = document.createElement('div');
    cntDiv1.setAttribute("style", "position:absolute;left:27px;top:125px;width:83px;height:30px;z-index:99;");
    cntDiv1.appendChild(stoppableFilterButt);
    attackList.appendChild(cntDiv1);

    var cntDiv2 = document.createElement('div');
    cntDiv2.setAttribute("style", "position:absolute;left:117px;top:125px;width:83px;height:30px;z-index:99;");
    cntDiv2.appendChild(attackFilterButt);
    attackList.appendChild(cntDiv2);

    var cntDiv3 = document.createElement('div');
    cntDiv3.setAttribute("style", "position:absolute;left:207px;top:125px;width:83px;height:30px;z-index:99;");
    cntDiv3.appendChild(scoutFilterButt);
    attackList.appendChild(cntDiv3);

    attackList.appendChild(resDiv);

    //villaLinks[i].parentNode.parentNode.insertBefore(villaImg, villaLinks[i].parentNode.parentNode.getElementsByTagName("A")[0]);
    stoppableFilterButt.addEventListener("click",function(){toggleFilter()},false);
    attackFilterButt.addEventListener("click",function(){toggleAttack()},false);
    scoutFilterButt.addEventListener("click",function(){toggleScout()},false);

   var crtPage = window.location.href;

    runMain();
})();