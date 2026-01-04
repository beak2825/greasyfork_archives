// ==UserScript==
// @name     JAMA shortcut keys
// @description JAMA navigation shortcut keys
// @include  http*://jama*/*
// @version  1.03
// @grant    none
// @namespace https://greasyfork.org/users/304483
// @downloadURL https://update.greasyfork.org/scripts/383443/JAMA%20shortcut%20keys.user.js
// @updateURL https://update.greasyfork.org/scripts/383443/JAMA%20shortcut%20keys.meta.js
// ==/UserScript==

// Uploaded to GreasyFork site here:
// https://greasyfork.org/en/scripts/383443-jama-shortcut-keys

// Based on this example:
// https://greasyfork.org/en/scripts/2656-facebook-logout-shortcut-just-press-alt-l/code

var eventUtility = {
    addEvent : function(el, type, fn) {
        if (typeof addEventListener !== "undefined") {
            el.addEventListener(type, fn, false);
        } else if (typeof attachEvent !== "undefined") {
            el.attachEvent("on" + type, fn);
        } else {
            el["on" + type] = fn;
        }
    }
};

function ascii (a) { return a.charCodeAt(0); }

function closeCurrentTab()
{
  var tabs = document.getElementsByClassName('x-tab-strip-closable')
  if (tabs.length > 1)
  {
    for (i = 0; i < tabs.length; i++)
    {
      if (tabs[i].classList.contains("x-tab-strip-active"))
      {
        tabs[i].childNodes[0].click()
        return;
      }
    }
  }
}

function getGuiButton(name)
{
  var btns = document.getElementsByClassName('x-btn-text');
  
  for (i = 0; i < btns.length; i++)
  {
    if (btns[i].innerText == name && btns[i].scrollHeight > 0)
      return btns[i];
  }
  
  return null;
}

function findAFolder()
{
  actionButton = getGuiButton("Actions");
  actionButton.click();
  var findMeMenuItem = getMenuItem("Find me");
  findMeMenuItem.click();
  
  closeCurrentTab();
}

function getViewLink(name)
{
  return getActiveClassElementWithText('view-toggle-title', 'View');
}

function getMenuItem(name)
{
  var items = document.getElementsByClassName('x-menu-list-item');
  
  for (i = 0; i < items.length; i++)
  {
    if (items[i].innerText == name)
      return items[i];
  }
  return null;
}

function getMainPane()
{
  var bodies = document.getElementsByClassName("body");
  for (var i = 0; i < bodies.length; i++)
  {
    if (bodies[i].scrollHeight > 0)
    {
      return bodies[i];
    }
  }
  return null;
}

function getActiveClassElementWithText(classname, innerText)
{
  var items = document.getElementsByClassName(classname);
  
  for (i = 0; i < items.length; i++)
  {
    if (items[i].innerText == innerText)
      return items[i];
  }
  return null;  
}

function getActiveClassElement(classname)
{
  var items = document.getElementsByClassName(classname);
  
  for (i = 0; i < items.length; i++)
  {
    if (items[i].scrollHeight > 0)
      return items[i];
  }
  return null;
}

