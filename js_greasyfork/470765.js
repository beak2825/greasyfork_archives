// ==UserScript==
// @name        Libgen + Annas-Archive on Amazon
// @namespace   libgen-amazon
// @match       *://*.amazon.co.uk/*
// @grant       none
// @version     1.0
// @author      SirGryphin
// @license     MIT 
// @description Modded version of this code: https://greasyfork.org/en/scripts/406924-amazon-com-libgen-integration
// Changes:
// ~ Renamed titles
// ~ Changed Regex to remove junk text from titles.
// ~ Added annas-archive
// ~ Code to check for product pages
// @downloadURL https://update.greasyfork.org/scripts/470765/Libgen%20%2B%20Annas-Archive%20on%20Amazon.user.js
// @updateURL https://update.greasyfork.org/scripts/470765/Libgen%20%2B%20Annas-Archive%20on%20Amazon.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var BASEURL = "http://libgen.rs/";
    var AURL = "https://annas-archive.org/"

    function getAuthor() {
        var author = document.querySelector('span.author span a.contributorNameID')
            || document.querySelector('span.author a.a-link-normal')
            || document.getElementById('bylineContributor');
        return author.innerText.trim();
    }

    function getTitleElem() {
        return document.getElementById('productTitle')
            || document.getElementById('title')
            || document.getElementById('ebooksTitle');
    }

    function getTitle() {
        var title = getTitleElem();
        return title.innerText.match(new RegExp("([^:(\[)]+)"))[0].trim();
    }

    function addLinkElem(id, elem) {
        document.getElementById(id).appendChild(elem);
    }

    function createLibgenDiv() {
        // outer div
        var outerDiv = document.createElement('div');
        outerDiv.className='a-size-base';

        if (document.getElementById('dp') && document.getElementById('dp').className.trim() == 'ebooks_mobile') {
            outerDiv.style.margin = '20px';
            document.getElementById('dp').insertBefore(outerDiv, document.getElementsByClassName('a-container')[0]);
        } else {
            outerDiv.style.margin="5px";
            var title = getTitleElem();
            title.parentNode.appendChild(outerDiv);
        }
        outerDiv.style.padding="5px";
        outerDiv.style.border = "2px solid rgb(128, 0, 0)";
        outerDiv.style.float = "right";

        // libgen div
        var libgenDiv = document.createElement('div');
        libgenDiv.id = 'libgen';
        var b = document.createElement('b'); b.innerText = 'LibGen (Non-Fiction): '
        b.style.float = "left";
        libgenDiv.appendChild(b);
        outerDiv.appendChild(libgenDiv);

        // Annas Archive
        var archiveDiv = document.createElement('div');
        archiveDiv.style.marginTop="2em";
        archiveDiv.id = 'archive';
        var b3 = document.createElement('b'); b3.innerText = 'Anna’s Archive: '
        b3.style.float = "left";
        archiveDiv.appendChild(b3);
        outerDiv.appendChild(archiveDiv);

        // fiction div
        var fictionDiv = document.createElement('div');
        fictionDiv.style.marginTop="4em";
        fictionDiv.id = 'fiction';
        var b2 = document.createElement('b'); b2.innerText = 'LibGen (Fiction): '
        b2.style.float = "left";
        fictionDiv.appendChild(b2);
        outerDiv.appendChild(fictionDiv);
    }

    function createLink(href, text) {
        var container = document.createElement('div');
        container.style.float = "left";
        container.style.paddingLeft = "10px";
        var innerContainer = document.createElement('div');
        innerContainer.style.border = "1px solid rgb(127, 127, 127)";
        innerContainer.style.paddingLeft = "5px";
        innerContainer.style.paddingRight = "5px";
        var a = document.createElement('a');
        a.href = href;
        a.innerText = text;
        innerContainer.appendChild(a);
        container.appendChild(innerContainer);
        return container;
    }

    function addIsbnSearchLink(isbnType) {
        Array.from(document.querySelectorAll('span.a-text-bold'))
            .filter(elem => elem.innerText.indexOf(isbnType) != -1)
            .map(isbnTextElement => {
                var isbn = isbnTextElement.nextSibling.nextSibling.innerText.trim();
                var url = BASEURL + "search.php?req=" + isbn+ "&lg_topic=libgen&open=0&view=simple&res=25&phrase=1&column=identifier";
                addLinkElem('libgen', createLink(url, isbnType.toLowerCase()));
            });

        // ugly copy&paste for mobile support
        Array.from(document.getElementsByTagName('th'))
            .filter(elem => elem.innerText.indexOf(isbnType) != -1)
            .map(isbnTextElement => {
                var isbn = isbnTextElement.nextElementSibling.textContent.trim();
                var url = BASEURL + "search.php?req=" + isbn+ "&lg_topic=libgen&open=0&view=simple&res=25&phrase=1&column=identifier";
                addLinkElem('libgen', createLink(url, isbnType.toLowerCase()));
            });

        // Annas Archive
        Array.from(document.querySelectorAll('span.a-text-bold'))
            .filter(elem => elem.innerText.indexOf(isbnType) != -1)
            .map(isbnTextElement => {
                var isbn = isbnTextElement.nextSibling.nextSibling.innerText.trim();
                var url = AURL + "search?q=" + isbn+ "?";
                addLinkElem('archive', createLink(url, isbnType.toLowerCase()));
            });
    }

    function addLibgenSearchLink(searchString, linkText) {
        var url = BASEURL + "search.php?req=" + encodeURIComponent(searchString)
        + "&open=0&res=25&view=simple&phrase=1&column=def";
        addLinkElem('libgen', createLink(url, linkText))
    }

    function addFictionSearchLink(searchString, linkText) {
        var url = BASEURL + "fiction/?q=" + encodeURIComponent(searchString);
        addLinkElem('fiction', createLink(url, linkText))
    }

    // Annas Archive
    function addArchiveSearchLink(searchString, linkText) {
        var url = AURL + "search?q=" + encodeURIComponent(searchString);
        addLinkElem('archive', createLink(url, linkText))
    }

    // Check if div with id 'ask-btf_feature_div' exists
    var askBtfFeatureDiv = document.getElementById('ask-btf_feature_div');

    if (!askBtfFeatureDiv) {
        createLibgenDiv();

        var author = getAuthor();
        var title = getTitle();

        if (author && title) {
            var searchString = author + ' ' + title;
            addLibgenSearchLink(searchString, "Author + Title");
            addFictionSearchLink(searchString, "Author + Title");
            // Annas Archive
            addArchiveSearchLink(searchString, "Author + Title");
        }

        if (title) {
            addLibgenSearchLink(title, "Title");
            addFictionSearchLink(title, "Title");
            // Annas Archive
            addArchiveSearchLink(title, "Title");
        }

        if (author) {
            addLibgenSearchLink(author, "Author");
            addFictionSearchLink(author, "Author");
            // Annas Archive
            addArchiveSearchLink(author, "Author");
        }

        addIsbnSearchLink('ISBN-10');
        addIsbnSearchLink('ISBN-13');
    }
})();