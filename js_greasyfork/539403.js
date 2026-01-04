// ==UserScript==
// @name         Fuhrerschein Gold WebApp Mobile Friendly
// @version      1
// @grant        none
// @match        https://t24.theorie24.de/*
// @description  Adapts Fuhrerschein Gold web app for mobile displays
// @namespace    asleepysamurai.com
// @license      BSD Zero Clause License
// @downloadURL https://update.greasyfork.org/scripts/539403/Fuhrerschein%20Gold%20WebApp%20Mobile%20Friendly.user.js
// @updateURL https://update.greasyfork.org/scripts/539403/Fuhrerschein%20Gold%20WebApp%20Mobile%20Friendly.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const questionSelectorOpen = false

    const redirectIframe = ()=>{
        const iframe = document.querySelector('iframe')

        if(!iframe){
            return
        }

        const url = iframe.getAttribute('src')
        window.location.href = window.location.href + url
    }

    const restyleApp = ()=>{
        const styles = new CSSStyleSheet();
        // language=CSS
        styles.replaceSync(`
        #app {
            width: 100vw;max-width: 100vw;min-width: auto;
        }
        .enyo-touch-scroller,
        div[id^=app_TestingPage_CoreTestingDisplay_control]{
            overflow: auto !important;
        }
        div[id^=app_TestingPage_CoreTestingDisplay_][id$=qpic]{
          max-width: 100% important;
          padding-left: 0 !important;
        }
        #app_TestingPage_CoreTestingDisplay_control > div > div > div > div > div > div img:first-child[id$=picimg]{
           width: 100% important;
        }

        `);
       document.adoptedStyleSheets = [...document.adoptedStyleSheets, styles];
    }

    const handleBackButton = ()=>{
        const button = document.querySelector('#app_ChapterPage_PageFooter_buttonback')
        if(!button){
            return
        }

        if(questionSelectorOpen){
            const clonedButton = button.cloneNode(true)
            clonedButton.addEventListener('click',()=>{
                console.log('1')
                questionSelectorOpen = false
                document.querySelector('#app_ChapterPage_ClientArea').classList.remove('questions')

                clonedButton.remove()
                button.setAttribute('display','inline-block')
            })
            button.after(clonedButton)
            button.setAttribute('display','none')
        }
    }

    const handleChapterSelector = ()=>{
                console.log('2')

        const divs = Array.from(document.querySelectorAll('#app_ChapterPage_catTree_Scroller div'))
        divs.forEach(div=>{
                console.log(div.getAttribute('id'))
            div.addEventListener('click',()=>{
                console.log('2')
                questionSelectorOpen = true
                document.querySelector('#app_ChapterPage_ClientArea').classList.add('questions')
                handleBackButton()
            })
        })
    }

    const init = ()=>{
        redirectIframe()
        restyleApp()
        //handleChapterSelector()
    }

    init()
})();