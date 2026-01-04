// ==UserScript==
// @name         Google Drive - open audio in the default HTML5 player
// @namespace    googledriveaudiohtml5
// @version      1.4
// @description  An easy way to open audio in the default HTML5 player directly from Google Drive.
// @author       Skyfighteer
// @include      https://drive.google.com/*
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437676/Google%20Drive%20-%20open%20audio%20in%20the%20default%20HTML5%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/437676/Google%20Drive%20-%20open%20audio%20in%20the%20default%20HTML5%20player.meta.js
// ==/UserScript==

// to-do: check for false detection of main page and new page

if (window.location.href.indexOf('https://drive.google.com/') == 0) { // ON MAIN PAGE
    console.log('Main site has loaded in.');
    console.log('');

    // CHECK FOR NEW MEDIA GETTING DISPLAYED START //

    // wait for Aria to load
    function waitForAria(onload, callback){
        console.log('Waiting for aria...');
        let check = setInterval(function(){
            if(document.querySelector('.a-b-Vb')) { // aria-label thing
                clearInterval(check);
                callback();
            }
        }, 100);
    }

    waitForAria('', function(){ // aria loaded, creating an observer
        console.log('Aria found! Creating an observer.');
        console.log('');
        const arrow = document.querySelector('.a-b-Vb');
        const arrowobserver = new MutationObserver(function() {
            if (document.querySelector(':not([role="img"])[aria-label^="Displaying "]') || document.querySelector(':not([role="img"])[aria-label$=" megjelenítése."]')) { // preventing executing twice // LOCALIZE HERE
                cleanup();
                console.log('A (new) file is displayed.');
                menuLoad();
            }
        });
        arrowobserver.observe(arrow, { attributes: true, attributeFilter: ['aria-label'] });
    });

    // CHECK FOR NEW MEDIA GETTING DISPLAYED END //

    let run = 0;
    // first try: run is undefined -> menuwait goes in promise
    // every other unsuccessful try: run is 1 -> menuwait already started!
    // successful try: run becomes 0 again
    // note: while it might seem slower and unnecessary to do everything from the beginning every time something-
    // -new is displayed, it definitely feels safer on such a site like this one

    // WAIT FOR MENU TO LOAD START //

    function menuLoad() {
        if (run === 0) { // check if it is already in promise start //
            run = 1;
            console.log('Menu check started');
            function waitForMenu(onload, callback){
                console.log('Waiting for menu...');
                let check = setInterval(function(){
                    if(document.querySelector('.a-b-Ma-w')) { // top right menu
                        clearInterval(check);
                        callback();
                    }
                }, 100);
            }

            waitForMenu('', function(){
                console.log('Top right menu found!');
                console.log('');
                run = 0;
                main();
            });

        } // check if it is already in promise end //

        else { console.log('Still waiting for menu...'); }

    }

    // WAIT FOR MENU TO LOAD END //

    // CREATE PLACEHOLDERS, CHECK IF AUDIO OR VIDEO START //

    function main() {
        console.log('Creating placeholders...');

        // creating placeholders START //

        // creating open on new page button placeholder START //
        var btn = document.createElement("div"); // it is a div and not a button to inherit the same style as the other ones
        // global properties of button
        btn.style.userSelect = "none";
        btn.className = "a-b-v"; // to inherit style
        btn.id = ":open"; // to remove it later
        btn.onmouseover = function() {
            btn.classList.add("a-b-v-pc"); // fake grey tooltip
            btn.style.cursor = 'pointer'; // fake pointer cursor when hovering
        }
        btn.onmouseout = function() {
            btn.classList.remove("a-b-v-pc");
            btn.style.cursor = 'default';
        }
        console.log('The button has been prepared!');
        // creating open on new page button placeholder END //

        // creating separator placeholder START //
        var sep = document.createElement("div");
        sep.style.userSelect = "none";
        sep.className = "a-b-w-vc"; // same as other separators to inherit style
        sep.id = ":sep"; // to remove it later
        console.log('The separator has been prepared.');
        console.log('');
        // creating separator placeholder END //

        // creating placeholders END //

        // Filetype check START //
        console.log('Checking filetype...');

        let displayed = Array.from(document.querySelectorAll('div.a-b-Sh-ng')).find(el => el.style.display !== 'none'); // always exists
        let displayedAudioImage = displayed.lastChild.firstChild.lastChild.firstChild; // always exists, but NOT ALWAYS audio -> if it is not an audio or image, it gets declared wrong!
        let displayediFrame = displayed.lastChild.firstChild.lastChild.lastChild.firstChild; // ONLY exists when there is a video
        let videoidregex = /drive-viewer-video-player-object-\d/ // sometimes the video iframe loads in later, but this is accessible both times
        let idregexbool = videoidregex.test(displayediFrame.id); // check if regex matches with id, result is true or false

        if (displayedAudioImage.tagName === 'AUDIO') { // if it is audio START //
            console.log('It is an audio!');
            // local properties of button
            document.querySelector('.a-b-Ma-w').appendChild(btn); // append button to top right menu
            console.log('The button has been appended.');
            // insert separator
            document.querySelector('.a-b-Ma-w').insertBefore(sep, document.querySelector('[id=":open"]'));
            console.log('The separator has been inserted.');
            btn.innerHTML = "Open audio in HTML5 player"; // make previously created button visible by giving it text
            console.log('The button has been made visible.');
            console.log('');
            console.log('-------------------------------');
            console.log('');
            btn.onclick = function () {
                // check if audio does not have a source = has not been started
                if (displayedAudioImage.currentSrc === '') {
                    alert("Error: Cannot access the source of audio without playing it first.");
                }
                // check if audio has a source = has been started
                if (displayedAudioImage.currentSrc !== '') {
                    displayedAudioImage.pause();
                    let audiolinkregex = /\?e=download&authuser=\d/;
                    window.open(displayedAudioImage.currentSrc.replace(audiolinkregex, ''), '_blank');
                }
            }
        } // if it is audio END //

        if (idregexbool === true) { // if it is video START //
            console.log('It is a video!');
            // local properties of button
            document.querySelector('.a-b-Ma-w').appendChild(btn); // append button to top right menu
            console.log('The button has been appended.');
            // insert separator
            document.querySelector('.a-b-Ma-w').insertBefore(sep, document.querySelector('[id=":open"]'));
            console.log('The separator has been inserted.');
            btn.innerHTML = "Open video in HTML5 player"; // make previously created button visible by giving it text
            console.log('The button has been made visible.');
            console.log('');
            console.log('-------------------------------');
            console.log('');
            btn.onclick = function () {
                alert('Videos are not supported due to XSS protection. Look at Console for more information.');
                console.log('Videos are not supported due to XSS protection: https://stackoverflow.com/questions/6170925/get-dom-content-of-cross-domain-iframe');
            }

        } // if it is video END //

        if (displayedAudioImage.tagName === 'IMG') { // if it is image START //
            console.log('It is a picture!');
            // local properties of button
            document.querySelector('.a-b-Ma-w').appendChild(btn); // append button to top right menu
            console.log('The button has been appended.');
            // insert separator
            document.querySelector('.a-b-Ma-w').insertBefore(sep, document.querySelector('[id=":open"]'));
            console.log('The separator has been inserted.');
            btn.innerHTML = "Open image in Image Viewer"; // make previously created button visible by giving it text
            console.log('The button has been made visible.');
            console.log('');
            console.log('-------------------------------');
            console.log('');
            btn.onclick = function () {
                window.open(displayedAudioImage.currentSrc, '_blank');
            }

        } // if it is image END //

        // Filetype check END //

    }

    // CREATE PLACEHOLDERS, CHECK IF AUDIO OR VIDEO END //

    // CLEANUP FUNCTION START //

    function cleanup() {
        try{
            document.querySelector('[id=":open"]').remove();
            document.querySelector('[id=":sep"]').remove();
            console.log('');
            console.log('Cleanup done.');
            console.log('');
        }
        catch {
            console.log('');
            console.log('Nothing to cleanup.');
            console.log('');
        }
    }

    // CLEANUP FUNCTION END //

} // site check


