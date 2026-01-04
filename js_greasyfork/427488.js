// ==UserScript==
// @name         只看错题
// @namespace    aaron.js.greasyfork.org
// @version      1.0
// @description  只做错题
// @author       Aaron
// @match        http://www.qhclass.com/course/*/activity_show
// @icon         https://www.google.com/s2/favicons?domain=qhclass.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427488/%E5%8F%AA%E7%9C%8B%E9%94%99%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/427488/%E5%8F%AA%E7%9C%8B%E9%94%99%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $(".ibs-dark-major.text-left.ant-checkbox-wrapper").click(go)
    function go(){
        $(".ibs-table").removeClass("ibs-success-color")
        $(".ant-radio").removeClass("ant-radio-checked")
        $(".ant-radio-wrapper.ibs-choose-item.ibs-engine-radio").removeClass("ibs-engine-radio--success ibs-engine-radio--error ant-radio-wrapper-checked")
        $(".ibs-answer.ibs-answer-part").hide()
        $(".ibs-explain.ibs-mt16").hide()
        $(".ant-radio-group.ant-radio-group-outline.ant-radio-group-default.ibs-width-full").removeClass("ibs-prevent-click")
        $(".ant-radio-wrapper.ibs-choose-item.ibs-engine-radio").click(e=>{var p=$($(e.target).parents(".ant-col")[0]);p.find(".ibs-answer.ibs-answer-part").show();p.find(".ibs-explain.ibs-mt16").show();})
    }
})();