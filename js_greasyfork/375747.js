// ==UserScript==
// @name         JLU - UIMS - 评教
// @namespace    http://blog.pxpoi.cn/
// @version      0.1
// @description  For JLU - UIMS评教系统
// @author       BenAway
// @match        http://uims.jlu.edu.cn/ntms/page/eval/*
// @grant        none
// @require     https://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/375747/JLU%20-%20UIMS%20-%20%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/375747/JLU%20-%20UIMS%20-%20%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

ntms.widget.RadioButtonLabel.superclass._static.MIN_INTERVAL_MS = 0;
(function() {
    for(let i = 0; i <= 17; i++) {
        $('#ntms_widget_RadioButtonLabel_' + i * 4).trigger('click');
    }
    $('#ntms_widget_CheckBoxLabel_10').trigger('click');
    setTimeout(function(){$('#dijit_form_Button_0_label').trigger('click');}, 500);
})();