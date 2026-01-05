// ==UserScript==
// @name 全局Arial雅黑
// @version 0.1
// @match *://*/*
// @author Jim Lin
// @description 兼容所有图标字体
// @namespace https://greasyfork.org/users/25855
// @grant None
// @downloadURL https://update.greasyfork.org/scripts/15954/%E5%85%A8%E5%B1%80Arial%E9%9B%85%E9%BB%91.user.js
// @updateURL https://update.greasyfork.org/scripts/15954/%E5%85%A8%E5%B1%80Arial%E9%9B%85%E9%BB%91.meta.js
// ==/UserScript==

var fontSet = new Set(['ARIAL', 'ARIAL BLACK', 'CALIBRI', 'CAMBRIA', 'CAMBRIA MATH', 'CANDARA', 'COMIC SANS MS', 'CONSOLAS', 'CONSTANTIA', 'CORBEL', 'COURIER', 'COURIER NEW', 'EBRIMA', 'FIXEDSYS', 'GABRIOLA', 'GADUGI', 'GEORGIA', 'IMPACT', 'JAVANESE TEXT', 'LEELAWADEE UI', 'LEELAWADEE UI SEMILIGHT', 'LUCIDA CONSOLE', 'LUCIDA SANS UNICODE', 'MS SANS SERIF', 'MS SERIF', 'MV BOLI', 'MALGUN GOTHIC', 'MALGUN GOTHIC SEMILIGHT', 'MARLETT', 'MICROSOFT HIMALAYA', 'MICROSOFT JHENGHEI', 'MICROSOFT JHENGHEI UI', 'MICROSOFT NEW TAI LUE', 'MICROSOFT PHAGSPA', 'MICROSOFT SANS SERIF', 'MICROSOFT TAI LE', 'MICROSOFT YAHEI UI', 'MICROSOFT YI BAITI', 'MINGLIU-EXTB', 'MINGLIU_HKSCS-EXTB', 'MODERN', 'MONGOLIAN BAITI', 'MYANMAR TEXT', 'NIRMALA UI', 'NIRMALA UI SEMILIGHT', 'PMINGLIU-EXTB', 'PALATINO LINOTYPE', 'ROMAN', 'SCRIPT', 'SEGOE MDL2 ASSETS', 'SEGOE PRINT', 'SEGOE SCRIPT', 'SEGOE UI', 'SEGOE UI BLACK', 'SEGOE UI EMOJI', 'SEGOE UI HISTORIC', 'SEGOE UI SEMIBOLD', 'SEGOE UI SEMILIGHT', 'SEGOE UI SYMBOL', 'SIMSUN-EXTB', 'SITKA BANNER', 'SITKA DISPLAY', 'SITKA HEADING', 'SITKA SMALL', 'SITKA SUBHEADING', 'SITKA TEXT', 'SMALL FONTS', 'SYLFAEN', 'SYMBOL', 'SYSTEM', 'TAHOMA', 'TERMINAL', 'TIMES NEW ROMAN', 'TREBUCHET MS', 'VERDANA', 'WEBDINGS', 'WINGDINGS', 'YU GOTHIC', 'YU GOTHIC UI', 'YU GOTHIC UI SEMIBOLD', 'YU GOTHIC UI SEMILIGHT', 'FANGSONG', 'SIMSUN', 'MICROSOFT YAHEI', 'NSIMSUN', 'KAITI', 'SIMHEI', 'DENGXIAN', '仿宋', '宋体', '微软雅黑', '新宋体', '楷体', '等线', '黑体']);

function tranElement(element) {
    if (element.nodeType != 1) {
        return;
    }

    var childNodes = element.childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        var childNode = childNodes[i];

        if (childNode.nodeType == 1) {
            tranElement(childNode);

        } else if (childNode.nodeType == 3) {
            var parentNode = childNode.parentNode;

            var fontFamily = window.getComputedStyle(parentNode).fontFamily;
            fontFamily = fontFamily.replace(/'|"/g, '');
            fontFamily = fontFamily.toUpperCase();

            if (fontFamily == 'ARIAL, MICROSOFT YAHEI') {
                continue
            }

            var fonts = fontFamily.split(', ');
            var font = fonts[0];
            if (fontSet.has(font.toUpperCase())) {
                parentNode.style.fontFamily = 'Arial, Microsoft YaHei';
            }

        }
    }
}

tranElement(document.body);