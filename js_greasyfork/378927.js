// ==UserScript==
// @name         博学谷一键提交反馈
// @namespace    https://github.com/deargx
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://tlias-stu.boxuegu.com/
// @match        http://ntlias-stu.boxuegu.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378927/%E5%8D%9A%E5%AD%A6%E8%B0%B7%E4%B8%80%E9%94%AE%E6%8F%90%E4%BA%A4%E5%8F%8D%E9%A6%88.user.js
// @updateURL https://update.greasyfork.org/scripts/378927/%E5%8D%9A%E5%AD%A6%E8%B0%B7%E4%B8%80%E9%94%AE%E6%8F%90%E4%BA%A4%E5%8F%8D%E9%A6%88.meta.js
// ==/UserScript==

(function() {

    var a = document.createElement('a');
    a.style.position = 'fixed';
    a.style.right = '50px';
    a.style.bottom = '50px'
    a.style.display = 'block';
    a.style.width = '80px';
    a.style.height = '40px';
    a.style.textAlign = 'center';
    a.style.lineHeight = '40px';
    a.style.color = '#fff';
    a.style.backgroundColor = 'skyblue';
    a.style.textDecoration = 'none'
    a.href = '#';
    a.innerText = '一键选B';
    a.className = 'guanxiao'
    document.querySelector('body').appendChild(a);
    var guanxiao = document.querySelector('.guanxiao');
    guanxiao.onclick = function () {
        var timu = document.getElementsByClassName('el-radio-group');
        if (timu.length == 0) {
            alert('请在反馈页面提交')
        } else {
            for (let i = 0; i < timu.length; i++) {
                // 全选B
                timu[i].children[1].children[0].click()
                //   timu[i].children[0].children[0].click()  A
                //   timu[i].children[2].children[0].click()  C
                //   timu[i].children[3].children[0].click()  D
            }
            document.querySelector('.sub').click();

        }
    }
})();