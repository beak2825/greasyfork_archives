// ==UserScript==
// @name         Osu Match
// @namespace    https://osu.ppy.sh/u/4647122
// @version      1.0.2
// @description  show BP difference
// @author       superboy724
// @match        https://osu.ppy.sh/u/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21475/Osu%20Match.user.js
// @updateURL https://update.greasyfork.org/scripts/21475/Osu%20Match.meta.js
// ==/UserScript==
// JavaScript source code
//dim struct
var matchusername = "";
var myid = "";
var score = {
    score: 0,
    beatmap_id: 0,
    mods: 0,
    acc: 0.0,
    pp: 0.0,
    combo: 0,
    miss:0,
    Create: function (json) {
        var score = {};
        score.beatmap_id = json["beatmap_id"];
        score.score = json["score"];
        score.mods = json["enabled_mods"];
        score.acc = (json["count300"] * 6 + json["count100"] * 2 + json["count50"]) / (6 * (json["count300"] + json["count100"] + json["count50"] + json["countmiss"]));
        score.pp = json["pp"];
        score.combo = json["maxcombo"];
        score.miss = json["countmiss"];
        return score;
    },
    CreateWithID: function (json, beatmap_id) {
        var score = {};
        score.beatmap_id = beatmap_id;
        score.score = json["score"];
        score.mods = json["enabled_mods"];
        score.acc = (json["count300"] * 6 + json["count100"] * 2 + json["count50"]) / (6 * (json["count300"] + json["count100"] + json["count50"] + json["countmiss"]));
        score.pp = json["pp"];
        score.miss = json["countmiss"];
        score.combo = json["maxcombo"];
        return score;
    },
    DefaultCreate: function () {
        var score = {};
        return score;
    },
    Find: function (scores, beatmapid) {
        for (var i = 0; i <= scores.length - 1; i++) {
            if (scores[i].beatmap_id == beatmapid) {
                return scores[i];
            }
        }
    }
};

var scoreex = {
    Create: function () {
        var scoreex = score.DefaultCreate();
        scoreex.isEqualMod = true;
        return scoreex;
    }
};

function GetScore(username, count) {
    var scores = new Array();
    $.getJSON("../../api/get_user_best?k=2ed21141cd5e897d0e43ca0ae010870205467aaa&u=" + username + "&limit=" + count.toString(), function (data) {

        $.each(data, function (index, content) {
            scores.push(score.Create(content));
        });

    });
    return scores;
}

function GetBeatmapScore(username, beatmapid) {
    var _score = undefined;
    $.getJSON("../../api/get_scores?k=2ed21141cd5e897d0e43ca0ae010870205467aaa&u=" + username + "&b=" + beatmapid.toString(), function (data) {
        if (data[0] == undefined) {
            return;
        } else {
            _score = score.CreateWithID(data[0], beatmapid);
        }
    });
    return _score;
}

function ProcessData(userdatas, matchdatas) {
    $.each(userdatas, function (index, content) {
        var s = CalcData(content, matchdatas);
        if (s == undefined) {
            return true;
        }
        SetData(s);
    });
}

function ProcessDataNew(username, matchdatas) {
    $.each(matchdatas, function (index, content) {
        var userscore = GetBeatmapScore(username, content.beatmap_id);
        if (userscore == undefined) {
            return true;
        }
        var s = CalcData(userscore, matchdatas);
        if (s == undefined) {
            return true;
        }
        SetData(s);
    });
}

function CalcData(userscore, matchdatas) {
    var _scoreex = scoreex.Create();
    var matchscore = score.Find(matchdatas, userscore.beatmap_id);
    if (matchscore == undefined) {
        return;
    }
    _scoreex.score = userscore.score - matchscore.score;
    _scoreex.acc = userscore.acc - matchscore.acc;
    _scoreex.pp = userscore.pp - matchscore.pp;
    _scoreex.combo = userscore.combo - matchscore.combo;
    _scoreex.beatmap_id = userscore.beatmap_id;
    _scoreex.miss = userscore.miss - matchscore.miss;
    if (matchscore.mods == userscore.mods || (matchscore.mods == 64 && userscore.mods == 512) || (matchscore.mods == 512 && userscore.mods == 64)) {
        _scoreex.isEqualMod = true;
    } else {
        _scoreex.isEqualMod = false;
    }
    return _scoreex;
}

