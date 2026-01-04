// ==UserScript==
// @name        kancolle-db Translator
// @namespace
// @version     0.05
// @description kancolle-db.net translator
// @match       http://*.kancolle-db.net/*
// @match       https://*.kancolle-db.net/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require     https://greasyfork.org/scripts/31940-waitforkeyelements/code/waitForKeyElements.js?version=209282
// @namespace https://greasyfork.org/users/166183
// @downloadURL https://update.greasyfork.org/scripts/37215/kancolle-db%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/37215/kancolle-db%20Translator.meta.js
// ==/UserScript==

var translations = {
    misc: {
        "■ メニュー": "■ Menu",
        "■ 艦娘": "■ Ship",
        "■ 装備": "■ Equipment",
        "■ 海域": "■ Area",
        "戦艦": "Battleship",
        "航空戦艦": "Aviation Battleship",
        "補給艦": "Fleet Oiler",
        "練習巡洋艦": "Training Cruiser",
        "潜水母艦": "Submarine Tender",
        "工作艦": "Repair Ship",
        "装甲空母": "Armored Carrier",
        "揚陸艦": "Amphibious Assault Ship",
        "水上機母艦": "Seaplane Tender",
        "潜水空母": "Aircraft Carrying Submarine",
        "潜水艦": "Submarine",
        "正規空母": "Aircraft Carrier",
        "軽空母": "Light Aircraft Carrier",
        "重巡洋艦": "Heavy Cruiser",
        "航空巡洋艦": "Aviation Cruiser",
        "軽巡洋艦": "Light Cruiser",
        "重雷装巡洋艦": "Torpedo Cruiser",
        "駆逐艦": "Destroyer",
        "海防艦": "Coastal Defense Ship",
        "主砲・副砲": "Main/Secondary Gun",
        "魚雷": "Torpedo",
        "艦載機": "Carrier-based Aircraft",
        "弾薬・機銃": "Shell / Anti-Air Gun",
        "偵察機・電探": "Reconnaissance Plane / Radar",
        "缶・タービン・バルジ": "Engine / Anti-Torpedo Bulge",
        "爆雷・ソナー": "Depth Charge / Sonar",
        "その他": "Other",
        "装備開発": "Equipment",
        "艦娘建造(通常)": "Ships (Normal)",
        "艦娘建造(大型)": "Ships (LSC)",
        "1:鎮守府海域": "World 1",
        "2:南西諸島海域": "World 2",
        "3:北方海域": "World 3",
        "4:西方海域": "World 4",
        "5:南方海域": "World 5",
        "6:中部海域": "World 6",
        "2013秋E:決戦！鉄底海峡を抜けて！": "Spring 2013",
        "2013冬E:迎撃！霧の艦隊": "Summer 2013",
        "2014春E:索敵機発艦、始め！": "Spring 2014",
        "2014夏E:AL / MI作戦": "Summer 2014",
        "2014秋E:発動！渾作戦": "Fall 2014",
        "2015冬E:迎撃！トラック泊地強襲": "Winter 2015",
        "2015春E:発令！第十一号作戦": "Spring 2015",
        "2015夏E:反撃！第二次SN作戦": "Summer 2015",
        "2015秋E:突入！海上輸送作戦": "Fall 2015",
        "2016冬E:出撃！礼号作戦": "Winter 2016",
        "2016春E:開設！基地航空隊": "Spring 2016",
        "2016夏E:迎撃！第二次マレー沖海戦": "Summer 2016",
        "2016秋E:発令！艦隊作戦第三法": "Fall 2016",
        "2017冬E:偵察戦力緊急展開！「光」作戦": "Winter 2017",
        "2017春E:出撃！北東方面 第五艦隊": "Spring 2017",
        "2017夏E:西方再打通！欧州救援作戦": "Summer 2017"
    },
    headers: {
        "投入資材": "Recipe",
        "件数": "Attempts",
        "秘書艦\nLv範囲": "FS Lv Range",
        "司令官\nLv範囲": "HQ Lv Range",
        "確率": "Probability",
        "比率": "Probability",
        "母数": "Denominator",
        "秘書艦種別": "Flagship",
        "開発資材\n100/20/1": "Development Materials\n100/20/1",
        "装備": "Equipment",
        "海域": "Area",
        "敵艦隊": "Enemy Fleet"
    }
};

