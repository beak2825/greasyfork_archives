// ==UserScript==
// @name         KenKen Helper
// @namespace    https://github.com/dy-dx
// @version      0.32
// @description  Shortcut keys for http://www.kenkenpuzzle.com/
// @author       dy-dx
// @match        *://www.kenkenpuzzle.com/game
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-1.9.0.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/411349/KenKen%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/411349/KenKen%20Helper.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
/* global $, jQuery, base64_decode, cloneInto, KenKen */

(function() {
    function injectScript(text) {
        // This exact function doesn't currently work but I'm leaving it as a proof of concept
        text = text.replace('KenKenGame=function(){',
            'KenKenGame=function(){' +
            'window.clearActiveItem = function() { I({value: "cC"}); };');
        var newScript = document.createElement('script');
        newScript.type = "text/javascript";
        newScript.textContent = text;
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(newScript);
    }

    let isApplicationJsFound = false;
    let interceptedScripts = [];

    let onScriptAdded = (script) => {
        // Don't intercept any scripts until we hit application.js
        if (/application-.*js/.test(script.src)) {
            isApplicationJsFound = true;
        }
        if (!isApplicationJsFound) {
            return;
        }
        // Don't intercept external scripts that aren't relevant to the game
        if (script.src && !/assets\//.test(script.src)) {
            return;
        }

        interceptedScripts.push({src: script.src, textContent: script.textContent});
        script.textContent = "";
        script.remove();
    }

    document.addEventListener('DOMContentLoaded', async () => {
        // we got to the end of the document, so noop this
        onScriptAdded = function() {};

        for (let script of interceptedScripts) {
            if (script.src) {
                // finish loading the external script before moving on
                await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: script.src,
                        onload: function(response) {
                            injectScript(response.responseText);
                            resolve();
                        }
                    });
                });
            } else {
                injectScript(script.textContent);
            }
        }
    });

    // https://github.com/jspenguin2017/Snippets/blob/master/onbeforescriptexecute.html
    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            for (const n of m.addedNodes) {
                if (n.tagName === 'SCRIPT') {
                    onScriptAdded(n);
                }
            }
        }
    });
    observer.observe(document, {
        childList: true,
        subtree: true,
    });
})();



$('head').append('<link href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.min.css" rel="stylesheet">');
GM_addStyle(`
  .ui-tooltip {
    pointer-events: none;
    font-size: 14px;
    padding: 4px;
  }

  .customnote.isolatedCageHorizontal {
    color: darkblue;
    text-decoration: underline dotted;
  }

  .customnote.isolatedCageVertical {
    color: purple;
  }

  .customnote.isolated {
    color: limegreen !important;
    text-decoration: underline;
  }
  .customnote.invalid-via-note-pair {
    color: red !important;
  }
/*
  .customnote:hover {
    text-decoration: line-through;
    color: teal !important;
    cursor: not-allowed;
  }
*/

  /* remove space left behind by ads */
  #leaderboard-container {
    height: auto !important;
  }
  /* extra specificity */
  #content#content {
    width: auto !important;
  }

  /* annoying fixed-width elements that cause scrollbars */
  #header .header-inner {
    width: auto !important;
  }
  #footer {
    width: auto !important;
  }
`);

