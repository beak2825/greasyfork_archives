// ==UserScript==
// @name         Improve Mediasite
// @version      1.0
// @description  Remove distractions when watching mediasite recordings
// @author       Oliver Hinds
// @include      *mediasite.bris.ac.uk/Mediasite/Play/*
// @namespace https://greasyfork.org/users/118499
// @downloadURL https://update.greasyfork.org/scripts/29163/Improve%20Mediasite.user.js
// @updateURL https://update.greasyfork.org/scripts/29163/Improve%20Mediasite.meta.js
// ==/UserScript==

(function() {
    
    // Feature options:
    var options = {
        keypress_shows_controlbar: "False", // Pressing any key on the keyboard will reveal the controlbar just like moving your mouse - True/False
        controlbar_hover: "False", // The controlbar will not hide if your mouse is hovering over it - True/False
        use_html5: "True" // Use html5 player, which allows for control over the speed of playback - True/False
    };
    
    if (options.use_html5 == "True") {
        if (window.location.href.includes("&?usehtml5=true")) { // Check for html5
            wait(options);// Everything relies on the distracting elements existing, which only happens after the recording has initialised. Thus, we have to wait for them.
        } else {
            window.location.replace(window.location.href+"&?usehtml5=true");
        }
    } else {
        wait(options);
    }
    
    function wait(options) {
        
        if (document.getElementsByClassName("controlBar").length) { // If the controlbar element exists, hide distracting elements and create event listeners for Youtube-esque functionality
            controlBar = document.getElementsByClassName("controlBar")[0];
            controlBar.style.WebkitTransition = "bottom 0.5s";
            controlBar.style.MozTransition = "bottom 0.5s";
            
            // When mouse is moved, show controlbar. If mouse not moved for certain length of time (e.g. 2000ms), hide controlbar again
            var hide_delay;
            var listenMouse = function() {
                moveControls("show");
                clearTimeout(hide_delay);
                hide_delay = setTimeout(function() {
                    moveControls("hide");
                }, 2000);
            };
            
            document.addEventListener("mousemove", listenMouse, false); // Listen for mouse movement
            
            if (options.keypress_shows_controlbar == "True") {
                document.addEventListener("keydown", listenMouse, false); // When any key is pressed, show controlbar
            }
            
            if (options.controlbar_hover == "True") {
                // When mouse is over controlbar, don't hide controlbar even if mouse is idle
                controlBar.addEventListener("mouseover", function() {
                    document.removeEventListener("mousemove", listenMouse, false);
                    clearTimeout(hide_delay);
                }, false);

                // When mouse leaves the controlbar, resume normal behaviour. Avoids duplicate event listeners
                controlBar.addEventListener("mouseout", function() {
                    document.removeEventListener("mousemove", listenMouse, false);
                    document.addEventListener("mousemove", listenMouse, false);
                }, false);
            }
            
            hideDistractions();
        } else {
            setTimeout(wait, 200, options); // If elements are non-existent, wait another 200ms before checking again
        }
    }
    
    function moveControls(state) {
        controlBar = document.getElementsByClassName("controlBar")[0];
        stream = document.getElementsByClassName("stream")[0];
        if (state=="show") {
            controlBar.style.bottom = "0"; // Show controlbar
            document.body.style.cursor = "Default"; // Show cursor
            stream.style.cursor = "Default";
        } else {
            controlBar.style.bottom = -(controlBar.scrollHeight+15) + "px"; // Hide controlbar
            document.body.style.cursor = "None"; // Hide cursor
            stream.style.cursor = "None";
            
        }
    }
    
    function hideDistractions() {
        // Hide all the distracting and annoying elements
        stream = document.getElementsByClassName("stream")[0];
        stream.style.userSelect = "None";
        stream.style.webkitUserSelect = "None";
        stream.style.MozUserSelect = "None";
        stream.style.backgroundColor = "Black";
        
        document.getElementsByClassName("framer")[0].style.visibility = "Hidden";
        document.getElementsByClassName("banner")[0].style.visibility = "Hidden";
        document.getElementsByClassName("stage-lightbox-overlay")[0].style.visibility = "Hidden";
        document.getElementsByClassName("video-stream-overlay")[0].style.visibility = "Hidden";
        document.getElementsByClassName("stage-cycle-primary-button")[0].style.visibility = "Hidden";
        document.getElementsByClassName("toggle-stage-lightbox-button")[0].style.visibility = "Hidden";
    }
    
})();