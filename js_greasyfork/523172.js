// ==UserScript==
// @name         Snow Effect
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add a snow effect to any website
// @author       Masahiro Abe (modified for Tampermonkey by OpenAI Assistant)
// @match        *://drrrkari.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523172/Snow%20Effect.user.js
// @updateURL https://update.greasyfork.org/scripts/523172/Snow%20Effect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // スタイルを挿入
    const style = document.createElement('style');
    style.textContent = `
        .snow {
            position: absolute;
            background-color: white;
            border-radius: 50%;
            z-index: 9999;
        }
    `;
    document.head.appendChild(style);

    // ATSnow クラス定義
    var ATSnow = function(vars) {
        var _self = this;
        var _snows = [];
        var _scrollHeight = 0;
        var _windowWidth = 0;
        var _windowHeight = 0;
        var _doc = document;

        var options = {
            classname: 'snow',
            count: 100,
            interval: 40,
            maxSize: 5,
            minSize: 1,
            leftMargin: 50,
            rightMargin: 50,
            bottomMargin: 30,
            maxDistance: 10,
            minDistance: 1
        };

        this.config = function(property) {
            for (var i in property) {
                if (!vars.hasOwnProperty(i)) {
                    continue;
                }
                options[i] = property[i];
            }
        };

        this.addEvent = function(eventTarget, eventName, func) {
            if (eventTarget.addEventListener) {
                eventTarget.addEventListener(eventName, func, false);
            } else if (window.attachEvent) {
                eventTarget.attachEvent('on' + eventName, function() { func.apply(eventTarget); });
            }
        };

        this.getScrollHeight = function() {
            if (_doc.documentElement.scrollHeight) {
                return _doc.documentElement.scrollHeight;
            } else {
                return _doc.body.scrollHeight;
            }
        };

        this.getRandomInt = function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        this.getWindowWidth = function() {
            return window.innerWidth || _doc.documentElement.clientWidth || _doc.body.clientWidth;
        };

        this.getWindowHeight = function() {
            return window.innerHeight || _doc.documentElement.clientHeight || _doc.body.clientHeight;
        };

        this.createSnow = function() {
            var body = _doc.body;

            for (var i = 0; i < options.count; i++) {
                var snow = _doc.createElement('div');
                snow.className = options.classname;
                var diameter = _self.getRandomInt(options.minSize, options.maxSize);
                snow.style.width = diameter + 'px';
                snow.style.height = diameter + 'px';

                _snows[i] = {};
                var snows = _snows[i];
                snows.ele = snow;
                snows.distance = _self.getRandomInt(options.minDistance, options.maxDistance);
                snows.degree = _self.getRandomInt(1, 10);
                snows.move = 0;
                snows.size = diameter;

                body.appendChild(snow);
            }
        };

        this.snowsPositionReset = function() {
            for (var i = 0; i < options.count; i++) {
                var topPosition = Math.floor(Math.random() * _scrollHeight);
                _self.snowPositionReset(_snows[i], topPosition - _scrollHeight);
            }
        };

        this.snowPositionReset = function(snow, y) {
            var leftPosition = _self.getRandomInt(options.leftMargin, _windowWidth - options.rightMargin);
            snow.ele.style.top = y + 'px';
            snow.ele.style.left = leftPosition + 'px';
            snow.x = leftPosition;
        };

        this.move = function() {
            var fall = function() {
                for (var i = 0; i < options.count; i++) {
                    var snow = _snows[i];
                    var top = parseInt(snow.ele.style.top) || 0;
                    snow.move += snow.degree;

                    if (top + snow.size >= _scrollHeight - options.bottomMargin) {
                        _self.snowPositionReset(snow, 0);
                    } else {
                        snow.ele.style.top = top + snow.size + 'px';
                        snow.ele.style.left = snow.x + Math.cos(snow.move * Math.PI / 180) * snow.distance + 'px';
                    }
                }
                setTimeout(function() { fall(); }, options.interval);
            };
            fall();
        };

        this.load = function() {
            _self.config(vars);

            _self.addEvent(window, 'load', function() {
                _scrollHeight = _self.getScrollHeight();
                _windowWidth = _self.getWindowWidth();
                _windowHeight = _self.getWindowHeight();
                _self.createSnow();
                _self.snowsPositionReset();
                _self.move();
            });

            _self.addEvent(window, 'resize', function() {
                _scrollHeight = _self.getScrollHeight();
                _windowWidth = _self.getWindowWidth();
                _windowHeight = _self.getWindowHeight();
                _self.snowsPositionReset();
            });
        };
    };

    // 雪エフェクトを起動
    var snowEffect = new ATSnow({
        count: 150, // 雪の数を変更可能
        maxSize: 8, // 雪の最大サイズ
        minSize: 2  // 雪の最小サイズ
    });
    snowEffect.load();
})();
