// ==UserScript==
// @name         MKWRS MKWorld dark mode & sort
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds dark mode & sorting on mkwrs.com MKWorld track pages
// @author       mindscarp#7315
// @match        https://mkwrs.com/mkworld/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541126/MKWRS%20MKWorld%20dark%20mode%20%20sort.user.js
// @updateURL https://update.greasyfork.org/scripts/541126/MKWRS%20MKWorld%20dark%20mode%20%20sort.meta.js
// ==/UserScript==



(function main() {
    'use strict';

    //#region MAIN FUNCTION


    if (window.location.pathname === "/mkworld/display.php") {
        // If it's a track history page, also add a sort button
        TrackPagesOnly();


    } else {

        // Otherwise just enable a basic dark mode switch
        OtherPages();
    }



    //#endregion

})();


































function OtherPages() {



    //#region OTHER PAGES darkmode

    // Create button, which uses a style similar to that of the menu on the left of mkwrs
    const DarkModeButton = document.createElement('button');
    DarkModeButton.style.position = 'fixed';
    DarkModeButton.style.top = '35px';
    DarkModeButton.style.right = '5px';
    DarkModeButton.style.zIndex = '1000';
    DarkModeButton.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    DarkModeButton.style.color = 'white';
    DarkModeButton.style.fontSize = '12px';
    DarkModeButton.style.fontFamily = 'Verdana, Arial, Helvetica, sans-serif';
    DarkModeButton.style.padding = '8px 16px';
    DarkModeButton.style.border = 'none';
    DarkModeButton.style.borderRadius = '6px';
    DarkModeButton.style.cursor = 'pointer';




    // Add a white glow and outline when the mouse is over the button, similar to the menu on the left of mkwrs
    DarkModeButton.addEventListener('mouseover', () => {
    DarkModeButton.style.textDecoration = 'underline';
    DarkModeButton.style.textShadow = '-1px 1px 8px #ffc, 1px -1px 8px #fff';
    });

    DarkModeButton.addEventListener('mouseout', () => {
    DarkModeButton.style.textDecoration = 'none';
    DarkModeButton.style.textShadow = 'none';
    });








    // In dark mode, if a row was highlighted and is not highlighted anymore, it reverts back to a specific color depending on the dark/light mode
    let DefaultMKWRStextColor = "#000000";





    

    // --------------------------------------------------------------
    // --------------------------------------------------------------
    // Get the dark/light style preference from local storage
    let storedDarkMode = localStorage.getItem('mkwrsDarkMode'); 


    // By default, track WR history tables have a white background, which is referred to as "light" style here
    // So the style has to be changed if the user's preference is "dark"
    if (storedDarkMode !== "dark" && storedDarkMode !== "light") {
        storedDarkMode = "light";
        DarkModeButton.textContent = "☼";
        localStorage.setItem("mkwrsDarkMode", "light");
        console.log("%c No dark mode preference found in localStorage, so set to \"light\"", "color: #cc66ff");

    } else if (storedDarkMode === "light") {
        DarkModeButton.textContent = "☼";
        console.log("%c Found dark mode preference in localStorage: light", "color: #cc66ff");

    } else if (storedDarkMode === "dark") {
        DarkModeButton.textContent = "🌒︎";
        toggleDarkMode();
        DefaultMKWRStextColor = "#FFFFFF";
        console.log("%c Found dark mode preference in localStorage: dark, which is not the default style, so changed the style", "color: #cc66ff");
    }

    console.log(`%c Value of variable storedDarkMode is now: ${storedDarkMode}`, "color: #e6b3ff");





    // Add button to page so that it is displayed
    document.body.appendChild(DarkModeButton);

    DarkModeButton.addEventListener('click', function(){

        // Select all <style> elements directly inside the <head>
        const styleElements = document.querySelectorAll('head > style');

        // Remove each selected style element, because each time the light/dark mode button is clicked, it created a new <style> element, which might clutter needlessly the <head>
        styleElements.forEach(style => {
        style.remove();
        });



        if (storedDarkMode === "dark") {
            toggleDarkMode("userWantsModeChange");
            DefaultMKWRStextColor = "#000000";





        } else {
            toggleDarkMode("userWantsModeChange");
            DefaultMKWRStextColor = "#FFFFFF";




        }
    
    });


//#endregion 
































    function toggleDarkMode(DoesUserWantsModeChange) {

        




        // Toggle button text and store the user's preference in localStorage so that it is remembered accross different track pages
        

        if (DoesUserWantsModeChange === undefined && storedDarkMode === "dark") {
            // If the user has not clicked the button and the stored mode setting is "dark" => do not change storedDarkMode but apply dark CSS
            activateDarkMode();
            DefaultMKWRStextColor = "#FFFFFF";
            
            
            
        } else if (DoesUserWantsModeChange === undefined && storedDarkMode === "light") {
            // If the user has not clicked the button and the stored mode setting is "light" => do nothing as mkwrs has a default light mode



        } else if (DoesUserWantsModeChange === "userWantsModeChange" && storedDarkMode === "light") {
            // If the user has clicked the button and the stored mode setting is "light" => change to "dark"
            storedDarkMode = "dark";
            DarkModeButton.textContent = "🌒︎";
            localStorage.setItem("mkwrsDarkMode", storedDarkMode);
            console.log("%c Changed dark mode preference in localStorage to \"dark\"", "color: #cc66ff");

            activateDarkMode();

            





        } else if (DoesUserWantsModeChange === "userWantsModeChange" && storedDarkMode === "dark") {
            // If the user has clicked the button and the stored mode setting is "dark" => change to "light"
            storedDarkMode = "light";
            DarkModeButton.textContent = "☼";
            localStorage.setItem("mkwrsDarkMode", storedDarkMode);
            console.log("%c Changed dark mode preference in localStorage to \"light\"", "color: #cc66ff");

            activateLightMode();


        }

        console.log(`%c Value of variable storedDarkMode is now: ${storedDarkMode}`, "color: #e6b3ff");


    






    








        function activateDarkMode() {

            // A <style> tag will be added to change CSS depending on the user's preference
            let style = document.createElement('style');

            

            style.textContent = "html, div#outer, div#nav, div#header { background-color: #1A1A1A; } \
            div#main { background-color: #282828; } \
            * { color: #FFFFFF; } \
            select, input { background-color: #888888; border-width: 1px; } \
            .ttip, .spanttip * { background-color: #888888; color: #000000; } \
            a:visited, div#main a:visited b { color: #aa80ff; } \
            a:link, div#main a:link b { color: #4d88ff; } \
            div#main a:hover, div#main a:focus, div#main a:hover b, div#main a:focus b { color: #66ccff; } \
            div#navbox { box-shadow: 0 0 10px #1a469d; } \
            div.track-text a:link, div.track-text a:visited { color: #FFFFFF; } \
            table.wr td, table.container td, table.tally td { border-color: #444444; }"
            document.head.appendChild(style); // Apply CSS


        }







        function activateLightMode() {

            // A <style> tag will be added to change CSS depending on the user's preference
            let style = document.createElement('style');

            style.textContent = "html, div#outer, div#nav, div#header { background-color: #EEEEEE; }"

            document.head.appendChild(style); // Apply CSS



        }


    }



    //#endregion










}










































