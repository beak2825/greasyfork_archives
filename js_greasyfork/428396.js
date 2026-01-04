// ==UserScript==
// @name         Neopets: Neocola machine selector
// @author       Tombaugh Regio
// @version      1.1
// @description  Selects the Neotoken machine values that you want
// @namespace    https://greasyfork.org/users/780470
// @include      *://www.neopets.com/moon/neocola2.phtml
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428396/Neopets%3A%20Neocola%20machine%20selector.user.js
// @updateURL https://update.greasyfork.org/scripts/428396/Neopets%3A%20Neocola%20machine%20selector.meta.js
// ==/UserScript==

//==============================

const VALUE = {

    //Which Token do you use?
    token: "rEd",

    //Which NeoCola flavor would you like?
    flavor: "dehydrated H20",

    //How many times do you press the red button?
    press: 3
}

//==============================

function getToken(){ 
  const YOUR_TOKEN = [...document.querySelector(".content").querySelectorAll("img")]
  .slice(1)
  .reduce((a, b) => [...a, b.src.toUpperCase().match(/(?<=TOKEN_)(\w+)/)[0].trim()], [])
  .reduce((a, b, i, arr) => {
    const matchingToken = arr.filter(token => token === VALUE.token.toUpperCase().trim())
    if (matchingToken.length === 0) matchingToken.push(arr[0])
    return matchingToken
  })[0]
  
  const tokenValue = [
    {name: "BLUE", number: 24538},
    {name: "GREEN", number: 24539},
    {name: "RED", number: 24540}
  ].filter(a => a.name === YOUR_TOKEN)[0].number
  
  return {name: "token_id", value: tokenValue}
}

function getFlavor(){
  function getFlavorName() {
    const selected = VALUE.flavor.toUpperCase()
    
    switch(true) {
      //Dr. Slother
      case /SL/.test(selected) : return 0

      //Diet Doom
      case /ET/.test(selected) : return 1

      //Na'cho Cola
      case /CH/.test(selected) : return 2

      //Smite
      case /SM/.test(selected) : return 3

      //Alt-Tab
      case /LT/.test(selected) : return 4

      //Minion Maid
      case /MA/.test(selected) : return 5

      //Mountain Poo
      case /NT/.test(selected) : return 6

      //Dehydrated H20
      case /H2/.test(selected) : return 7
        
      default : return 0
    }
  }
  
  return {name: "neocola_flavor", value: getFlavorName()}
}

function getPress() {
  const selected = parseInt(VALUE.press)
  const times = [...document.querySelectorAll('select[name="red_button"] option')]
              .filter(a => a.value.length > 0)
              .reduce((a, b, i) => isNaN(selected) ? [0] : i > 0 && parseInt(b.value) >= selected ? [...a, b.value] : a, [])[0]

  return {name: "red_button", value: times}
}

function selectOption({ name, value }) {
  document.querySelector(`.content form select[name="${name}"]`).value = value
}

if (!/You don't have any NeoCola Tokens/.test(document.querySelector(".content").textContent)) {
  const [ TOKEN, FLAVOR, PRESS ] = [ getToken(), getFlavor(), getPress() ]

  selectOption(TOKEN)
  selectOption(FLAVOR)
  selectOption(PRESS)
}