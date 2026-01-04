// ==UserScript==
// @name         Stack Exchange Formatter
// @namespace    https://greasyfork.org/en/users/211578
// @version      1.0.2
// @description  Format a webpage on Stack Enchange websites such as stackoverflow.com so that web clippers can save a pretty webpage containing only the content you need.
// @author       twchen
// @include      https://stackoverflow.com/questions/*
// @include      https://*.stackexchange.com/questions/*
// @include      https://superuser.com/questions/*
// @include      https://serverfault.com/questions/*
// @include      https://askubuntu.com/questions/*
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/378196/Stack%20Exchange%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/378196/Stack%20Exchange%20Formatter.meta.js
// ==/UserScript==

"use strict";
if (typeof GM_addStyle == "undefined") {
  this.GM_addStyle = (css) => {
    const style = document.createElement("style");
    style.textContent = css;
    document.documentElement.appendChild(style);
    return style;
  };
}

if (typeof GM == "undefined") {
  this.GM = {};
  [
    ["getValue", GM_getValue],
    ["setValue", GM_setValue],
  ].forEach(([newFunc, oldFunc]) => {
    GM[newFunc] = (...args) => {
      return new Promise((resolve, reject) => {
        try {
          resolve(oldFunc(...args));
        } catch (error) {
          reject(error);
        }
      });
    };
  });
}

function createElement(type, props, ...children) {
  const element = document.createElement(type);
  Object.entries(props || {}).forEach(([name, value]) => {
    if (name.startsWith("on")) {
      const eventName = name.slice(2);
      element.addEventListener(eventName, value);
    } else if (name == "style" && typeof value !== "string") {
      Object.assign(element.style, value);
    } else {
      element.setAttribute(name, value);
    }
  });
  children
    .map((child) =>
      typeof child === "string" ? document.createTextNode(child) : child
    )
    .forEach((child) => element.appendChild(child));
  return element;
}

const body = document.body;
const formatted = createElement("div", { id: "formatted" });
body.appendChild(formatted);
const posts = document.querySelectorAll(".question, .answer");
let postCheckboxes = [];
let commentCheckboxes = [];

function addCheckboxes() {
  posts.forEach((post, i) => {
    post.querySelectorAll(".post-layout--right").forEach((layout, j) => {
      const isCommentLayout = layout.querySelector(".comments") !== null;
      if (isCommentLayout && layout.querySelectorAll("li.comment").length === 0)
        return;
      layout.style.position = "relative";
      const checkboxId = `post${i}-layout${j}`;
      const checkbox = createElement("input", {
        type: "checkbox",
        id: checkboxId,
      });
      if (isCommentLayout) commentCheckboxes.push(checkbox);
      else postCheckboxes.push(checkbox);
      const container = createElement(
        "div",
        { class: "ft-checkbox-container" },
        createElement("label", { for: checkboxId }, "Keep"),
        createElement("br"),
        checkbox
      );
      layout.appendChild(container);
    });
  });
}

function addLinks() {
  const question = document.querySelector(".question");
  const answers = document.querySelectorAll(".answer");
  answers.forEach((answer) => {
    const menu = answer.querySelector(".post-menu");
    const saveAnsLink = createElement(
      "a",
      {
        href: "#",
        style: "margin-right: 0.5rem",
        onclick: async (event) => {
          event.preventDefault();
          unselectAllCheckboxes();
          await keepPost(answer);
          save();
        },
      },
      "save this answer"
    );
    const saveQALink = createElement(
      "a",
      {
        href: "#",
        onclick: async (event) => {
          event.preventDefault();
          unselectAllCheckboxes();
          await keepPost(question);
          await keepPost(answer);
          save();
        },
      },
      "save this Q&A"
    );
    menu.append(saveAnsLink, saveQALink);
  });

  const advancedSaveLink = createElement(
    "div",
    { style: "padding-left: 1rem" },
    createElement(
      "a",
      {
        href: "#",
        class: "ws-nowrap s-btn s-btn__primary",
        onclick: (event) => {
          event.preventDefault();
          startChoosing();
        },
      },
      "Advanced Save"
    )
  );
  const header = document.querySelector("#question-header");
  header.append(advancedSaveLink);
}

function startChoosing() {
  document.querySelectorAll(".ft-checkbox-container").forEach((container) => {
    container.style.display = "block";
  });
  let dialog = document.getElementById("ft-dialog");
  if (dialog) {
    dialog.style.display = "block";
  } else {
    createDialog();
  }
}

