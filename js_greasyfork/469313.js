// ==UserScript==
// @name     Redirect lemmy links to home instance
// @description  Change links to use the context of the lemmy instance of your choosing and directly enable subscription and other user interactions.
// @version  1
// @grant    none
// @include  https://browse.feddit.de/
// @license  MIT
// @namespace https://greasyfork.org/users/1110144
// @downloadURL https://update.greasyfork.org/scripts/469313/Redirect%20lemmy%20links%20to%20home%20instance.user.js
// @updateURL https://update.greasyfork.org/scripts/469313/Redirect%20lemmy%20links%20to%20home%20instance.meta.js
// ==/UserScript==

var newDomain = 'https://feddit.de';  // Replace with your desired domain

var isLemmy = false;
try {
    isLemmy = document.head.querySelector("[name~=description][content]").content === "Lets you browse through all communities of the federated lemmy network";
} catch (_er) {
    // do nothing, isLemmy remains false
}

try {
    isLemmy = isLemmy || document.head.querySelector("[name~=Description][content]").content === "Lemmy";
} catch (_er) {
    // do nothing, isLemmy remains as is
}

var updateLinks = function() {
    var links = document.getElementsByTagName('a');
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        var href = link.getAttribute('href');
        var domain = window.location.host;
        if (href.startsWith('/')) {
            href = 'https://' + domain + href;
        }
        if (href && href.startsWith('https://') && !href.startsWith(newDomain)) {
            var parts = href.split('/');
            if(parts.length >= 5 && parts[3] === "c") {
                var newHref = newDomain + '/' + parts[3] + '/' + parts[4] + '@' + parts[2];
                link.setAttribute('href', newHref);
                link.setAttribute('title', '!' + parts[4] + '@' + parts[2]);
                var spanElement = link.querySelector("span");
                if (spanElement) {
                    spanElement.innerText = '!' + parts[4] + '@' + parts[2];
                }
            }
        }
    }
};

if (isLemmy) {
    window.onload = function() {
        updateLinks();
    };

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === "childList") {
                updateLinks();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}
