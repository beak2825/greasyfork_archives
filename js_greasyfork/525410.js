// ==UserScript==
// @name        GGn sort equipment
// @match       https://gazellegames.net/user.php?action=equipment*
// @version     1.2
// @author      Nyannerz
// @description Tool to help sort equipment alphabetically instead of by creation date.
// @require     https://code.jquery.com/jquery-3.4.1.min.js
// @grant       GM.getValue
// @grant       GM.setValue
// @license MIT
// @namespace https://greasyfork.org/users/1429440
// @downloadURL https://update.greasyfork.org/scripts/525410/GGn%20sort%20equipment.user.js
// @updateURL https://update.greasyfork.org/scripts/525410/GGn%20sort%20equipment.meta.js
// ==/UserScript==

const ALWAYS_SORT_ALPHABETICAL = false;
const MAKE_LOAD_BUTTON = true;

try {init();}
catch (err) {console.log(err);}

function init()
{
  var itemsWrapper = $('#items-wrapper');
  var listItems = itemsWrapper.children('li').get();

  if(ALWAYS_SORT_ALPHABETICAL || parseInt(GM.getValue($(listItems[0]).attr("data-id"),-1),10)<0)
  {
    listItems.sort(function(a, b) {
     return $(a).attr("data-item-name").toUpperCase().localeCompare($(b).attr("data-item-name").toUpperCase()); //Initial alphabetical sort.
      })
    $.each(listItems, function(idx, itm) { itemsWrapper.append(itm); });
  }
  if(!ALWAYS_SORT_ALPHABETICAL)
  {
      createButtons();
      sortList();
  }
}

async function sortList()
{
  var itemsWrapper = $('#items-wrapper');
  var listItems = itemsWrapper.children('li').get();
  await Promise.all(listItems.map(async x => [await x.setAttribute('saved-order', await GM.getValue($(x).attr("data-id"))), x]));
  console.log("Sorting");
  listItems.sort(function(a, b) {
     return parseInt($(a).attr("saved-order"), 10)>parseInt($(b).attr("saved-order"), 10)? 1 : -1;
      })
    $.each(listItems, function(idx, itm) { itemsWrapper.append(itm); });
}


function saveOrder()
{
  console.log("Saving item order");
  var itemsWrapper = $('#items-wrapper');
  var listItems = itemsWrapper.children('li').get();
  for (var i = 0; i<listItems.length; i++)
  {
    GM.setValue($(listItems[i]).attr("data-id"),i);
  }
}

function createButtons()
{
  if(MAKE_LOAD_BUTTON)
  {
      var loadButton = document.createElement("BUTTON");
      loadButton.style.width = '45%';
      loadButton.style.height = '20px';
      loadButton.innerHTML = 'Load order';
      loadButton.style.display = 'inline-block';
      loadButton.style.marginBottom = '5px';
      loadButton.style.marginLeft = '5px';
      loadButton.style.marginTop = '5px';
      loadButton.addEventListener("click", sortList);
      document.getElementById('items_inner').prepend(loadButton);
  }
  var saveButton = document.createElement("BUTTON");
      saveButton.style.width = MAKE_LOAD_BUTTON?'45%':'100%';
      saveButton.style.height = '20px';
      saveButton.innerHTML = 'Save order';
      saveButton.style.display = 'inline-block';
      saveButton.style.marginBottom = '5px';
      saveButton.style.marginTop = '5px';
      saveButton.addEventListener("click", saveOrder);
      document.getElementById('items_inner').prepend(saveButton);
}