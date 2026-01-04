// ==UserScript==
// @name         Diep.io Server Selector (Advanced)
// @version      1.0.7
// @description  Let you to see Diep.io online and select servers!
// @author       @jaja.morgan
// @match        https://diep.io/*
// @license      MIT
// @namespace    *://diep.io/
// @downloadURL https://update.greasyfork.org/scripts/526041/Diepio%20Server%20Selector%20%28Advanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526041/Diepio%20Server%20Selector%20%28Advanced%29.meta.js
// ==/UserScript==

const toggleKeys = ["t", "е"]; // toggle hotKeys
const refreshTiming = 60; // autoRefresing in seconds

let users_lsData = getUserLSData();

const SVGS = {
  sgp: `<svg xmlns="http://www.w3.org/2000/svg" id="flag-icons-sg" viewBox="0 0 512 512">
  <defs>
    <clipPath id="sg-a">
      <path fill-opacity=".7" d="M27.7 0h708.6v708.7H27.7z"></path>
    </clipPath>
  </defs>
  <g fill-rule="evenodd" clip-path="url(#sg-a)" transform="translate(-20) scale(.72249)">
    <path fill="#fff" d="M0 0h1063v708.7H0z"></path>
    <path fill="#df0000" d="M0 0h1063v354.3H0z"></path>
    <path fill="#fff" d="M245.2 59.4a124.6 124.6 0 0 0 1.1 243.9 126.9 126.9 0 1 1-1.1-243.9z"></path>
    <path fill="#fff" d="m202 162.4-18.9-13.8 23.5-.2 7.2-22.3 7.5 22.3h23.4l-18.8 14 7.2 22.3L214 171l-19 13.8zm26 76.9-19-13.8 23.5-.2 7.3-22.3 7.4 22.2h23.5l-19 14 7.3 22.3-19-13.6-19 13.8zm86.3-.6-19-13.8 23.4-.2 7.3-22.3 7.4 22.3H357l-18.9 14 7.3 22.3-19.1-13.7-19 13.8zm25.7-76.2-19-13.8 23.5-.2 7.2-22.3 7.5 22.2h23.4l-18.8 14 7.2 22.3-19.1-13.6-19 13.8zM271.7 112l-19-13.8 23.5-.2 7.3-22.3 7.4 22.3h23.5l-19 14 7.3 22.2-19-13.6-19 13.8z"></path>
  </g>
</svg>`,
  fra: `<svg
                xmlns="http://www.w3.org/2000/svg"
                id="flag-icons-de"
                viewBox="0 0 512 512"
              >
                <path fill="#ffce00" d="M0 341.3h512V512H0z"></path>
                <path fill="#000" d="M0 0h512v170.7H0z"></path>
                <path fill="#d00" d="M0 170.7h512v170.6H0z"></path>
              </svg>`,
  atl: `<svg xmlns="http://www.w3.org/2000/svg" id="flag-icons-us" viewBox="0 0 512 512">
  <g fill-rule="evenodd">
    <g stroke-width="1pt">
      <path fill="#bd3d44" d="M0 0h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0z" transform="scale(3.9385)"></path>
      <path fill="#fff" d="M0 10h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0z" transform="scale(3.9385)"></path>
    </g>
    <path fill="#192f5d" d="M0 0h98.8v70H0z" transform="scale(3.9385)"></path>
    <path fill="#fff" d="m8.2 3 1 2.8H12L9.7 7.5l.9 2.7-2.4-1.7L6 10.2l.9-2.7-2.4-1.7h3zm16.5 0 .9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.5 0 .9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0 1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0 .9 2.8h2.9l-2.4 1.7 1 2.7L74 8.5l-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0 .9 2.8h2.9L92 7.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7 .9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0 1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0 .9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.5 0 .9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0 1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7 .8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 24.2l.9-2.7-2.4-1.7h3zm16.4 0 .9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0 .9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0 1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0 .9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0 .9 2.8h2.9L92 21.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7 .9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0 1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0 .9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0 .9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0 1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7 .8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 38.2l.9-2.7-2.4-1.7h3zm16.4 0 .9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0 .9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0 1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0 .9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0 .9 2.8h2.9L92 35.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7 .9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0 1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0 .9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0 .9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0 1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7 .8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 52.2l.9-2.7-2.4-1.7h3zm16.4 0 .9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0 .9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0 1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0 .9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0 .9 2.8h2.9L92 49.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7 .9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0 1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0 .9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0 .9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0 1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7 .8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 66.2l.9-2.7-2.4-1.7h3zm16.4 0 .9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0 .9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0 1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0 .9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0 .9 2.8h2.9L92 63.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9z" transform="scale(3.9385)"></path>
  </g>
</svg>`,
  syd: ` <svg
                xmlns="http://www.w3.org/2000/svg"
                id="flag-icons-au"
                viewBox="0 0 512 512"
              >
                <path
                  id="path598"
                  fill="#006"
                  stroke-width="1.3"
                  d="M0 0h512v512H0z"
                ></path>
                <path
                  id="path606"
                  fill="#fff"
                  fill-rule="evenodd"
                  stroke-width="1.3"
                  d="M54.9 368.6 95.5 384l13.4-41.4 13.3 41.4 40.7-15.4-24.1 36.3 37.4 22.2-43.3 3.7 6 43.1-30-31.5-30 31.5 6-43-43.4-3.8L79 404.9m325 71.5-19 1.6 2.7 18.8-13-13.7-13 13.7L364 478l-18.8-1.6 16.3-9.6L351 451l17.7 6.7 5.8-18 5.7 18L398 451l-10.4 15.8m16.2-270.4L385 198l2.6 18.8-13-13.7-13 13.7L364 198l-18.8-1.6 16.3-9.6L351 171l17.7 6.7 5.8-18 5.7 18L398 171l-10.4 15.8m-88.8 123.4-18.8 1.6 2.6 18.7-13-13.7-13 13.7 2.5-18.7-18.8-1.6 16.3-9.7-10.5-15.7 17.7 6.7 5.8-18 5.7 18 17.7-6.7-10.4 15.7M497 282.2l-18.8 1.6 2.6 18.7-13-13.7-13 13.7 2.5-18.7-18.8-1.6 16.3-9.7-10.5-15.7 17.7 6.7 5.8-18 5.8 18 17.6-6.7-10.4 15.7M416.6 355l-10.3 6.4 2.9-11.8-9.3-7.8 12-.9 4.7-11.2L421 341l12.1 1-9.2 7.7 2.9 11.8"
                ></path>
                <g id="g1582" transform="scale(.5)">
                  <path id="path1560" fill="#006" d="M0 0h512v512H0z"></path>
                  <path
                    id="path1562"
                    fill="#fff"
                    d="M512 0v64L322 256l190 187v69h-67L254 324 68 512H0v-68l186-187L0 74V0h62l192 188L440 0z"
                  ></path>
                  <path
                    id="path1564"
                    fill="#c8102e"
                    d="m184 324 11 34L42 512H0v-3zm124-12 54 8 150 147v45zM512 0 320 196l-4-44L466 0zM0 1l193 189-59-8L0 49z"
                  ></path>
                  <path
                    id="path1566"
                    fill="#fff"
                    d="M176 0v512h160V0zM0 176v160h512V176z"
                  ></path>
                  <path
                    id="path1568"
                    fill="#c8102e"
                    d="M0 208v96h512v-96zM208 0v512h96V0z"
                  ></path>
                </g>
              </svg>`,
};
const INDICES = {
  regions: {
    atl: 1,
    fra: 2,
    sgp: 3,
    syd: 4,
  },
  gameModes: {
    ffa: 1,
    maze: 2,
    teams: 3,
    "4teams": 4,
    "tdm maze": 5,
    ctf: 6,
    sandbox: 7,
  },
};
const VERSION = "1.0.7";
let latestVerison = false;
let lobbiesArr = [];
let lobby_ip;
let inRefreshing = false;
let selectedLobbyURL = null;
let preferTeam = "";
let refInterval;

