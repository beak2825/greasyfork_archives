// ==UserScript==
// @name         mxz_crawler
// @namespace    www.cber.ltd
// @version      0.2.2
// @description  B站评论区原神玩家纯度检测
// @author       Tom
// @match        https://www.bilibili.com/video/*
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://www.bilibili.com/read/*
// @match        https://www.bilibili.com/opus/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @connect      fastly.jsdelivr.net
// @connect      raw.githubusercontent.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/496204/mxz_crawler.user.js
// @updateURL https://update.greasyfork.org/scripts/496204/mxz_crawler.meta.js
// ==/UserScript==

// TODO: 如果已经有相同的人在不同的地方留言，应该直接给他加上level: DONE
// TODO: 如何解决验证的问题？调低每个人需要的动态数量？ : DONE
// TODO: 取名！发帖！
// TODO: 翻页有bug，在一个评论区下翻页无法显示新的: DONE
// TODO: 加入缓存机制？ 存在 localStorage 里？ user-id: level, timestamp (设置30天): DONE
// TODO: 仙的tag？
// TODO: 在个人空间主页分析？更加详细的分析？在评论区粗略分析？
// TODO: 结合关注列表进行分析？看过的主播？


// TODO: 转发仙列表？
// TODO: 在菜单栏中增加一个选项让用户跳转到动态页面进行验证码输入

var thread_number = 0;
let mxz_tags = ["原神", "原宝", "崩坏", "星铁", "星穹铁道", "米哈游", "芙芙", "提瓦特", "旅行者", "派蒙", "稻妻", "枫丹", "蒙德", "璃月", "尘歌壶",
    "mhy", "绝区零", "散宝", "魈宝"];

let xianLists = [];  // 仙uid
let xianFavList = [];  // 反仙？uid
let wordLists = [];  // 仙关键词
const xian_word_weights = [3, 6, 9];

function filterWordList(original_list) {
    const filter_map = new Map([
        ["仙(家|庭|帝|友|丹)", "仙(庭|帝|友)"],
        ["镀金旅团", ""],
        ["(百分百|100%)参团", ""],
        ["地心游记", ""],
        ["小麦地", ""],
        ["舫", ""],
        ["米哈[^游基哟]", ""],
        ["@.{0,8}?(毁灭|虚无|爱莉希雅|纳西妲|QM|芝士是猫)", ""],
        ["枘凿六合", ""],
        ["硬核不媚", ""],
        ["尾气厂", ""],
        ["(?=.*米哈[^游])(?=.*(尾气|抄))", ""],
        ["赛博(以色列|犹太|贞操)", ""],
        ["散去吧", ""],
        ["不死孽物", ""],
        ["孽物不除", ""],
        ["巡猎不休", ""],
        ["我也玩.{0,10}?我也喜欢", ""],
        ["以此烈火", ""],
        ["斩无不断", ""],
        ["/(?=.*(海拉|点燃|火把|任天堂|任豚|王国|之泪|吸))(?=.*瘴)/", "/(?=.*(任天堂|任豚))(?=.*瘴)/"],
        ["先驱.{0,4}?(春|夏|秋|冬|梗|爱|派蒙|攻略|农|茶话)", ""],
        ["仙舟.{0,2}?(吃瓜|幼儿园)", ""],
        ["(不是|是不)好惹", ""],
        ["(门|🚪)(酱|🐖)", ""],
        ["悲.*?(铁道|崩铁|星铁).*?[五5]天", ""]
    ]);

    return original_list.reduce((result, item) => {
        if (filter_map.has(item)) {
            const value = filter_map.get(item);
            if (value === "") {
                // If the value is an empty string, skip this item
                return result;
            } else {
                // If the value is not empty, replace the item with the value
                result.push(value);
            }
        } else {
            // If the item is not in the filter_map, keep it as is
            result.push(item);
        }
        return result;
    }, []);
}


