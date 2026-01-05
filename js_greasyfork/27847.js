// ==UserScript==
// @name           eBay hide duplicate results updated
// @description    easy toggle to show or hide bunches of repeated results in eBay searches
// @namespace      kwhitefoot@hotmail.com
// @include        http://*search.ebay.tld/*
// @include        http://*shop.ebay.tld/*
// @include        http://*.ebay.tld/sch/*
// @version        1.4
// @grant          GM_setValue 
// @grant          GM_getValue 
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/27847/eBay%20hide%20duplicate%20results%20updated.user.js
// @updateURL https://update.greasyfork.org/scripts/27847/eBay%20hide%20duplicate%20results%20updated.meta.js
// ==/UserScript==

/*
Changes:
=======

1.1 Implemented a slightly more sophisticated matching algorithm:
    convert descriptions to lower case, if one description is
    contained in the other then they match.  If they do not then split
    the descriptions into words and throw away duplicates if the
    resulting sets or words differ by less than 20% of the words then
    they match.

1.2 Only operate on visible nodes.  This helps us coexist properly
    with A Better Ebay Filter which sets display = 'none' to hide the
    filtered items.

1.3 Cleaned up code.

1.4 Implemented UI and internal changes necessary to allow the user to
    change the similarity threshold; the value is saved using
    GM_setValue.  Made the selection of candidate items for hiding
    slightly more intelligent so that it should coexist even better
    with other scripts that also hide items.  Removed support for old
    style pages.
    
    Changed includes to use tld as requested by Mikhoul.


Description:
===========

  This is a version of znerp's eBay hide duplicate results script from
  userscripts.org that works on http://www.ebay.com/sch/.  I don't
  know if it still works on the other urls that are included or even
  if they still exist.

  It has been extended to allow for almost identical descriptions to
  still count as a match and to report the number of duplicates next
  to the plus/minus icons.

  In addition the user can specify how close the match must be for two
  items to count as the same.

  There was no license specified on the original code so I assume that
  znerp meant to dedicate his version to the public domain.  This
  version is therefore also dedicated to the public domain.

Authors:
=======

  kwhitefoot@hotmail.com
  znerp

Notes:
=====

The file submitted to GreaseMonkey is the output of this command:

    babel --watch=./src --out-dir=./build

The reason for this is that I am using Flow contract annotations for
the variable and argument types and these must be removed before
executing the script because Javascript will see them as syntax
errors.

To do:
=====


*/

// Use flow annotations.  This is mostly just an exercise in the use
// of flow rather than a serious use of them and it didn't uncover any
// problems.

// Try to get early warning of poor code with use strict.
'use strict';

var MY_ATTRIBUTE = 'ebhdru'; // make sure there are no odd characters
// in this.
// Attribute for all elements that are added to items so that they can
// be removed.
var ITEM = MY_ATTRIBUTE + 'item';

// Tag to be used as a prefix for log messages.  Then you can filter
// the console log to see only our messages.
var TAG = MY_ATTRIBUTE + ': ';
var DEBUG = false;
function dlog(msg) {
    if (DEBUG) {
        console.log(TAG + msg);
    }
}

dlog('start');

// From http://stackoverflow.com/questions/15313418/javascript-assert,
// by http://stackoverflow.com/users/2881350/karl-s
if (typeof Error === "undefined") {
    Error = function (message) {
        this.message = message;
    };
    Error.prototype.message = "";
}

function assert(condition, message) {
    if (!condition) {
        if (DEBUG) {
            alert(message || "Assertion failed");
        }
        throw new Error(message || "Assertion failed");
    }
}

