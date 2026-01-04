// ==UserScript==
// @name         KITソフトウェア演習自動保存
// @namespace    https://f0reach.me
// @version      0.1
// @description  KITソフトウェア演習でコードを自動保存します
// @author       f0reachARR
// @match        https://moodle.cis.kit.ac.jp/pluginfile.php/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412197/KIT%E3%82%BD%E3%83%95%E3%83%88%E3%82%A6%E3%82%A7%E3%82%A2%E6%BC%94%E7%BF%92%E8%87%AA%E5%8B%95%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/412197/KIT%E3%82%BD%E3%83%95%E3%83%88%E3%82%A6%E3%82%A7%E3%82%A2%E6%BC%94%E7%BF%92%E8%87%AA%E5%8B%95%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function saveTextBoxes(textAreaList, storageKey) {
    const json = [];
    for (const [index, area] of textAreaList.entries()) {
      json[index] = area.value;
    }

    localStorage.setItem(storageKey, JSON.stringify(json));
  }

  function setLogText(text) {
    const textParentElem = document.querySelector('hr + font[color="red"]');
    if (!textParentElem) {
      console.log(text);
      return;
    }

    let textElem = textParentElem.querySelector('span');
    if (!textElem) {
      textElem = document.createElement('span');
      textParentElem.appendChild(textElem);
    }

    textElem.textContent = text;
  }

  const kadaiIdInput = document.querySelector('input[name="kadai_num"]');
  if (!kadaiIdInput) return;
  const kadaiId = kadaiIdInput.value;

  const courseIdInput = document.querySelector('input[name="courseidnumber"]');
  if (!courseIdInput) return;
  const courseId = courseIdInput.value;

  const storageKey = `se_kadai_${courseId}_${kadaiId}`;

  const textAreaList = document.querySelectorAll('textarea');

  const savedCode = localStorage.getItem(storageKey);
  if (savedCode) {
    const codesArray = JSON.parse(savedCode);
    if (textAreaList.length !== codesArray.length) {
      alert('Submission form was updated. Some answers would not be saved');
    }

    textAreaList.forEach((area, index) => {
      if (codesArray[index]) {
        area.value = codesArray[index];
      }
    });
    setLogText('Loaded at ' + new Date().toString());
  }

  textAreaList.forEach((area, index) => {
    // Add input check for all text boxes
    area.required = true;
    area.addEventListener('change', () => {
      saveTextBoxes(textAreaList, storageKey);
      setLogText('Saved at ' + new Date().toString());
    });
  });
})();
