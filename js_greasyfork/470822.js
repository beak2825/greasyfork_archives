// ==UserScript==
// @name         XUJCOJ-CPH
// @version      1.2
// @description  Competitive Companion For XUJCOJ
// @author       Haynes-ROB21026
// @match        *://*.xujcoj.com/home/contest/*/problem/*
// @match        *://*.xujcoj.com/home/problem/detail/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xujcoj.com
// @namespace https://greasyfork.org/users/1126505
// @downloadURL https://update.greasyfork.org/scripts/470822/XUJCOJ-CPH.user.js
// @updateURL https://update.greasyfork.org/scripts/470822/XUJCOJ-CPH.meta.js
// ==/UserScript==

(function () {
    "use strict";
    var button = document.createElement("button");
    var li = document.createElement("li");
    var img = document.createElement("img");
    img.src =
        "data:image/png;base64,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";
    img.style.width = "20px";
    img.style.height = "20px";
    img.style.marginTop = "-2px";

    button.textContent = " CPH";
    button.style.width = "75px";
    button.style.height = "28px";
    button.style.align = "center";
    button.style.color = "white";
    button.style.background = "#5bc0de";
    button.style.border = "1px solid #46b8da";
    button.style.borderRadius = "4px";
    button.style.marginTop = "11px";
    button.style.fontFamily = "sans-serif";

    var elements = document.getElementsByClassName("title");
    var titleContent = elements[0].innerText;
    var p_input = document.getElementById("copyTarget").innerText;
    var p_output = document.getElementById("copyTarget2").innerText;
    p_input = makeInput(p_input);
    p_output = makeInput(p_output);

    var panel = document.querySelector(".panel");
    var h5 = panel.querySelector("h5");
    var time_mem = h5.innerText;
    var currentUrl = window.location.href;
    var time = time_mem.match(/\d+/g)[0];
    var mem = time_mem.match(/\d+/g)[1];

    // 包含contest 
    if (currentUrl.includes("contest")) {
        const match = currentUrl.match(/contest\/(\d+)\/problem\/(\d+)/);
        var contest, problem, title;

        if (match) {
            contest = match[1];
            problem = match[2];

            console.log("contest =", contest);
            console.log("problem =", problem);
            title = 'XUJCOJ-C' + contest + '-P' + problem;
        } else {
            console.log("未找到匹配项");
        }
    } else {
        const match = currentUrl.match(/problem\/detail\/(\d+)/);
        if (match) {
            problem = match[1];
            title = 'XUJCOJ-P' + problem;
        } else {
            console.log("未找到匹配项");
        }
    }

    console.log(currentUrl);
    console.log(titleContent);
    console.log(title);
    console.log(time);
    console.log(mem);
    console.log(p_input);
    console.log(p_output);

    button.addEventListener("click", clickBotton);
    function clickBotton() {
        var url = "http://127.0.0.1:27121";
        var data = JSON.stringify({
            name: title,
            url: currentUrl,
            interactive: false,
            memoryLimit: mem / 1024,
            timeLimit: time * 1000,
            tests: [
                {
                    input: p_input,
                    output: p_output,
                },
            ],
            testType: "single",
            input: {
                type: "stdin",
            },
            output: {
                type: "stdout",
            },
        });

        fetch(url, {
            method: "POST",
            body: data,
        }).then(function () {
            console.log(["Send CPH Success"]);
        });
    }

    function makeInput(inputStr) {
        if (inputStr[inputStr.length - 1] != "\n") {
            inputStr += "\n";
        }
        inputStr = inputStr.replace(/\xA0/g, " "); //题号2355的输入中有特殊空格，要替换掉
        return inputStr.replace(/ /g, " ").replace(/\n{1,3}/g, "\n");
    }

    var navbar = document.getElementsByClassName("navbar-right")[0];
    li.appendChild(button);
    navbar.insertBefore(li, navbar.childNodes[0]);
    button.insertBefore(img, button.childNodes[0]);
})();
