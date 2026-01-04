// ==UserScript==
// @name         Jira History Comparison
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  View Jira History word by word
// @author       You
// @match        https://captiv8.atlassian.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.net
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/476200/Jira%20History%20Comparison.user.js
// @updateURL https://update.greasyfork.org/scripts/476200/Jira%20History%20Comparison.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function AddCompareButtons() {
        console.log('started')
        let parentNode = document.querySelector('div[data-testid="issue-history.ui.feed-container"]')
        Array.from(parentNode.childNodes).map(i => i.childNodes[1]).map(i => i.childNodes[0]).forEach((item, i) => {
            AddCompareButton(item, i)
        })
    }

    function AddCompareButton(blockWithChanges, i) {
        //console.log([blockWithChanges, i])
        /*let compareButton       = document.createElement ('div');
        let id = 'myButton' + i
        compareButton.innerHTML = '<button id="' + id + '" type="button">Compare</button>'
        compareButton.setAttribute ('id', 'myContainer');
        blockWithChanges.appendChild (compareButton);
        let ButtonClickAction = function() {*/
        let textNodes = blockWithChanges.parentNode.childNodes[1].childNodes
        let oldTextNode = textNodes[0]
        let oldText = oldTextNode.innerText
        let newTextNode = textNodes[2]
        let newText = newTextNode.innerText
        //oldTextNode.replaceChild(document.createTextNode(''), oldTextNode.firstChild)
        newTextNode.replaceChild(document.createTextNode(''), newTextNode.firstChild)
        //oldTextNode.innerText = ''
        newTextNode.innerText = ''

        /*let textDiff = diff(oldText, newText)
        var fragment = document.createDocumentFragment();
        for (let i=0; i < textDiff.length; i++) {

            if (textDiff[i].added && textDiff[i + 1] && textDiff[i + 1].removed) {
                let swap = textDiff[i];
                textDiff[i] = textDiff[i + 1];
                textDiff[i + 1] = swap;
            }

            let node;
            if (textDiff[i].removed) {
                node = document.createElement('del');
                node.appendChild(document.createTextNode(textDiff[i].value));
            } else if (textDiff[i].added) {
                node = document.createElement('ins');
                node.appendChild(document.createTextNode(textDiff[i].value));
            } else {
                node = document.createTextNode(textDiff[i].value);
            }
            fragment.appendChild(node);
        }

        oldTextNode.appendChild(fragment);*/


        let textDiff = diff(oldText, newText)
        var fragment2 = document.createDocumentFragment();
        for (let i=0; i < textDiff.length; i++) {

            if (textDiff[i].added && textDiff[i + 1] && textDiff[i + 1].removed) {
                let swap = textDiff[i];
                textDiff[i] = textDiff[i + 1];
                textDiff[i + 1] = swap;
            }

            let node;
            if (textDiff[i].removed) {
                node = document.createElement('del');
                node.appendChild(document.createTextNode(textDiff[i].value));
            } else if (textDiff[i].added) {
                node = document.createElement('ins');
                node.appendChild(document.createTextNode(textDiff[i].value));
            } else {
                node = document.createTextNode(textDiff[i].value);
            }
            fragment2.appendChild(node);
        }

        newTextNode.appendChild(fragment2);

        //}
        //document.getElementById (id).addEventListener ("click", ButtonClickAction, false);
    }

    function AddStartButton() {
        let activityH2 = document.querySelector('h2[data-test-id="issue-activity-feed.heading"]')
        if (activityH2 === null) {
            console.log('not found')
            setTimeout(() => {
                AddStartButton()
            }, 1000)
        }
        console.log(activityH2)
        let parentNode = activityH2.parentNode

        let startButton       = document.createElement ('div');
        startButton.innerHTML = '<button id="StartCmp" type="button">Compare</button>'
        startButton.setAttribute ('id', 'myContainer');
        parentNode.appendChild (startButton);
        let ButtonClickAction = function() {
            console.log(blockWithCHanges)
        }
        document.getElementById ('StartCmp').addEventListener ("click", AddCompareButtons, false);
    }

    window.addEventListener("load", (event) => {
        console.log('loaded')
        setTimeout(() => {
            AddStartButton()
        }, 1000)
    });

    //--- Style our newly added elements using CSS.
    GM_addStyle ( `
    #myContainer {
        position:               relative;
        top:                    0%;
        right:                  0%;
        font-size:              20px;
        z-index:                1100;
    }
    #myButton {
        cursor:                 pointer;
    }
    del {
    text-decoration: none;
	color: #b30000;
	background: #fadad7;
    }
    ins {
    background: #eaf2c2;
	color: #406619;
	text-decoration: none;
    }
` );

    /*!

 diff v2.0.1

Software License Agreement (BSD License)

Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>

All rights reserved.

Redistribution and use of this software in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above
  copyright notice, this list of conditions and the
  following disclaimer.

* Redistributions in binary form must reproduce the above
  copyright notice, this list of conditions and the
  following disclaimer in the documentation and/or other
  materials provided with the distribution.

* Neither the name of Kevin Decker nor the names of its
  contributors may be used to endorse or promote products
  derived from this software without specific prior
  written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR
IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
@license
*/

    function diff(oldString, newString, callback) {

        function done(value) {
            if (callback) {
                setTimeout(function () {
                    callback(undefined, value);
                }, 0);
                return true;
            } else {
                return value;
            }
        }

        // Allow subclasses to massage the input prior to running
        oldString = castInput(oldString);
        newString = castInput(newString);

        // Handle the identity case (this is due to unrolling editLength == 0
        if (newString === oldString) {
            return done([{ value: newString }]);
        }
        if (!newString) {
            return done([{ value: oldString, removed: true }]);
        }
        if (!oldString) {
            return done([{ value: newString, added: true }]);
        }

        newString = removeEmpty(tokenize(newString));
        oldString = removeEmpty(tokenize(oldString));

        var newLen = newString.length,
            oldLen = oldString.length;
        var editLength = 1;
        var maxEditLength = newLen + oldLen;
        var bestPath = [{ newPos: -1, components: [] }];

        // Seed editLength = 0, i.e. the content starts with the same values
        var oldPos = extractCommon(bestPath[0], newString, oldString, 0);
        if (bestPath[0].newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
            // Identity per the equality and tokenizer
            return done([{ value: newString.join('') }]);
        }

        // Main worker method. checks all permutations of a given edit length for acceptance.
        function execEditLength() {
            for (var diagonalPath = -1 * editLength; diagonalPath <= editLength; diagonalPath += 2) {
                var basePath = undefined;
                var addPath = bestPath[diagonalPath - 1],
                    removePath = bestPath[diagonalPath + 1],
                    _oldPos = (removePath ? removePath.newPos : 0) - diagonalPath;
                if (addPath) {
                    // No one else is going to attempt to use this value, clear it
                    bestPath[diagonalPath - 1] = undefined;
                }

                var canAdd = addPath && addPath.newPos + 1 < newLen,
                    canRemove = removePath && 0 <= _oldPos && _oldPos < oldLen;
                if (!canAdd && !canRemove) {
                    // If this path is a terminal then prune
                    bestPath[diagonalPath] = undefined;
                    continue;
                }

                // Select the diagonal that we want to branch from. We select the prior
                // path whose position in the new string is the farthest from the origin
                // and does not pass the bounds of the diff graph
                if (!canAdd || canRemove && addPath.newPos < removePath.newPos) {
                    basePath = clonePath(removePath);
                    pushComponent(basePath.components, undefined, true);
                } else {
                    basePath = addPath; // No need to clone, we've pulled it from the list
                    basePath.newPos++;
                    pushComponent(basePath.components, true, undefined);
                }

                _oldPos = extractCommon(basePath, newString, oldString, diagonalPath);

                // If we have hit the end of both strings, then we are done
                if (basePath.newPos + 1 >= newLen && _oldPos + 1 >= oldLen) {
                    let useLongestToken = true
                    return done(buildValues(basePath.components, newString, oldString, useLongestToken));
                } else {
                    // Otherwise track this path as a potential candidate and continue.
                    bestPath[diagonalPath] = basePath;
                }
            }

            editLength++;
        }

        // Performs the length of edit iteration. Is a bit fugly as this has to support the
        // sync and async mode which is never fun. Loops over execEditLength until a value
        // is produced.
        if (callback) {
            (function exec() {
                setTimeout(function () {
                    // This should not happen, but we want to be safe.
                    /* istanbul ignore next */
                    if (editLength > maxEditLength) {
                        return callback();
                    }

                    if (!execEditLength()) {
                        exec();
                    }
                }, 0);
            })();
        } else {
            while (editLength <= maxEditLength) {
                var ret = execEditLength();
                if (ret) {
                    return ret;
                }
            }
        }
    }

    function pushComponent(components, added, removed) {
        var last = components[components.length - 1];
        if (last && last.added === added && last.removed === removed) {
            // We need to clone here as the component clone operation is just
            // as shallow array clone
            components[components.length - 1] = { count: last.count + 1, added: added, removed: removed };
        } else {
            components.push({ count: 1, added: added, removed: removed });
        }
    }
    function extractCommon(basePath, newString, oldString, diagonalPath) {
        var newLen = newString.length,
            oldLen = oldString.length,
            newPos = basePath.newPos,
            oldPos = newPos - diagonalPath,
            commonCount = 0;
        while (newPos + 1 < newLen && oldPos + 1 < oldLen && equals(newString[newPos + 1], oldString[oldPos + 1])) {
            newPos++;
            oldPos++;
            commonCount++;
        }

        if (commonCount) {
            basePath.components.push({ count: commonCount });
        }

        basePath.newPos = newPos;
        return oldPos;
    }

    function equals(left, right) {
        var reWhitespace = /\S/;
        let ignoreWhitespace = false
        return left === right || ignoreWhitespace && !reWhitespace.test(left) && !reWhitespace.test(right);
    }
    function removeEmpty(array) {
        var ret = [];
        for (var i = 0; i < array.length; i++) {
            if (array[i]) {
                ret.push(array[i]);
            }
        }
        return ret;
    }
    function castInput(value) {
        return value;
    }
    function tokenize(value) {
        var extendedWordChars = /^[A-Za-z\xC0-\u02C6\u02C8-\u02D7\u02DE-\u02FF\u1E00-\u1EFF]+$/;
        var tokens = value.split(/(\s+|\b)/);

        // Join the boundary splits that we do not consider to be boundaries. This is primarily the extended Latin character set.
        for (var i = 0; i < tokens.length - 1; i++) {
            // If we have an empty string in the next field and we have only word chars before and after, merge
            if (!tokens[i + 1] && tokens[i + 2] && extendedWordChars.test(tokens[i]) && extendedWordChars.test(tokens[i + 2])) {
                tokens[i] += tokens[i + 2];
                tokens.splice(i + 1, 2);
                i--;
            }
        }
        return tokens;
    }

    function buildValues(components, newString, oldString, useLongestToken) {
        var componentPos = 0,
            componentLen = components.length,
            newPos = 0,
            oldPos = 0;

        for (; componentPos < componentLen; componentPos++) {
            var component = components[componentPos];
            if (!component.removed) {
                if (!component.added && useLongestToken) {
                    var value = newString.slice(newPos, newPos + component.count);
                    value = map(value, function (value, i) {
                        var oldValue = oldString[oldPos + i];
                        return oldValue.length > value.length ? oldValue : value;
                    });

                    component.value = value.join('');
                } else {
                    component.value = newString.slice(newPos, newPos + component.count).join('');
                }
                newPos += component.count;

                // Common case
                if (!component.added) {
                    oldPos += component.count;
                }
            } else {
                component.value = oldString.slice(oldPos, oldPos + component.count).join('');
                oldPos += component.count;

                // Reverse add and remove so removes are output first to match common convention
                // The diffing algorithm is tied to add then remove output and this is the simplest
                // route to get the desired output with minimal overhead.
                if (componentPos && components[componentPos - 1].added) {
                    var tmp = components[componentPos - 1];
                    components[componentPos - 1] = components[componentPos];
                    components[componentPos] = tmp;
                }
            }
        }

        return components;
    }
    function clonePath(path) {
        return { newPos: path.newPos, components: path.components.slice(0) };
    }
    function map(arr, mapper, that) {
        if (Array.prototype.map) {
            return Array.prototype.map.call(arr, mapper, that);
        }

        var other = new Array(arr.length);

        for (var i = 0, n = arr.length; i < n; i++) {
            other[i] = mapper.call(that, arr[i], i, arr);
        }
        return other;
    }
})();