// ==UserScript==
// @name        Duolingo Unlocker
// @namespace   noplanman
// @description ABANDONED Allows you to practice any skill and adds a few niceties to the UI.
// @include     https://www.duolingo.com/
// @version     1.1
// @author      Armando Lüscher
// @oujs:author noplanman
// @copyright   2016 Armando Lüscher
// @grant       GM_addStyle
// @grant       window
// @require     https://code.jquery.com/jquery-1.12.4.min.js
// @homepageURL https://github.com/noplanman/Duolingo-Unlocker
// @supportURL  https://github.com/noplanman/Duolingo-Unlocker/issues
// @downloadURL https://update.greasyfork.org/scripts/22147/Duolingo%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/22147/Duolingo%20Unlocker.meta.js
// ==/UserScript==

/**
 * Main Duolingo Unlocker object.
 *
 * @type {Object}
 */
var DU = {};

/**
 * Debugging level. (disabled,[l]og,[i]nfo,[w]arning,[e]rror)
 *
 * @type {Boolean}
 */
DU.debugLevel = 'l';

/**
 * Load the necessary data variables.
 */
DU.loadVariables = function() {
  DU.user = unsafeWindow.duo.user.attributes;
  DU.lang = DU.user.language_data[DU.user.learning_language];
  DU.skills = {};
  jQuery.each(DU.lang.skills.models, function(i, skill) {
    DU.skills[skill.attributes.short] = skill.attributes;
  });
  DU.log('Variables loaded');
};

/**
 * Unlock all the locked items and convert them to links.
 */
DU.unlockTree = function() {
  var unlockedSkills = [];
  jQuery('.skill-tree-row:not(.bonus-row, .row-shortcut) .skill-badge-small.locked').each(function() {
    var $skillItemOld = jQuery(this).removeClass('locked').addClass('skill-item');

    // Get just the text of the skill (without the number of excercises)
    var skillNameShort = $skillItemOld.find('.skill-badge-name')
      .clone().children().remove()
      .end().text().trim();
    var skill = DU.skills[skillNameShort];

    $skillItem = jQuery('<a/>', {
      'html'       : $skillItemOld.html(),
      'class'      : $skillItemOld.attr('class'),
      'data-skill' : skill.name,
      'href'       : '/skill/' + DU.lang.language + '/' + skill.url_title,
    });

    $skillItem.find('.skill-icon')
      .removeClass('locked')
      .addClass('unlocked')
      .addClass(skill.icon_color);

    // Replace the <span/> with the new <a/> element
    $skillItemOld.replaceWith($skillItem);

    unlockedSkills.push(skill);
  });

  DU.log('Skill tree unlocked: ' + unlockedSkills.length + ' new skills unlocked');
};

/**
 * Add the progress bar for the level, showing how many points are needed to level up.
 *
 * @todo What happens when a tree is finished? It should just be a full bar.
 */
DU.progressBar = function() {
  var progressText = DU.lang.level_percent + '%  ( ' + DU.lang.level_progress + ' / ' + DU.lang.level_points + ' )';
  var $levelTextLeft = jQuery('.level-text');
  var $levelTextRight = $levelTextLeft
    .clone(true)
    .addClass('right')
    .text(
      (DU.lang.level_percent < 100)
      ? $levelTextLeft.text().replace(/(\d+)+/g, function(match, number) {
          // Increase the level number.
          return parseInt(number) + 1;
        })
      : 'MAX'
    )
    .insertAfter($levelTextLeft);

    // Add the progress bar after the level text fields.
  $levelTextRight.after(
    '<div class="progress-bar-dynamic strength-bar DU-strength-bar">' +
    '  <div class="DU-meter-text">' + progressText + '</div>' +
    '  <div style="opacity: 1; width: ' + DU.lang.level_percent + '%;" class="DU-meter-bar bar gold"></div>' +
    '</div>'
  );

  DU.log('Progress bar updated');
};

/**
 * Start the party.
 */
DU.init = function() {
  // Add the global CSS rules.
  GM_addStyle(
    '.meter           { -moz-border-radius: 25px; -webkit-border-radius: 25px; background: #555; border-radius: 25px; box-shadow: inset 0 -1px 1px rgba(255,255,255,0.3); height: 20px; padding: 2px; position: relative; display: block; }' +
    '.meter-level     { display: block; height: 100%; border-top-right-radius: 8px; border-bottom-right-radius: 8px; border-top-left-radius: 20px; border-bottom-left-radius: 20px; background-color: #ffa200; background-image: linear-gradient(   center bottom,   #ffa200 37%,   rgb(84,240,84) 69% ); box-shadow: inset 0 2px 9px  rgba(255,255,255,0.3),inset 0 -2px 6px rgba(0,0,0,0.4); position: relative; overflow: hidden; }' +
    '.DU-meter-text   { width: 100%; position: absolute; z-index: 1; color: #000; opacity: .5; text-align: center; font-size: .8em; }' +
    '.DU-strength-bar { width: 100% !important; left: 0 !important; margin-top: 10px }' +
    '.DU-meter-bar    { height: 100% !important; margin: 0 !important; }'
  );

  // Initial execution.
  DU.loadVariables();
  DU.unlockTree();
  DU.progressBar();

  // Observe main page for changes.
  DU.Observer.add('#app', [DU.loadVariables, DU.unlockTree, DU.progressBar]);
};

// source: https://muffinresearch.co.uk/does-settimeout-solve-the-domcontentloaded-problem/
if (/(?!.*?compatible|.*?webkit)^mozilla|opera/i.test(navigator.userAgent)) { // Feeling dirty yet?
  document.addEventListener('DOMContentLoaded', DU.init, false);
} else {
  window.setTimeout(DU.init, 0);
}

/**
 * Make a log entry if debug mode is active.
 * @param {string}  logMessage Message to write to the log console.
 * @param {string}  level      Level to log ([l]og,[i]nfo,[w]arning,[e]rror).
 * @param {boolean} alsoAlert  Also echo the message in an alert box.
 */
DU.log = function(logMessage, level, alsoAlert) {
  if (!DU.debugLevel) {
    return;
  }

  var logLevels = { l : 0, i : 1, w : 2, e : 3 };

  // Default to "log" if nothing is provided.
  level = level || 'l';

  if ('disabled' !== DU.debugLevel && logLevels[DU.debugLevel] <= logLevels[level]) {
    switch(level) {
      case 'l' : console.log(  logMessage); break;
      case 'i' : console.info( logMessage); break;
      case 'w' : console.warn( logMessage); break;
      case 'e' : console.error(logMessage); break;
    }
    alsoAlert && alert(logMessage);
  }
};

/**
 * The MutationObserver to detect page changes.
 *
 * @type {Object}
 */
DU.Observer = {
  /**
   * The mutation observer objects.
   *
   * @type {Array}
   */
  observers : [],

  /**
   * Add an observer to observe for DOM changes.
   *
   * @param {String}         queryToObserve Query string of elements to observe.
   * @param {Array|Function} cbs            Callback function(s) for the observer.
   */
  add : function(queryToObserve, cbs) {
    // Check if we can use the MutationObserver.
    if ('MutationObserver' in window) {
      var toObserve = document.querySelector(queryToObserve);
      if (toObserve) {
        if (!jQuery.isArray(cbs)) {
          cbs = [cbs];
        }
        cbs.forEach(function(cb) {
          var mo = new MutationObserver(cb);

          // No need to observe subtree changes!
          mo.observe(toObserve, {
            childList: true
          });

          DU.Observer.observers.push(mo);
        });
      }
    }
  }
};
