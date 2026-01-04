// ==UserScript==
// @name         恢复希悦预测成绩及排名显示
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      2024-01-10
// @description  try to take over the world!
// @author       You
// @match        https://chalk-c3.seiue.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=seiue.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483868/%E6%81%A2%E5%A4%8D%E5%B8%8C%E6%82%A6%E9%A2%84%E6%B5%8B%E6%88%90%E7%BB%A9%E5%8F%8A%E6%8E%92%E5%90%8D%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/483868/%E6%81%A2%E5%A4%8D%E5%B8%8C%E6%82%A6%E9%A2%84%E6%B5%8B%E6%88%90%E7%BB%A9%E5%8F%8A%E6%8E%92%E5%90%8D%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

function addXMLRequestCallback(callback){
    var oldSend, i;
    if( XMLHttpRequest.callbacks ) {
        XMLHttpRequest.callbacks.push( callback );
    } else {
        XMLHttpRequest.callbacks = [callback];
        oldSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(){
            for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
                XMLHttpRequest.callbacks[i]( this );
            }
            oldSend.apply(this, arguments);
        }
    }
}

addXMLRequestCallback( function( xhr ) {
        xhr.addEventListener("load", function(){
        if ( xhr.readyState == 4 && xhr.status == 200 && xhr.responseURL.startsWith('https://api.seiue.com/vnas/klass/personal/class') ) {
            const response = JSON.parse(xhr.responseText);
            const grade = response.grade;
            const gainedRank = grade.gained_rank;
            const gainedBase = grade.gained_rank_base;
            const rate = grade.gained_score_rate;
            console.log(gainedRank, gainedBase, rate)
            updateDOM(gainedRank, gainedBase, rate);
        }
    });

});


function updateDOM(gainedRank, gainedBase, rate) {
    const parent = document.getElementsByClassName('sc-dsDzme RHwBt')[0];
    if (!parent) {
        setTimeout(() => {
            updateDOM(gainedRank, gainedBase, rate);
        }, 1000);
    }
    const blueBox = document.createElement('div');
    blueBox.setAttribute('class', 'sc-jYRipH hOfCdi sc-etChWs iXDMdq')

    const rank = document.createElement('div2');
    rank.setAttribute('class', 'sc-hYAvag iSuscE sc-hA-dQtl lhYmbR')
    rank.innerHTML = `${gainedRank} / ${gainedBase}`

    const rankText = document.createElement('div')
    rankText.setAttribute('class','sc-hYAvag iSuscE sc-hA-dQtl lhYmbR')
    rankText.innerHTML = '排名'

    blueBox.appendChild(rank)
    blueBox.appendChild(rankText)

    const blueBox2 = document.createElement('div');
    blueBox2.setAttribute('class', 'sc-jYRipH hOfCdi sc-etChWs iXDMdq')

    const rateBox = document.createElement('div');
    rateBox.setAttribute('class', 'sc-hYAvag iSuscE sc-hA-dQtl lhYmbR')
    rateBox.innerHTML = `${rate * 100}`
    const rateText = document.createElement('div')
    rateText.setAttribute('class','sc-hYAvag iSuscE sc-hA-dQtl lhYmbR')
    rateText.innerHTML = '预测得分'

    blueBox2.appendChild(rateBox)
    blueBox2.appendChild(rateText)

    parent.appendChild(blueBox);
    parent.appendChild(blueBox2);
}