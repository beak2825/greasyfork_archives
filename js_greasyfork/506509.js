// ==UserScript==
// @name         Gogoanime Expand Video
// @namespace    http://javalatte.xyz/
// @version      0.2.10
// @description  gogoanime Expand main div to make video bigger without  the need to be fullscreen
// @author       JavaLatte
// @include      /^https?:\/\/(w+.?\.)?gogoanime3\.co\//
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/506509/Gogoanime%20Expand%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/506509/Gogoanime%20Expand%20Video.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var wStatus = '0';

   console.log('Gogoanime Expand Video');

    // overwrite style and add button wide
    addStyle (`
         #wButton {
              background: #ffc119;
              color: #FFFFFF;
              display: inline-block;
              line-height: 16px;
              height: 25px;
              padding-left: 10px;
              padding-right: 10px;
              border: unset;
              font-size: 12px;
              margin-left:10px;
              margin-right:10px;
          }
         #wButton:hover {
              cursor: pointer;
         }
         .wFull{
              width:100% !important;
         }
         .div-wide{
              width: 80vw !important;
         }
         #anime_name_pagination_clone .pagination ul li a {
              background-color: #ffc119;
              color: #000;
         }
         #anime_name_pagination_clone .pagination ul li a:hover, #anime_name_pagination_clone .pagination ul li.selected a {
              background-color: #00a651;
              color: #fff;
         }
         #wrapper_inside, #wrapper {
           width: 80vw;
         }
         section.content section.content_left{
           width: 62vw;
         }
         @media screen and (max-width: 1366px) {
              .div-wide{
                  width: 1088px !important;
              }
         }
         @media only screen and (max-width: 1087px){
              .div-wide{
                  width: 100% !important;
              }
         }
      `);

    //init button
    var btn = document.createElement( 'button' );
        btn.setAttribute( 'id', 'wButton' );
        btn.innerHTML = '<i class="fa fa-expand"></i>&nbsp;&nbsp;&nbsp;Expand Video';

    var wDiv = document.createElement( 'div' );
        wDiv.setAttribute( 'id', 'wdiv' );
        wDiv.setAttribute( 'class', 'favorites_book' );
        wDiv.appendChild( btn );

    // make Button
    var eleDA = document.getElementsByClassName( 'download-anime' )[ 0 ];
    if(eleDA){
        eleDA.appendChild( wDiv );
        // activate the newly added button.
        document.getElementById ("wButton").addEventListener (
            "click", wButtonClickAction, false
        );
    }

    if ( window.location.pathname == '/' ){
    // Index (home) page, copy page button to bottom
        setInterval(function(){
           clone_pagination_home();
           }, 1000);
    }

    function clone_pagination_home(){
        var elementExists = document.getElementById('anime_name_pagination_clone');
        if (typeof(elementExists) != 'undefined' && elementExists != null)
        {
         // Exists.
        } else {
           console.log('homepage, cloning pagination element');
           var pagination = document.getElementsByClassName('anime_name_pagination')[0];
           var cln = pagination.cloneNode(true);
           cln.removeAttribute('class');
           cln.setAttribute('id','anime_name_pagination_clone');
           var mainBody = document.getElementsByClassName('last_episodes');
           mainBody[0].appendChild(cln);
        }
    }

    //function makewide
    function wButtonClickAction(){
        if(wStatus==0){
            document.getElementsByClassName('content_left')[0].classList.add ("wFull");
            document.getElementById('wrapper_inside').classList.add ("div-wide");
            document.getElementById('wrapper').classList.add ("div-wide");
            wStatus = 1;
        } else {
            document.getElementsByClassName('content_left')[0].classList.remove ("wFull");
            document.getElementById('wrapper_inside').classList.remove ("div-wide");
            document.getElementById('wrapper').classList.add ("div-wide");
            wStatus = 0;
        }
    }

    function addStyle(css) {
      var style = document.createElement('style');
      style.textContent = css;
      document.documentElement.appendChild(style);
      return style;
    };

})();

/*
MIT License

Copyright (c) [year] [fullname]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/