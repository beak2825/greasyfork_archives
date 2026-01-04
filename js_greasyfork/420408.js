// ==UserScript==
// @name           bimibimi_next_episode
// @name:zh-CN        bimibimi自动下集
// @name:zh-TW        bimibimi自動下集
// @namespace      bimibimi_next_episode
// @description    bimibimi auto next episode
// @description:zh-CN bimibimi自动播放下集
// @description:zh-TW bimibimi自動播放下集
// @include        http://49.234.56.246/danmu/play.php?url=*
// @include        http://www.bimiacg.com/bangumi/*
// @run-at      document-end
// @grant         GM_registerMenuCommand
// @grant         GM_setValue
// @grant         GM_getValue
// @author      zhuzemin
// @version     1.00
// @supportURL  https://github.com/zhuzemin
// @downloadURL https://update.greasyfork.org/scripts/420408/bimibimi_next_episode.user.js
// @updateURL https://update.greasyfork.org/scripts/420408/bimibimi_next_episode.meta.js
// ==/UserScript==
//config
let config = {
        'debug': false,
        'skip': GM_getValue('skip') || 0.0
}
config.skip = parseFloat(config.skip);
let debug = config.debug ? console.log.bind(console) : function () {
};
// prepare UserPrefs
setUserPref(
        'skip',
        config.skip,
        'Skip ending',
        `Skip ending, input ending seconds. *effect after reload`,
);

let init = function () {
        if (window.self === window.top) {
                debug('main');
                window.addEventListener('message', function (e) {
                        debug(e.data);
                        if (e.data == 'end') {
                                let current = parseInt(window.location.href.match(/\/(\d+)\/?$/)[1]);
                                let list = document.querySelector('ul.player_list');
                                if (current < list.childNodes.length) {
                                        let next = current + 1;
                                        window.location.href = window.location.href.replace(/\/(\d+)\/?$/, '/' + next + '/');
                                }
                        }
                });
        }
        else {
                debug('iframe');
                let interval = setInterval(() => {
                        let video = document.querySelector('#video');
                        if (video != null) {
                                debug('suc');
                                clearInterval(interval);
                                let timer = setInterval(() => {
                                        debug(video.currentTime);
                                        debug(video.currentTime + config.skip);
                                        if (video.currentTime + config.skip >= video.duration) {
                                                debug('end');
                                                clearInterval(timer);
                                                parent.postMessage('end', "*");
                                        }

                                }, 1000);
                        }

                }, 1000);
        }
}
window.addEventListener('DOMContentLoaded', init);
/**
 * Create a user setting prompt
 * @param {string} varName
 * @param {any} defaultVal
 * @param {string} menuText
 * @param {string} promtText
 * @param {function} func
 */
function setUserPref(varName, defaultVal, menuText, promtText, func = null) {
        GM_registerMenuCommand(menuText, function () {
                var val = prompt(promtText, GM_getValue(varName, defaultVal));
                if (val === null) { return; }  // end execution if clicked CANCEL
                GM_setValue(varName, val);
                if (func != null) {
                        func(val);
                }
        });
}
