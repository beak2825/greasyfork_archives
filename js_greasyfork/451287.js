// ==UserScript==
// @name         指示器 Ultra
// @name:en     Indicator Ultra
// @namespace IndicatorUltra
// @version      0.64
// @author       KurisuCat
// @license      MIT
// @description  细分，原版：https://greasyfork.org/zh-CN/scripts/450720-原神玩家指示器
// @description:en Improve script, origional script: https://greasyfork.org/zh-CN/scripts/450720-原神玩家指示器
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/read/*
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/451287/%E6%8C%87%E7%A4%BA%E5%99%A8%20Ultra.user.js
// @updateURL https://update.greasyfork.org/scripts/451287/%E6%8C%87%E7%A4%BA%E5%99%A8%20Ultra.meta.js
// ==/UserScript==

$(function () {
    // 在这里配置要检查的成分
    const checkers = [
        {
            displayName: "原批",
            displayIcon:
                "https://i2.hdslb.com/bfs/face/d2a95376140fb1e5efbcbed70ef62891a3e5284f.jpg@240w_240h_1c_1s.jpg",
            keywords: [
                "互动抽奖 #原神",
                "米哈游",
                "#米哈游#",
                "#miHoYo#",
                "原神",
            ],
            followings: [401742377], // 原神官方号的 UID
        },
        {
            displayName: "农批",
            displayIcon:
                "https://i2.hdslb.com/bfs/face/effbafff589a27f02148d15bca7e97031a31d772.jpg@240w_240h_1c_1s.jpg",
            keywords: ["互动抽奖 #王者荣耀", "王者荣耀"],
        },
        {
            displayName: "粥批",
            displayIcon:
                "https://i0.hdslb.com/bfs/face/89154378c06a5ed332c40c2ca56f50cd641c0c90.jpg@240w_240h_1c_1s.jpg",
            keywords: ["互动抽奖 #明日方舟", "明日方舟", "博士"],
            followings: [161775300],
        },
        {
            displayName: "一个魂",
            displayIcon:
                "https://i2.hdslb.com/bfs/face/43b21998da8e7e210340333f46d4e2ae7ec046eb.jpg@240w_240h_1c_1s.jpg",
            keywords: [
                "想到晚的瞬间",
                "晚晚",
                "嘉晚饭",
                "乃贝",
                "贝极星空间站",
                "乃琳夸夸群",
                "乃宝",
                "嘉心糖的手账本",
                "嘉心糖",
                "拉姐",
                "然然",
                "asoul",
                "A-SOUL",
                "珈乐"
            ],
            followings: [
                703007996, 672342685, 672328094, 672353429, 672346917,
                351609538,
            ],
        },
        {
            displayName: "顶晚人",
            displayIcon:
                "https://i0.hdslb.com/bfs/face/566078c52b408571d8ae5e3bcdf57b2283024c27.jpg@240w_240h_1c_1s.jpg",
            keywords: [
                "想到晚的瞬间",
                "晚晚",
                "向晚",
            ],
            followings: [672346917],
        },
        {
            displayName: "嘉心糖",
            displayIcon:
                "https://i2.hdslb.com/bfs/face/d399d6f5cf7943a996ae96999ba3e6ae2a2988de.jpg@240w_240h_1c_1s.jpg",
            keywords: [
                "然然",
                "嘉然",
            ],
            followings: [672328094],
        }, {
            displayName: "贝极星",
            displayIcon:
                "https://i1.hdslb.com/bfs/face/668af440f8a8065743d3fa79cfa8f017905d0065.jpg@240w_240h_1c_1s.jpg",
            keywords: [
                "贝拉",
            ],
            followings: [672353429],
        }, {
            displayName: "音乐珈",
            displayIcon:
                "https://i2.hdslb.com/bfs/face/a7fea00016a8d3ffb015b6ed8647cc3ed89cbc63.jpg@240w_240h_1c_1s.jpg",
            keywords: ["珈乐"],
            followings: [351609538, 33605910],
        }, {
            displayName: "奶淇琳",
            displayIcon:
                "https://i0.hdslb.com/bfs/face/8895c87082beba1355ea4bc7f91f2786ef49e354.jpg@240w_240h_1c_1s.jpg",
            keywords: ["珈乐"],
            followings: [672342685],
        },
        {
            displayName: "四畜",
            displayIcon:
                "https://i2.hdslb.com/bfs/face/27258e94f32b724821ee16c4d020fa7b2042d489.jpg@240w_240h_1c_1s.jpg",
            keywords: [
                "茶香四溢",
                "9分美女",
                "三畜",
                "野狗",
                "3畜",
                "谭德安",
                "孤珈者",
                "一等骑士",
                "谭女士",
                "🍵",
            ],
            followings: [1529814632],
        },
        {
            displayName: "三畜",
            displayIcon:
                "https://i2.hdslb.com/bfs/face/26ad353c5dfa2319417e5bac84f876b9bd1b54a6.jpg@240w_240h_1c_1s.jpg",
            keywords: ["小狗说", "三宝", "3宝"],
            followings: [33605910],
        },
        {
            displayName: "雏草姬",
            displayIcon:
                "https://i1.hdslb.com/bfs/face/4907464999fbf2f2a6f9cc8b7352fceb6b3bfec3.jpg@240w_240h_1c_1s.jpg",
            keywords: ["塔菲", "谢谢喵", "永雏塔菲", "塔盾", "taffy", "雏草姬"],
            followings: [1265680561],
        },
        {
            displayName: "棺人痴",
            displayIcon:
                "https://i0.hdslb.com/bfs/face/ced15dc126348dc42bd5c8eefdd1de5e48bdd8e6.jpg@240w_240h_1c_1s.jpg",
            keywords: ["東雪蓮Official", "東雪蓮", "东雪莲", "莲宝"],
            followings: [1437582453],
        },
        {
            displayName: "瞳星结",
            displayIcon:
                "https://i0.hdslb.com/bfs/face/6be92dec2240b0593a40d2c696b37aa75c704ff6.jpg@240w_240h_1c_1s.jpg",
            keywords: ["星瞳", "小星星"],
            followings: [401315430],
        },
        {
            displayName: "EOES",
            displayIcon:
                "https://i0.hdslb.com/bfs/face/f0ac506bbfa4e4ce09729d424d28d2383e721ade.jpg@240w_240h_1c_1s.jpg",
            keywords: ["虞莫", "柚恩", "露早", "莞儿", "米诺", "EOE", "莞莞"],
            followings: [2018113152],
        },
        {
            displayName: "美人虞",
            displayIcon:
                "https://i1.hdslb.com/bfs/face/e53feb6058843bbddd7c6db935522e1b53e12bf3.jpg@240w_240h_1c_1s.jpg",
            keywords: ["虞莫"],
            followings: [1811071010],
        },
        {
            displayName: "柚恩蜜",
            displayIcon:
                "https://i0.hdslb.com/bfs/face/388bb9976a9957aa9370e153e43b60111ef7ae1f.jpg@240w_240h_1c_1s.jpg",
            keywords: ["柚恩"],
            followings: [1795147802],
        },
        {
            displayName: "GOGO队",
            displayIcon:
                "https://i2.hdslb.com/bfs/face/5d699ce6f66ce4770092ba19fcf7caec82e8f736.jpg@240w_240h_1c_1s.jpg",
            keywords: ["露早"],
            followings: [1669777785],
        },
        {
            displayName: "小莞熊",
            displayIcon:
                "https://i2.hdslb.com/bfs/face/89e589306901549f2193e505fb14d4cfc9d106d8.jpg@240w_240h_1c_1s.jpg",
            keywords: ["莞儿", "莞莞"],
            followings: [1875044092],
        },
        {
            displayName: "酷诺米",
            displayIcon:
                "https://i0.hdslb.com/bfs/face/3da6145e81745cabd1f79b9c61772f884e783b7e.jpg@240w_240h_1c_1s.jpg",
            keywords: ["米诺"],
            followings: [1778026586],
        },
        {
            displayName: "小孩梓",
            displayIcon:
                "https://i2.hdslb.com/bfs/face/ba9ce36ef60a53e24a97f54429e62bdb951530a0.jpg@240w_240h_1c_1s.jpg",
            keywords: ["阿梓从小就很可爱", "阿梓", "小孩梓"],
            followings: [7706705],
        },
        {
            displayName: "听枫者",
            displayIcon:
                "https://i1.hdslb.com/bfs/face/2f745d6ad1b703f9d972c6e628ad6bc5c756e94d.jpg@240w_240h_1c_1s.jpg",
            keywords: ["量子少年", "慕宇", "泽一", "祥太", "楚枫"],
            followings: [
                1895683714, 1535525542, 1461176910, 1757836012, 1230039261,
            ],
        },
        {
            displayName: "脆鲨",
            displayIcon:
                "https://i2.hdslb.com/bfs/face/254aedbf9dad0ed5e1117c2e435a6f36ed70c64d.jpg@240w_240h_1c_1s.jpg",
            keywords: ["脆鲨", "七海Nana7mi", "娜娜米", "七海"],
            followings: [434334701],
        },
    ];

    // 空间动态api
    const spaceApiUrl =
        "https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid=";
    const followingApiUrl =
        "https://api.bilibili.com/x/relation/followings?vmid=";

    const checked = {};
    const checking = {};
    var printed = false;

    // 监听用户ID元素出现
    waitForKeyElements(".user-name", installCheckButton);
    waitForKeyElements(".sub-user-name", installCheckButton);
    waitForKeyElements(".user .name", installCheckButton);

    //console.log("开启B站用户成分检查器...");

    // 添加检查按钮
    function installCheckButton(element) {
        let node =
            $(`<div style="display: inline;" class="composition-checkable"><div class="composition-badge">
  <a class="composition-name">🔍查成分</a>
</div></div>`);

        node.on("click", function () {
            node.find(".composition-name").text("检查中...");
            checkComposition(element, node.find(".composition-name"));
        });

        element.after(node);
    }

    // 添加标签
    function installComposition(id, element, setting) {
        let node =
            $(`<div style="display: inline;"><div class="composition-badge">
  <a class="composition-name">${setting.displayName}</a>
  <img src="${setting.displayIcon}" class="composition-icon">
</div></div>`);

        element.after(node);
    }

    // 检查标签
    function checkComposition(element, loadingElement) {
        // 用户ID
        let userID =
            element.attr("data-user-id") || element.attr("data-usercard-mid");
        // 用户名
        let name =
            element.text().charAt(0) == "@"
                ? element.text().substring(1)
                : element.text();

        if (checked[userID]) {
            // 已经缓存过了
            for (let setting of checked[userID]) {
                installComposition(userID, element, setting);
            }
        } else if (checking[userID] != undefined) {
            // 检查中
            if (checking[userID].indexOf(element) < 0)
                checking[userID].push(element);
        } else {
            checking[userID] = [element];

            // 获取最近动态
            GM_xmlhttpRequest({
                method: "get",
                url: spaceApiUrl + userID,
                data: "",
                headers: {
                    "user-agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
                },
                onload: (res) => {
                    if (res.status === 200) {
                        // 获取关注列表
                        GM_xmlhttpRequest({
                            method: "get",
                            url: followingApiUrl + userID,
                            data: "",
                            headers: {
                                "user-agent":
                                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
                            },
                            onload: (followingRes) => {
                                if (followingRes.status === 200) {
                                    // 解析关注列表
                                    let followingData = JSON.parse(
                                        followingRes.response
                                    );
                                    // 可能无权限
                                    let following =
                                        followingData.code == 0
                                            ? followingData.data.list.map(
                                                  (it) => it.mid
                                              )
                                            : [];

                                    // 解析并拼接动态数据
                                    let st = JSON.stringify(
                                        JSON.parse(res.response).data.items
                                    );

                                    // 找到的匹配内容
                                    let found = [];
                                    for (let setting of checkers) {
                                        // 检查动态内容
                                        if (setting.keywords)
                                            if (
                                                setting.keywords.find(
                                                    (keyword) =>
                                                        st.includes(keyword)
                                                )
                                            ) {
                                                if (found.indexOf(setting) < 0)
                                                    found.push(setting);
                                                continue;
                                            }

                                        // 检查关注列表
                                        if (setting.followings)
                                            for (let mid of setting.followings) {
                                                if (
                                                    following.indexOf(mid) >= 0
                                                ) {
                                                    if (
                                                        found.indexOf(setting) <
                                                        0
                                                    )
                                                        found.push(setting);
                                                    continue;
                                                }
                                            }
                                    }

                                    // 添加标签
                                    if (found.length > 0) {
                                        if (!printed) {
                                            // console.log(
                                            //     JSON.parse(res.response).data
                                            // );
                                            printed = true;
                                        }

                                        // 输出日志
                                        // console.log(
                                        //     `检测到 ${name} ${userID} 的成分为 `,
                                        //     found.map((it) => it.displayName)
                                        // );
                                        checked[userID] = found;

                                        // 给所有用到的地方添加标签
                                        for (let element of checking[userID]) {
                                            for (let setting of found) {
                                                installComposition(
                                                    userID,
                                                    element,
                                                    setting
                                                );
                                            }
                                        }
                                        loadingElement.parent().remove();
                                    } else {
                                        loadingElement.text("纯路人 / 没有获取到关注列表、动态列表");
                                    }
                                } else {
                                    // console.log(
                                    //     `检测 ${name} ${userID} 的关注列表失败`,
                                    //     followingRes
                                    // );

                                    loadingElement.text("没有获取到关注列表");
                                }

                                delete checking[userID];
                            },
                            onerror: (err) => {
                                // console.log(
                                //     `检测 ${name} ${userID} 的成分最近动态失败`,
                                //     err
                                // );

                                loadingElement.text("没有获取到动态列表");
                                delete checking[userID];
                            },
                        });
                    } else {
                        // console.log(`检测 ${name} ${userID} 的成分失败`, res);
                        loadingElement.text("没有获取到关注列表、动态列表");

                        delete checking[userID];
                    }
                },
                onerror: (err) => {
                    // console.log(`检测 ${name} ${userID} 的成分失败`, err);
                    loadingElement.text("发生错误");
                    delete checking[userID];
                },
            });
        }
    }

    // 添加标签样式
    addGlobalStyle(`
.composition-badge {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: fit-content;
    background: #00AEEC26;
    border-radius: 5px;
    margin: 1px 6px;
}
.composition-name {
    line-height: 13px;
    font-size: 13px;
    color: #00AEEC;
    padding: 5px 8px 4px 8px;
}
.composition-icon {
    width: 25px;
    height: 25px;
    border-radius: 15px;
    border: 2px solid white;
    margin: -6px 5px -6px -3px;
}
.reply-item .root-reply-container .content-warp .user-info {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
    flex-wrap: wrap!important;
}
.sub-reply-item .sub-user-info {
    display: inline-flex;
    align-items: center;
    margin-right: 9px;
    line-height: 24px;
    vertical-align: baseline;
    white-space: nowrap;
    flex-wrap: wrap!important;
}
    `);

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName("head")[0];
        if (!head) {
            return;
        }
        style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = css;
        head.appendChild(style);
    }

    /*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.
    Usage example:
        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );
        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }
    IMPORTANT: This function requires your script to have loaded jQuery.
    */
    function waitForKeyElements(
        selectorTxt,
        actionFunction,
        bWaitOnce,
        iframeSelector
    ) {
        var targetNodes, btargetsFound;

        if (typeof iframeSelector == "undefined") targetNodes = $(selectorTxt);
        else targetNodes = $(iframeSelector).contents().find(selectorTxt);

        if (targetNodes && targetNodes.length > 0) {
            btargetsFound = true;
            targetNodes.each(function () {
                var jThis = $(this);
                var alreadyFound = jThis.data("alreadyFound") || false;

                if (!alreadyFound) {
                    //--- Call the payload function.
                    var cancelFound = actionFunction(jThis);
                    if (cancelFound) btargetsFound = false;
                    else jThis.data("alreadyFound", true);
                }
            });
        } else {
            btargetsFound = false;
        }

        //--- Get the timer-control variable for this selector.
        var controlObj = waitForKeyElements.controlObj || {};
        var controlKey = selectorTxt.replace(/[^\w]/g, "_");
        var timeControl = controlObj[controlKey];

        //--- Now set or clear the timer as appropriate.
        if (btargetsFound && bWaitOnce && timeControl) {
            //--- The only condition where we need to clear the timer.
            clearInterval(timeControl);
            delete controlObj[controlKey];
        } else {
            //--- Set a timer, if needed.
            if (!timeControl) {
                timeControl = setInterval(function () {
                    waitForKeyElements(
                        selectorTxt,
                        actionFunction,
                        bWaitOnce,
                        iframeSelector
                    );
                }, 300);
                controlObj[controlKey] = timeControl;
            }
        }
        waitForKeyElements.controlObj = controlObj;
    }
});
