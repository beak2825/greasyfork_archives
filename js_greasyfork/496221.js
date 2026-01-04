// ==UserScript==
// @name         拼多多跨境(Temu)弹窗屏蔽
// @version      1.1
// @description  用于屏蔽拼多多跨境卖家平台的弹窗-jquery重构
// @author       linying
// @match        *://kuajing.pinduoduo.com/*
// @match        *://seller.kuajingmaihuo.com/*
// @match        *://kuajingboss.com/*
// @match        *://agentseller.temu.com/*
// @exclude      */login*
// @exclude      */settle/site-main*
// @exclude      */questionnaire?surveyId=*
// @exclude      */settle/seller-login?redirectUrl=*
// @exclude      */agentseller*.temu.com/main/authentication?redirectUrl=*
// @exclude      */agentseller*.temu.com/mmsos/online-shipping-result.html*
// @icon         https://gitlab.com/linying23333/green-service-center-temu-or-pinduoduokuajing-2024/raw/main/icon.svg
// @supportURL   https://gitlab.com/linying23333/green-service-center-temu-or-pinduoduokuajing-2024
// @homepage     https://github.com/linying2333
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.deleteValue
// @grant        GM_registerMenuCommand
// @namespace https://greasyfork.org/users/1307848
// @downloadURL https://update.greasyfork.org/scripts/496221/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E8%B7%A8%E5%A2%83%28Temu%29%E5%BC%B9%E7%AA%97%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/496221/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E8%B7%A8%E5%A2%83%28Temu%29%E5%BC%B9%E7%AA%97%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @icon         来自 https://www.iconfont.cn/ 如果侵犯您的权利请与我沟通
// @note         更新日志&常见问题解决：https://gitlab.com/linying23333/green-service-center-temu-or-pinduoduokuajing-2024/raw/main/Readme.md
// @note         本js用户脚本版权归linying所有,仅供研究学习,禁止以任何形式倒卖

//于北京时间 2024/06/10 03:33:11 使用通义千问2.5+ChatGPT3.5以jQuery 2.2.4重构

'use strict';

this.$ = this.jQuery = jQuery.noConflict(true);
// 防止网页与使用的jquery.2.2.4.min.js发生冲突

/*
防止代码因其他原因被执行多次
这段代码出自 Via轻插件，作者谷花泰
*/
var key = encodeURIComponent('拼多多跨境(Temu)弹窗屏蔽');
if (window[key]) return;
window[key] = true;

var MessagePrefix = '来自 拼多多跨境(Temu)弹窗屏蔽 js用户脚本提示：\n';

// 检查配置文件版本
(function() {
    var configVersion = window.localStorage.getItem('setting_Config_Version');
    var MessagePrefix = '来自 拼多多跨境(Temu)弹窗屏蔽 js用户脚本提示：\n配置文件数据版本';
    if (configVersion === null || configVersion === '') {
        console.log(MessagePrefix + '未找到');
    } else if (configVersion < '2') {
        console.log(MessagePrefix + '过低！可能导致运行错误！建议在设置菜单中重置参数');
    } else if (configVersion > '2') {
        console.log(MessagePrefix + '过高！可能导致运行错误！建议在设置菜单中重置参数');
    } else if (configVersion === '2') {
        console.log(MessagePrefix + '为' + configVersion);
    } else {
        console.log(MessagePrefix + '不是合规的数字');
    }
})();

