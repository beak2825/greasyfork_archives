// ==UserScript==
// @name         Dice export for charasheet.vampire-blood.net
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  为charasheet.vampire-blood.net卡站增加导出到骰子.st指令的功能。
// @author       okotori
// @match        *://charasheet.vampire-blood.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423159/Dice%20export%20for%20charasheetvampire-bloodnet.user.js
// @updateURL https://update.greasyfork.org/scripts/423159/Dice%20export%20for%20charasheetvampire-bloodnet.meta.js
// ==/UserScript==

(function() {
    var skill_aliases = {
        "STR": ["力量", "str"],
        "CON": ["体质", "con"],
        "POW": ["意志", "pow"],
        "DEX": ["敏捷", "dex"],
        "APP": ["外貌", "app"],
        "SIZ": ["体型", "siz"],
        "EDU": ["教育", "edu"],
        "INT": ["智力", "int"],
        "HP": "hp",
        "MP": "mp",
        "アイ\nデア": "灵感",
        "幸運": ["幸运", "luk"],
        "知識": ["知识"],

        "回避": "回避",
        "キック": "踢",
        "組み付き": "擒抱",
        "こぶし（パンチ）": ["斗殴", "拳击"],
        "頭突き": ["头槌", "头锤"],
        "投擲": "投掷",
        "マーシャルアーツ": "武术",
        "拳銃": "手枪",
        "サブマシンガン": "冲锋枪",
        "ショットガン": ["散弹枪", "霰弹枪"],
        "マシンガン": "机枪",
        "ライフル": "步枪",

        "応急手当": "急救",
        "鍵開け": "开锁",
        "隠す": "藏匿",
        "隠れる": "躲藏",
        "聞き耳": "聆听",
        "忍び歩き": "潜行",
        "写真術": "摄影",
        "精神分析": "精神分析",
        "追跡": ["追踪", "跟踪"],
        "登攀": "攀爬",
        "図書館": ["图书馆","图书馆利用","图书馆使用"],
        "目星": ["侦查", "侦察"],

        "運転()": ["驾驶", "驾驶（{X}）", "{X}"],
        "機械修理": ["机械修理", "机械维修"],
        "重機械操作": ["重机械操作", "重机械"],
        "乗馬": "骑马",
        "水泳": "游泳",
        "製作()": ["制作", "制作（{X}）", "{X}"],
        "操縦()": ["操纵", "操纵（{X}）", "{X}"],
        "跳跃": "跳跃",
        "電気修理": ["电气修理", "电器维修", "电气维修"],
        "ナビゲート": ["导航", "引航"],
        "変装": ["变装", "乔装"],

        "言いくるめ": "快速交谈",
        "信用": ["信用", "信誉度", "信誉"],
        "説得": "劝说",
        "値切り": "议价",
        "母国語()": ["母语", "母语（{X}）", "{X}"],

        "医学": "医学",
        "オカルト": "神秘学",
        "化学": "化学",
        "クトゥルフ神話": "克苏鲁神话",
        "芸術()": ["艺术", "艺术（{X}）", "{X}"],
        "経理": "会计学",
        "考古学": "考古学",
        "コンピューター": ["电脑使用", "计算机使用", "计算机"],
        "心理学": "心理学",
        "人類学": "人类学",
        "生物学": "生物学",
        "地質学": "地质学",
        "電子工学": "电子学",
        "天文学": "天文学",
        "博物学": "博物学",
        "物理学": "物理学",
        "法律": "法律",
        "薬学": "药学",
        "歴史": ["历史", "历史学"],
    }
    var isMobile = document.querySelector("#app-navbar-collapse > div > li:nth-child(3) > a") == null
    var ids = ["Table_battle_arts", "Table_find_arts", "Table_act_arts", "Table_commu_arts", "Table_know_arts"]
    function proc_rules(){
        var rule_name = isMobile ? document.querySelector("#MAKING>div:last-child>table td:first-child").innerText : document.querySelector("#MAKING > div > div > div > table > tbody > tr > td:nth-child(1)").innerText
        var text = ""
        if (rule_name == "クトゥルフ神話TRPG"){
            text = proc_coc()
        }
        show_text(text)
    }
    function show_text(text){
        document.querySelector("#dice_export_result").innerHTML = text
    }
    function insert_textarea(){
        var newNode
        if (isMobile) {
            newNode = document.createElement("div")
            newNode.className = "row"
            newNode.innerHTML = `<div class="container"><div class="card mb-3">
            <textarea id="dice_export_result" class="full" rows = "5"></textarea>
            </div></div>`
            document.querySelector("#MAKING").insertBefore(newNode, document.querySelector("#MAKING > div:nth-child(3)"))
        }
        else {
            newNode = document.createElement("section")
            newNode.innerHTML = `<div class="container"><div class="card mb-3">
            <textarea id="dice_export_result" class="full" rows = "5"></textarea>
            </div></div>`
            document.querySelector("#MAKING > div > div > div").insertBefore(newNode, document.querySelector("#status_disp"))
        }
    }
    function proc_coc(){
        var result = ".st"
        result = result + "san" + document.querySelector("#san_disp > div.disp > table > tbody > tr > td:nth-child(2) > input[type=text]").value
        result = result + proc_coc_title()
        for (var i in ids)
            result = result + proc_coc_id(ids[i])
        return result
    }
    function proc_coc_title(){
        var result = ""
        var tbl = document.querySelector("#status_disp > div.disp > table > tbody")
        for (var x = 1; x < tbl.querySelectorAll("tr:first-child th").length; x ++){
            var name = tbl.querySelector(`tr:first-child > th:nth-child(${x+1})`).innerText
            var value = tbl.querySelector(`tr:nth-child(2) > td:nth-child(${x+1}) > input`).value
            if (skill_aliases[name]) {
                if (typeof(skill_aliases[name]) == "string"){
                    result = result + skill_aliases[name] + value
                }
                else {
                    for (var i in skill_aliases[name]){
                        var name_l = skill_aliases[name][i]
                        result = result + name_l + value
                    }
                }
            }
        }
        return result
    }
    function proc_coc_id(id){
        var result = ""
        var vas = document.querySelectorAll(`#${id} > tbody > tr`)
        for (var x = 1; x < vas.length; x++){
            var name = vas[x].querySelector("th").innerText
            var input_text = (vas[x].querySelector("th>input") == null) ? "" : vas[x].querySelector("th>input").value
            var value = vas[x].querySelector("td:last-child>input").value
            if (name == ""){
                result = result + input_text + value
            } else if (skill_aliases[name]) {
                if (typeof(skill_aliases[name]) == "string"){
                    result = result + skill_aliases[name] + value
                }
                else {
                    for (var i in skill_aliases[name]){
                        var name_l = skill_aliases[name][i]
                        if (name_l.indexOf("{X}") != -1){
                            if (input_text == "") continue
                            name_l = name_l.replace("{X}", input_text)
                        }
                        result = result + name_l + value
                    }
                }
            } else {
                result = result + name + value
            }
        }
        return result
    }
    insert_textarea();
    proc_rules();
    var old_cE = cE;
    cE = function(){
        old_cE();
        proc_rules();
    }
})();
