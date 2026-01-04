// ==UserScript==
// @name        Ausbildungsauswähler
// @namespace   leeSalami
// @version     0.4.1
// @author      leeSalami
// @license     All Rights Reserved
// @description Wählt die gewünschte Personenanzahl für die entsprechende Ausbildung aus.
// @match       https://*.leitstellenspiel.de/buildings/*
// @run-at      document-idle
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/517697/Ausbildungsausw%C3%A4hler.user.js
// @updateURL https://update.greasyfork.org/scripts/517697/Ausbildungsausw%C3%A4hler.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  if (!document.getElementById('schooling')) {
    return;
  }

  if (typeof schooling_check_educated_counter_load === 'function') {
    const buildingId = window.location.pathname.split('/').reverse()[0];

    schooling_check_educated_counter_load = (load_building_id) => {
      const headingElement = $('#personal-select-heading-building-' + load_building_id);
      const education = headingElement.data('need_load_education');
      headingElement.data('need_load_education', '-1');

      if (typeof education !== 'undefined' && education !== '-1') {
        $.ajax({
          url: '/buildings/' + buildingId + '/schoolingEducationCheck?education=' + education + '&only_building_id='  + load_building_id
        }).success((data) => {
          eval(data);
          headingElement.attr('data-education-loaded', 'true');
        });
      }
    }

    unsafeWindow.update_schooling_free ??= () => {};
  }

  let cancelled = false;
  await waitForElm('#accordion');
  addInputElements();
  const schoolingFreeElement = document.getElementById('schooling_free');

  async function selectPersonnel(e) {
    e.preventDefault();
    const button = e.currentTarget;
    const personnelAmountElement = document.getElementById('personnel-amount');
    const minBuildingPersonnelElement = document.getElementById('min-personnel');
    const maxBuildingPersonnelElement = document.getElementById('max-personnel');

    if (personnelAmountElement.value === '' || !document.getElementById('education_select').value) {
      return;
    }

    button.disabled = true;
    personnelAmountElement.disabled = true;
    minBuildingPersonnelElement.disabled = true;
    maxBuildingPersonnelElement.disabled = true;

    let minBuildingPersonnel = 0;
    let maxBuildingPersonnel = 999;

    if (minBuildingPersonnelElement.value !== '') {
      minBuildingPersonnel = parseInt(minBuildingPersonnelElement.value);
    }

    if (maxBuildingPersonnelElement.value !== '') {
      maxBuildingPersonnel = parseInt(maxBuildingPersonnelElement.value);
    }

    const nonDigitPattern = /\D/g;
    const personnelAmount = parseInt(personnelAmountElement.value);
    const buildingHeadingElements = document.querySelectorAll('.panel.panel-default:not(.hidden):not([style*="display: none"]) > .personal-select-heading[building_id]');

    for (let i = 0, n = buildingHeadingElements.length; i < n; i++) {
      if (cancelled) {
        break;
      }

      if (i === 0) {
        buildingHeadingElements[i].dispatchEvent(new CustomEvent('scroll', {bubbles: true}));
      }

      const buildingPersonnel = parseInt(buildingHeadingElements[i].querySelector('.pull-right > span.label-default')?.innerText?.replace(nonDigitPattern, '') ?? 0);

      if (buildingPersonnel < minBuildingPersonnel || buildingPersonnel > maxBuildingPersonnel) {
        continue;
      }

      if (!isVisible(buildingHeadingElements[i])) {
        buildingHeadingElements[i].scrollIntoView(true);
      }

      const buildingId = buildingHeadingElements[i].getAttribute('building_id');
      await waitForElm('#personal-select-heading-building-' + buildingId + '[data-education-loaded="true"]');

      const educatedCount = parseInt(buildingHeadingElements[i].querySelector('.pull-right > .personal-select-heading-building > .label-success')?.innerText?.replace(nonDigitPattern, '') ?? 0);
      const educatingCount = parseInt(buildingHeadingElements[i].querySelector('.pull-right > .personal-select-heading-building > .label-info')?.innerText?.replace(nonDigitPattern, '') ?? 0);
      const selectedCount = parseInt(buildingHeadingElements[i].querySelector('.pull-right > .label-primary')?.innerText?.replace(nonDigitPattern, '') ?? 0);
      const educationsNeeded = personnelAmount - educatedCount - educatingCount - selectedCount;

      if (parseInt(schoolingFreeElement.innerText.trim()) < educationsNeeded || cancelled) {
        break;
      }

      if (educationsNeeded <= 0) {
        continue;
      }

      const capacityButton = buildingHeadingElements[i].querySelector('.schooling-personnel-select-button[data-capacity]');
      const originalCapacity = capacityButton.dataset.capacity;
      capacityButton.dataset.capacity = educationsNeeded.toString();
      capacityButton.click();
      await waitForElm('#personnel-selection-counter-' + buildingId);
      capacityButton.dataset.capacity = originalCapacity;
      await new Promise(r => setTimeout(r, 100));
    }

    personnelAmountElement.disabled = false;
    minBuildingPersonnelElement.disabled = false;
    maxBuildingPersonnelElement.disabled = false;
    button.disabled = false;
    cancelled = false;
  }

  function cancelSelection(e) {
    e.preventDefault();
    cancelled = true;
  }

  function addInputElements() {
    const submitButton = document.querySelector('.navbar-fixed-bottom input[name="commit"]');

    if (!submitButton) {
      return;
    }

    const buttonWrapper = document.createElement('div');
    buttonWrapper.className = 'btn-group';
    submitButton.insertAdjacentElement('afterend', buttonWrapper);

    const button = document.createElement('input');
    button.type = 'submit';
    button.className = 'btn btn-success navbar-btn';
    button.value = 'Auswählen';
    button.style.marginLeft = '15px';
    button.addEventListener('click', selectPersonnel);
    buttonWrapper.append(button);

    const cancelButton = document.createElement('input');
    cancelButton.type = 'submit';
    cancelButton.className = 'btn btn-default navbar-btn';
    cancelButton.value = 'Abbrechen';
    cancelButton.addEventListener('click', cancelSelection);
    buttonWrapper.append(cancelButton);

    const personnelAmount = document.createElement('input');
    personnelAmount.type = 'number';
    personnelAmount.id = 'personnel-amount';
    personnelAmount.placeholder = 'Anzahl je Wache';
    personnelAmount.style.marginLeft = '5px';
    personnelAmount.min = '1';
    buttonWrapper.insertAdjacentElement('afterend', personnelAmount);

    const minBuildingPersonnel = document.createElement('input');
    minBuildingPersonnel.type = 'number';
    minBuildingPersonnel.id = 'min-personnel';
    minBuildingPersonnel.placeholder = 'min. Personal je Wache';
    minBuildingPersonnel.style.marginLeft = '5px';
    minBuildingPersonnel.min = '0';
    personnelAmount.insertAdjacentElement('afterend', minBuildingPersonnel);

    const maxBuildingPersonnel = document.createElement('input');
    maxBuildingPersonnel.type = 'number';
    maxBuildingPersonnel.id = 'max-personnel';
    maxBuildingPersonnel.placeholder = 'max. Personal je Wache';
    maxBuildingPersonnel.style.marginLeft = '5px';
    maxBuildingPersonnel.min = '0';
    minBuildingPersonnel.insertAdjacentElement('afterend', maxBuildingPersonnel);
  }

  function isVisible(element) {
    const rect = element.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  function waitForElm(selector) {
    return new Promise(resolve => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          observer.disconnect();
          resolve(document.querySelector(selector));
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }
})();
