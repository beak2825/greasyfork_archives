// ==UserScript==
// @name         CSDN Blog 极致简化
// @name:en      CSDN Blog Super Simplification
// @namespace    csdn_blog_super_simplification
// @version      5.1.5
// @description  页面排版调整，仅保留评论区、文章主体、文章目录，免登录增加复制及鼠标框选代码功能，免登录加载评论
// @description:en  Page layout modification. Only comment area, article body, directory are shown. No login requirement to copy or select code area. No login requirement to load comments.
// @author       Xavier Wong
// @run-at       document-start
// @match        https://*blog.csdn.net/*
// @match        https://*.blog.csdn.net/*
// @match        https://*csdnnews.blog.csdn.net/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @license      Xavier Wong
// @downloadURL https://update.greasyfork.org/scripts/412200/CSDN%20Blog%20%E6%9E%81%E8%87%B4%E7%AE%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/412200/CSDN%20Blog%20%E6%9E%81%E8%87%B4%E7%AE%80%E5%8C%96.meta.js
// ==/UserScript==

GM_addStyle(
    'html.eyecomfort-on {-webkit-filter: brightness(60%) !important}' +
    'html.eyecomfort-off {-webkit-filter: brightness(100%) !important}' +
    '#commentSideBoxshadow.comment-show {display: block !important}' +
    '#commentSideBoxshadow.comment-hide {display: none !important}' +
    'main.comment-show {width: 70% !important}' +
    'main.comment-hide {width: 100% !important}' +
    '#rightAside.directory-show {display: block !important}' +
    '#rightAside.directory-hide {display: none !important}' +
    '#mainBox.directory-show {width: calc(100vw - 300px) !important; margin-right: 300px !important}' +
    '#mainBox.directory-hide {width: calc(100vw) !important; margin-right: 0px !important}'
);

function generateSideToolBarElement(dataType, style, imgUrl, text1, text2){
    const tmpDiv = document.createElement('div');
    tmpDiv.innerHTML = '<a class="option-box" style="' + style + '" data-type="' + dataType + '">' +
      (imgUrl == null ? '' : '<img src="' + imgUrl + '" alt="" srcset="">') +
      '<span ' + (imgUrl == null ? 'style="display:flex;opacity:100;font-size:10px"' : '') + '>' + text1 + '<br>' + text2 + '</span>' +
    '</a>';
    return tmpDiv.firstElementChild;
}

/**
 * 修改指定DOM
 * @param domSelector DOM选择器
 * @param style 样式
 */
function modifyDOM(domSelector, style){
    GM_addStyle(
        domSelector + '{' + style + '}'
    );
}

/**
 * 隐藏指定DOM
 * @param domSelector DOM选择器
 */
function hideDOM(domSelector){
    GM_addStyle(
        domSelector + '{display: none !important;}'
    );
}

/**
 * 添加DOM类
 * @param domSelector DOM选择器
 * @param className 类名
 */
function addDOMClass(domSelector, className){
    getDOM(domSelector).classList.add(className);
}

/**
 * 删除DOM类
 * @param domSelector DOM选择器
 * @param className 类名
 */
function removeDOMClass(domSelector, className){
    getDOM(domSelector).classList.remove(className);
}

/**
 * 获取单个DOM
 * @param domSelector DOM选择器
 * @returns DOM
 */
function getDOM(domSelector, retryTime) {
    return document.querySelector(domSelector);
}

/**
 * 获取多个DOM
 * @param domSelector DOM选择器
 * @returns DOMs
 */
function getDOMs(domSelector) {
    return document.querySelectorAll(domSelector);
}

/**
 * 删除多个DOM
 * @param domSelector DOM选择器
 */
function deleteDOMs(domSelector) {
    $.each(getDOMs(domSelector), function(i, r){
        r.remove();
    });
}

/**
 * 移动DOM
 * @param srcDomSelector 来源DOM选择器
 * @param dstDomSelector 目标DOM选择器
 */
function moveBeforeDOM(srcDomSelector, dstDomSelector) {
    const srcDom = getDOM(srcDomSelector);
    const dstDom = getDOM(dstDomSelector);
    if(srcDom != null && dstDom != null) {
        dstDom.before(srcDom);
    }
}

var eyeComfort = GM_getValue('eyeComfort', false);
function toggleEyeComfort(isOn) {
    removeDOMClass('html', 'eyecomfort-on');
    removeDOMClass('html', 'eyecomfort-off');
    if(isOn){
        addDOMClass('html', 'eyecomfort-on');
    }else{
        addDOMClass('html', 'eyecomfort-off');
    }
    eyeComfort = isOn;
    GM_setValue('eyeComfort', eyeComfort);
}

