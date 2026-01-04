// ==UserScript==
// @name         Wanikani Forums: Custom signature
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Adds a custom message to any post
// @author       latepotato
// @include      https://community.wanikani.com/*
// @grant        GM.xmlHttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459902/Wanikani%20Forums%3A%20Custom%20signature.user.js
// @updateURL https://update.greasyfork.org/scripts/459902/Wanikani%20Forums%3A%20Custom%20signature.meta.js
// ==/UserScript==
// You can set your own signature in the post editor. Just click on the Sig button and whatever is in your editor will be saved as your signature and will automatically be appended to each of your posts!

;(function () {
    waitForClass('d-editor-input', (elems)=>{
        var elem = elems[0];
        var btn = document.createElement('button');
        btn.className = "signature btn no-text btn-icon ember-view";
        btn.title = "Click to set the current text as your signature";
        btn.innerText = "Sig";
        btn.onclick = ()=>{
            var text = elem.value;
            localStorage.setItem('WKCS-signature', text)
            elem.value = 'Successfully set signature!';
            elem.focus();
            elem.blur();
            elem.focus();
        };
        var refElem = document.getElementsByClassName('italic')[0];
        refElem.parentElement.insertBefore(btn, refElem.nextElementSibling);
    });
    let rng_timestamp
    // Wait until the save function is defined
    const i = setInterval(tryInject, 100)

    // Inject if the save function is defined
    function tryInject() {
        const old_save = unsafeWindow.require('discourse/controllers/composer').default.prototype.save
        if (old_save) {
            clearInterval(i)
            inject(old_save)
        }
    }

    // Wrap the save function with our own function
    function inject(old_save) {
        const new_save = async function (t) {
            const composer = document.querySelector('textarea.d-editor-input') // Reply box
            composer.value = await add_signature(composer)
            composer.dispatchEvent(new Event('change', { bubbles: true, cancelable: true })) // Let Discourse know
            old_save.call(this, t) // Call regular save function
        }
        unsafeWindow.require('discourse/controllers/composer').default.prototype.save = new_save // Inject
    }
    function waitForClass (className, callback) {
        var alreadyExists = 0;
        setInterval(()=>{
            var elems = document.getElementsByClassName(className);
            var found = elems.length;
            if (!alreadyExists && found) callback(elems);
            alreadyExists = found;
        }, 333);
    }
    // Returns the original message and adds / moves the signature below it
    async function add_signature(composer) {
        // Get rid of already existing signatures
        const text = composer.value.replace(/<wksig>.*<\/wksig>/s, '')
        let signature = localStorage.getItem('WKCS-signature')
        if (signature === null) {
            return composer.value
        }
        return text + '\n<wksig>\n____\n' + signature + '\n</wksig>'
    }

})()