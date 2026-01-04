// ==UserScript==
// @name         Turbo Duck
// @namespace    http://tampermonkey.net/
// @version      0.92
// @description  DuckDuckGo interface improvements
// @author       aseg
// @match        https://duckduckgo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=duckduckgo.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524859/Turbo%20Duck.user.js
// @updateURL https://update.greasyfork.org/scripts/524859/Turbo%20Duck.meta.js
// ==/UserScript==

(function()
{
    'use strict';

    document.body.onload = function()
    {
        if(document.getElementsByTagName('div').length > 0)
        {
            let weHrFlag = 0, imHrFlag = 0, viHrFlag = 0, neHrFlag = 0;
            const styleTag = document.createElement("style");
            styleTag.innerText = "::-webkit-scrollbar, ::-webkit-scrollbar-corner {background-color: #383a3b;width: 15px;height: 15px}"
                + "::-webkit-scrollbar-thumb {background-color: #54575a;}"
                + ".zci__main.zci__main--tiles.js-tiles.has-nav.tileview__images.has-tiles--grid {background-color: #2e3030;padding-top: 45px;}"
                + ".tile--img__media {border-radius: 5px;}"
                + ".cw {z-index: 99;background-color: #242528;width: 100%;}"
                + ".metabar__dropdowns, .metabar.metabar--fixed.js-zcm-sticky.has-dropdowns {background-color: #242528 !important;}"
                + ".tile-wrap {background-color: #2e3030;}"
                + ".metabar.metabar--fixed.js-zcm-sticky.has-dropdowns, .metabar.metabar--fixed.js-zcm-sticky.has-dropdowns.is-stuck {border-top: 5px solid #242528;}"
                + ".metabar__dropdowns-wrap {height : 42px}"
                + ".search-filters-wrap:before, .search-filters-wrap:after, .metabar__dropdowns-wrap:before, RHsWhMlxc4ETEMDS9ltw::before, .metabar__dropdowns-wrap:after {background-image: none !important;}"
                + "hr {border: none;border-bottom: 1px solid #606060;margin: 0px -7px 0px -7px;}"
                + ".nYs5EPJFwdhisN0E7MCB .wAo0g6uUc98EWmmASZLv:after {visibility: hidden;}"
                + "#react-layout {padding-top: 70px;}"
                + ".site-wrapper {background-color: #2e3030 !important;}"
                + "#header_wrapper {background-color: #242528;}"
                + ".DrcPyihFGyKMlg6lpwsa::before, .XvPRmQVeIoCP5lQhICTv.ofDl_1VxUG_EKc3b9E3x::before {background-image: none;}"
                + ".W4_K5H4AqLL1ngRJt_pk {position: fixed; top: 90px; z-index: 99; background-color: #242528; width: 100%; left: 0px; padding: 10px 0px 10px 10%;}";

            document.head.insertAdjacentElement('beforeend', styleTag);

            new MutationObserver(() =>
            {
                setTimeout(function()
                {
                    if (weHrFlag == 0 && location.href.match("web"))
                    {
                        weHrFlag = 1;
                        document.getElementsByClassName("cw")[1].style.position = "fixed";
                    }
                    else if (imHrFlag == 0 && location.href.match("images"))
                    {
                        imHrFlag = 1;
                        let imHr = document.createElement("hr");
                        if(document.getElementsByClassName("metabar__dropdowns-wrap")[1]) document.getElementsByClassName("metabar__dropdowns-wrap")[1].insertAdjacentElement("afterend", imHr);
                        else document.getElementsByClassName("metabar__dropdowns-wrap")[0].insertAdjacentElement("afterend", imHr);
                    }
                    else if (viHrFlag == 0 && location.href.match("videos")) // Voir HR qui ne s'affiche pas sous "metabar__dropdowns-wrap"
                    {
                        viHrFlag = 1;
                        let viHr = document.createElement("hr");
                        if(document.getElementsByClassName("metabar__dropdowns-wrap")[1]) document.getElementsByClassName("metabar__dropdowns-wrap")[1].insertAdjacentElement("afterend", viHr);
                        else document.getElementsByClassName("metabar__dropdowns-wrap")[0].insertAdjacentElement("afterend", viHr);

                        document.getElementsByClassName("zci__main  zci__main--tiles  js-tiles   has-nav tileview__videos has-tiles--grid")[0].style.paddingTop = "40px";
                    }
                    else if (neHrFlag == 0 && location.href.match("news"))
                    {
                        neHrFlag = 1;
                        let sBar = document.getElementsByClassName("search-filters-wrap")[0].style
                        sBar.position = "fixed";
                        sBar.zIndex = "100";
                        sBar.backgroundColor = "#242528";
                        sBar.width = "100%";
                        sBar.marginLeft = "-300px";
                        sBar.paddingLeft = "300px";
                        sBar.overflowY = "visible";

                        let neHr = document.createElement("hr");
                        document.getElementsByClassName("search-filters js-vertical-filters")[0].insertAdjacentElement("afterend", neHr);
                        neHr.style.marginTop = "-18px";
                        neHr.style.marginLeft = "-300px";

                        document.getElementsByClassName("results--sidebar js-vertical-sidebar")[0].style.marginTop = "30px";
                        document.getElementsByClassName("header  cw")[0].style.paddingBottom ="9px";
                        document.getElementsByClassName("results js-vertical-results")[0].style.top = "60px";
                        document.getElementsByClassName("cw")[1].style.backgroundColor = "#2e3030";
                    }
                    if (document.getElementsByClassName("At_VJ9MlrHsSjbfCtz2_ aDtqDaYogch0DyrGTrX6"))
                    {
                        document.getElementsByClassName("At_VJ9MlrHsSjbfCtz2_ aDtqDaYogch0DyrGTrX6")[0].style.minWidth = "860px"
                    }
                },100);
            }).observe(document, {subtree: true, childList: true});


            let greyHr = document.createElement("hr");
            greyHr.style = "border-bottom: 1px solid #606060;margin: 0px 0px 0px -7px;";
            document.getElementById("links_wrapper").insertAdjacentElement("afterend", greyHr);
        }
    }
})();