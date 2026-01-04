// ==UserScript==
// @name         上海市中职校计算机应用专业教育质量监测理论考试平台 题目全选
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  顾名思义，左键单击选中考题，右键取消选择
// @author       U1iz@yzl
// @match        https://jisuanji.cantaicloud.com/ExamsStudPerson/JoinExamsStud?*
// @match        https://jisuanji.cantaicloud.com/ExamsStudPerson/ExamsStudPractice?*
// @icon         https://jisuanji.cantaicloud.com/img/LOGO%20(2).png
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452855/%E4%B8%8A%E6%B5%B7%E5%B8%82%E4%B8%AD%E8%81%8C%E6%A0%A1%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%BA%94%E7%94%A8%E4%B8%93%E4%B8%9A%E6%95%99%E8%82%B2%E8%B4%A8%E9%87%8F%E7%9B%91%E6%B5%8B%E7%90%86%E8%AE%BA%E8%80%83%E8%AF%95%E5%B9%B3%E5%8F%B0%20%E9%A2%98%E7%9B%AE%E5%85%A8%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/452855/%E4%B8%8A%E6%B5%B7%E5%B8%82%E4%B8%AD%E8%81%8C%E6%A0%A1%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%BA%94%E7%94%A8%E4%B8%93%E4%B8%9A%E6%95%99%E8%82%B2%E8%B4%A8%E9%87%8F%E7%9B%91%E6%B5%8B%E7%90%86%E8%AE%BA%E8%80%83%E8%AF%95%E5%B9%B3%E5%8F%B0%20%E9%A2%98%E7%9B%AE%E5%85%A8%E9%80%89.meta.js
// ==/UserScript==

(function () {
    window.addEventListener('click', e => {
        /* 单击选择 */
        if (e.target.className == 'timu-text') {
            /* 选中题目 */
            if (!e.target.querySelector('.operated')) {
                if($('.weui-input-fill').length > 0){
                    $('.weui-input-fill').get().forEach((e, i) => {
                        let underLine = document.createElement('span');
                        underLine.innerText = '___';
                        $('.timu-text')[0].insertBefore(underLine, $('.weui-input-fill')[i]);
                    });
                }
                let t = e.target.innerText;
                let t2 = t;
                t2 = t2.substr(t2.indexOf('、') + 1, t2.length);
                t2 = t2.replace(/\( \)/g, '()');
                t = t.replace(t2.replace(/\(\)/g, '( )'), '');
                /* console.log(t + '\n' + t2); */
                let select = document.createElement('div');
                
                select.innerHTML = `<span>${t}</span><span class="operated">${t2}</span>`;
                e.target.appendChild(select);
            }
            window.getSelection().selectAllChildren(e.target.querySelector('.operated'));
        } else if (e.target.className == 'operated' || e.target.className.indexOf('options-w') != -1) {
            window.getSelection().selectAllChildren(e.target);
        }
    })
    window.addEventListener('contextmenu', () => {
        /* 右键清除选择 */
        window.getSelection().removeAllRanges()
    })
})();