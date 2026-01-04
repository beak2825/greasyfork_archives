// ==UserScript==
// @name         Add non-MFC figure
// @namespace    https://tharglet.me.uk
// @version      2.6
// @description  Track preordered non-MFC items on collection screen
// @author       Tharglet
// @match        https://myfigurecollection.net/?*mode=view&*tab=collection&*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=myfigurecollection.net
// @grant        GM_addStyle
// @license      CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/407174/Add%20non-MFC%20figure.user.js
// @updateURL https://update.greasyfork.org/scripts/407174/Add%20non-MFC%20figure.meta.js
// ==/UserScript==

//Polyfill for GM_addStyle for Greasemonkey...
if(typeof GM_addStyle == 'undefined') {
    GM_addStyle = (aCss) => {
        'use strict';
        let head = document.getElementsByTagName('head')[0];
        if (head) {
            let style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.textContent = aCss;
            head.appendChild(style);
            return style;
        }
        return null;
    };
}

GM_addStyle(`
.non-mfc-item__tray-icon {
border: green 1px solid;
display: block;
margin: 8px;
padding: 1px;
}
.non-mfc-item__icon-container {
float: left;
margin-bottom: 20px;
}
.non-mfc-item__tray-icon img {
width: 60px;
height: 60px;
border-radius: 2px;
}
.non-mfc-item__edit, .non-mfc-item__delete {
display: inline-block;
}

.non-mfc-item__edit span, .non-mfc-item__delete span {
font-size: 16px;
margin: 0 4px;
}

/* Pip styles */
.item-custompip {
    display: block;
    position: absolute;
    right: 1px;
    bottom: 1px;
    height: 16px;
    padding: 1px 2px 2px 3px;
    line-height: 16px;
    color: white;
}

.item-is-paid {
    background-color: green;
}

.item-is-shipped {
    background-color: gold;
}

.item-is-stored {
    background-color: orangered;
}

.icon-dollar:before {
    font-family: serif !important;
    content: "$";
    font-weight: bolder !important;
}

.icon-plane:before {
    font-family: serif !important;
    content: "🛩️";
    font-weight: bolder !important;
}

.icon-stored:before {
    font-family: serif !important;
    content: "🏭";
    font-weight: bolder !important;
}
`);

