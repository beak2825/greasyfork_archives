// ==UserScript==
// @name							Webtoon-recent-list-expander.user.js
// @description				Allow more recent webtoon to appear on sidebar
// @version						1
// @grant							none
// @author						JC WebInfo
// @include						/^https?://www\.webtoons\.com/.*$/
// @namespace					fr.jcwebinfo
// @license						CC-BY-SA-1.0
// @contributionURL		https://www.paypal.com/donate/?cmd=_donations&business=0632990852@orange.fr&item_name=Greasy+Fork+donation
// @downloadURL https://update.greasyfork.org/scripts/450222/Webtoon-recent-list-expanderuserjs.user.js
// @updateURL https://update.greasyfork.org/scripts/450222/Webtoon-recent-list-expanderuserjs.meta.js
// ==/UserScript==

var timer = null;
var dev = false;
var localConsole = {
	'log': function(){
		if(dev)
			console.log.apply(console, arguments);
	},
	'error': function(){
		if(dev)
			console.error.apply(console, arguments);
	}
};
localConsole.log("install script");
var maxWebToons = 40;	//max WebToon allowed by this features to avoid corrupted data
var urlViewer = 'https://www.webtoons.com/fr/{type}/{name}/ep{ep-num}/viewer?title_no={title_no}&episode_no={ep-num}';
var regexInWebtoon = /https?:\/\/www\.webtoons\.com\/([^\/]+)\/([^\/]+).*\/viewer\?title_no=([0-9]+)&episode_no=([0-9]+).*/;
var lastUpdate = null;
var isWebtoon = function(){
  return document.location.href.match(regexInWebtoon)!=null;
};
var AddWebtoonInRecent = function(){
	localConsole.log('AddWebtoonInRecent');
  var data = document.location.href.replace(regexInWebtoon, '$1:$2:$3:$4').split(':');
  var date = new Date();
  var obj = {
    "titleNo": parseInt(data[2]),
    "episodeNo": parseInt(data[3]),
    "episodeSeq": parseInt(data[3]),
    "scrollPosition": window.scrollY,
    "language": data[0],
    "isChallenge": false,
    "date": (
      date.getFullYear() +
      (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1) +
      (date.getDate() < 10 ? '0' : '') + date.getDate() +
      (date.getHours() < 10 ? '0' : '') + date.getHours() +
      (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() +
      (date.getSeconds() < 10 ? '0' : '') + date.getSeconds()
    ),
    "languageCode": null,
    "genreCode": data[1].toUpperCase(),
    "teamVersion": -1,
    'name': document.head.querySelector('meta[property="og:title"]').content.split(' - ')[0],
    'img': document.head.querySelector('meta[property="og:image"]').content,
  };
  var recents = JSON.parse(localStorage.getItem('recentWebtoon'));
  var found = false;
  for(var i=0; i< recents.length;i++){
    if(recents[i].titleNo==obj.titleNo){
      	recents[i] = obj;
      	found = true;
      	recents.sort(function(a, b){
          return parseInt(b.date)-parseInt(a.date);
        });
      break;
    }
  }
  if(!found){
    recents.splice(0, 0, obj);
    recents = recents.slice(0, maxWebToons);
  }

	localConsole.log('AddWebtoonInRecent update json');
  localStorage.setItem('recentWebtoon', JSON.stringify(recents));
};
var buildLi = function(recent){
  var li = document.createElement('li');
  li.innerHTML = (
		'<'+'a href="" title="' + (recent.hasOwnProperty('name') ? recent.name : 'Nameless WebToon') + '" class="detail_infoNPI=a:list,i=' + recent.titleNo + ',g:"'+'>'+
		'<'+'span class="thmb" data-title-unsuitable-for-children="false" data-title-unsuitable-for-children-skin="harmful_black_skin2"'+'>'+
		(
		  recent.hasOwnProperty('img')
		  ?
		  ('<'+'img src="'+recent.img+'" width="70" height="74"'+'>')
		  :
		  ''
		)+
		'<'+'/span'+'>'+
		'<'+'span class="info"'+'>'+
		'<'+'span class="subj"'+'>'+'<'+'/span'+'>'+
		'<'+'em class="episode"'+'>'+'<'+'/em'+'>'+
		'<'+'/span'+'>'+
		'<'+'/a'+'>'
  );
  li.querySelector('a').setAttribute('href',
     'https://www.webtoons.com/fr/' + recent.genreCode.toLowerCase() + '/a/ep' + recent.episodeNo + '/viewer?title_no=' + recent.titleNo + '&episode_no=' + recent.episodeNo
  );
  li.querySelector('a').setAttribute('title', recent.hasOwnProperty('name') ? recent.name : 'Nameless WebToon');
  li.querySelector('span.info > span.subj').textContent = (recent.hasOwnProperty('name') ? recent.name : 'Nameless WebToon') ;
  li.querySelector('span.info > em.episode').textContent =  '#' + recent.episodeNo;
  return li;
};
var saveRecents = function(){
	localConsole.log('saveRecents');
  if(isWebtoon())
    AddWebtoonInRecent();
};
var updateRecent = function(){
	localConsole.log("get localStorage");
	if(!localStorage.hasOwnProperty("recentWebtoon"))
		return false;
  localConsole.log("parse json");
  var recents = JSON.parse(localStorage.getItem('recentWebtoon'));
  localConsole.log("get ul._recentList");
  var parent = document.querySelector('ul._recentList');
	var now = (new Date()).getTime() / 1000; //timestamp in seconds
  if(parent!==null && (lastUpdate==null || (now-lastUpdate) > 5)){
		lastUpdate = now;
	  parent.style.overflowY = 'auto';
	  localConsole.log("rebuild recent list:", recents);
	  parent.innerHTML = '';
	  recents.forEach(function(recent){
	    try{
	    	var li = buildLi(recent);
	      localConsole.log("add li");
	      parent.appendChild(li);
	    }
	    catch(e){
	      localConsole.log("error:", e);
	    }
	  });
    return false;
  }
	try{
		saveRecents();
	}
	catch(e){
		localConsole.error("error:", e);
	}
  localConsole.log("end of tasks");
  //clearInterval(timer);
	window.onbeforeunload = document.body.onbeforeunload = function(){};
};
timer = setInterval(updateRecent, 200);
