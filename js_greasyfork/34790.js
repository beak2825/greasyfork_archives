// ==UserScript==
// @name         FgoWiki Supplementary
// @version      1.13
// @description  FGO WIKI补充脚本，增加显示宝具本和技能本之前的数据
// @match        http*://fgowiki.com/guide/petdetail*
// @require      https://cdn.bootcss.com/jquery/1.9.1/jquery.min.js
// @namespace    https://greasyfork.org/users/131449
// @downloadURL https://update.greasyfork.org/scripts/34790/FgoWiki%20Supplementary.user.js
// @updateURL https://update.greasyfork.org/scripts/34790/FgoWiki%20Supplementary.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 加载远程图片路径dict
    $.getScript("https://fgo-archive.github.io/index/js/trans-wiki.js", function() {
        var id = 1;
        if (window.location.href.match(/\d+/g)) {
            id = window.location.href.match(/\d+/g)[0];
        }
        var data = readJson("https://fgo-archive.github.io/index/data/data.json", "fgoArchiveMainDataVer", "fgoArchiveMainData");
        $.each(data, function(i, servant) {
            if (servant.id == id) {
                if (servant.noblePhantasm.length > 1) {
                    insertNPTable(servant.noblePhantasm[0], servant.rarity);
                }
                if (servant.skills.length > 3) {
                    insertSkillTable(servant.skills, servant.rarity);
                }
                if (servant.hasOwnProperty("friendship")) {
                    insertFriendshipTable(servant.friendship, servant.rarity);
                }
                insertNoblePhantasmHit(servant);
                return false;
            }
        });
    });
})();

function readJson(url, verProperty, dataProperty) {
    var returnData;
    if (window.localStorage) {
        var version;
        $.ajax({
            url: "https://fgo-archive.github.io/index/data/version.json",
            type: "get",
            async: false,
            dataType: "json",
            cache: false,
            success: function(data) {
                version = data[verProperty];
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                if (window.localStorage.hasOwnProperty(verProperty)) {
                    version = window.localStorage.getItem(verProperty);
                }
            }
        });
        if (window.localStorage.hasOwnProperty(dataProperty) && window.localStorage.hasOwnProperty(verProperty) && version == window.localStorage.getItem(verProperty)) {
            returnData = JSON.parse(window.localStorage.getItem(dataProperty));
        } else {
            $.ajax({
                url: url,
                type: "get",
                async: false,
                dataType: "json",
                cache: false,
                success: function(data) {
                    window.localStorage.setItem(verProperty, version);
                    window.localStorage.setItem(dataProperty, JSON.stringify(data));
                    returnData = data;
                },
            });
        }
    } else {
        $.ajax({
            url: url,
            type: "get",
            async: false,
            dataType: "json",
            cache: true,
            success: function(data) {
                returnData = data;
            },
        });
    }
    return returnData;
}

function insertNPTable(noblePhantasm, rarity) {
    var npTable = $("table[class='info-table Skill-Text']");
    var e_table = $("<table></table>");
    e_table.addClass("info-table Skill-Text");
    var e_tr = $("<tr></tr>");
    var e_td = $("<td></td>");
    e_td.attr({
        "style": "width:20%",
        "class": "Skill-ico",
        "rowspan": "3"
    });
    e_td.append("<img src='https://cdn.fgowiki.com/wp-content/themes/umowang/images/Box/" + noblePhantasm.color + ".png'>");
    e_td.append("<p class='T_LEVEL'>" + noblePhantasm.rank + "</p>");
    e_td.append("<p class='T_TYPE'>" + noblePhantasm.type + "</p>");
    e_tr.append(e_td);
    var e_th = $("<th></th>");
    e_th.attr({
        "style": "width:40%",
        "class": "CName Databox-head Databox-head-" + rarityStyle(rarity),
    });
    e_tr.append(e_th.append(noblePhantasm.name));
    var e_th2 = $("<th></th>");
    e_th2.attr({
        "style": "width:40%",
        "class": "EName Databox-head Databox-head-" + rarityStyle(rarity),
    });
    e_tr.append(e_th2.append(noblePhantasm.ruby));
    e_table.append(e_tr);
    var e_tr2 = $("<tr></tr>");
    var e_td2 = $("<td></td>");
    e_td2.attr({
        "class": "SkillInfo",
        "colspan": "2"
    });
    createDescList(e_td2, noblePhantasm.desc);
    e_table.append(e_tr2.append(e_td2));
    npTable.before(e_table);
}

