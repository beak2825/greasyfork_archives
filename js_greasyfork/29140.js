// ==UserScript==
// @name        Steamgifts Auto Entry Enhanced
// @namespace   Steamgifts Auto Entry Enhanced
// @description Automatically enters giveaways on steamgifts.com
// @author      PutinTheGreat
// @include     http*://*steamgifts.com*
// @version     10.0.2
// @homepage    https://github.com/PutinTheGreat/Steamgifts_AutoEntry_Enhanced
// @grant       none
// @license     MIT
// @require     http://code.jquery.com/jquery-2.1.4.min.js
// @require     http://code.jquery.com/ui/1.11.4/jquery-ui.min.js
// @compatible  firefox
// @contributionURL bitcoin:37xGgYLeQoaJsCdrCjVW89m5oWZxp8tkhf
// @basecodeversion 26
// @downloadURL https://update.greasyfork.org/scripts/29140/Steamgifts%20Auto%20Entry%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/29140/Steamgifts%20Auto%20Entry%20Enhanced.meta.js
// ==/UserScript==



this.$ = this.jQuery = jQuery.noConflict(true);

jQuery.fn.center = function () {
  this.css("position","fixed");
  this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + "px");
  this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
  return this;
}
jQuery.fn.centerfixed = function () {
  this.css('top','50%');
  this.css('margin-top','-'+this.height()/2+'px');
  return this;
}

var sgSiteMaxPoints = 500;  // Max points capable on SteamGifts site as of (19.07.20)
var gamelist=[];
var minpoints=100;
var maxpoints=480;
//var maxpages=10;  // i used maxpagenum it does same thing
var enterwishlist=false;
var entergroup=false;
var enterfeatured=false;
var entryordermethod=1;
var checktimer;
var watchdogtimer;
var autoentrylastrun=new Date();
var sitepattern=new RegExp('https?://.*steamgifts.com');
var siteurl=sitepattern.exec(document.URL.toString());
var pointsavailable=0;
var possibleentries=[];
var bestchanceentries=[];
var timeout=600000;
var enabled=false;
var enabledonload=false; //default --- var enabledonload=false;
var maxentries=-1; //default --- var maxentries='';
var maxpagenum=8; //default --- var maxpagenum=10;
var minpointpageincr=220; //default --- var minpointpageincr=220;
var enterfree=true; //default --- var enterfree=true;
var previousentrylistcount=0; //for checking if there are giveaways this is workaround for issue
var previousentrylistmatched=0; //for knowing if an issue is found, before every time was detected as issue
var entriesperpage=0; //for knowing how many non pinned/featured giveaways should be on each page, better then using arbitrary number
var entrylisterrorcount=0; //for tracking if there are issues with entrylistcount
var accountsynctime=0;
var accountsynctimeupdated=false;
var ownedgameslist=[];
var time_interval = 500;
var time_min = 0;
var timer;
var timerRunning = false;
var giveawaypage = false;
var previous_element_sensor_height = 0;

if(location.href.match(/steamgifts.com\/$/) || location.href.match(/steamgifts.com\/giveaways\/search/)) {
  giveawaypage = true;
}

$(window).focus(function() {
  // gained focus
  time_min = 0;
  startTimer();
}).blur(function() {
  // lost focus
  stopTimer();
});

function startTimer() {
  if(!timerRunning && giveawaypage) {
    timerRunning = true;
    processTimer();
  }
}

function stopTimer() {
  clearTimeout(timer);
  timerRunning = false;
}

function processTimer() {
  fn_elementsensorheight();
  fn_process_time();
  timer = setTimeout(processTimer, time_interval);
}

function fn_executestorage() {
{
  var s=$.localStorage;
  if(s.isSet('games')) {
    gamelist=s.get('games');
  }
  for(var i=0; i<gamelist.length; i++) {
    gamelist[i].name=gamelist[i].name.trim();
    if(typeof(gamelist[i].maxentries)=="nothing" || $.isNumeric(gamelist[i].maxentries)==false) {
      gamelist[i].maxentries=-1;
    }
    if(typeof(gamelist[i].entergroup)=="nothing") {
      gamelist[i].entergroup=true;
    }
  }
  if(s.isSet('minpoints')) {
    minpoints=s.get('minpoints');
    if($.isNumeric(minpoints)==false) {
      minpoints=100;
    }
  }
  if(s.isSet('maxpagenum')) {
    maxpagenum=s.get('maxpagenum');
    if($.isNumeric(maxpagenum)==false) {
      maxpagenum=8;
    }
  }
  if(s.isSet('minpointpageincr')) {
    minpointpageincr=s.get('minpointpageincr');
    if($.isNumeric(minpointpageincr)==false) {
      minpointpageincr=220;
    }
  }
  if(s.isSet('maxentries')) {
    maxentries=s.get('maxentries');
    if($.isNumeric(maxentries)==false) {
      maxentries=-1;
    }
  }
  if(s.isSet('maxpoints')) {
    maxpoints=s.get('maxpoints');
    if($.isNumeric(maxpoints)==false) {
      maxpoints=280;
    }
  }
  if(s.isSet('entryordermethod')) {
    entryordermethod=s.get('entryordermethod');
    if($.isNumeric(entryordermethod)==false) {
      entryordermethod=1;
    }
  }
  if(entryordermethod<0 || entryordermethod>3) {
    entryordermethod=1;
  }
  if(s.isSet('enterwishlist') && s.get('enterwishlist')!="undefined") {
    enterwishlist=s.get('enterwishlist');
  }
  if(s.isSet('entergroup') && s.get('entergroup')!="undefined") {
    entergroup=s.get('entergroup');
  }
  if(s.isSet('enterfeatured') && s.get('enterfeatured')!="undefined") {
    enterfeatured=s.get('enterfeatured');
  }
  if(s.isSet('enterfree') && s.get('enterfree')!="undefined") {
    enterfree=s.get('enterfree');
  }
  if(s.isSet('enabledonload') && s.get('enabledonload')!="undefined") {
    enabledonload=s.get('enabledonload');
  }
}
}

function log(text) {
  if(window.console && console.log) {
    var now = new Date();
    console.log(now.toLocaleString()+' : '+text);
  }
}

function startpagerequest_getsynctime() {
  log('Starting request for page settings profile sync');
  var pageurl=siteurl+'/account/settings/profile';
  jQuery.ajax({method: "GET",
    url: pageurl,
    success: backgroundpageload_getsynctime()//,
    //error: log('An error might have occured getting the sync time.')
  });
}

function backgroundpageload_getsynctime() {
  return function(resp) {

    syncclass=$(resp).find('.form__sync-data').find('span');

    if(typeof(syncclass)!="undefined" && typeof(syncclass.length)!="undefined") {
      var synctime=syncclass.attr('data-timestamp');
      log('old sync='+accountsynctime+' ~~ new sync='+synctime);
      if(synctime!=accountsynctime) {
        accountsynctime=synctime;
        startpagerequest_getownedgameslist(1);
      } else {
        accountsynctimeupdated=true;
        startautoentry();
      }
    }
  }
}

function startpagerequest_getownedgameslist(pagenum) {
  log('Starting account game list request for page '+pagenum.toString());
  var pageurl=siteurl+'/account/steam/games/search?page='+pagenum.toString();
  //log(pageurl);
  jQuery.ajax({method: "GET",
    url: pageurl,
    success: backgroundpageload_getownedgameslist(pagenum)//,
    //error: loadfailure(pagenum)
  });
}

function backgroundpageload_getownedgameslist(pagenum) {
  return function(resp) {

    ownedgamesnames=$(resp).find('.table__column__heading');
    pagelimit=$(resp).find('.pagination__navigation > :last-child').attr('data-page-number');

    if(typeof(ownedgamesnames)!="undefined" && typeof(ownedgamesnames.length)!="undefined") {
      if(pagenum==1) {
        //clear out owned games array
        ownedgameslist.length=0;
      }
      for(i = 0; i < ownedgamesnames.length; i++) {
        currentgamename = ownedgamesnames[i].innerText || ownedgamesnames[i].textContent;
        ownedgameslist.push(currentgamename);
      }
      //log(pagelimit);
      if(pagelimit>pagenum) {
        startpagerequest_getownedgameslist(pagenum+1);
      } else {
        accountsynctimeupdated=true;
        startautoentry();
        log('Finished getting owned games list.');
      }
    } else {
      accountsynctimeupdated=true;
      startautoentry();
      log('Finished getting owned games list.');
    }
  }
}

function entrysuccess(resp) {
	if(resp.hasOwnProperty('type')) {
    if(resp.type=='success') {
      log('Successfully entered giveaway');
    } else if(resp.type=='error') {
     	if(resp.hasOwnProperty('msg')) {
         log('Error entering giveaway.  Reason: '+resp.msg);
      } else {
        log('Unspecified error entering giveaway');
    	}
    }
  } else {
    log('Unknown result from entry');
  }
  if(resp.hasOwnProperty('points')) {
   	pointsavailable=resp.points;
  }
	log('Points available='+pointsavailable);
	setTimeout(startnextentry,5000);
}

function entryfail(xhr, textstatus, error) {
  log('Entry failed '+error);
	setTimeout(startnextentry,2000);
}

