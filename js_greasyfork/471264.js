// ==UserScript==
// @name         MagicScraper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Scrapes and displays data from the web page based on rules.
// @author       aolko
// @match        *://*/*
// @grant        GM_addStyle
// ==/UserScript==

function magicScraper(rules, options = {}) {
    
  let scrapedData = {}; // Variable to store the scraped data
    
  function createDOMFromScrapedData(data, element, keepChildren) {
    for (const key in data) {
      if (Array.isArray(data[key])) {
        data[key].forEach(item => {
          const newElement = document.createElement(element.tagName);
          newElement.innerHTML = item;

          if (keepChildren && element.children.length > 0) {
            Array.from(element.children).forEach(child => {
              newElement.appendChild(child);
            });
          }

          element.appendChild(newElement);
        });
      } else if (typeof data[key] === 'string') {
        const newElement = document.createElement(element.tagName);
        newElement.innerHTML = data[key];

        if (keepChildren && element.children.length > 0) {
          Array.from(element.children).forEach(child => {
            newElement.appendChild(child);
          });
        }

        element.appendChild(newElement);
      } else if (typeof data[key] === 'object') {
        const newElement = document.createElement(element.tagName);
        element.appendChild(newElement);
        createDOMFromScrapedData(data[key], newElement, keepChildren);
      }
    }
  }

  function matchPageOrDomain(pattern, current) {
    const escapedPattern = pattern.replace(/\./g, '\\.');
    const regex = new RegExp(`^${escapedPattern.replace('*', '.*')}$`, 'i');
    return regex.test(current);
  }

  function scrapeDataByRules(rulesObj, currentDomain, currentPage) {
    const domainKeys = Object.keys(rulesObj);
    let domainData = {};
    let pageData = {};

    for (const domainPattern of domainKeys) {
      if (matchPageOrDomain(domainPattern, currentDomain)) {
        domainData = rulesObj[domainPattern];
        break;
      }
    }

    if (currentPage && domainData.pages) {
      pageData = domainData.pages[currentPage] || {};
    }

    return Object.assign({}, domainData, pageData);
  }

  function loadExternalRules(externalRulesURL, currentDomain, currentPage, callback) {
    fetch(externalRulesURL)
      .then(response => response.json())
      .then(data => {
        const rulesObj = data.rules || {};
        const scrapedData = scrapeDataByRules(rulesObj, currentDomain, currentPage);
        callback(scrapedData);
      })
      .catch(err => {
        console.error('Error loading external rules:', err);
        callback({});
      });
  }

  function runScraping() {
    const currentDomain = window.location.hostname;
    const currentPage = window.location.pathname;

    let pageRules;

    if (typeof rules === 'string') {
      // Load external rules if the rules parameter is a URL string
      loadExternalRules(rules, currentDomain, currentPage, scrapedData => {
        pageRules = scrapedData;
        handleRules(pageRules);
      });
    } else {
      pageRules = scrapeDataByRules(rules, currentDomain, currentPage);
      handleRules(pageRules);
    }
  }

  function handleRules(pageRules) {
    if (Object.keys(pageRules).length === 0) {
      console.warn('No rules found for the current domain and page.');
      return;
    }

    const fragment = document.createDocumentFragment();
    const temporaryData = {};

    // Helper function to process nested rules
    function processNestedRules(rules, currentElement) {
      for (const key in rules) {
        const selector = rules[key];

        if (typeof selector === 'string') {
          // Handle single selector
          const elements = currentElement.querySelectorAll(selector);
          temporaryData[key] = Array.from(elements).map(element => {
            return {
              text: element.textContent,
              html: element.innerHTML,
            };
          });
        } else if (typeof selector === 'object') {
          // Handle nested rules recursively
          temporaryData[key] = [];
          const nestedElements = currentElement.querySelectorAll(key);
          nestedElements.forEach(nestedElement => {
            temporaryData[key].push({});
            processNestedRules(selector, nestedElement);
          });
        }
      }
    }

    // Process the top-level rules
    processNestedRules(pageRules, document);

    createDOMFromScrapedData(temporaryData, fragment, options.keepChildren);

    if (options.replaceBody) {
      document.body.innerHTML = '';
      document.body.appendChild(fragment);
    }

    // Store the scraped data in the variable
    scrapedData = temporaryData; // Update the correct variable with the scraped data
  }
  
  runScraping();
  
  // Expose the scraped data object for further use
  return scrapedData;
}