// ==UserScript==
// @name         B站/哔哩哔哩/bilibili多视频总时长统计
// @namespace    https://github.com/Ningest/Bilibili-Video-Length-Counter
// @version      1.0.6
// @description  观看的哔哩哔哩视频存在多个选集时，可以方便统计多个视频的总时长。按下【Ctrl + Alt + N】开启/关闭统计面板，查看说明，访问https://github.com/Ningest/Bilibili-Video-Length-Counter
// @author       ningest
// @match        https://www.bilibili.com/video/*
// @icon         https://www.tapafun.com/wp-content/uploads/2024/11/bilibili.png
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/522633/B%E7%AB%99%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9bilibili%E5%A4%9A%E8%A7%86%E9%A2%91%E6%80%BB%E6%97%B6%E9%95%BF%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/522633/B%E7%AB%99%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9bilibili%E5%A4%9A%E8%A7%86%E9%A2%91%E6%80%BB%E6%97%B6%E9%95%BF%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var itemList = [];//存入对象->index索引,title课程标题,duration课程时长,scroller是否为当前播放状态
    var inject = false;//注入html片段状态
    var displayPopupState = false;//弹出层显示状态;
    const htmlString = `
	<div id="ningest_jessie1314" style="display: none; z-index: 2147483647; width: 100%;height: 100%;position: fixed;top: 0px;left: 0px; background-color: rgba(0, 0, 0, 0.2)">
	    <div style="background-color: #fff; width: 600px; height: 100%; margin: 0 auto;padding: 5px; box-sizing: border-box;">
	    	<div style="text-align: right; width: 100%;">
				<button class="popup-close-btn">×</button>
			</div>
	        <div style="margin-bottom: 20px;width: 100%; text-align: center;">
	            <span id="mode_str" style="margin-right: 10px;color: #666;">未计算</span>
	            <span style="margin-right: 10px;color: #666;">总时长</span>
	            <span style="color: #666;">=</span>
	            <span id="hms_str" style="margin-right: 10px;margin-left: 10px;color: #007BFF;">格式1</span>
	            <span style="color: #666;">=</span>
	            <span id="ms_str" style="margin-right: 10px;margin-left: 10px;color: #28A745;">格式2</span>
	            <span style="color: #666;">=</span>
	            <span id="s_str" style="margin-left: 10px;color: #FFA500;">格式3</span>
	        </div>
	        <div style="display: flex; width: 100%;">
	            <button id="c_all_btn" style="flex-grow: 1; flex-basis: 0;" onclick="count_all()">计算全部</button>
	            <button id="c_before_btn" style="flex-grow: 1; flex-basis: 0;" onclick="count_before()">计算之前</button>
	            <button id="c_later_btn" style="flex-grow: 1; flex-basis: 0;" onclick="count_later()">计算之后</button>
	            <button id="c_select_btn" style="flex-grow: 1; flex-basis: 0;" onclick="count_select()">计算选中</button>
                <button id="c_after_btn" style="flex-grow: 1; flex-basis: 0;" onclick="count_after()">从当前开始计算</button>
	        </div>
	        <div style="display: flex; width: 100%; margin-top: 10px;">
	            <button style="flex: 1; padding: 0 5px;" onclick="select_all()">选中全部</button>
	            <button style="flex: 1; padding: 0 5px;" onclick="empty_select()">清除选中</button>
	            <button style="flex: 1; padding: 0 5px;" onclick="set_scope()">选中设置范围</button>
	            <div style="flex: 1; display: flex; justify-content: center; align-items: center; padding: 0 5px;">
	                <input id="min_num" type="number" style="width: 50%;text-align: center;" value="0"/>
	                -
	                <input id="max_num" type="number" style="width: 50%;text-align: center;" value="0"/>
	            </div>
	        </div>
	 	<div style="width: 100%;height: calc(100% - 130px); margin-top: 20px;overflow-y: auto;">
	            <table style="width: 100%; text-align: center; border-collapse: collapse; border: 1px solid #000;">
	                <thead>
	                    <tr>
	                        <th style="border: 1px solid #000; width: 40px;">选中</th>
	                        <th style="border: 1px solid #000; width: 40px;">序号</th>
	                        <th style="border: 1px solid #000;">标题</th>
	                        <th style="border: 1px solid #000; width: 100px;">时长</th>
	                    </tr>
	                </thead>
	                <tbody id="table_list">
	                </tbody>
	            </table>
	        </div>
	    </div>
	</div>`;
    var checkInterval;
    const cssTextString = `





    .header-info {
        width: 350px !important;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        white-space: nowrap;
        overflow: hidden;
    }

    .video-info-duration {
        flex-shrink: 1;      /* 文本自动压缩 */
        overflow: hidden;
        text-overflow: ellipsis;
        margin-left: 5px !important; /* 缩小左右间距，避免撑爆 */
    }

    .video-info-right {
        flex-shrink: 0;      /* 右侧按钮不压缩 */
    }





		.popup-close-btn {
		    width: 20px;
		    height: 20px;
		    border-radius: 6px;
		    font-size: 14px;
		    text-align: center;
		    border-style: none;
		    background-color: #f1f2f3;
		    transition: background-color 0.3s ease;
		}
		.popup-close-btn:hover {
		    background-color: #ffa6a6;
		}
		.header-info {
			display: flex;
			margin-top: 10px;
			margin-bottom: 0px;
			align-items: center;
			justify-content: space-between;
		}
		.video-info-duration {
			display: flex;
			font-size: 15px;
			color: #9499a0;
			margin-left: 40px;
		}
		.popup-open-btn {
			width: 72px;
			height: 24px;
			font-size: 13px;
			color: #61666D;
			border-style: none;
			border-color: #00aeec;
			border-width: 1px;
			background-color: #e3e5e7;
			border-radius: 12px;
			transition: background-color 0.3s ease, color 0.3s ease;
		}
		.popup-open-btn:hover {
			background-color: #e8e9ea;
			color: #00aeec;
		}
		`;
    // justify-content: flex-start / flex-end / center / space-between / space-around / space-evenly;
    // 显示文字“总时长”左侧的空白暂定为40，可在.video-info-duration {margin-left: 40px;}中修改
    window.onload = function () {
        init();
        checkInterval = setInterval(DispInit, 100);
    }

