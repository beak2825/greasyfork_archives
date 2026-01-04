// ==UserScript==
// @name         Github Find Active Forks [Embeded Edition]
// @version      1.4.1
// @description     Find most active fork of a github repository. 
// @description:de  Finden Sie die aktivsten Forks eines Github-Repositorys.
// @description:fr  Trouver les forks les plus actifs d'un dépôt github. 
// @description:it  Trova i fork più attivi di un repository github.
// @author       J.H
// @match        *://github.com/*
// @icon         https://github.githubassets.com/favicons/favicon-dark.png

// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/js/bootstrap.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-footable/3.1.6/footable.min.js

// @resource     footable.bootstrap.min.css       https://cdnjs.cloudflare.com/ajax/libs/jquery-footable/3.1.6/footable.bootstrap.min.css
// @resource     custom.css                       https://pastebin.com/raw/ReyeKaAm
// @run-at       document-end
// @license MIT
// @namespace https://greasyfork.org/users/448067
// @downloadURL https://update.greasyfork.org/scripts/429483/Github%20Find%20Active%20Forks%20%5BEmbeded%20Edition%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/429483/Github%20Find%20Active%20Forks%20%5BEmbeded%20Edition%5D.meta.js
// ==/UserScript==

GM_addStyle(GM_getResourceText("footable.bootstrap.min.css"));
GM_addStyle(GM_getResourceText("custom.css"));

const customInnerHTML = '<table class="table" data-paging="true" data-sorting="true"></table>';
const SIZE_KILO = 1024;
const UNITS = [
  'Bytes',
  'KB',
  'MB',
  'GB',
  'TB',
  'PB'
];

const httpFetch = function (url, func) {
  GM_xmlhttpRequest({
    method: "GET",
    url: url,
    onload: function (response) {
      func(response);
    },
  });
}

const restInit = function (user, repo) {
  httpFetch(
    "https://api.github.com/repos/" + user + "/" + repo,
    function (resp) {
      const json1 = JSON.parse(resp.responseText);
      httpFetch(
        "https://api.github.com/repos/" +
          user +
          "/" +
          repo +
          "/forks?sort=newest&per_page=100",
        function (resp) {
          const json2 = JSON.parse(resp.responseText);
          createTable(json2, json1);
        }
      );
    }
  );
}

const getHumanFileSize = function(size){
  if (size === 0) {
    return {
      size: '0',
      unit: UNITS[0],
    }
  } else if (size === -1) {
      return {
        size: '-1',
        unit: UNITS[0],
      }
  }
  size = size * SIZE_KILO;
  const order = Math.floor(Math.log(size) / Math.log(SIZE_KILO));
  return {
    size: (size / Math.pow(SIZE_KILO, order)).toFixed(2),
    unit: UNITS[order],
  }
}

const createTable = function (rJson, cJson) {
  const humanSize = getHumanFileSize(cJson?.size ?? -1);
  const rowsData = [];
  const ev = {};
  ev.repoName =
    '<img id="1337" src="' +
    cJson.owner.avatar_url +
    '&amp;s=48" width="24" height="24" class="avatar rounded-1 avatar-user" title="" style="margin-right: .5rem!important;"><a href="' +
    cJson.html_url +
    '">' +
    cJson.full_name +
    "</a>";
  ev.repoStars = cJson?.stargazers_count ?? -1;
  ev.repoForks = cJson?.forks_count ?? -1;
  ev.repoOpenIssue = cJson?.open_issues_count ?? -1;
  ev.repoSize = humanSize;
  ev.repoModified = Number(moment(cJson?.pushed_at ?? "NULL").format("x"));
  rowsData.push(ev);

  for (const [_, v] of Object.entries(rJson)) {
    const humanSize = getHumanFileSize(v?.size ?? -1);
    const ec = {};
    ec.repoName =
      '<img src="' +
      v.owner.avatar_url +
      '&amp;s=48" width="24" height="24" class="avatar rounded-1 avatar-user" title="" style="margin-right: .5rem!important;"><a href="' +
      v.html_url +
      '">' +
      v.full_name +
      "</a>";
    ec.repoStars = v?.stargazers_count ?? -1;
    ec.repoForks = v?.forks_count ?? -1;
    ec.repoOpenIssue = v?.open_issues_count ?? -1;
 
    ec.repoSize = humanSize;
    ec.repoModified = Number(moment(v?.pushed_at ?? "NULL").format("x"));

    rowsData.push(ec);
  }
  jQuery(function ($) {
    $(".table").footable({
      columns: [
        { name: "repoName", title: "Repo" },
        {
          name: "repoStars",
          title: "Stars",
          breakpoints: "xs",
          type: "number",
        },
        {
          name: "repoForks",
          title: "Forks",
          breakpoints: "xs",
          type: "number",
        },
        {
          name: "repoOpenIssue",
          title: "Open Issues",
          breakpoints: "xs",
          type: "number",
        },
        {
          name: "repoSize",
          title: "Size",
          breakpoints: "xs",
          type: "object",
          direction: "DESC",
          formatter: function(value){
              if (value){
                  return value.size + value.unit;
              }
              return -1;
          },
          sortValue: function(value){
            if (value){
                // return value by it's UNIT value (PB, TB, GB, MB, KB, Bytes) in order to sort it
                return value.size * Math.pow(SIZE_KILO, UNITS.indexOf(value.unit)); // in test..
                // return UNITS.indexOf(value.unit) + Number(value.size); // should be OK
            }
            return null
          }
        },
        {
          name: "repoModified",
          title: "Last Push",
          type: "date",
          breakpoints: "xs sm md",
          formatter: function (value) {
            return moment().to(moment(value, "YYYYMMDD"));
          },
        },
      ],
      rows: rowsData,
    });
  });
  document.querySelector(
    'img[id="1337"]'
  ).parentElement.parentElement.style.backgroundImage =
    "linear-gradient(var(--color-checks-logline-warning-bg),var(--color-checks-logline-warning-bg))";
  document.querySelector(
    'img[id="1337"]'
  ).parentElement.lastElementChild.style.color = "var(--color-checks-logline-warning-num-text)";
}

// loadMain function is called when the page is loaded, and it is the main function of the script
const loadMain = function () {
  const pathComponents = window.location.pathname.split("/");
  if (pathComponents.length >= 3) {
    const user = pathComponents[1],
      repo = pathComponents[2];
    const divForks = document.querySelector('div[id="network"]');
    divForks.innerHTML = customInnerHTML;
    restInit(user, repo);
  }
}

// use turbo to loadMain when the page is loaded via ajax request
document.addEventListener('turbo:render', function () {
  if (location.pathname.endsWith("/network/members")) {
    loadMain();
  }
});

// loadMain when url ends with /network/members
if (location.pathname.endsWith("/network/members")) {
  loadMain();
}