// 初始化默认数据库
var value = [
    // 参数需要根据您的电脑加载速度而定,切勿无脑调低或者调高

    // 基础设置

    // 设置配置文件版本(为未来预留)
    {name: 'setting_Config_Version', value: '2'},
    // 启动后进行删除的等待时间:
    // 值设置为 0 不启用，默认推荐值为4600
    // 单位毫秒,1秒 = 1000毫秒
    {name: 'setting_Start_Wait_Time', value: '4600'},
    // 是否展示调价菜单
    // 默认true(开启),使用false(关闭)
    {name: 'setting_Show_Price_Menu', value: 'true'},

    // 快速模式设置

    // 快速删除模式的删除间隔时间:
    // 默认推荐值为100
    // 单位毫秒,1秒 = 1000毫秒
    {name: 'setting_Fast_Remove_Interval_Time', value: '1'},
    // 快速删除持续删除时间
    // 默认推荐值为8000
    // 单位毫秒,1秒 = 1000毫秒
    {name: 'setting_Fast_Remove_Duration', value: '1'}, // 'setting_Fast_Remove_Interval_Time'与'setting_Fast_Remove_Duration'同时设置为 1 不启用
    // 是否弹出快速删除结束提示框
    // 默认false(关闭),使用true(开启)
    {name: 'setting_Show_Fast_Remove_Stopped_Alert', value: 'false'},

    // 手动清除按钮设置

    // 设置是否添加手动清除按钮
    // 默认true(开启),使用false(关闭)
    {name: 'setting_Add_Manual_Clear_Button', value: 'true'},
    // 设置按钮加载位置默认值
    // 位置从浏览器屏幕左上角开始计算，X轴+1则向右移动，Y轴+1则向下移动
    // 参数需要带单位(受支持的单位 百分比"%",像素点"px")
    // 按钮的X轴(纵向)值
    {name: 'setting_Add_Manual_Clear_Button_X', value: '30%'},
    // 按钮的Y轴(纵向)值
    {name: 'setting_Add_Manual_Clear_Button_Y', value: '92%'},
    // 在多长时间内快速点击3次移动按钮打开设置
    // 默认推荐值为400
    // 单位毫秒,1秒 = 1000毫秒
    {name: 'setting_Quickly_Click_3Times_To_Open_Settings_Check_Time', value: '500'},

    // 是否在加载时自动启用元素反转
    // 默认false(关闭),使用true(开启)
    {name: 'setting_Inversion_Color', value: 'false'},

    // 是否在加载时自动启用元素反转
    // 默认false(关闭),使用true(开启)
    {name: 'setting_Inversion_Color', value: 'false'},

    // 调试模式日志输出

    // 默认false(关闭),使用true(开启)
    {name: 'setting_Print_DebugMode_Log', value: 'false'}
];

$.each(value, function(index, Event) {
    var setValue = Event.value; // 先获取原始值
    // 特别处理布尔类型的值
    if (Event.value === 'true' || Event.value === 'false') {
        setValue = Event.value === 'true';
    }

    // 如果没有对应的配置项，则为油猴存储添加配置项，确保值为期望的类型
    if (!GM_getValue(Event.name)) {GM_setValue(Event.name, setValue)};
});

// 初始化变量
var Button_X = GM_getValue('setting_Add_Manual_Clear_Button_X'), Button_Y = GM_getValue('setting_Add_Manual_Clear_Button_Y');

// 创建 GreaseMonkey 菜单
(function CreateMenu() {
    GM_registerMenuCommand('⚙️ 设置', LoadSettingsPanel);
    GM_registerMenuCommand('🎨⇆ 颜色反转', toggleColorInversion);
    var Status = GM_getValue('setting_Print_DebugMode_Log');
    GM_registerMenuCommand('🛠️ 打印控制台调试日志状态切换 | 首次加载状态:' + Status, () => {
        // 先进行状态切换
        Status = !Status
        // 将字符串'true','false'转换为布尔值'true','false'
        let boolValue = (Status === 'true') ? true : (Status === 'false') ? false : Status;
        GM_setValue('setting_Print_DebugMode_Log', boolValue);
        // 提示刷新网页使其生效
        alert('打印调试日志状态已经更新为' + boolValue + '\n请手动刷新网页使其油猴菜单文字刷新');
    });
})();

// 全局定义是否打印日志调用函数
function log(message) {
    if (GM_getValue('setting_Print_DebugMode_Log')) {
        console.log(MessagePrefix + message);
    }
}

