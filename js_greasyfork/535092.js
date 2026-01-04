// ==UserScript==
// @name         WhatsApp Web - Clean UI
// @description  Fix & debloat WhatsApp Web's interface
// @author       Gamba
// @version      1.14.1
// @license      MIT
// @namespace    http://tampermonkey.net/
// @match        https://web.whatsapp.com/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://web.whatsapp.com/&size=256
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/535092/WhatsApp%20Web%20-%20Clean%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/535092/WhatsApp%20Web%20-%20Clean%20UI.meta.js
// ==/UserScript==

"use strict";

// Add original dark theme
{
    const themeKey = "theme";
    const darkThemeValue = '"dark"';
    const lightThemeValue = '"light"';
    const systemKey = "system-theme-mode";
    const originalKey = "original-theme";
    const originalLabel = " (2024)";

    document.addEventListener("DOMContentLoaded", onLoad);

    function onLoad()
    {
        const body = document.body;

        function observe(callback, options)
        {
            const observer = new MutationObserver(callback);

            observer.observe(body, options);
        }

        observe(onTreeChange,
        {
            childList: true,
            subtree: true
        });

        function onTreeChange()
        {
            onThemePreview();
            onOptionsDialog();
        }

        // Replace theme preview label
        let previewActive = false;

        function onThemePreview()
        {
            const preview = document.querySelector("#app > div > div > div:last-child > div > div:nth-child(3) > div:first-child > div > span > div > span > div > div > div > div > div > div:first-child > div:nth-child(2) > div > div:first-child > div:last-child");
            const previewExists = preview != null;

            if (previewExists != previewActive)
            {
                previewActive = previewExists;

                if (previewExists)
                {
                    const original = localStorage.getItem(originalKey) == "true";

                    if (original) preview.innerHTML += originalLabel;
                }
            }
        }

        // Replace system theme option with original dark
        let dialogActive = false;

        function onOptionsDialog()
        {
            const dialog = document.querySelector("#app > div > div > span:nth-child(3) > div > div > div > div > div > div");
            const dialogExists = dialog != null;

            if (dialogExists != dialogActive)
            {
                dialogActive = dialogExists;

                if (dialogExists)
                {
                    const darkOption = getOption(1);
                    const darkLabel = getLabel(darkOption);
                    const systemOption = getOption(2);

                    setLabel(systemOption, darkLabel + originalLabel);

                    const original = localStorage.getItem(originalKey) == "true";

                    if (original) systemOption.click();

                    const okButton = dialog.children[2].firstElementChild.children[1];
                    okButton.addEventListener("click", onConfirm, true);

                    function onConfirm()
                    {
                        const darkSelected = getSelected(darkOption);
                        const systemSelected = getSelected(systemOption);

                        localStorage.setItem(systemKey, false);
                        localStorage.setItem(originalKey, systemSelected);
                        localStorage.setItem(themeKey, (darkSelected || systemSelected) ? darkThemeValue : lightThemeValue);

                        location.reload();
                    }
                }
            }

            function getOption(index)
            {
                return dialog.children[1].firstElementChild.firstElementChild.firstElementChild.children[index].children[1];
            }

            function getLabel(option)
            {
                const label = option.innerHTML;
                const child = option.firstElementChild.outerHTML;

                return label.replace(child, "");
            }

            function setLabel(option, text)
            {
                const child = option.firstElementChild.outerHTML;

                option.innerHTML = text + child;
            }

            function getSelected(option)
            {
                const radio = option.previousElementSibling.children[1];

                return radio.ariaChecked == "true";
            }
        }

        // Apply theme on startup
        observe(onThemeChange,
        {
            attributes: true,
            attributeFilter: ["class"]
        });

        function onThemeChange()
        {
            const system = localStorage.getItem(systemKey) == "true";
            const theme = localStorage.getItem(themeKey);
            const original = localStorage.getItem(originalKey) == "true";

            if (system)
            {
                localStorage.setItem(systemKey, false);
                localStorage.setItem(themeKey, darkThemeValue);
                localStorage.setItem(originalKey, true);

                location.reload();
            }

            if (theme == darkThemeValue && original) applyOriginalDark();
        }

        function applyOriginalDark()
        {
            const targetClass = "dark";

            if (body.className == targetClass) return;

            body.className = targetClass;
        }
    }
}

