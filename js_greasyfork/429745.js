// ==UserScript==
// @name         Youtube Mobile Looper
// @namespace    http://tampermonkey.net/
// @version      422
// @description  Add a simple loop/unloop button to the navbar for Youtube Mobile. Made in about 15 minutes as a teaching tutorial.
// @author       Taylor Wright AKA Dildoer the Cocknight
// @match        https://m.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429745/Youtube%20Mobile%20Looper.user.js
// @updateURL https://update.greasyfork.org/scripts/429745/Youtube%20Mobile%20Looper.meta.js
// ==/UserScript==

//Pretty much finished this script: I'm not going to touch it anymore now that it works perfectly. Any design choices is up to the user within the CSS area below.
//I did however just fix a minor bug with the loop button going over top of search bar. Was a bitch to do and I had to add in another mutationobserver because fuck how CSS z-index works. Apparently just making the searchbar have a higher z-index then the button wouldn't work.

//append some CSS to the header with the += hack. You can write it like CSS and HTML between ``
document.querySelector('head').insertAdjacentHTML('beforeend', `<style>
.loopBtns{
    position: fixed;
    z-index: 5;
    top: 20px;
    left: 130px;
	font-weight: 900;
    color: silver;
}
</style>`
                                                 );

//declare some variables and create some elements
let loopBtn = document.createElement("BUTTON");
let unLoopBtn = document.createElement("BUTTON");
let appendTo = document.querySelector('body'); //Whatever you want to append to. I had to change it to body because the entire SPA kept re-rendering after every miniscule change. That's why I just made it fixed overtop the navbar. Thanks frameworks.
let url = location.href;

//detect if entry point is NOT m.youtube.com/watch
if(window.location.href.split('/')[3].substring(0, 5) !== "watch"){
    unLoopBtn.style.display = "none";
    loopBtn.style.display = "none";
}


loopBtn.innerHTML = "Loop";
unLoopBtn.innerHTML = "Unloop";
loopBtn.className = "loopBtns";
unLoopBtn.className = "loopBtns";


//make unloop class hidden, we'll unhide it and hide loop after loop is pressed and visa versa
unLoopBtn.style.display = "none";

appendTo.appendChild(loopBtn);
appendTo.appendChild(unLoopBtn);

//add some event listeners to make the video loop, hide the loop button/unloop button
loopBtn.addEventListener("click", () => {
	document.querySelector('.html5-main-video').loop = true; //I originally had a video variable and was doing video.loop, but it was causing problems if you entered through anything other than the /watch url because there wouldn't be a video to assign to that variable. So don't change this querySelector.
	unLoopBtn.style.display = "block";
	loopBtn.style.display = "none";
});

unLoopBtn.addEventListener("click", () => {
	document.querySelector('.html5-main-video').loop = false;
	unLoopBtn.style.display = "none";
	loopBtn.style.display = "block"
});

//last, listen for the video source to change and change loop button to it's off state. I practically copied this from Mozilla's mutationObserver page and changed it to only look for if the video source changes.

let loopStateObserver = () => {

    // Select the node that will be observed for mutations
    const targetNode = document.querySelector('#player');

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
        // don't worry about Internet Explorer, this is for youtube mobile and AFAIK there's no IE phone app. That's why I don't use traditional for loop here and I use arrow functions. What are the chances someone is actually going to be watching mobile youtube on their desktop in an ancient version of internet explorer anyways? At this point fuck devving for everyone, update your browser boomer.
        for(const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === "src") {
                console.log('video source changed; checking if url changed');
                //check if URL also changed
                if(url!==location.href){
                    document.querySelector('.html5-main-video').loop = false;
                    unLoopBtn.style.display = "none";
                    loopBtn.style.display = "block";
                    url = location.href;
                    console.log('updating loop button')
                }
                //this is the finishing touch. Just makes it so the button only shows up on the m.youtube.com/watch URL
                if(window.location.href.split('/')[3].substring(0, 5) !== "watch"){
                    unLoopBtn.style.display = "none";
                    loopBtn.style.display = "none";
                }
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
}

//I know I said lastly already, but I also want to lower the z-index if searchbar comes up so the loop button doesn't go overtop the searchbar. So I'm gonna throw in another observer
let searchStateObserver = () => {
    // Select the node that will be observed for mutations
    const targetNode = document.querySelector('ytm-mobile-topbar-renderer')

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        for(const mutation of mutationsList) {
            if(mutation.attributeName == "data-mode"){
                //don't use && in the top if statement, because I want to add in an else that won't trigger otherwise after the next if statement.
                if(document.querySelector('.mobile-topbar-header').dataset.mode === "searching"){
                    console.log('search mode open');
                    unLoopBtn.style.zIndex = 2;
                    loopBtn.style.zIndex = 2;
                } else{
                    console.log('search mode close');
                    unLoopBtn.style.zIndex = 5;
                    loopBtn.style.zIndex = 5;
                }
            }
        }
    };
    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);
    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
}

//Call the two observer functions. I only wrapped them in functions to keep it clean and reuse the variables I copy pasted from MDN's mutationObserver page without using retarded names like callback2 or config2
loopStateObserver();
searchStateObserver();