const urlSourceDic = {
    githubusercontent: "https://raw.githubusercontent.com/Darknights1750/XianLists/main/xianLists.json",
    jsdelivr: "https://fastly.jsdelivr.net/gh/Darknights1750/XianLists@main/xianLists.json"
}
const getXianListOnline = function () {
    return new Promise(resolve => {
        GM_xmlhttpRequest({
            method: "GET",
            url: urlSourceDic[GM_getValue("urlSource", "jsdelivr")],
            data: '',
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
            },
            onload: res => {
                if (res.status === 200) {
                    resolve(JSON.parse(res.responseText));
                } else {
                    resolve(JSON.parse('{"xianList":[],"xianFavList":[],"wordLv1List":[],"wordLv2List":[],"wordLv3List":[]}'));
                }
            }
        });
    });
}

const fillLists = async function () {
    let json = await getXianListOnline();
    xianLists = [
        json.xianList,
        json.xianLv1List,
        json.xianLv2List,
        json.xianLv3List
    ];
    xianLists = xianLists.map(lst => new Set(lst));
    xianFavList = new Set(json.xianFavList);
    wordLists = [
        filterWordList(json.wordLv1List).map((item) => new RegExp(item)),
        filterWordList(json.wordLv2List).map((item) => new RegExp(item)),
        filterWordList(json.wordLv3List).map((item) => new RegExp(item))
    ];
    let xianLeakList = json.xianLeakList.map((item) => new RegExp(item));
    wordLists[2] = [...wordLists[2], ...xianLeakList];
    mxz_tags = mxz_tags.map((item) => new RegExp(item))
}

function xianListLevel(uid) {
    for (let i = xianLists.length - 1; i >= 0; i--) {
        if (xianLists[i].has(uid)) return i;
    }
    return -1;
}


// 从一个 object 中提取出所有含有汉字的字符串, 合并为一个String返回
function extractAndCombineStringsWithChineseFromObject(obj) {
    let strings = [];
    const chineseCharPattern = /[\u4e00-\u9fa5]/;

    function recurse(currentObj) {
        if (typeof currentObj === 'string' && chineseCharPattern.test(currentObj)) {
            strings.push(currentObj);
        } else if (typeof currentObj === 'object' && currentObj !== null) {
            for (let key in currentObj) {
                if (Object.hasOwn(currentObj, key)) {
                    recurse(currentObj[key]);
                }
            }
        }
    }

    recurse(obj);
    return strings.join('');
}

function getRandomUserAgent() {
    let userAgent = [
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) EdgiOS/121.0.2277.107 Version/17.0 Mobile/15E148 Safari/604.1\n",
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36 EdgA/121.0.0.0",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1 OPX/2.1.0"
    ];
    let randomIndex = Math.floor(Math.random() * userAgent.length);
    return userAgent[randomIndex];
}

function getWeightByTime(ts) {
    let date1 = new Date(ts*1000);
    let date2 = new Date(Date.now())

    let year1 = date1.getFullYear();
    let month1 = date1.getMonth();

    let year2 = date2.getFullYear();
    let month2 = date2.getMonth();

    // 计算年份和月份的差值
    let month_diff = (year2 - year1) * 12 + (month2 - month1);

    // 每 4 个月，权重减少 0.1
    return Math.max(0, 1 - Math.floor(month_diff / 4) * 0.1)
}



// 计算关键词出现次数
function getKeywordCount(items) {
    const checkIfKeywordsInText = (text, keywords) => {
        for (let regex of keywords) {
            if (regex.test(text)) return 1;
        }
        return 0;
    }

    let count = 0;
    // 将 content 转换为字符串
    for (let item of items) {  // 每个 item 是一个动态
        let text = extractAndCombineStringsWithChineseFromObject(item);
        let pub_ts = item.modules.module_author.pub_ts;
        let time_weight = getWeightByTime(pub_ts);

        let word_weight = 0;
        for (let xian_level = 2; xian_level >= 0; xian_level--) {
            if (checkIfKeywordsInText(text, wordLists[xian_level])) {
                console.log(`存在仙关键词，等级为 ${xian_level+1}, 文字为 ${text}`);
                word_weight = xian_word_weights[xian_level];
                break;
            }
        }

        if (word_weight === 0) word_weight = checkIfKeywordsInText(text, mxz_tags);
        if (word_weight > 1) time_weight = 1;  // 如果有仙相关的关键词，不会随时间权重衰减

        count += time_weight * word_weight;
    }
    return count;
}

// 随机延迟函数
function randomDelay(minDelay, maxDelay) {
    return new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay));
}

