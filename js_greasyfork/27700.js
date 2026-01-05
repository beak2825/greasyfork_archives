// ==UserScript==
// @name			Report Helper Modified by Whitepimp007
// @version			1.4.3
// @description		Helps with reports
// @match			https://epicmafia.com/report*
// @grant           GM_xmlhttpRequest
// @grant           GM_getValue
// @grant           GM_setValue
// @namespace https://greasyfork.org/users/105745
// @downloadURL https://update.greasyfork.org/scripts/27700/Report%20Helper%20Modified%20by%20Whitepimp007.user.js
// @updateURL https://update.greasyfork.org/scripts/27700/Report%20Helper%20Modified%20by%20Whitepimp007.meta.js
// ==/UserScript==

//native functions
String.prototype.between=function(from, to) {
    var i=this.indexOf(from)+from.length;
    return this.substring(i, this.indexOf(to, i));
};

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

//element creators
function e_action_button(ref, text) {
    var q = '"';
    return "<a class='redbutton smallfont' href='"+unsafeWindow.location.href+"' onclick="+q+"$.get('"+ref+"');"+q+">"+text+"</a>";
}

//special element creator
function dual_e_action_button(ref, ref2, text) {
    var q = '"';
    return "<a class='redbutton smallfont' href='"+unsafeWindow.location.href+"' onclick="+q+"$.get('"+ref+"');$.get('"+ref2+"');"+q+">"+text+"</a>";
}

function callback_actions() {
    var content="<h3>Report Helper&nbsp;|&nbsp;"+close_button+open_button+prog_button+close_nv_button+"&nbsp;|&nbsp;"+""+"</h3></div><div id='handler' style='margin: 5px; color: #888; display: none;'>last moderated by <span id='modName' style='font-weight: bold;'>The</span></div>";
    modinter.innerHTML=content;
    reportcomment.parentNode.insertBefore(modinter,reportcomment.nextSibling);
}

