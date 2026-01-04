// ==UserScript==
// @name         QuizYeet
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Grab answers on cengage quizzes for csc 104.  Currently only works with module 4.
// @author       Pan
// @match        https://cnow.apps.ng.cengage.com/ilrn/integration/mindapp.do?*
// @include      https://cnow.apps.ng.cengage.com/ilrn/integration/mindapp.do?*
// @include      https://*cengage*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390697/QuizYeet.user.js
// @updateURL https://update.greasyfork.org/scripts/390697/QuizYeet.meta.js
// ==/UserScript==

'use strict';
//esversion: 6

let directInsertion = true;

window.addEventListener('keydown', e => {
    if (e.code == 'KeyA' && e.altKey) {
        grabAnswer();
    }
}, true);

// document.querySelect('.itemDisplayName').addEventListener('click', e => {
//     if (e.code == 'KeyA' && e.shiftKey && e.ctrlKey) {
//         grabAnswer();
//     }
// });

function grabAnswer() {
    let div = document.querySelector('div.problemTypes');
    quizJson.forEach(x => {
        if (div.innerText.match(new RegExp(x.regex))) {
            if (directInsertion) {
                div.querySelector('input').value = x.answer;
            } else {
                window.alert(x.answer);
            }
        }
    });
}

let quizJson = [
    {
        "regex": "The World Wide Web is one of the many technologies that uses the (.+?)? infrastructure to distribute data\\.",
        "answer": "Internet",
        "question": "The World Wide Web is one of the many technologies that uses the Internet infrastructure to distribute data."
    },
    {
        "regex": "The basis for Ted Nelson.s original idea for (.+?)? was to use bidirectional links to navigate between digital documents\\.",
        "answer": "hypertext",
        "question": "The basis for Ted Nelson’s original idea for hypertext was to use bidirectional links to navigate between digital documents."
    },
    {
        "regex": "A\\(n\\) (.+?)? symbol in a URL indicates a query\\.",
        "answer": "? or question mark",
        "question": "A(n) ? or question mark symbol in a URL indicates a query."
    },
    {
        "regex": "In the URL http://www.musicwire.com/bit.htm, the domain name is (.+?)?.",
        "answer": "musicwire.com",
        "question": "In the URL http://www.musicwire.com/bit.htm, the domain name is musicwire.com."
    },
    {
        "regex": "Http://bit.ly/MY67dd93B is an example of a\\(n\\) (.+?)? URL.",
        "answer": "short",
        "question": "Http://bit.ly/MY67dd93B is an example of a(n) short URL."
    },
    {
        "regex": "It is important to (.+?)? your browser to get patches for known security exploits\\.",
        "answer": "update",
        "question": "It is important to update your browser to get patches for known security exploits."
    },
    {
        "regex": "When you use a public computer, the next person who uses it can see the Web pages you visited by looking at the (.+?)? list\\.",
        "answer": "History",
        "question": "When you use a public computer, the next person who uses it can see the Web pages you visited by looking at the History list."
    },
    {
        "regex": "If you do not want HTML and image files from recently visited Web sites to be stored on your device, delete the browser (.+?)?\\.",
        "answer": "cache",
        "question": "If you do not want HTML and image files from recently visited Web sites to be stored on your device, delete the browser cache."
    },
    {
        "regex": "A\\(n\\) (.+?)?, such as Adobe Reader, is a program that extends a browser.s ability to work with file formats\\.",
        "answer": "plugin",
        "question": "A(n) plugin, such as Adobe Reader, is a program that extends a browser’s ability to work with file formats."
    },
    {
        "regex": "A browser (.+?)?, such as AdBlock or the Merriam-Webster Online Toolbar, adds features to a browser\\.",
        "answer": "extension",
        "question": "A browser extension, such as AdBlock or the Merriam-Webster Online Toolbar, adds features to a browser."
    },
    {
        "regex": "A Web server sends a\\(n\\) (.+?)? document to a browser, which then displays it as a Web page\\.",
        "answer": "HTML or source",
        "question": "A Web server sends a(n) HTML or source document to a browser, which then displays it as a Web page."
    },
    {
        "regex": "Notepad and TextEdit can be used to manually enter HTML (.+?)? into a document\\.",
        "answer": "code, tags",
        "question": "Notepad and TextEdit can be used to manually enter HTML code, tags into a document."
    },
    {
        "regex": "<a href> is used to create (.+?)? in an HTML document.",
        "answer": "links or hyperlinks",
        "question": "<a href> is used to create links or hyperlinks in an HTML document."
    },
    {
        "regex": "CSS stands for Cascading (.+?)? Sheets\\.",
        "answer": "Style",
        "question": "CSS stands for Cascading Style Sheets."
    },
    {
        "regex": "Dynamic Web pages are created with (.+?)? written in languages such as PHP and JavaScript\\.",
        "answer": "scripts",
        "question": "Dynamic Web pages are created with scripts written in languages such as PHP and JavaScript."
    },
    {
        "regex": "HTTP is a\\(n\\) (.+?)? protocol, so it cannot tell if a series of sessions were initiated by a single source or multiple sources\\.",
        "answer": "stateless",
        "question": "HTTP is a(n) stateless protocol, so it cannot tell if a series of sessions were initiated by a single source or multiple sources."
    },
    {
        "regex": "A\\(n\\) (.+?)?-party cookie is not set by the domain that houses the Web page displayed by the browser\\.",
        "answer": "third",
        "question": "A(n) third-party cookie is not set by the domain that houses the Web page displayed by the browser."
    },
    {
        "regex": "A\\(n\\) (.+?)? cookie is deleted when you close your browser\\.",
        "answer": "session",
        "question": "A(n) session cookie is deleted when you close your browser."
    },
    {
        "regex": "When a browser request is fulfilled, the Web server sends an HTTP (.+?)? code, such as 200\\.",
        "answer": "status",
        "question": "When a browser request is fulfilled, the Web server sends an HTTP status code, such as 200."
    },
    {
        "regex": "HTTP uses (.+?)? key encryption, which requires two keys: one to encrypt data and the other to decrypt it\\.",
        "answer": "public",
        "question": "HTTP uses public key encryption, which requires two keys: one to encrypt data and the other to decrypt it."
    },
    {
        "regex": "A search engine.s (.+?)? pulls keywords from a Web page and stores them in a database\\.",
        "answer": "indexer",
        "question": "A search engine’s indexer pulls keywords from a Web page and stores them in a database."
    },
    {
        "regex": "When you enter search terms, the search engine.s (.+?)? processor looks for the terms in the search engine.s database\\.",
        "answer": "query",
        "question": "When you enter search terms, the search engine’s query processor looks for the terms in the search engine’s database."
    },
    {
        "regex": "AND, OR, and NOT are examples of search (.+?)?.",
        "answer": "operators",
        "question": "AND, OR, and NOT are examples of search operators."
    },
    {
        "regex": "Most search engines keep track of users by assigning a unique ID number, which is stored in a\\(n\\) (.+?)? on the hard disk of the user.s device\\.",
        "answer": "cookie",
        "question": "Most search engines keep track of users by assigning a unique ID number, which is stored in a(n) cookie on the hard disk of the user’s device."
    },
    {
        "regex": "To keep track of the Web pages where you obtained information or images, you can highlight the Web page.s (.+?)?, copy it, and then paste it into a list of sources\\. \\(Hint: Use the acronym\\.\\)",
        "answer": "URL",
        "question": "To keep track of the Web pages where you obtained information or images, you can highlight the Web page’s URL, copy it, and then paste it into a list of sources. (Hint: Use the acronym.)"
    }
]