function startnextentry() {
  var coderegex=new RegExp('giveaway/([^/]*?)/.*');
  var xsrf='';
  var xsrfregex=new RegExp('name=\"xsrf_token\"[^>]*?value=\"([^>\"]*?)\"');
  var xsrfarr=xsrfregex.exec($("html").html());
  if(xsrfarr!=null && xsrfarr.length>1) {
		xsrf=xsrfarr[1];
  } else {
   	log('Unable to find xsrf token');
  }
  
  if(!enabled) {
    log('Auto Entry Disabled.  Stopping entries.');
		return;
  }
  
	if(possibleentries.length>0) {
		for(var ei=0; ei<possibleentries.length; ei++) {
			if((entryordermethod==3 || entryordermethod==2 || possibleentries[ei].force==true) && (pointsavailable-possibleentries[ei].points)>=minpoints) {
        var codearr=coderegex.exec(possibleentries[ei].url);
        if(codearr!=null && codearr.length>1) {
          $.ajax({
            type: "POST",
            url: siteurl+"/ajax.php",
            data: {xsrf_token: xsrf, do: "entry_insert", code: codearr[1]},
            success: entrysuccess,
            error: entryfail,
            dataType: 'json'
          });
        } else {
         	log('Unable to find game code in url');
        }

				possibleentries.splice(ei,1);
				return;
			}
		}
		for(var ti=0; ti<gamelist.length; ti++) {
			for(var ei=0; ei<possibleentries.length; ei++) {
				var rematch=false;
				try {
					rematch=new RegExp(gamelist[ti].name.replace("(", "\\(").replace(")", "\\)"),"i").test(possibleentries[ei].name); //added replace to fix issue with some giveaways;
				} catch(e) {
          log('Regular expression failed in startnextentry()');
				}
				if((gamelist[ti].name==possibleentries[ei].name || rematch==true) && (pointsavailable-possibleentries[ei].points)>=minpoints) {	
          var codearr=coderegex.exec(possibleentries[ei].url);
          if(codearr!=null && codearr.length>1) {
            $.ajax({
              type: "POST",
              url: siteurl+"/ajax.php",
              data: {xsrf_token: xsrf, do: "entry_insert", code: codearr[1]},
              success: entrysuccess,
              error: entryfail,
              dataType: 'json'
            });
          } else {
            log('Unable to find game code in url');
          }

					possibleentries.splice(ei,1);
					return;
				}
			}
		}
	}
	
	// We're done, but we have points available, enter next giveaway with the best chance of winning
	if(pointsavailable > maxpoints && bestchanceentries.length>0) {
		log(pointsavailable+' points available, attempting to enter giveaway with best chance of winning '+bestchanceentries[0].url+'   '+bestchanceentries.length+' other giveaways left');
		possibleentries.push(bestchanceentries[0]);
		bestchanceentries.shift();
		startnextentry();
		return;
	}
	
	// done with this update
	// start the timer again for the next series of updates
	checktimer=setTimeout(startupdate,timeout);
	
	log('Update done');
}

function startpagerequest(pagenum) {
  log('Starting request for page '+pagenum.toString());
  var pageurl;
  if(pagenum=='wishlist' || pagenum=='group') {
    pageurl=siteurl+'/giveaways/search?type='+pagenum;
  } else {
    pageurl=siteurl+'/giveaways/search?page='+pagenum.toString()+'&status=open';
  }
  jQuery.ajax({method: "GET",
    url: pageurl,
    success: backgroundpageload(pagenum),
    error: loadfailure(pagenum)
  });
}

function backgroundpageload(pagenum) {
  return function(resp) {

    entries=$(resp).find('.giveaway__row-outer-wrap');
    nogiveaways=false;
    pinned=$('.pinned-giveaways__outer-wrap').find('.giveaway__row-outer-wrap');

    if(typeof(entries)!="undefined" && typeof(entries.length)!="undefined") {
      if(entries.length==pinned.length) {
        log('No giveaways found on page '+pagenum);
        nogiveaways=true;
      } else if(pagenum!='wishlist' && pagenum!='group' && entries.length<(pinned.length+entriesperpage) && entries.length==previousentrylistcount && previousentrylistmatched>=1) {
        entrylisterrorcount++;
        log('ERROR detected, marking as No giveaways found on page '+pagenum+'  ~~  Total Error Count ('+entrylisterrorcount+')');
        nogiveaways=true;
      } else if(pagenum==1) {
        entriesperpage=entries.length-pinned.length;
      } else if(entries.length==previousentrylistcount && entries.length<(pinned.length+entriesperpage)) {
        previousentrylistmatched++;
      }
      // for debugging
      //log('Entries Length='+entries.length+',Pinned Length='+pinned.length+',Entriesperpage='+entriesperpage+',previousentrylistcount='+previousentrylistcount+',previousentrylistmatched='+previousentrylistmatched);
      $(entries).each(function() {
        // skip class is-faded because we've already entered them
        if($(this).find('.giveaway__row-inner-wrap').hasClass('is-faded')==false) {
          var ok=true;
          var wantenter=true;
          var contrib=$(this).find('.contributor_only');
          if(contrib.length>0) {
            if($(contrib).hasClass('green')==false) {
              ok=false;
            }
          }
          var levelok=!($(this).find('.giveaway__column--contributor-level--negative').length>0);
          if(levelok==false) {
            log('Level not high enough');
            ok=false;
          }
          var isgroup=($(this).find('.giveaway__column--group').length>0);
          if(isgroup==true) {
            log('Group giveaway');
          }
          var isfeatured=($(this).parents('.pinned-giveaways__outer-wrap').length>0);
          var name=$(this).find('.giveaway__heading__name').text();
          var isblacklisted=game_blacklisted(name);
          var gameidx=gamelist.map(function(el) { return el.name; }).indexOf(name);
          if(gameidx<0 && levelok==true) {
            for(var gi=0; gi<gamelist.length && gameidx<0; gi++) {
              try {
                if(RegExp(gamelist[gi].name.replace("(", "\\(").replace(")", "\\)"),"i").test(name)==true) {
                  log('Matched regex '+gamelist[gi].name+' for game '+name);
                  gameidx=gi;
                }
              } catch(e) {
                log('Regular expression failed in backgroundpageload('+pagenum+')');
              }
            }
            if(gameidx<0) {
              ok=false;
            }
          }
          if(ok==true && isgroup==true && gamelist[gameidx].entergroup==false) {
            wantenter=false;
            log('Skipping entry of ignored group giveaway for '+gamelist[gameidx].name);
          }
          if(ok==false && isfeatured==true && enterfeatured==true && levelok==true) {
            if(gameidx < 0) {
              ok=true;
            } else if(gamelist[gameidx].maxentries!=0) {
              ok=true;
            }
          }
          if(ok==true && isblacklisted==true) {
            wantenter=false;
            log('Skipping entry of blacklisted giveaway for '+name);
          }
          var pointsregex=new RegExp("\\((\\d+)P\\)");
          var arr=pointsregex.exec($(this).find('.giveaway__heading').html());
          var entriesregex=new RegExp("(\\d+) entr");
          // remove , from string because it's used as a thousand separator
          var earr=entriesregex.exec($(this).find('.giveaway__links a').html().replace(',',''));
          var entries=0;
          if(earr && earr.length==2) {
            entries=parseInt(earr[1]);
          }
          if(ok==true) {
            if(gameidx >= 0) {
              if(gamelist[gameidx].maxentries!="nothing" && gamelist[gameidx].maxentries!=-1 && parseInt(gamelist[gameidx].maxentries)<entries) {
                ok=false;
                if(gamelist[gameidx].maxentries > 0) {
                  log('Too many entries for '+$(this).find('a[href^="/giveaway/"]').attr('href'));
                } else {
                  //handled by blacklisting
                  //log('Entries not allowed for '+$(this).find('a[href^="/giveaway/"]').attr('href'));
                }
              }
            }
          }
          var copiesregex=new RegExp("\\((\\d+) Copies\\)");
          var carr=copiesregex.exec($(this).find('.giveaway__heading').html());
          var copies=1;
          if(carr && carr.length==2) {
            copies=parseInt(carr[1]);
          }
          // handles free, cost 0 points, giveaways
          var isfree=false;
          if(arr[1]==0 && enterfree==true && levelok==true) {
            isfree=true;
            ok=true;
          }
          if(isblacklisted==false && levelok==true && wantenter==true && (ok==true || (pagenum=='wishlist' && ok==true) || (pagenum=='group' && ok==true))) {
            var thisurl=$(this).find('a[href^="/giveaway/"]').attr('href');
            var haveurl=false;
            for(var ei=0; ei<possibleentries.length; ei++) {
              if(possibleentries[ei].url==thisurl) {
                haveurl=true;
              }
            }
            if(haveurl==false) {
              possibleentries.length+=1;
              possibleentries[possibleentries.length-1]={};
              possibleentries[possibleentries.length-1].url=thisurl;
              possibleentries[possibleentries.length-1].name=name;
              possibleentries[possibleentries.length-1].points=arr[1];
              possibleentries[possibleentries.length-1].force=(pagenum=='wishlist' || pagenum=='group' || (ok==true && isfeatured==true && enterfeatured==true) || (ok==true && isfree==true));
              possibleentries[possibleentries.length-1].isgroup=isgroup;
              possibleentries[possibleentries.length-1].entries=entries;
              possibleentries[possibleentries.length-1].copies=copies;
              log('Adding possible '+(pagenum=='wishlist' ? 'wishlist ' : (pagenum=='group' ? 'group ' : ''))+'entry '+possibleentries[possibleentries.length-1].url+'  points='+possibleentries[possibleentries.length-1].points+'  '+possibleentries.length);
            }
          }
          // we didn't explicitly enter for this giveaway, and it's not blacklisted and our level is ok, save it in the best chance giveaway list
          else if(maxpoints<sgSiteMaxPoints && levelok==true && isblacklisted==false) {
            var thisurl=$(this).find('a[href^="/giveaway/"]').attr('href');
            var haveurl=false;
            for(var ei=0; ei<bestchanceentries.length; ei++) {
              if(bestchanceentries[ei].url==thisurl) {
                haveurl=true;
              }
            }
            if(haveurl==false) {
              bestchanceentries.length+=1;
              bestchanceentries[bestchanceentries.length-1]={};
              bestchanceentries[bestchanceentries.length-1].url=thisurl;
              bestchanceentries[bestchanceentries.length-1].name=name;
              bestchanceentries[bestchanceentries.length-1].points=arr[1];
              bestchanceentries[bestchanceentries.length-1].force=true;
              bestchanceentries[bestchanceentries.length-1].isgroup=isgroup;
              bestchanceentries[bestchanceentries.length-1].entries=entries;
              bestchanceentries[bestchanceentries.length-1].copies=copies;
            }
          }
        }
      });
    } else {
      nogiveaways=true;
    }
    
    var pointregex=new RegExp("Account(?:[^>]*?)>(\\d+)<","gm");
    var pointarr=pointregex.exec(resp);
    if(pointarr!=null && pointarr.length==2) {
      pointsavailable=pointarr[1];
    }
    
    if(pagenum=='wishlist' || pagenum=='group') {
      nogiveaways=false;
      previousentrylistcount=0;
      previousentrylistmatched=0;
      entriesperpage=0;
      if(entergroup==true && pagenum=='wishlist') {
        startpagerequest('group');
        return;
      }
      pagenum=0;
    }
    
    afterenterpointcount=pointsavailable;
    for(var ei=0; ei<possibleentries.length; ei++) {
      afterenterpointcount-=possibleentries[ei].points;
    }
    if((pagenum<maxpagenum || afterenterpointcount>minpointpageincr) && nogiveaways==false) {
      previousentrylistcount=entries.length;
      startpagerequest(pagenum+1);
      return;
    } else {
      previousentrylistcount=0;
      previousentrylistmatched=0;
      entriesperpage=0;
    }
    
    // sort best chance array so best is at the front
    if(maxpoints<sgSiteMaxPoints) {
      bestchanceentries.sort(sortentry);
    }
    
    // if we're entering giveaways with the best chance first, sort that list as well
    if(entryordermethod==2) {
      log('Sorting potential entries so best chance is tried first');
      possibleentries.sort(sortentry);
    }
    
    log('Points Available='+pointsavailable);
    startnextentry();
    
  }
}

