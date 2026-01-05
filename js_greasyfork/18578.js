// ==UserScript==
// @name        SteamGifts Notifications Updater
// @namespace   SG Notifications Updater
// @include     *://www.steamgifts.com/*
// @version     0.1.4
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_getResourceURL
// @resource    logo https://image.ibb.co/bTcoVv/logo.png
// @run-at      document-end
// @description:en Update notifications.
// @description Update notifications.
// @downloadURL https://update.greasyfork.org/scripts/18578/SteamGifts%20Notifications%20Updater.user.js
// @updateURL https://update.greasyfork.org/scripts/18578/SteamGifts%20Notifications%20Updater.meta.js
// ==/UserScript==

var time0 = 15*1000; //local check
var time1 = 1.5*60*1000; //check numbers
var time2 = 30*60*1000; //full check




var ismessagepage = !!document.URL.match(/(:\/\/www.steamgifts.com\/messages)$/);
var pointslock = false;





function filtermessages(el){
  return el.replace(/<div class="comment"><div class="comment__parent">(\r\n|\r|\n|\s)+<div class="comment__envelope">(\r\n|\r|\n|\s)+<i class="fa fa-envelope-o"><\/i>(\r\n|\r|\n|\s)+<\/div>/g,'<div class="comment comment-new"><div class="comment__parent">')
    .replace(/(\r\n|\r|\n|\s)+<i class="comment__collapse-button fa fa-minus-square-o"><\/i>(\r\n|\r|\n|\s)+<i class="comment__expand-button fa fa-plus-square-o"><\/i>(\r\n|\r|\n|\s)+/g,'')
    .replace(/\smarkdown--resize-body/g,'')
    .replace(/(\r\n|\r|\n|\t)+/g,'')
}



var title = document.title;
function changetitle(localcheck){
  var curtitle = document.title;
  //var e = $('div.nav__right-container:first');
  //var em = Number($('a.nav__button[title*="Messages"]:first',e).text());
  //var ew = Number($('a.nav__button[title*="Won"]:first',e).text());
  //var ec = Number($('a.nav__button[title*="Created"]:first',e).text());
  var e = document.getElementsByClassName('nav__right-container')[0];
  var em = Number(e.querySelector('a.nav__button[title*=Messages').textContent);
  var ew = Number(e.querySelector('a.nav__button[title*=Won').textContent);
  var ec = Number(e.querySelector('a.nav__button[title*=Created').textContent);
  var e = em + ew + ec;
  var newtitle = (e === 0 ? title : "(" + e + ") " + title);
  if (curtitle !== newtitle){
      document.title = newtitle;
      if (!localcheck && e>0){
          var logo = GM_getResourceURL("logo");
          var msg = ((em>0?em + " Messages":"") + (ew>0?(em>0?"\n":"") + ew + " Won games":"") + (ec>0?(em>0||ew>0?"\n":"") + ec + " Created giveaways with winners":""));
          if (Notification.permission === "granted") { var notification = new Notification(title, {icon: logo, body: msg });
          } else if (Notification.permission !== 'denied') { Notification.requestPermission(function (permission) { if (permission === "granted") { var notification = new Notification(title, {icon: logo, body: msg }); } });
          }
      }
  }
}




function mark(name,b){
  var b = b||GM_getValue(name.toLowerCase(),0);
  //$('a.nav__button[title*="'+name+'"]:first')[0].innerHTML = b;
  
  //var element = $('a.nav__button[title*="'+name+'"]:first');
  
  var element = document.getElementsByClassName('nav__right-container')[0].querySelector('a.nav__button[title*="'+name+'"]');
  element.innerHTML = b;
  var element = $(element);
  
  if (!!element.text()){
    element.parent()
      .removeClass("nav__button-container--inactive")
      .addClass("nav__button-container--active")
  } else {
    element.parent()
      .removeClass("nav__button-container--active")
      .addClass("nav__button-container--inactive")
  }
}



