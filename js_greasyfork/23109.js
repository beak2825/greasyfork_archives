// ==UserScript==
// @name        Pixiv Tag Translation/Replacement
// @description Shows translations of tags on Pixiv and prompts for untranslated tags.
// @namespace   http://scripts.chris.charabaruk.com/pixiv.net/~tag-translation
// @author      coldacid
// @include     http://www.pixiv.net/
// @include     http://www.pixiv.net/*
// @include     http://pixiv.net/
// @include     http://pixiv.net/*
// @include     https://www.pixiv.net/
// @include     https://www.pixiv.net/*
// @include     https://pixiv.net/
// @include     https://pixiv.net/*
// @version     1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/23109/Pixiv%20Tag%20TranslationReplacement.user.js
// @updateURL https://update.greasyfork.org/scripts/23109/Pixiv%20Tag%20TranslationReplacement.meta.js
// ==/UserScript==

var TagsCollection;
{
  const USER_DATA_KEY = 'com.charabaruk.chris.pixiv.net.tag-translation';
  let version = 1;
  let settings = null;
  let map = null;

  let loadData = function () {
    var userData = window.localStorage[USER_DATA_KEY];
    if (userData) {
      userData = JSON.parse(userData);
    } else {
      userData = {};
    }

    version = userData.version || 1;

    settings = userData.settings || {
      showOriginalTag: true, // or false, or array containing zero or more of ['label', 'hover']
      promptForTranslations: true // or false
    };

    var tags = userData.tags || {
      "R-18": null,
      "3D": null
    };
    tags[Symbol.iterator] = function* () { for (var tag in this) yield [tag, this[tag]]; };
    map = new Map(tags);

    return [version, settings, map];
  };
  let saveData = function () {
    // so we don't overwrite changes made in other tabs, grab the current data first when saving
    var userData = JSON.parse(window.localStorage[USER_DATA_KEY] || `{"version": "${version}", "settings": {}, "tags": {}}`);

    userData.settings = settings; // use current settings
    for (var [k, v] of map.entries()) { userData.tags[k] = v; } // yes, overwrite existing tags when merging

    window.localStorage[USER_DATA_KEY] = JSON.stringify(userData);
  };

  let updateHandlers = new Map();
  let runHandlers = function (tag, translation) {
    for (var [obj, handler] of updateHandlers.entries()) {
      try {
        handler.call(obj, tag, translation);
      } catch (err) {
        console.error('tag translation update handler threw', err);
      }
    }
  };

  window.addEventListener('storage', evt => {
    if (evt.key !== USER_DATA_KEY) { return; }

    console.info("Another tab has updated tag translations, merging");
    var tags = JSON.parse(evt.newValue || "{tags: null}").tags;
    if (!tags) { return; }

    for(var key of Object.getOwnPropertyNames(tags)) {
      if (!map.has(key) || map.get(key) !== tags[key]) {
        console.info(`"${key}": "${map.get(key)}" => "${tags[key]}"`);
        map.set(key, tags[key]); // take remote version over existing one
        runHandlers(key, tags[key]);
      }
    }
  }, false);

  TagsCollection = function TagsCollection () {
    var [version, settings, map] = loadData();

    Object.defineProperty(this, 'version', {value: version});
    Object.defineProperty(this, 'settings', {value: settings});

    Object.defineProperty(this, 'tagUpdated', {
      get: function () { return updateHandler.has(this) ? updateHandler.get(this) : null; },
      set: function (handler) {
        if (!handler || typeof handler !== 'function') {
          updateHandlers.delete(this);
        } else {
          updateHandlers.set(this, handler);
        }
      }
    });
  };

  TagsCollection.prototype.has = function (tag) { return map.has(tag); };
  TagsCollection.prototype.get = function (tag) { return map.get(tag) || tag; };
  TagsCollection.prototype.set = function (tag, translation) {
    if (translation === undefined) {
      if (tag.entries) {
        for (var [key, value] of tag.entries()) {
          map.set(key, value);
        }
      } else if (tag[Symbol.iterator]) {
        for (var [key, value] of tag) {
          map.set(key, value);
        }
      } else if (tag instanceof Object) {
        for (var key of Object.getOwnPropertyNames(tag)) {
          map.set(key, tag[key]);
        }
      } else {
        throw new Error('missing translation');
      }
    } else {
      map.set(tag, translation);
    }

    saveData();
  };
  TagsCollection.prototype.delete = function (tag) {
    map.delete(tag);
    saveData();
  };

  TagsCollection.prototype.tags = function* () { for (var entry of map.entries()) yield entry; };
  TagsCollection.prototype.translations = function () {
    var reversed = {};
    reversed[Symbol.iterator] = function* () { for (var key in this) yield [key, this[key]]; };

    for (var [key, value] of map.entries()) {
      reversed[value] = reversed[value] || [];
      reversed[value].push(key);
    }

    return reversed;
  };

  TagsCollection.prototype.translatedAs = function (translation) {
    translation = translation || '';

    var tags = [];
    for (var [key, value] of map.entries()) {
      if ((value || '').toLowerCase() === translation.toLowerCase())
        tags.push(key);
    }
    return tags;
  };
}