function loadfailure(pagenum) {
  return function(resp) {
    if(pagenum=='wishlist') {
      if(entergroup==true) {
        startpagerequest('group');
        return;
      }
      pagenum=0;
    }
      
    if(pagenum=='group') {
      pagenum=0;
    }
    
    if(pagenum<maxpagenum) {
      startpagerequest(pagenum+1);
      return;
    }
    // done with this update
    // start the timer again for the next series of updates
    checktimer=setTimeout(startupdate,timeout);
  }
}

function startupdate() {
  if(accountsynctimeupdated==false) {
    startpagerequest_getsynctime();
    return;
  } else {
    accountsynctimeupdated=false;
  }
  autoentrylastrun=new Date();
  pointsavailable=0;
  possibleentries=[];
  bestchanceentries=[];
  if(enterwishlist==true) {
    startpagerequest('wishlist');
  } else if(entergroup==true) {
    startpagerequest('group');
  } else {
    startpagerequest(1);
  }
}

function startautoentry(event) {
  if(typeof(checktimer)!="undefined") {
    clearTimeout(checktimer);
  }
  if(typeof(watchdogtimer)!="undefined") {
    clearInterval(watchdogtimer);
  }
  autoentrylastrun=new Date();
  checktimer=setTimeout(startupdate,2000);
  watchdogtimer=setInterval(watchdogfunc,timeout*2);
}

function stopautoentry(event) {
  clearTimeout(checktimer);
  clearInterval(watchdogtimer);
}

function getgameli(game) {
  var li=$('<li style="cursor:grab;"></li>');
  var span=$('<span class="gamename" style="display:inline-block;width:350px;text-overflow:ellipsis;margin-right:10px;"></span>');
  li.append(span);
  span.text(game.name);
  span=$('<span class="maxentries" style="display:inline-block;width:40px;margin-right:10px;"></span>');
  li.append(span);
  span.text(game.maxentries);
  span=$('<span class="entergroup" style="display:inline-block;width:50px;margin-right:10px;"></span>');
  li.append(span);
  span.text((game.entergroup==true ? 'Yes' : 'No'));
  
  var removelink=$('<a style="cursor:pointer;">Remove</a>');
  removelink.click(function() { $(this).parent().remove(); });
  li.append(removelink);
  return li;
}

function game_blacklisted(name) {
  var found = ownedgameslist.includes(name);
  if(found) {
    log('blacklisted game found in owned games list = '+name);
  }
  var gameidx=gamelist.map(function(el) { return {n:el.name,m:el.maxentries}; }).indexOf({n:name,m:0});
  if(gameidx<0) {
    for(var gi=0; gi<gamelist.length && gameidx<0; gi++) {
      try {
        if(gamelist[gi].maxentries==0 && RegExp(gamelist[gi].name.replace("(", "\\(").replace(")", "\\)"),"i").test(name)==true) {
          gameidx=gi;
        }
      } catch(e) {
        log('Regular expression failed in game_blacklisted('+name+')');
      }
    }
  }
  return (gameidx>0 || found);
}

function sortentry(a,b) {
  if((a.entries/a.copies) < (b.entries/b.copies)) {
    return -1;
  }
  if((a.entries/a.copies) == (b.entries/b.copies)) {
    return 0;
  }
  return 1;
}

function watchdogfunc() {
  log('Watchdog timer');
  if(enabled==true) {
    var now=new Date();
    if((now-autoentrylastrun) > (timeout*2)) {
      log('Watchdog detected auto entry is hung.  Restarting auto entry.');
      stopautoentry();
      startautoentry();
    }
  }
}

