// ==UserScript==
// @name              Show all contributions by year in the GitHub profile
// @name:zh-CN        在 GitHub profile 页面以年份展示用户所有的贡献
// @namespace         https://github.com/kang8
// @version           0.0.5
// @description       Show all contributions by year since the user was created in the GitHub profile page
// @description:zh-CN 在 GitHub profile 页面以年份展示自用户创建以来所有的 contributions
// @author            kang8
// @match             https://github.com/*
// @grant             none
// @run-at            document-end
// @license           MIT
// @homepage          https://github.com/kang8/.dotfiles/tree/master/tampermonkey-scripts#show-all-contributions-by-year-in-github-profile
// @icon              https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png
// @downloadURL https://update.greasyfork.org/scripts/475319/Show%20all%20contributions%20by%20year%20in%20the%20GitHub%20profile.user.js
// @updateURL https://update.greasyfork.org/scripts/475319/Show%20all%20contributions%20by%20year%20in%20the%20GitHub%20profile.meta.js
// ==/UserScript==
(async function () {
  'use strict';

  const contributionsLastYearSelector =
    'div.js-yearly-contributions > div:nth-child(1)';

  await waitForElement(contributionsLastYearSelector);

  const pathArr = location.pathname.split('/');

  /**
   * match:
   * - https://github.com/kang8
   * - https://github.com/kang8/
   */
  if (
    pathArr.length === 2 ||
    (pathArr.length === 3 && pathArr[2] === '') && pathArr[1] !== ''
  ) {
    const userId = pathArr[1];

    const contributionsLastYear = document.querySelector(
      contributionsLastYearSelector,
    );

    const contributionsAllYearsDiv = document.createElement('div');
    contributionsAllYearsDiv.className = 'position-relative border';
    contributionsAllYearsDiv.id = 'contributions-all-years';
    contributionsLastYear.after(contributionsAllYearsDiv);

    const details = document.createElement('details');
    details.className = 'py-3';
    details.innerHTML =
      '<summary class="px-3">All contributions by year</summary>';
    contributionsAllYearsDiv.append(details);

    const totalYearsCreated =
      document.querySelectorAll('div.js-profile-timeline-year-list > ul > li')
        .length;
    const thisYear = new Date().getFullYear();

    for (let index = 0; index < totalYearsCreated; index++) {
      const currentYear = thisYear - index;

      fetch(
        `/users/${userId}/contributions?from=${currentYear}-1-01&to=${currentYear}-12-31`,
        {
          method: 'GET',
        },
      )
        .then((response) => response.text())
        .then((data) => {
          const contributionsDiv = document.createRange()
            .createContextualFragment(data);
          const contributionInfo =
            contributionsDiv.querySelector('div > div:nth-child(1) > h2')
              .textContent;
          const svgCalendarGraph = contributionsDiv.querySelector(
            'div > div:nth-child(1) > div > div',
          );

          svgCalendarGraph.querySelector('div > div.float-left').innerHTML =
            contributionInfo;

          if (currentYear !== thisYear) {
            svgCalendarGraph.classList.add('border-top');
          }

          insertAndOrderToDetails(svgCalendarGraph, details, currentYear);
        });
    }
  }
})();

/**
 * @param {Element} graph
 * @param {HTMLDetailsElement} details
 * @param {number} currentYear
 */
function insertAndOrderToDetails(graph, details, currentYear) {
  const contributionsCalendarAllYear = Array.from(
    details.querySelectorAll('div.js-calendar-graph'),
  );

  if (contributionsCalendarAllYear.length === 0) {
    details.append(graph);
  } else if (contributionsCalendarAllYear.length === 1) {
    const firstCalendarYear = getYearByContributionsCalendar(
      contributionsCalendarAllYear[0],
    );
    if (currentYear > firstCalendarYear) {
      contributionsCalendarAllYear[0].before(graph);
    } else {
      contributionsCalendarAllYear[0].after(graph);
    }
  } else {
    for (
      let index = 0;
      index < contributionsCalendarAllYear.length - 1;
      index++
    ) {
      const currentYearInCalendar = getYearByContributionsCalendar(
        contributionsCalendarAllYear[index],
      );
      const nextYearInCalendar = getYearByContributionsCalendar(
        contributionsCalendarAllYear[index + 1],
      );

      if (currentYear > currentYearInCalendar) {
        contributionsCalendarAllYear[index].before(graph);
        break;
      } else if (currentYear > nextYearInCalendar) {
        contributionsCalendarAllYear[index].after(graph);
        break;
      } else if (
        index === contributionsCalendarAllYear.length - 2 &&
        currentYear < nextYearInCalendar
      ) {
        contributionsCalendarAllYear[contributionsCalendarAllYear.length - 1]
          .after(graph);
      }
    }
  }
}

/**
 * @param {number|Element} childNode
 * @returns {number}
 */
function getYearByContributionsCalendar(childNode) {
  return childNode.querySelector('div.float-left').textContent.replace(
    /\s/g,
    '',
  ).slice(-4);
}

/**
 * @param {string} selector
 */
function waitForElement(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}
