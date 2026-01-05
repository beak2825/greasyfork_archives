// ==UserScript==
// @name         MAM Plus Dev temp
// @namespace    https://greasyfork.org/en/users/36444
// @version      11
// @description  Lots of tiny fixes for MAM
// @author       GardenShade
// @include      https://myanonamouse.net/*
// @include      https://www.myanonamouse.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/28030/MAM%20Plus%20Dev%20temp.user.js
// @updateURL https://update.greasyfork.org/scripts/28030/MAM%20Plus%20Dev%20temp.meta.js
// ==/UserScript==

/* jshint esversion: 6, eqeqeq: true, futurehostile: true, latedef: nofunc, notypeof: true, undef: true, unused: true, browser: true, devel: true, quotmark: single */
/* global GM_setValue, GM_getValue, GM_listValues, GM_deleteValue, GM_addStyle */

(function( window, document, undefined ){
    console.group('Testing...!');
    // Set global variables
    let prevVer  = GM_getValue( 'mp_version' );
    var pagePath = window.location.pathname;
    var pageURL  = window.location.href;

    console.log('Path:',pagePath);
    console.log('URL:',pageURL);

    // Check for & define global namespace
    var MP = MP || {
        VERSION: '11',
        TIMESTAMP: 'Feb 21st',
        UPDATE_LIST: [
        ],
        NEW_BUG_LIST: [
        ],
        theme: {},
        init: function(){
            console.group( '[M+] [v'+MP.VERSION+'] Tweaking MAM...' );

            MP.versionCheck();

            // Find which theme is being used
            MP.theme.is = document.querySelector( 'head link[href*="ICGstation"]' ).getAttribute('href');
            // Set the appropriate theme styles
            if( MP.theme.is.indexOf( 'dark' ) > 0 ){
                MP.theme.is = 'dark';
                MP.theme.btnBorder = '1px solid #bbaa77';
                MP.theme.btnColor  = '#aaa';
            }else{
                MP.theme.is = 'light';
                MP.theme.btnBorder = '1px solid #d0d0d0';
                MP.theme.btnColor  = '#000';
            }
            console.log( '> Theme:',MP.theme.is );

            // Check which page we're on
            MP.getPage( pagePath );
            console.groupEnd();
        },
        versionCheck: function(){
            console.group( '[versionCheck]' );
            // Check to see if this is the first run since an update
            /*if( prevVer !== MP.VERSION){
                // this is not the first time the script has ever run (and the note is allowed)
                if( prevVer !== undefined ){
                    if( GM_getValue( 'mp_alerts' ) ){
                        MP.triggerNote( 'update' );
                    }
                // this is the first time the script has run
                }else{
                    // enable GR buttons, etc, by default
                    GM_setValue( 'mp_gr_btns', true );
                    GM_setValue( 'mp_alerts', true );
                    MP.triggerNote( 'firstRun' );
                }
                // store the current version
                GM_setValue( 'mp_version', MP.VERSION );
            }*/
            console.groupEnd();
        },
        onPage: {
            global: function(){
                /*==============================
                ===== SITE-WIDE CODE
                ==============================*/
                console.group('[Global] Running...');

                let vaultLink = document.querySelector('#millionInfo');

                // Hide the banner image, if enabled
                try{
                    if( GM_getValue( 'mp_hide_banner' ) ){
                        MP.addCSS(['#header',{display:'none'}],['body',{'padding-top':'15px'}]);
                    }
                }
                catch(e){
                    console.warn('ERROR:',e);
                }

                // Hide the home button, if enabled
                try{
                    if( GM_getValue( 'mp_hide_home' ) ){
                        MP.addCSS(['#menu .homeLink',{display:'none'}]);
                    }
                }
                catch(e){
                    console.warn('ERROR:',e);
                }

                // Hide the Browse button, if enabled
                try{
                    if( GM_getValue( 'mp_hide_browse' ) ){
                        MP.addCSS(['#menu .mmTorrents li:first-of-type',{display:'none'}]);
                    }
                }
                catch(e){
                    console.warn('ERROR:',e);
                }

                // Make the vault link go to the donation page
                try{
                    if( GM_getValue( 'mp_vault_link' ) ){
                        MP.setAttributes( vaultLink, {'href': '/millionaires/donate.php'} );
                    }
                }
                catch(e){
                    console.warn('ERROR:',e);
                }

                // Shorten the Vault link & Date info
                try{
                    if( GM_getValue( 'mp_short_info') ){
                        // Select the numeric portion of the vault link & turn it into a number
                        let newText = parseInt( vaultLink.textContent.split(':')[1].split(' ')[1].replace(/,/g, '') );

                        // TODO shorten the date. requires making a custom date object and
                        // updating it every second (or minute?)


                        // Convert the vault amount to millionths
                        newText = (newText / 1000000).toFixed(3);
                        // Update the Vault Link text
                        vaultLink.textContent = 'Vault: '+newText+' million';
                    }
                }
                catch(e){
                    console.warn('ERROR:',e);
                }

                console.groupEnd();
            },
            home: function(){
                /*==============================
                ===== HOME PAGE CODE
                ==============================*/
                console.group('[Home] Running...');

                // Run the shoutbox functions
                try{
                    MP.initShoutbox();
                }
                catch(e){
                    console.warn('ERROR:',e);
                }

                console.groupEnd();
            },
            shoutbox: function(){
                /*==============================
                ===== SHOUTBOX CODE
                ==============================*/
                console.group('[Shoutbox] Running...');

                // Run the shoutbox functions
                try{
                    MP.initShoutbox();
                }
                catch(e){
                    console.warn('ERROR:',e);
                }
                console.log('Done shoutbox');

                console.groupEnd();
            },
            browse: function( page ){
                /*==============================
                ===== BROWSE/SEARCH & REQUESTS CODE
                ==============================*/
                if( page === 'browse' ){
                    console.group('[Browse] Running...');

                    MP.processTorrents();

                    console.groupEnd();
                }else if( page === 'requests' ){
                    console.group('[Requests] Running...');
                    //
                    console.groupEnd();
                }
            },
            torrent: function(){
                /*==============================
                ===== TORRENT PAGE CODE
                ==============================*/
                console.group('[Torrent] Running...');

                var authors     = document.querySelectorAll( '#mainBody tr:nth-child(2) td:last-of-type a' );
                var rawTitle    = document.querySelector( '#mainBody h1' );
                var seriesTitle = document.querySelector( '#mainBody tr:nth-child(3) td:last-of-type a' );
                var bookCover   = document.querySelector( '#posterImage' );
                var torrentID   = Number( pagePath.split('/')[2] );
                var bookTitle   = MP.redoSpaces( rawTitle.textContent );

                // Add the Goodreads Search buttons
                if( GM_getValue( 'mp_gr_btns' ) ){
                    MP.addGoodreadsBtns( authors, bookTitle, seriesTitle );
                }
                // Relocate bookmark
                if( GM_getValue( 'mp_move_bookmark' ) ){
                    MP.moveBookmark( rawTitle, torrentID );
                }
                // Create "Missing Cover" cover
                if( !bookCover.querySelector('img') && GM_getValue('mp_placeholder_covers') ){
                    MP.fakeCover( bookCover, 'missing' );
                }

                // TORRENT FILE LIST: NOT FINISHED
                /*var fileListEnabled = false;
                if( fileListEnabled ){
                    initFileList();
                }
                function initFileList(){
                    document.querySelector('body').innerHTML += '<div class="mp-fileList"></div>';
                    let fileList  = document.querySelector('.mp-fileList');

                    // Don't use jquery
                    $('.mp-fileList').load('/tor/filelist.php?torrentid=3514');

                    queueStyle( '.mp-fileList', {
                        position:'fixed',
                        overflow:'scroll',
                        background:'black',
                        height:'200px',
                        top:0,
                        right:0,
                        transition:'all 500ms ease',
                        'z-index':99980
                    } );
                }*/

                console.groupEnd();
            },
            settings: function(){
                /*==============================
                ===== PREFERENCE PAGE CODE
                ==============================*/
                console.group('[Settings] Running...');

                // Check `pageURL` to make sure we're on the main settings tab
                if( pageURL.endsWith('preferences/index.php') || pageURL.endsWith('?view=general') ){
                    // Create new table elements
                    let settingNav   = document.querySelector( '#mainBody > table' );
                    let mampSetTitle = document.createElement( 'h1' );
                    let mampSetting  = document.createElement( 'table' );

                    // Insert table elements after the Preferences nav bar
                    MP.insertAfter( mampSetTitle, settingNav );
                    MP.insertAfter( mampSetting, mampSetTitle );
                    MP.setAttributes( mampSetting, {
                        'class':'coltable',
                        'cellspacing':'1',
                        'style':'width:100%;min-width:100%;max-width:100%;'
                    } );

                    // Insert text into the table elements
                    mampSetTitle.innerHTML = 'MAM+ Settings';
                    mampSetting.innerHTML  = MP.buildSettingTable( PageDir );

                    // Loop over the Settings Object
                    for( let page in PageDir ){
                        for( let item in PageDir[page] ){
                            if( PageDir[page][item] !== null && typeof PageDir[page][item] === 'object' ){
                                let theID = PageDir[page][item].id;
                                // For each Setting item, if it is True fill in the correct information
                                 if( GM_getValue( theID ) ){
                                    if( PageDir[page][item].type === 'checkbox' ){
                                        document.getElementById( theID ).setAttribute( 'checked','' );
                                    }else if( PageDir[page][item].type === 'textbox' ){
                                        document.getElementById( theID ).value = GM_getValue( theID+'_val' );
                                    }
                                 }
                            }
                        }
                    }

                    // Make a working Save button
                    let ssTimer, mpSubmitBtn = document.querySelector( '#mp_submit' );
                    mpSubmitBtn.addEventListener( 'click', function(){ MP.saveSettings( ssTimer ); }, false );

                    console.log('[Settings] Inserted MAM Plus settings!');

                    // Style the Save button elements
                    MP.addCSS(
                        ['#mp_submit', {border:MP.theme.btnBorder,color:MP.theme.btnColor,'background-image':'radial-gradient(at center center, rgba(136, 136, 136, 0) 0px, rgba(136, 136, 136, 0) 25%, rgba(136, 136, 136, 0) 62%, rgba(136, 136, 136, 0.65098) 100%)','box-sizing':'border-box',padding:'0 8px',display:'inline-block',height:'25px','line-height':'25px',cursor:'pointer'}],
                        ['#mp_submit ~ .mp_savestate', {'font-weight':'bold',color:'green',padding:'0 20px',cursor:'default'}]
                    );
                }
                console.groupEnd();
            },
            vault: function( page ){
                /*==============================
                ===== VAULT CODE
                ==============================*/
                console.group('[Vault] Running...');
                let vaultPage = document.querySelector('#mainBody');

                // Simplify the vault pages
                if( GM_getValue( 'mp_simple_vault' ) ){
                    // Clone a select few elements from the page
                    let donateBtn = vaultPage.querySelector('form');
                    let donateTable = vaultPage.querySelector('table:last-of-type');
                    // Delete the original page
                    vaultPage.innerHTML = '';
                    // Add the new Donate button if it exists
                    if( donateBtn !== null ){
                        let newDonate = donateBtn.cloneNode(true);
                        vaultPage.appendChild(newDonate);
                        newDonate.classList.add('mp_vaultClone');
                    }else{
                        vaultPage.innerHTML = '<h1>Come back tomorrow!</h1>';
                    }
                    // Add the new Donate table if it exists
                    if( donateTable !== null ){
                        let newTable = donateTable.cloneNode(true);
                        vaultPage.appendChild(newTable);
                        newTable.classList.add('mp_vaultClone');
                    }else{
                        vaultPage.style.paddingBottom = '25px';
                    }

                    // Add padding to the newly created elements
                    MP.addCSS(['.mp_vaultClone',{'margin-top':'20px'}]);

                    if( page === 'donate' ){
                        // Style the donate buttons
                        MP.addCSS(
                            ['.mp_vaultClone input,.mp_vaultClone select',{'font-size':'1.5em','display':'inline-block','margin-right':'10px'}],
                            ['.mp_vaultClone br',{'display':'none'}]
                        );
                    }
                }

                if( page === 'donate' ){
                    // Make the largest possible donate amount the default
                    if( GM_getValue( 'mp_donate_default' ) ){
                        vaultPage.querySelector('form option:last-of-type').selected = true;
                    }
                    // Set up a donation reminder
                    // TODO
                    if( GM_getValue( 'mp_donate_remind' ) ){
                        let timer = vaultPage.querySelector('form input:first-of-type');
                        let donator = vaultPage.querySelector('form input:last-of-type');
                        // Log the donate time when the donate button is clicked
                        donator.addEventListener( 'click', function(){
                            GM_setValue( 'mp_last_donate_time', timer.value );
                        } );
                    }
                }
                console.groupEnd();
            }
        },
        arrToStr: function( inp, addSpace ){
            let str = '';
            for( let i = 0; i < inp.length; i++ ){
                str += inp[i];
                if( addSpace && i+1 !== inp.length ){
                    str += ' ';
                }
            }
            return str;
        },
        itemAtStart: function( arr, item ){
            // Check if the array starts with `item`
            if( arr.indexOf( item ) === 0 ){
                return true;
            }else{
                return false;
            }
        },
        redoSpaces: function( inp ){
            // Strip the whitespace from the string, then add it back in
            return MP.arrToStr( MP.strToArr( inp, 'ws' ), true );
        },
        strToArr: function( inp, splitPoint ){
            if( typeof inp === 'string' ){
                let outp = [];
                if( splitPoint !== 'ws' && splitPoint !== undefined ){
                    console.log('[strToArr] Splitting @',splitPoint);
                    inp = inp.split( splitPoint );
                }else{
                    console.log('[strToArr] splitting @ whitespace');
                    inp = inp.match( /\S+/g ) || [];
                }
                for( let i = 0; i < inp.length; i++ ){
                    console.log('>>>',inp[i]);
                    outp.push( inp[i] );
                }
                return outp;
            }else{
                console.log('[strToArr] [ERROR] Expected str input:', inp);
            }
        },
        trimStr: function( inp, max ){
            if( inp.length > max ){
                inp = inp.substring( 0, max+1 );
                inp = inp.substring( 0, Math.min( inp.length, inp.lastIndexOf(' ') ) );
            }
            return inp;
        },
        addCSS: function( ...args ){
            /* USAGE: buildCSS( [css_tag, css_obj ], [css_tag, css_obj ]... ); */
            let styleArray = [];
            let css = '';
            // Loop through received arguments
            for( let i=0; i<args.length; i++ ){
                let obj = args[i][1];
                // Check that an array with two items was passed
                // The first item must be a string, the second an object
                if( Array.isArray( args[i] ) && args[i].length === 2 && typeof args[i][0] === 'string' && typeof obj === 'object' ){
                    // Turn the object into a CSS-valid string
                    for( let item in obj ){
                        css += item+':'+obj[item]+';';
                    }
                    // Add the CSS tag and push the whole thing to an Array
                    styleArray.push( args[i][0]+'{'+css+'}' );
                    css = '';
                }else{
                    console.log( '[buildCSS] [ERROR] Wrong argument provided:',args[i] );
                }
            }
            // Add the CSS block to the website
            GM_addStyle( MP.arrToStr(styleArray, true) );
        },
        getPage: function( pagePath ){
            // Do Global fixes
            MP.onPage.global();
            // console.log('pagePath',pagePath.split('/')[1]);

            // Run functions relevant to the current page
            switch( pagePath.split('/')[1] ){
                case null:
                    break;
                case '':
                    MP.onPage.home();
                    break;
                case 'shoutbox':
                    MP.onPage.shoutbox();
                    break;
                case 'tor':
                    if( pagePath.split('/')[2].indexOf( 'browse' ) === 0 ){
                        MP.onPage.browse( 'browse' );
                    }else if( pagePath.split('/')[2].indexOf( 'request' ) === 0 ){
                        MP.onPage.browse( 'requests' );
                    }
                    break;
                case 't':
                    MP.onPage.torrent();
                    break;
                case 'preferences':
                    MP.onPage.settings();
                    break;
                case 'millionaires':
                    if( pagePath.split('/')[2].indexOf( 'pot' ) === 0 ){
                        MP.onPage.vault( 'pot' );
                    }else if( pagePath.split('/')[2].indexOf( 'donate' ) === 0 ){
                        MP.onPage.vault( 'donate' );
                    }
                    break;
            }
        },

        insertAfter: function( newNode, referenceNode ){
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        },
        setAttributes: function( el, attrs ){
            for(let key in attrs) { el.setAttribute(key, attrs[key]); }
        },
        bracketRemover: function( inp ) {
            return inp
                .replace(/{+.*?}+/g, '')
                .replace(/\[\[|\]\]/g, '')
                .replace(/<.*?>/g, '')
                .replace(/\(.*?\)/g, '')
                .trim();
        },
        buildSettingTable: function( obj ){
            // Build the start of the table
            let outp = '<tbody><tr><td class="row1" colspan="2">Here you can enable &amp; disable any feature from the <a href="/forums.php?action=viewtopic&topicid=41863&page=p376355#376355">MAM+ userscript</a>! However, these settings are <strong>NOT</strong> stored on MAM; they are stored within the Tampermonkey/Greasemonkey extension in your browser, and must be customized on each of your browsers/devices separately.</td></tr>';

            // For every Page Object listed in the Main Object...
            for( let page in obj ){
                // append a new row with the title of the page...
                outp += '<tr><td class="row2">'+obj[page].title+'</td><td class="row1">';
                // then, for every item in the Page Object...
                for( let item in obj[page] ){
                    // if the item exists and is a Setting Object...
                    if( obj[page][item] !== null && typeof obj[page][item] === 'object' ){
                        // append an input field with the Setting Object's values
                        if( obj[page][item].type === 'checkbox' ){
                            outp += '<input type="checkbox" id="'+obj[page][item].id+'" value="true"> '+obj[page][item].desc+'<br>';
                        }else if( obj[page][item].type === 'textbox' ){
                            outp += obj[page][item].tag+': <input type="text" id="'+obj[page][item].id+'" placeholder="'+obj[page][item].placeholder+'" size="25"> '+obj[page][item].desc+'<br>';
                        }
                    }
                }
                // and finally close the row
                outp += '</td></tr>';
            }

            // Build the submit button and the end of the table
            outp += '<tr><td class="row1" colspan="2"><div id="mp_submit">Save M+ Settings</div><span class="mp_savestate" style="opacity:0">Saved!</span></td></tr></tbody>';

            return outp;
        },
        saveSettings: function( timer ){
            var savestate = document.querySelector('.mp_savestate');
            console.group('[saveSettings] Saving...');

            // Reset the save message and timer
            savestate.style.opacity = '0';
            window.clearTimeout(timer);

            // Set all currently known values to False (with exceptions)
            for( let item in GM_listValues() ){
                if( GM_listValues()[item] !== 'mp_version' ){
                    GM_setValue( GM_listValues()[item],false );
                }
            }

            // Loop over the Settings Object
            for( let page in PageDir ){
                for( let item in PageDir[page] ){
                    if( PageDir[page][item] !== null && typeof PageDir[page][item] === 'object' ){
                        let theID = PageDir[page][item].id;
                        if( PageDir[page][item].type === 'checkbox' ){
                            // Save each check-marked Setting item
                            if( document.getElementById( theID ).checked ){
                                GM_setValue( theID,true );
                            }
                        }else if( PageDir[page][item].type === 'textbox' ){
                            // Get the user's input from the text box
                            let inp = document.getElementById( theID ).value;
                            // If the box isn't empty, save the input
                            if( inp !== '' ){
                                GM_setValue( theID,true );
                                GM_setValue( theID+'_val',inp );
                            }
                        }
                    }
                }
            }
            console.log('Saved!');

            // Briefly display the "Saved" message
            savestate.style.opacity = '1';
            timer = window.setTimeout(function(){
                savestate.style.opacity = '0';
            },2345);

            console.groupEnd();
        },
        triggerNote: function( type ){
            let message = '';
            if( type === 'update' ){
                message += '<strong>MAM+ has been updated!</strong> You are now using v'+MP.VERSION+', published on '+MP.TIMESTAMP+'. Discuss it on <a href="/forums.php?action=viewtopic&topicid=41863">the forums</a>.<hr>';
                if( MP.UPDATE_LIST.length > 0 && MP.UPDATE_LIST[0] !== '' ){
                    message += '<h4>Changes:</h4><ul>';
                    for( let u=0; u<MP.UPDATE_LIST.length; u++ ){
                        message += '<li>'+MP.UPDATE_LIST[u]+'</li>';
                    }
                    message += '</ul>';
                }
                if( MP.NEW_BUG_LIST.length > 0 && MP.NEW_BUG_LIST[0] !== '' ){
                    message += '<h4>New Bugs:</h4><ul>';
                    for( let n=0; n<MP.NEW_BUG_LIST.length; n++ ){
                        message += '<li>'+MP.NEW_BUG_LIST[n]+'</li>';
                    }
                    message += '</ul>';
                }
            }else if( type === 'firstRun' ){
                message = '<h4>Welcome to MAM+!</h4>Please head over to your <a href="/preferences/index.php">preferences</a> to enable the MAM+ settings.<br>Any bug reports, feature requests, etc. can be made on <a href="/forums.php?action=viewtopic&topicid=41863">the forums</a> or <a href="/sendmessage.php?receiver=108303">through private message</a>.';
            }

            document.body.innerHTML += '<div class="mp_triggerNote">'+message+'<span>X</span></div>';
            var messageBox = document.querySelector( '.mp_triggerNote' );
            var closeBtn = messageBox.querySelector( 'span' );

            closeBtn.addEventListener( 'click', function(){
                messageBox.remove();
            }, false );

            MP.addCSS(
                ['.mp_triggerNote',{position:'fixed',padding:'20px 40px',width:'100%',bottom:0,left:0,background:'#333',color:'#bbb','box-shadow':'0 0 4px 0 rgba(0,0,0,0.3)','z-index':99998}],
                ['.mp_triggerNote span', {position:'absolute',padding:'5px 10px',display:'inline-block',top:'-10px',right:'90px',background:'#333',color:'red','box-shadow':'0 0 4px 0 rgba(0,0,0,0.3)','border-radius':'50px',cursor:'pointer','z-index':99999}]
            );
        },
        initShoutbox: function(){
            console.group('[INIT SHOUTBOX]');
            // Function for retrieving shoutbox settings
            /*let getShoutParams = function( getValue, allow ){
                let arr = [];
                // For the given setting...
                if( GM_getValue( getValue ) ){
                    // Check the `_vals` storage
                    let vals = GM_getValue( getValue+'_val' ).split(',');
                    for( let i=0; i<vals.length; i++ ){
                        // If the value is supposed to be a number, only load numbers
                        if( allow === 'num' ){
                            if( !isNaN( Number( vals[i] ) ) ){
                                arr.push( Number( vals[i] ) );
                            }
                        // If the value is a string, it doesn't matter what gets loaded
                        }else if( allow === 'str' ){
                            arr.push( vals[i].trim() );
                        }
                    }
                }
                // Return an array if it's not empty, otherwise return false
                if( arr[0] !== undefined ){ return arr; }else{ return false; }
            };*/
            // Function for changing the style of shouts
            let changeMsg = function( tar, type ){
                if( type === 'hide' ){
                    tar.style.filter = 'blur(3px)';
                    tar.style.opacity = '0.3';
                }else if( type === 'show' ){
                    tar.style.filter = 'blur(0)';
                    tar.style.opacity = '0.5';
                }else if( type === 'emphasize' ){
                    tar.style.fontWeight = 'bold';
                }else if( type === 'alert' ){
                    tar.style.color = 'red';
                }
            };
            // Function for applying styles to shout that match the user's settings
            let findUserShouts = function( shout, procList, type ){
                // If the setting is not empty...
                if( procList !== false ){
                    for( let j=0; j<procList.length;j++ ){
                        // Find the user ID of the shout
                        let shoutTag = shout.querySelector( 'a:nth-of-type(2)' ).href.split('/');
                        // If it matches an ID in the user's settings...
                        if( Number( shoutTag[shoutTag.length-1] ) === procList[j] ){
                            if( type === 'ignore' ){
                                // Hide messages from ignored users
                                changeMsg( shout, 'hide' );
                                // Reveal messages on hover; hide on mouseleave
                                shout.addEventListener('mouseenter',function(event){
                                    changeMsg( event.target, 'show' );
                                });
                                shout.addEventListener('mouseleave',function(event){
                                    changeMsg( event.target, 'hide' );
                                });
                            }else if( type === 'priority' ){
                                // Emphasize shouts from priority users
                                changeMsg( shout, 'emphasize' );
                            }
                        }
                    }
                }
            };
            // Function for finding key words in shouts
            let findKeywords = function( shout, procList ){
                // If the setting is not empty...
                if( procList !== false ){
                    let buildExpr = '';
                    // Select the text after the `(user class)`
                    let shoutText = shout.textContent.split(')');
                    MP.arrToStr( shoutText.splice(0,1) );
                    shoutText+='';
                    // Build the RegEx logic with all user-defined words
                    for( let i=0; i<procList.length;i++ ){
                        buildExpr += '\\b'+procList[i]+'\\b';
                        if( i+1 !== procList.length ){
                            buildExpr += '|';
                        }
                    }
                    // Define the RegEx and make it case insensitive
                    let expr = new RegExp( buildExpr,'i');
                    // Style the text if a word is found
                    if( shoutText.search( expr ) > 0 ){
                        changeMsg( shout, 'alert' );
                    }
                }
            };
            // Function for iterating through shouts
            let processShouts = function( Processes, callback ){
                console.group('Processing shouts');
                // Select any shout that hasn't been processed yet, then loop over them
                var shouts = document.querySelectorAll('#sbf div:not(.mp_processed)');
                for( let i=0; i<shouts.length; i++ ){
                    // I think this might be redundant?
                    if( !shouts[i].classList.contains( 'mp_processed' ) ){
                        // Add the processed class, and search the shout
                        shouts[i].classList.add('mp_processed');
                        findUserShouts( shouts[i], Processes.ignore, 'ignore' );
                        findUserShouts( shouts[i], Processes.priority, 'priority' );
                        findKeywords( shouts[i], Processes.keywords );
                    }
                }
                if( callback ){
                    callback();
                }
                console.groupEnd();
            };

            console.log('Before');

            // If at least one shoutbox setting is enabled
            if( true ){
                console.group('Test for shoutbox');
                // Check if shoutbox exists on page
                let sbox = document.querySelector('#sbf');
                if( sbox ){
                    console.group( 'Page has shoutbox' );
                    let Processes = {};
                    // Load the information stored in the user's settings
                    Processes.ignore   = [107512];
                    Processes.priority = [101383];
                    Processes.keywords = ['the'];

                    console.log('Hardcoded ignore',Processes.ignore);
                    console.log('Hardcoded priority',Processes.priority);
                    console.log('Hardcoded keywords',Processes.keywords);

                    try{
                        // Wait for page to load
                        MP.pageLoad( function(){
                            // Process the initial shouts, then...
                            processShouts( Processes, function(){
                                // ...periodically check for and process new shouts
                                window.setInterval(function(){ processShouts( Processes, false ); }, 500);
                            } );
                        } );
                    }
                    catch(e){
                        console.warn('ERROR',e);
                    }

                    console.groupEnd();
                }
            }
            console.log('After');
            console.groupEnd();
        },
        addGoodreadsBtns: function( authorTitle, bookTitle, seriesTitle ){
            let book, bookURL, author, authorURL, series, seriesURL, bothURL, buttons = [];
            let targetRow = document.querySelector( '#download' ).parentNode;
            let category  = document.querySelector( '#cat' ).textContent;
            // Function for returning GR-formatted authors
            let smartAuth = function( inp ){
                let outp = '';
                inp = MP.strToArr( inp );
                for( let i=0; i<inp.length; i++ ){
                    if( inp[i].length < 2 ){
                        // Don't add a space if two initials are adjacent
                        if( inp[i+1].length < 2 ){ outp += inp[i]; }
                        else{ outp += inp[i]+' '; }
                    }
                    else{ outp += inp[i]+' '; }
                }
                return outp.trim();
            };
            // Function for returning a title that was split with a dash
            let checkDashes = function( theTitle, theAuth ){
                if(  theTitle.indexOf(' - ') !== -1 ){
                    console.log( '> Book title contains a dash' );
                    let bookSplit = theTitle.split(' - ');
                    // If the front of the dash matches the author, use the back
                    if( bookSplit[0] === theAuth ){
                        console.log( '> String before dash is author; using string behind dash' );
                        return bookSplit[1];
                    }else{
                        return bookSplit[0];
                    }
                }else{
                    return theTitle;
                }
            };
            // Function for building Goodreads URLs
            let buildURL = function( type, inp ){
                // Only allow GR search types
                if( type === 'title','author','series','on' ){
                    // Correct the book & series searches
                    if( type === 'book' ){ type = 'title'; }
                    else if( type === 'series' ){ type = 'on'; inp += ', #'; }
                    // Fix apostrophe issue and return a full URL
                    return 'https://www.goodreads.com/search?q='+encodeURIComponent( inp ).replace( '\'','&apos;' )+'&search_type=books&search%5Bfield%5D='+type;
                }
            };
            // Function to return a button element
            let makeButton = function( desc, theURL ){
                return '<a class="mp_button_clone" href="'+theURL+'" target="_blank">'+desc+'</a>';
            };
            // Function for processing title content
            let processTitle = function( type, rawTitle, urlTar ){
                let title = '', desc = '';
                if( type === 'book' ){
                    desc = 'Title';
                    // Check the title for brackets & shorten it
                    title = MP.trimStr( MP.bracketRemover( rawTitle ), 50 );
                    // Check the title for dash divider
                    title = checkDashes( title, author );
                }else if( type === 'author' ){
                    desc = 'Author';
                    // Only use a few authors
                    for( let i=0; i<rawTitle.length && i<3; i++ ){
                        title += rawTitle[i].textContent+' ';
                    }
                    // Check author for initials
                    title = smartAuth( title );
                }else if( type === 'series' ){
                    desc = 'Series';
                    title = MP.redoSpaces( rawTitle.textContent );
                }
                urlTar = buildURL( type, title );
                buttons.splice( 0, 0, makeButton( desc, urlTar ) );
                console.log( '> '+type+': '+title+' ('+urlTar+')' );
                return title;
            };

            // If the torrent page is a book category...
            if( category.indexOf( 'Ebooks' ) === 0 || category.indexOf( 'Audiobooks' ) === 0 ){
                // Begin adding the rows, cells, and buttons
                let buttonRow   = targetRow.parentNode.insertRow( targetRow.rowIndex );
                let titleCell   = buttonRow.insertCell(0);
                let contentCell = buttonRow.insertCell(1);
                titleCell.innerHTML = 'Search Goodreads';

                // Check if the book has a series defined
                if( seriesTitle !== null ){
                    series = processTitle( 'series', seriesTitle, seriesURL );
                }
                // Check if the book has an author defined
                if( authorTitle.length !== 0 ){
                    author = processTitle( 'author', authorTitle, authorURL );
                }
                // Check if the book has a title
                if( bookTitle !== null ){
                    book = processTitle( 'book', bookTitle, bookURL );
                }
                // Build the title+author URL if possible
                if( book && author ){
                    bothURL = buildURL( 'on', book+' '+author );
                    buttons.splice( 0, 0, makeButton( 'Title + Author', bothURL ) );
                }

                // Loop over the compiled buttons and insert them into the page
                for( let i=0; i<buttons.length; i++ ){
                    contentCell.innerHTML += buttons[i]+' ';
                }

                // Use existing styles for button consistency
                titleCell.setAttribute( 'class', 'rowhead' );
                contentCell.setAttribute( 'class', 'row1' );
                MP.addCSS(['a.mp_button_clone',{
                    border: MP.theme.btnBorder,
                    color: MP.theme.btnColor,
                    'background-image': 'radial-gradient(at center center, rgba(136, 136, 136, 0) 0px, rgba(136, 136, 136, 0) 25%, rgba(136, 136, 136, 0) 62%, rgba(136, 136, 136, 0.65098) 100%)',
                    'box-sizing': 'border-box',
                    padding: '0 4px'
                }]);
                console.log( '[M+] Added Goodreads buttons!' );
            }else{
                console.log( '[M+] Category does not require Goodreads button' );
            }
        },
        moveBookmark: function( tar, torID ){
            if( !isNaN( torID ) && torID !== 0 ){
                // Hide the old bookmark
                document.querySelector('#mainBody td.rowhead a[href^="/bookmark.php?"]').style.display = 'none';

                let iconURL = '';
                if( MP.theme.is === 'dark' ){
                    iconURL = '//cdn.myanonamouse.net/imagebucket/108303_mark_white.gif';
                }else{
                    iconURL = '//cdn.myanonamouse.net/imagebucket/108303_mark_black.gif';
                }

                tar.innerHTML += '<a id="mp_bookmark" href="/bookmark.php?torrent='+String(torID)+'"><img src="'+iconURL+'"></a>';

                MP.addCSS(['#mp_bookmark',{display:'inline-block',position:'relative',top:'3px','padding-left' :'20px'}]);
                console.log( '[M+] Moved the bookmark icon!' );
            }else{
                console.log( '> [M+] ERROR: Can\'t build bookmark! Expected number at position [2] of `'+pagePath+'` but received `'+torID+'`' );
            }
        },
        fakeCover: function( bookCover, type ){
            if( type === 'missing' ){
                bookCover.innerHTML += '<div class="mp_cover">(no image)</div>';
                MP.addCSS(['.mp_cover',{display:'inline-block',width:'130px',height:'200px','line-height':'200px',background:'#333',color:'#777','text-align':'center'}]);
            }
        },
        processTorrents: function(){
            let snatchedVis = true;
            // Internal function for toggling the Snatched button
            var toggleSnatched = function( button, state ){
                // Get a list of all snatched titles
                let snatchList = document.querySelectorAll('#searchResults tr[id^="tdr"] td div[class^="browse"]');
                let action = 'Hid';
                for( let snatch in snatchList ){
                    // Find the row that contains the snatched title
                    let theRow = snatchList[snatch].parentElement.parentElement;
                    if( state ){
                        // If snatches are visible, hide them and change the button text
                        theRow.style.display = 'none';
                        snatchedVis = false;
                        button.innerHTML = 'Show Snatched';
                        MP.reportCount('Hiding',snatchList.length,'snatched torrent');
                    }else{
                        // If snatches are hidden, show them and change the button text
                        theRow.removeAttribute('style');
                        snatchedVis = true;
                        action = 'Revealed';
                        button.innerHTML = 'Hide Snatched';
                        MP.reportCount('Showing',snatchList.length,'snatched torrent');
                    }
                }
            };
            // Internal function to create a Hide Snatched toggle button
            var createToggle = function(){
                // Create a new button
                let clearNewBtn = document.querySelector( '#resetNewIcon' );
                let toggleBtn   = document.createElement( 'h1' );

                // Insert the button into the menu
                MP.insertAfter( toggleBtn, clearNewBtn );
                MP.setAttributes( toggleBtn, {
                    'id': 'mp_snatchedToggle',
                    'class': 'torFormButton',
                    'role': 'button'
                } );

                toggleBtn.innerHTML = 'Hide Snatched';
                // Listen for button clicks
                toggleBtn.addEventListener( 'click', function(){ toggleSnatched( toggleBtn, snatchedVis  ); }, false );
            };

            // Add the Hide Snatched button if enabled
            if( GM_getValue( 'mp_hide_snatched' ) ){
                createToggle();
            }
        },
        reportCount: function( did, num, thing ){
            // Logs a number
            if( num !== 1 ){ thing += 's'; }
            console.log( '>',did,num,thing );
        },
        findOutside: function( inp ){
            // This function returns text that is outside any HTML tags
            // Currently unused. Should probably add a try() because this might
            // require .innerHTML on the elements it receives. Doesn't filter out
            // self-contained tags like <br> or <hr>
            return inp.replace( /<(\w+)\b[^<>]*>[\s\S]*?<\/\1>/gm, '');
        },
        pageLoad: function( func ){
            // Function that waits for the page to load|timeout before running a function
            let timeout  = false;
            // Set up a fallback timer in case the page takes too long to load
            let fallback = setTimeout( function(){
                console.log('> Page has timed out');
                timeout = true;
                func();
            },5000 );
            // Wait for the page to load
            document.onreadystatechange = function(){
                if (document.readyState === 'complete') {
                    console.log('> Page has loaded');
                    // If the page loads, remove the fallback and run the function
                    clearTimeout( fallback );
                    func();
                }
            };
        }
    };

    const PageDir = {
        global: {
            title: 'Global',
            set_alerts: {
                id: 'mp_alerts',
                type: 'checkbox',
                desc: 'Enable the MAM+ Alert panel for update information, error messages, etc.'
            },
            set_hideBanner: {
                id: 'mp_hide_banner',
                type: 'checkbox',
                desc: 'Remove the header image. (Not recommended if the below is enabled)'
            },
            set_hideHome: {
                id: 'mp_hide_home',
                type: 'checkbox',
                desc: 'Remove the home button. (Not recommended if the above is enabled)'
            },
            set_hideBrowse: {
                id: 'mp_hide_browse',
                type: 'checkbox',
                desc: 'Remove the Browse button, because Browse &amp; Search are the same'
            },
            set_vaultLink: {
                id: 'mp_vault_link',
                type: 'checkbox',
                desc: 'Make the Vault link bypass the Vault Info page',
            },
            set_shortInfo: {
                id: 'mp_short_info',
                type: 'checkbox',
                desc: 'Shorten the Vault link text',
            }
        },
        browse: {
            title: 'Browse &amp; Search',
            set_hideSnatched: {
                id: 'mp_hide_snatched',
                type: 'checkbox',
                desc: 'Enable the Hide Snatched button'
            }
        },
        torrent: {
            title: 'Torrent Page',
            set_grBtn: {
                id: 'mp_gr_btns',
                type: 'checkbox',
                desc: 'Enable the MAM-to-Goodreads buttons'
            },
            set_moveBookmark: {
                id: 'mp_move_bookmark',
                type: 'checkbox',
                desc: 'Move the bookmark icon up to the title'
            },
            set_placeholderCovers: {
                id: 'mp_placeholder_covers',
                type: 'checkbox',
                desc: 'Display a placeholder cover for torrents with no picture'
            }
        },
        shoutbox: {
            title: 'Shoutbox',
            set_blockUsers: {
                id: 'mp_block_users',
                type: 'textbox',
                tag: 'Block Users',
                desc: 'Hides messages from the listed users in the shoutbox',
                placeholder: 'ex. 1234,108303,10000'
            },
            set_priorityUsers: {
                id: 'mp_priority_users',
                type: 'textbox',
                tag: 'Emphasize Users',
                desc: 'Emphasizes messages from the listed users in the shoutbox',
                placeholder: 'ex. 6,25420,77618'
            },
            set_keywords: {
                id: 'mp_shout_keywords',
                type: 'textbox',
                tag: 'Keyword Alerts',
                desc: 'Emphasizes messages containing key words',
                placeholder: 'ex. GardenShade,sci-fi,rhombus'
            }
        },
        vault: {
            title: 'Mil. Vault',
            set_simpleVault: {
                id: 'mp_simple_vault',
                type: 'checkbox',
                desc: 'Simplify the Vault pages. (This removes everything except the donate button &amp; list of recent donations)',
            },
            set_donateDefault: {
                id: 'mp_donate_default',
                type: 'checkbox',
                desc: 'Select the largest possible donation amount by default',
            }/*,
            set_donate_remind: {
                id: 'mp_donate_remind',
                type: 'checkbox',
                desc: 'INCOMPLETE',
            }*/
        }
    };

    // Run MAM+
    try{MP.init();}
    catch(e){console.warn('ERROR: Failed to init MAM+...',e);}
    console.log( '[M+] [v'+MP.VERSION+'] Finished successfully!' );

})(window,document);