var commentShow = GM_getValue('commentShow', true);
function showComment(isShow) {
    removeDOMClass('#commentSideBoxshadow', 'comment-hide');
    removeDOMClass('#commentSideBoxshadow', 'comment-show');
    removeDOMClass('main', 'comment-hide');
    removeDOMClass('main', 'comment-show');
    if(isShow){
        addDOMClass('#commentSideBoxshadow', 'comment-show');
        addDOMClass('main', 'comment-show');
    }else{
        addDOMClass('#commentSideBoxshadow', 'comment-hide');
        addDOMClass('main', 'comment-hide');
    }
    commentShow = isShow;
    GM_setValue('commentShow', commentShow);
}

var directoryShow = GM_getValue('directoryShow', false);
function showDirectory(isShow) {
    removeDOMClass('#rightAside', 'directory-hide');
    removeDOMClass('#rightAside', 'directory-show');
    removeDOMClass('#mainBox', 'directory-hide');
    removeDOMClass('#mainBox', 'directory-show');
    if(isShow){
        addDOMClass('#rightAside', 'directory-show');
        addDOMClass('#mainBox', 'directory-show');
    }else{
        addDOMClass('#rightAside', 'directory-hide');
        addDOMClass('#mainBox', 'directory-hide');
    }
    directoryShow = isShow;
    GM_setValue('directoryShow', directoryShow);
}

/**
 * 目录定位功能修正
 */
function fixDirectoryJump() {
    let directory = getDOMs('#groupfile a, #groupfileConcision a, #content_views a[target=_self]');
    $.each(directory, function(i, r){
        r.onclick = function() {
            if(!!getDOM('[name="'+r.getAttribute('href').replace('#', '')+'"], [id="'+r.getAttribute('href').replace('#', '')+'"]')) {
                getDOM('[name="'+r.getAttribute('href').replace('#', '')+'"], [id="'+r.getAttribute('href').replace('#', '')+'"]').scrollIntoView()
            }
        }
    })
}

/**
 * 置顶功能修正
 */
function fixGoTop() {
    getDOM('main').onscroll = function(){
        let scrollTop = this.scrollTop || document.body.scrollTop;
        if(scrollTop <= 200) {
            addDOMClass('.csdn-side-toolbar > [data-type="gotop"]', 'go-top-hide')
        }
        if(scrollTop > 200) {
            removeDOMClass('.csdn-side-toolbar > [data-type="gotop"]', 'go-top-hide')
            getDOM('.csdn-side-toolbar > [data-type="gotop"]').onclick = function(){
                getDOM('main').scrollTo({
                    left: 0,
                    top: 0,
                    behavior: 'smooth'
                });
            }
        }
    }
}

/**
 * 复制代码(免登录)
 */
function copyCodeUnlogin() {
    const codeFrame = getDOMs('code');
    $.each(codeFrame, function(i, r){
        r.onclick = function(){
            mdcp.copyCode(event)
        };
    });
    const codeCopyBtn = getDOMs('.hljs-button.signin');
    if(codeCopyBtn.length > 0) {
        $.each(codeCopyBtn, function(i, r){
            r.setAttribute('data-title', '复制');
            r.onclick = function(){
                hljs.copyCode(event)
            };
        });
        const observer = new MutationObserver(function(e){
            $.each(e, function(i, r){
                if(r.target.getAttribute('data-title') == '登录后复制') {
                    r.target.setAttribute('data-title', '复制');
                }
            });
        });
        observer.observe(getDOM('.hljs-button.signin'), {
            attributes: true,
        });
    }
}

