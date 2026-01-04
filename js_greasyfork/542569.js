// ==UserScript==
// @name         AO3 Adjust Paragraph Margins
// @description  Increase or decrease the margins between the paragraphs in a work. Set on a per work or per author basis.
// @author       Ifky_
// @namespace    https://greasyfork.org/en/scripts/542569
// @version      1.0.2
// @history      1.0.2 — Minor style updates to account for AO3's style changes
// @history      1.0.1 — Reset current setting when resetting everything
// @history      1.0.0 — Increase or decrease the margin between a work's paragraphs
// @match        https://archiveofourown.org/works/*
// @icon         https://archiveofourown.org/images/logo.png
// @license      GPL-3.0-only
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542569/AO3%20Adjust%20Paragraph%20Margins.user.js
// @updateURL https://update.greasyfork.org/scripts/542569/AO3%20Adjust%20Paragraph%20Margins.meta.js
// ==/UserScript==
"use strict";
(function () {
    // Add styles to increase or decrease margin
    // If you want to use different values, you can either edit this code or override it with a site skin
    const styleTag = document.createElement("style");
    styleTag.textContent = `
    #a-p-m--secondary {
      left: 0;
      width: max-content;
      max-width: 80vw;
    }

    #workskin.a-p-m--i [role=article] .userstuff p,
    #workskin.a-p-m--i [role=article].userstuff p {
      margin-block: 3.5em;
    }

    #workskin.a-p-m--d [role=article] .userstuff p,
    #workskin.a-p-m--d [role=article].userstuff p {
      margin-block: .15em;
    }

    #a-p-m fieldset {
      display: block;
    }

    #a-p-m fieldset ul {
      display: flex;
      gap: 1em;
      flex-wrap: wrap;
    }

    #a-p-m fieldset label {
      padding-inline: .75em !important;
    }

    #a-p-m .actions {
      display: flex
    }
  `;
    document.head.appendChild(styleTag);
    // Get necessary elements and data
    const workskin = document.querySelector("#workskin");
    const actions = document.querySelector("#main .work.actions");
    const workId = window.location.pathname.split("/")[2];
    const authorEl = document.querySelector("#workskin a[rel='author'][href*='/users/']");
    const author = authorEl?.textContent ?? null;
    // Get existing settings from local storage
    const getLocal = (key) => {
        const value = localStorage.getItem(key);
        return new Set(value ? value.split(',') : []);
    };
    const addLocal = (key, value) => {
        const local = getLocal(key);
        local.add(value);
        const string = Array.from(local).join(',');
        localStorage.setItem(key, string);
    };
    const removeLocal = (key, value) => {
        const local = getLocal(key);
        local.delete(value);
        const string = Array.from(local).join(',');
        localStorage.setItem(key, string);
    };
    // Get current settings (if they exist)
    const workIncrease = getLocal("a-p-m--w-i");
    const workDecrease = getLocal("a-p-m--w-d");
    const workStandard = getLocal("a-p-m--w-s");
    const authorIncrease = getLocal("a-p-m--a-i");
    const authorDecrease = getLocal("a-p-m--a-d");
    let marginType;
    (function (marginType) {
        marginType[marginType["STANDARD"] = 0] = "STANDARD";
        marginType[marginType["INCREASE"] = 1] = "INCREASE";
        marginType[marginType["DECREASE"] = 2] = "DECREASE";
        marginType[marginType["AUTHOR"] = 3] = "AUTHOR";
    })(marginType || (marginType = {}));
    const setMarginClass = (value) => {
        switch (value) {
            case marginType.STANDARD:
                workskin.classList.remove("a-p-m--i");
                workskin.classList.remove("a-p-m--d");
                break;
            case marginType.INCREASE:
                workskin.classList.add("a-p-m--i");
                workskin.classList.remove("a-p-m--d");
                break;
            case marginType.DECREASE:
                workskin.classList.remove("a-p-m--i");
                workskin.classList.add("a-p-m--d");
                break;
        }
    };
    const setMarginLocal = (key, value) => {
        if (key === "work") {
            switch (value) {
                case marginType.STANDARD:
                    removeLocal("a-p-m--w-i", workId);
                    removeLocal("a-p-m--w-d", workId);
                    addLocal("a-p-m--w-s", workId);
                    break;
                case marginType.INCREASE:
                    addLocal("a-p-m--w-i", workId);
                    removeLocal("a-p-m--w-d", workId);
                    removeLocal("a-p-m--w-s", workId);
                    break;
                case marginType.DECREASE:
                    removeLocal("a-p-m--w-i", workId);
                    addLocal("a-p-m--w-d", workId);
                    removeLocal("a-p-m--w-s", workId);
                    break;
                case marginType.AUTHOR:
                    removeLocal("a-p-m--w-i", workId);
                    removeLocal("a-p-m--w-d", workId);
                    removeLocal("a-p-m--w-s", workId);
                    break;
            }
        }
        else if (key === "author" && author !== null) {
            switch (value) {
                case marginType.STANDARD:
                    removeLocal("a-p-m--a-i", author);
                    removeLocal("a-p-m--a-d", author);
                    break;
                case marginType.INCREASE:
                    addLocal("a-p-m--a-i", author);
                    removeLocal("a-p-m--a-d", author);
                    break;
                case marginType.DECREASE:
                    removeLocal("a-p-m--a-i", author);
                    addLocal("a-p-m--a-d", author);
                    break;
            }
        }
    };
    // Set margin based on setting
    const wi = workIncrease.has(workId);
    const wd = workDecrease.has(workId);
    const ws = workStandard.has(workId);
    const wa = !(wi || wd || ws);
    const ai = authorIncrease.has(author);
    const ad = authorDecrease.has(author);
    const aSt = !(ai || ad);
    let workSetting = 0;
    let authorSetting = 0;
    if (wi) {
        workSetting = marginType.INCREASE;
    }
    else if (wd) {
        workSetting = marginType.DECREASE;
    }
    else if (wa) {
        workSetting = marginType.AUTHOR;
    }
    if (ai) {
        authorSetting = marginType.INCREASE;
    }
    else if (ad) {
        authorSetting = marginType.DECREASE;
    }
    if (workSetting !== marginType.AUTHOR) {
        setMarginClass(workSetting);
    }
    else {
        setMarginClass(authorSetting);
    }
    if (actions) {
        // The HTML for the action button and expandable secondary
        const marginHtml = `
    <li id="a-p-m" aria-haspopup="true">
      <a id="a-p-m--toggle" href="#" class="collapsed">Margins</a>
      <ul id="a-p-m--secondary" class="expandable secondary hidden">
        <form id="a-p-m--form" class="verbose">
          <!-- Work settings -->
          <fieldset>
            <legend>Work settings</legend>
              <ul>
                <li>
                  <input type="radio" value="0" ${ws ? 'checked="checked"' : ''} name="a-p-m--w" id="a-p-m--w-s">
                  <label for="a-p-m--w-s">Standard</label>
                </li>
                <li>
                  <input type="radio" value="1" ${wi ? 'checked="checked"' : ''} name="a-p-m--w" id="a-p-m--w-i">
                  <label for="a-p-m--w-i">Increase</label>
                </li>
                <li>
                  <input type="radio" value="2" ${wd ? 'checked="checked"' : ''} name="a-p-m--w" id="a-p-m--w-d">
                  <label for="a-p-m--w-d">Decrease</label>
                </li>
                <li>
                  <input type="radio" value="3" ${wa ? 'checked="checked"' : ''} name="a-p-m--w" id="a-p-m--w-a">
                  <label for="a-p-m--w-a">Author</label>
                </li>
              </ul>
            </fieldset>

            <!-- Author settings -->
            ${author ?
            `<fieldset>
                <legend>Author settings</legend>
                <ul>
                  <li>
                    <input type="radio" value="0" ${aSt ? 'checked="checked"' : ''} name="a-p-m--a" id="a-p-m--a-s">
                    <label for="a-p-m--a-s">Standard</label>
                  </li>
                  <li>
                    <input type="radio" value="1" ${ai ? 'checked="checked"' : ''} name="a-p-m--a" id="a-p-m--a-i">
                    <label for="a-p-m--a-i">Increase</label>
                  </li>
                  <li>
                    <input type="radio" value="2" ${ad ? 'checked="checked"' : ''} name="a-p-m--a" id="a-p-m--a-d">
                    <label for="a-p-m--a-d">Decrease</label>
                  </li>
                </ul>
              </fieldset>
            ` : ''}

            <!-- Actions -->
            <ul class="actions">
              <li><button type="submit">Apply</button></li>
              <li><button type="button" id="a-p-m--reset">Reset All</button></li>
              <li><button type="button" id="a-p-m--close">Close</button></li>
            </ul>
        </form>
      </ul>
    </li>
    `;
        // Append element to DOM (actions)
        actions.insertAdjacentHTML('afterbegin', marginHtml);
        // Apply new settings: update settings and store new data locally
        const submitApmForm = (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const workSetting = Number(formData.get("a-p-m--w"));
            const authorSetting = Number(formData.get("a-p-m--a"));
            if (workSetting !== marginType.AUTHOR) {
                setMarginClass(workSetting);
            }
            else {
                setMarginClass(authorSetting);
            }
            setMarginLocal("work", workSetting);
            setMarginLocal("author", authorSetting);
        };
        const secondary = document.querySelector("#a-p-m--secondary");
        const form = document.querySelector("#a-p-m--form");
        const reset = document.querySelector("#a-p-m--reset");
        reset.onclick = () => {
            const response = confirm('Resetting all will permanently delete all work settings and author settings. Are you sure?');
            if (response === true) {
                localStorage.removeItem("a-p-m--w-i");
                localStorage.removeItem("a-p-m--w-d");
                localStorage.removeItem("a-p-m--w-s");
                localStorage.removeItem("a-p-m--a-i");
                localStorage.removeItem("a-p-m--a-d");
                setMarginClass(marginType.STANDARD);
                form.reset();
            }
        };
        const toggleButton = document.querySelector("#a-p-m--toggle");
        toggleButton.onclick = () => {
            toggleButton.classList.toggle('collapsed');
            toggleButton.classList.toggle('expanded');
            secondary.classList.toggle('hidden');
        };
        const close = () => {
            toggleButton.classList.add('collapsed');
            toggleButton.classList.remove('expanded');
            secondary.classList.add('hidden');
        };
        const closeButton = document.querySelector("#a-p-m--close");
        closeButton.onclick = close;
        form.addEventListener('submit', (e) => {
            submitApmForm(e);
            close();
        });
    }
})();