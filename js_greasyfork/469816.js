// ==UserScript==
// @name         Enough about Reddit already
// @version      0.1
// @namespace    https://greasyfork.org/users/19234
// @description  Hides posts with Reddit-related keywords from the main feed.
// @author       fiofiofio
// @match        https://kbin.social/*
// @match        https://fedia.io/*
// @grant        GM_log
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469816/Enough%20about%20Reddit%20already.user.js
// @updateURL https://update.greasyfork.org/scripts/469816/Enough%20about%20Reddit%20already.meta.js
// ==/UserScript==

(function() {
	
  var blacklist = ["reddit", "steve huffman", "spez", "r/"];
  
  const style = document.createElement('style');
  style.textContent = `
	.hide-post {padding:.5rem 2rem;}
	.hidden-note {margin-top:1rem; font-style:italic}
  `;
  document.head.appendChild(style);

  function hidePosts() {
    document.querySelectorAll("article").forEach(article => {
      const header = article.getElementsByTagName("header")[0].textContent;
      const description = article.getElementsByClassName("short-desc")[0].textContent;
      const magazineName = article.querySelector('.magazine-inline').getAttribute('title').toLowerCase();

		  if (checkText(header) || checkText(description) || checkMagazineName(magazineName)) {
			  let keywords = checkText(header)?.join(", ") || checkText(description)?.join(", ") || magazineName;
			  const noteClassName = "hidden-note";
        article.classList.add("hide-post");
			  article.classList.remove("entry");
			  article.innerHTML = `<p class="${noteClassName}">Post hidden containing keywords: ${keywords}</p>`;
		  }
    });
  }

  // Checks for the presence of words from the blacklist in the article header or description
  function checkText(string) {
    const matchedWords = blacklist.filter(word => string.toLowerCase().includes(word.toLowerCase()));
    return matchedWords.length > 0 ? matchedWords : null;
  }
  
  // Checks for the word 'reddit' in the magazine name
  function checkMagazineName(string) {
    const wordRegex = /reddit/i;
    return wordRegex.test(string);
  }

  // Wait for the document to load
  window.addEventListener('load', function() {
    // Call the function to add new options
    hidePosts();
  });
})();
