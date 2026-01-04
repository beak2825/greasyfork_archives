// ==UserScript==
// @name        Bangumi目录正则匹配
// @author       age_anime
// @description  正则过滤目录条目
// @match       *://bgm.tv/index/*
// @match       *://bangumi.tv/index/*
// @match       *://chii.in/index/*
// @version     1.2
// @grant       none
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @namespace https://greasyfork.org/users/1426310
// @downloadURL https://update.greasyfork.org/scripts/530733/Bangumi%E7%9B%AE%E5%BD%95%E6%AD%A3%E5%88%99%E5%8C%B9%E9%85%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/530733/Bangumi%E7%9B%AE%E5%BD%95%E6%AD%A3%E5%88%99%E5%8C%B9%E9%85%8D.meta.js
// ==/UserScript==

const path = window.location.pathname;
if (!/^\/index\/\d+(\/.*)?$/.test(path)) {
    return;
}

let lastRegexInput = ""; // 存储上次输入的正则内容

const $originalButton = $('#indexCatBox ul li.add a[href*="/add_related"]').parent();
const newButtonHTML = `
    <li class="add">
        <a id="regexFilterBtn" class="add" href="javascript:;">
            <span>正则过滤</span>
        </a>
    </li>
`;

$originalButton.length ? $originalButton.after(newButtonHTML) : $('#indexCatBox ul').append(newButtonHTML);

function showRegexDialog() {
    const dialog = `
    <div id="TB_overlay" class="TB_overlayBG TB_inline"></div>
    <div id="TB_window" style="margin-left: -240px; width: 480px; margin-top: -100px; display: block;">
        <div id="TB_title">
            <div id="TB_ajaxWindowTitle">正则过滤条目</div>
            <div id="TB_closeWindowButton" title="Close">X 关闭</div>
        </div>
        <div class="bibeBox" style="padding:10px">
            <label>输入正则表达式（每行一个，全部匹配时显示）\n实例：https://bgm.tv/group/topic/419355：</label>
            <textarea rows="10" class="quick" id="regexFilterInput"
                placeholder="示例：\n.*动画.*\n^\\d+年"></textarea>
            <div style="text-align:center;margin-top:10px">
                <input class="inputBtn" value="应用过滤" id="applyFilter" type="button">
                <input class="inputBtn" value="重置显示" id="resetFilter" type="button">
            </div>
        </div>
    </div>`;

    $('body').append(dialog);

    // 填充上次的输入
    $('#regexFilterInput').val(lastRegexInput);

    // 保存输入内容
    $('#regexFilterInput').on('input', function() {
        lastRegexInput = $(this).val();
    });

    $('#applyFilter').on('click', applyRegexFilter);
    $('#resetFilter').on('click', resetFilter);
    $('#TB_closeWindowButton').on('click', closeDialog);
}

function applyRegexFilter() {
    const patterns = $('#regexFilterInput').val()
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
            try {
                return new RegExp(line.trim(), 'i');
            } catch(e) {
                return null;
            }
        })
        .filter(regex => regex !== null);

    $('.light_odd.clearit, .light_even.clearit, .item.odd.clearit, .item.even.clearit').each(function() {
        const $item = $(this);
        const text = $item.find('.text').text().trim();
        $item.toggle( patterns.length ? patterns.every(regex => regex.test(text)) : true );
    });
    closeDialog();
}

function resetFilter() {
    $('.light_odd.clearit, .light_even.clearit, .item.odd.clearit, .item.even.clearit').show();
    closeDialog();
}

$(document).on('click', '#regexFilterBtn', function(e) {
    e.preventDefault();
    showRegexDialog();
});

function closeDialog() {
    $('#TB_overlay, #TB_window').remove();
}