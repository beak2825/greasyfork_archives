// ==UserScript==
// @name        DiscordTextReact
// @namespace   Violentmonkey Scripts
// @match       https://discord.com/*
// @grant       GM_getValue
// @grant       GM_setValue
// @version     1.3
// @author      nopeee
// @description Discord client-side userscript that allows users to comment messages with reactions/emojis (eg you input nice in the text box and it will react with 🇳 🇮 🇨 🇪 to the message)
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462191/DiscordTextReact.user.js
// @updateURL https://update.greasyfork.org/scripts/462191/DiscordTextReact.meta.js
// ==/UserScript==

// READ SCRIPT DESC !!!
/* ADD THE FOLLOWING BOOKMARK (select the text and drag it to your bookmarks) AND CLICK IT ON DISCORD PAGE (allows getting header propreties to send not suspicious requests to discord)
javascript:var getToken = () => {     const webpackCache = window.webpackChunkdiscord_app.push([         [Symbol()], {}, (req) => Object.values(req.c)    ]);     webpackChunkdiscord_app.pop();    const { getToken } = webpackCache.find(m => m?.exports?.default?.getToken).exports.default ; return getToken();};var getxsuperpropreties = () => {   const webpackCache = window.webpackChunkdiscord_app.push([[Symbol()], {}, (req) => Object.values(req.c)  ]);webpackChunkdiscord_app.pop();const { getSuperPropertiesBase64 } = webpackCache.find(m => m?.exports?.default?.getSuperPropertiesBase64).exports.default;return getSuperPropertiesBase64();};["authorization","xsuperproperties"].forEach((thing)=>{  var obj = document.createElement("meta");  obj.setAttribute("property",thing);  obj.setAttribute("content",(thing == "authorization" ? getToken() : getxsuperpropreties()));  document.head.appendChild(obj);})
*/
var authorization = GM_getValue("authorization", "");
var xsuperproperties = GM_getValue("xsuperproperties", "");
// identify an element to observe
const elementToObserve = document.head;

// create a new instance of `MutationObserver` named `observer`,
// passing it a callback function
const observer = new MutationObserver((muta) => {
  console.log("mutation!", muta);
  let shouldEscape = false;
  [...muta].forEach((mutation) => {
    if (mutation.addedNodes.length != 1) { shouldEscape = true };
  })
  if (shouldEscape) { console.log("nothing to be checked"); return };
  var authobj = document.querySelector("[property=authorization]")
  var superobj = document.querySelector("[property=xsuperproperties]")
  if (authobj) {
    GM_setValue("authorization", authobj.getAttribute("content"));
    authorization = authobj.getAttribute("content");
    console.log("successfully stored auth")
    authobj.remove()
  }
  if (superobj) {
    GM_setValue("xsuperproperties", superobj.getAttribute("content"));
    xsuperproperties = superobj.getAttribute("content");
    console.log("successfully stored xsuper")
    superobj.remove()
  }
});

// call `observe()` on that MutationObserver instance,
// passing it the element to observe, and the options object
document.onreadystatechange = () => {
  observer.observe(elementToObserve, { subtree: true, childList: true });
  console.log("observer ran")
}



console.log("current creds: ", authorization, "\n", xsuperproperties)



console.log("init'd")
setInterval(() => {
  if (!authorization || !xsuperproperties) {
   // return alert("You need to execute the bookmarklet. Visit the script page if you deleted it in the meantime (https://greasyfork.org/en/scripts/462191-text-react-discord-com)")
  }
  prepareTextReactButtons()
}, 1000)


var prepareTextReactButtons = () => {
  document.querySelectorAll("[aria-label^='Add Reaction']").forEach((el) => {
    if (!el.className.includes("button") || el.getAttribute("magicked") == "true") return;
    el.setAttribute("magicked", "true")
    var test = el.cloneNode(true)
    test.setAttribute("aria-label", "Text React")
    test.children[0].children[0].setAttribute("d", "M47.8262,28.9883c0-4.3979-3.5781-7.9761-7.9756-7.9761h-10.6768c-.5527,0-1,.4478-1,1v28c0,.5522,.4473,1,1,1s1-.4478,1-1v-13.0518h9.2615l5.8088,13.4453c.1631,.3779,.5312,.604,.9189,.604,.1318,0,.2666-.0269,.3955-.0825,.5068-.2192,.7402-.8076,.5215-1.3145l-5.5452-12.835c3.5908-.7753,6.2913-3.9715,6.2913-7.7896Zm-7.9756,5.9722h-9.6768v-11.9482h9.6768c3.2949,0,5.9756,2.6807,5.9756,5.9761,0,3.293-2.6807,5.9722-5.9756,5.9722Z")
    test.children[0].children[0].setAttribute('fill', 'none')
    test.children[0].children[0].setAttribute("stroke", "#000")
    test.children[0].children[0].setAttribute("stroke-linejoin", 'round')
    test.children[0].children[0].setAttribute('stroke-width', "2")
    test.children[0].children[0].removeAttribute('fill-rule')
    test.children[0].children[0].removeAttribute("clip-rule")
    test.children[0].setAttribute("viewBox", "0 0 72 72")
    test.onclick = (event) => {
      askForMessage(event)
    }
    el.parentElement.prepend(test)
  })
}


