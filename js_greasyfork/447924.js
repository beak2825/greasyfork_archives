// ==UserScript==
// @name        Fandom tablesorter
// @namespace   Violentmonkey Scripts
// @include     https://*.fandom.com/*
// @grant       none
// @version     1.3
// @author      KraXen72
// @description 7/14/2022, 1:33:28 PM
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @license     GPLv3
// @locale      en-US
// @downloadURL https://update.greasyfork.org/scripts/447924/Fandom%20tablesorter.user.js
// @updateURL https://update.greasyfork.org/scripts/447924/Fandom%20tablesorter.meta.js
// ==/UserScript==

//document.head.appendChild(Object.assign(document.createElement("script"), { src: "https://code.jquery.com/jquery-3.6.0.min.js" }))

let groupingMode = "all"

const tables = [...document.querySelectorAll("table.article-table")]

tables.forEach(t => t.classList = "wikitable sortable") // turn all tables into wikitable sortable

const hideCSS = `
  .hidetable::before {
      display: block;
      background: inherit;
      width: 100%;
      height: 100%;
      z-index: 4;
      position: absolute;
      top: 0;
      left: 0;
      content: "";
      border: 1px solid;
      border-color: inherit;
  }

  .hidetable {
      position: relative
  }
  .nogroup {
      background-color: #a3a5aa !important;
  }
  
  .tablesorter-utils-button {
    padding: .5rem;
    border: 2px solid darkblue;
    border-radius: 5px;
    margin: 0 .25rem;
    position: relative;
  }
  
  .utilsbtn-active {
    background: lightblue
  }
`

function makeBtn(text, onclick, cls = []) {
  const btn = document.createElement("button")
  btn.classList.add("tablesorter-utils-button")
  cls.forEach(c => btn.classList.add(c))
  btn.onclick = onclick
  btn.textContent = text
  return btn
}

document.head.appendChild(Object.assign(document.createElement("style"), { innerHTML: hideCSS, id: "hidecss" }))
//document.head.appendChild(Object.assign(document.createElement("script"), { src: "https://phab.wmfusercontent.org/file/data/jvqc3e24jbtsuzetcac3/PHID-FILE-zf3nkj6s2iaf6qmttzj2/jquery.tablesorter.js" })) // add mediaWiki version of tablesorter
//document.head.appendChild(Object.assign(document.createElement("script"), { src: "https://kraxen72.github.io/cdn/patched%20mediawiki%20tablesorter.js" }))

function mergeClonedRows(table, nthType) {
    const tbody = table.querySelector("tbody")
    const rows = [...tbody.querySelectorAll("tr")]
    const groups = []

    for (let i = 0; i < rows.length; i++) {
        const thisTd = rows[i].querySelector(`td:nth-of-type(${nthType})`)
        thisTd.style.display = "table-cell"
        thisTd.setAttribute("rowspan", 1)

        if (i !== 0) {
            const lastTd = rows[i - 1].querySelector(`td:nth-of-type(${nthType})`)
            if (lastTd.innerHTML === thisTd.innerHTML && thisTd.innerHTML !== " ") {
                groups[groups.length - 1].push(thisTd) // add into last existing group
            } else {
                groups.push([thisTd]) // make a new group
            }
        } else {
            groups.push([thisTd]) // make anew group since it's the first element
        }
    }

    // the first one in the group gets to stay with wide rowspan, others get hidden
    groups.forEach(group => {
        group[0].setAttribute("rowspan", group.length)
        const remainder = group.slice(1)
        remainder.forEach(r => r.style.display = "none")
    })
}

function resetGroups(table, nthType) {
    const tbody = table.querySelector("tbody")
    const rows = [...tbody.querySelectorAll("tr")]

    for (let i = 0; i < rows.length; i++) {
        const thisTd = rows[i].querySelector(`td:nth-of-type(${nthType})`)
        thisTd.style.display = "table-cell"
        thisTd.setAttribute("rowspan", 1)
    }
}

function applyActiveSorting() {
  if (groupingMode === "all") {
    document.querySelectorAll(".tablesorter-utils-button.sort-all").forEach(b => b.classList.add("utilsbtn-active"))
    document.querySelectorAll(".tablesorter-utils-button.sort-first").forEach(b => b.classList.remove("utilsbtn-active"))
  } else if (groupingMode === "first") {
    document.querySelectorAll(".tablesorter-utils-button.sort-all").forEach(b => b.classList.remove("utilsbtn-active"))
    document.querySelectorAll(".tablesorter-utils-button.sort-first").forEach(b => b.classList.add("utilsbtn-active"))
  }
}

tables.forEach(t => {
    const headers = t.querySelectorAll("th")
    console.log(headers)
    $(headers).on('keypress click', function (e) {
        t.classList.add("hidetable")
        setTimeout(() => {
            if (groupingMode === "all") {
              try { for(let i = 1; i<[...headers].length + 1; i++) mergeClonedRows(t, i) } catch(e) { console.error("fandom-tablesorter-err:", e) } // try to merge all columns
            } else if (groupingMode === "first") {
              mergeClonedRows(t, 1)
            }
            
          t.classList.remove("hidetable")
        }, 0);            
    })
    const resetButton = makeBtn("reset groups", () => { for(let i = 1; i<[...headers].length + 1; i++) resetGroups(t, i) }, ["reset-groups"])
    t.parentElement.insertBefore(resetButton, t)
    t.parentElement.insertBefore(makeBtn("group all (default)", () => { groupingMode = "all"; applyActiveSorting() }, ["sort-all", "utilsbtn-active"]), t)
    t.parentElement.insertBefore(makeBtn("only group first", () => { groupingMode = "first"; applyActiveSorting() }, ["sort-first"]), t)
    //disable grouping for stuff
    $(headers).on('contextmenu', function (e) {
      if (e.target.tagName.toLowerCase() === "th") {
        e.preventDefault()
        console.log(e)
        e.target.classList.toggle("nogroup")
      }
    })
    // show reset buttons
    $(headers).one('keypress click', function (e) {
      resetButton.style.display = "inline-block"
    })
    resetButton.style.display = "none"
  
   // t.addEventListener("sortEnd.tablesorter", () => {
   //   console.log("event fired")
   // })
  // console.log($(t))
  // $(t).on("sortEnd", function() {
  //   console.log("event fired")
  //   alert(1)
  // })
  // $(t).on("click", function() {
  //   console.log("clicked table:", t)
  // })
  // $(t).delegate("th", "tableSort", function(e) {console.log(e)})
});