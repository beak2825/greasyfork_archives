// ==UserScript==
// @name         SUAI hide tasks
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Добавляет чекбокс для скрытия заданий в лк гуапа
// @author       goodhumored
// @license      MIT
// @match        https://pro.guap.ru/inside_s
// @icon         https://www.google.com/s2/favicons?domain=guap.ru
// @grant        GM.setValue
// @grant        GM.getValue
// @run-at       document-end
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/436959/SUAI%20hide%20tasks.user.js
// @updateURL https://update.greasyfork.org/scripts/436959/SUAI%20hide%20tasks.meta.js
// ==/UserScript==

(function asd() {
    'use strict';
    var interval = setInterval(function() {
        if ($('.content').length == 1 && document.location.hash == '#tasks')
            onload();
    }, 1000);

    var hidden_tasks = [];
    var hiding = true;

    async function onload() {
        hidden_tasks = await GM.getValue('hidden_tasks', []);
        hiding = await GM.getValue('hiding', true);

        $('.chb_row').remove();
        let row = $('.panel-body')[0].appendChild(document.createElement('div'));
        row.className = 'row chb_row';
        let cm3 = row.appendChild(document.createElement('div'));
        cm3.className = 'col-md-3';
        let fg = cm3.appendChild(document.createElement('div'));
        fg.className = 'form-group';
        let label = fg.appendChild(document.createElement('label'));
        label.innerText = 'Скрывать помеченные задания ';
        let hideC = label.appendChild(document.createElement('input'));
        hideC.type = 'checkbox';
        hideC.onchange = (event) => hide(event.target.checked);
        hideC.checked = hiding;

        add_checkboxes();

        let c = $('[name=tableTasks_length]')[0];
        $('[name=tableTasks_length]').change((event) => {GM.setValue('show_count', event.target.value); add_checkboxes();})
        c.value = await GM.getValue('show_count', 15);
        c.dispatchEvent(new Event('change'));
    }
    function add_checkboxes() {
        $('.hide_checkbox').remove();
        $('#tableTasks tbody tr').each(function(i, e) {
            let id = e.lastElementChild.firstElementChild.href.split('/').at(-1)
            let l = e.lastElementChild.appendChild(document.createElement('label'));
            l.innerText = 'Скрыть ';
            l.className = 'hide_checkbox';
            let inp = l.appendChild(document.createElement('input'));
            inp.type = 'checkbox';
            inp.setAttribute('task-id', id);
            if (hidden_tasks.indexOf(id) != '-1') {
                if (hiding)
                    e.hidden = true;
                inp.checked = true;
            }
            inp.onchange = function(event) {
                if (event.target.checked) {
                    hidden_tasks.push(id);
                    if (hiding)
                        event.target.parentElement.parentElement.parentElement.hidden = true;
                } else {
                    hidden_tasks.splice(hidden_tasks.indexOf(id), 1);
                }
                GM.setValue('hidden_tasks', hidden_tasks);
            }
        });
    }
    function hide(checked) {
        if (checked) {
            $('#tableTasks tbody tr').each(function(i, e) {
                let id = e.lastElementChild.firstElementChild.href.split('/').at(-1);
                let ind = hidden_tasks.indexOf(id);
                if (ind != -1)
                    e.hidden = true;
            });
            hiding = true;
        } else {
            $('tr[hidden]').each((i, e)=>{e.hidden = false});
            hiding = false;
        }
        GM.setValue('hiding', hiding);
    }
})();
