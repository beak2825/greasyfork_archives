// ==UserScript==
// @name         Codeforces charged
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       Dev vikram Singh
// @match        https://codeforces.com/contest/*
// @grant        none
// @license      MIT
// @description  (Codeforces) Wide problems UI. Keyboard shortcuts. Quick navigation to submission and solutions pages on Codeforces. 
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/512098/Codeforces%20charged.user.js
// @updateURL https://update.greasyfork.org/scripts/512098/Codeforces%20charged.meta.js
// ==/UserScript==
// jshint esversion: 11

( function () {
   'use strict';

   // Function to apply styles to the body and footer logo
   function applyStyles ( bodyElem ) {
      const footerLogoDiv = document.querySelector( ".footer-logo-div" );

      if ( bodyElem )
      {
         bodyElem.style.cssText = "margin: 0; max-width: 100%;"; // Batch style updates
      }
      if ( footerLogoDiv )
      {
         footerLogoDiv.style.position = "inherit"; // Apply footer style
      }
   }

   // Create a MutationObserver to apply styles when the body is available
   const observer = new MutationObserver( ( mutations ) => {
      for ( const mutation of mutations )
      {
         const bodyElem = document.getElementById( "body" );
         if ( mutation.type === "childList" && bodyElem )
         {
            applyStyles( bodyElem );
            observer.disconnect();
            break;
         }
      }
   } );

   // Start observing the document body for child additions
   observer.observe( document.body, { childList: true, subtree: true } );

   const currentURL = window.location.href;
   const contestRegex = /\/contest\/(\d+)/;
   const match = currentURL.match( contestRegex );
   const check = currentURL.includes( "/problem/", 30 );

   // Function to handle keydown event
   function handleKeyDown ( event ) {
      if ( event.altKey && event.key === 's' && check )
      {
         let newURL = currentURL.replace( "/problem/", "/submit/" );
         window.location.href = newURL;
      }
      if ( event.altKey && event.key === 'a' && check )
      {
         let newURL = currentURL.replace( "/problem/", "/status/" ) + "?order=BY_CONSUMED_TIME_ASC";
         window.location.href = newURL;
      }
   }

   // Fetch and store problem names and IDs
   async function fetchProblemData () {
      if ( !match ) return;

      const contestId = match[ 1 ];
      const storedContestId = localStorage.getItem( 'contestId' );

      // Clear stored data if the contest ID has changed
      if ( storedContestId !== contestId )
      {
         localStorage.removeItem( 'problemData' );
         localStorage.removeItem( 'contestId' );
      }

      let problemData = []; // Initialize an empty array to store problem data

      // Check if problemData is already stored
      if ( !localStorage.getItem( 'problemData' ) )
      {
         try
         {
            const response = await fetch( `https://codeforces.com/contest/${ contestId }` );
            const data = await response.text();
            const tempDiv = document.createElement( 'div' );
            tempDiv.innerHTML = data;
            const problemRows = tempDiv.querySelectorAll( 'table.problems tbody tr' );

            // Populate problemData array
            problemRows.forEach( ( row, index ) => {
               if ( index > 0 )
               { // Skip header row
                  const cells = row.querySelectorAll( 'td' );
                  const problemId = cells[ 0 ]?.querySelector( 'a' )?.textContent.trim();
                  const problemName = cells[ 1 ]?.querySelector( 'a' )?.textContent.trim();

                  if ( problemId && problemName )
                  {
                     problemData.push( { id: problemId, name: problemName } );
                  }
               }
            } );

            // Store fetched problem data in localStorage
            localStorage.setItem( 'problemData', JSON.stringify( problemData ) );
            localStorage.setItem( 'contestId', contestId );
         } catch ( error )
         {
            console.error( 'Error fetching contest problems:', error );
            return; // Exit if there was an error fetching the data
         }
      } else
      {
         // Retrieve existing problem data from localStorage
         problemData = JSON.parse( localStorage.getItem( 'problemData' ) );
      }

      // Generate the problem data regardless of where it came from
      if ( check && problemData.length > 0 )
      {
         generateProblemData( problemData );
      }
   }

   // Function to generate and insert problem data links
   async function generateProblemData ( problemData ) {
      const list = document.createElement( 'ul' );
      list.style.margin = '10px 0 20px'; // Add some space below

      problemData.forEach( problem => {
         const listItem = document.createElement( 'li' );
         const link = document.createElement( 'a' );
         link.href = `https://codeforces.com/contest/${ match[ 1 ] }/problem/${ problem.id }`;
         link.textContent = `${ problem.id }: ${ problem.name }`;
         link.target = '_blank'; // Open in a new tab
         link.setAttribute( "style", "display: block; color: orange;width : 100%; text-decoration : none" );

         listItem.style.margin = '5px';
         listItem.appendChild( link );
         list.appendChild( listItem );
      } );

      const sidebar = document.getElementById( 'sidebar' );
      if ( sidebar )
      {
         sidebar.insertBefore( list, sidebar.children[ 1 ] );
      }
   }

   // Call fetchProblemData on page load to handle storing/loading problems
   fetchProblemData();

   // Add event listener for keydown event
   document.addEventListener( 'keydown', handleKeyDown );
} )();
