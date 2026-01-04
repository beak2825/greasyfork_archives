// ==UserScript==
// @name         腾讯文档自动填写休息
// @namespace    http://tampermonkey.net/
// @version      0.01
// @description  便携
// @author       You
// @license      name
// @match        *://docs.qq.com/form/page/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516644/%E8%85%BE%E8%AE%AF%E6%96%87%E6%A1%A3%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E4%BC%91%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/516644/%E8%85%BE%E8%AE%AF%E6%96%87%E6%A1%A3%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E4%BC%91%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    const data1 =['0','1','2'];

    setTimeout(function() {  //'question-title'
        var data = document.getElementsByClassName('form-ui-component-basic-text');
        var data_text = document.getElementsByClassName('question-title');
        for(var i=0;i<data.length;i++){
            var data2 = data[i].querySelector('textarea');
            var text_name = data_text[i].querySelector('span')

            data2.value = data1[i];
            setInterval(data2.click(),1000);
        };
        var r = document.getElementsByClassName('question-commit')[0]
        r.querySelector('button').click();
        document.getElementsByClassName('dui-button dui-modal-footer-ok dui-button-type-primary dui-button-size-default')[0].click()
        //setInterval(,1000);
    }, 2000);

})();