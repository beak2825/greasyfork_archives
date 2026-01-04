// ==UserScript==
// @name        面試終結者 - 104.com.tw
// @namespace   Violentmonkey Scripts
// @match       https://www.104.com.tw/job/*
// @grant       none
// @version     1.2
// @author      - Whiter_
// @description 2023/7/11 下午5:48:30
// @require  http://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/470606/%E9%9D%A2%E8%A9%A6%E7%B5%82%E7%B5%90%E8%80%85%20-%20104comtw.user.js
// @updateURL https://update.greasyfork.org/scripts/470606/%E9%9D%A2%E8%A9%A6%E7%B5%82%E7%B5%90%E8%80%85%20-%20104comtw.meta.js
// ==/UserScript==


const SearchButton = document.createElement('div');
const buttondiv = {
  width : '120px',
  height : '33px',
  position : 'absolute',
  marginLeft : '-130px',
  fontWeight : 'bold',
  fontSize : '14px',
  background : '#009688',
  display : 'flex',
  justifyContent : 'center',
  alignItems : 'center',
  userSelect : 'none',
  borderRadius : '5px',
  color : 'white'

}
SearchButton.setAttribute('id','search_button_for_review');


SearchButton.addEventListener('mouseover',()=>{
  SearchButton.style.background='#09B189';
  SearchButton.style.cursor='pointer';
})
SearchButton.addEventListener('mouseout',()=>{
  SearchButton.style.background='#009688'
})

var company;


let activeoption = {
  interview : (company)=>(`https://interview.tw/search#gsc.tab=0&gsc.q=${company}&gsc.sort=`),
}

SearchButton.addEventListener('click',()=>{
  var company = $('.job-header__title>div:nth-child(2)>a:first-child').text()
  for (let option in activeoption){
    window.open(activeoption[option](company),option)
  }
})

for(let attr in buttondiv){
  SearchButton.style[attr] = buttondiv[attr];
}

SearchButton.appendChild(document.createTextNode("搜尋評價"))

window.onload = ()=>{
  var btnsetter = setInterval(()=>{
    const header = $('.job-header__btn')[0];
    if(header){
      header.appendChild(SearchButton)
      clearInterval(btnsetter)
    }
  },1000)
}