// 启动时检查并提示调试模式状态
(function checkDebugModeStatus() {
    var debugMode = GM_getValue('setting_Print_DebugMode_Log');
    console.log(`当前 Debug 模式已设置为: ${debugMode}, 调试日志${debugMode ? '已' : '未'}启用.`);
})();

// 按钮处理部分
// 检查是否启用该部分
if (GM_getValue('setting_Add_Manual_Clear_Button')) {
    (function() {
        // 创建新的div并设置属性
        var $div = $('<div>', {
            id: 'js_button_div',
            css: {
                cssText: 'z-index: 2147483648 !important;', // 在css对象中添加cssText
                position: 'fixed',
                top: GM_getValue('setting_Add_Manual_Clear_Button_Y'),
                left: GM_getValue('setting_Add_Manual_Clear_Button_X'),
                '-webkit-user-select': 'none', /* 对于Webkit和Mozilla浏览器，IE浏览器应使用'unselectable' */
                '-moz-user-select': 'none', /* 对于早期的Firefox */
                '-ms-user-select': 'none', /* 对于早期的Chrome和Safari */
                'user-select': 'none' /* IE 10+ */
            }
        });

        // 添加div到body之后
        $('body').after($div);

        // 创建移动按钮
        var $eventMoveButton = $('<button>', {
            id: 'js_MoveButton',
            text: '🔧',
            css: {'cursor': 'move'}
        }).appendTo($div);

        // 创建清除按钮
        var $cleanButton = $('<button>', {
            id: 'js_CleanButton',
            text: '清除弹窗!',
            css: {'cursor': 'pointer'},
            click: function() {
                log('手动清除按钮被点击');
                removeElements();
                alert('已经执行清除');
            }
        }).appendTo($div);

        var $InversionColorButton = $('<button>', {
            id: 'js_InversionColorButton',
            text: '🎨⇆',
            click: function() {
                log('颜色反转按钮被点击');
                toggleColorInversion();
            }
        });
        // 设置按钮样式
        $InversionColorButton.css({
            'cursor': 'pointer' // 鼠标悬停时显示手型
        });
        // 将按钮添加到id为'js_button_div'的div中
        $('#js_button_div').append($InversionColorButton);

        // 初始化按钮功能
        var isDraggable = false;

        // 拖动逻辑
        $('#js_MoveButton').on('mousedown', function(mouseDownEvent) {
            if (!isDraggable) return;

            function onMouseMove(mouseMoveEvent) {
                var newX = mouseMoveEvent.clientX;
                var newY = mouseMoveEvent.clientY;
                $div.css({left: newX, top: newY});
            }

            $(document).on('mousemove', onMouseMove).one('mouseup', function() {
                $(document).off('mousemove', onMouseMove);
                log("最终位置：(X: " + $div.css('left') + ", Y: " + $div.css('top') + ")");
                // 更新存储值
                Button_X = $div.css('left');
                Button_Y = $div.css('top');
                // 检查并更新可能存在的输入框
                if ($('#js_Button_X').length) $('#js_Button_X').val($div.css('left'));
                if ($('#js_Button_Y').length) $('#js_Button_Y').val($div.css('top'));
            });
        });


        // 定义变量
        var clickCount = 0;
        var clickTimer;

        // 清除点击计数的函数
        function clearClickCount() {
            clickCount = 0;
            clearTimeout(clickTimer);
        }

        // 添加连续点击三次的逻辑
        $('#js_MoveButton').on('click', function(event) {
            // 切换拖动状态
            isDraggable = !isDraggable;
            $(this).text(isDraggable ? '📝' : '🔧');

            // 增加点击计数
            clickCount++;

            // 清除之前的定时器，并设置新的定时器
            clearTimeout(clickTimer);
            clickTimer = setTimeout(function() {
                // 如果在指定时间内（例如 X 毫秒）发生了三次点击
                if (clickCount >= 3) {
                    $('#js_MoveButton').text('⚙');
                    log('连续点击了三次！为您打开参数设置');
                    LoadSettingsPanel(); // 假设 LoadSettingsPanel 函数已定义
                    // 重置点击计数
                    clearClickCount();
                } else {
                    // 否则，只重置点击计数
                    clearClickCount();
                }
            }, GM_getValue('setting_Quickly_Click_3Times_To_Open_Settings_Check_Time')); // 使用存储的检查时间
        });
    })();
}

