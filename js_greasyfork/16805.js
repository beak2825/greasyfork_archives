// ==UserScript==
// @name         Bibliotik Highlight Snatched Torrents
// @version      0.1.1
// @description  Highlight torrents that you've already snatched on Bibliotik
// @namespace    bibliotik-highlight-snatched
// @author       Chameleon
// @include      http*://*bibliotik.me/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/16805/Bibliotik%20Highlight%20Snatched%20Torrents.user.js
// @updateURL https://update.greasyfork.org/scripts/16805/Bibliotik%20Highlight%20Snatched%20Torrents.meta.js
// ==/UserScript==
// We use @grant GM_getValue and GM_setValue here. The functions are used to set and retrieve data between
//  runs. We could use window.localStorage for the exact same functionality, but the data cap per site is
//  ~10MiB, which I've come up against before (.. by doing crazy things, to be sure, but still).
// With GM_get/setValue I've never had an issue with data size.

// Add the code to run into a function right away, as we'll want to be able to refresh the table once we've refreshed the snatched data
// But also call it immediately on page load
// GM_setValue('snatchedTorrents', '[]');
refreshTables();
function refreshTables()
{
    // Bibliotik's torrents are listed within an element with the class name of 'table_div'
    // '.getElementsByClassName' returns the list of elements with the given class ('table_div' in this case)
    var table_divs = document.getElementsByClassName('table_div');

    // Starting from index 0 (i=0) go to index 'table_divs.length-1' (i<table_divs.length), increasing
    //  the index by one each time through the loop (i++). 'i' is simply the name of the variable that I'm
    //  using as an index for the array of elements, table_divs
    // If there are no 'table_div' elements on the page, do nothing
    for(var i=0; i<table_divs.length; i++)
    {
        // Check if we've already added a refresh link, which we'll do by giving it a class
        var refreshLinks = table_divs[i].getElementsByClassName('refreshLink');
        // If there are no 'refreshLink's...
        if(refreshLinks.length == 0)
        {
            // ... Create and add the link
            // We can put a link to update/refresh the 'snatched' data somewhere on the table, for easy access
            // Create an a element (a link)
            var a = document.createElement('a');
            // Set it's class so that we can detect it on later runs
            // '.setAttribute' allows you to set an attribute on an element, in this case it's class
            a.setAttribute('class', 'refreshLink');
            // Set it's innerHTML (it's text, but you can put html code in there too)
            a.innerHTML = 'Refresh Snatched Data';
            // Set it's href to do nothing ('javascript:void(0);' means 'run the javascript function void with it's argument set to 0)
            a.href = 'javascript:void(0);';
            // Add an event listener for the click event - run our function whenever our link is clicked
            // '.bind' allows us to create a new function with some arguments pre-filled in, in this case the page to load and the 'a' link itself
            // 'loadPage' is a function that is written further down
            a.addEventListener('click', loadPage.bind(undefined, 1, a), false);
            // Add the link to the 'Title / Year' table header (th) element, which happens to be the second th (so at index 1)
            // '.getElementsByTagName', returns an array of elements that have that tag
            // table_divs[i].getElementsByTagName('th')[1].appendChild(a);
            //  'float: right;' is css that makes the element move to the right of it's parent element
            a.setAttribute('style', 'float: right;');
            
            var headers = table_divs[i].getElementsByTagName('th');
            for(var j=0; j<headers.length; j++) {
                if(table_divs[i].getElementsByTagName('th')[j].innerHTML.indexOf('Title') !== -1) {
                    table_divs[i].getElementsByTagName('th')[j].appendChild(a);
                    break;
                }
            }
        }

        // Get the list of ids of snatched torrents
        // We save our data in JSON format, so use JSON.parse to parse it back into an array
        // Get the value from the key 'snatchedTorrents', which is where we save our data
        // And if the value doesn't exist return a string representation of an array so when JSON.parse runs on it we get an empty array
        var snatchedTorrents = JSON.parse(GM_getValue('snatchedTorrents', '[]'));
        // Load the table rows from the table_div, which are helpfully given the class 'torrent'
        var torrents = table_divs[i].getElementsByClassName('torrent');
        // a standard for loop, over the table rows
        for(var i=0; i<torrents.length; i++)
        {
            // set a variable for the current table row (tr)
            var tr = torrents[i];
            // The torrent's id is in the id attribute as 'torrent-<id>', split the id by 'torrent-' and take the second part as the id
            var id = tr.id.split('torrent-')[1];

            // Get the first link of the tr (the torrent's title)
            var firstLink = tr.getElementsByTagName('a')[0];
            // Reset the firstLink's color, in case we've run the script again and.. found we didn't actually snatch the torrent?
            // Might not be appropriate, but it's good practice to clean up after yourself, maybe
            firstLink.style.color = '';

            // a standard for loop, over the array of ids in snatchedTorrents
            // Note that we're already using the 'i' variable, and so use 'j' here
            for(var j=0; j<snatchedTorrents.length; j++)
            {
                // If the snatched torrent id is the same as the torrent's id...
                if(snatchedTorrents[j] == id)
                {
                    // Make the first link green
                    // 'green' could be an RGB hex value (#008800) or any of several formats
                    // For simple style changes it's easier to change the style attribute directly
                    //  but anything more complicated you want to use .setAttribute
                    firstLink.style.color = 'green';
                    //firstLink.style.cssText += ';color: green !important;';
                    // We found our snatchedTorrent id that matched, so we don't need to search the rest of them, use 'break' to exit the loop early
                    break;
                }
            }
        }
    }
}