function get_uid(html) {
    let userId = null;

    // 尝试通过 dataset.userId 获取 userId
    try {
        userId = html.dataset.userId;
        if (userId) {
            return userId;
        }
    } catch (error) {}

    // 尝试通过 children[0].href 获取 userId
    try {
        userId = html.children[0].href.replace(/[^\d]/g, "");
        if (userId) {
            return userId;
        }
    } catch (error) {}

    // 尝试通过 window.location.href 获取 userId
    try {
        const match = window.location.href.match(/(?<=space\.bilibili\.com\/)\d+/);
        if (match) {
            userId = match[0];
            return userId;
        }
    } catch (error) {}

    return null;
}

function get_comment_list() {
    return Array.from(document.querySelectorAll(".user-name,.sub-user-name,.user"));
}

async function readCommentListHtml(current_thread_number) {
    console.log(`starting crawling...`);
    const is_new = document.getElementsByClassName('fixed-header').length !== 0;

    let comment_list = get_comment_list();
    console.log("comment_list.length = " + comment_list.length);
    if (comment_list.length !== 0) {
        for (let html of comment_list) {
            if (current_thread_number !== thread_number) break;
            await updateUserHtml(html, current_thread_number, true);
        }
        for (let html of comment_list) {
            if (current_thread_number !== thread_number) break;
            await updateUserHtml(html, current_thread_number, false);
        }
    }
}

// 分析 mxz 纯度
function analyze(count, total_count) {
    count = Math.floor(count);
    const tags = [
        "LV.0",
        "LV.1",
        "LV.2",
        "LV.3",
        "LV.4",
        "LV.5",
        "LV.6",
        "LV.7",
        "LV.8",
        "LV.9",
        "LV.10",
        "LV.11",
        "LV.12",
        "LV.13",
        "LV.14",
        "LV.15",
        "LV.16",
        "LV.17",
        "LV.18",
    ]

    let level = 0;
    if (count <= 4) return [count, tags[count]];
    if (count >= 6) level = 5;
    if (count >= 8) level = 6;
    if (count >= 10) level = 7;
    if (count >= 13) level = 8;
    if (count >= 16) level = 9;
    if (count >= 20) level = 10;
    if (count >= 25) level = 11;
    if (count >= 30) level = 12;
    if (count >= 40) level = 13;
    if (count >= 55) level = 14;
    if (count >= 70) level = 15;
    if (count >= 100) level = 16;
    if (count >= 150) level = 17;
    if (count >= 200) level = 18;
    return [level, tags[level]];
}

function getColorFromLevel(level) {
    if (level <= 4) return "rgb(84,93,101)";
    if (level <= 8) return "rgb(94,228,65)";
    if (level <= 12) return "rgb(28,71,209)";
    if (level <= 15) return "rgb(156,7,234)";
    return "rgb(243,137,6)";
}


function updateHtmlWithCount(html, count, total_count) {
    let [level, tag] = analyze(count, total_count);
    const applyStyles = (element, tag, level) => {
        element.innerHTML = tag;
        element.style.color = getColorFromLevel(level);
        element.style.fontWeight = '900';  // 设置字体加粗
        element.style.fontSize = '120%';   // 设置字体字号为原先的120%
    };

    let existingB = html.querySelector('b.analyze-result');
    if (existingB) {
        applyStyles(existingB, tag, level);
    } else {
        let newB = document.createElement('b');
        newB.className = 'analyze-result';
        applyStyles(newB, tag, level);
        html.appendChild(newB);
    }
}

