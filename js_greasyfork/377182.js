// ==UserScript==
// @name            TM Match Infos
// @version         0.9.2024090501
// @author          Andrizz aka Banana aka Jimmy il Fenomeno (club ID: 3257254) (based on "RatingR5" by CHU-CHI, "TM Routine Line Sharing" by Matteo Tomassetti (Polverigi FC) and "TrophyManager - Super Club Squad" by Joao Manuel Ferreira Fernandes ,汉化 by 太原龙城足球俱乐部)
// @description     显示球员经验分享之后的经验、评星、R5评分、门将防守评分。   Shows players' routine (after sharing system), rec, ratingR5 and defense/assist/shooting/possession/Gk+Def. bonuses in the match page
// @include	    *trophymanager.com/matches/*
// @license         MIT
// @namespace https://greasyfork.org/users/15590
// @downloadURL https://update.greasyfork.org/scripts/377182/TM%20Match%20Infos.user.js
// @updateURL https://update.greasyfork.org/scripts/377182/TM%20Match%20Infos.meta.js
// ==/UserScript==

function runAfterElementExists(jquery_selector,callback){
    var checker = window.setInterval(function() {
        if ($(jquery_selector).length) {
            clearInterval(checker);
            callback();
        }
    }, 200);
}

setTimeout(function() {
    if (document.getElementsByClassName("go_to_report")[0]) {
        var ele = ".mega_headline.tcenter.report_section_header.dark_bg";
    } else if ($("div.buttons.text_center:has(img[src$='/pics/matchviewer/live_badge.png'])").length > 0) {
        ele = ".mega_headline.tcenter.report_section_header.dark_bg";
    } else {
        ele = ".field_tab";
    }
    runAfterElementExists(ele, function() { showButton(); });
}, 3000);

function showButton() {
    if ($("#DivInfo").length == 0) {
        var DivInfo = document.createElement("div");
        DivInfo.id = "DivInfo";
        DivInfo.style = "width:100%; text-align:center; margin-bottom:10px; height: 33px;";
        DivInfo.innerHTML = "<div id='DivHomeStyle' style='float:left; width:40%'>&nbsp;</div><div id='DivButton' style='float:left; width:20%'></div><div id='DivAwayStyle' style='float:left; width:40%'>&nbsp;</div>";
        $("div.quarter:first").before(DivInfo);
    }
    var btnInfo = document.createElement("button");
    btnInfo.id = "btnInfo";
    btnInfo.className = "button";
    btnInfo.innerHTML = "显示详细信息";
    btnInfo.style = "width:190px; text-transform:none;";
    $(btnInfo).click(function() { moreInfo(); avgInfo(); })
    $(btnInfo).appendTo("#DivButton");
};

function hideButton(field) {
    setTimeout(function() {
        var btnField = document.createElement("button");
        btnField.className = "button";
        btnField.id = "btnField";
        btnField.style = "width:190px; text-transform:none;";
        btnField.innerHTML = "隐藏详细信息";
        btnField.onclick = function() {
            $(".ROU").remove();
            $(".REC").remove();
            $(".RR5").remove();
            $(".sGK").remove();
            $(".sDEF").remove();
            $(".sASS").remove();
            $(".sFIN").remove();
            $(".avgDiv").remove();
            $(".avgPoss").remove();
            $(".GkBon").remove();
            $("div.quarter").css({"width":"220px","text-align":"center"});
            $("ul.player_list.underlined_slim.tleft:first").css({"padding-left":"10px","padding-right":"10px"});
            $("ul.player_list.underlined_slim.tleft:eq(1)").css({"padding-left":"10px","padding-right":"10px"});
            $(".name").css("width","160px");
            $("div.quarter:first").after(field); // show the field again
            $(".pog").each(function() {
                var PID = $(this).attr("player_id");
                $(this)
                    .tooltip(function() {
                    return make_player_link(PID, miniGameId);
                })
                    .click(function() {
                    window.open("/players/"+PID+"/");
                })
            })
            $(".StyleButton").remove();
            $("#DivHomeStyle").html("&nbsp;");
            $("#DivAwayStyle").html("&nbsp;");
            $("#btnField").remove();
            showButton();
        }
        $(btnField).appendTo("#DivButton");
    }, 3000);
}
// R5 weights		Str				Sta				Pac				Mar				Tac				Wor				Pos				Pas				Cro				Tec				Hea				Fin				Lon				Set
var weightR5 = [[	0.41029304	,	0.18048062	,	0.56730138	,	1.06344654	,	1.02312672	,	0.40831256	,	0.58235457	,	0.12717479	,	0.05454137	,	0.09089830	,	0.42381693	,	0.04626272	,	0.02199046	,	0.00000000	],	// DC
                [	0.42126371	,	0.18293193	,	0.60567629	,	0.91904794	,	0.89070915	,	0.40038476	,	0.56146633	,	0.15053902	,	0.15955429	,	0.15682932	,	0.42109742	,	0.09460329	,	0.03589655	,	0.00000000	],	// DL/R
                [	0.23412419	,	0.32032289	,	0.62194779	,	0.63162534	,	0.63143081	,	0.45218831	,	0.47370658	,	0.55054737	,	0.17744915	,	0.39932519	,	0.26915814	,	0.16413124	,	0.07404301	,	0.00000000	],	// DMC
                [	0.27276905	,	0.26814289	,	0.61104798	,	0.39865092	,	0.42862643	,	0.43582015	,	0.46617076	,	0.44931076	,	0.25175412	,	0.46446692	,	0.29986350	,	0.43843061	,	0.21494592	,	0.00000000	],	// DML/R
                [	0.25219260	,	0.25112993	,	0.56090649	,	0.18230261	,	0.18376490	,	0.45928749	,	0.53498118	,	0.59461481	,	0.09851189	,	0.61601950	,	0.31243959	,	0.65402884	,	0.29982016	,	0.00000000	],	// MC
                [	0.28155678	,	0.24090675	,	0.60680245	,	0.19068879	,	0.20018012	,	0.45148647	,	0.48230007	,	0.42982389	,	0.26268609	,	0.57933805	,	0.31712419	,	0.65824985	,	0.29885649	,	0.00000000	],	// ML/R
                [	0.22029884	,	0.29229690	,	0.63248227	,	0.09904394	,	0.10043602	,	0.47469498	,	0.52919791	,	0.77555880	,	0.10531819	,	0.71048302	,	0.27667115	,	0.56813972	,	0.21537826	,	0.00000000	],	// OMC
                [	0.21151292	,	0.35804710	,	0.88688492	,	0.14391236	,	0.13769621	,	0.46586605	,	0.34446036	,	0.51377701	,	0.59723919	,	0.75126119	,	0.16550722	,	0.29966502	,	0.12417045	,	0.00000000	],	// OML/R
                [	0.35479780	,	0.14887553	,	0.43273380	,	0.00023928	,	0.00021111	,	0.46931131	,	0.57731335	,	0.41686333	,	0.05607604	,	0.62121195	,	0.45370457	,	1.03660702	,	0.43205492	,	0.00000000	],	// F
                [	0.45462811	,	0.30278232	,	0.45462811	,	0.90925623	,	0.45462811	,	0.90925623	,	0.45462811	,	0.45462811	,	0.30278232	,	0.15139116	,	0.15139116	]];	// GK
// RECb weights		Str				Sta				Pac				Mar				Tac				Wor				Pos				Pas				Cro				Tec				Hea				Fin				Lon				Set
var weightRb = [[	0.10493615	,	0.05208547	,	0.07934211	,	0.14448971	,	0.13159554	,	0.06553072	,	0.07778375	,	0.06669303	,	0.05158306	,	0.02753168	,	0.12055170	,	0.01350989	,	0.02549169	,	0.03887550	],	// DC
                [	0.07715535	,	0.04943315	,	0.11627229	,	0.11638685	,	0.12893778	,	0.07747251	,	0.06370799	,	0.03830611	,	0.10361093	,	0.06253997	,	0.09128094	,	0.01314110	,	0.02449199	,	0.03726305	],	// DL/R
                [	0.08219824	,	0.08668831	,	0.07434242	,	0.09661001	,	0.08894242	,	0.08998026	,	0.09281287	,	0.08868309	,	0.04753574	,	0.06042619	,	0.05396986	,	0.05059984	,	0.05660203	,	0.03060871	],	// DMC
                [	0.06744248	,	0.06641401	,	0.09977251	,	0.08253749	,	0.09709316	,	0.09241026	,	0.08513703	,	0.06127851	,	0.10275520	,	0.07985941	,	0.04618960	,	0.03927270	,	0.05285911	,	0.02697852	],	// DML/R
                [	0.07304213	,	0.08174111	,	0.07248656	,	0.08482334	,	0.07078726	,	0.09568392	,	0.09464529	,	0.09580381	,	0.04746231	,	0.07093008	,	0.04595281	,	0.05955544	,	0.07161249	,	0.03547345	],	// MC
                [	0.06527363	,	0.06410270	,	0.09701305	,	0.07406706	,	0.08563595	,	0.09648566	,	0.08651209	,	0.06357183	,	0.10819222	,	0.07386495	,	0.03245554	,	0.05430668	,	0.06572005	,	0.03279859	],	// ML/R
                [	0.07842736	,	0.07744888	,	0.07201150	,	0.06734457	,	0.05002348	,	0.08350204	,	0.08207655	,	0.11181914	,	0.03756112	,	0.07486004	,	0.06533972	,	0.07457344	,	0.09781475	,	0.02719742	],	// OMC
                [	0.06545375	,	0.06145378	,	0.10503536	,	0.06421508	,	0.07627526	,	0.09232981	,	0.07763931	,	0.07001035	,	0.11307331	,	0.07298351	,	0.04248486	,	0.06462713	,	0.07038293	,	0.02403557	],	// OML/R
                [	0.07738289	,	0.05022488	,	0.07790481	,	0.01356516	,	0.01038191	,	0.06495444	,	0.07721954	,	0.07701905	,	0.02680715	,	0.07759692	,	0.12701687	,	0.15378395	,	0.12808992	,	0.03805251	],	// F
                [	0.07466384	,	0.07466384	,	0.07466384	,	0.14932769	,	0.10452938	,	0.14932769	,	0.10452938	,	0.10344411	,	0.07512610	,	0.04492581	,	0.04479831	]];	// GK

function funFix1 (i) {
	i = (Math.round(i*10)/10).toFixed(1);
	return i;
}

function funFix2 (i) {
	i = (Math.round(i*100)/100).toFixed(2);
	return i;
}

function funFix3 (i) {
	i = (Math.round(i*1000)/1000).toFixed(3);
	return i;
}

function get_information(link, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", link, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            callback(xhr.responseText);
        }
    };
    xhr.send(null);
}

function addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}
function compareByRoutineAsc(a, b) {
    var rou_a = parseFloat(a.ROU);
    var rou_b = parseFloat(b.ROU);
    return (rou_a - rou_b);
}

