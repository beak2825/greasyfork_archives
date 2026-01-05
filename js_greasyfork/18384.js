// ==UserScript==
// @name        字体样式美化
// @author       太原龙城足球俱乐部(ID:246770)
// @namespace   http://trophymanager.cn
// @description 自动调整trophymanager的中英文字体，从字体列表中选取，支持实时字体切换及设置持久化。
// @version     10.20240508
// @include     *trophymanager.com*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18384/%E5%AD%97%E4%BD%93%E6%A0%B7%E5%BC%8F%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/18384/%E5%AD%97%E4%BD%93%E6%A0%B7%E5%BC%8F%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    var css = document.createElement('style');
    var initialText = '*{text-decoration:none!important;font-weight:500!important;text-shadow:0.005em 0.005em 0.025em #999999 !important;}a:hover{color: #39F !important;text-shadow:-5px 3px 18px #39F !important;-webkit-transition: all 0.3s ease-out;}a{-webkit-transition: all 0.3s ease-out;}';
    css.appendChild(document.createTextNode(initialText));
    document.head.appendChild(css);

    // 模拟从系统获取的常用中英文字体列表
    var simulatedSystemFonts = [
        'Arial', 'Verdana', 'Helvetica', 'Times New Roman', 'Courier New', 'Georgia', 'Trebuchet MS',
        'SimSun', 'Microsoft YaHei', 'KaiTi', '仿宋', '隶书', '微软雅黑 Light', '宋体', '黑体','朱雀仿宋（预览测试版）'
    ];

    var storedFont = localStorage.getItem('selectedFont') || 'Arial'; // 获取之前保存的字体或默认Arial

    // 创建并初始化字体选择框
    var fontSelect = createFontSelect(simulatedSystemFonts, storedFont);
    document.body.appendChild(fontSelect);

    // 应用上次保存的字体设置
    applyStoredFont(storedFont);

    // 监听字体选择变化并即时更新样式及存储选择
    fontSelect.addEventListener('change', function(e) {
        var selectedFont = e.target.value;
        var newStyle = '* { font-family: ' + selectedFont + ' !important; }';
        updateStyle(css, newStyle);
        localStorage.setItem('selectedFont', selectedFont); // 保存用户选择的字体
    });

    // 创建并返回字体选择框
    function createFontSelect(fontList, defaultFont) {
        var select = document.createElement('select');
        select.style.position = 'fixed';
        select.style.bottom = '20px';
        select.style.left = '20px';
        
        fontList.forEach(function(font) {
            var option = document.createElement('option');
            option.value = font;
            option.textContent = font;
            if (font === defaultFont) option.selected = true;
            select.appendChild(option);
        });
        
        return select;
    }

    // 更新样式内容
    function updateStyle(styleElement, newCssText) {
        styleElement.textContent = newCssText + '\n' + initialText; // 保留初始样式设置
    }

    // 应用存储的字体设置
    function applyStoredFont(font) {
        var newStyle = '* { font-family: ' + font + ' !important; }';
        updateStyle(css, newStyle);
    }
})();