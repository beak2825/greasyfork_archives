// ==UserScript==
// @name         Spoiler image tag
// @namespace    4pda
// @version      1
// @description  spoiler tag
// @author       drakulaboy
// @match        *4pda.to/forum/index.php?showtopic=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461901/Spoiler%20image%20tag.user.js
// @updateURL https://update.greasyfork.org/scripts/461901/Spoiler%20image%20tag.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const button = document.querySelector('input[name="submit"].button');
    const textarea = document.querySelector('textarea.ed-textarea');

    button.addEventListener('click', () => {
        const attachments = textarea.value.match(/\[attachment="([^"\]]*?)"\](?!\[\/SPOILER\])/g);
        if (attachments) {
            let newAttachments = '';
            let lastIndex = 0;
            attachments.forEach((attachment) => {
                const filename = attachment.match(/"(.*?)"/)[1];
                const spoilerTag = `[SPOILER][attachment="${filename}"][/SPOILER]`;
                if (!textarea.value.includes(spoilerTag)) {
                    const attachmentIndex = textarea.value.indexOf(attachment, lastIndex);
                    newAttachments += textarea.value.slice(lastIndex, attachmentIndex);
                    newAttachments += `[SPOILER][attachment="${filename}"][/SPOILER]`;
                    lastIndex = attachmentIndex + attachment.length;
                }
            });
            newAttachments += textarea.value.slice(lastIndex);
            textarea.value = newAttachments;
        }
    });
})();




