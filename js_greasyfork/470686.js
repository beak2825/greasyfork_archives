// ==UserScript==
// @name         xiaomingzhaohuo
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  可以帮助你获得小明找货的价格的工具。例如将所有价格修改为原来的105%+5.
// @author       chenxx
// @match        *://www.hkmt.top*
// @run-at       document-end
// @grant        GM_setClipboard
// @license      chenxx
// @downloadURL https://update.greasyfork.org/scripts/470686/xiaomingzhaohuo.user.js
// @updateURL https://update.greasyfork.org/scripts/470686/xiaomingzhaohuo.meta.js
// ==/UserScript==

(function() {
    setTimeout(function(){
        var targettodo
        targettodo = document.querySelectorAll('.input')[1]
        let btn = document.createElement("button")
        btn.innerText = "复制3-3"
        btn.style.width = "40px"
        btn.style.height = "40px"
        let btn1 = document.createElement("button")
        btn1.innerText = "复制5-5"
        btn1.style.width = "40px"
        btn1.style.height = "40px"
        let btn2 = document.createElement("button")
        btn2.innerText = "品牌5-5"
        btn2.style.width = "40px"
        btn2.style.height = "40px"
        try {
            targettodo.appendChild(btn)
            targettodo.appendChild(btn1)
            targettodo.appendChild(btn2)
        } catch(e) {
            targettodo = document.querySelectorAll('.input')[0]
            targettodo.appendChild(btn)
            targettodo.appendChild(btn1)
            targettodo.appendChild(btn2)
        }

        function getInfor(pctNumber, plusNumber, removeSearch) {
            var aa
            var readyToCopy = ""
            aa = document.querySelectorAll('.inner-box2 .inner-box2-price')
            var i = 0
            var bb,cc,cc0, cc1
            //var myRe = /[1-9][0-9]*([\.][0-9]{1,2})?$/g
            for (;aa[i];){
                bb = aa[i].innerText //抗蓝光眼霜 对装新款- 230
                var myRe = /[1-9][0-9]*([\.][0-9]{1,2})?$/g
                cc = myRe.exec(bb) //(2) ['838', undefined, index: 30, input: '🟢谨慎价低·靠谱出货🟢 SK2大红瓶滋润面霜100ml 838', groups: undefined]
                cc0 = (Number(cc[0]).toFixed(0)*pctNumber + plusNumber).toFixed(0) // 230*1.05+5 然后取整
                cc1 = bb.substring(0,cc.index)//抗蓝光眼霜 对装新款-
                //开始添加取消各种表情、符号
                cc1 = cc1.replace(/[^\p{L}\p{N}.]/gu, '')
                cc1 = cc1.replaceAll('即提免等','').replaceAll('老档口','').replaceAll('取现','').replaceAll('不用等','').replaceAll('供货','').replaceAll('库房','').replaceAll('发货','')
                cc1 = cc1.replaceAll('一般贸易','').replaceAll('原箱','').replaceAll('源码','').replaceAll('只做','').replaceAll('正品','').replaceAll('低价','').replaceAll('保真','')
                cc1 = cc1.replaceAll('谨慎','').replaceAll('靠谱','').replaceAll('出货','').replaceAll('档口','').replaceAll('价低','').replaceAll('实体','').replaceAll('不收打包费','')
                //cc1 = cc1 + " " + String(cc0)
                readyToCopy = readyToCopy + cc1 + " " + String(cc0) + "\n"
                i++
            }

            var searchItem = ""
            searchItem = document.querySelector('.uni-input-input').value.toLowerCase()
            readyToCopy = readyToCopy.toLowerCase()
            if (removeSearch == 1) {
                var searchItemList = searchItem.split(/\s+/)
                var ii = 0
                for (; searchItemList[ii];) {
                    readyToCopy = readyToCopy.replaceAll(searchItemList[ii], '')
                    ii++
                }
            }
            readyToCopy = searchItem + "\n" + readyToCopy
            readyToCopy = readyToCopy + String(pctNumber)[3] + "-" + String(plusNumber)
            GM_setClipboard(readyToCopy)
            console.log('复制好了')
        }
        btn.addEventListener('click', (e)=>{
            getInfor(1.03, 3, 0)
        })
        btn1.addEventListener('click', (e)=>{
            getInfor(1.05, 5, 0)
        })
        btn2.addEventListener('click', (e)=>{
            getInfor(1.05, 5, 1)
        });
    },750);
})();