// ad containers
$(document).ready(function() {
    $('.sky-ad').remove();
    $('.tag-wrapper').remove();

});
(function() {
    // let $lastHoveredItem;
    let puzzleData;

    let applyCustomizationsTimeout;

    // const puzzleData = getPuzzleData();
    // if (typeof unsafeWindow !== undefined) {
    //     // Greasemonkey specific -- https://stackoverflow.com/a/25785794
    //     unsafeWindow.puzzleData = cloneInto(puzzleData, unsafeWindow);
    // } else {
    //     window.puzzleData = puzzleData;
    // }

    // https://stackoverflow.com/a/53922757
    function factors(num, max) {
        let fac = [], i = 1, ind = 0;
        while (i <= Math.floor(Math.sqrt(num))) {
            if (num%i === 0) {
                fac.splice(ind,0,i);
                if (i != num/i) {
                    fac.splice(-ind,0,num/i);
                }
                ind++;
            }
            i++;
        }
        let temp = fac[fac.length - 1];
        fac[fac.length - 1] = fac[0];
        fac[0] = temp;
        return fac.filter(n => n <= max);
    };

    function multiplicationOperands(product, max, cage) {
        let existingProduct = 1;
        // If all but one cells in the cage already have values, just solve it
        let numExistingValues = 0;
        cage.filter(c => c.value).forEach(c => {
            numExistingValues++;
            existingProduct *= c.value;
        });
        if (numExistingValues === cage.length - 1) {
            return { operands: [product / existingProduct] };
        }

        // Incorporate existing values to find potential operands
        product = product / existingProduct;

        let fac = factors(product, max);
        // when it's a 2-cell cage, eliminate factors that would have to be squared to reach the target
        if (cage.length === 2) {
            fac = fac.filter(n => n*n !== product);
        }
        // if the cage has 2+ unfilled cells remaining, eliminate factors that are too small to reach the target,
        // even if the other cells all contain the largest factor somehow
        if (cage.length - numExistingValues >= 2) {
            const largest = fac[fac.length-1];
            const numOtherCells = cage.length - numExistingValues - 1;
            fac = fac.filter(n => n*Math.pow(largest, numOtherCells) >= product);
        }

        return { operands: fac, target: fac.length > 1 && existingProduct > 1 && product };
    }

    // Only 2 cells can be in a division cage
    function divisionOperands(quotient, max, cage) {
        // If there's an existing value in the cage, there could be 1 or 2 possible operands
        const cellWithValue = cage.find(c => c.value);
        if (cellWithValue) {
            const value = cellWithValue.value;
            return { operands: [
                (value % quotient === 0 && value / quotient),
                (value * quotient <= max && value * quotient),
            ].filter(n => n) };
        }

        let operands = new Set([1]);
        for (let i = 2; i <= max; i++) {
            if (i * quotient <= max) { // divisors
                operands.add(i);
            }
            if (i % quotient === 0) { // dividends
                operands.add(i);
            }
        }
        return { operands: Array.from(operands) };
    }

    // Only 2 cells can be in a subtraction cage
    function subtractionOperands(diff, max, cage) {
        // If there's an existing value in the cage, there could be 1 or 2 possible operands
        const cellWithValue = cage.find(c => c.value);
        if (cellWithValue) {
            const value = cellWithValue.value;
            return { operands: [
                (value > diff && value - diff),
                (value + diff <= max && value + diff),
            ].filter(n => n) };
        }
        // If the target diff is small, then all operands are possible so don't bother.
        if (diff <= max/2) {
            return { operands: null };
        }
        let operands = new Set();
        for (let i = 1; i <= max; i++) {
            if (i + diff <= max) {
                operands.add(i);
            }
            if (i - diff >= 1) {
                operands.add(i);
            }
        }
        return { operands: Array.from(operands) };
    }

    function additionOperands(sum, max, cage) {
        let operands = [];

        let numRemainingCells = cage.length;
        let newTargetSum = sum;
        cage.filter(c => c.value).forEach(c => {
            numRemainingCells--;
            newTargetSum -= c.value;
        });

        // If all but one cells in the cage already have values, just solve it
        if (numRemainingCells === 1) {
            return { operands: [newTargetSum] };
        }
        // special rules for when it's a 2-cell cage
        if (cage.length === 2) {
            for (let i = 1; i <= max && i < sum; i++) {
                if (i !== sum/2 && i + max >= sum) {
                    operands.push(i);
                }
            }
        } else {
            // Incorporate existing values to find potential operands
            const numOtherCells = numRemainingCells - 1;
            const largestPossible = Math.min(max, newTargetSum - numOtherCells);
            for (let i = 1; i <= largestPossible; i++) {
                // eliminate factors that are too small to reach the target, even if the other cells all contain the largest factor somehow
                if (i + largestPossible * numOtherCells >= newTargetSum) {
                    operands.push(i);
                }
            }
        }

        if (operands.length === max) {
            operands = null;
        }
        return { operands, target: newTargetSum !== sum && newTargetSum };
    }

    // must be passed a cell containing the "item result"
    function validCellOperands($item, cage) {
        if (!$item.find('.itemSymbol').length) {
            // should only happen if this is a no-op puzzle
            return {operands: null};
        }
        const num = parseInt($item.find('.itemResult').text(), 10);
        const size = getPuzzleSize();
        if ($item.find('.multOperation').length) {
            return multiplicationOperands(num, size, cage);
        } else if ($item.find('.divisionOperation').length) {
            return divisionOperands(num, size, cage);
        } else if ($item.find('.subscrOperation').length) {
            return subtractionOperands(num, size, cage);
        } else if ($item.find('.addOperation').length) {
            return additionOperands(num, size, cage);
        }
        return {operands: null};
    }

    function validCageOperands(cage) {
        const $cellWithItemResult = cage.find(c => c.content.find('.itemResult').length).content;
        return validCellOperands($cellWithItemResult, cage);
    }

    function getPuzzleData() {
        if (typeof unsafeWindow !== undefined) {
            // Greasemonkey specific -- https://stackoverflow.com/a/25785794
            return unsafeWindow.KenKen.puzzleData;
        } else {
            return window.KenKen.puzzleData;
        }
        // const scriptContainingPuzzleData = Array.from(document.getElementsByTagName('script')).filter(s => !s.src).find(s => s.innerHTML.includes('puzzle_data'));
        // const b64data = scriptContainingPuzzleData.innerHTML.match(/puzzle_data = .*'(\w*)'/)[1];
        // return JSON.parse(base64_decode(b64data));
    }

    function getPuzzleSize() {
        return puzzleData.size;
        // const pre = 'puzzleContainer';
        // const s = [...$('#puzzleContainer')[0].classList].filter(c => c.startsWith(pre) && c.length > pre.length)[0];
        // return parseInt(s.slice(pre.length), 10);
    }

    function getCage($el) {
        const state = KenKen.steps.getCurrentState();
        // reconstruct format of KenKen.steps.getActiveItem(); from an $el, to be flexible.
        // And add some new properties
        const activeItem = {
            content: $el,
            id: $el[0].id,
            indexX: parseInt($el[0].id[1], 10),
            indexY: parseInt($el[0].id[2], 10),
            isSingle: $el.hasClass('singleValue'),
        }
        const row = activeItem.indexX - 1;
        const col = activeItem.indexY - 1;
        activeItem.x = col;
        activeItem.y = row;
        activeItem.value = state.values[row][col];

        const cage = [activeItem];

        if (activeItem.isSingle) {
            return cage;
        }

        // zero-based. coords instead of row & col.
        function getAdjacentCageMembers(x, y) {
            const size = puzzleData.size;
            const { H, V } = puzzleData.dataObj;
            const neighbors = {};
            if (x > 0 && V[y][x-1] !== '1') {
                neighbors.left = { x: x-1, y };
            }
            if (x < size-1 && V[y][x] !== '1') {
                neighbors.right = { x: x+1, y };
            }
            if (y > 0 && H[x][y-1] !== '1') {
                neighbors.up = { x, y: y-1 };
            }
            if (y < size-1 && H[x][y] !== '1') {
                neighbors.down = { x, y: y+1 };
            }
            return Object.values(neighbors).filter(o => o).map(o => {
                o.indexX = o.y + 1;
                o.indexY = o.x + 1;
                o.id = 'p' + o.indexX + o.indexY;
                o.content = $('#' + o.id);
                o.value = state.values[o.y][o.x];
                return o;
            });
        }

        // number of cage members whose neighbors we've checked
        let i = 0;
        while (i < cage.length) {
            const curMember = cage[i];

            const adjacent = getAdjacentCageMembers(curMember.x, curMember.y);
            // append cage members if they don't already exist in our list
            adjacent.filter(a => cage.every(c => c.id !== a.id)).forEach(a => {
                cage.push(a);
            });
            i++;
        }

        return cage;
    }

    // reversed
    function saveNotes(newNoteVals) {
        var state = KenKen.steps.getCurrentState();
        var activeItem = KenKen.steps.getActiveItem();
        var $content = activeItem.content;

        var x = activeItem.indexX - 1;
        var y = activeItem.indexY - 1;

        // if the cell already has a value, don't proceed
        if (state.values[x][y]) {
            return;
        }

        var notesIdx = x * state.size + y;
        var oldNotes = state.notes[notesIdx];
        var notes = [];

        for (let i = 0; i < state.size; i++) {
            notes[i] = false;
        }
        for (let j = 0; j < newNoteVals.length; j++) {
            notes[newNoteVals[j] - 1] = true;
        }

        if (state.autoNotes) {
            var values = state.values;
            for (let i = 0; i < state.size; i++) {
                if (values[x][i]) {
                    notes[values[x][i] - 1] = false;
                }
                if (values[i][y]) {
                    notes[values[i][y] - 1] = false;
                }
            }
        }

        var depends = [];
        for (let i = 0; i < state.size; i++) {
            if (notes[i] !== oldNotes[i]) {
                var currentObject = {
                    type: "notes",
                    x: notesIdx,
                    y: i,
                    newValue: notes[i],
                    oldValue: oldNotes[i]
                };
                depends.push(currentObject);
            }
        }

        KenKen.steps.saveStep({
            depends: depends
        });
        var notesText = notesString(notes);
        $content.find(".itemNotes").removeClass("empty").text(notesText);
        updateSidebarNotes();

        // (modified here) instead of the boolean array, create a actual list of nums to return
        const numericNotesArr = notes.map((b, i) => b && i + 1).filter(n => n);
        return numericNotesArr;
    }
    // reversed
    function updateSidebarNotes(item) {
        item = item || KenKen.steps.getActiveItem();
        var state = KenKen.steps.getCurrentState();
        var notesIdx = (item.indexX - 1) * state.size + item.indexY - 1;
        var notes = state.notes[notesIdx];
        var $notesContainer = $("#notesContainer");
        var children = $notesContainer.find(".notesItem");

        if (item.isSingle) {
            $notesContainer.addClass("singleState");
        } else {
            $notesContainer.removeClass("singleState");
        }
        for (var i = 0; i < state.size; i++) {
            var $elem = $(children[i]);
            if (notes[i]) {
                $elem.removeClass("active");
            } else {
                $elem.addClass("active");
            }
        }
    }

    function notesString(notes) {
        var str = '';
        for (var i = 0; i < notes.length; i++) {
            if (notes[i]) {
                str = str + (i + 1 + " ");
            }
        }
        return str;
    }

    // Mostly copied from js bundle and prettified. Added logic for validCageOperands
    function onNotesAll() {
        var state = KenKen.steps.getCurrentState();
        var activeItem = KenKen.steps.getActiveItem();
        var $content = activeItem.content;

        var x = activeItem.indexX - 1;
        var y = activeItem.indexY - 1;

        // if the cell already has a value, don't proceed
        if (state.values[x][y]) {
            return;
        }

        var notesIdx = x * state.size + y;
        var oldNotes = state.notes[notesIdx];
        var notes = oldNotes.slice(0);
        var values = state.values;

        if (activeItem.isSingle) {
            return pressKey($content.find('.itemResult').text());
        }

        const { operands } = validCageOperands(getCage($content));
        if (operands) {
            for (let i = 0; i < state.size; i++) {
                notes[i] = false;
            }
            operands.forEach(o => { notes[o-1] = true; });
        } else {
            for (let i = 0; i < state.size; i++) {
                notes[i] = true;
            }
        }

        if (state.autoNotes) {
            for (let i = 0; i < state.size; i++) {
                if (values[x][i]) {
                    notes[values[x][i] - 1] = false;
                }
                if (values[i][y]) {
                    notes[values[i][y] - 1] = false;
                }
            }
        }

        var depends = [];
        for (let i = 0; i < state.size; i++) {
            if (notes[i] !== oldNotes[i]) {
                var currentObject = {
                    type: "notes",
                    x: notesIdx,
                    y: i,
                    newValue: notes[i],
                    oldValue: oldNotes[i]
                };
                depends.push(currentObject);
            }
        }

        KenKen.steps.saveStep({
            depends: depends
        });
        var notesText = notesString(notes);
        $content.find(".itemNotes").removeClass("empty").text(notesText);
        updateSidebarNotes();

        /* commenting this out for now, since i've changed easySolve to call onNotesAll() in some cases

        // If there's only 1 possible note, just solve the cell
        if (notes.filter(n => n).length === 1) {
            return easySolve();
        }
        */

        // (modified here) instead of the boolean array, create a actual list of nums to return
        const numericNotesArr = notes.map((b, i) => b && i + 1).filter(n => n);
        return numericNotesArr;
    }

    function pressKey(char, {shiftKey}={}) {
        const charCode = char.toString().charCodeAt(0);
        document.body.dispatchEvent(
            new KeyboardEvent('keydown', { key: char.toString(), keyCode: charCode, which: charCode, shiftKey: shiftKey })
        );
    }

    // This doesn't automatically update affected notes. Investigate later
    function setValue($el, value) {
        if (!$el || !$el.length) {
            return;
        }
        KenKen.steps.saveStep({
            type: 'values',
            x: parseInt($el[0].id[1], 10) - 1,
            y: parseInt($el[0].id[2], 10) - 1,
            oldValue: 0,
            newValue: parseInt(value, 10),
        });
        $el.find('.itemValue').text(value);
        $el.addClass('withValue');
    }

    function easySolve($el) {
        // const $item = $lastHoveredItem;
        const $item = $el || KenKen.steps.getActiveItem().content;
        const isSingle = $item.hasClass('singleValue');

        if (isSingle) {
            const value = $item.find('.itemResult').text();
            if ($el) {
                return setValue($item, value);
            }
            return pressKey(value);
        }

        if ($item.hasClass('withValue')) {
            return;
        }

        // check if there is only 1 note in the cell
        //const notes = $item.find('.itemNotes').text().trim().split(' ');
        const notes = $($item.find('.itemNotes:not(.customItemNotes)')).data('notes');
        if (notes.length === 1 && notes[0] !== '') {
            if ($el) {
                return setValue($item, notes[0]);
            }
            return pressKey(notes[0]);
        } else if (!notes.length) {
            // if there's no notes, use "A" key behavior
            const newNotes = onNotesAll();
            if (newNotes.length === 1) {
                // only 1 note was added! just solve it
                pressKey(newNotes[0].toString());
            }
            return;
        }

        // check if there is an "isolated" note, or if there is only one possible operand
        if ($item.find('.isolated').length) {
            const val = $item.find('.isolated').data('value');
            if ($el) {
                //fixme
                //return setValue($item, operands[0]);
                return;
            }
            return pressKey(val.toString());
        }

        // fix any wrong notes (via pair rule)
        const $wrongNote = $item.find('.invalid-via-note-pair');
        if ($wrongNote.length) {
            // if there's only 1 valid note, then just solve it
            if (notes.length - $wrongNote.length === 1) {
                const val = $item.find('.customnote:not(.invalid-via-note-pair)').data('value');
                return pressKey(val.toString());
            }
            const wrongVals = [];
            $wrongNote.each((i, el) => {
                wrongVals.push($(el).data('value'));
            });
            return saveNotes(notes.filter(n => !wrongVals.includes(n)));
            //const wrongNote = $wrongNote;
            //return pressKey($($wrongNote).data('value'), {shiftKey: true});
        }

        const { operands } = validCageOperands(getCage($item));
        if (operands && operands.length) {
            // if there is only one possible operand, just solve it
            if (operands.length === 1) {
                // fixme
                // if ($el) {
                //     return setValue($item, operands[0]);
                // }
                return pressKey(operands[0].toString());
            }

            // remove notes that may not be valid anymore
            const newNotes = notes.filter(n => operands.includes(n));
            if (newNotes.length !== notes.length) {
                return saveNotes(newNotes);
            }
        }
    }

    function setActiveItem($el) {
        // hack: setActiveItem will not work as expected if the mouse is hovering over an item.
        // Pressing arrow keys seems to hide the cursor but I don't know how they're handling
        // this under the hood. Whatever.
        document.body.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'ArrowLeft', keyCode: 37, which: 37 })
        );
        document.body.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'ArrowRight', keyCode: 39, which: 39 })
        );

        KenKen.steps.setActiveItem($el);
        // Things can get glitchy if you don't also update this
        KenKen.puzzleContainer.find('.active').removeClass('active');
        $el.addClass('active');
    }

    // find a cell that could have some work done on it, then "easySolve()" it
    function autoSolveNext() {
        const itemEls = $('.puzzleItem').toArray();
        const elsWithoutNotes = [];

        for (let i = 0; i < itemEls.length; i++) {
            const $el = $(itemEls[i]);
            if ($el.hasClass('withValue')) { continue; }

            // single-value cell
            if ($el.hasClass('singleValue')) {
                setActiveItem($el);
                const value = $el.find('.itemResult').text();
                return pressKey(value);
            }

            // check if there is only one note in the cell
            //const notes = $el.find('.itemNotes').data('notes');
            const notes = $el.find('.itemNotes:not(.customItemNotes)').data('notes');
            if (notes.length === 1) {
                setActiveItem($el);
                return pressKey(notes[0].toString());
            }

            // check if there is an "isolated" note
            if ($el.find('.isolated').length) {
                setActiveItem($el);
                const val = $el.find('.isolated').data('value');
                return pressKey(val.toString());
            }

            // fix any wrong notes (via pair rule)
            const $wrongNote = $el.find('.invalid-via-note-pair');
            if ($wrongNote.length) {
                setActiveItem($el);

                // if there's only 1 valid note, then just solve it
                if (notes.length - $wrongNote.length === 1) {
                    const val = $el.find('.customnote:not(.invalid-via-note-pair)').data('value');
                    return pressKey(val.toString());
                }

                const wrongVals = [];
                $wrongNote.each((i, noteEl) => {
                    wrongVals.push($(noteEl).data('value'));
                });
                return saveNotes(notes.filter(n => !wrongVals.includes(n)));
                //const wrongNote = $wrongNote;
                //return pressKey($wrongNote.data('value'), {shiftKey: true});
            }

            const { operands } = validCageOperands(getCage($el));
            if (operands && operands.length) {
                // if there is only one possible operand, just solve it
                if (operands.length === 1) {
                    setActiveItem($el);
                    return pressKey(operands[0].toString());
                }

                // remove notes that may not be valid anymore
                if (notes.length) {
                    const newNotes = notes.filter(n => operands.includes(n));
                    if (newNotes.length !== notes.length) {
                        setActiveItem($el);
                        return saveNotes(newNotes);
                    }
                }
            }

            if (!notes.length) {
                elsWithoutNotes.push($el);
            }
        };

        // Otherwise, if there's any cells without notes, add em
        if (elsWithoutNotes.length) {
            setActiveItem(elsWithoutNotes[0]);
            return onNotesAll();
        }
    }

    function recalcCageTooltip($el, isInitialization) {
        const cage = getCage($el);
        const _cellWithOperation = cage.find(c => c.content.find('.itemSymbol').length);
        if (!_cellWithOperation) {
            // should only happen if this is a no-op puzzle
            return;
        }
        const $cellWithOperation = _cellWithOperation.content;
        const setContent = (content) => {
            // some weirdness with trying to set 'title' while a tooltip is open. so use data-title instead
            $cellWithOperation.attr('data-title', content);
            // you have to do this to clear the title if the tooltip is currently being displayed
            if (!isInitialization) {
                // Check to see if an actual tooltip element exists
                const $tooltip = $("#" + $cellWithOperation.attr('aria-describedby') + ' .ui-tooltip-content');
                if (!$tooltip.length) { return; }
                $tooltip.html(content.toString());
           }
        }
        if (cage.every(c => c.value)) {
            setContent('');
            return;
        }
        const { operands, target } = validCellOperands($cellWithOperation, cage);
        if (target) {
            setContent('(' + target + ') ' + (operands || ''));
        } else if (operands && operands.length) {
            setContent(operands);
        } else {
            setContent('');
        }
    }

    function highlightRowNotesExistingInOneCage(data) {
        $('.customnote').removeClass('isolatedCageHorizontal');
        $('.customnote').removeClass('isolatedCageVertical');
        const size = getPuzzleSize();

        const isCellInCage = (cage, c) => {
            return cage.some(cell => cell.id === c.id);
        }

        const testCells = (cells, classNameToApply) => {
            // ensure every cell in this list has a value or has notes
            if (!cells.every(c => c.value || c.notes.length)) {
                return;
            }
            const cagesInList = [];
            cells.forEach((c, idx) => {
                if (idx === 0) {
                    cagesInList.push([idx]);
                    return;
                }

                const cage = getCage(c.$el);
                // if previous cell is in same cage, push cur idx into "cage"
                if (isCellInCage(cage, cells[idx-1])) {
                    cagesInList[cagesInList.length-1].push(idx);
                } else {
                    cagesInList.push([idx]);
                }
            });

            // look for notes that only occur in one cage
            for (let val = 1; val <= size; val++) {
                // if this value has already been set in this list, skip
                if (cells.find(c => c.value === val)) {
                    continue;
                }
                const cellIndicesWithNote = [];
                const noteElems = [];
                cells.forEach((c, idx) => {
                    if (c.value) { return; }

                    if (c.noteBools[val-1]) {
                        const $noteElem = c.$el.find(`.note-${val}`);
                        cellIndicesWithNote.push(idx);
                        noteElems.push($noteElem);
                    }
                });

                // don't care if this note value appears 0 or 1 times in the list
                if (cellIndicesWithNote.length < 2) {
                    continue;
                }

                // now that we have the cell indices, see if they're all in the same cage.
                // kind of assuming that a cage won't "wrap around" a cell and return to the same row/col.
                // But it's possible. See 35890 (the 26+ cell on the left)
                let prevCage;
                let areAllInSameCage = true;
                for (let i = 0; i < cellIndicesWithNote.length; i++) {
                    const curCage = cagesInList.find(cage => cage.includes(cellIndicesWithNote[i]));
                    if (i === 0) {
                        prevCage = curCage;
                    } else if (prevCage !== curCage) {
                        areAllInSameCage = false;
                        break;
                    }
                }
                if (areAllInSameCage) {
                    noteElems.forEach($noteElem => {
                        $noteElem.addClass(classNameToApply);
                    });
                }
            }
        }

        const transpose = m => m[0].map((x,i) => m.map(x => x[i]));

        for (let row = 0; row < size; row++) {
            testCells(data[row], 'isolatedCageHorizontal');
        }

        const cols = transpose(data);
        for (let col = 0; col < size; col++) {
            testCells(cols[col], 'isolatedCageVertical');
        }
    }

    function highlightIsolatedNotes(data) {
        $('.customnote').removeClass('isolated');
        const size = getPuzzleSize();

        const testCells = (cells) => {
            // ensure every cell in this list has a value or has notes
            if (!cells.every(c => c.value || c.notes.length)) {
                return;
            }
            // look for notes that only occur once in the list
            for (let val = 1; val <= size; val++) {
                // if this value has already been set in this list, skip
                if (cells.find(c => c.value === val)) {
                    continue;
                }
                const noteElems = [];
                cells.filter(c => !c.value).forEach(c => {
                    if (c.noteBools[val-1]) {
                        noteElems.push(c.$el.find(`.note-${val}`));
                    }
                });
                if (noteElems.length === 1) {
                    noteElems[0].addClass('isolated');
                }
            }
        }

        const transpose = m => m[0].map((x,i) => m.map(x => x[i]));

        for (let row = 0; row < size; row++) {
            testCells(data[row]);
        }

        const cols = transpose(data);
        for (let col = 0; col < size; col++) {
            testCells(cols[col]);
        }
    }

    function filterInvalidNotesViaNotePair(data) {
        $('.customnote').removeClass('invalid-via-note-pair');
        const size = getPuzzleSize();

        const testCells = (cells) => {
            const cellsWithNotes = cells.filter(c => !c.value && c.notes.length);

            if (cellsWithNotes.length < 3) {
                return;
            }

            const tupleSizes = [2, 3, 4]; // could add 5-elem tuples but ehh
            tupleSizes.forEach(tupleSize => {
                const tuples = [];
                for (let i = 0; i < cellsWithNotes.length; i++) {
                    const curCell = cellsWithNotes[i];
                    if (curCell.notes.length !== tupleSize) { continue; }
                    if (tuples.find(t => t.indices.includes(i))) { continue; }
                    // look for n more cells with matching tuple
                    const otherIndices = [];
                    for (let j = 0; j < cellsWithNotes.length; j++) {
                        if (j === i) { continue; }
                        const otherCell = cellsWithNotes[j];

                        if (arrayContainsSubset(curCell.notes, otherCell.notes)) {
                            otherIndices.push(j);
                        }
                    }
                    if (otherIndices.length === tupleSize - 1) {
                        tuples.push({ notes: curCell.notes, indices: [i, ...otherIndices] });
                    }
                }

                tuples.forEach(({ notes, indices }) => {
                    cellsWithNotes.forEach((c, idx) => {
                        if (indices.includes(idx)) { return; }
                        notes.forEach(n => {
                            if (c.noteBools[n-1]) {
                                c.$el.find(`.note-${n}`).addClass('invalid-via-note-pair');
                            }
                        });
                    });
                });

            });
        }

        const transpose = m => m[0].map((x,i) => m.map(x => x[i]));

        for (let row = 0; row < size; row++) {
            testCells(data[row]);
        }

        const cols = transpose(data);
        for (let col = 0; col < size; col++) {
            testCells(cols[col]);
        }
    }

    // assume same sort order
    function arrayContainsSubset(a, b) {
        if (a.length < b.length) { return false; }
        if (a.length === b.length) {
            for (let i = 0; i < a.length; i++) {
                if (a[i] !== b[i]) { return false };
            }
            return true;
        }

        return b.every(n => a.includes(n));
    }

    // assume same sort order.
    function arraysEqual(a, b) {
        if (a.length !== b.length) { return false; }

        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) { return false };
        }
        return true;
    }

    // we want styled notes, so hide .itemNotes and show a copy with the notes wrapped in their own spans
    function customizeNoteElements(opts) {
        const isInit = opts && opts.isInit;

        $('.itemNotes:not(.customItemNotes)').each((idx, el) => {
            const $el = $(el);

            if (isInit) {
                $el.css({ display: 'none' });
                let $customNoteContainer = $('<span class="itemNotes customItemNotes"></span>');
                $el.parent().append($customNoteContainer);
                $el.data('notes', []);
            }

            const notes = $el.text().split(' ').filter(c => c).map(c => parseInt(c, 10));
            const prevNotes = $el.data('notes');
            // In theory we should be able to move this line to after the early return. But there's some glitchy race condition happening.
            $el.data('notes', notes);

            // Pretty important optimization.
            if (prevNotes && arraysEqual(notes, prevNotes)) {
                return;
            }
            //$el.data('notes', notes);

            const $customNoteContainer = $el.parent().find('.customItemNotes');
            $customNoteContainer.html(notes.map(c => `<span class="customnote note-${c}" data-value="${c}">${c}</span>`).join(' '));
        });


        // Optimization: gather cell data and selectors here, so the highlight/filter functions
        // don't each need to do it on their own
        const state = KenKen.steps.getCurrentState();

        const getCellData = (x, y) => {
            // here, x is row, y is col
            const id = 'p' + (x + 1) + '' + (y + 1);
            const value = state.values[x][y];
            const notesIdx = x * state.size + y;
            const noteBools = state.notes[notesIdx];
            const notes = [];
            for (let i = 0; i < state.size; i++) {
                if (noteBools[i]) {
                    notes.push(i+1);
                }
            }
            const $el = $('#' + id);
            return { id, value, noteBools, notes, $el };
        };

        const data = [];
        for (let row = 0; row < state.size; row++) {
            const cells = [];
            data.push(cells);
            for (let col = 0; col < state.size; col++) {
                cells.push(getCellData(row, col));
            }
        }

        highlightRowNotesExistingInOneCage(data);
        highlightIsolatedNotes(data);
        filterInvalidNotesViaNotePair(data);
    }

    // click/keypress means the board state may have changed, so we should reapply custom html
    function reapplyCustomizationsAfterDelay() {
        clearTimeout(applyCustomizationsTimeout);

        applyCustomizationsTimeout = setTimeout(() => {
            const before = Date.now();
            const $activeItem = KenKen.steps.getActiveItem().content;
            if (!$activeItem.hasClass('singleValue')) {
                recalcCageTooltip($activeItem);
            }
            customizeNoteElements();
            //console.log('customizeNoteElements took', Date.now() - before, 'ms');
            applyCustomizationsTimeout = null;
        }, 40);
    }

    // $(document).on('mouseover', '.puzzleItem', function() {
    //     $lastHoveredItem = $(this);
    // });

    function initTooltips() {
        $('#puzzleContainer').tooltip({
            position: { my: 'center bottom+4', at: 'center top' },
            items: '.withSymbol',
            content: function() {
                // some weirdness with trying to set 'title' while a tooltip is open
                return $(this).attr('data-title');
            },
        });
    }

    function init() {
        puzzleData = getPuzzleData();
        $('.puzzleItem').each(function(idx, el) {
            const $el = $(el);
            // init tooltips with factors
            if ($el.find('.itemSymbol').length) {
                $el.addClass('withSymbol');
                recalcCageTooltip($el, true);
            }
        });
        initTooltips();
        customizeNoteElements({ isInit: true });

        $(document).on('keydown', function(e) {
            // some of these operations depend on custom html being up-to-date.
            // so if reapplyCustomizationsAfterDelay() is yet to be completed, don't do anything.
            if (!!applyCustomizationsTimeout) {
                if (['a'].includes(e.key)) {
                    return;
                }
                if (['KeyF', 'KeyG'].includes(e.originalEvent.code)) {
                    return;
                }
            }

            if (e.key === 'a') {
                // $('#notesAll').click();
                onNotesAll();
            }
            if (e.key === 'z') {
                $('#btnUndo').click();
            }
            if (e.key === 'y') {
                $('#btnRedo').click();
            }

            if (e.originalEvent.code === 'KeyF') {
                easySolve();
            }

            if (e.originalEvent.code === 'KeyG') {
                const before = Date.now();
                autoSolveNext();
                //console.log('autoSolveNext took', Date.now() - before, 'ms');
            }

            //ez reach numbers
            const easyReachNumber = { KeyQ: 6, KeyW: 7, KeyE: 8, KeyR: 9 }[e.originalEvent.code];
            if (easyReachNumber) {
                pressKey(easyReachNumber, { shiftKey: e.shiftKey });
            }

            reapplyCustomizationsAfterDelay();
        });

        $(document.body).on('mouseup', function(e) {
            reapplyCustomizationsAfterDelay();
        });

        // When you hover over a note, highlight matching notes on the same row or col
        $('#puzzleContainer').on('mouseover', '.customnote', function() {
            const $el = $(this);
            const noteVal = $el.data('value');
            // find cells on the same line
            const $item = $el.closest('.puzzleItem');
            const row = $item[0].id[1];
            const col = $item[0].id[2];
            const size = getPuzzleSize();
            const css = {color: 'sandybrown'};
            $('.customnote').css({color: ''}); // reset all notes first
            for (let i = 1; i <= size; i++) {
                $('#p' + row + i).find(`.note-${noteVal}`).css(css);
                $('#p' + i + col).find(`.note-${noteVal}`).css(css);
            }
        });
        $('#puzzleContainer').on('mouseleave', '.customnote', function() {
            $('.customnote').css({color: ''});
        });
        // $('.itemNotes').on('click', '.customnote', function(e) {
        //     const $el = $(this);
        //     const noteVal = $el.data('value');
        //     e.stopPropagation();
        //     pressKey(noteVal, {shiftKey: true});
        //     reapplyCustomizationsAfterDelay();
        // });
    }

    // every 200ms, check to see if the puzzle is loaded
    (function checkPuzzleLoaded() {
        if (!$('.puzzleItem').length) {
            setTimeout(checkPuzzleLoaded, 200);
        } else {
            init();
        }
    })();
})();