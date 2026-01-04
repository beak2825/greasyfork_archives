// ==UserScript==
// @name         数独辅助工具
// @version      2.3
// @license      MIT
// @description  在网页模式下，撤销旁边增加一个推导按钮，点击后，按钮变成‘返回’，此时盘面变成一个假盘，可以随意在盘面上填数，点击‘返回’盘面恢复之前数值，注意：点击推导后填入数字无法提交答案
// @author       St
// @require      https://code.jquery.com/ui/1.13.3/jquery-ui.min.js
// @match        https://www.12634.com/*
// @match        https://*.gridpuzzle.com/*
// @match        http://www.sudokufans.org.cn/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://12634.com&size=64
// @grant        none
// @namespace https://greasyfork.org/users/815790
// @downloadURL https://update.greasyfork.org/scripts/497028/%E6%95%B0%E7%8B%AC%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/497028/%E6%95%B0%E7%8B%AC%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var currentUrl = window.location.href;
    if (currentUrl.includes('12634.com')) {
        sansi();
    } else if (currentUrl.includes('gridpuzzle.com')) {
        gridpuzzle();
    } else if (currentUrl.includes('sudokufans.org.cn')) {
        sudokufans();
    } else {
        console.log('当前网址没有匹配的方法');
        // 可以添加默认执行的代码
    }
    function gridpuzzle(){
    }
    //三思
    function sansi(){
        /**************************
        连续挡板加深
        ****************************/
        const lxdb = $(".cL, .cT");
        lxdb.css({
            "background-color":"red"
        });
        /***********************
        2024-06-05 v1.1 增加按钮可在屏幕上随意拖动，优化代码。
        ********************************/
        const baocun = $("#btn-save, #btn_pk_save");
        const div_a =$(`<div id='draggable' class='ui-widget-content'>
        <button id='tuilian' class='btn btn-info'>推理</button>
        <button id='yjhx' class='btn btn-info'>一键候选</button>
        <button id='yjqc' class='btn btn-info'>清除候选</button>
        </div>`);
        baocun.after(div_a);
        //$(".row").prepend(div_a);
        $("#draggable").draggable();

        div_a.css({
            "background-color":"#ffffff",
            "position": "relative",
            "color":"#fff",
            "height":"10px",
            "width":"50px",
            "border": "1px solid #000",
            "display": "flex",
            "flex-direction": "column",
            "z-index":999
        });
        const tuili_btn = $("#tuilian");
        tuili_btn.css({
            "margin-top":11,
            "color":"#fff",
            "background-color":"#921AFF",
            "font-weight":900
        });

        // 添加点击事件处理器（可选）
        let td=false;
        tuili_btn.click(function() {
            tl();
            if(td){
                tuili_btn.text('返回');
            }else{
                tuili_btn.text('推理');
            }
        });
        let ids = [];
        for (var r = 1; r <= 9; r++) {
            for (var c = 1; c <= 9; c++) {
                ids.push("r"+r+"c"+c);
            }
        }
        function tl(){
            var $tuidao=$("#tuidao");
            if(td==false){
                // 遍历ID数组
                ids.forEach(function(id) {
                    var $element = $('#' + id);
                    // 检查元素是否存在
                    if ($element.length > 0) {
                        // 复制input元素
                        var clonedInput = $element.clone(true);
                        // 修改复制的元素id
                        clonedInput.attr("id","tuidao");
                        // 将复制的input插入到原始input之前
                        $element.before(clonedInput);
                        // 调整复制的input的样式以覆盖原始input（如果需要）
                        clonedInput.css({
                            'z-index': 100 // 设置z-index以确保它位于原始input之上
                        });
                        // 隐藏原始input
                        $element.hide();
                        clonedInput.show();
                        baocun.hide();
                    }
                });
            }
            else{
                ids.forEach(function(id) {
                    $("#tuidao").remove();
                    $('#' + id).show();
                    baocun.show();
                });
            }
            td = !td;
        }

        //一键候选按钮
        const hx_btn = $("#yjhx");
        const hxqc_btn = $("#yjqc");
        hx_btn.css({
            "margin-top":0,
            "color":"#fff",
            "background-color":"#1219f9",
            "font-weight":900,
            "width":"150px"
        });
        hxqc_btn.css({
            "margin-top":0,
            "color":"#fff",
            "background-color":"#42e742",
            "font-weight":900,
            "width":"150px"
        });

        hx_btn.click(function() {
            fillSudokuCandidates();
        });
        hxqc_btn.click(function() {
            clearAllCandidates();
        });
        var $cells = '';
        var $maindiv ='';
        var lx = '';
        function selectdiv(){
            if ($('#puzzle-main').length === 1) {
                $maindiv = $('#puzzle-main');
                lx = 'tm';
            }
            else if($('#game').length === 1) {
                $maindiv = $('#game');
                lx = 'pk';
            }
            $cells = $maindiv.find('input[id^="r"][id*="c"]');

        }
        function fillSudokuCandidates() {
            // 严谨地获取所有格子
            selectdiv();
            // 只选择input元素，且ID格式为rXcY
            if ($cells.length !== 81) {
                console.warn('找到的格子数量不是81个，当前找到:', $cells.length);
            }

            // 遍历所有格子
            $cells.each(function() {
                const $cell = $(this);
                const id = $cell.attr('id');

                // 验证ID格式
                const match = id.match(/^r(\d)c(\d)$/);
                if (!match) {
                    console.warn('格子ID格式不正确:', id);
                    return true; // 继续下一个迭代
                }

                const row = parseInt(match[1]);
                const col = parseInt(match[2]);

                // 跳过只读格子和非空格子
                if ($cell.prop('readonly') || $cell.val().trim() !== '') {
                    return true; // 继续下一个迭代
                }

                // 获取当前格子所在的行、列、宫已有数字
                const rowNumbers = getNumbersInRow(row);
                const colNumbers = getNumbersInColumn(col);
                const boxNumbers = getNumbersInBox(row, col);

                // 合并所有已存在的数字
                const allExistingNumbers = [...new Set([...rowNumbers, ...colNumbers, ...boxNumbers])];

                // 计算候选数字（1-9中排除已存在的数字）
                const candidates = [];
                for (let num = 1; num <= 9; num++) {
                    if (!allExistingNumbers.includes(num)) {
                        candidates.push(num);
                    }
                }
                // 将候选数字填入格子
                $cell.val(candidates.join(''));
                
            });
            cleanupCandidates();
            updatacss();
        }

        function updatacss(){
            var aa=0;
            $cells.each(function() {
                const $cellcss = $(this);
                if ($cellcss.prop('readonly')) {
                    return true; // 继续下一个迭代
                }
                const candidateCount = $cellcss.val().length;
                $cellcss.removeClass();
                if(candidateCount === 1){

                    if(lx === 'tm'){
                        $cellcss.addClass('s1');
                    }else{
                        $cellcss.addClass('K0');
                    }
                }
                else if (candidateCount > 1 && candidateCount <= 3) {
                    if(lx === 'tm'){
                        $cellcss.addClass('s2');
                    }else{
                        $cellcss.addClass('K1');
                    }
                } else if (candidateCount > 3) {
                    if(lx === 'tm'){
                        $cellcss.addClass('s3');
                    }else{
                        $cellcss.addClass('K2');
                    }
                }
            });
            
        }

        // 获取某行中已有的数字
        function getNumbersInRow(row) {
            const numbers = [];
            for (let c = 1; c <= 9; c++) {
                const $cell = $maindiv.find(`#r${row}c${c}`);
                if ($cell.length === 0) continue;

                const val = $cell.val().trim();
                // 只收集已填入的数字（单个数字）
                if (val.length === 1 && !isNaN(val)) {
                    numbers.push(parseInt(val));
                }
            }
            return numbers;
        }

        // 获取某列中已有的数字
        function getNumbersInColumn(col) {
            const numbers = [];
            for (let r = 1; r <= 9; r++) {
                const $cell = $maindiv.find(`#r${r}c${col}`);
                if ($cell.length === 0) continue;

                const val = $cell.val().trim();
                // 只收集已填入的数字（单个数字）
                if (val.length === 1 && !isNaN(val)) {
                    numbers.push(parseInt(val));
                }
            }
            return numbers;
        }

        // 获取某宫（3x3区域）中已有的数字
        function getNumbersInBox(row, col) {
            const numbers = [];
            // 计算当前格子所在的宫的起始行和列
            const boxRowStart = Math.floor((row - 1) / 3) * 3 + 1;
            const boxColStart = Math.floor((col - 1) / 3) * 3 + 1;

            // 遍历宫内的所有格子
            for (let r = boxRowStart; r < boxRowStart + 3; r++) {
                for (let c = boxColStart; c < boxColStart + 3; c++) {
                    const $cell = $maindiv.find(`#r${r}c${c}`);
                    if ($cell.length === 0) continue;

                    const val = $cell.val().trim();
                    // 只收集已填入的数字（单个数字）
                    if (val.length === 1 && !isNaN(val)) {
                        numbers.push(parseInt(val));
                    }
                }
            }
            return numbers;
        }

        //清理候选
        function cleanupCandidates() {
            // 获取所有格子

            // 先收集所有已确定的单个数字
            const allSolvedNumbers = [];
            $cells.each(function() {
                const $cell = $(this);
                const val = $cell.val().trim();
                // 收集已确定的单个数字（非候选数）
                if (val.length === 1 && !isNaN(val) && val !== '') {
                    allSolvedNumbers.push({
                        number: parseInt(val),
                        id: $cell.attr('id')
                    });
                }
            });

            // 遍历所有有候选数字的格子
            $cells.each(function() {
                const $cell = $(this);
                const cellValue = $cell.val().trim();

                // 跳过只读格子和单个数字的格子
                if ($cell.prop('readonly') || cellValue.length <= 1) {
                    return true;
                }

                // 获取当前格子的ID和位置信息
                const id = $cell.attr('id');
                const match = id.match(/^r(\d)c(\d)$/);
                if (!match) return true;

                const row = parseInt(match[1]);
                const col = parseInt(match[2]);

                // 找出当前格子行、列、宫中所有已确定的数字
                const numbersToRemove = [];

                allSolvedNumbers.forEach(solved => {
                    const solvedMatch = solved.id.match(/^r(\d)c(\d)$/);
                    if (!solvedMatch) return;

                    const solvedRow = parseInt(solvedMatch[1]);
                    const solvedCol = parseInt(solvedMatch[2]);

                    // 检查是否在同一行、同一列或同一宫
                    const sameRow = (solvedRow === row);
                    const sameCol = (solvedCol === col);
                    const sameBox = (
                        Math.floor((solvedRow - 1) / 3) === Math.floor((row - 1) / 3) &&
                        Math.floor((solvedCol - 1) / 3) === Math.floor((col - 1) / 3)
                    );

                    if (sameRow || sameCol || sameBox) {
                        numbersToRemove.push(solved.number);
                    }
                });

                // 去重
                const uniqueNumbersToRemove = [...new Set(numbersToRemove)];

                // 如果没有需要移除的数字，直接返回
                if (uniqueNumbersToRemove.length === 0) return true;

                // 将当前候选数字转换为数组
                let candidates = cellValue.split('').map(Number);

                // 移除已确定的数字
                const newCandidates = candidates.filter(num => !uniqueNumbersToRemove.includes(num));

                // 如果候选数字有变化，更新格子
                if (newCandidates.length !== candidates.length) {
                    $cell.val(newCandidates.join(''));

                    cleanupCandidates();
                }

            });
        }

        //一键清除候选
        function clearAllCandidates() {
            // 获取所有格子
            $cells = $maindiv.find('input[id^="r"][id*="c"]');

            // 遍历所有格子
            $cells.each(function() {
                const $cell = $(this);
                const cellValue = $cell.val().trim();

                // 跳过只读格子和单个数字的格子
                if ($cell.prop('readonly') || cellValue.length <= 1) {
                    return true;
                }

                // 清空内容
                $cell.val('');

                // 移除class
                $cell.removeClass('s2 s3');
            });

            console.log('已清空所有候选数字');
        }


    }
    // 读数之道
    function sudokufans(){
        const panmian = $(".jcTable");
        $('#tc').after(
            $('<div>', {
                id: 'tuilibtn',
                text: '推理',
                css: {
                    // 添加按钮样式
                    height:'4vh',
                    width:'8vh',
                    display: 'inline-block',
                    backgroundColor: '#007bff',
                    color: 'white',
                    textAlign: 'center',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    border: 'none',
                    transition: 'all 0.3s ease'
                },
                click: function() {
                    tuili();
                }
            })
        );
        function tuili(){
            if (panmian.is(':hidden')) {
                // 如果是隐藏状态，则显示出来
                panmian.toggle();
                $("#tuidao").remove();
                $("#tuilibtn").text("推理");
            } else {
                // 如果是显示状态，则隐藏起来
                var tuidao = panmian.clone();
                tuidao.attr('id', 'tuidao');
                panmian.after(tuidao);
                panmian.toggle();
                $("#tuilibtn").text("返回");
                tuidao.find("input").filter(function() {
                    var value = $.trim($(this).val());
                    return value === "" || value.length > 1;
                }).css("color", "blue");
            }
        }
    }

    // Your code here...
})();