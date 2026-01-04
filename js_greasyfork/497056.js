// ==UserScript==
// @name        X.com Xtreme Xperience
// @namespace   Violentmonkey Scripts
// @match       https://x.com/*
// @grant       none
// @version     3.0
// @author      whey.party
// @description 6/4/2024, 10:48:37 AM
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/497056/Xcom%20Xtreme%20Xperience.user.js
// @updateURL https://update.greasyfork.org/scripts/497056/Xcom%20Xtreme%20Xperience.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Create a link element for the font import
    var fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Spline+Sans+Mono:ital,wght@0,300..700;1,300..700&display=swap';

    // Append the link element to the document head
    document.head.appendChild(fontLink);

    // Create a style element to override border-radius
    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(`
        * {
            font-family: 'Spline Sans Mono', monospace !important;
            border-radius: 0 !important;
            -webkit-border-radius: 0 !important;
            -moz-border-radius: 0 !important;
            -ms-border-radius: 0 !important;
            -o-border-radius: 0 !important;
        }
        .r-1kqtdi0 {
            border-color: rgb(90 90 90) !important;
        }
        .r-1igl3o0 {
            border-bottom-color: rgb(90 90 90) !important;
        }
        .r-45ll9u.r-1v2oles{
            border: 1px solid rgb(90 90 90) !important;
        }
        .r-2sztyj{
            border-top-color: rgb(90 90 90) !important;
        }
        .r-1vtznih{
            background-color: grey !important;
        }
    `));

    // Append the style element to the document head
    document.head.appendChild(style);

    // Function to convert RGB to a comparable string
    function rgbToString(r, g, b) {
        return `rgb(${r}, ${g}, ${b})`;
    }

    // Function to replace background and text color
    function replaceColors(element) {
        // Define the target colors
        const targetBgColor = rgbToString(29, 155, 240);
        const targetTextColor = rgbToString(29, 155, 240);

        const computedStyle = getComputedStyle(element);

        // Replace background color and set text color to black
        if (computedStyle.backgroundColor === targetBgColor || computedStyle.background === targetBgColor) {
            element.style.backgroundColor = 'white';
            element.style.color = 'black';

            // Apply the text color to all child elements recursively
            element.querySelectorAll('*').forEach(child => {
                child.style.color = 'black';
            });
        }

        // Replace text color with grey and add underline if it's a link
        if (computedStyle.color === targetTextColor) {
            element.style.color = 'grey';
            if (element.tagName.toLowerCase() === 'a') {
                element.style.textDecoration = 'underline';
            }
        }
    }

    // Function to replace colors in all elements
    function processAllElements() {
        // Get all elements in the document
        const allElements = document.querySelectorAll('*');

        // Iterate over all elements to find and replace the target colors
        allElements.forEach(replaceColors);
    }

    // Function to check for the element with class public-DraftEditorPlaceholder-inner and set its inner text
    function checkForBlazeYourGlory() {
        const placeholderElement = document.querySelector('.public-DraftEditorPlaceholder-inner');
        if (placeholderElement) {
            placeholderElement.innerText = "𝔹laze your glory!";
        }
    }


    // Define the replacement SVG content
    var replacementSVGReply = '<svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0 0 24 24"><path fill="currentColor" d="M11 20L1 12l10-8v5c5.523 0 10 4.477 10 10c0 .273-.01.543-.032.81a9.002 9.002 0 0 0-7.655-4.805L13 15h-2zm-2-7h4.034l.347.007c1.285.043 2.524.31 3.676.766A7.982 7.982 0 0 0 11 11H9V8.161L4.202 12L9 15.839z"></path></svg>';
    var replacementSVGBoost = '<svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0 0 24 24"><path fill="currentColor" d="M12 23a7.5 7.5 0 0 0 7.5-7.5c0-.866-.23-1.697-.5-2.47c-1.667 1.647-2.933 2.47-3.8 2.47c3.995-7 1.8-10-4.2-14c.5 5-2.796 7.274-4.138 8.537A7.5 7.5 0 0 0 12 23m.71-17.765c3.241 2.75 3.257 4.887.753 9.274c-.761 1.333.202 2.991 1.737 2.991c.688 0 1.384-.2 2.119-.595a5.5 5.5 0 1 1-9.087-5.412c.126-.118.765-.685.793-.71c.424-.38.773-.717 1.118-1.086c1.23-1.318 2.114-2.78 2.566-4.462"></path></svg>'
    var replacementSVGLike = '<svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0 0 24 24"><path fill="currentColor" d="M14.6 8H21a2 2 0 0 1 2 2v2.105c0 .26-.051.52-.15.761l-3.095 7.515a1 1 0 0 1-.925.62H2a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1h3.482a1 1 0 0 0 .817-.424L11.752.851a.5.5 0 0 1 .632-.159l1.814.908a2.5 2.5 0 0 1 1.305 2.852zM7 10.588V19h11.16L21 12.105V10h-6.4a2 2 0 0 1-1.938-2.493l.903-3.548a.5.5 0 0 0-.261-.57l-.661-.331l-4.71 6.672c-.25.354-.57.645-.933.858M5 11H3v8h2z"></path></svg>'
    var replacementSVGUnlike = '<svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0 0 24 24"><path fill="currentColor" d="M2 9h3v12H2a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1m5.293-1.293l6.4-6.4a.5.5 0 0 1 .654-.047l.853.64a1.5 1.5 0 0 1 .553 1.57L14.6 8H21a2 2 0 0 1 2 2v2.104a2 2 0 0 1-.15.762l-3.095 7.515a1 1 0 0 1-.925.619H8a1 1 0 0 1-1-1V8.414a1 1 0 0 1 .293-.707"></path></svg>'
    var replacementSVGBook = '<svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0 0 24 24"><path fill="currentColor" d="M5 2h14a1 1 0 0 1 1 1v19.143a.5.5 0 0 1-.766.424L12 18.03l-7.234 4.536A.5.5 0 0 1 4 22.143V3a1 1 0 0 1 1-1m13 2H6v15.432l6-3.761l6 3.761z"></path></svg>'
    var replacementSVGBell = '<svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0 0 24 24"><path fill="currentColor" d="M5 18h14v-6.969C19 7.148 15.866 4 12 4s-7 3.148-7 7.031zm7-16c4.97 0 9 4.043 9 9.031V20H3v-8.969C3 6.043 7.03 2 12 2M9.5 21h5a2.5 2.5 0 0 1-5 0"></path></svg>'
    var replacementSVGMessage = '<svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0 0 24 24"><path fill="currentColor" d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1m17 4.238l-7.928 7.1L4 7.216V19h16zM4.511 5l7.55 6.662L19.502 5z"></path></svg>'
    var replacementSVGLists = '<svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0 0 24 24"><path fill="currentColor" d="M20 22H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1m-1-2V4H5v16zM8 7h8v2H8zm0 4h8v2H8zm0 4h5v2H8z"></path></svg>'
    var replacementSVGComm = '<svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0 0 24 24"><path fill="currentColor" d="M2 22a8 8 0 1 1 16 0h-2a6 6 0 0 0-12 0zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6s6 2.685 6 6s-2.685 6-6 6m0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4m8.284 3.703A8.002 8.002 0 0 1 23 22h-2a6.001 6.001 0 0 0-3.537-5.473zm-.688-11.29A5.5 5.5 0 0 1 21 8.5a5.499 5.499 0 0 1-5 5.478v-2.013a3.5 3.5 0 0 0 1.041-6.609z"></path></svg>'
    var replacementSVGProfile = '<svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0 0 24 24"><path fill="currentColor" d="M4 22a8 8 0 1 1 16 0h-2a6 6 0 0 0-12 0zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6s6 2.685 6 6s-2.685 6-6 6m0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4"></path></svg>'







    // Function to replace children of target SVG elements
    function replaceSVGChildren() {
    // Find all buttons with data-testid="reply"
    var replyButtons = document.querySelectorAll('button[data-testid="reply"]');

    // Iterate over each found button
    replyButtons.forEach(function(inner) {
        // Find any SVG elements inside descendants of the button
        var svgElements = inner.querySelectorAll('svg');

        // Iterate over each found SVG element
        svgElements.forEach(function(svg) {
            // Replace the innerHTML of the SVG with the replacement content
            svg.innerHTML = replacementSVGReply;
        });
    });

    // Find all buttons with data-testid="reply"
    var boostButtons = document.querySelectorAll('button[data-testid="retweet"]');

    // Iterate over each found button
    boostButtons.forEach(function(inner) {
        // Find any SVG elements inside descendants of the button
        var svgElements = inner.querySelectorAll('svg');

        // Iterate over each found SVG element
        svgElements.forEach(function(svg) {
            // Replace the innerHTML of the SVG with the replacement content
            svg.innerHTML = replacementSVGBoost;
        });
    });

    // Find all buttons with data-testid="reply"
    var likeButtons = document.querySelectorAll('button[data-testid="like"]');

    // Iterate over each found button
    likeButtons.forEach(function(inner) {
        // Find any SVG elements inside descendants of the button
        var svgElements = inner.querySelectorAll('svg');

        // Iterate over each found SVG element
        svgElements.forEach(function(svg) {
            // Replace the innerHTML of the SVG with the replacement content
            svg.innerHTML = replacementSVGLike;
        });
    });
    // Find all buttons with data-testid="reply"
    var unlikeButtons = document.querySelectorAll('button[data-testid="unlike"]');

    // Iterate over each found button
    unlikeButtons.forEach(function(inner) {
        // Find any SVG elements inside descendants of the button
        var svgElements = inner.querySelectorAll('svg');

        // Iterate over each found SVG element
        svgElements.forEach(function(svg) {
            // Replace the innerHTML of the SVG with the replacement content
            svg.innerHTML = replacementSVGUnlike;
        });
    });
    // Find all buttons with data-testid="reply"
    var bookButtons = document.querySelectorAll('button[data-testid="bookmark"]');

    // Iterate over each found button
    bookButtons.forEach(function(inner) {
        // Find any SVG elements inside descendants of the button
        var svgElements = inner.querySelectorAll('svg');

        // Iterate over each found SVG element
        svgElements.forEach(function(svg) {
            // Replace the innerHTML of the SVG with the replacement content
            svg.innerHTML = replacementSVGBook;
        });
    });

    // Find all buttons with data-testid="reply"
    var navBell = document.querySelectorAll('a[href="/notifications"]');

    // Iterate over each found button
    navBell.forEach(function(inner) {
        // Find any SVG elements inside descendants of the button
        var svgElements = inner.querySelectorAll('svg');

        // Iterate over each found SVG element
        svgElements.forEach(function(svg) {
            // Replace the innerHTML of the SVG with the replacement content
            svg.innerHTML = replacementSVGBell;
        });
    });
    // Find all buttons with data-testid="reply"
    var navMessages = document.querySelectorAll('a[href="/messages"]');

    // Iterate over each found button
    navMessages.forEach(function(inner) {
        // Find any SVG elements inside descendants of the button
        var svgElements = inner.querySelectorAll('svg');

        // Iterate over each found SVG element
        svgElements.forEach(function(svg) {
            // Replace the innerHTML of the SVG with the replacement content
            svg.innerHTML = replacementSVGMessage;
        });
    });
    // Find all buttons with data-testid="reply"
    var navLists = document.querySelectorAll('a[href*="/lists"]');

    // Iterate over each found button
    navLists.forEach(function(inner) {
        // Find any SVG elements inside descendants of the button
        var svgElements = inner.querySelectorAll('svg');

        // Iterate over each found SVG element
        svgElements.forEach(function(svg) {
            // Replace the innerHTML of the SVG with the replacement content
            svg.innerHTML = replacementSVGLists;
        });
    });

    // Find all buttons with data-testid="reply"
    var navBook = document.querySelectorAll('a[href*="/i/bookmarks"]');

    // Iterate over each found button
    navBook.forEach(function(inner) {
        // Find any SVG elements inside descendants of the button
        var svgElements = inner.querySelectorAll('svg');

        // Iterate over each found SVG element
        svgElements.forEach(function(svg) {
            // Replace the innerHTML of the SVG with the replacement content
            svg.innerHTML = replacementSVGBook;
        });
    });
    // Find all buttons with data-testid="reply"
    var navComm = document.querySelectorAll('a[href*="/communities"]');

    // Iterate over each found button
    navComm.forEach(function(inner) {
        // Find any SVG elements inside descendants of the button
        var svgElements = inner.querySelectorAll('svg');

        // Iterate over each found SVG element
        svgElements.forEach(function(svg) {
            // Replace the innerHTML of the SVG with the replacement content
            svg.innerHTML = replacementSVGComm;
        });
    });
    // Find all buttons with data-testid="reply"
    var navProfile = document.querySelectorAll('a[data-testid="AppTabBar_Profile_Link"]');

    // Iterate over each found button
    navProfile.forEach(function(inner) {
        // Find any SVG elements inside descendants of the button
        var svgElements = inner.querySelectorAll('svg');

        // Iterate over each found SVG element
        svgElements.forEach(function(svg) {
            // Replace the innerHTML of the SVG with the replacement content
            svg.innerHTML = replacementSVGProfile;
        });
    });
}




    // Lookup table
    const lookup = {
        //'a': '𝕒', 'b': '𝕓', 'c': '𝕔', 'd': '𝕕', 'e': '𝕖', 'f': '𝕗', 'g': '𝕘', 'h': '𝕙', 'i': '𝕚', 'j': '𝕛', 'k': '𝕜', 'l': '𝕝', 'm': '𝕞', 'n': '𝕟', 'o': '𝕠', 'p': '𝕡', 'q': '𝕢', 'r': '𝕣', 's': '𝕤', 't': '𝕥', 'u': '𝕦', 'v': '𝕧', 'w': '𝕨', 'x': '𝕩', 'y': '𝕪', 'z': '𝕫',
        'x': '𝕩', 's': '𝕩', 'S': '𝕏',
        'A': '𝔸', 'B': '𝔹', 'C': 'ℂ', 'D': '𝔻', 'E': '𝔼', 'F': '𝔽', 'G': '𝔾', 'H': 'ℍ', 'I': '𝕀', 'J': '𝕁', 'K': '𝕂', 'L': '𝕃', 'M': '𝕄', 'N': 'ℕ', 'O': '𝕆', 'P': 'ℙ', 'Q': 'ℚ', 'R': 'ℝ', 'S': '𝕏', 'T': '𝕋', 'U': '𝕌', 'V': '𝕍', 'W': '𝕎', 'X': '𝕏', 'Y': '𝕐', 'Z': 'ℤ',
        //'A': '𝕏', 'B': '𝕏', 'C': '𝕏', 'D': '𝕏', 'E': '𝕏', 'F': '𝕏', 'G': '𝕏', 'H': '𝕏', 'I': '𝕏', 'J': '𝕏', 'K': '𝕏', 'L': '𝕏', 'M': '𝕏', 'N': '𝕏', 'O': '𝕏', 'P': '𝕏', 'Q': '𝕏', 'R': '𝕏', 'S': '𝕏', 'T': '𝕏', 'U': '𝕏', 'V': '𝕏', 'W': '𝕏', 'X': '𝕏', 'Y': '𝕏', '𝕏': '𝕏'
    };
    // Lookup table for predefined vocabulary replacements
    const wordLookup = {
        // Example entries
        real: '𝕋𝕣𝕦𝕥𝕙',
        fact: '𝕋𝕣𝕦𝕥𝕙',
        post: '𝕏ost',
        tweet: '𝕏ost',
        twitter: '𝕏',
        car: 'automo𝕏',
        phone: 'tele𝕏',
        house: 'domi𝕏',
        computer: 'cyber𝕏',
        internet: 'net𝕏',
        food: 'nutri𝕏',
        drink: 'hydr𝕏',
        shirt: 'cloth𝕏',
        shoes: 'foot𝕏',
        chair: 'sea𝕏',
        table: 'surfa𝕏',
        money: 'capi𝕏',
        work: 'proje𝕏',
        sleep: 'rest𝕏',
        book: 'readi𝕏',
        movie: 'cinem𝕏',
        music: 'soni𝕏',
        game: 'play𝕏',
        friend: 'bud𝕏',
        family: 'kin𝕏',
        pet: 'compan𝕏',
        love: 'affec𝕏',
        happy: 'joyfu𝕏',
        sad: 'mourn𝕏',
        angry: 'furi𝕏',
        smart: 'brani𝕏',
        dumb: 'ignoran𝕏',
        funny: 'humori𝕏',
        serious: 'solemn𝕏',
        fast: 'swi𝕏',
        slow: 'gradu𝕏',
        big: 'mega𝕏',
        small: 'min𝕏',
        beautiful: 'elegan𝕏',
        ugly: 'grotes𝕏',
        nice: 'pleasan𝕏',
        mean: 'cruel𝕏',
        cool: 'chill𝕏',
        hot: 'blazi𝕏',
        cold: 'chill𝕏',
        smart: 'brani𝕏',
        dumb: 'ignoran𝕏',
        rich: 'lu𝕏u𝕏',
        poor: 'humbl𝕏',
        happy: 'joyfu𝕏',
        sad: 'mourn𝕏',
        angry: 'furi𝕏',
        healthy: 'wellne𝕏',
        sick: 'illne𝕏',
        clean: 'puri𝕏',
        dirty: 'grimy𝕏',
        safe: 'secur𝕏',
        dangerous: 'hazar𝕏',
        good: 'opti𝕏',
        bad: 'negati𝕏',
        right: 'correct𝕏',
        wrong: 'incorre𝕏',
        true: 'authen𝕏',
        false: 'falla𝕏',
        win: 'victo𝕏',
        lose: 'defea𝕏',
        begin: 'commen𝕏',
        end: 'conclu𝕏',
        start: 'initia𝕏',
        stop: 'cease𝕏',
        buy: 'purcha𝕏',
        sell: 'trade𝕏',
        happy: 'joyfu𝕏',
        sad: 'mourn𝕏',
        angry: 'furi𝕏',
        posted: '𝕏osted',
        reply: '𝕏eply',
        replies: '𝕏eplies',
        search: '𝕏ear𝕏'


        // Add more as needed
    };


    // Function to replace the first capital letter in a word based on the lookup table
    function replaceFirstCapital(word) {
        // Special case to replace "Ex" with "X"
        if (word.startsWith("Ex")) {
            return word.replace("Ex", "𝕏");
        }
        if (word.startsWith("ex")) {
            return word.replace("ex", "𝕩");
        }
        // Special case to replace "Ex" with "X"
        if (word.startsWith("E𝕩")) {
            return word.replace("E𝕩", "𝕏");
        }
        // Special case to replace "Ex" with "X"
        if (word.startsWith("e𝕩")) {
            return word.replace("e𝕩", "𝕩");
        }
        // Special case to replace "ks" with "X"
        if (word.includes("ks")) {
            return word.replace("ks", "𝕩");
        }
        // Special case to replace "ks" with "X"
        if (word.includes("k𝕩")) {
            return word.replace("k𝕩", "𝕩");
        }
        if (word.includes("Ks")) {
            return word.replace("Ks", "x");
        }
        // Special case to replace "ks" with "X"
        if (word.includes("K𝕩")) {
            return word.replace("K𝕩", "𝕏");
        }

        //if (word === word.toUpperCase()) {
        //    return word; // Return the word unchanged if it is all caps
        //}

        return word.replace(/([A-Z])/, (match) => lookup[match] || match);
    }
    // Function to replace words based on the word lookup table
    //function replaceVocabulary(word) {
    //    return wordLookup[word] || word;
    //}
    // Function to replace words based on the word lookup table
    function replaceVocabulary(word) {
        // Check if the word exists in the lookup table (case insensitive)
        const lowerCaseWord = word.toLowerCase(); // Convert word to lowercase
        return wordLookup[lowerCaseWord] || word; // Check lookup table with lowercase word
    }

    //function replaceCharacters(str) {vocabulary
    //    let replacedWord = replaceVocabulary(word);
    //    return str.split('').map(char => lookup[char] || char).join('');
    //}
    // Function to replace characters in a string based on the lookup table
    //function replaceCharacters(text) {
    //    return text.split(' ').map(word => replaceFirstCapital(word)).join(' ');
    //}

    // Function to replace characters and vocabulary in a string based on the lookup tables
 function replaceCharacters(text) {
    // Split the text into words
    let words = text.split(' ');

    // Iterate through each word
    for (let i = 0; i < words.length; i++) {
        let word = words[i];
        // First replace predefined vocabulary
        let replacedWord = replaceVocabulary(word);

        // Create an array to store the replaced characters
        let replacedCharacters = [];

        // Iterate through each character in the word
        for (let j = 0; j < replacedWord.length; j++) {
            let char = replacedWord[j];
            // Replace the character with its corresponding value from the lookup table
            replacedCharacters.push(lookup[char.toLowerCase()] || char);
        }

        // Replace the word with the replaced characters
        words[i] = replacedCharacters.join('');
    }

    // Join the words back into a single string and return
    return replaceFirstCapital(words.join(' '));
}


    // Function to replace the contents of all span elements
    function replaceSpanContents() {
        // Get all span elements
        const spans = document.querySelectorAll('span');

        // Replace the contents of each span element
        spans.forEach(span => {
            // Check if the span contains only text nodes
            const containsOnlyText = Array.from(span.childNodes).every(node => node.nodeType === Node.TEXT_NODE);

            // Check if the span has data-text attribute set to "true"
            const hasTextAttribute = span.getAttribute('data-text') === 'true';

            // Exclude the span if it has data-text attribute set to "true"
            if (containsOnlyText && !hasTextAttribute) {
                span.textContent = replaceCharacters(span.textContent);
            }
        });
    }



    // Observe for new elements added to the document
    //const observer = new MutationObserver(processAllElements);
    //observer.observe(document.body, { childList: true, subtree: true });


  // Observe for new elements added to the document
    const observer = new MutationObserver(function() {
        processAllElements();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Run the functions on page load
    window.addEventListener('load', function() {
        processAllElements();
        setInterval(replaceSVGChildren, 50);
        setInterval(checkForBlazeYourGlory, 50);
        setInterval(replaceSpanContents, 50);
    });


})();