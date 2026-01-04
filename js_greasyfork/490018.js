// ==UserScript==
// @name         Lunebounce Theme
// @namespace    https://github.com/diary001/lunebounce
// @supportURL   https://discord.gg/pixel
// @license      MIT
// @version      1.0.11
// @description  This is the first theme for Moonbounce! I spent a few months working on this to make sure everything was perfected. This theme was created solely by me, so please do not message the Moonbonuce team for support. ((made with <3 by lune))
// @author       lune / linktr.ee/moon
// @match        *://*/*
// @icon         https://framerusercontent.com/images/iuVZmsE2sifPExZXNrETQrDkU.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490018/Lunebounce%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/490018/Lunebounce%20Theme.meta.js
// ==/UserScript==


(function () {
    "use strict";

    function checkPresence() {
      return (
        document.getElementById(
          "moonbounce-ext-container-mbheeaapbjpckahhciogfdodofjjldem"
        )?.shadowRoot != null
      );
    }

    function injectCSS() {
      const root = document.documentElement;

      root.style.setProperty("--lune-primary", "#44515a");
      root.style.setProperty("--lune-secondary", "#242c31");
      root.style.setProperty("--lune-tertiary", "#a0a6c525");
      root.style.setProperty("--lune-accent", "#aef0ff");
      root.style.setProperty("--lune-accent-alpha", "rgba(173, 240, 255, 0.2)");
      root.style.setProperty(
        "--lune-accent-alpha-alt",
        "rgba(173, 240, 255, 0.35)"
      );
      root.style.setProperty(
        "--lune-accent-alpha-alt2",
        "rgba(173, 240, 255, 0.5)"
      );
      root.style.setProperty("--lune-accent-dark", "#82e8ff");
      root.style.setProperty("--lune-accent-light", "#c8f5ff");
      root.style.setProperty(
        "--lune-accent-filter",
        "brightness(0) saturate(100%) invert(86%) sepia(9%) saturate(2201%) hue-rotate(171deg) brightness(107%) contrast(101%)"
      );

      const webApp = document.querySelector("body");

        const shadowRoot = document.querySelector(
            "div#moonbounce-ext-container-mbheeaapbjpckahhciogfdodofjjldem"
        )?.shadowRoot;

        const moonbouncePortal = document
        .querySelector(
            "div#moonbounce-ext-container-mbheeaapbjpckahhciogfdodofjjldem"
        )?.shadowRoot.querySelector("#MOONBOUNCE\\.PORTAL");

    if (!moonbouncePortal) {
        setTimeout(injectCSS, 500);
        return;
    }

      const styleElement1 = Object.assign(document.createElement("STYLE"), {
        textContent: `._base_n7zwr_1._light_n7zwr_14 {
                      background: var(--lune-secondary);
                  }`,
      });
      shadowRoot.append(styleElement1);

      const styleElement2 = Object.assign(document.createElement("STYLE"), {
        textContent: `._base_n7zwr_1 {
                      border: 2px solid var(--lune-primary);
                  }`,
      });
      shadowRoot.append(styleElement2);

      const styleElement3 = Object.assign(document.createElement("STYLE"), {
        textContent: `path {
                      fill: var(--lune-accent);
                  }`,
      });
      shadowRoot.append(styleElement3);

      const styleElement4 = Object.assign(document.createElement("STYLE"), {
        textContent: `._base_irauo_1 {
                      color: var(--lune-accent);
                  }`,
      });
      shadowRoot.append(styleElement4);

      const styleElement5 = Object.assign(document.createElement("STYLE"), {
        textContent: `._base_5l9jc_1 {
                      background-color: var(--lune-accent-alpha);
                  }`,
      });
      moonbouncePortal.append(styleElement5);

      const styleElement7 = Object.assign(document.createElement("STYLE"), {
        textContent: `._base_15xaj_1._small_15xaj_22 {
                      color: var(--lune-accent);
                  }`,
      });
      moonbouncePortal.append(styleElement7);

      const styleElement8 = Object.assign(document.createElement("STYLE"), {
        textContent: `._base_1htaw_1._secondary_1htaw_22._open_1htaw_27, ._base_1htaw_1._secondary_1htaw_22._closed_1htaw_30 {
                      background-color: var(--lune-primary);
                  }`,
      });
      shadowRoot.append(styleElement8);

      const styleElement9 = Object.assign(document.createElement("STYLE"), {
        textContent: `._base_1htaw_1._secondary_1htaw_22 {
                      border: 2px solid var(--lune-tertiary);
                  }`,
      });
      shadowRoot.append(styleElement9);

      const styleElement10 = Object.assign(document.createElement("STYLE"), {
        textContent: `._base_1htaw_1._secondary_1htaw_22:hover._open_1htaw_27 {
                      background-color: var(--lune-accent-alpha-alt);
                  }`,
      });
      shadowRoot.append(styleElement10);

      const styleElement11 = Object.assign(document.createElement("STYLE"), {
        textContent: `._base_1htaw_1._secondary_1htaw_22:hover {
                      background: var(--lune-primary);
                      border: 2px solid var(--lune-tertiary)
                  }`,
      });
      shadowRoot.append(styleElement11);

      const styleElement12 = Object.assign(document.createElement("STYLE"), {
        textContent: `._base_1b9zj_1 {
                      background-color: var(--lune-primary);
                      border: 2px solid var(--lune-tertiary);
                  }`,
      });
      shadowRoot.append(styleElement12);

      const styleElement13 = Object.assign(document.createElement("STYLE"), {
        textContent: `._base_1enru_1 {
                      color: var(--lune-accent);
                  }`,
      });
      shadowRoot.append(styleElement13);

      const styleElement14 = Object.assign(document.createElement("STYLE"), {
        textContent: `._base_1jhq3_1 {
                      background-color: var(--lune-secondary);
                      border: 2px solid var(--lune-primary);
                  }`,
      });
      shadowRoot.append(styleElement14);

      const styleElement15 = Object.assign(document.createElement("STYLE"), {
        textContent: `._middle_chat_18nkb_44 {
                      background-color: var(--lune-secondary);
                  }`,
      });
      shadowRoot.append(styleElement15);

      const styleElement16 = Object.assign(document.createElement("STYLE"), {
        textContent: `._base_bkmm0_1 {
                      background-color: var(--lune-secondary);
                  }`,
      });
      shadowRoot.append(styleElement16);

      const styleElement17 = Object.assign(document.createElement("STYLE"), {
        textContent: `._container_k54cr_1._chat_k54cr_48 {
                      background: var(--lune-secondary);
                  }`,
      });
      shadowRoot.append(styleElement17);

      const styleElement18 = Object.assign(document.createElement("STYLE"), {
        textContent: `._container_k54cr_1 {
                      border: 2px solid var(--lune-tertiary);
                  }`,
      });
      shadowRoot.append(styleElement18);

      const styleElement19 = Object.assign(document.createElement("STYLE"), {
        textContent: `::placeholder {
                      color: var(--lune-accent);
                  }`,
      });
      shadowRoot.append(styleElement19);

      const styleElement20 = Object.assign(document.createElement("STYLE"), {
        textContent: `._h1_gfeel_1 {
                      color: var(--lune-accent-light);
                  }`,
      });
      shadowRoot.append(styleElement20);

      const styleElement21 = Object.assign(document.createElement("STYLE"), {
        textContent: `._p_7k6zl_1._small_7k6zl_6 {
                      color: var(--lune-accent);
                  }`,
      });
      shadowRoot.append(styleElement21);

      const styleElement22 = Object.assign(document.createElement("STYLE"), {
        textContent: `._button_eftbh_1._tertiary_eftbh_36 {
                      color: var(--lune-accent);
                  }`,
      });
      shadowRoot.append(styleElement22);

      const styleElement23 = Object.assign(document.createElement("STYLE"), {
        textContent: `._neutral-500_128i6_721 {
                      color: var(--lune-tertiary) !important;
                  }`,
      });
      shadowRoot.append(styleElement23);

      const styleElement24 = Object.assign(document.createElement("STYLE"), {
        textContent: `._button_eftbh_1._tertiary_eftbh_36:hover {
                      background: var(--lune-tertiary);
                  }`,
      });
      shadowRoot.append(styleElement24);

      const styleElement25 = Object.assign(document.createElement("STYLE"), {
        textContent: `._line_18nkb_99 {
                      background: var(--lune-primary);
                  }`,
      });
      shadowRoot.append(styleElement25);

      const styleElement26 = Object.assign(document.createElement("STYLE"), {
        textContent: `._button_eftbh_1._quaternary_eftbh_53 {
                      color: var(--lune-accent);
                      border: 1px solid var(--lune-primary)
                  }`,
      });
      shadowRoot.append(styleElement26);

      const styleElement27 = Object.assign(document.createElement("STYLE"), {
        textContent: `._text-sm_128i6_60 {
                      color: var(--lune-accent);
                  }`,
      });
      shadowRoot.append(styleElement27);

      const styleElement28 = Object.assign(document.createElement("STYLE"), {
        textContent: `._base_1pfp4_1 {
                      background: var(--lune-tertiary);
                  }`,
      });
      shadowRoot.append(styleElement28);

      const styleElement29 = Object.assign(document.createElement("STYLE"), {
        textContent: `._button_1pfp4_31:hover, ._base_1pfp4_1:hover {
                      background: var(--lune-accent-alpha);
                  }`,
      });
      shadowRoot.append(styleElement29);

      const styleElement30 = Object.assign(document.createElement("STYLE"), {
        textContent: `._display_name_1pfp4_14 {
                      color: var(--lune-accent);
                  }`,
      });
      shadowRoot.append(styleElement30);

      const styleElement31 = Object.assign(document.createElement("STYLE"), {
        textContent: `._base_4468k_1._online_4468k_11 {
                      background: var(--lune-accent-light);
                  }`,
      });
      shadowRoot.append(styleElement31);

      const styleElement32 = Object.assign(document.createElement("STYLE"), {
        textContent: `._base_4468k_1._offline_4468k_15 {
                      background: var(--lune-accent-dark);
                  }`,
      });
      shadowRoot.append(styleElement32);

      const styleElement33 = Object.assign(document.createElement("STYLE"), {
        textContent: `._middle_chat_18nkb_44::-webkit-scrollbar {
                      background-color: var(--lune-secondary);
                  }`,
      });
      shadowRoot.append(styleElement33);

      const styleElement34 = Object.assign(document.createElement("STYLE"), {
        textContent: `._middle_chat_18nkb_44::-webkit-scrollbar-thumb {
                      background: linear-gradient(180deg,var(--lune-accent) 9.35%,var(--lune-tertiary) 91.32%);
                  }`,
      });
      shadowRoot.append(styleElement34);

      const styleElement35 = Object.assign(document.createElement("STYLE"), {
        textContent: `._middle_chat_18nkb_44::-webkit-scrollbar-track {
                      background-color: var(--lune-tertiary);
                  }`,
      });
      shadowRoot.append(styleElement35);

      const styleElement36 = Object.assign(document.createElement("STYLE"), {
        textContent: `._button_eftbh_1 {
                      background: var(--lune-accent-alpha-alt2);
                      border: 2px solid var(--lune-accent-alpha);
                      color: var(--lune-accent);
                  }`,
      });
      shadowRoot.append(styleElement36);

      const styleElement37 = Object.assign(document.createElement("STYLE"), {
        textContent: `._button_eftbh_1:hover {
                      background: var(--lune-accent-alpha);
                      border: 2px solid var(--lune-accent-alpha-alt2);
                  }`,
      });
      shadowRoot.append(styleElement37);

      const styleElement38 = Object.assign(document.createElement("STYLE"), {
        textContent: `._button_1pfp4_31 {
                      background: var(--lune-tertiary);
                      border: 1px solid var(--lune-tertiary);
                  }`,
      });
      shadowRoot.append(styleElement38);

      const styleElement39 = Object.assign(document.createElement("STYLE"), {
        textContent: `._button_eftbh_1._quaternary_eftbh_53:hover {
                      background: transparent;
                      color: var(--lune-accent);
                      border: 1px solid var(--lune-tertiary);
                      fill: var(--lune-accent);
                  }`,
      });
      shadowRoot.append(styleElement39);

      const styleElement40 = Object.assign(document.createElement("STYLE"), {
        textContent: `._button_eftbh_1._quaternary_eftbh_53:focus {
                      background: transparent;
                      color: var(--lune-accent);
                      border: 1px solid var(--lune-tertiary);
                  }`,
      });
      shadowRoot.append(styleElement40);

      const styleElement41 = Object.assign(document.createElement("STYLE"), {
        textContent: `._button_eftbh_1._quaternary_eftbh_53._quaternary_eftbh_53:hover path {
                      fill: var(--lune-accent);
                  }`,
      });
      shadowRoot.append(styleElement41);

      const styleElement42 = Object.assign(document.createElement("STYLE"), {
        textContent: `._button_eftbh_1._quaternary_eftbh_53._quaternary_eftbh_53:focus path {
                      fill: var(--lune-accent);
                  }`,
      });
      shadowRoot.append(styleElement42);

      const styleElement43 = Object.assign(document.createElement("STYLE"), {
        textContent: `._container_k54cr_1:hover {
                      border-color: var(--lune-tertiary);
                  }`,
      });
      shadowRoot.append(styleElement43);

      const styleElement44 = Object.assign(document.createElement("STYLE"), {
        textContent: `._base_1oq08_1 {
                      color: var(--lune-accent);
                  }`,
      });
      shadowRoot.append(styleElement44);

      const styleElement45 = Object.assign(document.createElement("STYLE"), {
        textContent: `._middle_18nkb_19 {
                      background-color: transparent;
                  }`,
      });
      shadowRoot.append(styleElement45);

      const styleElement46 = Object.assign(document.createElement("STYLE"), {
        textContent: `._display_name_1cunu_13 {
                      color: var(--lune-accent);
                  }`,
      });
      shadowRoot.append(styleElement46);

      const styleElement47 = Object.assign(document.createElement("STYLE"), {
        textContent: `._message_1cunu_29 {
                      color: var(--lune-accent-light);
                  }`,
      });
      shadowRoot.append(styleElement47);

      const styleElement48 = Object.assign(document.createElement("STYLE"), {
        textContent: `._base_10uj4_1 {
                      background: var(--lune-secondary);
                      border: 2px solid var(--lune-primary);
                  }`,
      });
      shadowRoot.append(styleElement48);

      const styleElement49 = Object.assign(document.createElement("STYLE"), {
        textContent: `._base_fzk0m_1._warning_fzk0m_14 {
                      background: var(--lune-accent-alpha-alt2);
                      border: 10px solid var(--lune-accent-alpha);
                  }`,
      });
      shadowRoot.append(styleElement49);

      const styleElement50 = Object.assign(document.createElement("STYLE"), {
        textContent: `._h1_wlk5u_1 {
                      color: var(--lune-accent);
                  }`,
      });
      shadowRoot.append(styleElement50);

      const styleElement51 = Object.assign(document.createElement("STYLE"), {
        textContent: `_p_1hyge_1 _small_1hyge_18 {
                      color: var(--lune-accent-light);
                  }`,
      });
      shadowRoot.append(styleElement51);

      const styleElement52 = Object.assign(document.createElement("STYLE"), {
        textContent: `._button_eftbh_1._secondary_eftbh_27 {
                      background: var(--lune-accent-alpha-alt2);
                      border: 2px solid var(--lune-accent-alpha);
                      color: var(--lune-accent);
                  }`,
      });
      shadowRoot.append(styleElement52);

      const styleElement53 = Object.assign(document.createElement("STYLE"), {
        textContent: `._base_10uj4_1 {
                      background: var(--lune-secondary);
                      border: 2px solid var(--lune-primary);
                  }`,
      });
      shadowRoot.append(styleElement53);

      const styleElement54 = Object.assign(document.createElement("STYLE"), {
        textContent: `._base_fzk0m_1._info_fzk0m_27 {
                      background: var(--lune-accent-alpha-alt2);
                      border: 10px solid var(--lune-accent-alpha);
                  }`,
      });
      shadowRoot.append(styleElement54);

      const styleElement55 = Object.assign(document.createElement("STYLE"), {
        textContent: `._h1_wlk5u_1 {
                      color: var(--lune-accent);
                  }`,
      });
      shadowRoot.append(styleElement55);

      const styleElement56 = Object.assign(document.createElement("STYLE"), {
        textContent: `._p_1hyge_1._small_1hyge_18 {
                      color: var(--lune-accent-light);
                  }`,
      });
      shadowRoot.append(styleElement56);

      const styleElement57 = Object.assign(document.createElement("STYLE"), {
        textContent: `._button_eftbh_1._secondary_eftbh_27:hover {
                      background: var(--lune-accent-alpha);
                      border: 2px solid var(--lune-accent-alpha-alt2);
                  }`,
      });
      shadowRoot.append(styleElement57);

      const styleElement58 = Object.assign(document.createElement("STYLE"), {
        textContent: `._base_h9f2n_1 {
                      background-color: var(--lune-secondary);
                      border: 2px solid var(--lune-tertiary);
                  }`,
      });
      shadowRoot.append(styleElement58);

      const styleElement59 = Object.assign(document.createElement("STYLE"), {
        textContent: `._base_vq53y_1 {
                      background-color: var(--lune-tertiary);
                  }`,
      });
      shadowRoot.append(styleElement59);

      const styleElement60 = Object.assign(document.createElement("STYLE"), {
        textContent: `._base_1p6ux_1 ._username_1p6ux_54, ._base_1p6ux_1 ._website_1p6ux_55 {
                      color: var(--lune-accent);
                  }`,
      });
      shadowRoot.append(styleElement60);

      const styleElement61 = Object.assign(document.createElement("STYLE"), {
        textContent: `._base_1p6ux_1 ._action_1p6ux_70 {
                      color: var(--lune-accent-light);
                  }`,
      });
      shadowRoot.append(styleElement61);

      const styleElement62 = Object.assign(document.createElement("STYLE"), {
        textContent: `._base_1p6ux_1 ._title_1p6ux_4 {
                      color: var(--lune-accent);
                  }`,
      });
      shadowRoot.append(styleElement62);

      const styleElement63 = Object.assign(document.createElement("STYLE"), {
        textContent: `._base_1p6ux_1 ._subtitle_1p6ux_18 {
                      color: var(--lune-accent-light);
                  }`,
      });
      shadowRoot.append(styleElement63);

      const styleElement64 = Object.assign(document.createElement("STYLE"), {
        textContent: `._base_1p6ux_1 ._link_1p6ux_33 {
                      color: var(--lune-accent-dark);
                  }`,
      });
      shadowRoot.append(styleElement64);

      const styleElement65 = Object.assign(document.createElement("STYLE"), {
        textContent: `._base_1blj3_1._secondary_1blj3_51 {
                      background: var(--lune-accent-alpha);
                      border-color: var(--lune-accent-alpha-alt);
                      color: var(--lune-accent);
                  }`,
      });
      shadowRoot.append(styleElement65);

      const styleElement66 = Object.assign(document.createElement("STYLE"), {
        textContent: `._middle_18nkb_19::-webkit-scrollbar {
                      background-color: var(--lune-secondary);
                  }`,
      });
      shadowRoot.append(styleElement66);

      const styleElement67 = Object.assign(document.createElement("STYLE"), {
        textContent: `._middle_18nkb_19::-webkit-scrollbar-thumb {
                      background: linear-gradient(180deg,var(--lune-accent) 9.35%,var(--lune-tertiary) 91.32%);
                  }`,
      });
      shadowRoot.append(styleElement67);

      const styleElement68 = Object.assign(document.createElement("STYLE"), {
        textContent: `._middle_18nkb_19::-webkit-scrollbar-track {
                      background-color: var(--lune-tertiary);
                  }`,
      });
      shadowRoot.append(styleElement68);

      const styleElement69 = Object.assign(document.createElement("STYLE"), {
        textContent: `._notif_1htaw_79 {
                      background-color: var(--lune-accent);
                  }`,
      });
      shadowRoot.append(styleElement69);

      const styleElement70 = Object.assign(document.createElement("STYLE"), {
        textContent: `@keyframes _pulse_1htaw_1 {
                      0% {
                        box-shadow: 0 0 var(--lune-accent-alpha);
                      }
                      70% {
                        box-shadow: 0 0 0 10px var(--lune-accent-alpha-alt);
                      }
                      100% {
                        box-shadow: 0 0 var(--lune-accent-alpha-alt2);
                      }
                  }`,
      });
      shadowRoot.append(styleElement70);

      const styleElement71 = Object.assign(document.createElement("STYLE"), {
        textContent: `._success_container_mdpvo_131 {
                      background: var(--lune-accent-alpha-alt);
                  }`,
      });
      shadowRoot.append(styleElement71);

      const styleElement72 = Object.assign(document.createElement("STYLE"), {
        textContent: `._neutral-800_128i6_730 {
                      color: var(--lune-accent);
                  }`,
      });
      shadowRoot.append(styleElement72);

      const styleElement73 = Object.assign(document.createElement("STYLE"), {
        textContent: `._base_1d537_1 {
                      color: var(--lune-accent);
                  }`,
      });
      shadowRoot.append(styleElement73);

      const styleElement74 = Object.assign(document.createElement("STYLE"), {
        textContent: `._new_chat_indicator_18nkb_142 {
                      background-color: var(--lune-accent-alpha);
                      color: var(--lune-accent-dark);
                      border: 2px solid var(--lune-accent-alpha);
                  }`,
      });
      shadowRoot.append(styleElement74);

      const styleElement75 = Object.assign(document.createElement("STYLE"), {
        textContent: `._base_lt12z_1 {
                      color: var(--lune-accent);
                  }`,
      });
      shadowRoot.append(styleElement75);

        const observer = new MutationObserver(() => {
            const lune = moonbouncePortal.querySelectorAll("._base_15xaj_1._small_15xaj_22, ._base_irauo_1, ._display_name_1cunu_13, ._display_name_1pfp4_14, ._base_1p6ux_1 ._username_1p6ux_54, ._base_1p6ux_1 ._website_1p6ux_55");
            lune.forEach(node => {
                if (node.textContent.includes("lunebounce :3")) {
                    node.style.backgroundImage = "url('https://i.ibb.co/47v9bVs/U0hpDMb.gif')";
                    node.style.textShadow = "0 0 1px #fff, 0 0 3px #aef0ff, 0 0 5px #aef0ff, 0 0 8px #aef0ff, 0 0 10px #aef0ff, 0 0 12px #aef0ff";
                    node.style.webkitTextFillColor = "transparent";
                }
            });

            const lune2 = shadowRoot.querySelectorAll(":not(iframe):not(script)");
            lune2.forEach(node => {
                if (node.textContent.includes("lunebounce :3")) {
                }
            });

            const lune3 = webApp.querySelectorAll("._neutral-700_128i6_727, ._base_irauo_1");
            lune3.forEach(node => {
                if (node.textContent.includes("lunebounce :3")) {
                    node.style.backgroundImage = "url('https://i.ibb.co/47v9bVs/U0hpDMb.gif')";
                    node.style.textShadow = "0 0 1px #fff, 0 0 3px #aef0ff, 0 0 5px #aef0ff, 0 0 8px #aef0ff, 0 0 10px #aef0ff, 0 0 12px #aef0ff";
                    node.style.webkitTextFillColor = "transparent";
                }
            });

            const oraithe = moonbouncePortal.querySelectorAll("._base_15xaj_1._small_15xaj_22, ._base_irauo_1, ._display_name_1cunu_13, ._display_name_1pfp4_14, ._base_1p6ux_1 ._username_1p6ux_54, ._base_1p6ux_1 ._website_1p6ux_55");
            oraithe.forEach(node => {
                if (node.textContent.includes("Óraithe")) {
                    node.style.background = "-webkit-linear-gradient(left, #F37607, #07DAF3)";
                    node.style.webkitBackgroundClip = "text";
                    node.style.webkitTextFillColor = "transparent";
                }
            });

            const oraithe2 = shadowRoot.querySelectorAll(":not(iframe):not(script)");
            oraithe2.forEach(node => {
                if (node.textContent.includes("Óraithe")) {
                }
            });

            const oriathe3 = webApp.querySelectorAll("._neutral-700_128i6_727, ._base_irauo_1");
            oriathe3.forEach(node => {
                if (node.textContent.includes("Óraithe")) {
                    node.style.background = "-webkit-linear-gradient(left, #F37607, #07DAF3)";
                    node.style.webkitBackgroundClip = "text";
                    node.style.webkitTextFillColor = "transparent";
                }
            });

            const wyv = moonbouncePortal.querySelectorAll("._base_15xaj_1._small_15xaj_22, ._base_irauo_1, ._display_name_1cunu_13, ._display_name_1pfp4_14, ._base_1p6ux_1 ._username_1p6ux_54, ._base_1p6ux_1 ._website_1p6ux_55");
            wyv.forEach(node => {
                if (node.textContent.includes("wyv")) {
                    node.style.background = "-webkit-radial-gradient(center, #000, #000)";
                    node.style.textShadow = "0 0 15px #000, 0 0 18px #000, 0 0 21px #000";
                    node.style.webkitBackgroundClip = "text";
                    node.style.webkitTextFillColor = "transparent";
                }
            });

            const wyv2 = shadowRoot.querySelectorAll(":not(iframe):not(script)");
            wyv2.forEach(node => {
                if (node.textContent.includes("wyv")) {
                }
            });

            const wyv3 = webApp.querySelectorAll("._neutral-700_128i6_727, ._base_irauo_1");
            wyv3.forEach(node => {
                if (node.textContent.includes("wyv")) {
                    node.style.background = "-webkit-radial-gradient(center, #000, #000)";
                    node.style.textShadow = "0 0 15px #000, 0 0 18px #000, 0 0 21px #000";
                    node.style.webkitBackgroundClip = "text";
                    node.style.webkitTextFillColor = "transparent";
                }
            });

        });

        observer.observe(moonbouncePortal, { childList: true, subtree: true });

    }

    async function runner() {
      const timeStart = performance.now();
      //console.log("%cAttempting to load shadow-root...", "background: #44515a; color: #aef0ff; font-size: x-large");
      let exists = checkPresence();
      if (!exists) return setTimeout(runner, 500);
      const timeEnd = performance.now();
      //console.log("%cShadow-root took " + (timeEnd - timeStart) + "ms to load.", "background: #44515a; color: #aef0ff; font-size: x-large");

      // inject css
      //console.log("%cInjecting CSS...", "background: #44515a; color: #aef0ff; font-size: x-large");
      injectCSS();
      //console.log("%cCSS injected.", "background: #44515a; color: #aef0ff; font-size: x-large");
      setTimeout(() => console.log("%c((made with <3 by lune))", "background: #44515a; color: #aef0ff; font-size: x-large; font-style: italic"), 1200);
    }

    runner();
  })();
