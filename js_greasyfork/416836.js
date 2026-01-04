// ==UserScript==
// @name         ZUA/郑航 实验室安全考试
// @namespace    Zy
// @version      2.1
// @description  郑州航空工业管理学院 实验室安全教育试题答案获取及自动填充
// @author       Zy
// @match        *http://10.66.100.207/aqzrui/model/TwoGradePage/joinexam.aspx?*
// @require      https://greasyfork.org/scripts/416691-zua-examsafety-question-bank/code/ZUA%20examsafety%20Question%20Bank.js?version=872633
// @run-at       document-end
// @grant        none
// @compatible   chrome
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/416836/ZUA%E9%83%91%E8%88%AA%20%E5%AE%9E%E9%AA%8C%E5%AE%A4%E5%AE%89%E5%85%A8%E8%80%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/416836/ZUA%E9%83%91%E8%88%AA%20%E5%AE%9E%E9%AA%8C%E5%AE%A4%E5%AE%89%E5%85%A8%E8%80%83%E8%AF%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var GridA = document.querySelector("#DataGridA > tbody");
    var timu_A = GridA.getElementsByTagName("span");
    var GridB = document.querySelector("#DataGridC > tbody");
    var timu_B = GridB.getElementsByTagName("span");
    var k = 0;

    function autoClick_answer(answer, num) {
	if (num < 8) {
		var num_index = "0".concat(num+2)
		if (answer == "A") {
			var dx_a = document.querySelector("#DataGridA_ctl" + num_index + "_RBLAData > tbody > tr > td:nth-child(1) > label > b");
			dx_a.click();
		}
		else if (answer == "B") {
			var dx_b = document.querySelector("#DataGridA_ctl" + num_index + "_RBLAData > tbody > tr > td:nth-child(2) > label > b");
			dx_b.click();
		}
		else if (answer == "C") {
			var dx_c = document.querySelector("#DataGridA_ctl" + num_index + "_RBLAData > tbody > tr > td:nth-child(3) > label > b");
			dx_c.click();
		}
		else if (answer == "D") {
			var dx_d = document.querySelector("#DataGridA_ctl" + num_index + "_RBLAData > tbody > tr > td:nth-child(4) > label > b");
			dx_d.click();
		}
		else if (answer == "正确") {
			var pd_t = document.querySelector("#DataGridC_ctl" + num_index + "_RBLCData > tbody > tr > td:nth-child(1) > label > b");
			pd_t.click();
		}
		else {
			var pd_f = document.querySelector("#DataGridC_ctl" + num_index + "_RBLCData > tbody > tr > td:nth-child(2) > label > b");
			pd_f.click();
		}
	}
	else {
		num_index = "".concat(num+2)
		if (answer == "A") {
			dx_a = document.querySelector("#DataGridA_ctl" + num_index + "_RBLAData > tbody > tr > td:nth-child(1) > label > b");
			dx_a.click();
		}
		else if (answer == "B") {
			dx_b = document.querySelector("#DataGridA_ctl" + num_index + "_RBLAData > tbody > tr > td:nth-child(2) > label > b");
			dx_b.click();
		}
		else if (answer == "C") {
			dx_c = document.querySelector("#DataGridA_ctl" + num_index + "_RBLAData > tbody > tr > td:nth-child(3) > label > b");
			dx_c.click();
		}
		else if (answer == "D") {
			dx_d = document.querySelector("#DataGridA_ctl" + num_index + "_RBLAData > tbody > tr > td:nth-child(4) > label > b");
			dx_d.click();
		}
		else if (answer == "正确") {
			pd_t = document.querySelector("#DataGridC_ctl" + num_index + "_RBLCData > tbody > tr > td:nth-child(1) > label > b");
			pd_t.click();
		}
		else {
			pd_f = document.querySelector("#DataGridC_ctl" + num_index + "_RBLCData > tbody > tr > td:nth-child(2) > label > b");
			pd_f.click();
		}
	}

    }

    for (var i = 0; i < timu_A.length; i++) {
        if (timu_A[i].id.indexOf("DataGrid") != -1){
            var question_all = timu_A[i].textContent;
            var question = question_all.split(" 、")[1];
            var answer = get_answer(question);
			if (answer != "") {
				timu_A[i].innerText = timu_A[i].textContent + "==" + answer;
				autoClick_answer(answer, i);
			}
            else {
                timu_A[i].setAttribute("style", "color:red");
				k++;
            }
        }};

    for (var j = 0; j < timu_B.length; j++) {
        if (timu_B[j].id.indexOf("DataGrid") != -1){
            question_all = timu_B[j].textContent;
            question = question_all.split(" 、")[1];
            answer = get_answer(question);
			if (answer != "") {
				timu_B[j].innerText = timu_B[j].textContent + "==" + answer;
				autoClick_answer(answer, j);
			}
            else {
                timu_B[j].setAttribute("style", "color:red");
				k++;
            }
        }};
    console.log(k);
})();