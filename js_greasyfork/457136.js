// ==UserScript==
// @name         Stack Pop
// @namespace    https://codeberg.org/happybits/stack-pop
// @license      MIT
// @version      1.3
// @description  Adds the first StackOverflow and/or Reddit answer to your search result
// @author       happybits
// @match        https://www.google.com/search*
// @icon
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/457136/Stack%20Pop.user.js
// @updateURL https://update.greasyfork.org/scripts/457136/Stack%20Pop.meta.js
// ==/UserScript==
 
// This is a userscript StackPop that is supposted to run by Tampermonkey when the user enters a google search
 
try {

    log("StackPop 1.3")

    let rso
    let stackPopDiv

    go()
 
    async function go() {
 
        // Wait for the google search to appear in the DOM
 
        rso = await waitFor("#rso")
 
        // Inject StackPop before the google search result
 
        stackPopDiv = document.createElement("div")
        stackPopDiv.id = "stack-pop"
        rso.before(stackPopDiv)
 
        // Find the first search result that leads to Stack Overflow
 
        insertIfFound(
            {
                urlStartWith: "https://stackoverflow.com",
                questionSelector: page => page.querySelector("h1").textContent,
                answerSelector: page => page.querySelector(".answer .s-prose").innerHTML,
            }
        )
 
        // Find the first search result that leads to Reddit
 
        insertIfFound(
            {
                urlStartWith: "https://www.reddit.com",
                questionSelector: page => page.querySelector("h1").textContent,
                answerSelector: page => page.querySelector(".Comment").querySelector(".RichTextJSON-root").innerHTML,
            }
        )
    }
 
    // Insert StackPop if part of the search result (ex StackOverflow or Reddit)
 
    function insertIfFound({ urlStartWith, questionSelector, answerSelector}) {
 
        const firstHit = firstLinkThatStartsWith(urlStartWith)
 
        // If any, get the answer inject it to the search page
 
        if (firstHit) {
 
            // HTTP call using Tampermonkey's built in function
 
            GM_xmlhttpRequest({
                method: "GET",
                url: firstHit,
                onload: function (response) {
 
                    // Build a DOM from the text-response and parse the question and the first answer
 
                    const page = new DOMParser().parseFromString(response.responseText, 'text/html');
                    const question = questionSelector(page) //  page.querySelector(questionSelector).textContent
                    const firstAnswerContent = answerSelector(page) // page.querySelector(answerSelector).innerHTML
 
                    // Create the StackPop widget
 
                    const widget = document.createElement("div")
 
                    const backgroundColor = "#f4ad25"
                    widget.innerHTML = `
 
                    <style>${stackPopStyling}</style>
 
                    <div style="border:solid 2px ${backgroundColor}; margin: 1em 0; overflow: auto;">
 
                        <a href="${firstHit}" style="text-decoration:none">
                            <div style="cursor:pointer; background-color:${backgroundColor}; color:white; padding:0.5em; font-size: 1.5em">
                                ${encodeHTMLEntities(question)}
                            </div>
                        </a>
 
                        <div style="padding:0 1.5em 0.5em 1.5em;">
                            ${firstAnswerContent}
                        </div>
 
                    </div>
                    `
 
                    // Add the possiblitiy to copy code to the clipboard
 
                    addCopyCodeButtons(widget)
 
                    // Add widget below
 
                    stackPopDiv.append(widget)
 
                }
            });
 
 
        }
 
 
    }
 
    // Add the possiblitiy to copy code to the clipboard
 
    function addCopyCodeButtons(element) {
        element.querySelectorAll("pre").forEach(preElement => {
 
            const elementHasCode = preElement.firstChild.nodeName.toLowerCase() === "code"
 
            if (elementHasCode) {
                const codeToCopy = preElement.querySelector("code").innerText
                preElement.append(copyIcon(codeToCopy))
            }
        });
    }
 
 
    // Get the first link in the Google search result area that starts with a specific string
 
    function firstLinkThatStartsWith(urlPart) {
 
        const googleResults = Array.from(rso.children)
 
        return googleResults
 
            .filter(result => result.querySelector("a")?.href)
            .map(result => result.querySelector("a").href)
            .find(link => link.startsWith(urlPart))
    }
 
 
    // CSS Styling for StackPop box
 
    const stackPopStyling = `
        #stack-pop {
            width: 700px;
        }
 
        #stack-pop li {
            margin-left: 1.5em;
            list-style: normal;
        }
 
        #stack-pop pre {
            background-color: #eee;
            padding: 1em;
            position:relative;
        }
 
        #stack-pop .copy-icon{
            position:absolute;
            right:4px;
            top:4px;
            height:33px;
            width:33px;
            opacity:0.5;
            cursor:pointer;
        }
 
        #stack-pop .copy-icon:hover{
            opacity:1;
        }
 
        #stack-pop code {
            background-color: #eee;
        }
 
        #stack-pop img {
            max-width: 100%;
        }
        `
 
    // This is a generic method that can be used to select element that may take some time to appear in the DOM
    // The second parameter "scope" is optional, of you want to limit the query
 
    function waitFor(selector, scope) {
 
        const pause = 10
        let maxTime = 10000
 
        return new Promise(resolve => {
 
            function inner() {
                if (maxTime <= 0) {
                    throw "Timeout for select " + selector
                }
                const element = (scope ?? document).querySelector(selector)
 
                if (element) {
                    resolve(element)
                    return
                }
                maxTime -= pause
                setTimeout(inner)
            }
 
            inner()
        })
    }
 
    // A simple log function which shows with a TAMPER-prefix
 
    function log(...message) {
        console.log('%c TAMPER ', 'color: white; background-color: #61dbfb', ...message);
    }
 
    // Create a copy icon (used for copying code to the clipboard)
 
    function copyIcon(textToCopyIfClicked) {
 
        const img = document.createElement("img")
        img.className = "copy-icon"
        img.title = "Copy to clipboard"
        img.src = "data:image/png;base64, UklGRvACAABXRUJQVlA4WAoAAAAYAAAANgAAOAAAQUxQSHcAAAABcFvbbtv8PdShEksNghW0QhpITnNIlfZxQAuQzgHofSJiAvCUhsXrQHiz2mvxq/vqBR+L7yM/aa14txZAkuJfErCWiCuaHCI3Y4k5zkHm/yXGICNpCCUcQhyAJAEkAWBzZ4xHFmfCeF7v1ZHua7xJ3bT4nDrCUwBWUDggcgEAAPAKAJ0BKjcAOQA+bTSURyQjIiEkGA2wgA2JaQDREEGjmANij+OeoAXWR7EsWPRzuwcNBgq5Du9vVd2+k2kGrGmAE1sdF3OpU0UbjJe/ni0mmBjpwOA3uZJ6569JAWP1AAD+9jeN+v4qM9kSG8dSMALfMGwGD3FF9bbU+gpg4WjBy3tfK842lgA0VyUMfZz3ElSaGGuqLqd12/tyU3fr9anAddYtAn7Xq0b+enT1NycxT2/vZZhOO115TWb5or5bBv4paaHUOH9/Dfp+YtanA+tAAX/tuyu604rmWOEPcP8R9t3tjaIIR7lPJZ3PPJRH/nkg4qbqeRmNratNGmpid+8s5svRhbwBZLf6tfLdlpNcUi0mx5pqaLkFtP6i72HM4z95hucWvXu4cLVz713xnMz6Bjph+AbuLAYAVq4aY/4n5Jz4sEaioamwCrwdqcgG7je6Yy7bftlFoh7itBFC/4434b5/dISkOBAdk5rlzMNJQABFWElG2AAAAElJKgAIAAAABgASAQMAAQAAAAEAAAAaAQUAAQAAAFYAAAAbAQUAAQAAAF4AAAAoAQMAAQAAAAMAAAAxAQIAEQAAAGYAAABphwQAAQAAAHgAAAAAAAAAo5MAAOgDAACjkwAA6AMAAHBhaW50Lm5ldCA0LjMuMTIAAAUAAJAHAAQAAAAwMjMwAaADAAEAAAABAAAAAqAEAAEAAAA3AAAAA6AEAAEAAAA5AAAABaAEAAEAAAC6AAAAAAAAAAIAAQACAAQAAABSOTgAAgAHAAQAAAAwMTAwAAAAAA=="
        img.onclick = () => copyTextToClipboard(textToCopyIfClicked)
        return img
    }
 
    // Copy text to clipboard (surprise)
 
    function copyTextToClipboard(text) {
 
        navigator.clipboard.writeText(text).then(function () {
            log('Copied to clipboard');
        }, function (err) {
            throw err
        });
    }
 
    // Encode and decode string to and from HTML
 
    function encodeHTMLEntities(rawStr) {
        return rawStr.replace(/[\u00A0-\u9999<>\&]/g, ((i) => `&#${i.charCodeAt(0)};`));
    }
 
    function decodeHTMLEntities(rawStr) {
        return rawStr.replace(/&#(\d+);/g, ((_, dec) => `${String.fromCharCode(dec)}`));
    }
 
 
    // Unexpected errors is shown in red
 
} catch (exception) {
    console.log('%c TAMPER ', 'color: white; background-color: red', exception);
}