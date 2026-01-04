// ==UserScript==
// @name              GPT to Wechat
// @description       一些避免社死的伪装
// @match             https://chat.openai.com/*
// @copyright         Chuxin Liang
// @version           1.2.2
// @license           http://www.gnu.org/licenses/gpl-3.0.html
// @namespace         https://blog.becomingcelia.com
// @downloadURL https://update.greasyfork.org/scripts/464899/GPT%20to%20Wechat.user.js
// @updateURL https://update.greasyfork.org/scripts/464899/GPT%20to%20Wechat.meta.js
// ==/UserScript==

// 设置 =====

// 显示在聊天列表名字下面的字
var customMessage = "天地玄黄，宇宙洪荒";

// 背景图链接
var customBackground = "https://images.unsplash.com/photo-1682241229580-e72acdf0eb6d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80";

// 修改图标
// 是否启用 (true / false)
var iconOption = true;
// 自定义图标链接
var customIcon = "https://cdn.jsdelivr.net/gh/liangchuxin/blog-imgs2/img/202304271042142.png";

// 自定义GPT头像

// 是否启用 (true / false)
var avatarOption = true;
// GPT3的
var customAvatar3 = "https://cdn.jsdelivr.net/gh/liangchuxin/blog-imgs2/img/202304272103095.webp";
// GPT4的
var customAvatar4 = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTkvnkIq8QQXT1fNWhHrND3QZCRFnJl-3OvQ&usqp=CAU";

// 左侧栏时间标识（today, yesterday, etc.）
var timeLabel = false;

// 设置结束 ======