async function updateUserHtml(html, current_thread_number, load_local_only) {
    let existingB = html.querySelector('b.analyze-result');
    if (existingB && existingB.classList.contains('analyze-done')) return;  // 如果这个元素已经被分析过了

    let uid = get_uid(html);
    if (!uid) return;
    const headers = {
        'authority': 'api.bilibili.com',
        'method': 'GET',
        'path': `/x/polymer/web-dynamic/v1/feed/space?offset=&host_mid=${uid}&timezone_offset=420&platform=web&features=itemOpusStyle,listOnlyfans,opusBigCover,onlyfansVote&web_location=333.999`,
        'scheme': 'https',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://space.bilibili.com',
        'Priority': 'u=1, i',
        'Referer': `https://space.bilibili.com/${uid}/dynamic`,
        'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent': getRandomUserAgent()
    };

    const localStorageKey = 'uidData';
    let uidDataMap = GM_getValue(localStorageKey, {}) || {};
    let currentData = uidDataMap[uid];
    let now = Date.now();
    let DAY30 = 30 * 24 * 60 * 60 * 1000;

    if (currentData && now - currentData.updated_timestamp < DAY30) {
        // 使用 Tampermonkey 存储的数据
        let count = currentData["count"];
        let total_count = currentData["total_count"]
        updateHtmlWithCount(html, count, total_count);
    } else if (!load_local_only) {
        let count = 0, offset = "", has_more = true, total_count = 0, last_ts = Math.floor(Date.now() / 1000);
        // 如果本身在仙list上，那么将会直接
        let xian_level = xianListLevel(uid);
        if (xian_level === 0) count = 100;
        if (xian_level === 1) count = 125;
        if (xian_level === 2) count = 150;
        if (xian_level === 3) count = 200;

        var minDelay = 600, maxDelay = 1400;
        while (has_more && total_count <= 12*12 && count <= 200 && current_thread_number === thread_number && getWeightByTime(last_ts) > 0) {
            const url = `https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?offset=${offset}&host_mid=${uid}&platform=web&features=itemOpusStyle,listOnlyfans,opusBigCover,onlyfansVote&web_location=333.999`;
            await randomDelay(minDelay, maxDelay);
            await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers: headers,
                    onload: function (res) {
                        if (res.status === 200) {
                            let data = JSON.parse(res.response);
                            if (data.code === 0) {
                                count += getKeywordCount(data.data.items, mxz_tags);
                                total_count += data.data.items.length;
                                has_more = data.data.has_more;
                                offset = data.data.offset;
                                if (data.data.items.length > 0) last_ts = data.data.items[data.data.items.length - 1].modules.module_author.pub_ts;

                                console.log(`uid = ${uid}, count = ${count}, total_count = ${total_count}, thread_number = ${current_thread_number}`);
                                updateHtmlWithCount(html, count, total_count);
                            } else {
                                console.log(`Request success with status 200, but code is ${data.code}, minDelay = ${minDelay}, maxDelay = ${maxDelay}`);
                                // minDelay *= 2;
                                // maxDelay *= 2;
                            }
                        } else {
                            console.log(`Request failed: ${res.status} ${res.statusText}`);
                        }
                        resolve(1);
                    },
                    onerror: function (error) {
                        console.error(error);
                        reject(error);
                    }
                });
            });
        }
        uidDataMap[uid] = { "updated_timestamp": now, "count": Math.floor(count), "total_count": total_count };
        GM_setValue(localStorageKey, uidDataMap);
    }
    existingB = html.querySelector('b.analyze-result');
    if (existingB) existingB.classList.add('analyze-done');  // 这个元素已经被分析过了
}

async function computeHash(str) {
    const buffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// main function
(async function () {
    let isTesting = false;

    // 当前脚本版本号，通过 GM_info 读取 @version
    const currentVersion = GM_info.script.version;
    const storedVersion = GM_getValue('scriptVersion', ''); // 获取之前存储的版本号
    if (isTesting || currentVersion !== storedVersion) {
        // 如果版本号不同，说明安装了新版本
        console.log('Deleting local data...');
        // 删除存储的数据
        GM_deleteValue('uidData');
        // 更新存储的版本号为当前版本号
        GM_setValue('scriptVersion', currentVersion);
    }

    await fillLists();
    let lastCommentListSize = 0;
    let counter = 0;
    let lastCommentListHash = "";

    setInterval(async () => {
        const commentList = get_comment_list();
        const currentSize = commentList.size;
        counter++;

        const extractUserIds = (commentList) => {
            return Array.from(commentList).map(div => get_uid(div));
        }

        const userIds = extractUserIds(commentList);
        const commentListString = JSON.stringify(userIds);
        const commentListHash = await computeHash(commentListString);

        // console.log(`hash = ${commentListHash}, lasthash = ${lastCommentListHash}`);

        if (currentSize !== lastCommentListSize || lastCommentListHash !== commentListHash) {
            lastCommentListSize = currentSize;
            thread_number++;
            readCommentListHtml(thread_number);
        }
        lastCommentListHash = commentListHash;
    }, 4000);
})();
