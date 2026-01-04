// ==UserScript==
// @name         Youtube Watch Page Fix Final
// @namespace    Andrew
// @version      1.0.1
// @description  Modifies the youtube watch page to remove bolded text, make videos smaller, restore old views and dates, and add more space between elements
// @author       Andrew
// @match        *://www.youtube.com/*
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/491921/Youtube%20Watch%20Page%20Fix%20Final.user.js
// @updateURL https://update.greasyfork.org/scripts/491921/Youtube%20Watch%20Page%20Fix%20Final.meta.js
// ==/UserScript==

(function() {
    ApplyCSS();

    function ApplyCSS() {
        var styles = document.createElement("style");
        styles.innerHTML=`


/* Removes time and date within description, we specify the span component so that we don't accidentally block hashtags in the description */
 #ytd-watch-info-text span {
  display: none;
}



/* leave some spaces between the hashtags at the top of the description */
 #ytd-watch-info-text [href*="/hashtag/"] {
  margin-right: 4px;
}


/* use this css in the future when YouTube removes the date/time built-in characteristics
#info-strings.ytd-video-primary-info-renderer {
    display: inline-block;
    color: var(--yt-spec-text-secondary);
    font-family: "Roboto","Arial",sans-serif;
    font-size: 1.4rem;
    line-height: 2rem;
    font-weight: 400;
}
*/


/* Change the video title font, font size, remove bolding, and leave some vertical space between the video and the title */
ytd-watch-metadata[title-headline-xs] h1.ytd-watch-metadata {
  margin-top: 20px;
  font-family: "Roboto",sans-serif;
  font-weight: 400;
  font-size: 18px;
}


/* Remove bold font from video section titles in search results */
ytd-shelf-renderer[modern-typography] #title.ytd-shelf-renderer {
  font-weight: 400;
}








/* create some vertical space between title and buttons (channel name, subscribe, like, dislike, save) */
#top-row.ytd-watch-metadata {
  margin-top: 10px;
}


/* make the subscribe button have the same colors as the other buttons (save, clip, etc.) */
.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled {
  color: white;
  background-color: rgba(255,255,255,0.1);
}


/* make the subscribe button have the same colors as the other buttons when hovering */
.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled:hover {
  background-color: rgba(255,255,255,0.2);
  border-color: transparent;
}


/* make the changes to the YouTube homepage bolded titles */
#title-text > .ytd-rich-shelf-renderer.style-scope{
  font-weight: 400 !important;
}



/* Removes the bold from the number of comments listed below each video */
ytd-comments-header-renderer[modern-typography] .count-text.ytd-comments-header-renderer {
  font-weight: 400;
}


/* Removes the bold from youtube channel name */
.ytd-channel-name {
  font-weight: 400;
}`

        document.head.appendChild(styles);
    }
})();






// Function to blur the tabs (videos, shorts, playlists, etc.) on youtube channel pages
// This is to solve the problem where I can't use the / keyboard shortcut to search after clicking those buttons
function blurElement(event) {
    const target = event.target;
    const tabTitle = target.hasAttribute('tab-title');

    // Check if the button is tab-title
    if (tabTitle) {
        target.blur(); // This will remove focus from the element
    }
}

// This will listen for any focusin event in the document
document.addEventListener('focusin', blurElement);







// add an event listener for when the title changes so that we can grab data on views and upload date
window.addEventListener('yt-update-title', addDateAndViews)


// Create a new element
// Use the video id and class name to give the date/views the necessary characteristics (grey, font size, etc.)
// Use the 5.5px margin at the top to leave some space between the video title and the date/views
var newElement = document.createElement('div');
newElement.id = 'info-strings';
newElement.className = 'ytd-video-primary-info-renderer';
newElement.style.marginTop = '5.5px';



function addDateAndViews() {

    // timeout is necessary to get the data to load
    var timeoutID = setTimeout(() => {

        // select the video title
        var target = document.querySelector("[id='title'][class='style-scope ytd-watch-metadata']");

        // Append the date/views to the video title
        target.appendChild(newElement);

        // scrape the views and upload date from the info-text element
        var tooltipElement = document.querySelector('[id="info-text"]');


        if (tooltipElement) {
            // Get the full text of the data
            var fullText = tooltipElement.innerText.trim();
        }


        // remove unnecessary text in the middle (abbreviated views such as "11K views") and reformat the views and date by separating them with a bullet point
        if (fullText.match(/views.*views/)) {
            // If necessary, replace 'views...views' with 'views • '
            newElement.innerText = fullText.replace(/views.*views/, "views • ");
        } else if (fullText.match(/watching now/)) {
            newElement.innerText = fullText.replace("now", "now • ");
        } else if (fullText.match(/1 view(?![s])/)) {
            newElement.innerText = fullText.replace("view", "view • ");
        } else if (fullText.match(/waiting/)) {
            newElement.innerText = fullText.replace("waiting", "waiting • ");
        } else {
            // If there is no second instance of 'views', replace the first instance of 'views' with 'views • '
            newElement.innerText = fullText.replace("views", "views • ");
        }


        // remove the top vertical space in the description if there are no hashtags or location at the top
        var element = document.querySelector('#ytd-watch-info-text');
        if (!element.querySelector('a')) {
            // Perform your action here, for example, hide the element
            element.style.display = 'none';
        } else {
            element.style.display = 'block';
        }

    }, 0);
}


// Function to remove the attribute
const removeAttribute = () => {
    const elements = document.querySelectorAll('ytd-video-renderer[use-bigger-thumbs], ytd-playlist-renderer[use-bigger-thumbs], ytd-radio-renderer[use-bigger-thumbs]');
    elements.forEach(el => {
        el.removeAttribute('use-bigger-thumbs');
    });
};

// Run the function when the script loads
removeAttribute();

// Create an observer to monitor DOM changes and remove the attribute from new elements
const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
            removeAttribute();
        }
    });
});

// Start observing the body for added nodes
observer.observe(document.body, { childList: true, subtree: true });



