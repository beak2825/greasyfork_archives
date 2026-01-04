// ==UserScript==
// @name         CSDN免登录+极简化
// @namespace    https://github.com/Gccc9
// @version      2.5
// @description  CSDN极简化
// @author       Gccc9
// @match        *://*.blog.csdn.net/*
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/381488/CSDN%E5%85%8D%E7%99%BB%E5%BD%95%2B%E6%9E%81%E7%AE%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/381488/CSDN%E5%85%8D%E7%99%BB%E5%BD%95%2B%E6%9E%81%E7%AE%80%E5%8C%96.meta.js
// ==/UserScript==

// 需要移除的UI列表(只是display:none !important)
var removeList = [
    '.passport-login-tip-container',// 右下角登录
    '#mainBox aside',    //文章左侧信息框
    '#dmp_ad_58',        //评论上方的广告
    '.recommend-right',  //文章右侧信息框
    '.recommend-ad-box', //底部相关文章里面的广告
    '.type_hot_word',    //底部相关文字里面的热词提示
    '.recommend-box',     //底部相关文章
    '.pulllog-box',     //底部蓝色flex属性的广告栏+登录注册框
    '#article_content > a > img',
    '.hide-article-box',
    '.hide-preCode-box', // 隐藏代码段内被折叠的下拉的按钮
    '#treeSkill',  //文章底部技能树
    '#recommendNps', // 文章底部的好评差评 -- “您愿意向朋友推荐CSDN博客吗？”
    '.template-box', //文章底部显示的当前皮肤主题所有者
    '#copyright-box', // 文章底部版权信息
    '#blogColumnPayAdvert', //文章主题收录于哪个专栏
    '.toolbar-advert',      //header栏的广告
    '.passport-login-container', //登录框和黑色透明遮挡层,想要登录的话随便点开一个要登录的地方跳转到新的页面登录。
    '.tool-active-list', // 底下"觉得还不错？一键收藏"的提示框
    '.recommend-ask-box', // 底下"向C知道追问搜索框"
    '.csdn-side-toolbar > *:not(:last-child)', // 将右侧除了回到顶部的其他工具按钮去掉
    '.csdn-toolbar-creative-mp', // 右侧发文章得原力分弹出框
    '.write-guide-buttom-box', // 底部->"阅读终点，创作起航，您可以撰写心得或摘录文章要点写篇博文"

    // -----------------移动端-----------------------
    '.feed-Sign-weixin', // "打开CSDN"按钮 "小程序看全文"按钮
    '.btn_open_app_prompt_div', // 打开CSDN APP,看更多技术内容
    '.read_more_mask', // "打开CSDN APP,看更多技术内容"的遮罩层去除.
    '.mask-lock-box', // Jiawei011提交的移动端移除样式 -> 登录解锁
    '#recommend', // Jiawei011提交的移动端移除样式 -> 推荐
];
// 需要修改样式的列表
var changeList = [
    //查看文章全文
    ".article_content{height:auto !important;max-height:unset !important;}",
    //导航栏位置修改
    "#csdn-toolbar > .container{width: 30% !important}",
    // 文章去除右外边距居中
    "#mainBox{margin-right: 0;}",
    //文章宽度修改
    "#mainBox > main{width: 100% !important}",
    //返回顶部位置修改
    "div.meau-gotop-box{left: unset !important;}",
    //文章底部评论
    "div.comment-list-box{max-height: unset !important}",
    //增加文章主题的顶部内上边距和底部的内下边距
    "article { padding-top: 32px !important; padding-bottom: 80px; !important;}",
    //底部文章的点赞收藏作者页从fixed改为static
    ".left-toolbox{ position:static !important}",
    //代码自动展开
    ".set-code-hide{height: auto !important; overflow-y: hidden !important;max-height: unset !important;}",
    // 代码可以拖动复制
    "code { user-select: text !important}",
]

// 存放所有需要变动的CSS样式.
let style = "";
// 移除UI的显示
for (let str of removeList) {
    style += str+"{display:none !important;}";
};
// 修改UI的样式
for (let str of changeList) {
    style += str;
};

// 在整个文档前插入修改后的XML样式表.
document.insertBefore(
    document.createProcessingInstruction('xml-stylesheet','type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(style) + '"'),
    document.documentElement
);


// 检测所有元素的变动，此处检测的是复制按钮是否被动态初始化完毕了，直到他初始化完毕，马上对其进行修改.
// window.onload之后再取消该观测。
var os = new MutationObserver((recordArray) => {
    recordArray.forEach((record) => {
        // 排除变动的元素不是pre元素和childList类型的变动
        if (record.target.nodeName != "PRE" || record.type != "childList") {
            return;
        }
        // e为每一个改动过的Element
        record.addedNodes.forEach((e) => {
            // 判断是否为黑框的复制代码段(mdcp)
            if (e.tagName == "CODE") {
                let mub = new MutationObserver((i) => {
                    // 取消复制限制
                    HoverSignInFunc();
                    // 想要修改的对象
                    let el = i[0].target.getElementsByClassName("signin")[0];
                    if (i[0].attributeName == "data-title") {
                        SetCopyBtnText(mub, i[0].target, "复制成功");
                        // 3秒后改恢复成“复制”
                        setTimeout(() => {
                            SetCopyBtnText(mub, i[0].target, "复制");
                        }, 3e3);
                    }
                    if (typeof (el) == 'undefined') {
                        return
                    }
                    SetCopyBtnText(mub, el, "复制");
                });
                mub.observe(e, {
                    // subtree: true,
                    // childList: true,
                    attributes:true,
                });
                return;
            }
            // 判断是否为白框的复制代码段(hljs) 有没有signin类,有则是要修改的按钮.
            if (e.className.indexOf("signin") != -1) {
                // 取消复制限制
                HoverSignInFunc();
                // 修改按钮的文本显示
                e.setAttribute("data-title", "复制");
                // 观察该代码段是否被点击了复制 i为触发的record数组，这里取第一个就行。
                let mu = new MutationObserver((i) => {
                    // 判断是否为代码段
                    if (i[0].attributeName == "data-title") {
                        SetCopyBtnText(mu, i[0].target, "复制成功");
                        // 3秒后改恢复成“复制”
                        setTimeout(() => {
                            SetCopyBtnText(mu, i[0].target, "复制");
                        }, 3e3);
                    }
                });
                // 开始检测复制按钮的属性有无被改变
                mu.observe(e, {
                    attributes: true,
                });
            }
        })
    });
});

//启动所有节点的检测
os.observe(document.getRootNode(), {
    subtree: true,
    childList: true,
    characterData:true,
});

//加载完成后关闭所有节点的检测
window.onload = function () {
    os.disconnect();
    // 去除复制限制
    $("#content_views").unbind("copy")
    csdn.copyright.init($("main .blog-content-box")[0],"")
};


// mutationObserver观测对象 node节点为需要观测的节点,text为需要修改的属性的文本。
function SetCopyBtnText (mutationObserver, node, text) {
    // 先取消检测，防止自己设置的时候递归触发
    mutationObserver.disconnect()
    // 修改复制按钮的提示文本
    // node.setAttribute("data-title", text);
    node.dataset.title = text;
    // 重新检测.
    mutationObserver.observe(node, {
        attributes: true,
    });
}

// 覆盖掉登录的函数为copyCode函数
function HoverSignInFunc () {
    // 取消复制限制
    typeof(mdcp) != 'undefined' ? (mdcp.signin = mdcp.copyCode) : null;
    typeof (hljs) != 'undefined' ? (hljs.signin = hljs.copyCode) : null;
}