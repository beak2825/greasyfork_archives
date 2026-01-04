// ==UserScript==
// @name         替换部分字体
// @namespace    https://greasyfork.org/zh-CN/scripts/425268-替换部分字体
// @version      0.1.4
// @description  替换字体
// @author       You
// @include      *
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/425268/%E6%9B%BF%E6%8D%A2%E9%83%A8%E5%88%86%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/425268/%E6%9B%BF%E6%8D%A2%E9%83%A8%E5%88%86%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==

(function() {
    var css = "";
    css += [
        "@font-face { font-family: serif; src: local('Source Serif 4 SmText'), local('Source Han Serif SC'); }",
        "@font-face { font-family: Times; src: local('Source Serif 4 SmText'), local('Source Han Serif SC'); }",
        "@font-face { font-family: Times New Roman; src: local('Source Serif 4 SmText'), local('Source Han Serif SC'); }",
        "@font-face { font-family: Simsun; src: local('Source Han Serif SC'); unicode-range: U+4E00-9FA5, U+9FA6-9FEF, U+3400-4DB5, U+20000-2A6D6, U+2A700-2B734, U+2B740-2B81D, U+2B820-2CEA1, U+2CEB0-2EBE0, U+2F00-2FD5, U+2E80-2EF3, U+F900-FAD9, U+2F800-2FA1D, U+E815-E86F, U+E400-E5E8, U+E600-E6CF, U+31C0-31E3, U+2FF0-2FFB, U+3105-312F, U+31A0-31BA, U+3007; }",
        "@font-face { font-family: '宋体'; src: local('Source Han Serif SC'); unicode-range: U+4E00-9FA5, U+9FA6-9FEF, U+3400-4DB5, U+20000-2A6D6, U+2A700-2B734, U+2B740-2B81D, U+2B820-2CEA1, U+2CEB0-2EBE0, U+2F00-2FD5, U+2E80-2EF3, U+F900-FAD9, U+2F800-2FA1D, U+E815-E86F, U+E400-E5E8, U+E600-E6CF, U+31C0-31E3, U+2FF0-2FFB, U+3105-312F, U+31A0-31BA, U+3007; }",
        "@font-face { font-family: NSimsun; src: local('Source Han Serif SC'); unicode-range: U+4E00-9FA5, U+9FA6-9FEF, U+3400-4DB5, U+20000-2A6D6, U+2A700-2B734, U+2B740-2B81D, U+2B820-2CEA1, U+2CEB0-2EBE0, U+2F00-2FD5, U+2E80-2EF3, U+F900-FAD9, U+2F800-2FA1D, U+E815-E86F, U+E400-E5E8, U+E600-E6CF, U+31C0-31E3, U+2FF0-2FFB, U+3105-312F, U+31A0-31BA, U+3007; }",
        "@font-face { font-family: '新宋体'; src: local('Source Han Serif SC'); unicode-range: U+4E00-9FA5, U+9FA6-9FEF, U+3400-4DB5, U+20000-2A6D6, U+2A700-2B734, U+2B740-2B81D, U+2B820-2CEA1, U+2CEB0-2EBE0, U+2F00-2FD5, U+2E80-2EF3, U+F900-FAD9, U+2F800-2FA1D, U+E815-E86F, U+E400-E5E8, U+E600-E6CF, U+31C0-31E3, U+2FF0-2FFB, U+3105-312F, U+31A0-31BA, U+3007; }",
        "/* 思源黑体替换无衬线字体 */",
        "@font-face { font-family: sans-serif; src: local('Roboto'), local('Source Han Sans SC'); }",
        "@font-face { font-family: system-ui; src: local('Roboto'), local('Source Han Sans SC'); }",
        "@font-face { font-family: -apple-system; src: local('Roboto'), local('Source Han Sans SC'); }",
        "@font-face { font-family: Open sans; src: local('Roboto'), local('Source Han Sans SC'); }",
        "@font-face { font-family: Arial; src: local('Roboto'), local('Source Han Sans SC'); }",
        "@font-face { font-family: 'Segoe UI'; src: local('Roboto'), local('Source Han Sans SC'); }",
        "@font-face { font-family: Helvetica; src: local('Roboto'), local('Source Han Sans SC'); }",
        "@font-face { font-family: 'Helvetica Neue'; src: local('Roboto'), local('Source Han Sans SC'); }",
        "@font-face { font-family: 'Proxima Nova'; src: local('Roboto'), local('Source Han Sans SC'); }",
        "@font-face { font-family: mipro; src: local('Roboto'), local('Source Han Sans SC'); }",
        "@font-face { font-family: 'PingFang SC'; src: local('Roboto'), local('Source Han Sans SC'); }",
        "/*  */",
        "@font-face { font-family: 'Lantinghei SC'; src: local('Source Han Sans SC'); unicode-range: U+4E00-9FA5, U+9FA6-9FEF, U+3400-4DB5, U+20000-2A6D6, U+2A700-2B734, U+2B740-2B81D, U+2B820-2CEA1, U+2CEB0-2EBE0, U+2F00-2FD5, U+2E80-2EF3, U+F900-FAD9, U+2F800-2FA1D, U+E815-E86F, U+E400-E5E8, U+E600-E6CF, U+31C0-31E3, U+2FF0-2FFB, U+3105-312F, U+31A0-31BA, U+3007; }",
        "@font-face { font-family: Simhei; src: local('Source Han Sans SC'); unicode-range: U+4E00-9FA5, U+9FA6-9FEF, U+3400-4DB5, U+20000-2A6D6, U+2A700-2B734, U+2B740-2B81D, U+2B820-2CEA1, U+2CEB0-2EBE0, U+2F00-2FD5, U+2E80-2EF3, U+F900-FAD9, U+2F800-2FA1D, U+E815-E86F, U+E400-E5E8, U+E600-E6CF, U+31C0-31E3, U+2FF0-2FFB, U+3105-312F, U+31A0-31BA, U+3007; }",
        "@font-face { font-family: '黑体'; src: local('Source Han Sans SC'); unicode-range: U+4E00-9FA5, U+9FA6-9FEF, U+3400-4DB5, U+20000-2A6D6, U+2A700-2B734, U+2B740-2B81D, U+2B820-2CEA1, U+2CEB0-2EBE0, U+2F00-2FD5, U+2E80-2EF3, U+F900-FAD9, U+2F800-2FA1D, U+E815-E86F, U+E400-E5E8, U+E600-E6CF, U+31C0-31E3, U+2FF0-2FFB, U+3105-312F, U+31A0-31BA, U+3007; }",
        "@font-face { font-family: 'Microsoft Yahei UI'; src: local('Source Han Sans SC'); unicode-range: U+4E00-9FA5, U+9FA6-9FEF, U+3400-4DB5, U+20000-2A6D6, U+2A700-2B734, U+2B740-2B81D, U+2B820-2CEA1, U+2CEB0-2EBE0, U+2F00-2FD5, U+2E80-2EF3, U+F900-FAD9, U+2F800-2FA1D, U+E815-E86F, U+E400-E5E8, U+E600-E6CF, U+31C0-31E3, U+2FF0-2FFB, U+3105-312F, U+31A0-31BA, U+3007; }",
        "@font-face { font-family: 'Microsoft YaHei'; src: local('Source Han Sans SC'); unicode-range: U+4E00-9FA5, U+9FA6-9FEF, U+3400-4DB5, U+20000-2A6D6, U+2A700-2B734, U+2B740-2B81D, U+2B820-2CEA1, U+2CEB0-2EBE0, U+2F00-2FD5, U+2E80-2EF3, U+F900-FAD9, U+2F800-2FA1D, U+E815-E86F, U+E400-E5E8, U+E600-E6CF, U+31C0-31E3, U+2FF0-2FFB, U+3105-312F, U+31A0-31BA, U+3007; }",
        "@font-face { font-family: '微软雅黑'; src: local('Source Han Sans SC'); unicode-range: U+4E00-9FA5, U+9FA6-9FEF, U+3400-4DB5, U+20000-2A6D6, U+2A700-2B734, U+2B740-2B81D, U+2B820-2CEA1, U+2CEB0-2EBE0, U+2F00-2FD5, U+2E80-2EF3, U+F900-FAD9, U+2F800-2FA1D, U+E815-E86F, U+E400-E5E8, U+E600-E6CF, U+31C0-31E3, U+2FF0-2FFB, U+3105-312F, U+31A0-31BA, U+3007; }",
        "/* 替换常见的等宽字体 */",
        "@font-face { font-family: monospace; src: local('Cascadia Mono PL Regular'); }",
        "@font-face { font-family: 'monospace'; src: local('Cascadia Mono PL Regular'); }",
        "@font-face { font-family: Consolas; src: local('Cascadia Mono PL Regular'); }",
        "@font-face { font-family: Lucida Console; src: local('Cascadia Mono PL Regular'); }",
        "@font-face { font-family: 'source code pro'; src: local('Cascadia Mono PL Regular'); }",
        "@font-face { font-family: 'Courier New'; src: local('Cascadia Mono PL Regular'); }"
    ].join("\n");

    var node = document.createElement("style");
    node.type = "text/css";
    node.appendChild(document.createTextNode(css));
    var heads = document.getElementsByTagName("head");
    if (heads.length > 0) {
        heads[0].appendChild(node);
    } else {
        // no head yet, stick it whereever
        document.documentElement.appendChild(node);
    }
})();