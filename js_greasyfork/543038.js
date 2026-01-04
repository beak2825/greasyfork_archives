// ==UserScript==
// @name         Trophy Manager - R5 Automático e Lances por Botão (Lógica GK Corrigida)
// @namespace    http://tampermonkey.net/
// @version      29.0
// @description  Versão com a lógica de cálculo de R5 aprimorada, corrigindo o erro para Goleiros (GK) e outras posições.
// @author       Gemini & User
// @match        https://*.trophymanager.com/bids*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      trophymanager.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=trophymanager.com
// @downloadURL https://update.greasyfork.org/scripts/543038/Trophy%20Manager%20-%20R5%20Autom%C3%A1tico%20e%20Lances%20por%20Bot%C3%A3o%20%28L%C3%B3gica%20GK%20Corrigida%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543038/Trophy%20Manager%20-%20R5%20Autom%C3%A1tico%20e%20Lances%20por%20Bot%C3%A3o%20%28L%C3%B3gica%20GK%20Corrigida%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(` #modal.tm-script-hiding { transition: none !important; opacity: 0 !important; position: fixed !important; top: -3000px !important; left: -3000px !important; } `);

    // --- NOVO MOTOR DE CÁLCULO (ADAPTADO DO SCRIPT "Calculadora Automática FINAL") ---
    const weightR4=[[.51872935,.29081119,.57222393,.89735816,.84487852,.5088794,.5088794,.13637928,.05248024,.09388931,.57549122,0,0,0],[.45240063,.31762087,.68150374,.77724031,.74690951,.50072196,.45947168,.17663123,.23886264,.18410349,.464533_93,0,0,0],[.43789335,.31844356,.53515723,.63671706,.59109742,.51311701,.53184426,.32421168,.06318165,.27931537,.50093723,.19317517,.07490902,0],[.42311032,.32315966,.62271745,.53932111,.51442838,.49835997,.47896659,.26434782,.22586124,.32182902,.45537227,.23961054,.09291562,0],[.3184988,.36581214,.50091016,.31726444,.2802902,.5202217,.55763723,.60199246,.10044356,.51811057,.38320838,.38594825,.14966211,0],[.35409971,.34443972,.64417234,.30427501,.27956082,.49925481,.46093655,.32887111,.38695101,.47884837,.37465446,.39194758,.15198852,0],[.32272636,.35024067,.48762872,.22888914,.19049636,.52620414,.57842512,.53330409,.07523792,.55942740,.39986691,.53866926,.20888391,0],[.36311066,.33106245,.61831416,.19830147,.17415753,.50049575,.47737842,.28937553,.34729042,.5283421,.39939218,.55684664,.21593269,0],[.40622753,.29744114,.39446722,.09952139,.07503885,.50402399,.5850585,.36932466,.05210389,.5367799,.51998862,.83588627,.32413803,0],[.37313433,.37313433,.37313433,.74626866,.52238806,.74626866,.52238806,.52238806,.37313433,.2238806,.2238806]];
    const weightR5=[[.41029304,.18048062,.56730138,1.06344654,1.02312672,.40831256,.58235457,.12717479,.05454137,.0908983,.42381693,.04626272,.02199046,0],[.42126371,.18293193,.60567629,.91904794,.89070915,.40038476,.56146633,.15053902,.15955429,.15682932,.42109742,.09460329,.03589655,0],[.23412419,.32032289,.62194779,.63162534,.63143081,.45218831,.47370658,.55054737,.17744915,.39932519,.26915814,.16413124,.07404301,0],[.27276905,.26814289,.61104798,.39865092,.42862643,.43582015,.46617076,.44931076,.25175412,.46446692,.2998635,.43843061,.21494592,0],[.2521926,.25112993,.56090649,.18230261,.1837649,.45928749,.53498118,.59461481,.09851189,.6160195,.31243959,.65402884,.29982016,0],[.28155678,.24090675,.60680245,.19068879,.20018012,.45148647,.48230007,.42982389,.26268609,.57933805,.31712419,.65824985,.29885649,0],[.22029884,.2922969,.63248227,.09904394,.10043602,.47469498,.52919791,.7755588,.10531819,.71048302,.27667115,.56813972,.21537826,0],[.21151292,.3580471,.88688492,.14391236,.13769621,.46586605,.34446036,.51377701,.59723919,.75126119,.16550722,.29966502,.12417045,0],[.3547978,.14887553,.4327338,.00023928,.00021111,.46931131,.57731335,.41686333,.05607604,.62121195,.45370457,1.03660702,.43205492,0],[.45462811,.30278232,.45462811,.90925623,.45462811,.90925623,.45462811,.45462811,.30278232,.15139116,.15139116]];
    const weightRb=[[.10493615,.05208547,.07934211,.14448971,.13159554,.06553072,.07778375,.06669303,.05158306,.02753168,.1205517,.01350989,.02549169,.0388755],[.07715535,.04943315,.11627229,.11638685,.12893778,.07747251,.06370799,.03830611,.10361093,.06253997,.09128094,.0131411,.02449199,.03726305],[.08219824,.08668831,.07434242,.09661001,.08894242,.08998026,.09281287,.08868309,.04753574,.06042619,.05396986,.05059984,.05660203,.03060871],[.06744248,.06641401,.09977251,.08253749,.09709316,.09241026,.08513703,.06127851,.1027552,.07985941,.0461896,.0392727,.05285911,.02697852],[.07304213,.08174111,.07248656,.08482334,.07078726,.09568392,.09464529,.09580381,.04746231,.07093008,.4595281,.05955544,.07161249,.03547345],[.06527363,.0641027,.09701305,.07406706,.08563595,.09648566,.08651209,.06357183,.10819222,.07386495,.03245554,.05430668,.06572005,.03279859],[.07842736,.07744888,.0720115,.06734457,.05002348,.08350204,.08207655,.11181914,.03756112,.07486004,.06533972,.07457344,.09781475,.02719742],[.06545375,.06145378,.10503536,.06421508,.07627526,.09232981,.07763931,.07001035,.11307331,.07298351,.04248486,.06462713,.07038293,.02403557],[.07738289,.05022488,.07790481,.01356516,.01038191,.06495444,.07721954,.07701905,.02680715,.07759692,.12701687,.15378395,.12808992,.03805251],[.07466384,.07466384,.07466384,.14932769,.10452938,.14932769,.10452938,.10344411,.0751261,.04492581,.04479831]];
    const funFix2 = i => (i !== null && i !== undefined) ? (Math.round(i * 100) / 100).toFixed(2) : '-';
    const getPosition = pos => ({'gk':9,'dc':0,'dr':1,'dl':1,'dmr':3,'dml':3,'dmc':2,'mr':5,'ml':5,'mc':4,'omr':7,'oml':7,'omc':6,'fc':8}[pos.toLowerCase().replace(/ /g, '')]);
    const calculateRemainders=(player,positionIndex,skills,SI)=>{let weight=26353376e4;9===positionIndex&&(weight=48717927500);let rec=0,ratingR=0,skillSum=0;for(let i=0;i<skills.length;i++)skillSum+=parseInt(skills[i]);let remainder=Math.round(10*(Math.pow(2,Math.log(weight*SI)/Math.log(Math.pow(2,7)))-skillSum))/10,remainderWeight=0,remainderWeight2=0,not20=0;weightR4[positionIndex].forEach((value,index)=>{rec+=skills[index]*weightRb[positionIndex][index];const weight=ratingType=== "R5"?weightR5:weightR4;ratingR+=skills[index]*weight[positionIndex][index],20!=skills[index]&&(remainderWeight+=weightRb[positionIndex][index],remainderWeight2+=weight[positionIndex][index],not20++)});(0.9<remainder/not20||!not20)&&(9===positionIndex?not20=11:not20=14,remainderWeight=1,remainderWeight2=5),rec=funFix2((rec+remainder*remainderWeight/not20-2)/3);return[remainder,Math.round(remainderWeight2),not20,ratingR,rec]};
    const calculateRERECOld=(player,positionIndex,skills,SI,rou)=>{const remainders=calculateRemainders(player,positionIndex,skills,SI);let rou2=0.03*(100-100*Math.pow(Math.E,-0.035*rou));const remainder=remainders[0]*remainders[1]/remainders[2];let ratingR=remainders[3]+remainder;return Number(funFix2(ratingR+5*rou2))};
    const calculateREREC=(player,positionIndex,skills,SI,rou)=>{let ratingR4=calculateRERECOld(player,positionIndex,skills,SI,rou);let rou2=0.03*(100-100*Math.pow(Math.E,-0.035*rou));const remainders=calculateRemainders(player,positionIndex,skills,SI);var goldstar=0;var skillsB=[];for(let j=0;j<2;j++)for(let i=0;i<skills.length;i++)0==j&&20==skills[i]&&goldstar++,1==j&&(20!=skills[i]?skillsB[i]=1*skills[i]+remainders[0]/(skills.length-goldstar):skillsB[i]=skills[i]);var skillsB_rou=[];for(let i=0;i<skills.length;i++)1==i||(9===positionIndex&&i>2)?skillsB_rou[i]=skillsB[i]:skillsB_rou[i]=1*skillsB[i]+rou2;var headerBonus=12<skillsB_rou[10]?funFix2(0.8*(Math.pow(Math.E,(skillsB_rou[10]-10)**3/1584.77)-1)+0.15*Math.pow(Math.E,0.007*skillsB_rou[0]*skillsB_rou[0]/8.73021)+0.05*Math.pow(Math.E,0.007*skillsB_rou[6]*skillsB_rou[6]/8.73021)):0,fkBonus=funFix2(Math.pow(Math.E,0.002*Math.pow(skillsB_rou[13]+skillsB_rou[12]+0.5*skillsB_rou[9],2))/327.92526),ckBonus=funFix2(Math.pow(Math.E,0.002*Math.pow(skillsB_rou[13]+skillsB_rou[8]+0.5*skillsB_rou[9],2))/983.6577),pkBonus=funFix2(Math.pow(Math.E,0.002*Math.pow(skillsB_rou[13]+skillsB_rou[11]+0.5*skillsB_rou[9],2))/1967.31409),gainBase=funFix2((skillsB_rou[0]**2+0.5*skillsB_rou[1]**2+0.5*skillsB_rou[2]**2+skillsB_rou[3]**2+skillsB_rou[4]**2+skillsB_rou[5]**2+skillsB_rou[6]**2)/6/22.9**2),keepBase=funFix2((0.5*skillsB_rou[0]**2+0.5*skillsB_rou[1]**2+skillsB_rou[2]**2+skillsB_rou[3]**2+skillsB_rou[4]**2+skillsB_rou[5]**2+skillsB_rou[6]**2)/6/22.9**2),posGain=[0.3*gainBase,0.3*gainBase,0.9*gainBase,0.6*gainBase,1.5*gainBase,0.9*gainBase,0.9*gainBase,0.6*gainBase,0.3*gainBase],posKeep=[0.3*keepBase,0.3*keepBase,0.9*keepBase,0.6*keepBase,1.5*keepBase,0.9*keepBase,0.9*keepBase,0.6*keepBase,0.3*keepBase],allBonus=11==skills.length?0:Number(headerBonus)+Number(fkBonus)+Number(ckBonus)+Number(pkBonus);return 9===positionIndex?ratingR4=funFix2(Number(ratingR4)+allBonus):ratingR4=funFix2(Number(ratingR4)+allBonus+posGain[positionIndex]+posKeep[positionIndex]),ratingR4};
    let ratingType = 'R5';

    function abbreviateBid(s){if(!s)return'0';try{const n=parseInt(String(s).replace(/\D/g,''),10);if(n>=1e6){return Math.round(n/1e6)+'M';}if(n>=1e3){return Math.round(n/1e3)+'k';}return n.toString();}catch(e){return s;}}
    function waitForElement(s,t=5000){return new Promise((res,rej)=>{const i=100;let e=0;const n=setInterval(()=>{const l=document.querySelector(s);if(l){clearInterval(n);res(l);}else{e+=i;if(e>=t){clearInterval(n);rej(new Error(`Elemento "${s}" não encontrado.`));}}},i);});}

    function getFullPlayerInfo(playerID) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST", url: "https://trophymanager.com/ajax/tooltip.ajax.php",
                data: `player_id=${playerID}&type=player`, headers: { "Content-Type": "application/x-www-form-urlencoded" },
                onload: res => {
                    try {
                        const playerData = JSON.parse(res.responseText).player;
                        const skillsArray = playerData.skills;
                        if (!Array.isArray(skillsArray)) { throw new Error("Skills data is not an array."); }
                        const checkSkills = skillsArray.filter(skill => skill.value);
                        let orderedSkills = [];
                        if (playerData.favposition.toLowerCase().includes('gk')) {
                             orderedSkills = [checkSkills[0].value, checkSkills[2].value, checkSkills[4].value, checkSkills[1].value, checkSkills[3].value, checkSkills[5].value, checkSkills[6].value, checkSkills[7].value, checkSkills[8].value, checkSkills[9].value, checkSkills[10].value];
                        } else {
                            orderedSkills.push(...checkSkills.filter((s, i) => i % 2 === 0).map(s => s.value));
                            orderedSkills.push(...checkSkills.filter((s, i) => i % 2 !== 0).map(s => s.value));
                        }
                        const finalSkills = orderedSkills.map(skill => {
                            if (typeof(skill) === 'string') {
                                if (skill.includes('silver')) return 19;
                                const match = skill.match(/title='(\d+)'/);
                                if (match && match[1]) return parseInt(match[1]);
                                return 20;
                            }
                            return skill;
                        });
                        const playerInfo = {
                            ...playerData,
                            skills: finalSkills,
                            asi: parseInt(playerData.skill_index.replace(/,/g, ''), 10),
                            xp: parseFloat(playerData.routine) || 0,
                        };
                        resolve(playerInfo);
                    } catch (e) { reject(e); }
                },
                onerror: reject
            });
        });
    }

    async function fetchMinimumBids() {
        const listContainer = document.querySelector('.transfers-in-box');
        if (!listContainer) return;
        const rowsToProcess = Array.from(listContainer.querySelectorAll('li.player-row')).filter(r => {
            const bidCell = r.querySelector('ib:nth-of-type(3)');
            return bidCell && bidCell.firstChild && bidCell.firstChild.nodeValue?.trim() === '0';
        });
        if (rowsToProcess.length === 0) return;
        for (const row of rowsToProcess) {
            const playerCell = row.querySelector('ib:nth-of-type(1)');
            const bidCell = row.querySelector('ib:nth-of-type(3)');
            const r5Span = bidCell.querySelector('span');
            if (!playerCell || !bidCell) continue;
            try {
                bidCell.style.color = 'yellow';
                bidCell.firstChild.nodeValue = '... ';
                playerCell.click();
                await waitForElement('#minbid');
                const minimumBid = document.querySelector('#minbid').innerText;
                const finalBidText = abbreviateBid(minimumBid);
                bidCell.innerHTML = `${finalBidText} ${r5Span ? r5Span.outerHTML : ''}`;
                bidCell.style.color = '#00ffff';
            } catch (error) {
                const playerName = playerCell.innerText.trim();
                console.error(`[TM SCRIPT] Falha ao buscar lance mínimo para ${playerName}:`, error);
                bidCell.firstChild.nodeValue = 'Erro ';
                bidCell.style.color = '#ff4444';
            } finally {
                const closeButton = document.querySelector('#modal .close_btn');
                if (closeButton) { closeButton.click(); }
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
    }

    async function calculateAllR5s_onLoad() {
        const listContainer = document.querySelector('.transfers-in-box');
        if (!listContainer) return;
        const rows = Array.from(listContainer.querySelectorAll('li.player-row'));
        const promises = rows.map(async (row) => {
            const bidCell = row.querySelector('ib:nth-of-type(3)');
            const playerID = row.id.replace('pid', '');
            if (!bidCell || !playerID || bidCell.querySelector('span[id^="r5-span-"]')) return;
            const originalBidText = bidCell.innerText.trim();
            const r5SpanId = `r5-span-${playerID}`;
            bidCell.innerHTML = `${originalBidText} <span id="${r5SpanId}" style="color: grey; font-size: 0.9em;">(R5: ...)</span>`;
            try {
                const playerInfo = await getFullPlayerInfo(playerID);
                let highestR5 = 0;
                let positions = playerInfo.favposition.split(',');
                positions.forEach(pos => {
                    let positionIndex = getPosition(pos);
                    if (positionIndex !== undefined) {
                        let r5 = calculateREREC(playerInfo, positionIndex, playerInfo.skills, playerInfo.asi, playerInfo.xp);
                        if (r5 > highestR5) {
                            highestR5 = r5;
                        }
                    }
                });
                const r5Span = document.getElementById(r5SpanId);
                if (r5Span) {
                    r5Span.textContent = `(R5: ${highestR5})`;
                    r5Span.style.color = 'yellow';
                }
            } catch (error) {
                console.error(`[TM SCRIPT] Falha ao calcular R5 para ${playerID}:`, error);
                const r5Span = document.getElementById(r5SpanId);
                if (r5Span) {
                    r5Span.textContent = `(R5: Erro)`;
                    r5Span.style.color = 'red';
                }
            }
        });
        await Promise.all(promises);
    }

    function addControlButton(container) {
        const header = container.querySelector('h3');
        if (!header || document.querySelector('#tm_fetch_bids_button')) return;
        const button = document.createElement('button');
        button.innerText = 'Buscar Lances Mínimos';
        button.id = 'tm_fetch_bids_button';
        button.style.cssText = "margin-left: 15px; padding: 3px 8px; font-size: 11px; font-weight: bold; cursor: pointer; background-color: #4CAF50; color: white; border: none; border-radius: 3px;";
        button.onclick = () => {
            const modal = document.querySelector('#modal');
            if (modal) modal.classList.add('tm-script-hiding');
            button.disabled = true; button.innerText = 'Buscando...';
            fetchMinimumBids().finally(() => {
                button.disabled = false; button.innerText = 'Buscar Lances Mínimos';
                if (modal) modal.classList.remove('tm-script-hiding');
            });
        };
        header.appendChild(button);
    }

    function initializeScript() {
        const listContainer = document.querySelector('.transfers-in-box');
        if (listContainer) {
            const headerCell = document.querySelector('.padding-box.tbox-header ib:nth-of-type(3)');
            if (headerCell) { headerCell.innerHTML = "BID (R5)"; }
            clearInterval(initInterval);
            addControlButton(listContainer);
            calculateAllR5s_onLoad();
        }
    }
    const initInterval = setInterval(initializeScript, 500);
    setTimeout(() => { clearInterval(initInterval); }, 20000);

})();