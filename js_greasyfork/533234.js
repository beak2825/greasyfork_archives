// ==UserScript==
// @name        DynamoAlarm
// @namespace   Zweitmarkt Alarm
// @match       *://karten.dynamo-dresden.de/*
// @grant       none
// @version     1.88.77
// @author      -
// @description 🌲kattn
// @downloadURL https://update.greasyfork.org/scripts/533234/DynamoAlarm.user.js
// @updateURL https://update.greasyfork.org/scripts/533234/DynamoAlarm.meta.js
// ==/UserScript==

function main() {
  const bodyEl = document.body.textContent.toLowerCase();
  if (bodyEl.includes("19. ligaheimspiel")) {
    if (bodyEl.includes("zweitmarkt")) {
      new Audio("https://cdn-1.files.vc/files/7nd/959687dede940d99e10a5d3ff1488db1.mp3?md5=bca7680b79bf7afec30e24d9c4d18dfc&t=1744973575962&o=Dh0YFQAUWUxLGgkGG0sEFw&a=t").play()

      document.getElementsByTagName("body")[0].style = "background: green";
    } else if (!bodyEl.includes("angebote in der kartenbörse")) {
      setTimeout(() => {
        location.reload()
      }, 5000)
    }
  }
}

window.addEventListener("load", function() {
  main();
});