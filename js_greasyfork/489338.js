// ==UserScript==
// @name        GitHub Branches Sorter
// @namespace   Violentmonkey Scripts
// @match       https://github.com/*/*
// @grant       none
// @version     1.0.1
// @license     ISC
// @author      OctoSpacc
// @description Allows sorting the branches list of a repository in ways additional to the default, modification time ordering
// @downloadURL https://update.greasyfork.org/scripts/489338/GitHub%20Branches%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/489338/GitHub%20Branches%20Sorter.meta.js
// ==/UserScript==

var lastpath = window.location.pathname;

function onBranchesPage(){
  var pathElems = window.location.pathname.split('/').slice(3);
  return (pathElems[0] === 'branches' && pathElems[1]);
}

function main(){
  lastpath = window.location.pathname;
  var tableQuery = 'table.Table__StyledTable-sc-jofqvq-0.gsRldM.Table';

  var orderButtonElem = document.createElement('button');
  orderButtonElem.innerHTML = 'Sort Branches';
  orderButtonElem.onclick = function(){
    var tableElems = document.querySelectorAll(`${tableQuery} > tbody`);
    tableElems[0].style.display = (tableElems[0].style.display ? '' : 'none');
    tableElems[1].style.display = (tableElems[1].style.display ? '' : 'none');
  };

  var tableAlphabElem = document.querySelector(`${tableQuery} > tbody`).cloneNode(false);
  tableAlphabElem.style.display = 'none';

  var alphabRowElems = {};
  for (var branchRowElem of document.querySelectorAll(tableQuery + '> tbody > tr')) {
    var branchName = branchRowElem.querySelector('td > div > a').textContent;
    var branchRowElemNew = branchRowElem.cloneNode(true);
    alphabRowElems[branchName] = branchRowElemNew;
  }

  alphabRowElems = Object.keys(alphabRowElems).sort().reduce(
    function(obj, key) {
      obj[key] = alphabRowElems[key];
      return obj;
    },
  {});

  for (var branchRowElem of Object.values(alphabRowElems)) {
    tableAlphabElem.appendChild(branchRowElem);
  }

  document.querySelector('.Box-sc-g0xbh4-0.lhFvfi').appendChild(orderButtonElem);
  document.querySelector(tableQuery).appendChild(tableAlphabElem);
}

setInterval(function(){
  if (window.location.pathname !== lastpath && onBranchesPage()) {
    window.location.reload();
  }
}, 1000);

if (onBranchesPage()) {
  main();
}