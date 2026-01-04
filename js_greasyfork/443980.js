// ==UserScript==
// @name         Pixiv Following Transfer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  用于Pixiv关注迁移
// @author       luosansui
// @match        *://www.pixiv.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443980/Pixiv%20Following%20Transfer.user.js
// @updateURL https://update.greasyfork.org/scripts/443980/Pixiv%20Following%20Transfer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(/users\/\d+\/following/.test(window.location.href)){
        const i= setInterval(()=>{
            if(document.querySelector('.itSEaW')){
                const page = window.location.href.match(/users\/(\d+)\/following.*p=(\d+)/) || ['','','1']
                console.log('当前page',page[2])
                if(page[2] == '1'){
                    if(confirm('确认开始记录')){
                        localStorage.setItem('tempTransferKey',[])
                    }else{
                        clearInterval(i)
                        return
                    }
                }
                clearInterval(i)
                let localKey = JSON.parse(localStorage.getItem('tempTransferKey')|| '[]')
                const key = Array.from((document.querySelectorAll('.itSEaW'))).map(e=>e.querySelector('a').href.split('https://www.pixiv.net/users/')[1])
                localStorage.setItem('tempTransferKey',JSON.stringify([...localKey,...key]))
                const enter = confirm(`Page: ${page[2]},已保存: \n${key.join('\n')}\n共${ key.length }个,目前已保存: ${(localKey.length + key.length) / 24} * 24个`)
                if(!enter){
                    alert('停止')
                    return
                }
                window.location.href = window.location.href.replace(/p=\d+/,`p=${page[2] - 0 + 1}`)
            }else if(document.querySelector('.hNFKtM') && document.querySelector('.hNFKtM').innerText === '您尚未关注任何人'){
                clearInterval(i)
                alert('已到末尾，请直接切换账号登录')
            }
        },1000)
        }else if(`https://www.pixiv.net/` === window.location.href && localStorage.getItem('tempTransferKey') && !document.querySelector('.signup-form__submit')){
            const array = JSON.parse(localStorage.getItem('tempTransferKey'))
            localStorage.removeItem('tempTransferKey')
            localStorage.setItem('#tempTransferKey',JSON.stringify(array))
            if(confirm('确认开始同步')){
                ;(async()=>{
                    for (const [index,id] of array.entries()) {
                        console.log(index)
                        localStorage.setItem('tempTransferFollow','')
                        await new Promise(res=>setTimeout(()=>res(),2000))
                        window.open(`https://www.pixiv.net/users/${id}`,'_blank')
                        await new Promise(res=>{
                            const f = setInterval(()=>{
                                if(localStorage.getItem('tempTransferFollow')){
                                    clearInterval(f)
                                    res()
                                }
                            },500)
                            })
                    }
                    localStorage.removeItem('tempTransferFollow')
                    localStorage.removeItem('#tempTransferKey')
                    alert('同步完成')
                })()
            }
        }else if(/^https:\/\/www\.pixiv\.net\/users\/\d+/.test(window.location.href)){
            const f = setInterval(async ()=>{
                const text = document.querySelector('.bjEbrm>button')?.innerText
                console.log(text)
                if(document.querySelector('.bjEbrm>button') && /关注/.test(text)){
                    clearInterval(f)
                    text === '加关注' && document.querySelector('.bjEbrm>button').click()
                    await new Promise(res=>setTimeout(()=>res(),3000))
                    window.opener=null;
                    window.open('','_self')
                    window.close()
                    localStorage.setItem('tempTransferFollow','ok')
                }
            },500)
            }
})();