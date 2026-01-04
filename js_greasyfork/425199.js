// ==UserScript==
// @name         85 Tube
// @version      0.2
// @description  85 tube
// @author       You
// @match        https://85tube.com/*
// @grant        none
// @namespace https://greasyfork.org/users/761733
// @downloadURL https://update.greasyfork.org/scripts/425199/85%20Tube.user.js
// @updateURL https://update.greasyfork.org/scripts/425199/85%20Tube.meta.js
// ==/UserScript==

(function() {

        setInterval(function()
        {
            try
            {
                //Array.from(document.querySelector("div.fp-player").children).filter(x => x.tagName.toLowerCase() != 'video').forEach(x=>x.remove());
                let video = document.querySelector("div.fp-player video");
                video.setAttribute("controls", "true");
                document.querySelector("div.fp-player").replaceWith(video);
            }catch(err)
            {

            }
        }, 200);

    // Your code here...
})();