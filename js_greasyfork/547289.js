// ==UserScript==
// @name         IYUU辅种信息显示助手
// @namespace    http://tampermonkey.net/
// @version      2.6.0
// @description  在PT站点种子详情页显示IYUU辅种信息
// @author       AI Assistant
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @grant        GM_download
// @connect      2025.iyuu.cn
// @connect      iyuu.cn
// @connect      zmpt.cc
// @connect      192.168.*
// @connect      10.*
// @connect      172.16.*
// @connect      172.17.*
// @connect      172.18.*
// @connect      172.19.*
// @connect      172.20.*
// @connect      172.21.*
// @connect      172.22.*
// @connect      172.23.*
// @connect      172.24.*
// @connect      172.25.*
// @connect      172.26.*
// @connect      172.27.*
// @connect      172.28.*
// @connect      172.29.*
// @connect      172.30.*
// @connect      172.31.*
// @connect      localhost
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/547289/IYUU%E8%BE%85%E7%A7%8D%E4%BF%A1%E6%81%AF%E6%98%BE%E7%A4%BA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/547289/IYUU%E8%BE%85%E7%A7%8D%E4%BF%A1%E6%81%AF%E6%98%BE%E7%A4%BA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置信息
    const CONFIG = {
        // IYUU官方API端点（使用token认证的接口）
        iyuuApiUrl: 'https://2025.iyuu.cn/reseed/index/index',
        // ZMPT辅种API端点
        zmptApiUrl: 'https://zmpt.cc/nodeapi/iyuu/getIyuuByInfoHash',
        // 检查间隔（毫秒）
        checkInterval: 2000,
        // 最大重试次数
        maxRetries: 3,
        // IYUU API配置
        iyuuConfig: {
            token: GM_getValue('iyuu_token', '') // 从存储中加载，默认为空
        },
        // 混合数据源配置
        enableHybridDataSource: true,
        hybridDataSourcePriority: 'iyuu',
        
        // 用户站点ID列表（已弃用，保留兼容性）
        userSiteIds: []
    };

    // 全局变量：存储当前的辅种数据
    let currentSeedData = null;

    // ---------- 图标与站点英文名反查工具函数 开始 ----------
    function normalizeCnName(s) {
        if (!s) return '';
        return String(s).trim().toLowerCase().replace(/\s|[-_]/g, '').replace(/(pt|站)$/,'');
    }

    function getEnglishNameFallback(opts) {
        const english = (opts && opts.english) || '';
        const chinese = (opts && opts.chinese) || '';
        const url = (opts && opts.url) || '';
        const idx = (unsafeWindow && unsafeWindow.SITES_INDEX) || (window.SITES_INDEX || {});
        const byEnglish = idx.byEnglish || {};
        const byChinese = idx.byChinese || {};
        const byHost = idx.byHost || {};

        const enLower = english.toLowerCase();
        if (enLower && byEnglish[enLower]) return byEnglish[enLower];

        const cnNorm = normalizeCnName(chinese);
        if (cnNorm && byChinese[cnNorm]) return byChinese[cnNorm];

        try {
            const u = new URL(url);
            let host = (u.hostname || '').toLowerCase();
            if (host.startsWith('www.')) host = host.slice(4);
            if (host && byHost[host]) return byHost[host];
        } catch (e) {}

        return english || '';
    }

    function pickIconSmart(opts) {
        const english = (opts && opts.english) || '';
        const chinese = (opts && opts.chinese) || '';
        const urlIcon = (opts && opts.urlIcon) || '';
        const baseUrl = (opts && opts.baseUrl) || '';
        
        // 1. 首先尝试从ICONS_MAP获取图标（按优先级：pixhost > freeimage > imgbb > fallback）
        const en = (getEnglishNameFallback({ english, chinese, url: urlIcon }) || '').toLowerCase();
        const map = (unsafeWindow && unsafeWindow.ICONS_MAP) || (window.ICONS_MAP || {});
        const fallback = (unsafeWindow && unsafeWindow.ICON_FALLBACK) || window.ICON_FALLBACK || '';
        
        const item = map[en];
        if (item) {
            if (item.pixhost) return item.pixhost;
            if (item.freeimage) return item.freeimage;
            if (item.imgbb) return item.imgbb;
            if (item.fallback) return item.fallback;
        }
        
        // 2. 尝试构造favicon.ico链接（但避免已知无效的链接）
        if (baseUrl) {
            try {
                const url = new URL(baseUrl);
                const hostname = url.hostname;
                
                // 检查是否是已知无效的域名
                const invalidHosts = ['dajiao.cyou', 'zhuque.in', 'hdvideo.one', 't.tosky.club', 'hudbt.hust.edu.cn', 'iyuu.cn'];
                if (!invalidHosts.includes(hostname)) {
                    const faviconUrl = `https://${hostname}/favicon.ico`;
                    return faviconUrl;
                }
            } catch (e) {
                // URL解析失败
            }
        }
        
        // 3. 屏蔽无效的IYUU图标链接
        if (urlIcon && urlIcon !== 'https://iyuu.cn/favicon.ico') {
            return urlIcon;
        }
        
        // 4. 最终回退到NP.png
        return fallback;
    }

    async function isReachable(url) {
        if (!url) return false;
        try {
            const res = await fetch(url, { method: 'HEAD' });
            return !!res.ok;
        } catch (e) {
            return false;
        }
    }
    // ---------- 图标与站点英文名反查工具函数 结束 ----------

    // ---------- 内联生成的索引与图标映射（仅在未定义时赋值） ----------
    if (!window.SITES_INDEX) {
        window.SITES_INDEX = {"byEnglish": {"keepfrds": "keepfrds", "pthome": "pthome", "m-team": "m-team", "hdsky": "hdsky", "tjupt": "tjupt", "pter": "pter", "hdhome": "hdhome", "btschool": "btschool", "ourbits": "ourbits", "torrentccf": "torrentccf", "ttg": "ttg", "nanyangpt": "nanyangpt", "hdcity": "hdcity", "nicept": "nicept", "52pt": "52pt", "eastgame": "eastgame", "ssd": "ssd", "soulvoice": "soulvoice", "chdbits": "chdbits", "ptsbao": "ptsbao", "hdarea": "hdarea", "hdtime": "hdtime", "1ptba": "1ptba", "hd4fans": "hd4fans", "opencd": "opencd", "joyhd": "joyhd", "dmhy": "dmhy", "upxin": "upxin", "oshen": "oshen", "discfan": "discfan", "byr": "byr", "dicmusic": "dicmusic", "skyeysnow": "skyeysnow", "pt": "pt", "hdroute": "hdroute", "haidan": "haidan", "hdfans": "hdfans", "dragonhd": "dragonhd", "hitpt": "hitpt", "pttime": "pttime", "hdatmos": "hdatmos", "greatposterwall": "greatposterwall", "hdpost": "hdpost", "hares": "hares", "hudbt": "hudbt", "audiences": "audiences", "piggo": "piggo", "wintersakura": "wintersakura", "hdpt": "hdpt", "hhanclub": "hhanclub", "hdvideo": "hdvideo", "pt0ffcc": "pt0ffcc", "redleaves": "redleaves", "ptchina": "ptchina", "zhuque": "zhuque", "zmpt": "zmpt", "rousi": "rousi", "monikadesign": "monikadesign", "cyanbug": "cyanbug", "ubits": "ubits", "pandapt": "pandapt", "carpt": "carpt", "dajiao": "dajiao", "shadowflow": "shadowflow", "agsvpt": "agsvpt", "ptvicomo": "ptvicomo", "qingwapt": "qingwapt", "xingtan": "xingtan", "hdkyl": "hdkyl", "ilolicon": "ilolicon", "gtkpw": "gtkpw", "wukongwendao": "wukongwendao", "okpt": "okpt", "crabpt": "crabpt", "icc2022": "icc2022", "hddolby": "hddolby", "kamept": "kamept", "ptcafe": "ptcafe", "tosky": "tosky", "yemapt": "yemapt", "ptlgs": "ptlgs", "lemonhd": "lemonhd", "raingfh": "raingfh", "njtupt": "njtupt", "ptzone": "ptzone", "hdclone": "hdclone", "kufei": "kufei", "ptlover": "ptlover", "hspt": "hspt", "xingyunge": "xingyunge", "cspt": "cspt", "tmpt": "tmpt", "sanpro": "sanpro", "htpt": "htpt", "sewerpt": "sewerpt", "bilibili": "bilibili", "gamegamept": "gamegamept", "myptcc": "myptcc"}, "byChinese": {"朋友": "keepfrds", "铂金家": "pthome", "馒头": "m-team", "天空": "hdsky", "北洋": "tjupt", "猫": "pter", "家园": "hdhome", "学校": "btschool", "我堡": "ourbits", "他吹吹风": "torrentccf", "听听歌": "ttg", "南洋": "nanyangpt", "城市": "hdcity", "老师": "nicept", "52": "52pt", "吐鲁番": "eastgame", "春天": "ssd", "聆音": "soulvoice", "彩虹岛": "chdbits", "烧包": "ptsbao", "好大": "hdarea", "时光": "hdtime", "1ptba": "1ptba", "兽": "hd4fans", "皇后": "opencd", "开心": "joyhd", "幼儿园": "dmhy", "好多油": "upxin", "奥申": "oshen", "蝶粉": "discfan", "北邮人": "byr", "海豚": "dicmusic", "天雪": "skyeysnow", "葡萄": "pt", "路": "hdroute", "海胆": "haidan", "红豆饭": "hdfans", "龙之家": "dragonhd", "百川": "hitpt", "时间": "pttime", "阿童木": "hdatmos", "海豹": "greatposterwall", "普斯特": "hdpost", "大白兔": "hares", "蝴蝶": "hudbt", "观众": "audiences", "猪猪": "piggo", "冬樱": "wintersakura", "明教": "hdpt", "憨憨": "hhanclub", "高清视频": "hdvideo", "自由农场": "pt0ffcc", "红叶": "redleaves", "铂金学院": "ptchina", "朱雀": "zhuque", "织梦": "zmpt", "肉丝": "rousi", "莫妮卡": "monikadesign", "大青虫": "cyanbug", "优堡": "ubits", "熊猫": "pandapt", "车": "carpt", "打胶": "dajiao", "影": "shadowflow", "末日": "agsvpt", "象岛": "ptvicomo", "青蛙": "qingwapt", "杏坛": "xingtan", "麒麟": "hdkyl", "爱萝莉": "ilolicon", "gtk": "gtkpw", "悟空": "wukongwendao", "ok": "okpt", "蟹黄堡": "crabpt", "冰淇淋": "icc2022", "杜比": "hddolby", "龟": "kamept", "咖啡": "ptcafe", "tosky": "tosky", "yema": "yemapt", "劳改所": "ptlgs", "柠檬": "lemonhd", "雨": "raingfh", "浦园": "njtupt", "ptzone": "ptzone", "hdclone": "hdclone", "库非": "kufei", "afun": "ptlover", "回声": "hspt", "星陨阁": "xingyunge", "财神": "cspt", "唐门": "tmpt", "伞": "sanpro", "海棠": "htpt", "下水道": "sewerpt", "railgun": "bilibili", "gg": "gamegamept", "我的pt(cc)": "myptcc"}, "byHost": {}};
    }
    if (!window.ICONS_MAP) { 
        window.ICONS_MAP = {"1ptba": {"pixhost": "https://img1.pixhost.to/images/8308/635889347_1ptba.png", "freeimage": "https://iili.io/K3L0sA7.png", "imgbb": "https://i.ibb.co/27vFktr2/635783980-31-1ptba.png"}, "52pt": {"pixhost": "https://img1.pixhost.to/images/8308/635889348_52pt.png", "freeimage": "https://iili.io/K3LlLCJ.png", "imgbb": "https://i.ibb.co/MyTd1pzC/635783956-19-52pt.png"}, "agsvpt": {"pixhost": "https://img1.pixhost.to/images/8308/635889349_agsvpt_.png", "freeimage": "https://iili.io/K3LMteV.png", "imgbb": "https://i.ibb.co/Z6H6tL8w/635784036-93.png"}, "audiences": {"pixhost": "https://img1.pixhost.to/images/8308/635889350_audiences_.png", "freeimage": "https://iili.io/K3LEZ4j.png", "imgbb": "https://i.ibb.co/W4y4QBm7/635784010-68.png"}, "railgunpt": {"pixhost": "https://img1.pixhost.to/images/8308/635889351_bilibili_railgunpt.png", "freeimage": "https://iili.io/K3LXzJf.png", "imgbb": "https://i.ibb.co/7tb57Cm9/635784115-125-railgunpt.png"}, "btschool": {"pixhost": "https://img1.pixhost.to/images/8308/635889352_btschool_.png", "freeimage": "https://iili.io/K3LcZ57.png", "imgbb": "https://i.ibb.co/r2Ptcsd8/635783946-8.png"}, "carpt": {"pixhost": "https://img1.pixhost.to/images/8308/635889353_carpt_.png", "freeimage": "https://iili.io/K3LMrX9.png", "imgbb": "https://i.ibb.co/Q2r5fqN/635784032-89.png"}, "chdbits": {"pixhost": "https://img1.pixhost.to/images/8308/635889355_chdbits_.png", "freeimage": "https://iili.io/K3L07aV.png", "imgbb": "https://i.ibb.co/DfpRkXc4/635783969-25.png"}, "crabpt": {"pixhost": "https://img1.pixhost.to/images/8308/635889356_crabpt_.png", "freeimage": "https://iili.io/K3LVErb.png", "imgbb": "https://i.ibb.co/d4V9Rztk/635784060-102.png"}, "cspt": {"pixhost": "https://img1.pixhost.to/images/8308/635889357_cspt_.png", "freeimage": "https://iili.io/K3LWbiF.png", "imgbb": "https://i.ibb.co/6cB283wB/635784109-120.png"}, "cyanbug": {"pixhost": "https://img1.pixhost.to/images/8308/635889358_cyanbug_.png", "freeimage": "https://iili.io/K3LMuDP.png", "imgbb": "https://i.ibb.co/1JmYLk5j/635784029-84.png"}, "dicmusic": {"pixhost": "https://img1.pixhost.to/images/8308/635889360_dicmusic_.png", "freeimage": "https://iili.io/K3L1wfj.png", "imgbb": "https://i.ibb.co/v4KsZzg6/635783993-51.png"}, "discfan": {"pixhost": "https://img1.pixhost.to/images/8308/635889361_discfan_.png", "freeimage": "https://iili.io/K3L1Mb9.png", "imgbb": "https://i.ibb.co/Wv58QxR0/635783991-40.png"}, "dmhy": {"pixhost": "https://img1.pixhost.to/images/8308/635889363_dmhy_.png", "freeimage": "https://iili.io/K3L1qiJ.png", "imgbb": "https://i.ibb.co/TxmhhJTG/635783983-37.png"}, "dragonhd": {"pixhost": "https://img1.pixhost.to/images/8308/635889364_dragonhd_.png", "freeimage": "https://iili.io/K3LEA7V.png", "imgbb": "https://i.ibb.co/5x5vLmN1/635784004-58.png"}, "eastgame": {"pixhost": "https://img1.pixhost.to/images/8308/635889366_eastgame_.png", "freeimage": "https://iili.io/K3Llppt.png", "imgbb": "https://i.ibb.co/MxJVmKWx/635783959-22.png"}, "ggpt": {"pixhost": "https://img1.pixhost.to/images/8308/635889367_gamegamept_ggpt.png", "freeimage": "https://iili.io/K3LX7s9.png", "imgbb": "https://i.ibb.co/ZpKyd36Z/635784121-126-ggpt.png"}, "greatposterwall": {"pixhost": "https://img1.pixhost.to/images/8308/635889368_greatposterwall_.png", "freeimage": "https://iili.io/K3LENQn.png", "imgbb": "https://i.ibb.co/xtqwgttK/635784008-64.png"}, "gtk": {"pixhost": "https://img1.pixhost.to/images/8308/635889370_gtkpw_gtk.png", "freeimage": "https://iili.io/K3LlgkP.png", "imgbb": "https://i.ibb.co/FL5Rh9ht/635783955-18.png"}, "haidan": {"pixhost": "https://img1.pixhost.to/images/8308/635889371_haidan_.png", "freeimage": "https://iili.io/K3LEF72.png", "imgbb": "https://i.ibb.co/N6C5w1py/635784000-56.png"}, "hdarea": {"pixhost": "https://img1.pixhost.to/images/8308/635889372_hdarea_.png", "freeimage": "https://iili.io/K3L0N9I.png", "imgbb": "https://i.ibb.co/4nck5SBD/635783978-29.png"}, "hdcity": {"pixhost": "https://img1.pixhost.to/images/8308/635889373_hdcity_.png", "freeimage": "https://iili.io/K3LleBj.png", "imgbb": "https://i.ibb.co/35F7gSJf/635783953-17.png"}, "hdclone": {"pixhost": "https://img1.pixhost.to/images/8308/635889375_hdclone.png", "freeimage": "https://iili.io/K3LW0wN.png", "imgbb": "https://i.ibb.co/SwYy5XBs/635784097-115-hdclone.png"}, "hddolby": {"pixhost": "https://img1.pixhost.to/images/8308/635889376_hddolby_.png", "freeimage": "https://iili.io/K3LVWkQ.png", "imgbb": "https://i.ibb.co/mrMfvsNy/635784061-105.png"}, "hdfans": {"pixhost": "https://img1.pixhost.to/images/8308/635889377_hdfans_.png", "freeimage": "https://iili.io/K3LlgkP.png", "imgbb": "https://i.ibb.co/FL5Rh9ht/635783955-18.png"}, "hdhome": {"pixhost": "https://img1.pixhost.to/images/8308/635889378_hdhome_.png", "freeimage": "https://iili.io/K3LcSbn.png", "imgbb": "https://i.ibb.co/35BkqPgd/635783945-7.png"}, "hdkyl": {"pixhost": "https://img1.pixhost.to/images/8308/635889380_hdkyl_.png", "freeimage": "https://iili.io/K3LVBII.png", "imgbb": "https://i.ibb.co/Jjs1NNgf/635784043-97.png"}, "hdroute": {"pixhost": "https://img1.pixhost.to/images/8308/635889381_hdroute_.png", "freeimage": "https://iili.io/K3L1yss.png", "imgbb": "https://i.ibb.co/TBjTpXQH/635783999-54.png"}, "hdsky": {"pixhost": "https://img1.pixhost.to/images/8308/635889382_hdsky_.png", "freeimage": "https://iili.io/K3LcaKQ.png", "imgbb": "https://i.ibb.co/Xf7w45mJ/635783942-4.png"}, "hdtime": {"pixhost": "https://img1.pixhost.to/images/8308/635889383_hdtime_.png", "freeimage": "https://iili.io/K3L0rF4.png", "imgbb": "https://i.ibb.co/yFdrfvW2/635783979-30.png"}, "hhanclub": {"pixhost": "https://img1.pixhost.to/images/8308/635889386_hhanclub_.png", "freeimage": "https://iili.io/K3LG7a4.png", "imgbb": "https://i.ibb.co/cK48139K/635784017-72.png"}, "hitpt": {"pixhost": "https://img1.pixhost.to/images/8308/635889387_hitpt_.png", "freeimage": "https://iili.io/K3LEM2R.png", "imgbb": "https://i.ibb.co/n8ggvBCs/635784005-59.png"}, "htpt": {"pixhost": "https://img1.pixhost.to/images/8308/635889389_htpt_.png", "freeimage": "https://iili.io/K3LX2Np.png", "imgbb": "https://i.ibb.co/TxpZbtzm/635784113-123.png"}, "hudbt": {"pixhost": "https://img1.pixhost.to/images/8308/635889392_hudbt_.png", "freeimage": "https://iili.io/K3LEPj9.png", "imgbb": "https://i.ibb.co/216D2p3M/635784009-67.png"}, "icc2022": {"pixhost": "https://img1.pixhost.to/images/8308/635889396_icc2022_.png", "freeimage": "https://iili.io/KFHSlAG.png", "imgbb": "https://i.ibb.co/RTjTTKLn/103.png"}, "ilolicon": {"pixhost": "https://img1.pixhost.to/images/8308/635889398_ilolicon_.png", "freeimage": "https://iili.io/K3LVz1s.png", "imgbb": "https://i.ibb.co/5gF8DTKX/635784044-98.png"}, "joyhd": {"pixhost": "https://img1.pixhost.to/images/8308/635889401_joyhd_.png", "freeimage": "https://iili.io/K3L1JHB.png", "imgbb": "https://i.ibb.co/fmvnZBQ/635783982-36.png"}, "kamept": {"pixhost": "https://img1.pixhost.to/images/8308/635889404_kamept_.png", "freeimage": "https://iili.io/K3LVv4a.png", "imgbb": "https://i.ibb.co/yBMwhPBz/635784067-106.png"}, "keepfrds": {"pixhost": "https://img1.pixhost.to/images/8308/635889407_keepfrds_.png", "freeimage": "https://iili.io/K3LcJ9t.png", "imgbb": "https://i.ibb.co/Q7hjv73k/635783937-1.png"}, "kufei": {"pixhost": "https://img1.pixhost.to/images/8308/635889410_kufei_.png", "freeimage": "https://iili.io/K3LlgkP.png", "imgbb": "https://i.ibb.co/FL5Rh9ht/635783955-18.png"}, "lemonhd": {"pixhost": "https://img1.pixhost.to/images/8308/635889413_lemonhd_.png", "freeimage": "https://iili.io/K3LWf3b.png", "imgbb": "https://i.ibb.co/cXZdKXFm/635784081-111.png"}, "monikadesign": {"pixhost": "https://img1.pixhost.to/images/8308/635889419_monikadesign_.png", "freeimage": "https://iili.io/K3LMfVe.png", "imgbb": "https://i.ibb.co/8gtgMdjP/635784027-83.png"}, "m-team": {"pixhost": "https://img1.pixhost.to/images/8308/635889421_m-team_.png", "freeimage": "https://iili.io/K3LcqP4.png", "imgbb": "https://i.ibb.co/F1GGHDb/635783940-3.png"}, "pt-cc": {"pixhost": "https://img1.pixhost.to/images/8308/635889423_myptcc_pt-cc.png", "freeimage": "https://iili.io/K3LXlUb.png", "imgbb": "https://i.ibb.co/wF8k6TDW/635784122-127-pt-cc.png"}, "nanyangpt": {"pixhost": "https://img1.pixhost.to/images/8308/635889426_nanyangpt_.png", "freeimage": "https://iili.io/K3LlErl.png", "imgbb": "https://i.ibb.co/67S7whK2/635783950-15.png"}, "nicept": {"pixhost": "https://img1.pixhost.to/images/8308/635889428_nicept_.png", "freeimage": "https://iili.io/K3LlgkP.png", "imgbb": "https://i.ibb.co/FL5Rh9ht/635783955-18.png"}, "njtupt": {"pixhost": "https://img1.pixhost.to/images/8308/635889431_njtupt_.png", "freeimage": "https://iili.io/K3LlgkP.png", "imgbb": "https://i.ibb.co/FL5Rh9ht/635783955-18.png"}, "okpt": {"pixhost": "https://img1.pixhost.to/images/8308/635889436_okpt.png", "freeimage": "https://iili.io/K3LVcQ9.png", "imgbb": "https://i.ibb.co/MkLhjf9z/635784057-101-okpt.png"}, "opencd": {"pixhost": "https://img1.pixhost.to/images/8308/635889437_opencd_.png", "freeimage": "https://iili.io/K3L0DMb.png", "imgbb": "https://i.ibb.co/sdxq9X8M/635783981-33.png"}, "oshen": {"pixhost": "https://img1.pixhost.to/images/8308/635889439_oshen_.png", "freeimage": "https://iili.io/K3LlgkP.png", "imgbb": "https://i.ibb.co/FL5Rh9ht/635783955-18.png"}, "ourbits": {"pixhost": "https://img1.pixhost.to/images/8308/635889441_ourbits_.png", "freeimage": "https://iili.io/K3LlJ0Q.png", "imgbb": "https://i.ibb.co/V0ffz3jp/635783947-9.png"}, "pandapt": {"pixhost": "https://img1.pixhost.to/images/8308/635889442_pandapt_.png", "freeimage": "https://iili.io/K3LMXWX.png", "imgbb": "https://i.ibb.co/8DRGRXfg/635784031-88.png"}, "piggo": {"pixhost": "https://img1.pixhost.to/images/8308/635889446_piggo_.png", "freeimage": "https://iili.io/K3LGHj1.png", "imgbb": "https://i.ibb.co/wNzXBFP3/635784011-69.png"}, "pt": {"pixhost": "https://img1.pixhost.to/images/8308/635889449_pt_.png", "freeimage": "https://iili.io/K3L1QJp.png", "imgbb": "https://i.ibb.co/7dc2RHsd/635783998-53.png"}, "pt0ffcc": {"pixhost": "https://img1.pixhost.to/images/8308/635889450_pt0ffcc_.png", "freeimage": "https://iili.io/K3LGj8Q.png", "imgbb": "https://i.ibb.co/dZVcjd8/635784019-75.png"}, "ptcafe": {"pixhost": "https://img1.pixhost.to/images/8308/635889451_ptcafe_.png", "freeimage": "https://iili.io/K3LVgvR.png", "imgbb": "https://i.ibb.co/Gvx5HV86/635784072-107.png"}, "ptchina": {"pixhost": "https://img1.pixhost.to/images/8308/635889452_ptchina_.png", "freeimage": "https://iili.io/K3LlgkP.png", "imgbb": "https://i.ibb.co/FL5Rh9ht/635783955-18.png"}, "pter": {"pixhost": "https://img1.pixhost.to/images/8308/635889454_pter_.png", "freeimage": "https://iili.io/K3LckJI.png", "imgbb": "https://i.ibb.co/21hCqsNV/635783944-6.png"}, "pthome": {"pixhost": "https://img1.pixhost.to/images/8308/635889455_pthome_.png", "freeimage": "https://iili.io/K3Lc2Nn.png", "imgbb": "https://i.ibb.co/jkJqDYbm/635783939-2.png"}, "ptlgs": {"pixhost": "https://img1.pixhost.to/images/8308/635889458_ptlgs_.png", "freeimage": "https://iili.io/K3LVpyl.png", "imgbb": "https://i.ibb.co/WpDtBmrk/635784078-110.png"}, "afun": {"pixhost": "https://img1.pixhost.to/images/8308/635889462_ptlover_afun.png", "freeimage": "https://iili.io/K3LWOAl.png", "imgbb": "https://i.ibb.co/6JpvJvr5/635784106-117-afun.png"}, "ptsbao": {"pixhost": "https://img1.pixhost.to/images/8308/635889467_ptsbao_.png", "freeimage": "https://iili.io/K3LlgkP.png", "imgbb": "https://i.ibb.co/FL5Rh9ht/635783955-18.png"}, "pttime": {"pixhost": "https://img1.pixhost.to/images/8308/635889472_pttime_.png", "freeimage": "https://iili.io/KFH8pyb.png", "imgbb": "https://i.ibb.co/tp7t1rHn/60.png"}, "ptvicomo": {"pixhost": "https://img1.pixhost.to/images/8308/635889478_ptvicomo_.png", "freeimage": "https://iili.io/K3LMyLF.png", "imgbb": "https://i.ibb.co/fKJkvb8/635784037-94.png"}, "ptzone": {"pixhost": "https://img1.pixhost.to/images/8308/635889482_ptzone.png", "freeimage": "https://iili.io/K3LlgkP.png", "imgbb": "https://i.ibb.co/FL5Rh9ht/635783955-18.png"}, "qingwapt": {"pixhost": "https://img1.pixhost.to/images/8308/635889487_qingwapt_.png", "freeimage": "https://iili.io/K3LVJ1a.png", "imgbb": "https://i.ibb.co/QvrzZKmS/635784039-95.png"}, "raingfh": {"pixhost": "https://img1.pixhost.to/images/8308/635889491_raingfh_.png", "freeimage": "https://iili.io/K3LWxwB.png", "imgbb": "https://i.ibb.co/LWC0mfh/635784084-112.png"}, "rousi": {"pixhost": "https://img1.pixhost.to/images/8308/635889497_rousi_.png", "freeimage": "https://iili.io/K3LMdR2.png", "imgbb": "https://i.ibb.co/9m14zgdX/635784024-82.png"}, "sewerpt": {"pixhost": "https://iili.io/K3LlgkP.png", "freeimage": "https://iili.io/K3LlgkP.png", "imgbb": "https://i.ibb.co/FL5Rh9ht/635783955-18.png"}, "shadowflow": {"pixhost": "https://img1.pixhost.to/images/8308/635889505_shadowflow_.png", "freeimage": "https://iili.io/K3LMi0b.png", "imgbb": "https://i.ibb.co/PG9CSzL6/635784034-91.png"}, "skyeysnow": {"pixhost": "https://img1.pixhost.to/images/8308/635889510_skyeysnow_.png", "freeimage": "https://iili.io/K3L1Sb1.png", "imgbb": "https://i.ibb.co/RGjyKv2N/635783996-52.png"}, "soulvoice": {"pixhost": "https://img1.pixhost.to/images/8308/635889515_soulvoice_.png", "freeimage": "https://iili.io/K3L0zZu.png", "imgbb": "https://i.ibb.co/5xXHGxHH/635783965-24.png"}, "ssd": {"pixhost": "https://img1.pixhost.to/images/8308/635889521_ssd_.png", "freeimage": "https://iili.io/K3L0f3l.png", "imgbb": "https://i.ibb.co/QvRV7QqX/635783962-23.png"}, "tjupt": {"pixhost": "https://img1.pixhost.to/images/8308/635889527_tjupt_.png", "freeimage": "https://iili.io/K3LcGOF.png", "imgbb": "https://i.ibb.co/Y6FG4Fq/635783943-5.png"}, "tmpt": {"pixhost": "https://img1.pixhost.to/images/8308/635889533_tmpt_.png", "freeimage": "https://iili.io/K3LX9UJ.png", "imgbb": "https://i.ibb.co/4ZxzHLwL/635784111-121.png"}, "torrentccf": {"pixhost": "https://img1.pixhost.to/images/8308/635889537_torrentccf_.png", "freeimage": "https://iili.io/K3Llxqv.png", "imgbb": "https://i.ibb.co/chY5pD0N/635783948-11.png"}, "ttg": {"pixhost": "https://img1.pixhost.to/images/8308/635889549_ttg_.png", "freeimage": "https://iili.io/K3LlA7I.png", "imgbb": "https://i.ibb.co/9m00V2VD/635783949-14.png"}, "ubits": {"pixhost": "https://img1.pixhost.to/images/8308/635889554_ubits_.png", "freeimage": "https://iili.io/K3LMERp.png", "imgbb": "https://i.ibb.co/L7rjRbQ/635784030-86.png"}, "upxin": {"pixhost": "https://img1.pixhost.to/images/8308/635889559_upxin_.png", "freeimage": "https://iili.io/K3L1Rxn.png", "imgbb": "https://i.ibb.co/93w5Xycc/635783984-38.png"}, "wintersakura": {"pixhost": "https://img1.pixhost.to/images/8308/635889563_wintersakura_.png", "freeimage": "https://iili.io/K3LGqaR.png", "imgbb": "https://i.ibb.co/bjbHn6ms/635784014-70.png"}, "xingtan": {"pixhost": "https://img1.pixhost.to/images/8308/635889570_xingtan_.png", "freeimage": "https://iili.io/K3LV3dv.png", "imgbb": "https://i.ibb.co/S4b3P6c7/635784042-96.png"}, "xingyunge": {"pixhost": "https://img1.pixhost.to/images/8308/635889579_xingyunge_.png", "freeimage": "https://iili.io/K3LWLNV.png", "imgbb": "https://i.ibb.co/zHJ1Jmrj/635784107-119.png"}, "yemapt": {"pixhost": "https://img1.pixhost.to/images/8308/635889585_yemapt.png", "freeimage": "https://iili.io/K3LVQGn.png", "imgbb": "https://i.ibb.co/prztq103/635784077-109-yemapt.png"}, "zhuque": {"pixhost": "https://img1.pixhost.to/images/8308/635889590_zhuque_.png", "freeimage": "https://iili.io/K3LG4cv.png", "imgbb": "https://i.ibb.co/gLHT4JMg/635784021-80.png"}, "zmpt": {"pixhost": "https://img1.pixhost.to/images/8308/635889592_zmpt_.png", "freeimage": "https://iili.io/K3LM9S4.png", "imgbb": "https://i.ibb.co/VcB4Ccs5/635784022-81.png"}, "hd4fans": {"pixhost": null, "freeimage": null, "imgbb": null, "fallback": "https://hd4fans.com/favicon.ico"}, "byr": {"pixhost": null, "freeimage": null, "imgbb": null, "fallback": "https://i.ibb.co/FL5Rh9ht/635783955-18.png"}, "hdatmos": {"pixhost": null, "freeimage": null, "imgbb": null, "fallback": "https://hdatmos.com/favicon.ico"}, "hdpost": {"pixhost": null, "freeimage": null, "imgbb": null, "fallback": "https://hdpost.com/favicon.ico"}, "hares": {"pixhost": null, "freeimage": null, "imgbb": null, "fallback": "https://hares.com/favicon.ico"}, "hdpt": {"pixhost": null, "freeimage": null, "imgbb": null, "fallback": "https://hdpt.com/favicon.ico"}, "hdvideo": {"pixhost": null, "freeimage": null, "imgbb": null, "fallback": "https://hdvideo.com/favicon.ico"}, "redleaves": {"pixhost": null, "freeimage": null, "imgbb": null, "fallback": "https://redleaves.com/favicon.ico"}, "dajiao": {"pixhost": null, "freeimage": null, "imgbb": null, "fallback": "https://dajiao.com/favicon.ico"}, "gtkpw": {"pixhost": null, "freeimage": null, "imgbb": null, "fallback": "https://gtkpw.com/favicon.ico"}, "wukongwendao": {"pixhost": null, "freeimage": null, "imgbb": null, "fallback": "https://wukongwendao.com/favicon.ico"}, "tosky": {"pixhost": null, "freeimage": null, "imgbb": null, "fallback": "https://tosky.com/favicon.ico"}, "ptlover": {"pixhost": null, "freeimage": null, "imgbb": null, "fallback": "https://ptlover.com/favicon.ico"}, "hspt": {"pixhost": null, "freeimage": null, "imgbb": null, "fallback": "https://hspt.com/favicon.ico"}, "sanpro": {"pixhost": null, "freeimage": null, "imgbb": null, "fallback": "https://sanpro.com/favicon.ico"}, "bilibili": {"pixhost": null, "freeimage": null, "imgbb": null, "fallback": "https://bilibili.com/favicon.ico"}, "gamegamept": {"pixhost": null, "freeimage": null, "imgbb": null, "fallback": "https://gamegamept.com/favicon.ico"}, "myptcc": {"pixhost": null, "freeimage": null, "imgbb": null, "fallback": "https://myptcc.com/favicon.ico"}}; 
    }
    if (!window.ICON_FALLBACK) { 
        window.ICON_FALLBACK = "https://img1.pixhost.to/images/8308/635889434_np.png"; 
    }
    // ---------- 内联生成的索引与图标映射 结束 ----------

    // 验证hash值的有效性
    function isValidHash(hash) {
        if (!hash || typeof hash !== 'string') return false;
        
        // 检查长度
        if (hash.length !== 40) return false;
        
        // 检查是否全是相同字符（如全是A）
        if (/^(.)\1{39}$/.test(hash)) {
            console.log('检测到无效hash（全是相同字符）:', hash);
            return false;
        }
        
        // 检查是否全是0
        if (/^0{40}$/.test(hash)) {
            console.log('检测到无效hash（全是0）:', hash);
            return false;
        }
        
        // 检查是否全是F
        if (/^F{40}$/.test(hash)) {
            console.log('检测到无效hash（全是F）:', hash);
            return false;
        }
        
        // 检查是否全是数字（可能是时间戳或其他数字）
        if (/^\d{40}$/.test(hash)) {
            console.log('检测到无效hash（全是数字）:', hash);
            return false;
        }
        
        // 检查是否包含太多重复字符（可能是无效的hash）
        const charCount = {};
        for (const char of hash) {
            charCount[char] = (charCount[char] || 0) + 1;
        }
        const maxRepeat = Math.max(...Object.values(charCount));
        if (maxRepeat > 15) { // 如果某个字符出现超过15次，可能是无效hash
            console.log('检测到无效hash（字符重复过多）:', hash, '最大重复次数:', maxRepeat);
            return false;
        }
        
        // 检查格式
        if (!/^[a-fA-F0-9]{40}$/.test(hash)) return false;
        
        return true;
    }
    

    
    async function extractSeedHash() {
        console.log('开始提取种子hash值...');
        // 支持多种URL格式的种子ID提取
        let seedId = new URLSearchParams(window.location.search).get('id');
        if (!seedId) {
            // 尝试从路径中提取ID，如 /detail/123 或 /details.php?id=123
            const pathMatch = window.location.pathname.match(/\/(?:detail|details)\/(\d+)/);
            if (pathMatch) {
                seedId = pathMatch[1];
            }
        }
        console.log('当前页面种子ID:', seedId);

        // 馒头站点特殊处理：直接下载torrent文件解析infohash
        const currentHost = window.location.hostname;
        const isMTeamSite = /kp\.m-team\.cc|api\.m-team\.cc/i.test(currentHost);
        const isTTGSite = /totheglory\.im$/i.test(currentHost);
        
        if (isMTeamSite) {
            console.log('[馒头站点] 检测到馒头站点，直接下载torrent文件解析infohash');
            try {
                const fallbackHash = await computeInfoHashFromTorrentOnPage();
                if (fallbackHash) {
                    console.log('[馒头站点] 通过下载 .torrent 计算得到 info_hash:', fallbackHash);
                    return fallbackHash;
                }
            } catch (e) {
                console.warn('[馒头站点] 下载 .torrent 并计算 info_hash 失败:', e?.message || e);
            }
            return null;
        }
        
        if (isTTGSite) {
            console.log('[TTG站点] 检测到TTG站点，直接下载torrent文件解析infohash');
            try {
                const fallbackHash = await computeInfoHashFromTorrentOnPage();
                if (fallbackHash) {
                    console.log('[TTG站点] 通过下载 .torrent 计算得到 info_hash:', fallbackHash);
                    return fallbackHash;
                }
            } catch (e) {
                console.warn('[TTG站点] 下载 .torrent 并计算 info_hash 失败:', e?.message || e);
            }
            return null;
        }

        try {
            const text = document.body?.textContent || '';
            const matches = text.match(/[a-fA-F0-9]{40}/g) || [];
            for (const m of matches) {
                if (isValidHash(m)) {
                    console.log('找到页面文本中的info_hash:', m);
                    return m;
                }
            }
        } catch (e) {
            console.log('页面文本提取40位hash失败:', e?.message || e);
        }

        console.log('页面中未找到有效的40位hash');
        // 回退：尝试下载 .torrent 并计算 v1 info_hash
        try {
            const fallbackHash = await computeInfoHashFromTorrentOnPage();
            if (fallbackHash) {
                console.log('通过下载 .torrent 计算得到 info_hash:', fallbackHash);
                return fallbackHash;
            }
        } catch (e) {
            console.warn('下载 .torrent 并计算 info_hash 失败:', e?.message || e);
        }
        return null;
    }

    // —— 以下为 .torrent 回退计算实现（内存中，不落盘）——
    async function computeInfoHashFromTorrentOnPage() {
        const dlUrl = getDownloadUrlFromPage();
        if (!dlUrl) {
            console.log('未找到下载链接，跳过 .torrent 计算');
            return null;
        }
        const buf = await fetchTorrentArrayBuffer(dlUrl);
        if (!buf) return null;
        const infoSlice = sliceInfoBencodeFromTorrent(buf);
        if (!infoSlice) {
            console.log('未能在 .torrent 中定位 info 字典');
            return null;
        }
        const sha1Hex = await sha1HexOfArrayBuffer(infoSlice);
        return sha1Hex;
    }

    function getDownloadUrlFromPage() {
        try {
            // 馒头站点特殊处理：使用API生成下载链接
            const currentHost = window.location.hostname;
            const isMTeamSite = /kp\.m-team\.cc|api\.m-team\.cc/i.test(currentHost);
            const isTTGSite = /totheglory\.im$/i.test(currentHost);
            
            if (isMTeamSite) {
                console.log('[馒头站点] 尝试使用API生成下载链接');
                // 支持多种URL格式的种子ID提取
                let seedId = new URLSearchParams(window.location.search).get('id');
                if (!seedId) {
                    // 尝试从路径中提取ID，如 /detail/123
                    const pathMatch = window.location.pathname.match(/\/(?:detail|details)\/(\d+)/);
                    if (pathMatch) {
                        seedId = pathMatch[1];
                    }
                }
                if (seedId) {
                    // 使用现有的馒头API逻辑生成下载链接
                    const token = GM_getValue('mteam_dl_token','');
                    if (token) {
                        console.log('[馒头站点] 使用API生成下载链接，种子ID:', seedId);
                        // 这里返回一个占位符，实际下载会在resolveTorrentUrls中处理
                        return `mteam_api:${seedId}`;
                    } else {
                        console.log('[馒头站点] 未配置MT令牌，尝试从页面获取下载链接');
                    }
                }
            }
            
            if (isTTGSite) {
                console.log('[TTG站点] 尝试从页面获取下载链接');
                // 支持新格式 /t/数字/ 和旧格式 ?id=数字
                const seedId = extractTorrentIdFromUrl(window.location.href);
                if (seedId) {
                    console.log('[TTG站点] 使用详情页解析下载链接，种子ID:', seedId);
                    // 这里返回一个占位符，实际下载会在resolveTorrentUrls中处理
                    return `ttg_api:${seedId}`;
                }
            }
            
            // 优先匹配常见下载链接样式
            const anchors = Array.from(document.querySelectorAll('a[href]'));
            const currentOrigin = location.origin;
            const patterns = [
                /download\.php/i,
                /downhash=/i,
                /download/i
            ];
            for (const a of anchors) {
                const href = a.getAttribute('href') || '';
                if (!href) continue;
                if (!patterns.some(p => p.test(href))) continue;
                const abs = href.startsWith('http') ? href : new URL(href, currentOrigin).href;
                // 过滤外站链接
                try { if (new URL(abs).origin !== currentOrigin) continue; } catch {}
                console.log('检测到下载链接:', abs);
                return abs;
            }
        } catch (e) {
            console.warn('解析下载链接失败:', e?.message || e);
        }
        return null;
    }

    function fetchTorrentArrayBuffer(url) {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => reject(new Error('下载.torrent超时')), 20000);
            
            // 馒头站点特殊处理：使用API生成下载链接
            if (url.startsWith('mteam_api:')) {
                const seedId = url.replace('mteam_api:', '');
                console.log('[馒头站点] 使用API生成下载链接，种子ID:', seedId);
                
                // 使用现有的馒头API逻辑
                const token = GM_getValue('mteam_dl_token','');
                if (!token) {
                    reject(new Error('馒头站点未配置MT令牌'));
                    return;
                }
                
                // 调用馒头API生成下载链接
                const form = new FormData();
                form.append('id', seedId);
                
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://api.m-team.cc/api/torrent/genDlToken',
                    headers: {
                        'Referer': 'https://kp.m-team.cc/',
                        'x-api-key': token
                    },
                    data: form,
                    onload: function(response) {
                        clearTimeout(timeoutId);
                        if (response.status === 200) {
                            try {
                                const data = JSON.parse(response.responseText);
                                if (data && data.code === '0' && data.data) {
                                    console.log('[馒头站点] API生成下载链接成功:', data.data);
                                    // 直接下载生成的链接
                                    GM_xmlhttpRequest({
                                        method: 'GET',
                                        url: data.data,
                                        headers: {
                                            'Referer': 'https://kp.m-team.cc/'
                                        },
                                        responseType: 'arraybuffer',
                                        onload: function(torrentResponse) {
                                            if (torrentResponse.status === 200) {
                                                resolve(torrentResponse.response);
                                            } else {
                                                reject(new Error(`下载torrent失败: ${torrentResponse.status}`));
                                            }
                                        },
                                        onerror: function(error) {
                                            reject(new Error(`下载torrent失败: ${error.message || '未知错误'}`));
                                        }
                                    });
                                } else {
                                    reject(new Error(`馒头API返回错误: ${data.message || '未知错误'}`));
                                }
                            } catch (e) {
                                reject(new Error(`解析馒头API响应失败: ${e.message}`));
                            }
                        } else {
                            reject(new Error(`馒头API请求失败: ${response.status}`));
                        }
                    },
                    onerror: function(error) {
                        clearTimeout(timeoutId);
                        reject(new Error(`馒头API请求失败: ${error.message || '未知错误'}`));
                    }
                });
                return;
            }
            
            // TTG站点特殊处理：从详情页解析下载链接
            if (url.startsWith('ttg_api:')) {
                const seedId = url.replace('ttg_api:', '');
                console.log('[TTG站点] 使用详情页解析下载链接，种子ID:', seedId);
                
                // 构建详情页URL - 支持新的/t/格式和旧的details.php格式
                const detailsUrl = `https://totheglory.im/t/${seedId}/`;
                console.log('[TTG站点] 解析详情页:', detailsUrl);
                
                // 使用TTG串行队列，避免触发频率限制
                runTTGQueued(() => gmRequest({ 
                    method: 'GET', 
                    url: detailsUrl, 
                    headers: { Referer: detailsUrl } 
                })).then(htmlResp => {
                    const html = String(htmlResp?.text || '');
                    // 匹配 a[href^="/dl/"]
                    const m2 = html.match(/href=\"(\/dl\/[^\"]+)\"/i);
                    if (m2 && m2[1]) {
                        const abs = detailsUrl.replace(/^(https?:\/\/[^\/]+).*$/, '$1') + m2[1];
                        console.log('[TTG站点] 解析到直链:', abs);
                        
                        // 直接下载解析到的链接
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: abs,
                            headers: {
                                'Referer': detailsUrl
                            },
                            responseType: 'arraybuffer',
                            onload: function(torrentResponse) {
                                clearTimeout(timeoutId);
                                if (torrentResponse.status === 200) {
                                    resolve(torrentResponse.response);
                                } else {
                                    reject(new Error(`下载torrent失败: ${torrentResponse.status}`));
                                }
                            },
                            onerror: function(error) {
                                clearTimeout(timeoutId);
                                reject(new Error(`下载torrent失败: ${error.message || '未知错误'}`));
                            }
                        });
                    } else {
                        clearTimeout(timeoutId);
                        reject(new Error('TTG站点未找到下载链接'));
                    }
                }).catch(e => {
                    clearTimeout(timeoutId);
                    reject(new Error(`TTG站点解析失败: ${e.message}`));
                });
                return;
            }
            
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                responseType: 'arraybuffer',
                headers: {
                    'Accept': 'application/x-bittorrent,application/octet-stream,*/*;q=0.8',
                    'Referer': location.href
                },
                onload: (res) => {
                    clearTimeout(timeoutId);
                    if (res.status >= 200 && res.status < 300 && res.response) {
                        resolve(res.response);
                    } else {
                        reject(new Error(`下载.torrent失败: HTTP ${res.status}`));
                    }
                },
                onerror: (err) => {
                    clearTimeout(timeoutId);
                    reject(new Error(`下载.torrent网络错误: ${err?.error || '未知'}`));
                }
            });
        });
    }

    function sliceInfoBencodeFromTorrent(arrayBuffer) {
        const bytes = new Uint8Array(arrayBuffer);
        let i = 0;
        function readInt() {
            const start = i;
            while (i < bytes.length && bytes[i] !== 0x65 /* 'e' */) i++;
            if (i >= bytes.length) throw new Error('bencode int 结尾缺失');
            const str = new TextDecoder().decode(bytes.subarray(start, i));
            i++; // skip 'e'
            return parseInt(str, 10);
        }
        function readBytes(len) {
            const start = i;
            const end = i + len;
            if (end > bytes.length) throw new Error('bencode bytes 越界');
            i = end;
            return [start, end];
        }
        function readString() {
            // <len>:<data>
            let lenStr = '';
            while (i < bytes.length) {
                const c = bytes[i];
                if (c === 0x3A /* : */) { i++; break; }
                lenStr += String.fromCharCode(c);
                i++;
            }
            const len = parseInt(lenStr, 10);
            const [start, end] = readBytes(len);
            return { start, end };
        }
        function skipAny() {
            const c = bytes[i];
            if (c === 0x69 /* i */) { // int
                i++; readInt(); return;
            }
            if (c === 0x6C /* l */) { // list
                i++;
                while (bytes[i] !== 0x65) skipAny();
                i++; return;
            }
            if (c === 0x64 /* d */) { // dict
                i++;
                while (bytes[i] !== 0x65) {
                    readString(); // key
                    skipAny();    // value
                }
                i++; return;
            }
            // string
            // numbers until ':' then that many bytes
            let lenStr = '';
            while (i < bytes.length) {
                const cc = bytes[i];
                if (cc === 0x3A) { i++; break; }
                lenStr += String.fromCharCode(cc); i++;
            }
            const len = parseInt(lenStr, 10);
            i += len; return;
        }
        function sliceAfterKeyInfo() {
            // assumes current token is a dict, returns [start,end) of value for key 'info' on top-level
            if (bytes[i] !== 0x64) throw new Error('torrent 非字典开头');
            i++;
            while (true) {
                if (i >= bytes.length) throw new Error('解析越界');
                if (bytes[i] === 0x65) { i++; break; } // end dict
                const key = readString();
                const keyStr = new TextDecoder().decode(bytes.subarray(key.start, key.end));
                if (keyStr === 'info') {
                    const startBefore = i;
                    skipAny();
                    const endAfter = i;
                    return bytes.subarray(startBefore, endAfter).slice().buffer;
                } else {
                    skipAny();
                }
            }
            return null;
        }
        // find outermost dict from start
        // 允许文件头前有无关数据（极少见），尝试前进到第一个 'd'
        while (i < bytes.length && bytes[i] !== 0x64) i++;
        if (i >= bytes.length) throw new Error('未找到字典开头');
        return sliceAfterKeyInfo();
    }

    async function sha1HexOfArrayBuffer(buf) {
        const hashBuffer = await crypto.subtle.digest('SHA-1', buf);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // 获取ZMPT辅种数据
    async function fetchZmptInfo(hash) {
        if (!CONFIG.enableHybridDataSource) {
            console.log('混合数据源已禁用，跳过ZMPT API请求');
            return null;
        }

        console.log('请求ZMPT辅种API，hash:', hash);
        
        try {
            const response = await new Promise((resolve, reject) => {
                const timeoutId = setTimeout(() => {
                    reject(new Error('ZMPT API请求超时'));
                }, 15000); // 15秒超时
                
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `${CONFIG.zmptApiUrl}?hash=${hash}`,
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    onload: function(response) {
                        clearTimeout(timeoutId);
                        if (response.status === 200) {
                            try {
                                const text = response.responseText || '';
                                const head = text.slice(0, 240);
                                const data = JSON.parse(text);
                                console.log('ZMPT API响应:', data);
                                if (!(data && typeof data === 'object')) {
                                    console.log('ZMPT API响应原文片段:', head);
                                }
                                resolve(data);
                            } catch (parseError) {
                                console.warn('ZMPT API响应非JSON，片段:', String(response.responseText||'').slice(0,240));
                                reject(new Error(`解析ZMPT API响应失败: ${parseError.message}`));
                            }
                        } else {
                            reject(new Error(`ZMPT API HTTP错误: ${response.status}`));
                        }
                    },
                    onerror: function(error) {
                        clearTimeout(timeoutId);
                        reject(new Error(`ZMPT API网络请求失败: ${error.message || '未知错误'}`));
                    }
                });
            });

            // 检查响应状态
            if (response && response.code === 0 && response.data && Array.isArray(response.data)) {
                console.log(`ZMPT API成功返回 ${response.data.length} 个站点`);
                return response;
            } else {
                console.log('ZMPT API返回数据格式异常或失败:', response);
                // 兜底为标准空结构，避免后续出现 null
                return { code: -1, data: [], msg: 'ZMPT无有效数据' };
            }
        } catch (error) {
            console.warn('ZMPT API请求失败:', error.message);
            return { code: -1, data: [], msg: `ZMPT请求异常: ${error.message}` };
        }
    }

    // 合并IYUU和ZMPT的辅种数据
    function mergeReseedData(iyuuData, zmptData) {
        console.log('开始合并辅种数据...');
        console.log('IYUU数据:', iyuuData);
        console.log('ZMPT数据:', zmptData);

        const mergedData = {
            code: 0,
            data: {},
            msg: '混合数据源合并结果',
            source: 'hybrid'
        };

        // 如果没有启用混合数据源，直接返回IYUU数据
        if (!CONFIG.enableHybridDataSource) {
            console.log('混合数据源已禁用，返回IYUU数据');
            return iyuuData;
        }

        // 如果IYUU数据为空，返回ZMPT数据
        if (!iyuuData || !iyuuData.data || Object.keys(iyuuData.data).length === 0) {
            console.log('IYUU数据为空，返回ZMPT数据');
            if (zmptData && Array.isArray(zmptData.data)) {
                return convertZmptToIyuuFormat(zmptData);
            }
            return iyuuData;
        }

        // 如果ZMPT数据为空，返回IYUU数据
        if (!zmptData || !zmptData.data || !Array.isArray(zmptData.data) || zmptData.data.length === 0) {
            console.log('ZMPT数据为空，返回IYUU数据');
            return iyuuData;
        }

        // 保持IYUU数据的原始结构，但添加ZMPT补充的站点
        mergedData.data = { ...iyuuData.data };
        
        // 获取第一个hash值（用于添加ZMPT站点）
        const firstHash = Object.keys(iyuuData.data)[0];
        if (firstHash && iyuuData.data[firstHash] && iyuuData.data[firstHash].torrent) {
            const originalTorrents = [...iyuuData.data[firstHash].torrent];
            let addedSites = 0;

            // 遍历ZMPT数据，添加所有站点（去重将在显示阶段进行）
            for (const zmptSite of zmptData.data) {
                const siteName = zmptSite.name;
                
                // 从ZMPT API响应中提取种子ID（支持 id= 与 /detail(s)/ 等路径）
                let torrentId = '未知';
                if (zmptSite.url) {
                    const parsed = extractTorrentIdFromUrl(zmptSite.url);
                    if (parsed) torrentId = parsed;
                }
                
                // 生成一个临时的站点ID（使用负数避免冲突）
                const tempSiteId = -(1000 + addedSites);
                const newTorrent = {
                    info_hash: zmptSite.info_hash || `zmpt_${addedSites}_${Date.now()}`, // 优先使用ZMPT的真实hash
                    sid: tempSiteId,
                    torrent_id: torrentId, // 从URL中提取的真实种子ID
                    source: 'zmpt',
                    site_name: siteName,
                    tempId: true,
                    // 直接使用ZMPT API返回的完整数据
                    url: zmptSite.url || '', // 完整的详情页链接
                    icon: zmptSite.icon || '', // 完整的图标链接
                    // 添加ZMPT站点的详细信息
                    zmpt_data: zmptSite // 保存完整的ZMPT数据
                };
                
                originalTorrents.push(newTorrent);
                addedSites++;
                console.log(`添加ZMPT站点: ${siteName} (临时ID: ${tempSiteId}, 真实ID: ${torrentId}, 链接: ${zmptSite.url})`);
            }

            // 更新合并后的数据
            mergedData.data[firstHash].torrent = originalTorrents;
            console.log(`数据合并完成: IYUU ${iyuuData.data[firstHash].torrent.length} 个站点 + ZMPT ${addedSites} 个新站点 = 总计 ${originalTorrents.length} 个站点`);
        }
        
        return mergedData;
    }

    // 将ZMPT数据格式转换为IYUU格式
    function convertZmptToIyuuFormat(zmptData) {
        console.log('转换ZMPT数据格式为IYUU格式...');
        
        // 输出结构需与 IYUU spider 接口保持一致：
        // { code, data: { anyKey: { torrent: [ ... ] } }, msg }
        const convertedData = {
            code: 0,
            data: {},
            msg: 'ZMPT数据转换结果',
            source: 'zmpt'
        };

        const torrentList = [];

        if (zmptData && zmptData.data && Array.isArray(zmptData.data)) {
            zmptData.data.forEach((site, index) => {
                const tempSiteId = -(1000 + index);
                
                // 计算 torrent_id：优先使用提供的，其次从 URL 提取
                let torrentId = site.torrent_id || '未知';
                if (torrentId === '未知' && site.url) {
                    const idFromUrl = extractTorrentIdFromUrl(site.url);
                    if (idFromUrl) torrentId = idFromUrl;
                }

                // 统一为展示层可识别的字段集合
                const torrent = {
                    // IYUU 结构常见字段
                    sid: tempSiteId,
                    site_name: site.name || 'ZMPT',
                    site_alias: site.name || 'ZMPT',
                    nickname: site.name || 'ZMPT',
                    name: site.name || 'ZMPT',
                    torrent_id: torrentId,
                    // ZMPT 扩展信息
                    source: 'zmpt',
                    tempId: true,
                    url: site.url || '',
                    icon: site.icon || '',
                    zmpt_data: site
                };

                torrentList.push(torrent);
            });
        }

        // 采用固定 key 放置转换后的列表，后续展示逻辑通过 Object.values 统一读取
        convertedData.data['zmpt_only'] = { torrent: torrentList };

        console.log(`ZMPT数据转换完成: ${torrentList.length} 个站点`);
        return convertedData;
    }

    // 通用：从各种常见详情页URL中提取种子ID
    // 支持示例：
    // - details.php?id=12345
    // - detail/12345
    // - details/12345
    // - /t/12345 或 /torrent/12345（预留）
    function extractTorrentIdFromUrl(url) {
        if (!url || typeof url !== 'string') return 0;
        try {
            // 1) id=12345
            const m1 = url.match(/(?:\?|&)id=(\d+)/i);
            if (m1 && m1[1]) return parseInt(m1[1], 10);

            // 2) /detail/12345 或 /details/12345
            const m2 = url.match(/\/details?\/(\d+)(?:\D|$)/i);
            if (m2 && m2[1]) return parseInt(m2[1], 10);

            // 3) 其他保留形式：/t/12345 或 /torrent/12345
            const m3 = url.match(/\/(?:t|torrent)\/(\d+)(?:\D|$)/i);
            if (m3 && m3[1]) return parseInt(m3[1], 10);
        } catch (e) {}
        return 0;
    }


    


    // 显示无法查询的提示
    async function displayNoHashMessage() {
        try {
            const popup = document.getElementById('iyuu-popup');
            if (!popup) return;

            const contentElement = popup.querySelector('.iyuu-popup-content');
            if (!contentElement) return;

            // 清空内容
            contentElement.innerHTML = '';

            // 创建标题
            const headerDiv = document.createElement('div');
            headerDiv.className = 'iyuu-popup-header';
            headerDiv.innerHTML = '<h3>无法获取种子信息</h3>';
            contentElement.appendChild(headerDiv);

            // 创建内容
            const contentDiv = document.createElement('div');
            contentDiv.style.padding = '20px';
            contentDiv.style.textAlign = 'left';

            contentDiv.innerHTML = `
                <div style="margin-bottom: 20px; padding: 15px; background: #f8d7da; border-radius: 6px; border-left: 4px solid #dc3545;">
                    <h4 style="color: #721c24; margin-top: 0;">无法获取种子hash值</h4>
                    <p style="color: #721c24; margin-bottom: 0;">页面中未找到有效的40位hash值</p>
                </div>
                
                <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 6px;">
                    <h5 style="color: #495057; margin-top: 0;">可能的原因</h5>
                    <ul style="color: #6c757d; margin: 0; padding-left: 20px;">
                        <li>页面中没有找到40位的hash值</li>
                        <li>该站点使用种子ID而不是hash值</li>
                        <li>页面结构特殊，需要手动配置</li>
                        <li>该页面可能不是种子详情页</li>
                    </ul>
                </div>
                
                <div style="margin-bottom: 20px; padding: 15px; background: #e3f2fd; border-radius: 6px; border-left: 4px solid #2196F3;">
                    <h5 style="color: #1565c0; margin-top: 0;">解决方案</h5>
                    <ul style="color: #1565c0; margin: 0; padding-left: 20px;">
                        <li>检查浏览器控制台的详细日志信息</li>
                        <li>尝试手动在其他站点搜索相同内容</li>
                        <li>联系脚本作者获取支持</li>
                        <li>检查站点是否支持IYUU辅种查询</li>
                    </ul>
                </div>
                
                <div style="padding: 15px; background: #fff3cd; border-radius: 6px;">
                    <h5 style="color: #856404; margin-top: 0;">调试信息</h5>
                    <p style="color: #856404; margin: 0; font-size: 12px;">
                        URL: ${window.location.href}<br>
                        页面标题: ${document.title}<br>
                        种子ID: ${window.location.search.match(/id=(\d+)/)?.[1] || '未找到'}<br>
                        失败时间: ${new Date().toLocaleString()}
                    </p>
                </div>
            `;

            contentElement.appendChild(contentDiv);

            // 显示弹窗并确保居中
            popup.style.display = 'flex';
            
        } catch (e) {
            console.error('显示无法查询提示失败:', e);
        }
    }
    


    
    // 计算字符串的SHA1值（用于API参数）
    async function calculateSHA1FromString(str) {
        try {
            // 将字符串转换为UTF-8字节数组
            const encoder = new TextEncoder();
            const bytes = encoder.encode(str);
            
            // 使用Web Crypto API计算SHA1
            const hashBuffer = await crypto.subtle.digest('SHA-1', bytes);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            
            console.log('计算出的SHA1值:', hashHex, '源字符串:', str);
            return hashHex;
            
        } catch (error) {
            console.error('SHA1计算失败:', error);
            // 返回一个备用值
            return '0000000000000000000000000000000000000000';
        }
    }
    

    


    // 检查当前页面是否为种子详情页 - 只检查特定URL格式
    function isSeedDetailPage() {
        const currentUrl = window.location.href;
        const hostname = window.location.hostname;
        
        // 支持常见详情路径：details.php?id=123、/detail/123、/details/123
        const isDetailPage = /[?&]id=\d+/.test(currentUrl) && /\bdetails?\.php\b/.test(currentUrl)
            || /\/(detail|details)\/\d+(?:$|[?#])/.test(currentUrl);
        
        // 特别检查TTG站点的各种可能格式
        const isTTGSite = /totheglory\.im$/i.test(hostname);
        const isTTGDetail = isTTGSite && (
            /\/t\/\d+\/?$/.test(currentUrl) ||  // TTG新格式：/t/数字/
            /\/details\.php\?id=\d+/.test(currentUrl) ||
            /\/details\.php\?tid=\d+/.test(currentUrl) ||
            /\/details\.php\?.*[&?]id=\d+/.test(currentUrl) ||
            /\/details\.php\?.*[&?]tid=\d+/.test(currentUrl)
        );
        
        const result = isDetailPage || isTTGDetail;
        console.log('页面检测结果:', { 
            isDetailPage, 
            isTTGSite,
            isTTGDetail, 
            result, 
            url: currentUrl,
            hostname: hostname,
            pathname: window.location.pathname,
            search: window.location.search
        });
        return result;
    }

    // 获取正确的sid_sha1值
    async function getSidSha1() {
        try {
            console.log('开始获取sid_sha1值...');
            
            // 检查是否有缓存的sid_sha1值
            const cachedSidSha1 = GM_getValue('cached_sid_sha1');
            const cacheTime = GM_getValue('sid_sha1_cache_time', 0);
            const currentTime = Date.now();
            
            // 汇总用户站点ID：优先使用本地已保存的勾选列表，其次合并内置配置
            const savedSites = GM_getValue('iyuu_owned_sites', []);
            const configSites = Array.isArray(CONFIG.userSiteIds) ? CONFIG.userSiteIds : [];
            const mergedSites = ([]).concat(savedSites, configSites)
                .filter(v => Number.isFinite(parseInt(v)))
                .map(v => parseInt(v))
                .filter(v => v > 0);
            const sortedSites = Array.from(new Set(mergedSites)).sort((a,b)=>a-b);
            const sidListKey = JSON.stringify(sortedSites);
            const cachedKey = GM_getValue('sid_sha1_cache_key', '');

            // 如果缓存存在且7天内且站点列表未变化，则直接复用
            if (cachedSidSha1 && (currentTime - cacheTime) < 7 * 24 * 60 * 60 * 1000 && cachedKey === sidListKey) {
                console.log('使用缓存的sid_sha1值:', cachedSidSha1);
                return cachedSidSha1;
            }

            // sid_list 为空时，不请求，直接抛出让上层跳过 IYUU
            if (sortedSites.length === 0) {
                throw new Error('sid_list为空');
            }
            
            // 检查上次请求时间，避免频率过快
            const lastRequestTime = GM_getValue('last_sid_sha1_request', 0);
            const timeSinceLastRequest = currentTime - lastRequestTime;
            
            // 控频：距离上次请求不到60秒则等待
            if (timeSinceLastRequest < 60000) {
                const waitTime = 60000 - timeSinceLastRequest;
                console.log(`距离上次请求时间过短，等待 ${waitTime}ms...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
            
            // 记录本次请求时间
            GM_setValue('last_sid_sha1_request', currentTime);
            
            console.log('汇报用户站点列表:', sortedSites);
            console.log('站点数量:', sortedSites.length);
            
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://2025.iyuu.cn/reseed/sites/reportExisting',
                    headers: {
                        'Content-Type': 'application/json',
                        'Token': CONFIG.iyuuConfig.token
                    },
                    data: JSON.stringify({ sid_list: sortedSites }),
                    onload: function(response) {
                        console.log('汇报站点API响应状态:', response.status);
                        console.log('汇报站点API响应内容:', response.responseText);
                        
                        if (response.status === 200) {
                            try {
                                const data = JSON.parse(response.responseText);
                                if (data && data.code === 0 && data.data && data.data.sid_sha1) {
                                    const sidSha1 = data.data.sid_sha1;
                                    console.log('成功获取sid_sha1值:', sidSha1);
                                    
                                    // 缓存sid_sha1值
                                    GM_setValue('cached_sid_sha1', sidSha1);
                                    GM_setValue('sid_sha1_cache_time', currentTime);
                                    GM_setValue('sid_sha1_cache_key', sidListKey);
                                    
                                    resolve(sidSha1);
                                } else if (data && data.code === 400 && data.msg === '访问频率过快') {
                                    // 如果是频率过快错误，尝试使用缓存值
                                    if (cachedSidSha1) {
                                        console.log('访问频率过快，使用缓存的sid_sha1值:', cachedSidSha1);
                                        resolve(cachedSidSha1);
                                    } else {
                                        reject(new Error(`汇报站点API错误: ${data?.msg || '未知错误'}`));
                                    }
                                } else if (data && data.code === 400 && data.msg === '缺少sid_list') {
                                    reject(new Error('sid_list为空'));
                                } else {
                                    reject(new Error(`汇报站点API错误: ${data?.msg || '未知错误'}`));
                                }
                            } catch (parseError) {
                                reject(new Error(`解析汇报站点响应数据失败: ${parseError.message}`));
                            }
                        } else {
                            reject(new Error(`汇报站点HTTP错误: ${response.status}`));
                        }
                    },
                    onerror: function(error) {
                        console.error('汇报站点网络请求失败:', error);
                        reject(new Error(`汇报站点网络请求失败: ${error.message || '未知错误'}`));
                    }
                });
            });
            
        } catch (error) {
            console.error('获取sid_sha1失败:', error);
            throw error;
        }
    }

    // 获取sid_sha1（自动模式，忽略手动与强制），用于错误后的自动回退
    async function getSidSha1AutoOnly() {
        try {
            console.log('开始获取sid_sha1值（自动模式，忽略手动设置）...');
            const cachedSidSha1 = GM_getValue('cached_sid_sha1');
            const cacheTime = GM_getValue('sid_sha1_cache_time', 0);
            const currentTime = Date.now();
            if (cachedSidSha1 && (currentTime - cacheTime) < 7 * 24 * 60 * 60 * 1000) {
                console.log('自动模式：使用缓存的sid_sha1值:', cachedSidSha1);
                return cachedSidSha1;
            }

            const lastRequestTime = GM_getValue('last_sid_sha1_request', 0);
            const timeSinceLastRequest = currentTime - lastRequestTime;
            if (timeSinceLastRequest < 5000) {
                const waitTime = 5000 - timeSinceLastRequest;
                console.log(`自动模式：距离上次请求时间过短，等待 ${waitTime}ms...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
            GM_setValue('last_sid_sha1_request', currentTime);

            const savedSites = GM_getValue('iyuu_owned_sites', []);
            const configSites = Array.isArray(CONFIG.userSiteIds) ? CONFIG.userSiteIds : [];
            const mergedSites = ([]).concat(savedSites, configSites)
                .filter(v => Number.isFinite(parseInt(v)))
                .map(v => parseInt(v))
                .filter(v => v > 0);
            const sortedSites = Array.from(new Set(mergedSites)).sort((a,b)=>a-b);
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://2025.iyuu.cn/reseed/sites/reportExisting',
                    headers: {
                        'Content-Type': 'application/json',
                        'Token': CONFIG.iyuuConfig.token
                    },
                    data: JSON.stringify({ sid_list: sortedSites }),
                    onload: function(response) {
                        console.log('自动模式：汇报站点API响应状态:', response.status);
                        if (response.status === 200) {
                            try {
                                const data = JSON.parse(response.responseText);
                                if (data && data.code === 0 && data.data && data.data.sid_sha1) {
                                    const sidSha1 = data.data.sid_sha1;
                                    GM_setValue('cached_sid_sha1', sidSha1);
                                    GM_setValue('sid_sha1_cache_time', currentTime);
                                    resolve(sidSha1);
                                } else {
                                    if (cachedSidSha1) {
                                        console.log('自动模式：API异常，回退使用缓存值:', cachedSidSha1);
                                        resolve(cachedSidSha1);
                                    } else {
                                        reject(new Error(`自动模式：汇报站点API错误: ${data?.msg || '未知错误'}`));
                                    }
                                }
                            } catch (e) {
                                if (cachedSidSha1) {
                                    console.log('自动模式：解析异常，回退使用缓存值:', cachedSidSha1);
                                    resolve(cachedSidSha1);
                                } else {
                                    reject(new Error('自动模式：解析响应失败'));
                                }
                            }
                        } else {
                            if (cachedSidSha1) {
                                console.log('自动模式：HTTP异常，回退使用缓存值:', cachedSidSha1);
                                resolve(cachedSidSha1);
                            } else {
                                reject(new Error(`自动模式：HTTP ${response.status}`));
                            }
                        }
                    },
                    onerror: function(error) {
                        if (cachedSidSha1) {
                            console.log('自动模式：网络异常，回退使用缓存值:', cachedSidSha1);
                            resolve(cachedSidSha1);
                        } else {
                            reject(new Error(`自动模式：网络请求失败: ${error.message || '未知错误'}`));
                        }
                    }
                });
            });
        } catch (e) {
            console.error('获取sid_sha1（自动模式）失败:', e);
            throw e;
        }
    }
    
    // 获取用户站点信息函数已移除（API端点不可用，不影响核心功能）

    // 请求状态记录
    let __lastIyuuRequestParams = null; // 最近一次请求的关键参数（用于UI显示）
    let __lastInfoHash = null; // 主显示hash（通常为页面hash）
    let __lastInfoHashList = null; // 请求里实际使用的hash数组
    // 站点索引缓存
    let __iyuuSitesIndex = null;
    



    // 拉取并缓存 IYUU 支持站点列表
    async function fetchSupportedSitesIndex(force) {
        try {
            if (!force) {
                const cached = GM_getValue('iyuu_sites_index');
                const cachedAt = GM_getValue('iyuu_sites_index_time', 0);
                // 改为每周自动获取一次（7天 = 7 * 24 * 60 * 60 * 1000毫秒）
                if (cached && (Date.now() - cachedAt) < 7 * 24 * 60 * 60 * 1000) {
                    __iyuuSitesIndex = cached;
                    return cached;
                }
            }
            return await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: 'https://2025.iyuu.cn/reseed/sites/index',
                    headers: {
                        'Accept': 'application/json',
                        'Token': CONFIG.iyuuConfig.token
                    },
                    onload: function(response) {
                        try {
                            if (response.status !== 200) return reject(new Error(`站点索引HTTP错误: ${response.status}`));
                            const data = JSON.parse(response.responseText);
                            if (data && data.code === 0 && data.data) {
                                let map = {};
                                // 兼容两种格式：data.data.sites (数组) 或 data.data (对象)
                                if (Array.isArray(data.data.sites)) {
                                    // 旧格式：数组形式
                                    data.data.sites.forEach(s => { 
                                        if (s && typeof s.id === 'number') map[s.id] = s; 
                                    });
                                } else if (typeof data.data === 'object') {
                                    // 新格式：直接对象形式
                                    Object.keys(data.data).forEach(id => {
                                        const s = data.data[id];
                                        if (s && typeof s.id === 'number') map[s.id] = s;
                                    });
                                }
                                __iyuuSitesIndex = map;
                                try { 
                                    GM_setValue('iyuu_sites_index', map); 
                                    GM_setValue('iyuu_sites_index_time', Date.now()); 
                                } catch (e) { /* ignore */ }
                                resolve(map);
                            } else {
                                reject(new Error(`站点索引API错误: ${data?.msg || '未知错误'}`));
                            }
                        } catch (e) {
                            reject(new Error(`站点索引解析失败: ${e.message}`));
                        }
                    },
                    onerror: function(error) { reject(new Error(`站点索引网络失败: ${error.message || '未知错误'}`)); }
                });
            });
        } catch (e) {
            console.warn('获取站点索引失败（不影响主流程）:', e.message);
            return null;
        }
    }

    // 获取IYUU辅种信息（使用IYUU官方API）
    async function fetchIyuuInfo(hash) {
        console.log('请求IYUU官方API，hash:', hash);
        __lastInfoHash = hash;
        
        // 计算sha1参数：对hash数组进行排序，JSON编码，然后计算SHA1
        const hashArray = [hash];
        const sortedHashes = Array.from(new Set(hashArray)).sort();
        const jsonString = JSON.stringify(sortedHashes);
        const sha1Value = await calculateSHA1FromString(jsonString);
        __lastInfoHashList = [...sortedHashes];
        console.log('计算出的SHA1值:', sha1Value, '源字符串:', jsonString);
        
        // 获取sid_sha1值（sid_list 为空则跳过 IYUU）
        let sidSha1Value;
        let methodUsed;
        
        try {
            sidSha1Value = await getSidSha1();
            methodUsed = '动态获取';
            console.log(`使用动态获取的sid_sha1值: ${sidSha1Value}`);
        } catch (error) {
            if (error && /sid_list为空/.test(error.message || '')) {
                console.warn('sid_list为空，跳过 IYUU 查询，仅使用 ZMPT。');
                return null;
            }
            console.warn('动态获取sid_sha1失败，使用备选方案:', error.message);
            
            // 尝试多个备选的sid_sha1值
            const fallbackValues = [
                'f6a0f4e8787edd22b468dc0b5c77cc0b6ee0cb25', // 之前成功的值
                'da39a3ee5e6b4b0d3255bfef95601890afd80709', // 空字符串SHA1
                'bc1fe797097a907aa56b4b29da750572a2ac058a'  // 智能站点标识符SHA1
            ];
            
            // 尝试每个备选值
            for (let i = 0; i < fallbackValues.length; i++) {
                const fallbackValue = fallbackValues[i];
                console.log(`尝试备选方案 ${i + 1}: ${fallbackValue}`);
                
                try {
                    // 构建请求参数
                    const timestamp = Math.floor(Date.now() / 1000).toString();
                    const requestParams = {
                        hash: JSON.stringify(sortedHashes),
                        sha1: sha1Value,
                        sid_sha1: fallbackValue,
                        timestamp: timestamp,
                        version: '8.2.0'
                    };
                    
                    console.log('请求参数:', requestParams);
                    
                    // 发送测试请求
                    const testResponse = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: 'https://2025.iyuu.cn/reseed/index/index',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Token': CONFIG.iyuuConfig.token
                            },
                            data: new URLSearchParams(requestParams).toString(),
                            onload: function(response) {
                                console.log(`备选方案 ${i + 1} 响应状态:`, response.status);
                                console.log(`备选方案 ${i + 1} 响应内容:`, response.responseText);
                                
                                if (response.status === 200) {
                                    try {
                                        const data = JSON.parse(response.responseText);
                                        console.log(`备选方案 ${i + 1} 解析的API响应数据:`, data);
                                        
                                        // 保存最后一次响应数据，供调试函数使用
                                        window.__lastIyuuResponseData = data;
                                        
                                        // 检查响应格式
                                        if (data && typeof data.code !== 'undefined') {
                                            if (data.code === 0) {
                                                // 成功响应
                                                resolve(data);
                                            } else if (data.code === 400 && data.msg === '未查询到可辅种数据') {
                                                // 这是正常的"无辅种数据"响应
                                                console.log(`备选方案 ${i + 1} IYUU API返回：未查询到可辅种数据，这是正常响应`);
                                                resolve({
                                                    code: 0,
                                                    data: {},
                                                    msg: '未查询到可辅种数据'
                                                });
                                            } else {
                                                // 其他错误
                                                reject(new Error(`备选方案 ${i + 1} 失败: ${data?.msg || '未知错误'} (code: ${data.code})`));
                                            }
                                        } else {
                                            reject(new Error(`备选方案 ${i + 1} API响应格式异常，缺少code字段`));
                                        }
                                    } catch (parseError) {
                                        reject(new Error(`解析备选方案 ${i + 1} 响应失败: ${parseError.message}`));
                                    }
                                } else {
                                    reject(new Error(`备选方案 ${i + 1} HTTP错误: ${response.status}`));
                                }
                            },
                            onerror: function(error) {
                                reject(new Error(`备选方案 ${i + 1} 网络请求失败: ${error.message || '未知错误'}`));
                            }
                        });
                    });
                    
                    // 如果成功，使用这个值
                    sidSha1Value = fallbackValue;
                    methodUsed = `备选方案${i + 1}`;
                    console.log(`备选方案 ${i + 1} 成功，使用: ${fallbackValue}`);
                    
                    // 缓存成功的值
                    GM_setValue('cached_sid_sha1', fallbackValue);
                    GM_setValue('sid_sha1_cache_time', Date.now());
                    
                    return testResponse;
                    
                } catch (fallbackError) {
                    console.log(`备选方案 ${i + 1} 失败:`, fallbackError.message);
                    continue;
                }
            }
            
            // 如果所有备选方案都失败，使用空字符串SHA1作为最后备选
            sidSha1Value = 'da39a3ee5e6b4b0d3255bfef95601890afd80709';
            methodUsed = '空字符串SHA1(最后备选)';
            console.log(`所有备选方案都失败，使用空字符串SHA1: ${sidSha1Value}`);
        }
        
        console.log(`最终使用 ${methodUsed}: ${sidSha1Value}`);
        
        // 构建请求参数
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const requestParams = {
            hash: JSON.stringify(sortedHashes),
            sha1: sha1Value,
            sid_sha1: sidSha1Value,
            timestamp: timestamp,
            version: '8.2.0'
        };
        
        console.log('请求参数:', requestParams);
        __lastIyuuRequestParams = { ...requestParams };
        
        // 发送请求（带超时和重试机制）
        return new Promise((resolve, reject) => {
            let retryCount = 0;
            const maxRetries = 2;
            const timeout = 20000; // 20秒超时
            
            function makeRequest() {
                const timeoutId = setTimeout(() => {
                    console.warn(`请求超时 (${timeout}ms)`);
                    if (retryCount < maxRetries) {
                        retryCount++;
                        console.log(`重试第 ${retryCount} 次...`);
                        setTimeout(makeRequest, 1000); // 1秒后重试
                    } else {
                        reject(new Error(`请求超时，已重试 ${maxRetries} 次`));
                    }
                }, timeout);
                
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://2025.iyuu.cn/reseed/index/index',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Token': CONFIG.iyuuConfig.token
                    },
                    data: new URLSearchParams(requestParams).toString(),
                    onload: function(response) {
                        clearTimeout(timeoutId);
                        console.log('IYUU官方API响应状态:', response.status);
                        console.log('IYUU官方API响应内容:', response.responseText);
                        
                        if (response.status === 200) {
                            try {
                                const data = JSON.parse(response.responseText);
                                console.log('解析的API响应数据:', data);
                                
                                // 保存最后一次响应数据，供调试函数使用
                                window.__lastIyuuResponseData = data;
                                
                                // 检查响应格式
                                if (data && typeof data.code !== 'undefined') {
                                    if (data.code === 0) {
                                        // 成功响应
                                        resolve(data);
                                    } else if (data.code === 400 && data.msg === '未查询到可辅种数据') {
                                        // 这是正常的"无辅种数据"响应，应该返回空数据而不是报错
                                        console.log('IYUU API返回：未查询到可辅种数据，这是正常响应');
                                        resolve({
                                            code: 0,
                                            data: {},
                                            msg: '未查询到可辅种数据'
                                        });
                                    } else if (data.code === 400 && data.msg === '站点缓存哈希值无效') {
                                        // 自动回退：使用自动模式 sid_sha1 重试一次
                                        (async () => {
                                            try {
                                                console.warn('IYUU 返回站点缓存哈希值无效，尝试自动回退 sid_sha1 重试...');
                                                const autoSid = await getSidSha1AutoOnly();
                                                const retryParams = { ...requestParams, sid_sha1: autoSid, timestamp: Math.floor(Date.now() / 1000).toString() };
                                                console.log('回退重试参数:', retryParams);
                                                __lastIyuuRequestParams = { ...retryParams };
                                                GM_xmlhttpRequest({
                                                    method: 'POST',
                                                    url: 'https://2025.iyuu.cn/reseed/index/index',
                                                    headers: {
                                                        'Content-Type': 'application/x-www-form-urlencoded',
                                                        'Token': CONFIG.iyuuConfig.token
                                                    },
                                                    data: new URLSearchParams(retryParams).toString(),
                                                    onload: function(r2) {
                                                        console.log('回退重试响应状态:', r2.status);
                                                        if (r2.status === 200) {
                                                            try {
                                                                const d2 = JSON.parse(r2.responseText);
                                                                console.log('回退重试解析数据:', d2);
                                                                
                                                                // 保存最后一次响应数据，供调试函数使用
                                                                window.__lastIyuuResponseData = d2;
                                                                
                                                                if (typeof d2.code !== 'undefined') {
                                                                    if (d2.code === 0) return resolve(d2);
                                                                    if (d2.code === 400 && d2.msg === '未查询到可辅种数据') {
                                                                        return resolve({ code: 0, data: {}, msg: '未查询到可辅种数据' });
                                                                    }
                                                                }
                                                                reject(new Error(`回退重试失败: ${d2?.msg || '未知错误'} (code: ${d2?.code})`));
                                                            } catch (e2) {
                                                                reject(new Error(`回退重试解析失败: ${e2.message}`));
                                                            }
                                                        } else {
                                                            reject(new Error(`回退重试HTTP错误: ${r2.status}`));
                                                        }
                                                    },
                                                    onerror: function(e2) {
                                                        reject(new Error(`回退重试网络失败: ${e2.message || '未知错误'}`));
                                                    }
                                                });
                                            } catch (autoErr) {
                                                reject(new Error(`自动回退获取sid_sha1失败: ${autoErr.message}`));
                                            }
                                        })();
                                    } else {
                                        // 其他错误
                                        reject(new Error(`IYUU API Error: ${data?.msg || '未知错误'} (code: ${data.code})`));
                                    }
                                } else {
                                    reject(new Error('API响应格式异常，缺少code字段'));
                                }
                            } catch (parseError) {
                                reject(new Error(`解析响应数据失败: ${parseError.message}`));
                            }
                        } else {
                            reject(new Error(`HTTP Error: ${response.status}`));
                        }
                    },
                    onerror: function(error) {
                        clearTimeout(timeoutId);
                        console.error('网络请求失败:', error);
                        
                        if (retryCount < maxRetries) {
                            retryCount++;
                            console.log(`网络错误，重试第 ${retryCount} 次...`);
                            setTimeout(makeRequest, 2000); // 2秒后重试
                        } else {
                            reject(new Error(`网络请求失败，已重试 ${maxRetries} 次: ${error.message || '未知错误'}`));
                        }
                    }
                });
            }
            
            makeRequest();
        });
    }

    // 获取混合数据源辅种信息（IYUU + ZMPT）
    async function fetchHybridIyuuInfo(hash) {
        console.log('=== 开始获取混合数据源辅种信息 ===');
        
        try {
            // 并行请求IYUU和ZMPT API
            const [iyuuPromise, zmptPromise] = [
                fetchIyuuInfo(hash),
                fetchZmptInfo(hash)
            ];

            // 等待两个API都完成
            const [iyuuData, zmptData] = await Promise.allSettled([iyuuPromise, zmptPromise]);
            
            console.log('IYUU API结果:', iyuuData);
            console.log('ZMPT API结果:', zmptData);

            // 处理IYUU结果
            let iyuuResult = null;
            if (iyuuData.status === 'fulfilled') {
                iyuuResult = iyuuData.value;
                console.log('IYUU API成功:', iyuuResult);
            } else {
                console.warn('IYUU API失败:', iyuuData.reason);
            }

            // 处理ZMPT结果
            let zmptResult = null;
            if (zmptData.status === 'fulfilled') {
                zmptResult = zmptData.value;
                console.log('ZMPT API成功:', zmptResult);
            } else {
                console.warn('ZMPT API失败:', zmptData.reason);
            }

            // 合并数据
            const mergedData = mergeReseedData(iyuuResult, zmptResult);
            console.log('混合数据源合并结果:', mergedData);
            
            return mergedData;

        } catch (error) {
            console.error('混合数据源请求失败:', error);
            // 如果混合数据源失败，回退到IYUU单数据源
            console.log('回退到IYUU单数据源...');
            try {
                const iyuuData = await fetchIyuuInfo(hash);
                return iyuuData;
            } catch (fallbackError) {
                console.error('IYUU回退也失败:', fallbackError);
                throw fallbackError;
            }
        }
    }
    
    // 测试不同的sid_sha1值
    async function testDifferentSidSha1(hash) {
        console.log('=== 测试不同的sid_sha1值 ===');
        
        const testCases = [
            { name: '域名（无www）', value: window.location.hostname.replace(/^www\./, '') },
            { name: '完整URL', value: window.location.origin },
            { name: '域名（有www）', value: window.location.hostname },
            { name: '空字符串', value: '' },
            { name: '域名小写', value: window.location.hostname.replace(/^www\./, '').toLowerCase() },
            { name: '域名大写', value: window.location.hostname.replace(/^www\./, '').toUpperCase() },
            { name: '域名无点', value: window.location.hostname.replace(/^www\./, '').replace(/\./g, '') },
            { name: '域名点变下划线', value: window.location.hostname.replace(/^www\./, '').replace(/\./g, '_') }
        ];
        
        for (const testCase of testCases) {
            const sha1Value = await calculateSHA1FromString(testCase.value);
            console.log(`${testCase.name}: ${sha1Value} (基于: ${testCase.value})`);
        }
        
        console.log('=== 测试完成 ===');
    }
    

    

    
    // 清除sid_sha1缓存
    function clearSidSha1Cache() {
        GM_setValue('cached_sid_sha1', null);
        GM_setValue('sid_sha1_cache_time', null);
        GM_setValue('last_sid_sha1_request', null);
        console.log('已清除sid_sha1缓存');
        console.log('下次请求将重新获取sid_sha1值');
    }
    
    // 显示当前缓存状态
    function showCacheStatus() {
        console.log('=== 当前缓存状态 ===');
        const cachedSidSha1 = GM_getValue('cached_sid_sha1');
        const cacheTime = GM_getValue('sid_sha1_cache_time', 0);
        const lastRequestTime = GM_getValue('last_sid_sha1_request', 0);
        const currentTime = Date.now();
        
        console.log('缓存的sid_sha1:', cachedSidSha1 || '无');
        console.log('缓存时间:', cacheTime ? new Date(cacheTime).toLocaleString() : '无');
        console.log('距离缓存时间:', cacheTime ? Math.floor((currentTime - cacheTime) / 1000) + '秒' : '无');
        console.log('上次请求时间:', lastRequestTime ? new Date(lastRequestTime).toLocaleString() : '无');
        console.log('距离上次请求:', lastRequestTime ? Math.floor((currentTime - lastRequestTime) / 1000) + '秒' : '无');
        console.log('=== 缓存状态结束 ===');
    }
    




    // 创建悬浮按钮
    function createFloatingButton() {
        // 检查是否已存在
        if (document.getElementById('iyuu-floating-btn')) {
            return;
        }

        const button = document.createElement('div');
        button.id = 'iyuu-floating-btn';
        button.innerHTML = `
            <div class="iyuu-btn-icon">🌱</div>
            <div class="iyuu-btn-text">辅种</div>
        `;
        
        // 添加点击事件
        button.addEventListener('click', togglePopup);
        
        // 添加拖拽功能
        setupDraggable(button);
        
        document.body.appendChild(button);
        return button;
    }

    // 设置悬浮按钮拖拽功能
    function setupDraggable(button) {
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        let dragStartTime = 0;
        let dragThreshold = 8; // 拖拽阈值，移动超过8像素才算拖拽
        let clickTimeout = null;
        
        // 鼠标按下事件
        button.addEventListener('mousedown', function(e) {
            // 记录按下时间
            dragStartTime = Date.now();
            
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseInt(button.style.left) || 20;
            startTop = parseInt(button.style.top) || (window.innerHeight / 2 - 30);
            
            // 清除之前的点击超时
            if (clickTimeout) {
                clearTimeout(clickTimeout);
                clickTimeout = null;
            }
            
            e.preventDefault();
        });
        
        // 鼠标移动事件
        document.addEventListener('mousemove', function(e) {
            if (!startX && !startY) return; // 如果没有按下，直接返回
            
            const deltaX = Math.abs(e.clientX - startX);
            const deltaY = Math.abs(e.clientY - startY);
            
            // 如果移动距离超过阈值，开始拖拽
            if (!isDragging && (deltaX > dragThreshold || deltaY > dragThreshold)) {
                isDragging = true;
                button.classList.add('dragging');
                console.log('开始拖拽悬浮按钮');
                
                // 拖拽时禁用点击事件
                button.style.pointerEvents = 'none';
            }
            
            if (isDragging) {
                const newLeft = startLeft + (e.clientX - startX);
                const newTop = startTop + (e.clientY - startY);
                
                // 限制按钮不超出屏幕边界
                const maxLeft = window.innerWidth - 60;
                const maxTop = window.innerHeight - 60;
                
                button.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + 'px';
                button.style.top = Math.max(0, Math.min(newTop, maxTop)) + 'px';
            }
        });
        
        // 鼠标释放事件
        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                button.classList.remove('dragging');
                
                // 恢复点击事件
                button.style.pointerEvents = 'auto';
                
                // 保存位置到本地存储
                const position = {
                    left: parseInt(button.style.left) || 20,
                    top: parseInt(button.style.top) || (window.innerHeight / 2 - 30)
                };
                GM_setValue('iyuu_button_position', position);
                console.log('拖拽结束，位置已保存');
                
                // 拖拽后延迟恢复点击功能，防止误触
                setTimeout(() => {
                    button.style.pointerEvents = 'auto';
                }, 100);
            } else {
                // 如果没有拖拽，设置一个短暂的延迟来区分点击和拖拽
                clickTimeout = setTimeout(() => {
                    // 这里可以添加点击后的逻辑，但现在是空的
                    // 因为点击事件由 togglePopup 处理
                }, 50);
            }
            
            // 重置状态
            startX = startY = 0;
        });
        
        // 加载保存的位置
        const savedPosition = GM_getValue('iyuu_button_position', null);
        if (savedPosition) {
            button.style.left = savedPosition.left + 'px';
            button.style.top = savedPosition.top + 'px';
        }
    }

    // 创建弹出窗口
    function createPopup() {
        // 检查是否已存在
        if (document.getElementById('iyuu-popup')) {
            return;
        }

        console.log('创建弹出窗口...');

        const popup = document.createElement('div');
        popup.id = 'iyuu-popup';
        popup.innerHTML = `
            <div class="iyuu-popup-content">
                <div class="iyuu-loading">正在获取辅种信息...</div>
            </div>
        `;
        
        // 移除点击外部关闭功能，只能通过关闭按钮关闭弹窗
        
        document.body.appendChild(popup);
        
        console.log('弹出窗口已创建');
        return popup;
    }

    // 防止重复请求的标志
    let isRequesting = false;
    
    // 关闭弹出窗口的函数
    function closeIyuuPopup() {
        console.log('尝试关闭弹窗...');
        const popup = document.getElementById('iyuu-popup');
        if (popup) {
            popup.style.display = 'none';
            console.log('弹窗已关闭');
        } else {
            console.warn('弹窗元素未找到');
        }
    }
    
    // 将关闭函数暴露到全局作用域
    window.closeIyuuPopup = closeIyuuPopup;
    
    // 显示主弹窗界面
    function showMainInterface() {
        const popup = document.getElementById('iyuu-popup');
        if (!popup) return;

        const contentElement = popup.querySelector('.iyuu-popup-content');

        // 如果有已获取的辅种数据，直接显示
        if (currentSeedData) {
            updateSeedInfoDisplay(currentSeedData);
            return;
        }

        // 显示主界面内容
        contentElement.innerHTML = `
            <div class="iyuu-main-interface" style="text-align: center; padding: 20px;">
                <div style="margin-bottom: 20px;">
                    <h3 style="color: #1976d2; margin-bottom: 10px;">IYUU辅种信息助手</h3>
                    <p style="color: #666; font-size: 14px;">请选择要执行的操作</p>
                </div>
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                    <button id="iyuu-get-seed-info"
                            style="padding: 10px 20px; background: #2196f3; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;">
                        🔍 获取辅种信息
                    </button>
                    <button id="iyuu-config-token"
                            style="padding: 10px 20px; background: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;">
                        🔑 配置令牌
                    </button>
                </div>
            </div>
        `;

        // 添加主界面事件监听器
        setupMainInterfaceEventListeners();
    }

    // 设置主界面事件监听器
    function setupMainInterfaceEventListeners() {
        // 获取辅种信息按钮
        const getSeedInfoBtn = document.getElementById('iyuu-get-seed-info');
        if (getSeedInfoBtn) {
            getSeedInfoBtn.addEventListener('click', function() {
                if (!isRequesting) {
                    isRequesting = true;
                    getAndDisplaySeedInfo().finally(() => {
                        isRequesting = false;
                    });
                }
            });
        }

        // 配置令牌按钮
        const configTokenBtn = document.getElementById('iyuu-config-token');
        if (configTokenBtn) {
            configTokenBtn.addEventListener('click', function() {
                showTokenConfigInterface();
            });
        }
    }

    // 显示站点设置界面
    async function showSiteSettingsInterface() {
        const popup = document.getElementById('iyuu-popup');
        if (!popup) return;

        const contentElement = popup.querySelector('.iyuu-popup-content');

        // 显示加载状态
        contentElement.innerHTML = `
            <div class="iyuu-site-settings" style="text-align: center; padding: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h2 style="color: #1976d2; margin: 0; font-size: 24px; font-weight: 600; background: none;">站点设置</h2>
                    <div style="display: flex; gap: 10px;">
                        <button id="iyuu-return-main" style="padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 500;">
                            ← 返回主界面
                        </button>
                        <button id="iyuu-refresh-sites" style="padding: 8px 16px; background: #ff9800; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 500;">
                            🔄 刷新
                        </button>
                        <button id="iyuu-save-sites" style="padding: 8px 16px; background: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 500;">
                            💾 保存站点
                        </button>
                    </div>
                </div>
                <p style="color: #666; font-size: 14px; margin-bottom: 15px;">请勾选您已拥有的站点</p>
                <div class="iyuu-loading" style="padding: 20px;">
                    <div style="color: #666;">正在加载站点列表...</div>
                </div>
            </div>
        `;

        try {
            // 获取站点索引
            const sitesIndex = await fetchSupportedSitesIndex(false);
            if (!sitesIndex || Object.keys(sitesIndex).length === 0) {
                contentElement.innerHTML = `
                    <div class="iyuu-site-settings" style="text-align: center; padding: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                            <h2 style="color: #1976d2; margin: 0; font-size: 24px; font-weight: 600; background: none;">站点设置</h2>
                            <div style="display: flex; gap: 10px;">
                                <button id="iyuu-return-main" style="padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 500;">
                                    ← 返回主界面
                                </button>
                                <button id="iyuu-refresh-sites" style="padding: 8px 16px; background: #ff9800; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 500;">
                                    🔄 刷新
                                </button>
                                <button id="iyuu-save-sites" style="padding: 8px 16px; background: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 500;">
                                    💾 保存站点
                                </button>
                            </div>
                        </div>
                        <p style="color: #666; font-size: 14px; margin-bottom: 15px;">请勾选您已拥有的站点</p>
                        <div style="color: #dc3545; padding: 20px;">
                            无法加载站点列表，请检查网络连接或IYUU令牌配置
                        </div>
                    </div>
                `;
                return;
            }

            // 获取已保存的站点设置
            const savedSites = GM_getValue('iyuu_owned_sites', []);

            // 将站点转换为数组并排序
            const sitesArray = Object.values(sitesIndex).map(site => ({
                id: site.id,
                name: site.nickname || site.site || `站点${site.id}`,
                url: site.base_url || '',
                sortKey: getSortKey(site.nickname || site.site || `站点${site.id}`)
            })).sort((a, b) => a.sortKey.localeCompare(b.sortKey));

            // 生成站点列表HTML（四列布局）
            const sitesListHTML = sitesArray.map(site => {
                const isChecked = savedSites.includes(site.id);
                return `
                    <label style="display: flex; align-items: center; gap: 4px; padding: 4px; border: 1px solid #eee; border-radius: 3px; cursor: pointer; font-size: 11px; background: white; min-height: 35px;">
                        <input type="checkbox" data-site-id="${site.id}" ${isChecked ? 'checked' : ''} style="transform: scale(1.0); flex-shrink: 0;">
                        <div style="flex: 1; text-align: left; overflow: hidden;">
                            <div style="font-weight: 500; color: #333; margin-bottom: 1px; font-size: 10px;">${site.name}</div>
                            <div style="color: #999; font-size: 9px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${site.url}</div>
                        </div>
                    </label>
                `;
            }).join('');

            // 显示站点设置界面
            contentElement.innerHTML = `
                <div class="iyuu-site-settings" style="text-align: center; padding: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <h2 style="color: #1976d2; margin: 0; font-size: 24px; font-weight: 600; background: none;">站点设置</h2>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <div style="display:flex; align-items:center; gap:6px; background:#f8f9fa; border:1px solid #dee2e6; border-radius:6px; padding:6px 8px;">
                                <label for="iyuu-mteam-token" style="font-size:12px;color:#333;">MT令牌</label>
                                <input id="iyuu-mteam-token" type="text" value="${GM_getValue('mteam_dl_token','')}" placeholder="粘贴 m-team genDlToken 的 token" style="width:240px; padding:6px 8px; border:1px solid #ced4da; border-radius:4px; font-size:12px;" />
                                <button id="iyuu-mteam-token-save" style="padding:6px 10px; background:#4caf50; color:#fff; border:none; border-radius:4px; cursor:pointer; font-size:12px;">保存</button>
                                <button id="iyuu-mteam-token-test" style="padding:6px 10px; background:#2196f3; color:#fff; border:none; border-radius:4px; cursor:pointer; font-size:12px;">测试</button>
                            </div>
                            <button id="iyuu-return-main" style="padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 500;">
                                ← 返回
                            </button>
                            <button id="iyuu-refresh-sites" style="padding: 8px 16px; background: #ff9800; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 500;">
                                🔄 刷新
                            </button>
                            <button id="iyuu-save-sites" style="padding: 8px 16px; background: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 500;">
                                💾 保存站点
                            </button>
                        </div>
                    </div>
                    <p style="color: #666; font-size: 14px; margin-bottom: 15px;">请勾选您已拥有的站点</p>
                    <div style="max-height: 350px; overflow-y: auto; border: 1px solid #ddd; border-radius: 4px; background: white; padding: 10px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 6px;">
                            ${sitesListHTML}
                        </div>
                    </div>
                </div>
            `;

            // 添加事件监听器
            setupSiteSettingsEventListeners();
            // 馒头令牌事件
            const mtokenInput = document.getElementById('iyuu-mteam-token');
            const mtokenSave = document.getElementById('iyuu-mteam-token-save');
            const mtokenTest = document.getElementById('iyuu-mteam-token-test');
            if (mtokenSave) {
                mtokenSave.addEventListener('click', ()=>{
                    const v = (mtokenInput && mtokenInput.value.trim()) || '';
                    GM_setValue('mteam_dl_token', v);
                    showMessage(v ? '✅ 已保存MT令牌' : '已清空MT令牌', v ? 'success' : 'info');
                });
            }
            if (mtokenTest) {
                mtokenTest.addEventListener('click', async ()=>{
                    try {
                        const token = (mtokenInput && mtokenInput.value.trim()) || GM_getValue('mteam_dl_token','');
                        if (!token) { showMessage('❌ 令牌为空，无法测试', 'error'); return; }
                        // 选一个可用的馒头种子ID用于测试：优先当前弹窗已加载数据中的 m-team；否则用当前页解析的 id
                        let testId = null;
                        try {
                            if (currentSeedData && currentSeedData.data) {
                                const all = [];
                                Object.values(currentSeedData.data).forEach(it=>{ if (it && Array.isArray(it.torrent)) all.push(...it.torrent); });
                                const mt = all.find(t=> parseInt(t.sid)===3 || /m-team/i.test(String((__iyuuSitesIndex&&__iyuuSitesIndex[t.sid]&&__iyuuSitesIndex[t.sid].site)||'')) );
                                if (mt && mt.torrent_id) testId = mt.torrent_id;
                            }
                        } catch(_) {}
                        if (!testId) {
                            const idFromUrl = extractTorrentIdFromUrl(location.href);
                            if (idFromUrl) testId = idFromUrl;
                        }
                        if (!testId) { showMessage('❌ 未找到用于测试的种子ID', 'error'); return; }
                        // 参考仓库：使用 POST + x-api-key + multipart/form-data
                        const form = new FormData();
                        form.append('id', String(testId));
                        const resp = await gmRequest({ method:'POST', url:`https://api.m-team.cc/api/torrent/genDlToken`, headers:{ Referer: 'https://kp.m-team.cc/', 'x-api-key': token }, data: form });
                        const ok = !!(resp && resp.json && resp.json.data);
                        showMessage(ok ? '✅ 令牌测试成功，可生成下载链接' : `❌ 令牌测试失败：${resp.status||''}`, ok?'success':'error');
                    } catch(e) {
                        showMessage('❌ 令牌测试异常：' + (e.message||e), 'error');
                    }
                });
            }

        } catch (error) {
            console.error('加载站点设置失败:', error);
            contentElement.innerHTML = `
                <div class="iyuu-site-settings" style="text-align: center; padding: 20px;">
                    <div style="margin-bottom: 20px;">
                        <h3 style="color: #1976d2; margin-bottom: 10px;">站点设置</h3>
                        <p style="color: #666; font-size: 14px;">请勾选您已拥有的站点</p>
                    </div>
                    <div style="color: #dc3545; padding: 20px;">
                        加载失败: ${error.message}
                    </div>
                </div>
            `;
        }
    }

    // 获取排序键（支持中文拼音首字母排序）
    function getSortKey(text) {
        if (!text) return '';

        // 提取首字母（支持英文和中文）
        const firstChar = text.charAt(0);

        // 如果是英文字母，直接返回小写
        if (/[a-zA-Z]/.test(firstChar)) {
            return firstChar.toLowerCase();
        }

        // 如果是中文，尝试转换为拼音首字母
        // 这里使用简单的映射，实际项目中可以使用完整的拼音库
        const pinyinMap = {
            '阿': 'a', '八': 'b', '擦': 'c', '搭': 'd', '蛾': 'e', '发': 'f', '旮': 'g', '哈': 'h',
            '伊': 'i', '击': 'j', '喀': 'k', '垃': 'l', '妈': 'm', '拿': 'n', '哦': 'p', '啪': 'p',
            '期': 'q', '然': 'r', '撒': 's', '塌': 't', '屋': 'u', '蛙': 'w', '夕': 'x', '丫': 'y', '咋': 'z'
        };

        // 返回拼音首字母或原字符
        return pinyinMap[firstChar] || firstChar;
    }

    // 设置站点设置界面的事件监听器
    function setupSiteSettingsEventListeners() {
        // 刷新按钮
        const refreshButton = document.getElementById('iyuu-refresh-sites');
        if (refreshButton) {
            refreshButton.addEventListener('click', async function() {
                // 显示刷新状态
                refreshButton.textContent = '🔄 刷新中...';
                refreshButton.disabled = true;

                try {
                    // 强制重新获取站点索引
                    await fetchSupportedSitesIndex(true);

                    // 重新显示站点设置界面（保持已勾选状态）
                    await showSiteSettingsInterface();

                    console.log('站点列表已刷新');
                } catch (error) {
                    console.error('刷新失败:', error);
                    showMessage('❌ 刷新失败: ' + error.message, 'error');

                    // 恢复按钮状态
                    refreshButton.textContent = '🔄 刷新';
                    refreshButton.disabled = false;
                }
            });
        }

        // 返回主界面按钮
        const returnMainButton = document.getElementById('iyuu-return-main');
        if (returnMainButton) {
            returnMainButton.addEventListener('click', function() {
                console.log('返回主界面按钮被点击');
                showMainInterface();
            });
        }

        // 保存设置按钮
        const saveButton = document.getElementById('iyuu-save-sites');
        if (saveButton) {
            saveButton.addEventListener('click', function() {
                const checkboxes = document.querySelectorAll('.iyuu-site-settings input[type="checkbox"]');
                const selectedSites = [];

                checkboxes.forEach(checkbox => {
                    if (checkbox.checked) {
                        const siteId = parseInt(checkbox.getAttribute('data-site-id'));
                        if (siteId) {
                            selectedSites.push(siteId);
                        }
                    }
                });

                // 保存到本地存储
                GM_setValue('iyuu_owned_sites', selectedSites);
                console.log('已保存站点设置:', selectedSites);

                // 显示成功消息
                showMessage(`✅ 已保存 ${selectedSites.length} 个站点设置！`, 'success');
            });
        }
    }

    // 显示IYUU令牌配置界面
    function showTokenConfigInterface() {
        const popup = document.getElementById('iyuu-popup');
        if (!popup) return;
        
        const contentElement = popup.querySelector('.iyuu-popup-content');
        const savedToken = GM_getValue('iyuu_token', '');
        const configToken = CONFIG.iyuuConfig.token;
        const currentToken = savedToken || configToken || '';
        const isDefaultToken = !currentToken || currentToken.trim() === '';
        
        console.log('Token状态检查:', {
            savedToken: savedToken ? '已保存' : '未保存',
            configToken: configToken ? '已配置' : '未配置',
            currentToken: currentToken ? '有值' : '无值',
            isDefaultToken: isDefaultToken
        });
        
        contentElement.innerHTML = `
            <div class="iyuu-token-config" style="margin-top: 10px; padding: 20px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 5px; font-size: 14px; text-align: center;">
                <div style="margin-bottom: 15px; font-weight: bold; color: #1976d2; font-size: 16px;">
                    🔑 IYUU 令牌配置
                    <span style="font-size: 12px; color: #666; margin-left: 10px;">点击<a href="https://iyuu.cn/" target="_blank" style="color: #1976d2; text-decoration: underline;">获取令牌</a>前往iyuu官网-开始使用-微信扫码-关注iyuu公众号-确认授权</span>
                </div>
                <div style="margin-bottom: 15px; position: relative;">
                    <input type="password" id="iyuu-token-input" 
                           placeholder="请输入您的IYUU API Token" 
                           value="${currentToken}"
                           style="width: 60%; padding: 8px; padding-right: 35px; border: 1px solid #ccc; border-radius: 4px; font-size: 13px;">
                    <span id="iyuu-toggle-visibility" 
                          style="position: absolute; right: 22%; top: 50%; transform: translateY(-50%); cursor: pointer; font-size: 16px; color: #666; user-select: none;">
                        👁️
                    </span>
                </div>
                <div style="display: flex; gap: 10px; margin-bottom: 15px; justify-content: center;">
                    <button id="iyuu-return-main-from-token"
                            style="padding: 6px 12px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px;">
                        ← 返回主界面
                    </button>
                    <button id="iyuu-save-token" 
                            style="padding: 6px 12px; background: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px;">
                        保存令牌
                    </button>
                    <button id="iyuu-clear-token" 
                            style="padding: 6px 12px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px;">
                        清除令牌
                    </button>
                </div>
                <div style="font-size: 12px; color: #666;">
                    ${isDefaultToken ? '⚠️ 请输入您的IYUU 令牌' : '✏️ 可以修改令牌'}
                </div>
            </div>
        `;
        
        // 添加事件监听器
        setupTokenConfigEventListeners();
    }

    // 设置IYUU令牌配置界面的事件监听器
    function setupTokenConfigEventListeners() {
        // 返回主界面按钮
        const returnMainBtn = document.getElementById('iyuu-return-main-from-token');
        if (returnMainBtn) {
            returnMainBtn.addEventListener('click', function() {
                console.log('返回主界面按钮被点击');
                showMainInterface();
            });
        }

        // 保存令牌按钮
        const saveButton = document.getElementById('iyuu-save-token');
        if (saveButton) {
            saveButton.addEventListener('click', function() {
                const tokenInput = document.getElementById('iyuu-token-input');
                const token = tokenInput.value.trim();
                
                // 直接保存令牌（无论是否填写）
                GM_setValue('iyuu_token', token);
                CONFIG.iyuuConfig.token = token;
                
                console.log('IYUU 令牌已保存:', token || '(空值)');

                // 显示成功消息
                if (token && token.trim() !== '') {
                    showMessage('✅ IYUU令牌已保存！', 'success');
                } else {
                    showMessage('⚠️ IYUU令牌已清空！', 'warning');
                }
            });
        }



        // 清除令牌按钮
        const clearButton = document.getElementById('iyuu-clear-token');
        if (clearButton) {
            clearButton.addEventListener('click', function() {
                if (confirm('确定要清除已保存的IYUU 令牌吗？')) {
                    GM_setValue('iyuu_token', '');
                    CONFIG.iyuuConfig.token = '';
                    
                    console.log('IYUU 令牌已清除');
                    showMessage('✅ 令牌已清除！', 'success');
                    
                    // 重新显示配置界面
                    showTokenConfigInterface();
                }
            });
        }
        
        // 切换令牌显示/隐藏
        const toggleVisibility = document.getElementById('iyuu-toggle-visibility');
        if (toggleVisibility) {
            toggleVisibility.addEventListener('click', function() {
                const tokenInput = document.getElementById('iyuu-token-input');
                if (tokenInput.type === 'password') {
                    tokenInput.type = 'text';
                    toggleVisibility.textContent = '🙈';
                } else {
                    tokenInput.type = 'password';
                    toggleVisibility.textContent = '👁️';
                }
            });
        }
    }

    // 切换弹出窗口显示/隐藏
    function togglePopup() {
        const popup = document.getElementById('iyuu-popup');
        if (!popup) {
            createPopup();
            return;
        }
        
        if (popup.style.display === 'none' || popup.style.display === '') {
            popup.style.display = 'flex';
            
            // 检查是否已配置IYUU令牌
            const savedToken = GM_getValue('iyuu_token', '');
            const hasToken = CONFIG.iyuuConfig.token && CONFIG.iyuuConfig.token.trim() !== '';
            
            if (!savedToken && !hasToken) {
                // 未配置令牌，显示主界面
                console.log('未配置IYUU令牌，显示主界面');
                showMainInterface();
            } else {
                // 已配置令牌，获取辅种信息
                console.log('已配置IYUU令牌，获取辅种信息');
                if (!isRequesting) {
                    isRequesting = true;
                    getAndDisplaySeedInfo().finally(() => {
                        isRequesting = false;
                    });
                }
            }
        } else {
            closeIyuuPopup();
        }
    }

    // 更新辅种信息显示
    async function updateSeedInfoDisplay(data) {
        const popup = document.getElementById('iyuu-popup');
        if (!popup) return;

        // 保存当前的辅种数据
        currentSeedData = data;

        const contentElement = popup.querySelector('.iyuu-popup-content');

        // 检查新API的数据结构
        if (!data || !data.data || Object.keys(data.data).length === 0) {
            contentElement.innerHTML = `
                <div class="iyuu-no-data">
                    <div class="iyuu-no-data-icon">📭</div>
                    <div class="iyuu-no-data-text">该种子在其他站点暂无辅种信息</div>
                </div>
            `;
            return;
        }

        // 创建辅种链接容器
        const linksContainer = document.createElement('div');
        linksContainer.className = 'iyuu-links-container';
        
        // 添加标题栏
        const headerDiv = document.createElement('div');
        headerDiv.className = 'iyuu-popup-header';
        headerDiv.innerHTML = `
            <h3>IYUU辅种信息</h3>
            <div style="display: flex; gap: 12px; align-items: center;">
                <button class="iyuu-config-btn" style="padding: 6px 12px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 500; min-width: 90px;">
                    🔑 iyuu令牌
                </button>
                <button class="iyuu-site-settings-btn" style="padding: 6px 12px; background: #2196f3; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 500; min-width: 90px;">
                    🏠 站点设置
                </button>
                <button class="iyuu-downloader-settings-btn" style="padding: 6px 12px; background: #ffc107; color: #333; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 500; min-width: 90px;">
                    ⚡ 下载器设置
                </button>
                <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; color: #333; font-weight: 500;">
                    <input type="checkbox" class="iyuu-owned-sites-checkbox" style="margin: 0; transform: scale(1.2);" ${GM_getValue('iyuu_filter_owned_sites', false) ? 'checked' : ''}>
                    已拥有站点
                </label>
                <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; color: #333; font-weight: 500;">
                    <input type="checkbox" class="iyuu-skip-verify-checkbox" style="margin: 0; transform: scale(1.2);" ${GM_getValue('iyuu_skip_verify', false) ? 'checked' : ''}>
                    跳过校验
                </label>
                <button class="iyuu-download-torrent-btn" style="padding: 6px 12px; background: #17a2b8; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 500; min-width: 90px;">
                    📥 下载种子
                </button>
                <button class="iyuu-auto-seed-btn" style="padding: 6px 12px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 500; min-width: 90px;">
                    🚀 一键辅种
                </button>
                <button class="iyuu-close-btn" style="padding: 6px 10px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: bold; min-width: 30px;">×</button>
            </div>
        `;
        contentElement.appendChild(headerDiv);
        
        // 为iyuu令牌按钮添加事件监听器
        const configBtn = headerDiv.querySelector('.iyuu-config-btn');
        if (configBtn) {
            configBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('iyuu令牌按钮被点击');
                showTokenConfigInterface();
            });
        }

        // 为站点设置按钮添加事件监听器
        const siteSettingsBtn = headerDiv.querySelector('.iyuu-site-settings-btn');
        if (siteSettingsBtn) {
            siteSettingsBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('站点设置按钮被点击');
                showSiteSettingsInterface();
            });
        }

        // 为已拥有站点复选框添加事件监听器
        const ownedSitesCheckbox = headerDiv.querySelector('.iyuu-owned-sites-checkbox');
        if (ownedSitesCheckbox) {
            ownedSitesCheckbox.addEventListener('change', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('已拥有站点复选框状态变化:', this.checked);

                // 保存复选框状态到本地存储
                GM_setValue('iyuu_filter_owned_sites', this.checked);

                // 如果当前有辅种信息显示，则重新过滤显示
                const currentContent = contentElement.innerHTML;
                if (currentContent.includes('iyuu-links-container')) {
                    // 重新获取并显示辅种信息（应用过滤）
                    if (!isRequesting) {
                        isRequesting = true;
                        getAndDisplaySeedInfo().finally(() => {
                            isRequesting = false;
                        });
                    }
                }
            });
        }

        // 为跳过校验复选框添加事件监听器
        const skipVerifyCheckbox = headerDiv.querySelector('.iyuu-skip-verify-checkbox');
        if (skipVerifyCheckbox) {
            skipVerifyCheckbox.addEventListener('change', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('跳过校验复选框状态变化:', this.checked);

                // 保存复选框状态到本地存储
                GM_setValue('iyuu_skip_verify', this.checked);
            });
        }

        // 为下载器设置按钮添加事件监听器
        const downloaderSettingsBtn = headerDiv.querySelector('.iyuu-downloader-settings-btn');
        if (downloaderSettingsBtn) {
            downloaderSettingsBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('下载器设置按钮被点击');
                showDownloaderSettingsInterface();
            });
        }

        // 为下载torrent按钮添加事件监听器
        const downloadTorrentBtn = headerDiv.querySelector('.iyuu-download-torrent-btn');
        if (downloadTorrentBtn) {
            downloadTorrentBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('下载torrent按钮被点击');
                downloadTorrentFiles();
            });
        }

        // 为一键辅种按钮添加事件监听器
        const autoSeedBtn = headerDiv.querySelector('.iyuu-auto-seed-btn');
        if (autoSeedBtn) {
            autoSeedBtn.addEventListener('click', async function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('一键辅种按钮被点击');
                try {
                    await autoSeedSelectedTorrents();
                } catch (err) {
                    console.error('一键辅种失败:', err);
                    showMessage(`❌ 一键辅种失败: ${err.message || err}`, 'error');
                }
            });
        }
        
        // 为关闭按钮添加事件监听器
        const closeBtn = headerDiv.querySelector('.iyuu-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('关闭按钮被点击');
                closeIyuuPopup();
            });
            
            // 添加备用方案：确保关闭按钮可点击
            closeBtn.style.cursor = 'pointer';
            closeBtn.title = '关闭';
        } else {
            console.warn('关闭按钮未找到');
        }
        
        // 处理spider API的数据结构
        let totalSites = 0;
        const allTorrents = [];
        
        // 检查返回的数据是否为对象
        if (typeof data.data === 'object' && data.data !== null && !Array.isArray(data.data)) {
            // 遍历对象中的每个hash对应的数据
            Object.values(data.data).forEach(item => {
                if (item && item.torrent && Array.isArray(item.torrent)) {
                    totalSites += item.torrent.length;
                    allTorrents.push(...item.torrent);
                }
            });
        }
        
        // 添加统计信息
        const statsDiv = document.createElement('div');
        statsDiv.className = 'iyuu-stats';
        const p = __lastIyuuRequestParams || {};
        statsDiv.innerHTML = `<span>找到 ${totalSites} 个可辅种站点</span>
<div style="margin-top:6px;font-size:12px;color:#0d47a1;word-break:break-all;">
sid_sha1=${p.sid_sha1 || '未知'} | sha1(JSON)=${p.sha1 || '未知'} | info_hash=${(__lastInfoHashList||[__lastInfoHash||'未知']).join(' , ')}
</div>`;
        contentElement.appendChild(statsDiv);
        
        // 预取 IYUU 支持站点索引（用于精准构造链接）
        if (!__iyuuSitesIndex) {
            await fetchSupportedSitesIndex(false);
        }

        // 用户站点信息获取已移除（API端点不可用，不影响核心功能）
        
                // 改进的去重逻辑：按站点名称排序，相同站点相邻显示
        const siteTorrents = new Map(); // 按站点名称收集种子
        
        console.log(`开始去重处理，总种子数量: ${allTorrents.length}`);
        console.log(`IYUU种子数量: ${allTorrents.filter(t => t.source !== 'zmpt').length}`);
        console.log(`ZMPT种子数量: ${allTorrents.filter(t => t.source === 'zmpt').length}`);
        
        // 在去重前，尝试将“当前页面站点”也纳入候选，便于一键辅种一并推送
        try {
            const currentHost = location.hostname.replace(/^www\./, '');
            const currentUrl = location.href;
            const currentIdFromUrl = extractTorrentIdFromUrl(currentUrl);
            const currentInfoHash = (__lastInfoHashList && __lastInfoHashList[0]) || __lastInfoHash || null;
            const findSidByHost = () => {
                if (!__iyuuSitesIndex) return null;
                const entries = Object.entries(__iyuuSitesIndex);
                // 优先精确匹配 base_url
                let hit = entries.find(([, si]) => (si && typeof si.base_url === 'string' && si.base_url.replace(/^www\./,'') === currentHost));
                if (hit) return parseInt(hit[0]);
                // 次优：包含匹配
                hit = entries.find(([, si]) => (si && typeof si.base_url === 'string' && si.base_url.replace(/^www\./,'').includes(currentHost)));
                if (hit) return parseInt(hit[0]);
                return null;
            };
            const currentSid = findSidByHost();
            if (currentSid && currentIdFromUrl) {
                const nickname = (__iyuuSitesIndex[currentSid]?.nickname) || (__iyuuSitesIndex[currentSid]?.site) || `站点${currentSid}`;
                const base = (__iyuuSitesIndex[currentSid]?.base_url) ? `${(__iyuuSitesIndex[currentSid].is_https===0?'http':'https')}://${__iyuuSitesIndex[currentSid].base_url.replace(/^https?:\/\//i,'')}` : '';
                const iconFromMap = getImageHostingIconUrl(currentSid);
                const iconPicked = iconFromMap || pickIconSmart({ english: nickname, chinese: nickname, baseUrl: currentUrl });
                const currentEntry = {
                    sid: currentSid,
                    site_name: nickname,
                    torrent_id: currentIdFromUrl,
                    info_hash: currentInfoHash || undefined,
                    source: 'current',
                    url: currentUrl,
                    icon: iconPicked || (base ? `${base}/favicon.ico` : undefined)
                };
                // 仅当 allTorrents 中不存在同站点同 ID 时再加入
                const exists = allTorrents.some(t => String(t.sid)===String(currentEntry.sid) && String(t.torrent_id)===String(currentEntry.torrent_id));
                if (!exists) {
                    allTorrents.push(currentEntry);
                    totalSites += 1;
                    console.log(`已加入当前页面站点到候选: ${nickname} (sid=${currentSid}, 种子ID=${currentIdFromUrl}, source=current)`);
                } else {
                    console.log(`当前页面站点已存在于候选列表中: ${nickname} (sid=${currentSid}, 种子ID=${currentIdFromUrl})`);
                }
            }
        } catch (e) {
            console.warn('加入当前页面站点失败：', e?.message || e);
        }
        
        for (const torrent of allTorrents) {
            // 调试信息：显示每个种子的torrent_id类型
            console.log(`处理种子: 站点=${torrent.source || 'unknown'}, torrent_id=${torrent.torrent_id}, 类型=${typeof torrent.torrent_id}`);
            
            let siteName = '';
            
            // 获取站点名称
            if (torrent.source === 'zmpt' && torrent.tempId) {
                // 优先使用ZMPT的站点名称，如果为空则尝试从URL推断
                if (torrent.site_name && torrent.site_name.trim()) {
                    siteName = torrent.site_name.trim();
                } else if (torrent.url) {
                    // 从URL中提取域名作为站点名称
                    try {
                        const url = new URL(torrent.url);
                        const hostname = url.hostname.replace(/^www\./, '');
                        // 将域名转换为更友好的名称
                        const domainMappings = {
                            'pthome.net': '铂金家',
                            'pt.keepfrds.com': '朋友',
                            'et8.org': '他吹吹风',
                            'kp.m-team.cc': '馒头',
                            'ptsbao.club': '烧包',
                            'ptchdbits.co': '彩虹岛',
                            'pt.upxin.net': '好多油',
                            'hdhome.org': '家园',
                            'pt.hd4fans.org': '兽',
                            'haidan.video': '海胆',
                            'dragonhd.xyz': '龙之家',
                            'hitpt.com': '百川',
                            'pterclub.com': '猫站',
                            'pttime.org': '时间',
                            'oshen.win': '奥申',
                            '52pt.site': '52pt',
                            'ourbits.club': '我堡',
                            'audiences.me': '观众',
                            'pt.0ff.cc': '自由农场',
                            'hhanclub.top': '憨憨',
                            'hdtime.org': '时光',
                            'hdfans.org': '红豆饭',
                            'hudbt.hust.edu.cn': '蝴蝶',
                            'zhuque.in': '朱雀',
                            'totheglory.im': '听听歌',
                            'ptchina.org': '铂金学院',
                            'pt.btschool.club': '学校',
                            'rousi.zip': '肉丝',
                            'cyanbug.net': '大青虫',
                            'ubits.club': '优堡',
                            'dajiao.cyou': '打胶',
                            'pandapt.net': '熊猫',
                            'piggo.me': '猪猪',
                            'wintersakura.net': '冬樱',
                            'agsvpt.com': '末日',
                            'ptvicomo.net': '象岛',
                            'hdkyl.in': '麒麟',
                            'share.ilolicon.com': '爱萝莉',
                            'icc2022.com': '冰淇淋',
                            'okpt.net': 'okpt',
                            'hddolby.com': '杜比',
                            'pt.sjtu.edu.cn': '葡萄',
                            'ptcafe.club': '咖啡',
                            't.tosky.club': 'ToSky',
                            'qingwapt.com': '青蛙',
                            'hdarea.club': '好大',
                            'lemonhd.club': '柠檬',
                            'pt.hdclone.org': 'hdclone',
                            'kufei.org': '库非',
                            'ptzone.xyz': 'PTzone',
                            'raingfh.top': '雨',
                            'njtupt.top': '浦园',
                            'hdvideo.one': 'HDV',
                            'tjupt.org': '北洋',
                            'zmpt.cc': 'ZMPT'
                        };
                        siteName = domainMappings[hostname] || hostname;
                    } catch (e) {
                        siteName = `ZMPT站点${Math.abs(torrent.sid)}`;
                    }
                } else {
                    siteName = `ZMPT站点${Math.abs(torrent.sid)}`;
                }
            } else if (__iyuuSitesIndex && __iyuuSitesIndex[torrent.sid]) {
                const si = __iyuuSitesIndex[torrent.sid];
                siteName = si.nickname || si.site || `站点${torrent.sid}`;
            } else {
                siteName = `站点${torrent.sid}`;
            }
            
            // 统一站点名称（不依赖 URL，防止因缺少 URL 导致同站点分裂成不同组）
            // 规则：
            // 1) 北洋 -> HDV
            // 2) ZMPT 相关统一为“织梦”（IYUU 昵称即为“织梦”），避免出现“织梦”和“ZMPT”两个分组
            if (siteName === "北洋") {
                siteName = "HDV";
                console.log(`标准化站点名称: 北洋 -> HDV`);
            }
            if (siteName === "ZMPT") {
                siteName = "织梦";
                console.log(`标准化站点名称: ZMPT -> 织梦`);
            }
            if (torrent.sid === 81) { // IYUU中 ZMPT 的 sid
                if (siteName !== "织梦") {
                    console.log(`标准化站点名称(按sid): ${siteName} -> 织梦`);
                }
                siteName = "织梦";
            }
            
            // 关键修复：标准化站点名称，确保IYUU和ZMPT的相同站点能够匹配
            // 创建站点名称的标准化映射表
            const siteNameStandardization = {
                // IYUU站点名称 -> 标准化名称
                '站点60': '时间',
                '站点90': '打胶', 
                '站点103': '冰淇淋',
                '站点104': '象岛',
                '站点108': 'ToSky',
                
                // 其他可能的映射
                '站点2': '铂金家',
                '站点1': '朋友',
                '站点11': '他吹吹风',
                '站点3': '馒头',
                '站点27': '烧包',
                '站点25': '彩虹岛',
                '站点38': '好多油',
                '站点7': '家园',
                '站点32': '兽',
                '站点56': '海胆',
                '站点58': '龙之家',
                '站点59': '百川',
                '站点6': '猫站',
                '站点39': '奥申',
                '站点19': '52pt',
                '站点9': '我堡',
                '站点68': '观众',
                '站点75': '自由农场',
                '站点72': '憨憨',
                '站点30': '时光',
                '站点57': '红豆饭',
                '站点67': '蝴蝶',
                '站点80': '朱雀',
                '站点14': '听听歌',
                '站点79': '铂金学院',
                '站点8': '学校',
                '站点82': '肉丝',
                '站点84': '大青虫',
                '站点86': '优堡',
                '站点88': '熊猫',
                '站点69': '猪猪',
                '站点70': '冬樱',
                '站点93': '末日',
                '站点94': '象岛',
                '站点97': '麒麟',
                '站点95': '青蛙',
                '站点29': '好大',
                '站点102': '蟹黄堡',
                '站点99': 'GTK',
                '站点36': '开心',
                '站点110': '劳改所',
                '站点81': 'ZMPT'
            };
            
            // 应用标准化映射
            if (siteNameStandardization[siteName]) {
                const originalName = siteName;
                siteName = siteNameStandardization[siteName];
                console.log(`标准化站点名称: ${originalName} -> ${siteName}`);
            }
            
            // 检查是否已存在相同站点名称的组
            if (siteTorrents.has(siteName)) {
                // 检查是否重复（相同站点相同种子ID）
                const existingTorrents = siteTorrents.get(siteName);
                const isDuplicate = existingTorrents.some(existing => {
                    // 修复类型不匹配问题：将两个ID都转换为字符串进行比较
                    const existingId = String(existing.torrent_id);
                    const currentId = String(torrent.torrent_id);
                    return existingId === currentId;
                });
                
                if (isDuplicate) {
                    console.log(`跳过重复组合: ${siteName} - 种子ID ${torrent.torrent_id} (来源: ${torrent.source || 'unknown'})`);
                    continue; // 跳过这个重复项
                }
                
                // 添加到现有组
                existingTorrents.push(torrent);
                console.log(`添加到现有站点组: ${siteName} (种子ID: ${torrent.torrent_id}, 来源: ${torrent.source || 'unknown'})`);
            } else {
                // 创建新组
                siteTorrents.set(siteName, [torrent]);
                console.log(`创建新站点组: ${siteName} (种子ID: ${torrent.torrent_id}, 来源: ${torrent.source || 'unknown'})`);
            }
        }
        
        // 按站点名称首字母排序，相同站点的种子相邻显示
        const uniqueTorrents = [];
        const sortedSiteNames = Array.from(siteTorrents.keys()).sort((a, b) => {
            // 按中文名称排序（如果有中文的话）
            const aFirst = a.charAt(0);
            const bFirst = b.charAt(0);
            
            // 如果都是中文，按拼音排序
            if (/[\u4e00-\u9fa5]/.test(aFirst) && /[\u4e00-\u9fa5]/.test(bFirst)) {
                return a.localeCompare(b, 'zh-CN');
            }
            
            // 如果都是英文，按字母排序
            if (/[a-zA-Z]/.test(aFirst) && /[a-zA-Z]/.test(bFirst)) {
                return a.localeCompare(b, 'en');
            }
            
            // 混合排序：中文在前，英文在后
            if (/[\u4e00-\u9fa5]/.test(aFirst)) return -1;
            if (/[\u4e00-\u9fa5]/.test(bFirst)) return 1;
            
            return a.localeCompare(b);
        });
        
        // 按排序后的站点名称顺序，将种子添加到数组中
        sortedSiteNames.forEach(siteName => {
            const torrents = siteTorrents.get(siteName);
            torrents.forEach((torrent, index) => {
                torrent.displayName = siteName; // 保持原始站点名称，不添加数字后缀
            uniqueTorrents.push(torrent);
            });
        });
        
        console.log(`去重后剩余站点数量: ${uniqueTorrents.length} (原始: ${allTorrents.length})`);
        
        // 显示去重统计信息
        const siteCounts = {};
        uniqueTorrents.forEach(torrent => {
            const siteName = torrent.displayName || torrent.siteName || '未知站点';
            siteCounts[siteName] = (siteCounts[siteName] || 0) + 1;
        });
        
        console.log('去重后的站点分布:');
        Object.entries(siteCounts).forEach(([site, count]) => {
            console.log(`  ${site}: ${count} 个种子`);
        });
        
        // 应用站点过滤（根据"已拥有站点"复选框状态）
        let filteredTorrents = [...uniqueTorrents];
        const filterOwnedSites = GM_getValue('iyuu_filter_owned_sites', false);
        const ownedSites = GM_getValue('iyuu_owned_sites', []);

        if (filterOwnedSites && ownedSites.length > 0) {
            // 只显示已拥有的站点，但当前页面站点（source==='current'）始终保留
            const currentSiteTorrents = uniqueTorrents.filter(t => t && t.source === 'current');
            const ownedSiteTorrents = uniqueTorrents.filter(t => t && ownedSites.includes(t.sid));
            console.log(`过滤前统计: 当前站点 ${currentSiteTorrents.length} 个, 已拥有站点 ${ownedSiteTorrents.length} 个`);
            
            filteredTorrents = uniqueTorrents.filter(torrent => {
                return torrent && (torrent.source === 'current' || ownedSites.includes(torrent.sid));
            });
            console.log(`应用站点过滤后剩余站点数量: ${filteredTorrents.length} (已拥有站点: ${ownedSites.length})`);
            
            // 检查当前站点是否被保留
            const currentSiteAfterFilter = filteredTorrents.filter(t => t && t.source === 'current');
            console.log(`过滤后当前站点数量: ${currentSiteAfterFilter.length}`);
        } else {
            console.log('显示全部可辅种站点');
        }

        // 更新统计信息
        const displayCount = filteredTorrents.length;
        const totalCount = uniqueTorrents.length;
        if (filterOwnedSites && ownedSites.length > 0) {
            statsDiv.innerHTML = `<span>找到 ${displayCount} 个可辅种站点 (已过滤，共 ${totalCount} 个)</span>`;
        } else {
            statsDiv.innerHTML = `<span>找到 ${displayCount} 个可辅种站点</span>`;
        }
        
        // 创建辅种链接
        filteredTorrents.forEach(torrent => {
            // 使用新的显示名称（可能包含数字后缀）
            let siteName = torrent.displayName || `站点${torrent.sid}`;
            let downloadUrl = '#';
            let iconUrl = 'https://iyuu.cn/favicon.ico';

            // 检查是否是ZMPT补充的站点
            if (torrent.source === 'zmpt' && torrent.tempId) {
                // ZMPT补充的站点
                const originalSiteName = torrent.site_name || `ZMPT站点${Math.abs(torrent.sid)}`;
                
                // 直接使用ZMPT API返回的完整数据
                if (torrent.url) {
                    downloadUrl = torrent.url; // 直接使用完整的详情页链接
                } else {
                    downloadUrl = '#';
                }
                
                // 优先使用图床链接，如果没有则使用ZMPT API返回的图标
                const imageHostingIcon = getImageHostingIconUrl(torrent.sid);
                if (imageHostingIcon) {
                    iconUrl = imageHostingIcon;
                } else if (torrent.icon) {
                    iconUrl = torrent.icon;
                } else {
                    // 尝试从URL构造favicon
                    try {
                        const url = new URL(torrent.url);
                        iconUrl = `${url.protocol}//${url.hostname}/favicon.ico`;
                    } catch (e) {
                    iconUrl = 'https://iyuu.cn/favicon.ico';
                    }
                }
                
                console.log(`处理ZMPT补充站点: ${siteName}, ID: ${torrent.torrent_id}, 链接: ${downloadUrl}, 图标: ${iconUrl}`);
            } else if (__iyuuSitesIndex && __iyuuSitesIndex[torrent.sid]) {
                // 使用 IYUU 站点索引构造精准链接
                const si = __iyuuSitesIndex[torrent.sid];
                const originalSiteName = si.nickname || si.site || `站点${torrent.sid}`;
                const scheme = (si.is_https === 0) ? 'http' : 'https';
                const base = si.base_url ? `${scheme}://${si.base_url.replace(/^https?:\/\//i,'')}` : '';
                if (base) {
                    // 馒头域名与详情路径统一到 kp.m-team.cc/detail/{id}
                    const isMTeam = (String(si.site||'').toLowerCase()==='m-team') || (String(si.nickname||'').includes('馒头')) || (parseInt(torrent.sid)===3);
                    if (isMTeam && torrent.torrent_id) {
                        const mBase = 'https://kp.m-team.cc';
                        downloadUrl = `${mBase}/detail/${encodeURIComponent(String(torrent.torrent_id))}`;
                        iconUrl = pickIconSmart({ 
                            english: siteName, 
                            chinese: siteName, 
                            urlIcon: torrent.icon, 
                            baseUrl: downloadUrl 
                        });
                    } else if (typeof si.details_page === 'string' && si.details_page.includes('{}')) {
                        const path = si.details_page.replace('{}', String(torrent.torrent_id));
                        downloadUrl = `${base}/${path.replace(/^\//,'')}`;
                        // 使用改进的图标获取函数
                        iconUrl = pickIconSmart({ 
                            english: siteName, 
                            chinese: siteName, 
                            urlIcon: torrent.icon, 
                            baseUrl: `${base}/details.php?id=${torrent.torrent_id}` 
                        });
                    } else if (typeof si.download_page === 'string' && si.download_page.includes('{}')) {
                        let path = si.download_page.replace('{}', String(torrent.torrent_id));
                        path = path.replace(/\{passkey\}/g, '').replace(/([&?])passkey=(&|$)/g, '$1').replace(/[&?]$/,'');
                        downloadUrl = `${base}/${path.replace(/^\//,'')}`;
                        // 使用改进的图标获取函数
                        iconUrl = pickIconSmart({ 
                            english: siteName, 
                            chinese: siteName, 
                            urlIcon: torrent.icon, 
                            baseUrl: `${base}/details.php?id=${torrent.torrent_id}` 
                        });
                    }
                }
            } else {
                // 如果 IYUU 站点索引中没有该站点，记录警告但仍显示
                console.warn(`警告：站点ID ${torrent.sid} 在IYUU站点索引中未找到，使用默认显示`);
                // 不跳过，继续显示这个站点
            }
            
            // 使用改进的图标获取函数
            iconUrl = pickIconSmart({ 
                english: siteName, 
                chinese: siteName, 
                urlIcon: torrent.icon, 
                baseUrl: downloadUrl 
            });
            
            // 强制使用HTTPS协议，避免Mixed Content警告
            if (iconUrl && iconUrl.startsWith('http://')) {
                iconUrl = iconUrl.replace('http://', 'https://');
            }
            
            // 创建站点容器（包含复选框和链接）
            const siteContainer = document.createElement('div');
            siteContainer.className = 'iyuu-site-container';
            siteContainer.style.cssText = `
                position: relative;
                display: inline-block;
                margin: 8px;
                border: 1px solid #ddd;
                border-radius: 8px;
                background: white;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                transition: all 0.2s ease;
                cursor: pointer;
            `;

            // 创建复选框
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'iyuu-site-checkbox';
            checkbox.setAttribute('data-site-id', torrent.sid);
            // 默认勾选；当前页面站点强制选中
            let shouldExclude = false;
            
            // 检查IYUU站点索引中的域名
            if (__iyuuSitesIndex && __iyuuSitesIndex[torrent.sid]) {
                const siteInfo = __iyuuSitesIndex[torrent.sid];
                // 之前为避免馒头失败而排除，现在改为不排除
                // if (siteInfo.base_url && siteInfo.base_url.includes('m-team')) { shouldExclude = true; }
            }
            
            // 检查ZMPT站点的URL
            if (torrent.source === 'zmpt' && torrent.url) {
                try {
                    const url = new URL(torrent.url);
                    // 之前排除 m-team 的逻辑移除
                } catch (e) {
                    // URL解析失败，忽略
                }
            }
            
            // 当前页面站点强制选中
            const currentSite = (torrent && torrent.source === 'current');
            if (currentSite) {
                try { checkbox.setAttribute('data-source', 'current'); } catch (_) {}
            }
            checkbox.checked = currentSite ? true : (!shouldExclude);
            checkbox.style.cssText = `
                position: absolute;
                top: 8px;
                left: 8px;
                z-index: 10;
                transform: scale(1.2);
                cursor: pointer;
            `;

            // 创建链接
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.className = 'iyuu-site-link';
            
            // 根据站点类型显示不同的ID信息
            let idDisplay = '';
            if (torrent.source === 'zmpt' && torrent.tempId) {
                // 对于ZMPT站点，显示真实的种子ID
                if (torrent.torrent_id && torrent.torrent_id !== '未知') {
                    idDisplay = `<div class="iyuu-torrent-id">ID: ${torrent.torrent_id}</div>`;
                } else {
                    idDisplay = `<div class="iyuu-torrent-id">ZMPT补充站点</div>`;
                }
            } else {
                idDisplay = `<div class="iyuu-torrent-id">ID: ${torrent.torrent_id}</div>`;
            }
            
            link.innerHTML = `
                <div class="iyuu-site-icon" data-icon-url="${iconUrl}"></div>
                <div class="iyuu-site-name">${siteName}</div>
                ${idDisplay}
            `;
            
            // 添加图标加载错误处理
            const iconElement = link.querySelector('.iyuu-site-icon');
            if (iconElement) {
                // 设置背景图片
                iconElement.style.backgroundImage = `url(${iconUrl})`;
                
                // 使用预加载机制
                preloadIcon(iconUrl).then(success => {
                    if (success) {
                        iconElement.removeAttribute('data-error');
                    } else {
                        iconElement.setAttribute('data-error', 'true');
                    }
                }).catch(() => {
                    iconElement.setAttribute('data-error', 'true');
                });
            }
            
            // 为复选框添加事件监听器，阻止冒泡
            checkbox.addEventListener('click', function(e) {
                e.stopPropagation();
            });

            // 为链接添加事件监听器，阻止冒泡
            link.addEventListener('click', function(e) {
                e.stopPropagation();
            });

            // 组装容器
            siteContainer.appendChild(checkbox);
            siteContainer.appendChild(link);
            linksContainer.appendChild(siteContainer);
            console.log('创建辅种链接:', siteName, torrent.torrent_id, torrent.info_hash);
            
            // 添加调试信息，显示站点的详细信息
            if (__iyuuSitesIndex && __iyuuSitesIndex[torrent.sid]) {
                const si = __iyuuSitesIndex[torrent.sid];
                console.log(`站点调试信息 - ID: ${torrent.sid}, 名称: ${siteName}`);
                console.log(`  - 站点索引数据:`, si);
                console.log(`  - 构造的链接: ${downloadUrl}`);
                console.log(`  - 图标URL: ${iconUrl}`);
            }
        });
        
        // 清空内容并重新添加所有元素
        contentElement.innerHTML = '';
        contentElement.appendChild(headerDiv);
        contentElement.appendChild(statsDiv);

        contentElement.appendChild(linksContainer);

        
        
        // 记录辅种数据信息
        console.log('辅种数据:', data);
        console.log('创建的链接数量:', linksContainer.children.length);
        
        // 记录站点索引状态
        if (__iyuuSitesIndex) {
            console.log('IYUU站点索引已加载，条目数:', Object.keys(__iyuuSitesIndex).length);
        } else {
            console.warn('IYUU站点索引未加载，这可能导致站点映射错误！');
        }
        
        // 批量预加载所有图标，提高性能
        const allIconUrls = Array.from(linksContainer.querySelectorAll('.iyuu-site-icon'))
            .map(icon => icon.getAttribute('data-icon-url'))
            .filter(Boolean);
        
        if (allIconUrls.length > 0) {
            console.log(`开始预加载 ${allIconUrls.length} 个图标...`);
            preloadAllIcons(allIconUrls).then(results => {
                const successCount = results.filter(r => r.status === 'fulfilled' && r.value).length;
                const failCount = results.length - successCount;
                console.log(`图标预加载完成: 成功 ${successCount}, 失败 ${failCount}`);
            });
        }
        

    }

    // 本地图床链接映射表（按站点ID顺序），业务优先使用
    const imageHostingUrls = {
        // Pixhost图床链接（按站点ID顺序）
        pixhost: [
            'https://img1.pixhost.to/images/8299/635783937_1_.png',
            'https://img1.pixhost.to/images/8299/635783939_2_.png',
            'https://img1.pixhost.to/images/8299/635783940_3_.png',
            'https://img1.pixhost.to/images/8299/635783942_4_.png',
            'https://img1.pixhost.to/images/8299/635783943_5_.png',
            'https://img1.pixhost.to/images/8299/635783944_6_.png',
            'https://img1.pixhost.to/images/8299/635783945_7_.png',
            'https://img1.pixhost.to/images/8299/635783946_8_.png',
            'https://img1.pixhost.to/images/8299/635783947_9_.png',
            'https://img1.pixhost.to/images/8299/635783948_11_.png',
            'https://img1.pixhost.to/images/8299/635783949_14_.png',
            'https://img1.pixhost.to/images/8299/635783950_15_.png',
            'https://img1.pixhost.to/images/8299/635783953_17_.png',
            'https://img1.pixhost.to/images/8299/635783955_18_.png',
            'https://img1.pixhost.to/images/8299/635783956_19_52pt.png',
            'https://img1.pixhost.to/images/8299/635783959_22_.png',
            'https://img1.pixhost.to/images/8299/635783962_23_.png',
            'https://img1.pixhost.to/images/8299/635783965_24_.png',
            'https://img1.pixhost.to/images/8299/635783969_25_.png',
            'https://img1.pixhost.to/images/8299/635783977_27_.png',
            'https://img1.pixhost.to/images/8299/635783978_29_.png',
            'https://img1.pixhost.to/images/8299/635783979_30_.png',
            'https://img1.pixhost.to/images/8299/635783980_31_1ptba.png',
            'https://img1.pixhost.to/images/8299/635783981_33_.png',
            'https://img1.pixhost.to/images/8299/635783982_36_.png',
            'https://img1.pixhost.to/images/8299/635783983_37_.png',
            'https://img1.pixhost.to/images/8299/635783984_38_.png',
            'https://img1.pixhost.to/images/8299/635783986_39_.png',
            'https://img1.pixhost.to/images/8299/635783991_40_.png',
            'https://img1.pixhost.to/images/8299/635783993_51_.png',
            'https://img1.pixhost.to/images/8299/635783996_52_.png',
            'https://img1.pixhost.to/images/8299/635783998_53_.png',
            'https://img1.pixhost.to/images/8299/635783999_54_.png',
            'https://img1.pixhost.to/images/8299/635784000_56_.png',
            'https://img1.pixhost.to/images/8299/635784001_57_.png',
            'https://img1.pixhost.to/images/8299/635784004_58_.png',
            'https://img1.pixhost.to/images/8299/635784005_59_.png',
            'https://img1.pixhost.to/images/8299/635784008_64_.png',
            'https://img1.pixhost.to/images/8299/635784009_67_.png',
            'https://img1.pixhost.to/images/8299/635784010_68_.png',
            'https://img1.pixhost.to/images/8299/635784011_69_.png',
            'https://img1.pixhost.to/images/8299/635784014_70_.png',
            'https://img1.pixhost.to/images/8299/635784017_72_.png',
            'https://img1.pixhost.to/images/8299/635784019_75_.png',
            'https://img1.pixhost.to/images/8299/635784020_79_.png',
            'https://img1.pixhost.to/images/8299/635784021_80_.png',
            'https://img1.pixhost.to/images/8299/635784022_81_.png',
            'https://img1.pixhost.to/images/8299/635784024_82_.png',
            'https://img1.pixhost.to/images/8299/635784027_83_.png',
            'https://img1.pixhost.to/images/8299/635784029_84_.png',
            'https://img1.pixhost.to/images/8299/635784030_86_.png',
            'https://img1.pixhost.to/images/8299/635784031_88_.png',
            'https://img1.pixhost.to/images/8299/635784032_89_.png',
            'https://img1.pixhost.to/images/8299/635784034_91_.png',
            'https://img1.pixhost.to/images/8299/635784036_93_.png',
            'https://img1.pixhost.to/images/8299/635784037_94_.png',
            'https://img1.pixhost.to/images/8299/635784039_95_.png',
            'https://img1.pixhost.to/images/8299/635784042_96_.png',
            'https://img1.pixhost.to/images/8299/635784043_97_.png',
            'https://img1.pixhost.to/images/8299/635784044_98_.png',
            'https://img1.pixhost.to/images/8299/635784048_99_gtk.png',
            'https://img1.pixhost.to/images/8299/635784057_101_okpt.png',
            'https://img1.pixhost.to/images/8299/635784060_102_.png',
            'https://img1.pixhost.to/images/8299/635784061_105_.png',
            'https://img1.pixhost.to/images/8299/635784067_106_.png',
            'https://img1.pixhost.to/images/8299/635784072_107_.png',
            'https://img1.pixhost.to/images/8299/635784077_109_yemapt.png',
            'https://img1.pixhost.to/images/8299/635784078_110_.png',
            'https://img1.pixhost.to/images/8299/635784081_111_.png',
            'https://img1.pixhost.to/images/8299/635784084_112_.png',
            'https://img1.pixhost.to/images/8299/635784088_113_.png',
            'https://img1.pixhost.to/images/8299/635784092_114_ptzone.png',
            'https://img1.pixhost.to/images/8299/635784097_115_hdclone.png',
            'https://img1.pixhost.to/images/8299/635784102_116_.png',
            'https://img1.pixhost.to/images/8299/635784106_117_afun.png',
            'https://img1.pixhost.to/images/8299/635784107_119_.png',
            'https://img1.pixhost.to/images/8299/635784109_120_.png',
            'https://img1.pixhost.to/images/8299/635784111_121_.png',
            'https://img1.pixhost.to/images/8299/635784113_123_.png',
            'https://img1.pixhost.to/images/8299/635784114_124_.png',
            'https://img1.pixhost.to/images/8299/635784115_125_railgunpt.png',
            'https://img1.pixhost.to/images/8299/635784121_126_ggpt.png',
            'https://img1.pixhost.to/images/8299/635784122_127_pt-cc.png'
        ],
        // Freeimage图床链接（按站点ID顺序）
        freeimage: [
            'https://iili.io/K3LcJ9t.png',
            'https://iili.io/K3Lc2Nn.png',
            'https://iili.io/K3LcqP4.png',
            'https://iili.io/K3LcaKQ.png',
            'https://iili.io/K3LcGOF.png',
            'https://iili.io/K3LckJI.png',
            'https://iili.io/K3LcSbn.png',
            'https://iili.io/K3LcZ57.png',
            'https://iili.io/K3LlJ0Q.png',
            'https://iili.io/K3Llxqv.png',
            'https://iili.io/K3LlA7I.png',
            'https://iili.io/K3LlErl.png',
            'https://iili.io/K3LleBj.png',
            'https://iili.io/K3LlgkP.png',
            'https://iili.io/K3LlLCJ.png',
            'https://iili.io/K3Llppt.png',
            'https://iili.io/K3L0f3l.png',
            'https://iili.io/K3L0zZu.png',
            'https://iili.io/K3L07aV.png',
            'https://iili.io/K3LlgkP.png',
            'https://iili.io/K3L0N9I.png',
            'https://iili.io/K3L0rF4.png',
            'https://iili.io/K3L0sA7.png',
            'https://iili.io/K3L0DMb.png',
            'https://iili.io/K3L1JHB.png',
            'https://iili.io/K3L1qiJ.png',
            'https://iili.io/K3L1Rxn.png',
            'https://iili.io/K3LlgkP.png',
            'https://iili.io/K3L1Mb9.png',
            'https://iili.io/K3L1wfj.png',
            'https://iili.io/K3L1Sb1.png',
            'https://iili.io/K3L1QJp.png',
            'https://iili.io/K3L1yss.png',
            'https://iili.io/K3LEF72.png',
            'https://iili.io/K3LlgkP.png',
            'https://iili.io/K3LEA7V.png',
            'https://iili.io/K3LEM2R.png',
            'https://iili.io/K3LENQn.png',
            'https://iili.io/K3LEPj9.png',
            'https://iili.io/K3LEZ4j.png',
            'https://iili.io/K3LGHj1.png',
            'https://iili.io/K3LGqaR.png',
            'https://iili.io/K3LG7a4.png',
            'https://iili.io/K3LGj8Q.png',
            'https://iili.io/K3LlgkP.png',
            'https://iili.io/K3LG4cv.png',
            'https://iili.io/K3LM9S4.png',
            'https://iili.io/K3LMdR2.png',
            'https://iili.io/K3LMfVe.png',
            'https://iili.io/K3LMuDP.png',
            'https://iili.io/K3LMERp.png',
            'https://iili.io/K3LMXWX.png',
            'https://iili.io/K3LMrX9.png',
            'https://iili.io/K3LMi0b.png',
            'https://iili.io/K3LMteV.png',
            'https://iili.io/K3LMyLF.png',
            'https://iili.io/K3LVJ1a.png',
            'https://iili.io/K3LV3dv.png',
            'https://iili.io/K3LVBII.png',
            'https://iili.io/K3LVz1s.png',
            'https://iili.io/K3LlgkP.png',
            'https://iili.io/K3LVcQ9.png',
            'https://iili.io/K3LVErb.png',
            'https://iili.io/K3LVWkQ.png',
            'https://iili.io/K3LVv4a.png',
            'https://iili.io/K3LVgvR.png',
            'https://iili.io/K3LVQGn.png',
            'https://iili.io/K3LVpyl.png',
            'https://iili.io/K3LWf3b.png',
            'https://iili.io/K3LWxwB.png',
            'https://iili.io/K3LlgkP.png',
            'https://iili.io/K3LlgkP.png',
            'https://iili.io/K3LW0wN.png',
            'https://iili.io/K3LlgkP.png',
            'https://iili.io/K3LWOAl.png',
            'https://iili.io/K3LWLNV.png',
            'https://iili.io/K3LWbiF.png',
            'https://iili.io/K3LX9UJ.png',
            'https://iili.io/K3LX2Np.png',
            'https://iili.io/K3LlgkP.png',
            'https://iili.io/K3LXzJf.png',
            'https://iili.io/K3LX7s9.png',
            'https://iili.io/K3LXlUb.png'
        ],
        // Imgbb图床链接（按站点ID顺序）
        imgbb: [
            'https://i.ibb.co/Q7hjv73k/635783937-1.png',
            'https://i.ibb.co/jkJqDYbm/635783939-2.png',
            'https://i.ibb.co/F1GGHDb/635783940-3.png',
            'https://i.ibb.co/Xf7w45mJ/635783942-4.png',
            'https://i.ibb.co/Y6FG4Fq/635783943-5.png',
            'https://i.ibb.co/21hCqsNV/635783944-6.png',
            'https://i.ibb.co/35BkqPgd/635783945-7.png',
            'https://i.ibb.co/r2Ptcsd8/635783946-8.png',
            'https://i.ibb.co/V0ffz3jp/635783947-9.png',
            'https://i.ibb.co/chY5pD0N/635783948-11.png',
            'https://i.ibb.co/9m00V2VD/635783949-14.png',
            'https://i.ibb.co/67S7whK2/635783950-15.png',
            'https://i.ibb.co/35F7gSJf/635783953-17.png',
            'https://i.ibb.co/FL5Rh9ht/635783955-18.png',
            'https://i.ibb.co/MyTd1pzC/635783956-19-52pt.png',
            'https://i.ibb.co/MxJVmKWx/635783959-22.png',
            'https://i.ibb.co/QvRV7QqX/635783962-23.png',
            'https://i.ibb.co/5xXHGxHH/635783965-24.png',
            'https://i.ibb.co/DfpRkXc4/635783969-25.png',
            'https://i.ibb.co/FL5Rh9ht/635783955-18.png',
            'https://i.ibb.co/4nck5SBD/635783978-29.png',
            'https://i.ibb.co/yFdrfvW2/635783979-30.png',
            'https://i.ibb.co/27vFktr2/635783980-31-1ptba.png',
            'https://i.ibb.co/sdxq9X8M/635783981-33.png',
            'https://i.ibb.co/fmvnZBQ/635783982-36.png',
            'https://i.ibb.co/TxmhhJTG/635783983-37.png',
            'https://i.ibb.co/93w5Xycc/635783984-38.png',
            'https://i.ibb.co/FL5Rh9ht/635783955-18.png',
            'https://i.ibb.co/Wv58QxR0/635783991-40.png',
            'https://i.ibb.co/v4KsZzg6/635783993-51.png',
            'https://i.ibb.co/RGjyKv2N/635783996-52.png',
            'https://i.ibb.co/7dc2RHsd/635783998-53.png',
            'https://i.ibb.co/TBjTpXQH/635783999-54.png',
            'https://i.ibb.co/N6C5w1py/635784000-56.png',
            'https://i.ibb.co/FL5Rh9ht/635783955-18.png',
            'https://i.ibb.co/5x5vLmN1/635784004-58.png',
            'https://i.ibb.co/n8ggvBCs/635784005-59.png',
            'https://i.ibb.co/xtqwgttK/635784008-64.png',
            'https://i.ibb.co/216D2p3M/635784009-67.png',
            'https://i.ibb.co/W4y4QBm7/635784010-68.png',
            'https://i.ibb.co/wNzXBFP3/635784011-69.png',
            'https://i.ibb.co/bjbHn6ms/635784014-70.png',
            'https://i.ibb.co/cK48139K/635784017-72.png',
            'https://i.ibb.co/dZVcjd8/635784019-75.png',
            'https://i.ibb.co/FL5Rh9ht/635783955-18.png',
            'https://i.ibb.co/gLHT4JMg/635784021-80.png',
            'https://i.ibb.co/VcB4Ccs5/635784022-81.png',
            'https://i.ibb.co/9m14zgdX/635784024-82.png',
            'https://i.ibb.co/8gtgMdjP/635784027-83.png',
            'https://i.ibb.co/1JmYLk5j/635784029-84.png',
            'https://i.ibb.co/L7rjRbQ/635784030-86.png',
            'https://i.ibb.co/8DRGRXfg/635784031-88.png',
            'https://i.ibb.co/Q2r5fqN/635784032-89.png',
            'https://i.ibb.co/PG9CSzL6/635784034-91.png',
            'https://i.ibb.co/Z6H6tL8w/635784036-93.png',
            'https://i.ibb.co/fKJkvb8/635784037-94.png',
            'https://i.ibb.co/QvrzZKmS/635784039-95.png',
            'https://i.ibb.co/S4b3P6c7/635784042-96.png',
            'https://i.ibb.co/Jjs1NNgf/635784043-97.png',
            'https://i.ibb.co/5gF8DTKX/635784044-98.png',
            'https://i.ibb.co/FL5Rh9ht/635783955-18.png',
            'https://i.ibb.co/MkLhjf9z/635784057-101-okpt.png',
            'https://i.ibb.co/d4V9Rztk/635784060-102.png',
            'https://i.ibb.co/mrMfvsNy/635784061-105.png',
            'https://i.ibb.co/yBMwhPBz/635784067-106.png',
            'https://i.ibb.co/Gvx5HV86/635784072-107.png',
            'https://i.ibb.co/prztq103/635784077-109-yemapt.png',
            'https://i.ibb.co/WpDtBmrk/635784078-110.png',
            'https://i.ibb.co/cXZdKXFm/635784081-111.png',
            'https://i.ibb.co/LWC0mfh/635784084-112.png',
            'https://i.ibb.co/FL5Rh9ht/635783955-18.png',
            'https://i.ibb.co/FL5Rh9ht/635783955-18.png',
            'https://i.ibb.co/SwYy5XBs/635784097-115-hdclone.png',
            'https://i.ibb.co/FL5Rh9ht/635783955-18.png',
            'https://i.ibb.co/6JpvJvr5/635784106-117-afun.png',
            'https://i.ibb.co/zHJ1Jmrj/635784107-119.png',
            'https://i.ibb.co/6cB283wB/635784109-120.png',
            'https://i.ibb.co/4ZxzHLwL/635784111-121.png',
            'https://i.ibb.co/TxpZbtzm/635784113-123.png',
            'https://i.ibb.co/FL5Rh9ht/635783955-18.png',
            'https://i.ibb.co/7tb57Cm9/635784115-125-railgunpt.png',
            'https://i.ibb.co/ZpKyd36Z/635784121-126-ggpt.png',
            'https://i.ibb.co/wF8k6TDW/635784122-127-pt-cc.png'
        ]
    };

    // 根据站点ID获取本地图床图标（优先顺序：pixhost > freeimage > imgbb）
    function getImageHostingIconUrl(sid) {
        if (typeof sid !== 'number' || !isFinite(sid) || sid <= 0) return '';
        const index = sid - 1;
        try {
            const p = imageHostingUrls.pixhost[index] || '';
            if (p) return p;
            const f = imageHostingUrls.freeimage[index] || '';
            if (f) return f;
            const i = imageHostingUrls.imgbb[index] || '';
            if (i) return i;
        } catch (e) {}
        return '';
    }

    // 图标缓存机制，避免重复请求
    const iconCache = new Map();
    
    // 预加载图标函数
    async function preloadIcon(iconUrl) {
        if (iconCache.has(iconUrl)) {
            return iconCache.get(iconUrl);
        }
        
        try {
            const img = new Image();
            const loadPromise = new Promise((resolve, reject) => {
                img.onload = () => resolve(true);
                img.onerror = () => reject(new Error('Icon load failed'));
            });
            
            img.src = iconUrl;
            await loadPromise;
            
            iconCache.set(iconUrl, true);
            return true;
        } catch (error) {
            iconCache.set(iconUrl, false);
            return false;
        }
    }
    
    // 批量预加载图标函数
    async function preloadAllIcons(iconUrls) {
        const promises = iconUrls.map(url => preloadIcon(url));
        return Promise.allSettled(promises);
    }

    // 使用指定hash直接请求并展示IYUU结果
    async function getAndDisplaySeedInfoWithHash(hash) {
        try {
            if (!hash || typeof hash !== 'string' || hash.length !== 40) {
                console.warn('getAndDisplaySeedInfoWithHash: 提供的hash无效:', hash);
                return;
            }
            console.log('使用指定hash请求混合数据源:', hash);
            const data = await fetchHybridIyuuInfo(hash);
            await updateSeedInfoDisplay(data);
        } catch (e) {
            console.error('getAndDisplaySeedInfoWithHash 调用失败:', e);
        }
    }
    


    // 显示错误信息
    function showError(message) {
        const popup = document.getElementById('iyuu-popup');
        if (!popup) return;

        const contentElement = popup.querySelector('.iyuu-popup-content');
        
        // 检查message是否包含HTML标签
        if (message.includes('<') && message.includes('>')) {
            // 如果包含HTML，直接设置innerHTML
            contentElement.innerHTML = `
                <div class="iyuu-error">
                    <div class="iyuu-error-icon">❌</div>
                    <div class="iyuu-error-text">${message}</div>
                </div>
            `;
        } else {
            // 如果是纯文本，使用textContent
            contentElement.innerHTML = `
                <div class="iyuu-error">
                    <div class="iyuu-error-icon">❌</div>
                    <div class="iyuu-error-text">${message}</div>
                </div>
            `;
        }
    }

    // 主函数：获取并显示辅种信息
    async function getAndDisplaySeedInfo() {
        try {
            // 提取种子hash
            const hash = await extractSeedHash();
            if (!hash) {
                console.log('无法提取到hash值，页面中未找到有效的40位hash');
                
                // 显示无法查询的提示
                await displayNoHashMessage();
                return;
            }

            console.log('成功提取到hash值:', hash);
            
            // 检查是否是种子ID查询结果（已移除）
            if (hash.startsWith('SEED_ID_')) {
                console.log('种子ID查询功能已移除');
                return;
            }

            // 获取辅种信息
            const data = await fetchHybridIyuuInfo(hash);
            await updateSeedInfoDisplay(data);
            
        } catch (error) {
            console.error('获取辅种信息失败:', error);
            
            // 根据错误类型显示不同的错误信息
            let errorMessage = '';
            
            if (error.message.includes('Token未配置') || error.message.includes('token')) {
                errorMessage = `
                    <div style="text-align: left; padding: 20px;">
                        <h4 style="color: #dc3545; margin-top: 0;">API配置错误</h4>
                        <p style="color: #6c757d; margin-bottom: 10px;">错误原因：Token未配置或无效</p>
                        <div style="margin-top: 15px; padding: 10px; background: #fff3cd; border-radius: 4px; color: #856404;">
                            <strong>当前配置：</strong><br>
                            token: ${CONFIG.iyuuConfig.token === 'IYUU1T15d11d6a04492ad9' ? '未配置（使用示例值）' : '已配置'}
                        </div>
                        <div style="margin-top: 15px; padding: 10px; background: #e3f2fd; border-radius: 4px; color: #1565c0;">
                            <strong>可能的原因：</strong><br>
                            1. token需要先激活或授权<br>
                            2. token值不正确或已过期<br>
                            3. 该token已被禁用
                        </div>
                        <div style="margin-top: 15px; padding: 10px; background: #d4edda; border-radius: 4px; color: #155724;">
                            <strong>建议操作：</strong><br>
                            1. 联系IYUU官方确认token状态<br>
                            2. 检查token值是否正确<br>
                            3. 尝试申请新的token
                        </div>
                    </div>
                `;
            } else if (error.message.includes('sha1校验失败')) {
                errorMessage = `
                    <div style="text-align: left; padding: 20px;">
                        <h4 style="color: #dc3545; margin-top: 0;">API参数错误</h4>
                        <p style="color: #6c757d; margin-bottom: 10px;">错误原因：sha1校验失败</p>
                        <div style="margin-top: 15px; padding: 10px; background: #e3f2fd; border-radius: 4px; color: #1565c0;">
                            <strong>可能的原因：</strong><br>
                            1. hash值格式不正确<br>
                            2. API参数要求发生变化<br>
                            3. 需要特定的sha1计算方式
                        </div>
                        <div style="margin-top: 15px; padding: 10px; background: #d4edda; border-radius: 4px; color: #155724;">
                            <strong>建议操作：</strong><br>
                            1. 检查hash值是否正确<br>
                            2. 联系IYUU官方确认API参数要求<br>
                            3. 尝试使用不同的hash值
                        </div>
                    </div>
                `;
            } else if (error.message.includes('时间戳已过期')) {
                errorMessage = `
                    <div style="text-align: left; padding: 20px;">
                        <h4 style="color: #dc3545; margin-top: 0;">时间戳错误</h4>
                        <p style="color: #6c757d; margin-bottom: 10px;">错误原因：时间戳已过期</p>
                        <div style="margin-top: 15px; padding: 10px; background: #e3f2fd; border-radius: 4px; color: #1565c0;">
                            <strong>解决方案：</strong><br>
                            请刷新页面重试，脚本会自动生成新的时间戳
                        </div>
                    </div>
                `;
            } else {
                errorMessage = `获取失败: ${error.message}`;
            }
            
            showError(errorMessage);
        }
    }

    // 添加样式
    GM_addStyle(`
        /* 悬浮按钮样式 */
        #iyuu-floating-btn {
            position: fixed;
            left: 20px;
            top: 50%;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            cursor: pointer !important;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            transition: all 0.3s ease;
            user-select: none;
            transform: translateY(-50%);
        }

        #iyuu-floating-btn.dragging {
            cursor: move !important;
        }

        #iyuu-floating-btn:hover {
            transform: translateY(-50%) scale(1.1);
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }

        #iyuu-floating-btn:active {
            transform: translateY(-50%) scale(0.95);
        }

        #iyuu-floating-btn.dragging {
            opacity: 0.8;
            transform: scale(1.05);
            transition: none;
        }

        .iyuu-btn-icon {
            font-size: 20px;
            margin-bottom: 2px;
        }

        .iyuu-btn-text {
            font-size: 12px;
            font-weight: 500;
        }

        /* 弹出窗口样式 */
        #iyuu-popup {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 10001;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .iyuu-popup-content {
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            width: 90%;
            max-width: 900px;
            max-height: 80vh;
            overflow-y: auto;
            padding: 0;
        }

        .iyuu-popup-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            border-bottom: 1px solid #e9ecef;
            background: #f8f9fa;
            border-radius: 12px 12px 0 0;
            margin: -24px -24px 20px -24px;
        }

        .iyuu-popup-header h3 {
            margin: 0;
            color: #495057;
            font-size: 18px;
            font-weight: 600;
        }

        .iyuu-close-btn {
            background: none;
            border: none;
            font-size: 24px;
            color: #6c757d;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s ease;
        }

        .iyuu-close-btn:hover {
            background: #e9ecef;
            color: #495057;
        }

        .iyuu-popup-content {
            padding: 24px;
        }

        .iyuu-loading {
            text-align: center;
            padding: 40px 20px;
            color: #6c757d;
            font-size: 16px;
        }

        .iyuu-loading-icon {
            font-size: 48px;
            margin-bottom: 16px;
        }

        .iyuu-loading-text {
            font-size: 18px;
            font-weight: 600;
            color: #343a40;
            margin-bottom: 8px;
        }

        .iyuu-loading-subtitle {
            font-size: 14px;
            color: #6c757d;
        }

        .iyuu-stats {
            text-align: center;
            margin-bottom: 20px;
            padding: 12px;
            background: #e3f2fd;
            border-radius: 8px;
            color: #1565c0;
            font-weight: 500;
        }

        .iyuu-links-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 16px;
            padding: 0;
        }

        .iyuu-site-container {
            position: relative;
            display: inline-block;
            margin: 8px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background: white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: all 0.2s ease;
            cursor: pointer;
        }

        .iyuu-site-container:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .iyuu-site-checkbox {
            position: absolute;
            top: 8px;
            left: 8px;
            z-index: 10;
            transform: scale(1.2);
            cursor: pointer;
        }

        .iyuu-site-link {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 16px 12px;
            background: #f8f9fa;
            border-radius: 8px;
            text-decoration: none;
            color: #495057;
            transition: all 0.2s ease;
            border: 1px solid #e9ecef;
        }

        .iyuu-site-link:hover {
            background: #e9ecef;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .iyuu-site-icon {
            width: 50px;
            height: 50px;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            margin-bottom: 8px;
            border-radius: 4px;
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            position: relative;
        }
        
        .iyuu-site-icon::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: url('https://img1.pixhost.to/images/8308/635889434_np.png');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .iyuu-site-icon[data-error="true"]::before {
            opacity: 1;
        }

        .iyuu-site-name {
            font-size: 14px;
            font-weight: 500;
            text-align: center;
            line-height: 1.2;
            margin-bottom: 4px;
        }
        
        .iyuu-torrent-id {
            font-size: 11px;
            color: #6c757d;
            text-align: center;
            line-height: 1.2;
        }

        .iyuu-no-data {
            text-align: center;
            padding: 40px 20px;
            color: #6c757d;
        }

        .iyuu-no-data-icon {
            font-size: 48px;
            margin-bottom: 16px;
        }

        .iyuu-no-data-text {
            font-size: 16px;
            font-style: italic;
        }

        .iyuu-error {
            text-align: center;
            padding: 40px 20px;
            color: #dc3545;
        }

        .iyuu-error-icon {
            font-size: 48px;
            margin-bottom: 16px;
        }

        .iyuu-error-text {
            font-size: 16px;
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
            #iyuu-floating-btn {
                right: 15px;
                width: 50px;
                height: 50px;
            }

            .iyuu-btn-icon {
                font-size: 16px;
            }

            .iyuu-btn-text {
                font-size: 10px;
            }

            .iyuu-popup-content {
                width: 95%;
                max-height: 90vh;
            }

            .iyuu-links-container {
                grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                gap: 12px;
            }

            .iyuu-site-link {
                padding: 12px 8px;
            }

            .iyuu-site-icon {
                width: 40px;
                height: 40px;
            }

            .iyuu-site-name {
                font-size: 12px;
            }
        }
    `);

    // 初始化函数
    function init() {
        console.log('开始初始化IYUU脚本...');
        
        // 检查是否为种子详情页
        const isDetailPage = isSeedDetailPage();
        console.log('页面检测结果:', isDetailPage);
        
        if (!isDetailPage) {
            console.log('不是种子详情页，跳过初始化');
            return;
        }

        // 防止重复初始化
        if (window.iyuuScriptInitialized) {
            console.log('脚本已初始化，跳过重复初始化');
            return;
        }
        window.iyuuScriptInitialized = true;

        console.log('开始创建悬浮按钮和弹出窗口...');
        
        // 创建悬浮按钮
        createFloatingButton();
        
        // 创建弹出窗口（但不显示）
        createPopup();
        
        console.log('IYUU脚本初始化完成');
    }



    // 等待页面加载完成后初始化
    function tryInit() {
        console.log('尝试初始化IYUU脚本，当前页面状态:', document.readyState);
        init();
        
        // 对于TTG站点，额外延迟重试一次（防止页面动态加载导致检测失败）
        if (/totheglory\.im$/i.test(window.location.hostname) && !window.iyuuScriptInitialized) {
            console.log('TTG站点初始化失败，1秒后重试...');
            setTimeout(() => {
                console.log('TTG站点重试初始化...');
                init();
            }, 1000);
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInit);
    } else {
        tryInit();
    }

    // 在控制台添加辅助命令
    var __pageWindow = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;
    __pageWindow.debugIyuu = debugPageStructure;
    __pageWindow.testSidSha1 = testDifferentSidSha1;
    __pageWindow.showAllSidSha1 = showAllSidSha1Values;
    __pageWindow.clearSidSha1Cache = clearSidSha1Cache;
    __pageWindow.showCacheStatus = showCacheStatus;
    

    
    // 导出内部能力用于调试/直接调用
    __pageWindow.fetchIyuuInfo = fetchIyuuInfo;
    __pageWindow.getSidSha1 = getSidSha1;
    __pageWindow.getAndDisplaySeedInfo = getAndDisplaySeedInfo;


    // 调试：刷新/查看 IYUU 支持站点索引
    __pageWindow.refreshIyuuSitesIndex = async function(force = true) {
        const r = await fetchSupportedSitesIndex(!!force);
        console.log('refreshIyuuSitesIndex:', r);
        return r;
    };
    __pageWindow.showIyuuSitesIndex = function() {
        const idx = __iyuuSitesIndex || GM_getValue('iyuu_sites_index') || {};
        console.log('IYUU Sites Index size:', Object.keys(idx).length);
        return idx;
    };

    
    __pageWindow.callIyuuWith = async function(hash) {
        try {
            console.log('直接调用混合数据源，使用hash:', hash);
            const data = await fetchHybridIyuuInfo(hash);
            console.log('混合数据源直接调用结果:', data);
            try { await updateSeedInfoDisplay(data); } catch (e) { /* ignore */ }
            return data;
        } catch (e) {
            console.error('callIyuuWith 调用失败:', e);
            throw e;
        }
    };
    
    // 显示IYUU API的站点信息
    __pageWindow.showAllSiteInfo = function() {
        console.log('=== IYUU API站点信息 ===');
        const idx = __iyuuSitesIndex || GM_getValue('iyuu_sites_index') || {};
        if (Object.keys(idx).length === 0) {
            console.log('IYUU站点索引未加载，请先调用 fetchSupportedSitesIndex()');
            return;
        }
        Object.entries(idx).forEach(([sid, info]) => {
            console.log(`站点ID: ${sid}, 名称: ${info.nickname || info.site || '未知'}, URL: ${info.base_url || '未知'}`);
        });
        console.log(`总计: ${Object.keys(idx).length} 个站点`);
    };
    
    // 检查特定站点ID是否在索引中
    __pageWindow.checkSiteInIndex = function(siteId) {
        console.log(`=== 检查站点ID ${siteId} ===`);
        const idx = __iyuuSitesIndex || GM_getValue('iyuu_sites_index') || {};
        if (idx[siteId]) {
            const info = idx[siteId];
            console.log('✅ 找到站点信息:');
            console.log(`  - 站点ID: ${siteId}`);
            console.log(`  - 名称: ${info.nickname || info.site || '未知'}`);
            console.log(`  - URL: ${info.base_url || '未知'}`);
            console.log(`  - 详情页: ${info.details_page || '未知'}`);
            console.log(`  - 下载页: ${info.download_page || '未知'}`);
            console.log(`  - HTTPS: ${info.is_https === 0 ? 'HTTP' : 'HTTPS'}`);
            return true;
        } else {
            console.log('❌ 站点ID不在索引中');
            console.log('可用的站点ID范围:', Object.keys(idx).sort((a, b) => parseInt(a) - parseInt(b)));
            return false;
        }
    };
    
    // 分析缺失的站点
    __pageWindow.analyzeMissingSites = function() {
        console.log('=== 分析缺失的站点 ===');
        
        // 从页面HTML中提取站点信息
        const linkContainer = document.querySelector('.link-container');
        if (linkContainer) {
            const links = linkContainer.querySelectorAll('a');
            const pageSites = [];
            
            links.forEach(link => {
                const href = link.href;
                const text = link.textContent.trim();
                const urlMatch = href.match(/https?:\/\/([^\/]+)/);
                const domain = urlMatch ? urlMatch[1] : 'unknown';
                
                pageSites.push({
                    name: text,
                    domain: domain,
                    url: href
                });
            });
            
            console.log('页面显示的站点:', pageSites);
            
            // 检查IYUU索引中是否有这些站点
            const idx = __iyuuSitesIndex || GM_getValue('iyuu_sites_index') || {};
            const missingSites = [];
            
            pageSites.forEach(site => {
                const found = Object.values(idx).find(info => 
                    info.base_url === site.domain || 
                    info.base_url === site.domain.replace('www.', '') ||
                    info.nickname === site.name
                );
                
                if (!found) {
                    missingSites.push(site);
                }
            });
            
            if (missingSites.length > 0) {
                console.log('❌ 在IYUU索引中找不到的站点:', missingSites);
            } else {
                console.log('✅ 所有页面站点都在IYUU索引中找到');
            }
        } else {
            console.log('❌ 找不到页面中的link-container元素');
        }
    };
    
    // 显示用户持有的站点ID列表
    __pageWindow.showUserSiteIds = function() {
        console.log('=== 用户持有的站点ID列表 ===');
        console.log('站点ID列表:', CONFIG.userSiteIds);
        console.log(`总计: ${CONFIG.userSiteIds.length} 个站点`);
    };
    // 调试命令提示移除，避免冗余日志
    // 临时调试：强制使用页面40位hash发起一次查询
    __pageWindow.forceQueryWithPageHashOnce = async function() {
        try {
            const text = document.body.textContent || '';
            const matches = text.match(/[a-fA-F0-9]{40}/g) || [];
            let pageHash = null;
            for (const m of matches) {
                if (/^[a-fA-F0-9]{40}$/.test(m)) { pageHash = m; break; }
            }
            if (!pageHash) {
                console.warn('未在页面文本中找到40位hash');
                return '未找到40位hash';
            }
            console.log('forceQueryWithPageHashOnce 使用页面hash:', pageHash);
            await getAndDisplaySeedInfoWithHash(pageHash);
            return pageHash;
        } catch (e) {
            console.error('forceQueryWithPageHashOnce 失败:', e);
            return '失败: ' + (e?.message || e);
        }
    };

    // 强制刷新IYUU站点索引（解决站点映射错误问题）
    __pageWindow.refreshIyuuSitesIndex = async function() {
        try {
            console.log('强制刷新IYUU站点索引...');
            
            // 清除缓存
            try {
                GM_setValue('iyuu_sites_index', null);
                GM_setValue('iyuu_sites_index_time', 0);
                console.log('已清除站点索引缓存');
            } catch (e) {
                console.log('清除缓存失败:', e.message);
            }
            
            const result = await fetchSupportedSitesIndex(true);
            if (result) {
                console.log('站点索引刷新成功，条目数:', Object.keys(result).length);
                console.log('站点索引数据预览:', Object.keys(result).slice(0, 5).map(id => ({
                    id: id,
                    name: result[id]?.nickname || result[id]?.site || '未知',
                    url: result[id]?.base_url || '未知'
                })));
                
                // 显示所有站点ID的列表
                const siteIds = Object.keys(result).sort((a, b) => parseInt(a) - parseInt(b));
                console.log('所有站点ID列表:', siteIds);
                console.log('站点ID范围:', Math.min(...siteIds), '到', Math.max(...siteIds));
                
                return `刷新成功，共 ${Object.keys(result).length} 个站点`;
            } else {
                return '刷新失败';
            }
        } catch (e) {
            console.error('刷新索引失败:', e);
            return '刷新失败: ' + (e?.message || e);
        }
    };

    // 深度分析IYUU辅种数据缺失问题
    __pageWindow.deepAnalyzeMissingSites = async function() {
        console.log('=== 深度分析IYUU辅种数据缺失问题 ===');
        
        // 1. 检查当前页面的辅种数据
        const currentData = window.__lastIyuuResponseData;
        if (!currentData) {
            console.log('❌ 没有找到当前的IYUU辅种数据，请先查询一次');
            return;
        }
        
        console.log('当前IYUU辅种数据:', currentData);
        
        // 2. 分析返回的站点数量
        let totalSites = 0;
        const returnedSiteIds = [];
        
        if (currentData.data && typeof currentData.data === 'object') {
            Object.values(currentData.data).forEach(item => {
                if (item && item.torrent && Array.isArray(item.torrent)) {
                    totalSites += item.torrent.length;
                    item.torrent.forEach(t => {
                        if (t.sid && !returnedSiteIds.includes(t.sid)) {
                            returnedSiteIds.push(t.sid);
                        }
                    });
                }
            });
        }
        
        console.log(`IYUU API返回的辅种站点数量: ${totalSites}`);
        console.log(`IYUU API返回的唯一站点ID: ${returnedSiteIds.sort((a, b) => parseInt(a) - parseInt(b))}`);
        
        // 3. 检查页面中的原生辅种信息
        const nativeSites = [];
        const linkContainer = document.querySelector('.link-container');
        if (linkContainer) {
            const links = linkContainer.querySelectorAll('a');
            links.forEach(link => {
                const href = link.href;
                const text = link.textContent.trim();
                const urlMatch = href.match(/https?:\/\/([^\/]+)/);
                const domain = urlMatch ? urlMatch[1] : 'unknown';
                
                nativeSites.push({
                    name: text,
                    domain: domain,
                    url: href
                });
            });
            
            console.log(`页面原生辅种站点数量: ${nativeSites.length}`);
            console.log('页面原生辅种站点:', nativeSites);
        } else {
            console.log('❌ 找不到页面中的link-container元素，无法分析原生辅种信息');
        }
        
        // 4. 分析缺失的站点
        if (nativeSites.length > 0 && returnedSiteIds.length > 0) {
            console.log('\n=== 缺失站点分析 ===');
            
            const idx = __iyuuSitesIndex || GM_getValue('iyuu_sites_index') || {};
            const missingAnalysis = [];
            
            nativeSites.forEach(site => {
                // 尝试通过域名匹配
                const matchedById = Object.values(idx).find(info => 
                    info.base_url === site.domain || 
                    info.base_url === site.domain.replace('www.', '')
                );
                
                // 尝试通过名称匹配
                const matchedByName = Object.values(idx).find(info => 
                    info.nickname === site.name || 
                    info.site === site.name
                );
                
                if (matchedById) {
                    missingAnalysis.push({
                        site: site,
                        status: '✅ 在IYUU索引中找到',
                        matchType: '域名匹配',
                        iyuuInfo: matchedById,
                        inReturnedData: returnedSiteIds.includes(matchedById.id.toString())
                    });
                } else if (matchedByName) {
                    missingAnalysis.push({
                        site: site,
                        status: '✅ 在IYUU索引中找到',
                        matchType: '名称匹配',
                        iyuuInfo: matchedByName,
                        inReturnedData: returnedSiteIds.includes(matchedByName.id.toString())
                    });
                } else {
                    missingAnalysis.push({
                        site: site,
                        status: '❌ 在IYUU索引中未找到',
                        matchType: '无匹配',
                        iyuuInfo: null,
                        inReturnedData: false
                    });
                }
            });
            
            console.log('详细分析结果:');
            missingAnalysis.forEach(analysis => {
                console.log(`\n站点: ${analysis.site.name} (${analysis.site.domain})`);
                console.log(`状态: ${analysis.status}`);
                console.log(`匹配方式: ${analysis.matchType}`);
                if (analysis.iyuuInfo) {
                    console.log(`IYUU站点ID: ${analysis.iyuuInfo.id}`);
                    console.log(`IYUU站点名称: ${analysis.iyuuInfo.nickname || analysis.iyuuInfo.site || '未知'}`);
                    console.log(`IYUU站点域名: ${analysis.iyuuInfo.base_url || '未知'}`);
                    console.log(`是否在返回数据中: ${analysis.inReturnedData ? '✅ 是' : '❌ 否'}`);
                }
            });
            
            // 5. 总结问题
            const missingInIndex = missingAnalysis.filter(a => !a.iyuuInfo).length;
            const missingInData = missingAnalysis.filter(a => a.iyuuInfo && !a.inReturnedData).length;
            
            console.log('\n=== 问题总结 ===');
            console.log(`在IYUU索引中找不到的站点: ${missingInIndex} 个`);
            console.log(`在IYUU索引中找到但未返回数据的站点: ${missingInData} 个`);
            
            if (missingInIndex > 0) {
                console.log('💡 建议: 这些站点可能不在IYUU支持的站点列表中，或者站点信息已过期');
            }
            
            if (missingInData > 0) {
                console.log('💡 建议: 这些站点虽然在IYUU索引中，但API未返回辅种数据，可能是以下原因:');
                console.log('   - 该站点确实没有这个种子的辅种信息');
                console.log('   - IYUU API的数据库不完整');
                console.log('   - 需要更新sid_sha1值');
                console.log('   - 站点状态异常（维护、关闭等）');
            }
        }
        
        return '深度分析完成，请查看控制台输出';
    };

    // 比较IYUU API和页面原生辅种数据的差异
    __pageWindow.compareIyuuVsNative = function() {
        console.log('=== 比较IYUU API和页面原生辅种数据 ===');
        
        // 获取IYUU数据
        const iyuuData = window.__lastIyuuResponseData;
        if (!iyuuData) {
            console.log('❌ 没有找到IYUU辅种数据，请先查询一次');
            return;
        }
        
        // 获取页面原生数据
        const nativeSites = [];
        const linkContainer = document.querySelector('.link-container');
        if (linkContainer) {
            const links = linkContainer.querySelectorAll('a');
            links.forEach(link => {
                const href = link.href;
                const text = link.textContent.trim();
                nativeSites.push({
                    name: text,
                    url: href
                });
            });
        }
        
        // 分析IYUU数据
        const iyuuSites = [];
        if (iyuuData.data && typeof iyuuData.data === 'object') {
            Object.values(iyuuData.data).forEach(item => {
                if (item && item.torrent && Array.isArray(item.torrent)) {
                    item.torrent.forEach(t => {
                        const idx = __iyuuSitesIndex || GM_getValue('iyuu_sites_index') || {};
                        const siteInfo = idx[t.sid];
                        iyuuSites.push({
                            id: t.sid,
                            name: siteInfo ? (siteInfo.nickname || siteInfo.site || `站点${t.sid}`) : `站点${t.sid}`,
                            torrentId: t.torrent_id,
                            infoHash: t.info_hash
                        });
                    });
                }
            });
        }
        
        console.log('=== 数据对比 ===');
        console.log(`页面原生辅种站点数量: ${nativeSites.length}`);
        console.log(`IYUU API返回站点数量: ${iyuuSites.length}`);
        
        console.log('\n页面原生辅种站点:');
        nativeSites.forEach((site, index) => {
            console.log(`${index + 1}. ${site.name} - ${site.url}`);
        });
        
        console.log('\nIYUU API返回的站点:');
        iyuuSites.forEach((site, index) => {
            console.log(`${index + 1}. ${site.name} (ID: ${site.id}) - 种子ID: ${site.torrentId}`);
        });
        
        // 找出差异
        const nativeNames = nativeSites.map(s => s.name);
        const iyuuNames = iyuuSites.map(s => s.name);
        
        const onlyInNative = nativeNames.filter(name => !iyuuNames.includes(name));
        const onlyInIyuu = iyuuNames.filter(name => !nativeNames.includes(name));
        
        if (onlyInNative.length > 0) {
            console.log('\n❌ 只在页面原生数据中出现的站点:');
            onlyInNative.forEach(name => console.log(`  - ${name}`));
        }
        
        if (onlyInIyuu.length > 0) {
            console.log('\n❌ 只在IYUU API中出现的站点:');
            onlyInIyuu.forEach(name => console.log(`  - ${name}`));
        }
        
        if (onlyInNative.length === 0 && onlyInIyuu.length === 0) {
            console.log('\n✅ 页面原生数据和IYUU API数据完全一致');
        }
        
        return '对比分析完成，请查看控制台输出';
    };

    // 检查IYUU API的完整性和准确性
    __pageWindow.checkIyuuApiIntegrity = async function() {
        console.log('=== 检查IYUU API的完整性和准确性 ===');
        
        // 1. 检查站点索引的完整性
        const idx = __iyuuSitesIndex || GM_getValue('iyuu_sites_index') || {};
        console.log(`IYUU站点索引条目数: ${Object.keys(idx).length}`);
        
        if (Object.keys(idx).length === 0) {
            console.log('❌ IYUU站点索引为空，尝试刷新...');
            await __pageWindow.refreshIyuuSitesIndex();
            return;
        }
        
        // 2. 检查站点索引数据的质量
        const qualityIssues = [];
        Object.entries(idx).forEach(([id, info]) => {
            if (!info.nickname && !info.site) {
                qualityIssues.push({ id, issue: '缺少站点名称' });
            }
            if (!info.base_url) {
                qualityIssues.push({ id, issue: '缺少站点域名' });
            }
            if (!info.details_page && !info.download_page) {
                qualityIssues.push({ id, issue: '缺少页面模板' });
            }
        });
        
        if (qualityIssues.length > 0) {
            console.log('⚠️ 发现站点索引数据质量问题:');
            qualityIssues.forEach(issue => {
                console.log(`  站点ID ${issue.id}: ${issue.issue}`);
            });
        } else {
            console.log('✅ 站点索引数据质量良好');
        }
        
        // 3. 检查当前请求参数
        const lastParams = __lastIyuuRequestParams;
        if (lastParams) {
            console.log('\n=== 最近一次请求参数 ===');
            console.log('sid_sha1:', lastParams.sid_sha1);
            console.log('sha1:', lastParams.sha1);
            console.log('info_hash:', lastParams.hash);
            console.log('timestamp:', lastParams.timestamp);
            console.log('version:', lastParams.version);
        }
        
        // 4. 检查当前响应数据
        const lastResponse = window.__lastIyuuResponseData;
        if (lastResponse) {
            console.log('\n=== 最近一次响应数据 ===');
            console.log('响应状态码:', lastResponse.code);
            console.log('响应消息:', lastResponse.msg);
            console.log('数据条目数:', lastResponse.data ? Object.keys(lastResponse.data).length : 0);
        }
        
        // 5. 建议
        console.log('\n=== 建议 ===');
        if (qualityIssues.length > 0) {
            console.log('1. 站点索引数据存在质量问题，建议刷新索引');
        }
        if (!lastResponse || lastResponse.code !== 0) {
            console.log('2. 最近的API请求可能存在问题，建议重新查询');
        }
        if (lastParams && lastParams.sid_sha1) {
            console.log('3. 当前使用的sid_sha1值:', lastParams.sid_sha1);
        }
        
        return '完整性检查完成，请查看控制台输出';
    };

    // 测试混合数据源功能
    __pageWindow.testHybridDataSource = async function(hash) {
        console.log('=== 测试混合数据源功能 ===');
        
        if (!hash) {
            console.log('❌ 请提供hash参数');
            return '请提供hash参数，例如: testHybridDataSource("bc30b3ceb1a54e3e623589613d7e25df19c4ae95")';
        }
        
        try {
            console.log('1. 测试IYUU API...');
            const iyuuData = await fetchIyuuInfo(hash);
            console.log('IYUU API结果:', iyuuData);
            
            console.log('\n2. 测试ZMPT API...');
            const zmptData = await fetchZmptInfo(hash);
            console.log('ZMPT API结果:', zmptData);
            
            console.log('\n3. 测试混合数据源...');
            const hybridData = await fetchHybridIyuuInfo(hash);
            console.log('混合数据源结果:', hybridData);
            
            console.log('\n=== 数据对比 ===');
            const iyuuCount = iyuuData?.data ? Object.keys(iyuuData.data).length : 0;
            const zmptCount = zmptData?.data ? zmptData.data.length : 0;
            const hybridCount = hybridData?.data ? Object.keys(hybridData.data).length : 0;
            
            console.log(`IYUU API: ${iyuuCount} 个站点`);
            console.log(`ZMPT API: ${zmptCount} 个站点`);
            console.log(`混合数据源: ${hybridCount} 个站点`);
            
            if (hybridCount > iyuuCount) {
                console.log(`✅ 混合数据源成功补充了 ${hybridCount - iyuuCount} 个站点`);
            } else if (hybridCount === iyuuCount) {
                console.log('ℹ️ 混合数据源未增加新站点');
            } else {
                console.log('⚠️ 混合数据源站点数量异常');
            }
            
            return '混合数据源测试完成，请查看控制台输出';
            
        } catch (error) {
            console.error('混合数据源测试失败:', error);
            return `测试失败: ${error.message}`;
        }
    };

    // 切换混合数据源开关
    __pageWindow.toggleHybridDataSource = function() {
        CONFIG.enableHybridDataSource = !CONFIG.enableHybridDataSource;
        console.log(`混合数据源已${CONFIG.enableHybridDataSource ? '启用' : '禁用'}`);
        return `混合数据源: ${CONFIG.enableHybridDataSource ? '已启用' : '已禁用'}`;
    };

    // 显示混合数据源状态
    __pageWindow.showHybridDataSourceStatus = function() {
        console.log('=== 混合数据源状态 ===');
        console.log(`启用状态: ${CONFIG.enableHybridDataSource ? '✅ 已启用' : '❌ 已禁用'}`);
        console.log(`数据源优先级: ${CONFIG.hybridDataSourcePriority}`);
        console.log(`IYUU API: ${CONFIG.iyuuApiUrl}`);
        console.log(`ZMPT API: ${CONFIG.zmptApiUrl}`);
        
        if (CONFIG.enableHybridDataSource) {
            console.log('\n✅ 混合数据源已启用，将同时查询IYUU和ZMPT API');
            console.log('📊 数据合并策略: 以IYUU数据为主，ZMPT数据补充缺失站点');
        } else {
            console.log('\n❌ 混合数据源已禁用，仅使用IYUU API');
        }
        
        return `混合数据源: ${CONFIG.enableHybridDataSource ? '已启用' : '已禁用'}`;
    };

    // 调试页面结构函数
    function debugPageStructure() {
        console.log('=== 页面结构调试信息 ===');
        console.log('当前URL:', window.location.href);
        console.log('页面标题:', document.title);
        
        // 检查种子详情页特征
        const href = window.location.href;
        const isDetailPage = /[?&]id=\d+/.test(href) && /\bdetails?\.php\b/.test(href)
            || /\/(detail|details)\/\d+(?:$|[?#])/.test(href);
        console.log('是否为种子详情页:', isDetailPage);
        
        if (isDetailPage) {
            const seedId = new URLSearchParams(window.location.search).get('id');
            console.log('种子ID:', seedId);
            
            // 尝试提取hash值
            const text = document.body?.textContent || '';
            const hashMatches = text.match(/[a-fA-F0-9]{40}/g) || [];
            console.log('页面中找到的40位hash数量:', hashMatches.length);
            if (hashMatches.length > 0) {
                console.log('第一个hash:', hashMatches[0]);
            }
            
            // 检查页面元素
            const downloadLinks = document.querySelectorAll('a[href*="download.php"]');
            console.log('下载链接数量:', downloadLinks.length);
            
            const torrentLinks = document.querySelectorAll('a[href*="torrents.php"]');
            console.log('种子链接数量:', torrentLinks.length);
        }
        
        console.log('=== 调试信息结束 ===');
        return '页面结构调试完成，请查看控制台输出';
    }

    // 显示所有sid_sha1值的函数
    function showAllSidSha1Values() {
        console.log('=== 显示所有sid_sha1值 ===');
        
        // 获取当前域名
        const currentDomain = window.location.hostname;
        console.log('当前域名:', currentDomain);
        
        // 尝试多种可能的sid_sha1值
        const possibleValues = [
            currentDomain,
            currentDomain.replace('www.', ''),
            currentDomain.toLowerCase(),
            currentDomain.replace(/\./g, ''),
            currentDomain.replace(/\./g, '').toLowerCase()
        ];
        
        console.log('可能的sid_sha1值:');
        possibleValues.forEach((value, index) => {
            console.log(`${index + 1}. ${value}`);
        });
        
        // 显示缓存的sid_sha1值
        const cachedSidSha1 = GM_getValue('sid_sha1_cache', {});
        if (Object.keys(cachedSidSha1).length > 0) {
            console.log('\n缓存的sid_sha1值:');
            Object.entries(cachedSidSha1).forEach(([domain, value]) => {
                console.log(`${domain}: ${value}`);
            });
        } else {
            console.log('\n没有缓存的sid_sha1值');
        }
        
        console.log('=== sid_sha1值显示完成 ===');
        return 'sid_sha1值显示完成，请查看控制台输出';
    }

    // 防止重复初始化的标记
    let __initializationCompleted = false;

    // 初始化检查：提示用户配置IYUU令牌
    function initializeIyuuToken() {
        // 防止重复初始化
        if (__initializationCompleted) {
            console.log('IYUU脚本已初始化，跳过重复初始化');
            return;
        }
        
        const savedToken = GM_getValue('iyuu_token', '');
        const hasToken = CONFIG.iyuuConfig.token && CONFIG.iyuuConfig.token.trim() !== '';
        
        if (!savedToken && !hasToken) {
            // 首次使用，但不自动显示配置界面
            console.log('⚠️ 未配置IYUU令牌，用户需要主动点击悬浮按钮进行配置');
            __initializationCompleted = true;
        } else if (savedToken && hasToken) {
            console.log('✅ IYUU令牌已配置:', savedToken.substring(0, 10) + '...');
            __initializationCompleted = true;
        } else {
            console.log('⚠️ 未配置IYUU令牌，请到 https://iyuu.cn/ 获取令牌');
            __initializationCompleted = true;
        }
    }

    // 页面加载完成后初始化（只执行一次）
    if (!window.__iyuuScriptInitialized) {
        window.__iyuuScriptInitialized = true;
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeIyuuToken);
        } else {
            initializeIyuuToken();
        }
    } else {
        console.log('IYUU脚本已在其他实例中初始化，跳过');
    }

    // 显示下载器设置界面
    async function showDownloaderSettingsInterface() {
        const popup = document.getElementById('iyuu-popup');
        if (!popup) return;

        const contentElement = popup.querySelector('.iyuu-popup-content');

        // 获取保存的下载器配置
        const downloaderConfigs = GM_getValue('iyuu_downloader_configs', [
            {
                id: 1,
                name: "主下载器",
                type: "qBittorrent",
                webui: "http://localhost:8080",
                username: "admin",
                password: "",
                enabled: true
            },
            {
                id: 2,
                name: "备用下载器",
                type: "Transmission",
                webui: "http://localhost:9091",
                username: "admin",
                password: "",
                enabled: true
            },
            {
                id: 3,
                name: "第三下载器",
                type: "qBittorrent",
                webui: "http://localhost:8081",
                username: "admin",
                password: "",
                enabled: true
            }
        ]);

        // 检查是否有当前显示的配置，如果没有则使用默认配置
        const currentConfigs = GM_getValue('iyuu_current_downloader_configs', null);
        const configsToUse = currentConfigs || downloaderConfigs;

        // 生成标签页HTML
        const tabsHTML = configsToUse.map((config, index) => `
            <button class="downloader-tab ${index === 0 ? 'active' : ''}" data-tab-id="${config.id}">
                ${config.name}
                ${configsToUse.length > 1 ? `<span class="tab-close" data-tab-id="${config.id}">×</span>` : ''}
            </button>
        `).join('');

        // 生成配置表单HTML
        const formsHTML = configsToUse.map((config, index) => `
            <div class="downloader-form ${index === 0 ? 'active' : ''}" data-form-id="${config.id}">
                <div class="form-row">
                    <div class="form-group">
                        <label>下载器类型:</label>
                        <select class="downloader-type" data-config-id="${config.id}">
                            <option value="qBittorrent" ${config.type === 'qBittorrent' ? 'selected' : ''}>qBittorrent</option>
                            <option value="Transmission" ${config.type === 'Transmission' ? 'selected' : ''}>Transmission</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>下载器名称:</label>
                        <input type="text" class="downloader-name" data-config-id="${config.id}" value="${config.name}" placeholder="请输入下载器名称">
                    </div>
                    <div class="form-group">
                        <label>&nbsp;</label>
                        <button class="test-connectivity-btn" data-config-id="${config.id}">🔍 测试连通性</button>
                    </div>
                </div>
                <div class="form-group">
                    <label>WEB-UI地址:</label>
                    <input type="text" class="downloader-webui" data-config-id="${config.id}" value="${config.webui}" placeholder="http://localhost:8080">
                </div>
                <div class="form-group">
                    <label>用户名:</label>
                    <input type="text" class="downloader-username" data-config-id="${config.id}" value="${config.username}" placeholder="请输入用户名">
                </div>
                <div class="form-group">
                    <label>密码:</label>
                    <input type="password" class="downloader-password" data-config-id="${config.id}" value="${config.password}" placeholder="请输入密码">
                </div>
                <div class="form-group">
                    <label>已导入保存路径:</label>
                    <div class="preset-paths" data-config-id="${config.id}" style="display:flex;gap:6px;flex-wrap:wrap;">
                        ${(Array.isArray(config.preset_paths)?config.preset_paths:[]).map(p=>`<span style='background:#f1f3f5;border:1px solid #dee2e6;border-radius:4px;padding:4px 6px;font-size:12px;'>${p}</span>`).join('') || '<span style="color:#888;">暂无</span>'}
                    </div>
                    <div style="display:flex;gap:8px;margin-top:8px;">
                        <button class="import-paths-btn" data-config-id="${config.id}" style="padding:6px 10px;background:#17a2b8;color:#fff;border:none;border-radius:4px;cursor:pointer;">⬇ 一键导入下载路径</button>
                        <button class="clear-paths-btn" data-config-id="${config.id}" style="padding:6px 10px;background:#dc3545;color:#fff;border:none;border-radius:4px;cursor:pointer;">🗑 清空已导入路径</button>
                    </div>
                </div>
            </div>
        `).join('');

        // 显示下载器设置界面
        contentElement.innerHTML = `
            <div class="iyuu-downloader-settings" style="padding: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="color: #1976d2; margin: 0; font-size: 24px; font-weight: 600; background: none;">下载器设置</h2>
                    <div style="display: flex; gap: 10px;">
                        <button id="iyuu-return-main-from-downloader" style="padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 500;">
                            ← 返回主界面
                        </button>

                        <button id="iyuu-save-downloader-settings" style="padding: 8px 16px; background: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 500;">
                            💾 保存下载器设置
                        </button>
                    </div>
                </div>
                <div class="downloader-tabs" style="display: flex; gap: 5px; margin: 0 auto 15px; max-width: 800px; justify-content: flex-start; flex-wrap: wrap;">
                    ${tabsHTML}
                    <button id="add-downloader-btn" style="padding: 8px 16px; background: #2196f3; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 500;">
                        + 添加下载器
                    </button>
                </div>
                <div class="downloader-forms" style="text-align: left; max-width: 800px; margin: 0 auto;">
                    ${formsHTML}
                </div>
            </div>
        `;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .downloader-tab {
                padding: 8px 16px;
                background: #f8f9fa;
                border: 2px solid #dee2e6;
                border-radius: 6px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 500;
                position: relative;
                margin-right: 8px;
                margin-bottom: 6px;
                transition: all 0.2s ease;
            }
            .downloader-tab:hover {
                background: #e9ecef;
                border-color: #adb5bd;
            }
            .downloader-tab.active {
                background: #007bff;
                color: white;
                border-color: #007bff;
                box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
            }
            .tab-close {
                position: absolute;
                top: -6px;
                right: -6px;
                background: #dc3545;
                color: white;
                border-radius: 50%;
                width: 18px;
                height: 18px;
                line-height: 18px;
                text-align: center;
                font-size: 11px;
                cursor: pointer;
                transition: background 0.2s ease;
            }
            .tab-close:hover {
                background: #c82333;
            }
            .downloader-form {
                display: none;
                padding: 20px;
                border: 2px solid #dee2e6;
                border-radius: 8px;
                background: white;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            .form-row {
                display: flex;
                gap: 15px;
                margin-bottom: 15px;
            }
            .form-row .form-group {
                flex: 1;
                margin-bottom: 0;
            }
            .form-row .form-group:last-child {
                flex: 0 0 auto;
            }
            .downloader-form.active {
                display: block;
            }
            .form-group {
                margin-bottom: 15px;
            }
            .form-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: 600;
                color: #333;
                font-size: 14px;
            }
            .form-group input, .form-group select {
                width: 100%;
                padding: 10px 12px;
                border: 2px solid #ddd;
                border-radius: 6px;
                font-size: 14px;
                transition: border-color 0.2s ease;
                box-sizing: border-box;
            }
            .form-group input:focus, .form-group select:focus {
                outline: none;
                border-color: #007bff;
                box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
            }
            .test-connectivity-btn {
                padding: 8px 16px;
                background: #ff9800;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: background 0.2s ease;
                width: 100%;
            }
            .test-connectivity-btn:hover {
                background: #f57c00;
            }
            .test-connectivity-btn:disabled {
                background: #ccc;
                cursor: not-allowed;
            }
        `;
        document.head.appendChild(style);

        // 设置事件监听器
        setupDownloaderSettingsEventListeners();
    }

    // 设置下载器设置界面的事件监听器
    function setupDownloaderSettingsEventListeners() {
        // 返回主界面按钮
        const returnMainBtn = document.getElementById('iyuu-return-main-from-downloader');
        if (returnMainBtn) {
            returnMainBtn.addEventListener('click', function() {
                console.log('返回主界面按钮被点击');
                showMainInterface();
            });
        }



        // 保存设置按钮
        const saveSettingsBtn = document.getElementById('iyuu-save-downloader-settings');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', function() {
                console.log('保存下载器设置按钮被点击');
                saveDownloaderSettings();
            });
        }

        // 标签页切换
        const tabs = document.querySelectorAll('.downloader-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', function(e) {
                if (e.target.classList.contains('tab-close')) {
                    return; // 不处理关闭按钮点击
                }
                const tabId = this.getAttribute('data-tab-id');
                switchDownloaderTab(tabId);
            });
        });

        // 标签页关闭按钮
        const closeButtons = document.querySelectorAll('.tab-close');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const tabId = this.getAttribute('data-tab-id');
                removeDownloaderTab(tabId);
            });
        });

        // 添加下载器按钮
        const addDownloaderBtn = document.getElementById('add-downloader-btn');
        if (addDownloaderBtn && !addDownloaderBtn.__bound) {
            addDownloaderBtn.addEventListener('click', function() {
                console.log('添加下载器按钮被点击');
                addNewDownloader();
            });
            addDownloaderBtn.__bound = true;
        }

        // 测试连通性按钮
        const testButtons = document.querySelectorAll('.test-connectivity-btn');
        testButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const configId = this.getAttribute('data-config-id');
                testDownloaderConnectivity(configId);
            });
        });

        // 实时更新标签页名称
        const nameInputs = document.querySelectorAll('.downloader-name');
        nameInputs.forEach(input => {
            input.addEventListener('input', function() {
                const configId = this.getAttribute('data-config-id');
                updateTabName(configId, this.value);
            });
        });

        // 一键导入/清空 路径按钮
        document.querySelectorAll('.import-paths-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
                const id = parseInt(this.getAttribute('data-config-id'));
                await importDownloaderPaths(id);
            });
        });
        document.querySelectorAll('.clear-paths-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
                const id = parseInt(this.getAttribute('data-config-id'));
                await clearDownloaderPaths(id);
            });
        });
    }

    // 切换下载器标签页
    function switchDownloaderTab(tabId) {
        // 移除所有活动状态
        document.querySelectorAll('.downloader-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.downloader-form').forEach(form => form.classList.remove('active'));

        // 激活选中的标签页和表单
        const selectedTab = document.querySelector(`.downloader-tab[data-tab-id="${tabId}"]`);
        const selectedForm = document.querySelector(`.downloader-form[data-form-id="${tabId}"]`);

        if (selectedTab) selectedTab.classList.add('active');
        if (selectedForm) selectedForm.classList.add('active');
    }

    // 移除下载器标签页
    function removeDownloaderTab(tabId) {
        const tab = document.querySelector(`.downloader-tab[data-tab-id="${tabId}"]`);
        const form = document.querySelector(`.downloader-form[data-form-id="${tabId}"]`);

        if (tab) tab.remove();
        if (form) form.remove();

        // 如果删除的是当前活动标签页，切换到第一个
        const activeTab = document.querySelector('.downloader-tab.active');
        if (!activeTab) {
            const firstTab = document.querySelector('.downloader-tab');
            if (firstTab) {
                switchDownloaderTab(firstTab.getAttribute('data-tab-id'));
            }
        }

        // 保存当前显示的配置状态
        saveCurrentDownloaderState();
    }

    // 添加新下载器
    function addNewDownloader() {
        // 获取当前显示的标签页ID列表
        const currentTabIds = Array.from(document.querySelectorAll('.downloader-tab')).map(tab =>
            parseInt(tab.getAttribute('data-tab-id'))
        );

        // 生成下一个可用的名称编号
        let nextNumber = 1;
        const existingNames = Array.from(document.querySelectorAll('.downloader-name')).map(input => input.value);

        while (existingNames.includes(`下载器${nextNumber}`)) {
            nextNumber++;
        }

        // 生成新的ID（使用当前最大ID + 1）
        const newId = currentTabIds.length > 0 ? Math.max(...currentTabIds) + 1 : 1;

        const newConfig = {
            id: newId,
            name: `下载器${nextNumber}`,
            type: "qBittorrent",
            webui: "http://localhost:8080",
            username: "admin",
            password: "",
            enabled: true
        };

        // 添加新标签页
        const tabsContainer = document.querySelector('.downloader-tabs');
        const newTab = document.createElement('button');
        newTab.className = 'downloader-tab';
        newTab.setAttribute('data-tab-id', newId);
        newTab.innerHTML = `
            ${newConfig.name}
            <span class="tab-close" data-tab-id="${newId}">×</span>
        `;

        // 插入到添加按钮之前
        const addBtn = document.getElementById('add-downloader-btn');
        tabsContainer.insertBefore(newTab, addBtn);

        // 添加新表单
        const formsContainer = document.querySelector('.downloader-forms');
        const newForm = document.createElement('div');
        newForm.className = 'downloader-form';
        newForm.setAttribute('data-form-id', newId);
        newForm.innerHTML = `
            <div class="form-group">
                <label>下载器类型:</label>
                <select class="downloader-type" data-config-id="${newId}">
                    <option value="qBittorrent" selected>qBittorrent</option>
                    <option value="Transmission">Transmission</option>
                </select>
            </div>
            <div class="form-group">
                <label>下载器名称:</label>
                <input type="text" class="downloader-name" data-config-id="${newId}" value="${newConfig.name}" placeholder="请输入下载器名称">
            </div>
            <div class="form-group">
                <label>WEB-UI地址:</label>
                <input type="text" class="downloader-webui" data-config-id="${newId}" value="${newConfig.webui}" placeholder="http://localhost:8080">
            </div>
            <div class="form-group">
                <label>用户名:</label>
                <input type="text" class="downloader-username" data-config-id="${newId}" value="${newConfig.username}" placeholder="请输入用户名">
            </div>
            <div class="form-group">
                <label>密码:</label>
                <input type="password" class="downloader-password" data-config-id="${newId}" value="${newConfig.password}" placeholder="请输入密码">
            </div>
            <div class="form-group">
                <button class="test-connectivity-btn" data-config-id="${newId}">🔍 测试连通性</button>
            </div>
        `;

        formsContainer.appendChild(newForm);

        // 切换到新标签页
        switchDownloaderTab(newId);

        // 为新创建的元素绑定所需事件，避免全量重复绑定
        // 1) 标签页点击与关闭
        newTab.addEventListener('click', function(e) {
            const tabId = this.getAttribute('data-tab-id');
            if (e.target && e.target.classList && e.target.classList.contains('tab-close')) {
                e.stopPropagation();
                removeDownloaderTab(tabId);
                return;
            }
            switchDownloaderTab(tabId);
        });

        // 2) 名称输入实时更新标签名
        const nameInput = newForm.querySelector(`.downloader-name[data-config-id="${newId}"]`);
        if (nameInput && !nameInput.__bound) {
            nameInput.addEventListener('input', function() {
                updateTabName(newId, this.value);
            });
            nameInput.__bound = true;
        }

        // 3) 测试连通性
        const testBtn = newForm.querySelector(`.test-connectivity-btn[data-config-id="${newId}"]`);
        if (testBtn && !testBtn.__bound) {
            testBtn.addEventListener('click', function() {
                testDownloaderConnectivity(newId);
            });
            testBtn.__bound = true;
        }

        // 保存当前显示的配置状态
        saveCurrentDownloaderState();
    }

    // 更新标签页名称
    function updateTabName(configId, newName) {
        const tab = document.querySelector(`.downloader-tab[data-tab-id="${configId}"]`);
        if (tab) {
            const closeBtn = tab.querySelector('.tab-close');
            tab.innerHTML = `${newName}${closeBtn ? closeBtn.outerHTML : ''}`;
        }
    }

    // 保存当前显示的下载器状态
    function saveCurrentDownloaderState() {
        const configs = [];
        const forms = document.querySelectorAll('.downloader-form');

        forms.forEach(form => {
            const configId = form.getAttribute('data-form-id');
            const type = form.querySelector(`.downloader-type[data-config-id="${configId}"]`).value;
            const name = form.querySelector(`.downloader-name[data-config-id="${configId}"]`).value;
            const webui = form.querySelector(`.downloader-webui[data-config-id="${configId}"]`).value;
            const username = form.querySelector(`.downloader-username[data-config-id="${configId}"]`).value;
            const password = form.querySelector(`.downloader-password[data-config-id="${configId}"]`).value;
            const presetNodes = form.querySelectorAll('.preset-paths span');
            const preset_paths = Array.from(presetNodes).map(n=>n.textContent).filter(Boolean);

            configs.push({
                id: parseInt(configId),
                name: name,
                type: type,
                webui: webui,
                username: username,
                password: password,
                enabled: true,
                preset_paths
            });
        });

        GM_setValue('iyuu_current_downloader_configs', configs);
        console.log('当前下载器状态已保存:', configs);
    }

    // 简易并发控制器
    async function runWithConcurrency(items, worker, limit) {
        const ret = []; let idx = 0; let active = 0;
        return await new Promise((resolve) => {
            const next = () => {
                while (active < limit && idx < items.length) {
                    const currentIndex = idx++;
                    active++;
                    Promise.resolve(worker(items[currentIndex], currentIndex))
                        .then((r) => { ret[currentIndex] = r; })
                        .catch((e) => { ret[currentIndex] = undefined; console.error('并发任务失败', e); })
                        .finally(() => { active--; if (ret.length === items.length && idx >= items.length && active === 0) resolve(ret); else next(); });
                }
                if (items.length === 0) resolve(ret);
            };
            next();
        });
    }

    // 下载torrent文件
    async function downloadTorrentFiles() {
        if (!currentSeedData || !currentSeedData.data) {
            showMessage('❌ 没有可下载的torrent文件！', 'error');
            return;
        }

        const allTorrents = [];

        // 收集所有可下载的torrent
        Object.values(currentSeedData.data).forEach(item => {
            if (item && item.torrent && Array.isArray(item.torrent)) {
                allTorrents.push(...item.torrent);
            }
        });

        if (allTorrents.length === 0) {
            showMessage('❌ 没有找到可下载的torrent文件！', 'error');
            return;
        }

        // 获取选中的站点复选框
        const selectedCheckboxes = document.querySelectorAll('.iyuu-site-checkbox:checked');
        const selectedSiteIds = Array.from(selectedCheckboxes).map(cb => parseInt(cb.getAttribute('data-site-id')));

        if (selectedSiteIds.length === 0) {
            showMessage('❌ 请至少选择一个站点！', 'error');
            return;
        }

        // 过滤选中的站点
        const selectedTorrents = allTorrents.filter(torrent =>
            selectedSiteIds.includes(torrent.sid)
        );

        // 若用户勾选了当前页面站点(data-source="current")，但上面列表中没有该条目，则基于当前页兜底补充一条
        try {
            const currentCb = document.querySelector('.iyuu-site-checkbox[data-source="current"]');
            if (currentCb && currentCb.checked) {
                const currentSid = parseInt(currentCb.getAttribute('data-site-id'));
                const url = String(location.href || '');
                const idMatch = url.match(/[?&]id=(\d+)/) || url.match(/\/t\/(\d+)\//) || url.match(/\/details?\/(\d+)/);
                const currentTid = idMatch ? idMatch[1] : undefined;
                const currentHash = currentSeedData?.data?.[currentSeedData?.currentHash]?.info_hash || undefined;
                const exists = selectedTorrents.some(t => t.sid === currentSid && String(t.torrent_id) === String(currentTid));
                if (currentSid && currentTid && !exists) {
                    selectedTorrents.push({ sid: currentSid, torrent_id: Number(currentTid), info_hash: currentHash, source: 'current' });
                    console.log('DEBUG: 下载前兜底追加当前站点条目', { sid: currentSid, torrent_id: Number(currentTid) });
                }
            }
        } catch (e) { console.warn('下载前追加当前站点兜底失败', e); }

        if (selectedTorrents.length === 0) {
            showMessage('❌ 选中的站点没有可下载的torrent文件！', 'error');
            return;
        }

        // 并发解析与下载（限流以避免被站点风控），默认并发 3
        const concurrency = GM_getValue('iyuu_download_concurrency', 3);
        let started = 0;
        await runWithConcurrency(selectedTorrents, async (tor) => {
            try {
                const { detailsUrl, downloadUrl } = await resolveTorrentUrls(tor);
                const realUrl = downloadUrl || '';
                if (!realUrl) return;
                await downloadUsingBestStrategy(realUrl, detailsUrl);
                started++;
            } catch (e) { console.error('下载流程出错:', e); }
        }, Math.max(1, Number(concurrency)||3));

        if (started > 0) {
            showMessage(`✅ 已开始下载 ${started} 个torrent文件！`, 'success');
        } else {
            showMessage('❌ 未能解析到可下载的torrent链接', 'error');
        }
    }

    // ===== 一键辅种：核心入口 =====
    async function autoSeedSelectedTorrents() {
        console.log('开始一键辅种流程...');
        
        if (!currentSeedData || !currentSeedData.data) {
            console.error('没有可辅种的数据');
            showMessage('❌ 没有可辅种的数据！', 'error');
            return;
        }

        const torrents = collectSelectedTorrents();
        console.log('收集到选中的种子:', torrents.length, '个');
        if (torrents.length === 0) {
            // 如果用户只勾选了当前页面站点(sid=当前域名映射)但此站点在列表中被去重或过滤，兜底再尝试基于当前页面构造一条
            const checkedIds = Array.from(document.querySelectorAll('.iyuu-site-checkbox:checked')).map(cb => parseInt(cb.getAttribute('data-site-id')));
            const currentHost = location.hostname.replace(/^www\./,'');
            let currentSid = null;
            if (__iyuuSitesIndex) {
                const hit = Object.entries(__iyuuSitesIndex).find(([, si]) => si && String(si.base_url||'').replace(/^www\./,'') === currentHost);
                if (hit) currentSid = parseInt(hit[0]);
            }
            if (currentSid && checkedIds.includes(currentSid)) {
                const currentId = extractTorrentIdFromUrl(location.href);
                const currentHash = (__lastInfoHashList && __lastInfoHashList[0]) || __lastInfoHash || '';
                if (currentId) {
                    torrents.push({ sid: currentSid, torrent_id: currentId, info_hash: currentHash, source: 'current', url: location.href });
                }
            }
        if (torrents.length === 0) {
            console.error('没有选中任何站点');
            showMessage('❌ 请至少勾选一个站点！', 'error');
            return;
            }
        }

        const configs = GM_getValue('iyuu_current_downloader_configs', GM_getValue('iyuu_downloader_configs', [])) || [];
        const enabledConfigs = configs.filter(c => c && c.enabled !== false);
        console.log('可用的下载器配置:', enabledConfigs.length, '个');
        if (enabledConfigs.length === 0) {
            console.error('没有配置下载器');
            showMessage('❌ 未配置下载器，请先在"下载器设置"中添加并保存！', 'error');
            return;
        }

        console.log('开始选择下载器...');
        const chosen = await pickDownloader(enabledConfigs);
        if (!chosen) {
            console.error('用户取消了下载器选择');
            showMessage('❌ 未选择下载器', 'error');
            return;
        }
        console.log('选择的下载器:', chosen.name || chosen.id);

        console.log('开始验证下载器连通性...');
        const ok = await verifyDownloaderConnectivity(chosen);
        if (!ok) {
            console.error('下载器连通性验证失败');
            showMessage('❌ 所选下载器连通性失败，请检查设置', 'error');
            return;
        }
        console.log('下载器连通性验证成功');

        console.log('开始选择保存路径...');

        const savePath = await promptForSavePathWithPresets(chosen);
        if (!savePath) { 
            console.error('用户取消了路径选择');
            showMessage('❌ 未选择保存路径，已取消', 'error'); 
            return; 
        }
        console.log('选择的保存路径:', savePath);

        console.log('开始添加任务到下载器...');

        let success = 0; let failed = 0;
        const pushConcurrency = GM_getValue('iyuu_push_concurrency', 2);
        await runWithConcurrency(torrents, async (tor) => {
            try {
                const added = await addTorrentToDownloader(chosen, tor, savePath);
                if (added) success++; else failed++;
            } catch (e) { failed++; console.error('添加失败', e); }
        }, Math.max(1, Number(pushConcurrency)||2));

        console.log('任务添加完成，成功:', success, '失败:', failed);
        if (failed === 0) {
            showMessage(`✅ 已成功添加 ${success} 个任务到"${chosen.name || chosen.id}"`, 'success');
        } else {
            showMessage(`⚠️ 添加完成：成功 ${success}，失败 ${failed}`,'warning');
        }
    }

    function collectSelectedTorrents() {
        const list = [];
        try {
            Object.values(currentSeedData.data).forEach(item => {
                if (item && item.torrent && Array.isArray(item.torrent)) {
                    list.push(...item.torrent);
                }
            });
        } catch (_) {}
        const checked = Array.from(document.querySelectorAll('.iyuu-site-checkbox:checked')).map(cb => parseInt(cb.getAttribute('data-site-id')));
        if (checked.length === 0) return [];
        const filtered = list.filter(t => checked.includes(t.sid));
        // 确保“当前页面站点”不被遗漏：若存在 source==='current' 的条目，且未在 filtered 中，则追加
        try {
            const currentItem = list.find(t => t && t.source === 'current');
            if (currentItem) {
                const exists = filtered.some(t => t.sid === currentItem.sid && String(t.torrent_id) === String(currentItem.torrent_id));
                if (!exists) filtered.push(currentItem);
            }
        } catch (_) {}
        // 进一步兜底：若用户勾选了 data-source="current" 的复选框，但列表没有 currentItem，则基于当前页构造
        try {
            const currentCb = document.querySelector('.iyuu-site-checkbox[data-source="current"]');
            if (currentCb && currentCb.checked) {
                const currentSid = parseInt(currentCb.getAttribute('data-site-id'));
                const url = String(location.href || '');
                const idMatch = url.match(/[?&]id=(\d+)/) || url.match(/\/t\/(\d+)\//) || url.match(/\/details?\/(\d+)/);
                const currentTid = idMatch ? idMatch[1] : undefined;
                const currentHash = currentSeedData?.data?.[currentSeedData?.currentHash]?.info_hash || undefined;
                const already = filtered.some(t => t.sid === currentSid && String(t.torrent_id) === String(currentTid));
                if (currentSid && currentTid && !already) {
                    filtered.push({ sid: currentSid, torrent_id: Number(currentTid), info_hash: currentHash, source: 'current' });
                    console.log('DEBUG: 兜底追加当前站点条目', { sid: currentSid, torrent_id: Number(currentTid) });
                }
            }
        } catch (e) { console.warn('追加当前站点兜底失败', e); }
        return filtered;
    }

    function pickDownloader(configs) {
        return new Promise(resolve => {
            if (configs.length === 1) return resolve(configs[0]);
            const popup = document.getElementById('iyuu-popup');
            const container = document.createElement('div');
            container.style.cssText = 'position:fixed;left:50%;top:80px;transform:translateX(-50%);background:#fff;border:1px solid #ddd;border-radius:6px;box-shadow:0 6px 18px rgba(0,0,0,.2);z-index:10001;padding:16px;min-width:280px;';
            container.innerHTML = `
                <div style="font-weight:600;margin-bottom:10px;">选择下载器</div>
                <div style="display:flex;flex-direction:column;gap:8px;">
                    ${configs.map((c,i)=>`<button data-idx="${i}" style=\"padding:8px 12px;background:#007bff;color:#fff;border:none;border-radius:4px;cursor:pointer;\">${c.type || 'QB/TR'} - ${c.name || ('下载器'+c.id)}</button>`).join('')}
                </div>
                <div style="margin-top:10px;text-align:right;"><button id="iyuu-cancel-picker" style="padding:6px 10px;background:#6c757d;color:#fff;border:none;border-radius:4px;cursor:pointer;">取消</button></div>
            `;
            popup.appendChild(container);
            container.querySelectorAll('button[data-idx]').forEach(btn=>{
                btn.addEventListener('click',()=>{ const idx=parseInt(btn.getAttribute('data-idx')); container.remove(); resolve(configs[idx]); });
            });
            container.querySelector('#iyuu-cancel-picker').addEventListener('click',()=>{ container.remove(); resolve(null); });
        });
    }

    function promptForSavePath() {
        return new Promise(resolve => {
            const popup = document.getElementById('iyuu-popup');
            const box = document.createElement('div');
            box.style.cssText = 'position:fixed;left:50%;top:120px;transform:translateX(-50%);background:#fff;border:1px solid #ddd;border-radius:6px;box-shadow:0 6px 18px rgba(0,0,0,.2);z-index:10001;padding:16px;min-width:360px;';
            box.innerHTML = `
                <div style="font-weight:600;margin-bottom:8px;">请选择保存路径</div>
                <input type="text" id="iyuu-savepath-input" style="width:100%;padding:8px;border:1px solid #ccc;border-radius:4px;" placeholder="例如：/downloads/Movies"/>
                <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:10px;">
                    <button id="iyuu-savepath-cancel" style="padding:6px 10px;background:#6c757d;color:#fff;border:none;border-radius:4px;cursor:pointer;">取消</button>
                    <button id="iyuu-savepath-ok" style="padding:6px 10px;background:#28a745;color:#fff;border:none;border-radius:4px;cursor:pointer;">确定</button>
                </div>
            `;
            popup.appendChild(box);
            box.querySelector('#iyuu-savepath-cancel').addEventListener('click',()=>{ box.remove(); resolve(''); });
            box.querySelector('#iyuu-savepath-ok').addEventListener('click',()=>{ const v=box.querySelector('#iyuu-savepath-input').value.trim(); box.remove(); resolve(v); });
        });
    }

    function promptForSavePathWithPresets(config) {
        return new Promise(async resolve => {
            const popup = document.getElementById('iyuu-popup');
            const box = document.createElement('div');
            box.style.cssText = 'position:fixed;left:50%;top:120px;transform:translateX(-50%);background:#fff;border:1px solid #ddd;border-radius:6px;box-shadow:0 6px 18px rgba(0,0,0,.2);z-index:10001;padding:16px;min-width:420px;';
            // 读取此下载器的预置路径
            const allConfigs = GM_getValue('iyuu_current_downloader_configs', GM_getValue('iyuu_downloader_configs', [])) || [];
            const me = allConfigs.find(c => c.id === config.id) || config;
            const presets = Array.isArray(me.preset_paths) ? me.preset_paths : [];
            const options = presets.map(p => `<option value="${p}">${p}</option>`).join('');
            box.innerHTML = `
                <div style="font-weight:600;margin-bottom:8px;">请选择保存路径</div>
                <select id="iyuu-savepath-select" style="width:100%;padding:8px;border:1px solid #ccc;border-radius:4px;margin-bottom:8px;">
                    <option value="">从已导入路径中选择（可选）</option>
                    ${options}
                </select>
                <input type="text" id="iyuu-savepath-input" style="width:100%;padding:8px;border:1px solid #ccc;border-radius:4px;" placeholder="也可手动输入，例如：/downloads/Movies"/>
                <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:10px;">
                    <button id="iyuu-savepath-cancel" style="padding:6px 10px;background:#6c757d;color:#fff;border:none;border-radius:4px;cursor:pointer;">取消</button>
                    <button id="iyuu-savepath-ok" style="padding:6px 10px;background:#28a745;color:#fff;border:none;border-radius:4px;cursor:pointer;">确定</button>
                </div>
            `;
            popup.appendChild(box);
            const select = box.querySelector('#iyuu-savepath-select');
            const input = box.querySelector('#iyuu-savepath-input');
            select.addEventListener('change',()=>{ if (select.value) input.value = select.value; });
            box.querySelector('#iyuu-savepath-cancel').addEventListener('click',()=>{ box.remove(); resolve(''); });
            box.querySelector('#iyuu-savepath-ok').addEventListener('click',()=>{ const v=input.value.trim(); box.remove(); resolve(v); });
        });
    }

    // 让用户从现有任务中挑选并复用保存路径（用于不同站点info hash不同的情况）
    async function chooseExistingTaskPath(config) {
        try {
            let tasks = [];
            if (config.type === 'qBittorrent') {
                await qbEnsureLogin(config);
                const url = buildUrl(config.webui, '/api/v2/torrents/info');
                const resp = await gmRequest({ method: 'GET', url, headers: qbAuthHeaders(config) });
                tasks = Array.isArray(resp.json) ? resp.json.map(t => ({ name: t.name, savePath: t.save_path })) : [];
            } else if (config.type === 'Transmission') {
                const sessionId = await getTransmissionSessionId(config.webui, config.username, config.password);
                const payload = { method: 'torrent-get', arguments: { fields: ['name','downloadDir'] } };
                const res = await gmRequest({ method: 'POST', url: buildUrl(config.webui, '/transmission/rpc'), headers: trAuthHeaders(config, sessionId), data: JSON.stringify(payload) });
                const items = (res.json && res.json.arguments && res.json.arguments.torrents) || [];
                tasks = items.map(t => ({ name: t.name, savePath: t.downloadDir }));
            }
            if (!tasks || tasks.length === 0) return '';

            return await new Promise(resolve => {
                const popup = document.getElementById('iyuu-popup');
                const box = document.createElement('div');
                box.style.cssText = 'position:fixed;left:50%;top:140px;transform:translateX(-50%);background:#fff;border:1px solid #ddd;border-radius:6px;box-shadow:0 6px 18px rgba(0,0,0,.2);z-index:10001;padding:16px;min-width:420px;max-width:70vw;';
                const options = tasks.slice(0,200).map((t,i)=>`<option value="${i}">${(t.name||'未知任务').replace(/</g,'&lt;')}</option>`).join('');
                box.innerHTML = `
                    <div style="font-weight:600;margin-bottom:8px;">从已有任务选择保存路径（可选）</div>
                    <select id="iyuu-task-select" size="8" style="width:100%;padding:6px;border:1px solid #ccc;border-radius:4px;">${options}</select>
                    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:10px;">
                        <button id="iyuu-task-skip" style="padding:6px 10px;background:#6c757d;color:#fff;border:none;border-radius:4px;cursor:pointer;">跳过</button>
                        <button id="iyuu-task-use" style="padding:6px 10px;background:#17a2b8;color:#fff;border:none;border-radius:4px;cursor:pointer;">使用该路径</button>
                    </div>
                `;
                popup.appendChild(box);
                box.querySelector('#iyuu-task-skip').addEventListener('click',()=>{ box.remove(); resolve(''); });
                box.querySelector('#iyuu-task-use').addEventListener('click',()=>{ const idx=parseInt(box.querySelector('#iyuu-task-select').value); const path=tasks[idx]?.savePath||''; box.remove(); resolve(path); });
            });
        } catch (e) { console.warn('选择已有任务路径失败', e); return ''; }
    }

    // 标准化标题：去除站点前缀、统一空白和点号
    function normalizeTitle(title) {
        if (!title) return '';
        let t = String(title).trim();
        // 连续的 [XXXX] 或 (XXXX) 前缀去除
        t = t.replace(/^((\[[^\]]+\]|\([^\)]+\))\s*)+/g, '');
        // 将多个空白与点号统一
        t = t.replace(/[\u3000]/g, ' '); // 全角空格
        t = t.replace(/\s+/g, ' ');
        return t;
    }

    // 轻量 bencode 解析，仅解析 info.name 字段
    function parseTorrentNameFromBencode(arrayBuffer) {
        // 可靠解析 info.name，保留原始字节，先 UTF-8 再 GBK 回退，避免中文乱码
        try {
            const bytes = new Uint8Array(arrayBuffer);
            let offset = 0;

            function readChar() { return String.fromCharCode(bytes[offset]); }
            function readCharAt(i) { return String.fromCharCode(bytes[i]); }

            function readInteger() {
                offset++;
                let end = offset;
                while (readCharAt(end) !== 'e') end++;
                const numStr = new TextDecoder('utf-8').decode(bytes.subarray(offset, end));
                const num = parseInt(numStr, 10);
                offset = end + 1;
                return num;
            }

            function readBytes() {
                // <len>:<data>
                let end = offset;
                while (String.fromCharCode(bytes[end]) !== ':') end++;
                const lenStr = new TextDecoder('utf-8').decode(bytes.subarray(offset, end));
                const len = parseInt(lenStr, 10);
                offset = end + 1;
                const chunk = bytes.subarray(offset, offset + len);
                offset += len;
                return chunk;
            }

            // 解析，返回结构，不盲目解码字符串，只有在 name 时再解码
            function decode(path) {
                const ch = readChar();
                if (ch === 'd') {
                    offset++;
                    const obj = {};
                    while (readChar() !== 'e') {
                        const keyBytes = readBytes();
                        const key = new TextDecoder('utf-8').decode(keyBytes);
                        obj[key] = decode(path.concat(key));
                    }
                    offset++;
                    return obj;
                } else if (ch === 'l') {
                    offset++;
                    const arr = [];
                    while (readChar() !== 'e') arr.push(decode(path.concat('[]')));
                    offset++;
                    return arr;
                } else if (ch === 'i') {
                    return readInteger();
                } else if (ch >= '0' && ch <= '9') {
                    const data = readBytes();
                    // 只有当路径是 info -> name 时，保留字节以便多编码尝试
                    if (path.length >= 1 && path[path.length - 1] === 'info') {
                        // 返回特殊标记对象
                        return { __bytes: data };
                    }
                    // 普通键值按 UTF-8 解码
                    return new TextDecoder('utf-8').decode(data);
                }
                return '';
            }

            const root = decode([]);
            if (root && root.info) {
                const info = root.info;
                let nameField = info.name;
                if (nameField && nameField.__bytes) {
                    const utf8Name = new TextDecoder('utf-8', { fatal: false }).decode(nameField.__bytes);
                    if (utf8Name.includes('\uFFFD') || /�/.test(utf8Name)) {
                        try {
                            // GBK 回退
                            const gbkName = new TextDecoder('gbk').decode(nameField.__bytes);
                            return gbkName.trim();
                        } catch (_) {
                            return utf8Name.trim();
                        }
                    }
                    return utf8Name.trim();
                }
                if (typeof nameField === 'string') return nameField.trim();
            }
            return '';
        } catch (_) { return ''; }
    }

    function sanitizeFilename(name) {
        return (name || '').replace(/[\\/:*?"<>|]/g, '_');
    }

    async function verifyDownloaderConnectivity(config) {
        try {
            if (config.type === 'qBittorrent') {
                return await testQbittorrentConnectivity(config.webui, config.username, config.password);
            } else if (config.type === 'Transmission') {
                return await testTransmissionConnectivity(config.webui, config.username, config.password);
            }
            return false;
        } catch (_) { return false; }
    }

    async function findExistingSavePathByNames(config, names) {
        if (!names || names.length === 0) return '';
        const normalized = Array.from(new Set(names.map(normalizeTitle).filter(Boolean)));
        console.log('一键辅种-用于匹配的标准化候选名:', normalized);
        try {
            if (config.type === 'qBittorrent') {
                await qbEnsureLogin(config);
                let url = buildUrl(config.webui, '/api/v2/torrents/info?filter=all');
                let headers = qbAuthHeaders(config);
                headers['Accept'] = 'application/json';
                let resp = await gmRequest({ method: 'GET', url, headers, withCredentials: true });
                // 打印部分响应用于诊断
                if (!resp.json) {
                    console.warn('qB 列表响应非JSON，状态:', resp.status, '片段:', (resp.text||'').slice(0,120));
                }
                let list = Array.isArray(resp.json) ? resp.json : [];
                // 回退方案：若为空或非JSON，尝试 /api/v2/sync/maindata
                if (!Array.isArray(list) || list.length === 0) {
                    const syncUrl = buildUrl(config.webui, '/api/v2/sync/maindata');
                    const syncResp = await gmRequest({ method: 'GET', url: syncUrl, headers, withCredentials: true });
                    if (syncResp && syncResp.json && syncResp.json.torrents) {
                        const torrentsMap = syncResp.json.torrents; // { hash: { name, save_path, ... } }
                        list = Object.values(torrentsMap || {});
                        console.log('一键辅种-qB回退maindata任务数:', list.length);
                    }
                }
                // 继续回退：旧版接口 /query/torrents
                if (!Array.isArray(list) || list.length === 0) {
                    const legacyUrl = buildUrl(config.webui, '/query/torrents');
                    const legacyResp = await gmRequest({ method: 'GET', url: legacyUrl, headers, withCredentials: true });
                    if (Array.isArray(legacyResp.json)) {
                        list = legacyResp.json;
                        console.log('一键辅种-qB回退query/torrents任务数:', list.length);
                    } else {
                        console.warn('qB 旧接口返回非JSON或为空，状态:', legacyResp.status, '片段:', (legacyResp.text||'').slice(0,120));
                    }
                }
                console.log('一键辅种-qB任务数:', list.length);
                for (const t of list) {
                    const n = normalizeTitle(t.name||'');
                    const hit = normalized.includes(n);
                    console.log('一键辅种-qB任务名:', t.name, '=> 标准化:', n, '命中:', hit);
                }
                for (const n of normalized) {
                    const found = list.find(t => normalizeTitle(t.name||'') === n);
                    if (found) {
                        const pathCandidate = found.save_path || found.content_path || found.root_path || '';
                        if (pathCandidate) return pathCandidate;
                    }
                }
            } else if (config.type === 'Transmission') {
                const sessionId = await getTransmissionSessionId(config.webui, config.username, config.password);
                const payload = { method: 'torrent-get', arguments: { fields: ['name','downloadDir'] } };
                const res = await gmRequest({ method: 'POST', url: buildUrl(config.webui, '/transmission/rpc'), headers: trAuthHeaders(config, sessionId), data: JSON.stringify(payload) });
                const items = (res.json && res.json.arguments && res.json.arguments.torrents) || [];
                console.log('一键辅种-TR任务数:', items.length);
                for (const t of items) {
                    const n = normalizeTitle(t.name||'');
                    const hit = normalized.includes(n);
                    console.log('一键辅种-TR任务名:', t.name, '=> 标准化:', n, '命中:', hit);
                }
                for (const n of normalized) {
                    const found = items.find(t => normalizeTitle(t.name||'') === n);
                    if (found) {
                        const pathCandidate = found.downloadDir || found.location || '';
                        if (pathCandidate) return pathCandidate;
                    }
                }
            }
        } catch (e) { console.warn('查询保存路径异常', e); }
        return '';
    }

    async function addTorrentToDownloader(config, torrent, savePath) {
        // 先解析出站点详情页、真实下载链接，并下载二进制
        const { detailsUrl, downloadUrl } = await resolveTorrentUrls(torrent);
        if (!downloadUrl) throw new Error('无法解析下载链接');
        const bin = await downloadTorrentBinary(downloadUrl, detailsUrl);

        if (config.type === 'qBittorrent') {
            // 以文件方式上传
            await qbEnsureLogin(config);
            const form = new FormData();
            const file = new Blob([bin], { type: 'application/x-bittorrent' });
            form.append('torrents', file, `reseed_${torrent.sid}_${torrent.torrent_id || 'file'}.torrent`);
            if (savePath) form.append('savepath', savePath);
            // 跳过校验：qB参数 skip_checking= true/false
            try {
                const skip = !!GM_getValue('iyuu_skip_verify', false);
                if (skip) form.append('skip_checking', 'true');
            } catch(_) {}
            const url = buildUrl(config.webui, '/api/v2/torrents/add');
            const resp = await gmRequest({ method: 'POST', url, headers: qbAuthHeaders(config), data: form, withCredentials: true });
            return resp && (resp.status === 200 || resp.status === 204);
        } else if (config.type === 'Transmission') {
            // base64 方式添加
            const b64 = arrayBufferToBase64(bin);
            const sessionId = await getTransmissionSessionId(config.webui, config.username, config.password);
            const args = { metainfo: b64, 'download-dir': savePath || undefined };
    
            const payload = { method: 'torrent-add', arguments: args };
            const res = await gmRequest({ method: 'POST', url: buildUrl(config.webui, '/transmission/rpc'), headers: trAuthHeaders(config, sessionId), data: JSON.stringify(payload) });
            return (res && res.json && res.json.result === 'success');
        }
        return false;
    }

    function gmRequest({ method, url, headers = {}, data, withCredentials = true }) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method, url, headers,
                data,
                withCredentials,
                onload: function(r){
                    let json = null; try { json = JSON.parse(r.responseText); } catch(_) {}
                    resolve({ status: r.status, text: r.responseText, json, headers: r.responseHeaders });
                },
                onerror: function(e){ reject(e); }
            });
        });
    }

    function qbAuthHeaders(config) {
        const headers = {};
        // 优先使用登录产生的 SID Cookie（qB WebUI 依赖 Cookie 会话）
        if (config.__qb_sid_cookie) headers['Cookie'] = config.__qb_sid_cookie;
        // 兼容某些反代环境：携带 Referer
        if (config.webui) headers['Referer'] = typeof config.webui === 'string' ? config.webui : '';
        try { const u = new URL(config.webui); headers['Origin'] = u.origin; } catch(_) {}
        headers['X-Requested-With'] = 'XMLHttpRequest';
        return headers;
    }

    async function qbEnsureLogin(config) {
        if (!config || !config.webui) return;
        try {
            if (config.username && config.password) {
                const loginUrl = buildUrl(config.webui, '/api/v2/auth/login');
                const form = new URLSearchParams();
                form.set('username', config.username);
                form.set('password', config.password);
                const r = await gmRequest({ method: 'POST', url: loginUrl, headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, data: form.toString(), withCredentials: true });
                console.log('qB 登录响应:', r.status, r.text);
                // 提取 SID 设置显式 Cookie 以兼容部分环境不共享 Cookie 的情况
                try {
                    const raw = r.headers || '';
                    const m = raw.match(/set-cookie:\s*([^;\n]+)/i);
                    if (m && m[1] && /SID=/.test(m[1])) {
                        config.__qb_sid_cookie = m[1];
                        console.log('qB 登录提取到SID Cookie:', config.__qb_sid_cookie);
                    }
                } catch(_) {}
                // 追加一次版本校验，确认会话已建立
                const ver = await gmRequest({ method: 'GET', url: buildUrl(config.webui, '/api/v2/app/version'), headers: qbAuthHeaders(config), withCredentials: true });
                console.log('qB 版本校验:', ver.status, ver.text || ver.json);
            }
        } catch (e) {
            console.warn('qB登录失败(可能已登录):', e.message || e);
        }
    }

    async function getTransmissionSessionId(base, username, password) {
        const first = await gmRequest({ method: 'POST', url: buildUrl(base, '/transmission/rpc'), headers: trAuthHeaders({ username, password }, null), data: JSON.stringify({ method: 'session-get' }) });
        // 优先从响应头读取 X-Transmission-Session-Id
        let sid = '';
        const raw = first && first.headers ? String(first.headers) : '';
        const m = raw.match(/x-transmission-session-id:\s*([^\r\n]+)/i);
        if (m && m[1]) sid = m[1].trim();
        if (!sid) {
            // 某些实现会在 body 中写入（极少见），保持兜底
            sid = (first && first.json && first.json['X-Transmission-Session-Id']) || '';
        }
        return sid;
    }

    function trAuthHeaders(config, sessionId) {
        const headers = { 'Content-Type': 'application/json' };
        if (sessionId) headers['X-Transmission-Session-Id'] = sessionId;
        if (config.username || config.password) {
            headers['Authorization'] = 'Basic ' + btoa((config.username||'') + ':' + (config.password||''));
        }
        return headers;
    }

    // —— 将导入/清空路径函数移动到此处，确保可访问 qbEnsureLogin/showMessage 等 ——
    async function importDownloaderPaths(configId) {
        try {
            const all = GM_getValue('iyuu_current_downloader_configs', GM_getValue('iyuu_downloader_configs', [])) || [];
            const cfg = all.find(c => c.id === configId);
            if (!cfg) { showMessage('未找到下载器配置', 'error'); return; }
            const type = cfg.type;

            let paths = [];
            if (type === 'qBittorrent') {
                await qbEnsureLogin(cfg);
                const headers = qbAuthHeaders(cfg); headers['Accept'] = 'application/json';
                const safeParse = (raw) => {
                    if (!raw) return undefined;
                    try { return JSON.parse(raw); } catch(_) { return undefined; }
                };
                let list = [];
                try {
                    const r = await gmRequest({ method: 'GET', url: buildUrl(cfg.webui, '/api/v2/torrents/info?filter=all'), headers, withCredentials: true });
                    let data = Array.isArray(r.json) ? r.json : safeParse(r.text);
                    if (!Array.isArray(data)) {
                        console.warn('导入路径-qB info 非JSON/空 响应:', r.status, (r.text||'').slice(0,120));
                        data = [];
                    }
                    list = data;
                } catch(e) { console.warn('导入路径-qB info 调用异常', e); }
                if (!list || list.length===0) { try { const r = await gmRequest({ method:'GET', url: buildUrl(cfg.webui,'/api/v2/sync/maindata'), headers, withCredentials:true}); const mj = r&&r.json ? r.json : safeParse(r?.text); if (mj&&mj.torrents) list = Object.values(mj.torrents); else console.warn('导入路径-qB maindata 非JSON/空 响应:', r?.status, String(r?.text||'').slice(0,120)); } catch(e) { console.warn('导入路径-qB maindata 调用异常', e); } }
                if (!list || list.length===0) {
                    try {
                        const r = await gmRequest({ method:'GET', url: buildUrl(cfg.webui,'/query/torrents'), headers, withCredentials:true});
                        let data = Array.isArray(r.json) ? r.json : safeParse(r.text);
                        if (!Array.isArray(data)) {
                            console.warn('导入路径-qB 旧接口 非JSON/空 响应:', r.status, (r.text||'').slice(0,120));
                            data = [];
                        }
                        list = data;
                    } catch(e) { console.warn('导入路径-qB 旧接口 调用异常', e); }
                }
                paths = Array.from(new Set((list||[]).map(t=> t.save_path || t.content_path || t.root_path).filter(Boolean)));
                // 继续回退：偏好设置与分类保存路径
                if (paths.length === 0) {
                    try {
                        const pref = await gmRequest({ method: 'GET', url: buildUrl(cfg.webui, '/api/v2/app/preferences'), headers, withCredentials: true });
                        const pj = pref?.json || safeParse(pref?.text);
                        if (pj) {
                            const p = pj.save_path || pj['save_path'] || pj['save-path'];
                            if (p) paths.push(p);
                        } else {
                            console.warn('导入路径-qB preferences 非JSON/空 响应:', pref?.status, String(pref?.text||'').slice(0,120));
                        }
                    } catch(e) { console.warn('导入路径-qB preferences 调用异常', e); }
                }
                if (paths.length === 0) {
                    try {
                        const cats = await gmRequest({ method: 'GET', url: buildUrl(cfg.webui, '/api/v2/torrents/categories'), headers, withCredentials: true });
                        const cj = cats?.json || safeParse(cats?.text);
                        if (cj) {
                            const catList = Object.values(cj || {}).map((c)=> (c && c['savePath']) || '').filter(Boolean);
                            if (catList.length) paths.push(...catList);
                        } else {
                            console.warn('导入路径-qB categories 非JSON/空 响应:', cats?.status, String(cats?.text||'').slice(0,120));
                        }
                    } catch(e) { console.warn('导入路径-qB categories 调用异常', e); }
                }
                // 兜底1：分类逐批拉取 torrents/info 以提取各任务路径
                if (paths.length === 0) {
                    try {
                        const cats = await gmRequest({ method: 'GET', url: buildUrl(cfg.webui, '/api/v2/torrents/categories'), headers, withCredentials: true });
                        const cj = cats?.json || safeParse(cats?.text) || {};
                        const categoryNames = Object.keys(cj);
                        let catPaths = new Set(paths);
                        for (const name of categoryNames) {
                            try {
                                const url = buildUrl(cfg.webui, '/api/v2/torrents/info') + `?category=${encodeURIComponent(name)}`;
                                const r = await gmRequest({ method: 'GET', url, headers, withCredentials: true });
                                const arr = Array.isArray(r.json) ? r.json : safeParse(r.text) || [];
                                for (const t of arr) {
                                    const p = t.save_path || t.content_path || t.root_path;
                                    if (p) catPaths.add(p);
                                }
                            } catch(e) { /* 忽略单分类异常，继续 */ }
                        }
                        paths = Array.from(catPaths);
                    } catch(e) { console.warn('导入路径-qB 分类分批兜底异常', e); }
                }
                // 兜底2：按哈希逐个 properties 回补保存路径（对列表拿不到字段的情况）
                if (paths.length === 0 && list && list.length) {
                    try {
                        const uniqHashes = Array.from(new Set(list.map(t => t.hash).filter(Boolean)));
                        const acc = new Set(paths);
                        for (const h of uniqHashes) {
                            try {
                                const pr = await gmRequest({ method:'GET', url: buildUrl(cfg.webui, '/api/v2/torrents/properties') + `?hash=${encodeURIComponent(h)}`, headers, withCredentials:true });
                                const pj = pr?.json || safeParse(pr?.text);
                                const p = pj && (pj.save_path || pj.content_path || pj.root_path);
                                if (p) acc.add(p);
                            } catch(_) { /* 单个失败忽略 */ }
                        }
                        paths = Array.from(acc);
                    } catch(e) { console.warn('导入路径-qB properties 兜底异常', e); }
                }
            } else if (type === 'Transmission') {
                try {
                    const sid = await getTransmissionSessionId(cfg.webui, cfg.username, cfg.password);
                    const payload = { method:'torrent-get', arguments:{ fields:['downloadDir','name','location'] } };
                    const r = await gmRequest({ method:'POST', url: buildUrl(cfg.webui,'/transmission/rpc'), headers: trAuthHeaders(cfg, sid), data: JSON.stringify(payload) });
                    const items = (r.json && r.json.arguments && r.json.arguments.torrents) || [];
                    paths = Array.from(new Set(items.map(t=> t.downloadDir || t.location).filter(Boolean)));
                } catch(e) { console.warn('导入路径-TR rpc 调用异常', e); }
            }

            const form = document.querySelector(`.downloader-form[data-form-id="${configId}"]`);
            const container = form && form.querySelector('.preset-paths');
            if (container) {
                container.innerHTML = (paths.length ? paths : ['暂无']).map(p => typeof p==='string' ? `<span style='background:#f1f3f5;border:1px solid #dee2e6;border-radius:4px;padding:4px 6px;font-size:12px;'>${p}</span>` : `<span style="color:#888;">暂无</span>`).join('');
            }
            const updated = (all||[]).map(c => c.id===configId ? { ...c, preset_paths: paths } : c);
            GM_setValue('iyuu_current_downloader_configs', updated);
            if (paths.length > 0) {
                showMessage(`已导入 ${paths.length} 条保存路径`, 'success');
            } else {
                showMessage('未获取到任何下载路径，请检查下载器是否有任务/保存路径字段/反代兼容', 'warning');
            }
        } catch(e) {
            console.warn('导入下载路径失败', e);
            showMessage('导入保存路径失败', 'error');
        }
    }

    async function clearDownloaderPaths(configId) {
        const all = GM_getValue('iyuu_current_downloader_configs', GM_getValue('iyuu_downloader_configs', [])) || [];
        const updated = (all||[]).map(c => c.id===configId ? { ...c, preset_paths: [] } : c);
        GM_setValue('iyuu_current_downloader_configs', updated);
        const form = document.querySelector(`.downloader-form[data-form-id="${configId}"]`);
        const container = form && form.querySelector('.preset-paths');
        if (container) container.innerHTML = '<span style="color:#888;">暂无</span>';
        showMessage('已清空保存路径', 'success');
    }
    
    // 同域优先使用fetch(credentials:include)后台下载 → 其次GM_download → 兜底window.open
    async function downloadUsingBestStrategy(url, referer) {
        try {
            const u = new URL(url, window.location.href);
            // 若已缓存站点passkey且链接未带passkey，则补全passkey以便后台下载
            const passkeyMap = GM_getValue('iyuu_passkey_map', {});
            const host = u.host;
            const hasPasskey = /[?&]passkey=/i.test(u.search);
            if (!hasPasskey && passkeyMap[host]) {
                if (u.search) u.search += `&passkey=${passkeyMap[host]}`; else u.search = `?passkey=${passkeyMap[host]}`;
            }
            // 1) 优先使用 GM_xmlhttpRequest arraybuffer 后台保存（跨域可带 Cookie）
            try {
                const res = await fetchArrayBufferWithGM(u.toString(), referer || (u.origin + '/'));
                if (res && res.buffer && res.buffer.byteLength > 0) {
                    const finalName = buildPrefixedFilename(u.toString(), res.headers, 'download.torrent', res.buffer);
                    saveBlob(new Blob([res.buffer], { type: 'application/x-bittorrent' }), finalName);
                    return;
                }
            } catch (_) { /* fallback */ }
            if (u.origin === window.location.origin) {
                const resp = await fetch(u.toString(), { credentials: 'include' });
                const blob = await resp.blob();
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = (u.pathname.split('/').pop() || 'download.torrent');
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
                return;
            } else {
                // 跨域：用隐藏iframe触发下载，避免新开标签
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.referrerPolicy = 'no-referrer-when-downgrade';
                iframe.src = u.toString();
                document.body.appendChild(iframe);
                setTimeout(() => iframe.remove(), 5000);
                return;
            }
        } catch (_) { /* ignore and fallback */ }
        try {
            await new Promise((resolve, reject) => {
                const name = buildPrefixedFilename(url, '', 'download.torrent');
                GM_download({ url, name, headers: referer ? { Referer: referer } : {}, onload: resolve, onerror: reject });
            });
            return;
        } catch (_) { /* ignore */ }
        try { window.open(url, '_blank'); } catch (_) {}
    }

    function inferFilenameFromUrl(u) {
        try { const p = new URL(u).pathname; const n = p.substring(p.lastIndexOf('/')+1); return n || ''; } catch(_) { return ''; }
    }

    function saveBlob(blob, filename) {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename || 'download.torrent';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
    }

    function fetchArrayBufferWithGM(url, referer) {
        console.log('[fetchArrayBufferWithGM] GET', { url, referer });
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET', url, responseType: 'arraybuffer', anonymous: false,
                headers: Object.assign({ 'Accept': 'application/x-bittorrent,application/octet-stream,*/*;q=0.8' }, referer ? { Referer: referer, Origin: (referer || '').replace(/^(https?:\/\/[^\/]+).*$/, '$1') } : {}),
                onload: function(r){ console.log('[fetchArrayBufferWithGM] 状态', r && r.status, '响应头片段', String(r && r.responseHeaders || '').slice(0,160)); resolve({ buffer: r.response, headers: r.responseHeaders || '' }); },
                onerror: function(e){ console.warn('[fetchArrayBufferWithGM] 异常', e); reject(e); }
            });
        });
    }

    function getFilenameFromHeaders(headers, fallback) {
        try {
            const m = /content-disposition[^;]*;\s*filename\*=UTF-8''([^;\r\n]+)|content-disposition[^;]*;\s*filename="?([^";\r\n]+)"?/i.exec(headers || '');
            const fn = decodeURIComponent(m?.[1] || m?.[2] || '');
            if (fn) return fn;
        } catch(_) {}
        return fallback || 'download.torrent';
    }

    // 根据主机名反查中文昵称（若能命中则用于命名前缀）
    function getSiteNicknameByHost(host) {
        try {
            if (!host) return '';
            const idx = __iyuuSitesIndex || GM_getValue('iyuu_sites_index') || {};
            const hit = Object.values(idx).find(si => si && String(si.base_url || '').replace(/^www\./,'') === String(host).replace(/^www\./,''));
            return (hit && hit.nickname) ? hit.nickname : '';
        } catch(_) { return ''; }
    }

    function buildPrefixedFilename(url, headers, fallbackName, buffer) {
        try {
            const u = new URL(url, window.location.href);
            // 先尽量用bencode里的name
            let baseName = undefined;
            if (buffer) {
                try { baseName = parseTorrentNameFromBencode(buffer); } catch(_) {}
            }
            if (baseName) baseName = sanitizeFilename(baseName);
            const fallback = getFilenameFromHeaders(headers, inferFilenameFromUrl(u.toString())) || fallbackName || 'download.torrent';
            let finalName = (baseName ? baseName + '.torrent' : fallback);
            // 前缀：优先中文昵称，其次host
            const host = (u.hostname || '').replace(/^www\./, '');
            const nickname = getSiteNicknameByHost(host);
            const prefix = nickname || host;
            if (prefix) {
                finalName = `[${prefix}].` + finalName;
            }
            return finalName;
        } catch(_) {
            return fallbackName || 'download.torrent';
        }
    }

    // ====== 解析下载链接与下载二进制 ======
    async function resolveTorrentUrls(torrent) {
        let detailsUrl = '';
        let downloadUrl = '';
        let passkey = '';
        const site = (__iyuuSitesIndex && __iyuuSitesIndex[torrent.sid]) || (GM_getValue('iyuu_sites_index')||{})[torrent.sid];
        if (site) {
            // details_page 模板如: details.php?id={}
            let base = site.base_url.startsWith('http') ? site.base_url : ('https://' + site.base_url);
            // 特例：馒头统一使用 kp.m-team.cc 作为详情与下载域名
            let isMTeamSite = false;
            // 特例：TTG 需要从详情页解析 /dl/{id}/ 链接
            let isTTGSite = false;
            // 特例：观众（audiences）需要从详情页解析带 downhash 的真实链接
            let isAudiencesSite = false;
            // 特例：天空（hdsky）需要从详情页解析带 sign 的真实链接
            let isHdskySite = false;
            try {
                const isMTeam = (String(site.site||'').toLowerCase()==='m-team') || (String(site.nickname||'').includes('馒头')) || (parseInt(torrent.sid)===3);
                if (isMTeam) {
                    isMTeamSite = true;
                    base = 'https://kp.m-team.cc';
                }
                const isTTG = (String(site.site||'').toLowerCase()==='ttg') || /totheglory\.im$/i.test(String(site.base_url||'')) || (String(site.nickname||'').includes('听听歌'));
                if (isTTG) {
                    isTTGSite = true;
                    base = base.replace(/\/$/,'');
                }
                const isAud = (String(site.site||'').toLowerCase()==='audiences') || /audiences\.me$/i.test(String(site.base_url||'')) || (String(site.nickname||'').includes('观众'));
                if (isAud) {
                    isAudiencesSite = true;
                }
                const isHdsky = (String(site.site||'').toLowerCase()==='hdsky') || /hdsky\.me$/i.test(String(site.base_url||'')) || (String(site.nickname||'').includes('天空'));
                if (isHdsky) {
                    isHdskySite = true;
                    base = base.replace(/\/$/,'');
                }
            } catch(_) {}
            if (site.details_page && torrent.torrent_id) {
                const tpl = site.details_page.replace('{}', encodeURIComponent(String(torrent.torrent_id)));
                // 馒头详情页规范化为 /detail/{id}
                if (isMTeamSite) {
                    detailsUrl = base.replace(/\/$/,'') + '/detail/' + encodeURIComponent(String(torrent.torrent_id));
                } else {
                detailsUrl = base.replace(/\/$/,'') + '/' + tpl.replace(/^\//,'');
                }
            }

            if (site.download_page && torrent.torrent_id) {
                let tpl = site.download_page.replace('{}', encodeURIComponent(String(torrent.torrent_id)));
                tpl = tpl.replace(/\{passkey\}/g, '');
                tpl = tpl.replace(/([?&])passkey=[^&]*&?/i, '$1');
                tpl = tpl.replace(/[?&]$/,'');
                // 馒头优先使用 API 生成真实可下载链接
                if (isMTeamSite) {
                    console.log('[馒头] 解析下载链接: 准备调用 genDlToken', { sid: torrent.sid, id: torrent.torrent_id, detailsUrl });
                    try {
                        const apiBase = 'https://api.m-team.cc';
                        const token = GM_getValue('mteam_dl_token','');
                        // 参考仓库：POST + x-api-key + multipart/form-data
                        console.log('[馒头] 入队 genDlToken (POST x-api-key)', { hasToken: !!token });
                        const form = new FormData();
                        form.append('id', String(torrent.torrent_id));
                        let g = await runMTeamQueued(() => gmRequest({ method: 'POST', url: `${apiBase}/api/torrent/genDlToken`, headers: { 'Referer': detailsUrl || base, 'Accept': 'application/json, text/plain, */*', 'Origin': 'https://kp.m-team.cc', 'x-api-key': token || '' }, data: form }));
                        console.log('[馒头] genDlToken 响应', { status: g?.status, textHead: String(g?.text||'').slice(0,160) });
                        const j = g?.json || (g?.text ? JSON.parse(g.text) : null);
                        if (j && j.data) {
                            const candidate = (typeof j.data === 'string') ? j.data : (j.data.url || j.data.link || '');
                            if (candidate) {
                                downloadUrl = candidate;
                                console.log('[馒头] genDlToken 提供直链', String(downloadUrl).slice(0,120));
                            }
                        }
                    } catch(e) { console.warn('[馒头] genDlToken 异常', e); }
                    if (!downloadUrl) {
                        // 回退：kp.m-team.cc/download.php?id=，依赖已有登录 Cookie
                        downloadUrl = base.replace(/\/$/,'') + '/download.php?id=' + encodeURIComponent(String(torrent.torrent_id));
                        console.log('[馒头] 回退 download.php', downloadUrl);
                    }
                } else if (!isTTGSite && !isAudiencesSite) {
                // 常规站点可直接使用模板链接；观众站点需从详情页解析带 downhash 的直链
                downloadUrl = base.replace(/\/$/,'') + '/' + tpl.replace(/^\//,'');
                }
            }

            if (!downloadUrl && torrent.torrent_id) {
                downloadUrl = base.replace(/\/$/,'') + '/download.php?id=' + encodeURIComponent(String(torrent.torrent_id));
            }
        }


        // TTG：总是从详情页解析 /dl/{id}/
        try {
            const host = (new URL(detailsUrl || '', window.location.href)).host;
            if (/totheglory\.im$/i.test(host)) {
        if (detailsUrl) {
                    console.log('[解析详情页][TTG] GET', detailsUrl);
                    // 使用TTG串行队列，避免触发频率限制
                    const htmlResp = await runTTGQueued(() => gmRequest({ method: 'GET', url: detailsUrl, headers: { Referer: detailsUrl } }));
                    const html = String(htmlResp?.text || '');
                    // 匹配 a[href^="/dl/"]
                    const m2 = html.match(/href=\"(\/dl\/[^\"]+)\"/i);
                    if (m2 && m2[1]) {
                        const abs = detailsUrl.replace(/^(https?:\/\/[^\/]+).*$/, '$1') + m2[1];
                        downloadUrl = abs;
                        console.log('[TTG] 解析到直链', downloadUrl);
                    }
                }
            }
            // 观众：从详情页解析 download.php?id=...&downhash=... 直链
            if (/audiences\.me$/i.test(host)) {
                if (detailsUrl) {
                    console.log('[解析详情页][观众] GET', detailsUrl);
                    const htmlResp = await gmRequest({ method: 'GET', url: detailsUrl, headers: { Referer: detailsUrl } });
                    const html = String(htmlResp?.text || '');
                    // 尝试多种匹配模式来找到包含 downhash 的下载链接
                    let mAud = html.match(/href=\"([^\"]*download\.php[^\"]*downhash=[^\"&\s]+[^\"]*)\"/i);
                    if (!mAud) {
                        // 如果第一种模式没匹配到，尝试更宽松的匹配
                        mAud = html.match(/href=\"([^\"]*download\.php[^\"]*downhash=[^\"]*)\"/i);
                    }
                    if (!mAud) {
                        // 如果还是没匹配到，尝试匹配任何包含 download.php 和 downhash 的链接
                        mAud = html.match(/href=\"([^\"]*download\.php[^\"]*downhash[^\"]*)\"/i);
                    }
                    if (mAud && mAud[1]) {
                        const abs = mAud[1].startsWith('http') ? mAud[1] : detailsUrl.replace(/^(https?:\/\/[^\/]+).*$/, '$1') + (mAud[1].startsWith('/') ? mAud[1] : '/' + mAud[1]);
                        downloadUrl = abs;
                        console.log('[观众] 解析到直链', downloadUrl);
                    } else {
                        console.log('[观众] 未能解析到包含 downhash 的下载链接');
                    }
                }
            }
            // 天空：从详情页解析 download.php?id=...&sign=... 直链
            if (/hdsky\.me$/i.test(host)) {
                if (detailsUrl) {
                    console.log('[解析详情页][天空] GET', detailsUrl);
                    const htmlResp = await gmRequest({ method: 'GET', url: detailsUrl, headers: { Referer: detailsUrl } });
                    const html = String(htmlResp?.text || '');
                    // 尝试多种匹配模式来找到包含 sign 的下载链接
                    let mHdsky = html.match(/href=\"([^\"]*download\.php[^\"]*sign=[^\"&\s]+[^\"]*)\"/i);
                    if (!mHdsky) {
                        // 如果第一种模式没匹配到，尝试更宽松的匹配
                        mHdsky = html.match(/href=\"([^\"]*download\.php[^\"]*sign=[^\"]*)\"/i);
                    }
                    if (!mHdsky) {
                        // 如果还是没匹配到，尝试匹配任何包含 download.php 和 sign 的链接
                        mHdsky = html.match(/href=\"([^\"]*download\.php[^\"]*sign[^\"]*)\"/i);
                    }
                    if (mHdsky && mHdsky[1]) {
                        const abs = mHdsky[1].startsWith('http') ? mHdsky[1] : detailsUrl.replace(/^(https?:\/\/[^\/]+).*$/, '$1') + (mHdsky[1].startsWith('/') ? mHdsky[1] : '/' + mHdsky[1]);
                        downloadUrl = abs;
                        console.log('[天空] 解析到直链', downloadUrl);
                    } else {
                        console.log('[天空] 未能解析到包含 sign 的下载链接');
                    }
                }
            }
        } catch(_) {}

        // 如果已得到下载链接，则不强制再抓详情页，避免无谓失败（例如跨域/频率限制）
        if (detailsUrl && !downloadUrl) {
            try {
                console.log('[解析详情页] GET', detailsUrl);
                const htmlResp = await gmRequest({ method: 'GET', url: detailsUrl, headers: { Referer: detailsUrl } });
                console.log('[解析详情页] 状态', htmlResp?.status, '文本片段', String(htmlResp?.text||'').slice(0,160));
                const m = htmlResp.text && htmlResp.text.match(/href=\"([^\"]*download\.php[^\"]*)\"/i);
                if (m && m[1]) {
                    const abs = m[1].startsWith('http') ? m[1] : detailsUrl.replace(/\/details\.php[\s\S]*/, '/') + m[1].replace(/^\//,'');

                    const pk = abs.match(/[?&]passkey=([A-Za-z0-9]+)/i);
                    if (pk && pk[1]) {
                        try {
                            const urlObj = new URL(abs, window.location.href);
                            const map = GM_getValue('iyuu_passkey_map', {});
                            map[urlObj.host] = pk[1];
                            GM_setValue('iyuu_passkey_map', map);
                            passkey = pk[1];
                        } catch(_) {}
                    }
                    // 绝大多数站点可去掉 passkey 依赖 Cookie；但对馒头保留原链接（不要移除passkey）
                    if (/\/\/kp\.m-team\.cc\//i.test(abs)) {
                        downloadUrl = abs;
                        console.log('[馒头] 保留含 passkey 的直链', downloadUrl);
                    } else {
                    downloadUrl = abs.replace(/([?&])passkey=[^&]*&?/i, '$1').replace(/[?&]$/,'');
                        console.log('[常规站] 去除 passkey 后直链', downloadUrl);
                    }
                }
            } catch (e) { console.warn('解析详情页失败', e); }
        }

        return { detailsUrl, downloadUrl, passkey };
    }

    
     
     async function downloadTorrentBinary(url, referer) {
         console.log('[下载二进制] 开始', { url, referer });
         const extraHeaders = (() => {
             try {
                 const u = new URL(url, window.location.href);
                 const host = u.host;
             } catch(_) {}
             return {};
})();
         const doOnce = () => new Promise((resolve, reject) => {
             GM_xmlhttpRequest({
                 method: 'GET', url,
                 headers: Object.assign({}, referer ? { Referer: referer, Origin: (referer || '').replace(/^(https?:\/\/[^\/]+).*$/, '$1') } : {}, { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/x-bittorrent,application/octet-stream,*/*;q=0.8' }, extraHeaders),
                 responseType: 'arraybuffer', withCredentials: true,
                 onload: function(r){
                     if (r && (r.status===200 || r.status===206)) {
                         console.log('[下载二进制] 完成', { status: r.status, size: (r.response && r.response.byteLength) || 0 });
                         resolve(r.response);
                     } else {
                         console.warn('[下载二进制] 失败', r && r.status, String(r && r.responseText || '').slice(0,160));
                         reject(new Error(String(r && r.status || '0')));
                     }
                 },
                 onerror: function(e){ console.warn('[下载二进制] 异常', e); reject(e); }
             });
         });
         try {
             return await doOnce();
         } catch (e) {
             // TTG 403 限频：延迟重试一次
             try {
                 if (/403/.test(String(e))) {
                     await sleep(1200);
                     return await doOnce();
                 }
             } catch(_) {}
             throw e;
         }
     }

    function arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) { binary += String.fromCharCode(bytes[i]); }
        return btoa(binary);
    }

    // ====== 通用工具：延迟与馒头串行队列 ======
    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
    let __mteamQueue = Promise.resolve();
    async function runMTeamQueued(task) {
        const doTask = async () => {
            try { return await task(); } finally { await sleep(350); }
        };
        const job = __mteamQueue.then(doTask, doTask);
        // 确保队列串行推进
        __mteamQueue = job.then(() => {}, () => {}).then(() => sleep(0));
        return job;
    }
    // TTG 串行队列（详情页解析、下载直链）
    let __ttgQueue = Promise.resolve();
    async function runTTGQueued(task) {
        const doTask = async () => {
            try { return await task(); } finally { await sleep(500); }
        };
        const job = __ttgQueue.then(doTask, doTask);
        __ttgQueue = job.then(() => {}, () => {}).then(() => sleep(0));
        return job;
    }

    // 显示提示消息
    function showMessage(message, type = 'info') {
        const popup = document.getElementById('iyuu-popup');
        if (!popup) return;

        // 移除现有的提示消息
        const existingMessage = popup.querySelector('.iyuu-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // 创建新的提示消息
        const messageDiv = document.createElement('div');
        messageDiv.className = 'iyuu-message';
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : '#2196f3'};
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            transition: opacity 0.3s ease;
        `;
        messageDiv.textContent = message;

        popup.appendChild(messageDiv);

        // 3秒后自动消失
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.opacity = '0';
                setTimeout(() => messageDiv.remove(), 300);
            }
        }, 3000);
    }

    // 保存下载器设置
    function saveDownloaderSettings() {
        const configs = [];
        const forms = document.querySelectorAll('.downloader-form');

        forms.forEach(form => {
            const configId = form.getAttribute('data-form-id');
            const type = form.querySelector(`.downloader-type[data-config-id="${configId}"]`).value;
            const name = form.querySelector(`.downloader-name[data-config-id="${configId}"]`).value;
            const webui = form.querySelector(`.downloader-webui[data-config-id="${configId}"]`).value;
            const username = form.querySelector(`.downloader-username[data-config-id="${configId}"]`).value;
            const password = form.querySelector(`.downloader-password[data-config-id="${configId}"]`).value;

            configs.push({
                id: parseInt(configId),
                name: name,
                type: type,
                webui: webui,
                username: username,
                password: password,
                enabled: true
            });
        });

        GM_setValue('iyuu_downloader_configs', configs);
        GM_setValue('iyuu_current_downloader_configs', configs);
        console.log('下载器设置已保存:', configs);
        showMessage('✅ 下载器设置已保存！', 'success');
    }

    // 测试所有下载器连通性
    async function testAllDownloadersConnectivity() {
        const forms = document.querySelectorAll('.downloader-form');
        let successCount = 0;
        let totalCount = forms.length;

        for (const form of forms) {
            const configId = form.getAttribute('data-form-id');
            const type = form.querySelector(`.downloader-type[data-config-id="${configId}"]`).value;
            const webui = form.querySelector(`.downloader-webui[data-config-id="${configId}"]`).value;
            const username = form.querySelector(`.downloader-username[data-config-id="${configId}"]`).value;
            const password = form.querySelector(`.downloader-password[data-config-id="${configId}"]`).value;

            try {
                let result = false;

                if (type === 'qBittorrent') {
                    result = await testQbittorrentConnectivity(webui, username, password);
                } else if (type === 'Transmission') {
                    result = await testTransmissionConnectivity(webui, username, password);
                }

                if (result) {
                    successCount++;
                }
            } catch (error) {
                console.error(`下载器 ${configId} 连通性测试失败:`, error);
            }
        }

        if (successCount === totalCount) {
            showMessage(`✅ 所有下载器连通性测试成功！(${successCount}/${totalCount})`, 'success');
        } else if (successCount > 0) {
            showMessage(`⚠️ 部分下载器连通性测试成功！(${successCount}/${totalCount})`, 'warning');
        } else {
            showMessage(`❌ 所有下载器连通性测试失败！(${successCount}/${totalCount})`, 'error');
        }
    }

    // 测试下载器连通性
    async function testDownloaderConnectivity(configId) {
        const form = document.querySelector(`.downloader-form[data-form-id="${configId}"]`);
        const type = form.querySelector(`.downloader-type[data-config-id="${configId}"]`).value;
        const webui = form.querySelector(`.downloader-webui[data-config-id="${configId}"]`).value;
        const username = form.querySelector(`.downloader-username[data-config-id="${configId}"]`).value;
        const password = form.querySelector(`.downloader-password[data-config-id="${configId}"]`).value;

        const testBtn = form.querySelector(`.test-connectivity-btn[data-config-id="${configId}"]`);
        const originalText = testBtn.textContent;
        testBtn.textContent = '🔍 测试中...';
        testBtn.disabled = true;

        try {
            let result = false;

            if (type === 'qBittorrent') {
                result = await testQbittorrentConnectivity(webui, username, password);
            } else if (type === 'Transmission') {
                result = await testTransmissionConnectivity(webui, username, password);
            }

            if (result) {
                showMessage('✅ 连通性测试成功！', 'success');
            } else {
                showMessage('❌ 连通性测试失败，请检查配置！', 'error');
            }
        } catch (error) {
            console.error('连通性测试失败:', error);
            showMessage('❌ 连通性测试失败: ' + error.message, 'error');
        } finally {
            testBtn.textContent = originalText;
            testBtn.disabled = false;
        }
    }

    // GM_xmlhttpRequest Promise 封装
    function gmRequest(opts) {
        return new Promise((resolve, reject) => {
            try {
                GM_xmlhttpRequest({
                    ...opts,
                    onload: (res) => {
                        const wrapped = {
                            status: res.status,
                            response: res.response,
                            responseText: res.responseText,
                            responseHeaders: res.responseHeaders,
                            headers: res.responseHeaders,
                            text: res.responseText
                        };
                        // 尝试解析 JSON
                        try { wrapped.json = res.response && typeof res.response !== 'string' ? res.response : JSON.parse(res.responseText || ''); } catch(_) { wrapped.json = undefined; }
                        resolve(wrapped);
                    },
                    onerror: (err) => reject(err),
                    ontimeout: () => reject(new Error('请求超时'))
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    // URL 拼接工具：规范合并 base 与路径
    function buildUrl(base, path) {
        try {
            const b = new URL(base);
            const seg = String(path || '').replace(/^\/+/, '');
            return `${b.protocol}//${b.host}/${seg}`;
        } catch (_) {
            // 简单回退
            return `${String(base).replace(/\/$/,'')}/${String(path||'').replace(/^\//,'')}`;
        }
    }

    // 测试qBittorrent连通性（先登录，再取版本）
    async function testQbittorrentConnectivity(webui, username, password) {
        try {
            const url = new URL(webui);
            const base = `${url.protocol}//${url.host}`;
            // 登录
            const loginRes = await gmRequest({
                method: 'POST',
                url: `${base}/api/v2/auth/login`,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
                timeout: 8000
            });
            // qBittorrent 登录成功返回字符串 "Ok."
            if (!(loginRes && (loginRes.status === 200) && /ok\./i.test(String(loginRes.responseText || '')))) {
                // 允许已登录情况下继续（某些版本已存在会话会返回 200 空串）
                if (!loginRes || loginRes.status !== 200) return false;
            }
            // 版本探测
            const verRes = await gmRequest({
                method: 'GET',
                url: `${base}/api/v2/app/version`,
                timeout: 5000
            });
            return !!(verRes && verRes.status === 200 && String(verRes.responseText || '').length > 0);
        } catch (error) {
            console.error('qBittorrent连通性测试失败:', error);
            return false;
        }
    }

    // 测试Transmission连通性（握手获取 Session-Id）
    async function testTransmissionConnectivity(webui, username, password) {
        try {
            const url = new URL(webui);
            const apiUrl = `${url.protocol}//${url.host}/transmission/rpc`;
            const authHeader = username ? { 'Authorization': 'Basic ' + btoa(username + ':' + password) } : {};
            // 第一次请求，预期 409 并返回 X-Transmission-Session-Id
            const first = await gmRequest({
                method: 'POST',
                url: apiUrl,
                headers: { 'Content-Type': 'application/json', ...authHeader },
                data: JSON.stringify({ method: 'session-get' }),
                timeout: 5000
            });
            let sessionId = '';
            try { sessionId = first.responseHeaders?.match(/X-Transmission-Session-Id:\s*(.*)/i)?.[1]?.trim() || ''; } catch {}
            if (!sessionId && first && first.status === 409) {
                // Tampermonkey将所有响应头串在一起，尝试手动解析
                const raw = String(first.responseHeaders || '');
                const m = raw.split(/\r?\n/).find(l => /^X-Transmission-Session-Id:/i.test(l));
                if (m) sessionId = m.split(':').slice(1).join(':').trim();
            }
            // 若已直接 200 也算通过
            if (first && first.status === 200) return true;
            if (!sessionId) return false;
            // 携带 Session-Id 再请求一次
            const second = await gmRequest({
                method: 'POST',
                url: apiUrl,
                headers: { 'Content-Type': 'application/json', 'X-Transmission-Session-Id': sessionId, ...authHeader },
                data: JSON.stringify({ method: 'session-get' }),
                timeout: 5000
            });
            return !!(second && second.status === 200);
        } catch (error) {
            console.error('Transmission连通性测试失败:', error);
            return false;
        }
    }

})();
