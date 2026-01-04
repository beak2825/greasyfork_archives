// ==UserScript==
// @name             TM Routine Line Sharing + Advanced Players Infos
// @version          2.6
// @author           Old Version by Borgo Cervaro Calcio Champagne (club ID: 3257254), based on "TM Routine Line Sharing" by Matteo Tomassetti (Polverigi FC) and "RatingR5" by CHU-CHI (club ID: 3415957)
// @iconURL          https://static.trophymanager.com/pics/icons/mini_field.png
// @include          https://trophymanager.com/*tactics/*
// @run-at           document-idle
// @grant            none
// @license          MIT
// @namespace https://greasyfork.org/users/15590
// @description Display players routine and advanced players infos in tactics page
// @downloadURL https://update.greasyfork.org/scripts/494009/TM%20Routine%20Line%20Sharing%20%2B%20Advanced%20Players%20Infos.user.js
// @updateURL https://update.greasyfork.org/scripts/494009/TM%20Routine%20Line%20Sharing%20%2B%20Advanced%20Players%20Infos.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // ****************************
    // Stamina effect:
    var minSTA = 0.96 // custom value to activate the stamina icon (1=100%)
    //	R5 Captaincy(RVA) Custom Weights (Weights sum must be 1.0)
    var leadWeight2 = 0.5;	// Leadership
    var profWeight2 = 0.25;	// Professhionalism
    var rouWeight2	= 0.15;	// Routine
    var aggrWeight2 = 0.1;	// Aggression
    // ****************************
    // ****************************
    // ****************************
    // *** Constants definition ***
    // ****************************
    var share_bonus = 0.25;
    var routine_cap = 40.0;
    var def_line_idx = [0, 6]; // Defensive positions are 0 to 5
    var mid_line_idx = [6, 16]; // Midfield positions are 6 to 15
    var off_line_idx = [16, 24]; // Offensive positions are 16 to 23

    // ************************
    // *** Script main code ***
    // ************************
    var players_on_field = {};

    initialize();

    // ****************************
    // *** Functions definition ***
    // ****************************

    function initialize() {
        const observer = new MutationObserver(() => {
            try{
                if (window.players && window.players.length > 0) {
                    addRoutineToTacticsTable();
                    updateAndDisplay();
                    addClickListeners();
                    observer.disconnect(); // 成功后断开观察
                }
            }catch(error){
                console.log('fail');
                console.log(error);
                observer.disconnect(); // 失败后断开观察
            }
        });
        observer.observe(document, { childList: true, subtree: true });
    }

    /*
	* This function updates and displays routine values of all players
	*/
    function updateAndDisplay() {
        updatePlayersRoutine();
        displayPlayersRoutine();
        listPlayers();
    }

    /*
	* This function displays routine value of each player in formation
	*/
    function displayPlayersRoutine() {
        // Helper function to update routine display
        const updateRoutineDisplay = (element, routine, className) => {
            let routineDiv = element.find(`div.${className}`);
            if (routineDiv.length) {
                routineDiv.text(routine);
            } else {
                $("<div></div>")
                    .addClass(className)
                    .css({
                    "font-size": "10px",
                    "text-align": "center"
                })
                    .text(routine)
                    .appendTo(element);
            }
        };

        // Update field players
        $("div.field_player").each(function() {
            const el = $(this);
            const isGK = el.attr("position") === "gk";
            const playerId = el.attr("player_id");
            const playerSet = el.attr("player_set") === "true";

            if (isGK) {
                const hasFlag = el.find("ib").length;
                el.find("div.field_player_name").css({
                    "width": hasFlag ? "130px" : "60px",
                    "text-align": hasFlag ? "left" : "center"
                });
            }

            if (!playerSet) {
                el.find("div.field_player_routine").remove();
            } else {
                const routine = players_on_field[playerId].routine;
                updateRoutineDisplay(el, routine, "field_player_routine");
            }
        });

        // Update bench players
        $("li.bench_player").each(function() {
            const el = $(this);
            const playerId = el.attr("player_id");
            const playerSet = el.attr("player_set") === "true";

            if (!playerSet) {
                alert("Script error:\nadd 5 bench players, the captain and the set piece shooters;\nthen reload the page.");
                return;
            }

            const routine = window.players_by_id[playerId].routine;
            const recDiv = el.find("div.rec_stars").css("line-height", "14px");
            updateRoutineDisplay(recDiv, routine, "bench_player_routine");
        });

        // Clean up unnecessary elements
        $(".foreigners, .MoreInfos, .MoreInfosHeaders").remove();
        MoreInfos(getMinutes());
    }
    /*
	* This function updates the routine of all players on the field
	* applying the routine bonus
	*/
    function updatePlayersRoutine() {
        updateLineRoutine(def_line_idx);
        updateLineRoutine(mid_line_idx);
        updateLineRoutine(off_line_idx);
    }

    /*
	* This function applies the routine bonus to the player with least routine
	* in the given line and saves the updated routine value
	*/
    function updateLineRoutine(line_idx) {
        var players_ar = [];
        // for each position in the line
        for (var i = line_idx[0]; i < line_idx[1]; i++) {
            var id = window.formation_by_pos[i];
            // check if there is a player in that position
            if (id !== "0" && id !== null) {
                // retrieve player info
                var player = window.players_by_id[id];
                var name = player.name;
                var no = player.no;
                var routine = parseFloat(player.routine);
                // create new player object and add it to the array
                var p = {"id": id, "no": no, "routine": routine};
                players_ar.push(p);
            }
        }
        var line_size = players_ar.length; // players in the line
        // if line consist of two or more players: apply routine bonus
        if (line_size > 1) {
            // sort players array by routine in ascending order
            players_ar.sort(compareByRoutineAsc);
            var min = players_ar[0].routine;
            if (min < routine_cap) {
                var max = players_ar[line_size - 1].routine;
                var min2 = players_ar[1].routine;
                // calculate new routine value applying routine bonus
                var bonus = max * share_bonus;
                var new_routine = min + bonus;
                new_routine = (new_routine < min2 ? new_routine : min2);
                new_routine = (new_routine < routine_cap ? new_routine : routine_cap);
                new_routine = parseFloat(new_routine.toFixed(1));
                // update player routine
                players_ar[0].routine = new_routine;
            }
        }
        // insert players into players_on_field object by id
        for (i = 0; i < players_ar.length; i++) {
            player = players_ar[i];
            id = player.id;
            no = player.no;
            routine = player.routine;
            players_on_field[id] = {"no": no, "routine": routine};
        }
    }

    /*
	* Compare function to sort objects by their routine property in ascending order
	*/
    function compareByRoutineAsc(a, b) {
        var rou_a = parseFloat(a.routine);
        var rou_b = parseFloat(b.routine);
        return (rou_a - rou_b);
    }

    /*
	* Compare function to sort objects by their routine property in descending order
	*/
    function compareByRoutineDesc(a, b) {
        return (b.routine - a.routine);
    }

    /*
	* This function sorts players array by given key and order
	* and then updates tactics table
	*/
    var sortPlayers = function(key, direction) {
        // key = no / pos / name / rec / rou
        // direction = asc, desc
        key = key || "pos";
        direction = direction || "asc";
        if (key === "rou") {
            var comp_fun = (direction === "asc" ? compareByRoutineAsc : compareByRoutineDesc);
            window.players.sort(comp_fun);
        } else {
            window.players = window.mergeSort(window.players, key+"_sort", direction);
        }
        listPlayers();
    };

    /*
	* This function adds routine column to tactics table
	*/
    function addRoutineToTacticsTable() {
        var name_col = $("#tactics_list_headers").find(".name_col.list_column").width("170px");
        var rou_col = $("<div class=\"rou_col list_column\" tooltip=\"Order by Routine\"" +
                        "onclick=\"tactics_sort('pos')\"; style=\"width: 34px;\">" +
                        "<div class=\"padding\" style=\"background: none;\">Rou</div></div>");
        $(rou_col).insertAfter($(name_col));
    }

    function addClickListeners() {
        // Attach click event handler function to the tactics table headers:
        // when the user clicks on the field, players in the table are sorted
        $("#tactics_list_headers").find(".list_column").each(function(index, el) {
            var key = $(el).attr("class").split(" ")[0].split("_")[0];
            if (key !== "col") { // do not consider empty col
                $(el).attr("order", "desc");
                //$(el).prop("onclick", null);
                $(el).click(function() {
                    var order = $(el).attr("order");
                    var new_order = (order === "asc" ? "desc" : "asc");
                    sortPlayers(key, order);
                    $(el).attr("order", new_order);
                });
            }
        });

        // Attach click event handler function to the tactics field:
        // when the user clicks on the field, routine values are updated
        $("#tactics_field").click(function() {
            updateAndDisplay();
        });
    }

    /*
	* This function populates tactics table with players data
	*/
    function listPlayers() {
        var $list = $("#tactics_list_list");
        var $ul = $("<ul>").addClass("tactics_list");
        var gk_header = false;
        for(var i in window.players)
        {
            var p = window.players[i];
            if(p)
            {
                p.on_field = window.on_field[p.player_id] || window.on_subs[p.player_id];
                if(window.tactics_filter_show(p))
                {
                    var str = "<div class=\"list_column no_col align_center\">"+p.no+"</div>" +
                        "<div class=\"vert_split\"></div>" +
                        "<div class=\"list_column pos_col align_center\">"+p.favorite_position_short+"</div>" +
                        "<div class=\"vert_split\"></div>" +
                        "<div class=\"list_column name_col\" style=\"width: 170px\"><div class=\"padding\">"+
                        "<span class='player_name' player_link='"+p.player_id+"' player_id='"+p.player_id+"'>"+p.name+"</span>"+
                        (p.show_flag ? " "+p.flag : "" )+(p.status_no_check === "" ? "" : " "+p.status_no_count )+"</div></div>" +
                        "<div class=\"vert_split\"></div>" +
                        "<div class=\"list_column rou_col align_center\" style=\"width: 34px\">"+p.routine+"</div>" +
                        "<div class=\"vert_split\"></div>" +
                        "<div class=\"list_column rec_col\"><div class=\"padding\">"+p.recommendation+"</div></div>" +
                        "<div class=\"clear\"></div>";
                    var $li = $("<li>")
                    .html(str)
                    .appendTo($ul)
                    .attr("player_id",p.player_id)
                    .attr("player_link",p.player_id)
                    .attr("i",i)
                    .addClass("draggable")
                    .attr("player_no",p.no);
                    $li.mouseover(function(){$(this).addClass("hover");})
                        .mouseout(function(){$(this).removeClass("hover");});
                    $li.find(".favposition").removeClass("short");
                    if(window.on_field[p.player_id]) {
                        $li.addClass("on_field");
                        $li.attr("position",window.on_field[p.player_id]);
                    }
                    else if(window.on_subs[p.player_id]){
                        $li.attr("position",window.on_subs[p.player_id]);
                        $li.addClass("on_subs");
                    }
                    else if(window.show_field_players_in_list) $li.addClass("subtle_gray");

                    // Player link on CTRL+CLICK
                    $li.find(".player_name").click(
                        function(e){
                            if(e.ctrlKey)
                            {
                                window.open("/players/"+$(this).attr("player_id")+"/"+$(this).html().replace(" ","_").replace(". ","_")+"/");
                            }
                        });
                    window.make_draggable($li);
                    window.activate_player_links($li.find("[player_link]"));
                }
            }
        } // i in players
        $list.html($ul);
        $list.verticalScroll({
            "force_scroll": true,
            "style":"dark",
            "scroll_width":25
        });
    }

    async function MoreInfos(minutes) {
        // get fixtures
        var matches = [];
        if (window.location.href.indexOf("/national-teams/") == -1) {
            if(window.location.pathname == "/tactics/reserves/") {
                var clubID = window.SESSION.b_team;
            } else {
                clubID = window.SESSION.main_id;
            }
            var var1 = clubID;
            var var2 = '';
            var var3 = '';
            var type = 'club';
            var data = new Date();
            var Yy, Mm, YyPrev, MmPrev;
            Yy = data.getFullYear();
            Mm = data.getMonth()+1;
            if (Mm=="1") {MmPrev="12";YyPrev=Yy-1} else {MmPrev=Mm-1;YyPrev=Yy};
            if (Mm.toString().length<2) Mm="0"+Mm;
            if (MmPrev.toString().length<2) MmPrev="0"+MmPrev;
            var date = Yy+"-"+Mm;
            var datePrev = YyPrev+"-"+MmPrev;
            var matchesNum = 0;
            $.ajaxSetup({async: false});
            $.post("/ajax/fixtures.ajax.php",{"type":type,"var1":var1,"var2":var2,"var3":var3},function(data){
                if(data != null) {
                    var month = data[date];
                    if (month) {
                        for (i=month.matches.length-1;i>-1;i--) {
                            if (month.matches[i].matchtype !== "f" && month.matches[i].matchtype !== "fl") {
                                if (month.matches[i].result != null) {
                                    if (matchesNum<5) {
                                        matchesNum++;
                                        if (month.matches[i].awayteam == clubID) {var HA="away"} else {HA="home"};
                                        var hTeam = month.matches[i].hometeam_name;
                                        var aTeam = month.matches[i].awayteam_name;
                                        var result = month.matches[i].result;
                                        //console.log(hTeam+" "+result+" "+aTeam);
                                        var title = hTeam+" "+result+" "+aTeam;
                                        var m = {"id":month.matches[i].id, "ha":HA, "res":title};
                                        matches.push(m);
                                    }
                                }
                            }
                        }
                        if (data[datePrev] && matchesNum<5) {
                            month = data[datePrev];
                            for (i=month.matches.length-1;i>-1;i--) {
                                if (month.matches[i].matchtype !== "f" && month.matches[i].matchtype !== "fl") {
                                    if (month.matches[i].result != null) {
                                        if (matchesNum<5) {
                                            matchesNum++;
                                            if (month.matches[i].awayteam == clubID) {HA="away"} else {HA="home"};
                                            hTeam = month.matches[i].hometeam_name;
                                            aTeam = month.matches[i].awayteam_name;
                                            result = month.matches[i].result;
                                            title = hTeam+" "+result+" "+aTeam;
                                            m = {"id":month.matches[i].id, "ha":HA, "res":title};
                                            matches.push(m);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },"json");
            $.ajaxSetup({async: true});
        }
        // end of get fixtures
        // R5 weights		 Str				Sta				Pac				Mar				Tac				Wor				Pos				Pas				Cro				Tec				Hea				Fin				Lon				Set
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
        // RECb weights		 Str				Sta				Pac				Mar				Tac				Wor				Pos				Pas				Cro				Tec				Hea				Fin				Lon				Set
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
            if (isNaN(i)) i=0;
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

        function addCommas(nStr) {
            nStr += '';
            var x = nStr.split('.');
            var x1 = x[0];
            var x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1,$2');
            }
            return x1 + x2;
        }

        function compareByFK(a, b) {
            return (b.FK - a.FK);
        }

        function compareByCK(a, b) {
            return (b.CK - a.CK);
        }

        function compareByPK(a, b) {
            return (b.PK - a.PK);
        }

        function compareCAPrva(a, b) {
            return (b.RVA - a.RVA);
        }

        function compareCAPtss(a, b) {
            return (b.TSS - a.TSS);
        }

        function compareCAPcus(a, b) {
            return (b.CUS - a.CUS);
        }

        var GKskills = []; var GKrou = 0; var GKasi = 0; var GKrec = 0; var GKrr5 = 0;
        var totDEF = 0; var totMID = 0; var totFOR = 0; var totDEFrou = 0;
        var dSTR = 0; var dPAC = 0; var dMAR = 0; var dTAC = 0; var dWOR = 0; var dPOS = 0; var dHEA = 0; // DEF-bonus for GK's REC
        var totROU = 0; var totASI = 0; var totREC = 0; var totRR5 = 0;
        var totDBAL = 0; var totDDIR = 0; var totDWIN = 0; var totDSHO = 0; var totDLON = 0; var totDTHR = 0;
        var totABAL = 0; var totADIR = 0; var totAWIN = 0; var totASHO = 0; var totALON = 0; var totATHR = 0;
        var totFBAL = 0; var totFDIR = 0; var totFWIN = 0; var totFSHO = 0; var totFLON = 0; var totFTHR = 0;
        var totABON = 0; var totFBON = 0; var totGAIN = 0; var totKEEP = 0;
        var totROUd = 0; var totASId = 0; var totRECd = 0; var totRR5d = 0;
        var totDBALd = 0; var totDDIRd = 0; var totDWINd = 0; var totDSHOd = 0; var totDLONd = 0; var totDTHRd = 0;
        var totABALd = 0; var totADIRd = 0; var totAWINd = 0; var totASHOd = 0; var totALONd = 0; var totATHRd = 0;
        var totFBALd = 0; var totFDIRd = 0; var totFWINd = 0; var totFSHOd = 0; var totFLONd = 0; var totFTHRd = 0;
        var totABONd = 0; var totFBONd = 0; var totGAINd = 0; var totKEEPd = 0;
        var totROUm = 0; var totASIm = 0; var totRECm = 0; var totRR5m = 0;
        var totDBALm = 0; var totDDIRm = 0; var totDWINm = 0; var totDSHOm = 0; var totDLONm = 0; var totDTHRm = 0;
        var totABALm = 0; var totADIRm = 0; var totAWINm = 0; var totASHOm = 0; var totALONm = 0; var totATHRm = 0;
        var totFBALm = 0; var totFDIRm = 0; var totFWINm = 0; var totFSHOm = 0; var totFLONm = 0; var totFTHRm = 0;
        var totABONm = 0; var totFBONm = 0; var totGAINm = 0; var totKEEPm = 0;
        var totROUf = 0; var totASIf = 0; var totRECf = 0; var totRR5f = 0;
        var totDBALf = 0; var totDDIRf = 0; var totDWINf = 0; var totDSHOf = 0; var totDLONf = 0; var totDTHRf = 0;
        var totABALf = 0; var totADIRf = 0; var totAWINf = 0; var totASHOf = 0; var totALONf = 0; var totATHRf = 0;
        var totFBALf = 0; var totFDIRf = 0; var totFWINf = 0; var totFSHOf = 0; var totFLONf = 0; var totFTHRf = 0;
        var totABONf = 0; var totFBONf = 0; var totGAINf = 0; var totKEEPf = 0;
        var phyREC = []; var tacREC = []; var tecREC = []; var defenceREC = []; var assistREC = []; var shootingREC = [];
        var phyRECd = 0; var tacRECd = 0; var tecRECd = 0; var defenceRECd = 0; var assistRECd = 0; var shootingRECd = 0;
        var phyRECm = 0; var tacRECm = 0; var tecRECm = 0; var defenceRECm = 0; var assistRECm = 0; var shootingRECm = 0;
        var phyRECf = 0; var tacRECf = 0; var tecRECf = 0; var defenceRECf = 0; var assistRECf = 0; var shootingRECf = 0;
        var phyRECgk = 0; var tacRECgk = 0; var tecRECgk = 0; var savingREC = 0; var counterREC = 0;
        var RR5REC = [];
        var PlayersRECstars = [];
        var PlayersDetails = [];
        var FormByPos = [];
        var SetPieces = [];
        var captain = [];
        var StyleValues = [];
        var AttStyle = $("#attacking_select").val();
        var AttStyleName = $("#attacking_select :selected").text();
        $("#tactics").attr('style','height:1006px;');
        $("#tactics_inner_slide").append("<div><ul id='MoreInfosUl' class='tactics_list'></ul></div>");
        var hash = window.location.hash;
        if (hash == "#advanced") { $("#MoreInfosUl").attr('style','margin-left:434px;'); }
        $("#MoreInfosUl").append(
            "<li class='MoreInfosHeaders' style='display: block;list-style-type: none;border-top: 1px solid #444;border-right: 1px solid #444;border-bottom: 1px solid #222;padding: 0;margin: 0;'>"+
            "<div style='width:42px;display:inline-block;text-align:center;cursor:pointer;' title='Position'>位置</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='width:20px;display:inline-block;text-align:center;cursor:pointer;' title='Number'>#</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='width:160px;display:inline-block;text-align:center;cursor:pointer;' title='Click on a player to show details'>姓名</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='width:35px;display:inline-block;text-align:center;cursor:pointer;' title='Routine'>XP</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='width:60px;display:inline-block;text-align:center;cursor:pointer;' title='Skill Index'>SI</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='width:40px;display:inline-block;text-align:center;cursor:pointer;' title='Recommendation'>Rec</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='width:50px;display:inline-block;text-align:center;cursor:pointer;' title='RatingR5'>R5</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='width:50px;display:inline-block;text-align:center;cursor:pointer;' title='Defense: Balanced'>Def.Bal</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='width:50px;display:inline-block;text-align:center;cursor:pointer;' title='Defense: Direct'>Def.Dir</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='width:50px;display:inline-block;text-align:center;cursor:pointer;' title='Defense: Wings'>Def.Win</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='width:50px;display:inline-block;text-align:center;cursor:pointer;' title='Defense: Shortpassing'>Def.Sho</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='width:50px;display:inline-block;text-align:center;cursor:pointer;' title='Defense: Long Balls'>Def.Lon</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='width:50px;display:inline-block;text-align:center;cursor:pointer;' title='Defense: Through Balls'>Def.Thr</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;cursor:pointer;' title='Assist: "+AttStyleName+"'>组织</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;cursor:pointer;' title='Shot: "+AttStyleName+"'>射门</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;cursor:pointer;' title='Possession (Gain + Keep)'>Poss</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;'>年龄</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;cursor:pointer;' title='Hidden skills\nNote: discover player&#39;s hidden skills for:\n - Professionalism\n - Aggression\n - Injury proneness\n - Adaptability\nSend a scout with PSY 20 for:\n - Leadership\n - Professionalism\n - Aggression'>隐藏</div></li>");

        // Basic const
        const posNames = ["dc","dcl","dcr","dl","dr","dmc","dmcl","dmcr","dml","dmr","mc","mcl","mcr","ml","mr","omc","omcl","omcr","oml","omr","fc","fcl","fcr","gk"];
        const pos = [0,0,0,1,1,2,2,2,3,3,4,4,4,5,5,6,6,6,7,7,8,8,8,9]; // Dc=0, Dlr=1, DMc=2, DMlr=3, Mc=4, Mlr=5, OMc=6, OMlr=7, F=8, Gk=9
        const fieldRoles = ["d","d","d","d","d","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","f","f","f","gk"];
        // WEIGHT(RVA's)
        const leadWeight = 0.5;	// ## default Leadership weight 			DO NOT CHANGE
        const profWeight = 0.25;	// ## default Professhionalism weight 		DO NOT CHANGE
        const rouWeight = 0.15;	// ## default Routine weight 				DO NOT CHANGE
        const aggrWeight = 0.1;	// ## default Aggression weight				DO NOT CHANGE
        const leadWeight3 = [0, 0.131578947, 0.421052632, 0.657894737, 0.815789474, 1];
        // calculate defense, assist and shot bonuses by attacking style:
        // R5 Assist		0:Str			1:Sta			2:Pac			3:Mar			4:Tac			5:Wor			6:Pos			7:Pas			8:Cro			9:Tec
        const weightADir = [[	0.00000000	,	0.02032826	,	0.04743261	,	0.00000000	,	0.00000000	,	0.01355217	,	0.01355217	,	0.04065652	,	0.00000000	,	0.02710435	],	//DC
                            [	0.00000000	,	0.03709181	,	0.08654755	,	0.00000000	,	0.00000000	,	0.02472787	,	0.02472787	,	0.07418362	,	0.00000000	,	0.04945574	],	//DLR
                            [	0.00000000	,	0.04099186	,	0.09564768	,	0.00000000	,	0.00000000	,	0.02732791	,	0.02732791	,	0.08198373	,	0.00000000	,	0.05465582	],	//DMC
                            [	0.00000000	,	0.05537191	,	0.12920113	,	0.00000000	,	0.00000000	,	0.03691461	,	0.03691461	,	0.11074383	,	0.00000000	,	0.07382922	],	//DMLR
                            [	0.00000000	,	0.12500000	,	0.29166667	,	0.00000000	,	0.00000000	,	0.08333333	,	0.08333333	,	0.25000000	,	0.00000000	,	0.16666667	],	//MC
                            [	0.00000000	,	0.01565766	,	0.03653455	,	0.00000000	,	0.00000000	,	0.01043844	,	0.01043844	,	0.03131533	,	0.00000000	,	0.02087689	],	//MLR
                            [	0.00000000	,	0.04289270	,	0.10008296	,	0.00000000	,	0.00000000	,	0.02859513	,	0.02859513	,	0.08578540	,	0.00000000	,	0.05719026	],	//OMC
                            [	0.00000000	,	0.08686786	,	0.20269168	,	0.00000000	,	0.00000000	,	0.05791191	,	0.05791191	,	0.17373573	,	0.00000000	,	0.11582382	],	//OMLR
                            [	0.00000000	,	0.02105888	,	0.04913738	,	0.00000000	,	0.00000000	,	0.01403925	,	0.01403925	,	0.04211775	,	0.00000000	,	0.02807850	]];	//F

        const weightAWin = [[	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DC
                            [	0.01258035	,	0.02516069	,	0.07548208	,	0.00000000	,	0.00000000	,	0.02516069	,	0.00000000	,	0.00000000	,	0.10064277	,	0.05032138	],	//DLR
                            [	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DMC
                            [	0.00805548	,	0.01611096	,	0.04833289	,	0.00000000	,	0.00000000	,	0.01611096	,	0.00000000	,	0.00000000	,	0.06444385	,	0.03222193	],	//DMLR
                            [	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//MC
                            [	0.01571086	,	0.03142171	,	0.09426514	,	0.00000000	,	0.00000000	,	0.03142171	,	0.00000000	,	0.00000000	,	0.12568685	,	0.06284342	],	//MLR
                            [	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//OMC
                            [	0.04347826	,	0.08695652	,	0.26086957	,	0.00000000	,	0.00000000	,	0.08695652	,	0.00000000	,	0.00000000	,	0.34782609	,	0.17391304	],	//OMLR
                            [	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	]];	//F

        const weightASho = [[	0.00000000	,	0.01087937	,	0.01087937	,	0.00000000	,	0.00000000	,	0.01087937	,	0.01087937	,	0.03807781	,	0.00000000	,	0.03263812	],	//DC
                            [	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DLR
                            [	0.00000000	,	0.02620518	,	0.02620518	,	0.00000000	,	0.00000000	,	0.02620518	,	0.02620518	,	0.09171812	,	0.00000000	,	0.07861553	],	//DMC
                            [	0.00000000	,	0.01720760	,	0.01720760	,	0.00000000	,	0.00000000	,	0.01720760	,	0.01720760	,	0.06022661	,	0.00000000	,	0.05162281	],	//DMLR
                            [	0.00000000	,	0.06519303	,	0.06519303	,	0.00000000	,	0.00000000	,	0.06519303	,	0.06519303	,	0.22817562	,	0.00000000	,	0.19557910	],	//MC
                            [	0.00000000	,	0.02776433	,	0.02776433	,	0.00000000	,	0.00000000	,	0.02776433	,	0.02776433	,	0.09717515	,	0.00000000	,	0.08329299	],	//MLR
                            [	0.00000000	,	0.09523810	,	0.09523810	,	0.00000000	,	0.00000000	,	0.09523810	,	0.09523810	,	0.33333333	,	0.00000000	,	0.28571429	],	//OMC
                            [	0.00000000	,	0.04793546	,	0.04793546	,	0.00000000	,	0.00000000	,	0.04793546	,	0.04793546	,	0.16777412	,	0.00000000	,	0.14380639	],	//OMLR
                            [	0.00000000	,	0.05306295	,	0.05306295	,	0.00000000	,	0.00000000	,	0.05306295	,	0.05306295	,	0.18572031	,	0.00000000	,	0.15918884	]];	//F

        const weightALon = [[	0.00000000	,	0.06111197	,	0.00000000	,	0.00000000	,	0.00000000	,	0.06111197	,	0.06111197	,	0.24444789	,	0.18333592	,	0.12222395	],	//DC
                            [	0.00000000	,	0.06073556	,	0.00000000	,	0.00000000	,	0.00000000	,	0.06073556	,	0.06073556	,	0.24294223	,	0.18220667	,	0.12147111	],	//DLR
                            [	0.00000000	,	0.08279697	,	0.00000000	,	0.00000000	,	0.00000000	,	0.08279697	,	0.08279697	,	0.33118787	,	0.24839090	,	0.16559393	],	//DMC
                            [	0.00000000	,	0.08333333	,	0.00000000	,	0.00000000	,	0.00000000	,	0.08333333	,	0.08333333	,	0.33333333	,	0.25000000	,	0.16666667	],	//DMLR
                            [	0.00000000	,	0.02461107	,	0.00000000	,	0.00000000	,	0.00000000	,	0.02461107	,	0.02461107	,	0.09844428	,	0.07383321	,	0.04922214	],	//MC
                            [	0.00000000	,	0.04562034	,	0.00000000	,	0.00000000	,	0.00000000	,	0.04562034	,	0.04562034	,	0.18248134	,	0.13686101	,	0.09124067	],	//MLR
                            [	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//OMC
                            [	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//OMLR
                            [	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	]];	//F

        const weightAThr = [[	0.00000000	,	0.01101727	,	0.02754316	,	0.00000000	,	0.00000000	,	0.01101727	,	0.01101727	,	0.02754316	,	0.01101727	,	0.01101727	],	//DC
                            [	0.00000000	,	0.02257878	,	0.05644695	,	0.00000000	,	0.00000000	,	0.02257878	,	0.02257878	,	0.05644695	,	0.02257878	,	0.02257878	],	//DLR
                            [	0.00000000	,	0.01456869	,	0.03642173	,	0.00000000	,	0.00000000	,	0.01456869	,	0.01456869	,	0.03642173	,	0.01456869	,	0.01456869	],	//DMC
                            [	0.00000000	,	0.01499281	,	0.03748203	,	0.00000000	,	0.00000000	,	0.01499281	,	0.01499281	,	0.03748203	,	0.01499281	,	0.01499281	],	//DMLR
                            [	0.00000000	,	0.03120800	,	0.07801999	,	0.00000000	,	0.00000000	,	0.03120800	,	0.03120800	,	0.07801999	,	0.03120800	,	0.03120800	],	//MC
                            [	0.00000000	,	0.01788146	,	0.04470366	,	0.00000000	,	0.00000000	,	0.01788146	,	0.01788146	,	0.04470366	,	0.01788146	,	0.01788146	],	//MLR
                            [	0.00000000	,	0.10000000	,	0.25000000	,	0.00000000	,	0.00000000	,	0.10000000	,	0.10000000	,	0.25000000	,	0.10000000	,	0.10000000	],	//OMC
                            [	0.00000000	,	0.00741912	,	0.01854781	,	0.00000000	,	0.00000000	,	0.00741912	,	0.00741912	,	0.01854781	,	0.00741912	,	0.00741912	],	//OMLR
                            [	0.00000000	,	0.02761910	,	0.06904776	,	0.00000000	,	0.00000000	,	0.02761910	,	0.02761910	,	0.06904776	,	0.02761910	,	0.02761910	]];	//F
        // R5 Defence		0:Str			1:Sta			2:Pac			3:Mar			4:Tac			5:Wor			6:Pos			7:Pas			8:Cro			9:Tec			10:Hea
        const weightDSho = [[	0.00000000	,	0.04953226	,	0.04953226	,	0.24766129	,	0.39625806	,	0.09906452	,	0.14859677	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DC
                            [	0.00000000	,	0.04838710	,	0.04838710	,	0.24193548	,	0.38709677	,	0.09677419	,	0.14516129	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DLR
                            [	0.00000000	,	0.04608295	,	0.04608295	,	0.23041475	,	0.36866359	,	0.09216590	,	0.13824885	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DMC
                            [	0.00000000	,	0.03870968	,	0.03870968	,	0.19354839	,	0.30967742	,	0.07741935	,	0.11612903	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DMLR
                            [	0.00000000	,	0.05000000	,	0.05000000	,	0.25000000	,	0.40000000	,	0.10000000	,	0.15000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//MC
                            [	0.00000000	,	0.04032258	,	0.04032258	,	0.20161290	,	0.32258065	,	0.08064516	,	0.12096774	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//MLR
                            [	0.00000000	,	0.02258065	,	0.02258065	,	0.11290323	,	0.18064516	,	0.04516129	,	0.06774194	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//OMC
                            [	0.00000000	,	0.01935484	,	0.01935484	,	0.09677419	,	0.15483871	,	0.03870968	,	0.05806452	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//OMLR
                            [	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	]];	//F

        const weightDThr = [[	0.00000000	,	0.07142857	,	0.35714286	,	0.21428571	,	0.21428571	,	0.07142857	,	0.07142857	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DC
                            [	0.00000000	,	0.06773578	,	0.33867889	,	0.20320734	,	0.20320734	,	0.06773578	,	0.06773578	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DLR
                            [	0.00000000	,	0.05827311	,	0.29136554	,	0.17481932	,	0.17481932	,	0.05827311	,	0.05827311	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DMC
                            [	0.00000000	,	0.05393967	,	0.26969835	,	0.16181901	,	0.16181901	,	0.05393967	,	0.05393967	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DMLR
                            [	0.00000000	,	0.06236157	,	0.31180785	,	0.18708471	,	0.18708471	,	0.06236157	,	0.06236157	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//MC
                            [	0.00000000	,	0.05666119	,	0.28330596	,	0.16998358	,	0.16998358	,	0.05666119	,	0.05666119	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//MLR
                            [	0.00000000	,	0.03526825	,	0.17634123	,	0.10580474	,	0.10580474	,	0.03526825	,	0.03526825	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//OMC
                            [	0.00000000	,	0.02282063	,	0.11410315	,	0.06846189	,	0.06846189	,	0.02282063	,	0.02282063	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//OMLR
                            [	0.00000000	,	0.02696984	,	0.13484918	,	0.08090951	,	0.08090951	,	0.02696984	,	0.02696984	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	]];	//F

        const weightDWin = [[	0.03872217	,	0.03872217	,	0.19361084	,	0.19361084	,	0.30977735	,	0.03872217	,	0.03872217	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DC
                            [	0.04545455	,	0.04545455	,	0.22727273	,	0.22727273	,	0.36363636	,	0.04545455	,	0.04545455	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DLR
                            [	0.01444096	,	0.01444096	,	0.07220482	,	0.07220482	,	0.11552771	,	0.01444096	,	0.01444096	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DMC
                            [	0.04360171	,	0.04360171	,	0.21800857	,	0.21800857	,	0.34881370	,	0.04360171	,	0.04360171	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DMLR
                            [	0.01187368	,	0.01187368	,	0.05936840	,	0.05936840	,	0.09498945	,	0.01187368	,	0.01187368	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//MC
                            [	0.03872217	,	0.03872217	,	0.19361084	,	0.19361084	,	0.30977735	,	0.03872217	,	0.03872217	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//MLR
                            [	0.00704039	,	0.00704039	,	0.03520197	,	0.03520197	,	0.05632315	,	0.00704039	,	0.00704039	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//OMC
                            [	0.02715581	,	0.02715581	,	0.13577903	,	0.13577903	,	0.21724645	,	0.02715581	,	0.02715581	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//OMLR
                            [	0.00352020	,	0.00352020	,	0.01760099	,	0.01760099	,	0.02816158	,	0.00352020	,	0.00352020	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	]];	//F

        const weightDDir = [[	0.00000000	,	0.05263158	,	0.10526316	,	0.42105263	,	0.15789474	,	0.15789474	,	0.10526316	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DC
                            [	0.00000000	,	0.05232603	,	0.10465205	,	0.41860820	,	0.15697808	,	0.15697808	,	0.10465205	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DLR
                            [	0.00000000	,	0.04938021	,	0.09876041	,	0.39504166	,	0.14814062	,	0.14814062	,	0.09876041	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DMC
                            [	0.00000000	,	0.03182820	,	0.06365641	,	0.25462564	,	0.09548461	,	0.09548461	,	0.06365641	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DMLR
                            [	0.00000000	,	0.04928989	,	0.09857978	,	0.39431913	,	0.14786967	,	0.14786967	,	0.09857978	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//MC
                            [	0.00000000	,	0.04000000	,	0.08000000	,	0.32000000	,	0.12000000	,	0.12000000	,	0.08000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//MLR
                            [	0.00000000	,	0.02105263	,	0.04210526	,	0.16842105	,	0.06315789	,	0.06315789	,	0.04210526	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//OMC
                            [	0.00000000	,	0.01684211	,	0.03368421	,	0.13473684	,	0.05052632	,	0.05052632	,	0.03368421	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//OMLR
                            [	0.00000000	,	0.01263158	,	0.02526316	,	0.10105263	,	0.03789474	,	0.03789474	,	0.02526316	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	]];	//F

        const weightDLon = [[	0.20000000	,	0.04000000	,	0.08000000	,	0.20000000	,	0.12000000	,	0.08000000	,	0.08000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.20000000	],	//DC
                            [	0.15450127	,	0.03090025	,	0.06180051	,	0.15450127	,	0.09270076	,	0.06180051	,	0.06180051	,	0.00000000	,	0.00000000	,	0.00000000	,	0.15450127	],	//DLR
                            [	0.16404575	,	0.03280915	,	0.06561830	,	0.16404575	,	0.09842745	,	0.06561830	,	0.06561830	,	0.00000000	,	0.00000000	,	0.00000000	,	0.16404575	],	//DMC
                            [	0.14045570	,	0.02809114	,	0.05618228	,	0.14045570	,	0.08427342	,	0.05618228	,	0.05618228	,	0.00000000	,	0.00000000	,	0.00000000	,	0.14045570	],	//DMLR
                            [	0.12641013	,	0.02528203	,	0.05056405	,	0.12641013	,	0.07584608	,	0.05056405	,	0.05056405	,	0.00000000	,	0.00000000	,	0.00000000	,	0.12641013	],	//MC
                            [	0.09831899	,	0.01966380	,	0.03932759	,	0.09831899	,	0.05899139	,	0.03932759	,	0.03932759	,	0.00000000	,	0.00000000	,	0.00000000	,	0.09831899	],	//MLR
                            [	0.07022785	,	0.01404557	,	0.02809114	,	0.07022785	,	0.04213671	,	0.02809114	,	0.02809114	,	0.00000000	,	0.00000000	,	0.00000000	,	0.07022785	],	//OMC
                            [	0.05618228	,	0.01123646	,	0.02247291	,	0.05618228	,	0.03370937	,	0.02247291	,	0.02247291	,	0.00000000	,	0.00000000	,	0.00000000	,	0.05618228	],	//OMLR
                            [	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	]];	//F

        const players = $("#tactics_field").find(".field_player:visible").toArray();
        for (const pl of players) {
            //Basic Info
            var ID = $(pl).attr("player_id");
            var NO = $(pl).attr("player_no");
            var ROLE = $(pl).attr("position");
            FormByPos.push(ROLE);
            var ROU = $(pl).find(".field_player_routine").text();
            var player = window.players_by_id[ID];
            var NAME = String(player.name);
            if (NAME.indexOf("&#39;") != -1) {
                NAME = NAME.replace(/[?<=&#39;].*?[?=&#39;]\s/,'');
            }
            if (NAME.indexOf(" ") != -1) {
                NAME = NAME.replace(NAME.match(/[^ ]+/), NAME.match(/^./)+"."); // abbreviate the name
            }
            var FACE = player.appearance.replace("width:100px;border: 7px solid #444;","width:22px;border-top:1px solid #848484;border-left:1px solid #848484;border-right:1px solid #252525;border-bottom:1px solid #252525;border-radius:15px;vertical-align:middle;margin:-2px 2px 0 2px;");
            var Age = player.age;
            var Months = player.months;
            var ASI = player.skill_index;
            var asi = ASI.replace(",","");
            var STR = String(player.skills["0"].value);
            var STA = String(player.skills["2"].value);
            var PAC = String(player.skills["4"].value);
            if (ROLE == "gk") {
                var HAN = String(player.skills["1"].value);
                var ONE = String(player.skills["3"].value);
                var REF = String(player.skills["5"].value);
                var AER = String(player.skills["7"].value);
                var JUM = String(player.skills["9"].value);
                var COM = String(player.skills["11"].value);
                var KIC = String(player.skills["13"].value);
                var THR = String(player.skills["15"].value);
                var skills = [STR,STA,PAC,HAN,ONE,REF,AER,JUM,COM,KIC,THR];
                GKskills = skills; GKasi = asi; GKrou = ROU;
            } else {
                var MAR = String(player.skills["6"].value);
                var TAC = String(player.skills["8"].value);
                var WOR = String(player.skills["10"].value);
                var POS = String(player.skills["12"].value);
                var PAS = String(player.skills["1"].value);
                var CRO = String(player.skills["3"].value);
                var TEC = String(player.skills["5"].value);
                var HEA = String(player.skills["7"].value);
                var FIN = String(player.skills["9"].value);
                var LON = String(player.skills["11"].value);
                var SET = String(player.skills["13"].value);
                skills = [STR,STA,PAC,MAR,TAC,WOR,POS,PAS,CRO,TEC,HEA,FIN,LON,SET];
            }
            for (var i = 0; i<skills.length; i++) {
                if (skills[i].indexOf("<img") != -1) { skills[i] = skills[i].match(/\d+/); }
            }
            var skillSum = 0;
            for (i = 0; i < skills.length; i++) { skillSum += parseInt(skills[i]); }

            for (i = 0; i<posNames.length; i++) {
                if (posNames[i] == ROLE) {
                    var fp = pos[i];
                    var mainRole = fieldRoles[i];
                }
            }
            //Hidden Info
            const info_hidden_player = await get_player_info_hidden_skills(ID);
            var info_hidden_foundHidden = info_hidden_player[0];
            var info_hidden_hiddenInj = info_hidden_player[1];
            var info_hidden_hiddenAgr = info_hidden_player[2];
            var info_hidden_hiddenProf = info_hidden_player[3];
            var info_hidden_hiddenAdapt = info_hidden_player[4];
            if (info_hidden_foundHidden == false) {
                info_hidden_hiddenInj = "?";
                info_hidden_hiddenAgr = "?";
                info_hidden_hiddenProf = "?";
                info_hidden_hiddenAdapt = "?";
            }
            const hidden_info = await get_player_info_scout(ID,false);
            if (info_hidden_hiddenProf == "?" && hidden_info[1]>0) {
                info_hidden_hiddenProf = hidden_info[1];
            }
            if (String(info_hidden_hiddenProf).length>3){
                info_hidden_hiddenProf = funFix1(info_hidden_hiddenProf);
            }
            if (info_hidden_hiddenAgr == "?" && hidden_info[2]>0) {
                info_hidden_hiddenAgr = hidden_info[2];
            }
            if (String(info_hidden_hiddenAgr).length>3){
                info_hidden_hiddenAgr = funFix1(info_hidden_hiddenAgr);
            }
            if (info_hidden_hiddenProf > 0) {
                var CHA = hidden_info[0];
                if (String(CHA).length>3){
                    CHA = funFix1(CHA);
                }
            } else { CHA = ""; }
            // ###  R5 CAPTAINCY  ###########################################################################
            if (CHA!=""&&CHA>0) {
                if (CHA*1>18.9) var CHAfactor = 5;
                else if (CHA*1>14.9) CHAfactor = 4;
                else if (CHA*1>12.9) CHAfactor = 3;
                else if (CHA*1>5.9) CHAfactor = 2;
                else CHAfactor = 1;

                if (leadWeight2 === 0.5 && profWeight2 === 0.25 && rouWeight2 === 0.15 && aggrWeight2 === 0.1) var weightDefault = "default";
                else weightDefault = "custom";
                var cap = 0;
                var cap2 = 0;
                var cap3 = 0;
                var rou3 = ROU;
                var aggr = info_hidden_hiddenAgr;
                var prof = info_hidden_hiddenProf;
                if (leadWeight + profWeight + rouWeight + aggrWeight == 1) cap = funFix2(CHAfactor*leadWeight3[CHAfactor]*20*leadWeight+prof*5*profWeight+rou3*rouWeight+(100-aggr*5)*aggrWeight);
                else cap = 0;
                if (CHAfactor*4+prof*1-aggr*1 < 0) cap3 = 0; // neg
                else cap3 = funFix2((CHAfactor*4+prof*1-aggr*1)/39*rou3);
                if (weightDefault == "custom") {
                    if (leadWeight2 + profWeight2 + rouWeight2 + aggrWeight2 == 1){
                        cap2 = funFix2(CHAfactor*leadWeight3[CHAfactor]*20*leadWeight2+prof*5*profWeight2+rou3*rouWeight2+(100-aggr*5)*aggrWeight2);
                    }
                    else cap2 = 0;
                    captain.push({"ID":ID, "RVA":cap, "CUS":cap2, "TSS":cap3});
                } else {
                    captain.push({"ID":ID, "RVA":cap, "TSS":cap3});
                }
            } else { CHA = "?"; }

            if (ROLE == "gk") { var weight = 48717927500; } else { weight = 263533760000; }
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
            if (minutes > 0) { // Stamina malus
                if (ROLE == "gk") {
                    weight = 48717927500;
                    asi = GKasi;
                    var not20 = 0;
                    var StaMalus = (1-(20-GKskills[1])*minutes/4/200);
                    for (i=0;i<GKskills.length;i++) {
                        if (GKskills[i] != 20) {
                            not20++
                        }
                    }
                    remainder = Math.round((Math.pow(2,Math.log(weight*asi)/Math.log(Math.pow(2,7))) - skillSum)*10)/10; // RatingR5 remainder
                    skillSum = 0;
                    remainder = remainder*StaMalus;
                    for (i = 0; i<GKskills.length; i++) { GKskills[i] = GKskills[i]*StaMalus; skills[i] = GKskills[i]; }
                    for (i = 0; i<GKskills.length; i++) { skillsB[i] = skillsB[i]*StaMalus; skillSum += skillsB[i]; }
                    asi = Math.round(Math.pow(skillSum/11*14, 7)/(Math.pow(2, 9) * Math.pow(5, 4) * Math.pow(7, 7)));
                    ASI = addCommas(asi);
                    GKasi = asi;
                } else {
                    skillSum = 0;
                    StaMalus = (1-(20-skills[1])*minutes/200);
                    remainder = remainder*StaMalus;
                    for (i = 0; i<skills.length; i++) { skills[i] = skills[i]*StaMalus; }
                    for (i = 0; i<skillsB.length; i++) { skillsB[i] = skillsB[i]*StaMalus; skillSum += skillsB[i]; }
                    asi = Math.round(Math.pow(skillSum, 7)/(Math.pow(2, 9) * Math.pow(5, 4) * Math.pow(7, 7)));
                    ASI = addCommas(asi);
                }
            }
            // END STAMINA MALUS
            var PosMalus = $(pl).find(".icons > div").attr("class");
            if (PosMalus == "mood mood3") PosMalus = 10;
            else if (PosMalus == "mood mood4") PosMalus = 20;
            else if (PosMalus == "mood mood5") PosMalus = 30;
            else if (PosMalus == "mood mood6") PosMalus = 40;
            else PosMalus = 0;
            if (PosMalus > 0) {
                skillSum = 0;
                if (info_hidden_hiddenAdapt == "?") {
                    var noinfo = true;
                    var hiddenAdapt = 20;
                } else {
                    hiddenAdapt = info_hidden_hiddenAdapt;
                }
                var AdaMalus = (100-(PosMalus*(20-hiddenAdapt)/20))/100;
                for (i = 0; i<skills.length; i++) { skills[i] = skills[i]*AdaMalus; }
                for (i = 0; i<skillsB.length; i++) { skillsB[i] = skillsB[i]*AdaMalus; skillSum += skillsB[i]; }
                asi = Math.round(Math.pow(skillSum, 7)/(Math.pow(2, 9) * Math.pow(5, 4) * Math.pow(7, 7)));
                ASI = addCommas(asi);
                if (fp == 0 || fp == 1) { // DC and DLR
                    totDEF += 1;
                    totDEFrou += ROU*1;
                    dSTR += skills[0]*AdaMalus;
                    dPAC += skills[2]*AdaMalus;
                    dMAR += skills[3]*AdaMalus;
                    dTAC += skills[4]*AdaMalus;
                    dWOR += skills[5]*AdaMalus;
                    dPOS += skills[6]*AdaMalus;
                    dHEA += skills[10]*AdaMalus;
                }
            } else {
                if (fp == 0 || fp == 1) { // DC and DLR
                    totDEF += 1;
                    totDEFrou += ROU*1;
                    dSTR += skills[0]*1;
                    dPAC += skills[2]*1;
                    dMAR += skills[3]*1;
                    dTAC += skills[4]*1;
                    dWOR += skills[5]*1;
                    dPOS += skills[6]*1;
                    dHEA += skills[10]*1;
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
            if (fp !== 9) { SetPieces.push({"ID":ID, "FK":fkBonus, "CK":ckBonus, "PK":pkBonus}); }
            var gainBase = funFix2((strRou**2+staRou**2*0.5+pacRou**2*0.5+marRou**2+tacRou**2+worRou**2+posRou**2)/6/22.9**2);
            var keepBase = funFix2((strRou**2*0.5+staRou**2*0.5+pacRou**2+marRou**2+tacRou**2+worRou**2+posRou**2)/6/22.9**2);
            //   0:DC		  1:DL/R		   2:DMC		   3:DML/R		   4:MC			  5:ML/R		  6:OMC			 7:OML/R			8:F
            var posGain = [	gainBase*0.3, 	gainBase*0.3, 	gainBase*0.9, 	gainBase*0.6, 	gainBase*1.5, 	gainBase*0.9, 	gainBase*0.9, 	gainBase*0.6, 	gainBase*0.3];
            var posKeep = [	keepBase*0.3,	keepBase*0.3, 	keepBase*0.9, 	keepBase*0.6, 	keepBase*1.5, 	keepBase*0.9, 	keepBase*0.9, 	keepBase*0.6, 	keepBase*0.3];
            if (skills.length == 11) var allBonus = 0;
            else allBonus = headerBonus*1 + fkBonus*1 + ckBonus*1 + pkBonus*1;
            var defense = []; var assist = []; var shot = [];
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
            shot.push(Fbal, Fdir, Fwin, Fsho, Flon, Fthr);
            StyleValues.push({ "ID":ID, "DEF":defense, "ASS":assist, "FIN":shot });
            // calculate REC and RatingR5:
            var rec = 0;			// RERECb
            var ratingR = 0;		// RatingR5
            var ratingR5 = 0;		// RatingR5 + routine

            var remainderWeight = 0;		// REREC remainder weight sum
            var remainderWeight2 = 0;		// RatingR5 remainder weight sum
            not20 = 0;						// skill < 20
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
            var Abon = funFix2(assist[AttStyle-1]);
            var AbonBAL = funFix2(assist[0]); var AbonDIR = funFix2(assist[1]); var AbonWIN = funFix2(assist[2]);
            var AbonSHO = funFix2(assist[3]); var AbonLON = funFix2(assist[4]); var AbonTHR = funFix2(assist[5]);
            var Fbon = funFix2(shot[AttStyle-1]);
            var FbonBAL = funFix2(shot[0]); var FbonDIR = funFix2(shot[1]); var FbonWIN = funFix2(shot[2]);
            var FbonSHO = funFix2(shot[3]); var FbonLON = funFix2(shot[4]); var FbonTHR = funFix2(shot[5]);
            // totals //
            if (fp == 0 || fp == 1) { // DEF
                totROUd+=ROU*1; totASId+=asi*1; totRECd+=rec*1; totRR5d+=R5FP*1;
                totDBALd+=Dbal*1; totDDIRd+=Ddir*1; totDWINd+=Dwin*1; totDSHOd+=Dsho*1; totDLONd+=Dlon*1; totDTHRd+=Dthr*1;
                totABONd+=Abon*1; totFBONd+=Fbon*1; totGAINd+=posGain[fp]*1; totKEEPd+=posKeep[fp]*1;
                totABALd+=AbonBAL*1; totADIRd+=AbonDIR*1; totAWINd+=AbonWIN*1; totASHOd+=AbonSHO*1; totALONd+=AbonLON*1; totATHRd+=AbonTHR*1;
                totFBALd+=FbonBAL*1; totFDIRd+=FbonDIR*1; totFWINd+=FbonWIN*1; totFSHOd+=FbonSHO*1; totFLONd+=FbonLON*1; totFTHRd+=FbonTHR*1;
            } else if (fp == 2 || fp == 3 || fp == 4 || fp == 5) { // MID
                totMID+=1; totROUm+=ROU*1; totASIm+=asi*1; totRECm+=rec*1; totRR5m+=R5FP*1;
                totDBALm+=Dbal*1; totDDIRm+=Ddir*1; totDWINm+=Dwin*1; totDSHOm+=Dsho*1; totDLONm+=Dlon*1; totDTHRm+=Dthr*1;
                totABONm+=Abon*1; totFBONm+=Fbon*1; totGAINm+=posGain[fp]*1; totKEEPm+=posKeep[fp]*1;
                totABALm+=AbonBAL*1; totADIRm+=AbonDIR*1; totAWINm+=AbonWIN*1; totASHOm+=AbonSHO*1; totALONm+=AbonLON*1; totATHRm+=AbonTHR*1;
                totFBALm+=FbonBAL*1; totFDIRm+=FbonDIR*1; totFWINm+=FbonWIN*1; totFSHOm+=FbonSHO*1; totFLONm+=FbonLON*1; totFTHRm+=FbonTHR*1;
            } else if (fp == 6 || fp == 7 || fp == 8) { // FOR
                totFOR+=1; totROUf+=ROU*1; totASIf+=asi*1; totRECf+=rec*1; totRR5f+=R5FP*1;
                totDBALf+=Dbal*1; totDDIRf+=Ddir*1; totDWINf+=Dwin*1; totDSHOf+=Dsho*1; totDLONf+=Dlon*1; totDTHRf+=Dthr*1;
                totABONf+=Abon*1; totFBONf+=Fbon*1; totGAINf+=posGain[fp]*1; totKEEPf+=posKeep[fp]*1;
                totABALf+=AbonBAL*1; totADIRf+=AbonDIR*1; totAWINf+=AbonWIN*1; totASHOf+=AbonSHO*1; totALONf+=AbonLON*1; totATHRf+=AbonTHR*1;
                totFBALf+=FbonBAL*1; totFDIRf+=FbonDIR*1; totFWINf+=FbonWIN*1; totFSHOf+=FbonSHO*1; totFLONf+=FbonLON*1; totFTHRf+=FbonTHR*1;
            } else if (fp == 9) {
                GKrec = rec*1;
                GKrr5 = R5FP*1;
            }
            if (ROLE.indexOf("dm") != -1) { var favpos = ROLE.replace("dm","DM"); }
            else if (ROLE.indexOf("om") != -1) { favpos = ROLE.replace("om","OM"); }
            else { favpos = ROLE.substr(0,1).toUpperCase()+ROLE.substr(1); }
            // R5REC
            if (fp == 9) { // GK
                var phySum = skills[0]*1 + skills[1]*1 + skills[2]*1 + skills[7]*1;
                var tacSum = skills[4]*1 + skills[6]*1 + skills[8]*1;
                var tecSum = skills[3]*1 + skills[5]*1 + skills[9]*1 + skills[10]*1;
                var peak = [4,3,4];
                savingREC += funFix2((skills[0]*0.092691271+skills[1]*0.007577625+skills[2]*0.104277679+skills[3]*0.278073812+skills[4]*0.069518453+skills[5]*0.278073812+skills[6]*0.069518453+skills[7]*0.092691271+skills[8]*0.007577625+rou2)/4)*1;
                counterREC += funFix2((skills[0]*0.046345635+skills[1]*0.003788813+skills[2]*0.052138840+skills[3]*0.139036906+skills[4]*0.034759226+skills[5]*0.139036906+skills[6]*0.034759226+skills[7]*0.046345635+skills[8]*0.003788813+skills[9]*0.25+skills[10]*0.25+rou2)/4)*1;
                phyRECgk += funFix2((phySum/peak[0]+rou2)*5/20)*1;
                tacRECgk += funFix2((tacSum/peak[1]+rou2)*5/20)*1;
                tecRECgk += funFix2((tecSum/peak[2]+rou2)*5/20)*1;
                var p = [ID,phyRECgk,tacRECgk,tecRECgk,savingREC,counterREC];
                RR5REC.push(p);
            } else if (fp == 0 || fp == 1) { // DEF
                phySum = skills[0]*1 + skills[1]*1 + skills[2]*1 + skills[10]*1;
                tacSum = skills[3]*1 + skills[4]*1 + skills[5]*1 + skills[6]*1;
                tecSum = skills[7]*1 + skills[8]*1 + skills[9]*1 + skills[11]*1 + skills[12]*1 + skills[13]*1;
                peak = [4,4,6];
                assistRECd += funFix2((skills[0]*0.01+skills[1]*0.1+skills[2]*0.2+skills[5]*0.09+skills[6]*0.07+skills[7]*0.22+skills[8]*0.13+skills[9]*0.18+rou2)/4)*1;
                defenceRECd += funFix2((skills[0]*0.121481481+skills[1]*0.040740741+skills[2]*0.111111111+skills[3]*0.202962963+skills[4]*0.2+skills[5]*0.071111111+skills[6]*0.071111111+skills[10]*0.181481481+rou2)/4)*1;
                shootingRECd += funFix2((skills[0]*0.082813522+skills[2]*0.038541421+skills[5]*0.087757535+skills[6]*0.126339391+skills[9]*0.104203341+skills[10]*0.104949572+skills[11]*0.301067794+skills[12]*0.154327424+rou2)/4)*1;
                phyRECd += funFix2((phySum/peak[0]+rou2)*5/20)*1;
                tacRECd += funFix2((tacSum/peak[1]+rou2)*5/20)*1;
                tecRECd += funFix2((tecSum/peak[2]+rou2)*5/20)*1;
                phyREC = funFix2((phySum/peak[0]+rou2)*5/20)*1;
                tacREC = funFix2((tacSum/peak[1]+rou2)*5/20)*1;
                tecREC = funFix2((tecSum/peak[2]+rou2)*5/20)*1;
                assistREC = funFix2((skills[0]*0.01+skills[1]*0.1+skills[2]*0.2+skills[5]*0.09+skills[6]*0.07+skills[7]*0.22+skills[8]*0.13+skills[9]*0.18+rou2)/4)*1;
                defenceREC = funFix2((skills[0]*0.121481481+skills[1]*0.040740741+skills[2]*0.111111111+skills[3]*0.202962963+skills[4]*0.2+skills[5]*0.071111111+skills[6]*0.071111111+skills[10]*0.181481481+rou2)/4)*1;
                shootingREC = funFix2((skills[0]*0.082813522+skills[2]*0.038541421+skills[5]*0.087757535+skills[6]*0.126339391+skills[9]*0.104203341+skills[10]*0.104949572+skills[11]*0.301067794+skills[12]*0.154327424+rou2)/4)*1;
                p = [ID,phyREC,tacREC,tecREC,defenceREC,assistREC,shootingREC];
                RR5REC.push(p);
            } else if (fp == 2 || fp == 3 || fp == 4 || fp == 5) { // MID
                phySum = skills[0]*1 + skills[1]*1 + skills[2]*1 + skills[10]*1;
                tacSum = skills[3]*1 + skills[4]*1 + skills[5]*1 + skills[6]*1;
                tecSum = skills[7]*1 + skills[8]*1 + skills[9]*1 + skills[11]*1 + skills[12]*1 + skills[13]*1;
                peak = [4,4,6];
                assistRECm += funFix2((skills[0]*0.01+skills[1]*0.1+skills[2]*0.2+skills[5]*0.09+skills[6]*0.07+skills[7]*0.22+skills[8]*0.13+skills[9]*0.18+rou2)/4)*1;
                defenceRECm += funFix2((skills[0]*0.121481481+skills[1]*0.040740741+skills[2]*0.111111111+skills[3]*0.202962963+skills[4]*0.2+skills[5]*0.071111111+skills[6]*0.071111111+skills[10]*0.181481481+rou2)/4)*1;
                shootingRECm += funFix2((skills[0]*0.082813522+skills[2]*0.038541421+skills[5]*0.087757535+skills[6]*0.126339391+skills[9]*0.104203341+skills[10]*0.104949572+skills[11]*0.301067794+skills[12]*0.154327424+rou2)/4)*1;
                phyRECm += funFix2((phySum/peak[0]+rou2)*5/20)*1;
                tacRECm += funFix2((tacSum/peak[1]+rou2)*5/20)*1;
                tecRECm += funFix2((tecSum/peak[2]+rou2)*5/20)*1;
                phyREC = funFix2((phySum/peak[0]+rou2)*5/20)*1;
                tacREC = funFix2((tacSum/peak[1]+rou2)*5/20)*1;
                tecREC = funFix2((tecSum/peak[2]+rou2)*5/20)*1;
                assistREC = funFix2((skills[0]*0.01+skills[1]*0.1+skills[2]*0.2+skills[5]*0.09+skills[6]*0.07+skills[7]*0.22+skills[8]*0.13+skills[9]*0.18+rou2)/4)*1;
                defenceREC = funFix2((skills[0]*0.121481481+skills[1]*0.040740741+skills[2]*0.111111111+skills[3]*0.202962963+skills[4]*0.2+skills[5]*0.071111111+skills[6]*0.071111111+skills[10]*0.181481481+rou2)/4)*1;
                shootingREC = funFix2((skills[0]*0.082813522+skills[2]*0.038541421+skills[5]*0.087757535+skills[6]*0.126339391+skills[9]*0.104203341+skills[10]*0.104949572+skills[11]*0.301067794+skills[12]*0.154327424+rou2)/4)*1;
                p = [ID,phyREC,tacREC,tecREC,defenceREC,assistREC,shootingREC];
                RR5REC.push(p);
            } else if (fp == 6 || fp == 7 || fp == 8) { // FOR
                phySum = skills[0]*1 + skills[1]*1 + skills[2]*1 + skills[10]*1;
                tacSum = skills[3]*1 + skills[4]*1 + skills[5]*1 + skills[6]*1;
                tecSum = skills[7]*1 + skills[8]*1 + skills[9]*1 + skills[11]*1 + skills[12]*1 + skills[13]*1;
                peak = [4,4,6];
                assistRECf += funFix2((skills[0]*0.01+skills[1]*0.1+skills[2]*0.2+skills[5]*0.09+skills[6]*0.07+skills[7]*0.22+skills[8]*0.13+skills[9]*0.18+rou2)/4)*1;
                defenceRECf += funFix2((skills[0]*0.121481481+skills[1]*0.040740741+skills[2]*0.111111111+skills[3]*0.202962963+skills[4]*0.2+skills[5]*0.071111111+skills[6]*0.071111111+skills[10]*0.181481481+rou2)/4)*1;
                shootingRECf += funFix2((skills[0]*0.082813522+skills[2]*0.038541421+skills[5]*0.087757535+skills[6]*0.126339391+skills[9]*0.104203341+skills[10]*0.104949572+skills[11]*0.301067794+skills[12]*0.154327424+rou2)/4)*1;
                phyRECf += funFix2((phySum/peak[0]+rou2)*5/20)*1;
                tacRECf += funFix2((tacSum/peak[1]+rou2)*5/20)*1;
                tecRECf += funFix2((tecSum/peak[2]+rou2)*5/20)*1;
                phyREC = funFix2((phySum/peak[0]+rou2)*5/20)*1;
                tacREC = funFix2((tacSum/peak[1]+rou2)*5/20)*1;
                tecREC = funFix2((tecSum/peak[2]+rou2)*5/20)*1;
                assistREC = funFix2((skills[0]*0.01+skills[1]*0.1+skills[2]*0.2+skills[5]*0.09+skills[6]*0.07+skills[7]*0.22+skills[8]*0.13+skills[9]*0.18+rou2)/4)*1;
                defenceREC = funFix2((skills[0]*0.121481481+skills[1]*0.040740741+skills[2]*0.111111111+skills[3]*0.202962963+skills[4]*0.2+skills[5]*0.071111111+skills[6]*0.071111111+skills[10]*0.181481481+rou2)/4)*1;
                shootingREC = funFix2((skills[0]*0.082813522+skills[2]*0.038541421+skills[5]*0.087757535+skills[6]*0.126339391+skills[9]*0.104203341+skills[10]*0.104949572+skills[11]*0.301067794+skills[12]*0.154327424+rou2)/4)*1;
                p = [ID,phyREC,tacREC,tecREC,defenceREC,assistREC,shootingREC];
                RR5REC.push(p);
            } // END R5REC

            // Player Graph (by Pra'deCalsina')
            var altezzagrafico=114;
            var larghezzagrafico=118;
            var centrox=54;
            var centroy=60;
            var raggio=46;
            var ot=raggio/10;
            var grafico='<svg height="'+altezzagrafico+'" width="'+larghezzagrafico+'">';
            grafico+='<rect width="'+larghezzagrafico+'" height="'+altezzagrafico+'" style="fill:#333333;stroke-width:3;stroke:#333333" />';
            grafico+='<circle cx="'+centrox+'" cy="'+centroy+'" r="'+raggio+'" stroke="#444c4f" stroke-width="1" fill="#444c4f" />';
            grafico+='<circle cx="'+centrox+'" cy="'+centroy+'" r="'+(0.7*raggio)+'" stroke="#333333" stroke-width="1" fill="#333333" />';
            grafico+='<circle cx="'+centrox+'" cy="'+centroy+'" r="1" stroke="#9ca4a7" stroke-width="1" />';
            grafico+='<polygon points="';
            if (fp == 9) { // GK
                var gPHY=funFix2((skills[0]*1+skills[1]*1+skills[2]*1+skills[7]*1)/80)*1;
                var gTAC=funFix2((skills[4]*1+skills[6]*1+skills[8]*1)/60)*1;
                var gTEC=funFix2((skills[3]*1+skills[5]*1+skills[9]*1+skills[10]*1)/80)*1;
                var gSAV=funFix2((skills[0]*0.092691271+skills[1]*0.007577625+skills[2]*0.104277679+skills[3]*0.278073812+skills[4]*0.069518453+skills[5]*0.278073812+skills[6]*0.069518453+skills[7]*0.092691271+skills[8]*0.007577625+rou2)/22.91)*1;
                var gCOU=funFix2((skills[0]*0.046345635+skills[1]*0.003788813+skills[2]*0.052138840+skills[3]*0.139036906+skills[4]*0.034759226+skills[5]*0.139036906+skills[6]*0.034759226+skills[7]*0.046345635+skills[8]*0.003788813+skills[9]*0.25+skills[10]*0.25+rou2)/22.91)*1;
                grafico+=(centrox)+','+(centroy+raggio*gSAV*gSAV)+' ';
                grafico+=(centrox-raggio*0.866025404*gTEC*gTEC)+','+(centroy+raggio*0.5*gTEC*gTEC)+' ';
                grafico+=(centrox-raggio*0.866025404*gPHY*gPHY)+','+(centroy-raggio*0.5*gPHY*gPHY)+' ';
                grafico+=(centrox+raggio*0.866025404*gTAC*gTAC)+','+(centroy-raggio*0.5*gTAC*gTAC)+' ';
                grafico+=(centrox+raggio*0.866025404*gCOU*gCOU)+','+(centroy+raggio*0.5*gCOU*gCOU)+'" ';
                grafico+='style="fill:#286e78;stroke:#40adb0;fill-opacity:0.4;stroke-width:1.5"></polygon>';
                grafico+='<text x="'+(centrox-2.45*ot)+'" y="'+(centroy+raggio+0.2*ot)+'" fill="#ddd">SAV<title>Saving: '+Math.round(gSAV*100)+'%</title></text>';
                grafico+='<text x="'+(centrox-raggio*0.8-2.5*ot)+'" y="'+(centroy+raggio*0.5+ot)+'" fill="#ddd">TEC<title>Technical: '+Math.round(gTEC*100)+'%</title></text>';
                grafico+='<text x="'+(centrox-raggio*0.8-2.5*ot)+'" y="'+(centroy-raggio*0.3-ot)+'" fill="#ddd">PHY<title>Physical: '+Math.round(gPHY*100)+'%</title></text>';
                grafico+='<text x="'+(centrox+raggio*0.58)+'" y="'+(centroy-raggio*0.3-ot)+'" fill="#ddd">TAC<title>Tactical: '+Math.round(gTAC*100)+'%</title></text>';
                grafico+='<text x="'+(centrox+raggio*0.58)+'" y="'+(centroy+raggio*0.5+ot)+'" fill="#ddd">COU<title>Counter: '+Math.round(gCOU*100)+'%</title></text></svg>';
                if(String(skills[0]).indexOf(".")!=-1){var STRg=funFix1(skills[0]);} else {STRg=skills[0]};
                if(String(skills[1]).indexOf(".")!=-1){var STAg=funFix1(skills[1]);} else {STAg=skills[1]};
                if(String(skills[2]).indexOf(".")!=-1){var PACg=funFix1(skills[2]);} else {PACg=skills[2]};
                if(String(skills[3]).indexOf(".")!=-1){var HANg=funFix1(skills[3]);} else {HANg=skills[3]};
                if(String(skills[4]).indexOf(".")!=-1){var ONEg=funFix1(skills[4]);} else {ONEg=skills[4]};
                if(String(skills[5]).indexOf(".")!=-1){var REFg=funFix1(skills[5]);} else {REFg=skills[5]};
                if(String(skills[6]).indexOf(".")!=-1){var AERg=funFix1(skills[6]);} else {AERg=skills[6]};
                if(String(skills[7]).indexOf(".")!=-1){var JUMg=funFix1(skills[7]);} else {JUMg=skills[7]};
                if(String(skills[8]).indexOf(".")!=-1){var COMg=funFix1(skills[8]);} else {COMg=skills[8]};
                if(String(skills[9]).indexOf(".")!=-1){var KICg=funFix1(skills[9]);} else {KICg=skills[9]};
                if(String(skills[10]).indexOf(".")!=-1){var THRg=funFix1(skills[10]);} else {THRg=skills[10]};
                p = [ID,NAME,grafico,info_hidden_hiddenAgr,info_hidden_hiddenInj,info_hidden_hiddenProf,info_hidden_hiddenAdapt,CHA,STRg,STAg,PACg,HANg,ONEg,REFg,AERg,JUMg,COMg,KICg,THRg];
            } else {
                gPHY=funFix2((skills[0]*1+skills[1]*1+skills[2]*1+skills[10]*1)/80)*1;
                gTAC=funFix2((skills[3]*1+skills[4]*1+skills[5]*1+skills[6]*1)/80)*1;
                gTEC=funFix2((skills[7]*1+skills[8]*1+skills[9]*1+skills[11]*1+skills[12]*1+skills[13]*1)/120)*1;
                var gDEF=funFix2((skills[0]*0.121481481+skills[1]*0.040740741+skills[2]*0.111111111+skills[3]*0.202962963+skills[4]*0.2+skills[5]*0.071111111+skills[6]*0.071111111+skills[10]*0.181481481+rou2*1)/22.91)*1;
                var gASS=funFix2((skills[0]*0.01+skills[1]*0.1+skills[2]*0.2+skills[5]*0.09+skills[6]*0.07+skills[7]*0.22+skills[8]*0.13+skills[9]*0.18+rou2*1)/22.91)*1;
                var gSHO=funFix2((skills[0]*0.082813522+skills[2]*0.038541421+skills[5]*0.087757535+skills[6]*0.126339391+skills[9]*0.104203341+skills[10]*0.104949572+skills[11]*0.301067794+skills[12]*0.154327424+rou2*1)/22.91)*1;
                grafico+=(centrox)+','+(centroy+raggio*gTAC*gTAC)+' ';
                grafico+=(centrox-raggio*0.866025404*gDEF*gDEF)+','+(centroy+raggio*0.5*gDEF*gDEF)+' ';
                grafico+=(centrox-raggio*0.866025404*gASS*gASS)+','+(centroy-raggio*0.5*gASS*gASS)+' ';
                grafico+=(centrox)+','+(centroy-raggio*gSHO*gSHO)+' ';
                grafico+=(centrox+raggio*0.866025404*gTEC*gTEC)+','+(centroy-raggio*0.5*gTEC*gTEC)+' ';
                grafico+=(centrox+raggio*0.866025404*gPHY*gPHY)+','+(centroy+raggio*0.5*gPHY*gPHY)+'" ';
                grafico+='style="fill:#286e78;stroke:#40adb0;fill-opacity:0.4;stroke-width:1.5"></polygon>';
                grafico+='<text x="'+(centrox-2.45*ot)+'" y="'+(centroy+raggio+0.2*ot)+'" fill="#ddd">TAC<title>Tactical: '+Math.round(gTAC*100)+'%</title></text>';
                grafico+='<text x="'+(centrox-raggio*0.8-2.5*ot)+'" y="'+(centroy+raggio*0.5+ot)+'" fill="#ddd">DEF<title>Defense: '+Math.round(gDEF*100)+'%</title></text>';
                grafico+='<text x="'+(centrox-raggio*0.8-2.5*ot)+'" y="'+(centroy-raggio*0.3-ot)+'" fill="#ddd">ASS<title>Assist: '+Math.round(gASS*100)+'%</title></text>';
                grafico+='<text x="'+(centrox-2.45*ot)+'" y="'+(centroy-raggio+2*ot)+'" fill="#ddd">SHO<title>Shooting: '+Math.round(gSHO*100)+'%</title></text>';
                grafico+='<text x="'+(centrox+raggio*0.58)+'" y="'+(centroy-raggio*0.3-ot)+'" fill="#ddd">TEC<title>Technical: '+Math.round(gTEC*100)+'%</title></text>';
                grafico+='<text x="'+(centrox+raggio*0.58)+'" y="'+(centroy+raggio*0.5+ot)+'" fill="#ddd">PHY<title>Physical: '+Math.round(gPHY*100)+'%</title></text></svg>';
                if(String(skills[0]).indexOf(".")!=-1){STRg=funFix1(skills[0]);} else {STRg=skills[0]};
                if(String(skills[1]).indexOf(".")!=-1){STAg=funFix1(skills[1]);} else {STAg=skills[1]};
                if(String(skills[2]).indexOf(".")!=-1){PACg=funFix1(skills[2]);} else {PACg=skills[2]};
                if(String(skills[3]).indexOf(".")!=-1){var MARg=funFix1(skills[3]);} else {MARg=skills[3]};
                if(String(skills[4]).indexOf(".")!=-1){var TACg=funFix1(skills[4]);} else {TACg=skills[4]};
                if(String(skills[5]).indexOf(".")!=-1){var WORg=funFix1(skills[5]);} else {WORg=skills[5]};
                if(String(skills[6]).indexOf(".")!=-1){var POSg=funFix1(skills[6]);} else {POSg=skills[6]};
                if(String(skills[7]).indexOf(".")!=-1){var PASg=funFix1(skills[7]);} else {PASg=skills[7]};
                if(String(skills[8]).indexOf(".")!=-1){var CROg=funFix1(skills[8]);} else {CROg=skills[8]};
                if(String(skills[9]).indexOf(".")!=-1){var TECg=funFix1(skills[9]);} else {TECg=skills[9]};
                if(String(skills[10]).indexOf(".")!=-1){var HEAg=funFix1(skills[10]);} else {HEAg=skills[10]};
                if(String(skills[11]).indexOf(".")!=-1){var FINg=funFix1(skills[11]);} else {FINg=skills[11]};
                if(String(skills[12]).indexOf(".")!=-1){var LONg=funFix1(skills[12]);} else {LONg=skills[12]};
                if(String(skills[13]).indexOf(".")!=-1){var SETg=funFix1(skills[13]);} else {SETg=skills[13]};
                p = [ID,NAME,grafico,info_hidden_hiddenAgr,info_hidden_hiddenInj,info_hidden_hiddenProf,info_hidden_hiddenAdapt,CHA,STRg,STAg,PACg,MARg,TACg,WORg,POSg,PASg,CROg,TECg,HEAg,FINg,LONg,SETg];
            }
            PlayersDetails.push(p);
            // end of Player Graph

            if (fp == 9) { $("#MoreInfosUl").append(
                "<li class='MoreInfos' player_link='"+ID+"' player_id='"+ID+"' style='display:block;list-style-type:none;border-top:1px solid #444;border-right:1px solid #444;border-bottom:1px solid #222;line-height:24px;padding:0;margin:0;'>"+
                "<div class='favposition short' style='width:30px;text-align:center;margin:0 3px 0 3px;'><span class='"+mainRole+"'>"+favpos+
                "</span></div><div class='vert_split' style='display: inline-block;float:none'></div><div style='width:20px;display:inline-block;text-align:center;'>"+NO+
                "</div><div class='vert_split' style='display:inline-block;float:none'></div></div><div style='width:32px;display:inline-block;text-align:center;'>"+FACE+
                "</div><div style='display:inline-block;width:128px;white-space:nowrap;overflow:hidden;vertical-align:middle;cursor:pointer;'><span class='player_name'>"+NAME+
                "</span><div class='icons' style='margin-left:-2px;margin-top:-24px;position:static;text-align:right;width:128px;'>&nbsp;</div>"+
                "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:35px;color:greenyellow;'>"+ROU+
                "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:60px;color:moccasin;'>"+ASI+
                "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;color:gold;'>"+rec+
                "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:orange;'>"+R5FP+
                "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#accbf7;'>-"+
                "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#accbf7;'>-"+
                "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#accbf7;'>-"+
                "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#accbf7;'>-"+
                "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#accbf7;'>-"+
                "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#accbf7;'>-"+
                "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#ffff93;'>-"+
                "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#ffb89e;'>-"+
                "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;color:#dddddd;'>-"+
                "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;'>"+Age+"."+Months+
                //"</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;color:#dddddd;cursor:pointer;' title='Professionalism "+info_hidden_hiddenProf+"\nAggression "+info_hidden_hiddenAgr+"\nInjury prone."+info_hidden_hiddenInj+"\nAdaptability "+info_hidden_hiddenAdapt+"'><img src='/pics/magnifying_glass_normal.png'>"+
                "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;vertical-align:top;width:43px;height:27px;line-height:7px;color:#dddddd;cursor:pointer;' title='Professionalism "+info_hidden_hiddenProf+"\nAggression "+info_hidden_hiddenAgr+"\nInjury proneness "+info_hidden_hiddenInj+"\nAdaptability "+info_hidden_hiddenAdapt+"'><span style='display:block;font-size:7px;width:40px;height:4px;line-height:7px;margin: 0 auto;'>AGG</span><span style='display:inline-block;font-size:7px;line-height:6px;width:7px;height:18px;margin: 0px auto;'>P<br>R<br>O</span><span class='HID"+ID+"' style='display:inline-block;width:5px;height:5px;border:3px solid #b9b9b9;border-radius:10px;margin:3px 2px;'></span><span style='display:inline-block;font-size:7px;line-height:6px;width:7px;height:18px;'>I<br>N<br>J</span><span style='display:block;font-size:7px;width:40px;height:4px;line-height:3px;margin: 0 auto;'>ADA</span>"+
                "</div></li>"); }
            else { $("#MoreInfosUl").append(
                "<li class='MoreInfos' player_link='"+ID+"' player_id='"+ID+"' style='display: block;list-style-type: none;border-top: 1px solid #444;border-right: 1px solid #444;border-bottom: 1px solid #222;line-height: 24px;padding: 0;margin: 0;'>"+
                "<div class='favposition short' style='width:30px;text-align:center;margin:0 3px 0 3px;'><span class='"+mainRole+"'>"+favpos+
                "</span></div><div class='vert_split' style='display: inline-block;float:none'></div><div style='width:20px;display:inline-block;text-align:center;'>"+NO+
                "</div><div class='vert_split' style='display:inline-block;float:none'></div></div><div style='width:32px;display:inline-block;text-align:center;'>"+FACE+
                "</div><div style='display:inline-block;width:128px;white-space:nowrap;overflow:hidden;vertical-align:middle;cursor:pointer;'><span class='player_name'>"+NAME+
                "</span><div class='icons' style='margin-left:-2px;margin-top:-24px;position:static;text-align:right;width:128px;'>&nbsp;</div>"+
                "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:35px;color:greenyellow;'>"+ROU+
                "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:60px;color:moccasin;'>"+ASI+
                "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;color:gold;'>"+rec+
                "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:orange;'>"+R5FP+
                "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#accbf7;'>"+funFix2(Dbal)+
                "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#accbf7;'>"+funFix2(Ddir)+
                "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#accbf7;'>"+funFix2(Dwin)+
                "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#accbf7;'>"+funFix2(Dsho)+
                "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#accbf7;'>"+funFix2(Dlon)+
                "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#accbf7;'>"+funFix2(Dthr)+
                "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#ffff93;cursor:pointer;' title='Bal: "+funFix2(Abal)+" | Dir: "+funFix2(Adir)+" | Win: "+funFix2(Awin)+"\nSho: "+funFix2(Asho)+" | Lon: "+funFix2(Alon)+" | Thr: "+funFix2(Athr)+"'>"+Abon+
                "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#ffb89e;cursor:pointer;' title='Bal: "+funFix2(Fbal)+" | Dir: "+funFix2(Fdir)+" | Win: "+funFix2(Fwin)+"\nSho: "+funFix2(Fsho)+" | Lon: "+funFix2(Flon)+" | Thr: "+funFix2(Fthr)+"'>"+Fbon+
                "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;color:#dddddd;cursor:pointer;' title='Gain: "+funFix2(posGain[fp]*1)+" | Keep: "+funFix2(posKeep[fp]*1)+"'>"+funFix2((posGain[fp]*1+posKeep[fp]*1)/2)+
                "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;'>"+Age+"."+Months+
                //"</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;color:#dddddd;cursor:pointer;' title='Professionalism "+info_hidden_hiddenProf+"\nAggression "+info_hidden_hiddenAgr+"\nInjury prone."+info_hidden_hiddenInj+"\nAdaptability "+info_hidden_hiddenAdapt+"'><img src='/pics/magnifying_glass_normal.png'>"+
                "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;vertical-align:top;width:43px;height:27px;line-height:7px;color:#dddddd;cursor:pointer;' title='Professionalism "+info_hidden_hiddenProf+"\nAggression "+info_hidden_hiddenAgr+"\nInjury proneness "+info_hidden_hiddenInj+"\nAdaptability "+info_hidden_hiddenAdapt+"'><span style='display:block;font-size:7px;width:40px;height:4px;line-height:7px;margin: 0 auto;'>AGG</span><span style='display:inline-block;font-size:7px;line-height:6px;width:7px;height:18px;margin: 0px auto;'>P<br>R<br>O</span><span class='HID"+ID+"' style='display:inline-block;width:5px;height:5px;border:3px solid #b9b9b9;border-radius:10px;margin:3px 2px;'></span><span style='display:inline-block;font-size:7px;line-height:6px;width:7px;height:18px;'>I<br>N<br>J</span><span style='display:block;font-size:7px;width:40px;height:4px;line-height:3px;margin: 0 auto;'>ADA</span>"+
                "</div></li>"); }
            if (info_hidden_hiddenProf != "?") {
                if (info_hidden_hiddenProf>15.9) var PROcolor = "3px solid #50d243";
                else if (info_hidden_hiddenProf>10.9) PROcolor = "3px solid #adff13";
                else if (info_hidden_hiddenProf>5.9) PROcolor = "3px solid #e0a110";
                else if (info_hidden_hiddenProf>0) PROcolor = "3px solid #d13c3a";
                else PROcolor = "3px solid #b9b9b9";
                if (info_hidden_hiddenAgr>15.9) var AGRcolor = "3px solid #d13c3a";
                else if (info_hidden_hiddenAgr>10.9) AGRcolor = "3px solid #e0a110";
                else if (info_hidden_hiddenAgr>5.9) AGRcolor = "3px solid #adff13";
                else if (info_hidden_hiddenAgr>0) AGRcolor = "3px solid #50d243";
                else AGRcolor = "3px solid #b9b9b9";
                if (info_hidden_hiddenInj>15.9) var INJcolor = "3px solid #d13c3a";
                else if (info_hidden_hiddenInj>10.9) INJcolor = "3px solid #e0a110";
                else if (info_hidden_hiddenInj>5.9) INJcolor = "3px solid #adff13";
                else if (info_hidden_hiddenInj>0) INJcolor = "3px solid #50d243";
                else INJcolor = "3px solid #b9b9b9";
                if (info_hidden_hiddenAdapt>15.9) var ADAcolor = "3px solid #50d243";
                else if (info_hidden_hiddenAdapt>10.9) ADAcolor = "3px solid #adff13";
                else if (info_hidden_hiddenAdapt>5.9) ADAcolor = "3px solid #e0a110";
                else if (info_hidden_hiddenAdapt>0) ADAcolor = "3px solid #d13c3a";
                else ADAcolor = "3px solid #b9b9b9";
                if (CHA!=""&&CHA>0) {
                    if (CHA>15.9) var CHAcolor = "#50d243";
                    else if (CHA>10.9) CHAcolor = "#adff13";
                    else if (CHA>5.9) CHAcolor = "#e0a110";
                    else CHAcolor = "#d13c3a";
                    var infotooltip = $(".HID"+ID+"").parent().attr("title");
                    $(".HID"+ID+"").parent().attr("title",infotooltip+"\nLeadership "+CHA);
                } else { CHAcolor = "none";}
                $(".HID"+ID+"").css({"border-left":PROcolor,"border-top":AGRcolor,"border-right":INJcolor,"border-bottom":ADAcolor,"background-color":CHAcolor});
            }
            if (StaMalus<=minSTA) {
                $("#MoreInfosUl > li[player_id='" + ID +"']").find("div.icons").append("<span style='vertical-align:top;margin-left:1px;font-size:12px;cursor:pointer;' title='Stamina: "+StaMalus*100+"%'><img src='https://trophymanager.com/pics/icons/subs.png'></span>");
            }
            if (PosMalus*1 > 0) {
                //if (PosMalus == 10) { var yPos = "-28px"; } else if (PosMalus == 20) { yPos = "-60px"; } else if (PosMalus == 30) { yPos = "-75px"; } else if (PosMalus == 40) { yPos = "-90px"; }
                /*if (AdaMalus==1) {var yPos="-14px"} else if (AdaMalus<1&AdaMalus>=0.95) {yPos="-28px"} else if (AdaMalus<0.95&AdaMalus>=0.90) {yPos="-42px"} else if (AdaMalus<0.90&AdaMalus>=0.85) {yPos="-56px"} else if (AdaMalus<0.85&AdaMalus>=0.80) {yPos="-70px"} else if (AdaMalus<0.80) {yPos="-84px"};
                if (noinfo == true) {
                    $("li.MoreInfos > div[player_id='" + ID +"']").find("div.icons").append("<span style='vertical-align:top;margin-left:2px;background: url(/pics/icons/question_mark.png) no-repeat 0 0;background-size:16px;padding-right:17px;cursor:pointer;' title='Unknown adaptability'></span>");
                } else {
                    $("li.MoreInfos > div[player_id='" + ID +"']").find("div.icons").append("<span style='vertical-align:top;margin-left:2px;background: url(/pics/mood_sprite.png) no-repeat 0 "+yPos+";background-size:14px;padding-right:16px;cursor:pointer;' title='"+AdaMalus*100+"%'></span>");
                }*/
                if (AdaMalus==1) {var adaIco="😎";} else if (AdaMalus<1&AdaMalus>=0.95) {adaIco="🙂";} else if (AdaMalus<0.95&AdaMalus>=0.90) {adaIco="😐";} else if (AdaMalus<0.90&AdaMalus>=0.85) {adaIco="🙁";} else if (AdaMalus<0.85&AdaMalus>=0.80) {adaIco="☹️";} else if (AdaMalus<0.80&AdaMalus>=0.75) {adaIco="😡";} else if (AdaMalus<0.75&AdaMalus>=0.70) {adaIco="🤢";} else if (AdaMalus<0.70) {adaIco="💩";};
                if (noinfo == true) {
                    $("#MoreInfosUl > li[player_id='" + ID +"']").find("div.icons").append("<span style='vertical-align:top;margin-left:1px;background: url(/pics/icons/question_mark.png) no-repeat 0 0;background-size:16px;padding-right:17px;cursor:pointer;' title='Unknown adaptability'></span>");
                } else {
                    $("#MoreInfosUl > li[player_id='" + ID +"']").find("div.icons").append("<span style='vertical-align:top;margin-left:1px;font-size:12px;cursor:pointer;' title='Position efficiency: "+AdaMalus*100+"%'>"+adaIco+"</span>");
                }
            }
        }

        // End of each player on field

        SetPieces.sort(compareByFK);
        var maxFK = SetPieces[0].ID;
        SetPieces.sort(compareByCK);
        var maxCK = SetPieces[0].ID;
        SetPieces.sort(compareByPK);
        var maxPK = SetPieces[0].ID;
        $("#MoreInfosUl > li[player_id]").each(function(){
            var ID = $(this).attr("player_id");
            if (ID === maxFK) {
                //$(this).find("div.icons").append("<span style='vertical-align:top;margin-left:2px;padding:2px 4px 2px 5px;border-top:1px solid #7198f3;border-right:1px solid #2a3d6b;border-bottom:1px solid #2a3d6b;border-left:1px solid #7198f3;border-radius:10px;background:blue;color:white;font-size:8px;font-weight:bold;cursor:pointer;' title='Best free-kick taker'>F</span>");
                $(this).find("div.icons").append("<span style='vertical-align:top;margin-left:1px;font-size:12px;cursor:pointer;' title='Best free-kick taker'>🏹</span>");
            }
            if (ID === maxCK) {
                //$(this).find("div.icons").append("<span style='vertical-align:top;margin-left:2px;padding:2px 4px 2px 4px;border-top:1px solid #6b966b;border-right:1px solid #206d20;border-bottom:1px solid #206d20;border-left:1px solid #6b966b;border-radius:10px;background:green;color:white;font-size:8px;font-weight:bold;cursor:pointer;' title='Best corner taker'>C</span>");
                $(this).find("div.icons").append("<span style='vertical-align:top;margin-left:1px;font-size:12px;cursor:pointer;' title='Best corner taker'>🚩</span>");
            }
            if (ID === maxPK) {
                //$(this).find("div.icons").append("<span style='vertical-align:top;margin-left:2px;padding:2px 4px 2px 4px;border-top:1px solid #f5865c;border-right:1px solid #ad441d;border-bottom:1px solid #ad441d;border-left:1px solid #f5865c;border-radius:10px;background:orangered;color:white;font-size:8px;font-weight:bold;cursor:pointer;' title='Best penalty taker'>P</span>");
                $(this).find("div.icons").append("<span style='vertical-align:top;margin-left:1px;font-size:12px;cursor:pointer;' title='Best penalty taker'>⚽</span>");
            }
        });
        if (captain.length>0) {
            captain.sort(compareCAPrva);
            var maxCapRVA = captain[0].ID;
            captain.sort(compareCAPtss);
            var maxCapTSS = captain[0].ID;
            if (captain[0].CUS!=undefined) {
                captain.sort(compareCAPcus);
                var maxCapCUS = captain[0].ID;
            }
            $("#MoreInfosUl > li[player_id]").each(function(){
                var ID = $(this).attr("player_id");
                if (ID === maxCapRVA) {
                    $(this).find("div.icons").append("<span style='vertical-align:top;margin-left:1px;margin-right:1px;font-size:14px;cursor:pointer;color:greenyellow;' title='Best captain (RVA)'>©</span>");
                }
                if (ID === maxCapTSS) {
                    $(this).find("div.icons").append("<span style='vertical-align:top;margin-left:1px;margin-right:1px;font-size:14px;cursor:pointer;color:orange;' title='Best captain (TSS)'>©</span>");
                }
                if (captain[0].CUS!=undefined) {
                    if (ID === maxCapCUS) {
                        $(this).find("div.icons").append("<span style='vertical-align:top;margin-left:1px;margin-right:1px;font-size:14px;cursor:pointer;color:pink;' title='Best captain (Custom)'>©</span>");
                    }
                }
            });
        }
        // OLD ME bonuses:
        var dc = 0; var dl = 0; var dr = 0; var dmc = 0; var dml = 0; var dmr = 0; var mc = 0; var ml = 0; var mr = 0; var omc = 0; var oml = 0; var omr = 0; var fc = 0;
        for (i=0;i<FormByPos.length;i++) {
            if (FormByPos[i]=="dc" || FormByPos[i]=="dcl" || FormByPos[i]=="dcr") { dc++ }
            else if (FormByPos[i]=="dl") { dl++ }
            else if (FormByPos[i]=="dr") { dr++ }
            else if (FormByPos[i]=="dmc" || FormByPos[i]=="dmcl" || FormByPos[i]=="dmcr") { dmc++ }
            else if (FormByPos[i]=="dml") { dml++ }
            else if (FormByPos[i]=="dmr") { dmr++ }
            else if (FormByPos[i]=="mc" || FormByPos[i]=="mcl" || FormByPos[i]=="mcr") { mc++ }
            else if (FormByPos[i]=="ml") { ml++ }
            else if (FormByPos[i]=="mr") { mr++ }
            else if (FormByPos[i]=="omc" || FormByPos[i]=="omcl" || FormByPos[i]=="omcr") { omc++ }
            else if (FormByPos[i]=="oml") { oml++ }
            else if (FormByPos[i]=="omr") { omr++ }
            else if (FormByPos[i]=="fc" || FormByPos[i]=="fcl" || FormByPos[i]=="fcr") { fc++ }
        };
        // Old ME defending bonus:
        var DEFbonus = -8;
        DEFbonus += (dc+dl+dr)*2+dmc+dml+dmr;
        var wings = dl+dr;
        if (dc<3 && wings==0) { //penalty for too few central defenders if no wings
            DEFbonus = DEFbonus - 1;
        }
        if (dc==0) { //too few central defenders no matter what
            DEFbonus = DEFbonus - 2;
        } else if (dc==1) {
            DEFbonus = DEFbonus - 1;
        }
        if (wings==1) { //scewed formation
            DEFbonus = DEFbonus - 1;
        }
        if (DEFbonus>2.5) DEFbonus = 2.5;
        if (DEFbonus<0) DEFbonus = DEFbonus+"&nbsp;";
        // Old ME possession bonus:
        var MIDbonus = -8;
        var midfielders = 0;
        var left_side = -1;
        var right_side = -1;
        var m_om = -4;
        var dm_mc = -1;
        var m_omc = -1;
        MIDbonus += dmc+dml+dmr+omc+oml+omr+mc*2+ml*2+mr*2;
        if (omc>0||oml>0||omr>0) m_om = 0;
        if (omc>0) m_omc = 0;
        if (dmc>0) dm_mc = 0;
        if (mc>0||ml>0||mr>0) m_om = 0;
        if (mc>0) { dm_mc = 0; m_omc = 0; }
        if (dml>0||ml>0||oml>0) left_side = 0;
        if (dmr>0||mr>0||omr>0) right_side = 0;
        var reset_left;
        var reset_right;
        if ((left_side<0 && mc<3) || (left_side<0 && right_side==0)) reset_left = false;
        else reset_left = true;
        if ((right_side<0 && mc<3) || (right_side<0 && left_side==0)) reset_right = false;
        else reset_right = true;
        if (reset_left) left_side = 0;
        if (reset_right) right_side = 0;
        if (dl>0 && dml>0 && ml>0 || (oml>0 && (dl==0 && dml==0 && ml==0))) {
            MIDbonus--;
        } else if (dml>0 && ml>0 && oml>0) {
            MIDbonus--;
        }
        if (dr>0 && dmr>0 && mr>0 || (omr>0 && (dr==0 && dmr==0 && mr==0))) {
            MIDbonus--;
        } else if (dmr>0 && mr>0 && omr>0) {
            MIDbonus--;
        }
        if (m_omc<0 && dm_mc<0) MIDbonus = MIDbonus -3;
        else if (m_om==0 && (m_omc<0 || dm_mc<0)) MIDbonus--;
        MIDbonus = MIDbonus + left_side + right_side + m_om;
        if (MIDbonus>2.5) MIDbonus = 2.5;
        if (MIDbonus<0) MIDbonus = MIDbonus+"&nbsp;";
        // Old ME attacking bonus:
        var ATTbonus = -4;
        var forwards = -5;
        ATTbonus += omc+oml+omr+fc*2;
        if (fc>0) forwards = 0;
        if (forwards>0 && ATTbonus<-1) {
            ATTbonus--;
        }
        ATTbonus = ATTbonus + forwards;
        if (ATTbonus>2.5) ATTbonus = 2.5;
        if (ATTbonus<0) ATTbonus = ATTbonus+"&nbsp;";
        //NEW ME ATT bonus (based on Sagami's "TacticalBattlesFormationBonusCalculation.Ver5.3"):
        var newATTbonus = [];
        var newATTbonusSHO = fc+(oml+omr)*1.05+omc*1.12+(ml+mr)*0.775+mc*0.85+(dml+dmr)*0.4+dmc*0.45+(dl+dr)*0.4+1.3;
        if (newATTbonusSHO > 7.5) newATTbonusSHO = 7.5;
        var newATTbonusTHR = fc*1.125+(oml+omr)*0.525+omc+(ml+mr)*0.15+mc*0.85+3;
        if (newATTbonusTHR > 7.9) newATTbonusTHR = 7.9;
        var newATTbonusDIR = mc+ml+mr+(dml+dmr+dmc)*0.95+(dl+dr+dc)*0.9;
        if (newATTbonusDIR > 7.6) newATTbonusDIR = 7.6;
        var newATTbonusLON = (fc+omc)*0.95+(oml+omr)*0.15+4.45;
        if (newATTbonusLON > 7.5) newATTbonusLON = 7.5;
        var newATTbonusWIN = oml+omr+(ml+mr)*0.8+(dml+dmr)*0.6+(dl+dr)*0.4+4.55;
        if (newATTbonusWIN > 7.6) newATTbonusWIN = 7.6;
        var newATTbonusBAL = funFix2((newATTbonusSHO+newATTbonusTHR+newATTbonusDIR+newATTbonusLON+newATTbonusWIN)/5);
        newATTbonus.push(newATTbonusBAL,newATTbonusDIR,newATTbonusWIN,newATTbonusSHO,newATTbonusLON,newATTbonusTHR);
        var totNewATTbonus = funFix2(newATTbonusSHO+newATTbonusTHR+newATTbonusDIR+newATTbonusLON+newATTbonusWIN);
        //NEW ME DEF bonus:
        var newDEFbonusSHO = dc+dmc+(dl+dr+mc)*0.5+(dml+dmr+ml+mr)*0.25+2.1;
        if (newDEFbonusSHO > 10) newDEFbonusSHO = 10;
        var newDEFbonusTHR = dc+dmc+(dl+dr)*0.6+(dml+dmr)*0.3+2.9;
        if (newDEFbonusTHR > 10) newDEFbonusTHR = 10;
        var newDEFbonusDIR = dc+dl+dr+(dml+dmr+dmc)*0.9+(ml+mr+mc)*0.8;
        if (newDEFbonusDIR > 10) newDEFbonusDIR = 10;
        var newDEFbonusLON = dc*1.2+(dl+dr+dmc)*0.6+(dml+dmr)*0.15+2.4;
        if (newDEFbonusLON > 10) newDEFbonusLON = 10;
        var newDEFbonusWIN = dc+dl+dr+(dml+dmr)*0.8+(ml+mr)*0.6+(oml+omr)*0.4+1.9;
        if (newDEFbonusWIN > 10) newDEFbonusWIN = 10;
        var newDEFbonusBAL = funFix2((newDEFbonusSHO+newDEFbonusTHR+newDEFbonusDIR+newDEFbonusLON+newDEFbonusWIN)/5);
        var totNewDEFbonus = funFix2(newDEFbonusSHO+newDEFbonusTHR+newDEFbonusDIR+newDEFbonusLON+newDEFbonusWIN);
        //NEW ME bonus percetages:
        var totNewATTbonusPERC = Math.round(totNewATTbonus/(totNewATTbonus*1+totNewDEFbonus*1)*100);
        var totNewDEFbonusPERC = Math.round(totNewDEFbonus/(totNewATTbonus*1+totNewDEFbonus*1)*100);
        if (totNewATTbonusPERC>totNewDEFbonusPERC) {var totNewATTbonusWIDTH=totNewATTbonusPERC-17; var totNewDEFbonusWIDTH=totNewDEFbonusPERC-19;}
        else if (totNewATTbonusPERC<totNewDEFbonusPERC) {totNewATTbonusWIDTH=totNewATTbonusPERC-19; totNewDEFbonusWIDTH=totNewDEFbonusPERC-17;}
        else {totNewATTbonusWIDTH=totNewATTbonusPERC-18; totNewDEFbonusWIDTH=totNewDEFbonusPERC-18;}
        // calculate GK's REC and RR5 by DEF-bonus:
        fp = 9;
        weight = 48717927500;

        var dFINbon = (0.11*dMAR+0.07*dTAC+0.04*dPOS+0*dHEA+0.03*dSTR+0.03*dPAC+0.02*dWOR)/totDEF;
        var dHEAbon = (0*dMAR+0*dTAC+0.05*dPOS+0.14*dHEA+0.07*dSTR+0.02*dPAC+0.02*dWOR)/totDEF;
        var dLONbon = (0.06*dMAR+0.12*dTAC+0.06*dPOS+0*dHEA+0.02*dSTR+0.02*dPAC+0.02*dWOR)/totDEF;

        asi = GKasi;
        ROU = 0.7*GKrou+0.3*(totDEFrou/totDEF);
        rou2 = (3/100) * (100-(100) * Math.pow(Math.E, -ROU*0.035));
        not20 = 0;
        for (i=0;i<GKskills.length;i++) {
            if (GKskills[i] != 20) {
                not20++
            }
        }
        skillSum = 0;
        for (i=0; i<GKskills.length; i++) {
            skillSum += parseInt(GKskills[i]);
        }
        remainder = Math.round((Math.pow(2,Math.log(weight*asi)/Math.log(Math.pow(2,7))) - skillSum)*10)/10; // RatingR5 remainder

        for (i=0; i<GKskills.length; i++) {
            if (GKskills[i] != 20) {
                GKskills[i] = GKskills[i]*1+(remainder/not20);
            }
            if (not20 == 11) {
                GKskills[i] = GKskills[i]*1+(remainder/11)
            }
        }
        // home GK + FIN bonus:
        var gkSkFIN = [];
        for (i=0;i<GKskills.length;i++) {
            gkSkFIN[i] = 0.7*GKskills[i]+dFINbon;
        }
        allBonus = 0;
        rec = 0;			// RERECb
        ratingR = 0;		// RatingR5
        ratingR5 = 0;		// RatingR5 + routine
        for (i = 0; i < weightRb[fp].length; i++) {
            rec += gkSkFIN[i] * weightRb[fp][i];
            ratingR += gkSkFIN[i] * weightR5[fp][i];
        }
        var GKrecFIN = funFix3((rec-2)/3);
        ratingR5 = funFix2(ratingR*1 + rou2 * 5);
        ratingR = funFix2(ratingR);
        var GKrr5FIN = funFix2(ratingR5*1 + allBonus*1);
        // home GK + HEA bonus:
        var gkSkHEA = [];
        for (i=0;i<GKskills.length;i++) {
            gkSkHEA[i] = 0.7*GKskills[i]+dHEAbon;
        }
        allBonus = 0;
        rec = 0;			// RERECb
        ratingR = 0;		// RatingR5
        ratingR5 = 0;		// RatingR5 + routine
        for (i = 0; i < weightRb[fp].length; i++) {
            rec += gkSkHEA[i] * weightRb[fp][i];
            ratingR += gkSkHEA[i] * weightR5[fp][i];
        }
        var GKrecHEA = funFix3((rec-2)/3);
        ratingR5 = funFix2(ratingR*1 + rou2 * 5);
        ratingR = funFix2(ratingR);
        var GKrr5HEA = funFix2(ratingR5*1 + allBonus*1);
        var gkSkLON = [];
        for (i=0;i<GKskills.length;i++) {
            gkSkLON[i] = 0.7*GKskills[i]+dLONbon;
        }
        allBonus = 0;
        rec = 0;			// RERECb
        ratingR = 0;		// RatingR5
        ratingR5 = 0;		// RatingR5 + routine
        for (i = 0; i < weightRb[fp].length; i++) {
            rec += gkSkLON[i] * weightRb[fp][i];
            ratingR += gkSkLON[i] * weightR5[fp][i];
        }
        var GKrecLON = funFix3((rec-2)/3);
        ratingR5 = funFix2(ratingR*1 + rou2 * 5);
        ratingR = funFix2(ratingR);
        var GKrr5LON = funFix2(ratingR5*1 + allBonus*1);
        //totals and averages//
        var totPlayers = totDEF+totMID+totFOR;
        if (GKasi>0) { totPlayers+=1*1 }
        totROU = GKrou*1+totROUd*1+totROUm*1+totROUf*1;
        totASI = GKasi*1+totASId+totASIm+totASIf;
        totREC = GKrec+totRECd+totRECm+totRECf;
        totRR5 = GKrr5+totRR5d+totRR5m+totRR5f;
        totDBAL = totDBALd+totDBALm+totDBALf; totDDIR = totDDIRd+totDDIRm+totDDIRf; totDWIN = totDWINd+totDWINm+totDWINf;
        totDSHO = totDSHOd+totDSHOm+totDSHOf; totDLON = totDLONd+totDLONm+totDLONf; totDTHR = totDTHRd+totDTHRm+totDTHRf;
        totABON = totABONd+totABONm+totABONf; totFBON = totFBONd+totFBONm+totFBONf;
        totABAL = totABALd+totABALm+totABALf; totADIR = totADIRd+totADIRm+totADIRf; totAWIN = totAWINd+totAWINm+totAWINf;
        totASHO = totASHOd+totASHOm+totASHOf; totALON = totALONd+totALONm+totALONf; totATHR = totATHRd+totATHRm+totATHRf;
        totFBAL = totFBALd+totFBALm+totFBALf; totFDIR = totFDIRd+totFDIRm+totFDIRf; totFWIN = totFWINd+totFWINm+totFWINf;
        totFSHO = totFSHOd+totFSHOm+totFSHOf; totFLON = totFLONd+totFLONm+totFLONf; totFTHR = totFTHRd+totFTHRm+totFTHRf;
        totGAIN = totGAINd+totGAINm+totGAINf; totKEEP = totKEEPd+totKEEPm+totKEEPf;
        var avgROU = funFix1(totROU/totPlayers); var avgASI = addCommas((totASI/totPlayers).toFixed(0)); var avgREC = funFix3(totREC/totPlayers); var avgRR5 = funFix2(totRR5/totPlayers);
        var avgDBAL = funFix2(totDBAL/(totDEF*1+totMID*1+totFOR*1)); var avgDDIR = funFix2(totDDIR/(totDEF+totMID+totFOR)); var avgDWIN = funFix2(totDWIN/(totDEF+totMID+totFOR));
        var avgDSHO = funFix2(totDSHO/(totDEF+totMID+totFOR)); var avgDLON = funFix2(totDLON/(totDEF+totMID+totFOR)); var avgDTHR = funFix2(totDTHR/(totDEF+totMID+totFOR));
        var avgABON = funFix2(totABON/(totDEF+totMID+totFOR)); var avgFBON = funFix2(totFBON/(totDEF+totMID+totFOR));
        var avgABAL = funFix2(totABAL/(totDEF*1+totMID*1+totFOR*1)); var avgADIR = funFix2(totADIR/(totDEF+totMID+totFOR)); var avgAWIN = funFix2(totAWIN/(totDEF+totMID+totFOR));
        var avgASHO = funFix2(totASHO/(totDEF+totMID+totFOR)); var avgALON = funFix2(totALON/(totDEF+totMID+totFOR)); var avgATHR = funFix2(totATHR/(totDEF+totMID+totFOR));
        var avgFBAL = funFix2(totFBAL/(totDEF*1+totMID*1+totFOR*1)); var avgFDIR = funFix2(totFDIR/(totDEF+totMID+totFOR)); var avgFWIN = funFix2(totFWIN/(totDEF+totMID+totFOR));
        var avgFSHO = funFix2(totFSHO/(totDEF+totMID+totFOR)); var avgFLON = funFix2(totFLON/(totDEF+totMID+totFOR)); var avgFTHR = funFix2(totFTHR/(totDEF+totMID+totFOR));
        var avgGAIN = funFix2(totGAIN/(totDEF+totMID+totFOR)); var avgKEEP = funFix2(totKEEP/(totDEF+totMID+totFOR));
        var avgROUd = funFix1(totROUd/totDEF); var avgROUm = funFix1(totROUm/totMID); var avgROUf = funFix1(totROUf/totFOR);
        var avgASId = addCommas((totASId/totDEF).toFixed(0)); var avgASIm = addCommas((totASIm/totMID).toFixed(0)); var avgASIf = addCommas((totASIf/totFOR).toFixed(0));
        var avgRECd = funFix3(totRECd/totDEF); var avgRECm = funFix3(totRECm/totMID); var avgRECf = funFix3(totRECf/totFOR);
        var avgRR5d = funFix2(totRR5d/totDEF); var avgRR5m = funFix2(totRR5m/totMID); var avgRR5f = funFix2(totRR5f/totFOR);
        var avgDBALd = funFix2(totDBALd/totDEF); var avgDBALm = funFix2(totDBALm/totMID); var avgDBALf = funFix2(totDBALf/totFOR);
        var avgDDIRd = funFix2(totDDIRd/totDEF); var avgDDIRm = funFix2(totDDIRm/totMID); var avgDDIRf = funFix2(totDDIRf/totFOR);
        var avgDWINd = funFix2(totDWINd/totDEF); var avgDWINm = funFix2(totDWINm/totMID); var avgDWINf = funFix2(totDWINf/totFOR);
        var avgDSHOd = funFix2(totDSHOd/totDEF); var avgDSHOm = funFix2(totDSHOm/totMID); var avgDSHOf = funFix2(totDSHOf/totFOR);
        var avgDLONd = funFix2(totDLONd/totDEF); var avgDLONm = funFix2(totDLONm/totMID); var avgDLONf = funFix2(totDLONf/totFOR);
        var avgDTHRd = funFix2(totDTHRd/totDEF); var avgDTHRm = funFix2(totDTHRm/totMID); var avgDTHRf = funFix2(totDTHRf/totFOR);
        var avgABONd = funFix2(totABONd/totDEF); var avgABONm = funFix2(totABONm/totMID); var avgABONf = funFix2(totABONf/totFOR);
        var avgABALd = funFix2(totABALd/totDEF); var avgABALm = funFix2(totABALm/totMID); var avgABALf = funFix2(totABALf/totFOR);
        var avgADIRd = funFix2(totADIRd/totDEF); var avgADIRm = funFix2(totADIRm/totMID); var avgADIRf = funFix2(totADIRf/totFOR);
        var avgAWINd = funFix2(totAWINd/totDEF); var avgAWINm = funFix2(totAWINm/totMID); var avgAWINf = funFix2(totAWINf/totFOR);
        var avgASHOd = funFix2(totASHOd/totDEF); var avgASHOm = funFix2(totASHOm/totMID); var avgASHOf = funFix2(totASHOf/totFOR);
        var avgALONd = funFix2(totALONd/totDEF); var avgALONm = funFix2(totALONm/totMID); var avgALONf = funFix2(totALONf/totFOR);
        var avgATHRd = funFix2(totATHRd/totDEF); var avgATHRm = funFix2(totATHRm/totMID); var avgATHRf = funFix2(totATHRf/totFOR);
        var avgFBONd = funFix2(totFBONd/totDEF); var avgFBONm = funFix2(totFBONm/totMID); var avgFBONf = funFix2(totFBONf/totFOR);
        var avgFBALd = funFix2(totFBALd/totDEF); var avgFBALm = funFix2(totFBALm/totMID); var avgFBALf = funFix2(totFBALf/totFOR);
        var avgFDIRd = funFix2(totFDIRd/totDEF); var avgFDIRm = funFix2(totFDIRm/totMID); var avgFDIRf = funFix2(totFDIRf/totFOR);
        var avgFWINd = funFix2(totFWINd/totDEF); var avgFWINm = funFix2(totFWINm/totMID); var avgFWINf = funFix2(totFWINf/totFOR);
        var avgFSHOd = funFix2(totFSHOd/totDEF); var avgFSHOm = funFix2(totFSHOm/totMID); var avgFSHOf = funFix2(totFSHOf/totFOR);
        var avgFLONd = funFix2(totFLONd/totDEF); var avgFLONm = funFix2(totFLONm/totMID); var avgFLONf = funFix2(totFLONf/totFOR);
        var avgFTHRd = funFix2(totFTHRd/totDEF); var avgFTHRm = funFix2(totFTHRm/totMID); var avgFTHRf = funFix2(totFTHRf/totFOR);
        var avgGAINd = funFix2(totGAINd/totDEF); var avgGAINm = funFix2(totGAINm/totMID); var avgGAINf = funFix2(totGAINf/totFOR);
        var avgKEEPd = funFix2(totKEEPd/totDEF); var avgKEEPm = funFix2(totKEEPm/totMID); var avgKEEPf = funFix2(totKEEPf/totFOR);

        var avgPhyREC = funFix2((phyRECgk+phyRECd+phyRECm+phyRECf)/totPlayers); var avgTacREC = funFix2((tacRECgk+tacRECd+tacRECm+tacRECf)/totPlayers); var avgTecREC = funFix2((tecRECgk+tecRECd+tecRECm+tecRECf)/totPlayers);
        var avgPhyRECd = funFix2(phyRECd/totDEF); var avgTacRECd = funFix2(tacRECd/totDEF); var avgTecRECd = funFix2(tecRECd/totDEF);
        var avgPhyRECm = funFix2(phyRECm/totMID); var avgTacRECm = funFix2(tacRECm/totMID); var avgTecRECm = funFix2(tecRECm/totMID);
        var avgPhyRECf = funFix2(phyRECf/totFOR); var avgTacRECf = funFix2(tacRECf/totFOR); var avgTecRECf = funFix2(tecRECf/totFOR);
        var avgDefenceREC = funFix2((defenceRECd+defenceRECm+defenceRECf)/(totDEF+totMID+totFOR)); var avgAssistREC = funFix2((assistRECd+assistRECm+assistRECf)/(totDEF+totMID+totFOR)); var avgShootingREC = funFix2((shootingRECd+shootingRECm+shootingRECf)/(totDEF+totMID+totFOR));
        var avgDefenceRECd = funFix2(defenceRECd/totDEF); var avgAssistRECd = funFix2(assistRECd/totDEF); var avgShootingRECd = funFix2(shootingRECd/totDEF);
        var avgDefenceRECm = funFix2(defenceRECm/totMID); var avgAssistRECm = funFix2(assistRECm/totMID); var avgShootingRECm = funFix2(shootingRECm/totMID);
        var avgDefenceRECf = funFix2(defenceRECf/totFOR); var avgAssistRECf = funFix2(assistRECf/totFOR); var avgShootingRECf = funFix2(shootingRECf/totFOR);
        var avgSavingREC = funFix2(savingREC); var avgCounterREC = funFix2(counterREC);

        var R5REC = [avgPhyREC, avgTacREC, avgTecREC, avgDefenceREC, avgAssistREC, avgShootingREC,
                     avgPhyRECd, avgTacRECd, avgTecRECd, avgDefenceRECd, avgAssistRECd, avgShootingRECd,
                     avgPhyRECm, avgTacRECm, avgTecRECm, avgDefenceRECm, avgAssistRECm, avgShootingRECm,
                     avgPhyRECf, avgTacRECf, avgTecRECf, avgDefenceRECf, avgAssistRECf, avgShootingRECf,
                     phyRECgk, tacRECgk, tecRECgk, avgSavingREC, avgCounterREC];
        var star1 = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
        var star2 = [];
        var star3 = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
        var R5RECstar = [];
        var star = "<img src = \"/pics/star.png\" style='width:12px;vertical-align:middle;'>";
        var halfstar = "<img src = \"/pics/half_star.png\" style='width:12px;vertical-align:middle;'>";
        var darkstar = "<img src = \"/pics/dark_star.png\" style='width:12px;vertical-align:middle;'>";
        var eightstar = "<img src=\"/pics/eight_star_icon.png\" style='width:8px;vertical-align:middle;'>";
        for (i = 0; i < 29; i++) {
            for (j = 0; j < Math.floor(R5REC[i]); j++) {
                star1[i] += star;
            }
            star2[i] = R5REC[i] - Math.floor(R5REC[i]);
            if (R5REC[i] < 5 && star2[i] >= 0.5) star2[i] = halfstar;
            else star2[i] = "";
            if (5 - Math.round(R5REC[i]) >= 1) {
                for (var k = 0; k < 5-Math.round(R5REC[i]); k++) {
                    star3[i] += darkstar;
                }
            }
            else if (R5REC[i] >= 5.25) star3[i] = eightstar;
            else star3[i] = "";
            R5RECstar[i] = star1[i] + star2[i] + star3[i];
        }
        $("#MoreInfosUl").prepend("<li class='MoreInfosHeaders' style='display: block;list-style-type: none;border-top: 1px solid #444;border-right: 1px solid #444;border-bottom: 1px solid #222;padding: 0;margin: 0;background: #222 url(/pics/dark_scroll_background.png);'><div style='width:964px;height:2px;'></div></li>");
        if (GKasi>0 && totDEF>0) { $("#MoreInfosUl").prepend(
            "<li id='avgGK' class='MoreInfos' style='display: block;list-style-type: none;border-top: 1px solid #444;border-right: 1px solid #444;border-bottom: 1px solid #222;line-height: 24px;padding: 0;margin: 0;'>"+
            "<div class='favposition short' style='width:214px;text-align:center;margin:4px 3px -4px 3px;background:#5cb8294d;'><span style='width:30px;float:left'>1</span>"+
            "<span style='width:30px;float:left;'>&nbsp;</span><span class='gk' style='width:154px;float:left;text-align:left;'>Gk + Def. bonus</span></div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:35px;color:greenyellow;'>"+GKrou+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:60px;color:moccasin;'>"+addCommas(GKasi)+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;color:gold;'>"+GKrec+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:orange;'>"+GKrr5+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div class='favposition short' style='margin:0px 3px 0px 3px;line-height:17px;padding-top:1px;background:#5cb8294d;display:inline-block;text-align:center;width:38px;color:#3b0;cursor:pointer;' title='Saving regular (close) finishes'>FIN:"+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:gold;'>"+GKrecFIN+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:orange;'>"+GKrr5FIN+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div class='favposition short' style='margin:0px 3px 0px 3px;line-height:17px;padding-top:1px;background:#5cb8294d;display:inline-block;text-align:center;width:38px;color:#3b0;cursor:pointer;' title='Saving headers'>HEA:"+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:gold;'>"+GKrecHEA+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:orange;'>"+GKrr5HEA+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div class='favposition short' style='margin:0px 3px 0px 3px;line-height:17px;padding-top:1px;background:#5cb8294d;display:inline-block;text-align:center;width:38px;color:#3b0;cursor:pointer;' title='Saving long shots'>LON:"+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:gold;'>"+GKrecLON+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;color:orange;'>"+GKrr5LON+
            "</div><div style='display:inline-block;text-align:center;width:40px;color:#dddddd;'><div style='display:inline-block;text-align:center;width:40px;color:#dddddd;'>"+
            "</div></li>"); }
        if (totDEF>0) { $("#MoreInfosUl").prepend(
            "<li id='avgDEF' class='MoreInfos' style='display: block;list-style-type: none;border-top: 1px solid #444;border-right: 1px solid #444;border-bottom: 1px solid #222;line-height: 24px;padding: 0;margin: 0;'>"+
            "<div class='favposition short' style='width:170px;text-align:center;margin:4px 3px -4px 3px;background:#00b3ff4d;'><span style='width:30px;float:left'>"+totDEF+"</span>"+
            "<span style='width:30px;float:left;'>&nbsp;</span><span class='d' style='width:110px;float:left;text-align:left;'>Defenders</span></div><div class='vert_split' style='display:inline-block;float:none'>"+
            "</div><div class='favposition short' style='width:30px;text-align:center;margin:0px 3px 0px 3px;line-height:17px;padding-top:1px;background:#00b3ff4d;cursor:pointer;' title='\"Old\" ME defending bonus'>"+DEFbonus+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:35px;color:greenyellow;'>"+avgROUd+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:60px;color:moccasin;'>"+avgASId+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;color:gold;'>"+avgRECd+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:orange;'>"+avgRR5d+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#accbf7;'>"+avgDBALd+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#accbf7;'>"+avgDDIRd+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#accbf7;'>"+avgDWINd+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#accbf7;'>"+avgDSHOd+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#accbf7;'>"+avgDLONd+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#accbf7;'>"+avgDTHRd+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#ffff93;cursor:pointer;' title='Bal: "+avgABALd+" | Dir: "+avgADIRd+" | Win: "+avgAWINd+"\nSho: "+avgASHOd+" | Lon: "+avgALONd+" | Thr: "+avgATHRd+"'>"+avgABONd+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#ffb89e;cursor:pointer;' title='Bal: "+avgFBALd+" | Dir: "+avgFDIRd+" | Win: "+avgFWINd+"\nSho: "+avgFSHOd+" | Lon: "+avgFLONd+" | Thr: "+avgFTHRd+"'>"+avgFBONd+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;color:#dddddd;'>"+funFix2(totGAINd)+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;color:#dddddd;'>"+funFix2(totKEEPd)+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;color:#dddddd;'>"+funFix2((totGAINd+totKEEPd)/2)+
            "</div></li>"); }
        if (totMID>0) { $("#MoreInfosUl").prepend(
            "<li id='avgMID' class='MoreInfos' style='display: block;list-style-type: none;border-top: 1px solid #444;border-right: 1px solid #444;border-bottom: 1px solid #222;line-height: 24px;padding: 0;margin: 0;'>"+
            "<div class='favposition short' style='width:170px;text-align:center;margin:4px 3px -4px 3px;background:#ffd13e4d;'><span style='width:30px;float:left'>"+totMID+"</span>"+
            "<span style='width:30px;float:left;'>&nbsp;</span><span class='m' style='width:110px;float:left;text-align:left;'>Midfielders</span></div><div class='vert_split' style='display:inline-block;float:none'>"+
            "</div><div class='favposition short' style='width:30px;text-align:center;margin:0px 3px 0px 3px;line-height:17px;padding-top:1px;background:#ffd13e4d;cursor:pointer;' title='\"Old\" ME possession bonus'>"+MIDbonus+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:35px;color:greenyellow;'>"+avgROUm+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:60px;color:moccasin;'>"+avgASIm+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;color:gold;'>"+avgRECm+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:orange;'>"+avgRR5m+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#accbf7;'>"+avgDBALm+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#accbf7;'>"+avgDDIRm+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#accbf7;'>"+avgDWINm+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#accbf7;'>"+avgDSHOm+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#accbf7;'>"+avgDLONm+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#accbf7;'>"+avgDTHRm+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#ffff93;cursor:pointer;' title='Bal: "+avgABALm+" | Dir: "+avgADIRm+" | Win: "+avgAWINm+"\nSho: "+avgASHOm+" | Lon: "+avgALONm+" | Thr: "+avgATHRm+"'>"+avgABONm+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#ffb89e;cursor:pointer;' title='Bal: "+avgFBALm+" | Dir: "+avgFDIRm+" | Win: "+avgFWINm+"\nSho: "+avgFSHOm+" | Lon: "+avgFLONm+" | Thr: "+avgFTHRm+"'>"+avgFBONm+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;color:#dddddd;'>"+funFix2(totGAINm)+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;color:#dddddd;'>"+funFix2(totKEEPm)+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;color:#dddddd;'>"+funFix2((totGAINm+totKEEPm)/2)+
            "</div></li>"); }
        if (totFOR>0) { $("#MoreInfosUl").prepend(
            "<li id='avgFOR' class='MoreInfos' style='display: block;list-style-type: none;border-top: 1px solid #444;border-right: 1px solid #444;border-bottom: 1px solid #222;line-height: 24px;padding: 0;margin: 0;'>"+
            "<div class='favposition short' style='width:170px;text-align:center;margin:4px 3px -4px 3px;background:#ff00004d;'><span style='width:30px;float:left'>"+totFOR+"</span>"+
            "<span style='width:30px;float:left;'>&nbsp;</span><span class='f' style='width:110px;float:left;text-align:left;'>Forwards</span></div><div class='vert_split' style='display:inline-block;float:none'>"+
            "</div><div class='favposition short' style='width:30px;text-align:center;margin:0px 3px 0px 3px;line-height:17px;padding-top:1px;background:#ff00004d;cursor:pointer;' title='\"Old\" ME attacking bonus'>"+ATTbonus+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:35px;color:greenyellow;'>"+avgROUf+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:60px;color:moccasin;'>"+avgASIf+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;color:gold;'>"+avgRECf+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:orange;'>"+avgRR5f+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#accbf7;'>"+avgDBALf+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#accbf7;'>"+avgDDIRf+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#accbf7;'>"+avgDWINf+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#accbf7;'>"+avgDSHOf+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#accbf7;'>"+avgDLONf+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#accbf7;'>"+avgDTHRf+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#ffff93;cursor:pointer;' title='Bal: "+avgABALf+" | Dir: "+avgADIRf+" | Win: "+avgAWINf+"\nSho: "+avgASHOf+" | Lon: "+avgALONf+" | Thr: "+avgATHRf+"'>"+avgABONf+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#ffb89e;cursor:pointer;' title='Bal: "+avgFBALf+" | Dir: "+avgFDIRf+" | Win: "+avgFWINf+"\nSho: "+avgFSHOf+" | Lon: "+avgFLONf+" | Thr: "+avgFTHRf+"'>"+avgFBONf+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;color:#dddddd;'>"+funFix2(totGAINf)+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;color:#dddddd;'>"+funFix2(totKEEPf)+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;color:#dddddd;'>"+funFix2((totGAINf+totKEEPf)/2)+
            "</div></li>"); }
        if (totDEF>0 || totMID>0 || totFOR>0) { $("#MoreInfosUl").prepend(
            "<li class='MoreInfos' style='display: block;list-style-type: none;border-top: 1px solid #444;border-right: 1px solid #444;border-bottom: 1px solid #222;line-height: 24px;padding: 0;margin: 0;'>"+
            "<div class='favposition short' style='width:214px;text-align:center;margin:4px 3px -4px 3px;background:#ffffff4d;'><span style='width:30px;float:left'>"+totPlayers+"</span>"+
            "<span style='width:30px;float:left'>&nbsp;</span><span style='width:154px;float:left;text-align:left;'>Team averages</span></div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:35px;color:greenyellow;'>"+avgROU+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:60px;color:moccasin;'>"+avgASI+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;color:gold;'>"+avgREC+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:orange;'>"+avgRR5+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#accbf7;'>"+avgDBAL+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#accbf7;'>"+avgDDIR+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#accbf7;'>"+avgDWIN+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#accbf7;'>"+avgDSHO+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#accbf7;'>"+avgDLON+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#accbf7;'>"+avgDTHR+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#ffff93;cursor:pointer;' title='Bal: "+avgABAL+" | Dir: "+avgADIR+" | Win: "+avgAWIN+"\nSho: "+avgASHO+" | Lon: "+avgALON+" | Thr: "+avgATHR+"'>"+avgABON+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:#ffb89e;cursor:pointer;' title='Bal: "+avgFBAL+" | Dir: "+avgFDIR+" | Win: "+avgFWIN+"\nSho: "+avgFSHO+" | Lon: "+avgFLON+" | Thr: "+avgFTHR+"'>"+avgFBON+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;color:#dddddd;'>"+funFix2(totGAIN)+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;color:#dddddd;'>"+funFix2(totKEEP)+
            "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;color:#dddddd;'>"+funFix2((totGAIN+totKEEP)/2)+
            "</div></li>"); }
        if (minutes==1) { var staClass = "65"; var staIco = "🕓 65\´"; var staTitle = "Show stamina effect: 75 min"; }
        else if (minutes==2) { staClass = "75"; staIco = "🕕 75\´"; staTitle = "Show stamina effect: 85 min"; }
        else if (minutes==4) { staClass = "85"; staIco = "🕗 85\´"; staTitle = "Hide stamina effect"; }
        else { staClass = "0"; staIco = "Time 🕛"; staTitle = "Show stamina effect: 65 min"; };
        $("#MoreInfosUl").prepend(
            "<li class='MoreInfosHeaders' style='display:block;list-style-type:none;border-top:1px solid #444;border-right:1px solid #444;border-bottom:1px solid #222;padding:0;margin:0;'><div style='width:964px;height:2px;'></div></li>"+
            "<li class='MoreInfosHeaders' style='display:block;list-style-type:none;border-top:1px solid #444;border-right:1px solid #444;border-bottom:1px solid #222;padding:0;margin:0;'>"+
            "<div style='width:226px;display:inline-block;text-align:center;font-weight:bold;color:greenyellow;border-bottom:1px solid #222;'>:: ADVANCED INFOS ::</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='width:35px;display:inline-block;text-align:center;border-bottom:1px solid #222;color:#accbf7;'><img id='showStars' src='/pics/dark_star.png' style='vertical-align:middle;cursor:pointer;' title='Show stars'></div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='width:60px;display:inline-block;text-align:center;border-bottom:1px solid #222;cursor:pointer;font-size:12px;color:#dddddd;' id='showStamina' class='"+staClass+"' title='"+staTitle+"'>"+staIco+"</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='width:92px;display:inline-block;text-align:right;border-bottom:1px solid #222;font-weight:bold;white-space:nowrap;' title='\"New\" ME tactical bonunes'><img src='/pics/icons/mini_field.png' style='height:15px;margin-right:5px;vertical-align:text-bottom;'>Tactics:&nbsp;</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='width:50px;display:inline-block;text-align:center;border-bottom:1px solid #222;color:#accbf7;'>"+funFix2(newDEFbonusBAL)+"</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='width:50px;display:inline-block;text-align:center;border-bottom:1px solid #222;color:#accbf7;'>"+funFix2(newDEFbonusDIR)+"</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='width:50px;display:inline-block;text-align:center;border-bottom:1px solid #222;color:#accbf7;'>"+funFix2(newDEFbonusWIN)+"</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='width:50px;display:inline-block;text-align:center;border-bottom:1px solid #222;color:#accbf7;'>"+funFix2(newDEFbonusSHO)+"</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='width:50px;display:inline-block;text-align:center;border-bottom:1px solid #222;color:#accbf7;'>"+funFix2(newDEFbonusLON)+"</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='width:50px;display:inline-block;text-align:center;border-bottom:1px solid #222;color:#accbf7;'>"+funFix2(newDEFbonusTHR)+"</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;border-bottom:1px solid #222;color:#ffff93;cursor:pointer;' title='Bal: "+funFix2(newATTbonusBAL)+" | Dir: "+funFix2(newATTbonusDIR)+" | Win: "+funFix2(newATTbonusWIN)+"\nSho: "+funFix2(newATTbonusSHO)+" | Lon: "+funFix2(newATTbonusLON)+" | Thr: "+funFix2(newATTbonusTHR)+"'>"+funFix2(newATTbonus[AttStyle-1])+"</div>"+
            //"<div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:92px;border-bottom:1px solid #222;color:#dddddd;' title='Defense bonuses sum'>D.Sum:"+totNewDEFbonus+"</div>"+
            //"<div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:85px;border-bottom:1px solid #222;color:#dddddd;' title='Assist bonuses sum'>A.Sum:"+totNewATTbonus+"</div><br>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;width:180px;border-bottom:1px solid #222;color:#dddddd;padding-left:2px;text-align:center;font-size:smaller;cursor:pointer;' title='Tactical balance'>DEF&nbsp;<span style='display:inline-block;border-left:1px solid #69b3e8;border-top:1px solid #69b3e8;border-bottom:1px solid #011829;-webkit-border-radius:4px 0px 0px 4px;background:#0a558c;height:15px;line-height:16px;text-align:center;white-space:nowrap;width:"+totNewDEFbonusWIDTH+"%'>"+totNewDEFbonusPERC+"%</span><span style='display:inline-block;border-top:1px solid #f5766b;border-right:1px solid #981f14;border-bottom:1px solid #981f14;-webkit-border-radius:0px 4px 4px 0px;background:#cb3123;height:15px;line-height:16px;text-align:center;white-space:nowrap;width:"+totNewATTbonusWIDTH+"%'>"+totNewATTbonusPERC+"%&nbsp;</span>&nbsp;ATT</div></br>"+
            "<div style='width:226px;display:inline-block;text-align:center;font-weight:bold;border-top:1px solid #444;'><img src='/pics/icons/players.gif' style='margin-right:5px;vertical-align:text-bottom;'>Players' details:</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='width:35px;display:inline-block;text-align:center;border-top:1px solid #444;cursor:pointer;' title='Routine'>XP</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='width:60px;display:inline-block;text-align:center;border-top:1px solid #444;cursor:pointer;' title='Skill Index'>SI</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='width:40px;display:inline-block;text-align:center;border-top:1px solid #444;cursor:pointer;' title='Recommendation'>Rec</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='width:50px;display:inline-block;text-align:center;border-top:1px solid #444;cursor:pointer;' title='RatingR5'>R5</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='width:50px;display:inline-block;text-align:center;border-top:1px solid #444;cursor:pointer;' title='Defense: Balanced'>Def.Bal</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='width:50px;display:inline-block;text-align:center;border-top:1px solid #444;cursor:pointer;' title='Defense: Direct'>Def.Dir</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='width:50px;display:inline-block;text-align:center;border-top:1px solid #444;cursor:pointer;' title='Defense: Wings'>Def.Win</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='width:50px;display:inline-block;text-align:center;border-top:1px solid #444;cursor:pointer;' title='Defense: Shortpassing'>Def.Sho</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='width:50px;display:inline-block;text-align:center;border-top:1px solid #444;cursor:pointer;' title='Defense: Long Balls'>Def.Lon</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='width:50px;display:inline-block;text-align:center;border-top:1px solid #444;cursor:pointer;' title='Defense: Through Balls'>Def.Thr</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;border-top:1px solid #444;cursor:pointer;' title='Assist: "+AttStyleName+"'>Assist</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;border-top:1px solid #444;cursor:pointer;' title='Shot: "+AttStyleName+"'>Shot</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;border-top:1px solid #444;cursor:pointer;' title='Gain Possession'>Gain</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;border-top:1px solid #444;cursor:pointer;' title='Keep Possession'>Keep</div>"+
            "<div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;border-top:1px solid #444;cursor:pointer;' title='Total Possession'>Total</div></li>");
        // SHOW REC STARS
        $("#showStars").click(function ShowStars() {
            if ($("#playerDetails").length) { $("#playerDetails").remove(); $("li.MoreInfos").css("background",""); $("div#tactics").attr('style','height:1006px;'); };
            var CloneHeaders = $("#MoreInfosUl").find("li:eq(1)").clone();
            var CloneHeaders2 = $("#MoreInfosUl").find("li.MoreInfosHeaders:eq(2)").clone();
            var CloneHeaders3 = $("#MoreInfosUl").find("li.MoreInfosHeaders:eq(3)").clone();
            if (totDEF>0 || totMID>0 || totFOR>0) { var CloneTeam = $("#MoreInfosUl").find("li:eq(2)").clone(); }
            if (totFOR>0) { var CloneFor = $("#MoreInfosUl").find("li:#avgFOR").clone(); }
            if (totMID>0) { var CloneMid = $("#MoreInfosUl").find("li:#avgMID").clone(); }
            if (totDEF>0) { var CloneDef = $("#MoreInfosUl").find("li:#avgDEF").clone(); }
            if (GKasi>0 && totDEF>0) { var CloneGk = $("#MoreInfosUl").find("li:#avgGK").clone(); }
            var ClonePlayer = [];
            for (i=0;i<totPlayers;i++){
                ClonePlayer[i-1] = $("#MoreInfosUl > li").eq(-i-1).clone(true);
            }
            $("#showStars").replaceWith("<img id='hideStars' src='/pics/star.png' style='vertical-align:middle;cursor:pointer;' title='Hide stars'>");
            $(".MoreInfosHeaders:eq(1)").find("div:eq(33),div:eq(34),div:eq(35),div:eq(36),div:eq(37),div:eq(38),div:eq(39),div:eq(40),div:eq(41),div:eq(42),div:eq(43),div:eq(44),div:eq(45),div:eq(46),div:eq(47),div:eq(48),div:eq(49),div:eq(50),div:eq(51),div:eq(52),div:eq(53)").remove();
            $(".MoreInfosHeaders:eq(1)").append(
                "<div style='width:90px;display:inline-block;text-align:center;border-top:1px solid #444;'>身体</div><div class='vert_split' style='display:inline-block;float:none'></div>"+
                "<div style='width:90px;display:inline-block;text-align:center;border-top:1px solid #444;'>战术</div><div class='vert_split' style='display:inline-block;float:none'></div>"+
                "<div style='width:90px;display:inline-block;text-align:center;border-top:1px solid #444;'>技术</div><div class='vert_split' style='display:inline-block;float:none'></div>"+
                "<div style='width:87px;display:inline-block;text-align:center;border-top:1px solid #444;'>防守</div><div class='vert_split' style='display:inline-block;float:none'></div>"+
                "<div style='width:90px;display:inline-block;text-align:center;border-top:1px solid #444;'>助攻</div><div class='vert_split' style='display:inline-block;float:none'></div>"+
                "<div style='width:87px;display:inline-block;text-align:center;border-top:1px solid #444;'>射门</div><div class='vert_split' style='display:inline-block;float:none'></div>"
            );
            if (totDEF>0 || totMID>0 || totFOR>0) {
                $("#MoreInfosUl > li:eq(2)").replaceWith(
                    "<li class='MoreInfos' style='display: block;list-style-type: none;border-top: 1px solid #444;border-right: 1px solid #444;border-bottom: 1px solid #222;line-height: 24px;padding: 0;margin: 0;'>"+
                    "<div class='favposition short' style='width:214px;text-align:center;margin:4px 3px -4px 3px;background:#ffffff4d;'><span style='width:30px;float:left'>"+totPlayers+"</span>"+
                    "<span style='width:30px;float:left'>&nbsp;</span><span style='width:154px;float:left;text-align:left;'>Team averages</span></div>"+
                    "<div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:35px;color:greenyellow;'>"+avgROU+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:60px;color:moccasin;'>"+avgASI+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;color:gold;'>"+avgREC+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:orange;'>"+avgRR5+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;padding-left:14px;width:76px;'>"+R5RECstar[0]+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;padding-left:14px;width:76px;'>"+R5RECstar[1]+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;padding-left:14px;width:76px;'>"+R5RECstar[2]+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;padding-left:14px;width:73px;'>"+R5RECstar[3]+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;padding-left:14px;width:76px;'>"+R5RECstar[4]+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;padding-left:14px;width:73px;'>"+R5RECstar[5]+
                    "</div></li>");
            };
            if (totFOR>0) {
                $("#MoreInfosUl > li#avgFOR").replaceWith(
                    "<li id='avgFOR' class='MoreInfos' style='display: block;list-style-type: none;border-top: 1px solid #444;border-right: 1px solid #444;border-bottom: 1px solid #222;line-height: 24px;padding: 0;margin: 0;'>"+
                    "<div class='favposition short' style='width:170px;text-align:center;margin:4px 3px -4px 3px;background:#ff00004d;'><span style='width:30px;float:left'>"+totFOR+"</span>"+
                    "<span style='width:30px;float:left;'>&nbsp;</span><span class='f' style='width:110px;float:left;text-align:left;'>Forwards</span></div><div class='vert_split' style='display:inline-block;float:none'>"+
                    "</div><div class='favposition short' style='width:30px;text-align:center;margin:0px 3px 0px 3px;line-height:17px;padding-top:1px;background:#ff00004d;cursor:pointer;' title='\"Old\" ME attacking bonus'>"+ATTbonus+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:35px;color:greenyellow;'>"+avgROUf+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:60px;color:moccasin;'>"+avgASIf+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;color:gold;'>"+avgRECf+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:orange;'>"+avgRR5f+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;padding-left:14px;width:76px;'>"+R5RECstar[18]+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;padding-left:14px;width:76px;'>"+R5RECstar[19]+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;padding-left:14px;width:76px;'>"+R5RECstar[20]+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;padding-left:14px;width:73px;'>"+R5RECstar[21]+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;padding-left:14px;width:76px;'>"+R5RECstar[22]+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;padding-left:14px;width:73px;'>"+R5RECstar[23]+
                    "</div></li>"); }
            if (totMID>0) {
                $("#MoreInfosUl > li#avgMID").replaceWith(
                    "<li id='avgMID' class='MoreInfos' style='display: block;list-style-type: none;border-top: 1px solid #444;border-right: 1px solid #444;border-bottom: 1px solid #222;line-height: 24px;padding: 0;margin: 0;'>"+
                    "<div class='favposition short' style='width:170px;text-align:center;margin:4px 3px -4px 3px;background:#ffd13e4d;'><span style='width:30px;float:left'>"+totMID+"</span>"+
                    "<span style='width:30px;float:left;'>&nbsp;</span><span class='m' style='width:110px;float:left;text-align:left;'>Midfielders</span></div><div class='vert_split' style='display:inline-block;float:none'>"+
                    "</div><div class='favposition short' style='width:30px;text-align:center;margin:0px 3px 0px 3px;line-height:17px;padding-top:1px;background:#ffd13e4d;cursor:pointer;' title='\"Old\" ME possession bonus'>"+MIDbonus+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:35px;color:greenyellow;'>"+avgROUm+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:60px;color:moccasin;'>"+avgASIm+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;color:gold;'>"+avgRECm+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:orange;'>"+avgRR5m+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;padding-left:14px;width:76px;'>"+R5RECstar[12]+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;padding-left:14px;width:76px;'>"+R5RECstar[13]+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;padding-left:14px;width:76px;'>"+R5RECstar[14]+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;padding-left:14px;width:73px;'>"+R5RECstar[15]+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;padding-left:14px;width:76px;'>"+R5RECstar[16]+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;padding-left:14px;width:73px;'>"+R5RECstar[17]+
                    "</div></li>"); }
            if (totDEF>0) {
                $("#MoreInfosUl > li#avgDEF").replaceWith(
                    "<li id='avgDEF' class='MoreInfos' style='display: block;list-style-type: none;border-top: 1px solid #444;border-right: 1px solid #444;border-bottom: 1px solid #222;line-height: 24px;padding: 0;margin: 0;'>"+
                    "<div class='favposition short' style='width:170px;text-align:center;margin:4px 3px -4px 3px;background:#00b3ff4d;'><span style='width:30px;float:left'>"+totDEF+"</span>"+
                    "<span style='width:30px;float:left;'>&nbsp;</span><span class='d' style='width:110px;float:left;text-align:left;'>Defenders</span></div><div class='vert_split' style='display:inline-block;float:none'>"+
                    "</div><div class='favposition short' style='width:30px;text-align:center;margin:0px 3px 0px 3px;line-height:17px;padding-top:1px;background:#00b3ff4d;cursor:pointer;' title='\"Old\" ME defending bonus'>"+DEFbonus+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:35px;color:greenyellow;'>"+avgROUd+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:60px;color:moccasin;'>"+avgASId+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;color:gold;'>"+avgRECd+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:orange;'>"+avgRR5d+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;padding-left:14px;width:76px;'>"+R5RECstar[6]+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;padding-left:14px;width:76px;'>"+R5RECstar[7]+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;padding-left:14px;width:76px;'>"+R5RECstar[8]+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;padding-left:14px;width:73px;'>"+R5RECstar[9]+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;padding-left:14px;width:76px;'>"+R5RECstar[10]+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;padding-left:14px;width:73px;'>"+R5RECstar[11]+
                    "</div></li>"); }
            if (GKasi>0 && totDEF>0) {
                $("#MoreInfosUl > li#avgGK").replaceWith(
                    "<li id='avgGK' class='MoreInfos' style='display: block;list-style-type: none;border-top: 1px solid #444;border-right: 1px solid #444;border-bottom: 1px solid #222;line-height: 24px;padding: 0;margin: 0;'>"+
                    "<div class='favposition short' style='width:214px;text-align:center;margin:4px 3px -4px 3px;background:#5cb8294d;'><span style='width:30px;float:left'>1</span>"+
                    "<span style='width:30px;float:left;'>&nbsp;</span><span class='gk' style='width:154px;float:left;text-align:left;'>Gk + Def. bonus</span></div>"+
                    "<div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:35px;color:greenyellow;'>"+GKrou+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:60px;color:moccasin;'>"+addCommas(GKasi)+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:40px;color:gold;'>"+GKrec+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:50px;color:orange;'>"+GKrr5+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;padding-left:14px;width:76px;'>"+R5RECstar[24]+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;padding-left:14px;width:76px;'>"+R5RECstar[25]+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;padding-left:14px;width:76px;'>"+R5RECstar[26]+
                    "</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:268px;'>Saving: "+R5RECstar[27]+"&nbsp;&nbsp;Counter: "+R5RECstar[28]+
                    "</div></li>"); }
            $(".MoreInfosHeaders:eq(3)").find("div:eq(14),div:eq(15),div:eq(16),div:eq(17),div:eq(18),div:eq(19),div:eq(20),div:eq(21),div:eq(22),div:eq(23),div:eq(24),div:eq(25),div:eq(26),div:eq(27),div:eq(28),div:eq(29),div:eq(30),div:eq(31),div:eq(32),div:eq(33),div:eq(34),div:eq(35),div:eq(36)").remove();
            $(".MoreInfosHeaders:eq(3)").append(
                "<div style='width:90px;display:inline-block;text-align:center;border-top:1px solid #444;'>Physique</div><div class='vert_split' style='display:inline-block;float:none'></div>"+
                "<div style='width:90px;display:inline-block;text-align:center;border-top:1px solid #444;'>Tactical</div><div class='vert_split' style='display:inline-block;float:none'></div>"+
                "<div style='width:90px;display:inline-block;text-align:center;border-top:1px solid #444;'>Technical</div><div class='vert_split' style='display:inline-block;float:none'></div>"+
                "<div style='width:87px;display:inline-block;text-align:center;border-top:1px solid #444;'>Defence</div><div class='vert_split' style='display:inline-block;float:none'></div>"+
                "<div style='width:90px;display:inline-block;text-align:center;border-top:1px solid #444;'>Assist</div><div class='vert_split' style='display:inline-block;float:none'></div>"+
                "<div style='width:87px;display:inline-block;text-align:center;border-top:1px solid #444;'>Shooting</div><div class='vert_split' style='display:inline-block;float:none'></div>"
            );

            $("#MoreInfosUl > li.MoreInfos[player_id]").each(function(){
                var ID = $(this).attr("player_id");
                var star = "<img src = \"/pics/star.png\" style='width:12px;vertical-align:middle;'>";
                var halfstar = "<img src = \"/pics/half_star.png\" style='width:12px;vertical-align:middle;'>";
                var darkstar = "<img src = \"/pics/dark_star.png\" style='width:12px;vertical-align:middle;'>";
                var eightstar = "<img src=\"/pics/eight_star_icon.png\" style='width:8px;vertical-align:middle;'>";

                for (i=0;i<RR5REC.length;i++) {
                    var star1 = ["","","","","","",""];
                    var star2 = [];
                    var star3 = ["","","","","","",""];
                    var RR5RECstar = [];
                    if (ID == RR5REC[i][0]) {
                        for (var x = 1; x < RR5REC[i].length; x++) {
                            for (var j = 0; j < Math.floor(RR5REC[i][x]); j++) {
                                star1[x] += star;
                            }
                            star2[x] = RR5REC[i][x] - Math.floor(RR5REC[i][x]);
                            if (RR5REC[i][x] < 5 && star2[x] >= 0.5) star2[x] = halfstar;
                            else star2[x] = "";
                            if (5 - Math.round(RR5REC[i][x]) >= 1) {
                                for (var k = 0; k < 5-Math.round(RR5REC[i][x]); k++) {
                                    star3[x] += darkstar;
                                }
                            }
                            else if (RR5REC[i][x] >= 5.25) star3[x] = eightstar;
                            else star3[x] = "";
                            RR5RECstar[x] = star1[x] + star2[x] + star3[x];
                        }
                        $(this).find("div:eq(17),div:eq(18),div:eq(19),div:eq(20),div:eq(21),div:eq(22),div:eq(23),div:eq(24),div:eq(25),div:eq(26),div:eq(27),div:eq(28),div:eq(29),div:eq(30),div:eq(31),div:eq(32),div:eq(33),div:eq(34),div:eq(35),div:eq(36)").remove();
                        if (RR5REC[i].length == 7) {
                            $(this).find("div:eq(16)").replaceWith("<div style='display:inline-block;padding-left:14px;width:76px;'>"+RR5RECstar[1]+"</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;padding-left:14px;width:76px;'>"+RR5RECstar[2]+"</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;padding-left:14px;width:76px;'>"+RR5RECstar[3]+"</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;padding-left:14px;width:73px;'>"+RR5RECstar[4]+"</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;padding-left:14px;width:76px;'>"+RR5RECstar[5]+"</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;padding-left:14px;width:73px;'>"+RR5RECstar[6]+"</div>");
                        } else {
                            $(this).find("div:eq(16)").replaceWith("<div style='display:inline-block;padding-left:14px;width:76px;'>"+RR5RECstar[1]+"</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;padding-left:14px;width:76px;'>"+RR5RECstar[2]+"</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;padding-left:14px;width:76px;'>"+RR5RECstar[3]+"</div><div class='vert_split' style='display:inline-block;float:none'></div><div style='display:inline-block;text-align:center;width:268px;'>Saving: "+RR5RECstar[4]+"&nbsp;&nbsp;Counter: "+RR5RECstar[5]+"</div>");
                        }
                    }
                }
            }); // End of SHOW REC STARS
            $("#hideStars").click(function() { // HIDE REC STARS
                if ($("#playerDetails").length) { $("#playerDetails").remove(); $("li.MoreInfos").css("background",""); $("div#tactics").attr('style','height:1006px;'); };
                $(".MoreInfosHeaders:eq(1)").replaceWith(CloneHeaders);
                $(".MoreInfosHeaders:eq(2)").replaceWith(CloneHeaders2);
                if (totDEF>0 || totMID>0 || totFOR>0) { $("#MoreInfosUl > li:eq(2)").replaceWith(CloneTeam); }
                if (totFOR>0) { $("#MoreInfosUl > li#avgFOR").replaceWith(CloneFor); }
                if (totMID>0) { $("#MoreInfosUl > li#avgMID").replaceWith(CloneMid); }
                if (totDEF>0) { $("#MoreInfosUl > li#avgDEF").replaceWith(CloneDef); }
                if (GKasi>0 && totDEF>0) { $("#MoreInfosUl > li#avgGK").replaceWith(CloneGk); }
                for (i=0;i<totPlayers;i++){
                    $("#MoreInfosUl > li").eq(-i-1).replaceWith(ClonePlayer[i-1]);
                }
                $("#showStars").click(function() { ShowStars() })
                $("div#showStamina").click(function() { ShowStamina() });
            });
        }); // End of HIDE REC STARS
        $("li.MoreInfos[player_id]").click(function PlayerDetails() { // PLAYER DETAILS
            var ID = $(this).attr("player_id");
            if ($("#playerDetails").attr("player_id") == ID) {
                $(this).css("background","");
                $("#playerDetails").remove();
                $("div#tactics").attr('style','height:1006px;');
            } else {
                if ($("#playerDetails").length) { $("#playerDetails").remove(); $("li.MoreInfos").css("background",""); };
                $(this).css("background","#5e8c2c");
                $("div#tactics").attr("style","height:1130px;");
                // get player's ratings
                if (matches.length>0) {
                    var ratings = [];
                    for (i=0;i<matches.length;i++) {
                        let mID = matches[i].id;
                        let HA = matches[i].ha;
                        $.ajaxSetup({async: false});
                        var url = "https://trophymanager.com/ajax/match.ajax.php?id="+mID;
                        $.post(url,function(data) {
                            if(data != null) {
                                if (data.lineup[HA][ID]) {var r=data.lineup[HA][ID].rating} else {r="-"}
                                ratings.push(r);
                            }
                        },"json");
                        $.ajaxSetup({async: true});
                    }
                    var form, formIco;
                    //var formWeights=[0.3,0.25,0.2,0.15,0.1];
                    var formWeights=[0.5,0.25,0.12,0.07,0.06];
                    var ratingSum=0; var weightSum=0;
                    for (j=0;j<5;j++) {
                        if (ratings[j]==null || ratings[j]==0 || ratings[j]=="-") {
                            ratings[j]="-";
                        } else {
                            weightSum+=formWeights[j];
                            ratingSum+=ratings[j]*formWeights[j];
                            if (ratings[j]>7.9) ratings[j]='<span style="color:#43d2c5" title="'+String(matches[j].res)+'">'+ratings[j]+'</span>'; // blue
                            else if (ratings[j]>6.4) ratings[j]='<span style="color:#50d243" title="'+String(matches[j].res)+'">'+ratings[j]+'</span>'; // green
                            else if (ratings[j]>4.9) ratings[j]='<span style="color:#adff13" title="'+String(matches[j].res)+'">'+ratings[j]+'</span>'; // greenyellow
                            else if (ratings[j]>3.4) ratings[j]='<span style="color:#e0a110" title="'+String(matches[j].res)+'">'+ratings[j]+'</span>'; // orange
                            else if (ratings[j]>0) ratings[j]='<span style="color:#d13c3a" title="'+String(matches[j].res)+'">'+ratings[j]+'</span>'; // red
                        }
                    }
                    form=funFix1(ratingSum/weightSum);
                    if (form>7.9) formIco="<img src='/pics/icons/squad_up.png' style='width:8px;' title='Weighted average: "+form+"'>";
                    else if (form>6.4) formIco="<img src='/pics/icons/squad_up.png' style='transform:rotate(45deg);width:8px;' title='Weighted average: "+form+"'>";
                    else if (form>4.9) formIco="<img src='/pics/icons/squad_up.png' style='transform:rotate(90deg);width:8px;' title='Weighted average: "+form+"'>";
                    else if (form>3.4) formIco="<img src='/pics/icons/squad_up.png' style='transform:rotate(135deg);width:8px;' title='Weighted average: "+form+"'>";
                    else if (form>0) formIco="<img src='/pics/icons/squad_up.png' style='transform:rotate(180deg);width:8px;' title='Weighted average: "+form+"'>";
                    else formIco="?";
                } else { formIco="?"; ratings=["-","-","-","-","-"]; }
                // end of get ratings
                var slide = parseInt($('#MoreInfosUl').css('margin-left'));
                var rou = window.players_by_id[ID].routine;
                var fp_long = window.players_by_id[ID].favorite_position;
                var fp = window.players_by_id[ID].fp;
                var status = window.players_by_id[ID].status;
                var no = window.players_by_id[ID].no;
                var flag = window.players_by_id[ID].flag;
                var age = window.players_by_id[ID].age;
                var months = window.players_by_id[ID].months;
                var wage = window.players_by_id[ID].wage;
                var appearance = window.players_by_id[ID].appearance;
                var playerHistory = get_player_info_history(ID,false);
                var playerHistoryNAT = playerHistory[0];
                var playerHistoryCUP = playerHistory[1];
                var playerHistoryINT = playerHistory[2];
                var playerHistoryTotNAT = playerHistory[3];
                var playerHistoryTotCUP = playerHistory[4];
                var playerHistoryTotINT = playerHistory[5];
                var season = playerHistory[6];

                if (playerHistoryNAT!=undefined&&playerHistoryNAT.season==season) {
                    var gamesNAT = playerHistoryNAT.games;
                    var goalsNAT = playerHistoryNAT.goals;
                    var assistsNAT = playerHistoryNAT.assists;
                    var cardsNAT = playerHistoryNAT.cards;
                    var productivityNAT = playerHistoryNAT.productivity;
                    var ratingNAT = playerHistoryNAT.rating_avg;
                    var concededNAT = playerHistoryNAT.conceded;
                } else { gamesNAT=goalsNAT=assistsNAT=cardsNAT=productivityNAT=ratingNAT=concededNAT=0; }

                if (playerHistoryCUP!=undefined&&playerHistoryCUP.season==season) {
                    var gamesCUP = playerHistoryCUP.games;
                    var goalsCUP = playerHistoryCUP.goals;
                    var assistsCUP = playerHistoryCUP.assists;
                    var cardsCUP = playerHistoryCUP.cards;
                    var productivityCUP = playerHistoryCUP.productivity;
                    var ratingCUP = playerHistoryCUP.rating_avg;
                    var concededCUP = playerHistoryCUP.conceded;
                } else { gamesCUP=goalsCUP=assistsCUP=cardsCUP=productivityCUP=ratingCUP=concededCUP=0; }

                if (playerHistoryINT!=undefined&&playerHistoryINT.season==season) {
                    var gamesINT = playerHistoryINT.games;
                    var goalsINT = playerHistoryINT.goals;
                    var assistsINT = playerHistoryINT.assists;
                    var cardsINT = playerHistoryINT.cards;
                    var productivityINT = playerHistoryINT.productivity;
                    var ratingINT = playerHistoryINT.rating_avg;
                    var concededINT = playerHistoryINT.conceded;
                } else { gamesINT=goalsINT=assistsINT=cardsINT=productivityINT=ratingINT=concededINT=0; }

                if (playerHistoryTotNAT!=undefined) {
                    var gamesTotNAT = playerHistoryTotNAT.games;
                    var goalsTotNAT = playerHistoryTotNAT.goals;
                    var assistsTotNAT = playerHistoryTotNAT.assists;
                    var cardsTotNAT = playerHistoryTotNAT.cards;
                    var productivityTotNAT = playerHistoryTotNAT.productivity;
                    var ratingTotNAT = playerHistoryTotNAT.rating_avg;
                    var concededTotNAT = playerHistoryTotNAT.conceded;
                } else { gamesTotNAT=goalsTotNAT=assistsTotNAT=cardsTotNAT=productivityTotNAT=ratingTotNAT=concededTotNAT=0; }

                if (playerHistoryTotCUP!=undefined) {
                    var gamesTotCUP = playerHistoryTotCUP.games;
                    var goalsTotCUP = playerHistoryTotCUP.goals;
                    var assistsTotCUP = playerHistoryTotCUP.assists;
                    var cardsTotCUP = playerHistoryTotCUP.cards;
                    var productivityTotCUP = playerHistoryTotCUP.productivity;
                    var ratingTotCUP = playerHistoryTotCUP.rating_avg;
                    var concededTotCUP = playerHistoryTotCUP.conceded;
                } else { gamesTotCUP=goalsTotCUP=assistsTotCUP=cardsTotCUP=productivityTotCUP=ratingTotCUP=concededTotCUP=0; }

                if (playerHistoryTotINT!=undefined) {
                    var gamesTotINT = playerHistoryTotINT.games;
                    var goalsTotINT = playerHistoryTotINT.goals;
                    var assistsTotINT = playerHistoryTotINT.assists;
                    var cardsTotINT = playerHistoryTotINT.cards;
                    var productivityTotINT = playerHistoryTotINT.productivity;
                    var ratingTotINT = playerHistoryTotINT.rating_avg;
                    var concededTotINT = playerHistoryTotINT.conceded;
                } else { gamesTotINT=goalsTotINT=assistsTotINT=cardsTotINT=productivityTotINT=ratingTotINT=concededTotINT=0; }

                var sk = [];
                for (var i=0;i<PlayersDetails.length;i++) {
                    if (ID === PlayersDetails[i][0]) {
                        var name = PlayersDetails[i][1];
                        var grafico = PlayersDetails[i][2];
                        for (j=3;j<5;j++) {
                            if (1*PlayersDetails[i][j]>15.9) sk[j-3]="<span style='display:inline-block;min-width:26px;line-height:12px;border-radius:2px;background:#d13c3a;'>"+PlayersDetails[i][j]+"</span>";
                            else if (1*PlayersDetails[i][j]>10.9) sk[j-3]="<span style='display:inline-block;min-width:26px;line-height:12px;border-radius:2px;background:#e0a110;'>"+PlayersDetails[i][j]+"</span>";
                            else if (1*PlayersDetails[i][j]>5.9) sk[j-3]="<span style='display:inline-block;min-width:26px;line-height:12px;border-radius:2px;background:#adff13;'>"+PlayersDetails[i][j]+"</span>";
                            else if (1*PlayersDetails[i][j]>0) sk[j-3]="<span style='display:inline-block;min-width:26px;line-height:12px;border-radius:2px;background:#50d243;'>"+PlayersDetails[i][j]+"</span>";
                            else sk[j-3]="<span style='display:inline-block;min-width:26px;line-height:12px;border-radius:2px;background:#444c4f'>?</span>";
                        }
                        for (j=5;j<8;j++) {
                            if (1*PlayersDetails[i][j]>15.9) sk[j-3]="<span style='display:inline-block;min-width:26px;line-height:12px;border-radius:2px;background:#50d243;'>"+PlayersDetails[i][j]+"</span>";
                            else if (1*PlayersDetails[i][j]>10.9) sk[j-3]="<span style='display:inline-block;min-width:26px;line-height:12px;border-radius:2px;background:#adff13;'>"+PlayersDetails[i][j]+"</span>";
                            else if (1*PlayersDetails[i][j]>5.9) sk[j-3]="<span style='display:inline-block;min-width:26px;line-height:12px;border-radius:2px;background:#e0a110;'>"+PlayersDetails[i][j]+"</span>";
                            else if (1*PlayersDetails[i][j]>0) sk[j-3]="<span style='display:inline-block;min-width:26px;line-height:12px;border-radius:2px;background:#d13c3a;'>"+PlayersDetails[i][j]+"</span>";
                            else sk[j-3]="<span style='display:inline-block;min-width:26px;line-height:12px;border-radius:2px;background:#444c4f'>?</span>";
                        }
                        for (j=8;j<PlayersDetails[i].length;j++) {
                            if (1*PlayersDetails[i][j]>17.9) sk[j-3]="<span style='display:inline-block;min-width:26px;line-height:12px;border-radius:2px;background:#50d243;'>"+PlayersDetails[i][j]+"</span>";
                            else if (1*PlayersDetails[i][j]>14.9) sk[j-3]="<span style='display:inline-block;min-width:26px;line-height:12px;border-radius:2px;background:#adff13;'>"+PlayersDetails[i][j]+"</span>";
                            else if (1*PlayersDetails[i][j]>9.9) sk[j-3]="<span style='display:inline-block;min-width:26px;line-height:12px;border-radius:2px;background:#e0a110;'>"+PlayersDetails[i][j]+"</span>";
                            else if (1*PlayersDetails[i][j]>0) sk[j-3]="<span style='display:inline-block;min-width:26px;line-height:12px;border-radius:2px;background:#d13c3a;'>"+PlayersDetails[i][j]+"</span>";
                            else sk[j-3]="<span style='display:inline-block;min-width:26px;line-height:12px;border-radius:2px;background:#444c4f'>?</span>";
                        }
                    }
                }
                var PSYnames = "职<br>侵<br>伤<br>适<br>领";
                var PSYsk = sk[2]+"<br>"+sk[0]+"<br>"+sk[1]+"<br>"+sk[3]+"<br>"+sk[4];
                if (fp == "GK") {
                    var PHYnames = "力<br>耐<br>速<br>跳";
                    var TACnames = "一<br>空<br>沟";
                    var TECnames = "接<br>反<br>大<br>手";
                    var PHYsk = sk[5]+"<br>"+sk[6]+"<br>"+sk[7]+"<br>"+sk[12];
                    var TACsk = sk[9]+"<br>"+sk[11]+"<br>"+sk[13];
                    var TECsk = sk[8]+"<br>"+sk[10]+"<br>"+sk[14]+"<br>"+sk[15];
                    var statsNames = "比赛<br>失球<br>进球<br>助攻<br>评分";
                    var statsNAT = "<span style='display:inline-block;min-width:32px;line-height:14px;border-radius:2px;background:#444c4f;'>"+gamesNAT+"</span><br>"+concededNAT+"<br><span style='display:inline-block;min-width:32px;line-height:14px;border-radius:2px;background:#444c4f;'>"+goalsNAT+"</span><br>"+assistsNAT+"<br><span style='display:inline-block;min-width:32px;line-height:14px;border-radius:2px;background:#444c4f;'>"+ratingNAT+"</span>";
                    var statsCUP = "<span style='display:inline-block;min-width:32px;line-height:14px;border-radius:2px;background:#444c4f;'>"+gamesCUP+"</span><br>"+concededCUP+"<br><span style='display:inline-block;min-width:32px;line-height:14px;border-radius:2px;background:#444c4f;'>"+goalsCUP+"</span><br>"+assistsCUP+"<br><span style='display:inline-block;min-width:32px;line-height:14px;border-radius:2px;background:#444c4f;'>"+ratingCUP+"</span>";
                    var statsINT = "<span style='display:inline-block;min-width:32px;line-height:14px;border-radius:2px;background:#444c4f;'>"+gamesINT+"</span><br>"+concededINT+"<br><span style='display:inline-block;min-width:32px;line-height:14px;border-radius:2px;background:#444c4f;'>"+goalsINT+"</span><br>"+assistsINT+"<br><span style='display:inline-block;min-width:32px;line-height:14px;border-radius:2px;background:#444c4f;'>"+ratingINT+"</span>";
                    var statsTot = "<span style='display:inline-block;min-width:32px;line-height:14px;border-radius:2px;background:#444c4f;'>"+(gamesNAT+gamesCUP+gamesINT)+"</span><br>"+(concededNAT+concededCUP+concededINT)+"<br><span style='display:inline-block;min-width:32px;line-height:14px;border-radius:2px;background:#444c4f;'>"+(goalsNAT+goalsCUP+goalsINT)+"</span><br>"+(assistsNAT+assistsCUP+assistsINT)+"<span style='display:inline-block;min-width:32px;line-height:14px;border-radius:2px;background:#444c4f;'>"+funFix1((ratingNAT*gamesNAT+ratingCUP*gamesCUP+ratingINT*gamesINT)/(gamesNAT+gamesCUP+gamesINT))+"</span>";
                    var statsCar = "<span style='display:inline-block;min-width:32px;line-height:14px;border-radius:2px;background:#444c4f;'>"+(gamesTotNAT+gamesTotCUP+gamesTotINT)+"</span><br>"+(concededTotNAT+concededTotCUP+concededTotINT)+"<br><span style='display:inline-block;min-width:32px;line-height:14px;border-radius:2px;background:#444c4f;'>"+(goalsTotNAT+goalsTotCUP+goalsTotINT)+"</span><br>"+(assistsTotNAT+assistsTotCUP+assistsTotINT)+"<br><span style='display:inline-block;min-width:32px;line-height:14px;border-radius:2px;background:#444c4f;'>"+funFix1((ratingTotNAT*gamesTotNAT+ratingTotCUP*gamesTotCUP+ratingTotINT*gamesTotINT)/(gamesTotNAT+gamesTotCUP+gamesTotINT))+"</span>";
                } else {
                    PHYnames = "力<br>耐<br>速<br>头";
                    TACnames = "盯<br>抢<br>投<br>站";
                    TECnames = "传<br>中<br>技<br>射<br>远<br>定";
                    PHYsk = sk[5]+"<br>"+sk[6]+"<br>"+sk[7]+"<br>"+sk[15];
                    TACsk = sk[8]+"<br>"+sk[9]+"<br>"+sk[10]+"<br>"+sk[11];
                    TECsk = sk[12]+"<br>"+sk[13]+"<br>"+sk[14]+"<br>"+sk[16]+"<br>"+sk[17]+"<br>"+sk[18];
                    statsNames = "比赛<br>进球<br>助攻<br>吃牌<br>评分";
                    statsNAT = "<span style='display:inline-block;min-width:32px;line-height:14px;border-radius:2px;background:#444c4f;'>"+gamesNAT+"</span><br>"+goalsNAT+"<br><span style='display:inline-block;min-width:32px;line-height:14px;border-radius:2px;background:#444c4f;'>"+assistsNAT+"</span><br>"+cardsNAT+"<br><span style='display:inline-block;min-width:32px;line-height:14px;border-radius:2px;background:#444c4f;'>"+ratingNAT+"</span>";
                    statsCUP = "<span style='display:inline-block;min-width:32px;line-height:14px;border-radius:2px;background:#444c4f;'>"+gamesCUP+"</span><br>"+goalsCUP+"<br><span style='display:inline-block;min-width:32px;line-height:14px;border-radius:2px;background:#444c4f;'>"+assistsCUP+"</span><br>"+cardsCUP+"<br><span style='display:inline-block;min-width:32px;line-height:14px;border-radius:2px;background:#444c4f;'>"+ratingCUP+"</span>";
                    statsINT = "<span style='display:inline-block;min-width:32px;line-height:14px;border-radius:2px;background:#444c4f;'>"+gamesINT+"</span><br>"+goalsINT+"<br><span style='display:inline-block;min-width:32px;line-height:14px;border-radius:2px;background:#444c4f;'>"+assistsINT+"</span><br>"+cardsINT+"<br><span style='display:inline-block;min-width:32px;line-height:14px;border-radius:2px;background:#444c4f;'>"+ratingINT+"</span>";
                    statsTot = "<span style='display:inline-block;min-width:32px;line-height:14px;border-radius:2px;background:#444c4f;'>"+(gamesNAT+gamesCUP+gamesINT)+"</span><br>"+(goalsNAT+goalsCUP+goalsINT)+"<br><span style='display:inline-block;min-width:32px;line-height:14px;border-radius:2px;background:#444c4f;'>"+(assistsNAT+assistsCUP+assistsINT)+"</span><br>"+(cardsNAT+cardsCUP+cardsINT)+"<br><span style='display:inline-block;min-width:32px;line-height:14px;border-radius:2px;background:#444c4f;'>"+funFix1((ratingNAT*gamesNAT+ratingCUP*gamesCUP+ratingINT*gamesINT)/(gamesNAT+gamesCUP+gamesINT))+"</span>";
                    statsCar = "<span style='display:inline-block;min-width:32px;line-height:14px;border-radius:2px;background:#444c4f;'>"+(gamesTotNAT+gamesTotCUP+gamesTotINT)+"</span><br>"+(goalsTotNAT+goalsTotCUP+goalsTotINT)+"<br><span style='display:inline-block;min-width:32px;line-height:14px;border-radius:2px;background:#444c4f;'>"+(assistsTotNAT+assistsTotCUP+assistsTotINT)+"</span><br>"+(cardsTotNAT+cardsTotCUP+cardsTotINT)+"<br><span style='display:inline-block;min-width:32px;line-height:14px;border-radius:2px;background:#444c4f;'>"+funFix1((ratingTotNAT*gamesTotNAT+ratingTotCUP*gamesTotCUP+ratingTotINT*gamesTotINT)/(gamesTotNAT+gamesTotCUP+gamesTotINT))+"</span>";
                }
                $("#tactics_inner_slide").append(
                    "<div id='playerDetails' player_id='"+ID+"' style='display:block;height:122px;width:966px;font-size:12px;margin-left:"+slide+"px;'><span style='border-top:1px solid #444;border-right:1px solid #444;border-bottom:1px solid #222;padding:0px;margin:0;background:#222 url(/pics/dark_scroll_background.png);height:2px;width:965px;display:block;'></span>"+
                    "<div style='display:inline-block;padding-left:3px;padding-top:2px;'>"+appearance+"<span class='no' style='position:absolute;left:"+(slide+7)+"px;margin-top:-1px;font-size:18px;color:white;font-weight:bold;text-shadow:1px 1px 3px #000;'>"+no+"</span><span class='flag' style='position:absolute;left:"+(slide+7)+"px;margin-top:99px;'>"+flag+"</span>"+
                    "</div><div style='display:inline-block;text-align:center;line-height:15px;padding:8px 5px 5px 5px;width:198px;border-right:1px solid #444;vertical-align:top;height:105px;'><span style='font-size:15px;font-weight:bold;'>"+name+"</span><br>"+fp_long+"<br>"+age+"岁"+months+"月<br>状态:"+status+"<br>EXP:"+rou+"<br>工资:"+wage+
                    "</div><div style='display:inline-block;width:238px;padding:5px;border-left:1px solid #222;border-right:1px solid #444;line-height:15px;height:108px;vertical-align:top;'><span style='display:inline-block;width:72px;margin-left:5px;font-weight:bold;border-bottom:1px solid #222;padding-bottom:1px;' title='Ratings in the latest 5 official matches'>表现"+formIco+"</span><span style='display:inline-block;width:31px;text-align:center;border-bottom:1px solid #222;padding-bottom:1px;'>"+ratings[0]+"</span><span style='display:inline-block;width:31px;text-align:center;border-bottom:1px solid #222;padding-bottom:1px;'>"+ratings[1]+"</span><span style='display:inline-block;width:31px;text-align:center;border-bottom:1px solid #222;padding-bottom:1px;'>"+ratings[2]+"</span><span style='display:inline-block;width:31px;text-align:center;border-bottom:1px solid #222;padding-bottom:1px;'>"+ratings[3]+"</span><span style='display:inline-block;width:31px;text-align:center;border-bottom:1px solid #222;padding-bottom:1px;'>"+ratings[4]+"</span><br>"+
                    "<span style='display:inline-block;width:72px;margin-left:5px;font-weight:bold;border-top:1px solid #444;padding-top:1px;'>统计</span><span style='display:inline-block;width:31px;font-weight:bold;text-align:center;border-top:1px solid #444;padding-top:1px;' title='National Championship'>联赛</span><span style='display:inline-block;width:31px;font-weight:bold;text-align:center;border-top:1px solid #444;padding-top:1px;' title='National Cup'>杯赛</span><span style='display:inline-block;width:31px;font-weight:bold;text-align:center;border-top:1px solid #444;padding-top:1px;' title='International Cups'>国际</span><span style='display:inline-block;width:31px;font-weight:bold;text-align:center;border-top:1px solid #444;padding-top:1px;' title='Season Totals'>总体</span><span style='display:inline-block;width:31px;font-weight:bold;text-align:center;border-top:1px solid #444;padding-top:1px;' title='Career Totals'>生涯</span><br>"+
                    "<span style='float:left;width:72px;margin-left:5px;'>"+statsNames+"</span><span style='float:left;text-align:center;width:31px'>"+statsNAT+"</span><span style='float:left;text-align:center;width:31px'>"+statsCUP+"</span><span style='float:left;text-align:center;width:31px'>"+statsINT+"</span><span style='float:left;text-align:center;width:31px'>"+statsTot+"</span><span style='float:left;text-align:center;width:31px'>"+statsCar+"</span>"+
                    "</div><div style='display:inline-block;width:248px;padding:5px;border-left:1px solid #222;border-right:1px solid #444;line-height:15px;vertical-align:top;height:108px;'><span style='display:inline-block;width:25%;font-weight:bold;text-align:center;padding-bottom:4px;' title='Psychological Skills'>隐藏</span><span style='display:inline-block;width:25%;font-weight:bold;text-align:center;padding-bottom:4px;' title='Physical Skills'>身体</span><span style='display:inline-block;width:25%;font-weight:bold;text-align:center;padding-bottom:4px;' title='Tactical Skills'>战术</span><span style='display:inline-block;width:25%;font-weight:bold;text-align:center;padding-bottom:4px;' title='Technical Skills'>技术</span><br>"+
                    "<span style='float:left;width:26px;text-align:right;padding-right:3px;'>"+PSYnames+"</span><span style='float:left;text-align:center;width:32px;color:#000;'>"+PSYsk+"</span><span style='float:left;width:26px;text-align:right;padding-right:3px;'>"+PHYnames+"</span><span style='float:left;text-align:center;width:32px;color:#000;'>"+PHYsk+"</span><span style='float:left;width:26px;text-align:right;padding-right:3px;'>"+TACnames+"</span><span style='float:left;text-align:center;width:32px;color:#000;'>"+TACsk+"</span><span style='float:left;width:26px;text-align:right;padding-right:3px;'>"+TECnames+"</span><span style='float:left;text-align:center;width:32px;color:#000;'>"+TECsk+"</span>"+
                    "</div><div style='display:inline-block;border-left:1px solid #222;padding-left:9px;vertical-align:top;'>"+grafico+"</div></div>");
            }
        }); //end of player details
        if (totPlayers==11 && totDEF<1) {
            $("#MoreInfosUl > li:eq(2) > div:eq(0)").replaceWith(
                "<div class='favposition short' style='width:170px;text-align:center;margin:4px 3px -4px 3px;background:#ffffff4d;'><span style='width:30px;float:left'>"+totPlayers+"</span>"+
                "<span style='width:30px;float:left;'>&nbsp;</span><span style='width:110px;float:left;text-align:left;'>Team averages</span></div><div class='vert_split' style='display:inline-block;float:none'>"+
                "</div><div class='favposition short' style='width:30px;text-align:center;margin:0px 3px 0px 3px;line-height:17px;padding-top:1px;background:#00b3ff4d;cursor:pointer;' title='\"Old\" ME defending bonus'>"+DEFbonus+"</div>");
        };
        if (totPlayers==11 && totMID<1) {
            $("#MoreInfosUl > li:eq(2) > div:eq(0)").replaceWith(
                "<div class='favposition short' style='width:170px;text-align:center;margin:4px 3px -4px 3px;background:#ffffff4d;'><span style='width:30px;float:left'>"+totPlayers+"</span>"+
                "<span style='width:30px;float:left;'>&nbsp;</span><span style='width:110px;float:left;text-align:left;'>Team averages</span></div><div class='vert_split' style='display:inline-block;float:none'>"+
                "</div><div class='favposition short' style='width:30px;text-align:center;margin:0px 3px 0px 3px;line-height:17px;padding-top:1px;background:#ffd13e4d;cursor:pointer;' title='\"Old\" ME possession bonus'>"+MIDbonus+"</div>");
        };
        if (totPlayers==11 && totFOR<1) {
            $("#MoreInfosUl > li:eq(2) > div:eq(0)").replaceWith(
                "<div class='favposition short' style='width:170px;text-align:center;margin:4px 3px -4px 3px;background:#ffffff4d;'><span style='width:30px;float:left'>"+totPlayers+"</span>"+
                "<span style='width:30px;float:left;'>&nbsp;</span><span style='width:110px;float:left;text-align:left;'>Team averages</span></div><div class='vert_split' style='display:inline-block;float:none'>"+
                "</div><div class='favposition short' style='width:30px;text-align:center;margin:0px 3px 0px 3px;line-height:17px;padding-top:1px;background:#ff00004d;cursor:pointer;' title='\"Old\" ME attacking bonus'>"+ATTbonus+"</div>");
        };
        if (totPlayers<11) {
            $("#MoreInfosUl > li:eq(2)").find("span:eq(0)").css({"color":"#ab1107","font-weight":"bold"});
            $("#MoreInfosUl > li:eq(2)").find("span:eq(0)").text(totPlayers+"/11");
        };
        var fieldForeigners = $("#tactics_field").find("ib");
        var benchForeigners = $("#tactics_bench").find("ib");
        var foreigners = fieldForeigners.length+benchForeigners.length;

        $("#tactics_field").prepend("<div class='foreigners' style='position:absolute;margin-top:5px;margin-left:-8px;text-align:right;width:313px;text-shadow:1px 1px 3px #000;font-weight:bold;font-size:smaller;'>Foreigners: "+foreigners+"/5</div>");
        $("li.MoreInfos").mouseover(function(){$(this).addClass("hover");})
            .mouseout(function(){$(this).removeClass("hover");});
        $("div#showStamina").click(function() { ShowStamina() });
    }; // End of MoreInfos

    // GET HIDDEN INFOS (from the script "TrophyManager - Super Squad" by Joao Manuel Ferreira Fernandes)
    async function get_player_info_hidden_skills(player_id){
        var isitreallydata = "";
        var isitreallydataAux = "";
        var hiddenAdapt = 0;
        var hiddenProf = 0;
        var hiddenInj = 0;
        var hiddenAgr = 0;
        var foundHidden = false;
        try {
            const data = await $.get("https://trophymanager.com/players/" + player_id + "/", { paramOne: 1, paramX: 'abc' });

                if(data != null){
                    isitreallydata = data.split("class=\"skill_table zebra\" id=\"hidden_skill_table\">")[1].split("</table>")[0];
                    isitreallydataAux = isitreallydata;
                    if(isitreallydata.split("/20")[1]!=undefined){
                        foundHidden = true;
                        isitreallydata= isitreallydataAux.split("/20")[1].split("<strong>")[1];
                        hiddenInj = isitreallydata;
                        isitreallydata= isitreallydataAux.split("/20")[3].split("<strong>")[1];
                        hiddenAgr=isitreallydata;
                        isitreallydata= isitreallydataAux.split("/20")[5].split("<strong>")[1];
                        hiddenProf=isitreallydata;
                        isitreallydata=isitreallydataAux.split("/20")[7].split("<strong>")[1];
                        hiddenAdapt=isitreallydata;
                    } else {
                        foundHidden = false;
                    }
                    return [foundHidden, hiddenInj, hiddenAgr, hiddenProf, hiddenAdapt];
                }
        }
        catch (error) {
            console.error("Error fetching hidden skills:", error);
            throw error; // 重新抛出错误以便外部捕获
        }
    } // END Get Hidden Infos

    async function get_player_info_scout(player_id, show_non_pro_graphs) {
        var charisma = 0;
        var professionalism = 0;
        var aggression = 0;
        var reportsNum = 0;

        try {
            var data = await $.post("https://trophymanager.com/ajax/players_get_info.ajax.php", {
                "player_id": player_id,
                "type": "scout",
                "show_non_pro_graphs": show_non_pro_graphs
            }, "json");

            data=JSON.parse(data);

            if(data != null){
                if (data.error){ var report_error = data.error; }
                if (data.reports.length>-1){
                    for(var eachReport in data.reports){
                        var report = data.reports[eachReport];
                        if(report && !report_error){
                            if(report.scoutid!=0){
                                var scoutID = report.scoutid;
                                if (data.scouts[scoutID]!=undefined){
                                    var scoutPSY = data.scouts[scoutID].psychology;
                                    if(scoutPSY == 20){
                                        reportsNum++;
                                        charisma += parseInt(report.charisma);
                                        console.log(charisma);
                                        professionalism += parseInt(report.professionalism);
                                        console.log(professionalism);
                                        aggression += parseInt(report.aggression);
                                        console.log(aggression);
                                        console.log(reportsNum);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching scout info:", error);
        }

        // 处理除以零的情况
        if (reportsNum > 0) {
            charisma /= reportsNum;
            professionalism /= reportsNum;
            aggression /= reportsNum;
        }
        else{
            charisma = 0;
            professionalism = 0;
            aggression = 0;
        }

        return [charisma, professionalism, aggression];
    }


    function getMinutes() {
        var minutes = $("div#showStamina").attr("class");
        if (minutes==65) minutes = 1;
        else if (minutes==75) minutes = 2;
        else if (minutes==85) minutes = 4;
        else minutes = 0;
        return minutes;
    };

    function ShowStamina() {
        var staTime = $("div#showStamina").attr('class');
        if (staTime==0) $("div#showStamina").attr('class','65');
        else if (staTime==65) $("div#showStamina").attr('class','75');
        else if (staTime==75) $("div#showStamina").attr('class','85');
        else $("div#showStamina").attr('class','0');
        var minutes = getMinutes();
        $(".foreigners").remove();
        $(".MoreInfos").remove();
        $(".MoreInfosHeaders").remove();
        MoreInfos(minutes);
    };

    function get_player_info_history(player_id,show_non_pro_graphs){ // GET HISTORY (from the script "TrophyManager - Super Squad" by Joao Manuel Ferreira Fernandes)
        $.ajaxSetup({async: false});
        $.post("https://trophymanager.com/ajax/players_get_info.ajax.php",{
            "player_id":player_id,
            "type":"history",
            "show_non_pro_graphs":show_non_pro_graphs
        },function(data){
            if(data != null){
                document.Season = data.current_season;
                document.thisSeasonDataNAT = data.table.nat[0];
                document.thisSeasonDataCUP = data.table.cup[0];
                document.thisSeasonDataINT = data.table.int[0];
                document.allTimeDataNAT = data.table.nat[data.table.nat.length-1];
                document.allTimeDataCUP = data.table.cup[data.table.cup.length-1];
                document.allTimeDataINT = data.table.int[data.table.int.length-1];
            }
        },"json").error(function(){ });//json
        $.ajaxSetup({async: true});
        var season = document.Season;
        var thisSeasonDataNAT = document.thisSeasonDataNAT;
        var thisSeasonDataCUP = document.thisSeasonDataCUP;
        var thisSeasonDataINT = document.thisSeasonDataINT;
        var allTimeDataNAT = document.allTimeDataNAT;
        var allTimeDataCUP = document.allTimeDataCUP;
        var allTimeDataINT = document.allTimeDataINT;
        return [thisSeasonDataNAT,thisSeasonDataCUP,thisSeasonDataINT,allTimeDataNAT,allTimeDataCUP,allTimeDataINT,season];
    }
    $("#advanced_button").click(function() {
        if($("#tactics_inner_slide").css("left") == "0px") {
            $("#MoreInfosUl").attr('style','margin-left:434px;');
            if ($("#playerDetails").length) {
                $("#playerDetails").css('margin-left','434px');
                $("#playerDetails").find('.no').css('left','441px');
                $("#playerDetails").find('.flag').css('left','441px');
            }
        } else {
            $("#MoreInfosUl").attr('style','margin-left:0px;');
            if ($("#playerDetails").length) {
                $("#playerDetails").css('margin-left','0px');
                $("#playerDetails").find('.no').css('left','7px');
                $("#playerDetails").find('.flag').css('left','7px');
            }
        }
    })
})();