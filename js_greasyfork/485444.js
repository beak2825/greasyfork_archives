// ==UserScript==
// @name         NovelAI图像生成汉化
// @namespace    https://github.com/qiqi20020612/NovelAI-zh_CN
// @version      3.7
// @description  NovelAI图像生成的简体中文汉化脚本
// @author       Z某ZMou
// @match        https://novelai.net/image
// @match        https://novelai.net/inspect
// @icon         https://novelai.net/icons/novelai-round.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/485444/NovelAI%E5%9B%BE%E5%83%8F%E7%94%9F%E6%88%90%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/485444/NovelAI%E5%9B%BE%E5%83%8F%E7%94%9F%E6%88%90%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 获取用户设置，如果未设置则默认为启用标题修改
    var isTitleModificationEnabled = true; // 先设置一个默认值
    if (typeof GM_getValue === 'function') { // 检查 GM_getValue 是否存在且是一个函数
        isTitleModificationEnabled = GM_getValue('isTitleModificationEnabled', true);
    }

    // 设置页面语言为中文
    document.documentElement.lang = 'zh-CN';

    // 文本替换映射表 - 图像生成页面
    const imageTranslationMap = {
        // Osano
        'This website utilizes technologies such as cookies to enable essential site functionality, as well as for analytics, personalization, and targeted advertising.': '本网站使用 Cookie 等技术来实现网站的基本功能，以及进行分析、个性化和有针对性的广告。',
        'To learn more, view the following link:': '要了解更多信息，请查看以下链接：',
        'Manage Preferences': '管理偏好',
        // 'Storage Preferences': '存储偏好',
        'When you visit websites, they may store or retrieve data about you using cookies and similar technologies ': '当您访问网站时，网站可能会使用 Cookie 和类似技术',
        '. Cookies may be necessary for the basic functionality of the website as well as other purposes. You have the option of disabling certain types of cookies, though doing so may impact your experience on the website.': '存储或检索有关您的数据。网站的基本功能和其他目的可能都需要 Cookie。您可以选择禁用某些类型的 Cookie，但这样做可能会影响您在网站上的体验。',
        'Essential': '必要',
        'Required to enable basic website functionality. You may not disable essential cookies.': '为实现网站基本功能所必需。您不得禁用基本 Cookie。',
        'View Cookies': '查看 Cookie',
        'Targeted Advertising': '有针对性的广告',
        'Used to deliver advertising that is more relevant to you and your interests. May also be used to limit the number of times you see an advertisement and measure the effectiveness of advertising campaigns.  Advertising networks usually place them with the website operator’s permission.': '用于提供与您和您的兴趣更相关的广告。也可用于限制您看到广告的次数和衡量广告活动的效果。广告网络通常在征得网站运营者的同意后投放广告。',
        'Personalization': '个性化',
        'Allow the website to remember choices you make ': '允许网站记住您所做的选择',
        'such as your username, language, or the region you are in': '如您的用户名、语言或您所在的地区',
        ' and provide enhanced, more personal features. For example, a website may provide you with local weather reports or traffic news by storing data about your general location.': '，并提供更强、更个性化的功能。例如，网站可以通过存储有关您的大致位置的数据，为您提供当地天气预报或交通新闻。',
        'Analytics': '分析',
        'Help the website operator understand how its website performs, how visitors interact with the site, and whether there may be technical issues.': '帮助网站运营商了解其网站的运行情况、访客与网站的互动情况以及是否存在技术问题。',

        // 欢迎弹窗
        'There are issues connecting to the backend right now, please check your connection or try again...': '连接到后台时出现问题，请检查您的连接或重试...',
        'Welcome to NovelAI!': '欢迎来到 NovelAI！',
        'Your ': '你的',
        ' includes:': '包括：',
        '30 free high quality image generations': '免费生成30张高质量图像',
        'Full access to our latest model': '我们最新模型的完全访问权限',
        'No credit card required': '无需信用卡',
        'Start Free Trial': '开始免费体验',
        'Create an account and start for free': '创建一个账号开始免费体验',
        'Sign Up': '注册',
        'Log In': '登录',

        // 注册登录
        'Welcome back!': '欢迎回来！',
        'Ready to create your first masterpiece': '准备好开始创作您的第一幅杰作了吗',
        'Register for free and unlock ': '免费注册并解锁',
        '30 high quality': '30张高质量',
        ' generations.': '图像生成。',
        'Already have an account': '已经有账号了吗',
        'Email': '电子邮件',
        'Password': '密码',
        'Remember me': '记住我',
        'Login is remembered for 30 days': '保持登录30天',
        'Login will not be remembered': '登录不会被记住',
        'Repeat Password': '确认密码',
        'Would you like to receive emails about updates from us in the future': '您希望今后收到有关我们更新信息的电子邮件吗',
        // 'Sign In': '登录',
        // 'Start Creating!': '开始创作！',
        'Reset Password': '忘记密码',
        'NOTE:': '注意：',
        'Please take good care of your login credentials. Due to local encryption, losing your email or password results in permanently losing access to your remotely stored stories.': '请妥善保管您的登录凭证。由于数据在本地加密保存，丢失电子邮件或密码将导致永久无法访问远程存储的故事。',
        'By registering, you agree to consent to the NovelAI ': '注册即表示您同意 NovelAI ',
        'Privacy Policy and Terms of Service': '隐私政策和服务条款',
        'This site is protected by reCAPTCHA and the Google': '本网站受 reCAPTCHA 保护， Google ',
        'Privacy Policy': '隐私政策',
        'Terms of Service': '服务条款',
        'apply.': '适用。',

        // 历史记录
        'History': '历史记录',
        'Click on an image to set your settings to the ones used to generate it': '左键点击图像可以快速应用生成该图像时的原始设置',
        'except for any init image': '种子和原始图像不会被复制',
        'Delete this image': '确定要删除这张图片吗',
        'Delete it': '确认删除',
        'No, keep it': '不，取消',
        'Download ZIP': '打包下载全部图片',
        'Download all images': '确定要下载所有图像吗',
        ' This could take a while, or fail entirely, with large numbers of images.': '如果图像数量较多，可能会需要一些时间，或导致下载失败。',
        'Downloading': '正在下载',
        'images...': '张图片...',
        'Images downloaded': '图片已开始下载',

        // 个人菜单
        'Author': '作者',
        'Anonymous Trial': '游客试用',
        'Not Subscribed': '未订阅',
        'Account': '账号',
        'Account Settings': '账号设置',
        'End Session': '结束会话',
        'Logout': '退出',
        'Other': '其它',
        'Quick Start Gallery': '快速上手图库',
        'Director Tools': '导演工具',
        'Text Generation': '文本生成',
        'Tokenizer': '分词器',
        'Help': '帮助',
        'Tutorial': '教程',
        'Documentation': '文档',
        'Version ': '版本 ',

        // 快速上手图库
        'Get Started': '让我们开始吧',
        'Get Inspiration from our quick start gallery!': '从我们的快速上手图库中获取灵感！',
        'Click an image to copy the prompt.': '点击图片以复制提示词。',
        'Copied!': '已复制！',

        // 模型选择
        'New': '新增',
        'A version of our newest model trained on a curated subset of images. Recommended for streaming.': '我们最新模型的一个版本，该模型是在经过精心挑选的图像集上进行训练的。建议用于流式传输。',
        'Our newest and best model.': '我们最新、最好的模型。',
        'Legacy': '旧版',
        'Our V4 model trained on a curated subset of images. No longer recommended for use.': '我们V4模型的一个版本，该模型是在经过精心挑选的图像集上进行训练的。不再推荐使用。',
        'Our V4 model. No longer recommended for use.': '我们的V4模型。不再推荐使用。',
        'Our previous model. No longer recommended for use.': '我们以前的模型。不再推荐使用。',
        'One of our older models. No longer recommended for use.': '我们以前的模型之一。不再推荐使用。',

        // 提示词
        'Prompt': '提示词',
        'You are currently using Anime mode.': '您当前使用的是动漫模式。',
        'The mode changes the tag suggestions and adds a dataset tag to the prompt. You can click the icon to switch.': '切换模式会更改Tag建议，并在提示中添加数据集Tag。您可以点击图标进行切换。',
        'You are currently using Furry mode.': '您当前使用的是Furry模式。',
        // 'or': '或者',
        'Randomize': '随机生成',
        'Random Prompt': '随机提示词',
        // 'Quality Tags Enabled': '已启用质量优化',
        'Added to the end of the prompt:': '会在输入的提示词结尾添加以下提示词：',
        'Undesired Content': '负面提示词',
        'Reattach Undesired Content': '拼接负面提示词',
        'Detach Undesired Content': '拆分负面提示词',
        // 'UC Preset Enabled': '已启用负面提示词预设',
        'Added to the beginning of the UC:': '会在输入的负面提示词前面添加以下提示词：',
        'This prompt is using ': '输入的部分占',
        ' of the currently used ': '个Token，共使用了',
        ' tokens. Max total tokens: ': '个。该部分最大Token数：',
        'Prompt Settings': '提示词设置',
        'Add Quality Tags': '添加质量优化Tag',
        'The prompt will be used unmodified.': '不会修改提示词。',
        'Tags to increase quality will be prepended to the prompt.': '会在提示词中添加能够提高质量的Tag。',
        'Undesired Content Preset': '负面提示词预设',
        // 负面提示词预设可以在https://docs.novelai.net/image/undesiredcontent.html查看
        'Heavy': '全面',
        'Light': '精简',
        'Human Focus': '以人为本',
        'None': '无',
        'Disable Tag Suggestions': '禁用Tag建议',
        'Highlight Emphasis': '高亮强调部分',

        // 图生图
        'Add a Base Img': '上传基准图片',
        'Optional': '可选',
        'What do you want to do with this image': '您想要怎样处理这张图片',
        'Image2Image': '图生图',
        'Transform your image.': '改变您的图片。',
        'Strength': '强度',
        'Noise': '噪声',
        'Inpaint Image': '重绘图像',
        'This image has metadata': '这张图片带有元数据',
        'Did you want to import that instead': '您想要怎样导入它',
        'Characters': '角色',
        'Append': '附加',
        'Settings': '设置',
        'Import Metadata': '导入元数据',
        'Clean Imports': '清除增益',
        'Remove': '移除',
        ', add spaces after commas': '，在逗号后添加空格',

        // 角色提示词
        'Character Prompts': '角色提示词',
        'Customize separate characters.': '自定义每个角色。',
        'Click to edit a character.': '点击以编辑一个角色。',
        'Clear Random Prompt Characters': '清除随机提示词角色',
        'Add Character': '添加角色',
        'Female': '女性',
        'Male': '男性',
        'Character': '角色',
        'Position': '位置',
        'AI’s Choice': '由AI决定',
        'Character Positions': '角色位置',
        'Global': '全局',
        'Set Character ': '调整角色',
        '’s Position': '的位置',
        'Adjust': '调整',
        'Done': '完成',

        // 其他工具
        'Vibe Transfer': '氛围转移',
        'Change the image, keep the vision.': '改变图像，保留视觉。',
        'Use a variety of AI tools to edit your images.': '使用各种AI工具编辑你的图像。',
        'Normalize Reference Strength Values': '标准化参考强度值',
        'Imported': '已导入',
        'Vibe Transfer reference image': '张氛围转移参考图片',
        'Enable/Disable Vibe Transfer Reference Image': '启用/禁用氛围转移参考图片',
        'Reference Strength': '参考强度',
        'Information Extracted': '信息提取度',
        'Encoding required. This will cost': '需要编码。这将使下一次生成的成本增加',
        'on the next generation.': '。',
        'Learn more here.': '点击此处了解更多信息。',

        // 图像设置
        'Image Settings': '图像设置',
        'Normal': '中等尺寸',
        'Large': '大型尺寸',
        'Wallpaper': '壁纸（特大尺寸）',
        'Small': '小型尺寸',
        'Custom': '自定义',
        'Portrait': '竖向',
        'Landscape': '横向',
        'Square': '方形',
        'Number of Images': '生成数量',

        // AI设置
        'AI Settings': 'AI设置',
        'Reset Settings': '重置设置',
        'Reset all settings to default': '确实要恢复所有设置为默认状态吗',
        'Yes': '确定',
        'Cancel': '取消',
        'Steps': '步数',
        'Guidance': '引导值',
        'Prompt Guidance': '提示词引导值',
        'Variety': '多样性',
        'Enable guidance only after body has been formed, to improve diversity and saturation of samples. May reduce relevance.': '只应在身体形成后再启用引导功能，可以提高样本的多样性和饱和度。可能会降低相关性。',
        'Seed': '种子',
        // 'Enter a seed': '输入一个种子',
        'Sampler': '采样器',
        'Recommended': '推荐',
        'Advanced Settings': '高级设置',
        'Prompt Guidance Rescale': '缩放提示词引导值',
        'Noise Schedule': '噪声计划表',
        'N/A': '随机',

        // 生成按钮
        'Free Trial': '免费体验',
        'image generations remaining.': '张图片可生成。',
        'Seen enough': '没用够吗',
        'Check out our plans': '查看我们的计划',
        'Generate 1 Image': '生成1张图像',
        'Generate 2 Images': '生成2张图像',
        'Generate 3 Images': '生成3张图像',
        'Generate 4 Images': '生成4张图像',

        // 订阅
        'You are not subscribed!': '你还没有开通订阅！',
        'Take me there': '带我去开通',
        'The paint’s run dry.': '颜料已经干了。',
        'You need a subscription or to purchase Anlas to continue.': '您需要订阅或购买Anlas才能继续使用。',
        'Compare and pick the right plan for you.': '比较并选择适合您的计划。',
        'Subscribe': '订阅',
        'Explore': '探索',
        'Our Plans': '我们的计划',
        '/mo': '/月',
        'Unlimited Images': '无限图片',
        'Image Gen Access': '图片生成权限',
        'Access to our image generation features.': '能够使用我们的图像生成功能。',
        'Pay As You Go': '按量付费',
        'Unlimited': '无限',
        'Purchase Discount': '购买折扣',
        'The amount taken off our on-demand Anlas pricing.': '在额外购买按量付费的Anlas时享受折扣。',
        'Discount': '折扣',
        'Bonus': '奖励',
        'Free extra monthly currency for use in generating images on NovelAI.': '每月免费提供用于在NovelAI上生成图片的货币。',
        'For images of up to 1024x1024 pixels and up to 28 steps when generating a single image.': '适用于生成单幅最大1024x1024像素、最多28步数的图像。',
        'A pool of Anlas that refills each month to the amount for your subscription tier. It will only refill if you have less than the amount for your subscription tier.': 'Anlas会在每次订阅续费时按照您的层级充值。只有当您剩余的Anlas少于赠送数量时才会被重新充值。',
        'Activate a Gift Key': '激活礼品码',
        'Anlas are a form of digital currency used to enhance your image generation experience for things like higher resolutions, faster generation times, and more.': 'Anlas 是一种用于增强图像生成体验的货币，如更高分辨率、更快的生成时间等。',
        ' images†': '张图片†',
        '† At the default resolution and settings.': '†使用默认分辨率和设置。',

        // 充值Anlas
        'Purchase ': '购买 ',
        'Here you can purchase additional Anlas for training your AI Modules and for Image Generation.': '您可以在这里购买额外的Anlas，用于训练你的AI模块或生成图像。',
        'Subscription Anlas will be refilled according to your subscription every month.': '订阅Anlas会在每次订阅续费时按照您的层级充值。',
        'The discounted Anlas pricing does not undefinedto accounts with canceled or non-renewing subscriptions.': '订阅已取消或已过期的帐户不能享受Anlas折扣。',
        'Your Subscription Anlas:': '您的订阅Anlas：',
        'Your Paid Anlas:': '您的付费Anlas：',

        // 账号设置
        'User Settings': '用户设置',
        'Image Generation': '图像生成',
        'Stream Image Generation': '流式图像生成',
        'Intermediates of generating images will be streamed.': '流式传输生成图像的过程。',
        'Intermediates of generating images will not be streamed.': '生成图像的过程不会被传输。',
        'Show Streamed Images Unprocessed': '显示未完成的流式图像',
        'All streamed images will be shown unprocessed.': '显示流式传输生成图像的所有步骤。',
        'In progress streamed images will be blurred and the first few steps will not be shown.': '生成中的流式传输图像将变得模糊，并且不会显示最初的几个步骤。',
        'Automatic Download': '自动下载',
        'Images will automatically download after generation.': '图像生成完后将自动下载。',
        'Images will not automatically download after generation.': '图像生成完后不会自动下载。',
        'Interface': '界面',
        'UI Language': 'UI语言',
        'English': '英文',
        'Current Tier': '当前层级',
        'Your subscription expired on ': '你的订阅已结束于',
        'Your subscription ends on ': '你的订阅将在',
        ' and does not renew.': '到期且不会续订。',
        'Manage': '管理',
        'Pen Name': '笔名',
        'Change': '更改',
        'Delete Account': '删除账号',
        'Not possible while subscribed.': '已订阅时无法使用。',
        'Request': '请求',
        'Show Account ID': '显示账号ID',
        'Persistent API Token': '持久性API令牌',
        'Get Persistent API Token': '获取持久性API令牌',
        'Overwrite Persistent API Token': '覆盖持久性API令牌',
        'You have an existing persistent API token. Creating a new one will invalidate the old one.': '您已有一个持久性API令牌。创建一个新的会使旧的失效。',
        'Are you sure you want to overwrite it': '你确定要覆盖它吗',
        'Overwrite': '覆盖',
        'Below is a persistent API token that can be used to access the API.': '下面是可用于访问API的持久性API令牌。',
        'Show Full Token': '显示完整的令牌',
        'Note: You can only have a single persistent token at a time. Creating a new one will invalidate the old one. You will not be able to view this token again after closing this window.': '注意：一次只能拥有一个持久令牌。创建一个新的会使旧的失效。关闭此窗口后，将无法再次查看此令牌。',
        'Stay Informed.': '随时了解信息。',
        'Subscribe to our newsletter.': '订阅我们的新闻推送。',
        'You’re signed up to our newsletter.': '您已订阅我们的新闻推送。',
        'You’ll receive emails from us when we release new updates and other news.': '当我们发布新的更新或其他新闻时，您会收到我们的电子邮件。',
        'Unsubscribe': '退订',
        'Manage Cookie Preferences': '管理Cookie偏好设置',
        'Default Storage Location': '默认存储位置',
        'Local': '本地',
        'Server': '服务器',
        'New & imported stories will be saved locally only.': '新生成的故事和导入的故事只会保存在本地。',
        'New & imported stories will be saved locally and stored encrypted remotely.': '新生成的故事和导入的故事将保存在本地，并在加密后传输到远程服务器。',
        'Exporting and backing up your stories is highly recommended, should your browser cache get cleared, or if you lose access to your account.': '如果您清除浏览器缓存，或者失去了账户的访问权限，您将会无法访问。强烈建议导出并备份您的故事。',
        'Download All Stories': '下载所有故事',
        'Gift Key ': '礼品码',
        'Purchasing Disabled': '购买已禁用',
        'Gift key purchases have been removed indefinitely due to abuse.': '由于遭到滥用，购买礼品码已被无限期禁用。',
        // 'Buy New Gift Key': '购买新的礼品码',
        // 'No Gift Keys yet!': '还没有礼品码！',
        'Support': '支持',
        'Change Log': '更新日志',

        // 教程（不建议启用）
        // 'Behold, Your Canvas!': '看哪，你的画布！',
        // 'The ': '这个',
        // 'Base Prompt': '基本提示词',
        // ' box is where you enter what you want the AI to generate.': '框用来输入您希望AI生成的内容。',
        // 'Example:': '示例：',
        // 'Later, you can use the ': '之后，您可以使用',
        // ' button to manage multiple characters and even reuse them in future generations.': '按钮来管理多个角色，甚至可以在后续的生成中重复使用。',

        // 'Tags': '标签',
        // 'When you type the AI will suggest you ': '当您输入时，AI会向您推荐',
        // 'tags': '标签',
        // '. They\'re the most unique aspect of NovelAI to assist you in creating consistent images.': '。这是NovelAI最独特的地方，可以帮助您创建一致的图像。',
        // 'The AI knows a lot of stuff, and it\'s trained on simple': 'AI知道很多东西，它是根据简单的',
        // ' tags. For best results, write tags in all': '标签训练出来的。为获得最佳效果，请使用',
        // 'lower-case': '小写字母',
        // ' and separate them with a': '书写标签，并用',
        // 'comma and a space': '逗号和空格分隔',

        // 'Think of 标签 as the elements that make up images.': '把标签视为组成图像的元素。',
        // 'You can even combine ': '你甚至可以将',
        // 'natural language': '自然语言',
        // ' with': '与',
        // ' to get more detailed in your prompts.': '结合起来以完善你的提示词。',
        // 'See the little circle next to each tag': '看到每个标签旁边的小圆圈了吗',
        // ' This shows how well the AI': '这表示AI有多',
        // 'knows': '了解',
        // ' each tag.': '每个标签。',
        // 'brighter': '亮度越亮',
        // ' it is, the ': '说明AI',
        // 'more': '越了解',
        // ' the AI understands it.': '这个标签。',
        // 'Want to learn more about tags': '想了解有关标签的更多信息',
        // ' Check out our': '查看我们的',
        // 'Creating Consistent 角色': '创建一致的角色',
        // 'tutorial!': '教程！',

        // 'Strengthening & Weakening': '强化与弱化',
        // 'Brackets are used to ': '括号用于',
        // 'strengthen': '强化',
        // ' or ': '或',
        // 'weaken': '弱化',
        // 'tags for a finer control over what the AI will focus on.': '标签，以便更精细地控制AI的关注点。',
        // 'To ': '要',
        // 'strengthen': '强化',
        // ' a tag, surround it in': '标签，请用',
        // 'curly brackets': '大括号',
        // '. The more brackets you use, the stronger the effect, but too many can have some strange effects.': '将其包裹起来。使用的括号越多，效果越强，但过多的括号可能会产生一些奇怪的效果。',
        // 'Make sure you use the same amount on both sides!': '记得确保两边的括号数量相同！',
        // 'You can also ': '您也可以',
        // 'weaken': '弱化',
        // ' a tag by surrounding it in': '标签，使用',
        // 'square brackets': '方括号',
        // 'This works well for things like make-up that can sometimes turn out a little too extreme.': '这对于像化妆这样有时会显得过于极端的事情很有效。',

        // 'You can edit the ': '您可以编辑',
        // ' field to get rid of things in your images.': '字段来删除图像中的内容。',
        // 'For example, you can add ': '例如，您可以添加',
        // ' to': '到',
        // ' stop the AI from giving hats to your characters.': '以阻止AI给角色戴帽子。',

        // 'Can’t think of anything to generate': '想不出要生成什么',
        // 'Return to the Quick Start Gallery by clicking the NovelAI Logo in the top left!': '点击左上角的 NovelAI 徽标，返回快速入门图库！',
        // 'Get Inspiration from our quick start gallery.': '从我们的快速上手图库中获取灵感。',

        // 'Image Generation Basics +1': '更多图像生成基础知识',
        // 'Want to learn more basics of Image Generation': '想了解更多图像生成基础知识',
        // 'We’ve got a handy starter Tutorial Video for you!': '我们为您准备了一个简单的入门教程视频！',
        // 'We’ve also got a whole flurry of information over on the': '我们还提供了大量信息在',
        // 'Official NovelAI Docs Page!': 'NovelAI官方文档页面',
        // 'You can find these handy resources at any time under the Hamburger menu': '您可以随时在汉堡菜单下找到这些方便的资源',
        // 'That’s it for now!': '就到此为止！',
        // 'Happy creating!': '创作愉快！',

        // 'Skip Tutorial': '跳过教程',
        // 'Next': '下一步',
        // 'Finish': '完成',
    };

    // 文本替换映射表 - 检视页面
    const inspectTranslationMap = {
        'Click the upload button or drag an image into the window to check its metadata.': '点击上传按钮或将图片拖入窗口以检视其元数据。',
        'Upload Image': '上传图像',
        'This image contains no metadata.': '这张图片没有元数据。',
        'Title': '标题',
        'Description': '提示词',
        'Software': '软件',
        'Source': '模型',
        'Request Type': '请求类型',
        'Text to Image': '文生图',
        'Image to Image': '图生图',
        'Simplified': '简略',
        'Prompt': '提示词',
        'Undesired Content': '负面提示词',
        'Resolution': '分辨率',
        'Seed': '种子',
        'Steps': '步数',
        'Sampler': '采样器',
        'Prompt Guidance': '提示词引导值',
        'Prompt Guidance Rescale': '缩放提示词引导值',
        'Undesired Content Strength': '负面提示词强度',
        'Raw Parameters': '原始参数',
    };

    // 用于存放当前页面生效的翻译数据和正则表达式
    let activeTranslationMap = {};
    let regex;

    // 替换函数
    function replaceText(node) {
        // 只检查文本节点，并且内容不能是纯空格
        if (node.nodeType !== Node.TEXT_NODE || !node.nodeValue.trim()) {
            return;
        }

        // 检查当前文本节点是否位于以下任何一个不应翻译的区域内
        // .closest() 方法会从当前元素（或其父元素）开始向上查找，如果找到匹配的选择器，则返回该元素，否则返回 null
        if (node.parentElement) {
            // 规则1: 如果父元素是 <code> 标签，则不翻译。
            // 规则2: 如果父元素在任何一个排除的容器内（如输入框），则不翻译。
            if (node.parentElement.tagName === 'CODE' ||
                node.parentElement.closest('.prompt-input-box-prompt, .prompt-input-box-undesired-content, .image-prompt-suggestions')) {
                return; // 满足任一规则，立即退出函数。
            }
        }

        // 使用一个正则表达式一次性替换所有匹配到的词
        // replace函数的第二个参数可以是函数，它会对每个匹配项调用这个函数
        // 'match' 就是匹配到的英文原文（比如 'Account'）
        let replacedValue = node.nodeValue.replace(regex, (match) => activeTranslationMap[match]);

        // 只有在内容真的发生改变时才去修改 DOM，避免不必要的重绘
        if (node.nodeValue !== replacedValue) {
            node.nodeValue = replacedValue;
        }
    }

    // 遍历函数
    function traverseAndReplace(node) {
        // 创建一个TreeWalker，它能高效地只遍历文本节点！
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
        let currentNode;
        while (currentNode = walker.nextNode()) {
            replaceText(currentNode);
        }
    }

    // 修改网页标题函数 (保持不变)
    function modifyPageTitle() {
        if (!isTitleModificationEnabled) {
            return;
        }
        const currentPageUrl = window.location.href;
        if (currentPageUrl.includes('inspect')) {
            document.title = '检视图像参数 - NovelAI';
        } else {
            var originalTitle = document.title;
            document.title = '图像生成 - NovelAI';
            Object.defineProperty(document, 'title', {
                get: function () {
                    return originalTitle;
                },
                set: function (value) {
                    if (value !== originalTitle) {
                        console.log('已拦截标题修改：', value);
                    }
                }
            });
        }
    }

    // 菜单相关函数
    function updateMenuText() {
        // 只有在GM_registerMenuCommand和相关API可用时才执行菜单逻辑
        if (typeof GM_registerMenuCommand !== 'function' || typeof GM_unregisterMenuCommand !== 'function' || typeof GM_setValue !== 'function') {
            console.log('GM API not available, skipping menu command registration.'); // 在控制台打印一条信息，方便调试
            return; // 直接退出函数
        }

        var menuText = isTitleModificationEnabled ? '禁用标题修改' : '启用标题修改';
        // 为了避免重复注册，先清空旧的（虽然在这个脚本里影响不大，但是好习惯）
        if (window.myMenuCommandId) {
            GM_unregisterMenuCommand(window.myMenuCommandId);
        }
        window.myMenuCommandId = GM_registerMenuCommand(menuText, function () {
            isTitleModificationEnabled = !isTitleModificationEnabled;
            GM_setValue('isTitleModificationEnabled', isTitleModificationEnabled);
            alert('标题修改功能' + (isTitleModificationEnabled ? '已启用' : '已禁用') + '，现在页面标题' + (isTitleModificationEnabled ? '无法' : '能够') + '反映图像生成的进度。\n提示：刷新前请确保生成的图像、参数等已经被保存！');
            updateMenuText();
        });
    }

    let observer = null; // 将 observer 声明在外面，方便管理

    // 核心翻译函数，保持不变
    function translateNode(node) {
        // 使用 TreeWalker 高效遍历所有文本节点
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
        let currentNode;
        while (currentNode = walker.nextNode()) {
            replaceText(currentNode);
        }
    }

    // 启动翻译和监视
    function startTranslation() {
        console.log("关键元素已找到，开始首次全局翻译并启动 MutationObserver。");

        // 1. 对整个页面进行一次完整的初始翻译
        translateNode(document.body);
        modifyPageTitle(); // 标题修改也在这里执行

        // 2. 创建并启动 MutationObserver 来监视后续变化
        observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        // 只处理元素节点，忽略纯文本节点等
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            translateNode(node);
                        }
                    });
                }
                // 有些变化可能不是添加节点，而是改变了现有节点的文本内容
                // 虽然这种情况较少见，但为了保险起见，可以处理 characterData 变化
                if (mutation.type === 'characterData' && mutation.target.parentNode) {
                    // 只需翻译受影响的文本节点的父元素即可
                    translateNode(mutation.target.parentNode);
                }
            }
        });

        // 监视整个 body 的子节点、后代树和文本内容的变化
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true // 增加对文本内容变化的监视
        });
    }

    // 侦察兵函数：轮询检查关键元素是否存在
    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            // 元素已存在，执行回调函数
            callback();
        } else {
            // 元素不存在，设置一个定时器，稍后重试
            let intervalId; // 将 intervalId 提升作用域
            let timeoutId;  // 为超时计时器创建一个变量

            const tryToFindElement = () => {
                const element = document.querySelector(selector);
                if (element) {
                    // 找到了！清除定时器并执行回调
                    clearInterval(intervalId);
                    clearTimeout(timeoutId); // 在这里取消“保险闹钟”
                    callback();
                }
            };

            intervalId = setInterval(tryToFindElement, 200); // 每200毫秒检查一次

            // 设置一个超时，以防页面永远加载不出来，避免无限轮询
            timeoutId = setTimeout(() => { // 捕获超时计时器的ID
                clearInterval(intervalId);
                console.log(`等待关键元素 "${selector}" 超时，脚本可能无法正常工作。`);
            }, 30000); // 30秒后超时
        }
    }

    // 脚本入口
    function init() {
        updateMenuText(); // 菜单设置可以立即执行

        const pathname = window.location.pathname; // 获取当前路径，如 "/image" 或 "/inspect"

        // 根据页面路径选择不同的翻译表
        if (pathname.includes('/image')) {
            activeTranslationMap = { ...imageTranslationMap, ...inspectTranslationMap };
        } else if (pathname.includes('/inspect')) {
            activeTranslationMap = inspectTranslationMap;
        } else {
            // 如果不是目标页面，则不进行任何翻译操作
            console.log("NovelAI汉化脚本：当前页面非目标页面，不执行翻译。");
            return;
        }

        // 检查是否有可用的翻译条目
        if (Object.keys(activeTranslationMap).length === 0) {
            return; // 如果没有，则不继续
        }

        // 创建一个高效的正则表达式，一次性匹配所有需要翻译的词
        // 使用 Object.keys 获取所有要翻译的英文原文
        // 用 | 连接成一个大的 "或" 逻辑的正则
        // 1. 获取所有键并按长度从长到短排序，避免"Account"优先于"Account Settings"被匹配
        // 2. 将每个键视为一个独立的单词，用单词边界 \b 包裹
        //    注意：这里我们不能简单地在外面套一层 \b，因为有些键本身可能包含非单词字符（如 'Version '）
        //    更稳妥的方式是为每个“干净”的键添加边界。但为了简单起见，我們先用一个通用方法。
        //    一个更健壮的通用方法是把所有键用 | 连接后，再用括号包起来，然后在这个整体前后加 \b。
        //
        //    注意：在字符串中表示反斜杠 \ 需要写成 \\

        // 根据选定的翻译表，动态生成正则表达式
        regex = new RegExp(Object.keys(activeTranslationMap).sort((a, b) => b.length - a.length).join('|'), 'g');

        // 我们等待一个明确的、由React渲染出来的元素出现
        // 在 /image 页面，是提示词输入框 ('.prompt-input-box-prompt')。
        // 在 /inspect 页面，是上传按钮 (它有一个 'button' 类，我们可以用 'button.button' 来定位)。
        // 使用逗号 (,) 作为“或”选择器，等待任意一个元素出现即可触发后续的翻译流程。
        const keyElementSelector = '.prompt-input-box-prompt, button.button';
        waitForElement(keyElementSelector, startTranslation);
    }

    // 页面加载后运行脚本入口
    init();

})(); // 脚本IIFE的结束括号