function createsettingsdiv() {
  var outerdiv=$('<div class="modalWindow" id="autoentrysettingsdiv" style="position:absolute;width:550px;height:520px;background-color:#ffffff;display:none;border:1px solid;border-radius:4px;color:#6d7c87;font-size:11px;font-weight:bold;padding:5px 10px;"></div>');
  outerdiv.append('<h2 style="text-align:center;color:#4f565a;">Auto Entry Settings</h2>');
  outerdiv.append('<h3 style="color:#4f565a;">Games</h3><i>Reorder the list to have your most wanted games at the top</i>');
  outerdiv.append('<div id="gamelist" style="height:350px;overflow-y:scroll;"></div>');
  outerdiv.find('#gamelist').append('<span style="display:inline-block;width:350px;text-overflow:ellipsis;margin-right:10px;color:#4f565a;">Game</span>');
  outerdiv.find('#gamelist').append('<span style="display:inline-block;width:40px;text-overflow:ellipsis;margin-right:10px;color:#4f565a;">Max Entries</span>');
  outerdiv.find('#gamelist').append('<span style="display:inline-block;width:50px;text-overflow:ellipsis;margin-right:10px;color:#4f565a;">Enter Group</span>');
  var ul=$('<ul id="autoentrygameul"></ul>');
  outerdiv.find('#gamelist').append(ul);
  
  for(var i=0; i<gamelist.length; i++) {
    ul.append(getgameli(gamelist[i]));
  }
  ul.sortable();
  ul.disableSelection();
  var addgamediv=$('<div id="addgame"><input type="text" id="addgamename" style="width:350px;margin-right:6px;padding:0px;" title="The full name of the game as it appears on steamgifts.com, or a regular expression to match the name against"><input type="text" id="addgamemaxentries" style="width:40px;margin-right:6px;padding:0px;" value="'+maxentries+'" title="Giveaways for this game will be entered as long as the number of existing entries is equal to or fewer than this.  Use -1 to always enter giveaways regardless of the number of entries.  Use 0 to not enter giveaways for this game."><input type="checkbox" id="addgameentergroup" style="width:50px;margin-right:18px;padding:0px;" title="Enter Group Giveaways for this game."></div>');

  var addgamelink=$('<a style="cursor:pointer;">Add</a>');
  addgamelink.click(function() {
    var game={};
    game.name=$('#addgamename').val().trim();
    game.maxentries=$('#addgamemaxentries').val();
    game.entergroup=$('#addgameentergroup').prop("checked");
    
    if(game.name=='' || game.maxentries=='') {
      alert('You must enter a game name and maximum entries');
      return;
    }
    
    if($.isNumeric(game.maxentries)==false) {
      alert('Maximum entries must be a number');
      return;
    }

    var exists=false;
    var existingli=null;
    $('#gamelist ul li').each(function() {
      if($(this).find('.gamename').text()==game.name) {
        exists=true;
        existingli=$(this);
      }
    });
    
    if(exists==true) {
      $(existingli).find('.maxentries').text(game.maxentries);
      $(existingli).find('.entergroup').text(game.entergroup==true ? 'Yes' : 'No');
      alert('This game was already in the list and was replaced with your new settings');
    }
    else {
      $('#gamelist').find('ul').append(getgameli(game));
    }
    $('#addgamename').val('');
    $('#addgamemaxentries').val(maxentries);
    $('#addgameentergroup').prop('checked',false);
  });
  addgamediv.append(addgamelink);
  outerdiv.append(addgamediv);
  var outerdivoptions='';
  outerdivoptions+='<table width="100%">';
  outerdivoptions+='<tr><td>Min Points <input type="text" id="autoentryminpoints" pattern="\\d+" style="width:30px; padding:0px;" title="Giveaways will only be entered as long as your points available will remain at or above this number.  This allows you to have a spare pool of points to manually enter giveaways.">';
  outerdivoptions+='</td><td>Default Max Entries <input type="text" id="autoentrymaxentries" pattern="^-?\\d+$" style="width:30px; padding:0px;" title="After adding any game the Max Entries will be set to this default.">';
  outerdivoptions+='</td><td>Max Page Number <input type="text" id="autoentrymaxpagenum" pattern="\\d+" style="width:30px; padding:0px;" title="Sets the maximum number of pages to go thru for giveaways. (Overridden by Min Point Increase Page)">';
  outerdivoptions+='</td><td>Min Point Increase Page <input type="text" id="autoentryminpointpageincr" pattern="\\d+" style="width:30px; padding:0px;" title="Sets the minimum required points to search beyond the Max Page Number. (Prevents ending up with '+sgSiteMaxPoints+' points. Set to '+sgSiteMaxPoints+' to not use.)">';
  outerdivoptions+='</td></tr>';
  outerdivoptions+='<tr><td>Max Points <input type="text" id="autoentrymaxpoints" pattern="\\d+" style="width:30px; padding:0px;" title="After all your selected games have been entered, this will automatically enter any other games (that are not blacklisted) that have the best chance of winning until the points remaining is less than this value.">';
  outerdivoptions+='</td><td colspan=3>Entry Order : <select id="autoentryordermethod" style="width:auto;padding:1px 1px;" title="The order in which to enter giveaways.  Wishlist and Group giveaways are entered as they are encountered regardless of this setting."><option value="1">Giveaways at top of my game list first</option><option value="2">Giveaways with best chance of winning</option><option value="3">Giveaways ending soonest</option></select>';
  outerdivoptions+='</td></tr>';
  outerdivoptions+='<tr><td colspan=2><input type="checkbox" name="autoentryenterwishlist" id="autoentryenterwishlist" style="width:15px;vertical-align:top;">Enter any wishlist giveaways';
  outerdivoptions+='</td><td colspan=2><input type="checkbox" name="autoentryentergroup" id="autoentryentergroup" style="width:15px;vertical-align:top;">Enter group giveaways';
  outerdivoptions+='</td></tr><tr><td colspan=2><input type="checkbox" name="autoentryenterfeatured" id="autoentryenterfeatured" style="width:15px;vertical-align:top;" title="There are special giveaways that show up at the top of most pages on the site.">Enter featured giveaways';
  outerdivoptions+='</td><td colspan=2><input type="checkbox" name="autoentryenterfree" id="autoentryenterfree" style="width:15px;vertical-align:top;" title="Check to enter any giveaways that cost 0 points.">Enter free giveaways';
  outerdivoptions+='<tr><td colspan=2><input type="checkbox" name="autoentryenabledonload" id="autoentryenabledonload" style="width:15px;vertical-align:top;" title="Check to enable Auto Entry on page load. (only on steamgifts homepage)">Enable Auto Entry on page load';
  outerdivoptions+='</td></tr></table>';
  outerdiv.append(outerdivoptions);
  var center=$('<center></center>');
  outerdiv.append(center);
  var savebutton=$('<button>Save</button>');
  center.append(savebutton);
  savebutton.click(function() { 
    $('#autoentrysettingsdiv').slideUp();
    var storage=$.localStorage;
    
    gamelist=[];
    $('#gamelist ul li').each(function() {
      gamelist.push({
              name:$(this).find('.gamename').text(),
              maxentries:$(this).find('.maxentries').text(),
              entergroup:($(this).find('.entergroup').text()=='Yes' ? true : false)
            });
    });
    
    storage.set('games',gamelist);
    if($.isNumeric($('#autoentryminpoints').val())==true) {
      minpoints=$('#autoentryminpoints').val();
      storage.set('minpoints',minpoints);
    }
    if($.isNumeric($('#autoentrymaxpoints').val())==true) {
      maxpoints=$('#autoentrymaxpoints').val();
      storage.set('maxpoints',maxpoints);
    }
    if($.isNumeric($('#autoentryordermethod option:selected').val())==true) {
      entryordermethod=$('#autoentryordermethod option:selected').val();
      storage.set('entryordermethod',entryordermethod);
    }
    if($.isNumeric($('#autoentrymaxentries').val())==true) {
      maxentries=$('#autoentrymaxentries').val();
      storage.set('maxentries',maxentries);
    }
    if($.isNumeric($('#autoentrymaxpagenum').val())==true) {
      maxpagenum=$('#autoentrymaxpagenum').val();
      storage.set('maxpagenum',maxpagenum);
    }
    if($.isNumeric($('#autoentryminpointpageincr').val())==true) {
      minpointpageincr=$('#autoentryminpointpageincr').val();
      storage.set('minpointpageincr',minpointpageincr);
    }
    enterwishlist=$('#autoentryenterwishlist').prop("checked");
    storage.set('enterwishlist',enterwishlist);
    entergroup=$('#autoentryentergroup').prop("checked");
    storage.set('entergroup',entergroup);
    enterfeatured=$('#autoentryenterfeatured').prop("checked");
    storage.set('enterfeatured',enterfeatured);
    enterfree=$('#autoentryenterfree').prop("checked");
    storage.set('enterfree',enterfree);
    enabledonload=$('#autoentryenabledonload').prop("checked");
    storage.set('enabledonload',enabledonload);
  });
  
  var closebutton=$('<button class="closeModal">Close</button>');
  center.append(' ');
  center.append(closebutton);
  
  return outerdiv;
}

function createhelpdiv() {
  var outerdiv=$('<div class="modalWindow" id="autoentryhelpdiv" style="position:absolute;width:740px;height:620px;background-color:#ffffff;display:none;border:1px solid;border-radius:4px;color:#6d7c87;font-size:11px;font-weight:bold;padding:5px 10px;overflow-y:scroll;"></div>');
  outerdiv.append('<h2 style="text-align:center;">Help</h2>');
  outerdiv.append('<br />');
  var innerdiv=$('<div style="line-height:1.3em;">');
  outerdiv.append(innerdiv);
  innerdiv.append('How to use the Auto Entry feature<br /><br />');
  innerdiv.append('You must be logged into steamgifts.com to use the Auto Entry feature.  All setup must be done on the Settings page under the Auto Entry menu<br /><br />');
  innerdiv.append('First add the games you want to automatically enter.  To do this you need to enter either the name of the game as it appears on steamgifts.com or a regular expression, the maximum number of entries a giveaway can have before the auto entry will skip over it, and if you want to enter group giveaways for the game.  The maximum entries is only checked when entering giveaways.  Once you are entered in a giveaway it will not remove the entry if the number of entries goes over the maximum at a later time.  You can enter -1 here to always enter giveaways for that game, or 0 to blacklist the game.<br /><br />');
  innerdiv.append('As you add games they will show up in the list.  You can drag and drop games to rearrange them.  Games at the top of the list will be entered first and therefore use up points first, so keep your most wanted games at the top of the list.<br /><br />');
  innerdiv.append('If you select enter any wishlist giveaways the games on your wishlist will be entered first, before all other entries if points are available.  This is for ANY game in your wishlist, not just those games you\'ve added to the auto entry list.  Likewise if you select enter group giveaways, the giveaways for groups you are a member of will be entered second, unless you have excluded the game from group giveaways in your auto entry list.  Only after these entries are made will entries for the games in your auto entry list be considered.<br /><br />');
  innerdiv.append('You may also choose to enter any featured giveaways that show up at the top of some pages on the site.  If you don\'t select this option, games that are featured may still be entered if they are matched in your game list, otherwise they will be skipped.<br /><br />');
  innerdiv.append('In the settings page enter the minimum number of points that the auto entry system will leave for you.  The auto entry system will not enter a giveaway if your points available would go below this number.  This will give you a pool of unused points so you can manually enter giveaways that you want.<br /><br />');
  innerdiv.append('In the settings page also enter a value for the maximum number of points.  If the auto entry system goes through all your games and enters giveaways for everyting it can, and it still has more points left than this value, the system will automatically enter giveaways that have the highest chance of winning until the points fall below this value.  Enter '+sgSiteMaxPoints+' or more to disable this feature.<br /><br />');
  innerdiv.append('You should also configure the maximum number of pages to retrieve in the settings page.  The auto entry system will only look at giveaways on pages up to this number.  This is useful to reserve your points for giveaways ending the soonest in the first few pages of giveaways.<br /><br />');
  innerdiv.append('After you have made any changes in the Settings page, you need to click the Save button to save those changes.<br /><br />');
  innerdiv.append('Enable the auto entry system by clicking the Disabled link under the Auto Entry menu.  When the auto entry system is running the link will change to Enabled.  Clicking it when Enabled will disable it.<br /><br />');
  innerdiv.append('When the auto entry system is enabled it will attempt to enter giveaways for games in your list every 10 minutes.  It will check for giveaways on the first configured number of pages of games as listed on steamgifts.com.<br /><br />');
  innerdiv.append('Only enable the auto entry system in a single browser tab.  Once the system is enabled you should leave that browser tab alone and use another tab if you want to browse steamgifts.com.<br /><br />');
  innerdiv.append('<div style="width:50%;text-align:center;float:left;">PutinTheGreat - Donations Greatly Appreciated : <br />37xGgYLeQoaJsCdrCjVW89m5oWZxp8tkhf</div><div style="width:50%;text-align:center;float:right;">Original Creator - Bitcoin Donations Appreciated : <br />1SGiftfrNtDfThSykhB8yDZYTJPHF59hH</div>');
  var closebutton=$('<div style="clear:both;"><center><button class="closeModal">Close</button></center><br /></div>');
  outerdiv.append(closebutton);
  
  return outerdiv;
}

