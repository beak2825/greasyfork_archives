// ==UserScript==
// @name         gitlabreview4HAT
// @namespace    http://www.akuvox.com/
// @version      1.6
// @description  take on the world!
// @author       andy.wang
// @match        http://gitlab.fz.akubela.local/users/*/activity
// @match        http://192.168.13.20/users/*/activity
// @match        http://gitlab.xm.akubela.local/users/*/activity
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/467933/gitlabreview4HAT.user.js
// @updateURL https://update.greasyfork.org/scripts/467933/gitlabreview4HAT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    gitFilter()

})();

function gitFilter(){
    let timer

    let tIndex = 0

    const newNode = document.createElement("div");
    newNode.style = "width: 100px;position: fixed;top: 30vh;right: 20px;background: #ffea2e;border-radius: 8px;padding: 10px;font-weight:700;z-index: 500;"

    const newUl = document.createElement("ui")

    const newLi1 = document.createElement("li")
    newLi1.style = 'list-style: none;margin: 0;'

    const label1 = document.createElement("label")

    const input1 = document.createElement("button")

    input1.innerHTML = '清除'

    input1.style = 'vertical-align: middle;margin-right:5px;border: none;width: 80px;height: 30px;background: #fff;border-radius: 10px;'

    input1.addEventListener('click', function(e) {
        clearItem()
    });

    label1.appendChild(input1)

    newLi1.appendChild(label1)

    newNode.appendChild(newLi1)

    newNode.appendChild(newUl)
    document.body.appendChild(newNode)

    function clearItem (){

        const list = document.getElementsByClassName('event-item')
        Array.from(list).forEach(item=>{
            item.getElementsByTagName('time')[0].innerText = ''
            if(timer){
                clearInterval(timer)
                timer=null
            }
            const type = item.getElementsByClassName('event-type')[0]

            const isMerge = type&&type.innerText.includes('Opened')
            let isPush = type&&type.innerText.includes('Pushed')

            if(isPush){
                const mergeItem = item.getElementsByClassName('commit-row-title')
                if(mergeItem.length){
                    isPush = !mergeItem[0].innerText.includes('Merge branch')
                }
            }

            if(!isPush){
                item.parentNode.removeChild(item)
            }
            if(isMerge||isPush){
                const time = item.getElementsByTagName('time')[0].dateTime.split('T')[0]
                item.getElementsByTagName('time')[0].innerText = time
            }

        })
 
    }
}