// ==UserScript==
// @name         Medium: Editor For Programmers
// @namespace    https://github.com/Zren/
// @version      5
// @description  Use `code` for inline code. Automatically fix quotes in code tags. Link to a section of text easily.
// @author       Zren
// @icon         https://medium.com/favicon.ico
// @match        https://medium.com/p/*/edit
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21245/Medium%3A%20Editor%20For%20Programmers.user.js
// @updateURL https://update.greasyfork.org/scripts/21245/Medium%3A%20Editor%20For%20Programmers.meta.js
// ==/UserScript==

(function(){
    function wrapInlineCode() {
        var sel = window.getSelection();
        if (sel.type === 'Caret' && sel.focusNode.nodeName === "#text") {
            // Note: Does not trigger if first character in text node, since the focus isn't a Text node.
            
            
            //var tagBefore = '<code class="markup--code' + (sel.focusNode.parentNode.tagName === 'P' ? 'markup--p-code' : '') + '"><strong class="markup--strong markup--code-strong">';
            //var tagAfter = '</strong></code>';
            //var tagBefore = '<code class="markup--code' + (sel.focusNode.parentNode.tagName === 'P' ? 'markup--p-code' : '') + '">';
            var tagBefore = '<code>';
            var tagAfter = '</code>';
            
            var str = sel.focusNode.nodeValue;
            var before = str.substr(0, sel.focusOffset - 1);
            var after = str.substr(sel.focusOffset);
            console.log("Before: ", before);
            console.log("After: ", after);
            var index = before.lastIndexOf('`');
            if (index >= 0) {
                // we just typed the right quote
                if (index === before.length-1) {
                    // ``
                    // Ignore
                } else {
                    // `...`
                    var range = document.createRange();
                    range.setStart(sel.focusNode, index);
                    range.setEnd(sel.focusNode, sel.focusOffset);
                    sel.removeAllRanges();
                    sel.addRange(range);
                    var html = range.toString();
                    html = html.substr(1, html.length-2); // trim ``
                    html = tagBefore + html + tagAfter + ' ';
                    document.execCommand('insertHTML', false, html);
                    range.collapse(false); // move cursor to end
                    return;
                }
            }
            var index = after.indexOf('`');
            if (index >= 0) {
                // we just typed the left quote
                if (index == 0) {
                    // ``
                    // Ignore
                } else {
                    var range = document.createRange();
                    range.setStart(sel.focusNode, sel.focusOffset - 1);
                    range.setEnd(sel.focusNode, sel.focusOffset + index + 1);
                    sel.removeAllRanges();
                    sel.addRange(range);
                    var html = range.toString();
                    html = html.substr(1, html.length-2); // trim ``
                    html = tagBefore + html + tagAfter + ' ';
                    document.execCommand('insertHTML', false, html);
                    range.collapse(false); // move cursor to end
                    return;
                }
            }
        }
    }
    
    function alwaysBrInPre(e) {
        var sel = window.getSelection();
        if (sel.type === 'Caret' && sel.focusNode.nodeName === "#text") {
            console.log(sel.focusNode.nodeValue.length, sel.focusOffset, sel.focusNode.nodeValue.substr(sel.focusOffset), sel.focusNode);
            if (sel.focusOffset !== 0) return; // End of line = selecting start of next line.

            // Focused on start of line.
            var el = sel.focusNode;
            while (el) {
                if (!el.parentNode) break; // Don't run on #document element since it doesn't have el.hasAttribute
                if (el.classList && el.classList.contains('section-inner')) break; // Ignore everything outside the post itself.
                if (el != el.parentNode.firstChild) break; // Only match end of line = start of next line.
                if (el.parentNode.tagName == 'PRE') {
                    // Insert linebreak <br>
                    
                    var secondPre = el.parentNode;
                    var firstPre = secondPre.previousSibling;
                    
                    firstPre.appendChild(document.createElement('br')); // <br> removed during split
                    firstPre.appendChild(document.createTextNode(''));
                    var newFocusLine = document.createElement('br');
                    firstPre.appendChild(newFocusLine); // The actual <br> we wanted to enter.
                    
                    // Move all elements back into the first pre.
                    while (secondPre.firstChild) {
                        firstPre.appendChild(secondPre.firstChild);
                    }
                    
                    // Delete the second <pre>
                    // We can't remove it since it will break the entire editor...
                    secondPre.appendChild(document.createElement('br'));
                    //secondPre.remove();
                    //document.execCommand('delete');
                    
                    // Move cursor to new line.
                    var range = document.createRange();
                    range.setStart(newFocusLine, 0);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                    
                    e.preventDefault();
                }
                el = el.parentNode;
            }
        }
    }

    function onKeyDown(e) {
        if (e.key === '`') {
            setTimeout(wrapInlineCode, 100); // Wait for ` to be written so we can replace it
        } else if (e.keyCode == 9) { // Tab
            e.preventDefault();
        } else if (e.keyCode == 13) { // Enter
            alwaysBrInPre(e);
        } else if (e.key == '6' && e.ctrlKey && e.altKey) {
            console.log('CTRL+ALT+6', e);
        } else {
            console.log('Key:', e.key, e.ctrlKey, e.altKey);
        }
    }
    
    function fixQuotes() {
        // Fix quotes in <pre> and <code> tags.
        setInterval(function(){
            var codeTags = document.querySelectorAll('pre, code');
            for (var tag of codeTags) {
                if (tag.innerHTML.indexOf('“') >= 0 || tag.innerHTML.indexOf('”') >= 0 || tag.innerHTML.indexOf('‘') >= 0 || tag.innerHTML.indexOf('’') >= 0) {
                    tag.innerHTML = tag.innerHTML.replace('“', '"').replace('”', '"').replace('‘', '\'').replace('’', '\'');
                }
            }
        }, 1000);
    }
    
    function showPermalink() {
        // Setup (temporary) permalink to line.
        var tag = document.createElement('a');
        tag.style.position = 'absolute';
        tag.style.display = 'block';
        tag.style.top = '-9999px';
        tag.style.left = 0;
        tag.style.color = '#888';
        tag.innerHTML = '¶'; //'[link]';
        document.body.appendChild(tag);

        function onMouseOver(e) {
            var el = e.relatedTarget || e.target;
            while (el) {
                if (!el.parentNode) break; // Don't run on #document element since it doesn't have el.hasAttribute
                if (el.classList.contains('section-inner')) break; // Ignore everything outside the post itself.
                if (el.hasAttribute('name')) {
                    showTag(el)
                    break;
                }
                el = el.parentNode;
            }
        }
        function showTag(el) {
            var rect = el.getBoundingClientRect();
            var url = document.querySelector('link[rel="canonical"]').href;
            url = url.substr(0, url.length - '/edit'.length);
            url += '#' + el.getAttribute('name');
            tag.href = 'javascript:window.history.replaceState({}, "", "' + url + '")';
            var tagGuide = document.querySelector('.section-inner');
            var tagGuideRect = tagGuide.getBoundingClientRect();
            var tagRect = tag.getBoundingClientRect();
            tag.style.left = '' + (tagGuideRect.left + window.scrollX - tagRect.width - 60) + 'px';
            tag.style.top = '' + (rect.top + window.scrollY) + 'px';
        }

        var taggedElements = document.querySelectorAll('.postArticle-content');
        for (var el of taggedElements) {
            //el.addEventListener('mouseover', onMouseOver, true);
            el.addEventListener('click', onMouseOver, true);
        }
    }
    
    function onLoad() {
        // Bind keys
        var main = document.querySelector('main[contenteditable="true"]');
        main.addEventListener('keydown', onKeyDown, true);
        
        fixQuotes();
        showPermalink();
    }

    function waitForLoad() {
        var main = document.querySelector('main[contenteditable="true"]');
        if (main) {
            onLoad();
            console.log('[Medium: Markdown] Loaded');
        } else {
            setTimeout(waitForLoad, 100);
        }
    }
    setTimeout(waitForLoad, 100);
})();

