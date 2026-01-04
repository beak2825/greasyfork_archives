// ==UserScript==
// @name         Jira Backlog Enhancements
// @namespace    miffin
// @version      2025-5-19
// @description  Collapse/Expand all buttons, filter by sprint name
// @author       Craig Whiffin
// @match        https://*.atlassian.net/jira/*/backlog*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.net
// @license      MIT
// @grant        window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/494404/Jira%20Backlog%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/494404/Jira%20Backlog%20Enhancements.meta.js
// ==/UserScript==

// ###################################################################
// JBE stuff here
// ###################################################################
var JBE = (window.JBE = {});

let JBE_define = () => {
  JBE.top_bar_selector = 'div._16jx1txw._1hftv77o._1uf81b66._1o94h2mm._yj55idpf > ul';

  // stolen from: https://stackoverflow.com/a/61511955
  function waitForElm(selector) {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver((mutations) => {
        if (document.querySelector(selector)) {
          observer.disconnect();
          resolve(document.querySelector(selector));
        }
      });

      // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }

  JBE.get_top_bar = async () => {
    console.log("JBE: waiting for top bar to load...");
    const top_bar = await waitForElm(JBE.top_bar_selector);
    console.log("JBE: top_bar loaded!");
    return top_bar;
  };

  let top_bar_button_style = "css-48ccbj"; // ??

  let spawn_top_bar_container = () => {
    let outer = document.createElement("div");
    outer.className = "sc-1krxkwp-0 jcJsAc"; // ??!

    let inner = document.createElement("div");
    inner.className = "_19bv1b66 _u5f31b66"; // ???!1
    outer.appendChild(inner);

    return inner;
  };

  JBE.get_sprints = () => {
    // They keep changing the tags for these.
    return document.querySelectorAll(
      "._1mouidpf, .ahoa2g-3, .ahoa2g-2, .css-1w12hrg, .css-14lcwon"
    ); // ???1!1?
  };

  // ===================================================================
  JBE.collapse_all = () => {
    document
      .querySelectorAll(
        'div[aria-controls^="backlog-accordion"][aria-expanded=true]'
      )
      .forEach((elem) => elem.click());
  };

  JBE.expand_all = () => {
    document
      .querySelectorAll(
        'div[data-testid^="software-backlog.card-list.left-side"][aria-expanded=false]'
      )
      .forEach((elem) => {
        // only do this for visible elements, otherwise it takes forever
        if (elem.offsetParent !== null) {
          elem.click();
        }
      });
  };

  JBE.show_only = (input_element) => {
    console.info("Showing only sprints matching:", input_element.value);

    JBE.get_sprints().forEach((elem) => {
      let sprint_name = elem.innerHTML.toLowerCase();
      let query = input_element.value.toLowerCase();
      let is_match = sprint_name.includes(query);
      let parent_block = elem.closest(
        'div[data-testid^="software-backlog.card-list.container"]'
      );
      console.assert(parent_block !== null, "Couldn't get the parent card for " + sprint_name)
      parent_block.style.display = is_match ? "block" : "none";
    });
  };
  // ===================================================================

  // Should be run once the page has loaded, or else it won't be able to find the top_bar
  JBE.add_UI = async () => {
    let top_bar = await JBE.get_top_bar();

    console.assert(top_bar !== null, "JBE: couldn't find top_bar!");

    {
      let container = spawn_top_bar_container();
      container.style.flexDirection = "column";
      container.className = "JBE_container";

      {
        let btn = document.createElement("button");
        btn.setAttribute("id", "collapse_all_sprints");
        btn.setAttribute("title", "Collapse All Sprints");
        btn.addEventListener("click", () => JBE.collapse_all(), false);
        btn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path
          d="m 13.264222,0.88771738 c -0.699238,-0.69923767 -1.834799,-0.69923767 -2.534037,0 L 1.7799447,9.8379574 c -0.6992377,0.6992386 -0.6992377,1.8347996 0,2.5340376 0.6992377,0.699238 1.834799,0.699238 2.5340367,0 L 12,4.6859761 19.686019,12.366401 c 0.699238,0.699238 1.834799,0.699238 2.534037,0 0.699237,-0.699238 0.699237,-1.834799 0,-2.5340374 l -8.950241,-8.95024 z m 8.95024,19.69052862 -8.95024,-8.950241 c -0.699238,-0.699237 -1.834799,-0.699237 -2.534037,0 l -8.9502403,8.950241 c -0.6992377,0.699237 -0.6992377,1.834799 0,2.534037 0.6992377,0.699237 1.834799,0.699237 2.5340367,0 L 12,15.426264 l 7.686019,7.680425 c 0.699238,0.699237 1.834799,0.699237 2.534037,0 0.699237,-0.699238 0.699237,-1.834799 0,-2.534037 z"
          fill="currentColor"
          fill-rule="evenodd"
        />
      </svg>
    `;
        btn.className = top_bar_button_style;
        container.appendChild(btn);
      }

      {
        let btn = document.createElement("button");
        btn.setAttribute("id", "expand_all_sprints");
        btn.setAttribute("title", "Expand All Sprints");
        btn.addEventListener("click", () => JBE.expand_all(), false);
        btn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path
          d="m 13.264222,23.112282 c -0.699238,0.699238 -1.834799,0.699238 -2.534037,0 l -8.9502403,-8.95024 c -0.6992377,-0.699238 -0.6992377,-1.834799 0,-2.534037 0.6992377,-0.699238 1.834799,-0.699238 2.5340367,0 L 12,19.314024 19.686019,11.633599 c 0.699238,-0.699238 1.834799,-0.699238 2.534037,0 0.699237,0.699238 0.699237,1.834799 0,2.534037 l -8.950241,8.95024 z m 8.95024,-19.6905281 -8.95024,8.9502411 c -0.699238,0.699237 -1.834799,0.699237 -2.534037,0 L 1.7799447,3.4217539 c -0.6992377,-0.699237 -0.6992377,-1.834799 0,-2.53403702 0.6992377,-0.699237 1.834799,-0.699237 2.5340367,0 L 12,8.5737359 19.686019,0.89331088 c 0.699238,-0.699237 1.834799,-0.699237 2.534037,0 0.699237,0.69923802 0.699237,1.83479902 0,2.53403702 z"
          fill="currentColor"
          fill-rule="evenodd"
        />
      </svg>
    `;
        btn.className = top_bar_button_style;
        container.appendChild(btn);
      }

      top_bar.appendChild(container);
    }

    // filter by sprint name
    {
      let filter_input = document.createElement("input");
      filter_input.id = "filter_by_sprint";
      filter_input.class = "css-1cab8vv";
      filter_input.placeholder = "Sprint Name";
      filter_input.addEventListener(
        "input",
        () => JBE.show_only(filter_input),
        false
      );

      let filter_icon = document.createElement("div");
      filter_icon.className = "css-tww5fb";
      filter_icon.innerHTML = `
        <span
        aria-hidden="true"
        class="css-1wits42"
        style="
        --icon-primary-color: currentColor;
        --icon-secondary-color: var(--ds-surface, #ffffff);
        "
        ><svg width="24" height="24" viewBox="0 0 24 24" role="presentation">
          <path
            d="M16.436 15.085l3.94 4.01a1 1 0 01-1.425 1.402l-3.938-4.006a7.5 7.5 0 111.423-1.406zM10.5 16a5.5 5.5 0 100-11 5.5 5.5 0 000 11z"
            fill="currentColor"
            fill-rule="evenodd"
          ></path></svg
      ></span>
      `;

      let filter_container = document.createElement("div");
      filter_container.className = "css-19p3uok";
      filter_container.style.minWidth = "64px";
      filter_container.appendChild(filter_input);
      filter_container.appendChild(filter_icon);
      top_bar.appendChild(filter_container);
    }
  };

  JBE.UI_already_added = () => {
    var found_it = document.querySelector(".JBE_container");
    return found_it !== null;
  };

  window.JBE = JBE;
  return JBE;
};

JBE = JBE_define();

// ###################################################################
// Event hookups here:
// ###################################################################

// Add UI on page load
let on_load_handler = async () => { await JBE.add_UI(); };
window.addEventListener("load", on_load_handler, false);

// ..._and_ if the URL changes to '*/backlog' and we don't have the UI
if (window.onurlchange === null) {
  // feature is supported
  // yes, !== null _would_ make more sense, but who cares
  let url_change_handler = async (info) => {
    let is_valid_url = info.url.endsWith("/backlog");
    let JBE = JBE_define();
    if (!JBE.UI_already_added() && is_valid_url) {
      console.log("JBE: URL ends with '/backlog', re-injecting JBE...");
      JBE_define();
      await JBE.add_UI();
    }
  };

  window.addEventListener("urlchange", (info) => url_change_handler(info));
}
