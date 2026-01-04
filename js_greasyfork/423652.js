// ==UserScript==
// @name        PTP Paranoia Preview
// @description Adds a button to user's page toggling preview of the current paranoia setting
// @author      pyrophobia
// @version     0.1
// @match       https://passthepopcorn.me/user.php?id=*
// @grant       none
// @namespace   https://greasyfork.org/users/749254
// @downloadURL https://update.greasyfork.org/scripts/423652/PTP%20Paranoia%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/423652/PTP%20Paranoia%20Preview.meta.js
// ==/UserScript==

(() => {
  if (document.querySelector("a.user-info-bar__link[href*='user.php?id=']").text !== document.title.split(" ::")[0])
    return;
  
  let paranoia = -1;
  let percentile = [];
  
  function setup() {
    document.querySelectorAll(".main-column > .tabs > .tabs__bar > .tabs__bar__list > li")[3].className += " paranoia0"; // There lines
    document.querySelectorAll(".main-column > .tabs > .tabs__bar > .tabs__bar__list > li")[4].className += " paranoia0"; // hide "BP transfer", "purchase history"
    document.querySelectorAll(".main-column > .tabs > .tabs__bar > .tabs__bar__list > li")[5].className += " paranoia0"; // and "Stats" tab at the top of the page
    
    try {
    document.querySelector(".panel__heading__title [href*='torrents.php?type=snatched']").parentElement.parentElement.parentElement.className += " paranoia2"; // Recent snatches panel
    } catch(e) {};
    
    try {
      document.querySelector(".panel__heading__title [href*='torrents.php?type=uploaded']").parentElement.parentElement.parentElement.className += " paranoia3"; // Recent uploads panel
    } catch(e) {};
    
    const sidePanels = document.querySelectorAll(".sidebar .panel");
    for (const sidePanel of sidePanels) {
        const title = sidePanel.querySelector(".panel__heading__title").textContent;
        const spUL = sidePanel.querySelector("ul");
        if (title === "Personal") {
          spUL.children[2].className += " paranoia0"; // These lines
          spUL.children[3].className += " paranoia0"; // hide your
          spUL.children[4].className += " paranoia0"; // personal
          spUL.children[5].className += " paranoia0"; // informations
        } else if (title === "Stats") {
          spUL.children[6].className += " paranoia1"; // Stats panel: HnRs
          
          spUL.children[2].className += " paranoia4"; // Stats panel: Uploaded
          spUL.children[3].className += " paranoia4"; // Stats panel: Downloaded
          spUL.children[4].className += " paranoia4"; // Stats panel: Ratio
          spUL.children[5].className += " paranoia4"; // Stats panel: Average seed time
          spUL.children[7].className += " paranoia4"; // Stats panel: Points
          spUL.children[8].className += " paranoia4"; // Stats panel: Points per hour
          spUL.children[9].className += " paranoia4"; // Stats panel: Required ratio
          
          spUL.children[1].className += " paranoia5"; // Stats panel: Last seen
        } else if (title === "Community") {
          spUL.children[9].className += " paranoia1"; // Community panel: Seeding
          spUL.children[10].className += " paranoia1"; // Community panel: Seeding Size
          spUL.children[11].className += " paranoia1"; // Community panel: Average seed time
          spUL.children[12].className += " paranoia1"; // Community panel: Leeching
          spUL.children[16].className += " paranoia1"; // Community panel: Bookmarked
          
          spUL.children[13].className += " paranoia2"; // Community panel: Snatched
          spUL.children[14].className += " paranoia2"; // Community panel: Downloaded
          
          spUL.children[5].className += " paranoia3"; // Community panel: Requests filled
          spUL.children[6].className += " paranoia3"; // Community panel: Requests voted
          spUL.children[7].className += " paranoia3"; // Community panel: Uploaded
          spUL.children[8].className += " paranoia3"; // Community panel: Snatches from uploads
        } else if (title === "Next Userclass") {
          sidePanel.className += " paranoia3"; // Hide "Next Userclass" panel if the latter script is enabled          
        } else if (title === "Percentile Rankings (Hover for values)") {
          percentile[2] = { e: spUL.children[2], v: spUL.children[2].title }; // Percentile Rankings: Torrents uploaded (Paranoia: 3)
          percentile[3] = { e: spUL.children[3], v: spUL.children[3].title }; // Percentile Rankings: Requests filled (Paranoia: 3)
          percentile[4] = { e: spUL.children[4], v: spUL.children[4].title }; // Percentile Rankings: Bounty spent (Paranoia: 3)
          
          percentile[0] = { e: spUL.children[0], v: spUL.children[0].title }; // Percentile Rankings: Data uploaded (Paranoia: 4)
          percentile[1] = { e: spUL.children[1], v: spUL.children[1].title }; // Percentile Rankings: Data downloaded (Paranoia: 4)
                    
          sidePanel.className += " paranoia5"; // Hide "Percentile Rankings" panel
        }
    }
  }
  
  function toggle() {
    let i = paranoia;
    let j;
    for (; i >= 0; i--) {
      const elems = document.getElementsByClassName("paranoia" + i);
      j = 0;
      for (; j < elems.length; j++) {
        elems[j].style.display = elems[j].style.display == "" ? "none" : "";
      }
      
      if (i == 3) {
        percentile[2].e.title = percentile[2].e.title == "Hidden" ? percentile[2].v : "Hidden";
        percentile[3].e.title = percentile[3].e.title == "Hidden" ? percentile[3].v : "Hidden";
        percentile[4].e.title = percentile[4].e.title == "Hidden" ? percentile[4].v : "Hidden";
      } else if (i == 4) {
        percentile[0].e.title = percentile[0].e.title == "Hidden" ? percentile[0].v : "Hidden";
        percentile[1].e.title = percentile[1].e.title == "Hidden" ? percentile[1].v : "Hidden";
      }
    }
  }
  
  const button = document.createElement("a");
  button.href = "#";
  button.id = "linkbox_paranoia_preview";
  button.class = "brackets";
  button.text = "[Toggle paranoia preview]";
  document.getElementsByClassName("linkbox")[0].appendChild(button);
  button.onclick = function() {
    event.preventDefault();

    if (paranoia < 0) {
      paranoia = document.body.innerHTML.split("Paranoia Level: ")[1].split("</li>")[0];

      setup();        
    }
    
    toggle();
  };
})();