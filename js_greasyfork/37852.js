// ==UserScript==
// @name         404个人工具精简版
// @namespace    http://qiditu.cn/
// @version      4.2.1
// @description  教主直播房间辅助工具
// @author       喵星404
// @match        https://chushou.tv/room/654333.htm
// @resource     sweetalert_1.1.3_CSS https://cdn.bootcss.com/sweetalert/1.1.3/sweetalert.min.css
// @require      https://cdn.bootcss.com/sweetalert/1.1.3/sweetalert.min.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/37852/404%E4%B8%AA%E4%BA%BA%E5%B7%A5%E5%85%B7%E7%B2%BE%E7%AE%80%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/37852/404%E4%B8%AA%E4%BA%BA%E5%B7%A5%E5%85%B7%E7%B2%BE%E7%AE%80%E7%89%88.meta.js
// ==/UserScript==
(function () {
    'use strict';
    if (!checkVersion() && confirm("版本发生变化，所有功能已关闭，请等待更新。是否强制开启？") !== true) {
        return;
    }
    var 喵星404 = (function () {
        function 喵星404() {
            this.filterDanmaku = null;
            this.sentInterval = 100;
            this.lastShieldedUserId = undefined;
        }
        return 喵星404;
    }());
    var HashSet = (function () {
        function HashSet() {
            this.o = {};
        }
        HashSet.prototype.add = function (value) {
            if (this.contains(value)) {
                return false;
            }
            this.o[value] = true;
            return true;
        };
        //noinspection JSUnusedGlobalSymbols
        HashSet.prototype.remove = function (value) {
            if (!this.contains(value)) {
                return false;
            }
            delete this.o[value];
            return true;
        };
        HashSet.prototype.contains = function (value) {
            return this.o[value] === true;
        };
        return HashSet;
    }());
    //noinspection UnnecessaryLocalVariableJS
    var miaoxing404 = new 喵星404();
    unsafeWindow.喵星404 = miaoxing404;
    if (!loadResource()) {
        console.error("加载资源失败");
        return;
    }
    console.debug("加载资源成功");
    modifyUI();
    var result = modifyHotWords() && textEditEnhanced() && appendToTextEditWhenHotWordClick()
        && addAtUserNameFunc() && addShieldedUserFunc()
        && modifySendGiftFunc() && disableSendMessageCallBack();
    if (result) {
        console.debug("加载功能成功");
    }
    else {
        console.error("加载功能失败");
    }
    function loadResource() {
        // 加载资源
        console.debug("加载资源开始");
        var cssText = GM_getResourceText("sweetalert_1.1.3_CSS");
        if (cssText === undefined) {
            console.error("加载sweetalert样式失败");
            return false;
        }
        console.debug("加载sweetalert样式成功");
        GM_addStyle(cssText);
        console.debug("加载资源结束");
        return true;
    }
    function modifyUI() {
        //noinspection SpellCheckingInspection
        $("#geticonmomey").remove(); // 去除扫二维码免费领币图标
        $("#otheranchor").remove(); // 移除底部其他直播
        $(".zb_sharephone").remove(); // 移除手机版按钮
        $(".zb_sharegroup").remove(); // 移除分享
        $(".no-download").remove(); // 移除下载
        $(".divline").remove(); // 移除分享旁边的分隔符
        $("#reportRoom").remove(); // 移除举报按钮
        $(".isSubscribed").remove(); // 移除已关注按钮
        var node = $(".zb_attention_left");
        node.text(node.data("subscribercount")); // 将关注数显示为准确数字
    }
    //noinspection JSUnusedLocalSymbols
    function modifyHotWords() {
        // 修改热词
        console.debug("修改热词开始");
        var words = ["666666666", "23333333333", "猫神教万岁！", "毛咕咕万岁！", "教主晚上吼", "向大佬低头",
            "gay里gay气", "落地成盒", "当然是选择原谅她啊！", "色情教主", "红红火火恍恍惚惚", "喂，妖妖零吗",
            "这把不算", "上海宝山苏格兰吃鸡王长短否", "桌子HP-1", "关注一波，加入猫神教，当开国元勋吧", "凉了凉了",
            "狗头军师", "猫文字D", "教主晚安", "哇这个主播好牛逼，不愧是我们的实力爱逗", "_(:з」∠)_", "ヾﾉ≧∀≦)o",
            "◕‿‿◕", "( •́ ̫ •̀ )", "(〃･‿･)ゞ", "(•̫́ •̀ )", "(｡•ˇ‸ˇ•｡)", "ヾ(◍ ° ∇ ° ◍)ﾉﾞ", "?", "?",
            "请大家注意弹幕礼仪哦！"];
        //noinspection SpellCheckingInspection
        var nodes = $(".wordslist");
        if (nodes.length !== 1) {
            console.error("Error 1:修改热词失败");
            return false;
        }
        var rootNode = $(nodes[0]);
        rootNode.empty();
        $.each(words, function (index, value) {
            var node = $(document.createElement("li"));
            node.data("text", value);
            node.text(value);
            node.appendTo(rootNode);
        });
        var nodeWidth = 300;
        var checkAndWork = function () {
            if (rootNode.width() === nodeWidth) {
                return;
            }
            rootNode.width(nodeWidth);
            setTimeout(function () {
                checkAndWork();
            }, 1000);
        };
        checkAndWork();
        console.debug("修改热词结束");
        return true;
    }
    function textEditEnhanced() {
        console.debug("文本框增强开始");
        var appendChar = ".";
        var preCommit = "";
        if (!("_data" in $)) {
            console.error("not find _data");
            return false;
        }
        //noinspection SpellCheckingInspection
        var zb_incons = $('.zb_incon');
        if (zb_incons.length !== 1) {
            //noinspection SpellCheckingInspection
            console.error(".zb_incon.length !== 1");
            return false;
        }
        //noinspection SpellCheckingInspection
        var zb_incon = $(zb_incons[0]);
        var zbInConData = $._data(zb_incon[0]);
        var result = getObject(zbInConData, "events", "keypress");
        if (result.hasError) {
            console.error(result.errorMessage);
            return false;
        }
        var keyPressArray = result.result;
        if (keyPressArray.length !== 1) {
            console.error("keyPressArray.length !== 1");
            return false;
        }
        var keyPress = keyPressArray[0];
        if (!("handler" in keyPress)) {
            console.error("not find handler in keyPress");
            return false;
        }
        var originalKeyPressHandler = keyPress.handler;
        if (originalKeyPressHandler == null) {
            console.error("originalKeyPressHandler is null");
            return false;
        }
        var zbInSeedNodes = $('.zb_inseed');
        if (zbInSeedNodes.length !== 1) {
            //noinspection SpellCheckingInspection
            console.error(".zbInSeedNodes.length !== 1");
            return false;
        }
        //noinspection SpellCheckingInspection
        var zbInSeed = $(zbInSeedNodes[0]);
        var zbInSeedData = $._data(zbInSeed[0]);
        result = getObject(zbInSeedData, "events", "click");
        //noinspection SpellCheckingInspection
        var clickEvents = result.result;
        if (clickEvents.length !== 1) {
            //noinspection SpellCheckingInspection
            console.error("clickEvents.length !== 1");
            return false;
        }
        var click = clickEvents[0];
        if (!("handler" in click)) {
            console.error("not find handler in click");
            return false;
        }
        var originalClickHandler = click.handler;
        if (originalClickHandler == null) {
            console.error("originalClickHandler is null");
            return false;
        }
        function beforeSend(original, event) {
            //noinspection SpellCheckingInspection
            var message = zb_incon.val();
            if (preCommit !== '' && $.trim(message) === preCommit) {
                //noinspection SpellCheckingInspection
                zb_incon.val(message + appendChar);
            }
            //noinspection SpellCheckingInspection
            preCommit = zb_incon.val();
            original(event);
        }
        click.handler = function (event) {
            beforeSend(originalClickHandler, event);
        };
        keyPress.handler = function (event) {
            switch (event.which) {
                case 13: {
                    if (event.shiftKey) {
                        return true;
                    }
                    beforeSend(originalKeyPressHandler, event);
                    return false;
                }
                default:
                    {
                        originalKeyPressHandler(event);
                    }
                    break;
            }
        };
        zb_incon.keydown(function (event) {
            switch (event.which) {
                case 38:
                    {
                        if (zb_incon.val() === "") {
                            zb_incon.val(preCommit);
                            return false;
                        }
                    }
                    break;
                case 40:
                    {
                        if (zb_incon.val() === preCommit) {
                            zb_incon.val("");
                            return false;
                        }
                    }
                    break;
                default:
                    {
                    }
                    break;
            }
            return true;
        });
        console.debug("文本框增强结束");
        return true;
    }
    function appendToTextEditWhenHotWordClick() {
        // 修改为点击热词后追加在文本框内
        console.debug("开始修改热词点击功能");
        //noinspection SpellCheckingInspection
        var wordsLists = $(".wordslist");
        if (wordsLists.length !== 1) {
            console.error("wordsLists.length !== 1");
            return false;
        }
        //noinspection SpellCheckingInspection
        var zb_incons = $(".zb_incon");
        if (zb_incons.length !== 1) {
            //noinspection SpellCheckingInspection
            console.error("zb_incons.length !== 1");
            return false;
        }
        //noinspection SpellCheckingInspection
        var hotWordsNodes = $(".hotwords");
        if (hotWordsNodes.length !== 1) {
            console.error("hotWordsNodes.length !== 1");
            return false;
        }
        var wordList = $(wordsLists[0]);
        //noinspection SpellCheckingInspection
        var zb_incon = $(zb_incons[0]);
        var hotWords = $(hotWordsNodes[0]);
        wordList.off("click");
        wordList.on("click", "li", function () {
            var message = $(this).data("text");
            zb_incon.val(zb_incon.val() + message);
            wordList.hide();
            wordList.getNiceScroll().hide();
            //noinspection SpellCheckingInspection
            hotWords.find(".roomshield_icon").removeClass('hoverstate');
            //noinspection SpellCheckingInspection
            hotWords.find(".title").removeClass('hoverstate');
            zb_incon.focus();
        });
        console.debug("修改热词点击功能结束");
        return true;
    }
    function addAtUserNameFunc() {
        // 添加@人功能，右键添加@到文本框
        console.debug("添加@人功能开始");
        //noinspection SpellCheckingInspection
        var zb_inconClassNodes = $(".zb_incon");
        if (zb_inconClassNodes.length !== 1) {
            //noinspection SpellCheckingInspection
            console.error("zb_inconClassNodes.length !== 1");
            return false;
        }
        var zb_chat_ulClassNodes = $(".zb_chat_ul");
        if (zb_chat_ulClassNodes.length !== 1) {
            console.error("zb_chat_ulClassNodes.length !== 1");
            return false;
        }
        var orderAndFansList = $(".orderList, #fansList");
        if (orderAndFansList.length !== 4) {
            console.error("orderAndFansList.length !== 4");
            return false;
        }
        var orderList = $(".orderList");
        if (orderList.length !== 4) {
            console.error("orderList.length !== 4");
            return false;
        }
        var textEdit = $(zb_inconClassNodes[0]);
        var chatNode = $(zb_chat_ulClassNodes[0]);
        function textAreaAppend(text) {
            textEdit.val(textEdit.val() + text);
        }
        //noinspection SpellCheckingInspection
        chatNode.delegate(".zb_username", "contextmenu", function () {
            var text = $(this).text();
            var nickname = text.substring(0, text.length - 1);
            textAreaAppend("@" + nickname + "  ");
            return false;
        });
        //noinspection SpellCheckingInspection
        orderAndFansList.delegate(".avatarcontain, .avatar-crown", "contextmenu", function () {
            //noinspection SpellCheckingInspection
            var nodes = $(this).siblings("span.usernickname");
            if (nodes.length !== 1) {
                console.debug("orderAndFansList.delegate nodes.length !== 1");
                return;
            }
            var nickname = $(nodes[0]).text();
            textAreaAppend("@" + nickname + "  ");
            return false;
        });
        //noinspection SpellCheckingInspection
        orderAndFansList.delegate(".usernickname", "contextmenu", function () {
            var nickname = $(this).text();
            textAreaAppend("@" + nickname + "  ");
            return false;
        });
        //noinspection SpellCheckingInspection
        $("#sp1").on("contextmenu", function () {
            var nickname = $(this).text();
            textAreaAppend("@" + nickname + "  ");
            return false;
        });
        //noinspection SpellCheckingInspection
        orderList.delegate(".total-item", "contextmenu", function () {
            //noinspection SpellCheckingInspection
            var nodes = $(this).children("span.usernickname");
            if (nodes.length !== 1) {
                console.debug("orderList.delegate nodes.length !== 1");
                return;
            }
            var nickname = $(nodes[0]).text();
            textAreaAppend("@" + nickname + "  ");
            return false;
        });
        console.debug("添加@人功能结束");
        return true;
    }
    function addShieldedUserFunc() {
        // 添加屏蔽用户功能
        console.debug("添加屏蔽功能开始");
        var result = getObject(liveop, "prototype");
        if (result.hasError) {
            console.error(result.errorMessage);
            return false;
        }
        //noinspection SpellCheckingInspection
        var liveopPrototype = result.result;
        if (!("_addDataList" in liveopPrototype)) {
            //noinspection SpellCheckingInspection
            console.error("_addDataList not in liveop.prototype");
            return false;
        }
        result = getObject(unsafeWindow, "FlashInterface");
        if (result.hasError) {
            console.error(result.errorMessage);
            return false;
        }
        var originalFlashInterface = result.result;
        if (originalFlashInterface == null) {
            console.error("originalFlashInterface == null");
            return false;
        }
        var lastANode = $("#zbvideobar").find(">a:last");
        if (lastANode.length === 0) {
            console.error("lastANode.length === 0");
            return false;
        }
        var filterHashSet = new HashSet();
        function addShieldButton() {
            //noinspection SpellCheckingInspection
            var userCardPromptBoxNodes = $("#userCardPromptbox");
            if (userCardPromptBoxNodes.length !== 1) {
                console.debug("userCardPromptBox.length !== 1");
                return false;
            }
            //noinspection JSJQueryEfficiency
            if ($("#userShield").length !== 0) {
                console.debug("userShieldNodes.length !== 0");
                return false;
            }
            //noinspection SpellCheckingInspection
            var closeButtonNodes = $("#userClosebtn");
            if (closeButtonNodes.length !== 1) {
                console.debug("closeButtonNodes.length !== 1");
                return false;
            }
            var userCardPromptBox = $(userCardPromptBoxNodes[0]);
            var uid = userCardPromptBox.data("uid");
            if (uid == null) {
                console.debug("uid == null");
                return false;
            }
            var nickname = userCardPromptBox.data("nickname");
            if (nickname == null) {
                console.debug("nickname == null");
                return false;
            }
            var closeButton = $(closeButtonNodes[0]);
            var liEle;
            //noinspection SpellCheckingInspection
            $("#room_chat_ul").find("li[class='msgtype1']>div>span:contains('" + nickname + ":')").each(function () {
                if ($(this).text() === nickname + ":") {
                    liEle = $(this).parent().parent();
                }
            });
            //noinspection SpellCheckingInspection
            userCardPromptBox.find(">.content-box>.topbar>.setting-box:last").after('<div id="userShield" class="setting-box" title="屏蔽">' +
                '<svg class="normal" style="width: 1em;height: 1em;vertical-align: middle;fill: currentColor;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1757">' +
                '<path d="M759.62401792 498.04708864c-113.70156146 0-206.20364003 92.48577763-206.20364003 206.16521728 0 62.79858176 28.23066169 119.11902663 72.65783238 156.96676637 0.49598919 0.47736149 1.0036224 0.94657195 1.53570532 1.39831864 0.65899065 0.5600256 1.34126819 1.07464477 2.03053056 1.57412694 35.49469923 28.89547435 80.74618994 46.24696434 129.97957063 46.24696434 113.66081195 0 206.13145373-92.49392754 206.13145373-206.18617515C965.75547165 590.53170119 873.28599381 498.04708864 759.62401792 498.04708864zM759.62401792 564.05330375c23.35692345 0 45.3912064 5.75278194 64.77671993 15.90543474L647.46980466 788.23016562c-17.60064853-23.42910976-28.04204658-52.52600718-28.04204658-84.0178597C619.42775808 626.92872875 682.31948402 564.05330375 759.62401792 564.05330375zM759.62401792 844.38993693c-21.95511182 0-42.74592882-5.07749035-61.26520547-14.11241984l175.71540878-206.83934493c16.16390827 22.84579726 25.67387022 50.72018546 25.67387022 80.77413376C899.74809259 781.50752597 836.88896626 844.38993693 759.62401792 844.38993693z" p-id="1758"></path>' +
                '<path d="M517.58570496 790.00338659L125.99136483 790.00338659c16.58771115-163.13636523 154.76391936-290.85953251 322.21167048-290.85953251 43.21513927 0 85.25783381 8.49586062 124.95796679 25.25123129 16.79495623 7.09055715 36.15252594-0.78124146 43.23959011-17.57270471 7.08822813-16.7926272-0.78007751-36.15252594-17.57270471-43.23959012-4.55239339-1.92108658-9.13855147-3.72341533-13.74101049-5.46403669 13.80737479-9.15368733 26.80323641-19.75226595 38.78266766-31.73519019 46.90129806-46.91294094 72.73234773-109.29586973 72.73234774-175.65603043 0-66.36714667-25.83104967-128.75589746-72.73234774-175.67000235-46.90828288-46.92225479-109.29470464-72.76261945-175.66650936-72.76261945-136.96766976 0-248.3988571 111.44632206-248.3988571 248.43262066 0 86.41164971 44.35498439 162.64503296 111.48241578 207.16418276-4.97619741 1.86869305-9.93027299 3.8165595-14.84592583 5.89482552-46.42975858 19.63816505-88.12316445 47.7442469-123.9205797 83.53700523-35.79858034 35.79508736-63.90815517 77.48616419-83.54748416 123.91475769-20.34256327 48.0877147-30.65705358 99.15020288-30.65705358 151.7693531 0 18.22703957 14.77606855 33.00427207 33.00427207 33.00427207l426.26704726 0c18.22703957 0 33.00427207-14.77606855 33.00427206-33.00427207S535.81274453 790.00338659 517.58570496 790.00338659zM265.81272235 250.72636928c0-100.59043499 81.81967075-182.42640555 182.39031296-182.42640555s182.39031296 81.83597056 182.39031296 182.42640555c0 100.58112114-81.81967075 182.40894179-182.39031296 182.40894179S265.81272235 351.30748928 265.81272235 250.72636928z" p-id="1759"></path>' +
                '</svg>' +
                '</div>');
            //noinspection JSJQueryEfficiency
            var userShieldNodes = $("#userShield");
            if (userShieldNodes.length !== 1) {
                console.debug("userShieldNodes.length !== 1");
                return false;
            }
            var userShield = $(userShieldNodes[0]);
            userShield.click(function () {
                if (uid === 1322184860) {
                    swal({
                        type: "warning",
                        title: "(ू˃̣̣̣̣̣̣︿˂̣̣̣̣̣̣ ू)不可以对开发者做这种事",
                        showConfirmButton: false,
                        timer: 1000
                    });
                }
                else {
                    filterHashSet.add(uid);
                    miaoxing404.lastShieldedUserId = uid;
                    $(liEle).remove();
                    var flag = miaoxing404.filterDanmaku != null
                        && miaoxing404.filterDanmaku(new User(uid, "", ""));
                    swal({
                        type: flag ? "success" : "warning",
                        title: "屏蔽" + nickname + (flag ? "成功" : "失败"),
                        showConfirmButton: false,
                        timer: 1000
                    });
                    console.info("屏蔽", uid, flag ? "成功" : "失败");
                }
                closeButton.click();
            });
            return true;
        }
        var node = $(document.createElement('a'));
        node.addClass("recharge");
        node.text("取消屏蔽");
        node.width(70);
        node.click(function () {
            swal({
                title: "输入需要移除的用户的id",
                type: "input",
                showCancelButton: true,
                closeOnConfirm: false,
                animation: "slide-from-top",
                focusConfirm: false,
                inputValue: miaoxing404.lastShieldedUserId,
                inputPlaceholder: "用户id"
            }, function (inputValue) {
                if (typeof inputValue === "boolean") {
                    return false;
                }
                var inputHasError = false;
                //noinspection SingleCharAlternation
                if (!(/^(\+|-)?\d+$/.test(inputValue))) {
                    inputHasError = true;
                }
                var id = parseInt(inputValue);
                if (id <= 0) {
                    inputHasError = true;
                }
                if (inputHasError) {
                    swal.showInputError("请输入正整数！");
                    return false;
                }
                var result = filterHashSet.remove(id);
                if (result) {
                    miaoxing404.lastShieldedUserId = undefined;
                }
                swal({
                    type: result ? "success" : "warning",
                    title: "取消" + id + "屏蔽" + (result ? "成功" : "失败"),
                    showConfirmButton: false,
                    timer: 1000
                });
                return true;
            });
        });
        node.insertAfter(lastANode);
        // 创建观察者对象, 传入目标节点和观察选项
        new MutationObserver(function () {
            if ($("#userCardPromptbox").length === 1 && $("#userShield").length === 0) {
                addShieldButton();
            }
        }).observe(document.body, { childList: true });
        miaoxing404.filterDanmaku = function (user) {
            return filterHashSet.contains(user.userId);
        };
        function filterData(data) {
            for (var i = 0; i < data.length;) {
                if (data[i].type === 2 || !getObject(data[i], "metaInfo", "animation").hasError) {
                    console.log("filter:", data[i]);
                    data.splice(i, 1);
                    continue;
                }
                if (data[i].type !== 1) {
                    ++i;
                    continue;
                }
                var user = data[i].user;
                if (isInvaild(data[i].user)) {
                    ++i;
                    continue;
                }
                var uid = user.uid;
                if (!isInvaild(uid)) {
                    var username = user.nickname;
                    var content = data[i].content;
                    var userType = UserType.None;
                    for (var j = 0; j < data[i].medalList.length; j++) {
                        var url = data[i].medalList[j].url;
                        if (url.indexOf("bigfans") != -1 /*铁粉*/) {
                            userType |= UserType.Fans;
                        }
                        else if (url.indexOf("manager_1") != -1 /*房管*/) {
                            userType |= UserType.Manager;
                        }
                        else if (url.indexOf("manager_2") != -1 /*主播*/) {
                            userType |= UserType.Up;
                        }
                    }
                    if (miaoxing404.filterDanmaku !== null
                        && miaoxing404.filterDanmaku(new User(uid, username, content, userType))) {
                        console.info("屏蔽用户, uid: ", uid, ", 用户名: ", username, ", content： ", content);
                        data.splice(i, 1);
                        continue;
                    }
                }
                ++i;
            }
        }
        var originalAddDataList = liveopPrototype._addDataList;
        liveopPrototype._addDataList = function (messageList) {
            if (isInvaild(messageList.length)) {
                return;
            }
            filterData(messageList);
            originalAddDataList(messageList);
        };
        unsafeWindow.FlashInterface = function (data, swf) {
            console.debug(data);
            //noinspection SpellCheckingInspection
            if (data.cmd === "js_chatbarrge" && !isInvaild(data.data)) {
                filterData(data.data);
            }
            originalFlashInterface(data, swf);
        };
        console.debug("添加屏蔽功能结束");
        return true;
    }
    //noinspection JSUnusedLocalSymbols
    function modifySendGiftFunc() {
        // ----------- 以下为修改送礼功能 -------------
        console.debug("添加批量送礼功能开始");
        //noinspection SpellCheckingInspection
        var giftDivs = $(".giftdiv, #allGiftContainer");
        if (giftDivs.length !== 2) {
            console.error("giftDivs.length !== 2");
            return false;
        }
        function sendGift(giftName, giftCount, giftId) {
            if (isInvaild(giftName)) {
                console.warn("没有传入有效参数: giftName");
                return;
            }
            if (isInvaild(giftCount)) {
                console.warn("没有传入有效参数: giftCount");
                return;
            }
            if (typeof (giftCount) !== "number" || giftCount <= 0) {
                console.warn("请传入大于0的参数");
                return;
            }
            //noinspection SpellCheckingInspection
            var data = {
                roomId: 654333,
                giftId: giftId,
                token: $(".ztcon").data("token")
            };
            var block = false;
            var updateTime = 0;
            var work = function (index) {
                if (block) {
                    return;
                }
                $.ajax({
                    url: "https://chushou.tv/point/reward.htm",
                    type: 'POST',
                    data: data,
                    dataType: 'json',
                    success: function (data) {
                        if (data.code === 0) {
                            if (data.data.updatedTime > updateTime || updateTime === 0) {
                                //noinspection SpellCheckingInspection
                                $("#zbvideobar").find(".moneynumber").html(data.data.point);
                                updateTime = data.data.updatedTime;
                            }
                        }
                        else {
                            if (block) {
                                console.debug("block", index);
                                return;
                            }
                            //noinspection SpellCheckingInspection
                            var moneyEmptybox = $("#moneyEmptybox");
                            if (data.code === 1000) {
                                moneyEmptybox.find('.text').html("你的钱包空了，先去充点~");
                                block = true;
                            }
                            else {
                                moneyEmptybox.find('.text').html(data.message);
                                setTimeout(function () {
                                    work(index);
                                }, miaoxing404.sentInterval);
                            }
                        }
                    },
                    error: function () {
                        if (block) {
                            return;
                        }
                        block = true;
                        alertModal.mshow($(".alert_panel"), "网络错误，请稍后重试");
                    }
                });
            };
            var _loop_1 = function (i) {
                if (block) {
                    return { value: void 0 };
                }
                setTimeout(function () {
                    work(i);
                }, miaoxing404.sentInterval);
            };
            for (var i = 0; i < giftCount; ++i) {
                var state_1 = _loop_1(i);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
        }
        giftDivs.off("click", ".gift_icon");
        giftDivs.on("click", ".gift_icon", function () {
            var giftName = $(this).find(".give-gift").data("name");
            var giftId = parseInt($(this).find(".give-gift").data("id"));
            swal({
                title: "输入" + giftName + "数量",
                type: "input",
                showCancelButton: true,
                closeOnConfirm: false,
                animation: "slide-from-top",
                focusConfirm: false,
                inputValue: 1,
                inputPlaceholder: "余额不足不清楚会发生什么"
            }, function (inputValue) {
                if (typeof inputValue === "boolean") {
                    return false;
                }
                //noinspection SingleCharAlternation
                if (!(/^(\+|-)?\d+$/.test(inputValue))) {
                    swal.showInputError("请输入整数！");
                    return false;
                }
                var value = parseInt(inputValue);
                if (value <= 0) {
                    swal.showInputError("送礼数必须大于0！");
                    return false;
                }
                sendGift(giftName, value, giftId);
                swal({
                    type: 'success',
                    title: '开始发送' + value + '个' + giftName,
                    showConfirmButton: false,
                    timer: 1000
                });
                return true;
            });
        });
        console.debug("添加批量送礼功能结束");
        return true;
    }
    //noinspection JSUnusedLocalSymbols
    function modifySendPropFunc() {
        console.debug("添加批量送道具功能开始");
        var propsTitleNodes = $("#propstitle");
        if (propsTitleNodes.length !== 1) {
            console.error("propsTitleNodes.length !== 1");
            return false;
        }
        var propsTitleNode = $(propsTitleNodes[0]);
        var isInTime = propsTitleNode.data("isintime");
        var className = "";
        if (isInTime) {
            className = "christmas-gift-props";
        }
        function createProps(pocket) {
            var str = '';
            for (var i = 0; i < pocket.length; i++) {
                //noinspection SpellCheckingInspection
                var pocketone = pocket[i];
                if (i === 0)
                    str += '<div class="oneitem firstitem" data-type="' + pocketone.type + '" data-key="' + pocketone.primaryKey + '">';
                else
                    str += '<div class="oneitem" data-type="' + pocketone.type + '" data-key="' + pocketone.primaryKey + '">';
                str += '<div class="props_icon ' + className + '">';
                str += '<img class="props-gift" data-name="' + pocketone.primaryName + '" src="' + replaceProtocol(pocketone.primaryIcon) + '">';
                str += '</div>';
                str += '<div class="propsnum">';
                str += '<div class="bgcolor"></div>';
                str += '<span title="' + pocketone.count + '">' + pocketone.count + '</span>';
                str += '</div>';
                str += '</div>';
            }
            if (pocket.length <= 0) {
                str = '<div class="noprops">';
                str += '<img class="noprops-icon" src="//kascdn.kascend.com/jellyfish/uiupload/images/no_gift_props.png">';
                str += '<div class="text">';
                str += '<span>当前没有道具可以使用哦!</span>';
                str += '<span>完成<i id="porpstask" class="porpstask">任务</i>，免费领取道具</span>';
                str += '</div><div class="clear"></div></div>';
            }
            $("#propstitle").find('.propslist').html(str);
        }
        function sendProp(propName, propCount) {
            if (isInvaild(propName)) {
                console.warn("没有传入有效参数: propName");
                return;
            }
            if (isInvaild(propCount)) {
                console.warn("没有传入有效参数: propCount");
                return;
            }
            if (typeof (propCount) !== "number" || propCount <= 0) {
                console.warn("请传入大于0的参数");
                return;
            }
            var nodes = $(".props-gift[data-name='" + propName + "']");
            if (nodes.length !== 1) {
                console.warn("没有找到唯一道具: " + propName);
                return;
            }
            var node = $(nodes[0]).parent().parent();
            /* 当数量为0时要求充值
             if (node.data("type") === "2" && node.find('.propsnum').find('span').text() === "0") {
             $(".recharge")[0].click();
             return;
             } */
            var ajaxData = {
                targetKey: 654333,
                primaryKey: node.data("key"),
                type: node.data("type"),
                token: $(".ztcon").data("token")
            };
            var block = false;
            var work = function () {
                if (block) {
                    return;
                }
                $.ajax({
                    url: "https://chushou.tv/room-pocket/consume.htm",
                    type: 'POST',
                    data: ajaxData,
                    dataType: 'json',
                    success: function (data) {
                        if (data.code === 0) {
                            var pocket = data.data.pocket;
                            if (pocket.length === $("#propstitle").find('.oneitem').length) {
                                for (var i = 0; i < pocket.length; i++) {
                                    var pocketone = pocket[i];
                                    if (pocketone.primaryKey == ajaxData.primaryKey && pocketone.type == ajaxData.type) {
                                        $(this).find('.propsnum').find('span').html(pocketone.count);
                                        $(this).find('.propsnum').find('span').attr("title", pocketone.count);
                                    }
                                }
                            }
                            else {
                                createProps(pocket);
                            }
                        }
                        else {
                            if (block) {
                                return;
                            }
                            alertModal.mshow($(".alert_panel"), data.message);
                        }
                    },
                    error: function () {
                        if (block) {
                            return;
                        }
                        block = true;
                        alertModal.mshow($(".alert_panel"), "网络错误，请稍后重试");
                    }
                });
            };
            for (var i = 0; i < propCount; ++i) {
                if (block) {
                    return;
                }
                setTimeout(function () {
                    work();
                }, miaoxing404.sentInterval);
            }
        }
        propsTitleNode.off("click");
        propsTitleNode.on("click", ".oneitem", function () {
            var giftName = $(this).find(".props-gift").data("name");
            swal({
                title: "输入" + giftName + "数量",
                type: "input",
                showCancelButton: true,
                closeOnConfirm: false,
                animation: "slide-from-top",
                focusConfirm: false,
                inputValue: 1,
                inputPlaceholder: "道具不足不清楚会发生什么"
            }, function (inputValue) {
                if (typeof inputValue === "boolean") {
                    return false;
                }
                //noinspection SingleCharAlternation
                if ((/^(\+|-)?\d+$/.test(inputValue)) && parseInt(inputValue) > 0) {
                    sendProp(giftName, parseInt(inputValue));
                    swal({
                        type: 'success',
                        title: '开始发送' + inputValue + '个' + giftName,
                        showConfirmButton: false,
                        timer: 1000
                    });
                    return true;
                }
                else {
                    swal.showInputError("请输入正整数！");
                    return false;
                }
            });
        });
        console.debug("添加批量送道具功能结束");
        return true;
    }
    //noinspection JSUnusedLocalSymbols
    function disableSendMessageCallBack() {
        console.debug("禁用回显功能开始");
        var result = getObject(unsafeWindow, "swfSendMessageCallback");
        if (result.hasError) {
            console.error(result.errorMessage);
            return false;
        }
        var originalSwfSendMessageCallback = result.result;
        //noinspection SpellCheckingInspection
        var zb_inconClassNodes = $(".zb_incon");
        if (zb_inconClassNodes.length !== 1) {
            //noinspection SpellCheckingInspection
            console.debug("zb_inconClassNodes.length !== 1");
            return false;
        }
        var textEdit = $(zb_inconClassNodes[0]);
        result = getObject(liveop, "prototype");
        if (result.hasError) {
            console.error(result.errorMessage);
            return false;
        }
        var liveOpPrototype = result.result;
        result = getObject(liveOpPrototype, "_addOneData");
        if (result.hasError) {
            console.error(result.errorMessage);
            return false;
        }
        var originalAddOneData = result.result;
        unsafeWindow.swfSendMessageCallback = function (message, backData) {
            if (backData.code === 0) {
                textEdit.val('');
            }
            else {
                originalSwfSendMessageCallback(message, backData);
            }
        };
        liveOpPrototype._addOneData = function (uid, nicename, message, type, avatar, medalList, mark, showavatar, giftComboStr, chatArea, d) {
            if (type != null && (type < 0 || type > 4)) {
                console.warn("未知type类型");
            }
            if (type == null) {
                type = 1;
            }
            originalAddOneData(uid, nicename, message, type, avatar, medalList, mark, showavatar, giftComboStr, chatArea, d);
        };
        console.debug("禁用回显功能结束");
        return true;
    }
    //noinspection JSUnusedLocalSymbols
    function removeFlashFocus() {
        console.debug("添加定时移除焦点功能开始");
        var pollTime = 1000;
        var flash = $("#liveplayer");
        if (flash.length !== 1) {
            console.error("flash.length !== 1");
            return false;
        }
        var work = function () {
            if (flash.is(":focus")) {
                flash.blur();
            }
            setTimeout(function () { work(); }, pollTime);
        };
        work();
        console.debug("添加定时移除焦点功能结束");
        return true;
    }
    function checkVersion() {
        var allUrls = [];
        $("link").each(function () {
            var href = $(this).attr("href");
            if (href == null) {
                return;
            }
            allUrls.push(href);
        });
        $("script").each(function () {
            var src = $(this).attr("src");
            if (src == null) {
                return;
            }
            allUrls.push(src);
        });
        var timeVersion = "20180125";
        var sysVersion = 619;
        var urls = [
            "//cdn.kascend.com/jellyfish/sysv" + sysVersion + "/js/init/init.js?v=" + timeVersion,
            "//cdn.kascend.com/jellyfish/sysv" + sysVersion + "/js/lib/jquery/jquery-1.10.2.min.js",
            "//cdn.kascend.com/jellyfish/sysv" + sysVersion + "/js/business/room_detail/room_detail.js?v=4?v=" + timeVersion,
            "//cdn.kascend.com/jellyfish/sysv" + sysVersion + "/js/business/user/phone/verify_pc.js?v=" + timeVersion,
            "//cdn.kascend.com/jellyfish/sysv" + sysVersion + "/js/lib/barrage/barrage.js?v=" + timeVersion
        ];
        for (var i = 0; i < urls.length; ++i) {
            var finded = false;
            for (var j = 0; j < allUrls.length; ++j) {
                if (allUrls[j] === urls[i]) {
                    finded = true;
                    break;
                }
            }
            if (!finded) {
                console.debug("checkVersion not find index:", i);
                return false;
            }
        }
        return true;
    }
    //noinspection SpellCheckingInspection
    function isInvaild(param) {
        var typeStr = typeof (param);
        if (typeStr === "undefined") {
            return true;
        }
        if (typeStr === "object" && !param) {
            return true;
        }
        return typeStr === "number" && isNaN(param);
    }
    function getObject(obj) {
        var arg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            arg[_i - 1] = arguments[_i];
        }
        if (obj == null) {
            return getNullInParamResult();
        }
        for (var i = 0; i < arg.length; ++i) {
            if (arg[i] == null || arg[i].length === 0) {
                return getFailResult(i, arg, GetObjectErrorType.PropertyNotContains);
            }
            if (!(arg[i] in obj)) {
                return getFailResult(i, arg, GetObjectErrorType.PropertyNotContains);
            }
            obj = obj[arg[i]];
            if (obj == null) {
                return getFailResult(i, arg, GetObjectErrorType.ObjectIsNull);
            }
        }
        return getSuccessResult(obj);
        function getNullInParamResult() {
            return {
                result: null,
                hasError: true,
                errorIndex: -1,
                errorMessage: "in param obj is null",
                errorType: GetObjectErrorType.ObjectIsNull
            };
        }
        function getSuccessResult(obj) {
            return {
                result: obj,
                hasError: false,
                errorIndex: -1,
                errorMessage: null,
                errorType: null
            };
        }
        //noinspection SpellCheckingInspection
        function getFailResult(errorIndex, propertys, errorType) {
            var errorMessage;
            if (errorType === GetObjectErrorType.PropertyNotContains) {
                var propertyName = propertys[errorIndex];
                if (errorIndex == 0) {
                    errorMessage = propertyName + " is not in in param obj";
                }
                else {
                    errorMessage = propertyName + " is not in " + propertys.slice(0, errorIndex - 1).join(".");
                }
            }
            else if (errorType === GetObjectErrorType.ObjectIsNull) {
                errorMessage = propertys.slice(0, errorIndex).join(".") + " is null";
            }
            return {
                result: null,
                hasError: true,
                errorIndex: errorIndex,
                errorMessage: errorMessage,
                errorType: errorType
            };
        }
    }
    var GetObjectErrorType;
    (function (GetObjectErrorType) {
        GetObjectErrorType[GetObjectErrorType["PropertyNotContains"] = 0] = "PropertyNotContains";
        GetObjectErrorType[GetObjectErrorType["ObjectIsNull"] = 1] = "ObjectIsNull";
    })(GetObjectErrorType || (GetObjectErrorType = {}));
    var UserType;
    (function (UserType) {
        UserType[UserType["None"] = 0] = "None";
        UserType[UserType["Fans"] = 1] = "Fans";
        UserType[UserType["Manager"] = 2] = "Manager";
        UserType[UserType["Up"] = 4] = "Up";
    })(UserType || (UserType = {}));
    var User = (function () {
        function User(userId, userName, content, type) {
            if (type === void 0) { type = null; }
            this.userId = userId;
            this.userName = userName;
            this.content = content;
            this.type = type;
        }
        return User;
    }());
})();
//# sourceMappingURL=main.user.js.map