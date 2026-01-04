// ==UserScript==
// @name         ChatPDF
// @namespace    http://tampermonkey.net/
// @version      1.3.2
// @description  transform your chatgpt's answer to PDF
// @author       You
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ensky.tech
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/502142/ChatPDF.user.js
// @updateURL https://update.greasyfork.org/scripts/502142/ChatPDF.meta.js
// ==/UserScript==

(function() {
    'use strict';

 const observer = new MutationObserver((mutationsList, observer) => {

        for(let mutation of mutationsList) {// iterate the mutation
            if(mutation.type == "childList") {// focus on childList event
                if(ifBtnExist()) { // check the buttom button if exist
                }else {
                    const submitBtn = getSubmitButton()
                    const selectAllBtn = getSelectAllButton()
                    const cancelAllBtn = getCancelAllButton()
                    // mount the button
                    const parent = document.querySelector('.md\\:pt-0.dark\\:border-white\\/20.md\\:border-transparent.md\\:dark\\:border-transparent.w-full')
                    const firstChild = parent.firstChild
                    parent.insertBefore(selectAllBtn, firstChild)
                    parent.insertBefore(cancelAllBtn, firstChild)
                    parent.insertBefore(submitBtn, firstChild)
                }
    
                // iterate the Q and A
                const elements = document.querySelectorAll('article')
    
                if(elements.length!==0) {
                    elements.forEach((element, index) => {
                        if(element.children[1].children[0].children[0].tagName=="INPUT") {
                            // special case, sometimes the first question's input box will occur in left side
                            if( index==0 && element.children[1].children[0].children[0].style.left=="10px") {
                                element.children[1].children[0].children[0].style.left = "780px"
                                element.children[1].children[0].children[0].style.top = "13px" 
                            }
                            return
                        }
                        const checkbox = getCheckBox(index)
                        element.children[1].children[0].prepend(checkbox)
                    })
                }
            }
        }
    })
    
    
    const targetNode = document.querySelector('main')
    
    observer.observe(targetNode, { 
        childList: true, 
        subtree: true,
        attributes: true,
        characterData: true 
    })
    
    /**
     * create the checkbox
     */
    function getCheckBox(index) {
        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.checked = true
        checkbox.style.position = "relative"
        checkbox.style.top = "8px"
        checkbox.style.left = "10px"
        if(index % 2 == 0) {
            checkbox.style.left = "780px"
            checkbox.style.top = "13px" 
        }
        return checkbox
    }
    
    
    /**
     * create the submit button
     */
    function getSubmitButton() {
        let submitBtn = document.createElement('button')
        submitBtn.textContent = "Transform to PDF"
        
        submitBtn.style.all = 'unset'
        submitBtn.style.display = 'inline-block'
        submitBtn.style.padding = '2px 6px'
        submitBtn.style.border = '1px solid black'
        submitBtn.style.backgroundColor = 'white'
        submitBtn.style.cursor = 'pointer'
        submitBtn.style.fontFamily = 'inherit'
        submitBtn.style.fontSize = 'inherit'
        submitBtn.style.lineHeight = 'inherit'
        submitBtn.style.position = 'relative'
        submitBtn.style.marginLeft = '20px'
        
        submitBtn.addEventListener('click', ()=> {
            output()
        })
    
        return submitBtn
    }
    
    function getSelectAllButton() {
        let selectAllBtn = document.createElement('button')
        selectAllBtn.textContent = "Select All"
        
        selectAllBtn.style.all = 'unset'
        selectAllBtn.style.display = 'inline-block'
        selectAllBtn.style.padding = '2px 6px'
        selectAllBtn.style.border = '1px solid black'
        selectAllBtn.style.backgroundColor = 'white'
        selectAllBtn.style.cursor = 'pointer'
        selectAllBtn.style.fontFamily = 'inherit'
        selectAllBtn.style.fontSize = 'inherit'
        selectAllBtn.style.lineHeight = 'inherit'
        selectAllBtn.style.position = 'relative'
        selectAllBtn.style.marginLeft = '200px'
        
        selectAllBtn.addEventListener('click', ()=> {
            selectAll()
        })
    
        return selectAllBtn
    
    }
    function getCancelAllButton() {
        let cancelAllBtn = document.createElement('button')
        cancelAllBtn.textContent = "Cancel All"
        
        cancelAllBtn.style.all = 'unset'
        cancelAllBtn.style.display = 'inline-block'
        cancelAllBtn.style.padding = '2px 6px'
        cancelAllBtn.style.border = '1px solid black'
        cancelAllBtn.style.backgroundColor = 'white'
        cancelAllBtn.style.cursor = 'pointer'
        cancelAllBtn.style.fontFamily = 'inherit'
        cancelAllBtn.style.fontSize = 'inherit'
        cancelAllBtn.style.lineHeight = 'inherit'
        cancelAllBtn.style.position = 'relative'
        cancelAllBtn.style.marginLeft = '20px'
        
        cancelAllBtn.addEventListener('click', ()=> {
            cancelAll()
        })
    
        return cancelAllBtn
    
    }
    
    function cancelAll() {
        const elements = document.querySelectorAll('article')
    
        if(elements.length!==0) {
            elements.forEach((element, index) => {
                element.children[1].children[0].children[0].checked = false
            })
        }
    }
    
    function selectAll() {
        const elements = document.querySelectorAll('article')
    
        if(elements.length!==0) {
            elements.forEach((element, index) => {
                element.children[1].children[0].children[0].checked = true
            })
        }
    }
    
    /**
     * transform the div element to PDF
     */
    function output() {
        const div = collect()
        div.style.pageBreakInside = "avoid" /* avoid paging inside the element */
    
        let opt = {
            margin:       [0.5, -0.3, 0, 0],
            filename:     'my-document.pdf',
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' },
            pagebreak:    { mode: ['avoid-all'] }
          }
    
        html2pdf().from(div).set(opt).save()
    }
    
    /**
     * iterte the Q and A then collect to a div element
     */
    function collect() {
        const DIV = document.createElement("div")
        // 遍历回答和问题
        const elements = document.querySelectorAll('article')
        if(elements.length!==0) {
            elements.forEach((element, index) => {
                if(element.children[1].children[0].children[0].tagName=="INPUT") {
                    if (element.children[1].children[0].children[0].checked == true) {
                        // 收集整个元素后清除input
                        const newNode = element.cloneNode(true)
                        newNode.children[1].children[0].children[0].style.display='none'
                        DIV.append(newNode.children[1]) // matter
                    }
                }
            })
        }
        return DIV
    }
    
    /**
     * check if the button exist
     */
    function ifBtnExist() {
        const parent = document.querySelector('.md\\:pt-0.dark\\:border-white\\/20.md\\:border-transparent.md\\:dark\\:border-transparent.w-full')
        const firstChild = parent.firstChild
        if(firstChild.tagName == 'BUTTON') {
            return true
        }else {
            return false
        }
    }


})();