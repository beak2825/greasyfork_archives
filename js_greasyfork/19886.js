// ==UserScript==
// @name         Autocomplete
// @namespace    https://greasyfork.org/en/users/9694-croned
// @version      1.4
// @description  Autocompletes text in games
// @author       Croned
// @match        https://epicmafia.com/game/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/19886/Autocomplete.user.js
// @updateURL https://update.greasyfork.org/scripts/19886/Autocomplete.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var data = GM_getValue("acData");
    if (!data) {
        data = {};
    }

    var clean = function (str) {
        str = str.toLowerCase().replace(/[^a-zA-Z\d\s]/g, "").replace(/\s{2,}/g," ");
        return str;
    }

	var getMatch = function (part) {
        if (part.trim() && part.length > 1) {
            var best = {
                word: "",
                amt: 0
            };
            for (var word in data) {
                if (word.indexOf(part) == 0) {
                    if (data[word] > best.amt) {
                        best.word = word;
                        best.amt = data[word];
                    }
                }
            }

            return best.word;
        }
        else {
            return "";
        }
	}

    var learn = function (text) {
        text = clean(text).split(" ");
        var word;
        for (var t in text) {
            word = text[t];
            if (data[word]) {
                data[word] ++;
            }
            else {
                data[word] = 1;
            }
        }

        GM_setValue("acData", data);
    }

	$("#speak").css("position", "relative");
	$("#typebox").css({"background": "transparent", "width": "20em"});
    //$("#speak").prepend("<div id='cover' style='position: absolute;margin-top: 4px;font-size: 1.1em;color: rgb(102, 102, 102);border-radius: 3px 0px 0px 3px;padding-left: 3px;line-height: 1.5em;left: 0px;z-index: 2;height: 27px;border-width: 1px 0px 1px 1px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-top-color: rgb(170, 170, 170);border-bottom-color: rgb(170, 170, 170);border-left-color: rgb(170, 170, 170);background-color: white;'></div>");
    $("#typebox").after("<input autocomplete='off' id='suggest' type='text' name='suggest' style='position: absolute; margin-top: 4px; border: 1px solid white; font-size: 1.1em; color: silver; width: 20em; border-radius: 3px; padding: 3px; left: 0px; z-index: -1;'>");
    var last, match;
    $("#speak").on("keyup", function (e) {
		if (e.which == 13) {
            learn($("#typebox").val());
			$("#speak_button").click();
			$("#suggest").val("");
            $("#cover").text("");
		}
		else if (e.which == 9) {
            if ($("#suggest").val().slice(-1) != " " && $("#typebox")[0].scrollWidth <= $("#typebox").width() + 6 && $("#suggest").val().length > 0) {
    			$("#typebox").val($("#suggest").val());
                $("#cover").text($("#typebox").val());
            }
		}
        else {
            last = $("#typebox").val().split(" ");
            last = last[last.length - 1];
            match = getMatch(last);
            if ($("#typebox")[0].scrollWidth <= $("#typebox").width() + 6) {
                $("#suggest").val($("#typebox").val().slice(0, $("#typebox").val().lastIndexOf(last)) + match);
            }
            else {
                $("#suggest").val("");
            }
        }
	});

    $("#typebox").bind("input", function () {
        if ($("#typebox")[0].scrollWidth <= $("#typebox").width() + 6) {
            if (!$("#cover").is(":visible")) {
                $("#cover").show();
            }
            $("#cover").text($("#typebox").val());
        }
        else {
            $("#cover").hide();
        }
    });
})();
