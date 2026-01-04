// ==UserScript==
// @name         QuicklyReply-PTer (Touch Screen Ver.)
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  faster!
// @author       PTerClub-Helpers (Refactored by Architect)
// @connect      greasyfork.org
// @match        http*://pterclub.com/details.php*
// @match        https://pterclub.com/torrents.php?*
// @icon         https://pterclub.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @link         https://greasyfork.org/zh-CN/scripts/523607-quicklyreply-pter-touch-screen-ver
// @downloadURL https://update.greasyfork.org/scripts/541504/QuicklyReply-PTer%20%28Touch%20Screen%20Ver%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541504/QuicklyReply-PTer%20%28Touch%20Screen%20Ver%29.meta.js
// ==/UserScript==

// ==================== 配置区 (Configuration Area) ====================
// 在这里编辑、添加、删除或重新排序回复模板，无需修改任何逻辑代码。
const replyOptionsConfig = {
    styles: { // 新增的样式配置区
        sectionTitleColor: "#FFD700", // 区块标题颜色（金色）
        labelTextColor: "#FFFFFF",    // 选项标签默认颜色（白色）
        panelBackgroundColor: "rgba(0, 0, 0, 0.7)" // 整体面板的背景颜色（半透明黑）
    },
    // 对应视频、剧集等分类
    video_tv_etc: [
        {
            sectionTitle: "标题",
            items: [
                { value: "[*] 标题不符合 PTerClub 资源命名规范。\n　　[url=https://wiki.pterclub.com/wiki/上传规则（含标题命名及内容编辑指南）#对帖子标题的要求]点击此处进入 PTerClub 资源命名规范[/url]", label: "0day 标题" },
                { value: "[*] 主标题片名需要修正", label: "修正片名" },
                { value: "[*] 主标题分辨率需要修正", label: "修正分辨率" },
                { value: "[*] 主标题音频编码需要修正", label: "修正音轨", breakLine: true },
                { value: "[*] 标题里的“.”需要用空格替代（5.1、7.1 等中的点除外）。", label: "标题删点" },
                { value: "[*] 标题不能有中文，需要删除。\n　　[url=https://pterclub.com/forums.php?action=viewtopic&forumid=1&topicid=53]点击此处进入 PTerClub 资源命名规范[/url]", label: "标题删中文" },
                { value: "[*] 标题里的括号“()”需要用空格替代。\n　　[url=https://pterclub.com/forums.php?action=viewtopic&forumid=1&topicid=53]点击此处进入 PTerClub 资源命名规范[/url]", label: "标题删括号", breakLine: true },
                { value: "[*] 请按照 IMDb 或海报片名将标题里[b][color=red]片名[/color][/b]原有的英文标点符号补回。", label: "片名补点" },
                { value: "[*] 标题 5.1、7.1 等中的“.”需要补回。", label: "通道补点", breakLine: true },
                { value: "[*] 请查看 Info，正确填写标题的视频编码。对于 Blu-ray Discs 及其 REMUX，填写 AVC 或 HEVC；对于 WEB-DL 和 HDTV，如有 x264 或 x265 字样，填写 x264 或 x265，否则填写 H.264 或 H.265；对于 Encode，填写 x264 或 x265。\n　　[url=https://wiki.pterclub.com/wiki/上传规则（含标题命名及内容编辑指南）#.E8.A7.86.E9.A2.91.2F.E9.9F.B3.E9.A2.91_.E7.BC.96.E7.A0.81]上传规则 - 视频/音频 编码[/url]", label: "视频编码写法不正确", breakLine: true },
                { value: "[*] 标题 TrueHD 7.1 -> TrueHD 7.1 Atmos", label: "标题 TrueHD 7.1 -> TrueHD 7.1 Atmos", breakLine: true },
                { value: "[*] 未完结剧集请在主标题季数 Sxx 后添加集数 Exx", label: "未完结剧集" },
                { value: "[*] 完结剧集请删除主标题中的集数", label: "完结剧集", breakLine: true },
                { value: "[*] 副标题需要用中文写上名称和简单介绍。\n　　[url=https://pterclub.com/forums.php?action=viewtopic&forumid=1&topicid=53]点击此处进入 PTerClub 资源命名规范[/url]", label: "中文副标题", breakLine: true }
            ]
        },
        {
            sectionTitle: "标签",
            items: [
                { value: "[*] 国语资源，需要勾选“国语”标签。", label: "勾选国语" },
                { value: "[*] 没有国语音轨，不要勾选“国语”标签。", label: "不勾选国语", breakLine: true },
                { value: "[*] 粤语资源，需要勾选“粤语”标签。", label: "勾选粤语" },
                { value: "[*] 没有粤语音轨，不要勾选“粤语”标签。", label: "不勾选粤语", breakLine: true },
                { value: "[*] 资源含有中文字幕，需要勾选“中字”标签。", label: "勾选中字" },
                { value: "[*] 资料没显示有中文字幕，不要勾选“中字”标签。", label: "不勾选中字", breakLine: true },
                { value: "[*] 发种人上传了外挂中文字幕后，[b][color=red]需要[/color][/b]勾选“中字”标签。", label: "外挂中字" },
                { value: "[*] 截图无法确认是否有中字，请更换带中字字幕的截图。\n　　图床使用，请参考 [url=https://pterclub.com/forums.php?action=viewtopic&forumid=2&topicid=2865]手把手教你贴图[/url]", label: "更换中字截图", breakLine: true },
                { value: "[*] 资料没显示有英文字幕，不要勾选“英字”标签。", label: "不勾选英字" },
                { value: "[*] 请更换带中字的截图，并勾选“中字”标签。\n　　图床使用，请参考 [url=https://pterclub.com/forums.php?action=viewtopic&forumid=2&topicid=2865]手把手教你贴图[/url]", label: "截图和中字", breakLine: true },
                { value: "[*] DIY 原盘（Custom Disc），需要勾选“DIY”标签。", label: "勾选 DIY" },
                { value: "[*] DIY 标签仅限 DIY 原盘（Custom Disc）使用，不要勾选“DIY 原盘”标签。", label: "不勾选 DIY", breakLine: true }
            ]
        },
        {
            sectionTitle: "基本信息",
            items: [
                { value: "[*] 所有动画资源（包括动画电影和电视剧等），类型需要选择 Animation。", label: "动画" },
                { value: "[*] 这是电影，类型需要选择 Movie。", label: "电影" },
                { value: "[*] 这是电视剧，类型需要选择 TV Series。", label: "电视剧", breakLine: true },
                { value: "[*] 这是综艺，类型需要选择 TV Show。", label: "综艺" },
                { value: "[*] 这是纪录片，类型需要选择 Documentary。", label: "纪录片" },
                { value: "[*] 只有单独一首的音乐短片才选择 MV，演唱会或话剧等需要选择 Stage Performance。", label: "舞台演出", breakLine: true },
                { value: "", label: "", breakLine: true },
                { value: "[*] 这是 Remux 资源，质量需要选择 Remux。", label: "Remux" },
                { value: "[*] 这是压制资源，质量需要选择 Encode。", label: "压制" },
                { value: "[*] 这是网络资源，质量需要选择 WEB-DL。", label: "WEB-DL" },
                { value: "[*] 这是 TV 录制资源，质量需要选择 HDTV。", label: "HDTV", breakLine: true },
                { value: "[*] 这是 1080p 原盘资源，质量需要选择 BD Discs。", label: "蓝光原盘" },
                { value: "[*] 这是 2160p 原盘资源，质量需要选择 UHD Discs。", label: "4K 蓝光原盘" },
                { value: "[*] 这是 DVD 资源，质量需要选择 DVD Discs。", label: "DVD 原盘", breakLine: true },
                { value: "", label: "", breakLine: true },
                { value: "[*] 地区需要选择欧美（Western）。", label: "欧美" },
                { value: "[*] 地区需要选择大陆（Mainland, CHN）。", label: "大陆" },
                { value: "[*] 地区需要选择香港（HKG, CHN）。", label: "香港" },
                { value: "[*] 地区需要选择台湾（TWN, CHN）。", label: "台湾", breakLine: true },
                { value: "[*] 地区需要选择韩国（KOR）。", label: "韩国" },
                { value: "[*] 地区需要选择日本（JPN）。", label: "日本" },
                { value: "[*] 地区需要选择印度（IND）。", label: "印度", breakLine: true }
            ]
        },
        {
            sectionTitle: "链接",
            items: [
                { value: "[*] 需要补上 IMDb 链接，链接需要填写在编辑页上面的栏目里。\n　　请前往 https://movie.douban.com/ 或 https://www.imdb.com/ 查找对应的链接", label: "IMDb 链接" },
                { value: "[*] 需要补上豆瓣链接，链接需要填写在编辑页上面的栏目里。\n　　请前往 https://movie.douban.com/ 查找对应的链接", label: "豆瓣链接", breakLine: true }
            ]
        },
        {
            sectionTitle: "作者制作说明",
            items: [
                { value: "[*] 作者制作说明需要用 quote 引用代码括着。\n　　[url=https://pterclub.com/forums.php?action=viewtopic&topicid=4178&page=p32903#pid32903]点击此处进入 quote 代码相关介绍[/url]", label: "作者制作说明" },
                { value: "[*] 删除免责声明。", label: "删除免责声明", breakLine: true }
            ]
        },
        {
            sectionTitle: "内容",
            items: [
                { value: "[*] 海报缺失或显示错误，需要补图。\n　　图床使用，请参考 [url=https://pterclub.com/forums.php?action=viewtopic&forumid=2&topicid=2865]手把手教你贴图[/url] 和 [url=https://wiki.pterclub.com/wiki/图床]图床[/url]", label: "补海报" },
                { value: "[*] 请使用 PTgen 或其他工具生成规范的种子介绍，具体请参考以下教程：[url=https://pterclub.com/forums.php?action=viewtopic&forumid=2&topicid=5197]种子简介生成工具汇总[/url]", label: "补简介", breakLine: true }
            ]
        },
        {
            sectionTitle: "Info",
            items: [
                { value: "[*] 按来源质量，需要补上 BDInfo 或 MediaInfo，并使用 hide=BDInfo 或 hide=MediaInfo 引用。\n　　Info 获取请参考 [url=https://pterclub.com/forums.php?action=viewtopic&forumid=2&topicid=4178]关于视频参数（Info）的获取[/url]\n　　[url=https://pterclub.com/forums.php?action=viewtopic&topicid=4178&page=p32903#pid32903]点击此处进入 quote 代码相关介绍[/url]\n　　[url=https://pterclub.com/tags.php#quote_one]点击此处进入专属 hide 代码相关介绍[/url]", label: "补 MediaInfo/BDInfo" },
                { value: "[*] 基于 DVD 原盘结构，需要 IFO 和 VOB 文件的 MediaInfo，才能展现出一个 DVD 原盘的质量和概况。\n　　[url=https://wiki.pterclub.com/wiki/从零开始：如何发种#DVD原盘获取mediainfo特别说明]从零开始：如何发种 - DVD 原盘获取 MediaInfo 特别说明[/url]", label: "DVD 的 Info", breakLine: true },
                { value: "[*] 需要补上完整的 MediaInfo，并使用 hide=MediaInfo 引用。\n　　Info 获取请参考 [url=https://pterclub.com/forums.php?action=viewtopic&forumid=2&topicid=4178]关于视频参数（Info）的获取[/url]", label: "补完整的 MediaInfo" },
                { value: "[*] Info 需要用 BBCode 代码括着。对于 General Infomation，使用 quote 代码。\n　　[url=https://pterclub.com/forums.php?action=viewtopic&topicid=4178&page=p32903#pid32903]点击此处进入 quote 代码相关介绍[/url]\n　　[url=https://pterclub.com/tags.php#quote_one]点击此处进入专属 hide 代码相关介绍[/url]", label: "quote", breakLine: true },
                { value: "[*] Info 需要用 BBCode 代码括着。对于 MediaInfo，使用 hide=MediaInfo 代码。\n　　[url=https://pterclub.com/forums.php?action=viewtopic&topicid=4178&page=p32903#pid32903]点击此处进入 quote 代码相关介绍[/url]\n　　[url=https://pterclub.com/tags.php#quote_one]点击此处进入专属 hide 代码相关介绍[/url]", label: "hide=MediaInfo" },
                { value: "[*] Info 需要用 BBCode 代码括着。对于 BDInfo，使用 hide=BDInfo 代码。\n　　[url=https://pterclub.com/forums.php?action=viewtopic&topicid=4178&page=p32903#pid32903]点击此处进入 quote 代码相关介绍[/url]\n　　[url=https://pterclub.com/tags.php#quote_one]点击此处进入专属 hide 代码相关介绍[/url]", label: "hide=BDInfo", breakLine: true }
            ]
        },
        {
            sectionTitle: "截图",
            items: [
                { value: "[*] 请删除无法显示的图片。", label: "无法显示的图" },
                { value: "[*] 截图显示错误，需要补图；如无法补图，请删除无法显示的图片。\n　　截图方法，请参考 [url=https://pterclub.com/forums.php?action=viewtopic&forumid=2&topicid=4310]关于视频截图的简要教程[/url]\n　　图床使用，请参考 [url=https://pterclub.com/forums.php?action=viewtopic&forumid=2&topicid=2865]手把手教你贴图[/url] 和 [url=https://wiki.pterclub.com/wiki/图床]图床[/url]", label: "补截图", breakLine: true }
            ]
        },
        {
            sectionTitle: "修正",
            items: [
                { value: "[*] 种子简介请按照“海报 - 资源简介 - Info 信息 - 截图”的顺序进行。", label: "内容顺序" },
                { value: "[*] 检查 BBCode，修正错误的代码，删除多余的代码。\n　　[url=https://pterclub.com/tags.php]点击此处进入 BBCode 代码相关介绍[/url]", label: "修正 BBCode", breakLine: true }
            ]
        },
        {
            sectionTitle: "其他",
            items: [
                { value: "[*] 请参考发种流程进行学习并修改。\n　　[url=https://wiki.pterclub.com/wiki/从零开始：如何发种]从零开始：如何发种[/url]\n　　[url=https://pterclub.com/forums.php?action=viewtopic&forumid=22&topicid=3642]How to fill out the Upload Page[/url]", label: "发种不规范" },
                { value: "[*] ", label: "其他", breakLine: true },
                { value: "[*] 种子将大体按发布顺序审核，请勿催审。如果不确定种子是否符合规范，请不要发布后举报种子，可发到候选由 Helper 手动通过候选。[url=https://wiki.pterclub.com/wiki/用户分享率及等级说明]用户分享率及等级说明[/url]", label: "催审要求", breakLine: true },
                { value: "[b]你好，请参考站内类似资源，修正以下问题：[/b]", label: "需要修正", checked: true },
                { value: "[b]以下问题本次已帮忙修正，后续请多留意，谢谢：[/b]", label: "已代修改", breakLine: true },
                { value: `[b]请尽快按照提示/要求完成修改，[color=red]修改完成请及时举报自己的种子[/color]，说明已修改完成。[/b]
（若有疑问欢迎引用该评论联系 Helper，请勿无视修改意见，否则会被删种，多次无视可能会被警告或者禁止上传权限）
（欢迎使用本站的 [url=https://pterclub.com/forums.php?action=viewtopic&forumid=2&topicid=13370]种子审核脚本[/url] 自查修正，有助于提高审核通过率，强烈推荐）`, label: "需要修正", checked: true }
            ]
        }
    ],
    music_video: [
        {
            sectionTitle: "标题",
            items: [
                { value: "[*] 标题不符合 PTerClub 资源命名规范。\n　　[url=https://wiki.pterclub.com/wiki/上传规则（含标题命名及内容编辑指南）#对帖子标题的要求]点击此处进入 PTerClub 资源命名规范[/url]", label: "0day 标题" },
                { value: "[*] 标题歌名部分需按“歌手名 - 歌曲名”格式填写，注意“-”两侧各有 1 个空格。\n　　[url=https://wiki.pterclub.com/wiki/上传规则（含标题命名及内容编辑指南）#对帖子标题的要求]点击此处进入 PTerClub 资源命名规范[/url]", label: "标题缺少空格", breakLine: true },
                { value: "[*] 主标题歌名需要修正", label: "修正片名" },
                { value: "[*] 主标题分辨率需要修正", label: "修正分辨率" },
                { value: "[*] 主标题音频编码需要修正", label: "修正音轨", breakLine: true },
                { value: "[*] 标题里的“.”需要用空格替代（5.1、7.1 等中的点除外）。", label: "标题删点" },
                { value: "[*] 标题不能有中文，需要删除。\n　　[url=https://pterclub.com/forums.php?action=viewtopic&forumid=1&topicid=53]点击此处进入 PTerClub 资源命名规范[/url]", label: "标题删中文" },
                { value: "[*] 标题里的括号“()”需要用空格替代。\n　　[url=https://pterclub.com/forums.php?action=viewtopic&forumid=1&topicid=53]点击此处进入 PTerClub 资源命名规范[/url]", label: "标题删括号", breakLine: true },
                { value: "[*] 请参照海报将标题里[b][color=red]歌名[/color][/b]原有的英文标点符号补回。", label: "片名补点" },
                { value: "[*] 标题 5.1、7.1 等中的“.”需要补回。", label: "通道补点", breakLine: true },
                { value: "[*] 请正确填写标题的视频编码。对于 MV，填写 AVC 或 HEVC。\n　　[url=https://wiki.pterclub.com/wiki/上传规则（含标题命名及内容编辑指南）#.E8.A7.86.E9.A2.91.2F.E9.9F.B3.E9.A2.91_.E7.BC.96.E7.A0.81]上传规则 - 视频/音频 编码[/url]", label: "视频编码写法不正确", breakLine: true },
                { value: "[*] 副标题需要用中文写上名称和简单介绍。\n　　[url=https://pterclub.com/forums.php?action=viewtopic&forumid=1&topicid=53]点击此处进入 PTerClub 资源命名规范[/url]", label: "中文副标题", breakLine: true }
            ]
        },
        {
            sectionTitle: "标签",
            items: [
                { value: "[*] 国语资源，需要勾选“国语”标签。", label: "勾选国语" },
                { value: "[*] 没有国语音轨，不要勾选“国语”标签。", label: "不勾选国语", breakLine: true },
                { value: "[*] 粤语资源，需要勾选“粤语”标签。", label: "勾选粤语" },
                { value: "[*] 没有粤语音轨，不要勾选“粤语”标签。", label: "不勾选粤语", breakLine: true },
                { value: "[*] 资源含有中文字幕，需要勾选“中字”标签。", label: "勾选中字" },
                { value: "[*] 资料没显示有中文字幕，不要勾选“中字”标签。", label: "不勾选中字", breakLine: true },
                { value: "[*] 资料没显示有英文字幕，不要勾选“英字”标签。", label: "不勾选英字", breakLine: true }
            ]
        },
        {
            sectionTitle: "基本信息",
            items: [
                { value: "[*] 这是 Remux 资源，质量需要选择 Remux。", label: "Remux" },
                { value: "[*] 这是压制资源，质量需要选择 Encode。", label: "压制" },
                { value: "[*] 这是网络资源，质量需要选择 WEB-DL。", label: "WEB-DL" },
                { value: "[*] 这是 TV 录制资源，质量需要选择 HDTV。", label: "HDTV", breakLine: true },
                { value: "[*] 这是 1080p 原盘资源，质量需要选择 BD Discs。", label: "蓝光原盘" },
                { value: "[*] 这是 2160p 原盘资源，质量需要选择 UHD Discs。", label: "4K 蓝光原盘" },
                { value: "[*] 这是 DVD 资源，质量需要选择 DVD Discs。", label: "DVD 原盘", breakLine: true },
                { value: "", label: "", breakLine: true },
                { value: "[*] 地区需要选择欧美（Western）。", label: "欧美" },
                { value: "[*] 地区需要选择大陆（Mainland, CHN）。", label: "大陆" },
                { value: "[*] 地区需要选择香港（HKG, CHN）。", label: "香港" },
                { value: "[*] 地区需要选择台湾（TWN, CHN）。", label: "台湾", breakLine: true },
                { value: "[*] 地区需要选择韩国（KOR）。", label: "韩国" },
                { value: "[*] 地区需要选择日本（JPN）。", label: "日本" },
                { value: "[*] 地区需要选择印度（IND）。", label: "印度", breakLine: true }
            ]
        },
        {
            sectionTitle: "内容",
            items: [
                { value: "[*] 海报缺失或显示错误，需要补图。\n　　图床使用，请参考 [url=https://pterclub.com/forums.php?action=viewtopic&forumid=2&topicid=2865]手把手教你贴图[/url] 和 [url=https://wiki.pterclub.com/wiki/图床]图床[/url]", label: "补海报", breakLine: true }
            ]
        },
        {
            sectionTitle: "Info",
            items: [
                { value: "[*] 按来源质量，需要补上 BDInfo 或 MediaInfo，并使用 hide=BDInfo 或 hide=MediaInfo 引用。\n　　Info 获取请参考 [url=https://pterclub.com/forums.php?action=viewtopic&forumid=2&topicid=4178]关于视频参数（Info）的获取[/url]\n　　[url=https://pterclub.com/forums.php?action=viewtopic&topicid=4178&page=p32903#pid32903]点击此处进入 quote 代码相关介绍[/url]\n　　[url=https://pterclub.com/tags.php#quote_one]点击此处进入专属 hide 代码相关介绍[/url]", label: "补 MediaInfo/BDInfo" },
                { value: "[*] 基于 DVD 原盘结构，需要 IFO 和 VOB 文件的 MediaInfo，才能展现出一个 DVD 原盘的质量和概况。\n　　[url=https://wiki.pterclub.com/wiki/从零开始：如何发种#DVD原盘获取mediainfo特别说明]从零开始：如何发种 - DVD 原盘获取 MediaInfo 特别说明[/url]", label: "DVD 的 Info", breakLine: true },
                { value: "[*] 需要补上完整的 MediaInfo，并使用 hide=MediaInfo 引用。\n　　Info 获取请参考 [url=https://pterclub.com/forums.php?action=viewtopic&forumid=2&topicid=4178]关于视频参数（Info）的获取[/url] ", label: "补完整的 MediaInfo" },
                { value: "[*] Info 需要用 BBCode 代码括着。对于 General Infomation，使用 quote 代码。\n　　[url=https://pterclub.com/forums.php?action=viewtopic&topicid=4178&page=p32903#pid32903]点击此处进入 quote 代码相关介绍[/url]\n　　[url=https://pterclub.com/tags.php#quote_one]点击此处进入专属 hide 代码相关介绍[/url]", label: "quote", breakLine: true },
                { value: "[*] Info 需要用 BBCode 代码括着。对于 MediaInfo，使用 hide=MediaInfo 代码。\n　　[url=https://pterclub.com/forums.php?action=viewtopic&topicid=4178&page=p32903#pid32903]点击此处进入 quote 代码相关介绍[/url]\n　　[url=https://pterclub.com/tags.php#quote_one]点击此处进入专属 hide 代码相关介绍[/url]", label: "hide=MediaInfo" },
                { value: "[*] Info 需要用 BBCode 代码括着。对于 BDInfo，使用 hide=BDInfo 代码。\n　　[url=https://pterclub.com/forums.php?action=viewtopic&topicid=4178&page=p32903#pid32903]点击此处进入 quote 代码相关介绍[/url])\n　　[url=https://pterclub.com/tags.php#quote_one]点击此处进入专属 hide 代码相关介绍[/url]", label: "hide=BDInfo", breakLine: true }
            ]
        },
        {
            sectionTitle: "截图",
            items: [
                { value: "[*] 请删除无法显示的图片。", label: "无法显示的图" },
                { value: "[*] 截图显示错误，需要补图；如无法补图，请删除无法显示的图片。\n　　截图方法，请参考 [url=https://pterclub.com/forums.php?action=viewtopic&forumid=2&topicid=4310]关于视频截图的简要教程[/url]\n　　图床使用，请参考 [url=https://pterclub.com/forums.php?action=viewtopic&forumid=2&topicid=2865]手把手教你贴图[/url] 和 [url=https://wiki.pterclub.com/wiki/图床]图床[/url]", label: "补截图", breakLine: true }
            ]
        },
        {
            sectionTitle: "修正",
            items: [
                { value: "[*] 种子简介请按照“海报 - 资源简介 - Info 信息 - 截图”的顺序进行。", label: "内容顺序" },
                { value: "[*] 检查 BBCode，修正错误的代码，删除多余的代码。\n　　[url=https://pterclub.com/tags.php]点击此处进入 BBCode 代码相关介绍[/url]", label: "修正 BBCode", breakLine: true }
            ]
        },
        {
            sectionTitle: "其他",
            items: [
                { value: "[*] 请参考发种流程进行学习并修改。\n　　[url=https://wiki.pterclub.com/wiki/从零开始：如何发种]从零开始：如何发种[/url]\n　　[url=https://pterclub.com/forums.php?action=viewtopic&forumid=22&topicid=3642]How to fill out the Upload Page[/url]", label: "发种不规范" },
                { value: "[*] ", label: "其他", breakLine: true },
                { value: "[*] 种子将大体按发布顺序审核，请勿催审。如果不确定种子是否符合规范，请不要发布后举报种子，可发到候选由 Helper 手动通过候选。\n　　[url=https://wiki.pterclub.com/wiki/用户分享率及等级说明]用户分享率及等级说明[/url]", label: "催审要求", breakLine: true },
                { value: `[b]请尽快按照提示/要求完成修改，[color=red]修改完成请及时举报自己的种子[/color]，说明已修改完成。[/b]
（若有疑问欢迎引用该评论联系 Helper，请勿无视修改意见，否则会被删种，多次无视可能会被警告或者禁止上传权限）`, label: "需要修正", checked: true }
            ]
        }
    ],
    music: [
        {
            sectionTitle: "标题",
            items: [
                { value: "[*] 标题不符合 PTerClub 资源命名规范。\n　　[url=https://wiki.pterclub.com/wiki/上传规则（含标题命名及内容编辑指南）#对帖子标题的要求]点击此处进入 PTerClub 资源命名规范[/url]", label: "0day 标题" },
                { value: "[*] 主副标题需要使用“-”分隔信息，具体为“歌手 - 歌曲名”和“年份 - 格式”，注意“-”两边各需要 1 个空格。\n　　[url=https://wiki.pterclub.com/wiki/上传规则（含标题命名及内容编辑指南）#对帖子标题的要求]点击此处进入 PTerClub 资源命名规范[/url]", label: "标题缺少空格", breakLine: true },
                { value: "[*] 主标题采样位深需要修正", label: "修正采样位深" },
                { value: "[*] 主标题采样频率需要修正", label: "修正采样频率", breakLine: true },
                { value: "[*] 标题里的“.”需要用空格替代（44.1kHz 等中的点除外）。", label: "标题删点" },
                { value: "[*] 标题里的括号“()”需要用空格替代。\n　　[url=https://pterclub.com/forums.php?action=viewtopic&forumid=1&topicid=53]点击此处进入 PTerClub 资源命名规范[/url]", label: "标题删括号", breakLine: true },
                { value: "[*] 请参照海报将标题里[b][color=red]歌名[/color][/b]原有的英文标点符号补回。", label: "歌名补点" },
                { value: "[*] 标题 5.1、7.1 等中的“.”需要补回。", label: "通道补点", breakLine: true },
                { value: "[*] 副标题需要用中文写上名称和简单介绍。\n　　[url=https://pterclub.com/forums.php?action=viewtopic&forumid=1&topicid=53]点击此处进入 PTerClub 资源命名规范[/url]", label: "中文副标题", breakLine: true }
            ]
        },
        {
            sectionTitle: "标签",
            items: [
                { value: "[*] 国语资源，需要勾选“国语”标签。", label: "勾选国语" },
                { value: "[*] 非国语资源，不要勾选“国语”标签。", label: "不勾选国语", breakLine: true },
                { value: "[*] 粤语资源，需要勾选“粤语”标签。", label: "勾选粤语" },
                { value: "[*] 非粤语资源，不要勾选“粤语”标签。", label: "不勾选粤语", breakLine: true }
            ]
        },
        {
            sectionTitle: "基本信息",
            items: [
                { value: "[*] 音乐文件格式为 FLAC，质量需要选择 FLAC。", label: "FLAC" },
                { value: "[*] 音乐文件格式为 WAV，质量需要选择 WAV。", label: "WAV" },
                { value: "[*] 音乐文件格式为 ISO，质量需要选择 ISO。", label: "ISO" },
                { value: "[*] 音乐文件格式非 FLAC、WAV、ISO，质量需要选择 Other。", label: "Other", breakLine: true },
                { value: "", label: "", breakLine: true },
                { value: "[*] 地区需要选择欧美（Western）。", label: "欧美" },
                { value: "[*] 地区需要选择大陆（Mainland, CHN）。", label: "大陆" },
                { value: "[*] 地区需要选择香港（HKG, CHN）。", label: "香港" },
                { value: "[*] 地区需要选择台湾（TWN, CHN）。", label: "台湾", breakLine: true },
                { value: "[*] 地区需要选择韩国（KOR）。", label: "韩国" },
                { value: "[*] 地区需要选择日本（JPN）。", label: "日本" },
                { value: "[*] 地区需要选择印度（IND）。", label: "印度", breakLine: true }
            ]
        },
        {
            sectionTitle: "链接",
            items: [
                { value: "[*] 删除 IMDb 链接（需要将简介中的链接一并删除）。", label: "删除 IMDb 链接" },
                { value: "[*] 删除豆瓣链接（需要将简介中的链接一并删除）。", label: "删除豆瓣链接", breakLine: true }
            ]
        },
        {
            sectionTitle: "内容",
            items: [
                { value: "[*] 海报缺失或显示错误，需要补图。\n　　图床使用，请参考 [url=https://pterclub.com/forums.php?action=viewtopic&forumid=2&topicid=2865]手把手教你贴图[/url] 和 [url=https://wiki.pterclub.com/wiki/图床]图床[/url]", label: "补海报", breakLine: true }
            ]
        },
        {
            sectionTitle: "Info",
            items: [
                { value: "[*] 需要补上 Log 或频谱图。\n　　频谱图获取请参考 [url=https://pterclub.com/forums.php?action=viewtopic&forumid=25&topicid=3537]频谱图制作教程[/url] 和 [url=https://pterclub.com/forums.php?action=viewtopic&forumid=25&topicid=3914]最简频谱图制作教程[/url]", label: "补 Log 或频谱图", breakLine: true }
            ]
        },
        {
            sectionTitle: "截图",
            items: [
                { value: "[*] 请删除无法显示的图片。", label: "无法显示的图", breakLine: true }
            ]
        },
        {
            sectionTitle: "修正",
            items: [
                { value: "[*] 种子简介请按照“海报 - 资源简介 - Info 信息 - 截图”的顺序进行。", label: "内容顺序" },
                { value: "[*] 检查 BBCode，修正错误的代码，删除多余的代码。\n　　[url=https://pterclub.com/tags.php]点击此处进入 BBCode 代码相关介绍[/url]", label: "修正 BBCode", breakLine: true }
            ]
        },
        {
            sectionTitle: "其他",
            items: [
                { value: "[*] 请参考发种流程进行学习并修改。\n　　[url=https://wiki.pterclub.com/wiki/从零开始：如何发种]从零开始：如何发种[/url]\n　　[url=https://pterclub.com/forums.php?action=viewtopic&forumid=22&topicid=3642]How to fill out the Upload Page[/url]", label: "发种不规范" },
                { value: "[*] ", label: "其他", breakLine: true },
                { value: "[*] 种子将大体按发布顺序审核，请勿催审。如果不确定种子是否符合规范，请不要发布后举报种子，可发到候选由 Helper 手动通过候选。\n　　[url=https://wiki.pterclub.com/wiki/用户分享率及等级说明]用户分享率及等级说明[/url]", label: "催审要求", breakLine: true },
                { value: `[b]请尽快按照提示/要求完成修改，[color=red]修改完成请及时举报自己的种子[/color]，说明已修改完成。[/b]
（若有疑问欢迎引用该评论联系 Helper，请勿无视修改意见，否则会被删种，多次无视可能会被警告或者禁止上传权限）`, label: "需要修正", checked: true }
            ]
        }
    ]
};

