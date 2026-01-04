// ==UserScript==
// @name         Yandex 页面汉化
// @version      1.2
// @author       Soyu
// @description Yandex 网站 页面汉化
// @description:zh-cn Yandex 网站 页面汉化
// @icon         
// @match        *://yandex.com/*
// @match        *://*.yandex.com/*
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @namespace        https://greasyfork.org/zh-CN/scripts/438870-yandex-%E9%A1%B5%E9%9D%A2%E6%B1%89%E5%8C%96
// @homepage       https://greasyfork.org/zh-CN/users/574311-soyuzom
// @license      GPL-3.0 License
// @run-at        document-end
// @connect        github.com
// @connect        raw.fastgit.org
// @connect        localhost
// @downloadURL https://update.greasyfork.org/scripts/438870/Yandex%20%E9%A1%B5%E9%9D%A2%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/438870/Yandex%20%E9%A1%B5%E9%9D%A2%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

var allNodes = document.body.querySelectorAll('*')

var allNodeArr = Array.from(allNodes)

var textObj = {

    "@version": "1.1",

    //首页

    "Bahasa Indonesia": "巴哈萨",
    "Exit": "退出",
    "Maps": "地图",
    "AppMetrica": "应用分析",
    "Browser": "浏览器",
    "Finds everything": "搜索一切",
    "Technologies": "技术支持",
    "About Yandex": "关于Yandex",
    "Terms of Service": "服务条款",
    "Privacy Policy": "隐私政策",
    "Contact us": "联系我们",
    "Copyright Notice": "版权公告",
    "": "",

    "Yandex in": "国家区域站点",
    "Russia": "俄罗斯",
    "Ukraine": "乌克兰",
    "Belarus": "白俄罗斯",
    "Kazakhstan": "哈萨克斯坦",
    "Uzbekistan": "乌兹别克斯坦",
    "Turkey": "土耳其",
    	
    //设置页
    "Account": "账户",
    "Advertising": "广告",
    "Search settings": "搜索设置",
    "Search suggestions": "搜索建议",
    "Show sites that you frequently visit": "显示您经常访问的网站",
    "Your favorite sites will appear first in the list of search hints along with an icon and a short description to make them more noticeable. ": "您喜欢的网站将首先出现在搜索提示列表中，并附有图标和简短描述，以使其更加明显。",
    "Filter search results": "过滤搜索结果",
    "With Yandex search you can find any information available on the internet. Yandex offers different filtering modes to help you avoid unwanted content in search results:": "通过Yandex搜索，您可以在互联网上找到任何可用的信息。Yandex提供了不同的过滤模式，以帮助您避免搜索结果中不需要的内容：",
    "No filter": "无过滤",
    "Moderate filter": "中等",
    "Family search": "家庭",
    "Save": "保存",
    "Back": "返回",

    "Ad settings": "广告设置",
    "Home page and new Yandex Browser tab": "主页和新的Yandex浏览器选项卡",
    "Show ads": "展示广告",
    "Take my interests into account": "考虑我的兴趣",
    "Use my location": "使用我的位置",
    "Back": "返回",



    //搜索页

    "Search": "搜索",
    "Advanced search": "高级搜索",
    "Web": "网页",
    "Images": "图片",
    "Video": "视频",
    "News": "新闻",
    "Translate": "翻译",
    "Disk": "硬盘",
    "Mail": "邮件",
    "Ads": "广告",
    "In Singapore": "在新加坡",
    "Last 24 hours": "24小时",
    "Past 2 weeks": "2周+",
    "Past month": "一个月+",
    "Russian": "俄语",
    "English": "英语",
    "More": "更多",
    "Clear": "清除",
    "Bing": "必应",
    "Google": "谷歌",
    "Beijing": "北京",
    "Hong Kong": "香港",
    "Settings": "设置",
    "Feedback": "反馈",
    "Turn off Family search": "关闭家庭搜索",
    "Back to top": "第一页",
    "next": "下一页",

    //搜图
    "Size": "大小",
    "Any size": "全部",
    "Large": "大",
    "Medium": "中",
    "Small": "小",
    "OK": "确定",

    "Orientation": "方向",
    "Any orientation": "任何方向",
    "Horizontal": "横屏",
    "Vertical": "垂直",
    "Square": "宽屏",

    "Type": "类型",
    "Any type": "任何类型",
    "Photos": "照片",
    "White background": "白色背景",
    "Drawings and sketches": "图纸草图",
    "People": "人物",
    "Demotivators": "激励",

    "Color": "颜色",
    "Any color": "任何颜色",
    "Color images only": "仅限颜色图片",
    "Black and white": "黑白",

    "File": "文件",
    "Any file": "任何文件",
    "Recent": "最近",
    "On this site": "指定网站",
    "Site URL": "网址",
    "Reset": "重置",

    //视频

    "See also": "猜你喜欢",
    "Users who viewed these videos also watched": "‎其他用户也观看了这些视频‎",
    "HD": "超清",
    "Any duration": "任何时常",
    "Less than 10 minutes": "10分钟以内",
    "10-65 minutes": "10-65分钟",
    "More than 65 minutes": "65分钟以上",

    //硬盘
    "Telemost": "电话会议",
    "Calendar": "日历",
    "Notes": "笔记",
    "Contacts": "联系人",
    "Messenger": "信息",

    //翻译
    "Text": "文字",
    "Sites": "网站",
    "Documents": "文档",
    "Images": "图片",
    "For business": "商用",
    "Translate in Google": "使用谷歌翻译",
    "report error": "错误报告",
    "Mobile version": "移动版",
    "Developers": "开发者",
    "User Agreement": "用户协议",
    "Popular translations": "热门翻译",
    "Help": "帮助",







    "yyy": "收尾"
}

var excutNode = ['IMG','BR','HR','FORM','SELECT','OPTION','INPUT','SCRIPT','STYLE','ts']

console.time('translate')
allNodeArr.forEach(item=>{
    if (item.childNodes && !excutNode.includes(item.nodeName)) {
        item.childNodes.forEach(item => {
            if(item.nodeName === '#text'){
                var text = textObj[item.data]
                if(text){
                    item.data = text
                }

            }
        })
    }
})
console.timeEnd('translate')
