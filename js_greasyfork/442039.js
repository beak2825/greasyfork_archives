// ==UserScript==
// @name         copy AV id
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  copy the AV id
// @author       Schwi
// @match        https://ff5121.com/*
// @match        https://www.seejav.work/*
// @match        http://dmmland.com/*
// @icon         https://avatars.githubusercontent.com/u/39186981
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/442039/copy%20AV%20id.user.js
// @updateURL https://update.greasyfork.org/scripts/442039/copy%20AV%20id.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload=function(){
        console.log('start')
        // Javbooks
        document.querySelectorAll('.Po_topic_Date_Serial').forEach(ele=>{
            let texts = ele.innerText.split('/')
            let btn = document.createElement('button')
            btn.innerText = 'copy'
            btn.addEventListener('click',event=>{
                GM_setClipboard(texts[0])
            })
            ele.appendChild(btn)
        })
        document.querySelectorAll('#title').forEach(ele=>{
            let text = ele.innerText
            let btn = document.createElement('button')
            btn.innerText = 'copy'
            btn.addEventListener('click',event=>{
                GM_setClipboard(text)
            })
            ele.appendChild(btn)
        })
        document.querySelectorAll('.infobox a').forEach(ele=>{
            let text = ele.innerText
            let btn = document.createElement('button')
            btn.innerText = 'copy'
            btn.addEventListener('click',event=>{
                GM_setClipboard(text)
            })
            ele.parentNode.appendChild(btn)
        })
        document.querySelectorAll('.Po_topic,.Po_topic_Date_Serial').forEach(ele=>{
            let h = parseInt(window.getComputedStyle(ele).getPropertyValue('height')) + 20
            ele.style.height = h
        })

        // JavBus
        document.querySelectorAll('.info>*>:not(.header)').forEach(ele=>{
            let text = ele.innerText
            let btn = document.createElement('button')
            btn.innerText = 'copy'
            btn.addEventListener('click',event=>{
                GM_setClipboard(text)
            })
            ele.parentElement.appendChild(btn)
        })
        document.querySelectorAll('.container>h3').forEach(ele=>{
            let text = ele.innerText
            let btn = document.createElement('button')
            btn.innerText = 'copy'
            btn.addEventListener('click',event=>{
                GM_setClipboard(text)
            })
            ele.appendChild(btn)
        })
        document.querySelectorAll('.photo-info').forEach(ele=>{
            let childs = ele.children[0].children
            if (childs.length==0){
                return
            }
            let date = childs[childs.length-2]
            let text = date.innerText
            let btn = document.createElement('button')
            btn.innerText = 'copy'
            btn.addEventListener('click',event=>{
                GM_setClipboard(text)
            })
            ele.appendChild(btn)
        })

        // JAV.Land
        document.querySelectorAll('.bsid,.col-xs-12>strong').forEach(ele=>{
            let text = ele.innerText
            let btn = document.createElement('button')
            btn.innerText = 'copy'
            btn.addEventListener('click',event=>{
                GM_setClipboard(text)
            })
            ele.appendChild(btn)
        })
        let ele3 = document.querySelector('.videotextlist.table.table-bordered.table-hover')
        if (ele3){
            let eles = ele3.children[0].children
            for (let i = 0; i<eles.length; i++){
                let ele = eles[i]
                console.log(ele)
                let text = ele.children[1].innerText
                let btn = document.createElement('button')
                btn.innerText = 'copy'
                btn.addEventListener('click',event=>{
                    GM_setClipboard(text)
                })
                ele.appendChild(btn)
            }
        }
        console.log('end')
    }
})();