async function createDialog() {
  const dialog = createElement(
    "div",
    { id: "ft-dialog" },
    createElement("label", { for: "selectAllPosts" }, "Select All Posts"),
    createElement("input", {
      type: "checkbox",
      id: "selectAllPosts",
      onchange: (event) => {
        for (let checkbox of postCheckboxes) {
          checkbox.checked = event.target.checked;
        }
      },
    }),
    createElement("br"),
    createElement("label", { for: "selectAllComments" }, "Select All Comments"),
    createElement("input", {
      type: "checkbox",
      id: "selectAllComments",
      onchange: (event) => {
        for (let checkbox of commentCheckboxes) {
          checkbox.checked = event.target.checked;
        }
      },
    }),
    createElement("br"),
    createElement(
      "label",
      { for: "selectCommentsByDefault" },
      "Select Comments by Default"
    ),
    createElement("input", {
      type: "checkbox",
      id: "selectCommentsByDefault",
      onchange: (event) => {
        GM.setValue("selectCommentsByDefault", event.target.checked);
      },
    }),
    createElement("br"),
    createElement(
      "button",
      {
        onclick: (event) => {
          document
            .querySelectorAll(".ft-checkbox-container")
            .forEach((container) => {
              container.style.display = "none";
            });
          dialog.style.display = "none";
        },
      },
      "Cancel"
    ),
    createElement("button", { onclick: (event) => save() }, "Save")
  );
  const selectComments = await GM.getValue("selectCommentsByDefault");
  dialog.querySelector("#selectCommentsByDefault").checked = selectComments;
  for (let checkbox of commentCheckboxes) {
    checkbox.checked = selectComments;
  }
  body.appendChild(dialog);
}

function save() {
  const children = [];
  const questionLink = document.querySelector(
    "#question-header .question-hyperlink"
  );
  const hr = createElement("hr", { style: "height: 0px" });
  let title = undefined;
  if (questionLink) {
    title = createElement(
      "div",
      { class: "post-layout--right" },
      questionLink.cloneNode(true)
    );
    children.push(title);
  }
  posts.forEach((post, i) => {
    const layouts = [];
    post.querySelectorAll(".post-layout--right").forEach((layout, j) => {
      const checkboxId = `post${i}-layout${j}`;
      const checkbox = document.getElementById(checkboxId);
      if (checkbox && checkbox.checked) {
        layouts.push(layout.cloneNode(true));
      }
    });
    if (layouts.length > 0) {
      children.push(...layouts);
      children.push(hr.cloneNode(true));
    }
  });
  if (children.length === 0 || (children.length === 1 && title)) {
    alert("Select at least one post!");
    return;
  }
  children.pop();
  hideAllChildren(body);
  removeAllChildren(formatted);
  formatted.append(...children);
  formatted.style.display = "block";
  window.history.pushState("formatted", "");
}

function unselectAllCheckboxes() {
  for (let checkboxes of [postCheckboxes, commentCheckboxes]) {
    for (let checkbox of checkboxes) {
      checkbox.checked = false;
    }
  }
}

async function keepPost(post) {
  const layouts = post.querySelectorAll(".post-layout--right");
  const selectComments = await GM.getValue("selectCommentsByDefault");
  for (let layout of layouts) {
    console.log(layout);
    const checkbox = layout.querySelector(
      '.ft-checkbox-container input[type="checkbox"]'
    );
    if (checkbox === null) {
      console.log(1);
      continue;
    }
    if (layout.querySelector(".comments") && selectComments === false) {
      console.log(2);
      checkbox.checked = false;
    } else {
      checkbox.checked = true;
    }
  }
}

function removeAllChildren(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

function showAllChildren(el) {
  [...el.children].forEach((child) => {
    child.style.display =
      child.old_display === undefined ? "" : child.old_display;
  });
}

function hideAllChildren(el) {
  [...el.children].forEach((child) => {
    child.old_display = child.style.display;
    child.style.display = "none";
  });
}

GM_addStyle(`
  .ft-checkbox-container {
    position: absolute;
    top: 0;
    right: -1rem;
    text-align: center;
    display: none;
  }
  #ft-dialog {
    background-color: white;
    position: fixed;
    top: 50%;
    right: 2rem;
    transform: translateY(-50%);
    z-index: 100;
    text-align: center;
    padding: 0.8rem;
    border: 1px solid black;
    border-radius: 5px;
  }
  #ft-dialog label {
    width: 10rem;
    display: inline-block;
    text-align: left;
  }
  #ft-dialog button {
    width: 5rem;
    margin: 0 0.5rem;
  }
  #formatted {
    background-color: #f6f6f6;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
  #formatted .question-hyperlink {
    color: black;
    font-size: 2rem;
  }
  #formatted .ft-checkbox-container {
    display: none !important;
  }
  #formatted .post-layout--right {
    background-color: white;
    padding: 2rem;
    margin: 0 2rem;
    box-shadow: 0 1px 3px #808080b5;
  }
  #formatted .post-menu, #formatted .post-signature, #formatted *[id^="comments-link-"] {
    display: none;
  }
`);
// handle backward/forward events
window.addEventListener("popstate", function (event) {
  if (event.state === "formatted") {
    hideAllChildren(body);
    formatted.style.display = "block";
  } else {
    showAllChildren(body);
    formatted.style.display = "none";
  }
});
addCheckboxes();
addLinks();