//初始化
    function init() {
        document.addEventListener('keydown', function (event) {
            // 感谢@JerryYang-30同学在此处发现的错误并帮助改正
            // 检查 Ctrl, Alt 和 N 键是否都被按下
            if (event.ctrlKey && event.altKey && (event.key === 'n' || event.code === 'KeyN')) {
                console.log('111111');
                event.preventDefault();
                // displayPopupState的状态记录已转到displayPopup()、TableOpen()和TableClose()中实现
                displayPopup();
            }
            ;

            if (event.key === '[' || event.key === ']') {//添加按下"[""]"自动刷新剩余时间和百分比
                let flagR = true;
                if (event.key === '[') {
                    flagR = false
                }
                // 直接调用全局刷新
                if (typeof refreshRemaining === 'function' && flagR) {
                    refreshRemaining('flash');
                    console.log('剩余时长已刷新');
                }

                if (typeof refreshRemaining === 'function' && !flagR) {
                    refreshRemainingL('flash');
                    console.log('剩余时长已刷新');
                }

            }


        });
        console.log(
            '%cBilibili-Video-Length-Counter：按下【Ctrl + Alt + N】开启/关闭统计面板',
            'font-size: 16px; color: #80a492;' // 设置字体大小和颜色
        );
        console.log(
            '%cBilibili-Video-Length-Counter：查看说明，访问https://github.com/Ningest/Bilibili-Video-Length-Counter',
            'font-size: 16px; color: #80a492;' // 设置字体大小和颜色
        );
    }