function loadPage(pageToLoad, a)
{
    // Get the user's profile link. Right click on your username and Inspect the element.
    // You can see that the profile link is the first (zeroth) 'a' element inside of the ul element with the id of 'pre_header_status'
    //'.getElementById' returns a single element that has the id
    //'.href' is what the link is pointing to
    var profileLink = document.getElementById('pre_header_status').getElementsByTagName('a')[0].href;
    // Update the link's innerHTML to notify the user of what we're doing:
    a.innerHTML = 'Refreshing Snatch Data, loading page '+pageToLoad;
    // XMLHttpRequest is how you load pages from your script
    // Calling 'new XMLHttpRequest()' gives us an object/thing to work with
    var xhr = new XMLHttpRequest();
    // '.onreadystatechange', set the function that is called whenever the state/status of the page load changes
    // 'xhr_func', is a handy wrapper we will write below, and we bind some variables to it:
    //   'xhr' is the XMLHttpRequest object so it can pull the data out and check statuses
    //   'a', where to tell the user that an error has occurred 
    //   'parseSnatchesPage.bind(..)' the function it will call when it's finished loading the page
    xhr.onreadystatechange = xhr_func.bind(undefined, xhr, a, parseSnatchesPage.bind(undefined, pageToLoad, a));
    // '.open', how to get the page ("GET", a normal page load), and what page to get (our current page's url, plus the page we want to load)
    // 'window.location.href', the current pages full url
    // '&page=' adds a GET variable to the end of the url, which will override any previous 'page' variables
    xhr.open("GET", profileLink+"/snatches/?page="+pageToLoad);
    // '.send()', start loading the page
    xhr.send();
}

function parseSnatchesPage(pageToLoad, a, data)
{
    // We can dump our data into a div and run .getElement... functions on it
    // Create a div
    var div = document.createElement('div');
    // Dump data into it's innerHTML
    div.innerHTML = data;
    // Get all of the torrents on the snatches page (they all have the 'torrent' class)
    var torrents = div.getElementsByClassName('torrent');
    // Get the existing snatched torrents
    var snatchedTorrents = JSON.parse(GM_getValue('snatchedTorrents', '[]'));
    // for loop over all of the torrents on the snatches page
    for(var i=0; i<torrents.length; i++)
    {
        // The torrent's id is in the id attribute as 'torrent-<id>', split the id by 'torrent-' and take the second part as the id
        var id = torrents[i].id.split('torrent-')[1];
        // for loop over all of the ids in snatchedTorrents
        for(var j=0; j<snatchedTorrents.length; j++)
        {
            // If the snatched torrent id is the same as the torrent's id...
            if(snatchedTorrents[j] == id)
            {
                // ... We're done, run the finishedParsing function...
                finishedParsing(a);
                // ... And return out of the function
                return;
            }
        }
        // If we make it to here the id is a new one, add it to snatchedTorrents
        snatchedTorrents.push(id);
    }
    // Added all of the torrents on this page, save snatchedTorrents
    // 'GM_setValue', sets the value at a key in a datastore
    // 'JSON.stringify', turns a javascript object into a string that can be parsed back into a javascript object later with JSON.parse
    GM_setValue('snatchedTorrents', JSON.stringify(snatchedTorrents));

    // Find out if there are multiple pages of snatches
    // Pages are listed in an element with the class name 'pagination'. The 'pagination' class is also used for comments, but there are no comments on the snatches page
    var pagination = div.getElementsByClassName('pagination');
    // If there are no elements with the class name 'pagination'...
    if(pagination.length == 0)
    {
        // ... We're done, run the finishedParsing function
        finishedParsing(a);
    }
    // Otherwise...
    else
    {
        // Get the as (links) from the first 'pagination'
        var as = pagination[0].getElementsByTagName('a');
        // And the last link
        var lastLink = as[as.length-1];
        // If the last a does not contain the word 'Last'...
        // '.indexOf' gives the index of the first occurrence of a string in another string, and -1 if it can't find it. so '== -1' means the string is not found
        if(lastLink.innerHTML.indexOf('Last') == -1)
        {
            // We're on the last page, and so we're done, run the finishedParsing function
            finishedParsing(a);
        }
        // Otherwise...
        else
        {
            // Increase pageToLoad
            pageToLoad++;
            // A sanity check, get the page number of the last link
            var lastPage = lastLink.href.split('?page=')[1];
            // If the last page's number is less than the page number we want to load...
            if(lastPage < pageToLoad)
            {
                // We're trying to load a page past the last page, and so we're done, run the finishedParsing function
                finishedParsing(a);
            }
            // Otherwise...
            else
            {
                // Finally, load the next page after a 1 second delay (to be polite with regards to server load)
                // 'window.setTimeout', calls a function after a certain amount of milliseconds (1000 being 1 second)
                window.setTimeout(loadPage.bind(undefined, pageToLoad, a), 1000);
            }
        }
    }
}

function finishedParsing(a)
{
    // Set the link's innerHTML
    a.innerHTML = 'Snatched Data Refreshed';
    // And refresh the torrent tables
    refreshTables();
}

// a helper function that unwraps the returned xhr value and passes it to the function that takes the data
function xhr_func(xhr, messageDiv, func)
{
    // readyState is set to 4 when the connection has finished
    if(xhr.readyState == 4)
    {
        // status is set to 200 when there were no errors (this is a HTML return code, like 404)
        if(xhr.status == 200)
            func(xhr.responseText);
        else
            messageDiv.innerHTML = 'Error loading the page';
    }
}