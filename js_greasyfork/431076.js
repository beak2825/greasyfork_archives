// ==UserScript==
// @name         Check All
// @namespace    https://wallex.ir/
// @version      2.2
// @description  check all unchecked
// @author       amiwrpremium
// @include      https://wallex.ir/app/fake-trades*
// @icon         https://www.google.com/s2/favicons?domain=wallex.ir
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431076/Check%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/431076/Check%20All.meta.js
// ==/UserScript==

(function() {
  let a = document.querySelector('#app > aside > section > ul > li:nth-child(1) > a > span');

  function addButton(){
    let header = document.querySelector('#pjax-container > section.content > div > div > div > div.box-header')
    let button = document.createElement('button')
    button.innerHTML = '<i class="fa fa-check"></i>  بررسی شده'
    header.appendChild(button)
    button.className='btn btn-primary btn-sm'
    button.style.backgroundColor='#00A65A'
    button.id = 'check'
    button.addEventListener('click', job)
  }

  function job(){
    var tbody = document.getElementsByClassName('table table-hover')[0].getElementsByTagName('tbody')[0]
    var trs = Array.from(tbody.getElementsByTagName('tr')).slice(1)

    if (trs.length > 0){
      let sure = confirm("Are You Sure?")
      if (sure == true) {
        for (let i=0; i<= trs.length; i++){
          let last_td = trs[i].getElementsByTagName('td')[11]
          last_td.getElementsByTagName('a')[0].click()
          last_td.getElementsByTagName('select')[0].value = 2
          last_td.getElementsByTagName('button')[0].click()
        }
      }
      else{
        alert('Canceled')
      }
    }
    else{
      alert('No Rows')
    }
  }

  if (a.innerText === "سفارش ها"){
    addButton()
  }
  else{
    console.log('Not Sbaqeri')
  }
  })();
