// ==UserScript==
// @name         Gitlab Issues' Comment Template
// @namespace    http://tampermonkey.net/
// @version      0.16
// @description  庖丁科技御用issue模板[需要讲本插件加载顺序调至最末]
// @author       Ferstar
// @match        https://gitpd.paodingai.com/*/issues/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382009/Gitlab%20Issues%27%20Comment%20Template.user.js
// @updateURL https://update.greasyfork.org/scripts/382009/Gitlab%20Issues%27%20Comment%20Template.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.onreadystatechange = function () {
        if (document.readyState == "complete") {
            fillInTemplate(); // TODO: validation
        }
    }

    function fillInTemplate() {
        const text = String.raw`- [ ] 9527. 我是问题描述,把我替换掉 A级别bug

<!---
反馈问题格式说明:
- "- [ ] "这个保留
- 确保问题编号为纯数字且紧跟半角句号".", 然后句号, 问题描述, 优先级间至少留一个空格, 优先级只改对应字母A/B/C/D即可
- 每个 comment 只添加一个问题, 编号建议按楼层来编, 从1开始, 后面的保持队形不要乱
- Bug 分为A、B、C、D四个优先级别：
    - A：紧急，系统无法运行、主要业务功能无法操作或某一主要功能非常影响工作效率，需要立即修复、处理
    - B：较紧急，非主要业务功能无法操作或某一非主要功能非常影响工作效率，可按照开发人员的工作排期尽快处理
    - C：一般，UI（界面）上存在问题，不影响业务流程和使用，在给甲方部署前修复
    - D：低优先级
--->
`;
        document.getElementsByName('note[note]')[0].value = text;
    }
})();