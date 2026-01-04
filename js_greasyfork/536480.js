// ==UserScript==
// @name         allenai css
// @description  Force code wrapping and unset chat message display
// @match        https://playground.allenai.org/*
// @version 0.0.1.20251216044611
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/536480/allenai%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/536480/allenai%20css.meta.js
// ==/UserScript==

(function() {
  const style = document.createElement('style');
style.id = 'allenAiCssStyleId';

    style.textContent = `
* {
    box-shadow: revert !important;
    overflow-wrap: anywhere !important;
    /* white-space: revert !important; */
    width: revert !important;
    text-wrap-mode: wrap !important;
    padding: revert !important;
    min-width: revert !important;
    max-width: revert !important;
  }

html {
    box-shadow: inset 0 0 0 1px red !important;
}

div#root > div {
position: revert !important;
    height: calc(100vh - 16px);
}
    :root {
        color-scheme: light dark !important;
    }

body {
margin: revert !important;
}

    header>div.MuiToolbar-root {
        background-color: revert !important;
    }

    body,
    div.MuiPaper-root {
        background-color: revert !important;
    }

    div.MuiBackdrop-root.MuiModal-backdrop {
        background-color: rgba(0, 0, 0, 1);
    }

    .chat-message {
        display: revert !important;
    }

    code {
        white-space: pre-wrap;
    }

    .MuiBox-root {
        /*padding: revert !important;*/
    }

    button[aria-label="Scroll to bottom"] {
        display: none !important;
    }

    div.MuiBox-root[id="icon"] {
        display: none !important;
    }

    form>div.MuiStack-root {
        gap: revert !important;
    }

svg {
color: initial !important;
}

.MuiInputBase-root {
    background-color: revert !important;
}

.MuiBox-root {
    /*background-color: revert !important;*/
}

svg[data-testid="ArrowDropDownIcon"] {
    fill: currentColor !important;
    position: revert !important;
}

.chat-message > div:not(#icon) > div:not(div[data-is-streaming]):not(div[data-widget-type*='thinking']) > div:not(div[class*="MuiButtonGroup"]) {
    background-color: red !important;
    color: black !important;
}

div.MuiBox-root:has(> textarea[name="content"]) {
    background-color: revert !important;
}

.MuiFormControl-fullWidth:has(> div > textarea[name="content"]) {
    width: 100% !important;
}

div[data-widget-type*='thinking'] {
    background: revert !important;
    color: revert !important;
}

div:has(> form) {
    background: revert !important;
}

button {
    background: none !important;
}
        `;
  document.head.appendChild(style);
})();