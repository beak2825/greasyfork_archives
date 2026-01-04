 // ==UserScript==
// @name         Bunpro Toolbox
// @version      1.6.0
// @description  Adds various search options from Japanese resources
// @author       Ambo100
// @match        *bunpro.jp/grammar_points/*
// @match        *bunpro.jp/learn*
// @grant        none
// @namespace    https://greasyfork.org/users/230700
// @changelog    Added button to open ChatGPT and copy a pre-made prompt to clipboard button (CAUTION: ChatGPT can be a helpful tool for language learning, but it's important to remember that its responses may contain inaccuracies or lack context.); Fixed Bunpro discussion links; Forced links to automatically reload when navigating through lessons using the page arrows;
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/418290/Bunpro%20Toolbox.user.js
// @updateURL https://update.greasyfork.org/scripts/418290/Bunpro%20Toolbox.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var currentGrammarPoint;
    var grammarDiv;
    var toolboxDiv;
    var booksDivContainer;

    window.addEventListener('load', function() {
        initialize();
    }, false);

    function initialize() {
        if (!toolboxDiv) {
            addToolbox();
        }
        addLinks();
        fixBrokenLinks();
    }

    function addToolbox() {
        currentGrammarPoint = document.getElementsByClassName("bp-ddw undefined")[0].innerText;
        grammarDiv = document.getElementsByClassName("grid grid-cols-1 gap-16 md:grid-cols-6")[0];

        if (!grammarDiv) {
            console.error("Grammar Div not found.");
            return;
        }

        toolboxDiv = document.createElement("section");
        toolboxDiv.classList.add('rounded', 'border', 'border-rim', 'bg-secondary-bg', 'h-full', 'md:col-span-6', 'p-24', );
        grammarDiv.prepend(toolboxDiv);
    }
    
    function addLinks() {
        clearToolbox();

        //DELETE FOR PUBLIC UPLOAD//
        // AddPDFLink("AIAIJ","file:///C:/Users/ambo1/OneDrive/Documents2/Japanese/AIAIJ.pdf");
        // AddPDFLink("DAJG","file:///C:/Users/ambo1/OneDrive/Documents2/Japanese/DAJG.pdf");
        // AddPDFLink("DBJG","file:///C:/Users/ambo1/OneDrive/Documents2/Japanese/DBJG.pdf");
        // AddPDFLink("Genki I 2nd Edition","file:///C:/Users/ambo1/OneDrive/Documents2/Japanese/Genki/Genki%20-%20Elementary%20Japanese%20I.pdf", "zoom=120");
        // AddPDFLink("Genki II 2nd Edition","file:///C:/Users/ambo1/OneDrive/Documents2/Japanese/Genki/Genki%20-%20Elementary%20Japanese%20II.pdf", "zoom=120");

        // Dictionaries, References
        addLink("Jisho", "https://jisho.org/search/");
        addLink("Wikitionary", "https://en.wiktionary.org/wiki/","#Japanese");
        addLink("Eijirou", "https://eow.alc.co.jp/search?q=","");

        addDivider();

        //YouTube
        addLink("YouGlish", "https://youglish.com/pronounce/","/japanese?");
        addLink("YouTube", "https://www.youtube.com/results?search_query=","+Japanese");

        addDivider();

        //Q&A, Communities
        addLink("Stack Exchange", "https://japanese.stackexchange.com/search?q=");
        addLink("HiNative", "https://hinative.com/en-US/search/questions?language_id=45&q=");
        addLink("Reddit", "https://www.reddit.com/r/LearnJapanese/search?q=","&restrict_sr=on&sort=relevance&t=all");
        addLink("WK Forum", "https://community.wanikani.com/search?q=","%20category%3A17");
        addBunproLink("Discussion");
        
        addDivider();

        addAiPrompt("ChatGPT");

    }
    
    /**
     * @global
     * @description Creates and adds a link to the toolbox with common styling.
     * @param {string} linkName Link Name
     * @param {string} linkURL URL of the link
     */
    function addStyledLink(linkName, linkURL) {
        const link = document.createElement('a');

        link.textContent = linkName;
        link.href = linkURL;
        link.target = '_blank';
        link.style.margin = '5px';
        link.classList.add(
            'inline-flex',
            'items-center',
            'justify-center',
            'py-4',
            'px-12',
            'rounded',
            'text-center',
            'border',
            'transition-colors',
            'border-secondary-fg',
            'bg-transparent',
            'bg-secondary-fg',
            'text-secondary-fg'
        );

        toolboxDiv.appendChild(link);
    }

    /**
     * @global
     * @description Adds a link using the common styling for external resources.
     * @param {string} linkName Link Name
     * @param {string} urlPrefix URL Prefix
     * @param {string} [urlSuffix] Optional URL suffix
     */
    function addLink(linkName, urlPrefix = '', urlSuffix = '') {
        const linkURL = `${urlPrefix}${currentGrammarPoint}${urlSuffix}`;
        addStyledLink(linkName, linkURL);
    }

    function addAiPrompt(modalName) {
        const link = document.createElement('button');

        link.textContent = modalName;
        link.style.margin = '5px';
        link.classList.add(
            'inline-flex',
            'items-center',
            'justify-center',
            'py-4',
            'px-12',
            'rounded',
            'text-center',
            'border',
            'transition-colors',
            'border-secondary-fg',
            'bg-transparent',
            'bg-secondary-fg',
            'text-secondary-fg'
        );

        let modalTitle = "CAUTION: ChatGPT can be a helpful tool for language learning, but it's important to remember that its responses may contain inaccuracies or lack context. \n\n AI PROMPT ADDED TO CLIPBOARD: \n\n"

        let promptText = `Create a detailed grammar guide for the Japanese grammar '${currentGrammarPoint}'. ` +
          `### Usage: Explain how and when to use it, including specific contexts and nuances. ` +
          `### Structure: Describe grammatical structure.'. ` +
          `### Examples: Include only three example sentences to illustrate the usage in different sentence structures. ` +
          `Examples: Use the structure [JAPANESE] [NEW LINE] [ENGLISH].` +
          `Examples: Use emojis as bullet points that are relevant to the content they accompany, ensuring they match the tone and context of each section. ` +
          `Examples: DO NOT USE ROMAJI OR FURIGANA IN EXAMPLES.`;

        toolboxDiv.appendChild(link);

          link.addEventListener('click', async function() {
            try {
                await navigator.clipboard.writeText(promptText);
                alert(modalTitle + promptText);
                
                var win = window.open('https://chat.openai.com/', '_blank');
                if (win) {
                    win.focus();
                } else {
                    alert('Please allow popups for this website');
                }
            } catch (error) {
                console.error('Failed to copy to clipboard:', error);
            }
        });
    
    }

    /**
     * @global
     * @description Adds a Bunpro link using the common styling.
     * @param {string} linkName Link Name
     */
    function addBunproLink(linkName) {
        let bunproGrammarForumLink = document.querySelector('a[href^="https://community.bunpro.jp/t/grammar-discussion/"]').getAttribute('href');

        if (bunproGrammarForumLink) {
            addStyledLink(linkName, bunproGrammarForumLink);
        } else {
            console.error("Discussion anchor not found.");
        }
    }

    /**
     * @global
     * @description Adds a vertical divider between links with set spacing.
     * @param {number} [padding=10] Measured in pixels (px).
     * @param {string} [dividerSymbol='|'] The symbol used for the divider.
     * @example // Standard 10px divider
     * addDivider();
     * @example // 30px divider with the character "-"
     * addDivider(30, "-");
     */
    function addDivider(padding = 10, dividerSymbol = '') {
        const divider = document.createElement('span');
        divider.style.padding = `${padding}px`;
        divider.textContent = dividerSymbol;
        toolboxDiv.appendChild(divider);
    }
    
    /**
     * @global
     * @description Clears all default links and dividers from the toolbox.
     */
    function clearToolbox(){
        toolboxDiv.innerHTML = "";
    }

    /**
     * @global
     * @description This function has three parameters, a PDF title, local PDF URL and a parameter for optional PDF parameters. </br></br>
     * <b>Warning</b> </br> This feature is experimental, modern browsers will block links to local URLs for security purposes.
     * An browser extension, such as this <a href="https://chrome.google.com/webstore/detail/enable-local-file-links/nikfmfgobenbhmocjaaboihbeocackld?hl=en">extension</a> for Google Chrome can enable this feature.
     * @param {string} pdfTitle The name of the linK, this must match exactly with the names used on Bunpro (excludes non alphanumeric characters).
     * @param {string} pdfURL The local URL of your PDF file. Must be preceeded with 'file://'
     * @param {string} [pdfParameters] May be used for adding additional PDF parameters
     * @example //Adds a link to the PDF that matches 'Genki II 2nd Edition'.
     * AddPDFLink("Genki II 2nd Edition","file:///C:/Users/YOUR_USER/Documents/GenkiElementaryII.pdf");
     * @example //Adds a link to the PDF that matches 'DAJB'.
     * AddPDFLink("DAJG","file:///C:/Users/YOUR_USER/Documents/DAJG.pdf");
     * @example //Adds a link to the PDF that matches 'AIAIJ', includes optional query to set zoom level.
     * AddPDFLink("AIAIJ","file:///C:/Users/YOUR_USER/Documents/AIAIJ.pdf", "zoom=120");
     */
    function addPDFLink(pdfTitle = '', pdfURL = '', pdfParameters = ''){
        if (!booksDivContainer) {
            booksDivContainer = document.getElementsByClassName("grammar-point__container--resources-card-main-text-new");
        }
        var regexBookTitle = new RegExp('(.*' + pdfTitle + '.*)','i');
        var regexPageNumber = new RegExp('Page\\s(\\d+)','i');

        for (var i = 0; i < booksDivContainer.length; i++) {
            var result = regexBookTitle.exec(booksDivContainer[i].innerText);

            if (result != null) {
                var bookPageNumberDiv = booksDivContainer[i].parentElement.getElementsByTagName('div')[1].innerText;
                var bookPageNumber = regexPageNumber.exec(bookPageNumberDiv);

                //Replace book title with link
                var pageLink = document.createElement("a");
                pageLink.setAttribute('href', pdfURL + "#page=" + bookPageNumber[1] + "&" + pdfParameters);
                pageLink.innerText = booksDivContainer[i].innerText.trim();
                booksDivContainer[i].textContent = "";
                booksDivContainer[i].appendChild(pageLink);
                booksDivContainer[i].innerHTML += " ";

                //Add link icon
                var externalLink = document.createElement("i");
                externalLink.classList.add("fas", "fa-external-link-alt");
                booksDivContainer[i].appendChild(externalLink);
            }   
        }
    }

    function fixBrokenLinks() {
        var links = document.getElementsByTagName("a");
        var regex = /^(http?:\/\/)[^.]+\.(jgram|tanos|99bako)(.+)$/i;
        for (var i = 0, iMax = links.length; i < iMax; i++) {
            links[i].href = links[i].href.replace(regex, "https://web.archive.org/web/" + links[i].href);
        }
    }

    // Detect URL changes and reinitialize when the URL changes
    var currentUrl = window.location.href;
    setInterval(function() {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            initialize();
        }
    }, 1000);
}
)();