function insertSkillTable(skills, rarity) {
    var skillsTables = $("div[class='Skill-Class']").children(".info-table");
    var oldSkills = [];
    for (var i = 0; i < skills.length - 1; i++) {
        if (skills[i].num == skills[i + 1].num) {
            oldSkills.push(skills[i]);
        }
    }
    $.each(oldSkills, function(i, skill) {
        var e_table = $("<table></table>");
        e_table.addClass("info-table");
        if (skill.num == 1) {
            //删除表头
            skillsTables[0].deleteRow(0);
            e_table.append("<tr><th colspan='4' class='Databox-head  GskillT Databox-head-" + rarityStyle(rarity) + "'>固有技能</th></tr>");
        }
        var e_tr = $("<tr></tr>");
        e_tr.append("<td width='10%'><img align='left' src='https://img.fgowiki.com/mobile/images/Skill/" + skillsPath[skill.icoId] + ".png'></td>");
        var name = "";
        var rank = "";
        if (skill.name.match("(.*?) ([a-zA-Z]+.*?)")) {
            name = skill.name.match("(.*?) ([a-zA-Z]+.*?)")[1];
            rank = skill.name.match("(.*?) ([a-zA-Z]+.*?)")[2];
        } else {
            name = skill.name;
            rank = "？";
        }
        e_tr.append("<td width='40%'>" + name + "</td>");
        e_tr.append("<td width='25%'><p>固有等级：" + rank + "</p></td>");
        e_tr.append("<td width='25%'><p>冷却时间：" + skill.chargeTurn + "</p></td>");
        e_table.append(e_tr);
        var e_p = $("<p></p>");
        createDescList(e_p, skill.desc);
        e_table.append($("<tr></tr>").append($("<td colspan='4'></td>").append(e_p)));
        e_table.insertBefore(skillsTables[skill.num - 1]);
    });
}

function createDescList(e_node, data) {
    $.each(data, function(i, desc) {
        e_node.append("<div class='intro'>" + desc[0].replace(/<(.*?)>/g, "&lt;$1&gt") + "</div>");
        var numList = getNumList(desc[1]);
        var e_div = $("<div></div>");
        e_div.addClass("numList");
        for (var j in numList) {
            var e_span = $("<span></span>");
            e_span.css("width", 100 / numList.length + "%");
            e_div.append(e_span.append(numList[j]));
        }
        e_node.append($("<div class='numBox'></div>").append(e_div));
    });
}

function rarityStyle(rarity) {
    if (rarity < 1) {
        return "R";
    } else if (rarity < 3) {
        return "C";
    } else if (rarity < 4) {
        return "S";
    } else {
        return "G";
    }
}

function getNumList(numStr) {
    if (numStr === "") {
        return ["∅"];
    } else {
        return numStr.split("/");
    }
}

function insertNoblePhantasmHit(servant) {
    var e_table = $("div[class='Databox-main tablelist']").children(".info-table")[1];
    for (var i = 2; i < 6; i++) {
        e_table.rows[2].cells[i].width = "12%";
    }
    var e_th = $("<th></th>");
    e_th.addClass("Databox-head Databox-head-" + rarityStyle(servant.rarity));
    e_th.attr("width", "12%");
    e_th.append("宝具");
    e_th.insertAfter(e_table.rows[2].cells[5]);
    var e_td = $("<td></td>");
    var e_div = $("<div></div>");
    e_div.addClass("textsmall InitiativeHit");
    if (servant.noblePhantasm[0].hits < 2) {
        e_div.append(servant.noblePhantasm[0].hits + " Hit");
    } else {
        e_div.append(servant.noblePhantasm[0].hits + " Hits");
    }
    e_td.append(e_div);
    e_td.insertAfter(e_table.rows[3].cells[5]);
}

function insertFriendshipTable(friendship, rarity) {
    var e_div = $("<div></div>");
    e_div.addClass("Databox Databox-" + rarityStyle(rarity));
    var e_div2 = $("<div class='Databox-main'></div>");
    var e_table = $("<table class='info-table'></table>");
    e_table.append("<tr><th colspan='4' class='Databox-head Databox-head-" + rarityStyle(rarity) + "'>羁绊需求（单位/万）</th></tr>");
    e_table.append("<tr><td rowspan='2' width='10%'><a href='http://fgowiki.com/guide/equipdetail/" + friendship.id + "'><img align='left' src='https://cdn.fgowiki.com/fgo/equip/" + friendship.id + ".jpg'></a></td></tr>");
    var e_tr = $("<tr></tr>");
    var e_td = $("<td colspan='4'></td>");
    e_td.append("<div class='numBox'><div class='numList'><span style='width:14.28%'>1-5</span><span style='width:14.28%'>5-6</span><span style='width:14.28%'>6-7</span><span style='width:14.28%'>7-8</span><span style='width:14.28%'>8-9</span><span style='width:14.28%'>9-10</span><span style='width:14.28%'>合计</span></div></div>");
    e_td.append("<div class='numBox'><div class='numList'><span style='width:14.28%'>" + friendship.rank[0] + "</span><span style='width:14.28%'>" + friendship.rank[1] + "</span><span style='width:14.28%'>" + friendship.rank[2] + "</span><span style='width:14.28%'>" + friendship.rank[3] + "</span><span style='width:14.28%'>" + friendship.rank[4] + "</span><span style='width:14.28%'>" + friendship.rank[5] + "</span><span style='width:14.28%'>" + friendship.rank[6] + "</span></div></div>");
    e_div.append(e_div2.append(e_table.append(e_tr.append(e_td))));
    console.log(e_div);
    e_div.insertBefore($('div.Databox-main:contains("固有技能")')[0].parentNode);
}