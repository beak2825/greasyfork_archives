// ==UserScript==
// @name         Bitbucket Server Multiple Pull Request Templates
// @namespace    https://github.com/kellyselden
// @version      8
// @description  Support multiple pull request templates
// @author       Kelly Selden
// @license      MIT
// @source       https://github.com/kellyselden/bitbucket-server-multiple-pull-request-templates
// @supportURL   https://github.com/kellyselden/bitbucket-server-multiple-pull-request-templates/issues/new
// @include      http*://*bitbucket*/projects/*/repos/*/pull-requests?create*
// @downloadURL https://update.greasyfork.org/scripts/517242/Bitbucket%20Server%20Multiple%20Pull%20Request%20Templates.user.js
// @updateURL https://update.greasyfork.org/scripts/517242/Bitbucket%20Server%20Multiple%20Pull%20Request%20Templates.meta.js
// ==/UserScript==
'use strict';

let container = document.getElementById('compare-and-create-container');

function getEditor() {
  return container.querySelector('.CodeMirror').CodeMirror;
}

function listener(event) {
  let editor = getEditor();

  editor.setValue(event.target.value);
}

function stripExtension(fileName) {
  let i = fileName.lastIndexOf('.');

  if (i === -1 || i === 0) {
    return fileName;
  }

  return fileName.substring(0, i);
}

const selectId = 'custom-pull-request-templates-select';

async function run(formBodySide) {
  let templatesPath = '.pull-request-templates';

  let sourceBranch = new URL(document.URL).searchParams.get('sourceBranch').replace('refs/heads/', '');

  let { project, repo } = document.URL.match(/\/projects\/(?<project>\w+)\/repos\/(?<repo>\S+)\/pull-requests/).groups;

  let response = await fetch(`/rest/api/1.0/projects/${project}/repos/${repo}/files/${templatesPath}?at=${sourceBranch}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  let data = await response.json();

  if (data.errors) {
    for (let error of data.errors) {
      if (error.exceptionName === 'com.atlassian.bitbucket.content.NoSuchPathException') {
        console.log(error);
      } else {
        console.error(error);
      }
    }

    return;
  }

  let files = data.values.reduce((files, file) => {
    let name = stripExtension(file);

    if (name.toUpperCase() !== 'README') {
      files.push({
        file,
        name,
      });
    }

    return files;
  }, []);

  let pullRequestTemplates = await Promise.all(files.map(async ({ file, name }) => {
    let response = await fetch(`/rest/api/1.0/projects/${project}/repos/${repo}/raw/${templatesPath}/${file}?at=${sourceBranch}`);

    let text = await response.text();

    return {
      name,
      text,
    };
  }));

  pullRequestTemplates = pullRequestTemplates.reduce((pullRequestTemplates, { name, text }) => {
    pullRequestTemplates[name] = text;

    return pullRequestTemplates;
  }, {});

  let extension = document.createElement('div');

  extension.id = 'custom-pull-request-templates';
  extension.classList.add('create-pull-request-form-extension');

  let labelElement = document.createElement('label');
  labelElement.htmlFor = selectId;
  labelElement.textContent = 'Pull request template: ';

  let selectElement = document.createElement('select');
  selectElement.id = selectId;

  let defaultKey = 'default';
  let defaultValue = pullRequestTemplates[defaultKey] ?? editor.getValue();

  let editor = getEditor();

  let option = document.createElement('option');
  option.value = defaultValue;
  option.textContent = defaultKey;
  selectElement.appendChild(option);

  editor.setValue(defaultValue);

  delete pullRequestTemplates[defaultKey];

  for (let [team, template] of Object.entries(pullRequestTemplates)) {
    let option = document.createElement('option');
    option.value = template;
    option.textContent = team;
    selectElement.appendChild(option);
  }

  selectElement.addEventListener('change', listener);

  extension.appendChild(labelElement);
  extension.appendChild(selectElement);

  formBodySide.appendChild(extension);
}

function find(node, query) {
  if (node.matches?.(query)) {
    return node;
  } else {
    return node.querySelector?.(query);
  }
}

new MutationObserver(mutationsList => {
  for (let mutation of mutationsList) {
    if (mutation.type === 'childList') {
      for (let node of mutation.addedNodes) {
        let formBodySide = find(node, '.form-body-side');

        if (formBodySide) {
          run(formBodySide);
        }
      }

      for (let node of mutation.removedNodes) {
        let select = find(node, `#${selectId}`);

        if (select) {
          select.removeEventListener('change', listener);
        }
      }
    }
  }
}).observe(container, {
  subtree: true,
  childList: true,
});
