// ==UserScript==
// @name        AO3: Tag Hider
// @namespace   https://greasyfork.org/en/users/163551-vannius
// @version     1.931
// @license     MIT
// @description Hide tags automatically when there are too many tags. Add hide/show tags button to browsing page and reading page.
// @author      Vannius
// @match       https://archiveofourown.org/*
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/434442/AO3%3A%20Tag%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/434442/AO3%3A%20Tag%20Hider.meta.js
// ==/UserScript==

(function () {
    // Config
    const MAX_TAGS_ON_BROWSING_PAGE = 15;
    // When number_of_tags > MAX_TAGS_ON_BROWSING_PAGE, hide tags on browsing page.
    // If MAX_TAGS_ON_BROWSING_PAGE = 0, hide tags always on browsing page.
    // If MAX_TAGS_ON_BROWSING_PAGE = 1000, show tags always on browsing page.

    const MAX_TAGS_ON_READING_PAGE = 20;
    // When number_of_tags > MAX_TAGS_ON_READING_PAGE, hide tags on reading page.
    // if MAX_TAGS_ON_READING_PAGE = 0, hide tags always on reading page.
    // if MAX_TAGS_ON_READING_PAGE = 1000, show tags always on reading page.
    // number_of_tags on reading page also include Rating, Archive Warning, Category and Fandom tags.

    if (/archiveofourown\.org\/(collections\/[^/]+\/)?works\/[0-9]+/.test(window.location.href)) {
        // reading page
        const dataTag = document.getElementsByClassName('work meta group')[0];

        // Make Show Data/Hide Data button
        const btn = document.createElement('a');
        btn.appendChild(document.createTextNode(''));

        // Hide or Show data

        if (dataTag.getElementsByClassName('tag').length > MAX_TAGS_ON_READING_PAGE) {
            dataTag.style.display = 'none';
            btn.textContent = 'Show Tags';
        } else {
            dataTag.style.display = 'block';
            btn.textContent = 'Hide Tags';
        }

        // Add click event
        btn.addEventListener('click', function () {
            const dataTag = this.parentElement.parentElement.parentElement.getElementsByClassName('work meta group')[0];

            if (dataTag.style.display === 'none') {
                dataTag.style.display = 'block';
                this.textContent = 'Hide Tags';
            } else {
                dataTag.style.display = 'none';
                this.textContent = 'Show Tags';
            }
        });

        // Add Show Data/Hide Data button to menu
        const liTag = document.createElement('li');
        liTag.appendChild(btn);

        const fragment = document.createDocumentFragment();
        fragment.appendChild(document.createTextNode('    '));
        fragment.appendChild(liTag);
        fragment.appendChild(document.createTextNode('\n\n'));

        const menu = document.getElementsByClassName('work navigation actions')[0];
        menu.appendChild(fragment);
    } else {
        // browsing page
        const articles = document.getElementById('main').getElementsByClassName('blurb');

        // Add style for Show Tags/Hide Tags Button.
        GM_addStyle([
            "button.taghider {",
            "  padding: 0.5px 2px;",
            "}",
            "button.taghider:hover {",
            "  color: #900;",
            "  box-shadow: inset 2px 2px 2px #bbb;",
            "}",
            "button.taghider:focus {",
            "  color: #900;",
            "  box-shadow: inset 2px 2px 2px #bbb;",
            "}",
            "button.taghider:active {",
            "  background: #ccc;",
            "  box-shadow: inset 1px 1px 3px #333;",
            "}"
        ].join(''));

        // Add Show Tags/Hide Data Tags to each article.
        for (let article of articles) {
            const ao3tag = article.getElementsByClassName('tags commas')[0];
            if (!ao3tag) {
                continue;
            }

            // Make Show Tags/Hide Data Tags
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'taghider';
            btn.appendChild(document.createTextNode(''));

            // Hide or Show tags
            if (ao3tag.children.length > MAX_TAGS_ON_BROWSING_PAGE) {
                ao3tag.style.display = 'none';
                btn.textContent = 'Show Tags';
            } else {
                ao3tag.style.display = 'block';
                btn.textContent = 'Hide Tags';
            }

            // Add click event
            btn.addEventListener('click', function () {
                const ao3tag = this.parentElement.parentElement.parentElement.getElementsByClassName('tags commas')[0];
                if (ao3tag.style.display === 'none') {
                    ao3tag.style.display = 'block';
                    this.textContent = 'Hide Tags';
                } else {
                    ao3tag.style.display = 'none';
                    this.textContent = 'Show Tags';
                }
            });

            // Add Show Data/Hide Data button to right after fandoms.
            const fandomTag = article.getElementsByClassName('header module')[0].children[1];
            const fragment = document.createDocumentFragment();
            fragment.appendChild(document.createTextNode(' '));
            fragment.appendChild(btn);
            fandomTag.insertBefore(fragment, fandomTag.lastChild);
        }
    }
})();