function check(el,mes){
  var el = el||false;
  //parsed \/
  var elp = (typeof(el) === "string" ? (new DOMParser()).parseFromString(el,"text/html") : document);
  var mes = !!mes||ismessagepage;
  
  if(!!el){
    //var element = $('a.nav__button[title*="Messages"]:first',el)[0].innerHTML;
    var element = elp.getElementsByClassName('nav__right-container')[0].querySelector('a.nav__button[title*=Messages').innerHTML;
    if(mes){
      //GM_setValue('messagescontent',filtermessages($('div.comments__entity:first',el).parent()[0].innerHTML));
      GM_setValue('messagescontent',filtermessages(elp.getElementsByClassName('comments__entity')[0].parentNode.innerHTML));
      GM_setValue('messages', element);
      mark("Messages", element);
    //} else if($('a.nav__button[title*="Messages"]:first')[0].innerHTML !== element){
    } else if(document.getElementsByClassName('nav__right-container')[0].querySelector('a.nav__button[title*=Messages').innerHTML !== element){
      GM_setValue('messages',element);
      mark("Messages", element);
      update(true);
    }
    
    //var element = $('a.nav__button[title*="Created"]:first',el)[0].innerHTML;
    var element = elp.getElementsByClassName('nav__right-container')[0].querySelector('a.nav__button[title*=Created').innerHTML;
    GM_setValue('created',element);
    mark("Created", element)
    
    //var element = $('a.nav__button[title*="Won"]:first',el)[0].innerHTML;
    var element = elp.getElementsByClassName('nav__right-container')[0].querySelector('a.nav__button[title*=Won').innerHTML;
    GM_setValue('won',element);
    mark("Won", element);
    
    //var element = $(".nav__points",el).text();
    var element = elp.getElementsByClassName('nav__points')[0].textContent;
    //$(".nav__points").text(element);
    document.getElementsByClassName('nav__points')[0].textContent = element;
    GM_setValue('points',element);
    changetitle(false);
  } else {
    mark("Messages");
    mark("Created");
    mark("Won");
    //$(".nav__points").text(GM_getValue('points',0));
    document.getElementsByClassName('nav__points')[0].textContent = GM_getValue('points',0);
    changetitle(true);
  }
}





function update(mes){
  console.log((mes?'Full':'Partial')+' update');
  GM_setValue('scanlocked',true);
  var mes = !!mes||(document.URL==="http://www.steamgifts.com/messages");
  var xhr = new XMLHttpRequest();
  xhr.open("GET", (mes?"https://www.steamgifts.com/messages":"https://www.steamgifts.com/messages/tickets"));//https://www.steamgifts.com/trades/new
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status === 200) {
        if (!mes){ GM_setValue('lastscan',Date.now()); } else { GM_setValue('lastscancontent',Date.now()); }
        check(xhr.response,mes)
        //console.log((new DOMParser()).parseFromString(xhr.response,"text/html"))
      }
      GM_setValue('scanlocked',false);
    }
  }
  xhr.send();
}



//GM_setValue('created',$('a.nav__button[title*="Created"]:first')[0].innerHTML);
//GM_setValue('won',$('a.nav__button[title*="Won"]:first')[0].innerHTML);
//GM_setValue('points',$(".nav__points:first").text());
GM_setValue('created',document.getElementsByClassName('nav__right-container')[0].querySelector('a.nav__button[title*=Created').innerHTML);
GM_setValue('won',document.getElementsByClassName('nav__right-container')[0].querySelector('a.nav__button[title*=Won').innerHTML);
GM_setValue('points',document.getElementsByClassName('nav__points')[0].textContent);
changetitle();

if(ismessagepage){
  GM_setValue('lastscancontent',Date.now());
  //GM_setValue('messages',$('a.nav__button[title*="Messages"]:first')[0].innerHTML);
  //GM_setValue('messagescontent',filtermessages($('div.comments__entity:first').parent()[0].innerHTML));
  GM_setValue('messages',document.getElementsByClassName('nav__right-container')[0].querySelector('a.nav__button[title*=Messages').innerHTML);
  GM_setValue('messagescontent',filtermessages(document.getElementsByClassName('comments__entity')[0].parentNode.innerHTML));
} else {
  GM_setValue('lastscan',Date.now());
  //var messages = $('a.nav__button[title*="Messages"]:first')[0].innerHTML;
  var messages = document.getElementsByClassName('nav__right-container')[0].querySelector('a.nav__button[title*=Messages').innerHTML;
  if(GM_getValue('messages',0)!==messages||GM_getValue('messagescontent',false)===false||Date.now()-GM_getValue('lastscancontent',0)>=time2){
    update(true);
  } else {
    GM_setValue('messages',messages);
  }

  var styles = [];
  styles.push('\
              #notificationContainer div.nav__absolute-dropdown{overflow-y:scroll;background-image:linear-gradient(#fff 0%, #f6f7f9 100%);background-image:-moz-linear-gradient(#fff 0%, #f6f7f9 100%);background-image:-webkit-linear-gradient(#fff 0%, #f6f7f9 100%); width:auto; width:430px;}\
              #notificationContainer div.nav__absolute-dropdown div .comments__entity:hover{max-height:100%;}\
              #notificationContainer div.nav__absolute-dropdown div .comments__entity:first-child{margin-top:0px;}\
              #notificationContainer div.nav__absolute-dropdown div .comment-new{background-color: #cce6ff;}\
              #notificationContainer div.nav__absolute-dropdown div .comments .comment .comment__parent .comment__summary .comment__display-state{color: #465670;}\
              ')
  var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = styles.join('');
  document.getElementsByTagName('head')[0].appendChild(style);

  //$('a.nav__button[title*="Messages"]').click(function(){return false;})
  $(document.getElementsByClassName('nav__right-container')[0].querySelector('a.nav__button[title*=Messages')).click(function(){return false;})
    .attr('id','notificationLink')
    .addClass("nav__button--is-dropdown")
    .parent().prepend('<div id="notificationContainer" class="nav__relative-dropdown is-hidden"><div class="nav__absolute-dropdown"><a class="nav__row" href="/messages" style="position: sticky; top: 0; z-index: 50;"><i class="fa fa-envelope" style="color: rgb(18, 20, 26);"></i><div class="nav__row__summary"><p class="nav__row__summary__name">Go to messages page.</p></div></a><div id="messages"></div></div></div>')
}