function createbackuprestorediv() {
  var outerdiv=$('<div class="modalWindow" id="autoentrybackuprestorediv" style="position:absolute;width:500px;height:380px;background-color:#ffffff;display:none;border:1px solid;border-radius:4px;color:#6d7c87;font-size:11px;font-weight:bold;padding:5px 10px;"></div>');
  outerdiv.append('The settings for Auto Entry are saved in your browser\'s local storage.  This might get cleared periodically by the browser or addons, or when you manually clear your browser cache.  You can manually save and restore your settings below should the need arise.<br /><br />');
  outerdiv.append('Backup Settings - <i>Copy this text and save it.  You can use this text to restore your Auto Entry settings later should they become lost or to transfer them to another computer.</i>');
  outerdiv.append('<textarea id="autoentrybackupjson" readonly style="height:100px;max-height:100px;"></textarea>');
  outerdiv.append('<br />');
  //var copybutton=$('<button>Copy To Clipboard</button>');
  ///outerdiv.append(copybutton);
  //copybutton.click(function() {
  //  copyToClipboard($('#autoentrybackupjson'));
  //});
  outerdiv.append('<br />');
  outerdiv.append('Restore Settings - <i>Paste settings that you\'ve previously saved to restore them.  This will overwrite any settings you currently have.</i>');
  outerdiv.append('<textarea id="autoentryrestorejson" style="height:100px;max-height:100px;"></textarea>');
  var center=$('<center></center>');
  outerdiv.append(center);
  var restorebutton=$('<button>Restore</button>');
  center.append(restorebutton);
  restorebutton.click(function() {
    if($('#autoentryrestorejson').val()=='') {
      alert('You must paste your settings first');
      return false;
    }
    var settingsobj={};
    try {
      settingsobj=JSON.parse($('#autoentryrestorejson').val());
    } catch(e) {
      alert('Invalid settings to restore.  '+e.message);
      return false;
    }
    if(settingsobj==null || typeof(settingsobj)=="undefined") {
      alert('Invalid settings to restore');
      return false;
    }
    
    if(typeof(settingsobj.version)=="undefined" || typeof(settingsobj.gamelist)=="undefined" || typeof(settingsobj.minpoints)=="undefined") {
      alert('The settings you are trying to restore are invalid');
      return false;
    } else if(settingsobj.version==2 && (typeof(settingsobj.enterwishlist)=="undefined" || typeof(settingsobj.entergroup)=="undefined")) {
      alert('The settings you are trying to restore are invalid');
      return false;
    }
    
    if(settingsobj.version>=1) {
      gamelist=settingsobj.gamelist;
      minpoints=settingsobj.minpoints;
    }
    if(settingsobj.version>=2) {
      enterwishlist=settingsobj.enterwishlist;
      entergroup=settingsobj.entergroup;
    }
    if(settingsobj.version>=3) {
      enterfeatured=settingsobj.enterfeatured;
    }
    if(settingsobj.version>=4) {
      enterfree=settingsobj.enterfree;
      enabledonload=settingsobj.enabledonload;
      maxentries=settingsobj.maxentries;
      maxpagenum=settingsobj.maxpagenum;
      minpointpageincr=settingsobj.minpointpageincr;
    }
    if(settingsobj.version>=5) {
      maxpoints=settingsobj.maxpoints;
    }
    if(settingsobj.version>=6) {
      entryordermethod=settingsobj.entryordermethod;
    }
    
    $('#autoentryrestorejson').val('');
    alert('Settings restored in memory.  Save the settings to permanently store them.');
  });
  outerdiv.append('<br />');
  var closebutton=$('<center><button class="closeModal">Close</button></center>');
  outerdiv.append(closebutton);
  
  return outerdiv
}

function copyToClipboard(inElement) {
  alert(inElement.html());
  if(inElement.createTextRange) {
    var range = inElement.createTextRange();
    if(range && BodyLoaded==1)
      range.execCommand('Copy');
  }
}

function fn_addgametolist() {
  var giveaways=$('.giveaway__heading > .giveaway__heading__name');
  $(giveaways).each(function() {
    if($(this).parent().find('.addgametolist').length==0) {
      var buttonstyle='cursor:pointer;border-style:solid;border-width:1px;border-radius:4px;text-align:center;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;';
      var addgametolist='<div class="addgametolist sidebar__button-style" style="'+buttonstyle+'"><i class="fa fa-plus-circle"></i> Add Game To List</div>&nbsp;';
      $(this).parent().prepend(addgametolist);
    }
  });
  setTimeout(
  function() {
    $('.addgametolist').off();
    $('.addgametolist').click(function() {
      //log('test1');
      var itinerary = $(this).parent().find('.giveaway__heading__name')
                  .clone(true)       /* get a clone of the element and from it */
                  .find('.ga-mark')  /* retrieve the button, then */
                  .remove()          /* remove it, */
                  .end()             /* return to the previous selection and */
                  .html() ;          /* get the html */
      var gamename=itinerary.trim();
      if(gamename.match(/\.\.\.$/)) {
        gamename='^'+gamename.replace(/\.\.\.$/, "").trim();
      } else {
        gamename='^'+gamename.trim()+'$';
      }
      $('#autoentrysettings').click();
      $('#addgamename').val(decodeEntities(gamename));
      return false;
    });
  }, 250);
}

function decodeEntities(encodedString) {
  var textArea = document.createElement('textarea');
  textArea.innerHTML = encodedString;
  return textArea.value;
}

