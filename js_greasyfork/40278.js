// ==UserScript==
// @name         愉快地阅读 Nodejs API
// @version      1.0.5
// @description  View the Nodejs API more comfortably
// @author       You
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @match        https://nodejs.org/docs/*
// @grant        GM_addStyle
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/40278/%E6%84%89%E5%BF%AB%E5%9C%B0%E9%98%85%E8%AF%BB%20Nodejs%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/40278/%E6%84%89%E5%BF%AB%E5%9C%B0%E9%98%85%E8%AF%BB%20Nodejs%20API.meta.js
// ==/UserScript==
(()=>{
    const apiContainer = document.querySelector('#toc')

    if (!isInPage(apiContainer)){
        return;
    }

    const apiTree = apiContainer.querySelector('ul')

    if(!isInPage(apiTree)){
        return;
    }

    const handShank = document.createElement('div')
    const arrowRight = document.createTextNode('>>')

    let status = true // true:open; false:close
    let apiContainerWidth = 0
    let handShankWidth = 32

    let apiContainerStyle = `
    position:fixed;
    z-index:10;
    right:0;
    top:0;
    height:100%;
    padding:10px;
    background-color:#fff;
    padding-bottom:60px;
    box-shadow:-20px 20px 60px #bebebe;
`

    let apiTreeStyle = `
    height:100%;
    overflow-y:scroll;
`

    let handShankStyle = `
    position:absolute;
    top:50%;
    left:0;
    margin-top:-150px;
    width:2rem;
    height:300px;
    line-height:300px;
    text-align:center;
    cursor:pointer;
    background-color:rgb(255, 153, 0);
    -webkit-font-smoothing: antialiased;
    border-radius:0 10px 10px 0;
    color:#fff;
`
    const scrollbarStyle = `
      .scrollbar::-webkit-scrollbar {
        width: 10px;
      }
      .scrollbar::-webkit-scrollbar-track{
          background:rgba(213, 222, 255,0.3);
          border-radius:8px;
      }
      .scrollbar::-webkit-scrollbar-thumb{
          background: rgba(213, 222, 255,0.8);
          border-radius:8px;
      }
    `

    GM_addStyle(scrollbarStyle)

    handShank.style.cssText = handShankStyle
    apiContainer.style.cssText = apiContainerStyle
    apiTree.style.cssText = apiTreeStyle
    apiTree.className = 'scrollbar'

    handShank.appendChild(arrowRight)
    apiContainer.appendChild(handShank)

    // after position:fixed get the real width
    apiContainerWidth = apiContainer.clientWidth

    handShank.addEventListener('click', function (params) {
        if (status) {
            apiContainer.style.cssText = `${apiContainerStyle};right:-${apiContainerWidth - handShankWidth}px`
            handShank.textContent = '<<'
            status = false
        } else {
            apiContainer.style.cssText = apiContainerStyle
            handShank.textContent = '>>'
            status = true
        }
    }, true)

})()

// check node is exist
function isInPage(node){
    return document.body.contains(node)
}