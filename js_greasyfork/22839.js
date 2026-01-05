// ==UserScript==
// @name         VkDog
// @namespace    http://mp-cis.com/
// @version      0.4
// @description  Чистим группу от собачек, срабатывание по CTRL+X
// @author       Феликс "GwynnBleiidd" Балясный
// @match        https://vk.com/*?act=users
// @match        https://*.vk.com/*?act=users
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22839/VkDog.user.js
// @updateURL https://update.greasyfork.org/scripts/22839/VkDog.meta.js
// ==/UserScript==

document.onkeyup=function(dogz){
    var e = e || window.event; // for IE to cover IEs window event-object
    if(e.ctrlKey && e.which == 88) {
        (function() {
            'use strict';

            var timeout = 5;
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://code.jquery.com/jquery-2.1.0.min.js';
            head.appendChild(script);

            function checkJQLoaded() {
                return typeof $ != 'undefined' && $.fn != 'undefined';
            }
            var loadJQ = setInterval(function () {
                timeout--;
                if (checkJQLoaded()) {
                    loadAllAccounts();
                    clearInterval(loadJQ);
                    return;
                } else if (timeout > 0) {
                    return;
                } else {
                    alert('Что-то я не могу загрузить JQuery. ' + 'Попробуйте обновить страницу и сделать всё заново!');
                    clearInterval(loadJQ);
                }
            }, 100);
            var allCnt = 0;
            var dogsCnt = 0;
            var accountsCnt;

            function loadAllAccounts() {
                var initialHeight = 0;
                var stops = 0;
                accountsCnt = $('div#gedit_users_summary_members').text().replace(/\D/g, '');
                var sInterval = setInterval(function () {
                    if (initialHeight == document.body.clientHeight && $('img.group_u_photo_img').length + 15 > accountsCnt) {
                        stops++;
                        if (stops > 30 && $('img.group_u_photo_img').length + 15 > accountsCnt) {
                            clearInterval(sInterval);
                            go();
                            return;
                        }
                    } else {
                        stops = 0;
                    }
                    initialHeight = document.body.clientHeight;
                    $('a#gedit_users_more_members').click();
                    scrollTo(0, 9999999999);
                }, 100);
            }

            function go() {
                $('img.group_u_photo_img').each(function () {
                    var src = $(this).attr('src');
                    allCnt++;
                    if (src != '/images/deactivated_100.png') $(this).parent().parent().parent().hide();else dogsCnt++;
                });
                if (confirm('Всего обработано подписчиков: ' + allCnt + '; собачек: ' + dogsCnt + ' (' + (100 * dogsCnt / allCnt).toFixed(2) + '%)\n' + 'Удаляем собачек?')) {
                    var dogsArray = $('img[src="/images/deactivated_100.png"]');
                    var currentDogIndex = 0;
                    var dogsInterval = setInterval(function () {
                        if (!dogsArray[currentDogIndex]) {
                            clearInterval(dogsInterval);
                            return;
                        }
                        $(dogsArray[currentDogIndex]).parent().parent().parent().find("a.group_u_action").last().click();
                        currentDogIndex++;
                    }, 10);
                }
            }
        })();
    }
};