// ==UserScript==
// @name         Ultimate Nitro Type Leaderboards
// @version      1.0
// @description  Adds a season leaderboard, individual leaderboard, and Hall of Fame to the top teams tab.
// @author       Toonidy, Silas Davis, & disrupt
// @author       disrupt
// @match        *://*.nitrotype.com/*
// @grant        none
// @namespace    https://singdev.wixisite.com/sing-developments
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477711/Ultimate%20Nitro%20Type%20Leaderboards.user.js
// @updateURL https://update.greasyfork.org/scripts/477711/Ultimate%20Nitro%20Type%20Leaderboards.meta.js
// ==/UserScript==

const leaderboardCard = document.querySelector("main.structure-content section.card"),
  leaderboardTableContainer = leaderboardCard?.querySelector(".well--p"),
//leaderboardTop = leaderboardCard?.querySelector("card-cap bg--gradient"),
  leaderboardObj = leaderboardTableContainer ? findReact(leaderboardTableContainer) : null;

const leaderboardButton = document.querySelector("#root > div.structure.structure--nitrotype.structure--noAds > header > div > div.header-bar.split.split--start > div:nth-child(2) > div > ul > li:nth-child(3) > a");
leaderboardButton.lastChild.textContent = "Leaderboards";
if (!leaderboardCard || !leaderboardTableContainer || !leaderboardObj) {
  return;
}

const style = document.createElement("style");
style.appendChild(
  document.createTextNode(`
    .nt-new-lb { margin-bottom: 1rem }
    .nt-new-lb .btn { margin-right: 15px }
  `)
)
document.head.appendChild(style);

fetch("https://www.nitrotype.com/api/v2/leaderboards?time=season")
	.then((resp) => resp.json())
	.then((resp) => {
		leaderboardObj.props.leaderboard.points.teams.season = {
			scores: resp.results.scores,
			timeSinceCache: resp.results.timeSinceCache,
		}
		leaderboardCard.querySelector(".split-cell.tar").remove()

		const tabContainer = document.createElement("div")
		tabContainer.classList.add("nt-new-lb")
		tabContainer.innerHTML = `
            <button type="button" class="btn btn--dark btn--outline btn--thin is-active is-frozen" data-tabindex="0">Last 7 Days</button>
            <button type="button" class="btn btn--dark btn--outline btn--thin" data-tabindex="1">Season</button>
            <button type="button" class="btn btn--dark btn--outline btn--thin" data-tabindex="2">Individual</button>`

        const IndividualContainer = document.createElement("div");
        leaderboardCard.appendChild(IndividualContainer);

        const topContainer = document.querySelector("#root > div.structure.structure--nitrotype.structure--noAds > main > section > div.row.row--o.well.well--b.well--l")
        topContainer.style.marginBottom = "15px"

        const linkAnchor = document.createElement("a");
        const linkText = document.createTextNode("Sheets Link")
        linkAnchor.style.padding = "0px 0px 15px 20px";
        linkAnchor.appendChild(linkText);
        linkAnchor.href = "https://docs.google.com/spreadsheets/d/1M_5hmBgVos6MYrvFuNN-X8lnAgDEJNv2IMUq4ED8dbo/edit?usp=sharing";
        linkAnchor.target = "_blank"
        linkAnchor.rel = "nonopener"

        const iframe = document.createElement("iframe");
        iframe.style.width = "100%";
        iframe.style.height = "1000px";
        iframe.src = "https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vTyqTOP8y_dFQuFatDKtOzeXLO__7v4ZK3CRiRzEHnMK02WC8p65oyi651eQTQEowum5cUPV_V2TmzJ/pubhtml?widget=true&amp;headers=false&amp;rm=minimal&amp"; // Replace with your desired URL

		tabContainer.addEventListener("click", (e) => {
			const target = e.target.closest(".btn")
			if (!target) {
				return
			}
            leaderboardTableContainer.style.display = "block";

            if (target.dataset.tabindex === "2") {
                tabContainer.style.marginTop = "20px";
                IndividualContainer.appendChild(iframe);
                IndividualContainer.prepend(linkAnchor);
                leaderboardTableContainer.before(tabContainer);
                leaderboardTableContainer.style.display = "none";
            } else {
                iframe.remove();
                tabContainer.style.marginBottom = "0px"
            }
            tabContainer.querySelectorAll(".btn").forEach((elm) => {
				elm.classList.remove("is-active", "is-frozen")
			})
			target.classList.add("is-active")

            if(target.dataset.tabindex === "0"){
                leaderboardObj.setState({
                    activeDateId: "weekly",
                })
            } else if (target.dataset.tabindex === "1"){
                leaderboardObj.setState({
                    activeDateId: "season",
                })
            }
		})
		leaderboardTableContainer.prepend(tabContainer)
	})

// Source: https://stackoverflow.com/questions/29321742/react-getting-a-component-from-a-dom-element-for-debugging/39165137#39165137
function findReact(dom, traverseUp = 0) {
  const key = Object.keys(dom).find((key) => key.startsWith("__reactFiber$"));
  const domFiber = dom[key];
  if (domFiber == null) return null;
  const getCompFiber = (fiber) => {
    let parentFiber = fiber?.return;
    while (typeof parentFiber?.type == "string") {
      parentFiber = parentFiber?.return;
    }
    return parentFiber;
  }
  let compFiber = getCompFiber(domFiber);
  for (let i = 0; i < traverseUp && compFiber; i++) {
    compFiber = getCompFiber(compFiber);
  }
  return compFiber?.stateNode;
}