// ==UserScript==
// @name         国开老平台自动评阅论述题
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  国开老平台形考任务特定主观题自动评分
// @author       delfino
// @match        http://hebei.ouchn.cn/mod/quiz/report.php?*&mode=grading*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445789/%E5%9B%BD%E5%BC%80%E8%80%81%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E8%AF%84%E9%98%85%E8%AE%BA%E8%BF%B0%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/445789/%E5%9B%BD%E5%BC%80%E8%80%81%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E8%AF%84%E9%98%85%E8%AE%BA%E8%BF%B0%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getSimilarity(s, t, f) {
        if (!s || !t) {
            return 0
        }
        if (s === t) {
            return 100;
        }
        var l = s.length > t.length ? s.length : t.length
        var n = s.length
        var m = t.length
        var d = []
        f = f || 2
        var min = function(a, b, c) {
            return a < b ? (a < c ? a : c) : (b < c ? b : c)
        }
        var i, j, si, tj, cost
        if (n === 0) return m
        if (m === 0) return n
        for (i = 0; i <= n; i++) {
            d[i] = []
            d[i][0] = i
        }
        for (j = 0; j <= m; j++) {
            d[0][j] = j
        }
        for (i = 1; i <= n; i++) {
            si = s.charAt(i - 1)
            for (j = 1; j <= m; j++) {
                tj = t.charAt(j - 1)
                if (si === tj) {
                    cost = 0
                } else {
                    cost = 1
                }
                d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
            }
        }
        //let res = (1 - d[n][m] / l) *100
        let res = (1 - d[n][m] / l)
        return res.toFixed(f)
    }

    function cleanStr(s) {
        if (!s || s == "") {
            return ""
        };
        var t = s.replace(/[`:_.~!@#$%^&*() \+ =<>?"{}|, \/ ;' \\ [ \] ·~！@#￥%……&*（）—— \+ ={}|《》？：“”【】、；‘’，。、]/g, '');
        t = t.replace(/\s+/g, "");
        t = t.replace(/[\r\n]/g, "");
        return t
    }

    function sleep(delay) {
        var start = (new Date()).getTime();
        while ((new Date()).getTime() - start < delay) {
            continue;
        }
    }

    function checkAndGrade() {
        let ques = document.querySelectorAll(".que");
        for (var i = 0; i < ques.length; i++) {
            var ansSubmitted = ques[i].querySelector(".answer").textContent;

            var ansCorrect = ques[i].querySelector(".graderinfo").textContent;
            ansCorrect = ansCorrect.replace(/参考答案：/g, "").replace(/（\d分）/g, "");
            var simi = getSimilarity(cleanStr(ansSubmitted), cleanStr(ansCorrect))
            if (ques[i].querySelector(".attachments").querySelectorAll("a") && simi < 0.6) {
                simi = 0.6
            }
            var inputBlank = ques[i].querySelector(".felement.ftext").querySelector("input");
            var manfen = ques[i].querySelector(".felement.ftext").textContent;
            manfen = manfen.replace(/[\/ ]/g, "");
            var point = Math.ceil(simi * manfen);
            point = point > manfen ? manfen : point;
            inputBlank.scrollIntoView();
            sleep(800);
            inputBlank.value = point;
            sleep(800);

        }
        if (sessionStorage.getItem("saveGradingResult")=="开"){
            document.querySelector("#manualgradingform").querySelector("input[type=submit]").click()
        }
    }

    function toggleAutoGradeSwitch() {
        var autoGradeSwitch = sessionStorage.getItem("autoGradeSwitch")
        if (autoGradeSwitch == "开") {
            sessionStorage.setItem("autoGradeSwitch", "关")
            document.getElementById("btnToggle").innerText = "自动评阅：关"
        } else {
            sessionStorage.setItem("autoGradeSwitch", "开")
            document.getElementById("btnToggle").innerText = "自动评阅：开"
            location.reload()
        }
    }

    function toggleSaveResultSwitch(){
        var saveResult=sessionStorage.getItem("saveGradingResult")
        if (saveResult=="开"){
            sessionStorage.setItem("saveGradingResult","关")
        } else {
            sessionStorage.setItem("saveGradingResult","开")
        }
    }

    ////////
    if(!sessionStorage.getItem("saveGradingResult")){
        sessionStorage.setItem("saveGradingResult", "开");
    }
    window.addEventListener('keyup', function(event) {
        switch (event.code) {
            case 'KeyC': //Cambiar
                toggleAutoGradeSwitch();
                break
            case 'KeyS': //Suspender
                sessionStorage.setItem("autoGradeSwitch", "关");
                document.getElementById("btnToggle").innerText = "自动评阅：关";
                break
            case 'KeyG': //Guardar
                toggleSaveResultSwitch();
                break
        }
    }, true)

    let url = location.href;
    if (url.indexOf("needsgrading") > -1) {
        if (sessionStorage.getItem("autoGradeSwitch") == "开") {
            checkAndGrade()
        }
    } else {
        if (!sessionStorage.getItem("autoGradeSwitch")) {
            sessionStorage.setItem("autoGradeSwitch", "关")
        }

        let button = document.createElement('button')
        button.id = "btnToggle"
        button.innerText = "自动评阅：" + sessionStorage.getItem("autoGradeSwitch")
        button.style = 'position:fixed;top:63px;left:0.5rem;zIndex:99999;font-size: 16px;border:1px solid #fff;color:#212529;background:#fff;font-weight:400;'
        button.onclick = toggleAutoGradeSwitch;
        button.title="C: Cambiar \nS: Suspender \nG: Guardar"
        document.body.appendChild(button);

        sleep(800);
        if (sessionStorage.getItem("autoGradeSwitch") == "开") {
            console.log("自动评阅：开")
            var qTable = document.querySelector("#questionstograde")
            if (qTable) {
                var trs = qTable.querySelectorAll("tr");
                for (var i = 0; i < trs.length; i++) {
                    var link = trs[i].querySelector(".c3").querySelector("a");
                    if (link) {
                        link.scrollIntoView();
                        sleep(800);
                        link.click();
                    }
                }
            }
        }
    }

})();