// 创建显示区域元素
    function DispInit() {
        if (document.querySelector('.bili-avatar').querySelector('.bili-avatar-img.bili-avatar-face.bili-avatar-img-radius')) {
            // 添加css样式
            addCssClass(cssTextString);
            // 找到视频栏的信息栏
            const header = document.querySelector('div.video-pod__header');
            if (header) {
                // 创建显示区域div并添加到信息栏
                const headerBottom = header.querySelector('div.header-bottom');
                var dispDiv = document.createElement('div');
                dispDiv.className = 'header-info';
                if (headerBottom) header.insertBefore(dispDiv, headerBottom);
                else header.appendChild(dispDiv);


                // 总时长
                // 创建总时长div并添加到显示区域
                var durationDiv = document.createElement('div');
                durationDiv.className = 'video-info-duration';
                dispDiv.appendChild(durationDiv);
                // 读取全部时长信息
                const items = document.querySelectorAll('.video-pod__item');
                let durations = [];
                items.forEach((item, index) => {
                    durations.push(item.querySelector('.stat-item.duration').textContent.trim())
                });
                // 显示总时长，这里对时长计算函数进行了改动
                durationDiv.innerHTML = '总:' + calculateTotalDuration(durations);


                // 剩余
                // 剩余时长与进度条
                var durationDiv2 = document.createElement('div');
                durationDiv2.className = 'video-info-duration';
                durationDiv2.id = 'flash';
                dispDiv.appendChild(durationDiv2);

                //提取所有时长
                const allItems = document.querySelectorAll('.video-pod__item');
                let allDurations = [];
                allItems.forEach(it => {
                    allDurations.push(it.querySelector('.stat-item.duration').textContent.trim());
                });

                //找到当前播放集数
                let currentIndex = -1;
                allItems.forEach((it, idx) => {
                    if (it.getAttribute('data-scrolled') === 'true') {
                        currentIndex = idx;
                    }
                });

                //剩余时长（包含当前播放集）
                let remainingDurations = [];
                if (currentIndex >= 0) {
                    for (let i = currentIndex; i < allDurations.length; i++) {
                        remainingDurations.push(allDurations[i]);
                    }
                }

                //计算全部总时长
                let totalSeconds = calcSeconds(allDurations);
                //计算剩余总时长
                let remainingSeconds = calcSeconds(remainingDurations);

                // 已观看时长
                let watchedSeconds = totalSeconds - remainingSeconds;

                //进度百分比
                let percent = (watchedSeconds / totalSeconds * 100).toFixed(1);

                //转换格式
                let remainingHMS = secToHMS(remainingSeconds);

                //显示
                durationDiv2.innerHTML =
                    `余:${remainingHMS}` + '|' + percent + '%';


                // 按钮
                // 创建按钮的div
                var openDiv = document.createElement('div');
                openDiv.className = 'video-info-right';
                dispDiv.appendChild(openDiv);
                // 创建按钮
                var openBtn = document.createElement('button');
                openBtn.textContent = '详细统计';
                openBtn.className = 'popup-open-btn';
                openBtn.title = '快捷键：Ctrl+Alt+N';
                openDiv.appendChild(openBtn);
                // 添加点击事件监听器
                openBtn.addEventListener('click', function () {
                    TableOpen();
                });
                // 取消计时器
                clearInterval(checkInterval);
            }
        }
    }

//用于添加css样式的函数
    function addCssClass(cssRules) {
        // 创建一个 <style> 元素
        let style = document.createElement('style');
        style.type = 'text/css';
        // 修改其内部的css
        if (style.styleSheet) style.styleSheet.cssText = cssRules;
        else {
            style.appendChild(document.createDocumentFragment());
            style.innerHTML = cssRules;
        }
        // 将style元素添加到head中
        document.head.appendChild(style);
    }

//是否显示弹出层
    function displayPopup() {
        // 为实现通过按钮控制，已将统计面板的打开和关闭改为独立函数
        if (displayPopupState) TableClose();
        else TableOpen();
    }

// 打开统计面板（显示弹出层）
    function TableOpen() {
        if (!inject) {
            // 插入统计面板html
            document.body.insertAdjacentHTML('beforeend', htmlString);
            // 添加关闭按钮的时间监听器
            var closeButton = document.querySelector('button.popup-close-btn');
            closeButton.addEventListener('click', function () {
                TableClose();
            });
            // 记录是否已创建
            inject = true;
        }
        const ningest_jessie1314 = document.getElementById("ningest_jessie1314");
        ningest_jessie1314.style.display = 'block'
        parseVideoPodItems();
        displayPopupState = true;
    }

    // 关闭统计面板（隐藏弹出层）
    function TableClose() {
        ningest_jessie1314.style.display = 'none'
        homing();
        displayPopupState = false;
    }

