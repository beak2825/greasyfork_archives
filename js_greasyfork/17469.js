// ==UserScript==
// @name                Steam Free License Helper
// @author              PurelyCfictional
// @namespace   http://steamcommunity.com/id/mckack
// @version             1.36
// @description Adds buttons to SteamDB and your Steam licenses page to easily install free on demand or no cost packages.
// @match               https://store.steampowered.com/account/licenses/*
// @match               https://steamdb.info/search/*
// @grant               GM_log
// @grant               GM_getValue
// @grant               GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/17469/Steam%20Free%20License%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/17469/Steam%20Free%20License%20Helper.meta.js
// ==/UserScript==
 
// Updated 2015-08-26 08:34 CET
 
// Borrow jQuery from current site
$ = unsafeWindow.jQuery;
 
// -------------------- SteamDB page --------------------
if( location.href.match( /^https:\/\/steamdb\.info\/search\/.*sub_keyname.*$/ ) ) {
 
    // Fetch and set type of subs search if relevant
    var linkimg = '<img style="border: none; padding: none;" src="data:image/gif;base64,R0lGODlhDAAMAJEBADpKX8IOzV54m////yH5BAEAAAEALAAAAAAMAAwAAAIljIWZFjIPh2BugAukile/aoXI92Ri5ZjQKEUrqsTuR80SFS9GAQA7" />';
   
    if( location.href.match( /.*keyvalue=12.*/ ) ) {
        var sflh_jumpto = '<strong><a href="https://steamdb.info/search/?a=sub_keynames&keyname=1&operator=3&keyvalue=0" target="_self">No Cost subs</a></strong> or your ' +
            '<strong><a href="https://store.steampowered.com/account/licenses/" target="_self">Steam Account Licenses page</a></strong> ' + linkimg;
        var sflh_type = 'Free on Demand';
        var sflh_typeID = 'sflh_fods';
    } else if( location.href.match( /.*keyvalue=0.*/ ) ) {
        var sflh_jumpto = '<strong><a href="https://steamdb.info/search/?a=sub_keynames&keyname=1&operator=3&keyvalue=12" target="_self">Free on Demand subs</a></strong> or your ' +
            '<strong><a href="https://store.steampowered.com/account/licenses/" target="_self">Steam Account Licenses page</a></strong> ' + linkimg;
        var sflh_type = 'No Cost';
        var sflh_typeID = 'sflh_nocs';
    } else {
        var sflh_jumpto = '<strong><a href="https://steamdb.info/search/?a=sub_keynames&keyname=1&operator=3&keyvalue=12" target="_self">Free on Demand subs</a></strong>, ' +
            '<strong><a href="https://steamdb.info/search/?a=sub_keynames&keyname=1&operator=3&keyvalue=0" target="_self">No Cost subs</a></strong> or your ' +
            '<strong><a href="https://store.steampowered.com/account/licenses/" target="_self">Steam Account Licenses page</a></strong> ' + linkimg;
    };
   
        // DOM-to-Userscript functions
    unsafeWindow.sflh_update = function() {
        console.clear();
        localStorage.sflh_trailerschk = $( '#trailers' ).is( ':checked' ) ? 'checked ' : '';
        localStorage.sflh_demoschk = $( '#demos' ).is( ':checked' ) ? 'checked ' : '';
        //localStorage.sflh_idsonlychk = $( '#idsonly' ).is( ':checked' ) ? 'checked ' : '';
       
        var sflh_list = $( '#table-sortable > tbody' ).text( ).replace( /(\d{1,6})\n(.*)\n(12|0)\n.*ago\n*/igm, "$1, //$2\n" ).replace( /0, \/\/Steam\n/igm, '' );
       
        if ( localStorage.sflh_trailerschk === '' ) {
            sflh_list = sflh_list.replace( /\d{2,6},\s\/\/.*(((\s|\()ESRB.*|(\s|\()PEGI.*)|(\s|_)tr?aii?ler(\s\w*|.*USK)?(..\sNew|\sKingdom|2\s\w*)?|\steaser.?|dev.diary.*|TV.spot.*|Meet\sthe\s\w*|gameplay|ged\strailed)$\n/igm, '' );
        };
       
        if ( localStorage.sflh_demoschk === '' ) {
            sflh_list = sflh_list.replace( /\d{2,6},\s\/\/.*(Demo\s?\d?|07\sDemo.*)$\n/igm, '' );
        };
       
        //if ( localStorage.sflh_idsonlychk !== '' ) {
        //    sflh_list = sflh_list.replace( /(\d{2,6},).*?$\n?/igm, '$1' );
        //};
       
        sflh_list = sflh_list.replace( /(\d{2,6},).*?$\n?/igm, '$1' );
       
        //var sflh_listcount = $( '#idsonly' ).is( ':checked' ) ? sflh_list.split( ',' ).length - 1 : sflh_list.split( ', //' ).length - 1;
        var sflh_listcount = sflh_list.split( ',' ).length - 1;
        GM_setValue( sflh_typeID, sflh_list.substr( 0, sflh_list.lastIndexOf( ',' ) ) + sflh_list.substr( sflh_list.lastIndexOf( ',' ) + 1,sflh_list.length ) );
        console.log( '//' + sflh_listcount + ' entries' + GM_getValue( sflh_typeID ) );
        alert(sflh_listcount + ' entries added to Steam Free License Helper\'s list of ' + sflh_type + ' subs!');
    };
   
    // Buttons
    var sflh_btns = $( '<span style="float:right; ">' +
                      '<input type="checkbox" ' + localStorage.sflh_trailerschk + 'name="trailers" value="trailers" id="trailers" style="margin-right: 4px; width: 16px; height: 16px; display: inline-block; vertical-align: text-bottom;" />Include trailers <a href="javascript:alert( \x27Experimental. Unchecking may not filter out everything.\x27 ); void( 0 );" title="Experimental. Unchecking may not filter out everything." style="cursor: help; font-size: 85%; position: relative; top: -0.25em;">?</a> ' +
                      '<input type="checkbox" ' + localStorage.sflh_demoschk + 'name="demos" value="demos" id="demos" style="margin-right: 4px; margin-left: 4px; width: 16px; height: 16px; display: inline-block; vertical-align: text-bottom;" />Include demos <a href="javascript:alert( \x27Experimental. Unchecking may not filter out everything.\x27 ); void( 0 );" title="Experimental. Unchecking may not filter out everything." style="cursor: help; font-size: 85%; position: relative; top: -0.25em;">?</a> ' +
                      //'<input type="checkbox" ' + localStorage.sflh_idsonlychk + 'name="idsonly" value="idsonly" id="idsonly" style="margin-right: 4px; margin-left: 4px; width: 16px; height: 16px; display: inline-block; vertical-align: text-bottom;" />IDs only &raquo;' +
                      '<button type="button" onclick="javascript:sflh_update(); void( 0 );" class="btn" style="margin-top: -7px; margin-right: -9px; margin-left: 6px;">Update Steam FLH ' + sflh_type + ' subs list</button>' +
                      '</span>' );
   
    // Insert stuff
    if ( sflh_typeID === 'sflh_fods' || sflh_typeID == 'sflh_nocs' ) {
        $( 'div.container > div.panel > div' ).replaceWith( '<div class="panel-heading"><strong>' + sflh_type + ' subs</strong><span style="float: right;">' + 'Jump to: ' + sflh_jumpto + ' <strong>' + '</span></div>' );
        $( 'div.container > div.panel > p' ).append( sflh_btns );
    } else {
        $( 'div.container > div.panel > div' ).append( '<span style="float: right;">' + 'Jump to: ' + sflh_jumpto + ' <strong>' + '</span>' );
    }
}
 
// -------------------- Steam licenses page --------------------
if( location.href.match( /^https:\/\/store\.steampowered\.com\/account\/licenses\/.*?$/ ) ) {
 
    // Show "All done!" message if just refreshed after processing completed
    if ( GM_getValue( 'sflh_done', '' ) === 'done' ) {
        GM_setValue( 'sflh_done', '' );
        ShowAlertDialog( 'All done!', 'Enjoy.' );
    };
   
        // DOM-to-Userscript functions
    unsafeWindow.sflh_addman = function( ) {
        var sID = prompt( 'Enter Free subID to add to account:' );
        if ( sID !== null ) {
            jQuery.ajax( {
                type: 'POST', dataType: 'text',
                url: 'https://store.steampowered.com/checkout/addfreelicense',
                data: { action: 'add_to_cart',sessionid: g_sessionID,subid: sID }
            });
        };  
    };
 
        unsafeWindow.sflh_activate = function( foo ) {
                var freePackages = GM_getValue( foo ).split( ',' );
                var ownedPackages = {};
                jQuery( '.account_table a' ).each( function( i, el ) {
                        var match = el.href.match( /javascript:RemoveFreeLicense\( ([0-9]+), '/ );
                        if( match !== null ) {
                                ownedPackages[ +match[ 1 ] ] = true;
                        }
                } );
        var i = 0, loaded = 0, package = 0, total = freePackages.length,
        modal = ShowBlockingWaitDialog( 'Executing...',
        'Please wait until all requests finish. Ignore all the errors, let it finish.' );
        var ExecuteRequest = function( ) {
                while( i < total && ownedPackages[ ( package = freePackages[ i ] ) ] ) {
                        i++;
                        loaded++;
                } jQuery.ajax( {
                        type: 'POST',
                        dataType: 'text',
                        url: '//store.steampowered.com/checkout/addfreelicense',
                        data: {
                                action: 'add_to_cart',
                                sessionid: g_sessionID,
                                subid: package
                        }
                } ).always( function( ) {
                        loaded++;
                        modal.Dismiss();       
                        if( loaded >= total ) {
                                GM_setValue( 'sflh_done', 'done' );
                GM_setValue( foo, '' );
                ShowBlockingWaitDialog( 'Reloading...', 'Please wait while reloading page...' );
                location.reload();
                        } else {
                                modal = ShowBlockingWaitDialog( 'Executing...',
                                'Loaded ' + loaded + '/' + total + '. Ignore all the errors, let it finish.' );
                                i++;
                                ExecuteRequest();
                        }
                } );
        };
        setTimeout( ExecuteRequest, 1500 );
        };
   
        // Buttons
    if ( GM_getValue( 'sflh_fods', '' ) === '' ) { // Free on Demand subs button
        var sflh_btnfods = '<a id="sflh_fods" class="btnv6_blue_hoverfade btn_small_tall btn_disabled" href="javascript:void( 0 );"><span>Free on Demand subs outdated!</span></a> ';
    } else {
        var sflh_btnfods = '<a id="sflh_fods" class="btnv6_blue_hoverfade btn_small_tall" href="javascript:sflh_activate( \x27sflh_fods\x27 ); void( 0 );"><span>Add Free on Demand subs</span></a> ';
    };
   
    if ( GM_getValue( 'sflh_nocs', '' ) === '' ) { // No Cost subs button
        var sflh_btnnocs = '<a id="sflh_fods" class="btnv6_blue_hoverfade btn_small_tall btn_disabled" href="javascript:void( 0 );"><span>No Cost subs outdated!</span></a> ';
    } else {
        var sflh_btnnocs = '<a id="sflh_nocs" class="btnv6_blue_hoverfade btn_small_tall" href="javascript:sflh_activate( \x27sflh_nocs\x27 ); void( 0 );"><span>Add No Cost subs</span></a> ';
    };
   
    var sflh_btns = $( sflh_btnfods + sflh_btnnocs +
                      '(Update <a href="https://steamdb.info/search/?a=sub_keynames&keyname=1&operator=3&keyvalue=12" target="_blank">Free on Demand</a> or <a href="https://steamdb.info/search/?a=sub_keynames&keyname=1&operator=3&keyvalue=0" target="_blank">No Cost</a> subs on SteamDB then <a href="javascript:location.reload( ); void( 0 );" target="_self">reload page</a>)' +
                      '<a class="btnv6_blue_hoverfade btn_small_tall" href="javascript:sflh_addman( ); void( 0 );" style="float: right;"><span>Add sub manually...</span></a>' );
 
        // Insert stuff
    $( 'h2.pageheader' ).after( '<div id="sflhbox" style="margin-top: 10px; margin-bottom: -20px; color: #8f98a0;"></div>' );
        $( '#sflhbox' ).append( sflh_btns );
}