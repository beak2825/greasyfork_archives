// ==UserScript==
// @name        Filled and bounty colors (BTN)
// @namespace   Violentmonkey Scripts
// @match       http*://broadcasthe.net/requests.php
// @match       http*://broadcasthe.net/requests.php?page=* 
// @grant       none
// @version     0.3
// @author      frogadier
// @license MIT 
// @description Changes already filled requests and bounty colors 
// @downloadURL https://update.greasyfork.org/scripts/437411/Filled%20and%20bounty%20colors%20%28BTN%29.user.js
// @updateURL https://update.greasyfork.org/scripts/437411/Filled%20and%20bounty%20colors%20%28BTN%29.meta.js
// ==/UserScript==


(function main() {
  
  'use strict';
  
//--------------------------------------------------------------------------------------------------------------------------------- 

  const ROW_BACKGROUNDCOLOR = '#BBB';    //  Change row colors for already filled requests
  const ROW_COLOR = '#666';

  const MIN_BOUNTY = '1,000,000';          // Minimum bounty to change color to MIN_BOUNTY_COLOR
  const MIN_BOUNTY_COLOR = 'blue';

  const MIN_RICH_BOUNTY = '10,000,000';     // Minimum bounty to change color to RICH_BOUNTY_COLOR 
  const RICH_BOUNTY_COLOR = 'red';

//--------------------------------------------------------------------------------------------------------------------------------
  
  const parseNumber = (str='0') => {
 
     let strParsed = str.toString().replace(/,/g,'')   // remove commas & convert to integer
     return  parseInt(strParsed) || 0;
  };

  const row = document.querySelectorAll('.rowa,.rowb');   // Select all rows
  
  for (let i = 0 ; i < row.length ; i++) {

      if (row[i].children[4].innerText!=='No') {    //check if request has been filled

          for (let j = 0 ; j < 7 ; j++) {                   // changes colors in all fields of filled request
           
             row[i].children[j].style.backgroundColor = ROW_BACKGROUNDCOLOR;
             row[i].children[j].style.color = ROW_COLOR;

             if (row[i].children[j].children.length>0) {
                row[i].children[j].children[0].style.color = ROW_COLOR;
              }
            
            if (row[i].children[j].children.length>1) {
                row[i].children[j].children[1].style.color = ROW_COLOR;   // changes color on fields children - i.e - links
              }
          }

      } else
           {
             let useColor = '';
            
             if (parseNumber(row[i].children[2].innerText) >= parseNumber(MIN_RICH_BOUNTY)) {                    // Choose Bounty colors  
                useColor = RICH_BOUNTY_COLOR;
             }
               else if (parseNumber(row[i].children[2].innerText) >= parseNumber(MIN_BOUNTY)) {
                 useColor = MIN_BOUNTY_COLOR;
               }                                                                                  
                      
               row[i].children[0].children[0].style.color = useColor;
               row[i].children[0].children[1].style.color = useColor;
               row[i].children[2].style.color = useColor;      
           }     
    }
  }
 
)();