function toggleColorInversion() {
    var $styleElement = $('#InversionColor');

    if ($styleElement.length === 0) {
        // 创建一个新的style元素
        var $style = $('<style>')
            .attr('id', 'InversionColor')
            .html('body { filter: invert(100%) !important; }');
        
        // 将元素添加到head中
        $('head').append($style);
    } else {
        // 如果元素已经存在，则移除它以关闭颜色反转
        $styleElement.remove();
    }
}

// 如果设置了默认颜色反转则调用函数
if (GM_getValue('setting_Inversion_Color')) {toggleColorInversion();}

// 插入参数设置面板
function LoadSettingsPanel() {

    if ($('#js_info').length){
        return; // 发现已打开，退出函数
    }

    // 读取列表获取值
    function getDefaultValue(name) {
        for (const item of value) {
            if (item.name === name) {
                return item.value;
            }
        }
        return "Not found";
    }

    // 直接注入html
    insertModalDivs(`
        <h1 style="margin: 0; padding: 0;">设置参数</h1>
        <div style="margin-top: 5px; margin-bottom: 5px; color: #f00;">
        <p style="margin: 0; padding: 0;">注意前后不要有空格，填写错误会导致运行错误</p>
        <p style="margin: 0; padding: 0;">时间值默认单位 ms (毫秒),1 s(秒) = 1000 ms(毫秒)</p>
        <p style="margin: 0; padding: 0;">功能开关：使用 true (开启),使用 false (关闭)</p>
        </div>
        <div style="margin: 0; padding: 0;">
          <p style="margin: 0; padding: 0;">启动后进行删除的等待时间:</p>
          <input type="text"
                 class="js_setting_input"
                 style="background-color: #808080; margin: 3px 0; padding: 2px;"
                 placeholder="默认值：${getDefaultValue('setting_Start_Wait_Time')}"
                 value="${GM_getValue('setting_Start_Wait_Time')}">
        </div>
        <p></p>
        <div style="margin: 0; padding: 0;">
          <p style="margin: 0; padding: 0;">是否展示调价菜单:</p>
          <input type="text"
                 class="js_setting_input"
                 style="background-color: #808080; margin: 3px 0; padding: 2px;"
                 placeholder="默认值：${getDefaultValue('setting_Show_Price_Menu')}"
                 value="${GM_getValue('setting_Show_Price_Menu')}">
        </div>
        <p></p>
        <div style="margin: 0; padding: 0;">
          <p style="margin: 0; padding: 0;">快速删除模式的删除间隔时间:</p>
          <input type="text"
                 class="js_setting_input"
                 style="background-color: #808080; margin: 3px 0; padding: 2px;"
                 placeholder="默认值：${getDefaultValue('setting_Fast_Remove_Interval_Time')}"
                 value="${GM_getValue('setting_Fast_Remove_Interval_Time')}">
        </div>
        <div style="margin: 0; padding: 0;">
          <p style="margin: 0; padding: 0;">快速删除模式的持续删除时间:</p>
          <input type="text"
                 class="js_setting_input"
                 style="background-color: #808080; margin: 3px 0; padding: 2px;"
                 placeholder="默认值：${getDefaultValue('setting_Fast_Remove_Duration')}"
                 value="${GM_getValue('setting_Fast_Remove_Duration')}">
        </div>
        <div style="margin: 0; padding: 0;">
          <p style="margin: 0; padding: 0;">是否弹出快速输出结束提示框:</p>
          <input type="text"
                 class="js_setting_input"
                 style="background-color: #808080; margin: 3px 0; padding: 2px;"
                 placeholder="默认值：${getDefaultValue('setting_Show_Fast_Remove_Stopped_Alert')}"
                 value="${GM_getValue('setting_Show_Fast_Remove_Stopped_Alert')}">
        </div>
        <p></p>
        <div style="margin: 0; padding: 0;">
          <p style="margin: 0; padding: 0;">是否添加手动清除按钮:</p>
          <input type="text"
                 class="js_setting_input"
                 style="background-color: #808080; margin: 3px 0; padding: 2px;"
                 placeholder="默认值：${getDefaultValue('setting_Add_Manual_Clear_Button')}"
                 value="${GM_getValue('setting_Add_Manual_Clear_Button')}">
        </div>
        <div style="margin: 0; padding: 0;">
          <p style="margin: 0; padding: 0;">设置手动清除按钮加载位置默认值:</p>
          <p style="margin: 0; padding: 0;">(受支持的单位 百分比"%",像素点"px")</p>
          <p style="margin: 0; padding: 0;">按钮的X轴(纵向)值,需要带单位</p>
          <input type="text"
                 class="js_setting_input"
                 id="js_Button_X"
                 style="background-color: #808080; margin: 3px 0; padding: 2px;"
                 placeholder="默认值：${getDefaultValue('setting_Add_Manual_Clear_Button_X')}"
                 value="${Button_X}">
          <p style="margin: 0; padding: 0;">按钮的Y轴(纵向)值,需要带单位</p>
          <input type="text"
                 class="js_setting_input"
                 id="js_Button_Y"
                 style="background-color: #808080; margin: 3px 0; padding: 2px;"
                 placeholder="默认值：${getDefaultValue('setting_Add_Manual_Clear_Button_Y')}"
                 value="${Button_Y}">
        </div>
        <div style="margin: 0; padding: 0;">
          <p style="margin: 0; padding: 0;">在多长时间内快速点击3次移动按钮打开设置:</p>
          <input type="text"
                 class="js_setting_input"
                 style="background-color: #808080; margin: 3px 0; padding: 2px;"
                 placeholder="默认值：${getDefaultValue('setting_Quickly_Click_3Times_To_Open_Settings_Check_Time')}"
                 value="${GM_getValue('setting_Quickly_Click_3Times_To_Open_Settings_Check_Time')}">
        </div>
        <p></p>
        <div style="margin: 0; padding: 0;">
          <p style="margin: 0; padding: 0;">是否在加载时启用颜色反转:</p>
          <input type="text"
                 class="js_setting_input"
                 style="background-color: #808080; margin: 3px 0; padding: 2px;"
                 placeholder="默认值：${getDefaultValue('setting_Inversion_Color')}"
                 value="${GM_getValue('setting_Inversion_Color')}">
        </div>
        <p></p>
        <div style="margin: 0; padding: 0;">
          <p style="margin: 0; padding: 0;">是否打印是否控制台日志</p>
          <input type="text"
                 class="js_setting_input"
                 style="background-color: #808080; margin: 3px 0; padding: 2px;"
                 placeholder="默认值：${getDefaultValue('setting_Print_DebugMode_Log')}"
                 value="${GM_getValue('setting_Print_DebugMode_Log')}">
        </div>
        <p></p>
        <button id="js_setting_reset"
                style="background-color: #808080;">重置为默认值</button>
        <button id="js_setting_save"
                style="background-color: #808080;">保存</button>
    `);

    $(document).ready(function() {
        $('#js_setting_reset').on('click', function() {
            value.forEach((event) => {
                GM_deleteValue(event.name);
            });
            alert('配置项已被重置！');
        });
    });


    $(document).ready(function() {
        $('#js_setting_save').on('click', function() {
            let elements = $('.js_setting_input');
            let number = 10;
            if (elements.length === number) {
                elements.each(function(index) {
                    let boolValue = $(this).val() === 'true' ? true : $(this).val() === 'false' ? false : $(this).val();
                    GM_setValue(value[index + 1].name, boolValue); // 注意索引从1开始，跳过版本信息
                    log(MessagePrefix + `目前是第 ${index + 1} 个输入框，\n数据库数据名：${value[index + 1].name} 的\n值已经设置为: ${GM_getValue(value[index + 1].name)}`);
                });
                alert(MessagePrefix + '配置项已被保存！');
            } else {
                console.error(MessagePrefix + "输入框数量不符，实际数量：" + elements.length + ", 预期数量：" + number);
                alert(MessagePrefix + '配置项保存失败，输入框数量不匹配！');
                return; // 避免在配置未正确处理时继续执行后续逻辑
            }
        });
    });

}

