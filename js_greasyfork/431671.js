// ==UserScript==
// @name         Neopets: Food club
// @author       Tombaugh Regio
// @version      1.0
// @description  Creates a button to FCNC bet page with max personal amount copied to clipboard
// @namespace    https://greasyfork.org/users/780470
// @match        http://www.neopets.com/~boochi_target
// @match        https://foodclub.neocities.org/*
// @grant        GM.setClipboard
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/431671/Neopets%3A%20Food%20club.user.js
// @updateURL https://update.greasyfork.org/scripts/431671/Neopets%3A%20Food%20club.meta.js
// ==/UserScript==

const URL = document.URL

if (URL.includes("~boochi_target")) {
  //Get max bet
  new Promise((resolve, reject) => {
    GM.xmlHttpRequest({
      method: "GET",
      url: "http://www.neopets.com/pirates/foodclub.phtml?type=bet",
      onload: function(response) {
        const htmlElement = document.createElement("html")
        htmlElement.innerHTML = response.responseText

        const foodClubBet = parseInt(htmlElement.querySelectorAll(".content p b")[1].textContent.split(",").join(""))
        htmlElement.remove()

        resolve(GM.setClipboard(foodClubBet))
      },
      onerror: function(error) {
        reject(error)
      }
    })
  })

  //Create a button
  const link = document.querySelector("textarea").value

  const foodClubLink = document.createElement("a")
  foodClubLink.href = `https://foodclub.neocities.org${link}`

  const foodClubButton = document.createElement("button")
  foodClubButton.id = foodClubButton
  foodClubButton.textContent = "Go to FCNC"
  foodClubButton.style.margin = "0 0.5em"
  foodClubLink.appendChild(foodClubButton)

  const title = document.querySelector("font")
  title.after(foodClubLink) 
}

if (URL.includes("foodclub.neocities.org")) {
  for (const label of document.querySelectorAll("label")) {
    if (label.textContent.includes("Max Personal Bet")) {
      const betField = label.querySelector("input")
      betField.focus()
      betField.select()
    }
  }
}