function TrackPagesOnly() {

    //#region TRACK PAGES get info
    // --------------------------------------------------------------
    // --------------------------------------------------------------
    // This function is only meant to be used on the Mario Kart World track pages: https://mkwrs.com/mkworld/display.php?track=*
    // These track pages contain several tables: the current world record at the top of the page, then "Course Stats", then the "History" of all the track's world records
    // We are only interested in the "History" table, which is the second table on the page that has the "wr" class in HTML
    const track_wr_history_table = document.querySelectorAll("table.wr")[1];














    // --------------------------------------------------------------
    // --------------------------------------------------------------
    // If the track has more than 3 laps, the table's layout is a bit different, it is condensed
    // Regular tables have columns "Coins", "Shrooms", "Character" and "Kart"
    // While consended tables have columns "Coins & Shrooms" and "Combination"
    // We must find what is the type of the table
    

    // Access all header cells in the table
    const headers = track_wr_history_table.querySelectorAll("th");
    

    // Extract the text content of each header and normalize casing for comparison
    const headerTexts = Array.from(headers).map(header => header.textContent.trim().toLowerCase());
    

    // Check if both required headers are present
    const hasCoinsShrooms = headerTexts.includes("coins & shrooms".toLowerCase());
    const hasCombination = headerTexts.includes("combination".toLowerCase());
    

    // Determine the display type
    let wr_table_display_type = ""
    if (hasCoinsShrooms && hasCombination) { wr_table_display_type = "condensed"; } else { wr_table_display_type = "regular"; }
    
    console.log("%c wr_table_display_type: " + wr_table_display_type, "color: #1E90FF;");
    












    // --------------------------------------------------------------
    // --------------------------------------------------------------
    // Find how many lap columns there are in the table
    let wr_table_number_of_laps = 0;
    const lapPattern = /^Lap (\d+)$/i; // Matches "Lap X" where X is a number that can contain multiple digits. The "i" at the end means it's case insensitive so it can match "LAP 3" for example in addition to "Lap 3".

    headers.forEach(header => {
        const headerText = header.textContent.trim();
        if (lapPattern.test(headerText)) {
            wr_table_number_of_laps++;
        }
    });
    
    console.log("%c wr_table_number_of_laps: " + wr_table_number_of_laps, "color: #1E90FF;");












    // --------------------------------------------------------------
    // --------------------------------------------------------------
    // Find out how many world records are present in the table
    // Retrieve all table rows from track_wr_history_table
    const rows = track_wr_history_table.querySelectorAll("tr");
    const dataRows = rows.length - 1; // Calculate data rows by excluding the header row
    let wr_table_number_of_speedrun_rows; // Initialize the speedrun rows variable

    // Check if display type is "condensed"
    if (wr_table_display_type === "condensed") {
        // Divide data rows by 2 and use Math.floor to ensure an integer result
        wr_table_number_of_speedrun_rows = Math.floor(dataRows / 2);
    } else {
        // Use the total data rows as is
        wr_table_number_of_speedrun_rows = dataRows;
    }
    
    console.log("%c wr_table_number_of_speedrun_rows: " + wr_table_number_of_speedrun_rows, "color: #1E90FF;");






















    // --------------------------------------------------------------
    // --------------------------------------------------------------
    // Find the track name
    
    const mainDiv = document.getElementById('main'); // Get the main div element
    const trackH2 = mainDiv.querySelector('h2'); // Find the first h2 element within the main div
    const MKWRS_TrackName = trackH2.innerText.trim(); // Extract and trim the text content

    console.log("%c MKWRS_TrackName: " + MKWRS_TrackName, "color: #1E90FF;");


    //#endregion



































    //#region Sort order TrackPages
    // Get the table body
    const tbody = track_wr_history_table.querySelector('tbody');
    
    // The first <tr> row of the table contains column headers (Date, Time, Player etc.)
    const headerRow = tbody.querySelector('tr');



    
    // Create button, which uses a style similar to that of the menu on the left of mkwrs
    const button = document.createElement('button');
    button.style.position = 'fixed';
    button.style.top = '35px';
    button.style.right = '53px';
    button.style.zIndex = '1000';
    button.style.backgroundColor = 'rgba(26, 70, 157, 0.7)';
    button.style.color = 'white';
    button.style.fontSize = '12px';
    button.style.fontFamily = 'Verdana, Arial, Helvetica, sans-serif';
    button.style.padding = '8px 16px';
    button.style.border = 'none';
    button.style.borderRadius = '6px';
    button.style.cursor = 'pointer';




    // Add a white glow and outline when the mouse is over the button, similar to the menu on the left of mkwrs
    button.addEventListener('mouseover', () => {
    button.style.textDecoration = 'underline';
    button.style.textShadow = '-1px 1px 8px #ffc, 1px -1px 8px #fff';
    });

    button.addEventListener('mouseout', () => {
    button.style.textDecoration = 'none';
    button.style.textShadow = 'none';
    });












    // --------------------------------------------------------------
    // --------------------------------------------------------------
    // Get the stored sorting order from local storage
    let storedSortOrder = localStorage.getItem('mkwrsSortOrder'); 


    // By default, track WR history tables are sorted by "Oldest first"
    // So the order of the rows has to be reversed if the user's preference is "Newest first"
    if (storedSortOrder !== "newest" && storedSortOrder !== "oldest") {
        storedSortOrder = "oldest";
        button.textContent = "🠋 Oldest first";
        localStorage.setItem("mkwrsSortOrder", "oldest");
        console.log("%c No sorting preference found in localStorage, so set to \"oldest\"", "color: #3399ff");

    } else if (storedSortOrder === "oldest") {
        button.textContent = "🠋 Oldest first";
        console.log("%c Found sorting preference in localStorage: oldest", "color: #3399ff");

    } else if (storedSortOrder === "newest") {
        button.textContent = "🠉 Newest first";
        toggleOrder();
        console.log("%c Found sorting preference in localStorage: newest, which is not the default sorting order, so sorted the rows", "color: #3399ff");
    }

    console.log(`%c Value of variable storedSortOrder is now: ${storedSortOrder}`, "color: #00cc99");




















    // Add button to page so that it is displayed
    document.body.appendChild(button);








    button.addEventListener('click', function(){toggleOrder("userWantsOrderChange");});
        






    function toggleOrder(DoesUserWantsOrderChange) {

        // Get all rows except the first header row
        const rows = Array.from(tbody.querySelectorAll('tr')).slice(1);
        


        if (wr_table_display_type === "condensed") {


            // Group into pairs for condensed tables
            // Indeed, when there are 4 laps or more, each world record is displayed over two HTML <tr> rows:
            // most columns (Date, Time, Player etc.) have their cell spanning over two <tr> rows with the <td rowspan="2"> setting
            // However for the last two columns on the right ("Coins & Shrooms" and "Combination"), the two different rows are visible on-screen
            const groups = [];
            for (let i = 0; i < rows.length; i += 2) {
                groups.push([rows[i], rows[i+1]]);
            }
            groups.reverse();
            
            // Flatten the array while maintaining order within each group
            const reversedRows = groups.flat();
            tbody.innerHTML = '<tr>' + headerRow.innerHTML + '</tr>';
            reversedRows.forEach(row => tbody.appendChild(row));


        } else {


            // Reverse single rows for non-condensed tables
            rows.reverse();
            tbody.innerHTML = '<tr>' + headerRow.innerHTML + '</tr>';
            rows.forEach(row => tbody.appendChild(row));

        }







        // Toggle button text and store the user's preference in localStorage so that it is remembered accross different track pages
        

    if (DoesUserWantsOrderChange === undefined) {
        // Do nothing if the user has not clicked the button to change order
        // This can happen if the user has set preference to "Newest first" and goes to a new track page
        // In this case, the function is called, but the user hasn't clicked the button so there is to need to change the preference



    } else if (DoesUserWantsOrderChange === "userWantsOrderChange" && storedSortOrder === "oldest") {
        storedSortOrder = "newest";
        button.textContent = "🠉 Newest first";
        localStorage.setItem("mkwrsSortOrder", storedSortOrder);
        console.log("%c Changed sorting preference in localStorage to \"newest\"", "color: #3399ff");

    } else if (DoesUserWantsOrderChange === "userWantsOrderChange" && storedSortOrder === "newest") {
        storedSortOrder = "oldest";
        button.textContent = "🠋 Oldest first";
        localStorage.setItem("mkwrsSortOrder", storedSortOrder);
        console.log("%c Changed sorting preference in localStorage to \"oldest\"", "color: #3399ff");
    }

    console.log(`%c Value of variable storedSortOrder is now: ${storedSortOrder}`, "color: #00cc99");


    }

    //#endregion




































    //#region Dark mode TrackPages

    // Create button, which uses a style similar to that of the menu on the left of mkwrs
    const DarkModeButton = document.createElement('button');
    DarkModeButton.style.position = 'fixed';
    DarkModeButton.style.top = '35px';
    DarkModeButton.style.right = '5px';
    DarkModeButton.style.zIndex = '1000';
    DarkModeButton.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    DarkModeButton.style.color = 'white';
    DarkModeButton.style.fontSize = '12px';
    DarkModeButton.style.fontFamily = 'Verdana, Arial, Helvetica, sans-serif';
    DarkModeButton.style.padding = '8px 16px';
    DarkModeButton.style.border = 'none';
    DarkModeButton.style.borderRadius = '6px';
    DarkModeButton.style.cursor = 'pointer';




    // Add a white glow and outline when the mouse is over the button, similar to the menu on the left of mkwrs
    DarkModeButton.addEventListener('mouseover', () => {
    DarkModeButton.style.textDecoration = 'underline';
    DarkModeButton.style.textShadow = '-1px 1px 8px #ffc, 1px -1px 8px #fff';
    });

    DarkModeButton.addEventListener('mouseout', () => {
    DarkModeButton.style.textDecoration = 'none';
    DarkModeButton.style.textShadow = 'none';
    });








    // In dark mode, if a row was highlighted and is not highlighted anymore, it reverts back to a specific color depending on the dark/light mode
    let DefaultMKWRStextColor = "#000000";





    

    // --------------------------------------------------------------
    // --------------------------------------------------------------
    // Get the dark/light style preference from local storage
    let storedDarkMode = localStorage.getItem('mkwrsDarkMode'); 


    // By default, track WR history tables have a white background, which is referred to as "light" style here
    // So the style has to be changed if the user's preference is "dark"
    if (storedDarkMode !== "dark" && storedDarkMode !== "light") {
        storedDarkMode = "light";
        DarkModeButton.textContent = "☼";
        localStorage.setItem("mkwrsDarkMode", "light");
        console.log("%c No dark mode preference found in localStorage, so set to \"light\"", "color: #cc66ff");

    } else if (storedDarkMode === "light") {
        DarkModeButton.textContent = "☼";
        console.log("%c Found dark mode preference in localStorage: light", "color: #cc66ff");

    } else if (storedDarkMode === "dark") {
        DarkModeButton.textContent = "🌒︎";
        toggleDarkMode();
        DefaultMKWRStextColor = "#FFFFFF";
        console.log("%c Found dark mode preference in localStorage: dark, which is not the default style, so changed the style", "color: #cc66ff");
    }

    console.log(`%c Value of variable storedDarkMode is now: ${storedDarkMode}`, "color: #e6b3ff");





    // Add button to page so that it is displayed
    document.body.appendChild(DarkModeButton);

    DarkModeButton.addEventListener('click', function(){

        // Select all <style> elements directly inside the <head>
        const styleElements = document.querySelectorAll('head > style');

        // Remove each selected style element, because each time the light/dark mode button is clicked, it created a new <style> element, which might clutter needlessly the <head>
        styleElements.forEach(style => {
        style.remove();
        });



        if (storedDarkMode === "dark") {
            toggleDarkMode("userWantsModeChange");
            DefaultMKWRStextColor = "#000000";

            track_wr_history_table.querySelectorAll('tbody tr:not(:first-child)').forEach((row, index) => { row.querySelectorAll("td, td span").forEach((td) => { td.style.color = DefaultMKWRStextColor; }); });



        } else {
            toggleDarkMode("userWantsModeChange");
            DefaultMKWRStextColor = "#FFFFFF";

            track_wr_history_table.querySelectorAll('tbody tr:not(:first-child)').forEach((row, index) => { row.querySelectorAll("td, td span").forEach((td) => { td.style.color = DefaultMKWRStextColor; }); });


        }
    
    });



































    function toggleDarkMode(DoesUserWantsModeChange) {

        




        // Toggle button text and store the user's preference in localStorage so that it is remembered accross different track pages
        

        if (DoesUserWantsModeChange === undefined && storedDarkMode === "dark") {
            // If the user has not clicked the button and the stored mode setting is "dark" => do not change storedDarkMode but apply dark CSS
            activateDarkMode();
            DefaultMKWRStextColor = "#FFFFFF";
            
            
            
        } else if (DoesUserWantsModeChange === undefined && storedDarkMode === "light") {
            // If the user has not clicked the button and the stored mode setting is "light" => do nothing as mkwrs has a default light mode



        } else if (DoesUserWantsModeChange === "userWantsModeChange" && storedDarkMode === "light") {
            // If the user has clicked the button and the stored mode setting is "light" => change to "dark"
            storedDarkMode = "dark";
            DarkModeButton.textContent = "🌒︎";
            localStorage.setItem("mkwrsDarkMode", storedDarkMode);
            console.log("%c Changed dark mode preference in localStorage to \"dark\"", "color: #cc66ff");

            activateDarkMode();

            





        } else if (DoesUserWantsModeChange === "userWantsModeChange" && storedDarkMode === "dark") {
            // If the user has clicked the button and the stored mode setting is "dark" => change to "light"
            storedDarkMode = "light";
            DarkModeButton.textContent = "☼";
            localStorage.setItem("mkwrsDarkMode", storedDarkMode);
            console.log("%c Changed dark mode preference in localStorage to \"light\"", "color: #cc66ff");

            activateLightMode();


        }

        console.log(`%c Value of variable storedDarkMode is now: ${storedDarkMode}`, "color: #e6b3ff");


    






    








        function activateDarkMode() {

            // A <style> tag will be added to change CSS depending on the user's preference
            let style = document.createElement('style');

            

            style.textContent = "html, div#outer, div#nav, div#header { background-color: #1A1A1A; } \
            div#main { background-color: #282828; } \
            * { color: #FFFFFF; } \
            select, input { background-color: #888888; border-width: 1px; } \
            .ttip, .spanttip * { background-color: #888888; color: #000000; } \
            a:visited, div#main a:visited b { color: #aa80ff; } \
            a:link, div#main a:link b { color: #4d88ff; } \
            div#main a:hover, div#main a:focus, div#main a:hover b, div#main a:focus b { color: #66ccff; } \
            div#navbox { box-shadow: 0 0 10px #1a469d; } \
            div.track-text a:link, div.track-text a:visited { color: #FFFFFF; } \
            table.wr td, table.container td, table.tally td { border-color: #444444; }"

            document.head.appendChild(style); // Apply CSS


        }







        function activateLightMode() {

            // A <style> tag will be added to change CSS depending on the user's preference
            let style = document.createElement('style');

            style.textContent = "html, div#outer, div#nav, div#header { background-color: #EEEEEE; }"

            document.head.appendChild(style); // Apply CSS



        }


    }



    //#endregion




























    //#region Highlight rows TrackPages


    // Add hover effect to rows
    // Get all rows except the first one from each table body
    // Since the first row contains the column headers
    // Then add click event listener to rows
    
    
    const backgroundColorForHoveredRow = "#e6f7ff";
    const borderColorForHoveredRow = "rgb(0, 119, 255)";

    const HighlightedRowTextColor = "#000000"; // Ensure font color of highlighted rows remains black even in dark mode



    







    if (track_wr_history_table) {
        const HighlightableRows = track_wr_history_table.querySelectorAll('tbody tr:not(:first-child)');
        
        
        HighlightableRows.forEach((row, index) => {
            
            // Check if any <td> in this row has rowspan="2"
            // Which is the case for tables with at least 4 laps
            
            const GetAllTDinTheRow = row.querySelectorAll("td");
            let html_row_type;
            if (GetAllTDinTheRow.length === 2) { html_row_type = "speedrun_virtual_second_row" }
            
                
            if (wr_table_display_type === "condensed") {
                
                
                
                // Situation 1: Handle rows with <td> containing rowspan="2"
                row.addEventListener("mouseover", () => {
                    
                    row.style.backgroundColor = backgroundColorForHoveredRow; // Light green background




                    
                    if (html_row_type === "speedrun_virtual_second_row") {
                        // When the mouse is on a condensed table, on the shrooms or vehicle cells; these are on a second virtual row that contains only 2 <td>
                        row.style.borderBottom = `3px solid ${borderColorForHoveredRow}`;
                        row.style.borderRight = `3px solid ${borderColorForHoveredRow}`;
                        row.style.borderLeft = `3px solid ${borderColorForHoveredRow}`;

                        row.querySelectorAll("td, td span").forEach((td) => {
                            td.style.color = HighlightedRowTextColor;
                        });
                        


                        HighlightableRows[index - 1].style.backgroundColor = backgroundColorForHoveredRow;
                        HighlightableRows[index - 1].style.borderTop = `3px solid ${borderColorForHoveredRow}`;
                        HighlightableRows[index - 1].style.borderLeft = `3px solid ${borderColorForHoveredRow}`;
                        HighlightableRows[index - 1].style.borderRight = `3px solid ${borderColorForHoveredRow}`;

                        HighlightableRows[index - 1].querySelectorAll("td, td span").forEach((td) => {
                            td.style.color = HighlightedRowTextColor;
                        });


                    } else {
                    
                    
                        row.style.borderLeft = `3px solid ${borderColorForHoveredRow}`;
                        row.style.borderTop = `3px solid ${borderColorForHoveredRow}`;
                        row.style.borderRight = `3px solid ${borderColorForHoveredRow}`;

                        row.querySelectorAll("td, td span").forEach((td) => {
                            td.style.color = HighlightedRowTextColor;
                        });
                        
                        if (index + 1 < HighlightableRows.length) { // Ensure we don't go out of bounds
                        // Apply background to the next "row", which is in fact the second cell in the columns "Coins & Shrooms" and "Combination"
                            HighlightableRows[index + 1].style.backgroundColor = backgroundColorForHoveredRow;
                            HighlightableRows[index + 1].style.borderLeft = `3px solid ${borderColorForHoveredRow}`;
                            HighlightableRows[index + 1].style.borderBottom = `3px solid ${borderColorForHoveredRow}`;
                            HighlightableRows[index + 1].style.borderRight = `3px solid ${borderColorForHoveredRow}`;

                            HighlightableRows[index + 1].querySelectorAll("td, td span").forEach((td) => {
                                td.style.color = HighlightedRowTextColor;
                            });
                        }
                    }
                    
                    
                });
                
                
                
                
                row.addEventListener('mouseout', () => {
                    
                    row.style.backgroundColor = "";
                    
                    
                    
                    
                    if (html_row_type === "speedrun_virtual_second_row") {
                        // When the mouse is on a condensed table, on the shrooms or vehicle cells; these are on a second virtual row that contains only 2 <td>
                        row.style.borderBottom = "";
                        row.style.borderRight = "";
                        row.style.borderLeft = "";

                        row.querySelectorAll("td, td span").forEach((td) => {
                            td.style.color = DefaultMKWRStextColor;
                        });
                        
                        HighlightableRows[index - 1].style.backgroundColor = "";
                        HighlightableRows[index - 1].style.borderTop = "";
                        HighlightableRows[index - 1].style.borderLeft = "";
                        HighlightableRows[index - 1].style.borderRight = "";

                        HighlightableRows[index - 1].querySelectorAll("td, td span").forEach((td) => {
                            td.style.color = DefaultMKWRStextColor;
                        });

                    } else {
                        
                        
                        row.style.borderLeft = "";
                        row.style.borderTop = "";
                        row.style.borderRight = "";

                        row.querySelectorAll("td, td span").forEach((td) => {
                            td.style.color = DefaultMKWRStextColor;
                        });
                        
                        if (index + 1 < HighlightableRows.length) { // Ensure we don't go out of bounds
                        // Apply background to the next "row", which is in fact the second cell in the columns "Coins & Shrooms" and "Combination"
                            HighlightableRows[index + 1].style.backgroundColor = "";
                            HighlightableRows[index + 1].style.borderLeft = "";
                            HighlightableRows[index + 1].style.borderBottom = "";
                            HighlightableRows[index + 1].style.borderRight = "";

                            HighlightableRows[index + 1].querySelectorAll("td, td span").forEach((td) => {
                                td.style.color = DefaultMKWRStextColor;
                            });
                        }
                    }
                    
                    
                });
                
                
                
            } else {
                // Situation 2: Handle other rows
                row.addEventListener("mouseover", () => {
                    row.style.backgroundColor = backgroundColorForHoveredRow; // Light green background for this row only
                    row.style.border = `3px solid ${borderColorForHoveredRow}`;
                    row.querySelectorAll("td, td span").forEach((td) => {
                        td.style.color = HighlightedRowTextColor;
                    });
                });
                
                row.addEventListener("mouseout", () => {
                    row.style.backgroundColor = ""; // Reset background color
                    row.style.border = "";
                    row.querySelectorAll("td, td span").forEach((td) => {
                        td.style.color = DefaultMKWRStextColor;
                    });
                });
            }
        });
    }






    //#endregion












}