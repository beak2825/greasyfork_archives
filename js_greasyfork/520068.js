// ==UserScript==
// @name           Enhance Compact Color Coded ExHentai & g.E-Hentai Tags Preview 
// @description	   When you hover over a gallery it shows the tags, pink for female blue for male, shows number of pages, working with EXVisited Infinite Scroll.
// @namespace      https://sleazyfork.org/en/users/1401354-smashphoenix272
// @author         SmashPhoenix
// @author         Windsurf
// @version        1.0
// @include        http://e-hentai.org/*
// @include        https://e-hentai.org/*
// @include        http://exhentai.org/*
// @include        https://exhentai.org/*
// @require        https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/520068/Enhance%20Compact%20Color%20Coded%20ExHentai%20%20gE-Hentai%20Tags%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/520068/Enhance%20Compact%20Color%20Coded%20ExHentai%20%20gE-Hentai%20Tags%20Preview.meta.js
// ==/UserScript==
//Enhanced version based off of brozilian's v1.6https://greasyfork.org/users/212175-brozilian
//Original version based off of DP's v0.4.3.0 https://sleazyfork.org/en/scripts/24442-custom-exhentai-g-e-hentai-tags-preview, remainder of comments from that version kept below


//CHANGE FONT SIZE HERE
var fontSize = '9pt';
//IF YOU WANT THE POPUP TO THE LEFT OF THE MOUSE SET to 1, IF RIGHT SET to 0
var floatLeft = 0;

/*
v0.4.3.0
made the preview window extend upwards instead of downwards per request of: https://greasyfork.org/en/forum/discussion/13956/x

v0.4.2.1
fix for g.e-hentai.org -> e-hentai gallery url change
+ the url for g.e-hentai.org gallery got changed to just the e-hentai.org domain

v0.4.2.0
made #info_div box MUCH easier to read
+ add margins all around to separate namespaces
replaced </br> with <div> tags
+ this removed code that got rid of any extra new lines at the beginning
+ </br> tags are no longer neccesary with the div tags adding margins
replaced <b> with <span> tags


v0.4.1.4
made namespaces easier to read by adding bolding and tabs
explicitly put in http and https for security purposes

v0.4.1.3
fixed the extra new line bug
the new code is used to see if there's a new line at the beginning, followed by a <br/> tag

v0.4.1.2
use regex to fix female namespace
re-ordered the namespaces to the same order as e-hentai's namespaces

known bugs:
1
+ sometimes there's an extra new line after the title

v0.4.1
based on https://greasyfork.org/en/scripts/4066-exhentai-g-e-hentai-tags-preview
fixed to work on http and https
changed to use ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js to use https

separated these namespaces with new lines:
{
reclass
language
parody
character
group
artist
male
female
misc
}

known bugs:
1
+ sometimes there's an extra new line after the title
2
+ the female namespace gets cut off by a new line
+ this happens when there's a female namespace, but no male namespace

*/


/*
https://greasyfork.org/en/scripts/4066-exhentai-g-e-hentai-tags-preview
+ based off of Version 0.4 of ExHentai & g.E-Hentai Tags Preview by Federico

see:
https://greasyfork.org/en/forum/discussion/5067/x
https://greasyfork.org/en/forum/discussion/11458/x
http://stackoverflow.com/questions/5752829/regular-expression-for-exact-match-of-a-word
+ for searching for almost exact matches
http://stackoverflow.com/questions/1571648/html-tab-space-instead-of-multiple-non-breaking-spaces-nbsp
+ for adding tabs
http://stackoverflow.com/questions/3511707/apply-space-between-divs
+ adding margins between divs
http://stackoverflow.com/questions/183532/what-is-the-difference-between-html-tags-div-and-span
+ differences between div and span
https://greasyfork.org/en/scripts/21167-eh-tag-exposer-and-hider/code
+ good reference in terms of figuring out how to format and style the box
*/


// Initialize arrays outside the function scope so they persist
var tags = new Array();
var titles = new Array();
var boycolor, girlcolor, color; // Define color variables globally
var loadedGalleries = 0;
var totalGalleries = 0;
var requestQueue = [];
var isProcessingQueue = false;
var retryDelay = 2000; // 2 seconds delay for retries
var maxRetries = 3;
var CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Dynamic timing system
var requestStats = {
    minDelay: 200,    // Minimum delay between requests
    maxDelay: 1000,   // Maximum delay between requests
    currentDelay: 500,// Starting delay
    successStreak: 0, // Count of successful requests
    failureStreak: 0, // Count of failed requests
    lastResponseTime: 0,
    
    // Adjust delay based on success/failure
    adjustDelay: function(success, responseTime) {
        if (success) {
            this.failureStreak = 0;
            this.successStreak++;
            
            // Gradually decrease delay on consistent success
            if (this.successStreak >= 3) {
                this.currentDelay = Math.max(
                    this.minDelay,
                    this.currentDelay - Math.min(50, this.currentDelay * 0.1)
                );
                // Reset streak counter but maintain some momentum
                this.successStreak = 2;
            }
            
            // If response is fast, we can be more aggressive
            if (responseTime && responseTime < 1000) {
                this.currentDelay = Math.max(
                    this.minDelay,
                    this.currentDelay - Math.min(25, this.currentDelay * 0.05)
                );
            }
        } else {
            this.successStreak = 0;
            this.failureStreak++;
            
            // Exponentially increase delay on failures
            if (this.failureStreak > 0) {
                this.currentDelay = Math.min(
                    this.maxDelay,
                    this.currentDelay * (1 + (this.failureStreak * 0.5))
                );
            }
        }
        
        // Keep delay within bounds
        this.currentDelay = Math.max(this.minDelay, Math.min(this.maxDelay, this.currentDelay));
        return this.currentDelay;
    }
};

