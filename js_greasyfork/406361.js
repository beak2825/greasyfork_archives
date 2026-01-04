// ==UserScript==
// @name         Yobot合刀辅助计算器
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  辅助计算合刀
// @author       NONE
// @license      MIT
// @run-at       document-start
// @match        *://*/yobot/clan/*
// @exclude      *://*/yobot/clan/*/*/*
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// @grant        GM.getValue
// @grant        GM.setClipboard
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.info
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.0/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/406361/Yobot%E5%90%88%E5%88%80%E8%BE%85%E5%8A%A9%E8%AE%A1%E7%AE%97%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/406361/Yobot%E5%90%88%E5%88%80%E8%BE%85%E5%8A%A9%E8%AE%A1%E7%AE%97%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';


    $(document).ready(function() {
        GM_addStyle(`
        .hidden {
            display: none !important;
        }
        `)

        function btnFactory(content, onClick) {
            const btn = $.parseHTML(`
            <button type="button" id = "myopen" class="el-button el-button--primary el-button--small"><!----><!----><span>${content}</span></button>
            `);
            $(btn).click(openpanel);

            return btn;
        };

        async function hehe(){
            var bossHp = vm.bossData.health;
            var damage_high = $('#damageA').val();
            var requiredtime = $('#mytime').val();
            var damage_low = $('#damageB').val();

            var max_extra_damage = Math.ceil(damage_high / 8.2);
            var fixed_med = bossHp/requiredtime*10.99999;
            var requireddamage = Math.ceil(bossHp - fixed_med);
            var msg = "";
            if (damage_high > damage_low)
            {
                if ( (damage_high + damage_low) >= bossHp )
                    if (bossHp < 5000)
                    {
                        msg = "建议使用最强刀收尾，可获得完整补偿刀90s";
                    }
                    else if((damage_low + max_extra_damage) > bossHp )
                    {
                        if ( requireddamage > damage_low ) msg = "需要 "+requireddamage +"~"+ bossHp+" 伤害合刀，可获得最大补偿刀90s";
                        else msg = "使用DD刀合刀即可获得最大补偿刀90s";
                    }
                    else
                    {
                        if (bossHp < damage_high) msg = "需要 " +requireddamage +"~"+ bossHp+" 伤害合刀，可获得最大补偿刀90s";
                        else msg = "需要 " +requireddamage +"~"+ bossHp+" 伤害合刀，可获得最大补偿刀90s,并获得最大理论最大白嫖刀"+max_extra_damage;
                    }
                else msg = "BOSS无法合刀击杀";

            }
            else
            {
                msg = "请确最强刀伤害高于DD刀";
            }

            const resultout = $('#myresult').text(msg);

        }

        async function closepanel(){
            const panel = $('#calculator');
            const myborad = $('#myboard');
            panel.addClass("hidden");
            myborad.addClass("hidden");
            const resultout = $('#myresult').text("");
        }

        async function openpanel(){
            const panel = $('#calculator');
            const myborad = $('#myboard');
            panel.removeClass("hidden");
            myborad.removeClass("hidden");
        }

        function create() {
            const group = $(".el-dialog__wrapper").last();
            const calcBtn = btnFactory("合刀计算", hehe);
            const calculator = $.parseHTML(`
            <div id = "calculator" class="el-dialog__wrapper hidden" style="z-index: 2043;">
            <div role="dialog" aria-modal="true" aria-label="合刀计算" class="el-dialog" style="margin-top: 15vh;">
            <div class="el-dialog__header">
            <span class="el-dialog__title">合刀计算</span>
            <button type="button" aria-label="Close" class="el-dialog__headerbtn myclose">
            <i class="el-dialog__close el-icon el-icon-close"></i>
            </button></div><div class="el-dialog__body">
            <form class="el-form"><div class="el-form-item">
            <label class="el-form-item__label">伤害值A</label>
            <div class="el-form-item__content">
            <div class="el-input el-input-group el-input-group--prepend">
            <div class="el-input-group__prepend">最强刀</div>
            <input type="text" autocomplete="off" id = "damageA" class="el-input__inner" placeholder="1000000">
            <!----><!----><!----><!----></div><!----></div></div> 
            <div class="el-form-item">
            <label class="el-form-item__label">剩余时间</label>
            <div class="el-form-item__content">
            <div class="el-input el-input-group el-input-group--prepend">
            <div class="el-input-group__prepend">A出刀所用时间（秒）</div>
            <input type="text" autocomplete="off" value="90" id = "mytime" class="el-input__inner">
            <!----><!----><!----><!----></div><!----></div></div> 
            <div class="el-form-item">
            <label class="el-form-item__label">伤害值B</label>
            <div class="el-form-item__content">
            <div class="el-input el-input-group el-input-group--prepend">
            <div class="el-input-group__prepend">垫刀</div>
            <input type="text" autocomplete="off" value = "1" id = "damageB" class="el-input__inner">
            <!----><!----><!----><!----></div><!----></div></div> 
            <div class="el-form-item">
            <label class="el-form-item__label">结果</label>
            <div class="el-form-item__content">
            <div class="el-input el-input-group el-input-group--prepend">
            <div class="el-input-group__prepend"></div>
            <div class="el-input__inner" id = "myresult"></div>
            <!----><!----><!----><!----></div><!----></div></div> 
            </form> 
            </div>
            <div class="el-dialog__footer"><div class="dialog-footer">
            <button type="button" class="el-button el-button--default myclose">
            <!----><!----><span>关闭</span></button> 
            <button type="button" id = "mycal" class="el-button el-button--primary"><!----><!----><span>计算</span></button>
            </div></div></div></div>
            `);
            var shell = $.parseHTML(`
            <div class="el-col el-col-6"></div>
            `);
            group.after(calculator);

            group.after(shell);
            const group2 = $(".el-col-6").last();
            group2.append(calcBtn);

            //const body = $("body").attr("el-popup-parent--hidden");
            const body = $("body");
            const board =  $.parseHTML(`
            <div id ="myboard" class="v-modal hidden" tabindex="0" style="z-index: 2004;"></div>
            `);
            body.append(board);

            const closeBtn = $('.myclose');
            $(closeBtn).click(closepanel);

            const calBtn = $('#mycal');
            $(calBtn).click(hehe);
            
          }
        create();
    });
})();
