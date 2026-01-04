// ==UserScript==
// @name         Jira empirie-fier
// @namespace    http://empiriecom.com/
// @version      2025-10-20-fix-4
// @description  Improve Jira board info
// @author       senritsu
// @match        https://empiriecom.atlassian.net/jira/software/c/projects/*/boards/*
// @icon         https://empiriecom.com/default-wGlobal/wGlobal/layout/images/site-icons/favicon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543428/Jira%20empirie-fier.user.js
// @updateURL https://update.greasyfork.org/scripts/543428/Jira%20empirie-fier.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const getBlockedBoardIssues = (boardId) =>
    fetch(
      `/rest/agile/1.0/board/${boardId}/issue?fields=issuelinks&jql=${encodeURIComponent(
        "Status NOT IN (New, Verification, 'On Hold', Closed)"
      )}&maxResults=200`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((x) => x.json())
      .then(({ issues }) => {
        return issues.reduce((filtered, { key, fields: { issuelinks } }) => {
          const blockers = issuelinks.filter(
            (link) =>
              link.inwardIssue &&
              link.type.inward === "is blocked by" &&
              link.inwardIssue.fields.status.name !== "Closed"
          );

          if (blockers.length) {
            filtered.push({
              key,
              blockedBy: blockers.map((link) => link.inwardIssue.key),
            });
          }
          return filtered;
        }, []);
      });

  const showBlocked = (blockedIssues) => {
    const selector = blockedIssues.map(({ key }) => `#card-${key}`).join(",");
    const html = `
section {
    ${selector} {
      & [class$=content]::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 1;
        pointer-events: none;
      }
        
      & [class$=content]::after {
        content: 'BLOCKED BY DEPENDENCY';
        font-size: 0.8em;
        width: calc(100% - 1em);
        text-align: center;
        background-color: #8e0000;
        color: white;
        transition: background-color 0.25s;
        opacity: 0.8;
        pointer-events: none;
        border-radius: 3px;
        padding-block: 0.25em;
        padding-inline: 0.5em;
        z-index: 1;
      }
    
      &:hover [class$=content]::after {
        background-color: #be0f0f;
      }
    }
}

.show-blocker-overlay {
    ${selector} {
      & [class$=content]::before {
        backdrop-filter: blur(2px);
        transition: backdrop-filter 0.25s;
      }
    
      &:hover [class$=content]::before {
        backdrop-filter: blur(0px);
      }
    }
}

.empirifier-panel {
  position: fixed;
  bottom: 5em;
  left: 1em;
  z-index: 2;
}
`.trim();
    const style = document.createElement("style");
    style.id = "empirifier";
    style.innerHTML = html;
    document.querySelector("head").appendChild(style);
  };
  
    const panel = document.createElement('div');
    panel.classList.add('empirifier-panel');
    const button = document.createElement('button');
    button.textContent = 'Toggle Blur';
    panel.appendChild(button);
    button.addEventListener('click', () => {
        document.body.classList.toggle('show-blocker-overlay');
    })

  const update = async () => {
    document.body.classList.add('show-blocker-overlay');
    document.body.appendChild(panel);
    
    const boardId = document.location.pathname.match(
      /\/boards\/(?<boardId>\d+)/
    )?.groups?.boardId;
    document.querySelector("style#empirifier")?.remove();

    if (boardId) {
      const blockedIssues = await getBlockedBoardIssues(boardId);
      showBlocked(blockedIssues);
    }
  };

  update();
})();