// 创建并插入新行到tbody中
    function addTableRow(checkboxValueAndSecondTdText, thirdTdText, fourthTdText, scrolled) {
        // 创建新的表格行
        var newRow = document.createElement('tr');
        newRow.className = 'table_item_tr';
        // 创建包含复选框的第一个单元格
        var checkboxCell = document.createElement('td');
        checkboxCell.style.border = '1px solid #000';
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'table_item_cbox';
        checkbox.value = checkboxValueAndSecondTdText; // 设置复选框的值
        checkboxCell.appendChild(checkbox);
        // 创建第二个单元格，使用第一个参数作为文本内容
        var secondCell = document.createElement('td');
        secondCell.style.border = '1px solid #000';
        secondCell.textContent = checkboxValueAndSecondTdText;
        // 创建第三个和第四个单元格，分别使用第二、三个参数作为文本内容
        var thirdCell = document.createElement('td');
        thirdCell.style.border = '1px solid #000';
        thirdCell.textContent = thirdTdText;
        var fourthCell = document.createElement('td');
        fourthCell.style.border = '1px solid #000';
        fourthCell.textContent = fourthTdText;
        // 将所有单元格添加到新行中
        newRow.appendChild(checkboxCell);
        newRow.appendChild(secondCell);
        newRow.appendChild(thirdCell);
        newRow.appendChild(fourthCell);
        // 获取目标tbody元素并将新行添加进去
        var tableBody = document.getElementById('table_list');
        tableBody.appendChild(newRow);
    }


//计算当前播放之前
    function count_before() {
        homing();
        if (itemList.length <= 0) {
            alert("该页面没解析到课程列表!")
            return;
        }
        let durations = [];
        for (let i = 0; i < itemList.length; i++) {
            let item = itemList[i];
            if (item.scroller) {
                break;
            }
            durations.push(item.duration);
        }
        calculateTotalDuration(durations, "计算之前模式");
    }

//计算当前播放之后
    function count_later() {
        homing();
        if (itemList.length <= 0) {
            alert("该页面没解析到课程列表!")
            return;
        }
        let durations = [];
        let state = false;
        for (let i = 0; i < itemList.length; i++) {
            let item = itemList[i];
            if (state) {
                durations.push(item.duration);
            }
            if (item.scroller) {
                state = true;
            }
        }
        calculateTotalDuration(durations, "计算之后模式");
    }

//计算全部
    function count_all() {
        homing();
        if (itemList.length <= 0) {
            alert("该页面没解析到课程列表!")
            return;
        }
        let durations = [];
        itemList.forEach(function (item) {
            durations.push(item.duration);
        })
        calculateTotalDuration(durations, "计算全部模式");
    }

//计算选中item
    function count_select() {
        homing();
        let durations = [];
        let indexs = getSelect();
        if (indexs.length <= 0) {
            alert("未选择任何数据!")
            return;
        }
        for (let a = 0; a < itemList.length; a++) {
            for (let i = 0; i < indexs.length; i++) {
                if (itemList[a].index == indexs[i]) {
                    durations.push(itemList[a].duration);
                    indexs.splice(i, 1);
                    break
                }
            }
            if (indexs.length == 0) {
                break;
            }
        }
        calculateTotalDuration(durations, "计算选中模式");
    }

//获取选中索引数组【索引号】
    function getSelect() {
        // 创建一个空数组来保存选中的复选框的值
        let selectedValues = [];
        // 获取所有具有特定类名和类型的输入元素
        let checkboxes = document.querySelectorAll('input.table_item_cbox[type="checkbox"]');
        // 遍历这些复选框
        checkboxes.forEach(function (checkbox) {
            if (checkbox.checked) { // 检查是否被选中
                selectedValues.push(checkbox.value); // 将选中的值添加到数组中
            }
        });
        return selectedValues;
    }

//根据数组【索引号】设置选中item
    function setSelect(array) {
        // 获取所有具有特定类名和类型的输入元素
        let checkboxes = document.querySelectorAll('input.table_item_cbox[type="checkbox"]');
        // 遍历这些复选框
        for (let a = 0; a < checkboxes.length; a++) {
            let item = checkboxes[a];
            for (let i = 0; i < array.length; i++) {
                if (item.value == array[i]) {
                    item.checked = true;
                    array.splice(i, 1);
                    break;
                }
            }
            if (array.length == 0) {
                break;
            }
        }
    }