function GM_main ($) {
  var tags = new TagsCollection();
  window.translatedTags = tags;

  var settings = tags.settings;

  function setTagText(node, tag) {
    if (Array.isArray(node) || node instanceof jQuery) {
      node = node[0];
    }

    var showOriginalTag = settings.showOriginalTag,
        showInLabel = showOriginalTag === true || showOriginalTag.indexOf('label') !== -1,
        showOnHover = showOriginalTag === true || showOriginalTag.indexOf('hover') !== -1;

    var $element = $(node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement),
        originalTag = $element.attr('data-tag-translator-original') || $element.text();

    var tagLabel = showInLabel ? `${tag} (${originalTag})` : tag;

    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent = tagLabel;
    } else {
      $element.text(tagLabel);
    }

    $element.attr('data-tag-translator-current', tag);
    if (showOnHover) {
      $element.attr('title', originalTag);
    }
  }

  var tagSelectors = [
    'li.tag > a:not([class~="portal"]):not([target="_blank"])',
    'div.tag-name',
    'section.favorite-tag > ul.favorite-tags > li > a:not([class~="portal"]):not([target="_blank"])',
    'nav.breadcrumb > span a[href^="/tags.php?tag="] > span[itemprop="title"]',
    'ul.tagCloud > li > a:not([class~="portal"]):not([target="_blank"])',
    'ul.tags > li > a:not([class~="portal"]):not([target="_blank"])',
    'table.ws_table td.td2 > a[href^="personal_tags.php?tag="]',
    'div.bookmark-list-unit ul.tag-cloud > li > span.tag[data-tag]',
    'dl.tag-list a.tag-name:not([class~="portal"]):not([target="_blank"])',
    'ul.tag-list a.tag-name:not([class~="portal"]):not([target="_blank"])',
    'h1.column-title > a.self[href^="/search.php"]'
  ].join(', ');

  var untranslated = new Map();
  // content page regular tags, home page featured tags, home page favorite tags
  $(tagSelectors)
    .contents()
    .filter((i, n) => n.nodeType === Node.TEXT_NODE) // only get the text nodes within the selected elements
    .each((i, n) => {
      var $node = $(n),
          tag = $node.text();

      // save original tag value, add edit translation button
      $(n.nodeType === Node.ELEMENT_NODE ? n : n.parentElement)
        .attr('data-tag-translator-original', tag)
        .append('<span class="tags tag-translator-added" style="position:relative;"><span class="portal retranslate">j</span></span>');

      if (tags.has(tag)) {
        // if we have a translation for the tag, update the text for it
        var tl = tags.get(tag);
        console.debug(`Replacing tag "${tag}" with "${tl}"`);
        setTagText($node, tl);
      } else {
        if (!settings.promptForTranslations) {
          // we aren't going to bother with asking for translations, so nothing more to do
          return;
        } else if (/^[\x20-\x7e]*$/.test(tag)) {
          // tag is entirely ASCII, so skip it and go onto the next node for processing
          console.debug(`"${tag}" only uses ASCII printable characters, skipping`);
          return;
        } else {
          // if we don't have a translation and the tag isn't ASCII text, add to the untranslated list
          console.debug(`No translation available for tag "${tag}", adding to the list`);
          let nodes = untranslated.has(tag) ? untranslated.get(tag) : [];
          nodes.push($node);
          untranslated.set(tag, nodes);
        }
      }
    });

  // prompt for translations
  if (untranslated.size > 0) {
    var taglist = Array.from(untranslated.keys()).join(', '),
        tagcount = untranslated.size;
    if (window.confirm(`There are ${tagcount} untranslated tags. Want to translate?\n\nTags: ${taglist}`)) {
      var translations = new Map(), i = 1;
      for (var [tag, $nodes] of untranslated.entries()) {
        // try getting a translated version anyway, just in case it got translated on another tab
        var translated = window.prompt(
          `Translation for: ${tag}\n\nLeave empty to cancel translating, leave as-is to skip [${i++}/${tagcount}]`,
          tags.get(tag));
        if (!translated) { break; }

        // only save if the translation is different from the original tag
        if (tag !== translated) {
          translations.set(tag, translated);
          $nodes.forEach($n => setTagText($n, translated));
        }
      }
      tags.set(translations);
    }
  }

  // set up tag updating
  tags.tagUpdated = (tag, translation) => {
    if (!translation) { translation = tag; } // sanity: if no translation, at least keep the original tag value

    $(`[data-tag-translator-original="${tag}"]`)
      .contents()
      .filter((i, n) => n.nodeType === Node.TEXT_NODE)
      .each((i, n) => setTagText(n, translation));
  };

  // set up translation editing
  $('[data-tag-translator-original] .retranslate').click(function (evt) { // has to be function for proper `this`
    evt.stopPropagation();
    evt.preventDefault();

    var $this = $(this),
        $parent = $($this.parents('[data-tag-translator-original]')[0]),
        tag = $parent.attr('data-tag-translator-original'),
        translation = $parent.attr('data-tag-translator-current') || tags.get(tag),
        $matching = $(`[data-tag-translator-original="${tag}"]`).contents().filter((i, n) => n.nodeType === Node.TEXT_NODE);

    var translated = window.prompt(
      `Translation for: ${tag}\n\nLeave as-is to cancel, clear text to remove translation`,
      translation);
    if (translated === translation) {
      console.debug(`Translation for "${tag}" unchanged`);
      return; // nothing to do
    } else if (!translated) {
      console.debug(`Deleting translation for "${tag}"`);
      tags.delete(tag);
      translated = tag;
    } else {
      console.debug(`Updating translation for "${tag}" from "${translation}" to "${translated}"`);
      tags.set(tag, translated);
    }

    $matching.each((i, n) => setTagText(n, translated));
  });
}

if (typeof jQuery === 'function') {
  console.debug(`Using local jQuery, version ${jQuery.fn.jquery}`);
  GM_main(jQuery);
} else {
  if (jQuery != null) {
    console.debug('No jQuery found');
  } else {
    console.debug(`jQuery is a ${typeof jQuery}`);
  }
  console.debug('Loading jQuery from Google CDN');
  add_jQuery(GM_main, '3.2.1');
}

function add_jQuery(callbackFn, jqVersion) {
  jqVersion      = jqVersion || "3.2.1";
  var D          = document,
      targ       = D.getElementsByTagName('head')[0] || D.body || D.documentElement,
      scriptNode = D.createElement('script');

  scriptNode.src = `//ajax.googleapis.com/ajax/libs/jquery/${jqVersion}/jquery.min.js`;
  scriptNode.addEventListener('load', function () {
    var scriptNode         = D.createElement('script');
    scriptNode.textContent = 'var gm_jQuery = jQuery.noConflict(true);\n(' + callbackFn.toString() + ')(gm_jQuery);';
    targ.appendChild(scriptNode);
  }, false);
  targ.appendChild(scriptNode);
}