// ==UserScript==
// @name nameZee
// @namespace Rynee
// @author hugosoft
// @author technical13
// @version 1.3
// @include http://www.munzee.com/*
// @include https://www.munzee.com/*
// @grant unsafeWindow
// @grant GM_xmlhttpRequest
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
// @description Simple Tool to Help Name Undeployed Munzees Quicker
// @downloadURL https://update.greasyfork.org/scripts/35411/nameZee.user.js
// @updateURL https://update.greasyfork.org/scripts/35411/nameZee.meta.js
// ==/UserScript==
//
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function go() {
  var isDebugMode = false;
  
  var version = '1.3';

  var baseURL = 'https://www.munzee.com';
  var virtualImg = 'virtual';
  
  var strParams, objParams;
  var currentURL = new String( document.URL );
  if ( currentURL.lastIndexOf( '?' ) !== -1 ) {
    objParams = {};
    strParams = currentURL.split( '#' )[ 0 ].substr( currentURL.lastIndexOf( '?' ) + 1 );
    var arrParams = strParams.split( '&' );
    for ( var param = 0; param < arrParams.length; param++ ) {
      var arrPair = arrParams[ param ].split( '=' );
      objParams[ arrPair[ 0 ] ] = ( arrPair[ 1 ] || true );
    }
    if ( objParams.debug ) {
      isDebugMode = true;
    }
    currentURL = currentURL.substr( 0, currentURL.lastIndexOf( '?' ) );
  }
  var username = null;
  var logonUsername = null;


  var ignoreChars = [ '#', '(', ')', '[', ']', '{', '}' ];

/**
 * is value numeric?
 */
  function isNumeric( val ){
    return !isNaN( val );
  }

  console.log( 'nameZee Version: ' + version );


  Number.decPoint = '.';
  Number.thousand_sep = ',';


/**
 * endsWith
 */
  String.prototype.endsWith = function( suffix ) {
    return this.indexOf( suffix, this.length - suffix.length ) !== -1;
  };

/**
 * startsWith
 * */
  String.prototype.startsWith = function( prefix ) {
    return this.substring( 0, prefix.length ) === prefix;
  }

/**
 * replaceAll
 */
  String.prototype.replaceAll = function ( find, replace ) {
    var str = this;
    return str.replace( new RegExp( find, 'g' ), replace );
  };

/**
 * contains
 * */
	String.prototype.contains = function() {
    return String.prototype.indexOf.apply( this, arguments ) !== -1;
  };


/**
 * extract logonUsername from profile link
 * */
  function getLogonUsername() {
    try {
      //search menu (ul)
      var container = $( $( '.user-menu' ) );
      //first li
      container = $( container.children().first() );
      //first a
      container = $( container.children().first() );
      //attribute href
      container = container.attr( 'href' );
      if ( isDebugMode ) { console.log( 'getLogonUsername() container is: %s', container ); }
      //token with username in href
      var res = container.split( '/' );
      if ( isDebugMode ) { console.log( 'getLogonUsername() res is: %o', res ); }
      var logonUsername = res[ res.length - 2 ];
      return logonUsername;
    } catch ( errLogonUN ) {
      alert( 'Error attempting to extract logon username from profile link.\n\n\tPlease check the console for details.' );
      console.log( errLogonUN );
    }
  }


  $( document ).ready( function() {
    //checkForUpdate();
    if ( !currentURL.endsWith( '/' ) ) {
      currentURL = currentURL + '/';
    }

    username = $( '.avatar-username' ).text();
    if (username==undefined || username.length<1) {
      username = null;
    }

    logonUsername = getLogonUsername();
    if ( logonUsername == undefined || logonUsername.length < 1 ) {
      logonUsername = null;
    }

    //rename undeploys
    if ( username != null && logonUsername == username && currentURL.toLowerCase().startsWith( baseURL + '/m/' + username.toLowerCase() + '/undeploys/' ) ) {
      //new action button
      var container = $( '.page-header' );
      container = $( container ).find( '.pull-right' );
      var buttonCode = '<div class="pull-right"><a id="renumberUndeploys" class="btn green" style="margin-left:10px;margin-right:10px">renumber</a></div>';
      var optionCode = '<div class="pull-right"><select id="selBracket" class="form-control"><option value="curlyBracket">{ }</option><option value="squareBracket">[ ]</option><option value="roundBracket">( )</option><option selected value="hash">#</option><option value="blank"> </option></select></div>';
      $( container ).append( optionCode + buttonCode );
      //button event
      $( '#renumberUndeploys' ).click( function() {
        doRenumber();
      } );
    }

    //rename deploys
    /*if ( username != null && logonUsername == username && currentURL.toLowerCase().startsWith( baseURL + '/m/' + username.toLowerCase() + '/deploys/' ) ) {
        //new action button
        var container = $( '.page-header' );
        container = $( container ).find( 'h2' );
        $( container ).append( ' <div class="pull-right"><a id="renumberDeploys" class="btn green" style="margin-left:10px">renumber</a></div><div class="clearfix"></div> ');
        //button event
        $( '#renumberDeploys' ).click( function() {
            doRenumber();
        } );
    }*/
  } );

/**
 * prefix for number
 * */
  function getPrefix() {
    switch ( $( '#selBracket' ).val() ) {
      case 'curlyBracket':
        return '{';
      case 'squareBracket':
        return '[';
      case 'roundBracket':
        return '(';
      case 'hash':
        return "#";
      case 'blank':
      default:
        return '';
    }
  }

/**
 * suffix for number
 * */
  function getSuffix() {
    switch ( $( '#selBracket' ).val() ) {
      case 'curlyBracket':
        return '}';
      case 'squareBracket':
        return ']';
      case 'roundBracket':
        return ')';
      case 'hash':
      case 'blank':
      default:
        return '';
    }
  }

/**
 * rename undeploys and deploys
 * */
  function doRenumber() {
    var sections = $( 'section' ).get();
    var count = 0;

    //inspect each section
    for ( var i = 0; i < sections.length; i++ ) {
      if ( isRenumber( getFriendlyName( sections[ i ] ), getLfdNr( sections[ i ] ) ) && !isVirtual( sections[ i ] ) ) {
        parseSectionTimeoutWrapper( count++, sections[ i ] );
      } else {
        if ( isDebugMode ) { console.log( 'doRenumber() IGNRORED::' + getFriendlyName( sections[ i ] ) + ' virtual=' + isVirtual( sections[ i ] ) ); }
      }
    }
  }

/** just a wrapper for parseSection with timeout*/
  function parseSectionTimeoutWrapper( i, section ) {
    setTimeout( function() {
      parseSection( i, section );
    }, 1500 * i );
  }

/**
 * parseSection of munzees and call post-method for renumbering
 */
	function parseSection( i, section ) {
		var lfdNr = getLfdNr( section );
    var originalFriendlyName = getFriendlyName( section );
    if( isRenumber( originalFriendlyName, getLfdNr( section ) ) && !isVirtual( section ) ) {
      var adminURL = 'https://www.munzee.com/m/' + username + '/' + lfdNr + '/admin/';
      var oldFriendlyName = removeGeneratedNumber( originalFriendlyName );
      var newFriendlyName = oldFriendlyName +  " " + getPrefix() + lfdNr + getSuffix();
      if ( isDebugMode ) {
        console.log( 'parseSection() section: %o', section );
        console.log( 'parseSection(): ' + adminURL + ':: ' + originalFriendlyName + '->' + newFriendlyName );
      }
      $.post( adminURL, { friendly_name: '' + newFriendlyName, notes: '' }, function( result ) {        
        if ( isDebugMode ) {
          if ( result.match( /This munzee has been updated!/ ) !== -1 ) {
            section.getElementsByClassName( 'munzee-name' )[ 0 ].children[ 1 ].innerText = newFriendlyName;
          }
        }
      } );
    }
	}

/**
 * remove the generated Number of friendly name
 */
  function removeGeneratedNumber( friendlyName ) {
    while ( friendlyName.length > 0 && isNumeric( friendlyName[ friendlyName.length - 1 ] )) {
      friendlyName = friendlyName.substr( 0, friendlyName.length - 1 );
      if ( isDebugMode ) { console.log( 'removeGeneratedNumber() is returning: ' + friendlyName ); }
    }
    return friendlyName;
  }

/** get lfdNr of current section*/
	function getLfdNr( section ) {
		var munzeeURL = baseURL + $( section ).find( 'a' ).attr( 'href' );
		var arr = munzeeURL.split( '/' );
    if ( isDebugMode ) { console.log( 'getLfdNr() is returning: ' + arr[ 5 ] ); }
		return arr[ 5 ];
	}

/** get friendlyName of current section*/
  function getFriendlyName( section ) {
    var friendlyName = $( section ).find( 'a' )[ 1 ];
    if ( isDebugMode ) { console.log( 'getFriendlyName() is returning: ' + $( friendlyName ).text() ); }
    return $( friendlyName ).text();
  }

/** renumbering permitted? */
  function isRenumber( friendlyName, munzeeNumber ) {
  friendlyName = friendlyName.trim();
  //for ( var i = 0; i < ignoreChars.length; i++ ) {
    if ( friendlyName.contains( munzeeNumber ) ) {
      return false;
    }
  //}
    return true;
  }

  function isVirtual( section ) {
    var imgageSrc = $( section ).find( '.pin' ).attr( 'src' );
    if ( isDebugMode ) { console.log( 'getFriendlyName() is returning: ' + imgageSrc.contains( virtualImg ) ); }
    return imgageSrc.contains( virtualImg );
  }
} // end go

// jQuery workaround for Chrome
// a function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery( callback ) {
  var script = document.createElement( 'script' );
  script.textContent = '(' + callback.toString() + ')();';
  document.body.appendChild( script );
}
// load jQuery and execute
addJQuery( go );