function markread(){
  GM_setValue('scanlocked',true);
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://www.steamgifts.com/messages");
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status === 200) {
        GM_setValue('lastscancontent',Date.now());
        check(xhr.response,true)
      }
      GM_setValue('scanlocked',false);
    }
  }
  //xhr.send("xsrf_token="+$('input[type=hidden][name=xsrf_token]:first').val()+"&do=read_messages");
  xhr.send("xsrf_token="+document.getElementsByName("xsrf_token")[0].value+"&do=read_messages");
  //$.ajax({
    //url: "/messages",
    //type: "POST",
    //dataType: "json",
    //data: "xsrf_token="+$('input[type=hidden][name=xsrf_token]').val()+"&do=read_messages",
    //success: function(e) {
      //update(true);
      //console.log(e.response)
    //},
    //error: function(e) {
      //console.log(e)
      //console.log(e.response)
    //}
  //});
}




$("#notificationLink").click(function(e) {
    console.log(this)
  var a = $(this).siblings(".nav__relative-dropdown").find(".nav__absolute-dropdown")
  a[0].style.maxHeight = ($(window).height()-39) + 'px'
  $('#messages',a)[0].innerHTML = GM_getValue('messagescontent','');
  if ($('a.nav__row',a).length===1){
    if (!!$('div.comment.comment-new:first', a).length){
      $('a.nav__row',a).after('<a class="nav__row" href="javascript:void(0);"><i class="fa fa-check-circle" style="color: rgb(18, 20, 26);"></i><div class="nav__row__summary"><p class="nav__row__summary__name">Mark all as read.</p></div></a>')
        .parent().children('a.nav__row:last').click(function(){markread();$(this).remove();update(true);})
    }
  } else if (!$('div.comment.comment-new:first', a).length){
    $('a.nav__row:last',a).remove();
  }
  var t = $(this).hasClass("is-selected");
  $("nav .nav__button").removeClass("is-selected"), $("nav .nav__relative-dropdown").addClass("is-hidden"), t || $(this).addClass("is-selected").siblings(".nav__relative-dropdown").removeClass("is-hidden"), e.stopPropagation()
});






$("#notificationContainer").click(function(e)
{
  var e=e.target;
  if(!!e.href || !!e.parentElement.href || !!e.parentElement.parentElement.href){
  } else {
    if (e.className==="comment__toggle-attached"){
      //$(e).parent().find("img").toggleClass("is-hidden");
      
      var element = e.parentNode.getElementsByTagName('img')[0];
      var toggleClass = "is-hidden";
      var currentClass = element.className;
      var newClass;
      if(currentClass.split(" ").indexOf(toggleClass) > -1){ //has class
          newClass = currentClass.replace(new RegExp('\\b'+toggleClass+'\\b','g'),"")
      }else{
          newClass = currentClass + " " + toggleClass;
      }
      element.className = newClass.trim();
      

    }
    return false;
  }
});




$('.sidebar__entry-insert, .sidebar__entry-delete, div.table__remove-default.is-clickable').click(function()
{
  pointslock = true;
  //var points = $(".nav__points").text();
  var points = document.getElementsByClassName('nav__points')[0].textContent;
  (function myLoop (i) {
    setTimeout(function () {
      //if (points !== $(".nav__points").text()){
        //GM_setValue('points',$(".nav__points").text());
      if (points !== document.getElementsByClassName('nav__points')[0].textContent){
        GM_setValue('points',document.getElementsByClassName('nav__points')[0].textContent);
        pointslock = false;
        i=1;
      }
      if (--i) myLoop(i);
    }, 50)
  })(20);
});




setInterval(function() {
  var now = Date.now();
  var lastscancontent = GM_getValue('lastscancontent',0);
  var lastscan = GM_getValue('lastscan',0);
  var scanlocked = GM_getValue('scanlocked',false);
  if(!scanlocked && now-lastscancontent>=time2 && now-lastscan>=time1){
    update(true);
  } else if(!scanlocked && now-lastscan>=time1 && now-lastscancontent>=time1){
    update(false);
  } else if(scanlocked && now-lastscancontent>=(time2+time1)){
    console.log("Scanlocked delayed scan for a very long time. Bypassing it.")
    update(true);
  } else {
    //console.log('Local check');
    check()
  }
}, Math.max(time0,5000));