// ==UserScript==
// @name         BMS
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Bad Music Skipper for site http://radio.rsrl.org
// @author       edikxl
// @match        http://radio.rsrl.org/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35954/BMS.user.js
// @updateURL https://update.greasyfork.org/scripts/35954/BMS.meta.js
// ==/UserScript==

function setClassPlayingToFirstLi(){

  jQuery( "#playlist" ).children().first().attr( "class", "playing" );

}

function setNextSong(){

  let $jQueryNowSong = jQuery( "#playlist li.playing" ).first();

  $jQueryNowSong.attr( "class", "" );

  jQuery( $jQueryNowSong.next() ).attr( "class", "playing" );

  let songStringHTML = jQuery( "#playlist li.playing" ).first().html();
  let songName;

  if( typeof songStringHTML !== "undefined" ){

    songName = songStringHTML.slice( songStringHTML.lastIndexOf( "</div>" ) + 6 );

  }

  console.log( "Set next song with name: " + songName );

}

function isIncorrectSong(){

  let errorMsg = "//IncorrectSong\nCause: ";

  /*
  if( jQuery( "#playlist li.playing" ).length === 0 ){

    console.log( "Playing is lost...setting new" );
    setClassPlayingToFirstLi();

  }else{ console.log( jQuery( "#playlist" ).children( ".playing" ).length ); }
  */

  let songStringHTML = jQuery( "#playlist li.playing" ).first().html();
  if( typeof songStringHTML !== "string" ){ console.log( errorMsg + "Song html type is wrong: " + typeof songStringHTML ); return true; }
  let endOfDiv = songStringHTML.lastIndexOf( "</div>" );

  //if( jQuery( "#playlist li.playing" ).children( ".toplist_rating_display_number" ).first().html().length == 0 ) return true;

  let songName = songStringHTML.slice( endOfDiv + 6 ); // 6 is length of "</div>"

  if( songName.length === 0 ){ console.log( errorMsg + "Song name length is 0" );return true; }
  if( songName.indexOf( "Jingle" ) != -1 || songName.indexOf( "Джингл" ) != -1 ){ console.log( errorMsg + "Song is Jingle" ); return true; }

  let regexp = /[а-яё]/i;
  let isRussian = regexp.test( songName );

  if( isRussian ){ console.log( errorMsg + "Russian song" ); return true; }else{ return false; }

}

function onTrackEnded( isFirst = false ){

  console.log( "Track ended" );

  let incorrectCounter = 0;

  if( !isFirst ){ setNextSong() }

  while( isIncorrectSong() ){

    setNextSong();
    console.log( "\\" );

    incorrectCounter++;

    if( incorrectCounter == 30 ){

      console.log( "A lot of errors...ending..." );
      return;

    }

  }

  jpPlay( audio, jQuery( "#playlist li.playing" ).first(), last );

}

//

function onReady( time = "00:00" ){

  console.log( "jQuery is working" );

  audio.settings.trackEnded = onTrackEnded;

  jQuery( ".playing" ).css( "backgroung-color", "grey" );

  jQuery( "#playlist_button" ).click();
  jQuery( "#timepicker1" ).val( time );
  jQuery( "#playlistbutton" ).click();

  setTimeout( () => {

    console.log( "Starting" );
    setClassPlayingToFirstLi();
    onTrackEnded( true );

  }, 1000 );

}

jQuery( window ).ready( () => {

  let time = "00:00";

  try{

    onReady( time );

  }catch( err ){

    console.log( "Error" );

    timeList = time.split( ":" );

    timeList[ 0 ] = parseInt( timeList[ 0 ] ) + 10;
    timeList[ 1 ] = parseInt( timeList[ 1 ] ) + 10;

    time = timeList.join( ":" );

    console.log( "Restarting with time: " + time );

    setNextSong();
    onReady( time );

  }

} );