// ==UserScript==
// @name         artfinder.com авто-лайкер и авто-подписка
// @namespace    tuxuuman:artfinder:autolike
// @version      0.1
// @description  авто подписка и выставление лайков
// @author       tuxuuman <tuxuuman@gmail.com>
// @match        *://*.artfinder.com/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/38298/artfindercom%20%D0%B0%D0%B2%D1%82%D0%BE-%D0%BB%D0%B0%D0%B9%D0%BA%D0%B5%D1%80%20%D0%B8%20%D0%B0%D0%B2%D1%82%D0%BE-%D0%BF%D0%BE%D0%B4%D0%BF%D0%B8%D1%81%D0%BA%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/38298/artfindercom%20%D0%B0%D0%B2%D1%82%D0%BE-%D0%BB%D0%B0%D0%B9%D0%BA%D0%B5%D1%80%20%D0%B8%20%D0%B0%D0%B2%D1%82%D0%BE-%D0%BF%D0%BE%D0%B4%D0%BF%D0%B8%D1%81%D0%BA%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    Array.prototype.slowEach = function (interval, cb) {
        var idx = 0;
        var list = this;
        var max = list.length;

        var timer = setInterval(function () {
            if (idx >= max) {
                clearInterval(timer);
                cb(null, null, true);
            } else {
                if(cb(list[idx], idx, false)) {
                    idx = max;
                } else idx++;
            }
        }, parseInt(interval) || 1000);
    }

    if(window.location.pathname == "/shop/") {
        GM_registerMenuCommand('Поставить лайки', function() {
            var notLikes = $('a:not(.af-is-interested)>.icon-af-heart').toArray();

            if(notLikes.length) {
                var max = notLikes.length;
                if(confirm('Найдено ' + notLikes.length + ' записей. Начать ставить лайки?')) {
                    var counter = 0;
                    notLikes.slowEach(1000, function(e, i, end) {
                        if(end) {
                            document.title = 'Завершено!';
                            alert('Завершено! Лайков выставлено:' + counter + '/' + max);
                        } else {
                            $(e).click();
                            document.title = 'Лайков:' + counter + '/' + max;
                            counter++;
                        }
                    });
                }
            } else {
                alert('Нечего лайкать');
            }
        });
    } else if(window.location.pathname.includes('/interests/follows/')) {
        GM_registerMenuCommand('Подписаться', function() {
            var notFollows = $('a.js-follow:not(.active)').toArray();

            if(notFollows.length) {
                var max = notFollows.length;
                if(confirm('Найдено ' + notFollows.length + ' подписчиков. Начать подписку?')) {
                    var counter = 0;
                    notFollows.slowEach(1000, function(e, i, end) {
                        if(end) {
                            document.title = 'Завершено!';
                            alert('Завершено!' + counter + '/' + max);
                        } else {
                            $(e).click();
                            document.title = 'Подписчиков:' + counter + '/' + max;
                            counter++;
                        }
                    });
                }
            } else {
                alert('Подписчики не найдены');
            }
        });
    }

})();