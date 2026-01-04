// ==UserScript==
// @name         TM - Buscador de Jogadores da Liga (R5 > 100)
// @version      3.2 - Exibe nome do país em texto
// @description  Na página da liga, busca em todos os times por jogadores com R5 (Rating 5) maior que 100 e exibe uma lista.
// @author       douglaskraft-club/970949/
// @match        https://trophymanager.com/league/*
// @match        https://trophymanager.com/league/#pa*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      trophymanager.com
// @namespace https://greasyfork.org/users/1018640
// @downloadURL https://update.greasyfork.org/scripts/539910/TM%20-%20Buscador%20de%20Jogadores%20da%20Liga%20%28R5%20%3E%20100%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539910/TM%20-%20Buscador%20de%20Jogadores%20da%20Liga%20%28R5%20%3E%20100%29.meta.js
// ==/UserScript==

/*--- Evita conflitos com o jQuery da página ---*/
this.$ = this.jQuery = jQuery.noConflict(true);

(function() {
    'use strict';

    // Dicionário para mapear códigos de país para nomes em português
    const countryMap = {
        'br': 'Brasil', 'pt': 'Portugal', 'ao': 'Angola', 'ar': 'Argentina', 'uy': 'Uruguai',
        'es': 'Espanha', 'it': 'Itália', 'de': 'Alemanha', 'fr': 'França', 'gb': 'Reino Unido',
        'nl': 'Holanda', 'be': 'Bélgica', 'co': 'Colômbia', 'cl': 'Chile', 'py': 'Paraguai',
        'us': 'EUA', 'mx': 'México', 'jp': 'Japão', 'cn': 'China', 'ru': 'Rússia',
        'ng': 'Nigéria', 'gh': 'Gana', 'cm': 'Camarões', 'se': 'Suécia', 'no': 'Noruega',
        'dk': 'Dinamarca', 'tr': 'Turquia', 'gr': 'Grécia', 'hr': 'Croácia', 'rs': 'Sérvia',
        'pl': 'Polônia', 'ro': 'Romênia', 'ua': 'Ucrânia', 'ch': 'Suíça', 'at': 'Áustria',
        '--': 'N/A'
    };

    // ==========================================================================================
    // INÍCIO - LÓGICA DE CÁLCULO DE R5 (Inalterada)
    // ==========================================================================================
    var weightR5 = [[0.41029304, 0.18048062, 0.56730138, 1.06344654, 1.02312672, 0.40831256, 0.58235457, 0.12717479, 0.05454137, 0.09089830, 0.42381693, 0.04626272, 0.02199046, 0.00000000], // DC
        [0.42126371, 0.18293193, 0.60567629, 0.91904794, 0.89070915, 0.40038476, 0.56146633, 0.15053902, 0.15955429, 0.15682932, 0.42109742, 0.09460329, 0.03589655, 0.00000000], // DL/R
        [0.23412419, 0.32032289, 0.62194779, 0.63162534, 0.63143081, 0.45218831, 0.47370658, 0.55054737, 0.17744915, 0.39932519, 0.26915814, 0.16413124, 0.07404301, 0.00000000], // DMC
        [0.27276905, 0.26814289, 0.61104798, 0.39865092, 0.42862643, 0.43582015, 0.46617076, 0.44931076, 0.25175412, 0.46446692, 0.29986350, 0.43843061, 0.21494592, 0.00000000], // DML/R
        [0.25219260, 0.25112993, 0.56090649, 0.18230261, 0.18376490, 0.45928749, 0.53498118, 0.59461481, 0.09851189, 0.61601950, 0.31243959, 0.65402884, 0.29982016, 0.00000000], // MC
        [0.28155678, 0.24090675, 0.60680245, 0.19068879, 0.20018012, 0.45148647, 0.48230007, 0.42982389, 0.26268609, 0.57933805, 0.31712419, 0.65824985, 0.29885649, 0.00000000], // ML/R
        [0.22029884, 0.29229690, 0.63248227, 0.09904394, 0.10043602, 0.47469498, 0.52919791, 0.77555880, 0.10531819, 0.71048302, 0.27667115, 0.56813972, 0.21537826, 0.00000000], // OMC
        [0.21151292, 0.35804710, 0.88688492, 0.14391236, 0.13769621, 0.46586605, 0.34446036, 0.51377701, 0.59723919, 0.75126119, 0.16550722, 0.29966502, 0.12417045, 0.00000000], // OML/R
        [0.35479780, 0.14887553, 0.43273380, 0.00023928, 0.00021111, 0.46931131, 0.57731335, 0.41686333, 0.05607604, 0.62121195, 0.45370457, 1.03660702, 0.43205492, 0.00000000], // F
        [0.45462811, 0.30278232, 0.45462811, 0.90925623, 0.45462811, 0.90925623, 0.45462811, 0.45462811, 0.30278232, 0.15139116, 0.15139116]]; // GK
    var weightRb = [[0.10493615, 0.05208547, 0.07934211, 0.14448971, 0.13159554, 0.06553072, 0.07778375, 0.06669303, 0.05158306, 0.02753168, 0.12055170, 0.01350989, 0.02549169, 0.03887550], [0.07715535, 0.04943315, 0.11627229, 0.11638685, 0.12893778, 0.07747251, 0.06370799, 0.03830611, 0.10361093, 0.06253997, 0.09128094, 0.01314110, 0.02449199, 0.03726305], [0.08219824, 0.08668831, 0.07434242, 0.09661001, 0.08894242, 0.08998026, 0.09281287, 0.08868309, 0.04753574, 0.06042619, 0.05396986, 0.05059984, 0.05660203, 0.03060871], [0.06744248, 0.06641401, 0.09977251, 0.08253749, 0.09709316, 0.09241026, 0.08513703, 0.06127851, 0.10275520, 0.07985941, 0.04618960, 0.03927270, 0.05285911, 0.02697852], [0.07304213, 0.08174111, 0.07248656, 0.08482334, 0.07078726, 0.09568392, 0.09464529, 0.09580381, 0.04746231, 0.07093008, 0.04595281, 0.05955544, 0.07161249, 0.03547345], [0.06527363, 0.06410270, 0.09701305, 0.07406706, 0.08563595, 0.09648566, 0.08651209, 0.06357183, 0.10819222, 0.07386495, 0.03245554, 0.05430668, 0.06572005, 0.03279859], [0.07842736, 0.07744888, 0.07201150, 0.06734457, 0.05002348, 0.08350204, 0.08207655, 0.11181914, 0.03756112, 0.07486004, 0.06533972, 0.07457344, 0.09781475, 0.02719742], [0.06545375, 0.06145378, 0.10503536, 0.06421508, 0.07627526, 0.09232981, 0.07763931, 0.07001035, 0.11307331, 0.07298351, 0.04248486, 0.06462713, 0.07038293, 0.02403557], [0.07738289, 0.05022488, 0.07790481, 0.01356516, 0.01038191, 0.06495444, 0.07721954, 0.07701905, 0.02680715, 0.07759692, 0.12701687, 0.15378395, 0.12808992, 0.03805251], [0.07466384, 0.07466384, 0.07466384, 0.14932769, 0.10452938, 0.14932769, 0.10452938, 0.10344411, 0.07512610, 0.04492581, 0.04479831]];
    var posNames = ["DC", "DCL", "DCR", "DL", "DR", "DMC", "DMCL", "DMCR", "DML", "DMR", "MC", "MCL", "MCR", "ML", "MR", "OMC", "OMCL", "OMCR", "OML", "OMR", "F", "FC", "FCL", "FCR", "GK"];
    var pos = [0, 0, 0, 1, 1, 2, 2, 2, 3, 3, 4, 4, 4, 5, 5, 6, 6, 6, 7, 7, 8, 8, 8, 8, 9];
    function funFix2(i) { return (Math.round(i * 100) / 100).toFixed(2); }
    function funFix3(i) { return (Math.round(i * 1000) / 1000).toFixed(3); }
    function identifyRole(role) { try { var role1, role2, side; if (role.indexOf("/") != -1) { role = role.split(/\//); role1 = role[0]; role2 = role[1]; side = role[1].match(/\D$/); role2 = role2.replace(/\s/g, ""); role1 = role[0] + side; } else if (role.indexOf(",") != -1) { role = role.split(/,/); role1 = role[0].replace(/\s/g, ""); role2 = role[1].replace(/\s/g, ""); } else if (role.indexOf(" ") != -1) { if (role.substring(role.indexOf(" ") + 1).length > 1) { role = role.split(/\s/); role1 = role[0]; side = role[1]; role2 = role1 + side.substring(1); role1 = role1 + side.substring(0, 1); } else { role1 = role.replace(" ", ""); role2 = -1; } } else { role1 = role; role2 = -1; } return [role1, role2]; } catch (err) { console.log('exception identifyRole: ' + err); return []; } }
    function calculate(weightRb, weightR5, skills, posGain, posKeep, fp, rou, remainder, allBonus) { var rec = 0, ratingR = 0, remainderWeight = 0, remainderWeight2 = 0, not20 = 0; for (var i = 0; i < weightRb[fp].length; i++) { rec += skills[i] * weightRb[fp][i]; ratingR += skills[i] * weightR5[fp][i]; if (skills[i] != 20) { remainderWeight += weightRb[fp][i]; remainderWeight2 += weightR5[fp][i]; not20++; } } if (remainder / not20 > 0.9 || not20 == 0) { if (fp == 9) not20 = 11; else not20 = 14; remainderWeight = 1; remainderWeight2 = 5; } rec = funFix3((rec + remainder * remainderWeight / not20 - 2) / 3); ratingR += remainder * remainderWeight2 / not20; var ratingR5 = funFix2(ratingR * 1 + rou * 5); var ratingR5Bonus = (skills.length == 11) ? funFix2(ratingR5 * 1 + allBonus * 1) : funFix2(ratingR5 * 1 + allBonus * 1 + posGain[fp] * 1 + posKeep[fp] * 1); return [rec, ratingR5Bonus]; }
    function calculateRR(p) { var skills, weight, fp, fp2 = -1; var role = identifyRole(p.fp); if (role.length === 0) return [[0], [0]]; var ROLE1 = role[0], ROLE2 = role[1]; for (var i = 0; i < posNames.length; i++) { if (posNames[i] == ROLE1) fp = pos[i]; if (ROLE2 != -1 && posNames[i] == ROLE2) fp2 = pos[i]; } if (fp == 9) { skills = [p.strength, p.stamina, p.pace, p.handling, p.oneonones, p.reflexes, p.arialability, p.jumping, p.communication, p.kicking, p.throwing]; weight = 48717927500; } else { skills = [p.strength, p.stamina, p.pace, p.marking, p.tackling, p.workrate, p.positioning, p.passing, p.crossing, p.technique, p.heading, p.finishing, p.longshots, p.setpieces]; weight = 263533760000; } var skillSum = 0; for (i = 0; i < skills.length; i++) { skillSum += parseInt(skills[i]); } var remainder = Math.round((Math.pow(2, Math.log(weight * p.asi) / Math.log(Math.pow(2, 7))) - skillSum) * 10) / 10; var goldstar = 0; for (i = 0; i < skills.length; i++) { if (skills[i] == 20) goldstar++; } var skillsB = []; for (i = 0; i < skills.length; i++) { if (skills[i] != 20) skillsB[i] = skills[i] * 1 + remainder / (skills.length - goldstar); else skillsB[i] = skills[i]; } var routine = (3 / 100) * (100 - (100) * Math.pow(Math.E, -p.rutine * 0.035)); var strRou = skillsB[0] * 1 + routine, staRou = skillsB[1] * 1, pacRou = skillsB[2] * 1 + routine, marRou = skillsB[3] * 1 + routine, tacRou = skillsB[4] * 1 + routine, worRou = skillsB[5] * 1 + routine, posRou = skillsB[6] * 1 + routine, pasRou = skillsB[7] * 1 + routine, croRou = skillsB[8] * 1 + routine, tecRou = skillsB[9] * 1 + routine, heaRou = skillsB[10] * 1 + routine, finRou = skillsB[11] * 1 + routine, lonRou = skillsB[12] * 1 + routine, setRou = skillsB[13] * 1 + routine; var headerBonus = (heaRou > 12) ? funFix2((Math.pow(Math.E, (heaRou - 10) ** 3 / 1584.77) - 1) * 0.8 + Math.pow(Math.E, (strRou * strRou * 0.007) / 8.73021) * 0.15 + Math.pow(Math.E, (posRou * posRou * 0.007) / 8.73021) * 0.05) : 0; var fkBonus = funFix2(Math.pow(Math.E, Math.pow(setRou + lonRou + tecRou * 0.5, 2) * 0.002) / 327.92526); var ckBonus = funFix2(Math.pow(Math.E, Math.pow(setRou + croRou + tecRou * 0.5, 2) * 0.002) / 983.65770); var pkBonus = funFix2(Math.pow(Math.E, Math.pow(setRou + finRou + tecRou * 0.5, 2) * 0.002) / 1967.31409); var allBonus = (skills.length == 11) ? 0 : headerBonus * 1 + fkBonus * 1 + ckBonus * 1 + pkBonus * 1; var gainBase = funFix2((strRou ** 2 + staRou ** 2 * 0.5 + pacRou ** 2 * 0.5 + marRou ** 2 + tacRou ** 2 + worRou ** 2 + posRou ** 2) / 6 / 22.9 ** 2); var keepBase = funFix2((strRou ** 2 * 0.5 + staRou ** 2 * 0.5 + pacRou ** 2 + marRou ** 2 + tacRou ** 2 + worRou ** 2 + posRou ** 2) / 6 / 22.9 ** 2); var posGain = [gainBase * 0.3, gainBase * 0.3, gainBase * 0.9, gainBase * 0.6, gainBase * 1.5, gainBase * 0.9, gainBase * 0.9, gainBase * 0.6, gainBase * 0.3]; var posKeep = [keepBase * 0.3, keepBase * 0.3, keepBase * 0.9, keepBase * 0.6, keepBase * 1.5, keepBase * 0.9, keepBase * 0.9, keepBase * 0.6, keepBase * 0.3]; var valueFp = calculate(weightRb, weightR5, skills, posGain, posKeep, fp, routine, remainder, allBonus); var rec = [valueFp[0]], r5 = [valueFp[1]]; if (fp2 != -1 && fp2 != fp) { var valueFp2 = calculate(weightRb, weightR5, skills, posGain, posKeep, fp2, routine, remainder, allBonus); rec.push(valueFp2[0]); r5.push(valueFp2[1]); } return [rec, r5]; }
    // ==========================================================================================
    // FIM - LÓGICA DE CÁLCULO DE R5
    // ==========================================================================================

    function GM_fetch(url, options) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: options.method,
                url: url,
                data: options.body,
                headers: options.headers,
                onload: (response) => resolve({
                    text: () => Promise.resolve(response.responseText),
                    json: () => Promise.resolve(JSON.parse(response.responseText)),
                }),
                onerror: (error) => reject(error),
            });
        });
    }

    async function findHighR5Players() {
        const resultsContainer = $('#r5-results-container');
        const findButton = $('#r5-finder-btn');
        findButton.prop('disabled', true).text('Buscando...');
        resultsContainer.show().html('<div class="r5-results-header"><h3>Buscando...</h3><p>Por favor, aguarde. Isso pode levar alguns minutos.</p></div>');

        const foundPlayers = [];
        const clubLinks = $('#overall_table tbody tr td a[href*="/club/"]').not('.b_team');
        const totalClubs = clubLinks.length;
        let processedClubs = 0;

        for (const link of clubLinks) {
            const clubUrl = $(link).attr('href');
            const clubName = $(link).text().trim();
            const clubIdMatch = clubUrl.match(/\/club\/(\d+)\//);
            if (!clubIdMatch) continue;

            const clubId = clubIdMatch[1];
            processedClubs++;
            resultsContainer.find('p').text(`Verificando time ${clubName} (${processedClubs}/${totalClubs})...`);

            try {
                const response = await GM_fetch('https://trophymanager.com/ajax/players_get_select.ajax.php', {
                    method: 'POST', body: `type=change&club_id=${clubId}`, headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });
                const data = await response.json();
                const playersData = data.post;

                if (playersData) {
                    for (const playerId in playersData) {
                        const playerInfo = playersData[playerId];
                        const rrValue = calculateRR(playerInfo);
                        const max_r5 = Math.max(...rrValue[1].map(Number));

                        if (max_r5 > 100) {
                            foundPlayers.push({
                                clubName,
                                clubId,
                                playerName: playerInfo.player_name,
                                playerId: playerId,
                                countryCode: playerInfo.player_country,
                                age: `${playerInfo.age}.${playerInfo.month}`,
                                position: playerInfo.fp,
                                maxR5: max_r5.toFixed(2)
                            });
                        }
                    }
                }
            } catch (error) {
                console.error(`Falha ao buscar jogadores do clube ${clubName} (ID: ${clubId})`, error);
            }
        }
        displayResults(foundPlayers);
        findButton.prop('disabled', false).text('Buscar R5 > 100');
    }

    function displayResults(players) {
        let html = `
            <div class="r5-results-header">
                <h2>Jogadores Encontrados com R5 > 100</h2>
                <button id="r5-close-btn" title="Fechar">X</button>
            </div>`;

        if (players.length === 0) {
            html += `<p>Nenhum jogador encontrado que satisfaça o critério.</p>`;
        } else {
            players.sort((a, b) => b.maxR5 - a.maxR5);
            html += '<div class="r5-results-body">';
            html += `
                <table class="overall_table hover border_bottom" style="width: 100%;">
                    <thead><tr><th>Clube</th><th>Nome do Jogador</th><th>País</th><th>Idade</th><th>Posição</th><th style="text-align: right;">R5 Máx</th></tr></thead>
                    <tbody>`;
            players.forEach(p => {
                // Pega o nome do país do mapa, ou usa o código se não encontrar
                const countryName = countryMap[p.countryCode.toLowerCase()] || p.countryCode.toUpperCase();

                html += `
                    <tr>
                        <td><a href="/club/${p.clubId}/" target="_blank">${p.clubName}</a></td>
                        <td><a href="/players/${p.playerId}/#/" target="_blank">${p.playerName}</a></td>
                        <td style="text-align: center;">${countryName}</td>
                        <td style="text-align: center;">${p.age}</td>
                        <td style="text-align: center;">${p.position}</td>
                        <td style="font-weight: bold; color: #66ff66; text-align: right;">${p.maxR5}</td>
                    </tr>`;
            });
            html += `</tbody></table></div>`;
        }
        $('#r5-results-container').html(html);
        $('#r5-close-btn').on('click', () => $('#r5-results-container').hide());
    }

    GM_addStyle(`
        #r5-finder-btn { position: fixed; bottom: 20px; right: 20px; z-index: 9998; padding: 10px 15px; font-size: 14px; font-weight: bold; color: white; background-color: #28a745; border: none; border-radius: 5px; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
        #r5-finder-btn:hover { background-color: #218838; }
        #r5-finder-btn:disabled { background-color: #6c757d; cursor: not-allowed; }
        #r5-results-container { position: fixed; top: 10%; left: 50%; transform: translateX(-50%); width: 80%; max-width: 900px; height: 75%; z-index: 9999; background: #2a2a2a; border: 1px solid #444; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); display: none; color: #ccc; flex-direction: column; }
        .r5-results-header { padding: 15px; border-bottom: 1px solid #444; position: relative; }
        .r5-results-header h2, .r5-results-header h3 { margin: 0; color: white; }
        #r5-close-btn { position: absolute; top: 10px; right: 15px; background: transparent; border: none; color: #ccc; font-size: 24px; font-weight: bold; cursor: pointer; }
        #r5-close-btn:hover { color: white; }
        .r5-results-body { padding: 15px; overflow-y: auto; height: 100%; }
        .r5-results-body a { color: #5c93e2; }
    `);

    function setupUI() {
        const findButton = $('<button id="r5-finder-btn">Buscar R5 > 100</button>');
        const resultsContainer = $('<div id="r5-results-container"></div>');
        $('body').append(findButton).append(resultsContainer);
        findButton.on('click', findHighR5Players);
    }

    $(document).ready(function() {
        setupUI();
    });

})();