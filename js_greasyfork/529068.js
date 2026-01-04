// ==UserScript==
// @name         Github Find Active Forks
// @namespace    http://tampermonkey.net/
// @version      1.5.0
// @copyright    2025, Asriel (https://greasyfork.org/de/users/1375984-asriel-aac)
// @description  Find the most active forks of a GitHub repository.
// @author       Asriel
// @match        *://github.com/*
// @icon         https://github.githubassets.com/favicons/favicon-dark.png
// @grant        GM_addStyle
// @run-at       document-end
// @license MIT
// @namespace https://greasyfork.org/users/448067
// @downloadURL https://update.greasyfork.org/scripts/529068/Github%20Find%20Active%20Forks.user.js
// @updateURL https://update.greasyfork.org/scripts/529068/Github%20Find%20Active%20Forks.meta.js
// ==/UserScript==

// Securely define CSS styles directly within the script
GM_addStyle(`
  .table { width: 100%; border-collapse: collapse; }
  .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
  .table th { background-color: #f2f2f2; }
  .avatar { border-radius: 50%; }
`);

// Load latest, more secure versions of external libraries
const loadScript = (url) => {
  return new Promise((resolve) => {
    let script = document.createElement("script");
    script.src = url;
    script.onload = resolve;
    document.head.appendChild(script);
  });
};

// Define secure versions of required libraries
const scripts = [
  "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.4/jquery.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.0/js/bootstrap.bundle.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/jquery-footable/3.1.6/footable.min.js"
];

// Load scripts sequentially before executing main function
Promise.all(scripts.map(loadScript)).then(() => {

  const SIZE_KILO = 1024;
  const UNITS = ["Bytes", "KB", "MB", "GB", "TB", "PB"];

  const fetchData = async (url) => {
    try {
      let response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
  };

  const getHumanFileSize = (size) => {
    if (size <= 0) return { size: "0", unit: UNITS[0] };
    size *= SIZE_KILO;
    const order = Math.floor(Math.log(size) / Math.log(SIZE_KILO));
    return { size: (size / Math.pow(SIZE_KILO, order)).toFixed(2), unit: UNITS[order] };
  };

  const createTable = (rJson, cJson) => {
    const humanSize = getHumanFileSize(cJson?.size ?? -1);
    const rowsData = [{
      repoName: `<img src="${cJson.owner.avatar_url}" width="24" height="24" class="avatar">
                 <a href="${cJson.html_url}">${cJson.full_name}</a>`,
      repoStars: cJson?.stargazers_count ?? -1,
      repoForks: cJson?.forks_count ?? -1,
      repoOpenIssue: cJson?.open_issues_count ?? -1,
      repoSize: humanSize,
      repoModified: Number(moment(cJson?.pushed_at ?? "NULL").format("x"))
    }];

    rJson.forEach((v) => {
      const humanSize = getHumanFileSize(v?.size ?? -1);
      rowsData.push({
        repoName: `<img src="${v.owner.avatar_url}" width="24" height="24" class="avatar">
                   <a href="${v.html_url}">${v.full_name}</a>`,
        repoStars: v?.stargazers_count ?? -1,
        repoForks: v?.forks_count ?? -1,
        repoOpenIssue: v?.open_issues_count ?? -1,
        repoSize: humanSize,
        repoModified: Number(moment(v?.pushed_at ?? "NULL").format("x"))
      });
    });

    jQuery(() => {
      $(".table").footable({
        columns: [
          { name: "repoName", title: "Repo" },
          { name: "repoStars", title: "Stars", breakpoints: "xs", type: "number" },
          { name: "repoForks", title: "Forks", breakpoints: "xs", type: "number" },
          { name: "repoOpenIssue", title: "Open Issues", breakpoints: "xs", type: "number" },
          {
            name: "repoSize",
            title: "Size",
            breakpoints: "xs",
            type: "object",
            formatter: (value) => value ? `${value.size} ${value.unit}` : "-",
            sortValue: (value) => value ? value.size * Math.pow(SIZE_KILO, UNITS.indexOf(value.unit)) : 0
          },
          {
            name: "repoModified",
            title: "Last Push",
            type: "date",
            breakpoints: "xs sm md",
            formatter: (value) => moment().to(moment(value, "YYYYMMDD"))
          }
        ],
        rows: rowsData
      });
    });
  };

  const loadMain = async () => {
    const pathComponents = window.location.pathname.split("/");
    if (pathComponents.length >= 3) {
      const user = pathComponents[1];
      const repo = pathComponents[2];
      const divForks = document.querySelector('div[id="network"]');
      if (!divForks) return;

      divForks.innerHTML = `<table class="table" data-paging="true" data-sorting="true"></table>`;
      const repoData = await fetchData(`https://api.github.com/repos/${user}/${repo}`);
      const forksData = await fetchData(`https://api.github.com/repos/${user}/${repo}/forks?sort=newest&per_page=100`);
      if (repoData && forksData) createTable(forksData, repoData);
    }
  };

  document.addEventListener("turbo:render", () => {
    if (location.pathname.endsWith("/network/members")) loadMain();
  });

  if (location.pathname.endsWith("/network/members")) loadMain();

});
