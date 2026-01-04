// ==UserScript==
// @name         GGn Upload Blocker Manager
// @namespace    https://greasyfork.org/users/1395131
// @version      1.1
// @author       SleepingGiant
// @description  The "library" version of upload blocker. Import this with @require and use the APIs to standardize blocking uploads in GGn.
// @match        https://gazellegames.net/*
// @grant        none
// ==/UserScript==
// @export UploadBlockerManager

(function (global) {
  'use strict';
  const reasonListId = 'ggn-block-reasons';

  class UploadBlockerManager {
    constructor(submitButton) {
      this.submitButton = submitButton;
      this.originalText = submitButton.value;
      this.reasonContainer = this._ensureReasonList();
    }

    _ensureReasonList() {
      let ul = document.getElementById(reasonListId);
      if (!ul) {
        ul = document.createElement('ul');
        ul.id = reasonListId;
        ul.style.marginTop = '0.5em';
        ul.style.color = 'red';
        ul.style.listStyleType = 'none';
        this.submitButton.parentNode.insertBefore(ul, this.submitButton.nextSibling);
      }
      return ul;
    }

    addReason(text) {
      if (!this._hasReason(text)) {
        const li = document.createElement('li');
        li.textContent = text;
        this.reasonContainer.appendChild(li);
      }
      this._updateButtonState();
    }

    removeReason(text) {
      for (const li of Array.from(this.reasonContainer.children)) {
        if (li.textContent === text) {
          li.remove();
          break;
        }
      }
      this._updateButtonState();
    }

    _hasReason(text) {
      return Array.from(this.reasonContainer.children)
        .some(li => li.textContent === text);
    }

    _updateButtonState() {
      const hasBlockers = this.reasonContainer.children.length > 0;
      const override = document.querySelector('#upload-blocker-override')?.checked;

      if (hasBlockers && !override) {
        this.submitButton.disabled = true;
        this.submitButton.style.opacity = '0.5';
        this.submitButton.style.pointerEvents = 'none';
        this.submitButton.value = 'Uploading Blocked';
      } else {
        this.submitButton.disabled = false;
        this.submitButton.style.opacity = '1';
        this.submitButton.style.pointerEvents = 'auto';
        this.submitButton.value = this.originalText;
      }
    }

    attachOverrideCheckbox() {
      if (!document.getElementById('upload-blocker-override')) {
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.id = 'upload-blocker-override';
        cb.style.marginLeft = '0.5em';
        cb.addEventListener('change', () => this._updateButtonState());

        const label = document.createElement('label');
        label.htmlFor = cb.id;
        label.textContent = ' Override blockers';
        label.style.marginLeft = '0.25em';

        this.submitButton.parentNode.insertBefore(cb, this.submitButton.nextSibling);
        this.submitButton.parentNode.insertBefore(label, cb.nextSibling);
      }
    }

  }

  // Export into global so other scripts can import it
  global.UploadBlockerManager = UploadBlockerManager;

})(window);
