// ==UserScript==
// @name         Fadi Farha - Matching Products
// @author       Eisenpower
// @namespace    Uchiha Clan
// @version      1.5
// @description  Unleashes Your Sharingan
// @icon         https://i.imgur.com/M0jWVYS.png
// @include      *mturkcontent*
// @include      *amazonaws*
// @require      http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/373408/Fadi%20Farha%20-%20Matching%20Products.user.js
// @updateURL https://update.greasyfork.org/scripts/373408/Fadi%20Farha%20-%20Matching%20Products.meta.js
// ==/UserScript==

if (!document.body.innerText.includes('MATCHESFASHION.COM')) return
if (location.href.includes('ASSIGNMENT_ID_NOT_AVAILABLE')) return

var designer = document.querySelectorAll('tbody')[1].querySelectorAll('tr')[2].querySelectorAll('td')[1].innerText.toLowerCase()
var gender = document.querySelectorAll('tbody')[1].querySelectorAll('tr')[7].querySelectorAll('td')[1].innerText.toLowerCase()
var base = document.querySelectorAll('tbody')[1].querySelectorAll('tr')[8].querySelectorAll('td')[1].innerText

var sites = [
  base,
  `https://www.matchesfashion.com/search/?text=${designer.replace(' ', '+')}%3A%3AallCategories%3A${gender}s`,
  `https://www.farfetch.com/shopping/${gender}/search/items.aspx?q=${designer}`,
  `https://www.net-a-porter.com/us/en/Shop/Search?keywords=${designer}`,
  `https://www.mrporter.com/mens/search?keywords=${designer.replace(' ', '+')}`,
  `https://www.mytheresa.com/en-de/catalogsearch/result/?q=${designer}&mytrs=1`,
  `https://hbx.com/search?q=${designer}&limit=120`,
  `https://www.endclothing.com/us/catalogsearch/result/index/?q=${designer}&gender=${gender == 'men' ? 396959 : gender == 'women' ? 396960 : null}&p=1`,
  `https://www.barneys.com/search?q=${designer}`,
  `https://www.luisaviaroma.com/en-us/shop/${gender}/search?lvrid=_g${gender == 'men' ? 'm' : 'w'}_f&search=${designer}`
]

hide()
fill()
links()

function hide() {
  var text = document.querySelectorAll('p')
  for (let i = 1; i < text.length -1; i++) text[i].style.display = 'none'
  document.querySelector('ul').style.display = 'none'
}

function fill() {
  var text = document.querySelectorAll('textarea')
  text.forEach((t)=> t.innerText = 'N/A')
}

function links() {
  sites.forEach((s)=> window.open(s, '_blank'))
}