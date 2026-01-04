// ==UserScript==
// @name         重庆学院随机答题
// @namespace    https://github.com/lzghzr/TampermonkeyJS
// @version      1.0.0
// @author       chengliang4810
// @description  重庆学院随机答题, 单选题、多选题，判断题。不保证答案的正确性。
// @require     https://cdn.bootcdn.net/ajax/libs/layer/3.5.1/layer.min.js
// @match        *://exercise.5any.com/Exercise/WebUI/Test/Answer*
// @connect     5any.com
// @license     MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463223/%E9%87%8D%E5%BA%86%E5%AD%A6%E9%99%A2%E9%9A%8F%E6%9C%BA%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/463223/%E9%87%8D%E5%BA%86%E5%AD%A6%E9%99%A2%E9%9A%8F%E6%9C%BA%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==
(function() {
    'use strict';

    $(document.body).append(`<link href="https://cdn.bootcdn.net/ajax/libs/layer/3.5.1/theme/default/layer.min.css" rel="stylesheet">`)

    setTimeout(function (){
        layer.msg('随机答题', {
            time: 0 //不自动关闭
            ,offset: 'l'
            ,btn: ['确认', '关闭']
            ,yes: function(index){
                randomAnswer()
            }
        });
    }, 1000);


    //随机答题
    function randomAnswer() {
        // 单选题/判断题 获取所有页面的所有单选输入框并按照name进行分组后，随机选中分组中的一个选项
        let radio = $("input[type='radio']");
        let radioName = [];
        radio.each(function (index, item) {
            radioName.push($(item).attr("name"));
        });
        radioName = [...new Set(radioName)];
        radioName.forEach(function (item) {
            let radioItem = $(`input[name='${item}']`);
            let random = Math.floor(Math.random() * radioItem.length);
            $(radioItem[random]).prop("checked", true);
        });

        //多选题 获取所有页面的所有多选输入框并按照name进行分组后，随机选中分组中的一个或多个选项，最少选择一个
        let checkbox = $("input[type='checkbox']");
        let checkboxName = [];
        checkbox.each(function (index, item) {
            checkboxName.push($(item).attr("name"));
        });
        checkboxName = [...new Set(checkboxName)];
        checkboxName.forEach(function (item) {
            let checkboxItem = $(`input[name='${item}']`);
            let random = Math.floor(Math.random() * checkboxItem.length);
            for (let i = 0; i < random; i++) {
                $(checkboxItem[i]).prop("checked", true);
            }
        });
    }


})();
