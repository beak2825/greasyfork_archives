// ==UserScript==
// @name         bigcoach 리뷰 개선 스크립트
// @version      12345
// @description  일치율, 악수율, 레이팅을 계산합니다.
// @author       original author: Miku39 https://greasyfork.org/en/scripts/475642-mortal-%E6%98%BE%E7%A4%BA%E6%81%B6%E6%89%8B%E7%8E%87
// @author       moonrabbit2
// @run-at       document-start
// @match        *://review.bigcoach.work/outputs/*
// @grant        none
// @license      BSD-3-Clause
// @namespace https://greasyfork.org/users/1488493
// @downloadURL https://update.greasyfork.org/scripts/540763/bigcoach%20%EB%A6%AC%EB%B7%B0%20%EA%B0%9C%EC%84%A0%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/540763/bigcoach%20%EB%A6%AC%EB%B7%B0%20%EA%B0%9C%EC%84%A0%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8.meta.js
// ==/UserScript==
(function() {
    'use strict';
    window.addEventListener('load', enhance);
	function enhance(){
		/* for KillerDucky
		let isKD = 0;
		for (const sheet of document.styleSheets) {
	        try {
	            const rules = sheet.cssRules;
	            for (let i = rules.length - 1; i >= 0; i--) {
	                const r = rules[i];
	                if (r.selectorText === '#options, #about' && /display\s*:\s*none/.test(r.cssText)) {
	                    sheet.deleteRule(i);
	                    isKD = true;
	                }
	            }
	        } catch (e) {
	            // CORS 로 접근 불가 시 무시
	        }
	    }
	    console.log(isKD);
	    if (isKD == 1) return;*/
	    const badMoveUpperLimit = 5;
	    let badChooseNum = 0;
	    const lang = document.documentElement.lang;
	    const i18nText = {};
	    i18nText.badMove = "악수";
	    i18nText.badMoveRatio = "악수율";
	    i18nText.rating = "레이팅"
	    i18nText.match = "일치율"
	    let rating = 0;
	    const orderLosses = document.getElementsByClassName("order-loss");
	    for (let i = 0, length = orderLosses.length; i != length; ++i) {
	        const orderLoss = orderLosses[i];
	        const chosenIndex = parseInt(orderLoss.innerText.substring(2));
	        const turnInfo = orderLoss.parentElement;
	        const summary = turnInfo.parentElement;
	        const collapseEntry = summary.parentElement;
	        const details = collapseEntry.lastChild;
	        const table = details.firstChild;
	        const tbody = table.lastChild;
	        const chosenTr = tbody.childNodes[chosenIndex - 1];
	        const weightTd = chosenTr.lastChild;
	        const intSpan = weightTd.firstChild;
	        const chosenWeight = parseFloat(intSpan.textContent + weightTd.lastChild.textContent);
	        const maxWeight = parseFloat(tbody.childNodes[0].lastChild.firstChild.textContent+tbody.childNodes[0].lastChild.lastChild.textContent);
	        const minWeight = Math.max(parseFloat(tbody.childNodes[tbody.childNodes.length - 1].lastChild.firstChild.textContent+tbody.childNodes[tbody.childNodes.length - 1].lastChild.lastChild.textContent), 1e-6);
	        //console.log(maxWeight);
	        //console.log(minWeight);
	        //console.log(chosenWeight);
	        if(chosenWeight != 0) {
	        	rating += Math.log(chosenWeight / minWeight) / Math.max(Math.log(maxWeight / minWeight), 1e-6);
	        }
	        //console.log(rating);
	        if (chosenWeight < badMoveUpperLimit) {
	            const badChooseNode = document.createElement("span");
	            badChooseNode.innerHTML = ` \u00A0\u00A0\u00A0${i18nText.badMove}`;
	            badChooseNode.style.color = "#f55";
	            turnInfo.appendChild(badChooseNode);
	 
	            badChooseNum++;
	        }
	        
	    }
	    const tehaiStates = document.getElementsByClassName("tehai-state");
	    const chooseNum = tehaiStates.length;
	    rating += chooseNum - orderLosses.length;
	    rating /= chooseNum;
	    rating *= rating;
	    rating *= 100;
	    const gameSummary = document.getElementsByClassName("collapse")[0];
	    const leftDl = gameSummary.lastChild.firstChild;
	    const rightDl = gameSummary.lastChild.lastChild;
	    const leftLast = leftDl.lastChild;
	    const rightLast = rightDl.lastChild;
	    const ratingDdL = document.createElement("dd");
	    ratingDdL.innerHTML = i18nText.rating;
	    const ratingDdR = document.createElement("dd");
	    ratingDdR.innerHTML = `${rating.toFixed(1)}`;
	    leftDl.insertBefore(ratingDdL, leftLast.nextSibling);
		//rightDl.insertAfter(ratingDdR, rightLast);
		rightDl.insertBefore(ratingDdR, rightLast.nextSibling);
	    const badChooseRatioDdL = document.createElement("dd");
	    badChooseRatioDdL.innerHTML = i18nText.badMoveRatio;
	    const badChooseRatioDdR = document.createElement("dd");
	    badChooseRatioDdR.innerHTML = `${badChooseNum}/${chooseNum} = ${(100 * badChooseNum / chooseNum).toFixed(3)}%`;
		leftDl.insertBefore(badChooseRatioDdL, ratingDdL);
		rightDl.insertBefore(badChooseRatioDdR, ratingDdR);
	    const matchRatioDdL = document.createElement("dd");
	    matchRatioDdL.innerHTML = i18nText.match;
	    const matchRatioDdR = document.createElement("dd");
	    matchRatioDdR.innerHTML = `${chooseNum - orderLosses.length}/${chooseNum} = ${(100 * (chooseNum - orderLosses.length) / chooseNum).toFixed(3)}%`;
		leftDl.insertBefore(matchRatioDdL, badChooseRatioDdL);
		rightDl.insertBefore(matchRatioDdR, badChooseRatioDdR);
	}
})();