// ==UserScript==
// @name         Password Toggler - view input passwords
// @namespace    https://github.com/pckltr/password-toggler
// @version      1.4
// @description  Adds buttons to each input to show/hide passwords
// @author       pckltr
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/28061/Password%20Toggler%20-%20view%20input%20passwords.user.js
// @updateURL https://update.greasyfork.org/scripts/28061/Password%20Toggler%20-%20view%20input%20passwords.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const showIcon =
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0ZWQgYnkgSWNvTW9vbi5pbyAtLT4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDE0IDE0Ij4KPHBhdGggZmlsbD0iIzc1NzU3NSIgZD0iTTcgMi42MjVjLTMuMDUzIDAtNS43IDEuNzc4LTcgNC4zNzUgMS4zIDIuNTk3IDMuOTQ3IDQuMzc1IDcgNC4zNzVzNS42OTktMS43NzggNy00LjM3NWMtMS4zLTIuNTk3LTMuOTQ3LTQuMzc1LTctNC4zNzV6TTEwLjQ1MSA0Ljk0NWMwLjgyMyAwLjUyNSAxLjUyIDEuMjI3IDIuMDQzIDIuMDU1LTAuNTI0IDAuODI3LTEuMjIxIDEuNTMtMi4wNDMgMi4wNTUtMS4wMzQgMC42NTktMi4yMjcgMS4wMDgtMy40NTEgMS4wMDhzLTIuNDE4LTAuMzQ4LTMuNDUxLTEuMDA4Yy0wLjgyMi0wLjUyNS0xLjUxOS0xLjIyNy0yLjA0My0yLjA1NSAwLjUyNC0wLjgyNyAxLjIyMS0xLjUzIDIuMDQzLTIuMDU1IDAuMDU0LTAuMDM0IDAuMTA4LTAuMDY3IDAuMTYyLTAuMS0wLjEzNiAwLjM3NC0wLjIxMSAwLjc3Ny0wLjIxMSAxLjE5OCAwIDEuOTMzIDEuNTY3IDMuNSAzLjUgMy41czMuNS0xLjU2NyAzLjUtMy41YzAtMC40MjEtMC4wNzUtMC44MjQtMC4yMTEtMS4xOTggMC4wNTQgMC4wMzMgMC4xMDkgMC4wNjYgMC4xNjIgMC4xdjB6TTcgNS42ODhjMCAwLjcyNS0wLjU4OCAxLjMxMy0xLjMxMyAxLjMxM3MtMS4zMTMtMC41ODgtMS4zMTMtMS4zMTMgMC41ODgtMS4zMTMgMS4zMTMtMS4zMTMgMS4zMTMgMC41ODggMS4zMTMgMS4zMTN6Ij48L3BhdGg+Cjwvc3ZnPgo=";
  const hideIcon =
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0ZWQgYnkgSWNvTW9vbi5pbyAtLT4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDE0IDE0Ij4KPHBhdGggZmlsbD0iIzc1NzU3NSIgZD0iTTEyLjkzMyAwLjE5MmMtMC4yNTYtMC4yNTYtMC42NzItMC4yNTYtMC45MjggMGwtMi43NjQgMi43NjRjLTAuNzEtMC4yMTUtMS40NjItMC4zMzEtMi4yNDEtMC4zMzEtMy4wNTMgMC01LjcgMS43NzgtNyA0LjM3NSAwLjU2MiAxLjEyMyAxLjM3NiAyLjA5MiAyLjM2NiAyLjgzMWwtMi4xNzMgMi4xNzNjLTAuMjU2IDAuMjU2LTAuMjU2IDAuNjcyIDAgMC45MjggMC4xMjggMC4xMjggMC4yOTYgMC4xOTIgMC40NjQgMC4xOTJzMC4zMzYtMC4wNjQgMC40NjQtMC4xOTJsMTEuODEzLTExLjgxM2MwLjI1Ni0wLjI1NiAwLjI1Ni0wLjY3MiAwLTAuOTI4ek01LjY4OCA0LjM3NWMwLjU3OCAwIDEuMDY4IDAuMzczIDEuMjQzIDAuODkxbC0xLjY2NCAxLjY2NGMtMC41MTgtMC4xNzYtMC44OTEtMC42NjYtMC44OTEtMS4yNDMgMC0wLjcyNSAwLjU4OC0xLjMxMyAxLjMxMy0xLjMxM3pNMS41MDUgN2MwLjUyNC0wLjgyNyAxLjIyMS0xLjUzIDIuMDQzLTIuMDU1IDAuMDU0LTAuMDM0IDAuMTA4LTAuMDY3IDAuMTYyLTAuMS0wLjEzNiAwLjM3NC0wLjIxMSAwLjc3Ny0wLjIxMSAxLjE5OCAwIDAuNzUgMC4yMzYgMS40NDYgMC42MzggMi4wMTVsLTAuODMzIDAuODMzYy0wLjcxNy0wLjUwNC0xLjMyOS0xLjE0Ny0xLjgtMS44OTF6Ij48L3BhdGg+CjxwYXRoIGZpbGw9IiM3NTc1NzUiIGQ9Ik0xMC41IDYuMDQzYzAtMC4zNzEtMC4wNTgtMC43MjktMC4xNjUtMS4wNjVsLTQuNCA0LjRjMC4zMzYgMC4xMDcgMC42OTQgMC4xNjUgMS4wNjUgMC4xNjUgMS45MzMgMCAzLjUtMS41NjcgMy41LTMuNXoiPjwvcGF0aD4KPHBhdGggZmlsbD0iIzc1NzU3NSIgZD0iTTExLjM0OCAzLjk2NGwtMC45NDggMC45NDhjMC4wMTcgMC4wMTEgMC4wMzUgMC4wMjEgMC4wNTIgMC4wMzIgMC44MjMgMC41MjUgMS41MiAxLjIyNyAyLjA0MyAyLjA1NS0wLjUyNCAwLjgyNy0xLjIyMSAxLjUzLTIuMDQzIDIuMDU1LTEuMDM0IDAuNjU5LTIuMjI3IDEuMDA4LTMuNDUxIDEuMDA4LTAuNTI5IDAtMS4wNTEtMC4wNjUtMS41NTgtMC4xOTJsLTEuMDUxIDEuMDUxYzAuODE2IDAuMjkzIDEuNjk1IDAuNDUzIDIuNjA5IDAuNDUzIDMuMDUzIDAgNS42OTktMS43NzggNy00LjM3NS0wLjYxNi0xLjIyOS0xLjUzMy0yLjI3NS0yLjY1Mi0zLjAzNnoiPjwvcGF0aD4KPC9zdmc+Cg==";

  const buttonStyle = `
            .password-toggler-button-parent {
                position: relative;
                overflow: visible;
            }
            .password-toggler-button {
                position: absolute;
                top: 50%;
                right: 8px;
                transform: translateY(-50%);
                cursor: pointer;
                background-repeat: no-repeat;
                z-index: 9999;
                background-color: #dcdcdc;
                border-radius: 50%;
                background-position: center;
                width: 20px;
                height: 20px;
                display: none;
            }
            .password-toggler-show { background-image: url(${showIcon}); }
            .password-toggler-hide { background-image: url(${hideIcon}); }
        `;

  // append styles to the document
  const styleElement = document.createElement("style");
  styleElement.appendChild(document.createTextNode(buttonStyle));
  document.head.appendChild(styleElement);

  // create toggle button
  const createToggleButton = (input) => {
    const button = document.createElement("div");
    button.className = "password-toggler-button password-toggler-show";
    button.title = "Show password - Password Toggler";
    button.addEventListener("click", () => togglePassword(input, button));
    input.parentElement.classList.add("password-toggler-button-parent");
    input.parentElement.appendChild(button);
  };

  // toggle visibility
  const togglePassword = (input, button) => {
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    button.className =
      "password-toggler-button " +
      (isPassword ? "password-toggler-hide" : "password-toggler-show");
    button.title =
      (isPassword ? "Hide password" : "Show password") + " - Password Toggler";
  };

  // add buttons
  const addToggleButtons = () => {
    document.querySelectorAll("input[type='password']").forEach((input) => {
      const button = input.parentElement.querySelector(
        ".password-toggler-button"
      );
      if (!button) {
        createToggleButton(input);
      } else {
        input.addEventListener("focus", () => {
          button.style.display = "inline";
        });
        input.addEventListener("blur", () => {
          if (!input.value) {
            button.style.display = "none";
          }
        });
      }
    });
  };

  // handle dynamically added password fields
  const observer = new MutationObserver(addToggleButtons);
  observer.observe(document.body, { childList: true, subtree: true });

  // initial run
  addToggleButtons();
})();