$(document).ready(function() {
  if($('.nav__left-container').length>0) {
    $('body').append(createsettingsdiv());
    $('body').append(createhelpdiv());
    $('body').append(createbackuprestorediv());
    
    // change to icon-green when enabled and icon-red when disabled
    // fa-toggle-off - fa-toggle-on
    
    var cont=$('nav .nav__left-container').append('\
    <div id="autoentrybuttoncontainer" class="nav__button-container">\
      <div class="nav__relative-dropdown is-hidden">\
        <div class="nav__absolute-dropdown">\
          <a class="nav__row" id="autoentryenabled" style="cursor:pointer;">\
            <i class="icon-red fa fa-fw fa-toggle-off"></i>\
            <div class="nav__row__summary">\
              <p class="nav__row__summary__name">Disabled</p>\
              <p class="nav__row__summary__description">Auto Entry currently disabled</p>\
            </div>\
          </a>\
          <a class="nav__row" id="autoentrysettings" style="cursor:pointer;">\
            <i class="icon-grey fa fa-fw fa-pencil-square-o"></i>\
            <div class="nav__row__summary">\
              <p class="nav__row__summary__name">Settings</p>\
              <p class="nav__row__summary__description">Auto Entry settings</p>\
            </div>\
          </a>\
          <a class="nav__row" id="autoentrybackuprestore" style="cursor:pointer;">\
            <i class="icon-grey fa fa-fw fa-save"></i>\
            <div class="nav__row_summary">\
              <p class="nav__row__summary__name">Backup/Restore</p>\
              <p class="nav__row__summary__description">Manually backup or restore settings</p>\
            </div>\
          </a>\
          <a class="nav__row" id="autoentryhelp" style="cursor:pointer;">\
            <i class="icon-grey fa fa-fw fa-question-circle"></i>\
            <div class="nav__row_summary">\
              <p class="nav__row__summary__name">Help</p>\
              <p class="nav__row__summary__description">Auto Entry help</p>\
            </div>\
          </a>\
        </div>\
      </div>\
      <span class="nav__button nav__button--is-dropdown" id="autoentrymainbutton">Auto Entry <i class="icon-red fa fa-fw fa-minus"></i></span>\
      <div class="nav__button nav__button--is-dropdown-arrow">\
        <i class="fa fa-angle-down"></i>\
      </div>\
    </div>');
    
    // needed for Tampermonkey - greasemonkey loads at interactive
    if(document.readyState=='complete')
    {
      cont.find('#autoentrybuttoncontainer .nav__button--is-dropdown-arrow').click(function(e){
        var t=$(this).hasClass("is-selected");
        $("nav .nav__button").removeClass("is-selected");
        $("nav .nav__relative-dropdown").addClass("is-hidden");
        if(!t) {
          $(this).addClass("is-selected").siblings(".nav__relative-dropdown").removeClass("is-hidden");
        }
        e.stopPropagation();
        }
      );
    }
    
    $('#autoentryenabled, #autoentrymainbutton').click(function() {
      if(enabled==false) {
        $("#autoentryenabled i").removeClass("icon-red");
        $("#autoentryenabled i").addClass("icon-green");
        $("#autoentryenabled i").removeClass("fa-toggle-off");
        $("#autoentryenabled i").addClass("fa-toggle-on");
        $('#autoentryenabled .nav__row__summary__name').text('Enabled');
        $('#autoentryenabled .nav__row__summary__description').text('Auto Entry currently enabled');
        $('#autoentrymainbutton i').removeClass("icon-red");
        $('#autoentrymainbutton i').addClass("icon-green");
        $('#autoentrymainbutton i').removeClass("fa-minus");
        $('#autoentrymainbutton i').addClass("fa-check");
        startautoentry();
        enabled=true;
      }
      else {
        $("#autoentryenabled i").removeClass("icon-green");
        $("#autoentryenabled i").addClass("icon-red");
        $("#autoentryenabled i").removeClass("fa-toggle-on");
        $("#autoentryenabled i").addClass("fa-toggle-off");
        $('#autoentryenabled .nav__row__summary__name').text('Disabled');
        $('#autoentryenabled .nav__row__summary__description').text('Auto Entry currently disabled');
        $('#autoentrymainbutton i').removeClass("icon-green");
        $('#autoentrymainbutton i').addClass("icon-red");
        $('#autoentrymainbutton i').removeClass("fa-check");
        $('#autoentrymainbutton i').addClass("fa-minus");
        stopautoentry();
        enabled=false;
      }
      return false; 
    });
    $('#autoentrysettings').click(function() { 
      $("nav .nav__button").removeClass("is-selected");
      $("nav .nav__relative-dropdown").addClass("is-hidden");
      $('#autoentrysettingsdiv').center();
      $('#autoentrysettingsdiv').centerfixed();
      $('#autoentrysettingsdiv').slideDown();
      var ul=$('#autoentrygameul');
      ul.empty();
      for(var i=0; i<gamelist.length; i++) {
        ul.append(getgameli(gamelist[i]));
      }
      ul.sortable();
      ul.disableSelection();
      $('#autoentryminpoints').val(minpoints);
      $('#autoentrymaxpoints').val(maxpoints);
      $('#autoentryordermethod option[value="'+entryordermethod+'"]').prop('selected',true);
      $('#autoentrymaxentries').val(maxentries);
      $('#autoentrymaxpagenum').val(maxpagenum);
      $('#autoentryminpointpageincr').val(minpointpageincr);
      $('#autoentryenterwishlist').prop("checked",enterwishlist);
      $('#autoentryentergroup').prop("checked",entergroup);
      $('#autoentryenterfeatured').prop("checked",enterfeatured);
      $('#autoentryenterfree').prop("checked",enterfree);
      $('#autoentryenabledonload').prop("checked",enabledonload);
      return false;
    });
    $('#autoentrybackuprestore').click(function() {
      $("nav .nav__button").removeClass("is-selected");
      $("nav .nav__relative-dropdown").addClass("is-hidden");
      $('#autoentrybackuprestorediv').center();
      $('#autoentrybackuprestorediv').centerfixed();
      $('#autoentrybackuprestorediv').slideDown();
      var savedsettings={};
      savedsettings.version=6;
      savedsettings.gamelist=gamelist;
      savedsettings.minpoints=minpoints;
      savedsettings.maxpoints=maxpoints;
      savedsettings.entryordermethod=entryordermethod;
      savedsettings.enterwishlist=enterwishlist;
      savedsettings.entergroup=entergroup;
      savedsettings.enterfeatured=enterfeatured;
      savedsettings.enterfree=enterfree;
      savedsettings.enabledonload=enabledonload;
      savedsettings.maxentries=maxentries;
      savedsettings.maxpagenum=maxpagenum;
      savedsettings.minpointpageincr=minpointpageincr;
      $('#autoentrybackupjson').val(JSON.stringify(savedsettings,null,4));
      return false;
    });
    $('#autoentryhelp').click(function() {
      $("nav .nav__button").removeClass("is-selected");
      $("nav .nav__relative-dropdown").addClass("is-hidden");
      $('#autoentryhelpdiv').center();
      $('#autoentryhelpdiv').centerfixed();
      $('#autoentryhelpdiv').slideDown();
      return false;
    });
    
    $('.closeModal').click(function() {
      $(this).closest('.modalWindow').slideUp();
    });
  };
  
  if(giveawaypage) {
    if($('header .nav__right-container .nav__sits').attr('href') != '/?login') {
      var script = document.createElement('script');
      script.appendChild(document.createTextNode(function_process_buttons));
      (document.body || document.head || document.documentElement).appendChild(script);
      var script2 = document.createElement('script');
      script2.appendChild(document.createTextNode(function_check_buttons));
      (document.body || document.head || document.documentElement).appendChild(script2);
      var style = document.createElement('style');
      style.appendChild(document.createTextNode(".featured__container {margin-top: 39px !important;}\nheader {position: fixed;top: 0px;width: 100%;z-index: 99999;}\n.sidebar__button-style {font-size-adjust: .45;height: 18px;line-height: 130%;padding: 0px 4px 0px 4px;margin-bottom: 3px;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;}\n.sidebar__mpu {height:auto !important;}"));
      (document.body || document.head || document.documentElement).appendChild(style);
    }
  }
  
  if(enabledonload && giveawaypage) {
    $('#autoentryenabled').click();
  }
  
  window.onresize = function(event) {
    $('#autoentryhelpdiv').center();
    $('#autoentryhelpdiv').centerfixed();
    $('#autoentrybackuprestorediv').center();
    $('#autoentrybackuprestorediv').centerfixed();
    $('#autoentrysettingsdiv').center();
    $('#autoentrysettingsdiv').centerfixed();
  };
});




////// START FUNCTIONS TO ADD BUTTONS TO SITE //////
function fn_elementsensorheight() {
  if($('.page__outer-wrap').height() - previous_element_sensor_height != 0) {
    previous_element_sensor_height = $('.page__outer-wrap').height();
    fn_addgametolist();
    if(giveawaypage) {
      fn_addbuttonsmore();
    }
  }
}

function fn_addbuttons(v_element) {
  var v_code = v_element.find('a.giveaway__heading__name').attr('href');
  var v_code_array = v_code.split('/');
  
  var v_form = ' \
  <form class="buttonentergiveaway"> \
    <input type="hidden" value="'+$('form > input[name="xsrf_token"]').val()+'" name="xsrf_token"> \
    <input type="hidden" value="" name="do"> \
    <input type="hidden" value="'+v_code_array[2]+'" name="code"> \
    <div class="sidebar__entry-insert is-hidden sidebar__button-style" data-do="entry_insert" onclick="$(this).closest(\'form\').find(\'.sidebar__entry-loading\').removeClass(\'is-hidden\');$(this).closest(\'.giveaway__row-inner-wrap\').addClass(\'is-faded\');function_process_buttons($(this));"><i class="fa fa-plus-circle"></i> Enter Giveaway</div> \
    <div class="sidebar__entry-delete is-hidden sidebar__button-style" data-do="entry_delete" onclick="$(this).closest(\'form\').find(\'.sidebar__entry-loading\').removeClass(\'is-hidden\');function_process_buttons($(this));$(this).closest(\'.giveaway__row-inner-wrap\').removeClass(\'is-faded\');"><i class="fa fa-minus-circle"></i> Remove Entry</div> \
    <div class="sidebar__entry-loading is-hidden is-disabled sidebar__button-style"><i class="fa fa-refresh fa-spin"></i> Please wait...</div> \
    <div class="sidebar__error is-hidden is-disabled sidebar__button-style"><i class="fa fa-exclamation-circle"></i> Not Enough Points</div> \
  </form>&nbsp;&nbsp;';
  
  var sd = v_element.parent().parent().find(".giveaway__heading__thin:last-of-type").text();
  var num = sd.match(/[\d\.]+/g);
  if(num != null) {
    num = parseInt(num);
  } else {
    num = 0;
  }
  if(v_element.parent().parent().attr('class').match(/is-faded/)) {
    v_replace = 'sidebar__entry-delete';
  } else if(num > parseInt($(".nav__points").text())) {
    v_replace = 'sidebar__error';
  } else {
    v_replace = 'sidebar__entry-insert';
  }
  v_form = v_form.replace(v_replace+' is-hidden', v_replace);
  
  v_element.html(v_form+v_element.html());
}

function fn_addbuttonsmore() {
  var giveaways=$('.giveaway__heading > .giveaway__heading__name');
  $(giveaways).each(function() {
    if($(this).parent().find('.buttonentergiveaway').length==0) {
      $(this).parent().parent().find('div.giveaway__columns > div:nth-child(1)').html($(this).parent().parent().find('div.giveaway__columns > div:nth-child(1)').html().replace(/remaining$/,''));
      $(this).parent().parent().find('div.giveaway__columns > div:nth-child(1) > span').text($(this).parent().parent().find('div.giveaway__columns > div:nth-child(1) > span').text()+' remaining');
      fn_addbuttons($(this).parent());
    }
  });
}
////// END FUNCTIONS TO ADD BUTTONS TO SITE //////


////// START FUNCTIONS TO PROCESS TIME //////
function fn_process_time() {
  if((time_min <= 60 & (time_min*1000) % 1000 == 0) || (time_min <= 3600 && time_min % 60 == 0) || (time_min <= 86400 && time_min % 3600 == 0) || (time_min <= 604800 && time_min % 86400 == 0) || (time_min % 604800 == 0)) {
    fn_set_time_handler();
  }
  time_min -= time_interval/1000;
}

function fn_set_time_handler() {
  if($('div.giveaway__summary > div.giveaway__columns > div:nth-child(1)').length) {
    var v_element=$('div.giveaway__summary > div.giveaway__columns > div:nth-child(1)');
      $(v_element).each(function() {
        if($(this).find("span").html() != 'Ended') {
          var v_epoch_response = fn_get_time($(this).find("span").attr('data-timestamp'));
          if(v_epoch_response < time_min || time_min < 1) {
            time_min = v_epoch_response;
          }
        fn_set_times($(this).find("span"),v_epoch_response,'remaining');
      }
    });
  }
}

