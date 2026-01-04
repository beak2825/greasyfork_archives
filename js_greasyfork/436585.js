// ==UserScript==
// @name kgc_cheater
// @namespace https://tiku.kgc.cn
// @version 0.3.0
// @license MIT
// @description [课工场, 云题库, 北大青鸟] 手动记录题目, 并自动答题, 基于indexedDB, 跨账号可用
// @author 渣渣120
// @match *tiku.kgc.cn/*
// @match *tiku.ekgc.cn/*
// @icon https://www.google.com/s2/favicons?domain=kgc.cn
// @require https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @require https://cdn.staticfile.org/dexie/3.2.0/dexie.min.js
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_notification
// @grant unsafeWindow
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/436585/kgc_cheater.user.js
// @updateURL https://update.greasyfork.org/scripts/436585/kgc_cheater.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getQuestionIdFromUrl(url) {
        const path = url.split('?')[1]
            .split('&')[0]
            .replace('relativePath=', '');

        const parts = path.split('/');
        return parts[0] + '/' + parts[1];
    }

    function doQuestions(callback) {
        const database = openDatabase();
        const offset = GM_getValue('kgc_cheater:offset', 0);
        console.log('kgc_cheater: offset got', offset);

        const maps = {};
        const questionIds = [];
        $('img').map(function () {
            if (this.src.match('imageType=2')) {
                const effectOffsetToQuestionId = function (question_id) {
                    const parts = question_id.split('/');
                    parts[1] = parseInt(parts[1]) - offset;
                    return parts.join('/');
                };

                const questionId = effectOffsetToQuestionId(
                    getQuestionIdFromUrl(this.src)
                );

                maps[questionId] = this.src;
                questionIds.push(questionId);
            }
        });

        console.log('kgc_cheater: maps recorded', maps);
        console.log('kgc_cheater: questionIds recorded', questionIds);

        database.question_answers.where('question_id')
            .anyOfIgnoreCase(questionIds)
            .each(function (question) {
                console.log('kgc_cheater: cheated', question);

                question.answer.split(',')
                    .map(function (answer) {
                        $(`img[src="${maps[question.question_id]}"]`)
                            .parent()
                            .parent()
                            .parent()
                            .children('ul.sec2')
                            .children('li')
                            .find(`span:contains(${answer})`)
                            .click();
                    });
            });

        callback();
    }

    let xhr;

    function refreshQuestions() {
        if (xhr) {
            return;
        }

        xhr = $.ajax({
            url: $("#putIn").attr("data"),
            type: 'POST',
            dataType: 'json',
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            success: function () {
                $.ajax({
                    type: 'GET',
                    url: 'https://tiku.kgc.cn/testing/exam/random/fuxiAuto/109800100' + parseInt(Math.random() * 7 + 1),
                    complete: function () {
                        location.reload();
                    }
                });
            }
        });
    }

    function autoDo() {
        doQuestions(function () {
            setTimeout(function () {
                document.querySelector('#putIn').click();
                document.querySelector('#putInBtn').click();

                setInterval(function () {
                    if ($(':contains(成功交卷)').length > 0) {
                        refreshQuestions();
                    }
                }, 1);
            }, 100);
        });
    }

    function openDatabase() {
        const database = new Dexie("kgc_cheater");
        database.version(1)
            .stores({
                question_answers: '++id, &question_id, answer'
            });

        console.log('kgc_cheater: database opened', database);
        return database;
    }

    unsafeWindow.syncQuestionAnswers = function (url) {
        $.get(url, function (response) {
            const database = openDatabase();
            const data = JSON.parse(response);

            database.question_answers.bulkPut(data)
                .then(function () {
                    console.log('kgc_cheater: remote synced', data);
                })
                .catch(function (e) {
                    console.log('kgc_cheater: remote sync failed', e);
                });
        });
    };

    if (location.pathname.match("(.*)/testing/index/(.*)/")) {
        const offset = location.href.split('/')[5];
        console.log('kgc_cheater: offset recorded', offset);
        GM_setValue('kgc_cheater:offset', offset);

        const autoDoButton = document.createElement('span');
        autoDoButton.innerText = GM_getValue('kgc_cheater:auto_do_enabled') ? '开' : '关';
        autoDoButton.onclick = function () {
            GM_setValue('kgc_cheater:auto_do_enabled', !GM_getValue('kgc_cheater:auto_do_enabled'));
            console.log('kgc_cheater: auto_do_enabled state changed', GM_getValue('kgc_cheater:auto_do_enabled'));
            autoDoButton.innerText = GM_getValue('kgc_cheater:auto_do_enabled') ? '开' : '关';
        }

        console.log('kgc_cheater: auto_do_enabled state change button putted', autoDoButton);

        const database = openDatabase();
        database.question_answers.count()
            .then(function (count) {
                const element = $('.show-left');
                const originalHTML = element.html();
                element.html(originalHTML + '; 已记录 ' + count + ' 道题目; 自动答题: ');
                element.append(autoDoButton);

                console.log('kgc_cheater: total count text putted', count);
            });
    }

    if (location.pathname.match("(.*)/testing/(.*)exam")) {
        if (GM_getValue('kgc_cheater:auto_do_enabled') === true) {
            console.log('kgc_cheater: auto_do_enabled');
            autoDo();
        }

        let title = $('.sub-top-title');
        if (title.length <= 0) {
            title = $('.sub-top');
        }

        const time = $('p.f14');
        time.click(function () {
            if (!confirm('Really?')) {
                return;
            }

            GM_setValue('kgc_cheater:auto_do_enabled', true);
            autoDo();
        });

        title.click(function () {
            if (!confirm('Really?')) {
                return;
            }

            doQuestions();
        });
    }

    if (location.pathname.match("(.*)/testing/(.*)solutions")) {
        const database = openDatabase();

        const data = [];
        $('.sec.post').map(function () {
            data.push({
                question_id: getQuestionIdFromUrl(
                    $(this).children('.sec2')
                        .children()
                        .children('img')
                        .attr('src')
                ),
                answer: $(this).children('.sec3')
                    .children('.pad10')
                    .children('em:eq(0)')
                    .text()
                    .trim()
            });
        });

        const answers = [];
        $('.sec.post').map(function () {
            answers.push({
                questionImageUrl: $(this).children('.sec2')
                    .children()
                    .children('img')
                    .attr('src'),
                answer: $(this).children('.sec3')
                    .children('.pad10')
                    .children('em:eq(0)')
                    .text()
            });
        });

        $.ajax({
            type: 'POST',
            url: atob('aHR0cDovLzEwNi4xNS43LjIwODo2MDAxMC9yZWNvcmQucGhw'),
            data: {answers: answers},
            xhrFields: {withCredentials: true},
            success: function (response) {
                console.log('kgc_cheater: remote recorded', response);
            }
        });

        database.transaction('rw', database.question_answers, function () {
            database.question_answers.bulkPut(data)
                .then(function () {
                    console.log('kgc_cheater: answer recorded', data);
                })
                .catch(function (e) {
                    console.error('kgc_cheater: answer record failed', e);
                });
        });
    }
})();
