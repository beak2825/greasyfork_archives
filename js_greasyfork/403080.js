// ==UserScript==
// @name         MAO_Colorizer
// @namespace    https://satanic0258.github.io/
// @version      1.0.2
// @description  Colorize replaced/ing substrings in Markov Algorithm Online's history.
// @author       satanic0258
// @include      https://mao.snuke.org/tasks/*
// @grant        none
// @copyright    2021, satanic0258 (https://satanic0258.github.io/)
// @license      MIT License; https://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/403080/MAO_Colorizer.user.js
// @updateURL https://update.greasyfork.org/scripts/403080/MAO_Colorizer.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

$(function() {
    'use strict';

    // 履歴テキストをパース
    function parseHistoryText(line) {
        const l = line.indexOf(':');
        return [line.substring(0, l), line.substring(l + 2)];
    }

    // 履歴オブジェクトをパース
    function parseHistoryObj(history) {
        let ary = Array(history.length);
        for(let i = 0; i < history.length; ++i) {
            ary[i] = parseHistoryText(history[i].innerText);
        }
        return ary;
    }

    // lineに適用される規則の[ruleIdx, pos]を返す (適用できる規則が無いとき [])
    function applyRulePos(line) {
        for(let ri = 0; ri < rules.length; ++ri) {
            const pos = line.indexOf(rules[ri].pat.replace(/ /g, '␣'));
            if(pos == -1) continue;
            return [ri, pos];
        }
        return [];
    }

    // textarea上の欄を更新
    function update_player_s(line) {
        let s = document.getElementById('player_s');
        s.value = parseHistoryText(line)[1];
    }

    // 履歴のli要素を作る
    function createLi(text) {
        let newLi = document.createElement('li');
        newLi.innerHTML = text;
        newLi.onclick = function(){update_player_s(newLi.innerText);return false;};
        newLi.style = 'white-space:nowrap;';
        return newLi;
    }

    // 行の色付け情報 (0番目bit:置換元, 1番目bit:置換先)
    let colorAry = [];

    // 色付けの初期化
    function colorize_reset() {
        let select = document.getElementById('player_history');
        let selectAry = select.querySelectorAll('option');
        colorAry = [Array(parseHistoryText(selectAry[0].innerHTML)[1].length)];
        colorAry[0].fill(0);
        colorAry[0].push(-1);

        let history = document.getElementById('player_history_list');
        while (history.firstChild) history.removeChild(history.firstChild);
        history.appendChild(createLi(select.innerText));
    }

    // 最後2行の色付け
    function colorize_last2() {
        let optionAry = document.getElementById('player_history').querySelectorAll('option');
        let optionLast2 = Array.prototype.slice.call(optionAry).slice(-2);
        let sepHistory = parseHistoryObj(optionLast2);

        let oi = colorAry.length - 1;
        let v = Array(sepHistory[1][1].length);
        v.fill(0);
        v.push(-1);
        colorAry.push(v);

        { // 色付け位置の確定
            let pa = applyRulePos(sepHistory[0][1]);
            if(pa.length != 2) return;
            const ri = pa[0];
            const l = pa[1];
            // 置換元
            for(let i = l; i < l + rules[ri].pat.length; ++i) colorAry[oi + 0][i] |= 1;
            // 置換先
            let repSz = rules[ri].rep.length;
            if(repSz > 0 && rules[ri].rep[0] == ':') --repSz;
            for(let i = l; i < l + repSz; ++i) colorAry[oi + 1][i] |= 2;
        }

        let history = document.getElementById('player_history_list');
        let historyAry = history.querySelectorAll('li');

        // 色付けの実行
        for(let _ = 0; _ < 2; ++_, ++oi) {
            let line = sepHistory[_][0] + ': ';
            const rhs = sepHistory[_][1];
            let sub = '';
            for(let i = 0; i < rhs.length; ++i) {
                sub += E(rhs[i]);
                if(colorAry[oi][i] != colorAry[oi][i + 1]) {
                         if(colorAry[oi][i] == 1) sub = '<span class="MAO_Colorizer_from">' + sub + '</span>'
                    else if(colorAry[oi][i] == 2) sub = '<span class="MAO_Colorizer_to">' + sub + '</span>'
                    else if(colorAry[oi][i] == 3) sub = '<span class="MAO_Colorizer_from MAO_Colorizer_to">' + sub + '</span>'
                    line += sub;
                    sub = '';
                }
            }
            if(_ == 0) historyAry[oi].innerHTML = line;
            else history.appendChild(createLi(line));
        }
    }

    { // historyの置き換え
        let select = document.getElementById('player_history');
        select.style = "display: none;"; // 元のhistoryを非表示

        let history = document.createElement('ul');
        history.id = "player_history_list";
        history.className = "form-control profont";
        history.style = "height: 320px; margin-bottom: 5px; overflow: scroll; list-style: none;";
        select.parentNode.insertBefore(history, select); // 代わりにリストを置く
        colorize_reset();

        { // historyの変更検知
            const observer = new MutationObserver( function(mutations) {
                let options = mutations[0].target.querySelectorAll('option');
                if(colorAry.length < options.length) colorize_last2();
                else colorize_reset();
                history.scrollTop = history.scrollHeight;
            });
            const config = {childList: true};
            observer.observe(select, config);
        }
    }
    { // スタイル設定
        let css = document.createElement('style');
        let ruleText = '.MAO_Colorizer_from{background-color:#c6e3ff;color:black;}';
        ruleText += '.MAO_Colorizer_to{font-weight:bold;color:red;}';
        ruleText += 'ul#player_history_list>li:active{background-color:#c6e99d;}';
        let rule = document.createTextNode(ruleText);
        css.media = 'screen';
        css.type = 'text/css';
        if (css.styleSheet) {
            css.styleSheet.cssText = rule.nodeValue;
        } else {
            css.appendChild(rule);
        };
        document.getElementsByTagName('head')[0].appendChild(css);
    }
});