// ==UserScript==
// @name         YouTube 关键词屏蔽（智能转换）
// @namespace    https://greasyfork.org/users/1171320
// @version      1.0
// @description  可自定义屏蔽包含指定关键词的视频、评论和相关视频。智能区分大小写、简繁体，比如输入apple同时屏蔽Apple，输入鼠标同时屏蔽滑鼠，输入台湾同时屏蔽台灣。 YouTube Keyword Blocker，Videos, comments and related videos containing specified keywords can be customized to be blocked. Intelligent case-sensitive, simplified and traditional Chinese, for example, typing apple will block Apple.
// @author       yzcjd
// @author2     Lama AI 辅助
// @match        *://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528873/YouTube%20%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD%EF%BC%88%E6%99%BA%E8%83%BD%E8%BD%AC%E6%8D%A2%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/528873/YouTube%20%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD%EF%BC%88%E6%99%BA%E8%83%BD%E8%BD%AC%E6%8D%A2%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认关键词列表
    let keywords = [];

    // 简繁体转换映射（可扩展）
    const simplifiedToTraditional = {
        "鼠标": "滑鼠",
        "台湾": "台灣",
        "中华": "中華",
        '香烟袅袅':'香煙裊裊',
        '袅袅香烟':'裊裊香煙',
        '补丁':'補靪',
        '老挝':'寮國',
        '沈阳':'瀋陽',
        '战栗':'顫慄',
        '豆蔻':'荳蔻',
        '累累':'纍纍',
        '阿里':'阿里',
        '跟斗':'觔斗',
        '筋斗':'筋斗',
        '折冲':'折衝',
        '梁折':'樑折',
        '松干':'松幹',
        '家伙':'傢伙',
        '伙夫':'伙伕',
        '游斗':'游鬥',
        '回游':'迴游',
        '云游':'雲遊',
        '云宵':'雲霄',
        '考卷发':'考卷發',
        '发卷':'髮卷',
        "烟卷":"菸卷",
        "连卷":"連卷",
        '鼠标':'滑鼠',
        'U盘':'隨身碟',
        '硬盘':'硬碟',
        '磁盘':'磁碟',
        '软件':'軟體',
        '操作系统':'作業系統',
        '文件系统':'檔案系統',
        '笔记本':'筆記型電腦',
        '台式机':'桌上型電腦',
        '网络':'網路',
        '打印':'列印',
        '复印':'影印',
        '充电宝':'行動電源',
        '排插':'延長綫',
        '程序':'程式',
        '光盘':'光碟',
        '音频':'音訊',
        '屏幕':'熒幕',
        '卸载':'解除安裝',
        '文件夹':'檔案夾',
        '局域网':'區域網路',
        '服务器':'伺服器',
        '打伞':'撐傘',
        '洗面奶':'洗面乳',
        '洗发水':'洗髮乳',
        '打底裤':'内搭褲',
        '电饭煲':'電鍋',
        '发卡':'髮夾',
        '聊天群':'聊天視窗',
        '普通话':'國語',
        '简历':'履歷',
        '公交车':'公車',
        '打车':'叫車',
        '出租车':'計程車',
        '地铁':'捷運',
        '自行车':'脚踏車',
        '摩托车':'機車',
        '巴士':'客運',
        '奔驰':'賓士',
        '挺好的':'滿好的',
        '牛逼':'厲害',
        '左拐':'左轉',
        '竖的':'直的',
        '让一下':'借過',
        '凉水':'冰水',
        '打包':'外帶',
        '外卖':'外送',
        '很火':'很紅',
        '宾馆':'飯店',
        '旅馆':'賓館',
        '包间':'包廂',
        '卫生间':'化妝室',
        '幼儿园':'幼稚園',
        '公安局':'警察局',
        '饭店':'餐廳',
        '酒店':'飯店',
        '高校':'大學',
        '写字楼':'辦公大樓',
        '换乘站':'轉運站',
        '豆腐脑':'豆花',
        '菠萝':'鳳梨',
        '薯片':'洋芋片',
        '土豆':'馬鈴薯',
        '花生':'土豆',
        '芝士':'起司',
        '猕猴桃':'奇異果',
        '盒饭':'便當',
        '夜宵':'宵夜',
        '金枪鱼':'鮪魚',
        '三文鱼':'鮭魚',
        '番石榴':'芭樂',
        '冰激淋':'冰淇淋',
        '冰棍':'冰棒',
        '快餐':'速食',
        '格斗':'挌鬥',
        '西红柿':'番茄',
        '西兰花':'花椰菜',
        '创可贴':'OK綳',
        '输液':'打點滴',
        '献血':'捐血',
        'B超':'超音波檢查',
        '疯牛病':'狂牛病',
        '台球':'撞球',
        '乒乓球':'桌球',
        '自由泳':'自由式',
        '蛙泳':'蛙式',
        '初中生':'國中生',
        '本科生':'大學生',
        '程序员':'程式設計師',
        '传销':'直銷',
        '宇航员':'太空人',
        '超声波':'超音波',
        '北京时间':'中原標準時間',
        '保质期':'保存期限',
        '甲肝':'A肝',
        '乙肝':'B肝',
        '丙肝':'C肝',
        '塑料':'塑膠',
        '够不到':'搆不到',
        '够不着':'搆不着',
        '舞娘':'舞孃',
        '秋千':'鞦韆',
        '拐杖':'枴杖',
        '剩余':'賸餘',
        '胡同':'衚衕',
        '个旧':'箇舊',
        '朱砂':'硃砂',
        '知识产权':'智慧財產權'
    };

    // 从本地存储加载关键词
    function loadKeywords() {
        const storedKeywords = localStorage.getItem('youtubeBlockKeywords');
        if (storedKeywords) {
            keywords = JSON.parse(storedKeywords);
        }
    }

    // 保存关键词到本地存储
    function saveKeywords() {
        localStorage.setItem('youtubeBlockKeywords', JSON.stringify(keywords));
    }

    // 将关键词扩展为简繁体形式，并转为小写
    function expandKeywords(keywordList) {
        const expandedKeywords = new Set();
        keywordList.forEach(keyword => {
            expandedKeywords.add(keyword.toLowerCase()); // 添加原始关键词（小写）
            for (const [key, value] of Object.entries(simplifiedToTraditional)) {
                if (key === keyword) expandedKeywords.add(value.toLowerCase());
                if (value === keyword) expandedKeywords.add(key.toLowerCase());
            }
        });
        return Array.from(expandedKeywords);
    }

    // 检查元素是否包含关键词
    function containsKeywords(text) {
        const lowerText = text.toLowerCase();
        return keywords.some(keyword => lowerText.includes(keyword));
    }

    // 移除包含关键词的元素
    function removeElements() {
        // 移除视频
        document.querySelectorAll('ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, ytd-rich-item-renderer').forEach(video => {
            const titleElement = video.querySelector('#video-title') || video.querySelector('.title');
            const title = titleElement?.textContent || '';
            if (containsKeywords(title)) {
                video.remove();
            }
        });

        // 移除评论
        document.querySelectorAll('ytd-comment-thread-renderer').forEach(comment => {
            const commentTextElement = comment.querySelector('#content-text');
            const commentText = commentTextElement?.textContent || '';
            if (containsKeywords(commentText)) {
                comment.remove();
            }
        });

        // 移除相关视频
        document.querySelectorAll('ytd-compact-video-renderer').forEach(relatedVideo => {
            const relatedTitleElement = relatedVideo.querySelector('#video-title') || relatedVideo.querySelector('.title');
            const relatedTitle = relatedTitleElement?.textContent || '';
            if (containsKeywords(relatedTitle)) {
                relatedVideo.remove();
            }
        });

        // 移除首页后的视频，保留空白区域
        document.querySelectorAll('ytd-rich-item-renderer').forEach(homeVideo => {
            const homeTitleElement = homeVideo.querySelector('#video-title') || homeVideo.querySelector('.title');
            const homeTitle = homeTitleElement?.textContent || '';
            if (containsKeywords(homeTitle)) {
                homeVideo.style.display = 'none'; // 不完全移除，留空白
            }
        });
    }

    // 创建设置关键词的按钮
    function createSettingsButton() {
        const button = document.createElement('button');
        button.textContent = 'keyword';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '380';
        button.style.padding = '5px 10px';
        button.style.backgroundColor = '#f0768b';
        button.style.color = '#f5fffa';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', () => {
            const input = prompt('屏蔽词（英文逗号分割 "," Comma separated）:', keywords.join(', '));
            if (input !== null) {
                const inputKeywords = input.split(',').map(word => word.trim()).filter(word => word);
                keywords = expandKeywords(inputKeywords); // 扩展关键词
                saveKeywords();
                removeElements();
            }
        });

        document.body.appendChild(button);
    }

    // 页面加载后执行
    window.addEventListener('load', () => {
        loadKeywords();
        keywords = expandKeywords(keywords); // 扩展加载的关键词
        createSettingsButton();
        removeElements();

        // 使用 MutationObserver 监听动态加载的内容
        const observer = new MutationObserver(removeElements);
        observer.observe(document.body, { childList: true, subtree: true });
    });

})();