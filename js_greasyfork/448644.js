// ==UserScript==
// @name         BV2AV + 视频统计
// @description  支持 Safari | 干净 URL | 视频统计 | V 家成就
// @version      3.2.0
// @license      MIT
// @author       Joseph Chris <joseph@josephcz.xyz>
// @icon         https://www.bilibili.com/favicon.ico
// @namespace    https://github.com/baobao1270/util-scripts/blob/main/tampermonkey/bilibili-vcutils
// @homepageURL  https://github.com/baobao1270/util-scripts/blob/main/tampermonkey/bilibili-vcutils
// @supportURL   mailto:tampermonkey-support@josephcz.xyz
// @compatible   firefox
// @compatible   safari
// @compatible   chrome
// @compatible   edge
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/festival/*
// @match        *://www.bilibili.com/list/watchlater*
// @match        *://www.bilibili.com/list/ml*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/448644/BV2AV%20%2B%20%E8%A7%86%E9%A2%91%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/448644/BV2AV%20%2B%20%E8%A7%86%E9%A2%91%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==


const VCUtil = {
    ConfigFlags: {
        video:      { stdurl: true, stdurlAll: true, stat: true },
        festival:   { stdurl: true, stdurlAll: true, stat: true },
        watchlater: { stdurl: true, stdurlAll: true, stat: true },
        medialist:  { stdurl: true, stdurlAll: true, stat: true },
        timezoneSlotsCount: 3,
        timezoneSlotDefault: ['PVG', 'NRT', 'LAX'],
        tidVersionDefault: 'v1',
        tidShowDefault: false,
    },
};

VCUtil.Convert = {
    bv2av: function (bvid) {
        const XOR_CODE = 23442827791579n;
        const MASK_CODE = 2251799813685247n;
        const BASE = 58n;
        const data = 'FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf';

        const bvidArr = Array.from(bvid);
        [bvidArr[3], bvidArr[9]] = [bvidArr[9], bvidArr[3]];
        [bvidArr[4], bvidArr[7]] = [bvidArr[7], bvidArr[4]];
        bvidArr.splice(0, 3);
        const tmp = bvidArr.reduce((pre, bvidChar) => pre * BASE + BigInt(data.indexOf(bvidChar)), 0n);
        return Number((tmp & MASK_CODE) ^ XOR_CODE);
    },

    av2bv: function (aid) {
        const XOR_CODE = 23442827791579n;
        const MAX_AID = 1n << 51n;
        const BASE = 58n;
        const data = 'FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf';
        const bytes = ['B', 'V', '1', '0', '0', '0', '0', '0', '0', '0', '0', '0'];

        let bvIndex = bytes.length - 1;
        let tmp = (MAX_AID | BigInt(aid)) ^ XOR_CODE;
        while (tmp > 0) {
            bytes[bvIndex] = data[Number(tmp % BigInt(BASE))];
            tmp = tmp / BASE;
            bvIndex -= 1;
        }
        [bytes[3], bytes[9]] = [bytes[9], bytes[3]];
        [bytes[4], bytes[7]] = [bytes[7], bytes[4]];
        return bytes.join('');
    },
};

VCUtil.URL = {
    Info: function () {
        if (location.pathname.startsWith("/video/")) {
            const actualVideo = document.querySelector("meta[property=\"og:url\"]").content;
            const videoId = actualVideo
                .slice('https://www.bilibili.com/video/'.length)
                .replace(/\/$/, '');
            const avid = videoId.startsWith('av') ? Number(videoId.slice(2)) : VCUtil.Convert.bv2av(videoId);
            const part = new URL(window.location.href).searchParams.get("p") || 1;
            return {
                avid: avid, bvid: VCUtil.Convert.av2bv(avid), part: part, type: 'video',
                standardUrl: `https://www.bilibili.com/video/av${avid}${part > 1 ? `?p=${part}` : ''}`
            };
        }
        if (location.pathname.startsWith("/festival/")) {
            const actualVideo = document.querySelector("#link0").value;
            const fesName = location.pathname.slice('/festival/'.length);
            const videoId = actualVideo
                .slice('https://www.bilibili.com/video/'.length)
                .replace(/\/$/, '');
            const avid = videoId.startsWith('av') ? Number(videoId.slice(2)) : VCUtil.Convert.bv2av(videoId);
            const part = new URL(actualVideo).searchParams.get("p") || 1;
            return {
                avid: avid, bvid: VCUtil.Convert.av2bv(avid), part: part, type: 'festival',
                standardUrl: `https://www.bilibili.com/festival/${fesName}?bvid=${VCUtil.Convert.av2bv(avid)}${part > 1 ? `&p=${part}` : ''}`
            };
        }
        if (location.pathname.startsWith("/list/watchlater")) {
            const bvid = new URL(window.location.href).searchParams.get("bvid");
            const part = new URL(window.location.href).searchParams.get("p") || 1;
            const oid = new URL(window.location.href).searchParams.get("oid");
            return {
                avid: VCUtil.Convert.bv2av(bvid), bvid: bvid, part: part, type: 'watchlater',
                standardUrl: `https://www.bilibili.com/list/watchlater?oid=${oid}&bvid=${bvid}${part > 1 ? `&p=${part}` : ''}`
            };
        }
        if (location.pathname.startsWith("/list/ml")) {
            const mlid = location.pathname.slice('/list/ml'.length);
            const bvid = new URL(window.location.href).searchParams.get("bvid");
            const part = new URL(window.location.href).searchParams.get("p") || 1;
            const oid = new URL(window.location.href).searchParams.get("oid");
            return {
                avid: VCUtil.Convert.bv2av(bvid), bvid: bvid, part: part, type: 'medialist',
                standardUrl: `https://www.bilibili.com/list/ml${mlid}?oid=${oid}&bvid=${bvid}${part > 1 ? `&p=${part}` : ''}`
            };
        }
        return null;
    },

    Standardize: function (urlInfo) {
        if (!urlInfo.standardUrl) return;
        if (urlInfo.standardUrl !== window.location.href) {
            console.log("[B站视频统计] [URL] 当前 URL:", window.location.href);
            console.log("[B站视频统计] [URL] 重定向到标准URL:", urlInfo.standardUrl);
            history.replaceState(null, '', urlInfo.standardUrl);
        }
    },

    StandardizeAllUrl: function () {
        const links = Array.from(document.querySelectorAll('a[href]'));
        links.forEach(link => {
            const pathname = new URL(link.href).pathname;
            if (!pathname.startsWith('/video/')) return;
            const videoId = pathname.slice('/video/'.length).replace(/\/$/, '');
            const avid = videoId.startsWith('av') ? Number(videoId.slice(2)) : VCUtil.Convert.bv2av(videoId);
            const part = new URL(link.href).searchParams.get("p") || 1;
            link.href = `https://www.bilibili.com/video/av${avid}${part > 1 ? `?p=${part}` : ''}`;
        });
    },
};

VCUtil.Stat = {
    InfoBoxClass: '.vcutil-stat',
    FormatTimezoneSlots: function (block, timestamp) {
        for (let slotId = 0; slotId < VCUtil.ConfigFlags.timezoneSlotsCount; slotId++) {
            const { current } = VCUtil.MenuCommand.CurrentAndNextTimezone(slotId);
            const { IATA, timezone } = current;
            console.log(`[B站视频统计] [Stat] 时区槽位 ${slotId + 1} = IATA: ${IATA}, 时区: ${timezone}`);
            if (timezone === "Timestamp") {
                block.AddText(`${IATA} ${timestamp}`, true);
            } else {
                block.AddText(`${IATA} ${VCUtil.Stat.Format.Timezone(timestamp, timezone)}`, true);
            }
        }
    },
    FetchData: async function (avid, part) {
        if (!document.querySelector('div.bili-avatar') && !document.querySelector('div.header-login-entry')) return console.log("[B站视频统计] [Stat] Header 未完全加载，推迟 FetchData");
        if (document.querySelector(VCUtil.Stat.InfoBoxClass)
          && document.querySelector(VCUtil.Stat.InfoBoxClass).getAttribute('data-avid') === avid.toString()) return;
        const url = `https://api.bilibili.com/x/web-interface/view?aid=${avid}`;
        console.log("[B站视频统计] [Stat] FetchData:", `HTTP GET ${url}`);
        const response = await fetch(url);
        console.log("[B站视频统计] [Stat] FetchData: Response", response);
        const json = await response.json();
        console.log("[B站视频统计] [Stat] FetchData: JSON", json);
        if (json == undefined) return;
        const data = json.data;
        if (data == undefined) return;

        const format = VCUtil.Stat.Format;
        const tidVersion = VCUtil.MenuCommand.CurrentAndNextTid().current.Id;
        const tidShow = VCUtil.MenuCommand.CurrentAndNextTidShow().current;
        const block = VCUtil.Stat
            .BuildInfoBox(avid)
            .AddText(`${format.HumanReadableNumber(data.stat.view)} 播放    `)
            .AddText(`av${avid}`, true)
            .AddText(VCUtil.Convert.av2bv(avid), true)
            .AddText(`cid=${data.pages[part - 1].cid}`, true)
            .AddLineBreak();

        block.AddText('发布');
        VCUtil.Stat.FormatTimezoneSlots(block, data.pubdate);
        block.AddLineBreak();
        block.AddText('投稿');
        VCUtil.Stat.FormatTimezoneSlots(block, data.ctime);
        block
            .AddLineBreak()
            .AddText('分区')
            .AddText(tidVersion != "v2" ? ((tidVersion === "all" ? "v1 " : "") + (tidShow ? `${format.TnameData(data.tid).Tname}（${data.tid}）` : format.TnameData(data.tid).Tname)) : "")
            .AddText(tidVersion != "v1" ? ((tidVersion === "all" ? "v2 " : "") + (tidShow ? `${format.TnameDataV2(data.tid_v2).Tname}（${data.tid_v2}）` : format.TnameDataV2(data.tid_v2).Tname)) : "")
            .AddText((data.tid === 30) ? format.VocaloidAchievement(data.stat.view) : format.VocaloidAchievement(data.stat.view)+"（非 VU 区视频）")
            .AddLineBreak();

        if (data.tid === 30) {
            block.AddLink('TDD',`https://tdd.bunnyxt.com/video/av${avid}`)
        } else {
            block.AddText('---');
        }

        block.AddLink('封面', data.pic);
        block.AddLink('短链接', `https://b23.tv/av${avid}`);
        block.AddLink('API', url);
        VCUtil.Stat.UpdateLayout();
    },

    UpdateLayout: function () {
        const infoBox = document.querySelector(VCUtil.Stat.InfoBoxClass);
        if (infoBox) {
            if(document.querySelector(".video-info-meta")) {
                document.querySelector(".video-info-meta").parentElement.style.paddingBottom = `${infoBox.clientHeight + 80}px`;
            } else {
                document.querySelector(".video-desc").style.paddingTop = `${infoBox.clientHeight}px`;
            }
        }
    },

    BuildInfoBox: function (avid) {
        const infoBox = document.createElement('div');
        infoBox.className = VCUtil.Stat.InfoBoxClass.slice(1);
        infoBox.setAttribute('data-avid', avid.toString());
        infoBox.style.color = "#999";
        infoBox.style.fontSize = "12px";
        infoBox.style.lineHeight = "1.5";
        infoBox.style.position = "absolute";
        infoBox.style.zIndex = "10";
        infoBox.style.paddingTop = "10px";
        Array.from(document.querySelectorAll(VCUtil.Stat.InfoBoxClass)).forEach(e => e.remove());
        if(document.querySelector(".video-info-meta")) {
            document.querySelector(".video-info-meta").parentElement.appendChild(infoBox);
        } else {
            document.querySelector(".video-desc").parentElement.insertBefore(infoBox, document.querySelector(".video-desc"))
        }
        const builder = {
            AddText: function (text, code = false) {
                if (text === "") { return builder; }
                const textBox = document.createElement("span");
                textBox.innerText = text + " ";
                textBox.style.marginRight = "13px";
                if (code === true) { textBox.style.fontFamily = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', 'JetBrains Mono', monospace"; }
                infoBox.appendChild(textBox);
                return builder;
            },
            AddBlod(text) {
                const boldBox = document.createElement("span");
                boldBox.innerText = text;
                boldBox.style.fontWeight = "bold";
                boldBox.style.marginRight = "13px";
                infoBox.appendChild(boldBox);
                return builder;
            },
            AddLink: function (text, url) {
                const linkBox = document.createElement("span");
                linkBox.innerHTML = `<a target="_blank" href="${url}">${text}</a>`;
                linkBox.style.marginRight = "13px";
                infoBox.appendChild(linkBox);
                return builder;
            },
            AddLineBreak: function () {
                infoBox.appendChild(document.createElement("br"));
                return builder;
            },
        };
        return builder;
    },
};

VCUtil.Stat.Format = {
    TidMappingV1: [{MainId:1,MainName:"动画(主分区)",Subzones:[{Id:1,Name:"动画(主分区)"},{Id:24,Name:"MAD·AMV"},{Id:25,Name:"MMD·3D"},{Id:47,Name:"同人·手书<br>(原短片·手书)"},{Id:257,Name:"配音"},{Id:210,Name:"手办·模玩"},{Id:86,Name:"特摄"},{Id:253,Name:"动漫杂谈"},{Id:27,Name:"综合"}]},{MainId:13,MainName:"番剧(主分区)",Subzones:[{Id:13,Name:"番剧(主分区)"},{Id:51,Name:"资讯"},{Id:152,Name:"官方延伸"},{Id:32,Name:"完结动画"},{Id:33,Name:"连载动画"}]},{MainId:167,MainName:"国创(主分区)",Subzones:[{Id:167,Name:"国创(主分区)"},{Id:153,Name:"国产动画"},{Id:168,Name:"国产原创相关"},{Id:169,Name:"布袋戏"},{Id:170,Name:"资讯"},{Id:195,Name:"动态漫·广播剧"}]},{MainId:3,MainName:"音乐(主分区)",Subzones:[{Id:3,Name:"音乐(主分区)"},{Id:28,Name:"原创音乐"},{Id:29,Name:"音乐现场"},{Id:31,Name:"翻唱"},{Id:59,Name:"演奏"},{Id:243,Name:"乐评盘点"},{Id:30,Name:"VOCALOID·UTAU"},{Id:193,Name:"MV"},{Id:266,Name:"音乐粉丝饭拍"},{Id:265,Name:"AI音乐"},{Id:267,Name:"电台"},{Id:244,Name:"音乐教学"},{Id:130,Name:"音乐综合"},{Id:194,Name:"电音(已下线)"}]},{MainId:129,MainName:"舞蹈(主分区)",Subzones:[{Id:129,Name:"舞蹈(主分区)"},{Id:20,Name:"宅舞"},{Id:198,Name:"街舞"},{Id:199,Name:"明星舞蹈"},{Id:200,Name:"国风舞蹈"},{Id:255,Name:"颜值·网红舞<br>(原手势·网红舞)"},{Id:154,Name:"舞蹈综合"},{Id:156,Name:"舞蹈教程"}]},{MainId:4,MainName:"游戏(主分区)",Subzones:[{Id:4,Name:"游戏(主分区)"},{Id:17,Name:"单机游戏"},{Id:171,Name:"电子竞技"},{Id:172,Name:"手机游戏"},{Id:65,Name:"网络游戏"},{Id:173,Name:"桌游棋牌"},{Id:121,Name:"GMV"},{Id:136,Name:"音游"},{Id:19,Name:"Mugen"}]},{MainId:36,MainName:"知识(主分区)",Subzones:[{Id:36,Name:"知识(主分区)"},{Id:201,Name:"科学科普"},{Id:124,Name:"社科·法律·心理(原社科人文、原趣味科普人文)"},{Id:228,Name:"人文历史"},{Id:207,Name:"财经商业"},{Id:208,Name:"校园学习"},{Id:209,Name:"职业职场"},{Id:229,Name:"设计·创意"},{Id:122,Name:"野生技术协会"},{Id:39,Name:"演讲·公开课(已下线)"},{Id:96,Name:"星海(已下线)"},{Id:98,Name:"机械(已下线)"}]},{MainId:188,MainName:"科技(主分区)",Subzones:[{Id:188,Name:"科技(主分区)"},{Id:95,Name:"数码(原手机平板)"},{Id:230,Name:"软件应用"},{Id:231,Name:"计算机技术"},{Id:232,Name:"科工机械 (原工业·工程·机械)"},{Id:233,Name:"极客DIY"},{Id:189,Name:"电脑装机(已下线)"},{Id:190,Name:"摄影摄像(已下线)"},{Id:191,Name:"影音智能(已下线)"}]},{MainId:234,MainName:"运动(主分区)",Subzones:[{Id:234,Name:"运动(主分区)"},{Id:235,Name:"篮球"},{Id:249,Name:"足球"},{Id:164,Name:"健身"},{Id:236,Name:"竞技体育"},{Id:237,Name:"运动文化"},{Id:238,Name:"运动综合"}]},{MainId:223,MainName:"汽车(主分区)",Subzones:[{Id:223,Name:"汽车(主分区)"},{Id:258,Name:"汽车知识科普"},{Id:227,Name:"购车攻略"},{Id:247,Name:"新能源车"},{Id:245,Name:"赛车"},{Id:246,Name:"改装玩车"},{Id:240,Name:"摩托车"},{Id:248,Name:"房车"},{Id:176,Name:"汽车生活"},{Id:224,Name:"汽车文化(已下线)"},{Id:225,Name:"汽车极客(已下线)"},{Id:226,Name:"智能出行(已下线)"}]},{MainId:160,MainName:"生活(主分区)",Subzones:[{Id:160,Name:"生活(主分区)"},{Id:138,Name:"搞笑"},{Id:254,Name:"亲子"},{Id:250,Name:"出行"},{Id:251,Name:"三农"},{Id:239,Name:"家居房产"},{Id:161,Name:"手工"},{Id:162,Name:"绘画"},{Id:21,Name:"日常"},{Id:76,Name:"美食圈(重定向)"},{Id:75,Name:"动物圈(重定向)"},{Id:163,Name:"运动(重定向)"},{Id:176,Name:"汽车(重定向)"},{Id:174,Name:"其他(已下线)"}]},{MainId:211,MainName:"美食(主分区)",Subzones:[{Id:211,Name:"美食(主分区)"},{Id:76,Name:"美食制作(原[生活]->[美食圈])"},{Id:212,Name:"美食侦探"},{Id:213,Name:"美食测评"},{Id:214,Name:"田园美食"},{Id:215,Name:"美食记录"}]},{MainId:217,MainName:"动物圈(主分区)",Subzones:[{Id:217,Name:"动物圈(主分区)"},{Id:218,Name:"喵星人"},{Id:219,Name:"汪星人"},{Id:222,Name:"小宠异宠"},{Id:221,Name:"野生动物"},{Id:220,Name:"动物二创"},{Id:75,Name:"动物综合"}]},{MainId:119,MainName:"鬼畜(主分区)",Subzones:[{Id:119,Name:"鬼畜(主分区)"},{Id:22,Name:"鬼畜调教"},{Id:26,Name:"音MAD"},{Id:126,Name:"人力VOCALOID"},{Id:216,Name:"鬼畜剧场"},{Id:127,Name:"教程演示"}]},{MainId:155,MainName:"时尚(主分区)",Subzones:[{Id:155,Name:"时尚(主分区)"},{Id:157,Name:"美妆护肤"},{Id:252,Name:"仿妆cos"},{Id:158,Name:"穿搭"},{Id:159,Name:"时尚潮流"},{Id:164,Name:"健身(重定向)"},{Id:192,Name:"风尚标(已下线)"}]},{MainId:202,MainName:"资讯(主分区)",Subzones:[{Id:202,Name:"资讯(主分区)"},{Id:203,Name:"热点"},{Id:204,Name:"环球"},{Id:205,Name:"社会"},{Id:206,Name:"综合"}]},{MainId:165,MainName:"广告(主分区)",Subzones:[{Id:165,Name:"广告(主分区)"},{Id:166,Name:"广告(已下线)"}]},{MainId:5,MainName:"娱乐(主分区)",Subzones:[{Id:5,Name:"娱乐(主分区)"},{Id:241,Name:"娱乐杂谈"},{Id:262,Name:"CP安利"},{Id:263,Name:"颜值安利"},{Id:242,Name:"娱乐粉丝创作<br>(原粉丝创作)"},{Id:264,Name:"娱乐资讯"},{Id:137,Name:"明星综合"},{Id:71,Name:"综艺"},{Id:131,Name:"Korea相关(已下线)"}]},{MainId:181,MainName:"影视(主分区)",Subzones:[{Id:181,Name:"影视(主分区)"},{Id:182,Name:"影视杂谈"},{Id:183,Name:"影视剪辑"},{Id:260,Name:"影视整活"},{Id:259,Name:"AI影像"},{Id:184,Name:"预告·资讯"},{Id:85,Name:"小剧场"},{Id:256,Name:"短片"},{Id:261,Name:"影视综合"}]},{MainId:177,MainName:"纪录片(主分区)",Subzones:[{Id:177,Name:"纪录片(主分区)"},{Id:37,Name:"人文·历史"},{Id:178,Name:"科学·探索·自然"},{Id:179,Name:"军事"},{Id:180,Name:"社会·美食·旅行"}]},{MainId:23,MainName:"电影(主分区)",Subzones:[{Id:23,Name:"电影(主分区)"},{Id:147,Name:"华语电影"},{Id:145,Name:"欧美电影"},{Id:146,Name:"日本电影"},{Id:83,Name:"其他国家"}]},{MainId:11,MainName:"电视剧(主分区)",Subzones:[{Id:11,Name:"电视剧(主分区)"},{Id:185,Name:"国产剧"},{Id:187,Name:"海外剧"}]}],

    TidMappingV2: [{MainId:1005,MainName:"动画 (主分区)",Subzones:[{Id:1005,Name:"动画 (主分区)"},{Id:2037,Name:"同人动画"},{Id:2038,Name:"模玩周边"},{Id:2039,Name:"cosplay"},{Id:2040,Name:"二次元线下"},{Id:2041,Name:"动漫剪辑"},{Id:2042,Name:"动漫评论"},{Id:2043,Name:"动漫速读"},{Id:2044,Name:"动漫配音"},{Id:2045,Name:"动漫资讯"},{Id:2046,Name:"网文解读"},{Id:2047,Name:"虚拟up主"},{Id:2048,Name:"特摄"},{Id:2049,Name:"布袋戏"},{Id:2050,Name:"漫画·动态漫"},{Id:2051,Name:"广播剧"},{Id:2052,Name:"动漫reaction"},{Id:2053,Name:"动漫教学"},{Id:2054,Name:"二次元其他"}]},{MainId:1008,MainName:"游戏 (主分区)",Subzones:[{Id:1008,Name:"游戏 (主分区)"},{Id:2064,Name:"单人RPG游戏"},{Id:2065,Name:"MMORPG游戏"},{Id:2066,Name:"单机主机类游戏"},{Id:2067,Name:"SLG游戏"},{Id:2068,Name:"回合制策略游戏"},{Id:2069,Name:"即时策略游戏"},{Id:2070,Name:"MOBA游戏"},{Id:2071,Name:"射击游戏"},{Id:2072,Name:"体育竞速游戏"},{Id:2073,Name:"动作竞技游戏"},{Id:2074,Name:"音游舞游"},{Id:2075,Name:"模拟经营游戏"},{Id:2076,Name:"女性向游戏"},{Id:2077,Name:"休闲/小游戏"},{Id:2078,Name:"沙盒类"},{Id:2079,Name:"其他游戏"}]},{MainId:1007,MainName:"鬼畜 (主分区)",Subzones:[{Id:1007,Name:"鬼畜 (主分区)"},{Id:2059,Name:"鬼畜调教"},{Id:2060,Name:"鬼畜剧场"},{Id:2061,Name:"人力VOCALOID"},{Id:2062,Name:"音MAD"},{Id:2063,Name:"鬼畜综合"}]},{MainId:1003,MainName:"音乐 (主分区)",Subzones:[{Id:1003,Name:"音乐 (主分区)"},{Id:2016,Name:"原创音乐"},{Id:2017,Name:"MV"},{Id:2018,Name:"音乐现场"},{Id:2019,Name:"乐迷饭拍"},{Id:2020,Name:"翻唱"},{Id:2021,Name:"演奏"},{Id:2022,Name:"VOCALOID"},{Id:2023,Name:"AI音乐"},{Id:2024,Name:"电台·歌单"},{Id:2025,Name:"音乐教学"},{Id:2026,Name:"乐评盘点"},{Id:2027,Name:"音乐综合"}]},{MainId:1004,MainName:"舞蹈 (主分区)",Subzones:[{Id:1004,Name:"舞蹈 (主分区)"},{Id:2028,Name:"宅舞"},{Id:2029,Name:"街舞"},{Id:2030,Name:"颜值·网红舞"},{Id:2031,Name:"明星舞蹈"},{Id:2032,Name:"国风舞蹈"},{Id:2033,Name:"舞蹈教学"},{Id:2034,Name:"芭蕾舞"},{Id:2035,Name:"wota艺"},{Id:2036,Name:"舞蹈综合"}]},{MainId:1001,MainName:"影视 (主分区)",Subzones:[{Id:1001,Name:"影视 (主分区)"},{Id:2001,Name:"影视解读"},{Id:2002,Name:"影视剪辑"},{Id:2003,Name:"影视资讯"},{Id:2004,Name:"影视正片搬运"},{Id:2005,Name:"短剧短片"},{Id:2006,Name:"AI影视"},{Id:2007,Name:"影视reaction"},{Id:2008,Name:"影视综合"}]},{MainId:1002,MainName:"娱乐 (主分区)",Subzones:[{Id:1002,Name:"娱乐 (主分区)"},{Id:2009,Name:"娱乐评论"},{Id:2010,Name:"明星剪辑"},{Id:2011,Name:"娱乐饭拍&现场"},{Id:2012,Name:"娱乐资讯"},{Id:2013,Name:"娱乐reaction"},{Id:2014,Name:"娱乐综艺正片"},{Id:2015,Name:"娱乐综合"}]},{MainId:1010,MainName:"知识 (主分区)",Subzones:[{Id:1010,Name:"知识 (主分区)"},{Id:2084,Name:"应试教育"},{Id:2085,Name:"非应试语言学习"},{Id:2086,Name:"大学专业知识"},{Id:2087,Name:"商业财经"},{Id:2088,Name:"社会观察"},{Id:2089,Name:"时政解读"},{Id:2090,Name:"人文历史"},{Id:2091,Name:"设计艺术"},{Id:2092,Name:"心理杂谈"},{Id:2093,Name:"职场发展"},{Id:2094,Name:"科学科普"},{Id:2095,Name:"其他知识杂谈"}]},{MainId:1012,MainName:"科技数码 (主分区)",Subzones:[{Id:1012,Name:"科技数码 (主分区)"},{Id:2099,Name:"电脑"},{Id:2100,Name:"手机"},{Id:2101,Name:"平板电脑"},{Id:2102,Name:"摄影摄像"},{Id:2103,Name:"工程机械"},{Id:2104,Name:"自制发明/设备"},{Id:2105,Name:"科技数码综合"}]},{MainId:1009,MainName:"资讯 (主分区)",Subzones:[{Id:1009,Name:"资讯 (主分区)"},{Id:2080,Name:"时政资讯"},{Id:2081,Name:"海外资讯"},{Id:2082,Name:"社会资讯"},{Id:2083,Name:"综合资讯"}]},{MainId:1020,MainName:"美食 (主分区)",Subzones:[{Id:1020,Name:"美食 (主分区)"},{Id:2149,Name:"美食制作"},{Id:2150,Name:"美食探店"},{Id:2151,Name:"美食测评"},{Id:2152,Name:"美食记录"},{Id:2153,Name:"美食综合"}]},{MainId:1021,MainName:"小剧场 (主分区)",Subzones:[{Id:1021,Name:"小剧场 (主分区)"},{Id:2154,Name:"剧情演绎"},{Id:2155,Name:"语言类小剧场"},{Id:2156,Name:"UP主小综艺"},{Id:2157,Name:"街头采访"}]},{MainId:1013,MainName:"汽车 (主分区)",Subzones:[{Id:1013,Name:"汽车 (主分区)"},{Id:2106,Name:"汽车测评"},{Id:2107,Name:"汽车文化"},{Id:2108,Name:"汽车生活"},{Id:2109,Name:"汽车技术"},{Id:2110,Name:"汽车综合"}]},{MainId:1014,MainName:"时尚美妆 (主分区)",Subzones:[{Id:1014,Name:"时尚美妆 (主分区)"},{Id:2111,Name:"美妆"},{Id:2112,Name:"护肤"},{Id:2113,Name:"仿装cos"},{Id:2114,Name:"鞋服穿搭"},{Id:2115,Name:"箱包配饰"},{Id:2116,Name:"珠宝首饰"},{Id:2117,Name:"三坑"},{Id:2118,Name:"时尚解读"},{Id:2119,Name:"时尚综合"}]},{MainId:1018,MainName:"体育运动 (主分区)",Subzones:[{Id:1018,Name:"体育运动 (主分区)"},{Id:2133,Name:"潮流运动"},{Id:2134,Name:"足球"},{Id:2135,Name:"篮球"},{Id:2136,Name:"跑步"},{Id:2137,Name:"武术"},{Id:2138,Name:"格斗"},{Id:2139,Name:"羽毛球"},{Id:2140,Name:"体育资讯"},{Id:2141,Name:"体育赛事"},{Id:2142,Name:"体育综合"}]},{MainId:1024,MainName:"动物 (主分区)",Subzones:[{Id:1024,Name:"动物 (主分区)"},{Id:2167,Name:"猫"},{Id:2168,Name:"狗"},{Id:2169,Name:"小宠异宠"},{Id:2170,Name:"野生动物·动物解说科普"},{Id:2171,Name:"动物综合·二创"}]},{MainId:1029,MainName:"vlog (主分区)",Subzones:[{Id:1029,Name:"vlog (主分区)"},{Id:2194,Name:"中外生活vlog"},{Id:2195,Name:"学生vlog"},{Id:2196,Name:"职业vlog"},{Id:2197,Name:"其他vlog"}]},{MainId:1006,MainName:"绘画 (主分区)",Subzones:[{Id:1006,Name:"绘画 (主分区)"},{Id:2055,Name:"二次元绘画"},{Id:2056,Name:"非二次元绘画"},{Id:2057,Name:"绘画学习"},{Id:2058,Name:"绘画综合"}]},{MainId:1011,MainName:"人工智能 (主分区)",Subzones:[{Id:1011,Name:"人工智能 (主分区)"},{Id:2096,Name:"AI学习"},{Id:2097,Name:"AI资讯"},{Id:2098,Name:"AI杂谈"}]},{MainId:1015,MainName:"家装房产 (主分区)",Subzones:[{Id:1015,Name:"家装房产 (主分区)"},{Id:2120,Name:"买房租房"},{Id:2121,Name:"家庭装修"},{Id:2122,Name:"家居展示"},{Id:2123,Name:"家用电器"}]},{MainId:1016,MainName:"户外潮流 (主分区)",Subzones:[{Id:1016,Name:"户外潮流 (主分区)"},{Id:2124,Name:"露营"},{Id:2125,Name:"徒步"},{Id:2126,Name:"户外探秘"},{Id:2127,Name:"户外综合"}]},{MainId:1017,MainName:"健身 (主分区)",Subzones:[{Id:1017,Name:"健身 (主分区)"},{Id:2128,Name:"健身科普"},{Id:2129,Name:"健身跟练教学"},{Id:2130,Name:"健身记录"},{Id:2131,Name:"健身身材展示"},{Id:2132,Name:"健身综合"}]},{MainId:1019,MainName:"手工 (主分区)",Subzones:[{Id:1019,Name:"手工 (主分区)"},{Id:2143,Name:"文具手帐"},{Id:2144,Name:"轻手作"},{Id:2145,Name:"传统手工艺"},{Id:2146,Name:"解压手工"},{Id:2147,Name:"DIY玩具"},{Id:2148,Name:"其他手工"}]},{MainId:1022,MainName:"旅游出行 (主分区)",Subzones:[{Id:1022,Name:"旅游出行 (主分区)"},{Id:2158,Name:"旅游记录"},{Id:2159,Name:"旅游攻略"},{Id:2160,Name:"城市出行"},{Id:2161,Name:"公共交通"}]},{MainId:1023,MainName:"三农 (主分区)",Subzones:[{Id:1023,Name:"三农 (主分区)"},{Id:2162,Name:"农村种植"},{Id:2163,Name:"赶海捕鱼"},{Id:2164,Name:"打野采摘"},{Id:2165,Name:"农业技术"},{Id:2166,Name:"农村生活"}]},{MainId:1025,MainName:"亲子 (主分区)",Subzones:[{Id:1025,Name:"亲子 (主分区)"},{Id:2172,Name:"孕产护理"},{Id:2173,Name:"婴幼护理"},{Id:2174,Name:"儿童才艺"},{Id:2175,Name:"萌娃"},{Id:2176,Name:"亲子互动"},{Id:2177,Name:"亲子教育"},{Id:2178,Name:"亲子综合"}]},{MainId:1026,MainName:"健康 (主分区)",Subzones:[{Id:1026,Name:"健康 (主分区)"},{Id:2179,Name:"健康科普"},{Id:2180,Name:"养生"},{Id:2181,Name:"两性知识"},{Id:2182,Name:"心理健康"},{Id:2183,Name:"助眠视频·ASMR"},{Id:2184,Name:"医疗保健综合"}]},{MainId:1027,MainName:"情感 (主分区)",Subzones:[{Id:1027,Name:"情感 (主分区)"},{Id:2185,Name:"家庭关系"},{Id:2186,Name:"恋爱关系"},{Id:2187,Name:"人际关系"},{Id:2188,Name:"自我成长"}]},{MainId:1030,MainName:"生活兴趣 (主分区)",Subzones:[{Id:1030,Name:"生活兴趣 (主分区)"},{Id:2198,Name:"休闲玩乐"},{Id:2199,Name:"线下演出"},{Id:2200,Name:"文玩文创"},{Id:2201,Name:"潮玩玩具"},{Id:2202,Name:"兴趣综合"}]},{MainId:1031,MainName:"生活经验 (主分区)",Subzones:[{Id:1031,Name:"生活经验 (主分区)"},{Id:2203,Name:"生活技能"},{Id:2204,Name:"办事流程"},{Id:2205,Name:"婚嫁"}]},{MainId:1028,MainName:"神秘学 (主分区)",Subzones:[{Id:1028,Name:"神秘学 (主分区)"},{Id:2189,Name:"塔罗占卜"},{Id:2190,Name:"星座占星"},{Id:2191,Name:"传统玄学"},{Id:2192,Name:"疗愈成长"},{Id:2193,Name:"其他神秘学"}]}],

    HumanReadableNumber: function (num) {
        var result = '', counter = 0;
        num = (num || 0).toString();
        for (var i = num.length - 1; i >= 0; i--) {
            counter++;
            result = num.charAt(i) + result;
            if (!(counter % 3) && i != 0) { result = ',' + result; }
        }
        return result;
    },

    VocaloidAchievement: function (plays) {
        if (plays >= 10000000) return "神话";
        if (plays >= 5000000) return "申舌";
        if (plays >= 1000000) return "传说";
        if (plays >= 500000) return "专兑";
        if (plays >= 100000) return "殿堂";
        return "待成就";
    },

    Timezone: function (timestamp, timezone) {
        return new Date(timestamp * 1000).toLocaleString('sv-SE', {timeZone: timezone});
    },

    TnameData: function (tid) {
        for (let i = 0; i < VCUtil.Stat.Format.TidMappingV1.length; i++) {
            const zone = VCUtil.Stat.Format.TidMappingV1[i];
            for (let j = 0; j < zone.Subzones.length; j++) {
                const subzone = zone.Subzones[j];
                if (subzone.Id === tid) {
                    return { Tname: subzone.Name, MainTname: zone.MainName, MainTid: zone.MainId };
                }
            }
        }
        return { Tname: "未知分区", MainTname: "未知主分区", MainTid: -1 };
    },

    TnameDataV2: function (tid) {
        for (let i = 0; i < VCUtil.Stat.Format.TidMappingV2.length; i++) {
            const zone = VCUtil.Stat.Format.TidMappingV2[i];
            for (let j = 0; j < zone.Subzones.length; j++) {
                const subzone = zone.Subzones[j];
                if (subzone.Id === tid) {
                    return { Tname: subzone.Name, MainTname: zone.MainName, MainTid: zone.MainId };
                }
            }
        }
        return { Tname: "未知分区", MainTname: "未知主分区", MainTid: -1 };
    }
};

VCUtil.Entry = () => {
    const urlInfo = VCUtil.URL.Info();
    if (urlInfo === null) return;

    const flag = VCUtil.ConfigFlags[urlInfo.type];
    if (flag.stdurl) VCUtil.URL.Standardize(urlInfo);
    if (flag.stdurlAll) VCUtil.URL.StandardizeAllUrl();
    if (flag.stat) VCUtil.Stat.FetchData(urlInfo.avid, urlInfo.part);
}

VCUtil.MenuCommand = {
    MenuCommands: [],
    TimezonesMapping: [
        { IATA: "PVG", timezone: "Asia/Shanghai" },
        { IATA: "NRT", timezone: "Asia/Tokyo" },
        { IATA: "LAX", timezone: "America/Los_Angeles" },
        { IATA: "JFK", timezone: "America/New_York" },
        { IATA: "LHR", timezone: "Europe/London" },
        { IATA: "MUC", timezone: "Europe/Berlin" },
        { IATA: "KIV", timezone: "Europe/Kiev" },
        { IATA: "SVO", timezone: "Europe/Moscow" },
        { IATA: "SYD", timezone: "Australia/Sydney" },
        { IATA: "UNIX", timezone: "Timestamp" },
    ],
    CurrentAndNextTimezone: function (slotId) {
        const currentIATA = GM_getValue(`VCUtil_Timezone_${slotId}`, VCUtil.ConfigFlags.timezoneSlotDefault[slotId]);
        const currentIndex = VCUtil.MenuCommand.TimezonesMapping.findIndex(e => e.IATA === currentIATA);
        const current = VCUtil.MenuCommand.TimezonesMapping[currentIndex];
        console.log(`[B站视频统计] [Menu] 时区槽位 ${slotId + 1} 当前`, current);
        const nextIndex = (currentIndex + 1) % VCUtil.MenuCommand.TimezonesMapping.length;
        const next = VCUtil.MenuCommand.TimezonesMapping[nextIndex];
        console.log(`[B站视频统计] [Menu] 时区槽位 ${slotId + 1} 下个`, next);
        return { current: current, next: next };
    },
    ChangeTimezoneSetting: function (slotId) {
        const { next } = VCUtil.MenuCommand.CurrentAndNextTimezone(slotId);
        GM_setValue(`VCUtil_Timezone_${slotId}`, next.IATA);
        VCUtil.MenuCommand.Register();
        console.log(`[B站视频统计] [Menu] 时区槽位 ${slotId + 1} 设置成功`);
    },
    TidMapping: [
        { Id: "v1", Name: "旧版" },
        { Id: "v2", Name: "新版" },
        { Id: "all", Name: "全部" },
    ],
    CurrentAndNextTid: function () {
        const currentId = GM_getValue("VCUtil_Tid", VCUtil.ConfigFlags.tidVersionDefault);
        const currentIndex = VCUtil.MenuCommand.TidMapping.findIndex(e => e.Id === currentId);
        const current = VCUtil.MenuCommand.TidMapping[currentIndex];
        console.log(`[B站视频统计] [Menu] 分区设置 当前`, current);
        const nextIndex = (currentIndex + 1) % VCUtil.MenuCommand.TidMapping.length;
        const next = VCUtil.MenuCommand.TidMapping[nextIndex];
        console.log(`[B站视频统计] [Menu] 分区设置 下个`, next);
        return { current: current, next: next };
    },
    ChangeTidSetting: function () {
        const { next } = VCUtil.MenuCommand.CurrentAndNextTid();
        GM_setValue("VCUtil_Tid", next.Id);
        VCUtil.MenuCommand.Register();
        console.log(`[B站视频统计] [Menu] 分区设置 设置成功`);
    },
    CurrentAndNextTidShow: function () {
        const current = GM_getValue("VCUtil_TidShow", VCUtil.ConfigFlags.tidShowDefault);
        console.log(`[B站视频统计] [Menu] 分区Id显示设置 当前`, current);
        console.log(`[B站视频统计] [Menu] 分区Id显示设置 下个`, !current);
        return { current: current, next: !current };
    },
    ChangeTidShowSetting: function () {
        const { next } = VCUtil.MenuCommand.CurrentAndNextTidShow();
        GM_setValue("VCUtil_TidShow", next);
        VCUtil.MenuCommand.Register();
        console.log(`[B站视频统计] [Menu] 分区Id显示设置 设置成功`);
    },
    Register: function () {
        VCUtil.MenuCommand.MenuCommands.forEach(meunCommandId => GM_unregisterMenuCommand(meunCommandId));
        VCUtil.MenuCommand.MenuCommands = [];
        for (let slotId = 0; slotId < VCUtil.ConfigFlags.timezoneSlotsCount; slotId++) {
            const { current, next } = VCUtil.MenuCommand.CurrentAndNextTimezone(slotId);
            const menuCommandId = GM_registerMenuCommand(
                `切换槽位 ${slotId + 1} 时区 ${current.IATA} -> ${next.IATA}`,
                () => VCUtil.MenuCommand.ChangeTimezoneSetting(slotId),
            );
            VCUtil.MenuCommand.MenuCommands.push(menuCommandId);
        }
        {
            const { current, next } = VCUtil.MenuCommand.CurrentAndNextTid();
            const menuCommandId = GM_registerMenuCommand(
                `切换分区显示 ${current.Name} -> ${next.Name}`,
                () => VCUtil.MenuCommand.ChangeTidSetting(),
            );
            VCUtil.MenuCommand.MenuCommands.push(menuCommandId);
        }
        {
            const { next } = VCUtil.MenuCommand.CurrentAndNextTidShow();
            const menuCommandId = GM_registerMenuCommand(
                `${next ? "开启" : "关闭"}分区id显示`,
                () => VCUtil.MenuCommand.ChangeTidShowSetting(),
            );
            VCUtil.MenuCommand.MenuCommands.push(menuCommandId);
        }
    }
};

(() => {
    'use strict';
    console.log("[B站视频统计] 脚本已加载");
    console.log("[B站视频统计] 功能开关:", VCUtil.ConfigFlags);

    const observer = new MutationObserver((_mutationList, _observed) => VCUtil.Entry());
    const el = document.querySelector('#app');
    console.log("[B站视频统计] 挂载到元素:", el);
    observer.observe(el, { childList: true, subtree: true });

    VCUtil.MenuCommand.Register();
})();
