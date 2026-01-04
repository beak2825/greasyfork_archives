// ==UserScript==
// @name         MyAnonamouse Requests Page ➜ Audible + Amazon Kindle Search Links.
// @namespace    https://www.myanonamouse.net/u/253587
// @version      1.1
// @description  Adds Audible and Amazon search links to the requests page on myanonamouse. The links added are Audible for Audiobooks and Amazon for E-Books.
// @match        https://www.myanonamouse.net/tor/requests*
// @grant        none
// @author       Gorgonian
// @downloadURL https://update.greasyfork.org/scripts/538009/MyAnonamouse%20Requests%20Page%20%E2%9E%9C%20Audible%20%2B%20Amazon%20Kindle%20Search%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/538009/MyAnonamouse%20Requests%20Page%20%E2%9E%9C%20Audible%20%2B%20Amazon%20Kindle%20Search%20Links.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const audiobookCategories = new Set([
        39, 49, 50, 83, 51, 97, 40, 41, 106, 42, 52, 98, 54, 55, 43, 99, 84, 44,
        56, 45, 57, 85, 87, 119, 88, 58, 59, 46, 47, 53, 89, 100, 108, 48, 111,
    ]);

    const bookCategories = new Set([
        60, 71, 72, 90, 61, 73, 101, 62, 63, 107, 64, 74, 102, 76, 77, 65, 103, 115,
        91, 66, 78, 67, 79, 80, 92, 118, 94, 120, 95, 81, 82, 68, 69, 75, 96, 104, 109, 70, 112,
    ]);

    const base64AudibleIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAADAFBMVEX6vGr96M396M76v2/3kw7969L3kxD969P/+/b8z5X3lhP/+/f3lhT/+/j3lhX3lhb3lhf//v33mRr//v73mRv3mRz3mR33nCL3nCP82Kn3nyj3nyn3nyv8267826/827H+69L+69P+69T5slP5slT3pTb5tVv7xX75uGD5uGH2jAD5uGL7yIP7yIX+9Ob+9Of2jwX2jwb2jwf4nyn2kgz2kg32kg74ojD7zpL7zpP4pTj70Zr4qD34qD795ML6uGP95MT958n958r6u2n/9+z/9+3/9+73kgz3kg396tD96tH4sVH/+vP/+vX3lRL3lRP97db//fr3mBj3mBn6xHv3mBr3mBv98N/81KD3mx781KH3mx/3myD6x4L3myH3myL3nif3nij3nin5rkr82qz82q73oS3+6tD5sVD+6tL5sVH5tFj+8Nz5t2D+8+P5umX4nib+9ur2kQr2kQv4oS74oS/2lBH93bP70JX4pDT70Jb4pDX94Lr4pzv70576t176t1/948H4qkL95sb6umb95sn6vWv6vWz3kQv96c396c7/+fD/+fH/+fL3lBD3lBH97NP3lBL97NT//Pf//Pj3lxb//Pn3lxf6w3n3lxj6w3r3lxn6w3v3lxr805z8053///78057////3mh33mh73mh/3miD3nST3nSX3nSb5rUf5rUj82ar5rUn82av5sFD837f5s1b+79z7xn/+8uH7xoD+8uL2jQP+9en2kAj2kw72kw/2kxD4ozL2lhX937n94r34qT/6uWL95cT95cX95cb4rEcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAzEkAwAAACNUlEQVR42mMUZcAPGAefAkYg/o9TwQTGfDs3hj0HJjAUYFPgtrtyR9Axpv87fpm5t7ntQlfQx7jkuEj1Gqf2htlCJ6UNLcX+F6Eo6P98/+z9EqWLW1neFjMwFL7TUGMJLERS0L9KzUr8cm/Dhp2dvLJfchoL+6u706YXwBX0ZxTezur96T+3/QULwyc5Fg+dYoY68evTCiEK+oua7whOkdLY4C7DYX/v5+GYK5/+CSoyJEdbcjMUghRUHWN5eKf+5ArX7S4H97Qxh/1jerHZe1oLQ63xoeo2BsaZTTymUgv+92cVzhJ4Z+OyW0BpbyJD2srrNpPPT1kUvtmYcebx1e03gqYfXPmF98/sT4eD/sft2vJk+vqYX4z8m9XYLhgyhrFxW69nP/IiaiN7X+E7Ox4V/wymfy+37F3/yt6G5/h6W0Yx++AJF2admeR/YPqGq3wq92pfMdy5UOGZLPrcJFO3cNVhRlFG2/QP0ncZZPediutjtGN85//p0K9Lvv/VGB5q8D+s/g/0Rd+OL17/18S9WvByWYw7w4enFseVb8SJLw5l3MLjUQQNqEIFlzfWTC9Uee4dYt6kYKEk8a8udvf9/kJ4UDNOyGy64/phvV/NawbRtq88p/aqHpxe8B85NvsZxN9ekOYX6XzT+S47V1/oJUMhRnr48bj8hmw+w8QFiuEzOXdiSVFAx/r9/8BwgvFX2L8i7Gmyv1Ceg+HHw/5CnIkW6FgGqONwJft+hkJUgcGQ9QD2QOYIbMoRzgAAAABJRU5ErkJggg=='; // your Audible icon base64 here
    const base64AmazonIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAADJklEQVR42qVVbUiTURR+Rigs51ZZaBpKoxDmsnDkF5FOIwsLk5KQCPqT/jALFSKzZtRIDNIK+utUWJCROelXaA6CZjll4BwOi2zmV2JZi344Yp17na/vpkPnDhzecz/e85zznHPvlYDE6/VuoU816UXSAwhPbKTPSJskEsk/CTmX0uAN6ZEwHQfKW9KTDKCODH2wXW63G1arFSMOhzCXolJBq9VuBOQ6AxghQ7XWapfJhMrKSszMzKxaU6vVeNHRgaSkJERERASliwEskKEIXBkcHERmVlbQ0LykxcXFaG9thVQqDbbtR1CAsvJyGAwGbsfFxaG9rQ1yuRw3amthNptXPMzPIzo6OhjAr6AA9xsaYLPZ8N5i4VHm5eUJtJ0rKYHEt6+f1jUaTegAYpmamsL09DQs/f2YcLnQ1NwsrIUF0NfXh+qaGtjtds45E0nAnk0DmIiKsyIqYqkOF0pLuf2QMgiboj2JiZj1tWdObi66Ojshk8l4VscLCoR9H4i2tLS00ACGhoaQkZkpjJsp4isVFdxmxa+vrw+PosAzUF1VhcbGRn6qVSkpfgdPDL5hAOZoR0yMMGYFzs3JwajTKdDmFRXcs7gYeg0YFTqdjrxIuCPax20t1UOpVKKlpcUvO0EWnECkHNi6WwQw2aNAwrFV8KbubhiNRu6crl6cKizk1wMTvV6PrOxsnCkqAiZ7gS9G4JuBp8VjOdoDxOf7AF6rFFCW05V3DSHLWBvgfABsp6bYlgr8dQGfm4DUx+Tvqg9gbkCB3nRq9jNA+lMgKj50oGX5PkAvAfnyy4DVwPEEGPZlsJcet+Qymk1e36HHDYy/pMgngIO3VwBOT7JAA4psuweM6pZ+ZJWNomci9gR9E4Gd2bzIQv/8tFMJhwEXUeSZBzTE//5LgIOomTUD2lfMC7+ux8jYJ0T0lRasl5d+EvlbdRmJ51MfrdSPMZFQsJw9f3DYc1m3Km3bHWDCF51X5FMMwGqmvgnsOhyMwFsMQEbGO9JDa/I795F6m+jw/Ab+jC91ioxRlrFeM1hI83k8BBJJH0b+eT+6NiefSJ+T3qWzs/gfhrN6fSaHGX4AAAAASUVORK5CYII='; // your Amazon icon base64 here

    const processedRows = new WeakSet();

    function addLinkAfterLastAuthor(row, href, title, base64Icon, altText) {
        const authorLinks = row.querySelectorAll('a.author');
        if (authorLinks.length === 0) return;

        const searchLink = document.createElement('a');
        searchLink.href = href;
        searchLink.target = '_blank';
        searchLink.title = title;
        searchLink.style.cssText = `
      display: inline-block;
      margin-top: 4px;
      margin-right: 6px;
      float: right;
    `;
        searchLink.innerHTML = `<img src="${base64Icon}" alt="${altText}" style="width:14px;height:14px;">`;

        const lastAuthor = authorLinks[authorLinks.length - 1];
        lastAuthor.insertAdjacentElement('afterend', searchLink);
    }

    function processRow(row) {
        if (processedRows.has(row)) return;
        processedRows.add(row);

        const catDiv = row.querySelector('a.catLink > div');
        if (!catDiv || !catDiv.className.startsWith('cat')) return;

        const catNum = parseInt(catDiv.className.replace('cat', ''), 10);

        const titleLink = row.querySelector('a.torTitle');
        const authorLinks = row.querySelectorAll('a.author');
        if (!titleLink || authorLinks.length === 0) return;

        const title = titleLink.textContent.trim();
        const firstAuthor = authorLinks[0].textContent.trim();

        if (audiobookCategories.has(catNum)) {
            const audibleSearchQuery = encodeURIComponent(`${firstAuthor} ${title}`);
            const audibleHref = `https://www.audible.com/search?keywords=${audibleSearchQuery}`;
            addLinkAfterLastAuthor(row, audibleHref, 'Search Audible', base64AudibleIcon, 'Audible');
        }

        if (bookCategories.has(catNum)) {
            const amazonSearchQuery = encodeURIComponent(`${firstAuthor} ${title}`);
            const amazonHref = `https://www.amazon.com/s?k=${amazonSearchQuery}&i=stripbooks&rh=n%3A283155%2Cp_n_feature_browse-bin%3A618073011`;
            addLinkAfterLastAuthor(row, amazonHref, 'Search Amazon', base64AmazonIcon, 'Amazon');
        }
    }

    function processAllRows() {
        document.querySelectorAll('.torRow').forEach(processRow);
    }

    function waitForTorRows() {
        const rows = document.querySelectorAll('.torRow');
        if (rows.length === 0) {
            requestAnimationFrame(waitForTorRows);
        } else {
            processAllRows();

            const observer = new MutationObserver(mutations => {
                for (const mutation of mutations) {
                    mutation.addedNodes.forEach(node => {
                        if (!(node instanceof HTMLElement)) return;
                        if (node.classList.contains('torRow')) {
                            processRow(node);
                        } else {
                            node.querySelectorAll?.('.torRow')?.forEach(processRow);
                        }
                    });
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    waitForTorRows();
})();