// 显示等待开始执行的提示信息
insertModalDivs(`<div><h3>${MessagePrefix}</h3><br>将会等待 ${GM_getValue('setting_Start_Wait_Time') / 1000} 秒后开始执行删除</div>`);

// 在指定延迟后开始执行
setTimeout(function() {
    insertModalDivs(`<div><h3>${MessagePrefix}</h3><br>开始操作</div>`);
    // 确保DOM准备就绪后立即执行remove操作
    setTimeout(remove, 0);
}, GM_getValue('setting_Start_Wait_Time'));

// remove 函数的实现保持不变
function remove() {
    if (document.readyState === 'loading') {
        $(document).ready(startInterval);
    } else {
        startInterval();
    }
}

let intervalId;

function startInterval() {
    intervalId = setInterval(removeElements, GM_getValue('setting_Fast_Remove_Interval_Time'));

    setTimeout(function() {
        clearInterval(intervalId);
        if (GM_getValue('setting_Fast_Remove_Interval_Time') !== GM_getValue('setting_Fast_Remove_Duration')) {
            log(`${GM_getValue('setting_Fast_Remove_Duration')} 毫秒已过，停止删除操作.`);
            if (GM_getValue('setting_Show_Fast_Remove_Stopped_Alert')) {
                alert(`设置的循环时间 ${GM_getValue('setting_Fast_Remove_Duration')} 毫秒到了,您可以继续操作了.`);
            }
        } else {
            log('快速模式未启用');
        }
    }, GM_getValue('setting_Fast_Remove_Duration'));
}

