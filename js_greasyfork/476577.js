// ==UserScript==
// @name        Sort by progress the issues in an epic
// @namespace   Violentmonkey Scripts
// @match       https://jira.atl.workiva.net/browse/*
// @grant       none
// @version     1.1
// @author      -
// @description 9/12/2023, 4:48:29 PM
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/476577/Sort%20by%20progress%20the%20issues%20in%20an%20epic.user.js
// @updateURL https://update.greasyfork.org/scripts/476577/Sort%20by%20progress%20the%20issues%20in%20an%20epic.meta.js
// ==/UserScript==
let issues = document.querySelector("#ghx-issues-in-epic-table").children[0]

let newIssues = []
let readyForDev = []
let inProgress = []
let reworking = []
let codeReview = []
let otherIssues = []
let closed = []
let qaReview = []
let resolved = []

for (let i = issues.children.length; i --> 0; ) {
  let issue = issues.children[i]
  let status = issue.querySelector('.status > span').textContent
  issue.remove()

  console.log(status)
  switch(status) {
    case 'New':
      newIssues.push(issue)
      break
    case 'Ready for Dev':
      readyForDev.push(issue)
      break
    case 'In Progress':
      inProgress.push(issue)
      break
    case 'Reworking':
      reworking.push(issue)
      break
    case 'Code Review':
      codeReview.push(issue)
      break
    case 'QA Review':
      qaReview.push(issue)
      break
    case 'Resolved':
      resolved.push(issue)
      break
    case 'Closed':
      closed.push(issue)
      break
    default:
      otherIssues.push(issue)
  }
}

issues.append(...newIssues)
issues.append(...readyForDev)
issues.append(...inProgress)
issues.append(...reworking)
issues.append(...codeReview)
issues.append(...qaReview)
issues.append(...otherIssues)
issues.append(...resolved)
issues.append(...closed)