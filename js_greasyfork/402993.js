// ==UserScript==
// @name         Screwfix 'Share Saved List'
// @description  Add a 'Share Saved List' button to Screwfix
// @author       Antony Buck
// @match        https://www.screwfix.com/jsp/account/savedListPage*
// @grant        none
// @version         1.1
// @namespace https://greasyfork.org/users/5369
// @downloadURL https://update.greasyfork.org/scripts/402993/Screwfix%20%27Share%20Saved%20List%27.user.js
// @updateURL https://update.greasyfork.org/scripts/402993/Screwfix%20%27Share%20Saved%20List%27.meta.js
// ==/UserScript==

function createElements(){
	var isButton = document.getElementsByClassName('btn btn--lg title-section__btn')[0];
  var saveBtn = document.createElement('div');
  saveBtn.id = 'saveBtn_';
  saveBtn.className = 'btn btn--lg title-section__btn';
  saveBtn.innerHTML = 'Easy Share Version';
  saveBtn.fontSize = '16px';
  isButton.parentNode.insertBefore(saveBtn, isButton.nextSibling);
  document.getElementById('saveBtn_').addEventListener('click', getItems);
  
  var findSpace = document.getElementsByClassName('title-section')[0];
  var copyPaste = document.createElement('TABLE');
  copyPaste.id = 'saveOutput';
  copyPaste.class = '';
  findSpace.parentNode.insertBefore(copyPaste, findSpace.nextSibling);
}

function getItems(){
 	var thisItemString = "";
  var endDisplay = "";
  var allItems = document.getElementsByClassName('product__desc');
  var price = document.getElementsByClassName('product__total__sm');
	var i;
  
  for (i = 0; i < allItems.length; i++) {
    var thisItem = allItems[i];
		var itemPrice = price[i].innerHTML.substring(price[i].innerHTML.indexOf(".")+3, 2).trim();
    var itemNum = thisItem.childNodes[3].innerHTML //.replace(/[^0-9]/g,'');
    var iCount = i+1;
   	var itemDesc = document.getElementById('saved_list_page_product_name_' + iCount).text.trim();
    var itemLink = thisItem.childNodes[0];
    
    thisItemString = "<TD>" + iCount + ") </td><TD>" + itemDesc + ". </td><TD> Item Num: " + itemNum + ". </td><TD> Price: " + itemPrice + ". </td><TR>";
  	endDisplay += thisItemString;
  }
  document.getElementById('saveOutput').innerHTML = endDisplay;
	selectElementContents(document.getElementById('saveOutput'));
}

function selectElementContents(el) {
	var body = document.body, range, sel;
	if (document.createRange && window.getSelection) {
		range = document.createRange();
		sel = window.getSelection();
		sel.removeAllRanges();
		try {
			range.selectNodeContents(el);
			sel.addRange(range);
		} catch (e) {
			range.selectNode(el);
			sel.addRange(range);
		}
	document.execCommand("copy");
	} else if (body.createTextRange) {
		range = body.createTextRange();
		range.moveToElementText(el);
		range.select();
		range.execCommand("Copy");
	}
  alert('Copied to clipboard, ready to paste');
}

createElements()