var askForMessage = (event) => {
  if (!authorization || !xsuperproperties) return alert("somehow, you miss auth header values... This should not happen ! https://greasyfork.org/en/scripts/462191-text-react-discord-com")
  var target = event.target
  while (!target.id.includes("chat-messages-")) {
    target = target.parentElement
  }
  var targetmsgid = target.id.split('-')[3]
  var msg = prompt("Enter the text you want to react with :")
  if (msg == null) return;
  var rList = generateEmojiArray(msg.toLowerCase())
  var doit = true
  if (rList[1]) {
    doit = confirm("Not every letter could be converted. Continue ?")
  }
  if (doit) {
    console.log("doing it", rList)
    var i = 0
    rList[0].forEach((item) => {
      setTimeout(() => { sendAddReaction(targetmsgid, item) }, i * 1234)
      i++;
    })
  }
}



var sendAddReaction = (msgid, letter) => {
  console.log("Adding a ", letter, " to ", msgid)
  console.log("auth:", authorization, " super:", xsuperproperties);

  fetch(`https://discord.com/api/v9/${location.pathname.split("/")[1]}/${location.pathname.split("/")[3]}/messages/${msgid}/reactions/${encodeURI(letter)}/%40me?location=Message&type=0`, {
    "credentials": "include",
    "headers": {
      "User-Agent": navigator.userAgent,
      "Accept": "*/*",
      "Accept-Language": "en-US,en;q=0.5",
      "Authorization": authorization,
      "X-Super-Properties": xsuperproperties,
      "X-Discord-Locale": "en-GB",
      "X-Discord-Timezone": "UTC",
      "X-Debug-Options": "bugReporterEnabled",
      "Alt-Used": "discord.com",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin"
    },
    "referrer": location.href,
    "method": "PUT",
    "mode": "cors"
  })



}



var generateEmojiArray = (msg) => {
  var eSingles = new Map(); singles.forEach((val, key) => eSingles.set(key, [...singles.get(key)]));
  var eMultiples = new Map(); multiple.forEach((val, key) => eMultiples.set(key, [...multiple.get(key)]));
  var unusedReactions = { singles: eSingles, multiple: eMultiples }
  const allReactions = [...unusedReactions.singles.keys()].concat(...unusedReactions.multiple.keys())
  const mulKeys = [...unusedReactions.multiple.keys()];
  const siKeys = [...unusedReactions.singles.keys()]
  var newReactions = []
  var incomplete = false;

  while (msg != "") {
    console.log(msg)
    if (allReactions.indexOf(msg[0]) == -1) {
      console.log("slicing ", msg[0])
      msg = msg.slice(1)
      incomplete = true
    }
    mulKeys.forEach((reactionName) => {
      console.log(reactionName)
      if (msg != "" && msg.startsWith(reactionName) && unusedReactions.multiple.get(reactionName) != undefined && unusedReactions.multiple.get(reactionName).length != 0) {
        var reactionValue = unusedReactions.multiple.get(reactionName).reverse().pop(0)
        newReactions.push(reactionValue)
        console.log(reactionValue, " / replaced in 1")
        msg = msg.replace(reactionName, "")
      } else if (msg != "" && msg.startsWith(reactionName) && (unusedReactions.multiple.get(reactionName) == undefined || unusedReactions.multiple.get(reactionName).length == 0)) {
        msg = msg.replace(reactionName, "")
        console.log("replaced in 2")
        incomplete = true
      }
    })


    siKeys.forEach((reactionName) => {
      if (msg != "" && msg.startsWith(reactionName) && unusedReactions.singles.get(reactionName) != undefined && unusedReactions.singles.get(reactionName).length != 0) {
        console.log(unusedReactions.singles.get(reactionName))
        var reactionValue = unusedReactions.singles.get(reactionName).reverse().pop(0)
        newReactions.push(reactionValue)
        console.log(reactionValue)
        console.log("replaced in 3")

        msg = msg.replace(reactionName, "")
      } else if (msg != "" && msg.startsWith(reactionName) && (unusedReactions.singles.get(reactionName) == undefined || unusedReactions.singles.get(reactionName).length == 0)) {
        msg = msg.replace(reactionName, "")
        console.log("replace in 4")
        incomplete = true
      }
    })


  }

  return [newReactions, incomplete]


}






