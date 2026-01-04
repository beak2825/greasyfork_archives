// ==UserScript==
// @name         FMP Rating
// @name:en      FMP Rating
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Show Rating
// @description:en  Show Rating
// @match        https://footballmanagerproject.com/Team/Player?id=*
// @match        https://footballmanagerproject.com/Team/Player/?id=*
// @match        https://www.footballmanagerproject.com/Team/Player?id=*
// @match        https://www.footballmanagerproject.com/Team/Player/?id=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527946/FMP%20Rating.user.js
// @updateURL https://update.greasyfork.org/scripts/527946/FMP%20Rating.meta.js
// ==/UserScript==

const RatingRate={
    //  Han,One,Ref,Aer,Jum,Ele,Kic,Thr,Pos,Sta,Pac
    0: [1.2,0.7,1.2,0.6,0.7,0.4,0.5,0.5,0.6,0.5,0.4], // GK
    //  Mar,Tak,Tec,Pas,Cro,Fin,Hea,Lon,Pos,Sta,Pac
    4: [1.0,1.0,0.5,0.6,0.2,0.2,1.0,0.3,1.0,0.7,0.8], // DC
    5: [0.9,0.9,0.6,0.5,0.7,0.3,0.7,0.4,0.7,0.8,0.8], // DL
    6: [0.9,0.9,0.6,0.5,0.7,0.3,0.7,0.4,0.7,0.8,0.8], // DR

    8: [0.8,0.8,0.7,0.8,0.2,0.3,0.7,0.5,1.0,1.0,0.5], // DMC
    9: [0.7,0.7,0.7,0.6,0.9,0.3,0.4,0.5,0.7,0.9,0.9], // DML
    10:[0.7,0.7,0.7,0.6,0.9,0.3,0.4,0.5,0.7,0.9,0.9], // DMR

    16:[0.5,0.5,1.0,1.0,0.3,0.5,0.5,0.5,1.0,1.0,0.5], // MC
    17:[0.4,0.4,0.8,0.8,1.0,0.5,0.3,0.5,0.7,0.9,1.0], // ML
    18:[0.4,0.4,0.8,0.8,1.0,0.5,0.3,0.5,0.7,0.9,1.0], // MR

    32:[0.3,0.3,1.0,1.0,0.3,0.8,0.5,0.8,0.8,1.0,0.5], // AMC
    33:[0.2,0.2,0.9,0.7,1.0,0.7,0.4,0.7,0.7,0.8,1.0], // AML
    34:[0.2,0.2,0.9,0.7,1.0,0.7,0.4,0.7,0.7,0.8,1.0], // AMR

    64:[0.2,0.2,0.7,0.7,0.4,1.0,1.0,1.0,0.7,0.7,0.7], // F
};

const FP2POS = {
    GK:0,
    DC:4,
    DL:5,
    DR:6,
    DMC:8,
    DML:9,
    DMR:10,
    MC:16,
    ML:17,
    MR:18,
    OMC:32,
    OML:33,
    OMR:34,
    FC:64
};
const POS2FP = Object.fromEntries(Object.entries(FP2POS).map(([k,v])=>[v,k]));

const GK_SKILLS = ["Han","One","Ref","Aer","Jum","Ele","Kic","Thr","Pos","Sta","Pac"];
const FP_SKILLS = ["Mar","Tak","Tec","Pas","Cro","Fin","Hea","Lon","Pos","Sta","Pac"];

const BONUS_MAPPING = {
    0: () => {
    const span = document.createElement("span");
        span.textContent = "Effect*";
        span.style.fontSize = "12px";
        return span;
    },
    1: (skills, pos) => createSkillSpan(skills.Sta),
    2: (skills, pos) => createSkillSpan(skills.Pac),
    3: (skills, pos) => createSkillSpan(pos ? skills.Mar : skills.Han),
    4: (skills, pos) => createSkillSpan(pos ? skills.Tak : skills.One),
    5: (skills, pos) => createSkillSpan(pos ? skills.Pos : skills.Ref),
    6: (skills, pos) => createSkillSpan(pos ? skills.Pas : skills.Pos),
    7: (skills, pos) => createSkillSpan(pos ? skills.Cro : skills.Ele),
    8: (skills, pos) => createSkillSpan(pos ? skills.Tec : skills.Aer),
    9: (skills, pos) => createSkillSpan(pos ? skills.Hea : skills.Kic),
    10:(skills, pos) => createSkillSpan(pos ? skills.Fin : skills.Jum),
    11:(skills, pos) => createSkillSpan(pos ? skills.Lon : skills.Thr)
};

