// ==UserScript==
// @name         tc-problem-linker
// @namespace    https://github.com/komori3/
// @supportURL   https://twitter.com/komori3_/
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Topcoder Marathon 新プラットフォームの問題へのリンクを生成する雑スクリプト
// @author       komori3
// @match        https://competitiveprogramming.info/topcoder/marathon
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398118/tc-problem-linker.user.js
// @updateURL https://update.greasyfork.org/scripts/398118/tc-problem-linker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let new_problems =
        [
        {title: 'Marathon Match 110', round_id: 30089008, problem_name: 'ImageFromBlocks'},
        {title: 'TCO19 Marathon Round 1', round_id: 30092483, old_round_id: 17579, problem_name: 'LineUp'},
        {title: 'Marathon Match 111', round_id: 30100149, old_round_id: 17674, problem_name: 'PolyominoCovering'},
        {title: 'TCO19 Marathon Round 2', round_id: 30101930, old_round_id: 17698, problem_name: 'ContestOrganizer'},
        {title: 'TCO19 Marathon Round 3', round_id: 30103195, old_round_id: 17700, problem_name: 'JumpAround'},
        {title: 'TCO19 Marathon Final', round_id: 30104784, old_round_id: 17729, problem_name: 'MultiplayerChessPieces'},
        {title: 'Marathon Match 112', round_id: 30107461, old_round_id: 17748, problem_name: 'GlowingBacteria'},
        {title: 'Marathon Match 113', round_id: 30110632, old_round_id: 17778, problem_name: 'NumberCreator'},
        {title: 'Marathon Match 114', round_id: 30112653, problem_name: 'SnakeCharmer'},
        {title: 'Marathon Match 115', round_id: 30114286, problem_name: 'GraphReconstruction'},
        {title: 'Marathon Match 116', round_id: 30119681, problem_name: 'Lossy2dCompression'},
        {title: 'Marathon Match 117', round_id: 30122730, problem_name: 'RotatingNumbers'},
        ]

    function insertNewPlatformRows($tbody, line) {
        let line_id = $tbody.find('tr').length + 1
        let $a = (
            line.old_round_id == undefined ?
            line.title :
            '<a href="https://competitiveprogramming.info/topcoder/marathon/round/'
            + line.old_round_id
            + '">'
            + line.title
            + '</a>')
        let tr =
            '<tr role="row"><td>'
            + line_id
            + '</td><td></td><td>' + $a + '</td><td><a target="_blank" href="https://www.topcoder.com/challenges/'
            + line.round_id + '">'
            + line.problem_name
            + '</a></td></tr>'
        $tbody.prepend(tr)
    }

    function setNewPlatformURL($tr){
        // old: https://community.topcoder.com/longcontest/?module=ViewProblemStatement&rd=ROUND_ID
        // new: https://www.topcoder.com/challenges/ROUND_ID
        let $tds = $tr.find('td')
        let $td = $($tds[3])
        let $a = $($td.find('a'))
        let url_old = $a.attr('href')
        let round_id = url_old.split('&')[1].split('=')[1]
        let url_new = 'https://www.topcoder.com/challenges/' + round_id
        $a.attr('href', url_new)
    }

    function deleteObsoleteRows($tbody) {
        while($($($tbody.find('tr')[0]).find('td')[0]).text() > 460) {
            $($tbody.find('tr')[0]).remove()
        }
    }

    let $tbody = $('html').find('tbody')
    deleteObsoleteRows(($tbody));

    let $trs = $tbody.find('tr')
    for(let tr of $trs) {
        setNewPlatformURL($(tr))
    }

    for(let line of new_problems) {
        insertNewPlatformRows(($tbody), line)
    }
})();