// Wechat styles
var style = document.createElement('style');
var basicStyle = '.flex.flex-grow.flex-col.gap-3 { margin-left: auto !important; padding: 8px 13px !important; border-radius: 5px !important; } .relative.flex { margin-left: auto !important; } .bg-gray-50 .relative.flex { margin-left: 0 !important; } .bg-gray-50 .flex.flex-col.relative.items-end { position: relative !important; top: unset !important; left: unset !important; bottom: unset !important; right: unset !important; } .flex.flex-col.relative.items-end { position: absolute !important; right: -51px !important; top: 20px !important; } .bg-gray-50 .flex.flex-grow.flex-col.gap-3 { width: auto !important; max-width: 100% !important; margin-right: auto !important; margin-left: 0 !important; } .markdown.prose.w-full.break-words p, .markdown.prose.w-full.break-words li, .flex.flex-col.items-start.gap-4.whitespace-pre-wrap.break-words { font-size: 14px !important; font-family: system-ui; } .text-base.m-auto, .group.w-full.text-gray-800, .h-full, .w-full.h-32.flex-shrink-0 { background: #111111 !important; } .group.w-full.text-gray-800 { border: none !important; } .relative.flex.flex-col.gap-1 { max-width: 100% !important; } .text-base.gap-4.m-auto { position: relative !important; } .absolute.bottom-0.left-0.w-full.border-t.pt-2 { width: 617px !important; } .relative.flex.h-full.flex-1.items-stretch { flex-direction: row-reverse !important; } .flex.flex-col.w-full.py-2.flex-grow.relative.border { background: transparent !important; border: 0 !important; box-shadow: none !important; } textarea.m-0.w-full.resize-none.border-0.bg-transparent.p-0.pr-7.pl-2 { font-size: 14px !important; font-family: system-ui !important; } textarea.m-0.w-full.resize-none.border-0.bg-transparent.p-0.pr-7.pl-2::placeholder { color: transparent !important; } .btn.btn-neutral.border-0 .flex.w-full.items-center.justify-center.gap-2 { font-size: 0 !important; } .flex.w-full.items-center svg.h-3.w-3 { margin-right: -7.5px !important; } .h-full.flex.ml-1.md.justify-center { margin-bottom: -4px !important; height: 54px px !important; } button.btn.relative.btn-neutral.border-0 { border: 0 !important; opacity: 0.3 !important; background: transparent !important; } .h-full.flex.ml-1.justify-center { margin-top: 1px !important; } div.overflow-hidden.w-full.h-full.relative.flex { height: 600px !important; width: 900px !important; margin: 0 auto !important; border: 1px solid !important; border-radius: 13px !important; box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 22px 70px 4px rgba(0, 0, 0, 0.56), 0 0 0 1px rgba(0, 0, 0, 0) !important; } div#__next { display: flex !important; align-items: center !important; background: url(' + customBackground + ') !important; background-size: cover !important; } .flex-1.overflow-hidden > div.h-full > div { height: 100%; overflow-y: auto; width: 702px !important; } .flex.flex-col.items-center.text-sm { margin: 0 128px 0 14px !important; } form.stretch.mx-2.flex.flex-row.gap-3 { margin-bottom: 20px !important; } a.flex.py-3.px-3.items-center.gap-3.relative.rounded-md.group { border-radius: 0 !important; padding: 15px 1rem !important; font-size: 13.5px !important; font-family: system-ui !important; } a.flex.py-3.px-3.items-center.gap-3.relative.rounded-md.group.bg-gray-800 { padding-bottom: 34px !important; } a.flex.py-3.px-3.items-center.gap-3.relative.rounded-md.group.bg-gray-900 { padding-bottom: 34px !important; } .from-gray-900, .from-gray-800 { display: none !important; } a.flex.py-3.px-3.items-center.gap-3.transition-colors.duration-200.text-white.cursor-pointer.text-sm.rounded-md.border.flex-shrink-0 { height: 25px !important; border-radius: 3px !important; margin: 10px 0 !important; border: 0 !important; font-size: 12px !important; } a.flex.py-3.px-3.items-center.gap-3.relative.rounded-md.cursor-pointer.break-all.pr-14.group::after, a.flex.py-3.px-3.items-center.gap-3.relative.rounded-md.cursor-pointer.break-all.group::after { content: "' + customMessage + '"; position: absolute; left: 44px; bottom: 10px; font-size: 12px; } .text-base.gap-4.m-auto { padding-top: 1.25rem !important; padding-bottom: 1.25rem !important; } .bg-gray-500 .relative.flex span { width: 30px !important; } .flex-1.text-ellipsis.max-h-5.overflow-hidden.break-all.relative { padding-right: 36px !important; }';
var darkStyle = '.bg-gray-50 .flex.flex-grow.flex-col.gap-3 { background-color: #2c2c2c !important; color: #eaeaea !important; } .absolute.bottom-0.left-0.w-full.border-t.pt-2 { background: #111111 !important; border-top: solid 1.5px #1d1d1d !important; } .flex.flex-col.w-full.py-2.flex-grow.relative.border { background: transparent !important; color: #e7e7e7 !important; border: 0 !important; } .px-3.pt-2.pb-3.text-center.text-xs.text-gray-600 span { color: #353435 !important; } div.overflow-hidden.w-full.h-full.relative.flex { border-color: #545454 #414141 #414141 #414141 !important; } a.flex.py-3.px-3.items-center.gap-3.relative.rounded-md.group { background-color: #191919 !important; } a.flex.py-3.px-3.items-center.gap-3.relative.rounded-md.group.bg-gray-800 { background-color: #302f30 !important; } a.flex.py-3.px-3.items-center.gap-3.transition-colors.duration-200.text-white.cursor-pointer.text-sm.rounded-md.border.flex-shrink-0 { background: #202020 !important; color: #646364 !important; } a.flex.py-3.px-3.items-center.gap-3.relative.rounded-md.cursor-pointer.break-all.pr-14.group::after, a.flex.py-3.px-3.items-center.gap-3.relative.rounded-md.cursor-pointer.break-all.group::after { color: #636263; } .text-base.m-auto, .group.w-full.text-gray-800, .h-full, .w-full.h-32.flex-shrink-0 { background: #111111 !important; } .flex.flex-grow.flex-col.gap-3 { background-color: #42b26a !important; color: #09110a !important; }';
var brightStyle = '.bg-gray-50 .flex.flex-grow.flex-col.gap-3 { background-color: #ffffff !important; color: #191919 !important; } .absolute.bottom-0.left-0.w-full.border-t.pt-2 { background: #f3f3f3 !important; border-top: solid 1px #e0e0e0 !important; } .flex.flex-col.w-full.py-2.flex-grow.relative.border { background: transparent !important; color: #171717 !important; border: 0 !important; } .px-3.pt-2.pb-3.text-center.text-xs.text-gray-600 span { color: #aaaaaa !important; } div.overflow-hidden.w-full.h-full.relative.flex { border-color: #FCFCFC #F5F5F5 #F6F6F6 #F5F5F5 !important; } a.flex.py-3.px-3.items-center.gap-3.relative.rounded-md.group { background-color: #f7f7f7 !important; } a.flex.py-3.px-3.items-center.gap-3.relative.rounded-md.group.bg-gray-800 { background-color: #dedede !important; } a.flex.py-3.px-3.items-center.gap-3.transition-colors.duration-200.text-white.cursor-pointer.text-sm.rounded-md.border.flex-shrink-0 { background: #eaeaea !important; color: #a4a4a4 !important; } a.flex.py-3.px-3.items-center.gap-3.relative.rounded-md.cursor-pointer.break-all.pr-14.group::after, a.flex.py-3.px-3.items-center.gap-3.relative.rounded-md.cursor-pointer.break-all.group::after { color: #acacac; } .text-base.m-auto, .group.w-full.text-gray-800, .h-full, .w-full.h-32.flex-shrink-0 { background: #f3f3f3 !important; } .flex.flex-grow.flex-col.gap-3 { background-color: #a9ea7a !important; color: #11170c !important; } .flex-1.text-ellipsis.max-h-5.overflow-hidden.break-all.relative { color: #181818 !important; } .scrollbar-trigger.relative.h-full.w-full.flex-1.items-start { border-right: solid 1px #e0e0e0; } .group button.flex.w-full.items-center:hover, .group:where([data-headlessui-state~=open]) button { background-color: #dedede !important; } .grow.overflow-hidden.text-ellipsis.whitespace-nowrap.text-left.text-white { color: #181818; } svg.h-4.w-4 { color: #adadad !important; } nav.flex.h-full.w-full.flex-col.p-2 { background: #f7f7f7 !important; }';
// style.setAttribute("id", "gpt-to-wechat");
style.innerText = basicStyle;
if (document.documentElement.classList.contains("dark")) {
    style.innerText += darkStyle;
} else {
    style.innerText += brightStyle;
}

