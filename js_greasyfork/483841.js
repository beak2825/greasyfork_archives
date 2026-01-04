// ==UserScript==
// @name         Quick Copy Issue
// @namespace    rj
// @version      2.0
// @description  Create copy issues and link in the parent issue, Promote to Epic (keep links)
// @author       rjchang
// @match        https://gitlab.rayark.com/*/app/-/issues/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rayark.com
// @require      https://gitlab.rayark.com/jimhsu/userscript/-/raw/main/utils.js
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483841/Quick%20Copy%20Issue.user.js
// @updateURL https://update.greasyfork.org/scripts/483841/Quick%20Copy%20Issue.meta.js
// ==/UserScript==

const GITLAB_GROUP_ID = 486
const GITLAB_PROJECT_ID = 1384
const DEFAULT_OPEN_PANEL = false

const newIssueWidget = `
<div id="rj-related-issues" class="related-issues-block">
  <div class="card card-slim gl-overflow-hidden gl-mt-5 gl-mb-0">
    <div class="gl-display-flex gl-justify-content-space-between gl-line-height-24 gl-pl-5 gl-pr-4 gl-py-4 gl-bg-white gl-border-b-solid gl-border-b-gray-100 gl-border-b-0">
      <h3 class="card-title h5 gl-my-0 gl-display-flex gl-align-items-center gl-flex-grow-1">
        <a id="user-content-related-issues" aria-hidden="true" href="#related-issues" class="gl-link anchor position-absolute gl-text-decoration-none"></a>
        Copy Issue
        <div class="js-related-issues-header-issue-count gl-display-inline-flex gl-mx-3 gl-text-gray-500">
            <span class="gl-display-inline-flex gl-align-items-center">
                <svg data-testid="issue-type-new" role="img" aria-hidden="true" class="gl-mr-2 gl-icon s16">
                    <use href="/assets/icons-b25b55b72e1a86a9ca8055a5c421aae9b89fc86363fa02e2109034d756e56d28.svg#issues">
                    </use>
                </svg>
            </span>
            <span id="rj-extend-created-count">0</span>
        </div>
      </h3>
    </span>
      <!--
        <button data-qa-selector="related_issues_plus_button" data-testid="related-issues-plus-button" aria-label="Add a related issue" type="button" class="btn gl-ml-3 btn-default btn-sm gl-button">
          <span class="gl-button-text">Add</span>
        </button>
      -->
      <div class="gl-pl-3 gl-ml-3 gl-border-l-1 gl-border-l-solid gl-border-l-gray-100">
        <button id="rj-extend-linked-item-close" aria-label="Collapse" data-testid="toggle-links" type="button"
          class="btn btn-default btn-sm gl-button btn-default-tertiary btn-icon"
          style="${(!DEFAULT_OPEN_PANEL ? 'display: none;' : 'display: block;')}"
          >
          <!---->
          <svg data-testid="chevron-lg-up-icon" role="img" aria-hidden="true" class="gl-button-icon gl-icon s16"><use href="/assets/icons-b25b55b72e1a86a9ca8055a5c421aae9b89fc86363fa02e2109034d756e56d28.svg#chevron-lg-up"></use></svg>
          <!---->
        </button>
        <button id="rj-extend-linked-item-open" aria-label="Expand" data-testid="toggle-links" type="button"
            class="btn btn-default btn-sm gl-button btn-default-tertiary btn-icon"
            style="${(DEFAULT_OPEN_PANEL ? 'display: none;' : 'display: block;')}">
          <!---->
          <svg data-testid="chevron-lg-down-icon" role="img" aria-hidden="true" class="gl-button-icon gl-icon s16"><use href="/assets/icons-b25b55b72e1a86a9ca8055a5c421aae9b89fc86363fa02e2109034d756e56d28.svg#chevron-lg-down"></use></svg>
          <!---->
        </button>
      </div>
    </div>
    <div data-testid="related-issues-body" class="linked-issues-card-body gl-bg-gray-10 gl-p-5" style="${(!DEFAULT_OPEN_PANEL ? 'display: none;' : 'display: block;')}">
      <div class="js-add-related-issues-form-area card-body bordered-box bg-white">
        <form>
          <div role="group" class="form-group gl-form-group gl-mb-3" id="rj-extend-linked-item-radio">
            <label for="linked-issue-type-radio" class="d-block label-bold col-form-label" id="rj-extend-linked-item-radio-label"> The current issue {relationship} to the copied issue
              <!---->
              <!---->
            </label>
            <div class="bv-no-focus-ring">
              <div id="rj-extend-linked-issue-type-radio" role="radiogroup" tabindex="-1" class="gl-form-checkbox-group bv-no-focus-ring">
                <div class="gl-form-radio custom-control custom-radio">
                  <input type="radio"
                    name="linked-issue-type-radio"
                    class="custom-control-input"
                    value="relates_to"
                    id="rj-extend-linked-item-radio-option-relates-to"
                    checked />
                  <label class="custom-control-label" for="rj-extend-linked-item-radio-option-relates-to">
                    <span>relates to</span>
                    <!---->
                  </label>
                </div>
                <div class="gl-form-radio custom-control custom-radio">
                  <input type="radio" name="linked-issue-type-radio" class="custom-control-input" value="blocks" id="rj-extend-linked-item-radio-option-blocks">
                  <label class="custom-control-label" for="rj-extend-linked-item-radio-option-blocks">
                    <span>blocks</span>
                    <!---->
                  </label>
                </div>
                <div class="gl-form-radio custom-control custom-radio">
                  <input type="radio" name="linked-issue-type-radio" class="custom-control-input" value="is_blocked_by" id="rj-extend-linked-item-radio-is-blocked-by">
                  <label class="custom-control-label" for="rj-extend-linked-item-radio-is-blocked-by">
                    <span>is blocked by</span>
                    <!---->
                  </label>
                </div>
              </div>
              <!---->
              <!---->
              <!---->
            </div>
          </div>
          <div class="gl-mt-5">
            <button id="rj-extend-copy-btn" type="button" class="btn gl-mr-2 btn-confirm btn-sm gl-button">
              <!---->
              <!---->
              <span class="gl-button-text"> Copy Issue </span>
            </button>
            <button id="rj-extend-promote-epic-btn" type="button" class="btn gl-mr-2 btn-confirm btn-sm gl-button">
              <!---->
              <!---->
              <span class="gl-button-text"> Promote Epic Issue </span>
            </button>
          </div>
        </form>
      </div>
      <!---->
      <!---->

      <div id="rj-extend-linkeditem-create-issues-root" style="display:none">
        <label class="d-block label-bold col-form-label" style="margin-left:15px"> Created Issue:</label>
        <div class="js-add-related-issues-form-area related-issues-token-body bordered-box bg-white">
          <ul id="rj-extend-linkeditem-create-issues" class="content-list related-items-list">
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>
`

