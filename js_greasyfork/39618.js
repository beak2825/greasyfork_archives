// ==UserScript==
// @name         Kasisto script
// @namespace    https://greasyfork.org/users/144229
// @version      1.2.1
// @description  Makes money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      https://central-mturk.kitsys.net/*
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @require      https://greasyfork.org/scripts/33763-nyquery/code/NyQuery.js
// @downloadURL https://update.greasyfork.org/scripts/39618/Kasisto%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/39618/Kasisto%20script.meta.js
// ==/UserScript==

$(document).ready(function() {
    if ($("div:contains(Imagine you are interacting with a smart)").length){
        //Hides Instructions - selects text box
        $("div[class=instructions]").toggle();
        $(".form-control").focus();
        //Spits the first option into the text box
        var e1 = $("h5").eq(0).text().trim().substring(3);
        var e2;
        var e3;
        if($("h5").eq(1).text().trim().substring(3) != "ase provide an input. Text cannot empty (or invalid)."){
            e2 = $("h5").eq(1).text().trim().substring(3);
        }
        if($("h5").eq(2).text().trim().substring(3) != "ase provide an input. Text cannot empty (or invalid)."){
            e3 = $("h5").eq(2).text().trim().substring(3);
        }
        console.log(e1+e2+e3);
        var arr = [e1,e2,e3];
        var pick = arr[randNum(0,2)];
        while (pick == undefined && pick.length < 5){
            pick = arr[randNum(0,2)];
        }
        if(pick.charAt(pick.length - 1) == "?"){
            pick = pick.replace('?', ' ');
        }else{
            pick+="?";
        }
        pick = pick.replace('get', 'recieve');
        pick = pick.replace('still', 'continue');
        pick = pick.replace('can i', 'am I allowed to');
        pick = pick.toLowerCase();
        pick = pick.replace(' atm ', ' automatic teller machine ');
        if(randNum(0,1)){
            if(randNum(0,1)){
                pick = "Hello, "+ pick;
            }else{
                pick = "Hi." + pick;
            }
        }
        if(randNum(0,1)){
            if(randNum(0,1)){
                pick = pick + " please";
            }else{
                pick = pick + " please.";
            }
        }
        document.getElementById("altQuestion").value = pick;
        $(".form-control").focusout();
        setTimeout(function(){
            $('input#submitBtn').click();
            setTimeout(function(){location.reload();},500);
        },1500);
    }
});

