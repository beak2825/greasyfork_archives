// ==UserScript==
// @name         VSCode Extensions Download
// @namespace    https://marketplace.visualstudio.com
// @version      1.0.0
// @description  VSCode应用市场移除了.vsix插件各个版本的下载链接，这个脚本可以帮你加回插件各个版本的下载链接
// @author       qaulau
// @match        *://marketplace.visualstudio.com/items?itemName=*
// @icon         https://marketplace.visualstudio.com/favicon.ico
// @require      https://code.bdstatic.com/npm/jquery@3.5.0/dist/jquery.min.js
// @grant        GM_addStyle
// @tag          vscode
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/528894/VSCode%20Extensions%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/528894/VSCode%20Extensions%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;
    var timerId = setInterval(function(){
        if($('table.version-history-table').length == 0){
            return ;
        }
        GM_addStyle('.version-history-top-container .version-history-container-column {width: 20%;}');
        clearInterval(timerId);
        let data = JSON.parse($('.jiContent').text());
        let baseUrl = 'https://marketplace.visualstudio.com/_apis/public/gallery/publishers/' + data.Resources.PublisherName + '/vsextensions/' + data.Resources.ExtensionName + '/';
        // 添加下载行
        $('thead.version-history-table-thead > tr').append('<th class="version-history-container-column"></th><th class="version-history-container-column"></th>');
        // 遍历添加下载链接
        $('tbody.version-history-table-body > tr').each(function(i, e){
            let version = $.trim($(e).find('td').first().text());
            let url = baseUrl + version + '/vspackage';
            $(e).append('<td class="version-history-container-column"></td><td class="version-history-container-column"><a href="'+url+'">Download</a></td>');
        });
    }, 100);
})();