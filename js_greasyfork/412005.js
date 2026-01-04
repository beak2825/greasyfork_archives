// ==UserScript==
// @name         KIT Moodle subject hide tool
// @namespace    https://f0reach.me
// @version      0.1.0
// @description  KIT Moodleのマイページで指定した科目を非表示にします
// @author       f0reachARR
// @match        https://moodle.cis.kit.ac.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412005/KIT%20Moodle%20subject%20hide%20tool.user.js
// @updateURL https://update.greasyfork.org/scripts/412005/KIT%20Moodle%20subject%20hide%20tool.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const COURSE_STORAGE_KEY = 'hidden_course';
  function getHiddenCourse() {
    const hiddenCourse = localStorage.getItem(COURSE_STORAGE_KEY);
    if (
      hiddenCourse === null ||
      hiddenCourse === undefined ||
      hiddenCourse === ''
    ) {
      return [];
    }

    return hiddenCourse.split(',');
  }

  function toggleHiddenCourse(courseId) {
    const list = getHiddenCourse();
    if (!list.includes(courseId)) {
      list.push(courseId);
    } else {
      list.splice(list.indexOf(courseId), 1);
    }
    localStorage.setItem(COURSE_STORAGE_KEY, list.join(','));
  }

  function hiddenCourseSelector() {
    if (!location.href.endsWith('/my/')) return;

    const hiddenId = getHiddenCourse();
    const courseListElem = document.querySelector('.content .course_list');
    if (!courseListElem) return;

    for (const title of courseListElem
      .querySelectorAll('.course_title h2')
      .values()) {
      const link = title.querySelector('a');
      if (!link) continue;

      const linkHref = link.getAttribute('href');
      const courseId = linkHref.match(/\?id=(\d+)/)[1];
      if (!courseId) continue;

      let button = title.querySelector('button');
      if (!button) {
        button = document.createElement('button');
        title.appendChild(button);
        button.addEventListener('click', () => {
          toggleHiddenCourse(courseId);
          hiddenCourseSelector();
        });
      }

      const hidden = hiddenId.includes(courseId);
      button.textContent = hidden ? '表示する' : '非表示する';
      button.className = hidden ? 'btn-primary' : '';
      link.style.color = hidden ? '#c2c2c2' : '#0070a8';
    }
  }

  function hideSidebarCourse() {
    const cssTag = document.createElement('style');
    cssTag.appendChild(document.createTextNode(''));
    document.head.appendChild(cssTag);
    for (const course of getHiddenCourse()) {
      cssTag.sheet.insertRule(
        `p.tree_item[data-node-type="20"][data-node-key="${course}"] { display: none; }`,
      );
    }
  }

  hiddenCourseSelector();
  hideSidebarCourse();
})();
