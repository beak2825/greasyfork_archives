// ==UserScript==
// @name         Instant Wakamemo
// @namespace    http://mobajinro.s178.xrea.com/wakamemo/
// @version      1.5.3
// @description  わかめて上で動作するわかめてメモのようなものです。
// @author       udop_
// @match        http://jinrou.dip.jp/~jinrou/cgi_jinro.cgi
// @match        http://61.215.66.131/~jinrou/cgi_jinro.cgi
// @match        http://www7a.biglobe.ne.jp/~kuri/cgi_jinro.cgi
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/35295/Instant%20Wakamemo.user.js
// @updateURL https://update.greasyfork.org/scripts/35295/Instant%20Wakamemo.meta.js
// ==/UserScript==

;(function ($) {
    "use strict"

    if (document.body.bgColor == "#fee3aa") {
        //村画面でないときは出さない
        return false
    }

    //**********************************************
    // 変数・クラスの宣言
    //**********************************************

    Array.prototype.fillundef = function (def, lastindex) {
        lastindex = lastindex + 1 || this.length
        for (let i = 0; i < lastindex; i++) {
            if (this[i] === null || this[i] === undefined) {
                this[i] = JSON.parse(JSON.stringify(def))
            }
        }
    }

    function range(a, b) {
        var ar = []
        a = a || playerInfo.length
        b = b || undefined
        if (!b) {
            for (let i = 0; i < a; i++) ar.push(i)
        } else {
            for (let i = a; i < b; i++) ar.push(i)
        }
        return ar
    }

    var playerInfo,
        indexOfName,
        discussLog,
        deathLog,
        inputMode,
        votetimes,
        newestDay,
        today,
        setting,
        colorSetting
    var playertable = $("table").eq(1)
    var textareatable = $("table[cellspacing=0]").eq(-1)
    var discusstable = $("table[cellpadding=0]").not("table.CLSTABLE2").last()
    var infotable = $("table[cellspacing=0]").eq(0)
    var commandtable = $("table[cellspacing=0]").eq(-2)
    var textarea = $("textarea").eq(0)
    var body = $("body")
    var isdaytime = document.body.bgColor != "#000000"

    var settingDefault = {
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
            value: "onetime",
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
    }

    var nameColor = {
        black: "なし",
        red: "赤",
        pink: "ピンク",
        blue: "青",
        green: "緑",
        purple: "紫",
        brown: "茶",
        gaming: "虹色",
    }
    var colorSettingDefault = {
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
    }
    var data = {
        playerInfo: [],
        indexOfName: {},
        isAutoReload: false,
        discussLog: [],
        deathLog: { exec: [], bite: [] },
        isfilter: false,
        inputMode: "simple",
        villageno: 0,
        setting: settingDefault,
        votetimes: [],
        importlogday: 0,
    }
    var color = {
        crimson: { main: "crimson", sub: "#EC365A" },
        darkorange: { main: "darkorange", sub: "#FF9F32" },
        darkgreen: { main: "darkgreen", sub: "#009300" },
        navy: { main: "navy", sub: "#0000b2" },
        purple: { main: "purple", sub: "#B200B2" },
        sienna: { main: "sienna", sub: "#C66538" },
    }

    class Tr {
        constructor(id, cl) {
            this.id = ""
            this.cl = ""
            if (id) this.id = id
            if (cl) this.cl = cl
            this.tds = []
        }
        add(val, cl) {
            var c = cl ? `class='${cl}'` : ""
            var td = `<td ${c}>${val}</td>`
            this.tds.push(td)
        }
        addhtml(html) {
            this.tds.push(html)
        }
        text() {
            var tr = "<tr"
            if (this.id) tr = tr + " id='" + this.id + "'"
            if (this.cl) tr = tr + " class='" + this.cl + "'"
            tr += ">"
            tr += this.tds.join("")
            tr += "</tr>"
            return tr
        }
        appendTo(jQueryObject) {
            jQueryObject.append(this.text())
        }
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
    }

    //**********************************************
    //  Session関係
    //**********************************************

    function load() {
        if (localStorage.getItem("memodata")) {
            data = JSON.parse(localStorage.getItem("memodata"))
        }

        playerInfo = data.playerInfo
        indexOfName = data.indexOfName
        discussLog = data.discussLog
        deathLog = data.deathLog
        votetimes = data.votetimes

        var old_setting = data.setting
        data.setting = {}
        for (let k in settingDefault) {
            data.setting[k] = old_setting && k in old_setting ? old_setting[k] : settingDefault[k]
        }
        setting = data.setting

        old_setting = data.colorSetting || colorSettingDefault
        data.colorSetting = {}
        for (let k in colorSettingDefault) {
            if (old_setting && k in old_setting) {
                data.colorSetting[k] = old_setting[k]
            } else {
                data.colorSetting[k] = colorSettingDefault[k]
            }
        }
        colorSetting = data.colorSetting
        save()
    }

    function save() {
        localStorage.setItem("memodata", JSON.stringify(data))
    }

    //**********************************************
    //   import関係
    //**********************************************

    function importLog() {
        updateplayerInfo()
        importDiscussLog()
    }

    function updateplayerInfo() {
        //プレイヤー情報を取得
        //death…「能力がCOできなくなった日」を指す 3日目吊りなら4日目。3日目噛まれなら3日目

        if (discussLog.length >= 2) {
            playertable.find("td:odd").each(function (i, v) {
                if (!$(v).html()) return false
                playerInfo[i].vital = $(v).html().includes("生存中") ? "alive" : "death"
            })
        } else {
            data.playerInfo = []
            playerInfo = data.playerInfo
            data.indexOfName = {}
            indexOfName = data.indexOfName
            playertable.find("td:odd").each(function (i, v) {
                var html = $(v).html()
                if (!html) return false

                var name = html.split("<br>")[0]
                var vital = html.includes("生存中") ? "alive" : "death"
                playerInfo.push({
                    no: i,
                    name: name,
                    vital: vital,
                    job: "gray",
                    reasoning: "gray",
                    jobresult: [],
                    vote: [],
                    death: 99,
                })
                data.indexOfName[name] = i
            })
        }
        save()
    }

    function importDiscussLog() {
        //ログ取り込み
        if (isdaytime) {
            discussLog[today] = []
            discusstable.find("tr").each(function (i, v) {
                if ($(v).children().length != 2) return true
                discussLog[today].push({
                    name: $(v).children().eq(0).find("b").eq(0).html(),
                    namehtml: $(v).children().eq(0).html(),
                    content: $(v).children().eq(1).html(),
                })
            })
        }

        //投票結果・死亡ログ
        var votelog = []
        discusstable.find("td[colspan='2']").each(function (i, v) {
            if (
                /(無残な姿で発見|死体で発見|村民協議の結果処刑|突然死|猫又の呪い)/.test($(v).text())
            ) {
                importDeath(v)
            }
            if (/\d{1,2}日目 投票結果。/.test($(v).text())) {
                votelog.unshift(v)
            }
        })
        if (votelog.length) importVote(votelog)

        filterlog(99, newestDay)
        save()
    }

    function importDeath(log) {
        //死体を記録
        var day = today
        var deathday = today
        var no = indexOfName[$(log).find("b").eq(0).text()]
        var text = $(log).text()
        var reason = ""
        if (/無残な姿で発見/.test(text)) {
            reason = "bite"
        } else if (/死体で発見/.test(text)) {
            reason = "note"
        } else if (/村民協議の結果|猫又の呪い/.test(text)) {
            reason = "exec"
            isdaytime ? day-- : deathday++
        } else if (/突然死/.test(text)) {
            reason = "sudden"
            deathday++
        }
        playerInfo[no].death = deathday

        if (!deathLog[reason]) deathLog[reason] = []
        deathLog[reason].fillundef([], day)

        if (!deathLog[reason][day].includes(no)) {
            deathLog[reason][day].push(no)
        }
    }

    function importVote(logs) {
        //投票を取り込む
        var day = $(logs[0])
            .text()
            .match(/(\d{1,2})日目 投票結果。/)
        day = day[1] - 1

        for (var player of playerInfo) {
            player.vote[day] = []
            player.vote.fillundef("-", logs.length)
        }

        for (let times = 0; times < logs.length; times++) {
            $(logs[times])
                .find("tr")
                .each(function (i, vote) {
                    var voter = indexOfName[$(vote).find("b").eq(0).text()]
                    var target = $(vote).find("b").eq(1).text()
                    playerInfo[voter].vote[day][times] = target
                })
        }
        votetimes[day] = logs.length
        votetimes.fillundef(0)
    }

    //**********************************************
    //   refresh関係
    //**********************************************

    function refresh() {
        //再表示まとめて
        refreshDiscussLog()
        refreshPlayerInfoTable()
        refreshVoteTable()
        refreshSummary()
    }

    function refreshPlayerInfoTable() {
        //プレイヤー情報更新 くっそ長い

        //初期化
        playerInfoTable.empty()

        if (!playerInfo.length) return false

        var playersList = { 99: "" }
        for (let i of range()) {
            playersList[i] = playerInfo[i].name
        }
        var joblist = {
            gray: "",
            fortune: "占い",
            necro: "霊能",
            share: "共有",
            guard: "狩人",
            cat: "猫又",
            beast: "人外",
        }
        var reasoninglist = {
            gray: "",
            real: "真",
            fake: "偽",
            villager: "村人",
            madman: "狂人",
            wolf: "人狼",
            fox: "妖狐",
        }
        var resultlist = { notinput: "", white: "○", black: "●" }

        //-------------------------名前列
        var namerow = new Tr("", "namerow")
        namerow.add("<a id='filterlink_99_99'>全ログ</a>")
        for (let player of playerInfo) {
            namerow.add(
                `<a id='filterlink_${player.no}_99'>${player.name}</a>`,
                `player_${player.no}`
            )
        }
        namerow.appendTo(playerInfoTable)

        //-------------------------発言数列
        for (var day = 1; day <= newestDay; day++) {
            var row = new Tr("", "talknumrow")
            row.add(`<a id=filterlink_99_${day}>${day + 1}日目</a>`)
            for (let player of playerInfo) {
                var talknum = $("#log_day" + day).find("tr.talk_player" + player.no).length
                if (talknum === 0) talknum = ""
                row.add(
                    `<a id=filterlink_${player.no}_${day}>${talknum}</a>`,
                    "player_" + player.no
                )
            }
            row.appendTo(playerInfoTable)
        }

        //-------------------------CO列
        var jobrow = new Tr("", "jobrow")
        jobrow.add("CO")
        for (let player of playerInfo) {
            let select = createSelectBox(joblist, player.job, {
                id: `player_${player.no}_job`,
                class: "jobselect",
            })
            jobrow.add(select, "player_" + player.no)
        }
        jobrow.appendTo(playerInfoTable)

        //-------------------------推理列
        jobrow = new Tr("", "jobrow")
        jobrow.add("推理")
        for (let player of playerInfo) {
            let select = createSelectBox(reasoninglist, player.reasoning, {
                id: `player_${player.no}_reasoning`,
                class: "reasoningselect",
            })
            jobrow.add(select, "player_" + player.no)
        }
        playerInfoTable.append(jobrow.text())

        //-------------------------役職結果列
        for (day = 1; day <= newestDay; day++) {
            var resultrow = new Tr("result_" + day, "resultrow")
            resultrow.add(`占霊結果 ${day + 1}日目`)

            for (let player of playerInfo) {
                if (
                    (player.job == "fortune" && day < player.death) ||
                    (player.job == "necro" && day < player.death && day > 1)
                ) {
                    //占い師、霊能者で、結果があるなら
                    let select1 = createSelectBox(playersList, 99, {
                        id: `target_${player.no}_${day}`,
                        class: "jobtarget",
                    })
                    let select2 = createSelectBox(resultlist, "notinput", {
                        id: `judge_${player.no}_${day}`,
                        class: "jobjudge",
                    })
                    resultrow.add(select1 + select2, "player_" + player.no)
                } else {
                    resultrow.add("", "player_" + player.no)
                }
            }
            playerInfoTable.append(resultrow.text())
        }
        refreshJobResult()
        switchAliveFilter()
        switchInputMode()
        coloring()

        //絞込機能つける
        $("#playerInfoTable a").on("click", function (e) {
            var id = $(this).attr("id").split("_")
            filterlog(id[1], id[2])
        })

        //変更は逐一反映
        $("select.jobselect").on("change", function () {
            var no = $(this).attr("id").split("_")[1] - 0
            playerInfo[no].job = $(this).val()

            refreshPlayerInfoTable()
            refreshJobInitial()
            refreshSummary()
            if (setting.coloringName.value == "yes") setNameColor()
            save()
        })

        $("select.reasoningselect").on("change", function () {
            var no = $(this).attr("id").split("_")[1] - 0
            playerInfo[no].reasoning = $(this).val()

            refreshJobInitial()
            coloring()
            save()
        })

        $("select.jobtarget").on("change", function (e) {
            var id, no, day
            ;[id, no, day] = $(this).attr("id").split("_")

            playerInfo[no].jobresult.fillundef({ target: 99, judge: "notinput" }, +day)
            playerInfo[no].jobresult[day].target = $(this).val() - 0

            refreshSummary()
            coloring()
            save()
        })

        $("select.jobjudge").on("change", function (e) {
            var id, no, day
            ;[id, no, day] = $(this).attr("id").split("_")

            playerInfo[no].jobresult.fillundef({ target: 99, judge: "notinput" }, +day)
            playerInfo[no].jobresult[day].judge = $(this).val()
            refreshSummary()
            coloring()
            save()
        })
    }

    function refreshJobResult() {
        var fortunes = playerInfo.filter((p) => {
            return p.job == "fortune"
        })
        for (let fortune of fortunes) {
            for (let day = 1; day < Math.min(fortune.death, newestDay + 1); day++) {
                if (fortune.jobresult[day]) {
                    //既に結果が入力されているとき
                    $("#target_" + fortune.no + "_" + day).val(fortune.jobresult[day].target)
                    $("#judge_" + fortune.no + "_" + day).val(fortune.jobresult[day].judge)
                }
            }
        }

        var necros = playerInfo.filter((p) => {
            return p.job == "necro"
        })
        for (let necro of necros) {
            for (let day = 2; day < Math.min(necro.death, newestDay + 1); day++) {
                if (necro.jobresult[day]) {
                    //既に結果が入力されているとき
                    $("#target_" + necro.no + "_" + day).val(necro.jobresult[day].target)
                    $("#judge_" + necro.no + "_" + day).val(necro.jobresult[day].judge)
                } else if (deathLog.exec[day - 1]) {
                    $("#target_" + necro.no + "_" + day).val(deathLog.exec[day - 1])
                }
            }
        }
    }

    function refreshDiscussLog() {
        discussLogTable.empty()
        if (!discussLog.length) return false

        discussLog.forEach(function (logs, day) {
            if (!logs) return

            var tbody = $("<tbody></tbody>", { id: "log_day" + day })
            var trs = `<tr class="systemlog"><td colspan="2">${day + 1}日目</td></tr>`

            for (var log of logs) {
                var cl = log.name in indexOfName ? "talk_player" + indexOfName[log.name] : ""
                trs += `<tr class="${cl}"><td>${log.namehtml}<span class='jobinitial'></span></td><td>${log.content}</td></tr>`
            }
            tbody.append(trs).prependTo(discussLogTable)
        })
        refreshJobInitial()
    }

    function refreshJobInitial() {
        var jobinitial = {
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
        }
        for (var player of playerInfo) {
            var job = jobinitial[player.reasoning] + jobinitial[player.job]
            $("tr.talk_player" + player.no + " span").html(job)
        }
    }

    function refreshVoteTable() {
        //投票テーブルリライト
        voteTable.empty()

        var tr = new Tr()
        tr.add("プレイヤー")
        for (var day = 1; day <= newestDay; day++) {
            let colspan = votetimes[day] || 1
            tr.addhtml(`<td colspan="${colspan}">${day + 1}日目</td>`)
        }
        voteTable.append(tr.text())

        for (var player of playerInfo) {
            tr = new Tr()
            tr.add(player.name)
            for (day = 1; day <= newestDay; day++) {
                let times = votetimes[day] || 1
                for (let i = 0; i < times; i++) {
                    var text = player.vote[day] && player.vote[day][i] ? player.vote[day][i] : "-"
                    tr.add(text)
                }
            }
            voteTable.append(tr.text())
        }
    }

    function refreshSummary() {
        var color = { notinput: "？", white: "○", black: "●" }
        var reasons = ["bite", "note", "exec", "sudden"]
        var reasonflavor = { bite: "無残", note: "デスノ", exec: "処刑", sudden: "突然死" }

        summaryTable.empty()

        var tr = new Tr()
        tr.addhtml("<td colspan='2'></td>")
        for (var day = 1; day <= newestDay; day++) {
            tr.add("" + (day + 1) + "日目")
        }
        tr.appendTo(summaryTable)

        var fn = playerInfo.filter((player) => {
            return player.job == "fortune"
        })

        for (let i = 0; i < fn.length; i++) {
            let player = fn[i]
            tr = new Tr()
            if (i == 0) tr.addhtml(`<td rowspan=${fn.length}>占い師</td>`)
            tr.add(player.name)

            for (day = 1; day <= newestDay; day++) {
                let name = "",
                    judge = ""
                if (player.jobresult[day] && player.jobresult[day].target != 99) {
                    name = playerInfo[player.jobresult[day].target].name
                    judge = color[player.jobresult[day].judge]
                }
                tr.add(name + judge)
            }
            tr.appendTo(summaryTable)
        }

        fn = playerInfo.filter((player) => {
            return player.job == "necro"
        })

        for (let i = 0; i < fn.length; i++) {
            let player = fn[i]
            tr = new Tr()
            if (i == 0) tr.addhtml(`<td rowspan=${fn.length}>霊能者</td>`)
            tr.add(player.name)
            for (let day = 1; day <= newestDay; day++) {
                let name = "",
                    judge = ""
                if (player.jobresult[day] && player.jobresult[day].target != 99) {
                    name = playerInfo[player.jobresult[day].target].name
                    judge = color[player.jobresult[day].judge]
                }
                tr.add(name + judge)
            }
            tr.appendTo(summaryTable)
        }

        for (var reason of reasons) {
            if (!deathLog[reason]) continue

            tr = new Tr()
            if (reason == "bite") tr.addhtml("<td rowspan='4'>死亡ログ</td>")
            tr.add(reasonflavor[reason])

            for (day = 1; day <= newestDay; day++) {
                var text = "-"
                if (deathLog[reason][day]) {
                    text = deathLog[reason][day].map((x) => playerInfo[x].name).join("<br>")
                }
                tr.add(text)
            }
            tr.appendTo(summaryTable)
        }
    }

    //**********************************************
    //   表示
    //**********************************************

    var switchDispArea = function (_this) {
        //メモのログ/投票表示切り替え
        $("div.tab").removeClass("active")
        $(_this).addClass("active")

        $("#memoBody > div").hide()
        var mode = $(_this).data("value")
        $(`#${mode}Area`).show()
    }

    function switchAliveFilter(_this) {
        if (_this) {
            data.isfilter = $(_this).data("value") == "on"
            save()
        }
        $("div.select.filter").removeClass("active")
        data.isfilter
            ? $("#showAliveButton").addClass("active")
            : $("#showAllButton").addClass("active")
        for (var player of playerInfo) {
            if (!data.isfilter || player.vital == "alive" || player.job != "gray") {
                $("td.player_" + player.no).show()
            } else {
                $("td.player_" + player.no).hide()
            }
        }
    }

    function switchInputMode(_this) {
        if (_this) {
            data.inputMode = $(_this).data("value")
            save()
        }
        $("div.select.inputmode").removeClass("active")
        $(`#input${data.inputMode}Button`).addClass("active")
        for (var day = 1; day <= newestDay; day++) {
            if (data.inputMode == "full" || (data.inputMode == "simple" && day == newestDay)) {
                $("#result_" + day).show()
            } else {
                $("#result_" + day).hide()
            }
        }
    }

    function filterlog(player, day) {
        if (player < 99) {
            $("#discussLogTable tr").hide()
            $("tr.systemlog").show()
            $("tr.talk_player" + player).show()
        } else {
            $("#discussLogTable tr").show()
        }

        if (day < 99) {
            $("#discussLogTable tbody").hide()
            $("#log_day" + day).show()
        } else {
            $("#discussLogTable tbody").show()
        }
    }

    function coloring() {
        var notgray = range().filter((i) => playerInfo[i].job != "gray")

        var fortunes = playerInfo.filter((player) => player.job == "fortune")
        if (setting.grayregion.value == "yes") {
            fortunes = fortunes.filter((fortune) => {
                return fortune.reasoning == "gray" || fortune.reasoning == "real"
            })
        }
        fortunes.forEach(function (player) {
            notgray = notgray.concat(player.jobresult.map((p) => p.target))
        })

        var graylist = range().filter((no) => {
            return !notgray.includes(no)
        })

        $("tr.namerow td").removeClass("death").removeClass("gray")
        for (var player of playerInfo) {
            if (player.vital == "death") {
                $("tr.namerow .player_" + player.no).addClass("death")
            } else if (graylist.includes(player.no)) {
                $("tr.namerow .player_" + player.no).addClass("gray")
            }
        }
    }

    function reset() {
        data = {
            playerInfo: [],
            indexOfName: {},
            isAutoReload: false,
            importlogday: 0,
            discussLog: [],
            deathLog: { exec: [], bite: [] },
            isfilter: false,
            inputMode: "simple",
            villageno: getVillageno(),
            setting: data.setting,
            votetimes: [],
        }
        playerInfo = data.playerInfo
        indexOfName = data.indexOfName
        discussLog = data.discussLog
        deathLog = data.deathLog
        setting = data.setting
        votetimes = data.votetimes
        save()
    }

    //**********************************************
    //   乱数表
    //**********************************************

    function rnd(n, digit) {
        //0～n-1の整数乱数 digitを指定するとゼロパディング
        digit = digit || false
        var r = Math.floor(Math.random() * n)
        if (digit) r = padding(r, digit)
        return r
    }

    function padding(num, digit) {
        //ゼロパディング
        return ("0000000000" + num).slice(-digit)
    }

    function makernd() {
        //四桁乱数
        return rnd(10000, 4)
    }

    function makematrix(num) {
        //乱数表
        var l = []
        var mat = ""
        for (var i = 0; i < num; i++) {
            l[i] = padding(i + 1, 2)
        }
        for (i = 0; i < num; i++) {
            var r = rnd(num - i)
            mat += l[r]
            mat += i % 5 == 4 ? "\n" : " / "
            for (var j = r; j < num - 1; j++) {
                l[j] = l[j + 1]
            }
        }
        return mat
    }

    function makerndjob(num) {
        //役職対応
        var jobs = ["村　人", "占い師", "霊能者", "狩　人", "共有者", "狂　人", "背徳者"]
        var cir = ["①", "②", "③", "④", "⑤", "⑥", "⑦"]
        var result = ""
        var isimo = num == 15 || num == 19
        var n = isimo ? 7 : 6
        var i, r
        if (isimo) {
            result += cir[rnd(n)] + "\n\n"
        }
        var l = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        for (i = 0; i < n; i++) {
            r = rnd(10 - i)
            result = result + jobs[i] + "：" + l[r] + rnd(100, 2) + "\n"
            for (var j = r; j <= num - 1; j++) {
                l[j] = l[j + 1]
            }
        }
        return result
    }

    //**********************************************
    //   その他小物
    //**********************************************

    function getToday() {
        //表示されている日付チェック
        var day = /<font size="\+2">(\d{1,2})/.exec(body.html())
        today = day ? day[1] - 1 : 0
        newestDay = Math.max(today, discussLog.length - 1)
    }

    function getVillageno() {
        var vno = $("title").text().slice(0, 6) - 0
        return vno
    }

    function createSelectBox(option, selected, attr) {
        //optionを持つselectを作る。str。optionは{value: innerHTML}の形式で
        let attrtext = ""
        if (attr) {
            for (let k in attr) {
                attrtext = attrtext + ` ${k}="${attr[k]}"`
            }
        }
        var s = `<select${attrtext}>`
        for (var i in option) {
            let issl = i == selected ? "selected" : ""
            s += `<option value="${i}" ${issl}>${option[i]}</option>`
        }
        s += "</select>"
        return s
    }

    function editSpeakField(text) {
        //発言欄をtextにする
        textarea.val(text)
        memoContainer.hide()
    }

    function popupMessage(text) {
        //メッセージ
        messageArea.text(text).show()
        setTimeout(function () {
            messageArea.hide()
        }, 1500)
    }

    //**********************************************
    //   便利設定
    //**********************************************
    var left
    function setAlertVote() {
        //未投票アラート
        if ($("font[size=6]").size()) {
            warningArea.show()
            var cmbplayer = $("select[name=CMBPLAYER]").clone()
            var votebutton = $("<input />", {
                type: "button",
                value: "投票",
                on: {
                    click: function () {
                        $("select").eq(0).val("VOTE")
                        document.forms[0].submit()
                    },
                },
            })
            left = counts
            warningArea.html("未投票です！ あと<span id='left'></span>秒")
            warningArea.append(cmbplayer)
            warningArea.append(votebutton)
            cmbplayer.on("change", function () {
                $("select[name=CMBPLAYER]").val($(this).val())
            })
            $("#left").html(left)
            setInterval(function () {
                left--
                $("#left").html(left)
            }, 1000)
        }
    }

    function receiveKeyResponse() {
        //キー入力を受け付けるかどうか
        $(window).on("keydown", function (e) {
            if (setting.send_support.value == "ctrl" && e.ctrlKey && e.keyCode == 13) {
                document.forms[0].submit()
            } else if (setting.send_support.value == "shift" && e.shiftKey && e.keyCode == 13) {
                document.forms[0].submit()
            }
        })
    }

    function dispSuggest() {
        var colorselect = createSelectBox(COLORLIST, 0, { id: "colorlist" })
        var coloredit = `<td class="coloredit">アイコン色：</td><td class="coloredit">${colorselect}</td>`
        var iconsupport =
            "<td class='iconsupport'><input type='button' id='pasteurl' value='/../../imgbbs/img/'></td>"

        commandtable.find("td").eq(1).after(coloredit).after(iconsupport)
        commandtable.find("td").eq(-2).addClass("cmbplayer")
        commandtable.find("td").eq(-1).addClass("cmbplayer")

        $("#colorlist").on("change", function () {
            editSpeakField($(this).val())
        })
        $("#pasteurl").on("click", function () {
            editSpeakField("/../../imgbbs/img/")
        })
        $("select")
            .eq(0)
            .on("change", function () {
                $("td.coloredit").hide()
                $("td.iconsupport").hide()
                $("td.cmbplayer").hide()
                if ($(this).val() == "ICONCHG") {
                    $("td.coloredit").show()
                } else if ($(this).val() == "BCONCHG") {
                    $("td.iconsupport").show()
                } else {
                    $("td.cmbplayer").show()
                }
            })
    }

    function highlightDeathnote() {
        var td = infotable.find("td:last")
        if (/アナタの家の前に/.test(td.html())) {
            td.css("color", "red")
        }
    }

    function setAutoImportLog() {
        if (!data.importlogday) data.importlogday = 0
        if (setting.auto_import_log.value == "alltime") {
            importLog()
        } else if (setting.auto_import_log.value == "onetime") {
            if (today > data.importlogday && /<font size="\+2">投票/.test(body.html())) {
                data.importlogday = today
                importLog()
                save()
                popupMessage("ログを取り込みました。")
            }
        }
    }

    var autoReloadFlg

    function setAutoReload() {
        autoReloadFlg = setTimeout(function () {
            textarea.val("")
            document.forms[0].submit()
        }, setting.autoreload_interval.value * 1000)
    }

    function castASpellOnMe() {
        var q = $("#caspequery").val()
        var num = $("#caspenum").val()
        if (num > 10) num = 10
        $.post(
            "http://mobajinro.s178.xrea.com/caspe/getWaffle.php",
            {
                query: q,
                num: num,
            },
            function (data) {
                var txt = data.replace(/\n+/g, "<br>")
                var nos = txt.match(/\d{4}/g)
                if (nos) {
                    for (var no of nos) {
                        var src = no
                        if (no - 0 > 4674) src = "/../../imgbbs/img/" + no
                        txt = txt.replace(
                            no,
                            `<img data-no='${no}' src='http://jinrou.dip.jp/~jinrou/img/alive_${src}.gif'>`
                        )
                    }
                }
                $("#casperesult").html(txt)
                $("#casperesult img").on("click", function () {
                    $("#iconno").val($(this).data("no"))
                    $("#casperesult img").removeClass("iconselected")
                    $(this).addClass("iconselected")
                })
            }
        )
    }

    function setClipboard(text, disc) {
        //クリップボードにコピー 発言欄初期化する注意
        textarea.val(text).select()
        document.execCommand("copy")
        textarea.val("")
    }

    function setNameColor() {
        if (setting.coloringName.value != "yes") return false
        $("b").each((i, e) => {
            let name = $(e).text()
            if (name in indexOfName) {
                let i = indexOfName[name]
                let job = playerInfo[i].job
                $(e).removeClass().addClass(colorSetting[job].value)
            }
        })
    }

    //**********************************************
    //   個人設定の読み込み
    //**********************************************

    load()

    //**********************************************
    //   cssの追加と書き換え
    //**********************************************
    var style = []

    //見た目変更
    if (setting.rewrite_css.value == "yes") {
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
        ]
    }

    //追加分
    style = style.concat([
        `:root{--theme-color:${color[setting.theme_color.value].main}; --sub-color:${
            color[setting.theme_color.value].sub
        };}`,
        "*{box-sizing:border-box;}",
        "body{margin:0;}",
        "form{margin:8px;}",
        "#memoContainer{display:none; width:100%; height:100%; position:fixed; top:0px; left:0px; background-color:rgba(180,180,180,0.8); padding:15px; overflow:auto;}",
        "#floatButtonArea{position:fixed; right:15px; top:15px;}",
        "#floatButtonArea > div{margin:0px 2px; display:inline-block; vertical-align: top; width:110px;  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.4);}",
        "#messageArea{width:400px; height:80px; position:fixed; left:50%; transform: translate(-50%, 0); top:15px; display:none;}",
        "#messageArea{text-align:center;font-size:14px; color:black;vertical-align:middle;padding-top:5px;}",
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
        "#voteTable, #summaryTable{font-size:11px; border-collapse:collapse; margin-bottom:10px;color:black;}",
        "#voteTable td, #summaryTable td{border:1px solid #666; padding:2px; }",
        "#toolArea_hid {display:none;}",
        "#setting, #colorSetting{font-size:13px; position:fixed; right:10px; bottom:10px; display:none; width:400px; height:300px; background-color:white;}",
        "#setting input[type=number], #setting input[type=text]{width:60px;}",
        ".coloredit, .iconsupport{display:none;}",
        ".voiceloud {padding:0px 5px;}",
        ".voiceloud div:not(:first-of-type){margin-top:5px;}",
        ".voice {width:30px;height:30px;font-size:16px;border:1px solid black; border-radius:2px;background-color:white;line-height:28px;text-align:center;color:black; cursor:pointer;}",
        ".voice.voice_selected{border:3px solid red; line-height:24px;}",
        "#caspe{display:none; position:fixed; right:10px; bottom:10px; width:400px; height:300px; solid #333; overflow:auto; font-size:9pt;}",
        "#caspe input[type=text]{width:100px;}",
        "#caspe input[type=number]{width:50px}",
        "#caspe, #setting,#colorSetting, #messageArea{box-shadow: 0 3px 5px rgba(0, 0, 0, 0.4); border-top:16px solid var(--theme-color); background-color:#efefef; padding:10px;}",
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
        ".black{} .pink{color:deeppink;} .red{color:red;} .green{color:green;}",
        ".purple{color:purple;} .brown{color:brown;} .blue{color:blue;}",
        ".gaming{background:linear-gradient(to right, #f33,#ff3,#3f3,#3ff,#33f,#f3f,#f33) ;-webkit-background-clip: text; -webkit-text-fill-color:transparent;}",
    ])
    if (setting.layout.value == "yes") {
        style = style.concat([
            "#logArea{display: flex; flex-direction:column; flex-wrap:wrap;}",
            "#playerInfoArea{height:calc(100% - 50px); overflow:auto hidden; width:50%; padding:5px;}",
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
        ])
    } else {
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
        ])
    }
    $("<style></style>").html(style.join("\n")).appendTo($("head"))

    //**********************************************
    //   ツール用のもろもろを追加
    //**********************************************

    //大枠
    var memoContainer = $("<div></div>", { id: "memoContainer" }).appendTo(body)
    var messageArea = $("<div></div>", { id: "messageArea" }).appendTo(body)
    var warningArea = $("<div></div>", { id: "warningArea" }).appendTo(body)
    var floatButtonArea = $("<div></div>", { id: "floatButtonArea" }).appendTo(body)
    var settingArea = $("<div></div>", { id: "setting" }).appendTo(body)
    var colorSettingArea = $("<div></div>", { id: "colorSetting" }).appendTo(body)
    var caspe = $("<div></div>", { id: "caspe" }).appendTo(body)

    //ブロック
    var memoMenu = $("<div></div>", { id: "memoMenu" }).appendTo(memoContainer)
    var memoTab = $("<div></div>", { id: "memoTab" }).appendTo(memoContainer)
    var memoBody = $("<div></div>", { id: "memoBody" }).appendTo(memoContainer)

    //各div
    var logArea = $("<div></div>", { id: "logArea" }).appendTo(memoBody)
    var voteArea = $("<div></div>", { id: "voteArea" }).appendTo(memoBody)
    var playerInfoArea = $("<div></div>", { id: "playerInfoArea" }).appendTo(logArea)
    var buttonArea = $("<div></div>", { id: "buttonArea" }).appendTo(logArea)
    var discussLogArea = $("<div></div>", { id: "discussLogArea" }).appendTo(logArea)

    //テーブル
    var playerInfoTable = $("<table>", { id: "playerInfoTable" }).appendTo(playerInfoArea)
    var discussLogTable = $("<table>", { id: "discussLogTable" }).appendTo(discussLogArea)
    var voteTable = $("<table>", { id: "voteTable" }).appendTo(voteArea)
    var summaryTable = $("<table>", { id: "summaryTable" }).appendTo(voteArea)

    //観戦時のみ自動更新ボタン
    if ($("td.CLSTD01").eq(1).text() == "◆ 再表示") {
        var onoff = data.isAutoReload ? "ON" : "OFF"
        floatButtonArea.append("<div><a id='autoReload'>自動更新：" + onoff + "</a></div>")
        if (data.isAutoReload) setAutoReload()

        $("#autoReload").click(function () {
            data.isAutoReload = !data.isAutoReload
            save()
            var onoff = data.isAutoReload ? "ON" : "OFF"
            $("#autoReload").text("自動更新：" + onoff)
            popupMessage("自動更新を" + onoff + "にしました。")

            if (data.isAutoReload) {
                setAutoReload()
            } else {
                clearTimeout(autoReloadFlg)
            }
        })
    }

    floatButtonArea.append(
        [
            "<div id='toolArea'><a>ツール</a>",
            "<div id='toolArea_hid'>",
            "<a id='tool1'>四桁乱数</a>",
            "<a id='tool2'>乱数表</a>",
            "<a id='tool3'>役職一覧と丸数字</a>",
            "<a id='dispcaspe'>きゃすぺ</a>",
            "<a id='dispsetting'>設定</a>",
            "<a id='dispcolorsetting'>色設定</a></div>",
            "</div>",
        ].join("\n")
    )
    floatButtonArea.append("<div><a id='toggleButton'>メモ表示/非表示</a></div>")

    //共通のボタン
    memoMenu.append("<div class='button' id='importButton'>ログの取り込み</div>")
    memoMenu.append("<div class='button' id='resetButton'>リセット</div>")
    memoMenu.append("<div class='button' id='reloadButton'>更新</div>")

    //タブ
    memoTab.append("<div class='tab active' id='logDispButton' data-value='log'>発言ログ</div>")
    memoTab.append("<div class='tab' id='voteDispButton' data-value='vote'>投票履歴</div>")

    //各ブロックのボタン
    buttonArea.append(
        [
            "<div>絞り込み",
            "<div class='select filter' id='showAllButton' data-value='off'>全員表示</div>",
            "<div class='select filter' id='showAliveButton' data-value='on'>生存+役職のみ</div>",
            "</div>",
        ].join("")
    )
    buttonArea.append(
        [
            "<div>役職入力",
            "<div class='select inputmode' id='inputnoneButton' data-value='none'>なし</div>",
            "<div class='select inputmode' id='inputsimpleButton' data-value='simple'>最新のみ</div>",
            "<div class='select inputmode' id='inputfullButton' data-value='full'>全日</div>",
            "</div>",
        ].join("")
    )

    var settingTable = $("<table></table>", { id: "settingtable" }).appendTo(settingArea)
    settingArea.append(
        `<div class="closebutton"><input type="button" onclick="document.getElementById('setting').style.display='none';" value='閉じる'></div>`
    )

    for (var k in setting) {
        var item = setting[k]
        var tr = new Tr()
        tr.add(item.name)
        tr.add(createSelectBox(item.option, item.value, { id: k }))
        tr.appendTo(settingTable)
    }

    var colorSettingTable = $("<table></table>", { id: "settingtable" }).appendTo(colorSettingArea)
    colorSettingArea.append(
        `<div class="closebutton"><input type="button" onclick="document.getElementById('colorSetting').style.display='none';" value='閉じる'></div>`
    )

    for (k in colorSetting) {
        item = colorSetting[k]
        tr = new Tr()
        tr.add(item.name)
        tr.add(createSelectBox(item.option, item.value, { id: "color_" + k }))
        tr.appendTo(colorSettingTable)
    }

    caspe.html(
        [
            "キーワード：<input type='text' id='caspequery'>数：<input type='number' id='caspenum' value='1'><input type='button' id='castaspellonme' value='きゃすぺ'>",
            "<div id='casperesult'></div>",
            "<input type='button' id='changeicon' value='選択したアイコンを設定'>",
            "<input type='hidden' id='iconno' value=''>",
            `<div class="closebutton"><input type='button' onclick='document.getElementById("caspe").style.display = "none";' value='閉じる'></div>`,
        ].join("\n")
    )

    //**********************************************
    //   ロードが完了したら仕込み
    //**********************************************

    $(function () {
        playertable = $("table").eq(1)
        textareatable = $("table[cellspacing=0]").eq(-1)
        discusstable = $("table[cellpadding=0]").not("table.CLSTABLE2").last()
        infotable = $("table[cellspacing=0]").eq(0)
        commandtable = $("table[cellspacing=0]").eq(-2)
        textarea = $("textarea").eq(0)
        body = $("body")

        var voicebutton =
            "<td class='voiceloud'><div class='voice' data-value='MSG'>普</div><div class='voice' data-value='MSG2'><strong>強</strong></div><div class='voice' data-value='MSG3'><span style='color:#6666ee;'>弱</span></div></td>"
        var submitbutton =
            "<td><input type='submit' value='行動/更新' style='height:100px; width:150px;'></td>"
        textareatable.find("td:last").after(submitbutton).after(voicebutton)

        switchInputMode()
        switchAliveFilter()

        $("#toggleButton").on("click", () => {
            memoContainer.toggle()
        })
        $("#importButton").on("click", function () {
            importLog()
            refresh()
        })
        $("div.tab").on("click", function () {
            switchDispArea(this)
        })
        $("#resetButton").on("click", function () {
            if (window.confirm("ログをすべてリセットします。本当によろしいですか？")) {
                reset()
                getToday()
                refresh()
            }
        })
        $("#reloadButton").on("click", function () {
            textarea.val("")
            document.forms[0].submit()
        })

        $("div.select.filter").on("click", function () {
            switchAliveFilter(this)
        })

        $("div.select.inputmode").on("click", function () {
            switchInputMode(this)
        })

        $("#toolArea").hover(
            () => {
                $("#toolArea_hid").show()
            },
            () => {
                $("#toolArea_hid").hide()
            }
        )
        $("#tool1").on("click", () => {
            setClipboard(makernd())
            popupMessage("コピーしました:4桁乱数")
        })
        $("#tool2").on("click", () => {
            updateplayerInfo()
            setClipboard(makematrix(playerInfo.length))
            popupMessage("コピーしました:乱数表")
        })
        $("#tool3").on("click", () => {
            updateplayerInfo()
            setClipboard(makerndjob(playerInfo.length))
            popupMessage("コピーしました:役職一覧")
        })
        $("#dispcaspe").on("click", () => {
            $("#caspe").show()
        })
        $("#dispsetting").on("click", () => {
            $("#setting").show()
        })
        $("#dispcolorsetting").on("click", () => {
            $("#colorSetting").show()
        })
        $("#setting select").on("change", function () {
            setting[$(this).attr("id")].value = $(this).val()
            save()
        })
        $("#colorSetting select").on("change", function () {
            let id = $(this).attr("id").slice(6)
            colorSetting[id].value = $(this).val()
            save()
            setNameColor()
        })
        $("#castaspellonme").on("click", function () {
            castASpellOnMe()
        })
        $("#changeicon").on("click", function () {
            var no = $("#iconno").val()
            if (no == "") return false
            if (no - 0 > 4674) no = "/../../imgbbs/img/" + no
            editSpeakField(no)
            $("select").eq(0).val("BCONCHG")
            document.forms[0].submit()
        })

        textarea.focus()

        $("div.voice").click(function () {
            $("select").eq(0).val($(this).data("value"))
            $("div.voice").removeClass("voice_selected")
            $(this).addClass("voice_selected")
        })

        $(window).on("keydown", function (e) {
            if (e.keyCode == 27) {
                memoContainer.hide()
            }
        })

        if (localStorage.debug == "on") {
            memoMenu.append("<div class='button' id='debugButton'>デバッグ用</div>")
            $("#debugButton").click(() => {
                console.log(data, today)
            })
        }

        getToday()
        dispSuggest()
        highlightDeathnote()

        if (setting.auto_import_log.value != "none") setAutoImportLog()
        if (setting.alert_vote.value == "yes") setAlertVote()
        if (setting.send_support.value != "none") receiveKeyResponse()
        if (setting.coloringName.value == "yes") setNameColor()
        if (data.villageno != getVillageno()) reset()

        refresh()

        if (!localStorage.memoVersion || localStorage.memoVersion != "1.4.2") {
            localStorage.memoVersion = "1.5.0"
            var notice = $("<div></div>", { id: "notice" }).appendTo(body)
            /*
            notice.attr("style","position:fixed;left:calc(50% - 200px);bottom:calc(50% - 100px); width:400px; height:200px;box-shadow: 0 3px 5px rgba(0, 0, 0, 0.4); border-top:16px solid var(--theme-color); background-color:#efefef; padding:10px; font-size:10pt;")
            notice.html("<span style='font-size:12pt'>ウドメモver1.4に伴うお知らせ</span><br>未投票時にメモを見ながら投票できる機能を追加しましたが、この機能は<b>テストできていません。</b>必ず投票状態になったことを<b>目視確認</b>してください。また正常に動かなかった場合は教えてね（はーと）<br>")
            notice.append($("<input>",{on:{click:function(){$("#notice").hide();}}, value:"表示しない", type:"button"}))
            */
        }
    })
})(jQuery)
