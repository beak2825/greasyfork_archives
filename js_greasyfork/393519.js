// ==UserScript==
// @name            Wikipedia Tweaker
// @version         20.1.11
// @description     Hides left column, adds dark theme at Wikipedia.org.
// @author          S-Marty
// @compatible      firefox
// @compatible      chrome
// @compatible      opera
// @license         MIT
// @namespace       https://github.com/s-marty/Wikipedia-Tweaker
// @homepageURL     https://github.com/s-marty/Wikipedia-Tweaker
// @icon            https://github.com/s-marty/Wikipedia-Tweaker/raw/master/images/Wikipedia.png
// @include         *wikipedia.org/wiki/*
// @include         *wikimedia.org/wiki/*
// @include         *wikipedia.org/w/*
// @exclude         *.m.wikipedia.org/*
// @run-at          document-end
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/393519/Wikipedia%20Tweaker.user.js
// @updateURL https://update.greasyfork.org/scripts/393519/Wikipedia%20Tweaker.meta.js
// ==/UserScript==


/* greasyfork.org jshint syntax checking hacks */
/* jshint asi: true */
/* jshint boss: true */
/* jshint esversion: 6 */
/* jshint multistr: true */

/** **********************   Features   **********************
*** Hides the left column providing a ">" button in upper left
***   corner to animate it. Settable in code.
*** Provides a page zoom of 120%. Settable in code.
*** Provides a dark theme, also setable.
*** Normal color printing (Black text on white background.)
*** No extra @require files (jquery et.al.)

*** Not intended for mobile devices.
*** Not likely to work with Wikipedia Skins.
***  ***  Does not & will not work well with IE and IEdge  ***/


/* Editable options */
var hide_column  = true;  /* Set to false for normal wiki theme */
var dark_theme   = true;  /* Set to false for normal wiki theme */
var zoom_pages   = true;  /* Set to false for normal wiki zoom */
var zoom_factor  = 1.2;   /* 1.0 is normal zoom, 2.0 is 2x zoom */
/* End Editable options */


