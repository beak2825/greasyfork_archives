// ==UserScript==
// @name         New_debug
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://global-oss.zmqdez.com/front_end*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408938/New_debug.user.js
// @updateURL https://update.greasyfork.org/scripts/408938/New_debug.meta.js
// ==/UserScript==

(function () {
    /**
 * 要做4件事：
 * 1.提取页面上的信息；
 * 2.匹配提醒条件 ---返回对应配置信息
 * 3.获取配置信息作为参数，实现对应功能；
 */

    /**
     * 一、获取页面上的信息
     * 1.业务信息(app信息，业务类型信息)
     * 写一个功能：判断当前业务信息，返回值：业务名
     * 2.app——业务——业务信息：
     *     bigoLive(app元素节点)—|————新直播初审(url)----国家码、uid、等级、签约信息、钻石数、金豆数、页面背景、按钮信息
     *                                             |----
     *                          |————新直播终审(url)----国家码、uid、等级、签约信息、钻石数、金豆数、页面背景、按钮信息
     *                          |————重推初审(url)  ----国家码、uid、等级、签约信息、钻石数、金豆数、页面背景、按钮信息
     *                          |————重推终审(url) ----国家码、uid、等级、签约信息、钻石数、金豆数、页面背景、按钮信息
     *                          |————图片(url)     ----没想好
     *                          |————贴吧(url)     ----国家码、uid、等级、签约ixni、钻石数、金豆数、页面背景、按钮信息
     *
     */

    var Init = {
        "BigoFirstAudit": {
            "app": "bigoLive",
            "href": "https://global-oss.zmqdez.com/front_end/index.html#/live/first-review",
            "nodeMessages": { "countryNode": ".ant-row>div:nth-child(1)>p", "uidNode": ".user-detail-wrapper>p", "leverNode": ".ant-row>div:nth-child(2)>p", "officialNode": ".offical", "diamondsNode": ".diamonds", "goldBeensNode": ".goldBeens", "backgroundColorNode": "#body", "btnNode": ".btn" },
            "messages": { country: null, uid: null, lever: null, offical: "no", diamonds: 0, goldBeen: 0, backgroundColor: "", btn: null },
            "rules": {
                strict: [
                    ";AE;SA;KW;LB;IQ;PS;JO;YE;OM;SY;QA;BH;EG;SD;LY;TN;DZ;MA;SO;IR;IL;MR;DJ;KM;PK;BD;",
                    "<strong>《严格版》<strong/><br/><span>1、PK&BD规则尺度与中东对齐<span/><br/>",
                    "width:700px;height:85px;position:absolute;top:50px;left:550px;background-color:red;color:white;border-radius:25px;font-size:15px;text-align: center;display:block;"
                ],
                minor_strict: [
                    ";IN;TR;CN;TW;HK;MO;SG;AU;NZ;MY;BN;",
                    "<strong>《偏严版》<strong/><br/><span>1、PK&BD规则尺度与中东对齐<span/><br/>",
                    "width:700px;height:85px;position:absolute;top:50px;left:550px;background-color:yellow;color:black;border-radius:25px;font-size:15px;text-align: center;display:block;"
                ],
                standard: [
                    ";FR;DE;IT;PL;ZA;BE;NL;SE;AT;RO;CH;SK;RU;UA;BY;GE;AM;AZ;TJ;TM;KG;UZ;KZ;BR;MX;AR;CO;BO;CL;CR;DO;EC;SV;GT;HN;NI;PA;PY;PE;ES;UY;VE;PR;US;GB;CA;ID;PH;TH;VN;KH;MM;NP;AF;CY;KP;LK;MN;MV;BT;TL;AD;AL;AT;BE;BG;CH;CZ;DK;EE;FI;GR;HU;IE;IS;LA;LI;LT;;LU;LV;MC;MD;MT;NL;NO;AS;KY;MQ;VC;BM;CW;VG;AO;BF;BI;BJ;BW;CD;CF;CG;CM;ET;GA;GH;GM;GN;KE;LR;LS;MG;ML;MU;MW;MZ;NA;NE;SC;SZ;TD;TG;TZ;UG;ZM;ZW;CI;FM;NG;SS;RW;CV;GW;RE;ST;ER;XK;CK;FJ;GU;NR;PG;SB;TO;CX;MH;MP;NC;PF;PW;TK;KI;NU;WS;VU;GQ;PT;RO;RS;JM;",
                    "<strong>《标准版》<strong/><br/><span>标准版注意事项<span/><br/>",
                    "width:700px;height:85px;position:absolute;top:50px;left:550px;background-color:lightgreen;color:black;border-radius:25px;font-size:15px;text-align: center;display:block;"
                ],
                JR_AND_KR: [
                    ";JP;KR",
                    "<strong>《标准版》<strong/><br/><span>标准版注意事项<span/><br/>",
                    "width:700px;height:85px;position:absolute;top:50px;left:550px;background-color:pink;color:#800080;border-radius:25px;font-size:15px;text-align: center;display:block;"
                ]
            },
            "userTypeCofig": {
                cash: [
                    ";12345678;",
                    "终极氪金用户，请勿封禁",
                    "width:300px;height:85px;position:absolute;left:550px;top:200px;background-color:orange;color:white;font-weight:boder;"]
            },
            "functions": {
                ruleTips: function () {
                    var settings = ["", ""];
                    var ruleNode;
                    try {
                        Init.BigoFirstAudit.messages.country = document.querySelector(Init.BigoFirstAudit.nodeMessages.countryNode).innerText.slice(3, 5);
                        for (let key in Init.BigoFirstAudit.rules) {
                            if (Init.BigoFirstAudit.rules[key][0].includes(Init.BigoFirstAudit.messages.country)) {
                                settings[0] = Init.BigoFirstAudit.rules[key][1];
                                settings[1] = Init.BigoFirstAudit.rules[key][2];
                            }

                        }
                    } catch (error) { }

                    if (document.querySelector("#rule")) {
                        ruleNode = document.querySelector("#rule");
                        ruleNode.innerHTML = settings[0];
                        ruleNode.style.cssText = settings[1];
                    } else {

                        ruleNode = document.createElement("div");
                        ruleNode.id = "rule";
                        ruleNode.innerHTML = settings[0];
                        ruleNode.style.cssText = settings[1];
                        document.body.appendChild(ruleNode);
                    }
                    return 0;

                },
            }
        },

        "BigoFinalAudit": {
            "app": "bigoLive",
            "href": "https://global-oss.zmqdez.com/front_end/index.html#/live/final-review",
            "nodeMessages": { "countryNode": ".final-user-detail-wrapper>p:nth-child(6)", "uidNode": "null", "leverNode": "null", "officialNode": "null", "diamondsNode": "null", "goldBeensNode": "null", "backgroundColorNode": "#body", "btnNode": ".btn" },
            "messages": { country: null, uid: null, lever: null, offical: "no", diamonds: 0, goldBeen: 0, backgroundColor: "", btn: null },
            "rules": {
                strict: [
                    ";AE;SA;KW;LB;IQ;PS;JO;YE;OM;SY;QA;BH;EG;SD;LY;TN;DZ;MA;SO;IR;IL;MR;DJ;KM;PK;BD;",
                    "<strong>《严格版》<strong/><br/><span>1、PK&BD规则尺度与中东对齐<span/><br/>",
                    "width:700px;height:85px;position:absolute;top:50px;left:550px;background-color:red;color:white;border-radius:25px;font-size:15px;text-align: center;display:block;"
                ],
                minor_strict: [
                    ";IN;TR;CN;TW;HK;MO;SG;AU;NZ;MY;BN;",
                    "<strong>《偏严版》<strong/><br/><span>1、PK&BD规则尺度与中东对齐<span/><br/>",
                    "width:700px;height:85px;position:absolute;top:50px;left:550px;background-color:yellow;color:black;border-radius:25px;font-size:15px;text-align: center;display:block;"
                ],
                standard: [
                    ";FR;DE;IT;PL;ZA;BE;NL;SE;AT;RO;CH;SK;RU;UA;BY;GE;AM;AZ;TJ;TM;KG;UZ;KZ;BR;MX;AR;CO;BO;CL;CR;DO;EC;SV;GT;HN;NI;PA;PY;PE;ES;UY;VE;PR;US;GB;CA;ID;PH;TH;VN;KH;MM;NP;AF;CY;KP;LK;MN;MV;BT;TL;AD;AL;AT;BE;BG;CH;CZ;DK;EE;FI;GR;HU;IE;IS;LA;LI;LT;;LU;LV;MC;MD;MT;NL;NO;AS;KY;MQ;VC;BM;CW;VG;AO;BF;BI;BJ;BW;CD;CF;CG;CM;ET;GA;GH;GM;GN;KE;LR;LS;MG;ML;MU;MW;MZ;NA;NE;SC;SZ;TD;TG;TZ;UG;ZM;ZW;CI;FM;NG;SS;RW;CV;GW;RE;ST;ER;XK;CK;FJ;GU;NR;PG;SB;TO;CX;MH;MP;NC;PF;PW;TK;KI;NU;WS;VU;GQ;PT;RO;RS;JM;",
                    "<strong>《标准版》<strong/><br/><span>标准版注意事项<span/><br/>",
                    "width:700px;height:85px;position:absolute;top:50px;left:550px;background-color:lightgreen;color:black;border-radius:25px;font-size:15px;text-align: center;display:block;"
                ],
                JR_AND_KR: [
                    ";JP;KR",
                    "<strong>《标准版》<strong/><br/><span>标准版注意事项<span/><br/>",
                    "width:700px;height:85px;position:absolute;top:50px;left:550px;background-color:pink;color:#800080;border-radius:25px;font-size:15px;text-align: center;display:block;"
                ]
            },
            "userTypeCofig": {
                cash: [
                    ";12345678;",
                    "终极氪金用户，请勿封禁",
                    "width:300px;height:85px;position:absolute;left:550px;top:200px;background-color:orange;color:white;font-weight:boder;"]
            },
            "functions": {
                ruleTips: function () {
                    var settings = ["", ""];
                    var ruleNode;
                    try {
                        Init.BigoFinalAudit.messages.country = document.querySelector(Init.BigoFinalAudit.nodeMessages.countryNode).innerText.slice(3, 5);
                        for (let key in Init.BigoFinalAudit.rules) {
                            if (Init.BigoFinalAudit.rules[key][0].includes(Init.BigoFinalAudit.messages.country)) {
                                settings[0] = Init.BigoFinalAudit.rules[key][1];
                                settings[1] = Init.BigoFinalAudit.rules[key][2];
                            }

                        }
                    } catch (error) { }

                    if (document.querySelector("#rule")) {
                        ruleNode = document.querySelector("#rule");
                        ruleNode.innerHTML = settings[0];
                        ruleNode.style.cssText = settings[1];
                    } else {

                        ruleNode = document.createElement("div");
                        ruleNode.id = "rule";
                        ruleNode.innerHTML = settings[0];
                        ruleNode.style.cssText = settings[1];
                        document.body.appendChild(ruleNode);
                    }
                    return 0;

                },
            }
        },

        "BigoBar": {
            "app": "bigolive",
            "href": "https://global-oss.zmqdez.com/front_end/index.html#/audit/index",
            "nodeMessages": { "countryNode": "", "uidNode": ".profile-meta>p:nth-child(3)>a", "officialNode": "", "punishBtnsNode": ".operation-btns>button" },
            "messages": { country: null, uid: null, offical: "no" },
            "rules": {},
            "userTypeConfig": {
                "cash":
                    [
                        ";445238123;",
                        "<div style='font-size:20px'></div><span>该用户为币商，请勿封禁</span>",
                        "width:200px;height:35px;line-height:35px;position:absolute;top:300px;left:1000px;background-color: orange;font-size:15px;display:block;text-align: center;color:white;opacity: 0.8;border-radius:25px;"
                    ]
            },
            "functions": {
                secialUser: function () {
                    var uid = null;
                    var remark = "";
                    var style = "display:none";
                    var userNode;
                    var punishBtns;
                    var btnLen;

                    try {
                        uid = ";" + document.querySelector(Init.BigoBar.nodeMessages.uidNode).innerText + ";";
                        punishBtns = document.querySelectorAll(Init.BigoBar.nodeMessages.punishBtnsNode);
                        btnLen = punishBtns.length;
                        for (let key in Init.BigoBar.userTypeConfig) {
                            if (Init.BigoBar.userTypeConfig[key][0].includes(uid)) {
                                remark = Init.BigoBar.userTypeConfig[key][1];
                                style = Init.BigoBar.userTypeConfig[key][2];
                                for (let i = 1; i < btnLen; i++) {
                                    punishBtns[i].style.display = "none";
                                }
                            }
                        }
                        if (remark == "" && style == "display:none") {
                            for (let i = 1; i < btnLen; i++) {
                                punishBtns[i].style.display = "block";
                            }
                        }
                    } catch (error) {

                    }

                    try {
                        userNode = document.querySelector("#user")
                        userNode.innerHTML = remark;
                        userNode.style.cssText = style;
                    } catch (error) {
                        userNode = document.createElement("div");
                        userNode.id = "user";
                        userNode.innerHTML = remark;
                        userNode.style.cssText = style;
                        document.body.appendChild(userNode);
                    }

                }
            }
        },

        "BigoReFirstAudit":{
            "app":"bigoLive",
            "href":"https://global-oss.zmqdez.com/front_end/index.html#/tags/audit/live-repush-first",
            "nodeMessages":{"bgColorNode":".content-inner"},
            "functions":{
                bgColor:function(){
                    var bg;
                    bg = document.querySelector(Init.BigoReFirstAudit.nodeMessages.bgColorNode);
                    bg.style.backgroundColor = "lightblue";
                    return 0;
                }
            }
        }
    }


    function Tool(ObjConfig, href) {
        this.ObjConfig = ObjConfig;
        this.href = href;
        this.checkBussiness = function () {
            var bussiness = "";
            for (let key in this.ObjConfig) {
                if (this.href == this.ObjConfig[key].href) {
                    bussiness = key;
                    break;
                }
            }
            return bussiness;
        }

        this.runFunctions = function (bussiness) {
            for (let key in this.ObjConfig[bussiness].functions) {
                this.ObjConfig[bussiness].functions[key]();
            }
            return 0;
        }

        this.main = function () {
            var bussiness;
            bussiness = this.checkBussiness();
            this.runFunctions(bussiness);
        }
    }

    var timer;
    var href;
    var Run;
    timer = setInterval(function () {
        try {
            href = window.location.href;
            if (href) {
                Run = new Tool(Init, href);
                Run.main();
            }
        } catch (error) {

        }
    }, 200);

    // Your code here...
})();