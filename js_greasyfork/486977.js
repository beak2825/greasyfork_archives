// ==UserScript==
// @name              🌺 Clean ChatGPT
// @name:pl           🌺 Clean ChatGPT
// @namespace         https://greasyfork.org/pl/users/1081704-nameniok
// @version           1.2.5
// @author            Nameniok
// @description       Cleaner and better ChatGPT 3.5
// @description:pl    Czystszy i lepszy ChatGPT 3.5
// @run-at            document-start
// @match             https://chatgpt.com/*
// @grant             none
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/486977/%F0%9F%8C%BA%20Clean%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/486977/%F0%9F%8C%BA%20Clean%20ChatGPT.meta.js
// ==/UserScript==

// Cleaner ui //
function removeElements() {
    var elementsToRemove = [
        ".to-gray-900.from-gray-900\\/0.bg-gradient-to-t.h-24",
        ".uppercase.rounded-md.md\\:text-sm.text-xs.px-1\\.5.py-0\\.5.text-yellow-900.bg-yellow-200",
        ".border-white\\/20.border.flex-shrink-0.mb-1.text-sm.rounded-md.gap-3.items-center.px-3.py-3.flex.kgold",
        ".py-3.px-4.bg-gray-900",
        "span.uppercase.rounded-md.md\\:text-sm.text-xs.px-1\\.5.py-0\\.5.text-yellow-900.bg-yellow-200",
        "#kcg",
        ".pt-2.pb-3",
        ".space-y-2.flex-col.flex",
        ".w-\\[72px\\].h-\\[72px\\].mb-3",
        ".font-medium.text-2xl.mb-5",
        // Upgrade button
        ".px-2.rounded-lg.m-0.hover\\:bg-token-sidebar-surface-secondary.radix-disabled\\:opacity-50.radix-disabled\\:pointer-events-none.focus\\:ring-0.cursor-pointer.text-sm.p-2\\.5.gap-2.flex.group",
        // Upgrade button on smaller width
        "div.\\!pr-3.group.radix-disabled\\:opacity-50.radix-disabled\\:pointer-events-none.hover\\:bg-token-main-surface-secondary.focus\\:ring-0.cursor-pointer.text-sm.p-2\\.5.rounded.m-1\\.5.gap-2.flex:nth-of-type(2)",
        ".justify-center.md\\:gap-2.gap-0.md\\:mb-4.md\\:m-auto.md\\:w-full.ml-1.flex.h-full > .grow",

        ".text-token-text-tertiary > .mt-2",
        ".md\\:mt-14.relative",
        ".w-12.h-12.mb-6",
        ".w-12.h-12",
        ".pr-1.gap-2.flex",
        // Invite members button
        ".rounded-lg.hover\\:bg-token-sidebar-surface-secondary.radix-disabled\\:opacity-50.radix-disabled\\:pointer-events-none.focus\\:ring-0.cursor-pointer.text-sm.p-2\\.5.gap-2.flex.group",
        //
        // Archive small button (new update - 3 dots next to saved chat)
        //".flex.pr-2.gap-1\\.5.items-center.top-0.right-0.bottom-0.absolute > span > .radix-state-open\\:text-token-text-secondary.hover\\:text-token-text-secondary.transition.text-token-text-primary.justify-center.items-center.flex",
        //".flex.items-center.justify-center.text-token-text-primary.transition.hover\\:text-token-text-secondary.radix-state-open\\:text-token-text-secondary > svg",
        //

      /*
      // CLEANER - Chat history not visible with this
        //".justify-center.items-center.flex-col.h-full.flex",
        //".text-token-text-primary.justify-center.items-center.flex-col.h-full.flex",
      */

      /*
      // MEGA CLEAN
        ".ml-2.focus\\:ring-0.border-token-border-medium.border.rounded-lg.whitespace-nowrap.justify-center.items-center.w-9.h-9.flex.btn-small.btn-neutral.relative.btn",
        ".bg-token-sidebar-surface-primary.overflow-x-hidden.flex-shrink-0",
        ".justify-center.items-center.w-8.h-\\[72px\\].flex",
        ".z-40.top-1\\/2.left-0.fixed",
        "#headlessui-portal-root > div > div > .relative",
        ".active\\:opacity-50.focus\\:ring-white.focus\\:ring-inset.focus\\:ring-2.focus\\:outline-none.hover\\:text-token-text-primary.rounded-md.justify-center.items-center.w-10.h-10.inline-flex.-mt-0\\.5.-ml-0\\.5.left-0.absolute",
     */

        ".md\\:px-\\[60px\\].text-token-text-secondary.text-xs.text-center.py-2.px-2.relative > span"
    ];
    elementsToRemove.forEach(function(selector) {
        var elements = document.querySelectorAll(selector);
        elements.forEach(function(element) {
            element.remove();
        });
    });
    setTimeout(function() {
    observer.disconnect();
}, 5000);
}
function observeDOMChanges() {
    var observer = new MutationObserver(function(mutationsList, observer) {
        removeElements();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    return observer;
}
var observer = observeDOMChanges();
window.addEventListener('load', function() {
    removeElements();
});

function removeElements2() {
    var elementsToRemove = [
        ".to-gray-900.from-gray-900\\/0.bg-gradient-to-t.h-24",
        ".pr-1.gap-2.flex",
        // Hide upgrade button
        ".px-2.rounded-lg.m-0.hover\\:bg-token-sidebar-surface-secondary.radix-disabled\\:opacity-50.radix-disabled\\:pointer-events-none.focus\\:ring-0.cursor-pointer.text-sm.p-2\\.5.gap-2.flex.group",
        //
        // Hide upgrade button on smaller width
        "div.\\!pr-3.group.radix-disabled\\:opacity-50.radix-disabled\\:pointer-events-none.hover\\:bg-token-main-surface-secondary.focus\\:ring-0.cursor-pointer.text-sm.p-2\\.5.rounded.m-1\\.5.gap-2.flex:nth-of-type(2)",
        //
        ".text-token-text-tertiary > .mt-2",
        ".justify-center.md\\:gap-2.gap-0.md\\:mb-4.md\\:m-auto.md\\:w-full.ml-1.flex.h-full > .grow",
        ".md\\:px-\\[60px\\].text-token-text-secondary.text-xs.text-center.py-2.px-2.relative > span",
        ".font-medium.text-2xl.mb-5",
        "gizmo-shadow-stroke relative.flex h-full.items-center.justify-center.rounded-full.bg-white text-black",
        ".py-3.px-4.bg-gray-900",
        // Invite members button
        ".rounded-lg.hover\\:bg-token-sidebar-surface-secondary.radix-disabled\\:opacity-50.radix-disabled\\:pointer-events-none.focus\\:ring-0.cursor-pointer.text-sm.p-2\\.5.gap-2.flex.group",
        //
        // Share chat button
        ".my-1-5.border-b.border-token-border-light",
        ".border-token-border-light.border-b.my-1\\.5",
        //
        // Archive small button (new update - 3 dots next to saved chat)
        //".flex.pr-2.gap-1\\.5.items-center.top-0.right-0.bottom-0.absolute > span > .radix-state-open\\:text-token-text-secondary.hover\\:text-token-text-secondary.transition.text-token-text-primary.justify-center.items-center.flex",
        //".flex.items-center.justify-center.text-token-text-primary.transition.hover\\:text-token-text-secondary.radix-state-open\\:text-token-text-secondary > svg",
        //

        ".pt-2.pb-3\\.5.gap-3\\.5.flex-col.flex",
        ".text-token-text-tertiary.font-normal.text-sm.text-center.max-w-sm",
        ".opacity-70.font-medium.text-sm.gap-1.items-center.flex > span",
        ".w-12.h-12.mb-6",
        ".w-12.h-12",

      /*
      // CLEANER - Chat history not visible with this (remember - disable Chat history & training and Delete all chats)
        "div.group.radix-disabled\\:opacity-50.radix-disabled\\:pointer-events-none.hover\\:bg-token-main-surface-secondary.focus\\:ring-0.cursor-pointer.text-sm.p-2\\.5.rounded.m-1\\.5.gap-2.flex:nth-of-type(2)",
        "div.group.radix-disabled\\:opacity-50.radix-disabled\\:pointer-events-none.hover\\:bg-token-main-surface-secondary.focus\\:ring-0.cursor-pointer.text-sm.p-2\\.5.rounded.m-1\\.5.gap-2.flex:nth-of-type(3)",
        ".justify-center.items-center.flex-col.h-full.flex",
        ".text-token-text-primary.justify-center.items-center.flex-col.h-full.flex",
      */

      /*
      // MEGA CLEAN
        ".ml-2.focus\\:ring-0.border-token-border-medium.border.rounded-lg.whitespace-nowrap.justify-center.items-center.w-9.h-9.flex.btn-small.btn-neutral.relative.btn",
        ".bg-token-sidebar-surface-primary.overflow-x-hidden.flex-shrink-0",
        ".justify-center.items-center.w-8.h-\\[72px\\].flex",
        ".z-40.top-1\\/2.left-0.fixed",
        "#headlessui-dialog-\\:r1p\\: > .flex.inset-0.fixed",
        "#headlessui-portal-root > div > div > .relative",
        ".active\\:opacity-50.focus\\:ring-white.focus\\:ring-inset.focus\\:ring-2.focus\\:outline-none.hover\\:text-token-text-primary.rounded-md.justify-center.items-center.w-10.h-10.inline-flex.-mt-0\\.5.-ml-0\\.5.left-0.absolute",
      */

        // Gradient bar on button when clicked more
        ".absolute.bottom-0.right-0.top-0.bg-gradient-to-l"
        //
    ];
    elementsToRemove.forEach(function(selector) {
        var elements = document.querySelectorAll(selector);
        elements.forEach(function(element) {
            element.remove();
        });
    });
}

function observeDOMChanges2() {
    var observer2 = new MutationObserver(function(mutationsList2, observer2) {
        mutationsList2.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                var hasTextNodes = Array.from(mutation.addedNodes).some(function(node) {
                    if (node.nodeType === 3 && node.textContent.trim().length > 0) {
                        return true;
                    } else if (node.nodeType === 1 && node.tagName.toLowerCase() === 'p') {
                        return true;
                    } else if (node.nodeType === 1 && node.classList) {
                        var ignoredClasses = ['m-auto', 'md:gap-6', 'text-base', 'justify-center', 'py-2', 'px-4'];
                        return ignoredClasses.some(function(ignoredClass) {
                            return node.classList.contains(ignoredClass);
                        });
                    }
                    return false;
                });
                if (!hasTextNodes) {
                    removeElements2();
                }
            }
        });
    });
    observer2.observe(document.documentElement, { childList: true, subtree: true });  // subtree: false - for better optimization but inaccurate
    return observer2;
}
var observer2 = observeDOMChanges2();
window.addEventListener('load', function() {
    removeElements2();
});

// Auto Try again and continue generating (may not work) //
function tryagain_autocontinue() {
    const divs = document.querySelectorAll('div');
    divs.forEach(div => {
        if (div.textContent.includes('Try again')) {
            div.click();
        } else if (div.textContent.includes('Continue generating')) {
            setTimeout(() => {
                div.click();
            }, 300);
        }
    });
}

function observeDOMChanges3() {
    const observer3 = new MutationObserver((mutationsList3, observer3) => {
        for(const mutation of mutationsList3) {
            if (mutation.type === 'childList') {
                tryagain_autocontinue();
            }
        }
    });
    const config = { childList: true, subtree: true };
    observer3.observe(document.documentElement, config);
}

observeDOMChanges3();