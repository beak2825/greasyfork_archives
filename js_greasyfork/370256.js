// ==UserScript==
// @name           Reddit - Quick RES user tagging
// @description    Quickly tag multiple users with the same tag and open the tag popup using the keyboard
// @author         James Skinner <spiralx@gmail.com> (http://github.com/spiralx)
// @namespace      http://spiralx.org/
// @version        2.2.0
// @license        MIT
// @icon           data:image/png;base64,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
// @supportURL     https://greasyfork.org/en/scripts/370256-reddit-quick-user-tagging/feedback
// @match          *://*.reddit.com/r/*
// @match          *://*.reddit.com/user/*
// @grant          none
// @run-at         document-end
// @require        https://unpkg.com/jquery@3/dist/jquery.min.js
// @require        https://greasyfork.org/scripts/389748-console-message-v2/code/console-message-v2.js?version=730537
// @downloadURL https://update.greasyfork.org/scripts/370256/Reddit%20-%20Quick%20RES%20user%20tagging.user.js
// @updateURL https://update.greasyfork.org/scripts/370256/Reddit%20-%20Quick%20RES%20user%20tagging.meta.js
// ==/UserScript==

/* jshint asi: true, esnext: true, laxbreak: true */
/* global jQuery, message */

/**

==== 2.2.0 (2022.07.24) ====
* Change name and description
* Add Q keyboard shortcut to open tag dialog
* Removed references to unused Watcher object
* Tidy up some code

==== 2.1.2 (2022.07.01) ====
* Update icon and add license metadata field

==== 2.1.1 (2022.04.16) ====
* Clicking 'Clear tag' closes tag popup

==== 2.1.0 (2021.11.05) ====
* Fix when ConsoleMessage not available

==== 2.0.5 (2021.06.08) ====
* Update icons

==== 2.0.4 (2021.06.02) ====
* Set width of tag dialog to 800px

==== 2.0.0 (2019.09.03) ====
* Rename script and update version to 2.0.0

==== 1.0.0 (2018.10.09) ====
* Rewrite code base
* Set previous tag on preset tag clicked

==== 0.9.0 (2018.10.09) ====
* Made tag modal wider and text smaller to accomodate more preset tags
* Added clear tag link to the right of the colour drop-down

==== 0.8.0 (2018.07.13) ====
* Changed console.message require to use GreasyFork

==== 0.7.0 (2018.02.13) ====
* Changed the rendering of the tag preview to match how RES does it
* Moved output to all use console.message

==== 0.6.0 (2018.02.11) ====
* Use unpkg.com for jQuery
* Add console.message for logging
* Use localstorage to save tags
* Use new Tag class to store tag info
* Updated ID for text field in tag popup

==== 0.5.1 (2018.02.11) ====
* Update icons to match other Reddit script

==== 0.5.0 (26.08.2017) ====
* Change to simple use of GM_getValue and GM_setValue for storage

==== 0.4.0 (21.08.2017) ====
* Update all other tags correctly when changing a user's tag
* Handle removing all other tags when clearing a user's tag

==== 0.3.0 (13.07.2017) ====

* Checks tag link to see if tag set, always overwrites if not
* Updates other tags for same user on current page

==== 0.2.1 (27.06.2017) ====
* Changed timeout of field set function to 250ms

==== 0.2.0 (31.05.2017) ====
* Updated jQuery to v3.2.1
* Added timeout before overriding tag/colour fields
* Update preview when setting tag/colour

*/

