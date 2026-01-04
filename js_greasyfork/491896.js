// ==UserScript==
// @name         Copy Text and HTML to Clipboard
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @description  library to copy plain and html MIME types to the clipboard
// @author       escctrl
// @version      2.0
// @grant        none
// @license      MIT
// ==/UserScript==

// solution for setting richtext clipboard content found at https://jsfiddle.net/jdhenckel/km7prgv4/3/
// and https://stackoverflow.com/questions/34191780/javascript-copy-string-to-clipboard-as-text-html/74216984#74216984

/* different modes for copying:
 * txt = only plaintext = when a text or url should never be formatted, even if the target supports richtext
 * fmt = visible HTML (MIME are same) = when richtext programs should paste formatted text (chat), and plaintext fields should paste the HTML (Ao3 comments)
 *       invisible HTML (MIME differ) = when richtext programs should paste formatted text, but if the program doesn't support it (e.g. Notepad), copy some other plain text (no HTML visible)
 */

function copy2Clipboard(e, mode, plain, html=null) {
    
    if (!plain) { // stop if null, undefined, or "". we always expect plaintext content as a minimum
        console.log('Copying to Clipboard failed: no text was given to copy');
        return;
    }
    
    // if no separate html content is given but html MIME is supposed to be filled, we reuse the plain content
    if (mode === "fmt" && !html) html = plain;
    
    // trying first with the new Clipboard API
    try {
        let clipboardItem;
        // 'only plaintext' mode does not provide the text/html MIME type so it can't be used by richtext programs
        if (mode === "txt") clipboardItem = new ClipboardItem({ 'text/plain': new Blob([plain], {type: 'text/plain'}) });
        else clipboardItem = new ClipboardItem({ 'text/html':  new Blob([html], {type: 'text/html'}),
                                                 'text/plain': new Blob([plain], {type: 'text/plain'}) });
        
        navigator.clipboard.write([clipboardItem]);
    }
    // fallback method in case clipboard.write is not enabled - especially in Firefox it's disabled by default
    // to enable, go to about:config and turn dom.events.asyncClipboard.clipboardItem to true
    catch(err) {
        function listener(e) {
            e.clipboardData.setData("text/plain", plain);
            if (mode === "fmt") e.clipboardData.setData("text/html", html);
            
            e.preventDefault();
        }
        document.addEventListener("copy", listener);
        document.execCommand("copy");
        document.removeEventListener("copy", listener);
    }
}