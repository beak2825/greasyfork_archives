// ==UserScript==
// @name        berx
// @namespace   Taywee
// @description Codeberg extensions.  Also works for other forgejo and gitea hosts.
// @match       https://codeberg.org/*
// @version     1.4.7
// @author      Taylor C. Richberger
// @homepageURL https://codeberg.org/Taywee/berx
// @license     MPL-2.0
// @grant       GM.setClipboard
// @downloadURL https://update.greasyfork.org/scripts/475254/berx.user.js
// @updateURL https://update.greasyfork.org/scripts/475254/berx.meta.js
// ==/UserScript==

(function () {
'use strict';

const settings_path = '/user/settings/applications';
const storage_key = 'berx-access-key';
function auth_header() {
  const key = localStorage.getItem(storage_key);
  if (!key) {
    return null;
  }
  return `token ${key}`;
}
function setup_token_settings() {
  const document_fragment = document.createDocumentFragment();
  if (localStorage.getItem(storage_key) === null) {
    const form = document_fragment.appendChild(document.createElement('form'));
    form.classList.add('ui', 'form', 'ignore-dirty');
    const field = form.appendChild(document.createElement('div'));
    field.classList.add('field');
    const label = field.appendChild(document.createElement('label'));
    label.setAttribute('for', 'berx-token');
    label.textContent = 'Token';
    const input = field.appendChild(document.createElement('input'));
    input.id = 'berx-token';
    input.name = 'berx-token';
    const flash_key = document.querySelector('.flash-info.flash-message p')?.textContent;
    if (flash_key != null) {
      input.value = flash_key;
    }
    const button = form.appendChild(document.createElement('button'));
    button.classList.add('button', 'ui', 'green');
    button.textContent = 'Submit';
    button.type = 'button';
    button.addEventListener('click', () => {
      localStorage.setItem(storage_key, input.value);
      setup_token_settings();
    });
  } else {
    const right_float = document_fragment.appendChild(document.createElement('div'));
    right_float.classList.add('right', 'floated', 'content');
    const button = right_float.appendChild(document.createElement('button'));
    button.type = 'button';
    button.classList.add('ui', 'red', 'tiny', 'button', 'delete-button');
    button.textContent = 'Delete';
    const p = document_fragment.appendChild(document.createElement('p'));
    p.textContent = 'An Access Token is set.';
    button.addEventListener('click', () => {
      localStorage.removeItem(storage_key);
      setup_token_settings();
    });
  }
  const token_item = document.getElementById('berx-token-item');
  token_item?.replaceChildren(document_fragment);
}
if (window.location.pathname === settings_path) {
  const user_setting_content = document.querySelector('.user-setting-content');
  const header = document.createElement('h4');
  header.classList.add('ui', 'top', 'attached', 'header');
  header.textContent = 'berx Access Token';
  const body = document.createElement('div');
  body.classList.add('ui', 'attached', 'segment', 'bottom');
  const key_list = body.appendChild(document.createElement('div'));
  key_list.classList.add('ui', 'key', 'list');
  const description = key_list.appendChild(document.createElement('div'));
  description.classList.add('item');
  description.textContent = 'To function, berx needs an Access Token with write:issue and write:repository.';
  const token_item = key_list.appendChild(document.createElement('div'));
  token_item.classList.add('item');
  token_item.id = 'berx-token-item';
  const document_fragment = document.createDocumentFragment();
  document_fragment.appendChild(header);
  document_fragment.appendChild(body);
  user_setting_content?.children[0].before(document_fragment);
  setup_token_settings();
}

const issue_regex = /^\/(?<owner>[^/]+)\/(?<repo>[^/]+)\/issues\/(?<index>\d+)$/;
const illegal = /[^A-Za-z0-9-]+/g;
const refs_heads = /^refs\/heads\//;
const trailing_hyphens = /-+$/;
const path = window.location.pathname;

/// If the value is undefined, return an empty array, otherwise return an array
/// with the single element.
function filter(value) {
  if (value === undefined) {
    return [];
  } else {
    return [value];
  }
}
async function setup_issue_pr(groups, output) {
  const info = message => {
    output.appendChild(document.createElement('li')).textContent = message;
  };
  const key = auth_header();
  if (!key) {
    info(`API key is not set, redirecting to settings.`);
    window.location.href = '/user/settings/applications';
    return;
  }
  const authorization = key;
  async function request(path, extras = {}) {
    const response = await fetch(path, {
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      ...extras
    });
    if (!response.ok) {
      throw new Error(`Fetch response had error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  }
  function get(path) {
    return request(path);
  }
  function post(path, body) {
    return request(path, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }
  function patch(path, body) {
    return request(path, {
      method: 'PATCH',
      body: JSON.stringify(body)
    });
  }
  const api_base = '/api/v1';
  function getIssue(owner, repo, index) {
    owner = encodeURIComponent(owner);
    repo = encodeURIComponent(repo);
    return get(`${api_base}/repos/${owner}/${repo}/issues/${index}`);
  }
  function getRepo(owner, repo) {
    owner = encodeURIComponent(owner);
    repo = encodeURIComponent(repo);
    return get(`${api_base}/repos/${owner}/${repo}`);
  }
  function getBranch(owner, repo, branch) {
    owner = encodeURIComponent(owner);
    repo = encodeURIComponent(repo);
    branch = encodeURIComponent(branch);
    return get(`${api_base}/repos/${owner}/${repo}/branches/${branch}`);
  }
  function getPullRequests(owner, repo) {
    owner = encodeURIComponent(owner);
    repo = encodeURIComponent(repo);
    return get(`${api_base}/repos/${owner}/${repo}/pulls?state=open`);
  }
  function createBranch(owner, repo, options) {
    owner = encodeURIComponent(owner);
    repo = encodeURIComponent(repo);
    return post(`${api_base}/repos/${owner}/${repo}/branches`, options);
  }
  function createPullRequest(owner, repo, options) {
    owner = encodeURIComponent(owner);
    repo = encodeURIComponent(repo);
    return post(`${api_base}/repos/${owner}/${repo}/pulls`, options);
  }
  function editIssue(owner, repo, index, options) {
    owner = encodeURIComponent(owner);
    repo = encodeURIComponent(repo);
    return patch(`${api_base}/repos/${owner}/${repo}/issues/${index}`, options);
  }
  const owner = groups.owner;
  const repo = groups.repo;
  const index = parseInt(groups.index, 10);
  const [issue, repository] = await Promise.all([getIssue(owner, repo, index), getRepo(owner, repo)]);
  let branch;
  if (issue.ref) {
    branch = await getBranch(owner, repo, issue.ref.replace(refs_heads, ''));
  } else {
    const branch_title = issue?.title?.toLowerCase()?.replaceAll(illegal, '-')?.substring(0, 128)?.replace(trailing_hyphens, '');
    const branch_name = branch_title ? `issues/${index}-${branch_title}` : `issues/${index}`;
    try {
      info(`Trying to find branch by name ${branch_name}`);
      branch = await getBranch(owner, repo, branch_name);
    } catch (_) {
      branch = await createBranch(owner, repo, {
        new_branch_name: branch_name,
        old_ref_name: `heads/${repository.default_branch}`
      });
    }
    info(`Assigning branch ${branch_name} to issue`);
    await editIssue(owner, repo, index, {
      ref: branch_name
    });
  }
  info(`Finding open pull request for branch`);
  const pull_requests = await getPullRequests(owner, repo);
  let pull_request = pull_requests.find(each => each?.head?.ref === branch.name);
  if (pull_request == null) {
    info(`Creating pull request for branch`);
    pull_request = await createPullRequest(owner, repo, {
      assignees: issue.assignees?.map(user => user?.login)?.flatMap(filter),
      base: repository.default_branch,
      body: issue.body ? `${issue.body}\n\ncloses #${issue.number}` : `closes #${issue.number}`,
      due_date: issue.due_date,
      head: branch.name,
      labels: issue.labels?.map(label => label.id).flatMap(filter),
      milestone: issue.milestone?.id,
      title: issue.title ? `WIP: ${issue.title}` : undefined
    });
  }
  info(`Copying text to clipboard`);
  GM.setClipboard(`git fetch origin; git switch ${branch.name}`);
  const pr = `/${owner}/${repo}/pulls/${pull_request.number}`;
  info(`Redirecting to ${pr}`);
  window.location.href = pr;
}
const match = issue_regex.exec(path);
if (match !== null) {
  const groups = match.groups;
  const fragment = document.createDocumentFragment();
  const button = fragment.appendChild(document.createElement('button'));
  const output = fragment.appendChild(document.createElement('ul'));
  const info = message => {
    output.appendChild(document.createElement('li')).textContent = message;
  };
  button.classList.add('ui', 'green', 'icon', 'button');
  button.textContent = 'Add branch and PR';
  const select_branch = document.querySelector('.select-branch');
  select_branch?.after(fragment);
  button.addEventListener('click', async () => {
    try {
      await setup_issue_pr(groups, output);
    } catch (error) {
      info(`Error: ${error}. Trying one more time.`);
      try {
        await setup_issue_pr(groups, output);
      } catch (error) {
        info(`Error: ${error}.  Trying again will work quite often.`);
      }
    }
  });
}

})();
