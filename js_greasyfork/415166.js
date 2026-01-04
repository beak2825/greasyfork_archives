// ==UserScript==
// @name         让greasyfork论坛还你一个真正的论坛
// @name:en      Let the greasyfork forum return you a real forum
// @name:zh      让greasyfork论坛还你一个真正的论坛
// @name:zh-CN   让greasyfork论坛还你一个真正的论坛
// @name:zh-TW   讓greasyfork論壇還你一個真正的論壇
// @name:ja      greasyforkフォーラムに本当のフォーラムを返してください
// @name:ko      greasyfork 포럼 에 진정한 포럼 을 돌려 드 리 겠 습 니 다
// @namespace    a-new-greasyfork-bbs
// @version      0.1.5
// @description  让greasyfork论坛默认显示问题讨论而不是脚本反馈，还原真正的论坛功能。
// @description:en    Let the greasyfork Forum display problem discussion instead of script feedback by default. Restore the real forum function.
// @description:zh    让greasyfork论坛默认显示问题讨论而不是脚本反馈，还原真正的论坛功能。
// @description:zh-CN 让greasyfork论坛默认显示问题讨论而不是脚本反馈，还原真正的论坛功能。
// @description:zh-TW 讓greasyfork論壇默認顯示問題討論而不是腳本迴響，還原真正的論壇功能。
// @description:ja    greasyforkフォーラムにデフォルトで問題の討論を表示させて、シナリオのフィードバックではなくて、本当のフォーラムの機能を還元します。
// @description:ko    greasyfork 포럼 에 스 크 립 트 피드백 대신 문제 토론 을 기본 값 으로 표시 하고 진정한 포럼 기능 을 복원 합 니 다.
// @author       Wilson
// @icon         https://greasyfork.org/assets/blacklogo16-f649ec98e464d95b075234438da0fa13233b467b3cd1ad020f0ea07dea91d08c.png
// @match        *://greasyfork.org/*
// @downloadURL https://update.greasyfork.org/scripts/415166/%E8%AE%A9greasyfork%E8%AE%BA%E5%9D%9B%E8%BF%98%E4%BD%A0%E4%B8%80%E4%B8%AA%E7%9C%9F%E6%AD%A3%E7%9A%84%E8%AE%BA%E5%9D%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/415166/%E8%AE%A9greasyfork%E8%AE%BA%E5%9D%9B%E8%BF%98%E4%BD%A0%E4%B8%80%E4%B8%AA%E7%9C%9F%E6%AD%A3%E7%9A%84%E8%AE%BA%E5%9D%9B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var exlude1 = document.querySelector(".sidebar .list-option-groups > div:nth-child(3) > ul > li:nth-child(1) a");
    if(exlude1 && exlude1.getAttribute && !exlude1.getAttribute("data-exclude")) exlude1.setAttribute("data-exclude", 1);
    var links = document.getElementsByTagName("a");
    for(var i in links){
        var link = links[i];
        if(typeof link ==="object" && link.href && /(\/discussions)\/?$|\/discussions\?/i.test(link.href) && link.href.toLowerCase().indexOf("/no-scripts")===-1){
            if(link.getAttribute("data-exclude")==1) continue;
            if(link.href.toLowerCase().indexOf("/discussions?")!==-1){
                link.href=link.href.replace("/discussions?", "/discussions/no-scripts?");
            }else {
                link.href=link.href+"/no-scripts";
            }
        }
    }
})();