(function() {
    'use strict';
    /** Amout of figures user has already preordered */
    let BASE_COUNT = 0;

    /** Parameter value for detailed list */
    const DETAILED_LIST = '0';

    /** Array of non-MFC figures the user has preordered */
    let additionalFigures = JSON.parse(GM_getValue("additionalFigures", "[]"));

    /** Pips for paid and shipped */
    const PAID_PIP = '<span class="item-custompip item-is-paid"><span class="tiny-icon-only icon-dollar"></span></span>';
    const SHIPPED_PIP = '<span class="item-custompip item-is-shipped"><span class="tiny-icon-only icon-plane"></span></span>';
    const STORED_PIP = '<span class="item-custompip item-is-stored"><span class="tiny-icon-only icon-stored"></span></span>';

    const ORDERED_COUNT_SELECTOR = '.result-tabs .tab .selected .count';

    /**
    * Converts string to HTML elements
    */
    const htmlToElement = (html) => {
        let template = document.createElement('template');
        html = html.trim();
        template.innerHTML = `${html}`;
        return template.content;
    }

    /**
     * Tests if we're viewing the logged in user's preorders page
     */
    const isUsersPreorderPage = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get('status');
        if(status == 1) {
            let loggedInUser = document.querySelector('.user-menu .handle');
            if(loggedInUser) {
                let userLink = loggedInUser.getAttribute('href');
                if(userLink === '/session/signup') {
                    return false;
                } else {
                    let userParam;
                    const windowLocation = window.location.href;
                    if(windowLocation.startsWith('https://myfigurecollection.net/profile/')) {
                        userParam = windowLocation.match(/https:\/\/myfigurecollection\.net\/profile\/([^\/]*)/)[1];
                    } else {
                        const urlParams = new URLSearchParams(window.location.search);
                        userParam = urlParams.get('username');
                    }
                    return userParam === userLink.substring('9');
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    /** Helper function to reset out MFC item form */
    const resetNonMfcItemForm = () => {
        document.getElementById('non-mfc-item__form-title').innerText = 'Add non-MFC figure';
        document.getElementById('addNonMfcItem').innerText = 'Add';
        document.getElementById('nonMfcItemEditId').value = '';
        document.getElementById('nonMfcItemName').value = '';
        document.getElementById('nonMfcItemImage').value = '';
        document.getElementById('nonMfcItemLink').value = '';
        document.getElementById('nonMfcItemReleaseDate').value = '';
        document.getElementById('nonMfcItemHasShipped').checked = false;
        document.getElementById('nonMfcItemIsStored').checked = false;
        document.getElementById('nonMfcItemHasPaid').checked = false;
    }

    const drawAdditionalFigures = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const groupBy = urlParams.get('groupBy');
        const output = urlParams.get('output');
        //Clear all additions before redo
        const additions = document.getElementById('nonMfcAdditions');
        if(additions) {
            additions.remove();
        }
        document.querySelectorAll('.non-mfc-item__icon').forEach(e => e.remove());
        document.querySelectorAll('.non-mfc-item__edit').forEach(e => e.remove());
        document.querySelectorAll('.non-mfc-item__delete').forEach(e => e.remove());
        document.querySelectorAll('.non-mfc-item__year-header').forEach(e => e.remove());
        //Create a lookup list of existing date headings and their associated object
        //Created so we can splice and keep track of new entries
        const dateHeadingsList = [];
        if(groupBy == 'releaseDates') {
            let dateHeadings;
            if(output === '0') {
                dateHeadings = document.querySelectorAll('div.results-title');
            } else {
                dateHeadings = document.querySelectorAll('.item-group-by h3');
            }
            dateHeadings.forEach((heading) => {
                const dateHeadingElement = {};
                dateHeadingElement.year = heading.innerText.substring(0,4);
                dateHeadingElement.month = heading.innerText.substring(5);
                dateHeadingElement.element = heading;
                dateHeadingsList.push(dateHeadingElement);
            });
        }
        if(additionalFigures.length > 0) {
            //update item count
            let totalFigureCount = BASE_COUNT + additionalFigures.length;
            document.querySelector(ORDERED_COUNT_SELECTOR).innerText = totalFigureCount;
            document.querySelector('.results-count-value').lastChild.nodeValue = `${totalFigureCount} items`;
            //Pre-add setup
            const addList = document.querySelector('#nonMfcFigureList');
            if(groupBy !== 'releaseDates' && !!groupBy) {
                if(output === DETAILED_LIST) {
                    document.querySelector('.results').append(htmlToElement('<div id="nonMfcAdditions" class="results-title">Non-MFC</div>'));
                } else {
                    document.querySelector('.result .item-icons').prepend(htmlToElement('<div class="item-group-by" id="nonMfcAdditions"><h3>Non-MFC</h3></div>'));
                }

            }
            //Add icons to page and delete box
            additionalFigures.forEach((fig, idx) => {
                let linkLine;
                const figYear = fig.date.substring(0, 4);
                const figMonth = fig.date.substring(5);
                let pip = '';
                if(fig.hasShipped) {
                    pip += SHIPPED_PIP;
                } else if(fig.isStored) {
                    pip += STORED_PIP;
                } else if(fig.hasPaid) {
                    pip += PAID_PIP;
                }
                const figureThumb = `<span class="non-mfc-item__icon item-icon">
<a href="${fig.link}" class="anchor tbx-tooltip item-root-0 item-category-1">
<img src="${fig.image}"/>
${pip}
</a>
</span>`;
                if(output === DETAILED_LIST) {
                    linkLine = `<div class="result">
                                <div class="dgst item-dgst item-stamp">
                                <div class="dgst-wrapper">
                                <a href="${fig.link}" class="dgst-icon has-flags">
                                <img src="${fig.image}" alt="${fig.name}">
                                </a>
                                <div class="dgst-data">
                                <div class="dgst-anchor">
                                <a href="${fig.link}" title="${fig.name}">${fig.name}</a>
                                </div>
                                <div class="dgst-meta">
                                <span class="meta category item-category-1" href="#">Non-MFC</span>
                                </div>
                                <div class="dgst-meta">
                                <span class="meta time">${fig.date}</span>
                                </div></div></div></div></div>`
                }
                addList.append(htmlToElement(`<span class='non-mfc-item__icon-container'>
                <span class="non-mfc-item__icon non-mfc-item__tray-icon">
                <a href="${fig.link}" class="tbx-tooltip item-root-0 item-category-1">
                <img src="${fig.image}"/>
                </a>
                </span>
                <a href="#" class='non-mfc-item__edit' title="Edit" data-index="${idx}"><span class="tiny-icon-only icon-pencil-square-o" data-index="${idx}"></span></a>
                <a href="#" class='non-mfc-item__delete' title="Delete" data-index="${idx}"><span class="tiny-icon-only icon-trash-o" data-index="${idx}"></span></a>
                </span>`));
                let toAppend = true;
                const yearMonthString = `${figYear}-${figMonth}`;
                if(groupBy == 'releaseDates') {
                    dateHeadingsList.forEach((heading, headingIndex) => {
                        if(toAppend) {
                            const headingYear = heading.year;
                            const headingMonth = heading.month;
                            if(figYear == headingYear && figMonth == headingMonth) {
                                if(output === DETAILED_LIST) {
                                    heading.element.after(htmlToElement(linkLine));
                                } else {
                                    heading.element.after(htmlToElement(figureThumb));
                                }
                                toAppend = false;
                            } else if(new Date(figYear, figMonth, 1) > new Date(headingYear, headingMonth, 1)) {
                                if(output === DETAILED_LIST) {
                                    const newHeading = `<div class="results-title non-mfc-item__year-header" id='nhi_${yearMonthString}'>${yearMonthString}</div>`
                                    heading.element.before(htmlToElement(newHeading + linkLine));
                                } else {
                                    const newHeading = `<div class="item-group-by"><h3 class="non-mfc-item__year-header" id='nhi_${yearMonthString}'>${yearMonthString}</h3></div>`
                                    heading.element.parentElement.parentElement.insertBefore(htmlToElement(newHeading), heading.element.parentElement);
                                    document.querySelector(`#nhi_${yearMonthString}`).after(htmlToElement(figureThumb));
                                }
                                dateHeadingsList.splice(
                                    headingIndex,
                                    0,
                                    {
                                        year: figYear,
                                        month: figMonth,
                                        element: document.querySelector(`#nhi_${yearMonthString}`)
                                    }
                                );
                                toAppend = false;
                            }
                        }
                    });
                    //Append if trailing
                    if(toAppend) {
                        if(output === DETAILED_LIST) {
                            const newHeading = `<div class="results-title non-mfc-item__year-header" id='nhi_${yearMonthString}'>${yearMonthString}</div>`
                            document.querySelector('.results').append(htmlToElement('<div class="item-group-by">' + newHeading + linkLine + '</div>'));
                        } else {
                            const newHeading = `<h3 class="non-mfc-item__year-header" id='nhi_${yearMonthString}'>${yearMonthString}</h3>`
                            document.querySelector('.item-group-by:last-child').after(htmlToElement('<div class="item-group-by">' + newHeading + figureThumb + '</div>'));
                        }
                        dateHeadingsList.push({
                            year: figYear,
                            month: figMonth,
                            element: document.querySelector(`#nhi_${yearMonthString}`)
                        });
                    }
                } else if(!!groupBy) {
                    if(output === DETAILED_LIST) {
                        document.getElementById('nonMfcAdditions').after(htmlToElement(linkLine))
                    } else {
                        document.querySelector('#nonMfcAdditions h3').after(htmlToElement(figureThumb));
                    }
                } else {
                    if(output === DETAILED_LIST) {
                        document.querySelector('.results').append(htmlToElement(linkLine));
                    } else {
                        document.querySelector('.result .item-icons').prepend(htmlToElement(figureThumb));
                    }
                }
            });
            document.querySelectorAll('.non-mfc-item__delete').forEach(ele => {
                ele.addEventListener('click', (evt) => {
                    evt.preventDefault();
                    if(confirm('Delete this figure?')) {
                        additionalFigures.splice(evt.target.getAttribute('data-index'), 1);
                        additionalFigures.sort((a, b) => (a.date < b.date) ? 1 : -1);
                        GM_setValue("additionalFigures", JSON.stringify(additionalFigures));
                        drawAdditionalFigures();
                        resetNonMfcItemForm();
                    }
                });
            });
            document.querySelectorAll('.non-mfc-item__edit').forEach(ele => {
                ele.addEventListener('click', (evt) => {
                    evt.preventDefault();
                    const itemIndex = evt.target.getAttribute('data-index');
                    const figToEdit = additionalFigures[itemIndex];
                    document.getElementById('non-mfc-item__form-title').innerText = `Editing ${figToEdit.name}`;
                    document.getElementById('addNonMfcItem').innerText = 'Edit';
                    document.getElementById('nonMfcItemEditId').value = itemIndex;
                    document.getElementById('nonMfcItemName').value = figToEdit.name;
                    document.getElementById('nonMfcItemImage').value = figToEdit.image;
                    document.getElementById('nonMfcItemLink').value = figToEdit.link;
                    document.getElementById('nonMfcItemReleaseDate').value = figToEdit.date;
                    document.getElementById('nonMfcItemHasShipped').checked = figToEdit.hasShipped;
                    document.getElementById('nonMfcItemIsStored').checked = figToEdit.isStored;
                    document.getElementById('nonMfcItemHasPaid').checked = figToEdit.hasPaid;
                    window.scrollTo(
                        document.getElementById('non-mfc-item__section').offsetLeft,
                        document.getElementById('non-mfc-item__section').offsetTop - 100
                    );
                });
            });
        }
    }

    // Initialise non-MFC
    BASE_COUNT = parseInt(document.querySelector(ORDERED_COUNT_SELECTOR).innerText);
    if(isUsersPreorderPage()) {
        const addSection = `<section id='non-mfc-item__section'>
<h2 id='non-mfc-item__form-title'>Add non-MFC figure</h2>
<div class='form'>
<input type='hidden' id='nonMfcItemEditId' value=''/>
<div class='bigchar form-field'>
<div class='form-label'>Figure name</div>
<div class='form-input'><input type='text' id='nonMfcItemName'/></div>
</div>
<div class='bigchar form-field'>
<div class='form-label'>Image URL *</div>
<div class='form-input'><input type='text' id='nonMfcItemImage'/></div>
</div>
<div class='bigchar form-field'>
<div class='form-label'>Item link *</div>
<div class='form-input'><input type='text' id='nonMfcItemLink'/></div>
</div>
<div class='bigchar form-field'>
<div class='form-label'>Release date (YYYY-MM) *</div>
<div class='form-input'><input type='text' id='nonMfcItemReleaseDate'/></div>
</div>
<div class="checkbox form-field">
<div class="form-input">
<input id="nonMfcItemHasPaid" type="checkbox">&nbsp;<label for="nonMfcItemHasPaid">Paid?</label>
</div>
</div>
<div class="checkbox form-field">
<div class="form-input">
<input id="nonMfcItemIsStored" type="checkbox">&nbsp;<label for="nonMfcItemIsStored">Stored?</label>
</div>
</div>
<div class="checkbox form-field">
<div class="form-input">
<input id="nonMfcItemHasShipped" type="checkbox">&nbsp;<label for="nonMfcItemHasShipped">Shipped?</label>
</div>
</div>
<div class='form-field'>
<div class='form-input'>
<button id='addNonMfcItem'>Add</button>
<button id='cancelNonMfcItem'>Cancel</button>
</div>
</div>
</div>
</section>
<section>
<h2>Added non-MFC figures</h2>
<div class='form'>
<div id='nonMfcFigureList' class='item-icons'>
</div>
</div>
</section>`;
        const sidebar = document.querySelectorAll('#side section');
        const lastSidebarSection = sidebar[sidebar.length - 1]
        lastSidebarSection.after(htmlToElement(addSection));
        drawAdditionalFigures();
        document.getElementById('addNonMfcItem').addEventListener('click', (evt) => {
            evt.preventDefault();
            const name = document.getElementById('nonMfcItemName').value || 'Non-MFC figure';
            const image = document.getElementById('nonMfcItemImage').value;
            const link = document.getElementById('nonMfcItemLink').value;
            const date = document.getElementById('nonMfcItemReleaseDate').value;
            const editId = document.getElementById('nonMfcItemEditId').value;
            const hasShipped = document.getElementById('nonMfcItemHasShipped').checked;
            const isStored = document.getElementById('nonMfcItemIsStored').checked;
            const hasPaid = document.getElementById('nonMfcItemHasPaid').checked;
            if(image && link && date && name) {
                if(date.match(/^\d{4}-0[1-9]|1[0-2]$/)) {
                    if(editId) {
                        additionalFigures[editId] = {
                            name,
                            image,
                            link,
                            date,
                            hasPaid,
                            isStored,
                            hasShipped
                        }
                    } else {
                        additionalFigures.push({
                            name,
                            image,
                            link,
                            date,
                            hasPaid,
                            isStored,
                            hasShipped
                        });
                    }
                    additionalFigures.sort((a, b) => (a.date < b.date) ? 1 : -1);
                    GM_setValue('additionalFigures', JSON.stringify(additionalFigures));
                    drawAdditionalFigures();
                    resetNonMfcItemForm();
                } else {
                    alert('Please enter a valid date in YYYY-MM format');
                }
            } else {
                alert('Please fill in all mandatory fields');
            }
        });
        const cancelButton = document.getElementById('cancelNonMfcItem');
        cancelButton.addEventListener('click', (evt) => {
            evt.preventDefault();
            if(confirm('Are you sure you want to cancel?')) {
                resetNonMfcItemForm();
            }
        });
    }

})();