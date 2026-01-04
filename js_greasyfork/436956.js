// ==UserScript==
// @name        Better Gallections alt
// @version     2.2.0
// @description Some visual updates to galleries and collections.
// @author      Valognir (https://www.deviantart.com/valognir)
// @namespace   https://greasyfork.org/en/scripts/404189-better-gallections
// @grant       GM_addStyle
// @run-at      document-start
// @match       https://www.deviantart.com/*
// @downloadURL https://update.greasyfork.org/scripts/436956/Better%20Gallections%20alt.user.js
// @updateURL https://update.greasyfork.org/scripts/436956/Better%20Gallections%20alt.meta.js
// ==/UserScript==


let css = `

    [data-hook^="gallection_folder_"] {
        padding: 0 !important;
        margin-bottom: 30px !important;
        height: 200px !important;
    }

    .theme-dark [data-hook^="gallection_folder_"] {
        color: var(--D8) !important;
    }

    .theme-light [data-hook^="gallection_folder_"] {
        color: var(--L8) !important;
    }

    [data-hook^="gallection_folder_"]>div:first-child,
    [data-hook^="gallection_folder_"]>div:first-child>div:first-child>div:nth-child(3),
    [data-hook^="gallection_folder_"]>div:first-child>div:first-child>div:nth-child(3)>img,
    [data-hook^="gallection_folder_"]>div:first-child>div:first-child>div:first-child,
    [data-hook^="gallection_folder_"]>div:first-child>div:first-child>div:first-child img,
    [data-hook^="gallection_folder_"]>div:first-child>div:first-child>section{
        width: 100% !important;
        height: 200px !important;
    }

    [data-hook^="gallection_folder_"]>div:last-child{
        position: absolute;
        padding: 0;
        margin-top: -70px !important;
        margin-left:-4px;
        width: 274px;
        background: none;
        transition: background .2s;
        transition-timing-function: ease;
    }

    [data-hook^="gallection_folder_"]>div:last-child:after{
        position: absolute;
        content: "";
        width: 0;
        height: 0;
        top: 100%;
        left: 0;
        border-style: solid;
        border-width: 0 4px 4px 0;
        border-color: transparent;
        border-right-color: var(--D5);
    }

    .theme-light [data-hook^="gallection_folder_"]>div:last-child{
        background-color: rgba(242,242,242,.2);
    }

    .light-green [data-hook^="gallection_folder_"]>div:last-child{
        background-color: rgba(230,237,228,.2);
    }

    .theme-dark [data-hook^="gallection_folder_"]:hover>div:last-child{
        background-color: rgba(6,7,13,.5);
    }

    .theme-light [data-hook^="gallection_folder_"]:hover>div:last-child{
        background-color: rgba(242,242,242,.7);
    }

    .light-green [data-hook^="gallection_folder_"]:hover>div:last-child{
        background-color: rgba(230,237,228,.7);
    }

    [data-hook^="gallection_folder_"]>div:last-child>div{
        margin: 0;
        padding: 5px;
    }

    [data-hook^="gallection_folder_"]>div:last-child>div:after{
        position: absolute;
        content: "";
        width: 274px;
        height: 1px;
        top: calc(100% - 1px);
        left: 0;
        background-image: linear-gradient(90deg,#5d5d6c, transparent)
    }

    .theme-dark [data-hook^="gallection_folder_"]>div:last-child>div{
        background-image: linear-gradient(90deg,#161a1f, transparent)
    }

    .theme-light [data-hook^="gallection_folder_"]>div:last-child>div{
        background-image: linear-gradient(90deg,#fff, transparent)
    }

    .light-green [data-hook^="gallection_folder_"]>div:last-child>div{
        background-image: linear-gradient(270deg,transparent,rgb(230,237,228));
    }

    #sub-folder-gallery {
        margin-top: -25px;
    }

    #sub-folder-gallery>div:first-child>div:first-child>div:first-child>div:first-child     {
        margin-top: -1px;
    }

    /* sub galleries */
    #sub-folder-gallery>div:first-child>div:first-child>div:first-child>div:nth-child(2) >div:nth-child(2)>div>div {
        height: 120px !Important;
        width: 100% !Important;
    }

    #sub-folder-gallery>div:first-child>div:first-child>div:first-child>div:nth-child(2) >div:nth-child(2)>div>div>div:first-child,
    #sub-folder-gallery>div:first-child>div:first-child>div:first-child>div:nth-child(2) >div:nth-child(2)>div>div>div:first-child>div:first-child,
    #sub-folder-gallery>div:first-child>div:first-child>div:first-child>div:nth-child(2) >div:nth-child(2)>div>div>div:first-child>div:first-child>img {
        height: 100px !Important;
        width: 140px !Important;
    }

    #sub-folder-gallery>div:first-child>div:first-child>div:first-child>div:nth-child(2) >div:nth-child(2)>div>div>div:first-child {
        width: 140px;
        justify-content: center;
        margin-top: 10px;
        margin-bottom: 0;
    }

    #sub-folder-gallery>div:first-child>div:first-child>div:first-child>div:nth-child(2) >div:nth-child(2)>div>div>div:first-child>div+div {
        display:none;
    }

    #sub-folder-gallery>div:first-child>div:first-child>div:first-child>div:nth-child(2) >div:nth-child(2)>div>div>div:last-child {
        width: 140px;
        justify-content: center;
        margin-top: -120px;
    }
`;

  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
