// ==UserScript==
// @name         Easy ProductUpdate
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  ProductUpdate re_play
// @author       ZV
// @match        *://*/Admin/MyCurrentTask/UpdateProduct*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498472/Easy%20ProductUpdate.user.js
// @updateURL https://update.greasyfork.org/scripts/498472/Easy%20ProductUpdate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractNumbers(text) {
        const regex = /(\d+(?:[.,]\d+)?)/g;
        return text.match(regex)?.map(match => parseFloat(match.replace(',', '.'))) || [];
    }

    function resizeTextareaToFitContent(textarea) {
        const fixedWidth = 800;
        textarea.style.width = fixedWidth + 'px';
        textarea.style.height = 'auto';
        const computedHeight = Math.max(textarea.scrollHeight, textarea.clientHeight);
        textarea.style.height = computedHeight + 'px';
    }

    function adjustTextareaAttributes() {
        const oldDimensionField = document.getElementById('OldDimensionInfo');
        const newDimensionField = document.getElementById('DimensionInfo');
        const Message = document.getElementById('Message');
        if (oldDimensionField && newDimensionField && Message) {
            oldDimensionField.removeAttribute('cols');
            oldDimensionField.removeAttribute('rows');
            Message.removeAttribute('cols');
            Message.removeAttribute('rows');
            newDimensionField.removeAttribute('cols');
            newDimensionField.removeAttribute('rows');
            resizeTextareaToFitContent(oldDimensionField);
            resizeTextareaToFitContent(newDimensionField);
            resizeTextareaToFitContent(Message)
        }
    }

    function fetchCurrentDimensionsFromLinks() {
        return new Promise((resolve, reject) => {
            const links = document.querySelectorAll('a[href*="/Admin/CompareBag/EditBag/"]');
            if (links.length === 0) {
                return resolve(null);
            }

            const link = links[0];
            fetch(link.href)
                .then(response => response.ok ? response.text() : Promise.reject('Failed to load'))
                .then(html => {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = html;

                    const depthElement = tempDiv.querySelector('input#CurrentDepth');
                    const widthElement = tempDiv.querySelector('input#CurrentWidth');
                    const heightElement = tempDiv.querySelector('input#CurrentHeight');
                    const fourthDimensionElement = tempDiv.querySelector('input#CurrentCurveLength');

                    const depthInchesElement = tempDiv.querySelector('input#CurrentDepthInches');
                    const widthInchesElement = tempDiv.querySelector('input#CurrentWidthInches');
                    const heightInchesElement = tempDiv.querySelector('input#CurrentHeightInches');
                    const fourthDimensionInchesElement = tempDiv.querySelector('input#CurrentCurveLengthInches');

                    const tagElement = tempDiv.querySelector('#product-tag-list');
                    let tag = tagElement ? tagElement.textContent.trim().toLowerCase() : '';
                    if (tag) {
                        tag = tag.charAt(0).toUpperCase() + tag.slice(1);
                    }

                    const categoryIdElement = tempDiv.querySelector('#CategoryId');
                    let category = categoryIdElement ? categoryIdElement.options[categoryIdElement.selectedIndex].text : '';

                    const dimensions = [];
                    const dimensionsInches = [];

                    if (heightElement) dimensions.push(parseFloat(heightElement.value.trim()));
                    if (widthElement) dimensions.push(parseFloat(widthElement.value.trim()));
                    if (depthElement) dimensions.push(parseFloat(depthElement.value.trim()));
                    if (fourthDimensionElement) dimensions.push(parseFloat(fourthDimensionElement.value.trim()));

                    if (heightInchesElement) dimensionsInches.push(parseFloat(heightInchesElement.value.trim()));
                    if (widthInchesElement) dimensionsInches.push(parseFloat(widthInchesElement.value.trim()));
                    if (depthInchesElement) dimensionsInches.push(parseFloat(depthInchesElement.value.trim()));
                    if (fourthDimensionInchesElement) dimensionsInches.push(parseFloat(fourthDimensionInchesElement.value.trim()));

                    resolve({
                        dimensions: dimensions.length ? dimensions : null,
                        dimensionsInches: dimensionsInches.length ? dimensionsInches : null,
                        tag: tag,
                        category: category
                    });
                })
                .catch(err => reject(err));
        });
    }

    function compareDimensions(dim1, dim2) {
        if (!dim1 || !dim2) return false;
        if (dim1.length !== dim2.length) return false;

        const sortedDim1 = dim1.slice().sort((a, b) => a - b);
        const sortedDim2 = dim2.slice().sort((a, b) => a - b);

        return sortedDim1.every((val, index) => val === sortedDim2[index]);
    }

    function highlightDimensions() {
        const newDimensionField = document.getElementById('DimensionInfo');

        if (newDimensionField) {
            const newDimensionsData = extractNumbersWithUnits(newDimensionField.value);
            let newDimensions = newDimensionsData.map(item => item.value);
            let newDimensionsUnits = newDimensionsData.map(item => item.unit);

            resizeTextareaToFitContent(newDimensionField);

            fetchCurrentDimensionsFromLinks().then(data => {
                const currentDimensions = data.dimensions;
                const currentDimensionsInches = data.dimensionsInches;

                let newResult = '';
                let currentResult = '';
                let currentInchesResult = '';

                const currentSet = new Set(currentDimensions);
                const uniqueNewDimensions = new Set();

                let isFirstDim = true;

                newDimensions.forEach((newDim, index) => {
                    const unit = newDimensionsUnits[index] || '';

                    if (!uniqueNewDimensions.has(newDim)) {
                        if (!isFirstDim) {
                            newResult += ' x ';
                        }
                        if (currentSet.has(newDim)) {
                            newResult += `<span style="color: green;">${newDim}${unit}</span>`;
                        } else {
                            let isBlue = false;
                            if (currentDimensions) {
                                for (let j = 0; j < currentDimensions.length; j++) {
                                    if (Math.abs(newDim - (currentDimensions[j] * 10)) < 0.1 || Math.abs(newDim * 10 - currentDimensions[j]) < 0.1) {
                                        newResult += `<span style="color: blue;">${newDim}${unit}</span>`;
                                        isBlue = true;
                                        break;
                                    }
                                }
                            }
                            if (!isBlue) {
                                newResult += `<span style="color: red;">${newDim}${unit}</span>`;
                            }
                        }
                        uniqueNewDimensions.add(newDim);
                        isFirstDim = false;
                    }
                });

                if (currentDimensions) {
                    currentDimensions.forEach((currentDim, index) => {
                        if (index > 0) currentResult += ' x ';
                        currentResult += `<span style="color: green;">${currentDim}</span>`;
                    });
                }

                if (currentDimensionsInches) {
                    currentDimensionsInches.forEach((currentDimInch, index) => {
                        if (index > 0) currentInchesResult += ' x ';
                        currentInchesResult += `<span style="color: purple;">${currentDimInch}</span>`;
                    });
                }

                const newParagraph = document.createElement('p');
                newParagraph.innerHTML = `СТАЛО: ${newResult}`;
                newParagraph.style.margin = '0';
                newParagraph.style.padding = '5px';

                const currentParagraph = document.createElement('p');
                currentParagraph.innerHTML = `СЕЙЧАС: ${currentResult}`;
                currentParagraph.style.margin = '0';
                currentParagraph.style.padding = '5px';

                const inchesParagraph = document.createElement('p');
                inchesParagraph.innerHTML = `NOWinch: ${currentInchesResult}`;
                inchesParagraph.style.margin = '0';
                inchesParagraph.style.padding = '5px';

                const tagCategoryParagraph = document.createElement('p');
                tagCategoryParagraph.innerHTML = `Тэг: <em style="color: blue;">${data.tag}</em>, Категория: <em style="color: blue;">${data.category}</em>`;
                tagCategoryParagraph.style.margin = '0';
                tagCategoryParagraph.style.padding = '5px';

                const insertAfterElement = newDimensionField.nextSibling;
                if (insertAfterElement) {
                    insertAfterElement.parentNode.insertBefore(tagCategoryParagraph, insertAfterElement.nextSibling);
                    insertAfterElement.parentNode.insertBefore(inchesParagraph, insertAfterElement.nextSibling);
                    insertAfterElement.parentNode.insertBefore(currentParagraph, insertAfterElement.nextSibling);
                    insertAfterElement.parentNode.insertBefore(newParagraph, insertAfterElement.nextSibling);
                    insertAfterElement.parentNode.insertBefore(document.createElement('br'), insertAfterElement.nextSibling);
                } else {
                    newDimensionField.parentNode.appendChild(newParagraph);
                    newDimensionField.parentNode.appendChild(currentParagraph);
                    newDimensionField.parentNode.appendChild(inchesParagraph);
                    newDimensionField.parentNode.appendChild(tagCategoryParagraph);
                    newDimensionField.parentNode.appendChild(document.createElement('br'));
                }
            });
        }
    }

    function extractNumbersWithUnits(text) {
        const regex = /(\d+(\.\d+)?)(\s?(cm|мм|mm|см|in|дюйм))?/g;
        let match;
        const results = [];

        while ((match = regex.exec(text)) !== null) {
            const value = parseFloat(match[1]);
            const unit = match[3] ? match[3].trim() : '';
            results.push({ value, unit });
        }

        return results;
    }

    function createOpenAllLinksButton() {
    let openAllLinksButton = document.createElement('input');
    openAllLinksButton.type = 'button';
    openAllLinksButton.value = 'Open all links';
    let referenceButton = document.getElementById('productUpdateAction');
    if (referenceButton) {
        openAllLinksButton.className = referenceButton.className;
    }
    openAllLinksButton.style.marginLeft = '160px';
    openAllLinksButton.style.marginBottom = '10px';
    let h2Element = Array.from(document.getElementsByTagName('h2')).find(el => el.textContent === "Update Product Dimension");
    if (h2Element) {
        h2Element.parentNode.insertBefore(openAllLinksButton, h2Element.nextSibling);
    }

    openAllLinksButton.addEventListener('click', function() {
        let controlDivs = document.querySelectorAll('div.controls');
        controlDivs.forEach(div => {
            let links = div.querySelectorAll('a[href]');
            links.forEach(link => {
                let url = link.href;
                if (url.startsWith('/')) {
                    url = window.location.origin + url; // Добавляем домен к относительным ссылкам
                }
                window.open(url, '_blank');
            });
        });
    });
}

    window.addEventListener('load', function() {
        adjustTextareaAttributes();
        highlightDimensions();
        createOpenAllLinksButton();
    });

    document.addEventListener('input', function(event) {
        const target = event.target;
        if (target && target.id === 'DimensionInfo') {
            resizeTextareaToFitContent(target);
            highlightDimensions();
        }
    });
})();