//解析课程列表信息并存入itemList数组中
    function parseVideoPodItems() {
        var tableBody = document.getElementById('table_list');
        tableBody.innerHTML = "";
        itemList = [];

        const items = document.querySelectorAll('.video-pod__item');
        items.forEach((item, index) => {
            let title = item.querySelector('.title').getAttribute('title');
            let duration = item.querySelector('.stat-item.duration').textContent.trim();

            // **重新抓取当前播放状态**
            let scroller = item.getAttribute('data-scrolled') === 'true';
            // 有些版本可能没有 data-scrolled，可以用 active 类判断
            if (!scroller) {
                scroller = item.classList.contains('active');
            }

            itemList.push({
                index: index,
                title: title,
                duration: duration,
                scroller: scroller
            });
        });

        itemList.forEach(function (item) {
            addTableRow(item.index, item.title, item.duration, item.scroller);
        });
    }

//计算数组【时长】中时长的总和,并设置mode为显示的模式文本=计算全部模式，计算之前模式，计算之后模式，计算选中模式，
// 添加了格式为HH:MM:SS的返回值，用于在视频信息栏中显示总时长
    function calculateTotalDuration(durations, mode) {
        // 初始化总秒数
        let totalSeconds = 0;
        // 遍历数组中的每个时长并转换为秒数后相加
        durations.forEach(duration => {//大于一小时的时长计算错误异常
            totalSeconds += parseDuration(duration);

        });
        // 计算小时、分钟和秒
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor(totalSeconds / 60); // 总分钟数
        const seconds = totalSeconds % 60; // 剩余秒数
        const remainingSecondsAfterHours = totalSeconds % 3600;
        const minutes2 = Math.floor(remainingSecondsAfterHours / 60);

        // 格式化输出
        function padZero(num) {
            return num.toString().padStart(2, '0');
        }

        if (mode === undefined) {
            // 返回一个常用格式
            return `${padZero(hours)}:${padZero(minutes2)}:${padZero(seconds)}`
        } else {
            // 第一种格式：HH:MM:SS
            const formatHMS = `${padZero(hours)}时${padZero(minutes2)}分${padZero(seconds)}秒`;
            // 第二种格式：总分钟数和秒数
            const totalMinutes = Math.floor(totalSeconds / 60);
            const formatMS = `${totalMinutes}分${padZero(seconds)}秒`;
            // 第三种格式：总秒数
            const formatS = totalSeconds + "秒";
            document.getElementById('mode_str').textContent = mode;
            document.getElementById('hms_str').textContent = formatHMS;
            document.getElementById('ms_str').textContent = formatMS;
            document.getElementById('s_str').textContent = formatS;
        }
    }

//总时长归零
    function homing() {
        document.getElementById('mode_str').textContent = "未计算";
        document.getElementById('hms_str').textContent = "格式1";
        document.getElementById('ms_str').textContent = "格式2";
        document.getElementById('s_str').textContent = "格式3";
    }

//选中全部
    function select_all() {
        let checkboxes = document.querySelectorAll('input.table_item_cbox[type="checkbox"]');
        checkboxes.forEach(function (item) {
            item.checked = true;
        })
    }

//清空选中
    function empty_select() {
        let checkboxes = document.querySelectorAll('input.table_item_cbox[type="checkbox"]');
        checkboxes.forEach(function (item) {
            item.checked = false;
        })
    }

//设置选中范围
    function set_scope() {
        empty_select();
        let min = Number(document.getElementById('min_num').value);
        let max = Number(document.getElementById('max_num').value);
        if (min > max) {
            let a = min;
            min = max;
            max = a;
        }
        if (min < 0 || max >= itemList.length) {
            alert("设置不在合法范围内!")
            return;
        }
        let checkboxes = document.querySelectorAll('input.table_item_cbox[type="checkbox"]');
        for (let i = min; i <= max; i++) {
            checkboxes[i].checked = true;
        }
    }

    //当前集数到最后一集总时长计算


    // 计算当前集数往后所有集数（包含当前集）
    function count_after() {
        homing();
        if (itemList.length <= 0) {
            alert("该页面没解析到课程列表!");
            return;
        }
        let durations = [];
        let found = false;

        for (let i = 0; i < itemList.length; i++) {
            let item = itemList[i];
            // 找到当前播放的集数
            if (item.scroller) {
                found = true;
            }
            // 找到后从当前集数开始全部加入
            if (found) {
                durations.push(item.duration);
            }
        }


        calculateTotalDuration(durations, "从当前开始计算模式");


    }


    // 秒数计算
    function calcSeconds(durs) {
        let sum = 0;
        durs.forEach(d => {
            sum += parseDuration(d);//解决超过一小时

        });
        return sum;
    }

