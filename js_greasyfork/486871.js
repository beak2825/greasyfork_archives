// ==UserScript==
// @name         Infinite craft QOL 
// @namespace    http://tampermonkey.net/
// @version      2024-02-07
// @description  Infinite craft Quality of life scripts 
// @author       You
// @match        http://neal.fun/infinite-craft
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486871/Infinite%20craft%20QOL.user.js
// @updateURL https://update.greasyfork.org/scripts/486871/Infinite%20craft%20QOL.meta.js
// ==/UserScript==


//----------------------------------------------------------------------------------------------------------------------------------------
//CREATE SORTING FUNCTION
const sortElements= () => {
    window.$nuxt.$root.$children[2].$children[0].$children[0]._data.elements.sort((a, b) => (a.text > b.text) ? 1 : -1);
}

//----------------------------------------------------------------------------------------------------------------------------------------
// CREATE SORTING BUTTON FUNCTION
function createSortButton(){
    const buttonStyle = {
        appearance: 'none',
        position: 'absolute',
        width: '80px',
        height: '35px',
        backgroundColor: '#1A1B31',
        color: 'white',
        fontWeight: 'bold',
        fontFamily: 'Roboto,sans-serif',
        border: '0',
        outline: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        padding: 4,
        left: '24px',
        bottom: '24px',
    }
    
    function addSortButtonDOM() {
        var button = document.createElement("button");
        Object.keys(buttonStyle).forEach((attr) => {
            button.style[attr] = buttonStyle[attr];
        });
    
        button.innerText = "Sort elements"
        button.addEventListener('click', () => sortElements());
    
        document.body.appendChild(button);
    }
    addSortButtonDOM();
}

//----------------------------------------------------------------------------------------------------------------------------------------
// REPLACE ORIGINAL NON WORKING SEARCH BAR
function getElementByPlaceholder(placeholder) {
    // Get all input elements in the document
    const inputElements = document.querySelectorAll('input');
  
    // Iterate through the input elements
    for (const input of inputElements) {
      // Check if the current input element has the specified placeholder
      if (input.placeholder === placeholder) {
        return input; // Return the element if found
      }
    }
  
    return null; // Return null if no element with the specified placeholder is found
  }

function replaceSearchBar(){
    let items = () => [...document.querySelectorAll('.item')]
    let show = (elt) => elt.style.display=''
    let hide = (elt) => elt.style.display='none'
    let search = (text) => (items().forEach(show), items().filter(e => !e.innerText.toLowerCase().includes(text.toLowerCase())).forEach(hide))
    let inputElt = document.createElement('input'); inputElt.type='text';

    function handle(e) { search(e.target.value) }

    inputElt.style.webkitFontSmoothing = 'antialiased';
    inputElt.style.userSelect = 'none';
    inputElt.style.boxSizing = 'border-box';
    inputElt.style.margin = '0';
    inputElt.style.width = '100%';
    inputElt.style.fontSize = '16px';
    inputElt.style.border = 'none';
    inputElt.style.borderTop = '1px solid #c8c8c8';
    inputElt.style.outline = '0';
    inputElt.style.padding = '0 20px 0 40px';
    inputElt.style.height = '40px';
    inputElt.style.lineHeight = '18px';
    inputElt.style.position = 'relative';
    inputElt.style.background = 'url(/infinite-craft/search.svg) no-repeat 22px 22px';
    inputElt.style.backgroundSize = '21px 21px';
    inputElt.style.backgroundPosition = '10px 10px';

    inputElt.placeholder = "Search items.....";

    inputElt.addEventListener('input', handle);

    getElementByPlaceholder("Search items...").replaceWith(inputElt);
}

// adrianmgg's SCRIPT TO ADD RECIPES LIST + DISCOVERIES LIST

