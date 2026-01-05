// ==UserScript==
// @name        LibraryThing add ten authors at a time
// @description A shortcut for adding multiple "Other authors" inputs at once
// @namespace   https://greasyfork.org/en/users/11592-max-starkenburg
// @include     http*://*librarything.tld/work/*edit/*
// @include     http*://*librarything.com/work/*edit/*
// @include     http*://*librarything.tld/addnew.php*
// @include     http*://*librarything.com/addnew.php*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11410/LibraryThing%20add%20ten%20authors%20at%20a%20time.user.js
// @updateURL https://update.greasyfork.org/scripts/11410/LibraryThing%20add%20ten%20authors%20at%20a%20time.meta.js
// ==/UserScript==

// Find the "add another author" link and put a "add another 10 authors" link next to it
var addAnotherAuthor = document.evaluate(
  '//div[@id="addPersonControl"]//a',
  document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
if (addAnotherAuthor.snapshotLength > 0) {
  addAnotherAuthor = addAnotherAuthor.snapshotItem(0);    
  addTenAuthors = document.createElement('span');
  addTenAuthors.innerHTML = ' | <a href="javascript:addTenPersons();">add another 10 authors</a>'
  var par = addAnotherAuthor.parentNode;
  par.insertBefore(addTenAuthors, addAnotherAuthor.nextSibling);    
}

// Append to the document body the function that repeats addPerson() 10 times
var body = document.getElementsByTagName("body")[0];
var script = document.createElement("script");
script.type = "text/javascript";
script.innerHTML = '\
  function addTenPersons() {\
    for (var i=0; i<10; i++) {\
      addPerson();\
    }\
  }\
  ';
body.appendChild(script);
