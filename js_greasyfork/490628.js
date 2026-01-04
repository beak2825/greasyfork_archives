// ==UserScript==
// @name         Ajax Async Lib
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Async lib for the west
// @include https://*.the-west.*/game.php*
// @include https://*.the-west.*.*/game.php*
// @license MIT
// ==/UserScript==


(function () {
    AjaxAsync = function() {
        jQuery.ajaxSetup({
            type: 'POST',
            dataType: 'json'
        });
        var makeUrl = function(options) {
            var url = 'game.php'
              , params = [];
            if (options.window)
                params.push('window=' + options.window);
            if (options.action)
                params.push('action=' + options.action, 'h=' + Player.h);
            if (options.ajax)
                params.push('ajax=' + options.ajax);
            if (options.mode)
                params.push('mode=' + options.mode);
            return url + params.length ? '?' + params.join('&') : '';
        };
        var onFinish = function(window) {
            return function() {
                if (window && window.hideLoader)
                    window.hideLoader();
                else if (window && window.hasOwnProperty('window'))
                    window.window.hideLoader();
            };
        };
        var request = async function(options) {
            var url = options.url || makeUrl(options);
            return await jQuery.ajax(url, options);
        };
        var defaultRequest = async function(options, window) {
            if (window && window.showLoader)
                window.showLoader();
            else if (window && window.hasOwnProperty('window'))
                window.window.showLoader();
            var result = await request(options);
            onFinish(window)();
            return result;
        };
        return {
            remoteCall: async function(window, action, param, view) {
                return await defaultRequest({
                    window: window,
                    action: action,
                    data: param
                }, view);
            },
            remoteCallMode: async function(window, mode, param, view) {
                return await defaultRequest({
                    window: window,
                    mode: mode,
                    data: param
                }, view);
            },
            get: async function(window, ajax, param, view) {
                return await defaultRequest({
                    window: window,
                    ajax: ajax,
                    data: param
                }, view);
            },
            gameServiceRequest: async function(method, urlparam, post) {
                return await defaultRequest({
                    url: Game.serviceURL + '/' + method + '/' + urlparam,
                    data: post
                });
            },
            request: request,
            wait: function (ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            },
            WaitJobsAsync: async function () {
                do {
                    await AjaxAsync.wait(400);
                } while (TaskQueue.queue.length > 0);
            },
        
        }
    }();

    })();
