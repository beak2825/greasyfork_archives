// ==UserScript==
// @name         Qwant AI Search Summary
// @version      1.0.2
// @description  Summarize Qwant search results using OpenRouter AI API.
// @author       yodaluca23
// @license      MIT
// @match        *://*.qwant.com/?q=*
// @match        *://*.qwant.com/?t=*&q=*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @require      https://unpkg.com/showdown/dist/showdown.min.js
// @require      https://unpkg.com/showdown-katex/dist/showdown-katex.js
// @namespace https://greasyfork.org/users/1315976
// @downloadURL https://update.greasyfork.org/scripts/538960/Qwant%20AI%20Search%20Summary.user.js
// @updateURL https://update.greasyfork.org/scripts/538960/Qwant%20AI%20Search%20Summary.meta.js
// ==/UserScript==
(function() {
  'use strict';

  const scriptURL = "greasyfork.org/scripts/538960";
  const scriptName = "Qwant Search AI Search Summary";

  // Enables various debug console logs
  const debugMode = false;

  // Empty summaryBox when loading
  const loadingHtml = '<div class="loading-spinner" style="display:flex; flex-direction:column; align-items:center;"><div class="loading-text"><b>AI Summary Loading...</b></div><div class="spinner-container"><div data-testid="async-ia-default-ghost" class="_1xQVj uorL9 G-2qb EaXmp _2Rxlw iVQuc"><div aria-label="Loader" class="pxKCg WTs4J nfGCH _1xQVj uorL9"><span></span><span></span><span></span></div></div>'

  // Default value so it doesn't error, but fetches summary on first time.
  var prevInfo = { "url": "https://www.example.com/?q=ABCDEFGHIJKLMNOPQRSTUVWXYZAHAHHAHAHAHHA", "html": loadingHtml};

  function findCached(lookingQuery) {
    const cache = GM_getValue("summaryCache", []);
    const entry = cache.find(entry => entry.query.toLowerCase() === lookingQuery.toLowerCase());

    if (entry) {
      entry.timestamp = Date.now();
      GM_setValue("summaryCache", cache);
    }

    return entry;
  }

  function removeOldestCache(cache, amount) {

    if (debugMode) console.log("Deleting, " + amount + " of the oldest items from cache.")

    for (let i = 0; i < amount && cache.length > 0; i++) {
      let minTimestampIndex = cache.reduce((minIndex, item, index, array) => {
        return item.timestamp < array[minIndex].timestamp ? index : minIndex;
      }, 0);
      cache.splice(minTimestampIndex, 1);
    }

    return cache;
  }

  // Function to add a new query to the cache
  function addToCache(html, query) {
    var cache = GM_getValue("summaryCache", []);
    const timestamp = Date.now();

    query = query.toLowerCase();

    // Function to actually add to the cache
    function doTheAdding() {
      cache.push({
          query,
          html,
          timestamp
      });

      // Set the new value
      GM_setValue("summaryCache", cache);
    }

    // Check if we need to remove the old cache first
    if (cache.length < GM_getValue("cacheSize", 15)) {
      doTheAdding();
    } else {
      cache = removeOldestCache(cache, 1);
      doTheAdding();
    }
  }

  // Use Showdown (https://github.com/showdownjs/showdown) to convert the response from markdown to HTML, then save to cache
  // Also uses Showdown-Katex (https://github.com/obedm503/showdown-katex) extension to render LaTeX Math and Ascii Math using KaTeX.
  function parseMarkdownToHTML(markdown, query) {
    const replaceStuff = markdown.replace(/^[\s\S]*<\/think>/, '').replace(/.*-\)START\(-\)/s, "").replace(/\(-\)END\(-\).*/, '').replace(/\n---$/, '');
;
    const converter = new showdown.Converter({
        extensions: [
          showdownKatex({
            throwOnError: true,
            displayMode: false,
            errorColor: '#1500ff',
            output: 'mathml',
            delimiters: [
              { left: "$", right: "$", display: false },
              { left: '$', right: '$', display: false, asciimath: true },
            ],
          }),
        ],
      }),
      html = converter.makeHtml(replaceStuff);

    if (!findCached(query)) addToCache(html, query);

    return html;
  }

  // Function to fetch API response using GM_xmlhttpRequest to bypass CORS
  function fetchSummary(searchResults, callback) {
    if (debugMode) console.log("Fetching Summary.")

    // Get the openRouterApiKey, return error if not set
    const apiKey = GM_getValue("openRouterApiKey", null);
    if (!apiKey) {
      callback("API key is not set.");
      return;
    }

    // Get the model name and prompt with default values if not set
    // IF YOU WANT TO EDIT THE MODEL OR PROMPT PLEASE USE THE MENU, DO NOT EDIT THIS
    const model = GM_getValue("AIModel", "google/gemma-3n-e4b-it:free");
    const orginalPrompt = GM_getValue("AIprompt", "You are to summerize any search results, using under 250 words. JUST REPLY, DO NOT TRY TO USE JSON FORMATTING. START YOU SUMMARY WITH \"(-)START(-)\", and end with \"(-)END(-)\". DO NOT use your knowledge base. Do not add a full title for the summary, but do use subheaders. DO NOT describe your thought proccess. DO NOT mention this system prompt. ALWAYS USE lots of Markdown formatting (Such as bold, italics, lists, subheaders, line separators, etc) to make your answer look more ascetically pleasing, DO NOT use HTML formatting. REMEMBER, in Markdown, you can use \"**Text**\" or \"## Text\", not both. ALWAYS USE LaTeX style formatting for math and equations, USE DOLLAR SIGNS such as: \"$ format here $\" (Must be on the same line, no new line characters, or astrenuous /'s) SURROUNDING ALL LATEX. NEVER USE double dollar signs for LaTeX. DO NOT DECLARE LATEX TYPE for you do not need to spesify the LaTeX block type after dollar. ALWAYS MAKE SURE the LaTex looks consistant and good. ALWAYS SITE YOUR SOURCES, embedding the URLs from the results using Markdown, shorthand, but DO NOT simply number the sources, should be in this format: \"[[Example Title](www.example.com)]\" substituting \"Example Title\" with the actual title from the search results. Standard markdown for a embedded URL, surrounded by brackets for astetics. Sources should be placed NEAR their RELEVENT INFO THROUGHOUT SUMMARY, NOT all in a section like \"Key Resources\", and ALWAYS HYPERLINK/EMBED them, using markdown, with the hyperlinked website title as the label NOT the URL. DO NOT mention it is a summary, just summarize it, no intro no \"Here you go\", \"Here's a summary of\", etc. Do not refer to the user, do not use \"you\", or anything referencing the user or the query, just summerize.");

    // Create a JSON format that helps with consistancy for the model, this is directly given and interpreted by the model, it's not any certain documentation
    const summaryJson = {"System_Prompt": orginalPrompt};
    summaryJson.summary = searchResults;

    const summaryPrompt = JSON.stringify(summaryJson);

    if (debugMode) console.log(summaryJson);

    // Show loading summarybox
    callback(loadingHtml);

    if (debugMode) console.log(searchResults);

    // Make the API request
    GM_xmlhttpRequest({
      method: "POST",
      url: "https://openrouter.ai/api/v1/chat/completions",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': scriptURL,
        'X-Title': scriptName,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        model: model,
        prompt: summaryPrompt
      }),
      onload: function(response) {

        // Parse the API response
        if (debugMode) console.log(response);
        try {

          // Extract the router's response
          const data = JSON.parse(response.responseText);
          if (debugMode) console.log(data);
          if (data.error) {
            callback(`Error from API: ${data.error.message}`);
          } else {

            // Extract the actual model response from multiple common places
            const summary = data.choices[0]?.message?.content || data.choices[0]?.text || "No summary available.\nError:\n" + JSON.stringify(data);

            // Use our formatting and MD > HTML function
            const formattedSummary = parseMarkdownToHTML(summary, searchResults.searchQuery);

            // Save it to our previous var.
            prevInfo.html = formattedSummary;

            // Display it using our callback
            callback(formattedSummary);
          }

        // Catch if anything goes wrong parsing, logging the error
        } catch (error) {
          console.error("Error parsing summary response:\n", error);
          callback("Failed to fetch summary. Parsing error.");
        }
      },

      // If anything goes wrong fetching, logging the error
      onerror: function(error) {
        console.error("Request failed:\n", error);
        callback("Failed to fetch summary. Request failed.");
      }
    });
  }

  // Append a notice that the content is AI generated
  function appendAINotice(htmlSummary) {
    htmlSummary = htmlSummary + `
      <hr>
      <div style="font-size: 12px; margin-top: 10px;">
          <strong>AI Summary:</strong> This content was summarized by Artificial Intelligence. Generative AI is experimental; check important information.
      </div>
      `;
    return htmlSummary;
  }

  // Function to scrape search results
  function scrapeSearchResults() {
    const results = document.querySelectorAll('[data-testid="webResult"]');
    const scrapedResults = [];

    // Get search query
    const searchBox = document.querySelector('[role="searchbox"]');
    const searchQuery = searchBox ? (searchBox.value || searchBox.textContent) : "No search query found";

    // Scrape each title, url, and description from each result, and add it to the JSON.
    results.forEach(result => {
      // Get all external linking elements
      const externalElem = result.querySelectorAll('a.external');

      // Title element is always 3rd, I think
      const titleElement = externalElem[3]

      // All the url elements have the same link, so doesn't really matter
      const urlElement = result.querySelector('a.external');

      // Parent includes both the description and title, description is second element
      const descElement = titleElement.parentElement.children[1]

      // Get the relevent information from the elements
      const title = titleElement ? titleElement.innerText.trim() : "No title found";
      const url = urlElement ? urlElement.href : "No URL found";
      const description = descElement ? descElement.innerText.trim() : "No description found";

      scrapedResults.push({
          title,
          url,
          description
      });
    });

    return { searchQuery, searchResults: scrapedResults };
  }

  function cleanSideBar() {
    function runCleanupIfReady() {
      const sidebar = document.querySelector("div.is-sidebar");

      if (sidebar) {
        // Only run cleanup if the sidebar has content (not just placeholders)
        const hasVisibleChildren = Array.from(sidebar.children).some(
          child => child.offsetParent !== null || child.innerHTML.trim() !== ""
        );

        if (!hasVisibleChildren) return; // Wait until sidebar has content

        // Remove elements with display: none
        const hiddenElements = sidebar.querySelectorAll('[style*="display: none"]');
        hiddenElements.forEach(el => el.remove());

        // Remove empty divs
        const emptyDivs = sidebar.querySelectorAll("div");
        emptyDivs.forEach(div => {
          if (div.childNodes.length === 0 && div.innerHTML.trim() === "") {
            div.remove();
          }
        });
      }
    }

    const observeSidebar = () => {
      const sidebar = document.querySelector("div.is-sidebar");
      if (sidebar) {
        // Observe for dynamic changes
        const observer = new MutationObserver(runCleanupIfReady);
        observer.observe(sidebar, { childList: true, subtree: true });

        // Try initial run (but only if ready)
        runCleanupIfReady();
      }
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", observeSidebar);
    } else {
      observeSidebar();
    }
  }

  // Create the summary box container
  function createsummaryBox(summaryText) {

    // Target the first (and only) element in the sidebar, as it is the one actually containing the seperate sections
    const sidebar = document.querySelector("div.is-sidebar");
    const targetElement = sidebar?.firstElementChild;

    // Check if it has loaded
    if (!targetElement) return;

    // Remove any existing loading spinner
    const existingsummaryBox = document.querySelector('.summary-container');
    if (existingsummaryBox) existingsummaryBox.remove();

    cleanSideBar()

    // Create the summarybox properties
    const summaryBox = document.createElement("div");
    summaryBox.className = "summary-container";
    summaryBox.style.position = "relative";
    summaryBox.style.width = "100%";
    summaryBox.style.minHeight = "100px";
    summaryBox.style.maxWidth = "600px";
    summaryBox.style.overflow = "hidden";
    summaryBox.style.display = "flex";
    summaryBox.style.flexDirection = "column";
    summaryBox.style.border = "1px solid #4A5059";
    summaryBox.style.borderRadius = "20px";
    summaryBox.style.backgroundColor = "transparent";
    summaryBox.style.color = window.matchMedia("(prefers-color-scheme: dark)").matches ? "#fff" : "#000";
    summaryBox.style.padding = "10px";
    summaryBox.style.fontFamily = "Arial, sans-serif";
    summaryBox.style.margin = "10px auto";

    // Create the container properties
    const summaryContainer = document.createElement("div");
    summaryContainer.style.flex = "1";
    summaryContainer.style.overflowY = "auto";
    summaryContainer.style.padding = "5px";

    // If it's the loading HTMl, directly insert it otherwise append the AI notice then insert.
    if (summaryText == loadingHtml) {
      summaryContainer.innerHTML = summaryText;
    } else {
      summaryContainer.innerHTML = appendAINotice(summaryText);
    }

    summaryBox.appendChild(summaryContainer);

    // Intert our summaryBox right above the last element in the sidebar ("Other Searches")
    const children = targetElement.children;
    const index = children.length - 1;
    targetElement.insertBefore(summaryBox, children[index]);


    // Dynamically adjust the height of the chat box
    const contentHeight = summaryContainer.scrollHeight;
    summaryBox.style.height = `${contentHeight + 30}px`;
  }

  // Monitor search results loading using MutationObserver, then fetch summary and inject summaryBox
  function waitForResultsAndSummarize() {
    const observer = new MutationObserver(() => {
      const searchResults = scrapeSearchResults();
      if (searchResults.searchResults.length > 0) {

        // Stop observing once results are loaded
        observer.disconnect();

        // Alert the user if somthing goes wrong
        const stringedResults = JSON.stringify(searchResults);
        if (stringedResults.includes("No title found") || stringedResults.includes("No URL found") || stringedResults.includes("No description found")) {
          const result = confirm("Qwant AI Search Summary:\nSome search result information not found!\nAI summary will be less accurate.\nPlease Report to:\n" + scriptURL + "/feedback\nWould you like to open the page now?")
          if (result) {
            window.open("https://" + scriptURL + "/feedback", '_blank');
          }
        }

        fetchSummary(searchResults, createsummaryBox);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Monitor search results loading using MutationObserver, then inject summaryBox with html param
  function waitForResultsAndInject(html) {
    const observer = new MutationObserver(() => {
      const searchResults = scrapeSearchResults();
      if (searchResults.searchResults.length > 0) {
        // Stop observing once results are loaded
        observer.disconnect();
        createsummaryBox(html)
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Function to handle settings menu
  function settingsMenu() {

    var toPromptWith = "Do you want to\n(1) Change AI Model?\n(2) Use a custom prompt?\n(3) Manage the summary cache?\n(4) Set a new API key?\n(5) Clear existing API key?\n(6)Reset setting preferences?\nEnter 1, 2, 3, 4, or 5:";

    const action = prompt(toPromptWith);

    if (action === "4") {
      const newApiKey = prompt("Please paste your new API key:");
      if (newApiKey) {
        GM_setValue("openRouterApiKey", newApiKey);
        alert("API key has been set.");
      } else {
        alert("Invalid choice.");
      }
    } else if (action === "5") {
      GM_deleteValue("openRouterApiKey");
      alert("API key has been removed.");
    } else if (action === "1") {
      var newModel;
      var modelChoice = prompt("Do you want to use\n(1) DeepSeek R1 (Deep Reasoning best results)?\n(2) Google Gemma 3n 4B (Faster Results)?\n(3) DeepSeek R1 Distill Llama (A Good Balance)\n(4) Custom AI Model?");
      if (modelChoice == "1") {
        newModel = "deepseek/deepseek-r1:free";
        return;
      } else if (modelChoice == "2") {
        newModel = "google/gemma-3n-e4b-it:free";
      } else if (modelChoice == "3") {
        newModel = "deepseek/deepseek-r1-distill-llama-70b:free";
      } else if (modelChoice == "4") {
        newModel = prompt("Enter the custom model.\nShould be in the form like \"deepseek/deepseek-r1-distill-llama-70b:free\"");
      } else {
        alert("Invalid choice.");
      }
      GM_setValue("AIModel", newModel);
      alert("AI model updated!");
    } else if (action === "6") {
      GM_deleteValue("AIModel");
      GM_deleteValue("AIprompt");
      alert("Setting preferences reset!");
    } else if (action === "2") {
      var newPrompt = prompt("What's the prompt?\nThe scraped search results will be added in a JSON, along with your prompt.");
      GM_setValue("AIprompt", newPrompt);
    } else if (action === "3") {
      const whatWithCache = prompt("Do you want to\n(1) Clear the summary cache?\n(2) Change max summary cache size?")
      if (whatWithCache == "1") {
        GM_deleteValue("summaryCache")
        alert("Summary cache has been removed.");
      } else if (whatWithCache == "2") {
        var cacheMaxSize = prompt("What do you want the max cache size to be? (Set to 0 to disable cache)");
        if (cacheMaxSize) {
          cacheMaxSize = parseInt(cacheMaxSize, 10);
          const oldMax = GM_getValue("cacheSize", 15)
          const oldLen = GM_getValue("summaryCache", []).length
          if (cacheMaxSize < 0){
            alert("Invalid choice.");
            return;
          } else if (cacheMaxSize == 0) {
            GM_deleteValue("summaryCache");
          } else if (cacheMaxSize < oldLen) {
            GM_setValue("summaryCache", removeOldestCache(GM_getValue("summaryCache", []),oldLen - cacheMaxSize));
          }
          GM_setValue("cacheSize", cacheMaxSize);
          alert("Max cache size has been set.");
        } else {
          alert("Invalid choice.");
        }
      } else {
        alert("Invalid choice.");
      }
    } else {
      alert("Invalid choice.");
    }
  }

  // Insert some more styles needed
  GM_addStyle(`
    .loading-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: #888;
    }
    .summary-container a {
      font-size: 0.7em;
      font-weight: 575;
  }`);

  // Register the settings menu
  GM_registerMenuCommand("Qwant Search Summary Settings", settingsMenu);

  // Initial call
  if (!injectIfCached(new URL(window.location.href).searchParams.get("q"))) waitForResultsAndSummarize();
  prevInfo.url = window.location.href;

  // Observe for page changes and check if already summerized
  function monitorPageChanges() {

    // Keep track of the URL
    let lastUrl = window.location.href;

    const observer = new MutationObserver(() => {

      cleanSideBar()

      // If it's a different URL
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;

        // Debug prints
        if (debugMode) console.log("Page URL changed, re-running summarization.");
        if (debugMode) console.log(prevInfo);

        const prevUrl = new URL(prevInfo.url);
        const currentURL = new URL(window.location.href);
        const currentQuery = currentURL.searchParams.get("q")

        if (debugMode) console.log("Current Query:\n" + currentQuery);

        // If same query then wait for things to load and inject the previous summary
        if ((prevUrl.searchParams.get("q") == currentQuery)) {
          waitForResultsAndInject(prevInfo.html);
          if (debugMode) console.log("Already summerized this url in this session.\n" + window.location.href + "\nInjecting HTML:\n" + prevInfo.html);
          prevInfo.url = window.location.href;
          return;
        }

        // Otherwise wait and summerize the new page
        // But first imediately reset the prevInfo as we don't need it anymore and for double page loads; doesn't inject old summary
        prevInfo.url = window.location.href;
        prevInfo.html = loadingHtml;

        // Check if the query is cached, and inject if it is
        const isCached = injectIfCached(decodeURIComponent(currentQuery));

        // Summerize new query
        if (!isCached) {
          if (debugMode) console.log("Did not summerize this url.\n" + window.location.href);
          waitForResultsAndSummarize();
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  function injectIfCached(currentQuery) {
    const cachedResult = findCached(currentQuery)
    if (cachedResult != null) {

      // Inject cached summary if it is
      if (debugMode) console.log("Summary is in the cache.\nInjecting HTML:\n" + cachedResult.html);
      waitForResultsAndInject(cachedResult.html);

      prevInfo.html = cachedResult.html;
      prevInfo.url = window.location.href;

      return true;
    }

    return false;
  }

  // Start monitoring for page changes
  monitorPageChanges();

})();