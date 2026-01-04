// ==UserScript==
// @name         0xWho
// @namespace    https://github.com/jack-the-pug/0xwho
// @version      0.1
// @description  Sorry, 0x who?
// @author       JtP
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAS1BMVEUAAAC+Ngv/ckG/NQz/b0O/Ngz/cEO/Ng3/cEOrMAuyNQ+zNhCzNhG7PBW/NgzBQRrDQhvFRBzHRR7OSyLaUyr1aT34aj77bUD/cEOHzN+4AAAACXRSTlMALy+np/Ly9PT89qvQAAAAkklEQVR42uzVQwLDQABA0bodG/e/aB3b/Ou8aHRYUcfzlVJf2O1ySl1/p7QI/HokxZlWAX9JgGs1uCUArQZ+CrADgbFoAsC3+kD+gKwN0A+g2gD/AK4NxA+IYT76l0RIzmqkjeYQcm1qAqfAP+XqAEtAGLE1AAOxWA0AEjUG812iO2h+oDQ/sl4jplIkudodPgAA1tB1J/uFI7EAAAAASUVORK5CYII=
// @grant        none
// @match        https://*/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/446598/0xWho.user.js
// @updateURL https://update.greasyfork.org/scripts/446598/0xWho.meta.js
// ==/UserScript==

(function() {
    'use strict';

// ==== THIS IS YOUR ADDRESS BOOK ====
const addressBook = {
//  "address"                                     "name"
    "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045": "vitalik",
}
// ==== /END OF YOUR ADDRESS BOOK ====

class OXWHOInject{
    constructor(){
        this.addressMap = new Map()
        for(const address in addressBook){
            this.addressMap.set(address.toLowerCase(),{
                name:addressBook[address],
                address:address
            })
        }
        this.sourceDoms= new Map()
        this.formatAddressMap = new Map()
        this.addressMap.forEach(({name}, address) => {
            const formatAddress = this.replaceAddressByName(address,name).toLowerCase()
            this.formatAddressMap.set(address,formatAddress)
            this.formatAddressMap.set(formatAddress,address)
        })
        this.tooltipEl = document.createElement('div')
        this.tooltipEl.id = 'OXWHO-tip'
        this.tooltipTemplate = `
          <div>{{NAME}}</div>
        `
        this.init()
    }
    init(){
       this.injectStyle()
       window.addEventListener('load',() => {
        let timer = setTimeout(() => {
         this.changeDom()
         clearTimeout(timer)
        },1000)
       })
       document.addEventListener('selectionchange',() => this.handleSelectionchange())

       document.addEventListener('hashchange',this.changeDom)
       document.addEventListener('popstate',this.changeDom)
       document.addEventListener('pushstate',this.changeDom)

       let timer
       document.addEventListener('scroll',() => {
           if(timer) clearTimeout(timer)
           timer = setTimeout(() => {
               this.changeDom()
               clearTimeout(timer)
           },200)
       })
    }
    replaceAddressByName(address,name){
        const nameLen = name.length
        return nameLen <= 36 ? `0x${name}_${address.substring(nameLen + 3)}` : `0x${name.substring(0,35)}_${address.substring(38)}`
    }
    isAddress(text,strict = true){
        return strict ? /^0x[a-fA-F0-9]{40}$/.test(text) : /0x[a-fA-F0-9]{40}/g.test(text)
    }
     getAddressDoms(){
        const doms = document.querySelectorAll('* :not(script) :not(style) :not(a) :not(img) :not(input) :not(textarea) ')
        const nodeMap = new Map()
        doms.forEach((dom) => {
           let text = dom.textContent?.trim()
           if(!text || dom.childNodes.length !== 1 || dom.firstChild?.nodeName !== '#text') return
           // there can be multiple matches (addresses) in one element
           const textIter = text.matchAll(/0x[a-fA-F0-9]{40}/g)
           for(let matchRes of textIter){
             const address = matchRes[0]
             if(this.addressMap.has(address.toLowerCase())){
                // save the original address, for later revertion of the inline labeling edit
                dom.OXWHO_address = address
                nodeMap.set(dom, dom.textContent)
             }
           }
        })
        return nodeMap
    }
    changeDom(){
        const doms = this.getAddressDoms()
        this.sourceDoms = doms
        doms.forEach((text,node)=> {
            const matchTextAddress = text.matchAll(/0x[a-fA-F0-9]{40}/g)
            for(const matchRes of matchTextAddress){
                const address = matchRes[0]
                if(this.formatAddressMap.has(address.toLowerCase())){
                    const formatAddress = this.replaceAddressByName(node.OXWHO_address,this.addressMap.get(address.toLowerCase())?.name)
                    text= text.replace(address,formatAddress)
                }
            }
            node.textContent =text
        })
    }
    getSelectedMeta(){
        const selection = window.getSelection()
        if(!selection) return null
        let text = selection.toString().trim()
        if(!text && document.getElementById('OXWHO-tip')){
            document.body.removeChild(this.tooltipEl)
            return null
        }
        let el = selection.getRangeAt(0).startContainer
        if(el.nodeName === '#text' && el.nodeType === 3) el = el.parentElement
        return [text,el]
    }
    handleSelectionchange () {
        const selection = this.getSelectedMeta()
        if(!selection) return
        let [text,el] = selection
        if(this.isAddress(text)){
            text = text.toLowerCase()
            if(el.childNodes.length === 0) el = el.parentElement
            const position = this.getPosition(el)
            const profile = this.addressMap.get(text.toLowerCase())
            this.addTooltip(position,profile)
            return
        }

        if(!this.formatAddressMap.has(text.toLowerCase())) return
        const address = this.formatAddressMap.get(text.toLowerCase())

        if (this.isAddress(address)) {
            // @ts-ignore
            // must use textContent to replace
            el.textContent = el.textContent?.replace(text, el.OXWHO_address)
            const selc = window.getSelection()
            selc?.removeAllRanges()
            const range = document.createRange()
            range.selectNode(el)
            selc?.addRange(range)
        }
    }
    addTooltip(position, profile){
        const {x,y,w} = position
        this.tooltipEl.style.left = `${x + w/2}px`
        this.tooltipEl.style.top = `${y}px`
        this.tooltipEl.innerHTML = this.tooltipTemplate.replace('{{NAME}}',profile.name)
        document.body.appendChild(this.tooltipEl)
   }
   getPosition(el){
    const rect = el.getBoundingClientRect()
    const style = window.getComputedStyle(el)
    return {
        y: rect.y + window.scrollY + rect.height - parseFloat(style.paddingBottom),
        x: rect.x + window.scrollX + parseFloat(style.paddingLeft),
        h: rect.height,
        w: rect.width
    }
   }
   injectStyle(){
       const style = document.createElement('style')
       style.textContent = `
        #OXWHO-tip{
            position:absolute;
            z-index: 2147483647;
            background: rgba(253,230,138,0.8);
            padding: 4px 5px;
            color: black;
            border-radius: 4px;
            margin-top: 5px;
            font-weight: 500;
            font-size: 13px;
        }
       `
       document.head.appendChild(style)
   }
}


new OXWHOInject()

})()