function htmlUnEscape(str) { //反转义
	var unescapes = {
			'&amp;': '&',
			'&lt;': '<',
			'&gt;': '>',
			'&quot;': '"',
			'&#39;': "'"
		},
		reEscapedHtml = new RegExp(/&(?:amp|lt|gt|quot|#39);/g);
	return (str && reEscapedHtml.test(str)) ? str.replace(reEscapedHtml, function(entity) {
		return unescapes[entity];
	}) : (str || '')
}

function readComment(commentContent) {
    // 转换评论中的表情包
    var faceStart = 0, faceTypes = new Set();
    do{
        faceStart = commentContent.indexOf('[face]', faceStart);
        if(faceStart > -1) {
            faceTypes.add(commentContent.substring(faceStart + 6, commentContent.indexOf(':', faceStart)));
            faceStart++;
        }
    }while(faceStart > -1);
    faceTypes.forEach(function(r) {
        commentContent = commentContent.replaceAll('[face]' + r + ':', '<img src="//g.csdnimg.cn/static/face/' + r + '/');
    });
    commentContent = commentContent.replaceAll('[/face]', '" alt="表情包">');

    // 转换评论中的代码块
    if(commentContent.indexOf('[code=') > -1 && commentContent.indexOf('[/code]') > -1){
        const textBeforeCode = commentContent.substring(0, commentContent.indexOf('[code='));
        const textAfterCode = commentContent.substring(commentContent.indexOf('[/code]') + 7);
        try{
            const codeLang = commentContent.substring(commentContent.indexOf('=') + 1, commentContent.indexOf(']'));
            var codeLangTrue = codeLang;
            commentContent = commentContent.substring(commentContent.indexOf(']') + 1, commentContent.lastIndexOf('['));
            commentContent = commentContent.trim();
            var hlCode;
            if(hljs.getLanguage(codeLang) == undefined) {
                hlCode = hljs.highlightAuto($('<div>').html(commentContent).text());
                codeLangTrue = hlCode.language;
            }else{
                hlCode = hljs.highlight($('<div>').html(commentContent).text(), {language: codeLangTrue});
            }
            commentContent = hlCode.value;
            var codeByLine = commentContent.split('\n');
            var codeLines = "";
            if(commentContent !== "") {
                codeLines += '<pre name="code2" class="'+codeLang+' hljs language-'+codeLangTrue+'"><ol class="hljs-ln" style="width:100%">';
                $.each(codeByLine, function(i, r){
                    codeLines += '<li><div class="hljs-ln-numbers"><div class="hljs-ln-line hljs-ln-n" data-line-number="'+(i+1)+'"></div></div><div class="hljs-ln-code"><div class="hljs-ln-line">'+r+'</div></div></li>';
                });
                codeLines += '</ol></pre>';
            }
            commentContent = textBeforeCode + codeLines + textAfterCode;
        } catch(err){}
    }
    commentContent = commentContent.replaceAll("\n","<br>");
    commentContent = replaceUrlWithHyperLink(commentContent);
    return commentContent;
}

function replaceUrlWithHyperLink(str){
    var re = /(f|ht){1}(tp|tps):\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?/g;
    str = str.replace(re, function(website){
        return "<a class='comment-match-url' href='" + website +"' target='_blank'>" + website + "</a>";
    });
    return str;
};

/**
 * 加载评论(免登录)
 */
function loadCommentUnlogin() {
    if(getCookie('UserName') == null){
        $.ajax({
            url: 'https://blog.csdn.net/phoenix/web/v1/comment/list/'+articleId+'?page=0&size=3000',
            type: "POST",
            success: function (data) {
                let commentCustom = getDOM('#pcCommentSideBox').innerHTML + `<div class="comment-list-container"><div class="comment-list-box">`;
                $.each(data.data.list.sort(function(a,b){
                    return b.info.commentId - a.info.commentId;
                }), function(i, r){
                    commentCustom = `${commentCustom}<ul class="comment-list">` +
                        `<li class="comment-line-box">` +
                        `<div class="comment-list-item">` +
                        `<a class="comment-list-href" target="_blank" href="https://blog.csdn.net/${r.info.userName}">` +
                        `<img src="${r.info.avatar}" username="${r.info.userName}" alt="${r.info.userName}" class="avatar">` +
                        `</a>` +
                        `<div class="right-box">` +
                        `<div class="new-info-box clearfix">` +
                        `<div class="comment-top">` +
                        `<div class="user-box">` +
                        `<a class="name-href" target="_blank" href="https://blog.csdn.net/${r.info.userName}">` +
                        `<span class="name ">${r.info.nickName}</span>` +
                        `</a>` +
                        `<span class="date" title="${r.info.postTime}">${r.info.dateFormat}</span>` +
                        `</div>` +
                        `</div>` +
                        `<div class="comment-center">` +
                        `<div class="new-comment">${readComment(r.info.content)}</div>` +
                        `</div>` +
                        `</div>` +
                        `</div>` +
                        `</div>` +
                        `</li>` +
                        `<li class="replay-box" style="display:block"><ul class="comment-list">`;
                    $.each(r.sub, function(i1, r1){
                        commentCustom = `${commentCustom}<li class="comment-line-box">` +
                            `<div class="comment-list-item">` +
                            `<a class="comment-list-href" target="_blank" href="https://blog.csdn.net/${r1.userName}">` +
                            `<img src="${r1.avatar}" username="${r1.userName}" alt="${r1.userName}" class="avatar">` +
                            `</a>` +
                            `<div class="right-box">` +
                            `<div class="new-info-box clearfix">` +
                            `<div class="comment-top">` +
                            `<div class="user-box">` +
                            `<a class="name-href" target="_blank" href="https://blog.csdn.net/${r1.userName}">` +
                            `<span class="name ">${r1.nickName}</span>` +
                            (r1.userName === blog_address.split("/")[3] ? `<span class="is_bloger comment_status_tip">作者</span>` : ``) +
                            `</a>` +
                            `<span class="text">回复</span>` +
                            `<span class="nick-name">${r1.parentNickName}</span>` +
                            `<span class="date" title="${r1.postTime}">${r1.dateFormat}</span>` +
                            `</div>` +
                            `</div>` +
                            `<div class="comment-center">` +
                            `<div class="new-comment">${readComment(r1.content.indexOf("[/reply]") > -1 ? (r1.content.indexOf("[/reply]\n") > -1 ? r1.content.substring(r1.content.indexOf("[/reply]\n") + 9) : r1.content.substring(r1.content.indexOf("[/reply]") + 8)) : r1.content)}</div>` +
                            `</div>` +
                            `</div>` +
                            `</div>` +
                            `</div>` +
                            `</li>`;
                    });
                    commentCustom = `${commentCustom}</ul></li></ul>`;
                });
                commentCustom = `${commentCustom}</div></div>`;
                getDOM('#pcCommentSideBox').innerHTML = commentCustom;
                getDOM('#pcCommentSideBox').style.display = 'block';
                removeDOMClass('#pcCommentSideBox', 'unlogin-comment-box-new');
            }
        });
    }
}

/**
 * 暗色主题去除
 */
function removeDarkTheme() {
    const darkToolbarCss = getDOM('link[href*="csdn-toolbar-dark"]');
    if(darkToolbarCss){
        darkToolbarCss.href = darkToolbarCss.href.replace('dark', 'default')
    }
    const darkSkinCss = getDOMs('link[href*="skin-black"], link[href*="skin-clickmove"], link[href*="skin-years"]');
    $.each(darkSkinCss, function(i, r){
        r.href = ""
    });
    const darkLogo = getDOM('img[title="CSDN首页"]');
    if(darkLogo){
        darkLogo.src="https://img-home.csdnimg.cn/images/20201124032511.png"
    }
    modifyDOM('body', 'background-color:#f5f6f7 !important; background-image:none !important;');
}


/**
 * 添加护眼开关
 */
function addEyeComfortToggleButton() {
    const eyeComfortOnButton = generateSideToolBarElement('cuz-eyecomfort-on', commentShow ? 'display: flex' : 'display: none', null, '打开', '护眼');
    const eyeComfortOffButton = generateSideToolBarElement('cuz-eyecomfort-off', !commentShow ? 'display: flex' : 'display: none', null, '关闭', '护眼');
    eyeComfortOnButton.onclick = function(){
        toggleEyeComfort(true);
        eyeComfortOnButton.style = 'display: none';
        eyeComfortOffButton.style = 'display: flex';
    }
    eyeComfortOffButton.onclick = function(){
        toggleEyeComfort(false);
        eyeComfortOnButton.style = 'display: flex';
        eyeComfortOffButton.style = 'display: none';
    }
    getDOM('.csdn-side-toolbar').prepend(eyeComfortOnButton);
    getDOM('.csdn-side-toolbar').prepend(eyeComfortOffButton);
}

/**
 * 添加评论区开关
 */
function addCommentToggleButton() {
    const commentHideButton = generateSideToolBarElement('cuz-comment-hide', commentShow ? 'display: flex' : 'display: none', null, '隐藏', '评论');
    const commentShowButton = generateSideToolBarElement('cuz-comment-show', !commentShow ? 'display: flex' : 'display: none', null, '显示', '评论');
    commentHideButton.onclick = function(){
        showComment(false);
        commentHideButton.style = 'display: none';
        commentShowButton.style = 'display: flex';
    }
    commentShowButton.onclick = function(){
        showComment(true);
        commentHideButton.style = 'display: flex';
        commentShowButton.style = 'display: none';
    }
    getDOM('.csdn-side-toolbar').prepend(commentHideButton);
    getDOM('.csdn-side-toolbar').prepend(commentShowButton);
}

/**
 * 添加目录开关
 */
function addDirectoryToggleButton() {
    const directoryHideButton = generateSideToolBarElement('cuz-directory-hide', directoryShow ? 'display: flex' : 'display: none', null, '隐藏', '目录');
    const directoryShowButton = generateSideToolBarElement('cuz-directory-show', !directoryShow ? 'display: flex' : 'display: none', null, '显示', '目录');
    directoryHideButton.onclick = function(){
        showDirectory(false);
        directoryHideButton.style = 'display: none';
        directoryShowButton.style = 'display: flex';
    }
    directoryShowButton.onclick = function(){
        showDirectory(true);
        directoryHideButton.style = 'display: flex';
        directoryShowButton.style = 'display: none';
    }
    getDOM('.csdn-side-toolbar').prepend(directoryHideButton);
    getDOM('.csdn-side-toolbar').prepend(directoryShowButton);
}

(
    function() {
        // 广告
        hideDOM('#kp_box_www_swiper_ban, .blog-slide-ad-box, .Community > .active-blog > .blog-banner');

        hideDOM('.ad_fullWidth.www-banner-top, .toolbar-advert');

        // 主题处理
        modifyDOM('.toolbar-inside', 'background: #fff !important');
        modifyDOM('body', 'background-color:#f5f6f7 !important; background-image:none !important;');
        // 隐藏左信息
        hideDOM('.blog_container_aside');
        // 调整右侧信息, 保留目录
        modifyDOM('#rightAside', 'display: block;');
        hideDOM('.programmer1Box, #recommendAdBox, #asideArchive, #recommend-right > .kind_person, #rightAsideConcision');
        modifyDOM('#groupfile', 'height: 100% !important; max-height: unset !important; margin-bottom: 0 !important;');
        modifyDOM('#groupfile>.groupfile-div', 'height: calc(100vh - 68px) !important; max-height: unset !important;');
        // 隐藏相关推荐
        hideDOM('.recommend-box, #recommendNps, .template-box');
        // 隐藏底部
        hideDOM('.blog-footer-bottom');
        // 隐藏文章工具栏
        hideDOM('#toolBarBox');

        // 文章主体样式调整
        modifyDOM('.main_father', 'height: auto !important; overflow: hidden !important;')
        modifyDOM('#mainBox', 'height: calc(100vh - 68px) !important; width: calc(100vw - 300px); margin-left: 0 !important;')
        modifyDOM('main', 'width: 70% !important; height: 100% !important; overflow: auto !important; float: right')
        modifyDOM('.blog-content-box', 'padding-bottom: 60px !important;')
        modifyDOM('#article_content', 'height: unset !important; overflow: auto !important;');
        hideDOM('.hide-article-box');

        // 调整右侧工具位置, 隐藏部分按钮
        modifyDOM('.csdn-side-toolbar', 'left: unset !important;')
        modifyDOM('.csdn-side-toolbar .tip-box,.csdn-side-toolbar > [data-type="guide"],.csdn-side-toolbar > [data-type="cs"],.csdn-side-toolbar > [data-type="report"],.csdn-side-toolbar > [data-type="search"],.csdn-side-toolbar > .directory,.csdn-side-toolbar > .sidecolumn', 'display: none !important;')

        // 代码块超长自动展开所有
        hideDOM('.hide-preCode-box');
        modifyDOM('.set-code-hide', 'height: unset !important;max-height: unset !important;');

        // 评论区
        hideDOM('#pcCommentBox, .comment-side-tit-close', '.passport-login-tip-container');
        modifyDOM('#commentSideBoxshadow', 'width: 29.5% !important; display:block !important; background: unset !important; position: relative !important; float: left');
        modifyDOM('.comment-side-content', 'width:100% !important;');
        modifyDOM('#pcCommentSideBox, #pcFlodCommentSideBox', 'height: auto !important; overflow-y: auto !important;');

        // 免登录代码框鼠标可选
        modifyDOM('code', 'user-select: text !important;');

        document.addEventListener('DOMContentLoaded',function(e){
            // 去除谷歌相关广告
            deleteDOMs('script[src*=google],link[href*=google],.adsbygoogle');
            fixDirectoryJump();
            fixGoTop();
            // 评论区DOM位置调整
            moveBeforeDOM('#commentSideBoxshadow', 'main');
            showComment(commentShow);
            showDirectory(directoryShow);
            loadCommentUnlogin();

            removeDarkTheme();$("#content_views").unbind("keydown");
            $("#content_views").unbind("copy")
            removeDOM('.passport-login-container');
        })
        window.onload = function(){
            fixDirectoryJump();
            copyCodeUnlogin();
            addCommentToggleButton();
            addDirectoryToggleButton();
            addEyeComfortToggleButton();
            $("#content_views").off('click','a')
            $("#content_views").find("a").click(function(e){if(this.href&&"_self"!==this.target){e.preventDefault();var t=window.open(this.href,"_blank");t.focus()}})
            $("#content_views").unbind("keydown");
            $("#content_views").unbind("copy")
        }

    }
)();