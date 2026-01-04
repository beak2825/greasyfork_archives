// ==UserScript==
// @name         About tab for Invidious
// @namespace    https://greasyfork.org/en/users/1028674-yacine-book
// @version      1.0.1
// @license      MIT
// @description  A userscript that adds an about tab to channel pages in Invidious
// @author       Yacine Book
// @match        https://yewtu.be/channel/*
// @match        https://invidious.flokinet.to/channel/*
// @match        https://invidious.protokolla.fi/channel/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yewtu.be
// @connect      yt.lemnoslife.com
// @connect      *
// @run-at       document-end
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @downloadURL https://update.greasyfork.org/scripts/487535/About%20tab%20for%20Invidious.user.js
// @updateURL https://update.greasyfork.org/scripts/487535/About%20tab%20for%20Invidious.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const queryString = window.location.search;
    console.log(queryString);

    const urlParams = new URLSearchParams(queryString);

    const about = urlParams.get('/about')
    console.log(about);

    const node = document.getElementById("descriptionWrapper");
    node.setAttribute("hidden", "");

    const tabContainer = document.querySelector(".flexible.title~.pure-g.h-box>.pure-u-1-2:nth-of-type(1)");
    const aboutTabContainer = document.createElement("div");
    aboutTabContainer.classList.add("pure-u-1", "pure-md-1-3");
    tabContainer.appendChild(aboutTabContainer);
    const aboutTab = document.createElement("a");
    aboutTab.innerHTML = 'About';
    aboutTab.href = '/channel/' + window.location.pathname.split("/").slice(2, 3) + '/?/about=1';
    aboutTab.classList.add("about-tab");
    aboutTabContainer.appendChild(aboutTab);

    const style = document.createElement('style');
    style.innerHTML = `
         .about-page-columns {
         display: flex;
         flex-direction: row;
         flex-wrap: wrap;
         }
         #descriptionWrapper {
         max-width: unset;
         border-bottom: 1px solid;
         padding-bottom: 10px;
         margin-bottom: 10px;
         }
         .ap-col {
         flex: 2;
         }
         .ap-col.num-2 {
         flex: 1;
         }
         .ap-col.num-1 {
         min-width: 0;
         padding-right: 60px;
         }

         p#apJoinDate.join-date-mobile {
         display: none;
         }

         div#linkListContainer.link-list-mobile {
         display: none;
         }

         @media (max-width: 760px) {
         .about-page-columns {
         flex-direction: column;
         }
         .ap-col.num-1 {
         padding-right: 0;
         }
         p#apJoinDate.join-date-mobile {
         display: block;
         }
         .ap-col.num-2 p {
         text-align: center;
         }
         .ap-col.num-2 p#apJoinDate {
         display: none;
         }
         .ap-redirect-links-container {
         text-align: center;
         }
         .ap-col.num-2 h3.about-page-subheadline {
         display: none;
         }
         div#linkListContainer.link-list-mobile {
         display: block;
         }
         h3.about-page-subheadline#subheadlineLinks {
         display: none;
         }
         h3.about-page-subheadline#subheadlineLinks~#descriptionWrapper {
         display: none;
         }
         }

         h3.about-page-subheadline {
         margin-bottom: 5px;
         }
         .ap-col.num-2 h3.about-page-subheadline, .ap-col.num-2 p {
         margin-bottom: 0px;
         margin-top: 10px;
         padding: 8px 0;
         border-bottom: 1px solid;
         }
         .ap-col.num-2 p {
         margin-top: 0;
         }
         .flexible.title~.pure-g.h-box>.pure-u-1-2:nth-of-type(1) .pure-u-1.pure-md-1-3:nth-of-type(1), .flexible.title~.pure-g.h-box>.pure-u-1-2:nth-of-type(1) .pure-u-1.pure-md-1-3:nth-of-type(2) {
         display: none;
         }
         .ap-redirect-links-container {
         display: flex;
         flex-direction: column;
         margin-top: 13px;
         }
         .ap-redirect-links-container a {
         padding: 8px 0;
         border-bottom: 1px solid;
         font-size: 14px;
         }
         .channel-external-link {
         margin: 10px 0;
         font-size: 14px;
         display: flex;
         flex-direction: row;
         align-items: center;
         }
        `;
    style.id = 'aboutPageStyle';
    style.type = 'text/css';
    document.querySelector("html").appendChild(style);

    if (about == "1") {
        node.removeAttribute("hidden");

        const hBox = document.createElement("div");
        hBox.classList.add("h-box");
        document.getElementById("contents").appendChild(hBox);

        const aboutPage = document.createElement("div");
        aboutPage.classList.add("about-page");
        hBox.appendChild(aboutPage);

        const aboutPageCols = document.createElement("div");
        aboutPageCols.classList.add("about-page-columns");
        aboutPage.appendChild(aboutPageCols);

        const apCol1 = document.createElement("div");
        apCol1.classList.add("ap-col", "num-1");
        aboutPageCols.appendChild(apCol1);

        const apCol2 = document.createElement("div");
        apCol2.classList.add("ap-col", "num-2");
        aboutPageCols.appendChild(apCol2);

        const aboutPageHeader = document.createElement("h3");
        aboutPageHeader.classList.add("about-page-subheadline");
        aboutPageHeader.innerHTML = 'About';
        apCol1.appendChild(aboutPageHeader);

        const aboutPageHeader2 = document.createElement("h3");
        aboutPageHeader2.classList.add("about-page-subheadline");
        aboutPageHeader2.innerHTML = 'Stats';
        apCol2.appendChild(aboutPageHeader2);

        const aboutPageJoin = document.createElement("p");
        aboutPageJoin.id = "apJoinDate";
        aboutPageJoin.innerHTML = `
          <div style="opacity: 0.5; font-style: italic;">Retrieving info from server...</div>
        `;
        apCol2.appendChild(aboutPageJoin);

        const aboutPageViews = document.createElement("p");
        aboutPageViews.id = "apViewCount";
        aboutPageViews.innerHTML = `
          <div style="opacity: 0.5; font-style: italic;">Retrieving info from server...</div>
        `;
        apCol2.appendChild(aboutPageViews);

        const aboutPageVideoCount = document.createElement("p");
        aboutPageVideoCount.id = "apVideoCount";
        aboutPageVideoCount.innerHTML = `
          <div style="opacity: 0.5; font-style: italic;">Retrieving info from server...</div>
        `;
        apCol2.appendChild(aboutPageVideoCount);

        const apLinksCont = document.createElement("div");
        apLinksCont.classList.add("ap-redirect-links-container");
        apCol2.appendChild(apLinksCont);

        const node2 = document.getElementById("descriptionWrapper");
        const clone = node2.cloneNode(true);
        node.setAttribute("hidden", "");
        apCol1.appendChild(clone);

        const aboutPageJoinMob = document.createElement("p");
        aboutPageJoinMob.id = "apJoinDate";
        aboutPageJoinMob.classList.add("join-date-mobile");
        aboutPageJoinMob.innerHTML = `
          <div style="opacity: 0.5; margin: -37px 0; font-style: italic;">Retrieving info from server...</div>
        `;
        clone.appendChild(aboutPageJoinMob);

        const aboutPageLinks = document.createElement("div");
        aboutPageLinks.id = "linkListContainer";

        const aboutPageLinksMob = document.createElement("div");
        aboutPageLinksMob.id = "linkListContainer";
        aboutPageLinksMob.classList.add("link-list-mobile");
        clone.appendChild(aboutPageLinksMob);

        const viewOnYT = document.querySelector('a[href*="youtube.com"]');
        apLinksCont.appendChild(viewOnYT);
        const switchInstance = document.querySelector('a[href*="redirect.invidious.io"]');
        apLinksCont.appendChild(switchInstance);

        const hideVideos = document.createElement('style');
        hideVideos.innerHTML = `
          .pure-u-1.pure-u-md-1-4 {
          display: none!important;
          }
          .page-nav-container {
          display: none;
          }
        `;
        document.querySelector("body").appendChild(hideVideos);

        const footer = document.querySelector("footer");
        document.getElementById("contents").appendChild(footer);

        const newAboutTab = document.createElement("b");
        newAboutTab.innerHTML = 'About';
        newAboutTab.classList.add("about-tab");
        aboutTab.replaceWith(newAboutTab);

        var videoTab = document.querySelectorAll('b');
        for(var i=0;i<videoTab.length;i++){
        console.log(videoTab[i].innerHTML)
        if(videoTab[i].innerHTML == 'Videos'){
        var newVideoTab = document.createElement('a');
        newVideoTab.innerHTML = 'Videos';
        newVideoTab.href = '/channel/' + window.location.pathname.split("/").slice(2, 3) + '/videos';
        videoTab[i].replaceWith(newVideoTab);
        break;
        }
        }

        const options = document.querySelector(".flexible.title~.pure-g.h-box>.pure-u-1-2~.pure-u-1-2 .pure-md-1-3");
        options.remove();
        const options2 = document.querySelector(".flexible.title~.pure-g.h-box>.pure-u-1-2~.pure-u-1-2 .pure-md-1-3");
        options2.remove();
        const options3 = document.querySelector(".flexible.title~.pure-g.h-box>.pure-u-1-2~.pure-u-1-2 .pure-md-1-3");
        options3.remove();

        const ucid = window.location.pathname.split("/").slice(2, 3);
        const descWrapper = document.getElementById("descriptionWrapper");

        if (descWrapper && aboutPageJoin) {
            GM.xmlHttpRequest({
                url: "https://yt.lemnoslife.com/noKey/channels?part=snippet,status&id=" + ucid,
                onload: (response) => {
                const data = JSON.parse(response.responseText);
                console.log(data);

                aboutPageJoin.innerHTML = '<span>Joined </span>' + data.items[0].snippet.publishedAt.toLocaleString();
                aboutPageJoinMob.innerHTML = '<span>Joined </span>' + data.items[0].snippet.publishedAt.toLocaleString();
                },
            });
        }

        if (descWrapper && aboutPageViews) {
            GM.xmlHttpRequest({
                url: "https://yt.lemnoslife.com/channels?part=snippet,status,about&id=" + ucid,
                onload: (response) => {
                const data = JSON.parse(response.responseText);
                console.log(data);

                aboutPageViews.innerHTML = "<b>" + data.items[0].about.stats.viewCount.toLocaleString() + "</b> views";
                aboutPageVideoCount.innerHTML = "<b>" + data.items[0].about.stats.videoCount.toLocaleString() + "</b> videos";
                if (data.items[0].about.details.location) {
                    const aboutPageHeaderDetails = document.createElement("h3");
                    aboutPageHeaderDetails.classList.add("about-page-subheadline");
                    aboutPageHeaderDetails.id = "subheadlineDetails";
                    aboutPageHeaderDetails.innerHTML = 'Details';
                    apCol1.appendChild(aboutPageHeaderDetails);

                    const detailsWrapper = document.createElement("div");
                    detailsWrapper.id = "descriptionWrapper";
                    apCol1.appendChild(detailsWrapper);

                    const detailsWrapperP = document.createElement("p");
                    detailsWrapperP.innerHTML = '<b>Location: </b>' + data.items[0].about.details.location;
                    detailsWrapperP.style = "opacity: 0.8;";
                    detailsWrapper.appendChild(detailsWrapperP);
                }

                if (!data.items[0].about.links.length == 0) {
                    const aboutPageHeaderLinks = document.createElement("h3");
                    aboutPageHeaderLinks.classList.add("about-page-subheadline");
                    aboutPageHeaderLinks.id = "subheadlineLinks";
                    aboutPageHeaderLinks.innerHTML = 'Links';
                    apCol1.appendChild(aboutPageHeaderLinks);

                    const linksWrapper = document.createElement("div");
                    linksWrapper.id = "descriptionWrapper";
                    apCol1.appendChild(linksWrapper);
                    linksWrapper.appendChild(aboutPageLinks);
                data.items[0].about.links.forEach(item => {
                    const externalLink = document.createElement("div");
                    externalLink.classList.add("channel-external-link");
                    aboutPageLinks.appendChild(externalLink);

                    const externalLinkTextCont = document.createElement("div");
                    externalLinkTextCont.classList.add("channel-external-link-text-container");
                    externalLink.appendChild(externalLinkTextCont);

                    const externalLinkText = document.createElement("a");
                    externalLinkText.classList.add("channel-external-link-text");
                    externalLinkText.innerHTML = item.title;
                    externalLinkText.href = item.url;
                    externalLinkText.target = "_blank";
                    externalLinkTextCont.appendChild(externalLinkText);
                });
                data.items[0].about.links.forEach(item => {
                    const externalLink = document.createElement("div");
                    externalLink.classList.add("channel-external-link");
                    aboutPageLinksMob.appendChild(externalLink);

                    const externalLinkTextCont = document.createElement("div");
                    externalLinkTextCont.classList.add("channel-external-link-text-container");
                    externalLink.appendChild(externalLinkTextCont);

                    const externalLinkText = document.createElement("a");
                    externalLinkText.classList.add("channel-external-link-text");
                    externalLinkText.innerHTML = item.title;
                    externalLinkText.href = item.url;
                    externalLinkText.target = "_blank";
                    externalLinkTextCont.appendChild(externalLinkText);
                });
                }

                },
            });
        }
    }
})();