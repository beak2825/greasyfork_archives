// ==UserScript==
// @name         FMP More Player Perform
// @description  提供队长、定位球的位置计算
// @version      0.2
// @match        https://footballmanagerproject.com/Team/Player*
// @exclude      https://footballmanagerproject.com/Team/Players*
// @license      MIT
// @namespace https://greasyfork.org/users/1304483
// @downloadURL https://update.greasyfork.org/scripts/527282/FMP%20More%20Player%20Perform.user.js
// @updateURL https://update.greasyfork.org/scripts/527282/FMP%20More%20Player%20Perform.meta.js
// ==/UserScript==

const currentUrl = window.location.href;
const urlObj = new URL(currentUrl);
const id = urlObj.searchParams.get('id');

const moreInfoDiv = document.createElement('div');
moreInfoDiv.className = 'board fmpx box';
moreInfoDiv.style.flexGrow = 0;
moreInfoDiv.style.flexBasis = '200px';

const titleDiv = document.createElement('div');
titleDiv.className = 'title';
const mainDiv = document.createElement('div');
mainDiv.className = 'main';
mainDiv.textContent = '出场信息';
titleDiv.appendChild(mainDiv)
moreInfoDiv.appendChild(titleDiv);

const infoDiv = document.createElement('div');
infoDiv.className = 'moreinfo';
infoDiv.style.color = 'white';

GetPlayersIndex(id,function(rep,skill,pos,set){
    infoDiv.innerHTML += '<span style="color:#fffa33">队长评分：</span>'
    infoDiv.innerHTML += captionIndex(rep);
    infoDiv.innerHTML += '<br>'
    infoDiv.innerHTML += '<span style="color:#fffa33">角球评分：</span>'
    infoDiv.innerHTML += cornerIndex(rep,skill,pos,set);
    infoDiv.innerHTML += '<br>'
    infoDiv.innerHTML += '<span style="color:#fffa33">任意球评分：</span>'
    infoDiv.innerHTML += freekickIndex(rep,skill,pos,set);
    infoDiv.innerHTML += '<br>'
    infoDiv.innerHTML += '<span style="color:#fffa33">点球评分：</span>'
    infoDiv.innerHTML += penaltyIndex(rep,skill,pos,set);
    infoDiv.innerHTML += '<br>'
});
moreInfoDiv.appendChild(infoDiv);

const targetElement = document.getElementById('ActionsBoard');
targetElement.parentNode.insertBefore(moreInfoDiv, targetElement);

function GetPlayersIndex(pid,callback){
    $.getJSON({
      "url": ("/Team/Player?handler=PlayerData&playerId=" + pid),
      "datatype": "json",
      "contentType": "application/json",
      "type": "GET"
    },
      function (ajaxResults) {
        ajaxResults.player.pos=fp2pos(ajaxResults.player.fp);
        var skills=decode(ajaxResults.player.skills,ajaxResults.player.pos)

        var scouts = {};
        for (var i in ajaxResults.scouts) {
          var scout = ajaxResults.scouts[i];

          scouts[scout.id] = scout;
        }
        var scoutsData = scouts;
        var reportsData = ajaxResults.reports;
        var synthReport = createRecomendationSynthesis(reportsData,scoutsData);
        callback(synthReport,skills,ajaxResults.player.pos,ajaxResults.player.pubTalents.set);
      }
    );
}

function captionIndex(rep) {
    try {
        return (rep.lea*(rep.pro*3+8-rep.agg)).toFixed(2);
    } 
    catch {
        return 'Unknown';
    }
}
function cornerIndex(rep,skills,pos,set) {
    if (pos === 0) {
        return 0;
    }
    else {
        return ((skills.Tec*0.4+skills.Cro*0.4+skills.Lon*0.2)*(1+fromSet(set))).toFixed(2);
    }
}

function freekickIndex(rep,skills,pos,set) {
    if (pos === 0) {
        return 0;
    }
    else {
        return (((skills.Tec*0.4+skills.Fin*0.4+skills.Lon*0.2)+(skills.Tec*0.48+skills.Cro*0.28+skills.Lon*0.24))*(1+fromSet(set))).toFixed(2);
    }
}

