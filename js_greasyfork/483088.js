// ==UserScript==
// @name         网页看板娘
// @namespace   看板娘
// @version      0.1
// @description 看板娘
// @author       You
// @match        *://*/*
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483088/%E7%BD%91%E9%A1%B5%E7%9C%8B%E6%9D%BF%E5%A8%98.user.js
// @updateURL https://update.greasyfork.org/scripts/483088/%E7%BD%91%E9%A1%B5%E7%9C%8B%E6%9D%BF%E5%A8%98.meta.js
// ==/UserScript==

(function() {
    const w = window;
    w.kbn_setting0 = 1;
    /*人物ID*/
    w.kbn_setting1 = 2;
    /*衣服ID*/
    w.kbn_setting2 = true;
    /*是否显示关闭按钮*/
    w.kbn_setting3 = '180x170';
    /*人物大小*/
    w.kbn_setting4 = 'left:0';
    /*停靠侧:到侧边距离*/
    w.kbn_setting5 = '160x50';
    /*提示框大小*/
    w.kbn_setting6 = '12px';
    /*提示框字体大小*/
    w.kbn_setting7 = '-20px';
    /*提示框Y轴偏移*/
    w.kbn_setting8 = '21px';
    /*工具栏图标大小*/
    w.kbn_setting9 = '36px';
    /*工具栏行高*/
    w.kbn_setting10 = 'hitokoto.cn';
    /*一言API可选'fghrsh.net', 'hitokoto.cn', 'jinrishici.com'(古诗词)*/
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/IlysvlVEizbr/Live2D@1.9/kbn.js';
    script.defer = true;
    document.body.append(script);
})();
