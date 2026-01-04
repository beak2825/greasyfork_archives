// ==UserScript==
// @name         coefficient calculator
// @namespace    coefficient calculator
// @version      2.0
// @description  coefficient calculator in substitute-trades
// @author       amiwrpremium
// @match        https://wallex.ir/app/substitute-trades
// @icon         https://www.google.com/s2/favicons?domain=wallex.ir
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429993/coefficient%20calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/429993/coefficient%20calculator.meta.js
// ==/UserScript==

(function() {
    const buy_co = [0.998 , 0.995 , 0.993]
    const sell_co = [1.002 , 1.005 , 1.007]
 
 
    function createTable() {
        let table = document.createElement('table')
        table.className = 'table table-hovers'
        let tbody = document.createElement("tbody")
 
        table.appendChild(tbody)
 
        let tr_header = document.createElement('tr')
        let tr_buys = document.createElement('tr')
        let tr_sells = document.createElement('tr')
 
        tbody.appendChild(tr_header)
        tbody.appendChild(tr_buys)
        tbody.appendChild(tr_sells)
 
        let th1 = document.createElement('th')
        th1.innerText = 'Side'
        tr_header.appendChild(th1)
 
        let td1 = document.createElement('td')
        td1.style = 'color: green'
        td1.innerText = 'خرید'
        tr_buys.appendChild(td1)
 
        let td2 = document.createElement('td')
        td2.style = 'color: red'
        td2.innerText = 'فروش'
        tr_sells.appendChild(td2)
 
        for (let i of buy_co){
            let th = document.createElement('th')
            th.innerText = (1 - i).toString()[4] + '%'
            tr_header.appendChild(th)
 
            let td_buys = document.createElement('td')
            td_buys.id = `buys_${i}`
            tr_buys.appendChild(td_buys)
 
            let td_sells = document.createElement('td')
            td_sells.id = `sells_${i}`
            tr_sells.appendChild(td_sells)
        }
 
        return table
    }
 
 
    function calculate(){
        let buy = parseInt(document.querySelector('#pjax-container > section.content > div > div > div > div:nth-child(3) > div > div.box-body.table-responsive.no-padding > table > tbody > tr:nth-child(2) > td:nth-child(2) > a').innerText)
        let sell = parseInt(document.querySelector('#pjax-container > section.content > div > div > div > div:nth-child(3) > div > div.box-body.table-responsive.no-padding > table > tbody > tr:nth-child(3) > td:nth-child(2) > a').innerText)
 
        let all_buys = []
        let all_sells = []
 
        for (let x of buy_co){
            all_buys.push(parseInt(buy * x))
        }
        
        for (let x of sell_co){
            all_sells.push(parseInt(sell * x))
        }
 
        document.getElementById('buys_0.998').innerText = all_buys[0]
        document.getElementById('buys_0.995').innerText = all_buys[1]
        document.getElementById('buys_0.993').innerText = all_buys[2]
 
        document.getElementById('sells_0.998').innerText = all_sells[0]
        document.getElementById('sells_0.995').innerText = all_sells[1]
        document.getElementById('sells_0.993').innerText = all_sells[2]
 
        console.log(all_buys)
        console.log(all_sells)
    }
 
 
    function main(){
        let table = createTable()
        let new_div_box = document.createElement('div')
        new_div_box.className = 'box'
 
        let div1 = document.createElement('div')
        div1.className = 'box-header'
        let div1_h3 = document.createElement('h3')
        div1_h3.className = "box-title"
        let div1_div = document.createElement('div')
        div1_div.className = "pull-right"
        let div1_span = document.createElement('span')
        div1_span.className = "pull-right"
        let div1_span_a = document.createElement('button')
        div1_span_a.className = 'btn btn-sm btn-primary'
        div1_span_a.innerText = 'بروزرسانی'
        div1_span_a.onclick = function calculate(){
        let buy = parseInt(document.querySelector('#pjax-container > section.content > div > div > div > div:nth-child(3) > div > div.box-body.table-responsive.no-padding > table > tbody > tr:nth-child(2) > td:nth-child(2) > a').innerText)
        let sell = parseInt(document.querySelector('#pjax-container > section.content > div > div > div > div:nth-child(3) > div > div.box-body.table-responsive.no-padding > table > tbody > tr:nth-child(3) > td:nth-child(2) > a').innerText)
 
        let all_buys = []
        let all_sells = []
 
        for (let x of buy_co){
            all_buys.push(parseInt(buy * x))
            all_sells.push(parseInt(sell * x))
        }
 
        document.getElementById('buys_0.998').innerText = all_buys[0]
        document.getElementById('buys_0.995').innerText = all_buys[1]
        document.getElementById('buys_0.993').innerText = all_buys[2]
 
        document.getElementById('sells_0.998').innerText = all_sells[0]
        document.getElementById('sells_0.995').innerText = all_sells[1]
        document.getElementById('sells_0.993').innerText = all_sells[2]
 
        console.log(all_buys)
        console.log(all_sells)
    }
        let div1_span_a_i = document.createElement('i')
        div1_span_a_i.className = 'fa fa-refresh'
 
        div1_span_a.appendChild(div1_span_a_i)
        div1_span.appendChild(div1_span_a)
 
        div1.appendChild(div1_h3)
        div1.appendChild(div1_div)
        div1.appendChild(div1_span)
 
 
        let div3 = document.createElement('div')
        div3.className = 'box-footer clearfix'
 
 
        new_div_box.appendChild(div1)
        new_div_box.appendChild(table)
        new_div_box.appendChild(div3)
 
        document.querySelector('#pjax-container > section.content > div > div > div > div:nth-child(1)').appendChild(new_div_box)
        calculate()
    }
 
    main()
 
})();