const list = document.createElement("div");
list.id = "list";
list.innerHTML = `<div class="list__headers ">
    <h3 class="lobby__region  sortable">Region</h3>
    <h3 class="lobby__name ">IP</h3>
    <h3 class="lobby__onl  sortable">Players</h3>
    <h3 class="lobby__gm  sortable">Game Mode</h3>
    <span class="list__current-version">Current Version: ${VERSION}</span>
  </div>
<div class="list__container">
  <div class="list__lobbies">
    <div class="scanning">
      <div>SCANNING ALL FREQUENCIES</div>
      <div>
        <span class="circle circle-1"></span>
        <span class="circle circle-2"></span>
        <span class="circle circle-3"></span>
        <span class="circle circle-4"></span>
        <span class="circle circle-5"></span>
        <span class="circle circle-6"></span>
        <span class="circle circle-7"></span>
        <span class="circle circle-8"></span>
        <span class="circle circle-9"></span>
        <span class="circle circle-10"></span>
      </div>
    </div>
  </div>
  <div class="list__filter">
  <div class="filter__container">
    <h3>Filter</h3>
    <ul class="filter__cbs"></ul>
    <h3>Options</h3>
    <ul class="filter__opts"></ul>
    </div>
    <ul class="filter__buttons">
      <button class="green-btn btn-blocked">Connect</button>
      <button class="yellow-btn">Refresh</button>
    </ul>
  </div>
</div>`;
document.body.append(list);
const list_header_players = list.querySelector(".list__headers .lobby__onl");
const list_header_region = list.querySelector(".list__headers .lobby__region");
const list_header_gamemode = list.querySelector(".list__headers .lobby__gm");
list_header_players.onclick = () => {
  if (users_lsData.sortMode !== "p_increase") {
    users_lsData.sortMode = "p_increase";
  } else {
    users_lsData.sortMode = "p_decrease";
  }
  sort();
};
list_header_region.onclick = () => {
  if (users_lsData.sortMode !== "regions") {
    users_lsData.sortMode = "regions";
    sort();
  }
};
list_header_gamemode.onclick = () => {
  if (users_lsData.sortMode !== "gms") {
    users_lsData.sortMode = "gms";
    sort();
  }
};
const list_lobbies = list.querySelector(".list__lobbies");
const scanning = list.querySelector(".list__lobbies .scanning");

