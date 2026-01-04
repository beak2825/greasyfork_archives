// ==UserScript==
// @name Old new reddit redirect
// @namespace https://reddit.com/
// @description Gets rid of Reddit's new December 2023 layout.
// @version 1.2
// @author nitro2k01
// @license MIT
// @match https://reddit.com/*
// @match https://www.reddit.com/*
// @match https://new.reddit.com/*
// @exclude https://www.reddit.com/account/sso/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/482716/Old%20new%20reddit%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/482716/Old%20new%20reddit%20redirect.meta.js
// ==/UserScript==

(function() {
	var reddit_regex = /^https:\/\/(www\.)?reddit.com\/(?!media)/;
	var current_url = document.location.href;
    console.log("Old new reddit redirect running on: " + current_url);

    function install_event_listener(body_element){
        body_element.addEventListener("mouseover",(function(e){
            //console.log(e.srcElement);

            var el = e.srcElement;
            //console.log("BONK!");
            for (var i=0; i<5; i++){
                //console.log(i);
                //console.log(el);
                if(el.tagName=='A' && typeof el.href !== 'undefined' && el.href){
                    el.href=el.href.replace(reddit_regex,"http://new.reddit.com/");
                    return;
                }
                if(el.parentNode==null){
                    break;
                }

                el=el.parentNode;
            }

            // Needed for patching new new Reddit. (Media page.) Sigh...
            el=e.srcElement;
            if(el.tagName=="LEFT-NAV-COMMUNITY-ITEM"){
                //console.log(el);
                //console.log(el.shadowRoot.children[0].children[0]);
                //var sub_el=el.shadowRoot.getElementsByTagName("A")[0]; // NOPE!
                var sub_el=el.shadowRoot.children[0].children[0];
                sub_el.href=sub_el.href.replace(reddit_regex,"http://new.reddit.com/");
            }
        }));
    }

    if(null != document.getElementById("login-button") ){
		// If we're not logged in, do nothing, in order to prevent infinite redirects.
        console.log("Skipping redirect because we're not logged in.");
		return;
	}

	if(reddit_regex.test(current_url)){
		// If we're on "new new" reddit, redirect to "old new" reddit. (Except /media/)
        var new_url = current_url.replace(reddit_regex,"http://new.reddit.com/");

        console.log("Redirecting now...");
        console.log("From: " + current_url);
        console.log("To: " + new_url);

		location.replace(new_url);
	}

    // Set up an event listener to rewrite all links on demand. This listens to mouseover events that bubble down to the body element, then patch the links as needed.
    // We need to do it this way because a one time replace wouldn't catch links generated in notifications.
    console.log("Installing event listener.");

    install_event_listener(document.body)

    var shadowroot_tag_names=["post-bottom-bar", "left-nav-communities-controller"];

    function install_event_listener_shadowroot(tag_name){
        // This is used purely for patching the links on the media page (which is always on new new Reddit.)
        // Some elements in the new new layout are localized inside a "shadow root" which is basically a separate DOM. This causes events to not bubble down to the parent DOM, so we need to patch these DOMs separately.
        // Wait for shadow root of the widget to be loaded, the install the event listener.
        // Since this is an edge case I'm not wasting a bunch of time to do this properly...
        var tries=30;
        function wait_for_shadow_root(){
            var probe_el = document.getElementsByTagName(tag_name);
            if(probe_el.length && probe_el[0].shadowRoot != null){
                console.log("Found shadow root. " + tag_name);
                install_event_listener(probe_el[0].shadowRoot);
            }else{
                if(--tries){
                    console.log("Waiting for shadow root...");
                    setTimeout(wait_for_shadow_root, 50);
                }else{
                    console.log("Giving up... " + tag_name);
                }
            }

        }
        setTimeout(wait_for_shadow_root, 50);
    }
    install_event_listener_shadowroot("post-bottom-bar");

    // Patch items in the hamburger menu.
    document.getElementById("navbar-menu-button").addEventListener("click",function(){
        install_event_listener_shadowroot("left-nav-top-section");
        install_event_listener_shadowroot("reddit-recent-pages");
        install_event_listener_shadowroot("left-nav-communities-controller");
    });
})();