function GetCreateIssueItem(issueId, issueTitle) {
  return `
  <li class="list-item gl-m-0! gl-p-0!">
    <div class="item-body d-flex align-items-center gl-py-3 gl-px-5 issuable-info-container">
      <div class="item-contents gl-display-flex gl-align-items-center gl-flex-wrap gl-flex-grow-1 flex-xl-nowrap gl-min-h-7">
        <div class="item-title d-flex align-items-xl-center mb-xl-0 gl-min-w-0">
          <div>
            <svg data-testid="issue-open-m-icon" role="img" aria-label="opened" class="gl-mr-3 gl-icon s16 issue-token-state-icon-open gl-text-green-500 ic-issue-open-m" title="<span class=&quot;bold&quot;>Created</span> 6 months ago<br/><span class=&quot;text-tertiary&quot;>Aug 29, 2022 11:44am GMT+0800</span>"><use href="/assets/icons-5af6a635d810e1104f2def09ede3ada64866640a56f75b704457f18be086e881.svg#issue-open-m"></use></svg>
          </div>
          <a href="https://gitlab.rayark.com/deemo2/app/-/issues/${issueId}" class="gl-link sortable-link gl-font-weight-normal"> ${issueTitle} </a>
        </div>

      </div>
      <!---->
      <!---->
    </div>
  </li>
`
}