// Function to get cached data
function getCachedData(galleryId) {
    try {
        const cached = localStorage.getItem('ehpreview_' + galleryId);
        if (cached) {
            const data = JSON.parse(cached);
            // Check if cache is expired
            if (data.timestamp && (Date.now() - data.timestamp) < CACHE_EXPIRY) {
                return data;
            } else {
                localStorage.removeItem('ehpreview_' + galleryId);
            }
        }
    } catch (e) {
        console.log('Cache read error:', e);
    }
    return null;
}

// Function to cache data
function cacheData(galleryId, data) {
    try {
        const cacheData = {
            ...data,
            timestamp: Date.now()
        };
        localStorage.setItem('ehpreview_' + galleryId, JSON.stringify(cacheData));
    } catch (e) {
        console.log('Cache write error:', e);
        // If we hit storage limits, clear old cache entries
        if (e.name === 'QuotaExceededError') {
            clearOldCache();
        }
    }
}

// Function to clear old cache entries
function clearOldCache() {
    try {
        const keys = Object.keys(localStorage);
        const ehpreviewKeys = keys.filter(key => key.startsWith('ehpreview_'));
        
        // Sort by timestamp and remove oldest entries until we're under 50% capacity
        const cacheEntries = ehpreviewKeys.map(key => {
            const data = JSON.parse(localStorage.getItem(key));
            return { key, timestamp: data.timestamp };
        }).sort((a, b) => a.timestamp - b.timestamp);

        // Remove oldest 50% of entries
        const removeCount = Math.floor(cacheEntries.length / 2);
        cacheEntries.slice(0, removeCount).forEach(entry => {
            localStorage.removeItem(entry.key);
        });
    } catch (e) {
        console.log('Cache cleanup error:', e);
    }
}

// Function to update the counter display
function updateCounter() {
    $('#gallery_counter').html(`Loaded: ${loadedGalleries} / ${totalGalleries}`);
}