const connect_btn = list.querySelector("button.green-btn");
connect_btn.isBlocked = true;
connect_btn.onclick = () => {
  if (connect_btn.isBlocked) return;
  localStorage.setItem("recon", "true");
  if (
    [lobby_ip].includes("teams") ||
    [lobby_ip].includes("4teams") ||
    [lobby_ip].includes("ctf")
  ) {
    selectedLobbyURL = selectedLobbyURL + preferTeam;
  }
  console.log(selectedLobbyURL + preferTeam);
  window.location.href = selectedLobbyURL;
};
const refresh_btn = list.querySelector("button.yellow-btn");
refresh_btn.onclick = () => {
  if (inRefreshing) return;
  connect_btn.isBlocked = true;
  connect_btn.classList.add("btn-blocked");
  selectedLobbyURL = "";

  clearInterval(refInterval);
  refresh();
  refInterval = setInterval(() => {
    refresh();
  }, refreshTiming * 1000);
};

class BaseEl {
  constructor(tag, parent, blockPrev = false, isLast = false) {
    this.el = document.createElement(tag);
    if (blockPrev)
      this.el.addEventListener("mousedown", (event) => {
        event.stopImmediatePropagation();
      });
    if (isLast) this.el.style.marginBottom = "30px";

    parent.append(this.el);
  }
  initFn(id, el) {
    switch (id) {
      case "showFra":
        el.onclick = () => {
          if (!el.checked) {
            users_lsData.hideRegions.push("fra");
          } else
            users_lsData.hideRegions = users_lsData.hideRegions.filter(
              (e) => e !== "fra"
            );
          sort();
        };
        break;
      case "showAtl":
        el.onclick = () => {
          if (!el.checked) {
            users_lsData.hideRegions.push("atl");
          } else
            users_lsData.hideRegions = users_lsData.hideRegions.filter(
              (e) => e !== "atl"
            );
          sort();
        };
        break;
      case "showSgp":
        el.onclick = () => {
          if (!el.checked) {
            users_lsData.hideRegions.push("sgp");
          } else
            users_lsData.hideRegions = users_lsData.hideRegions.filter(
              (e) => e !== "sgp"
            );
          sort();
        };
        break;
      case "showSyd":
        el.onclick = () => {
          if (!el.checked) {
            users_lsData.hideRegions.push("syd");
          } else
            users_lsData.hideRegions = users_lsData.hideRegions.filter(
              (e) => e !== "syd"
            );
          sort();
        };

        break;
      case "showFfa":
        el.onclick = () => {
          if (!el.checked) {
            users_lsData.hideModes.push("ffa");
          } else
            users_lsData.hideModes = users_lsData.hideModes.filter(
              (e) => e !== "ffa"
            );
          sort();
        };

        break;
      case "showTdm":
        el.onclick = () => {
          if (!el.checked) {
            users_lsData.hideModes.push("teams");
          } else
            users_lsData.hideModes = users_lsData.hideModes.filter(
              (e) => e !== "teams"
            );
          sort();
        };

        break;
      case "show4tdm":
        el.onclick = () => {
          if (!el.checked) {
            users_lsData.hideModes.push("4teams");
          } else
            users_lsData.hideModes = users_lsData.hideModes.filter(
              (e) => e !== "4teams"
            );
          sort();
        };

        break;
      case "showMaze":
        el.onclick = () => {
          if (!el.checked) {
            users_lsData.hideModes.push("maze");
          } else
            users_lsData.hideModes = users_lsData.hideModes.filter(
              (e) => e !== "maze"
            );
          sort();
        };

        break;
      case "showCtf":
        el.onclick = () => {
          if (!el.checked) {
            users_lsData.hideModes.push("ctf");
          } else
            users_lsData.hideModes = users_lsData.hideModes.filter(
              (e) => e !== "ctf"
            );
          sort();
        };
        break;
      case "showTz":
        el.onclick = () => {
          if (!el.checked) {
            users_lsData.hideModes.push("tdm maze");
          } else
            users_lsData.hideModes = users_lsData.hideModes.filter(
              (e) => e !== "tdm maze"
            );
          sort();
        };
        break;
      case "showSnd":
        el.onclick = () => {
          if (!el.checked) {
            users_lsData.hideModes.push("sandbox");
          } else
            users_lsData.hideModes = users_lsData.hideModes.filter(
              (e) => e !== "sandbox"
            );
          sort();
        };

        break;
      case "selectTeam":
        el.innerHTML = `
        <option value="" selected>Random</option>
        <option value="1">Blue</option>
        <option value="2">Red</option>
        <option value="3">Purple</option>
        <option value="4">Green</option>`;

        el.onchange = () => {
          preferTeam = el.value;
        };
        el.onchange();
        break;
    }
  }
}