function moreInfo() {
    $("#btnInfo").remove();
    var field = $("div.half:has(div.field_tab)"); // clone the field div
    var fieldCopy = $(field).clone();
    var mid = document.URL.split(".com/")[1].split("/")[1].split("#")[0].split("?")[0];
    var url = "https://trophymanager.com/ajax/match.ajax.php?id="+mid;
    get_information(url, function(text) {
        var data = JSON.parse(text);
        var homeD = new Array();
        var homeM = new Array();
        var homeF = new Array();
        var awayD = new Array();
        var awayM = new Array();
        var awayF = new Array();
        var prematch = data.prematch;
        var homeCap = data.match_data.captain.home;
        var awayCap = data.match_data.captain.away;
        var hStyle = data.match_data.attacking_style.home;
        if (hStyle == null || hStyle == 0) hStyle = 1;
        var aStyle = data.match_data.attacking_style.away;
        if (aStyle == null || aStyle == 0) aStyle = 1;
        var homeLogo = data.club.home.logo_small;
        var homeName = data.club.home.club_name;
        var awayLogo = data.club.away.logo_small;
        var awayName = data.club.away.club_name;
        var homeStyle = '<div class="StyleButton"><label for="home_attacking_select">主队进攻方式</label><select id="home_attacking_select" autocomplete="off" aria-disabled="false" style="display: none;"><option value="1">平衡</option><option value="2">直接</option><option value="3">边路</option><option value="4">短传</option><option value="5">长传</option><option value="6">直传</option></select><img title="'+homeName+'" src="'+homeLogo+'" style="vertical-align:middle; padding-left:5px;"></div>';
        $("#DivHomeStyle").html(homeStyle);
        $("#home_attacking_select").find('option[value="'+hStyle+'"]').attr("selected",true);
        $("#home_attacking_select").selectmenu({ style: "popup", width: 160 });
        $("#home_attacking_select").on('change', function() { updateStyle(); avgInfo(); });
        var awayStyle = '<div class="StyleButton"><img title="'+awayName+'" src="'+awayLogo+'" style="vertical-align:middle; padding-right:5px;"><select id="away_attacking_select" autocomplete="off" aria-disabled="false" style="display: none;"><option value="1">平衡</option><option value="2">直接</option><option value="3">边路</option><option value="4">短传</option><option value="5">长传</option><option value="6">直传</option></select><label for="away_attacking_select"> 客队进攻方式</label></div>';
        $("#DivAwayStyle").html(awayStyle);
        $("#away_attacking_select").find('option[value="'+aStyle+'"]').attr("selected",true);
        $("#away_attacking_select").selectmenu({ style: "popup", width: 160 });
        $("#away_attacking_select").on('change', function() { updateStyle(); avgInfo(); });
        var StyleValues = [];
        // get the lineup for each team:
        $(".player_field").find(".pog").each(function(index) {
            var PlayerID = $(this).attr("player_id");
            if (index < 11) {
                var ROU = parseFloat(data.lineup.home[""+PlayerID+""].routine);
                var ROLE = data.lineup.home[""+PlayerID+""].position;
                if (ROLE == "gk" || ROLE == "dl" || ROLE == "dr" || ROLE == "dc" || ROLE == "dcl" || ROLE == "dcr") {
                    homeD.push({ "ID" : PlayerID, "ROLE" : ROLE, "ROU": ROU });
                } else if (ROLE == "dml" || ROLE == "dmr" || ROLE == "dmc" || ROLE == "dmcl" || ROLE == "dmcr" || ROLE == "ml" || ROLE == "mr" || ROLE == "mc" || ROLE == "mcl" || ROLE == "mcr") {
                    homeM.push({ "ID" : PlayerID, "ROLE" : ROLE, "ROU": ROU });
                } else {
                    homeF.push({ "ID" : PlayerID, "ROLE" : ROLE, "ROU": ROU });
                }
            } else {
                ROU = parseFloat(data.lineup.away[""+PlayerID+""].routine);
                ROLE = data.lineup.away[""+PlayerID+""].position;
                if (ROLE == "gk" || ROLE == "dl" || ROLE == "dr" || ROLE == "dc" || ROLE == "dcl" || ROLE == "dcr") {
                    awayD.push({"ID" : PlayerID, "ROLE" : ROLE, "ROU": ROU });
                } else if (ROLE == "dml" || ROLE == "dmr" || ROLE == "dmc" || ROLE == "dmcl" || ROLE == "dmcr" || ROLE == "ml" || ROLE == "mr" || ROLE == "mc" || ROLE == "mcl" || ROLE == "mcr") {
                    awayM.push({"ID" : PlayerID, "ROLE" : ROLE, "ROU": ROU });
                } else {
                    awayF.push({"ID" : PlayerID, "ROLE" : ROLE, "ROU": ROU });
                }
            }
        });
        // calculate home team routine:
        var share_bonus = 0.25;
        var routine_cap = 40.0;
        var line_size = homeD.length;
        if (line_size > 1) {
            homeD.sort(compareByRoutineAsc);
            var min = homeD[0].ROU;
            if (min < routine_cap) {
                var max = homeD[line_size - 1].ROU;
                var min2 = homeD[1].ROU;
                var bonus = max * share_bonus;
                var new_routine = min + bonus;
                new_routine = (new_routine < min2 ? new_routine : min2);
                new_routine = (new_routine < routine_cap ? new_routine : routine_cap);
                new_routine = parseFloat(new_routine.toFixed(1));
                homeD[0].ROU = new_routine;
            }
        }
        line_size = homeM.length;
        if (line_size > 1) {
            homeM.sort(compareByRoutineAsc);
            min = homeM[0].ROU;
            if (min < routine_cap) {
                max = homeM[line_size - 1].ROU;
                min2 = homeM[1].ROU;
                bonus = max * share_bonus;
                new_routine = min + bonus;
                new_routine = (new_routine < min2 ? new_routine : min2);
                new_routine = (new_routine < routine_cap ? new_routine : routine_cap);
                new_routine = parseFloat(new_routine.toFixed(1));
                homeM[0].ROU = new_routine;
            }
        }
        line_size = homeF.length;
        if (line_size > 1) {
            homeF.sort(compareByRoutineAsc);
            min = homeF[0].ROU;
            if (min < routine_cap) {
                max = homeF[line_size - 1].ROU;
                min2 = homeF[1].ROU;
                bonus = max * share_bonus;
                new_routine = min + bonus;
                new_routine = (new_routine < min2 ? new_routine : min2);
                new_routine = (new_routine < routine_cap ? new_routine : routine_cap);
                new_routine = parseFloat(new_routine.toFixed(1));
                homeF[0].ROU = new_routine;
            }
        }
        // calculate away team routine:
        line_size = awayD.length;
        if (line_size > 1) {
            awayD.sort(compareByRoutineAsc);
            min = awayD[0].ROU;
            if (min < routine_cap) {
                max = awayD[line_size - 1].ROU;
                min2 = awayD[1].ROU;
                bonus = max * share_bonus;
                new_routine = min + bonus;
                new_routine = (new_routine < min2 ? new_routine : min2);
                new_routine = (new_routine < routine_cap ? new_routine : routine_cap);
                new_routine = parseFloat(new_routine.toFixed(1));
                awayD[0].ROU = new_routine;
            }
        }
        line_size = awayM.length;
        if (line_size > 1) {
            awayM.sort(compareByRoutineAsc);
            min = awayM[0].ROU;
            if (min < routine_cap) {
                max = awayM[line_size - 1].ROU;
                min2 = awayM[1].ROU;
                bonus = max * share_bonus;
                new_routine = min + bonus;
                new_routine = (new_routine < min2 ? new_routine : min2);
                new_routine = (new_routine < routine_cap ? new_routine : routine_cap);
                new_routine = parseFloat(new_routine.toFixed(1));
                awayM[0].ROU = new_routine;
            }
        }
        line_size = awayF.length;
        if (line_size > 1) {
            awayF.sort(compareByRoutineAsc);
            min = awayF[0].ROU;
            if (min < routine_cap) {
                max = awayF[line_size - 1].ROU;
                min2 = awayF[1].ROU;
                bonus = max * share_bonus;
                new_routine = min + bonus;
                new_routine = (new_routine < min2 ? new_routine : min2);
                new_routine = (new_routine < routine_cap ? new_routine : routine_cap);
                new_routine = parseFloat(new_routine.toFixed(1));
                awayF[0].ROU = new_routine;
            }
        }
        // create a new array with all players for each team:
        var home_team = new Array();
        for (var i=0;i<homeD.length;i++) {
            var ID = homeD[i].ID;
            var ROLE = homeD[i].ROLE;
            var ROU = homeD[i].ROU;
            home_team.push({"ID" : ID, "ROLE" : ROLE, "ROU" : ROU});
        }
        for (i=0;i<homeM.length;i++) {
            ID = homeM[i].ID;
            ROLE = homeM[i].ROLE;
            ROU = homeM[i].ROU;
            home_team.push({"ID" : ID, "ROLE" : ROLE, "ROU" : ROU});
        }
        for (i=0;i<homeF.length;i++) {
            ID = homeF[i].ID;
            ROLE = homeF[i].ROLE;
            ROU = homeF[i].ROU;
            home_team.push({"ID" : ID, "ROLE" : ROLE, "ROU" : ROU});
        }
        var away_team = new Array();
        for (i=0;i<awayD.length;i++) {
            ID = awayD[i].ID;
            ROLE = awayD[i].ROLE;
            ROU = awayD[i].ROU;
            away_team.push({"ID" : ID, "ROLE" : ROLE, "ROU" : ROU});
        }
        for (i=0;i<awayM.length;i++) {
            ID = awayM[i].ID;
            ROLE = awayM[i].ROLE;
            ROU = awayM[i].ROU;
            away_team.push({"ID" : ID, "ROLE" : ROLE, "ROU" : ROU});
        }
        for (i=0;i<awayF.length;i++) {
            ID = awayF[i].ID;
            ROLE = awayF[i].ROLE;
            ROU = awayF[i].ROU;
            away_team.push({"ID" : ID, "ROLE" : ROLE, "ROU" : ROU});
        }
        var hAge = 0; var hAsi = 0;
        var aAge = 0; var aAsi = 0;
        var hGain = 0; var hKeep = 0;
        var aGain = 0; var aKeep = 0;
        var hGKskills = [];
        var hGKrou = 0; var hGKasi = 0;
        var hDIF = 0; var hDIFrou = 0;
        var hSTR = 0; var hPAC = 0; var hMAR = 0; var hTAC = 0; var hWOR = 0; var hPOS = 0; var hHEA = 0; // DIF-bonus for home GK's REC
        var aGKskills = [];
        var aGKrou = 0; var aGKasi = 0;
        var aDIF = 0; var aDIFrou = 0;
        var aSTR = 0; var aPAC = 0; var aMAR = 0; var aTAC = 0; var aWOR = 0; var aPOS = 0; var aHEA = 0; // DIF-bonus for away GK's REC
        // for each player on the field:
        $(".player_field").find(".pog").each(function(index) {
            var PlayerID = $(this).attr("player_id");
            // show captain's icon:
            if (prematch !== true) {
                if ($(".CAP").length < 2) {
                    if (PlayerID == homeCap || PlayerID == awayCap) {
                        $("a[href$='/players/"+PlayerID+"'] > div.icons").prepend("<div class='CAP' style='margin-left:3px; font-size:15px; font-weight:bold; color:greenyellow;'>©</span>");
                    }
                }
            }
            // get each player's info:
            $.ajaxSetup({async: false});
            $.post("/ajax/tooltip.ajax.php",{async:false,"player_id":PlayerID},function(data){
                data = JSON.parse(data);
                var Age = data.player.age;
                var Months = data.player.months;
                var age = Age*1+Months/12;
                var Status = data.player.status_no_count;
                var ASI = data.player.skill_index;
                var asi = ASI.replace(",","");
                if (index < 11) {
                    for (var i=0;i<home_team.length;i++) {
                        if (PlayerID == home_team[i].ID) { var ROU = home_team[i].ROU; var ROLE = home_team[i].ROLE; }
                    }
                } else {
                    for (i=0;i<away_team.length;i++) {
                        if (PlayerID == away_team[i].ID) { ROU = away_team[i].ROU; ROLE = away_team[i].ROLE; }
                    }
                }
                var STR = String(data.player.skills[0].value);
                var STA = String(data.player.skills[2].value);
                var PAC = String(data.player.skills[4].value);
                if (ROLE == "gk") {
                    var HAN = String(data.player.skills[1].value);
                    var ONE = String(data.player.skills[3].value);
                    var REF = String(data.player.skills[5].value);
                    var AER = String(data.player.skills[7].value);
                    var JUM = String(data.player.skills[9].value);
                    var COM = String(data.player.skills[11].value);
                    var KIC = String(data.player.skills[13].value);
                    var THR = String(data.player.skills[15].value);
                    var skills = [STR,STA,PAC,HAN,ONE,REF,AER,JUM,COM,KIC,THR];
                    if (index < 11) { hGKskills = skills; hGKasi = asi; hGKrou = ROU; hAge += age*1; hAsi += asi*1; }
                    else { aGKskills = skills; aGKasi = asi; aGKrou = ROU; aAge += age*1; aAsi += asi*1; }
                } else {
                    var MAR = String(data.player.skills[6].value);
                    var TAC = String(data.player.skills[8].value);
                    var WOR = String(data.player.skills[10].value);
                    var POS = String(data.player.skills[12].value);
                    var PAS = String(data.player.skills[1].value);
                    var CRO = String(data.player.skills[3].value);
                    var TEC = String(data.player.skills[5].value);
                    var HEA = String(data.player.skills[7].value);
                    var FIN = String(data.player.skills[9].value);
                    var LON = String(data.player.skills[11].value);
                    var SET = String(data.player.skills[13].value);
                    skills = [STR,STA,PAC,MAR,TAC,WOR,POS,PAS,CRO,TEC,HEA,FIN,LON,SET];
                }
                for (i = 0; i<skills.length; i++) {
                    if (skills[i].indexOf("<img") != -1) { skills[i] = skills[i].match(/\d+/); }
                }
                var skillSum = 0;
                for (i = 0; i < skills.length; i++) { skillSum += parseInt(skills[i]); }
                var posNames = ["dc","dcl","dcr","dl","dr","dmc","dmcl","dmcr","dml","dmr","mc","mcl","mcr","ml","mr","omc","omcl","omcr","oml","omr","fc","fcl","fcr","gk"];
                var pos = [0,0,0,1,1,2,2,2,3,3,4,4,4,5,5,6,6,6,7,7,8,8,8,9];
                for (i = 0; i<posNames.length; i++) { if (posNames[i] == ROLE) var fp = pos[i]; }
                // get DEF's skills
                if (index < 11) { // home team
                    if (fp == 0 || fp == 1) {
                        hDIF += 1;
                        hDIFrou += ROU*1;
                        hSTR += STR.match(/\d+/)*1;
                        hPAC += PAC.match(/\d+/)*1;
                        hMAR += MAR.match(/\d+/)*1;
                        hTAC += TAC.match(/\d+/)*1;
                        hWOR += WOR.match(/\d+/)*1;
                        hPOS += POS.match(/\d+/)*1;
                        hHEA += HEA.match(/\d+/)*1;
                    }
                } else { // away team
                    if (fp == 0 || fp == 1) {
                        aDIF += 1;
                        aDIFrou += ROU*1;
                        aSTR += STR.match(/\d+/)*1;
                        aPAC += PAC.match(/\d+/)*1;
                        aMAR += MAR.match(/\d+/)*1;
                        aTAC += TAC.match(/\d+/)*1;
                        aWOR += WOR.match(/\d+/)*1;
                        aPOS += POS.match(/\d+/)*1;
                        aHEA += HEA.match(/\d+/)*1;
                    }
                }

                if (ROLE == "gk") { var weight = 48717927500; }
                else { weight = 263533760000; }
                var remainder = Math.round((Math.pow(2,Math.log(weight*asi)/Math.log(Math.pow(2,7))) - skillSum)*10)/10; // RatingR5 remainder
                var rou2 = (3/100) * (100-(100) * Math.pow(Math.E, -ROU*0.035));
                var goldstar = 0;
                var skillsB = [];
                for (var j = 0; j < 2; j++) {
                    for (i = 0; i < 14; i++) {
                        if (j == 0 && skills[i] == 20) goldstar++;
                        if (j == 1) {
                            if (skills[i] != 20) skillsB[i] = skills[i] * 1 + remainder / (14 - goldstar);
                            else skillsB[i] = skills[i];
                        }
                    }
                }
                var strRou = skillsB[0]*1+rou2;
                var staRou = skillsB[1]*1;
                var pacRou = skillsB[2]*1+rou2;
                var marRou = skillsB[3]*1+rou2;
                var tacRou = skillsB[4]*1+rou2;
                var worRou = skillsB[5]*1+rou2;
                var posRou = skillsB[6]*1+rou2;
                var pasRou = skillsB[7]*1+rou2;
                var croRou = skillsB[8]*1+rou2;
                var tecRou = skillsB[9]*1+rou2;
                var heaRou = skillsB[10]*1+rou2;
                var finRou = skillsB[11]*1+rou2;
                var lonRou = skillsB[12]*1+rou2;
                var setRou = skillsB[13]*1+rou2;

                if (heaRou > 12) var headerBonus = funFix2((Math.pow(Math.E, (heaRou-10)**3/1584.77)-1)*0.8 + Math.pow(Math.E, (strRou*strRou*0.007)/8.73021)*0.15 + Math.pow(Math.E, (posRou*posRou*0.007)/8.73021)*0.05);
                else headerBonus = 0;
                var fkBonus = funFix2(Math.pow(Math.E, Math.pow(setRou+lonRou+tecRou*0.5, 2)*0.002)/327.92526);
                var ckBonus = funFix2(Math.pow(Math.E, Math.pow(setRou+croRou+tecRou*0.5, 2)*0.002)/983.65770);
                var pkBonus = funFix2(Math.pow(Math.E, Math.pow(setRou+finRou+tecRou*0.5, 2)*0.002)/1967.31409);
                var gainBase = funFix2((strRou**2+staRou**2*0.5+pacRou**2*0.5+marRou**2+tacRou**2+worRou**2+posRou**2)/6/22.9**2);
                var keepBase = funFix2((strRou**2*0.5+staRou**2*0.5+pacRou**2+marRou**2+tacRou**2+worRou**2+posRou**2)/6/22.9**2);
                              //   0:DC			  1:DL/R		   2:DMC		   3:DML/R		   4:MC			  5:ML/R		  6:OMC			 7:OML/R			8:F
                var posGain = [	gainBase*0.3, 	gainBase*0.3, 	gainBase*0.9, 	gainBase*0.6, 	gainBase*1.5, 	gainBase*0.9, 	gainBase*0.9, 	gainBase*0.6, 	gainBase*0.3];
                var posKeep = [	keepBase*0.3,	keepBase*0.3, 	keepBase*0.9, 	keepBase*0.6, 	keepBase*1.5, 	keepBase*0.9, 	keepBase*0.9, 	keepBase*0.6, 	keepBase*0.3];
                if (fp != 9) {
                    if (index < 11) {
                        hGain += posGain[fp]*1; hKeep += posKeep[fp]*1; hAge += age*1; hAsi += asi*1;
                    } else {
                        aGain += posGain[fp]*1; aKeep += posKeep[fp]*1; aAge += age*1; aAsi += asi*1;
                    }
                }
                if (skills.length == 11) var allBonus = 0;
                else allBonus = headerBonus*1 + fkBonus*1 + ckBonus*1 + pkBonus*1;
                // calculate defense, assist and shooting bonuses by attacking style:
                // R5 Assist		0:Str			1:Sta			2:Pac			3:Mar			4:Tac			5:Wor			6:Pos			7:Pas			8:Cro			9:Tec
                var weightADir = [[	0.00000000	,	0.02032826	,	0.04743261	,	0.00000000	,	0.00000000	,	0.01355217	,	0.01355217	,	0.04065652	,	0.00000000	,	0.02710435	],	//DC
                                  [	0.00000000	,	0.03709181	,	0.08654755	,	0.00000000	,	0.00000000	,	0.02472787	,	0.02472787	,	0.07418362	,	0.00000000	,	0.04945574	],	//DLR
                                  [	0.00000000	,	0.04099186	,	0.09564768	,	0.00000000	,	0.00000000	,	0.02732791	,	0.02732791	,	0.08198373	,	0.00000000	,	0.05465582	],	//DMC
                                  [	0.00000000	,	0.05537191	,	0.12920113	,	0.00000000	,	0.00000000	,	0.03691461	,	0.03691461	,	0.11074383	,	0.00000000	,	0.07382922	],	//DMLR
                                  [	0.00000000	,	0.12500000	,	0.29166667	,	0.00000000	,	0.00000000	,	0.08333333	,	0.08333333	,	0.25000000	,	0.00000000	,	0.16666667	],	//MC
                                  [	0.00000000	,	0.01565766	,	0.03653455	,	0.00000000	,	0.00000000	,	0.01043844	,	0.01043844	,	0.03131533	,	0.00000000	,	0.02087689	],	//MLR
                                  [	0.00000000	,	0.04289270	,	0.10008296	,	0.00000000	,	0.00000000	,	0.02859513	,	0.02859513	,	0.08578540	,	0.00000000	,	0.05719026	],	//OMC
                                  [	0.00000000	,	0.08686786	,	0.20269168	,	0.00000000	,	0.00000000	,	0.05791191	,	0.05791191	,	0.17373573	,	0.00000000	,	0.11582382	],	//OMLR
                                  [	0.00000000	,	0.02105888	,	0.04913738	,	0.00000000	,	0.00000000	,	0.01403925	,	0.01403925	,	0.04211775	,	0.00000000	,	0.02807850	]];	//F

                var weightAWin = [[	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DC
                                  [	0.01258035	,	0.02516069	,	0.07548208	,	0.00000000	,	0.00000000	,	0.02516069	,	0.00000000	,	0.00000000	,	0.10064277	,	0.05032138	],	//DLR
                                  [	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DMC
                                  [	0.00805548	,	0.01611096	,	0.04833289	,	0.00000000	,	0.00000000	,	0.01611096	,	0.00000000	,	0.00000000	,	0.06444385	,	0.03222193	],	//DMLR
                                  [	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//MC
                                  [	0.01571086	,	0.03142171	,	0.09426514	,	0.00000000	,	0.00000000	,	0.03142171	,	0.00000000	,	0.00000000	,	0.12568685	,	0.06284342	],	//MLR
                                  [	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//OMC
                                  [	0.04347826	,	0.08695652	,	0.26086957	,	0.00000000	,	0.00000000	,	0.08695652	,	0.00000000	,	0.00000000	,	0.34782609	,	0.17391304	],	//OMLR
                                  [	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	]];	//F

                var weightASho = [[	0.00000000	,	0.01087937	,	0.01087937	,	0.00000000	,	0.00000000	,	0.01087937	,	0.01087937	,	0.03807781	,	0.00000000	,	0.03263812	],	//DC
                                  [	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DLR
                                  [	0.00000000	,	0.02620518	,	0.02620518	,	0.00000000	,	0.00000000	,	0.02620518	,	0.02620518	,	0.09171812	,	0.00000000	,	0.07861553	],	//DMC
                                  [	0.00000000	,	0.01720760	,	0.01720760	,	0.00000000	,	0.00000000	,	0.01720760	,	0.01720760	,	0.06022661	,	0.00000000	,	0.05162281	],	//DMLR
                                  [	0.00000000	,	0.06519303	,	0.06519303	,	0.00000000	,	0.00000000	,	0.06519303	,	0.06519303	,	0.22817562	,	0.00000000	,	0.19557910	],	//MC
                                  [	0.00000000	,	0.02776433	,	0.02776433	,	0.00000000	,	0.00000000	,	0.02776433	,	0.02776433	,	0.09717515	,	0.00000000	,	0.08329299	],	//MLR
                                  [	0.00000000	,	0.09523810	,	0.09523810	,	0.00000000	,	0.00000000	,	0.09523810	,	0.09523810	,	0.33333333	,	0.00000000	,	0.28571429	],	//OMC
                                  [	0.00000000	,	0.04793546	,	0.04793546	,	0.00000000	,	0.00000000	,	0.04793546	,	0.04793546	,	0.16777412	,	0.00000000	,	0.14380639	],	//OMLR
                                  [	0.00000000	,	0.05306295	,	0.05306295	,	0.00000000	,	0.00000000	,	0.05306295	,	0.05306295	,	0.18572031	,	0.00000000	,	0.15918884	]];	//F

                var weightALon = [[	0.00000000	,	0.06111197	,	0.00000000	,	0.00000000	,	0.00000000	,	0.06111197	,	0.06111197	,	0.24444789	,	0.18333592	,	0.12222395	],	//DC
                                  [	0.00000000	,	0.06073556	,	0.00000000	,	0.00000000	,	0.00000000	,	0.06073556	,	0.06073556	,	0.24294223	,	0.18220667	,	0.12147111	],	//DLR
                                  [	0.00000000	,	0.08279697	,	0.00000000	,	0.00000000	,	0.00000000	,	0.08279697	,	0.08279697	,	0.33118787	,	0.24839090	,	0.16559393	],	//DMC
                                  [	0.00000000	,	0.08333333	,	0.00000000	,	0.00000000	,	0.00000000	,	0.08333333	,	0.08333333	,	0.33333333	,	0.25000000	,	0.16666667	],	//DMLR
                                  [	0.00000000	,	0.02461107	,	0.00000000	,	0.00000000	,	0.00000000	,	0.02461107	,	0.02461107	,	0.09844428	,	0.07383321	,	0.04922214	],	//MC
                                  [	0.00000000	,	0.04562034	,	0.00000000	,	0.00000000	,	0.00000000	,	0.04562034	,	0.04562034	,	0.18248134	,	0.13686101	,	0.09124067	],	//MLR
                                  [	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//OMC
                                  [	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//OMLR
                                  [	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	]];	//F

                var weightAThr = [[	0.00000000	,	0.01101727	,	0.02754316	,	0.00000000	,	0.00000000	,	0.01101727	,	0.01101727	,	0.02754316	,	0.01101727	,	0.01101727	],	//DC
                                  [	0.00000000	,	0.02257878	,	0.05644695	,	0.00000000	,	0.00000000	,	0.02257878	,	0.02257878	,	0.05644695	,	0.02257878	,	0.02257878	],	//DLR
                                  [	0.00000000	,	0.01456869	,	0.03642173	,	0.00000000	,	0.00000000	,	0.01456869	,	0.01456869	,	0.03642173	,	0.01456869	,	0.01456869	],	//DMC
                                  [	0.00000000	,	0.01499281	,	0.03748203	,	0.00000000	,	0.00000000	,	0.01499281	,	0.01499281	,	0.03748203	,	0.01499281	,	0.01499281	],	//DMLR
                                  [	0.00000000	,	0.03120800	,	0.07801999	,	0.00000000	,	0.00000000	,	0.03120800	,	0.03120800	,	0.07801999	,	0.03120800	,	0.03120800	],	//MC
                                  [	0.00000000	,	0.01788146	,	0.04470366	,	0.00000000	,	0.00000000	,	0.01788146	,	0.01788146	,	0.04470366	,	0.01788146	,	0.01788146	],	//MLR
                                  [	0.00000000	,	0.10000000	,	0.25000000	,	0.00000000	,	0.00000000	,	0.10000000	,	0.10000000	,	0.25000000	,	0.10000000	,	0.10000000	],	//OMC
                                  [	0.00000000	,	0.00741912	,	0.01854781	,	0.00000000	,	0.00000000	,	0.00741912	,	0.00741912	,	0.01854781	,	0.00741912	,	0.00741912	],	//OMLR
                                  [	0.00000000	,	0.02761910	,	0.06904776	,	0.00000000	,	0.00000000	,	0.02761910	,	0.02761910	,	0.06904776	,	0.02761910	,	0.02761910	]];	//F
                // R5 Defence		0:Str			1:Sta			2:Pac			3:Mar			4:Tac			5:Wor			6:Pos			7:Pas			8:Cro			9:Tec			10:Hea
                var weightDSho = [[	0.00000000	,	0.04953226	,	0.04953226	,	0.24766129	,	0.39625806	,	0.09906452	,	0.14859677	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DC
                                  [	0.00000000	,	0.04838710	,	0.04838710	,	0.24193548	,	0.38709677	,	0.09677419	,	0.14516129	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DLR
                                  [	0.00000000	,	0.04608295	,	0.04608295	,	0.23041475	,	0.36866359	,	0.09216590	,	0.13824885	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DMC
                                  [	0.00000000	,	0.03870968	,	0.03870968	,	0.19354839	,	0.30967742	,	0.07741935	,	0.11612903	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DMLR
                                  [	0.00000000	,	0.05000000	,	0.05000000	,	0.25000000	,	0.40000000	,	0.10000000	,	0.15000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//MC
                                  [	0.00000000	,	0.04032258	,	0.04032258	,	0.20161290	,	0.32258065	,	0.08064516	,	0.12096774	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//MLR
                                  [	0.00000000	,	0.02258065	,	0.02258065	,	0.11290323	,	0.18064516	,	0.04516129	,	0.06774194	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//OMC
                                  [	0.00000000	,	0.01935484	,	0.01935484	,	0.09677419	,	0.15483871	,	0.03870968	,	0.05806452	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//OMLR
                                  [	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	]];	//F

                var weightDThr = [[	0.00000000	,	0.07142857	,	0.35714286	,	0.21428571	,	0.21428571	,	0.07142857	,	0.07142857	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DC
                                  [	0.00000000	,	0.06773578	,	0.33867889	,	0.20320734	,	0.20320734	,	0.06773578	,	0.06773578	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DLR
                                  [	0.00000000	,	0.05827311	,	0.29136554	,	0.17481932	,	0.17481932	,	0.05827311	,	0.05827311	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DMC
                                  [	0.00000000	,	0.05393967	,	0.26969835	,	0.16181901	,	0.16181901	,	0.05393967	,	0.05393967	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DMLR
                                  [	0.00000000	,	0.06236157	,	0.31180785	,	0.18708471	,	0.18708471	,	0.06236157	,	0.06236157	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//MC
                                  [	0.00000000	,	0.05666119	,	0.28330596	,	0.16998358	,	0.16998358	,	0.05666119	,	0.05666119	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//MLR
                                  [	0.00000000	,	0.03526825	,	0.17634123	,	0.10580474	,	0.10580474	,	0.03526825	,	0.03526825	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//OMC
                                  [	0.00000000	,	0.02282063	,	0.11410315	,	0.06846189	,	0.06846189	,	0.02282063	,	0.02282063	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//OMLR
                                  [	0.00000000	,	0.02696984	,	0.13484918	,	0.08090951	,	0.08090951	,	0.02696984	,	0.02696984	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	]];	//F

                var weightDWin = [[	0.03872217	,	0.03872217	,	0.19361084	,	0.19361084	,	0.30977735	,	0.03872217	,	0.03872217	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DC
                                  [	0.04545455	,	0.04545455	,	0.22727273	,	0.22727273	,	0.36363636	,	0.04545455	,	0.04545455	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DLR
                                  [	0.01444096	,	0.01444096	,	0.07220482	,	0.07220482	,	0.11552771	,	0.01444096	,	0.01444096	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DMC
                                  [	0.04360171	,	0.04360171	,	0.21800857	,	0.21800857	,	0.34881370	,	0.04360171	,	0.04360171	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DMLR
                                  [	0.01187368	,	0.01187368	,	0.05936840	,	0.05936840	,	0.09498945	,	0.01187368	,	0.01187368	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//MC
                                  [	0.03872217	,	0.03872217	,	0.19361084	,	0.19361084	,	0.30977735	,	0.03872217	,	0.03872217	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//MLR
                                  [	0.00704039	,	0.00704039	,	0.03520197	,	0.03520197	,	0.05632315	,	0.00704039	,	0.00704039	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//OMC
                                  [	0.02715581	,	0.02715581	,	0.13577903	,	0.13577903	,	0.21724645	,	0.02715581	,	0.02715581	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//OMLR
                                  [	0.00352020	,	0.00352020	,	0.01760099	,	0.01760099	,	0.02816158	,	0.00352020	,	0.00352020	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	]];	//F

                var weightDDir = [[	0.00000000	,	0.05263158	,	0.10526316	,	0.42105263	,	0.15789474	,	0.15789474	,	0.10526316	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DC
                                  [	0.00000000	,	0.05232603	,	0.10465205	,	0.41860820	,	0.15697808	,	0.15697808	,	0.10465205	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DLR
                                  [	0.00000000	,	0.04938021	,	0.09876041	,	0.39504166	,	0.14814062	,	0.14814062	,	0.09876041	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DMC
                                  [	0.00000000	,	0.03182820	,	0.06365641	,	0.25462564	,	0.09548461	,	0.09548461	,	0.06365641	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DMLR
                                  [	0.00000000	,	0.04928989	,	0.09857978	,	0.39431913	,	0.14786967	,	0.14786967	,	0.09857978	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//MC
                                  [	0.00000000	,	0.04000000	,	0.08000000	,	0.32000000	,	0.12000000	,	0.12000000	,	0.08000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//MLR
                                  [	0.00000000	,	0.02105263	,	0.04210526	,	0.16842105	,	0.06315789	,	0.06315789	,	0.04210526	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//OMC
                                  [	0.00000000	,	0.01684211	,	0.03368421	,	0.13473684	,	0.05052632	,	0.05052632	,	0.03368421	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//OMLR
                                  [	0.00000000	,	0.01263158	,	0.02526316	,	0.10105263	,	0.03789474	,	0.03789474	,	0.02526316	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	]];	//F

                var weightDLon = [[	0.20000000	,	0.04000000	,	0.08000000	,	0.20000000	,	0.12000000	,	0.08000000	,	0.08000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.20000000	],	//DC
                                  [	0.15450127	,	0.03090025	,	0.06180051	,	0.15450127	,	0.09270076	,	0.06180051	,	0.06180051	,	0.00000000	,	0.00000000	,	0.00000000	,	0.15450127	],	//DLR
                                  [	0.16404575	,	0.03280915	,	0.06561830	,	0.16404575	,	0.09842745	,	0.06561830	,	0.06561830	,	0.00000000	,	0.00000000	,	0.00000000	,	0.16404575	],	//DMC
                                  [	0.14045570	,	0.02809114	,	0.05618228	,	0.14045570	,	0.08427342	,	0.05618228	,	0.05618228	,	0.00000000	,	0.00000000	,	0.00000000	,	0.14045570	],	//DMLR
                                  [	0.12641013	,	0.02528203	,	0.05056405	,	0.12641013	,	0.07584608	,	0.05056405	,	0.05056405	,	0.00000000	,	0.00000000	,	0.00000000	,	0.12641013	],	//MC
                                  [	0.09831899	,	0.01966380	,	0.03932759	,	0.09831899	,	0.05899139	,	0.03932759	,	0.03932759	,	0.00000000	,	0.00000000	,	0.00000000	,	0.09831899	],	//MLR
                                  [	0.07022785	,	0.01404557	,	0.02809114	,	0.07022785	,	0.04213671	,	0.02809114	,	0.02809114	,	0.00000000	,	0.00000000	,	0.00000000	,	0.07022785	],	//OMC
                                  [	0.05618228	,	0.01123646	,	0.02247291	,	0.05618228	,	0.03370937	,	0.02247291	,	0.02247291	,	0.00000000	,	0.00000000	,	0.00000000	,	0.05618228	],	//OMLR
                                  [	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	]];	//F
                var defense = []; var assist = []; var shooting = [];
                if (fp != 9) {
                    var Ddir = (staRou*0.052631579+(pacRou+posRou)*0.105263158+marRou*0.421052632+(tacRou+worRou)*0.157894737)*5;
                    var Dwin = ((strRou+staRou+worRou+posRou)*0.045454545+(pacRou+marRou)*0.227272727+tacRou*0.363636364)*5;
                    var Dsho = ((staRou+pacRou)*0.05+marRou*0.25+tacRou*0.4+worRou*0.1+posRou*0.15)*5;
                    var Dlon = ((strRou+marRou+heaRou)*0.2+staRou*0.04+(pacRou+worRou+posRou)*0.08+tacRou*0.12)*5;
                    var Dthr = ((staRou+worRou+posRou)*0.071428571+pacRou*0.357142857+(marRou+tacRou)*0.214285714)*5;
                    var Dbal = (Ddir+Dwin+Dsho+Dlon+Dthr)/5;

                    var Adir = (staRou*0.125+pacRou*0.29166666+(worRou+posRou)*0.08333333+pasRou*0.25+tecRou*0.16666666)*5;
                    var Awin = (strRou*0.04347826+(staRou+worRou)*0.08695652+pacRou*0.26086956+croRou*0.34782608+tecRou*0.17391304)*5;
                    var Asho = ((staRou+pacRou+worRou+posRou)*0.09523809+pasRou*0.33333333+tecRou*0.28571428)*5;
                    var Alon = ((staRou+worRou+posRou)*0.08333333+pasRou*0.33333333+croRou*0.25+tecRou*0.16666666)*5;
                    var Athr = ((staRou+worRou+posRou+croRou+tecRou)*0.1+(pacRou+pasRou)*0.25)*5;
                    var Abal = (Adir+Awin+Asho+Alon+Athr)/5;

                    var shotregular = funFix2(skillsB[11]*0.5+(skillsB[9]*1+skillsB[6]*1+skillsB[2]*1)/3*0.4+(skillsB[0]*1+skillsB[5]*1)/2*0.1+rou2);
                    var shotlong = funFix2(skillsB[12]*0.5+(skillsB[9]*1+skillsB[11]*1+skillsB[6]*1)/3*0.4+(skillsB[0]*1+skillsB[5]*1)/2*0.1+rou2);
                    var shothead = funFix2(skillsB[10]*0.5+(skillsB[0]*2+skillsB[6]*1)/3*0.4+(skillsB[2]*1+skillsB[5]*1)/2*0.1+rou2);

                    var Fdir = (shotregular*0.339+shotlong*0.342+shothead*0.319)*5;
                    var Fwin = (shotregular*0.252+shotlong*0.035+shothead*0.713)*5;
                    var Fsho = (shotregular*0.534+shotlong*0.339+shothead*0.127)*5;
                    var Flon = (shotregular*0.271+shotlong*0.037+shothead*0.692)*5;
                    var Fthr = (shotregular*0.703+shotlong*0.151+shothead*0.146)*5;
                    var Fbal = (Fdir+Fwin+Fsho+Flon+Fthr)/5;
                } else { Dbal=Ddir=Dwin=Dsho=Dlon=Dthr=Abal=Adir=Awin=Asho=Alon=Athr=Fbal=Fdir=Fwin=Fsho=Flon=Fthr=0; }
                defense.push(Dbal, Ddir, Dwin, Dsho, Dlon, Dthr);
                assist.push(Abal, Adir, Awin, Asho, Alon, Athr);
                shooting.push(Fbal, Fdir, Fwin, Fsho, Flon, Fthr);
                StyleValues.push({ "ID":PlayerID, "DEF":defense, "ASS":assist, "FIN":shooting });
                // calculate REC and RatingR5:
                var rec = 0;			// RERECb
                var ratingR = 0;		// RatingR5
                var ratingR5 = 0;		// RatingR5 + routine

                var remainderWeight = 0;		// REREC remainder weight sum
                var remainderWeight2 = 0;		// RatingR5 remainder weight sum
                var not20 = 0;					// skill < 20
                for (i = 0; i < weightRb[fp].length; i++) {
                    rec += skills[i] * weightRb[fp][i];
                    ratingR += skills[i] * weightR5[fp][i];
                    if (skills[i] != 20) {
                        remainderWeight += weightRb[fp][i];
                        remainderWeight2 += weightR5[fp][i];
                        not20++;
                    }
                }
                if (remainder/not20 > 0.9 || not20 == 0) {
                    if (fp == 9) not20 = 11;
                    else not20 = 14;
                    remainderWeight = 1;
                    remainderWeight2 = 5;
                }
                rec = funFix3((rec + remainder * remainderWeight / not20 - 2) / 3);
                ratingR += remainder * remainderWeight2 / not20;

                ratingR5 = funFix2(ratingR*1 + rou2 * 5);
                ratingR = funFix2(ratingR);

                if (skills.length == 11) {
                    var R5FP = funFix2(ratingR5*1 + allBonus*1);
                } else {
                    R5FP = funFix2(ratingR5*1 + allBonus*1 + posGain[fp]*1 + posKeep[fp]*1);
                }
                var ROUdiv = "<div class='ROU' style='color:greenyellow; width:30px; text-align:center;'>"+ROU+"</div>";
                var RECdiv = "<div class='REC' style='color:gold; width:50px; text-align:center;'>"+rec+"</div>";
                var RR5div = "<div class='RR5' style='color:orange; width:50px; text-align:center;'>"+R5FP+"</div>";

                if (fp == 9) {
                    var Ddiv = "<div class='sDEF' style='color:#dfeaf9; width:50px; text-align:center;'>---</div>";
                    var Adiv = "<div class='sASS' style='color:#ffff93; width:50px; text-align:center;'>---</div>";
                    var Fdiv = "<div class='sFIN' style='color:#ffb89e; width:50px; text-align:center;'>---</div>";
                } else {
                    if (index < 11) {
                        var Dbon = funFix2(defense[aStyle-1]); var Abon = funFix2(assist[hStyle-1]); var Fbon = funFix2(shooting[hStyle-1]);
                    } else {
                        Dbon = funFix2(defense[hStyle-1]); Abon = funFix2(assist[aStyle-1]); Fbon = funFix2(shooting[aStyle-1]);
                    }
                    Ddiv = "<div class='sDEF' style='color:#dfeaf9; width:50px; text-align:center;'>"+Dbon+"</div>";
                    Adiv = "<div class='sASS' style='color:#ffff93; width:50px; text-align:center;'>"+Abon+"</div>";
                    Fdiv = "<div class='sFIN' style='color:#ffb89e; width:50px; text-align:center;'>"+Fbon+"</div>";
                }
                $(field).remove();
                if (Status.indexOf("red") != -1 || Status.indexOf("injury") != -1) {
                    $("a[href$='/players/"+PlayerID+"']").find("div.name").css("color","#cccccc");
                }
                $("div.quarter").css({"width":"460px","text-align":"left"});
                $("ul.player_list.underlined_slim.tleft:first").css("padding","0px");
                $("ul.player_list.underlined_slim.tleft:eq(1)").css("padding","0px");
                $(".name").css("width","140px");
                if (ROLE.indexOf("dm") != -1) { var favpos = ROLE.replace("dm","DM");
                } else if (ROLE.indexOf("om") != -1) { favpos = ROLE.replace("om","OM");
                } else { favpos = ROLE.substr(0,1).toUpperCase()+ROLE.substr(1); }
                $("ul.player_list.underlined_slim.tleft").find("a[href$='/players/"+PlayerID+"'] > .position > .favposition.short > span").css("font-size","smaller");
                $("ul.player_list.underlined_slim.tleft").find("a[href$='/players/"+PlayerID+"'] > .position > .favposition.short > span").text(favpos);
                $("ul.player_list.underlined_slim.tleft").find("a[href$='/players/"+PlayerID+"']").append(ROUdiv+RECdiv+RR5div+Ddiv+Adiv+Fdiv);
            });
        }); // end of loop "each player"
        // calculate GK's REC and RR5 by DEF-bonus:
        var fp = 9;
        var weight = 48717927500;

        var hFINbon = (0.11*hMAR+0.07*hTAC+0.04*hPOS+0*hHEA+0.03*hSTR+0.03*hPAC+0.02*hWOR)/hDIF;
        var hHEAbon = (0*hMAR+0*hTAC+0.05*hPOS+0.14*hHEA+0.07*hSTR+0.02*hPAC+0.02*hWOR)/hDIF;
        var hLONbon = (0.06*hMAR+0.12*hTAC+0.06*hPOS+0*hHEA+0.02*hSTR+0.02*hPAC+0.02*hWOR)/hDIF;

        var asi = hGKasi;
        ROU = 0.7*hGKrou+0.3*(hDIFrou/hDIF);
        var rou2 = (3/100) * (100-(100) * Math.pow(Math.E, -ROU*0.035));
        var not20 = 0;
        for (i=0;i<hGKskills.length;i++) {
            if (hGKskills[i].indexOf("<img") != -1) {
                hGKskills[i] = hGKskills.match(/\d+/);
            }
            if (hGKskills[i] != 20) {
                not20++
            }
        }
        var skillSum = 0;
        for (i=0; i<hGKskills.length; i++) {
            skillSum += parseInt(hGKskills[i]);
        }
        var remainder = Math.round((Math.pow(2,Math.log(weight*asi)/Math.log(Math.pow(2,7))) - skillSum)*10)/10; // RatingR5 remainder

        for (i=0; i<hGKskills.length; i++) {
            if (hGKskills[i] != 20) {
                hGKskills[i] = hGKskills[i]*1+(remainder/not20);
            }
            if (not20 == 11) {
                hGKskills[i] = hGKskills[i]*1+(remainder/11)
            }
        }
        // home GK + FIN bonus:
        var hSkFIN = [];
        for (i=0;i<hGKskills.length;i++) {
            hSkFIN[i] = 0.7*hGKskills[i]+hFINbon;
        }
        var allBonus = 0;
        var rec = 0;			// RERECb
        var ratingR = 0;		// RatingR5
        var ratingR5 = 0;		// RatingR5 + routine
        for (i = 0; i < weightRb[fp].length; i++) {
            rec += hSkFIN[i] * weightRb[fp][i];
            ratingR += hSkFIN[i] * weightR5[fp][i];
        }
        var hGKrecFIN = funFix3((rec-2)/3);
        ratingR5 = funFix2(ratingR*1 + rou2 * 5);
        ratingR = funFix2(ratingR);
        var hGKrr5FIN = funFix2(ratingR5*1 + allBonus*1);
        // home GK + HEA bonus:
        var hSkHEA = [];
        for (i=0;i<hGKskills.length;i++) {
            hSkHEA[i] = 0.7*hGKskills[i]+hHEAbon;
        }
        allBonus = 0;
        rec = 0;			// RERECb
        ratingR = 0;		// RatingR5
        ratingR5 = 0;		// RatingR5 + routine
        for (i = 0; i < weightRb[fp].length; i++) {
            rec += hSkHEA[i] * weightRb[fp][i];
            ratingR += hSkHEA[i] * weightR5[fp][i];
        }
        var hGKrecHEA = funFix3((rec-2)/3);
        ratingR5 = funFix2(ratingR*1 + rou2 * 5);
        ratingR = funFix2(ratingR);
        var hGKrr5HEA = funFix2(ratingR5*1 + allBonus*1);
        var hSkLON = [];
        for (i=0;i<hGKskills.length;i++) {
            hSkLON[i] = 0.7*hGKskills[i]+hLONbon;
        }
        allBonus = 0;
        rec = 0;			// RERECb
        ratingR = 0;		// RatingR5
        ratingR5 = 0;		// RatingR5 + routine
        for (i = 0; i < weightRb[fp].length; i++) {
            rec += hSkLON[i] * weightRb[fp][i];
            ratingR += hSkLON[i] * weightR5[fp][i];
        }
        var hGKrecLON = funFix3((rec-2)/3);
        ratingR5 = funFix2(ratingR*1 + rou2 * 5);
        ratingR = funFix2(ratingR);
        var hGKrr5LON = funFix2(ratingR5*1 + allBonus*1);
        // away GK //
        var aFINbon = (0.11*aMAR+0.07*aTAC+0.04*aPOS+0*aHEA+0.03*aSTR+0.03*aPAC+0.02*aWOR)/aDIF;
        var aHEAbon = (0*aMAR+0*aTAC+0.05*aPOS+0.14*aHEA+0.07*aSTR+0.02*aPAC+0.02*aWOR)/aDIF;
        var aLONbon = (0.06*aMAR+0.12*aTAC+0.06*aPOS+0*aHEA+0.02*aSTR+0.02*aPAC+0.02*aWOR)/aDIF;
        asi = aGKasi;
        ROU = 0.7*aGKrou+0.3*(aDIFrou/aDIF);
        rou2 = (3/100) * (100-(100) * Math.pow(Math.E, -ROU*0.035));
        not20 = 0;
        for (i=0;i<aGKskills.length;i++) {
            if (aGKskills[i].indexOf("<img") != -1) {
                aGKskills[i] = aGKskills.match(/\d+/);
            }
            if (aGKskills[i] != 20) {
                not20++
            }
        }
        skillSum = 0;
        for (i=0; i<aGKskills.length; i++) {
            skillSum += parseInt(aGKskills[i]);
        }
        remainder = Math.round((Math.pow(2,Math.log(weight*asi)/Math.log(Math.pow(2,7))) - skillSum)*10)/10; // RatingR5 remainder

        for (i=0; i<aGKskills.length; i++) {
            if (aGKskills[i] != 20) {
                aGKskills[i] = aGKskills[i]*1+(remainder/not20);
            }
            if (not20 == 11) {
                aGKskills[i] = aGKskills[i]*1+(remainder/11)
            }
        }
        // away GK + FIN bonus:
        var aSkFIN = [];
        for (i=0;i<aGKskills.length;i++) {
            aSkFIN[i] = 0.7*aGKskills[i]+aFINbon;
        }
        allBonus = 0;
        rec = 0;			// RERECb
        ratingR = 0;		// RatingR5
        ratingR5 = 0;		// RatingR5 + routine
        for (i = 0; i < weightRb[fp].length; i++) {
            rec += aSkFIN[i] * weightRb[fp][i];
            ratingR += aSkFIN[i] * weightR5[fp][i];
        }
        var aGKrecFIN = funFix3((rec-2)/3);
        ratingR5 = funFix2(ratingR*1 + rou2 * 5);
        ratingR = funFix2(ratingR);
        var aGKrr5FIN = funFix2(ratingR5*1 + allBonus*1);
        var aSkHEA = [];
        for (i=0;i<aGKskills.length;i++) {
            aSkHEA[i] = 0.7*aGKskills[i]+aHEAbon;
        }
        allBonus = 0;
        rec = 0;			// RERECb
        ratingR = 0;		// RatingR5
        ratingR5 = 0;		// RatingR5 + routine
        for (i = 0; i < weightRb[fp].length; i++) {
            rec += aSkHEA[i] * weightRb[fp][i];
            ratingR += aSkHEA[i] * weightR5[fp][i];
        }
        var aGKrecHEA = funFix3((rec-2)/3);
        ratingR5 = funFix2(ratingR*1 + rou2 * 5);
        ratingR = funFix2(ratingR);
        var aGKrr5HEA = funFix2(ratingR5*1 + allBonus*1);
        // away GK + LON bonus:
        var aSkLON = [];
        for (i=0;i<aGKskills.length;i++) {
            aSkLON[i] = 0.7*aGKskills[i]+aLONbon;
        }
        allBonus = 0;
        rec = 0;			// RERECb
        ratingR = 0;		// RatingR5
        ratingR5 = 0;		// RatingR5 + routine
        for (i = 0; i < weightRb[fp].length; i++) {
            rec += aSkLON[i] * weightRb[fp][i];
            ratingR += aSkLON[i] * weightR5[fp][i];
        }
        var aGKrecLON = funFix3((rec-2)/3);
        ratingR5 = funFix2(ratingR*1 + rou2 * 5);
        ratingR = funFix2(ratingR);
        var aGKrr5LON = funFix2(ratingR5*1 + allBonus*1);
        var hPoss = "<li class='avgPoss' style='background-color:#334c18;'><div style='width:40px; text-align:center; color:#cccccc;'>Age:</div><div style='width:35px; text-align:left;'>"+(hAge/11).toFixed(1)+"</div><div style='width:30px; text-align:right; color:#cccccc;'>Asi:</div><div style='width:65px; text-align:center;'>"+addCommas((hAsi/11).toFixed(0))+"</div><div style='width:40px; text-align:right; color:#cccccc;'>Gain:</div><div style='width:50px; text-align:center;'>"+funFix3(hGain)+"</div><div style='width:50px; text-align:right; color:#cccccc;'>Keep:</div><div style='width:50px; text-align:center;'>"+funFix3(hKeep)+"</div><div style='width:50px; text-align:right; color:#cccccc;'>TotPoss:</div><div style='width:50px; text-align:center;'>"+funFix3((hGain+hKeep)/2)+"</div></li>";
        var aPoss = "<li class='avgPoss' style='background-color:#334c18;'><div style='width:40px; text-align:center; color:#cccccc;'>Age:</div><div style='width:35px; text-align:left;'>"+(aAge/11).toFixed(1)+"</div><div style='width:30px; text-align:right; color:#cccccc;'>Asi:</div><div style='width:65px; text-align:center;'>"+addCommas((aAsi/11).toFixed(0))+"</div><div style='width:40px; text-align:right; color:#cccccc;'>Gain:</div><div style='width:50px; text-align:center;'>"+funFix3(aGain)+"</div><div style='width:50px; text-align:right; color:#cccccc;'>Keep:</div><div style='width:50px; text-align:center;'>"+funFix3(aKeep)+"</div><div style='width:50px; text-align:right; color:#cccccc;'>TotPoss:</div><div style='width:50px; text-align:center;'>"+funFix3((aGain+aKeep)/2)+"</div></li>";
        $("ul.player_list.underlined_slim.tleft:first").find("li:eq(10)").after(hPoss);
        $("ul.player_list.underlined_slim.tleft:eq(1)").find("li:eq(10)").after(aPoss);
        var hGKbonus = "<li class='GkBon' style='background-color:#41631F;'><div style='width:40px; text-align:center;'>1</div><div style='width:140px; color:#3b0;'>门将+后卫加成:</div><div style='width:30px; color:#3b0; text-align:right; margin-bottom:-13px;'>近射:</div><div style='color:gold; width:50px; text-align:center;'>"+hGKrecFIN+"</div><div style='width:50px; color:#3b0; text-align:right; margin-bottom:-13px;'>头球:</div><div style='color:gold; width:50px; text-align:center;'>"+hGKrecHEA+"</div><div style='width:50px; color:#3b0; text-align:right; margin-bottom:-13px;'>远射:</div><div style='color:gold; width:50px; text-align:center;'>"+hGKrecLON+"</div><br><div style='width:40px; text-align: center;'></div><div style='width:140px; color:#3b0;'>(REC/RR5)</div><div style='width:30px;'></div><div style='color:orange; width:50px; text-align:center;'>"+hGKrr5FIN+"</div><div style='width:50px;'></div><div style='color:orange; width:50px; text-align:center;'>"+hGKrr5HEA+"</div><div style='width:50px;'></div><div style='color:orange; width:50px; text-align:center;'>"+hGKrr5LON+"</div></li>";
        var aGKbonus = "<li class='GkBon' style='background-color:#41631F;'><div style='width:40px; text-align:center;'>1</div><div style='width:140px; color:#3b0;'>门将+ 后卫加成:</div><div style='width:30px; color:#3b0; text-align:right; margin-bottom:-13px;'>近射:</div><div style='color:gold; width:50px; text-align:center;'>"+aGKrecFIN+"</div><div style='width:50px; color:#3b0; text-align:right; margin-bottom:-13px;'>头球:</div><div style='color:gold; width:50px; text-align:center;'>"+aGKrecHEA+"</div><div style='width:50px; color:#3b0; text-align:right; margin-bottom:-13px;'>远射:</div><div style='color:gold; width:50px; text-align:center;'>"+aGKrecLON+"</div><br><div style='width:40px; text-align: center;'></div><div style='width:140px; color:#3b0;'>(REC/RR5)</div><div style='width:30px;'></div><div style='color:orange; width:50px; text-align:center;'>"+aGKrr5FIN+"</div><div style='width:50px;'></div><div style='color:orange; width:50px; text-align:center;'>"+aGKrr5HEA+"</div><div style='width:50px;'></div><div style='color:orange; width:50px; text-align:center;'>"+aGKrr5LON+"</div></li>";
        $("ul.player_list.underlined_slim.tleft:first").find("li:eq(10)").after(hGKbonus);
        $("ul.player_list.underlined_slim.tleft:eq(1)").find("li:eq(10)").after(aGKbonus);
        // update values when style change:
        function updateStyle() {
            var hStyleNew = $("#home_attacking_select").val();
            var aStyleNew = $("#away_attacking_select").val();
            $("ul.player_list.underlined_slim.tleft").find("a").each(function(index){
                var PlayerID = $(this).attr("href").match(/\d+/);
                for (i=0; i<StyleValues.length; i++) {
                    if (StyleValues[i].ID == PlayerID) {
                        if (index < 16) {
                            if ($(this).find(".sDEF").text() !== "---") {
                                $(this).find(".sDEF").text(funFix2(StyleValues[i].DEF[aStyleNew-1]));
                                $(this).find(".sASS").text(funFix2(StyleValues[i].ASS[hStyleNew-1]));
                                $(this).find(".sFIN").text(funFix2(StyleValues[i].FIN[hStyleNew-1]));
                            }
                        } else {
                            if ($(this).find(".sDEF").text() !== "---") {
                                $(this).find(".sDEF").text(funFix2(StyleValues[i].DEF[hStyleNew-1]));
                                $(this).find(".sASS").text(funFix2(StyleValues[i].ASS[aStyleNew-1]));
                                $(this).find(".sFIN").text(funFix2(StyleValues[i].FIN[aStyleNew-1]));
                            }
                        }
                    }
                }
            });
        } // end of function updateStyle
    }); //end of get information function
    hideButton(field);
} // end of more info function
// calculate averages:
function avgInfo() {
    setTimeout(function() {
        $(".avgDiv").remove();
        var dHome = 0; var mHome = 0; var fHome = 0;
        var totROUhome = 0; var totREChome = 0; var totRR5home = 0; var totDBONhome = 0; var totABONhome = 0; var totFBONhome = 0;
        var totROUdHome = 0; var totRECdHome = 0; var totRR5dHome = 0; var totDBONdHome = 0; var totABONdHome = 0; var totFBONdHome = 0;
        var totROUmHome = 0; var totRECmHome = 0; var totRR5mHome = 0; var totDBONmHome = 0; var totABONmHome = 0; var totFBONmHome = 0;
        var totROUfHome = 0; var totRECfHome = 0; var totRR5fHome = 0; var totDBONfHome = 0; var totABONfHome = 0; var totFBONfHome = 0;
        var dAway = 0; var mAway = 0; var fAway = 0;
        var totROUaway = 0; var totRECaway = 0; var totRR5away = 0; var totDBONaway = 0; var totABONaway = 0; var totFBONaway = 0;
        var totROUdAway = 0; var totRECdAway = 0; var totRR5dAway = 0; var totDBONdAway = 0; var totABONdAway = 0; var totFBONdAway = 0;
        var totROUmAway = 0; var totRECmAway = 0; var totRR5mAway = 0; var totDBONmAway = 0; var totABONmAway = 0; var totFBONmAway = 0;
        var totROUfAway = 0; var totRECfAway = 0; var totRR5fAway = 0; var totDBONfAway = 0; var totABONfAway = 0; var totFBONfAway = 0;

        var rou = document.getElementsByClassName("ROU");
        var rec = document.getElementsByClassName("REC");
        var rr5 = document.getElementsByClassName("RR5");
        var dBon = document.getElementsByClassName("sDEF");
        var aBon = document.getElementsByClassName("sASS");
        var fBon = document.getElementsByClassName("sFIN");
        var rolesH = document.getElementsByClassName("player_list underlined_slim tleft")[0].getElementsByClassName("favposition short");
        var rolesA = document.getElementsByClassName("player_list underlined_slim tleft")[1].getElementsByClassName("favposition short");
        for (var i=0; i<rou.length; i++) {
            if (i < 11) {
                totROUhome += rou[i].textContent*1; totREChome += rec[i].textContent*1; totRR5home += rr5[i].textContent*1;
                if (dBon[i].textContent !== "---") {
                    totDBONhome += dBon[i].textContent*1; totABONhome += aBon[i].textContent*1; totFBONhome += fBon[i].textContent*1;
                }
            } else {
                totROUaway += rou[i].textContent*1; totRECaway += rec[i].textContent*1; totRR5away += rr5[i].textContent*1;
                if (dBon[i].textContent !== "---") {
                    totDBONaway += dBon[i].textContent*1; totABONaway += aBon[i].textContent*1; totFBONaway += fBon[i].textContent*1;
                }
            }
        }
        for (i=0; i<rolesH.length;i++) {
            if (rolesH[i].firstChild.classList.contains("d")) {
                dHome += 1; totROUdHome += rou[i].textContent*1; totRECdHome += rec[i].textContent*1; totRR5dHome += rr5[i].textContent*1;
                totDBONdHome += dBon[i].textContent*1; totABONdHome += aBon[i].textContent*1; totFBONdHome += fBon[i].textContent*1;
            } else if (rolesH[i].firstChild.classList.contains("m")) {
                mHome += 1; totROUmHome += rou[i].textContent*1; totRECmHome += rec[i].textContent*1; totRR5mHome += rr5[i].textContent*1;
                totDBONmHome += dBon[i].textContent*1; totABONmHome += aBon[i].textContent*1; totFBONmHome += fBon[i].textContent*1;
            } else if (rolesH[i].firstChild.classList.contains("om") || rolesH[i].firstChild.classList.contains("f")) {
                fHome += 1; totROUfHome += rou[i].textContent*1; totRECfHome += rec[i].textContent*1; totRR5fHome += rr5[i].textContent*1;
                totDBONfHome += dBon[i].textContent*1; totABONfHome += aBon[i].textContent*1; totFBONfHome += fBon[i].textContent*1;
            }
        }
        for (i=0; i<rolesA.length;i++) {
            if (rolesA[i].firstChild.classList.contains("d")) {
                dAway += 1; totROUdAway += rou[i+11].textContent*1; totRECdAway += rec[i+11].textContent*1; totRR5dAway += rr5[i+11].textContent*1;
                totDBONdAway += dBon[i+11].textContent*1; totABONdAway += aBon[i+11].textContent*1; totFBONdAway += fBon[i+11].textContent*1;
            } else if (rolesA[i].firstChild.classList.contains("m")) {
                mAway += 1; totROUmAway += rou[i+11].textContent*1; totRECmAway += rec[i+11].textContent*1; totRR5mAway += rr5[i+11].textContent*1;
                totDBONmAway += dBon[i+11].textContent*1; totABONmAway += aBon[i+11].textContent*1; totFBONmAway += fBon[i+11].textContent*1;
            } else if (rolesA[i].firstChild.classList.contains("om") || rolesA[i].firstChild.classList.contains("f")) {
                fAway += 1; totROUfAway += rou[i+11].textContent*1; totRECfAway += rec[i+11].textContent*1; totRR5fAway += rr5[i+11].textContent*1;
                totDBONfAway += dBon[i+11].textContent*1; totABONfAway += aBon[i+11].textContent*1; totFBONfAway += fBon[i+11].textContent*1;
            }
        }
        var avgROUhome = funFix1(totROUhome/11); var avgREChome = funFix3(totREChome/11); var avgRR5home = funFix2(totRR5home/11);
        var avgDBONhome = funFix2(totDBONhome/10); var avgABONhome = funFix2(totABONhome/10); var avgFBONhome = funFix2(totFBONhome/10);
        var avgROUaway = funFix1(totROUaway/11); var avgRECaway = funFix3(totRECaway/11); var avgRR5away = funFix2(totRR5away/11);
        var avgDBONaway = funFix2(totDBONaway/10); var avgABONaway = funFix2(totABONaway/10); var avgFBONaway = funFix2(totFBONaway/10);
        if (dHome>0) {var avgROUdHome = funFix1(totROUdHome/dHome); var avgRECdHome = funFix3(totRECdHome/dHome); var avgRR5dHome = funFix2(totRR5dHome/dHome);
                      var avgDBONdHome = funFix2(totDBONdHome/dHome); var avgABONdHome = funFix2(totABONdHome/dHome); var avgFBONdHome = funFix2(totFBONdHome/dHome);}
        else {avgROUdHome = 0; avgRECdHome = 0; avgRR5dHome = 0; avgDBONdHome = 0; avgABONdHome = 0; avgFBONdHome = 0;}
        if (mHome>0) {var avgROUmHome = funFix1(totROUmHome/mHome); var avgRECmHome = funFix3(totRECmHome/mHome); var avgRR5mHome = funFix2(totRR5mHome/mHome);
                      var avgDBONmHome = funFix2(totDBONmHome/mHome); var avgABONmHome = funFix2(totABONmHome/mHome); var avgFBONmHome = funFix2(totFBONmHome/mHome);}
        else {avgROUmHome = 0; avgRECmHome = 0; avgRR5mHome = 0; avgDBONmHome = 0; avgABONmHome = 0; avgFBONmHome = 0;}
        if (fHome>0) {var avgROUfHome = funFix1(totROUfHome/fHome); var avgRECfHome = funFix3(totRECfHome/fHome); var avgRR5fHome = funFix2(totRR5fHome/fHome);
                      var avgDBONfHome = funFix2(totDBONfHome/fHome); var avgABONfHome = funFix2(totABONfHome/fHome); var avgFBONfHome = funFix2(totFBONfHome/fHome);}
        else {avgROUfHome = 0; avgRECfHome = 0; avgRR5fHome = 0; avgDBONfHome = 0; avgABONfHome = 0; avgFBONfHome = 0;}
        if (dAway>0) {var avgROUdAway = funFix1(totROUdAway/dAway); var avgRECdAway = funFix3(totRECdAway/dAway); var avgRR5dAway = funFix2(totRR5dAway/dAway);
                      var avgDBONdAway = funFix2(totDBONdAway/dAway); var avgABONdAway = funFix2(totABONdAway/dAway); var avgFBONdAway = funFix2(totFBONdAway/dAway);}
        else {avgROUdAway = 0; avgRECdAway = 0; avgRR5dAway = 0; avgDBONdAway = 0; avgABONdAway = 0; avgFBONdAway = 0;}
        if (mAway>0) {var avgROUmAway = funFix1(totROUmAway/mAway); var avgRECmAway = funFix3(totRECmAway/mAway); var avgRR5mAway = funFix2(totRR5mAway/mAway);
                      var avgDBONmAway = funFix2(totDBONmAway/mAway); var avgABONmAway = funFix2(totABONmAway/mAway); var avgFBONmAway = funFix2(totFBONmAway/mAway);}
        else {avgROUmAway = 0; avgRECmAway = 0; avgRR5mAway = 0; avgDBONmAway = 0; avgABONmAway = 0; avgFBONmAway = 0;}
        if (fAway>0) {var avgROUfAway = funFix1(totROUfAway/fAway); var avgRECfAway = funFix3(totRECfAway/fAway); var avgRR5fAway = funFix2(totRR5fAway/fAway);
                      var avgDBONfAway = funFix2(totDBONfAway/fAway); var avgABONfAway = funFix2(totABONfAway/fAway); var avgFBONfAway = funFix2(totFBONfAway/fAway);}
        else {avgROUfAway = 0; avgRECfAway = 0; avgRR5fAway = 0; avgDBONfAway = 0; avgABONfAway = 0; avgFBONfAway = 0;}

        var divHeader = "<li class='avgDiv' style='background-color:#334c18;'><div style='width:40px; text-align: center;'>位置</div><div style='width:140px'>姓名</div><div style='color:greenyellow; width:30px; text-align:center;'>经验</div><div style='color:gold; width:50px; text-align:center;'>评星</div><div style='color:orange; width:50px; text-align:center;'>RR5</div><div style='color:#dfeaf9; width:50px; text-align:center;'>防守</div><div style='color:#ffff93; width:50px; text-align:center;'>组织</div><div style='color:#ffb89e; width:50px; text-align:center;'>射门</div></li>";
        var avgDivHome = "<li class='avgDiv' style='background-color:#334c18;'><div style='width:40px; text-align: center;'>11</div><div style='width:140px'>总体平均:</div><div style='color:greenyellow; width:30px; text-align:center;'>"+avgROUhome+"</div><div style='color:gold; width:50px; text-align:center;'>"+avgREChome+"</div><div style='color:orange; width:50px; text-align:center;'>"+avgRR5home+"</div><div style='color:#dfeaf9; width:50px; text-align:center;'>"+avgDBONhome+"</div><div style='color:#ffff93; width:50px; text-align:center;'>"+avgABONhome+"</div><div style='color:#ffb89e; width:50px; text-align:center;'>"+avgFBONhome+"</div></li>";
        var avgDivAway = "<li class='avgDiv' style='background-color:#334c18;'><div style='width:40px; text-align: center;'>11</div><div style='width:140px'>总体平均:</div><div style='color:greenyellow; width:30px; text-align:center;'>"+avgROUaway+"</div><div style='color:gold; width:50px; text-align:center;'>"+avgRECaway+"</div><div style='color:orange; width:50px; text-align:center;'>"+avgRR5away+"</div><div style='color:#dfeaf9; width:50px; text-align:center;'>"+avgDBONaway+"</div><div style='color:#ffff93; width:50px; text-align:center;'>"+avgABONaway+"</div><div style='color:#ffb89e; width:50px; text-align:center;'>"+avgFBONaway+"</div></li>";
        var avgDivDhome = "<li class='avgDiv' style='background-color:#41631F;'><div style='width:40px; text-align: center;'>"+dHome+"</div><div style='width:140px; color:#3aF;'>后卫线:</div><div style='color:greenyellow; width:30px; text-align:center;'>"+avgROUdHome+"</div><div style='color:gold; width:50px; text-align:center;'>"+avgRECdHome+"</div><div style='color:orange; width:50px; text-align:center;'>"+avgRR5dHome+"</div><div style='color:#dfeaf9; width:50px; text-align:center;'>"+avgDBONdHome+"</div><div style='color:#ffff93; width:50px; text-align:center;'>"+avgABONdHome+"</div><div style='color:#ffb89e; width:50px; text-align:center;'>"+avgFBONdHome+"</div></li>";
        var avgDivDaway = "<li class='avgDiv' style='background-color:#41631F;'><div style='width:40px; text-align: center;'>"+dAway+"</div><div style='width:140px; color:#3aF;'>后卫线:</div><div style='color:greenyellow; width:30px; text-align:center;'>"+avgROUdAway+"</div><div style='color:gold; width:50px; text-align:center;'>"+avgRECdAway+"</div><div style='color:orange; width:50px; text-align:center;'>"+avgRR5dAway+"</div><div style='color:#dfeaf9; width:50px; text-align:center;'>"+avgDBONdAway+"</div><div style='color:#ffff93; width:50px; text-align:center;'>"+avgABONdAway+"</div><div style='color:#ffb89e; width:50px; text-align:center;'>"+avgFBONdAway+"</div></li>";
        var avgDivMhome = "<li class='avgDiv' style='background-color:#41631F;'><div style='width:40px; text-align: center;'>"+mHome+"</div><div style='width:140px; color:#fb0;'>中场线:</div><div style='color:greenyellow; width:30px; text-align:center;'>"+avgROUmHome+"</div><div style='color:gold; width:50px; text-align:center;'>"+avgRECmHome+"</div><div style='color:orange; width:50px; text-align:center;'>"+avgRR5mHome+"</div><div style='color:#dfeaf9; width:50px; text-align:center;'>"+avgDBONmHome+"</div><div style='color:#ffff93; width:50px; text-align:center;'>"+avgABONmHome+"</div><div style='color:#ffb89e; width:50px; text-align:center;'>"+avgFBONmHome+"</div></li>";
        var avgDivMaway = "<li class='avgDiv' style='background-color:#41631F;'><div style='width:40px; text-align: center;'>"+mAway+"</div><div style='width:140px; color:#fb0;'>中场线:</div><div style='color:greenyellow; width:30px; text-align:center;'>"+avgROUmAway+"</div><div style='color:gold; width:50px; text-align:center;'>"+avgRECmAway+"</div><div style='color:orange; width:50px; text-align:center;'>"+avgRR5mAway+"</div><div style='color:#dfeaf9; width:50px; text-align:center;'>"+avgDBONmAway+"</div><div style='color:#ffff93; width:50px; text-align:center;'>"+avgABONmAway+"</div><div style='color:#ffb89e; width:50px; text-align:center;'>"+avgFBONmAway+"</div></li>";
        var avgDivFhome = "<li class='avgDiv' style='background-color:#41631F;'><div style='width:40px; text-align: center;'>"+fHome+"</div><div style='width:140px; color:#ff5a16;'>前锋线:</div><div style='color:greenyellow; width:30px; text-align:center;'>"+avgROUfHome+"</div><div style='color:gold; width:50px; text-align:center;'>"+avgRECfHome+"</div><div style='color:orange; width:50px; text-align:center;'>"+avgRR5fHome+"</div><div style='color:#dfeaf9; width:50px; text-align:center;'>"+avgDBONfHome+"</div><div style='color:#ffff93; width:50px; text-align:center;'>"+avgABONfHome+"</div><div style='color:#ffb89e; width:50px; text-align:center;'>"+avgFBONfHome+"</div></li>";
        var avgDivFaway = "<li class='avgDiv' style='background-color:#41631F;'><div style='width:40px; text-align: center;'>"+fAway+"</div><div style='width:140px; color:#ff5a16;'>前锋线:</div><div style='color:greenyellow; width:30px; text-align:center;'>"+avgROUfAway+"</div><div style='color:gold; width:50px; text-align:center;'>"+avgRECfAway+"</div><div style='color:orange; width:50px; text-align:center;'>"+avgRR5fAway+"</div><div style='color:#dfeaf9; width:50px; text-align:center;'>"+avgDBONfAway+"</div><div style='color:#ffff93; width:50px; text-align:center;'>"+avgABONfAway+"</div><div style='color:#ffb89e; width:50px; text-align:center;'>"+avgFBONfAway+"</div></li>";
        $("ul.player_list.underlined_slim.tleft:first").find("li:eq(10)").after(avgDivHome);
        $("ul.player_list.underlined_slim.tleft:first").find("li.GkBon").before(avgDivFhome+avgDivMhome+avgDivDhome);
        $("ul.player_list.underlined_slim.tleft:eq(1)").find("li:eq(10)").after(avgDivAway);
        $("ul.player_list.underlined_slim.tleft:eq(1)").find("li.GkBon").before(avgDivFaway+avgDivMaway+avgDivDaway);
        $("ul.player_list.underlined_slim.tleft:first").find("li:eq(0)").before(divHeader);
        $("ul.player_list.underlined_slim.tleft:eq(1)").find("li:eq(0)").before(divHeader);
    }, 3000);
}