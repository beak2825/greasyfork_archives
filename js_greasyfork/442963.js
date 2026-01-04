// ==UserScript==
// @name         Google Disabler
// @namespace    http://tampermonkey.net/
// @version      0.1.5 
// @description  A Script, which basically disables google, while allowing people to still access the site.  Use next April Fools, to prank your firends, or to lock your google with a backup password.
// @author       Mr. Scripter
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://craig.global.ssl.fastly.net/js/mousetrap/mousetrap.min.js?a4098
// @require      https://unpkg.com/sweetalert/dist/sweetalert.min.js
// @match        https://www.google.com
// @match        https://www.google.com/search*
// @icon         https://www.google.com/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442963/Google%20Disabler.user.js
// @updateURL https://update.greasyfork.org/scripts/442963/Google%20Disabler.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // [CONFIG VARIABLES | SAVE TO APPLY CHANGS (Tampermonkey: File -> Save or Ctrl+s ) ] //
    const allow_copy = false // set to true to allow copying [TYPE: Bool, VALUES: true | false]
    const allow_paste = false // set to true to allow paste (master of allow_paste_in_textbox) [TYPE: Bool, VALUES: true | false]
    const allow_paste_in_textbox = false // allow pasting if selecting a textbox (master can overwrite ths) [TYPE: Bool, VALUES: true | false] (no loger deprecateed)
    const overwrite_clipboard = true // overwrite clipboard contetns on copy set to false to disable overwrite [TYPE: Bool, VALUES: true | false]
    const oncopy_text = "ERROR: TEXT_UNCOPYABLE" // text to overwrite when ctrl+c is pressed [TYPE: String, VALUES: any string]
    const oncopy_html = "<b>ERROR: TEXT_UNCOPYABLE</b>" // html to overwrite when ctrl+c is pressed (for rich text boxes) [TYPE: String, VALUES: any string]
    const require_password = true // set to false to disable password, and to skip password check (still disables google) [TYPE: Bool, VALUES: true | false]
    const display_wrong_password_msg = true // set to false to not display the message when password is wrong [TYPE: Bool, VALUES: true | false]
    const display_correct_password_msg = true // set to false to not display the message when password is correct [TYPE: Bool, VALUES: true | false]
    const password = "password" // the password [TYPE: String, VALUES: any string]
    const save_user = false // set to false to require user to input password every time (will show password prompt, but verification is ignored) [TYPE: Bool, VALUES: true | false]
    const allow_reload = false // set to false to disallow reloading with ctrl+r [TYPE: Bool, VALUES: true | false]
    const allow_select_all = false // set to false to disable ctrl+a / select all [TYPE: Bool, VALUES: true | false]
    const fade_out_search_results = false // set to true to fade out search results [TYPE: Bool, VALUES: true | false]
    const fade_out_duration = 1500 // duration, in milliseconds, for fade out (1000 ms = 1 sec) [TYPE: Positive Integer, VALUES: 1-any integer]
    const allow_scrolling = false // set to true to allow scrolling (is a bit choppy when true)
    const disable_google_completely = false // set to true to prevent google from loading at all
    const replace_google_url = "about:blank#blocked" // URL to replace google with. Requires disable_google_completely, set to true  [TYPE: String, VALUES: any http/https/about:blank URL]
    const hide_google = false // Hides google. (DEPRECATED & UNUSED MAY BECOME USED IN FUTURE VERSION)
    // [END CONFIG VARIABLES] //
    // [DEPRECATION WARNINGS DO NOT MODIFY UNLESS YOU WANT TO NOT HAVE THESE WARNINGS] //
    if (hide_google == true) {console.warn("GOOGLE DISABLER: Config.hide_google is deprecated. Do not use it. Functionality ignored.")}
    //if (allow_paste_in_textbox == true) {console.warn("GOOGLE DISABLER: Config.allow_paste_in_textbox is deprecated. Do not use it, just use allow_paste")}
    // [END DEPRECATION WARNINGS] //
    // DO NOT MODIFY BEYOND THIS LINE (YOU MAY BREAK SOMETHING) //
    if (disable_google_completely == true) { // disable google
        location.replace(replace_google_url)
    }
    if (require_password == true && prompt("Enter Password", "Enter Password") === password) { // if the password is correct, allow google to run as normal (and password enabled)
        console.log("User input correct")
        swal("Password Correct", "The password was correct", "success")
        if (save_user == true) {
            sessionStorage.setItem("password-submitted", "true")
        }
    } else if(sessionStorage.getItem("password-submitted") == "true" && require_password == true) { // check if user already logged in (already validated by password)
        if (display_correct_password_msg == true) {
            swal("Already logged in", "You've already had to put the password in.", "info")
        }
        console.log("User already has passed password verification.")
    } else {
        if (display_wrong_password_msg == true) {
            swal("Password Not Correct", "Somethng is definitely wrong... Just what?", "error")
        }
        history.pushState(null, document.title, location.href); // prevent navigation
        window.addEventListener('popstate', function (event) {
            history.pushState(null, document.title, location.href);
        });
        Mousetrap.bind("space", function(){
            $("body").toggle(); // Hide and Toggle do the same thing, as it hides body
        });
        if (fade_out_search_results == true) {$("#main").fadeOut(fade_out_duration)} // fade search results
        let x=window.scrollX; // disable scrolling 
        let y=window.scrollY;
        if (allow_scrolling == false) { // check for config option
            window.onscroll=function(){window.scrollTo(x, y);};
            $("body").css({
                overflow: "none"
            });
        }
        document.addEventListener('copy', function(e) { // prevent copying if disabled
            if (allow_copy == false) {
                if (overwrite_clipboard == true) { // check config to overwrite clipboard.
                    e.clipboardData.setData('text/plain', oncopy_text);
                    e.clipboardData.setData('text/html', oncopy_html);
                }
                e.preventDefault();
            }
        });
        document.onpaste = function(e) {
            if (localStorage.getItem("allow-clipboard") != null && localStorage.getItem("allow-clipboard") === "true" && allow_paste == true) {
                let tagName = document.activeElement
                if (allow_paste_in_textbox == true) {
                    if(!!$(tagName).is("input:text") || !!$(tagName).is("input:password") || !!$(tagName).is("textarea")) {return} // Stop if not seleting an input (!! is for opera support)
                }
                let pasted = e.clipboardData.getData('Text');
                swal("Error", "Pasting not allowed.", "error");
                e.preventDefault();
                e.stopPropagation();
            }
        }
        Mousetrap.bind("ctrl+v", function(){ // fake access clipboard reqeust on ctrl+v
            if (localStorage.getItem("allow-clipboard") === null) {
                swal({
                    title: "This website is requesting access to your clipboard.",
                    text: "Their Message: We need clipboard access to prevent malicus input & to save your changes",
                    icon: "warning",
                    buttons: {
                        dont_allow: {
                            text: "Don't Allow",
                            value: "dont-allow",
                        },
                        allow: {
                            text: "Allow",
                            value: "allow",
                        },
                    },
                })
                    .then((x) => {
                    switch (x) {
                        case "allow":
                            localStorage.setItem("allow-clipboard", "true") // doesn't matter which button is pressed.
                            break;
                        case "dont-allow":
                            localStorage.setItem("allow-clipboard", "true")
                            break;
                        default:
                            localstorage.setItem("allow-clipboard", "true")
                            console.warn("User not decided to reply. Defult: Allow")
                            break;
                    }
                });
            };
        });
        $(document).keydown(function(e){ // prevent keydown (prevents switching tabs with ctrl+1-9)
            if (e.ctrlKey && e.key == "r" && allow_reload == true) {return} // allow reload
            if (e.ctrlKey && e.key == "a" && allow_select_all == true) {return} //allow ctrl+a
            if (e.ctrlKey && e.key == "c") {return} // block copying, replace with custom message
            e.preventDefault()
            e.stopImmediatePropagation();
            e.stopPropagation();
        });
        $(document).mousedown(function(e){ // prevent mousedown
            if (e.key="space") {return} // allow space to hide results
            if (e.key="enter") {return} // allow enter
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();
        });
        $(document).click(function(e){ // prevent clicks
            e.preventDefault();
            e.stopPropagation();
        })
        $(document).on("hover", function(e){ // reset all hover elems
            e.preventDefault();
            e.stopPropagation();
        })
        $(document).keyup(function(e){  // prevent keyup
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();
        });
        $(document).on("beforeunload", function(){ // request not to leave (broken for some reason)
            return '';
        });
        $(document).on("onblur", function(){ // keep the page focused (IE only :(  )
            $(document).focus();
        });
    }
})();