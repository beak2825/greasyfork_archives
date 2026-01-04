// ==UserScript==
// @name        Torn Newsletter To Discord
// @namespace   Violentmonkey Scripts
// @match       https://www.torn.com/messages.php*
// @grant       GM_xmlhttpRequest
// @version     1.1
// @license     MIT
// @author      Bilbosaggings [2323763] (BillyBourbon)
// @description 6/19/2025, 10:33:41 PM - What a dumb script lol. Sends any mail from your mailbox(when you go to the page) to a discord webhook.
// @downloadURL https://update.greasyfork.org/scripts/540151/Torn%20Newsletter%20To%20Discord.user.js
// @updateURL https://update.greasyfork.org/scripts/540151/Torn%20Newsletter%20To%20Discord.meta.js
// ==/UserScript==

const webhookUrl = 'REPLACE_WITH_YOUR_DISCORD_CHANNELS_WEBHOOK_URL_HERE';
const factionDiscordRoleId = 'REPLACE_WITH_THE_DISCORD_ROLE_ID_OF_YOUR_FACTION' // IE '813511364311384126'




const mailContainerSelector = '.mailbox-container';
const localStorageKey = 'NewsletterToDiscord';
const webhookBasePayload = {
  'username' : 'Faction Newsletter Script'
};

(() => {
  function timeStringToTimestamp(timeDate){
    const [time, date] = timeDate.split(' ')

    const [hour, minute, second] = time.split(':')
    const [day, month, year] = date.split('/')

    const longYear = 2000 + parseInt(year)

    const dateParsed = new Date(longYear, (parseInt(month) - 1), parseInt(day), parseInt(hour), parseInt(minute), parseInt(second))

    const timestampSeconds = Math.floor(dateParsed.getTime()/1000)

    return timestampSeconds
  }

  function waitForMailContainer(){
    const container = document.querySelector(mailContainerSelector)

    if(container){
      console.log(`Found '${mailContainerSelector}'`)
      handleMailContainer(container)
    } else{
      console.log(`Waiting For '${mailContainerSelector}'`)
      setTimeout(waitForMailContainer, 500)
    }
  }

  function handleMailContainer(container){
    let storedData = localStorage[localStorageKey]
    if(storedData === undefined) { storedData = { timestampLastNewsletter: Math.floor((new Date().getTime()/1000) - (60*60*24)) } }
    else { storedData = JSON.parse(storedData) }
    console.log({ storedData })

    const mailList = container.querySelector('.container-body-list')
    const mails = mailList.querySelectorAll('.row-color-marker')

    const mailsToSend = []
    let updatedTimestamp = storedData.timestampLastNewsletter ?? 0

    for(const mail of mails){
      const mailObject = handleMail(mail)

      if(mailObject.isFactionMail && mailObject.timestamp > storedData.timestampLastNewsletter){
        mailsToSend.push(mailObject)
        updatedTimestamp = mailObject.timestamp > updatedTimestamp ? mailObject.timestamp : updatedTimestamp
      }
    }

    if(mailsToSend.length > 0){
      try{
        sendMailsToDiscord(mailsToSend)

        if(updatedTimestamp > storedData.timestampLastNewsletter){
          console.log('Updating Stored Data')
          storedData.timestampLastNewsletter = updatedTimestamp
          localStorage[localStorageKey] = JSON.stringify(storedData)
        }
      } catch(e){
        console.error('Error Uploading Newsie To Discord. Error: ', e)
      }
    }
  }

  function handleMail(mail){
    const mailTime = mail.querySelector('.date-time').innerText
    const mailContent = mail.querySelector('.mail-link')

    const mailSender = mailContent.querySelector('.sender-name')

    const mailSenderName = mailSender.innerText.trim()
    const mailSenderProfileLink = mailSender.href
    const mailSenderId = mailSenderProfileLink.split('XID=')[1].trim()

    const mailBody = mailContent.querySelector('.subject')

    const mailTitle = mailBody.innerText.trim()
    const mailText = mailBody.getAttribute('title').replace(/\u00A0/g, '&nbsp;').trim()
    const mailLink = mailBody.href.trim()

    const isFactionMail = mailText.startsWith('This is a newsletter from your faction:')

    const mailObject = {
      timestamp: timeStringToTimestamp(mailTime),
      sender : {
        name : mailSenderName,
        id : mailSenderId,
        link : mailSenderProfileLink
      },
      title : mailTitle,
      content : mailText,
      mailLink,
      isFactionMail
    }

    return mailObject
  }

  function sendMailsToDiscord(mailObjects){
    const embedChunks = []

    mailObjects.forEach((obj, i) => {
      if(!embedChunks[Math.floor(i/5)]) embedChunks.push([])
      if(!obj.title || !obj.content || !obj.timestamp || !obj.sender) return
      const embed = mailObjectToDiscordEmbed(obj)
      embedChunks[Math.floor(i/5)].push(embed)
    })
    console.log({embedChunks})

    embedChunks.forEach((embeds, chunkCount) => {
      console.log(`Attempting To Send Chunk (${chunkCount + 1}) Of (${embedChunks.length})`)
      if(embeds.length === 0) {
        console.log(`Aborting Send. Chunk (${chunkCount + 1}}) Contains 0 Embeds`)
        return
      }

      const payload = {
        ...webhookBasePayload,
        content: `New Faction Newsletter <@&${factionDiscordRoleId}>`,
        embeds
      }

      console.log(`Chunk (${chunkCount + 1}) Payload: `, {payload: {stringified: JSON.stringify(payload), parsed: payload}})

      GM_xmlhttpRequest({
        method: "POST",
        url: webhookUrl,
        headers: {
          "Content-Type": "application/json"
        },
        data: JSON.stringify(payload),
        onload: (response) => {
          console.log(`Successfully Sent Chunk (${chunkCount + 1}) On Webhook: `, response.status, {response});
        },
        onerror: (err) => {
          console.error(`Failure Sending Chunk (${chunkCount + 1}) On Webhook: `, err);
        }
      });
    })
  }

  function mailObjectToDiscordEmbed(object){
    const {
      sender: { name: senderName, id: senderId, link: senderProfileLink },
      timestamp,
      title,
      content,
      mailLink
    } = object

    const embed = {
      "author": {
        "name": `${senderName} [${senderId}]`,
        "url": senderProfileLink.trim()
      },
      "title": title.trim(),
      "url": mailLink.trim(),
      "description": content.replace(/&nbsp;+/g, "\n").replace(/ {2,}/g, "\n").trim(), //This feels dumb
      "color": 11342935, // Pink :)
      "footer": {
        "text": "Some Footer Text | Made By Bilbosaggings[2323763]"
      },
      "timestamp": new Date(timestamp * 1000).toISOString()
    }

    return embed
  }

  waitForMailContainer()
})()