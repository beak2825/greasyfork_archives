// ==UserScript==
// @name         Copy Jira Issue link as markdown
// @version      1.0.2
// @description  Adds a copy button alongside the "Copy link" button that copies the ticket link as a markdown to your clipboard.
// @author       relayism
// @match        https://*.atlassian.net/*
// @grant        none
// @namespace https://greasyfork.org/users/452041
// @downloadURL https://update.greasyfork.org/scripts/444553/Copy%20Jira%20Issue%20link%20as%20markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/444553/Copy%20Jira%20Issue%20link%20as%20markdown.meta.js
// ==/UserScript==

// fork of "Copy Jira Issue ID" by Nathan Rijksen

(function() {
    setInterval(() => {
        let rx = /\/browse\/([A-Z]+\-\d+)/;
        let links = document.querySelectorAll("nav[aria-label=\"Breadcrumbs\"] ol > div:last-child a[href]");
        for (let link of links) {
          if (link.getAttribute("_seen") == "true") {
            continue;
          }
          link.setAttribute("_seen", "true");

          let match = rx.exec(link.getAttribute("href"));
          if (!match) {
            continue;
          }

          let copyBtnDiv = document.createElement("div");
          copyBtnDiv.style.cssText="padding-left: 10px; padding-top: 2px;"
          copyBtnDiv.innerHTML = '<button class="css-zs8b2e" type="button" tabindex="0"><span class="css-113mohm"><span role="img" aria-label="Copy link to issue" class="css-hakgx8" style="--icon-primary-color:green; --icon-secondary-color:var(--background-default, #FFFFFF);"><svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentColor" fill-rule="evenodd"><path d="M12.856 5.457l-.937.92a1.002 1.002 0 000 1.437 1.047 1.047 0 001.463 0l.984-.966c.967-.95 2.542-1.135 3.602-.288a2.54 2.54 0 01.203 3.81l-2.903 2.852a2.646 2.646 0 01-3.696 0l-1.11-1.09L9 13.57l1.108 1.089c1.822 1.788 4.802 1.788 6.622 0l2.905-2.852a4.558 4.558 0 00-.357-6.82c-1.893-1.517-4.695-1.226-6.422.47"></path><path d="M11.144 19.543l.937-.92a1.002 1.002 0 000-1.437 1.047 1.047 0 00-1.462 0l-.985.966c-.967.95-2.542 1.135-3.602.288a2.54 2.54 0 01-.203-3.81l2.903-2.852a2.646 2.646 0 013.696 0l1.11 1.09L15 11.43l-1.108-1.089c-1.822-1.788-4.802-1.788-6.622 0l-2.905 2.852a4.558 4.558 0 00.357 6.82c1.893 1.517 4.695 1.226 6.422-.47"></path></g></svg></span></span></button>'
          copyBtnDiv.onclick = ((copyBtnDiv, id)=>{
              copyBtnDiv.firstChild.style.backgroundColor = "lightgray";
              setTimeout(()=>{copyBtnDiv.firstChild.style.backgroundColor = "";}, 2000)
              const issueTitle=document.querySelector('[data-test-id="issue.views.issue-base.foundation.summary.heading"]').innerText;
              const headerLinks = [...document.querySelectorAll("#jira-issue-header * [href]")]
              const lastHeaderLink = headerLinks[headerLinks.length -1];
              navigator.clipboard.writeText(`[${issueTitle}](${lastHeaderLink})`);
          }).bind(null, copyBtnDiv, match[1]);

          let btwrap = link.parentElement.parentElement.querySelector(".issue_view_permalink_button_wrapper");
          if (btwrap) {
            btwrap.appendChild(copyBtnDiv);
          } else {
            link.parentElement.appendChild(copyBtnDiv); 
          }
        }
    }, 2000);
})();