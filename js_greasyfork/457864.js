// ==UserScript==
// @name         LX弹幕！
// @namespace    http://tampermonkey.net/
// @version      0.1.05
// @description  Only for LX!
// @author       Chinshry
// @include      https://www.iqiyi.com/*
// @include      https://www.mgtv.com/b/601039/*
// @include      https://www.mgtv.com/b/423452/*
// @include      https://v.qq.com/x/cover/mzc002009pva8r2*
// @run-at       document-end
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457864/LX%E5%BC%B9%E5%B9%95%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/457864/LX%E5%BC%B9%E5%B9%95%EF%BC%81.meta.js
// ==/UserScript==

(function () {
    var barrageList = [];
    let WebType = {
        NONE: 0,
        MGTV: 1,
        IQIYI: 2,
        TENCENT: 3
    };
    let PageType = {
        NONE: {btnText: "", dbKey: "", seriesNameList: [""]},
        LX: {btnText: "梁乡", dbKey: "barrageLost", seriesNameList: ["人生若如初见"]},
        XYS: {btnText: "向远生", dbKey: "barrageStars", seriesNameList: [""]},
        CMD: {btnText: "陈麦冬", dbKey: "barrageSpring", seriesNameList: [""]},
    };
    let pageList = [PageType.LX, PageType.XYS]
    let currentWebType = WebType.NONE
    let currentPageType = PageType.NONE

    let MgtvEvent = {
        startTask(index) {
            MgtvEvent.checkVideo()
            var time = new Date();
            var barrageStr = barrageList[index] ?? "";
            // 100 * 67 * 7^2
            var outputStr = barrageStr + randomStr(1) + randomPunctuation(2);

            console.log("发送弹幕: " + time.toLocaleString() + " " + outputStr);

            let inputNode = document.querySelector("#danmuWrap > div > div > div._danmuSender_1qow5_141 > input")
            var inputEvent = new InputEvent('input', {
                bubbles: true,
                cancelable: true,
                inputType: 'insertText',
                data: outputStr
            });
            inputNode.value = outputStr;
            inputNode.dispatchEvent(inputEvent);
            let sendBtn = document.querySelector("#danmuWrap > div > div > div._danmuSender_1qow5_141 > div._senderBtn_1qow5_185")
            sendBtn.className = "_senderBtn_1qow5_185"
            sendBtn.click();
            setTimeout(function () {
                var barrageIndex = index + 1 == barrageList.length ? 0 : index + 1;
                MgtvEvent.startTask(barrageIndex);
            }, 8000);
        },
        checkVideo() {
            var videoNode = document.querySelector("#mgtv-player-wrap > div > mango-kernel-layer > div > video");
            if (videoNode.currentTime >= 120) {
                videoNode.currentTime = 0
            }
            if (videoNode.paused) {
                videoNode.play()
            }
        },
        eventRegister() {
            $(document).on("click", ".toolTaskButton", function () {
                MgtvEvent.startTask(0);
            });
        },
    };

    let TencentEvent = {
        startTask(index) {
            TencentEvent.checkVideo()
            var time = new Date();
            var barrageStr = barrageList[index] ?? "";
            // 100 * 67 * 7^2
            var outputStr = barrageStr + randomStr(1) + randomPunctuation(2);
            console.log("发送弹幕: " + time.toLocaleString() + " " + outputStr);
            let inputNode = document.querySelector("#player > div.plugin_ctrl_txp_bottom > div > div.txp_left_controls > div.barrage-control > div.barrage-input > input[type=text]")
            // var event = document.createEvent('Event')
            // event.initEvent('input', true, true);
            var inputEvent = new InputEvent('input', {
                isTrusted: true,
                bubbles: true,
                cancelable: true,
                inputType: 'insertText',
            });
            inputNode.value = outputStr;
            let inputContainer = document.querySelector("#player > div.plugin_ctrl_txp_bottom > div > div.txp_left_controls > div.barrage-control > div.barrage-input")
            inputNode.dispatchEvent(inputEvent);
            // inputContainer.className = "barrage-input barrage-input-widen"
            let sendBtn = inputContainer.querySelector("button")
            setTimeout(function () {
                sendBtn.click();
            }, 1000);
            setTimeout(function () {
                var barrageIndex = index + 1 == barrageList.length ? 0 : index + 1;
                TencentEvent.startTask(barrageIndex);
            }, 8000);
        },
        checkVideo() {
            var videoNode = document.querySelector("#player > div.txp_videos_container > video:nth-child(1)");
            if (videoNode.currentTime >= 120) {
                videoNode.currentTime = 0
            }
            if (videoNode.paused) {
                videoNode.play()
            }
        },
        eventRegister() {
            $(document).on("click", ".toolTaskButton", function () {
                TencentEvent.startTask(0);
            });
            var bottomControl = document.querySelector("#player > div.plugin_ctrl_txp_bottom");
            var config = { attributes: true };
            var observer = new MutationObserver(function(mutationsList, observer) {
                mutationsList.forEach(function(mutation) {
                    if (mutation.attributeName == "class" && bottomControl.className == 'plugin_ctrl_txp_bottom txp_none') {
                        bottomControl.className = "plugin_ctrl_txp_bottom"
                        console.log("bottomControl始终显示");
                    }
                });
            });
            observer.observe(bottomControl, config);
        },
    };

    let IqiyiEvent = {
        startTask(index) {
            var ret = IqiyiEvent.checkVideo();
            if (!ret) {
                console.log("等待跳回片头");
            } else {
                var time = new Date();
                var barrageStr = barrageList[index] ?? "";
                // 180 * 67 * 7^2
                var outputStr = barrageStr + randomStr(1) + randomPunctuation(2);

                console.log("发送弹幕: " + time.toLocaleString() + " " + outputStr);

                let inputBox = document.querySelector("#barrage_input_box_login > div.barrage-input-box")
                let inputNode = document.querySelector("#qiyibs_input")
                inputBox.className = "barrage-input-box barrage-input-role barrage-input-act"
                inputNode.value = outputStr;
                let sendBtn = document.querySelector("#barrageSend")
                sendBtn.className = "barrage-send barrage-send-act"
                sendBtn.click();
            }
            setTimeout(function () {
                var barrageIndex = index + 1 == barrageList.length ? 0 : index + 1;
                IqiyiEvent.startTask(barrageIndex);
            }, 8000);
        },
        checkVideo() {
            var ret = true;
            var videoNode = document.querySelector("iqpdiv.iqp-player > iqpdiv.iqp-player-videolayer > iqpdiv > div > video");
            if (videoNode.currentTime >= 90) {
                console.log("片头已结束");
                videoNode.currentTime = 0;
                ret = false;
            }
            if (videoNode.paused) {
                videoNode.click();
            }
            return ret;
        },
        eventRegister() {
            $(document).on("click", ".toolTaskButton", function () {
                IqiyiEvent.startTask(0);
            });
            var bottomControl  = document.querySelector("iqpdiv.iqp-player > iqpdiv.iqp-player-innerlayer > iqpdiv > iqpdiv");
            if (bottomControl.className == 'iqp-bottom-hide') {
                bottomControl.className = "iqp-bottom-show"
            }
            var config = { attributes: true };
            var observer = new MutationObserver(function(mutationsList, observer) {
                mutationsList.forEach(function(mutation) {
                    if (mutation.attributeName == "class" && bottomControl.className == 'iqp-bottom-hide') {
                        bottomControl.className = "iqp-bottom-show"
                        console.log("bottomControl 始终显示");
                    }
                });
            });
            observer.observe(bottomControl , config);
            // observer.disconnect();
        },
    };

    // 判断当前页面
    var currentURL = window.location.href;
    if (currentURL.includes("https://www.mgtv.com/")) {
        console.log("This is the MGTV page.");
        currentWebType = WebType.MGTV
        if (currentURL.includes("https://www.mgtv.com/b/423452/")) {
            currentPageType = PageType.LX
        } else if (currentURL.includes("https://www.mgtv.com/b/601039/")) {
            currentPageType = PageType.XYS
        }
        init()
    } else if (currentURL.includes("https://v.qq.com/")) {
        console.log("This is the Tencent page.");
        currentWebType = WebType.TENCENT
        if (currentURL.includes("https://v.qq.com/x/cover/mzc002009pva8r2")) {
            currentPageType = PageType.CMD
        }
        init()
    } else if (currentURL.includes("https://www.iqiyi.com/")) {
        console.log("This is the iQiyi page.");
        var isFirefox = navigator.userAgent.indexOf('Firefox') > -1
        checkIqiyiName(isFirefox)
    } else {
        console.log("This is other page.");
    }

    function checkIqiyiName(isFirefox) {
        let waitTIme = isFirefox ? 10000 : 5000
        setTimeout(function() {
            let iqiyiSeriesName= document.querySelector("#meta_info_bk > div > div > div:nth-child(2) > div > div.meta_titleBox__G5EUr > div > div.meta_titleContent__cUi2t > div.meta_titleNotCloud__O2Ffr.meta_titleBtn__curus").textContent
            console.log("iqiyiSeriesName = " + iqiyiSeriesName)
            try {
                pageList.forEach((value) => {
                    if (value.seriesNameList.includes(iqiyiSeriesName)) {
                        currentWebType = WebType.IQIYI
                        currentPageType = value
                        init()
                        throw 'TerminateException';
                    }
                });
            } catch (e) {
                console.log("爱奇艺匹配成功");
            }
        }, waitTIme);
    }

    function init() {
        initView(currentPageType);
        initEvent(currentWebType);
        initBarrageList(currentPageType.dbKey);
    }

    function initView(pageType) {
        var container = document.createElement("div");
        container.className = "toolContainer";
        container.style.cssText = "top: 4rem; right: 1rem; position: fixed; width: 120px; height: auto; z-index: 10000; padding: 0.5rem; background-color: rgb(12, 12, 12); border-radius: 1rem;"
        container.style.backgroundColor = "white";
        document.getElementsByTagName("body")[0].appendChild(container);

        var taskButton = document.createElement("div");
        taskButton.className = "toolTaskButton";
        taskButton.style.cssText = "width: auto;padding: 4px;align-items: center;cursor: pointer;z-index: 10000;font-size: 16px;text-align: center;border-radius: 10px;color: white;";
        taskButton.style.backgroundColor = "#4f7348";
        taskButton.style.color = "white";
        taskButton.textContent = pageType.btnText;
        container.appendChild(taskButton);

        var updateButton = document.createElement("div");
        updateButton.className = "toolUpdateButton";
        updateButton.style.cssText = "white-space: pre-line;margin-top: 5px;width: auto;padding: 4px;align-items: center;cursor: pointer;z-index: 10000;font-size: 16px;text-align: center;border-radius: 10px;color: white;";
        updateButton.style.backgroundColor = "#4f7348";
        updateButton.style.color = "white";
        updateButton.textContent = "更新弹幕";
        container.appendChild(updateButton);

        $(document).on("click", ".toolUpdateButton", function () {
            getBarrageList(pageType.dbKey);
        });
    }

    function initEvent(webType) {
        switch (webType) {
            case WebType.MGTV:
                MgtvEvent.eventRegister();
                break;
            case WebType.TENCENT:
                TencentEvent.eventRegister();
                break;
            case WebType.IQIYI:
                IqiyiEvent.eventRegister();
                break;
            default:
                console.log("非目标页")
        }
    }

    function initBarrageList(key) {
        barrageList = JSON.parse(localStorage.getItem(key)) ?? [];
        if (barrageList.length == 0) {
            getBarrageList(key)
        } else {
            console.log("isInit")
            let updateTime = localStorage.getItem(key + "UpdateTime")
            document.querySelector("body > div.toolContainer > div.toolUpdateButton").textContent = "更新弹幕\n" + updateTime
        }
    }

    function getBarrageList(key) {
        $.ajax({
            type: "GET",
            url: "https://api.bmobcloud.com/1/classes/" + key +"?limit=500",
            headers: {
                "Content-Type": "application/json",
                "X-Bmob-Application-Id": "7e48cf1e8f72b83db31bf78d766449de",
                "X-Bmob-REST-API-Key": "9c5a0a29858ed3a711bf23c5d5525f08",
            },
            async: false,
            success: function (result) {
                let tempList = []
                let data = result.results
                if (data.length == 0) {
                    console.error("获取弹幕列表为空");
                    return
                }
                data.forEach((value) => {
                    tempList.push(value.content);
                });
                console.log("获取弹幕列表成功" + tempList);
                localStorage.setItem(key, JSON.stringify(tempList))
                localStorage.setItem(key + "UpdateTime", data[data.length - 1].createdAt)
                initBarrageList(key)
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("获取弹幕列表失败 ", textStatus, errorThrown);
                console.log(jqXHR);
            },
        });
    }

    function randomNum(maxNum) {
        return Math.floor(Math.random() * maxNum);
    }

    function randomPunctuation(maxNum) {
        var resLength = randomNum(maxNum);
        var chars = ["!", "！", "~", "——", "。", "."];
        var res = "";
        for (var i = 0; i < resLength; i++) {
            res += chars[randomNum(chars.length)];
        }
        return res;
    }

    function randomStr(n) {
        var chars = ['啊', '哈', '哦', '噢', '喔', '诶', '欸', '阿', '哇', '呀', '耶', '哟', '呦', '吖', '噜',
                     '么', '呢', '吧', '啦', '吗', '嘛', '呗', '呼', '咚', '咔', '哎', '唉', '艾', '哇', '凹',
                     '嘿', '嗨', '幺', '咳', '嗐', '哈', '呵', '巴', '罢', '罗', '咯', '啰', '啵', '来',
                     '唻', '咪', '嗖', '兮', '哩', '嘞', '嗯', '哼', '咦', '咿', '咕'];
        var res = "";
        for (var i = 0; i < n; i++) {
            var index = randomNum(chars.length);
            res += chars[index];
        }
        return res;
    }

    function randomEmotion(n) {
        var chars =
            [
                '(๑•̀ㅂ•́)و✧',
                'ヾ(≧▽≦*)o',
                '(o゜▽゜)o☆',
                '～(￣▽￣～)(～￣▽￣)～',
                '<(￣︶￣)>',
                '嗯~ o(*￣▽￣*)o',
                '︿(￣︶￣)︿',
                '．<{=．．．．',
                '(￣▽￣)～',
                'φ(゜▽゜*)♪',
                '╰(￣▽￣)╭',
                '<(￣︶￣)↗',
                'o(￣▽￣)ｄ',
                '*′∀`)′∀`)*′∀`)*′∀`)',
                '(｡･∀･)ﾉﾞ',
                'ヾ(≧∇≦*)ゝ',
                '(u‿ฺu✿ฺ)',
                '（゜▽＾*））',
                '(*^▽^*)',
                'ヽ(✿ﾟ▽ﾟ)ノ',
                '(′▽`ʃ♡ƪ)',
                'Hi~ o(*￣▽￣*)ブ',
                '○( ＾皿＾)っ',
                '(( へ(へ′∀`)へ',
                '^O^',
                '＼( ＾∀＾）',
                'ヾ(￣ー￣)X(^▽^)ゞ',
                '╰(*°▽°*)╯',
                '⊙▽⊙',
                '( ￣ー￣)人(^▽^ )',
                '(*^▽^*)',
                '♪(^∇^*)',
                '(๑′ㅂ`๑)',
                'φ(≧ω≦*)♪',
                '(≧∀≦)ゞ',
                '(๑ˉ∀ˉ๑)',
                'o(*￣︶￣*)o',
                '<(*￣▽￣*)/',
                'ε(*′･∀･｀)зﾞ',
                '（≧0≦）//（-_-。）・・・',
                '(　ﾟ∀ﾟ) ﾉ♡',
                '(^&^)/',
                '””(￣ー￣) (￣ー￣)//””',
                'o(*≧▽≦)ツ┏━┓',
                '(～￣▽￣)～',
                '︿(￣︶￣)︿',
                '(/≧▽≦)/',
                '(☆▽☆)',
                '*★,°*:.☆(￣▽￣)/$:*.°★* 。',
                '✧(≖ ◡ ≖✿)',
                'ㄟ(≧◇≦)ㄏ',
                'ヽ(ﾟ∀ﾟ*)ﾉ━━━ｩ♪',
                '( *︾▽︾)',
                '☆⌒(*＾-゜)v THX!!',
                '♪(′∇`*)',
                '！*★,°*:.☆(￣▽￣)/$:*.°★*',
                '||ヽ(*￣▽￣*)ノミ|Ю',
                '~(～￣▽￣)～',
                '(p≧w≦q)',
                'o(*￣▽￣*)o',
                '(＾－＾)V',
                '(＾Ｕ＾)ノ~ＹＯ',
                '(o゜▽゜)o☆',
                '(((o(*ﾟ▽ﾟ*)o)))',
                '(￣︶￣)↗',
                '(o>ε(o>ｕ(≧∩≦)',
                'o(^▽^)o'
            ];
        var res = "";
        for (var i = 0; i < n; i++) {
            var index = randomNum(chars.length);
            res += chars[index];
        }
        return res;
    }
})();