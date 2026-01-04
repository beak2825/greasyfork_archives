// ==UserScript==
// @name        Skip megadb waits
// @namespace   6gh Userscripts
// @match       https://*.megadb.net/download
// @grant       GM.setValue
// @grant       GM.getValue
// @version     1.0
// @author      6gh
// @description A simple script to skip the 5 second waits on MegaDB Uploads
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/447504/Skip%20megadb%20waits.user.js
// @updateURL https://update.greasyfork.org/scripts/447504/Skip%20megadb%20waits.meta.js
// ==/UserScript==

//jshint esversion: 8
(async function() {
  'use strict';
  
  const auto_download = await GM.getValue("6_auto_download", false)

  window.addEventListener('load', async function() {
    console.log("window loaded no way fr? ong? deadass?")

    const window_domain = location.hostname
    
    switch(window_domain) {
      case "megadb.net":
      case "www.megadb.net":
        const mdb_download__BTN = document.querySelector("#downloadbtn")
        mdb_download__BTN.removeAttribute("disabled")
        
        const mdb_waitText = document.querySelector("#countdown")
        mdb_waitText.parentNode.removeChild(mdb_waitText)
        
        const literally_a_new_line_element = document.createElement('br');
        
        const mdb_tickbox = document.createElement("input")
        mdb_tickbox.setAttribute("type", "checkbox")
        mdb_tickbox.setAttribute("id", "6_checkbox")
        mdb_tickbox.setAttribute("name", "6_checkbox")
        mdb_tickbox.checked = auto_download
        
        const mdb_tickbox_lbl = document.createElement("label")
        mdb_tickbox_lbl.setAttribute("for", "6_checkbox")
        mdb_tickbox_lbl.innerText = "Auto Download? (Skip megadb wait userscript)"
        
        const mdb_container = document.querySelector("#commonId")
        mdb_container.firstElementChild.appendChild(literally_a_new_line_element)
        mdb_container.firstElementChild.appendChild(mdb_tickbox)
        mdb_container.firstElementChild.appendChild(mdb_tickbox_lbl)
        
        mdb_tickbox.addEventListener("change", (e) => {
          console.log("changing setting of auto_download to " + e.target.checked)
          GM.setValue("6_auto_download", e.target.checked)
            .catch((err) => {
            console.error("failed to change setting\n" + err)
          })
        })
        
        if (auto_download === true) {
          const mdb_form = document.querySelector('[name="F1"]')
          mdb_form.submit()
        }
        break;
      default:
        break;
    }
  }, false);
})();
