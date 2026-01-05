// ==UserScript==
// @name         Black Flash's HF Clover Award Notification Script
// @include     *http://hackforums.net/*
// @namespace    http://hackforums.net/
// @version      1.2
// @description  Get a notification as soon as a green,purple or gold clover award has been given out
// @author       Black Flash ⚡
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/20344/Black%20Flash%27s%20HF%20Clover%20Award%20Notification%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/20344/Black%20Flash%27s%20HF%20Clover%20Award%20Notification%20Script.meta.js
// ==/UserScript==

(function() {
    var last_purple = GM_getValue("purple_clover", false);
    var last_gold = GM_getValue("gold_clover", false);
    var last_green = GM_getValue("green_clover", false);
    
    // Set the ones you don't want to false.
    var green = true;
    var purple = true;
    var gold = true;
    
    // Set this option to true to only receive a notification when a user you specify gets the award!
    var friends = false;
    // Add the uid's of the friends you want to be notified about here.
    var uids = ["enter","uids","here"];
    
    if(green) {
        GetAward("85",last_green);
    }
    
    if(purple) {
        GetAward("86",last_purple);
    }
    
    if(gold) {
        GetAward("87",last_gold);
    }
    
    function GetAward(uid,last) {
        $.ajax({
            type: "GET",
            crossDomain: true,
            url: "http://hackforums.net/myawards.php?awid="+uid,
            dataType: "html",
            success: function(response) {
                var last_entry = $(response).find('tr').last().html();
                var last_award = $(last_entry).find('span').html();
                var canAlert = true;
                if(friends === true) {
                   var last_uid = $(last_entry).find('a').attr('href');
                   if(last_uid !== undefined && last_uid !== null && last_uid !== "undefined") {
                     last_uid = last_uid.split('uid=')[1];
                   }
                   console.log(last_uid);
                    if($.inArray(last_uid, uids) !== -1) {
                        canAlert = true;
                    } else {
                        canAlert = false;
                    }
                }
                if(canAlert) {
                    if (last_award !== "undefined" && last_award !== undefined && last_award !== null && last !== false && last_award !== last) {
                        if(uid === "85") {
                            alert(last_award + " has just gotten the green clover award!");
                            setTimeout(function() {
                                GM_setValue("green_clover",last_award);       
                            }, 0);
                        } 
                        if(uid === "86") {
                            alert(last_award + " has just gotten the purple clover award!");
                            setTimeout(function() {
                                GM_setValue("purple_clover",last_award);       
                            }, 0);
                        }
                        if(uid === "87") {
                            alert(last_award + " has just gotten the gold clover award! :O");
                            setTimeout(function() {
                                GM_setValue("gold_clover",last_award);       
                            }, 0);
                        }
                    }
                }
            },
            error: function () {
                console.log("FFS");
            }
        });
    }
    


})();