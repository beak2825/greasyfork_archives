// ==UserScript==
// @name         SCP-CN Jump Document
// @namespace    https://scp-wiki-cn.wikidot.com/
// @version      2.0.2
// @description  SCP-CN 输入文档编号直接跳转
// @author       se7en
// @match        http*://scp-wiki-cn.wikidot.com/*
// @icon         https://scp-wiki-cn.wikidot.com/local--favicon/favicon.gif
// @license      GPL-3.0 License
// @grant        none
// @require      https://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/423482/SCP-CN%20Jump%20Document.user.js
// @updateURL https://update.greasyfork.org/scripts/423482/SCP-CN%20Jump%20Document.meta.js
// ==/UserScript==

function addButton() {
    let body = $("#html-body"); // document.getElementById("html-body");

    // 添加悬浮按钮
    let float_button = document.createElement("div");
    float_button.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    float_button.style.backgroundImage = "url('https://pic.imgdb.cn/item/667431f4d9c307b7e93c5691.png')";
    float_button.style.backgroundSize = "cover";
    float_button.style.cssText +=
        "position: fixed; bottom: 21px; right: 11px; cursor: pointer;" +
        "width: 35px; height: 35px; line-height: 35px; transform: translate(.5px, 0); opacity: 1;" +
        "border: 1px #fff solid; border-radius: 25px; color: white; text-align: center;";
    float_button.onclick = function () {
        let ui_div = document.getElementById("input-ui");
        ui_div.style.display = "block";
        document.getElementById("jump-target").value = "SCP-000";
    }
    body.append(float_button);

    // 添加悬浮div
    let float_div = document.createElement("div");
    float_div.id = "input-ui";
    float_div.innerHTML =
        "<input type='text' id='jump-target' readonly>" +
        "<div id='input-ui-button'>" +
        "<ul><li onclick='inputUiCn()'>CN</li><li onclick='inputUiJ()'>J</li><li onclick='inputUiBackspace()'><-</li></ul>" +
        "<ul><li onclick='inputUiNumber(1)'>1</li><li onclick='inputUiNumber(2)'>2</li><li onclick='inputUiNumber(3)'>3</li></ul>" +
        "<ul><li onclick='inputUiNumber(4)'>4</li><li onclick='inputUiNumber(5)'>5</li><li onclick='inputUiNumber(6)'>6</li></ul>" +
        "<ul><li onclick='inputUiNumber(7)'>7</li><li onclick='inputUiNumber(8)'>8</li><li onclick='inputUiNumber(9)'>9</li></ul>" +
        "<ul><li onclick='inputUiClose()'>X</li><li onclick='inputUiNumber(0)'>0</li><li onclick='inputUiGo()'>GO</li></ul>" +
        "</div>";
    float_div.style.cssText +=
        "display: none; position: fixed; bottom: 20px; right: 10px;" +
        "width: 163px; height: 280px; transform: translate(.5px, 0); opacity: 1;" +
        "border: 1px #fff solid; border-radius: 4px;" +
        "background: #91989f; color: white; box-shadow: 2px 2px 5px #555; text-align: center;";
    body.append(float_div);

    // 添加script
    let script = document.createElement('script');
    script.innerHTML = `
        function inputUiClose() { document.getElementById("input-ui").style.display = "none"; }
        function regInputValue(value) {
            let reg_result = /(SCP\-)?(CN-)?([0-9]{3,})?(\-J)?/i.exec(value);
            return {
                scp: reg_result[1],
                cn: reg_result[2] != null ? reg_result[2] : "",
                number: reg_result[3] != null ? reg_result[3] : "",
                joke: reg_result[4] != null ? reg_result[4] : ""
            };
        }
        function inputUiNumber(number) {
            let input = document.getElementById("jump-target");
            let input_value = input.value;
            let reg_input = regInputValue(input_value);
            let old_number = (reg_input["number"] != "") ? String(parseInt(reg_input["number"])) : "";
            let new_value = old_number + number;
            if (new_value.length < 3) new_value = new_value.padStart(3, "0");
            input.value = reg_input["scp"] + reg_input["cn"] + new_value + reg_input["joke"];
        }
        function inputUiBackspace() {
            let input = document.getElementById("jump-target");
            let input_value = input.value;
            let reg_input = regInputValue(input_value);
            console.log(reg_input);
            if (reg_input["number"] != "") {
                let new_value = reg_input["number"].substring(0, reg_input["number"].length - 1);
                if (new_value.length < 3) new_value = new_value.padStart(3, "0");
                input.value = reg_input["scp"] + reg_input["cn"] + new_value + reg_input["joke"];
            }
        }
        function inputUiCn() {
            let input = document.getElementById("jump-target");
            let input_value = input.value;
            let reg_input = regInputValue(input_value);
            let cn_str = (reg_input["cn"] != "") ? "" : "CN-";
            input.value = reg_input["scp"] + cn_str + reg_input["number"] + reg_input["joke"];
        }
        function inputUiJ() {
            let input = document.getElementById("jump-target");
            let input_value = input.value;
            let reg_input = regInputValue(input_value);
            let joke_str = (reg_input["joke"] != "") ? "" : "-J";
            input.value = reg_input["scp"] + reg_input["cn"] + reg_input["number"] + joke_str;
        }
        function inputUiGo() {
            let input = document.getElementById("jump-target");
            let input_value = input.value;
            window.location.href = "https://" + window.location.host + "/" + input_value.toLowerCase();
        }`;
    body.append(script);

    // 添加style
    let style = document.createElement('style');
    style.innerHTML =
        "#jump-target { background: #3c2f41; text-align: right; padding: 0px 5px; border-radius: 10px; margin: 12px 7px; width: 85%; height: 30px; border: 1px #fff solid; font-size: 11pt; color: #f8c3cd; outline: none; }" +
        "#input-ui #input-ui-button ul { padding: 0px; margin: 0px; margin-left: 17px; }" +
        "#input-ui #input-ui-button ul li { list-style: none; background: #574c57; font-weight: bold; border-radius: 10px; margin: 4px 4px 4px 4px; width: 35px; height: 35px; line-height: 36px; float: left; box-shadow: 1px 1px 5px #333; cursor: pointer; }";
    body.append(style);
}

(function () {
    addButton();
})();
