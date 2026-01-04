// ==UserScript==
// @name         EZ-Blurb
// @namespace    http://tampermonkey.net/
// @version      V0.3
// @description  EZ-Blurb will save your time with frequently used blurbs.
// @author       Amin Ahmadizadeh
// @match        https://omnia.it.a2z.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=a2z.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521828/EZ-Blurb.user.js
// @updateURL https://update.greasyfork.org/scripts/521828/EZ-Blurb.meta.js
// ==/UserScript==

(function() {
    cardNumbers = 0
    let cardsObjects = []
    let blurbs = []
    'use strict';
    setTimeout(start,10000)
    class Card{
        constructor(card){
            console.log("EZB->Creating Card Object", card)
            this.card = card
            this.customerName = document.querySelectorAll(".editable-contact-alias")[0].innerText.split(" ")[0]
            this.card.loaded = true
            this.blurbDiv = document.createElement("div")
            this.blurbDiv.style.marginTop = '-10px'
            this.card.appendChild(this.blurbDiv)
            this.addButtons()
        }

        addButtons(){
            if (blurbs.length > 0)
                blurbs.forEach((blurb)=>{
                    this.addButton(blurb.symb, blurb.tooltip, blurb.text, blurb.backColor, blurb.textColor)
            })
        }

        sendMessage(text){
            localStorage.setItem("EZBMessage",text);
            console.log("Sending messgage...")
            const iframe = document.querySelector("iframe")
            iframe.contentWindow.postMessage("EZB" + text, 'https://itservices-connect.my.connect.aws/ccp-v2');
        }

        addButton(symb,tooltip,text,backColor,textColor){
            var div = document.createElement("SPAN")
            div.innerText = symb
            div.style.display = 'inline-block'
            div.style.padding = '0px 5px'
            div.style.borderRadius = "10px"
            div.style.margin = "1px"
            div.style.backgroundColor = backColor
            div.style.color = textColor
            div.title = tooltip
            this.blurbDiv.appendChild(div)
            div.addEventListener('click',()=>{this.sendMessage(this.compileText(text))})
            div.addEventListener('mouseover',()=>{
                div.style.backgroundColor = 'red'
            })
            div.addEventListener('mouseout',()=>{
                div.style.backgroundColor = backColor
                div.style.color = textColor
                div.style.padding = '0px 5px'
                div.innerHTML = symb
            })
        }
        
        compileText(text){
                var customerName = document.querySelectorAll(".editable-contact-alias")[0].innerText.split(" ")[0]
                return text.replace("$customer$", customerName)
            }
    }

    class Blurb{
        constructor(symb, tooltip, text, backColor, textColor){
            this.symb = symb
            this.tooltip = tooltip
            this.text = text
            this.backColor = backColor
            this.textColor = textColor
        }
    }

    function readBlurbs(){
        console.log("Reading blurbs...")
        savedBlurbs =  localStorage.getItem('EZBlurbs')
        const inputBtn = document.createElement("input")
        inputBtn.type= "file"
        inputBtn.multiple = false
        inputBtn.style.display = 'None'
        inputBtn.addEventListener('change',(event)=>{
            const file = event.target.files[0]
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    blurbsJSON = JSON.parse(e.target.result)
                    makeBlurbs(blurbsJSON.Blurbs, true)
                };
                reader.readAsText(file);
            }
        })
        const btn = document.createElement("input")
        btn.type = 'button'
        btn.className = 'awsui-button awsui-button-variant-normal awsui-hover-child-icons'
        btn.value= "Load EZ-Blurbs"
        btn.addEventListener('click',()=>{
            inputBtn.click()
        })
        document.getElementsByClassName("omnia-ui-tabtools")[0].appendChild(btn)
        if ( savedBlurbs ) {
            console.log ('Blurbs found:', localStorage.getItem("EZBlurbs"))
            makeBlurbs(JSON.parse(localStorage.getItem("EZBlurbs")), false)        
        }
    }

    function makeBlurbs(blurbsJSON, save) {
        for (i=0; i< blurbsJSON.length; i++){
            let blurbJSON = blurbsJSON[i]
            symb = blurbJSON.symbol
            tooltip = blurbJSON.tooltip
            text = blurbJSON.text
            backColor = blurbJSON.backColor
            textColor = blurbJSON.textColor
            blurbs.push(new Blurb(symb,tooltip,text,backColor, textColor))
            if (save)
                localStorage.setItem("EZBlurbs", JSON.stringify(blurbsJSON))
            }
    }

    function extractCards (mainContainer){
        cardsDivs = mainContainer.children[1].firstChild.firstChild.children
        cardsDivs = [...cardsDivs]
        return cardsDivs
    }

    function start(){
        console.log("EZBlurbs V0.1 started.")
        readBlurbs()
        var observer = new MutationObserver(function (mutations){
            const mainContainer = document.querySelector('.contact-queue-card-list-all-contacts')
            if (mainContainer) {
                console.log("Observig Contacts...")
                observer.observe(mainContainer,{
                    childList: true,
                    subtree: true,
                    })
                let cards = extractCards(mainContainer)
                cards.forEach(card => { 
                    if (!card.loaded){
                        if (card.children.length != 0)
                            cardsObjects.push(new Card(card))
                    }
                })
            }
        })
        const cqcl=document.querySelector('#contact-queue-card-list')
        observer.observe(cqcl,{
                            childList: true,
                            subtree: true,
                        })
    }
})();