// ==UserScript==
// @name         Torn War Bounty
// @version      1.0
// @description  War bounty
// @author       MikePence [2029670]
// @namespace    MikePence [2029670]
// @run-at       document-end
// @match        https://www.torn.com/factions.php?step=your*
// @match        https://www.torn.com/factions.php?step=profile&ID=*
// @downloadURL https://update.greasyfork.org/scripts/422966/Torn%20War%20Bounty.user.js
// @updateURL https://update.greasyfork.org/scripts/422966/Torn%20War%20Bounty.meta.js
// ==/UserScript==

$(document).ready(function(){
    if(window.location.href.includes("step=your")){
        var wallInterval = window.setInterval(wallFunction, 1000);
        function wallFunction(){
            $(".members-list").first().children().each(function(){
                if($(this).attr("class").includes("enemy")){
                    var attack = $(this).children().eq(4).children().first();
                    var attackHref = attack.attr("href");
                    if(typeof attackHref !== typeof undefined && attackHref !== false){
                        var enemy = $(this).children().eq(2).children().first().children().eq(2).children().first().attr("title");
                        var reward = 1;
                        attack.removeAttr("href");
                        attack.text("Bounty");
                        attack.click(function(){
                            console.log("bounty " + enemy + " " + reward);
                            $.post(
                                "https://www.torn.com/bounties.php?",
                                {
                                    target: enemy,
                                    reward: reward,
                                    reason: "",
                                    quantity: 1,
                                    step: "resultAddBounties"
                                },
                                function(data){
                                    console.log(data);
                                }
                            );
                        });
                    }
                }
            });
        }
    }
    else if(window.location.href.includes("step=profile")){
        var wallInterval2 = window.setInterval(wallFunction2, 1000);
        function wallFunction2(){
            $(".members-list").first().children().each(function(){
                if($(this).attr("class").includes("enemy")){
                    var id = $(this).children().eq(1);
                    var idText = id.text();
                    if(typeof idText !== typeof undefined && idText !== false && idText.includes("#")){
                        var enemy = $(this).children().eq(2).children().first().children().eq(2).children().first().attr("title");
                        var reward = 1;
                        id.html("<a href='javascript:void(0);'>Bounty</a>");
                        id.click(function(){
                            console.log("bounty " + enemy + " " + reward);
                            $.post(
                                "https://www.torn.com/bounties.php?",
                                {
                                    target: enemy,
                                    reward: reward,
                                    reason: "",
                                    quantity: 1,
                                    step: "resultAddBounties"
                                },
                                function(data){
                                    console.log(data);
                                }
                            );
                        });
                    }
                }
            });
        }
    }
});