// ==UserScript==

// @name         SCboy论坛用户屏蔽脚本

// @namespace    http://tampermonkey.net/

// @version      0.2

// @description  用于屏蔽特定用户在Scboy论坛中显示的信息

// @author       西桑Shisan

// @match        https://www.scboy.com/*

// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/406509/SCboy%E8%AE%BA%E5%9D%9B%E7%94%A8%E6%88%B7%E5%B1%8F%E8%94%BD%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/406509/SCboy%E8%AE%BA%E5%9D%9B%E7%94%A8%E6%88%B7%E5%B1%8F%E8%94%BD%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
var block_list = ["123456789", "12345678910"]

// 在以上block_list中替换和添加你希望屏蔽用户的UID（数量不限，注意保留双引号，ID之间要加逗号）。
// UID可以从用户主页中获得，例如论坛管理员Tager的主页：
// https://www.scboy.com/?user-7.htm
// 其中user-7提示了其UID，也即Tager的UID为7

for(var i = 0, len = block_list.length; i < len; i++){
    block_list[i] = "a[href='?user-" + block_list[i] + ".htm']"
}

// 有需要保留的部分，将其注释掉即可
$(block_list.join(', ')).each(function(){
    // 发帖
    if ($(this).parent().parent().hasClass('thread')){
        $(this).parent().parent().hide();
    }
    // 消息（消息会被屏蔽，但依然会有红点提示）
    if ($(this).parent().parent().hasClass('notice')){
        $(this).parent().parent().hide();
    }
    // 回帖
    if ($(this).parent().parent().hasClass('post')){
        $(this).parent().parent().hide();
    }
    // 楼中楼（在楼中楼回复为2页及以上时，因技术有限，点到第二页会使屏蔽功能失效，因此请谨慎点击）
    if ($(this).parent().hasClass('text-left')){
        $(this).hide();
        $(this).next().hide();
    }
    // 他人对黑名单用户回帖的引用
    if ($(this).parent().hasClass('blockquote')){
        $(this).parent().hide();
    }
})