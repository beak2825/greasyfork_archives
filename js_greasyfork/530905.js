// ==UserScript==
// @name         YT Music: sort by play count
// @match        https://music.youtube.com/* 
// @run-at       document-end
// @grant        window.onurlchange
// @version      1.0.29
// @license      MIT
// @description  Truly sort songs from an artist's page by play count from highest to lowest.
// @namespace    https://github.com/KenKaneki73985
// @author       Ken Kaneki 
// @downloadURL https://update.greasyfork.org/scripts/530905/YT%20Music%3A%20sort%20by%20play%20count.user.js
// @updateURL https://update.greasyfork.org/scripts/530905/YT%20Music%3A%20sort%20by%20play%20count.meta.js
// ==/UserScript==

// user_script = "moz-extension://762e4395-b145-4620-8dd9-31bf09e052de/options.html#nav=2c66e48e-5eb3-4d04-8486-d2a9bc2306d8+editor"
// reload_ID

(function() {
    'use strict'
    let SORT_TOGGLE = true
    PAGE_READY_ACTIONS()

    async function PAGE_READY_ACTIONS(){
        
        LoadUtils()
        await new Promise(resolve => setTimeout(resolve, 1000))

        gen_ADD_SVG("fixed", '2.5%', '85.5%', SortByPlayCount, '<svg width="30px" height="30px" fill="#0080ff" viewBox="0 0 24 24" id="sort-ascending" data-name="Flat Line" xmlns="http://www.w3.org/2000/svg" class="icon flat-line" stroke="#0080ff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><polyline id="primary" points="10 15 6 19 2 15" style="fill: none; stroke: #0080ff; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></polyline><path id="primary-2" data-name="primary" d="M6,19V4M20,16H15m5-5H13m7-5H10" style="fill: none; stroke: #0080ff; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></path></g></svg>')
        InitializeToggleButton()
        CheckUrl()
    }

    function LoadUtils(){
    
        let GithubScripts = [
            'https://raw.githack.com/KenKaneki73985/javascript-utils/refs/heads/main/general.js',
            'https://raw.githack.com/KenKaneki73985/javascript-utils/refs/heads/main/show_GUI.js',
            'https://raw.githack.com/KenKaneki73985/javascript-utils/refs/heads/main/countdown.js'
        ]

        GithubScripts.forEach(LoadGithubScript)

        function LoadGithubScript(GithubScript){
            let ScriptElement = document.createElement('script')
            ScriptElement.src = GithubScript
            document.head.appendChild(ScriptElement)
        }
    }

    // ─── SCROLL EVENT ─────────────
    addEventListener('wheel', () => {
        if (!SORT_TOGGLE){
            return // <---
        }

        SortByPlayCount()
    })

    // ─── URL CHANGE EVENT ─────────────
    addEventListener('urlchange', CheckUrl)

    async function CheckUrl() {

        // ▬▬▬ YOUR IN ARTIST PAGE ▬▬▬▬▬▬▬▬▬▬▬▬▬
        if (location.href.includes("music.youtube.com/channel")) {

            if (!SORT_TOGGLE){
                return // <---
            }

            show_GUI("Sorting...", "GUI_v1", "green", 0, "y80", 17, 3600000)
            await WaitTextToExist("Show all")
            FindTextElement("Show all").click()

            await WaitElementToExist('div.ytmusic-playlist-shelf-renderer:nth-child(3)') // songs container
            SortByPlayCount()
        } 
        
        // ▬▬▬ NOT IN ARTIST PAGE. WILL NOT SORT BY PLAY COUNT ▬▬▬▬▬▬▬▬▬▬▬▬▬
        else {
            // show_GUI("⛔ not in artist page. did not sort play count (CheckUrl - SortByPlayCount)", "GUI_v1", "blue", 0, "y80", 17, 3000)
            log("⛔ not in artist page. did not sort play count (CheckUrl - SortByPlayCount)")
        }
    }

    function SortByPlayCount(){

        // NOTE: this should not be here
        // if (!SORT_TOGGLE){
        //     return // <---
        // }

        // ─── IF NO "TOP SONGS" TEXT, DONT SORT ─────────────
        if (!document.body.innerText.includes("Top songs")){
            log("❌ did not sort count. not in artist page (body: Top songs)")
            return // <---
        }

        if (IsPlaylistSorted()) {
            log("👍 already sorted by play count")
            return // <---
        }

        // RUN BELOW IF...
        // - IN ARTIST PAGE ("Top songs" text exist)
        // - NOT ALREADY SORTED

        // ArtistChannelSongsContainer  = <div id="contents" class="style-scope ytmusic-playlist-shelf-renderer">
        let ArtistChannelSongsContainer = document.querySelector('div.ytmusic-playlist-shelf-renderer:nth-child(3)')

        if (ArtistChannelSongsContainer){

            // Clone the original children to preserve event listeners
            // ".children" returns HTMLCollection (array like)
            // Array.from() method returns an array from any object with a length property, or any iterable object.

            let TopChildren_arr = Array.from(ArtistChannelSongsContainer.children) // convert HTMLcollection to array
            
            let SongInfo = []
            
            TopChildren_arr.forEach(PushSongDetails)

            function PushSongDetails(SingleTopChild, index){

                // TitleElement = <a class="yt-simple-endpoint style-scope yt-formatted-string" spellcheck="false" href="watch?v=IST-GfqUwDA&amp;list=OLAK5uy_nwcZ3NjxrKg26DJNgPPaENYvVuVM82VXk">How to save a life</a>
                let TitleElement     = SingleTopChild.querySelector('div:nth-child(5) > div:nth-child(1) > yt-formatted-string:nth-child(1) > a:nth-child(1)')
                // PlayCountElement = <yt-formatted-string class="flex-column style-scope ytmusic-responsive-list-item-renderer" ellipsis-truncate="" respect-html-dir="" role="listitem" aria-label="200 million plays" ellipsis-truncate-styling="" title="200M plays">200M plays</yt-formatted-string>
                let PlayCountElement = SingleTopChild.querySelector('div:nth-child(5) > div:nth-child(3) > yt-formatted-string:nth-child(2)')
                
                let SongDetails = {
                    element: SingleTopChild,
                    id: `${index + 1}`,
                    title: TitleElement ? TitleElement.textContent.trim() : 'Title not found',
                    plays: PlayCountElement ? PlayCountElement.textContent.trim() : 'Plays not found',
                    playCount: PlayCountElement ? ParsePlayCount(PlayCountElement.textContent.trim()) : 0
                }
                
                SongInfo.push(SongDetails)
            }
            
            // SORT songs by play count (highest to lowest)
            SongInfo.sort((a, b) => b.playCount - a.playCount);
            
            // Use replaceChildren to preserve original event listeners
            ArtistChannelSongsContainer.replaceChildren(...SongInfo.map(song => song.element));
            
            // Modify song ranks without recreating elements
            SongInfo.forEach((song, index) => {
                song.element.id = `${index + 1}`;
            });
            
            show_GUI("Sorting Complete", "GUI_v1", "blue", 0, "y80", 17, 3000)
            log("☑️ success: sorted by play count")
        } 
        
        else {
            log("❌ error: not found ArtistChannelSongsContainer (sort by play count)");
        }
    }

    // Function to convert play count string to number
    function ParsePlayCount(playString) {
        playString = playString.replace(' plays', '').trim();
        
        let multipliers = {
            'B': 1000000000,
            'M': 1000000,
            'K': 1000
        };
        
        let match = playString.match(/^(\d+(?:\.\d+)?)\s*([BMK])?$/);
        
        if (!match) return 0;
        
        let number = parseFloat(match[1]);
        let multiplier = match[2] ? multipliers[match[2]] : 1;
        
        return number * multiplier;
    }
    
    // Check if playlist is already sorted by play count
    function IsPlaylistSorted() {

        let ArtistChannelSongsContainer = document.querySelector('div.ytmusic-playlist-shelf-renderer:nth-child(3)');
        
        if (ArtistChannelSongsContainer) {
            let TopChildren_arr = Array.from(ArtistChannelSongsContainer.children);
            
            let PlayCounts = TopChildren_arr.map(PlayCountAction)

            function PlayCountAction(SingleChild){
                let PlayCountElement = SingleChild.querySelector('div:nth-child(5) > div:nth-child(3) > yt-formatted-string:nth-child(2)');
                return PlayCountElement ? ParsePlayCount(PlayCountElement.textContent.trim()) : 0;
            }
            
            // Check if play counts are in descending order
            for (let i = 1; i < PlayCounts.length; i++) {
                if (PlayCounts[i] > PlayCounts[i - 1]) {
                    return false; // Not sorted
                }
            }
            
            return true // Already sorted
        }
        
        return false
    }


    function CREATE_TOGGLE_BUTTON() {
        // Create button container
        let buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'fixed';
        buttonContainer.style.top = '3.2%';
        buttonContainer.style.left = '78%'; // "ATSORT"
        buttonContainer.style.zIndex = '9999';
        buttonContainer.style.backgroundColor = 'black';
        buttonContainer.style.padding = '3px 8px';
        buttonContainer.style.borderRadius = '8px';
        buttonContainer.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.alignItems = 'center';
        buttonContainer.style.gap = '0px';
        
        // Create label
        let label = document.createElement('span');
        label.textContent = 'AUTO SORT';

        // FONT STYLE
        label.style.fontFamily = 'SEGOE UI'; // changed from 'Arial, sans-serif'
        label.style.fontSize = '10px';
        // label.style.fontWeight = 'bold';
        label.style.color = 'white';
        
        // Create SVG toggle
        let svgNS = "http://www.w3.org/2000/svg";
        let svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "30");
        svg.setAttribute("height", "10");
        svg.setAttribute("viewBox", "0 0 60 30");
        svg.style.cursor = "pointer";
        
        // Create toggle track
        let track = document.createElementNS(svgNS, "rect");
        track.setAttribute("x", "0");
        track.setAttribute("y", "0");
        track.setAttribute("rx", "15");
        track.setAttribute("ry", "15");
        track.setAttribute("width", "60");
        track.setAttribute("height", "30");
        track.setAttribute("fill", SORT_TOGGLE ? "#888" : "#ccc");
        
        // Create toggle circle/thumb
        let circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", SORT_TOGGLE ? "45" : "15");
        circle.setAttribute("cy", "15");
        circle.setAttribute("r", "12");
        // circle.setAttribute("fill", "white");
        circle.setAttribute("fill", "rgba(65, 65, 255, 0.7)"); // blue circle
        
        // Add elements to SVG
        svg.appendChild(track);
        svg.appendChild(circle);
        
        // Add click event to SVG
        svg.addEventListener('click', function() {
            SORT_TOGGLE = !SORT_TOGGLE;
            track.setAttribute("fill", SORT_TOGGLE ? "#888" : "#ccc");
            circle.setAttribute("cx", SORT_TOGGLE ? "45" : "15");
            SAVE_TOGGLE_STATE();
        });
        
        // Assemble button container
        buttonContainer.appendChild(label);
        buttonContainer.appendChild(svg);
        
        // Add container to document
        document.body.appendChild(buttonContainer);
        
        // Return references to elements that need to be updated
        return { track, circle };
    }
    
    // ─── SAVE / LOAD TOGGLE STATE ─────────────
    function SAVE_TOGGLE_STATE() {
        localStorage.setItem('sort-toggle-state', SORT_TOGGLE);
    }
    
    function LOAD_TOGGLE_STATE() {
        let savedState = localStorage.getItem('sort-toggle-state');
        if (savedState !== null) {
            SORT_TOGGLE = savedState === 'true';
        }
    }
    
    function InitializeToggleButton() {
        LOAD_TOGGLE_STATE()    // Load state first
        CREATE_TOGGLE_BUTTON() // Then create button with correct state
    }
})();

// async function FindShowAllButton() {
    
//     let ShowAll_button = FindTextElement("Show all")

//     // ─── CLICK "SHOW ALL SONGS" BUTTON ─────────────
//     if (ShowAll_button){

//         ShowAll_button.click()
//         log("☑️ success: clicked ShowAll_button")

//         // ───>> MOVED TO Artist Page 
//         show_GUI("Sorting...", "GUI_v1", "green", 0, "y80", 17, 3000)

//         // await WaitTextToExist("Top songs") // seems no need
//         // SortByPlayCount()
//         return true
//     } 
    
//     // ─── NOT FOUND "SHOW ALL SONGS" BUTTON ─────────────
//     else if (!ShowAll_button) {
//         log("❌ error: not found ShowAll_button")

//         return false

//         // ─── IF IN ARTIST PLAYLIST, SORT BY PLAY COUNT ─────────────
//         // if (document.body.innerText.includes("Top songs")){
//         //     log('👍 not found ShowAll_button but will sort since already in artist playlist page')
//         //     SortByPlayCount()
//         // }
//     }
// }