function fn_set_times(element,v_time,type) {
  var v_time_final = 0;
  var v_time_type = '';
  var v_time_in_seconds = v_time;
  if(v_time_in_seconds < 1) {
    element.closest('.giveaway__summary').find('form').css('display','none');
    element.html('Ended')
  } else {
    if(v_time_in_seconds < 60) { //seconds
      v_time_final = v_time_in_seconds;
      v_time_type = 'seconds';
    } else if((v_time_in_seconds/60) < 60) { //minutes
      v_time_final = Math.floor((v_time_in_seconds/60));
      v_time_type = 'minutes';
    } else if((v_time_in_seconds/3600) < 24) { //hours
      v_time_final = Math.floor((v_time_in_seconds/3600));
      v_time_type = 'hours';
    } else if((v_time_in_seconds/86400) < 7) { //days
      v_time_final = Math.floor((v_time_in_seconds/86400));
      v_time_type = 'days';
    } else { //weeks
      v_time_final = Math.floor((v_time_in_seconds/604800));
      v_time_type = 'weeks';
    }
    if(v_time_final <= 1) {
      v_time_type = v_time_type.slice(0,-1);
    }
    //alert(v_time_final+' '+v_time_type+' '+type);
    element.html(v_time_final+' '+v_time_type+' '+type);
  }
}

function fn_get_time(v_epochdatetime) {
  var v_newdate = new Date();
  
  if($('header .nav__right-container .nav__sits').attr('href') == '/?login') {
    if(v_epochdatetime > 0) {
      v_epochdatetime = v_epochdatetime-18000+14400;
    }
  }
  
  time_difference = (parseInt(v_epochdatetime) - parseInt(v_newdate.getTime().toString().slice(0,-3)));
  
  return time_difference;
}
////// END FUNCTIONS TO PROCESS TIME //////


////// START FUNCTIONS ADDED TO SITE //////
function function_process_buttons(t) {
  setTimeout(function(){
    if(t.closest("form").find(".sidebar__entry-loading").attr('class').match(/is-hidden/)) {
      var v_element=$('.giveaway__heading');
      $(v_element).each(function() {
        if(t.parent().parent().find('a.giveaway__heading__name').attr('href') != $(this).find('a.giveaway__heading__name').attr('href')) {
          function_check_buttons($(this));
        }
      });
    } else {
      function_process_buttons(t);
    }
  }, 20);
}

function function_check_buttons(v_element) {
  var sd = v_element.parent().parent().find(".giveaway__heading__thin:last-of-type").text();
  var num = sd.match(/[\d\.]+/g);
  if(num != null) {
    num = parseInt(num);
  } else {
    num = 0;
  }
  if(v_element.parent().parent().attr('class').match(/is-faded/)) {
    
  } else if(num > parseInt($(".nav__points").text())) {
    v_element.parent().find(".sidebar__entry-insert").addClass("is-hidden");
    v_element.parent().find(".sidebar__error").removeClass("is-hidden");
  } else {
    v_element.parent().find(".sidebar__error").addClass("is-hidden");
    v_element.parent().find(".sidebar__entry-insert").removeClass("is-hidden");
  }
}
////// END FUNCTIONS ADDED TO SITE //////












