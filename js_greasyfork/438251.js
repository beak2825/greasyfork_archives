// ==UserScript==
// @name                 Replace fonts
// @name:zh-CN           替换和美化网页字体
// @namespace            https://*
// @version              1.0.1
// @author               chwt163
// @description          Replace web fonts
// @description:zh-CN    默认替换成雅黑，想要其它字体，更改Microsoft YaHei为其它字体名称即可。text-shadow可以更改字体阴影，如不需要阴影，删除text-shadow那一行即可。
// @include              *
// @supportURL           https://*
// @run-at               document-start
// @grant                GM_addStyle
// @license              MIT
// @downloadURL https://update.greasyfork.org/scripts/438251/Replace%20fonts.user.js
// @updateURL https://update.greasyfork.org/scripts/438251/Replace%20fonts.meta.js
// ==/UserScript==

GM_addStyle(`
    body :not(:-webkit-any(em,i)){font-family:"Microsoft YaHei"}
    * {text-shadow : 0.00em 0.00em 0.00em #999999}
`);
