// ==UserScript==
// @name         Temu模态框自动取消
// @namespace    http://tampermonkey.net/
// @description  TEMU平台每天第一次启动有大量的弹窗，而且有倒计时才能关闭，手动关闭太麻烦，所以这个脚本会在打开TEMU后台的时候开始检测是否有弹出框，如果有，会自动关闭。
// @version      1.01
// @author       Monty
// @match        https://kuajing.pinduoduo.com*
// @match        https://seller.kuajingmaihuo.com*
// @icon         
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469266/Temu%E6%A8%A1%E6%80%81%E6%A1%86%E8%87%AA%E5%8A%A8%E5%8F%96%E6%B6%88.user.js
// @updateURL https://update.greasyfork.org/scripts/469266/Temu%E6%A8%A1%E6%80%81%E6%A1%86%E8%87%AA%E5%8A%A8%E5%8F%96%E6%B6%88.meta.js
// ==/UserScript==
function findMD() {
    setTimeout(function () {
        var fhmodal = document.querySelectorAll('.MDL_innerWrapper_5-109-0')[1]
        if(fhmodal!=null){
            console.log('查找模态框---------发货提醒：' + fhmodal)
            document.querySelectorAll('button')[1].click()
        }

        console.log('查找模态框---------1111')
        var mdbody = document.querySelector('.MDL_inner_5-109-0')
        console.log('查找模态框---------批量弹窗：' + mdbody.textContent)
        var result = findNext(mdbody)
        console.log('查找模态框---------result:' + result)
        if(result==null){
            alert('没有弹出框了')
            return
        }else{
            findMD()
        }
        
        // console.log('查找模态框---------' + mdbody)
        // if (mdbody != null) {
        //     var yybtn = document.querySelector('.BTN_primary_5-67-0')
        //     yybtn.click()
        //     findMD()
        // } else {
            
        // }
    }, 2000)
}

function findNext(modal){
    if (modal==null){
        console.log('查找模态框---------没有找到弹框')
        return null
    }else{
        console.log('查找模态框---------找到弹框')
        var btns = modal.querySelectorAll('button')
        btns.forEach(btn => {
            if(btn.innerText.indexOf('下一条')>-1||btn.innerText.indexOf('我已阅读')>-1){
                console.log('查找模态框---------找到下一条按钮')
                btn.click()
                return true
            }
        });
        return true
    }
}

(function () {
    'use strict';
    findMD()
})();