// 秒转 00:00:00
    function secToHMS(sec) {
        let h = Math.floor(sec / 3600);
        let m = Math.floor((sec % 3600) / 60);
        let s = sec % 60;
        return `${pad(h)}:${pad(m)}:${pad(s)}`;
    }

    function pad(n) {
        return n.toString().padStart(2, "0");
    }

// 智能解析时长：支持 MM:SS 和 HH:MM:SS
    function parseDuration(str) {
        let parts = str.split(":").map(Number);

        if (parts.length === 3) {
            // HH:MM:SS
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) {
            // MM:SS
            return parts[0] * 60 + parts[1];
        } else {
            return 0; // 异常情况
        }
    }


    /**
     * 刷新剩余时长和进度百分比，仅更新指定 div
     * @param {string} divId - 目标 div 的 id
     */
    function refreshRemaining(divId) {
        const div = document.getElementById(divId);
        if (!div) return;

        const allItems = document.querySelectorAll('.video-pod__item');
        if (allItems.length === 0) return;

        // 获取所有时长
        let allDurations = [];
        allItems.forEach(it => {
            const durElem = it.querySelector('.stat-item.duration');
            if (durElem) allDurations.push(durElem.textContent.trim());
        });

        // 找到当前播放集索引
        let currentIndex = -1;
        allItems.forEach((it, idx) => {
            if (it.getAttribute('data-scrolled') === 'true') {
                currentIndex = idx + 1;
            }
        });

        if (currentIndex < 0) currentIndex = 0;

        // 剩余时长（包含当前播放集）
        let remainingDurations = allDurations.slice(currentIndex);

        // 计算秒数
        let totalSeconds = calcSeconds(allDurations);
        let remainingSeconds = calcSeconds(remainingDurations);
        let watchedSeconds = totalSeconds - remainingSeconds;
        let percent = ((watchedSeconds / totalSeconds) * 100).toFixed(1);

        // 转换格式
        let remainingHMS = secToHMS(remainingSeconds);

        // 更新 div
        div.textContent = `余:${remainingHMS}|${percent}%`;
    }


//按[ 时

    function refreshRemainingL(divId) {
        const div = document.getElementById(divId);
        if (!div) return;

        const allItems = document.querySelectorAll('.video-pod__item');
        if (allItems.length === 0) return;

        // 获取所有时长
        let allDurations = [];
        allItems.forEach(it => {
            const durElem = it.querySelector('.stat-item.duration');
            if (durElem) allDurations.push(durElem.textContent.trim());
        });

        // 找到当前播放集索引
        let currentIndex = -1;
        allItems.forEach((it, idx) => {
            if (it.getAttribute('data-scrolled') === 'true') {
                currentIndex = idx - 1;
            }
        });

        if (currentIndex < 0) currentIndex = 0;

        // 剩余时长（包含当前播放集）
        let remainingDurations = allDurations.slice(currentIndex);

        // 计算秒数
        let totalSeconds = calcSeconds(allDurations);
        let remainingSeconds = calcSeconds(remainingDurations);
        let watchedSeconds = totalSeconds - remainingSeconds;
        let percent = ((watchedSeconds / totalSeconds) * 100).toFixed(1);

        // 转换格式
        let remainingHMS = secToHMS(remainingSeconds);

        // 更新 div
        div.textContent = `余:${remainingHMS}|${percent}%`;
    }


// 将函数挂载到全局对象
    window.count_all = count_all;
    window.count_before = count_before;
    window.count_later = count_later;
    window.count_select = count_select;
    window.select_all = select_all;
    window.empty_select = empty_select;
    window.set_scope = set_scope;
//当前集数往后所有集数
    window.count_after = count_after;


})();

