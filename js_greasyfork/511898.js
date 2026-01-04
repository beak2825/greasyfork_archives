// ==UserScript==
// @name         Mediux Titlecards Fix
// @license      MIT
// @version      2.1
// @description  Adds fixes and functions to MediUx
// @author       azuravian
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @match        https://mediux.pro/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @namespace    https://greasyfork.org/users/1025348
// @downloadURL https://update.greasyfork.org/scripts/511898/Mediux%20Titlecards%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/511898/Mediux%20Titlecards%20Fix.meta.js
// ==/UserScript==

waitForKeyElements(
    "code.whitespace-pre-wrap",
    start);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isString(value) {
    return typeof value === 'string';
}

function isNonEmptyObject(obj) {
    return (
        typeof obj === 'object' &&    // Check if it's an object
        obj !== null &&                // Check that it's not null
        !Array.isArray(obj) &&         // Ensure it's not an array
        Object.keys(obj).length > 0    // Check if it has keys
    );
}

function addTooltips() {
    const buttons = [fcbutton, fpbutton, bsetbutton]; // Assuming these are your button variables

    buttons.forEach((button, index) => {
        switch (index) {
            case 0:
                button.title = "Copy links to collection images"; // Tooltip for fcbutton
                break;
            case 1:
                button.title = "Another action"; // Tooltip for fpbutton
                break;
            case 2:
                button.title = "Perform a batch action"; // Tooltip for bsetbutton
                break;
        }
    });
}

function showNotification(message) {
    // Create the notification div
    const notification = document.createElement('div');
    const myleftDiv = document.querySelector('#myleftdiv');
    const parentDiv = $(myleftDiv).parent();

    // Set the styles directly
    notification.style.width = '50%';
    notification.style.height = '50%';
    notification.style.backgroundColor = 'rgba(200, 200, 200, 0.85)'; // Semi-transparent
    notification.style.color = 'black';
    notification.style.padding = '20px';
    notification.style.borderRadius = '5px';
    notification.style.justifyContent = 'center';
    notification.style.alignItems = 'center';
    notification.style.zIndex = '1000'; // Ensure it’s on top
    notification.style.display = 'none'; // Initially hidden
    // Set the message
    notification.innerText = message;

    $(myleftDiv).after(notification);

    // Show the notification
    notification.style.display = 'flex';

    // Hide after 2-3 seconds
    setTimeout(() => {
        notification.style.display = 'none';
        parentDiv.removeChild(notification); // Remove it from the DOM
    }, 3000); // Adjust the time as needed
}

function get_posters() {
  const regexpost = /posterCheck/g
  var scriptlist = document.querySelectorAll('script')
  for (let i = scriptlist.length - 1; i >= 0; i--) {
    const element = scriptlist[i];
    if (regexpost.test(element.textContent)) {
      var str1 = element.textContent.replace('self.__next_f.push(', '');
      var str1 = str1.substring(0, str1.length - 1);
      var jsonString = JSON.parse(str1)[1].split('{"set":')[1];
      var fullJson = `{"set":${jsonString}`;
      var parsedObject = JSON.parse(fullJson.substring(0, fullJson.length - 2));
      return parsedObject.set.files;
    }
  }
}

function get_sets() {
  const regexpost = /posterCheck/g
  var scriptlist = document.querySelectorAll('script')
  for (let i = scriptlist.length - 1; i >= 0; i--) {
    const element = scriptlist[i];
    if (regexpost.test(element.textContent)) {
      var str1 = element.textContent.replace('self.__next_f.push(', '');
      var str1 = str1.substring(0, str1.length - 1);
      var jsonString = JSON.parse(str1)[1].split('{"set":')[1];
      var fullJson = `{"set":${jsonString}`;
      var parsedObject = JSON.parse(fullJson.substring(0, fullJson.length - 2));
      GM_setValue('creator', parsedObject.set.user_created.username);
      return parsedObject.set.boxset.sets;
    }
  }
}

