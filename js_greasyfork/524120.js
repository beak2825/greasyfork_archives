// ==UserScript==
// @name         LX弹幕！
// @namespace    http://tampermonkey.net/
// @version      0.1.03
// @description  Only for LX!
// @author       Chinshry
// @include      https://www.iqiyi.com/*
// @include      https://www.mgtv.com/b/601039/*
// @include      https://www.mgtv.com/b/423452/*
// @include      https://v.qq.com/x/cover/mzc002009pva8r2*
// @match        https://www.mgtv.com/b/615428/*
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524120/LX%E5%BC%B9%E5%B9%95%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/524120/LX%E5%BC%B9%E5%B9%95%EF%BC%81.meta.js
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
            IqiyiEvent.checkVideo()
            var time = new Date();
            var barrageStr = barrageList[index] ?? "";
            // 180 * 67 * 7^2
            var outputStr = barrageStr + randomStr(1) + randomPunctuation(2);

            console.log("发送弹幕: " + time.toLocaleString() + " " + outputStr);

            let inputBox = document.querySelector("#qyBarrageVue > div.barrage-input-wrap > div.barrage-input-box.barrage-input-role")
            let inputNode = document.querySelector("#qyBarrageVue > div.barrage-input-wrap > div.barrage-input-box.barrage-input-role > input")
            inputBox.className = "barrage-input-box barrage-input-role barrage-input-act"
            inputNode.value = outputStr;
            let sendBtn = document.querySelector("#qyBarrageVue > div.barrage-input-wrap > a")
            sendBtn.className = "barrage-send barrage-send-act"
            sendBtn.click();
            setTimeout(function () {
                var barrageIndex = index + 1 == barrageList.length ? 0 : index + 1;
                IqiyiEvent.startTask(barrageIndex);
            }, 8000);
        },
        checkVideo() {
            var videoNode = document.querySelector("#flashbox > iqpdiv > iqpdiv.iqp-player > iqpdiv.iqp-player-videolayer > iqpdiv > video");
            if (videoNode.currentTime >= 120) {
                videoNode.currentTime = 0
            }
            if (videoNode.paused) {
                videoNode.click()
            }
        },
        eventRegister() {
            $(document).on("click", ".toolTaskButton", function () {
                IqiyiEvent.startTask(0);
            });
            var bottomControl = document.querySelector("#flashbox > iqpdiv > iqpdiv.iqp-player > iqpdiv.iqp-player-innerlayer > iqpdiv > iqpdiv");
            var config = { attributes: true };
            var observer = new MutationObserver(function(mutationsList, observer) {
                mutationsList.forEach(function(mutation) {
                    if (mutation.attributeName == "class" && bottomControl.className == 'iqp-bottom-hide') {
                        bottomControl.className = "iqp-bottom-show"
                        console.log("bottomControl始终显示");
                    }
                });
            });
            observer.observe(bottomControl, config);
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
            let iqiyiSeriesName= document.querySelector("#plist-body > div > div.hw-full > div.qy-side-head > div > h2 > a").text
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
        var chars = ["大唐世界迷人眼，外浪内纯李现蒋长扬","红橙黄绿青蓝紫，花里胡哨李现蒋长扬","黑的白的红的黄的，紫的绿的蓝的灰的，各种款式蒋长扬都有（夸张）","喜扬扬，美扬扬，懒扬扬，沸扬扬。慢扬扬，软绵绵，蒋长扬，你太浪～","大唐第一花鸟使蒋长扬","李现这一世终于不用借钱过日子了，蒋长扬据说富可敌国","宜古宜今大帅哥李现！","蒋长扬，为你疯狂打 call！","蒋长扬我想知道你在隐藏什么！","重生之我在古代当有钱人--蒋长扬篇","蒋长扬不经意的小动作戳到我了～","全黑霸总韩商言，七彩国色蒋长扬，你 pk 哪个","《国色芳华》蒋长扬这张脸，真的要迷倒众生呀","今日是李现蒋长扬的上头女孩，韩商言对不起啦！","来来来，李现蒋君明卫、暗卫竞争激烈！快来报名！","韩商言和蒋长扬当老公你选哪个？","哇，我要集齐花里胡哨的蒋长扬","天呐 蒋长扬你也太有趣了吧","李现，我已经被蒋长扬拿捏了","万人迷的贵公子李现蒋长扬～","李现蒋长扬勇谋兼济风采","李现蒋长扬俊逸才情卓然","李现蒋长扬逸志逐梦芳华","看李现如何演绎蒋长扬","李现蒋长扬共绽国色","蒋长扬登场，李现展风姿","乘势而上，有幸相遇蒋长扬","心怀天下国之利刃蒋长扬","李现古装扮相太好看了","蒋长扬，智定乾坤！；花鸟使来，长扬风采！","国色花美男蒋长扬","蒋长扬 你到底在隐藏什么","大唐玉树临风帅气迷人李现蒋长扬","蒋长扬 李现的上头女孩来咯～","来看美扬扬啦 最帅的蒋长扬","蒋长扬你到底还要蛰伏多久！！！","国色说的莫不是蒋长扬蒋大人？","翩翩公子蒋长扬，韬光养晦为家国","蒋长扬表面贪官，实则心怀家国天下","打听到李现蒋长扬有一个隐藏身份","快看，是雅冠长安的蒋长扬！","谢之遥养的马终于坐在了蒋长扬屁股下","花里胡哨的蒋长扬来了","蒋长扬这脸技鲨疯了","蒋长扬把放荡不羁演的真到位","李现蒋长扬这笑面虎太得意了","蒋长扬天使投资人","跟着李现蒋长扬一起发大财","蒋长扬心软的神","蒋长扬内心好苦啊","文武双全，李现蒋长扬厉害啦！","蒋长扬活脱脱一个贱萌贱萌的风流俏公子","蒋长扬入世俗却不世俗，风流却不油腻，李现演技很自然","蒋长扬：“一分纨绔演十分，十分真心演一分”","李现这眼神戏真的会让人沉溺","超级喜欢李现这眼神戏","不用言语就能感受到蒋长扬眼神里面所存传达出来的心里活动","嘴里都是钱 眼里都是她，沉溺在李现蒋长扬的眼神里","每天都被蒋长扬勾成翘嘴","都来给蒋长扬护驾！","红豆生南国，蒋长扬胜男模！","花花孔雀蒋长扬，风流倜傥美名扬","真的每天都等着李现蒋长扬","蒋长扬真的好尊重女性啊","我来看护驾哥蒋长扬了！","拥有 BGM 的蒋长扬真的帅","新年入坑第一人 蒋长扬","get 到李现了 真的好喜欢蒋长扬","我要去刷李现其他的剧了","李现蒋长扬完美打进古装赛道了","蒋长扬真绝 李现可以接个权谋不"," 李现演的蒋长扬太帅啦"," 大家不要放过这个蒋长扬"," 是谁发明的蒋长扬"," 真的很吃这种人设扮猪吃老虎的感觉 现子太会演了"," Fashion 大唐，就看李现蒋长扬！"," 蒋长扬你知道的 我从郭得友就跟着你的"," 蒋长扬这眼神太深情了"," 李现蒋长扬一人更比众人强，头头是道巧如簧！"," 李现蒋长扬开局祖天师，竟是花鸟使！"," 五颜六色蒋长扬，不愧是大唐穿搭博主"," 夜夜欢宴也不耽误蒋长扬搞投资，花鸟使脑子就是灵光"," 蒋长扬一秒变脸我真的吓到了 李现演技真的太好了"," 蒋长扬心疼的眼神，真的感受到演技"," 蒋长扬一个眼神一句台词，都非常有魅力"," 蒋长扬作为骚浪贱萌的典型，你太成功了！"," 蒋长扬真的安全感满满"," 蒋长扬，一分纨绔演十分，十分真心演一分"," 老师，不要放过这个贱萌贱萌的花孔雀蒋长扬啊"," 谁懂蒋长扬浪荡纨绔背后的忠义纯真？新年第一爆哭！"," 蒋长扬，世人皆骂你为大佞臣！但谁又知你的怀瑾握瑜，君子如珩"," 蒋长扬一出场，剧情都轻快活泼了"," 谁懂蒋长扬暗自保护妇孺，为国忠义，这贪得好啊🙀"," 李现把蒋长扬贱萌贱萌的孔雀演得劲儿劲儿的恰到好处"," 蒋长扬劲儿劲儿的表情太绝了，李现演技 UPUP"," 长扬随风，而身世浮沉。蒋长扬你到底在隐藏什么呢"," 看了蒋长扬，天天美扬扬，心里乐洋洋"," 太好了，是花鸟使蒋长扬，我们终于是富贵人家了，美洋洋有钱花"," 天天都在听蒋长扬护驾，蒋君什么时候护我一下"," 李现演技也太好了吧，可太喜欢蒋长扬这种劲劲又欠欠的感觉了"," 李现演技已经是 next level 了，蒋长扬又一经典角色"," 勉励 好喜欢五颜六色的蒋长扬"," 蒋长扬就是一只骄傲的花孔雀"," 李现的蒋长扬真是帅啊，喜欢喜欢"," 桃花朵朵 没想到李现古装这么帅气"," 太喜欢李现蒋长扬这个花鸟使啦"," 已被李现蒋长扬迷住，太好玩了"," 李现蒋长扬一出场剧情就有意思啦！"," 李现演技这么好啊！"," 李现的身姿绝了，真像古代玉树临风风流倜傥的富家公子"," 每天就盼着花鸟使蒋长扬出场"," 李现你还要带来多少惊喜"," 只有李现能演绎出风流倜傥纨绔不羁的富家公子"," 桃花朵朵 李现演的花鸟使蒋长扬到底是干啥的"," 李现蒋长扬出场排场真大啊！"," 李现出场的画面让国色芳华更加有质感"," 蒋长扬好像有两副面孔"," 雅冠长安蒋长扬！李现演绎的很到位！"," 李现蒋长扬痞帅痞帅的"," 看了李现蒋长扬那个护驾来的"," 护驾护驾，都来给蒋长扬护驾"," 蒋长扬风流起来蛊惑味儿十足啊"," 风流倜傥纨绔不羁的富家公子蒋长扬在李现身上具象化了"," 蒋长扬的衣服这么多啊！像个花孔雀"," 一天天的，被蒋长扬笑死了"," 蒋长扬，你让我演一集贪官"," 蒋长扬空车出行，必要满载而归"," 李现蒋长扬变脸那个真吓到我了"," 蒋长扬能不能借给我一天，太帅了"," 来看蒋长扬了，上一次等更新追剧还是去有风的地方"," 跟着天使投资人蒋长扬 不愁没钱花～"," 蒋长扬斜躺在卧榻上和小鱼说话的时候，我能感觉出来他的孤独和善良"," 李现把蒋长扬演得太灵动啦"," 蒋长扬原来是这么贱兮兮的啊！"," 李现这一世终于不用借钱过日子了，蒋长扬简直富可敌国。"," 蒋长扬让我心动"," 风流倜傥蒋长扬"," 李现把蒋长扬演活了，不管是眼神还是动作都很到位，不愧是李现"," 追蒋长扬的间隙顺便看了李现另一部群星闪耀时，李现真的演什么像什么"," 每天心心念念蒋长扬，太让人有念想了"," 啊啊啊啊，李现怎么这么会演啊，好细节！蒋长扬一出场我就姨母笑，😄"," 蒋长扬似暖阳"," 原来 李现演技这么好啊！一点也不油腻"," 之前李现的剧都没上桌，这次被蒋长扬吸引来了"," 好想穿越到大唐找蒋长扬玩耍"," 好喜欢蒋长扬啊傲娇可爱，李现好会演"," 贱不喽嗖外浪内纯蒋长扬太招人喜欢了"," 蒋长扬一出场，必是高光"," 蒋长扬真的是只骄傲的花孔雀啊，走路都是昂着头的"," 女主成长路上永远有蒋长扬托底！"," 不随意施舍同情其实是最大的尊重，这才是蒋长扬，李现这样的处理更显高级"," 李现一出场就特别让人着迷！"," 李现的小表情劲劲的，好喜欢"," 蒋长扬尊重欣赏女主，让她自己应对困境，只是在身后默默支持，该出手时才出手"," 蒋长扬对女性真的发自内心的尊重，真是顶顶好的人。"," 蒋长扬就是我们人生中的贵人"," 蒋长扬的眼神戏变化很绝，表演层层递进，演技越来越好"," 这剧的服化道太用心了，蒋长扬简直行走的衣架子！"," 蒋长扬搞钱能不能带带我，发现你搞钱思路好多"," 我发现蒋长扬一点也不恋爱脑啊，搞钱第一位"," 我发现蒋长扬一点我不恋爱脑啊，搞钱第一位"," 花孔雀蒋长扬每天生活太让人羡慕了，我也想被夸夸"," 除了蒋长扬还有难能逗我笑"," 蒋长扬  号暗卫已就位"," 蒋长扬皖夫人来也～"," 蒋郎君很上头啊 直接给我硬控住"," 李现古装扮相太好看了"," 看多了高冷男主，蒋长扬这样又骚又贱的真稀罕呢！"," 花花孔雀蒋长扬，风流倜傥美名扬"," 李现除了蒋长扬这个角色好玩，还有其他什么类似角色吗？"," 李现演的蒋长扬真的有那味道 贱萌贱萌的 下班回来就追心情都好了哈哈哈"," 生活很苦逼，只想看逗比蒋长扬开心"," 李现这个蒋长扬真的又爱又恨，为啥我得不到他"," 蒋长扬是真正懂女主的人"," 蒋长扬又让我爱上了李现"," 被韩商言迷的上头，被蒋长扬勾成了翘嘴"," 知道李现的现代装帅，第一次看蒋长扬一个古装男也能这么潇洒飘逸，不愧是现男友"," 我看网上都是李现蒋长扬护驾护驾，把我吸引来了"," 蒋长扬外浪内纯，好喜欢他啊！"," 我还沉浸在小镇青年谢之遥，没想到李现已经穿越唐朝花鸟使蒋长扬了"," 护驾先锋来啦，我来给蒋长扬扛大旗"," 是谁发明了蒋长扬这个小可爱，当然是李现啊！"," 蒋长扬一出场就让人挪不开眼，我要去给他护驾！"," 谁说李现古装不好看的 ？这可太好看了 ！蒋长扬给他演出味来了啊！！"," 蒋长扬贪名满天下，清正心间藏"," 最近的快乐源泉是蒋长扬带给我的，爱死了这种劲劲的男主，李现多演爱看"," 就喜欢看有蒋长扬的剧情，好喜欢他呀"," 听说蒋长扬还有英文名叫 Jungle，太逗了哈哈哈哈哈哈哈"," 就盼着蒋长扬出场了，太有看头了"," 蒋长扬的性格深沉内敛又不失风流倜傥，真是让人着迷。"," 最喜欢的现偶有李现韩商言，最喜欢的古装有李现蒋长扬"," 蒋长扬的小娇娘 蒋长扬就是我们梦中情郎"," 娱乐是个圈兜兜转转李现还是我的天！！！！！"," 蒋长扬真的太好，表面吊儿郎当，可是心却很软"," 李现的眼睛会说话"," 怎么破每天上蹿下跳各个角落找蒋长扬的边角料，已经重新看的第三遍啦！！！"," 蒋长扬真的太迷人了，果真人总会反复爱上李现。"," 蒋长扬的日子过得真舒服，能不能给我演  分钟。"," 放开那个侍女，让我来给蒋长扬捏肩捶腿！"," 每集只想看蒋长扬，蒋长扬出来可太欢乐了，谁懂？"," 蒋长扬才是有大爱的人，不只尊重欣赏女主，也尊重欣赏剧中所有独立自强的女性"," 看似纨绔不羁，实则隐藏锋芒，这样白切黑的角色，李现怎么这么会演啊！"," 李现是不是偷偷的去进修班了演技越来越精湛了，把花鸟使蒋长扬的放荡不羁，纨绔","痞帅演绎的太好了"," 李现对不起，我爱上蒋长扬了"," 蒋长扬这吊吊歪歪的小劲儿太上头了"," 蒋长扬 雅冠长安风流倜傥，李现演的还挺有韵味"," 李现出场都是高光，一秒都不能错过"," 蒋长扬全剧搞笑担当，每天就等蒋长扬出场"," 蒋长扬，咱就是说花鸟使也不能闯这么大祸吧"," 李现把蒋长扬塑造得太好了"," 李现蒋长扬把我迷得神魂颠倒"," 李现演的蒋长扬让我上瘾"," 李现古装打破了我的刻板印象，蒋长扬演得好有意思"," 天天抓心挠肝等蒋长扬出场"," 蒋长扬离了你谁还能逗我笑"," 每天就等蒋长扬出场，太欢乐了"," 蒋长扬你到底在隐藏什么"," 蒋长扬一出场，我就知道乐子要来了"," 蒋君太帅了！一颦一笑，言行举止，我都好爱啊～李现演技绝绝子"," 蒋长扬就是我追国色芳华的快乐"," 李现演得蒋长扬不是传统那种帅气，是一种气场和灵动的帅！"," 白天从头看，晚上跟着看～喝着百事可乐，简直不要太欢乐！"," 蒋长扬是最懂牡丹的人"," 每天一睁一闭全是蒋长扬护驾，哈哈哈哈哈哈哈"," 没想到李现还有轻喜剧天赋！蒋长扬的浪我喜欢！"," 李现的演技去油又丝滑，完美贴合蒋长扬"," get 到了蒋长扬，李现好会"," 蒋长扬外浪内纯，风流倜傥，表面是个贪官，其实内里谋划，为国为民"," 谁懂，李现蒋长扬演得那叫一个绝啊"," 李现蒋长扬那小眼神儿，真的能迷亖人了"," 李现在剧里是用身体的姿态、气度、说话的语气节奏来表现那个时代富贵窝里长大的","纨绔风貌，演技了得"," 是谁发明的李现蒋长扬这种演戏天才进入中国！"," 蒋长扬看得我想去给他挖野菜了"," 李现把蒋长扬这个角色塑造的活灵活现"," 蒋长扬是腹黑型的，蔫坏的，我好喜欢"," 每日一喊护驾！国色芳华的制作很用心，蒋长扬这个角色很鲜活！家人们护驾！一起","来看国色芳华！"," 天天满脑子的护驾，蒋长扬都刻在我脑子里了"," 蒋长扬伸懒腰真是骚浪，我好喜欢"," 李现饰演蒋长扬，外浪内纯美名扬"," 蒋长扬，美扬扬"," 穿搭博主蒋长扬"," 蒋长扬可会演了，想多看点蒋长扬"," 唉呀，蒋长扬这一款可杀我了，爱亖啰"," 李现蒋长扬就是天选之子！翩翩君子文武双全，这谁能不爱！看就完了！！"," 李现蒋长扬演出了爱人的最高境界是心疼"," 蒋长扬是假油腻真松弛、假贪恶真精明"," 蒋长扬是假臭名真纯澈、假奸佞真赤子"," 蒋长扬见人说人话见鬼说鬼话 ，吊儿郎当的"," 蒋长扬表面上是情场高手，实际上被摸下手都能震惊半天的纯爱天花板"," 蒋长扬万花丛中过，片叶不沾身"," 蒋长扬的眼神有浪却没欲，风流不下流"," 我看出来蒋长扬在演却依然猜不透啊"," 我走我的路 属实没想到，这部剧快乐是蒋长扬这“大贪”给的"];
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