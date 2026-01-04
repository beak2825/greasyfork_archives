// ==UserScript==
// @name         tmvictor-triggers-desc
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  对Tmvictor的触发器增加备注框，目前没有导入导出功能，请手动复制粘贴 F12 -> Application -> storage -> Local Storage -> triggers-desc 的配置到其他浏览器
// @author       天使不见时
// @match        https://likexia.gitee.io/evolve/
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/428858/tmvictor-triggers-desc.user.js
// @updateURL https://update.greasyfork.org/scripts/428858/tmvictor-triggers-desc.meta.js
// ==/UserScript==

/** 数据保存的key */
const DATA_KEY = "triggers-desc";
/** 监听间隔 */
var LISTENER_TIME = 1000;

(function () {
    console.log("加载TMVictor（新）触发器备注框插件");

    let interval = setInterval(function () {

        // 整个脚本加载后才处理
        let item = $("#script_triggerSettings");
        if (!item || item.length === 0) {
            return;
        }

        // 没有生成过备注框才加载
        let descTitle = $('#script_triggerSettings tbody:first tr:last-child th').eq(-3).text();
        if (descTitle !== '备注') {
            creatTriggersDesc();
            // 销毁定时器
            window.clearTimeout(interval)
        }
    }, LISTENER_TIME)
})();

/**
 * 创建触发器的备注框
 */
function creatTriggersDesc() {

    // 创建备注标题
    let descTitle = $('<th class="has-text-warning" style="width:11%">备注</th>');
    $('#script_triggerSettings tbody:first tr:last-child th').eq(-3).after(descTitle);

    // 加载本地数据库中保存的备注数据
    let data = loadData();
    // 创建备注框
    $('#script_triggerTableBody').find('tr').each(function () {

        // 获取该行的id，用于记录对应行的备注
        let id = $(this).attr('value');

        // 构建备注框
        let triggersDesc = $('<td style="width:11%"><input type="text" class="input is-small" style="width:100%" value="' + loadById(data, id) + '"></td>');

        // 绑定onchange事件
        $(triggersDesc).find('input:last-child').on('change', function () {
            // 获取备注框中输入值
            let value = $(this).val();
            // 加载本地数据库中保存的备注数据
            let data = loadData();
            // 记录并保存备注数据
            data[id] = value;
            saveData(data);
        });

        // 插入备注框
        $(this).find('td').eq(-3).after(triggersDesc);
    });
}

/**
 * 从data中根据id获取值
 * @param data
 * @param id
 * @return {string}
 */
function loadById(data, id) {
    let value = data[id];
    return value ? value : '';
}

/**
 * 保存数据
 * @param data 需要保存的数据
 */
function saveData(data) {
    let localStorage = getLocalStorage();
    localStorage[DATA_KEY] = JSON.stringify(data);
}

/**
 * 加载数据
 * @return 数据
 */
function loadData() {
    let localStorage = getLocalStorage();
    let data = localStorage[DATA_KEY];
    // 初始化数据库key
    if (!data) {
        data = '{}';
        localStorage[DATA_KEY] = data;
    }
    return $.parseJSON(data);
}

/**
 * 获取本地存储器
 * @returns {*} 本地存储器
 */
function getLocalStorage() {

    let localStorage = window.localStorage;
    if (!localStorage) {
        alert("[tmvictor-triggers-desc]提示：浏览器不支持使用本插件，请更新您的浏览器版本至最新版本！！！");
        return;
    }

    return localStorage;
}