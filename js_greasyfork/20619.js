// ==UserScript==
// @name         Google History Deleter
// @namespace    https://history.google.com/history
// @version      1.0.0
// @description  Automatically selects and deletes history from history.google.com
// @author       RexOmni
// @match        https://history.google.com/history/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/20619/Google%20History%20Deleter.user.js
// @updateURL https://update.greasyfork.org/scripts/20619/Google%20History%20Deleter.meta.js
// ==/UserScript==

(function() {
    // ************** //
    // User Variables //
    // ************** //
    var _GHDTimePerCheck = 1000; // The default time between each pass in miliseconds.
    var _GHDMaxSelected = 400; // Maximum checkboxes selected before it deletes them.

    // ************************************** //
    // Do not edit below unless experienced!  //
    // ************************************** //
    var _GHDAutodelete = true; // Turns GHDGHDAutodelete on or off
    var _isWorking = false;

    function constrain(num, low, high) {
        if (num < low) {
            return low;
        } else if (num > high) {
            return high;
        } else {
            return num;
        }
    }

    var run = 0;

    // Add the Ui
    $('div.main-column-width').prepend('<div style="padding:1px 24px 24px 24px;box-shadow:0 1px 3px 0 rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 2px 1px -1px rgba(0,0,0,.12);box-sizing:border-box;background:rgba(255,0,0,.15);margin-top:22px"id=GHD><div style="border-bottom:2px solid #000;display:flex;align-items:center"id=GHD-header;><div style=flex:.5><h3>Google History Deleter<br><span style=color:grey;font-size:70%>By RexOmniFurtim</span></h3></div><div style=flex:.5;text-align:center><input type=button value=Off id=GHD-isWorking name=isWorking onclikc=onoff() style=background:#ff3232;height:80%;min-height:2.3rem;width:80%;font-size:150%;cursor:pointer></div></div><div style=display:flex;margin-top:2%;align-items:center;text-align:center id=GHD-settings><div style=flex:calc(1/3)><span>Clock Speed</span><br><input type=number value=' + _GHDTimePerCheck + ' id=GHD-timePerCheck max=10000 min=200 name=timepercheck></div><div style=flex:calc(1/3)><span>Autodelete?</span><br><input type=checkbox value=1000 min=0 id="GHD-autodelete" checked></div><div style=flex:calc(1/3)><span>Maximum selected</span><br><input type=number value=' + _GHDMaxSelected + ' id=GHD-MaxSelected max=10000 min=1 style=padding-left:10%;padding-left:10%></div></div></div>');

    var GHD = document.getElementById('GHD');
    var input_isWorking = document.getElementById("GHD-isWorking");
    input_isWorking.addEventListener("click", function(){
        if (_isWorking) {
            _isWorking = false;
            GHD.style.background="rgba(255,0,0,0.15)";
            input_isWorking.style.background="rgb(255,50,50)";
            input_isWorking.value="Off";
            clearInterval(_GHD_interval);
        } else {
            _isWorking = true;
            GHD.style.background="rgba(0,255,0,0.15)";
            input_isWorking.style.background="rgb(50,255,50)";
            input_isWorking.value="On";
            _GHD_interval = setInterval(work, _GHDTimePerCheck);
        }
    });

    var input_timeper = document.getElementById('GHD-timePerCheck');
    input_timeper.addEventListener("change", function(){
        input_timeper.value = constrain(input_timeper.value, 200, 10000);
        _GHDTimePerCheck = input_timeper.value;
        if(_isWorking){
            input_isWorking.click();
        }
    });

    var autodel_input = document.getElementById('GHD-autodelete');
    autodel_input.addEventListener("change", function(){
        _GHDAutodelete = !_GHDAutodelete;
    });

    var maxsel_input = document.getElementById('GHD-MaxSelected');
    maxsel_input.addEventListener("change", function(){
        maxsel_input.value = constrain(maxsel_input.value, 1, 10000);
        _GHDMaxSelected = maxsel_input.value;
    });

    //md-checked
    function work(){
        run++; console.log("run: " + run);

        // click all empty checkmarks
        $("md-checkbox.ng-empty").click();

        var GDH_unchecked = $("md-checkbox.ng-not-empty");

        // if there is a load more button
        var loadmore_button = $("button[ng-click='lookupController.loadMore()']");
        if(loadmore_button.length == 1 &&  ($("md-checkbox.ng-not-empty").length >= _GHDMaxSelected)===false){
            loadmore_button.click(); // load more
        }

        // if more than selected and GHDGHDAutodelete on
        if(($("md-checkbox.ng-not-empty").length >= _GHDMaxSelected) && _GHDAutodelete){
            console.log("GHD: Deleting (passed limit)");
            $("button.history-delete-btn").click();
            setTimeout(function(){ $("button[ng-click='dialog.hide()']" ).click(); }, 10);
        }
        else if(_GHDAutodelete && loadmore_button.length===0){
            console.log("GHD: Deleting (no more to load)");
            $("button.history-delete-btn").click();
            setTimeout(function(){ $("button[ng-click='dialog.hide()']" ).click(); }, 10);
            console.log("GHD: Finished!");
        }
    } // work

    var _GHD_interval = null;
    console.log("GoogleHistoryCLicker Loaded!");
})();