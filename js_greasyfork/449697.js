// ==UserScript==
// @name         【聊天室危险消息屏蔽】
// @namespace    http://tampermonkey.net/
// @version      2.0.2
// @description  屏蔽含有\rule（latex支持的一种代码，会产生大小几乎不受限的长方形页面元素）的危险消息。你也可以自定义屏蔽内容（使用正则表达式）。现在还可以屏蔽敏感词并用【已屏蔽】代替。
// @author       firetree
// @match        https://crosst.chat/?*
// @match        https://hack.chat/?*
// @match        https://xq.kzw.ink/?*
// @match        https://chat.thz.cool/?*
// @icon         none
// @grant        GM_setValue
// @grant        GM_getValue
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/449697/%E3%80%90%E8%81%8A%E5%A4%A9%E5%AE%A4%E5%8D%B1%E9%99%A9%E6%B6%88%E6%81%AF%E5%B1%8F%E8%94%BD%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/449697/%E3%80%90%E8%81%8A%E5%A4%A9%E5%AE%A4%E5%8D%B1%E9%99%A9%E6%B6%88%E6%81%AF%E5%B1%8F%E8%94%BD%E3%80%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function filter_msg() {//遍历所有消息并进行屏蔽
        var msg_divs
        var hide_regex_str = GM_getValue('chatroom_hide_filter_regex')
        var hide_regex = new RegExp(hide_regex_str)
        var replace_regex_str = GM_getValue('chatroom_replace_filter_regex')
        var replace_regex = new RegExp(replace_regex_str,'g')
        var replace = GM_getValue('chatroom_replace')
        msg_divs = Array.from(document.querySelectorAll('div.message'))//获取class为msg的div元素
        if (msg_divs != undefined && msg_divs != [])
        {
            for (var i=0;i<msg_divs.length;i++)
            {
                var div,msg
                div = msg_divs[i]
                msg = div.innerHTML
                if (hide_regex.test(msg) && div.style.display != 'none')//已经屏蔽过的不再次处理
                {
                    div.style.display = 'none'
                    console.log('[危险消息屏蔽] 已屏蔽危险消息：')//由于rule刷屏常常频率极高，因此不适合仅仅改变文本，只能将元素完全隐藏，在控制台将原文留档。
                    console.log(div)
                }
                if (replace_regex.test(msg) && div.style.display != 'none')
                {
                    console.log('[危险消息屏蔽] 已屏蔽危险消息：')
                    console.log(div)
                    div.lastElementChild.innerHTML = div.lastElementChild.innerHTML.replace(replace_regex,replace)
                    //这并不优雅，因为有的聊天室网站的情况可能和测试时使用的hackchat不同以至于message元素的lastElementChild不是消息正文，但是本人才疏学浅，这里姑且用这种方法了。
                }
            }
        }
    }

    function set_hide_regex() {
        let hide_regex_str = prompt('输入正则表达式（不含左右斜杠）：',GM_getValue('chatroom_hide_filter_regex'))//这里是prompt的输入，不需要转义，输入两个斜杠就是两个斜杠
        GM_setValue('chatroom_hide_filter_regex',hide_regex_str)
    }

    function set_replace_regex() {
        let replace_regex_str = prompt('输入正则表达式（不含左右斜杠）：',GM_getValue('chatroom_replace_filter_regex'))//这里是prompt的输入，不需要转义，输入两个斜杠就是两个斜杠
        GM_setValue('chatroom_replace_filter_regex',replace_regex_str)
    }

    function set_replace() {
        let replace = prompt('输入替换词：',GM_getValue('chatroom_replace'))
        GM_setValue('chatroom_replace',replace)
    }

    var settings = document.getElementById('sidebar-content')

    var p1 = document.createElement('p')
    var btn1 = document.createElement('button')
    btn1.onclick = set_hide_regex
    var text1 = document.createTextNode('设置隐藏消息正则表达式')
    btn1.appendChild(text1)
    p1.appendChild(btn1)

    var p2 = document.createElement('p')
    var btn2 = document.createElement('button')
    btn2.onclick = set_replace_regex
    var text2 = document.createTextNode('设置屏蔽消息正则表达式')
    btn2.appendChild(text2)
    p2.appendChild(btn2)

    var p3 = document.createElement('p')
    var btn3 = document.createElement('button')
    btn3.onclick = set_replace
    var text3 = document.createTextNode('设置消息替换词')
    btn3.appendChild(text3)
    p3.appendChild(btn3)

    var hr = document.createElement('hr')
    var h4 = document.createElement('h4')
    h4.appendChild(document.createTextNode('危险消息屏蔽设置'))
    settings.appendChild(hr)
    settings.appendChild(h4)
    settings.appendChild(p1)
    settings.appendChild(p2)
    settings.appendChild(p3)

    if (!GM_getValue('chatroom_hide_filter_regex')) {
        let a = GM_getValue('chatroom_hide_filter_regex')
        let regex_str = '\\rule'.replace(/\\/g,'\\\\')//这里需要使得双引号里的两个斜杠变成的字面量里的一个斜杠再变成两个斜杠，以在正则表达式里匹配一个斜杠。
        GM_setValue('chatroom_hide_filter_regex',regex_str)
        console.log(`发现隐藏过滤功能正则表达式为缺失值${a}，已设为默认值${regex_str}`)
    }

    if (!GM_getValue('chatroom_replace_filter_regex')) {
        let a = GM_getValue('chatroom_replace_filter_regex')
        let regex_str = '傻逼'.replace(/\\/g,'\\\\')//这里需要使得双引号里的两个斜杠变成的字面量里的一个斜杠再变成两个斜杠，以在正则表达式里匹配一个斜杠。
        GM_setValue('chatroom_replace_filter_regex',regex_str)
        console.log(`发现屏蔽过滤功能正则表达式为缺失值${a}，已设为默认值${regex_str}`)
    }

    if (!GM_getValue('chatroom_replace')) {
        let a = GM_getValue('chatroom_replace')
        let replace_str = '【已屏蔽】'
        GM_setValue('chatroom_replace',replace_str)
        console.log(`发现屏蔽过滤功能替换词为缺失值${a}，已设为默认值${replace_str}`)
    }

    var observer = new MutationObserver(filter_msg);//设置聊天室内有新消息后所执行的函数为filter_msg
    const messages = document.getElementById('messages')//获取messages元素
    const config = {childList: true}//配置观察器观察子节点变化
    observer.observe(messages,config)//开始观察
})();