/**
 * @description 根据单条项目配置，创建并返回一个包含 Checkbox 和可点击标签的 DOM 元素片段。
 * @param {object} itemConfig - 单个回复选项的配置对象, e.g., { value, label, checked?, breakLine? }
 * @param {object} styles - 从主配置中传入的样式对象。
 * @returns {DocumentFragment} 包含生成元素的安全文档片段。
 */
function createReplyOptionElement(itemConfig, styles) {
    const fragment = document.createDocumentFragment();
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'commentcheckbox';
    checkbox.style.cursor = 'pointer';
    checkbox.value = itemConfig.value;
    if (itemConfig.checked) {
        checkbox.checked = true;
    }
    const link = document.createElement('a');
    link.className = 'commentcheckbox';
    link.href = 'javascript:void(0)';
    link.textContent = itemConfig.label;
    if (styles && styles.labelTextColor) {
        link.style.color = styles.labelTextColor;
    }
    link.addEventListener('click', () => {
        checkbox.checked = !checkbox.checked;
    });
    fragment.appendChild(checkbox);
    fragment.appendChild(link);
    if (itemConfig.breakLine) {
        fragment.appendChild(document.createElement('br'));
    }
    return fragment;
}

/**
 * @description 根据完整的配置对象，渲染整个回复面板的用户界面。
 * @param {HTMLElement} container - 用于容纳所有选项的父容器元素。
 * @param {Array<object>} configSections - 包含多个区块的配置数组。
 * @param {object} styles - 从主配置中传入的样式对象。
 */
