// ==UserScript==
// @name         TwitchTracker VodLink
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Add vodlink to twitchtracker
// @author       You
// @match        https://twitchtracker.com/*/streams/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445687/TwitchTracker%20VodLink.user.js
// @updateURL https://update.greasyfork.org/scripts/445687/TwitchTracker%20VodLink.meta.js
// ==/UserScript==
 
class Sha1{static hash(msg,options){const defaults={msgFormat:'string',outFormat:'hex'};const opt=Object.assign(defaults,options);switch(opt.msgFormat){default:case 'string':msg=utf8Encode(msg);break;case 'hex-bytes':msg=hexBytesToString(msg);break;}
const K=[0x5a827999,0x6ed9eba1,0x8f1bbcdc,0xca62c1d6];const H=[0x67452301,0xefcdab89,0x98badcfe,0x10325476,0xc3d2e1f0];msg+=String.fromCharCode(0x80);const l=msg.length/4+2;const N=Math.ceil(l/16);const M=new Array(N);for(let i=0;i<N;i++){M[i]=new Array(16);for(let j=0;j<16;j++){M[i][j]=(msg.charCodeAt(i*64+j*4+0)<<24)|(msg.charCodeAt(i*64+j*4+1)<<16)|(msg.charCodeAt(i*64+j*4+2)<<8)|(msg.charCodeAt(i*64+j*4+3)<<0);}}
M[N-1][14]=((msg.length-1)*8)/Math.pow(2,32);M[N-1][14]=Math.floor(M[N-1][14]);M[N-1][15]=((msg.length-1)*8)&0xffffffff;for(let i=0;i<N;i++){const W=new Array(80);for(let t=0;t<16;t++)W[t]=M[i][t];for(let t=16;t<80;t++)W[t]=Sha1.ROTL(W[t-3]^W[t-8]^W[t-14]^W[t-16],1);let a=H[0],b=H[1],c=H[2],d=H[3],e=H[4];for(let t=0;t<80;t++){const s=Math.floor(t/20);const T=(Sha1.ROTL(a,5)+Sha1.f(s,b,c,d)+e+K[s]+W[t])>>>0;e=d;d=c;c=Sha1.ROTL(b,30)>>>0;b=a;a=T;}
H[0]=(H[0]+a)>>>0;H[1]=(H[1]+b)>>>0;H[2]=(H[2]+c)>>>0;H[3]=(H[3]+d)>>>0;H[4]=(H[4]+e)>>>0;}
for(let h=0;h<H.length;h++)H[h]=('00000000'+H[h].toString(16)).slice(-8);const separator=opt.outFormat=='hex-w'?' ':'';return H.join(separator);function utf8Encode(str){try{return new TextEncoder().encode(str,'utf-8').reduce((prev,curr)=>prev+String.fromCharCode(curr),'');}catch(e){return unescape(encodeURIComponent(str));}}
function hexBytesToString(hexStr){const str=hexStr.replace(' ','');return str==''?'':str.match(/.{2}/g).map(byte=>String.fromCharCode(parseInt(byte,16))).join('');}}
static f(s,x,y,z){switch(s){case 0:return(x&y)^(~x&z);case 1:return x^y^z;case 2:return(x&y)^(x&z)^(y&z);case 3:return x^y^z;}}
static ROTL(x,n){return(x<<n)|(x>>>(32-n));}}
 
(async function() {
    'use strict';
 
    function getMeta(metaName) {
        const metas = document.getElementsByTagName('meta');
 
        for (let i = 0; i < metas.length; i++) {
            if (metas[i].getAttribute('property') === metaName) {
                return metas[i].getAttribute('content');
            }
        }
 
        return '';
    }
    var url = getMeta('og:url').split("/");
    var timestamp = getMeta('og:description').split(" ");
    var date = new Date(timestamp[3]+" "+timestamp[4]+" UTC");
    var unix = new Date(date).getTime() / 1000
    var streamer = url[3];
    var vodid = url[5];
    var prehash = url[3]+"_"+url[5]+"_"+unix
    var hash = Sha1.hash(prehash);
    hash = hash.slice(0,20);
    var uuid = hash+"_"+streamer+"_"+vodid+"_"+unix
    var h2 = document.querySelector('.headline');
    var href = document.createElement('div');
    let fullurl = "https://dgeft87wbj63p.cloudfront.net/"+uuid+"/chunked/index-dvr.m3u8";
    let domains = ["https://vod-secure.twitch.tv",
"https://vod-metro.twitch.tv",
"https://vod-pop-secure.twitch.tv",
"https://d2e2de1etea730.cloudfront.net",
"https://dqrpb9wgowsf5.cloudfront.net",
"https://ds0h3roq6wcgc.cloudfront.net",
"https://d2nvs31859zcd8.cloudfront.net",
"https://d2aba1wr3818hz.cloudfront.net",
"https://d3c27h4odz752x.cloudfront.net",
"https://dgeft87wbj63p.cloudfront.net",
"https://d1m7jfoe9zdc1j.cloudfront.net",
"https://d2vjef5jvl6bfs.cloudfront.net"]
    let validURL = "";
    const promises = [];
    for (let i =0; i < domains.length; i++){
        let domain = domains[i];
        let combinedURL = domain + "/"+uuid+"/chunked/index-dvr.m3u8";
        try{
            let response = await checkURL(combinedURL);
            console.log(domain,response);
            promises.push(response);
            validURL = combinedURL;
            break;
        } catch(e){
            console.log("Error checking: ",e);
        }
    }
 
    async function checkURL(url) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: url,
                type: 'GET',
                timeout: 30000,
                dataType: 'jsonp',
                statusCode: {
                    200: function() {
                        console.log( url,"status code 200 returned" );
                        resolve(true);
                    },
                    404: function() {
                        console.log( url,"status code 404 returned" );
                        reject(false);
                    }
                },
                error:function(){
                    //console.log(domain,"Error");
                }
            })
        })
    }
    console.log("Valid url",validURL);
    //href.innerHTML = '<br><a href="https://dgeft87wbj63p.cloudfront.net/'+uuid+'/chunked/index-dvr.m3u8">Vod link</a>';
    if (validURL != ""){
       href.innerHTML = '<br><a href="'+validURL+'">Vod link</a>';
    } else {
      href.innerHTML = '<br>No Vod link found</a>';
    }
    h2.appendChild(href);
 
 
})();
