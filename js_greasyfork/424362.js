// ==UserScript==
// @name         Auto Hat script for Lostworld.io!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script made by my good friend Nuro, go to https://cdn.glitch.com/5b454a55-22b1-49ec-859e-a1d3ba8074ce%2F!%20Nebuchadnezzar%20(Lostworld.io)%20(3).user.js?v=1617334013373 for another version, (Ik its a very long description, me and nuro are arguing lol)
// @author       You
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @require https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js
// @match        http://eu1.lostworld.io/
// @match        http://usa2.lostworld.io/
// @match        http://lostworld.io/

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424362/Auto%20Hat%20script%20for%20Lostworldio%21.user.js
// @updateURL https://update.greasyfork.org/scripts/424362/Auto%20Hat%20script%20for%20Lostworldio%21.meta.js
// ==/UserScript==
var H = [ "#spikeg", "wlZko", "12OiQceQ", "nmdVe", "vGHzI", "vdige", "className", "#barb", "#tankGear", "gKomS", '\n    <div id="simpleModal" class="modal">\n      <div class="modal-content">\n        <div class="modal-header">\n          <span class="closeBtn">&times;</span>\n          <h2 style="font-size: 17px;">Nebuchadnezzar - Hats</h2>\n        </div>\n        <div class="modal-body" style="font-size: 17px;">\n          <div class="flexControl">\n            <h3 class="menuPrompt">Hood : </h3>\n            <input\n              value="', '"\n              id="barb"\n              class="keyPressLow"\n              onkeyup="this.value = this.value.toUpperCase();"\n              maxlength="1"\n              type="text"\n            />\n            <br />\n          </div>\n        </div>\n      </div>\n    </div>', "createElement", "charCodeAt", '"\n              id="bullHelm"\n              class="keyPressLow"\n              onkeyup="this.value = this.value.toUpperCase();"\n              maxlength="1"\n              type="text"\n            />\n            <br />\n            <h3 class="menuPrompt">Immunity Gear :</h3>\n            <input\n              value="', "CxyWO", "div", "target", "appendChild", "zUUoP", '"\n              id="spikey"\n              class="keyPressLow"\n              onkeyup="this.value = this.value.toUpperCase();"\n              maxlength="1"\n              type="text"\n            />\n            <br />\n            <h3 class="menuPrompt">Crystal Gear :</h3>\n            <input\n              value="', "children", "none", "#turret", "58835dEAJXI", "aTbYD", "getElementById", "#bullHelm", "createTextNode", "activeElement", "val", "eyWZn", "6437nlXSfK", "log", "505474vNgYff", "gJuHz", "3qamYbf", ".keyPressLow{margin-left:8px;font-size:16px;margin-right:8px;height:25px;width:50px;background-color:#fcfcfc;border-radius:3.5px;border:none;text-align:center;color:#4a4a4a;border:.5px solid #f2f2f2}.menuPrompt{font-size:17px;font-family:'Hammersmith One';color:#4a4a4a;flex:.2;text-align:center;margin-top:10px;display:inline-block}.modal{display:none;position:fixed;z-index:1;left:0;top:0;overflow:auto;height:100%;width:100%}.modal-content{margin:10% auto;width:40%;box-shadow:0 5px 8px 0 rgba(0,0,0,.2),0 7px 20px 0 rgba(0,0,0,.17);font-size:14px;line-height:1.6}.modal-footer h3,.modal-header h2{margin:0}.modal-header{background:#000;padding:15px;color:#fff;border-top-left-radius:5px;border-top-right-radius:5px}.modal-body{padding:10px 20px;background:#fff}.modal-footer{background:#000;padding:10px;color:#fff;text-align:center;border-bottom-left-radius:5px;border-bottom-right-radius:5px}.closeBtn{color:#ccc;float:right;font-size:30px;color:#fff}.closeBtn:focus,.closeBtn:hover{color:#e01313;text-decoration:none;cursor:pointer}.container{display:block;position:relative;padding-left:35px;margin-bottom:12px;cursor:pointer;font-size:16px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.container input{position:absolute;opacity:0;cursor:pointer;height:0;width:0}.checkmark{position:absolute;top:0;left:0;height:25px;width:25px;background-color:#eee}.container:hover input~.checkmark{background-color:#ccc}.container input:checked~.checkmark{background-color:#f16210}.checkmark:after{content:\"\";position:absolute;display:none}.container input:checked~.checkmark:after{display:block}.container .checkmark:after{left:9px;top:5px;width:5px;height:10px;border:solid #fff;border-width:0 3px 3px 0;-webkit-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg)}", "mainSettings", "MiQJn", "uocQu", "type", "bfmsp", "#hoodie", "#booster", "#spikey", "6127XcyyxX", "display", "body", "LZrmc", "eiRQF", "keyCode", "getElementsByClassName", "style", "closeBtn", "sGdXc", "dXoBO", "101894Xqigop", '"\n              id="hoodie"\n              class="keyPressLow"\n              onkeyup="this.value = this.value.toUpperCase();"\n              maxlength="1"\n              type="text"\n            />\n<br />\n            <h3 class="menuPrompt">Farmer Gear :</h3>\n            <input\n              value="', "hMHjI", '"\n              id="spikeg"\n              class="keyPressLow"\n              maxlength="1"\n              onkeyup="this.value = this.value.toUpperCase();"\n              type="text"\n            />\n            <br />\n            <h3 class="menuPrompt">Blocker Gear :</h3>\n            <input\n              value="', '\n<style>\n.rainbow {\nanimation: rainbow 10s infinite;\nborder: 7px double black;\nleft: 1%;\ntop: 1%;\nposition: fixed;\ndisplay:block;\npadding: 5px;\nfont-size:25px;\nborder: 7px double;\n}\n.dunno {\ntop:2%;\nleft:1%;\n}\n@keyframes rainbow{\n0%{color: orange;}\n10%{color: purple;}\n20%{color: red;}\n30%{color: CadetBlue;}\n40%{color: yellow;}\n50%{color: coral;}\n60%{color: green;}\n70%{color: cyan;}\n80%{color: DeepPink;}\n90%{color: DodgerBlue;}\n100%{color: orange;}\n}\n</style>\n<p class="rainbow">Nebuchadnezzar v2.1<br><a class="dunno">LostWorld.io bypass<a></p>', "head", "14WQvWZN", "TKKId", "addEventListener", "simpleModal", "fromCharCode", "DJRrt", "toUpperCase", "storeDisplay", "click", "eePsw", "IAyIl", "innerHTML", "JYiOO", "116150RQFAcv", "lchCU", "AZDbE", "801135mCzcVE", '"\n              id="turret"\n              class="keyPressLow"\n              maxlength="1"\n              onkeyup="this.value = this.value.toUpperCase();"\n              type="text"\n            />\n            <br />\n            <h3 class="menuPrompt">Bull Hat :</h3>\n            <input\n              value="', '"\n              id="booster"\n              class="keyPressLow"\n              maxlength="1"\n              onkeyup="this.value = this.value.toUpperCase();"\n              type="text"\n            />\n            <br />\n            <h3 class="menuPrompt">Halloween Gear :</h3>\n            <input\n              value="', "input", "pBUXM" ],
  U = function ( e, n )
  {
    return H[ e -= 187 ]
  },
  i = U;
