// ==UserScript==
// @name        Jira Tweaks
// @namespace   Violentmonkey Scripts
// @description Userscript adding some jira tweaks (for devs?)
// @match       https://*.atlassian.net/*
// @version     0.0.1
// @author      Fabio T <iam@f4b.io> (https://iam.f4b.io)
// @license     AGPL-3
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/ui@0.7
// @require     https://cdn.jsdelivr.net/npm/slugify@1.6.6
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/474109/Jira%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/474109/Jira%20Tweaks.meta.js
// ==/UserScript==

(function (VM$2, VM$1) {
'use strict';

function formatName(id, name) {
  const _id = id.replace(" ", "-");
  const _name = slugify(name, {
    lower: true,
    strict: true
  });
  return `${_id}/${_name}`;
}
function copyToClipboard(content) {
  VM$1.showToast(VM$1.h("div", null, "copied to `", content, "` clipboard"), {
    theme: "dark",
    duration: 2000
  });
  GM_setClipboard(content, "text/plain");
}

function IconButton({
  Icon,
  name,
  title,
  handleClick
}) {
  return VM.h("div", {
    role: "presentation"
  }, VM.h("button", {
    "aria-label": "BranchName",
    "aria-busy": "false",
    class: "css-1xewsy6",
    tabindex: "0",
    type: "button",
    onClick: handleClick(name),
    title: title
  }, VM.h("span", {
    class: "css-bwxjrz"
  }, VM.h("span", {
    class: "_ca0qidpf _u5f3idpf _n3tdidpf _19bvidpf _18u0myb0 _2hwx12gs"
  }, VM.h("span", {
    "aria-hidden": "true",
    class: "css-1afrefi",
    style: "--icon-primary-color: currentColor; --icon-secondary-color: var(--ds-surface, #FFFFFF);"
  }, VM.h(Icon, null)))), VM.h("span", {
    class: "css-178ag6o"
  }, name)));
}

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

function BranchIcon(props) {
  return VM.h("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    role: "presentation"
  }, props), VM.h("path", {
    d: "M19 11c0 1.3-.8 2.4-2 2.8V15c0 2.2-1.8 4-4 4h-2.2c-.4 1.2-1.5 2-2.8 2-1.7 0-3-1.3-3-3 0-1.3.8-2.4 2-2.8V8.8C5.9 8.4 5 7.3 5 6c0-1.7 1.3-3 3-3s3 1.3 3 3c0 1.3-.8 2.4-2.1 2.8v6.4c.9.3 1.6.9 1.9 1.8H13c1.1 0 2-.9 2-2v-1.2c-1.2-.4-2-1.5-2-2.8 0-1.7 1.3-3 3-3s3 1.3 3 3zM8 5c-.5 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm8 7c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zm-8 7c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1z",
    fill: "currentColor",
    "fill-rule": "evenodd"
  }));
}

VM$2.observe(document.body, () => {
  var _document$querySelect;
  const taskId = () => {
    const taskId = document.querySelector("a[data-testid='issue.views.issue-base.foundation.breadcrumbs.current-issue.item'] > span");
    return taskId == null ? void 0 : taskId.innerHTML;
  };
  const taskName = () => {
    const taskName = document.querySelector("h1[data-testid='issue.views.issue-base.foundation.summary.heading']");
    return taskName == null ? void 0 : taskName.innerHTML;
  };

  /* remove upgrade warning */
  const upgradeWarningContainer = document.querySelector("div[class='_1e0c1txw _2lx21bp4 _1bah1h6o _4cvr1y6m _1yt41e2i _zulpu2gc _otyrpxbi']");
  if (upgradeWarningContainer) {
    upgradeWarningContainer.remove();
  }

  /* add branch name button */
  const attachButtonContainer = (_document$querySelect = document.querySelector("button[aria-label='Attach']")) == null ? void 0 : _document$querySelect.closest("div[role='presentation']");
  const actionsContainer = attachButtonContainer == null ? void 0 : attachButtonContainer.parentNode;
  if (actionsContainer) {
    const branchName = formatName(taskId(), taskName());
    actionsContainer.insertBefore(VM$2.m(VM$2.h(IconButton, {
      handleClick: copyToClipboard(branchName),
      Icon: BranchIcon,
      name: branchName,
      title: "Copy branch name to clipboard"
    })), attachButtonContainer.nextSibling);
    // disconnect observer
    return true;
  }
});

// You can also disconnect the observer explicitly when it's not used any more
// disconnect();

})(VM, VM);
