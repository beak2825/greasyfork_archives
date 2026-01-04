// ==UserScript==
// @name         碧蓝幻想救援筛选
// @namespace    https://github.com/Less01
// @version      0.1.2
// @description  筛除人数过多和血量过少的房间，使其变为透明
// @author       Less01
// @match        *://game.granbluefantasy.jp/*
// @match        *://gbf.game.mbga.jp/*
// @icon         https://pjsekai.sega.jp/assets/images/favicon.ico
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465142/%E7%A2%A7%E8%93%9D%E5%B9%BB%E6%83%B3%E6%95%91%E6%8F%B4%E7%AD%9B%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/465142/%E7%A2%A7%E8%93%9D%E5%B9%BB%E6%83%B3%E6%95%91%E6%8F%B4%E7%AD%9B%E9%80%89.meta.js
// ==/UserScript==

(function ($) {
    'use strict';

    /**
    * 我没有文档生成工具，模块都是瞎写的
    * 数据存储模块
    */

    // 此部分格式尽量不要更新修改，否则已存储的数据对不上
    // 界面样式为slot1234，数据data为slot0123（和原版不同）
    let fliterIniSetting = {
        "slot": [
            { "on": true, "enemyHpMin": 0, "enemyHpMax": 50, "playerCountMin": 1, "playerCountMax": 30 },
            { "on": true, "enemyHpMin": 50, "enemyHpMax": 100, "playerCountMin": 1, "playerCountMax": 6 },
            { "on": false, "enemyHpMin": 50, "enemyHpMax": 100, "playerCountMin": 1, "playerCountMax": 6 },
            { "on": false, "enemyHpMin": 50, "enemyHpMax": 100, "playerCountMin": 1, "playerCountMax": 6 }]
    };
    let getValue = GM_getValue("gbf_raid_fliter_setting");
    let fliterSetting = getValue ? JSON.parse(getValue) : fliterIniSetting;
    function setValue() {
        GM_setValue("gbf_raid_fliter_setting", JSON.stringify(fliterSetting));
    }
    // 0为完全透明，1为完全不透明
    let opacity = 0.2;

    /* 暂不提供对透明度、其他高亮方式的修改
    let highlightSetting ={
        "light":false,
        "color":"yellow",
        "hide":true,
        "opacity":0.2
    }*/


    /**
    * 设置面板模块
    * 0.1版本主要更新此部分内容，自定一个面板方便修改筛选条件
    * 4个栏位可以分别设定
    * 风格使用GBF原版风格
    */

    // 部分太老的浏览器及火狐可能不兼容（无法正确显示面板），没有测试过
    // 从原装样式中抄一部分以自用
    const cssText = `
    #GRF-setting {
        display: block;
        position: absolute;
        top: 50px;
        left: 0px;
        z-index: 150001;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        width: 320px;
        min-height: 115px;
    }
    #GRF-setting::before {
        -webkit-border-image: url('https://prd-game-a-granbluefantasy.akamaized.net/assets/img/sp/ui/pop/ui_pop.png?1729002592') 106 0 124 stretch round;
        border-image: url('https://prd-game-a-granbluefantasy.akamaized.net/assets/img/sp/ui/pop/ui_pop.png?1729002592') 106 0 124 fill stretch round;
        position: absolute;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
        z-index: -1;
        border-width: 53px 0 62px;
        border-style: solid;
        content: "";
    }
    #GRF-setting .GRF-header {
        /* -webkit-box-sizing: border-box; */
        box-sizing: border-box;
        height: 53px;
        text-align: center;
        color: #150f0f;
        padding-top: 18px;
    }
    #GRF-setting .GRF-footer {
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        height: 62px;
        text-align: center;
        padding-top: 12px;
    }
    #GRF-setting .GRF-btn-close {
        font-size: 12px;
        text-decoration: none;
        background: url('https://prd-game-a-granbluefantasy.akamaized.net/assets/img/sprite/v3/ui/button-s029d926d06.png') no-repeat 0 -1421px;
        -webkit-background-size: 230px 3136px;
        background-size: 230px 3136px;
        width: 141px;
        height: 36px;
        display: inline-block;
        padding-top: 10px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #f2eee2;
        text-shadow: 0 0 1px #532d0d,0 0 1px #532d0d,0 0 1px #532d0d,0 0 1px #532d0d,0 0 2px #532d0d,0 0 2px #532d0d,0 0 2px #532d0d,0 0 2px #532d0d;
        text-align: center;
        line-height: 1;
    }
    #GRF-setting .GRF-btn-close::after {
        content: "保存并关闭";
    }
    #GRF-setting .GRF-body {
        padding: 0 0 5px;
        font-size: 12px;
        text-align: center;
        line-height: 1.2;
        color: #f2eee2;
        text-shadow: 0px 0px 1px #150f0f,0px 0px 1px #150f0f,0px 0px 1px #150f0f,0px 0px 2px #150f0f,0px 0px 2px #150f0f,0px 0px 2px #150f0f;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        padding: 0px 20px;
        width: 320px;
    }
    #GRF-setting .GRF-intro {
        line-height: 1;
    }
    #GRF-setting .GRF-slots {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        position: relative;
        padding: 9px 12px 0px 12px;
        background: url('https://prd-game-a-granbluefantasy.akamaized.net/assets/img/sprite/v3/quest/search/parts-s17c873b7ef.png') no-repeat 0 -779px;
        -webkit-background-size: 284px 1212px;
        background-size: 284px 1212px;
        width: 256px;
        height: 60px;
        margin: 10px 0;
    }
    #GRF-setting .GRF-btn-slot {
        position: absolute;
        top: 9px;
        width: 60px;
        height: 58px;
    }
    #GRF-setting .GRF-btn-slot.slot1 {left: 12px;}
    #GRF-setting .GRF-btn-slot.slot2 {left: 77px;}
    #GRF-setting .GRF-btn-slot.slot3 {left: 143px;}
    #GRF-setting .GRF-btn-slot.slot4 {left: 208px;}
    #GRF-setting .GRF-btn-slot.active::before {
        position: absolute;
        top: -6px;
        left: -4px;
        display: block;
        background: url('https://prd-game-a-granbluefantasy.akamaized.net/assets/img/sprite/v3/quest/search/parts-s17c873b7ef.png') no-repeat 0 -1024px;
        -webkit-background-size: 284px 1212px;
        background-size: 284px 1212px;
        width: 68px;
        height: 68px;
        content: "";
    }
    #GRF-setting .GRF-slot-label {
        display: block;
        width: 29px;
        height: 15px;
        position: absolute;
        top: 1px;
        left: 4px;
    }
    #GRF-setting .GRF-slot-label.slot1 {
        background: url('https://prd-game-a-granbluefantasy.akamaized.net/assets/img/sprite/v3/quest/search/parts_slot_label-s5b49371d25.png') no-repeat 0 -146px;
        -webkit-background-size: 36px 161px;
        background-size: 36px 161px;
    }
    #GRF-setting .GRF-slot-label.slot2 {
        background: url('https://prd-game-a-granbluefantasy.akamaized.net/assets/img/sprite/v3/quest/search/parts_slot_label-s5b49371d25.png') no-repeat 0 -110px;
        -webkit-background-size: 36px 161px;
        background-size: 36px 161px;
    }
    #GRF-setting .GRF-slot-label.slot3 {
        background: url('https://prd-game-a-granbluefantasy.akamaized.net/assets/img/sprite/v3/quest/search/parts_slot_label-s5b49371d25.png') no-repeat 0 -128px;
        -webkit-background-size: 36px 161px;
        background-size: 36px 161px;
    }
    #GRF-setting .GRF-slot-label.slot4 {
        background: url('https://prd-game-a-granbluefantasy.akamaized.net/assets/img/sprite/v3/quest/search/parts_slot_label-s5b49371d25.png') no-repeat 0 -92px;
        -webkit-background-size: 36px 161px;
        background-size: 36px 161px;
    }
    #GRF-setting .GRF-slot-preview {
        display: block;
        background: url('https://prd-game-a-granbluefantasy.akamaized.net/assets/img_low/sp/quest/assist/assets/thumb/empty.png') no-repeat;
        -webkit-background-size: 50px 35px;
        background-size: 50px 35px;
        width: 50px;
        height: 25px;
        position: absolute;
        top: 18px;
        left: 0px;
        margin:0px 5px;
        font-size: 10px;
        padding: 5px 0;
    }
    #GRF-setting .GRF-slot-preview.inactive {color: #797771;}
    #GRF-setting .GRF-forms {
    padding: 0px 10.5px 0px 10.5px;
    }
    #GRF-setting .GRF-title {
        font-size: 12px;
        display: block;
        background: url('https://prd-game-a-granbluefantasy.akamaized.net/assets/img/sprite/v3/ui/sort_filter/parts-sf485448be5.png') no-repeat 0 -144px;
        -webkit-background-size: 259px 214px;
        background-size: 259px 214px;
        width: 259px;
        height: 14px;
        line-height: 1;
        margin: 5px 0px;
    }
    /* 这里用label代替了选框，和原装相同做法；也可直接用透明的input清除默认样式并自定义形状，效果一样 */
    #GRF-setting .GRF-radio {display: none;}
    #GRF-setting .GRF-radio+label {
        background: url('https://prd-game-a-granbluefantasy.akamaized.net/assets/img/sprite/v3/party/index/pop_picker-s9e7a71dce3.png') no-repeat 0 -344px;
        -webkit-background-size: 225px 696px;
        background-size: 225px 696px;
        width: 88px;
        height: 28px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        display: inline-block;
        margin: 5px 0px;
        padding: 7px 0px 0px 10px;
    }
    #GRF-setting .GRF-radio:checked+label {
        background: url('https://prd-game-a-granbluefantasy.akamaized.net/assets/img/sprite/v3/party/index/pop_picker-s9e7a71dce3.png') no-repeat 0 -205px;
        -webkit-background-size: 225px 696px;
        background-size: 225px 696px;
    }
    #GRF-setting .GRF-slider {
        width: 248px;
        margin: 5px auto 0;
    }
    #GRF-setting .GRF-slider .GRF-track {
        width: 248px;
        height: 14px;
        position: relative;
    }
    #GRF-setting .GRF-slider .GRF-track-background {
        background: url('https://prd-game-a-granbluefantasy.akamaized.net/assets/img/sprite/v3/party/index/parts_pop_assumed_damage-se161881373.png') no-repeat 0 -112px;
        -webkit-background-size: 248px 143px;
        background-size: 248px 143px;
        width: 248px;
        height: 14px;
        position: absolute;
    }
    #GRF-setting .GRF-slider .GRF-track-gauge.hp {
        background: url('https://prd-game-a-granbluefantasy.akamaized.net/assets/img/sprite/v3/party/index/parts_pop_assumed_damage-se161881373.png') no-repeat 0 -22px;
        -webkit-background-size: 248px 143px;
        background-size: 248px 143px;
        width: 234px;
        height: 14px;
        position: absolute;
        margin: 0px 7px;
    }
    #GRF-setting .GRF-slider .GRF-track-gauge.player {
        background: url('https://prd-game-a-granbluefantasy.akamaized.net/assets/img/sprite/v3/party/index/parts_pop_assumed_damage-se161881373.png') no-repeat 0 -129px;
        -webkit-background-size: 248px 143px;
        background-size: 248px 143px;
        width: 234px;
        height: 14px;
        position: absolute;
        margin: 0px 7px;
    }
    #GRF-setting .GRF-slider .GRF-track-cover {
        background: url('https://prd-game-a-granbluefantasy.akamaized.net/assets/img/sprite/v3/party/index/parts_pop_assumed_damage-se161881373.png') no-repeat 0 -56px;
        -webkit-background-size: 248px 143px;
        background-size: 248px 143px;
        width: 248px;
        height: 14px;
        position: absolute;
    }
    /* 原装滑块实际并不支持拖动，而是通过点击刻度来操作；这里用伪元素配合js达成双滑块 */
    #GRF-setting .GRF-slider .GRF-thumb-wrapper {
       /* width: 234px;
        height: 19px;
        margin: 0 auto;*/
    }
    #GRF-setting .GRF-slider .GRF-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 258px;
        height: 19px;
        margin: 0 -5px;
        background-color: #0000;
    }
    #GRF-setting .GRF-slider .GRF-thumb::-webkit-slider-runnable-track {}
    #GRF-setting .GRF-slider .GRF-thumb::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        background: url('https://prd-game-a-granbluefantasy.akamaized.net/assets/img/sprite/v3/party/index/parts_pop_assumed_damage-se161881373.png') no-repeat 0 -73px;
        -webkit-background-size: 248px 143px;
        background-size: 248px 143px;
        width: 24px;
        height: 19px;
    }
    /* 火狐没有测试过，不知道有什么区别 */
    #GRF-setting .GRF-slider .GRF-thumb::-moz-range-track {}
    #GRF-setting .GRF-slider .GRF-thumb::-moz-range-thumb {
        -webkit-appearance: none;
        appearance: none;
        background: url('https://prd-game-a-granbluefantasy.akamaized.net/assets/img/sprite/v3/party/index/parts_pop_assumed_damage-se161881373.png') no-repeat 0 -73px;
        -webkit-background-size: 248px 143px;
        background-size: 248px 143px;
        width: 24px;
        height: 19px;
    }
    #GRF-setting .GRF-slider .GRF-thumb.max {
        transform: scaleY(-1);
    }
    #GRF-setting .GRF-slider .GRF-thumb+label {display: none;}
    #GRF-setting .GRF-slider .GRF-slider-result {
        color: #f2eee2;
        text-shadow: 0 0 1px #258eb5,0 0 1px #258eb5,0 0 1px #258eb5,0 0 1px #258eb5,0 0 2px #258eb5,0 0 2px #258eb5,0 0 2px #258eb5,0 0 2px #258eb5;
        margin-top: 3px;
        text-align: right;
    }
    `;
    // 注入 CSS
    $(`head`).append(`<style type="text/css">${cssText}</style>`);
    
    // 使用GM菜单打开设定面板
    // TODO 本来想长按检索设定（.btn-search-setting）打开控制面板，但不成功
    GM_registerMenuCommand("打开控制面板", panel, { title: window.location.href });
    function panel() {
        // 避免重复打开
        if ($(`#fliter-setting-panel`).length) {
            alert("已经打开，不要重复打开面板");
            return;
        }
        // 避免同时打开可能会产生一些问题
        else if ($(`.pop-search-setting`).length) {
            alert("请关闭原版检索设定后再打开面板");
            return;
        }
        // 避免在其他页打开可能会产生一些问题，同时方便写打开时默认slot
        else if (!/^#quest\/assist(\/multi\/\d+|\/event)?$/.test(location.hash)) {
            alert("当前不在救援页");
            return;
        }
        // 预防多个窗口间setting不一致，暂不使用定期同步
        getValue = GM_getValue("gbf_raid_fliter_setting");

        // 使用原装遮罩
        $(`.mask`).show();

        // 创建面板元素，并添加到弹窗预留位置
        // 元素以GRF(gbf-raid-fliter)为前缀，可以点击部分以btn为前缀
        // TODO 弹出和关闭动一下的动画不会做，可能需要先建面板，再给面板加class，以后再说
        // TODO 关于面板的位置，原装是会上下居中的，暂固定为顶部
        const htmlText = `
        <div id="GRF-setting">
            <div class="GRF-header">救援筛选设定</div>
            <div class="GRF-body">
                <div class="GRF-intro">请选择栏位分别设定</div>
                <div class="GRF-slots">
                    <div class="GRF-btn-slot slot1" data-slot="0">
                        <div class="GRF-slot-label slot1"></div>
                        <div class="GRF-slot-preview"></div>
                    </div>
                    <div class="GRF-btn-slot slot2" data-slot="1">
                        <div class="GRF-slot-label slot2"></div>
                        <div class="GRF-slot-preview"></div>
                    </div>
                    <div class="GRF-btn-slot slot3" data-slot="2">
                        <div class="GRF-slot-label slot3"></div>
                        <div class="GRF-slot-preview"></div>
                    </div>
                    <div class="GRF-btn-slot slot4" data-slot="3">
                        <div class="GRF-slot-label slot4"></div>
                        <div class="GRF-slot-preview"></div>
                    </div>
                </div>
                <div class="GRF-forms">
                    <h3 class="GRF-title">开启筛选</h3>
                    <div class="GRF-radio-wrapper">
                        <input type="radio" name="GRF-switch" id="GRF-switch-on" class="GRF-radio" value="on">
                        <label for="GRF-switch-on">开</label>
                        <input type="radio" name="GRF-switch" id="GRF-switch-off" class="GRF-radio" value="off">
                        <label for="GRF-switch-off">关</label>
                    </div>
                    <h3 class="GRF-title">还剩HP</h3>
                    <div id="GRF-hp-setting" class="GRF-slider">
                        <input type="range" id="GRF-hp-min" class="GRF-thumb min" min="0" max="20">
                        <label for="GRF-hp-min"></label>
                        <div class="GRF-track">
                            <div class="GRF-track-background"></div>
                            <div class="GRF-track-gauge hp"></div>
                            <div class="GRF-track-cover"></div>
                        </div>
                        <input type="range" id="GRF-hp-max" class="GRF-thumb max" min="0" max="20">
                        <label for="GRF-hp-max"></label>
                        <div class="GRF-slider-result">数字显示</div>
                    </div>
                    <h3 class="GRF-title">参战人数</h3>
                    <div id="GRF-player-setting" class="GRF-slider">
                        <input type="range" id="GRF-player-min" class="GRF-thumb min" min="1" max="30">
                        <label for="GRF-player-min"></label>
                        <div class="GRF-track">
                            <div class="GRF-track-background"></div>
                            <div class="GRF-track-gauge player"></div>
                            <div class="GRF-track-cover"></div>
                        </div>
                        <input type="range" id="GRF-player-max" class="GRF-thumb max" min="1" max="30">
                        <label for="GRF-player-max"></label>
                        <div class="GRF-slider-result">数字显示</div>
                    </div>
                </div>
            </div>
            <div class="GRF-footer">
                <div class="GRF-btn-close"></div>
            </div>
        </div>
        `;
        $(`#pop`).append(htmlText);

        // 添加以上HTML对应功能
        let activeSlot = $(`#prt-search-switch > .prt-search-switch-wrapper > .btn-search-switch.active`).attr("data-slot") - 1;
        // 关闭按钮
        $(`#GRF-setting .GRF-btn-close`).on('click', function () {
            $(`#GRF-setting`).remove();
            $(`.mask`).hide();
            setValue();
            refreshRaid();
        });

        // 刷新栏位显示,初始化
        function refreshSlot() {
            let $slot = $(`#GRF-setting .GRF-btn-slot`);
            $slot.each(function () {
                // 修改active高亮
                let slot = $(this).attr("data-slot");
                if (slot == activeSlot) { $(this).addClass("active"); }
                else { $(this).removeClass("active"); }
                // 填写预览数据
                let slotSetting = fliterSetting.slot[slot];
                let $preview = $(`.GRF-slot-preview`, $(this));
                $preview.html(`${slotSetting.enemyHpMin}-${slotSetting.enemyHpMax}血<br>${slotSetting.playerCountMin}-${slotSetting.playerCountMax}人`);
                // 修改开关高亮
                if (!slotSetting.on) { $preview.addClass("inactive"); }
                else { $preview.removeClass("inactive"); }
            });
        }
        refreshSlot();
        // 切换栏位绑定事件
        $(`#GRF-setting .GRF-btn-slot`).on('click', function () {
            activeSlot = $(this).attr("data-slot");
            // 也可以拿出来做全刷新，区别不大
            refreshSlot();
            refreshSwtich();
            refreshHp();
            refreshPlayer();
        });

        // 刷新开关显示（单选），初始化
        function refreshSwtich(slot) {
            let $switch = $(`#GRF-setting input[name="GRF-switch"]`);
            let on = fliterSetting.slot[activeSlot].on ? "on" : "off";
            // radio自带checked修改，但初始化和切换slot仍需要
            $switch.each(function () {
                $(this).prop('checked', $(this).attr("value") == on);
            });
        }
        refreshSwtich();
        // 单选按钮绑定事件
        $(`#GRF-setting input[name="GRF-switch"]`).on('change', function () {
            // $(this)长度为1，直接val()问题不大
            fliterSetting.slot[activeSlot].on = ($(this).val() == "on");
            refreshSlot();
            refreshSwtich();
        });

        // 刷新血量范围（双滑块），初始化
        function refreshHp() {
            let $slider = $("#GRF-hp-setting");
            let min = fliterSetting.slot[activeSlot].enemyHpMin;
            let max = fliterSetting.slot[activeSlot].enemyHpMax;
            // 刷新刻度、上滑块、下滑块、数字显示
            $(".GRF-track-gauge", $slider).css("clip-path", `inset(0 ${100 - max}% 0 ${min}%)`);
            $(".GRF-thumb.min", $slider).val(min / 5);
            $(".GRF-thumb.max", $slider).val(max / 5);
            $(".GRF-slider-result", $slider).text(`${min}% ～ ${max}%`);
        }
        refreshHp();
        // 滑块绑定事件，在拖动过程中触发用input，在抬起鼠标时触发用change
        $(`#GRF-setting #GRF-hp-min`).on('input', function () {
            fliterSetting.slot[activeSlot].enemyHpMin = $(this).val() * 5;
            // 避免倒挂，观感好一点
            if (fliterSetting.slot[activeSlot].enemyHpMin > fliterSetting.slot[activeSlot].enemyHpMax) {
                fliterSetting.slot[activeSlot].enemyHpMax = fliterSetting.slot[activeSlot].enemyHpMin;
            }
            refreshSlot();
            refreshHp();
        });
        $(`#GRF-setting #GRF-hp-max`).on('input', function () {
            fliterSetting.slot[activeSlot].enemyHpMax = $(this).val() * 5;
            if (fliterSetting.slot[activeSlot].enemyHpMin > fliterSetting.slot[activeSlot].enemyHpMax) {
                fliterSetting.slot[activeSlot].enemyHpMin = fliterSetting.slot[activeSlot].enemyHpMax;
            }
            refreshSlot();
            refreshHp();
        });
        // 刷新人数范围（双滑块），初始化
        function refreshPlayer() {
            let $slider = $("#GRF-player-setting");
            let min = fliterSetting.slot[activeSlot].playerCountMin;
            let max = fliterSetting.slot[activeSlot].playerCountMax;
            // 刷新刻度、上滑块、下滑块、数字显示
            $(".GRF-track-gauge", $slider).css("clip-path", `inset(0 ${(30 - max) * 100 / 29}% 0 ${(min - 1) * 100 / 29}%)`);
            $(".GRF-thumb.min", $slider).val(min);
            $(".GRF-thumb.max", $slider).val(max);
            $(".GRF-slider-result", $slider).text(`${min}人 ～ ${max}人`);
        }
        refreshPlayer();
        // 滑块绑定事件，在拖动过程中触发用input，在抬起鼠标时触发用change
        $(`#GRF-setting #GRF-player-min`).on('input', function () {
            // 隐式转换确保是数字
            fliterSetting.slot[activeSlot].playerCountMin = $(this).val() * 1;
            if (fliterSetting.slot[activeSlot].playerCountMin > fliterSetting.slot[activeSlot].playerCountMax) {
                fliterSetting.slot[activeSlot].playerCountMax = fliterSetting.slot[activeSlot].playerCountMin;
            }
            refreshSlot();
            refreshPlayer();
        });
        $(`#GRF-setting #GRF-player-max`).on('input', function () {
            fliterSetting.slot[activeSlot].playerCountMax = $(this).val() * 1;
            if (fliterSetting.slot[activeSlot].playerCountMin > fliterSetting.slot[activeSlot].playerCountMax) {
                fliterSetting.slot[activeSlot].playerCountMin = fliterSetting.slot[activeSlot].playerCountMax;
            }
            refreshSlot();
            refreshPlayer();
        });
    }


    /**
    * 应用筛选模块
    */

    // 读取raid列表数据，不是右上角那个真的刷新，而是重新应用高亮
    // 若因不在救援页等原因，使两个jquery选择器找不到结果，则不会产生效果也不会出错
    function refreshRaid() {
        let slot = $(`#prt-search-switch > .prt-search-switch-wrapper > .btn-search-switch.active`).attr("data-slot") - 1;
        $(`#prt-search-list`).children().each(function (index) {
            let hp = $(`.prt-raid-gauge-inner`, this).attr("style").slice(7, -2);
            let player = $(`.prt-flees-in`, this).text().replace(/\/\d+/, "");
            fliter($(this), slot, hp, player);
        });
    }

    // 目标HP、玩家数量都在范围内（两端均包含），则满足高亮条件
    function fliter($element, usingSlot, enemyHp, playerCount) {
        let slotSetting = fliterSetting.slot[usingSlot];
        if (slotSetting.on && (enemyHp < slotSetting.enemyHpMin || enemyHp > slotSetting.enemyHpMax || playerCount < slotSetting.playerCountMin || playerCount > slotSetting.playerCountMax)) { $element.css("opacity", opacity); }
        else { $element.css("opacity", ""); }
    }

    /* 暂不提供透明度、其他高亮方式（没找到效果很好的）、以及多种不同亮度、根据一次方程筛选
    function highlight(pass,$element) {
        if (!pass && highlightSetting.hide) {$element.css("opacity",highlightSetting.opacity);}
        if (!pass && highlightSetting.hide) {$element.fadeTo("fast",highlightSetting.opacity);}
        if (pass && highlightSetting.light) {$element.css("background-color",highlightSetting.color);}
    }*/


    /**
    * 观察监听模块
    */

    // 监听页面内容变化，当救援列表改变时修改透明度
    // 观察到prt-search-list元素的直接子元素发生变化时，处理页面
    const observer = new MutationObserver((mutationsList) => { if (mutationsList.find((mutation) => { return mutation.target.id == "prt-search-list"; })) { refreshRaid(); } });

    // 打开网页时、游戏内跳转时启用
    function run() {
        const targetNode = document.querySelector("#wrapper>.contents");
        const config = { childList: true, subtree: true };
        if (/^#quest\/assist(\/multi\/\d+|\/event)?$/.test(location.hash)) {
            observer.observe(targetNode, config);
            // console.log("observe\n");
        } else {
            observer.disconnect();
            // console.log("disconnect\n");
        }
    }
    run();
    window.addEventListener("hashchange", run);
    window.addEventListener("beforeunload", () => { observer.disconnect(); });
})(jQuery);