function removeElements() {
    // 移除具有特定id属性的div元素（js_info）
    $('div#js_info').remove();

    // 查找并删除具有特定data-testid属性的div元素
    $('div[data-testid="beast-core-modal"]').each(function() {
        let shouldRemoveParent = true;

        // 查找 modalDiv 之前的具有 data-testid="beast-core-modal-mask" 的 div 元素
        let $maskDiv = $(this).prevAll('div[data-testid="beast-core-modal-mask"]').first();

        // 如果GM_getValue('setting_Show_Price_Menu')为false，则直接删除元素，不检查子结构
        if (!GM_getValue('setting_Show_Price_Menu')) {
            $(this).remove();
            return;
        }

        // 查找包含“切换店铺”文本的div
        const $switchShopDiv = $(this).find('.layout_title__1eHi_');
        if ($switchShopDiv.length && $switchShopDiv.text().trim().includes('切换店铺')) {
            shouldRemoveParent = false;
        }

        // 检查是否有包含"调价原因"的<th>元素
        const $headers = $(this).find('.TB_thead_5-109-0 .TB_th_5-109-0');
        const hasReasonHeader = $headers.filter(function() {
            return $(this).text().trim().includes('调价原因');
        }).length > 0;

        if (hasReasonHeader) {
            shouldRemoveParent = false;
        }

        // 根据shouldRemoveParent的值执行操作
        if (shouldRemoveParent) {
            log('没有找到包含 "调价原因" 或 "切换店铺" 的元素');
            $(this).remove();

            // 删除对应的maskDiv
            if ($maskDiv.length) {
                $maskDiv.remove();
            }

        } else {
            log('找到包含 "调价原因" 或 "切换店铺" 的元素');
        }
    });

    // 延迟执行删除空div的操作
    setTimeout(removeEmptyDivsAtBodyEnd, GM_getValue('setting_Start_Wait_Time') + GM_getValue('setting_Fast_Remove_Duration') + 10000);
}

