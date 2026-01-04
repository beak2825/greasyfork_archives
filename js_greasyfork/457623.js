// ==UserScript==
// @name         GURPS cheat cubes (mentor.gurps.ru)
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Скрипт делает все броски удачными
// @author       Рустам Расимович
// @match        https://mentor.gurps.ru/editor*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gurps.ru
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457623/GURPS%20cheat%20cubes%20%28mentorgurpsru%29.user.js
// @updateURL https://update.greasyfork.org/scripts/457623/GURPS%20cheat%20cubes%20%28mentorgurpsru%29.meta.js
// ==/UserScript==
 
(function(open) {
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener("readystatechange", function() {
            if (this.readyState == 4 && window.location.href.search("editor") != -1) {
                main();
            }
        }, false);
        open.apply(this, arguments);
    };
})(XMLHttpRequest.prototype.open);
 
function findResults(number) {
    if (number >= 18)
        number = 17;
    let results = [];
    for (let i = 1; i <= 6; i++)
        for (let j = 1; j <= 6; j++)
            for (let k = 1; k <= 6; k++)
                if (i + j + k <= number)
                    results.push([i, j, k]);
    return results;
}
 
function skillRoll(skill, outputPlace, cb) {
    //get toggle element
    let toggle = document.getElementsByClassName("custom-switch-btn")[0];
    //get toggle state
    let cheat_sate = toggle.checked;
 
    let cubes_ = findResults(skill);
    let random_ = Math.floor(Math.random() * cubes_.length);
    let result_ = cubes_[random_];
 
    var res = 0;
    var text = "";
    for (var i = 0; i < 3; i++) {
        if (cheat_sate)
            var rnd = result_[i];
        else var rnd = Math.floor(Math.random() * 6) + 1;
        res += rnd;
        text += "<gc-dice>&#" + (9855 + rnd) + ";</gc-dice> ";
    }
 
    var success = res - skill;
    var res_class = "success";
    var res_text = "Успех (" + success + ")";
    if (success > 0) {
        res_class = "fail";
        res_text = "Провал (" + success + ")";
    }
    if (res == 3 || res == 4 || (res == 5 && skill >= 15) || (res == 6 && skill >= 16)) {
        res_class = "success crit-success";
        res_text = "Критический Успех";
    }
    if (res == 18 || (res == 17 && skill <= 15) || (success >= 10)) {
        res_class = "fail crit-fail";
        res_text = "Критический Провал";
    }
    var rolled = $("<gc-rolled success='" + success + "' class='" + res_class + "'>" + text + " = <val>" + res + "</val> <res>" + res_text + "</res></gc-rolled>");
 
    addTimeAsTitle(rolled);
    $(outputPlace).prepend(rolled);
 
    if (cb) cb(rolled);
}
 
function addJS_Node(text, s_URL, funcToRun, runOnLoad) {
    var D = document;
    var scriptNode = D.createElement('script');
    if (runOnLoad) {
        scriptNode.addEventListener("load", runOnLoad, false);
    }
    scriptNode.type = "text/javascript";
    if (text) scriptNode.textContent = text;
    if (s_URL) scriptNode.src = s_URL;
    if (funcToRun) scriptNode.textContent = '(' + funcToRun.toString() + ')()';
 
    var targ = D.getElementsByTagName('head')[0] || D.body || D.documentElement;
    targ.appendChild(scriptNode);
}
 
 
function main() {
 
    let check = document.getElementById("global_temp");
    if (check) return;
 
    let sticky_block_more = document.getElementsByTagName("more")[0];
 
    let label = document.createElement("label");
    label.innerHTML = "Читы"
    label.className = "custom-switch";
    label.style.color = "#999";
    label.style.fontFamily = "'Roboto Condensed',sans-serif";
    label.style.fontSize = "12px";
    label.style.fontWeight = "300";
    label.style.textTransform = "uppercase";
    label.style.marginRight = "15px";
    sticky_block_more.appendChild(label);
 
    let toggle = document.createElement("input");
    toggle.type = "checkbox";
    toggle.checked = true;
    toggle.className = "custom-switch-btn";
    sticky_block_more.appendChild(toggle);
 
    let global = document.createElement("div");
    global.id = "global_temp";
    document.body.appendChild(global);
    addJS_Node(skillRoll);
    addJS_Node(findResults);
}