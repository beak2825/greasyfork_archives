// ==UserScript==
// @name          Highlight Keywords
// @namespace     HUSEIDON
// @version       1.0
// @description   Highlights predefined keywords with Ctrl+Right-Click options to manage keywords.
// @icon          https://raw.githubusercontent.com/huseidon/Highlight-Keywords-Userscript/refs/heads/huseidon/img/icon.svg
// @match         *://*/*
// @grant         GM_registerMenuCommand
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_listValues
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/511761/Highlight%20Keywords.user.js
// @updateURL https://update.greasyfork.org/scripts/511761/Highlight%20Keywords.meta.js
// ==/UserScript==

(async function() {
  'use strict';

  // Retrieve the keywords from storage
  async function getStoredKeywords() {
    return await GM_getValue("keywords", []);
  }

  // Save keywords to storage
  async function setStoredKeywords(keywords) {
    await GM_setValue("keywords", keywords);
  }

  // Retrieve the highlight color from storage
  async function getHighlightColor() {
    return await GM_getValue("highlightColor", "#5ae31b");
  }

  // Save the highlight color to storage
  async function setHighlightColor(color) {
    await GM_setValue("highlightColor", color);
  }

  // Function to highlight keywords
  async function THmo_doHighlight(el) {
    let keywords = await getStoredKeywords();
    let highlightColor = await getHighlightColor();

    if (!keywords.length) return; // No keywords to highlight if empty

    const rQuantifiers = /[-\/\\^$*+?.()|[\]{}]/g;
    const keywordPattern = keywords.map(k => k.replace(rQuantifiers, '\\$&')).join('|');
    const pat = new RegExp('(' + keywordPattern + ')', 'gi');
    const span = document.createElement('span');

    const snapElements = document.evaluate(
      './/text()[normalize-space() != "" ' +
      'and not(ancestor::style) ' +
      'and not(ancestor::script) ' +
      'and not(ancestor::textarea) ' +
      'and not(ancestor::code) ' +
      'and not(ancestor::pre)]',
      el, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null
    );

    if (!snapElements.snapshotItem(0)) return; // End execution if no text found

    for (let i = 0, len = snapElements.snapshotLength; i < len; i++) {
      const node = snapElements.snapshotItem(i);
      if (pat.test(node.nodeValue)) {
        if (node.className !== "THmo" && node.parentNode.className !== "THmo") {
          const sp = span.cloneNode(true);
          sp.innerHTML = node.nodeValue.replace(pat, `<span style="color: ${highlightColor}; font-weight: bold;" class="THmo">$1</span>`);
          node.parentNode.replaceChild(sp, node);
        }
      }
    }
  }

  // MutationObserver to catch dynamically added content
  const THmo_MutOb = window.MutationObserver || window.WebKitMutationObserver;
  if (THmo_MutOb) {
    const observer = new THmo_MutOb(async function(mutationSet) {
      for (let mutation of mutationSet) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          if (mutation.addedNodes[i].nodeType === 1) {
            await THmo_doHighlight(mutation.addedNodes[i]);
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Function to create a custom context menu
function createContextMenu(event, options) {
    // Remove any existing menu
    const oldMenu = document.getElementById("custom-context-menu");
    if (oldMenu) {
        oldMenu.remove();
    }

    // Create the new menu
    const menu = document.createElement("div");
    menu.id = "custom-context-menu";
    menu.style.position = "absolute";

    // Calculate the position ensuring the menu stays within viewport bounds
    let menuTop = event.clientY + window.scrollY;
    let menuLeft = event.clientX + window.scrollX;

    // Adjust if menu goes beyond viewport bounds
    if (menuTop + 150 > window.innerHeight + window.scrollY) { // Assuming the menu height is 150px
        menuTop = window.innerHeight + window.scrollY - 150;
    }
    if (menuLeft + 150 > window.innerWidth + window.scrollX) { // Assuming the menu width is 150px
        menuLeft = window.innerWidth + window.scrollX - 150;
    }

    menu.style.top = `${menuTop}px`;
    menu.style.left = `${menuLeft}px`;
    menu.style.backgroundColor = "#fff";
    menu.style.border = "1px solid #ccc";
    menu.style.zIndex = "1000";
    menu.style.padding = "10px";
    menu.style.boxShadow = "2px 2px 10px rgba(0,0,0,0.5)";
    menu.style.fontSize = "14px";

    // Add each option to the menu
    options.forEach(option => {
        const optionElement = document.createElement("div");
        optionElement.textContent = option.label;
        optionElement.style.padding = "5px";
        optionElement.style.cursor = "pointer";
        optionElement.onclick = option.action;
        optionElement.onmouseover = () => optionElement.style.backgroundColor = "#eee";
        optionElement.onmouseout = () => optionElement.style.backgroundColor = "#fff";
        menu.appendChild(optionElement);
    });

    // Append the menu to the document
    document.body.appendChild(menu);

    // Remove menu on outside click
    document.addEventListener("click", () => {
        menu.remove();
    }, { once: true });
}



  // Ctrl + Right Click to show the custom context menu
  document.addEventListener("contextmenu", async (event) => {
    if (event.ctrlKey) {  // Check if Ctrl key is pressed
      event.preventDefault();  // Prevent default right-click menu
      const selectedText = window.getSelection().toString().trim();
      if (selectedText) {
        createContextMenu(event, [
          {
            label: "Add Selected Text to Keywords",
            action: async () => {
              let keywords = await getStoredKeywords();
              if (!keywords.includes(selectedText)) {
                keywords.push(selectedText);
                await setStoredKeywords(keywords);
                alert(`Added "${selectedText}" to keywords.`);
                await THmo_doHighlight(document.body);
              } else {
                alert(`"${selectedText}" is already a keyword.`);
              }
            }
          },
          {
            label: "Remove Selected Text from Keywords",
            action: async () => {
              let keywords = await getStoredKeywords();
              const index = keywords.indexOf(selectedText);
              if (index > -1) {
                keywords.splice(index, 1);
                await setStoredKeywords(keywords);
                alert(`Removed "${selectedText}" from keywords.`);
                await THmo_doHighlight(document.body);
              } else {
                alert(`"${selectedText}" is not in the keyword list.`);
              }
            }
          }
        ]);
      }
    }
  });

  // Registering the original menu commands
  GM_registerMenuCommand("List Keywords", async () => {
    let keywords = await getStoredKeywords();
    alert(keywords.length > 0 ? `Keywords:\n${keywords.join("\n")}` : "No keywords found.");
  });

  GM_registerMenuCommand("Add Keyword", async () => {
    let keywords = await getStoredKeywords();
    let newKeyword = prompt("Enter a new keyword to add:");
    if (newKeyword) {
      newKeyword = newKeyword.trim();
      if (!keywords.includes(newKeyword)) {
        keywords.push(newKeyword);
        await setStoredKeywords(keywords);
        alert(`Keyword '${newKeyword}' added!`);
        await THmo_doHighlight(document.body);
      } else {
        alert(`Keyword '${newKeyword}' already exists.`);
      }
    }
  });

  GM_registerMenuCommand("Remove Keyword", async () => {
    let keywords = await getStoredKeywords();
    let removeKeyword = prompt("Enter the keyword to remove:");
    if (removeKeyword) {
      removeKeyword = removeKeyword.trim();
      const index = keywords.indexOf(removeKeyword);
      if (index > -1) {
        keywords.splice(index, 1);
        await setStoredKeywords(keywords);
        alert(`Keyword '${removeKeyword}' removed!`);
        await THmo_doHighlight(document.body);
      } else {
        alert(`Keyword '${removeKeyword}' not found.`);
      }
    }
  });

  GM_registerMenuCommand("Export Keywords", async () => {
    let keywords = await getStoredKeywords();
    if (keywords.length === 0) {
      alert("No keywords found to export.");
      return;
    }
    const blob = new Blob([keywords.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "keywords.txt";
    link.click();
    URL.revokeObjectURL(url);
  });

  GM_registerMenuCommand("Import Keywords", async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt";
    input.addEventListener("change", async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async function(e) {
        const text = e.target.result;
        const newKeywords = text.split("\n").map(k => k.trim()).filter(k => k);
        let storedKeywords = await getStoredKeywords();
        const combinedKeywords = [...new Set([...storedKeywords, ...newKeywords])];
        await setStoredKeywords(combinedKeywords);
        alert(`Imported ${newKeywords.length} keywords.`);
        await THmo_doHighlight(document.body);
      };
      reader.readAsText(file);
    });
    input.click();
  });

  GM_registerMenuCommand("Remove All Keywords", async () => {
    if (confirm("Are you sure you want to remove all keywords?")) {
      await setStoredKeywords([]);
      alert("All keywords removed.");
      await THmo_doHighlight(document.body);
    }
  });

  GM_registerMenuCommand("Change Highlight Color", async () => {
    let currentColor = await getHighlightColor();
    let newColor = prompt(`Enter a new highlight color (current: ${currentColor})`, currentColor);
    if (newColor) {
      newColor = newColor.trim();
      await setHighlightColor(newColor);
      alert(`Highlight color changed to ${newColor}!`);
    }
  });

  // Initial highlighting run
  await THmo_doHighlight(document.body);

  // Custom CSS for context menu
  GM_addStyle(`
    #custom-context-menu {
      font-family: Arial, sans-serif;
      border-radius: 5px;
    }
    #custom-context-menu div:hover {
      background-color: #f0f0f0;
    }
  `);

})();
