// ==UserScript==
// @name         LaiCode/Leetcode Enhancer
// @namespace    http://www.non-existent.com
// @version		 0.0.2
// @author       eric.clone@gmail.com
// @description  Add rankings and color to LaiOffer score board
// @match        *://www.laicode.com/*
// @match        *://code.laioffer.com/*
// @match        *://leetcode.com/*
// @downloadURL https://update.greasyfork.org/scripts/13544/LaiCodeLeetcode%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/13544/LaiCodeLeetcode%20Enhancer.meta.js
// ==/UserScript==

function getTime() {
    var d = new Date();
    return [d.getTime(), d.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1")];
}

function colorize() {
    var t0 = getTime()[0];
    var me = document.querySelector('a[title=Profile]');
    var pstr = me.href.substring(me.href.indexOf('profile') -1);
    me = document.querySelectorAll('a[href~="' + pstr + '"]')[1].innerText;
    var vip = {};
    vip[me] = "LightGreen";
    vip["jinhuiwu201504"] = "MistyRose";
    /*
    var vip = {
        "yunliwang201504": "LightGreen",
        "jinhuiwu201504": "MistyRose"
    };
    */
    console.log(vip);
    var class_year = [me.substring(me.length - 6)];
    console.log(class_year);
    var rankBox;
    // var user_list = document.querySelectorAll('.Row > .Field.User');
    var user_list = document.querySelectorAll('tbody a');
    console.log(user_list.length);

    var count_class = 0;
    for (var i = 0; i < user_list.length; ++i) {

        var userBox = user_list[i];
        var name = userBox.innerText;
        var same_class = in_class(name, class_year);

        rankBox = document.createElement('td');
        // rankBox.setAttribute('class', 'Field Ranking');
        rankBox.innerText = i + 1;

        if (same_class) {
            ++count_class;
            rankBox.innerText += " | " + count_class;
        }

        if (name in vip) {
            userBox.parentNode.parentNode.style.backgroundColor = vip[name];
        } else if (same_class) {
            userBox.parentNode.parentNode.style.backgroundColor = "LightBlue";
        }

        userBox.parentNode.parentNode.insertBefore(rankBox, userBox.parentNode);
    }

    var user_header = document.querySelector('thead');
    user_header.style.backgroundColor = "Black";
    user_header.style.color = "LightGreen";


    rankBox = document.createElement('th');
    // rankBox.setAttribute('class', 'Field Ranking');
    rankBox.innerText = 'Ranking (' + user_list.length + " | " + count_class + ")";
    user_header.children[0].insertBefore(rankBox, user_header.children[0].children[0]);
    var t = getTime();
    console.log(t[1] + "     Finished in " + (t[0] - t0) + " milliseconds");
}

function in_class(name, class_year) {
    for (var j = 0; j < class_year.length; ++j) {
        if (name.indexOf(class_year[j]) > -1) {
            return true;
        }
    }
    return false;
}

function addButton() {
    var button = document.createElement('div');
    button.setAttribute('id', 'magicButton');
    button.innerHTML = "Hide";
    button.style.position = "fixed";
    button.style.right = "0px";
    button.style.top = "48px";
    // button.style.width = "100px";
    button.style.padding = "0px 10px 0px 10px";
    button.style.textAlign = "center";
    button.style.color = "white";
    button.style.backgroundColor = "rgb(70, 121, 189)";
    // button.style.borderStyle = "solid";
    // button.style.borderWidth = "1px";
    button.style.cursor = "pointer";
    document.body.appendChild(button);
    button.onclick = toggleHidden;
    toggleHidden();
}

function toggleHidden() {
    var button = document.querySelector("div#magicButton");
    var hide = button.innerText.indexOf("Hide") != -1;
    var all_problem_count = document.querySelectorAll("td.problem-progress").length;
    var accepted_list = document.querySelectorAll("td.progress-3");
    var remaining_problem_count = all_problem_count - accepted_list.length;
    for (var i = 0; i < accepted_list.length; ++i) {
        console.log(i + ": " + accepted_list[i]);
        var styleStr = hide ? "none" : "";
        accepted_list[i].parentNode.style.display = styleStr;
    }
    newText = hide ? "Show " : "Hide ";
    button.innerText = "  " + newText + accepted_list.length + "|" + remaining_problem_count + "  ";
    return false;
}

function leetcodeButton() {
    var button = document.createElement('div');
    button.setAttribute('id', 'magicButton');
    button.innerHTML = "Hide";
    button.style.position = "fixed";
    button.style.right = "0px";
    button.style.top = "48px";
    // button.style.width = "100px";
    button.style.padding = "0px 10px 0px 10px";
    button.style.textAlign = "center";
    button.style.color = "white";
    button.style.backgroundColor = "rgb(92, 184, 92)";
    // button.style.borderStyle = "solid";
    // button.style.borderWidth = "1px";
    button.style.cursor = "pointer";
    document.body.appendChild(button);
    button.onclick = leetcodeHidden;
    leetcodeHidden();
}

function leetcodeHidden() {
    var button = document.querySelector("div#magicButton");
    var hide = button.innerText.indexOf("Hide") != -1;
    var all_problem_count = document.querySelectorAll("tr[data-index]").length;
    var accepted_list = document.querySelectorAll(".ac");
    var remaining_problem_count = all_problem_count - accepted_list.length;
    for (var i = 0; i < accepted_list.length; ++i) {
        console.log(i + ": " + accepted_list[i]);
        var styleStr = hide ? "none" : "";
        accepted_list[i].parentNode.parentNode.style.display = styleStr;
    }
    newText = hide ? "Show " : "Hide ";
    button.innerText = "  " + newText + accepted_list.length + "|" + remaining_problem_count + "  ";
    return false;
}

console.log(getTime()[1] + '     Found laicode');
var addr = document.location.href;
if (addr.indexOf("leetcode") != -1 && (addr.indexOf("company") != -1 || addr.indexOf("problemset") != -1)) {
    console.log(getTime()[1] + '     Found leetcode');
    setTimeout(leetcodeButton, 100);
}else if (addr.indexOf("lai") != -1 && addr.indexOf("scoreboard") != -1) {
    setTimeout(colorize, 100);
} else if (addr.indexOf("lai") != -1 && addr.indexOf("editor") == -1) {
    setTimeout(addButton, 100);
}