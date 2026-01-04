// ==UserScript==
// @name         Audiences-Torrent-Assistant
// @namespace    https://greasyfork.org/zh-CN/scripts/521212
// @version      2025-12-05
// @description  观众审种助手测试版
// @author       史蒂夫
// @match        https://audiences.me/details.php*
// @match        https://audiences.me/torrents.php*
// @icon         https://audiences.me/favicon.ico
// @require      https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/jquery/3.7.1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addValueChangeListener
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521212/Audiences-Torrent-Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/521212/Audiences-Torrent-Assistant.meta.js
// ==/UserScript==

/* 由 Hddolby-Torrent-Assistant修改而成 */

(function () {
    'use strict';

    const currentPath = window.location.pathname;

    if (currentPath.startsWith('/details.php')) {
        initDetails();
    } else if (currentPath.startsWith('/torrents.php')) {
        initTorrents();
    }

    function initDetails() {
        'use strict';

        let isEnlargeBasicInfo;
        let isCheckDoubanImdbYear;
        let isGivePopcorn;

        // 初始化开关状态
        const switches = {
            otherVersionsEnabled: GM_getValue('otherVersionsEnabled', true),
            enlargeKeywordsEnabled: GM_getValue('enlargeKeywordsEnabled', true),
            cloneAndStyleInfoEnabled: GM_getValue('cloneAndStyleInfoEnabled', true),
            enlargeBasicInfoEnabled: GM_getValue('enlargeBasicInfoEnabled', true),
            checkDoubanImdbYearEnabled: GM_getValue('checkDoubanImdbYearEnabled', true),
            givePopcornEnabled: GM_getValue('givePopcornEnabled', true)
        };

        // 注册油猴扩展栏菜单项，显示当前开关状态
        const menuItems = [
            { label: '其他版本自动折叠', key: 'otherVersionsEnabled', callback: executeOtherVersionsCollapse },
            { label: '放大简介中的关键词', key: 'enlargeKeywordsEnabled', callback: enlargeKeywordsInIntro },
            { label: '克隆 Info 至简介最下方', key: 'cloneAndStyleInfoEnabled', callback: cloneAndStyleInfo },
            { label: '放大基本信息', key: 'enlargeBasicInfoEnabled', callback: enlargeBasicInfo },
            { label: '作品年份检测', key: 'checkDoubanImdbYearEnabled', callback: checkDoubanImdbYear },
            { label: '屏蔽种子页打赏爆米花', key: 'givePopcornEnabled', callback: givePopcorn }
        ];

        // 初始化菜单
        menuItems.forEach(item => {
            item.menuId = registerMenuCommand(item.label, item.key, switches[item.key], item.callback);
            if (switches[item.key]) {
                item.callback();
            }
        });

        // 注册菜单项的函数
        function registerMenuCommand(label, key, initialState, callback) {
            const stateSymbol = initialState ? '✅' : '❌';
            const menuLabel = `${stateSymbol} ${label}`;

            // 注册菜单项，并返回菜单项的ID
            return GM_registerMenuCommand(menuLabel, () => toggleSwitch(key, callback));
        }

        // 注销菜单项的函数
        function unregisterMenuCommand(menuId) {
            if (menuId) {
                GM_unregisterMenuCommand(menuId);
            }
        }

        // 通用的开关切换函数
        function toggleSwitch(key, callback) {
            const currentState = GM_getValue(key, true);
            const newState = !currentState; // 切换状态
            GM_setValue(key, newState);

            // 更新菜单项
            const item = menuItems.find(item => item.key === key);
            if (item) {
                // 注销旧菜单项并注册新的
                unregisterMenuCommand(item.menuId);
                item.menuId = registerMenuCommand(item.label, key, newState, callback);

                // 执行相应操作
                if (newState) {
                    callback();
                } else {
                    console.log(`已关闭“${item.label}，请手动刷新页面”`);
                }
            }
        }

        // 执行“其他版本自动折叠”
        function executeOtherVersionsCollapse() {
            const $otherVersions = $('#kothercopy');
            if ($otherVersions.length && $otherVersions.css('display') !== 'none') {
                klappe_news('othercopy');
            } else {
                console.warn('未找到折叠按钮');
            }
        }

        // 执行“放大简介中的关键词”
        function enlargeKeywordsInIntro() {
            const keywords = [
                // Languages
                "Chinese", "Cantonese", "Mandarin", "简中", "繁中", "简体中文", "繁体中文", "繁體中文", "简英", "繁英", "粤语", "粤", "国语", "Simplified", "Traditional",
                // Scan types
                "Scan type", "Interlaced", "Progressive",
                // Resolutions
                "480i", "720p", "1080p", "1080i", "2160p", "4320p",
                // Audio formats
                "DTS-HD Master Audio", "DTS-HD High-Res Audio", "DTS-HD MA", "TrueHD Atmos", "Dolby TrueHD/Atmos", "DTS:X", "DTS", "TrueHD",
                "OPUS", "LPCM", "AAC", "FLAC", "APE", "WAV", "MP3", "M4A", "E-AC-3",
                // Video formats
                "Dolby Vision", "HDR10\\+", "HDR10", "HDR Vivid", "HLG", "HEVC", "x265", "H.265", "AVC", "x264", "H.264", "VC-1", "MPEG-2", "MPEG", "AV1",
                // Version
                "Version 2"
            ];

            const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');

            $("#kdescr .show, #kdescr .codemain").each(function () {
                $(this).html($(this).html().replace(regex, (match) => {
                    if (!(match === "MPEG" && $(this).html().includes("MPEG-4")) &&
                        !(match === "AVC" && $(this).html().match(/AVC(?:[cs1])/i))) {
                        return `<strong style="font-size: larger;">${match}</strong>`;
                    }
                    return match;
                }));
            });
        }

        // 执行“克隆 Info 至简介最下方”
        function cloneAndStyleInfo() {
            const CONTENT_STYLE = { "background-color": "rgb(215 233 249)", "border": "3px dashed red", "padding": "10px", "margin-top": "15px" };
            const ELEMENT_STYLE = { "margin-bottom": "15px" };

            const $targetDiv = $("#kdescr");
            if (!$targetDiv.length) {
                console.log("未找到目标 div #kdescr。");
                return;
            }

            const $mediainfoElements = $("#kdescr .codetop, #kdescr .show, #kdescr .hide");
            if ($mediainfoElements.length === 0) {
                console.warn("未找到任何 Info 信息");
                return;
            }

            const $containerDiv = $("<div>").css(CONTENT_STYLE);

            $mediainfoElements.each(function () {
                const $clonedElement = $(this).clone(true);
                if (!$clonedElement.hasClass("codetop") && !$clonedElement.hasClass("codemain")) {
                    $clonedElement.css(ELEMENT_STYLE);
                }
                $containerDiv.append($clonedElement);
            });
            $targetDiv.append($containerDiv);
        }

        // 执行“放大基本信息”
        function enlargeBasicInfo() {
            isEnlargeBasicInfo = true;
        }

        // 执行“作品年份检测”
        function checkDoubanImdbYear() {
            isCheckDoubanImdbYear = true;
        }

        // 执行“屏蔽种子页打赏爆米花”
        function givePopcorn() {
            isGivePopcorn = true;
        }

        /** 种子分类 */
        const cat_constant = {
            401: '电影',
            402: '剧集',
            403: '综艺',
            404: '有声书',
            405: '电子书',
            406: '纪录片',
            407: '体育',
            408: '音乐',
            409: '其他',
            410: '游戏',
            412: '学习',
        };

        /** 媒介类型 */
        const type_constant = {
            1: "Blu-ray 原盘",
            2: "DVD 原盘",
            3: "REMUX",
            5: "HDTV",
            8: "CD",
            9: "Track",
            10: "WEB-DL",
            11: "Other",
            12: "UHD Blu-ray 原盘",
            13: "UHD Blu-ray DIY",
            14: "Blu-ray DIY",
            15: "Encode"
        };


        /** 视频编码类型 */
        const encode_constant = {
            1: "H.264(AVC)",
            2: "VC-1",
            4: "MPEG-2",
            5: "Other",
            6: "H.265(HEVC)",
            7: "AV1"
        };

        /** 音频编码类型 */
        const audio_constant = {
            1: "FLAC",
            2: "APE",
            3: "DTS",
            6: "AAC",
            7: "Other",
            18: "DD/AC3",
            19: "DTS-HD MA",
            20: "TrueHD",
            21: "LPCM",
            22: "WAV",
            23: "MP3",
            24: "M4A",
            25: "DTS:X",
            26: "TrueHD Atmos",
            27: "OPUS"
        };

        /** 分辨率 */
        const resolution_constant = {
            1: "1080p",
            2: "1080i",
            3: "720p",
            4: "SD",
            5: "4K",
            10: "8K",
            11: "None"
        };

        /** 制作组 */
        const group_constant = {
            5: "Other",
            19: "Audies",
            20: "ADWeb",
            21: "ADE",
            23: "ADAudio",
            24: "ADeBook",
            25: "ADMusic"
        };

        /** 不被信任的制作组 */
        const blackListKeywords = [
            "fgt", "hao4k", "mp4ba", "rarbg", "gpthd", "seeweb",
            "dreamhd", "blacktv", "xiaomi", "huawei", "momohd",
            "ddhdtv", "nukehd", "tagweb", "sonyhd", "minihd",
            "bitstv", "-alt", "mp4ba", "fgt", "hao4k", "zerotv",
            "batweb", "dbd-raws", "xunlei", "gamehd", "lelvetv",
            "bestweb", "enttv", "hottv"
        ];

        /** BT 组 */
        const BTGroup = ["-deanzel", "-SallySubs", "-Tsundere", "-CBM", "Chihiro", "Commies"]

        /** BT 动漫组 */
        const BTAnimeGroup = [
            "mawen1250", "ANK-Raws", "VCB-Studio", "LittleBakas!", ".subbers project",
            "Eggpain-Raws", "sergey_krs", "AI-Raws", "philosophy-raws", "jsum",
            "Reinforce", "Moozzi2", "LoliHouse", "Snow-Raws", "BeanSub", "HYSUB",
            "SubsPlease"
        ]

        /** PT 组 */
        const PTGroup = [
            // MTeam
            "-MTeam", "-MPAD", "-TnP", "-BMDru", "-MWeb",
            // CMCT
            "-CMCT", "-CMCTV", "@CMCT",
            // HDSky
            "-HDS", "-HDSWEB", "@HDSky",
            // CHDBits
            "-CHD", "@CHDBits", "-CHDWEB", "@CHDWEB",
            // OurBits
            "-Ao", "@OurBits", "-OurBits", "-FLTTH", "-iLoveTV", "-OurTV", "-iLoveHD", "-OurPad", "-MGs", "7³ACG",
            // TTG
            "-WiKi", "-DoA", "-TTG", "@TTG", "NGB", "ARiN",
            // HDChina
            "-HDCTV", "-HDCLUB", "-HDChina",
            // PTer
            "-PTerMV", "@PTer", "-PTerWEB", "-PTer",
            // HDHome
            "-HDH", "@HDHome", "-HDHome", "-HDHTV",
            // PThome
            "-PTHome", "-PTH", "@PTHome", "-PTHweb",
            // Audiences
            "@Audies", "@ADE", "-ADE", "@ADWeb", "-ADWeb",
            // PTLGS
            "@DYZ-Movie", "@DYZ-TV", "@DYZ-WEB",
            // PuTao
            "-PuTao",
            // NanYang
            "-NYHD", "-NYPAD", "-NYTV", "-NYPT", "@NYPT",
            // TLFbits
            "-TLF",
            // HDDolby
            "-DBTV", "-QHstudIo", "-Dream", "@Dream",
            // FRDS
            "FRDS", "@FRDS",
            // PigGo
            "-PigoHD", "-PigoWeb", "-PiGoNF",
            // CarPt
            "-CarPT",
            // HDVideo
            "-HDVWEB", "-HDVMV",
            // HDfans
            "-HDFans",
            // WT-Sakura
            "-SakuraWEB", "-SakuraSUB", "-WScode",
            // HHClub
            "-HHWEB",
            // HaresClub
            "-Hares", "-HareWEB", "-HaresTV", "@Hares",
            // HDPt
            "-HDPTWEB",
            // Panda
            "-AilMWeb", "-Panda", "@Panda",
            // UBits
            "@UBits", "-UBits", "-UBWEB",
            // PTCafe
            "-CafeWEB", "-CafeTV", "@PTCafe",
            // 影
            "-YingWEB", "-ingDIY", "-YingTV", "-YingMV", "-YingMUSIC",
            // DaJiao
            "-DJWEB", "-DJTV",
            // 象岛
            "-Eleph", "-ElephWEB", "-ElephREMUX", "-ElephRip", "-ElephTV", "-ElephDIY", "-ElephMUSIC", "@Eleph",
            // OKPT
            "-OKWeb",
            // AGSV
            "-AGSVPT", "-AGSVWEB", "-AGSVTV", "-AGSVMUS",
            // TJUPT
            "-TJUPT", "@TJUPT",
            "-PlayHD", "-PlaySD", "-PlayWEB", "-PlayTV",
            // 红叶
            "-RLWeb", "-RLeaves", "-R²", "@R²", "-RNML",
            // QingWa
            "-FROGE", "@FROGE", "-FROGWeb", "@FROGWeb",
            // ZMPT
            "-ZmWeb", "-ZmPT",
            // LemonHD
            "-LHD", "-LeagueWEB", "-LeagueCD", "-LeagueNF", "-LeagueHD", "-LeagueTV", "-LeagueMV",
            // ptsbao
            "-FFans", "-PTsbao", "-FHDMv", "-OPS",
            // 麒麟
            "-HDK", "@HDK", "-HDKWeb", "-HDKylinWeb", "-HDKTV", "-HDKGame", "-HDKylin", "-Kylin",
            // 未分类
            "@U2", "-GTR", "-RO", "-Telesto", "-CatEDU", "-PbK", "-Rainbaby", "-Ao", "-c0kE", "-cfandora",
            "jsum@", "-FraMeSToR", "@Sunny", "-beAst", "-BeiTai", "-PTH", "-ZONE", "-ZWEX", "-Kitsune", "-NTb",
            "-playWEB", "-BYNDR", "-FLUX", "-ETHEL", "-EDITH", "-VARYG", "-HONE", "-AilMWeb", "-ARiC", "-CSWEB",
            "-BTN", "-PTP", "-ZR", "-RAWR", "-iFPD", "-DON", "-TMT", "StarfallWeb", "-QOQ", "-PRESENT", "-EPSiLON",
            "-Chotab", "-iT00NZ", "-TrollHD", "-jeebs", "-CtrlHD", "-W4F", "GPRS", "-DEFLATE", "-PHOENiX", "-DIMENSION",
            "-SiGMA", "-CiNEPHiLES", "-DOLORES", "-E.N.D", "-NAN0"
        ]

        // 日志样式
        const groupHeaderStyle = 'color: #2196F3; font-weight: bold;';
        const keyInfoStyle = 'color: #4CAF50; font-weight: bold;';

        let isTagOfficialSeed = false; // 官方
        let isTagOriginal = false; // 原创
        let isTagMandarin = false; // 国语
        let isTagCantonese = false; // 粤语
        let isTagSubtitle = false; // 中字
        let isTagOfficialSubtitleGroup = false; // 官字组
        let isTagDIY = false; // DIY
        let isTagAnimation = false; // 动画
        let isTagComplete = false; // 完结
        let isTagDV = false; // Dolby VisTagion
        let isTagHDR10 = false; // HDR10
        let isTagHDR10Plus = false; // HDR10+
        let isTagNoRepostAllowed = false; // 禁转
        let isTagLimitedRepostAllowed = false; // 限转
        let isTagFirstRelease = false; // 首发
        let isTagRequested = false; // 应求
        let isTagZeroMagic = false; // 零魔
        let isTagMV = false; // MV
        let isTagKaraoke = false; // 卡拉OK
        let isTagLivePerformance = false; // LIVE现场
        let isTagConcert = false; // 演唱会
        let isTagMusicAlbum = false; // 音乐专辑

        let isOfficialSeed, isOriginal, isMandarin, isCantonese, isSubtitle, isInfoSubtitle, isOfficialSubtitleGroup, isDIY, isAnimation, isComplete, isDV, isHDR10, isHDR10Plus, isNoRepostAllowed, isLimitedRepostAllowed, isFirstRelease, isRequested, isZeroMagic, isMV, isKaraoke, isLivePerformance, isConcert, isMusicAlbum, isVarietyShow, isDocumentary, isMovie, isSeries;
        let isMediainfo, isBDInfo;

        $ = jQuery;

        // 1. FIXME: 从标题筛选信息------------------------------------------------------------
        /** 主标题 */
        let title = $('#top').text();
        console.log('%c原始主标题:', keyInfoStyle, title);
        title = title
            .replace("[免费]", "")
            .replace("[2X免费]", "")
            .replace("[2xfree]", "")
            .replace("[50%]", "")
            .replace("[30%]", "")
            .replace("[2X 50%]", "")
            .replace("[2X]", "")
            .replace(/剩余时间.*$/, "")
            .trim();
        console.log('%c过滤后主标题:', keyInfoStyle, title);
        /** 小写主标题 */
        let title_lowercase = title.toLowerCase();
        /** 副标题 */
        let subtitle = $('#outer td.rowhead').filter(function () {
            return $(this).text() == '副标题';
        }).parent().children().last().text();
        /** 小写副标题 */
        let subtitle_lowercase = subtitle.toLowerCase();
        /** 主标题_影片年份 */
        let title_year = title.match(/\b(?:18[0-9]{2}|19[0-9]{2}|20[0-2][0-9]|2030)\b/g);  // 匹配 1800-2030 年份
        title_year = title_year ? title_year[title_year.length - 1].trim() : '';
        /** 主标题_媒介类型 */
        let title_type;
        /** 主标题_视频编码 */
        let title_encode;
        /** 主标题_音频编码 */
        let title_audio;
        /** 主标题_声道数 */
        let title_channel = title.match(/\s?(1\.0|2\.0|3\.0|3\.1|4\.0|5\.0|5\.1|7\.1)(?![\d]{1})/g);
        title_channel = title_channel ? title_channel[title_channel.length - 1].trim() : '';
        /** 主标题_分辨率 */
        let title_resolution;
        /** 主标题_制作组 */
        let title_group;
        /** 主标题_未检测到警告 (NOTE: 使用位运算标记) */
        let title_warn_no = 0;

        // Type
        const isUHDBluRay = /(uhd|2160p).+(bluray|blu-ray)|((bluray|blu-ray).+(uhd|2160p))/g.test(title_lowercase);
        const isBluRay = /(blu-ray|bluray)/g.test(title_lowercase);
        const isVideoCodec = /(hevc|avc|vc-1|vc1|mpeg-2|mpeg2)/g.test(title_lowercase);
        const isDiyDisc = /DIY@|-.*?@(MTeam|CHDBits|HDHome|OurBits|HDChina|Language|TTG|Pter|HDSky|Audies|CMCT|Dream|Audies|UBits)/ig.test(title) && !/mrchildren@UBits/ig.test(title);

        if (title_lowercase.includes("remux")) {
            // remux 优先级最高
            title_type = 3;
        }
        else if (/webrip|web-rip|dvdrip|bdrip|brrip|hdtvrip|minibd/g.test(title_lowercase)) {
            title_type = 15;
        }
        else if (title_lowercase.includes("hdtv")) {
            title_type = 5;
        }
        else if (title_lowercase.includes("web-dl") || title_lowercase.includes("webdl")) {
            title_type = 10;
        }
        else if (title_lowercase.includes("x264") || title_lowercase.includes("x265")) {
            // x265 x264 优先级次之
            title_type = 15;
        }
        else if (
            title_lowercase.includes("hddvd") || title_lowercase.includes("hd dvd") || title_lowercase.includes("dvd")
        ) {
            title_type = 2;
        }
        else if (isUHDBluRay && isVideoCodec && (isDiyDisc || subtitle_lowercase.includes("diy"))) {
            title_type = 13;
        }
        else if (isBluRay && isVideoCodec && (isDiyDisc || subtitle_lowercase.includes("diy"))) {
            title_type = 14;
        }
        else if (isUHDBluRay && isVideoCodec) {
            title_type = 12;
        }
        else if (isBluRay && isVideoCodec) {
            title_type = 1;
        }
        else if (title_lowercase.includes("cd")) {
            title_type = 8;
        }
        else {
            console.warn('未检测到已有媒介类型');
            title_type = 11;
            title_warn_no += 1;
        }

        // VideoCodec
        if (title_lowercase.includes("x264") || title_lowercase.includes("h264") || title_lowercase.includes("h.264") || title_lowercase.includes("avc")) {
            title_encode = 1;
        }
        else if (title_lowercase.includes("x265") || title_lowercase.includes("h265") || title_lowercase.includes("h.265") || title_lowercase.includes("hevc")) {
            title_encode = 6;
        }
        else if (title_lowercase.includes("vc-1") || title_lowercase.includes("vc1")) {
            title_encode = 2;
        }
        else if (title_lowercase.includes("mpeg2") || title_lowercase.includes("mpeg-2")) {
            title_encode = 4;
        }
        else if (title_lowercase.includes("av1") || title_lowercase.includes("av-1")) {
            title_encode = 7;
        }
        else {
            console.warn('未检测到已有视频编码类型');
            title_encode = 5;
            title_warn_no += 2;
        }

        // AudioCodec
        const audioEncodingErrorRegexMap = {
            DTSHDMA: / dts-?(hd)?-?ma/ig,
            DTSX: /(?<=[\s_])dtsx(?=[\W_])/ig,
            ATMOS: /(?<=[\s_])atoms(?=[\W_])/ig,
            AAC: /(?<=[\s_])acc(?=[\W_])/ig
        };
        if (title_lowercase.includes("dts-hd ma") || audioEncodingErrorRegexMap.DTSHDMA.test(title_lowercase)) {
            title_audio = 19;
        }
        else if (title_lowercase.includes("dts-x") || title_lowercase.includes("dts:x") || audioEncodingErrorRegexMap.DTSX.test(title_lowercase)) {
            title_audio = 25;
        }
        else if (title_lowercase.includes("truehd") && (title_lowercase.includes("atmos") || audioEncodingErrorRegexMap.ATMOS.test(title_lowercase))) {
            title_audio = 26;
        }
        else if (title_lowercase.includes("truehd")) {
            title_audio = 20;
        }
        else if (title_lowercase.includes("lpcm") || title_lowercase.includes("pcm")) {
            title_audio = 21;
        }
        else if (title_lowercase.includes("dts")) {
            title_audio = 3;
        }
        else if (/(ddp|eac3|ac3|ac-3|dd\+|dd.?[125])/g.test(title_lowercase)) {
            title_audio = 18;
        }
        else if (title_lowercase.includes("aac") || audioEncodingErrorRegexMap.AAC.test(title_lowercase)) {
            title_audio = 6;
        }
        else if (title_lowercase.includes("flac")) {
            title_audio = 1;
        }
        else if (title_lowercase.includes("opus")) {
            title_audio = 27;
        }
        else {
            console.warn('未检测到已有音频编码类型');
            title_audio = 7;
            title_warn_no += 4;
        }

        // Resolution
        if (title_lowercase.includes("4320p") || title_lowercase.includes("8k")) {
            title_resolution = 10;
        }
        else if (title_lowercase.includes("2160p") || title_lowercase.includes("uhd") || title_lowercase.includes("4k")) {
            title_resolution = 5;
        }
        else if (title_lowercase.includes("1080p")) {
            title_resolution = 1;
        }
        else if (title_lowercase.includes("1080i")) {
            title_resolution = 2;
        }
        else if (title_lowercase.includes("720p")) {
            title_resolution = 3;
        }
        else if (title_lowercase.includes("minisd") || title_lowercase.includes("480p") || title_lowercase.includes("480i") || title_lowercase.includes("576p") || title_lowercase.includes("576i")) {
            title_resolution = 4;
        }
        else {
            console.warn('未检测到已有分辨率类型');
            title_resolution = 11;
            title_warn_no += 8;
        }

        // Group
        if (title.includes("Audies")) {
            title_group = 19;
        }
        else if (title.includes("ADWeb")) {
            title_group = 20;
        }
        else if (title.includes("ADE")) {
            title_group = 21;
        }
        else if (title.includes("ADAudio")) {
            title_group = 23;
        }
        else if (title.includes("ADeBook")) {
            title_group = 24;
        }
        else if (title.includes("ADMusic")) {
            title_group = 25;
        }
        else {
            title_group = 5;
        }

        // FIXME: 2. 从种子表单筛选信息------------------------------------------------------------
        /** 表单_种子大小 */
        let size;
        /** 表单_种子种类 */
        let cat;
        /** 表单_媒介类型 */
        let type;
        /** 表单_视频编码 */
        let encode;
        /** 表单_音频编码 */
        let audio;
        /** 表单_分辨率 */
        let resolution;
        /** 表单_制作组 */
        let group;
        /** 表单_匿名 */
        let anonymous;
        /** 表单_发布者 */
        let uploader;
        /** 表单_等级 */
        let level;
        /** 表单_发布时间 */
        let publishTime;
        /** 文件列表 */
        let fileList;
        /** 做种人数 */
        let seeders;

        let hasProcessedInfo = false;
        let hasLinkedImage = false;
        let allImages = [];
        let tdlist = $('#outer td.rowhead');
        for (let i = 0; i < tdlist.length; i++) {
            let td = $(tdlist[i]);
            if (td.text() == '下载') {
                let raw = td.parent().children().last();
                const nowrap = raw.find('span.nowrap');
                let text = raw.text();
                if (text.indexOf('匿名') >= 0) {
                    anonymous = 1;
                }

                // 发布者
                uploader = nowrap.find('a > b').text();
                // 等级
                level = nowrap.children('span, b').attr('class');
                // 发布时间，格式：2025-08-01 00:00:00
                publishTime = raw.find('span[title]').attr('title')
                    || raw.text().match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)?.[0];

                // console.log("发布者:", uploader);
                // console.log("等级:", level);
                // console.log("发布时间:", publishTime);

                // 搜索该资源发布者历史发布记录
                const button = $('<button>', {
                    text: '搜索历史发布记录',
                    css: { 'margin-left': '10px' },
                    click: () => window.open(`torrents.php?search=${uploader}&search_area=3`, '_blank')
                });
                raw.append(button);
            }

            if (td.text() == '标签') {
                let text = td.parent().children().last().text();
                // console.log('标签: ' + text);

                const tagMappings = {
                    '官方': () => isTagOfficialSeed = true, // 官方
                    '原创': () => isTagOriginal = true, // 原创
                    '国语': () => isTagMandarin = true, // 国语
                    '粤语': () => isTagCantonese = true, // 粤语
                    '中字': () => isTagSubtitle = true, // 中字
                    '官字组': () => isTagOfficialSubtitleGroup = true, // 官字组
                    'DIY': () => isTagDIY = true, // DIY
                    '动画': () => isTagAnimation = true, // 动画
                    '完结': () => isTagComplete = true, // 完结
                    'Dolby Vision': () => isTagDV = true, // Dolby Vision
                    'HDR10+': () => isTagHDR10Plus = true, // HDR10+
                    '禁转': () => isTagNoRepostAllowed = true, // 禁转
                    '限转': () => isTagLimitedRepostAllowed = true, // 限转
                    '首发': () => isTagFirstRelease = true, // 首发
                    '应求': () => isTagRequested = true, // 应求
                    '零魔': () => isTagZeroMagic = true, // 零魔
                    'MV': () => isTagMV = true, // MV
                    '卡拉OK': () => isTagKaraoke = true, // 卡拉OK
                    'LIVE现场': () => isTagLivePerformance = true, // LIVE现场
                    '演唱会': () => isTagConcert = true, // 演唱会
                    '音乐专辑': () => isTagMusicAlbum = true, // 音乐专辑
                };

                // 处理普通标签
                Object.keys(tagMappings).forEach(tag => {
                    if (text.includes(tag)) {
                        tagMappings[tag]();
                    }
                });

                // 特殊处理 HDR10（需要额外检查后面没有+号）
                if (text.includes('HDR10')) {
                    const hdr10Index = text.indexOf('HDR10');
                    if (hdr10Index !== -1 && text[hdr10Index + 5] !== '+') {
                        isTagHDR10 = true; // HDR10标签
                    }
                }
            }

            if (td.text() == '豆瓣信息') {
                let doubanRaw = td.parent().children().last();
                let doubanText = doubanRaw.html()
                    .replace(/<br\s*\/?>/gi, '\n')
                    .replace(/<\/?p>/gi, '\n')
                    .replace(/<\/?[^>]+(>|$)/g, '')
                    .trim();

                var doubanYear = doubanText.match(/作品年份：\s*(\d{4})/);
                var doubanClass = doubanText.match(/类型：\s*(.*) 更新时间/);
                var doubanType = doubanText.match(/\n类型：\s*([\s\S]*?)\n/);
                doubanYear = doubanYear?.[1] || '未找到';
                doubanClass = doubanClass?.[1] || '未找到';
                doubanType = doubanType?.[1] || '未找到';
                console.group(`%c------ 豆瓣,IMDb解析 ------`, groupHeaderStyle);
                console.log('%c豆瓣作品年份:', keyInfoStyle, doubanYear);
                console.log('%c豆瓣作品分类:', keyInfoStyle, doubanClass);
                console.log('%c豆瓣作品类型:', keyInfoStyle, doubanType);

                if (doubanClass.includes("电影")) {
                    isMovie = true;
                }
                if (doubanClass.includes("电视剧")) {
                    isSeries = true;
                }

                if (doubanType.includes("动画")) {
                    isAnimation = true;
                }
                if (doubanType.includes("纪录片")) {
                    isDocumentary = true;
                }
                if (doubanType.includes("真人秀") || doubanType.includes("脱口秀")) {
                    isVarietyShow = true;
                }
            }

            if (td.text() == ' IMDb信息') {
                let imdbRaw = td.parent().children().last();
                let imdbText = imdbRaw.html()
                    .replace(/<br\s*\/?>/gi, '\n')
                    .replace(/<\/?p>/gi, '\n')
                    .replace(/<\/?[^>]+(>|$)/g, '')
                    .trim();

                var imdbYear = imdbText.match(/作品年份：\s*(\d{4})/);
                var imdbClass = imdbText.match(/分类：\s*(.*)\n/);
                var imdbType = imdbText.match(/风格：\s*([\s\S]*?)\n/);
                imdbYear = imdbYear?.[1] || '未找到';
                imdbClass = imdbClass?.[1] || '未找到';
                imdbType = imdbType?.[1] || '未找到';
                console.log('%cIMDb作品年份:', keyInfoStyle, imdbYear);
                console.log('%cIMDb作品分类:', keyInfoStyle, imdbClass);
                console.log('%cIMDb作品类型:', keyInfoStyle, imdbType);
                console.groupEnd();

                if (imdbClass.includes("movie")) {
                    isMovie = true;
                }
                if (imdbClass.includes("series")) {
                    isSeries = true;
                }

                if (imdbType.includes("Animation")) {
                    isAnimation = true;
                }

                if (imdbType.includes("Documentary")) {
                    isDocumentary = true;
                }

                if (imdbType.includes("Reality-TV") || imdbType.includes("Game-Show") || imdbType.includes("Talk-Show")) {
                    isVarietyShow = true;
                }
            }

            if (td.text() == ' 简介') {
                let raw = td.parent().children().last();

                let linksWithImages = raw.find('a').has('img'); // 只选择包含 <img> 的 <a>
                linksWithImages.each(function () {
                    let href = $(this).attr('href'); // 超链接
                    let imgSrc = $(this).find('img').attr('src'); // 图片地址
                    allImages.push(imgSrc);
                    // console.log('超链接:', href, '图片地址:', imgSrc);
                    // 检查是否有非公共图床的图片超链接
                    const publicImageHostKeywords = ['ptpimg', 'pixhost', 'gifyu', 'imgbox', 'imgurl', 'imgdb', 'loli', 'postimg', 'imagebam', 'ibb', 'iili', 'imgoe'];
                    hasLinkedImage = allImages.some(imgSrc => {
                        return imgSrc && !publicImageHostKeywords.some(keyword =>
                            imgSrc.toLowerCase().includes(keyword.toLowerCase())
                        );
                    });
                });

                let independentImages = raw.find('img').not('a img'); // 排除嵌套在 <a> 中的图片
                independentImages.each(function () {
                    let src = $(this).attr('src'); // 图片地址
                    allImages.push(src);
                    // console.log('图片地址:', src);
                });

            }

            if (td.text() == '基本信息') {
                if (isEnlargeBasicInfo) {
                    const rowfollowElement = td.next('.rowfollow');
                    rowfollowElement.length && td.add(rowfollowElement).css('font-size', '16px');
                }

                if (hasProcessedInfo) continue;

                console.group(`%c------ 表单信息初步解析------`, groupHeaderStyle);
                const form_info = td.parent().children().last().text();
                console.log(`%c基本信息单行:`, keyInfoStyle, form_info);
                const separated = form_info.split('   ');
                console.log(`%c基本信息多行:`, keyInfoStyle, separated.join('\n'));
                console.groupEnd();

                size = separated.find(item => item.startsWith('大小'))?.split(/[：:]/)[1]?.trim();

                const processConstant = (word, constantObj, specialCases = {}) => {
                    for (const [key, value] of Object.entries(constantObj)) {
                        if (word.includes(value)) {
                            const result = Number(key);
                            for (const [caseWord, caseValue] of Object.entries(specialCases)) {
                                if (word.includes(caseWord)) return caseValue;
                            }
                            return result;
                        }
                    }
                    return undefined;
                };

                separated.forEach(word => {
                    if (word.includes('类型')) {
                        cat = processConstant(word, cat_constant);
                    } else if (word.includes('媒介')) {
                        const specialCases = {
                            'UHD Blu-ray 原盘': 12
                        };
                        type = processConstant(word, type_constant, specialCases);
                    } else if (word.includes('编码') && !word.includes('音频编码')) {
                        encode = processConstant(word, encode_constant);
                    } else if (word.includes('音频编码')) {
                        const specialCases = {
                            'DTS-HD MA': 19,
                            'DTS:X': 25,
                            'TrueHD Atmos': 26
                        };
                        audio = processConstant(word, audio_constant, specialCases);
                    } else if (word.includes('分辨率')) {
                        resolution = processConstant(word, resolution_constant);
                    } else if (word.includes('制作组')) {
                        group = processConstant(word, group_constant);
                    }
                });

                hasProcessedInfo = true;
            }

            if (td.text() == '种子文件') {
                const viewScript = $('#showfl').find('a').attr('href');
                const hideScript = $('#hidefl').find('a').attr('href');

                const fileListContainer = document.getElementById('filelist');
                const timeoutId = setTimeout(() => {
                    observer?.disconnect();
                    console.warn('文件列表加载超时，可能未完全加载');
                }, 15000); // 15 秒超时

                const observer = new MutationObserver((mutations, obs) => {
                    let fileRows = $('#filelist tr[data-par] [data-name]');
                    if (fileRows.length == 0) {
                        fileRows = $('#filelist tr td[data-name]');
                    }
                    clearTimeout(timeoutId);
                    obs.disconnect();
                    fileList = [...fileRows].map(el => {
                        const fileName = $(el).text().trim();
                        // 移除不可见字符
                        return fileName.replace(/[\u200B-\u200F\uFEFF]/g, '');
                    });

                    // console.log('文件列表:', fileList);
                    eval(hideScript);
                    // setTimeout(() => { eval(hideScript); }, 50); // 50ms 后隐藏文件列表
                });

                observer.observe(fileListContainer, {
                    childList: true
                });

                eval(viewScript);
            }

            if (td.text().includes('同伴')) {
                seeders = Number(td.parent().children().last().text().replace(/个做种者.*$/, ''));
            }

            if (isGivePopcorn) {
                if (td.text() == '爆米花奖励') {
                    td.closest('tr').hide();
                }
            }
        }

        //** 获取到的 Info */
        const infoContent = ($('#kdescr .codemain').first().text().trim() || console.warn("未找到任何 Info 信息"))?.replace(/[\u00A0\u2000-\u200F\u2028-\u202F\u205F\u3000\uFEFF]/g, ' ');

        // console.log('调试信息：输出获取到的 Info')
        // console.log(infoContent)

        /** info_视频编码 */
        let info_encode
        /** info_音频编码 */
        let info_audio
        /** info_音频声道数 */
        let info_audio_channel
        /** info_分辨率 */
        let info_resolution;

        function detectInfoType(text) {
            console.group('%c------ 检测信息类型 ------', groupHeaderStyle);
            // 去除首尾空白
            text = text.trim();

            // Mediainfo特征
            const mediaInfoPatterns = [
                { pattern: /^General$/m, weight: 5 },
                { pattern: /^Video$/m, weight: 2 },
                { pattern: /^Audio$/m, weight: 1 },
                { pattern: /^Text$/m, weight: 1 },
                { pattern: /Complete name\s*:/i, weight: 5 },
                { pattern: /Format\s*:/i, weight: 2 },
                { pattern: /Codec\s*:/i, weight: 2 },
                { pattern: /Duration\s*:/i, weight: 1 },
                { pattern: /Resolution\s*:/i, weight: 1 }
            ];

            // BDInfo特征
            const bdInfoPatterns = [
                { pattern: /^DISC INFO:$/mi, weight: 5 },
                { pattern: /Disc Title:/i, weight: 5 },
                { pattern: /Disc Label:/i, weight: 5 },
                { pattern: /Disc Size:/i, weight: 5 },
                { pattern: /^PLAYLIST REPORT$/mi, weight: 3 },
                { pattern: /Playlist:/i, weight: 3 },
                { pattern: /Subtitle:/i, weight: 1 },
            ];

            // 计算加权匹配分数
            const mediaInfoScore = mediaInfoPatterns.reduce((score, item) =>
                item.pattern.test(text) ? score + item.weight : score, 0);
            const bdInfoScore = bdInfoPatterns.reduce((score, item) =>
                item.pattern.test(text) ? score + item.weight : score, 0);

            console.log(`调试信息：Mediainfo 匹配分数为：${mediaInfoScore}`);
            console.log(`调试信息：BDInfo 匹配分数为：${bdInfoScore}`);

            // 灵活判断
            const threshold = 5; // 匹配阈值可调整
            const infoDetectionResult =
                mediaInfoScore > bdInfoScore && mediaInfoScore >= threshold ? 'Mediainfo' :
                    bdInfoScore > mediaInfoScore && bdInfoScore >= threshold ? 'BDInfo' :
                        'Uncertain';
            console.log(`调试信息：检测结果为 ${infoDetectionResult}`);
            console.groupEnd();
            return infoDetectionResult;
        }

        /** 去重工具函数 */
        function extractUniqueMatches(regexes, content, matchHandler, keyGenerator) {
            const uniqueMatches = new Set();
            const result = [];

            for (const regex of regexes.map(re => new RegExp(re))) {
                let match;
                while ((match = regex.exec(content)) !== null) {
                    const key = keyGenerator(match);
                    if (!uniqueMatches.has(key)) {
                        uniqueMatches.add(key);
                        result.push(matchHandler(match));
                    }
                }
            }
            return result;
        }

        /**
         * 文件大小单位转换工具
         * 可以在不同单位之间进行转换，或格式化为可读大小
         * @param {string|number} input - 输入值，可以是字节数(number)或带单位的字符串(string)
         * @param {object} options - 转换选项
         * @param {string} [options.targetUnit] - 目标单位，如'B','KB','MB','GB','TB','PB'，不指定则自动选择合适单位
         * @param {number} [options.decimals=2] - 格式化时的小数位数
         * @param {boolean} [options.returnString=false] - 是否返回字符串而不是对象
         * @return {object|string} 转换结果对象或字符串
         */
        function sizeConverter(input, options = {}) {
            const { targetUnit = null, decimals = 2, returnString = false } = options;

            const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
            const unitValues = units.reduce((acc, unit, i) => ({
                ...acc,
                [unit]: Math.pow(1024, i)
            }), {});

            // 解析输入获取字节数
            const parseInput = (input) => {
                if (typeof input === 'number') return input;
                if (typeof input !== 'string') return 0;

                if (input.toLowerCase().includes('bytes')) {
                    return parseFloat(input.replace(/[^\d.]/g, ''));
                }

                const match = input.trim().toUpperCase().match(/^([\d.]+)\s*([KMGTP]?B)?$/);
                if (!match) return 0;

                const [, valueStr, unit = 'B'] = match;
                const value = parseFloat(valueStr);
                return unitValues[unit] ? value * unitValues[unit] : 0;
            };

            const bytes = parseInput(input);
            if (!bytes) {
                const defaultResult = { size: '0', unit: targetUnit || 'B', readable: `0 ${targetUnit || 'B'}` };
                return returnString ? defaultResult.readable : { bytes: 0, formatted: defaultResult };
            }

            // 计算合适单位和大小
            const calculateSize = () => {
                if (targetUnit && unitValues[targetUnit.toUpperCase()]) {
                    const unit = targetUnit.toUpperCase();
                    return {
                        size: (bytes / unitValues[unit]).toFixed(decimals),
                        unit
                    };
                }

                const exponent = Math.floor(Math.log(bytes) / Math.log(1024));
                const unitIndex = Math.min(exponent, units.length - 1);
                const unit = units[unitIndex];
                return {
                    size: (bytes / Math.pow(1024, unitIndex)).toFixed(decimals),
                    unit
                };
            };

            const { size, unit } = calculateSize();
            const formatted = { size, unit, readable: `${size} ${unit}` };

            return returnString ? formatted.readable : { bytes, formatted };
        }

        function parseMediainfo(infoContent) {
            // console.log('调试信息：开始解析 Mediainfo 数据');

            // 初始化数据对象
            const mediainfoData = {
                CompleteName: '',
                Duration: '',
                ContainerFormat: '',
                FileSize: '',
                VideoFormat: '',
                VideoFormatVersion: '',
                ScanType: '',
                Resolution: '',
                ColorPrimaries: '',
                HDR: [],
                Audio: [],
                Subtitles: [],
                MainAudioTrack: '',
                MainAudioChannels: '',
                HighestQualityAudioTrack: '',
                HighestQualityAudioChannels: ''
            };


            // 提取 General 数据
            const generalRegex = {
                CompleteName: /Complete name\s*:\s*(.+)/,
                Duration: /Duration\s*:\s*(.+)/,
                ContainerFormat: /Format\s*:\s*(.+)/,
                FileSize: /File size\s*:\s*(.+)/
            };
            mediainfoData.CompleteName = (infoContent.match(generalRegex.CompleteName) || [])[1] || '';
            mediainfoData.Duration = (infoContent.match(generalRegex.Duration) || [])[1] || '';
            mediainfoData.ContainerFormat = (infoContent.match(generalRegex.ContainerFormat) || [])[1] || '';
            mediainfoData.FileSize = (infoContent.match(generalRegex.FileSize) || [])[1] || '';

            // 提取 Video 数据
            const videoRegex = {
                Format: /^\s*Video\b[\s\S]*?\bFormat\s*:\s*(.+)$/mi,
                FormatVersion: /Format\s*version\s*:\s*(.+)/i,
                ScanType: /Scan\s*type\s*:\s*(\S+)/i,
                Resolution: /Width\s*:\s*([\d\s]+)pixels[\s\S]*?Height\s*:\s*([\d\s]+)pixels/,
                ColorPrimaries: /Color primaries\s*:\s*(.*)/i,
                HDR: /HDR format\s*:\s*(.*)/g
            };
            mediainfoData.VideoFormat = (infoContent.match(videoRegex.Format) || [])[1]?.trim() || '';
            mediainfoData.VideoFormatVersion = (infoContent.match(videoRegex.FormatVersion) || [])[1]?.trim() || '';
            mediainfoData.ScanType = (infoContent.match(videoRegex.ScanType) || [])[1]?.trim() || '';
            mediainfoData.ColorPrimaries = (infoContent.match(videoRegex.ColorPrimaries) || [])[1]?.trim() || '';

            // 提取分辨率
            const resolutionMatch = infoContent.match(videoRegex.Resolution);
            if (resolutionMatch) {
                const width = resolutionMatch[1].replace(/\s+/g, '');  // 宽度
                const height = resolutionMatch[2].replace(/\s+/g, '');  // 高度
                // 拼接分辨率
                mediainfoData.Resolution = `${width}x${height}`;
            } else {
                mediainfoData.Resolution = '';
            }

            // 提取 HDR 信息
            const hdrMatches = infoContent.match(videoRegex.HDR);
            if (hdrMatches) {
                mediainfoData.HDR = hdrMatches.map(item => {
                    const [, content] = item.match(/HDR format\s*:\s*(.*)/) || []; // 提取冒号后的内容
                    return content ? content.replace(/\s*\/\s*/g, '\n').trim() : ''; // 格式化内容
                });
            }

            // 获取并处理音频信息和字幕信息的文本内容
            const getTextContent = selector => $(selector).html().replace(/<br\s*\/?>\s*/gi, '\n').replace(/<[^>]+>/g, '').trim();

            // 音频信息
            mediainfoData.Audio.push(getTextContent('#kdescr .show tr:nth-child(2) td:nth-child(3)'));
            // 定义音频编码的优先级（值越大，优先级越高）
            const audioCodecPriority = {
                "DTS:X": 20,
                "TrueHD Atmos": 19,
                "DTS-HD MA": 19,
                "TrueHD": 17,
                "DTS": 16,
                "PCM": 15,
                "FLAC": 14,
                "APE": 13,
                "WavPack": 12,
                "Opus": 11,
                "E-AC-3": 10,
                "AC-3": 9,
                "AAC": 8,
                "M4A": 7,
                "MPEG Audio 3": 6
            };

            // 解析音轨信息
            const audioTracks = mediainfoData.Audio[0].split('\n');

            // 1. 提取主音轨
            const mainAudioTrack = audioTracks[0]; // 第一个音轨作为主音轨
            const mainChannelsMatch = mainAudioTrack.match(/(\d+\.?\d*)(?:\s*ch|(?=\s*@))/);
            const mainChannels = mainChannelsMatch ? mainChannelsMatch[1] : 0; // 主音轨的声道数

            // 2. 找到规格最高的音轨
            let highestQualityTrack = ''; // 最高规格音轨的完整信息
            let highestPriority = -1; // 最高优先级值
            let highestChannels = 0; // 最高声道数
            let highestBitrate = 0; // 最高比特率

            audioTracks.forEach(track => {
                // 提取编码、声道数和比特率
                const codecMatch = track.match(/(DTS:X|TrueHD Atmos|DTS-HD MA|TrueHD|DTS|PCM|FLAC|APE|WavPack|Opus|E-AC-3|AC-3|AAC|M4A|MPEG Audio 3)/);
                const channelsMatch = track.match(/(\d+\.?\d*)(?:\s*ch|(?=\s*@))/);
                const bitrateMatch = track.match(/@ (\d+)kb\/s/);

                if (codecMatch && channelsMatch && bitrateMatch) {
                    const codec = codecMatch[0]; // 当前音轨的编码
                    const channels = channelsMatch[1]; // 当前音轨的声道数
                    const bitrate = parseInt(bitrateMatch[1], 10); // 当前音轨的比特率

                    // 计算当前音轨的优先级
                    const priority = audioCodecPriority[codec] || 0;

                    // 比较优先级
                    if (priority > highestPriority ||
                        (priority === highestPriority && channels > highestChannels) ||
                        (priority === highestPriority && channels === highestChannels && bitrate > highestBitrate)) {
                        highestPriority = priority;
                        highestChannels = channels;
                        highestBitrate = bitrate;
                        highestQualityTrack = track;
                    }
                }
            });
            mediainfoData.MainAudioTrack = mainAudioTrack; // 主音轨
            mediainfoData.MainAudioChannels = mainChannels; // 主音轨声道数
            mediainfoData.HighestQualityAudioTrack = highestQualityTrack; // 最高规格音轨
            mediainfoData.HighestQualityAudioChannels = highestChannels; // 最高规格音轨声道数

            // 字幕信息
            // mediainfoData.Subtitles.push(getTextContent('#kdescr .show tr:nth-child(2) td:nth-child(4)'));

            // 提取 Subtitles 数据，拼接为 `Title (Language)`
            mediainfoData.Subtitles = infoContent.split(/(?=Text\s+#?\d+)/g)
                .filter(block => block.trim().startsWith('Text'))
                .map(block => {
                    const title = block.match(/Title\s*:\s*([^\n\r]+)/)?.[1]?.trim();
                    const language = block.match(/Language\s*:\s*([^\n\r]+)/)?.[1]?.trim();
                    return title && language ? `${title} (${language})` : title || language;
                })
                .filter(Boolean);
            // console.log('调试信息：Mediainfo 数据解析完成');

            console.group(`%c------ Mediainfo 信息解析 ------`, groupHeaderStyle);
            console.log(`%c文件名:`, keyInfoStyle, mediainfoData.CompleteName);
            console.log(`%c时长:`, keyInfoStyle, mediainfoData.Duration);
            console.log(`%c容器格式:`, keyInfoStyle, mediainfoData.ContainerFormat);
            console.log(`%c文件大小:`, keyInfoStyle, mediainfoData.FileSize);
            console.log(`%c视频编码:`, keyInfoStyle, mediainfoData.VideoFormat);
            console.log(`%c视频编码版本:`, keyInfoStyle, mediainfoData.VideoFormatVersion);
            console.log(`%c扫描类型:`, keyInfoStyle, mediainfoData.ScanType);
            console.log(`%c色域:`, keyInfoStyle, mediainfoData.ColorPrimaries);
            console.log(`%c分辨率:`, keyInfoStyle, mediainfoData.Resolution);
            console.log(`%c动态范围:`, keyInfoStyle);
            console.log(mediainfoData.HDR.join('\n'));
            console.log(`%c音频信息:`, keyInfoStyle, `总数:`, mediainfoData.Audio[0].split('\n').length);
            console.log(mediainfoData.Audio.join('\n'));
            console.log(`%c主音轨:`, keyInfoStyle, mainAudioTrack);
            console.log(`%c主音轨声道数:`, keyInfoStyle, mainChannels);
            console.log(`%c最高规格音轨:`, keyInfoStyle, highestQualityTrack);
            console.log(`%c最高规格音轨声道数:`, keyInfoStyle, highestChannels);
            console.log(`%c字幕信息:`, keyInfoStyle, `总数:`, mediainfoData.Subtitles.length);
            console.log(mediainfoData.Subtitles.join('\n'));
            console.groupEnd();

            return mediainfoData;
        }

        function parseBDInfo(bdInfoContent) {
            // console.log('调试信息：开始解析 BDInfo 数据');

            const bdInfoData = {
                DiscSize: {
                    Original: '',
                    Readable: ''
                },
                VideoFormat: [],
                Audio: [],
                Subtitles: [],
                MainAudioTrack: '',
                MainAudioChannels: '',
                HighestQualityAudioTrack: '',
                HighestQualityAudioChannels: ''
            };

            // 提取光盘大小信息
            const discSizeMatch = bdInfoContent.match(/Disc Size:\s*([\d,]+)\s*bytes/);
            if (discSizeMatch) {
                const originalSize = discSizeMatch[1];
                const sizeInBytes = parseInt(originalSize.replace(/,/g, ''), 10);
                const converted = sizeConverter(sizeInBytes);

                bdInfoData.DiscSize.Original = originalSize + ' bytes';
                bdInfoData.DiscSize.Readable = converted.formatted.readable;
            }

            // 提取视频流信息
            const videoStreamRegexes = [
                /(\S+\s*[\w-]+ Video)\s+((?:\d{1,3}(?:,\d{3})|\d+) kbps|\d+\.\d+ (?:m|M)bps)\s+(.+)/g,
                /Video:\s+(.+?)\s+\/\s+(\d{1,3}(?:,\d{3})*|\d+ kbps)(?:\s*\([^)]*\))?\s+\/\s+(.+)/g,
                /Video:\s+(.+?)\s+\/\s+([\d,]+ kbps)\s+\/\s+(.+)/g
            ];

            bdInfoData.VideoFormat = extractUniqueMatches(
                videoStreamRegexes,
                bdInfoContent,
                (match) => ({
                    Codec: match[1] || '',
                    Bitrate: match[2] || '',
                    Description: match[3] || ''
                }),
                (match) => `${match[1]}|${match[2]}|${match[3]}` // 生成唯一标识符
            );

            // 提取音频流信息
            const audioStreamRegexes = [
                /([A-Za-z0-9\- :/]+ Audio)\s+([A-Za-z]+)\s+(\d+ kbps)\s+(.+)/g,
                /Audio:\s*(.+?)\s*\/\s*(.+?)\s*\/\s*([\d.]+ kbps)(?:\s*\/\s*(.+))?/g,
                /([A-Za-z]+)\s*\/\s*(.*?Audio.*?)\s*\/\s*(\d+\s*kbps)\s*\/\s*(.+)/g
            ];

            bdInfoData.Audio = extractUniqueMatches(
                audioStreamRegexes,
                bdInfoContent,
                (match) => {
                    let codec = '', language = '';

                    // 通过关键字判断 Codec 和 Language 顺序
                    if (match[1].includes('Audio')) {
                        codec = match[1];
                        language = match[2];
                    } else if (match[2].includes('Audio')) {
                        codec = match[2];
                        language = match[1];
                    } else {
                        // 如果都不含 Audio，按照默认顺序分配（容错处理）
                        codec = match[1];
                        language = match[2];
                    }

                    return {
                        Codec: codec || '',
                        Language: language || '',
                        Bitrate: match[3] || '',
                        Description: match[4] || ''
                    };
                },
                (match) => `${match[1]}|${match[2]}|${match[3]}|${match[4]}` // 生成唯一标识符
            );

            // 定义音频编码的优先级（值越大，优先级越高）
            const bdAudioCodecPriority = {
                "DTS:X": 20,
                "Dolby TrueHD/Atmos Audio": 19,
                "Dolby Atmos/TrueHD Audio": 19,
                "DTS-HD Master Audio": 19,
                "Dolby TrueHD Audio": 17,
                "DTS-HD High-Res Audio": 16,
                "DTS Audio": 15,
                "LPCM Audio": 14,
                "PCM": 14,
                "FLAC": 14,
                "Dolby Digital Plus Audio": 13,
                "Dolby Digital Audio": 12,
                "AC-3": 12,
                "AAC": 10,
                "MP3": 9
            };

            // 解析BDInfo音轨信息
            if (bdInfoData.Audio && bdInfoData.Audio.length > 0) {
                // 1. 提取主音轨（第一个音轨）
                const mainAudioTrack = bdInfoData.Audio[0];

                // 提取主音轨声道数
                let mainChannels = 0;
                const mainChannelsMatch = mainAudioTrack.Codec.match(/(\d+\.\d+|\d+)(?=\s*\/|\s*\))/);
                if (mainChannelsMatch) {
                    mainChannels = mainChannelsMatch[1];
                } else if (mainAudioTrack.Description.includes('/')) {
                    // 尝试从 Description 中提取声道信息（第二种格式）
                    const descriptionParts = mainAudioTrack.Description.split('/');
                    for (const part of descriptionParts) {
                        const channelMatch = part.trim().match(/(\d+\.\d+|\d+)/);
                        if (channelMatch) {
                            mainChannels = channelMatch[1];
                            break;
                        }
                    }
                }

                // 2. 找到规格最高的音轨
                let highestQualityTrack = mainAudioTrack; // 默认为主音轨
                let highestPriority = -1;
                let highestChannels = 0;
                let highestBitrate = 0;

                bdInfoData.Audio.forEach(track => {
                    // 提取编码类型
                    let codecName = track.Codec;
                    // 处理第二种格式的编码类型（包含"/"的情况）
                    if (codecName.includes('/')) {
                        codecName = codecName.split('/')[0].trim();
                    }

                    // 获取编码优先级
                    let priority = -1;
                    for (const [key, value] of Object.entries(bdAudioCodecPriority)) {
                        if (codecName.includes(key)) {
                            priority = value;
                            break;
                        }
                    }

                    // 提取声道数
                    let channels = 0;
                    const channelsMatch = track.Codec.match(/(\d+\.\d+|\d+)(?=\s*\/|\s*\))/);
                    if (channelsMatch) {
                        channels = channelsMatch[1];
                    } else if (track.Description.includes('/')) {
                        // 尝试从 Description 中提取声道信息（第二种格式）
                        const descriptionParts = track.Description.split('/');
                        for (const part of descriptionParts) {
                            const channelMatch = part.trim().match(/(\d+\.\d+|\d+)/);
                            if (channelMatch) {
                                channels = channelMatch[1];
                                break;
                            }
                        }
                    }

                    // 提取比特率
                    let bitrate = 0;
                    const bitrateMatch = track.Bitrate.match(/(\d+)/);
                    if (bitrateMatch) {
                        bitrate = parseInt(bitrateMatch[1], 10);
                    }

                    // 比较优先级
                    if (priority > highestPriority ||
                        (priority === highestPriority && channels > highestChannels) ||
                        (priority === highestPriority && channels === highestChannels && bitrate > highestBitrate)) {
                        highestPriority = priority;
                        highestChannels = channels;
                        highestBitrate = bitrate;
                        highestQualityTrack = track;
                    }
                });

                bdInfoData.MainAudioTrack = mainAudioTrack; // 主音轨
                bdInfoData.MainAudioChannels = mainChannels; // 主音轨声道数
                bdInfoData.HighestQualityAudioTrack = highestQualityTrack; // 最高规格音轨
                bdInfoData.HighestQualityAudioChannels = highestChannels; // 最高规格音轨声道数
            }


            // 提取字幕信息
            const subtitleRegexes = [
                /Presentation Graphics\s+([A-Za-z]+)\s+([\d\.]+ kbps)\s*(.*)/g,
                /Subtitle:\s*(.+?) \/ ([\d.]+ kbps)/g
            ];

            bdInfoData.Subtitles = extractUniqueMatches(
                subtitleRegexes,
                bdInfoContent,
                (match) => ({
                    Language: match[1] || '',
                    Bitrate: match[2] || '',
                }),
                (match) => `${match[1]}|${match[2]}` // 生成唯一标识符
            );
            // console.log('调试信息：BDInfo 数据解析完成');

            console.group(`%c------ BDInfo 信息解析 ------`, groupHeaderStyle);
            if (bdInfoData.DiscSize.Original) {
                console.log('%c原盘大小:', keyInfoStyle, `${bdInfoData.DiscSize.Original} (${bdInfoData.DiscSize.Readable})`);
            }
            console.log('%c视频流信息:', keyInfoStyle);
            bdInfoData.VideoFormat.forEach(videoStream => {
                console.log(`编解码器: ${videoStream.Codec}, 比特率: ${videoStream.Bitrate}, 说明: ${videoStream.Description}`);
            });
            console.log('%c音频流信息:', keyInfoStyle, `总数:`, bdInfoData.Audio.length);
            bdInfoData.Audio.forEach(audioStream => {
                console.log(`编解码器: ${audioStream.Codec}, 语言: ${audioStream.Language}, 比特率: ${audioStream.Bitrate}, 说明: ${audioStream.Description}`);
            });
            console.log('%c主音轨:', keyInfoStyle, `编解码器: ${bdInfoData.MainAudioTrack.Codec}, 语言: ${bdInfoData.MainAudioTrack.Language}, 比特率: ${bdInfoData.MainAudioTrack.Bitrate}, 声道数: ${bdInfoData.MainAudioChannels}`);
            console.log('%c最高规格音轨:', keyInfoStyle, `编解码器: ${bdInfoData.HighestQualityAudioTrack.Codec}, 语言: ${bdInfoData.HighestQualityAudioTrack.Language}, 比特率: ${bdInfoData.HighestQualityAudioTrack.Bitrate}, 声道数: ${bdInfoData.HighestQualityAudioChannels}`);
            console.log('%c字幕信息:', keyInfoStyle, `总数:`, bdInfoData.Subtitles.length);
            bdInfoData.Subtitles.forEach(subtitleStream => {
                console.log(`语言: ${subtitleStream.Language}, 比特率: ${subtitleStream.Bitrate}`);
            });
            console.groupEnd();

            return bdInfoData;
        }


        function processInfoFile(infoContent) {
            const infoType = detectInfoType(infoContent);
            // console.log(`调试信息：检测到的信息类型为：${infoType}`);

            switch (infoType) {
                case 'Mediainfo':
                    // Mediainfo处理逻辑
                    isMediainfo = true;
                    const mediaDetails = parseMediainfo(infoContent);

                    // 视频编码判断
                    if (mediaDetails.VideoFormat.includes("HEVC")) {
                        info_encode = 6;  // HEVC
                    } else if (mediaDetails.VideoFormat.includes("AVC")) {
                        info_encode = 1;  // AVC
                    } else if (mediaDetails.VideoFormat.includes("MPEG-2") ||
                        (mediaDetails.VideoFormat.includes("MPEG") && mediaDetails.VideoFormatVersion.includes("Version 2"))) {
                        info_encode = 4;  // MPEG-2
                    } else if (mediaDetails.VideoFormat.includes("VC-1")) {
                        info_encode = 2;  // VC-1
                    } else if (mediaDetails.VideoFormat.includes("AV1")) {
                        info_encode = 7;  // AV1
                    } else {
                        info_encode = 5;  // Other
                    }

                    // 音频编码判断
                    function getAudioCodecValue(audioTrack) {
                        if (audioTrack.includes("DTS:X")) {
                            return 25;  // DTS:X (DTS XLL X)
                        } else if (audioTrack.includes("TrueHD Atmos")) {
                            return 26;  // TrueHD Atmos (MLP FBA 16-ch)
                        } else if (audioTrack.includes("DTS-HD MA") || audioTrack.includes("DTS ES XLL")) {
                            return 19;  // DTS-HD MA (DTS XLL)
                        } else if (audioTrack.includes("TrueHD")) {
                            return 20;  // TrueHD (MLP FBA)
                        } else if (audioTrack.includes("DTS")) {
                            return 3;   // DTS (DTS Digital Surround)
                        } else if (audioTrack.includes("PCM")) {
                            return 21;  // LPCM (Linear Pulse Code Modulation)
                        } else if (audioTrack.includes("FLAC")) {
                            return 1;   // FLAC (Free Lossless Audio Codec)
                        } else if (audioTrack.includes("APE")) {
                            return 2;   // APE (Monkey's Audio)
                        } else if (audioTrack.includes("WavPack")) {
                            return 22;  // WAV (Waveform Audio File Format)
                        } else if (audioTrack.includes("Opus")) {
                            return 27;  // OPUS
                        } else if (audioTrack.includes("AC-3") || audioTrack.includes("E-AC-3")) {
                            return 18;  // DD/AC3 (AC-3/E-AC-3)
                        } else if (audioTrack.includes("AAC")) {
                            return 6;   // AAC (Advanced Audio Codec)
                        } else if (audioTrack.includes("MPEG-4")) {
                            return 24;  // M4A (MPEG-4 Audio)
                        } else if (audioTrack.includes("MPEG Audio 3")) {
                            return 23;  // MP3 (MPEG Audio Layer 3)
                        } else {
                            return 7; // Other
                        }
                    }

                    // 检查主音轨和最高规格音轨是否与 title_audio 匹配
                    if (
                        getAudioCodecValue(mediaDetails?.MainAudioTrack) === title_audio ||
                        getAudioCodecValue(mediaDetails?.HighestQualityAudioTrack) === title_audio
                    ) {
                        info_audio = title_audio;
                        // 添加声道数赋值
                        if (getAudioCodecValue(mediaDetails?.MainAudioTrack) === title_audio) {
                            info_audio_channel = mediaDetails?.MainAudioChannels;
                        } else if (getAudioCodecValue(mediaDetails?.HighestQualityAudioTrack) === title_audio) {
                            info_audio_channel = mediaDetails?.HighestQualityAudioChannels;
                        }
                    } else {
                        const matchedAudio = mediaDetails.Audio.find((audio) => getAudioCodecValue(audio) !== 7);
                        info_audio = matchedAudio ? getAudioCodecValue(matchedAudio) : 7;
                        info_audio_channel = mediaDetails?.MainAudioChannels;
                    }

                    // 分辨率判断
                    if (/1920|1080/.test(mediaDetails.Resolution) &&
                        (mediaDetails.ScanType === "Interlaced" || mediaDetails.ScanType === "MBAFF")) {
                        info_resolution = 2;  // 1080i
                    } else if (/3840|3836|3832|3828|3824|2160/.test(mediaDetails.Resolution)) {
                        info_resolution = 5;  // 4K
                    } else if (/1920|1918|1916|1914|1912|1908|1906|1898|1080/.test(mediaDetails.Resolution)) {
                        info_resolution = 1;  // 1080p
                    } else if (/1280|x720/.test(mediaDetails.Resolution)) {
                        info_resolution = 3;  // 720p
                    } else if (/(720|704|702)x|x(576|540)|480/.test(mediaDetails.Resolution)) {
                        info_resolution = 4;  // 480p
                    } else {
                        info_resolution = 11;  // None
                    }

                    return mediaDetails;

                case 'BDInfo':
                    // BDInfo处理逻辑
                    isBDInfo = true;
                    const bdDetails = parseBDInfo(infoContent);

                    // 视频编码判断
                    if (bdDetails.VideoFormat.some((video) => video.Codec.includes("HEVC"))) {
                        info_encode = 6;  // HEVC
                    } else if (bdDetails.VideoFormat.some((video) => video.Codec.includes("AVC"))) {
                        info_encode = 1;  // AVC
                    } else if (bdDetails.VideoFormat.some((video) => video.Codec.includes("MPEG-2"))) {
                        info_encode = 4;  // MPEG-2
                    } else if (bdDetails.VideoFormat.some((video) => video.Codec.includes("VC-1"))) {
                        info_encode = 2;  // VC-1
                    } else if (bdDetails.VideoFormat.some((video) => video.Codec.includes("AV1"))) {
                        info_encode = 7;  // AV1
                    } else {
                        info_encode = 5;  // Other
                    }

                    // 音频编码判断
                    function getBDAudioCodecValue(audioTrack) {
                        if (audioTrack.includes("DTS:X Master Audio")) {
                            return 25;  // DTS:X (DTS XLL X)
                        } else if (audioTrack.includes("Dolby TrueHD/Atmos Audio") || audioTrack.includes("Dolby Atmos/TrueHD Audio")) {
                            return 26;  // TrueHD Atmos (MLP FBA 16-ch)
                        } else if (audioTrack.includes("DTS-HD Master Audio")) {
                            return 19;  // DTS-HD MA (DTS XLL)
                        } else if (audioTrack.includes("Dolby TrueHD Audio")) {
                            return 20;  // TrueHD (MLP FBA)
                        } else if (audioTrack.includes("DTS Audio") || audioTrack.includes("DTS-HD High-Res Audio")) {
                            return 3;   // DTS (DTS Digital Surround)
                        } else if (audioTrack.includes("PCM Audio")) {
                            return 21;  // LPCM (Linear Pulse Code Modulation)
                        } else if (audioTrack.includes("FLAC")) {
                            return 1;   // FLAC (Free Lossless Audio Codec)
                        } else if (audioTrack.includes("Monkey's Audio")) {
                            return 2;   // APE (Monkey's Audio)
                        } else if (audioTrack.includes("WAV")) {
                            return 22;  // WAV (Waveform Audio File Format)
                        } else if (audioTrack.includes("Opus")) {
                            return 27;  // OPUS
                        } else if (audioTrack.includes("Dolby Digital Audio") || audioTrack.includes("E-AC-3")) {
                            return 18;  // DD/AC3 (Dolby Digital)
                        } else if (audioTrack.includes("AAC")) {
                            return 6;   // AAC (Advanced Audio Codec)
                        } else if (audioTrack.includes("M4A")) {
                            return 24;  // M4A (MPEG-4 Audio)
                        } else if (audioTrack.includes("MP3")) {
                            return 23;  // MP3 (MPEG Audio Layer 3)
                        } else {
                            return 7; // Other
                        }
                    }

                    // 检查主音轨和最高规格音轨是否与 title_audio 匹配
                    const isMainAudioMatch = getBDAudioCodecValue(bdDetails?.MainAudioTrack?.Codec) === title_audio;
                    const isHighestAudioMatch = getBDAudioCodecValue(bdDetails?.HighestQualityAudioTrack?.Codec) === title_audio;

                    if (isMainAudioMatch || isHighestAudioMatch) {
                        info_audio = title_audio;
                        if (isMainAudioMatch && isHighestAudioMatch &&
                            bdDetails?.MainAudioChannels !== bdDetails?.HighestQualityAudioChannels &&
                            title_channel && bdDetails?.Audio.length > 1) {
                            // 当主音轨和最高规格音轨都匹配但声道数不同时，根据标题中的声道信息选择
                            info_audio_channel = title_channel === bdDetails?.MainAudioChannels
                                ? bdDetails?.MainAudioChannels
                                : (title_channel === bdDetails?.HighestQualityAudioChannels
                                    ? bdDetails?.HighestQualityAudioChannels
                                    : bdDetails?.MainAudioChannels);
                        } else {
                            info_audio_channel = isMainAudioMatch
                                ? bdDetails?.MainAudioChannels
                                : bdDetails?.HighestQualityAudioChannels;
                        }
                    } else {
                        const matchedAudio = bdDetails.Audio?.find((audio) => audio?.Codec && getBDAudioCodecValue(audio.Codec) !== 7);
                        info_audio = matchedAudio ? getBDAudioCodecValue(matchedAudio.Codec) : 7;
                        info_audio_channel = bdDetails?.MainAudioChannels;
                    }

                    // 分辨率判断
                    if (bdDetails.VideoFormat.some((video) => video.Description.includes("2160p"))) {
                        info_resolution = 5;  // 4K
                    } else if (bdDetails.VideoFormat.some((video) => video.Description.includes("1080i"))) {
                        info_resolution = 2;  // 1080i
                    } else if (bdDetails.VideoFormat.some((video) => video.Description.includes("1080p"))) {
                        info_resolution = 1;  // 1080p
                    } else if (bdDetails.VideoFormat.some((video) => video.Description.includes("720p"))) {
                        info_resolution = 3;  // 720p
                    } else if (bdDetails.VideoFormat.some((video) => video.Description.includes("480p") || video.Description.includes("480i"))) {
                        info_resolution = 4;  // 480p
                    } else {
                        info_resolution = 11;  // None
                    }

                    return bdDetails;

                default:
                    console.log('调试信息：无法识别的信息类型');
                    return null;
            }
        }
        const info = processInfoFile(infoContent);

        // 标签
        if (Array.isArray(info?.Audio)) {
            const checkLanguage = (text) => {
                if ((/Mandarin|[国台][语配]|国英双|普通话/i.test(text)) && !/多国语/g.test(subtitle)) isMandarin = true;
                if (/Cantonese|粤[语配]|粤英双/i.test(text)) isCantonese = true;
            };
            info.Audio.forEach(audio => {
                if (typeof audio === 'string') {
                    checkLanguage(audio);
                } else if (audio.Description) {
                    checkLanguage(audio.Description);
                }
            });
            if (/国粤/i.test(subtitle)) {
                isMandarin = true;
                isCantonese = true;
            } else {
                checkLanguage(subtitle);
            }
        }

        if (Array.isArray(info?.Subtitles)) {
            const hasChineseSubtitle = info.Subtitles.some(subtitle => {
                if (typeof subtitle === 'string') {
                    return /(Chinese|Cantonese|Mandarin|Simplified|Traditional|chs|cht|[简繁][体中]?|中[文简繁]?|[国粤][语]?|特效)/i.test(subtitle);
                } else if (subtitle.Language) {
                    return subtitle.Language.includes("Chinese");
                }
                return false;
            });
            if (hasChineseSubtitle) {
                isInfoSubtitle = true;
            }
            if ((hasChineseSubtitle || /简[中体繁日韩英]|繁[中体日韩英]|中[字文日韩英]|(双语|特效)(字幕|简繁|SUP)/g.test(subtitle)) && !/外挂|无中字|多国/g.test(subtitle)) {
                isSubtitle = true;
            }
        }

        if (title_type === 13 || title_type === 14) {
            isDIY = true;
        }

        if (
            (Array.isArray(info?.HDR) && info.HDR.some(hdr => hdr.includes("Dolby Vision"))) ||
            (Array.isArray(info?.VideoFormat) && info.VideoFormat.some(format => format?.Description?.includes("Dolby Vision")))
        ) {
            isDV = true;
        }

        if (
            (Array.isArray(info?.HDR) && info.HDR.some(hdr => hdr.includes("HDR10+"))) ||
            (Array.isArray(info?.VideoFormat) && info.VideoFormat.some(format => format?.Description?.includes("HDR10+")))
        ) {
            isHDR10Plus = true;
        }

        if (!isHDR10Plus &&
            (
                (info?.ColorPrimaries?.includes("BT.2020")) ||
                (Array.isArray(info?.HDR) && info.HDR.some(hdr => /HDR10|HDR Vivid/i.test(hdr))) ||
                (Array.isArray(info?.VideoFormat) && info.VideoFormat.some(format => format?.Description && /HDR10|HDR Vivid|BT.2020/i.test(format.Description)))
            )
        ) {
            isHDR10 = true;
        }

        console.group(`%c------ 标题信息解析 ------`, groupHeaderStyle);
        console.log(`%c原标题:`, keyInfoStyle, title);
        console.log(`%c小写标题:`, keyInfoStyle, title_lowercase);
        console.log(`%c影片年份:`, keyInfoStyle, title_year);
        console.log(`%c媒介类型:`, keyInfoStyle, `${type_constant[title_type]}: ${title_type}`);
        console.log(`%c视频编码:`, keyInfoStyle, `${encode_constant[title_encode]}: ${title_encode}`);
        console.log(`%c音频编码:`, keyInfoStyle, `${audio_constant[title_audio]}: ${title_audio}`);
        console.log(`%c音频声道数:`, keyInfoStyle, `${title_channel}`);
        console.log(`%c分辨率:`, keyInfoStyle, `${resolution_constant[title_resolution]}: ${title_resolution}`);
        console.groupEnd();

        console.group(`%c------ 表单信息最终解析 ------`, groupHeaderStyle);
        console.log(`%c副标题:`, keyInfoStyle, subtitle);
        console.log(`%c类型:`, keyInfoStyle, `${cat_constant[cat]}: ${cat}`);
        console.log(`%c媒介类型:`, keyInfoStyle, `${type_constant[type]}: ${type}`);
        console.log(`%c视频编码:`, keyInfoStyle, `${encode_constant[encode]}: ${encode}`);
        console.log(`%c音频编码:`, keyInfoStyle, `${audio_constant[audio]}: ${audio}`);
        console.log(`%c分辨率:`, keyInfoStyle, `${resolution_constant[resolution]}: ${resolution}`);
        console.log(`%c制作组:`, keyInfoStyle, `${group_constant[group]}: ${group}`);
        console.log(`%c做种人数:`, keyInfoStyle, seeders);
        console.groupEnd();

        // 3. FIXME: 校验信息------------------------------------------------------------
        /** 错误提醒框 dom */
        const errorDom = `
    <div
        id="assistant-tooltips"
        style="
            display: inline-block;
            padding: 10px 30px;
            color: white;
            background: red;
            font-weight: bold;
            font-size: 15px;
            border-radius: 5px;"
    >
    </div>`;
        /** 错误 boolean */
        let error = false;
        $('#outer').prepend(errorDom);

        /** 提醒框 dom */
        let warn = false;
        if ((title_warn_no & 1) === 1 ||
            (title_warn_no & 2) === 2 ||
            (title_warn_no & 4) === 4 ||
            (title_warn_no & 8) === 8) {
            warn = true
        }

        if (warn) {
            const warnDom = `
        <div
            id="assistant-tooltips-warn"
            style="
                display: inline-block;
                padding: 10px 30px;
                color: white;
                background: orange;
                font-weight: bold;
                font-size: 15px;
                border-radius: 5px;
                margin-bottom: 10px;"
        >
        </div>`;
            $('#outer').prepend(warnDom + '<br>');
            if ((title_warn_no & 1) === 1) $('#assistant-tooltips-warn').append('主标题中未检测到媒介信息，请人工核查<br>');
            if ((title_warn_no & 2) === 2) $('#assistant-tooltips-warn').append('主标题中未检测到视频编码，请人工核查<br>');
            if ((title_warn_no & 4) === 4) $('#assistant-tooltips-warn').append('主标题中未检测到音频编码，请人工核查<br>');
            if ((title_warn_no & 8) === 8) $('#assistant-tooltips-warn').append('主标题中未检测到分辨率，请人工核查<br>');
        }

        // 通用的 fileList 检查函数
        const checkFileList = (checkFunction, errorMessage, attempts = 0) => {
            if (fileList && Array.isArray(fileList)) {
                if (checkFunction(fileList)) {
                    if (errorMessage) {
                        if ($('#assistant-tooltips').text().includes('此种子未检测到明显错误')) {
                            $('#assistant-tooltips').text('');
                            $('#assistant-tooltips').css('background', 'red');
                        }
                        $('#assistant-tooltips').prepend(errorMessage);
                    }
                }
            } else if (attempts < 50) {
                // 如果 fileList 尚未准备好且尝试次数未达上限，等待 300ms 后再次检查
                setTimeout(() => checkFileList(checkFunction, errorMessage, attempts + 1), 300);
            } else {
                console.warn(`等待文件列表超时，无法完成检查: ${errorMessage || '未知检查'}`);
            }
        };

        // 不被信任的制作组
        if (title_lowercase && title) {
            const detectedKeywords = blackListKeywords
                .filter(keyword => title_lowercase.includes(keyword))
                .map(keyword => {
                    const regex = new RegExp(keyword, "i");
                    const match = title.match(regex);
                    return match ? match[0] : keyword; // 返回原标题中的关键词形式
                });

            const extraKeywords = ["CTRLHD", "CTRLWEB"].filter(keyword => title.includes(keyword)); // 额外检测原标题
            const allDetectedKeywords = [...detectedKeywords, ...extraKeywords]; // 合并所有检测到的关键词

            if (allDetectedKeywords.length > 0) {
                allDetectedKeywords.forEach(originalKeyword => {
                    $('#assistant-tooltips').append(`${originalKeyword} 为不可信的制作组<br>`);
                });
                error = true;
            }
        }

        // 检查是否为公网资源
        if (publishTime && new Date(publishTime) > new Date('2025-05-25 00:00:00') && (isAnimation || isTagAnimation) && !isTagOriginal && [3, 5, 10, 11, 15].includes(type)) {
            if (BTGroup.some(group => title.includes(group))) {
                $('#assistant-tooltips').append('禁止发布公网资源<br>');
                error = true;
            } else if (!BTAnimeGroup.some(group => title.includes(group)) && !PTGroup.some(group => title.includes(group))) {
                $('#assistant-tooltips').append('该种子疑似来自公网站点（名单正在完善，已确认的公网组和PT组联系我修改，查询到少量种子不一定是公网资源，可能是被搬运过去的）<br>');
                error = true;
                const lastDashIndex = title.lastIndexOf('-');
                const presetValue = lastDashIndex !== -1 ? title.substring(lastDashIndex + 1).trim() : title;
                const searchInputHTML = `
                <div style="margin-top: 5px;">
                    <input type="text" id="nyaa-search-input" value="${presetValue}" style="width: 100px;" />
                    <button id="nyaa-search-btn">在 Nyaa 搜索</button>
                </div>
            `;
                $('#assistant-tooltips').append(searchInputHTML);

                $(document).on('click', '#nyaa-search-btn', function () {
                    const query = $('#nyaa-search-input').val();
                    if (query) {
                        window.open(`https://nyaa.si/?q=${encodeURIComponent(query)}`, '_blank');
                    }
                });
            }
        }

        // 检查是否为禁止发布的视频编码格式
        if (/divx|xvid|realvideo/i.test(info.VideoFormat)) {
            $('#assistant-tooltips').append('禁止发布视频编码为 DivX/XviD/RealVideo 的资源<br>');
            error = true;
        }

        // 检查是否将 REMUX 封装为 M2TS 格式
        if ([title_type, type].includes(3)) {
            if (info?.ContainerFormat?.includes('BDAV')) {
                $('#assistant-tooltips').append('禁止发布封装为 M2TS 格式的 REMUX<br>');
                error = true;
            }
            checkFileList(
                (currentFileList) => currentFileList.some(fileName => fileName.toLowerCase().endsWith('.iso')),
                '禁止发布封装为 ISO 格式的 REMUX<br>'
            );
        }

        // 检查种子体积和 BDInfo 中的是否一致
        if ([1, 12, 13, 14].includes(type)) {
            if (size && info?.DiscSize?.Original) {
                // 转换两种大小为字节
                const sizeConverted = sizeConverter(size);
                const discSizeConverted = sizeConverter(info.DiscSize.Original);

                const sizeInBytes = sizeConverted.bytes;
                const discSizeInBytes = discSizeConverted.bytes;

                if (sizeInBytes && discSizeInBytes) {
                    // 比较时允许 2% 的误差
                    const tolerance = Math.max(sizeInBytes, discSizeInBytes) * 0.02;
                    if (Math.abs(sizeInBytes - discSizeInBytes) > tolerance) {
                        $('#assistant-tooltips').append(`种子体积(${size})与 BDInfo(${info.DiscSize.Readable}) 不一致（暂不支持检测多碟）<br>`);
                        error = true;
                    }
                }
            }
        }

        // 检查综艺是否含有国语或者中字
        if ((cat === 403 || isVarietyShow) && uploader !== 'DVp7' && !isTagMandarin && !isTagSubtitle) {
            $('#assistant-tooltips').append('综艺类资源需国语配音或中文字幕（可外挂），至少满足一项方可发布<br>');
            error = true;
        }

        // 检查非工作组成员使用官组信息
        if (
            /(Peasant|User|Nexus|Rainbow|VIP)/.test(level) &&
            (
                /(Audies|ADE|ADWeb|ADAudio|ADeBook|ADMusic)/g.test(title) ||
                group !== 5 ||
                isTagOfficialSeed ||
                isTagOfficialSubtitleGroup
            )
        ) {
            $('#assistant-tooltips').append('非工作组成员禁止使用并选择官组名字或标签<br>');
            error = true;
        }

        // 检查 Info 中是否含有链接
        if (/https?:\/\//g.test(infoContent)) {
            $('#assistant-tooltips').append('Info 中含有链接，请人工核查<br>');
            error = true;
        }

        // 检查 Mediainfo 中的文件名是否存在于文件列表中
        if (info?.CompleteName && [3, 5, 10, 15].includes(type)) {
            checkFileList(
                (currentFileList) => !currentFileList.some(file => file.includes(info.CompleteName)),
                'Mediainfo 中的文件名未在文件列表中找到<br>'
            );
        }

        // 一些常见的音频编码书写错误
        const audioErrors = Object.values(audioEncodingErrorRegexMap).reduce((errorMatches, regex) => {
            const matches = title.match(regex);
            if (matches) errorMatches.push(...matches);
            return errorMatches;
        }, []);
        if (audioErrors.length > 0) {
            $('#assistant-tooltips').append(`主标题音频编码书写错误：${[...new Set(audioErrors)].map(m => m.trim()).join(', ') || ''}<br>`);
            error = true;
        }

        // 主标题分辨率 P 为大写
        if (/(2160|1080|720|576|540|480)P/g.test(title)) {
            $('#assistant-tooltips').append('主标题分辨率 P 修改为小写<br>');
            error = true;
        }

        if (isCheckDoubanImdbYear && title_year) {
            if (doubanYear && imdbYear) {
                if (title_year !== doubanYear && title_year !== imdbYear) {
                    $('#assistant-tooltips').append('主标题年份与 豆瓣 或 IMDb 年份不匹配，请人工核查<br>');
                    error = true;
                }
            } else if (doubanYear) {
                if (title_year !== doubanYear) {
                    $('#assistant-tooltips').append('主标题年份与 豆瓣 年份不匹配，请人工核查<br>');
                    error = true;
                }
            } else if (imdbYear) {
                if (title_year !== imdbYear) {
                    $('#assistant-tooltips').append('主标题年份与 IMDb 年份不匹配，请人工核查<br>');
                    error = true;
                }
            }
        }

        // 电影分类检测主标题是否存在影片年份
        if (cat === 401 && !title_year) {
            $('#assistant-tooltips').append('主标题缺少影片年份<br>');
            error = true;
        }

        const hasSeason = /S\d+/g.test(title);
        // 剧集分类检测主标题是否存在季
        if (cat === 402 && !hasSeason) {
            $('#assistant-tooltips').append('主标题缺少季信息<br>');
            error = true;
        }

        // 综艺，纪录片分类检测主标题是否存在影片年份和季
        if ([403, 406].includes(cat) && !title_year && !hasSeason) {
            $('#assistant-tooltips').append('主标题影片年份和季信息均不存在<br>');
            error = true;
        }

        if ([title_type, type].includes(10) && [title_resolution, resolution, info_resolution].includes(4)) {
            $('#assistant-tooltips').append('此资源为 480p WEB-DL，请查看是否存在其他更高分辨率资源，如果有则禁发此资源<br>');
            error = true;
        }

        if (/ (1 0|2 0|3 0|3 1|4 0|5 0|5 1|7 1)(?![\d]{1})/g.test(title)) {
            $('#assistant-tooltips').append('主标题声道数之间含有空格<br>');
            error = true;
        }

        // 特殊情况处理
        const channelMap = {
            2: "2.0",
            6: "5.1"
        };
        // 如果是特殊映射值则直接使用映射，否则格式化为带小数点的形式
        info_audio_channel = channelMap[info_audio_channel] || (String(info_audio_channel).includes('.') ? String(info_audio_channel) : String(info_audio_channel) + '.0');

        if (title_channel && title_channel !== info_audio_channel) {
            $('#assistant-tooltips').append(`主标题声道数 ${title_channel} 与实际声道数 ${info_audio_channel} 不一致<br>`);
            error = true;
        }

        if (/[\u4e00-\u9fa5]+/g.test(title)) {
            $('#assistant-tooltips').append('主标题不允许存在中文<br>');
            error = true;
        }

        if (title.includes("Pete@HDSky")) {
            $('#assistant-tooltips').append('制作组为 Pete@HDSky，请检查是否含有自混次世代国配音轨<br>');
            error = true;
        }

        if (!subtitle) {
            $('#assistant-tooltips').append('副标题为空<br>');
            error = true;
        } else {
            if (/ARDTU|ATU_Tool|\| A \||自动(发种|转种)/ig.test(subtitle)) {
                $('#assistant-tooltips').append('删除副标题工具相关信息<br>');
                error = true;
            }

            // 检查外挂字幕
            if (subtitle.includes('外挂')) {
                checkFileList(
                    (currentFileList) => !currentFileList.some(fileName => /\.(ass|ssa|srt|sup)$/i.test(fileName)),
                    '种子文件列表中未检测到外挂字幕，请去除副标题相关信息<br>'
                );
            }
        }

        if (isTagSubtitle && !isInfoSubtitle) {
            checkFileList(
                (currentFileList) => currentFileList.some(fileName => /\.(ass|ssa|srt|sup)$/i.test(fileName)),
                '外挂字幕不需要勾选中字标签<br>'
            );
        }

        if (!cat) {
            $('#assistant-tooltips').append('未选择分类<br>');
            error = true;
        }

        if ([401, 402, 409].includes(cat)) {
            if (isMovie && cat !== 401) {
                $('#assistant-tooltips').append('豆瓣 或 IMDb 检测类型为 电影，选择类型为 ' + cat_constant[cat] + '<br>');
                error = true;
            }
            if (isSeries && cat !== 402) {
                $('#assistant-tooltips').append('豆瓣 或 IMDb 检测类型为 剧集，选择类型为 ' + cat_constant[cat] + '<br>');
                error = true;
            }
        }

        // 标签验证

        if (isTagNoRepostAllowed && !isTagOriginal && !isTagOfficialSeed) {
            $('#assistant-tooltips').append('非官种禁转标签，请说明是否为原创<br/>');
            error = true;
        }

        if (isMandarin && !isTagMandarin) {
            $('#assistant-tooltips').append('未选择 国语 标签（此功能测试中，有问题请及时反馈）<br/>');
            error = true;
        }

        if (isCantonese && !isTagCantonese) {
            $('#assistant-tooltips').append('未选择 粤语 标签（此功能测试中，有问题请及时反馈）<br/>');
            error = true;
        }

        if (isSubtitle && !isTagSubtitle) {
            $('#assistant-tooltips').append('未选择 中字 标签（此功能测试中，有问题请及时反馈）<br/>');
            error = true;
        }

        if (isVarietyShow && cat !== 403) {
            $('#assistant-tooltips').append('豆瓣 或 IMDb 检测类型为 综艺，选择类型为 ' + cat_constant[cat] + '<br>');
            error = true;
        }

        if (isDocumentary && cat !== 406) {
            $('#assistant-tooltips').append('豆瓣 或 IMDb 检测类型为 纪录片，选择类型为 ' + cat_constant[cat] + '<br>');
            error = true;
        }

        if (isAnimation && !isTagAnimation) {
            $('#assistant-tooltips').append('豆瓣 或 IMDb 检测为 动画，未选择 动画 标签<br/>');
            error = true;
        } else if (!isAnimation && isTagAnimation) {
            $('#assistant-tooltips').append('选择了 动画 标签，豆瓣 或 IMDb 未识别为 动画<br/>');
            error = true;
        }

        if (isDIY && !isTagDIY) {
            $('#assistant-tooltips').append('未选择 DIY 标签<br/>');
            error = true;
        } else if (!isDIY && isTagDIY) {
            $('#assistant-tooltips').append('选择了 DIY 标签，但未检测到 DIY<br/>');
            error = true;
        }

        if (isTagComplete && isMovie) {
            $('#assistant-tooltips').append('去除 完结 标签<br/>');
            error = true;
        }
        if (!isTagComplete && [402, 403, 406].includes(cat) && /全\s*?[\d一二三四五六七八九十百千]*\s*?[集期]|[全合]集/i.test(subtitle)) {
            $('#assistant-tooltips').append('未选择 完结 标签（此功能测试中，有问题请及时反馈）<br/>');
            error = true;
        }

        if (isDV && !isTagDV) {
            $('#assistant-tooltips').append('未选择 Dolby Vision 标签<br/>');
            error = true;
        } else if (!isDV && isTagDV) {
            $('#assistant-tooltips').append('选择了 Dolby Vision 标签，但未检测到 Dolby Vision<br/>');
            error = true;
        }

        if (isTagHDR10 && isTagHDR10Plus) {
            $('#assistant-tooltips').append('请勿同时选择 HDR10 与 HDR10+ 标签<br/>');
            error = true;
        }

        if (isHDR10Plus && !isTagHDR10Plus) {
            if (isTagHDR10) {
                $('#assistant-tooltips').append('请将 HDR10 标签更换为 HDR10+<br/>');
                error = true;
            } else {
                $('#assistant-tooltips').append('未选择 HDR10+ 标签<br/>');
                error = true;
            }
        } else if (!isHDR10Plus && isTagHDR10Plus) {
            $('#assistant-tooltips').append('选择了 HDR10+ 标签，但未检测到 HDR10+<br/>');
            error = true;
        }

        if (isHDR10 && !isTagHDR10 && !isHDR10Plus) {
            $('#assistant-tooltips').append('未选择 HDR10 标签<br/>');
            error = true;
        } else if (!isHDR10 && isTagHDR10 && !isHDR10Plus) {
            $('#assistant-tooltips').append('选择了 HDR10 标签，但未检测到 HDR10<br/>');
            error = true;
        }

        if (publishTime && new Date(publishTime) > new Date('2025-05-12 00:00:00') && [3, 15].includes(type) && group == 21) {
            const quoteContent = $('#kdescr fieldset').text().trim();
            const hasOriginalMaterial = /(原(始|盘)素材来自|原盘[：:]\s*[^\s·]|原盘来自(?!.*?@Audies))/.test(quoteContent);
            if (!hasOriginalMaterial) {
                $('#assistant-tooltips').append('未按照发布信息模板标注原盘素材来源<br/>');
                error = true;
            }
        }

        const imageCounts = allImages.reduce((acc, image) => {
            acc[image] = (acc[image] || 0) + 1;
            return acc;
        }, {});
        const duplicateImages = Object.keys(imageCounts).filter(image => imageCounts[image] > 1);
        if (duplicateImages.length > 0) {
            $('#assistant-tooltips').append(`存在重复的图片，请检查并删除：<br/>${duplicateImages.join('<br/>')}<br/>`);
            error = true;
        }

        if (hasLinkedImage) {
            $('#assistant-tooltips').append('存在含有超链接的图片（有遗漏的公共图床跟我说声）<br/>');
            error = true;
        }

        //  验证媒介是否一致
        if (!type) {
            $('#assistant-tooltips').append('未选择媒介类型<br>');
            error = true;
        } else {
            if (title_type && title_type !== type) {
                $('#assistant-tooltips').append('标题检测格式为 ' + type_constant[title_type] + '，选择格式为 ' + type_constant[type] + '<br>');
                error = true;
            } else if (isMediainfo && [1, 12, 13, 14].includes(type)) {
                $('#assistant-tooltips').append('原盘需要使用 BDInfo<br/>');
                error = true;
            } else if (!isBDInfo && [1, 12, 13, 14].includes(type)) {
                $('#assistant-tooltips').append('未检测到 BDInfo，请检测媒介类型是否正确<br/>');
                error = true;
            } else if (!isMediainfo && [3, 5, 10, 15].includes(type)) {
                $('#assistant-tooltips').append('未检测到 Mediainfo，请检测媒介类型是否正确<br/>');
                error = true;
            }
        }

        // 验证视频编码是否一致
        if (!encode) {
            $('#assistant-tooltips').append('未选择主视频编码<br>');
            error = true;
        } else {
            if (title_encode !== encode || encode_constant[title_encode] !== encode_constant[info_encode]) {
                $('#assistant-tooltips').append(
                    "标题检测视频编码为: " + encode_constant[title_encode] +
                    "，选择视频编码为: " + encode_constant[encode] +
                    "，info 中检测视频编码为: " + encode_constant[info_encode] + '<br>'
                );
                error = true;
            }
        }

        // 验证音频编码是否一致
        if (!audio) {
            $('#assistant-tooltips').append('未选择主音频编码<br>');
            error = true;
        } else {
            // 特殊情况：如果标题检测为TrueHD(20)，而选择和info都是TrueHD Atmos(26)，视为正确
            const isTrueHDSpecialCase = title_audio === 20 && audio === 26 && info_audio === 26;
            if (!isTrueHDSpecialCase && (title_audio !== audio || audio_constant[title_audio] !== audio_constant[info_audio])) {
                $('#assistant-tooltips').append(
                    "标题检测音频编码为: " + audio_constant[title_audio] +
                    "，选择音频编码为: " + audio_constant[audio] +
                    "，info 中检测音频编码为: " + audio_constant[info_audio] + '<br>'
                );
                error = true;
            }
        }

        // 验证分辨率是否一致
        if (!resolution) {
            $('#assistant-tooltips').append('未选择分辨率<br>');
            error = true;
        } else {
            if (title_resolution !== resolution || resolution_constant[title_resolution] !== resolution_constant[info_resolution]) {
                $('#assistant-tooltips').append(
                    "标题检测分辨率为: " + resolution_constant[title_resolution] +
                    "，选择分辨率为: " + resolution_constant[resolution] +
                    "，info 中检测分辨率为: " + resolution_constant[info_resolution] + '<br>'
                );
                error = true;
            }
        }

        // 验证制作组是否一致
        if (!group) {
            $('#assistant-tooltips').append('未选择制作组<br>');
            error = true;
        } else {
            if (title_group !== group) {
                $('#assistant-tooltips').append(
                    "标题检测制作组为: " + group_constant[title_group] +
                    "，选择制作组为: " + group_constant[group] + '<br>'
                );
                error = true;
            }
        }

        if (seeders == 0) {
            $('#assistant-tooltips').append('做种人数为 0<br>');
            error = true;
        }

        if (error) {
            $('#assistant-tooltips').css('background', 'red');
        } else {
            $('#assistant-tooltips').append('此种子未检测到明显错误');
            $('#assistant-tooltips').css('background', 'green');
        }

        const seedReviewRow = $('#outer td.rowhead').filter(function () {
            return $(this).text() == '种子审核';
        }).parent();
        const scriptReviewRow = seedReviewRow.clone().insertBefore(seedReviewRow).find('td.rowhead').text('脚本审核结果').end();
        const resultCell = scriptReviewRow.find('td:eq(1)').empty();
        const resultContainer = $('<div>').hide();

        const getTooltipsSnapshot = () => {
            const $tip = $('#assistant-tooltips');
            return $tip.length ? $tip.clone().removeAttr('id') : null;
        };

        const refreshResultContainer = () => {
            const snap = getTooltipsSnapshot();
            resultContainer.empty();
            if (snap) resultContainer.append(snap);
        };

        const toggleBtn = $('<button>', {
            css: { margin: '5px' },
            text: '显示结果',
            click: () => {
                const show = !resultContainer.is(':visible');
                if (show) refreshResultContainer();
                resultContainer.toggle(show);
                toggleBtn.text(show ? '关闭结果' : '显示结果');
                GM_setValue('resultVisibility', show);
            }
        });

        const initTooltipsObserver = () => {
            const target = document.getElementById('assistant-tooltips');
            if (!target) return setTimeout(initTooltipsObserver, 500);
            const mo = new MutationObserver(() => {
                if (resultContainer.is(':visible')) refreshResultContainer();
            });
            mo.observe(target, { childList: true });
        };
        initTooltipsObserver();

        resultCell.append(toggleBtn, resultContainer);

        if (GM_getValue('resultVisibility', false)) {
            refreshResultContainer();
            resultContainer.show();
            toggleBtn.text('关闭结果');
        }

        // Tampermonkey 跨标签页同步
        if (typeof GM_addValueChangeListener === 'function') {
            GM_addValueChangeListener('resultVisibility', function (name, oldVal, newVal, remote) {
                if (!remote) return;
                const visible = !!newVal;
                resultContainer.toggle(visible);
                toggleBtn.text(visible ? '关闭结果' : '显示结果');
            });
        }

        const $warningMessageElement = $('.warnedbig');
        if ($warningMessageElement.length) {
            const nextSiblingText = $warningMessageElement.next().text().trim();
            if (nextSiblingText.includes('此种因疑似与以下种子重复')) {
                const idMatch = nextSiblingText.match(/ID:\s*(\d+)/);
                if (idMatch) {
                    const extractedId = idMatch[1];
                    const currentPageId = window.location.href.match(/id=(\d+)/)?.[1];
                    const buttons = [
                        $('<button>', {
                            text: '打开种子页',
                            click: () => window.open(`details.php?id=${extractedId}`, '_blank')
                        }),
                        $('<span>', { css: { display: 'inline-block', width: '20px' } }),
                        $('<button>', {
                            text: '删除此种子(Dupe)',
                            click: () => {
                                if (!confirm('❗ 确定要删除此种子吗？')) return;
                                $.post('torrentCheck.php', {
                                    tid: currentPageId,
                                    checkState: 30,
                                    checkDescription: `此种与 ID=${extractedId} 的种子重复`
                                })
                                    .then(() => $.post('delete.php', {
                                        id: currentPageId,
                                        reasontype: 2,
                                        reason: [`Dupe id = ${extractedId}`, '', '', '']
                                    }))
                                    .then(() => window.location.href = 'offers.php')
                            }
                        }),
                        $('<span>', { css: { display: 'inline-block', width: '20px' } }),
                        $('<button>', {
                            text: '删除旧种子(Repack)',
                            click: () => {
                                if (!confirm('❗ 确定要删除旧种子吗？')) return;
                                $.post('torrentCheck.php', {
                                    tid: extractedId,
                                    checkState: 30,
                                    checkDescription: `此资源已重新打包，ID=${currentPageId}`
                                })
                                    .then(() => $.post('delete.php', {
                                        id: extractedId,
                                        reasontype: 2,
                                        reason: [`Repack id = ${currentPageId}`, '', '', '']
                                    }))
                                    .then(() => window.location.href = 'offers.php')
                            }
                        }),
                        $('<p>')
                    ];
                    buttons.reduce(($prev, $current) => $current.insertAfter($prev), $warningMessageElement.next());
                }
            }
        }

        const defaultCheckList = {
            '分类错误': '资源分类错误，请核对后重新勾选',
            '媒介错误': '资源媒介错误，请核对后重新勾选',
            'encode': '压制作品媒介应为encode',
            'web-dl': '媒介应为web-dl',
            'web-rip': '本站定义rip媒介为encode',
            '264': '编码应为H264',
            '265': '编码应为H265',
            '音频编码': '请根据info修改音频编码',
            '海报': '海报失效或缺失 建议更换图床',
            '截图': '截图失效 建议更换图床',
            '主标中文': '主标题不允许存在中文',
            'PTGen': '请补充影片简介（PTGen）信息',
            '简略quote': '发布组所写的简略视频信息请改用quote代码，并非Mediainfo代码',
            '0day': '主标题请使用0day格式',
            '去除点': '主标题请去除除音频信息以外的点，用空格代替',
            '补media': '请补充Mediainfo信息，并使用[Mediainfo]标签包括。',
            '去DIY标': '该作品非原盘DIY，请去除该标签',
            '补DIY标': '该作品为原盘DIY，请添加该标签',
            '去首发': '首发仅为全网蓝光原盘首发使用，请去除',
            '去官字组': '官字标签仅定义为本站字幕组使用，请去除',
            '去限转': '转载资源请勿使用限转或者禁转标签，若是原资源发布者请说明',
            '动画': '请查看规则，类型选择电影或者剧集并添加动画标签',
            '补HDR': '该资源应包含HDR10标签，请添加',
            '补中字': '含中文字幕，请添加中字标签',
            '补国语': '含国语音轨，请添加国语标签',
            '补杜比视界': '该资源支持杜比视界，请添加DV标签',
            '完结标签': '该资源已完结，请添加完结标签',
            '未完结剧集': '转发未完结剧集需从第一集开始连续转发至完结，请确认后在评论区回复',
            '制作说明': '制作说明请移至海报上方',
            '24音乐频谱图': '24bit音乐请补充任一音轨频谱图',
            '补充log': '补充log',
            '3人或以上用VA': '艺术家3人或以上请用VA',
            '专辑用官方': '专辑名请用官方名字，中文翻译请放到副标题'
        };

        // 初始化时加载用户配置
        let checkList = GM_getValue('customCheckList', defaultCheckList);

        function customTorrentHotkeyPanel() {
            if (document.getElementById('customHotkeyPanel')) return;

            // 小工具函数
            const getEl = (id) => document.getElementById(id);
            const qs = (sel, root = document) => root.querySelector(sel);

            // 创建折叠面板容器
            const panelContainer = document.createElement('div');
            panelContainer.id = 'customHotkeyPanel';
            panelContainer.style.cssText = 'margin-bottom: 10px; width: 900px;';

            // 创建折叠标题栏
            const header = document.createElement('div');
            header.id = 'customPanelHeader';
            header.style.cssText = 'padding: 8px 12px; background: #e9ecef; border: 1px solid #dee2e6; border-radius: 4px 4px 0 0; cursor: pointer; display: flex; justify-content: space-between; align-items: center;';
            header.innerHTML = `
                <span style="font-weight: bold; color: #495057;">🧩 自定义快捷审核信息</span>
                <span id="toggleIcon" style="font-size: 12px; color: #6c757d;">▼ 展开配置</span>
            `;

            // 创建内容面板
            const panel = document.createElement('div');
            panel.id = 'customPanelContent';
            panel.style.cssText = 'padding: 10px; background: #f8f9fa; border: 1px solid #dee2e6; border-top: none; border-radius: 0 0 4px 4px; display: none;';

            panel.innerHTML = `
                <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 6px;">
                    <input type="text" id="newHotkeyName" placeholder="快捷键标题（如：主标中文）"
                           style="flex: 1; padding: 6px 8px; border: 1px solid #ccc; border-radius: 4px;">
                    <input type="text" id="newHotkeyText" placeholder="审核意见（如：主标题不允许包含中文）"
                           style="flex: 2; padding: 6px 8px; border: 1px solid #ccc; border-radius: 4px;">
                    <button id="addCustomHotkey" style="background:#339af0; color:#fff; border:none; padding:6px 12px; border-radius:6px; cursor:pointer;"> 添加 / 修改 </button>
                    <button id="deleteCustomHotkey" style="background:#fa5252; color:#fff; border:none; padding:6px 12px; border-radius:6px; cursor:pointer;"> 删除 </button>
                    <button id="resetCustomHotkey" style="background:#868e96; color:#fff; border:none; padding:6px 12px; border-radius:6px; cursor:pointer;"> 重置 </button>
                </div>
                <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 6px;">
                    <button id="batchEditHotkey" style="background:#28a745; color:#fff; border:none; padding:6px 12px; border-radius:6px; cursor:pointer;"> 📝 批量编辑 </button>
                    <button id="exportHotkey" style="background:#17a2b8; color:#fff; border:none; padding:6px 12px; border-radius:6px; cursor:pointer;"> 📤 导出配置 </button>
                    <button id="importHotkey" style="background:#ffc107; color:#000; border:none; padding:6px 12px; border-radius:6px; cursor:pointer;"> 📥 导入配置 </button>
                </div>
                <div id="batchEditPanel" style="display: none; margin-top: 10px; padding: 10px; background: #f1f3f4; border-radius: 4px;">
                    <h4 style="margin: 0 0 8px 0; color: #495057;">格式: 快捷键标题|审核意见（每行一个）</h4>
                    <textarea id="batchEditTextarea" placeholder="示例：&#10;去DIY标|该作品非原盘DIY，请去除该标签&#10;补DIY标|该作品为原盘DIY，请添加该标签"
                              style="width: 98%; height: 200px; padding: 8px; border: 1px solid #ccc; border-radius: 4px; resize: vertical; font-size: 15px; font-family: monospace;"></textarea>
                    <div style="display: flex; gap: 8px; margin-top: 8px;">
                        <button id="applyBatchEdit" style="background:#28a745; color:#fff; border:none; padding:6px 12px; border-radius:6px; cursor:pointer;"> 应用更改 </button>
                        <button id="cancelBatchEdit" style="background:#6c757d; color:#fff; border:none; padding:6px 12px; border-radius:6px; cursor:pointer;"> 取消 </button>
                        <button id="loadCurrentToBatch" style="background:#007bff; color:#fff; border:none; padding:6px 12px; border-radius:6px; cursor:pointer;"> 加载当前配置 </button>
                    </div>
                </div>
            `;

            // 组装面板
            panelContainer.append(header, panel);

            const iframe = document.querySelector('iframe[src^="/torrentCheck.php"]');
            if (iframe) iframe.parentNode.insertBefore(panelContainer, iframe);

            // 折叠状态控制
            const toggleIcon = getEl('toggleIcon');
            const setCollapsed = (collapsed) => {
                panel.style.display = collapsed ? 'none' : 'block';
                if (toggleIcon) toggleIcon.textContent = collapsed ? '▼ 展开配置' : '▲ 收起配置';
                GM_setValue('customPanelCollapsed', collapsed);
            };
            const collapsed = GM_getValue('customPanelCollapsed', true);
            setCollapsed(collapsed);
            header.addEventListener('click', () => setCollapsed(panel.style.display !== 'none'));

            // 保存原生快捷键快照
            const originalHotkeys = [];
            if (iframe?.contentDocument) {
                const btnsContainer = iframe.contentDocument.getElementById('buttons');
                btnsContainer?.querySelectorAll('button:not([data-custom="true"])').forEach(btn => {
                    originalHotkeys.push({
                        text: btn.textContent.trim(),
                        type: btn.type,
                        className: btn.className,
                        style: btn.style.cssText,
                        onclick: btn.onclick
                    });
                });
            }

            const clearInputs = () => {
                document.getElementById('newHotkeyName').value = '';
                document.getElementById('newHotkeyText').value = '';
            };

            const updateIframe = () => {
                if (iframe?.contentWindow) {
                    iframe.contentWindow.updateCustomHotkeys?.(checkList);
                }
            };
            const persistAndRefresh = () => {
                GM_setValue('customCheckList', checkList);
                updateIframe();
            };

            // Tampermonkey 跨标签页同步
            if (typeof GM_addValueChangeListener === 'function') {
                GM_addValueChangeListener('customCheckList', function (name, oldVal, newVal, remote) {
                    if (!remote) return;
                    checkList = newVal || defaultCheckList;
                    updateIframe();
                });
                GM_addValueChangeListener('customPanelCollapsed', function (name, oldVal, newVal, remote) {
                    if (!remote) return;
                    setCollapsed(!!newVal);
                });
            }

            // 添加/修改快捷键
            document.getElementById('addCustomHotkey').addEventListener('click', () => {
                const name = document.getElementById('newHotkeyName').value.trim();
                const text = document.getElementById('newHotkeyText').value.trim();
                if (!name || !text) return alert('请输入快捷键标题和审核意见！');

                checkList[name] = text;
                persistAndRefresh();
                clearInputs();
            });

            // 删除快捷键
            document.getElementById('deleteCustomHotkey').addEventListener('click', () => {
                const name = document.getElementById('newHotkeyName').value.trim();
                if (!name) return alert('请输入要删除的快捷键标题！');

                if (confirm(`确定删除快捷键 "${name}" 吗？`)) {
                    delete checkList[name];
                    persistAndRefresh();
                    clearInputs();
                }
            });

            // 批量编辑快捷键
            document.getElementById('batchEditHotkey').addEventListener('click', () => {
                const panel = document.getElementById('batchEditPanel');
                const isVisible = panel.style.display === 'block';
                panel.style.display = isVisible ? 'none' : 'block';

                if (!isVisible) {
                    // 自动加载当前配置到批量编辑区域
                    loadCurrentConfigToBatchEdit();
                }
            });

            // 加载当前配置到批量编辑区域
            function loadCurrentConfigToBatchEdit() {
                const textarea = document.getElementById('batchEditTextarea');
                const batchText = Object.entries(checkList)
                    .map(([name, text]) => `${name}|${text}`)
                    .join('\n');
                textarea.value = batchText;
            }

            // 加载当前配置按钮
            document.getElementById('loadCurrentToBatch').addEventListener('click', loadCurrentConfigToBatchEdit);

            // 应用批量编辑
            document.getElementById('applyBatchEdit').addEventListener('click', () => {
                const textarea = document.getElementById('batchEditTextarea');
                const batchText = textarea.value.trim();

                if (!batchText) {
                    alert('批量编辑内容不能为空！');
                    return;
                }

                try {
                    const newCheckList = {};
                    const lines = batchText.split('\n');
                    let errorCount = 0;

                    lines.forEach(line => {
                        const trimmedLine = line.trim();
                        if (!trimmedLine) return; // 跳过空行

                        const parts = trimmedLine.split('|');
                        if (parts.length < 2) {
                            console.warn(`格式错误的行: ${trimmedLine}`);
                            errorCount++;
                            return;
                        }

                        const name = parts[0].trim();
                        const text = parts.slice(1).join('|').trim(); // 支持审核意见中包含|符号

                        if (name && text) {
                            newCheckList[name] = text;
                        }
                    });

                    if (errorCount > 0) {
                        if (!confirm(`检测到 ${errorCount} 行格式错误，是否继续应用正确的部分？`)) {
                            return;
                        }
                    }

                    if (Object.keys(newCheckList).length === 0) {
                        alert('没有有效的快捷键配置！');
                        return;
                    }

                    // 直接使用批量编辑的结果
                    checkList = newCheckList;
                    persistAndRefresh();
                    document.getElementById('batchEditPanel').style.display = 'none';
                    clearInputs();
                    alert(`成功批量更新 ${Object.keys(newCheckList).length} 个快捷键！`);
                } catch (error) {
                    console.error('批量编辑失败:', error);
                    alert('批量编辑失败，请检查格式是否正确！');
                }
            });

            // 取消批量编辑
            document.getElementById('cancelBatchEdit').addEventListener('click', () => {
                document.getElementById('batchEditPanel').style.display = 'none';
            });

            // 导出配置
            document.getElementById('exportHotkey').addEventListener('click', () => {
                try {
                    const chinaTime = new Date(new Date().getTime() + (8 * 60 * 60 * 1000));
                    const exportData = {
                        exportTime: chinaTime.toISOString().replace('T', ' ').split('.')[0],
                        checkList: checkList
                    };
                    const dataStr = JSON.stringify(exportData, null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(dataBlob);
                    link.download = `torrent-check-hotkeys-${chinaTime.toISOString().slice(0, 10)}.json`;
                    link.click();
                    URL.revokeObjectURL(link.href);
                } catch (error) {
                    console.error('导出失败:', error);
                    alert('导出配置失败！');
                }
            });

            // 导入配置
            document.getElementById('importHotkey').addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';

                input.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onload = (event) => {
                        try {
                            const importData = JSON.parse(event.target.result);

                            if (!importData.checkList) {
                                alert('无效的配置文件格式！');
                                return;
                            }

                            if (confirm(`确定要导入 ${Object.keys(importData.checkList).length} 个快捷键配置吗？这将覆盖当前所有配置！`)) {
                                // 直接使用导入的配置
                                checkList = importData.checkList;
                                persistAndRefresh();
                                clearInputs();
                                alert(`成功导入 ${Object.keys(checkList).length} 个快捷键配置！`);
                            }
                        } catch (error) {
                            console.error('导入失败:', error);
                            alert('导入配置失败，请检查文件格式是否正确！');
                        }
                    };

                    reader.readAsText(file);
                });

                input.click();
            });

            // 重置快捷键
            document.getElementById('resetCustomHotkey').addEventListener('click', () => {
                if (!confirm('确定重置所有快捷键吗？这将恢复默认快捷键并清除所有自定义快捷键！')) return;
                if (!confirm('再次确定重置所有快捷键吗？')) return;

                // 重置为默认快捷键
                checkList = { ...defaultCheckList };
                persistAndRefresh();

                if (iframe?.contentDocument) {
                    const btnsContainer = iframe.contentDocument.getElementById('buttons');
                    if (btnsContainer) {
                        btnsContainer.innerHTML = '';
                        originalHotkeys.forEach(orig => {
                            const btn = document.createElement('button');
                            Object.assign(btn, orig);
                            btnsContainer.appendChild(btn);
                        });
                    }
                }

                updateIframe();
                clearInputs();
            });
        }

        // 注入自定义脚本到iframe
        function injectCustomScript(iframe) {
            const script = iframe.contentDocument.createElement('script');
            script.textContent = `
                let customCheckList = ${JSON.stringify(checkList)};
                let defaultProps = null;

                function enhanceExistingHotkeys() {
                    const buttonsContainer = document.getElementById('buttons');
                    if (!buttonsContainer) { setTimeout(enhanceExistingHotkeys, 500); return; }

                    const existingHotkeys = Array.from(buttonsContainer.querySelectorAll('button'));
                    if (!defaultProps && existingHotkeys.length) {
                        defaultProps = {
                            type: existingHotkeys[0].type || 'button',
                            className: existingHotkeys[0].className || '',
                            style: existingHotkeys[0].style.cssText || ''
                        };
                    }

                    buttonsContainer.innerHTML = '';

                    Object.keys(customCheckList).forEach(text => {
                        const newBtn = document.createElement('button');
                        newBtn.textContent = text;

                        const baseline = defaultProps || { type: 'button', className: '', style: '' };
                        Object.assign(newBtn, baseline);
                        newBtn.setAttribute('data-custom', 'true');
                        newBtn.onclick = () => {
                            const textarea = document.getElementById('checkDescription');
                            if (textarea && customCheckList[text]) {
                                textarea.value += customCheckList[text] + "\\r\\n";
                            }
                        };

                        buttonsContainer.appendChild(newBtn);
                    });
                }

                function initializeHotkeySystem() {
                    if (document.readyState === 'loading')
                        document.addEventListener('DOMContentLoaded', enhanceExistingHotkeys);
                    else
                        enhanceExistingHotkeys();
                }

                window.updateCustomHotkeys = function (newCustomList) {
                    customCheckList = Object.assign({}, newCustomList);
                    enhanceExistingHotkeys();
                };

                initializeHotkeySystem();
            `;
            iframe.contentDocument.head.appendChild(script);
        }

        seedReviewRow.find('iframe').on('load', function () {
            // console.log('种子审核面板已加载');
            // 可在此处添加iframe加载后的逻辑
            const iframeDoc = this.contentDocument || this.contentWindow.document;
            const checkDynamicHotkeys = () => {
                const buttonsContainer = iframeDoc.getElementById('buttons');
                if (buttonsContainer && buttonsContainer.children.length > 1) {
                    injectCustomScript(this);
                } else {
                    setTimeout(checkDynamicHotkeys, 100);
                }
            };

            customTorrentHotkeyPanel();
            checkDynamicHotkeys();
        });
    }

    function initTorrents() {
        // 添加样式
        GM_addStyle(` .audience-helper-panel { background: #f8f9fa; border: 1px solid #dee2e6; padding: 15px; margin-bottom: 20px; font-size: 14px; position: relative; } .audience-helper-title { font-weight: bold; margin-bottom: 12px; color: #495057; font-size: 16px; display: flex; align-items: center; gap: 8px; padding-right: 120px; } .audience-helper-controls { display: flex; flex-wrap: wrap; gap: 20px; align-items: center; } .audience-helper-switch { display: flex; align-items: center; gap: 6px; cursor: pointer; } .audience-helper-checkbox { width: 16px; height: 16px; cursor: pointer; } .audience-helper-label { cursor: pointer; user-select: none; white-space: nowrap; } .audience-helper-stats { margin-left: auto; color: #6c757d; font-size: 13px; background: #e9ecef; padding: 4px 8px; border-radius: 3px; } .audience-helper-config { display: none; padding-top: 15px; margin-top: 15px; } .audience-helper-config-toggle { position: absolute; top: 15px; right: 15px; background: #6c757d; border: 1px solid #6c757d; color: white; padding: 1px 10px; border-radius: 3px; cursor: pointer; font-size: 12px; height: 28px; min-width: 80px; } .audience-helper-config-toggle:hover { background: #545b62; border-color: #545b62; } .audience-helper-config-content { background: white; border: 1px solid #dee2e6; border-radius: 4px; padding: 12px; } .audience-helper-config-group { margin-bottom: 15px; } .audience-helper-config-label { display: block; font-weight: 600; margin-bottom: 6px; color: #495057; } .audience-helper-config-input { width: 100%; padding: 8px; border: 1px solid #ced4da; border-radius: 3px; font-size: 13px; font-family: monospace; box-sizing: border-box; } .audience-helper-config-input:focus { outline: none; border-color: #80bdff; box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25); } .audience-helper-config-textarea { min-height: 80px; resize: vertical; } .audience-helper-config-hint { font-size: 12px; color: #6c757d; margin-top: 4px; } .audience-helper-config-actions { display: flex; gap: 10px; margin-top: 10px; align-items: center; } .audience-helper-config-btn { padding: 8px 16px; border: 1px solid #007bff; border-radius: 3px; background: #007bff; color: white; cursor: pointer; font-size: 13px; } .audience-helper-config-btn:hover { background: #0056b3; border-color: #0056b3; } .audience-helper-config-btn.secondary { background: #6c757d; border-color: #6c757d; } .audience-helper-config-btn.secondary:hover { background: #545b62; border-color: #545b62; } .audience-helper-error, .audience-helper-success { font-size: 12px; margin-top: 4px; display: none; } .audience-helper-error { color: #dc3545; } .audience-helper-success { color: #28a745; } .audience-helper-refresh-btn { background: #28a745; border: 1px solid #28a745; color: white; padding: 6px 12px; border-radius: 3px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 4px; height: 28px; } .audience-helper-refresh-btn:hover { background: #218838; border-color: #1e7e34; } `);

        // 默认配置
        const defaultConfig = {
            filters: {
                publisher: { enabled: true, list: [] },
                episode: { enabled: true, regex: 'S\\d+E\\d+' }
            }
        };

        // 工具函数
        const utils = {
            loadConfig() {
                try {
                    const saved = GM_getValue('userConfig');
                    return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(defaultConfig));
                } catch (error) {
                    console.error('加载配置失败:', error);
                    return JSON.parse(JSON.stringify(defaultConfig));
                }
            },

            saveConfig(config) {
                try {
                    GM_setValue('userConfig', JSON.stringify(config));
                    return true;
                } catch (error) {
                    console.error('保存配置失败:', error);
                    alert('保存配置失败，请检查浏览器存储权限。');
                    return false;
                }
            },

            validateRegex(pattern) {
                if (!pattern.trim()) return { valid: true };
                try {
                    new RegExp(pattern, 'i');
                    return { valid: true };
                } catch (error) {
                    return { valid: false, error: error.message };
                }
            },

            showMessage(element, message, isError = false) {
                if (!element) return;

                element.textContent = message;
                element.style.display = 'block';
                element.style.color = isError ? '#dc3545' : '#28a745';

                setTimeout(() => element.style.display = 'none', 5000);
            }
        };

        // 配置管理
        const configManager = {
            config: utils.loadConfig(),

            updateFromUI() {
                const publisherList = document.getElementById('ah-publisher-list').value
                    .split('\n')
                    .map(item => item.trim())
                    .filter(Boolean);

                const regexPattern = document.getElementById('ah-episode-regex').value.trim();

                this.config.filters.publisher.list = publisherList;
                this.config.filters.episode.regex = regexPattern;
                this.config.filters.publisher.enabled = document.getElementById('ah-publisher').checked;
                this.config.filters.episode.enabled = document.getElementById('ah-episode').checked;

                return this.config;
            },

            resetToDefault() {
                if (confirm('确定要恢复默认配置吗？这将丢失当前的所有自定义设置。')) {
                    this.config = JSON.parse(JSON.stringify(defaultConfig));
                    if (utils.saveConfig(this.config)) {
                        this.updateUI();
                        utils.showMessage(document.getElementById('ah-success-msg'),
                            '已恢复默认配置！请刷新网页使配置生效。');
                    }
                }
            },

            updateUI() {
                const { publisher, episode } = this.config.filters;

                document.getElementById('ah-publisher-list').value = publisher.list.join('\n');
                document.getElementById('ah-episode-regex').value = episode.regex;
                document.getElementById('ah-publisher').checked = publisher.enabled;
                document.getElementById('ah-episode').checked = episode.enabled;
            }
        };

        // 过滤逻辑
        const filterEngine = {
            apply() {
                let stats = { publisher: 0, episode: 0, total: 0 };

                document.querySelectorAll("#torrenttable > tbody > tr:not(:first-child)").forEach(row => {
                    const publisher = row.querySelector("td:nth-child(10) > span > a > b")?.textContent?.trim();
                    const title = row.querySelector("td.rowfollow.torrents-box > div.torrents-name > table > tbody > tr > td:nth-child(1) > a > b")?.textContent?.trim();

                    if (!publisher || !title) return;

                    const shouldRemove = this.shouldRemoveTorrent(publisher, title, stats);

                    if (shouldRemove) {
                        row.remove();
                        stats.total++;
                    }
                });

                this.updateStats(stats);
            },

            shouldRemoveTorrent(publisher, title, stats) {
                const { publisher: pubConfig, episode: epConfig } = configManager.config.filters;

                // 发布者过滤
                if (pubConfig.enabled && pubConfig.list.includes(publisher)) {
                    stats.publisher++;
                    return true;
                }

                // 分集过滤
                if (epConfig.enabled && epConfig.regex.trim()) {
                    try {
                        const regex = new RegExp(epConfig.regex, 'i');
                        if (regex.test(title)) {
                            stats.episode++;
                            return true;
                        }
                    } catch (error) {
                        console.error('正则表达式错误:', error);
                    }
                }

                return false;
            },

            updateStats(stats) {
                const element = document.getElementById('ah-stats');
                if (element) {
                    element.textContent = `已过滤发布者 ${stats.publisher} 个，已过滤分集 ${stats.episode} 个，共过滤 ${stats.total} 个`;
                }
            }
        };

        // UI管理
        const uiManager = {
            init() {
                this.insertPanel();
                this.bindEvents();
                filterEngine.apply();
            },

            insertPanel() {
                const target = document.querySelector('.torrents.torrents-table');
                if (!target) return;

                const panel = this.createPanel();
                target.parentNode.insertBefore(panel, target);
            },

            createPanel() {
                const { publisher, episode } = configManager.config.filters;
                const panel = document.createElement('div');
                panel.className = 'audience-helper-panel';
                panel.innerHTML = this.getPanelHTML(publisher, episode);
                return panel;
            },

            getPanelHTML(publisherConfig, episodeConfig) {
                return ` <div class="audience-helper-title">🎯 观众审种小助手</div> <button type="button" class="audience-helper-config-toggle" id="ah-config-toggle">⚙️ 高级配置</button> <div class="audience-helper-controls"> <div class="audience-helper-switch"> <input type="checkbox" id="ah-publisher" class="audience-helper-checkbox" ${publisherConfig.enabled ? 'checked' : ''}> <label for="ah-publisher" class="audience-helper-label">过滤发布者</label> </div> <div class="audience-helper-switch"> <input type="checkbox" id="ah-episode" class="audience-helper-checkbox" ${episodeConfig.enabled ? 'checked' : ''}> <label for="ah-episode" class="audience-helper-label">过滤分集</label> </div> <button type="button" class="audience-helper-refresh-btn" id="ah-refresh-btn">🔄 应用过滤</button> <div class="audience-helper-stats" id="ah-stats">已过滤发布者 0 个，已过滤分集 0 个，共过滤 0 个</div> </div> <div class="audience-helper-config" id="ah-config-container"> <div class="audience-helper-config-content" id="ah-config-content"> <div class="audience-helper-config-group"> <label class="audience-helper-config-label" for="ah-publisher-list">发布者列表（每行一个）</label> <textarea id="ah-publisher-list" class="audience-helper-config-input audience-helper-config-textarea">${publisherConfig.list.join('\n')}</textarea> <div class="audience-helper-config-hint">匹配这些发布者的种子将被过滤</div> <div class="audience-helper-error" id="ah-publisher-error"></div> </div> <div class="audience-helper-config-group"> <label class="audience-helper-config-label" for="ah-episode-regex">分集正则表达式</label> <input type="text" id="ah-episode-regex" class="audience-helper-config-input" value="${episodeConfig.regex}"> <div class="audience-helper-config-hint">匹配此正则表达式的标题将被过滤（不区分大小写），留空则禁用此过滤</div> <div class="audience-helper-error" id="ah-regex-error"></div> </div> <div class="audience-helper-config-actions"> <button type="button" class="audience-helper-config-btn" id="ah-save-config">💾 保存配置</button> <button type="button" class="audience-helper-config-btn secondary" id="ah-reset-config">🔄 恢复默认</button> <div class="audience-helper-success" id="ah-success-msg" style="display: none;"></div> </div> </div> </div> `;
            },

            bindEvents() {
                // 配置面板切换
                document.getElementById('ah-config-toggle').addEventListener('click', this.toggleConfigPanel);

                // 保存配置
                document.getElementById('ah-save-config').addEventListener('click', () => this.saveConfig());

                // 恢复默认
                document.getElementById('ah-reset-config').addEventListener('click', () => configManager.resetToDefault());

                // 刷新应用
                document.getElementById('ah-refresh-btn').addEventListener('click', this.refreshPage);

                // 开关变化
                document.getElementById('ah-publisher').addEventListener('change', (e) => this.onToggleChange('publisher', e.target.checked));
                document.getElementById('ah-episode').addEventListener('change', (e) => this.onToggleChange('episode', e.target.checked));
            },

            toggleConfigPanel() {
                const container = document.getElementById('ah-config-container');
                const toggle = document.getElementById('ah-config-toggle');
                const isVisible = container.style.display === 'block';

                container.style.display = isVisible ? 'none' : 'block';
                toggle.textContent = isVisible ? '⚙️ 高级配置' : '✖️ 收起配置';
            },

            saveConfig() {
                const regexPattern = document.getElementById('ah-episode-regex').value.trim();
                const validation = utils.validateRegex(regexPattern);

                if (!validation.valid) {
                    utils.showMessage(document.getElementById('ah-regex-error'),
                        `无效的正则表达式: ${validation.error}`, true);
                    return;
                }

                const newConfig = configManager.updateFromUI();

                if (utils.saveConfig(newConfig)) {
                    utils.showMessage(document.getElementById('ah-success-msg'),
                        '配置已保存！请刷新网页使配置生效。');
                    this.hideErrors();
                }
            },

            onToggleChange(type, enabled) {
                configManager.config.filters[type].enabled = enabled;
                utils.saveConfig(configManager.config);
            },

            refreshPage() {
                configManager.updateFromUI();
                utils.saveConfig(configManager.config);
                window.location.reload();
            },

            hideErrors() {
                document.querySelectorAll('.audience-helper-error').forEach(el => {
                    el.style.display = 'none';
                });
            }
        };

        // 初始化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => uiManager.init());
        } else {
            uiManager.init();
        }
    }
})();