if(!timeLabel) {style.innerText += " .sticky.top-0{display: none!important;}"}
var head=document.getElementsByTagName('head')[0]; head.appendChild(style);
head.appendChild(style);

var theme = document.documentElement.classList[0];
let themeInterval = setInterval(function(){
    if (document.documentElement.classList[0] != theme) {
        window.location.reload();
        clearInterval(themeInterval);
        themeInterval = null;
    }
}, 100);



// Change Favicon
if (iconOption) {
    var link = document.createElement('link'),
        oldLink = document.getElementById('dynamic-favicon');
    link.id = 'dynamic-favicon';
    link.rel = 'shortcut icon';
    link.href = customIcon;
    if (oldLink) {
        document.head.removeChild(oldLink);
    }
    document.head.appendChild(link);
}

// Change Profile Pic
function isGpt4() {
    var divs = document.getElementsByTagName('div');
    var i;

    for (i = 0; i < divs.length; i++) {
        var div = divs[i];
        var styles = window.getComputedStyle(div);
        var backgroundColor = styles.getPropertyValue('background-color');

        if ((backgroundColor === 'rgb(0, 0, 0)' || backgroundColor === '#000' || backgroundColor === 'black') && div.tagName.toLowerCase() === 'div') {
            var children = div.children;

            for (var j = 0; j < children.length; j++) {
                if (children[j].tagName.toLowerCase() === 'svg') {
                    return true;
                }
            }
        }
    }
    return false;
}


