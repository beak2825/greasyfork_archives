// ==UserScript==
// @name         喵呜简易辅助
// @version      2.6.7.1
// @description  用于喵呜动漫网站快速发帖，顺带美化一下界面。为编辑器添加 MarkDown 语法支持。
// @author       Ming
// @match        *://meows.com.cn/*
// @match        *://bgm.tv/subject/*
// @match        *://bgm.tv/subject_search/*
// @icon         https://lain.bgm.tv/pic/user/s/icon.jpg
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11.4.7/dist/sweetalert2.all.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/marked@4.0.12/lib/marked.umd.js
// @require      https://cdn.jsdelivr.net/npm/vue@3.2.31/dist/vue.global.prod.js
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @grant        unsafeWindow
// @license      GPL-3.0
// @namespace    https://greasyfork.org/users/890367
// @downloadURL https://update.greasyfork.org/scripts/441860/%E5%96%B5%E5%91%9C%E7%AE%80%E6%98%93%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/441860/%E5%96%B5%E5%91%9C%E7%AE%80%E6%98%93%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

/*
 提示：
 -- 请用 Tampermonky 安装此脚本

 前言：
 -- 使用前请先看教程
 -- 发现 Bug 可在 GreasyFork 或 喵呜动漫 反馈
 -- 如果您想加入这个项目并成为贡献者，请通过 QQ 群联系我。

 ToDo:
 -- 脚本全局设置
 -- 美化设置
 -- 更多自定义模板选项

 已知问题 ：
 -- 1. 模板中简介有时复制不成功 (2022.3.28)
 -- 2. 页面失去焦点有时标题错误 (2022.3.31)
 -- 3. 同时打开多个发布页标签和摘要错乱 (2022.4.3)
 -- 4. 移除所有标签功能可能失效 (2022.4.3)
 -- 5. 登录状态下有时显示未登录 (2022.4.3)

 更新日志：
 -- 2.6.7.1
 ---- 1. 修复搜索
*/