(function() {

    var d           = document;
    var url         = window.location.href;
    var edit        = url.indexOf('/w/') !=-1;
    var wiki        = url.indexOf('/wiki/') !=-1;
    var leftCol     = null;
    var content     = null;
    var show_panel  = null;

    function unMaskMe() {

        if(wiki || edit) {

            let a, div, style, text;
            leftCol = d.querySelector('div#mw-panel');
            content = d.querySelector('div#content.mw-body');

                // Remove 10em left margin
            if (hide_column) {
                if(leftCol !== null && content !== null) {
                    content.style.marginLeft = '0em';
                    if(!d.getElementById('show_panel')) {
                        div = d.createElement('div');
                        div.style='width:12em;height:1em;position:fixed;top:4px;left:4px;';
                        div.className = 'noprint';
                        a = d.createElement('a');
                        a.id = 'show_panel';
                        a.href = "javascript:void(0)";
                        a.title = 'Open Panel';
                        a.className = 'noprint';
                        a.innerHTML = '&gt;';
                        a.style.marginLeft = '0em';

                        d.body.appendChild(div).appendChild(a);
                        show_panel = d.querySelector('a#show_panel');
                        show_panel.addEventListener("click",togglePanel,!1);
                    }
                    leftCol.style.width ='0em';
                    leftCol.style.height ='100%';
                    leftCol.style.display ='none';
                    leftCol.style.position ='fixed';
                    leftCol.style.overflowY ='scroll';
                    leftCol.style.overflowX ='hidden';

                    if (zoom_pages) zoom(zoom_factor);
                }
            }
            if (dark_theme) appendDarkStyle();

            style = d.createElement("style");
            text = `#content #siteNotice, #frb-inline, .frb {display: none !important;}
                #show_panel:hover {border-color: rgb(65, 135, 214);}
                #show_panel {font-weight: bold;  margin-left: 0px; text-decoration: none;
                 outline-color: initial; outline-style: none; padding: 0px 2px; border-radius: 4px;`;
            if (dark_theme) {
                text += 'border: 1px solid rgb(204, 204, 204); background-color: rgb(28, 28, 28); }';
            }
            else {
                text += 'border: 1px solid rgb(40, 40, 40); background-color: rgb(255, 255, 255); }';
            }
            style.type      = "text/css";
            style.innerText = text;
            d.documentElement.appendChild(style);
        }

    }


    function appendDarkStyle() {
        let style = d.createElement("style");

        style.type = "text/css";
        style.innerText = `@media only screen {
            #p-logo {background-image: linear-gradient(to bottom,rgba(40,40,40,0),#3c3c3c 50%);}
            
            #p-logo a.mw-wiki-logo {background-image: 
              url(https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Paullusmagnus-logo_%28large%29.png/120px-Paullusmagnus-logo_%28large%29.png);}
            
            body, div#content, #mw-panel, #mw-head, table.infobox, .toc, .mw-warning, .toccolours, 
            div.thumbinner, .mw-ui-input, .layouttemplate, .oo-ui-popupWidget-popup, .mw-mmv-post-image, .mw-mmv-image-metadata, 
            .wikitable td[bgcolor="Gainsboro"], .mw-parser-output .module-shortcutboxplain, .mw-parser-output .shortcutbox, 
            #mp-topbanner, .MainPageBG, table.vertical-navbox th, table.vertical-navbox td, .messagebox, table[style*="background: #f7f8ff"],
            *[style*="background: #ccf"]
              {background-color: #1C1C1C !important; /*Background*/}
            
            .vectorTabs .selected, .rt-tooltip, .mbox-small, .navbox, .navbox-subgroup, .catlinks, .navbox-even, 
            .navbox-odd, .mwe-popups, table.tmbox, table#talkheader td, #pagehistory li.selected, #mwe-popups-settings, 
            #filetoc, table.fmbox-system, .fileinfo-paramfield, .licensetpl_wrapper, .filehistory, .filehistory th, 
            .wikitable, .infobox th, .oo-ui-textInputWidget .oo-ui-inputWidget-input, .oo-ui-widget, .iw-resultset, 
            a.oo-ui-buttonElement-button, #mw-AnonymousI18N-suggest, .mw_metadata th, .mw_metadata td, .wikitable caption, 
            .wikitable > tr > th, .wikitable > * > tr > th, .wikitable td[bgcolor="White"], table.ombox-notice, table.ombox, 
            .infobox .mw-collapsible, .infobox .mw-collapsible div, table.vertical-navbox
              {background-color: #2C2C2C !important; /*Light background*/}
            
            .vectorTabs li
              {background-image: linear-gradient(to top,#77c1f6 0,#2c2c2c 1px,#1c1c1c 100%) !important; /*Buttons*/}
            
            #searchInput
              {color: #fff !important; background-color: rgba(44,44,44,0.5) !important; /*Search*/}
            
            .suggestions-results
              {color: #fff !important; background-color: #2c2c2c !important; /*Search suggestions*/}
            
            a.mw-searchSuggest-link .suggestions-result, a.mw-searchSuggest-link .suggestions-special,
            .suggestions-special .special-query, .suggestions a.mw-searchSuggest-link,
            .suggestions a.mw-searchSuggest-link:active, .suggestions a.mw-searchSuggest-link:focus
              {color: #fff !important; background-color: #2c2c2c !important; /*Search suggestions*/}
            
            .suggestions a.mw-searchSuggest-link:hover div
              {background-color: #2738d3 !important;}
            
            ol, h1, h2, h3, h4, h5, h6, div#content, #pt-anonuserpage, table.infobox, .rt-tooltip, .mbox-small, 
            div.reflist ol.references, a#show_panel, .mw-ui-input, #pagehistory li.selected, .mwe-popups a, 
            #mwe-popups-settings, #mwe-popups-settings main form label > span, .filehistory, .mw-mmv-post-image, 
            .oo-ui-textInputWidget .oo-ui-inputWidget-input, .oo-ui-widget, .oo-ui-dropdownWidget-handle, .wikitable, 
            #mp-topbanner, #mp-left, #mp-right, #mp-lower, table.vertical-navbox th, table.vertical-navbox td, 
            .messagebox
              {color: #CCCCCC !important; /*Text*/}
            
            #mw-panel .portal h3, .vectorTabs .selected a, .vectorTabs .selected a:visited, .mw-ui-button,
            #mwe-popups-settings main form label
              {color: #AAAAAA !important; /*Dark text*/}
            
            a, #mw-panel .portal .body li a, .vectorTabs li a
              {color: #4187fa !important; /*Links*/}
            
            .navbox-abovebelow, th.navbox-group, .navbox-subgroup .navbox-title, .nowraplinks .navbox-title, 
            .mw-ui-button, .oo-ui-dropdownWidget-handle
              {background-color: #3c3c2c !important; /*Nav buttons*/}
            
            .mw-advancedSearch-fieldContainer {background: linear-gradient(rgba(0,0,0,0.1),#3c3c3c 0.5em) !important;}
            
            .mwe-popups-overlay {background-color: rgba(40,40,40,0.9) !important;}
            
            .oo-ui-icon-info {background-color: #BBBBBB !important;}
            
            a.image img {background-color: #EEEEEE !important;}
            
            .mwe-popups .mwe-popups-extract[dir="ltr"]::after {
              background-image: -webkit-linear-gradient(to right,rgba(40,40,40,0),#2c2c2c 50%) !important;
              background-image: -moz-linear-gradient(to right,rgba(40,40,40,0),#2c2c2c 50%) !important;
              background-image: linear-gradient(to right,rgba(40,40,40,0),#2c2c2c 50%) !important;}
            
            table td[bgcolor="#CCCCCC"], table th[bgcolor="#CCCCCC"], #mp-upper h2, #mp-lower h2, #mp-other-lower h2
              {color: #3C3C3C !important;}
            
            table.messagebox
              {border-color: #3C3C3C !important;/*Dark border*/}
            
            .wikitable > tr > th, .wikitable > tr > td, .wikitable > * > tr > th, .wikitable > * > tr > td,
            table.layouttemplate
              {border-color: #a2a9b1 !important;/*Medium border*/}
            
            ul
              {list-style-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My`+
              `5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjEzIj4KCTxjaXJjbGUgY3g9IjIuNSIgY3k9IjkiIHI9IjIuNSIgZmlsbD0iI0NDQyIvPgo8L3N2Zz4K) !important;}

            .scrollable-element {scrollbar-color: orange #2C2C2C;} }`;
        d.documentElement.appendChild(style);
    }

    function togglePanel(e) {

        if(leftCol && content) {
            if(leftCol.style.display && leftCol.style.display == 'none') {
                leftCol.style.display = 'block';
                show_panel.innerHTML = '&lt;';
                show_panel.title = 'Close Panel';
                
                animate({
                  duration: 400,
                  timing: function(timeFraction) {
                    return Math.pow(timeFraction, 2);
                  },
                  draw: function(progress) {
                    leftCol.style.width = progress * 10 + 'em';
                    show_panel.style.marginLeft = progress * 9 + 'em';
                    content.style.marginLeft = progress * 10 + 'em';
                  }
                });
            }
            else
            {
                show_panel.innerHTML = '&gt;';
                show_panel.title = 'Open Panel';

                animate({
                  duration: 500,
                  timing: function back(x, timeFraction) {
                    return Math.pow(timeFraction, 2) * ((x + 1) * timeFraction - x)
                  }.bind(null, 2.8),
                  draw: function(progress) {
                    leftCol.style.width = 10 - (progress * 10) + 'em';
                    show_panel.style.marginLeft = 9 - (progress * 9) + 'em';
                    content.style.marginLeft = 10 - (progress * 10) + 'em';
                    if (progress === 1) leftCol.style.display ='none';
                  }
                });
            }
        }
    }

    function zoom(factor) {
        let n, img, imgX, imgY, container;
        let doc = d.querySelector('html');
        let imgs = d.querySelectorAll('#bodyContent img');

        if(doc !== null) {
            doc.style.fontSize = (factor * 100) +'%';
        }

        if(imgs !== null) {
            for(n in imgs) {
                img = imgs[n];
                imgX = img.clientWidth;
		        imgY = img.clientHeight;

		        if(imgX !== undefined && imgY !== undefined) {

		            img.style.width  = imgX * factor + "px";
		            img.style.height = imgY * factor + "px";
		            container = img.parentNode.parentNode;
		            if(container.className == 'thumbinner') {
		                container.style.width = Math.ceil((imgX * factor) + 2) + "px";
		            }

		        }
            }
        }
    }

    function animate({timing, draw, duration}) {
      let start = performance.now();

      requestAnimationFrame(function animate(time) {
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;
        let progress = timing(timeFraction);
        draw(progress);
        if (timeFraction < 1) {
          requestAnimationFrame(animate);
        }
      });

    }

    unMaskMe();

}) ();
