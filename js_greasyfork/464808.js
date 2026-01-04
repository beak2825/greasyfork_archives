// ==UserScript==
// @name        TiaoShi Enhancer - ingping.net
// @namespace   Violentmonkey Scripts
// @match       https://ts-mng.ingping.net/
// @grant       none
// @run-at      document-end
// @version     1.02
// @author      Dammu
// @license     Apache-1.0
// @description 2023/4/14 16:00:23
// @downloadURL https://update.greasyfork.org/scripts/464808/TiaoShi%20Enhancer%20-%20ingpingnet.user.js
// @updateURL https://update.greasyfork.org/scripts/464808/TiaoShi%20Enhancer%20-%20ingpingnet.meta.js
// ==/UserScript==

function addLabel() {
  let tt = document.querySelectorAll('tr[ng-repeat="item in debugList"]');
  let expiredLabel;
  let brLabel;

  tt.forEach(function(node) {
    let ddNum = node.querySelector('td.ng-binding').textContent.split('\n')[0].substring(4,);
    let yyNum = node.querySelector('td.ng-binding').textContent.split('\n')[6].trim();
    let dYear, dMon, dDate, curDate, pastDate, diff, container;

    if (ddNum.substring(0, 2) == '20') {
      dYear = ddNum.substring(0, 4)
      dMon = ddNum.substring(4, 6) - 1;
      dDate = ddNum.substring(6, 8);
      pastDate = new Date(dYear, dMon, dDate);
    } else {
      dYear = yyNum.substring(4, 8);
      dMon = yyNum.substring(8, 10) - 1;
      dDate = yyNum.substring(10, 12);
      pastDate = new Date(dYear, dMon, dDate);
    }

    curDate = new Date();
    curDate.setHours(0, 0, 0, 0);
    diff = Math.abs(curDate - pastDate) / 1000 / 3600 / 24;
    container = node.querySelector('td:nth-child(3)')

    if (diff > 90) {
      // console.log(ddNum, "is expired");
      brLabel = document.createElement('br');
      container.appendChild(brLabel);
      expiredLabel = document.createElement('span');
      expiredLabel.innerHTML = '▶ 已过期'+(diff-90).toString()+'天';
      expiredLabel.style.color = 'red';
      expiredLabel.style.fontSize = '15px';
      container.appendChild(expiredLabel);
    } else {
      expiredLabel = document.createElement('span');
      brLabel = document.createElement('br');
      // console.log(ddNum, "差", 90-diff, "天");
      expiredLabel.innerHTML = '▶ 差' + (90-diff).toString() + '天过期';
      // expiredLabel.style.color = 'grey';
      // expiredLabel.style.fontSize = '15px';
      container.appendChild(brLabel);
      container.appendChild(expiredLabel);
    }
  })
}


var node0Text;
function checkNode() {
  if (document.querySelectorAll('tr[ng-repeat="item in debugList"]').length !==0) {
    if (node0Text !== document.querySelector('tr[ng-repeat="item in debugList"]').querySelector('td.ng-binding').textContent.split('\n')[0].substring(4,).trim()) {
      // console.log(node0Text)
      node0Text = document.querySelector('tr[ng-repeat="item in debugList"]').querySelector('td.ng-binding').textContent.split('\n')[0].substring(4,).trim();
      // console.log(node0Text,'新')
      addLabel();
    }
  } else {
    // console.log('还没刷新出来')
  }
}


// function addSearchBtn (){
//   let tt = document.querySelector('div[class=col-sm-2]:nth-child(2)');
//   let searchBtnEx = document.createElement('span');
//   searchBtnEx.setAttribute("class", "input-group-btn");
//   tt.appendChild(searchBtnEx);
//   tt = tt.querySelector('.nth:child(1)')
//   console.log(tt)

// }
// setTimeout(addSearchBtn,1000);

setInterval(checkNode,1000);