function GetCreateEpicIssueItem(issueId, issueTitle) {
  return `
  <li class="list-item gl-m-0! gl-p-0!">
    <div class="item-body d-flex align-items-center gl-py-3 gl-px-5 issuable-info-container">
      <div class="item-contents gl-display-flex gl-align-items-center gl-flex-wrap gl-flex-grow-1 flex-xl-nowrap gl-min-h-7">
        <div class="item-title d-flex align-items-xl-center mb-xl-0 gl-min-w-0">
          <div>
            <svg data-testid="issue-open-m-icon" role="img" aria-label="opened" class="gl-mr-3 gl-icon s16 issue-token-state-icon-open gl-text-green-500 ic-issue-open-m" title="<span class=&quot;bold&quot;>Created</span> 6 months ago<br/><span class=&quot;text-tertiary&quot;>Aug 29, 2022 11:44am GMT+0800</span>"><use href="/assets/icons-5af6a635d810e1104f2def09ede3ada64866640a56f75b704457f18be086e881.svg#issue-open-m"></use></svg>
          </div>
          <a href="https://gitlab.rayark.com/groups/deemo2/-/epics/${issueId}" class="gl-link sortable-link gl-font-weight-normal"> ${issueTitle} </a>
        </div>
      </div>
      <!---->
      <!---->
    </div>
  </li>
`
}


function Setup() {
  /* eslint-disable no-undef */
  console.log('Setup Quick Copy Issue')

  const root = document.querySelector('#related-issues').parentNode
  root.insertAdjacentHTML('beforeend', newIssueWidget)

  const openBtn = document.querySelector('#rj-extend-linked-item-open')
  openBtn.onclick = Open

  const closeBtn = document.querySelector('#rj-extend-linked-item-close')
  closeBtn.onclick = Close

  const copyBtn = document.querySelector('#rj-extend-copy-btn')
  copyBtn.onclick = Copy

  const promoteEpicBtn = document.querySelector('#rj-extend-promote-epic-btn')
  promoteEpicBtn.onclick = PromoteEpic

  const parent = document.getElementsByClassName('detail-page-description')[0].parentElement
  _GetOrCreateTokenButtons(parent)

  /* eslint-enable no-undef */
}

async function Copy() {

  const radioOptions = [
    '#rj-extend-linked-item-radio-option-relates-to',
    '#rj-extend-linked-item-radio-option-blocks',
    '#rj-extend-linked-item-radio-is-blocked-by'
  ]

  let relation = null
  for (let i = 0; i < radioOptions.length; ++i) {
    const radio = document.querySelector(radioOptions[i])
    if (radio.checked) {
      relation = radio.value
      break
    }
  }

  const ReadableRelation = {
    relates_to: 'Relates To',
    blocks: 'Blocks',
    is_blocked_by: 'Is Blocked By'
  }

  const createIssueDivRoot = document.querySelector('#rj-extend-linkeditem-create-issues-root')
  createIssueDivRoot.style.display = 'block'

  const selfId = new URL(location.href).pathname.split('/').reverse()[0]
  let issueMetadata = await CopyIssueAndLink(selfId,relation)
  const issueId = issueMetadata.iid
  const titleInput = issueMetadata.title

  if (issueId == null) {
    return
  }

  const createIssueRoot = document.querySelector('#rj-extend-linkeditem-create-issues')
  createIssueRoot.insertAdjacentHTML('afterbegin', GetCreateIssueItem(issueId, `[${ReadableRelation[relation]}]\t${titleInput}`))

  const copyBtn = document.querySelector('#rj-extend-copy-btn')
  copyBtn.textContent = 'Created!'
  setTimeout(() => { copyBtn.textContent = 'Copy Issue' }, 1000)

  const createdCount = document.querySelector('#rj-extend-created-count')
  createdCount.textContent = (parseInt(createdCount.textContent) + 1).toString()
}