function createSkillSpan(value) {
    const fixed = value.toFixed(0);
    const int = Math.floor(fixed / 10);
    const dec = Math.round(fixed % 10);
    const cls = int <5 ? "l5" : int<10?"l10":int<15?"l15":int<20?"l20":"b20";

    const span = document.createElement("span");
    span.className = "num " + cls;
    span.innerHTML = `${int}<span class="decimal">${dec}</span>`;
    return span;
}

function skillToArray(sk,pos){
    return pos===0 ? GK_SKILLS.map(k=>sk[k]) : FP_SKILLS.map(k=>sk[k]);
}

function arrayToSkill(arr,pos,orig){
    const keys = pos===0 ? GK_SKILLS : FP_SKILLS;
    const out = {...orig};
    keys.forEach((k,i)=> out[k]=arr[i]);
    return out;
}

const currentUrl = window.location.href;
const urlObj = new URL(currentUrl);
const id = urlObj.searchParams.get('id');

function makeIdRow(id) {
    const row = document.createElement("tr");
    row.innerHTML = `<th>ID</th><td>${id}</td>`;
    return row;
}

function showRating(value,isOwner){
    const row = document.createElement("tr");
    row.innerHTML = `<th>Rating${isOwner?"":"*"}<\/th><td>${value}<\/td>`;
    document.querySelector(".infotable").appendChild(row);
}


function showBonusSkills(skills, pos){
    document.querySelectorAll(".skilltable .num").forEach((num, idx)=>{
        const handler = BONUS_MAPPING[idx];
        if(!handler) return;

        const wrapper = document.createElement("div");
        wrapper.className = "bonus";
        wrapper.append("(");

        const node = handler(skills, pos, num);

        wrapper.appendChild(node);
        wrapper.append(")");
        num.parentNode.appendChild(wrapper);
    });
}

function showBirthday(day){
    const base = new Date(FMP.Day0);
    base.setDate(base.getDate()+day);
    const weekday = ['周日','周一','周二','周三','周四','周五','周六'][base.getDay()];

    const row = document.createElement("tr");
    row.innerHTML = `<th>出生日<\/th><td><span title="${weekday}">${day}</span> ${weekday}</td>`;
    document.querySelector(".infotable").appendChild(row);
}

function showRatingTable(ratingTable, pos) {
    const container = document.querySelector('.d-flex.flex-wrap.justify-content-around');
    if (!container || pos === 0) return;

    const POS_ORDER = [4,5,8,9,16,17,32,33,64];
    const HEADERS = ["位置","DC","DLR","DMC","DMLR","MC","MLR","OMC","OMLR","FC"];

    const current = combinePos(pos);

    const entries = Object.entries(ratingTable);
    const [maxKey, maxValue] = entries.reduce((best, cur) =>
        cur[1] > best[1] ? cur : best
    );

    const table = document.createElement("table");
    table.className = "skilltable";
    table.style.margin = "0 auto";

    const headerRow = document.createElement("tr");
    HEADERS.forEach(h => {
        const th = document.createElement("th");
        th.textContent = h;
        headerRow.appendChild(th);
    });

    const valueRow = document.createElement("tr");

    let first = document.createElement("td");
    first.textContent = "Rating";
    valueRow.appendChild(first);

    POS_ORDER.forEach(key => {
        const td = document.createElement("td");
        const val = ratingTable[key]?.toFixed(1) ?? "-";

        // 高亮当前位
        if (key == current) {
            td.style.color = "yellow";
        }
        // 高亮最大位
        else if (key == maxKey && key != current) {
            td.style.color = "lightgreen";
        }

        td.textContent = val;
        valueRow.appendChild(td);
    });

    // 插入 table
    table.appendChild(headerRow);
    table.appendChild(valueRow);

    // 提示文字
    const note = document.createElement("span");
    note.textContent = "*仅供参考";
    note.style.color = "yellow";
    note.style.fontSize = "12px";

    // 插入到 DOM（位置紧贴 skilltable 区块后）
    container.after(table);
    container.after(note);
    container.after(document.createElement("br"));
}

function showTalent(pubTalent,pos) {
    const talentsDiv = document.getElementsByClassName("talents");
    const tdDiv = talentsDiv[0].getElementsByTagName("td");
    if (pos === 0) {
        tdDiv[0].textContent+=pubTalent.agi+1;
        tdDiv[1].textContent+=pubTalent.set+1;
        tdDiv[2].textContent+=pubTalent.str+1;
    }
    else {
        tdDiv[0].textContent+=pubTalent.ada+1;
        tdDiv[1].textContent+=pubTalent.agi+1;
        tdDiv[2].textContent+=pubTalent.set+1;
        tdDiv[3].textContent+=pubTalent.str+1;
    }
}