// Fix menu background exit [Broken]
{
    window.addEventListener("keydown", onKeyboard, true);

    const exceptions =
    [
        "#app > div > span:nth-child(4) *",
        "#app > div > div > div > div > div:nth-child(3) > div:first-child > span > div > span > div > header > div > div:first-child > div",
        "#app > div > div > div > div > div:nth-child(3) > div:first-child > span > div > span > div > span > div > header > div > div:first-child > div",
        "#app > div > span:nth-child(3) > div"
    ];

    function onKeyboard(event)
    {
        if (event.key == "Escape")
        {
            const isException = exceptions.some(exception => event.target.matches(exception));
            const isValid = isChatsSelected() || isException;

            if (!isValid) event.stopImmediatePropagation();
        }
    }

    function isChatsSelected()
    {
        let chatsButton = document.querySelector("#app > div > div > div > header > div > div:first-child > div > div:first-child > button");

        return chatsButton.ariaPressed == "true";
    }
}

// Exit chat on change tab
{
    document.addEventListener("click", onClick, true);

    function onClick(event)
    {
        const button = event.target.closest("button");

        if (button)
        {
            const header = button.closest("header");

            if (header && header.parentElement.hasAttribute("tabindex"))
            {
                const keyEvent = new KeyboardEvent("keydown", { key: "Escape" });

                document.dispatchEvent(keyEvent);
            }
        }
    }
}

// Prevent unwanted focus
{
    let lastInput;

    document.addEventListener("mousedown", () => lastInput = "Mouse", true);
    document.addEventListener("keydown", () => lastInput = "Keyboard", true);

    document.addEventListener("focus", onFocus, true);

    function onFocus(event)
    {
        const element = event.target;

        const match = element instanceof HTMLButtonElement;
        const text = element.style.userSelect == "text";
        const mouse = lastInput == "Mouse";

        if (match || (!text && !mouse))
        {
            element.blur();
        }
    }
}

