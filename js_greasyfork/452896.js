// ==UserScript==
// @name         Hotcrp Auto Authors Copy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This script copies the list of authors from one submission on hotcrp and imports it directly to another submission.
// @author       Fangfei Yang
// @match        https://*.hotcrp.com/paper/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hotcrp.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452896/Hotcrp%20Auto%20Authors%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/452896/Hotcrp%20Auto%20Authors%20Copy.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function insertAfter(newNode, existingNode) {
        existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
    }
    function getName(type, i){
        return `authors:${type}_${i}`
    }
    console.log(location.href)
    if (/edit/.test(location.href) ) {
        console.log("In /edit");
        const search_btn = $(".gopaper > button")[0];
        const copy_btn = document.createElement('button');
        copy_btn.id = "copy_btn";
        copy_btn.name = "copy_btn";

        const txtBox = document.createElement("input");
        txtBox.id="hiddenTxt";
        txtBox.value="hidden Text Box";
        document.body.appendChild(txtBox);
        copy_btn.textContent = "Copy Author";
        copy_btn.onclick = () => {
            if ($(".odname").toArray().length != 0){
                txtBox.value = JSON.stringify($(".odname").toArray().map((x) => /(.*)\s\((.*)\)\s<(.*)>/.exec(x.textContent).slice(1,4)));
            } else {
                const n = $(".author-entry").length - 1;
                let ary = [];
                for (let i = 1; i <= n; i++){
                    let d = [
                        document.getElementsByName(getName("name", i))[0].value,
                        document.getElementsByName(getName("affiliation", i))[0].value,
                        document.getElementsByName(getName("email", i))[0].value,
                    ]
                    ary.push(d);
                }
                txtBox.value = JSON.stringify(ary);
            }
            txtBox.select();
            document.execCommand("copy");
            return false;
        }
        insertAfter(copy_btn, search_btn);
    }
    if (/new/.test(location.href) || /edit/.test(location.href)) {
        if ($("[for=authors]").length != 0) {
            const paste_btn = document.createElement('button');
            paste_btn.id = "paste_btn";
            paste_btn.name = "paste_btn";
            paste_btn.textContent = "Paste Contacts";
            insertAfter(paste_btn, $("[for=authors]")[0]);
            paste_btn.onclick = onPaste;
            function onPaste() {
                navigator.clipboard.readText().then((txt) => {
                    txt = JSON.parse(txt);
                    let i = 0;
                    function pasteOnce() {
                        const name = txt[i][0];
                        const affiliation = txt[i][1];
                        const email = txt[i][2];
                        document.getElementsByName(getName("email", i + 1))[0].value = email;
                        document.getElementsByName(getName("name", i + 1))[0].value = name;
                        document.getElementsByName(getName("affiliation", i + 1))[0].value = affiliation;
                        document.getElementsByName(getName("email", i + 1))[0].dispatchEvent(new Event('change'));
                        document.getElementsByName(getName("name", i + 1))[0].dispatchEvent(new Event('change'));
                        document.getElementsByName(getName("affiliation", i + 1))[0].dispatchEvent(new Event('change'));
                        $(document.getElementById("authors:container")).trigger({
                            type:   'input',
                            target: $(document.getElementsByName(getName("email", i + 1)))[0]
                        });
                        i = i + 1;
                        if (i < txt.length) {
                            setTimeout(pasteOnce, 200);
                        }
                    }
                    pasteOnce();
                });
                return false;
            }
        }
    }
})();