// ==UserScript==
// @name         Character Selector for readmspa
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Select a character to see their dialog
// @author       FlaringK
// @match        http://readmspa.org/search/search=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=readmspa.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471697/Character%20Selector%20for%20readmspa.user.js
// @updateURL https://update.greasyfork.org/scripts/471697/Character%20Selector%20for%20readmspa.meta.js
// ==/UserScript==

(function() {
  
  const handleRegex = /^[^\s]+:/
  const quickStrRegex = /rgb\((\d+), (\d+), (\d+)\)(.*):/
  
  const pageStyle = document.createElement("style")
  document.body.prepend(pageStyle)
  
  // MAIN
  const loadMain = async () => {
    let charList = []
  
    // Loop through evrey page
    document.querySelectorAll(".page").forEach(page => {
      if (page.querySelector(".log")) {
        const title = page.querySelector("h1")
        const date = page.querySelector("h2")
  
        // add page number
        title.innerHTML = `PAGE: ${page.id.replace(/^\d\//, "")}<br> ${title.innerHTML}`
  
        // get char list
        let foundChars = getChars(page)
  
        // add foundChars to class
        page.className += " " + foundChars.map(s => cssString(s)).join(" ")
  
        // Add chars to charlist
        foundChars.forEach(char => {
          if (!charList.includes(char)) charList.push(char)
        })
  
        // Add character
        date.innerHTML += "<br>CHARACTERS: " + foundChars.map(s => formatQuickString(s)).join(" ")
  
      }
    })
  
    // Make options menu
    charList.sort()
    console.log(charList)
    generateOptionsList(charList)
    addStyle()
  
    // Addfunction
    document.querySelectorAll(".charCheckbox").forEach(checkbox => {
      checkbox.onchange = displaySelectedChars
    })
  }
  
  const getChars = page => {
    let foundChars = []
    page.querySelectorAll("span").forEach(span => {
  
      // Generate quick string
      let handle = handleRegex.test(span.innerText) ? span.innerText.match(handleRegex)[0] : ""
      let charTest = span.style.color.replace(/a|, 0.\d+/g, "") + handle
  
      if (!foundChars.includes(charTest) && handle) {
        foundChars.push(charTest)
      }
    })
  
    return foundChars
  }
  
  const generateOptionsList = charList => {
    const wrap = document.querySelector(".search")
    const optionWrap = document.createElement("div")
    optionWrap.className = "optWrap"
    wrap.prepend(optionWrap)
  
    let htmlString = "<div class='optSep'>"
    let prevCol = ""
    charList.forEach(charString => {
      let varCol = colFromQuickString(charString)
      let cssClass = cssString(charString.replace("#", ""))
  
      if (prevCol !== varCol && !varCol.includes(":")) htmlString += "</div><div class='optSep'>"
  
      htmlString += `<div class="opt" style="--col: ${varCol}">
        <input class="charCheckbox" type="checkbox" name="chars" id="${cssClass}"><label for="${cssClass}">${handleFromQuickString(charString)}</label><br>
      </div>`
  
      prevCol = varCol
    })
  
    htmlString += "</div>"
  
    console.log(htmlString)
  
    optionWrap.innerHTML += htmlString
  
    //title
    const h1 = document.createElement("h1")
    h1.innerText = "Select a character to see their Dialog"
    wrap.prepend(h1)
  }
  
  const displaySelectedChars = () => {
    let newStyle = ""
    document.querySelectorAll(".charCheckbox").forEach(checkbox => {
      if (checkbox.checked) newStyle += `.page.${checkbox.id} { display: block } `
    })
    console.log(newStyle)
  
    document.body.querySelector("style").innerText = newStyle
  }
  
  const formatQuickString = str => str.replace(quickStrRegex, (m, p1, p2, p3, p4) => `<span style="color: ${rgbToHex(p1, p2, p3)}">${p4}</span>`)
  const colFromQuickString = str => str.replace(quickStrRegex, (m, p1, p2, p3, p4) => rgbToHex(p1, p2, p3))
  const handleFromQuickString = str => str.replace(quickStrRegex, "$4")
  const cssString = str => str.replace(/[^a-zA-Z0-9?]/g, "").replace(/\?/g, "_")
  
  //https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
  function rgbToHex(r, g, b) {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
  }
  
  function wait(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
  }
  
  
  // https://stackoverflow.com/questions/11867545/change-text-color-based-on-brightness-of-the-covered-background-area
  const getContrastYIQ = hexcolor => {
    var r = parseInt(hexcolor.substring(0,2),16);
    var g = parseInt(hexcolor.substring(2,4),16);
    var b = parseInt(hexcolor.substring(4,6),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? '000000' : 'eeeeee';
  }
  
  // STYLE
  const addStyle = () => {
    document.body.innerHTML += `<style>
    .page {
      background-color: #0001
    }
  
    .optWrap {
      column-width: 190px;
      column-gap: 0px;
      font-family: 'Courier New', Courier, monospace;
      font-weight: 600;
      color: white;
      text-align: left;
      background: #556;
    }
  
    .opt {
      --col: black;
      background-color: var(--col);
      padding: 0.5em 0.5em;
    }
  
    .search > section {
      display: none;
    }
  
    .buttonDiv {
      display: none;
    }
  
    </style>`
  }
  
  document.body.innerHTML += `<style>
  .buttonDiv {
    font-size: xx-large;
    background: coral;
    font-family: 'Courier New', Courier, monospace;
    font-weight: 600;
    padding: 1em;
    margin-bottom: 1em;
    border-radius: 1em;
  }
  
  .buttonDiv:hover {
    background: limegreen;
  }
  </style>`
  
  // Add button
  const buttonDiv = document.createElement("div")
  buttonDiv.innerHTML = "ONCE THE PAGE IS LOADED, CLICK HERE TO LOAD THE CHARACTER SELECTOR <br> (This will take a second)"
  buttonDiv.className = "buttonDiv"
  buttonDiv.onclick = () => {
    loadMain()
  }
  
  document.querySelector(".search").prepend(buttonDiv)
})();