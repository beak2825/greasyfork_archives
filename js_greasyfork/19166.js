// ==UserScript==
// @name         SteamCompanion Auto Giveaway Enterer
// @version      0.2.1
// @description  A script that automatically enters all available giveaways on SteamCompanion.com
// @author       Humberd
// @match        https://steamcompanion.com/*
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/19166/SteamCompanion%20Auto%20Giveaway%20Enterer.user.js
// @updateURL https://update.greasyfork.org/scripts/19166/SteamCompanion%20Auto%20Giveaway%20Enterer.meta.js
// ==/UserScript==
/*!
 * JavaScript Cookie v2.1.1
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        var OldCookies = window.Cookies;
        var api = window.Cookies = factory();
        api.noConflict = function () {
            window.Cookies = OldCookies;
            return api;
        };
    }
}(function () {
    function extend() {
        var i = 0;
        var result = {};
        for (; i < arguments.length; i++) {
            var attributes = arguments[ i ];
            for (var key in attributes) {
                result[key] = attributes[key];
            }
        }
        return result;
    }

    function init(converter) {
        function api(key, value, attributes) {
            var result;
            if (typeof document === 'undefined') {
                return;
            }

            if (arguments.length > 1) {
                attributes = extend({
                    path: '/'
                }, api.defaults, attributes);

                if (typeof attributes.expires === 'number') {
                    var expires = new Date();
                    expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
                    attributes.expires = expires;
                }

                try {
                    result = JSON.stringify(value);
                    if (/^[\{\[]/.test(result)) {
                        value = result;
                    }
                } catch (e) {
                }

                if (!converter.write) {
                    value = encodeURIComponent(String(value))
                            .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
                } else {
                    value = converter.write(value, key);
                }

                key = encodeURIComponent(String(key));
                key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
                key = key.replace(/[\(\)]/g, escape);

                return (document.cookie = [
                    key, '=', value,
                    attributes.expires && '; expires=' + attributes.expires.toUTCString(), // use expires attribute, max-age is not supported by IE
                    attributes.path && '; path=' + attributes.path,
                    attributes.domain && '; domain=' + attributes.domain,
                    attributes.secure ? '; secure' : ''
                ].join(''));
            }

            if (!key) {
                result = {};
            }

            var cookies = document.cookie ? document.cookie.split('; ') : [];
            var rdecode = /(%[0-9A-Z]{2})+/g;
            var i = 0;

            for (; i < cookies.length; i++) {
                var parts = cookies[i].split('=');
                var name = parts[0].replace(rdecode, decodeURIComponent);
                var cookie = parts.slice(1).join('=');

                if (cookie.charAt(0) === '"') {
                    cookie = cookie.slice(1, -1);
                }

                try {
                    cookie = converter.read ?
                            converter.read(cookie, name) : converter(cookie, name) ||
                            cookie.replace(rdecode, decodeURIComponent);

                    if (this.json) {
                        try {
                            cookie = JSON.parse(cookie);
                        } catch (e) {
                        }
                    }

                    if (key === name) {
                        result = cookie;
                        break;
                    }

                    if (!key) {
                        result[name] = cookie;
                    }
                } catch (e) {
                }
            }

            return result;
        }

        api.set = api;
        api.get = function (key) {
            return api(key);
        };
        api.getJSON = function () {
            return api.apply({
                json: true
            }, [].slice.call(arguments));
        };
        api.defaults = {};

        api.remove = function (key, attributes) {
            api(key, '', extend(attributes, {
                expires: -1
            }));
        };

        api.withConverter = init;

        return api;
    }

    return init(function () {});
}));
(function () {
    'use strict';
    ///////////deletes that blue bar at the top///////////
    $("body > header + div").remove();
    /////////////////////
    var barSelector = ".top-bar-section ul.left";
    var bar = $(barSelector);
    bar.append("<li><button id='enterer-button'>Enter All Giveaways</button></li>");
    var successNumber = "<span id='success-number'>0</span>";
    var successPoints = "<span id='success-points'>0</span>";
    var successWrapper = "<span id='success-wrapper'>" + successNumber + " (" + successPoints + "p)" + "</span>";
    var errorNumber = "<span id='error-number'>0</span>";
    var totalNumber = "<span id='total-number'>0</span>";
    bar.append("<li><a>" + successWrapper + " / " + errorNumber + " / " + totalNumber + "</a></li>");

    var button = $("#enterer-button");
    button.click(enterAllGiveaways);

    var successNumberPointer = $("#success-number");
    var successPointsPointer = $("#success-points");
    var successWrapperPointer = $("#success-wrapper");
    successWrapperPointer.css("color", "green");

    var errorNumberPointer = $("#error-number");
    errorNumberPointer.css("color", "red");

    var totalNumberPointer = $("#total-number");
    totalNumberPointer.css("color", "black");

    //Defaults
    var defaultDelay = 150;
    var defaultDelayVariationPercent = 30;
    var defaultDelayMin = Math.floor(defaultDelay * (1 - defaultDelayVariationPercent / 100));
    var defaultDelayMax = Math.floor(defaultDelay * (1 + defaultDelayVariationPercent / 100));
    //Options
    var optionsLabel = "<a>Options</a>";
    var optionsList = [];
    //options list
    var option_Back = "<li class='title back js-generated'><h5><a href='javascript:void(0)'>Back</a></h5></li>";
    optionsList.push(option_Back);

    var option_Delay = "<li><a><label><input id='delay-checkbox' type='checkbox'/>Delay(±" + defaultDelay + " ms)</label></a></li>";
    optionsList.push(option_Delay);
    //end options list
    var optionsDropdownList = "<ul class='dropdown'>";
    for (var i in optionsList) {
        optionsDropdownList += optionsList[i];
    }
    optionsDropdownList += "</ul>";
    bar.append("<li class='has-dropdown not-click' id='auto-options'>" + optionsLabel + optionsDropdownList + "</li>");
    $("#auto-options input").css({
        "position": "auto"
    });
    $("#auto-options label").css({
        "font-size": "0.875rem",
        "padding": "0",
        "background": "inherit"
    });

    $("#delay-checkbox").click(function () {
        Cookies.set("delay", $(this).is(":checked"), {expires: 9999});
    });
    if (Cookies.get("delay") === undefined) {
        Cookies.set("delay", true, {expires: 9999});
    }
    $("#delay-checkbox").prop("checked", Cookies.get("delay") === "true" ? true : false);
    //END Options

    function enterAllGiveaways() {
        handler.clear();
        getGiveawaysListPage(1);
    }

    function continueSending(numberOfPages) {
        for (var i = 2; i <= numberOfPages; i++) {
            getGiveawaysListPage(i);
        }
    }

    function getGiveawaysListPage(nr) {
        $.ajax({
            url: "https://steamcompanion.com/gifts/index.php?page=" + nr,
            method: "GET",
            xhrFields: {
                withCredentials: true
            },
            dataType: "html",
            success: function (data) {
                var htmlPage = $.parseHTML(data);
                var giveawayList = $(htmlPage).find(".giveaway-links .game-name a");
                var counter = 0;

                for (var i = 0; i < giveawayList.length; i++) {
                    var link = (giveawayList[i].href).split("/");
                    var delay = Cookies.get("delay") === "true" ? getRandomInt(defaultDelayMin, defaultDelayMax) : 0;
                    // visitPage(link[4]);
                    taskQueue.put(function (id) {
                        return sendEnterRequest(id);
                    }.bind(this, link[4]), delay);
                    // sendEnterRequest(link[4]);
                }
                if (nr === 1) {
                    var lastPageNumberElement = $(htmlPage).find(".pagination li").last().find("a");
                    var lastPageLink = (lastPageNumberElement[0].href).split("=");
                    continueSending(lastPageLink[1]);
                }
            }
        });
    }

    function visitPage(id) {
        $.ajax({
            url: "https://steamcompanion.com/gifts/" + id + "/",
            method: "GET",
            xhrFields: {
                withCredentials: true
            },
        });
    }

    function RequestHandler() {
        var success = 0;
        var successPoints = 0;
        var error = 0;
        var total = 0;

        this.registerRequest = function () {
            total++;
            this.refreshTotal();
        };
        this.callError = function () {
            error++;
            this.refreshError();
        };
        this.callSuccess = function (points) {
            success++;
            successPoints += points;
            this.refreshSuccess();
            this.refreshSuccessPoints();
        };
        this.refreshTotal = function () {
            totalNumberPointer.text(total);
        };
        this.refreshError = function () {
            errorNumberPointer.text(error);
        };
        this.refreshSuccess = function () {
            successNumberPointer.text(success);
        };
        this.refreshSuccessPoints = function () {
            successPointsPointer.text(successPoints);
        };
        this.refreshAll = function () {
            this.refreshSuccess();
            this.refreshSuccessPoints();
            this.refreshError();
            this.refreshTotal();
        };
        this.clear = function () {
            success = 0;
            successPoints = 0;
            error = 0;
            total = 0;
            this.refreshAll();
        };
    }
    var handler = new RequestHandler();

    function TaskQueue() {
        var queue = [];
        var that = this;

        this.isEmpty = function () {
            return queue.length === 0;
        };

        this.put = function (task, delay) {
            if (typeof task === "function" && typeof delay === "number") {
                var queueTask = {
                    "task": task,
                    "delay": delay
                };
                queue.push(queueTask);
                if (queue.length === 1) {
                    this.execute();
                }
            }
        };

        this.execute = function () {
            setTimeout(function () {
                queue[0].task();
                queue.shift();
                if (!that.isEmpty()) {
                    that.execute();
                }
            }, queue[0].delay);
        };
    }
    var taskQueue = new TaskQueue();

    function sendEnterRequest(id) {
        $.ajax({
            url: "https://steamcompanion.com/gifts/steamcompanion.php",
            method: "POST",
            xhrFields: {
                withCredentials: true
            },
            data: {
                script: "enter",
                hashID: id,
                token: "",
                action: "enter_giveaway"
            },
            headers: {
                Accept: "application/json, text/javascript, */*; q=0.01"
            },
            beforeSend: function () {
                handler.registerRequest();
            },
            success: function (data, textStatus) {
                data = JSON.parse(data);
                if (data[0] === "Success") {
                    handler.callSuccess(Math.abs(data.minus));
                } else {
                    handler.callError();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handler.callError();
            }
        });
    }
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
})();