// ==UserScript==
// @name         Google Search 结果导出
// @namespace    http://www.ixiqin.com/
// @version      0.4
// @description  OutPut Data from Google Search Result
// @author       Bestony
// @match        https://www.google.com/search*
// @require      http://code.jquery.com/jquery-3.2.1.min.js
// @license .    GPLv2
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32951/Google%20Search%20%E7%BB%93%E6%9E%9C%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/32951/Google%20Search%20%E7%BB%93%E6%9E%9C%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

/**
 * Action
 */
importCss();
scriptWithJquery();

/**
 * Get Result
 */
var searchResult = $("h3.r");
var contentArray = [];
searchResult.each(function () {
    contentArray.push({
        "title": this.firstElementChild.text.toString().replace(new RegExp(',',"g"),"·"),
        "herf": this.firstElementChild.href.toString(),
    });
});

/**
 * Import CSS For Button
 */
function importCss() {
    var jqueryScriptBlock = document.createElement('style');
    jqueryScriptBlock.type = 'text/css';
    jqueryScriptBlock.innerHTML = "#gototop{position:fixed;bottom:60%;left:10px;border:1px solid gray;padding:3px;width:90px;font-size:12px;cursor:pointer;border-radius: 3px;text-shadow: 1px 1px 3px #676767;}";
    document.getElementsByTagName('head')[0].appendChild(jqueryScriptBlock);
}
/**
 * 页面元素添加
 */
function scriptWithJquery() {
    $(document.body).append("<div id='gototop' title=''>下 载 搜 索 结 果</div>");
    $('#gototop').click(function () { downloadCSV({ filename: "data.csv" }); });
}
/**
 * 将 array 转换为 CSV 格式
 * @param args array
 */
function convertArrayOfObjectsToCSV(args) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data === null || !data.length) {
        return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function (item) {
        ctr = 0;
        keys.forEach(function (key) {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
}
/**
 * 下载 CSV 文件
 * @param args filename
 */
function downloadCSV(args) {
    var data, filename, link;
    var csv = convertArrayOfObjectsToCSV({
        data: contentArray
    });
    if (csv === null) return;

    filename = args.filename || 'export.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    data = encodeURI(csv);

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
}