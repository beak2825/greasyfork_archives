// ==UserScript==
// @name         b站直播自定义颜文字输入插件
// @namespace    https://github.com/NieR4ever
// @version      1.4.4
// @description  b站直播自带的颜文字无了･ﾟﾟ･(>д<)･ﾟﾟ･｡
// @author       爱虎虎的小饼干
// @match        https://live.bilibili.com/*
// @icon         http://i2.hdslb.com/bfs/face/e95015d06a56f732fd5d6a33250412f434b3c0f5.jpg@125w_125h.webp
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      https://cdn.staticfile.org/jquery/1.11.1/jquery.min.js
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/432252/b%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%AE%9A%E4%B9%89%E9%A2%9C%E6%96%87%E5%AD%97%E8%BE%93%E5%85%A5%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/432252/b%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%AE%9A%E4%B9%89%E9%A2%9C%E6%96%87%E5%AD%97%E8%BE%93%E5%85%A5%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //颜文字列表
    const kaomojiList = [
        "(⌒▽⌒)", "（￣▽￣）", "(=・ω・=)", "(｀・ω・´)",
        "(〜￣△￣)〜", "(･∀･)", "(°∀°)ﾉ", "(￣3￣)",
        "╮(￣▽￣)╭","( ´_ゝ｀)","←_←","→_→",
        "(←_←)","(→_→)","〜(￣▽￣〜)","(;¬_¬)",
        "(▔□▔)/","(ﾟДﾟ≡ﾟдﾟ)!?","Σ(ﾟдﾟ;)","Σ( ￣□￣||)",
        "(´；ω；`)","（/TДT)/","(^・ω・^ )","(｡･ω･｡)",
        "(●￣(ｴ)￣●)","ε=ε=(ノ≧∇≦)ノ","(´･_･`)","(-_-#)",
        "（￣へ￣）","(￣ε(#￣)Σ","ヽ(`Д´)ﾉ","(╯°口°)╯(┴—┴",
        "#-_-)┯━┯", "_(:3」∠)_", "←◡←"
    ];

    GM_addStyle(`
    .list-content-candidate:hover {
      color: #23ade5 !important;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
    }
    .kaomoji-span {
      padding: 3px;
      color: #999;
      cursor: pointer;
      margin: 3px 3px 3px 0;
    }
    .kaomoji-span:nth-child(4n) {
       margin: 3px 0 3px 0;
     }
    `)

    //绘制面板框架
    const kaomojiPanel = $(`<div id="kaomojiPanel"
    class="border-box dialog-ctnr common-popup-wrap top-left a-scale-out v-leave-to"
    style="transform-origin: 63px buttom; width: 280px; margin: 0px 0px 0px -140px; left:50%; display:none;     bottom: 100%;
    padding: 16px;
    position: absolute;
    z-index: 699;"
    >
        <div data-v-b505b1e4 class="arrow p-absolute" style="left:95px;"></div>
        <div id="kaomojiDiv" style="height:200px;overflow-y:auto"></div>
    </div>`);

    //绘制颜文字按钮组件
    const kaomojiIcon = $(`<span data-`+GM_getValue("data-v")+` title="颜文字面板" id="kaomojiIcon" class="icon-item icon-font icon-yan-text"></span>`);

    //元素定位参数
    const iconPanelStr = ".icon-left-part";
    const controlPanelStr = "#control-panel-ctnr-box";
    const kaomojiDivStr = "#kaomojiDiv";
    const kaomojiPanelStr = "#kaomojiPanel";
    const kaomojiIconStr = "#kaomojiIcon";
    const textareaStr = "textarea.chat-input";
    const sendBtnStr = "div.right-action button";

    //添加图标到页面
    (function insertKaomojiIcon() {
        var iconPanel = $(iconPanelStr);
        if (iconPanel.length > 0) {
            iconPanel.append(kaomojiIcon);
            for(var key in iconPanel[0].dataset) {
                GM_setValue("data-v",key.replace("B","-b"));
            }
        } else {
            requestAnimationFrame(function () {
                insertKaomojiIcon();
            });
        }
    })();
    //添加面板到页面
    (function insertKaomojiPanel() {
        var panel = $(controlPanelStr);
        if (panel.length > 0) {
            panel.append(kaomojiPanel);
        } else {
            requestAnimationFrame(function () {
                insertKaomojiPanel();
            });
        }
    })();
    //加载颜文字列表
    (function insertKaomojiSpan() {
        var panel = $(kaomojiDivStr);
        if (panel.length > 0) {
            for (var i = 0; i < kaomojiList.length; i++) {
                var kaomojiSpan = $("<span></span>").attr("class", "list-content-candidate dp-i-block kaomoji-span ").text(kaomojiList[i]);
                kaomojiSpan.click(inputToText);
                kaomojiSpan.mouseup(sendKaomoji);
                panel.append(kaomojiSpan);
            }
        } else {
            requestAnimationFrame(function () {
                insertKaomojiSpan();
            });
        }
    })();

    //给图标和面板添加点击事件
    (function setKaomojiBtn() {
        var panel = $(kaomojiPanelStr);
        var icon = $(kaomojiIconStr);
        var timer = 0;
        function setTimer() {
            timer = setTimeout(hidePanel, 100);
        };
        function clearTimer() {
            clearTimeout(timer);
            openPanel();
        };
        function openPanel() {
            panel.attr("class", "border-box dialog-ctnr common-popup-wrap top-left a-scale-in-ease v-leave-to");
            panel.css("display", "");
        }
        function hidePanel() {
            panel.attr("class", "border-box dialog-ctnr common-popup-wrap top-left a-scale-out v-leave-to");
            panel.css("display", "none");
        }
        if (icon.length > 0) {
            icon.mouseenter(clearTimer);
            icon.mouseleave(setTimer);
            panel.mouseenter(clearTimer);
            panel.mouseleave(setTimer);
            panel.bind("contextmenu",()=>{return false});
        } else {
            requestAnimationFrame(function () {
                setKaomojiBtn();
            });
        }
    })();

    //给颜文字添加点击事件
    function inputToText() {
        var text = $(this).text();
        var textarea = $(textareaStr);
        var con = textarea.val();
        var pos = getCursortPosition(textarea[0]);
        textarea.val(con.substr(0,pos) + text + con.substr(pos));
        setCaretPosition(textarea[0],pos+text.length);
        textarea[0].dispatchEvent(new Event('input', { "bubbles": true, "cancelable": true }));
    }
    
    //右键直接发送表情
    function sendKaomoji(e) {
        if(e.which == 3) {
            var text = $(this).text();
            var textarea = $(textareaStr);
            var con = textarea.val();
            textarea.val(text);
            textarea[0].dispatchEvent(new Event('input', { "bubbles": true, "cancelable": true }));
            $(sendBtnStr).click();
            textarea.val(con);
            textarea[0].dispatchEvent(new Event('input', { "bubbles": true, "cancelable": true }));
        } else {
            return;
        }
    }
    //获取光标位置函数
    function getCursortPosition (ctrl) {
        var CaretPos = 0;	// IE Support
        if (document.selection) {
            ctrl.focus ();
            var Sel = document.selection.createRange ();
            Sel.moveStart ('character', -ctrl.value.length);
            CaretPos = Sel.text.length;
        }
        // Firefox support
        else if (ctrl.selectionStart || ctrl.selectionStart == '0')
            CaretPos = ctrl.selectionStart;
        return (CaretPos);
    }
    //设置光标位置函数
    function setCaretPosition(ctrl, pos){
        if(ctrl.setSelectionRange)
        {
            ctrl.focus();
            ctrl.setSelectionRange(pos,pos);
        }
        else if (ctrl.createTextRange) {
            var range = ctrl.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    }
})();