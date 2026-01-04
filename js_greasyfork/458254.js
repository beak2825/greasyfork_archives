// ==UserScript==
// @name         Tassel
// @version      1.7.6
// @description  Pillowfort Extension Manager. Makes the use of a variety of extensions easier.
// @author       Aki108
// @match        https://www.pillowfort.social/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pillowfort.social
// @supportURL   https://www.pillowfort.social/Tassel
// @grant        none
// @namespace https://greasyfork.org/users/1012189
// @downloadURL https://update.greasyfork.org/scripts/458254/Tassel.user.js
// @updateURL https://update.greasyfork.org/scripts/458254/Tassel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let extensionsIndexURL = "https://cdn.jsdelivr.net/gh/Aki-108/Tassel@2ca5662912154a616db1208bb7bfa94a991606a5/extensionsIndex.js";
    let toastsURL = "https://cdn.jsdelivr.net/gh/Aki-108/Tassel@5716332e94d08b1a0662a799ac2dba905f8f1f11/toasts.js";
    let styleURL = "https://cdn.jsdelivr.net/gh/Aki-108/Tassel@e5dece5f709f2251b1af9bcd3c0d6ad29fc6aa58/style.css";
    let jsonManager = "https://cdn.jsdelivr.net/gh/Aki-108/Tassel@c0d746e8d72e4d13fb29536f3155d648b9a99a6a/jsonManager.js";

    let icon = document.createElement("div");
    icon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="tasselIconColor" width="20" height="20" viewBox="0 0 20 20">
        <title>Tassel</title>
        <path xmlns="http://www.w3.org/2000/svg" style="fill:none;stroke:#58b6dd;stroke-width:1.2px" d="
          M 8 7        Q 6.5 8 6.5 12     Q 6.5 16 4 19
          M 12 7       Q 13.5 8 13.5 12   Q 13.5 16 16 19
          M 8 2.5      L 8 0.5            L 12 0.5            L 12 2.5
          M 6 16       L 8 18.5           L 10 16             L 12 18.5           L 14 16
        "/>
        <circle cx="10" fill="none" stroke-width="1.2px" r="3" stroke="#58b6dd" cy="5"/>
      </svg>`;

    let settings2 = (JSON.parse(localStorage.getItem("tasselSettings2")) || {
        "tassel": {
            "extensions": [],
            "highlightComments": false,
            "notify": {
                "active": true,
                "inactive": true,
                "new": true
            },
            "shortenSidebar": false,
            "showWIP": false,
            "stickyIcons": false,
            "stickyToolbar": false,
            "toastRead": -1
        }
    }).tassel;
    if (!settings2.sidebar) settings2.sidebar = {};
    if (!settings2.postFooter) settings2.postFooter = {};
    let sortOrder = "new";//order in which to display extensions in the list

    //src: https://aaronsmith.online/easily-load-an-external-script-using-javascript/
    const loadScript_xcajbuzn = src => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.onload = resolve
            script.onerror = reject
            script.src = src
            document.head.append(script)
        })
    }

    const loadStyle_xcajbuzn = src => {
        return new Promise((resolve, reject) => {
            const style = document.createElement('link')
            style.type = 'text/css'
            style.rel = "stylesheet"
            style.onload = resolve
            style.onerror = reject
            style.href = src
            document.head.append(style)
        })
    }

    //source: https://stackoverflow.com/a/43027791
    var waitForJQuery = setInterval(function () {
        if (typeof $ != 'undefined') {
            clearInterval(waitForJQuery);
            loadScript_xcajbuzn("https://cdn.jsdelivr.net/gh/vnausea/waitForKeyElements@f50495d44441c0c5d153d7a5ff229eeaace0bf9e/waitForKeyElements.js")
                .then(() => init_xcajbuzn());
        }
    }, 10);

    /* Initialize */
    function init_xcajbuzn() {
        loadStyle_xcajbuzn(styleURL);
        loadAppearance_xcajbuzn();
        initJsonManager_xcajbuzn();
        loadScript_xcajbuzn(extensionsIndexURL)
            .then(() => loadExtensions_xcajbuzn());
        initToast_xcajbuzn();
        createModal_xcajbuzn();
        waitForKeyElements(".sidebar-expanded", initSidebar_xcajbuzn);
        if (settings2.rememberPostSettings) setPrivacySettings_xcajbuzn();

        let eventFeed = document.createElement("div");
        eventFeed.id = "tasselEvents";
        document.getElementsByTagName("body")[0].appendChild(eventFeed);
    }

    function initJsonManager_xcajbuzn() {
        let modalReady = document.createElement("button");
        modalReady.id = "tasselJsonManagerModalReady";
        modalReady.style.display = "none";
        document.body.appendChild(modalReady);
        modalReady.addEventListener("click", function() {console.log("modal data ready")});
        if (settings2.bottomPermalink) modalReady.addEventListener("click", function() {
            let modal = document.getElementById("post-view-modal") || document.getElementById("reblog-modal");
            let nav = modal.getElementsByClassName("post-nav-left");
            Object.values(nav).forEach(function(item, index) {
                if (!tasselJsonManager.modal.ready) return;
                if (item.classList.contains("tasselPermalinked")) {
                    item.getElementsByClassName("tasselPermalinked")[0].href = `/posts/${tasselJsonManager.modal.json.original_post_id || tasselJsonManager.modal.json.id}`;
                    return;
                }
                let link = document.createElement("a");
                link.setAttribute("target", "_blank");
                link.title = "link to post";
                link.classList.add("link_post", "svg-blue", "tasselPermalinked");
                link.href = `/posts/${tasselJsonManager.modal.json.original_post_id || tasselJsonManager.modal.json.id}`;
                link.style = "margin: 0 0 0 20px;";
                link.innerHTML = `<img src="https://cdn.jsdelivr.net/gh/Aki-108/Tassel@50f03c59507325d27ccf9adb1a6fa46cdb6c5604/icons/link.svg" style="height: 20px;">`;
                item.appendChild(link);
                item.classList.add("tasselPermalinked");
            });
        });

        let postReady = document.createElement("button");
        postReady.id = "tasselJsonManagerPostReady";
        postReady.style.display = "none";
        document.body.appendChild(postReady);
        postReady.addEventListener("click", function() {console.log("post data ready");pushEvent_xcajbuzn({source:"JSON Manager",text:"post data ready"});});

        let commentReady = document.createElement("button");
        commentReady.id = "tasselJsonManagerCommentReady";
        commentReady.style.display = "none";
        document.body.appendChild(commentReady);
        commentReady.addEventListener("click", function() {console.log("comment data ready");pushEvent_xcajbuzn({source:"JSON Manager",text:"comment data ready"});});

        let reblogReady = document.createElement("button");
        reblogReady.id = "tasselJsonManagerReblogReady";
        reblogReady.style.display = "none";
        document.body.appendChild(reblogReady);
        reblogReady.addEventListener("click", function() {console.log("reblog data ready");pushEvent_xcajbuzn({source:"JSON Manager",text:"reblog data ready"});});

        let likeReady = document.createElement("button");
        likeReady.id = "tasselJsonManagerLikeReady";
        likeReady.style.display = "none";
        document.body.appendChild(likeReady);
        likeReady.addEventListener("click", function() {console.log("like data ready");pushEvent_xcajbuzn({source:"JSON Manager",text:"like data ready"});});

        let feedReady = document.createElement("button");
        feedReady.id = "tasselJsonManagerFeedReady";
        feedReady.style.display = "none";
        document.body.appendChild(feedReady);
        feedReady.addEventListener("click", function() {console.log("feed data ready");pushEvent_xcajbuzn({source:"JSON Manager",text:"feed data ready"});});
        if (settings2.bottomPermalink) feedReady.addEventListener("click", function() {
            addBottomPermalink_xcajbuzn();
        });

        let followersReady = document.createElement("button");
        followersReady.id = "tasselJsonManagerFollowersReady";
        followersReady.style.display = "none";
        document.body.appendChild(followersReady);
        followersReady.addEventListener("click", function() {console.log("followers data ready");pushEvent_xcajbuzn({source:"JSON Manager",text:"list of followers ready"});});

        let followingReady = document.createElement("button");
        followingReady.id = "tasselJsonManagerFollowingReady";
        followingReady.style.display = "none";
        document.body.appendChild(followingReady);
        followingReady.addEventListener("click", function() {console.log("following data ready");pushEvent_xcajbuzn({source:"JSON Manager",text:"list of following ready"});});

        let mutualsReady = document.createElement("button");
        mutualsReady.id = "tasselJsonManagerMutualsReady";
        mutualsReady.style.display = "none";
        document.body.appendChild(mutualsReady);
        mutualsReady.addEventListener("click", function() {console.log("mutuals data ready");pushEvent_xcajbuzn({source:"JSON Manager",text:"list of mutals ready"});});

        let communitiesReady = document.createElement("button");
        communitiesReady.id = "tasselJsonManagerCommunitiesReady";
        communitiesReady.style.display = "none";
        document.body.appendChild(communitiesReady);
        communitiesReady.addEventListener("click", function() {console.log("community data ready");pushEvent_xcajbuzn({source:"JSON Manager",text:"list of communities ready"});});

        loadScript_xcajbuzn(jsonManager);
    }

    /* Add buttons to sidebar */
    function initSidebar_xcajbuzn() {
        if (document.getElementsByClassName("tasselSidebarBig").length > 0) return; //stop if sidebar has already been initialized

        //add button to collapsed sidebar
        let sidebarSmall = document.getElementsByClassName("sidebar-collapsed")[1];
        let settingsSmall = document.createElement("a");
        settingsSmall.href = "";//add a link to comply with accessibility requirements but don't open the link
        if (settings2.sidebar.collapsedTassel) settingsSmall.classList.add("tasselRemoveSidebarElement");
        settingsSmall.addEventListener("click", function(event) {
            event.preventDefault();
        });
        settingsSmall.classList.add("sidebar-icon", "tasselSidebarSmall");
        settingsSmall.title = "Tassel";
        let imageSmall = icon.cloneNode(true);
        settingsSmall.appendChild(imageSmall);
        settingsSmall.addEventListener("click", openModal_xcajbuzn);
        sidebarSmall.appendChild(settingsSmall);

        //add button to expanded sidebar
        let sidebarBig = document.getElementsByClassName("sidebar-expanded")[1];
        for (let child of sidebarBig.children) {
            if (child.href !== "https://www.pillowfort.social/settings") continue;
            if (child.firstChild.style === undefined) continue;
            child.firstChild.style.paddingBottom = "3px";
        }
        let settingsBigWrapper = document.createElement("a");
        settingsBigWrapper.href = "";//add a link to comply with accessibility requirements but don't open the link
        settingsBigWrapper.addEventListener("click", function(event) {
            event.preventDefault();
        });
        settingsBigWrapper.addEventListener("click", openModal_xcajbuzn);
        if (settings2.sidebar.expandedTassel) settingsBigWrapper.classList.add("tasselRemoveSidebarElement");
        let settingsBig = document.createElement("div");
        settingsBig.classList.add("sidebar-topic", "tasselSidebarBig");
        let image = icon.children[0];
        image.classList.add("sidebar-img");
        image.style.transform = "scale(1.2)";
        settingsBig.appendChild(image);
        settingsBig.innerHTML += "Tassel";
        settingsBigWrapper.appendChild(settingsBig);
        sidebarBig.appendChild(settingsBigWrapper);

        if (!settings2.sidebar.expandedEpander) return;
        let anyHidden = Object.values(settings2.sidebar).some(function(item) {
            return item;
        });
        if (anyHidden) {
            let sidebarBig = document.getElementById("expanded-bar-container");
            let sidebarBottom = sidebarBig.getElementsByClassName("sidebar-bottom")[0];
            sidebarBottom.children[6].style.display = "none";
            let button = document.createElement("button");
            button.id = "tasselExpandedSidebarExpander";
            button.setAttribute("aria-label", "show hidden elements");
            button.innerHTML = `<div></div>`;
            sidebarBottom.appendChild(button);
            button.addEventListener("click", function() {
                let sidebar = document.getElementById("expanded-bar-container").parentNode;
                if (sidebar.classList.contains("visible")) sidebar.classList.remove("visible");
                else sidebar.classList.add("visible");
            });
            let button2 = document.createElement("button");
            button2.id = "tasselCollapsedSidebarExpander";
            button2.setAttribute("aria-label", "show hidden elements");
            button2.innerHTML = `<div></div>`;
            sidebarBig.parentNode.getElementsByClassName("sidebar-collapsed")[1].appendChild(button2);
            button2.addEventListener("click", function() {
                let sidebar = document.getElementById("expanded-bar-container").parentNode;
                if (sidebar.classList.contains("visible")) sidebar.classList.remove("visible");
                else sidebar.classList.add("visible");
            });
        }
    }

    /* Create the modal basis with sidebar */
    function createModal_xcajbuzn() {
        let modal = document.createElement("div");
        modal.id = "tasselModal";
        modal.classList.add("modal", "in");
        //create the stucture with header, sidebar and content-box
        modal.innerHTML = `
          <div id='tasselModalDialog1' class='modal-dialog'>
            <div id='tasselModalDialog2' class='modal-content'>
              <header id='tasselModalHeader'>
                <button id='tasselModalClose' class='close' type='button' title='Close'>
                <span style='color:var(--postFontColor);'>x</span>
                </button>
                <h1 class='modal-title'>Tassel</h4>
              </header>
              <div id='tasselModalGrid'>
                <nav id='tasselModalSidebar' aria-label='Tassel Navigation'>
                  <button class='tasselModalSidebarEntry' id='tasselModalSidebarExtensions'>Extensions</button>
                  <button class='tasselModalSidebarEntry' id='tasselModalSidebarSettings'>Settings</button>
                  <button class='tasselModalSidebarEntry' id='tasselModalSidebarAbout'>About</button>
                </nav>
                <main id='tasselModalContent'></main>
              </div>
            </div>
          </div>
          <div id='tasselModalBackground' class='in'></div>`;
        document.getElementsByTagName("body")[0].appendChild(modal);
        document.getElementById("tasselModalSidebarExtensions").addEventListener("click", displayExtensions_xcajbuzn);
        document.getElementById("tasselModalSidebarSettings").addEventListener("click", displaySettings_xcajbuzn);
        document.getElementById("tasselModalSidebarAbout").addEventListener("click", displayAbout_xcajbuzn);
        document.getElementById("tasselModalBackground").addEventListener("click", closeModal_xcajbuzn);
        document.getElementById("tasselModalClose").addEventListener("click", closeModal_xcajbuzn);
    }

    /* Load extensions from external file */
    function loadExtensions_xcajbuzn() {
        settings2.extensions.forEach(function(value) {
            let extension = extensionsIndex.find(function(data) {
                return data.id == value.id;
            });
            if (!extension) return;
            if (extension.css) loadStyle_xcajbuzn(extension.css);
            if (extension.src) loadScript_xcajbuzn(extension.src);
        });
        evaluateURLParameter_xcajbuzn();
    }

    /* Load selected appearance changes */
    function loadAppearance_xcajbuzn() {
        let css = "";
        if (settings2.shortenSidebar) css += ".sidebar-topic{margin-top:8px !important;margin-bottom:8px !important;padding-bottom:0 !important;}.sidebar-indent{padding-bottom:4px !important;}.sidebar-bottom-left{padding-top:10px;padding-bottom:8px;}";
        if (settings2.stickyIcons) css += ".side-info{position:sticky;top:70px;margin-bottom:10px;}";
        if (settings2.stickyToolbar) css += ".gray-theme.fr-toolbar.fr-sticky-off,.gray-theme.fr-toolbar.fr-sticky-on{position:sticky;top:50px !important;z-index:5;}.fr-sticky-dummy{display:none !important;}";
        if (settings2.stickyCommentHeader) css += ".comments-container .header{position:sticky;top:50px;z-index:3;}";
        if (settings2.goldToBlue) css += ".svg-gold{filter:brightness(0) saturate(100%) invert(65%) sepia(86%) saturate(377%) hue-rotate(166deg) brightness(87%) contrast(98%);}";
        if (settings2.noFrames) css += ".post-container .avatar-frame {display: none;} .post-container .avatar img.with-frame {border: none !important; background-color: #fff !important;} body.dark-theme .post-container .avatar img {background-color: #d9dbe0 !important;}";
        if (settings2.expandNotes) css += "body.dark-theme #notifs-dashboard .notif-mini {background-color: #1b1d20;} #notifs-dashboard .repeat-notifs {max-height: 500px; transition: max-height 0.5s ease-in; overflow-y: auto;} #notifs-dashboard .repeat-notifs.expanded {max-height: 0px; overflow: hidden; transition: max-height 0.25s ease-out;}";

        //Post footer
        if (settings2.postFooter.swapLeftRight) css += ".post .post-nav .post-nav-left {float: right; padding-right: 20px;} .post .post-nav .post-nav-right {float: left; padding-right: 0;}";
        css += ".post .post-nav .post-nav-left, .post .post-nav .post-nav-right {display: grid; grid-auto-flow: column; align-items: baseline;} .post-nav .post-nav-left {float: left;}";//prepare for reordering
        if (settings2.postFooter.comments !== 0) css += `.post .post-nav .post-nav-left a.nav-tab {order: ${settings2.postFooter.comments || 0};}`;
        if (settings2.postFooter.reblog !== 0) css += `.post .post-nav .post-nav-left span:has(> a.nav-tab) {order: ${settings2.postFooter.reblog || 0};}`;
        if (settings2.postFooter.like !== 0) css += `.post .post-nav .post-nav-left span:has(> span a.like-button), .post .post-nav .post-nav-left span:has(> a.like-button) {order: ${settings2.postFooter.like || 0};}`;
        if (settings2.postFooter.permalink !== 0) css += `.post .post-nav .post-nav-left .tasselPermalinked {order: ${settings2.postFooter.permalink || 0};}`;
        if (settings2.postFooter.subscribe !== 0) css += `.post .post-nav .post-nav-left #tasselPostSubscriberModalSubscribe {order: ${settings2.postFooter.subscribe || 0};}`;
        if (settings2.postFooter.activity !== 0) css += `.post .post-nav .post-nav-left .tasselTimeFormatActivity {order: ${settings2.postFooter.activity || 0};}`;
        if (settings2.postFooter.flag !== 0) css += `.post .post-nav .post-nav-right span:has(> a.flag-button) {order: ${settings2.postFooter.flag || 0};}`;
        if (settings2.postFooter.edit !== 0) css += `.post .post-nav .post-nav-right span:has(> a img.edit-img) {order: ${settings2.postFooter.edit || 0};}`;
        if (settings2.postFooter.delete !== 0) css += `.post .post-nav .post-nav-right span:has(> a.pointer-cursor) {order: ${settings2.postFooter.delete || 0};}`;
        if (settings2.postFooter.blockPost !== 0) css += `.post .post-nav .post-nav-right span:has(> a:not([id^='post'])) {order: ${settings2.postFooter.blockPost || 0};}`;

        //Apply new styling to page
        //src: https://stackoverflow.com/q/3922139
        let style = document.createElement("style");
        style.setAttribute('type', 'text/css');
        if (style.styleSheet) {//IE
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
        document.head.appendChild(style);

        //Sidebar
        if (settings2.sidebar.expandedPost) getSidebarElement_xcajbuzn("https://www.pillowfort.social/posts/new").classList.add("tasselRemoveSidebarElement");
        if (settings2.sidebar.expandedDrafts && getSidebarElement_xcajbuzn("https://www.pillowfort.social/drafts")) getSidebarElement_xcajbuzn("https://www.pillowfort.social/drafts").classList.add("tasselRemoveSidebarElement");
        if (settings2.sidebar.expandedQueue && getSidebarElement_xcajbuzn("https://www.pillowfort.social/queued_posts")) getSidebarElement_xcajbuzn("https://www.pillowfort.social/queued_posts").classList.add("tasselRemoveSidebarElement");
        if (settings2.sidebar.expandedInbox) getSidebarElement_xcajbuzn("https://www.pillowfort.social/messages").classList.add("tasselRemoveSidebarElement");
        if (settings2.sidebar.expandedNotifications) getSidebarElement_xcajbuzn("https://www.pillowfort.social/notifs_dash").classList.add("tasselRemoveSidebarElement");
        if (settings2.sidebar.expandedCommunities) getSidebarElement_xcajbuzn("https://www.pillowfort.social/communities").classList.add("tasselRemoveSidebarElement");
        if (settings2.sidebar.expandedSearch) document.getElementById("searchme").classList.add("tasselRemoveSidebarElement");
        if (settings2.sidebar.expandedFilters) {
            Object.values(document.getElementById("expanded-bar-container").getElementsByTagName("a")).find(function(item) {
                return item.getAttribute("data-target") === "#filtersModal"
            }).classList.add("tasselRemoveSidebarElement");
        }
        if (settings2.sidebar.expandedBlocklist) getSidebarElement_xcajbuzn("https://www.pillowfort.social/block_list").classList.add("tasselRemoveSidebarElement");
        if (settings2.sidebar.expandedPremium) getSidebarElement_xcajbuzn("https://www.pillowfort.social/subscriptions/show").classList.add("tasselRemoveSidebarElement");
        if (settings2.sidebar.expandedSettings) getSidebarElement_xcajbuzn("https://www.pillowfort.social/settings").classList.add("tasselRemoveSidebarElement");
        if (settings2.sidebar.expandedFollowers) getSidebarElement_xcajbuzn("https://www.pillowfort.social/followers").classList.add("tasselRemoveSidebarElement");
        if (settings2.sidebar.expandedFollowing) getSidebarElement_xcajbuzn("https://www.pillowfort.social/following").classList.add("tasselRemoveSidebarElement");
        if (settings2.sidebar.expandedMutuals) getSidebarElement_xcajbuzn("https://www.pillowfort.social/mutuals").classList.add("tasselRemoveSidebarElement");
        if (settings2.sidebar.expandedInvites) getSidebarElement_xcajbuzn("https://www.pillowfort.social/generate_invites").classList.add("tasselRemoveSidebarElement");
        if (settings2.sidebar.expandedDonations) getSidebarElement_xcajbuzn("https://www.pillowfort.social/donations").classList.add("tasselRemoveSidebarElement");
        if (settings2.sidebar.expandedAbout) getSidebarElement_xcajbuzn("https://www.pillowfort.social/about").parentNode.classList.add("tasselRemoveSidebarElement");

        if (settings2.sidebar.collapsedPost) getSidebarElement_xcajbuzn("https://www.pillowfort.social/posts/new", true).classList.add("tasselRemoveSidebarElement");
        if (settings2.sidebar.collapsedInbox) getSidebarElement_xcajbuzn("https://www.pillowfort.social/messages", true).classList.add("tasselRemoveSidebarElement");
        if (settings2.sidebar.collapsedNotifications) getSidebarElement_xcajbuzn("https://www.pillowfort.social/notifs_dash", true).classList.add("tasselRemoveSidebarElement");
        if (settings2.sidebar.collapsedCommunities) getSidebarElement_xcajbuzn("https://www.pillowfort.social/communities", true).classList.add("tasselRemoveSidebarElement");
        if (settings2.sidebar.collapsedFilters) {
            Object.values(document.getElementsByClassName("sidebar-collapsed")[1].children).find(function(item) {
                return item.getAttribute("data-target") === "#filtersModal"
            }).classList.add("tasselRemoveSidebarElement");
        }
        if (settings2.sidebar.collapsedBlocklist) getSidebarElement_xcajbuzn("https://www.pillowfort.social/block_list", true).classList.add("tasselRemoveSidebarElement");
        if (settings2.sidebar.collapsedSettings) getSidebarElement_xcajbuzn("https://www.pillowfort.social/settings", true).classList.add("tasselRemoveSidebarElement");
    }

    /* Create the basis for toasts */
    function initToast_xcajbuzn() {
        let toastFrame = document.createElement("div");
        toastFrame.id = "tasselToast";
        document.getElementsByTagName("body")[0].appendChild(toastFrame);

        loadScript_xcajbuzn(toastsURL)
            .then(() => loadToasts_xcajbuzn());
    }

    /* Check which toasts to display */
    function loadToasts_xcajbuzn() {
        if (!toasts) return;
        toasts.forEach(function(toast, index) {
            if (toast.timestamp <= settings2.toastRead) return;//only show new toasts
            let extension = settings2.extensions.find(function(item) {
                return item.id == toast.extension;
            });
            if (
                //show toast for active extensions
                (extension//only when the extension is active
                 && settings2.notify.active//only when active is wanted
                 && extension.since < toast.timestamp//only if it's been active before the toast
                 && !toast.new)//only if the extension is not new
                ||
                //show toast for inactive extensions
                (!extension//only when the extension is inactive
                 && settings2.notify.inactive//only when inactive is wanted
                 && !toast.new)//only when the extension is not new
                ||
                //show toast for new extensions
                (toast.new//only when the extension is new
                 && settings2.notify.new)//only when new is wanted
                ||
                //show toast that don't belong to an extension
                (toast.extension == "0")
            ) {
                pushToast_xcajbuzn(toast);
            }
        });
    }

    /* Create toast */
    function pushToast_xcajbuzn(data) {
        let toast = document.createElement("div");
        toast.innerHTML = `
          <h1>${data.title}</h1>
          <span>${data.text}</span>
        `;
        toast.setAttribute("timestamp", data.timestamp);
        document.getElementById("tasselToast").appendChild(toast);
        //add relativ links
        if (document.getElementById("tasselToast").lastChild.getElementsByTagName("a").length > 0) {
            let links = Object.values(document.getElementById("tasselToast").lastChild.getElementsByTagName("a"));
            links.forEach(function(link) {
                if (link.tagName == "A" && link.href == "" && link.hasAttribute("linkRel")) {
                    let url = new URL(window.location);
                    url.searchParams.set("tassel", link.getAttribute("linkRel"));
                    link.href = url;
                }
            });
        }

        document.getElementById("tasselToast").lastChild.style.height = document.getElementById("tasselToast").lastChild.clientHeight + "px";
        //mark as read when clicked
        document.getElementById("tasselToast").lastChild.addEventListener("click", function() {
            if (this.getAttribute("timestamp") > settings2.toastRead) settings2.toastRead = this.getAttribute("timestamp")*1;
            saveSettings_xcajbuzn();
            this.classList.add("fade-out");
        });
    }

    /* Create event log for debug more */
    function pushEvent_xcajbuzn(data) {
        if (!settings2.debug) return;
        let event = document.createElement("div");
        event.innerHTML = `
          <p><b>${data.source}:</b> ${data.text}</p>
        `;
        event.id = "event" + Math.random();
        document.getElementById("tasselEvents").appendChild(event);
        window.setTimeout(function() {
            event.classList.add("fade-out");
            window.setTimeout(function() {
                event.remove();
            }, 5000);
        }, 30000);
    }

    /* Open modal when URL parameters say so and highlight specific elements */
    function evaluateURLParameter_xcajbuzn() {
        let queryString = new URLSearchParams(window.location.search.substring(1));
        for (let pair of queryString.entries()) {
            if (pair[0] == "tassel") {
                openModal_xcajbuzn(pair[1]);
            } else if (pair[0] == "tExtension") {
                let extension = document.getElementById(pair[1]);
                if (!extension) {
                    let list = document.getElementById("tasselModalContentExtensionsList");
                    extension = document.createElement("section");
                    extension.id = pair[1];
                    extension.classList.add("tasselExtension");
                    extension.innerHTML = `
                        <div>
                            <label>Coming Soon</label>
                        </div>
                    `;
                    list.insertBefore(extension, list.firstChild);
                }
                extension.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
                extension.style.animationDuration = "2s";
                extension.style.animationIterationCount = "2";
                extension.style.animationName = "blink";
            } else if (pair[0] == "tSwitch") {
                let setting = document.getElementsByClassName(pair[1])[0].parentNode;
                setting.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
                setting.style.animationDuration = "2s";
                setting.style.animationIterationCount = "2";
                setting.style.animationName = "blink";
            } else if (pair[0] == "comment" && settings2.highlightComments) {
                window.setTimeout(function() {
                    let comment = document.getElementById(pair[1]);
                    comment.style.animationDuration = "2s";
                    comment.style.animationIterationCount = "2";
                    comment.style.animationName = "blink";
                }, 2000);
            } else if (pair[0] === "tExtensionSettings") {
                window.setTimeout(function() {
                    let button = document.getElementById(pair[1]);
                    if (button) button.click();
                }, 500);
            }
        }
    }

    /* Make modal visible */
    function openModal_xcajbuzn(tab) {
        document.getElementsByTagName("body")[0].classList.add("modal-open");
        document.getElementsByTagName("nav")[0].style.paddingRight = "11px";

        document.getElementById("tasselModal").style.display = "block";
        switch (tab) {
            case "settings": displaySettings_xcajbuzn(); break;
            case "about": displayAbout_xcajbuzn(); break;
            default: displayExtensions_xcajbuzn();
        }
    }

    /* Make modal invisible */
    function closeModal_xcajbuzn() {
        document.getElementsByTagName("body")[0].classList.remove("modal-open");
        document.getElementsByTagName("nav")[0].style.paddingRight = "0";
        document.getElementById("tasselModal").style.display = "none";
    }

    /* Create a list of all extensions in the modal */
    function displayExtensions_xcajbuzn() {
        //reset modal
        let content = document.getElementById("tasselModalContent");
        content.innerHTML = "";
        let sidebarEntries = document.getElementsByClassName("tasselModalSidebarEntry");
        Object.values(sidebarEntries).forEach(function(data, index) {
            data.classList.remove("active");
        });
        document.getElementById("tasselModalSidebarExtensions").classList.add("active");

        //create content
        let header = document.createElement("div");
        header.id = "tasselModalContentExtensionsHeader";
            let note = document.createElement("p");
            note.innerHTML = "Select the extensions you want to use. Changes might need a page reload to become active.";
            header.appendChild(note);

            let sortLabel = document.createElement("label");
            sortLabel.innerHTML = "Sort by ";
                let sorter = document.createElement("select");
                sorter.addEventListener("change", function() {
                    sortOrder = this.value;
                    displayExtensions_xcajbuzn();
                });
                sorter.innerHTML = `
                    <option value="a">A > Z</option>
                    <option value="z">Z > A</option>
                    <option value="new" selected>new > old</option>
                    <option value="old">old > new</option>
                    <option value="1.0">V1.0 > V0.1</option>
                    <option value="0.1">V0.1 > V1.0</option>
                `;
                for (let a = 0; a < sorter.children.length; a++) {
                    if (sortOrder == sorter.children[a].value) sorter.children[a].selected = true;
                }
                sortLabel.appendChild(sorter);
            header.appendChild(sortLabel);
        content.appendChild(header);

        //sort before displaying
        extensionsIndex.sort(function(one, two) {
            switch (sortOrder) {
                case "a": return one.name > two.name ? 1 : -1;
                case "z": return one.name < two.name ? 1 : -1;
                case "new": return one.updated < two.updated ? 1 : -1;
                case "old": return one.updated > two.updated ? 1 : -1;
                case "1.0": {
                    let one_ = one.version.split(".");
                    let two_ = two.version.split(".");
                    if (one_[0]*1 === two_[0]*1)
                        if (one_[1]*1 === two_[1]*1) return two_[2] - one_[2];
                        else return two_[1] - one_[1];
                    else return two_[0] - one_[0];
                }
                case "0.1": {
                    let one_ = one.version.split(".");
                    let two_ = two.version.split(".");
                    if (one_[0]*1 === two_[0]*1)
                        if (one_[1]*1 === two_[1]*1) return one_[2] - two_[2];
                        else return one_[1] - two_[1];
                    else return one_[0] - two_[0];
                }
                default: return one.updated < two.updated ? 1 : -1;
            }
        });
        let extensionsList = document.createElement("div");
        extensionsList.id = "tasselModalContentExtensionsList"

        //create extension entries in modal
        extensionsIndex.forEach(function(data, index) {
            let frame = document.createElement("section");
            frame.id = "extension"+data.id;
            frame.classList.add("tasselExtension");
                let checkboxID = "checkbox"+data.name;
                let info = document.createElement("div");

                    let title = document.createElement("label");
                    title.innerHTML = data.name;
                    title.setAttribute("for", checkboxID);
                info.appendChild(title);

                    let description = document.createElement("p");
                    description.innerHTML = data.description;
                    description.style.margin = "0";
                info.appendChild(description);

                if (data.features != null && data.features.length > 0) {
                    let details = document.createElement("details");
                    details.style.margin = "10px 0 0 10px";
                        let summary = document.createElement("summary");
                        summary.innerHTML = "Features...";
                        summary.style.marginBottom = ".5em";
                    details.appendChild(summary);
                    let list = document.createElement("ul");
                    list.style.paddingLeft = "14px";
                    list.style.margin = "0";
                    data.features.forEach(function(feature) {
                        let text = document.createElement("li");
                        text.innerHTML = feature;
                        list.appendChild(text);
                    });
                    details.appendChild(list);
                    info.appendChild(details);
                }
            frame.appendChild(info);

            let sidebar = document.createElement("div");
            sidebar.classList.add("tasselExtensionSidebar");
            let checkbox = document.createElement("input");
              checkbox.id = checkboxID;
              checkbox.title = "activate";
              checkbox.type = "checkbox";
              checkbox.setAttribute("extension", data.id);
              checkbox.addEventListener("click", function() {
                  let id = this.getAttribute("extension");
                  toggleExtension_xcajbuzn(id);
                  if (this.checked) {
                      let extension = extensionsIndex.find(function(data) {
                          return data.id == id;
                      });
                      if (!extension) return;
                      if (extension.css) loadStyle_xcajbuzn(extension.css);
                      if (extension.src) loadScript_xcajbuzn(extension.src);
                  }
              });
            let entry = settings2.extensions.find(function(value) {
                return value.id == data.id;
            });
            if (entry != null) {
                checkbox.checked = true;
            }
            sidebar.appendChild(checkbox);
            let link = document.createElement("a");
              link.classList.add("link_post");
              link.target = "_blank";
              link.title = "link to post";
              link.href = data.post;
              link.innerHTML = `<img alt="link to post" style="width:100%;" src="https://cdn.jsdelivr.net/gh/Aki-108/Tassel@50f03c59507325d27ccf9adb1a6fa46cdb6c5604/icons/link.svg">`;
            if (data.post) sidebar.appendChild(link);
            let version = document.createElement("span");
              version.classList.add("tasselExtensionVersion");
              version.innerHTML = data.version;
              version.title = `version ${data.version}, published ${new Date(data.created).toLocaleDateString()}, updated ${new Date(data.updated).toLocaleDateString()}`;
            sidebar.appendChild(version);
            let author = document.createElement("span");
              author.classList.add("tasselExtensionAuthor");
              author.innerHTML = "3rd";
              author.title = "This is a third-party extension. The author is " + data.author;
            if (data.author !== "Aki108") sidebar.appendChild(author);
            let wip = document.createElement("span");
              wip.classList.add("tasselExtensionWIP");
              wip.innerHTML = "WIP";
              wip.title = "This extension is currently in development and might not work as intended. It might be removed in the future. Use at your own risk.";
            if (data.version.split(".")[0] < 1) sidebar.appendChild(wip);
            frame.appendChild(sidebar);

            if (settings2.showWIP || data.version >= 1) extensionsList.appendChild(frame);//only display extension if it's a full version or WIPs are wanted
        });
        content.appendChild(extensionsList);

        content.appendChild(document.createElement("hr"));
        let info2 = document.createElement("div");
        info2.innerHTML = `
            <p>Icon Legend:</p>
            <ul>
                <li>
                    <img alt="link to post" style="width:25px;" src="https://cdn.jsdelivr.net/gh/Aki-108/Tassel@50f03c59507325d27ccf9adb1a6fa46cdb6c5604/icons/link.svg">
                    Link to Post: This link will take you to the announcement post of the extension.
                </li>
                <li>
                    <span style="cursor: normal;display: inline;margin: 0;" class="tasselExtensionVersion">1.0</span>
                    Version: This is the version of the extension.
                </li>
                <li>
                    <span style="cursor: normal;display: inline-block;padding-top:3px;" class="tasselExtensionAuthor">3rd</span>
                    Third-Party: This extension is from a third-party author.
                </li>
                <li>
                    <span style="cursor: normal;display: inline-block;padding-top:6px;" class="tasselExtensionWIP">WIP</span>
                    Work in Progress: This extension is currently in development and might not work as intended. It might be removed in the future. Use at your own risk.
                </li>
            </ul>
        `;
        content.appendChild(info2);

        content.appendChild(document.createElement("hr"));
        let info3 = document.createElement("p");
        info3.innerHTML = "If you enjoy an extension, consider commenting / reblogging / liking the corresponding announcement post by opening the link of the extension.";
        content.appendChild(info3);
    }

    /* Create the About page in the modal */
    function displayAbout_xcajbuzn() {
        //reset modal
        let content = document.getElementById("tasselModalContent");
        content.innerHTML = "";
        let sidebarEntries = document.getElementsByClassName("tasselModalSidebarEntry");
        Object.values(sidebarEntries).forEach(function(data, index) {
            data.classList.remove("active");
        });
        document.getElementById("tasselModalSidebarAbout").classList.add("active");

        content.innerHTML = `
          <div style="justify-content:center;display:grid;text-align:center;">
            <h2 style="margin:0;">Tassel</h2>
            <span style="margin-bottom:.5em;">by Aki108</span>
            <span style="margin-bottom:.5em;">Version ${GM_info.script.version}</span>
            <span style="margin-bottom:2.5em;">since 11th Dec 2022</span>
            <a style="margin-bottom:1em;" href="https://www.pillowfort.social/Tassel">Visit Tassel's Fort</a>
            <a style="margin-bottom:1em;" href="https://github.com/Aki-108/Tassel">Tassel on GitHub</a>
            <a style="margin-bottom:1em;" href="https://github.com/Aki-108/Tassel/wiki/Version-History">Version History</a>
          </div>
        `;
    }

    /* Create the Tassel Settings page in the modal */
    function displaySettings_xcajbuzn() {
        //reset modal
        let content = document.getElementById("tasselModalContent");
        content.innerHTML = "";
        let sidebarEntries = document.getElementsByClassName("tasselModalSidebarEntry");
        Object.values(sidebarEntries).forEach(function(data, index) {
            data.classList.remove("active");
        });
        document.getElementById("tasselModalSidebarSettings").classList.add("active");

        //header
        let info0 = document.createElement("p");
        info0.innerHTML = "Changes will become active after a page reload.";
        content.appendChild(info0);
        content.appendChild(document.createElement("hr"));

        //Notifications
        let title1 = document.createElement("h2");
        title1.innerHTML = "Notifications";
        content.appendChild(title1);
        let info1 = document.createElement("p");
        info1.innerHTML = "Notifications will show up in the bottom right corner on any Pillowfort page. They can be marked as 'read' by clicking on them.";
        content.appendChild(info1);
        content.appendChild(createSwitch_xcajbuzn("Get Notifications for Active Extensions", settings2.notify.active ? "checked" : ""));
        content.lastChild.children[0].addEventListener("change", function() {
            settings2.notify.active = this.checked;
            saveSettings_xcajbuzn();
        });
        content.appendChild(createSwitch_xcajbuzn("Get Notifications for Inactive Extensions", settings2.notify.inactive ? "checked" : ""));
        content.lastChild.children[0].addEventListener("change", function() {
            settings2.notify.inactive = this.checked;
            saveSettings_xcajbuzn();
        });
        content.appendChild(createSwitch_xcajbuzn("Get Notifications for New Extensions", settings2.notify.new ? "checked" : ""));
        content.lastChild.children[0].addEventListener("change", function() {
            settings2.notify.new = this.checked;
            saveSettings_xcajbuzn();
        });

        //Appearance
        content.appendChild(document.createElement("hr"));
        let title2 = document.createElement("h2");
        title2.innerHTML = "Appearance";
        content.appendChild(title2);
        content.appendChild(createSwitch_xcajbuzn("Highlight Linked Comments", settings2.highlightComments ? "checked" : ""));
        content.lastChild.children[0].addEventListener("change", function() {
            settings2.highlightComments = this.checked;
            saveSettings_xcajbuzn();
        });
        content.appendChild(createSwitch_xcajbuzn("Sticky Icons", settings2.stickyIcons ? "checked" : ""));
        content.lastChild.children[0].addEventListener("change", function() {
            settings2.stickyIcons = this.checked;
            saveSettings_xcajbuzn();
        });
        content.appendChild(createSwitch_xcajbuzn("Sticky Toolbars", settings2.stickyToolbar ? "checked" : ""));
        content.lastChild.children[0].addEventListener("change", function() {
            settings2.stickyToolbar = this.checked;
            saveSettings_xcajbuzn();
        });
        content.appendChild(createSwitch_xcajbuzn("Sticky Comment Headers", settings2.stickyCommentHeader ? "checked" : ""));
        content.lastChild.children[0].addEventListener("change", function() {
            settings2.stickyCommentHeader = this.checked;
            saveSettings_xcajbuzn();
        });
        content.appendChild(createSwitch_xcajbuzn("Turn Golden Icons Blue", settings2.goldToBlue ? "checked" : ""));
        content.lastChild.children[0].addEventListener("change", function() {
            settings2.goldToBlue = this.checked;
            saveSettings_xcajbuzn();
        });
        content.appendChild(createSwitch_xcajbuzn("Hide Avatar Frames", settings2.noFrames ? "checked" : ""));
        content.lastChild.children[0].addEventListener("change", function() {
            settings2.noFrames = this.checked;
            saveSettings_xcajbuzn();
        });
        content.appendChild(createSwitch_xcajbuzn("Expand Notifications", settings2.expandNotes ? "checked" : ""));
        content.lastChild.children[0].addEventListener("change", function() {
            settings2.expandNotes = this.checked;
            saveSettings_xcajbuzn();
        });
        let section1 = document.createElement("details");
        section1.id = "tasselSettingsSidebarSection";
        content.appendChild(section1);
        section1.innerHTML = `<summary><h3>Sidebar</h3>${createTooltip_xcajbuzn("Click the arrow to view more sidebar options.").outerHTML}</summary>`;
        section1.appendChild(createSwitch_xcajbuzn("Shorten Expanded Sidebar", settings2.shortenSidebar ? "checked" : ""));
        section1.lastChild.children[0].addEventListener("change", function() {
            settings2.shortenSidebar = this.checked;
            saveSettings_xcajbuzn();
        });
        section1.appendChild(createSwitch_xcajbuzn("Add a button to view the full sidebar", settings2.sidebar.expandedEpander ? "checked" : ""));
        section1.lastChild.children[0].addEventListener("change", function() {
            settings2.sidebar.expandedEpander = this.checked;
            saveSettings_xcajbuzn();
        });
        let heading1 = document.createElement("h4");
        heading1.innerHTML = 'Expanded'
        section1.appendChild(heading1);
        section1.appendChild(createSwitch_xcajbuzn("Remove 'Post'", settings2.sidebar.expandedPost ? "checked" : ""));
        section1.lastChild.children[0].addEventListener("change", function() {
            settings2.sidebar.expandedPost = this.checked;
            saveSettings_xcajbuzn();
        });
        section1.appendChild(createSwitch_xcajbuzn("Remove 'Drafts'", settings2.sidebar.expandedDrafts ? "checked" : ""));
        section1.lastChild.children[0].addEventListener("change", function() {
            settings2.sidebar.expandedDrafts = this.checked;
            saveSettings_xcajbuzn();
        });
        section1.appendChild(createSwitch_xcajbuzn("Remove 'Queue'", settings2.sidebar.expandedQueue ? "checked" : ""));
        section1.lastChild.children[0].addEventListener("change", function() {
            settings2.sidebar.expandedQueue = this.checked;
            saveSettings_xcajbuzn();
        });
        section1.appendChild(createSwitch_xcajbuzn("Remove 'Inbox'", settings2.sidebar.expandedInbox ? "checked" : ""));
        section1.lastChild.children[0].addEventListener("change", function() {
            settings2.sidebar.expandedInbox = this.checked;
            saveSettings_xcajbuzn();
        });
        section1.appendChild(createSwitch_xcajbuzn("Remove 'Notifications'", settings2.sidebar.expandedNotifications ? "checked" : ""));
        section1.lastChild.children[0].addEventListener("change", function() {
            settings2.sidebar.expandedNotifications = this.checked;
            saveSettings_xcajbuzn();
        });
        section1.appendChild(createSwitch_xcajbuzn("Remove 'Subscriptions'" + createTooltip_xcajbuzn("This is part of the Post Subscriber extension.").outerHTML, settings2.sidebar.expandedSubscriptions ? "checked" : ""));
        section1.lastChild.children[0].addEventListener("change", function() {
            settings2.sidebar.expandedSubscriptions = this.checked;
            saveSettings_xcajbuzn();
        });
        section1.appendChild(createSwitch_xcajbuzn("Remove 'Communities'", settings2.sidebar.expandedCommunities ? "checked" : ""));
        section1.lastChild.children[0].addEventListener("change", function() {
            settings2.sidebar.expandedCommunities = this.checked;
            saveSettings_xcajbuzn();
        });
        section1.appendChild(createSwitch_xcajbuzn("Remove 'Search'", settings2.sidebar.expandedSearch ? "checked" : ""));
        section1.lastChild.children[0].addEventListener("change", function() {
            settings2.sidebar.expandedSearch = this.checked;
            saveSettings_xcajbuzn();
        });
        section1.appendChild(createSwitch_xcajbuzn("Remove 'Filters & Blacklist' / 'Advanced Blacklist'", settings2.sidebar.expandedFilters ? "checked" : ""));
        section1.lastChild.children[0].addEventListener("change", function() {
            settings2.sidebar.expandedFilters = this.checked;
            saveSettings_xcajbuzn();
        });
        section1.appendChild(createSwitch_xcajbuzn("Remove 'Blocked Users'", settings2.sidebar.expandedBlocklist ? "checked" : ""));
        section1.lastChild.children[0].addEventListener("change", function() {
            settings2.sidebar.expandedBlocklist = this.checked;
            saveSettings_xcajbuzn();
        });
        section1.appendChild(createSwitch_xcajbuzn("Remove 'PF Premium'", settings2.sidebar.expandedPremium ? "checked" : ""));
        section1.lastChild.children[0].addEventListener("change", function() {
            settings2.sidebar.expandedPremium = this.checked;
            saveSettings_xcajbuzn();
        });
        section1.appendChild(createSwitch_xcajbuzn("Remove 'Settings'", settings2.sidebar.expandedSettings ? "checked" : ""));
        section1.lastChild.children[0].addEventListener("change", function() {
            settings2.sidebar.expandedSettings = this.checked;
            saveSettings_xcajbuzn();
        });
        section1.appendChild(createSwitch_xcajbuzn("Remove 'Tassel'", settings2.sidebar.expandedTassel ? "checked" : ""));
        section1.lastChild.children[0].addEventListener("change", function() {
            settings2.sidebar.expandedTassel = this.checked;
            saveSettings_xcajbuzn();
        });
        section1.appendChild(createSwitch_xcajbuzn("Remove 'Followers'", settings2.sidebar.expandedFollowers ? "checked" : ""));
        section1.lastChild.children[0].addEventListener("change", function() {
            settings2.sidebar.expandedFollowers = this.checked;
            saveSettings_xcajbuzn();
        });
        section1.appendChild(createSwitch_xcajbuzn("Remove 'Following'", settings2.sidebar.expandedFollowing ? "checked" : ""));
        section1.lastChild.children[0].addEventListener("change", function() {
            settings2.sidebar.expandedFollowing = this.checked;
            saveSettings_xcajbuzn();
        });
        section1.appendChild(createSwitch_xcajbuzn("Remove 'Mutuals'", settings2.sidebar.expandedMutuals ? "checked" : ""));
        section1.lastChild.children[0].addEventListener("change", function() {
            settings2.sidebar.expandedMutuals = this.checked;
            saveSettings_xcajbuzn();
        });
        section1.appendChild(createSwitch_xcajbuzn("Remove 'Invites'", settings2.sidebar.expandedInvites ? "checked" : ""));
        section1.lastChild.children[0].addEventListener("change", function() {
            settings2.sidebar.expandedInvites = this.checked;
            saveSettings_xcajbuzn();
        });
        section1.appendChild(createSwitch_xcajbuzn("Remove 'Donate!'", settings2.sidebar.expandedDonations ? "checked" : ""));
        section1.lastChild.children[0].addEventListener("change", function() {
            settings2.sidebar.expandedDonations = this.checked;
            saveSettings_xcajbuzn();
        });
        section1.appendChild(createSwitch_xcajbuzn("Remove 'About & Contact'", settings2.sidebar.expandedAbout ? "checked" : ""));
        section1.lastChild.children[0].addEventListener("change", function() {
            settings2.sidebar.expandedAbout = this.checked;
            saveSettings_xcajbuzn();
        });
        let heading2 = document.createElement("h4");
        heading2.innerHTML = 'Collapsed'
        section1.appendChild(heading2);
        section1.appendChild(createSwitch_xcajbuzn("Remove 'New Post'", settings2.sidebar.collapsedPost ? "checked" : ""));
        section1.lastChild.children[0].addEventListener("change", function() {
            settings2.sidebar.collapsedPost = this.checked;
            saveSettings_xcajbuzn();
        });
        section1.appendChild(createSwitch_xcajbuzn("Remove 'Inbox'", settings2.sidebar.collapsedInbox ? "checked" : ""));
        section1.lastChild.children[0].addEventListener("change", function() {
            settings2.sidebar.collapsedInbox = this.checked;
            saveSettings_xcajbuzn();
        });
        section1.appendChild(createSwitch_xcajbuzn("Remove 'Notifications'", settings2.sidebar.collapsedNotifications ? "checked" : ""));
        section1.lastChild.children[0].addEventListener("change", function() {
            settings2.sidebar.collapsedNotifications = this.checked;
            saveSettings_xcajbuzn();
        });
        section1.appendChild(createSwitch_xcajbuzn("Remove 'Subscriptions'" + createTooltip_xcajbuzn("This is part of the Post Subscriber extension.").outerHTML, settings2.sidebar.collapsedSubscriptions ? "checked" : ""));
        section1.lastChild.children[0].addEventListener("change", function() {
            settings2.sidebar.collapsedSubscriptions = this.checked;
            saveSettings_xcajbuzn();
        });
        section1.appendChild(createSwitch_xcajbuzn("Remove 'Communities'", settings2.sidebar.collapsedCommunities ? "checked" : ""));
        section1.lastChild.children[0].addEventListener("change", function() {
            settings2.sidebar.collapsedCommunities = this.checked;
            saveSettings_xcajbuzn();
        });
        section1.appendChild(createSwitch_xcajbuzn("Remove 'Filters & Blacklist' / 'Advanced Blacklist'", settings2.sidebar.collapsedFilters ? "checked" : ""));
        section1.lastChild.children[0].addEventListener("change", function() {
            settings2.sidebar.collapsedFilters = this.checked;
            saveSettings_xcajbuzn();
        });
        section1.appendChild(createSwitch_xcajbuzn("Remove 'Blocked Users'", settings2.sidebar.collapsedBlocklist ? "checked" : ""));
        section1.lastChild.children[0].addEventListener("change", function() {
            settings2.sidebar.collapsedBlocklist = this.checked;
            saveSettings_xcajbuzn();
        });
        section1.appendChild(createSwitch_xcajbuzn("Remove 'Settings'", settings2.sidebar.collapsedSettings ? "checked" : ""));
        section1.lastChild.children[0].addEventListener("change", function() {
            settings2.sidebar.collapsedSettings = this.checked;
            saveSettings_xcajbuzn();
        });
        section1.appendChild(createSwitch_xcajbuzn("Remove 'Tassel'", settings2.sidebar.collapsedTassel ? "checked" : ""));
        section1.lastChild.children[0].addEventListener("change", function() {
            settings2.sidebar.collapsedTassel = this.checked;
            saveSettings_xcajbuzn();
        });
        let section2 = document.createElement("details");
        section2.id = "tasselSettingsFooterSection";
        content.appendChild(section2);
        section2.innerHTML = `<summary><h3>Post Footer</h3>${createTooltip_xcajbuzn("Click the arrow to view more post footer options.").outerHTML}</summary>`;
        section2.appendChild(createSwitch_xcajbuzn("Swap left and right", settings2.postFooter.swapLeftRight ? "checked" : ""));
        section2.lastChild.children[0].addEventListener("change", function() {
            settings2.postFooter.swapLeftRight = this.checked;
            saveSettings_xcajbuzn();
        });
        let info2 = document.createElement("p");
        info2.innerHTML = "Position values of zero are the default and have no effect.";
        section2.appendChild(info2);
        let heading3 = document.createElement("h4");
        heading3.innerHTML = 'Interaction Area'
        section2.appendChild(heading3);
        section2.appendChild(createNumericInput_xcajbuzn("Comment Position", settings2.postFooter.comments));
        section2.lastChild.children[0].addEventListener("change", function() {
            settings2.postFooter.comments = this.value;
            saveSettings_xcajbuzn();
        });
        section2.appendChild(createNumericInput_xcajbuzn("Reblog Position", settings2.postFooter.reblog));
        section2.lastChild.children[0].addEventListener("change", function() {
            settings2.postFooter.reblog = this.value;
            saveSettings_xcajbuzn();
        });
        section2.appendChild(createNumericInput_xcajbuzn("Like Position", settings2.postFooter.like));
        section2.lastChild.children[0].addEventListener("change", function() {
            settings2.postFooter.like = this.value;
            saveSettings_xcajbuzn();
        });
        section2.appendChild(createNumericInput_xcajbuzn("Permalink Position" + createTooltip_xcajbuzn("This refers to the bottom permalink you can add with Tassel.").outerHTML, settings2.postFooter.permalink));
        section2.lastChild.children[0].addEventListener("change", function() {
            settings2.postFooter.permalink = this.value;
            saveSettings_xcajbuzn();
        });
        section2.appendChild(createNumericInput_xcajbuzn("Subscribe Position" + createTooltip_xcajbuzn("Post subscribing is part of the Post Subscriber extension.").outerHTML, settings2.postFooter.subscribe));
        section2.lastChild.children[0].addEventListener("change", function() {
            settings2.postFooter.subscribe = this.value;
            saveSettings_xcajbuzn();
        });
        section2.appendChild(createNumericInput_xcajbuzn("Activity Position" + createTooltip_xcajbuzn("The activity timestamp is part of the Time Format extension.").outerHTML, settings2.postFooter.activity));
        section2.lastChild.children[0].addEventListener("change", function() {
            settings2.postFooter.activity = this.value;
            saveSettings_xcajbuzn();
        });
        let heading4 = document.createElement("h4");
        heading4.innerHTML = 'Flagging Area'
        section2.appendChild(heading4);
        section2.appendChild(createNumericInput_xcajbuzn("Flag Position", settings2.postFooter.flag));
        section2.lastChild.children[0].addEventListener("change", function() {
            settings2.postFooter.flag = this.value;
            saveSettings_xcajbuzn();
        });
        section2.appendChild(createNumericInput_xcajbuzn("Edit Position", settings2.postFooter.edit));
        section2.lastChild.children[0].addEventListener("change", function() {
            settings2.postFooter.edit = this.value;
            saveSettings_xcajbuzn();
        });
        section2.appendChild(createNumericInput_xcajbuzn("Delete Position", settings2.postFooter.delete));
        section2.lastChild.children[0].addEventListener("change", function() {
            settings2.postFooter.delete = this.value;
            saveSettings_xcajbuzn();
        });
        section2.appendChild(createNumericInput_xcajbuzn("Block Position" + createTooltip_xcajbuzn("Post blocking is part of the Advanced Blacklist extension.").outerHTML, settings2.postFooter.blockPost));
        section2.lastChild.children[0].addEventListener("change", function() {
            settings2.postFooter.blockPost = this.value;
            saveSettings_xcajbuzn();
        });

        //Other
        content.appendChild(document.createElement("hr"));
        let title4 = document.createElement("h2");
        title4.innerHTML = "Other";
        content.appendChild(title4);
        content.appendChild(createSwitch_xcajbuzn("Show Experimental Extensions in the List", settings2.showWIP ? "checked" : ""));
        content.lastChild.children[0].addEventListener("change", function() {
            settings2.showWIP = this.checked;
            saveSettings_xcajbuzn();
        });
        content.appendChild(createSwitch_xcajbuzn("Add Permalink to Post-Footer", settings2.bottomPermalink ? "checked" : ""));
        content.lastChild.children[0].addEventListener("change", function() {
            settings2.bottomPermalink = this.checked;
            saveSettings_xcajbuzn();
        });
        content.appendChild(createSwitch_xcajbuzn("Remember Privacy Settings", settings2.rememberPostSettings ? "checked" : ""));
        content.lastChild.children[0].addEventListener("change", function() {
            settings2.rememberPostSettings = this.checked;
            saveSettings_xcajbuzn();
        });
        content.appendChild(createSwitch_xcajbuzn("Debug Mode", settings2.debug ? "checked" : ""));
        content.lastChild.children[0].addEventListener("change", function() {
            settings2.debug = this.checked;
            saveSettings_xcajbuzn();
        });

        //Data Management
        content.appendChild(document.createElement("hr"));
        let title3 = document.createElement("h2");
        title3.innerHTML = "Data";
        content.appendChild(title3);
        let grid3 = document.createElement("div");
        grid3.id = "tasselSettingsData";
        let select3 = document.createElement("select");
        select3.id = "tasselResetSelect";
        select3.setAttribute("aria-label", "data group");
        select3.innerHTML = `
            <option value="tasselSettings2">Tassel Settings</option>
            <option value="tasselAdvancedBlacklist">Advanced Blacklist</option>
            <option value="tasselBlocklistAnnotations">Blocklist Annotations</option>
            <option value="tasselJsonManager">JSON Manager</option>
            <option value="tasselModerationAid">Moderation Aid</option>
            <option value="tasselNoteDetails">Note Details</option>
            <option value="tasselPostSubscriber">Post Subscriber</option>
            <option value="tasselSidebarCounts">Sidebar Counts</option>
            <option value="tasselTaggingTools">Tagging Tools</option>
            <option value="tasselUserMuting">User Muting</option>
        `;
        grid3.appendChild(select3);
        let button2 = document.createElement("button");
        button2.id = "tasselJSONViewButton";
        button2.innerHTML = "View";
        button2.classList.add("tasselButton");
        button2.addEventListener("click", function() {
            let viewFrame = document.getElementById("tasselJSONView");
            if (viewFrame) {
                viewFrame.value = JSON.stringify(JSON.parse(localStorage.getItem(document.getElementById("tasselResetSelect").value)), null, 2);
            } else {
                viewFrame = document.createElement("textarea");
                viewFrame.id = "tasselJSONView";
                viewFrame.disabled = true;
                viewFrame.rows = 200;
                viewFrame.value = JSON.stringify(JSON.parse(localStorage.getItem(document.getElementById("tasselResetSelect").value)), null, 2);
                document.getElementById("tasselModalContent").appendChild(viewFrame);
            }
        });
        grid3.appendChild(button2);
        let button3 = document.createElement("button");
        button3.innerHTML = "Edit";
        button3.classList.add("tasselButton");
        button3.addEventListener("click", function() {
            if (this.classList.contains("tasselSaveButton")) {
                let viewFrame = document.getElementById("tasselJSONView");
                let editedData;
                try {
                    editedData = JSON.parse(viewFrame.value);
                    viewFrame.disabled = true;
                    localStorage.setItem(document.getElementById("tasselResetSelect").value, JSON.stringify(editedData));
                    this.innerHTML = "Edit";
                    this.classList.remove("tasselSaveButton");
                } catch {
                    if (confirm("Error: Data invalid. Revert changes?") === true) {
                        document.getElementById("tasselJSONViewButton").click();
                    }
                }
            } else {
                document.getElementById("tasselJSONViewButton").click();
                if (confirm("Warning: Editing any value might break parts of Tassel. Do you want to continue?") === true) {
                    let viewFrame = document.getElementById("tasselJSONView");
                    viewFrame.disabled = false;
                    this.innerHTML = "Save";
                    this.classList.add("tasselSaveButton");
                }
            }
        });
        grid3.appendChild(button3);
        let button4 = document.createElement("button");
        button4.classList.add("tasselButton");
        button4.innerHTML = "export selected"
        button4.addEventListener("click", function() {
            let selected = document.getElementById("tasselResetSelect").value;
            let data = JSON.parse(localStorage.getItem(selected));
            let formated = {};
            formated[selected] = data;
            let d = new Date();
            downloadObject_xcajbuzn(JSON.stringify(formated), `tassel_export_${selected}_${d.getDate()}-${d.getMonth()}-${d.getFullYear()}_${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}.json`);
        });
        grid3.appendChild(button4);
        let button5 = document.createElement("button");
        button5.classList.add("tasselButton");
        button5.innerHTML = "export all"
        button5.addEventListener("click", function() {
            let options = Object.values(document.getElementById("tasselResetSelect").options);
            let formated = {};
            for (let option of options) {
                let data = JSON.parse(localStorage.getItem(option.value));
                formated[option.value] = data;
            }
            let d = new Date();
            downloadObject_xcajbuzn(JSON.stringify(formated), `tassel_export_${d.getDate()}-${d.getMonth()}-${d.getFullYear()}_${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}.json`);
        });
        grid3.appendChild(button5);
        let button6 = document.createElement("input");
        button6.id = "tasselSettingsImport";
        button6.classList.add("hidden");
        button6.innerHTML = "import"
        button6.setAttribute("type", "file");
        button6.setAttribute("accept", ".json, .txt");
        button6.addEventListener("change", function(e) {
            let file = e.target.files[0];
            if (!file) return;
            readFile_xcajbuzn(file);
        });
        grid3.appendChild(button6);
        let label6 = document.createElement("label");
        label6.style = "text-align: center;align-content: center;cursor: pointer;";
        label6.classList.add("tasselButton");
        label6.innerHTML = "import";
        label6.setAttribute("for", "tasselSettingsImport");
        label6.addEventListener("dragenter", function(e) {
            this.classList.add("dragenter");
        });
        label6.addEventListener("dragleave", function() {
            this.classList.remove("dragenter");
        });
        label6.addEventListener("dragover", function(e) {
            e.preventDefault();
        });
        label6.addEventListener("drop", function(e) {
            e.preventDefault();
            this.classList.remove("dragenter");
            //source: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop#process_the_drop
            if (e.dataTransfer.items) {
                [...e.dataTransfer.items].forEach((item, i) => {
                    if (item.kind !== "file") return;
                    const file = item.getAsFile();
                    readFile_xcajbuzn(file);
                });
            } else {
                [...e.dataTransfer.files].forEach((file, i) => {
                    readFile_xcajbuzn(file);
                });
            }
        });
        grid3.appendChild(label6);
        content.appendChild(grid3);
    }

    function getSidebarElement_xcajbuzn(href, collapsed) {
        let sidebar = Object.values(document.getElementById("expanded-bar-container").getElementsByTagName("a"));
        if (collapsed) sidebar = Object.values(document.getElementsByClassName("sidebar-collapsed")[1].children);
        for (let child of sidebar) {
            if (child.href !== href) continue;
            return child;
        }
        return null;
    }

    /* Read a JSON file and save it's data as localStorage */
    //source: https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsText#javascript
    function readFile_xcajbuzn(file) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            let data = {};
            try {
                data = JSON.parse(JSON.parse(reader.result));
            } catch {
                alert("Error: Data invalid");
                return;
            }
            let options = Object.values(document.getElementById("tasselResetSelect").options);
            for (let option of options) {
                if (!data[option.value]) continue;
                localStorage.setItem(option.value, JSON.stringify(data[option.value]));
            }
            location.reload();
        },false,);
        if (file) reader.readAsText(file);
    }

    /* Download JSON as a file */
    /* https://stackoverflow.com/a/47821215 */
    function downloadObject_xcajbuzn(object, filename) {
        var blob = new Blob([JSON.stringify(object)], {type: "application/json;charset=utf-8"});
        var url = URL.createObjectURL(blob);
        var elem = document.createElement("a");
        elem.href = url;
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }

    /* Activate / deactivate extensions */
    function toggleExtension_xcajbuzn(id) {
        let index = -1;
        let entry = settings2.extensions.find(function(item, index_) {
            if (item.id === id*1) {
                index = index_;
                return true;
            }
        });
        if (index === -1) {//activate
            settings2.extensions.push({"id": id*1, "since": Date.now()});
        } else {//deactivate
            settings2.extensions.splice(index, 1);
        }
        saveSettings_xcajbuzn();
    }

    /* Save list of active extensions to local storage */
    function saveSettings_xcajbuzn() {
        let file = JSON.parse(localStorage.getItem("tasselSettings2") || "{}");
        file.tassel = settings2;
        localStorage.setItem("tasselSettings2", JSON.stringify(file));
    }

    function addBottomPermalink_xcajbuzn() {
        if (tasselJsonManager.feed.type === 'drafts') return;
        if (tasselJsonManager.feed.type === 'queue') return;
        if (tasselJsonManager.feed.type === 'schedule') return;
        let links = Object.values(document.getElementsByClassName("link_post"));
        links.forEach(function(item) {
            let post = item;
            for (let a = 0; a < 100 && !post.classList.contains("post-container"); a++) {
                post = post.parentNode;
            }
            let nav = post.getElementsByClassName("post-nav-left")[0];
            if (nav.classList.contains("tasselPermalinked")) return;
            nav.classList.add("tasselPermalinked");
            let link = item.cloneNode(true);
            link.classList.add("tasselPermalinked");
            link.style = "margin: 0 0 0 20px;";
            nav.appendChild(link);
        });
    }

    function setPrivacySettings_xcajbuzn() {
        if (!document.getElementById("privacy")) return;
        //init settings
        if (!settings2.postSettings) settings2.postSettings = {};

        //add events to save changes
        document.getElementById("privacy").addEventListener("change", function() {
            settings2.postSettings.viewable = this.selectedIndex;
            saveSettings_xcajbuzn();
        });
        document.getElementsByClassName("privacy-post")[0].getElementsByTagName("input").rebloggable.parentNode.addEventListener("click", function() {
            settings2.postSettings.rebloggable = !this.firstChild.checked;
            saveSettings_xcajbuzn();
        });
        document.getElementsByClassName("privacy-post")[0].getElementsByTagName("input").commentable.parentNode.addEventListener("click", function() {
            settings2.postSettings.commentable = !this.firstChild.checked;
            saveSettings_xcajbuzn();
        });
        document.getElementsByClassName("privacy-post")[0].getElementsByTagName("input").nsfw.parentNode.addEventListener("click", function() {
            settings2.postSettings.nsfw = !this.firstChild.checked;
            saveSettings_xcajbuzn();
        });

        //set settings
        document.getElementById("privacy").selectedIndex = (settings2.postSettings.viewable < document.getElementById("privacy").length ? settings2.postSettings.viewable : 0) || 0;
        if (settings2.postSettings.rebloggable === false) document.getElementsByClassName("toggle")[2].click();
        if (settings2.postSettings.commentable === false) document.getElementsByClassName("toggle")[3].click();
        if (settings2.postSettings.nsfw === true) document.getElementsByClassName("toggle")[4].click();
    }

    /* Create an icon with hover popup */
    function createTooltip_xcajbuzn(content) {
        let icon = document.createElement("div");
        icon.classList.add("tasselInfo");
        icon.innerHTML = `
            <div class='tasselTooltip'>
                <div class='tasselTooltipBubble'>
                    ${content}
                </div>
            </div>
        `;
        return icon;
    }

    /* Create an HTML element of a checkbox with lable */
    function createSwitch_xcajbuzn(title="", state="", _class=Math.random()) {
        let id = "tasselSwitch" + Math.random();
        let toggle = document.createElement("div");
        toggle.classList.add("tasselToggle");
        toggle.innerHTML = `
          <input id="${id}" type="checkbox" class="${_class}" ${state}>
          <label for="${id}">${title}</label>
        `;
        return toggle;
    }

    /* Create an HTML element of a numeric input field with a label */
    function createNumericInput_xcajbuzn(title="", value=0, _class=Math.random()) {
        let id = "tasselNumeric" + Math.random();
        let frame = document.createElement("div");
        frame.classList.add("tasselNumeric");
        frame.innerHTML = `
          <input id="${id}" type="number" class="${_class}" value="${value}">
          <label for="${id}">${title}</label>
        `;
        return frame;
    }
})();