function get_set(setnum) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://mediux.pro/sets/` + setnum,
            timeout: 30000,
            onload: (response) => {
                resolve(response.responseText); // Resolve the promise with the response
            },
            onerror: () => {
                console.log('[Mediux Fixes] An error occurred loading set ${setnum}');
                reject(new Error('Request failed'));
            },
            ontimeout: () => {
                console.log('[Mediux Fixes] It took too long to load set ${setnum}');
                reject(new Error('Request timed out'));
            }
        });
    });
}



async function load_boxset(codeblock) {
    const button = document.querySelector('#bsetbutton');
    let originalText = codeblock.textContent; // Store the original content
    originalText += `\n`;
    const sets = get_sets();
    const creator = GM_getValue('creator');
    const startTime = Date.now();
    let elapsedTime = 0;
    let latestMovieTitle = ""; // Variable to store the latest movie title

    // Replace codeblock text with a timer
    codeblock.innerText = "Processing... 0 seconds";

    const timerInterval = setInterval(() => {
        elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        codeblock.innerText = `Processing... ${elapsedTime} seconds\nProcessed Movies: ${latestMovieTitle}`;
    }, 1000);

    for (const set of sets) {
        try {
            const response = await get_set(set.id);
            const response2 = response.replaceAll('\\', '');
            const regexfiles = /"files":(\[{"id":.*?}]),"boxset":/s;
            const match = response2.match(regexfiles);


            if (match && match[1]) {
                let filesArray;
                try {
                    filesArray = JSON.parse(match[1]);
                } catch (error) {
                    console.error('Error parsing filesArray:', error);
                    return;
                }
                const filteredFiles = filesArray.filter(file => !file.title.trim().endsWith('Collection'))
                filteredFiles.sort((a, b) => a.title.localeCompare(b.title))
                for (const f of filteredFiles) {
                    if (f.movie_id !== null) {
                        const posterId = f.fileType = 'poster' && f.id.length > 0 ? f.id : 'N/A';
                        const movieId = isNonEmptyObject(f.movie_id) ? f.movie_id.id : 'N/A';
                        const movieTitle = isString(f.title) && f.title.length > 0 ? f.title.trimEnd() : 'N/A';
                        originalText += `  ${movieId}: # ${movieTitle} Poster by ${creator} on MediUX.  https://mediux.pro/sets/${set.id}\n    url_poster: https://api.mediux.pro/assets/${posterId}\n    `;
                        latestMovieTitle = latestMovieTitle + movieTitle + ', '; // Update the latest movie title
                        console.log(`Title: ${f.title}\nPoster: ${posterId}\n`);
                    }
                    else if (f.movie_id_backdrop !== null) {
                        const backdropId = f.fileType = 'backdrop' && f.id.length > 0 ? f.id : 'N/A';
                        const movieId = isNonEmptyObject(f.movie_id_backdrop) ? f.movie_id_backdrop.id : 'N/A';
                        originalText += `url_background: https://api.mediux.pro/assets/${backdropId}\n\n`
                        console.log(`Backdrop: ${backdropId}\nMovie id: ${movieId}\n`);
                    }
                }
            } else {
                console.log('No match found');
            }
        } catch (error) {
            console.error('Error fetching set:', error);
        }
    }

    // Stop the timer
    clearInterval(timerInterval);
    codeblock.innerText = "Processing complete!"; // Temporary message

    // Create a clickable link for copying the results
    const copyLink = document.createElement('a');
    copyLink.href = "#";
    copyLink.innerText = "Click here to copy the results";
    copyLink.style.color = 'blue'; // Styling for visibility
    copyLink.style.cursor = 'pointer';

    // Add click event listener to copy the results
    copyLink.addEventListener('click', async (e) => {
        e.preventDefault(); // Prevent default link behavior
        try {
            await navigator.clipboard.writeText(originalText);
            codeblock.innerText = originalText;
            color_change(button);
            showNotification("Results copied to clipboard!"); // Feedback to the user
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    });

    // Append the link to the codeblock
    codeblock.appendChild(copyLink);
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    console.log(`Total time taken: ${totalTime} seconds`);
}

function color_change(button) {
  button.classList.remove('bg-gray-500');
  button.classList.add('bg-green-500');

  // After 3 seconds, change it back to bg-gray-500
  setTimeout(() => {
    button.classList.remove('bg-green-500');
    button.classList.add('bg-gray-500');
  }, 3000); // 3000 milliseconds = 3 seconds
}

function fix_posters(codeblock) {
  const button = document.querySelector('#fpbutton');
  var yaml = codeblock.textContent;
  var posters = get_posters();
  var seasons = posters.filter((poster) => poster.title.includes("Season"));
  for (i in seasons) {
    var current = seasons.filter((season) => season.title.includes(`Season ${i}`));
    yaml = yaml + `      ${i}:\n        url_poster: https://api.mediux.pro/assets/${current[0].id}\n`;
  }
  codeblock.innerText = yaml;
  navigator.clipboard.writeText(yaml);
  showNotification("Results copied to clipboard!");
  color_change(button);
}

function fix_cards(codeblock) {
  const button = document.querySelector('#fcbutton');
  const str = codeblock.innerText;
  const regextest = /(seasons:\n)(        episodes:)/g;
  const regex = /(        episodes:)/g;
  let counter = 1;
  if (regextest.test(str)) {
    const modifiedStr = str.replace(regex, (match) => {
      const newLine = `      ${counter++}:\n`; // Create the new line with the counter
      return `${newLine}${match}`; // Return the new line followed by the match
    });
    codeblock.innerText = modifiedStr;
    navigator.clipboard.writeText(modifiedStr);
    showNotification("Results copied to clipboard!");
    color_change(button);
  }
}

function start() {
  const codeblock = document.querySelector('code.whitespace-pre-wrap');
  const myDiv = document.querySelector('.flex.flex-col.space-y-1\\.5.text-center.sm\\:text-left');
  $(myDiv).children('h2, p').wrapAll('<div class="flex flex-row" style="align-items: center"><div id="myleftdiv" style="width: 25%; align: left"></div></div>');
  const myleftdiv = document.querySelector('#myleftdiv');

  var fcbutton = $('<button id="fcbutton" title = "Fix missing season numbers in TitleCard YAML" class="duration-500 top-1 left-1 text-xs py-1 px-2 bg-gray-500 text-white rounded flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-gallery-vertical-end w-5 h-5"><path d="M7 2h10"></path><path d="M5 6h14"></path><rect width="18" height="12" x="3" y="10" rx="2"></rect></svg></button>');
    // Set the onclick event to call the runner function
    fcbutton.on('click', () => fix_cards(codeblock));

  var fpbutton = $('<button id="fpbutton" title = "Fix missing season posters YAML" class="duration-500 top-1 left-1 text-xs py-1 px-2 bg-gray-500 text-white rounded flex items-center justify-center" style="margin-left:10px""><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-gallery-horizontal-end w-5 h-5"><path d="M2 7v10"></path><path d="M6 5v14"></path><rect width="12" height="18" x="10" y="3" rx="2"></rect></svg></button>');
    // Set the onclick event to call the runner function
    fpbutton.on('click', () => fix_posters(codeblock));

  var bsetbutton = $('<button id="bsetbutton" title = "Generate YAML for associated boxset" class="duration-500 top-1 left-1 text-xs py-1 px-2 bg-gray-500 text-white rounded flex items-center justify-center" style="margin-left:10px"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-gallery-horizontal-end w-5 h-5""><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M7 7v10"></path><path d="M11 7v10"></path><path d="m15 7 2 10"></path></svg></button>');
    // Set the onclick event to call the runner function
    bsetbutton.on('click', () => load_boxset(codeblock));

  var wrappedButtons = $('<div id="extbuttons" class="flex flex-row" style="margin-top: 10px"></div>').append(fcbutton).append(fpbutton).append(bsetbutton);
  $(myleftdiv).append(wrappedButtons);
  $(myleftdiv).parent().append('<div style="width: 25%;"></div>');
}


/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.
    Usage example:
        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );
        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }
    IMPORTANT: This function requires your script to have loaded jQuery.
*/
function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = jQuery(selectorTxt);
    else
        targetNodes     = jQuery(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = jQuery(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}