function renderReplyPanel(container, configSections, styles) {
    container.innerHTML = '';
    if (styles && styles.panelBackgroundColor) {
        container.style.backgroundColor = styles.panelBackgroundColor;
    }
    configSections.forEach(section => {
        if (section.sectionTitle) {
            const title = document.createElement('div');
            title.textContent = `-----------${section.sectionTitle}-----------`;
            if (styles && styles.sectionTitleColor) {
                title.style.color = styles.sectionTitleColor;
            }
            container.appendChild(title);
        }
        if (section.items) {
            section.items.forEach(item => {
                container.appendChild(createReplyOptionElement(item, styles));
            });
        }
    });
}


(function () {
    'use strict';
    if (window.location.href.includes("/details.php")) {

        const areaComment = document.querySelectorAll('textarea[name="body"]')[0];

        // --- 辅助函数定义区 ---
        function addComment() {
            const checks = document.getElementsByClassName('commentcheckbox');
            let checkValues = '';
            for (let i = 0; i < checks.length; i++) {
                if (checks[i].checked) {
                    checkValues += checks[i].value;
                    checkValues += '\n';
                }
            }
            areaComment.value = checkValues;
            window.scrollTo(0, document.documentElement.scrollHeight);
        }

        function comment() {
            const button = document.querySelector('input#qr');
            if (button) button.click();
        }

        function checkboxReset() {
            const checks = document.getElementsByClassName('commentcheckbox');
            const keepValues = [
                "[b]你好，请参考站内类似资源，修正以下问题：[/b]",
                "[b]请尽快按照提示/要求完成修改，[color=red]修改完成请及时举报自己的种子[/color]，说明已修改完成。[/b]"
            ];
            for (let i = 0; i < checks.length; i++) {
                const check = checks[i];
                if (check.checked && !keepValues.some(value => check.value.includes(value))) {
                    check.checked = false;
                }
            }
            areaComment.value = '';
        }

        function hideAndSeek() {
            const s = document.querySelector('#ReplyBox');
            if (!s) return;
            s.style.display = s.style.display === 'none' ? 'block' : 'none';
            clearTimeout(GM_getValue('replyBoxStateTimer'));
            GM_setValue('replyBoxStateTimer', setTimeout(() => {
                GM_setValue('replyBoxState', s.style.display);
            }, 300));
        }

        function needModification() {
            const r = document.getElementById('radio_need_edit');
            if (r) {
                r.checked = true;
                r.parentElement.firstChild.click();
            }
        }

        function torrentChecked() {
            const r = document.getElementById('radio_checked');
            if (r) {
                r.checked = true;
                r.parentElement.firstChild.click();
            }
        }

        function removeUnwantedRows() {
            const commentsTable = document.getElementById('bookmark0')?.parentNode?.parentNode?.parentNode;
            if (commentsTable) {
                for (let i = commentsTable.rows.length - 1; i >= 0; i--) {
                    const row = commentsTable.rows[i];
                    if (row.cells[0]) {
                        const cellText = row.cells[0].textContent.trim();
                        if (cellText === '猫粮奖励' || cellText === '感谢者') {
                            row.remove();
                        }
                    }
                }
            }
        }

        function attachEventListeners() {
            console.log("Attaching event listeners...");
            const acb1 = document.getElementById('acb1');
            if (acb1) acb1.onclick = addComment;
            const acb2 = document.getElementById('acb2');
            if (acb2) acb2.onclick = checkboxReset;
            const acb3 = document.getElementById('acb3');
            if (acb3) acb3.onclick = hideAndSeek;
            const acb4 = document.getElementById('acb4');
            if (acb4) acb4.onclick = needModification;
            const acb5 = document.getElementById('acb5');
            if (acb5) acb5.onclick = torrentChecked;
            const acb6 = document.getElementById('acb6');
            if (acb6) acb6.onclick = comment;
            const ahref = document.querySelectorAll('a.commentcheckbox');
            for (let i = 0; i < ahref.length; i++) {
                ahref[i].onclick = function () {
                    const checkbox = ahref[i].previousElementSibling;
                    if (checkbox) {
                        checkbox.checked = !checkbox.checked;
                    }
                };
            }
            removeUnwantedRows();
        }

        // --- 主执行逻辑 ---
        const x = document.createElement('div');
        x.style = "position: fixed; right: 0; bottom: 0; opacity: 1; z-index: 90";

        const b = document.createElement('div');
        b.innerHTML += '<input type="button" id="acb6" value="留言"/>';
        b.innerHTML += '<br>---------------------------------------------------------<br>';
        b.innerHTML += '<input type="button" id="acb1" value="添加评论"/>';
        b.innerHTML += '<input type="button" id="acb2" value="重置选项并清除评论"/>';
        b.innerHTML += '<input type="button" id="acb3" value="展开/收起"/>';
        b.innerHTML += '<br>---------------------------------------------------------';

        if (typeof GM_getValue === 'function') {
            const scriptMetaStr = GM_info.scriptMetaStr || '';
            const downloadUrlMatch = scriptMetaStr.match(/@downloadURL\s+(.*)/);
            const scriptUrl = downloadUrlMatch ? downloadUrlMatch[1] : null;
            const scriptIdMatch = scriptUrl ? scriptUrl.match(/\/scripts\/(\d+)/) : null;
            const scriptId = scriptIdMatch ? scriptIdMatch[1] : null;
            if (scriptId) {
                const currentVersion = GM_info.script.version;
                const now = Date.now();
                const lastCheckTime = GM_getValue('lastCheckTime', 0);
                if (now - lastCheckTime > 600000) {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://greasyfork.org/scripts/${scriptId}.json`,
                        onload: function (response) {
                            if (response.status === 200) {
                                const scriptData = JSON.parse(response.responseText);
                                const latestVersion = scriptData.version;
                                if (currentVersion !== latestVersion) {
                                    b.insertAdjacentHTML("afterbegin", "<br><b>检测到新版本，请更新。</b><br>");
                                }
                            }
                            GM_setValue('lastCheckTime', now);
                        }
                    });
                }
            }
        }

        const a = document.createElement('div');
        a.id = 'ReplyBox';
        a.style.maxHeight = '500px';
        a.style.maxWidth = '300px';
        a.style.overflow = 'auto';
        a.style.display = GM_getValue('replyBoxState', 'block');
        requestAnimationFrame(() => {
            a.style.opacity = '1';
            a.style.transition = 'opacity 0.3s ease';
        });

        let category = '';
        const infoTable = document.querySelector('td#outer > table');
        if (infoTable) {
            for (const row of infoTable.rows) {
                const headerCell = row.cells[0];
                const contentCell = row.cells[1];
                if (headerCell && contentCell && headerCell.textContent.trim() === '基本信息') {
                    const contentText = contentCell.textContent;
                    if (contentText.includes('质量')) {
                        const match = contentText.match(/类型.*/);
                        if (match) {
                            category = match[0].trim();
                            break;
                        }
                    }
                }
            }
        }

        const commonButtons = `<input type="button" id="acb4" value="未通过"/><input type="button" id="acb5" value="通过"/><hr>`;
        a.innerHTML = commonButtons;

        let activeConfig;
        if (category && category.match(/电影|电视剧|动画|综艺|演出|纪录片|体育/)) {
            activeConfig = replyOptionsConfig.video_tv_etc;
        } else if (category && category.match(/音乐短片/)) {
            activeConfig = replyOptionsConfig.music_video;
        } else if (category && category.match(/Music/)) {
            activeConfig = replyOptionsConfig.music;
        }

        if (activeConfig) {
            renderReplyPanel(a, activeConfig, replyOptionsConfig.styles);
        }

        x.appendChild(b);
        x.appendChild(a);
        document.body.appendChild(x);

        attachEventListeners();
    }

    if (window.location.href.includes("/torrents.php")) {
        const regex = /(第\s?[0-9]{1,4}(?!季)\s?(集|话|期)|第\s?[0-9]{1,4}-[0-9]{1,4}(?!季)\s?(集|话|期))/;
        const checkedRegex = /\[Checked by .*?\]/;
        document.querySelectorAll('a[href^="details.php?id="]').forEach(link => {
            const href = link.getAttribute('href');
            if (!/^details\.php\?id=\d+$/.test(href)) return;
            const span = link.closest('div')?.parentElement?.querySelectorAll('div')[1]?.querySelector('span');
            if (!span) return;
            let spanText = span.innerHTML.trim();
            if (regex.test(spanText)) {
                link.style.color = 'green';
            }
            if (checkedRegex.test(spanText)) {
                span.innerHTML = spanText.replace(checkedRegex, match => `<span style="color: darkblue; font-weight: bold;">${match}</span>`);
            }
            const targetTd = link.closest('table')?.closest('td')?.parentElement?.children?.[Array.from(link.closest('table').closest('td').parentElement.children).indexOf(link.closest('table').closest('td')) + 2];
            const targetText = targetTd?.querySelector('span')?.textContent.trim();
            if (targetText) {
                if (targetText.includes('分')) {
                    targetTd.style.backgroundColor = 'green';
                }
            }
        });
    }
})();