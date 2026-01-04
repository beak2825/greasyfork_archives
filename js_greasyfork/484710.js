// ==UserScript==
// @name        汉化reddit.com
// @namespace   Violentmonkey Scripts
// @match       https://*.reddit.com/*
// @version     1.0
// @author      -
// @description 汉化界面的部分菜单及内容
// @grant       none
// @author       sec
// @license MIT
// @namespace    https://t.me/KingRan_qun
// @downloadURL https://update.greasyfork.org/scripts/484710/%E6%B1%89%E5%8C%96redditcom.user.js
// @updateURL https://update.greasyfork.org/scripts/484710/%E6%B1%89%E5%8C%96redditcom.meta.js
// ==/UserScript==



(function() {
    'use strict';

    const i18n = new Map([

['Welcome back', '欢迎回来'],
['You’re logged in through a ', '您通过 '],
['connected Google account', '连接的谷歌账户'],
['If you have a different Reddit account you’d like to use', '如果您想使用其他 Reddit 帐户'],
['log in using your username and password', '请使用您的用户名和密码登录'],
['Continue as ac2077', '以 ac2077 的身份继续'],
['Log in to a different account', '以其他账户登录'],

['My Stuff', '我的物品'],
['Online Status', '在线状态'],
['Profile', '简介'],
['Create Avatar', '创建头像'],
['User Settings', '用户设置'],
['View Options', '查看选项'],
['Dark Mode', '黑暗模式'],
['Create a Community', '创建社区'],
['Advertise on Reddit', '在 Reddit 上做广告'],
['Premium', '高级会员'],
['Explore', '探索'],
['Help Center', '帮助中心'],
['More', '更多信息'],
['Terms & Policies', '条款与政策'],
['User Agreement', '用户协议'],
['Privacy Policy', '隐私政策'],
['Content Policy', '内容政策'],
['Moderator Code of Conduct', '版主行为准则'],
['Log Out', '退出登录'],
['OVERVIEW', '概述'],
['POSTS', '帖子'],
['COMMENTS', '评论'],
['HISTORY', '历史'],
['SAVED', '已保存'],
['HIDDEN', '隐藏'],
['UPVOTED', '已投票'],
['DOWNVOTED', '被降权'],
['Pinned Posts', '被置顶的帖子'],
['Show off that karma', '展示您的业力'],
['Pin a post from your feed using the ', '使用 '],
['at the bottom of each post', '在每篇帖子的底部'],
['OK, I GOT IT', '好了，我找到了'],
['New', '最新'],
['Hot', '热门'],
['Top', '顶部'],
['hasn\'t posted anything', '未发布任何内容'],
['Karma', '因果报应'],
['Cake day', '蛋糕日'],
['Add social link', '添加社交链接'],
['New Post', '新帖'],
['更多信息 Options', '更多信息 选项'],
['Trophy Case', '奖杯盒'],
['Two-Year Club', '两年俱乐部'],
['Verified Email', '验证电子邮件'],
['Back to Top', '返回顶部'],
['Add to Custom Feed', '添加到自定义供稿'],
['Home', '首页'],
['Your personal Reddit frontpage', '您个人的 Reddit 主页'],
['Come here to check in with your favorite communities.', '来这里查看您最喜爱的社区。'],
['Create Post', '创建帖子'],
['Create Community', '创建社区'],
['RECENT POSTS', '最新帖子'],
['Clear', '清除'],
['Privacy Policy', '隐私政策'],
['Content Policy', '内容政策'],
['English', '英语'],
['Français', '法语'],
['Italiano', '意大利语'],
['Deutsch', '德语'],
['Español', '西班牙文'],
['Português', '葡萄牙语'],
['Reddit 高级', 'Reddit 高级'],
['The best Reddit experience', '最好的 Reddit 体验'],
['Try Now', '立即尝试'],
['Help support Reddit and get VIP treatment and exclusive access', '帮助支持 Reddit，获得 VIP 待遇和独家访问权'],
['Subscriptions automatically renew', '订阅自动更新'],
['Join Reddit 高级 Today', '立即加入 Reddit 高级'],
['Ad-free Browsing', '无广告浏览'],
['Enjoy redditing without interruptions from ads', '享受无广告的 Redditing'],
['Exclusive Avatar Gear', '专属头像装备'],
['Outfit your avatar with the best gear and accessories', '用最好的装备和配件装备您的头像'],
['Members Lounge', '会员休息室'],
['Discover all the illuminati secrets in r/lounge', '在 r/lounge 探索所有光照派的秘密'],
['Custom App Icons', '自定义应用程序图标'],
['Change your app icon to something more your style', '将你的应用程序图标更改为自己的风格'],
['Subscriptions automatically renew', '订阅自动更新'],
['Custom app icons are only available through a paid Reddit 高级 subscription', '只有付费订阅 Reddit 高级才能使用自定义应用程序图标'],
['Visit the Reddit 高级 FAQs', '访问 Reddit 高级常见问题'],

['User settings', '用户设置'],
['Account', '账户'],
['Safety & Privacy', '安全与隐私'],
['Feed Settings', '反馈设置'],
['Notifications', '通知'],
['EmailsSubscriptions', '电子邮件订阅'],
['Chat & Messaging', '聊天与信息'],
['Account settings', '帐户设置'],
['ACCOUNT PREFERENCES', '帐户首选项'],
['Email address', '电子邮件地址'],
['Missing email, please update to secure your account', '缺少电子邮件，请更新以确保您的帐户安全'],
['Change', '更改'],
['账户 settings', '账户设置'],
['账户 PREFERENCES', '账户偏好'],
['电子邮件地址', '电子邮件地址'],
['更改 password', '更改密码'],
['Gender', '性别'],
['This information may be used to improve your recommendations and ads.', '此信息可能用于改进您的推荐和广告。'],
['SELECT', '选择'],
['Display language', '显示语言'],
['Select the language you\'d like to experience the Reddit interface in', '选择你希望体验的 Reddit 界面语言'],
['Note that this won\'t change the language of user-generated content and that this feature is still in development so translations and UI are still under review.', '请注意，这不会改变用户生成内容的语言，而且此功能仍在开发中，因此翻译和用户界面仍在审核中。'],
['Content languages', '内容语言'],
['Add languages you’d like to see posts, community recommendations, and other content in', '添加你希望看到的帖子、社区推荐和其他内容的语言'],
['Location customization', '地点定制'],
['Specify a location to customize your recommendations and feed', '指定地点以定制你的推荐和信息源'],
['Reddit does not track your precise geolocation data. Learn more', 'Reddit 不会追踪你的精确地理位置数据。了解更多'],
['Use approximate location', '使用近似位置'],
['based on IP', '基于 IP'],
['CONNECTED ACCOUNTS', '连接帐户'],
['Connected to Twitter', '连接到 Twitter'],
['You can now choose to share your posts to Twitter from the new post composer.', '现在，您可以选择在新的文章构成中将文章分享到 Twitter。'],
['disconnect', '断开连接'],
['Show link on profile', '在个人档案中显示链接'],
['You can show a link to your Twitter account on your profile', '您可以在个人档案中显示您的 Twitter 账户链接'],
['Connect to Apple', '连接到 Apple'],
['Connect account to log in to Reddit with', '连接帐户以登录 Reddit'],
['Connected to Google', '连接至 Google'],
['BETA TESTS', '测试版测试'],
['Opt into beta tests', '选择加入测试'],
['See the newest features from Reddit and join the r/beta community', '查看 Reddit 的最新功能，加入 r/beta 社区'],
['Opt out of the redesign', '选择退出重新设计'],
['Revert back to old Reddit for the time being', '暂时返回旧版 Reddit'],
['DELETE ACCOUNT', '删除帐户'],
['Reddit does not track your precise geolocation data', 'Reddit 不会追踪您的精确地理位置数据'],
['Woman', '女性'],
['Non-Binary', '非二元'],
['I Refer To Myself As', '我称自己为'],
['I Prefer Not To Say', '我不想说'],
['CONNECTED ACCOUNTS', '连接帐户'],
['Customize profile', '自定义简介'],
['简介 INFORMATION', '简介 信息'],
['Display name', '显示名称'],
['optional', '可选'],
['Set a display name. This does not change your username.', '设置显示名称。这不会更改您的用户名。'],
['Characters remaining', '剩余字符'],
['About', '关于'],
['A brief description of yourself shown on your profile', '显示在个人档案上的自我简介'],
['200 Characters remaining', '剩余 200 个字符'],
['Social links', '社交链接'],
['People who visit your profile will see your social links.', '访问您个人档案的人会看到您的社交链接。'],
['IMAGES', '图像'],
['Avatar and banner image', '头像和横幅图片'],
['Images must be .png or .jpg format', '图片必须为 .png 或 .jpg 格式'],
['User avatar', '用户头像'],
['Drag and Drop or Upload Banner Image', '拖放或上传横幅图片'],
['简介 CATEGORY', '简介 类别'],
['NSFW', 'NSFW'],
['This content is NSFW', '此内容为 NSFW'],
['may contain nudity, pornography, profanity or inappropriate content for those under 18', '可能包含裸体、色情、亵渎或不适合 18 岁以下人士观看的内容'],
['ADVANCED', '高级'],
['Allow people to follow you', '允许他人关注您'],
['Followers will be notified about posts you make to your profile and see them in their home feed.', '你在个人档案中发布的帖子会通知关注者，关注者也会在主页上看到这些帖子。'],
['Content visibility', '内容可见性'],
['Posts to this profile can appear in r/all and your profile can be discovered in /users', '发到此个人档案的帖子可出现在 r/all 中，您的个人档案可在 /users 中被发现。'],
['Active in communities visibility', '活跃于社区的可见性'],
['Show which communities I am active in on my profile.', '在我的个人档案上显示我活跃于哪些社区。'],
['清除 history', '清除历史'],
['Delete your post views history.', '删除您的帖子浏览历史。'],
['简介 MODERATION', '简介 修改'],
['For moderation tools please visit our', '有关审核工具，请访问我们的'],
['Posts to this profile can appear in', '该个人档案的帖子可出现在'],
['and your profile can be discovered in', '中发现您的个人资料'],
['简介 Moderation page', '简介 管理页面'],
['Manage how we use data to personalize your Reddit experience', '管理我们如何使用数据来个性化您的 Reddit 体验'],
['and control how other redditors interact with you', '并控制其他红人如何与你互动'],
['To learn more, visit our Privacy & Security FAQs', '要了解更多信息，请访问我们的隐私与安全常见问题解答。'],
['SAFETY', '安全'],
['People You’ve Blocked', '你已屏蔽的人'],
['Blocked people can’t send you chat requests or private messages', '被屏蔽的人无法向你发送聊天请求或私人信息'],
['BLOCK NEW USERADD', '阻止新用户添加'],
['Communities You\'ve Muted', '您已静音的社区'],
['Posts from muted communities won\'t show up in your feeds or recommendations', '静音社区的帖子不会显示在您的推送或推荐中'],
['MUTE NEW COMMUNITYADD', '静音新社区添加'],
['PRIVACY', '隐私'],
['Show up in search results', '显示在搜索结果中'],
['Allow search engines like Google to link to your profile in their search results', '允许 Google 等搜索引擎在搜索结果中链接到您的个人档案'],
['Personalize ads on Reddit based on information and activity from our partners', '根据我们合作伙伴提供的信息和活动，个性化 Reddit 上的广告'],
['Allow us to use information from our partners to show you better ads on Reddit', '允许我们使用合作伙伴提供的信息在 Reddit 上向您展示更好的广告'],
['SENSITIVE ADVERTISING CATEGORIES', '敏感广告类别'],
['You can limit ads about these topics', '您可以限制有关这些主题的广告'],
['We’ll do our best not to show them to you when you are signed into your Reddit account', '当您登录 Reddit 帐户时，我们会尽力不向您显示这些广告'],
['Alcohol', '酒类'],
['Dating', '约会'],
['Allowed', '允许'],
['Gambling', '赌博'],
['Pregnancy and parenting', '怀孕和育儿'],
['Weight loss', '减肥'],
['ADVANCED SECURITY', '高级安全'],
['Use two-factor authentication', '使用双因素验证'],
['Help protect your account ', '帮助保护您的账户 '],
['even if someone gets your password', '即使有人获取了您的密码'],
['by requiring a verification code and a password to log in', '登录时需要验证码和密码'],
['Manage third-party app authorization', '管理第三方应用程序授权我们如何使用数据来个性化你的 Reddit 体验'],
['Avatar and banner image', '并控制其他红人如何与你互动'],
['Images must be .png or .jpg format', '要了解更多信息，请访问我们的隐私与安全常见问题解答。'],
['User avatar', '安全'],
['Drag and Drop or Upload Banner Image', '你已屏蔽的人'],
['简介 CATEGORY', '被封鎖的人無法向你發送聊天請求或私人訊息'],

['This content is NSFW', '您已屏蔽的社区'],
['may contain nudity, pornography, profanity or inappropriate content for those under 18', '屏蔽社区的帖子不会显示在您的推送或推荐中'],
['ADVANCED', '屏蔽新社区添加'],
['Allow people to follow you', '隐私'],
['Followers will be notified about posts you make to your profile and see them in their home feed.', '显示在搜索结果中'],
['Content visibility', '允许 Google 等搜索引擎在搜索结果中链接到您的个人档案'],
['Posts to this profile can appear in r/all and your profile can be discovered in /users', '根据我们合作伙伴提供的信息和活动，个性化 Reddit 上的广告'],
['Active in communities visibility', '允许我们使用合作伙伴提供的信息在 Reddit 上向您展示更好的广告'],
['Show which communities I am active in on my profile.', '敏感广告类别'],
['清除 history', '您可以限制有关这些主题的广告'],
['Delete your post views history.', '当您登录 Reddit 帐户时，我们会尽力不向您显示这些广告'],
['简介 MODERATION', '酒类'],
['For moderation tools please visit our', '约会'],
['Directory Listing', '允许'],
['If no index file is present within a directory, the directory contents will be displayed.', '赌博'],
['Classification', '怀孕和育儿'],
['Classify items into categories via example.', '减肥'],
['Python to natural language', '高级安全'],
['Explain a piece of Python code in human understandable language.', '使用双因素验证'],
['Movie to Emoji', '帮助保护您的账户 '],
['Convert movie titles into emoji.', '即使有人获取了您的密码'],
['Calculate Time Complexity', '登录时需要验证码和密码'],
['Manage third-party app authorization', '管理第三方应用程序授权'],
['Feed settings', '馈送设置'],
['CONTENT PREFERENCES', '内容偏好'],
['Show mature', '显示成熟'],
['mature and adult images, videos, written content, and other media in your Reddit feeds and search results.', '在 Reddit 源和搜索结果中显示成熟和成人图片、视频、文字内容和其他媒体。'],
['Blur mature images and media', '模糊成熟图片和媒体'],
['Blur previews and thumbnails for any images or videos tagged as NSFW', '模糊任何标记为 NSFW 的图片或视频的预览和缩略图'],
['Not Safe for Work', '工作时不安全'],
['Enable home feed recommendations', '启用首页推荐'],
['Allow us to introduce recommended posts in your home feed.', '允许我们在您的主页内容中推荐文章。'],
['Autoplay media', '自动播放媒体'],
['Play videos and gifs automatically when in the viewport.', '在视窗中自动播放视频和 gif。'],
['Reduce Animations', '减少动画'],
['Community themes', '社区主题'],
['Use custom themes for all communities', '为所有社区使用自定义主题'],
['You can also turn this off on a per community basis.', '您也可以根据每个社区的情况将其关闭。'],
['Community content sort', '社区内容排序'],
['Choose how you would like content organized in communities you visit', '选择您希望在访问的社区中如何组织内容'],
['This will not affect global feeds such as 首页, or Popular.', '这不会影响主页或热门等全局内容。'],
['Remember per community', '记住每个社区'],
['Enable if you would like each community to remember and use the last content sort you selected for that community', '如果您希望每个社区记住并使用您上次为该社区选择的内容排序，请启用此选项。'],
['Global content view', '全局内容视图'],
['Choose how you would like content displayed in feeds. This control is also found above your feed.', '选择您希望在源中显示内容的方式。您也可以在供稿上方找到此控件。'],
['CARD', '卡片'],
['Remember per community', '记住每个社区'],
['Enable if you would like each community to remember and use the last content view you selected for that community', '如果您希望每个社区记住并使用您上次为该社区选择的内容视图，请启用此选项。'],
['Open posts in new tab', '在新标签页中打开文章'],
['Enable to always open posts in a new tab', '启用后将始终在新标签页中打开帖子'],
['POST PREFERENCES', '帖子首选项'],
['Default to markdown', '默认为标记符'],
['When posting, your input will default to markdown text instead of fancy pants', '发帖时，您的输入将默认为标记文本，而不是花哨的裤子'],
['Reduce animations on posts, comments, and feeds', '减少帖子、评论和 feed 上的动画效果'],
['Who can send you chat requests', '谁可以向你发送聊天请求'],
['EVERYONE', '所有人'],
['Who can send you private messages', '谁可以给你发私信'],
['Heads up—Reddit admins and moderators of communities you’ve joined can message you even if they’re not approved', '注意--你已加入的社区的 Reddit 管理员和版主即使未经批准，也可以给你发消息'],
['Mark all as read', '将所有内容标记为已读'],
['Mark all conversations and invites as read.', '将所有对话和邀请标记为已读。'],
['Mark as Read', '标记为已读'],
['Reddit 高级会员', 'Reddit 高级会员'],
['Reddit 高级会员 is a subscription membership that upgrades your account with extra features.', 'Reddit 高级会员是一种订阅会员资格，可为您的账户升级额外功能。'],
['SUBSCRIPTION STATUS', '订阅状态'],
['Get Reddit 高级会员 and help support Reddit.', '获取 Reddit 高级会员并帮助支持 Reddit。'],
['Notification settings', '通知设置'],
['MESSAGES', '消息'],
['Private messages', '私人信息'],
['Chat messages', '聊天信息'],
['Chat requests', '聊天请求'],
['ACTIVITY', '活动'],
['Community alerts', '社区警报'],
['Mentions of u/username', '提及 u/username'],
['Comments on your posts', '对您帖子的评论'],
['Upvotes on your posts', '对您的帖子的向上投票'],
['Upvotes on your comments', '您的评论获得的向上投票'],
['Replies to your comments', '对您评论的回复'],
['Activity on your comments', '您评论的活跃度'],
['Activity on chat posts you\'re in', '您所在聊天帖子的活跃度'],
['最新 followers', '最新追随者'],
['Awards you receive', '您获得的奖励'],
['Posts you follow', '您关注的帖子'],
['Comments you follow', '您关注的评论'],
['RECOMMENDATIONS', '推荐'],
['Trending posts', '热门文章'],
['Community recommendations', '社区推荐'],
['ReReddit', '重新编辑'],
['Featured content', '精选内容'],
['UPDATES', '更新'],
['Reddit announcements', 'Reddit 公告'],
['Post unsaved successfully', '帖子未保存成功'],
['Undo', '撤消'],



['Database Cluster', '数据库集群'],
      ['instances are good for full-duty workloads where consistent performance is important.', '实例适合对性能要求较高的全负荷工作。'],








      ['with your bank or credit card.', '.'],

    ])

    replaceText(document.body)
//   |
//  ₘₙⁿ
// ▏n
// █▏　､⺍             所以，不要停下來啊（指加入词条
// █▏ ⺰ʷʷｨ
// █◣▄██◣
// ◥██████▋
// 　◥████ █▎
// 　　███▉ █▎
// 　◢████◣⌠ₘ℩
// 　　██◥█◣\≫
// 　　██　◥█◣
// 　　█▉　　█▊
// 　　█▊　　█▊
// 　　█▊　　█▋
// 　　 █▏　　█▙
// 　　 █ ​
    const bodyObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(addedNode => replaceText(addedNode))
      })
    })
    bodyObserver.observe(document.body, { childList: true, subtree: true })

    function replaceText(node) {
      nodeForEach(node).forEach(htmlnode => {
        i18n.forEach((value, index) => {
          // includes可直接使用 === 以提高匹配精度
          const textReg = new RegExp(index, 'g')
          if (htmlnode instanceof Text && htmlnode.nodeValue.includes(index))
            htmlnode.nodeValue = htmlnode.nodeValue.replace(textReg, value)
          else if (htmlnode instanceof HTMLInputElement && htmlnode.value.includes(index))
            htmlnode.value = htmlnode.value.replace(textReg, value)
        })
      })
    }

    function nodeForEach(node) {
      const list = []
      if (node.childNodes.length === 0) list.push(node)
      else {
        node.childNodes.forEach(child => {
          if (child.childNodes.length === 0) list.push(child)
          else list.push(...nodeForEach(child))
        })
      }
      return list
    }
})();