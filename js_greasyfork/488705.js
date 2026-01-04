// ==UserScript==
// @name         脱钩绝望的文盲
// @namespace    http://tampermonkey.net/
// @version      2024-11-20
// @description  文本替换
// @author       You
// @match        https://archiveofourown.org/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488705/%E8%84%B1%E9%92%A9%E7%BB%9D%E6%9C%9B%E7%9A%84%E6%96%87%E7%9B%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/488705/%E8%84%B1%E9%92%A9%E7%BB%9D%E6%9C%9B%E7%9A%84%E6%96%87%E7%9B%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var main = document.querySelector('#main');
    document.title = document.title.replace('博君一肖','禁柯').replace('博肖','禁K');
    main.innerHTML = main.innerHTML
        .replaceAll('博君一肖','禁柯')
        .replaceAll('博肖','禁K')
        .replaceAll('肖战', '顾柯')
        .replaceAll('战战', '柯柯')
        .replaceAll('战哥', '柯哥')
        .replaceAll('赞赞', '柯柯')
        .replaceAll('小战', '小柯')
        .replaceAll('肖老师', '阿柯')
        .replaceAll('Xiao Zhan', 'XIAO KE')
        .replaceAll('王一博', '肖禁')
        .replaceAll('Wang YiBo', 'XIAO JIN')
        .replace(/王[.…]+一博[.…]*/g, '肖…禁…')
        .replaceAll('一博', '禁')
        .replaceAll('王老师', '阿禁')
        .replace(/王[.…]+一[.…]+博[.…]*/g, '肖…禁…')
        .replace(/一[.…]+博[.…]*/g, '肖…禁…')
    ;

    document.title = document.title.replace('忘羡','影羡').replace('蓝湛','时影');
    main.innerHTML = main.innerHTML
        .replaceAll('忘羡','影羡')
        .replaceAll('蓝忘机','时影')
        .replaceAll('蓝湛','时影')
        .replaceAll(/蓝[、.…]+湛[、.…]*/g,'时…影…')
        .replaceAll('忘机','影儿')
        .replaceAll(/蓝[、.…]+/g,'时…')
        .replaceAll('蓝氏','空桑')
        .replaceAll('含光君','少司命')
        .replaceAll('蓝二公子','世子殿下')
        .replaceAll('二公子','殿下')
        .replaceAll('二哥哥','影哥哥')
        .replaceAll(/二[、.…]+哥[、.…]*哥[、.…]*/g,'影…哥…哥')
        .replaceAll('姑苏','九疑山')
})();