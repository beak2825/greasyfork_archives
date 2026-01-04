// ==UserScript==
// @name        Voat->Gvid archive
// @namespace   Violentmonkey Scripts
// @match       *://www.voat.xyz/*
// @match       *://www.talk.lol/*
// @grant       none
// @version     1.0
// @author      -
// @description 4/21/2022, 9:17:28 PM
// @require https://cdnjs.cloudflare.com/ajax/libs/js-sha1/0.6.0/sha1.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444027/Voat-%3EGvid%20archive.user.js
// @updateURL https://update.greasyfork.org/scripts/444027/Voat-%3EGvid%20archive.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
const user='';
const key='';  //Get a key at https://gvid.tv/manage
const buttontext='Archive on Gvid'

var extensions = new Set(['webm','mp4']);

function sha1hash(string) {
 var hash=sha1.create();
 hash.update(string);
 hash.update(key);
 hash.digest();
 return hash.hex();
}

function sendsecure(action,parameters,cb) {
 var innerobj={user,action,parameters,time:Date.now()};
 var innerjson=JSON.stringify(innerobj);
 var outerobj={payload:innerjson,hmac:sha1hash(innerjson)};
 fetch('https://gvid.tv/userapi',{
  method:'POST',
  body:JSON.stringify(outerobj)
 }).then(resp=>cb(null,resp)).catch(cb);
}

function buttonclick(e) {
 var b = e.target;
 var post = b.closest('.post-container,.post-container2');
 var url=posturl(post);
 var title=posttitle(post);
 var postid=post.id.replace('post_','');
 var host=location.host.indexOf('voat.xyz')!=-1?'voat.xyz':'talk.lol'; //Also gets rid of www
 var hostname=host=='voat.xyz'?'Voat':'Talk.lol'; //Display version
 var commentsurl=`https://${host}/viewpost?postid=${postid}`;
 var description=`[Discussion on ${hostname}](${commentsurl})`; //Markdown
 sendsecure('directupload',{title,url,description},(err,resp)=>{
  if(err) return alert(err);
  b.remove(); 
 });
}

function testurl(url) {
 var extension=url.split('.').pop().toLowerCase();
 if(extensions.has(extension)) return true;
 return false;
}

function posturl(post) {
 return post.querySelector('a').href;
}
function posttitle(post) {
 return post.querySelector('.post-title a').innerText;
}

function testpost(post) {
 return testurl(posturl(post));
}

function postlist() {
 return document.querySelectorAll('.post-container,.post-container2');
}

function targetposts() {
 return Array.prototype.filter.apply(postlist(),[testpost]);
}

function addbuttontopost(post) {
 var button=document.createElement('button');
 button.innerText=buttontext;
 button.addEventListener('click',buttonclick);
 post.querySelector('.post-title').append(button);
 button.style="cursor:pointer;";
}

function addbuttons() {
 targetposts().forEach(addbuttontopost);
}

addbuttons();