// Function to process the request queue
function processRequestQueue() {
    if (isProcessingQueue || requestQueue.length === 0) return;
    
    isProcessingQueue = true;
    const request = requestQueue.shift();
    
    // Extract gallery ID from URL
    const galleryId = request.url.match(/\/g\/(\d+)\//)?.[1];
    if (galleryId) {
        // Check cache first
        const cachedData = getCachedData(galleryId);
        if (cachedData) {
            tags[request.index] = cachedData.tags;
            titles[request.index] = cachedData.title;
            insertStuff(titles[request.index], tags[request.index]);
            loadedGalleries++;
            updateCounter();
            isProcessingQueue = false;
            setTimeout(processRequestQueue, 50); // Faster processing for cached items
            return;
        }
    }

    // If not in cache, make the request
    const startTime = Date.now();
    $.ajax({
        url: request.url,
        type: 'get',
        dataType: 'html',
        success: function(data) { 
            const responseTime = Date.now() - startTime;
            requestStats.adjustDelay(true, responseTime);
            
            var _html = $(data);
            var uglytags = _html.find('#taglist table').html();
            if (uglytags) {
                uglytags = uglytags.replace(/<\/a>/g, ", </a>");
                const processedTags = $(uglytags).text().slice(0,-2);
                const pageCount = _html.find('#gdd table').text().match(/\d+(?= page)/g) || ['?'];
                const formattedTags = "<span style='font-weight: bold;'>Pages: </span><span>" + 
                            pageCount + ", " + processedTags;
                const title = _html.find('#gn').text();

                tags[request.index] = formattedTags;
                titles[request.index] = title;

                // Cache the data if we have a gallery ID
                if (galleryId) {
                    cacheData(galleryId, {
                        tags: formattedTags,
                        title: title
                    });
                }

                insertStuff(title, formattedTags);
                loadedGalleries++;
                updateCounter();
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            requestStats.adjustDelay(false);
            console.log(`Request failed for ${request.url}: ${textStatus}`);
            if (request.retries < maxRetries) {
                request.retries++;
                setTimeout(function() {
                    requestQueue.push(request);
                }, retryDelay * request.retries);
            }
        },
        complete: function() {
            isProcessingQueue = false;
            // Use dynamic delay for next request
            setTimeout(processRequestQueue, requestStats.currentDelay);
        }
    });
}

// Function to queue a new request
function queueRequest(url, index) {
    requestQueue.push({
        url: url,
        index: index,
        retries: 0
    });
    processRequestQueue();
}

// Function to bind hover events to gallery items
function bindGalleryEvents(elements) {
    elements.each(function() {
        if ($(this).data('preview-bound')) return; // Skip if already bound
        
        $(this).data('preview-bound', true)
            .css('z-index', '100') //Semi-fix for EH Plus
            .mouseover(function() {
                var index = parseInt($('.gl3m, .gl3c, .gl3t').index(this));
                insertStuff(titles[index], tags[index]);
            })
            .mousemove(function(pos) {
                var h = $('#info_div').height();
                var sideoffset = 10;
                if(floatLeft){sideoffset = -270;}
                var tempHeight = (pos.pageY-h);
                $('#info_div').show()
                    .css('top', tempHeight)
                    .css('left', pos.pageX + sideoffset);
            })
            .mouseout(function() {
                $('#info_div').html("Loading...");
                $('#info_div').hide();
            });

        // Queue gallery data request
        var gal_url = $(this).find('a:last').attr('href');
        var index = parseInt($('.gl3m, .gl3c, .gl3t').index(this));
        $(this).children().children().attr("title", "");
        queueRequest(gal_url, index);
    });
}

// Initialize the preview div
$(document).ready(function() {
    // Create the counter div
    $('body').append('<div id="gallery_counter">Loading...</div>');
    $('#gallery_counter').css({
        'position': 'absolute',
        'top': '10px',
        'left': '10px',
        'padding': '5px 10px',
        'background-color': '#000000',
        'color': '#ffffff',
        'border-radius': '5px',
        'font-size': '12px',
        'z-index': '10000',
        'opacity': '0.8'
    });

    $('body').append('<div id="info_div">Loading...</div>');
    $('#info_div').hide()
        .css('position', 'absolute')
        .css('padding', '5px')
        .css('z-index', '1000')
        .css('font-size', fontSize)
        .css('max-width', '250px');

    if (window.location.toString().indexOf('e-hentai.org') >= 0) {
        color = "#5c0d11";
        $('#info_div').css('background-color', '#edebdf')
            .css('color', color)
            .css('border', '1px solid ' + color);
        boycolor = "#1c41b0";
        girlcolor = "MediumVioletRed";
    } else {
        color = "#dddddd";
        $('#info_div').css('background-color', '#4f535b')
            .css('color', color)
            .css('border', '1px solid ' + color);
        boycolor = "lightblue";
        girlcolor = "lightpink";
    }

    // Function to update total galleries count
    function updateTotalGalleries() {
        totalGalleries = $('.gl3m, .gl3c, .gl3t').length;
        updateCounter();
    }

    // Initial count
    updateTotalGalleries();

    // Bind events to existing galleries
    bindGalleryEvents($('.gl3m, .gl3c, .gl3t'));

    // Create an observer instance to watch for new galleries
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                // Check if any of the added nodes are galleries or contain galleries
                $(mutation.addedNodes).each(function() {
                    var $galleries = $(this).find('.gl3m, .gl3c, .gl3t');
                    if ($galleries.length > 0) {
                        updateTotalGalleries(); // Update total count when new galleries are added
                        bindGalleryEvents($galleries);
                    }
                });
            }
        });
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Make counter move with scroll while staying at top
    $(window).scroll(function() {
        var scrollTop = $(window).scrollTop();
        $('#gallery_counter').css('top', scrollTop + 10 + 'px');
    });
});

function insertStuff(title, index) {
    // Check if index is undefined or null
    if (!index) {
        $('#info_div').html("Loading...");
        return;
    }
    var index = index.replace('reclass:', "</span><span style='font-weight: bold;'>reclass:</span><span> ");
    // reclass is the very first namespace that appears at the top of the document.
    // so I gave this namespace a full-length horizontal rule for the title. also giving it a height of 2px
    // non-title namespaces will have left and right margins of 32px
    var index = index.replace(/\blanguage:\b/, "</span><span style='font-weight: bold;'>Language:</span><span> ");
    var index = index.replace(/\bparody:\b/, "</span><span style='font-weight: bold;'>Parody:</span><span> ");
    var index = index.replace(/\bcharacter:\b/, "</span><span style='font-weight: bold;'>Character:</span><span> ");
    var index = index.replace(/\bgroup:\b/, "</span><span style='font-weight: bold;'>Group:</span><span> ");
    var index = index.replace(/\bartist:\b/, "<span style='font-weight: bold;'>Artist:</span><span> ");
    var index = index.replace(/(\bmale:\b)/, "</span><span style='font-weight: bold; color: "+ boycolor +";'>Male:</span><span style='color:  "+ boycolor +";'> ");
    // using \b will ensure that strings like "female" won't trigger the new line accidentally
    var index = index.replace(/(\bfemale:\b)/, "</span><span style='font-weight: bold; color: "+ girlcolor +";'>Female:</span><span style='color:  "+ girlcolor +";'> ");
    var index = index.replace(/\bmisc:\b/, "</span><span style='font-weight: bold;'>Misc:</span> ");
    
    $('#info_div').html("<span style='font-weight: bold;'>" + title + "</span><div style='margin-top: 2px; margin-bottom: 2px; height: 1px; background-color: " + color + ";'></div>" + index);
}
