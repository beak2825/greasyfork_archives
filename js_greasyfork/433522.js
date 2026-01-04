// ==UserScript==
// @name         Copy Jira Issue ID
// @namespace    naatan.copy.jira.id
// @version      1.1.0
// @description  Adds a copy button alongside the "Copy link" button that copies the ticket ID to your clipboard.
// @author       Nathan Rijksen
// @match        https://*.atlassian.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433522/Copy%20Jira%20Issue%20ID.user.js
// @updateURL https://update.greasyfork.org/scripts/433522/Copy%20Jira%20Issue%20ID.meta.js
// ==/UserScript==

(function() {
    setInterval(() => {
        let rx = /\/browse\/([A-Z]+\-\d+)/;
        let crumbs = document.querySelectorAll("nav[aria-label=\"Issue breadcrumbs\"] ol > div:last-child");
        for (let crumb of crumbs) {
          if (crumb.getAttribute("_seen") == "true") {
            continue;
          }
          crumb.setAttribute("_seen", "true");

          let link = crumb.querySelector("a[href]");

          let match = rx.exec(link.getAttribute("href"));
          if (!match) {
            continue;
          }

          let copyBtnDiv = document.createElement("div");
          copyBtnDiv.innerHTML = '<button class="css-zs8b2e" type="button" tabindex="0"><span class="css-113mohm"><span role="img" aria-label="Copy link to issue" class="css-hakgx8" style="--icon-primary-color:green; --icon-secondary-color:var(--background-default, #FFFFFF);"><svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentColor" fill-rule="evenodd"><path d="M12.856 5.457l-.937.92a1.002 1.002 0 000 1.437 1.047 1.047 0 001.463 0l.984-.966c.967-.95 2.542-1.135 3.602-.288a2.54 2.54 0 01.203 3.81l-2.903 2.852a2.646 2.646 0 01-3.696 0l-1.11-1.09L9 13.57l1.108 1.089c1.822 1.788 4.802 1.788 6.622 0l2.905-2.852a4.558 4.558 0 00-.357-6.82c-1.893-1.517-4.695-1.226-6.422.47"></path><path d="M11.144 19.543l.937-.92a1.002 1.002 0 000-1.437 1.047 1.047 0 00-1.462 0l-.985.966c-.967.95-2.542 1.135-3.602.288a2.54 2.54 0 01-.203-3.81l2.903-2.852a2.646 2.646 0 013.696 0l1.11 1.09L15 11.43l-1.108-1.089c-1.822-1.788-4.802-1.788-6.622 0l-2.905 2.852a4.558 4.558 0 00.357 6.82c1.893 1.517 4.695 1.226 6.422-.47"></path></g></svg></span></span></button>'
          copyBtnDiv.onclick = ((copyBtnDiv, id)=>{
              copyBtnDiv.firstChild.style.backgroundColor = "lightgray";
              setTimeout(()=>{copyBtnDiv.firstChild.style.backgroundColor = "";}, 2000)
              navigator.clipboard.writeText(id);
          }).bind(null, copyBtnDiv, match[1]);

          let btwrap = crumb.querySelector(".issue_view_permalink_button_wrapper");
          if (btwrap) {
            btwrap.appendChild(copyBtnDiv);
          } else {
            crumb.appendChild(copyBtnDiv);
          }
        }
    }, 2000);
})();