class CheckBox extends BaseEl {
  constructor(id, parent, text, isChecked, isLast = false) {
    super("line", list.querySelector(parent), false, isLast);
    const label = document.createElement("label");
    label.htmlFor = id;
    label.className = "custom-cb";
    label.innerText = text;

    const input = document.createElement("input");
    input.id = id;
    input.type = "checkbox";
    input.checked = isChecked;
    super.initFn(id, input);

    this.el.append(input, label);
  }
}

class Select extends BaseEl {
  constructor(id, text, isLast = false) {
    super("line", list.querySelector("ul.filter__opts"), true, isLast);
    const label = document.createElement("label");
    label.htmlFor = id;
    label.innerText = text;

    const select = document.createElement("select");
    select.id = id;
    select.className = "custom-sl";
    super.initFn(id, select);

    this.el.append(select, label);
  }
}

function createLobby(r_name, lobby_data) {
  const lobby = document.createElement("div");
  lobby.classList = "lobby";
  lobby.innerHTML = `
  <h4 class="lobby__region">${SVGS[`${r_name}`]}</h4>
  <h4 class="lobby__name">${lobby_data.ip}</h4>
  <h4 class="lobby__onl">${lobby_data.numPlayers}</h4>
  <h4 class="lobby__gm">${lobby_data.gamemode}</h4>`;
  lobby.data = lobby_data;
  lobby.data.region = r_name;

  lobby.onclick = () => {
    let prevChosen = list_lobbies.querySelector(".selected");
    if (prevChosen) prevChosen.classList.remove("selected");

    lobby.classList.add("selected");
    connect_btn.isBlocked = false;
    connect_btn.classList.remove("btn-blocked");
    selectedLobbyURL =
      `https://diep.io/?lobby=${lobby_data.region}_${lobby_data.gamemode}_${lobby_data.ip}`.replace(
        /(:\d+).*/,
        "$1_63059_"
      );

    console.log("Selected lobby: " + selectedLobbyURL);
  };

  return lobby;
}

