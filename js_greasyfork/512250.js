// ==UserScript==
// @name 京东朗正体
// @namespace JingDongLangZhengTi
// @version  1
// @description 在网页中使用京东朗正体
// @author LWF
// @license MIT
// @grant none
// @match *://*/*
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/512250/%E4%BA%AC%E4%B8%9C%E6%9C%97%E6%AD%A3%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/512250/%E4%BA%AC%E4%B8%9C%E6%9C%97%E6%AD%A3%E4%BD%93.meta.js
// ==/UserScript==

(function() {
    // 创建一个 <style> 元素
    const css = document.createElement('style');
    // 为 <style> 元素设置 CSS 内容，导入外部字体，并强制所有元素使用 JingDongLangZhengTi 字体
    css.innerHTML = `
        @font-face {
	font-family: 'JingDongLangZhengTi';
	src: url('https://jdrdl.jd.com/assets/fonts/JDLANGZHENGTI-L--GBK1-0.woff2') format('woff2'),
	url('https://jdrdl.jd.com/assets/fonts/JDLANGZHENGTI-L--GBK1-0.woff') format('woff');
	font-weight: 300;
	font-style: normal;
}

@font-face {
	font-family: 'JingDongLangZhengTi';
	src: url('https://jdrdl.jd.com/assets/fonts/JDLANGZHENGTI-R--GBK1-0.woff2') format('woff2'),
	url('https://jdrdl.jd.com/assets/fonts/JDLANGZHENGTI-R--GBK1-0.woff') format('woff');
	font-weight: normal;
	font-style: normal;
}

@font-face {
	font-family: 'JingDongLangZhengTi';
	src: url('https://jdrdl.jd.com/assets/fonts/JDLANGZHENGTI-SB--GBK1-0.woff2') format('woff2'),
	url('https://jdrdl.jd.com/assets/fonts/JDLANGZHENGTI-SB--GBK1-0.woff') format('woff');
	font-weight: 600;
	font-style: normal;
}

@font-face {
	font-family: 'JingDongLangZhengTi';
	src: url('https://jdrdl.jd.com/assets/fonts/JDLANGZHENGTI-B--GBK1-0.woff2') format('woff2'),
	url('https://jdrdl.jd.com/assets/fonts/JDLANGZHENGTI-B--GBK1-0.woff') format('woff');
	font-weight: bold;
	font-style: normal;
}
        * {
            font-family: 'JingDongLangZhengTi' !important;
        }
    `;
    // 将 <style> 元素添加到页面的 <head> 部分
    document.head.appendChild(css);
})();
