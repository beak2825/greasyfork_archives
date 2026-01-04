// ==UserScript==
// @name         zentao4HAT-3
// @namespace    http://www.akuvox.com/
// @version      1.2
// @description  take on the world!
// @author       andy.wang
// @match        http://192.168.10.17/zentao/testtask-browse-*.html*
// @match        http://zentao.akuvox.local/zentao/testtask-browse-*.html*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/481091/zentao4HAT-3.user.js
// @updateURL https://update.greasyfork.org/scripts/481091/zentao4HAT-3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    zentaoTable()
    // Your code here...
})();

async function zentaoTable() {
    if(window.location.href.includes('testtask-browse')){
        const userName = document.getElementById('userMenu').children[0].text.trim()

        const post = (test_order_id,is_review)=>{
            fetch('http://192.168.10.51:63183/posttesttask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    test_order_id,
                    is_review
                })
            })
        }

        const get = (test_order_id)=>{
            return new Promise(async (resolve)=>{
                const result = await fetch('http://192.168.10.51:63183/gettesttask?test_order_id='+test_order_id, {
                    method: 'GET',
                })
                try {
                    const res = await result.json()
                    resolve(res)
                } catch (e) {
                    resolve({is_review:0})
                }
            })
        }

        const header = document.getElementsByTagName("tr")[0].children

        let index

        Array.from(header).forEach((item,i)=>{
            const text = item.querySelector('a')?item.querySelector('a').text.trim():''
            if(text==='ID'){
                index = i
            }
        })

        const table = document.getElementsByTagName("tr")

        Array.from(table).forEach(async(item,i)=>{
            const th = Array.from(item.children)

            if(i===0){
                const lastNode = th[th.length-1]
                lastNode.style = "width:180px;text-align: center;"
            }else if(i!==table.length-1){
                if(th[index]){
                    let newNode
                    const id = th[index].querySelector('a')?th[index].querySelector('a').text.trim():''
                    if(!+id)return
                    const result = await get(id)

                    Array.from(item.children).forEach(td=>{
                        td.style="background: initial;"
                    })
                    if(result.is_review){
                        item.style = "background: #fea;"
                    }

                    const handle = th[th.length-1].children

                    handle[handle.length-1].innerHTML=result.is_review?"取消审核":"审核"

                    handle[handle.length-1].href="javascript:;"
                    handle[handle.length-1].addEventListener("click", function(){
                        if(handle[handle.length-1].innerHTML==='审核'){
                            handle[handle.length-1].innerHTML = '取消审核'
                            const msg = `确认当前测试单审核通过？`;
                            if (confirm(msg)==true){
                                post(id,1)
                                item.style = "background: #fea;"
                            }
                        }else{
                            handle[handle.length-1].innerHTML = '取消审核'
                            handle[handle.length-1].innerHTML = '审核'
                            const msg = `取消当前测试单审核？`;
                            if (confirm(msg)==true){
                                post(id,0)
                                item.style = ""
                            }
                        }



                    });



                }
            }
        })
    }
}
