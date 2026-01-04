// ==UserScript==
// @name         Average Sime
// @namespace    https://github.com/ecXbe/cps
// @version      2077v.4.2
// @description  Adds to the website agenda.sime.md the function of calculating the average score  |  Cyberpunk Coding
// @author       ezX
// @match        https://agenda.sime.md/ords/f?p=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sime.md
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454208/Average%20Sime.user.js
// @updateURL https://update.greasyfork.org/scripts/454208/Average%20Sime.meta.js
// ==/UserScript==

/*
_________        ___.                                     __
\_   ___ \___.__.\_ |__   _________________  __ __  ____ |  | __
/    \  \<   |  | | __ \_/ __ \_  __ \____ \|  |  \/    \|  |/ /
\     \___\___  | | \_\ \  ___/|  | \/  |_> >  |  /   |  \    <
 \______  / ____| |___  /\___  >__|  |   __/|____/|___|  /__|_ \
        \/\/          \/     \/      |__|              \/     \/
                                             _________ __
                                            /   _____//  |_  ____   ___________  ______
                                            \_____  \\   __\/ __ \_/ __ \_  __ \/  ___/
                                            /        \|  | \  ___/\  ___/|  | \/\___ \
                                           /_______  /|__|  \___  >\___  >__|  /____  >
                                                   \/           \/     \/           \/
*/

(function() {
    'use strict';

    const $ = jQuery.noConflict(true);

    function average(arr) {
        var finalstate = arr.reduce(
            function (state, a) {
                state.sum += a;
                state.count += 1;
                return state;
            },
            { sum: 0, count: 0 }
        );
        return finalstate.sum / finalstate.count;
    }([2, , , 6]);

    function nextscore(arr, avg) {
        let nextn = Math.floor(avg);
        nextn++

        let x = arr.slice();
        while (average(x) < nextn) {
            let i = nextn;
            while (i < 10) {
                i++
                x.push(i)
                if (average(x) < nextn) {
                    if (i != 10) {
                        x.splice(x.length--, 1);
                    }
                } else {break}
            }
        }
        x.splice(0, arr.length);
        return x;
    }

    function editscorelist(id) {
        let $scores = $table.find(`tbody tr:eq(${id})`).children().eq(-2).text();
        if (parseInt($scores) >= 9) return alert('Вам не поднять свою оценку')

        let $arr_of_scores = $table.find(`tbody tr:eq(${id}) td:eq(1)`).contents().filter(function() {return this.nodeType === 3}).text().split(', ').map(Number);
        let $Need_scores = nextscore($arr_of_scores, parseInt($scores));

        $table.find(`tbody tr:eq(${id}) td:eq(1)`).text($arr_of_scores.join(', ')).append(($('<span>', {style: 'color: red', text: `, ${$Need_scores.join(', ')}`})));
        $table.find(`tbody tr:eq(${id})`).children().eq(-2).text(average($table.find(`tbody tr:eq(${id}) td:eq(1)`).text().split(', ').map(Number))).css('color', 'red');

        let $New_Average_of_averages = [];
        $table.find('tbody').children().filter(s => s.nodeType !== 1).each(function() {
            if ($(this).find('td:eq(0)').text() !== 'Educația fizică' && $(this).find('td:eq(0)').text() !== 'Educație pentru societate' && $(this).find('td:eq(0)').text() !== 'Dezvoltarea personală' && $(this).find('td:eq(0)').text() !== 'A/A') {$New_Average_of_averages.push(parseFloat(average($(this).find('td:eq(1)').text().split(', ').map(Number)).toFixed(2)))}
        });

        $table.find('tbody tr:last').children().eq(-1).text(parseFloat(average($New_Average_of_averages.map(Number))).toFixed(2)).css('color', 'red');
    }

    let currentDate = new Date();
    let semestrul = ''; if (currentDate.getMonth() >= 8 && currentDate.getMonth() <= 11) {semestrul = 'Semestrul I'} else {
        semestrul = 'Semestrul II';

        $(`[summary="Semestrul I"]`).find('thead tr').append($('<th>', {'class': 't-Report-colHead', 'align': 'left', 'html': 'Average'}));
        let average_of_averages = [];
        $(`[summary="Semestrul I"]`).find('tbody').children().filter(s => s.nodeType !== 1).each(function() {
            if ($(this).find('td:eq(0)').text() !== 'Educație pentru societate') {let average_score = parseFloat(average($(this).find('td:eq(1)').text().split(', ').map(Number)).toFixed(2)); if (average_score) {average_of_averages.push(average_score); $(this).append( $('<td>', {class: 't-Report-cell', html: average_score}))}}
        });

        let c_ch = $(`[summary="Semestrul I"]`).find('tbody tr:eq(0)').children().length - 2;
        console.log(c_ch)
        $(`[summary="Semestrul I"]`).find('tbody').append($('<tr>', {class: 'a-a_I'}).append($('<td>', {class: 't-Report-cell', headers: 'DISCIPLINA'}).append($('<span>', {style: 'color: skyblue; font-weight:bold;', text: 'A/A'}))));

        for (let i = 0; i < c_ch; i++) {
            $('tr.a-a_I').append($('<td>'));
        }

        $('tr.a-a_I').append($('<td>', {class: 't-Report-cell', text: parseFloat(average(average_of_averages)).toFixed(2)}))
    }

    const $table = $(`[summary="${semestrul}"]`);
    let c_ch = $table.find('tbody tr:eq(0)').children().length - 1;
    $table.find('thead tr').append($('<th>', {'class': 't-Report-colHead', 'align': 'left', 'html': 'Average'}));

    let average_of_averages = [];
    let count = -1
    $table.find('tbody').children().filter(s => s.nodeType !== 1).each(function() {
        count++
        if ($(this).find('td:eq(0)').text() !== 'Educație pentru societate') {let average_score = parseFloat(average($(this).find('td:eq(1)').text().split(', ').map(Number)).toFixed(2)); if (average_score) {average_of_averages.push(average_score); $(this).append( $('<td>', {class: 't-Report-cell', html: average_score})); let $PlusButton = $('<a>', {href: '#', id: count, text: '+'}); $(this).append($('<td>', {class: 't-Report-cell'}).append($PlusButton.click(function() {editscorelist($PlusButton.attr('id'))})))}}
    });
    $table.find('tbody').append($('<tr>', {class: 'a-a'}).append($('<td>', {class: 't-Report-cell', headers: 'DISCIPLINA'}).append($('<span>', {style: 'color: skyblue; font-weight:bold;', text: 'A/A'}))));

    console.log(c_ch);
    for (let i = 0; i < c_ch; i++) {
        $('tr.a-a').append($('<td>'));
    }

    $('tr.a-a').append($('<td>', {class: 't-Report-cell', text: parseFloat(average(average_of_averages)).toFixed(2)}))
})();