GM_setValue('version', "2.6.7")
var usageDocumentURL = "https://meows.com.cn/?p=6592"
var templateSourceDefault = `@![#中文名#](#图片地址#)@
@<p style="text-align: center"><span style="font-size: 14pt"><strong>#中日名称#</strong></strong></span></p>@
@[infobox title=简介]
#简介#
[/infobox]@
@[infobox title=标签]
#标签#
[/infobox]@
@[infobox title=详情]
#详情#
[/infobox]@
[infobox title=下载]
**【字幕组】**
合集
[ypbtn]【网盘链接】[/ypbtn]
[/infobox]`
var templateSource = templateSourceDefault
// printValue()
const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2200,
    timerProgressBar: true
})
function cssSlct(Selector) { return document.querySelector(Selector) }
function idSlct(Selector) { return document.getElementById(Selector) }
function cssSlctAll(Selector) { return document.querySelectorAll(Selector) }
var _wr = function(type) {
   var orig = history[type];
   return function() {
       var rv = orig.apply(this, arguments);
      var e = new Event(type);
       e.arguments = arguments;
       window.dispatchEvent(e);
       return rv;
   };
};
history.pushState = _wr('pushState');
//history.replaceState = _wr('replaceState');
//window.addEventListener('replaceState', function(e) {
//  console.log('THEY DID IT AGAIN! replaceState 111111')
//})
window.addEventListener('pushState', function(e) {
  console.log('THEY DID IT AGAIN! pushState 2222222')
    main()
})
var pageDomain = document.domain, pageURL = document.URL
if (pageDomain == "meows.com.cn" && pageURL.indexOf(".php") == -1) {
    removeAnnoyingPopupText() //去除点击文字
    dontChangeMyPageTitle() //不改变网页标题 bug
    removeCopyPrompt()
    addUserInfo() //向body添加用户信息
    addUsername() //获取昵称
    addAvatar() //添加头像
    addSearchBar() //添加搜索栏
    //顶栏高度 样式设置
    GM_addStyle("#kratos-menu-wrap{height: 50px}")
    GM_addStyle("#kratos-primary-menu{height: 100%}")
    GM_addStyle("#kratos-primary-menu li{height: 100%; display: flex; align-items: center}")
    GM_addStyle("#kratos-header-section{backdrop-filter: blur(5px)}") //顶栏模糊
    GM_addStyle(".astm-search-menu{display: none!important}")
}
main()
function main() {
    pageDomain = document.domain, pageURL = document.URL
    if (!GM_getValue("firstUse")) showTips()
    if (pageDomain == "meows.com.cn") {
        GM_addStyle('html{-webkit-filter: grayscale(0)}')
        if (pageURL.indexOf("wp-admin/post-new.php") != -1) {
            GM_setValue("template", "") //清空复制的模板，为了监听变化
            GM_addStyle('#ed_toolbar,#categorydiv,#tagsdiv-post_tag,#submitdiv,#major-publishing-actions, #formatdiv, #postexcerpt, #postimagediv{border-radius: 5px}') //界面圆角
            GM_addStyle('#post-status-info,#category-all{border-bottom-left-radius: 5px;border-bottom-right-radius: 5px}') //圆角
            GM_addStyle('#wp-content-editor-container{border-top-left-radius: 5px}')
            GM_addStyle('.update-nag.notice.notice-warning.inline,#contextual-help-link-wrap,#postexcerpt .inside p{display: none}') //去更新提示
            //底部搜索页
            let bgmIframe = document.createElement("iframe")
            bgmIframe.style.cssText = 'height: 280px; width: 100%; margin-top: 15px; border-radius: 5px; box-shadow: rgb(170, 170, 170) 0px 0px 3px; display: none'
            bgmIframe.id = "bgmframe"
            cssSlct("#postdivrich").append(bgmIframe)
            cssSlct(".wrap .wp-heading-inline").style.display = "none"
            let settingPosition = cssSlct('.wp-header-end') //定位
            let settingBar = document.createElement("div")
            settingPosition.parentElement.insertBefore(settingBar, settingPosition)
            settingBar.innerHTML = `<div>
                <h1 class="wp-heading-inline">撰写新文章</h1>
                <button id="templateButton" class="button" style="font-size: 14px; margin-top: 10px; margin-left: 2px;">模板</button>
                <button id="settingsButton" class="button" style="font-size: 14px; margin-left: 10px; margin-top: 10px;">设置</button>
                <button id="summaryButton" class="button" style="font-size: 14px; margin-top: 10px; margin-left: 10px; display: ${GM_getValue('showSummaryButton') ? 'inline' : 'none'};">从模板生成摘要</button>
                <button id="markdownButton" class="button" style="font-size: 14px; margin-top: 10px; margin-left: 10px; display: ${GM_getValue('showMarkdownButton') ? 'inline' : 'none'};">解析 MarkDown 语法</button>
                <button id="removeTagsButton" class="button" style="font-size: 14px; margin-top: 10px; margin-left: 10px; display: ${GM_getValue('showRemoveTagsButton') ? 'inline' : 'none'};">删除所有标签</button>
                <button id="summaryAndTagsButton" class="button" style="font-size: 14px; margin-top: 10px; margin-left: 10px; display: ${GM_getValue('showSummaryAndTagsButton') ? 'inline' : 'none'};">同时生成摘要和标签</button>
                <button id="hideIframeButton" class="button" style="font-size: 14px; margin-top: 10px; margin-left: 10px; display: none;">隐藏搜索页</button>
                </div>` //一堆按钮
            var showIframe = false
            idSlct("templateButton").onclick = function () { templateClick() } //模板
            idSlct("settingsButton").onclick = function () { meowPostSettings() } //设置
            idSlct("summaryButton").onclick = function () { getSummaryFromTmp(); setCoverPic(); } //从模板生成摘要
            idSlct("markdownButton").onclick = function () { cssSlct("#content").value = marked.parse(cssSlct("#content").value) } //解析 MarkDown 语法
            idSlct("removeTagsButton").onclick = function () { removeTags() } //删除所有标签
            idSlct("summaryAndTagsButton").onclick = function () { getTagsFromTmp(); getSummaryFromTmp(); setCoverPic(); } //同时生成摘要和标签
            idSlct("hideIframeButton").onclick = function () { //隐藏搜索页
                showIframe = !showIframe
                if (showIframe) {
                    idSlct("hideIframeButton").innerText = "隐藏搜索页"
                    $("#bgmframe").fadeIn(250)
                } else {
                    idSlct("hideIframeButton").innerText = "显示搜索页"
                    $("#bgmframe").fadeOut(250)
                }
            }
            let tagsButton = cssSlct('#link-post_tag') // 从模板自动添加标签
            tagsButton.className = "button"
            tagsButton.innerText = "从模板自动添加标签"
            tagsButton.onclick = function () { getTagsFromTmp() }
            GM_addValueChangeListener("template", function (name, old_value, new_value) { // 脚本猫内无效
                if (new_value.indexOf("[infobox title=下载]") > 0 && new_value.lastIndexOf('[/ypbtn]') > new_value.indexOf("[infobox title=下载]")) {
                    idSlct("content").value = new_value
                    if (new_value.indexOf("[infobox title=标签]") != -1) getTagsFromTmp()
                    if (new_value.indexOf('[infobox title=详情]') != -1) getSummaryFromTmp()
                    setCoverPic()
                }
            })
            document.addEventListener('paste', function (e) { //监听复制
                e.clipboardData.items[0].getAsString(text => {
                    if (GM_getValue('pasteAndGetTmp'))
                        if (text.indexOf('[infobox title=下载]') > 0 && text.lastIndexOf('[/ypbtn]') > text.indexOf('[infobox title=下载]')) {
                            if (text.indexOf('[infobox title=标签]') != -1) getTagsFromTmp()
                            if (text.indexOf('[infobox title=详情]') != -1) getSummaryFromTmp()
                            setCoverPic()
                        }
                })
            })
        } else if (pageURL.indexOf("wp-login.php") != -1) { //登录、注册页
            if (GM_getValue("enableBingPic")) GM_addStyle("body{background: #92C1D1 url(https://bing.biturl.top/?resolution=1920&format=image&index=0&mkt=zh-CN)!important}") //Bing 每日一图
            GM_addStyle("#login form{border-radius: 10px; backdrop-filter: blur(6px); box-shadow: #14141460 0 0 14px!important}") //登录框样式
            GM_addStyle("#login{box-shadow: 0 0 3px 0 #333333e0}!important") //栏
            if (pageURL.indexOf("action=register") != -1) { //注册
                GM_addStyle("#login .button-primary{margin-top: 30px}") //注册按钮位置
                autoVerificationCode() //自动输入验证码
            } else if (pageURL.indexOf("action=") == -1) { //登录
                cssSlct("#rememberme").checked = true //保持登录
                setTimeout(function () { //如果浏览器保存了密码，自动登录
                    if (cssSlct("#user_login").value != "" && cssSlct("#user_pass").value != "")
                        cssSlct("#wp-submit").click()
                }, 80)
            }
        } else if (pageURL.indexOf("/?p=") != -1) { //文章页
            GM_addStyle("div.comment-author.vcard div,.kratos-copyright.text-center.clearfix,.Donate,.Share,.required-field-message,.fn:before{display: none!important}") //隐藏坐着、等级、打赏、分享
            GM_addStyle("cite.fn{padding-left: 0px}") //昵称相对位置
            GM_addStyle(".comments-area .comment-awaiting-moderation, .comments-area .comment-meta, .comments-area .fn{margin-left: 70px}") //昵称、时间位置
            GM_addStyle(".comment:not([class*='has-feedback']), .kratos-hentry, #respond, #article-index{box-shadow: 0 2px 10px #e0e0e0!important; border-radius: 15px}") //评论圆角、阴影
            GM_addStyle("#article-index{z-index: 99}") //文章目录 置顶
            GM_addStyle(".panel{border-radius: 12px}") //各类容器 圆角
            GM_addStyle(".panel-heading{border-top-left-radius: 10px; border-top-right-radius: 10px}") //各类容器标题 圆角
            GM_addStyle(".Love, .nav-previous, .nav-next{border-radius: 100px!important}") //点赞、上一篇、下一篇 圆角
            GM_addStyle(".navigation.post-navigation{margin-left: -10px; margin-right: -10px}") //上一篇、下一篇 位置设置
            GM_addStyle("#primary-new{padding-left: 0!important;padding-right: 0!important; margin-left: -10px; margin-right: -10px}") //文章宽度
            GM_addStyle(".fn{color: #343a40!important}") //评论昵称统一颜色
            GM_addStyle(".kratos-entry-footer .footer-tag a{border-radius: 500px; padding-left: 10px; padding-right: 10px; padding-top: 5px}") //为标签设置圆角
            if (cssSlct(".kratos-post-content  form  div div h4") && GM_getValue("articlePassword")) //自动输入保护文章密码
                if (cssSlct(".kratos-post-content  form  div div h4").innerText.indexOf("这是一篇受保护的帖子") != -1) {
                    cssSlct("#respond p .form-control").value = "meow"
                    cssSlct("#generate").click()
                }

            setTimeout(function () { if (cssSlct(".Love") && GM_getValue("autoLike")) cssSlct(".Love").click() }, 200) //自动点赞
        } else { //首页
            if (GM_getValue("showFakeFeaturePic")) addFakeFeaturePic() //显示伪特色图片
            GM_addStyle(".pagination li a{border-radius: 50%!important}") //底部页码圆角
            addLinks() //为动态添加链接
        }
        if (pageURL.indexOf(".php") == -1) { //主站
            //“返回顶部”按钮
            var goTopBtn = cssSlct(".gotop-btn")
            GM_addStyle(".fa-chevron-up:before{content: ''}")
            goTopBtn.innerHTML = `<span class="fa fa-chevron-up" fr-fix-stroke="true">
            <i style="font-size: 23px;height: 1em;width: 1em;display: inline-flex;justify-content: center;align-items: center;">
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M512 320 192 704h639.936z">
            </path></svg></i></span>`
            GM_addStyle("#block-2,#block-6,#kratos-primary-menu li:nth-child(9),.search-box{display: none}") //隐藏右侧搜索、分类、右下搜索、顶部加群
            GM_addStyle(".gotop-btn{border-radius: 100px}") //回到顶部圆角
            cssSlct(".cd-tool.text-center div").style.marginRight = "22px" //回到顶部位置
            GM_addStyle(".kratos-entry-thumb a img{border-radius: 20px}") //特色图片圆角
            cssSlct("#kratos-primary-menu li:nth-child(8) a").innerText = "发布" //顶栏
        }
    } else if (pageDomain == "bgm.tv") {
        createGoTopButton() //添加“返回顶部”按钮
        if (pageURL.indexOf("from=meows") != -1) {
            GM_addStyle("#headerNeue2,#footer,#robot,#dock{display: none}") //隐藏元素 尽可能简洁
            if (pageURL.search("/subject_search") != -1) { //搜索
                var links = cssSlctAll("a")
                links.forEach((n, index) => { links[index].href += "?from=meows" }) //链接加上"?from=meows"
                if (!cssSlctAll("#browserItemList li").length) Toast.fire({ icon: 'error', position: 'top-end', title: '搜索无结果', text: '请尝试更换关键词' })
                else if (cssSlctAll("#browserItemList li").length == 1) window.open(cssSlct('#browserItemList li:nth-of-type(1) a').href, '_self') //只有一个
                cssSlct("#columnSearchB").width = "80%"
                cssSlct("#columnSearchC").hidden = "true"
            } else if (pageURL.search("bgm.tv/subject") != -1) { //详情页
                GM_addStyle("#subjectPanelIndex,#subjectPanelCollect,.subject_section,.chart_desc,.panelInterestWrapper{display: none!important}")
                cssSlct(".subjectNav").hidden = "true"
                cssSlct("#subject_detail").style.width = "100%"
            }
        }
        if (pageURL.indexOf("bgm.tv/subject") != -1 && pageURL.search("/subject_search") == -1) {
            cssSlct("#show_summary").click()
            let cate = cssSlct(".focus.chl").innerText
            switch (cate) {
                case ("动画"):
                    createButton()
                    idSlct("copyTemplateButton").onclick = function () { getTemplate_Ani() }
                    if (pageURL.indexOf("from=meows") != -1 || GM_getValue("autoCopy")) setTimeout(function () { getTemplate_Ani() }, 160)
                    break
                case ("游戏"):
                    createButton()
                    idSlct("copyTemplateButton").onclick = function () { getTemplate_NotAni() }
                    if (pageURL.indexOf("from=meows") != -1 || GM_getValue("autoCopy")) setTimeout(function () { getTemplate_NotAni() }, 160)
                    break
                case ("书籍"):
                    createButton()
                    idSlct("copyTemplateButton").onclick = function () { getTemplate_NotAni() }
                    if (pageURL.indexOf("from=meows") != -1 || GM_getValue("autoCopy")) setTimeout(function () { getTemplate_NotAni() }, 160)
                    break
                default: return
            }
        }
    }
    GM_addStyle(".instant-setting-label{display: flex; align-items: center; justify-content: space-between; padding-top: 15px;}")
}
function addFakeFeaturePic() {
    var articleList = cssSlctAll(".kratos-hentry.clearfix.wow.bounceInUp") //所有动态
    articleList.forEach((n, index) => {
        for (let j = 1; j <= 2; j++) {
            let postInnerSelector = ".kratos-hentry.clearfix.wow.bounceInUp:nth-of-type(" + (index + 1) + ") .kratos-post-inner .kratos-entry-content p:nth-child(" + j + ")"
            let postInner = cssSlct(postInnerSelector)
            if (postInner) {
                let fakeFeaturePicIndex = postInner.innerText.indexOf("预览图{")
                if (fakeFeaturePicIndex == -1) continue
                let fakeFeaturePicIndexURL = postInner.innerText.substring(fakeFeaturePicIndex + 4, postInner.innerText.indexOf("}"))
                let postHeader = cssSlct(".kratos-hentry.clearfix.wow.bounceInUp:nth-of-type(" + (index + 1) + ") .kratos-post-inner .kratos-entry-header h2 a")
                let articleURL = postHeader.href
                cssSlct(".kratos-hentry.clearfix.wow.bounceInUp:nth-of-type(" + (index + 1) + ") .kratos-entry-thumb").innerHTML = `<a href="${articleURL}"><img src="${fakeFeaturePicIndexURL}"></a>`
                postInner.innerText = postInner.innerText.substring(postInner.innerText.indexOf("}") + 1)
                cssSlct(postInnerSelector + " br:nth-child(1)").remove()
            }
        }
    })
}
function addLinks() {
    var comment = cssSlctAll(".item-diary.fa.fa-comment-o")
    var read = cssSlctAll("li.item-diary.fa.fa-eye")
    for (let index = 0; index < comment.length; index++) {
        let commentsNum = comment[index].innerText, readNum = read[index].innerText
        let articleURL = cssSlctAll(".entry-content")[index].children[1].href
        comment[index].innerHTML = `<a href=${articleURL + "#comment"} style="color: #7d92a2"> ${commentsNum} </a>`
        read[index].innerHTML = `<a href=${articleURL} style="color: #7d92a2"> ${readNum} </a>`
    }
}
function meowPostSettings() {
    let dom = `<div style="font-size: 1em;">
               <label class="instant-setting-label">显示“从模板生成摘要”按钮<input type="checkbox" id="S-showSummaryButton" ${GM_getValue('showSummaryButton') ? 'checked' : ''}></label>
               <label class="instant-setting-label">显示“解析 MarkDown 语法”按钮<input type="checkbox" id="S-showMarkdownButton" ${GM_getValue('showMarkdownButton') ? 'checked' : ''}></label>
               <label class="instant-setting-label">显示“删除所有标签”按钮<input type="checkbox" id="S-showRemoveTagsButton" ${GM_getValue('showRemoveTagsButton') ? 'checked' : ''}></label>
               <label class="instant-setting-label">显示“同时应用摘要和标签”按钮<input type="checkbox" id="S-showSummaryAndTagsButton" ${GM_getValue('showSummaryAndTagsButton') ? 'checked' : ''}></label>
               <label class="instant-setting-label">粘贴时直接应用摘要和标签<input type="checkbox" id="S-pasteAndGetTmp" ${GM_getValue('pasteAndGetTmp') ? 'checked' : ''}></label>
               <label class="instant-setting-label">在新标签页打开搜索结果<input type="checkbox" id="S-showSearchResultInNewTab" ${GM_getValue('showSearchResultInNewTab') ? 'checked' : ''}></label>
               <label class="instant-setting-label">启用伪特色图片<input type="checkbox" id="S-fakeFeaturePic" ${GM_getValue('fakeFeaturePic') ? 'checked' : ''}></label>
               </div>`
    Swal.fire({
        title: '发帖页设置',
        html: dom,
        confirmButtonText: '确定',
        footer: `<div style="text-align: center;font-size: 1em;">喵呜简易辅助v${GM_getValue('version')} &nbsp; 点击查看 <a href="${usageDocumentURL}" target="_blank">使用教程</a></div>`,
    })
    //显示“同时应用摘要和标签”按钮
    idSlct('S-showSummaryAndTagsButton').addEventListener('change', () => {
        GM_setValue('showSummaryAndTagsButton', !GM_getValue('showSummaryAndTagsButton'))
        if (GM_getValue('showSummaryAndTagsButton')) idSlct("summaryAndTagsButton").style.display = 'inline'
        else idSlct("summaryAndTagsButton").style.display = 'none'
    })
    //在新标签页打开搜索结果
    idSlct('S-showSearchResultInNewTab').addEventListener("change", () => {
        GM_setValue("showSearchResultInNewTab", !GM_getValue("showSearchResultInNewTab"))
        if (GM_getValue("showSearchResultInNewTab")) {
            if (idSlct("bgmframe").src != '') idSlct("hideIframeButton").style.display = 'inline'
        } else {
            $("#bgmframe").fadeOut(250)
            idSlct("hideIframeButton").style.display = 'none'
        }
    })
    //粘贴时直接应用摘要和标签
    idSlct('S-pasteAndGetTmp').addEventListener('change', () => {
        GM_setValue('pasteAndGetTmp', !GM_getValue('pasteAndGetTmp'))
    })
    //显示“从模板生成摘要”按钮
    idSlct('S-showSummaryButton').addEventListener('change', () => {
        GM_setValue('showSummaryButton', !GM_getValue('showSummaryButton'))
        if (GM_getValue('showSummaryButton')) idSlct("summaryButton").style.display = 'inline'
        else idSlct("summaryButton").style.display = 'none'
    })
    //显示“删除所有标签”按钮
    idSlct('S-showRemoveTagsButton').addEventListener('change', () => {
        GM_setValue('showRemoveTagsButton', !GM_getValue('showRemoveTagsButton'))
        if (GM_getValue('showRemoveTagsButton')) idSlct("removeTagsButton").style.display = 'inline'
        else idSlct("removeTagsButton").style.display = 'none'
    })
    //启用伪特色图片
    idSlct('S-fakeFeaturePic').addEventListener('change', () => { GM_setValue('fakeFeaturePic', !GM_getValue('fakeFeaturePic')) })
    //显示“解析 MarkDown 语法”按钮
    idSlct('S-showMarkdownButton').addEventListener('change', () => {
        GM_setValue('showMarkdownButton', !GM_getValue('showMarkdownButton'))
        if (GM_getValue('showMarkdownButton')) idSlct("markdownButton").style.display = 'inline'
        else idSlct("markdownButton").style.display = 'none'
    })
}
function templateClick() {
    cssSlct("#content-html").click()
    idSlct("post-format-0").click() //设置发帖形式
    idSlct("category-tabs").click()
    //根据标题搜索
    var title = cssSlct("#title").value
    if (title == "") {
        Toast.fire({ icon: "error", position: "bottom-end", title: "标题不能为空哦", text: "推荐标题格式：【分类】名称" })
        return
    }
    var lend, newURL
    if (title[0] == '[') lend = title.substr(1, Math.max(4, parseInt(title.length * 0.85))).lastIndexOf(']') + 2
    else if (title[0] == '【') lend = title.substr(1, Math.max(4, parseInt(title.length * 0.85))).lastIndexOf('】') + 2
    else lend = 0
    if (title.substring(1, lend).search("动漫") != -1) {
        idSlct('in-category-1').click()
        newURL = "https://bgm.tv/subject_search/" + title.substring(lend) + "?cat=2&from=meows"
    } else if (title.substring(1, lend).search("游戏") != -1) {
        idSlct("in-category-6").click()
        newURL = "https://bgm.tv/subject_search/" + title.substring(lend) + "?cat=4&from=meows"
    } else if (title.substring(1, lend).search("小说") != -1) {
        idSlct("in-category-5").click()
        newURL = "https://bgm.tv/subject_search/" + title.substring(lend) + "?cat=1&from=meows"
    } else if (title.substring(1, lend).search("漫画") != -1) {
        idSlct("in-category-4").click()
        newURL = "https://bgm.tv/subject_search/" + title.substring(lend) + "?cat=1&from=meows"
    } else newURL = "https://bgm.tv/subject_search/" + title.substring(lend) + "?from=meows"
    if (!GM_getValue('showSearchResultInNewTab')) {
        idSlct("bgmframe").style.display = "inline"
        idSlct("hideIframeButton").innerText = "隐藏搜索页"
        showIframe = true
        idSlct("hideIframeButton").style.display = "inline"
        idSlct("bgmframe").src = newURL
    } else window.open(newURL, '_blank')
}
function getTagsFromTmp() {
    var content = cssSlct("#content").value
    var tagsBeginText = '[infobox title=标签]</p>\n<p>'
    var tagsBeginPos = content.indexOf(tagsBeginText)
    if (tagsBeginPos == -1) Toast.fire({ icon: "error", position: "bottom-end", title: "在内容中未找到标签", text: "请检查模板" })
    else {
        tagsBeginPos += tagsBeginText.length
        removeTags()
        var tagsEndPos = content.lastIndexOf(" &nbsp; </p>") + 1
        var tagCount = 0
        content = content.substring(tagsBeginPos, tagsEndPos)
        var tags = ""
        for (let i = 0; i < content.length && content[i] != '\n'; i++) {
            if (content[i] == " ") {
                tagCount++
                if (tagCount % 2) {
                    cssSlct("#new-tag-post_tag").value = tags
                    cssSlct(".button.tagadd").click()
                    //console.log(tags)
                }
                tags = ""
            } else tags += content[i]
        }
        Toast.fire({ icon: "success", position: "bottom-end", title: "应用标签成功", text: "共添加了" + parseInt((tagCount + 1) / 2) + "个标签" })
    }
}
function getSummaryFromTmp() {
    var summaryBeginText = '[infobox title=简介]</p>\n'
    var content = cssSlct("#content").value
    var summaryBeginPos = content.indexOf(summaryBeginText)
    if (summaryBeginPos == -1) {
        cssSlct("#excerpt").value = cssSlct("#title").value
        Toast.fire({ icon: "error", position: "bottom-end", title: "在内容中未找到简介", text: "已应用标题，请检查模板" })
        return
    }
    summaryBeginPos += summaryBeginText.length
    var summaryEndPos = content.substring(summaryBeginPos).indexOf("<p>[/infobox]") - 1
    var summaryText = content.substring(summaryBeginPos, summaryBeginPos + summaryEndPos)
    summaryText = summaryText.replace(RegExp("<p>", "g"), "")
    summaryText = summaryText.replace(RegExp("</p>", "g"), "")
    if (isJapanese(summaryText)) {
        cssSlct("#excerpt").value = cssSlct("#title").value
        Toast.fire({ icon: "error", position: "bottom-end", title: "未能生成摘要", text: "检测到语言可能是日语" })
    } else if (summaryText.length > 220) {
        cssSlct("#excerpt").value = summaryText.substring(0, 200) + "……"
        Toast.fire({ icon: "success", position: "bottom-end", title: "生成摘要成功", text: "内容过长已缩减" })
    } else {
        cssSlct("#excerpt").value = summaryText
        Toast.fire({ icon: "success", position: "bottom-end", title: "生成摘要成功" })
    }
}
function setCoverPic() {
    if (GM_getValue("fakeFeaturePic")) {
        var content = cssSlct("#content").value
        var picSearchText = '<p><img class="aligncenter" src="'
        var picBeginPos = content.indexOf(picSearchText) + picSearchText.length
        if (picBeginPos == -1) return
        var picEndPos = picBeginPos + content.substring(picBeginPos).indexOf('"')
        cssSlct("#excerpt").value = "预览图{" + content.substring(picBeginPos, picEndPos) + "}\n" + cssSlct("#excerpt").value
    }
}
function removeTags() {
    var tagsCount = cssSlctAll().length
    for (let i = 1; i <= tagsCount; i++)
        idSlct('post_tag-check-num-0').click()
}
function autoVerificationCode() {
    let verifyText = cssSlct("#registerform p:nth-child(4) label").innerText
    let verifyCntA = 0, verifyCntB = 0, verifyCnt = true
    for (let i = 0; verifyText[i] != '\n'; i++) {
        if (verifyText[i] >= '0' && verifyText[i] <= '9' && verifyCnt) {
            verifyCntA = verifyCntA * 10 + Number(verifyText[i])
        } else if (verifyText[i] >= '0' && verifyText[i] <= '9' && !verifyCnt) verifyCntB = verifyCntB * 10 + Number(verifyText[i])
        else if (verifyText[i] == ' ') verifyCnt = false
    }
    cssSlct("#are_you_human").value = verifyCntA + verifyCntB
    Toast.fire({ icon: "success", title: "已为您自动输入验证码" })

}
function isAprilFoolsDay() {
    var d = new Date()
    return d.getDate() == "1" && d.getMonth() == "3"
}
function addUserInfo() {
    let userInfoBar = document.createElement("div")
    $('body').append(userInfoBar)
    userInfoBar.id = 'userInfoBar'
    userInfoBar.style.display = 'none'
    $('#userInfoBar').load('https://meows.com.cn/wp-admin/profile.php .user-profile-picture td img,#nickname')
}
function addUsername() {
    var usernamerBackground = document.createElement("li")
    usernamerBackground.style.cssText = "position: absolute; right: 74px"
    idSlct("kratos-primary-menu").append(usernamerBackground)
    usernamerBackground.innerHTML = `<a id="username" href="https://meows.com.cn/wp-admin/index.php">${GM_getValue("username") ? GM_getValue("username") : "未登录"}</a>`
    var loginStatus = false
    for (let i = 0; i <= 6000; i += 400)
        setTimeout(function () {
            if (idSlct("nickname")) {
                loginStatus = true
                if (isAprilFoolsDay()) {
                    let nickname = idSlct("nickname").value
                    cssSlct("#kratos-primary-menu #username").innerText = ""
                    for (let j = nickname.length - 1; j >= 0; j--)
                        cssSlct("#kratos-primary-menu #username").innerText += nickname[j]
                } else cssSlct("#kratos-primary-menu #username").innerText = idSlct("nickname").value
                GM_setValue("username", cssSlct("#kratos-primary-menu #username").innerText)
            }
        }, i)
    setTimeout(function () {
        if (!loginStatus) {
            if (isAprilFoolsDay()) cssSlct("#kratos-primary-menu #username").innerText = "录登未"
            else cssSlct("#kratos-primary-menu #username").innerText = "未登录"
            cssSlct("#kratos-primary-menu #username").href = "https://meows.com.cn/wp-login.php"
            GM_deleteValue("username")
        }
    }, 6000)
    if (isAprilFoolsDay()) cssSlct("#kratos-primary-menu #username").title = "愚人节彩蛋"
    else cssSlct("#kratos-primary-menu #username").title = "昵称"
}
function addAvatar() {
    var avatarPos = document.createElement("li")
    avatarPos.style.cssText = 'position: absolute; right: 0px'
    idSlct("kratos-primary-menu").append(avatarPos)
    var defaultAvatar = "https://cdn.luogu.com.cn/upload/usericon/1.png"
    avatarPos.innerHTML = `<a id="avatar">
                            <div>
                            <img id="avatarImg" class="avatar" src=${GM_getValue("userAvatarUrl") ? GM_getValue("userAvatarUrl") : defaultAvatar} style="height: 38px; width: 38px;">
                            </div></a>`
    var loginStatus = false
    for (let i = 0; i <= 6000; i += 400)
        setTimeout(function () {
            if (cssSlct("#userInfoBar img")) {
                loginStatus = true
                let imgsrc = cssSlct("#userInfoBar img").src.replace(RegExp("-96x96", "g"), "")
                cssSlct("#kratos-primary-menu #avatarImg").src = imgsrc
                GM_setValue("userAvatarUrl", imgsrc)
            }
        }, i)
    idSlct("avatarImg").style.cssText = 'height: 38px; width: 38px;'
    idSlct("avatar").onclick = function () { globalSettings() }
    setTimeout(function () {
        if (!loginStatus) {
            cssSlct("#kratos-primary-menu #avatarImg").src = defaultAvatar
            GM_deleteValue("userAvatarUrl")
        }
    }, 6000)
    if (isAprilFoolsDay()) {
        cssSlct("#kratos-primary-menu #avatarImg").style.transform = "rotate(180deg)"
        cssSlct("#kratos-primary-menu #avatarImg").title = "愚人节彩蛋"
    }
}
function globalSettings() {
    var dom = `<div style="font-size: 1em;">
                <label class="instant-setting-label">显示伪特色图片<input type="checkbox" id="S-showFakeFeaturePic" style="width: 17px; height: 17px" ${GM_getValue('showFakeFeaturePic') ? 'checked' : ''}></label>
                <label class="instant-setting-label">替换注册登录页背景图为 Bing 每日一图<input type="checkbox" id="S-enableBingPic" style="width: 17px; height: 17px" ${GM_getValue('enableBingPic') ? 'checked' : ''}></label>
                <label class="instant-setting-label">自动点赞文章<input type="checkbox" id="S-autoLike" style="width: 17px; height: 17px" ${GM_getValue('autoLike') ? 'checked' : ''}></label>
                <label class="instant-setting-label">自动输入保护文章的密码<input type="checkbox" id="S-articlePassword" style="width: 17px; height: 17px" ${GM_getValue('articlePassword') ? 'checked' : ''}></label>
                <label id="S-showPostSettings" class="instant-setting-label" style="cursor: pointer;">显示发帖页设置</label>
                <label id="S-showBgmSettings" class="instant-setting-label" style="cursor: pointer;">显示复制模板页设置</label>
                <label id="S-reset" class="instant-setting-label">重置所有设置</label>
                </div>`
    Swal.fire({
        title: '美化设置',
        html: dom,
        confirmButtonText: "确定",
        footer: `<div style="text-align: center;font-size: 1em;">上述设置刷新网页生效<br>喵呜简易辅助v${GM_getValue('version')} &nbsp; 点击查看 <a href="${usageDocumentURL}" target="_blank">使用教程</a></div>`,
    })
    idSlct("S-showFakeFeaturePic").addEventListener("change", () => { GM_setValue('showFakeFeaturePic', !GM_getValue('showFakeFeaturePic')) })
    idSlct("S-enableBingPic").addEventListener("change", () => { GM_setValue('enableBingPic', !GM_getValue('enableBingPic')) })
    idSlct("S-autoLike").addEventListener("change", () => { GM_setValue('autoLike', !GM_getValue('autoLike')) })
    idSlct("S-articlePassword").addEventListener("change", () => { GM_setValue('articlePassword', !GM_getValue('articlePassword')) })
    idSlct("S-showPostSettings").addEventListener("click", () => { meowPostSettings() })
    idSlct("S-showBgmSettings").addEventListener("click", () => { bgmSettings() })
    idSlct("S-reset").addEventListener("click", () => {
        Swal.fire({
            title: '确定要重置所有设置吗？',
            text: "这将清空你的所有设置，恢复为默认设置",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
        }).then((result) => {
            if (result.value) {
                deleteAllValues()
                // Swal.fire("已重置所有设置!","请")
                Swal.fire({
                    title: '已重置所有设置',
                    confirmButtonText: '确定'
                }).then(() => { location.reload() })
            }
        })
    })
}
function addSearchBar() {
    var searchBarPos = document.createElement("li")
    cssSlct("#kratos-primary-menu").append(searchBarPos)
    searchBarPos.innerHTML = `<div class="custom-search" style="width: 17vw;">
                            <div class="search-bar" style="width: 100%;">
                            <div class="bar-form" style="width: 87%;">
                            <input id="search-bar-input" placeholder="搜索" style="font-size: 14px;border: none;background-color: transparent;width: 100%;">
                            <span id="searchButton"class="fa fa-search" style="position: absolute;right: 35px;cursor: pointer;margin-top: 1px;">
                            </span></div></div></div>`
    GM_addStyle(".custom-search{background: rgb(255, 255, 255); border-radius: 8px; opacity: 0.8; margin-left: 20px; margin-right: 20px; width: 17vw;}")
    GM_addStyle(".search-bar{background-color: aliceblue; opacity: 0.8; padding: 2px 6px; height: 30px; display: flex; align-items: center; width: inherit; border-radius: 8px;}")
    GM_addStyle(".bar-form{display: flex; width: inherit}")
    window.addEventListener('resize', function () {
        if (document.body.clientWidth <= 995) {
            // $("#kratos-primary-menu li:nth-child(12)").fadeOut(250)
            $("#kratos-primary-menu > li:nth-child(6)").fadeOut(250)
            $("#kratos-primary-menu > li:nth-child(7)").fadeOut(250)
        }
        else {
            $("#kratos-primary-menu > li:nth-child(6)").fadeIn(250)
            $("#kratos-primary-menu > li:nth-child(7)").fadeIn(250)
        }
    })
    cssSlct(".nav-header #searchButton").onclick = function () {
        if (cssSlct(".nav-header #search-bar-input").value != "")
            window.open("https://meows.com.cn/?s=" + cssSlct(".nav-header #search-bar-input").value, "_self")
    }
    $(".nav-header #search-bar-input").keydown(function (e) {
        if (e.keyCode == 13)
            if (cssSlct(".nav-header #search-bar-input").value != "")
                window.open("https://meows.com.cn/?s=" + cssSlct(".nav-header #search-bar-input").value, "_self")
    })
}
function createButton() {
    var templateButtonPositoin = document.createElement("div")
    templateButtonPositoin.style.float = "right"
    cssSlct(".nameSingle").append(templateButtonPositoin)
    templateButtonPositoin.innerHTML = `<button class="swal2-confirm swal2-styled" id="copyTemplateButton" style="font-size: 16px; margin-bottom: 10px;border-radius: 5px;">复制模板</button>
        <button class="swal2-confirm swal2-styled" id="bgmSettings" style="font-size: 16px; margin-left: 20px; border-radius: 5px;">设置</button>`
    idSlct("bgmSettings").onclick = function () { bgmSettings() }
}
function bgmSettings() {
    var dom = `<div style="font-size: 1em;">
                <label class="instant-setting-label">自动复制模板<input type="checkbox" id="S-autoCopy" style="width: 17px; height: 17px" ${GM_getValue('autoCopy') ? 'checked' : ''}></label>
                <label class="instant-setting-label">模板使用 MarkDown 语法<input type="checkbox" id="S-markdownedTemplate" style="width: 17px; height: 17px" ${GM_getValue('markdownedTemplate') ? 'checked' : ''}></label>
                <label class="instant-setting-label" style="cursor: auto;" >自定义模板（实验，请看教程！）<button id="S-resetTemplate" style="font-size: 15px">重置</button></label>
                <textarea id="S-customTemplateInput" style="font-size:16px; margin-top: 6px; width: 97%; border-radius:4px; padding: 5px" rows="17">${GM_getValue("customTemplate") ? GM_getValue("customTemplate") : templateSourceDefault}</textarea>
                </div>`
    Swal.fire({
        title: '复制模板页设置',
        html: dom,
        confirmButtonText: '确定',
        footer: `<div style="text-align: center;font-size: 1em;">喵呜简易辅助v${GM_getValue('version')} &nbsp; 点击查看 <a href="${usageDocumentURL}" target="_blank">使用教程</a></div>`,
    })
    idSlct('S-autoCopy').addEventListener('change', () => { GM_setValue('autoCopy', !GM_getValue('autoCopy')) })
    idSlct('S-markdownedTemplate').addEventListener('change', () => { GM_setValue('markdownedTemplate', !GM_getValue('markdownedTemplate')) })
    idSlct('S-resetTemplate').onclick = function () {
        GM_setValue("customTemplate", templateSourceDefault)
        idSlct("S-customTemplateInput").value = templateSourceDefault
    }
    $('#S-customTemplateInput').keyup(function () {
        GM_setValue("customTemplate", idSlct("S-customTemplateInput").value)
    })
}
function getTemplate_Ani() {
    templateSource = GM_getValue("customTemplate") ? GM_getValue("customTemplate") : templateSourceDefault
    replacePic()
    replaceChsAndJpnName()
    replaceChsName()
    replaceSummary()
    replaceTags()
    replaceInfo_Ani()
    templateSource = templateSource.replace(RegExp("@", "g"), "")
    templateSource = templateSource.replace(RegExp("\n", "g"), "\n\n")
    templateSource = marked.parse(templateSource)
    templateSource = templateSource.replace(RegExp("<img ", "g"), '<img class="aligncenter" ') //图片居中
    templateSource = templateSource.replace(RegExp(" />", "g"), ' width=720 />" ')
    GM_setClipboard(marked.parse(templateSource), 'text')
    GM_setValue("template", templateSource)
    Toast.fire({ icon: "success", title: "复制成功" })
}
function getTemplate_NotAni() {
    templateSource = GM_getValue("customTemplate") ? GM_getValue("customTemplate") : templateSourceDefault
    replacePic()
    replaceChsAndJpnName()
    replaceChsName()
    replaceSummary()
    replaceTags()
    replaceInfo_NotAni()
    templateSource = templateSource.replace(RegExp("@", "g"), "")
    templateSource = templateSource.replace(RegExp("\n", "g"), "\n\n")
    templateSource = marked.parse(templateSource)
    templateSource = templateSource.replace(RegExp("<img ", "g"), '<img class="aligncenter" ') //图片居中
    templateSource = templateSource.replace(RegExp('"></p>', "g"), '" width=720></p>')
    GM_setClipboard(marked.parse(templateSource), 'text')
    GM_setValue("template", templateSource)
    Toast.fire({ icon: "success", title: "复制成功" })
}
function replacePic() {
    //替换值是一个地址，获取不到就删除这一块
    if (templateSource.indexOf("#图片地址#") == -1) return
    if (cssSlct(".thickbox.cover")) templateSource = templateSource.replace(RegExp("#图片地址#", "g"), cssSlct(".thickbox.cover").href)
    else deleteBlock("#图片地址#")
}
function replaceChsAndJpnName() {
    //获取不到中日就返回中文，再获取不到就返回日文。不考虑啥也获取不到
    if (templateSource.indexOf("#中日名称#") == -1) return
    var nameContent
    var name1 = cssSlct("#infobox li:nth-of-type(1)"), name2 = cssSlct(".nameSingle a")
    if (name1.innerText.indexOf("中文名") != -1 && name2) {
        if (name1.innerText.substring(5) != name2.innerHTML) nameContent = name1.innerText.substring(5) + " / " + name2.innerHTML
        else nameContent = name2.innerHTML
    } else {
        if (name2) nameContent = name2.innerHTML
        else nameContent = name1 ? name1.innerText.substring(5) : name2.innerHTML
    }
    templateSource = templateSource.replace(new RegExp("#中日名称#", "g"), nameContent)
}
function replaceChsName() {
    //中文名称
    if (templateSource.indexOf("#中文名#") == -1) return
    var nameChs = cssSlct("#infobox li:nth-of-type(1)")
    if (nameChs.innerText.indexOf("中文名") != -1) templateSource = templateSource.replace(new RegExp("#中文名#", "g"), nameChs.innerText.substring(5))
    else if (cssSlct("#headerSubject h1 a")) templateSource = templateSource.replace(new RegExp("#中文名#", "g"), cssSlct("#headerSubject h1 a").innerText)
    else deleteBlock("#中文名#")
}
function replaceSummary() {
    if (templateSource.indexOf("#简介#") == -1) return
    if (cssSlct("#subject_summary"))
        templateSource = templateSource.replace(new RegExp("#简介#", "g"), cssSlct("#subject_summary").innerText)
    else deleteBlock("#简介#")
}
function replaceTags() {
    //格式：标签A &nbsp; ExampleB &nbsp;
    if (templateSource.indexOf("#标签#") == -1) return
    if (!cssSlct(".subject_tag_section")) {
        deleteBlock("#标签#")
        return
    }
    var tagsContent = ""
    var tags = cssSlctAll(".inner .l span")
    for (let n = 1; n <= Math.min(10, tags.length); n++)
        tagsContent += tags[n].innerText + " &nbsp; "
    templateSource = templateSource.replace(new RegExp("#标签#", "g"), tagsContent)
}
function replaceInfo_Ani() {
    if (templateSource.indexOf("#详情#") == -1) return
    if (!cssSlct("#infobox")) {
        deleteBlock("#详情#")
        return
    }
    var infoContent = ""
    for (let i = 1; i < 50; i++)
        if (cssSlct("#infobox li:nth-of-type(" + i + ")")) {
            let tmp = cssSlct("#infobox li:nth-of-type(" + i + ")").innerText + "\n\n"
            if (!tmp.search("中文名") || !tmp.search("别名") || !tmp.search("话数") || !tmp.search("原作") || !tmp.search("导演") || !tmp.search("动画制作") || !tmp.search("放送开始"))
                infoContent += tmp
            else if (!tmp.indexOf("官方网站")) break
        } else break
    // infoContent = infoContent.replace(/: /g, "：")
    templateSource = templateSource.replace(new RegExp("#详情#", "g"), infoContent)
}
function replaceInfo_NotAni() {
    if (templateSource.indexOf("#详情#") == -1) return
    if (!cssSlct("#infobox")) {
        deleteBlock("#详情#")
        return
    }
    var infoContent = ""
    for (let i = 1; i < 50; i++)
        if (cssSlct("#infobox li:nth-of-type(" + i + ")"))
            infoContent += cssSlct("#infobox li:nth-of-type(" + i + ")").innerText + "\n\n"
        else break
    // infoContent = infoContent.replace(/: /g, "：")
    templateSource = templateSource.replace(new RegExp("#详情#", "g"), infoContent)
}
function deleteBlock(type) {
    while (templateSource.indexOf(type) != -1) {
        var indexOfBlock = templateSource.indexOf(type)
        var blockStart = templateSource.substring(0, indexOfBlock).lastIndexOf("@")
        var blockEnd = templateSource.substring(indexOfBlock).indexOf("@")
        templateSource = templateSource.substring(0, blockStart - 1) + templateSource.substring(indexOfBlock + blockEnd + 1)
    }
}
function showTips() {
    GM_setValue("markdownedTemplate", true)
    GM_setValue("showMarkdownButton", true)
    GM_setValue("showSummaryButton", true)
    GM_setValue("showFakeFeaturePic", true)
    GM_setValue("enableBingPic", true)
    GM_setValue("autoLike", true)
    var dom = `<div style="font-size: 1em;">
                <p><strong>此提示只有第一次使用时显示，请阅读后再关闭！</strong></p>
                <p>若您还未阅读过使用教程，请务必点击 <a href="${usageDocumentURL}" target="_blank">此处</a> 阅读。</p>
                <p>感谢您使用该脚本，使用过程中若发现任何问题可至 GreasyFork 或 喵呜动漫 反馈。</p>
                </div>`
    Swal.fire({
        title: '首次使用提示',
        html: dom,
        confirmButtonText: '确定',
        footer: `<div style="text-align: center;font-size: 1em;">喵呜简易辅助v${GM_getValue('version')} &nbsp; 点击查看 <a href="${usageDocumentURL}" target="_blank">使用教程</a></div>`,
    })
    GM_setValue("firstUse", true)
}
function printValue() {
    GM_listValues().forEach(function (name, index) { console.log(name, GM_getValue(name)) })
}
function deleteAllValues() {
    GM_listValues().forEach(function (name) { GM_deleteValue(name) })
}
function removeAnnoyingPopupText() {
    $("body").bind('DOMNodeInserted', function (e) {
        let newElement = $(e.target).html()
        if (newElement.indexOf("已经支持过了") != -1) {
            cssSlct("div.layui-layer-content").remove()
            return
        }
        var a = new Array("技术宅", "二次元", "小白", "富有想象", "*:ஐ٩(๑´ᵕ`)۶ஐ:* 学习使我进步", "(๑*◡*๑)", "✧*｡٩(ˊᗜˋ*)و✧*｡", "（づ￣3￣）づ╭❤～", "╰( ´・ω・)つ──☆✿✿✿", "充满激情", "(((┏(;￣▽￣)┛装完逼就跑", "熬夜成瘾(,,•﹏•,,)")
        for (let i = 0; i < a.length; i++)
            if (newElement == (a[i])) {
                let aa = document.querySelectorAll("span")
                for (let j = 0; j < aa.length; j++)
                    if (aa[j].innerText == a[i]) {
                        aa[j].remove()
                        break
                    }
                break
            }
    })
}
function dontChangeMyPageTitle() {
    var title = document.title
    document.addEventListener('visibilitychange', function () {
        var newTitle = document.title
        if (document.visibilityState == 'hidden')
            for (let i = 0; i <= 50; i++) setTimeout(() => {
                if (document.title.indexOf("404啦！") == 0 && newTitle.indexOf("哈哈，骗你的！") == -1) document.title = newTitle
                else if (document.title.indexOf("404啦！") == 0) document.title = title
                else title = document.title
            }, i)
        // else for (let i = 0; i <= 50; i++) setTimeout(() => { if (document.title.indexOf("哈哈，骗你的！") == 0) document.title = title }, i)
    })
}
function createGoTopButton() {
    unsafeWindow.Vue = Vue
    let script = document.createElement("script")
    script.type = "text/javascript"
    script.src = "https://cdn.jsdelivr.net/npm/element-plus@2.1.4"
    document.body.appendChild(script)
    let backTopButton = document.createElement("div")
    document.body.appendChild(backTopButton)
    backTopButton.id = "backTopButton"
    backTopButton.innerHTML = `
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/element-plus@2/dist/index.min.css" />
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css">
        <el-backtop :visibility-height="300" :right="30" :bottom="45">
        <i class="el-icon" style="font-size: 20px">
        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="M512 320 192 704h639.936z"></path></svg></i>
        </el-backtop>`
    unsafeWindow.onload = function () {
        const btn = Vue.createApp({})
        btn.use(ElementPlus)
        btn.mount("#backTopButton")
    }
}
function removeCopyPrompt() {
    var noAlert = document.createElement("script")
    cssSlct("body").append(noAlert)
    noAlert.innerHTML = "window.alert = function(t) { return false }"
}
function isJapanese(temp) {
    if (/[^\u0800-\u4e00]/.test(temp)) return false
    return true
}