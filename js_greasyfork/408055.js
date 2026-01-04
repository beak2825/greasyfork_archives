// ==UserScript==
// @name         AO3: Tag Word Cloud
// @namespace    https://greasyfork.org/en/users/163551-vannius
// @version      1.6
// @license      MIT
// @description  Change font size of words of AO3 tags according to the word frequency in each chapter or entire works.
// @author       Vannius
// @match        https://archiveofourown.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archiveofourown.org
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/408055/AO3%3A%20Tag%20Word%20Cloud.user.js
// @updateURL https://update.greasyfork.org/scripts/408055/AO3%3A%20Tag%20Word%20Cloud.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Config
    const MAX_FONT_SCALE = 200; // %
    const MIN_FONT_SCALE = 80; // %
    const FREEFORM_TAGS = true; // Apply TWC to freeform tags.
    const AUTO_TWC_ON_READING_PAGE = true; // Apply TWC automatically on reading page.

    // Treat related words as a group and add up the count of all words in that group
    const relatedWordGroups = [ // Lowercase only
        [ 'cat', 'catelyn' ], // Add up the count of "cat" and the count of "catelyn"
        [ 'eddard', 'ned' ]   // Add up the count of "eddard" and the count of "ned"
    ];

    const ignoreWordList = [
        // article
        'a', 'an', 'the',
        // verb
        'be', 'been', 'am', 'm', 'was', 'is', 's', 'are', 're', 'were',
        'no', 'not', 'amn', 't', 'wasn', 'isn', 'aren', 'weren',
        'do', 'don', 'does', 'doesn', 'did', 'didn',
        // auxiliary verb
        'can', 'cannot', 'could', 'couldn',
        'will', 'won', 'would', 'wouldn',
        'should', 'shouldn', 'shall', 'shan',
        'must', 'mustn', 'may', 'might', 'mightn',
        'have', 've', 'haven', 'has', 'hasn', 'had', 'd', 'hadn',
        // interrogative
        'how', 'why', 'when', 'where',
        // preposition
        'to', 'for', 'from', 'up', 'down', 'in', 'out', 'on', 'at', 'off', 'into',
        'about', 'around', 'among', 'between', 'of', 'over', 'above', 'below', 'under',
        'through', 'across', 'along', 'near', 'by', 'beside', 'with', 'without',
        // conjunction
        'after', 'also', 'although', 'and', 'as', 'because', 'before', 'but',
        'considering', 'directly', 'except', 'however', 'if', 'immediately',
        'lest', 'like', 'nor', 'now', 'notwithstanding', 'once', 'only', 'or',
        'plus', 'providing', 'save', 'since', 'so',
        'than', 'though', 'till', 'unless', 'until',
        'whenever', 'whereas', 'wherever', 'whether', 'while', 'without',
        // adverb
        'already', 'back', 'just', 'more', 'much', 'still', 'yet', 'there', 'very',
        // adjective
        'good', 'bad', 'big', 'dark', 'little', 'own',
        // pronouns
        'i', 'my', 'me', 'mine', 'myself',
        'you', 'your', 'yours', 'yourself', 'yourselves',
        'we', 'our', 'us', 'ours', 'ourselves',
        'they', 'their', 'them', 'theirs', 'themselves',
        'he', 'his', 'him', 'himself',
        'she', 'hers', 'her', 'herself',
        'it', 'itself',
        'all', 'another', 'any', 'anybody', 'anyone', 'anything', 'both', 'each', 'either',
        'everybody', 'everyone', 'everything', 'few', 'many', 'most',
        'neither', 'nobody', 'none', 'no one', 'nothing', 'one', 'other', 'others',
        'several', 'some', 'somebody', 'someone', 'something',
        'as', 'such', 'that', 'these', 'this', 'those',
        'what', 'whatever', 'which', 'whichever', 'who', 'whoever', 'whom', 'whomever', 'whose',
        // noun
        'aunt', 'brother', 'daughter', 'father', 'mother', 'son', 'sister', 'uncle',
        'female', 'male',
        'being', 'king', 'lady', 'lord', 'time', 'queen'
    ];

    // Functions
    function makeTwcButton (ao3Tags, url = null) {
        // url ? browsing page : reading page
        const tagType = url ? 'button' : 'a';
        const btn = document.createElement(tagType);
        if (url) {
            btn.classList.add('twc');
            btn.type = 'button';
        }

        btn.addEventListener('click', async () => {
            if (!btn.classList.contains('disabled')) {
                btn.classList.add('disabled');
                btn.textContent = 'Processing';

                // Get pTags from entire contents url
                const getPTagsFromEntireContents = async (url) => {
                    // eslint-disable-next-line no-undef
                    const res = await fetch(url);
                    const text = await res.text();
                    // eslint-disable-next-line no-undef
                    const parsedDoc = new DOMParser().parseFromString(text, "text/html");

                    const chaptersTag = parsedDoc.getElementById('chapters');
                    if (chaptersTag) {
                        return chaptersTag.querySelectorAll('div.userstuff p');
                    } else {
                        return null;
                    }
                };

                // url ? browsing page : reading page
                const pTags = url
                    ? await getPTagsFromEntireContents(url)
                    : document.getElementById('chapters').querySelectorAll('div.userstuff p');

                // Run Tag Word Cloud
                if (pTags) {
                    tagWordCloud(ao3Tags, pTags);
                    btn.textContent = 'Complete';
                } else {
                    // eslint-disable-next-line no-undef
                    alert("There isn't a consent to view the content in cookie.");
                    btn.classList.remove('disabled');
                    btn.textContent = 'Run TWC';
                }
            }
        });

        btn.appendChild(document.createTextNode('Run TWC'));
        return btn;
    }

    // Make words list from AO3 tags
    // Change font size of each word of AO3 tags according to the word frequency in pTags.
    function tagWordCloud (ao3Tags, pTags) {
        // Make uniqueWordList
        const wordList = [...ao3Tags]
            .flatMap(tag => tag.textContent.toLowerCase().split(/\W/g))
            .filter(x => x && !ignoreWordList.includes(x) && !/\d+/.test(x));
        // Add words by relatedWordGroups
        relatedWordGroups.forEach(relatedWords => {
            if (relatedWords.some(item => wordList.includes(item))) {
                wordList.push(...relatedWords);
            }
        });
        const uniqueWordList = [...new Set(wordList)];
        if (!uniqueWordList.length) {
            return;
        }
        console.log("uniqueWordList", uniqueWordList);

        // Count word frequency in each pTag by using regex.
        const individualWordCounts = {};
        uniqueWordList.forEach(uniqueWord => {
            individualWordCounts[uniqueWord] = 0;
        });

        const wordsRegex = RegExp(uniqueWordList.map(word => '\\b' + word + '\\b').join('|'), 'gi');
        for (let pTag of pTags) {
            const matches = pTag.textContent.match(wordsRegex);
            if (matches) {
                for (let match of matches) {
                    match = match.toLowerCase();
                    individualWordCounts[match] += 1;
                }
            }
        }
        if (!Object.keys(individualWordCounts).length) {
            return;
        }
        console.log("individualWordCounts", individualWordCounts);

        // Make wordToGroupMap
        const wordToGroupMap = new Map();
        relatedWordGroups.forEach(group => {
            group.forEach(word1 => {
                if (!wordToGroupMap.has(word1)) {
                    wordToGroupMap.set(word1, new Set());
                }
                // Aggregating words that appear across multiple groups
                group.forEach(word2 => wordToGroupMap.get(word1).add(word2));
            });
        });
        if (wordToGroupMap.size > 0) {
            console.log("wordToGroupMap", wordToGroupMap);
        }

        // Make groupTotalCounts
        const groupTotalCounts = {};
        Object.keys(individualWordCounts).forEach(key => {
            if (wordToGroupMap.has(key)) {
                const relatedWords = [...wordToGroupMap.get(key)];
                const totalCount = relatedWords.reduce((sum, word) => {
                    return sum + (individualWordCounts[word] || 0);
                }, 0);
                groupTotalCounts[key] = totalCount;
            } else {
                groupTotalCounts[key] = individualWordCounts[key];
            }
        });
        if (Object.keys(groupTotalCounts).length) {
            console.log("groupTotalCounts", groupTotalCounts);
        }

        // Calculate counts
        const totalCount = Object.values(individualWordCounts).reduce((p, y) => p + y, 0);
        const maxCount = Object.values(individualWordCounts).reduce((p, y) => p > y ? p : y);
        const minCount = Object.values(individualWordCounts).reduce((p, y) => p < y ? p : y);

        // Change font size of word of AO3 tags by the word frequency
        // by replacing each AO3 tags
        for (let ao3Tag of ao3Tags) {
            // Make new ao3 tag
            const newAo3Tag = document.createElement('a');
            newAo3Tag.href = ao3Tag.href;
            newAo3Tag.className = ao3Tag.className;

            // Change each text's font size
            const splitText = ao3Tag.textContent.split(/(\W)/g);
            splitText.forEach(text => {
                if (/\S/.test(text)) {
                    // Other than space
                    const spanTag = document.createElement('span');
                    spanTag.textContent = text;
                    text = text.toLowerCase();
                    if (text in groupTotalCounts) {
                        // Calculate font size of text according to text count
                        // from MIN_FONT_SCALE to MAX_FONT_SCALE
                        const count = groupTotalCounts[text];
                        const percentage = Math.round(count / totalCount * 1000) / 10;
                        spanTag.title = `${count}/${totalCount} counts ${percentage}%`;

                        if (wordToGroupMap.has(text)) {
                            const relatedWords = [...wordToGroupMap.get(text)].sort();
                            spanTag.title += '\n' + relatedWords
                                .map(word => `${word}: ${individualWordCounts[word] || 0}`)
                                .join('\n');
                        }

                        const fontScale =
                            (count - minCount) * (MAX_FONT_SCALE - MIN_FONT_SCALE) /
                            (maxCount - minCount);

                        spanTag.style.fontSize = MIN_FONT_SCALE + fontScale + '%';
                    } else {
                        spanTag.style.fontSize = MIN_FONT_SCALE + '%';
                    }

                    newAo3Tag.appendChild(spanTag);
                } else {
                    // Space
                    newAo3Tag.appendChild(document.createTextNode(text));
                }
            });
            const parentTag = ao3Tag.parentNode;
            parentTag.replaceChild(newAo3Tag, ao3Tag);
        }
    }

    // Main
    setTimeout(function () {
        if (/archiveofourown\.org\/(collections\/[^/]+\/)?works\/[0-9]+/.test(window.location.href)) {
            // Reading page
            // Scrape AO3 tags
            const ao3TagQueryList = ['dd.character a', 'dd.relationship a'];
            if (FREEFORM_TAGS) {
                ao3TagQueryList.push('dd.freeform a');
            }
            const ao3Tags = document.querySelectorAll(ao3TagQueryList.join(', '));

            if (AUTO_TWC_ON_READING_PAGE) {
                // Run Tag Word Cloud
                const pTags = document.getElementById('chapters').querySelectorAll('div.userstuff p');
                tagWordCloud(ao3Tags, pTags);
            } else {
                // Make "TWC" button and add to menuTag.
                const btn = makeTwcButton(ao3Tags);
                const liTag = document.createElement('li');
                liTag.appendChild(btn);

                const fragment = document.createDocumentFragment();
                fragment.appendChild(document.createTextNode('\n    '));
                fragment.appendChild(liTag);
                fragment.appendChild(document.createTextNode('\n\n'));

                const menuTag = document.querySelector('.work.navigation.actions');
                menuTag.insertBefore(fragment, menuTag.lastChild);
            }
        } else {
            // Browsing page
            // Add style for twc btn
            // eslint-disable-next-line no-undef
            GM_addStyle([
                ".twc {",
                "  padding: 0.5px 2px;",
                "}",
                ".twc:focus, .twc:hover {",
                "  color: #900;",
                "  box-shadow: inset 2px 2px 2px #bbb;",
                "}",
                ".twc:active, .twc.disabled {",
                "  background: #ccc;",
                "  box-shadow: inset 1px 1px 3px #333;",
                "}"
            ].join(''));

            // Scrape data for each article and add TWC button.
            const articles = document.getElementById('main').getElementsByClassName('blurb');
            for (let article of articles) {
                const headerTag = article.querySelector('.header.module');
                if (!headerTag || headerTag.className === "mystery header picture module") {
                    continue;
                }

                // If article is about series, chapters don't exist.
                const chapters = article.querySelector('dd.chapters');
                if (chapters) {
                    // Make entireUrl
                    const titleTag = headerTag.firstElementChild.firstElementChild;
                    const splitHref = titleTag.href.split('/');
                    if (splitHref[3] === 'collections') {
                        splitHref.splice(3, 2);
                    }
                    let entireUrl = splitHref.join('/');
                    if (chapters.textContent.split('/')[0] !== '1') {
                        entireUrl += "?view_full_work=true";
                    }

                    // Scrape AO3 Tags
                    const ao3TagQueryList = ['li.characters a', 'li.relationships a'];
                    if (FREEFORM_TAGS) {
                        ao3TagQueryList.push('li.freeforms a');
                    }
                    const ao3Tags = article.querySelectorAll(ao3TagQueryList.join(', '));

                    // Make "TWC" button and add to fandomTag.
                    const btn = makeTwcButton(ao3Tags, entireUrl);
                    const fragment = document.createDocumentFragment();
                    fragment.appendChild(document.createTextNode(' '));
                    fragment.appendChild(btn);

                    const fandomTag = headerTag.children[1];
                    fandomTag.insertBefore(fragment, fandomTag.lastChild);
                }
            }
        }
    }, 10);
})();
