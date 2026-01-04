// ==UserScript==
// @name         115 Player Enhancer
// @namespace    https://greasyfork.org/scripts/376536-115-player-enhancer
// @version      0.7
// @description  115播放器增强
// @author       zaypen
// @license      MIT
// @match        http*://115.com/*
// @match        http*://anxia.com/*
// @match        http*://*.anxia.com/*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.min.js
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @require      https://cdn.staticfile.org/lodash.js/4.17.21/lodash.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/376536/115%20Player%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/376536/115%20Player%20Enhancer.meta.js
// ==/UserScript==

/*jslint browser:true*/
/*global GM_config, _, $ */

var defaultOpeningDuration = 125;

var fieldDefs = {
    'OpeningDuration': {
        'label': 'OP 时长',
        'type': 'unsigned int',
        'default': defaultOpeningDuration
    }
};

GM_config.init({
  id: 'GM_config',
  title: '115 Player Enhancer',
  fields: fieldDefs
});

function appendElement(current, next) {
    console.log('add ', next);
    return current.insertAdjacentElement('afterend', next);
}

function registerHotkey(key, fn) {
    document.body.addEventListener('keyup', function(e) {
        if (e.key === key) {
            fn();
        }
    });
}

function retry(fn, interval, times) {
    var ret = fn();
    if (!ret && times) {
        setTimeout(function () {
            retry(fn, interval, times--);
        }, interval);
    }
}

function createButton(onclick, alt) {
    var button = document.createElement('a');
    button.href = 'javascript:;';
    button.className = 'btn-switch';
    button.alt = alt;
    button.onclick = onclick;
    return button;
}

function getPlayer() {
    return $('#js-video')[0];
}

function getNextItem() {
    var items = Array.apply(null, document.querySelectorAll('.video-playlist .vpl-container .item-list li'));
    var remainingItems = _.dropWhile(items, function (item) {
        return item.className !== 'hover';
    });
    return _.head(_.tail(remainingItems));
}

(function() {
    'use strict';

    function main() {
        var video = getPlayer();
        var configration = function() {
            GM_config.open();
        };

        var playButton = document.querySelector('.operate-bar a[btn="play"]');
        var currentButton = playButton;

        var skipOp = function() {
            video.currentTime += GM_config.get('OpeningDuration');
        };
        var skipOpButton = createButton(skipOp, '跳过OP (快捷键END)');
        skipOpButton.innerHTML = '<i class="icon-operate iop-playing" style="background-size: 240px 40px;"></i><div class="tooltip">点击跳过OP</div>';
        currentButton = appendElement(currentButton, skipOpButton);
        registerHotkey('End', skipOp);

        var configButton = createButton(configration, '设置');
        configButton.innerHTML = '<i class="icon-operate iop-setting"></i>';
        currentButton = appendElement(currentButton, configButton);

        var nextButton = document.querySelector('.operate-bar a[btn="next"]');
        nextButton.innerHTML += '<div class="tooltip">下一集(快捷键PageDown)</div>';
        registerHotkey('PageDown', function() {
            nextButton.click();
        });

        var jump = function() {
            var endTime = video.buffered.end(video.buffered.length - 1);
            var target = endTime - 5;
            if (video.currentTime < target) {
                video.currentTime = target;
            }
        };
        registerHotkey('0', jump);

        console.info('115 Enhancer loaded');
        return true;
    }

    function inject() {
        var video = getPlayer();
        if (video) {
            video.addEventListener('playing', main, { once: true });
            return true;
        }
    }

    retry(inject, 500, 10);
})();