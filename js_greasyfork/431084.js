// ==UserScript==
// @name         avg-calc
// @namespace    https://wallex.ir/
// @version      4.5
// @description  calculate avg of orders
// @author       amiwrpremium
// @include      https://wallex.ir/app/fake-trades*
// @icon         https://www.google.com/s2/favicons?domain=wallex.ir
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431084/avg-calc.user.js
// @updateURL https://update.greasyfork.org/scripts/431084/avg-calc.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function main(){
    var tbody = document.getElementsByClassName('table table-hover')[0].getElementsByTagName('tbody')[0]
    var trs = Array.from(tbody.getElementsByTagName('tr')).slice(1)

    let sum_price = 0
    let sum_qty = 0

    function numberWithCommas(x) {
      var parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
  }

    for (let i=0; i< trs.length; i++){
      let seller = trs[i].getElementsByTagName('td')[4].innerText
      let price = parseFloat((trs[i].getElementsByTagName('td')[5].innerText).replaceAll(',', ''))
      let qty = parseFloat((trs[i].getElementsByTagName('td')[6].innerText).replaceAll(',', ''))

      if(seller == 'fake2'){
        let total = price * qty
        sum_price += -1 * total
        sum_qty += -1 * qty
      }
      else{
        let total = price * qty
        sum_price += total
        sum_qty += qty
      }
    }

    let result = parseFloat((sum_price / sum_qty).toFixed(2))
    console.log('Average is ' + numberWithCommas(result))

    let header = document.querySelector('#pjax-container > section.content > div > div > div > div.box-header')

    let avg = document.createElement('h4')
    avg.className = 'inline pull-left'
    avg.style = 'padding-left: 10px; padding-right: 10px'
    avg.innerText = `میانگین: ${numberWithCommas(result)}`

    let vol = document.createElement('h4')
    vol.className = 'inline pull-left'
    vol.style = 'padding-left: 10px; padding-right: 10px'
    vol.innerText = `حجم کل: ${numberWithCommas(parseFloat(sum_qty.toFixed(6)))}`

    if (sum_qty < 0){
        vol.style.color = '#DD4B39'
    }
    else{
      vol.style.color = '#00A65A'
    }

    let vol2 = document.createElement('h4')
    vol2.className = 'inline pull-left'
    vol2.style = 'padding-left: 10px; padding-right: 10px'
    vol2.innerText = `حجم به تومان: ${numberWithCommas(parseFloat((result * sum_qty).toFixed(6)))}`

    if (result * sum_qty < 0){
      vol2.style.color = '#DD4B39'
    }
    else{
      vol2.style.color = '#00A65A'
    }

    header.appendChild(avg)
    header.appendChild(vol)
    header.appendChild(vol2)

  }

  let a = document.querySelector('#app > aside > section > ul > li:nth-child(1) > a > span');
  if (a.innerText === "سفارش ها"){
    main()
  }
  else{
    console.log('Not Sbaqeri')
  }
})();