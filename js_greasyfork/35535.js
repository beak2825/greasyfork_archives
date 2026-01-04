// ==UserScript==
// @name Vote Ratio
// @namespace Voat
// @match https://voat.co/v/*/*
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant    GM.getValue
// @grant    GM.setValue
// @description Mark who upvotes and who downvotes on Voat.co
// @version 0.0.1.20171122072143
// @downloadURL https://update.greasyfork.org/scripts/35535/Vote%20Ratio.user.js
// @updateURL https://update.greasyfork.org/scripts/35535/Vote%20Ratio.meta.js
// ==/UserScript==
//

var cache = {};
var queue = [];
var queuecb = {};
var lowthresh=null;
var highthresh=null;
var lowthreshcb=[];
var highthreshcb=[];

/*function getlowthresh(cb) {
 if(lowthresh) {
  return cb(null,lowthresh);
 }
 if(lowthreshcb.length===0) {
  GM.getValue('lowthresh').then(function(value) {
   lowthreshcb.forEach(function(cb) {
    cb(null,lowthresh=(value||4));
   });
  });
 }
 lowthreshcb.push(cb);
}

function gethighthresh(cb) {
 if(highthresh) {
  return cb(null,highthresh);
 }
 if(highthreshcb.length===0) {
  GM.getValue('highthresh').then(function(value) {
   highthreshcb.forEach(function(cb) {
    cb(null,highthresh=(value||4));
   });
  });
 }
 highthreshcb.push(cb);
}*/

function getUserRatio(username,cb) {
 var val = cache[username];
 if(val) {
  cb(null,val);
  return;
 }
 GM.getValue(username).then(function(value) {
  if(value) {
   cache[username]=value;
   cb(null,value);
   return;
  }
  httpGetUserRatio(username,cb);
 });
}

var httpGetUserRatio = addqueue;

var lock=false;
function addqueue(username,cb) {
 if(queuecb[username]) {
  queuecb[username].push(cb);
  return;
 }
 var lock=queue.length;
 queue.push(username);
 queuecb[username]=[cb];
 if(!lock) {
  lock=true;
  doqueue();
 }
}

function doqueue() {
 var username = queue.shift();
 console.log('http');
 $.get('/user/'+username).done(function(text) {
  var strongs=$($(text).find('.userstats-body')[1]).find('strong');
  var ups=parseInt(strongs[1].innerHTML)+parseInt(strongs[4].innerHTML);
  var downs=parseInt(strongs[2].innerHTML)+parseInt(strongs[5].innerHTML);
  var retr=ups/downs;
  cache[username]=retr;
  GM.setValue(username,retr);
  queuecb[username].forEach(function(cb) {
   cb(null,retr);
  });
  delete queuecb[username];
  if(queue.length) {
   setTimeout( doqueue,2000);
  }
  else {
   lock=false;
  }
 });
}

GM.getValue('lowthresh').then(function(val) {
 console.log(val);
 lowthresh=val||4;
});
GM.getValue('highthresh').then(function(val) {
 highthresh=val||4;
});
$(function () {
 var count=0;
 var ups=0;
 var downs=0;
 var done=0;
 $('.userinfo').toArray().forEach(function(i) {
  ++count;
  getUserRatio(i.innerHTML,function(error,ratio) {
   if(ratio<lowthresh) {
    $(i).after($('<span style="background:#faa;margin:2px;">downvoter</span>'));
    ++downs;
   }
   if(ratio>highthresh) {
    $(i).after($('<span style="background:#afa;margin:2px;">upvoter</span>'));
    ++ups;
   }
   ++done;
   if(count===done) {
    highthresh*=(ups/count>1/5)?1.1:0.9;
    lowthresh*=(downs/count>1/5)?0.9:1.1;
    GM.setValue('highthresh',highthresh);
    GM.setValue('lowthresh',lowthresh);
   }
  });
 });
});
console.log('hi');