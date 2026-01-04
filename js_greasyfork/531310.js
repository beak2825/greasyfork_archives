// ==UserScript==
// @name         FMP Lineup Helper
// @version      0.4
// @description  help you to lineup
// @match        https://footballmanagerproject.com/Team/Lineup
// @match        https://www.footballmanagerproject.com/Team/Lineup
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1304483
// @downloadURL https://update.greasyfork.org/scripts/531310/FMP%20Lineup%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/531310/FMP%20Lineup%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const observer = new MutationObserver((mutations) => {
        const teamElement = document.querySelector('.dropdown-item.selected');
        if (teamElement) {
            const teamid = teamElement.getAttribute('teamid');
            showResult(teamid);
            observer.disconnect(); // 停止监听
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();

function showResult(id){
    $.getJSON({
        "url": ("/Team/Lineup?handler=LineupData&id="+id),
        "datatype": "json",
        "contentType": "application/json",
        "type": "GET"
    },function (ajaxResults) {
        const players=[...ajaxResults.field,...ajaxResults.reserves,...ajaxResults.tribune];
        players.forEach((player)=>{
            const skill=decode(player.info.skills,player.info.fPn);
            $.getJSON({
                "url": ("/Team/Player?handler=PlayerData&playerId=" + player.info.id),
                "datatype": "json",
                "contentType": "application/json",
                "type": "GET"
            },function (ajaxResultplayer) {
                var scouts = {};
                for (var i in ajaxResultplayer.scouts) {
                    var scout = ajaxResultplayer.scouts[i];

                    scouts[scout.id] = scout;
                }
                var scoutsData = scouts;
                var reportsData = ajaxResultplayer.reports;
                var synthReport = createRecomendationSynthesis(reportsData,scoutsData);
                player.info.allRatings.Captain=captionIndex(synthReport)*10;
                player.info.allRatings.Corner=cornerIndex(skill,player.info.fPn,ajaxResultplayer.player.pubTalents.set)*10;
                player.info.allRatings.Freekick=freekickIndex(skill,player.info.fPn,ajaxResultplayer.player.pubTalents.set)*10;
                player.info.allRatings.Penalty=penaltyIndex(skill,player.info.fPn,ajaxResultplayer.player.pubTalents.set)*10;
            });
        });
        const compareDiv=document.createElement('div');
        compareDiv.className='fmpx board box';
        const mainboard=document.getElementById('mainBoard');
        const secondDiv = mainboard.children[1]; // 第二个子元素
        // 在第二个div的下一个兄弟节点前插入，即在第二个div后插入
        mainboard.insertBefore(compareDiv, secondDiv.nextSibling);

        const contentDiv=document.createElement('div');
        compareDiv.appendChild(contentDiv);

        const titleDiv=document.createElement('div');
        titleDiv.className='title';
        titleDiv.innerHTML=`<div class='main'>球员比较</div>`
        contentDiv.appendChild(titleDiv);

        let selectDiv=document.createElement('div');
        selectDiv.className='item';
        selectDiv.innerHTML=`<span class='combolist' style='color:yellowgreen;'>球员属性</span>
        <span class='combolist'>`+createSelection(posList,"attCom")+`</span>`

        contentDiv.appendChild(selectDiv);

        const listTable=document.createElement('table');
        listTable.className='display disable-select table-striped table-hover list-table comp';
        listTable.id='listTable';
        contentDiv.appendChild(listTable);
        fillHeaderList();
        activateSelect($('#attCom'));
        selectItem("DC", "#attCom");
        makeTable(sortAtt(players,"DC"),"DC");
        if (isTouchUi)
            sliceTable('#listTable', trbListToShowWithTouchUI);
        else
            sliceTable('#listTable', trbListToShowWithCursorUI);
        $("#attCom").click(function () {
            $("#listTable").empty();
            fillHeaderList();
            const attName=val2att(parseInt(selectedItem(posList, "#attCom")));
            const players_sort=sortAtt(players,attName);
            makeTable(players_sort,attName);
            if (isTouchUi)
                sliceTable('#listTable', trbListToShowWithTouchUI);
            else
                sliceTable('#listTable', trbListToShowWithCursorUI);
        })

    });
}

function createSelection(list,id){
    let html='<div class="fmpselect" style="display:inline-block;width:120px;" id='+id+'><select>'
    for(let i=0;i<list.length;i++){
        html+='<option value='+i+'>'+list[i]+'</option>';
    }
    html+=`</select></div>`
    return html
}
function fillHeaderList() {
    const Titles={ "shirt": { "head": "#", "tip": null },
                  "name": { "head": trxt["colTitles.trbList.name.head"], "tip": trxt["colTitles.trbList.name.tip"] },
                  "fp": { "head": trxt["colTitles.trbList.fp.head"], "tip": trxt["colTitles.trbList.fp.tip"] },
                  "rating": { "head": trxt["colTitles.trbList.rating.head"], "tip": trxt["colTitles.trbList.rating.tip"] },
                  "form": { "head": trxt["colTitles.trbList.form.head"], "tip": trxt["colTitles.trbList.form.tip"] },
                 }
    $(listTable).append($("<thead>")
                        .append(titles())
                       );

    function titles() {
        var head = $("<tr>");
        for (let title in Titles) {
            var headTitle = Titles[title];
            var th = $("<th>")
            .text(headTitle.head)
            .addClass("fmp-listcol")
            .attr("cid", title)
            .attr('title', headTitle.tip);

            if (headTitle.class != null) {
                th.addClass(headTitle.class);
            }

            head.append(th);
        }

        return head;
    }
}

function makeTable(players,attName){
    const table = $('#listTable');
    for (var item in players) {
        var player = players[item].info;
        if (player.name == undefined)
            continue;
        var row = $('<tr>')
        .addClass('shd') // Show hide class
        .attr("id", "coRow_" + player.id)
        .append($('<td>')
                .append(renderShirt($('<div>'), player)
                        .attr("irow", "coRow_" + player.id)
                       )
               )
        .append($('<td>')
                .addClass('left')
                .html('<div id="' + player.id + '"><a class="name" href=/Team/Player?id=' + player.id + '>'
                      + shortName(player) + ' '
                      + cardImage(player.ban) + ' '
                      + injImage(player.inj)
                      + '</div>')
               )
        .append($('<td>')
                .addClass('left')
                .html(fpIcon(pos2fp(player.fPn)) + footIcon(player.foot))
               )
        .append($('<td>')
                .addClass('left')
                .append(starRating(player.allRatings[attName] / 10, true))
               )
        .append($('<td>')
                .addClass('right')
                .html(barForm(player.form, 24, "pl_skills for table"))
               );
        table.append(row);

        //$('#listTable.fmp-listcol').click(function () {
        //    let sortCol = this.attributes["cid"].value;
        //});
    }
}

function sortAtt(players,attName){
    players.sort((a,b)=>b.info.allRatings[attName]-a.info.allRatings[attName])
    return players;
}

const posList=[trxt["fp.name.GK"],
               trxt["fp.name.DC"],
               trxt["fp.name.DL"],
               trxt["fp.name.DR"],
               trxt["fp.name.DMC"],
               trxt["fp.name.DML"],
               trxt["fp.name.DMR"],
               trxt["fp.name.MC"],
               trxt["fp.name.ML"],
               trxt["fp.name.MR"],
               trxt["fp.name.OMC"],
               trxt["fp.name.OML"],
               trxt["fp.name.OMR"],
               trxt["fp.name.FC"],
               trxt["rule.btn.captn"],
               trxt["rule.btn.ckick"],
               trxt["rule.btn.fkick"],
               trxt["rule.btn.pkick"]
              ];

function val2att(val) {
  switch (val) {
    case 0: return "GK";
    case 1: return "DC";
    case 2: return "DL";
    case 3: return "DR";
    case 4: return "DMC";
    case 5: return "DML";
    case 6: return "DMR";
    case 7: return "MC";
    case 8: return "ML";
    case 9: return "MR";
    case 10: return "OMC";
    case 11: return "OML";
    case 12: return "OMR";
    case 13: return "FC";
    case 14: return "Captain";
    case 15: return "Corner";
    case 16: return "Freekick";
    case 17: return "Penalty";
  }
  return "";
}

function captionIndex(rep) {
    try {
        return (rep.lea*(8-0.5*rep.agg)+0.5*rep.agg)/2;
    }
    catch {
        return 0;
    }
}
function cornerIndex(skills,pos,set) {
    if (pos === 0) {
        return skills.Kic*(1+fromSet(set))*0.6;
    }
    else {
        return (skills.Tec+skills.Cro+skills.Lon*0.5)/2.5*(1+fromSet(set));
    }
}

function freekickIndex(skills,pos,set) {
    if (pos === 0) {
        return skills.Kic*(1+fromSet(set))*0.6;
    }
    else {
        return ((skills.Tec+skills.Fin+skills.Lon*0.5)+(skills.Tec+skills.Cro+skills.Lon*0.5))/2/2.5*(1+fromSet(set));
    }
}

function penaltyIndex(skills,pos,set) {
    if (pos === 0) {
        return skills.Kic*(1+fromSet(set))*0.6;
    }
    else {
        return (skills.Tec+skills.Fin*1.5)/2.5*(1+fromSet(set));
    }
}

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

function fromSet(skill) {
    switch (skill) {
        case 0: return 0;
        case 1: return 0.089;
        case 2: return 0.35;
        case 3: return 0.8;
    }
}
