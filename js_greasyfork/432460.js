// ==UserScript==
// @name         Howrare.is extension
// @namespace    http://tampermonkey.net/
// @description  hello
// @version      0.6.4
// @author       You
// @match        https://digitaleyes.market/*
// @match        https://solanart.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/432460/Howrareis%20extension.user.js
// @updateURL https://update.greasyfork.org/scripts/432460/Howrareis%20extension.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let digitalEyesCollections = {
        "SolanaValley": "solanavalley",
        "PiggySolGang": "piggysolgang",
        "Thugbirdz": "thugbirdz",
        "SolanaSouls": "solanasouls",
        "SolBear": "solbears",
        "ShroomZ": "shroomz",
        "Solantasy": "solantasy",
        "Aurory": "aurory",
        "CoolBeans": "coolbeans",
        "CyberSamurai": "cybersamurai",
        "DegenerateApeAcademy": "degenape",
        "KaijuCards": "kaiju",
        "PandaStreet": "pandastreet",
        "SolanaMonkeyBusiness": "smb",
        "Solamanders": "solamanders",
        "SolCats": "solcats",
        "TheSneks": "thesneks"
    }

    let collectionDb = {
        "solanavalley": "https://gist.githubusercontent.com/anilkaragoz/011d9dff4882ed005ab5e40d3931164a/raw/bc28244388b5ae158d9ee0b17aebeaeecf36517b/solanavalley.json",
        "piggysolgang": "https://gist.githubusercontent.com/anilkaragoz/12837d30e84da51f698a0c7bb58510c0/raw/4eef9669ec9869267e58d94f86fd010956836142/piggysolgang.json",
        "thugbirdz": "https://gist.githubusercontent.com/anilkaragoz/9f0788bb5a5eaf6af973391303f1a7af/raw/4b4dafcfe3c9d3198b6d36ca8037a8fc5913a9ac/thugbirdz.json",
        "solanasouls": "https://gist.githubusercontent.com/anilkaragoz/ddd0a60960d07d3bc62b0770afdba57a/raw/233d89c56360b659b628f27f15fc3ff680f3d128/solsouls.json",
        "solbears": "https://gist.githubusercontent.com/anilkaragoz/734ba35dc9c137d93eeb5764902c4837/raw/d68de4188336f3bfd455e9cc209e39d73047c69a/solbears.json",
        "shroomz": "https://gist.githubusercontent.com/anilkaragoz/77e4b0efb7aafc912f6a70ec53f5f221/raw/a13eac44e320f20b51209ffab740f1c114da48a0/shroomz.json",
        "solantasy": "https://gist.githubusercontent.com/anilkaragoz/860512a92c40c09202434a5f1ad787e7/raw/b29e463bfa3dad303b4e8e78f56fa2622ede19c3/solantasy.json",
        "aurory": "https://gist.githubusercontent.com/anilkaragoz/27f0ab2abc51ef1d5ead54b4523e6f19/raw/2a5e04714d09de56f4dabc09ab2a20dc51585209/aurory.json",
        "boldbadgers": "https://gist.githubusercontent.com/anilkaragoz/07e855883a428858d32679051e72a8da/raw/c5f1b5cb623e520aeee56281c23b7131725f22bf/boldbadgers.json",
        "coolbeans": "https://gist.githubusercontent.com/anilkaragoz/adfda3029c71495ebdae5ddee1fb767b/raw/c5cd0cbe35b3950cfd0ea6e5b6cfd8861a9b1fc5/coolbeans.json",
        "cybersamurai": "https://gist.githubusercontent.com/anilkaragoz/53141a4f6c538563fb7c236e74802456/raw/dfaa8351dd7bd9e14acf01e10c438233709dd34d/cybersamurai.json",
        "degenape": "https://gist.githubusercontent.com/anilkaragoz/c8c5f718d0f928addf6961c876d8a4bc/raw/0b5cef93f352e44e94edc99d16631a15038fdca6/degenapes.json",
        "flunkdonkeys": "https://gist.githubusercontent.com/anilkaragoz/705cd502e09cb064e2a3147647395fe7/raw/2f904ef821cd73c7347d8c0f3f73f02b693130d9/flunkdonkeys.json",
        "kaiju": "https://gist.githubusercontent.com/anilkaragoz/857f21cbbb2563a25aa2f5c255df3285/raw/61c5ffe0042471f70b79505b4c4e1ff23b328f53/kaiju.json",
        "pandastreet": "https://gist.githubusercontent.com/anilkaragoz/4e8a27a80b2a6b3e7079b098b5d1429f/raw/f4d34ad95dddf7e8553a4faa6f97767c964ccefc/pandastreet.json",
        "redpandasquad": "https://gist.githubusercontent.com/anilkaragoz/f4d36aa1260ae60bee7fceddc4ab08d0/raw/6cf808496e4260089840ba6556fa246ad5f006cc/redpandasquad.json",
        "smb": "https://gist.githubusercontent.com/anilkaragoz/7db47b288f4d5006e4621e0f8a6431fc/raw/bbdc18f9c8f2cae992407648134867a7261f74e4/smb.json",
        "solamanders": "https://gist.githubusercontent.com/anilkaragoz/547687e932bf1d51067fb45c5a2a3d99/raw/2f1c8cf89bf380833758de2efdf20e5b6b70d8db/solamanders.json",
        "solanimals": "https://gist.githubusercontent.com/anilkaragoz/bf5a5668632e34c34187b2c209bd69cd/raw/e2448e3c294c8a2073d21a58c10d5215323b05e5/solanimals.json",
        "solcats": "https://gist.githubusercontent.com/anilkaragoz/5b125a24a8dcdeb080324b6750cbfcbc/raw/0acd5376d2dd93e0a04e41fc626fc5940eb20fa1/solcats.json",
        "thesneks": "https://gist.githubusercontent.com/anilkaragoz/6b8e29e7b8931e2483da7c186e5a3bab/raw/64432d0c549e867e040049954a9024cb6fb1ad05/solsneks"
    }

    parse()

    // Detect URL change
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            onUrlChange();
        }
    }).observe(document, {subtree: true, childList: true});

    function debounce(func, wait) {
        let timeout
        return function(...args) {
            const context = this
            clearTimeout(timeout)
            timeout = setTimeout(() => func.apply(context, args), wait)
        }
    }

    function onUrlChange() {
        // Remove older binding, this prevents other collection db to be used when changing pages
        $("#root").unbind('DOMNodeInserted DOMNodeRemoved')
        parse()
    }

    function parse() {
        // Get current collection
        let path = window.location.pathname
        path = path.split("/").reverse()[0].replaceAll("%20", "")

        let collection = ""

        if (location.hostname == "digitaleyes.market") {
            collection = collectionDb[digitalEyesCollections[path]]
        } else {
            collection = collectionDb[path]
        }

        if (collection == undefined) {
            console.log("Collection not supported")
            return
        }

        if (location.hostname == "digitaleyes.market") {
            parseDigitalEyes(collection)
        } else {
            parseSolanart(collection)
        }
    }

    function parseDigitalEyes(collection) {
        fetch(collection)
            .then(response => response.json())
            .then((responseJson) => {

            $("#root").bind('DOMNodeInserted DOMNodeRemoved', debounce(function(event) {

                let items = Array.from(document.getElementsByClassName('flex-1'))
                items.forEach(item => {

                    if (item.childNodes.length > 2) return

                    let id = item.lastChild.innerHTML.replace(/\D/g, '');

                    if (responseJson[id] === undefined) return

                    var node = document.createElement("p");
                    var textnode = document.createTextNode("Rank:  " + responseJson[id]);

                    node.appendChild(textnode);

                    node.classList.add("text-color-main-secondary", "text-sm", "font-bold", "text-left")

                    let collectionSize = Object.keys(responseJson).length

                    let firstTreshold = Math.round(collectionSize * 0.1)
                    let ultraTreshold = Math.round(collectionSize * 0.05)

                    if (responseJson[id] <= ultraTreshold) {
                        node.style.color = "orange"
                        item.parentNode.parentNode.parentNode.style.border = "thick dashed orange";
                    } else if (responseJson[id] <= firstTreshold) {
                        node.style.color = "green"
                        item.parentNode.parentNode.parentNode.style.border = "thick dashed green";
                    }

                    item.appendChild(node);
                })
            }, 200));
        })
    }

    function parseSolanart(collection) {
        fetch(collection)
            .then(response => response.json())
            .then((responseJson) => {

            $("#root").bind('DOMNodeInserted DOMNodeRemoved', debounce(function(event) {

                let items = Array.from(document.getElementsByClassName('country-item-container'))
                items.forEach(item => {

                    if (item.childNodes.length > 1) return

                    let id = item.getElementsByClassName('card-title h5')[0].innerText.replace(/\D/g, '');

                    if (responseJson[id] === undefined) return

                    var node = document.createElement("p");
                    var textnode = document.createTextNode("Rank:  " + responseJson[id]);

                    node.appendChild(textnode);

                    let collectionSize = Object.keys(responseJson).length

                    let firstTreshold = Math.round(collectionSize * 0.1)
                    let ultraTreshold = Math.round(collectionSize * 0.05)

                    if (responseJson[id] <= ultraTreshold) {
                        node.style.color = "orange"
                        item.childNodes[0].style.border = "thick dashed orange";

                    } else if (responseJson[id] <= firstTreshold) {
                        node.style.color = "green"
                        item.childNodes[0].style.border = "thick dashed green";

                    }

                    item.appendChild(node);
                })
            }, 200));
        })
    }
})();