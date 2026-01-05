// ==UserScript==
// @name            Mobile VK posts filter
// @name:en         Mobile VK posts filter
// @namespace       FIX
// @version         0.1.21
// @description     Скрывает рекламные и политические посты в vk.com. Высокое быстродействие в сравнении с аналогичными скриптами.
// @description:en  Hide ad and political posts from vk.com. High Speed.
// @copyright       2016, raletag
// @author          raletag
// @supportURL      http://greasyfork.org/scripts/23100/feedback
// @include         *://vk.com/*
// @exclude         *://vk.com/notifier.php*
// @exclude         *://vk.com/*widget*.php*
// @include         *://m.vk.com/*
// @grant           none
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/24193/Mobile%20VK%20posts%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/24193/Mobile%20VK%20posts%20filter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var showheader = true, // true - оставлять заголовок поста, false - полностью скрывать пост
        a = Date.now(),
        aps = 'побед(а|у) (в сражении|над боссом)|я (повысил|получил)(|а)(| новый) уровен|я тебя обогнал|уровень в игре|я одержал(|а) побед|победил(|а) босс|(прош(ел|ла)|меня|достиг(|ла)) (|([^\s]+) )уров|я выполнил(|а) задани',
        trash = 'вступ(и|ите|ай|айте) в|расска(зать|жите|зывай) дру(зьям|гу) про запись|дела(й|йте|ете|ть) репост|добав(ь|те|ляем|ляй) (активн(ого|ых))|(пиар(|ся|ьтесь) (тут|здесь))|подпи(шись|саться|сывайся|шитесь) на|активно добавля(й|ем)|(быть|стать|будьте|станьте|наши(м|х)) (подписчик|участник)|получить бесплатно|зач(е|ё)тны(е|й) кореш(|а)|победител(ь|я|и) розыгрыш|внимание розыгрыш|добав(ь|ьте|ляйтесь|лю|ляю|ляемся|ить) (в дру|его|её|их|все|за|через)|(за|делавшему|делай|конкурс) репост|при(ми|мите|нять|нимайте) участие|результат(|ы) конкурс|зака(жи|жите|зывай|зывайте) по акци|успей(|те) (вступить|подписаться)|смотреть ответ|читать продолжение|только для участников сообществ|науч(у|итесь) бесплатн|пере(йди|йдите|ходи|ходим|ходите) по ссылк|успей(|те) добав|ссылка на рег|закажи(|те) сейчас|ответ на новую политику|((й|и|е|м|т) промо|введи(|те) |используй(|те) )код|получи(|те) скид|бонус на (|твой |ваш )первый депозит',
        urlads = 'vk\.com\/(app|top_cards|fotomimi|flower_cards|megatest|beauty_cards|fotomagic_su|we_love_cards|denegnoe_derevo|skanograf|pr0werka|musicwars|love1v|vkvoprosnik|mvd_game#)|(clickerwars|schoolclicker)\.com\/vk|denezhnojederevo\.ru|ref=|partner=|invite(=|-ru)|=vulkan|act=invite&group_id=',
        politic = 'выборы в|правительств|националист|оппозици|ополчен|петици|митинг|парламент|фальсификац|госдум|арест|террорист|теракт|антигосударств|#политика|#выборы',
        regexp = new RegExp('(' + ((aps + '|' + trash + '|' + urlads + '|' + politic).replace(/у/g,'(у|y)').replace(/е/g,'(е|e)').replace(/х/g,'(х|x)').replace(/а/g,'(а|a)').replace(/р/g,'(р|p)').replace(/о/g,'(о|o)').replace(/с/g,'(с|c)').replace(/ /g,'([\\s]+)')) + ')', 'i'),
        MutationObserver = window.MutationObserver,
        ismobile = (window.location.hostname === 'm.vk.com'),
        rbody = (ismobile?'.wi_body':'.wall_text'),
        rlnk = (ismobile?'a.medias_link[href*="vk.com/app"]':'a.lnk[href*="vk.com/app"]'),
        radatt = (ismobile?'data-ad-view':'data-ad'),
        rqsa = (ismobile?'div[id*="wall"].wall_item:not([vpf])':'div[data-post-id].post:not([vpf])'),
        rwc = (ismobile?'wall_item':'post'),
        filter = function (e) {
            e.setAttribute('vpf', '1');
            var text = e.querySelector(rbody);
            if (e.querySelector(rlnk)  || e.getAttribute(radatt) || (e.id && e.getAttribute('data-copy') && e.id[4] === '-' && e.getAttribute('data-copy')[0] === '-') || (text && (regexp.test(text.textContent) || (!ismobile && d(text))))) {
                if (showheader === true) {
                    if (ismobile) {
                        text.innerHTML = '';
                    } else {
                        e.querySelector('.post_header').classList.add('post_header_fix');
                        e.querySelector('.post_content').innerHTML = '';
                    }
                } else {
                    e.innerHTML = '';
                }
            }
        },
        d = function (e) {
            var a  = e.querySelectorAll('div.wall_post_text a[href]'), b = {}, c;
            if (a.length > 1) {
                for (var i = a.length - 1; i >= 0; --i) {
                    c = a[i].href.replace(/http(|s):\/\/vk.com/,'');
                    if (b[c]) {
                        return true;
                    }
                    b[c] = true;
                }
            }
            return false;
        };

    if (showheader === true && !ismobile) {
        var style = document.createElement("style");
        style.innerHTML='.post_header_fix {padding: 15px 20px 15px!important;}';
        (document.head||document.body||document.documentElement||document).appendChild(style);
    }

    if (!/^\/wall(.*)_/.test(window.location.pathname)) {
        for (var links = document.body.querySelectorAll(rqsa), i = links.length - 1; i >= 0; --i) {
            filter (links[i]);
        }
    }
    if (MutationObserver) {
        new MutationObserver(function (ms) {
            if (document.body.querySelector('div.apps_options_bar') || /=wall/.test(window.location.search) || /^\/wall(.*)_/.test(window.location.pathname)) return;
            ms.forEach(function (m) {
                m.addedNodes.forEach(function (n) {
                    if (n.nodeType !== Node.ELEMENT_NODE) {
                        return;
                    }
                    if (n.id && n.classList && n.classList.contains(rwc) && !n.getAttribute('vpf')) {
                        filter (n);
                    } else {
                        for (var links = n.querySelectorAll(rqsa), i = links.length - 1; i >= 0; --i) {
                            filter (links[i]);
                        }
                    }
                });
            });
        }).observe(document.body, {childList:true, subtree:true});
    } else {
        document.body.addEventListener('DOMNodeInserted', function(e) {
            if (document.body.querySelector('div.apps_options_bar') || /=wall/.test(window.location.search) || /^\/wall(.*)_/.test(window.location.pathname)) return;
            var n = e.target;
            if (n) {
                if (n.nodeType !== Node.ELEMENT_NODE) {
                    return;
                }
                if (n.id && n.classList && n.classList.contains(rwc) && !n.getAttribute('vpf')) {
                    filter (n);
                } else {
                    for (var links = n.querySelectorAll(rqsa), i = links.length - 1; i >= 0; --i) {
                        filter (links[i]);
                    }
                }
            }
        }, false);
    }
    alert('VK posts filter: ' + (Date.now() - a) + 'ms');
})();