async function init() {
  const thisURL = new URL(document.URL);
  lobby_ip = thisURL.searchParams.get("lobby");
  console.log("Trying to init Advanced Servers Selector...");

  await checkVersion();

  const list_header = list.querySelector(".list__headers");

  if (latestVerison) {
    let newV = document.createElement("a");
    newV.classList = "list__new-version";
    newV.target = "_blank";
    newV.href =
      "https://greasyfork.org/uk/scripts/526041-advanced-servers-selector-for-diep-io";
    newV.innerText = `New version is available — ${latestVerison}`;

    list_header.append(newV);
    list.querySelector(".list__current-version").style.bottom = "5px";
  } else {
    list.querySelector(".list__current-version").style.top = "7.5px";
  }

  if (!document.getElementById("spawn-button")) {
    console.error("ERR_NO_SPAWN_BUTTON");
    setTimeout(() => init(), 1000);

    return;
  }

  document
    .getElementById("spawn-button")
    .addEventListener("click", () => (list.style.display = "none"));

  document
    .getElementById("game-over-continue")
    .addEventListener("click", () => (list.style.display = "block"));

  if (!users_lsData) {
    users_lsData = {
      sortMode: "region",
      hideRegions: [],
      hideModes: ["sandbox"],
    };
    localStorage.setItem("dsso_data", JSON.stringify(users_lsData));
  }
  let tyui = JSON.parse(localStorage.getItem("tyui"));
  if (!tyui) {
    localStorage.setItem("tyui", JSON.stringify(1));
  }
  if (tyui !== "NaN") {
    if (tyui >= 5) {
      setTimeout(() => {
        if (
          confirm(
            `Could you please leave a review on how much you enjoyed using my script "Advanced Servers Selector for Diep.io"? If you have any ideas for improvements or encountered a bug, you can add it to the review.`
          )
        ) {
          window.open(
            "https://greasyfork.org/uk/scripts/526041-advanced-servers-selector-for-diep-io/feedback",
            "_blank"
          );
        }
        localStorage.setItem("tyui", JSON.stringify("NaN"));
      }, 3000);
    } else {
      localStorage.setItem("tyui", JSON.stringify(tyui + 1));
    }
  }

  const initOBJs = {
    filter_checkboxes: {
      showAtl: ["Atlanta:", !users_lsData.hideRegions.includes("atl")],
      showFra: ["Frankfurt:", !users_lsData.hideRegions.includes("fra")],
      showSgp: ["Singapore:", !users_lsData.hideRegions.includes("sgp")],
      showSyd: ["Sydney:", !users_lsData.hideRegions.includes("syd"), true],
      showFfa: ["FFA:", !users_lsData.hideModes.includes("ffa")],
      showTdm: ["Teams:", !users_lsData.hideModes.includes("teams")],
      show4tdm: ["Teams (4):", !users_lsData.hideModes.includes("4teams")],
      showMaze: ["Maze:", !users_lsData.hideModes.includes("maze")],
      showCtf: [
        "Capture The Flag (ctf):",
        !users_lsData.hideModes.includes("ctf"),
      ],
      showTz: ["Team Maze:", !users_lsData.hideModes.includes("tdm maze")],
      showSnd: ["Sandbox:", !users_lsData.hideModes.includes("sandbox")],
    },
    options_checkboxes: {},
    options_selectors: {
      selectTeam: ["Prefer team:", false],
    },
  };

  for (let _p in initOBJs) {
    let p = initOBJs[_p];

    for (let _id in p) {
      switch (_p) {
        case "filter_checkboxes":
          new CheckBox(_id, "ul.filter__cbs", ...p[_id]);
          break;
        case "options_checkboxes":
          new CheckBox(_id, "ul.filter__opts", ...p[_id]);
          break;
        case "options_selectors":
          new Select(_id, ...p[_id]);
          break;
      }
    }
  }
  refresh();

  refInterval = setInterval(() => {
    refresh();
  }, refreshTiming * 1000);

  setInterval(() => {
    if (!lobby_ip) return;
    [...list_lobbies.children].forEach((e) => {
      if (e.classList.contains("lobby")) {
        if (
          e.querySelector(".lobby__name").innerText ===
          lobby_ip.replace(/(:\d+).*/, "$1").replace(/.*_/, "")
        ) {
          e.classList.add("active");
        } else e.classList.remove("active");
      }
    });
  }, 100);
}

