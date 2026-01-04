// ==UserScript==
// @name         一代仁医-云云破解版
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       小二
// @match        *://www.renyiwang.net/Student/PracticePreview.aspx*
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @resource css    https://cdn.staticfile.org/layui/2.4.3/css/modules/layer/default/layer.css
// @require      https://cdn.staticfile.org/layui/2.4.3/layui.all.min.js
// @downloadURL https://update.greasyfork.org/scripts/423757/%E4%B8%80%E4%BB%A3%E4%BB%81%E5%8C%BB-%E4%BA%91%E4%BA%91%E7%A0%B4%E8%A7%A3%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/423757/%E4%B8%80%E4%BB%A3%E4%BB%81%E5%8C%BB-%E4%BA%91%E4%BA%91%E7%A0%B4%E8%A7%A3%E7%89%88.meta.js
// ==/UserScript==

layui.config({
      dir: 'https://cdn.staticfile.org/' //layui.js 所在路径（注意，如果是 script 单独引入 layui.js，无需设定该参数。），一般情况下可以无视
      ,version: false //一般用于更新模块缓存，默认不开启。设为 true 即让浏览器不缓存。也可以设为一个固定的值，如：201610
      ,debug: false //用于开启调试模式，默认 false，如果设为 true，则JS模块的节点会保留在页面
      ,base: '' //设定扩展的 layui 模块的所在目录，一般用于外部模块扩展
    });

(function() {
    'use strict';
    // 解除禁止copy;
    GM_addStyle(GM_getResourceText("css"));
    const body = $('body')[0];
    body.oncopy = null;
    body.onselectstart = null;
    body.ondragstart = null;
    body.oncut = null;
    layer.msg('破解运行中, 请等待1.5秒');
    function start() {
        const data = $('#sample-table').dataTable().api().context[0].aoData;
        const content = $('<div id="my-layer-content"></div>');
        const header = $('#sample-table').dataTable().api().table().header().innerText;
        content.append($(`<h3 style="text-align: center">${header}</h1>`));
        data.forEach(item => {
          const text = item._sFilterRow.split(' ').filter(item => item !== '');
          const aDom = $('<div></div>');
          text.forEach(text => {
             if(text.indexOf('【正确答案】') > 0) {
               aDom.append($(`<p style="color: #2187e0">${text}</p>`));
             } else {
               aDom.append($(`<p>${text}</p>`));
             }
          })
          content.append(aDom);
          content.append($('<br />'));
        })
        layer.open({
          content: `<div id="my-layer-content">${content.html()}</div>`,
          title: '😘o呆萌云爱心专属💗',
          area: ['50%', '600px'],
          btnAlign: 'c',
          closeBtn: 0,
          btn: ['点击复制内容', '退出'],
          yes: function(index) {
            var range = document.createRange();
            const referenceNode = $('#my-layer-content')[0];
            range.selectNodeContents(referenceNode);
            var selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand("copy"); // 执行浏览器复制命令
            layer.msg('copy 成功！内容已复制到剪切板');
            layer.close(index);
          },
          btn1: function(index) {
            layer.close(index);
          }
        });
    }
    setTimeout(() => { start()}, 1500);
})();