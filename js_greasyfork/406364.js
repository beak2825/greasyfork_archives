// ==UserScript==
// @name 字体替换
// @namespace https://greasyfork.org/users/662341
// @version 1.6.4
// @description 替换部分字体
// @author Sign_Up
// @license CC-BY-NC-ND-4.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/406364/%E5%AD%97%E4%BD%93%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/406364/%E5%AD%97%E4%BD%93%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
let css = `
    /* ==================== */
    /* 思源宋体替换衬线(Serif)字体 */
    @font-face { font-family: serif; src: local('Source Serif 4'), local('Source Han Serif'), local('source-han-serif-sc'); }
    @font-face { font-family: Times; src: local('Source Serif 4'), local('Source Han Serif SC'), local('source-han-serif-sc'); }
    @font-face { font-family: Times New Roman; src: local('Source Serif 4'), local('Source Han Serif SC'), local('source-han-serif-sc'); }
    @font-face { font-family: NexusSerif; src: local('Source Serif 4'), local('Source Han Serif SC'), local('source-han-serif-sc'); }
    @font-face { font-family: Simsun; src: local('Source Han Serif SC'), local('source-han-serif-sc'); }
    @font-face { font-family: '宋体'; src: local('Source Han Serif SC'), local('source-han-serif-sc'); }
    @font-face { font-family: NSimsun; src: local('Source Han Serif SC'), local('source-han-serif-sc'); }
    @font-face { font-family: '新宋体'; src: local('Source Han Serif SC'), local('source-han-serif-sc'); }

    /* Roboto + 更纱黑体替换无衬线(Sans-serif)字体 */
    @font-face { font-family: sans-serif; src: local('Roboto'), local('Sarasa UI SC'); }
    @font-face { font-family: ui-sans-serif; src: local('Roboto'), local('Sarasa UI SC'); }
    @font-face { font-family: system-ui; src: local('Roboto'), local('Sarasa UI SC'); }
    @font-face { font-family: -apple-system; src: local('Roboto'), local('Sarasa UI SC'); }
    @font-face { font-family: BlinkMacSystemFont; src: local('Roboto'), local('Sarasa UI SC'); }
    @font-face { font-family: Open sans; src: local('Roboto'), local('Sarasa UI SC'); }
    @font-face { font-family: 'Source Sans Pro'; src: local('Roboto'), local('Sarasa UI SC'); }
    @font-face { font-family: NexusSans; src: local('Roboto'), local('Sarasa UI SC'); }
    @font-face { font-family: Arial; src: local('Roboto'), local('Sarasa UI SC'); }
    @font-face { font-family: Arial Unicode MS; src: local('Roboto'), local('Sarasa UI SC'); }
    @font-face { font-family: Calibri; src: local('Roboto'), local('Sarasa UI SC'); }
    @font-face { font-family: 'Segoe UI'; src: local('Roboto'), local('Sarasa UI SC'); }
    @font-face { font-family: 'Segoe UI Variable'; src: local('Roboto'), local('Sarasa UI SC'); }
    @font-face { font-family: Helvetica; src: local('Roboto'), local('Sarasa UI SC'); }
    @font-face { font-family: 'Helvetica Neue'; src: local('Roboto'), local('Sarasa UI SC'); }
    @font-face { font-family: 'Proxima Nova'; src: local('Roboto'), local('Sarasa UI SC'); }
    @font-face { font-family: 'Verdana'; src: local('Roboto'), local('Sarasa UI SC'); }
    @font-face { font-family: 'Roboto-Medium'; src: local('Roboto'), local('Sarasa UI SC'); }


    /*  */
    @font-face { font-family: 'Lantinghei SC'; src: local('Sarasa UI SC'); }
    @font-face { font-family: Simhei; src: local('Sarasa UI SC'); }
    @font-face { font-family: '黑体'; src: local('Sarasa UI SC'); }
    @font-face { font-family: 'Microsoft Yahei UI'; src: local('Sarasa UI SC'); }
    @font-face { font-family: "Microsoft YaHei"; src: local('Sarasa UI SC'); }
    @font-face { font-family: "Microsoft JhengHei"; src: local('Sarasa UI SC'); }
    @font-face { font-family: '微软雅黑'; src: local('Sarasa UI SC'); }
    @font-face { font-family: mipro; src: local('Sarasa UI SC'); }
    @font-face { font-family: PingFangSC-Regular; src: local('Sarasa UI SC'); }
    @font-face { font-family: 'PingFang'; src: local('Sarasa UI SC'); }
    @font-face { font-family: 'MS Gothic'; src: local('Sarasa UI SC'); }
    @font-face { font-family: 'MS UI Gothic'; src: local('Sarasa UI SC'); }
    @font-face { font-family: Inter; src: local('Sarasa UI SC'); }

    /* 替换常见的等宽字体 */
    @font-face { font-family: monospace; src: local('Sarasa Fixed CL'), local('Cascadia Mono PL'), local('Source Code Pro Medium'); }
    @font-face { font-family: 'monospace'; src: local('Sarasa Fixed CL'), local('Cascadia Mono PL'), local('Source Code Pro Medium'); }
    @font-face { font-family: Consolas; src: local('Sarasa Fixed CL'), local('Cascadia Mono PL'), local('Source Code Pro Medium'); }
    @font-face { font-family: Lucida Console; src: local('Sarasa Fixed CL'), local('Cascadia Mono PL'), local('Source Code Pro Medium'); }
    @font-face { font-family: 'source code pro'; src: local('Sarasa Fixed CL'), local('Cascadia Mono PL'), local('Source Code Pro Medium'); }
    @font-face { font-family: 'Courier New'; src: local('Sarasa Fixed CL'), local('Cascadia Mono PL'), local('Source Code Pro Medium'); }
    /* ==================== */
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
