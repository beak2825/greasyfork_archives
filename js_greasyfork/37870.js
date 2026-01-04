// ==UserScript==
// @name         Amazon search MAM
// @namespace    https://greasyfork.org/en/users/78880
// @version      2.0
// @description  Add "Search MAM" button to Amazon
// @author       Slengpung & GardenShade
// @include      https://www.amazon.tld/*
// @include      https://smile.amazon.tld/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37870/Amazon%20search%20MAM.user.js
// @updateURL https://update.greasyfork.org/scripts/37870/Amazon%20search%20MAM.meta.js
// ==/UserScript==

const amazonSearchMam = async () => {
    // Look for the Kindle/Audio/Physical book swatch
    const bookPageCheck = async () => {
        if(document.querySelector('#tmmSwatches')){
            console.log("Looks like a book! Injecting MAM box...");
            return true;
        }else{
            throw new Error("This does not look like a book; won't inject search button!")
        }
    }
    
    // Generate the new searchbox element
    const makeSearchbox = (tar,label,search) => {
        // Create the Searchbox
        const searchbox = document.createElement('span');
        searchbox.id = 'asm_searchbox';
        searchbox.className = tar.className;
        // Create child elements
        const inner = document.createElement('span');
        const text = document.createElement('span');
        inner.className = 'a-button-inner';
        inner.style.background = 'linear-gradient(to bottom,rgb(225,222,116),#e0c21a)';
        text.className = 'a-button-text';
        text.innerHTML = `${label}`;
        // Attach elements to the document
        searchbox.appendChild(inner);
        inner.appendChild(text);
        tar.insertAdjacentElement('afterend', searchbox);
        // Add interaction
        searchbox.addEventListener('click', () => window.open(buildSearch(search)))
    }
    // Generate the search URL
    const buildSearch = (bookTitle) => {
        return `https://www.myanonamouse.net/tor/browse.php?tor[srchIn][title]=true&tor[text]=${bookTitle}`;
    }
    
    // When we know we're on a book page, fetch book details
    await bookPageCheck()
        .then(() => {
            const title = document.querySelector('#productTitle').textContent;
            const author = ''; // Not used yet
            const target = document.getElementById("submit.buy-now");
 
            makeSearchbox(target,'Search MAM',title);
        })
        .catch(e => console.warn(e));
}

// Run the script
amazonSearchMam();