// ==UserScript==
// @name         Baidu Masonry
// @namespace    ChocoY
// @version      0.5
// @description  change Baidu search result page into masonry layout
// @author       ChocoY
// @match        https://www.baidu.com/s*
// @icon         https://www.google.com/s2/favicons?domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426744/Baidu%20Masonry.user.js
// @updateURL https://update.greasyfork.org/scripts/426744/Baidu%20Masonry.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let content = document.querySelector('#content_left')
    let container

    let left = 76,right = 76
    let cardWidth = 590 // search result card width

    function masonry(){

        left= 81
        right = 81

        let tabIndex = getTabIndex()
        switch(tabIndex){
            case 0:
                container = document.querySelector('#content_left')
                break
            default:
                return
        }

        content.style.height = content.offsetHeight + 'px'

        for(let i =0;i <container.children.length;i++){
            let e = container.children.item(i)

            if(e.nodeName != 'DIV'){
                continue
            }

            if(e.classList.contains('result-molecule') || e.classList.contains('hit-toptip')){
                continue
            }

            e.style.visibility = 'hidden'
            e.style.top = e.offsetTop
            e.style.left = e.offsetLeft
            e.style.position = 'absolute'
        }

        for(let i =0;i <container.children.length;i++){
            let e = container.children.item(i)


            if(e.nodeName != 'DIV'){
                continue
            }

            if(e.classList.contains('result-molecule') || e.classList.contains('hit-toptip')){
                left += 62
                right += 62
                continue
            }

            placeItem(e)
        }
        setTimeout(()=>{
            content.style.height = `${(left > right ? left: right) - 20}px`
        }, container.children.length * 100)
    }

    var itemIdx = 0

    function placeItem(n){
        n.style.width=`${cardWidth}px`

        let leftStr = ''
        let topStr = ''
        if(left <= right){
            leftStr = `calc((100vw - 2 * ${cardWidth}px) / 3 - 30px)`
            topStr = `${left - n.offsetTop}px`
            left += n.offsetHeight + 5
        } else {
            leftStr= `calc((50vw + (100vw - 2 * ${cardWidth}px) / 6 - 30px))`
            topStr = `${right - n.offsetTop}px`
            right += n.offsetHeight + 5
        }
        setTimeout(()=>{
            n.style.left = leftStr
            n.style.top = topStr
            n.style.visibility = 'unset'
        },100 * itemIdx++ )

    }

    function getTabIndex(){
       let tab = document.querySelector('.cur-tab')

       let i = 0
       for(let e of tab.parentElement.children){
           if(e.className.includes('cur-tab')){
               return i
           }
           i++
       }
    }
    masonry()
    content.onload= masonry

})();