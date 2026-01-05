// ==UserScript==
// @name          gathering.tweakers.net - Add Topic Bookmark
// @homepageURL   https://github.com/sand3r/tampermonkey-scripts/tree/master/gathering_of_tweakers
// @namespace     gathering.tweakers.net
// @version       0.621
// @description   Makes the bookmark button for a post on the GoT Forum (gathering.tweakers.net) work asynchronously. Click Bookmark and wait for it to turn Green.
// @match         *://gathering.tweakers.net/forum/myreact
// @match         *://gathering.tweakers.net/forum/list_message*
// @include       http://gathering.tweakers.net
// @require       http://code.jquery.com/jquery-latest.js
// @author        Sander Thalen
// @downloadURL https://update.greasyfork.org/scripts/4669/gatheringtweakersnet%20-%20Add%20Topic%20Bookmark.user.js
// @updateURL https://update.greasyfork.org/scripts/4669/gatheringtweakersnet%20-%20Add%20Topic%20Bookmark.meta.js
// ==/UserScript==


class BookmarkManager {

  constructor() {
    this.bindButtons();
  }

  bindButtons() {
    jQuery('body').on('click', 'a[href*="insert_bookmark"]', (ev) => this.handleButtonClick(ev));
  }

  handleButtonClick(ev) {
    const $trigger = jQuery(ev.currentTarget);
    ev.preventDefault();
    this.execBookmark($trigger);
  }

  execBookmark($trigger) {
    const author = $trigger.parents('.message').find('.username a')[0].innerText;
    const topicName = jQuery('h1')[0].innerText;
    const folder = '11';
    const reactId = jQuery('[name="data[reactid]"]').val();
    const action = 'insert_bookmark';
    const messageId = $trigger.parents('div[data-message-id]').attr('data-message-id');
    const topicId = jQuery('[data-topicid]').attr('data-topicid');
    const httpReferrer = window.location.href;

    const bookmarkName = this.getBookmarkName(author, topicName);

    // Make call
    this.bookMarkAsync($trigger, bookmarkName, folder, reactId, action, messageId, topicId, httpReferrer);
  }

  bookMarkAsync($button, bookmarkName, folder, reactId, action, messageId, topicId, httpReferrer) {
    jQuery.ajax({
      url: 'https://gathering.tweakers.net/forum',
      type: 'POST',
      data: {
        'data[name]': bookmarkName,
        'data[folder]': folder,
        'data[reactid]': reactId,
        action,
        'data[messageid]': messageId,
        'data[topicid]': topicId,
        'data[http_referrer]': httpReferrer,
      },
    })
    .success(() => {
      this.unmarkButtons();
      this.markButton($button);
    });
  }

  getBookmarkName(author, topicName) {
    const fullBookmarkName = `${author} in ${topicName}`;
    const maxLength = 60;
    let bookmarkName = fullBookmarkName;
    let maxTopicLength;

    if (fullBookmarkName.length > maxLength) {
      maxTopicLength = maxLength - `${author} in `.length;
      bookmarkName = `${author} in ${topicName.substr(0, maxTopicLength - 4).trim()}...`;
    }
    return bookmarkName;
  }

  markButton($button) {
    // Change color on $button
    $button.prepend('<img src="https://tweakimg.net/g/icons/checkmark-green.png" class="js_tm_bookmarked_state" /> ');

    if (!$button.hasClass('js_tm_bookmark_button')) {
      $button.addClass('js_tm_bookmark_button');
    }

    $button.css({
      color: 'rgb(119, 164, 0)',
      'font-weight': 'bold',
    });
  }

  unmarkButtons() {
    jQuery('.js_tm_bookmarked_state').remove();
    jQuery('.js_tm_bookmark_button').removeAttr('style').empty().text('Bookmark');
  }

}

class GatheringOfTweakersExtended {

  constructor() {
    new BookmarkManager();
    this.updateForumHref();
  }

  updateForumHref() {
    jQuery('#navMenu .active a').attr('href', '//gathering.tweakers.net/forum/myreact').text('MyReact');
  }

}


new GatheringOfTweakersExtended();