var singles = new Map([
  ["a", ["\uD83C\uDDE6", "\uD83C\uDD70"]],
  ["b", ["\uD83C\uDDE7", "\uD83C\uDD71"]],
  ["c", ["\uD83C\uDDE8", "©"]],
  ["d", ["\uD83C\uDDE9"]],
  ["e", ["\uD83C\uDDEA", "\uD83D\uDCE7", "🎼"]],
  ["f", ["\uD83C\uDDEB"]],
  ["g", ["\uD83C\uDDEC"]],
  ["h", ["\uD83C\uDDED", "♓"]],
  ["i", ["\uD83C\uDDEE", "ℹ"]],
  ["j", ["\uD83C\uDDEF"]],
  ["k", ["\uD83C\uDDF0"]],
  ["l", ["\uD83C\uDDF1"]],
  ["m", ["\uD83C\uDDF2", "Ⓜ", "♏", "♍"]],
  ["n", ["\uD83C\uDDF3", "♑"]],
  ["o", ["\uD83C\uDDF4", "\uD83C\uDD7E", "⭕"]],
  ["p", ["\uD83C\uDDF5", "\uD83C\uDD7F"]],
  ["q", ["\uD83C\uDDF6"]],
  ["r", ["\uD83C\uDDF7", "®"]],
  ["s", ["\uD83C\uDDF8", "💲"]],
  ["t", ["\uD83C\uDDF9", "✝"]],
  ["u", ["\uD83C\uDDFA"]],
  ["v", ["\uD83C\uDDFB", "♈"]],
  ["w", ["\uD83C\uDDFC"]],
  ["x", ["\uD83C\uDDFD", "❎", "❌", "✖"]],
  ["y", ["\uD83C\uDDFE"]],
  ["z", ["\uD83C\uDDFF"]],
  ["0", ["0️⃣"]],
  ["1", ["1️⃣"]],
  ["2", ["2️⃣"]],
  ["3", ["3️⃣"]],
  ["4", ["4️⃣"]],
  ["5", ["5️⃣"]],
  ["6", ["6️⃣"]],
  ["7", ["7️⃣"]],
  ["8", ["8️⃣"]],
  ["9", ["9️⃣"]],
  ["?", ["❔", "❓"]],
  ["+", ["➕"]],
  ["-", ["➖", "⛔", "\uD83D\uDCDB"]],
  ["!", ["❕", "❗"]],
  ["*", ["*️⃣"]],
  ["$", ["\uD83D\uDCB2"]],
  ["#", ["#️⃣"]],
  [" ", ["▪", "◾", "➖", "◼", "⬛", "⚫", "\uD83D\uDDA4", "\uD83D\uDD76"]]
])
var multiple = new Map([
  ["wc", ["\uD83D\uDEBE"]],
  ["back", ["\uD83D\uDD19"]],
  ["end", ["\uD83D\uDD1A"]],
  ["on!", ["\uD83D\uDD1B"]],
  ["soon", ["\uD83D\uDD1C"]],
  ["top", ["\uD83D\uDD1D"]],
  ["!!", ["‼"]],
  ["!?", ["⁉"]],
  ["tm", ["™"]],
  ["abcd", ["🔡", "🔠"]],
  ["10", ["\uD83D\uDD1F"]],
  ["cl", ["\uD83C\uDD91"]],
  ["cool", ["\uD83C\uDD92"]],
  ["free", ["\uD83C\uDD93"]],
  ["id", ["\uD83C\uDD94"]],
  ["new", ["\uD83C\uDD95"]],
  ["ng", ["\uD83C\uDD96"]],
  ["ok", ["\uD83C\uDD97"]],
  ["sos", ["\uD83C\uDD98"]],
  ["up!", ["\uD83C\uDD99"]],
  ["vs", ["\uD83C\uDD9A"]],
  ["abc", ["\uD83D\uDD24"]],
  ["ab", ["\uD83C\uDD8E"]],
  ["18", ["\uD83D\uDD1E"]],
  ["100", ["\uD83D\uDCAF"]],
  ["atm", ["\uD83C\uDFE7"]]
])
