// ==UserScript==
// @name         YNOproject Yume2kki 开关状态 检查
// @namespace    https://github.com/Exsper/
// @version      0.1
// @description  本工具通过遍历游戏内存数据来筛选开关的地址，实时显示开关的值。
// @author       Exsper
// @homepage     https://github.com/Exsper/yno2kkiswitchcheck#readme
// @supportURL   https://github.com/Exsper/yno2kkiswitchcheck/issues
// @match        https://ynoproject.net/2kki/
// @require      https://cdn.staticfile.org/jquery/2.1.3/jquery.min.js
// @license      MIT License
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/489552/YNOproject%20Yume2kki%20%E5%BC%80%E5%85%B3%E7%8A%B6%E6%80%81%20%E6%A3%80%E6%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/489552/YNOproject%20Yume2kki%20%E5%BC%80%E5%85%B3%E7%8A%B6%E6%80%81%20%E6%A3%80%E6%9F%A5.meta.js
// ==/UserScript==

/**
 * 效果状态开关  从版本0.122h
 * 
 * 121  xxxxxxxxxxxxxx
 * 122  黑电话  2
 * 123  男孩    4
 * 124  电锯    8
 * 125  灯笼    16
 * 126  妖精    32
 * 127  宇宙服  64
 * 128  眼镜    128
 * 
 * 129  彩虹    1
 * 130  狼      2
 * 131  眼球炸弹 4
 * 132  摩托车  8
 * 133  舞妓    16
 * 134  双马尾  32
 * 135  企鹅    64
 * 136  虫      128
 * 
 * 137  弹簧    1
 * 138  透明    2
 * 139  学生制服 4
 * 140  石膏    8
 * 141  xxxxxxxxxxxxxx
 * 142  长高    32
 * 143  植轮    64
 * 144  长号    128
 * 
 * 145  蛋糕    1
 * 146  狼+摩托 2
 * 147  小孩    4
 * 148  小红帽  8
 * 149  纸巾    16
 * 150  蝙蝠    32
 * 151  多边形  64
 * 152  晴天娃娃 128
 * 
 * 153  非主流  1
 * 154  铁桶    2
 * 155  墓碑    4
 * 156  平交道  8
 * 157  兔耳    16
 * 158  骰子    32
 * 159  xxxxxxxxxxxxxx
 * 160  xxxxxxxxxxxxxx
 * 
 * 综合考虑，在判定狼+摩托车时最方便（[00, 0A, 00, 02]）
 * 
 */

/**
 * @param {Array<number>} sourceArray 
 * @param {Array<number>|number} aimArray 
 */
function findDataIndex(sourceArray, aimArray) {
    if (typeof aimArray == "number") aimArray = [aimArray];
    let index = 0;
    let MAX_Index = sourceArray.length - 1;
    let cmpIndex = 0;
    let MAX_CmpIndex = aimArray.length - 1;
    let finds = [];
    while (index <= MAX_Index) {
        if (sourceArray[index + cmpIndex] == aimArray[cmpIndex]) {
            cmpIndex += 1;
            if (cmpIndex > MAX_CmpIndex) {
                finds.push(index);
                cmpIndex = 0;
                index += 1;
            }
        }
        else {
            cmpIndex = 0;
            index += 1;
        }
    }
    return finds;
}

function getSwitchBit(num, pos) {
    return (num >> pos) & 1;
}

function getSwitchStat(baseByteIndex, switchNo) {
    let byteNo = Math.floor(switchNo / 8);
    let index = switchNo % 8 - 1;
    let byte = easyrpgPlayer["HEAPU8"][baseByteIndex + byteNo];
    return getSwitchBit(byte, index);
}

function filterWolfMotor_first() {
    return findDataIndex(easyrpgPlayer["HEAPU8"], [0, 10, 0, 2]);
}

function filterNoneEffect(indexList) {
    return indexList.filter((val) => easyrpgPlayer["HEAPU8"][val] + easyrpgPlayer["HEAPU8"][val + 1] + easyrpgPlayer["HEAPU8"][val + 2] + easyrpgPlayer["HEAPU8"][val + 3] === 0);
}

function filterWolfMotor(indexList) {
    return indexList.filter((val) => (easyrpgPlayer["HEAPU8"][val] == 0) && (easyrpgPlayer["HEAPU8"][val + 1] == 10) && (easyrpgPlayer["HEAPU8"][val + 2] == 0) && (easyrpgPlayer["HEAPU8"][val + 3] == 2));
}


class GameSwitch {
    constructor(name, switchNo) {
        this.name = name;
        this.switchNo = switchNo;
    }

    toTableData() {
        return { name: this.name, switchNo: this.switchNo };
    }
}