function insertModalDivs(InputHTML) {
    // 创建并设置模态框div
    var $div = $('<div>', {
        id: 'js_info',
        align: 'center',
        css: {
            cssText: 'z-index: 2147483648 !important;', // 在css对象中添加cssText
            'overflow-y': 'auto',
            'max-height': '90%',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            'background-color': '#000',
            color: '#fff',
            padding: '10px',
            border: '1px solid #ccc',
            'box-shadow': '0 0 10px rgba(0, 0, 0, 0.3)'
        },
        html: `
            <span style="position: absolute; top: -1px; right: 3px; cursor: pointer;"
                  onclick="document.getElementById('js_info').remove()">×</span>
            ${InputHTML}
        `
    });

    // 添加div到body之后
    $('body').after($div);
}

// 防抖函数实现
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// 监听切换功能区
$('.index-module__menuBox___2aaTA').on('click', debounce(function(event) {
    if ($(event.target).closest('.index-module__menuBox___2aaTA').length) {
        var $mmsDescendant = $(event.target).closest('.bg-shell-theme-menu-mms');
        if ($mmsDescendant.length) {
            var $menuDescendant = $(event.target).closest('.index-module__menu___3Wyz- .bg-shell-theme-menu');
            if ($menuDescendant.length && $mmsDescendant[0] !== $menuDescendant.parent()[0]) {
                log('匹配到.index-module__menu___3Wyz- .bg-shell-theme-menu .bg-shell-theme-menu-mms下的.index-module__menu___3Wyz- .bg-shell-theme-menu的后代元素触发的点击');

                var longtimelist = ['/goods/product/list', '/main/sale-manage/main'];
                setTimeout(function() {
                    log('等待 100 毫秒,加载网址进行匹配');
                    var currentPath = window.location.pathname;
                    var time = longtimelist.includes(currentPath) ? 1400 : 960;

                    setTimeout(function() {
                        log(`已经等待 ${time} 毫秒,执行删除函数`);
                        removeElements();
                        setTimeout(CheckWebError, 1000);
                    }, time);
                }, 100);
            }
        }
    }
}, 1000));

// 删除尾部空div的函数
function removeEmptyDivsAtBodyEnd() {
    var $lastChild = $('body').children().last();

    while ($lastChild.is('div') && !$lastChild.text().trim()) {
        $lastChild.remove();
        $lastChild = $('body').children().last();
    }
}

function CheckWebError() {
    const $rootDiv = $('#root');
    if (!$rootDiv.length) {
        log('未找到ID为"root"的div元素');
        return;
    }

    const commentsToFind = [
        '<!--- script https://bstatic.cdnfe.com/static/main/maihuo/static/js/bgb-sc-main/runtime~main.ce42606d.js replaced by import-html-entry --->',
        '<!--- script https://bstatic.cdnfe.com/static/main/maihuo/static/js/bgb-sc-main/48.209360ea.chunk.js replaced by import-html-entry --->',
        '<!--- script https://bstatic.cdnfe.com/static/main/maihuo/static/js/bgb-sc-main/main.a38fe5f9.chunk.js replaced by import-html-entry --->'
    ];

    let allCommentsFound = true;

    $rootDiv.contents().each(function(index, childNode) {
        if (index >= 3 || !commentsToFind.some(comment => $(childNode).text().includes(comment.trim()))) {
            allCommentsFound = false;
            return false; // 跳出循环
        }
    });

    if (allCommentsFound) {
        log('找到所有定义的错误注释,刷新网页');
        insertModalDivs(`<p>检测到网页错误，为您刷新</p>`);
        location.reload(); // 刷新页面
    } else {
        log('未找到所有定义的错误注释,保持原样');
    }
}
