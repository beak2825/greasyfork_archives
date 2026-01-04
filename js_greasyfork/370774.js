// ==UserScript==
// @name        Ess.fi Ohita maksumuuri
// @namespace   ess.fi_ohita_maksumuuri
// @description Näyttää artikkelit, jotka näkyisivät normaalisti vain tilaajille
// @include     https://www.ess.fi/uutiset/*
// @include     https://www.ess.fi/urheilu/*
// @include     https://www.ess.fi/teemat/*
// @include     https://www.ess.fi/Mielipide/*
// @author      none
// @grant       none
// @license     Unlicense; http://unlicense.org/
// @version     1.1.6
// @downloadURL https://update.greasyfork.org/scripts/370774/Essfi%20Ohita%20maksumuuri.user.js
// @updateURL https://update.greasyfork.org/scripts/370774/Essfi%20Ohita%20maksumuuri.meta.js
// ==/UserScript==

if (window.eval('typeof ArticleInfo.paidcontent') === 'boolean' &&
    window.eval('ArticleInfo.paidcontent') === true) {

  // Fetch a clean copy
  article_url = window.location.href

  fetch(article_url, {
    method: 'get'
  }).then(function(response) {
    return response.text()
  }).then(function(inputHtml) {

    // Put content in
    let parser = new DOMParser()
    let doc = parser.parseFromString(inputHtml, "text/html")

    let article_body = doc.querySelector('div.body.delete-non-paid').innerHTML
    if (doc.querySelector('div.author.delete-non-paid')) {
      let author_info = doc.querySelector('div.author.delete-non-paid').innerHTML
      document.getElementById('main-subscribe').innerHTML = article_body + "<br>" + author_info
    } else {
      document.getElementById('main-subscribe').innerHTML = article_body
    }

    // Dress it up a bit
    document.getElementById('main-subscribe').style.color = '#000'
    document.getElementById('main-subscribe').style.marginBottom = '60px'
    document.getElementById('main-subscribe').style.lineHeight = '1.4em'
    document.getElementById('main-subscribe').style.fontSize = '17px'

    let qsa = []

    // Fix paragraphs
    qsa = document.querySelectorAll('p')
    for(let i=0; i < qsa.length; i++){
      qsa[i].style.margin = '0px 0px 15px 0px'
    }

    // Fix Headers
    qsa = document.querySelectorAll('h3')
    for(let i=0; i < qsa.length; i++){
      qsa[i].style.margin = '25px 10px 9px 0px'
      qsa[i].style.fontSize = '18px'
    }

    // Fix "Lue lisää"
    qsa = document.querySelectorAll('.in-body-article')
    for(let i=0; i < qsa.length; i++){
      qsa[i].style.borderTop = '1px solid #ddd'
      qsa[i].style.borderBottom = '1px solid #ddd'
      qsa[i].style.padding = '20px 0px'
      qsa[i].style.display = 'flex'
    }
    qsa = document.querySelectorAll('.linkTitle')
    for(let i=0; i < qsa.length; i++){
      qsa[i].style.whiteSpace = 'nowrap'
      qsa[i].style.paddingRight = '19px'
    }
    qsa = document.querySelectorAll('#main-subscribe a')
    for(let i=0; i < qsa.length; i++){
      qsa[i].style.color = '#008BD2'
      qsa[i].style.fontWeight = 'bold'
      qsa[i].style.textDecoration = 'underline'
    }

    // Mark bottom right with "done" when this script is run
    document.body.innerHTML += '<div id="infoMessage"></div>'

    infoMsg = document.getElementById('infoMessage')
    infoMsg.innerText = 'Valmis'
    infoMsg.style.position = 'fixed'
    infoMsg.style.bottom = '7px'
    infoMsg.style.right = "10px"
    infoMsg.style.zIndex = "99999"
    infoMsg.style.color = "#27AE60"

  })
} 
