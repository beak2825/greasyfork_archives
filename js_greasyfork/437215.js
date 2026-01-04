// ==UserScript==
// @name         Nexus Endorsement Manager
// @version      1.1.0
// @description  Adds buttons to the "My Nexus account" screen related to the mass endorsement and abstainment from endorsement of mods.
// @author       pointfeev
// @copyright    2021, pointfeev (https://github.com/pointfeev)
// @license      MIT
// @match        *://*.nexusmods.com/users/myaccount*
// @icon         https://www.nexusmods.com/favicon.ico
// @grant        none
// @namespace    https://github.com/pointfeev
// @homepageURL  https://gist.github.com/pointfeev/aa70c3d600698df40141c3a79ad9bf59
// @downloadURL https://update.greasyfork.org/scripts/437215/Nexus%20Endorsement%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/437215/Nexus%20Endorsement%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var requests = [];
    function endorse(i, item, positive) {
        return new Promise(function(resolve, reject) {
            if (item[12] != positive) {
                var request = $.ajax({
                    type: "POST",
                    url: "https://www.nexusmods.com/Core/Libs/Common/Managers/Mods?Endorse",
                    data: {
                        game_id: item[7],
                        mod_id: item[8],
                        positive: positive
                    },
                    dataType : 'json',
                    success: function (response) {
                        resolve(response);
                        requests.pop(request);
                    },
                    error: function(err) {
                        reject(err);
                        requests.pop(request);
                    }
                });
                requests.push(request);
            }
            else {
                resolve();
            }
        });
    }

    var working = false;
    var working_on = "none";
    var working_index = 0;
    var aborting = false;
    function work(positive, btn_text, original_text, count_func) {
        if (aborting) return;
        if (working) {
            if (working_on == original_text) {
                aborting = true;
                btn_text.text("Aborting . . .");
                requests.forEach(function(request) {
                    request.abort();
                    requests.pop(request);
                });
                working = false;
                working_on = "none";
                aborting = false;
                btn_text.text(original_text);
            }
            return;
        }
        requests.forEach(function(request) {
            request.abort();
            requests.pop(request);
        });
        working = true;
        working_on = original_text;
        working_index++;
        var current_working_index = working_index;
        function active()
        {
            return working && working_index == current_working_index;
        }
        btn_text.text("Requesting download history . . .");
        new Promise(function(resolve, reject) {
            var request = $.ajax({
                type: "GET",
                url: "https://www.nexusmods.com/Core/Libs/Common/Managers/Mods?GetDownloadHistory",
                dataType : 'json',
                success: function (response) {
                    resolve(response.data);
                    requests.pop(request);
                },
                error: function(err) {
                    reject(err);
                    requests.pop(request);
                }
            });
            requests.push(request);
        }).then(function(data) {
            var count = data.length;
            btn_text.text(count_func(count));
            $.each(data, function(i, item) {
                if (!active()) return;
                setTimeout(function do_work() {
                    if (!active()) return;
                    endorse(i, item, positive).then(function(response) {
                        if (!active()) return;
                        btn_text.text(count_func(--count));
                        if (count == 0) {
                            btn_text.text(original_text);
                            working = false;
                            working_on = "none";
                        }
                    }).catch(function(err) {
                        console.clear(); // prevent console lag
                        if (!active()) return;
                        btn_text.text(count_func(count));
                        setTimeout(do_work, count + 1);
                    });
                }, i);
            });
        }).catch(function(err) {
            console.clear(); // prevent console lag
            if (!active()) return;
            btn_text.text(original_text);
        });
    }

    function create_icon(icon_id, icon_class) {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
            use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "https://www.nexusmods.com/assets/images/icons/icons.svg#icon-" + icon_id);
        $(svg).addClass("icon icon-" + icon_class);
        svg.append(use);
        return svg;
    }

    var btn_endorse_text = document.createElement("span");
    $(btn_endorse_text).addClass("flex-label");
    $(btn_endorse_text).text("Endorse all mods");
    var btn_endorse_a = document.createElement("a");
    $(btn_endorse_a).addClass("btn inline-flex");
    btn_endorse_a.tabIndex = 0;
    btn_endorse_a.append(create_icon("endorse", "endorse"));
    btn_endorse_a.append(btn_endorse_text);
    $(btn_endorse_a).click(function() {
        work(1, $(btn_endorse_text), "Endorse all mods", function(count) {
            return "Endorsing " + count + " mods . . .";
        });
    });
    var btn_endorse_li = document.createElement("li");
    btn_endorse_li.append(btn_endorse_a);
    $(btn_endorse_li).insertAfter("#action-forum");

    var btn_abstain_text = document.createElement("span");
    $(btn_abstain_text).addClass("flex-label");
    $(btn_abstain_text).text("Abstain from endorsing all mods");
    var btn_abstain_a = document.createElement("a");
    $(btn_abstain_a).addClass("btn inline-flex");
    btn_abstain_a.tabIndex = 0;
    btn_abstain_a.append(create_icon("ignore", "endorse"));
    btn_abstain_a.append(btn_abstain_text);
    $(btn_abstain_a).click(function() {
        work(0, $(btn_abstain_text), "Abstain from endorsing all mods", function(count) {
            return "Abstaining from endorsing " + count + " mods . . .";
        });
    });
    var btn_abstain_li = document.createElement("li");
    btn_abstain_li.append(btn_abstain_a);
    $(btn_abstain_li).insertAfter(btn_endorse_li);
})();