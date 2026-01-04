// ==UserScript==
// @name         百度网盘视频倍速播放-滑动条版
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  视频内外部添加可拖动的调节视频倍速的滑动条（初始化倍速：max：2.0，min：0.5，step：0.05，val：1.0）。视频音量条设置为竖直方向（初始化音量：vol：20%）。  //\\//\\  脚本412-416行，用户可进行对倍速（max,min,step,val）、音量(vol)的初始化设置。  //\\//\\  支持各种快捷键调节视频，脚本299-349行可进行快捷键键位修改。 //\\//\\  在当前网页切换视频时，保持用户设置的音量和倍速。
// @author       fajiao
// @match        *://pan.baidu.com/play/video*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388239/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE-%E6%BB%91%E5%8A%A8%E6%9D%A1%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/388239/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE-%E6%BB%91%E5%8A%A8%E6%9D%A1%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var DocUtil = {
        insertAfter: function (targetElm, newElm) {
            if (targetElm && newElm) {
                let parent = targetElm.parentNode;
                if (parent.lastChild == targetElm) {
                    parent.appendChild(newElm);
                } else {
                    parent.insertBefore(newElm, targetElm.nextSibling)
                }
            }
        },
        addEventListener: function (obj, event, func) {
            if (obj && (typeof obj == "object") && (typeof event == "string") && (typeof func == "function")) {
                obj.addEventListener(event, func);
            }
        },
        removeEventListener: function (obj, event, func) {
            if (obj && (typeof obj == "object") && (typeof event == "string") && (typeof func == "function")) {
                obj.removeEventListener(event, func);
            }
        },
        addStyleRule(style, rule, index) {
            if (style) {
                let sheet = style.sheet || style.styleSheet || {};
                index = index || sheet.cssRules.length || 0;
                if (sheet.insertRule) {
                    sheet.insertRule(rule, index);
                } else if (sheet.addRule) {
                    // sheet.addRule(selectorText, cssText, index);
                }
            }
        },
        addStyleRules(style, rules) {
            if (style && typeof style == "object" && "innerText" in style) {
                style.innerText += rules;
            }
        },
        log() {
            console.log(arguments);
        }
    };

    function SpeedComponentUtil(config) {
        var _config = {};
        var _component = {};
        var _style = {};

        init(config);

        function init(config) {
            initConfig(config);
            initOuterComponent();
            initInnerComponent();
        }

        function initConfig(config) {
            config = config || {};
            _config.max = config.max || 2.0;
            _config.min = config.min || 0.5;
            _config.step = config.step || 0.05;
            _config.val = config.val || 1.0;
            _config.vol = config.vol || 0.2;
        }

        function initOuterComponent() {
            let outerSpeedDiv = document.createElement("div");
            let outerLayerDiv = document.createElement("div");
            let outerSpeedSlider = document.createElement("input");
            let outerSpeedTip = document.createElement("span");

            outerSpeedDiv.id = "outerSpeedDiv";
            outerLayerDiv.id = "outerLayerDiv";

            outerSpeedSlider.type = "range";
            outerSpeedSlider.max = _config.max;
            outerSpeedSlider.min = _config.min;
            outerSpeedSlider.step = _config.step;
            outerSpeedSlider.value = _config.val;
            outerSpeedTip.innerText = `×${_config.val.toFixed(2)}`;

            outerSpeedDiv.appendChild(outerLayerDiv);
            outerLayerDiv.appendChild(outerSpeedSlider);
            outerLayerDiv.appendChild(outerSpeedTip);

            _component.outerSpeedDiv = outerSpeedDiv;
            _component.outerLayerDiv = outerLayerDiv;
            _component.outerSpeedSlider = outerSpeedSlider;
            _component.outerSpeedTip = outerSpeedTip;
            initOuterComponentStyle();
        }

        function initInnerComponent() {
            let innerSpeedDiv = document.createElement("div");
            let innerLayerSliderDiv = document.createElement("div");
            let innerSpeedSlider = document.createElement("input");
            let innerLayerTipDiv = document.createElement("div");
            let innerSpeedTip = document.createElement("span");

            innerSpeedDiv.id = "innerSpeedDiv";
            innerLayerTipDiv.id = "innerLayerTipDiv";
            innerLayerSliderDiv.id = "innerLayerSliderDiv";

            innerSpeedSlider.type = "range";
            innerSpeedSlider.max = _config.max;
            innerSpeedSlider.min = _config.min;
            innerSpeedSlider.step = _config.step;
            innerSpeedSlider.value = _config.val;
            innerSpeedTip.innerText = `×${_config.val.toFixed(2)}`;

            innerSpeedDiv.appendChild(innerLayerTipDiv);
            innerLayerTipDiv.appendChild(innerSpeedTip);
            innerSpeedDiv.appendChild(innerLayerSliderDiv);
            innerLayerSliderDiv.appendChild(innerSpeedSlider);

            _component.innerSpeedDiv = innerSpeedDiv;
            _component.innerLayerSliderDiv = innerLayerSliderDiv;
            _component.innerSpeedSlider = innerSpeedSlider;
            _component.innerLayerTipDiv = innerLayerTipDiv;
            _component.innerSpeedTip = innerSpeedTip;
            initInnerComponentStyle();
        }

        function initOuterComponentStyle() {
            let style = _style.outerSpeedComponentStyle || document.getElementById("outerSpeedComponentStyle") || (function () {
                let style = document.createElement('style');
                style.type = 'text/css';
                style.id = "outerSpeedComponentStyle";
                _component.outerSpeedDiv.appendChild(style);
                _style.outerSpeedComponentStyle = style;
                return style;
            })();

            DocUtil.addStyleRules(style, `
            #outerSpeedDiv{width:155px;height:auto;margin:0 0 0 30px;display:inline-block}
            #outerLayerDiv{width:140px;height:35px;text-align:left;display:table-cell;vertical-align:middle;padding-left:10px;padding-right:10px}
            #outerLayerDiv span{font-size:16px;font-weight:bold;color:black}
            #outerLayerDiv input[type=range]{-webkit-appearance:none;width:100px;height:10px;background:transparent;transform:translateY(-2px);outline:0}
            #outerLayerDiv input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#fafbf2;border:2.5px solid black;margin-top:-6px;cursor:pointer}
            #outerLayerDiv input[type=range]::-webkit-slider-runnable-track{width:100%;height:5px;border-radius:5px;background:#48abee;cursor:pointer}
            #outerLayerDiv input[type=range]::-moz-range-thumb{width:15px;height:15px;border-radius:50%;background:#fafbf2;border:2.5px solid black;cursor:pointer}
            #outerLayerDiv input[type=range]::-moz-range-track{width:100%;height:5px;border-radius:5px;background:#2497e3;cursor:pointer}
            #outerSpeedDiv .noWork{background:#c5c4c9;pointer-events:none}
            `);
        }

        function initInnerComponentStyle() {
            let style = _style.innerSpeedComponentStyle || document.getElementById("innerSpeedComponentStyle") || (function () {
                let style = document.createElement('style');
                style.type = 'text/css';
                style.id = "innerSpeedComponentStyle";
                _component.innerSpeedDiv.appendChild(style);
                _style.innerSpeedComponentStyle = style;
                return style;
            })();

            DocUtil.addStyleRules(style, `
            #innerSpeedDiv{width:50px;height:auto}
            #innerLayerTipDiv{width:100%;height:36px;background:transparent}
            #innerLayerTipDiv span{width:100%;height:100%;font-size:16px;font-weight:bold;color:white;text-align:center;display:inline-block;line-height:36px}
            #innerLayerSliderDiv{width:auto;height:50px;background:rgba(43,51,63,.7);display:table-cell;vertical-align:middle;transform-origin:left top;transform:translateY(-36px) rotate(-90deg)}
            #innerLayerSliderDiv input[type=range]{-webkit-appearance:none;width:100px;height:10px;background:transparent;outline:0}
            #innerLayerSliderDiv input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#fafbf2;transform:translateY(-6px);border:2.5px solid black;cursor:pointer}
            #innerLayerSliderDiv input[type=range]::-webkit-slider-runnable-track{width:100%;height:5px;border-radius:5px;background:#48abee;cursor:pointer}
            #innerLayerSliderDiv input[type=range]::-moz-range-thumb{width:15px;height:15px;border-radius:50%;background:#fafbf2;border:2.5px solid black;cursor:pointer}
            #innerLayerSliderDiv input[type=range]::-moz-range-track{width:100%;height:5px;border-radius:5px;background:#2497e3;cursor:pointer}
            #innerSpeedDiv .noWork{display:none}
            `);
        }

        this.getComponent = function (componentStr) {
            return componentStr ? _component[componentStr] : _component;
        }
    }

    function SpeedUtil(config) {
        var _config = {};
        var _scUtil = null;
        var _cmpnt = null;
        var _state = null;
        var _priorId = null;
        var _h5player = null;

        init(config);

        function init(config) {
            initConfig(config);
            initParameter();
            initOuterComponentPosition();
            startLoadState();
            findH5player((_priorId = new Date().getTime()), 1);
            initListener();
        }

        function initConfig(config) {
            config = config || {};
            _config.max = config.max || 2.0;
            _config.min = config.min || 0.5;
            _config.step = config.step || 0.05;
            _config.val = config.val || 1.0;
            _config.vol = config.vol || 0.2;
        }

        function initParameter() {
            _scUtil = new SpeedComponentUtil(_config);
            _cmpnt = _scUtil.getComponent();
        }

        function initOuterComponentPosition() {
            let toolbar = document.querySelector(".video-toolbar-buttonbox");
            DocUtil.insertAfter(toolbar.lastChild, _cmpnt.outerSpeedDiv);
        }

        function initInnerComponentPosition(volbtn) {
            DocUtil.insertAfter(volbtn, _cmpnt.innerSpeedDiv);
        }

        function findH5player(curId, num) {
            if (curId != _priorId) {
                // console.log("abort", curId, num, new Date().getTime());
                return;
            }
            if (num >= 45) {
                // console.log("timeout", curId, num, new Date().getTime());
                return;
            }
            let player = getH5player();
            if (player) {
                // console.log("success", curId, num, new Date().getTime());
                stopLoadState(player);
            } else {
                // console.log("failure", curId, num, new Date().getTime());
                setTimeout(function () {
                    findH5player(curId, ++num);
                }, 1000);
            }
        }

        function initListener() {
            DocUtil.addEventListener(_cmpnt.outerSpeedSlider, "input", function () {
                // console.log("outer", "input", _cmpnt.outerSpeedSlider.value);
                let player = _h5player || getH5player();
                if (player) {
                    player.tech_.setPlaybackRate(_cmpnt.outerSpeedSlider.value);
                }
            });

            DocUtil.addEventListener(_cmpnt.innerSpeedSlider, "input", function () {
                // console.log("inner", "input", _cmpnt.innerSpeedSlider.value);
                let player = _h5player || getH5player();
                if (player) {
                    player.tech_.setPlaybackRate(_cmpnt.innerSpeedSlider.value);
                }
            });

            DocUtil.addEventListener(_cmpnt.innerLayerTipDiv, "mouseover", function () {
                _cmpnt.innerLayerSliderDiv.classList.remove("noWork");
            });
            DocUtil.addEventListener(_cmpnt.innerLayerTipDiv, "mouseout", function () {
                _cmpnt.innerLayerSliderDiv.classList.add("noWork");
            });
            DocUtil.addEventListener(_cmpnt.innerLayerSliderDiv, "mouseover", function () {
                _cmpnt.innerLayerSliderDiv.classList.remove("noWork");
            });
            DocUtil.addEventListener(_cmpnt.innerLayerSliderDiv, "mouseout", function () {
                _cmpnt.innerLayerSliderDiv.classList.add("noWork");
            });

            DocUtil.addEventListener(window, "popstate", function () {
                let curId = new Date().getTime();
                _priorId = curId;
                startLoadState();
                setTimeout(function () {
                    findH5player(curId, 1)
                }, 3000);
            });

            DocUtil.addEventListener(document, "keypress", function (e) {
                let player = _h5player || getH5player();
                let curPlayElm = document.querySelector(".currentplay") || {};
                if (_state == "stopLoad") {
                    if (player) {
                        let speed = _config.val;
                        let step = _config.step;
                        let max = _config.max;
                        let min = _config.min;
                        switch (e.key) {
                            case "c":
                                //加速
                                player.tech_.setPlaybackRate((((speed + step)) < max ? (speed + step) : max));
                                break;
                            case "x":
                                //还原
                                player.tech_.setPlaybackRate(1);
                                break;
                            case "z":
                                //减速
                                player.tech_.setPlaybackRate((((speed - step) > min) ? (speed - step) : min));
                                break;
                            case "f":
                                //全屏
                                player.controlBar.fullscreenToggle.el_.click();
                                break;
                            case "m":
                                //画中画
                                if (document.pictureInPictureEnabled) {
                                    if (!document.pictureInPictureElement) {
                                        player.tech_.el_.requestPictureInPicture();
                                    } else {
                                        document.exitPictureInPicture();
                                    }
                                }
                                break;
                        }
                    }
                }
                switch (e.key) {
                    case "d":
                        //开关灯
                        document.querySelector(".video-functions-last").click();
                        break;
                    case "b":
                        //前一个视频
                        if (curPlayElm.previousSibling) {
                            curPlayElm.previousSibling.firstChild.click();
                        }
                        break;
                    case "n":
                        //后一个视频
                        if (curPlayElm.nextSibling) {
                            curPlayElm.nextSibling.firstChild.click();
                        }
                        break;
                    case "h":
                        window.alert("快捷键提醒：\nz：减速，x：还原，c：加速\nd：开关灯，f：全屏\nb：前一个视频，n：后一个视频，m：画中画\nh：帮助\n脚本299-349行可进行快捷键键位修改");
                        break;
                }
            });
        }

        function startLoadState() {
            _state = "startLoad";
            // console.log("load start",new Date().getTime());
            _cmpnt.outerLayerDiv.classList.add("noWork");
            _cmpnt.innerLayerSliderDiv.classList.add("noWork");
            _h5player = null;
        }

        function stopLoadState(player) {
            _state = "stopLoad";
            // console.log("load stop",new Date().getTime());

            let bar = player.controlBar;
            bar.removeChild("volumeMenuButton");
            let volbtn = (bar.addChild("volumeMenuButton", {
                inline: false
            }, 1)).el_;
            initInnerComponentPosition(volbtn);

            _cmpnt.outerLayerDiv.classList.remove("noWork");
            _h5player = player;

            DocUtil.addEventListener(player.tech_.el_, "ratechange", function () {
                let player = _h5player || getH5player();
                if (player) {
                    let speedStr = player.tech_.playbackRate().toFixed(2);
                    let speedNum = parseFloat(speedStr);
                    // console.log("ratechange", speed, new Date().getTime());
                    _config.val = speedNum;
                    _cmpnt.outerSpeedSlider.value = speedNum;
                    _cmpnt.outerSpeedTip.innerText = `×${speedStr}`;
                    _cmpnt.innerSpeedSlider.value = speedNum;
                    _cmpnt.innerSpeedTip.innerText = `×${speedStr}`;
                }
            });
            DocUtil.addEventListener(player.tech_.el_, "volumechange", function () {
                let player = _h5player || getH5player();
                if (player) {
                    let vol = parseFloat(player.tech_.volume().toFixed(2));
                    // console.log("volumechange", vol, new Date().getTime());
                    _config.vol = vol;
                }
            });
            player.tech_.el_.oncanplay = function () {
                let speed = parseFloat(_config.val.toFixed(2));
                let vol = _config.vol;
                player.tech_.setPlaybackRate(speed);
                player.tech_.setVolume(vol);
                player.tech_.el_.oncanplay = null;
            }
        }

        function getH5player() {
            return window.videojs ? window.videojs.getPlayers().html5player : null;
        }
    }

    DocUtil.addEventListener(window, "load", function () {
        new SpeedUtil({
            max: 2.0, //最大倍速值
            min: 0.5, //最小倍速值
            step: 0.05, //步进值
            val: 1.0, //初始倍速值
            vol: 0.23, //初始音量值
        });
    });
})();