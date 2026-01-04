// ==UserScript==
// @name         Nascondi annunci di animali da Subito.it
// @namespace    nascondianimalisubito.brunon.com
// @version      0.1.0
// @description  Nasconde tutti gli annunci con animali da Subito.it
// @author       brunon
// @match        https://www.subito.it/*
// @grant        none
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAACdlBMVEUAAADWHh7WHh7WHh7UHh7WHh7WHh7WHh7VHh7WHh7WHh7WHh7WHh7WHh7UHx/WHh7WHh7WHh7VHh7VHh7UHh7UHh7WHh7WHh7WHh7WHh7WHh7WHh7WHh7VHh7WHh7WHh7WHh7VHh7WHh7VHh7VHh7WHh7WHh7VHh7WHh7VHh7VHx/UHx/WHh7WHh7VHh7WHh7VHh707e3WHh707OvVFBTWHx9bUUf17+/VGRnWGxvWFhb07u719fX18fHUERH3///3/f1cUkjUDg72+Pj3/v73+/v99/fqoaFTST/cHBzpo6NZT0XVHR348vL/+Pns5eXWISH2+vr89fX69PTz5OTXHh368vP38PBWTEFRRzzbOztORDmJPjj28/Ppn59vZVzfWVnUCwv////29/fw6Ony3d3EvLnpnZ1XTUNQRTtMQjfXIyP//P3/+vv05+fz4ODnj4+Ui4ThZWVqYFdYUkfcQkLYKirTy8nvx8fuwsLuv7+7s6/rrq7sqamgl5KakYyCeXJ1a2NiWE9RVUrbPT2HPjfx6eno4uHh2tnx19fd1tXMxMKPh4Dkfn59cmvia2vgYmLfXV1lXFPeT0/dSUncRkbaODjZMTGANS7XJSXbGhr8+Pjwy8vstLSupqGro56GfndzamJSVUpLQDXXHR3WGhrPFBTy6+vj3NvXz86qoJvompromZnolZWck47lh4flhoa9cW7fX19eYlneU1PdTExSVktNUUZFSD7eIyPaICHg5eXd2tjLz82/uLT1rq+2r6urop2dop2VmpLYkpGRlo+KjofOhILFfXtiWE6cUk1gVkxKTkJFOzA9MifhJybZHh3KEQ9jlx2JAAAAMXRSTlMA3vXxC+KnhnD42tjCURnIrYAzHQ8G7ubTyqGXkSz7znlzW1cl6mNNRkE7Fsa6tolgqyX+oQAABvdJREFUWMPtl+VbG0EQxgstDi3U3d2zd5e7nOTiCYEkRAoBSnEo0lK0OLSl7u7u7u7u9h919gJHkjaV732/5LknN799d3Z2dq/Pf4VWv0HTkiLjh8fGDp+dGDVpcr9/jR84PnJARDiSFDNsXGLSjH+JHjx17jAKBWpo/IT+fxsePXwsAqkYhmVZkmUZRoVAY8OiBv1F+JCEEfAypSLVJFOxN6u+vmvvfvygwpZi5/8xF4NGUThcp67YudnavL5q6VLP+qa2q3kNah2DEYljfh8/cwACqXVd15oIg2jQ8yC9RhSFxmW7SB0CRFzC7+InRkjD77lYbDTwHCFLwWsMnrbdkom+0aHjp/aFeFa1udiopyHKTwTB8UbPsv1qIMSMDzk+xCM263AhT0N0gDhgcLyzcbdOBcsxIcT8I/DaqZeJPIQHxbtp6cdYtR1Po++kX8X3H4HjKSbNrKGDAfTyNZw0E72wFXsIG/gLwCg8fzWTRqqshqAp2M7lnjcpfAR6mw4GmvNzPUyLgfisZWlkGonMxgACYXpSfmQJ0U1YugtnMvqn+h0H/lWHRbOKpMjURYEe7B3lm0y0optwqIGl0NDJQYBo8KXbXJijsSIgIKtG8JvBmhVlK9a4upGc8ZIa0jA6aPfHIUq9p5gnaIPkQQWEHg+EfbnWoi2pdNl8zznErXxYiTGBJTQWqXQXnbSCcBcsSg3KQ+VRS4p3x/N1Nnu6ZMF5mGERNS8AMAdRuq4qPSzYOkeB+TQQTltFH4E46DhuUWot2TuqN3JLMggFwQt5YCFusH//mYJS1deMNNgtOeYosCLsYZFGImTY28tSlEptSma2trOExrkUrSyDwhP8MjCeQmRFswjvuxy1nTmilcF5kAgczoASS6v0Zi9usXOwEMVZaoRGzeptApGwhXcSUglXHjnZftBgRphQqsmhXUVbsrU4PiUFXJQfAYBC0NcAYMD03iIagVTkZpHDMwYLZS0FBW33WSCYnYU5F2ACON5rsXjLV563K0DiZVaFIpJkQFIEYhgrzABrydHsjyVrH75VHaDI++9eH9Mu9o1/rHpFbW6LVE+EpqkCkjBSBkSGI6ai2eBLuq0oN1Nbu+PmwlPJ1IHv++5BPCgz11HgOOdw0dI7hVV7YCHjZUA8Quze9Xqfg7P2lsXeTItl1cIFyVTyt4WrJAOZ1Sab2+TiFJIE+jYJ3U0GDMd9pKqnDWQU5S7WapV1J1YvSE5NXiARFqeUVBIKuUvRfB4AwmRALADql/YAuPRNmTjvdeBBItypU3qPO9z4bxmwPSQA5L5QhgHgoZtwos6yycT5N5jCGxgQMIUujwxwlUiVA9O44yOsXmWp9gFCTGGAnERJ6cuVkHoo3ezse/uYAxQQPgU6EISdAIiVAYkxiNnfZJQBG1Z6tSmW3M7OLcdvrj7DUsmn9r2x034tivd0sQjNlgFRwxCT2iYGACzVa8+uKVr76PGrByR14Mx1QwbRCzA2NkAhRcqASeOglK+KPf+7NnqVmVuKTOnp6W73QQ3uMOyDUr8eRYilDIOGRcmAyYmwmfIEvmcV2su82uWm7pcFQ+kCNrDL0c6tkIIRCb3bOQm2c8Mhjc8kXbTCkt2RntEznE1z/UwydFqzUejuzIWeetiNI/1uCzP64iPJ4Eu0bd3Ksh0b7L2GK1/sS02W+mR3jxJbUxkUM3GI360iHlrarqWFPYDyaretF7Dk2d3VDJuGuz0HBCKHr8mHKgi48UygEEO2GSULGWtry9tNtB+gpO7uh69kGvQH6bxwNqeRFBoVeDBGgIXdHl4COHJPXnFl+B1MG95nvnx6Cp8XpUAQhG3QU8ODjscofLAsc3K+JJ68Ag5k2Ry55R0FvjML1sLYCmuIIoPP5jBEMfsbcTVy3JYvHf4ALr3zc0elwZxK4i4nFmeRYOCnu9J8hChytwc2BGc7WtsSUPq2je0b3Zyh1Nfta/DhGvXz1TYRT2I7jQmcQ+EfD1lY4iYIWmNVkWks9o/GQUsP1pg4BMfbVgEIGS4o/ABhHhDMiKXwrXPKLy++CUMRYnTbPJDJwHDZiCAuksanQlySomOwh12HjDncLwmCs7gGxsdHewiNBwJSN1wijHyQCXjMcQqtcKKBRuIaDuFBuiiqb7UKol6QmzABCdSLfPM2lsT34NG/uy9Pkq6q+UzeomK9qOEFGiTwRtHpaa2pyGcgfmj0Hz405iJsIp/NqrncVEXzIMHTWLq1XpUPw+MT9c9fC1OAgBi1mq3Ycztv+428nVkN8MQgiA+P+puPjsmjh1IIdJphWRLLVzsQHgkb6K80Zl5cXxSk8LBRM//lqylh9IAIGRI+bMTIiWD+XzRk1vSkkfFxYaDY+MiohEFD+vxXKP0A5xiIIMGVSjAAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/476905/Nascondi%20annunci%20di%20animali%20da%20Subitoit.user.js
// @updateURL https://update.greasyfork.org/scripts/476905/Nascondi%20annunci%20di%20animali%20da%20Subitoit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide items containing specified keywords
    function hideItemsWithKeywords() {
        const declinableWords = ["can", "cagnolin", "gatt", "orfan", "cucciol", "gattin", "micin", "mici", "micett", "conigli","conigliett","cricet","cricetin"];
        const maleCountableWords = ["adorabile", "pastore", "adozione", "canile", "angelo","intelligente","simpatico","bassotto","tigrato","animale"]; // Plurale maschile
        const femaleCountableWords = ["cavia","colombacci"]; // Plurale femminile -e
        const keywords = ["setter", "taglia", "pitbull", "husky", "maschi", "femmine", "maschio", "femmina", "segugio", "segugino", "labrador", "conigli", "una famiglia", "una casa", "cerca", "vuole",
                         "bulldog","jack russel","chihuahua","pomerania", "scottish straight","adottare",];

        declinableWords.forEach(word => {
            ['a', 'e', 'i', 'o'].forEach(ending => {
                keywords.push(word + ending);
            });
        });

        keywords.push(...maleCountableWords);
        keywords.push(...femaleCountableWords);

        maleCountableWords.forEach(word => {
            keywords.push(word.substring(0, word.length - 1) + 'i');
        });

        femaleCountableWords.forEach(word => {
            keywords.push(word.substring(0, word.length - 1) + 'e');
        });

        // Create a regex pattern for the keywords allowing for digits and spaces
        const regexPattern = new RegExp(keywords.map(keyword => `\\b${keyword}\\b`).join('|'), 'i');

        const items = document.querySelectorAll('.items__item');

        // Loop through the elements and hide those containing specified keywords
        items.forEach(item => {
            // Function to check if the item or any of its children contain the keywords using regex
            const containsKeywords = (element) => {
                if (element.nodeType === Node.TEXT_NODE) {
                    const text = element.textContent;
                    return regexPattern.test(text);
                }
                for (const child of element.childNodes) {
                    if (containsKeywords(child)) {
                        return true;
                    }
                }
                return false;
            };

            // Check if the item or any of its children contain the keywords
            if (containsKeywords(item)) {
                item.style.display = 'none';
            }
        });

        // Remove items that contain URLs with src https://www.subito.it/animali/
        const itemLinks = document.querySelectorAll('.items__item a');
        itemLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('https://www.subito.it/animali/')) {
                const item = link.closest('.items__item');
                if (item) {
                    item.style.display = 'none';
                }
            }
        });
    }

    // Wait for the DOMContentLoaded event before running the script
    document.addEventListener('DOMContentLoaded', hideItemsWithKeywords);

    // Use a MutationObserver to monitor changes to the DOM and re-run the script
    const observer = new MutationObserver(hideItemsWithKeywords);
    observer.observe(document.body, { subtree: true, childList: true });
})();
