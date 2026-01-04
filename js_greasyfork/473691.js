// ==UserScript==
// @name         bLUEsonas
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Post from the bLUEsona of your choice!
// @author       Account Insurance
// @match        https://*.websight.blue/thread/*
// @license      GNU General Public License, version 2
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/473691/bLUEsonas.user.js
// @updateURL https://update.greasyfork.org/scripts/473691/bLUEsonas.meta.js
// ==/UserScript==
(function() {
  'use strict';

  const topicIdMatch = window.location.href.match(/thread\/(\d+)/);
  const topicId = topicIdMatch ? topicIdMatch[1] : null;

  const replyFormBox = document.querySelector('.reply-help');

  if (replyFormBox) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'use-bluesona';
    const label = document.createElement('label');
    label.htmlFor = 'use-bluesona';
    label.textContent = 'Use bLUEsona';

    const userInput = document.createElement('input');
    userInput.type = 'text';
    userInput.placeholder = 'From template...';
    userInput.style.display = 'none';
    userInput.style.margin = '10px 0 10px';

    replyFormBox.append(checkbox, label, userInput);

    const suggestionsContainer = document.createElement('select');
    suggestionsContainer.style.margin = '10px 0 10px';
    suggestionsContainer.style.maxWidth = '250px';
    suggestionsContainer.style.display = 'none';
    replyFormBox.appendChild(suggestionsContainer);

    const inputsContainer = document.createElement('div');
    inputsContainer.style.display = 'grid';
    inputsContainer.style.gridTemplateColumns = 'auto 1fr';
    inputsContainer.style.gap = '10px';

    function createLabeledInput(labelText, inputName) {
      const wrapper = document.createElement('div');
      wrapper.style.display = 'none';

      const label = document.createElement('label');
      label.textContent = labelText;
      label.style.fontWeight = 'bold';
      label.style.textAlign = 'right';

      const input = document.createElement('input');
      input.type = 'text';
      input.name = inputName;

      wrapper.appendChild(label);
      wrapper.appendChild(input);
      inputsContainer.appendChild(wrapper);
      return {
        input,
        wrapper
      };
    }

    const usernameComponents = createLabeledInput('Username:', 'username');
    const titleComponents = createLabeledInput('Title:', 'title');
    const avatarSrcComponents = createLabeledInput('Avatar Source:', 'avatarSrc');

    if (topicId) {
      const savedData = JSON.parse(localStorage.getItem(`profileData_${topicId}`)) || {};

      usernameComponents.input.value = savedData.username || '';
      titleComponents.input.value = savedData.title || '';
      avatarSrcComponents.input.value = savedData.avatarSrc || '';
    }

    const saveToLocalStorage = () => {
      if (topicId) {
        const dataToSave = {
          username: usernameComponents.input.value,
          title: titleComponents.input.value,
          avatarSrc: avatarSrcComponents.input.value
        };
        localStorage.setItem(`profileData_${topicId}`, JSON.stringify(dataToSave));
      }
    };

    usernameComponents.input.addEventListener('input', saveToLocalStorage);
    titleComponents.input.addEventListener('input', saveToLocalStorage);
    avatarSrcComponents.input.addEventListener('input', saveToLocalStorage);

    replyFormBox.appendChild(inputsContainer);

    checkbox.addEventListener('change', function() {
      const isCheckboxChecked = checkbox.checked;
      userInput.style.display = isCheckboxChecked ? 'block' : 'none';
      suggestionsContainer.style.display = isCheckboxChecked && userInput.value.trim() !== '' ? 'block' : 'none';
      usernameComponents.wrapper.style.display = isCheckboxChecked ? 'contents' : 'none';
      titleComponents.wrapper.style.display = isCheckboxChecked ? 'contents' : 'none';
      avatarSrcComponents.wrapper.style.display = isCheckboxChecked ? 'contents' : 'none';

    });

    let timeout = null;

    userInput.addEventListener('input', function() {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
          debugger;
        if (userInput.value.trim() === '') {
          suggestionsContainer.style.display = 'none';
          usernameComponents.input.value = '';
          titleComponents.input.value = '';
          avatarSrcComponents.input.value = '';
          saveToLocalStorage();
          return;
        }
        suggestionsContainer.style.display = 'block';
        fetch(`/users/?q=${encodeURIComponent(userInput.value)}`, {
            method: 'GET',
            credentials: 'include'
          })
          .then(response => response.text())
          .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const parsedUsers = parseHTMLContent(doc);

            suggestionsContainer.innerHTML = '';

            parsedUsers.forEach(user => {
              const userOption = document.createElement('option');
              userOption.textContent = user.username.length > 25 ? user.username.substr(0, 22) + '...' : user.username;
              userOption.title = user.username;
              userOption.value = JSON.stringify(user);
              suggestionsContainer.appendChild(userOption);
            });

            const firstUser = parsedUsers[0];
            if (firstUser) {
              usernameComponents.input.value = firstUser.username;
              titleComponents.input.value = firstUser.title || '';
              avatarSrcComponents.input.value = firstUser.avatarSrc || '';
            }

            saveToLocalStorage();

          });
      }, 250);
    });

    suggestionsContainer.addEventListener('change', function() {
      const selectedUser = JSON.parse(suggestionsContainer.value);
      usernameComponents.input.value = selectedUser.username;
      titleComponents.input.value = selectedUser.title || '';
      avatarSrcComponents.input.value = selectedUser.avatarSrc || '';
      saveToLocalStorage();
    });

    const form = document.getElementById('reply-form');
    const messageTextarea = document.getElementById('reply-content');

    form.addEventListener('submit', function(e) {
      if (checkbox.checked && usernameComponents.input.value) {
        e.stopPropagation();
        e.preventDefault();
        setDefaultProfile(false)
          .then(() => {
            const userData = {
              username: usernameComponents.input.value,
              avatarSrc: avatarSrcComponents.input.value,
              title: titleComponents.input.value
            };
            return sendProfileData(userData);
          })
          .then(() => {
            const formData = new FormData(form);
            formData.append('message', messageTextarea.value);
            return fetch(form.action, {
              method: form.method,
              body: formData
            });
          })
          .then(() => setDefaultProfile(true))
          .then(() => {
            messageTextarea.value = '';
          })
          .catch(err => {
            console.error('Error occurred:', err);
          });
      }
    }, true);
  }

  function parseHTMLContent(document) {
    const users = [];

    const messageTops = document.querySelectorAll('.message-top');
    const messageBodies = document.querySelectorAll('.message-body');

    for (let i = 0; i < messageTops.length; i++) {
      let user = {};

      const anchorElement = messageTops[i].querySelector('a');
      if (anchorElement) {
        user.username = anchorElement.textContent;
      }

      const imgElement = messageBodies[i].querySelector('.userpic-holder img');
      const titleElement = messageBodies[i].querySelector('.userpic center');

      if (imgElement) {
        user.avatarSrc = imgElement.src;
      }

      if (titleElement) {
        user.title = titleElement.textContent;
      }

      users.push(user);
    }

    return users;
  }

  function setDefaultProfile(useDefault) {
    const formData = new FormData();
    formData.append('use-default', useDefault);

    return fetch('/user/profile?ajax=1', {
      method: 'POST',
      body: formData
    });
  }

  async function sendProfileData(user) {
    try {
      let imageBlob;

      if (user.avatarSrc) {
        const imageResponse = await fetchGM({
          method: "GET",
          url: user.avatarSrc,
          responseType: "blob",
        });

        imageBlob = imageResponse.response;
      }

      let formData = new FormData();
      formData.append('user-name', user.username);
      formData.append('user-title', user.title || '');
      formData.append('user-pronoun', '');
      if (imageBlob) {
        formData.append('av-file', imageBlob, 'avatar.jpg');
      } else {
        formData.append('av-delete', 'on');
      }
      formData.append('user-desc', '');

      const url = Array.from(document.querySelectorAll('a'))
        .find(a => /^\/profile\/.+/.test(a.getAttribute('href')))
        .getAttribute('href');

      const profileResponse = await fetchGM({
        method: "POST",
        url: url,
        data: formData,
      });

      console.log(profileResponse.responseText);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  function fetchGM(options) {
    return new Promise((resolve, reject) => {
      options.onload = resolve;
      options.onerror = reject;
      GM_xmlhttpRequest(options);
    });
  }
})();