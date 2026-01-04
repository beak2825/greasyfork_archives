// ==UserScript==
// @name         115网盘播放器增强
// @version      1.0.2
// @description  115播放器功能增强，优化快进快退功能。
// @author       Xiaowu
// @license      GPL3
// @match        http*://115.com/*
// @match        http*://anxia.com/*
// @match        http*://*.anxia.com/*
// @namespace https://greasyfork.org/users/859588
// @downloadURL https://update.greasyfork.org/scripts/486809/115%E7%BD%91%E7%9B%98%E6%92%AD%E6%94%BE%E5%99%A8%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/486809/115%E7%BD%91%E7%9B%98%E6%92%AD%E6%94%BE%E5%99%A8%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

var defaultOpeningDuration = 10;

var fieldDefs = {
    'OpeningDuration': {
        'label': 'OP 时长',
        'type': 'unsigned int',
        'default': defaultOpeningDuration
    }
};

GM_config.init({
    id: 'GM_config',
    title: '115播放器增强',
    fields: fieldDefs
});

function appendElement(current, next) {
    console.log('add ', next);
    return current.insertAdjacentElement('afterend', next);
}

function registerHotkey(key, fn) {
    document.body.addEventListener('keyup', function (e) {
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

(function () {
    'use strict';

    function main() {
        var video = getPlayer();
        var configration = function () {
            GM_config.open();
        };

        var playButton = document.querySelector('.operate-bar a[btn="play"]');
        var currentButton = playButton;

        var skipOp = function () {
            video.currentTime += GM_config.get('OpeningDuration');
        };
        var skipOpButton = createButton(skipOp, '跳过OP (快捷键END)');
        skipOpButton.innerHTML = '<i class="icon-operate iop-playing" style="background-size: 240px 40px;"></i><div class="tooltip">点击跳过OP</div>';
        currentButton = appendElement(currentButton, skipOpButton);
        //registerHotkey('End', skipOp);
        registerHotkey('2', skipOp);

        var configButton = createButton(configration, '设置');
        configButton.innerHTML = '<i class="icon-operate iop-setting"></i>';
        currentButton = appendElement(currentButton, configButton);

        //替换默认的快进，快退，使用OP设计的值进行快进快退
        var skipLeftOp = function () {
            console.log(video.currentTime);
            if ((video.currentTime - GM_config.get('OpeningDuration')) <= 0) {
                video.currentTime = 0;
            } else {
                video.currentTime -= GM_config.get('OpeningDuration');
            }
        };
        //registerHotkey('ArrowLeft', skipLeftOp);
        registerHotkey('1', skipLeftOp);
        registerHotkey('ArrowRight', skipLeftOp);

        registerHotkey('PageDown', function () {
            document.getElementById('js-video_next').click();
            console.log('click');
        });
        return true;
    }

    function inject() {
        var video = getPlayer();
        if (video) {
            video.addEventListener('playing', main, {once: true});
            return true;
        }
    }

    retry(inject, 500, 10);
})();