/*
 * jQuery Storage API Plugin
 *
 * Copyright (c) 2013 Julien Maurel
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 * https://github.com/julien-maurel/jQuery-Storage-API
 *
 * Version: 1.9.4
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    // Prefix to use with cookie fallback
    var cookie_local_prefix = "ls_";
    var cookie_session_prefix = "ss_";
    // Get items from a storage
    function _get() {
        var storage = this._type, l = arguments.length, s = window[storage], a = arguments, a0 = a[0], vi, ret, tmp;
        if (l < 1) {
            throw new Error('Minimum 1 argument must be given');
        } else if ($.isArray(a0)) {
            // If second argument is an array, return an object with value of storage for each item in this array
            ret = {};
            for (var i in a0) {
                vi = a0[i];
                try {
                    ret[vi] = JSON.parse(s.getItem(vi));
                } catch (e) {
                    ret[vi] = s.getItem(vi);
                }
            }
            return ret;
        } else if (l == 1) {
            // If only 1 argument, return value directly
            try {
                return JSON.parse(s.getItem(a0));
            } catch (e) {
                return s.getItem(a0);
            }
        } else {
            // If more than 1 argument, parse storage to retrieve final value to return it
            // Get first level
            try {
                ret = JSON.parse(s.getItem(a0));
            } catch (e) {
                throw new ReferenceError(a0 + ' is not defined in this storage');
            }
            // Parse next levels
            for (var i = 1; i < l - 1; i++) {
                ret = ret[a[i]];
                if (ret === undefined) {
                    throw new ReferenceError([].slice.call(a, 1, i + 1).join('.') + ' is not defined in this storage');
                }
            }
            // If last argument is an array, return an object with value for each item in this array
            // Else return value normally
            if ($.isArray(a[i])) {
                tmp = ret;
                ret = {};
                for (var j in a[i]) {
                    ret[a[i][j]] = tmp[a[i][j]];
                }
                return ret;
            } else {
                return ret[a[i]];
            }
        }
    }
    // Set items of a storage
    function _set() {
        var storage = this._type, l = arguments.length, s = window[storage], a = arguments, a0 = a[0], a1 = a[1], vi, to_store = isNaN(a1)?{}:[], type, tmp;
        if (l < 1 || !$.isPlainObject(a0) && l < 2) {
            throw new Error('Minimum 2 arguments must be given or first parameter must be an object');
        } else if ($.isPlainObject(a0)) {
            // If first argument is an object, set values of storage for each property of this object
            for (var i in a0) {
                vi = a0[i];
                if (!$.isPlainObject(vi) && !this.alwaysUseJson) {
                    s.setItem(i, vi);
                } else {
                    s.setItem(i, JSON.stringify(vi));
                }
            }
            return a0;
        } else if (l == 2) {
            // If only 2 arguments, set value of storage directly
            if (typeof a1 === 'object' || this.alwaysUseJson) {
                s.setItem(a0, JSON.stringify(a1));
            } else {
                s.setItem(a0, a1);
            }
            return a1;
        } else {
            // If more than 3 arguments, parse storage to retrieve final node and set value
            // Get first level
            try {
                tmp = s.getItem(a0);
                if (tmp != null) {
                    to_store = JSON.parse(tmp);
                }
            } catch (e) {
            }
            tmp = to_store;
            // Parse next levels and set value
            for (var i = 1; i < l - 2; i++) {
                vi = a[i];
                type = isNaN(a[i+1])?"object":"array";
                if (!tmp[vi] || type == "object" && !$.isPlainObject(tmp[vi]) || type=="array" && !$.isArray(tmp[vi])) {
                    if(type=="array") tmp[vi] = [];
                    else tmp[vi] = {};
                }
                tmp = tmp[vi];
            }
            tmp[a[i]] = a[i + 1];
            s.setItem(a0, JSON.stringify(to_store));
            return to_store;
        }
    }
    // Remove items from a storage
    function _remove() {
        var storage = this._type, l = arguments.length, s = window[storage], a = arguments, a0 = a[0], to_store, tmp;
        if (l < 1) {
            throw new Error('Minimum 1 argument must be given');
        } else if ($.isArray(a0)) {
            // If first argument is an array, remove values from storage for each item of this array
            for (var i in a0) {
                s.removeItem(a0[i]);
            }
            return true;
        } else if (l == 1) {
            // If only 2 arguments, remove value from storage directly
            s.removeItem(a0);
            return true;
        } else {
            // If more than 2 arguments, parse storage to retrieve final node and remove value
            // Get first level
            try {
                to_store = tmp = JSON.parse(s.getItem(a0));
            } catch (e) {
                throw new ReferenceError(a0 + ' is not defined in this storage');
            }
            // Parse next levels and remove value
            for (var i = 1; i < l - 1; i++) {
                tmp = tmp[a[i]];
                if (tmp === undefined) {
                    throw new ReferenceError([].slice.call(a, 1, i).join('.') + ' is not defined in this storage');
                }
            }
            // If last argument is an array,remove value for each item in this array
            // Else remove value normally
            if ($.isArray(a[i])) {
                for (var j in a[i]) {
                    delete tmp[a[i][j]];
                }
            } else {
                delete tmp[a[i]];
            }
            s.setItem(a0, JSON.stringify(to_store));
            return true;
        }
    }
    // Remove all items from a storage
    function _removeAll(reinit_ns) {
        var keys = _keys.call(this);
        for (var i in keys) {
            _remove.call(this, keys[i]);
        }
        // Reinitialize all namespace storages
        if (reinit_ns) {
            for (var i in $.namespaceStorages) {
                _createNamespace(i);
            }
        }
    }
    // Check if items of a storage are empty
    function _isEmpty() {
        var l = arguments.length, a = arguments, a0 = a[0];
        if (l == 0) {
            // If no argument, test if storage is empty
            return (_keys.call(this).length == 0);
        } else if ($.isArray(a0)) {
            // If first argument is an array, test each item of this array and return true only if all items are empty
            for (var i = 0; i < a0.length; i++) {
                if (!_isEmpty.call(this, a0[i])) {
                    return false;
                }
            }
            return true;
        } else {
            // If at least 1 argument, try to get value and test it
            try {
                var v = _get.apply(this, arguments);
                // Convert result to an object (if last argument is an array, _get return already an object) and test each item
                if (!$.isArray(a[l - 1])) {
                    v = {'totest': v};
                }
                for (var i in v) {
                    if (!(
                            ($.isPlainObject(v[i]) && $.isEmptyObject(v[i])) ||
                            ($.isArray(v[i]) && !v[i].length) ||
                            (!v[i])
                        )) {
                        return false;
                    }
                }
                return true;
            } catch (e) {
                return true;
            }
        }
    }
    // Check if items of a storage exist
    function _isSet() {
        var l = arguments.length, a = arguments, a0 = a[0];
        if (l < 1) {
            throw new Error('Minimum 1 argument must be given');
        }
        if ($.isArray(a0)) {
            // If first argument is an array, test each item of this array and return true only if all items exist
            for (var i = 0; i < a0.length; i++) {
                if (!_isSet.call(this, a0[i])) {
                    return false;
                }
            }
            return true;
        } else {
            // For other case, try to get value and test it
            try {
                var v = _get.apply(this, arguments);
                // Convert result to an object (if last argument is an array, _get return already an object) and test each item
                if (!$.isArray(a[l - 1])) {
                    v = {'totest': v};
                }
                for (var i in v) {
                    if (!(v[i] !== undefined && v[i] !== null)) {
                        return false;
                    }
                }
                return true;
            } catch (e) {
                return false;
            }
        }
    }
    // Get keys of a storage or of an item of the storage
    function _keys() {
        var storage = this._type, l = arguments.length, s = window[storage], a = arguments, keys = [], o = {};
        // If at least 1 argument, get value from storage to retrieve keys
        // Else, use storage to retrieve keys
        if (l > 0) {
            o = _get.apply(this, a);
        } else {
            o = s;
        }
        if (o && o._cookie) {
            // If storage is a cookie, use js-cookie to retrieve keys
            for (var key in Cookies.get()) {
                if (key != '') {
                    keys.push(key.replace(o._prefix, ''));
                }
            }
        } else {
            for (var i in o) {
                if (o.hasOwnProperty(i)) {
                    keys.push(i);
                }
            }
        }
        return keys;
    }
    // Create new namespace storage
    function _createNamespace(name) {
        if (!name || typeof name != "string") {
            throw new Error('First parameter must be a string');
        }
        if (storage_available) {
            if (!window.localStorage.getItem(name)) {
                window.localStorage.setItem(name, '{}');
            }
            if (!window.sessionStorage.getItem(name)) {
                window.sessionStorage.setItem(name, '{}');
            }
        } else {
            if (!window.localCookieStorage.getItem(name)) {
                window.localCookieStorage.setItem(name, '{}');
            }
            if (!window.sessionCookieStorage.getItem(name)) {
                window.sessionCookieStorage.setItem(name, '{}');
            }
        }
        var ns = {
            localStorage: $.extend({}, $.localStorage, {_ns: name}),
            sessionStorage: $.extend({}, $.sessionStorage, {_ns: name})
        };
        if (typeof Cookies !== 'undefined') {
            if (!window.cookieStorage.getItem(name)) {
                window.cookieStorage.setItem(name, '{}');
            }
            ns.cookieStorage = $.extend({}, $.cookieStorage, {_ns: name});
        }
        $.namespaceStorages[name] = ns;
        return ns;
    }
    // Test if storage is natively available on browser
    function _testStorage(name) {
        var foo = 'jsapi';
        try {
            if (!window[name]) {
                return false;
            }
            window[name].setItem(foo, foo);
            window[name].removeItem(foo);
            return true;
        } catch (e) {
            return false;
        }
    }
    // Check if storages are natively available on browser
    var storage_available = _testStorage('localStorage');
    // Namespace object
    var storage = {
        _type: '',
        _ns: '',
        _callMethod: function (f, a) {
            var p = [], a = Array.prototype.slice.call(a), a0 = a[0];
            if (this._ns) {
                p.push(this._ns);
            }
            if (typeof a0 === 'string' && a0.indexOf('.') !== -1) {
                a.shift();
                [].unshift.apply(a, a0.split('.'));
            }
            [].push.apply(p, a);
            return f.apply(this, p);
        },
        // Define if plugin always use JSON to store values (even to store simple values like string, int...) or not
        alwaysUseJson: false,
        // Get items. If no parameters and storage have a namespace, return all namespace
        get: function () {
            return this._callMethod(_get, arguments);
        },
        // Set items
        set: function () {
            var l = arguments.length, a = arguments, a0 = a[0];
            if (l < 1 || !$.isPlainObject(a0) && l < 2) {
                throw new Error('Minimum 2 arguments must be given or first parameter must be an object');
            }
            // If first argument is an object and storage is a namespace storage, set values individually
            if ($.isPlainObject(a0) && this._ns) {
                for (var i in a0) {
                    this._callMethod(_set, [i, a0[i]]);
                }
                return a0;
            } else {
                var r = this._callMethod(_set, a);
                if (this._ns) {
                    return r[a0.split('.')[0]];
                } else {
                    return r;
                }
            }
        },
        // Delete items
        remove: function () {
            if (arguments.length < 1) {
                throw new Error('Minimum 1 argument must be given');
            }
            return this._callMethod(_remove, arguments);
        },
        // Delete all items
        removeAll: function (reinit_ns) {
            if (this._ns) {
                this._callMethod(_set, [{}]);
                return true;
            } else {
                return this._callMethod(_removeAll, [reinit_ns]);
            }
        },
        // Items empty
        isEmpty: function () {
            return this._callMethod(_isEmpty, arguments);
        },
        // Items exists
        isSet: function () {
            if (arguments.length < 1) {
                throw new Error('Minimum 1 argument must be given');
            }
            return this._callMethod(_isSet, arguments);
        },
        // Get keys of items
        keys: function () {
            return this._callMethod(_keys, arguments);
        }
    };
    // Use js-cookie for compatibility with old browsers and give access to cookieStorage
    if (typeof Cookies !== 'undefined') {
        // sessionStorage is valid for one window/tab. To simulate that with cookie, we set a name for the window and use it for the name of the cookie
        if (!window.name) {
            window.name = Math.floor(Math.random() * 100000000);
        }
        var cookie_storage = {
            _cookie: true,
            _prefix: '',
            _expires: null,
            _path: null,
            _domain: null,
            setItem: function (n, v) {
                Cookies.set(this._prefix + n, v, {expires: this._expires, path: this._path, domain: this._domain});
            },
            getItem: function (n) {
                return Cookies.get(this._prefix + n);
            },
            removeItem: function (n) {
                return Cookies.remove(this._prefix + n, {path: this._path});
            },
            clear: function () {
                for (var key in Cookies.get()) {
                    if (key != '') {
                        if (!this._prefix && key.indexOf(cookie_local_prefix) === -1 && key.indexOf(cookie_session_prefix) === -1 || this._prefix && key.indexOf(this._prefix) === 0) {
                            Cookies.remove(key);
                        }
                    }
                }
            },
            setExpires: function (e) {
                this._expires = e;
                return this;
            },
            setPath: function (p) {
                this._path = p;
                return this;
            },
            setDomain: function (d) {
                this._domain = d;
                return this;
            },
            setConf: function (c) {
                if (c.path) {
                    this._path = c.path;
                }
                if (c.domain) {
                    this._domain = c.domain;
                }
                if (c.expires) {
                    this._expires = c.expires;
                }
                return this;
            },
            setDefaultConf: function () {
                this._path = this._domain = this._expires = null;
            }
        };
        if (!storage_available) {
            window.localCookieStorage = $.extend({}, cookie_storage, {
                _prefix: cookie_local_prefix,
                _expires: 365 * 10
            });
            window.sessionCookieStorage = $.extend({}, cookie_storage, {_prefix: cookie_session_prefix + window.name + '_'});
        }
        window.cookieStorage = $.extend({}, cookie_storage);
        // cookieStorage API
        $.cookieStorage = $.extend({}, storage, {
            _type: 'cookieStorage',
            setExpires: function (e) {
                window.cookieStorage.setExpires(e);
                return this;
            },
            setPath: function (p) {
                window.cookieStorage.setPath(p);
                return this;
            },
            setDomain: function (d) {
                window.cookieStorage.setDomain(d);
                return this;
            },
            setConf: function (c) {
                window.cookieStorage.setConf(c);
                return this;
            },
            setDefaultConf: function () {
                window.cookieStorage.setDefaultConf();
                return this;
            }
        });
    }
    // Get a new API on a namespace
    $.initNamespaceStorage = function (ns) {
        return _createNamespace(ns);
    };
    if (storage_available) {
        // About alwaysUseJson
        // By default, all values are string on html storages and the plugin don't use json to store simple values (strings, int, float...)
        // So by default, if you do storage.setItem('test',2), value in storage will be "2", not 2
        // If you set this property to true, all values set with the plugin will be stored as json to have typed values in any cases
        // localStorage API
        $.localStorage = $.extend({}, storage, {_type: 'localStorage'});
        // sessionStorage API
        $.sessionStorage = $.extend({}, storage, {_type: 'sessionStorage'});
    } else {
        // localStorage API
        $.localStorage = $.extend({}, storage, {_type: 'localCookieStorage'});
        // sessionStorage API
        $.sessionStorage = $.extend({}, storage, {_type: 'sessionCookieStorage'});
    }
    // List of all namespace storage
    $.namespaceStorages = {};
    // Remove all items in all storages
    $.removeAllStorages = function (reinit_ns) {
        $.localStorage.removeAll(reinit_ns);
        $.sessionStorage.removeAll(reinit_ns);
        if ($.cookieStorage) {
            $.cookieStorage.removeAll(reinit_ns);
        }
        if (!reinit_ns) {
            $.namespaceStorages = {};
        }
    }
    $.alwaysUseJsonInStorage = function (value) {
        storage.alwaysUseJson = value;
        $.localStorage.alwaysUseJson = value;
        $.sessionStorage.alwaysUseJson = value;
        if ($.cookieStorage) {
            $.cookieStorage.alwaysUseJson = value;
        }
    }
}));


fn_executestorage();
