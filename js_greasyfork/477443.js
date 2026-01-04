// ==UserScript==
// @name         Travian Report filter
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.1
// @description  Buildt in filter to hide raid entrys in report view.
// @author       bbbkada@gmail.com
// @include        *.travian.*/report*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=travian.com
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/477443/Travian%20Report%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/477443/Travian%20Report%20filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function runMain() {
        // var filterRows = reportList.getElementsByClassName("filterContainer")[0];
        // var attacks = attackList.getElementsByClassName("troop_details");
        // alert("nu kör vi");

        console.log("nr of reports: " + reportRows.length);
        for (var i = 0 ; i < reportRows.length ; i++){
            // var myBox = document.createElement("div");
            // myBox.setAttribute("style", "width:10px;");
            // var attack = attacks[i].parentNode.getElementsByClassName("outAttack")[0].innerHTML.replace("(","");

            var insideLinks = reportRows[i].getElementsByTagName("a");

            if (insideLinks.length > 2 && insideLinks[2].innerHTML.indexOf("attack") == -1 && attackStatus == "on" && (i > 0 || i > (reportRows.legth-1))){
                reportRows[i].style.display = "none";
            } else {
                reportRows[i].style.display = "";
            }

        }
    }

    function toggleAttack(){
        if (attackStatus == "on"){
            reportattackFilterButt.src = Images.attackOff;
            attackStatus = "off";
            GM_setValue(userHost + "_reportattackfilterstatus",'off');
            runMain();
        } else {
            reportattackFilterButt.src = Images.attackOn;
            attackStatus = "on";
            GM_setValue(userHost + "_reportattackfilterstatus",'on');
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
        attackOn: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFUAAAAeCAMAAABqtKLHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAH7UExUReTk5Ojo6OXk5dTln7nUYouvGMvfipnAGmqFEv////7+/vz9/eLi4uDg4Nra2ru7u3x8fAQEBP39/aioqC0tLYWFhVhYWDs7O1FRUWdnZwkJCWpqahISEpeXlwAAANnZ2TU1NU9PT9TU1Pz8/M3NzS4uLkVFRYeHh3BwcJiYmHl5eaampmhoaN3d3ZKSknd3d52dnfX19YaGhuHh4ZOTk25ubpubm4KCgry8vIyMjMnJyYODg2tra8LCwicnJxQUFHp6ekRERDg4OCsrKxoaGq+vrwoKCmlpadDQ0Dw8PE5OTggICObm5gMDA15eXkJCQkNDQxMTE/Dw8Kqqqu7u7rCwsFVVVaurq4iIiN7e3vn5+SQkJJaWlpCQkOzs7GxsbNfX1/Hx8bS0tGNjY6SkpHV1dSEhIZrAHCkpKTIyMn9/fzk5OX19fd/f321tbcHBwefn55SUlBEREQsLC6enp9bW1p7DJi8vLzc3N2RkZMjIyD8/P1dXV2ZmZvLy8lxcXPT09Li4uEZGRprAHTY2Nnh4eCgoKOrq6r+/v66urqysrNXV1T09PUdHR8TExJ6enktLS5qamrKysrW1tZWVlWJiYgEBAYGBgRAQEFJSUiAgIFNTU0xMTFZWViMjIwcHB/r6+vj4+OXl5fPz8+3t7Z7DJXaUFGR+EQAAAMnUu8gAAACpdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wD7b3sWAAAACXBIWXMAAA7CAAAOwgEVKEqAAAACVElEQVRIS72W51sTQRCH72L9BYgIJmDAESwEQUADdgVFJaiIBRQsqKAiIgpWomiCgr333tv9mc7sro9IIn7w4ntPdmd35t7nnsl+WMtxHMtVWOhYjm2bpWuw1bY9ZuEebPWMG+8qE8RqWRMnucpk/b0ps8I1/oPVy48LeH+3pvGDdEsyGT5gCv+EzKl6TkZWtgmm+U0AliRaAzmSyZ0OBPNUETLz9ZyMGTRTBzSm1RsokEwhW2fNVkVjWjHHzH+zzpVMEVtDxRzMKymdL9ay8ooFkgAWhrP8YVRWLaqygcVLeGdpeJlPrMtXrFzFy6TWank1h601q4E11bVr17F1fV1FhCKSQT1t2LipYXPjlq3btqOJmrGDcncSW1uoNSR/wSirnAFvgBTa2kK7sLuArXv2Am20T1v383gAaKcOZS06CBxi6+FOSYv1SKK1q4k5qq3dx7iqJx/H6URrqJh65aV66pPJ13GSSpX1lJyD036coZKzkknDuZFWRaBfxqi2njfWCzRQeLHxUkxS2hqneERbB8lYcfkK9UgFhkb3FYFh2R/Q1qvXOGbrdbohuwplvcmtgfnWYDnvihW4Rbf/0Nc7kr6rrffoPrKJ+/qgsw/tDyWjrY/oMZ4Ya7y/Mvb0mR9dzeiljASrQlvlvLIVz+teRNvYWvaSXtFrVaA78IZq3hprepSC3bV+5NG792FVkmj9xQc18qH8qIJPn9X0k5jeVa3+omtiDbJgEs6rCyTrq0n9A8n66gYjrW6SQqvt8Xz95ibf1X0gJbeM1NyIUnB7c5wf+DbRXo8c5DQAAAAASUVORK5CYII=',
        attackOff : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFUAAAAeCAMAAABqtKLHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHXUExUReTk5Ojo6OXk5f////7+/vz9/eLi4uDg4Nra2ru7u3x8fAQEBP39/aioqC0tLYWFhVhYWDs7O1FRUWdnZwkJCWpqahISEpeXlwAAANnZ2TU1NU9PT9TU1Pz8/M3NzS4uLkVFRYeHh3BwcJiYmHl5eaampmhoaN3d3ZKSknd3d52dnfX19YaGhuHh4ZOTk25ubpubm4KCgry8vIyMjMnJyYODg2tra8LCwicnJxQUFHp6ekRERDg4OCsrKxoaGq+vrwoKCmlpadDQ0Dw8PE5OTggICObm5gMDA15eXkJCQkNDQxMTE/Dw8Kqqqu7u7rCwsFVVVaurq4iIiN7e3vn5+SQkJJaWlpCQkOzs7GxsbNfX1/Hx8bS0tGNjY6SkpHV1dSEhISkpKTIyMn9/fzk5OX19fd/f321tbcHBwefn55SUlBEREQsLC6enp9bW1i8vLzc3N2RkZMjIyD8/P1dXV2ZmZvLy8lxcXPT09Li4uEZGRjY2Nnh4eCgoKOrq6r+/v66urqysrNXV1T09PUdHR8TExJ6enktLS5qamrKysrW1tZWVlWJiYgEBAYGBgRAQEFJSUiAgIFNTU0xMTFZWViMjIwcHB/r6+vj4+OXl5fPz8+3t7QAAAL8gRMoAAACddFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wDL/LxMAAAACXBIWXMAAA7CAAAOwgEVKEqAAAACRUlEQVRIS7WW91MTURDHCd8DIoIJGHAFC0EQ0IBdQVEJKGIBBQsqqCCiYCOKJvZesfeWP9bd99Zxxlzwh9x9ZvLK7t5nbjZv5l5emsnzEiNMpwMB3XuFWAOBfN15hljzfbD6CLxDjYJGvECNgka8QI0C4DiOhnOBHWoUgAKnAIXmnYuCwBz+CcVz7exGSaku5oV0wRYXa7hMMuXzgUiFKUJxpZ3dWEAL7YJmtTrhKslUs3XRYlM0qxVLdP6fdalkatgareXFsrr65WJtaGxaIQlgZawkFENzy6qWALB6DUfWxtYFxbp+w8ZNvHW1tsqjZWxt2wxsaW3fuo2t2zua4hSXDDqpa8fO7l09u/fs3Yde6sN+Kj9AbO2ngaj8BRlWPgVhMlhrPx3EoSq2Hj4CDNJRaz3G43FgiIaNteYEcJKtp0YkncU62sucttaxM1w1XomzdG4gWksT8lAnTcoUHD5P9cZ6Qc7BxRAuUd1lyfxrFcJTMias9Ypar9J09bWe60lJWWuKUnFrvUFqxc1bNC4VmX1F+LaEp631zl1es/Ue3ZeowVgfcGug7xpp5KhYgYf0KEsHHkv6ibU+pWcoJe7r85FJDL2QjLW+pBm8Umtqqjn5+k0Io32YoKIsHTBWOa9sxduOd4lBtja8pw/00RTYDnyits9qLUxQZKw9hAr68jVmSjKtf/lmRj6U383ix08z/SFpo6bVv2xNsls2ghoF29fcceurpnLAra+eoEZBI16gRl/w58vt0y3DnxuR97e3dPo3rwh10UHUFO0AAAAASUVORK5CYII='
    };
    var reportList = document.getElementById('overview');
    var filterContainer = reportList.getElementsByTagName("tbody")[0];
    var reportRows = filterContainer.getElementsByTagName("tr");

    function getUserId(){
    var navi = document.getElementById("sidebarBoxActiveVillage");
    var navi_p = navi.getElementsByClassName("playerName")[0];
    //var profile_link = navi_p.getElementsByTagName("a")[1].innerText;
    // alert(profile_link);
    return navi_p.innerText;
    };

    var user_id = getUserId();
    var userHost = window.location.hostname.split(".")[0]+"_"+user_id;

    var attackStatus = GM_getValue(userHost + "_reportattackfilterstatus",'off');

    var reportattackFilterButt = Doc.New("img",[['src',Images.attackOff],['width','83px'],['height','30px'],["id","attackFilterButt"]]);

    if (attackStatus == "on") {
        reportattackFilterButt.src = Images.attackOn;
    }

    var cntDiv = document.createElement('div');
    cntDiv.setAttribute("style", "position:absolute;left:300px;top:133px;width:83px;height:30px;z-index:99;");
    cntDiv.appendChild(reportattackFilterButt);
    reportList.appendChild(cntDiv);


    //villaLinks[i].parentNode.parentNode.insertBefore(villaImg, villaLinks[i].parentNode.parentNode.getElementsByTagName("A")[0]);
    reportattackFilterButt.addEventListener("click",function(){toggleAttack()},false);

    var crtPage = window.location.href;
   runMain();
})();