// Apply CSS
{
    const css =
    `
    /*Desktop app advertisement*/
    #app > div > div > div > div
    {
        > div:nth-child(6) > div:not(#main) > div
        {
            > div:nth-child(1),
            > div:nth-child(2)
            {
                display: none;
            }
        }

        > div:nth-child(3) > div:last-child > span
        {
            border: none;

            > div[tabindex] > div:not([tabindex])
            {
                display: none;
            }
        }
    }

    #side > div:last-child[role="button"]
    {
        display: none;
    }

    /*Channels & communities*/
    #app > div > div > div > div > header > div > div:first-child > div
    {
        > div:nth-child(n + 3)
        {
            display: none;
        }
    }

    /*Video call button*/
    #main > header > div:last-child > div > span:first-child
    {
        display: none;
    }

    /*Chat lists*/
    #side > [role="tablist"]
    {
        display: none;
    }

    /*Chat dropdowns arrows*/
    #pane-side > div:nth-last-child(2) > div > div > div > div > div > div:not(:hover) > div:last-child > div:last-child > div:last-child > span:nth-child(3)
    {
        display: none;
    }

    /*Archived chats separator*/
    #app > div > div > div > div > div:nth-child(3) > div:first-child > div > span > div > span > div > div:last-child > div[tabindex] > div:nth-child(2)
    {
        display: none;
    }

    /*Popover tooltips*/
    #app > div:nth-child(2)
    {
        display: none;
    }

    /*Scrollbar*/
    *
    {
        scrollbar-width: unset !important;
        scrollbar-color: unset !important;
    }

    div
    {
        ::-webkit-scrollbar
        {
            width: 14px !important;
        }

        ::-webkit-scrollbar-button
        {
            display: none !important;
        }

        ::-webkit-scrollbar-track,
        ::-webkit-scrollbar-track-piece
        {
            background-color: transparent !important;
        }

        ::-webkit-scrollbar-thumb
        {
            height: 50px !important;

            border: 3px solid transparent !important;
            border-radius: 100px;
            background-clip: padding-box !important;

            background-color: rgba(var(--black-rgb), 20%) !important;
        }
    }

    .dark div ::-webkit-scrollbar-thumb
    {
        background-color: rgba(var(--white-rgb), 16%) !important;
    }

    /*Buggy outlines*/
    div:not(:focus)
    {
        outline: none !important;
    }

    /*Selection color*/
    ::selection
    {
        background-color: rgba(var(--WDS-accent-RGB), 0.4) !important;
    }

    /*Unwanted selections [Broken]*/
    #main > div:nth-child(3) > div > div:last-child > div:nth-child(3)
    {
        button,
        [role="button"],
        .x1n2onr6.x1n327nk.x18mqm2i.xhsvlbd.x14z9mp.xz62fqu.xdwrcjd,
        .x1c4vz4f.xs83m0k.xdl72j9.x1g77sc7.x78zum5.xozqiw3.x1oa3qoh.x12fk4p8.xeuugli.x2lwn1j.x1nhvcw1.xdt5ytf.x1cy8zhl,
        .xrb244j.x10l6tqk.x11dcrhx.xhtitgo,
        .x10l6tqk.xhtitgo.x1inkcgm.xy1j3rs,
        .x10l6tqk.x11uqc5h.xy1j3rs.x1inkcgm,
        ._ak49.x121pien.x9f619.x193iq5w.x1yrsyyn.x1icxu4v.x10b6aqq.x25sj25,
        .x78zum5.x6s0dn4.x10l6tqk.xy1j3rs.xrr41r3.x11uqc5h.xx3o462.x1ncwhqj.x152skdk.x1dxgm4b,
        .x141l45o.x1h3r9g6.x1hx0egp.x78zum5.x1q0g3np.xl56j7k.x18nleir,
        .xo0jvv6
        {
            user-select: none;
        }
    }

    /*Expressions panel*/
    #expressions-panel-container > span > div > ul > div:first-child > div:last-child
    {
        /*Loading bar*/
        > div:first-child > span:not(:first-child)
        {
            display: none;
        }

        /*Border radius*/
        > div:last-child > div:last-child > div > div > div > button
        {
            border-radius: 10px !important;
        }

        /*Search bar*/
        div > span > div > label > div
        {
            background-color: #2a3942 !important;
        }
    }

    /*Small unnecessary borders*/
    #app > div > div > div > div
    {
        > div:nth-child(3) > div,
        > div:nth-child(4),
        > div:nth-child(6)
        {
            border-left: 0;
            padding-left: 0;
        }

        > div:nth-child(5)
        {
            border-left-color: var(--conversation-header-border);
        }
    }

    #expressions-panel-container > span > div > ul > div > div > div
    {
        border-left: 0;
    }

    /*Dark Theme 2024*/
    .dark:not(.color-refresh) *
    {
        --drawer-background-deep: #111b21;
        --panel-background-deeper: #111b21;

        --compose-input-background: #202c33;
        --compose-input-border: #202c33;

        --conversation-header-border: #222e35;
        --conversation-panel-border: #222e35;

        --dropdown-background: #222e35;

        --WDS-background-wash-inset: #202c33;
        --WDS-background-wash-plain: #111b21;

        --WDS-surface-default: #111b21;
        --WDS-surface-emphasized: #202c33;
        --WDS-surface-elevated-default: #202c33;
        --WDS-surface-elevated-emphasized: #2a3942;

        --WDS-content-deemphasized: #85959f;
        --WDS-content-action-default: #aebac1;
        --WDS-content-disabled: #617079;

        --WDS-systems-chat-background-wallpaper: #111b21;
        --WDS-systems-chat-surface-composer: #202c33;
        --WDS-systems-chat-surface-tray: #111b21;

        --WDS-systems-bubble-surface-system: #202c33;
        --WDS-systems-bubble-surface-incoming: #202c33;
        --WDS-systems-bubble-surface-incoming-RGB: 32, 44, 51;
        --WDS-systems-bubble-surface-outgoing-RGB: 0, 92, 75;

        div > div > div._alyo._alyw
        {
            --WDS-background-wash-inset: #111b21;
        }

        [data-icon="default-contact-refreshed"] *
        {
            --WDS-surface-elevated-emphasized: #6a7175;
            --WDS-content-deemphasized: #cfd4d6;
        }
    }

    /*Dark Theme 2025*/
    .dark.color-refresh *
    {
        --conversation-header-border: #2e2f2f;
        --conversation-panel-border: #222e35;

        --WDS-content-disabled: #626363;
    }
    `;

    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
}