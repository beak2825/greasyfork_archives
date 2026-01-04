// ==UserScript==
// @name         Solarized Light for flomo
// @version      1.0.3
// @description  为flomo.app设计的护眼色皮肤。
// @author       Sherlock Lau
// @match        https://flomo.app/*
// @namespace https://greasyfork.org/users/685020
// @downloadURL https://update.greasyfork.org/scripts/410848/Solarized%20Light%20for%20flomo.user.js
// @updateURL https://update.greasyfork.org/scripts/410848/Solarized%20Light%20for%20flomo.meta.js
// ==/UserScript==

(function() {
    var style = document.createElement("style");
    style.type = "text/css";
    var text = document.createTextNode("/* login */ /* 登录按钮及输入框圆角 */ .el-button--primary, .el-input--suffix, .el-input__inner { border-radius: 20px !important; } /* 登录按钮颜色 */ .el-button--primary { background-color: #424e53; border: none; } .el-button--primary:hover { background-color: #545d61; border: none; } /* 输入框颜色 */ .el-input--suffix, .el-input__inner { background: #fffcf7 !important; } /* editor */ /* 全局圆角设置 */ ul li.selected, ul li.selected>div, ul li:hover, ul li>div:hover, div.topbar .el-input.search .el-input__inner, div.content span.tag { border-radius: 20px !important; } /* 侧边导航hover事件 */ ul li>div:hover { background: #f2ebd4 !important; } /* 侧边导航选中样式 */ ul li.selected, ul li.selected>div { background: #5c6d74 !important; } ul li.selected ul li div span { color: #b0a6a6 !important; } /* 全局背景色与字体色 */ html, body, .el-drawer__body { background: rgb(252, 246, 229) !important; color: #3f4e54 !important; } /* 批注背景色 */ .el-drawer__wrapper .el-drawer { background: rgb(252, 246, 229); } /* 侧边栏日历样式 */ .stat .grid { padding: 10px !important; } .stat .grid .day { background: #dfdfdf !important; border-radius: 20px !important; } .stat .grid .day.green { background: #7b939c !important; border-radius: 6px; } .stat .grid .day.dark_green{ background: #3f4e54 !important; border-radius: 6px; } .stat .grid .day.today { border-color: #5c6d74 !important; } .stat .grid .day.light_green{background: #a6bdc6 !important;} /* 侧边栏 TAGS */ #sidebar h3 { color: #5c6d74 !important; font-weight: 800; font-size: 1em; } /* 侧边栏数字统计样式 */ .stat .datas .data .number { color: #424e53 !important; } .stat .datas .data .type { font-size: 8px !important; } /* 顶部搜索框样式 */ div.topbar .el-input.search .el-input__inner { background: #f7eedd !important; } .el-input.is-active .el-input__inner, .el-input__inner:focus { border-color: #5c6d74; } /* memo 卡片样式 */ div.memo div.card, .editor-content, div.editor-menu-bar, div.card { background: #fff9ef !important; } /* memo卡片编辑弹出框样式 */ .el-popper { background: rgb(255 253 246); } /* 底部输入框提交按钮样式 */ div.editor-menu-bar .submit-btn { background: #5c6d74 !important; border: none; border-radius: 20px; } div.editor-menu-bar .submit-btn:hover { background: #424e53 !important; } /* 内容区标签样式 */ div.content span.tag { background-color: #f7eedd !important; color: #a4772d !important; } /* 内容区搜索高亮样式 */ div.content label.highlight { background: #f0c859 !important; color: #424e53 !important; padding: 4px 6px !important; } /* 内容区边距 */ div.content { padding: 10px 0 !important; } /* 顶部及底部输入框宽度调整，避免与卡片样式产生割裂 */ div.topbar { padding: 12px 10px 0 !important; } div.input { padding: 0 16px 10px !important; } /* 图片样式背景 */ .files{ background-color: #fef9f0 !important; padding: 14px 14px !important; } .el-upload--picture-card{ background-color: #fbf6e7; } .el-upload-list--picture-card .el-upload-list__item-actions{ background-color: #fbf6e7; }");
    style.appendChild(text);
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
})();