// ==UserScript==
// @name        FIMFiction - Unify Typography Style
// @namespace   Selbi
// @include     http*://*fimfiction.net/story/*/*/*
// @include     http*://*fimfiction.net/chapter/*
// @version     1.4
// @grant       none
// @description Replaces all standard quotation marks, apostrophes, ellipsis, and line breaks with typographically “proper” variations
// @downloadURL https://update.greasyfork.org/scripts/411691/FIMFiction%20-%20Unify%20Typography%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/411691/FIMFiction%20-%20Unify%20Typography%20Style.meta.js
// ==/UserScript==

(function() {
  "use strict";
  
  const TAG_PLACEHOLDER = "<$€%>"; // This'll do, hopefully
  
  let paragraphs = document.querySelectorAll("#chapter-body > div > *");  
  for (let p of paragraphs) {
    // Skip images
    if (p.childElementCount == 0 || p.textContent.trim().length > 0) {
      if (p.outerHTML.match(/^\s*<br\s?\/?>\s*/)) {
        // Remove useless linebreaks
        p.parentElement.removeChild(p);
      } else if (p.textContent.match(/^\s*((\-|\_|\*|\=)\s*){3,}\s*$/gm)) {
        // Pretty chapter breaks (***** -> <hr/>)
        p.innerHTML = "<hr/>";
      } else {
        // Strip the innerHTML of any tags (and back them up) so we won't interfere with anything inside them
        let text = p.innerHTML;
        let tagBackups = [];
        for (let match of text.matchAll(/<.*?>/g)) {
          tagBackups.push(match);
          text = text.replace(match, TAG_PLACEHOLDER);
        }
        
        // Apply the regex replacements to the text
        text = text
          // Remove excess spacing ("    " -> " ")
          .replace("\s{2,}", " ") 

          // Curly apostrophes (it's -> it’s)
          .replace(/\b\'\b/g, "’") 

          // Curly quotation marks, single and double ("Hello!" -> “Hello!”)
          .replace(/(["“”])([^(\"|\“|\”)]*)(["“”])/g, "“$2”") 
          .replace(/(\W)(['‘’])([^(\'|\‘|\’)]*)(['‘’])(\W)/g, "$1‘$3’$5")

          // Curly quotation marks on cut-off words (lookin' good -> lookin’ good)
          .replace(/\b\'\s/g, "’ ") 
          .replace(/\s\'\b/g, " ‘") 

          // Unicode ellipsis for regular ellipsis and spaced ellipsis (. . . -> …)
          .replace(/\s*\.\s?\.\s?\.(\s?)/g, "…$1")

          // Missing spaces after punctuation ("he said.Then" -> "he said. Then")
          .replace(/([a-z]{2,}[.,!?…])(\w|“)/g, "$1 $2")

          // Replace dashes were appropriate with em-dashes (-- -> —)
          .replace(/(\s–\s|\s?—\s?|\s-\s|\s?-{2,4}\s?)/g, "—");
        
        
        // Restore the content inside the tags
        for (let backup of tagBackups) {
          text = text.replace(TAG_PLACEHOLDER, backup);
        }
        
        // Write the results
        p.innerHTML = text;
      }
    }
  }
})();
