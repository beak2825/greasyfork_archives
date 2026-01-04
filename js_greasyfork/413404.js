// ==UserScript==
// @name         SimpleMMO Helper Library
// @namespace    simple-mmo.com
// @version      1.001
// @description  SimpleMMO Helper Library - Some useful functions
// @author       Anton
// @match        https://web.simple-mmo.com/*
// @require      https://code.jquery.com/jquery-3.5.1.slim.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/413404/SimpleMMO%20Helper%20Library.user.js
// @updateURL https://update.greasyfork.org/scripts/413404/SimpleMMO%20Helper%20Library.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */

(function() {
    'use strict';

    const timer = {
        timers: {},
        isTimeFor(name) {
            return this.timeFor(name);
        },
        time(name) {
            return this.timeFor(name);
        },
        timeFor(name) {
            if (this.timers[name]) {
                const { interval, start } = this.timers[name];
                return performance.now() - start >= interval;
            }
            return false;
        },
        update(name, interval) {
            this.timers[name] = { start: performance.now(), interval };
        }
    };

    const ispage = (p) => window.location.pathname.indexOf(p) > -1;

    const page = {
        isCollectionAvatars: () => ispage('/collection/avatars'),
        isCollectionCollectables: () => ispage('/collection/collectables'),
        isCollectionItems: () => ispage('/collection/items'),
        isCollectionSprites: () => ispage('/collection/sprites'),
        isAttack: () => ispage('/npcs/attack'),
        isTasks: () => ispage('/tasks/viewall'),
        isTown: () => ispage('/town'),
    };

    const storage = {
        tasks: undefined,
        updateTasks() {
            if (this.tasks === undefined) {
                const tasksObj = localStorage.getItem('smmoTasks');
                if (tasksObj) {
                    this.tasks = JSON.parse(tasksObj);
                }
                if (!this.tasks) {
                    this.tasks = {};
                }
            }
        },
        getTasks() {
            this.updateTasks();
            return this.tasks;
        },
        setTasks(tasks) {
            localStorage.setItem('smmoTasks', JSON.stringify(tasks));
        },
        incTask(taskIndex) {
            this.updateTasks();
            if (this.tasks[taskIndex]) {
                if (this.tasks[taskIndex].value < this.tasks[taskIndex].max) {
                    this.tasks[taskIndex].value++;
                    if (this.tasks[taskIndex].value >= this.tasks[taskIndex].max) {
                        this.tasks[taskIndex].finished = true;
                    }
                    this.setTasks(this.tasks);
                }
            }
        }
    };

    const SimpleMmoHelper = {
        storage,
        timer,
        page,
        isWorking: undefined,
        addStyle(css) {
            var head = document.head || document.getElementsByTagName('head')[0],
                style = document.createElement('style');

            head.appendChild(style);

            style.type = 'text/css';
            if (style.styleSheet){
                // This is required for IE8 and below.
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }
        },
        initStyles() {
            let styleStr = `
.kt-footer { display: none; }
.container-two { margin-bottom: 100px; }
.dropdown-menu { top: 90%; }
.selectableRow { line-height: 40px; }
.kt-portlet .kt-portlet__body { padding: 6px; }
.swal2-popup .swal2-content { padding-left: 70px; }
.swal2-popup { width: 40em !important; }
`;
            if (page.isTasks()) {
                styleStr += ' .swal2-image { position: absolute; left: 10px; width: 70px; bottom: 10px; height: auto !important; } ';
            } else {
                styleStr += ' .swal2-image { position: absolute; left: 10px; width: 70px; top: 10px; } ';
            }
            this.addStyle(styleStr);

            $('.fiveMinuteCountDown').css('font-size', '9px');
            $('.tenMinuteCountDown').css('font-size', '9px');
            $('.topbar.static-top').css('background', 'rgba(25,25,25,0.4)');
            $('.d-lg-block').css('margin-top', '4px').css('margin-bottom', '4px');
            $('#kt_chat_content .kt-chat__editor').css('border', '1px solid');

            if (page.isCollectionAvatars() || page.isCollectionSprites()) {
                $('label img').css('width', '100px');
            }
            if (page.isCollectionItems() || page.isCollectionCollectables()) {
                $('.flex-container div>img').css('width', '75px');
            }
            if (page.isAttack()) {
                $('.kt-widget7__desc img').css('width', '70px');
            }
            if (page.isTown()) {
                const mainRow = $('.kt-portlet--mobile').closest('.kt-container');
                const leftColumn = mainRow.find('.row > .col-md-8');
                const rightColumn = mainRow.find('.row > .col-md-4');
                leftColumn.removeClass('col-md-8').addClass('col-md-6');
                rightColumn.removeClass('col-md-4').addClass('col-md-6');
                const texts = rightColumn.find('.text-content');
                texts.css('color', 'black').css('font-size', '14px');
                const nameLinks = rightColumn.find('a[id^=board] .row div>span[style]');
                for (let i = 0; i < nameLinks.length; i++) {
                    const item = $(nameLinks[i]);
                    const link = item.closest('a[href]');
                    if (link.attr('href') == 'javascript:;') {
                        console.log('CHANGE LINK');
                        const userName = item.text().trim();
                        const m = userName.match(/[?\S*]?\s(.+)/);
                        const name = m ? m[1] : userName;
                        const searchLink = '/userlist/all?username=' + name.replaceAll(' ', '+') + '&minlevel=';
                        link.attr('href', searchLink);
                        link.attr('target', '_blank');
                    }
                }
            }
        },
        fixWorkingBlock() {
            const workingBlock = $('.kt-portlet__body:has(img):has(strong)');
            this.isWorking = false;
            if (workingBlock.length == 1) {
                if (workingBlock.text().toLowerCase().indexOf('are currently working') > -1) {
                    this.isWorking = true;
                    let text, minutes;
                    const parts = $('.kt-portlet__body:has(img):has(strong)').find('strong');
                    for (let i = 0; i < parts.length; i++) {
                        const minut = this.num($(parts[i]).text());
                        if (!isNaN(minut) && minut) {
                            minutes = minut;
                        } else {
                            text = $(parts[i]).text();
                        }
                    }
                    if (text && minutes) {
                        const row = workingBlock.closest('.row');
                        row.html('<div class="kt-portlet" style="font-size:20px;padding:2px 10px;display:block;">' + text + ' For <span id="minutes-working-42">' + minutes + '</span> minutes.</div>');
                        const timer = setInterval(() => {
                            minutes--;
                            if (minutes == 0) clearInterval(timer);
                            $('#minutes-working-42').text(minutes);
                        }, 60000);
                    }
                }
            }
            console.log('[WORKING]', this.isWorking ? 'TRUE' : 'FALSE');
        },
        addToolButton(left, onclick, caption, id) {
            const buttonCode = `<div style="z-index:999999;position:fixed;bottom:0;left:${left}px;margin-bottom:25px;margin-left:25px;"><button id="${id}" class="cta cta-large" onclick="${onclick}"><img src="/img/icons/S_Thunder01.png" style="padding-right:10px;"> <span>${caption}</span></button></div>`;
            $('body').append($(buttonCode));
        },
        num(n) {
            return parseInt(n.replaceAll(',', ''));
        },
        randomTimeout(m) {
            return (Math.random() * m + m) | 0;
        },
        setTitle(title) {
            if (document.title != title) document.title = title;
        },
        extract(txt, regex, def) {
            let m = txt.match(regex);
            if (m && m.length > 1) return m[1];
            return def;
        },
        updateTaskList() {
            let tasks = [];
            const labels = $('.kt-widget5__desc');
            for (let i = 0; i < labels.length; i++) {
                const text = $(labels[i]).text().toLowerCase().trim();
                const parent = $(labels[i]).parent();
                const counter = parent.find('.kt-widget5__info').text().toLowerCase().trim();
                const value = this.extract(counter, /(\d+)\s/, 0);
                const max = this.extract(counter, /\/\s(\d+)/, 5);
                if (text.indexOf('you must kill') > -1) {
                    const region = this.extract(text, /can be found in\s(\S+)\s/, 'Unknown');
                    const enemy = this.extract(text, /you must kill\s(\D+)\s\d+/, 'Unknown');
                    tasks.push({type: 'kill', region, enemy, value, max, finished: value == max});
                } else if (text.indexOf('complete the quest') > -1) {
                    const name = this.extract(text, /complete the quest \"(.+)\"/, 'Unknown');
                    tasks.push({type: 'quest', name, value, max, finished: value == max});
                } else if (text.indexOf('perform') > -1) {
                    tasks.push({type: 'travel', value, max, finished: value == max});
                } else if (text.indexOf('worship') > -1) {
                    const name = this.extract(text, /worship\s(\S+)/, 'God');
                    tasks.push({type: 'temple', name, value, max, finished: value == max});
                }
            }
            console.log('[TASKS]', tasks);
            this.storage.setTasks(tasks);
        },
        run() {
            console.log('[HELLO] from SimpleMmoHelper');
            this.initStyles();
            this.fixWorkingBlock();
            if (page.isTasks()) this.updateTaskList();
        }
    };

    SimpleMmoHelper.run();

    if (typeof unsafeWindow !== 'undefined') {
        if (unsafeWindow.SimpleMmoHelper === undefined) {
            unsafeWindow.SimpleMmoHelper = SimpleMmoHelper;
            unsafeWindow.num = SimpleMmoHelper.num;
        }
    }
})();