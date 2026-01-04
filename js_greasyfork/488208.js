// ==UserScript==
// @name         [twitch.tv] - Highlight important messages in chat
// @namespace    https://github.com/xiithrian/twitch-chat-highlight
// @version      0.8.3.1
// @description  Use color coding to highlight certain chat messages.
// @author       Xiithrian
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?domain=twitch.tv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488208/%5Btwitchtv%5D%20-%20Highlight%20important%20messages%20in%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/488208/%5Btwitchtv%5D%20-%20Highlight%20important%20messages%20in%20chat.meta.js
// ==/UserScript==

//? TODO: Add support for Admin badge.
//? TODO: Add support for Staff badge.
//? TODO: Check if compatible with the "new" fancy reply thing.

let user, bots

(async function() {
  'use strict'

  //& Color palette: https://coolors.co/ff1f1f-527652-00bf00-bfff00-b700ff-3f003f-ff7f00-00ffff-df00df
  const colors = {
    author: {
      streamer:  "#FF1F1F", //* Red RYB.
      bot:       "#527652", //* Amazon.
      moderator: "#00BF00", //* Kelly Green.
      vip:       "#BFFF00", //* Bitter Lime.
      partner:   "#B700FF", //* Electric Purple.
      user:      "#3F003F", //* Russian Violet.
    },
    mention: {
      streamer:  "#FF7F00", //* Orange.
      chat:      "#00FFFF", //* Aqua.
      user:      "#DF00DF", //* Steel Pink.
    },
  }

  let streamer = document.querySelectorAll('.tw-halo')[0]?.getAttribute("href")?.replaceAll('/', '')
  if (!streamer) {
    streamer = window.channelName
        ?? document.querySelector('iframe.twitch-chat')?.id
        ?? location.href.split('twitch.tv/')[1].replaceAll("popout/", "").replaceAll("embed/", "").replaceAll("u/", "").split("/")[0]
  }
  streamer = streamer.toLowerCase()
  user = document.cookie.split(';').filter(c => c.includes("login="))[0]?.split('=')[1].toLowerCase()
  bots = await getBots()

  console.log(`Highlight important messages in chat - enabled (streamer = ${streamer}, user = ${user})`)

  new MutationObserver(() => {
    document.querySelectorAll('.chat-line__message, .vod-message').forEach(node => {
      // if (!node.parentNode.classList.contains("chat-scrollable-area__message-container")) {
      //   //* Ignore messages that are not a direct child of the `chat-scrollable-area__message-container`,
      //   //* which means messages already highlighted with channel points are not highlighted twice.
      //   return
      // }

      //^* Get message text, without the text from emote tooltips.
      let text = []
      const subnodes = node.querySelectorAll('[data-test-selector="chat-line-message-body"] :not([class*=tooltip], [class*=tooltip] *), .message  :not([class*=tooltip], [class*=tooltip] *)')
      subnodes.forEach(n => {
        let child = n.firstChild
        while (child) {
          if (child.nodeType == Node.TEXT_NODE) {
            text.push(child.data)
          }
          child = child.nextSibling
        }
      })
      const message = text.join('').toLowerCase()

      //^* Apply highlights.
      if (sentBy(node, "Broadcaster")) {
        node.style = style(colors.author.streamer)
      }
      else if (sentBy(node, "Bot")) {
        node.style = style(colors.author.bot)
      }
      else if (sentBy(node, "Moderator")) {
        node.style = style(colors.author.moderator)
      }
      else if (sentBy(node, "VIP")) {
        node.style = style(colors.author.vip)
      }
      else if (sentBy(node, "Partner")) {
        node.style = style(colors.author.partner)
      }
      else if (message.includes(streamer)) {
        node.style = style(colors.mention.streamer)
      }
      else if (message.includes("chat")) {
        node.style = style(colors.mention.chat)
      }
      if (user) {
        if (sentBy(node, "User")) {
          node.style = style(colors.author.user)
        }
        else if (message.includes(user)) {
          node.style = style(colors.mention.user)
        }
      }
    })
  }).observe(document.body, {childList: true, subtree: true})
})()

//^ Message highlight styling template.
function style(color) {
  return `
      border: 1px solid #222;
      margin: -1px;
      background-color: ${color}3F;
      border-left: 6px solid ${color};
  `
}

//^ Check who sent message.
function sentBy(node, author) {
  if (author === "User") {
    return getAuthor(node) === user
  }
  if (author === "Bot") {
    return bots.includes(getAuthor(node))
  }
  const badgeNameLowerCase = author.toLowerCase()
  return node.querySelector(`span[data-badge="${badgeNameLowerCase}"]`)
      ?? node.querySelector(`img.chat-badge[alt="${badgeNameLowerCase}"]`)
}

//^ Get the author of a message.
function getAuthor(node) {
  const author = node.querySelector("span.chat-author__intl-login")?.innerText
      ?? node.querySelector("span.chat-author__display-name")?.innerText
  return author.replaceAll(' ', '').replaceAll('(', '').replaceAll(')', '').toLowerCase()
}

//^ Fetch known bots from `twitchbots.info` API.
function getBots() {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest()
		xhr.open('GET', 'https://api.twitchbots.info/v2/bot?limit=0', true)
		xhr.responseType = 'json'
		xhr.onload = () => {
			if (xhr.status == 200) {
				resolve(xhr.response.bots.map(bot => bot.username))
			}
			else {
				reject(xhr.status)
			}
		}
		xhr.send()
	})
}
