// ==UserScript==
// @name         Facebook Saved Sorter
// @namespace    http://web.facebook.com
// @version      1.09.65
// @description  Add a sort collection button on facebook saved
// @author       You
// @match        *://w*.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39355/Facebook%20Saved%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/39355/Facebook%20Saved%20Sorter.meta.js
// ==/UserScript==

(function () {
  'use strict';

  ////////////////////////////
  //--- Global variables ---//
  ////////////////////////////

  var uscript = {
    name: 'FSS Bookmarklet',
    version: 'BM1.09.65'
  };
  var doctitle = document.title;
  var allowDefaultEvent = true;
  var oldHref = document.location.href;
  var showLogs = document.location.href.indexOf('#debug') > -1 ? true : false;
  var batchCnt = 5;
  var c = {
    log: (...e) => {
      if (!showLogs) return;
      var fin = e[0];
      if (e.length > 1) for (var i = 1; i < e.length; i++) {
        fin += ' ' + e[i];
      }
      console.log(fin);
    }
  };

  /////////////////////////
  //--- Node Creation ---//
  /////////////////////////

  // Identify which section record will go
  function getSectionDetails(inputTitle) {
    // TODO: Update Collections when necessary
    /* Updated Dec 27, 2019
    var b1 = ['A', 'B', 'C'];
    var b2 = ['D', 'E', 'F'];
    var b3 = ['G', 'H', 'I'];
    var b4 = ['J', 'K'];
    var b5 = ['L', 'M'];
    var b6 = ['N', 'O', 'P', 'Q', 'R', 'S', 'T'];
    var b7 = ['U', 'V', 'W', 'X', 'Y', 'Z'];

    var parsed = inputTitle.toUpperCase().charAt(0);

    if (b1.includes(parsed)) return { Name: "Batch A-C", Id: "1846974831980328" };
    else if (b2.includes(parsed)) return { Name: "Batch D-F", Id: "1846974721980339" };
    else if (b3.includes(parsed)) return { Name: "Batch G-I", Id: "1846974615313683" };
    else if (b4.includes(parsed)) return { Name: "Batch J-K", Id: "1846974415313703" };
    else if (b5.includes(parsed)) return { Name: "Batch L-M", Id: "1846974188647059" };
    else if (b6.includes(parsed)) return { Name: "Batch N-T", Id: "1846973948647083" };
    else return { Name: "Batch U-#", Id: "1846973748647103" };
    */

    var b1 = ['A', 'B', 'C'] //2884889611522173
    var b2 = ['D', 'E', 'F', 'G', 'H', 'I'] //2884889458188855
    var b3 = ['J', 'K'] //2884889201522214
    var b4 = ['L', 'M', 'N', 'O'] //2884888588188942
    var b5 = ['P', 'Q', 'R', 'S', 'T'] //2884887851522349
    var b6 = ['U', 'V', 'W', 'X', 'Y', 'Z'] //2884887038189097
    var b7 = ['#'] // 2884889831522151

    var parsed = inputTitle.toUpperCase().charAt(0);

    if (b1.includes(parsed)) return { Name: "Unit A-C", Id: "2884889611522173" };
    else if (b2.includes(parsed)) return { Name: "Unit D-I", Id: "2884889458188855" };
    else if (b3.includes(parsed)) return { Name: "Unit J-K", Id: "2884889201522214" };
    else if (b4.includes(parsed)) return { Name: "Unit L-O", Id: "2884888588188942" };
    else if (b5.includes(parsed)) return { Name: "Unit P-T", Id: "2884887851522349" };
    else if (b6.includes(parsed)) return { Name: "Unit U-Z", Id: "2884887038189097" };
    else return { Name: "Unit #", Id: "2884889831522151" };

  }

  // Generate "Add to Section" based on record title
  function getAddCollectionLink(titleName, savedTagId) {
    var details = getSectionDetails(titleName);
    var sectionName = details['Name'];
    var sectionId = details['Id'];
    var anchor = '<a id="object-tag-' + savedTagId + '" href="#" rel="async-post" ajaxify="/save/list/mutate/?action=SAVE_IN_EXISTING_LIST&amp;object_id=' + savedTagId + '&amp;list_id=' + sectionId + '&amp;mechanism=add_to_list_button&amp;surface=save_dashboard" role="menuitem">Add to ' + sectionName + '</a>';
    //anchor = anchor + '<br><a id="hide-tag-' + savedTagId + '" href="#">Hide</a>';
    return anchor;
  }

  // Unsave all records
  function clickFromCollection(action) {
    document.title = doctitle + " | Auto " + action;
    var allNodesRaw = document.querySelectorAll('._5wcf [id^=saved-item-tags-]');
    if (!(allNodesRaw && allNodesRaw.length > 0)) {
      c.log('No nodes found.');
      return;
    }
    for (var i = 0; i < allNodesRaw.length; i++) {
      var parentDiv = allNodesRaw[i].closest('._5wcf');
      if (action === 'save') {
        c.log('Auto saving: ', parentDiv);
        performMiddleClick(parentDiv, true, true);
      }
      else if (action === 'delete') {
        c.log('Auto deleting: ', parentDiv);
        performRightClick(parentDiv, true, true);
      }
    }
    document.title = doctitle;
  }

  // Toggle auto scrolling
  function toggleAutoScroll() {
    if (document.querySelector('#sortCollection').innerText == "Sort Collection") {
      // Check if already sorted
      if (window.sortedNodes && window.sortedNodes.length > 0) {
        alert('Records are already sorted');
        return;
      }
      c.log('Starting auto scroller...');
      document.querySelector('#sortCollection').innerText = 'Cancel Sorting';
      window.sorter = setInterval(function () {
        if (document.querySelectorAll('.uiMorePager').length > 0) {
          c.log('Scrolling to view');
          document.title = doctitle + ' | Scrolling...';
          window.scrollTo(0, document.body.scrollHeight);
        }
        else {
          window.scrollTo(0, document.body.scrollHeight);
          c.log('Stopping auto scroller...');
          document.title = doctitle;
          clearInterval(window.sorter);
          generateNodeObjects();
        }
      }, 1000);
    }
    else {
      resetState();
      document.title = doctitle;
    }
    toggleSortButtonClass();
  }

  // Add/remove class on sort button based on viewport
  function toggleSortButtonClass() {
    var sortBtn = document.querySelector('#sortCollection');
    if (sortBtn.innerText == "Sort Collection") {
      sortBtn.classList.add('_4jy0');
      sortBtn.classList.remove('_4jy0mod');
    }
    else {
      // Get div bounds if not in viewport
      var bounding = document.querySelector('#entity_sidebar > div').getBoundingClientRect();
      if (bounding.top >= 0 &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)) {
        console.log('In the viewport!');
        sortBtn.classList.add('_4jy0');
        sortBtn.classList.remove('_4jy0mod');
      }
      else {
        console.log('Not in the viewport... whomp whomp');
        sortBtn.classList.remove('_4jy0');
        sortBtn.classList.add('_4jy0mod');
      }
    }
  }

  // Generates newNodes and sortedNodes object
  function generateNodeObjects() {
    // Sort algorithm to prototype
    Array.prototype.sortBy = function (p) { return this.slice(0).sort(function (a, b) { return (a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0; }); };
    // View fragments
    var fragments = document.querySelectorAll('[id^=saved-item-tags-]');
    var newNodes = [];
    var sortedNodes = [];
    window.newNodes = newNodes;
    window.sortedNodes = sortedNodes;

    // Loop main fragments
    c.log('Fetching nodes...');
    for (var fx = 0; fx < fragments.length; fx++) {
      var parentNode = fragments[fx].closest('._5wcf');
      var anchors = parentNode.querySelectorAll('a');
      var title = anchors[anchors.length - 1].innerText;
      // var newNode = { title: title, node: parentNode, objectId: fragments[fx].id.replace('saved-item-tags-', ''), outLink: anchors[anchors.length - 1], batch: title.toUpperCase().charAt(0) };
      var newNode = { title: title, node: parentNode, objectId: fragments[fx].id.replace('saved-item-tags-', ''), outLink: anchors[1], batch: title.toUpperCase().charAt(0) };
      c.log('Pushing to newNode:' + fragments[fx].id.replace('saved-item-tags-', ''));
      newNodes.push(newNode);
    }

    // Sort newNodes by title
    c.log('Sorting nodes...');
    sortedNodes = newNodes.sortBy('title');

    c.log('Nodes sorted!');
    window.scrollTo(0, 0);
    document.querySelector('#sortCollection').innerText = "Sort Collection";

    window.newNodes = newNodes;
    window.sortedNodes = sortedNodes;

    populateGeneratedNodeObjects(2);
  }

  // Populate records based on generated newNodes and sortedNodes objects
  function populateGeneratedNodeObjects(index) {
    // Sort by Name
    c.log("Start");
    var targetNodes;
    var dupCount = 0;

    if (index == 0)
      targetNodes = window.sortedNodes;
    else if (index == 1)
      targetNodes = window.newNodes;
    else if (index == 2)
      targetNodes = window.newNodes.slice().reverse();

    // Delete num tags
    var numtags = document.querySelectorAll('.numtag');
    for (var nx = 0; nx < numtags.length; nx++)
      numtags[nx].remove();

    // Remove duplicate class
    var dupDiv = document.querySelectorAll('._dup1, ._dup2, ._firstnode')
    for (var dx = 0; dx < dupDiv.length; dx++)
      dupDiv[dx].classList.remove('_dup1', '_dup2', '_firstnode');

    // Clear current nodes
    document.querySelector('#saveContentFragment').innerHTML = '<div class="_5wcf _5xmz _fakedup">' +
      'Total Items:&nbsp;<span id="itemCount">0</span>&emsp;' +
      'Duplicates:&nbsp;<span id="dupCount">0</span>' +
      '<div class="rfloat _ohf">' +
      '<a href="#" id="refreshNodes">Refresh</a>&nbsp;|&nbsp;' +
      '<a href="#" id="exportNodes">Export to file</a>' +
      '</div>'
    '</div>';
    document.querySelector('#shortcuts').innerHTML = "";

    // Clear exportable nodes
    window.exportableNodes = [];

    // Create refresh button
    document.querySelector('#refreshNodes').addEventListener("click", () => {
      populateGeneratedNodeObjects(document.querySelector('#sortOptions').selectedIndex);
    }, false);

    // Create export button
    document.querySelector('#exportNodes').addEventListener("click", () => {
      exportNodeObjects();
    }, false);

    // Loop through generated nodes
    var prevAnchor = "";
    var newHeaderItem = false;
    for (var i = 0; i < targetNodes.length; i++) {
      (function (currentNode) {
        c.log('Adding sorted: ' + currentNode.objectId);
        var currentAnchor;
        // Highlight first item
        if (i == 0) {
          currentNode.node.classList.add('_highlighted-item');
          window.selectedIndex = 0;
        }

        // Sorted by title/Name (Asc/Desc)
        if (index === 0) {
          currentAnchor = currentNode.batch;
          if (currentAnchor != prevAnchor) {
            c.log("Adding header: [" + prevAnchor + "] to [" + currentAnchor + "]")
            var template = document.createElement('template');
            template.innerHTML = '<div id="starts-with-' + currentAnchor + '" class="_5wcf _5xmz">Starts With ' + currentAnchor + '</div>';
            var headerAnchor = template.content;
            document.querySelector('#saveContentFragment').appendChild(headerAnchor);
            var cnt = targetNodes.filter(o => o.batch == currentAnchor).length;
            generateHeaderShortcut('starts-with-' + currentAnchor, currentAnchor, cnt + ' items');
            newHeaderItem = true;
          }
        }
        // Sorted by post date (Asc/Desc)
        else if (index === 2 || index === 1) {
          var itemNumPerBatch = 5;
          var itemOrder = i + 1;
          var quotient = Math.floor(itemOrder / itemNumPerBatch);
          if (itemOrder % itemNumPerBatch) quotient++;

          var maxItemNum = itemNumPerBatch * quotient;
          var minItemNum = maxItemNum - itemNumPerBatch + 1;

          currentAnchor = minItemNum + "to" + maxItemNum;
          if (currentAnchor != prevAnchor) {
            c.log("Adding header: [" + prevAnchor + "] to [" + currentAnchor + "]")
            var template = document.createElement('template');
            template.innerHTML = '<div id="batch-' + currentAnchor + '" class="_5wcf _5xmz">' + minItemNum + " to " + maxItemNum + '</div>';
            var headerAnchor = template.content;
            document.querySelector('#saveContentFragment').appendChild(headerAnchor);
            generateHeaderShortcut('batch-' + currentAnchor, '#' + minItemNum);
            newHeaderItem = true;
          }
        }

        // Look for duplicates, if found, add _dup1 to first duplicated instance
        if (i > 0) {
          var initNode = Array.from(document.querySelectorAll('#saveContentFragment .fcg')).find((obj) => obj.textContent.indexOf(currentNode.title) > -1);
          if (initNode) {
            dupCount++;
            var prevNode = initNode.closest('._5wcf')
            currentNode.node.classList.add('_dup1');
            if (!prevNode.classList.contains('_dup2')) {
              prevNode.classList.add('_dup2');
              dupCount++;
            }
          }
        }

        // If first node in a header item
        if (newHeaderItem) {
          newHeaderItem = false;
          currentNode.node.classList.add('_firstnode');
        }

        // Add node record
        document.querySelector('#saveContentFragment').appendChild(currentNode.node);
        var nodeAnchors = currentNode.node.querySelectorAll('a');
        currentNode.node.querySelectorAll('a')[1].innerHTML = '<span class="numtag">#' + (i + 1) + '&nbsp;</span>' + currentNode.node.querySelectorAll('a')[1].innerHTML;
        // Create exportable record
        var exportable = [
          currentNode.title,
          nodeAnchors[nodeAnchors.length - 1].href,
          currentNode.outLink.href,
        ];

        window.exportableNodes.push(exportable);

        prevAnchor = currentAnchor;
      })(targetNodes[i]);
    }

    document.querySelector('#sortOptions').selectedIndex = index;
    document.querySelector('#sortBlock').style.display = "block";
    document.querySelector('#itemCount').innerText = targetNodes.length;
    document.querySelector('#dupCount').innerText = dupCount;
    c.log("End");

    window.duplicateIndex = 0;
    window.selectedIndex = 0;
    window.allNodesRaw = document.querySelectorAll('._5wcf [id^=saved-item-tags-]');
    cycleAllNodes(0);
    toggleSortButtonClass();
  }

  // Create jump shortcuts based on first letter of the title
  function generateHeaderShortcut(target, label, count) {
    var len = 1 + document.querySelectorAll('#shortcuts a').length;
    var template = document.createElement('template');
    c.log(len);
    //template.innerHTML = '<a onclick="document.querySelector(`#' + target + '`).scrollIntoView(true); window.scrollBy(0, -50); return false;" href="#" class="_42ft _4jy0  _4jy3  selected _jumpShortcut" title="' + (count ? count : "") + '">' + label + '</a>';
    template.innerHTML = '<a onclick="updateSelectedIndex(document.querySelector(`#' + target + ' + ._5wcf [id^=saved-item-tags-]`).id.replace(`saved-item-tags-`, ``)); cycleAllNodes(0,false,-125); return false;" href="#" class="_42ft _4jy0  _4jy3  selected _jumpShortcut" title="' + (count ? count : "") + '">' + label + '</a>';
    if (len % 4 == 0) template.innerHTML += "<br>";
    var headerAnchor = template.content;
    document.querySelector('#shortcuts').appendChild(headerAnchor);
  }

  // Export nodes to file (CSV or HTML)
  function exportNodeObjects() {
    var exp = window.exportableNodes;
    var finalData = 'Poster Name, Poster Profile,Poster Link\n';
    var filename = 'Inventory Report.csv';
    for (var i = 0; i < exp.length; i++) {
      var rec = exp[i].join(',') + '\n';
      finalData += rec;
    }
    if (!finalData.match(/^data:text\/csv/i))
      finalData = 'data:text/csv;charset=utf-8,' + finalData;
    var data = encodeURI(finalData);
    var link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
    link.remove();

    console.log(finalData);
  }

  //////////////////////
  //--- Navigation ---//
  //////////////////////

  // Determine if node is visible in the client's viewport
  function isInViewport(el) {
    var r, html;
    if (!el || 1 !== el.nodeType) { return false; }
    html = document.documentElement;
    r = el.getBoundingClientRect();

    // Print coordinates for debugging
    c.log('Client: T:%s, B:%s, L:%s, R:%s', r.top, r.bottom, r.left, r.right);
    c.log('HTML: W:%s, H:%s', html.clientWidth, html.clientHeight);
    // return false;
    return (!!r
      && r.top > 150
      && r.bottom > 0
      && r.bottom < html.clientHeight
      && r.top <= html.clientHeight
    );
  }

  // Update window.selectedIndex based on item-#
  function updateSelectedIndex(objectId) {
    var allNodesRaw = document.querySelectorAll('._5wcf [id^=saved-item-tags-]');
    if (!(allNodesRaw && allNodesRaw.length > 0)) {
      c.log('No nodes found.');
      return;
    }

    c.log('Object ID recv: ', objectId);
    for (var i = 0; i < allNodesRaw.length; i++) {
      if (allNodesRaw[i].id.contains('-' + objectId)) {
        window.selectedIndex = i;
        c.log('Object found at idx:', i);
        return;
      }
    }
  }

  // Cycle through duplicates
  function cycleDupNodes(step, cycleHeadersOnly = false) {
    // Get all nodes
    var allNodesRaw = document.querySelectorAll('._5wcf [id^=saved-item-tags-]');
    // Get original selectedIndex
    var prevIndex = window.selectedIndex;
    // Detect which direction to loop
    if (step > 0) {
      // Look for duplicates forward
      for (var i = (prevIndex + 1); i < allNodesRaw.length; i++) {
        if (!allNodesRaw[i]) break;
        // Get parent div
        var parentDiv = allNodesRaw[i].closest('._5wcf');
        // Extract object id
        var objId = allNodesRaw[i].id.replace('saved-item-tags-', '');
        // Flag if node matched
        var matchedNode = false
        // If parend div is existing, check if css for duplicate is applied
        if (parentDiv) {
          if (cycleHeadersOnly) {
            if (parentDiv.classList.contains('_firstnode'))
              matchedNode = true
          }
          else {
            if (parentDiv.classList.contains('_dup1') || parentDiv.classList.contains('_dup2'))
              matchedNode = true;
          }

          if (matchedNode) {
            c.log('Shifting to next obj: ', objId);
            updateSelectedIndex(objId);
            break;
          }
        }
      }
    }
    else {
      // Look for duplicates backward
      for (var i = (prevIndex - 1); i >= 0; i--) {
        if (!allNodesRaw[i]) break;
        var parentDiv = allNodesRaw[i].closest('._5wcf');
        var objId = allNodesRaw[i].id.replace('saved-item-tags-', '');
        // Flag if node matched
        var matchedNode = false
        // If parend div is existing, check if css for duplicate is applied
        if (parentDiv) {
          if (cycleHeadersOnly) {
            if (parentDiv.classList.contains('_firstnode'))
              matchedNode = true
          }
          else {
            if (parentDiv.classList.contains('_dup1') || parentDiv.classList.contains('_dup2'))
              matchedNode = true;
          }

          if (matchedNode) {
            c.log('Shifting to next obj: ', objId);
            updateSelectedIndex(objId);
            break;
          }
        }
      }
    }


    if (prevIndex !== window.selectedIndex) {
      cycleAllNodes(0);
    }
    else {
      if (step > 0)
        cycleAllNodes(9999);
      else
        cycleAllNodes(-9999);
    }
  }

  // Cyle through all records (new)
  function cycleAllNodes(step, noScroll, scrollValue) {
    // List all nodes
    var allNodesRaw;
    if (window.allNodesRaw && window.allNodesRaw.length > 0) {
      c.log('Using window.allNodesRaw');
      allNodesRaw = window.allNodesRaw;
    }
    else
      c.log('Using document qs allNodesRaw');
    allNodesRaw = document.querySelectorAll('._5wcf [id^=saved-item-tags-]');
    if (!(allNodesRaw && allNodesRaw.length > 0)) {
      c.log('No nodes found.');
      return;
    }

    // Get highlighted element, if none found select first element
    var highlighted = document.querySelectorAll('._highlighted-item')
    if (!highlighted || highlighted.length == 0) {
      if (window.selected <= 0) {
        c.log('No highlighted row. Selecting first one...');
        window.selectedIndex = 0;
      }
    }

    // Increment based on input value
    for (var i = 0; i < highlighted.length; i++)
      highlighted[i].classList.remove('_highlighted-item');
    window.selectedIndex += step;


    // Compare index vs allnodes
    if (window.selectedIndex >= allNodesRaw.length)
      window.selectedIndex = allNodesRaw.length - 1;
    else if (window.selectedIndex < 0)
      window.selectedIndex = 0;

    // Get parent div of from selected node
    var parentDiv = allNodesRaw[window.selectedIndex].closest('._5wcf');
    if (parentDiv) {
      parentDiv.classList.add('_highlighted-item');
      parentDiv.focus();

      // Scroll to node by default
      if (!noScroll) {
        c.log('Stepping: ', step);
        // If parent Div is not in view, scroll to it
        if (!isInViewport(parentDiv)) {
          parentDiv.scrollIntoView(true);
          // Apply only if first or middle nodes are selected
          if (step !== 9999 && window.selectedIndex !== (allNodesRaw.length - 1)) {
            // Set scrollvalue if not specified
            if (!scrollValue) {
              // Scroll 60% of client height
              if (step > 0) scrollValue = document.documentElement.clientHeight * 0.5 * -1;
              // Default to -125px to accomodate node headers
              else scrollValue = -125;
            }

            // Scroll offset
            c.log('Scrolling offset: ', scrollValue);
            window.scrollBy(0, scrollValue);

            // Validate if selection box is fully shown, if not scroll by additional -100px
            setTimeout(() => {
              if (!isInViewport(parentDiv)) {
                parentDiv.scrollIntoView(true);
                if (step > 0) scrollValue = document.documentElement.clientHeight * 0.1;
                else scrollValue = -125
                window.scrollBy(0, scrollValue);
              }
            }, 10);
          }
        }
      }
    }
  }

  // Cycle through sort options
  function cycleAllSortOptions(step, usejump = false) {
    // Get dropdown object
    var sortDropDown = document.querySelector('#sortOptions');
    var targetNodes = window.sortedNodes;

    // If dropdown is not found, exit immediately
    if (!sortDropDown) return;
    if (!window.sortedNodes) return;

    // Set index based on step value
    if (!usejump) {
      // Set new index
      var newIndex = sortDropDown.selectedIndex + step;
      // If new index exceeded item count, reset to 0
      if (newIndex >= sortDropDown.length)
        newIndex = 0;
      else if (newIndex < 0)
        newIndex = sortDropDown.length - 1;
    }
    // Set index based on input value
    else {
      newIndex = step;
    }

    // Apply new index to dropdown and populate nodes
    sortDropDown.selectedIndex = newIndex;

    // Check for sortedNodes and newNodes object
    if (!targetNodes || targetNodes.length === 0) {
      c.log('No nodes to sort. Exiting...');
      return;
    }
    populateGeneratedNodeObjects(newIndex);
  }

  ///////////////////////////
  //--- Event functions ---//
  ///////////////////////////

  // Prevents triggering default functions (for MouseUp and ContextMenu events)
  function nullFunction(e) {
    if (allowDefaultEvent) return true;
    c.log('Mouse up' + e.which);
    if (e) e.preventDefault();
    return false;
  }

  // Hooks mouse events to target nodes
  function nodeExtended(e) {
    allowDefaultEvent = false;
    var parentDiv = e.target.closest('._5wcf')
    if (parentDiv == null || parentDiv.children == null) {
      c.log('parent div not found. exiting...');
      allowDefaultEvent = true;
      return;
    }
    if (!parentDiv.querySelector('[id^=saved-item-tags-]').id) return;
    var objectId = parentDiv.querySelector('[id^=saved-item-tags-]').id.replace('saved-item-tags-', '');
    var anchors = parentDiv.querySelectorAll('a');
    var title = anchors[anchors.length - 1].innerText;

    updateSelectedIndex(objectId);
    if (e.which && e.which == 1 && e.target.tagName.toLowerCase() === "div") {
      performLeftClick(parentDiv, true);
      return;
    }
    else if (e.which && e.which == 2) {
      performMiddleClick(parentDiv, true);
    }
    else if (e.which && e.which == 3) {
      e.preventDefault();
      e.stopImmediatePropagation();
      performRightClick(parentDiv, true);
      return false;
    }
  }

  // Triggered upon changing value in sorted by dropdown
  function sortExtended(e) {
    // Delete num tags
    var numtags = document.querySelectorAll('.numtag');
    for (var nx = 0; nx < numtags.length; nx++) {
      numtags[nx].remove();
    }
    populateGeneratedNodeObjects(e.target.selectedIndex);
  }

  // Perform left click on parent node (Open in new tab)
  function performLeftClick(parentDiv, noScroll = false, autoRedirect = false) {
    c.log('Performing left click to:', parentDiv);
    if (parentDiv == null || parentDiv.children == null) {
      c.log('parent div not found. exiting...');
      allowDefaultEvent = true;
      return;
    }
    if (!parentDiv.querySelector('[id^=saved-item-tags-]').id) return;
    var objectId = parentDiv.querySelector('[id^=saved-item-tags-]').id.replace('saved-item-tags-', '');
    var anchors = parentDiv.querySelectorAll('a');
    //var targetAnchor = anchors[anchors.length - 1];
    var targetAnchor = anchors[1];
    var title = targetAnchor.innerText;
    if (autoRedirect) {
      targetAnchor = anchors[anchors.length - 1];
      window.open(targetAnchor.href + "#fss_redir", "");
    }
    else {
      targetAnchor = anchors[1];
      window.open(targetAnchor.href, "");
    }
    setTimeout(() => cycleAllNodes(0, noScroll), 10);
  }

  // Perform middle click on parent node (Add to collection)
  function performMiddleClick(parentDiv, noScroll = false, autoConfirm = false) {
    c.log('Performing middle click to:', parentDiv);
    if (parentDiv == null || parentDiv.children == null) {
      c.log('parent div not found. exiting...');
      allowDefaultEvent = true;
      return;
    }
    if (!parentDiv.querySelector('[id^=saved-item-tags-]').id) return;
    var objectId = parentDiv.querySelector('[id^=saved-item-tags-]').id.replace('saved-item-tags-', '');
    var anchors = parentDiv.querySelectorAll('a');
    var title = anchors[anchors.length - 1].innerText;
    if (autoConfirm || confirm('Add ' + title + ' to ' + getSectionDetails(title)["Name"] + ' collection?')) {
      var addSectionLink = parentDiv.querySelector('[id^=object-tag-]');
      if (addSectionLink == null) {
        c.log('Adding section link: ' + objectId);
        // Create temporary link and dispose immediately
        var template = document.createElement('template');
        template.innerHTML = getAddCollectionLink(title, objectId);
        var newCollectionLink = template.content.firstChild;
        parentDiv.appendChild(newCollectionLink);
        newCollectionLink.click();
        newCollectionLink.remove();
        newCollectionLink = null;
        template = null;

        // Format CSS classes
        parentDiv.classList.add('_5voi');
        parentDiv.style.pointerEvents = 'none';
        parentDiv.classList.remove('_dup2', '_dup1');
        parentDiv.classList.add('_addedToList');

        // Format text
        parentDiv.querySelector('._x17').innerHTML = 'Added to ' + getSectionDetails(title)["Name"];

        // Remove reference from objects
        window.sortedNodes = window.sortedNodes.filter((objId) => objId.objectId !== objectId);
        window.newNodes = window.newNodes.filter((objId) => objId.objectId !== objectId);
        window.allNodesRaw = document.querySelectorAll('._5wcf [id^=saved-item-tags-]');
        cycleAllNodes(0, !autoConfirm);
        return;
      }
      else {
        c.log('Object tag not found');
      }
    }
  }

  // Perform right click on parent node (Remove/Unsave from collection)
  function performRightClick(parentDiv, noScroll = false, autoConfirm = false) {
    c.log('Performing right click to:', parentDiv);
    if (parentDiv == null || parentDiv.children == null) {
      c.log('parent div not found. exiting...');
      allowDefaultEvent = true;
      return;
    }
    if (!parentDiv.querySelector('[id^=saved-item-tags-]').id) return;
    var objectId = parentDiv.querySelector('[id^=saved-item-tags-]').id.replace('saved-item-tags-', '');
    var anchors = parentDiv.querySelectorAll('a');
    var title = anchors[anchors.length - 1].innerText;
    console.log('title is: ' + title);
    setTimeout(() => {
      if (autoConfirm || confirm('Remove ' + title + '?')) {
        // Format CSS classes
        parentDiv.querySelector('._5voj.img').click();
        parentDiv.classList.add('_removedFromList');
        parentDiv.classList.add('_5voi');
        parentDiv.style.pointerEvents = 'none';
        parentDiv.classList.remove('_dup2', '_dup1', '_firstnode', '_5wcf');
        // Remove reference from objects
        window.sortedNodes = window.sortedNodes.filter((objId) => objId.objectId !== objectId);
        window.newNodes = window.newNodes.filter((objId) => objId.objectId !== objectId);
        window.allNodesRaw = document.querySelectorAll('._5wcf [id^=saved-item-tags-]');
        setTimeout(() => cycleAllNodes(0, noScroll), 10);
      }
    }, 4);
  }

  // Simulate a mouse click triggering only the mousedown event
  function triggerMouseEvent(node) {
    c.log('Raising mousedown in', node);
    var clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent('mousedown', true, true);
    node.dispatchEvent(clickEvent);
  }

  /////////////////////////
  //--- Bootstrapping ---//
  /////////////////////////

  // Sleep function
  function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds) {
        break;
      }
    }
  }

  // Redirect to profile
  function fssRedirect(clickUserPost = false) {
    // If profile pic, click it
    var ref_pic = document.querySelector('.profilePicThumb');
    var ref_vid = document.querySelector('.profilePicThumb a');
    if (ref_vid) {
      c.log('Profile vid detected: ', ref_vid);
      ref_vid.click();
      window.parent.location.hash = '?';
      return;
    }
    else if (ref_pic) {
      c.log('Profile pic detected: ', ref_pic);
      ref_pic.click();
      window.parent.location.hash = '?';
      return;
    }
    // If not check if userpost
    else {
      if (!clickUserPost) {
        return;
      }
      // If userpost, navifate to it
      var ref_url = document.querySelector('._5pcr.userContentWrapper .clearfix._42ef a').href;
      c.log('User post detected: ', ref_pic);
      if (ref_url) window.location.assign(ref_url + '#fss_redirect');
      return;
    }
  }

  // Clear sortedNodes and newNodes on navigation
  function resetState() {
    // Skip if not yet initialized
    if (!window.sorterInitialized) return;
    // Set button labels to default
    document.querySelector('#sortCollection').innerText = "Sort Collection";
    document.querySelector('#sortBlock').style.display = "none";
    // Clear out arrays
    window.newNodes = [];
    window.sortedNodes = [];
    window.allNodesRaw = [];
    window.exportableNodes = [];
    // Set indices to default
    window.duplicateIndex = 0;
    window.selectedIndex = 0;
    // Clear auto scroller
    clearInterval(window.sorter);
    // Set highlight to first record
    cycleAllNodes(0, true);
  }

  // Initialize buttons and dropdowns
  function initializeObjects() {
    if (window.location.href.indexOf('saved') <= -1) {
      var min = 2500, max = 3000;
      var randomSleep = Math.floor(Math.random() * (max - min + 1) + min);
      setTimeout(() => {
        var isRedirectValid = document.location.href.indexOf('fss_redir') > 0 ? true : false;
        if (isRedirectValid) {
          c.log('Redirect flag found. Redirecting page...');
          fssRedirect();
        }
      }, randomSleep);
      // else {
      c.log('Not a valid Facebook Saved page. Exiting...');
      // }
      return;
    }
    else if (window.sorterInitialized) {
      c.log('Hooks already initialized. Exiting');
      return;
    }
    c.log("Initializing...");
    createCSStyles();

    c.log("Adding Sort Menu...");
    document.querySelector('#entity_sidebar').innerHTML = document.querySelector('#entity_sidebar').innerHTML +
      '<div class="_3-8z"><a href="#" title="' + uscript.name + ' ' + uscript.version + '" class="_42ft _4jy0 _583_ _4jy3 _4jy1" id="sortCollection">Sort Collection</a>' +
      '<div id="sortBlock" style="width: 100%; display:none;">' +
      '<div class="_3miz">Sort Options</div><select id="sortOptions" style="width: 100%;">' +
      '<option>By Poster</option>' +
      '<option>By Post Date (Latest first)</option>' +
      '<option selected>By Post Date (Oldest first)</option>' +
      '</select>' +
      '<div class="_3miz _wrap" id="shortcuts">&nbsp;</div>' +
      '</div></div>';
    c.log("Done");


    c.log("Setting up Sort Collection button...");
    document.querySelector('#sortCollection').addEventListener("contextmenu", nullFunction, false);
    document.querySelector('#sortCollection').addEventListener("mouseup", nullFunction, false);
    document.querySelector('#sortCollection').addEventListener("mousedown", (e) => {
      if (e.which && e.which == 3) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => { if ('delete' === prompt('Proceeding will REMOVE ALL posts. Type "delete" to continue.')) clickFromCollection('delete'); }, 4);
        return false;
      }
      else if (e.which && e.which == 2) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => { if ('save' === prompt('Proceeding will SAVE ALL posts. Type "save" to continue.')) clickFromCollection('save'); }, 4);
        return false;
      }
      else if (e.which && e.which == 1) {
        toggleAutoScroll();
      }
    }, false);
    c.log("Done");

    c.log("Setting up Content container...");
    document.querySelector('#content_container').addEventListener("mouseup", nullFunction, false);
    document.querySelector('#content_container').addEventListener("contextmenu", nullFunction, false);
    document.querySelector('#content_container').addEventListener('mousedown', nodeExtended, false);
    c.log("Done");

    c.log("Setting up Sort Options dropbdown...");
    document.querySelector('#sortOptions').addEventListener('change', sortExtended, false);
    c.log("Done");


    window.sorterInitialized = true;
    window.cycleAllNodes = cycleAllNodes;
    window.cycleDupNodes = cycleDupNodes;
    window.updateSelectedIndex = updateSelectedIndex;
    window.triggerMouseEvent = triggerMouseEvent;

    window.performLeftClick = performLeftClick;
    window.performMiddleClick = performMiddleClick;
    window.performRightClick = performRightClick;

    window.isInViewport = isInViewport;

    c.log("Initialization done", uscript.name, uscript.version);
  }

  // Generate needed CSS
  function createCSStyles() {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        ._wrap {
            flex-wrap: wrap;
        }
        ._jumpShortcut {
            min-width: 30px !important;
            padding: 2px 2px 2px 2px !important;
        }
        ._saveHeader {
            position: relative; top: -50px; height:1px !important;
        }
        ._dup1 {
            background-color: LightCyan;
        }
        ._dup2 {
            background-color: Moccasin;
        }
        ._addedToList {
            background-color: LightBlue !important;
        }
        ._removedFromList {
            background-color: Moccasin !important;
        }
        ._highlighted-item {
            box-shadow: inset 0px 0px 5px 1px #cf0000;
        }
        ._4jy0mod {
            border: 1px solid;
            border-radius: 2px;
            box-sizing: content-box;
            font-size: 12px;
            -webkit-font-smoothing: antialiased;
            font-weight: bold;
            justify-content: center;
            padding: 0 8px;
            position: fixed;
            text-align: center;
            text-shadow: none;
            vertical-align: middle;
            bottom: 5px;
            left: 5px;
            width: 150px;
        }
        `;
    document.getElementsByTagName('head')[0].appendChild(style);
  }

  // Bind keyboard strokes to functions
  function bindKeys() {
    document.addEventListener('keyup', nullFunction, false);
    // TODO: Update key bindings
    document.addEventListener('keydown', function (event) {

      // Validate current URL
      var isURLValid = document.location.href.indexOf('saved') > 0 ? true : false;
      // If typing in a textbox, prevent from overriding event
      if (document.activeElement.tagName.toLowerCase() === 'input') return;
      // If pipe key is pressed
      // Exit if invalid url
      if (!isURLValid) {
        console.log('Binding simple keys only...');
        switch (event.key) {
          case ';':
          case '\\':
            fssRedirect(true);
            break;
        }
        return;
      }

      console.log('Binding workspace keys...');
      // Detect keypress and prevent default event if found
      var highlighted = document.querySelector('._highlighted-item');
      var keys = ['-', '=', '[', '\\', ']', 'ArrowLeft', 'ArrowRight', 'PageDown', 'PageUp', '{', '}'];

      if (keys.findIndex((o) => o == event.key) > -1) {
        allowDefaultEvent = false;
        event.preventDefault = true;
        event.stopImmediatePropagation();
      }
      switch (event.key) {
        // Functions shortcut

        // Sort nodes
        case "S":
          var sort_btn = document.querySelector('#sortCollection')
          if (sort_btn) {
            triggerMouseEvent(sort_btn);
          }
          break;

        // Refresh nodes
        case "R":
          var refr_btn = document.querySelector('#refreshNodes');
          if (refr_btn) refr_btn.click();
          break;

        //// Jump to sort options by step
        //case "P":
        //  cycleAllSortOptions(1);
        //  break;
        //case "O":
        //  cycleAllSortOptions(-1);
        //  break;

        // Jump to sort options by value
        case "P":
          cycleAllSortOptions(0, true);
          break;
        case "O":
          cycleAllSortOptions(1, true);
          break;
        case "I":
          cycleAllSortOptions(2, true);
          break;


        // Navigation
        case '.':
        case 'j':
          cycleAllNodes(1);
          break;
        case ',':
        case 'k':
          cycleAllNodes(-1);
          break;
        case 'PageUp':
          setTimeout(() => cycleAllNodes(-9999), 4);
          break;
        case 'PageDown':
          setTimeout(() => cycleAllNodes(9999), 4);
          break;

        // Dup navigation
        case '}':
          cycleDupNodes(1, true);
          break;
        case '{':
          cycleDupNodes(-1, true);
          break;
        case '>':
        case ']':
          cycleDupNodes(1);
          break;
        case '<':
        case '[':
          cycleDupNodes(-1);
          break;

        // Mouse events
        case '\\':
          {
            var prevIndex = -1;
            var cycleCnt = 0;
            //setTimeout(() => {
              batchCnt = prompt('Enter no. of items to open:', batchCnt);
              if (isNaN(batchCnt)) {
                batchCnt = 5;
                return;
              }
              for (var i = 0; i < batchCnt; i++) {
                if (prevIndex != window.selectedIndex) {
                  highlighted = document.querySelector('._highlighted-item');
                  if (highlighted) window.performLeftClick(highlighted, true, true);
                  prevIndex = window.selectedIndex;
                  if (window.selectedIndex != allNodesRaw.length - 1) cycleCnt += 1;
                  cycleAllNodes(1);
                }
              }
              c.log('Looping back: ' + cycleCnt);
              cycleAllNodes(-1 * cycleCnt);
            //}, 5);
          }
          break;

        case 'l':
          if (highlighted) window.performLeftClick(highlighted, true, true);
          break;

        case '|':
          {
            var prevIndex = -1;
            var cycleCnt = 0;
            //setTimeout(() => {
              batchCnt = prompt('Enter no. of items to open:', batchCnt);
              if (isNaN(batchCnt)) {
                batchCnt = 5;
                return;
              }
              for (var i = 0; i < batchCnt; i++) {
                if (prevIndex != window.selectedIndex) {
                  highlighted = document.querySelector('._highlighted-item');
                  if (highlighted) window.performLeftClick(highlighted, true);
                  prevIndex = window.selectedIndex;
                  if (window.selectedIndex != allNodesRaw.length - 1) cycleCnt += 1;
                  cycleAllNodes(1);
                }
              }
              c.log('Looping back: ' + cycleCnt);
              cycleAllNodes(-1 * cycleCnt);
            //}, 5);
          }
          break;

        case ':':
        case ';':
          if (highlighted) window.performLeftClick(highlighted, false);
          break;

        case '=':
          if (highlighted) window.performMiddleClick(highlighted, false);
          break;
        case '-':
          if (highlighted) window.performRightClick(highlighted, false);
          break;
        case '+':
          {
            setTimeout(() => {
              var s_num2Save = prompt('Enter no. of items to save:', 2);
              if (isNaN(s_num2Save)) {
                return;
              }
              for (var i = 0; i < s_num2Save; i++) {
                console.log('Saving ' + i);
                highlighted = document.querySelector('._highlighted-item');
                if (highlighted) window.performMiddleClick(highlighted, true, true);
                //cycleAllNodes(1);
              }
              cycleAllNodes(-1 * s_num2Save);
            }, 5);
          }
          break;
        case '_':
          {
            setTimeout(() => {
              var s_num2Unsave = prompt('Enter no. of items to unsave:', 2);
              if (isNaN(s_num2Unsave)) {
                return;
              }
              for (var i = 0; i < s_num2Unsave; i++) {
                console.log('Unsaving ' + i);
                highlighted = document.querySelector('._highlighted-item');
                if (highlighted) window.performRightClick(highlighted, true, true);
                cycleAllNodes(1);
              }
              cycleAllNodes(-1 * s_num2Unsave);
            }, 5);
          }
          break;
      }

      allowDefaultEvent = true;
    });
  }

  // Entry point function
  function main() {
    // Set user script details
    if (GM_info && GM_info.script) {
      uscript = {
        name: GM_info.script.name,
        version: GM_info.script.version
      };
    }

    // Detect if saved page
    var isURLValid = document.location.href.indexOf('saved') > 0 ? true : false;

    // Bind keyboard events
    bindKeys();

    if (isURLValid) {
      console.log('Saved page detected');

      // Call initialization function
      initializeObjects();
      // Reset to default state
      resetState();

      // Reinitialize object on URL changes if not initialized
      if (window.location.href.indexOf('fss_redirect') <= -1) {
        window.onload = function () {
          if (window.detectionInitialized) return;
          var bodyList = document.querySelector("body");
          var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
              if (oldHref != document.location.href) {
                oldHref = document.location.href;
                c.log("URL change detected: " + document.location.href);
                initializeObjects();
                resetState();
              }
            });
          });
          var config = { childList: true, subtree: true };
          observer.observe(bodyList, config);
          window.detectionInitialized = true;
        };
        window.detectionInitialized = true;
        c.log('New load event defined!');
      }
    }
    else {
      console.log('Normal page detected');
      setTimeout(() => {
        var isRedirectValid = document.location.href.indexOf('fss_redir') > 0 ? true : false;
        if (isRedirectValid) {
          c.log('Redirect flag found. Redirecting page...');
          fssRedirect();
        }
      }, 2000);
    }


  }

  main();
})();
