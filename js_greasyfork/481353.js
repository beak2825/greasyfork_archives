// ==UserScript==
// @name        Wukong Version Compare Message Generator
// @match       https://jihulab.com/yuanli/wukong/-/compare/*
// @grant       none
// @version     1.0
// @license MIT
// @author      -
// @description 2022/4/24 10:52:14
//
// @namespace https://greasyfork.org/users/1125286
// @downloadURL https://update.greasyfork.org/scripts/481353/Wukong%20Version%20Compare%20Message%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/481353/Wukong%20Version%20Compare%20Message%20Generator.meta.js
// ==/UserScript==

function main() {
  const button = insertButton(() => {
    const commits = getCommitList();
    const commitTitles = Array.from(commits).map((commit) =>
      getCommitTitle(commit)
    );
    const filteredTitles = filterForNonMergeCommit(commitTitles);
    const groupedCommits = getGroupedCommits(filteredTitles);
    const stringifiedContent = stringifyGroupedCommits(groupedCommits);
    console.log(stringifiedContent);
    copyToClipboard(stringifiedContent);
  });
}

function getCommitList() {
  const contentList = document.querySelector(
    'main#content-body ul.content-list'
  );

  console.log("contentList", contentList);
  const commits = contentList.querySelectorAll('.commit-content');
  return commits;
}

function getCommitTitle(commit) {
  console.log("commit", commit);
  const commitRowMessages = commit.querySelectorAll(
    '.commit-row-message'
  );
  const commitTitle = Array.from(commitRowMessages).reduce((title, message) => {
    title += message.innerText;
    return title;
  }, '');
  return formatCommitRawText(commitTitle);
}

function formatCommitRawText(text) {
  return text.split('\n')[0];
}

function filterForNonMergeCommit(commits) {
  return commits.filter((commit) => !commit.startsWith('[MERGE]'));
}

function getGroupedCommits(commits) {
  const groupedCommits = {};
  commits.forEach((commit) => {
    const prefix = commit.split(':')[0].toUpperCase();
    if (groupedCommits[prefix]) {
      groupedCommits[prefix].push(commit);
    } else {
      groupedCommits[prefix] = [commit];
    }
  });
  return groupedCommits;
}

function stringifyGroupedCommits(groupedCommits) {
  const contentRows = [];
  Object.keys(groupedCommits).forEach((prefix) => {
    contentRows.push(`## ${prefix}`);
    contentRows.push('');
    groupedCommits[prefix].forEach((commit) => {
      contentRows.push(`- ${commit}`);
    });
    contentRows.push('');
  });
  return contentRows.join('\n');
}

function insertButton(onclick) {
  const buttonContainer = Array.from(
    document.querySelectorAll('.js-signature-container form > div')
  )[1];
  const newButton = document.createElement('button');
  newButton.innerText = 'Generate Version Compare Message';
  newButton.className = 'btn btn-default btn-md gl-button';
  newButton.type = 'button';
  newButton.onclick = onclick;
  buttonContainer.appendChild(newButton);
  return newButton;
}

function copyToClipboard(content) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(content);
    // alert('Copied to Clipboard!')
  } else {
    alert('Clipboard Privilege required!');
  }
}

(function () {
  let loaded = false;
  window.onmousemove = () => {
    if (loaded) {
      return;
    }
    loaded = true;
    main();
  };
})();
