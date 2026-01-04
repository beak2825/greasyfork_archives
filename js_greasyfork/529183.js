// ==UserScript==
// @name         HuNanDemo-yidishanghui-Script
// @namespace    http://tampermonkey.net/
// @version      v0.0.1
// @description  HuNanDemo-yidishanghu tools
// @author       Hunter
// @match        *://e.jssh.org.cn/big-screen/*
// @match        *://test.qikangkang.com/big-screen/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jssh.org.cn
// @license AGPL
// @downloadURL https://update.greasyfork.org/scripts/529183/HuNanDemo-yidishanghui-Script.user.js
// @updateURL https://update.greasyfork.org/scripts/529183/HuNanDemo-yidishanghui-Script.meta.js
// ==/UserScript==
// @run-at       document-start
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @grant        unsafeWindow

(function() {
    'use strict';
    window.onload=function(){
        init2YunNan()
    }
    // url变化监听器
    setInterval(function() {
        init2YunNan()
    }, 100)

    const originOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (_, url) {
        const currentURL = window.location.href
        console.log("hello world", currentURL);
        if (url.includes("big-screen/coc/org/switch?adcode=") && currentURL.includes('M41')) {
            this.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    Object.defineProperty(this, "responseText", {
                        writable: true,
                    });
                    this.responseText = {
                        "code": 200,
                        "success": false,
                        "data": [
                            {
                                "id": "",
                                "name": "异地商会总数",
                                "value": 360
                            }
                        ],
                        "msg": "",
                        "title": "",
                        "map": {}
                    };
                    if (url.includes('1494598404125290497')) {
                        this.responseText.data[0].value=29
                    }
                }
            });
        }
        if (url.includes("big-screen/coc/org/left-map-total?adcode=") && currentURL.includes('M41')) {
            this.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    Object.defineProperty(this, "responseText", {
                        writable: true,
                    });
                    this.responseText = {
                        "code": 200,
                        "success": false,
                        "data": {
                            "name": "商会组织",
                            "value": 360,
                            "unit": "个"
                        },
                        "msg": "",
                        "title": "",
                        "map": {}
                    };
                    if (url.includes('1494598404125290497')) {
                        this.responseText.data.value=29
                    }
                }
            });
        }
        if ((url.includes("big-screen/coc/org/map") || url.includes("big-screen/coc/org/municipal/column-chart")) && currentURL.includes('M41')) {
            this.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    Object.defineProperty(this, "responseText", {
                        writable: true,
                    });
                    this.responseText = {
                        "code": 200,
                        "success": false,
                        "data": [
                            {
                                "name": "南京市",
                                "value": 27,
                                "adcode": "1494598399654162433"
                            },
                            {
                                "name": "无锡市",
                                "value": 16,
                                "adcode": "1494598402460151809"
                            },
                            {
                                "name": "徐州市",
                                "value": 29,
                                "adcode": "1494598404125290497"
                            },
                            {
                                "name": "常州市",
                                "value": 8,
                                "adcode": "1494598406180499457"
                            },
                            {
                                "name": "苏州市",
                                "value": 31,
                                "adcode": "1494598401143140353"
                            },
                            {
                                "name": "南通市",
                                "value": 29,
                                "adcode": "1494598401843589122"
                            },
                            {
                                "name": "连云港市",
                                "value": 7,
                                "adcode": "1494598400551743490"
                            },
                            {
                                "name": "淮安市",
                                "value": 6,
                                "adcode": "1494598403550670849"
                            },
                            {
                                "name": "盐城市",
                                "value": 11,
                                "adcode": "1494598405236781058"
                            },
                            {
                                "name": "扬州市",
                                "value": 8,
                                "adcode": "1494598406746730497"
                            },
                            {
                                "name": "镇江市",
                                "value": 2,
                                "adcode": "1494598403001217025"
                            },
                            {
                                "name": "泰州市",
                                "value": 12,
                                "adcode": "1494598404808962049"
                            },
                            {
                                "name": "宿迁市",
                                "value": 6,
                                "adcode": "1494598405794623490"
                            }
                        ],
                        "msg": "",
                        "title": "",
                        "map": {}
                    };
                    if (url.includes('1494598404125290497')) {
                        this.responseText.data = [
                            {
                                "name": "丰县",
                                "value": 4,
                                "adcode": "1494598404335005697"
                            },
                            {
                                "name": "沛县",
                                "value": 5,
                                "adcode": "1494598404393725953"
                            },
                            {
                                "name": "睢宁县",
                                "value": 8,
                                "adcode": "1494598404435668993"
                            },
                            {
                                "name": "邳州市",
                                "value": 0,
                                "adcode": "1494598404557303810"
                            },
                            {
                                "name": "新沂市",
                                "value": 0,
                                "adcode": "1494598404506972161"
                            },
                            {
                                "name": "铜山区",
                                "value": 0,
                                "adcode": "1494598404284674049"
                            },
                            {
                                "name": "贾汪区",
                                "value": 0,
                                "adcode": "1494598404687327233"
                            },
                            {
                                "name": "鼓楼区",
                                "value": 0,
                                "adcode": "1494598404641189890"
                            },
                            {
                                "name": "云龙区",
                                "value": 0,
                                "adcode": "1494598404599246849"
                            },
                            {
                                "name": "泉山区",
                                "value": 0,
                                "adcode": "1494598404213370882"
                            },
                            {
                                "name": "徐州经济技术开发区",
                                "value": 0,
                                "adcode": "1494598404758630401"
                            }
                        ]
                    }
                }
            });
        }

        originOpen.apply(this, arguments);
    };

    function init2YunNan() {
        const currentURL = window.location.href
        //console.log("hello world", currentURL);
        if (!currentURL.includes('M41')) {
            return false;
        }

        document.querySelectorAll('.tab')[0].addEventListener('click', (event) => {
            // 阻止默认的点击行为（如果有的话）
            event.preventDefault();

            window.open('https://e.jssh.org.cn/model/#/subapp/coc-ai/list?mid=1498114715193561090&title=2', '_blank');
        });

    }


})();