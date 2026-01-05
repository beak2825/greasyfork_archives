// ==UserScript==
// @name            Facebook Videos Downloader - Fork
// @description     Add download links for facebook videos (support video on newfeeds and single video page). Fork from EThaiZone version.
// @author          nhtera
// @match     //*.facebook.com/
// @version 0.0.3.1
// @namespace https://greasyfork.org/users/16893
// @downloadURL https://update.greasyfork.org/scripts/13467/Facebook%20Videos%20Downloader%20-%20Fork.user.js
// @updateURL https://update.greasyfork.org/scripts/13467/Facebook%20Videos%20Downloader%20-%20Fork.meta.js
// ==/UserScript==

(function () {
    
    // Get the side bar so we can append to it later
    var sidebar = document.getElementById('fbPhotoPageActions');
    
    function closest(el, selector) {
        var matchesFn;

        // find vendor prefix
        ['matches','webkitMatchesSelector','mozMatchesSelector','msMatchesSelector','oMatchesSelector'].some(function(fn) {
            if (typeof document.body[fn] == 'function') {
                matchesFn = fn;
                return true;
            }
            return false;
        })

        // traverse parents
        while (el!==null) {
            var parent = el.parentElement;
            if (parent!==null && parent[matchesFn](selector)) {
                return parent;
            }
            el = parent;
        }

        return null;
    }
    
    function isElementInViewport (el) {

        //special bonus for those using jQuery
        if (typeof jQuery === "function" && el instanceof jQuery) {
            el = el[0];
        }

        var rect = el.getBoundingClientRect();

        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
        );
    }

    function renderFBDownloader(counter) {

        // Get all the <embed> elements
        var embedElements = document.querySelectorAll('embed[flashvars]');

        // Flag if we found the video url or not
        var found = false;

        for (var i = 0; i < embedElements.length; i++) {
            
                    debugger
            // Get the flashvars attribute and decode it
            var flashvars = decodeURIComponent(embedElements[i].getAttribute('flashvars'));
            var videoDiv = closest(embedElements[i], "div"); //"video");
            if (videoDiv)  videoDiv = videoDiv.parentNode
            else videoDiv = embedElements[i].parentNode ;

            // Check if this string contains the code we're looking for
            var hd_src_index = flashvars.indexOf('hd_src');
            var p_width_index = flashvars.indexOf('&width=');
            if (hd_src_index > -1 && p_width_index > -1) {
                // This string contains the payload we are looking for so parse it
                var obj = JSON.parse(flashvars.slice(7, p_width_index));
                //var video_data = obj.video_data[0];
                var video_data = obj.video_data.progressive[0];

                //var title = video_data.video_id;
                var title = video_data.video_id;
                if(document.querySelectorAll('h2.uiHeaderTitle')[0] !== undefined){
                    if(document.querySelectorAll('h2.uiHeaderTitle')[0].innerText.length > 0){
                        title = document.querySelectorAll('h2.uiHeaderTitle')[0].innerText;
                    }
                }

                // High Def
                if (video_data.hd_src)
                {
                    var hd_link = document.createElement('a');
                    hd_link.href = video_data.hd_src;
                    hd_link.innerHTML = 'Download HD Video';
                    hd_link.className = 'fbPhotosPhotoActionsItem';
                    hd_link.download = title + '_hd.mp4';
                    hd_link.target = "_blank";
                    hd_link.style.position  = "relative";
                    hd_link.style.zIndex = 9999;
                    
                    
                    if(sidebar){
                        if(!sidebar.getAttribute("data-linkdownhdloadadded")){
                            sidebar.appendChild(hd_link);
                            sidebar.setAttribute('data-linkdownhdloadadded', true);
                        }
                    }
                    
                    if(videoDiv){
                        if(!videoDiv.getAttribute("data-linkdownhdloadadded")){
                            hd_link.style.margin = "5px 0 0 5px";
                            hd_link.style.color = "red";
                            hd_link.style.cssFloat = "left";
                            videoDiv.appendChild(hd_link);
                            videoDiv.setAttribute('data-linkdownhdloadadded', true);
                        }
                    }
                }

                // Low Def
                if (video_data.sd_src)
                {
                    var sd_link = document.createElement('a');
                    sd_link.href = video_data.sd_src;
                    sd_link.innerHTML = 'Download SD Video';
                    sd_link.className = 'fbPhotosPhotoActionsItem';
                    sd_link.download = title + '_sd.mp4';
                    sd_link.target = "_blank";
                    sd_link.style.position  = "relative";
                    sd_link.style.zIndex = 9999;
                    
                    if(sidebar){
                        if(!sidebar.getAttribute("data-linkdownsdloadadded")){
                            sidebar.appendChild(sd_link);
                            sidebar.setAttribute('data-linkdownsdloadadded', true);
                        }
                    }
                    
                    if(videoDiv){
                        if(!videoDiv.getAttribute("data-linkdownsdloadadded")){
                            sd_link.style.color = "red";
                            sd_link.style.cssFloat = "right";
                            sd_link.style.margin = "5px 5px 0 0";
                            videoDiv.appendChild(sd_link);
                            videoDiv.setAttribute('data-linkdownsdloadadded', true);
                        }
                    }
                }

                found = true;
            } // end if

        } // end loop

        if (!found && counter > 20) {
            //var not_found = document.createElement('span');
            //not_found.innerHTML = 'No download link :(';
            //sidebar.appendChild(not_found);
        }
        
        return found;
    }

    var counter = 0;
    function doExec() {
        counter++;
        try {
            log("Find flashvars. " + counter);
            if (renderFBDownloader(counter) == true) {
                log("Video links rendered.");
            } else {
                setTimeout(doExec, 1000);
                log("Try again.");
            }
        } catch(e) {
            log("Error" + e);
            setTimeout(doExec, 1000);
        }
    }

    function log(msg) {
        //alert(msg);
        console.log("[FB Video Downloader] " + msg);
    }
    log("First Start.");
    doExec();
    
    function checkVideoInViews() {
       var videoElements = document.querySelectorAll('video');
        if(videoElements.length > 0){
            var checkVideoOnView = isElementInViewport(videoElements[0]);
            if(checkVideoOnView){
                doExec();
            }
        }
    }

    var patternfbh = /facebook\.com\/(.*?)/;
    if (!sidebar && document.URL.match(patternfbh)) {
        if (window.removeEventListener) {
            window.removeEventListener("scroll", checkVideoInViews);
        } else if (window.detachEvent) {
            window.detachEvent("scroll", checkVideoInViews);
        }
        
        if (window.addEventListener) {
            window.addEventListener("scroll", checkVideoInViews, false);
        } else if (window.attachEvent)  {
            window.attachEvent("onscroll", checkVideoInViews, false);
        }
    }
    
})();