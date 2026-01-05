// ==UserScript==
//
// @name         Github disable WIP merge button
// @version      1.1.0
// @description  Disable merge button on GitHub when pull request title contain [WIP]
//
// @author       Ronan LE BRIS <ronan.lebris.rolebi@gmail.com>
//
// @include      /^https:\/\/github.com\/[^\/]+\/[^\/]+(\/.*)?$/
// @exclude      /^https:\/\/github.com\/[^\/]+\/[^\/]+\/settings(\/.*)?$/
// @exclude      /^https:\/\/github.com\/settings(\/.*)?$/
//
// @namespace    https://greasyfork.org/users/15646
//
// @grant none
//
// @downloadURL https://update.greasyfork.org/scripts/14196/Github%20disable%20WIP%20merge%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/14196/Github%20disable%20WIP%20merge%20button.meta.js
// ==/UserScript==

(function ($) {
  'use strict';

  var i18n = {
    wip: ['wip'],
    mergeDisabledNotification: {
      title: 'Work in progress',
      message: 'This pull request needs more work.'
    }
  };

  /**********************************************************************************************
   * Dom Observer, helps attach handler on DOM changes.
   */

  function DomObserver(config) {
    this.MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    this.obsConfig = config;
  }

  DomObserver.prototype.createHandler = function (callback) {
    return function (mutationRecords) {
      mutationRecords.forEach(function (mutation) {
        if (typeof mutation.removedNodes === 'object') {
          callback($(mutation.addedNodes));
        }
      });
    };
  };

  DomObserver.prototype.observe = function (element, callback) {
    var observer = new this.MutationObserver(this.createHandler(callback));
    observer.observe(element, this.obsConfig);
  };

  /**********************************************************************************************
   * A GitHub branch action entry.
   */

  function BranchAction() {
    this.$element = null;
    this.status = null;
  }

  BranchAction.statuses = {
    error: {indicator: 'error', icon: 'x'},
    success: {indicator: 'success', icon: 'check'},
    problem: {indicator: 'problem', icon: 'alert'}
  };

  BranchAction.prototype.createElement = function () {
    return $(
      '<div class="branch-action-item github-wip-plugin"> \
        <div class="branch-action-item-icon completeness-indicator"> \
          <span class="octicon"/> \
        </div> \
        <h4 class="status-heading"/> \
        <span class="status-meta"/> \
      </div>'
    );
  };

  BranchAction.prototype.setStatus = function (status, title, message) {
    if (!this.$element) {
      this.$element = this.createElement();
    }

    var $icon = this.$element.find('.octicon');
    var $indicator = this.$element.find('.completeness-indicator');

    if (this.status) {
      $icon.removeClass('octicon-' + this.status.icon);
      $indicator.removeClass('completeness-indicator-' + this.status.indicator);
    }

    this.status = status;

    $icon.addClass('octicon-' + status.icon);
    $indicator.addClass('completeness-indicator-' + status.indicator);
    this.$element.find('.status-heading').text(title);
    this.$element.find('.status-meta').text(message);
  };

  BranchAction.prototype.remove = function () {
    this.$element.remove();
    this.$element = null;
  };

  /**********************************************************************************************
   * Plugin implementation.
   */

  function GitHubDisableWipButton() {
    this.observer = new DomObserver({
      childList: true,
      characterData: true,
      subtree: true
    });

    this.branchAction = null;
    this.isWipReg = (new RegExp('(\\[' + i18n.wip.join('\\]|\\[') + '\\])', 'i'));
  }

  GitHubDisableWipButton.prototype.addNotif = function () {
    if (!this.branchAction) {
      this.branchAction = new BranchAction();
      this.branchAction.setStatus(
        BranchAction.statuses.problem,
        i18n.mergeDisabledNotification.title,
        i18n.mergeDisabledNotification.message
      );
      $('.branch-action-body').prepend(this.branchAction.$element);
    }
  };

  GitHubDisableWipButton.prototype.removeNotif = function () {
    if (this.branchAction) {
      this.branchAction.remove();
      $('.github-wip-plugin').remove(); // has too :S
      this.branchAction = null;
    }
  };

  GitHubDisableWipButton.prototype.disable = function ($actions) {
    $('.js-merge-branch-action', $actions).removeClass('btn-primary').attr('disabled', 'disabled');
    $actions.addClass('branch-action-state-dirty').removeClass('branch-action-state-clean');

    this.addNotif();
  };

  GitHubDisableWipButton.prototype.enable = function ($actions) {
    this.removeNotif();

    if (!$('.completeness-indicator-' + BranchAction.statuses.error.indicator +
        ', .completeness-indicator-' + BranchAction.statuses.problem.indicator, $actions).length) {
      $('.js-merge-branch-action', $actions).addClass('btn-primary').removeAttr('disabled', 'disabled');
      $actions.removeClass('branch-action-state-dirty').addClass('branch-action-state-clean');
    }
  };

  GitHubDisableWipButton.prototype.manageMergeButton = function ($context) {
    var $title;
    var $actions = $context.is('.branch-action') ? $context : $('.branch-action', $context);

    if ($actions.length) {
      $title = $('.gh-header-title');
    } else {
      $title = $context.is('.gh-header-title') ? $context : $('.gh-header-title', $context);
      $actions = $('.branch-action');
    }

    if ($title.length && $actions.length) {
      var titleText = $title.text().trim();
      if (titleText && this.isWipReg.test(titleText)) {
        this.disable($actions);
      } else {
        this.enable($actions);
      }
    }
  };

  GitHubDisableWipButton.prototype.run = function () {
    var that = this;

    if ($('.view-pull-request').length) {
        this.manageMergeButton($('body'));
    }
      
    this.observer.observe(document.body, function ($context) {
      if ($('.view-pull-request').length) {
        that.manageMergeButton($context);
      }
    });
  };

  $(function () {
    /**********************************************************************************************
     * Plugin instantiation.
     */

    var plugin = new GitHubDisableWipButton();

    plugin.run();
  });

}(jQuery));

