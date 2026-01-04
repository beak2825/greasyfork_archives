// ==UserScript==
// @name         知乎默认收起回答
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一键收起回答，默认收起回答
// @author       xiantong.zou
// @match        *://www.zhihu.com/question/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/388014/%E7%9F%A5%E4%B9%8E%E9%BB%98%E8%AE%A4%E6%94%B6%E8%B5%B7%E5%9B%9E%E7%AD%94.user.js
// @updateURL https://update.greasyfork.org/scripts/388014/%E7%9F%A5%E4%B9%8E%E9%BB%98%E8%AE%A4%E6%94%B6%E8%B5%B7%E5%9B%9E%E7%AD%94.meta.js
// ==/UserScript==
(function () {
    'use strict';
    console.log("zhihu collaspe run!");

    //收起目前所有
    var collapseNow = function(){
        $('.RichContent-collapsedText').each(function (_, btn) { return btn.click(); });
    };

    //收起目前所有 按钮
    var setCollapsedButton = function () {
        var $CornerButtons = $('.CornerButtons');
        if (!$CornerButtons.length)
            return;
        var $CollapsedTogetherButton = $('.CollapsedTogetherButton');
        if ($CollapsedTogetherButton.length)
            return;
        var $button = $("<button>\u6536\u8d77\u5168\u90e8</button>")
            .addClass('Button CornerButton Button--plain CollapsedTogetherButton')
            .attr('data-tooltip', '一键收起全部')
            .attr('data-tooltip-position', 'left')
            .attr('data-tooltip-will-hide-on-click', 'true')
            .on('click', function () {
                collapseNow();
            });
        var $div = $("<div class='CornerAnimayedFlex'></div>").append($button);
        $div.insertBefore($CornerButtons[0].children[0]);
    };

    var collapseState = false;
    var collapseStateBtn = null;
    var updateCollapse = function(){
        // $('.RichContent-collapsedText').each(function (_, btn) { return btn.click(); });
        //var strOn = "\u9ed8\u8ba4\u6536\u8d77\u003a\u006f\u006e";
        //var strOff = "\u9ed8\u8ba4\u6536\u8d77\u003a\u006f\u0066\u0066";
        collapseStateBtn.textContent = '收:'+ (collapseState ? 'on' : 'off');
        if(collapseState){
            collapseNow();
        }else{

        }
    };


    //默认收起 按钮
    var setCollapsedButton2 = function () {
        var $CornerButtons = $('.CornerButtons');
        if (!$CornerButtons.length)
            return;

        var $button = $("<button>\u6536</button>")
            .addClass('Button CornerButton Button--plain CollapsedTogetherButton')
            .attr('data-tooltip', '是否默认收起回答')
            .attr('data-tooltip-position', 'left')
            .attr('data-tooltip-will-hide-on-click', 'true')
            .on('click', function () {
                collapseState = !collapseState;
                updateCollapse();
            });
        var $div = $("<div class='CornerAnimayedFlex'></div>").append($button);
        $div.insertBefore($CornerButtons[0].children[0]);

        collapseStateBtn = $button[0];
        updateCollapse();


        var answerList = $('.List')[0].children[1].children[0];
        var funI = null;
        var lastAnswerCount = 0;
        answerList.addEventListener('DOMSubtreeModified', function () {
            if(lastAnswerCount == answerList.children.length){
                return;
            }
            lastAnswerCount = answerList.children.length;
            if(funI != null){
                clearTimeout(funI);
                funI = null;
            }
            if(collapseState){
                funI = setTimeout(function (){
                    console.log("collapseNow!!");
                    collapseNow();
                },50);
            }
        }, false);
    };

    setCollapsedButton();
    setCollapsedButton2();
})();
