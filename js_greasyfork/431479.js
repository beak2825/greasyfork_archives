// ==UserScript==
// @name         PT-Offer-Vote
// @namespace    http://tampermonkey.net/
// @version      0.4.0
// @description  主要用于PT站的候选投票
// @author       67373fafa
// @icon         https://www.google.com/s2/favicons?domain=chdbits.co
// @grant        none
// @updateUrl    https://github.com/Flipped321/PT-Offer-Vote/blob/master/pt-offer-vote.js
// @include      https://chdbits.co/offers.php
// @include      https://pt.btschool.club/offers.php
// @include      https://totheglory.im/viewoffers.php
// @downloadURL https://update.greasyfork.org/scripts/431479/PT-Offer-Vote.user.js
// @updateURL https://update.greasyfork.org/scripts/431479/PT-Offer-Vote.meta.js
// ==/UserScript==

function voteTTG() {
  const nodes = Array.from(document.getElementsByTagName('a')).filter(node => node.innerHTML === '支持')
  nodes.forEach(element => element.click())
  alert('投票完成。如果稍后弹出大量弹窗提示你已投过票，关闭浏览器tab页即可')
}

function voteOther() {
  const nodes = document.querySelectorAll("[title='我要！']")
  let requests = []
  Object.keys(nodes).forEach(element => {
    const request = new XMLHttpRequest()
    const VoteRequest = new Promise((resolve, reject) => {
      request.open('GET', nodes[element].href)
      request.onload = () => resolve()
      request.send()
    })
    requests.push(VoteRequest)
  })

  Promise.all(requests)
  .then(res => {
    alert('全部投票成功。')
  })
  .catch(error => {
    alert('投票完成。但有部分投票失败，可重新尝试')
  })
}

function startVote() {
  alert('点击确定开始投票')
  isTTG? voteTTG(): voteOther()
}

function createVoteOffer() {
  let offerTitle = isTTG? document.querySelector('h1'): document.querySelector('h2')
  let voteOffer = document.createElement('span')
  voteOffer.innerHTML = `全部${isTTG? '支持': '投是'}`
  voteOffer.style = "padding-left: 20px;cursor: pointer;color: red"
  voteOffer.addEventListener('click', function(){
      startVote(isTTG)
  })
  
  offerTitle.appendChild(voteOffer)
}

function startScript() {
  // TTG与普通NP略有差别
  const domain = document.domain
  isTTG = domain.indexOf('totheglory') !== -1

  createVoteOffer()
}


let isTTG = false
startScript()