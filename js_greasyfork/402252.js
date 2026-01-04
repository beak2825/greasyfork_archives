// ==UserScript==
// @name         Coolpc Search
// @namespace    https://github.com/lovebuizel
// @version      v1.1.3
// @description  原價屋快速搜尋套件-可以快速搜尋商品和儲存歷史搜尋紀錄
// @author       lovebuizel
// @match        *://www.coolpc.com.tw/evaluate.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402252/Coolpc%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/402252/Coolpc%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';
    class Coolpc {
        constructor() {
            this.keyword = ""
            this.keywords = []
            this.selecteds = []
            this.records = JSON.parse(localStorage.getItem('coolpc')) || [];
            this.input = null
            this.details = ''
            this.isOpenDetails = JSON.parse(localStorage.getItem('coolpc_isOpenDetails')) || false
            this.isAutoAddResults = JSON.parse(localStorage.getItem('coolpc_isAutoAddResults')) === null ? true : JSON.parse(localStorage.getItem('coolpc_isAutoAddResults'))
            this.searchResultOptions = []
            this.minPrice = null
            this.maxPrice = null
        }

        init() {
            this.clearAd()
            this.addUI()
            this.removeOriginalEventListener()
        }

        addUI() {
            const fDiv_table = document.querySelector('#fDiv table')
            const div = document.createElement("div")
            div.setAttribute('style', `
width:100%;
background:#FFCA62;
`)
            div.innerHTML = `
<div class="details" style="max-height:40vh;overflow:auto;height:${this.isOpenDetails ? '100%' : '0'};">
<ul style="list-style:none;padding-left:0px;overflow:hidden;margin:0;"></ul>
</div>
<div style="display:flex;align-items:center;justify-content:flex-start;margin-top:5px;">
<span class="openDetails" style="margin-left:20px;margin-right:20px;display:flex;align-items:center;cursor:pointer;color:blue;user-select:none;">
<span style="font-size:15pt;" class="signOpenDetails">${this.isOpenDetails ? '&minus;' : '&plus;'}</span>
<span style="margin-left:5px;">全部搜尋結果</span>
</span>
<div class="autoAddResults" style="display:flex;align-items:center;cursor:pointer;user-select:none;margin-right:20px;">
<div class="autoAddResults_div" style="
width:15px;
height:15px;
background:white;
border:1px solid black;
display:flex;
justify-content:center;
align-items:center;
"></div>
<span style="margin-left:5px;">搜尋後自動填入</span>
</div>
<input type="text" spellcheck="false" class="minPrice" style="width:70px;height:20px;padding-left:3px;flex-shrink:0;user-select:none;">
<span style="margin-left:5px;margin-right:5px;">~</span>
<input type="text" spellcheck="false" class="maxPrice" style="width:70px;height:20px;padding-left:3px;flex-shrink:0;user-select:none;">
<span style="margin-left:5px;">價格區間內</span>
</div>
`
            fDiv_table.appendChild(div)
            const divDetails = document.querySelector(".details")
            divDetails.addEventListener('click', this.clickDetails.bind(this))

            const openDetails = document.querySelector('.openDetails')
            const signOpenDetails = document.querySelector('.signOpenDetails')
            openDetails.addEventListener('click', () => {
                this.isOpenDetails = !this.isOpenDetails
                signOpenDetails.innerHTML = `${this.isOpenDetails ? '&minus;' : '&plus;'}`
                divDetails.style.height = `${this.isOpenDetails ? '100%' : 0}`
                localStorage.setItem('coolpc_isOpenDetails', this.isOpenDetails)
            })
            
            // 價格篩選
            this.minPrice = document.querySelector('.minPrice')
            this.maxPrice = document.querySelector('.maxPrice')
            this.minPrice.addEventListener('input', this.checkPrice.bind(this))
            this.maxPrice.addEventListener('input', this.checkPrice.bind(this))

            const divSearch = document.createElement("div")
            divSearch.setAttribute('style', `
width:100%;
height:40px;
background:#FFCA62;
display:flex;
align-items:center;
justify-content:flex-start;
`)
            divSearch.innerHTML = `
<img src="https://i.imgur.com/aXfbfwd.png" style="width:15px;height:15px;margin-right:5px;margin-left:20px;user-select:none;"></img>
<input class="input" type="text" placeholder="e.g., R5 3600" spellcheck="false" style="width:250px;height:25px;padding-left:5px;flex-shrink:0;user-select:none;">
<button class="btn" style="
    height:25px;
    color:black;
    user-select:none;
    border-width:2px;
    border-style:outset;
    border-color:buttonface;
    border-image:initial;
    border-radius:0;
    background-color:buttonface;
    cursor:pointer;
">GO</button>
<ul class="records" style="display:flex;list-style:none;padding-left:20px;overflow:hidden;align-items:center;"></ul>`
            fDiv_table.appendChild(divSearch)
            this.input = document.querySelector(".input")
            this.input.focus()
            const btn = document.querySelector(".btn")
            const records = document.querySelector(".records")
            btn.addEventListener('click', () => {
                this.keyword = this.input.value
                this.search()
            })
            this.input.addEventListener('keydown', (e) => {
                if (e.keyCode === 13 || e.KeyCode === 13) {
                    this.keyword = this.input.value
                    this.search()
                }
            })
            records.addEventListener('click', this.clickRecords.bind(this))

            const autoAddResults_div = document.querySelector('.autoAddResults_div')
            autoAddResults_div.innerHTML = this.isAutoAddResults ? '&check;' : ''

            const autoAddResults = document.querySelector('.autoAddResults')
            autoAddResults.addEventListener('click', this.clickAutoAddResults_div.bind(this))

            this.updateRecords()
        }

        search() {
            // 重置
            this.selecteds.forEach(option => {
                this.clearSelected(option)
            })
            this.selecteds = []
            this.details = ''
            this.searchResultOptions = []

            if (this.keyword.trim() === '') return
            this.keywords = []
            this.keyword.toLowerCase().split(' ').forEach(keyword => {
                if (keyword.trim() !== '') {
                    this.keywords.push(keyword.trim())
                }
            })
            
            const totalSelects = document.querySelectorAll('td:nth-child(3) > select')
            const ulDetails = document.querySelector('.details ul')
            // 重置optionNumber
            let optionNumber = 0
            totalSelects.forEach(select => {
                const totalOptions = select.querySelectorAll('option')
                
                for (let i = 0; i < totalOptions.length; i++) {
                    if(this.isMatch(totalOptions[i])){
                        if (this.isAutoAddResults) {
                            this.addSelected(totalOptions[i])
                            this.selecteds.push(totalOptions[i])
                        }
                        this.details += `<li style="padding-left:20px;background:#fffd92;margin-top:20px;border:none;">${select.parentNode.previousSibling.textContent}</li>`
                        break
                    }
                }
                
                for (let i = 0; i < totalOptions.length; i++) {
                    if(this.isMatch(totalOptions[i])){
                        this.details += `<li style="padding-left:20px;cursor:pointer;border:none;" data-optionnumber="${optionNumber}">${this.addKeywordsStyle(totalOptions[i].text)}</li>`
                        this.searchResultOptions.push(totalOptions[i])
                        optionNumber++
                    }
                }
            })

            ulDetails.innerHTML = this.details
            this.updateDetailStyle()
            this.checkPrice()
            this.addRecords()
            this.updateRecords()
        }

        isMatch(option) {
            return this.keywords.every(keyword => option.text.toLowerCase().includes(keyword.toLowerCase()))
        }
        
        addKeywordsStyle(text) {
            let reg = ''
            this.keywords.forEach((keyword, i) => {
                i === 0 ? reg = reg + keyword : reg = reg + `|${keyword}`
            })
    
            text = text.replace(new RegExp(reg, 'gi'), str => {
                return `<span style="color:red;">${str}</span>`
            })
            return text
        }

        addSelected(option) {
            option.selected = true
            option.parentNode.parentNode.dispatchEvent(new Event('change'))
        }

        clearSelected(option) {
            option.selected = false
            option.parentNode.parentNode.dispatchEvent(new Event('change'))
        }

        updateRecords() {
            let str = `<span style="flex-shrink:0;">歷史紀錄：</span>`
            for (let i = 0; i < this.records.length; i++) {
                str += `<li class="record" style="margin-right:5px;cursor:pointer;color:blue;text-decoration:underline;flex-shrink:0;border:none;background:transparent;">${this.records[i]}</li><span class="deleteRecord" style="margin-right:20px;flex-shrink:0;font-size:15pt;cursor:pointer;" data-recordnumber="${i}">&times;</span>`
            }
            const records = document.querySelector('.records')
            records.innerHTML = str
            this.input.value = this.keyword
        }

        addRecords() {
            const isNotRepeat = this.records.every( record => record.toLowerCase() !== this.keyword.toLowerCase() )
            if (!isNotRepeat) return
            this.records.unshift(this.keyword)
            if (this.records.length > 10) {
                this.records.splice(10)
            }
            localStorage.setItem('coolpc', JSON.stringify(this.records))
        }

        clickRecords(e) {
            if (e.target.nodeName == 'LI' && e.target.className == 'record') {
                this.keyword = e.target.textContent
                this.search()
            }

            if (e.target.nodeName === 'SPAN' &&　e.target.className === 'deleteRecord') {
                this.records.splice(e.target.dataset.recordnumber,1)
                localStorage.setItem('coolpc', JSON.stringify(this.records))
                this.updateRecords()
            }
        }

        clearAd() {
            const body = document.querySelector('body')
            if (body !== null) {
                body.style.overflow = 'auto'
            }
            const Psu = document.querySelector('#Psu')
            if (Psu !== null) {
                Psu.style.display = 'none'
            }
            const doc = document.querySelector('#doc tbody')
            if (doc !== null) {
                doc.style.display = 'none'
            }
        }

        removeOriginalEventListener() {
            const script = document.createElement('script')
            script.innerHTML = `
document.querySelector('body').onkeyup = null;
document.querySelector('body').onselectstart = null;
document.querySelector('body').oncontextmenu = null;
document.querySelector('#fDiv').ondblclick = null;
`
            document.querySelector('body').append(script)
        }

        clickDetails(e) {
            if (e.target.nodeName === 'LI' &&　e.target.dataset.optionnumber) {
                if(!this.searchResultOptions[e.target.dataset.optionnumber].selected){
                    this.addSelected(this.searchResultOptions[e.target.dataset.optionnumber])
                } else {
                    this.clearSelected(this.searchResultOptions[e.target.dataset.optionnumber])
                }
                this.updateDetailStyle()
            }
        }

        updateDetailStyle() {
            const lists = document.querySelectorAll('.details li')
            lists.forEach(li => {
                if(li.dataset.optionnumber){
                    if(this.searchResultOptions[li.dataset.optionnumber].selected === true) {
                        li.style.background = '#c99932'
                    } else {
                        li.style.background = 'transparent'
                    }
                }
            })
        }

        clickAutoAddResults_div() {
            this.isAutoAddResults = !this.isAutoAddResults
            localStorage.setItem('coolpc_isAutoAddResults', this.isAutoAddResults)
            const autoAddResults_div = document.querySelector('.autoAddResults_div')
            autoAddResults_div.innerHTML = this.isAutoAddResults ? '&check;' : ''
        }
        
        checkPrice() {
            const details = document.querySelectorAll(".details ul li")
    
            if(this.minPrice.value.trim() === '' || this.maxPrice.value.trim() === '' || isNaN(Number(this.minPrice.value)) || isNaN(Number(this.maxPrice.value))) {
                details.forEach(li => {
                    li.style.display = 'list-item';
                })
                return
            }
            
            details.forEach(li => {
                const match = li.textContent.match(/\$[0-9]+/g)
                if(match){
                    const price = match[match.length-1].slice(1)
                    if(Number(this.minPrice.value) <= Number(price) && Number(price) <= Number(this.maxPrice.value)) {
                        li.style.display = 'list-item';
                    } else {
                        li.style.display = 'none';
                    }
                }
            })
        }
    }

    const coolpc = new Coolpc()

    window.onload = coolpc.init()

})();