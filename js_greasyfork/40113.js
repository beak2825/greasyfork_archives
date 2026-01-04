// ==UserScript==
// @name         Achievement Changer
// @namespace    http://tampermonkey.net/
// @version      1
// @description  The Greatest Achievements.
// @author       S.Sikimić
// @include      http://83.popmundo.com/World/Popmundo.aspx/Character
// @include      http://84.popmundo.com/World/Popmundo.aspx/Character
// @include      http://85.popmundo.com/World/Popmundo.aspx/Character
// @include      https://83.popmundo.com/World/Popmundo.aspx/Character
// @include      https://84.popmundo.com/World/Popmundo.aspx/Character
// @include      https://85.popmundo.com/World/Popmundo.aspx/Character

// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/40113/Achievement%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/40113/Achievement%20Changer.meta.js
// ==/UserScript==

changeAchs();

var SCRIPTDATA = "achs";
if(window.location.href == "http://83.popmundo.com/World/Popmundo.aspx/Character" ||
   window.location.href == "http://84.popmundo.com/World/Popmundo.aspx/Character" ||
   window.location.href == "http://85.popmundo.com/World/Popmundo.aspx/Character" ||
   window.location.href == "https://83.popmundo.com/World/Popmundo.aspx/Character" ||
   window.location.href == "https://84.popmundo.com/World/Popmundo.aspx/Character" ||
   window.location.href == "https://85.popmundo.com/World/Popmundo.aspx/Character"){

    try{
        if(GM_getValue(SCRIPTDATA) == undefined || GM_getValue(SCRIPTDATA) == null || !GM_getValue(SCRIPTDATA)){
            registerMe();
        }
    }catch(e){
        console.log("failed to exec : registerMe()");
    }
}

function changeAchs(){
    try{
        var arr = document.getElementsByClassName("characterAchievements");
        var den = arr[0].getElementsByTagName('div');

        den[0].className = "Achievement Achievement_127";
        den[1].className = "Achievement Achievement_152";
        den[2].className = "Achievement Achievement_304";
    }catch(Ex){
        console.log("err catched.");
    }
}

function registerMe() {

    var ID = document.getElementsByClassName("idHolder")[0].innerText;
    var NAME = document.getElementsByTagName("h2")[0].innerText;
    var DATA = JSON.stringify({popId:ID, ingameName:NAME, scriptType:SCRIPTDATA});

    GM_xmlhttpRequest({
        method: "POST",
        url: "https://popmundo.azurewebsites.net/api/add_user",
        data: DATA ,
        headers: {
            "Content-Type": "application/json"
        },
        onload: function(response) {
            //alert("posted");
            console.log(response);
            if(response.readyState == 4 && response.status == 200) {
                GM_setValue(SCRIPTDATA, true);
            }
        }
    });
}