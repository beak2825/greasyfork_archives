// ==UserScript==
// @name         GNIB finder
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://burghquayregistrationoffice.inis.gov.ie/Website/AMSREG/AMSRegWeb.nsf/AppSelect?OpenForm
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399875/GNIB%20finder.user.js
// @updateURL https://update.greasyfork.org/scripts/399875/GNIB%20finder.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const defaultProfile = {
    "category": "All",
    "subCategory": "All",
    "newOrRenewal": "New or Renewal",
    "gnibNumber": "",
    "gnibExpiryDate": "DD/MM/YYYY",
    "givenName": "",
    "surname": "",
    "dob": "DD/MM/YYYY",
    "nationality": "China, People's Republic of",
    "email": "",
    "passport": "",
    "searchBy": "D = specific date, S = closest to today",
    "startDate": "DD/MM/YYYY, inclusive",
    "endDate": "DD/MM/YYYY, inclusive",
    "refreshIntervalSec": 2
  };

  const propertyToSelector = {
    category: '#Category',
    subCategory: '#SubCategory',
    newOrRenewal: '#ConfirmGNIB',
    gnibNumber: '#GNIBNo',
    gnibExpiryDate: '#GNIBExDT',
    givenName: '#GivenName',
    surname: '#SurName',
    dob: '#DOB',
    nationality: "#Nationality",
    email: '#Email',
    passport: '#PPNo',
  };

  class Finder {
    constructor() {
      this.intervalId = -1;

      let profileJson = localStorage.getItem('gnibFinderProfile');
      let profile;
      [profile, profileJson] = this.parseProfile(profileJson);

      this.initUI(profileJson);

      if (localStorage.getItem('gnibFinderRefreshing') === 'true') {
        this.start(profile);
      }
    }

    parseProfile(profileJson) {
      const profile = JSON.parse(profileJson) || Object.assign({}, defaultProfile);

      for (const key in profile) {
        if (!defaultProfile.hasOwnProperty(key)) {
          delete profile[key];
        }
      }

      for (const key in defaultProfile) {
        if (!profile.hasOwnProperty(key)) {
          profile[key] = defaultProfile[key];
        }
      }

      profileJson = JSON.stringify(profile, null, 2);

      return [profile, profileJson];
    }

    initUI(profileJson) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }

      $('#dvUsrDetails').after(`
        <div>
          <textarea id="gnibFinderProfile" style="font-family: monospace; width: 40em; height: 28em;">${profileJson}</textarea>
        </div>
        <div>
          <button id="gnibFinderStartRefresh" type="button" class="btn btn-success">Start auto-refresh</button>
          <button id="gnibFinderStopRefresh" type="button" class="btn btn-success">Stop auto-refresh</button>
        </div>
        <div>
          <audio id="gnibFinderAlertSound" src="https://freesound.org/data/previews/337/337049_3232293-lq.mp3" preload="auto" controls></audio>
        </div>
        `);
      $('#gnibFinderStartRefresh').click(this.startRefresh.bind(this));
      $('#gnibFinderStopRefresh').click(this.stopRefresh.bind(this));
    }

    startRefresh() {
      let profileJson = $('#gnibFinderProfile').val();
      let profile;
      [profile, profileJson] = this.parseProfile(profileJson);

      $('#gnibFinderProfile').val(profileJson);
      localStorage.setItem('gnibFinderProfile', profileJson);
      localStorage.setItem('gnibFinderRefreshing', 'true');

      this.start(profile);
    }

    stopRefresh() {
      localStorage.setItem('gnibFinderRefreshing', 'false');
      this.stopInterval();
    }

    start(profile) {
      $('#gnibFinderStartRefresh').prop('disabled', true);
      $('#gnibFinderProfile').prop('disabled', true);

      this.profile = profile;
      this.startDate = moment(this.profile.startDate, 'DD/MM/YYYY');
      this.endDate = moment(this.profile.endDate, 'DD/MM/YYYY');
      this.currDate = this.startDate.clone();

      this.fillProfile();
      $(document).ajaxSuccess(this.onNewResult.bind(this));

      this.intervalId = setInterval(this.update.bind(this), this.profile.refreshIntervalSec * 1000);
      this.update();

      setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 1000);

      console.log(`Refreshing this.intervalId=${this.intervalId}`);
    }

    fillProfile() {
      for (const [property, selector] of Object.entries(propertyToSelector)) {
        $(selector).val(this.profile[property]).change();
      }

      $('#UsrDeclaration').prop('checked', true).change();
      $('#EmailConfirm').val(this.profile.email).change();
      $('#FamAppYN').val('No').change();
      $('#PPNoYN').val('Yes').change();

      $('#btLook4App').click();
      $('#AppSelectChoice').val(this.profile.searchBy).change();
    }

    onNewResult() {
      const reload = $('#valErrDateSearch').is(':visible');
      const bookButtons = $('#dvAppOptions').find('button');

      if (reload) {
        this.stopInterval();
        location.reload(true);
      }
      else if (bookButtons.length > 0) {
        const dates = this.preferableDates();

        if (dates.length > 0) {
          this.stopInterval();

          $('#gnibFinderAlertSound')[0].play();

          this.showNotification(dates[0].textContent);
        }
      }
    }

    showNotification(body) {
      if (Notification.permission === "granted") {
        const notification = new Notification('GNIB finder', {
          body: body,
        });
      }
      else {
        alert(body);
      }
    }

    preferableDates() {
      const filterNotApplicable = this.profile.searchBy === 'D' || !this.startDate.isValid() || !this.endDate.isValid();

      return $('#dvAppOptions td').filter((_, x) => {
        const d = moment(x.textContent, 'DD MMMM YYYY');
        return d.isValid() && (filterNotApplicable || this.startDate <= d && d <= this.endDate);
      });
    }

    update() {
      if (this.profile.searchBy === 'D') {
        this.updateCurrDate();
        getAvailApps();
      }
      else {
        getEarliestApps();
      }
    }

    updateCurrDate() {
      const currDateStr = this.currDate.format('DD/MM/YYYY');
      $('#Appdate').val(currDateStr).change();

      this.currDate.add(1, 'days');

      if (this.currDate > this.endDate) {
        this.currDate = this.startDate.clone();
      }
    }

    stopInterval() {
      clearInterval(this.intervalId);
      this.intervalId = -1;
    }
  }

  new Finder();
})();