function changeAvatar(version) {
    var customAvatar;
    if (version=="4") {
        customAvatar = customAvatar4;
    } else if (version=="3") {
        customAvatar = customAvatar3;
    }
    var avatars = document.querySelectorAll('.group.w-full.bg-gray-50 .text-base.gap-4 .flex.flex-col.relative.items-end');
    if (avatars.length === 0) {
        return;
    }
   for (var i = 0; i < avatars.length; i++) {
        if (avatars[i].hasChildNodes()) {
            for (var j = avatars[i].childNodes.length - 1; j >= 0; j--) {
                avatars[i].removeChild(avatars[i].childNodes[j]);
            }
        }
        var newAvatar = document.createElement("div");
        newAvatar.innerHTML = '<div class="relative flex"><span style="box-sizing: border-box; display: inline-block; overflow: hidden; width: initial; height: initial; background: none; opacity: 1; border: 0px; margin: 0px; padding: 0px; position: relative; max-width: 100%;"><span style="box-sizing: border-box; display: block; width: initial; height: initial; background: none; opacity: 1; border: 0px; margin: 0px; padding: 0px; max-width: 100%;"><img alt="" aria-hidden="true" src="data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%2738%27%20height=%2738%27/%3e" style="display: block; max-width: 100%; width: initial; height: initial; background: none; opacity: 1; border: 0px; margin: 0px; padding: 0px;"></span><img alt="Chuxin LIANG" srcset="' + customAvatar + '" src="' + customAvatar + '" decoding="async" data-nimg="intrinsic" class="rounded-sm" style="position: absolute; inset: 0px; box-sizing: border-box; padding: 0px; border: none; margin: auto; display: block; width: 0px; height: 0px; min-width: 100%; max-width: 100%; min-height: 100%;"></span></div>';
        avatars[i].appendChild(newAvatar);
    }

}

(() => {
  let oldPushState = history.pushState;
  history.pushState = function pushState() {
    let ret = oldPushState.apply(this, arguments);
    window.dispatchEvent(new Event('pushstate'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
  };
  let oldReplaceState = history.replaceState;
  history.replaceState = function replaceState() {
    let ret = oldReplaceState.apply(this, arguments);
    window.dispatchEvent(new Event('replacestate'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
  };
  window.addEventListener('popstate', () => {
    window.dispatchEvent(new Event('locationchange'));
  });
})();

let interval;

window.addEventListener('locationchange', function(){
    if (avatarOption) {
        clearInterval(interval);
        interval = null;
        setTimeout(function() {
            checkChange();
        }, 450); // 半秒内重新检测gpt版本，如果网页响应慢导致异常建议上调
    }
})
window.addEventListener('load', function() {
    if (avatarOption) {
        checkChange();
    }
});



function checkChange() {
    var numHistory = 0;
    var avatarSet = false;
    var setValue;
    var stateSet = true;
    interval = setInterval(function() {
        var currentUrl = window.location.href;
        var nodes = document.querySelectorAll('.bg-gray-50 .flex.flex-grow.flex-col.gap-3');
        var nodesNum = nodes.length;
        if(nodesNum == 1) {
            var responseLength = document.querySelectorAll('.bg-gray-50 .flex.flex-grow.flex-col.gap-3 p')[0].innerHTML.length;
            if(responseLength > 1 ){
                numHistory = nodesNum;
                if (avatarSet == false) {
                    setValue = isGpt4()?"4":"3";
                    avatarSet = true;
                }
                if (stateSet == true) {
                    changeAvatar(setValue);
                }
            } else {
            }
        } else {
            if (nodesNum !== numHistory) {
                numHistory = nodesNum;
                if (avatarSet == false) {
                    setValue = isGpt4()?"4":"3";
                    avatarSet = true;
                }
                if (stateSet == true) {
                    changeAvatar(setValue);
                }
            }
        }

    }, 100); // 每 0.1 秒替换头像
}