// ==UserScript==
// @name            Google Drive Direct Links To Clipboard
// @version         1.0
// @description     Direct link to clipboard for Google Drive
// @author          Rémy Pottier
// @match           *://drive.google.com/*
// @grant           none
// @namespace       https://greasyfork.org/users/1195172-remypottierfr
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/477361/Google%20Drive%20Direct%20Links%20To%20Clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/477361/Google%20Drive%20Direct%20Links%20To%20Clipboard.meta.js
// ==/UserScript==

// CHeck for dom mutations on right click
var observer = new MutationObserver(function(mutations) {

    // Mutations loop
    mutations.forEach(function(mutation) {
        for (var i = 0; i < mutation.addedNodes.length; i++) {
            var node = mutation.addedNodes[i];

            if (node.dataset.target === 'linkBubble') {
                var link = node.getElementsByTagName('input')[0];
                var directLink = link.cloneNode(true);
                directLink.classList.remove('H-qa-A-zt');
                directLink.value = 'https://drive.google.com/uc?id='+ node.parentNode.dataset.id;
                directLink.onclick = function() { this.select(); };
                var label = document.createElement('p');
                label.style.cssText = "margin-top: 0px; margin-bottom: 0px;";
                label.textContent = 'Direct link:';
                link.parentNode.insertBefore(directLink, link.nextSibling);
                link.parentNode.insertBefore(label, link.nextSibling);
                break;
            }
            else setClickEvent(node);
        }
    });
});
// Find all contents
var content = document.getElementById('drive_main_page');
if (content) observer.observe(content, { childList: true, subtree: true });

function setClickEvent(elem) {
    if (elem.classList && (elem.classList.contains('WYuW0e'))) {
        elem.addEventListener('contextmenu', adjustMenu);
    }
    else {
        for (var i = 0; i < elem.children.length; i++) {
            setClickEvent(elem.children[i]);
        }
    }
}

function adjustMenu() {
    var file = this;

    setTimeout(function() {
        var menus = document.getElementsByClassName('h-w');

        for (var i = 0; i < menus.length; i++) {
            var menu = menus[i];
            if (menu.style.display !== 'none') {
                var existing = document.getElementById('DLID');
                if (existing) existing.remove();

                var container = menu.children[0];
                var preview = Array.from(container.querySelectorAll('.h-v')).find((node) => node.style.display !== 'none');
                var clone = preview.cloneNode(true);
                clone.id = 'DLID';
				clone.style.display = 'block';
				clone.className = 'h-v';
                clone.getElementsByClassName('a-v-T')[0].innerHTML = 'Copy the direct link';

                clone.onmouseleave = clone.onmouseenter = function() {
                    this.classList.toggle('h-v-pc');
                };
                // Finally add it to clipboard on click
                clone.onclick = function() {
                    navigator.clipboard.writeText('https://drive.google.com/uc?id='+ file.dataset.id);
                };

                container.insertBefore(clone, preview.nextSibling);
                break;
            }
        }
    });
}