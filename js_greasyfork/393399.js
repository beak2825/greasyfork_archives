// ==UserScript==
// @name         Drafts in TweetDeck
// @namespace    https://ciffelia.com/
// @version      1.0.0
// @description  Save drafts in TweetDeck
// @author       Ciffelia <mc.prince.0203@gmail.com> (https://ciffelia.com/)
// @license      MIT
// @homepage     https://github.com/ciffelia/drafts-in-tweetdeck#readme
// @supportURL   https://github.com/ciffelia/drafts-in-tweetdeck/issues
// @include      https://tweetdeck.twitter.com/
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393399/Drafts%20in%20TweetDeck.user.js
// @updateURL https://update.greasyfork.org/scripts/393399/Drafts%20in%20TweetDeck.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 何故か$がundefinedになるので

  class DraftsStorage {
    static readDrafts () {
      const json = localStorage.getItem('draftsInTweetDeck') || '[]';
      return JSON.parse(json)
    }

    static updateDrafts (drafts) {
      const json = JSON.stringify(drafts);
      localStorage.setItem('draftsInTweetDeck', json);
    }

    static cleanDrafts () {
      localStorage.removeItem('draftsInTweetDeck');
    }

    static addDraft (text) {
      const drafts = this.readDrafts();
      drafts.unshift(text);
      this.updateDrafts(drafts);
    }

    static removeDraft (i) {
      const drafts = this.readDrafts();
      drafts.splice(i, 1);
      this.updateDrafts(drafts);
    }
  }

  class DraftList {
    init (selectHandler) {
      this.selectHandler = selectHandler;

      this.$draftList = jQuery(
        '<div class="popover" style="max-height: 300px; width: 242px; overflow-wrap: break-word; overflow-y: scroll"></div>'
      );
      this.$draftList.hide();

      const drafts = DraftsStorage.readDrafts();

      if (drafts.length !== 0) {
        for (const [i, draftText] of drafts.entries()) {
          this._createDraftItemElem(i, draftText).appendTo(this.$draftList);
        }
      } else {
        this.$draftList.html(`
        <div style="width: 100%; height: 100px; display: flex; justify-content: center; align-items: center">
          <p style="color: #8899a6; font-size: 16px">No drafts saved.</p>
        </div>
      `);
      }
    }

    _createDraftItemElem (i, text) {
      const $draft = jQuery(
        `<article class="stream-item is-actionable"><div class="item-box">${text}</div></article>`
      );
      $draft.click(() => {
        this._hide();
        DraftsStorage.removeDraft(i);
        this.selectHandler(text);
      });
      return $draft
    }

    _show () {
      this.$draftList.show();

      setTimeout(() => {
        jQuery(document).on('click.hideDrafts', e => {
          if (jQuery(e.target).closest(this.$draftList).length === 0) this._hide();
        });
      }, 0);
    }

    _hide () {
      this.$draftList.hide();

      jQuery(document).off('click.hideDrafts');
    }
  }

  class App {
    constructor () {
      this.init = this.init.bind(this);
      this.handleComposerOpen = this.handleComposerOpen.bind(this);
      this.handleComposeTextChange = this.handleComposeTextChange.bind(this);
      this.handleButtonClick = this.handleButtonClick.bind(this);
      this.handleDraftSelect = this.handleDraftSelect.bind(this);

      this.$buttonWrapper = jQuery('<div class="pull-left"></div>');
      this.$button = jQuery(
        '<button class="Button--primary btn-extra-height padding-v--6 padding-h--12"></button>'
      );
      this.$button.click(this.handleButtonClick);
      this.$button.appendTo(this.$buttonWrapper);

      this.draftList = new DraftList();
    }

    init () {
      this.$composer = jQuery('.drawer[data-drawer="compose"]');
      this.$composer.arrive('div.compose', this.handleComposerOpen);
    }

    handleComposerOpen () {
      this.$composerCloseButton = this.$composer.find('.js-compose-close');

      this.$composeText = this.$composer.find('.compose-text');
      this.$composeText.on('input', this.handleComposeTextChange);

      this.$buttonsRow = this.$composer
        .find('.js-send-button-container')
        .closest('.cf');
      this.$buttonWrapper.prependTo(this.$buttonsRow);

      this.draftList.init(this.handleDraftSelect);
      this.draftList.$draftList.insertAfter(this.$buttonsRow);

      this.handleComposeTextChange();
    }

    handleComposeTextChange () {
      if (this.$composeText.val() === '') this.$button.text('View drafts');
      else this.$button.text('Save');
    }

    handleButtonClick () {
      if (this.$composeText.val() === '') this.draftList._show();
      else this.saveToDrafts();
    }

    handleDraftSelect (draft) {
      this.$composeText.val(draft);
      this.$composeText[0].dispatchEvent(new Event('input'));
    }

    closeComposer () {
      this.$composerCloseButton.click();
    }

    saveToDrafts () {
      const text = this.$composeText.val();
      if (text === '') return

      DraftsStorage.addDraft(text);
      this.closeComposer();
    }
  }

  const app = new App();
  const arriveOptions = { onceOnly: true, existing: true };
  jQuery(document).arrive('.drawer[data-drawer="compose"]', arriveOptions, app.init);

}());
