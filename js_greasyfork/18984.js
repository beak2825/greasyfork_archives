// ==UserScript==
// @name         CompMatch
// @namespace    https://greasyfork.org/en/users/9694-croned
// @version      1.6
// @description  Finds comp games common among players
// @author       Croned
// @match        https://epicmafia.com/round*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18984/CompMatch.user.js
// @updateURL https://update.greasyfork.org/scripts/18984/CompMatch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
    };
    
    var findId = function (name, cb) {
        var id;
        $.get("https://epicmafia.com/user/search?q=" + name, function (data) {
            data = data.data;
            if (data.length > 0) {
                id = data[0].id;
                cb(id);
            }
            else {
                alert("User " + name + " not found!");
                $("#loadingReport").hide();
                $("#results").hide();
                throw new Error("User not found");
            }
        });
    };
    
    var getGames = function (id, num, arr, cb) {
        $.get("https://epicmafia.com/round/" + round + "/user/" + id + "/game/page?page=" + num, function (data) {
            data = data.data;
            for (var index in data) {
                arr.push(data[index].id);
            }
            
            if (data.length == 10) {
                getGames(id, num + 1, arr, cb);
            }
            else {
                cb();
            }
        });
    };

    var round = $("#breadcrumb span:contains('Round')").text().split(" ")[1];
    
    $("#round_middle").prepend("<div id='compSearch'><h3 style='margin-bottom: 10px;'>Search for games players have played together!</h3><form class='form' id='searchCompForm' style='margin-left: 7px;'><div class='search'><div class='search-icon'><i class='icon-search'></i></div><input autocomplete='off' id='searchCompText' placeholder='player name 1, 2, 3, ....' type='text' style='border: 1px solid #777;'></div></form><div id='loadingReport' style='text-align: center; display: none;'><br /><img src='http://www.arabianbusiness.com/skins/ab.main/gfx/loading_spinner.gif' width='50' height='50' /></div><div id='results' style='display: none; text-align: center; margin-top: 10px;'><div id='matchList'><table id='matchTable' style='margin: auto;'></table></div></div></div>");
    $("#searchCompForm").submit(function (e) {
        e.preventDefault();
        
        //$("#searchCompForm").hide();
        $("#loadingReport").show();
        $("#results").hide();
        $("#matchTable").html("");
        
        var input = $("#searchCompText").val().replaceAll(" ", "").split(",");
        var users = input.slice();
        var done = 0;
        var matches = [];
        var newMatches;
        for (var index in input) {
            (function (index) {
                var uName = input[index];
                input[index] = [];
                findId(uName, function (uId) {
                    getGames(uId, 1, input[index], function() {
                        done ++;

                        if (done == input.length) {
                            matches = input[0];
                            for (var i = 0, j, k; i < input.length; i++) {
                                newMatches = [];
                                for (j = 0; j < input[i].length; j++) {
                                    for (k = 0; k < matches.length; k++) {
                                        if (input[i][j] == matches[k]) {
                                            newMatches.push(matches[k]);
                                            break;
                                        }
                                    }
                                }
                                matches = newMatches.slice();
                            }
                            $("#loadingReport").hide();
                            $("#results").show();

                            for (var p in users) {
                                $("#matchTable").append("<tr><td>" + users[p] + ": " + Math.round(100 * (matches.length / input[p].length)) + "%</td></tr>");
                            }
                            $("#matchTable").append("<tr><td>------------</td></tr>");

                            for (var m in matches) {
                                $("#matchTable").append("<tr><td><a href='/game/" + matches[m] + "/review'>" + matches[m] + "</a></td></tr>");
                            }
                        }
                    });
                });
                
            })(index);
        }
    });
})();