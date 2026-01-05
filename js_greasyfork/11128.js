// ==UserScript==
// @name        fadeSigs
// @namespace   ETI
// @description fades sigs
// @include     http://boards.endoftheinter.net/*
// @include     http://archives.endoftheinter.net/*
// @include     http://endoftheinter.net/inboxthread.php*
// @include     https://boards.endoftheinter.net/*
// @include     https://archives.endoftheinter.net/*
// @include     https://endoftheinter.net/inboxthread.php*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11128/fadeSigs.user.js
// @updateURL https://update.greasyfork.org/scripts/11128/fadeSigs.meta.js
// ==/UserScript==
var OPTIONS = {
        opacity: 0.03,
        color: 'orange',
        fadeIn: true
    },
    makeArray = function makeArray(nodeList) {
        return Array.prototype.slice.apply(nodeList);
    },
    hasSigBelt = function hasSigBelt(text) {
        return (/^---/m).test(text);
    },
    makeSigWrapper = function makeSigWrapper() {
        var sigWrapper = document.createElement('span');
        sigWrapper.className = 'sigContainer';
        sigWrapper.style.opacity = parseFloat(OPTIONS.opacity, 10) || 0.5;
        sigWrapper.style.color = OPTIONS.color || 'white';
        if (OPTIONS.fadeIn) {
            sigWrapper.addEventListener('mouseover', function () {
                this.style.opacity = 1;
            });
            sigWrapper.addEventListener('mouseout', function () {
                this.style.opacity = parseFloat(OPTIONS.opacity, 10) || 0.5;
            });
        }
        return sigWrapper;
    },
    messages = makeArray(
        document.querySelectorAll('td.message')
    ),
    sigBelts = [],
    fadeSigs = function fadeSigs(messages) {
        var sigWrapper,
            sig;
        messages.filter(function (message) {
            return hasSigBelt(message.textContent);
        })
            .forEach(function (message) {
                sigWrapper = makeSigWrapper();
                sig = [];
                makeArray(message.childNodes)
                    .reverse()
                    .some(function (node) {
                        sig.push(node);
                        return hasSigBelt(node.nodeValue);
                    });
                sig.reverse()
                    .forEach(function (sigNode) {
                        sigWrapper.appendChild(sigNode);
                    });
                sigBelts.push(sig.shift());
                message.appendChild(sigWrapper);
            });
    },
    popSigBelt = function popSigBelt(sigBelt) {
        sigBelt.parentNode
            .parentNode.insertBefore(sigBelt, sigBelt.parentNode);
    },
    fadeSigBelt = function fadeSigBelt(sigBelt) {
        sigBelt.nextSibling.insertBefore(sigBelt, sigBelt.nextSibling.firstChild);
    };

//overwrite default quote button click handler
var publish = QuickPost.publish,
    getQuoteButtons = function getQuoteButtons(target) {
        return makeArray(target.querySelectorAll('.message-top > a:last-child'))
            .filter(function (a) {
                return a.className !== 'jump-arrow';
            });
    },
    overwriteQuickPost = function overwriteQuickPost(quoteButtons) {
        quoteButtons.forEach(function (button) {
            button.onclick = function (e) {
                e.preventDefault();

                sigBelts.forEach(function (belt) {
                    popSigBelt(belt);
                });

                console.log('this ->', this);
                publish('quote', this);

                sigBelts.forEach(function (belt) {
                    fadeSigBelt(belt);
                });
            };
        });
    };

//Watch for Livelinks updates.
var target = document.querySelector('#u0_1'),
    observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            var addedNodes = makeArray(mutation.addedNodes),
                quoteButton = getQuoteButtons(addedNodes[0]),
                message = [].concat.apply(
                    addedNodes[0].querySelector('.message')
                );
            fadeSigs(message);
            overwriteQuickPost(quoteButton);
        });
    }),
    config = {attributes: true, childList: true, characterData: true};

observer.observe(target, config);

//hacky way to wait for images on initial page load.
setTimeout(function () {
    fadeSigs(messages);
    overwriteQuickPost(getQuoteButtons(document));
}, 4);