class SwitchPack {
    /**
     * @param {string} title 
     * @param {Array<{name:number}>} switchData
     * @param {-1|0|1} showMode  -1=只显示OFF  0=全部显示  1=只显示ON
     */
    constructor(title, switchData, showMode = 0) {
        this.showMode = showMode;
        this.title = title;
        this.switches = switchData.map((data) => new GameSwitch(Object.keys(data)[0], Object.values(data)[0]));
    }

    toTableData() {
        return this.switches.map((gs) => gs.toTableData());
    }
}

// 效果，供测试用
const TEST_PACK = new SwitchPack("测试", [
{ "黑电话": 122 },
{ "男孩": 123 },
{ "电锯": 124 },
{ "灯笼": 125 },
{ "妖精": 126 },
{ "宇宙服": 127 },
{ "眼镜": 128 },
{ "彩虹": 129 },
{ "狼": 130 },
{ "眼球炸弹": 131 },
{ "摩托车": 132 },
{ "舞妓": 133 },
{ "双马尾": 134 },
{ "企鹅": 135 },
{ "虫": 136 },
{ "弹簧": 137 },
{ "透明": 138 },
{ "学生制服": 139 },
{ "石膏": 140 },
{ "长高": 142 },
{ "植轮": 143 },
{ "长号": 144 },
{ "蛋糕": 145 },
{ "狼+摩托": 146 },
{ "小孩": 147 },
{ "小红帽": 148 },
{ "纸巾": 149 },
{ "蝙蝠": 150 },
{ "多边形": 151 },
{ "晴天娃娃": 152 },
{ "非主流": 153 },
{ "铁桶": 154 },
{ "墓碑": 155 },
{ "平交道": 156 },
{ "兔耳": 157 },
{ "骰子": 158 },
]);

// 时计塔的画
const LORNTOWER_PACK = new SwitchPack("时计塔未完成事件", [
    { "电锯眼球": 4362 },
    { "杀死镜中自己": 4363 },
    { "四角四角巨人": 4364 },
    { "Glitch Ending": 4365 },
    { "面具屋事件": 4366 },
    { "拼图世界镜中事件": 4367 },
    { "高阶女祭司": 4368 },
    { "实验室致幻": 4369 },
    { "送圣诞礼物": 4370 },
    { "血世界献祭": 4371 },
    { "梦部屋逃杀": 4372 },
    { "现实海滩杀羊": 4373 },
    { "小红帽森林被捉": 4374 },
    { "石化封印部屋": 4375 },
    { "企鹅游戏": 4376 },
    { "宇宙坠落": 4377 },
    { "游乐园液压机": 4378 },
    { "学校跑步事件": 4379 },
    { "赤色说明书": 4380 },
    ], 1);

const SELECTPACKS = [TEST_PACK, LORNTOWER_PACK];

class Script {
    constructor() {
        this.memoryIndexs = [];
        this.effectStat = -1;
        this.baseByteIndex = -1;
    }

