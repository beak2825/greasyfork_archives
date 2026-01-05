// ==UserScript==
// @name         Better Userpages
// @namespace    https://greasyfork.org/en/users/9694-croned
// @version      1.0
// @description  Adds some improvements to user pages
// @author       Croned
// @match        https://epicmafia.com/user/*
// @match        https://epicmafia.com/u/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26429/Better%20Userpages.user.js
// @updateURL https://update.greasyfork.org/scripts/26429/Better%20Userpages.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var id = $("[data-title='Player profile']").attr("href").split("/")[2];
    
    //Questions
    $.get("https://epicmafia.com/question?user_id=" + id, function (data) {
        var unans = data[1].num_unanswered;
        var total = data[1].data.length;
        $("#questions").find("h3").html($("#questions").find("h3").text() + "</br></br>" + unans + " hidden, " + total + " visible");
    });
    
    //Cycling by user id
    var change = 1;
    var curId = parseInt(id);
    var timesRan = 0;
    var running = false;
    var search = function () {
        if (timesRan < 10) {
            $.ajax({
                url: "https://epicmafia.com/vote/find/user/" + curId,
                dataType: "html",
                type: "post",
                success: function () {
                    window.location = "https://epicmafia.com/user/" + curId;
                },
                error: function () {
                    curId += change;
                    timesRan ++;
                    search();
                }
            });
        }
        else {
            running = false;
            alert("This is the newest user!");
        }
    };
    $("#usertitle").html('<a href="#" class="cycle left"><</a> ' + $("#usertitle").text() + ' <a href="#" class="cycle right">></a> ');
    $(".cycle").click(function () {
        if (!running) {
            running = true;
            curId = parseInt(id);
            change = 1;
            if ($(this).hasClass("left")) {
                change *= -1;
            }
            timesRan = 0;
            curId += change;
            search();
        }
    });
})();