// ==UserScript==
// @name        Remove Important YouTube Notifications
// @namespace   greasyfork.org/en/users/1436613
// @match       https://www.youtube.com/*
// @version     1.2.3
// @license     MIT
// @author      gosha305
// @description Removes the "Important" section in the YouTube notification menu, putting the notifications whithin it back to their appropriate position in the notification list.
// @downloadURL https://update.greasyfork.org/scripts/531926/Remove%20Important%20YouTube%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/531926/Remove%20Important%20YouTube%20Notifications.meta.js
// ==/UserScript==

let orderOfPrecedence = ["justnow", "secondsago", "minuteago", "minutesago", "hourago", "hoursago", "dayago", "daysago", "weekago", "weeksago", "monthago", "monthsago", "yearago", "yearsago"];
let lookedUpOrderOfPrecedence = false;
let regularNotificationPanel;
let importantNotificationPanel;

const menuRemover = new CSSStyleSheet();
document.adoptedStyleSheets.push(menuRemover);

let rule = menuRemover.cssRules[menuRemover.insertRule("#sections yt-multi-page-menu-section-renderer:has(ytd-notification-renderer),ytd-popup-container #sections:has(ytd-notification-renderer) #section-title {}")];
rule.style.setProperty("display", "none");

(async function(){
  //to avoid infinitely waiting for the popup on pages with YouTube embeds
  if (!window.location.href.startsWith("https://www.youtube.com/")){
    return;
  }

  let popupContainer;
  function findPopup(resolve){
    popupContainer = document.querySelector("ytd-popup-container")
    if (!popupContainer){
      setTimeout(() => findPopup(resolve), 200);
    } else {
      resolve();
    }
  }
  await new Promise(findPopup);

  const popupObserver = new MutationObserver(function(){
    const notificationMenu = document.querySelector("ytd-popup-container")?.lastChild
    if (notificationMenu?.nodeName == "TP-YT-IRON-DROPDOWN"){
            const notificationObserver = new MutationObserver(function(mutationList){replaceNotifications(mutationList);});
      notificationObserver.observe(notificationMenu, {attributes: true});
      popupObserver.disconnect();
    }
  });
    popupObserver.observe(popupContainer, {childList: true, subtree:true})


  function replaceNotifications(mutationList){
    const notificationsMenus = document.querySelectorAll("yt-multi-page-menu-section-renderer:has(ytd-notification-renderer)");
    if (!notificationsMenus || !notificationsMenus.length){
            return;
    }
    const importantNotifications =  notificationsMenus[0].querySelectorAll("#items > ytd-notification-renderer");
    if (!importantNotifications || !importantNotifications.length) {
            return;
    }
    regularNotificationPanel = notificationsMenus[1];
    if (!regularNotificationPanel){
      notificationsMenus[0].style.display = "unset";
      return;
    }
    regularNotificationPanelItems = regularNotificationPanel.querySelector("#items");

    lookedUpOrderOfPrecedence = false;
    importantNotifications.forEach(notification => {regularNotificationPanelItems.insertBefore(notification,findAppropriatePosition(notification))});
        regularNotificationPanel.style.display = "unset";
  }

  function findAppropriatePosition(element){
    const elementParts = element.querySelector(".metadata.style-scope.ytd-notification-renderer > yt-formatted-string:nth-of-type(2)").textContent.split(" ");
    let nonNumberPartsRank = orderOfPrecedence.indexOf(elementParts.filter(e => isNaN(Number(e))).join(''));
    if (!lookedUpOrderOfPrecedence && nonNumberPartsRank == -1){
      orderOfPrecedence = getOrderOfPrecendence()
      lookedUpOrderOfPrecedence = true;
      nonNumberPartsRank = orderOfPrecedence.indexOf(elementParts.filter(e => isNaN(Number(e))).join(''));
    }
    const NumberParts = elementParts.find(e => !isNaN(Number(e)))
    const rep = Array.from(regularNotificationPanel.querySelectorAll("ytd-notification-renderer")).find(e => !compareUploadDateText(e.querySelector(".metadata.style-scope.ytd-notification-renderer > yt-formatted-string:nth-of-type(2)").textContent, nonNumberPartsRank, NumberParts));
    return rep;
  }

  //look up the order of notifications already in the panel to determine which words represent minutes/hours/days/months/years if the notifications aren't in English

  function getOrderOfPrecendence(){
    const seen = new Set();
    const nonNumberDateParts = Array.from(regularNotificationPanel.querySelectorAll("ytd-notification-renderer .metadata.style-scope.ytd-notification-renderer > yt-formatted-string:nth-of-type(2)")).map(e => e.textContent.split(" ").filter(part => isNaN(Number(part))).join(''));
    return nonNumberDateParts.filter(e => {if (seen.has(e)) return false; seen.add(e); return true;})
  }

  function compareUploadDateText(date1, nonNumberPartsRank2,date2NumberParts){
    const date1Parts = date1.split(" ");
    const nonNumberPartsRank1 = orderOfPrecedence.indexOf(date1Parts.filter(e => isNaN(Number(e))).join(''));
    if (nonNumberPartsRank1 < nonNumberPartsRank2){
      return true;
    } else if (nonNumberPartsRank1 > nonNumberPartsRank2){
      return false;
    } else {
      return Number(date1Parts.find(e => !isNaN(Number(e)))) < date2NumberParts
    }
  }
})();