function penaltyIndex(rep,skills,pos,set) {
    if (pos === 0) {
        return (skills.Kic*(1+fromSet(set))).toFixed(2);
    }
    else {
        return ((skills.Tec*0.4+skills.Fin*0.6)*(1+fromSet(set))).toFixed(2);
    }
}


function decode(binsk, pos) {
    var skills = Uint8Array.from(atob(binsk), c => c.charCodeAt(0));

    var sk = {};

    if (pos === 0) {
        sk.Han = skills[0] / 10;
        sk.One = skills[1] / 10;
        sk.Ref = skills[2] / 10;
        sk.Aer = skills[3] / 10;
        sk.Ele = skills[4] / 10;
        sk.Jum = skills[5] / 10;
        sk.Kic = skills[6] / 10;
        sk.Thr = skills[7] / 10;
        sk.Pos = skills[8] / 10;
        sk.Sta = skills[9] / 10;
        sk.Pac = skills[10] / 10;
        sk.For = skills[11] / 10;
        sk.Rou = (skills[12] * 256 + skills[13]) / 100;
    }
    else {
        sk.Mar = skills[0] / 10;
        sk.Tak = skills[1] / 10;
        sk.Tec = skills[2] / 10;
        sk.Pas = skills[3] / 10;
        sk.Cro = skills[4] / 10;
        sk.Fin = skills[5] / 10;
        sk.Hea = skills[6] / 10;
        sk.Lon = skills[7] / 10;
        sk.Pos = skills[8] / 10;
        sk.Sta = skills[9] / 10;
        sk.Pac = skills[10] / 10;
        sk.For = skills[11] / 10;
        sk.Rou = (skills[12] * 256 + skills[13]) / 100;
    }

    return sk;
}

var skillsReq = {
      'potential': { name: 'blo'},
      'def': {name: 'def'},
      'atk': {name: 'att'},
      'blo': {name: 'blo'},
      'bst': {name: 'blo'},
      'mid': {name: 'mid'},
      'phy': {name: 'phy'},
    };

var talentsReq = {
        'pro': { name: 'psy', inv: 0},
        'lea': { name: 'psy', inv: 0},
        'agg': { name: 'psy', inv: 1},
        'inj': { name: 'phy', inv: 1},
    };

function createRecomendationSynthesis(reports, scouts) {
    var synthReport = {};
    var weights = {};

    var cnt = 0;
    for (var rep in reports) {
        var report = reports[rep];
        if (report.scoutID == null){
            continue;
        }

        cnt++;

        var scout = scouts[report.scoutID];

        if (scout == null) {
            scout = {
                psy: 128,
                att: 128,
                mid: 128,
                def: 128,
                phy: 128,
                blo: 128,
                bst: 128,
            };
        }

        for (var sk1 in skillsReq) {
            if (cnt == 1) {
                synthReport[sk1] = 0;
                weights[sk1] = 0;
            }

            if (sk1 == "bst"){
                continue;
            }

            var weight1 = 1 / (26 - scout[skillsReq[sk1].name]);
            synthReport[sk1] += report[sk1] * weight1;
            weights[sk1] += weight1;
        }

        for (var sk2 in talentsReq) {
            if (cnt == 1) {
                synthReport[sk2] = 0;
                weights[sk2] = 0;
            }

            var weight2 = 1 / (26 - scout[talentsReq[sk2].name]);
            synthReport[sk2] += report.talents[sk2] * weight2;
            weights[sk2] += weight2;
        }
    }

    if (cnt == 0) {
        return;
    }

    for (var sk3 in skillsReq) {
        if (weights[sk3] == 0){
            continue; // Avoid division by 0
        }
        synthReport[sk3] /= weights[sk3];
    }
    for (var sk4 in talentsReq) {
        synthReport[sk4] /= weights[sk4];
    }

    return synthReport;
}


