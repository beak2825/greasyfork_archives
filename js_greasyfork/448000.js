// ==UserScript==
// @name         Download WSJ
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Lamonkey
// @author       Yiop
// @match        https://www.wsj.com/articles/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wsj.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448000/Download%20WSJ.user.js
// @updateURL https://update.greasyfork.org/scripts/448000/Download%20WSJ.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let download=function(filename,text){
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
    let extract_article = function(){
        let articles = []
        let paragraphs = document.getElementsByTagName("p");
        paragraphs.forEach(function(paragraph){
            if(paragraph.getAttribute("data-type") == 'paragraph'){
                articles.push(paragraph.textContent)
            }
        })
        return articles.join("\n")
    }
    //create download buttom
    let download_button = document.createElement("div")
    download_button.innerHTML = `
        <div id="dwn-btn-div">
            <button
                id="dwn-btn"
                type="button"
                class="css-1o2du8l-Button-PopoverButton"
            >
                <svg width="24" height="24" viewBox="0 0 363.025 363.024">
                    <path
                        fill="currentColor"
                        fill-rule="evenodd"
                        stroke="currentColor"
                        stroke-width="3"
                        d="M0,181.513c0,100.082,81.43,181.512,181.512,181.512c100.089,0,181.513-81.43,181.513-181.512
                        C363.025,81.424,281.601,0,181.512,0C81.43,0,0,81.424,0,181.513z M351.315,181.513c0,93.632-76.176,169.802-169.803,169.802
                        c-93.632,0-169.802-76.17-169.802-169.802c0-91.657,73.016-166.546,163.936-169.657L175.277,201.8l-32.958-32.958l-8.28,8.28
                        l47.065,47.064l47.88-47.885l-8.28-8.28l-33.722,33.723l0.374-189.893C278.285,14.955,351.315,89.841,351.315,181.513z"
                    />
                </svg>
                <span class="css-h39wql-PopoverButtonText">DOWNLOAD</span>
            </button>
        </div>
    `
    window.addEventListener('load', function() {
        //find a place for download buttom
        let all_buttons = document.getElementsByTagName("button")
        let text_button;
        all_buttons.forEach(function(button){
            if(button.textContent == "Text"){
                text_button = button
            }
        })
        //add the download buttom
        let wrapper = text_button.parentNode.parentNode
        wrapper.insertBefore(download_button,wrapper.childNodes[3])
        // Start file download.
        document.getElementById("dwn-btn").addEventListener("click", function(){
            // Generate download of hello.txt file with some content
            var text = extract_article()
            var filename = document.getElementsByTagName("h1")[0].textContent;

            download(filename, text);
        }, false);
    }, false);

})();