// Wrap the script in try..catch so that we can at least get a stack
// trace in the console when something goes wrong.
try {
    var plus = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAABnRSTlMA%2FwD%2FA" + "P83WBt9AAAAZElEQVR4nL2SUQ6AMAhDH2Q38v430DPhh4YsyHCLif0jK21hiJkBIgdvMNsAnWQ7TWCfYTtacKzl" + "70jp8yhn3lBguaH1RYjhZT%2FeNwdXurTTvf08tKP4xOXT0Poins5aBwhs4ATOOiHsGI5R2gAAAABJRU5ErkJgg" + "g%3D%3D";
    var minus = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAABnRSTlMA%2FwD%2F" + "AP83WBt9AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAARklEQVR4nGP8%2F%2F8%2FAwMDIyMjAyEAUQmjiAMkKYYCh" + "Evw64a7mYlUG2ivAQHw%2BAFZimQbWIi0hHwb6BlKxAJSEx8T8XogygC6eSP5CxYWpwAAAABJRU5ErkJggg%3D%" + "3D";

    // Element type names
    var INPUT = "INPUT";
    var SPAN = "SPAN";
    var BR = "BR";
    var DIV = "DIV";
    var BUTTON = "button";
    var BR = "BR";

    //
    var changedText = "\u00a0 (Values changed.)";

    // Descriptions that are more similar than this percentage are
    // regarded as identical and the second one will be hidden.

    var matchThresholdName = 'matchThreshold';
    var matchThreshold = 80;

    var CONTROL_ATTRIBUTE = MY_ATTRIBUTE + 'controlAttribute';
    function isCandidate(listItem) {
        //dlog('ha: ' + listItem.hasAttribute(CONTROL_ATTRIBUTE));
        //dlog('v: ' + listItem.style.visibility);
        //dlog('d: ' + listItem.style.display);
        dlog('isCandidate: ' + listItem.hasAttribute(CONTROL_ATTRIBUTE) + ' <' + listItem.style.visibility + '>' + ' <' + listItem.style.display + '>');
        return listItem.hasAttribute(CONTROL_ATTRIBUTE) || listItem.style.visibility !== 'hidden' && listItem.style.display !== 'none';
    }

    function getCandidates() {
        dlog('getCandidates');
        var allResults = getAllItems();
        var candidates = [];
        for (var i = 0; i < allResults.snapshotLength; i++) {
            var thisResult = allResults.snapshotItem(i);
            //dlog('getCandidates a' + i);
            var thisHeading = thisResult.parentNode;
            var thisListItem = thisHeading.parentNode;
            if (isCandidate(thisListItem)) {
                //dlog('getCandidates got one');
                candidates.push(thisResult);
            }
        }
        dlog('getCandidates l: ' + candidates.length);
        return candidates;
    }

    // From:
    // http://stackoverflow.com/questions/9496427/get-elements-by-attribute-when-queryselectorall-is-not-available-without-using-l
    // by: http://stackoverflow.com/users/629596/kevinfahy
    function getAllElementsWithAttribute(tagName, attribute) {
        var matchingElements = [];
        var allElements = document.getElementsByTagName(tagName);
        for (var i = 0, n = allElements.length; i < n; i++) {
            if (allElements[i].getAttribute(attribute) !== null) {
                // Element exists with attribute. Add to array.
                matchingElements.push(allElements[i]);
            }
        }
        return matchingElements;
    }

    function type(obj) {
        return Object.prototype.toString.call(obj).match(/\s\w+/)[0].trim();
    }

    function testType() {
        dlog('a: ' + type(""));
        dlog('b: ' + type(123));
        dlog('c: ' + type({}));
        dlog('e: ' + type(function () {}));
    }

    function removeAddedItemElements() {
        var addedElements = document.querySelectorAll('[' + ITEM + ']');
        dlog('removeAddedItemElements: ' + type(addedElements));
        for (var i = 0; i < addedElements.length; i++) {
            var element = addedElements[i];
            element.parentElement.removeChild(element);
        }
    }

    function removeToggleIcons() {
        // ebhdru: error: An invalid or illegal string was specified

        // Looks like I'll just have to enumerate the elements the
        // slow way.
        dlog('removeToggleIcons');
        var icons = getAllElementsWithAttribute('image', TOGGLE_ICON);
        dlog('removeToggleIcons: ' + icons.length);
        icons.forEach(function (icon) {
            icon.parentElement.removeChild(icon);
        });
    }

    // Compare each item description with the one that follows, if they
    // are very similar hide the second one.  Attach a plus sign icon and
    // a count of duplicates to the first of the list; that is the one
    // that is not hidden.  Attach a click event to it to toggle the
    // visibility.

    // TODO: add icons and click events to hide individual items.
    function handleOtherPages() {
        dlog('handleOtherPages');

        var allResults = getCandidates();
        assert(allResults, 'allResults must not be null');
        // Can't assert the length because GM executes this at times
        // when there are none.  Perhaps we can detect that situation
        // and avoid getting this far.

        if (allResults.length == 0) {
            return; // nothing to do
        }
        removeAddedItemElements();

        dlog('handleOtherPages allResults: ' + allResults.length);
        var duplicateCount = 0;
        var icon;
        var iconNumber = 0;
        for (var i = 0; i < allResults.length - 1; i++) {
            //dlog('handleOtherPages: ' + i);
            var thisResult = allResults[i];
            var thisHeading = thisResult.parentNode;
            var thisListItem = thisHeading.parentNode;
            var nextResult = allResults[i + 1];
            var nextHeading = nextResult.parentNode;
            var nextListItem = nextHeading.parentNode;
            //dlog('thisHeading: ' + thisHeading.className);
            //dlog('thisListItem: ' + thisListItem.className);
            if (tokenMatch(thisResult.textContent, nextResult.textContent)) {
                if (duplicateCount == 0) {
                    icon = addIcon(thisListItem, iconNumber);
                    iconNumber++;
                }
                duplicateCount++;
                //dlog('hide dup i: ' + i);
                hideDuplicate(nextResult, duplicateCount);
            } else {
                if (hiddenByMe(nextListItem)) {
                    nextListItem.style.display = "";
                }
                //dlog('duplicateCount: ' + duplicateCount);
                if (duplicateCount != 0) {
                    var dups = createTextNode(duplicateCount + ' duplicates');
                    icon.parentNode.insertBefore(dups, icon);
                    duplicateCount = 0;
                    icon = null;
                }
            }
        }
    }

    function hiddenByMe(element) {
        assert(element.nodeName == 'LI', 'Expected a list item element');
        return element.hasAttribute(CONTROL_ATTRIBUTE);
    }

    // Get all the items in the page.
    function getAllItems() {
        dlog('getAllItems');
        return document.evaluate('//a[contains(@class,"vip")]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    }

    var IS_CANDIDATE = MY_ATTRIBUTE + 'is candidate';
    // Add an attribute to indicate which items are candidates for
    // hiding etc.  Only include those items that are visible so that
    // we work well with other scripts that also hide items.
    function prepareItems() {
        dlog('prepareItems');

        var allResults = getAllItems();
        assert(allResults, 'allResults must not be null');
        var duplicateCount = 0;
        var icon;
        //var firstVisibleIndex: number = findFirstVisible(allResults)
        //var thisResult: object = allResults.snapshotItem(firstVisibleIndex)
        var iconNumber = 0;
        allResults.forEach(function (thisResult) {
            var thisHeading = thisResult.parentNode;
            var thisListItem = thisHeading.parentNode;
            if (thisListItem.style.display == 'show') {
                thisListItem.setAttribute(IS_CANDIDATE, "true");
            }
        });
    }

    function findFirstVisible(allResults) {
        dlog('findFirstVisible');
        var i;
        for (i = 0; i < allResults.snapshotLength - 1; i++) {
            var thisResult = allResults.snapshotItem(i);
            var thisHeading = thisResult.parentNode;
            var thisListItem = thisHeading.parentNode;
            if (thisListItem.style.display = 'show') {
                dlog('findFirstVisible a: ' + i);
                return i;
            }
        }
        dlog('findFirstVisible b: ' + i);
        return i;
    }

    function hideDuplicate(nextResult, duplicateCount) {
        dlog('hideDuplicate count:' + duplicateCount);
        var nextHeading = nextResult.parentNode;
        var nextListItem = nextHeading.parentNode;
        assert(nextListItem.nodeName == 'LI', 'Expected a list item element');
        nextListItem.style.display = "none";
        nextListItem.setAttribute(CONTROL_ATTRIBUTE, "hidden");
        nextHeading.appendChild(createTextNode("  <<duplicate " + duplicateCount + ">>"));
    }

    // A slightly fuzzy match.  At the moment it simply lops off the
    // first and last two characters and checks to see if what remains
    // is an exact match.  The reason for ignoring the leading and
    // trailing characters is that vendors often add spurious
    // characters to distinguish otherwise identical descriptions.
    // Should be replaced with a more sophisticated measure which also
    // includes the price.
    function match(s1, s2) {
        //dlog('match ');
        //dlog('s1: ' + s1);
        //dlog('s2: ' + s2);

        var a1 = s1.substring(2, s1.length - 2);
        var a2 = s2.substring(2, s2.length - 2);
        //dlog('a1: ' + a1);
        //dlog('a2: ' + a2);

        return a1 == a2;
    }

    // Find the uniques tokens in each description, if they differ by
    // fewer than some number then return true, else false.
    function tokenMatch(s1, s2) {
        //dlog('tokenMatch: <' + s1 +'> <' + s2 + '>');
        var lc1 = s1.toLowerCase();
        var lc2 = s2.toLowerCase();
        if (lc1 === lc2) {
            //dlog('tokenMatch matched lc');
            return true;
        }
        // If one description is wholly contained in another
        //dlog('tokenMatch a: <' + lc1 + '> <' + lc2 + '>');
        if (lc1.includes(lc2) || lc2.includes(lc1)) {
            //dlog('tokenMatch matched includes');
            return true;
        }
        // Get Sets of tokens
        //dlog('tokenMatch a1');
        var t1 = tokenise(lc1);
        //dlog('tokenMatch t1: ' + t1.size);
        var t2 = tokenise(lc2);
        //dlog('tokenMatch t2: ' + t2.size);
        var onlyIn1 = setDifference(t1, t2);
        //dlog('tokenMatch a4: ' + onlyIn1.size);
        var onlyIn2 = setDifference(t2, t1);
        //dlog('tokenMatch a5: ' + onlyIn2.size);
        if (onlyIn1.size == 0 || onlyIn2.size == 0) {
            // One set of tokens is a subset of the other or they are
            // identical.
            dlog('subset');
            return true;
        }

        var len = Math.max(t1.size, t2.size);
        var differing = Math.max(onlyIn1.size, onlyIn2.size);
        var diff_fraction = differing / len;
        //dlog('tokenMatch c: ' + len + ' ' + differing + ' ' + diff_fraction);
        // If the number of distinct tokens in the largest set is ten then
        // allow two tokens difference.
        var max_allowed_diff = (1 - configuration.minimumSimilarity) * len;
        // If one description is wholly contained in another 
        if (onlyIn1.size <= max_allowed_diff && onlyIn2.size <= max_allowed_diff) {
            //dlog('tokenMatch matched set diff');
            return true;
        }
        // Doesn't match.
        //dlog( 'no match');
        return false;
    }

    // just trim and split on whitespace
    var whiteSpace = /\s+/g;
    function tokenise(s) {
        var tokens = s.trim().split(whiteSpace);
        tokens = s.trim().match(/\S+/g);
        var tokenSet = new Set(tokens);
        return tokenSet;
    }

    // From
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set.
    Set.prototype.intersection = function (setB) {
        var intersection = new Set();
        for (var elem of setB) {
            if (this.has(elem)) {
                intersection.add(elem);
            }
        }
        return intersection;
    };

    function setDifference(setA, setB) {
        var diff = new Set(setA);
        for (var elem of setB) {
            diff.delete(elem);
        }
        return diff;
    }

    var TOGGLE_ICON = MY_ATTRIBUTE + 'toggleIcon';
    // Add the plus icon to the beginning of the specified element and
    // attach a click event handler to reveal or hide the duplicates.
    function addIcon(thisListItem, iconNumber) {
        //dlog('addIcon: tagName: ' + thisListItem.tagName);
        var icon = createElement("img");
        icon.id = 'ebhdru' + iconNumber;
        icon.setAttribute(TOGGLE_ICON, TOGGLE_ICON);
        icon.src = plus;
        icon.setAttribute("style", "padding: 3px; cursor: pointer;");
        // Make sure that this item will not be accicetally hidden
        // later.
        thisListItem.removeAttribute(CONTROL_ATTRIBUTE);
        thisListItem.insertBefore(icon, thisListItem.firstChild);
        icon.addEventListener('click', function () {
            var listItem = this.parentNode;
            dlog('click: ');
            if (this.src == plus) {
                this.src = minus;
                showItems(listItem);
            } else {
                this.src = plus;
                hideItems(listItem);
            }
        }, true);
        return icon;
    }

    function hideItems(listItem) {
        dlog('hideItems: tagName: ' + listItem.tagName);
        while (listItem = listItem.nextSibling) {
            dlog('hideItems: display: ' + listItem.style.display);
            dlog('hideItems: getAttribute: ' + listItem.getAttribute(CONTROL_ATTRIBUTE));
            if ("" == listItem.style.display) {
                if (listItem.getAttribute(CONTROL_ATTRIBUTE) == "shown") {
                    listItem.setAttribute(CONTROL_ATTRIBUTE, "hidden");
                    listItem.style.display = "none";
                } else {
                    // Reached end of this hidden group
                    return;
                }
            }
        }
    }

    function showItems(listItem) {
        dlog('showItems: tagName: ' + listItem.tagName);
        while (listItem = listItem.nextSibling) {
            if (listItem.getAttribute(CONTROL_ATTRIBUTE) == "hidden") {
                listItem.style.display = "";
                listItem.setAttribute(CONTROL_ATTRIBUTE, "shown");
            } else {
                if (listItem.style.display == "") {
                    // Item already visible so we have reached the end
                    // of the group.
                    return;
                }
            }
        }
    }

    // function showItems(listItem: object) {
    //     dlog('showItems: tagName: ' + listItem.tagName);
    //     while((listItem = listItem.nextSibling).getAttribute(CONTROL_ATTRIBUTE) == "showing") {
    //         listItem.style.display = "none"
    //         listItem.setAttribute(CONTROL_ATTRIBUTE, "hidden")
    //     }
    // }

    var configuration = { minimumSimilarity: 0.8 };

    function getConfiguration() {
        dlog('getConfiguration');
        for (var key in configuration) {
            configuration[key] = GM_getValue(key, configuration[key] + '') - 0;
        }
    }

    function saveConfiguration() {
        dlog('saveConfiguration');
        for (var key in configuration) {
            dlog('k: ' + key + ' v: ' + configuration[key]);
            GM_setValue(key, configuration[key] + "");
        }
    }

    function test() {
        var x = getAllItems();
        for (var i = 0; i < x.snapshotLength; i++) {
            var n = x.snapshotItem(i);
            dlog('nn: ' + n.nodeName);
            dlog('nt: ' + n.innerText);
        }
    }

    // Copied from abef.  Place our controls just below the related
    // searches div. 
    function buildControls() {
        dlog('buildControls start');
        var divSibling = document.getElementById('RelatedSearchesDF');
        if (divSibling == null) {
            dlog('buildControls RelatedSearchesDF divSibling is null, try again.');
            divSibling = document.getElementById('TopPanelDF');
        }
        if (divSibling == null) {
            // This happens when GM executes the script a second time.
            // Just exit without doing anything.
            dlog('buildControls TopPanelDF divSibling is null, give up.');
            return false;
        }

        dlog('buildControls add controls');

        var newDivNode = document.createElement(DIV);
        newDivNode.title = "Ebay hide duplicate results";

        var minimumSimilarityNode = document.createElement(INPUT);
        minimumSimilarityNode.type = "text";
        minimumSimilarityNode.size = 4;
        minimumSimilarityNode.style.textAlign = "right";
        minimumSimilarityNode.setAttribute("id", MY_ATTRIBUTE + 'minimumSimilarity');
        minimumSimilarityNode.defaultValue = 100 * configuration.minimumSimilarity;

        var span1Node = document.createElement(SPAN);
        span1Node.style.fontWeight = "bold";
        span1Node.appendChild(minimumSimilarityNode);
        // Note: do not add MY_ATTRIBUTE to this node or it will be
        // deleted when we redo.
        span1Node.appendChild(document.createTextNode("% similarity threshold; hide items that are more similar than this."));

        var applyNode = document.createElement(BUTTON);
        applyNode.appendChild(document.createTextNode("Apply"));
        applyNode.addEventListener('click', refresh, false);

        newDivNode.appendChild(applyNode);
        newDivNode.appendChild(span1Node);

        var parentNode = divSibling.parentNode;
        var nextSibling = divSibling.nextSibling;
        //parentNode.insertBefore(createElement(BR), nextSibling);
        //parentNode.insertBefore(createElement(BR), nextSibling);
        parentNode.insertBefore(newDivNode, nextSibling);

        dlog('buildControls end');
        return true;
    }

    function hideSimilarItems() {
        dlog('hideSimilarItems');
        handleOtherPages();
    }

    function refresh(event) {
        dlog('refresh');
        if (event != null) {
            event.preventDefault();
            event.stopPropagation();
        }
        var minimumSimilarityNode = document.getElementById(MY_ATTRIBUTE + 'minimumSimilarity');
        var value = (minimumSimilarityNode.value - 0) / 100;
        configuration.minimumSimilarity = value;
        saveConfiguration();

        dlog('msn: ' + value);
        hideSimilarItems();
    }

    function addMyItemAttribute(node) {
        dlog('addMyItemAttribute: ' + type(node));
        node.setAttribute(ITEM, ITEM);
    }

    // Add our identifying attribute to each node we create so that we
    // can easily delete them later.  To do this we enclose the text
    // node in a span element.  The reason for this is that we cannot
    // attach attributes to nodes so we would have difficulty finding
    // them later.
    function createTextNode(text) {
        dlog('createTextNode: ' + text);
        var span = createElement('span');
        span.innerText = text;
        return span;
    }

    // Add our identifying attribute to each node we create so that we
    // can easily delete them later.
    function createElement(elementName) {
        var element = document.createElement(elementName);
        addMyItemAttribute(element);
        return element;
    }

    function main() {
        dlog('main start');
        //test();
        getConfiguration();
        if (!buildControls()) {
            dlog('Giving up cannot find place to build controls.');
            return;
        }
        //prepareItems();

        handleOtherPages();

        dlog('main end');
    }

    //estType();
    main();
} catch (ex) {
    DEBUG = true;
    dlog("error: " + ex.message);
    dlog("stack: " + ex.stack);
}

dlog('finish');