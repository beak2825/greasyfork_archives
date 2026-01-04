// ==UserScript==
// @name         知乎想法抽奖工具
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  一个知乎想法抽奖工具，支持鼓掌、转发等
// @author       HuanCheng65
// @match        https://www.zhihu.com/pin/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_setClipboard
// @resource     mduiCss https://unpkg.zhimg.com/mdui@1.0.0/dist/css/mdui.min.css
// @downloadURL https://update.greasyfork.org/scripts/407704/%E7%9F%A5%E4%B9%8E%E6%83%B3%E6%B3%95%E6%8A%BD%E5%A5%96%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/407704/%E7%9F%A5%E4%B9%8E%E6%83%B3%E6%B3%95%E6%8A%BD%E5%A5%96%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const STATE_LOADING = 0;
    const STATE_READY = 1;
    const STATE_LOTTERY = 2;

    const MODE_LIKE = "0";
    const MODE_REPIN = "1";
    const MODE_LIKE_AND_REPIN = "2";
    const MODE_LIKE_OR_REPIN = "3";

    const RESULT_NOT_ENOUGH_PEOPLE = 0
    const RESULT_SUCCESS = 1

    const lottery = {
        id: location.pathname.split("/").pop(),
        repins: [],
        likes: [],
        result: {
            type: 0,
            text: "",
            users: []
        },
        _loadFailed_: false,
        _loadingText_: null,
        _state_: null,
        get loadingText() {
            return this._loadingText_;
        },
        set loadingText(val) {
            log(val);
            this._loadingText_ = val;
            updatePanel();
        },
        get state() {
            return this._state_;
        },
        set state(val) {
            this._state_ = val;
            updatePanel();
        },
        get loadFailed() {
            return this._loadFailed_;
        },
        set loadFailed(val) {
            this._loadFailed_ = val;
            updatePanel();
        }
    };

    var $;
    var fetchedAction = false;

    function getRandom(start, end, fixed = 0) {
        let differ = end - start
        let random = Math.random()
        return (start + differ * random).toFixed(fixed)
    }

    function dateFormat(fmt, date) {
        let ret;
        let opt = {
            "Y+": date.getFullYear().toString(), // 年
            "m+": (date.getMonth() + 1).toString(), // 月
            "d+": date.getDate().toString(), // 日
            "H+": date.getHours().toString(), // 时
            "M+": date.getMinutes().toString(), // 分
            "S+": date.getSeconds().toString(), // 秒
            // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        for (let k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(
                    ret[1],
                    ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
                );
            }
        }
        return fmt;
    }

    function requireScript(url, onload) {
        var script = document.createElement("script");
        script.src = url;
        if (typeof onload == "function") {
            script.onload = onload;
        }
        document.documentElement.appendChild(script);
    }

    function init() {
        $ = mdui.$;
        GM_addStyle(`
        #lottery {
            position: fixed;
            top: 32px;
            left: 32px;
            z-index: 999;
        }

        #lotteryPanel {
            display: none;
        }

        #lottery.showPanel #openLotteryBtn {
            display: none;
        }

        #lottery.showPanel #lotteryPanel {
            display: block;
        }

        #lotteryPanel .mdui-card-header-title,
        #lotteryPanel .mdui-card-header-subtitle {
            margin-left: 0px;
            margin-right: 48px;
        }

        .card-header-inner {
            float: left;
        }

        #closeLotteryBtn {
            float: right;
            position: relative;
            right: 0px;
        }

        #lotteryResultList {
            max-height: 500px;
            overflow: auto;
        }
        `);
        $(`
        <div id="lottery">
            <button class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-indigo" id="openLotteryBtn">抽奖</button>
            <div class="mdui-card" id="lotteryPanel">
                <div class="mdui-card-header">
                    <div class="card-header-inner">
                        <div class="mdui-card-header-title">知乎想法抽奖工具</div>
                        <div class="mdui-card-header-subtitle">by 幻了个城fly</div>
                    </div>
                    <button class="mdui-btn mdui-btn-icon mdui-ripple" id="closeLotteryBtn">×</button>
                </div>
                <div class="mdui-card-content">
                    <div id="loading">
                        <div id="loadingText" class="mdui-m-b-1"></div>
                        <div class="mdui-progress" id="loadingProgressBar">
                            <div class="mdui-progress-indeterminate"></div>
                        </div>
                        <button class="mdui-m-t-1 mdui-btn mdui-btn-raised mdui-ripple mdui-btn-block" id="failedReloadBtn">重新加载</button>
                    </div>
                    <div id="lotterySettings">
                        <span id="lotteryInfo"></span>
                        <form>
                            <div class="mdui-container-fluid">
                                <div class="mdui-row-xs-1">
                                    <div class="mdui-col mdui-textfield mdui-textfield-floating-label">
                                        <label class="mdui-textfield-label">抽奖人数</label>
                                        <input class="mdui-textfield-input" name="count" value="1" type="number" min="1"/>
                                    </div>
                                </div>
                                <div class="mdui-row-xs-2">
                                    <label class="mdui-radio mdui-col">
                                        <input type="radio" name="action" value="0" checked/>
                                        <i class="mdui-radio-icon"></i>
                                        鼓掌
                                    </label>
                                    <label class="mdui-radio mdui-col">
                                        <input type="radio" name="action" value="1"/>
                                        <i class="mdui-radio-icon"></i>
                                        转发
                                    </label>
                                    <label class="mdui-radio mdui-col">
                                        <input type="radio" name="action" value="2"/>
                                        <i class="mdui-radio-icon"></i>
                                        鼓掌并转发
                                    </label>
                                    <label class="mdui-radio mdui-col">
                                        <input type="radio" name="action" value="3"/>
                                        <i class="mdui-radio-icon"></i>
                                        鼓掌或转发
                                    </label>
                                </div>
                                <div class="mdui-row-xs-1">
                                    <label mdui-tooltip="{content: '受知乎限制，此处判断的是你当前登录的账号，而非想法发布者的账号', position: 'right'}" class="mdui-checkbox">
                                        <input type="checkbox" name="needFollow"/>
                                        <i class="mdui-checkbox-icon"></i>
                                        需关注本人
                                    </label>
                                </div>
                            </div>
                        </form>
                        <button class="mdui-m-t-1 mdui-btn mdui-btn-raised mdui-ripple mdui-btn-block" id="reloadBtn">重新加载</button>
                        <button class="mdui-m-t-1 mdui-btn mdui-btn-raised mdui-ripple mdui-color-indigo mdui-btn-block" id="startLotteryBtn">开始抽奖</button>
                    </div>
                    <div id="lotteryResult">
                        <div id="lotteryResultText"></div>
                        <div id="lotteryResultContent">
                            <div class="mdui-list" id="lotteryResultList"></div>
                            <button class="mdui-m-t-1 mdui-btn mdui-btn-raised mdui-ripple mdui-btn-block" id="copyResultBtn">复制结果</button>
                        </div>
                        <button class="mdui-m-t-1 mdui-btn mdui-btn-raised mdui-ripple mdui-color-indigo mdui-btn-block" id="restartLotteryBtn">再次抽奖</button>
                    </div>
                </div>
            </div>
        </div>
        `).appendTo(document.body);
        $("#openLotteryBtn").on("click", function () {
            $("#lottery").addClass("showPanel");
            fetchPinAction();
        });
        $("#closeLotteryBtn").on("click", function () {
            $("#lottery").removeClass("showPanel");
        });
        $("#startLotteryBtn").on("click", function () {
            startLottery();
        });
        $("#restartLotteryBtn").on("click", function () {
            fetchPinAction();
        });
        $("#reloadBtn").on("click", function () {
            fetchPinAction(true);
        });
        $("#failedReloadBtn").on("click", function () {
            fetchPinAction(true);
        });
        $("#copyResultBtn").on("click", function () {
            let clipboardText = "";
            lottery.result.users.forEach(element => {
                clipboardText += `@${element.name}\n`;
            });
            GM_setClipboard(clipboardText, "text");
        });
        mdui.mutation();
    }

    function fetchPinAction(force = false) {
        if (fetchedAction && !force) {
            lottery.state = STATE_READY;
            return;
        }
        lottery.loadFailed = false;
        lottery.state = STATE_LOADING;
        lottery.likes = [];
        lottery.repins = [];
        updatePanel();
        requestActions(100, 0, () => {
            fetchedAction = true;
            lottery.state = STATE_READY;
        });
    }

    function updatePanel() {
        switch (lottery.state) {
            case STATE_LOADING:
                $("#loading").show();
                $("#lotterySettings").hide();
                $("#lotteryResult").hide();
                $("#loadingText").html(lottery.loadingText);
                if (lottery.loadFailed) {
                    $("#failedReloadBtn").show();
                    $("#loadingProgressBar").hide();
                } else {
                    $("#failedReloadBtn").hide();
                    $("#loadingProgressBar").show();
                }
                break;
            case STATE_READY:
                $("#loading").hide();
                $("#lotterySettings").show();
                $("#lotteryResult").hide();
                $("#lotteryInfo").text(`共 ${lottery.likes.length} 人鼓掌，${lottery.repins.length} 人转发`);
                break;
            case STATE_LOTTERY:
                $("#loading").hide();
                $("#lotterySettings").hide();
                $("#lotteryResult").show();
                $("#lotteryResultText").text(lottery.result.text);
                switch (lottery.result.type) {
                    case RESULT_NOT_ENOUGH_PEOPLE:
                        $("#lotteryResultContent").hide();
                        break;
                    case RESULT_SUCCESS:
                        $("#lotteryResultContent").show();
                        $("#lotteryResultList").empty();
                        lottery.result.users.forEach(element => {
                            $("#lotteryResultList").append(`
                            <a class="mdui-list-item mdui-ripple" target="_blank" href="${element.url}">
                                <div class="mdui-list-item-avatar"><img src="${element.avatar_url}"/></div>
                                <div class="mdui-list-item-content">${element.name}</div>
                            </a>
                            `)
                        });
                        break;
                }
                break;
        }
    }

    function log(text) {
        console.log(`[${dateFormat("HH:MM:SS", new Date())}]${text}`);
    }

    function startLottery() {
        if (lottery.state != STATE_READY) {
            return;
        }
        lottery.state = STATE_LOTTERY;
        let selfUrlToken = $(".AuthorInfo-head .UserLink-link").attr("href").split("zhihu.com/people/").pop();
        let lotteryCount = parseInt($(`input[name="count"]`).val());
        let lotteryUsers = [];
        let lotteryMode = $(`input[name="action"]:checked`).val();
        let needFollow = $(`input[name="needFollow"]`).is(":checked");
        switch (lotteryMode) {
            case MODE_LIKE:
                lotteryUsers.push(...lottery.likes);
                break;
            case MODE_REPIN:
                lotteryUsers.push(...lottery.repins);
                break;
            case MODE_LIKE_AND_REPIN: {
                let likeUsers = lottery.likes.map(element => element.id);
                lotteryUsers.push(...lottery.repins.filter(element => likeUsers.includes(element.id)));
                break;
            }
            case MODE_LIKE_OR_REPIN: {
                let repinsUsers = lottery.repins.map(element => element.id);
                lotteryUsers.push(...lottery.repins);
                lotteryUsers.push(...lottery.likes.filter(element => !repinsUsers.includes(element.id)));
                break;
            }
        }
        lotteryUsers = lotteryUsers.filter(element => element.url_token != selfUrlToken);
        if (needFollow) {
            lotteryUsers = lotteryUsers.filter(element => element.is_followed);
        }
        let userCount = lotteryUsers.length;
        if (userCount > lotteryCount) {
            let resultUsers = [];
            let count = lotteryCount;
            do {
                resultUsers.push(...lotteryUsers.splice(getRandom(0, lotteryUsers.length - 1), 1));
                count--
            } while (count > 0)
            lottery.result.type = RESULT_SUCCESS;
            lottery.result.users = resultUsers;
            lottery.result.text = `从 ${userCount} 个符合条件的用户中抽取了 ${lotteryCount} 名用户`;
        } else {
            lottery.result.type = RESULT_NOT_ENOUGH_PEOPLE;
            if (lotteryUsers.length > 0) {
                lottery.result.text = `符合条件的用户数(${userCount} 人)不足`;
            } else {
                lottery.result.text = "没有符合条件的用户";
            }
        }
        updatePanel();
    }

    function requestActions(limit, offset, onFinish) {
        lottery.loadingText = `正在加载第 ${offset / limit + 1} 页`
        $.ajax({
            method: "GET",
            url: `https://www.zhihu.com/api/v4/pins/${lottery.id}/actions?limit=${limit}&offset=${offset}`,
            dataType: "json",
            error() {
                lottery.loadingText = `加载第 ${offset / limit + 1} 页失败`;
                lottery.loadFailed = true;
            },
            success(data) {
                let response = data;
                response.data.forEach((element) => {
                    switch (element.action_type) {
                        case "repin":
                            lottery.repins.push(element.member);
                            break;
                        case "like":
                            lottery.likes.push(element.member);
                            break;
                    }
                });
                lottery.loadingText = `加载第 ${offset / limit + 1} 页完成，共 ${response.data.length} 条记录`
                if (response.data.length >= limit) {
                    setTimeout(() => {
                        requestActions(limit, offset + limit, onFinish);
                    }, 100);
                } else {
                    lottery.loadingText = "加载完成"
                    if (typeof onFinish == "function") {
                        onFinish();
                    }
                }
            },
        });
    }

    GM_addStyle(GM_getResourceText("mduiCss"));
    requireScript(
        "https://unpkg.zhimg.com/mdui@1.0.0/dist/js/mdui.min.js",
        function () {
            init();
        }
    );
})();