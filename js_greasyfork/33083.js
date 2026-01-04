// ==UserScript==
// @name        NS_PrimeWire_Hosters
// @namespace   mugPuke
// @include     http://daclips.com/*
// @include     http://daclips.in/*
// @include     http://gorillavid.com/*
// @include     http://gorillavid.in/*
// @include     http://movpod.in/*
// @include     http://movpod.net/*
// @include     http://streamin.to/*
// @include     http://streamplay.to/*
// @include     https://vidtodo.com/*
// @include     http://vidto.me/*
// @include     http://vidup.me/*
// @include     http://vidzi.tv/*
// @description Auto redirects to mp4 file on some of the video hosters used by primewire.ag
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/33083/NS_PrimeWire_Hosters.user.js
// @updateURL https://update.greasyfork.org/scripts/33083/NS_PrimeWire_Hosters.meta.js
// ==/UserScript==

//
// Unpacker for Dean Edward's p.a.c.k.e.r, a part of javascript beautifier
// written by Einar Lielmanis <einar@jsbeautifier.org>
//
// Coincidentally, it can defeat a couple of other eval-based compressors.
//
// usage:
//
// if (P_A_C_K_E_R.detect(some_string)) {
//     var unpacked = P_A_C_K_E_R.unpack(some_string);
// }
//
//
var P_A_C_K_E_R = {
    detect: function(str) {
        return (P_A_C_K_E_R.get_chunks(str).length > 0);
    },

    get_chunks: function(str) {
        var chunks = str.match(/eval\(\(?function\(.*?(,0,\{\}\)\)|split\('\|'\)\)\))($|\n)/g);
        return chunks ? chunks : [];
    },

    unpack: function(str) {
        var chunks = P_A_C_K_E_R.get_chunks(str),
            chunk;
        for (var i = 0; i < chunks.length; i++) {
            chunk = chunks[i].replace(/\n$/, '');
            str = str.split(chunk).join(P_A_C_K_E_R.unpack_chunk(chunk));
        }
        return str;
    },

    unpack_chunk: function(str) {
        var unpacked_source = '';
        var __eval = eval;
        if (P_A_C_K_E_R.detect(str)) {
            try {
                eval = function(s) { // jshint ignore:line
                    unpacked_source += s;
                    return unpacked_source;
                }; // jshint ignore:line
                __eval(str);
                if (typeof unpacked_source === 'string' && unpacked_source) {
                    str = unpacked_source;
                }
            } catch (e) {
                // well, it failed. we'll just return the original, instead of crashing on user.
            }
        }
        eval = __eval; // jshint ignore:line
        return str;
    }
};

//==============================================================================