; (($, message) => {

  const STYLES = {
    func: { color: '#c41', 'font-weight': 'bold' },
    attr: { color: '#1a2', 'font-weight': 'bold' },
    value: { color: '#05f' },
    punc: { 'font-weight': 'bold' },
    // comment: { color: 'c1007f' },
    // error: { color: '#f4f', 'font-weight': 'bold' },
    // link: { color: '#05f', 'text-decoration': 'underline' },
  }

  // --------------------------------------------------------------------------

  if (message) {
    message().extend({
      tag({ text, colour }) {
        return this.text(text, {
          fontSize: '0.9em',
          padding: '0 4px',
          border: 'solid 1px rgb(199, 199, 199)',
          borderRadius: 3,
          ...getStyleForColour(colour)
        })
      }
    })
  }

  // --------------------------------------------------------------------------

  const TAG_STORAGE_KEY = 'resPreviousUserTag'

  const TAG_DIALOG_OPEN_TIMEOUT = 200

  const BACKGROUND_TO_TEXT_COLOUR_MAP = {
    none: 'inherit',
    aqua: 'black',
    lime: 'black',
    pink: 'black',
    silver: 'black',
    white: 'black',
    yellow: 'black'
  }

  const IGNORE_TAGS = new Set([ 'A', 'BUTTON', 'INPUT', 'TEXTAREA' ])

  // --------------------------------------------------------------------

  const CLEAR_TAG_LINK = `
    <a href="javascript:void(0)"
      title="Clear tag">
      clear tag
    </a>
  `

  const NO_PREVIEW_TAG = `
    <span class="RESUserTag">
      <a href="javascript:void 0"
         title="Set a tag"
         class="RESUserTagImage userTagLink truncateTag"
      >&nbsp;</a>
    </span>
  `

  const QUICK_REPEAT_TAG = `
    <span class="RESUserTag" style="filter: hue-rotate(90deg) saturate(0.5);">
      <a href="javascript:void 0"
         title="Repeat previous tag"
         class="RESUserTagImage userTagLink truncateTag"
      >&nbsp;</a>
    </span>
  `

  // --------------------------------------------------------------------------

  function getStyleForColour (colour) {
    return {
      color: BACKGROUND_TO_TEXT_COLOUR_MAP[ colour ] || 'white',
      backgroundColor: colour === 'none'
        ? 'transparent'
        : colour
    }
  }

  // --------------------------------------------------------------------------

  const getPreviewForTag = ({ text, colour }) => {
    const { color, backgroundColor } = getStyleForColour(colour)

    return `
      <span class="RESUserTag">
        <a href="javascript:void 0"
           title="${text}"
           class="userTagLink hasTag truncateTag"
           style="color: ${color}; background-color: ${backgroundColor};"
        >${text}</a>
      </span>
    `
  }

  // --------------------------------------------------------------------------

  const EMPTY_TAG = Object.freeze({
    text: '',
    colour: 'none'
  })

  const isEmptyTag = ({ text, colour } = EMPTY_TAG) => text === '' && colour === 'none'

  const areEqualTags = (a, b) => a.text === b.text && a.colour === b.colour

  // --------------------------------------------------------------------------

  let previousUserTag = EMPTY_TAG
  let ctx = null

  if (localStorage[ TAG_STORAGE_KEY ]) {
    previousUserTag = JSON.parse(localStorage[ TAG_STORAGE_KEY ])
  }

  if (message) {
    let msg = message()
      .text('reddit-save-res-tag.init', STYLES.func)
      .text(': ', STYLES.punc)

    if (!isEmptyTag(previousUserTag)) {
      msg = msg
        .text('previousUserTag', STYLES.attr)
        .text(' = ', STYLES.punc)
        .tag(previousUserTag)
    } else {
      msg = msg.text('No previous tag found')
    }

    msg.print()
  } else if (previousUserTag !== EMPTY_TAG) {
    console.log(`previousUserTag = %o`, previousUserTag)
  }

  // --------------------------------------------------------------------------

  class TagContext {
    constructor ($thingElem) {
      this.$thingElem = $thingElem

      this.authorId = $thingElem.data('author-fullname')

      this.$dialog = $('.userTagger-dialog-head').closest('.RESHover')

      this.user = $('.RESHover .RESHoverTitle .res-icon + span').text() || null

      this.$textField = $('#userTaggerText')
      this.$colourField = $('#userTaggerColor')
      this.$previewElem = $('#userTaggerPreview')
      this.$presetTags = $('#userTaggerPresetTags')
    }

    clearFields () {
      this.$textField.val('').focus()
      this.$colourField.val('none')
      this.$previewElem.html(NO_PREVIEW_TAG)
    }

    setFields ({ text, colour }) {
      this.$textField.val(text)
      this.$colourField.val(colour)
      this.$previewElem.html(getPreviewForTag({ text, colour }))
    }

    getTag () {
      return {
        text: this.$textField.val().trim(),
        colour: this.$colourField.val()
      }
    }
  }

  // --------------------------------------------------------------------------

  function onTagSelected (tag) {
    // console.info(`onTagSelected: tag = %o, ctx = %o, prevTag = %o`, tag, ctx, previousUserTag)

    if (message) {
      message()
        .text('onTagSelected', STYLES.func)
        .text('(', STYLES.punc)
        .text('tag', STYLES.attr)
        .text(': ', STYLES.punc)
        .tag(tag)
        .text('): ', STYLES.punc)
        .text('previousUserTag', STYLES.attr)
        .text(' = ', STYLES.punc)
        .tag(previousUserTag)
        .text(', ', STYLES.punc)
        .text('ctx', STYLES.attr)
        .text(' = ', STYLES.punc)
        .object(ctx)
        .print()
    }

    const $tagLinks = $(`.id-${ctx.authorId}`)
      .next()
      .children(0)

    if (isEmptyTag(tag)) {
      $tagLinks
        .html('&nbsp;')
        .css('background-color', 'transparent')
        .removeClass('hasTag')
        .addClass('RESUserTagImage')
    } else if (!areEqualTags(tag, previousUserTag)) {
      previousUserTag = tag
      localStorage[TAG_STORAGE_KEY] = JSON.stringify(previousUserTag)

      $tagLinks
        .text(tag.text)
        .css(getStyleForColour(tag.colour))
        .addClass('hasTag')
        .removeClass('RESUserTagImage')
    }

    ctx = null
  }

  // --------------------------------------------------------------------------

  function onTagClicked ($tagLink) {
      const $thing = $tagLink.closest('.thing')

      // console.info(`a.userTagLink.click`, this, $thing)

      setTimeout(() => {
        ctx = new TagContext($thing)
        ctx.$dialog.width(800)

        const authorHasTag = $tagLink.hasClass('hasTag')

        if (!authorHasTag && !isEmptyTag(previousUserTag)) {
          ctx.setFields(previousUserTag)
        }

        $(CLEAR_TAG_LINK)
          .click(function () {
            ctx.clearFields()
            $('#userTaggerSave').click()
            return false
          })
          .css({ marginLeft: 'auto' })
          .insertAfter(ctx.$colourField)

        const $srcField = ctx.$previewElem.parent().next()

        ctx.$presetTags
          .one('click.resrem', '.userTagLink', function () {
            const $clicked = $(this)
            const clickedTag = {
              text: $clicked.text(),
              colour: $clicked.css('background-color')
            }

            // console.info(`preset .userTagLink.click`, this, clickedTag, ctx)
            onTagSelected(clickedTag)
          })
          .parent()
            .insertBefore($srcField)

        $srcField.next().css({ float: 'left', width: '50%' })
      }, TAG_DIALOG_OPEN_TIMEOUT)
  }

  // --------------------------------------------------------------------------

  $('body')
    .on('click.resrem', '.RESUserTag', function () {
      const $tagLink = $(this).children('a.userTagLink')
      onTagClicked($tagLink)
    })
    .on('click.resrem', '#userTaggerSave', function () {
      if (ctx) {
        onTagSelected(ctx.getTag())
      }
    })
    .on('keypress.resrem', event => {
      if (ctx || event.key !== 'q' || IGNORE_TAGS.has(event.target.tagName)) {
        return
      }

      $('div.thing.comment.noncollapsed.res-selected .entry.res-selected .RESUserTag').click()

      return false
    })

  // --------------------------------------------------------------------------

  /*
  <div class="RESHover RESHoverInfoCard RESDialogSmall" style="top: 387.918px; left: 215.767px; width: 350px; display: block; opacity: 1;">
    <h3 class="RESHoverTitle" data-hover-element="0">
      <div>
        <span class="res-icon"></span>&nbsp;<span>Plan-Six</span>
      </div>
    </h3>

    <div class="RESCloseButton">x</div>

    <div class="RESHoverBody RESDialogContents" data-hover-element="1">
      <form id="userTaggerToolTip">
        <div class="fieldPair">
          <label class="fieldPair-label" for="userTaggerText">Text</label>

          <input class="fieldPair-text" type="text" id="userTaggerText">
        </div>

        <div class="fieldPair">
          <label class="fieldPair-label" for="userTaggerColor">Color</label>

          <select id="userTaggerColor">
            <option style="color: inherit; background-color: none" value="none">none</option>
            <option style="color: black; background-color: aqua" value="aqua">aqua</option>
            <option style="color: white; background-color: black" value="black">black</option>
            <option style="color: white; background-color: blue" value="blue">blue</option>
            <option style="color: white; background-color: cornflowerblue" value="cornflowerblue">cornflowerblue</option>
            <option style="color: white; background-color: fuchsia" value="fuchsia">fuchsia</option>
            <option style="color: white; background-color: gray" value="gray">gray</option>
            <option style="color: white; background-color: green" value="green">green</option>
            <option style="color: black; background-color: lime" value="lime">lime</option>
            <option style="color: white; background-color: maroon" value="maroon">maroon</option>
            <option style="color: white; background-color: navy" value="navy">navy</option>
            <option style="color: white; background-color: olive" value="olive">olive</option>
            <option style="color: white; background-color: orange" value="orange">orange</option>
            <option style="color: white; background-color: orangered" value="orangered">orangered</option>
            <option style="color: black; background-color: pink" value="pink">pink</option>
            <option style="color: white; background-color: purple" value="purple">purple</option>
            <option style="color: white; background-color: red" value="red">red</option>
            <option style="color: black; background-color: silver" value="silver">silver</option>
            <option style="color: white; background-color: teal" value="teal">teal</option>
            <option style="color: black; background-color: white" value="white">white</option>
            <option style="color: black; background-color: yellow" value="yellow">yellow</option>
          </select>
        </div>

        <div class="fieldPair">
          <label class="fieldPair-label" for="userTaggerPreview">Preview</label>

          <span id="userTaggerPreview" style="color: white; background-color: olive;">
            <span class="RESUserTag">
              <a class="userTagLink hasTag truncateTag" style="background-color: olive; color: white !important;" title="Sexist" href="javascript:void 0">Sexist</a>
            </span>
          </span>
        </div>
        <a class="userTagLink hasTag truncateTag" style="background-color: olive; color: white !important;" title="Feminist" href="javascript:void 0">Feminist</a>

        <div class="fieldPair res-usertag-ignore">
          <label class="fieldPair-label" for="userTaggerIgnore">Ignore</label>

          <div id="userTaggerIgnoreContainer" class="toggleButton ">
            <span class="toggleThumb"></span>
            <div class="toggleLabel res-icon" data-enabled-text="" data-disabled-text=""></div>
            <input id="userTaggerIgnore" name="userTaggerIgnore" type="checkbox">
          </div>

          <a class="gearIcon" href="#res:settings/userTagger/hardIgnore" title="RES Settings > User Tagger > hardIgnore"> configure </a>
        </div>

        <div class="fieldPair">
          <label class="fieldPair-label" for="userTaggerLink">
            <span class="userTaggerOpenLink">
              <a title="open link" href="javascript:void 0">Source URL</a>
            </span>
          </label>

          <input class="fieldPair-text" type="text" id="userTaggerLink" value="https://www.reddit.com/r/giantbomb/comments/7x251d/all_systems_goku_02/du5fpwr/">
        </div>

        <div class="fieldPair">
          <label class="fieldPair-label" for="userTaggerVotesUp" title="Upvotes you have given this redditor">Upvotes</label>

          <input type="number" style="width: 50px;" id="userTaggerVotesUp" value="0">
        </div>

        <div class="fieldPair">
          <label class="fieldPair-label" for="userTaggerVotesDown" title="Downvotes you have given this redditor">Downvotes</label>

          <input type="number" style="width: 50px;" id="userTaggerVotesDown" value="0">
        </div>

        <div class="res-usertagger-footer">
          <a href="/r/dashboard#userTaggerContents" target="_blank" rel="noopener noreferer">View tagged users</a>

          <input type="submit" id="userTaggerSave" value="✓ save tag">
        </div>
      </form>
    </div>
  </div>

  */

})(jQuery, typeof message !== 'undefined' ? message : null)

jQuery.noConflict(true)
