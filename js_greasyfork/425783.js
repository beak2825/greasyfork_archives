// ==UserScript==
// @name         meatmemo
// @namespace    http://mobajinro.s178.xrea.com/wakamemo/
// @version      2.0.0
// @description  わかめて上で動作するわかめてメモのようなものです。
// @author       udop_
// @match        http://jinrou.dip.jp/~jinrou/cgi_jinro.cgi
// @match        http://61.215.66.131/~jinrou/cgi_jinro.cgi
// @match        http://www7a.biglobe.ne.jp/~kuri/cgi_jinro.cgi
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/425783/meatmemo.user.js
// @updateURL https://update.greasyfork.org/scripts/425783/meatmemo.meta.js
// ==/UserScript==

;(function ($) {
    "use strict";
    Array.prototype.fillundef = function (def, lastindex) {
        lastindex = lastindex + 1 || this.length;
        for (let i = 0; i < lastindex; i++) {
            if (this[i] === null) {
                this[i] = JSON.parse(JSON.stringify(def));
            }
        }
    };
    function createSelectBox(option, selected, attr) {
        let attrtext = "";
        for (let k in attr) {
            attrtext = attrtext + ` ${k}="${attr[k]}"`;
        }
        let s = `<select${attrtext}>`;
        for (let i in option) {
            let issl = i == selected ? "selected" : "";
            s += `<option value="${i}" ${issl}>${option[i]}</option>`;
        }
        s += "</select>";
        return s;
    }
    var COLORLIST = {
        0: "選択▼",
        1: "明灰",
        2: "暗灰",
        3: "黄色",
        4: "オレンジ",
        5: "赤",
        6: "水色",
        7: "青",
        8: "黄緑",
        9: "紫",
        10: "桃色",
        11: "肌色",
        12: "茶色",
        13: "緑",
        14: "若草色",
        15: "真紅",
        16: "薄茶色",
        17: "藍色",
        18: "蒼",
        19: "ピンク",
        20: "銀色",
        21: "薄紫",
        22: "象牙色",
        23: "黒",
    };
    const joblist = {
        gray: "",
        fortune: "占い",
        necro: "霊能",
        share: "共有",
        guard: "狩人",
        cat: "猫又",
        beast: "人外",
    };
    const reasoninglist = {
        gray: "",
        real: "真",
        fake: "偽",
        villager: "村人",
        madman: "狂人",
        wolf: "人狼",
        fox: "妖狐",
    };
    const resultlist = { notinput: "", white: "○", black: "●" };
    const jobinitial = {
        fortune: "占",
        necro: "霊",
        share: "共",
        cat: "猫",
        guard: "狩",
        wolf: "狼",
        madman: "狂",
        fox: "狐",
        villager: "村",
        real: "真",
        fake: "偽",
        beast: "外",
        gray: "",
    };
    const themeList = {
        crimson: { main: "crimson", sub: "#EC365A" },
        darkorange: { main: "darkorange", sub: "#FF9F32" },
        darkgreen: { main: "darkgreen", sub: "#009300" },
        navy: { main: "navy", sub: "#0000b2" },
        purple: { main: "purple", sub: "#B200B2" },
        sienna: { main: "sienna", sub: "#C66538" },
    };
    const reasonflavor = { bite: "無残", note: "デスノ", exec: "処刑", sudden: "突然死" };
    const settingDefault = {
        rewrite_css: {
            value: "yes",
            option: { yes: "はい", no: "いいえ" },
            name: "見た目を変更する",
        },
        auto_import_log: {
            value: "onetime",
            option: { none: "しない", onetime: "投票時", alltime: "常時" },
            name: "自動ログ取得のタイミング",
        },
        alert_vote: {
            value: "yes",
            name: "未投票時に警告する",
            option: { yes: "はい", no: "いいえ" },
        },
        send_support: {
            value: "ctrl",
            name: "支援キー+ENTERで送信",
            option: { none: "しない", ctrl: "CTRL", shift: "SHIFT" },
        },
        autoreload_interval: {
            value: "30",
            name: "自動更新(観戦時のみ)",
            option: { 10: "10秒", 20: "20秒", 30: "30秒", 60: "60分" },
        },
        theme_color: {
            value: "navy",
            name: "テーマカラー",
            option: {
                crimson: "紅",
                darkorange: "オレンジ",
                darkgreen: "緑",
                navy: "蒼",
                purple: "紫",
                sienna: "茶",
            },
        },
        layout: {
            value: "no",
            name: "表を横に並べる(横幅と相談)",
            option: { yes: "はい", no: "いいえ" },
        },
        grayregion: {
            value: "no",
            name: "人外と推理した占い師の結果は<br>完グレ判定に使用しない",
            option: { yes: "はい", no: "いいえ" },
        },
        coloringName: {
            value: "no",
            name: "役職で色分けする(試験運用)",
            option: { yes: "はい", no: "いいえ" },
        },
    };
    const nameColor = {
        black: "なし",
        red: "赤",
        pink: "ピンク",
        blue: "青",
        green: "緑",
        purple: "紫",
        brown: "茶",
        gaming: "虹色",
    };
    const colorSettingDefault = {
        gray: {
            value: "black",
            name: "グレー",
            option: nameColor,
        },
        fortune: {
            value: "black",
            name: "占い",
            option: nameColor,
        },
        necro: {
            value: "black",
            name: "霊能",
            option: nameColor,
        },
        share: {
            value: "black",
            name: "共有",
            option: nameColor,
        },
        guard: {
            value: "black",
            name: "狩人",
            option: nameColor,
        },
        cat: {
            value: "black",
            name: "猫又",
            option: nameColor,
        },
        beast: {
            value: "black",
            name: "人外",
            option: nameColor,
        },
    };
    class Tr {
        constructor(id, cl) {
            this.id = id ? `id="${id}"` : "";
            this.cl = cl ? `class="${cl}"` : "";
            this.tds = [];
        }
        add(val, cl, colspan) {
            let c = cl ? `class='${cl}'` : "";
            let d = colspan ? `colspan=${colspan}` : "";
            let td = `<td ${c} ${d}>${val}</td>`;
            this.tds.push(td);
        }
        text() {
            let tds = this.tds.join("");
            let tr = `<tr ${this.id} ${this.cl}>${tds}</tr>`;
            return tr;
        }
        appendTo(jQueryObject) {
            jQueryObject.append(this.text());
        }
    }
    class MeatMemo {
        constructor(serverName) {
            this.serverName = serverName || "wakamete";
            this.playerManager = new PlayerManager(this);
            this.log = new LogManager(this);
            this.setting = new Setting(this);
            this.colorSetting = new ColorSetting(this);
            this.random = new Random(this);
            this.style = new Style(this);
            this.utility = new Utility(this);
            this.filterSetting = { show: "All", input: "simple" };
            this.isAutoReload = false;
            this.newestImportDay = 0;
            this.init();
        }
        init() {
            this.load();
            this.prepare();
            this.setting.init();
            this.colorSetting.init();
            this.style.injection();
            this.random.init();
            $(() => {
                this.on();
                this.utility.init();
            });
        }
        get playerNum() {
            this.playerManager.import();
            return this.playerManager.list.length;
        }
        settingIs(key, value = "yes") {
            return this.setting.options[key].value == value;
        }
        settingValue(key) {
            return this.setting.options[key].value;
        }
        prepare() {
            let container = `
    <div id="memoContainer">
    
    <div id="memoMenu">
        <div class='button' id='importButton'>ログの取り込み</div>
        <div class='button' id='resetButton'>リセット</div>
        <div class='button' id='reloadButton'>更新</div>
    </div>
    
    <div id="memoTab">
        <div class='tab active' data-value='log'>発言ログ</div>
        <div class='tab' data-value='vote'>投票履歴</div>
    </div>
    
    <div id="memoBody">
    
    <div id="logArea">
    
        <div id="playerInfoArea">
            <table id="playerInfoTable"></table>
        </div>
    
        <div id="buttonArea">
            <div>絞り込み
            <div class='select filter' data-value='All'>全員表示</div>
            <div class='select filter' data-value='Alive'>生存+役職のみ</div>
            </div>
    
            <div>役職入力
            <div class='select inputmode' data-value='none'>なし</div>
            <div class='select inputmode' data-value='simple'>最新のみ</div>
            <div class='select inputmode' data-value='full'>全日</div>
            </div>
        </div>
    
        <div id="discussLogArea">
            <table id="discussLogTable"></table>
        </div>
    
    </div>
    
    <div id="voteArea">
        <table id="voteTable"></table>
        <table id="summaryTable"></table>
    </div>
    
    </div>
    
    </div>
            `;
            let float = `
            <div id="floatButtonArea">
                <div id='toolArea'>
                <a>ツール</a>
                <div id='toolArea_hid'></div>
                </div>
    
                <div>
                    <a id='toggleButton'>メモ表示/非表示</a>
                </div>
            </div>
            `;
            $("body").append(container).append(float);
        }
        autoImport() {
            if (this.settingIs("auto_import_log", "alltime")) {
                this.import();
            }
            else if (this.settingIs("auto_import_log", "onetime")) {
                let today = this.today;
                if (today > this.newestImportDay && /<font size="\+2">投票/.test($("body").html())) {
                    this.newestImportDay = today;
                    this.import();
                }
            }
        }
        import() {
            this.playerManager.import();
            this.log.import();
            this.save();
        }
        refresh() {
            this.playerManager.refresh();
            this.log.refresh();
        }
        switchDispArea(mode) {
            $("div.tab").removeClass("active");
            $(`div.tab[data-value=${mode}]`).addClass("active");
            $("#memoBody > div").hide();
            $(`#${mode}Area`).show();
        }
        reset() {
            this.playerManager.reset();
            this.log.reset();
        }
        switchAliveFilter(mode) {
            mode = mode || this.filterSetting.show;
            this.filterSetting.show = mode;
            $("div.select.filter").removeClass("active");
            $(`div.select.filter[data-value=${mode}]`).addClass("active");
            this.playerManager.filter(mode);
            this.save();
        }
        switchInputMode(mode) {
            mode = mode || this.filterSetting.input;
            this.filterSetting.input = mode;
            $("div.select.inputmode").removeClass("active");
            $(`div.select.inputmode[data-value=${mode}]`).addClass("active");
            let newestDay = this.newestDay;
            for (var day = 1; day <= newestDay; day++) {
                if (mode == "full" || (mode == "simple" && day == newestDay)) {
                    $("#result_" + day).show();
                }
                else {
                    $("#result_" + day).hide();
                }
            }
            this.save();
        }
        on() {
            $("table").eq(1).attr("id", "w_player");
            $("table[cellspacing=0]").eq(-1).attr("id", "w_textarea");
            $("table[cellpadding=0]").not(".CLSTABLE2").last().attr("id", "w_discuss");
            $("table[cellspacing=0]").eq(0).attr("id", "w_info");
            $("table[cellspacing=0]").eq(-2).attr("id", "w_command");
            let voicebutton = [
                "<td class='voiceloud'>",
                "<div class='voice' data-value='MSG'>普</div>",
                "<div class='voice' data-value='MSG2'><strong>強</strong></div>",
                "<div class='voice' data-value='MSG3'><span style='color:#6666ee;'>弱</span></div>",
                "</td>",
            ].join("");
            let submitbutton = "<td><input type='submit' value='行動/更新' style='height:100px; width:150px;'></td>";
            $("#w_textarea").find("td:last").after(submitbutton).after(voicebutton);
            this.switchInputMode();
            this.switchAliveFilter();
            let _this = this;
            $("#toggleButton").on("click", () => {
                $("#memoContainer").toggle();
            });
            $("#importButton").on("click", () => {
                this.import();
                this.refresh();
            });
            $("#resetButton").on("click", () => {
                if (!window.confirm("ログをすべてリセットします。本当によろしいですか？"))
                    return false;
                this.reset();
                this.refresh();
            });
            $("#reloadButton").on("click", function () {
                $("textarea").val("");
                document.forms[0].submit();
            });
            $("div.tab").on("click", function () {
                let mode = $(this).data("value");
                _this.switchDispArea(mode);
            });
            $("div.select.filter").on("click", function () {
                let mode = $(this).data("value");
                _this.switchAliveFilter(mode);
            });
            $("div.select.inputmode").on("click", function () {
                let mode = $(this).data("value");
                _this.switchInputMode(mode);
            });
            $("#toolArea").hover(() => {
                $("#toolArea_hid").show();
            }, () => {
                $("#toolArea_hid").hide();
            });
            $("textarea").eq(0).focus();
            $("div.voice").on("click", function () {
                $("select").eq(0).val($(this).data("value"));
                $("div.voice").removeClass("voice_selected");
                $(this).addClass("voice_selected");
            });
            $(window).on("keydown", function (e) {
                if (e.keyCode == 27) {
                    $("#memoContainer").hide();
                }
            });
            this.refresh();
        }
        toggleAutoReload() {
            this.isAutoReload = !this.isAutoReload;
            this.save();
        }
        get villageNo() {
            return $("title").text().slice(0, 6);
        }
        load() {
            let sdata = localStorage.getItem("memodata");
            if (!sdata)
                return false;
            let memodata = JSON.parse(sdata);
            this.isAutoReload = memodata.isAutoReload;
            if (memodata.villageNo != this.villageNo)
                return false;
            this.playerManager.load(memodata.playerInfo);
            this.log.load(memodata.discussLog);
            if (memodata.filterSetting) {
                this.filterSetting = memodata.filterSetting;
            }
            this.newestImportDay = memodata.newestImportDay || 0;
            this.save();
        }
        save() {
            let data = {
                villageNo: this.villageNo,
                playerInfo: this.playerManager.forSave(),
                discussLog: this.log.forSave(),
                filterSetting: this.filterSetting,
                isAutoReload: this.isAutoReload,
                newestImportDay: this.newestImportDay,
            };
            localStorage.setItem("memodata", JSON.stringify(data));
        }
        filterLog(no = 99, day = 99) {
            if (no < 99) {
                $("#discussLogTable tr").hide();
                $("tr.systemlog").show();
                $("tr.talk_player" + no).show();
            }
            else {
                $("#discussLogTable tr").show();
            }
            if (day < 99) {
                $("#discussLogTable tbody").hide();
                $("#log_day" + day).show();
            }
            else {
                $("#discussLogTable tbody").show();
            }
        }
        get today() {
            var day = /<font size="\+2">(\d{1,2})/.exec($("body").html());
            return day ? +day[1] - 1 : 0;
        }
        get newestDay() {
            return Math.max(this.today, this.log.list.length - 1);
        }
        get isDaytime() {
            return $("body").attr("bgcolor") != "#000000";
        }
        get isStart() {
            return this.log.list.length >= 2;
        }
    }
    class Player {
        constructor(data) {
            this.no = data.no || 0;
            this.name = data.name || "";
            this.vital = data.vital || "alive";
            this.job = data.job || "gray";
            this.reasoning = data.reasoning || "gray";
            this.jobresult = data.jobresult || [];
            this.vote = data.vote || [];
            this.death = data.death || { reason: null, day: null, cantco: 99 };
        }
        static wakameteHTMLof(no, html) {
            let name = html.split("<br>")[0];
            let vital = /生存中/.test(html) ? "alive" : "death";
            return new Player({
                no: no,
                name: name,
                vital: vital,
            });
        }
        forSave() {
            return {
                name: this.name,
                no: this.no,
                vital: this.vital,
                job: this.job,
                reasoning: this.reasoning,
                jobresult: this.jobresult,
                vote: this.vote,
                deathDetail: this.death,
            };
        }
        updateVital(vital) {
            this.vital = vital;
        }
        setJudge(day, judge) {
            this.jobresult.fillundef({ target: 99, judge: "notinput" }, +day);
            this.jobresult[day].judge = judge;
        }
        setTarget(day, target) {
            if (!target)
                return false;
            this.jobresult.fillundef({ target: 99, judge: "notinput" }, +day);
            this.jobresult[day].target = target;
        }
    }
    class PlayerManager {
        constructor(memo) {
            this.list = [];
            this.indexOfName = {};
            this.memo = memo;
        }
        reset() {
            this.list = [];
            this.indexOfName = {};
        }
        load(data) {
            if (!data)
                return false;
            this.list = [];
            this.indexOfName = {};
            for (let p of data) {
                let player = new Player(p);
                this.list.push(player);
                this.indexOfName[player.name] = player.no;
            }
        }
        pick(name) {
            if (name in this.indexOfName) {
                return this.list[this.indexOfName[name]];
            }
            else {
                return null;
            }
        }
        forSave() {
            return this.list.map((player) => player.forSave());
        }
        filter(mode) {
            for (var player of this.list) {
                if (mode == "All" || player.vital == "alive" || player.job != "gray") {
                    $("td.player_" + player.no).show();
                }
                else {
                    $("td.player_" + player.no).hide();
                }
            }
        }
        import() {
            this.update();
            this.import_vote_wakamete();
            this.import_death_wakamete();
        }
        update() {
            switch (this.memo.serverName) {
                case "wakamete":
                    let isStart = this.memo.isStart;
                    if (isStart) {
                        this.vitalCheck_wakamete();
                    }
                    else {
                        this.update_wakamete();
                    }
                    break;
            }
        }
        no(name) {
            if (name in this.indexOfName) {
                return this.indexOfName[name];
            }
            else {
                return "";
            }
        }
        vitalCheck_wakamete() {
            $("#w_player")
                .find("td:odd")
                .each((i, v) => {
                if (!$(v).html())
                    return false;
                this.list[i].updateVital(/生存中/.test($(v).html()) ? "alive" : "death");
            });
        }
        update_wakamete() {
            this.list = [];
            this.indexOfName = {};
            $("#w_player")
                .find("td:odd")
                .each((i, v) => {
                let html = $(v).html();
                if (!html)
                    return false;
                let player = Player.wakameteHTMLof(i, html);
                this.list.push(player);
                this.indexOfName[player.name] = i;
            });
        }
        import_death_wakamete() {
            let deathList = [];
            $("#w_discuss")
                .find("td[colspan='2']")
                .each((i, tr) => {
                if (/(で発見|結果処刑|突然死|猫又の呪い)/.test($(tr).text())) {
                    deathList.push(tr);
                }
            });
            let day = this.memo.today;
            let cantco = this.memo.today;
            let isdaytime = this.memo.isDaytime;
            for (let log of deathList) {
                let player = this.pick($(log).find("b").eq(0).text());
                let text = $(log).text();
                let reason = "";
                if (/無残な姿/.test(text))
                    reason = "bite";
                if (/死体で発見/.test(text))
                    reason = "note";
                if (/村民協議の結果|猫又の呪い/.test(text)) {
                    reason = "exec";
                    isdaytime ? day-- : cantco++;
                }
                if (/突然死/.test(text)) {
                    reason = "sudden";
                    cantco++;
                }
                player.death = {
                    reason: reason,
                    cantco: cantco,
                    day: day,
                };
            }
        }
        import_vote_wakamete() {
            let votelog = [];
            $("#w_discuss")
                .find("td[colspan='2']")
                .each(function (i, v) {
                if (/\d{1,2}日目 投票結果。/.test($(v).text())) {
                    votelog.unshift(v);
                }
            });
            if (!votelog.length)
                return false;
            let daystr = $(votelog[0])
                .text()
                .match(/(\d{1,2})日目 投票結果。/);
            if (!daystr)
                return false;
            let day = +daystr[1] - 1;
            for (let player of this.list) {
                player.vote.fillundef(["-"], day);
                player.vote[day].fillundef("-", votelog.length - 1);
            }
            for (let times = 0; times < votelog.length; times++) {
                $(votelog[times])
                    .find("tr")
                    .each((i, vote) => {
                    let voter = this.pick($(vote).find("b").eq(0).text());
                    let target = $(vote).find("b").eq(1).text();
                    if (voter)
                        voter.vote[day][times] = target;
                });
            }
        }
        listforSelect() {
            let playersList = { 99: "" };
            for (let player of this.list) {
                playersList[player.no] = player.name;
            }
            return playersList;
        }
        refresh() {
            this.refreshPlayer();
            this.refreshVote();
            this.refreshSummary();
        }
        refreshPlayer() {
            let playerInfoTable = $("#playerInfoTable");
            playerInfoTable.empty();
            if (!this.list.length)
                return false;
            let playersList = this.listforSelect();
            let newestDay = this.memo.newestDay;
            let namerow = new Tr("", "namerow");
            namerow.add("<a id='filterlink_99_99'>全ログ</a>");
            for (let player of this.list) {
                namerow.add(`<a id='filterlink_${player.no}_99'>${player.name}</a>`, `player_${player.no}`);
            }
            namerow.appendTo(playerInfoTable);
            let jobrow = new Tr("", "jobrow");
            jobrow.add("CO");
            for (let player of this.list) {
                let select = createSelectBox(joblist, player.job, {
                    id: `player_${player.no}_job`,
                    class: "jobselect",
                });
                jobrow.add(select, "player_" + player.no);
            }
            jobrow.appendTo(playerInfoTable);
            jobrow = new Tr("", "jobrow");
            jobrow.add("推理");
            for (let player of this.list) {
                let select = createSelectBox(reasoninglist, player.reasoning, {
                    id: `player_${player.no}_reasoning`,
                    class: "reasoningselect",
                });
                jobrow.add(select, "player_" + player.no);
            }
            playerInfoTable.append(jobrow.text());
            for (let day = 1; day <= newestDay; day++) {
                let row = new Tr("", "talknumrow");
                row.add(`<a id="filterlink_99_${day}">${day + 1}日目</a>`);
                for (let player of this.list) {
                    let no = player.no;
                    let talknum = this.memo.log.talknum(player.name, day) || "";
                    row.add(`<a id=filterlink_${no}_${day}>${talknum}</a>`, `player_${no}`);
                }
                row.appendTo(playerInfoTable);
            }
            for (let day = 1; day <= newestDay; day++) {
                let resultrow = new Tr("result_" + day, "resultrow");
                resultrow.add(`占霊結果 ${day + 1}日目`);
                for (let player of this.list) {
                    if ((player.job == "fortune" && day < player.death.cantco) ||
                        (player.job == "necro" && day < player.death.cantco && day > 1)) {
                        let select1 = createSelectBox(playersList, 99, {
                            id: `target_${player.no}_${day}`,
                            class: "jobtarget",
                        });
                        let select2 = createSelectBox(resultlist, "notinput", {
                            id: `judge_${player.no}_${day}`,
                            class: "jobjudge",
                        });
                        resultrow.add(select1 + select2, "player_" + player.no);
                    }
                    else {
                        resultrow.add("", "player_" + player.no);
                    }
                }
                playerInfoTable.append(resultrow.text());
            }
            this.refreshJobResult();
            this.memo.switchAliveFilter();
            this.memo.switchInputMode();
            this.coloringGray();
            let _this = this;
            $("#playerInfoTable a").on("click", function (e) {
                let id = $(this).attr("id");
                if (!id)
                    return false;
                let no = +id.split("_")[1];
                let day = +id.split("_")[2];
                _this.memo.filterLog(no, day);
            });
            $("select.jobselect").on("change", function (e) {
                let id = $(this).attr("id");
                if (!id)
                    return false;
                let [i, no, day] = id.split("_");
                _this.list[+no].job = String($(this).val());
                _this.refresh();
                _this.refreshJobInitial();
                _this.coloring();
                _this.memo.save();
            });
            $("select.reasoningselect").on("change", function (e) {
                let id = $(this).attr("id");
                if (!id)
                    return false;
                let [i, no, day] = id.split("_");
                _this.list[+no].reasoning = String($(this).val());
                _this.refreshJobInitial();
                _this.coloring();
                _this.memo.save();
            });
            $("select.jobtarget").on("change", function (e) {
                let id = $(this).attr("id");
                if (!id)
                    return false;
                let no = +id.split("_")[1];
                let day = +id.split("_")[2];
                let target = +$(this).val();
                _this.list[no].setTarget(day, target);
                _this.refreshSummary();
                _this.coloringGray();
                _this.memo.save();
            });
            $("select.jobjudge").on("change", function (e) {
                let id = $(this).attr("id");
                if (!id)
                    return false;
                let [i, no, day] = id.split("_");
                let judge = String($(this).val());
                _this.list[+no].setJudge(+day, judge);
                _this.refreshSummary();
                _this.coloringGray();
                _this.memo.save();
            });
        }
        refreshVote() {
            if (!this.list.length)
                return false;
            let voteTable = $("#voteTable");
            let newestDay = this.memo.newestDay;
            voteTable.empty();
            var tr = new Tr();
            tr.add("プレイヤー");
            for (var day = 1; day <= newestDay; day++) {
                if (!this.list[0].vote[day])
                    continue;
                let colspan = this.list[0].vote[day].length;
                tr.add(`${day + 1}日目`, "", colspan);
            }
            voteTable.append(tr.text());
            for (var player of this.list) {
                tr = new Tr();
                tr.add(player.name);
                for (day = 1; day <= newestDay; day++) {
                    if (!player.vote[day])
                        continue;
                    for (let vote of player.vote[day]) {
                        tr.add(vote);
                    }
                }
                voteTable.append(tr.text());
            }
        }
        refreshJobResult() {
            let newestDay = this.memo.newestDay;
            let fortunes = this.list.filter((p) => p.job == "fortune");
            for (let fortune of fortunes) {
                for (let day = 1; day < Math.min(fortune.death.cantco, newestDay + 1); day++) {
                    if (!fortune.jobresult[day])
                        continue;
                    $("#target_" + fortune.no + "_" + day).val(fortune.jobresult[day].target);
                    $("#judge_" + fortune.no + "_" + day).val(fortune.jobresult[day].judge);
                }
            }
            let necros = this.list.filter((p) => p.job == "necro");
            for (let necro of necros) {
                for (let day = 2; day < Math.min(necro.death.cantco, newestDay + 1); day++) {
                    let exec = this.list.filter((p) => p.death.day == day - 1 && p.death.reason == "exec");
                    if (necro.jobresult[day]) {
                        $("#target_" + necro.no + "_" + day).val(necro.jobresult[day].target);
                        $("#judge_" + necro.no + "_" + day).val(necro.jobresult[day].judge);
                    }
                    else if (exec) {
                        $("#target_" + necro.no + "_" + day).val(exec[0].no);
                    }
                }
            }
        }
        refreshSummary() {
            let summaryTable = $("#summaryTable");
            let newestDay = this.memo.newestDay;
            summaryTable.empty();
            var tr = new Tr();
            tr.add("", "", 2);
            for (var day = 1; day <= newestDay; day++) {
                tr.add("" + (day + 1) + "日目");
            }
            tr.appendTo(summaryTable);
            var fortunes = this.list.filter((p) => p.job == "fortune");
            let necros = this.list.filter((p) => p.job == "necro");
            let ability = fortunes.concat(necros);
            for (let player of ability) {
                tr = new Tr();
                tr.add(player.job == "fortune" ? "占い師" : "霊能者");
                tr.add(player.name);
                for (day = 1; day <= newestDay; day++) {
                    let name = "", judge = "";
                    if (player.jobresult[day] && player.jobresult[day].target != 99) {
                        let result = player.jobresult[day];
                        name = this.list[result.target].name;
                        judge = resultlist[result.judge];
                    }
                    tr.add(name + judge);
                }
                tr.appendTo(summaryTable);
            }
            for (var reason in reasonflavor) {
                let deaths = this.list.filter((p) => p.death.reason == reason);
                if (!deaths.length)
                    continue;
                tr = new Tr();
                tr.add(reasonflavor[reason], "", 2);
                for (day = 1; day <= newestDay; day++) {
                    let cn = deaths.filter((p) => p.death.day == day).map((p) => p.name);
                    let text = cn.length ? cn.join("<br>") : "-";
                    tr.add(text);
                }
                tr.appendTo(summaryTable);
            }
        }
        refreshJobInitial() {
            for (let player of this.list) {
                let job = jobinitial[player.reasoning] + jobinitial[player.job];
                $("tr.talk_player" + player.no + " span").html(job);
            }
        }
        coloringGray() {
            let co = this.list.filter((p) => p.job != "gray").map((p) => p.no);
            var fortunes = this.list.filter((p) => p.job == "fortune");
            if (this.memo.settingIs("grayregion")) {
                fortunes = fortunes.filter((f) => f.reasoning == "gray" || f.reasoning == "real");
            }
            let fortuned = fortunes.map((f) => f.jobresult.map((r) => +r.target)).flat();
            let notgray = co.concat(fortuned);
            $("tr.namerow td").removeClass("death").removeClass("gray");
            for (var player of this.list) {
                if (player.vital == "death") {
                    $("tr.namerow .player_" + player.no).addClass("death");
                }
                else if (!notgray.includes(player.no)) {
                    $("tr.namerow .player_" + player.no).addClass("gray");
                }
            }
        }
        coloring() {
            if (!this.memo.settingIs("coloringName"))
                return false;
            $("#w_discuss b").each((i, e) => {
                let name = $(e).text();
                let player = this.pick(name);
                if (player) {
                    let job = player.job;
                    let color = this.memo.colorSetting.pick(job);
                    $(e).removeClass().addClass(color);
                }
            });
        }
    }
    class Log {
        constructor(data) {
            this.name = data.name;
            this.color = data.color;
            this.content = data.content;
        }
        forSave() {
            return {
                name: this.name,
                color: this.color,
                content: this.content,
            };
        }
    }
    class LogManager {
        constructor(memo) {
            this.memo = memo;
            this.list = [];
        }
        reset() {
            this.list = [];
        }
        load(data) {
            if (!data)
                return false;
            this.list = [];
            data.forEach((logs) => {
                let logofday = [];
                logs.forEach((d) => {
                    let log = new Log(d);
                    logofday.push(log);
                });
                this.list.push(logofday);
            });
        }
        forSave() {
            let result = [];
            this.list.forEach((logs) => {
                let l = logs.map((log) => log.forSave());
                result.push(l);
            });
            return result;
        }
        talknum(name, day) {
            if (!this.list[day])
                return 0;
            return this.list[day].filter((l) => l.name == name).length;
        }
        import() {
            switch (this.memo.serverName) {
                case "wakamete":
                    this.import_wakamete();
                    break;
            }
            this.memo.filterLog();
        }
        import_wakamete() {
            this.import_discuss_wakamete();
        }
        import_discuss_wakamete() {
            let today = this.memo.today;
            let isDaytime = this.memo.isDaytime;
            if (!isDaytime)
                return false;
            this.list.fillundef([], today);
            this.list[today] = [];
            $("#w_discuss")
                .find("tr")
                .each((i, tr) => {
                if ($(tr).children().length == 2) {
                    let name = $(tr).children().eq(0).find("b").eq(0).html();
                    let content = $(tr).children().eq(1).html();
                    let namehtml = $(tr).children().eq(0).html();
                    let color = namehtml.match(/color="(.+?)"/)[1];
                    let log = new Log({
                        name: name,
                        color: color,
                        content: content,
                    });
                    this.list[today].push(log);
                }
            });
        }
        refresh() {
            let discussLogTable = $("#discussLogTable");
            discussLogTable.empty();
            if (!this.list.length)
                return false;
            this.list.forEach((logs, day) => {
                if (!logs)
                    return;
                let tbody = $("<tbody></tbody>", { id: "log_day" + day });
                let trs = `<tr class="systemlog"><td colspan="2">${day + 1}日目</td></tr>`;
                for (let log of logs) {
                    let cl = "talk_player" + this.memo.playerManager.no(log.name);
                    let name = `<font color="${log.color}">◆</font><b>${log.name}</b>さん`;
                    if (log.name == "ゲームマスター") {
                        name = `<font color="${log.color}">◆<b>${log.name}</b></font>`;
                    }
                    trs += `<tr class="${cl}"><td>${name}<span class='jobinitial'></span></td><td>${log.content}</td></tr>`;
                }
                tbody.append(trs).prependTo(discussLogTable);
            });
            this.memo.playerManager.refreshJobInitial();
        }
    }
    class SettingOption {
        constructor(data) {
            this.value = data.value;
            this.option = data.option;
            this.default = data.value;
            this.name = data.name;
        }
    }
    class ColorSetting {
        constructor(memo) {
            this.memo = memo;
            this.options = {};
        }
        pick(job) {
            return this.options[job].value;
        }
        init() {
            for (let key in colorSettingDefault) {
                this.options[key] = new SettingOption(colorSettingDefault[key]);
            }
            this.load();
            let settingArea = $("<div></div>", {
                id: "colorSetting",
                class: "window southEast",
            }).appendTo($("body"));
            $("#toolArea_hid").append("<a id='dispcolorSetting'>名前色設定</a>");
            let settingTable = $("<table></table>", { id: "colorSettingtable" }).appendTo(settingArea);
            settingArea.append(`<div class="closebutton"><input type="button" id="closeColorSetting" value='閉じる'></div>`);
            $("#dispcolorSetting").on("click", () => {
                $("#colorSetting").show();
            });
            $("#closeColorSetting").on("click", () => {
                $("#colorSetting").hide();
            });
            for (let key in this.options) {
                let item = this.options[key];
                let tr = new Tr();
                tr.add(item.name);
                tr.add(createSelectBox(item.option, item.value, { id: key }));
                tr.appendTo(settingTable);
            }
            let _this = this;
            $("#colorSetting select").on("change", function () {
                let val = $(this).val();
                _this.setValue($(this).attr("id"), String(val));
                _this.coloring();
            });
        }
        coloring() {
            this.memo.playerManager.coloring();
        }
        setValue(key, value) {
            if (!(key in this.options))
                return false;
            this.options[key].value = value;
            this.save();
        }
        load() {
            let s = localStorage.getItem("memoColorSetting");
            if (!s)
                return false;
            let data = JSON.parse(s);
            for (let key in data) {
                if (key in this.options) {
                    this.options[key].value = data[key];
                }
            }
        }
        save() {
            localStorage.setItem("memoColorSetting", JSON.stringify(this.forSave()));
        }
        forSave() {
            let result = {};
            for (let key in this.options) {
                result[key] = this.options[key].value;
            }
            return result;
        }
    }
    class Setting {
        constructor(memo) {
            this.memo = memo;
            this.options = {};
        }
        init() {
            for (let key in settingDefault) {
                this.options[key] = new SettingOption(settingDefault[key]);
            }
            this.load();
            let settingArea = $("<div></div>", { id: "setting", class: "window southEast" }).appendTo($("body"));
            $("#toolArea_hid").append("<a id='dispsetting'>設定</a>");
            let settingTable = $("<table></table>", { id: "settingtable" }).appendTo(settingArea);
            settingArea.append(`<div class="closebutton"><input type="button" id="closeSetting" value='閉じる'></div>`);
            $("#dispsetting").on("click", () => {
                $("#setting").show();
            });
            $("#closeSetting").on("click", () => {
                $("#setting").hide();
            });
            for (let key in this.options) {
                let item = this.options[key];
                let tr = new Tr();
                tr.add(item.name);
                tr.add(createSelectBox(item.option, item.value, { id: key }));
                tr.appendTo(settingTable);
            }
            let _this = this;
            $("#setting select").on("change", function () {
                let key = $(this).attr("id");
                let val = String($(this).val());
                _this.setValue(key, val);
            });
        }
        setValue(key, value) {
            if (!(key in this.options))
                return false;
            this.options[key].value = value;
            this.save();
        }
        load() {
            let s = localStorage.getItem("memoSetting");
            if (!s)
                return false;
            let data = JSON.parse(s);
            for (let key in data) {
                if (key in this.options) {
                    this.options[key].value = data[key];
                }
            }
        }
        save() {
            localStorage.setItem("memoSetting", JSON.stringify(this.forSave()));
        }
        forSave() {
            let result = {};
            for (let key in this.options) {
                result[key] = this.options[key].value;
            }
            return result;
        }
    }
    class Random {
        constructor(memo) {
            this.memo = memo;
        }
        init() {
            let randomWindow = `
                <div id="random" class="window southEast">
    
                <div class="closebutton">
                <input type="button" id="closeRandom" value='閉じる'>
                </div>
    
                <input type="button" value="4桁乱数" id="random_rnd4">
                <input type="button" value="乱数表" id="random_matrix">
                <input type="button" value="背徳用数字" id="random_haitoku">
                <br>
                <textarea id="forCopy" style="width:200px;height:150px;"></textarea>
                <div id='randomMessage'></div>
                </div>
            `;
            $("body").append(randomWindow);
            $("#toolArea_hid").append("<a id='dispRandom'>乱数</a>");
            $("#dispRandom").on("click", () => {
                $("#random").show();
            });
            $("#closeRandom").on("click", () => {
                $("#random").hide();
            });
            $("#random_rnd4").on("click", () => {
                this.copy(this.rnd4());
            });
            $("#random_matrix").on("click", () => {
                this.copy(this.matrix());
            });
            $("#random_haitoku").on("click", () => {
                this.copy(this.haitoku());
            });
        }
        copy(text) {
            $("#forCopy").val(text).select();
            document.execCommand("copy");
            $("#randomMessage").html("コピーしました。");
        }
        rnd(n) {
            return Math.floor(Math.random() * n);
        }
        padding(num, digit) {
            let txt = "0000000000" + num;
            return txt.slice(-digit);
        }
        rnd4() {
            let rnd = this.rnd(10000);
            return this.padding(rnd, 4);
        }
        matrix() {
            let num = this.memo.playerNum;
            var l = [];
            var mat = "";
            for (var i = 0; i < num; i++) {
                l[i] = this.padding(i + 1, 2);
            }
            for (i = 0; i < num; i++) {
                var r = this.rnd(num - i);
                mat += l[r];
                mat += i % 5 == 4 ? "\n" : " / ";
                for (var j = r; j < num - 1; j++) {
                    l[j] = l[j + 1];
                }
            }
            return mat;
        }
        haitoku() {
            let num = this.memo.playerNum;
            var jobs = ["村　人", "占い師", "霊能者", "狩　人", "共有者", "狂　人", "背徳者"];
            var cir = ["①", "②", "③", "④", "⑤", "⑥", "⑦"];
            var result = "";
            var isimo = num == 15 || num == 19;
            var n = isimo ? 7 : 6;
            if (isimo) {
                result += cir[this.rnd(n)] + "\n\n";
            }
            var l = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            for (let i = 0; i < n; i++) {
                let r = this.rnd(10 - i);
                let rnd = this.padding(this.rnd(100), 2);
                result = result + jobs[i] + "：" + l[r] + rnd + "\n";
                l.splice(r, 1);
            }
            return result;
        }
    }
    class Style {
        constructor(memo) {
            this.memo = memo;
        }
        injection() {
            let style = [];
            if (this.memo.settingIs("rewrite_css")) {
                style = [
                    ".CLSTABLE tr td:nth-of-type(even) {font-size: 12px;line-height: 110%;padding: 2px;}",
                    ".CLSTABLE tr td:nth-of-type(odd) {font-size: 0px;padding: 2px;}",
                    'body[bgcolor="#000000"] font[color="#6666aa"] {color: #ccccff;}',
                    'font[size="-1"] {font-size: 9pt;}',
                    "img {padding: 0;}",
                    "input,select {font-size: 9pt;}",
                    "table {font-size: 13px;}",
                    'textarea {font-family: "Meiryo";font-size: 11px;min-height: 100px;}',
                    'table[cellpadding="0"] tr td:nth-of-type(2){word-break:break-all;}',
                ];
            }
            let theme = this.memo.settingValue("theme_color");
            let theme_color = themeList[theme].main;
            let sub_color = themeList[theme].sub;
            style = style.concat([
                `:root{--theme-color:${theme_color}; --sub-color:${sub_color};}`,
                "*{box-sizing:border-box;}",
                "body{margin:0;}",
                "form{margin:8px;}",
                "#memoContainer{display:none; width:100%; height:100%; position:fixed; top:0px; left:0px; background-color:rgba(180,180,180,0.8); padding:15px; overflow:auto;}",
                "#floatButtonArea{position:fixed; right:15px; top:15px;}",
                "#floatButtonArea > div{margin:0px 2px; display:inline-block; vertical-align: top; width:110px;  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.4);}",
                "#warningArea{width:100%; height:40px; padding:5px; position:fixed; bottom:0; display:none; background-color:darkorange; text-align:center; font-size:16px; color:white; font-weight:bold;}",
                "#left{font-size:30px;}",
                "#warningArea select, #warningArea input{font-size:11pt; vertical-align:middle;}",
                "#memoMenu{width:100%; margin: 0 auto; font-size:10px;}",
                "#memoMenu input, #memoMenu select, #buttonArea input{font-size:11px;}",
                "#memoTab{margin-top:15px;}",
                "#memoBody{width:100%; height:calc(100% - 63px); margin: 0 auto; }",
                "#logArea,#voteArea{width:100%; height:100%; overflow:auto; margin: 0 auto; background-color:white; padding:10px; border-radius:0px 8px 8px 8px ;}",
                "#voteArea{display:none;}",
                "#discussLogTable{border-collapse:collapse;}",
                "#discussLogTable td{text-align:left;vertical-align:top; color:black; word-break:break-all; font-size:9pt; line-height:140%; padding:2px;}",
                "#discussLogTable font{font-size:9pt;}",
                "#discussLogTable tr td:first-of-type{min-width:150px;}",
                "#discussLogTable tr.systemlog td{font-weight:bold;background-color:var(--theme-color) !important; color:white; text-align:center;}",
                "#playerInfoTable a{text-decoration:underline; color:blue; cursor:pointer;}",
                "#playerInfoTable tr.namerow td.death {background-color:pink;}",
                "#playerInfoTable tr.namerow td.gray {background-color:#e3e3e3;}",
                "#playerInfoTable select {max-width:100px;}",
                "#voteTable, #summaryTable{font-size:11px; border-collapse:collapse; margin-bottom:10px;color:black;}",
                "#voteTable td, #summaryTable td{border:1px solid #666; padding:2px; }",
                "#toolArea_hid {display:none;}",
                "#setting input[type=number], #setting input[type=text]{width:60px;}",
                ".coloredit, .iconsupport{display:none;}",
                ".voiceloud {padding:0px 5px;}",
                ".voiceloud div:not(:first-of-type){margin-top:5px;}",
                ".voice {width:30px;height:30px;font-size:16px;border:1px solid black; border-radius:2px;background-color:white;line-height:28px;text-align:center;color:black; cursor:pointer;}",
                ".voice.voice_selected{border:3px solid red; line-height:24px;}",
                "#caspe input[type=text]{width:100px;}",
                "#caspe input[type=number]{width:50px}",
                ".window{box-shadow: 0 3px 5px rgba(0, 0, 0, 0.4); border-top:16px solid var(--theme-color); background-color:#efefef; padding:10px; display:none; }",
                ".southEast{font-size:13px; position:fixed; right:10px; bottom:10px; width:400px; height:300px;}",
                ".north{width:400px; height:80px; position:fixed; left:calc(50% - 200px); top:15px;}",
                "#floatButtonArea a, .button{width:110px; color:white; background-color:var(--theme-color); cursor:pointer; display:inline-block; font-size:12px; font-weight:bold; line-height:24px; text-align:center;}",
                "div.button{margin:0px 2px; box-shadow: 0 3px 5px rgba(0, 0, 0, 0.4); padding:0px 3px;}",
                ".tab{width:150px; color:white; background-color:var(--theme-color);cursor:pointer;  display:inline-block; font-size:12px; line-height:24px; text-align:center; border-radius:8px 8px 0 0;}",
                ".tab.active{color:var(--theme-color); background-color:white;font-weight:bold;}",
                "#floatButtonArea a:hover, div.button:hover{background-color:var(--sub-color);}",
                ".closebutton{position:absolute; right:5px; top:5px;}",
                "#caspe img{padding:2px;}",
                "#caspe img.iconselected{border:2px solid var(--theme-color); padding:0px;}",
                ".jobinitial{user-select:none; color:var(--theme-color); font-weight:bold; font-size:80%;}",
                ".jobinitial:not(:empty):before{content:'[';}",
                ".jobinitial:not(:empty):after{content:']';}",
                ".black{color:black;} .pink{color:deeppink;} .red{color:red;} .green{color:green;}",
                ".purple{color:purple;} .brown{color:brown;} .blue{color:blue;}",
                ".gaming{background:linear-gradient(to right, #f33,#ff3,#3f3,#3ff,#33f,#f3f,#f33) ;-webkit-background-clip: text; -webkit-text-fill-color:transparent;}",
            ]);
            if (this.memo.settingIs("layout")) {
                style = style.concat([
                    "#logArea{display: flex; flex-direction:column; flex-wrap:wrap;}",
                    "#playerInfoArea{height:calc(100% - 50px); overflow:auto hidden; width:50%; padding:0px;}",
                    "#playerInfoArea select{font-size:8.5pt;}",
                    "#buttonArea{height:50px;font-size:12px;  padding:5px;}",
                    "#buttonArea > div{ margin-bottom:5px;}",
                    "#discussLogArea{width:50%; overflow:auto; padding:5px;}",
                    ".select{color:var(--theme-color); border-width:2px 2px 2px 0px ;border-color:var(--theme-color); border-style:solid; background-color:white; cursor:pointer; text-align:center; display:inline-block;width:100px;}",
                    ".select.active{color:white;background-color:var(--theme-color); font-weight:bold;}",
                    "#buttonArea > div > div.select:first-of-type{margin-left:5px; border-left:2px solid var(--theme-color);}",
                    "#buttonArea > div > div.select:lastof-type{margin-right:5px;}",
                    "#playerInfoTable{background-color:white; text-align:center; font-size:8pt; color:black; width:100%; margin:0px 2px 2px 0px;}",
                    "#playerInfoTable tbody{display:flex; flex-direction:row;border-spacing:0;}",
                    "#playerInfoTable tr{display:flex; flex-direction:column; flex:0 0 40px;}",
                    "#playerInfoTable tr.namerow{display:flex; flex-direction:column; flex:0 0 80px; position:sticky; left:0;}",
                    "#playerInfoTable tr.namerow td{background-color:white;}",
                    "#playerInfoTable tr.resultrow{display:flex; flex-direction:column; flex:0 0 140px;}",
                    "#playerInfoTable td{border-right:#666 solid 1px;border-bottom:#666 solid 1px;padding:1px; display:block; width:auto; height:1.8em; }",
                    "#playerInfoTable tr:first-of-type td{border-left:#666 solid 1px;}",
                    "#playerInfoTable tr td:first-of-type{border-top:#666 solid 1px;}",
                ]);
            }
            else {
                style = style.concat([
                    "#buttonArea{padding:10px;line-height:24px;font-size:9pt;}",
                    "#buttonArea > div{display:inline-block;}",
                    "#playerInfoArea{overflow:auto;}",
                    ".select{width:100px; color:var(--theme-color); border-width:2px 2px 2px 0px ;border-color:var(--theme-color); border-style:solid; background-color:white; cursor:pointer; display:inline-block; font-size:12px; line-height:20px; text-align:center;}",
                    ".select.active{color:white;background-color:var(--theme-color); font-weight:bold;}",
                    "#buttonArea > div > div.select:first-of-type{margin-left:5px; border-left:2px solid var(--theme-color);}",
                    "#buttonArea > div > div.select:last-of-type{margin-right:5px;}",
                    "#playerInfoTable {background-color:white;text-align:center; font-size:8pt;border-collapse:collapse; color:black; margin:0 auto;}",
                    "#playerInfoTable td{border:#666 solid 1px; padding:1px; }",
                    "#playerInfoTable tr.namerow{height:35px;}",
                    "#playerInfoTable tr td:first-child{min-width:50px;}",
                ]);
            }
            $("<style></style>").html(style.join("\n")).appendTo($("head"));
        }
    }
    class Utility {
        constructor(memo) {
            this.memo = memo;
            this.setting = memo.setting;
            this.left = 0;
            this.autoReloadFlg = 0;
        }
        init() {
            this.setAlertVote();
            this.receiveKeyResponse();
            this.dispSuggest();
            this.highlightDeathnote();
            this.memo.playerManager.coloring();
            this.setAutoReload();
        }
        setAutoReload() {
            if ($("td.CLSTD01").eq(1).text() != "◆ 再表示")
                return false;
            let isAutoReload = this.memo.isAutoReload;
            let onoff = isAutoReload ? "ON" : "OFF";
            $("#floatButtonArea").prepend("<div><a id='autoReload'>自動更新：" + onoff + "</a></div>");
            if (isAutoReload)
                this.setReloadTimer();
            $("#autoReload").on("click", () => {
                this.memo.toggleAutoReload();
                let isAutoReload = this.memo.isAutoReload;
                let onoff = isAutoReload ? "ON" : "OFF";
                $("#autoReload").text("自動更新：" + onoff);
                if (isAutoReload) {
                    this.setReloadTimer();
                }
                else {
                    clearTimeout(this.autoReloadFlg);
                }
            });
        }
        setReloadTimer() {
            this.autoReloadFlg = setTimeout(() => {
                $("textarea").eq(0).val("");
                document.forms[0].submit();
            }, +this.memo.settingValue("autoreload_interval") * 1000);
        }
        setAlertVote() {
            if (!this.memo.settingIs("alert_vote"))
                return false;
            if ($("font[size=6]").length) {
                let warningArea = $("<div></div>", { id: "warningArea" }).appendTo($("body"));
                warningArea.show();
                var cmbplayer = $("select[name=CMBPLAYER]").clone();
                var votebutton = $("<input />", {
                    type: "button",
                    value: "投票",
                    on: {
                        click: function () {
                            $("select").eq(0).val("VOTE");
                            document.forms[0].submit();
                        },
                    },
                });
                this.left = counts;
                warningArea.html("未投票です！ あと<span id='left'></span>秒");
                warningArea.append(cmbplayer);
                warningArea.append(votebutton);
                cmbplayer.on("change", function () {
                    let v = $(this).val();
                    if (!v)
                        return false;
                    $("select[name=CMBPLAYER]").val(v);
                });
                $("#left").html("" + this.left);
                setInterval(() => {
                    $("#left").html(String(--this.left));
                }, 1000);
            }
        }
        receiveKeyResponse() {
            if (this.memo.settingIs("send_support", "ctrl")) {
                $(window).on("keydown", function (e) {
                    if (e.ctrlKey && e.keyCode == 13) {
                        document.forms[0].submit();
                    }
                });
            }
            if (this.memo.settingIs("send_support", "shift")) {
                $(window).on("keydown", function (e) {
                    if (e.shiftKey && e.keyCode == 13) {
                        document.forms[0].submit();
                    }
                });
            }
        }
        dispSuggest() {
            var colorselect = createSelectBox(COLORLIST, 0, { id: "colorlist" });
            var coloredit = `<td class="coloredit">アイコン色：</td><td class="coloredit">${colorselect}</td>`;
            var iconsupport = "<td class='iconsupport'><input type='button' id='pasteurl' value='/../../imgbbs/img/'></td>";
            let commandtable = $("#w_command");
            commandtable.find("td").eq(1).after(coloredit).after(iconsupport);
            commandtable.find("td").eq(-2).addClass("cmbplayer");
            commandtable.find("td").eq(-1).addClass("cmbplayer");
            let _this = this;
            $("#colorlist").on("change", function () {
                _this.editSpeakField(String($(this).val()));
            });
            $("#pasteurl").on("click", () => {
                this.editSpeakField("/../../imgbbs/img/");
            });
            $("select")
                .eq(0)
                .on("change", function () {
                $("td.coloredit").hide();
                $("td.iconsupport").hide();
                $("td.cmbplayer").hide();
                if ($(this).val() == "ICONCHG") {
                    $("td.coloredit").show();
                }
                else if ($(this).val() == "BCONCHG") {
                    $("td.iconsupport").show();
                }
                else {
                    $("td.cmbplayer").show();
                }
            });
        }
        editSpeakField(val) {
            $("textarea").eq(0).val(val);
        }
        highlightDeathnote() {
            var td = $("#w_info").find("td:last");
            if (/アナタの家の前に/.test(td.html())) {
                td.css("color", "red");
            }
        }
    }
    if ($("body").attr("bgcolor") != "#fee3aa") {
        const meatmemo = new MeatMemo("wakamete");
    }
    
    
    })(jQuery)
    