function focusOnMainPane()
{
  document.activeElement.blur();

  // it was quite tricky to return focus onto the main pane
  // it only seemed to work after blurring the previous element
  // and then adjusting the caret selection to within the main pane
  var selection = window.getSelection();
  var range = document.createRange();

  // this technique works for when a proper item is selected
  var sivf = getActiveClassElement('single-item-view-form-fields-wrap');
  if (sivf != null)
  {
    range.selectNode(sivf);
    range.setEnd(range.startContainer, 1);
    selection.addRange(range);
  }
  else
  {
    // this technique works for when a folder is selected
    //range.selectNode(document.getElementsByClassName("body")[0])
    range.selectNode(getMainPane());
    range.setEnd(range.startContainer, range.startOffset);
    selection.addRange(range);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function goDownListOfItemsInFolderView()
{
  traverseListOfItemsInFolderView("down");
}

function goUpListOfItemsInFolderView()
{
  traverseListOfItemsInFolderView("up");
}

function getActiveTableColumn()
{
  var cols = document.getElementsByClassName('grid-column-container-documentKey');
  for (i = 0; i < cols.length; i++)
  {
    if (cols[i].scrollHeight > 0)
      return cols[i];
  }
  return null;
}

function toggleCurrentFolderViewItemSelection()
{
  var col = getActiveTableColumn();
  var rows = col.getElementsByTagName('a');
  // find currently focused link
  for (i = 0; i < rows.length; i++)
  {
    if (document.activeElement == rows[i])
    {
      rows[i].parentNode.click();
      return true;
    }
  }
  
  return false;
}

function traverseListOfItemsInFolderView(dir)
{
  var col = getActiveTableColumn();
  var cur_row = -1;
  var rows = col.getElementsByTagName('a');

  // find currently focused link
  for (i = 0; i < rows.length; i++)
  {
    if (document.activeElement == rows[i])
    {
      cur_row = i;
      break;
    }
  }
  
  if (cur_row == -1)
  {
    if (dir == "down")
    	rows[0].focus();
    else
      rows[rows.length-1].focus();
  }
  else
  {
    if (dir == "down")
    {
      if (cur_row < (rows.length-1))
      {
        rows[cur_row].blur();
        rows[cur_row+1].focus();
      }
    }
    else
    {
      if (cur_row > 0)
      {
        rows[cur_row].blur();
        rows[cur_row-1].focus();
      }
    }
  }
}

function focusOnNameOfFilter()
{
  var items = document.getElementsByClassName('x-form-text x-form-field');
  
  for (i = 0;i < items.length; i++)
  {
    if (items[i].id.includes("smart-filter-name"))
      items[i].focus();
  }
  
  return;
}

function darkenTreeNodeSelectionStyle()
{
  var sheetCount = document.styleSheets.length;
  var lastSheet = document.styleSheets[sheetCount-1];
  var ruleCount;
  if (lastSheet.cssRules) { // Firefox uses 'cssRules'
      ruleCount = lastSheet.cssRules.length;
  }
  else if (lastSheet.rules) { // IE uses 'rules'
      ruleCount = lastSheet.rules.length;
  }
  var newRule = ".x-tree-node .x-tree-selected { background-color: rgb(170, 170, 170); }";
  // insert as the last rule in the last sheet so it
  // overrides (not overwrites) previous definitions
  lastSheet.insertRule(newRule, ruleCount);
}

darkenTreeNodeSelectionStyle();

(function() {
	eventUtility.addEvent(document, "keydown",
		function(evt) {
			var code = evt.keyCode,
				altKey = evt.altKey,
    		shiftKey = evt.shiftKey;


    	// ALT + / = Go to search box
      if (altKey && code === 191)
      {
        var searchfield = document.getElementById('o-search-field');
        searchfield.focus()
        searchfield.select()
      }
    
    	// ALT + 5 = click on 'Relationships' button
    	if (altKey && code === ascii('5'))
      {
        getActiveClassElement("single-item-view-sidebar-RELATIONSHIPS").click();
      }
    
    	// ALT + 6 = click on 'Connected Users' button
    	if (altKey && code === ascii('6'))
      {
        getActiveClassElement("connected-users-stats").click();
      }
    
    	// ALT + 7 = click on 'Comments' button
    	if (altKey && code === ascii('7'))
      {
        getActiveClassElement("single-item-view-sidebar-allcomments").click();
      }
    
    	// ALT + 8 = click on 'Activities' button
    	if (altKey && code === ascii('8'))
      {
        getActiveClassElement("single-item-view-sidebar-ACTIVITIES").click();
      }

    	// ALT + 9 = click on 'Versions' button
    	if (altKey && code === ascii('9'))
      {
        getActiveClassElement("single-item-view-sidebar-HISTORY").click();
      }

    	// ALT + 0 = click on 'Synchronized Items' button
    	if (altKey && code === ascii('0'))
      {
        getActiveClassElement("single-item-view-sidebar-SYNCHRONIZED_ITEMS").click();
      }

    	// ALT + - = click on 'Sub Items' button
    	if (altKey && code === 173)
      {
        getActiveClassElement("single-item-view-sidebar-FOLDER_LIST").click();
      }
      
    	// ALT + F = Perform "Find me" action
    	// ALT + Shift + F = Advanced Search
			if (altKey && code === ascii('F'))
      {
        if (shiftKey)
        {
          var advSearchBtn = getGuiButton("Advanced search");
          if (advSearchBtn)
          {
            advSearchBtn.click();
            setTimeout(focusOnNameOfFilter, 500);
            evt.preventDefault();
          }
        }
        else
        {
          var actionButton = getGuiButton("Actions");
          var viewlink = getViewLink();

          if (actionButton)
          {
            actionButton.click();
            var findMeMenuItem = getMenuItem("Find me");
            findMeMenuItem.click();
            evt.preventDefault();
          }
          else if (viewlink)	// find a folder
          {
            viewlink.click();

            setTimeout(findAFolder, 500);
            evt.preventDefault();
          }
        }
      }
    
    	// ALT + V = Click 'View' button - for items
      // (or 'View' link - for folders)
    	if (altKey && code === ascii('V'))
      {
        viewlink = getViewLink();
        if (viewlink)
        {
          viewlink.click();
          evt.preventDefault();
        }
        else
        {
          getGuiButton("View").click();
          evt.preventDefault();
        }
      }

    	// ALT + A = Click 'Actions' button
    	if (altKey && code === ascii('A'))
      {
        getGuiButton("Actions").click();
        evt.preventDefault();
      }

    	// ALT + E = Click 'Export' button
    	// ALT + Shift + E = Click 'Edit' button
    	if (altKey && code === ascii('E'))
      {
        if (shiftKey)
        {
          getActiveClassElement('fa-pencil').click();
          //getGuiButton("Edit").click();
          evt.preventDefault();
        }
        else
        {
          getGuiButton("Export").click();
          evt.preventDefault();
        }
      }

    	// ALT + C = Cancel edit
    	if (altKey && code == ascii('C'))
      {
        var cancel = getActiveClassElementWithText('btn', 'Cancel');
        if (cancel)
        {
          cancel.click();
          return;
        }
        cancel = getGuiButton('Cancel');
        if (cancel)
        {
          cancel.click();
          return;
        }
      }
    
    	// ALT + D = "Save & done"
    	if (altKey && code === ascii('D'))
      {
        var done = getActiveClassElementWithText('btn', 'Save & done');
        if (done)
        {
          done.click();
          evt.preventDefault();
          return;
        }
      }
    
    	// ALT + H = Go back in browser history
    	if (altKey && code === ascii('H'))
      {
        window.history.back();
        evt.preventDefault();
      }
    
    	// ALT + L = Go forward in browser history
    	if (altKey && code === ascii('L'))
      {
        window.history.forward();
      }
    
    	// ALT + Shift + J = Focus in left pane
    	// ALT + J = Go down a list of items within a folder-view
      if (altKey && code === ascii('J'))
      {
        if (shiftKey)
        {
        	document.getElementsByClassName("j-item-tree")[0].getElementsByClassName("x-panel-body")[0].focus()
        }
        else
        {
          goDownListOfItemsInFolderView();
        }
      }

    	// ALT + Shift + K = Focus in main pane
    	// ALT + K = Go up a list of items within a folder-view
    	if (altKey && code === ascii('K'))
      {
        if (shiftKey)
        {
        	focusOnMainPane();
        }
        else
        {
          goUpListOfItemsInFolderView();
        }
      }
    	// Space-bar or ALT + S = select items in a folder-view
      if ((code === 32) || (altKey && code === ascii('S')))
      {

        if (toggleCurrentFolderViewItemSelection())
          evt.preventDefault();
      }
    	// ALT + M = Click on the currently focused element (for visiting the selected item within the folder-view)
      if (altKey && code === ascii('M'))
      {
        document.activeElement.click();
      }

    	// ALT + . = Go to next tab
      if (altKey && code === 190)
      {
        var tabs = document.getElementsByClassName('x-tab-strip-closable')
        if (tabs.length > 1)
        {
          for (i = 0; i < tabs.length; i++)
          {
            if (tabs[i].classList.contains("x-tab-strip-active"))
            {
              tabs[ (i + 1) % tabs.length ].click();
              return;
            }
          }
        }
        return;
      }
    
    	// ALT + , = Go to previous tab
      if (altKey && code === 188)
      {
        var tabs = document.getElementsByClassName('x-tab-strip-closable')
        if (tabs.length > 1)
        {
          for (i = 0; i < tabs.length; i++)
          {
            if (tabs[i].classList.contains("x-tab-strip-active"))
            {
              tabs[ (i + tabs.length - 1) % tabs.length ].click();
              return;
            }
          }
        }
        return;
      }
    
      // ALT + W = Close the current tab
      if (altKey && code === ascii('W'))
      {
        closeCurrentTab();
        return;
      }
    
  });
}());