function SetData(_scoreex) {
    //print acc
    var scorediv = $("#performance-" + _scoreex.beatmap_id.toString());
    //if (scorediv == undefined) {
    //    return;
    //}
    //if (_scoreex.isEqualMod) {
    //    var printcolor = 0;
    //    if (_scoreex.acc > 0) {
    //        printcolor = 1;
    //    } else if (_scoreex.acc < 0) {
    //        printcolor = 2;
    //    } else if (_scoreex.acc == 0) {
    //        printcolor = 3;
    //    }
    //    scorediv.find(".h").html(scorediv.find(".h").html() + Print(_scoreex.acc.toString(), printcolor));
    //}
    //print pp
    var ppprintcolor = 0;
    if (!_scoreex.isEqualMod) {
        ppprintcolor = 4;
    } else if (_scoreex.pp > 0) {
        ppprintcolor = 1;
    } else if (_scoreex.pp < 0) {
        ppprintcolor = 2;
    } else if (_scoreex.pp == 0) {
        ppprintcolor = 3;
    }
    //var test = scorediv.find(".pp-display").find("b").html();
    if (_scoreex.pp > 0) {
        scorediv.find(".pp-display").find("b").html(scorediv.find(".pp-display").find("b").html() + Print("(+" + _scoreex.pp.toFixed(2).toString() + ")", ppprintcolor));
    } else {
        scorediv.find(".pp-display").find("b").html(scorediv.find(".pp-display").find("b").html() + Print("(" + _scoreex.pp.toFixed(2).toString() + ")", ppprintcolor));
    }
    //print combo
    var comboprintcolor = 0;
    if (!_scoreex.isEqualMod) {
        comboprintcolor = 4;
    } else if (_scoreex.combo > 0) {
        comboprintcolor = 1;
    } else if (_scoreex.combo < 0) {
        comboprintcolor = 2;
    } else if (_scoreex.combo == 0) {
        comboprintcolor = 3;
    }
    //var test = scorediv.find(".pp-display").find("b").html();
    if (_scoreex.combo > 0) {
        scorediv.find(".h").html(scorediv.find(".h").html() + Print("&nbsp;Diff MaxCombo:+" + _scoreex.combo.toString(), comboprintcolor));
    } else {
        scorediv.find(".h").html(scorediv.find(".h").html() + Print("&nbsp;Diff MaxCombo:" + _scoreex.combo.toString(), comboprintcolor));
    }
    //print miss
    var missprintcolor = 0;
    if (!_scoreex.isEqualMod) {
        missprintcolor = 4;
    } else if (_scoreex.miss > 0) {
        missprintcolor = 2;
    } else if (_scoreex.miss < 0) {
        missprintcolor = 1;
    } else if (_scoreex.miss == 0) {
        missprintcolor = 3;
    }
    //var test = scorediv.find(".pp-display").find("b").html();
    if (_scoreex.miss > 0) {
        scorediv.find(".h").html(scorediv.find(".h").html() + Print("&nbsp;Diff MissCount:+" + _scoreex.miss.toString(), missprintcolor));
    } else {
        scorediv.find(".h").html(scorediv.find(".h").html() + Print("&nbsp;Diff MissCount:" + _scoreex.miss.toString(), missprintcolor));
    }
}

function Print(text, color) {
    //1:red,2:green,3:gray,4.purple
    switch (color) {
        case 1: return "<span style='color:red' class='match_print'>" + text + "</span>";
        case 2: return "<span style='color:green' class='match_print'>" + text + "</span>";
        case 3: return "<span style='color:gray' class='match_print'>" + text + "</span>";
        case 4: return "<span style='color:purple' class='match_print'>" + text + "</span>";
    }
}

function ShowAll() {
    $(".match_print").remove();
    $("#match_vs").html("Loading...");
    var matchsocres = GetScore(matchusername, 100);
    ProcessDataNew(myid, matchsocres);
    $("#match_vs").html("VS " + matchusername + "(ALLScore)");
}

function ShowTop100Rank(){
    $(".match_print").remove();
    $("#match_top100").html("Loading...");
    var userscores = GetScore(myid, 100);
    var matchscores = GetScore(matchusername, 100);
    ProcessData(userscores, matchscores);
    $("#match_top100").html("VS " + matchusername + "(Top100Ranks)");
}

(function () {
    'use strict';
    // Your code here..
    //content
    $(".sectionContents").eq(1).html(Print("Purple:This score was used different mods<br/>", 4) + $(".sectionContents").eq(1).html());
    $(".sectionContents").eq(1).html(Print("Gray:This score is equal your score<br/>", 3) + $(".sectionContents").eq(1).html());
    $(".sectionContents").eq(1).html(Print("Green:This score is better then your score<br/>", 2) + $(".sectionContents").eq(1).html());
    $(".sectionContents").eq(1).html(Print("Red:This score is worse then your score<br/>", 1) + $(".sectionContents").eq(1).html());
    $.ajaxSettings.async = false;
    var _matchusername = $(".profile-username").html();
    myid = $(".content-infoline").find("div").find("b").find("a").html();
    matchusername = _matchusername;
    var ua = navigator.userAgent;
    if(ua.indexOf("Chrome") !== -1){
        expandProfile('general');
        expandProfile('general');
        expandProfile('leader');
    }
    //$("#leader").find("h2").eq(0).html($("#leader").find("h2").eq(0).html() + "<a id='match_vs' style='float:right'>VS " + _matchusername + "</a>");
    $("#fixable").html($("#fixable").html() + "<h2></a><h2>");
    $("#fixable").html($("#fixable").html() + "<h2><a id='match_vs' style='float:left'>VS " + _matchusername + " (ALLScore)</a><h2>");
    $("#fixable").html($("#fixable").html() + "<h2><a id='match_top100' style='float:left'>VS " + _matchusername + " (Top100Ranks)</a><h2>");
    //$("#more-performance-1").html("Loading...");
    //$("#more-performance-1").load("/pages/include/profile-leader.php?u=" + matchusername + "&m=0&pp=2");
    if(ua.indexOf("Chrome") !== -1){
        ShowTop100Rank();
    }
    document.getElementById("match_vs").addEventListener('click', function (e) {
        ShowAll();
    }, false);
    document.getElementById("match_top100").addEventListener('click', function (e) {
        ShowTop100Rank();
    }, false);
})();