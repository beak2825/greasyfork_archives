// ==UserScript==
// @name        copyTorrentToRelated
// @namespace   https://avistaz.to/profile/dryeyes
// @description Copy current torrent row to Related Torrents section
// @match       *://cinemaz.to/torrent/*
// @match       *://avistaz.to/torrent/*
// @match       *://privatehd.to/torrent/*
// @version     0.9.8
// @grant       none
// @locale      English (en)
// @downloadURL https://update.greasyfork.org/scripts/36477/copyTorrentToRelated.user.js
// @updateURL https://update.greasyfork.org/scripts/36477/copyTorrentToRelated.meta.js
// ==/UserScript==
(function(){
  'use strict';

  function parseHTML (str) {
    let tmp = document.implementation.createHTMLDocument();
    tmp.body.innerHTML = str;
    if (tmp.body.children.length === 1) {
      return tmp.body.children[0];      
    } else {
      return tmp.body.children;      
    }
  }

  function injectFunc(fn) {
    var scriptElm = document.createElement('script');
    scriptElm.setAttribute("type", "application/javascript");
    scriptElm.textContent = '(' + fn + ')();';
    //scriptElm.async = false;  didn't help.
    document.body.appendChild(scriptElm); // run the script
    document.body.removeChild(scriptElm); // clean up
  }

  function getNoRelatedTorrentsNode () {
    var noTorrentsFoundNode = document.evaluate('//div[@id="collapseRelatedTorrents"]/div[@class="related-torrents"]/p[normalize-space()="No torrents found!"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    return noTorrentsFoundNode;
  }

  function getTableDataNode(tableCaption) {
    var xpathexp = `//tr/td[strong[contains(text(),'${tableCaption}')]]/following-sibling::td`;
    var tableDataNode = document.evaluate(xpathexp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    return tableDataNode;
  }

  var navbar;

  // takes into account current navbar height
  function scrollIDToTop(ID, evt) {
    evt.preventDefault(); // THIS stops browser from scrolling to top, but also blocks history.

    if (navbar !== undefined) {
      var newUrl = "#" + ID;
      history.pushState(null, ID, newUrl); // manually save position in history
      var elm = document.querySelector(newUrl);
      elm.scrollIntoView(true);
      window.scrollBy(0,-(navbar.offsetHeight + 10));
    }
    return false; // supposed to block browser from scrolling to top of page but doesn't work.
  }

  var cleanedUrl = window.location.href.replace(/(#.*)$/, '');
  var newTR;    // the copied <tr> element from related torrents query.
  var nRelated; // # of Related Torrents (including current)
  var atLeast;  // "+" if more than one page of torrents otherwise ""

  function addOnClickHandler(node,ID) {
    node.addEventListener("click", function(evt){scrollIDToTop(ID, evt); }, false);
  }

  function appendIconNode(grandParent, parent, ID) {
    var aNode = parent.querySelector("a");
    addOnClickHandler(aNode, ID);
    grandParent.appendChild(parent);
  }

  function addExtraInfo() {
    if (newTR === null)
      return;

    //Make "Sub:" text be link to Subtitles row
    var xpathexp = "//td/div/div/strong[contains(text(),'Sub:')]";
    var subNode = newTR.ownerDocument.evaluate(xpathexp, newTR, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    // dummy node creation to force jQuery.jstree.reference() to work in Chrome?
    var newSubNode = document.createElement('a'); 
    if (subNode !== null) {
      newSubNode = parseHTML('<a href="#"><strong>Sub:</strong></a>');
      addOnClickHandler(newSubNode, "subtitles-row");
      subNode.parentNode.replaceChild(newSubNode, subNode);
    }

    //Make "Thanked" icon be link Thanked row
    xpathexp = "//td/div/span/i[@title='Thanked']";
    subNode = newTR.ownerDocument.evaluate(xpathexp, newTR, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (subNode !== null) {
      newSubNode = parseHTML('<a href="#"></a>');
      var clonedSubNode = subNode.cloneNode(true);
      newSubNode.appendChild(clonedSubNode);
      addOnClickHandler(newSubNode, "thanked-row");
      subNode.parentNode.replaceChild(newSubNode, subNode);
    }

    var vidResolutionNode = getTableDataNode('Video Resolution');
    if (vidResolutionNode !== null) {
      var vidRes = vidResolutionNode.textContent.trim().toLowerCase();
      console.log("Video Resolution:", vidRes);
      if (vidRes !== 'unknown') {
        var vidResSpan = parseHTML(`<span class="badge-extra">${vidRes}</span>`);
        var tfileDiv = newTR.querySelector('td:nth-of-type(2) > div > div:nth-of-type(2)');
        if (tfileDiv !== null) {
          console.log("Adding vidResSpan:", vidResSpan);
          tfileDiv.appendChild(vidResSpan);
        }
      }
    }

    var tFileDivNode = newTR.querySelector('div.torrent-file');

    var fileTree = jQuery.jstree.reference('div#file_list_tree').get_json('#', { flat: true });
    console.log("fileTree length:", fileTree.length);
    var nFiles = 0;
    var noMatch = 0;
    for (var i = 0, j = fileTree.length; i < j; i++) {
      if (fileTree[i].icon !== undefined) {
        var icon = fileTree[i].icon;
        if (!icon.includes("fa-folder")) {
          nFiles += 1;
        } else {
          noMatch += 1;
          //console.log("not folder icon:", noMatch, icon);
        }
      }
    }

    var filesSpan = parseHTML(`<span class="badge-extra"><a href="#"><i class="icon-like fa fa-sitemap" data-toggle="tooltip" title="Files"></i> ${nFiles}</a></span>`);
    appendIconNode(tFileDivNode, filesSpan, "files-row");

    var descriptionNode = getTableDataNode('Description');
    var descriptionLength = "0";
    var tlen = descriptionNode.innerText.length;
    if (descriptionNode !== null && tlen !== 0) {
      descriptionLength = (tlen / 1024.0).toFixed(1);
    }

    var descriptionSpan = parseHTML(`<span class="badge-extra"><a href="#"><i class="icon-like fa fa-file-text" data-toggle="tooltip" title="Description"></i> ${descriptionLength}K</a></span>`);
    appendIconNode(tFileDivNode, descriptionSpan, "description-row");

    var screenShotsSmallNode = document.evaluate('//div[@data-target="#collapseScreens"]/small', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    var nScreens = 0;
    if (screenShotsSmallNode !== null) {
      console.log("Screens:", screenShotsSmallNode);
      nScreens = screenShotsSmallNode.textContent.match(/(\d+)\s+image?/i)[1];
    }
    var screenSpan = parseHTML(`<span class="badge-extra"><a href="#"><i class="icon-like fa fa-picture-o" data-toggle="tooltip" title="Screenshots"></i> ${nScreens}</a></span>`);
    appendIconNode(tFileDivNode, screenSpan, "screenshots-panel");

    var comments = document.querySelectorAll('div#commentsBlock div.comments > ul li');
    console.log("Comments:", comments);
    var commentsSpan = parseHTML(`<span class="badge-extra"><a href="#"><i class="icon-like fa fa-comment" data-toggle="tooltip" title="Comments"></i> ${comments.length}</a></span>`);
    appendIconNode(tFileDivNode, commentsSpan, "comments-panel");

    var tagsNode = getTableDataNode('Tags');
    if (tagsNode !== null) {
      var tagsDiv = document.createElement('div');
      var arefs = tagsNode.querySelectorAll('a');
      arefs.forEach(function(item) {
        var tagSpan = parseHTML(`<span class="badge-extra"><i class="fa fa-tag"></i> <a href="${item.href}" title="${item.title}">${item.textContent}</a></span>`);
        tagsDiv.appendChild(tagSpan);
      });
      tFileDivNode.appendChild(tagsDiv);
    }
  }

  // XMLHttpRequest loaded event handler of related torrents rows
  function onRelatedLoaded () {
    var i, j;

    console.log("XMLHttpRequest loaded.");
    var relatedRow = this.response;
    console.log(relatedRow);

    var relatedRows = relatedRow.querySelectorAll("div.table-responsive tbody > tr");
    console.log("Main page torrent rows:", relatedRows);
    console.log("Looking for:", cleanedUrl);

    for (i = 0, j = relatedRows.length; i < j; i++) {
      var row = relatedRows[i];
      var anode = row.querySelector("a.torrent-filename");
      if (anode !== null) {
        console.log("Anode:", anode);
        if (anode.href === cleanedUrl) {
          newTR = row.cloneNode(true);

          var tdNode = newTR.querySelector("td:last-of-type");
          var inode = parseHTML(`<i class="fa fa-hand-o-left text-red" title="Current Torrent"></i>`);
          tdNode.appendChild(inode);
          console.log("ClonedTR:", newTR);
          break;
        }
      }
    }

    var lastPageLI = relatedRow.querySelector("ul.pagination li:nth-last-of-type(2)");
    if (lastPageLI !== null) {
      var nFullPages = Number(lastPageLI.textContent) - 1;
      nRelated = (relatedRows.length*nFullPages);
      atLeast = "+";
    } else {
      nRelated = relatedRows.length;
      atLeast = "";
    }
    console.log ("nTorrents:",nRelated,atLeast);
    addExtraInfo();
  }

  // Download & copy matching torrent row from related torrents url
  function copyRelatedRow() {
    var mainURL = document.querySelector("h3.movie-title > a").href;
    var pieces = mainURL.split("/");
    var site = pieces[2];
    var torrentID = pieces[4].split("-")[0];
    var relatedURL = `https://${site}/movies/torrents/${torrentID}?quality=all`;

    var xhr = new XMLHttpRequest();
    xhr.onload = onRelatedLoaded;
    xhr.open("GET", relatedURL);
    xhr.responseType = "document";
    xhr.send();

    console.log("XMLHttpRequest for "+relatedURL+ " sent.");
  }

  var relatedAdded = false;

  function relatedShown () {
    if (relatedAdded)
      return;
    else
      relatedAdded = true;

    console.log("Related shown.", document.readyState);

    var relatedTorrent = document.querySelector("#collapseRelatedTorrents > div.related-torrents > div > table > tbody > tr");

    console.log("Related torrent:", relatedTorrent);
    var noRelatedTorrentsNode = getNoRelatedTorrentsNode();
    if (noRelatedTorrentsNode !== null)
      console.log("After expanded: No related torrents message found.");

    if (relatedTorrent !== null) {
      if (newTR !== undefined) {
        console.log("NewTR:");
        console.log(newTR);

        relatedTorrent.parentNode.insertBefore(newTR, relatedTorrent);
      }
    } else {
      if (noRelatedTorrentsNode !== null) {
        var divElm = parseHTML(`
<div class="related-torrents">
 <div class="table-responsive">
  <div class="pull-right"></div>
   <table class="table table-condensed table-striped table-bordered">
    <thead>
    <tr>
    <th class="torrents-icon"></th>
    <th class="torrents-filename">File</th>
    <th><i class="fa fa-download"></i></th>
    <th>Age</th>
    <th>Size</th>
    <th>S</th>
    <th>L</th>
    <th>C</th>
    </tr>
    </thead>
    <tbody>
    </tbody>
   </table>
  <div class="pull-right"></div>
 </div>
</div>
`);
        console.log("About to create new related.");
        var tbody = divElm.querySelector("tbody");
        if (newTR !== undefined) {
          console.log("NewTR:");
          console.log(newTR);
          tbody.appendChild(newTR);
        }

        var grandParent = noRelatedTorrentsNode.parentNode.parentNode;
        grandParent.replaceChild(divElm, noRelatedTorrentsNode.parentNode);
      } else {
        console.log("Ooops. No related torrents AND couldn't find the No Related Torrents message?", document.readyState);
        window.alert("Ooops. No related torrents AND couldn't find the No Related Torrents message?\n\nKeep refreshing page until this alert doesn't appear.");
      }
    }

    var relatedTorrents = document.querySelectorAll("#collapseRelatedTorrents > div.related-torrents > div > table > tbody > tr");
    console.log("relatedTorrents:", relatedTorrents);
    var relatedTorrentsA = document.querySelector('div.panel-heading > strong > a');
    if (relatedTorrentsA !== null) {
      if (nRelated === null) {
        var nTorrents = relatedTorrents.length > 0 ? relatedTorrents.length : 1;
        relatedTorrentsA.textContent += " [" + nTorrents + "]";
      } else {
        relatedTorrentsA.textContent += " [" + nRelated + atLeast + "]";
      }
    }
  }

  // Expose relatedShown() to injected func.
  window.relatedShown = relatedShown; // doesn't work with Greasemonkey 4.1
  //exportFunction(relatedShown, window, {defineAs: "relatedShown"}); // doesn't work in Greasemonkey 3.17, get exportFunction not defined error :(

  // Use script injection so can use jQuery to listen to shown.bs.collapse event which
  //  will be automatically triggered when we click the Related Torrents panel during
  //  load event processing.
  function injectedFunc() {
    console.log("Injected function running");
    var relatedTorrentsDiv = document.querySelector('div#collapseRelatedTorrents');
    console.log ("relatedTorrentsDiv:", relatedTorrentsDiv);

    $(relatedTorrentsDiv).on('shown.bs.collapse', relatedShown); // also works!
  }

  function clickRelated() {
    console.log("Click Related Torrents header.");
    var relatedTorrentsA = document.querySelector('div.panel-heading > strong > a');
    if (relatedTorrentsA !== null) {
      relatedTorrentsA.click();
    }
  }

  function markTableRow(dataName, dataID) {
    var dataNode = getTableDataNode(dataName);
    if (dataNode !== null) {
      dataNode.parentNode.id = dataID;
    }
  }

  function onLoadHandler() {
    console.log("copyTorrentToRelated Load event occurred:", cleanedUrl);

    navbar = document.querySelector("div.container");

    markTableRow('Files', "files-row");
    markTableRow('Description', "description-row");
    markTableRow('Subtitles', "subtitles-row");
    markTableRow('Thanked', "thanked-row");

    var panelNode = document.evaluate('//div[@data-target="#collapseScreens"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (panelNode !== null)
      panelNode.id = "screenshots-panel";
    panelNode = document.evaluate('//div[@data-target="#collapseComments"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (panelNode !== null)
      panelNode.id = "comments-panel";

    if (newTR !== undefined) {
      clickRelated();
    } else {
      console.log("XMLHttpRequest not done. Wait 2 seconds to click.");
      setTimeout(clickRelated, 2000);
    }
  }
  console.log("UserScript running");
  copyRelatedRow();

  injectFunc(injectedFunc);

  window.addEventListener('load', onLoadHandler, false);
})();