async function getData() {
  try {
    const response = await fetch("https://lb.diep.io/api/lb/pc"); //-pc
    return await response.json();
  } catch (e) {
    console.error(e);
  }
}
async function refresh() {
  let thisURL = new URL(document.URL);
  lobby_ip = thisURL.searchParams.get("lobby");
  [...list_lobbies.children].forEach((e) => {
    if (e.classList.contains("lobby")) e.remove();
  });
  scanning.style.display = "block";
  lobbiesArr = [];
  inRefreshing = true;

  const data = await getData();
  scanning.style.display = "none";
  inRefreshing = false;

  for (const region of data.regions) {
    for (const lobby of region.lobbies) {
      lobbiesArr.push(createLobby(region.region, lobby));
    }
  }

  sort();
}
function sort() {
  [...list_lobbies.children].forEach((e) => {
    if (e.classList.contains("lobby")) e.remove();
  });
  [...list.querySelectorAll(".list__headers h3")].forEach((e) => {
    if (e.classList.contains("sort-1")) e.classList.remove("sort-1");
    if (e.classList.contains("sort-2")) e.classList.remove("sort-2");
    if (e.classList.contains("sort-3")) e.classList.remove("sort-3");
  });

  if (users_lsData.sortMode === "p_increase") {
    list_header_players.classList.add("sort-2");
    lobbiesArr
      .sort((a, b) => {
        return a.data.numPlayers - b.data.numPlayers;
      })
      .reverse();
  } else if (users_lsData.sortMode === "p_decrease") {
    list_header_players.classList.add("sort-3");
    lobbiesArr.sort((a, b) => {
      return a.data.numPlayers - b.data.numPlayers;
    });
  } else if (users_lsData.sortMode === "regions") {
    list_header_region.classList.add("sort-1");
    lobbiesArr.sort((a, b) => {
      return (
        INDICES.regions[`${a.data.region}`] -
        INDICES.regions[`${b.data.region}`]
      );
    });
  } else if (users_lsData.sortMode === "gms") {
    list_header_gamemode.classList.add("sort-1");
    lobbiesArr.sort((a, b) => {
      return (
        INDICES.gameModes[`${a.data.gamemode}`] -
        INDICES.gameModes[`${b.data.gamemode}`]
      );
    });
  }
  lobbiesArr.forEach((e) => {
    if (users_lsData.hideModes.includes(e.data.gamemode)) return;
    if (users_lsData.hideRegions.includes(e.data.region)) return;
    list_lobbies.append(e);
  });
  updateUserLSData();
}

function setDraggable(el, el_child) {
  var newPosX = 0,
    newPosY = 0,
    MousePosX = 0,
    MousePosY = 0;
  if (el_child) {
    el_child.forEach((e) => e.addEventListener("mousedown", MouseDown));
  } else el.addEventListener("mousedown", MouseDown);

  function MouseDown(mouseDown) {
    MousePosX = mouseDown.pageX;
    MousePosY = mouseDown.pageY;

    if (el_child) {
      el_child.forEach((e) => e.classList.add("dragableging"));
    } else el.classList.add("dragableging");

    document.addEventListener("mousemove", elementMove);
    document.addEventListener("mouseup", stopElementMove);
  }

  function elementMove(mouseMove) {
    newPosX = MousePosX - mouseMove.pageX;
    newPosY = MousePosY - mouseMove.pageY;
    MousePosX = mouseMove.pageX;
    MousePosY = mouseMove.pageY;

    el.style.top = el.offsetTop - newPosY + "px";
    el.style.left = el.offsetLeft - newPosX + "px";
  }

  function stopElementMove() {
    if (el_child) {
      el_child.forEach((e) => e.classList.remove("dragableging"));
    } else el.classList.remove("dragableging");

    document.removeEventListener("mousemove", elementMove);
    document.removeEventListener("mouseup", stopElementMove);
  }
}
function getUserLSData() {
  return JSON.parse(localStorage.getItem("dsso_data"));
}
function updateUserLSData() {
  localStorage.setItem("dsso_data", JSON.stringify(users_lsData));
}
async function checkVersion() {
  const url =
    "https://raw.githubusercontent.com/jajamorgan/ve/refs/heads/main/version.json";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`CHK-VERSION_ERR: ${response.status}`);

    let { version } = await response.json();
    let lVersion = version.split(".");
    const cVersion = VERSION.split(".");

    for (let i = 0; i < 3; i++) {
      if (parseFloat(lVersion[i]) > parseFloat(cVersion[i])) {
        latestVerison = lVersion.join(".");
        break;
      }
    }
    console.log("Advanced Selector version:", cVersion.join("."));
  } catch (error) {
    console.error("Request ERR:", error);
  }
}

document.addEventListener("keydown", (e) => {
  if (toggleKeys.includes(e.key)) {
    if (list.style.display == "none") {
      list.style.display = "block";
    } else list.style.display = "none";
  }
});
setDraggable(list, [list.querySelector(".list__headers")]);

init();

