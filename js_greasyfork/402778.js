// ==UserScript==
// @name        Redacted - roamresearch.com
// @namespace   https://ryanguill.com
// @match       https://roamresearch.com/#/app
// @grant       none
// @version     0.1
// @author      Ryan Guill
// @description adding a tag of #redacted to a block will cause it to not be able to be read unless clicked on
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/402778/Redacted%20-%20roamresearchcom.user.js
// @updateURL https://update.greasyfork.org/scripts/402778/Redacted%20-%20roamresearchcom.meta.js
// ==/UserScript==

const debug_enabled = true;

const redacted_blocks_enabled = true;

function setup_styles () {
  const style = document.createElement('style');
  document.head.appendChild(style);
  style.id = 'roam-custom-js-styles';

  
  style.sheet.insertRule(`
    div.roam-block-container[data-redacted] {
      background-color: #000;
      color: #000;
    }
  `);
  style.sheet.insertRule(`
    div.roam-block-container[data-redacted] textarea {
      background-color: #FFF;
    }
  `);
}



function redacted_blocks () {
  const blocks = document.querySelectorAll("div[data-redacted]");

  for (const block of blocks) {
    block.removeAttribute("data-redacted");
  }

  const tags = [...document.querySelectorAll("span[data-tag]")]
    .filter((element) => element.dataset.tag !== undefined && element.dataset.tag.toLowerCase() === "redacted");

  for (const tag of tags) {
      //on the tag itself set a color
      tag.dataset.redacted = true;
      tag.style.display = "none";

      const div = tag.closest("div.roam-block-container");
      
      div.dataset.redacted = true;
    }
    
  return true;
}

function call_with_timer (f, label, debug_enabled) {
  if (debug_enabled) {
    console.time(label);
  }
  f();
  if (debug_enabled) {
    console.timeEnd(label);
  }
}

function run_scripts () {
  setTimeout(function () {
    call_with_timer(function () {
      if (redacted_blocks_enabled) {
        call_with_timer(redacted_blocks, 'redacted_blocks', debug_enabled);
      }
    }, "Total: run_scripts", debug_enabled);
  }, 100)
}



// Wait for Roam to load before initializing
const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        const newNodes = mutation.addedNodes // DOM NodeList
        if (newNodes !== null) { // If there are new nodes added
          for (let node of newNodes) {
            
              if (node.classList.contains('roam-body')) { // body has loaded
                  console.log('Observer finished.')
                  observer.disconnect()
                  init()
              }
          }
        }
    })
})

const config = {
    attributes: true,
    childList: true,
    characterData: true
}

const target = document.getElementById('app');
if (target) {
  observer.observe(target, config)
  console.log('Observer running...')
}

function init () {
  
    setup_styles();
  
    //for the first 60 seconds, run the scripts every 3 seconds to load initially
    for (let time = 0; time <= 60000; time += 3000) {
      setTimeout(function () {
        if (debug_enabled) {
          console.log("timeout", time);
        }
        run_scripts();
      }, time);
    }

    //after that, run the scripts every 15 seconds indefinately
    setInterval(function (){
        if (debug_enabled) {
          console.log("interval");
        } 
      run_scripts();
    }, 15000)
    
    /*
    document.addEventListener("blur", function () {
      //console.log("blur");
      runScripts()
    }, true);
    */
    /*
    document.addEventListener("change", function () {
      //console.log("change");
      runScripts()
    }, true);
    */
    document.addEventListener("focus", function () {
      if (debug_enabled) {
          console.log("focus");
      }
      run_scripts()
    }, true);
    
    //disable cmd-s
    document.addEventListener("keydown", function(e) {
      if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        e.preventDefault()
      }
    }, false)
  

}
