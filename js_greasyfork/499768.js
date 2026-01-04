// ==UserScript==
// @name              Game Jolt Chinese Translation
// @name:zh-CN        Game Jolt 中文翻译
// @namespace         http://tampermonkey.net/
// @version           0.1.2
// @icon              https://s.gjcdn.net/img/favicon.png
// @description       Adds Chinese language to Game Jolt.
// @description:zh-CN 将中文添加到Game Jolt.
// @author            QigongBea气功豆
// @match             https://gamejolt.com/*
// @match             https://*.gamejolt.com/*
// @grant             none
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/499768/Game%20Jolt%20Chinese%20Translation.user.js
// @updateURL https://update.greasyfork.org/scripts/499768/Game%20Jolt%20Chinese%20Translation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const fonts = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        'https://fonts.googleapis.com/css2?family=Fira+Sans+Condensed:wght@600&display=swap'
    ];

    fonts.forEach(href => {
        const link = document.createElement('link');
        link.href = href;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    });

    const style = document.createElement('style');
    style.textContent = `
        @font-face {
            font-family: '未来荧黑 Condensed';
            src: url("https://gj-cn-font.neocities.org/GlowSansSC-Condensed-Regular.otf");
        }
        @font-face {
            font-family: 'Plangothic P1';
            src: url("https://gj-cn-font.neocities.org/PlangothicP1-Regular.ttf");
        }
        @font-face {
            font-family: 'Plangothic P2';
            src: url("https://gj-cn-font.neocities.org/PlangothicP2-Regular.ttf");
        }
        body {
            font-family: '思源黑体', 'Plangothic P1', 'Plangothic P2', '微软雅黑','Microsoft Yahei', sans-serif !important;
        }
        .use-fira {
            font-family: '未来荧黑 Condensed', 'Fira Sans Condensed', 'Plangothic P1','Plangothic P2','思源黑体','微软雅黑','Microsoft Yahei', sans-serif !important;
        }
    `;

    document.head.appendChild(style);

    const replacements =
        [
            {
                selector: 'span.loading-label',
                oldText: 'Loading your chats...',
                newText: '聊天功能加载中...'
            },
            {
                selector: 'span._info.help-inline > span[data-v-acce6d48][style*="margin-right: 12px;"] > span[data-v-acce6d48]',
                oldText: 'loading...',
                newText: '加载中...'
            },
            {
                selector: 'span',
                oldText: 'Loading...',
                newText: '加载中...'
            },
            {
                selector: 'span',
                oldText: 'LOADING...',
                newText: '加载中...'
            },
            {
                selector: 'div.-header-lead-text.-main-header-text',
                oldText: 'Become a Game Jolt Creator',
                newText: '成为一个Game Jolt创作者'
            },
            {
                selector: 'div.sticker-charge-tooltip > p > span, div.sticker-charge-tooltip > div > span',
                oldText: 'Complete daily quests to fill your charge orbs. Each day you miss a daily quest, your charge goes down.',
                newText: '完成每日任务来填充您的能量球。每错过一个日常任务，您的能量值就会下降。'
            },
            {
                selector: 'h4.-charge-text > span:first-child',
                oldText: 'Charge',
                newText: '能量值'
            },
            {
                selector: 'section.section > div',
                oldText: 'Objectives',
                newText: '目标'
            },
            {
                selector: 'section.section > div',
                oldText: 'Rewards',
                newText: '奖励'
            },
            {
                selector: 'div.-details',
                oldText: 'Like the post linked in the quest description',
                newText: '为任务描述中链接的帖子点赞'
            },
            {
                selector: 'div.text-center > div',
                oldText: 'DAILY QUEST',
                newText: '每日任务'
            },
            {
                selector: 'div.text-center > div',
                oldText: 'WEEKLY QUEST',
                newText: '每周任务'
            },
            {
                selector: 'div.text-center > div',
                oldText: 'WORLD EVENT',
                newText: '全球事件'
            },
            {
                selector: 'h4',
                oldText: 'Daily Quests',
                newText: '每日任务'
            },
            {
                selector: 'div._subheading',
                oldText: 'Daily Quests',
                newText: '每日任务'
            },
            {
                selector: 'span.user-dogtag.tag.tag-highlight',
                oldText: 'Dev',
                newText: '开发者'
            },
            {
                selector: 'span.user-dogtag.tag.tag-highlight',
                oldText: 'GMR',
                newText: '玩家'
            },
            {
                selector: 'span.user-dogtag.tag.tag-highlight',
                oldText: 'MOD',
                newText: '管理员'
            },
            {
                selector: 'span.user-dogtag.tag.user-dogtag-guy',
                oldText: 'GUY',
                newText: '人类'
            },
            {
                selector: 'span.user-dogtag.tag.tag-highlight',
                oldText: 'ELF',
                newText: '精灵'
            },
            {
                selector: 'span.user-dogtag.tag.tag-highlight',
                oldText: 'BUG',
                newText: '测试员'
            },
            {
                selector: 'span.user-dogtag.tag.tag-highlight',
                oldText: 'She / Her',
                newText: '她'
            },
            // {
            //     selector: 'span.user-dogtag.tag.tag-highlight',
            //     oldText: 'Her',
            //     newText: ''
            // },
            {
                selector: 'span.user-dogtag.tag.tag-highlight',
                oldText: 'He / Him',
                newText: '他'
            },
            // {
            //     selector: 'span.user-dogtag.tag.tag-highlight',
            //     oldText: 'Him',
            //     newText: ''
            // },
            {
                selector: 'span.user-dogtag.tag.tag-highlight',
                oldText: 'They / Them',
                newText: '它'
            },
            // {
            //     selector: 'span.user-dogtag.tag.tag-highlight',
            //     oldText: 'Them',
            //     newText: ''
            // },
            {
                selector: 'span.tag.tag-highlight',
                oldText: 'Follows you',
                newText: '您的粉丝'
            },
            {
                selector: 'span.tag.tag-highlight',
                oldText: 'Friend',
                newText: '朋友'
            },
            {
                selector: 'span.tag',
                oldText: 'Offline',
                newText: '离线'
            },
            {
                selector: 'span.tag.tag-highlight',
                oldText: 'Online',
                newText: '在线'
            },
            {
                selector: 'nav#shell-top-nav a strong',
                oldText: 'Discover',
                newText: '探索'
            },
            {
                selector: 'div.-member-counts a',
                oldText: 'members',
                newText: '成员'
            },
            {
                selector: 'nav.-menu a span',
                oldText: 'Following',
                newText: '正在关注'
            },
            {
                selector: 'nav.-menu a span',
                oldText: 'For You',
                newText: '个性化推荐'
            },
            {
                selector: 'div.-username',
                oldText: 'Hey',
                newText: '嘿, '
            },
            {
                selector: 'div.-input',
                oldText: 'So, what\'s on your mind?',
                newText: '那，您在想什么？'
            },
            {
                selector: 'div.-input',
                oldText: 'Share your creations!',
                newText: '分享您的作品！'
            },
            {
                selector: 'nav#shell-top-nav a strong',
                oldText: 'Store',
                newText: '商店'
            },
            {
                selector: 'div.-message',
                oldText: 'Game Jolt\'s Store is an open platform to share your games with the world.',
                newText: 'Game Jolt的商店是一个开放的平台，用于与全球分享您的游戏。'
            },
            {
                selector: 'label[for="search-input-1"] span',
                oldText: 'Search',
                newText: '搜索'
            },
            {
                selector: 'input#search-input-1',
                oldText: 'Search',
                newText: '搜索',
                attr: 'placeholder'
            },
            {
                selector: 'input.form-control',
                oldText: 'Filter...',
                newText: '筛选...',
                attr: 'placeholder'
            },
            {
                selector: 'input.form-control',
                oldText: 'Filter playlists...',
                newText: '筛选游玩列表...',
                attr: 'placeholder'
            },
            {
                selector: 'input.form-control',
                oldText: 'Email',
                newText: '电子邮件',
                attr: 'placeholder'
            },
            {
                selector: 'input.form-control',
                oldText: 'Username',
                newText: '用户名',
                attr: 'placeholder'
            },
            {
                selector: 'input.form-control',
                oldText: 'Password',
                newText: '密码',
                attr: 'placeholder'
            },
            {
                selector: 'div.-hero-text',
                oldText: 'Join a growing community of creators and gamers from around the world!',
                newText: '加入一个由全球创作者和游戏玩家组成的日益壮大的社区！'
            },
            {
                selector: 'span',
                oldText: 'Sign up with Google',
                newText: '用Google注册'
            },
            {
                selector: 'div.auth-line-thru',
                oldText: 'or',
                newText: '或者'
            },
            {
                selector: 'a',
                oldText: 'Get App',
                newText: '下载App'
            },
            {
                selector: 'h5.section-header',
                oldText: 'Games',
                newText: '游戏'
            },
            {
                selector: 'h5.section-header',
                oldText: 'Collaborators',
                newText: '合作者'
            },
            {
                selector: 'span',
                oldText: 'Close',
                newText: '关闭'
            },
            {
                selector: 'a',
                oldText: 'Log in',
                newText: '登录'
            },
            {
                selector: 'a',
                oldText: 'Sign up',
                newText: '注册'
            },
            {
                selector: 'div.use-fira',
                oldText: 'Joltbux',
                newText: '簸币',
                addClass: 'use-fira'
            },
            {
                selector: 'div.use-fira',
                oldText: 'Coins',
                newText: '硬币',
                addClass: 'use-fira'
            },
            {
                selector: 'div.loading-fade-content > div > a > div > div > div',
                oldText: 'Joltbux',
                newText: '簸币'
            },
            {
                selector: 'div.use-fira',
                oldText: 'Coins',
                newText: '硬币'
            },
            {
                selector: 'div.fill-offset > h2',
                oldText: 'Pride Month 2024',
                newText: '2024年LGBT骄傲月'
            },
            {
                selector: 'div.tooltip-inner',
                oldText: 'Notifications',
                newText: '通知'
            },
            {
                selector: '.timeline-list-item-title, .timeline-list-item-meta',
                oldText: 'replied to your comment on',
                newText: '回复了您在'
            },
            {
                selector: '.timeline-list-item-title, .timeline-list-item-meta',
                oldText: '.',
                newText: '的评论。'
            },
            {
                selector: 'div.tooltip-inner',
                oldText: 'Friend Requests',
                newText: '好友申请'
            },
            {
                selector: 'div.sticker-charge-tooltip > p > span, div.sticker-charge-tooltip > div > span',
                oldText: 'Once all your charge orbs are full, you can support your favorite Game Jolt Creators by giving them a charged sticker! Every charged sticker uses 2 charge orbs and puts 💰💰💰 in their IRL pockets.',
                newText: '一旦您的能量球满电，您就可以为您喜欢的Game Jolt创作者送上充电贴纸以示支持！每张充电贴纸会消耗2个能量球，并使他们现实中的口袋充满💰💰💰。'
            },
            {
                selector: 'span',
                oldText: 'Learn more',
                newText: '了解更多'
            },
            {
                selector: 'span.text-muted',
                oldText: /(\d+)h/g,
                newText: '$1 时'
            },
            {
                selector: 'span.text-muted',
                oldText: /(\d+)w/g,
                newText: '$1 周'
            },
            {
                selector: 'span.text-muted',
                oldText: /(\d+)d/g,
                newText: '$1 天'
            },
            {
                selector: 'a.link-unstyled > span',
                oldText: /(\d+) minute\b/g,
                newText: '$1 分钟以前'
            },
            {
                selector: 'a.link-unstyled > span',
                oldText: /(\d+) minutes/g,
                newText: '$1 分钟以前'
            },
            {
                selector: 'a.link-unstyled > span',
                oldText: /(\d+) second\b/g,
                newText: '$1 秒以前'
            },
            {
                selector: 'a.link-unstyled > span',
                oldText: /(\d+) seconds/g,
                newText: '$1 秒以前'
            },
            {
                selector: 'a.link-unstyled > span',
                oldText: /(\d+) hour\b/g,
                newText: '$1 小时以前'
            },
            {
                selector: 'a.link-unstyled > span',
                oldText: /(\d+) hours/g,
                newText: '$1 小时以前'
            },
            {
                selector: 'a.link-unstyled > span',
                oldText: /(\d+) day\b/g,
                newText: '$1 天以前'
            },
            {
                selector: 'a.link-unstyled > span',
                oldText: /(\d+) days/g,
                newText: '$1 天以前'
            },
            {
                selector: 'a.link-unstyled > span',
                oldText: /(\d+) month\b/g,
                newText: '$1 个月以前'
            },
            {
                selector: 'a.link-unstyled > span',
                oldText: /(\d+) months/g,
                newText: '$1 个月以前'
            },
            {
                selector: 'a.link-unstyled > span',
                oldText: /(\d+) year\b/g,
                newText: '$1 年以前'
            },
            {
                selector: 'a.link-unstyled > span',
                oldText: /(\d+) years/g,
                newText: '$1 年以前'
            },
            {
                selector: 'div._subheading',
                oldText: '',
                newText: '',
                addClass: 'use-fira'
            },
            {
                selector: 'div[style="Staatliches"]',
                oldText: '',
                newText: '',
                addClass: 'use-fira'
            },
            {
                selector: 'div._details > div',
                oldText: '',
                newText: '',
                addClass: 'use-fira'
            },
            {
                selector: 'div.fill-offset > h2',
                oldText: '',
                newText: '',
                addClass: 'use-fira'
            },
            {
                selector: 'div.text-center > div',
                oldText: 'Like a post with 100 or more likes on it',
                newText: '给一个至少100赞的帖子点赞'
            },
            {
                selector: 'div._details > div',
                oldText: 'Like a post with 100 or more likes on it',
                newText: '给一个至少100赞的帖子点赞'
            },
            {
                selector: 'div.content-viewer.quest-stage-description-content p span',
                oldText: 'Though a multitude, our hearts beat as one! Lend your support! Let\'s vanquish the darkness!',
                newText: '尽管人数众多，但我们团结一心！给我们支持！让我们战胜黑暗！'
            },
            {
                selector: 'div.text-center > div',
                oldText: 'Gift a sticker pack',
                newText: '赠送一个贴纸包'
            },
            {
                selector: 'div._details > div',
                oldText: 'Gift a sticker pack',
                newText: '赠送一个贴纸包'
            },
            {
                selector: 'div.content-viewer.quest-stage-description-content p span',
                oldText: 'Give your friend the gift of stickers!',
                newText: '给您的朋友们一包贴纸！'
            },
            {
                selector: 'div.text-center > div',
                oldText: 'React to 5 different comments',
                newText: '回复5条不同的评论'
            },
            {
                selector: 'div._details > div',
                oldText: 'React to 5 different comments',
                newText: '回复5条不同的评论'
            },
            {
                selector: 'div.content-viewer.quest-stage-description-content p span',
                oldText: 'Anyone can react to a comment. Can you react to 5 different ones?',
                newText: '人人都能回评论。您能回复5条不同的吗？'
            },
            {
                selector: 'div._subheading[data-v-48931930]',
                oldText: 'Active Quests',
                newText: '当前任务'
            },
            {
                selector: 'div._subheading[data-v-48931930]',
                oldText: 'New Quests',
                newText: '新任务'
            },
            {
                selector: 'div._title[data-v-918665b5]',
                oldText: 'Fan Art Friday:',
                newText: '周五同人画：'
            },
            {
                selector: 'div.text-center > div',
                oldText: 'Fan Art Friday:',
                newText: '周五同人画：'
            },
            {
                selector: 'div.text-center > div',
                oldText: 'Complete 10 daily quests',
                newText: '完成10个每日任务'
            },
            {
                selector: 'div._details > div',
                oldText: 'Complete 10 daily quests',
                newText: '完成10个每日任务'
            },
            {
                selector: 'div.text-center > div',
                oldText: 'A Transmission From Beyond the Stars',
                newText: '星际信号'
            },
            {
                selector: 'div._details > div',
                oldText: 'A Transmission From Beyond the Stars',
                newText: '星际信号'
            },
            {
                selector: 'div.content-viewer.quest-stage-description-content p span',
                oldText: 'You\'ve received a transmission from beyond the stars! An alien diplomat wants to introduce themselves to Earthlings.',
                newText: '您收到了来自星际的信号！一位外星外交官希望向地球人进行自我介绍。'
            },
            {
                selector: 'div.content-viewer.quest-stage-description-content p span',
                oldText: 'Send the alien our message of good will by liking',
                newText: '为外星人点赞以示友好'
            },
            {
                selector: 'div.content-viewer.quest-stage-description-content p span',
                oldText: 'this post',
                newText: '这个帖子'
            },
            {
                selector: 'div.content-viewer.quest-stage-description-content p span',
                oldText: '. If you do, they\'ll give you coins and stickers!',
                newText: '。如果您这么做，它们会给您金币和贴纸！'
            },
            {
                selector: 'div.text-center > div',
                oldText: 'January Login Streak',
                newText: '一月登录打卡'
            },
            {
                selector: 'div._details > div',
                oldText: 'January Login Streak',
                newText: '一月登录打卡'
            },
            {
                selector: 'div.text-center > div',
                oldText: 'February Login Streak',
                newText: '二月登录打卡'
            },
            {
                selector: 'div._details > div',
                oldText: 'February Login Streak',
                newText: '二月登录打卡'
            },
            {
                selector: 'div.text-center > div',
                oldText: 'March Login Streak',
                newText: '三月登录打卡'
            },
            {
                selector: 'div._details > div',
                oldText: 'March Login Streak',
                newText: '三月登录打卡'
            },
            {
                selector: 'div.text-center > div',
                oldText: 'April Login Streak',
                newText: '四月登录打卡'
            },
            {
                selector: 'div._details > div',
                oldText: 'April Login Streak',
                newText: '四月登录打卡'
            },
            {
                selector: 'div.text-center > div',
                oldText: 'May Login Streak',
                newText: '五月登录打卡'
            },
            {
                selector: 'div._details > div',
                oldText: 'May Login Streak',
                newText: '五月登录打卡'
            },
            {
                selector: 'div.text-center > div',
                oldText: 'June Login Streak',
                newText: '六月登录打卡'
            },
            {
                selector: 'div._details > div',
                oldText: 'June Login Streak',
                newText: '六月登录打卡'
            },
            {
                selector: 'div.text-center > div',
                oldText: 'July Login Streak',
                newText: '七月登录打卡'
            },
            {
                selector: 'div._details > div',
                oldText: 'July Login Streak',
                newText: '七月登录打卡'
            },
            {
                selector: 'div.text-center > div',
                oldText: 'August Login Streak',
                newText: '八月登录打卡'
            },
            {
                selector: 'div._details > div',
                oldText: 'August Login Streak',
                newText: '八月登录打卡'
            },
            {
                selector: 'div.text-center > div',
                oldText: 'September Login Streak',
                newText: '九月登录打卡'
            },
            {
                selector: 'div._details > div',
                oldText: 'September Login Streak',
                newText: '九月登录打卡'
            },
            {
                selector: 'div.text-center > div',
                oldText: 'October Login Streak',
                newText: '十月登录打卡'
            },
            {
                selector: 'div._details > div',
                oldText: 'October Login Streak',
                newText: '十月登录打卡'
            },
            {
                selector: 'div.text-center > div',
                oldText: 'November Login Streak',
                newText: '十一月登录打卡'
            },
            {
                selector: 'div._details > div',
                oldText: 'November Login Streak',
                newText: '十一月登录打卡'
            },
            {
                selector: 'div.text-center > div',
                oldText: 'December Login Streak',
                newText: '十二月登录打卡'
            },
            {
                selector: 'div._details > div',
                oldText: 'December Login Streak',
                newText: '十二月登录打卡'
            },
            {
                selector: 'div._subheading',
                oldText: 'Available Quests',
                newText: '可接受的任务'
            },
            {
                selector: 'div.text-center > div',
                oldText: 'Summon the Power of Lightning',
                newText: '召唤闪电之力'
            },
            {
                selector: 'div.content-viewer.quest-stage-description-content p span',
                oldText: 'Support your favorite Creators on Game Jolt with the power of lightning! Place 22 charged stickers before the quest expires and you’ll get a trophy! GJ Pro-Tip: You’ll also get a Welcome to Game Jolt pack after you’ve placed 11 charged stickers.',
                newText: '用闪电的力量支持您最喜欢的Game Jolt创作者！在任务结束前集齐22张充电贴纸，您就能获得一个奖杯！GJ Pro-Tip：集齐11张充电贴纸后，您还将收到一个“欢迎来到Game Jolt”包。'
            },
            {
                selector: 'div.content-viewer.quest-stage-description-content p span',
                oldText: 'Support your favorite Creators on Game Jolt with the power of lightning!',
                newText: '用闪电的力量支持您最喜欢的Game Jolt创作者！'
            },
            {
                selector: 'div.content-viewer.quest-stage-description-content p span',
                oldText: 'Place 22 charged stickers before the quest expires and you’ll get a trophy!',
                newText: '在任务结束前集齐22张充电贴纸，您就能获得一个奖杯！'
            },
            {
                selector: 'div.content-viewer.quest-stage-description-content p span',
                oldText: 'GJ Pro-Tip:',
                newText: 'GJ Pro-Tip：'
            },
            {
                selector: 'div.content-viewer.quest-stage-description-content p span',
                oldText: 'You\'ll also get a Welcome to Game Jolt pack after you\'ve placed 11 charged stickers.',
                newText: '集齐11张充电贴纸后，您还将收到一个“欢迎来到Game Jolt”包。'
            },
            {
                selector: 'div.-page-cut-bottom.page-cut .page-cut-content .button.-trans',
                oldText: 'Read article',
                newText: '阅读文章'
            },
            {
                selector: '.modal-header .modal-title span',
                oldText: 'Your Game Token',
                newText: '您的游戏令牌'
            },
            {
                selector: '.modal-body p.text-muted.small:nth-of-type(1) span',
                oldText: 'Your game token is like a special password you use to log into games that support high scores and achievements.',
                newText: '您的游戏令牌就像一个特殊的密码，您使用它来登录支持高分记录和成就记录的游戏。'
            },
            {
                selector: '.modal-body p.text-muted.small:nth-of-type(1) a span',
                oldText: 'more info',
                newText: '更多信息'
            },
            {
                selector: '.modal-body p.text-muted.small:nth-of-type(2) span',
                oldText: 'Never share your account password. In fact, if a game asks for your password instead of your game token, please report it!',
                newText: '切勿泄露您的账户密码。如果游戏要求您提供密码而不是游戏令牌，请举报！'
            },
            {
                selector: 'h2.-content-row-header',
                oldText: 'Realms',
                newText: '圈子'
            },
            {
                selector: 'h2.-content-row-header small',
                oldText: 'Realms bring all the content around a particular topic or interest into a single place for you to browse.',
                newText: '圈子将围绕特定主题或兴趣的所有内容汇聚一处，便于您浏览。'
            },
            {
                selector: 'h2.-content-row-header',
                oldText: 'Game Jolt Creators',
                newText: 'Game Jolt创作者'
            },
            {
                selector: 'h2.-content-row-header small',
                oldText: 'Follow and support your favorite creators on Game Jolt!',
                newText: '在Game Jolt上关注并支持您喜爱的创作者！'
            },
            {
                selector: 'div.-header-lead-text.-main-header-text',
                oldText: '',
                newText: '',
                addClass: 'use-fira'
            },
            {
                selector: 'div.-header-lead-text.-main-header-text',
                oldText: 'Become a Game Jolt Creator',
                newText: '成为Game Jolt创作者'
            },
            {
                selector: 'div.popper-wrapper > div.popper-content > div > div > div',
                oldText: 'Enter your search query for maximum finding...',
                newText: '请输入您的搜索关键词以获取尽可能多的搜索结果...'
            },
            {
                selector: 'div.popper-wrapper > div.popper-content > div > div > div > a',
                oldText: 'Show all results...',
                newText: '显示所有结果...'
            },
            {
                selector: 'a.-quick-action > div.-quick-action-label > span',
                oldText: 'Trophies',
                newText: '奖杯'
            },
            {
                selector: 'div.list-group-dark > a.list-group-item > span',
                oldText: 'Profile',
                newText: '个人资料'
            },
            {
                selector: 'div.list-group-dark > a.list-group-item > span',
                oldText: 'Games',
                newText: '游戏'
            },
            {
                selector: 'div.list-group-dark > a.list-group-item > span',
                oldText: 'Settings',
                newText: '设置'
            },
            {
                selector: 'div.list-group-dark > a.list-group-item > span',
                oldText: 'Analytics',
                newText: '数据分析'
            },
            {
                selector: 'div.list-group-dark > a.list-group-item > span',
                oldText: 'Game Token',
                newText: '游戏令牌'
            },
            {
                selector: 'div.list-group-dark > a.list-group-item > span',
                oldText: 'Dark Mode',
                newText: '黑暗模式'
            },
            {
                selector: 'div.list-group-dark > a.list-group-item > div.-small-text > span',
                oldText: 'on',
                newText: '开'
            },
            {
                selector: 'div.list-group-dark > a.list-group-item > div.-small-text > span',
                oldText: 'off',
                newText: '关'
            },
            {
                selector: 'div.list-group-dark > a.list-group-item > span',
                oldText: 'Loading...',
                newText: '加载中...'
            },
            {
                selector: 'div.-invite-well > button > span',
                oldText: 'Invite a friend',
                newText: '邀请好友'
            },
            {
                selector: 'div.list-group-dark > a.list-group-item > span',
                oldText: 'Logout',
                newText: '退出登录'
            },
            {
                selector: 'h4.sans-margin-top > span',
                oldText: 'Your invite link',
                newText: '您的邀请链接'
            },
            {
                selector: 'h4.section-header',
                oldText: 'Manage Games',
                newText: '管理游戏'
            },
            {
                selector: 'div.share-control > button.-outline',
                oldText: 'Copy',
                newText: '复制'
            },
            {
                selector: 'div.sheet-elevate > div.small > span',
                oldText: 'Accounts created using your invite link automatically become your followers.',
                newText: '使用您的邀请链接创建的帐号将自动成为您的粉丝。'
            },
            {
                selector: 'div.tooltip > div.tooltip-inner',
                oldText: 'Like This Post',
                newText: '为这个帖子点赞'
            },
            {
                selector: 'div.tooltip > div.tooltip-inner',
                oldText: 'Liked!',
                newText: '已点赞！'
            },
            {
                selector: 'div.tooltip > div.tooltip-inner',
                oldText: 'Chat and friends',
                newText: '聊天与好友'
            },
            {
                selector: 'div.tooltip > div.tooltip-inner',
                oldText: 'Shop',
                newText: '商店'
            },
            {
                selector: 'div.tooltip > div.tooltip-inner',
                oldText: 'Backpack',
                newText: '背包'
            },
            {
                selector: 'div.tooltip > div.tooltip-inner',
                oldText: 'Quests',
                newText: '任务'
            },
            {
                selector: 'div.tooltip > div.tooltip-inner',
                oldText: 'Game library',
                newText: '游戏库'
            },
            {
                selector: 'div.tooltip > div.tooltip-inner',
                oldText: 'Create a community',
                newText: '创建一个社区'
            },
            {
                selector: 'h1 > a.router-link-active',
                oldText: ' Help Docs',
                newText: ' 帮助文档（en-US）'
            },
            {
                selector: 'div.tab-bar > a.tab-bar-item > div.-tab-container',
                oldText: 'Chats',
                newText: '聊天'
            },
            {
                selector: 'div.tab-bar > a.tab-bar-item > div.-tab-container',
                oldText: 'Friends',
                newText: '好友'
            },
            {
                selector: 'button.button.-primary.-block',
                oldText: 'Invite a friend',
                newText: '邀请好友'
            },
            {
                selector: 'div.-text > div',
                oldText: 'Your friend is still loading. Encourage them with a message!',
                newText: '“朋友”加载中...发条消息鼓励一下他！'
            },
            {
                selector: 'div.-text > div',
                oldText: 'Waiting for friends to load in. Encourage them with a message!',
                newText: '等待“朋友”加载。发条消息鼓励一下他们！'
            },
            {
                selector: 'span.content-placeholder.text-muted.chat-message-content',
                oldText: 'Send a message',
                newText: '发送消息'
            },
            {
                selector: 'div.tooltip > div.tooltip-inner',
                oldText: 'Add an image or GIF',
                newText: '添加图片或GIF'
            },
            {
                selector: 'div.tooltip > div.tooltip-inner',
                oldText: 'Add a code block',
                newText: '添加代码块'
            },
            {
                selector: 'div.tooltip > div.tooltip-inner',
                oldText: 'Add a quote',
                newText: '添加引用'
            },
            {
                selector: 'div.tooltip > div.tooltip-inner',
                oldText: 'Add a spoiler',
                newText: '添加剧透黑幕'
            },
            {
                selector: 'div.tooltip > div.tooltip-inner',
                oldText: 'Add a bulleted list',
                newText: '添加无序列表'
            },
            {
                selector: 'div.tooltip > div.tooltip-inner',
                oldText: 'Add a numbered list',
                newText: '添加有序列表'
            },
            {
                selector: 'div.tooltip > div.tooltip-inner',
                oldText: 'Insert Gif',
                newText: '插入Gif'
            },
            {
                selector: 'div.tooltip > div.tooltip-inner',
                oldText: 'Insert Emoji',
                newText: '插入Emoji'
            },
            {
                selector: 'div.tooltip > div.tooltip-inner',
                oldText: 'Send message',
                newText: '发送消息'
            },
            {
                selector: 'div.tooltip > div.tooltip-inner',
                oldText: 'Create group chat',
                newText: '创建群聊'
            },
            {
                selector: 'div.tooltip > div.tooltip-inner',
                oldText: 'Settings',
                newText: '设置'
            },
            {
                selector: 'div.tooltip > div.tooltip-inner',
                oldText: 'Close',
                newText: '关闭'
            },
            {
                selector: 'div.modal-header > h2.modal-title',
                oldText: 'Choose friends',
                newText: '选择好友'
            },
            {
                selector: 'button.button.-primary.-outline.-block',
                oldText: 'Create group',
                newText: '创建群聊'
            },
            {
                selector: 'button.button.-outline',
                oldText: 'Close',
                newText: '关闭'
            },
            {
                selector: 'label.control-label.-small-label',
                oldText: 'Background',
                newText: '背景'
            },
            {
                selector: 'label.control-label.-small-label',
                oldText: 'Group Name',
                newText: '群名称'
            },
            {
                selector: 'label.control-label.-small-label > span.-optional-tag > span',
                oldText: '(optional)',
                newText: '（可选）'
            },
            {
                selector: 'label.control-label.-small-label',
                oldText: 'Notifications',
                newText: '消息通知'
            },
            {
                selector: 'button.button.-toggle-button.-single.-direction-column',
                oldText: 'All Messages',
                newText: '所有消息'
            },
            {
                selector: 'button.button.-toggle-button.-single.-direction-column',
                oldText: 'Nothing',
                newText: '免打扰'
            },
            {
                selector: 'button.button.-toggle-button.-single.-direction-column',
                oldText: 'Only @mentions',
                newText: '仅被提及时'
            },
            {
                selector: 'h5.-header list-group-item',
                oldText: 'Notifications',
                newText: '消息通知'
            },
            {
                selector: 'a.list-group-item.has-icon',
                oldText: 'All Messages',
                newText: '所有消息'
            },
            {
                selector: 'a.list-group-item.has-icon',
                oldText: 'Nothing',
                newText: '免打扰'
            },
            {
                selector: 'a.list-group-item.has-icon',
                oldText: 'Only @mentions',
                newText: '仅被提及时'
            },
            {
                selector: 'a.list-group-item.has-icon',
                oldText: 'Leave Room',
                newText: '退出群聊'
            },
            {
                selector: 'div.tooltip > div.tooltip-inner',
                oldText: 'Add reaction',
                newText: '做出反应'
            },
            {
                selector: 'div.tooltip > div.tooltip-inner',
                oldText: 'Edit message',
                newText: '编辑消息'
            },
            {
                selector: 'div.tooltip > div.tooltip-inner',
                oldText: 'Remove message',
                newText: '移除消息'
            },
            {
                selector: 'div.tooltip > div.tooltip-inner',
                oldText: 'Show members',
                newText: '显示成员'
            },
            {
                selector: 'div.modal-header > h2.modal-title',
                oldText: 'Reactions',
                newText: '反应'
            },
            {
                selector: 'h6',
                oldText: 'Recently used',
                newText: '最近使用'
            },
            {
                selector: 'h6',
                oldText: 'Game Jolt Gang',
                newText: 'Game Jolt帮'
            },
            {
                selector: 'h6',
                oldText: 'Smileys & People',
                newText: '笑脸与人类'
            },
            {
                selector: 'h6',
                oldText: 'Animals & Nature',
                newText: '动物与自然'
            },
            {
                selector: 'h6',
                oldText: 'Food & Drink',
                newText: '食物与饮品'
            },
            {
                selector: 'h6',
                oldText: 'Travel & Places',
                newText: '旅行与地点'
            },
            {
                selector: 'h6',
                oldText: 'Activities',
                newText: '活动'
            },
            {
                selector: 'h6',
                oldText: 'Objects',
                newText: '物品'
            },
            {
                selector: 'h6',
                oldText: 'Symbols',
                newText: '标志'
            },
            {
                selector: 'h6',
                oldText: 'Flags',
                newText: '旗帜'
            },
            {
                selector: 'span.-message-state > span',
                oldText: '(editing...)',
                newText: '（编辑中...）'
            },
            {
                selector: 'span.-message-state',
                oldText: '(edited)',
                newText: '（已编辑）'
            },
            {
                selector: 'div.modal-header > h2.modal-title',
                oldText: 'Confirm...',
                newText: '请确认...'
            },
            {
                selector: 'div.modal-body > p',
                oldText: 'Are you sure you want to remove this message?',
                newText: '您确定要移除这条信息吗？'
            },
            {
                selector: 'div.modal-body > p',
                oldText: 'Are you sure you want to leave the group chat?',
                newText: '您确定要退出这个群聊吗？'
            },
            {
                selector: 'button.button.-primary',
                oldText: 'Yes',
                newText: '是'
            },
            {
                selector: 'button.button.-trans',
                oldText: 'No',
                newText: '否'
            },
            {
                selector: 'div.-pad.-action',
                oldText: 'Leave group',
                newText: '退出群聊'
            },
            {
                selector: 'div.content-viewer.chat-message-content > div > div > div.loading-fade > div.loading-fade-content > div:not([class])',
                oldText: 'You invited ',
                newText: '您邀请 '
            },
            {
                selector: 'div.content-viewer.chat-message-content > div > div > div.loading-fade > div.loading-fade-content > div:not([class])',
                oldText: ' to a group chat',
                newText: '进入群聊。'
            },
            {
                selector: 'div.fill-backdrop > div',
                oldText: 'You canceled this invite.',
                newText: '您取消了这次邀请。'
            },
            {
                selector: 'div.fill-backdrop > div',
                oldText: 'This invite hasn\'t been responded to yet.',
                newText: '这次邀请尚未得到回应。'
            },
            {
                selector: 'div._header-members > span',
                oldText: 'Members',
                newText: '群成员'
            },
            {
                selector: 'div._header-name.anim-fade-in-right.no-animate-xs',
                oldText: 'Group Chat',
                newText: '群聊'
            },
            {
                selector: 'a.chat-list-item.-hovered > div.-title',
                oldText: 'Group Chat',
                newText: '群聊'
            },
            {
                selector: 'div[data-v-aa32142e]',
                oldText: 'There are no items available for purchase.',
                newText: '没有商品可供购买。'
            },
            {
                selector: 'button.button.-block',
                oldText: 'Get Joltbux',
                newText: '获取簸币'
            },
            {
                selector: 'button.button.-block',
                oldText: 'Get Coins',
                newText: '获取硬币'
            },
            {
                selector: 'div._items > a.theme-dark > div > div',
                oldText: 'Avatar frame',
                newText: '头像框'
            },
            {
                selector: 'div._items > a.theme-dark > div > div',
                oldText: 'Background',
                newText: '背景'
            },
            {
                selector: 'div._items > a.theme-dark > div > div',
                oldText: 'Sticker pack',
                newText: '贴纸包'
            },
            {
                selector: 'div.fill-offset > h2.use-fira',
                oldText: 'Featured Creations',
                newText: '精选作品'
            },
            {
                selector: 'div.fill-offset > h2.use-fira',
                oldText: 'Best-Sellers',
                newText: '畅销商品'
            },
            {
                selector: 'div.fill-offset > h2.use-fira',
                oldText: 'Welcome to Game Jolt',
                newText: '欢迎来到Game Jolt'
            },
            {
                selector: 'div.fill-offset > h2.use-fira',
                oldText: 'Horror',
                newText: '恐怖'
            },
            {
                selector: 'div.fill-offset > h2.use-fira',
                oldText: 'Festive Horror',
                newText: '欢乐恐惧'
            },
            {
                selector: 'div.fill-offset > h2.use-fira',
                oldText: 'Chicken',
                newText: '鸡'
            },
            {
                selector: 'div.fill-offset > h2.use-fira',
                oldText: 'Heroes & Villains',
                newText: '英雄与恶棍'
            },
            {
                selector: 'div.fill-offset > h2.use-fira',
                oldText: 'Music',
                newText: '音乐'
            },
            {
                selector: 'div.fill-offset > h2.use-fira',
                oldText: 'Pirates',
                newText: '海盗'
            },
            {
                selector: 'div.fill-offset > h2.use-fira',
                oldText: 'Space',
                newText: '太空'
            },
            {
                selector: 'div.fill-offset > h2.use-fira',
                oldText: 'Retro Games',
                newText: '复古游戏'
            },
            {
                selector: 'div.fill-offset > h2.use-fira',
                oldText: 'Reward Packs',
                newText: '奖励包'
            },
            {
                selector: 'a.sheet.sheet-elevate > div > h3',
                oldText: /(\S+)\'s Shop/,
                newText: '$1 的商店'
            },
            {
                selector: 'button.button',
                oldText: 'Open shop',
                newText: '打开商店'
            },
            {
                selector: 'div[style="margin-top: 8px; align-self: center; color: var(--theme-fg-muted); font-size: 13px;"]',
                oldText: 'Avatar frame',
                newText: '头像框'
            },
            {
                selector: 'div[style="margin-top: 8px; align-self: center; color: var(--theme-fg-muted); font-size: 13px;"]',
                oldText: 'Background',
                newText: '背景'
            },
            {
                selector: 'div[style="margin-top: 8px; align-self: center; color: var(--theme-fg-muted); font-size: 13px;"]',
                oldText: 'Sticker pack',
                newText: '贴纸包'
            },
            {
                selector: 'div.text-center',
                oldText: 'Get this item',
                newText: '获取这个物品'
            },
            {
                selector: 'div.tooltip > div.tooltip-inner',
                oldText: 'Gift this to a friend',
                newText: '把它送给一个好友'
            },
            {
                selector: 'div.text-center',
                oldText: 'You can purchase this item with Joltbux',
                newText: '您可以用簸币来购买此商品'
            },
            {
                selector: 'div[style="width: 100%;"]',
                oldText: 'Equip an avatar frame to make yourself stand out in the community.',
                newText: '装备头像框，在社区中引人注目！'
            },
            {
                selector: 'div[style="width: 100%;"]',
                oldText: 'Backgrounds can be added to your posts to make your content stand out in the feeds.',
                newText: '背景能被加入您的帖子，让您的帖子在眼花缭乱中引人注目。'
            },
            {
                selector: 'div[style="width: 100%;"]',
                oldText: 'You\'ll get a random selection of these stickers when you open this pack. Collect them all! Place them on top of posts!',
                newText: '您会在这个包里得到随机的贴纸。收集起来！放到帖子的顶端！'
            },
            {
                selector: 'div.text-center > a.link-muted',
                oldText: 'Learn more about packs',
                newText: '关于“包”了解更多'
            },
            {
                selector: 'span[tabindex="-1"]',
                oldText: 'Eat them!',
                newText: '吃掉它们！'
            },
            {
                selector: 'div.tooltip > div.tooltip-inner',
                oldText: 'yum',
                newText: '豪赤'
            },
            {
                selector: 'h2.modal-title.sans-margin-bottom',
                oldText: 'Select a product',
                newText: '选择一个产品'
            },
            {
                selector: 'div[style*="min-width: 0px"][style*="min-height: 48px"]',
                oldText: /(\d+) Joltbux/,
                newText: '$1 簸币'
            },
            {
                selector: 'button[data-v-dda198ff][type="button"][class="button -primary"]',
                oldText: /US\$(\d+)\.99/,
                newText: '$1.99美元'
            },
            {
                selector: 'button[data-v-dda198ff][data-v-ae296894]',
                oldText: 'Open Shop',
                newText: '打开商店'
            },
            {
                selector: 'div[data-v-ae296894]',
                oldText: 'Sticker packs',
                newText: '贴纸包'
            },
            {
                selector: 'p[data-v-ae296894]',
                oldText: 'You currently have no packs to open.',
                newText: '您当前没有能打开的包。'
            },
            {
                selector: 'div.text-center',
                oldText: 'You already own this',
                newText: '您已拥有'
            },
            {
                selector: 'div[data-v-ae296894]',
                oldText: 'Stickers',
                newText: '贴纸'
            },
            {
                selector: 'div[style*="font-size: 19px; font-weight: bold; margin-bottom: 8px;"]',
                oldText: 'Which collection would you like to browse?',
                newText: '您想浏览谁的收集品？'
            },
            {
                selector: 'div[style*="overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-size: 19px; font-weight: bold;"]',
                oldText: /(\S+)\'s Collection/,
                newText: '$1 的收集品'
            },
            {
                selector: 'div[data-v-08dbb9f1]',
                oldText: 'There\'s nothing available from this creator yet. Let them know!',
                newText: '这个创作者还没有可用的收集品。告诉他！'
            },
            {
                selector: 'div[style*="border-radius: 12px; margin-top: 4px; padding: 2px 8px; display: inline-block; font-size: 11px; font-weight: bold; align-self: center; background-color: var(--theme-bi-bg); color: var(--theme-bi-fg);"]',
                oldText: 'Available in shop',
                newText: '商店可购买'
            },
            {
                selector: 'div[style*="border-radius: 12px; margin-top: 4px; padding: 2px 8px; display: inline-block; font-size: 11px; font-weight: bold; align-self: center; background-color: rgb(49, 214, 255); color: black;"]',
                oldText: 'Charge reward',
                newText: '充电奖励'
            },
            {
                selector: 'h2[style*="margin-top: 0px;"]',
                oldText: 'Stickers',
                newText: '贴纸'
            },
            {
                selector: 'h2[style*="margin-top: 0px;"]',
                oldText: 'Avatar frames',
                newText: '头像框'
            },
            {
                selector: 'h2[style*="margin-top: 0px;"]',
                oldText: 'Backgrounds',
                newText: '背景'
            },
            {
                selector: 'button[data-v-dda198ff]',
                oldText: 'Load more',
                newText: '加载更多'
            },
            {
                selector: 'p[data-v-ae296894]',
                oldText: 'You have no stickers. Open packs to get some!',
                newText: '您没有贴纸。开包获取些吧！'
            },
            {
                selector: 'button[data-v-dda198ff][data-v-ae296894]',
                oldText: 'Get packs',
                newText: '获取包'
            },
            {
                selector: 'span[data-v-34fd5d74]',
                oldText: 'Your Games',
                newText: '您的游戏'
            },
            {
                selector: 'span[data-v-34fd5d74]',
                oldText: 'Followed Games',
                newText: '关注的游戏'
            },
            {
                selector: 'span[data-v-34fd5d74]',
                oldText: 'Owned Games',
                newText: '拥有的游戏'
            },
            {
                selector: 'span[data-v-34fd5d74]',
                oldText: 'Playlists',
                newText: '游玩列表'
            },
            {
                selector: 'button[data-v-dda198ff][data-v-34fd5d74]',
                oldText: 'New Playlist',
                newText: '新建游玩列表'
            },
            {
                selector: 'p[data-v-34fd5d74] > span[data-v-34fd5d74]',
                oldText: 'Create playlists to organize and share the games in your library.',
                newText: '创建游玩列表以组织和共享您库中的游戏。'
            },
            {
                selector: 'p[data-v-34fd5d74] > span[data-v-34fd5d74]',
                oldText: 'Follow other people\'s playlists to discover more games!',
                newText: '关注他人的游玩列表，发现更多游戏！'
            },
            {
                selector: 'div.modal-header > h2.modal-title > span',
                oldText: 'Add Playlist',
                newText: '添加游玩列表'
            },
            {
                selector: 'label[data-v-988561b2][data-v-7532a142]',
                oldText: 'Name',
                newText: '名称'
            },
            {
                selector: 'button[data-v-a5d40661][data-v-dda198ff]',
                oldText: 'Add Playlist',
                newText: '添加游玩列表'
            },
            {
                selector: 'h2.-browse-heading.text-center[data-v-74281024]',
                oldText: 'Browse Games',
                newText: '浏览游戏'
            },
            {
                selector: 'span[data-v-02ef0e8d]',
                oldText: 'Add Your Game',
                newText: '创建您的游戏'
            },
            {
                selector: 'a[data-v-e495e1fd][data-gj-autoscroll="disabled"]',
                oldText: 'Featured',
                newText: '精选'
            },
            {
                selector: 'a[data-v-e495e1fd][data-gj-autoscroll="disabled"]',
                oldText: 'Hot',
                newText: '热门'
            },
            {
                selector: 'a[data-v-e495e1fd][data-gj-autoscroll="disabled"]',
                oldText: 'Best',
                newText: '最佳'
            },
            {
                selector: 'a[data-v-e495e1fd][data-gj-autoscroll="disabled"]',
                oldText: 'New',
                newText: '最新'
            },
            {
                selector: 'a[data-v-87859d18]',
                oldText: 'Price ',
                newText: '价格 '
            },
            {
                selector: 'a[data-v-87859d18]',
                oldText: 'OS ',
                newText: '操作系统'
            },
            {
                selector: 'a[data-v-87859d18]',
                oldText: 'Browser ',
                newText: '浏览器'
            },
            {
                selector: 'a[data-v-87859d18]',
                oldText: 'Maturity ',
                newText: '适龄'
            },
            {
                selector: 'a[data-v-87859d18]',
                oldText: 'Status ',
                newText: '状态'
            },
            {
                selector: 'a[data-v-87859d18]',
                oldText: 'Partners ',
                newText: '合作伙伴'
            },
            {
                selector: 'a.list-group-item.has-addon[data-v-87859d18]',
                oldText: ' Free / Name Your Price',
                newText: ' 免费 / 自定义'
            },
            {
                selector: 'a.list-group-item.has-addon[data-v-87859d18]',
                oldText: ' On Sale',
                newText: ' 促销'
            },
            {
                selector: 'a.list-group-item.has-addon[data-v-87859d18]',
                oldText: ' Paid',
                newText: ' 付费'
            },
            {
                selector: 'a.list-group-item.has-addon[data-v-87859d18]',
                oldText: ' $5 or less',
                newText: ' 5美元及以下'
            },
            {
                selector: 'a.list-group-item.has-addon[data-v-87859d18]',
                oldText: ' $15 or less',
                newText: ' 15美元及以下'
            },
            {
                selector: 'a.list-group-item.has-addon[data-v-87859d18]',
                oldText: ' $30 or less',
                newText: ' 30美元及以下'
            },
            {
                selector: 'a.list-group-item.has-addon[data-v-87859d18]',
                oldText: ' Other',
                newText: ' 其他'
            },
            {
                selector: 'a.list-group-item.has-addon[data-v-87859d18]',
                oldText: ' All Ages',
                newText: ' 全年龄'
            },
            {
                selector: 'a.list-group-item.has-addon[data-v-87859d18]',
                oldText: ' Teen Content',
                newText: ' 青少年'
            },
            {
                selector: 'a.list-group-item.has-addon[data-v-87859d18]',
                oldText: ' Mature Content',
                newText: ' 成人'
            },
            {
                selector: 'a.list-group-item.has-addon[data-v-87859d18]',
                oldText: ' Complete/Stable',
                newText: ' 完成/稳定'
            },
            {
                selector: 'a.list-group-item.has-addon[data-v-87859d18]',
                oldText: ' Early Access',
                newText: ' 提前使用'
            },
            {
                selector: 'a.list-group-item.has-addon[data-v-87859d18]',
                oldText: ' Devlog',
                newText: ' 仅开发日志'
            },
            {
                selector: 'a.list-group-item.has-addon[data-v-87859d18]',
                oldText: ' Show Partner Games',
                newText: ' 显示合作伙伴游戏'
            },
            {
                selector: 'span[data-v-9b359a40]',
                oldText: 'Name Your Price',
                newText: '自定义'
            },
            {
                selector: 'span[data-v-9b359a40]',
                oldText: 'Free',
                newText: '免费'
            },
            {
                selector: 'div.-pricing-amount[data-v-9b359a40]',
                oldText: /US\$(\d+\.?\d*)/,
                newText: '$1美元'
            },
            {
                selector: 'nav.platform-list.inline > ul > li > a > span',
                oldText: 'Overview',
                newText: '概况'
            },
            {
                selector: 'nav.platform-list.inline > ul > li > a > span',
                oldText: 'Comments',
                newText: '评论'
            },
            {
                selector: 'nav.platform-list.inline > ul > li > a > span',
                oldText: 'Followers',
                newText: '粉丝'
            },
            {
                selector: 'div.page-header-content[data-v-5c48e674] > div',
                oldText: 'by ',
                newText: '作者 '
            },
            {
                selector: 'button.button.-primary.-block[data-v-dda198ff]',
                oldText: 'Following',
                newText: '已关注'
            },
            {
                selector: 'button.button.-primary.-block[data-v-dda198ff]',
                oldText: 'Follow',
                newText: '关注'
            },
            {
                selector: 'div.modal-header > h2.modal-title',
                oldText: 'Unfollow game?',
                newText: '取消关注游戏吗？'
            },
            {
                selector: 'div.modal-body > p',
                oldText: 'Are you sure you want to unfollow this game?',
                newText: '您真的确定要取消关注这个游戏吗？'
            },
            {
                selector: 'div.tooltip > div.tooltip-inner',
                oldText: 'Add to Playlist',
                newText: '加入游玩列表'
            },
            {
                selector: 'p.help-block.error.anim-fade-in',
                oldText: 'You must enter a email.',
                newText: '您必须输入电子邮箱。'
            },
            {
                selector: 'p.help-block.error.anim-fade-in',
                oldText: 'Please enter a valid email address.',
                newText: '请输入一个有效的电子邮箱地址。'
            },
            {
                selector: 'p.help-block.error.anim-fade-in',
                oldText: 'You must enter a username.',
                newText: '您必须输入用户名。'
            },
            {
                selector: 'p.help-block.error.anim-fade-in',
                oldText: 'Please enter a username longer than or equal to 3 characters.',
                newText: '用户名长度至少为3字符。'
            },
            {
                selector: 'p.help-block.error.anim-fade-in',
                oldText: 'Please enter a username shorter than or equal to 30 characters.',
                newText: '用户名长度最多为30字符。'
            },
            {
                selector: 'p.help-block.error.anim-fade-in',
                oldText: 'Please use only letters, numbers, hyphens (-), and underscores (_).',
                newText: '请不要使用字母、数字、短横线（-）和下划线（_）之外的字符。'
            },
            {
                selector: 'p.help-block.error.anim-fade-in',
                oldText: 'This username is already in use.',
                newText: '这个用户名已经被使用了。'
            },
            {
                selector: 'p.help-block.error.anim-fade-in',
                oldText: 'This email is already in use.',
                newText: '这个电子邮箱已经被使用了。'
            },
            {
                selector: 'p.help-block.error.anim-fade-in',
                oldText: 'You must enter a password.',
                newText: '您必须输入密码。'
            },
            {
                selector: 'p.help-block.error.anim-fade-in',
                oldText: 'Please enter a password longer than or equal to 4 characters.',
                newText: '密码长度至少为4字符。'
            },
            {
                selector: 'p.help-block.error.anim-fade-in',
                oldText: 'Please enter a password shorter than or equal to 300 characters.',
                newText: '密码长度最多为300字符。'
            },
            {
                selector: 'button[data-v-dda198ff][data-v-a5d40661][data-v-c73a5c70]',
                oldText: 'Sign up',
                newText: '注册'
            },
            {
                selector: 'span[data-v-52e99482]',
                oldText: 'Log In',
                newText: '登录'
            },
            {
                selector: 'div[data-v-c73a5c70]',
                oldText: ' By signing up, you agree to the ',
                newText: ' 注册即表示您同意'
            },
            {
                selector: 'div[data-v-c73a5c70] > a[data-v-c73a5c70]',
                oldText: 'Terms of Use',
                newText: '使用条款'
            },
            {
                selector: 'div[data-v-c73a5c70]',
                oldText: ' and ',
                newText: '和'
            },
            {
                selector: 'div[data-v-c73a5c70] > a[data-v-c73a5c70]',
                oldText: 'Privacy Policy',
                newText: '隐私政策'
            },
            {
                selector: 'div[data-v-c73a5c70]',
                oldText: ' , including the ',
                newText: '（包括'
            },
            {
                selector: 'div[data-v-c73a5c70] > a[data-v-c73a5c70]',
                oldText: 'Cookie Policy',
                newText: 'Cookie政策'
            },
            {
                selector: 'div[data-v-c73a5c70]',
                oldText: ' . ',
                newText: '）。'
            },
            {
                selector: 'span[data-v-65ae3e20]',
                oldText: 'Already have an account?',
                newText: '已经有账号了？'
            },
            {
                selector: 'a[href="/forgot"] > span',
                oldText: 'Having trouble logging in?',
                newText: '登录遇到问题了？'
            },
            {
                selector: 'div.auth-page-link',
                oldText: ' Don\'t have an account? ',
                newText: ' 没有账号吗？'
            },
            {
                selector: 'a[data-v-d18ce2b8] > span[data-v-d18ce2b8]',
                oldText: 'Terms',
                newText: '使用条款'
            },
            {
                selector: 'a[data-v-d18ce2b8] > span[data-v-d18ce2b8]',
                oldText: 'Privacy',
                newText: '隐私政策'
            },
            {
                selector: 'a[data-v-d18ce2b8] > span[data-v-d18ce2b8]',
                oldText: 'Cookie Policy',
                newText: 'Cookie政策'
            },
            {
                selector: 'select[data-v-d18ce2b8] > option',
                oldText: 'English',
                newText: '中文（简体）脚本 by QigongBea'
            },
            {
                selector: 'div.-message[data-v-7c3ef1ff]',
                oldText: 'Game Jolt needs your permission to ',
                newText: 'Game Jolt需要您的帮助才能'
            },
            {
                selector: 'div.-message[data-v-7c3ef1ff] > em',
                oldText: 'enable desktop notifications',
                newText: '启用桌面通知'
            },
            {
                selector: 'span.content-placeholder.text-muted.fireside-post-lead-content[data-v-6c653c84]',
                oldText: 'What\'s new?',
                newText: '有啥新鲜事？'
            },
            {
                selector: 'button[data-v-dda198ff][data-v-4b299965] > span[data-v-4b299965]',
                oldText: 'Images/GIFs',
                newText: '图像/GIF'
            },
            {
                selector: 'button[data-v-dda198ff][data-v-4b299965] > span[data-v-4b299965]',
                oldText: 'Video',
                newText: '视频'
            },
            {
                selector: 'p.help-block.error.anim-fade-in',
                oldText: 'The post is too long.',
                newText: '帖子太长了。'
            },
            {
                selector: 'p.help-block.error.anim-fade-in',
                oldText: 'You must enter a post.',
                newText: '您必须输入内容。'
            },
            {
                selector: 'div.-label[data-v-e09354f1] > span[data-v-4b299965]',
                oldText: 'More options',
                newText: '更多选项'
            },
            {
                selector: 'label.control-label[data-v-7532a142][data-v-988561b2]',
                oldText: 'Enable comments?',
                newText: '允许评论吗？'
            },
            {
                selector: 'label.control-label[data-v-7532a142][data-v-988561b2]',
                oldText: 'Who can comment?',
                newText: '谁可以评论？'
            },
            {
                selector: 'select[id="eff9b96e-fda6-4111-bd2b-206ef95f4a70-allow_comments"] > option',
                oldText: 'Everyone',
                newText: '所有人'
            },
            {
                selector: 'select[id="eff9b96e-fda6-4111-bd2b-206ef95f4a70-allow_comments"] > option',
                oldText: 'Only friends',
                newText: '仅好友'
            },
            {
                selector: 'div.tooltip > div.tooltip-inner',
                oldText: 'Add article',
                newText: '添加文章'
            },
            {
                selector: 'div.tooltip > div.tooltip-inner',
                oldText: 'Add poll',
                newText: '添加投票'
            },
            {
                selector: 'div.tooltip > div.tooltip-inner',
                oldText: 'Schedule post',
                newText: '定时发布'
            },
            {
                selector: 'div.tooltip > div.tooltip-inner',
                oldText: 'More options',
                newText: '更多选项'
            },
            {
                selector: 'div.-label[data-v-e09354f1] > span[data-v-4b299965]',
                oldText: 'Article content',
                newText: '文章内容'
            },
            {
                selector: 'span.content-placeholder.text-muted.fireside-post-lead-content[data-v-6c653c84]',
                oldText: 'Write a summary for your article...',
                newText: '为您的文章写摘要...'
            },
            {
                selector: 'span.content-placeholder.text-muted.fireside-post-article-content[data-v-6c653c84]',
                oldText: 'Write your article here...',
                newText: '写下您的文章...'
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
            {
                selector: '',
                oldText: '',
                newText: ''
            },
        ];

    function translateText(replacements)
        {
            const headerElements = document.querySelectorAll('h2.-content-row-header');
            headerElements.forEach(headerElement =>
                {
                    const smallElements = headerElement.querySelectorAll('small');
                    smallElements.forEach(smallElement =>
                        {
                            smallElement.style.fontFamily = 'Inter, sans-serif';
                        });
                });

            replacements.forEach(({selector, oldText, newText, attr = 'textContent', addClass}) =>
                {
                    if(selector) {
                        const elements = document.querySelectorAll(selector);
                        elements.forEach(element =>
                            {
                                if (typeof oldText === 'string')
                                    {
                                        if (element[attr].trim() === oldText)
                                            {
                                                element[attr] = newText;
                                            }

                                        if (element.textContent.includes(oldText))
                                            {
                                                element.innerHTML = element.innerHTML.replace(oldText, newText);
                                            }
                                    }
                                    else
                                        if (oldText instanceof RegExp)
                                            {
                                                element[attr] = element[attr].replace(oldText, newText);
                                            }
                            });

                        if (addClass) {
                            elements.forEach(element =>
                                {
                                    element.classList.add(addClass);
                                });
                        }
                    }
                });

            document.querySelectorAll('div[style*="Staatliches"]').forEach((element) =>
                {
                    element.classList.add('use-fira');
                });

            const titleReplacements =
                [
                    {
                        oldText: 'Share your creations',
                        newText: '展示您的创造力'
                    },
                    {
                        oldText: 'Fan art, videos, guides, polls and more',
                        newText: '同人图，视频，教程，投票...还有更多！'
                    },
                    {
                        oldText: ' Community',
                        newText: '社区'
                    },
                    {
                        oldText: ' on Gamejolt',
                        newText: '在Gamejolt上的搜索结果'
                    },
                    {
                        oldText: 'Log in to Game Jolt',
                        newText: '登录Game Jolt'
                    },
                    {
                        oldText: 'Featured Games',
                        newText: '精选游戏'
                    },
                    {
                        oldText: 'Featured',
                        newText: '精选的'
                    },
                    {
                        oldText: 'Find Great Games',
                        newText: '找到好游戏'
                    },
                    {
                        oldText: 'Find Great',
                        newText: '找到好的'
                    },
                    {
                        oldText: 'Best Games',
                        newText: '最佳游戏'
                    },
                    {
                        oldText: 'Best',
                        newText: '最佳的'
                    },
                    {
                        oldText: 'Newest Games',
                        newText: '最新游戏'
                    },
                    {
                        oldText: 'Newest',
                        newText: '最新的'
                    },
                    {
                        oldText: 'Games',
                        newText: '游戏'
                    },
                ];

            titleReplacements.forEach(({
                oldText,
                newText
            }) => {
                if (document.title.includes(oldText)) {
                    document.title = document.title.replace(oldText, newText);
                }
            });

            document.querySelectorAll('div.-title[title*="(Official)"]').forEach((element) => {
                if (element.title.includes('(Official)')) {
                    element.title = element.title.replace('(Official)', '(官方)');
                }
                if (element.textContent.includes('(Official)')) {
                    element.textContent = element.textContent.replace('(Official)', '(官方)');
                }
            });

            document.querySelectorAll('div.-title').forEach((element) => {
                const anyCancelledWordForm = /(\[|\()?(\s*CANCELLED\s*|\s*cancelled\s*|\s*Cancelled\s*)(\]|\))?/gi;
                const cancelledIsFullWord = /^\s*CANCELLED\s*$/i;

                const translateText = (text) => {
                    return text.replace(anyCancelledWordForm, (match, p1, p2, p3) => {
                        const prefix = p1 || '';
                        const suffix = p3 || '';
                        let replacement = `${prefix}已取消${suffix}`;
                        replacement = replacement.replace(/\s+/g, ' ').trim();
                        if (/^\s*(\(\s*CANCELLED\s*\)|\[\s*CANCELLED\s*\])/.test(text)) {
                            replacement = `${prefix}已取消${suffix}`;
                        }
                        return replacement;
                    }).replace(/([^\s])(\[|\()/g, '$1 $2');
                };

                if (!cancelledIsFullWord.test(element.textContent)) {
                    element.textContent = translateText(element.textContent);
                }
                if (!cancelledIsFullWord.test(element.title)) {
                    element.title = translateText(element.title);
                }
            });

            const taskReplacements =
                [
                    {
                        name: ['Cast your vote on a poll', '投出您的一票'],
                        description: ['Your choices will affect the outcome, good or bad, so choose carefully!', '您的选择会影响投票结果，无论好坏。谨慎选择！'],
                        demand: ['Cast your vote on a poll', '在一场投票中投出您的一票。']
                    },
                    {
                        name: ['Follow a Game Jolt Creator', '关注一个Game Jolt创作者'],
                        description: ['Discover great new content by following a Game Jolt Creator!', '通过关注Game Jolt的创作者，发现更多精彩内容！'],
                        protip: [
                            'Need help finding one? Look for the Creator icon that you can see in this quest\'s images. You can see some of the great Creators on Game Jolt at ',
                            '需要帮忙吗？请留意任务图片中的“创作者”图标。您可以在这里看到一些出色的创作者：'
                        ],
                        demand: ['Follow a Game Jolt Creator', '关注一个Game Jolt创作者。']
                    },
                    {
                        name: ['Like 5 comments', '为5条评论点赞'],
                        description: [
                            'In this land, there is an age-old custom of raising one\'s thumb in support of a good point. Let\'s honor this tradition!',
                            '在这片土地上，有一个古老的习俗：竖起大拇指表示对一个观点的支持。让我们尊重这一传统！'
                        ],
                        demand: ['Like 5 comments', '为5条评论点赞。']
                    },
                ]

            taskReplacements.forEach(({name, description, protip = '' ,demand}) => {
                document.querySelectorAll('div.text-center > div').forEach((element) => {
                    if (name[0] && element.textContent.includes(name[0])) {
                        element.innerHTML = element.innerHTML.replace(name[0], name[1]);
                    }
                });
                document.querySelectorAll('div._details > div._title').forEach((element) => {
                    if (name[0] && element.textContent.includes(name[0])) {
                        element.innerHTML = element.innerHTML.replace(name[0], name[1]);
                    }
                });
                document.querySelectorAll('div.content-viewer.quest-stage-description-content p span').forEach((element) => {
                    if (description[0] && element.textContent.includes(description[0])) {
                        element.innerHTML = element.innerHTML.replace(description[0], description[1]);
                    }
                });
                if(protip != ''){
                    document.querySelectorAll('div.content-viewer.quest-stage-description-content p span').forEach((element) => {
                        if (protip[0] && element.textContent.includes(protip[0])) {
                            element.innerHTML = element.innerHTML.replace(protip[0], protip[1]);
                        }
                    });
                }
                document.querySelectorAll('div.-details > div.-title').forEach((element) => {
                    if (demand[0] && element.textContent.includes(demand[0])) {
                        element.innerHTML = element.innerHTML.replace(demand[0], demand[1]);
                    }
                });
            })
    }

    function replaceImage() {
        // const img = document.querySelector('a[href="https://gamejolt.com/p/game-jolt-s-celebration-of-pride-month-has-begun-go-to-the-shop-to-mxvnfzwg"] img[src="https://m.gjcdn.net/gen/400/32981814-sd4xeihs-v4.webp"]');
        // if (img) {
        //     img.src = 'https://i.imgur.com/sqNFMx6.png';
        // }
    }

    document.addEventListener('DOMContentLoaded', () => {
        translateText(replacements);
        replaceImage()
    });

    let timeout;
    const observer = new MutationObserver(() => {
        clearTimeout(timeout);
        timeout = setTimeout(() =>
            {
                translateText(replacements);
                replaceImage()
            }, 0);
    });

    const targetNode = document.body;
    if (targetNode) {
        observer.observe(targetNode, {
            childList: true,
            subtree: true
        });
    }
})();