async function PromoteEpic() {

  const createIssueDivRoot = document.querySelector('#rj-extend-linkeditem-create-issues-root')
  createIssueDivRoot.style.display = 'block'

  const selfId = new URL(location.href).pathname.split('/').reverse()[0]
  let issueMetadata = await CopyEpicIssueAndLink(selfId)
  const issueId = issueMetadata.iid
  const titleInput = issueMetadata.title

  if (issueId == null) {
    return
  }

  //console.log(issueMetadata)
  const createIssueRoot = document.querySelector('#rj-extend-linkeditem-create-issues')
  createIssueRoot.insertAdjacentHTML('afterbegin', GetCreateEpicIssueItem(issueId, `${titleInput}`))

  const promoteEpicBtn = document.querySelector('#rj-extend-promote-epic-btn')
  promoteEpicBtn.textContent = 'Created!'
  setTimeout(() => { promoteEpicBtn.textContent = 'Promote Epic Issue' }, 1000)

  const createdCount = document.querySelector('#rj-extend-created-count')
  createdCount.textContent = (parseInt(createdCount.textContent) + 1).toString()
}

async function CopyEpicIssueAndLink(targetId){
  let copyIssueMetadata = await CopyEpicIssue(targetId);

  if (copyIssueMetadata?.message === '401 Unauthorized') {
    alert('Unauthorized! Please check your access token.')
    return null
  }
  let targetIssueLinks = await GetIssueLinks(targetId)

  const epicIssueId = copyIssueMetadata.iid
  console.log(targetIssueLinks)

  for (let i = 0; i < targetIssueLinks.length; i++) {
      let metadata = await LinkEpicIssue(epicIssueId,targetIssueLinks[i].iid)
      if (metadata?.message === '401 Unauthorized') {
          alert('Unauthorized! Please check your access token.')
          return null
      }
  }
  // Remove target issue's link
  for (let i = 0; i < targetIssueLinks.length; i++) {
      let metadata = await RemoveIssueLink(targetId,targetIssueLinks[i].issue_link_id)
      if (metadata?.message === '401 Unauthorized') {
          alert('Unauthorized! Please check your access token.')
          return null
      }
  }
  // Remove target issue
  let metadata = await CloseIssue(targetId)
      if (metadata?.message === '401 Unauthorized') {
          alert('Unauthorized! Please check your access token.')
          return null
  }
  return copyIssueMetadata
}

function Open() {
  const body = document.querySelector('#rj-related-issues .linked-issues-card-body')
  body.style.display = 'block'

  const openBtn = document.querySelector('#rj-extend-linked-item-open')
  openBtn.style.display = 'none'

  const closeBtn = document.querySelector('#rj-extend-linked-item-close')
  closeBtn.style.display = ''
}

function Close() {
  const body = document.querySelector('#rj-related-issues .linked-issues-card-body')
  body.style.display = 'none'

  const openBtn = document.querySelector('#rj-extend-linked-item-open')
  openBtn.style.display = ''

  const closeBtn = document.querySelector('#rj-extend-linked-item-close')
  closeBtn.style.display = 'none'
}

async function CopyIssueAndLink(targetId, relation){
  let copyIssueMetadata = await CopyIssue(targetId);

  if (copyIssueMetadata?.message === '401 Unauthorized') {
    alert('Unauthorized! Please check your access token.')
    return null
  }

  const issueId = copyIssueMetadata.iid
  let metadata = await LinkIssue(issueId, targetId, relation)

  if (metadata?.message === '401 Unauthorized') {
    alert('Unauthorized! Please check your access token.')
    return null
  }

  return copyIssueMetadata
}

async function LinkIssue(issueId, targetId, relation) {
  let endPoint = `https://gitlab.rayark.com/api/v4/projects/${GITLAB_PROJECT_ID}/issues/${targetId}/links?target_project_id=${GITLAB_PROJECT_ID}&target_issue_iid=${issueId}&link_type=${relation}`
  if (relation === 'is_blocked_by') {
    // Reverse relationship setting to by pass bugs
    // https://gitlab.com/gitlab-org/gitlab/-/issues/271168
    endPoint = `https://gitlab.rayark.com/api/v4/projects/${GITLAB_PROJECT_ID}/issues/${issueId}/links?target_project_id=${GITLAB_PROJECT_ID}&target_issue_iid=${targetId}&link_type=blocks`
  }

  const resp = await fetch(endPoint, {
    method: 'POST',
    headers: {
      // eslint-disable-next-line no-undef
      'PRIVATE-TOKEN': _GetWriteAccessToken()
    }
  })
  const metadata = await resp.json()
  return metadata
}

