// ==UserScript==
// @name         福建省党务管理信息系统优化选择
// @license      AGPL License
// @namespace    https://penicillin.github.io/
// @version      0.11
// @description  不做选择直接转到国资委党务系统。
// @match        https://fj.dyejia.cn/pamsso/selPam.jsp
// @downloadURL https://update.greasyfork.org/scripts/430717/%E7%A6%8F%E5%BB%BA%E7%9C%81%E5%85%9A%E5%8A%A1%E7%AE%A1%E7%90%86%E4%BF%A1%E6%81%AF%E7%B3%BB%E7%BB%9F%E4%BC%98%E5%8C%96%E9%80%89%E6%8B%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/430717/%E7%A6%8F%E5%BB%BA%E7%9C%81%E5%85%9A%E5%8A%A1%E7%AE%A1%E7%90%86%E4%BF%A1%E6%81%AF%E7%B3%BB%E7%BB%9F%E4%BC%98%E5%8C%96%E9%80%89%E6%8B%A9.meta.js
// ==/UserScript==

window.location.replace('https://fj.dyejia.cn/pamsso/login.jsp?redirect=https%3A%2F%2Fgzpam.dyejia.cn%2Fpam%2Findex.jsp%3FPARTY_LOGIN%3D0');