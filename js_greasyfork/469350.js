// ==UserScript==
// @name         知道审核-密
// @namespace    http://haoren.com/
// @description  一些美好的事，在井然有序地发生！
// @license      BSD
// @version      2.2.5
// @match        *://zhidao.baidu.com/*
// @match        *://shimo.im/*
// @author       好人
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/469350/%E7%9F%A5%E9%81%93%E5%AE%A1%E6%A0%B8-%E5%AF%86.user.js
// @updateURL https://update.greasyfork.org/scripts/469350/%E7%9F%A5%E9%81%93%E5%AE%A1%E6%A0%B8-%E5%AF%86.meta.js
// ==/UserScript==

// 数据区：以下是可供配置的参数-------------------------------------------------------------------------------------------------------------------------
// 敏感字符数组
// 固定敏感符号
var fixedSymbolEntry = ["?", "？", "…", ".", ",", ",,", "..", ",。", ".。", "~", "*", "[", "]", " ", "　", "(", ")", "·", ";",
    "，，", "「", "」", ":", "。’”", "！’”", "、、", "\"", "'", "!", "--", "`", "＇", "•", "′", "—", "，。", "。，", "-", "。。",
    "、。", ",，", "，,",
];
var fixedSymbolEntry_heat = ["?", "？", "…", ".", ",", ",,", "..", ",。", ".。", "~", "*", "[", "]", " ", "　", "(", ")", "·", ";",
"，，", "「", "」", ":", "。’”", "！’”", "、、", "\"", "'", "!", "--", "`", "＇", "•", "′", "—", "，。", "。，", "-", "。。",
"、。", ",，", "，,",
];
// 要检查的双符号（左右不一致）
var doubleSymbolArrAy1 = ["《", "》", "<", ">", "【", "】", "[", "]", "{", "}", "“", "”", "‘", "’", "（", "）", "(", ")"]; 
// 要检查的双符号（左右一致）
var doubleSymbolArrAy2 = ["\"", "\"", "\'", "\'",];
// 段尾检查的合法字符
var lastCharArray = ["。", "！", "。”", "！”", "："]; 
// 打开链接的延迟时间（1秒=1000）
var openLinkTime = 1000;
// 正文字数要求
var passWordCount1 = 200; 
// 拓展字数要求
var passWordCount2 = 200; 
// 展开的延迟时间，1s是1000，如果自动展开失败频率高，可增大此数值
var delayOpenTime = 800; 

// 油猴脚本区-------------------------------------------------------------------------------------------------------------------------
(function () {
    // 'use strict';

    addStyle_check()

    jQueryHighlight();

    function getEncryptedCode() {
        return `
        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
        `.trim();
    }

    GM_registerMenuCommand("设置密钥", function(){
        var key =  GM_getValue("zhidao_check_decryption_key") || ""
        var person = prompt("请输入密钥", key) || "";
        person = person.trim();
        if(person){
            GM_setValue("zhidao_check_decryption_key", person)
            addPrompt("密钥设置成功", + person)
        }
    });

    let key = GM_getValue("zhidao_check_decryption_key") || ""
    let code = ""
    try{
        code = CryptoJS.AES.decrypt(getEncryptedCode(), key).toString(CryptoJS.enc.Utf8)
    } catch(t) {
        console.log(t)
        addPrompt("审核-密钥不正确")
    }
    eval(code)
    
    help();
})();

// 自定义提示
function addPrompt(text) {
    // 移除已有提示框
    $(".custom-prompt").remove();

    // 显示成功提示
    const prompt = document.createElement('div');
    prompt.classList.add("custom-prompt");
    prompt.innerText = text;
    prompt.style.position = 'fixed';
    prompt.style.top = '100px';
    prompt.style.right = '50%';
    prompt.style.transform = 'translateX(50%)';
    prompt.style.padding = '10px 20px';
    prompt.style.background = 'grey';
    prompt.style.borderRadius = '4px';
    prompt.style.zIndex = 20000;
    prompt.style.color = 'lightpink';
    document.body.appendChild(prompt);

    // 2秒后自动移除提示
    setTimeout(() => {
        if (document.body.contains(prompt)) {
            document.body.removeChild(prompt);
        }
    }, 3000);
}

function addStyle_check() {
    // 添加自定义样式
    GM_addStyle(`
        /* 弹窗样式 */
        #popupMoreSet_check {
            /* display: none;  none block */
        }
        #popupMoreSet_check .popupWindow {
            position: fixed;
            width: 600px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            z-index: 10002;
        }

        /* 黑底蒙版 */
        .blackMask {
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            position: fixed;
            inset: 0px;
            z-index: 10001;
        }

        /* 表单样式 */
        #popupMoreSet_check .form {
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        #popupMoreSet_check label {
            font-weight: bold;
            width: 80px;
        }

        #popupMoreSet_check .rightContent {
            width: 500px;
        }

        /* 按钮样式 */
        #popupMoreSet_check button {
            display: inline-block;
            padding: 5px;
            margin-left: 20px;
            background-color: #007bff; /* 按钮背景颜色 */
            color: #fff; /* 文字颜色 */
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            text-align: center;
            text-decoration: none;
        }

        /* 敏感字符高亮 */
        .highlight {
            background-color: yellow;
        }

        /*body,html {
            background: #e4e3de!important;
        }*/
    `);
}

// jQuery.highlight.js插件
function jQueryHighlight(){
    jQuery.extend({highlight:function(e,t,i,n){if(3===e.nodeType){var r=e.data.match(t);if(r){var a=document.createElement(i||"span");a.className=n||"highlight";var h=e.splitText(r.index);h.splitText(r[0].length);var l=h.cloneNode(!0);return a.appendChild(l),h.parentNode.replaceChild(a,h),1}}else if(1===e.nodeType&&e.childNodes&&!/(script|style)/i.test(e.tagName)&&(e.tagName!==i.toUpperCase()||e.className!==n))for(var s=0;s<e.childNodes.length;s++)s+=jQuery.highlight(e.childNodes[s],t,i,n);return 0}}),jQuery.fn.unhighlight=function(e){var t={className:"highlight",element:"span"};return jQuery.extend(t,e),this.find(t.element+"."+t.className).each(function(){var e=this.parentNode;e.replaceChild(this.firstChild,this),e.normalize()}).end()},jQuery.fn.highlight=function(e,t){var i={className:"highlight",element:"span",caseSensitive:!1,wordsOnly:!1};if(jQuery.extend(i,t),e.constructor===String&&(e=[e]),e=jQuery.grep(e,function(e,t){return""!=e}),0==(e=jQuery.map(e,function(e,t){return e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&")})).length)return this;var n=i.caseSensitive?"":"i",r="("+e.join("|")+")";i.wordsOnly&&(r="\\b"+r+"\\b");var a=new RegExp(r,n);return this.each(function(){jQuery.highlight(this,a,i.element,i.className)})}
}