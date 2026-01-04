// ==UserScript==
// @name Nomi Dark Theme
// @namespace https://gitlab.com/breatfr
// @version 1.35.0
// @description Dark theme for Nomi.
// @author BreatFR (https://breat.fr)
// @homepageURL https://gitlab.com/breatfr/nomi
// @supportURL https://discord.com/channels/1099791840028405864/1138872233641652364
// @license AGPL-3.0-or-later; https://www.gnu.org/licenses/agpl-3.0.txt
// @grant GM_addStyle
// @run-at document-start
// @match *://*.nomi.ai/*
// @downloadURL https://update.greasyfork.org/scripts/486629/Nomi%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/486629/Nomi%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
let css = `
        /* ========================================================================
       Bigger chat font size
     ======================================================================= */
    .css-2hr7pt,
    .css-3td3fo,
    .css-d56yar {
        font-size: 20px;
    }

    /* ========================================================================
       Remove logo at the top left corner
     ======================================================================= */
    .css-zkgx86, /* Remove logo */
    .css-e2xlbb.el09qsr0 > div:nth-of-type(1) /* Remove border under removed logo */{
        display: none;
    }

    /* ========================================================================
       Heart background
     ======================================================================= */
    .css-1vi0cy8 {
        background: url(https://i.ibb.co/fYQkYyc/heart-pattern.png) fixed 100% !important;
        border-radius: 0px 0px 20px 20px;
    }

    /* ========================================================================
       Thin scrollbars for normally all browsers
     ======================================================================= */
    ::-webkit-scrollbar {
      width: 5px;
    }

    ::-webkit-scrollbar-track {
      box-shadow: inset 0 0 5px grey; 
      border-radius: 20px;
    }

    ::-webkit-scrollbar-thumb {
      background: pink;
      border-radius: 20px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: white; 
    }

    /* ========================================================================
       Bigger image in picture viewer
     ======================================================================= */
    .css-staxus {
        height: 100% !important;
    }

    /* ========================================================================
       Textarea customization
     ======================================================================= */
    @keyframes gradient {
        0% {
            background-position: 0% 50%;
        }
        100% {
            background-position: 100% 50%;
        }
    }

    textarea:not(:focus) {
        animation: gradient 5s ease infinite;
        animation-fill-mode: forwards !important;
        background-image: linear-gradient(90deg, rgba(58,180,133,0.14066876750700286) 0%, rgba(89,98,140,0.16307773109243695) 21%, rgba(253,29,29,0.16307773109243695) 43%, rgba(218,41,141,0.16867997198879547) 65%, rgba(183,53,252,0.24711134453781514) 80%, rgba(252,176,69,0.3031337535014006) 100%);
        background-size: 200% 200%;
        color: #2f343d !important;
    }

    textarea:focus {
        animation: gradient 5s ease infinite;
        animation-fill-mode: forwards !important;
        background-image: linear-gradient(90deg, rgba(58,180,133,0.14066876750700286) 0%, rgba(89,98,140,0.16307773109243695) 21%, rgba(253,29,29,0.16307773109243695) 43%, rgba(218,41,141,0.16867997198879547) 65%, rgba(183,53,252,0.24711134453781514) 80%, rgba(252,176,69,0.3031337535014006) 100%);
        background-size: 200% 200%;
        border-color: #9610FF !important;
        color: var(--toastify-color-light) !important;
    }

    /* Fix texarea to always stay on screen */
    .css-1ooloxp {
        position: sticky !important;
    }

    /* Make textarea to grow to the top and not to the down and add rouned corners */
    .css-d56yar {
        border-radius: 20px;
        min-height: 56px;
        resize: vertical !important;
    }

    /* Hide the resizer of the textarea */
    textarea::-webkit-resizer {
        display: none;
    }

    /* ========================================================================
       Height of menu
     ======================================================================= */
    .css-udmu36 {
        border-top: 0px !important;
        min-height: 85px;
        max-height: 85px;
        padding: 0px !important;
    }

    /* Little bigger font-size in menu */
    .css-1pqzh7c {
        font-size: 14px;
    }

    /* ========================================================================
       Nomi's names list in left side
     ======================================================================= */
    /* Smaller names */
    .css-5f4tlo {
        line-height: 100%;
        padding: 10px 0px;
    }

    /* Nomi's name and pictures link, infos link SVG are pink in left side of chat page */
    .css-5f4tlo h4,
    .css-5f4tlo svg path {
        color: pink !important;
        stroke: pink;
    }

    /* Remove borders between nomis list if more than 1 nomi */
    .css-nzao1s.eawisc75 div {
        border: 0px !important;
    }

    /* ========================================================================
       Pictures are in row in chat
     ======================================================================= */
    .css-1cwe3m3 {
        display: grid;
        gap: 8px;
        grid-template-columns: repeat(4, 1fr);
        justify-items: center;
    }

    /* ========================================================================
       Add rounded corners to pics in chat and photo album page
     ======================================================================= */
    .e129scxq2,
    .css-yb98gs {
        border-radius: 20px !important;
    }

    /* ========================================================================
       Replace the "Profile picture" overlay photo album page by a border
     ======================================================================= */
    .css-yb98gs {
        background: transparent !important;
        border: 5px solid rgb(171, 64, 255);
    }

    .css-1gp3erv:hover {
        transform: scale(1.9) !important;
        transition: 0.2s linear !important;
        z-index: 9999 !important;
    }

    .css-yb98gs p {
        display: none;
    }

    /* ========================================================================
       Image zoom on hover in picture viewer page
     ======================================================================= */
    .css-1mh151z:hover {
        display: block;
        max-height: 93%;
        transform: scale(1.25);
        transition: 0.2s linear;
    }

    /* ========================================================================
       Dark theme
     ======================================================================= */
    /* Light color for all texts */
    * {
        color: var(--toastify-color-light) !important;
    }

    /* Dark background color on whole page */
    body,
    input,
    select,
    --toastify-spinner-color-empty-area,
    ul.css-497xvz,
    .css-18rjz9j,
    .css-ea8az7,
    .css-1j5d3ll,
    .css-8oy3d3,
    .css-1j19l95,
    .css-mcumek,
    .css-9i2gok,
    .css-7fgif5,
    .css-13esyrq,
    .css-1n084m6,
    .css-vtzx0o,
    .css-1l1u68n,
    .css-i616ue,
    .css-1d7lv4w,
    .react-datepicker__month-container,
    .react-datepicker__header,
    .css-1je5qdk,
    .css-1ejta19,
    .css-1n084m6,
    .css-u5iji2,
    .css-1oeraiw,
    .css-1ooloxp {
        background-color: rgb(9, 16, 29) !important;
    }

    /* Remove border on pop up for selfie request */
    .css-wwpt19 {
        border: 0px !important;
    }

    /* Nomi.ai color in menu */
    .css-g6cz36 {
        color: rgb(150, 16, 255) !important;
    }

    /* SVG are white */
    svg path {
        stroke: white;
    }

    .css-1u2l9gp svg path {
        stroke: rgb(9, 16, 29);
    }

    /* Fix spinner */
    .css-1iw9n18 svg path {
        stroke: none;
    }

    /* Fix SVG menu */
    .css-i3pbo svg path,
    .css-vo6oh1 svg path,
    /* Fix SVG customization */
    .css-1v8aab4 svg path,
    .css-1o5vjud svg path,
    /* Fix SVG loading */
    .css-1j0l6xk svg path {
        stroke: rgb(150, 16, 255);
    }

    /* Fix camera button */
    .css-1x4dmv7 svg path {
        fill: rgb(150, 16, 255);
    }

    /* Make logout SVG and text red again */
    .css-1rv67vh,
    .css-1hmb4pn svg path,
    /* Make delete image SVG red */
    .css-l9wrht svg path {
        color: #e74c3c !important;
        fill: #e74c3c;
    }

    /* Delete account button */
    .css-1yp80wt {
        align-items: center;
        background-color: rgb(247, 85, 85);
        border: 2px solid rgb(247, 85, 85);
        border-radius: 100px;
        display: flex;
        font-size: 16px;
        font-weight: 600;
        height: 58px;
        letter-spacing: 0.2px;
        line-height: 22px;
        padding: 18px 32px;    
    }

    /* Delete Nomi buttons */
    button.css-8as6rk,
    .css-a6rva7 button {
        background-color: #e74c3c !important;
        color: white !important;
    }

    /* Fix SVG on nomi details page when hover */
    .css-bxdqnu:hover svg path {
        fill: white;
    }

    /* Fix some buttons and bubbles to make them more visible */
    .css-9i2gok,
    .css-hsqzc1,
    .css-1qvkgqq,
    .css-bxdqnu:hover /* Fix nomi details page hover */ {
        background-color: gray !important;
    }

    /* Blue background for the Welcome bubble */
    .css-1y64612 > :last-child {
        background: var(--toastify-color-info) !important;
    }

    /* Titles on new nomi page */
    h5.css-124mhq6 {
        background: transparent!important;
        color: var(--toastify-color-light) !important;
    }

    /* Selfie notifications */
    .Toastify__zoom-enter svg path,
    .Toastify__zoom-error svg path,
    .Toastify__toast-theme--light,
    .Toastify__toast-body,
    /* Fix bubble during selfie is taking to make her more visible */
    .css-12kxn86,
    .css-kkk4zb {
        background: #616161 !important;
        stroke: none;
    }

    /* Make "Send" button and "Delete Nomi Forever" visible again when disabled */
    .css-8as6rk:disabled,
    .css-12a128q:disabled,
    .css-1x4dmv7:disabled svg path {
        background-color: gray !important;
        cursor: not-allowed !important;
        fill: gray;
    }

    /* Date bubble */
    .css-ygnlmt {
        background-color: transparent !important;
        display: inline-block;
        padding: 0 10px;
        position: relative;
    }

    .css-ygnlmt::before,
    .css-ygnlmt::after {
        background-color: white;
        content: "";
        height: 2px;
        position: absolute;
        top: 20%;
        width:100%;
    }

    .css-ygnlmt::before {
        left: 0;
        transform: translate(-100%);
    }

    .css-ygnlmt::after {
        transform: translate(100%);
        right: 0;
    }

    /* Make send button visible again when disabled */
    .css-ntdqfs:disabled,
    .css-1x4dmv7:disabled {
        background-color: gray !important;
        cursor: not-allowed !important;
    }

    /* Our bubbles color */
    .css-3td3fo, /* Our bubbles color mobile */
    .css-13w4jtb {
        background: linear-gradient(to right, #3a6186, #89253e);
        border-radius: 20px 8px 20px 20px;
    }

    /* Replace thumbs background and remove borders */
    .css-16hofwr {
        background-color: transparent;
        border: 0px !important;
    }

    /* Put a background under unclicked thumbs */
    .css-d3fk4o {
        background: rgb(9, 16, 29) !important;
        border: 0px !important;
    }

    /* Remove background under clicked thumbs */
    .css-vocaqi {
        background-color: transparent !important;
        border: 0px !important;
    }

    /* Change background color under unclicked thumbs when hover */
    .css-d3fk4o:hover {
        background-color: #eeeeee !important;
    }

    /* Remove the border on top of the left side */
    .css-e2xlbb.e1fc4ty00 > div:nth-of-type(1) {
        display: none;
    }

    @media (max-width: 1500px) {
        /* Put profile pic in full size without going in album */
        .css-e2xlbb,
        .css-nzao1s {
            border-right: 0px;
            max-width: 768px;
            margin: 0px;
            padding: 0px 0px 0px 2px !important;
        }

        /* Remove free space on screen size 640px and more and rearrange a little the space */
        .css-1fswsvh {
            margin-left: min(25vw, 480px);
            padding-right: 10px;
        }

        /* Hide scrollbar but keep the function */
        .css-1htcw6x {
            scrollbar-width: none;
            -ms-overflow-style: none;
        }

        .css-1htcw6x::-webkit-scrollbar {
            display: none;
        }

        .css-1fswsvh {
            padding: 0px 10px 0px 10px;
        }

        /* "Current Profile Picture" button on picture viewer page is less opaque */
        .css-1i76af2 {
            opacity: 0.5;
        }

        /* Nomi's answers */
        .css-2hr7pt, /* Nomi's bubbles color mobile */
        .css-afkp3z, /* Nomi's bubbles color */
        .css-1ve1qsh /* Nomi's bubbles color when she answer */ {
            background: linear-gradient(to right, #cc2b5e, #753a88);
            border-radius: 8px 20px 20px 20px !important;
            margin-left: 10px !important;
        }

        /* Add space between form elements */
        form {
            gap: 10px;
        }
    }

    @media (min-width: 1500px) {
        /* Fix bar position with Nomi's name, photo album and infos links at the top */
        .css-5f4tlo {
            background: rgb(9, 16, 29) !important;
            position: sticky;
            top: 0px !important;
            z-index: 9999;
        }

        .css-s37f8j {
            overflow-y: scroll;
        }

        /* Put profile pic in full size without going in album */
        .css-1htcw6x,
        .css-e2xlbb,
        .css-nzao1s {
            border-right: 0px;
            margin: 0px !important;
            max-width: 770px;
            padding: 0px 0px 0px 2px !important;
            width: 770px;
        }

        .css-1fswsvh {
            margin-left: 770px;
            padding: 0px 10px 0px 0px;
        }

        /* Remove space between chat and textarea */
        .css-1vi0cy8 {
            gap: 0px !important;
            margin-bottom: 10px;
        }

        .e1rpo1t71 {
            margin-top: 25px !important;
        }

        .css-1tyfq5e {
            height: 0px;
        }

        /* "Current Profile Picture" button on picture viewer page is less opaque and got a little marge under him */
        .css-1i76af2 {
            margin-bottom: 10px;
            opacity: 0.5;
        }

        /* Add a round corner to the div on profile pic */
        .css-1htcw6x {
            border-radius: 0px  0px 20px 20px !important;
        }

        /* Hide scrollbar but keep the function */
        .css-s37f8j,
        .css-1htcw6x {
            scrollbar-width: none;
            -ms-overflow-style: none;
        }

        .css-s37f8j::-webkit-scrollbar,
        .css-1htcw6x::-webkit-scrollbar {
            display: none;
        }

        /* Nomi's answer */
        .css-3fim88 {
            margin-left: 10px !important;
        }

        .css-2hr7pt, /* Nomi's bubbles color mobile */
        .css-afkp3z, /* Nomi's bubbles color */
        .css-1ve1qsh /* Nomi's bubbles color when she answer */ {
            background: linear-gradient(to right, #cc2b5e, #753a88);
            border-radius: 8px 20px 20px 20px !important;
            margin-left: 10px !important;
        }

        /* Add space between form elements */
        form {
            gap: 10px;
            padding: 0px 0px 0px 10px !important;
        }

        .css-alqmgy {
            gap: 10px;
        }

        /* ========================================================================
        Home page customization to avoid scroll bar
        ======================================================================= */
        /* Avatar, name, hello message, beta alert message go on left side */
        .css-1g4jhqi {
            left: 0px;
            position: fixed;    
            top: 0px;
            width: 25vw;
        }

        .css-1g4jhqi img {
            border-radius: 5px;
            left: 10px;
            position: fixed;
            top: 10px;
        }

        .css-1y64612 {
            display: block;
            left: 0px;
            position: fixed;
            top: 100px;
            width: 25vw;
        }

        .css-1gqy2tx {
            display: block;
            left: 70px;
            position: fixed;
            top: 10px !important;
        }

        /* Nomi list */
        .css-cnprv6,
        .css-1pb0fgy {
            margin: 3% 0px 0px 70px;
            padding: 0px;
            width: 60vw !important;
        }
    }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