async function LinkEpicIssue(epicId, targetIssueId) {
  let endPoint = `https://gitlab.rayark.com/api/v4/projects/${GITLAB_PROJECT_ID}/issues/${targetIssueId}?epic_iid=${epicId}`

  const resp = await fetch(endPoint, {
    method: 'PUT',
    headers: {
      // eslint-disable-next-line no-undef
      'PRIVATE-TOKEN': _GetWriteAccessToken()
    }
  })
  const metadata = await resp.json()
  return metadata
}

async function CopyIssue(targetIssueId){
  let targetIssueMetadata = await GetIssue(targetIssueId)
  const endPoint = `https://gitlab.rayark.com/api/v4/projects/${GITLAB_PROJECT_ID}/issues`

  //console.log(targetIssueMetadata)

  const requestData = {
    title: targetIssueMetadata.title,
    description: targetIssueMetadata.description,
    labels: targetIssueMetadata.labels,
    assignee_id: targetIssueMetadata.assignee_id,
    assignee_ids: targetIssueMetadata.assignees.map(assignee => assignee.id),
  };

  const resp = await fetch(endPoint, {
    method: 'POST',
    headers: {
      // eslint-disable-next-line no-undef
      'PRIVATE-TOKEN': _GetWriteAccessToken(),
      'Content-Type': "application/json",
    },
    body: JSON.stringify(requestData)
  })
  const metadata = await resp.json()
  return metadata
}

async function CopyEpicIssue(targetIssueId){
  let targetIssueMetadata = await GetIssue(targetIssueId)

  console.log(targetIssueMetadata)

  const requestData = {
    title: targetIssueMetadata.title,
    description: targetIssueMetadata.description,
    labels: targetIssueMetadata.labels,
  };

  const endPoint = `https://gitlab.rayark.com/api/v4/groups/${GITLAB_GROUP_ID}/epics`
  const resp = await fetch(endPoint, {
    method: 'POST',
    headers: {
      // eslint-disable-next-line no-undef
      'PRIVATE-TOKEN': _GetWriteAccessToken(),
      'Content-Type': "application/json",
    },
    body: JSON.stringify(requestData)
  })
  const metadata = await resp.json()
  return metadata
}

async function GetIssue(targetId){
  const endPoint = `https://gitlab.rayark.com/api/v4/projects/${GITLAB_PROJECT_ID}/issues/${targetId}`
  const resp = await fetch(endPoint, {
    method: 'GET',
    headers: {
      // eslint-disable-next-line no-undef
      'PRIVATE-TOKEN': _GetWriteAccessToken()
    }
  })
  const metadata = await resp.json()
  return metadata
}

async function GetIssueLinks(targetId){
  const endPoint = `https://gitlab.rayark.com/api/v4/projects/${GITLAB_PROJECT_ID}/issues/${targetId}/links`
  const resp = await fetch(endPoint, {
    method: 'GET',
    headers: {
      // eslint-disable-next-line no-undef
      'PRIVATE-TOKEN': _GetWriteAccessToken()
    }
  })
  const metadata = await resp.json()
  return metadata
}

async function CloseIssue(targetIssueId) {
  let endPoint = `https://gitlab.rayark.com/api/v4/projects/${GITLAB_PROJECT_ID}/issues/${targetIssueId}?state_event=close`

  const resp = await fetch(endPoint, {
    method: 'PUT',
    headers: {
      // eslint-disable-next-line no-undef
      'PRIVATE-TOKEN': _GetWriteAccessToken()
    }
  })
  const metadata = await resp.json()
  return metadata
}

async function RemoveIssueLink(targetIssueId,issueLinkId){
let endPoint = `https://gitlab.rayark.com/api/v4/projects/${GITLAB_PROJECT_ID}/issues/${targetIssueId}/links/${issueLinkId}`

  const resp = await fetch(endPoint, {
    method: 'DELETE',
    headers: {
      // eslint-disable-next-line no-undef
      'PRIVATE-TOKEN': _GetWriteAccessToken()
    }
  })
  const metadata = await resp.json()
  return metadata

}

(function () {
  'use strict'
  // eslint-disable-next-line no-undef
  _WaitUntilReady('#related-issues', Setup)
})()