function loadPlayer(id){
    $.getJSON({
        url:`/Team/Player?handler=PlayerData&playerId=${id}`,
        type:"GET"
    }, res => {
        res.player.pos = FP2POS[res.player.fp];
        let skills = decode(res.player.skills,res.player.pos);

        let fixed;
        let ratingTable;

        if(res.isOwner){
            fixed = applyXpBonus(skills,res.player.pos);
            ratingTable = buildRatingTable(fixed,res.player.pos);
            showBonusSkills(fixed,res.player.pos);
            showRating(res.player.rating/10,true);
        }else{
            let guessed = guessSkills(skills,res.player.qi,res.player.pos);
            guessed = applyXpBonus(guessed,res.player.pos);
            ratingTable = buildRatingTable(guessed,res.player.pos);

            showBonusSkills(guessed,res.player.pos);
            showRating(ratingTable[combinePos(res.player.pos)].toFixed(1),false);
        }

        showRatingTable(ratingTable,res.player.pos);
        showTalent(res.player.pubTalents,res.player.pos);
        showBirthday(res.player.birthday);
    });
}

function combinePos(pos){
    switch (pos) {
        case 0: return 0;
        case 4: return 4;
        case 5: return 5;
        case 6: return 5;
        case 8: return 8;
        case 9: return 9;
        case 10: return 9;
        case 16: return 16;
        case 17: return 17;
        case 18: return 17;
        case 32: return 32;
        case 33: return 33;
        case 34: return 33;
        case 64: return 64;
    }
}

function guessSkills(skills, qi, pos) {
    const arr = skillToArray(skills, pos);
    const expectedSum = qiToSkillSum(qi);
    const currentSum = arr.reduce((a, b) => a + b, 0);
    const adjust = (expectedSum - currentSum) / arr.length;

    const adjusted = arr.map(v => v + adjust);
    return arrayToSkill(adjusted, pos, skills);
}

function skill_to_qi(skills) {
    let qi = 0;
    for (let i = 0; i < 11; i++) {
        qi += skills[i];
    }
    return Math.trunc(Math.pow(0.045 * qi /10.0, 5));
}

function qiToSkillSum(qi) {
    const skills = Math.pow(qi, 1/5) / 0.0045;
    return Math.ceil(skills);
}

function decode(binsk, pos) {
    var skills = Uint8Array.from(atob(binsk), c => c.charCodeAt(0));
    var sk = {};
    if (pos === 0) {
        sk.Han = skills[0];
        sk.One = skills[1];
        sk.Ref = skills[2];
        sk.Aer = skills[3];
        sk.Ele = skills[4];
        sk.Jum = skills[5];
        sk.Kic = skills[6];
        sk.Thr = skills[7];
        sk.Pos = skills[8];
        sk.Sta = skills[9];
        sk.Pac = skills[10];
        sk.For = skills[11];
        sk.Rou = (skills[12] * 256 + skills[13]);
    }
    else {
        sk.Mar = skills[0];
        sk.Tak = skills[1];
        sk.Tec = skills[2];
        sk.Pas = skills[3];
        sk.Cro = skills[4];
        sk.Fin = skills[5];
        sk.Hea = skills[6];
        sk.Lon = skills[7];
        sk.Pos = skills[8];
        sk.Sta = skills[9];
        sk.Pac = skills[10];
        sk.For = skills[11];
        sk.Rou = (skills[12] * 256 + skills[13]);
    }

    return sk;
}

function xpBonus(rou){
    const xp = rou/100;
    const b = 10*(1-Math.exp(-0.0370549*xp)*(1-0.0375209*xp+0.00103853*xp**2-0.0000043796*xp**3));
    return Math.sqrt(b)/100;
}

function calcPosRating(skills,pos){
    const arr = skillToArray(skills,pos);
    const rate = RatingRate[pos];
    const rating = arr.reduce((t,v,i)=>t + v*rate[i],0);
    const sumrate = rate.reduce((a,b)=>a+b,0);
    return rating / sumrate / 10;
}

function applyXpBonus(skills,pos){
    const arr = skillToArray(skills,pos);
    const b = 1 + xpBonus(skills.Rou);
    const boosted = arr.map(v=>v*b);
    return arrayToSkill(boosted,pos,skills);
}

function buildRatingTable(skills, pos) {
    if (pos === 0) {
        // GK 只有一个位置的评分
        return { 0: calcPosRating(skills, 0) };
    }

    const POS_LIST = [4,5,8,9,16,17,32,33,64];
    const table = {};

    POS_LIST.forEach(p => {
        table[p] = calcPosRating(skills, p);
    });

    return table;
}


new MutationObserver((list,ob)=>{
    const info = document.querySelector(".infotable");
    if(info && info.firstChild){
        const id = new URL(location.href).searchParams.get("id");
        info.insertBefore(makeIdRow(id), info.firstChild);
        loadPlayer(id);
        ob.disconnect();
    }
}).observe(document.body,{childList:true,subtree:true});