    init() {
        let $openButton = $('<button>', { text: "+", id: "ss-open", style: "float:right;top:30%;position:absolute;right:20px;", title: "显示窗口" }).appendTo($("body"));
        $openButton.click(() => {
            $("#ss-div").show();
            $("#ss-open").hide();
        });
        let $mainDiv = $("<div>", { id: "ss-div", class: "container", style: "top:40%;right:20px;transform: translate(0, -50%);width:180px;position:absolute;text-align:center;z-index:999;height:auto;max-height:70vh;min-height:160px;overflow-y:auto;border-top: 24px double #000000 !important;padding-top: 0px !important;" });
        $mainDiv.hide();
        let $statLabel = $("<span>", { id: "ss-stat", text: "为了获取开关所在位置，请使用狼+摩托车效果，然后点击下方按钮", style: "display: block; padding: 6px;" }).appendTo($mainDiv);
        let $checkButton = $('<button>', { type: "button", text: "好了", id: "ss-checkbtn", style: "width:fit-content;align-self:center;" }).appendTo($mainDiv);
        $checkButton.click(() => {
            $checkButton.attr("disabled", true);
            $checkButton.text("正在获取");
            if (this.memoryIndexs.length <= 0) {
                this.memoryIndexs = filterWolfMotor_first();
                // console.log(this.memoryIndexs)
                $checkButton.attr("disabled", false);
                $statLabel.text("请再取消所有效果，然后点击下方按钮");
                $checkButton.text("好了");
                this.effectStat = 1;
                // 找到的肯定不止1个，需要筛选，不用现在判定数量
                return;
            }
            else {
                if (this.effectStat === 1) {
                    this.memoryIndexs = filterNoneEffect(this.memoryIndexs);
                    $checkButton.attr("disabled", false);
                    $statLabel.text("请再使用狼+摩托车效果，然后点击下方按钮");
                    $checkButton.text("好了");
                    this.effectStat = 0;
                }
                else {
                    this.memoryIndexs = filterWolfMotor(this.memoryIndexs);
                    $checkButton.attr("disabled", false);
                    $statLabel.text("请再取消所有效果，然后点击下方按钮");
                    $checkButton.text("好了");
                    this.effectStat = 1;
                }
                // console.log(this.memoryIndexs)
                if (this.memoryIndexs.length <= 0) {
                    this.memoryIndexs = [];
                    $checkButton.attr("disabled", false);
                    $statLabel.text("筛选出现问题，请重新使用狼+摩托车效果，然后点击下方按钮，如多次失败请联系脚本作者");
                    $checkButton.text("好了");
                    return;
                }
                if (this.memoryIndexs.length === 1) {
                    this.baseByteIndex = this.memoryIndexs[0] - 15;  // 找到的index为开关121-128，需要改为开关1-8的index
                    $checkButton.hide();
                    this.updateDataTable();
                    $("#ss-select").show();
                    return;
                }
            }
        });
        let $titleDiv = $("<div>", { id: "ss-title", style: "width: 100%; display: flex;" }).prependTo($mainDiv);
        let $rightDiv = $("<div>", { id: "ss-title-right", style: "display: flex; justify-content: right;" }).prependTo($titleDiv);
        let $leftDiv = $("<div>", { id: "ss-title-left", style: "width: 100%; display: flex; justify-content: left;" }).prependTo($titleDiv);
        let $backButton = $('<button>', { text: "←", id: "ss-back", title: "重新获取开关" }).appendTo($leftDiv);
        $backButton.click(() => {
            this.reload();
        });
        let $closeButton = $('<button>', { text: "-", id: "ss-close", title: "隐藏窗口" }).appendTo($rightDiv);
        $closeButton.click(() => {
            $("#ss-div").hide();
            $("#ss-open").show();
        });
        let $packSelector = $("<select>", { id: "ss-select", style: "table-layout:fixed; width:100%;" }).appendTo($mainDiv);
        $packSelector.hide();
        SELECTPACKS.map((pack) => {
            $packSelector.append($('<option>').val(pack.title).text(pack.title));
        });
        let $mainTable = $("<table>", { id: "ss-table", style: "table-layout:fixed; width:100%; word-wrap: break-word;" }).appendTo($mainDiv);
        $mainDiv.appendTo($("body"));
    }

    reload() {
        this.memoryIndexs = [];
        this.effectStat = -1;
        this.baseByteIndex = -1;
        $("#ss-table").empty();
        $("#ss-stat").text("为了获取开关所在位置，请使用狼+摩托车效果，然后点击下方按钮");
        $("#ss-checkbtn").show();
        $("#ss-checkbtn").attr("disabled", false);
        $("#ss-checkbtn").text("好了");
        $("#ss-select").hide();
    }

    updateDataTable() {
        if (this.baseByteIndex <= 0) return;
        $("#ss-stat").text("当前状态");
        let $mainTable = $("#ss-table");
        $mainTable.empty();
        let packName = $("#ss-select").val();
        let dataTableData = [];
        let showMode = 0;
        SELECTPACKS.map((pack) => {
            if (packName === pack.title) {
                dataTableData.push(...pack.toTableData());
                showMode = pack.showMode;
            }
        });
        dataTableData.map((varLineData) => {
            let stat = getSwitchStat(this.baseByteIndex, varLineData.switchNo);
            if (((showMode === -1) && (stat <= 0)) || ((showMode === 1) && (stat > 0))) {
                let $ltr = $("<tr>", { style: "width:100%;" });
                let $ltd = $("<td>").appendTo($ltr);
                $("<span>", { text: varLineData.name }).appendTo($ltd);
                $ltr.appendTo($mainTable);
            }
            else if (showMode === 0) {
                let $ltr = $("<tr>", { style: "width:100%;" });
                let $ltd = $("<td>", { style: "width:80%" }).appendTo($ltr);
                $("<span>", { text: varLineData.name }).appendTo($ltd);
                $ltd = $("<td>", { style: "width:20%" }).appendTo($ltr);
                $("<span>", { text: (stat > 0) ? "✔" : "❌" }).appendTo($ltd);
                $ltr.appendTo($mainTable);
            }
        });

        setTimeout(() => { this.updateDataTable(); }, 1000);
    }
}

// 确保网页加载完成
function check() {
    let $loaded = $("#loadingOverlay.loaded");
    if ($loaded.length > 0) {
        let script = new Script();
        script.init();
    }
    else setTimeout(function () { check(); }, 2000);
}

$(document).ready(() => {
    check();
});