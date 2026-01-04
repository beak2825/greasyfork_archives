// ==UserScript==
// @name          TM Shortlist R5 (v3.5 - Ajuste Routine + Ordenação)
// @version       3.5
// @description   Mostra R5 e Ratings de Estilo (D/A/S Direto). Ajusta Routine < 40 para 40. Usa 'players_ar'.
// @namespace     https://trophymanager.com
// @match         *://trophymanager.com/shortlist*
// @match         *://trophymanager.com/national-teams/*/nt-shortlist*
// @require       https://code.jquery.com/jquery-3.6.0.min.js
// @grant         unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/546230/TM%20Shortlist%20R5%20%28v35%20-%20Ajuste%20Routine%20%2B%20Ordena%C3%A7%C3%A3o%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546230/TM%20Shortlist%20R5%20%28v35%20-%20Ajuste%20Routine%20%2B%20Ordena%C3%A7%C3%A3o%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("TM R5: Script v3.5 (Ajuste Routine + Ordenação) Iniciado");

    // --- CONSTANTES E FUNÇÕES AUXILIARES (MESMAS DA v3.4) ---
    const APP_COLOR = { LEVEL_1: "Darkred", LEVEL_2: "Black", LEVEL_3: "Orange", LEVEL_4: "Yellow", LEVEL_5: "Blue", LEVEL_6: "Aqua", LEVEL_7: "White" };
    const R5_CLASS = { LEVEL_1: 110, LEVEL_2: 100, LEVEL_3: 90, LEVEL_4: 80, LEVEL_5: 70, LEVEL_6: 60, LEVEL_7: 0 };
    var weightR5 = [[0.41029304,0.18048062,0.56730138,1.06344654,1.02312672,0.40831256,0.58235457,0.12717479,0.05454137,0.0908983,0.42381693,0.04626272,0.02199046,0],[0.42126371,0.18293193,0.60567629,0.91904794,0.89070915,0.40038476,0.56146633,0.15053902,0.15955429,0.15682932,0.42109742,0.09460329,0.03589655,0],[0.23412419,0.32032289,0.62194779,0.63162534,0.63143081,0.45218831,0.47370658,0.55054737,0.17744915,0.39932519,0.26915814,0.16413124,0.07404301,0],[0.27276905,0.26814289,0.61104798,0.39865092,0.42862643,0.43582015,0.46617076,0.44931076,0.25175412,0.46446692,0.2998635,0.43843061,0.21494592,0],[0.2521926,0.25112993,0.56090649,0.18230261,0.1837649,0.45928749,0.53498118,0.59461481,0.09851189,0.6160195,0.31243959,0.65402884,0.29982016,0],[0.28155678,0.24090675,0.60680245,0.19068879,0.20018012,0.45148647,0.48230007,0.42982389,0.26268609,0.57933805,0.31712419,0.65824985,0.29885649,0],[0.22029884,0.2922969,0.63248227,0.09904394,0.10043602,0.47469498,0.52919791,0.7755588,0.10531819,0.71048302,0.27667115,0.56813972,0.21537826,0],[0.21151292,0.3580471,0.88688492,0.14391236,0.13769621,0.46586605,0.34446036,0.51377701,0.59723919,0.75126119,0.16550722,0.29966502,0.12417045,0],[0.3547978,0.14887553,0.4327338,0.00023928,0.00021111,0.46931131,0.57731335,0.41686333,0.05607604,0.62121195,0.45370457,1.03660702,0.43205492,0],[0.45462811,0.30278232,0.45462811,0.90925623,0.45462811,0.90925623,0.45462811,0.45462811,0.30278232,0.15139116,0.15139116]];
    var weightRb = [[0.10493615,0.05208547,0.07934211,0.14448971,0.13159554,0.06553072,0.07778375,0.06669303,0.05158306,0.02753168,0.1205517,0.01350989,0.02549169,0.0388755],[0.07715535,0.04943315,0.11627229,0.11638685,0.12893778,0.07747251,0.06370799,0.03830611,0.10361093,0.06253997,0.09128094,0.0131411,0.02449199,0.03726305],[0.08219824,0.08668831,0.07434242,0.09661001,0.08894242,0.08998026,0.09281287,0.08868309,0.04753574,0.06042619,0.05396986,0.05059984,0.05660203,0.03060871],[0.06744248,0.06641401,0.09977251,0.08253749,0.09709316,0.09241026,0.08513703,0.06127851,0.1027552,0.07985941,0.0461896,0.0392727,0.05285911,0.02697852],[0.07304213,0.08174111,0.07248656,0.08482334,0.07078726,0.09568392,0.09464529,0.09580381,0.04746231,0.07093008,0.04595281,0.05955544,0.07161249,0.03547345],[0.06527363,0.0641027,0.09701305,0.07406706,0.08563595,0.09648566,0.08651209,0.06357183,0.10819222,0.07386495,0.03245554,0.05430668,0.06572005,0.03279859],[0.07842736,0.07744888,0.0720115,0.06734457,0.05002348,0.08350204,0.08207655,0.11181914,0.03756112,0.07486004,0.06533972,0.07457344,0.09781475,0.02719742],[0.06545375,0.06145378,0.10503536,0.06421508,0.07627526,0.09232981,0.07763931,0.07001035,0.11307331,0.07298351,0.04248486,0.06462713,0.07038293,0.02403557],[0.07738289,0.05022488,0.07790481,0.01356516,0.01038191,0.06495444,0.07721954,0.07701905,0.02680715,0.07759692,0.12701687,0.15378395,0.12808992,0.03805251],[0.07466384,0.07466384,0.07466384,0.14932769,0.10452938,0.14932769,0.10452938,0.10344411,0.0751261,0.04492581,0.04479831]];
    var posNames = ["DC","DCL","DCR","DL","DR","DMC","DMCL","DMCR","DML","DMR","MC","MCL","MCR","ML","MR","OMC","OMCL","OMCR","OML","OMR","F","FC","FCL","FCR","GK"];
    var pos =      [0,0,0,1,1,2,2,2,3,3,4,4,4,5,5,6,6,6,7,7,8,8,8,8,9];

    function funFix2(i){ return (Math.round(i * 100) / 100).toFixed(2); }
    function funFix3(i){ return (Math.round(i * 1000) / 1000).toFixed(3); }

    function identifyRole(roleString) { try { var role1, role2, side; if (!roleString || typeof roleString !== 'string') { return []; } let originalRoleStringForLog = roleString; roleString = roleString.trim().toUpperCase(); if (roleString.includes("/")) { let parts = roleString.split('/'); role1 = parts[0].trim(); let role2_full = parts[1].trim(); side = role2_full.match(/[LCR]$/); side = side ? side[0] : ""; role1 = role1 + side; if (role1.length === 1 && !side && role2_full.includes("C")) role1 = role1 + "C"; else if (role1.length === 2 && !side && role2_full.includes("C") && !role1.endsWith("C")) role1 = role1 + "C"; role2 = role2_full.replace(/\s*[LCR]$/, "").replace(/\s+/g, "") + side; } else if (roleString.includes(",")) { let parts = roleString.split(','); role1 = parts[0].trim().replace(/\s/g, ""); role2 = parts[1].trim().replace(/\s/g, ""); } else if (roleString.includes(" ")) { if (roleString.length > 3 && (roleString.endsWith("LC") || roleString.endsWith("RC") || roleString.endsWith("RL"))) { let basePos = roleString.substring(0, roleString.length - 2).trim(); let sides = roleString.substring(roleString.length - 2); role1 = basePos + sides.charAt(0); role2 = basePos + sides.charAt(1); } else { role1 = roleString.replace(/\s/g, ""); role2 = -1; } } else { role1 = roleString; role2 = -1; } if (role1 && role1 !== "GK" && role1.length > 3) role1 = role1.substring(0, 3); if (role2 && typeof role2 === 'string' && role2 !== "GK" && role2.length > 3) role2 = role2.substring(0, 3); return [role1, role2]; } catch (err) { console.error("TM R5 Erro em identifyRole para '" + originalRoleStringForLog + "': " + err); return [originalRoleStringForLog.toUpperCase(), -1]; } }
    function calculate(e,t,l,o,r,n,a,i,s){var c,p=0,u=0,M=0,d=0,h=0,f=0,g=0;for(c=0;c<e[n].length;c++)u+=l[c]*e[n][c],M+=l[c]*t[n][c],20!=l[c]&&(h+=e[n][c],f+=t[n][c],p++);return(i/p>0.9||0==p)&&(9==n?p=11:p=14,h=1,f=5),d=funFix3((u+i*h/p-2)/3),g=funFix2(1*M+i*f/p+5*a),[d,g]}

    function calculateRR(e) {
        var t,l,o=e.strength,r=e.stamina,n=e.pace,a=e.marking,i=e.tackling,s=e.workrate,c=e.positioning,p=e.passing,u=e.crossing,M=e.technique,d=e.heading,h=e.finishing,f=e.longshots,g=e.setpieces,V=e.handling,N=e.oneonones,P=e.reflexes,L=e.arialability,y=e.jumping,b=e.communication,A=e.kicking,C=e.throwing,R=e.fp,S=e.rutine,W=e.asi;

        if(typeof W === 'undefined' || typeof S === 'undefined' || typeof R === 'undefined' || R === "" || isNaN(parseFloat(W)) || isNaN(parseFloat(S)) ){
            console.warn(`TM R5: calculateRR: Dados ASI ou Routine ausentes/inválidos para ${e.player_name}. ASI=${W}, Routine=${S}. Cálculo R5 abortado.`);
            return null;
        }

        var E,_,x=identifyRole(R);
        if(!x||x.length==0||!x[0])return console.warn("TM R5: calculateRR: identifyRole falhou ou retornou vazio para FP:",R,"Jogador:",e.player_name),null;
        E=x[0],_=x[1];
        if(!E) return console.warn("TM R5: calculateRR: Posição primária (Role1) retornada por identifyRole é vazia. FP:",R,"Jogador:",e.player_name),null;
        var I,k=-1;
        for(var Z_idx=0;Z_idx<posNames.length;Z_idx++)posNames[Z_idx]==E&&(I=pos[Z_idx]),-1!=_&&posNames[Z_idx]==_&&(k=pos[Z_idx]);
        if(void 0===I)return console.warn("TM R5: calculateRR: Posição primária '"+E+"' (de FP '"+R+"') não mapeada para índice numérico. Jogador:",e.player_name),null;
        var O_skills,T_const;
        if(9==I){
            T_const=48717927500;
            O_skills=[o,r,n,V,N,P,L,y,b,A,C].map(val=>parseFloat(val)||0);
            if(O_skills.some(val=>isNaN(val)))return console.warn("TM R5: calculateRR: Skill de GK NaN. Jogador:",e.player_name,"Skills:",O_skills),null;
        }else{
            T_const=26353376e4;
            O_skills=[o,r,n,a,i,s,c,p,u,M,d,h,f,g].map(val=>parseFloat(val)||0);
            if(O_skills.some(val=>isNaN(val)))return console.warn("TM R5: calculateRR: Skill de Outfielder NaN. Jogador:",e.player_name,"Skills:",O_skills),null;
        }
        var X_loop,D_maxedSkills=0,v_sumRawSkills=0;
        for(X_loop=0;X_loop<O_skills.length;X_loop++)v_sumRawSkills+=O_skills[X_loop];
        var G_asiBonus=Math.round(10*(Math.pow(2,Math.log(T_const*W)/Math.log(Math.pow(2,7)))-v_sumRawSkills))/10;
        if(isNaN(G_asiBonus))G_asiBonus=0;
        var skillCountForRemainder= (9==I ? 11 : 14);
        for(X_loop=0;X_loop<O_skills.length;X_loop++) {
            if(O_skills[X_loop]>=19.9&&O_skills[X_loop]<=20.1) D_maxedSkills++;
        }
        var F_asiAdjustedSkills=[];
        for(X_loop=0;X_loop<O_skills.length;X_loop++) {
            F_asiAdjustedSkills[X_loop] = (O_skills[X_loop]>=19.9&&O_skills[X_loop]<=20.1) ? O_skills[X_loop] : (1*O_skills[X_loop]+( (skillCountForRemainder-D_maxedSkills>0) ? G_asiBonus/(skillCountForRemainder-D_maxedSkills) : 0 ) );
        }
        var B_routineBonus=(.03)*(100-100*Math.pow(Math.E,-.035*S));
        var J_unknown=0;
        var K_arr_placeholder=[0,0,0,0,0,0,0,0,0];
        var Q_arr_placeholder=[0,0,0,0,0,0,0,0,0];
        var U_calc=calculate(weightRb,weightR5,F_asiAdjustedSkills,K_arr_placeholder,Q_arr_placeholder,I,B_routineBonus,G_asiBonus,J_unknown);
        var Z_arr_rb_like=[U_calc[0]];
        var ee_arr_r5_values=[U_calc[1]];
        if(-1!=k&&k!=I&&k<weightR5.length&&k<weightRb.length){
            var o_sec=calculate(weightRb,weightR5,F_asiAdjustedSkills,K_arr_placeholder,Q_arr_placeholder,k,B_routineBonus,G_asiBonus,J_unknown);
            Z_arr_rb_like.push(o_sec[0]);
            ee_arr_r5_values.push(o_sec[1]);
        }
        let styleRatings = { ADir: 'N/A', DDir: 'N/A', SDir: 'N/A' };
        if (I !== 9) {
            let sBeq = F_asiAdjustedSkills.map((skill_val, idx) => idx === 1 ? skill_val : skill_val + B_routineBonus);
            let shotregular = parseFloat(funFix2(F_asiAdjustedSkills[11] * 0.5 + (F_asiAdjustedSkills[9] + F_asiAdjustedSkills[6] + F_asiAdjustedSkills[2]) / 3 * 0.4 + (F_asiAdjustedSkills[0] + F_asiAdjustedSkills[5]) / 2 * 0.1 + B_routineBonus));
            let shotlong = parseFloat(funFix2(F_asiAdjustedSkills[12] * 0.5 + (F_asiAdjustedSkills[9] + F_asiAdjustedSkills[11] + F_asiAdjustedSkills[6]) / 3 * 0.4 + (F_asiAdjustedSkills[0] + F_asiAdjustedSkills[5]) / 2 * 0.1 + B_routineBonus));
            let shothead = parseFloat(funFix2(F_asiAdjustedSkills[10] * 0.5 + (F_asiAdjustedSkills[0] * 2 + F_asiAdjustedSkills[6]) / 3 * 0.4 + (F_asiAdjustedSkills[2] + F_asiAdjustedSkills[5]) / 2 * 0.1 + B_routineBonus));
            styleRatings.ADir = funFix2((sBeq[1] * 0.125 + sBeq[2] * 0.29166666 + (sBeq[5] + sBeq[6]) * 0.08333333 + sBeq[7] * 0.25 + sBeq[9] * 0.16666666) * 5);
            styleRatings.DDir = funFix2((sBeq[1] * 0.052631579 + (sBeq[2] + sBeq[6]) * 0.105263158 + sBeq[3] * 0.421052632 + (sBeq[4] + sBeq[5]) * 0.157894737) * 5);
            styleRatings.SDir = funFix2((shotregular * 0.339 + shotlong * 0.342 + shothead * 0.319) * 5);
        }
        return [Z_arr_rb_like, ee_arr_r5_values, styleRatings];
    }

    const skillNameMap = {
        str: 'strength', sta: 'stamina', pac: 'pace', mar: 'marking', tac: 'tackling',
        wor: 'workrate', pos: 'positioning', pas: 'passing', cro: 'crossing', tec: 'technique',
        hea: 'heading', fin: 'finishing', lon: 'longshots', set: 'setpieces',
        han: 'handling', one: 'oneonones', ref: 'reflexes', ari: 'arialability',
        jum: 'jumping', com: 'communication', kic: 'kicking', thr: 'throwing'
    };

    let currentSortKey = null;
    let currentSortOrder = 'desc';

    function sortPlayerTable(sortKey, $tableToSort) {
        if (currentSortKey === sortKey) {
            currentSortOrder = (currentSortOrder === 'desc' ? 'asc' : 'desc');
        } else {
            currentSortOrder = 'desc';
            currentSortKey = sortKey;
        }
        $('#tmR5SortOrderIndicator').text(` (${sortKey} ${currentSortOrder === 'desc' ? '▼' : '▲'})`);
        const $tbody = $tableToSort.find("tbody");
        let $rows = $tbody.find("tr.tm-r5-processed-row");
        $rows.sort(function(a, b) {
            let valA = $(a).data(sortKey);
            let valB = $(b).data(sortKey);
            valA = (typeof valA === 'number' && !isNaN(valA)) ? valA : (currentSortOrder === 'desc' ? -Infinity : Infinity) ;
            valB = (typeof valB === 'number' && !isNaN(valB)) ? valB : (currentSortOrder === 'desc' ? -Infinity : Infinity) ;
            if (currentSortOrder === 'desc') { return valB - valA; } else { return valA - valB; }
        });
        $tbody.append($rows);
    }

    function setupSortControls($tableForControls) {
        if ($('#tmR5Sorter').length === 0) {
            const sorterHtml = `
                <div id="tmR5Sorter" style="margin: 10px 0; padding: 8px; background-color: #3a3a3a; border: 1px solid #555; color: #fff; text-align: left; border-radius: 4px;">
                    <strong style="color: #fff; margin-right: 5px;">Ordenar por:</strong>
                    <button class="tm-sort-btn" data-sort-key="r5Max" style="margin: 2px 5px; padding: 4px 8px; background-color: #555; color:white; border:1px solid #777; border-radius:3px; cursor:pointer;">R5 (Máx)</button>
                    <button class="tm-sort-btn" data-sort-key="dDef" style="margin: 2px 5px; padding: 4px 8px; background-color: #555; color:white; border:1px solid #777; border-radius:3px; cursor:pointer;">Def. Direta</button>
                    <button class="tm-sort-btn" data-sort-key="dAst" style="margin: 2px 5px; padding: 4px 8px; background-color: #555; color:white; border:1px solid #777; border-radius:3px; cursor:pointer;">Ast. Direta</button>
                    <button class="tm-sort-btn" data-sort-key="dSht" style="margin: 2px 5px; padding: 4px 8px; background-color: #555; color:white; border:1px solid #777; border-radius:3px; cursor:pointer;">Cht. Direto</button>
                    <span id="tmR5SortOrderIndicator" style="margin-left: 10px; font-style: italic; color: #ccc;"></span>
                </div>`;
            $tableForControls.before(sorterHtml);
            $('#tmR5Sorter').off('click', '.tm-sort-btn').on('click', '.tm-sort-btn', function() {
                const sortKey = $(this).data('sort-key');
                sortPlayerTable(sortKey, $tableForControls);
                $('.tm-sort-btn').css({'font-weight': 'normal', 'background-color': '#555'});
                $(this).css({'font-weight': 'bold', 'background-color': '#777'});
            });
        }
    }

    function runScript() {
        console.log("TM R5: runScript v3.5");
        let $mainPlayerTable;
        let isNTShortlist = location.href.includes('/national-teams/') && location.href.includes('/nt-shortlist');
        let missingDataMessageDisplayed = false;

        if (isNTShortlist) {
            $mainPlayerTable = $("#content div[style*='width: 725px;'] table.common:first");
            if ($mainPlayerTable.length === 0) $mainPlayerTable = $("table.zebra");
            if ($mainPlayerTable.length === 0) $mainPlayerTable = $("table.common");
            if ($mainPlayerTable.length === 0) $mainPlayerTable = $("table:has(th:contains('Name'))");
            console.log("TM R5: Página da Shortlist da Seleção Nacional detectada.");
        } else if (location.href.includes('/shortlist')) {
            $mainPlayerTable = $("#sq > table");
            console.log("TM R5: Página da Shortlist do Clube detectada.");
        } else {
            return;
        }

        if ($mainPlayerTable.length === 0) {
            console.error("TM R5: Tabela principal de jogadores não encontrada. Script não pode continuar.");
            return;
        }

        if ($mainPlayerTable.find("th.tmvn-r5-header").length === 0) {
            if(isNTShortlist){
                let $recHeader = $mainPlayerTable.find("thead tr th:contains('Rec')");
                if($recHeader.length > 0) {
                    $recHeader.after('<th class="tmvn-r5-header" align="right" title="R5 Calculado & Estilo Direto (D/A/S)">R5 & Estilo</th>');
                } else {
                    $mainPlayerTable.find("thead tr:eq(0)").append('<th class="tmvn-r5-header" align="right" title="R5 Calculado & Estilo Direto (D/A/S)">R5 & Estilo</th>');
                }
            } else {
                 $mainPlayerTable.find("thead tr:eq(0)").append('<th class="tmvn-r5-header" align="right" title="R5 Calculado & Estilo Direto (D/A/S)">R5 & Estilo</th>');
            }
        }

        let pagePlayers;
        try {
            if (typeof unsafeWindow !== 'undefined' && unsafeWindow.players_ar) {
                pagePlayers = unsafeWindow.players_ar;
            } else if (window.players_ar) {
                pagePlayers = window.players_ar;
            } else {
                console.error("TM R5: Variável 'players_ar' não encontrada na página.");
                if ($("#tmvn_players_ar_notice").length === 0) {
                     $mainPlayerTable.before('<div id="tmvn_players_ar_notice" style="color: red; padding: 10px; border: 1px solid red; margin-bottom:10px;"><b>TM R5:</b> Variável players_ar não encontrada.</div>');
                }
                return;
            }
        } catch (e) {
            console.error("TM R5: Erro ao tentar acessar 'players_ar':", e);
            return;
        }

        if (!pagePlayers || pagePlayers.length === 0) {
            console.warn("TM R5: 'players_ar' está vazia ou não é um array.");
            return;
        }

        pagePlayers.forEach(function(playerDataFromSource) {
            if (!playerDataFromSource || !playerDataFromSource.id) {
                console.warn("TM R5: Objeto de jogador inválido ou sem ID em players_ar:", playerDataFromSource);
                return;
            }
            let $playerRow = $mainPlayerTable.find(`a[href*="/players/${playerDataFromSource.id}"]`).first().closest("tr");
            if ($playerRow.length === 0 && !isNTShortlist) {
                $playerRow = $(`tr#player_${playerDataFromSource.id}, tr[data-player-id="${playerDataFromSource.id}"]`);
            }
            if ($playerRow.length === 0) {
                 return;
            }
            $playerRow.addClass('tm-r5-processed-row');
            var $r5Cell = $playerRow.find("td.tmvn-r5-cell");
            if ($r5Cell.length === 0) {
                if(isNTShortlist){
                    let $recCell = $playerRow.find("td:has(img[src*='recommend'])").last(); // Na NT, 'Rec' pode ser uma imagem
                    if ($recCell.length === 0) $recCell = $playerRow.find("td:contains('Rec')").last(); // Fallback para texto
                    if ($recCell.length > 0) {
                        $r5Cell = $('<td align="right" class="tmvn-r5-cell" style="vertical-align: top;">-</td>').insertAfter($recCell);
                    } else {
                        $r5Cell = $('<td align="right" class="tmvn-r5-cell" style="vertical-align: top;">-</td>').appendTo($playerRow);
                    }
                } else {
                    $r5Cell = $('<td align="right" class="tmvn-r5-cell" style="vertical-align: top;">-</td>').appendTo($playerRow);
                }
            } else {
                $r5Cell.html('-').css('vertical-align', 'top');
            }

            let finalPlayerInfoForCalc = { player_name: playerDataFromSource.name, id: playerDataFromSource.id };
            finalPlayerInfoForCalc.fp = playerDataFromSource.fav_pos || playerDataFromSource.fp;

            let asiVal = playerDataFromSource.asi || playerDataFromSource.si;
            let rawRoutineVal = playerDataFromSource.routine || playerDataFromSource.rutine; // Pega o valor original

            let parsedRoutine = parseFloat(rawRoutineVal);
            if (isNaN(parsedRoutine)) {
                parsedRoutine = 0; // Default para 0 se não for um número
            }

            // Aplica a regra: se routine < 40, usa 40. Senão, usa o valor (já parseado).
            let effectiveRoutine = parsedRoutine < 40 ? 40 : parsedRoutine;

            if (typeof asiVal === 'undefined' || typeof rawRoutineVal === 'undefined') { // Avisa sobre o valor original
                if (!missingDataMessageDisplayed && isNTShortlist) {
                    console.warn("TM R5: Chaves 'asi'/'si' ou 'routine'/'rutine' parecem estar ausentes do players_ar na página da Seleção Nacional. Os cálculos de R5 podem ser N/A ou imprecisos.");
                    if ($("#tmvn_nt_data_notice").length === 0) {
                        $mainPlayerTable.before('<div id="tmvn_nt_data_notice" style="color: orange; padding: 10px; border: 1px solid orange; margin-bottom:10px;"><b>TM R5 Aviso:</b> Dados de ASI ou Routine podem estar faltando no `players_ar` desta página de Seleção Nacional. Cálculos de R5 podem ser afetados. Verifique o console (F12).</div>');
                    }
                    missingDataMessageDisplayed = true;
                }
                finalPlayerInfoForCalc.asi = parseFloat(asiVal) || 0; // Default para ASI se ausente
                finalPlayerInfoForCalc.rutine = effectiveRoutine; // Usa o valor efetivo (já ajustado ou original >=40)
            } else {
                finalPlayerInfoForCalc.asi = parseFloat(asiVal);
                finalPlayerInfoForCalc.rutine = effectiveRoutine; // Usa o valor efetivo
            }

            for (const shortName in skillNameMap) {
                if (playerDataFromSource.hasOwnProperty(shortName)) {
                    finalPlayerInfoForCalc[skillNameMap[shortName]] = parseFloat(playerDataFromSource[shortName]);
                } else {
                    if (!finalPlayerInfoForCalc.hasOwnProperty(skillNameMap[shortName])) {
                        finalPlayerInfoForCalc[skillNameMap[shortName]] = 0;
                    }
                }
            }
            displayR5Value($r5Cell, finalPlayerInfoForCalc, $playerRow);
        });

        setupSortControls($mainPlayerTable);
        console.log("TM R5: Processamento via players_ar concluído.");
    }

   function displayR5Value($cellElement, playerInfo, $playerRow) {
        let localASI = parseFloat(playerInfo.asi);
        let localRoutine = parseFloat(playerInfo.rutine); // Já está ajustado para >= 40 ou original
        var rrResult = null;

        if (!isNaN(localASI) && !isNaN(localRoutine) && localASI >= 0 ) { // ASI 0 pode ser válido
            rrResult = calculateRR(playerInfo);
        } else {
            console.warn(`TM R5: displayR5Value: Pulando cálculo R5 para ${playerInfo.player_name} devido a ASI/Routine inválido(s). ASI: ${playerInfo.asi}, Routine: ${playerInfo.rutine}`);
        }

        var r5Max = -Infinity;
        var styleRatingsForData = { ADir: -Infinity, DDir: -Infinity, SDir: -Infinity };

        if (rrResult && rrResult[1] && rrResult[1].length > 0 && !isNaN(parseFloat(rrResult[1][0]))) {
            var r5Array = rrResult[1];
            var styleRatings = rrResult[2];
            r5Max = parseFloat(r5Array[0]);

            var r5MainDisplayElements = [r5Array[0]];
            if (r5Array.length > 1 && r5Array[1] && !isNaN(parseFloat(r5Array[1]))) {
                r5MainDisplayElements.push(r5Array[1]);
                if (parseFloat(r5Array[1]) > r5Max) r5Max = parseFloat(r5Array[1]);
            }
            let finalHtmlOutput = r5MainDisplayElements.join('<br>');

            let isGK = false;
            if (playerInfo.fp) {
                const roles = identifyRole(playerInfo.fp);
                if (roles && roles[0] && roles[0].toUpperCase() === 'GK') {
                    isGK = true;
                }
            }

            if (styleRatings && !isGK) {
                if (finalHtmlOutput !== "" && !finalHtmlOutput.includes("N/A")) {
                    finalHtmlOutput += "<br>";
                }
                finalHtmlOutput += `<div style="font-size:0.75em; line-height:1.1; text-align:right; color: darkgrey;">`;
                finalHtmlOutput += `<span>D: ${styleRatings.DDir}</span><br>`;
                finalHtmlOutput += `<span>A: ${styleRatings.ADir}</span><br>`;
                finalHtmlOutput += `<span>S: ${styleRatings.SDir}</span>`;
                finalHtmlOutput += `</div>`;
                styleRatingsForData.DDir = !isNaN(parseFloat(styleRatings.DDir)) ? parseFloat(styleRatings.DDir) : -Infinity;
                styleRatingsForData.ADir = !isNaN(parseFloat(styleRatings.ADir)) ? parseFloat(styleRatings.ADir) : -Infinity;
                styleRatingsForData.SDir = !isNaN(parseFloat(styleRatings.SDir)) ? parseFloat(styleRatings.SDir) : -Infinity;
            }

            var r5_color = APP_COLOR.LEVEL_7;
            if (!isNaN(r5Max) && r5Max !== -Infinity) {
                if (r5Max >= R5_CLASS.LEVEL_1) r5_color = APP_COLOR.LEVEL_1;
                else if (r5Max >= R5_CLASS.LEVEL_2) r5_color = APP_COLOR.LEVEL_2;
                else if (r5Max >= R5_CLASS.LEVEL_3) r5_color = APP_COLOR.LEVEL_3;
                else if (r5Max >= R5_CLASS.LEVEL_4) r5_color = APP_COLOR.LEVEL_4;
                else if (r5Max >= R5_CLASS.LEVEL_5) r5_color = APP_COLOR.LEVEL_5;
                else if (r5Max >= R5_CLASS.LEVEL_6) r5_color = APP_COLOR.LEVEL_6;
            } else {
                finalHtmlOutput = "R5 N/A";
                r5Max = -Infinity;
            }
            $cellElement.html(finalHtmlOutput).css('color', r5_color);
        } else {
            $cellElement.html('R5 N/A').css('color', APP_COLOR.LEVEL_7);
            r5Max = -Infinity;
        }

        if ($playerRow && $playerRow.length) {
            $playerRow.data('r5Max', r5Max);
            $playerRow.data('dDef', styleRatingsForData.DDir);
            $playerRow.data('dAst', styleRatingsForData.ADir);
            $playerRow.data('dSht', styleRatingsForData.SDir);
        }
    }

    var observerTimeout;
    const observer = new MutationObserver(() => {
        clearTimeout(observerTimeout);
        observerTimeout = setTimeout(() => {
            let currentPath = location.pathname + location.search + location.hash;
            if (currentPath.includes('/shortlist') || (currentPath.includes('/national-teams/') && currentPath.includes('/nt-shortlist'))) {
                console.log("TM R5: Observador detectou mudança, re-executando script.");
                $("#sq > table th.tmvn-r5-header, #content table.common th.tmvn-r5-header, table.zebra th.tmvn-r5-header").remove();
                $("#sq > table td.tmvn-r5-cell, #content table.common td.tmvn-r5-cell, table.zebra td.tmvn-r5-cell").remove();
                $("#sq > table tr.tm-r5-processed-row, #content table.common tr.tm-r5-processed-row, table.zebra tr.tm-r5-processed-row").removeClass('tm-r5-processed-row').removeData('r5Max').removeData('dDef').removeData('dAst').removeData('dSht');
                $("#tmvn_players_ar_notice, #tmvn_nt_data_notice").remove();
                $('#tmR5Sorter').remove();
                runScript();
            }
        }, 750);
    });

    let initialPath = location.pathname + location.search + location.hash;
    if (initialPath.includes('/shortlist') || (initialPath.includes('/national-teams/') && initialPath.includes('/nt-shortlist'))) {
        setTimeout(function() {
            runScript();
            observer.observe(document.body, { childList: true, subtree: true });
        }, 2500);
    }
})();