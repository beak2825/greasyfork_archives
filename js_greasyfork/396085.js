// ==UserScript==
// @name         JIRA auto fill
// @namespace    http://jira.it.qwilt.com
// @version      0.1
// @description  Auto fills fields in JIRA posts
// @author       Vitaly 
// @include      http://jira.it.qwilt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396085/JIRA%20auto%20fill.user.js
// @updateURL https://update.greasyfork.org/scripts/396085/JIRA%20auto%20fill.meta.js
// ==/UserScript==
(function() {
  ("use strict");

  function simulateKeyPress(character) {
    jQuery.event.trigger({ type: "keypress", which: character.charCodeAt(0) });
  }

  function setValueIfExists(selector, value) {
    const element = document.querySelector(selector);
    if (element) {
      element.value = value;
    }
  }

  function simulateClick(targetNode) {
    function triggerMouseEvent(targetNode, eventType) {
      var clickEvent = document.createEvent("MouseEvents");
      clickEvent.initEvent(eventType, true, true);
      targetNode.dispatchEvent(clickEvent);
    }
    ["mouseover", "mousedown", "mouseup", "click"].forEach(function(eventType) {
      triggerMouseEvent(targetNode, eventType);
    });
  }

  async function setDropdownValue(dropdownInputSelector, optionText) {
    if ($(dropdownInputSelector).length === 0) {
      throw new Error("dropdown not found: " + dropdownInputSelector);
    }

    $(dropdownInputSelector).focus();
    $(dropdownInputSelector).val("");
    $(dropdownInputSelector).sendkeys(optionText);
    // Commented out: Some values have 2 results...
    // await waitForCondition(() => $(".ajs-layer.active .aui-list-item").length === 1, 1000);
    const $item = await waitForSelector(
      ".ajs-layer.active .aui-list-item.active",
      1000
    );
    simulateClick($item[0]);
  }

  function getEpicName() {
    function getNewRow() {
      var current = document.querySelector(".alm-noicon");
      while (current) {
        current = current.parentNode;
        if (current.classList.contains("s-focused")) {
          return current;
        }
      }
    }

    let newRow = getNewRow();
    let allRows = Array.from(newRow.parentNode.children);
    let newRowIndex = allRows.indexOf(newRow);
    let previousSibling = allRows[newRowIndex - 1];
    let epicName = undefined;
    if (previousSibling.querySelector(".s-summary-icon img").alt === "Epic") {
      epicName = previousSibling.querySelector(".s-f-issuekey .value")
        .innerText;
    }

    return epicName;
  }

  async function setEpicDropdownValue(dropdownInputSelector, optionText) {
    if ($(dropdownInputSelector).length === 0) {
      throw new Error("dropdown not found: " + dropdownInputSelector);
    }

    $(dropdownInputSelector).focus();
    $(dropdownInputSelector).val("");
    $(dropdownInputSelector).sendkeys(optionText);
    await waitForCondition(
      () =>
        document
          .querySelector(".ajs-layer.active .aui-list-section")
          .innerText.includes("Showing 1 of"),
      1000
    );
    const $item = await waitForSelector(
      ".ajs-layer.active .aui-list-section[aria-label=Suggestions] .aui-list-item",
      1000
    );
    // NOTE: Click doesn't work but it still does the right thing on save
    simulateClick($item[0]);
  }

  async function fillRequiredFields(type) {
    try {
      await toggleStoryBug(type);
    } catch (e) {
      console.warn("failed to toggle story/bug");
    }

    // Team
    setValueIfExists("[name=customfield_11201]", "11992");
    // Found by
    setValueIfExists("[name=customfield_10051]", "10078");
    // Found version
    setValueIfExists("[name=customfield_10052]", "10077");
    // Found build
    setValueIfExists("[name=customfield_10018]", "11521");
    // Found build
    setValueIfExists("[name=customfield_10017]", "1");
    // Set label
    try {
      const label = "Frontend";
      if ($("#labels-multi-select button").text() !== label) {
        await setDropdownValue("#labels-multi-select textarea", label);
      }
    } catch (e) {
      console.warn("failed to set label");
    }
    // In issue, focus on summary
    try {
      document.querySelector("#summary").focus();
    } catch (e) {
      console.warn("no summary input was found");
    }

    // In popup in structure on creation of a new item, choose "Add issues to epic"
    try {
      Array.from(
        document.querySelectorAll(
          ".aui-inline-dialog-contents button.aui-button"
        )
      )
        .filter(b => b.innerText.includes("Add issues to epic"))[0]
        .click();
    } catch (e) {
      console.warn("no popup with 'Parenthood' found");
    }

    try {
      if (!$("#qf-create-another")[0].checked) {
        simulateClick($("#qf-create-another")[0]);
      }
    } catch (e) {
      console.warn("failed to check 'Create another'");
    }

    // set epic name
    try {
      const epicName = getEpicName();
      if (epicName) {
        await setEpicDropdownValue(
          "#customfield_10706-single-select > input",
          epicName
        );
      }
    } catch (e) {
      console.warn("failed to change epic", e);
    }

    // change priority
    try {
      await setDropdownValue("#priority-single-select > input", "medium");
    } catch (e) {
      console.warn("failed to change priority");
    }

    // focus on summary
    try {
      document.querySelector("#summary").focus();
    } catch (e) {
      console.warn("no summary input was found");
    }

    // Bug resolving fields
    try {
      await setDropdownValue("#fixVersions-textarea", "QC");
    } catch (e) {
      console.warn("no fix version input was found");
    }

    setValueIfExists("[name=customfield_11407]", "1");
  }

  async function toggleStoryBug(type) {
    const issueTypeSelector = "#issuetype-single-select > input";
    if ($(issueTypeSelector).length === 0) {
      throw new Error("selector not found: " + dropdownInputSelector);
    }

    try {
      const current = $(issueTypeSelector).val();

      if (current.toLowerCase() === "sub-task") {
        return;
      }

      if (current.toLowerCase() !== type) {
        await setDropdownValue(issueTypeSelector, type);
      }
    } catch (e) {
      console.warn("failed to change priority");
    }

    // wait until summary is enabled again
    await waitForSelector("#summary:not(:disabled)", 1000);

    // focus on summary
    try {
      document.querySelector("#summary").focus();
    } catch (e) {
      console.warn("no summary input was found");
    }
  }

  async function editPriority(priority) {
    try {
      if ($("#create-issue-dialog").length > 0) {
        await setDropdownValue("#priority-single-select > input", priority);
      } else {
        $("#priority-val").click();
        await waitForSelector("#priority-field", 1000);
        await setDropdownValue("#priority-field", priority);
        $("#priority-val .save-options button[type=submit]").click();
      }
    } catch (e) {
      console.warn("can't edit priority");
      console.warn(e);
    }
  }

  function sleep(millisecond) {
    return new Promise(resolve => setTimeout(resolve, millisecond));
  }

  async function waitForSelector(selector, timeoutMs, timePassed = 0) {
    await waitForCondition(() => $(selector).length > 0, timeoutMs);
    return $(selector);
  }

  async function waitForCondition(conditionFn, timeoutMs, timePassed = 0) {
    const ITERATE = 100;

    let result = false;
    try {
      result = conditionFn();
    } catch {}

    if (result) {
      console.info(`condition is true after: ${timePassed}ms`);
      return;
    } else if (timePassed > timeoutMs) {
      throw new Error(`condition was still false after ${timePassed}ms`);
    } else {
      await sleep(ITERATE);
      await waitForCondition(conditionFn, timeoutMs, timePassed + ITERATE);
    }
  }

  async function createSubtask() {
    $("#opsbar-operations_more").click();
    $("#create-subtask").click();
  }

  window.addEventListener("keyup", function() {
    if (event.ctrlKey && event.key.toLowerCase() === "j") {
      if (event.shiftKey) {
        fillRequiredFields("bug");
      } else {
        fillRequiredFields("story");
      }
    }

    if (event.ctrlKey && event.key === "t") {
      createSubtask();
    }

    if (event.ctrlKey && event.key === "1") {
      editPriority("urgent");
    }

    if (event.ctrlKey && event.key === "2") {
      editPriority("must");
    }

    if (event.ctrlKey && event.key === "3") {
      editPriority("high");
    }

    if (event.ctrlKey && event.key === "4") {
      editPriority("medium");
    }

    if (event.ctrlKey && event.key === "5") {
      editPriority("trivial");
    }

    if (event.ctrlKey && event.key === "6") {
      editPriority("low");
    }

    if (event.ctrlKey && event.key.toLowerCase() === "c") {
      const focusedItem = $(".s-focused .issue-link");
      if (focusedItem.length > 0) {
        GM_setClipboard(focusedItem.data("issue-key"));
      }
    }
  });

  console.log("!!!!! Loadded: Jira - Auto fill !!!!!!");
})();

