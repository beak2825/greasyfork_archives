// ==UserScript==
// @name kooba-helper
// @namespace    kooba-helper@goobergoblin
// @description For a better kooba<=>abook experience. This adds search links to Abook forums code boxes.
// @author Shrek, rhymesagainsthumanity, goobergoblin, pushr (original creator)
// @version 2025.06.06.8
// @license MIT
// @supportURL https://abook.link/book/index.php?topic=54768
// @include *://abook.link/*
// @match *://abook.link/*
// @run-at document-end
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/539465/kooba-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/539465/kooba-helper.meta.js
// ==/UserScript==


function sanatize_common(code) {
    code = code.replace(/(?:abook|kooba)\.*(?:to|link|ws)*\s*(?:-|\||~)*\s*/gi, '');
    code = code.replace(/['"]+/g, '');
    code = code.replace(/\\&+/g, ' ');
    return code.trim();
}

const indexers = [
    {
        name: 'NZBIndex',
        url: 'https://DoNotRefer.Me/#https://nzbindex.com/search?max=25&minage=&maxage=&hidespam=1&hidepassword=0&sort=agedesc&minsize=&maxsize=&complete=0&hidecross=0&hasNFO=0&poster=&q={query}',
        codeFn: function(code) {
            return sanatize_common(code);
        }
    },
    {
        name: 'BinSearch',
        url: 'https://DoNotRefer.Me/#https://www.binsearch.info/?max=1000&&adv_age=&adv_sort=date&server=2&&q={query}',
        codeFn: function(code) {
            return sanatize_common(code);
        }
    },
    {
        name: 'BinSearch-Abook',
        url: 'https://DoNotRefer.Me/#https://www.binsearch.info/?max=100&adv_g=alt.binaries.mp3.abooks&adv_age=&adv_sort=date&q={query}',
        codeFn: function(code) {
            return sanatize_common(code);
        }
    },
    {
        name: 'NZBKing',
        url: 'https://DoNotRefer.Me/#http://nzbking.com/search/?q=%22{query}%22',
        codeFn: function(code) {
            return sanatize_common(code);
        }
    }
];

/**
 * Extracts the code text from a header element.
 * It handles cases where the code might be placed after a <br> tag or directly after the header.
 * @param {Element} header - The header element preceding the code.
 * @returns {string} The extracted code text, trimmed.
 */
function extractCodeFromHeader(header) {
    if (header.nextSibling && header.nextSibling.nodeName.toUpperCase() === 'BR') {
        return header.nextSibling.nextSibling?.textContent?.trim() || '';
    } else {
        return header.nextSibling?.textContent?.trim() || '';
    }
}

/**
 * Inserts a block of UI elements related to Kooba helper functionality.
 * This includes search links for the extracted code, a copy title link, and a NZBDonkey highlight text block.
 * @param {Element} header - The header element to insert after.
 * @param {string} title - The title of the page or topic.
 * @param {string} code - The extracted code string.
 * @param {string} password - The associated password, if any.
 */
function insertKoobaBlock(header, title, code, password) {
    const copyLink = document.createElement('a');
    copyLink.id = 'kooba-title-copy2';
    copyLink.classList.add('kooba-title-copy2');
    copyLink.dataset.cipboard = title;
    copyLink.title = `Copy "${title}" to clipboard`;
    copyLink.innerHTML = ` [Copy Title]`;
    copyLink.addEventListener('click', function(e) {
        kooba_copy_clipboard_data(e.target);
    });

    const searchContent = `
        <div class="kooba-search-links">
            <span>Search:</span>
            <ul>${buildLinks(code)}</ul>
        </div>
    `;
    header.classList.add('kooba_crunched');
    header.insertAdjacentHTML('beforeend', searchContent);
    header.insertAdjacentElement('beforeend', copyLink);

    const donkeyContent = `
        <div class="kooba-nzbdonkey">
            <div class="kooba-nzbdonkey-title">NZBDonkey Highlight Text <a class="kooba-nzbdonkey-help" target="_blank" href="https://tensai75.github.io/NZBDonkey/" title="This extension allows you to right click the text below and click 'Get NZB File' to automatically find and process the NZB.\n\nAnother extension is required.">?</a></div>
            <div class="kooba-nzbdonkey-text" onclick="window.getSelection().selectAllChildren(this);" oncontextmenu="window.getSelection().selectAllChildren(this);">
                <div>${title}</div>
                <div>Header: ${sanatize_common(code)}</div>
                <div>Password: ${password}</div>
            </div>
        </div>
    `;
    header.parentElement.insertAdjacentHTML('beforeend', donkeyContent);
}

/**
 * Determines if a header node likely represents a password label.
 * It checks up to 3 previous siblings for the presence of the word "password".
 * @param {Element} headerNode - The header element to check.
 * @returns {boolean} True if a password label is likely, false otherwise.
 */
function isLikelyPasswordLabel(headerNode) {
    let labelNode = headerNode.previousSibling;
    let count = 0;
    while (labelNode && count < 3) {
        if (labelNode.textContent?.toLowerCase().includes("password")) {
            return true;
        }
        labelNode = labelNode.previousSibling;
        count++;
    }
    return false;
}

function buildLinks(code){
    console.log("Build: ", code);
    let list = '';
    indexers.forEach(function (index) {
        console.log("IC: ", index.codeFn(code));
        const link = index.url.replace(/{query}/g, encodeURIComponent(index.codeFn(code)));

        list += `
      <li>
        <a rel="noreferrer" rel="noopener" target="_blank" href="${link}">
          ${index.name}
        </a>
      </li>
    `;
    });

    return list;
}

function checkHeader(header){
    // Check if any of the previous 5 siblings contain sting of "password"
    let heading = header.previousSibling;
    let i = 0;
    while (heading && i < 5) {
        i++;
        if (heading.textContent.toLowerCase().includes('password')) return true;
        heading = heading.previousSibling;
    }

    return false;
}

function checkCode(code){
    // Check if code itself contains string of "password"
    return code.toLowerCase().includes('password');
}


function process_kooba_search() {
    console.log('Process Kooba');
    const headers = document.querySelectorAll('.codeheader');
    if (!headers.length) {
        console.log("No .codeheader elements found.");
        return;
    }

    // Variables to store the main code block, associated password, and the header element for the main code
    let mainCode = '';
    let password = '';
    let mainHeader = null;

    // First pass: iterate over all headers to find the main code block and password
    headers.forEach(function (header) {
        if (header.classList.contains('kooba_crunched')) return;

        const cleanedCode = extractCodeFromHeader(header);
        console.log('Detected code block:', cleanedCode);

        if (isLikelyPasswordLabel(header)) {
            // This header likely labels a password, so store the password
            password = cleanedCode;
        } else if (!mainCode) {
            // Assign the first non-password code block as the main code
            mainCode = cleanedCode;
            mainHeader = header;
        }

        header.classList.add('kooba_crunched');
    });

    if (!mainHeader) {
        // Fallback handling for new style or unexpected page layouts where no main code header was found above
        // This block attempts to find code and passwords differently, ensuring compatibility with various page structures
        headers.forEach(function (header) {
            if (header.classList.contains('kooba_crunched')) return;

            const cleanedCode = extractCodeFromHeader(header);

            console.log('New Style');
            console.log('Code: ', cleanedCode);

            if (checkHeader(header) || checkCode(cleanedCode)) {
                console.log('Skipped password: ' + cleanedCode);
                header.classList.add('kooba_crunched');
                return;
            }

            console.log(header);

            let codes = header.parentElement.querySelectorAll('.bbc_code');
            if (codes.length >= 2) {
                for (let i = 1; i < codes.length; i++) {
                    let codeElement = codes[i];
                    console.log(codeElement);
                    let tmpCode = codeElement.textContent;

                    if (checkHeader(codeElement) || checkCode(tmpCode)) {
                        password = tmpCode;
                        console.log('Password: ', password);
                    }
                }
            }

            const page_author = document.querySelector('#author');
            const page_title = page_author.nextSibling.textContent.match(/Topic:(.*?)(?:\(Read)/i)[1].replace(/\[spot\]/gi,'').trim();

            insertKoobaBlock(header, page_title, cleanedCode, password);
        });
        return;
    } else {
        const page_author = document.querySelector('#author');
        const page_title = page_author.nextSibling.textContent.match(/Topic:(.*?)(?:\(Read)/i)[1].replace(/\[spot\]/gi,'').trim();

        insertKoobaBlock(mainHeader, page_title, mainCode, password);
    }
}

function inject_kooba_style() {
    document.querySelector('head').innerHTML += `
<style>

.kooba-search-links,
.kooba-search-links span,
.kooba-search-links ul,
.kooba-search-links li {
  display: inline-block;
}

.kooba-search-links span {
  margin-left: .5em;
}

.kooba-search-links ul {
  list-style: none;
  margin: 0;
  padding-left: 0;
}

.kooba-search-links li {
  margin: 0;
  padding: 0;
}

.kooba-search-links li:not(:last-child):after {
  color: #ccc;
  content:'|';
}

.kooba-search-links a {
  margin: 0;
  padding: 0 .5em;
}

.kooba-title-copy {
    color: #57aad2;
}
.kooba-title-copy:hover {
    text-decoration: underline;
}

.kooba-title-copy2 {
    margin-left: 30px;
    color: #9383e0;
    font-weight: normal;
}
.kooba-title-copy2:hover {
    text-decoration: underline;
}

.kooba-nzbdonkey {
    margin-top: 20px;
    border: 1px dotted yellow;
    padding: 10px;
}
.kooba-nzbdonkey-title {
    font-weight: bold;
    color: red;
}
a.kooba-nzbdonkey-help {
    text-decoration: none;
    color: #2196f3;
    border-bottom: 1px dotted #2196f3;
}
.kooba-nzbdonkey-text {
    font-size: 10px;
    font-weight: normal;
    font-family: monospace;
    color: #bb96e0;
    padding-left: 30px;
}
</style>

`;
}


window['kooba_copy_clipboard_str'] = str => {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};


window['kooba_copy_clipboard_data'] = function kooba_copy_clipboard_data(obj) {
    kooba_copy_clipboard_str(obj.dataset.cipboard);

    var iDiv3 = document.createElement('div');
    iDiv3.className = 'copied_to_clipboard';
    iDiv3.style.border = '1px solid red';
    iDiv3.style.backgroundColor = 'red';
    iDiv3.style.color = 'yellow';
    iDiv3.style.textAlign = 'center';
    iDiv3.style.display = 'inline-block';
    iDiv3.style.position = 'absolute';
    iDiv3.style.marginLeft = '10px';
    // iDiv3.style.width = obj.offsetWidth + 'px';
    iDiv3.innerHTML = 'text copied to clipboard';
    kooba_insert_after(iDiv3, obj);
    setTimeout(function() {
        var elements = document.getElementsByClassName('copied_to_clipboard');
        while(elements.length > 0){ elements[0].parentNode.removeChild(elements[0]); }
    }, 2000);
}

window['kooba_insert_after'] = function kooba_insert_after(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

window['inject_kooba_title_copy'] = function inject_kooba_title_copy() {
    if ( document.querySelector('#kooba-title-copy') === null ) {
        // var page_title = document.querySelector('title').text.match(/Book Club - (.*)/i)[1].trim();
        var page_author = document.querySelector('#author');
        var page_title = page_author.nextSibling.textContent.match(/Topic:(.*?)(?:\(Read)/i)[1].replace(/\[spot\]/gi,'').trim();

        var iObjCopyTitle = document.createElement('a');
        iObjCopyTitle.classList.add('kooba-title-copy');
        iObjCopyTitle.id = 'kooba-title-copy';
        iObjCopyTitle.dataset.cipboard = page_title;
        iObjCopyTitle.title = 'Copy "' + page_title + '" to clipboard';
        iObjCopyTitle.innerHTML = ` [Copy]`;
        iObjCopyTitle.addEventListener('click', function(e) {
            kooba_copy_clipboard_data(e.target);
        });
        kooba_insert_after(iObjCopyTitle, page_author.nextSibling);
    }
}

if ((
    document.querySelector('a[href="https://abook.link/book/index.php#c3"]')
    || document.querySelector('a[href="https://abook.link/book/index.php?board=18.0"]')
)) {
    inject_kooba_title_copy();
    inject_kooba_style();
    process_kooba_search();
    console.log('Injecting Detour of Thank Function');
    // detour the original thank you click action
    window['orig_saythanks_handleThankClick'] = saythanks.prototype.handleThankClick;
    saythanks.prototype.handleThankClick = function (oInput) {
        console.log('Thank Detected'); // output to console that we intercepted the thank
        window['orig_saythanks_handleThankClick'](oInput); // call original thank action
        setTimeout(process_kooba_search, 200); // look for search boxes
        setTimeout(process_kooba_search, 1000); // it should catch after 200 ms but
        setTimeout(process_kooba_search, 2000); // here are a few more intervals to
        setTimeout(process_kooba_search, 5000); // keep trying, because it can't hurt,
        setTimeout(process_kooba_search, 10000); //  since we track injection now
    }
}