(function() {
    'use strict';
    const elhelper = (function() { /* via https://github.com/adrianmgg/elhelper */
        function setup(elem, { style: { vars: styleVars = {}, ...style } = {}, attrs = {}, dataset = {}, events = {}, classList = [], children = [], parent = null, insertBefore = null, ...props }) {
            for (const k in style) elem.style[k] = style[k];
            for (const k in styleVars) elem.style.setProperty(k, styleVars[k]);
            for (const k in attrs) elem.setAttribute(k, attrs[k]);
            for (const k in dataset) elem.dataset[k] = dataset[k];
            for (const k in events) elem.addEventListener(k, events[k]);
            for (const c of classList) elem.classList.add(c);
            for (const k in props) elem[k] = props[k];
            for (const c of children) elem.appendChild(c);
            if (parent !== null) {
                if (insertBefore !== null) parent.insertBefore(elem, insertBefore);
                else parent.appendChild(elem);
            }
            return elem;
        }
        function create(tagName, options = {}) { return setup(document.createElement(tagName), options); }
        function createNS(namespace, tagName, options = {}) { return setup(document.createElementNS(namespace, tagName), options); }
        return {setup, create, createNS};
    })();
    const GM_VALUE_KEY = 'infinitecraft_observed_combos';
    const GM_DATAVERSION_KEY = 'infinitecraft_data_version';
    const GM_DATAVERSION_LATEST = 1;
    // TODO this should probably use the async versions of getvalue/setvalue since we're already only calling it from async code
    function saveCombo(lhs, rhs, result) {
        console.log(`crafted ${lhs} + ${rhs} -> ${result}`);
        const data = getCombos();
        if(!(result in data)) data[result] = [];
        const sortedLhsRhs = sortRecipeIngredients([lhs, rhs]);
        for(const existingPair of data[result]) {
            if(sortedLhsRhs[0] === existingPair[0] && sortedLhsRhs[1] === existingPair[1]) return;
        }
        const pair = [lhs, rhs];
        pair.sort();
        data[result].push(pair);
        GM_setValue(GM_VALUE_KEY, data);
        GM_setValue(GM_DATAVERSION_KEY, GM_DATAVERSION_LATEST);
    }
    // !! this sorts in-place !!
    function sortRecipeIngredients(components) {
        // internally the site uses localeCompare() but that being locale-specific could cause some problems in our use case
        //  it shouldn't matter though, since as long as we give these *some* consistent order it'll avoid duplicates,
        //  that order doesn't need to be the same as the one the site uses
        return components.sort();
    }
    function getCombos() {
        const data = GM_getValue(GM_VALUE_KEY, {});
        const dataVersion = GM_getValue(GM_DATAVERSION_KEY, 0);
        if(dataVersion > GM_DATAVERSION_LATEST) {
            // uh oh
            // not gonna even try to handle this case, just toss up an error alert
            const msg = `Outdated script version, backup your save to continue. Press cancel`
            alert(msg);
            throw new Error(msg);
        }
        if(dataVersion < GM_DATAVERSION_LATEST) {
            // confirm that user wants to update save data
            const updateConfirm = confirm(`Outdated script version, backup your save to continue. Press cancel`);
            if(!updateConfirm) {
                throw new Error('user chose not to update save data');
            }
            // upgrade the data
            if(dataVersion <= 0) {
                // recipes in this version weren't sorted, and may contain duplicates once sorting has been applied
                for(const result in data) {
                    // sort the recipes (just do it in place, since we're not gonna use the old data again
                    for(const recipe of data[result]) {
                        sortRecipeIngredients(recipe);
                    }
                    // build new list with just the ones that remain not duplicate
                    const newRecipesList = [];
                    for(const recipe of data[result]) {
                        if(!(newRecipesList.some(r => recipe[0] === r[0] && recipe[1] === r[1]))) {
                            newRecipesList.push(recipe);
                        }
                    }
                    data[result] = newRecipesList;
                }
            }
            // now that it's upgraded, save the upgraded data & update the version
            GM_setValue(GM_VALUE_KEY, data);
            GM_setValue(GM_DATAVERSION_KEY, GM_DATAVERSION_LATEST);
            // (fall through to retun below)
        }
        // the data is definitely current now
        return data;
    }
    function main() {
        const _getCraftResponse = icMain.getCraftResponse;
        const _selectElement = icMain.selectElement;
        icMain.getCraftResponse = async function(lhs, rhs) {
            const resp = await _getCraftResponse.apply(this, arguments);
            saveCombo(lhs.text, rhs.text, resp.result);
            return resp;
        };

        // random element thing
        document.documentElement.addEventListener('mousedown', e => {
            if(e.buttons === 1 && e.altKey && !e.shiftKey) { // left mouse + alt
                e.preventDefault();
                e.stopPropagation();
                const elements = icMain._data.elements;
                const randomElement = elements[Math.floor(Math.random() * elements.length)];
                _selectElement(e, randomElement);
            } else if(e.buttons === 1 && !e.altKey && e.shiftKey) { // lmb + shift
                e.preventDefault();
                e.stopPropagation();
                const instances = icMain._data.instances;
                const lastInstance = instances[instances.length - 1];
                const lastInstanceElement = icMain._data.elements.filter(e => e.text === lastInstance.text)[0];
                _selectElement(e, lastInstanceElement);
            }
        }, {capture: false});

        // regex-based searching
        const _sortedElements__get = icMain?._computedWatchers?.sortedElements?.getter;
        // if that wasn't where we expected it to be, don't try to patch it
        if(_sortedElements__get !== null && _sortedElements__get !== undefined) {
            icMain._computedWatchers.sortedElements.getter = function() {
                if(this.searchQuery && this.searchQuery.startsWith('regex:')) {
                    try {
                        const pattern = new RegExp(this.searchQuery.substr(6));
                        return this.elements.filter((element) => pattern.test(element.text));
                    } catch(err) {
                        return [];
                    }
                } else {
                    return _sortedElements__get.apply(this, arguments);
                }
            }
        }

        // get the dataset thing they use for scoping css stuff
        // TODO add some better handling for if there's zero/multiple dataset attrs on that element in future
        const cssScopeDatasetThing = Object.keys(icMain.$el.dataset)[0];

        function mkElementItem(element) {
            return elhelper.create('div', {
                classList: ['item'],
                dataset: {[cssScopeDatasetThing]: ''},
                children: [
                    elhelper.create('span', {
                        classList: ['item-emoji'],
                        dataset: {[cssScopeDatasetThing]: ''},
                        textContent: element.emoji,
                        style: {
                            pointerEvents: 'none',
                        },
                    }),
                    document.createTextNode(` ${element.text} `),
                ],
            });
        }

        /* this will call genFn and iterate all the way through it,
           but taking a break every chunkSize iterations to allow rendering and stuff to happen.
           returns a promise. */
        function nonBlockingChunked(chunkSize, genFn, timeout = 0) {
            return new Promise((resolve, reject) => {
                const gen = genFn();
                (function doChunk() {
                    for(let i = 0; i < chunkSize; i++) {
                        const next = gen.next();
                        if(next.done) {
                            resolve();
                            return;
                        }
                    }
                    setTimeout(doChunk, timeout);
                })();
            });
        }

        // recipes popup
        const recipesListContainer = elhelper.create('div', {
        });
        function clearRecipesDialog() {
            while(recipesListContainer.firstChild !== null) recipesListContainer.removeChild(recipesListContainer.firstChild);
        }
        const recipesDialog = elhelper.create('dialog', {
            parent: document.body,
            children: [
                // close button
                elhelper.create('button', {
                    textContent: 'x',
                    events: {
                        click: (evt) => recipesDialog.close(),
                    },
                }),
                // the main content
                recipesListContainer,
            ],
            style: {
                // need to unset this one thing from the page css
                margin: 'auto',
            },
            events: {
                close: (e) => {
                    clearRecipesDialog();
                },
            },
        });
        async function openRecipesDialog(childGenerator) {
            clearRecipesDialog();
            // create a child to add to for just this call,
            //  as a lazy fix for the bug we'd otherwise have where opening a menu, quickly closing it, then opening it again
            //  would lead to the old menu's task still adding stuff to the new menu.
            //  (this doesn't actually stop any unnecessary work, but it at least prevents the possible visual bugs)
            const container = elhelper.create('div', {parent: recipesListContainer});
            // show the dialog
            recipesDialog.showModal();
            // populate the dialog
            await nonBlockingChunked(512, function*() {
                for(const child of childGenerator()) {
                    container.appendChild(child);
                    yield;
                }
            });
        }

        // recipes button
        function addControlsButton(label, handler) {
            elhelper.create('div', {
                parent: document.querySelector('.side-controls'),
                textContent: label,
                style: {
                    cursor: 'pointer',
                },
                events: {
                    click: handler,
                },
            });
        }

        addControlsButton('recipes', () => {
            // build a name -> element map
            const byName = {};
            for(const element of icMain._data.elements) byName[element.text] = element;
            function getByName(name) { return byName[name] ?? {emoji: "❌", text: `[userscript encountered an error trying to look up element '${name}']`}; }
            const combos = getCombos();
            function listItemClick(evt) {
                const elementName = evt.target.dataset.comboviewerElement;
                document.querySelector(`[data-comboviewer-section="${CSS.escape(elementName)}"]`).scrollIntoView({block: 'nearest'});
            }
            function mkLinkedElementItem(element) {
                return elhelper.setup(mkElementItem(element), {
                    events: { click: listItemClick },
                    dataset: { comboviewerElement: element.text },
                });
            }
            openRecipesDialog(function*(){
                for(const comboResult in combos) {
                    if(comboResult === 'Nothing') continue;
                    // anchor for jumping to
                    yield elhelper.create('div', {
                        dataset: { comboviewerSection: comboResult },
                    });
                    for(const [lhs, rhs] of combos[comboResult]) {
                        yield elhelper.create('div', {
                            children: [
                                mkLinkedElementItem(getByName(comboResult)),
                                document.createTextNode(' = '),
                                mkLinkedElementItem(getByName(lhs)),
                                document.createTextNode(' + '),
                                mkLinkedElementItem(getByName(rhs)),
                            ],
                        });
                    }
                }
            });
        });

        // first discoveries list (just gonna hijack the recipes popup for simplicity)
        addControlsButton('discoveries', () => {
            openRecipesDialog(function*() {
                for(const element of icMain._data.elements) {
                    if(element.discovered) {
                        yield mkElementItem(element);
                    }
                }
            });
        });

        // pinned combos thing
        const sidebar = document.querySelector('.container > .sidebar');
        const pinnedCombos = elhelper.create('div', {
            parent: sidebar,
            insertBefore: sidebar.firstChild,
            style: {
                position: 'sticky',
                top: '0',
                background: 'white',
                width: '100%',
                maxHeight: '50%',
                overflowY: 'auto',
            },
        });
        icMain.selectElement = function(mouseEvent, element) {
            if(mouseEvent.buttons === 4 || (mouseEvent.buttons === 1 && mouseEvent.altKey && !mouseEvent.shiftKey)) {
                // this won't actually stop it since what gets passed into this is a mousedown event
                mouseEvent.preventDefault();
                mouseEvent.stopPropagation();
                // this isnt a good variable name but it's slightly funny and sometimes that's all that matters
                const elementElement = mkElementItem(element);
                elhelper.setup(elementElement, {
                    parent: pinnedCombos,
                    events: {
                        mousedown: (e) => {
                            if(e.buttons === 4 || (e.buttons === 1 && e.altKey && !e.shiftKey)) {
                                pinnedCombos.removeChild(elementElement);
                                return;
                            }
                            icMain.selectElement(e, element);
                        },
                    },
                });
                return;
            }
            return _selectElement.apply(this, arguments);
        };
    }
    // stores the object where most of the infinite craft functions live.
    //  can be assumed to be set by the time main is called
    let icMain = null;
    // need to wait for stuff to be actually initialized.
    //  might be an actual thing we can hook into to detect that
    //  but for now just waiting until the function we want exists works well enough
    (function waitForReady(){
        icMain = Window?.$nuxt?._route?.matched?.[0]?.instances?.default;
        if(icMain !== undefined && icMain !== null) main();
        else setTimeout(waitForReady, 10);
    })();
})();
 

//--------------------------------------------------------------------------------------------------------------------------------------------------
// Calling previously declared functions
createSortButton();
replaceSearchBar();