const css = document.createElement("style");
css.innerHTML = `#server-selector {
  display: none !important;
}
#logo {
  position: absolute;
  bottom: 80px;
}
#spawn-input {
  position: absolute !important;
  bottom: 250px;
}
#spawn-button {
  position: absolute !important;
  bottom: 200px;
}
#copy-party-link {
  position: absolute !important;
  height: 33px;
  width: 200px !important;
  left: 210px;
  top: 170px;
}
#list button {
  border: none;
}

* {
  outline: none;
  border: none;
  margin: 0;
  padding: 0;
}
:root {
  --font-lobby: #8addd3;
  --font-headers: #5b9e7d;
  --font-filter: #69c49f;
  --font-buttons: #bbc9c9;

  --list-back: #050c0a;
  --lobby-menu-back: #081c1c;
  --lobby-back: #153832;
  --filter-back: #133532;

  --green-btn-back: #1b4333;
  --green-hov-back: #2bd469;
  --green-act-back: #04fb46;
  --yellow-btn-back: #4f4917;
  --yellow-hov-back: #c4b73b;
  --yellow-act-back: #dfcc20;
  --gray-btn-back: #343434;
}

#list {
  position: absolute;
  z-index: 999;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-family: "Ubuntu", sans-serif;
  font-size: 14px;
  background-color: var(--list-back);
  padding: 0 5px;
  user-select: none;
  box-shadow: #050c0a8a 0px 0px 2px 6px;
}
.list__headers {
  position: relative;
  background-color: #050c0a;
  color: var(--font-headers);
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  cursor: grab;
  gap: 25px;
  padding: 8px;
  width: 625px;
  padding-right: 280px;
}
.list__headers h3 {
  position: relative;
  padding: 10px 8px;
}
.sortable {
  cursor: pointer;
}
.dragableging {
  cursor: grabbing;
}
.sort-1::after,
.sort-2::after,
.sort-3::after {
  content: "▼";
  color: var(--font-headers);
  position: absolute;
  font-weight: bold;
  font-size: 24px;
  top: 0;
  right: -10px;
  text-shadow: var(--font-headers) 0px 0px 5px;
}
.sort-1::after {
  transform: translateY(20%) rotate(90deg);
}
.sort-2::after {
  right: -12px;
  transform: translateY(20%);
}
.sort-3::after {
  right: -12px;
  transform: translateY(20%) rotate(180deg);
}

.list__container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  text-align: center;
  padding: 3px 3px 8px 3px;
}
.list__lobbies {
  position: relative;
  background-color: #081c1c;
  padding-right: 4px;
  overflow-y: scroll;

  display: flex;
  flex-direction: column;
  align-items: center;
  width: 645px;
  height: 395px;
}

.list__new-version {
  position: absolute;
  padding: 4px;
  font-size: 14px;
  right: -2px;
  top: 5px;
  font-weight: bold;
  color: #dfc200;
  text-decoration: none;
  animation: newVersion 7s linear infinite;
}
.list__new-version:hover {
  filter: brightness(0.8);
}
.list__current-version {
  font-size: 14px;
  right: 5px;
  position: absolute;
  font-weight: bold;
  color: var(--font-lobby);
}
@keyframes newVersion {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(2deg);
  }
  50% {
    transform: rotate(0deg);
  }
  75% {
    transform: rotate(-2deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

/*
* lobbies
 */

.list__lobbies .scanning {
  display: none;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-75%);
  position: absolute;
  background-color: #153832;
  color: var(--font-lobby);
  font-size: 26px;
  padding: 5px 10px;
  width: 420px;
}

.circle {
  display: inline-block;
  width: 10px;
  height: 10px;
  opacity: 0;
  border-radius: 3px;
  background-color: var(--font-lobby);
  animation: loading 1.5s cubic-bezier(0.8, 0.5, 0.2, 1.4) infinite;
  position: relative;
}
@keyframes loading {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  40% {
    opacity: 0;
    transform: scale(0);
  }
  60% {
    opacity: 1;
    transform: scale(1);
  }
  80% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0);
  }
}
@keyframes selected {
  0% {
    filter: brightness(0.75);
  }

  50% {
    filter: brightness(1);
  }
  100% {
    filter: brightness(0.75);
  }
}
.circle-1 {
  animation-delay: 0s;
}
.circle-2 {
  animation-delay: 0.05s;
}
.circle-3 {
  animation-delay: 0.1s;
}
.circle-4 {
  animation-delay: 0.15s;
}
.circle-5 {
  animation-delay: 0.2s;
}
.circle-6 {
  animation-delay: 0.25s;
}
.circle-7 {
  animation-delay: 0.3s;
}
.circle-8 {
  animation-delay: 0.35s;
}
.circle-9 {
  animation-delay: 0.4s;
}
.circle-10 {
  animation-delay: 0.5s;
}

#list ::-webkit-scrollbar {
  background-color: var(--lobby-menu-back);
  width: 8px;
  padding: 1px;
}

#list ::-webkit-scrollbar-thumb {
  background-color: #f3fdfd;
  border-radius: 1px;
}

.lobby {
  cursor: pointer;
  background-color: var(--lobby-back);
  color: var(--font-lobby);
  padding: 5px 15px;
  border-radius: 5px;
  border: #375552 2px solid;
  margin-bottom: -1px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 25px;

  min-width: 500px;
}
.lobby.active {
  animation: selected 1.5s cubic-bezier(0.8, 0.5, 0.2, 1.4) infinite;
}
.lobby.selected {
  background-color: #315a56;
}
.lobby:hover {
  background-color: #2c6b54;
  transition: 0.05s;
}
.lobby svg {
  align-items: center;
  border-radius: 50%;
  height: 25px;
  width: auto;
}

.lobby__region {
  width: 80px;
}

.lobby__name {
  width: 250px;
}
.lobby .lobby__name {
  user-select: text;
}
.lobby__onl {
  width: 75px;
}
.lobby__gm {
  width: 120px;
}

/*
* filter
 */

.list__filter {
  font-weight: bolder;
  background-color: var(--filter-back);
  color: var(--font-filter);
  height: 395px;
  width: 250px;
}
.filter__container {
  overflow-y: scroll;
  max-height: 290px;
}
.list__filter h3 {
  font-size: 28px;
  margin: 15px 0;
}

.list__filter ul {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: left;
  margin: 0 7.5px;
}
ul.filter__cbs {
  margin-bottom: 20px;
  padding-right: 10px;
}
ul.filter__opts {
  margin-bottom: 10px;
  padding-right: 10px;
  max-height: 150px;
}

.list__filter line {
  position: relative;
  width: 100%;
  font-size: 14px;
  margin: 7.5px 0;
}
.list__filter input {
  position: absolute;
  opacity: 0;
}
.custom-cb::before {
  content: "";
  cursor: pointer;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  position: absolute;
  background-color: transparent;
  border: var(--font-filter) 2px solid;
  width: 20px;
  height: 20px;
}
.custom-cb::after {
  content: "";
  cursor: pointer;
  opacity: 0;
  top: 50%;
  right: 4.3px;
  transform: translateY(-50%);
  position: absolute;
  background-color: var(--font-filter);
  width: 15px;
  height: 15px;
}
.list__filter input:checked + .custom-cb::after {
  opacity: 1;
  transition: 0.05s;
}

.custom-sl {
  padding: 3px 0;
  transform: translateY(-50%);
  top: 50%;
  width: 100px;
  color: var(--filter-back);
  font-weight: bold;
  background-color: var(--font-filter);
  right: 0;
  border: none;
  position: absolute;
}
.custom-sl:hover {
  filter: brightness(1.33);
  transition: 0.1s;
}
.custom-cb:hover::after,
.custom-cb:hover::before {
  filter: brightness(1.33);
  transition: 0.1s;
}
option {
  border: none;
  font-weight: bold;
  background-color: var(--list-back);
  color: var(--font-headers);
}

/*
* buttons
*/
.filter__buttons {
  padding-top: 10px;
}

button {
  position: relative;
  font-size: 24px;
  font-weight: bold;
  color: var(--font-buttons);
  margin: 5px 0px;
  padding: 3px 0;
  border-radius: 7.5px;
  cursor: pointer;
}
button.gray-btn {
  background-color: var(--gray-btn-back);
  cursor: not-allowed;
  filter: brightness(0.5);
}
button.yellow-btn {
  background-color: var(--yellow-btn-back);
}
button.yellow-btn:hover {
  background-color: var(--yellow-hov-back);
  box-shadow: inset var(--yellow-btn-back) 0px 0px 12px 12px;
}
button.yellow-btn:active {
  background-color: var(--yellow-act-back);
  box-shadow: inset var(--yellow-btn-back) 0px 0px 10px 7px;
}
button.green-btn {
  background-color: var(--green-btn-back);
}
button.green-btn:not(.btn-blocked):hover {
  background-color: var(--green-hov-back);
  box-shadow: inset var(--green-btn-back) 0px 0px 12px 12px;
}
button.green-btn:not(.btn-blocked):active {
  background-color: var(--green-act-back);
  box-shadow: inset var(--green-btn-back) 0px 0px 10px 7px;
}
button.btn-blocked {
  cursor: not-allowed;
  filter: brightness(0.66);
}
`;
document.body.append(css);
