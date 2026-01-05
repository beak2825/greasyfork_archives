// ==UserScript==
// @name        WME Date Format Fix
// @namespace   http://www.tomputtemans.com/
// @description Fixes the date format if it is still missing or allows you to override the default date format
// @include     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @version     0.1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25011/WME%20Date%20Format%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/25011/WME%20Date%20Format%20Fix.meta.js
// ==/UserScript==
(function() {
  function init() {
    if (typeof I18n === 'undefined') {
      console.log('No internationalisation object found yet, snoozing');
      setTimeout(init, 300);
      return;
    }
    fixDateFormat();
  }
  
  function fixDateFormat() {
    try {
      var dateFormat = I18n.translations.en.date.formats.long;
      var timeFormat = I18n.translations.en.time.formats.long;
      var datetimeFormat = I18n.translations[locale].date.formats.default;
      if (dateFormat && timeFormat && datetimeFormat) {
        return;
      }
    } catch (e) {
      // see http://www.cplusplus.com/reference/ctime/strftime/ for the supported format specifiers
      addFormat(I18n.currentLocale(), '%a %b %d, %Y', '%a %b %d %Y, %H:%M');
      addFormat('en', '%a %b %d, %Y', '%a %b %d %Y, %H:%M');
      addFormat('nl', '%a %d %b, %Y', '%a %d %b %Y, %H:%M');
      addFormat('fr', '%a %d %b, %Y', '%a %d %b %Y, %H:%M');
      addFormat('cs', '%e. %m., %Y', '%e. %m. %Y, %H.%M');
      addFormat('sk', '%e. %m., %Y', '%e. %m. %Y, %H.%M');
    }
    if (I18n.currentLocale() == 'en-GB' && I18n.translations['en-GB'].update_requests.panel.reported == 'Reported on') {
      I18n.translations['en-GB'].update_requests.panel.reported = 'Reported on: %{date}';
    }
  }
  
  function addFormat(locale, dateFormat, datetimeFormat) {
    if (!I18n.translations[locale]) {
      return;
    }

    if (!I18n.translations[locale].date) {
      I18n.translations[locale].date = {};
    }
    if (!I18n.translations[locale].date.formats) {
      I18n.translations[locale].date.formats = {};
    }
    I18n.translations[locale].date.formats.long = datetimeFormat;
    I18n.translations[locale].date.formats.default = dateFormat;

    if (!I18n.translations[locale].time) {
      I18n.translations[locale].time = {};
    }
    if (!I18n.translations[locale].time.formats) {
      I18n.translations[locale].time.formats = {};
    }
    I18n.translations[locale].time.formats.long = datetimeFormat;
  }

  init();
})();
