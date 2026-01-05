// ==UserScript==
// @name        craigslist.ca for european people
// @namespace   net.nfet.dad
// @description show prices in euro and surfaces in square meter
// @include     http://vancouver.craigslist.ca/*
// @include     https://vancouver.craigslist.ca/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12638/craigslistca%20for%20european%20people.user.js
// @updateURL https://update.greasyfork.org/scripts/12638/craigslistca%20for%20european%20people.meta.js
// ==/UserScript==
function processMoney(node, convRate) {
  /*-- Results like:
        ["Three values: ", "$1.10", " ", "$2.20", " ", "$3.00.", ""]
    */
  var moneySplit = node.split(/((?:\+|\-)?\$[0-9.,]+)/);
  if (moneySplit && moneySplit.length > 2) {
    /*-- Money values will be odd array index, loop through
            and convert all.
        */
    for (var J = 1, L = moneySplit.length; J < L; J += 2) {
      var dolVal = parseFloat(moneySplit[J].replace(/\$|,|([.,]$)/g, ''));
      if (typeof dolVal === 'number') {
        //var rupVal = "Rs" + Math.round (dolVal * convRate);
        var rupVal = (dolVal * convRate).toFixed(2) + '€';
      } 
      else {
        var rupVal = moneySplit[J] + ' *Err*';
      }
      moneySplit[J] = rupVal + ' ($' + dolVal + ')';
    }
    //-- Rebuild and replace the text node with the changed value (s).

    var newTxt = moneySplit.join('');
    return newTxt;
  }
  return node;
}
function processFeets(node, convRate) {
  var moneySplit = node.split(/([0-9.,]+)ft\^?2/);
  if (moneySplit && moneySplit.length > 2) {
    for (var J = 1, L = moneySplit.length; J < L; J += 2) {
      var dolVal = parseFloat(moneySplit[J].replace(/|,|([.,]$)/g, ''));
      if (typeof dolVal === 'number') {
        var rupVal = (dolVal * convRate).toFixed(2) + 'm²';
      } 
      else {
        var rupVal = moneySplit[J] + ' *Err*';
      }
      moneySplit[J] = rupVal + ' ('+dolVal+'ft²)';
    }
    var newTxt = moneySplit.join('');
    return newTxt;
  }
  return node;
}
var strongElems = document.getElementsByTagName('h2');
var wantToHide = true || false;
for (var i = 0; i < strongElems.length; i++)
{
  var thisElem = strongElems[i];
  thisElem.textContent = processMoney(thisElem.textContent, 0.676234);
  thisElem.textContent = processFeets(thisElem.textContent, 0.09290304);
}
