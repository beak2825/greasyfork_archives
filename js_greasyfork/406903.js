// ==UserScript==
// @name         KIT Moodle utils
// @namespace    https://f0reach.me
// @version      0.1.1
// @description  KIT Moodle用の拡張です
// @author       f0reachARR
// @match        https://moodle.cis.kit.ac.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406903/KIT%20Moodle%20utils.user.js
// @updateURL https://update.greasyfork.org/scripts/406903/KIT%20Moodle%20utils.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function getTopicListToggleState(classId) {
    const state = localStorage.getItem(`toggle_topic_${classId}`);
    if (!state) return [];

    return (
      state
        .split(',')
        .filter((n) => n.length > 0)
        .map((n) => Number(n)) || []
    );
  }

  function updateTopicListToggleState(classId, sectionId, open) {
    const state = getTopicListToggleState(classId);
    const newState = [...state, sectionId].filter(
      (id) => id !== sectionId || open,
    );
    localStorage.setItem(`toggle_topic_${classId}`, newState.join(','));
  }

  function toggleTopicList() {
    const topics = document.querySelector('.topics');
    if (!topics || topics.classList.contains('expand-topics')) return;
    topics.classList.add('expand-topics');

    const classId = location.search.match(/id=(\d+)/) ? Number(RegExp.$1) : -1;

    const sections = topics.querySelectorAll('li.section.main');
    const openedIndexes = getTopicListToggleState(classId);

    sections.forEach((section, index) => {
      section.style.paddingBottom = 0;

      section
        .querySelectorAll('div.left.side')
        .forEach((elem) => elem.remove());
      section
        .querySelectorAll('div.right.side')
        .forEach((elem) => elem.remove());

      const content = section.querySelector('.content');

      const sectionName = content.querySelector('.sectionname > span');
      if (!sectionName) return;

      const summary = document.createElement('summary');
      const newSectionName = document.createElement('b');
      newSectionName.append(sectionName.textContent);
      summary.append(newSectionName);
      sectionName.remove();

      const details = document.createElement('details');
      details.appendChild(summary);
      details.appendChild(content.cloneNode(true));

      if (
        (!content.querySelector('.summary') ||
          content.querySelector('.summary').childNodes.length === 0) &&
        (!content.querySelector('.section') ||
          content.querySelector('.section').childNodes.length === 0)
      ) {
        summary.style.color = '#aaa';
      }

      if (openedIndexes.includes(index)) {
        details.open = true;
      }

      details.addEventListener('toggle', () => {
        updateTopicListToggleState(classId, index, details.open);
      });

      content.replaceWith(details);
    });
  }

  if (location.href.match(/\/course\/view\.php/)) {
    toggleTopicList();
  }
})();