function fp2pos(fp) {
  switch (fp) {
    case "GK": return 0;
    case "DC": return 4;
    case "DL": return 5;
    case "DR": return 6;
    case "DMC": return 8;
    case "DML": return 9;
    case "DMR": return 10;
    case "MC": return 16;
    case "ML": return 17;
    case "MR": return 18;
    case "OMC": return 32;
    case "OML": return 33;
    case "OMR": return 34;
    case "FC": return 64;
  }

  return -1;
}

function describeTalent(skill, val) {
    var showval = "";
    if (skill == 'agg') {
        showval = fromAggressivity(val);
    } else if (skill == 'inj') {
        showval = fromInjury(val);
    } else if (skill == 'pro') {
        showval = fromProfessionalism(val);
    } else if (skill == 'lea') {
        showval = fromLeadership(val);
    } else {
        showval = fromTalents4(val);
    }

    return "<span title='" + talentsReq[skill].title + "'>" + talentsReq[skill].short + ": " + showval + "</span>";
}

function describeSkill(skill, val) {
    var showval = "";
    if (skill == 'blo') {
        showval = fromBloom(val);
    }
    else if(skill == 'bst') {
        showval = fromBloomStatus(val);
    }
    else {
        showval = fromLevel(val);
    }

    return "<span title='" + skillsReq[skill].title + "'>" + skillsReq[skill].short + ": " + showval + "</span>";
}

function fromLevel(skill) {
    skill = Math.round(skill);
    switch (skill) {
        case 0: return '7-';
        case 1: return '7-';
        case 2: return '7-';
        case 3: return '7-';
        case 4: return '8-10';
        case 5: return '11-13';
        case 6: return '14-16';
        case 7: return '17-19';
        case 8: return '20-21';
        case 9: return '22-23';
        case 10: return '24+';
    }
}

function fromTalents4(skill) {
    skill = Math.round(skill);
    switch (skill) {
        case 0: return 1;
        case 1: return 2;
        case 2: return 3;
        case 3: return 4;
    }
}

function fromAggressivity(skill) {
    skill = Math.round(skill);
    switch (skill) {
        case 0: return 8;
        case 1: return 7;
        case 2: return 6;
        case 3: return 5;
        case 4: return 4;
        case 5: return 3;
        case 6: return 2;
        case 7: return 1;
    }
}

function fromProfessionalism(skill) {
    skill = Math.round(skill);
    switch (skill) {
        case 0: return 1;
        case 1: return 2;
        case 2: return 3;
        case 3: return 4;
        case 4: return 5;
        case 5: return 6;
        case 6: return 7;
        case 7: return 8;
    }
}

function fromLeadership(skill) {
    skill = Math.round(skill);
    switch (skill) {
        case 0: return 1;
        case 1: return 2;
        case 2: return 3;
        case 3: return 4;
        case 4: return 5;
        case 5: return 6;
        case 6: return 7;
        case 7: return 8;
    }
}

function fromSet(skill) {
    switch (skill) {
        case 0: return 0;
        case 1: return 0.044;
        case 2: return 0.177;
        case 3: return 0.4;
    }
}

function fromInjury(skill) {
    skill = Math.round(skill);
    switch (skill) {
        case 0: return 1;
        case 1: return 2;
        case 2: return 3;
        case 3: return 4;
        case 4: return 5;
        case 5: return 6;
        case 6: return 7;
        case 7: return 8;
    }
}

function fromBloom(bloom) {
    bloom = Math.round(bloom);
    switch (bloom) {
        case 0: return '非常早(<15)';
        case 1: return "早熟(15+)";
        case 2: return "正常(17+)";
        case 3: return "晚熟(19+)";
        case 4: return "非常晚(21+)";
    }
}

function fromBloomStatus(bloom) {
    bloom = Math.round(bloom);
    switch (bloom) {
        case 0: return "没有报告";
        case 1: return "没有快速成长";
        case 2: return "初始快速成长";
        case 3: return "中间快速成长";
        case 4: return "最后快速成长";
        case 5: return "快速成长完成";
    }
}

function SeprateNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}