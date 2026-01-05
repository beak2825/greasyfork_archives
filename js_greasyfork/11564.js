// ==UserScript==
// @name            Ogame Alt Statistic
// @description     Ogame Alternative Statistic
// @include         http://*.ogame.gameforge.com/game/index.php?*
// @exclude         http://board.ogame.*
// @version         0.5
// @author          IgorZ
// @namespace https://greasyfork.org/users/14097
// @downloadURL https://update.greasyfork.org/scripts/11564/Ogame%20Alt%20Statistic.user.js
// @updateURL https://update.greasyfork.org/scripts/11564/Ogame%20Alt%20Statistic.meta.js
// ==/UserScript==

(function () {
    
    //1000*60*30 = 30 min.
    //Timeout between getting stats from the cache and loading it from XML source
    var TIMEOUT = 1000 * 60 * 30;
    var INACTIVE_PLAYER_TIMEOUT = 1000 * 60 * 60 * 3;
    
    //Players that have less points than MIN_POINTS_FILTER will not be shown on the stats page
    var MIN_POINTS_FILTER = 1000;

    //Adding 'Alt' href in the 'Bar' section
    if (document.getElementById('bar')) {
        var item = document.createElement('a');
        item.setAttribute("href", "javascript:void(0);");
        item.setAttribute("id", "alt");
        item.innerHTML = 'Alt';
        var mas = [];
        $('#bar').find('li').each(function () {
            mas.push($(this));
        });
        mas[3].append(item);
    }

    $('#alt').click(function () {
        $("#inhalt").html("");
        var result = "";
        result += '<div id="highscoreContent" class="contentbox">';
        result += '<div class="header"><h2>Alt statistics (XML api)</h2></div>';
        result += '<div class="content">';
        result += '<div id="row">';

        result += '<div class="buttons" id="categoryButtons" style="display:inline; float:left; height:54px; margin:6px 0 0 7px; padding:0; width:320px;">';

        result += '<a id="points" class="navButton active" href="javascript:void(0);" rel="1">';
        result += '<img src="http://gf2.geo.gfsrv.net/cdndf/3e567d6f16d040326c7a0ea29a4f41.gif" height="54" width="54">';
        result += '<span class="marker"></span><span class="textlabel">Очки</span></a>';

        result += '<a id="fleet" class="navButton" href="javascript:void(0);" rel="2">';
        result += '<img src="http://gf2.geo.gfsrv.net/cdndf/3e567d6f16d040326c7a0ea29a4f41.gif" height="54" width="54">';
        result += '<span class="marker"></span><span class="textlabel">Вооружение</span></a>';
        
        result += '<a id="economy" class="navButton" href="javascript:void(0);" rel="3">';
        result += '<img src="http://gf2.geo.gfsrv.net/cdndf/3e567d6f16d040326c7a0ea29a4f41.gif" height="54" width="54">';
        result += '<span class="marker"></span><span class="textlabel">(I)</span></a>';
        
        result += '<div id="i">';
        result += '<a id="economy" class="navButton" href="javascript:void(0);" rel="4">';
        result += '<img src="http://gf2.geo.gfsrv.net/cdndf/3e567d6f16d040326c7a0ea29a4f41.gif" height="54" width="54">';
        result += '<span class="marker"></span><span class="textlabel">(i)</span></a></div>';

        result += '</div>';
        
        result += '';

        result += '</div>';
        result += '<div class="" id="stat_list_content"></div>';

        $("#inhalt").append(result);

        bindButtons();
        $('#points').click();
    });

    var result = "";

    //Forming the table header
    function formTable() {
        result += '<table id="ranks" class="userHighscore">';
        result += '<thead>';
        result += '<tr>';
        result += '<td class="position">Позиция</td>';
        result += '<td class="name">Имя игрока (Очки чести)</td>';
        result += '<td class="score" align="center">Очки</td>';
        result += '</tr>';
        result += '</thead>';
        result += '<tbody>';
    }

    //Splitting digits with a dot. Ex: 111222 -> 111.222
    function niceNumber(x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return parts.join(".");
    }

    //Appending new rows to the result string
    function appendRows(param) {
        var position = param[0];
        var alliance = param[1];
        var player = param[2];
        var honor = param[3];
        var score = param[4];
        var honor_position = param[5];
        var size = param[6];
        var status = param[7];
        
        var myName = getMyName();

        result += '<tbody>';
        
        if (player == myName) {
            result += '<tr class="myrank">';
        } else {
            result += '<tr class="">';
        }
        
        result += '<td class="position">' + position + '</td>';
        //====================honorRank=================================================================================
        //console.log("player: " + player + ", honor: " + honor + ", honor_position: " + honor_position);
        result += '<td class="name">';
        if ((honor_position <= 10) && (honor >= 150000)) {
            result += '<span class="honorRank rank_starlord1">&nbsp;</span>';
        } else if (honor_position <= 100 && (honor >= 2500)) {
            result += '<span class="honorRank rank_starlord2">&nbsp;</span>';
        } else if ((honor_position <= 250) && (honor >= 250)) {
            result += '<span class="honorRank rank_starlord3">&nbsp;</span>';

        } else if ((honor_position >= size - 10) && (honor <= -15000)) {
            result += '<span class="honorRank rank_bandit1">&nbsp;</span>';
        } else if ((honor_position >= size - 100) && (honor <= -2500)) {
            result += '<span class="honorRank rank_bandit2">&nbsp;</span>';
        } else if ((honor_position >= size - 250) && (honor <= -500)) {
            result += '<span class="honorRank rank_bandit3">&nbsp;</span>';
        }
        //==============================================================================================================
        if (alliance != null) {
            result += '<span class="ally-tag"><a href="javascript:void(0);" target="_ally">[' + alliance + ']</a></span>';
        }
        //====================Name + Status=============================================================================
        if (status == null) {
            result += '&nbsp;<span class="status_abbr_honorableTarget playername">' + player + '</span>';
        } else if (status == "I") {
            result += '&nbsp;<span class="playername">' + player + ' (I)</span>';
        } else if (status == "i") {
            result += '&nbsp;<span class="playername">' + player + ' (i)</span>';
        } else if ((status == "v") || (status == "vi") || (status == "vI")) {
            result += '&nbsp;<span class="playername" style="color: cyan;">' + player + '</span>';
        } else if ((status == "vb") || (status == "vib") || (status == "vIb")) {
            result += '&nbsp;<span class="playername" style="text-decoration: line-through;">' + player + '</span>';
        } else if (status == "a") {
            result += '&nbsp;<span class="playername" style="color: #F48406;">' + player + '</span>';
        }
        //==============================================================================================================
        if (honor >= 0) {
            result += '<span class="honorScore">&nbsp;(<span class="undermark">' + niceNumber(honor) + '</span>)</span></td>';
        } else {
            result += '<span class="honorScore">&nbsp;(<span class="overmark">' + niceNumber(honor) + '</span>)</span></td>';
        }
        result += '<td class="score">' + niceNumber(score) + '</td>';
        result += '</tr>';
    }
    
    function getMyName() {
        var name = $('.textBeefy').html();
        name = $.trim(name);
        return name;
    }

    //Time formatter
    function formatTime(time) {
        var date = new Date(time * 1000);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    }

    //XML loader
    function getHighscoreXML() {
        var ogame_url = window.location.origin;
        ogame_url += "/api/highscore.xml?category=1&type=0";
        return $.ajax({
            type: "GET",
            url: ogame_url,
            dataType: "xml"
        });
    }

    //XML loader
    function getMilitaryXML() {
        var ogame_url = window.location.origin;
        ogame_url += "/api/highscore.xml?category=1&type=3";
        return $.ajax({
            type: "GET",
            url: ogame_url,
            dataType: "xml"
        });
    }

    //XML loader
    function getPlayersXML() {
        var ogame_url = window.location.origin;
        ogame_url += "/api/players.xml";
        return $.ajax({
            type: "GET",
            url: ogame_url,
            dataType: "xml"
        });
    }

    //XML loader
    function getAlliancesXML() {
        var ogame_url = window.location.origin;
        ogame_url += "/api/alliances.xml";
        return $.ajax({
            type: "GET",
            url: ogame_url,
            dataType: "xml"
        });
    }

    //XML loader
    function getHonorXML() {
        var ogame_url = window.location.origin;
        ogame_url += "/api/highscore.xml?category=1&type=7";
        return $.ajax({
            type: "GET",
            url: ogame_url,
            dataType: "xml"
        });
    }
    
    //XML loader
    function getUniverseXML() {
        var ogame_url = window.location.origin;
        ogame_url += "/api/universe.xml";
        return $.ajax({
            type: "GET",
            url: ogame_url,
            dataType: "xml"
        });
    }
  
    
    //Players XML parser    
    function parseXML_Players(args) {
        console.log("[ Parsing new XML Players ]");
        formTable();
        var highscoreXML = args[0];
        var playersXML = args[1];
        var alliancesXML = args[2];
        var honorXML = args[3];
//        var uniXML = args[4];
        var size = 0;
        $(honorXML).find('player').each(function () {
            size++;
        });
        var timestamp;
        $(playersXML).find('players').each(function () {
            timestamp = $(this).attr('timestamp');
            console.log("[ Players XML Timestamp: " + formatTime(timestamp) + " ]");
        });
        $(highscoreXML).find('highscore').each(function () {
            timestamp = $(this).attr('timestamp');
            console.log("[ Highscore XML Timestamp: " + formatTime(timestamp) + " ]");
        });
        $(highscoreXML).find('player').each(function () {
            var id = $(this).attr('id');
            var name;
            var alliance_id;
            var status;
            var position = $(this).attr('position');
            var score = $(this).attr('score');
            $(playersXML).find('player[id=' + id + ']').each(function () {
                name = $(this).attr('name');
                alliance_id = $(this).attr('alliance');
                status = $(this).attr('status');
            });
            var alliance;
            $(alliancesXML).find('alliance[id=' + alliance_id + ']').each(function () {
                alliance = $(this).attr('tag');
            });
            
//            var coords;
//            $(uniXML).find('planet[player=' + id + ']').each(function () {
//                coords = $(this).attr('coords');
//                return false;
//            });
            
            var honor;
            var honor_position;
            $(honorXML).find('player[id=' + id + ']').each(function () {
                honor = $(this).attr('score');
                honor_position = $(this).attr('position');
            });
            if (alliance != null) {
                var player = position + " - " + "[" + alliance + "]" + name + "(" + honor + ")" + " - " + score;
            } else {
                var player = position + " - " + name + "(" + honor + ")" + " - " + score;
            }
            var params = [position, alliance, name, honor, score, honor_position, size, status];
            if (score >= MIN_POINTS_FILTER) {
                appendRows(params);
            }
        });
        var url_split = window.location.origin.split('.');
        var ls = "ALT_Ogame_Statistic_Players_" + url_split[0];
        localStorage[ls] = result;
        $("#stat_list_content").append(result);
    }


    //Military XML parser 
    function parseXML_Military(args) {
        console.log("[ Parsing new XML Military ]");
        formTable();
        var militaryXML = args[0];
        var playersXML = args[1];
        var alliancesXML = args[2];
        var honorXML = args[3];
        var size = 0;
        $(honorXML).find('player').each(function () {
            size++;
        });
        var timestamp;
        $(playersXML).find('players').each(function () {
            timestamp = $(this).attr('timestamp');
            console.log("[ Players XML Timestamp: " + formatTime(timestamp) + " ]");
        });
        $(militaryXML).find('highscore').each(function () {
            timestamp = $(this).attr('timestamp');
            console.log("[ Military XML Timestamp: " + formatTime(timestamp) + " ]");
        });
        $(militaryXML).find('player').each(function () {
            var id = $(this).attr('id');
            var name;
            var alliance_id;
            var status;
            var position = $(this).attr('position');
            var score = $(this).attr('score');
            $(playersXML).find('player[id=' + id + ']').each(function () {
                name = $(this).attr('name');
                alliance_id = $(this).attr('alliance');
                status = $(this).attr('status');
            });
            var alliance;
            $(alliancesXML).find('alliance[id=' + alliance_id + ']').each(function () {
                alliance = $(this).attr('tag');
            });
            var honor;
            var honor_position;
            $(honorXML).find('player[id=' + id + ']').each(function () {
                honor = $(this).attr('score');
                honor_position = $(this).attr('position');
            });

            if (alliance != null) {
                var player = position + " - " + "[" + alliance + "]" + name + "(" + honor + ")" + " - " + score;
            } else {
                var player = position + " - " + name + "(" + honor + ")" + " - " + score;
            }
            var params = [position, alliance, name, honor, score, honor_position, size, status];

            if (score >= MIN_POINTS_FILTER) {
                appendRows(params);
            }
        });
        var url_split = window.location.origin.split('.');
        var ls = "ALT_Ogame_Statistic_Military_" + url_split[0];
        localStorage[ls] = result;
        $("#stat_list_content").append(result);
    }
    
    //Inactives XML parser    
    function parseXML_Inactive(args, scan_I) {
        console.log("[ Parsing new XML Inactives ]");
        formTable();
        var highscoreXML = args[0];
        var playersXML = args[1];
        var alliancesXML = args[2];
        var honorXML = args[3];
        var size = 0;
        $(honorXML).find('player').each(function () {
            size++;
        });
        var timestamp;
        $(playersXML).find('players').each(function () {
            timestamp = $(this).attr('timestamp');
            console.log("[ Inactives XML Timestamp: " + formatTime(timestamp) + " ]");
        });
        $(highscoreXML).find('highscore').each(function () {
            timestamp = $(this).attr('timestamp');
            console.log("[ Highscore XML Timestamp: " + formatTime(timestamp) + " ]");
        });
        $(highscoreXML).find('player').each(function () {
            var id = $(this).attr('id');
            var name;
            var alliance_id;
            var status;
            var position = $(this).attr('position');
            var score = $(this).attr('score');
            $(playersXML).find('player[id=' + id + ']').each(function () {
                name = $(this).attr('name');
                alliance_id = $(this).attr('alliance');
                status = $(this).attr('status');
            });
            var alliance;
            $(alliancesXML).find('alliance[id=' + alliance_id + ']').each(function () {
                alliance = $(this).attr('tag');
            });
            var honor;
            var honor_position;
            $(honorXML).find('player[id=' + id + ']').each(function () {
                honor = $(this).attr('score');
                honor_position = $(this).attr('position');
            });
            if (alliance != null) {
                var player = position + " - " + "[" + alliance + "]" + name + "(" + honor + ")" + " - " + score;
            } else {
                var player = position + " - " + name + "(" + honor + ")" + " - " + score;
            }
            var params_I = [position, alliance, name, honor, score, honor_position, size, status];
            var params_i = [position, alliance, name, honor, score, honor_position, size, status];
            if ((score >= MIN_POINTS_FILTER) && (status == "I") && (scan_I)) {
                appendRows(params_I);
            } else if ((score >= MIN_POINTS_FILTER) && (status == "i") && (!scan_I)) {
                appendRows(params_i);
            }
        });
        var url_split = window.location.origin.split('.');
        var lsi = "ALT_Ogame_Statistic_i_" + url_split[0];
        var lsI = "ALT_Ogame_Statistic_I_" + url_split[0];
        
        if (scan_I) {
           localStorage[lsI] = result; 
        } else {
            localStorage[lsi] = result; 
        }
        
        $("#stat_list_content").append(result);
    }


    //Time logger
    function getTimeTillNextUpdate(timestamp, timeout) {
        var time_left_min = timeout - (new Date().getTime() - parseInt(timestamp));
        var time_left_sec = Math.round(time_left_min / 1000);
        time_left_min = Math.round(time_left_min / 1000 / 60);
        console.log("[!]   Next XML update is in: " + time_left_min + " min. (" + time_left_sec + " sec.)");
    }

//###################################################################################################################
    function bindButtons() {

        //JS Points button binding
        $('#points').click(function () {
            var currentTime_pl = new Date().getTime();
            if (localStorage["ALT_TimeStamp_Players"] == null) {
                console.log("[ No 'ALT_TimeStamp_Players' was found. Setting new 'ALT_TimeStamp_Players' ]");
                localStorage["ALT_TimeStamp_Players"] = currentTime_pl;
            }
            $('#points').addClass("active");
            $('#fleet').removeClass("active");
            $('#economy').removeClass("active");
            $('#i > #economy').removeClass("active");
            
            $("#stat_list_content").html("");
            var url_split = window.location.origin.split('.');
            var ls = "ALT_Ogame_Statistic_Players_" + url_split[0];
            console.log("[ Time diff (players): " + (TIMEOUT + parseInt(localStorage["ALT_TimeStamp_Players"]) - currentTime_pl) + " ]");
            if ((currentTime_pl > (TIMEOUT + parseInt(localStorage["ALT_TimeStamp_Players"]))) || (localStorage[ls] == null)) {
                localStorage["ALT_TimeStamp_Players"] = currentTime_pl;
                $.when(getHighscoreXML(), getPlayersXML(), getAlliancesXML(), getHonorXML()).done(function (a0, a1, a2, a3) {
                    $("#stat_list_content").html("");
                    result = "";
                    var f = [];
                    f[0] = a0;
                    f[1] = a1;
                    f[2] = a2;
                    f[3] = a3;
                    parseXML_Players(f);
                });
            } else {
                console.log("[ Getting XML Players from cache ]");
                $("#stat_list_content").html("");
                result = localStorage[ls];
                $("#stat_list_content").append(result);
                getTimeTillNextUpdate(localStorage["ALT_TimeStamp_Players"], TIMEOUT);
            }
        });


        //JS Military button binding
        $('#fleet').click(function () {
            var currentTime_mil = new Date().getTime();
            if (localStorage["ALT_TimeStamp_Military"] == null) {
                console.log("[ No 'ALT_TimeStamp_Military' was found. Setting new 'ALT_TimeStamp_Military' ]");
                localStorage["ALT_TimeStamp_Military"] = currentTime_mil;
            }
            $('#fleet').addClass("active");
            $('#points').removeClass("active");
            $('#economy').removeClass("active");
            $('#i > #economy').removeClass("active");
            
            $("#stat_list_content").html("");
            var url_split = window.location.origin.split('.');
            var ls = "ALT_Ogame_Statistic_Military_" + url_split[0];
            console.log("[ Time diff  (military): " + (TIMEOUT + parseInt(localStorage["ALT_TimeStamp_Military"]) - currentTime_mil) + " ]");
            if ((currentTime_mil > (TIMEOUT + parseInt(localStorage["ALT_TimeStamp_Military"]))) || (localStorage[ls] == null)) {
                localStorage["ALT_TimeStamp_Military"] = currentTime_mil;
                $.when(getMilitaryXML(), getPlayersXML(), getAlliancesXML(), getHonorXML()).done(function (a0, a1, a2, a3) {
                    $("#stat_list_content").html("");
                    result = "";
                    var f = [];
                    f[0] = a0;
                    f[1] = a1;
                    f[2] = a2;
                    f[3] = a3;
                    parseXML_Military(f);
                });
            } else {
                console.log("[ Getting XML Military from cache ]");
                $("#stat_list_content").html("");
                
                result = localStorage[ls];
                $("#stat_list_content").append(result);
                getTimeTillNextUpdate(localStorage["ALT_TimeStamp_Military"], TIMEOUT);
            }
        });
        
        //JS Inactive (I) button binding
        $('#economy').click(function () {
            var currentTime_mil = new Date().getTime();
            if (localStorage["ALT_TimeStamp_I"] == null) {
                console.log("[ No 'ALT_TimeStamp_I' was found. Setting new 'ALT_TimeStamp_I' ]");
                localStorage["ALT_TimeStamp_I"] = currentTime_mil;
            }
            var url_split = window.location.origin.split('.');
            var ls = "ALT_Ogame_Statistic_I_" + url_split[0];
            
            $('#fleet').removeClass("active");
            $('#points').removeClass("active");
            $('#economy').addClass("active");
            $('#i > #economy').removeClass("active");
            
            $("#stat_list_content").html("");
            console.log("[ Time diff  (inactive): " + (INACTIVE_PLAYER_TIMEOUT + parseInt(localStorage["ALT_TimeStamp_I"]) - currentTime_mil) + " ]");
            if ((currentTime_mil > (INACTIVE_PLAYER_TIMEOUT + parseInt(localStorage["ALT_TimeStamp_I"]))) || (localStorage[ls] == null)) {
                localStorage["ALT_TimeStamp_I"] = currentTime_mil;
                $.when(getHighscoreXML(), getPlayersXML(), getAlliancesXML(), getHonorXML()).done(function (a0, a1, a2, a3) {
                    $("#stat_list_content").html("");
                    result = "";
                    var f = [];
                    f[0] = a0;
                    f[1] = a1;
                    f[2] = a2;
                    f[3] = a3;
                    parseXML_Inactive(f, true);
                });
            } else {
                console.log("[ Getting XML Inactive (I) from cache ]");
                $("#stat_list_content").html("");
                result = localStorage[ls];
                $("#stat_list_content").append(result);
                getTimeTillNextUpdate(localStorage["ALT_TimeStamp_I"], INACTIVE_PLAYER_TIMEOUT);
            }
        });
        
        //JS Inactive (i) button binding
        $('#i > #economy').click(function () {
            var currentTime_mil = new Date().getTime();
            if (localStorage["ALT_TimeStamp_i"] == null) {
                console.log("[ No 'ALT_TimeStamp_i' was found. Setting new 'ALT_TimeStamp_i' ]");
                localStorage["ALT_TimeStamp_i"] = currentTime_mil;
            }
            var url_split = window.location.origin.split('.');
            var ls = "ALT_Ogame_Statistic_i_" + url_split[0];
            
            $('#fleet').removeClass("active");
            $('#points').removeClass("active");
            $('#economy').removeClass("active");
            $('#i > #economy').addClass("active");
            
            $("#stat_list_content").html("");
            console.log("[ Time diff  (inactive): " + (INACTIVE_PLAYER_TIMEOUT + parseInt(localStorage["ALT_TimeStamp_i"]) - currentTime_mil) + " ]");
            if ((currentTime_mil > (INACTIVE_PLAYER_TIMEOUT + parseInt(localStorage["ALT_TimeStamp_i"]))) || (localStorage[ls] == null)) {
                localStorage["ALT_TimeStamp_i"] = currentTime_mil;
                $.when(getHighscoreXML(), getPlayersXML(), getAlliancesXML(), getHonorXML()).done(function (a0, a1, a2, a3) {
                    $("#stat_list_content").html("");
                    result = "";
                    var f = [];
                    f[0] = a0;
                    f[1] = a1;
                    f[2] = a2;
                    f[3] = a3;
                    parseXML_Inactive(f, false);
                });
            } else {
                console.log("[ Getting XML Inactive (i) from cache ]");
                $("#stat_list_content").html("");
                result = localStorage[ls];
                $("#stat_list_content").append(result);
                getTimeTillNextUpdate(localStorage["ALT_TimeStamp_i"], INACTIVE_PLAYER_TIMEOUT);
            }
        });
    }


})();