! function ( e, n )
{
  for ( var o = U;; ) try
  {
    if ( 455877 === -parseInt( o( 265 ) ) + -parseInt( o( 257 ) ) * -parseInt( o( 269 ) ) + parseInt( o( 225 ) ) + parseInt( o( 267 ) ) + parseInt( o( 228 ) ) + -parseInt( o( 195 ) ) * -parseInt( o( 212 ) ) + -parseInt( o( 235 ) ) * parseInt( o( 206 ) ) ) break;
    e.push( e.shift() )
  }
  catch ( n )
  {
    e.push( e.shift() )
  }
}( H );
var K = 90,
  I = 74,
  y = 72,
  z = 66,
  k = 89,
  n = 84,
  X = 86,
  O = 85,
  T = document.createElement( i( 249 ) );
T[ i( 239 ) ] = "menuCard", T.id = i( 187 ), T[ i( 223 ) ] = i( 243 ) + String[ i( 216 ) ]( X ) + i( 207 ) + String[ i( 216 ) ]( K ) + '"\n              id="tankGear"\n              class="keyPressLow"\n              onkeyup="this.value = this.value.toUpperCase();"\n              maxlength="1"\n              type="text"\n            />\n            <br />\n            <h3 class="menuPrompt">Spike Gear :</h3>\n            <input\n              value="' + String.fromCharCode( O ) + i( 253 ) + String[ i( 216 ) ]( I ) + i( 247 ) + String.fromCharCode( y ) + i( 229 ) + String[ i( 216 ) ]( z ) + i( 230 ) + String[ i( 216 ) ]( k ) + i( 209 ) + String[ i( 216 ) ]( n ) + i( 244 ), document[ i( 197 ) ][ i( 251 ) ]( T ), $( i( 241 ) ).on( i( 231 ), () =>
{
  var e = i,
    n = $( e( 241 ) ).val();
  if ( n )
    if ( e( 268 ) == e( 268 ) ) K = ( K = n[ e( 218 ) ]() ).charCodeAt( 0 ), console[ e( 266 ) ]( K );
    else
    {
      var o = e;
      C = W[ o( 218 ) ](), c = G[ o( 246 ) ]( 0 ), b[ o( 266 ) ]( j )
    }
} ), $( i( 260 ) ).on( i( 231 ), () =>
{
  var e = i,
    n = $( e( 260 ) ).val();
  if ( n )
    if ( "eyWZn" === e( 264 ) ) I = ( I = n[ e( 218 ) ]() )[ e( 246 ) ]( 0 ), console[ e( 266 ) ]( I );
    else
    {
      var o = e;
      S[ o( 259 ) ]( o( 219 ) )[ o( 254 ) ][ 13 ][ o( 254 ) ][ 1 ].click()
    }
} ), $( i( 256 ) ).on( i( 231 ), () =>
{
  var e = i,
    n = $( e( 256 ) )[ e( 263 ) ]();
  if ( n )
    if ( e( 217 ) === e( 222 ) )
    {
      var o = e;
      S.style[ o( 196 ) ] = "block"
    }
  else y = ( y = n[ e( 218 ) ]() )[ e( 246 ) ]( 0 ), console[ e( 266 ) ]( y )
} ), $( i( 240 ) ).on( i( 231 ), () =>
{
  var e = i,
    o = $( e( 240 ) )[ e( 263 ) ]();
  o && ( e( 205 ) != e( 205 ) ? ( C = W[ e( 218 ) ](), c = G.charCodeAt( 0 ), b.log( j ) ) : ( n = ( n = o[ e( 218 ) ]() )[ e( 246 ) ]( 0 ), console[ e( 266 ) ]( n ) ) )
} ), $( i( 193 ) ).on( i( 231 ), () =>
{
  var e = i,
    n = $( e( 193 ) )[ e( 263 ) ]();
  if ( n )
    if ( "lchCU" === e( 226 ) ) z = ( z = n[ e( 218 ) ]() )[ e( 246 ) ]( 0 ), console[ e( 266 ) ]( z );
    else
    {
      var o = e,
        t = C( o( 256 ) )[ o( 263 ) ]();
      t && ( V = t[ o( 218 ) ](), m = E[ o( 246 ) ]( 0 ), J[ o( 266 ) ]( A ) )
    }
} ), $( i( 233 ) ).on( "input", () =>
{
  var e = i,
    n = $( e( 233 ) ).val();
  if ( n )
    if ( "uocQu" === e( 189 ) ) k = ( k = n[ e( 218 ) ]() )[ e( 246 ) ]( 0 ), console[ e( 266 ) ]( k );
    else
    {
      var o = e;
      S[ o( 259 ) ]( o( 219 ) )[ o( 254 ) ][ 8 ][ o( 254 ) ][ 1 ][ o( 220 ) ]()
    }
} ), $( i( 192 ) ).on( i( 231 ), () =>
{
  var e = i,
    n = $( e( 192 ) ).val();
  if ( n )
    if ( e( 221 ) === e( 188 ) )
    {
      var o = e,
        t = C( o( 233 ) )[ o( 263 ) ]();
      t && ( V = t[ o( 218 ) ](), m = E[ o( 246 ) ]( 0 ), J[ o( 266 ) ]( A ) )
    }
  else X = ( X = n.toUpperCase() )[ e( 246 ) ]( 0 ), console[ e( 266 ) ]( X )
} ), $( i( 194 ) ).on( i( 231 ), () =>
{
  var e = i,
    n = $( e( 194 ) ).val();
  if ( n )
    if ( e( 237 ) !== e( 224 ) ) O = ( O = n[ e( 218 ) ]() )[ e( 246 ) ]( 0 ), console[ e( 266 ) ]( O );
    else
    {
      var o = e;
      C = W[ o( 218 ) ](), c = G[ o( 246 ) ]( 0 ), b[ o( 266 ) ]( j )
    }
} );
var N = document.createElement( i( 202 ) );
N[ i( 190 ) ] = "text/css", N[ i( 251 ) ]( document[ i( 261 ) ]( i( 270 ) ) ), document[ i( 211 ) ][ i( 251 ) ]( N ), document[ i( 214 ) ]( "keydown", function ( e )
{
  var t = i;
  if ( "INPUT" == document[ t( 262 ) ].tagName )
  {
    if ( t( 199 ) == t( 199 ) ) return;
    var r = t,
      a = C( "#hoodie" )[ r( 263 ) ]();
    a && ( V = a[ r( 218 ) ](), m = E[ r( 246 ) ]( 0 ), J.log( A ) )
  }
  else
  {
    if ( "Hxduc" === t( 191 ) ) return;
    if ( 27 == e[ t( 200 ) ] )
      if ( t( 238 ) !== t( 213 ) )
        if ( o[ t( 202 ) ][ t( 196 ) ] = t( 255 ) )
          if ( "pBUXM" !== t( 232 ) )
          {
            var l = t;
            S[ l( 259 ) ]( l( 219 ) )[ l( 254 ) ][ 2 ].children[ 1 ][ l( 220 ) ]()
          }
    else o[ t( 202 ) ][ t( 196 ) ] = "block";
    else if ( t( 236 ) === t( 198 ) )
    {
      var s = t,
        p = C( s( 241 ) ).val();
      p && ( V = p[ s( 218 ) ](), m = E.charCodeAt( 0 ), J.log( A ) )
    }
    else o[ t( 202 ) ][ t( 196 ) ] = t( 255 );
    else
    {
      var d = t;
      C = W.toUpperCase(), c = G[ d( 246 ) ]( 0 ), b[ d( 266 ) ]( j )
    }
    else if ( e.keyCode == K )
      if ( "gKomS" === t( 242 ) ) document.getElementById( "storeDisplay" )[ t( 254 ) ][ 11 ][ t( 254 ) ][ 1 ].click();
      else
      {
        var u = t;
        C = W[ u( 218 ) ](), c = G[ u( 246 ) ]( 0 ), b[ u( 266 ) ]( j )
      }
    else if ( e[ t( 200 ) ] == O )
      if ( t( 252 ) != t( 252 ) )
      {
        var f = t;
        ( x[ f( 202 ) ][ f( 196 ) ] = "none" ) ? C[ f( 202 ) ][ f( 196 ) ] = "block": W[ f( 202 ) ][ f( 196 ) ] = f( 255 )
      }
    else document[ t( 259 ) ]( "storeDisplay" )[ t( 254 ) ][ 5 ][ t( 254 ) ][ 1 ][ t( 220 ) ]();
    else if ( e[ t( 200 ) ] == X )
      if ( "CxyWO" !== t( 248 ) )
      {
        var h = t;
        S[ h( 202 ) ].display = h( 255 )
      }
    else document[ t( 259 ) ]( t( 219 ) )[ t( 254 ) ][ 9 ][ t( 254 ) ][ 1 ][ t( 220 ) ]();
    else if ( e[ t( 200 ) ] == I )
      if ( t( 234 ) != t( 234 ) )
      {
        var g = t;
        S[ g( 259 ) ]( g( 219 ) )[ g( 254 ) ][ 11 ][ g( 254 ) ][ 1 ][ g( 220 ) ]()
      }
    else document[ t( 259 ) ]( t( 219 ) )[ t( 254 ) ][ 2 ][ t( 254 ) ][ 1 ][ t( 220 ) ]();
    else if ( e.keyCode == z )
    {
      document.getElementById( "storeDisplay" )[ t( 254 ) ][ 0 ].children[ 1 ][ t( 220 ) ]()
    }
    else if ( e[ t( 200 ) ] == n )
      if ( "sGdXc" !== t( 204 ) )
      {
        var w = t;
        S.style[ w( 196 ) ] = w( 255 )
      }
    else document[ t( 259 ) ]( "storeDisplay" )[ t( 254 ) ][ 13 ][ t( 254 ) ][ 1 ][ t( 220 ) ]();
    else if ( e[ t( 200 ) ] == k )
      if ( "ZTjir" !== t( 227 ) ) document[ t( 259 ) ]( t( 219 ) )[ t( 254 ) ][ 12 ].children[ 1 ][ t( 220 ) ]();
      else
      {
        var P = t;
        S[ P( 259 ) ]( P( 219 ) )[ P( 254 ) ][ 12 ][ P( 254 ) ][ 1 ].click()
      }
    else if ( e[ t( 200 ) ] == y )
      if ( t( 258 ) == t( 258 ) ) document[ t( 259 ) ]( t( 219 ) ).children[ 8 ].children[ 1 ].click();
      else
      {
        var U = t;
        x.target == v && ( C[ U( 202 ) ].display = "none" )
      }
  }
} );
var o = document[ i( 259 ) ]( i( 215 ) ),
  w = document[ i( 201 ) ]( i( 203 ) )[ 0 ];

function R()
{
  var e = i;
  o[ e( 202 ) ].display = e( 255 )
}

function Q( e )
{
  var n = i;
  if ( e[ n( 250 ) ] == o )
    if ( n( 208 ) == n( 208 ) ) o[ n( 202 ) ][ n( 196 ) ] = "none";
    else
    {
      var t = n;
      C = W[ t( 218 ) ](), c = G.charCodeAt( 0 ), b[ t( 266 ) ]( j )
    }
}
w[ i( 214 ) ]( i( 220 ), R ), window[ i( 214 ) ]( "click", Q );
var M = document[ i( 245 ) ]( i( 249 ) );
M[ i( 223 ) ] = i( 210 ), document.body[ i( 251 ) ]( M );