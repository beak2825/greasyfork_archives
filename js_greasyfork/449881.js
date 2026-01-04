// ==UserScript==
// @name         Ranked User Search for Webcamdarts
// @version      0.3.1
// @license      MIT
// @description  Long overdue search functionality for the Equalizer, EQXL and Ladder Ranking.
// @author       AlexisDot
// @match        https://www.webcamdarts.com/wda-games/equalizer-(ranked)
// @match        https://www.webcamdarts.com/wda-games/eqxl-(ranked)
// @match        https://www.webcamdarts.com/wda-games/ladder-(ranked)
// @namespace    https://greasyfork.org/en/users/913506-alexisdot

// @downloadURL https://update.greasyfork.org/scripts/449881/Ranked%20User%20Search%20for%20Webcamdarts.user.js
// @updateURL https://update.greasyfork.org/scripts/449881/Ranked%20User%20Search%20for%20Webcamdarts.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

/* --------Add search to Rank Pages --------- */
(function () {
  "use strict";

  let curDate = new Date();
  let lastMonthDate = new Date();
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  let lastMonth = lastMonthDate.getMonth() + 1;
  let curDateMonth = curDate.getMonth() + 1;
  let curDateYear = curDate.getFullYear();
  let lastMonthYear = lastMonthDate.getFullYear();
  const rankings = {};

  let curPathParts = window.location.pathname.split("/");
  let wdaGamesIndex = curPathParts.indexOf("wda-games");
  let rankTypes = ["equalizer-(ranked)", "eqxl-(ranked)", "ladder-(ranked)"];
  let curRankList = rankTypes.indexOf(curPathParts[wdaGamesIndex + 1]);
  let fetchUrlInfoCurMonth = null;
  let fetchUrlAllCurMonth = null;
  let fetchUrlInfoLastMonth = null;
  let fetchUrlAllLastMonth = null;
  switch (curRankList) {
    case 0:
      fetchUrlInfoCurMonth = `https://www.webcamdarts.com/EqualizerRanking_Read?month=${curDateMonth}&year=${curDateYear}&take=1&skip=0&page=2&pageSize=1`;
      fetchUrlAllCurMonth = `https://www.webcamdarts.com/EqualizerRanking_Read?month=${curDateMonth}&year=${curDateYear}`;
      fetchUrlInfoLastMonth = `https://www.webcamdarts.com/EqualizerRanking_Read?month=${lastMonth}&year=${lastMonthYear}&take=1&skip=0&page=2&pageSize=1`;
      fetchUrlAllLastMonth = `https://www.webcamdarts.com/EqualizerRanking_Read?month=${lastMonth}&year=${lastMonthYear}`;
      break;
    case 1:
      fetchUrlInfoCurMonth = `https://www.webcamdarts.com/EqXLRanking_Read?month=${curDateMonth}&year=${curDateYear}`;
      fetchUrlAllCurMonth = fetchUrlInfoCurMonth;
      fetchUrlInfoLastMonth = `https://www.webcamdarts.com/EqXLRanking_Read?month=${lastMonth}&year=${lastMonthYear}`;
      fetchUrlAllLastMonth = fetchUrlInfoLastMonth;
      break;
    case 2:
      fetchUrlInfoCurMonth = `https://www.webcamdarts.com/GameOn/Game/LadderRanking_Read?sort%5B0%5D%5Bfield%5D=Rank&sort%5B0%5D%5Bdir%5D=asc&take=1&skip=0&page=2&pageSize=1`;
      fetchUrlAllCurMonth = `https://www.webcamdarts.com/GameOn/Game/LadderRanking_Read?sort%5B0%5D%5Bfield%5D=Rank&sort%5B0%5D%5Bdir%5D=asc`;
      break;
  }

  function fetchCurMonth(errorCorrect = 60) {
    fetch(fetchUrlInfoCurMonth)
      .then((response) => response.json())
      .then((data) => {
        let errorCorrect = 60;
        if (curRankList === 0 || curRankList === 2) {
          fetchUrlAllCurMonth = `${fetchUrlAllCurMonth}&take=${data.Total - errorCorrect
            }&skip=0&page=0&pageSize=${data.Total - errorCorrect}`;
        }
        fetch(fetchUrlAllCurMonth)
          .then((response2) => {
            if (response2.ok) {
              return response2.json();
            }

            throw new Error("Something went wrong.");
          })
          .then((data2) => {
            if (curRankList === 1) {
              rankings.curMonth = data2;
            } else {
              rankings.curMonth = data2.Data;
            }
            let searchField = document.querySelector('#user-search');
            searchField.disabled = false;
            searchField.placeholder = "Init complete. Enter NickName here."
            document.querySelector('#search-trigger').disabled = false;

          })
          .catch((error) => {
            errorCorrect += 10;
            console.log(
              `Error correction for current month is set to: ${errorCorrect}`
            );
            setTimeout(fetchCurMonth(errorCorrect), 200);
          });
      });
  }

  function fetchLastMonth(errorCorrect = 60) {
    if (fetchUrlInfoLastMonth) {
      fetch(fetchUrlInfoLastMonth)
        .then((response) => response.json())
        .then((data) => {
          if (curRankList === 0 || curRankList === 2) {
            fetchUrlAllLastMonth = `${fetchUrlAllLastMonth}&take=${data.Total - errorCorrect
              }&skip=0&page=0&pageSize=${data.Total - errorCorrect}`;
          }
          fetch(fetchUrlAllLastMonth)
            .then((response2) => {
              if (response2.ok) {
                return response2.json();
              }

              throw new Error("Something went wrong.");
            })
            .then((data2) => {
              if (curRankList === 1) {
                rankings.lastMonth = data2;
              } else {
                rankings.lastMonth = data2.Data;
              }
              let searchField = document.querySelector('#user-search');
              searchField.disabled = false;
              searchField.placeholder = "Init complete. Enter NickName here."
              document.querySelector('#search-trigger').disabled = false;
            })
            .catch((error) => {
              errorCorrect += 10;
              console.log(
                `Error correction for last month is set to: ${errorCorrect}`
              );
              setTimeout(fetchLastMonth(errorCorrect), 200);
            });
        });
    }
  }

  fetchCurMonth();
  fetchLastMonth();

  const htmlEQ = /*html*/ `
<div style="height: 250px; padding: 15px; margin-top: 20px" class="liteAccordion rounded dark">
  <h2><strong>Search User</strong></h2>
  <label for="user-search">NickName:</label
  ><input
    type="text"
    id="user-search"
    placeholder="Initializing search script, please wait..."
    style="padding: 5px;
    border-radius: 5px;
    width: calc(100% - 83px);
    margin-right: 5px; display: inline-block"
    disabled
  />
  <button type="button" style="padding: 5px; border-radius: 5px; border: 1px solid; width: 49px; display: inline-block;" id="search-trigger" disabled>Search</button>
  <br />
  <br />
  <div class="k-grid">
    <table cellspacing="0" id="search-results">
      <thead>
        <tr>
          <th class="k-header">Month</th>
          <th class="k-header">Nickname</th>
          <th class="k-header">Rank</th>
          <th class="k-header">Battle Points</th>
          <th class="k-header">Avg Leg Value</th>
          <th class="k-header">Average</th>
          <th class="k-header">Best Leg</th>
          <th class="k-header">High Out</th>
          <th class="k-header">180's</th>
          <th class="k-header"># Pld</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>
</div>

`;

  const htmlEQXL = /*html*/ `
<div style="height: 250px; padding: 15px; margin-top: 20px" class="liteAccordion rounded dark">
  <h2><strong>Search User</strong></h2>
  <label for="user-search">NickName:</label
  ><input
    type="text"
    id="user-search"
    placeholder="Initializing search script, please wait..."
    style="padding: 5px;
    border-radius: 5px;
    width: calc(100% - 83px);
    margin-right: 5px; display: inline-block"
    disabled
  />
  <button type="button" style="padding: 5px; border-radius: 5px; border: 1px solid; width: 49px; display: inline-block;" id="search-trigger" disabled>Search</button>
  <br />
  <br />
  <div class="k-grid">
  <table cellspacing="0" id="search-results">
      <thead>
        <tr>
          <th class="k-header">Month</th>
          <th class="k-header">Nickname</th>
          <th class="k-header">Rank</th>
          <th class="k-header">Battle Points</th>
          <th class="k-header">Set Value</th>
          <th class="k-header">Avg Leg Value</th>
          <th class="k-header">Average</th>
          <th class="k-header">Best Leg</th>
          <th class="k-header">High Out</th>
          <th class="k-header">180's</th>
          <th class="k-header"># Pld</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>
</div>

`;

  const htmlLadder = /*html*/ `
<div style="height: 250px; padding: 15px; margin-top: 20px" class="liteAccordion rounded dark">
  <h2><strong>Search User</strong></h2>
  <label for="user-search">NickName:</label
  ><input
    type="text"
    id="user-search"
    placeholder="Initializing search script, please wait..."
    style="padding: 5px;
    border-radius: 5px;
    width: calc(100% - 83px);
    margin-right: 5px; display: inline-block"
    disabled
  />
  <button type="button" style="padding: 5px; border-radius: 5px; border: 1px solid; width: 49px; display: inline-block;" id="search-trigger" disabled>Search</button>
  <br />
  <br />
  <div class="k-grid">
    <table cellspacing="0" id="search-results">
      <thead>
        <tr>
          <th class="k-header">Nickname</th>
          <th class="k-header">Rank</th>
          <th class="k-header">Score</th>
          <th class="k-header">Average</th>
          <th class="k-header">Best Leg</th>
          <th class="k-header">High Out</th>
          <th class="k-header">180's</th>
          <th class="k-header"># Played</th>
          <th class="k-header"># Won</th>
          <th class="k-header">Win %</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>
</div>

`;

  let html = null;
  switch (curRankList) {
    case 0:
      html = htmlEQ;
      break;
    case 1:
      html = htmlEQXL;
      break;
    case 2:
      html = htmlLadder;
      break;
  }

  // const element = document.createRange().createContextualFragment(html);
  let lastLiteAccordion = document.querySelectorAll(".liteAccordion");
  lastLiteAccordion = lastLiteAccordion[lastLiteAccordion.length - 1];
  lastLiteAccordion.insertAdjacentHTML("beforebegin", html);
  // document.querySelector('.load').parentElement.append(element);

  document.querySelector(".load")?.classList.remove("load");

  const searchField = document.querySelector("#user-search");
  const searchButton = document.querySelector("#search-trigger");
  const searchResultsTableBody = document.querySelector(
    "#search-results tbody"
  );

  const months = Array.from(
    {
      length: 12,
    },
    (e, i) => {
      return new Date(null, i + 1, null).toLocaleDateString("en", {
        month: "long",
      });
    }
  );

  searchButton.addEventListener("click", getRankings);
  searchField.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      getRankings();
    }
  });

  function getRankings() {
    let curMonthRank = rankings.curMonth.find(
      (user) => user.NickName == searchField.value
    );

    let lastMonthRank = null;

    if (rankings.lastMonth) {
      lastMonthRank = rankings.lastMonth.find(
        (user) => user.NickName == searchField.value
      );
    }

    searchResultsTableBody.innerHTML = "";
    let curMonthHtml = '';
    let lastMonthHtml = '';

    if (curMonthRank) {
      switch (curRankList) {
        case 0: curMonthHtml = /*html*/ `
            <tr>
              <td>${months[curDateMonth - 1]}</td>
              <td>${curMonthRank.NickName}</td>
              <td>${curMonthRank.Rank}</td>
              <td>${curMonthRank.Score}</td>
              <td>${curMonthRank.AverageLegValue}</td>
              <td>${curMonthRank.Average.toFixed(2)}</td>
              <td>${curMonthRank.BestLeg}</td>
              <td>${curMonthRank.HighestOut}</td>
              <td>${curMonthRank.OneEighties}</td>
              <td>${curMonthRank.GamesPlayed}</td>
            </tr>
          `;
          break;
        case 1: curMonthHtml = /*html*/ `
            <tr>
              <td>${months[curDateMonth - 1]}</td>
              <td>${curMonthRank.NickName}</td>
              <td>${curMonthRank.Rank}</td>
              <td>${curMonthRank.Score}</td>
              <td>${curMonthRank.CurrentLegValue}</td>
              <td>${curMonthRank.AverageLegValue}</td>
              <td>${curMonthRank.Average.toFixed(2)}</td>
              <td>${curMonthRank.BestLeg}</td>
              <td>${curMonthRank.HighestOut}</td>
              <td>${curMonthRank.OneEighties}</td>
              <td>${curMonthRank.GamesPlayed}</td>
            </tr>
          `;
          break;
        case 2: curMonthHtml = /*html*/ `
            <tr>
            <td>${curMonthRank.NickName}</td>
            <td>${curMonthRank.Rank}</td>
            <td>${curMonthRank.Score}</td>
            <td>${curMonthRank.Average.toFixed(2)}</td>
            <td>${curMonthRank.BestLeg}</td>
            <td>${curMonthRank.HighestOut}</td>
            <td>${curMonthRank.OneEighties}</td>
            <td>${curMonthRank.GamesPlayed}</td>
            <td>${curMonthRank.GamesWon}</td>
            <td>${curMonthRank.WinPercentage.toFixed(2)}</td>
            </tr>
          `;
          break;
      }
      searchResultsTableBody.innerHTML += curMonthHtml;
    } else {
      let curMonthHtml = '';
      switch (curRankList) {
        case 0:
          curMonthHtml = /*html*/ `
            <tr>
              <td>${months[curDateMonth - 1]}</td>
              <td colspan="9" style="align: center">no results found</td>
            </tr>
          `;
          break;
        case 1:
          curMonthHtml = /*html*/ `
            <tr>
              <td>${months[curDateMonth - 1]}</td>
              <td colspan="10" style="align: center">no results found</td>
            </tr>
          `;
          break;
        case 2:
          curMonthHtml = /*html*/ `
            <tr>
              <td colspan="10" style="align: center">no results found</td>
            </tr>
          `;
          break;
      }


      searchResultsTableBody.innerHTML += curMonthHtml;
    }
    if (rankings.lastMonth) {
      if (lastMonthRank) {
        switch (curRankList) {
          case 0: lastMonthHtml = /*html*/ `
            <tr>
              <td>${months[lastMonth - 1]}</td>
              <td>${lastMonthRank.NickName}</td>
              <td>${lastMonthRank.Rank}</td>
              <td>${lastMonthRank.Score}</td>
              <td>${lastMonthRank.AverageLegValue}</td>
              <td>${lastMonthRank.Average.toFixed(2)}</td>
              <td>${lastMonthRank.BestLeg}</td>
              <td>${lastMonthRank.HighestOut}</td>
              <td>${lastMonthRank.OneEighties}</td>
              <td>${lastMonthRank.GamesPlayed}</td>
            </tr>
          `;
            break;
          case 1: lastMonthHtml = /*html*/ `
            <tr>
              <td>${months[lastMonth - 1]}</td>
              <td>${lastMonthRank.NickName}</td>
              <td>${lastMonthRank.Rank}</td>
              <td>${lastMonthRank.Score}</td>
              <td>${lastMonthRank.CurrentLegValue}</td>
              <td>${lastMonthRank.AverageLegValue}</td>
              <td>${lastMonthRank.Average.toFixed(2)}</td>
              <td>${lastMonthRank.BestLeg}</td>
              <td>${lastMonthRank.HighestOut}</td>
              <td>${lastMonthRank.OneEighties}</td>
              <td>${lastMonthRank.GamesPlayed}</td>
            </tr>
          `;
            break;
        }
        searchResultsTableBody.innerHTML += lastMonthHtml;
      } else {
        let lastMonthHtml = '';
        switch (curRankList) {
          case 0:
            lastMonthHtml = /*html*/ `
              <tr>
                <td>${months[lastMonth - 1]}</td>
                <td colspan="9" style="align: center">no results found</td>
              </tr>
            `;
            break;
          case 1:
            lastMonthHtml = /*html*/ `
              <tr>
                <td>${months[lastMonth - 1]}</td>
                <td colspan="10" style="align: center">no results found</td>
              </tr>
            `;
            break;
        }

        searchResultsTableBody.innerHTML += lastMonthHtml;
      }
    }
  }
})();
