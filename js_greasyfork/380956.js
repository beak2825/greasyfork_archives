// ==UserScript==
// @name         Browser Notification Filter
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.2
// @license      GNU AGPLv3
// @author       jcunews
// @description  Filter out browser notifications by title or body of the notification. Edit script configuration before use, and backup script before updating.
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/380956/Browser%20Notification%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/380956/Browser%20Notification%20Filter.meta.js
// ==/UserScript==

((orgNotif, whitelistMode, keywordBlacklist, keywordWhitelist) => {

  //===== CONFIGURATION BEGIN =====

  //If whitelistMode is false, keywords is a list of blacklisted words. i.e. block only if matched
  //If whitelistMode is true, keywords is a list of whitelisted words. i.e. allow only if matched
  whitelistMode = false;

  keywordsTitle = /badtitle|badcategory/i;
  keywordsBody  = /unwanted|badword/i;

  //===== CONFIGURATION END =====

  function dummy(){}
  window.fakeNotif = function(title, opts) {
    this.title = title;
    if (opts) Object.keys(opts).forEach(function(k) {
      this[k] = opts[k];
    }, this);
    if (!this.timestamp) this.timestamp = (new Date()).getTime();
  };
  fakeNotif.prototype.close = dummy;
  fakeNotif.prototype.addEventListener = dummy;
  fakeNotif.prototype.removeEventListener = dummy;
  orgNotif = Notification;
  Notification = function(title, opts) {
    var matched;
    if (opts) {
      matched = keywordsTitle.test(title) || keywordsBody.test(opts.body);
    } else matched = keywordsTitle.test(title);
    if ((matched && !whitelistMode) || (!matched && whitelistMode)) return new fakeNotif(title, opts);
    return new orgNotif(title, opts);
  };
  Object.defineProperty(Notification, "permission", {
    get: function() {
      return orgNotif.permission;
    }
  });
  Notification.requestPermission = orgNotif.requestPermission;
})();