// -------- on a new page ------------- //


if (window.location.href.indexOf('https://drive.google.com/file') == 0) { // ON NEW PAGE
    console.log('New page has loaded in.');
    console.log('');

    // wait until the menu is fully loaded
    function waitForMenu(onload, callback){
        let check = setInterval(function(){
            if(document.querySelector('.ndfHFb-c4YZDc-z5C9Gb-xl07Ob')) { // top right menu
                clearInterval(check);
                callback();
            }
        }, 100);
    }

    waitForMenu('', function(){
        // create a button
        let btn = document.createElement("div"); // it is a div and not a button to inherit the same style as the other ones
        // global properties of button
        document.querySelector('.ndfHFb-c4YZDc-z5C9Gb-xl07Ob').appendChild(btn); // top right menu
        btn.style.userSelect = "none";
        btn.className = "ndfHFb-c4YZDc-j7LFlb"; // to inherit style
        btn.id = ":open"; // to insert separator before
        btn.onmouseover = function() {
            btn.classList.add("ndfHFb-c4YZDc-j7LFlb-sn54Q"); // fake grey tooltip
            btn.style.cursor = 'pointer'; // fake pointer cursor when hovering
        }
        btn.onmouseout = function() {
            btn.classList.remove("ndfHFb-c4YZDc-j7LFlb-sn54Q");
            btn.style.cursor = 'default';
        }
        // create a separator
        let sep = document.createElement("div");
        sep.style.userSelect = "none";
        sep.className = "ndfHFb-c4YZDc-xl07Ob-hgDUwe"; // same as other separators to inherit style

        let displayed = document.querySelector('[role="main"');
        let displayedAudioImage = displayed.lastChild.firstChild.lastChild.firstChild;

        // check if it is an audio
        if (displayedAudioImage.tagName === 'AUDIO') {
            // insert separator
            document.querySelector('.ndfHFb-c4YZDc-z5C9Gb-xl07Ob').insertBefore(sep, document.querySelector('[id=":open"]'));
            // local properties of button
            btn.innerHTML = "Open audio in HTML5 player";
            btn.onclick = function () {
                // check if audio does not have a source = has not been started
                if (displayedAudioImage.currentSrc === '') {
                    alert("Error: Cannot access the source of audio without playing it first.");
                }
                // check if audio has a source = has been started
                if (displayedAudioImage.currentSrc !== '') {
                    displayedAudioImage.pause(); // pause
                    let audiolinkregex = /\?e=download&authuser=\d/;
                    window.open(displayedAudioImage.currentSrc.replace(audiolinkregex, ''), '_blank');
                }
            }
        }

        // check if it is a video
        if (document.querySelector('[property="og:video"]') !== null ) { // have to use something outside of any iframe
            // insert separator
            document.querySelector('.ndfHFb-c4YZDc-z5C9Gb-xl07Ob').insertBefore(sep, document.querySelector('[id=":open"]'));
            // local properties of button
            btn.innerHTML = "Open video in HTML5 player";
            btn.onclick = function () {
                alert('Videos are not supported due to XSS protection. Look at Console for more information.');
                console.log('Videos are not supported due to XSS protection: https://stackoverflow.com/questions/6170925/get-dom-content-of-cross-domain-iframe');
            }
        }

        // check if it is a picture
        if (displayedAudioImage.tagName === 'IMG') { // if it is image START //
            console.log('It is a picture!');
            // insert separator
            document.querySelector('.ndfHFb-c4YZDc-z5C9Gb-xl07Ob').insertBefore(sep, document.querySelector('[id=":open"]'));
            // local properties of button
            btn.innerHTML = "Open image in Image Viewer";
            btn.onclick = function () {
                window.open(displayedAudioImage.currentSrc, '_blank');
            }

        } // if it is image END //

    });

}