var SITES = 
{
  "vidtodo.com":{
    button_target: function() { return document.getElementById("btn_download"); },
    video_target: function() { return document.querySelector("#content ~ script"); },
    time: 2000,
  },
  "streamin.to":{
    button_target: function() { return document.getElementById("btn_download"); },
    video_target: function() { return document.querySelector("#rkm ~ script"); },
    time: 5000,
  },
  "movpod.net":{
    button_target: function() { return document.getElementById("btn_download"); },
    video_target: function() { return document.querySelector("#flvplayer ~ script"); },
    time: 1000,
  },
  "movpod.in":{
    button_target: function() { return document.getElementById("btn_download"); },
    video_target: function() { return document.querySelector("#flvplayer ~ script"); },
    time: 1000,
  },
  "gorillavid.com":{
    button_target: function() { return document.getElementById("btn_download"); },
    video_target: function() { return document.querySelector("#flvplayer ~ script"); },
    time: 1000,
  },
  "gorillavid.in":{
    button_target: function() { return document.getElementById("btn_download"); },
    video_target: function() { return document.querySelector("#flvplayer ~ script"); },
    time: 1000,
  },
  "daclips.in":{
    button_target: function() { return document.getElementById("btn_download"); },
    video_target: function() { return document.querySelector("#flvplayer ~ script"); },
    time: 1000,
  },
  "daclips.com":{
    button_target: function() { return document.getElementById("btn_download"); },
    video_target: function() { return document.querySelector("#flvplayer ~ script"); },
    time: 1000,
  },
  "vidzi.tv": {
    button_target: function() { return document.getElementById("vplayer_display_button_play"); },
    video_target: function() { return document.querySelectorAll("#embed-wrap ~ script")[3]; },
    time: 1000,
  },
  "vidtodo.com": {
    button_target: function() { return document.getElementById("btn_download"); },
    video_target: function() { return document.querySelectorAll("#content ~ script")[0]; },
    time: 1000,
  },
  "nosvideo.com": {
    button_target: function() { return document.getElementById("btn_download"); },
    video_target: function() { return document.querySelectorAll("div.video_zx_fadeinx ~ script")[0]; },
    time: 1000,
  },
  "streamplay.to": {
    button_target: function() { return document.getElementById("btn_download"); },
    video_target: function() { return document.querySelectorAll("#video-content ~ script")[0]; },
    time: 5000,
  },
  "vidto.me": {
    button_target: function() { return document.getElementById("btn_download"); },
    video_target: function() { return document.querySelectorAll("#player_code script")[2]; },
    time: 6000,
  },
  "thevideo.me": {
    button_target: function() {
        
        var form = document.getElementById("veriform");
        if( form == null ){ return null; }
        
        var input0 = document.createElement("input");
        input0.type = 'hidden';
        input0.id = 'gfk';
        input0.name = 'gfk';
        input0.value = 'i22abd2449';

        var input1 = document.createElement("input");
        input1.type = 'hidden';
        input1.id = '_vhash';
        input1.name = '_vhash';
        input1.value = 'i1102394cE';

        form.appendChild(input0);
        form.appendChild(input1);
        
        return document.getElementById("btn_download"); 
    },
    video_target: function() { return document.querySelectorAll("#page-content ~ script")[6]; },
    time: 1000,
  },
  "vidup.me": {
    button_target: function() {
        
        var form = document.getElementById("veriform");
        if( form == null ){ return null; }
        
        var input0 = document.createElement("input");
        input0.type = 'hidden';
        input0.id = 'gfk';
        input0.name = 'gfk';
        input0.value = 'i22abd2449';

        var input1 = document.createElement("input");
        input1.type = 'hidden';
        input1.id = '_vhash';
        input1.name = '_vhash';
        input1.value = 'i1102394cE';

        form.appendChild(input0);
        form.appendChild(input1);
        
        return document.getElementById("btn_download"); 
    },
    video_target: function() { return document.querySelectorAll("#page-content ~ script")[6]; },
    time: 1000,
  },
  "nosvideo.com": {
    button_target: function() { return document.getElementById("btn_download"); },
    video_target: function() { return document.querySelectorAll("div.video_zx_fadeinx ~ script")[0]; },
    time: 1000,
  },
  "noslocker.com": {
    button_target: function() { return document.getElementById("btn_download"); },
    video_target: function() { return document.querySelectorAll("#vplayer ~ script")[0]; },
    time: 1000,
  },
    
    
};

var tld = window.location.host.split(".");
var tld_string = (tld[tld.length-2]+"."+tld[tld.length-1]).toLowerCase();

function func() {
  
  var button_elem = SITES[tld_string].button_target();
  if(button_elem != null)
  {
    button_elem.click(); 
  }
  
  var video_elem = SITES[tld_string].video_target();
  if(video_elem == null) { return; }
  
  var url_regex = /(https?:\/\/)[^\s/$.?#].[^\s]*\.mp4/
    
  var str = video_elem.innerHTML;
  
  var matches = url_regex.exec(str);
  if(matches <= 2)
  {
      str = str.substr(str.indexOf("eval("));
      str = P_A_C_K_E_R.unpack(str);
      
      matches = url_regex.exec(str);
      
      if(matches <= 2){ return; }
  } 
    
  var url = matches[0];
  
  document.getElementsByTagName("body")[0].innerHTML = "\
  <div id='player_code'>\
    <video autoplay='' style='width: 100%; height: 100%; display: block;' controls='controls' autobuffer='autobuffer' >\
      <source type='video/mp4' src='"+ url +"'>\
      <source type='.mp4' src='"+ url +"'>\
      <source type='.m4v' src='"+ url +"'>\
    </video>\
  </div>";
  
  window.location = url;
}

document.addEventListener("DOMContentLoaded", setTimeout(func, SITES[tld_string].time), false);