//modify the report page
if (unsafeWindow.location.href.match("epicmafia.com/report/")) {
    var penalties = {'Cheating' : ['24h suspension', 'lobby ban'],
                     'Copied Mechanics' : ['warning', '1h suspension', '12h suspension', '24h suspension', 'lobby ban'],
                     'Encouraging Rule Breakage' : ['warning', '1h suspension', '12h suspension', '24h suspension', 'lobby ban'],
                     'Game Throwing' : ['24h suspension', '24h suspension', 'lobby ban'],
                     'Game Related Suicide' : ['1h suspension', '12h suspension', '24h suspension', 'lobby ban'],
                     'Insufficient Participation' : ['warning', '1h suspension', '12h suspension', '24h suspension', 'lobby ban'],
                     'Lobby Camping' : ['warning', 'lobby ban'],
                     'Lobby Trolling' : ['warning', 'lobby ban'],
                     'Outside Game Influence' : ['warning', '12h suspension', '24h suspension', 'lobby ban'],
                     'Repeated Suicides' : ['12h suspension', 'lobby ban'],
                     'Spamming' : ['warning', '1h suspension', '12h suspension', '24h suspension', 'lobby ban'],
                     'Trolling' : ['1h suspension', '12h suspension', '24h suspension', 'lobby ban'],
                     'Report Spam' : ['warning', 'ban'],
                     'Bypassing Suspensions' : ['24h suspension', 'ban'],
                     'Exploit Abuse' : ['warning', '12h suspension & 24h forum suspension', '24h suspension & forum, comment, chat ban', 'ban'],
                     'Forum Spam' : ['warning', '24h forum suspension', '24h forum suspension', 'forum, comment, chat ban'],
                     'Harassment' : ['warning', '12h suspension & 24h forum suspension', '24h suspension & forum, comment, chat ban', 'ban'],
                     'Hateful Comments' : ['warning', '12h suspension & 24h forum suspension', '24h suspension & forum, comment, chat ban', 'ban'],
                     'Impersonation' : ['ban'],
                     'Inappropriate Avatar' : ['24h suspension', 'ban'],
                     'Inappropriate Biography' : ['warning', 'warning', 'ban'],
                     'Inappropriate Content' : ['warning', '24h forum suspension', '24h forum suspension', 'forum, comment, chat ban'],
                     'Inappropriate Name' : ['ban'],
                     'Outing Personal Information' : ['24h suspension', 'ban'],
                     'Sharing Account with Banned Users' : ['warning', 'ban'],
                     'Site Spam' : ['warning', 'warning', 'ban'],
                     'X-rated Material' : ['24h forum and/or lobby suspension', 'forum, comment, chat and/or lobby ban']
                    };
    var reporter=document.getElementById('report_users').getElementsByClassName("user user_teeny")[0].outerHTML.between('/user/', '">');
    var reported=document.getElementById('report_users').getElementsByClassName("user user_teeny")[1].outerHTML.between('/user/', '">');
    var report_id=unsafeWindow.location.href.split('/report/')[1];
    
    //penalty table
    var violation_given = document.getElementsByClassName('violation')[0];
    if (violation_given) {
        vio = violation_given.innerHTML;
        var penalty_table = document.createElement('table');
        for (var penalty in penalties[vio]) {
            var penalty_link_line = document.createElement('tr');
            penalty_link_line.className = "smallfont";
            penalty_link_line.innerHTML = String(Number(penalty)+1) + '. ' + penalties[vio][penalty];
            penalty_table.appendChild(penalty_link_line);
        }
        document.getElementById('report_rt').appendChild(penalty_table);
    }
    
    var open_button=e_action_button('https://epicmafia.com/report/'+report_id+'/edit/status?status=open', 'Open');
    var close_button=e_action_button('https://epicmafia.com/report/'+report_id+'/edit/status?status=closed', 'Close');
    var prog_button=e_action_button('https://epicmafia.com/report/'+report_id+'/edit/status?status=processing', 'Process');
    var close_nv_button=dual_e_action_button('https://epicmafia.com/report/'+report_id+'/edit/statement?statement=No+violation', 'https://epicmafia.com/report/'+report_id+'/edit/status?status=closed', 'Novio & Close');
    var modinter=document.createElement("div");
    var reportcomment=document.getElementById("report_msg");
    callback_actions();
    
    var data = GM_getValue("reportKey");
    if (!data) {
        data = {};
    }
    if (data[report_id]) {
        $("#modName").text(data[report_id]);
        $("#handler").show();
    }
    else {
        GM_xmlhttpRequest({
            url: "https://api.myjson.com/bins/26vjs",
            method:"GET",
            onload: function(res) {
                res = JSON.parse(res.responseText);
                var modName = res[report_id];
                if (modName) {
                    $("#modName").text(modName);
                    $("#handler").show();
                }
                GM_setValue("reportKey", res);
            }
        });
    }
}

if (unsafeWindow.location.pathname == "/report") {
    $(".report_status_list").each(function () {
        $(this).append("<option value='duplicate'>Duplicate</option><option value='banned user'>Banned User</option>");
    });
    
    $(".report_status_list").change(function () {
        var report, url,user;
        if ($(this).val() == "duplicate") {
            $("body").css("cursor", "wait");
            report = $(this).parent().parent().parent().attr("id").split("_")[1];
            url = prompt("Enter report to link to:");
            if (url) {
                $.get("https://epicmafia.com/report/" + report + "/edit/statement?statement=Duplicate - " + url, function () {
                    $.get("https://epicmafia.com/report/" + report + "/edit/status?status=closed", function () {
                        window.location.reload();
                    });
                });
            }
            else {
                window.location.reload();
            }
        }
        else if ($(this).val() == "banned user") {
            $("body").css("cursor", "wait");
            report = $(this).parent().parent().parent().attr("id").split("_")[1];
            user = $(this).parent().parent().parent().find(".report_user2").attr("href").split("/")[2];
            $.get("https://epicmafia.com/report/" + report + "/edit/statement?statement=Banned user", function () {
                $.post("/violation", {
                    'user_id': user,
                    'report_id': report,
                    'siterule_id': 54
                }, function () {
                    $.get("https://epicmafia.com/moderator/action/suspend_account_all/user/" + user, function () {
                        $.get("https://epicmafia.com/report/" + report + "/edit/status?status=closed", function () {
                            window.location.reload();
                        });
                    });
                });
            });
        }
    });
}