// ==UserScript==
// @name         EasyWJX附加-指定答案填写
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  EasyWJX附加脚本，按照所给出的指定答案快速自动填写问卷。现仅支持单选题
// @author       MelonFish
// @match        https://ks.wjx.top/*/*
// @match        http://ks.wjx.top/*/*
// @match        https://www.wjx.cn/*/*
// @match        http://www.wjx.cn/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @require      https://www.layuicdn.com/layer/layer.js
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/455272/EasyWJX%E9%99%84%E5%8A%A0-%E6%8C%87%E5%AE%9A%E7%AD%94%E6%A1%88%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/455272/EasyWJX%E9%99%84%E5%8A%A0-%E6%8C%87%E5%AE%9A%E7%AD%94%E6%A1%88%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 配置
    var UserAnswer = [ // 在这里设置要填写的题的顺序（即id）和要填写的答案的顺序
        {id:1, answer:1, probability:3},
        {id:1, answer:1, probability:1},
        {id:1, answer:1, probability:2}
    ];
    setTimeout(function () {
        console.log(writeAnswer_radio(1,1))
        console.log(writeAnswer_listradio(8,1,1))
    },2000)
    // 下面是具体的实现了
    function getwjid() {
        return window.location.pathname.replace('/vm/', '').replace('.aspx', '')
    }
    function writeAnswer_radio(id, answer){
        var all_html = document.querySelectorAll('.field.ui-field-contain')[id]
        var radios = all_html.querySelectorAll('.ui-radio')
        console.log(all_html, radios)
        if (radios.length!=0) {
            radios[id].click()
            return 'success'
        }
        return 'not_radio'
    }

    function writeAnswer_listradio(list_id, id, answer) {
        var list_html = document.querySelectorAll('.field.ui-field-contain')[list_id];
        var input = list_html.querySelectorAll('input')[id]
        var label = list_html.querySelectorAll('.tableWrap table tbody tr[rowindex="'+id+'"]')
        input.value = answer

        label[0].querySelectorAll('a')[answer].className = 'rate-off rate-offlarge rate-on rate-ontxt'
        return 'success'
    }

    function random_probability (dict) {
        // [{content: 'some content', probability: 3}]
        var rand_list = []
        for (var i=0; i<dict.length; i++) {
            var content = dict[i].content
            var probability = dict[i].probability
            for (var j=0; j<probability; j++) {
                rand_list.push(content)
            }
        }

        var rand_item = rand_list[Math.floor(Math.random() * rand_list.length)]
        return rand_item;
    }

    function writeAllAnswer() {
        var question_num = document.querySelectorAll('.field.ui-field-contain').length;

    }

})();