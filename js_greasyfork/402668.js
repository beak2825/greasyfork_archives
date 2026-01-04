// ==UserScript==
// @name         SJTUOJ Helper
// @namespace    https://oj.victrid.dev/
// @version      0.3.2 Minor
// @description  The best SJTUOJ helper!
// @author       VictriD
// @match        https://acm.sjtu.edu.cn/OnlineJudge/*
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.deleteValue
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/402668/SJTUOJ%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/402668/SJTUOJ%20Helper.meta.js
// ==/UserScript==


(async function () {
    'use strict';

    var username = undefined;
    if ($.trim($(".dropdown-toggle").contents().filter(function () { return this.nodeType != 1; }).text()).split("：")[1] != undefined) {
        username = $.trim($(".dropdown-toggle").contents().filter(function () { return this.nodeType != 1; }).text()).split("：")[1];
    }
    var cls = document.createElement("div");
    cls.classList.add("btn-group", "pull-right");
    var pdp = document.createElement("a");
    pdp.classList.add("btn", "dropdown-toggle");
    pdp.setAttribute("data-toggle", "dropdown");
    pdp.text = "设置";
    var vvv = document.createElement("span");
    vvv.classList.add("caret");
    pdp.appendChild(vvv);
    cls.appendChild(pdp);
    var adp = document.createElement("ul");
    adp.classList.add("dropdown-menu");
    var enablebtn = document.createElement("li");
    var a_en = document.createElement("a");
    a_en.id = 'enablebtn';
    enablebtn.appendChild(a_en);
    adp.appendChild(enablebtn);
    var dyrebtn = document.createElement("li");
    var a_dy = document.createElement("a");
    a_dy.id = 'dyrebtn';
    dyrebtn.appendChild(a_dy);
    adp.appendChild(dyrebtn);
    var ansbtn = document.createElement("li");
    var a_an = document.createElement("a");
    a_an.id = 'ansbtn';
    ansbtn.appendChild(a_an);
    adp.appendChild(ansbtn);
    var dv = document.createElement("li");
    dv.classList.add("divider");
    adp.appendChild(dv);
    var resetbtn = document.createElement("li");
    var a_re = document.createElement("a");
    a_re.id = "clrbtn";
    a_re.text = "恢复默认";
    resetbtn.appendChild(a_re);
    adp.appendChild(resetbtn);
    var dva = document.createElement("li");
    dva.classList.add("divider");
    adp.appendChild(dva);
    var t2btn = document.createElement("li");
    var t2 = document.createElement("a");
    t2.text = "电报：t.me\/koraboreta";
    t2.href="https:\/\/t.me\/koraboreta";
    t2.target="_blank";
    t2btn.appendChild(t2);
    adp.appendChild(t2btn);
    // 咱不恰这个烂钱（主要是停止注册了）
    // var t3btn = document.createElement("li");
    // var t3 = document.createElement("a");
    // t3.text = "没有梯子？点我（逃";
    // t3.href="https:\/\/sockboom.tel\/auth\/register\?affid\=178136";
    // t3.target="_blank";
    // t3btn.appendChild(t3);
    // adp.appendChild(t3btn);
    cls.appendChild(adp);
    $(".btn-group:first").after(cls);

    enabled = await GM.getValue('enabled', -1);
    // Total enable/disable button
    if (enabled == -1) {
        await GM.setValue('enabled', true);
        enabled = true;
    }
    // make color
    dyred = await GM.getValue('dyred', -1);
    if (dyred == -1) {
        await GM.setValue('dyred', true);
        dyred = true;
    }
    //show answer button
    syans = await GM.getValue('syans', -1);
    if (syans == -1) {
        await GM.setValue('syans', true);
        syans = true;
    }

    if (enabled == 1) { $("#enablebtn").html("所有功能 开启"); }
    else { $("#enablebtn").html("所有功能 关闭"); }

    if (dyred == 1) { $("#dyrebtn").html('彩色按钮 开启'); }
    else { $("#dyrebtn").html('彩色按钮 关闭'); }

    if (syans == 1) { $("#ansbtn").html('答案显示 开启'); }
    else { $("#ansbtn").html('答案显示 关闭'); }

    var enabled, dyred, syans;
    async function de(zEvent) { enabled = !enabled; await GM.setValue('enabled', enabled); location.reload(); }
    async function dd(zEvent) { dyred = !dyred; await GM.setValue('dyred', dyred); location.reload(); }
    async function ds(zEvent) { syans = !syans; await GM.setValue('syans', syans); location.reload(); }
    async function dclr(zEvent) { await GM.deleteValue('syans'); await GM.deleteValue('enabled'); await GM.deleteValue('dyred'); location.reload(); }
    $("#enablebtn").click(de);
    $("#dyrebtn").click(dd);
    $("#ansbtn").click(ds);
    $("#clrbtn").click(dclr);


    var lst = window.location.href.split('/');
    if (lst[lst.length - 2] == "contest") {
        if (enabled && syans) {
            var answer_div = document.createElement('div');
            answer_div.id = 'answer_div';
            var head = document.createElement('h3');
            head.innerHTML = "参考解答";
            for (var it = 0, lens = $('#problems .btn').length; it < lens; it++) {
                var str = $('#problems .btn')[it].innerHTML
                var strr = "https:\/\/oj.victrid.dev\/nr\/"
                strr = strr.concat(str, "\/")
                var btn;
                btn = document.createElement('a');
                btn.innerHTML = str;
                btn.target = "_blank";
                btn.classList.add("btn");
                btn.href = strr;
                answer_div.appendChild(btn);
                answer_div.append(" ");
            }
            $("#problems").append(document.createElement('hr'));
            $("#problems").append(head);
            $("#problems").append(answer_div);
        }
        if (enabled && dyred) {
            var ctrs = new Array();
            if (username != undefined) {
                var vl = $("tr:contains('" + username + "')").find("td").length - 3, sl = 2;
                for (; sl < vl; sl++) {
                    if ($($("tr:contains('" + username + "')").find("td")[sl]).find("[color='green']").length) {
                        ctrs[sl - 2] = 1;
                        continue;
                    }
                    if ($($("tr:contains('" + username + "')").find("td")[sl]).find("[color='red']").length) {
                        ctrs[sl - 2] = -1;
                        continue;
                    }
                    ctrs[sl - 2] = 0;
                }
            }
            for (var itrr = 0, lensrr = $('#problems .btn').length, leps = ctrs.length; itrr < lensrr && itrr < leps; itrr++) {
                if (ctrs[itrr] == 1) $('#problems .btn')[itrr].classList.add("btn-success");
                if (ctrs[itrr] == -1) $('#problems .btn')[itrr].classList.add("btn-danger");
            }
        }


    }
    if (lst[lst.length - 2] == "problem") {
        if (enabled && syans) {
            var answer_btn = document.createElement('a');
            var strv = lst[lst.length - 1];
            answer_btn.id = 'answer_btn';
            answer_btn.classList.add("btn");
            answer_btn.classList.add("btn-large");
            answer_btn.innerHTML = "参考解答";
            var strrr = "https:\/\/oj.victrid.dev\/nr\/".concat(strv, "\/")
            answer_btn.href = strrr;
            answer_btn.target="_blank";
            $(".well").append(' ');
            $(".well").append(answer_btn);
        }
    }

})();