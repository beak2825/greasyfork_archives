// ==UserScript==
// @name         Nonsense Speaker (Not Currently Functional)
// @namespace    http://michrev.com/
// @version      0.12
// @description  Make the Tiktok text-to-speech API say the funny things at https://soybomb.com/tricks/words/
// @author       StevenRoy
// @match        http://soybomb.com/tricks/words/
// @match        https://soybomb.com/tricks/words/
// @match        http://www.soybomb.com/tricks/words/
// @match        https://www.soybomb.com/tricks/words/
// @icon         https://www.soybomb.com/images/45adapter.png
// @grant        GM_xmlhttpRequest
// @connect      tiktokv.com
// @downloadURL https://update.greasyfork.org/scripts/447969/Nonsense%20Speaker%20%28Not%20Currently%20Functional%29.user.js
// @updateURL https://update.greasyfork.org/scripts/447969/Nonsense%20Speaker%20%28Not%20Currently%20Functional%29.meta.js
// ==/UserScript==

// Old icon: https://www.google.com/s2/favicons?sz=64&domain=soybomb.com
/* Inspired by a tweet by @scanlime
str=`aspell dump master | shuf | head -n 30 | tee /dev/stderr | tr '\n' '+'`;
curl -s -X POST 'https''://api16-normal-useast5.us.tiktokv.com/media/api/text/speech/invoke/?text_speaker=en_us_002&req_text='$str
| jq .data.v_str | base64 -di | ffplay -volume 10 -f mp3 -
*/
(function() { // Is this wrapper necessary? It's usually implicit! But I guess a little reasonable paranoia never hurt anyone... much.
    'use strict';

// Array of bytes from Base64 string decoding
    function atobarr(a){
        var b=atob(a); // DANGER: "Binary string" ahead
        var t=new Uint8Array(b.length); // We have to convert it ourselves otherwise JavaScript will "helpfully" encode it as UTF-8.
        t.forEach((e,i)=>{ t[i]=b.charCodeAt(i); }); // one charCode -> one byte
        return t;
    }
    const waittexts=["Please wait","Working on it","Just a sec","Processing","Downloading","Wait","Hold on","Soon\u2122"];
    if (!("MediaSource" in window)) {
        console.log("Nonsense Speaker userscript can't run here because your browser is illiterate :(");
        return;
    }
    console.log("NS starting");
    var t0,t=document.getElementsByTagName('table');
    if (!(t && t.length>2)) { console.log("NS couldn't find correct table"); return; }
    t=Array.from((t0=t[t.length-1]).getElementsByTagName("td")).map(n=>n.textContent); //.join("+"); // not space because URL parameter
    if (!(t && t.length)) { console.log("NS got empty string table"); return; }
//    console.log(t0);
    var s0=document.createElement("a");
    const dst="<b>Click here to hear this list read aloud</b>";
    s0.innerHTML=dst;
    s0.href="#";
    s0.setAttribute("style","display:block; text-align:center; border:2px solid #789; padding:4px; margin:20px");
    t0.parentNode.appendChild(s0);
    var ae,mediaSrc,msbuf,bl,bp=0; // buffers loading, buffers pending update (in sb)
    s0.onclick=(e)=>{
        if(!e) e=window.event;
//        console.log(e);
        e.preventDefault();
//        s0.innerHTML="Please Wait";
// new Blob([ atob(temp1.match(/"v_str":"([A-Za-z0-9+/]{6,})"/)[0]) ]); // or new TextEncoder().encode(temp2) for uint8array?
// document.links[0].href=URL.createObjectURL(new Blob([atob(temp1.match(/"v_str":"([A-Za-z0-9+/]{16,})"/)[1])],{ type:'application/octet-stream' })) // Creates invalid file?
// document.links[0].href="data:audio/mp3;base64,"+temp2
// DANGER! Conversion to Blob encodes atob() output as UTF-8 and this makes invalid data! encode() has same problem!

/* {"data":{"s_key":"","v_str":"","duration":""},"extra":{"log_id":"2022042512541201011300601210CDF66C"},
//   "message":"Text too long to create speech audio","status_code":1,"status_msg":"Text too long to create speech audio"}
{"data":{"s_key":"f6f77bc9-0262-4258-b920-b367663920d8","v_str":"(DATA GOES HERE)",
"duration":"100"},"extra":{"log_id":"2022042513082801011313513507F1C6A8"},"message":"success","status_code":0,"status_msg":"success"}
*/

// Since it's necessary to split request into multiple parts... Create separate media player per row? Or concat returned MP3 data?
// Or maybe this is a better idea:
        if (ae) return; // Already clicked it!
        ae=document.createElement("audio");
        mediaSrc = new window.MediaSource();
        ae.src = window.URL.createObjectURL(mediaSrc);
        mediaSrc.addEventListener('sourceopen', ()=>{
//          var mediaSource = this; // We don't need "this", do we?
//            console.log("Source open",mediaSrc);
            msbuf = mediaSrc.addSourceBuffer("audio/mpeg"); // NOT "mp3"!
            console.log("Source buffer",msbuf);
            msbuf.mode = 'sequence'; // https://developer.mozilla.org/en-US/docs/Web/API/SourceBuffer/mode
            msbuf.addEventListener('updateend', segmentupdated);
  bl=1; loadsegment(t,0);
        }, false);
    };
    function abortit(){ // In case of error...
        if (msbuf && msbuf.updating) { setTimeout(abortit,100); return; }
        if (bp==0 && bl==0) return; // Abort when complete? TSNH
        if (ae) {
            if (mediaSrc && msbuf) { mediaSrc.removeSourceBuffer(msbuf); }
            msbuf=false;
            mediaSrc=false; // Delete! Delete!
            ae.src="";
            ae=false;
        }
        bp=0; bl=0;
        s0.innerHTML=dst; // The option to try again, starting as much from scratch as possible without a page reload
    }
//    console.log(s0);
    function loadsegment(t,n,e=n+18){
//        var e=n+18; // Because the API doesn't like if we try to get all 50 words at once, try batches of 18+18+14
//        if (!bl) return; // Abort flag (probably redundant here but BSTS)
        if (e>=t.length) {
            e=t.length;
            if (e==n) { bl=0; if (bp || msbuf.updating) { return; } else { return segmentsloaded(); } }
        }
        s0.innerHTML=waittexts[Math.floor(Math.random()*waittexts.length)]+"...";
        console.log("Loading",n,"..",e);
        var r0=GM_xmlhttpRequest({ // Why's that capitalization so different?
            method:"POST",anonymous:true,
/* TODO: Voice select UI!
Valid Voices (tested from 0-30):
en_us_001 = Standard female
en_us_002 = Standard female (same as 001 it seems.)
en_us_006 = British male 1
en_us_007 = Standard male 1
en_us_009 = Standard male 2
en_us_010 = British male 2*/
            url:"https://api16-normal-useast5.us.tiktokv.com/media/api/text/speech/invoke/?text_speaker=en_us_002&req_text="+t.slice(n,e).join("+"),
            onerror:(e)=>{
                console.log(e); window.alert("Error - Web request went bang\n(Details may be in console)"); abortit();
            },
            onload:(a)=>{
//                s0.style.display="none";
//                console.log(a);
                var ab=a.responseText.match(/"v_str":"([A-Za-z0-9+/]{6,})"/);
                if (ab && ab[1]) {
                    ab=atobarr(ab[1]).buffer;
                    bp++; msbuf.appendBuffer(ab); // console.log("appending buffer: Count="+bp);
                    loadsegment(t,e); // start fetching next batch
                } else {
                    console.log(a);
                    ab=a.responseText.match(/"message":"([^"]{8,})"/);
                    window.alert("Error - Web request returned "+((ab && ab[1])?"an error message:\n\""+ab[1]+'"':"invalid data")+"\n(Details may be in console)");
                    abortit();
                }
            }
        });
    }
    function segmentupdated(){
        bp--; // console.log("appended buffer: Count="+bp);
        if (bp==0 && bl==0) return segmentsloaded();
//      ae.play();
      //console.log(mediaSource.readyState); // ended
    }
    function segmentsloaded(){
        console.log("complete");
        mediaSrc.endOfStream();
        s0.parentNode.appendChild(ae);
        s0.parentNode.removeChild(s0); s0=false;
        ae.volume=0.6; ae.controls=true;
    ae.setAttribute("style","display:block; color:#0f0; padding:0; margin:20px; width:100%");
        ae.play(); console.log(ae);
    }
})();