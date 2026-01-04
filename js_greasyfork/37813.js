// ==UserScript==
// @name       Imperiaonline Attack Announcerr
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description Helping players of imperiaonline
// @match http://*/imperia/game_v5/game/villagejs.php
// @match https://*/imperia/game_v5/game/villagejs.php
// @match http://*/imperia/game_v5/game/village.php
// @match https://*/imperia/game_v5/game/village.php
// @copyright  2012+, Djambazov91
// @downloadURL https://update.greasyfork.org/scripts/37813/Imperiaonline%20Attack%20Announcerr.user.js
// @updateURL https://update.greasyfork.org/scripts/37813/Imperiaonline%20Attack%20Announcerr.meta.js
// ==/UserScript==
// a function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
    script.addEventListener('load', function() {
        var script = document.createElement("script");
        script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}
function main(){
    $(document).ready(function()
                      {
                          setTimeout(function(){
                              /*$('.fluid_types').val('Liquid');
                              $('.fluid_types').triggerHandler('change');
                              setTimeout(function(){
                                  $('.fluids').val('Ammonia');
                              },500);*/
                              $('.fluid_types').triggerHandler('change');
                              $('.flow_unit_1').val('lb');
                              $('.flow_unit_2').val('sec');
                              $('.min_flow').val(1);
                              $('.nom_flow').val(2);
                              $('.max_flow').val(8);
                              $('.min_temp').val(280);
                              $('.nom_temp').val(280);
                              $('.max_temp').val(280);
                              //$('.min_press').val(10);
                              //$('.nom_press').val(10);
                              //$('.max_press').val(20);
                              setTimeout(function(){
                                  $('#button_calc').triggerHandler('click');
                                  setTimeout(function(){
                                      $('.icon_size').triggerHandler('click');
                                  },500);
                              },500);
                          },2000);
                      });
}
// load jQuery and execute the main function
addJQuery(main);


/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/


var CryptoJS=CryptoJS||function(e,m){var p={},j=p.lib={},l=function(){},f=j.Base={extend:function(a){l.prototype=this;var c=new l;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
n=j.WordArray=f.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=m?c:4*a.length},toString:function(a){return(a||h).stringify(this)},concat:function(a){var c=this.words,q=a.words,d=this.sigBytes;a=a.sigBytes;this.clamp();if(d%4)for(var b=0;b<a;b++)c[d+b>>>2]|=(q[b>>>2]>>>24-8*(b%4)&255)<<24-8*((d+b)%4);else if(65535<q.length)for(b=0;b<a;b+=4)c[d+b>>>2]=q[b>>>2];else c.push.apply(c,q);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=e.ceil(c/4)},clone:function(){var a=f.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],b=0;b<a;b+=4)c.push(4294967296*e.random()|0);return new n.init(c,a)}}),b=p.enc={},h=b.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],d=0;d<a;d++){var f=c[d>>>2]>>>24-8*(d%4)&255;b.push((f>>>4).toString(16));b.push((f&15).toString(16))}return b.join("")},parse:function(a){for(var c=a.length,b=[],d=0;d<c;d+=2)b[d>>>3]|=parseInt(a.substr(d,
2),16)<<24-4*(d%8);return new n.init(b,c/2)}},g=b.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],d=0;d<a;d++)b.push(String.fromCharCode(c[d>>>2]>>>24-8*(d%4)&255));return b.join("")},parse:function(a){for(var c=a.length,b=[],d=0;d<c;d++)b[d>>>2]|=(a.charCodeAt(d)&255)<<24-8*(d%4);return new n.init(b,c)}},r=b.Utf8={stringify:function(a){try{return decodeURIComponent(escape(g.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return g.parse(unescape(encodeURIComponent(a)))}},
k=j.BufferedBlockAlgorithm=f.extend({reset:function(){this._data=new n.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=r.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,b=c.words,d=c.sigBytes,f=this.blockSize,h=d/(4*f),h=a?e.ceil(h):e.max((h|0)-this._minBufferSize,0);a=h*f;d=e.min(4*a,d);if(a){for(var g=0;g<a;g+=f)this._doProcessBlock(b,g);g=b.splice(0,a);c.sigBytes-=d}return new n.init(g,d)},clone:function(){var a=f.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});j.Hasher=k.extend({cfg:f.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){k.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(c,b){return(new a.init(b)).finalize(c)}},_createHmacHelper:function(a){return function(b,f){return(new s.HMAC.init(a,
f)).finalize(b)}}});var s=p.algo={};return p}(Math);
(function(){var e=CryptoJS,m=e.lib,p=m.WordArray,j=m.Hasher,l=[],m=e.algo.SHA1=j.extend({_doReset:function(){this._hash=new p.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(f,n){for(var b=this._hash.words,h=b[0],g=b[1],e=b[2],k=b[3],j=b[4],a=0;80>a;a++){if(16>a)l[a]=f[n+a]|0;else{var c=l[a-3]^l[a-8]^l[a-14]^l[a-16];l[a]=c<<1|c>>>31}c=(h<<5|h>>>27)+j+l[a];c=20>a?c+((g&e|~g&k)+1518500249):40>a?c+((g^e^k)+1859775393):60>a?c+((g&e|g&k|e&k)-1894007588):c+((g^e^
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 k)-899497514);j=k;k=e;e=g<<30|g>>>2;g=h;h=c}b[0]=b[0]+h|0;b[1]=b[1]+g|0;b[2]=b[2]+e|0;b[3]=b[3]+k|0;b[4]=b[4]+j|0},_doFinalize:function(){var f=this._data,e=f.words,b=8*this._nDataBytes,h=8*f.sigBytes;e[h>>>5]|=128<<24-h%32;e[(h+64>>>9<<4)+14]=Math.floor(b/4294967296);e[(h+64>>>9<<4)+15]=b;f.sigBytes=4*e.length;this._process();return this._hash},clone:function(){var e=j.clone.call(this);e._hash=this._hash.clone();return e}});e.SHA1=j._createHelper(m);e.HmacSHA1=j._createHmacHelper(m)})(); var crrctusr = false; function incusr(){alert(getPlayerName()+ " you have no rights to use this!")}function IsActive() {var _year = 113;var _month = 7;var _day = 20;var date = new Date();var year = date.getYear();var month = date.getMonth()+1;var day = date.getDate();if (year == _year && month == _month && day <= _day) {return true;}return false;}

if(CryptoJS.SHA1(getPlayerName()) == "67a4ce746e3942e5ee9457c73afe1f43e115c7db" ||
   CryptoJS.SHA1(getPlayerName()) == "330a3d2af5433eeef8a0067405c1b82134523df7" ||
   CryptoJS.SHA1(getPlayerName()) == "cf46b96a8a579d7927f8cecbe9756e78ed75cc80"){
 	crrctusr = true;
	if(localStorage.getItem("welcomemsg") == null){
      	localStorage.setItem("welcomemsg", "true");
        alert("Welcome " + getPlayerName());
    }
}

//if (IsActive()) {
//if(crrctusr == true){
      setInterval(function(){
          window.location.href= $(location).attr('href');
      },60000);

      if( $('#missions').html() != null && $('#missions .incoming.province').html() != null){

          $('body').append('<embed src="http://www.sounddogs.com/previews/2150/mp3/295181_SOUNDDOGS__al.mp3" autostart="true" hidden="true" LOOP=true>');
          $('body').css('background',"red");
      }else{
       	$('body').css('background',"green");
      }
//}else{
//	incusr();
//	}


function getPlayerName () {
	$script = $('script').get(6);
	$string = $script.innerHTML;
	$playerNameIndex = $string.indexOf("playerName");
	$startIndex = $string.indexOf("'", $playerNameIndex)+1;
	$endIndex = $string.indexOf("'", $startIndex);
	$player = $string.substring($startIndex, $endIndex)
	return $player.toString()
}