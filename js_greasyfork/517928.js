// ==UserScript==
// @name        gz_ui_css-v1
// @namespace   http://tampermonkey.net/
// @homepageURL  https://space.bilibili.com/473239155
// @license     Apache-2.0
// @version     0.5
// @author      byhgz
// @description 个人自用样式
// @noframes
// ==/UserScript==
(function () {
    'use strict';

    var css = `button[gz_type] {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    transition: .1s;
    font-weight: 500;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 8px;
}

button[gz_type="primary"] {
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
}

button[gz_type="success"] {
    color: #fff;
    background-color: #67c23a;
    border-color: #67c23a;
}

button[gz_type="info"] {
    color: #fff;
    background-color: #909399;
    border-color: #909399;
}

button[gz_type="warning"] {
    color: #fff;
    background-color: #e6a23c;
    border-color: #e6a23c;
}

button[gz_type="danger"] {
    color: #fff;
    background-color: #f56c6c;
    border-color: #f56c6c;
}

button[border] {
    border-radius: 20px;
    padding: 12px 23px;
}

input[gz_type] {
    font-family: 'Arial', sans-serif; /* 设置字体 */
    font-size: 16px; /* 设置字体大小 */
    padding: 10px; /* 输入框内部的填充 */
    margin: 10px; /* 输入框外部的边距 */
    border: 1px solid #ccc; /* 边框样式 */
    border-radius: 4px; /* 边框圆角 */
    outline: none; /* 移除聚焦时的轮廓线 */
}

input[gz_type]:focus {
    border-color: #007bff; /* 聚焦时边框颜色 */
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.3); /* 聚焦时的阴影效果 */
}

select {
    font-family: 'Arial', sans-serif; /* 设置字体 */
    font-size: 16px; /* 设置字体大小 */
    padding: 10px; /* 输入框内部的填充 */
    margin: 10px; /* 输入框外部的边距 */
    border: 1px solid #ccc; /* 边框样式 */
    border-radius: 4px; /* 边框圆角 */
    outline: none; /* 移除聚焦时的轮廓线 */
    background-color: white; /* 背景色 */
    color: #333; /* 文本颜色 */
}

select:focus {
    border-color: #007bff; /* 聚焦时边框颜色 */
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.3); /* 聚焦时的阴影效果 */
}

select:disabled {
    background-color: #f1f1f1; /* 禁用时的背景色 */
    border-color: #ccc; /* 禁用时的边框色 */
    color: #888; /* 禁用时的文本色 */
}


button:hover {
    border-color: #646cff;
}

/*聚焦环*/
button[gz_type]:focus,
button[gz_type]:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
}
`;
    /**
     * 插入样式
     * @param el {Document}该元素下是否已经插入过样式
     * @param insertionPosition {Element|Document} 要插入样式的位置
     */
    const addStyle = (el, insertionPosition = document.head) => {
        const styleEl = el.querySelector("style[gz_style]");
        if (styleEl !== null) {
            console.log("已有gz_style样式，故不再插入该样式内容");
            return;
        }
        const style = document.createElement('style');
        style.setAttribute("gz_style", "");
        style.textContent = css;
        insertionPosition.appendChild(style);
    };

    addStyle(document);

    window.gz_ui_css = {
        addStyle
    };

})();