function getShips() {
    return $.ajax({
        dataType: "json",
        url: "https://gitcdn.xyz/repo/KC3Kai/kc3-translations/master/data/en/ships.json",
        cache: true
    });
}

function getItems() {
    return $.ajax({
        dataType: "json",
        url: "https://gitcdn.xyz/repo/KC3Kai/kc3-translations/master/data/en/items.json",
        cache: true
    });
}

function loadTranslations() {
    $.when(getShips(), getItems()).done(function(ships, items) {
        translations.ships = ships[0];
        translations.ships["Commandant"] = "Commandant Teste";
        translations.ships["Luigi"] = "Luigi Torelli";
        translations.ships["Graf"] = "Graf Zeppelin";
        translations.ships["Ark"] = "Ark Royal";
        translations.ships["千歳航"] = "Chitose";
        translations.ships["千代田航"] = "Chiyoda";
        translations.ships["Prinz"] = "Prinz Eugen";
        translations.ships["(无掉落)"] = "(No drop)";
        translations.items = items[0];
        translations.items["(失敗)"] = "Failure";
        translateSidebar();
    });
}

function getAllCaptureGroups(str, reg) {
    var results = [];
    var match = null;

    while ((match = reg.exec(str)) !== null) {
        match.shift();

        var cleanedMatch = match
            .filter(function(group){
                return group !== undefined;
            })
            .map(function(group){
                return group.trim();
            });

        results.push(cleanedMatch);
    }
    return results;
}

function translateSidebar() {
    $('.main_menu').each(function() {
        if (translations.misc.hasOwnProperty(this.innerText))
            this.innerText = translations.misc[this.innerText];
    });
    $('.ship').each(function() {
        var names = this.innerText;
        names = names.split(" ");
        if (translations.ships.hasOwnProperty(names[0])) {
            this.innerText = translations.ships[names[0]];
        }
    });
    $('.item').each(function() {
        if (translations.items.hasOwnProperty(this.innerText)) {
            this.innerText = translations.items[this.innerText];
        }
    });

    $('#menu .main_menu').css({'width': '100%'});
    $('#left_frame').css({
        'width': '17em',
        'overflow': 'hidden',
        'overflow-y': 'scroll'
    });
}


function translateRow(e) {
    var child = $(e).children(":first");

    if (translations.ships.hasOwnProperty($(child).text())) {
        $(child).text(translations.ships[$(child).text()]);
    }
    if (translations.items.hasOwnProperty($(child).text())) {
        $(child).text(translations.items[$(child).text()]);
    }

    var translatedSubstrs = [];

    var substrs =
        getAllCaptureGroups(e.lastChild.innerText, /((?:.[^(]+)(?:\(\d+\)))/g)
        .map(function(grp){
            return grp[0];
        });

    for (var i = 0, l = substrs.length; i < l; i++) {
        var strArr = substrs[i].split('(');
        var jpText = strArr[0];
        var numText = '(' + strArr[1];

        if (translations.misc.hasOwnProperty(jpText)) {
            translatedSubstrs.push(
                translations.misc[jpText] + numText);
        }
        else {
            translatedSubstrs.push(substrs[i]);
        }
    }
    e.lastChild.innerText = translatedSubstrs.join(' ');
}

function translateTables() {
    waitForKeyElements('.tablesorter', function() {
        $('.header').each(function() {
            if (translations.headers.hasOwnProperty(this.innerText)) {
                this.innerText = translations.headers[this.innerText];
            }
        });

        $('.tablesorter tbody tr').each(function(index, e){
            setTimeout(function(){
                translateRow(e);
            }, 0);
        });
        $('.tablesorter thead th').css({
            'min-width': '105px',
            'padding': '5px 2px'
        });
    });
}

loadTranslations();
$('.sub_menu > a').on('click.translateTables', translateTables);