(function($) {
  $.fn.sendkeys = function(x) {
    x = x.replace(/([^{])\n/g, "$1{enter}"); // turn line feeds into explicit break insertions, but not if escaped
    return this.each(function() {
      bililiteRange(this)
        .bounds("selection")
        .sendkeys(x)
        .select();
      this.focus();
    });
  }; // sendkeys

  // add a default handler for keydowns so that we can send keystrokes, even though code-generated events
  // are untrusted (http://www.w3.org/TR/DOM-Level-3-Events/#trusted-events)
  // documentation of special event handlers is at http://learn.jquery.com/events/event-extensions/
  $.event.special.keydown = $.event.special.keydown || {};
  $.event.special.keydown._default = function(evt) {
    if (evt.isTrusted) return false;
    if (evt.ctrlKey || evt.altKey || evt.metaKey) return false; // only deal with printable characters. This may be a false assumption
    if (evt.key == null) return false; // nothing to print. Use the keymap plugin to set this
    var target = evt.target;
    if (
      target.isContentEditable ||
      target.nodeName == "INPUT" ||
      target.nodeName == "TEXTAREA"
    ) {
      // only insert into editable elements
      var key = evt.key;
      if (key.length > 1 && key.charAt(0) != "{") key = "{" + key + "}"; // sendkeys notation
      $(target).sendkeys(key);
      return true;
    }
    return false;
  };
})(jQuery);
