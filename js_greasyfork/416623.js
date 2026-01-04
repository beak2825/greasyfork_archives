// ==UserScript==
// @name         Subeta: Fireside Helper
// @namespace    https://greasyfork.org/en/users/145271-aybecee
// @version      0.0.1
// @description  Automatically clicks on floating Red Rreign items and opens them in the new tab. Automatically donates pumpkins to Fantine.
// @author       AyBeCee
// @match        https://subeta.net/*
// @require      https://code.jquery.com/jquery-1.7.1.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/416623/Subeta%3A%20Fireside%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/416623/Subeta%3A%20Fireside%20Helper.meta.js
// ==/UserScript==

var currentTime = $('#menu-time').text();

var prizesArrayKey;
var prizesArray = GM_getValue('prizesArrayKey',0);

var startDonatingKey;
var startDonating = GM_getValue('startDonatingKey',0);

var closeTabKey;
var closeTab = GM_getValue('closeTabKey',0);


function flashySaved () {
    $("#savedFade0").fadeIn(500);
    setTimeout(function(){
        $("#savedFade0").fadeOut(500);
    }, 1000);
}

$(`#sidebar-top`).after(`
<div id="firesideHelper">
<b>Fireside Helper</b>
<br>
 <input type="checkbox" id="closeTab" name="closeTab">
  <label for="closeTab">Auto-close tab</label>
<div id="savedFade0">Saved</div>
</div>
<style>
#firesideHelper {
padding: 5px; margin: 5px; background: #e4e5bc; border: 1px solid #95a446;
}
#savedFade0 {
    text-align: center;
    color: #ffffff;
    background: #4CAF50;
    padding: 2px 8px;
display:none;
margin-top:5px;
}
</style>`)


$('#closeTab').change(function() {
    if ( $('#closeTab:checked').length > 0 ) {
        GM_setValue('closeTabKey',true);
    } else {
        GM_setValue('closeTabKey',false);
    }

    flashySaved ()
});
// for default form display
if ( closeTab == true ) {
    $('#closeTab').prop('checked', true);
}

if ( window.location.href.includes(`/explore/fireside_fantine.php`) ) {
    var firstPumpkin = $(`div[style="min-height:80px; width:80px; text-align:center; vertical-align:top; padding:3px; display:inline-block; *zoom:1; *display:inline; font-size:11px;"]`)
    .find('a').eq(0);

    if ( firstPumpkin.length > 0 && startDonating == true ) {
        window.location.href = firstPumpkin.attr("href");
    }


    $(`div[style="width:500px; text-align:justify;"]:contains('Drop by any time with a donation!')`).prepend(`
<center>
<div id="givePumpkin">
<div style="font-size: 20px; text-transform: uppercase; font-weight: bold; margin-bottom: 10px;color:red;">Pumpkin Autogiver</div>

<div class="ui button" id="startDonating">Donate all Pumpkins</div>
<div class="ui button" id="stopDonating">Stop donating Pumpkins</div>
</div>
</center>
<br>
<style>
#givePumpkin {
padding: 15px; border-radius: 15px; box-shadow: 2px 2px 2px #d3d3d3;
background: #e3e3e3;
display:inline-block;
width:300px;
font-family: -apple-system,BlinkMacSystemFont,segoe ui,roboto,oxygen,ubuntu,cantarell,fira sans,droid sans,helvetica neue,sans-serif;
}
</style>
`)

    $(`#startDonating`).click( function() {
        GM_setValue('startDonatingKey',true);
        window.location.href = firstPumpkin.attr("href");
        $(`#startDonating`).hide();
        $(`#stopDonating`).show();
    });
    $(`#stopDonating`).click( function() {
        GM_setValue('startDonatingKey',false);
        $(`#startDonating`).show();
        $(`#stopDonating`).hide();
    });
    if ( startDonating == true ) {
        $(`#startDonating`).hide();
        $(`#stopDonating`).show();
    }
    else if ( startDonating == false ) {
        $(`#startDonating`).show();
        $(`#stopDonating`).hide();
    }

    if ( window.location.href.includes(`?act=turnin`) ) {
        window.location.href ="/explore/fireside_fantine.php"
    }

}


// click on floating pumpkin
if ( $(`.floating_item`).length > 0 ) {
    window.open($(`.floating_item a`).attr("href"), '_blank');
}
// close page after clicking on pumpkin
if ( window.location.href.includes(`/floating.php?act=claim`) ) {

    var displayHistory = JSON.stringify(prizesArray)
    .replace("{","").replace("}","")
    .replace(/,"/g, "<br><b>")
    .replace(/":/g, "</b>: ")
    .replace(`"`,"")

    console.log(displayHistory);

    $(`body`).append(`
<center>
<div id="floatingFireside">
<div style="font-size: 20px; text-transform: uppercase; font-weight: bold; margin-bottom: 10px;color:red;">Fireside helper</div>
<b>${displayHistory}
<br><br>
<button id="resetFireside">Clear history</button>
</div>
</center>
<style>
#floatingFireside {
padding: 15px; border-radius: 15px; box-shadow: 2px 2px 2px #d3d3d3;
background: #e3e3e3;
display:inline-block;
    font-family: -apple-system,BlinkMacSystemFont,segoe ui,roboto,oxygen,ubuntu,cantarell,fira sans,droid sans,helvetica neue,sans-serif;
}
</style>
`)

    $(`#resetFireside`).click( function() {
        GM_setValue('prizesArrayKey',{});
    });

    var floatPrize = $(`b:first`).text();

    console.log(prizesArray[floatPrize]);

    if ( prizesArray[floatPrize] > 0 ) {
        prizesArray[floatPrize] ++;
    } else {
        prizesArray[floatPrize] = 1;
    }
    console.log(prizesArray)




    GM_setValue('prizesArrayKey',prizesArray);

    if ( closeTab == true ) {
        window.top.close();
    }
}
