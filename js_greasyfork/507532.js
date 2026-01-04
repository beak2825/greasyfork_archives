// ==UserScript==
// @name        f95zone watched filter
// @namespace   f95zone watched filter
// @description f95zone filter only the watched threads.
// @author       C. Gauthier
// @license     MIT
// @icon        https://www.google.com/s2/favicons?domain=f95zone.to
// @match       https://f95zone.to/sam/latest_alpha/
// @version     1.2.0
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/507532/f95zone%20watched%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/507532/f95zone%20watched%20filter.meta.js
// ==/UserScript==

// ==/TODO== ¤¤
//add an animated loading icon while scraper working
//make it work with other categories than "game"
//allow removing watched threads (look at how the marker script works, or maybe a new option to remove them directly from the latest update by clicking on the thread boxes)

(function () {
    'use strict';
    $(function(b) {

        const prefixes = {"23":{"id":23,"name":"SiteRip","class":"label--lightGreen"},"19":{"id":19,"name":"Collection","class":"label--gray"},"13":{"id":13,"name":"VN","class":"label--red"},"14":{"id":14,"name":"Others","class":"label--lightGreen"},"5":{"id":5,"name":"RAGS","class":"label--orange"},"2":{"id":2,"name":"RPGM","class":"label--blue"},"47":{"id":47,"name":"WebGL","class":"pre-webgl"},"3":{"id":3,"name":"Unity","class":"pre-unity"},"4":{"id":4,"name":"HTML","class":"label--olive"},"1":{"id":1,"name":"QSP","class":"label--red"},"6":{"id":6,"name":"Java","class":"pre-java"},"7":{"id":7,"name":"Ren\u0026#039;Py","class":"pre-renpy"},"31":{"id":31,"name":"UnrealEngine","class":"label--royalBlue"},"30":{"id":30,"name":"WolfRPG","class":"label--green"},"8":{"id":8,"name":"Flash","class":"label--gray"},"12":{"id":12,"name":"ADRIFT","class":"label--blue"},"17":{"id":17,"name":"Tads","class":"label--blue"},"18":{"id":18,"name":"Completed","class":"label--blue"},"20":{"id":20,"name":"Onhold","class":"label--skyBlue"},"22":{"id":22,"name":"Abandoned","class":"label--orange"}};

        //const css = "a#watched-filter.selected i {color: #c15858;} a#watched-filter:hover i {color: #c15858;} a#data-scraper:hover i {color: #c15858;}
        const css = "a#watched-filter.selected i {color: #c15858;} a#watched-filter:hover i {color: #c15858;} a#data-scraper:hover i {color: #c15858;} #prompt-container {     position: fixed;     top: 0;     left: 0;     width: 100%;     height: 100%;     display: flex;     justify-content: center;     align-items: center;     background-color: rgba(0, 0, 0, 0.7);     z-index: 1000; } .prompt-box {     background-color: #363636;     border-radius: 8px;     padding: 20px;     text-align: center;     width: 300px;     box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.5); } .prompt-message {  margin-bottom: 15px;  color: #fff;  font-size: 16px; text-align: left; } .prompt-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 20px; border-radius: 5px; background: #ccc; outline: none; opacity: 0.9; transition: opacity .15s ease-in-out; margin-bottom: 20px; }  .prompt-slider:hover { opacity: 1; } .prompt-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 15%; background: #e54c4c; cursor: pointer; }  .prompt-slider::-moz-range-thumb { width: 20px; height: 20px; border-radius: 15%; background: #e54c4c; cursor: pointer; } .prompt-buttons {     display: flex;     justify-content: space-between; } .prompt-button {     background-color: #e54c4c;     border: none;     color: white;     padding: 10px 20px;     text-align: center;     border-radius: 4px;     font-size: 16px;     cursor: pointer;     transition: background-color 0.3s ease; } .prompt-button:hover {     background-color: #ff6a6a; } .hidden {     display: none !important; } "/*{animation: icon-rotate 4s linear infinite;transform-origin: 50% 45%;}@keyframes icon-rotate {from { transform: rotate(0deg); }to { transform: rotate(-1turn); }}"*/;

        const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);


        var thread_data = GM_getValue('thread_data', []);
        var latestDownloadDate = GM_getValue('latestDownloadDate', null);


        console.log(GM_getValue("thread_data", []));
        //GM_setValue("thread_data", []); GM_setValue('latestDownloadDate', null);


        // ==/ajaxSetup==
        b.ajaxSetup({
            method: "GET",
            cache: !1,
            dataType: "json",
            timeout: 1E4
        });

        // Save the original send method
        const originalSend = XMLHttpRequest.prototype.send;

        // Override the send method
        XMLHttpRequest.prototype.send = function(body) {
            // Store the reference to the current XHR object
            const xhr = this;

            // Attach an event listener to capture the response
            xhr.addEventListener('readystatechange', function() {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.responseURL.includes('latest_data.php?cmd=list')) {

                    $('#watched-filter').attr('href',transformUrl(xhr.responseURL));

                    if(GM_getValue('watchedFilter', false)){

                        // Here you can modify the response before it's processed by the application
                        const filtered = filterThreadData(xhr.responseURL);
                        const threads = filtered[0];
                        const searchParams = new URLSearchParams(xhr.responseURL); const page = Number(searchParams.get("page"));
                        const pTotal = filtered[1];
                        const count = filtered[2];
                        let customData = JSON.stringify({ "status": "ok", "msg": { "data": threads, "pagination": { "page": page, "total": pTotal }, "count": count }}); // Your custom JSON data

                        // Override the responseText property to return your custom data
                        Object.defineProperty(xhr, 'responseText', { value: customData });
                    }
                }
            });

            // Call the original send method to continue with the request
            originalSend.apply(this, arguments);
        };

        // Sorts an array of objects by a specified key in either ascending or descending order.
        function sortArrayByKey(arr, key, ascending = false) {
            return arr.sort((a, b) => {
                if (typeof a[key] === 'string') {
                    return ascending ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]);
                } else {
                    return ascending ? a[key] - b[key] : b[key] - a[key];
                }
            });
        }

        // Calculates the weighted rating for each thread using the Bayesian formula based on views and ratings
        function calculateWeightedRating(threads, m = 3.5, C = 100000) {
            // C is the minimum number of views required to be considered
            // m is the average rating across all threads

            m = threads.reduce((accumulator, currentValue) => accumulator + currentValue.rating, 0,)/threads.length; //~3.5

            return threads.map(thread => {
                const { rating, views } = thread;

                // Calculate the weighted rating using the Bayesian formula
                const weightedRating = (views*rating + m*C) / (views+C)

                return {
                    ...thread,
                    weightedRating: weightedRating.toFixed(2) // round to 2 decimal places
                };
            });
        }

        // Adds a numeric timestamp property to each thread object based on its date string for easier sorting.
        function giveDatesValue(threads) {

            return threads.map(thread => {
                const { date } = thread;

                // parse the date in string format to get the time stamp
                const dateV = Date.parse(date);

                return {
                    ...thread,
                    dateV: dateV
                };
            });
        }

        // Filters thread data based on various search parameters from a URL
        function filterThreadData(url){
            var tmp_thread_data = GM_getValue('thread_data', []);
            const searchParams = new URLSearchParams(url);

            //sort
            if(searchParams.has("sort")){
                let key = searchParams.get("sort"); let ascending = key == "title";
                switch(searchParams.get("sort")) {
                    case "date":
                        tmp_thread_data = giveDatesValue(tmp_thread_data);
                        sortArrayByKey(tmp_thread_data, "dateV", ascending);
                        break;
                    case "rating":
                        tmp_thread_data = calculateWeightedRating(tmp_thread_data);
                        sortArrayByKey(tmp_thread_data, "weightedRating", ascending);
                        break;
                    default:
                        sortArrayByKey(tmp_thread_data, key, ascending);
                }
            }

            //date
            if(searchParams.has("date")){
                let key = Number(searchParams.get("date"));
                tmp_thread_data = tmp_thread_data.filter(thread => {
                    const timeDifference = new Date() - new Date(thread.date);
                    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
                    return daysDifference < key
                });
            }

            //tags (and/or)
            if(searchParams.has("tags[]")){
                let key = searchParams.getAll("tags[]").map(Number);
                tmp_thread_data = tmp_thread_data.filter(thread => {
                    if(searchParams.has("tagtype")){
                        // Return true if at least one of the tags in key is found in the thread's tags array
                        return key.some(tag => thread.tags.includes(tag));
                    }else{
                        // Check if every tag in keys is present in item.tags
                        return key.every(tag => thread.tags.includes(tag));
                    }
                });
            }

            //notags
            if(searchParams.has("notags[]")){
                let key = searchParams.getAll("notags[]").map(Number);
                tmp_thread_data = tmp_thread_data.filter(thread => {
                    // Return true if none of thetags in key are found in the thread's tags array
                    return !key.some(tag => thread.tags.includes(tag));
                });
            }

            //prefixes
            if(searchParams.has("prefixes[]")){
                let key = searchParams.getAll("prefixes[]").map(Number);
                tmp_thread_data = tmp_thread_data.filter(thread => {
                    // Return true if all of the prefixes in key are found in the thread's prefixes array
                    return key.every(tag => thread.prefixes.includes(tag));
                });
            }

            //noprefixes
            if(searchParams.has("noprefixes[]")){
                let key = searchParams.getAll("noprefixes[]").map(Number);
                tmp_thread_data = tmp_thread_data.filter(thread => {
                    // Return true if none of the prefixes in key are found in the thread's prefixes array
                    return !key.some(tag => thread.prefixes.includes(tag));
                });
            }

            //search
            if(searchParams.has("search")){
                let key = searchParams.get("search").toLowerCase();
                tmp_thread_data = tmp_thread_data.filter(thread => thread.title.toLowerCase().includes(key));
            }

            //creator
            if(searchParams.has("creator")){
                let key = searchParams.get("creator").toLowerCase();
                tmp_thread_data = tmp_thread_data.filter(thread => thread.creator.toLowerCase().includes(key));
            }

            //page and rows
            let page = [];
            let rows = 30; if(searchParams.has("rows")){rows = Number(searchParams.get("rows"));}
            if(searchParams.has("page")){
                let key = Number(searchParams.get("page"));
                for(let id = rows*(key-1); id < Math.min(rows*key, tmp_thread_data.length); id++){
                    page.push(tmp_thread_data[id]);
                }
            }

            //Date() date to String ( Date() => "x mins / hrs / days / weeks / months / years" )
            page.forEach(thread => {
                let d = dateToString(Date.parse(thread.date));
                thread.date = String(d[0]) + " "+ d[1];
            });


            return [page, Math.ceil(tmp_thread_data.length/rows), tmp_thread_data.length];
        }

        //parses a string back into a date object
        function stringToDate(input) {

            const newDate = new Date();

            const [amount, unit] = (() => {
                const parts = input.split(' ');
                if (parts.length === 2) {
                    return [parseInt(parts[0]), parts[1]];
                } else if (input.toLowerCase() === "yesterday") {
                    return [1, "days"];
                } else {
                    return [null, null];
                }
            })();

            if (amount === null || unit === null) {
                return newDate;
            }

            switch (unit) {
                case 'min':
                case 'mins':
                    newDate.setMinutes(newDate.getMinutes() - amount);
                    break;
                case 'hr':
                case 'hrs':
                    newDate.setHours(newDate.getHours() - amount);
                    break;
                case 'days':
                    newDate.setDate(newDate.getDate() - amount);
                    break;
                case 'week':
                case 'weeks':
                    newDate.setDate(newDate.getDate() - (amount * 7));
                    break;
                case 'month':
                case 'months':
                    newDate.setMonth(newDate.getMonth() - amount);
                    break;
                case 'year':
                case 'years':
                    newDate.setFullYear(newDate.getFullYear() - amount);
                    break;
                default:
                    throw new Error('Invalid time unit');
            }

            return newDate;
        }

        // Converts a date to it's coresponding string
        function dateToString(date) {
            const now = new Date();
            const diffInMs = now - date;

            const minutes = Math.floor(diffInMs / (1000 * 60));
            const hours = Math.floor(diffInMs / (1000 * 60 * 60));
            const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
            const weeks = Math.floor(days / 7);
            const months = Math.floor(days / 30);
            const years = Math.floor(days / 365);

            if (minutes < 1) {
                return [0, "min"];
            } else if (minutes === 1) {
                return [1, "min"];
            } else if (minutes < 60) {
                return [minutes, "mins"];
            } else if (hours === 1) {
                return [1, "hr"];
            } else if (hours < 24) {
                return [hours, "hrs"];
            } else if (days === 1) {
                return ["", "yesterday"];
            } else if (days < 7) {
                return [days, "days"];
            } else if (weeks === 1) {
                return [1, "week"];
            } else if (weeks < 4) {
                return [weeks, "weeks"];
            } else if (months === 1) {
                return [1, "month"];
            } else if (months < 12) {
                return [months, "months"];
            } else if (years === 1) {
                return [1, "year"];
            } else {
                return [years, "years"];
            }
        }

        // Splits a string into parts
        function splitString(input) {
            const parts = input.split(' ');

            if (parts.length === 2) {
                if(parts[1] == "hours"){return [parts[0], "hrs"];}
                return [parts[0], parts[1]];
            } else {
                return ["", parts[0]];
            }
        }

        // Filters an array to keep only the first occurrence of each unique object based on a specified key
        function uniqByKeepFirst(data, key) {
            const seen = new Set();
            return data.filter(obj => {
                const keyValue = obj[key];
                if (seen.has(keyValue)) {
                    return false;
                } else {
                    seen.add(keyValue);
                    return true;
                }
            });
        }

        function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

        // Retrieves data from the 1st page and returns a promise with the result, the pagination and the elapsed time
        function getPageData(pageNumber){
            return new Promise(function(resolve, reject) {
                var start_time = new Date().getTime();
                b.ajax({
                    url: "latest_data.php?cmd=list&cat=games&page="+pageNumber+"&sort=date&rows=90&_=1710376207895",
                    async: false,
                    success: function(result) {
                        resolve({data: result.msg, time: (new Date().getTime() - start_time)}); // Resolve the promise with the result
                    },
                    error: function(error) {
                        reject(error); // Reject the promise if there's an error
                    }
                });
            });
        }

        // Builds the database by fetching data across the pages while showing a loading overlay
        async function buildDB(firstPage, lastSearchedPage, date=false){

            //var lastSearchedPage = GM_getValue('pages_to_filter', 1);
            if(!date){console.log("data is loading, pages searched : " + lastSearchedPage-firstPage+1);}
            else{console.log("data is loading, pages will be searched until the last time this function was executed");}

            // Create the overlay div
            var overlay = document.createElement('div');

            // Apply styles to the overlay div
            overlay.style.position = 'fixed'; overlay.style.top = '0';overlay.style.left = '0'; overlay.style.width = '100%'; overlay.style.height = '100%'; overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)'; //style
            overlay.style.zIndex = '9999'; // ensure it's on top of all other elements

            // Create the message element
            var message = document.createElement('div');
            message.innerText = 'Please wait, loading...';
            message.style.color = 'white';message.style.fontSize = '24px';message.style.fontFamily = 'Arial, sans-serif';message.style.textAlign = 'center';message.style.padding = '20px';message.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';message.style.borderRadius = '10px';

            // Append the message to the overlay
            overlay.appendChild(message);

            // Add the overlay to the document body for a search of more than one page
            document.body.appendChild(overlay);


            var test = [];
            var firstDate;
            var j = (lastSearchedPage-firstPage+1)*90;

            for (let i = firstPage; i <= lastSearchedPage; i++) {
                var stopLoop = false;


                await b.ajax({
                    url: "latest_data.php?cmd=list&cat=games&page="+i+"&sort=date&rows=90&_=1710376207895",
                    success: async function(f) {
                        const threads = f.msg.data;
                        if(i == firstPage){firstDate = stringToDate(threads[0].date);}
                        stopLoop = (date != false && new Date(stringToDate(threads[threads.length-1].date)) <= new Date(date));
                        for (const t of threads) {
                            if(!date){
                                message.innerText = 'Please wait, loading... \n' + j + ' threads left'; j--;

                                // Use requestAnimationFrame to allow the DOM to update before continuing
                                await new Promise(requestAnimationFrame);
                            }
                            //else{message.innerText = 'Please wait, loading... \n' + j + ' threads searched'; j++;} //¤¤change with an animated icon

                            if(t.watched){

                                var newDate = stringToDate(t.date); // change the t.date string as a Date object aproximating the creation date instead of a string of the time since creation
                                t.date = String(newDate);

                                test.push(t);
                            }
                        }
                    }
                });
                if(stopLoop){break;}
            }

            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
            var concat = test.concat(thread_data);
            thread_data = uniqByKeepFirst(concat, "thread_id"); //in case some threads where treated 2 times because of updates of the data base of the website while the list was being built
            GM_setValue("thread_data", thread_data);
            GM_setValue('latestDownloadDate', String(firstDate));
        }

        // Transforms an URL for better usage by the DOM
        function transformUrl(url) {
            // Step 1: Extract the base URL (before the query parameters) and the query string
            let [baseUrl, queryString] = url.split('?');

            if (!queryString) return url; // Return the original URL if no query parameters are present

            // Step 2: Parse the query string into key-value pairs
            let params = new URLSearchParams(queryString);

            // Step 3: Remove 'rows', 'page' and '_'
            params.delete('rows');
            params.delete('page');
            params.delete('_');

            // Step 4: Build the transformed URL
            let newUrl = '#';
            for (let [key, value] of params.entries()) {
                newUrl += `/${key}=${value}`;
            }

            return newUrl;
        }

        // Displays a custom prompt with message and callback for OK or Cancel
        function showPrompt(message, callback) {
            const promptContainer = document.getElementById('prompt-container');
            const promptMessage = document.querySelector('.prompt-message');
            const promptSlider = document.getElementById('prompt-slider');
            const okButton = document.getElementById('prompt-ok');
            const cancelButton = document.getElementById('prompt-cancel');

            // Set the message
            promptMessage.textContent = message;

            // Show the prompt container
            promptContainer.classList.remove('hidden');

            // Focus on input
            promptSlider.focus();

            // OK button click event
            okButton.onclick = function () {
                promptContainer.classList.add('hidden');
                callback(promptSlider.value);
            };

            // Cancel button click event
            cancelButton.onclick = function () {
                promptContainer.classList.add('hidden');
                callback(null);
            };
        }

        // Creates buttons for data scraping and filtering, adds event listeners, and builds a custom prompt for user input
        function createButtons(){
            // Select the controls-block where we want to add new elements
            var controlsBlock = document.querySelector(".controls-block");

            // Create the data scraper button
            var scraper = document.createElement('a');
            scraper.id = "data-scraper";
            scraper.setAttribute('data-tooltip', 'get filter data');

            var scraperIcon = document.createElement('i');
            scraper.appendChild(scraperIcon);
            scraperIcon.className = 'fas fa-download';

            // Create the watched thread filter button
            var filter = document.createElement('a');
            filter.id = "watched-filter";
            filter.setAttribute('href', '#/cat=games/page=1');
            filter.setAttribute('rel', 'ajax');
            filter.setAttribute('data-tooltip', 'filter watched');
            if(GM_getValue('watchedFilter')){$(filter).addClass("selected");}

            var filterIcon = document.createElement('i');
            filter.appendChild(filterIcon);
            filterIcon.className = 'fa fa-eye';


            const rangeToString = (v) => {switch(true) {
                case (v == 1):
                    return "yesterday";
                case v <= 6:
                    return v + " days";
                case v == 7:
                    return "1 week";
                case v <= 10:
                    return (v-6) + " weeks";
                case v == 11:
                    return "1 month";
                case v <= 21:
                    return (v-10) + " months";
                case v == 22:
                    return "1 year";
                case v >= 23:
                    return (v - 21) + " years";
            } }

            // Add listeners to the buttons
            const onClickScraper = event => {
                if(GM_getValue('watchedFilter', false)){
                    window.alert("can't get the data while the watched filter is checked"); //need to resolve that? ¤¤
                }else{
                    var nbThreads;
                    const f = (m) => showPrompt(m, function(d) {
                        const date = stringToDate(rangeToString(d));
                        if(!(d == null)){
                            buildDB(1, GM_getValue('pagination', { page: 1, total: 1, threads: 0, loadTime: 100}).total, new Date(date));
                        }
                    });
                    f("Select until when you want to search the threads for your watched ones");

                }
            };
            scraper.addEventListener("click", onClickScraper);

            const onClickWatched = event => {
                var e = $(event.currentTarget);
                e.hasClass("selected") ? (e.removeClass("selected")) : (e.addClass("selected"))
                GM_setValue('watchedFilter', e.hasClass("selected"));
            };
            filter.addEventListener("click", onClickWatched);

            // Insert the buttons elements into the controls block
            var autoRefreshControl = document.getElementById("controls_auto-refresh");
            controlsBlock.insertBefore(scraper, autoRefreshControl);
            controlsBlock.insertBefore(filter, autoRefreshControl);



            // Create container div
            const promptContainer = document.createElement('div');
            promptContainer.id = 'prompt-container';
            promptContainer.className = 'hidden';

            // Create the box div inside the container
            const promptBox = document.createElement('div');
            promptBox.className = 'prompt-box';

            // Create the input field
            const promptSlider = document.createElement('input');
            promptSlider.type = 'range';
            promptSlider.min = 1;
            promptSlider.max = (new Date().getYear() - new Date('2016').getYear()+21);
            promptSlider.value = "1";
            promptSlider.id = 'prompt-slider';
            promptSlider.className = 'prompt-slider';
            promptSlider.oninput = function() {
                promptMessage.textContent = "search threads : < "+rangeToString(this.value);
            }

            // Create the message paragraph
            const promptMessage = document.createElement('p');
            promptMessage.className = 'prompt-message';
            promptMessage.textContent = "search threads : < "+rangeToString(promptSlider.value);

            // Create the buttons div
            const promptButtons = document.createElement('div');
            promptButtons.className = 'prompt-buttons';

            // Create the OK button
            const okButton = document.createElement('button');
            okButton.id = 'prompt-ok';
            okButton.className = 'prompt-button';
            okButton.textContent = 'OK';

            // Create the Cancel button
            const cancelButton = document.createElement('button');
            cancelButton.id = 'prompt-cancel';
            cancelButton.className = 'prompt-button';
            cancelButton.textContent = 'Cancel';

            // Append the buttons to the button container
            promptButtons.appendChild(okButton);
            promptButtons.appendChild(cancelButton);

            // Append message, input, and buttons to the prompt box
            promptBox.appendChild(promptMessage);
            promptBox.appendChild(promptSlider);
            promptBox.appendChild(promptButtons);

            // Append the prompt box to the container
            promptContainer.appendChild(promptBox);

            // Append the prompt container to the body of the document
            document.body.appendChild(promptContainer);
        }

        // Automatically updates the database based on the last time it was updated
        function autoUpdateDB(date=null) {
            const pTotal = Number(GM_getValue('pagination', {page: 1, total: 1, threads: 0, loadTime: 100}).total);
            if(date === null){
                buildDB(1, pTotal+1);
            }else{
                buildDB(1, pTotal, new Date(date)); //10 or pagination.total ?
            }
        }

        var pagination = GM_getValue('pagination', { page: 1, total: 1, threads: 0, loadTime: 100});

        function init() {
            GM_setValue('watchedFilter', false);
            getPageData(1).then(function(result) {
                pagination = {page: result.data.pagination.page, total: result.data.pagination.total, threads: result.data.count, loadTime: result.time};
                GM_setValue('pagination', pagination);
                autoUpdateDB(latestDownloadDate);
            }).catch(function(error) {
                console.error(error);
            });
            createButtons();
        }

        //GM_setValue('latestDownloadDate', "Mon Jan 22 2024 21:27:49 GMT+0200");
        //GM_setValue('latestDownloadDate', null);
        init();
    });

})();
