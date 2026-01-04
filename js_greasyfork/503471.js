// ==UserScript==
// @name         Remove Homepage Garbage
// @namespace    https://www.roblox.com/home
// @version      2025.05.11
// @description  Removes everything from the roblox homepage deemed useless (you'll basically just see your friends, continue section, and favourites)
// @author       CMTG (@callmetreeguy on discord)
// @match        https://www.roblox.com/home
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503471/Remove%20Homepage%20Garbage.user.js
// @updateURL https://update.greasyfork.org/scripts/503471/Remove%20Homepage%20Garbage.meta.js
// ==/UserScript==


const DontDelete = {
    "Continue": true,
    "Favorites": true
}

function removeRecommendedSection() {
    const allGameGrids = document.querySelectorAll('div[data-testid="home-page-game-grid"]');
    allGameGrids.forEach(GameGrid => GameGrid.remove())

    const allContainers = document.querySelectorAll('div.game-sort-carousel-wrapper');
    //aria-label
    allContainers.forEach(container => {

        const ContainerText = container.querySelector("div.home-sort-header-container > div > *:first-child").getAttribute('aria-label')
        //ty roblox for inculding the aria-label <3
        if (!DontDelete[ContainerText]) {
            container.remove()
        }
    })

}
window.addEventListener('load', removeRecommendedSection);

const observer = new MutationObserver((mutations) => {
    const ContinueAB1 = document.querySelector("h2.sort-header > a")
    const ContinueAB2 = document.querySelector('div[data-testid="section-header"] > a')

    // basically if you are in the old homepage and not in the A/B test roblox will delete the entire game page accidentially

    if ((ContinueAB1 && ContinueAB1.innerText == "Continue") || ContinueAB2){
        setTimeout(removeRecommendedSection, 0)
    }
});

observer.observe(document.body, { childList: true, subtree: true });