// ==UserScript==
// @name         TUS: Live faction chain breaker/revive helper
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Makes faction page update members status and activity live and allow filters
// @author       AllMight [1878147]
// @match        https://www.torn.com/factions.php*
// @downloadURL https://update.greasyfork.org/scripts/412705/TUS%3A%20Live%20faction%20chain%20breakerrevive%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/412705/TUS%3A%20Live%20faction%20chain%20breakerrevive%20helper.meta.js
// ==/UserScript==

(function () {
  var css = `
  .am-box-title {
  background: repeating-linear-gradient(90deg,#2a1d6a,#2a1d6a 2px,#3835a8 0,#3835a8 4px) !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
  }
  
  .am-box-title-chevron {
  width: 13px;
  height: 20px;
  fill: white;
  margin-right: 10px;
  cursor: pointer;
  }
  
  .am-box-title-close-chevron {
  transform: rotate(-90deg);
  }
  
  .am-button {
  width: 100%;
  cursor: pointer;
  outline: none;
  border: none;
  padding: 0.4em 1em;
  border-radius: 0.2em;
  text-decoration: none;
  font-family: 'Roboto',sans-serif;
  font-weight: 400;
  color: #FFFFFF;
  background-color: #3369ff;
  box-shadow: inset 0 -0.6em 1em -0.35em rgba(0,0,0,0.17), inset 0 0.6em 2em -0.3em rgba(255,255,255,0.15), inset 0 0 0em 0.05em rgba(255,255,255,0.12);
  margin-bottom: 5px;
  }
  
  .am-centered-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  }
  
  .am-init-btn {
  width: 200px;
  height: 80px;
  font-size: 2rem;
  }
  
  .am-filters-title {
  margin: 0;
  margin-bottom: 10px;
  }
  
  .am-filters-checkbox-container {
  display: flex;
  }
  
  .am-checkbox-label {
  display: flex;
  position: relative;
  padding: 5px;
  padding-left: 22px;
  cursor: pointer;
  font-size: 0.8rem;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  }
  
  .am-checkbox-label input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
  }
  
  .am-checkbox-checkmark {
  position: absolute;
  top: 4px;
  left: 2.4px;
  height: 10px;
  width: 10px;
  background-color: #eee;
  border: 2px solid #aa9696;
  }
  
  .am-checkbox-label:hover input ~ .am-checkbox-checkmark,
  .am-checkbox-label:hover input:checked ~ .am-checkbox-checkmark:after,
  .am-checkbox-label:hover input:indeterminate ~ .am-checkbox-checkmark:after {
  border-color: #857373
  }
  
  .am-checkbox-checkmark:after {
  content: "";
  position: absolute;
  display: none;
  }
  
  .am-checkbox-label input:checked ~ .am-checkbox-checkmark:after {
  display: block;
  left: 3.5px;
  top: 1px;
  width: 2px;
  height: 4px;
  border: solid #787878;
  border-width: 0 2px 2px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
  }
  
  .am-checkbox-label input:indeterminate ~ .am-checkbox-checkmark:after {
  display: block;
  left: 2.5px;
  top: 2.5px;
  width: 5px;
  height: 5px;
  background-color: #787878;
  border-radius: 50%;
  }
      `;

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));
  head.appendChild(style);

  var API_KEY = 'INSERT API KEY HERE';

  var isFiltersBoxCollapsedStorageKey = 'am-is-filters-box-collapsed';
  var hideInHospitalStorageKey = 'am-hide-in-hospital';
  var hideOkayStorageKey = 'am-hide-okay';
  var hideIdleStorageKey = 'am-hide-idle';

  var storage = {
    set isFiltersBoxCollapsed(value) {
      localStorage.setItem(
        isFiltersBoxCollapsedStorageKey,
        JSON.stringify(value)
      );
    },
    get isFiltersBoxCollapsed() {
      return (
        JSON.parse(localStorage.getItem(isFiltersBoxCollapsedStorageKey)) ||
        false
      );
    },
    set hideIdle(value) {
      localStorage.setItem(hideIdleStorageKey, JSON.stringify(value));
    },
    get hideIdle() {
      return JSON.parse(localStorage.getItem(hideIdleStorageKey)) || false;
    },
    set hideOkay(value) {
      localStorage.setItem(hideOkayStorageKey, JSON.stringify(value));
    },
    get hideOkay() {
      return JSON.parse(localStorage.getItem(hideOkayStorageKey)) || false;
    },
    set hideInHospital(value) {
      localStorage.setItem(hideInHospitalStorageKey, JSON.stringify(value));
    },
    get hideInHospital() {
      return (
        JSON.parse(localStorage.getItem(hideInHospitalStorageKey)) || false
      );
    }
  };

  var chevronSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 32"><path d="M16 10l-6 6-6-6-4 4 10 10 10-10-4-4z"></path></svg>';

  function createBoxContainer(title, isCollapsed, collapseStateChangeCb) {
    var container = document.createElement('div');
    container.classList.add('m-top10');

    var titleContainer = document.createElement('div');
    titleContainer.classList.add('title-gray', 'top-round', 'am-box-title');

    var titleElem = document.createTextNode(title);

    var chevronElem = document.createElement('span');
    chevronElem.classList.add('am-box-title-chevron');
    chevronElem.innerHTML = chevronSvg;
    chevronElem.addEventListener('click', function () {
      chevronElem.classList.toggle('am-box-title-close-chevron');
      var isCollapsed = chevronElem.classList.contains(
        'am-box-title-close-chevron'
      );
      contentContainer.style.display = isCollapsed ? 'none' : '';
      collapseStateChangeCb(isCollapsed);
    });

    var contentContainer = document.createElement('div');
    contentContainer.classList.add('bottom-round', 'cont-gray', 'p10');

    if (isCollapsed) {
      contentContainer.style.display = 'none';
      chevronElem.classList.add('am-box-title-close-chevron');
    }

    var hr = document.createElement('hr');
    hr.classList.add('page-head-delimiter', 'm-top10');
    hr.classList.add('page-head-delimiter', 'm-top10');

    titleContainer.appendChild(titleElem);
    titleContainer.appendChild(chevronElem);

    container.appendChild(titleContainer);
    container.appendChild(contentContainer);
    container.appendChild(hr);

    return {
      containerElem: container,
      contentElem: contentContainer
    };
  }

  function createCheckbox(label, checkedCb) {
    var labelElem = document.createElement('label');
    labelElem.classList.add('am-checkbox-label');

    var labelText = document.createTextNode(label);

    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('click', function () {
      checkedCb(checkbox.checked);
    });

    var checkmark = document.createElement('span');
    checkmark.classList.add('am-checkbox-checkmark');

    labelElem.appendChild(labelText);
    labelElem.appendChild(checkbox);
    labelElem.appendChild(checkmark);

    return {
      element: labelElem,
      check: function (isChecked) {
        checkbox.checked = isChecked;
      }
    };
  }

  function alterMembersTable() {
    var mainCont = document.querySelector('.faction-info-wrap .f-war-list');

    var headerCont = mainCont.querySelector('.table-header');
    var levelHeader = headerCont.querySelector('.lvl');
    levelHeader.innerText = 'LVL';
    levelHeader.title = 'Level';

    var memebrIconsHeader = headerCont.querySelector('.member-icons');
    memebrIconsHeader.style.width = '25%';

    var statusHeader = headerCont.querySelector('.status');
    var actionHeader = document.createElement('li');
    actionHeader.classList.add('status', 'table-cell');
    actionHeader.style.width = '6%';
    actionHeader.innerText = 'Action';
    statusHeader.parentElement.insertBefore(
      actionHeader,
      statusHeader.nextElementSibling
    );

    var membersRows = mainCont.querySelectorAll(
      '.members-list > .table-body > li'
    );

    membersRows.forEach(memberRow => {
      memberRow.querySelector('.member-icons').style.width = '25%';
      var memberStatus = memberRow.querySelector('.status');
      var memberAction = document.createElement('div');
      memberAction.classList.add('status', 'member-action', 'table-cell');
      memberAction.style.width = '6%';

      memberStatus.parentElement.insertBefore(
        memberAction,
        memberStatus.nextElementSibling
      );
    });
  }

  function createsFiltersContainerBox(
    hideOkay,
    hideInHospital,
    hideIdle,
    hideOkayChangedCb,
    hideInHospitalChangedCb,
    hideIdleChangedCb,
    initiatedCb
  ) {
    var boxContainer = createBoxContainer(
      'Faction live filters',
      storage.isFiltersBoxCollapsed,
      function isCollapsedChanged(isCollapsed) {
        storage.isFiltersBoxCollapsed = isCollapsed;
      }
    );

    boxContainer.contentElem.style.height = '100px';
    var cont = document.createElement('div');
    cont.classList.add('am-centered-container');
    var initBtn = document.createElement('button');
    initBtn.classList.add('am-button', 'am-init-btn');
    initBtn.innerText = 'Init';

    initBtn.addEventListener('click', function () {
      [].slice.apply(cont.children).forEach(function (child) {
        child.remove();
      });
      alterMembersTable();

      var hideOkayCheckbox = createCheckbox('Hide Okay', hideOkayChangedCb);
      hideOkayCheckbox.check(hideOkay);

      var hideInHospitalCheckbox = createCheckbox(
        'Hide In Hospital',
        hideInHospitalChangedCb
      );
      hideInHospitalCheckbox.check(hideInHospital);

      var hideIdleCheckbox = createCheckbox('Hide Idle', hideIdleChangedCb);
      hideIdleCheckbox.check(hideIdle);

      var filtersTitle = document.createElement('h1');
      filtersTitle.classList.add('am-filters-title');
      filtersTitle.innerText = 'Filter members by:';

      var checkboxContainer = document.createElement('div');
      checkboxContainer.classList.add('am-filters-checkbox-container');
      checkboxContainer.appendChild(hideOkayCheckbox.element);
      checkboxContainer.appendChild(hideInHospitalCheckbox.element);
      checkboxContainer.appendChild(hideIdleCheckbox.element);

      cont.appendChild(filtersTitle);
      cont.appendChild(checkboxContainer);

      initiatedCb();
    });
    cont.appendChild(initBtn);

    boxContainer.contentElem.appendChild(cont);

    return {
      element: boxContainer.containerElem
    };
  }

  function createUser(userElem) {
    var userId = userElem
      .querySelector('.m-hide > a.user')
      .href.replace('https://www.torn.com/profiles.php?XID=', '');
    var activityElem = userElem.querySelector('#iconTray > [id^=icon]');
    var statusElem = userElem.querySelector('.status').children[0];

    function getActivity() {
      var iconName = activityElem.id.split('__')[0];
      return iconName === 'icon2'
        ? 'Offline'
        : iconName === 'icon62'
        ? 'Idle'
        : 'Active';
    }

    function setActivity(activity) {
      var iconData = activityElem.id.split('__');
      var iconName =
        activity === 'Offline'
          ? 'icon2'
          : activity === 'Idle'
          ? 'icon62'
          : 'icon1';
      activityElem.id = iconName + '__' + iconData[1];
    }

    function getStatus() {
      return statusElem.innerText.trim();
    }

    function setStatus(status) {
      statusElem.innerText = status;
      var memberActionElem = userElem.querySelector('.member-action');

      [].slice.apply(memberActionElem.children).forEach(function (child) {
        child.remove();
      });

      if (status === 'Okay') {
        statusElem.className = 't-green';
        var link = document.createElement('a');
        link.href =
          'https://www.torn.com/loader.php?sid=attack&user2ID=' + userId;
        link.target = '_blank';
        link.innerText = 'Attack';
        memberActionElem.appendChild(link);
      } else {
        statusElem.className = 't-red';
        var link = document.createElement('a');
        link.href =
          'revive.php?action=revive&ID=' + userId + '&text_response=1';
        link.innerText = 'Revive';
        memberActionElem.appendChild(link);
      }
      // TODO: Maybe add and remove icons (Travel, Hospital)?
    }

    function updateVisibility(hideOkay, hideInHospital, hideIdle) {
      var activity = getActivity();
      var status = getStatus();

      var shouldShowBasedOnActivity =
        activity === 'Active' || (activity === 'Idle' && !hideIdle);
      var shouldShowBasedOnStatus =
        (status === 'Okay' && !hideOkay) ||
        (status === 'Hospital' && !hideInHospital);

      if (shouldShowBasedOnActivity && shouldShowBasedOnStatus) {
        userElem.style.display = '';
      } else {
        userElem.style.display = 'none';
      }
    }

    return {
      userId: userId,
      updateActivity: setActivity,
      updateStatus: setStatus,
      updateVisibility: updateVisibility
    };
  }

  function createUsersMap() {
    var usersElems = document.querySelectorAll(
      '.members-list > .table-body > li'
    );
    var users = [...usersElems].map(createUser);
    return users.reduce((accum, user) => {
      accum[user.userId] = user;
      return accum;
    }, {});
  }

  function updateUserVisibilityFromStorage(user) {
    user.updateVisibility(
      storage.hideOkay,
      storage.hideInHospital,
      storage.hideIdle
    );
  }

  function refreshFactionUsers() {
    // TODO: Handle user left and user joined
    // TODO: Handle errors
    var factionId = new URLSearchParams(window.location.search).get('ID');

    fetch(
      'https://api.torn.com/faction/' +
        factionId +
        '?selections=&key=' +
        API_KEY
    )
      .then(res => res.json())
      .then(res => {
        var apiUsers = Object.keys(res.members).map(userId => ({
          userId,
          activity: res.members[userId].last_action.status,
          status: res.members[userId].status.state
        }));

        apiUsers.forEach(apiUser => {
          var user = usersMap[apiUser.userId];
          user.updateStatus(apiUser.status);
          user.updateActivity(apiUser.activity);
          updateUserVisibilityFromStorage(user);
        });
      });
  }

  var urlSearchParams = new URLSearchParams(location.search);

  if (
    (urlSearchParams.has('ID') || urlSearchParams.has('userID')) &&
    urlSearchParams.get('step') === 'profile'
  ) {
    var usersMap = createUsersMap();
    var users = Object.values(usersMap);
    var filtersContainer = createsFiltersContainerBox(
      storage.hideOkay,
      storage.hideInHospital,
      storage.hideIdle,
      function hideOkayChanged(hideOkay) {
        storage.hideOkay = hideOkay;
        users.forEach(updateUserVisibilityFromStorage);
      },
      function hideInHospitalChanged(hideInHospital) {
        storage.hideInHospital = hideInHospital;
        users.forEach(updateUserVisibilityFromStorage);
      },
      function hideIdleChanged(hideIdle) {
        storage.hideIdle = hideIdle;
        users.forEach(updateUserVisibilityFromStorage);
      },
      function initiated() {
        var facDesc = document.querySelector('.faction-description');
        facDesc.previousElementSibling.style.display = 'none';
        facDesc.style.display = 'none';
        facDesc.nextElementSibling.style.display = 'none';

        refreshFactionUsers();
        setInterval(() => {
          refreshFactionUsers();
        }, 2000);
      }
    );

    var wrapper = document.querySelector('.members-list').parentElement
      .parentElement;
    wrapper.parentElement.insertBefore(filtersContainer.element, wrapper);
  }
})();
