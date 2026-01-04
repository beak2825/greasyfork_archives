// ==UserScript==
// @name         Wrap Up More
// @namespace    WKWUM
// @version      0.1
// @description  Increase the number of Wrap Up items in reviews
// @author       Ethan McCoy
// @match        https://www.wanikani.com/review/session
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388104/Wrap%20Up%20More.user.js
// @updateURL https://update.greasyfork.org/scripts/388104/Wrap%20Up%20More.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var setNumber = function(n){
        $("#wrap-up-countdown").text(isFinite(n)?n:"\u221E"); // Infinity unicode, but $.jStorage doesn't like Infinity
    };

    // Push question from reviewQueue  to the activeQueue
    var reviewQueueToActiveQueue = function(){
        var i = $.jStorage.get("activeQueue");
        var a = $.jStorage.get("currentItem");
        var c = $.grep(i, function(e) {
            return e.id !== a.id || !(a.rad && e.rad || a.kan && e.kan || a.voc && e.voc);
        });
        var d = $.jStorage.get("reviewQueue");
        c.push(d.shift());

        $.jStorage.set("activeQueue", c); // no listening (inf loop)
        $.jStorage.set("reviewQueue", d);
    };

    var wrapUpMore = function(){
        //
        // How many to wrap up?
        var c = $.jStorage.get("r/wrap-up-count");
        console.log("%cWrap up count:", "color:red", c);
        // Length of active queue
        var l = $.jStorage.get("activeQueue").length;
        console.log("%cActiveQueue length:", "color:blue", l);
        //alert(l);
        // Less than 10?
        var d = 1;//10 - l;
                console.log("%cdifference:", "color:purple", d);

        var r = Math.min(10, c);

        // replenish activeQueue to lowest of c or 10
        for (var i=l; i < r; i++){
            // reduce c by difference
            console.log("%c"+c+" - "+d+" = ", "color:red", (c-d));
            c = c-d;
            if (c >= 10){
                reviewQueueToActiveQueue();
            }
            $.jStorage.set("r/wrap-up-count", c);
            //repaint wrap-up button
            setNumber(c);
        }
    };

    $('#option-wrap-up').click(function(){
        if ($.jStorage.get("r/wrap-up")){
            var defaultNumber = $.jStorage.get("r/wrap-up-set")||10;
            defaultNumber = Number(window.prompt("How many do you want to wrap up?", defaultNumber));
            defaultNumber = !isFinite(defaultNumber)||isNaN(defaultNumber)||defaultNumber < 10 ? 10 : defaultNumber;
            // Reset wrap up number
            $.jStorage.set("r/wrap-up-set", defaultNumber);
            $.jStorage.set("r/wrap-up-count", defaultNumber);
        }
    });

    //Update wrap up button for each time
     $.jStorage.listenKeyChange("activeQueue", function(e,t){
         console.log("%ct:","font-weight:bold",t);
    //$('#option-wrap-up').click(function(){ //overwritten by above event
        if ($.jStorage.get("r/wrap-up")){
            var c = $.jStorage.get("r/wrap-up-count");
            setNumber(c);
        }
    });

    // questionType is set as part of "New Question"
    //(It's probably more direct to listen to the activeQueue, beware of inf loops)
    $.jStorage.listenKeyChange("questionType", function(){
        //Are we in wrap-up mode?
        if ($.jStorage.get("r/wrap-up")){
            wrapUpMore();
        }
    }, this);

})();