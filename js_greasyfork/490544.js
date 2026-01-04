// ==UserScript==
// @name         Swagger Compact UI
// @version      0.0.5
// @description  Swagger紧凑版UI
// @author       user
// @match        *://*/swagger-ui/*
// @namespace    cn.upall.greasyfork.swagger.ui
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490544/Swagger%20Compact%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/490544/Swagger%20Compact%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 优化样式
    let style = document.createElement('style')
    style.innerText = `
     body { background: #7e7e7e; }
     .try-out, .execute-wrapper { display:none; }
     .swagger-ui .wrapper { max-width:1000px; background: #fff; margin:15px auto; padding:15px; border-radius:5px; }
     .swagger-ui .info {    margin: 0;}
     .swagger-ui .scheme-container {     padding: 5px 0; }
     .swagger-ui .opblock-tag { padding: 5px; margin: -1px 0 0; font-size: 12px;font-weight: normal; }
     .swagger-ui .opblock-tag:hover,
     .swagger-ui .opblock-tag:hover .markdown p { color:#C00; }
     .swagger-ui .opblock-tag small { color:#000; }
     .swagger-ui .opblock-tag .markdown p { margin: 0; }
     .swagger-ui .opblock { margin:0 10px 5px; border:none; }
     .swagger-ui .opblock-tag a { display:inline-block;min-width:20em;text-align:right; }
     .opblock-tag-section.is-open .opblock-tag { border-top:solid 1px #C00; border-bottom-color:transparent; color:#C00; }
     .opblock-tag-section.is-open .opblock-tag small { color:#C00; }
     .swagger-ui .opblock { box-shadow: none; }
     .swagger-ui .opblock:hover .opblock-summary { box-shadow: none; background: rgba(0,0,0,.08) !important; }
     .swagger-ui .authorization__btn.unlocked { display: none; }
     .swagger-ui .opblock.opblock-post { background: none; }
     .swagger-ui .opblock.opblock-get { background: none; }
     .swagger-ui .opblock.opblock-put { background: none; }
     .swagger-ui .opblock.opblock-delete { background: none; }
     .swagger-ui .opblock.opblock-patch { background: none; }
     .swagger-ui .opblock .opblock-summary { display: block; }
     .swagger-ui .opblock .opblock-summary-path { font-weight: normal; font-family: monaco; display:inline-block; font-size: 12px; }
     .swagger-ui .opblock .opblock-summary-description { float: left; min-width: 18em; margin-right:1em; text-align: right; }
     .swagger-ui .opblock .opblock-summary-method {     font-size: 12px;    font-weight: normal;    min-width: 50px;    padding: 0 3px;    line-height: 1;display: inline-block;}
     .swagger-ui .opblock-description-wrapper, .swagger-ui .opblock-external-docs-wrapper, .swagger-ui .opblock-title_normal {    font-size: 12px;    margin: 0;    padding: 0 10px;}
     .swagger-ui .markdown p, .swagger-ui .markdown pre, .swagger-ui .renderedMarkdown p, .swagger-ui .renderedMarkdown pre { margin: 3px 0; }
     .swagger-ui .opblock .opblock-section-header {    display: flex;    align-items: center;    padding: 0px 20px;  background:none;  min-height: 0;    box-shadow: none;}
     .swagger-ui .table-container {    padding: 0 20px;}
     .swagger-ui .opblock .opblock-section-header h4 { color:#C00; cursor:pointer; }
     .swagger-ui table { font-size:12px; }
     .swagger-ui table tbody tr td:first-of-type { max-width:100%; padding:0; }
     .swagger-ui .parameters-col_description { width:auto; color:#000; }
     .swagger-ui .parameter__name,      .swagger-ui .parameter__type,     .swagger-ui .parameter__deprecated,     .swagger-ui .parameter__in , .swagger-ui .parameters-col_description .markdown, .swagger-ui .parameters-col_description .markdown p { margin:0;padding:0; display:inline-block;}
     .swagger-ui .parameters-col_description input[type=text] { float:right; text-align:right; background: none; }
     .swagger-ui .parameters-col_description input { margin:0;padding:0;border:none;cursor:default; }
     .swagger-ui .parameter__name { float:right; font-size:inherit; padding-right:0.5em; }
     .swagger-ui table tbody tr td { padding: 0; }
     .swagger-ui .parameter__type, .swagger-ui .prop-format, .swagger-ui .parameter__in, .swagger-ui .parameters-col_description input { user-select: none; }
     .swagger-ui table tbody tr:hover { background: #f0f0f0; }
     .swagger-ui .opblock .opblock-section-header .opblock-title::after { content:''; display:inline-block; width:0.5em;height:0.5em;border-top:solid 1px #c00;border-right:solid 1px #c00;transform: rotate(45deg); margin-left: 0.1em;}
     .swagger-ui .responses-inner { padding:0 20px; }
     .swagger-ui .expand-methods svg, .swagger-ui .expand-operation svg { width:10px;height:10px;opacity: 0.3; }
     .swagger-ui .opblock-tag { border-bottom: 1px solid rgb(59 65 81 / 11%); }
     .swagger-ui .response .property-row .model .prop .markdown,.response .property-row .model .prop .markdown p { display:inline; }
     .swagger-ui .response tr.property-row td:first-child { text-align:right; }
     .swagger-ui .model-box { display:block; }
     .swagger-ui .prop-type, .swagger-ui .prop-format { float: right; }
     `
    document.head.append(style)

    document.body.addEventListener('click', function(e) {
        try {
            var target = e.target;
            var parent = target.parentNode.parentNode;
            var className = parent.getAttribute('class');
            console.log(className)
            if (className == 'info') {
                // 展开所有
                document.querySelectorAll('.opblock-tag').forEach((item) => item.click());
            }
            // 点击复制接口地址
            if (className == 'opblock-summary-path') {
                var text = parent.dataset.path;
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(text);
                } else {
                    var textarea = document.createElement('textarea');
                    document.body.appendChild(textarea);
                    textarea.style.position = 'fixed';
                    textarea.style.clip = 'rect(0 0 0 0)';
                    textarea.style.top = '10px';
                    textarea.value = text;
                    textarea.select();
                    document.execCommand('copy', true);
                    document.body.removeChild(textarea);
                }
            }
            // 折叠请求参数
            if (className == 'opblock-section-header'){
                var next = parent.nextSibling;
                if (next.getAttribute('class') == 'parameters-container') {
                    if (next.offsetParent === null) {
                        next.style.display = 'block';
                    } else {
                        next.style.display = 'none';
                    }
                }
            }
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    });

  })();