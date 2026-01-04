// ==UserScript==
// @name         贴吧域名重定向
// @version      0.7
// @description  还在因为贴吧奇葩的域名导致登陆不同步或登陆不上，又或者 stylus/stylish 样式无法应用上吗？此脚本跳转所有同类域名到主域名 tieba.baidu.com，如果发现有奇葩的域名没有生效，欢迎提交反馈！
// @author       zhylmzr
// @run-at       document-start


// @include /.*\.tieba\.com/
// @include /.+\.tieba\.baidu\.com/
// @include /wapp\.baidu\.com/
// @include /wefan\.baidu\.com/
// @include /jump2\.bdimg\.com/
// @namespace https://greasyfork.org/users/226597
// @downloadURL https://update.greasyfork.org/scripts/374482/%E8%B4%B4%E5%90%A7%E5%9F%9F%E5%90%8D%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/374482/%E8%B4%B4%E5%90%A7%E5%9F%9F%E5%90%8D%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==


(function() {
    var path = location.pathname
    var param = location.search

    if (path.indexOf('/p') !== 0) {
        path = '/f'
    }

    path = path.replace(/.*\/f.*/, '/f')

    location.replace('https://tieba.baidu.com' + path + param)
})();