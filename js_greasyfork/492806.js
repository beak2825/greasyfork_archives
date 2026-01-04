// ==UserScript==
// @name         边界ai网页版精简
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  边界ai网页版精简掉广告和vip标志等烦人按钮图标
// @author       B站@王子周棋洛
// @match        https://ai1foo.com/chat?*
// @icon         https://file.1foo.com/2023/12/12/941983dadec37a257e67974675d21734.png
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492806/%E8%BE%B9%E7%95%8Cai%E7%BD%91%E9%A1%B5%E7%89%88%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/492806/%E8%BE%B9%E7%95%8Cai%E7%BD%91%E9%A1%B5%E7%89%88%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==

(function () {

    // 只需要在此处定义需要隐藏元素
    //class类前面加.    id类前面加#
    var clearElementArr = [
        'Aichat', '.ant-btn', '._header_pc_actives_spans_1lp1u_166', '._SiberCommonFooter_footerBox_1cs7k_4', '.ant-dropdown-trigger1', '._header_pc_logo_descBox_1lp1u_36',
        '._buttomdesc_1o32i_418' ,'._fiexdBox_1o32i_430' ,'._rightBox_icon_1o32i_293' ,'._main_list_head_name_1o32i_138' ,
        '._buttomdesc_pejex_419' ,'._fiexdBox_pejex_431' ,'._buttomdesc_18fty_423' ,'._fiexdBox_18fty_435' ,
        '._headerimg_l13t8_359' ,'._header_pc_actives_spans_l13t8_166' ,'._header_pc_logo_description_l13t8_88' , '._header_pc_logo_descBox_l13t8_36' ,
    ];

    // 这是架子代码，不用改动
    console.log("准备隐藏以下元素 >>> " + clearElementArr);

    window.pageC = function (clearElements) {
        let style = document.createElement("style");
        style.innerText += `html {overflow: auto !important;} `;
        if (typeof (clearElements) === "object") {
            clearElements.forEach(cE => {
                style.innerText += `${cE} {display: none !important;} `
            });
        } else { 
            console.error("param error,require array!"); 
        }
        document.head.appendChild(style);
    };
    pageC(clearElementArr);
    console.log("清理完成！");
})();