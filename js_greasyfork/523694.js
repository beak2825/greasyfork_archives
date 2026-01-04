// ==UserScript==
// @name         faction-member-avail
// @namespace    faction-member-avail.zero.nao
// @version      0.1
// @description  faction member availability
// @author       nao [2669774]
// @match        https://www.torn.com/factions.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/523694/faction-member-avail.user.js
// @updateURL https://update.greasyfork.org/scripts/523694/faction-member-avail.meta.js
// ==/UserScript==

let api = "APIKEY";

let member_list = [];

function getMembers() {
  const url = `https://api.torn.com/v2/faction?key=${api}&selections=members`;
  const response = fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log("Got member data");
      analyse(data);
    });
}

function analyse(data) {
  member_list = [];
  for (const member of data.members) {
    const member_id = member.id;
    const is_flying =
      member.status.state == "Traveling" || member.status.state == "Abroad";
    const is_in_oc = member.is_in_oc;
    const online = member.last_action.status == "Online";

    console.log(member_id, is_flying, is_in_oc, online);
    if (!is_flying && !is_in_oc && online) {
      member_list.push(String(member_id));
    }
  }
  console.log(member_list);
  updateDisplay();
}

function updateDisplay() {
  $(".table-body > li ").each(function () {
    const member_id =
      $("a[href*='XID=']", this)?.attr("href")?.split("XID=")[1] || undefined;
    console.log(member_id);
    if (member_id && member_list.includes(String(member_id))) {
      $(this).css("background-color", "red");
    }
  });
}

if (window.location.href.includes("profile")) {
  getMembers();
}
$(document).on("hashchange", function () {
  if (window.location.href.includes("tab=info")) {
    getMembers();
  }
});
