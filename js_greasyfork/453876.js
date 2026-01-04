// ==UserScript==

// 脚本的名称
// @name        ZeroTier汉化

// 脚本的版本
// @version        1.0

// 脚本作者
// @author        bosket

// 描述
// @description        ZeroTier 网站 页面汉化
// @description:zh-cn        ZeroTier 网站 页面汉化

// 低分辨率的脚本图标
// @icon

// 包括，脚本应该运行的页面。允许多个标签实例。
// @include 
// @include 

// 匹配 URL，可多个，如：https://my.zerotier.com/login
// @match        *://accounts.zerotier.com/auth/realms/zerotier/protocol/openid-connect/auth?*
// @match        *://my.zerotier.com*

// 排除 URL，即使它们包含在 @include 或 @match 中。
// @exclude

// 授予，用于将 GM_* 函数、unsafeWindow 对象和一些强大的窗口函数列入白名单。如果没有给出@grant 标签，TM 会猜测脚本需要。
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue

// 命名空间
// @namespace        https://greasyfork.org/zh-CN/scripts/453876-zerotier%E6%B1%89%E5%8C%96

// 作者主页
// @homepage       https://greasyfork.org/zh-CN/users/976103-bosket


// @license      GPL-3.0 License

// 运行于，注入脚本的时刻
// @run-at        document-end

// 连接
// @connect        github.com
// @connect        raw.fastgit.org
// @connect        localhost

// @downloadURL https://update.greasyfork.org/scripts/453876/ZeroTier%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/453876/ZeroTier%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==
 
var allNodes = document.body.querySelectorAll('*')
 
var allNodeArr = Array.from(allNodes)
 
var textObj = {
 
    "@version": "1.0",
 
    //首页
 
    "Log In": "登陆",
    "Email": "邮箱",
    "Password": "密码",
    " Remember me": "记住我",
    "Forgot Password?": "忘记密码？",
    "Or sign in with": "或使用下面登录",
    "New User?": "新用户？",
    "Sign Up": "注册",

    //搜索页
 
    "Create A Network": "创建一个网络",
    "Your Networks": "你的网络",
    "Networks": "网络数",
    "Authorized Nodes": "已授权节点",
    "SEARCH": "搜索",
    "Networks...": "个网络",
    "NETWORK ID": "网络 ID",
    "NAME": "名称",
    "DESCRIPTION": "描述",
    "SUBNET": "子网",
    "NODES": "节点",
    "CREATED": "创建于",
 
    //视频
 
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
    "Users who viewed these videos also watched": "?其他用户也观看了这些视频?",
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
 
var excutNode = ['IMG','BR','HR','FORM','SELECT','OPTION','INPUT','SCRIPT','STYLE','ts','label']
 
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