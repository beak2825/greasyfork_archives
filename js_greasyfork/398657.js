// ==UserScript==
// @name        Torn Quick Attack
// @namespace   https://www.torn.com/profiles.php?XID=2029670
// @version     2.1
// @description Make attacking great again
// @author      MikePence [2029670]
// @match       https://www.torn.com/loader.php?sid=attack&*
// @requires    https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/398657/Torn%20Quick%20Attack.user.js
// @updateURL https://update.greasyfork.org/scripts/398657/Torn%20Quick%20Attack.meta.js
// ==/UserScript==

var attackButtonHeight = 490; // 100 for melee only, 500 for any weapon

$(document).ready(function(){
    var quickAttack = GM_getValue("quickAttack", 0);
    var attackTitle = $("h4").first();
    if(quickAttack == 1){
        attackTitle.html("Quick Attack - <span style='color:green'>Leave</span> - <a id='MikeQuickAttackOff' href='#'>Off</a> | Leave | <a id='MikeQuickAttackMug' href='#'>Mug</a> | <a id='MikeQuickAttackHosp' href='#'>Hosp</a><br><a id='MikeQuickAttackCycle' href='#'>Cycle</a> - <a id='MikeQuickAttackStartAttack' href='#'>Start Attack</a> - <a id='MikeQuickAttackSpamMelee' href='#'>Spam Melee</a> - <a id='MikeQuickAttackDoMug' href='#'>Do Mug</a>");
    }
    else if(quickAttack == 2){
        attackTitle.html("Quick Attack - <span style='color:red'>Mug</span> - <a id='MikeQuickAttackOff' href='#'>Off</a> | <a id='MikeQuickAttackLeave' href='#'>Leave</a> | Mug | <a id='MikeQuickAttackHosp' href='#'>Hosp</a><br><a id='MikeQuickAttackCycle' href='#'>Cycle</a> - <a id='MikeQuickAttackStartAttack' href='#'>Start Attack</a> - <a id='MikeQuickAttackSpamMelee' href='#'>Spam Melee</a> - <a id='MikeQuickAttackDoMug' href='#'>Do Mug</a>");
    }
    else if(quickAttack == 3){
        attackTitle.html("Quick Attack - <span style='color:blue'>Hosp</span> - <a id='MikeQuickAttackOff' href='#'>Off</a> | <a id='MikeQuickAttackLeave' href='#'>Leave</a> | <a id='MikeQuickAttackMug' href='#'>Mug</a> | Hosp<br><a id='MikeQuickAttackCycle' href='#'>Cycle</a> - <a id='MikeQuickAttackStartAttack' href='#'>Start Attack</a> - <a id='MikeQuickAttackSpamMelee' href='#'>Spam Melee</a> - <a id='MikeQuickAttackDoMug' href='#'>Do Mug</a>");
    }
    else{
        attackTitle.html("Quick Attack - Off - Off | <a id='MikeQuickAttackLeave' href='#'>Leave</a> | <a id='MikeQuickAttackMug' href='#'>Mug</a> | <a id='MikeQuickAttackHosp' href='#'>Hosp</a><br><a id='MikeQuickAttackCycle' href='#'>Cycle</a> - <a id='MikeQuickAttackStartAttack' href='#'>Start Attack</a> - <a id='MikeQuickAttackSpamMelee' href='#'>Spam Melee</a> - <a id='MikeQuickAttackDoMug' href='#'>Do Mug</a>");
    }
    var targetId = getUrlParameter("user2ID");
    console.log(targetId);
    $("#MikeQuickAttackOff").on("click", function(){
        quickAttack = 0;
        GM_setValue("quickAttack", quickAttack);
        attackTitle.html("Quick Attack - Off - Off | <a id='MikeQuickAttackLeave' href='#'>Leave</a> | <a id='MikeQuickAttackMug' href='#'>Mug</a> | <a id='MikeQuickAttackHosp' href='#'>Hosp</a><br><a id='MikeQuickAttackCycle' href='#'>Cycle</a> - <a id='MikeQuickAttackStartAttack' href='#'>Start Attack</a> - <a id='MikeQuickAttackSpamMelee' href='#'>Spam Melee</a> - <a id='MikeQuickAttackDoMug' href='#'>Do Mug</a>");
    });
    $("#MikeQuickAttackLeave").on("click", function(){
        quickAttack = 1;
        GM_setValue("quickAttack", quickAttack);
        attackTitle.html("Quick Attack - <span style='color:green'>Leave</span> - <a id='MikeQuickAttackOff' href='#'>Off</a> | Leave | <a id='MikeQuickAttackMug' href='#'>Mug</a> | <a id='MikeQuickAttackHosp' href='#'>Hosp</a><br><a id='MikeQuickAttackCycle' href='#'>Cycle</a> - <a id='MikeQuickAttackStartAttack' href='#'>Start Attack</a> - <a id='MikeQuickAttackSpamMelee' href='#'>Spam Melee</a> - <a id='MikeQuickAttackDoMug' href='#'>Do Mug</a>");
    });
    $("#MikeQuickAttackMug").on("click", function(){
        var attackTitle = $("h4").first();
        quickAttack = 2;
        GM_setValue("quickAttack", quickAttack);
        attackTitle.html("Quick Attack - <span style='color:red'>Mug</span> - <a id='MikeQuickAttackOff' href='#'>Off</a> | <a id='MikeQuickAttackLeave' href='#'>Leave</a> | Mug | <a id='MikeQuickAttackHosp' href='#'>Hosp</a><br><a id='MikeQuickAttackCycle' href='#'>Cycle</a> - <a id='MikeQuickAttackStartAttack' href='#'>Start Attack</a> - <a id='MikeQuickAttackSpamMelee' href='#'>Spam Melee</a> - <a id='MikeQuickAttackDoMug' href='#'>Do Mug</a>");
    });
    $("#MikeQuickAttackHosp").on("click", function(){
        quickAttack = 3;
        GM_setValue("quickAttack", quickAttack);
        attackTitle.html("Quick Attack - <span style='color:blue'>Hosp</span> - <a id='MikeQuickAttackOff' href='#'>Off</a> | <a id='MikeQuickAttackLeave' href='#'>Leave</a> | <a id='MikeQuickAttackMug' href='#'>Mug</a> | Hosp<br><a id='MikeQuickAttackCycle' href='#'>Cycle</a> - <a id='MikeQuickAttackStartAttack' href='#'>Start Attack</a> - <a id='MikeQuickAttackSpamMelee' href='#'>Spam Melee</a> - <a id='MikeQuickAttackDoMug' href='#'>Do Mug</a>");
    });
    var cycle = 1;
    var canStart = false;
    $("#MikeQuickAttackCycle").on("mousedown mouseup", function(){
        if(!canStart){
            if(cycle == 1){
                console.log("cycle start");
                $.get(
                    "https://www.torn.com/loader.php?" + $.param({sid:"attackData", mode:"json"}),
                    {
                        step: "startFight",
                        user2ID: targetId
                    },
                    function(data){
                        if(data.DB.error){
                            console.log(data.DB.error);
                        }
                        else{
                            canStart = true;
                            cycle = 2;
                            console.log("GO GO GO");
                        }
                    }
                );
            }
            cycle++;
            if(cycle >= 3){
                cycle = 1;
            }
        }
        else{
            if(cycle == 2){
                console.log("cycle hit");
                $.get(
                    "https://www.torn.com/loader.php?" + $.param({sid:"attackData", mode:"json"}),
                    {
                        step: "attack",
                        user2ID: targetId,
                        user1EquipedItemID: 3
                    },
                    function(data){
                        //console.log(data);
                    }
                );
            }
            else if(cycle == 3){
                console.log("cycle mug");
                $.get(
                    "https://www.torn.com/loader.php?" + $.param({sid:"attackData", mode:"json"}),
                    {
                        step: "finish",
                        fightResult: "mug"
                    },
                    function(data){
                        //console.log(data);
                    }
                );
            }
            cycle++;
            if(cycle >= 4){
                cycle = 2;
            }
        }
    });
    $("#MikeQuickAttackStartAttack").on("click", function(){
        $.get(
            "https://www.torn.com/loader.php?" + $.param({sid:"attackData", mode:"json"}),
            {
                step: "startFight",
                user2ID: targetId
            },
            function(data){
                //console.log(data);
            }
        );
    });
    $("#MikeQuickAttackSpamMelee").on("click", function(){
        $.get(
            "https://www.torn.com/loader.php?" + $.param({sid:"attackData", mode:"json"}),
            {
                step: "attack",
                user2ID: targetId,
                user1EquipedItemID: 3
            },
            function(data){
                //console.log(data);
            }
        );
    });
    $("#MikeQuickAttackDoMug").on("click", function(){
        $.get(
            "https://www.torn.com/loader.php?" + $.param({sid:"attackData", mode:"json"}),
            {
                step: "finish",
                fightResult: "mug"
            },
            function(data){
                //console.log(data);
            }
        );
    });
    /*var activeClass = "";
    var loadInterval = window.setTimeout(loadFunction, 50);
    function loadFunction(){
        var activeClassElement = $("#react-root").children().first().children().eq(1).children().first().children().first().children().eq(1).children().eq(1).children().first();
        if(activeClassElement.attr("class") == undefined){
            loadInterval = window.setTimeout(loadFunction, 50);
        }
        else{
            activeClass = activeClassElement.attr("class").split(" ")[2];
            var attackInterval = window.setInterval(attackFunction, 100);
        }
    }*/
    var attackInterval = window.setInterval(attackFunction, 100);
    function attackFunction(){
        var startFight = $("button:contains('Start fight')");
        startFight.css("height", attackButtonHeight + "px");
        startFight.css("width", "500px");
        startFight.parent().parent().parent().css("overflow", "visible");
        var joinFight = $("button:contains('Join fight')");
        joinFight.css("height", attackButtonHeight + "px");
        joinFight.css("width", "500px");
        joinFight.parent().parent().parent().css("overflow", "visible");
        var leave = $("button:contains('leave')");
        leave.parent().parent().parent().css("overflow", "visible");
        var mug = $("button:contains('mug')");
        var hosp = $("button:contains('hosp')");
        if(quickAttack == 1){
            mug.css("display", "none");
            hosp.css("display", "none");
            leave.css("display", "block");
            leave.css("height", attackButtonHeight + "px");
            leave.css("width", "500px");
        }
        else if(quickAttack == 2){
            leave.css("display", "none");
            hosp.css("display", "none");
            mug.css("display", "block");
            mug.css("height", attackButtonHeight + "px");
            mug.css("width", "500px");
        }
        else if(quickAttack == 3){
            leave.css("display", "none");
            mug.css("display", "none");
            hosp.css("display", "block");
            hosp.css("height", attackButtonHeight + "px");
            hosp.css("width", "500px");
        }
        /*$("#react-root").children().first().children().eq(1).children().first().children().first().children().eq(1).children().eq(1).children().each(function(){
            if(!$(this).hasClass(activeClass)){
                $(this).addClass(activeClass);
            }
        });*/
    }
});

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};