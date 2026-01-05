// ==UserScript==
// @name        SteamGifts giveaway link
// @namespace   Alpe
// @include     http://www.steamgifts.com/
// @include     http://www.steamgifts.com/giveaways/search?page=*
// @include     http://www.steamgifts.com/discussion/*
// @include     http://www.steamgifts.com/discussions
// @include     http://www.steamgifts.com/discussions/*
// @include     http://www.steamgifts.com/giveaway/*
// @exclude     http://www.steamgifts.com/giveaway/*/winners
// @exclude     http://www.steamgifts.com/giveaway/*/entries
// @version     1.8.6
// @require     http://code.jquery.com/jquery-2.1.4.min.js
// @grant       GM_xmlhttpRequest
// @description:en Search for giveaway links on the forum.
// @run-at      document-end
// @description Search for giveaway links on the forum.
// @downloadURL https://update.greasyfork.org/scripts/12287/SteamGifts%20giveaway%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/12287/SteamGifts%20giveaway%20link.meta.js
// ==/UserScript==

var maxstorage = 200;
var maxstorageforum = 2000;
var autosave = 0;
var addtext = true;
var mouseover = false;
var timer = false;


var executed = false;
var needsave = 0;
var counttest = 0;
if(timer){ console.time('SGGAL'); }

function log(text) {
	if(window.console && console.log) {
		console.log("SG GA Link: " + text);
	}
}

if (maxstorage===0){
  if (!!localStorage.sggal_nonamelink){ delete localStorage.sggal_nonamelink; log("sggal_nonamelink removed"); }
  if (!!localStorage.sggal_nonametitle){ delete localStorage.sggal_nonametitle; log("sggal_nonametitle removed"); }
}
if (maxstorageforum===0){
  if (!!localStorage.sggal_gainsidelink){ delete localStorage.sggal_gainsidelink; log("sggal_gainsidelink removed"); }
  if (!!localStorage.sggal_gainsidecount){ delete localStorage.sggal_gainsidecount; log("sggal_gainsidecount removed"); }
}

function savedata(){
  if(nonamelink.length>maxstorage && needsave === 0){needsave++;}
  if(needsave>0 && maxstorage>0){
    if (nonamelink.length > maxstorage){
      log("Removing " + (nonamelink.length-maxstorage) + " entries");
      nonamelink.splice(0,nonamelink.length-maxstorage);
      nonametitle.splice(0,nonametitle.length-maxstorage);
    }
    localStorage.sggal_nonamelink = JSON.stringify(nonamelink);
    localStorage.sggal_nonametitle = JSON.stringify(nonametitle);
    needsave = 0;
    log("Data saved (" + nonamelink.length + "/" + maxstorage + ")");
  } else log("No need to save");
}

function gettitle(url, x) {
  gabox = document.getElementById('GAL');
  if (url.indexOf('sgtools.info/giveaways/') === -1){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() { 
      if (xhr.readyState == 4) {
        var title = (/<title>(.*?)<\/title>/m).exec(xhr.responseText)[1];
        nonamelink.push(url.split("/giveaway/")[1].substring(0,5));
        nonametitle.push(title);
        log(url + " = " + nonametitle[nonametitle.length-1]);
        markthistitle(url, nonametitle.length-1);
        needsave++;
        counttest++;
        gabox.children[0].innerHTML = gabox.children[0].innerHTML.split(" [")[0] + " [" + counttest + "/" + x + "]";
        if(counttest===x){ savedata(); if(timer){ console.timeEnd('pageLoad'); } } else if(autosave>0 && maxstorage>0 && needsave >= autosave){ savedata(); }
      }
    };
    xhr.send();
  } else {
    GM_xmlhttpRequest({
      method:  'GET',
      url:     url,
      onload:  function(req) {
        var title = $('.featured__heading__medium:first', req.response)[0].innerHTML;
        nonamelink.push(url.split("/giveaways/")[1].replace(/-/g,""));
        nonametitle.push(title);
        log(url + " = " + nonametitle[nonametitle.length-1]);
        markthistitle(url, nonametitle.length-1);
        needsave++;
        counttest++;
        gabox.children[0].innerHTML = gabox.children[0].innerHTML.split(" [")[0] + " [" + counttest + "/" + x + "]";
        if(counttest===x){ savedata(); if(timer){ console.timeEnd('pageLoad'); } } else if(autosave>0 && maxstorage>0 && needsave >= autosave){ savedata(); }
      },
    });
  }
}

function markthistitle(url, index){
  elementmark = $('a[href$="' + url + '"]');
  if (!!addtext || !!mouseover){
    for(var idx=0; idx<elementmark.length; idx++){
      if (elementmark[idx].text.indexOf('[[?]]') !== -1){ elementmark[idx].text = elementmark[idx].text.split(' [[?]]')[0]; }
      if (elementmark[idx].text.toLowerCase().replace(/[^A-Za-z0-9]/g, '').indexOf(nonametitle[index].toLowerCase().replace(/[^A-Za-z0-9]/g, '')) === -1){
        if (!!addtext){ elementmark[idx].text = elementmark[idx].text + " [[" + nonametitle[index] + "]]"; }
        if (!!mouseover){ elementmark[idx].title = nonametitle[index]; }
      }
    }
  }
}

function detect() {
  gabox = document.getElementById('GAL');
  if (!executed) {
    var scancheck = gabox.children[0].innerHTML.indexOf('[+');
    if (scancheck !== -1){
      var hiddenga = 0;
      var count = 0;
      var links = $('a[href*="/giveaway/"], a[href*="sgtools.info/giveaways/"]');
      for(var i=0; i<links.length; i++) {
        if (links[i].href.indexOf('sgtools.info/giveaways/') === -1){
          if (links[i].href.split("/giveaway/")[1].substring(5) === "/"){
            if(nonamelink.indexOf(links[i].href.split("/giveaway/")[1].substring(0,5)) === -1){
              count++;
            }
          }
        } else {
          if(nonamelink.indexOf(links[i].href.split("/giveaways/")[1]) === -1){
            count++;
          }
        }
      }
      if (count>0 && timer){ console.time('pageLoad'); }
      for(var i=0; i<links.length; i++) {
        hiddenga++;
        if (!!addtext || !!mouseover){
          if (links[i].href.indexOf('sgtools.info/giveaways/') !== -1 || links[i].href.split("/giveaway/")[1].substring(5) === "/"){
            if(links[i].href.indexOf('sgtools.info/giveaways/') !== -1 || nonamelink.indexOf(links[i].href.split("/giveaway/")[1].substring(0,5)) === -1){
              gettitle(links[i].href, count);
            }
          }
        }
      }
      gabox.children[0].innerHTML = gabox.children[0].innerHTML.split(' [')[0];
    }
    gabox.setAttribute("exec", 0);
    executed = true;
    if (scancheck === -1){ detect(); }
  } else {
    element = document.querySelectorAll('*[style="color: red; font-weight: bold; background-color: yellow;"], *[style="color: red; font-weight: bold; background-color: aqua;"], *[style="color: red; font-weight: bold; background-color: Lime;"]');
    exec = parseInt(gabox.getAttribute("exec"));
    if (element.length > 0){
      if (gabox.children[0].innerHTML.indexOf("[") === -1){
        gabox.children[0].innerHTML += " [";
      }
      if (exec < element.length){
        element[exec].scrollIntoView();
        window.scrollByLines(-3);
        gabox.setAttribute("exec", exec+1);
        gabox.children[0].innerHTML = gabox.children[0].innerHTML.split("[")[0] +"[" + (exec + 1) + "]";
      } else {
        window.scrollTo(0,0);
        gabox.setAttribute("exec", 0);
        gabox.children[0].innerHTML = gabox.children[0].innerHTML.split(" [")[0];
      }
    }
  }
}

function getgas(url, y, x){
  gabox = document.getElementById('GAL');
  index = gainsidelink.indexOf(url.split('/discussion/')[1]);
  if(index === -1){
    var xhr = new XMLHttpRequest();
    xhr.responseType='document';
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() { 
      if (xhr.readyState == 4) {
        countga = $('a[href*="/giveaway/"], a[href*="sgtools.info/giveaways/"]', xhr.response).length;
        countpuz = $('a[href*="itstoohard.com/puzzle/"]', xhr.response).length;
        gainside = countga + "/" + countpuz;
        log(url + " = " + gainside + " GA/Puzzle");
        if ($('.table__column__heading')[y].text.indexOf('(((?)))') !== -1){ $('.table__column__heading')[y].text = $('.table__column__heading')[y].text.split(' (((?)))')[0]; }
        if (countga>0 || countpuz>0){
          $('.table__column__heading')[y].style.textDecoration = "underline";
          $('.table__column__heading')[y].style.color = "red";
          $('.table__column__heading')[y].style.fontWeight="bold";
          if (countga>0 && countpuz>0){
            $('.table__column__heading')[y].style.backgroundColor = "lime";
            $('.table__column__heading')[y].text = $('.table__column__heading')[y].text + " ((" + countga + " GA and " + countpuz + " Puzzle inside))";
          } else if (countga>0){
            $('.table__column__heading')[y].style.backgroundColor = "yellow";
            $('.table__column__heading')[y].text = $('.table__column__heading')[y].text + " ((" + countga + " GA inside))";
          } else {
            $('.table__column__heading')[y].style.backgroundColor = "aqua";
            $('.table__column__heading')[y].text = $('.table__column__heading')[y].text + " ((" + countpuz + " Puzzle inside))";
          }
        }
        gainsidelink.push(url.split('/discussion/')[1]);
        gainsidecount.push(gainside);
        counttest++;
        gabox.children[0].innerHTML = "Searching GA [" + counttest + "/" + x + "]";
        if(counttest===x){
          if(maxstorageforum>0){ if (gainsidelink.length > maxstorageforum){ log("Removing " + (gainsidelink.length-maxstorageforum) + " entries"); gainsidelink.splice(0,gainsidelink.length-maxstorageforum); gainsidecount.splice(0,gainsidecount.length-maxstorageforum); } }
          localStorage.sggal_gainsidelink = JSON.stringify(gainsidelink); localStorage.sggal_gainsidecount = JSON.stringify(gainsidecount); log("Data saved (" + gainsidelink.length + "/" + maxstorageforum + ")");
          gabox.children[0].innerHTML = "Saved " + x + " GA (total: " + gainsidelink.length + ")";
          if(timer){ console.timeEnd('pageLoad'); }
        }
      }
    };
    xhr.send();
  }
}

function detect2(){
  var scancheck = gabox.children[0].innerHTML.indexOf('[+');
  gabox = document.getElementById('GAL');
  element = $('.table__column__heading');
  if (!executed && scancheck !== -1) {
    var count = parseInt(gabox.children[0].innerHTML.split('[+')[1].split(']')[0]);
    if (count>0){
      gabox.children[0].innerHTML = "Searching GA";
      if(timer){ console.time('pageLoad'); }
      for(var i=0; i<element.length; i++){
        getgas(element[i].href, i, count);
      }
    } else gabox.children[0].innerHTML = "Searched GA";
    counttest = 0;
    executed = true;
  } else {
    if(typeof(confirmation) === 'undefined'){
      gabox.children[0].innerHTML = "Remove cache for this page?";
      confirmation = true;
    } else {
      indexes = [];
      for(var i=0; i<element.length; i++){
        index = gainsidelink.indexOf(element[i].href.split('/discussion/')[1]);
        if (index !== -1){
          if (parseInt(gainsidecount[index].split('/')[0]) == 0 && parseInt(gainsidecount[index].split('/')[1]) == 0){
            $('.table__column__heading')[i].text = $('.table__column__heading')[i].text + " (((?)))";
            indexes.push(index);
          } else {
            test = $('.table__column__heading')[i].text.split('((');
            $('.table__column__heading')[i].text = test[test.length-2] + " (((?)))";
            $('.table__column__heading')[i].removeAttribute('style');
            indexes.push(index);
          }
        }
      }
      if (indexes.length>0){
        indexes = indexes.sort(function (a,b) { return a-b; }).reverse();
        for(var i=0; i<indexes.length; i++){
          gainsidelink.splice(indexes[i],1);
          gainsidecount.splice(indexes[i],1);
          if(i===indexes.length-1){
            localStorage.sggal_gainsidelink = JSON.stringify(gainsidelink); localStorage.sggal_gainsidecount = JSON.stringify(gainsidecount); log("Data saved");
            if (maxstorageforum >= 100){ gabox.children[0].innerHTML = "Need rescan [+" + indexes.length + "]"; } else { gabox.children[0].innerHTML = "Need rescan [+100]" }
          }
        }
      }
      executed = false;
      delete confirmation;
    }
  }
}

if (document.title === "Page not found." && window.location.pathname.substr(1,9) == "giveaway/" && document.URL.length === 40 && document.URL.slice(-1) !== "/"){ window.location = document.URL + "/"; }

if (window.location.pathname === "/" || window.location.pathname.substr(1,9) === "giveaways"){
  $('div.page__heading__breadcrumbs:last')[0].outerHTML +='<div class="page__heading__button page__heading__button--green" id="GAL"><a>Search GA [+5]</a></div>';
} else { $(".nav__left-container").append('<div class="nav__button-container" id="GAL"><a class="nav__button">Search GA [+5]</a></div>'); }

a = document.getElementById('GAL');
if(window.location.pathname.substr(1,11) == "discussion/" || window.location.pathname.substr(1,9) == "giveaway/"){
  a.children[0].onclick = function(){detect();}
} else {
  a.children[0].onclick = function(){detect2();}
}

if(window.location.pathname.substr(1,11) == "discussion/" || window.location.pathname.substr(1,9) == "giveaway/"){
  if (!!localStorage.sggal_nonamelink && !!localStorage.sggal_nonametitle){ var nonamelink = JSON.parse(localStorage.sggal_nonamelink); var nonametitle = JSON.parse(localStorage.sggal_nonametitle);
    if(nonamelink.length !== nonametitle.length){ localStorage.removeItem('nonamelink'); localStorage.removeItem('nonametitle'); var nonamelink = []; var nonametitle = []; log("Data error. Removing."); } else log("Data loaded");
  } else if (!localStorage.sggal_nonamelink && !localStorage.sggal_nonametitle){ var nonamelink = []; var nonametitle = [];
  } else { localStorage.removeItem('nonamelink'); localStorage.removeItem('nonametitle'); var nonamelink = []; var nonametitle = []; log("Data error. Removing."); }
  gabox = document.getElementById('GAL');
  var hiddenga = 0;
  var count = 0;
  var puzcount = 0;
  if (window.location.pathname.substr(1,11) == "discussion/"){ var links = $('a[href*="/giveaway/"]:not(a[href$=".png"], a[href$=".jpg"]), a[href*="itstoohard.com/puzzle/"], a[href*="sgtools.info/giveaways/"]:not([href$="/manage"])');
  } else { var links = $('a[href*="/giveaway/"]:not(a[href$=".png"], a[href$=".jpg"], [href*="' + window.location.pathname.split('/')[2] + '"]), a[href*="itstoohard.com/puzzle/"], a[href*="sgtools.info/giveaways/"]:not([href$="/manage"])'); }
  for(var i=0; i<links.length; i++) {
    links[i].style.color = "red";
    links[i].style.fontWeight="bold";
    if (links[i].href.indexOf('itstoohard.com/puzzle/') === -1 && links[i].href.indexOf('sgtools.info/giveaways/') === -1){
      hiddenga++;
      links[i].style.backgroundColor = "yellow";
      if(links[i].text.indexOf(links[i].href) === -1){ links[i].text = links[i].text + " ((GA " + hiddenga + "))"; } else { links[i].text = links[i].text.replace(links[i].href,' ') + "((GA " + hiddenga + "))"; }
      if (!!addtext || !!mouseover){
        if (links[i].href.split("/giveaway/")[1].substring(5) === "/"){
          if(maxstorage !== 0 && nonamelink.indexOf(links[i].href.split("/giveaway/")[1].substring(0,5)) !== -1){
            markthistitle(links[i].href, nonamelink.indexOf(links[i].href.split("/giveaway/")[1].substring(0,5)));
          } else {
            count++;
            if (!!addtext){ links[i].text = links[i].text + " [[?]]"; }
            if (!!mouseover){ links[i].title = "?"; }
          }
        } else {
          if (links[i].text.toLowerCase().replace(/[^A-Za-z0-9]/g, '').indexOf(links[i].href.split("/giveaway/")[1].substring(6).split('/')[0].replace(/-/g,'')) === -1){
            //////if (localStorage.games.toLowerCase().replace(/[^A-Za-z0-9]/g, '').indexOf(links[i].href.split("/giveaway/")[1].substring(6).split('/')[0].replace(/-/g,'')) !== -1){ links[i].style.color = "blue"; }
            title = links[i].href.split("/giveaway/")[1].substring(6).split('/')[0].replace(/-/g,' ').replace(/\b./g, function(m){ return m.toUpperCase(); });
            if (!!addtext){ links[i].text = links[i].text + " [[" + title + "?]]"; }
            if (!!mouseover){ links[i].title = title+"?"; }
          }
        }
      }
      if (links[i].href.length === 40 && links[i].href.slice(-1) !== "/"){ links[i].href = links[i].href + "/"; } ///////// fix GA link without /
    } else if (links[i].href.indexOf('sgtools.info/giveaways/') !== -1){
      hiddenga++;
      if(links[i].text.indexOf(links[i].href) === -1){ links[i].text = links[i].text + " ((GA " + hiddenga + "))"; } else { links[i].text = links[i].text.replace(links[i].href,' ') + "((GA " + hiddenga + "))"; }
      if (!!addtext || !!mouseover){
        if(maxstorage !== 0 && nonamelink.indexOf(links[i].href.split("/giveaways/")[1].replace(/-/g,"")) !== -1){
          markthistitle(links[i].href, nonamelink.indexOf(links[i].href.split("/giveaways/")[1].replace(/-/g,"")));
        } else {
          count++;
          if (!!addtext){ links[i].text = links[i].text + " [[?]]"; }
          if (!!mouseover){ links[i].title = "?"; }
        }
      }
      links[i].style.backgroundColor = "Lime";
    } else {
      puzcount++;
      links[i].style.backgroundColor = "aqua";
      links[i].text = links[i].text + " ((Puzzle " + puzcount + "))";
    }
  }
  if (hiddenga>0 && puzcount>0){
    gabox.children[0].innerHTML = hiddenga  + " GA and " + puzcount + " Puzzle";
  } else if (hiddenga>0){
    gabox.children[0].innerHTML = hiddenga  + " GA";
  } else if (puzcount>0){
    gabox.children[0].innerHTML = puzcount + " Puzzle";
  } else {
    gabox.children[0].innerHTML = "<img src=\'https://static-cdn.jtvnw.net/emoticons/v1/25/1.0\' align='left'>";
    gabox.children[0].onclick = function(){
      if (executed === false){
        bg = $('.page__outer-wrap')[0].style;
        bg.backgroundAttachment = "fixed";
        bg.backgroundPosition = "left center";
        bg.backgroundRepeat = "no-repeat";
        bg.backgroundSize = 'contain';
        gabox.children[0].innerHTML = "<img src=\'http://goo.gl/F7s4bA\' align='left' height=28><audio autoplay='true' loop='true'><source src='https://goo.gl/iw6acF' type='audio/ogg' /><source src='https://goo.gl/SXrAie' type='audio/mpeg' /></audio>";
        executed = 0;
      } else if(executed === 0) {
        var s = document.createElement('script');s.setAttribute('src', 'http://www.themesltd.com/tumblr/cursors/mouse-cursors/cursors.js?cat=mouse-cursors&theme=nyan_cat&path=random');document.body.appendChild(s);
        executed++;
      } else if (executed ===1){
        bg.backgroundColor = "#99D9EA";
        bg.backgroundImage = "url('http://goo.gl/8mt2uj')";
        executed++;
      }
    }
  }
  if (count !== 0){
    gabox.children[0].innerHTML = gabox.children[0].innerHTML + " [+" + count + "]";
  }
  ////////////////////////////////////////////////////////////////////////////////////////// TEST KEY //////////////////////////////////////////////
  if(timer){ console.time('Key search'); }
  coments = $('.comment__display-state');
  keys = [];
  for(ci=0; ci<coments.length; ci++){
    keytext = coments[ci].textContent.replace(/(\t|\r\n|\n|\r)/gm, ' ').replace(/(\b(https?):\/\/[-A-Z0-9+&amp;@#\/%?=~_|!:,.;]*[-A-Z0-9+&amp;@#\/%=~_|])/ig, '');
    //key = (keytext.replace(/\s/g,'').match(/[^-\s]{5}[-|+]/g)||[]).concat(keytext.replace(/\s/g,'').match(/[-|+][^-\s]{5}/g)||[]);
    key = (keytext.replace(/\s/g,'').match(/[^-\s]{5}[-|+]/g)||[]).concat(keytext.replace(/\s/g,'').match(/[-|+][^-\s\(\)]{5}/g)||[]).concat(keytext.match(/\s[^-\sa-z\(\)]{5}\s/g)||[]);
    if (key.length >= 3){
      coments[ci].style.backgroundColor = "rgb(255,250,250) ";
      key = keytext.match(/[^-\s]{5,11}[-|+]{1,10}[^-\s]{5,11}[-|+]{1,10}[^-\s]{5,11}/g);
      keyunfiltered = key;
      if (key !== null){
        if(!!keytext.match(/[\W\S]{1}[\s]{0,1}={1,2}[\s]{0,1}[A-Z1-9]{1}/g)){ //////////////////////////////////////////////////////////////// checa se tem X=Y no texto
          mapObj2 = keytext.match(/[\W\S]{1,2}[\s]{0,1}={1,2}[\s]{0,1}[A-Z1-9]{1,2}\b/g).join('||').replace(/\s/g,'').replace("==","=").split('||');
          if (mapObj2.length>1){ ////////////////////////////////////////////////////// remove duplicates
            var map = {};
            var map2 = [];
            for (var i = 0; i < mapObj2.length; i++) {
              var element = mapObj2.join('||').replace(/=[^\|\|]*/g, '').split('||')[i];
              if (!map[element]) { map[element] = [i]; } else { map[element].push(i); }
            }
            for (var element in map) {
              if (map[element].length === 1) {
                delete map[element];
              } else map2.push(map[element].join(','));
            }
            if (map2.length > 0){ map2 = map2.join(',').split(',').sort().reverse(); }
            for (var a=0; a<map2.length; a++){
              mapObj2.splice(map2[a],1);
            }
          } ////////////////////////////////////////////////////// remove duplicates
          key = key.join('||');
          for (var a=0; a<mapObj2.length; a++){
            if (mapObj2[a].split('=')[0].length > mapObj2[a].split('=')[1].length){
              if (mapObj2[a].split('=')[0].match(/./g)[0] !== mapObj2[a].split('=')[0].match(/./g)[1]){ trim = mapObj2[a].split('=')[0].length-mapObj2[a].split('=')[1].length; mapObj2[a] = mapObj2[a].substring(trim);
              } else mapObj2[a] = "";
            } else if (mapObj2[a].split('=')[0].length < mapObj2[a].split('=')[1].length){ trim = mapObj2[a].split('=')[1].length-mapObj2[a].split('=')[0].length; mapObj2[a] = mapObj2[a].substring(0, mapObj2[a].length - trim); }
            if(mapObj2[a] !== ""){
              limit=0;
              while(key.indexOf(mapObj2[a].split('=')[0]) !== -1 && limit<Math.min(key.length,100)){
                key = key.substr(0, key.indexOf(mapObj2[a].split('=')[0])) + mapObj2[a].split('=')[1] + key.substr(key.indexOf(mapObj2[a].split('=')[0])+mapObj2[a].split('=')[0].length);
                limit++;
              }
            }
          }
          key = key.split('||');
        } //////////////////////////////////////////////////////////////////////////////////////////////////// checa se tem X=Y no texto
        var mapObj = {ºoneª:"1",ºtwoª:"2",ºthreeª:"3",ºfourª:"4",ºfiveª:"5",ºsixª:"6",ºsevenª:"7",ºeightª:"8",ºnineª:"9",one:"1",two:"2",three:"3",four:"4",five:"5",six:"6",seven:"7",eight:"8",nine:"9",zero:"0",П:"G",Л:"K",Ч:"X",Ш:"I",У:"E",Д:"L",О:"J",Т:"N",А:"F",Ф:"A",Я:"Z",Ь:"M",Р:"H",М:"V",Й:"Q",Ц:"W",Е:"T",С:"C",З:"P",В:"D",К:"R"};
        var re = new RegExp(Object.keys(mapObj).join("|"),"gi");
        key = key.join('||');
        if (!!key.match(/(\[|\()[a-zA-Z]{3,5}(\]|\))/) || !!key.match(re)){ key = key.replace(/(\[|\()/g,'º').replace(/(\]|\))/g,'ª').replace(re, function(matched){ return mapObj[matched.toLowerCase()]; }).replace(/º/g,'[').replace(/ª/g,']'); }
        //key = key.replace(/"/g,''); /////////////////////////////// remove "
        for(abc=0, keym = key.match(/(\[|\()[A-Z0-9](\]|\))/gi); keym !== null && abc<keym.length; abc++){ key = key.replace(keym[abc],keym[abc].substr(1,1)); } //////////////// remove single characters inside brackets
        key = key.split('||');
        keys.push(key); coments[ci].style.backgroundColor = "white";
        for(var a=0; a<key.length; a++){
          if(key[a].length === 17){
            if (new RegExp("[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}","i").test(key[a]) === true){
              coments[ci].innerHTML = coments[ci].innerHTML + '<br>((( ' + key[a] + ' )))';
            } else {
              coments[ci].innerHTML = coments[ci].innerHTML + '<br>-(( ' + key[a] + ' ))';
            }
          } else coments[ci].innerHTML = coments[ci].innerHTML + '<br>--( ' + key[a] + ' )';
        }
      }
    }
    if (ci === coments.length-1 && keys.length>0){ console.log(keys.join(',').split(',').reverse()); } //setTimeout(function(){ alert(keys.join(',').replace(/,/g,'\n')); },500);
  }
  if(timer){ console.timeEnd('Key search'); }
  ////////////////////////////////////////////////////////////////////////////////////////// TEST KEY //////////////////////////////////////////////
} else if(maxstorageforum>0 && (window.location.pathname.substr(1,11) == "discussions" || window.location.pathname === "/" || window.location.pathname.substr(1,9) === "giveaways")){
  if (!!localStorage.sggal_gainsidelink && !!localStorage.sggal_gainsidecount){ var gainsidelink = JSON.parse(localStorage.sggal_gainsidelink); var gainsidecount = JSON.parse(localStorage.sggal_gainsidecount);
    if(gainsidelink.length !== gainsidecount.length){ localStorage.removeItem('gainsidelink'); localStorage.removeItem('gainsidecount'); var gainsidelink = []; var gainsidecount = []; log("Data error. Removing."); } else log("Data loaded");
  } else if (!localStorage.sggal_gainsidelink && !localStorage.sggal_gainsidecount){ var gainsidelink = []; var gainsidecount = [];
  } else { localStorage.removeItem('gainsidelink'); localStorage.removeItem('gainsidecount'); var gainsidelink = []; var gainsidecount = []; log("Data error. Removing."); }
  gabox = document.getElementById('GAL');
  var count=0;
  element = $('.table__column__heading');
  for(var i=0; i<element.length; i++){
    index = gainsidelink.indexOf(element[i].href.split('/discussion/')[1]);
    if(index !== -1){
      countga = parseInt(gainsidecount[index].split('/')[0]);
      countpuz = parseInt(gainsidecount[index].split('/')[1]);
      if (countga>0 || countpuz>0){
        $('.table__column__heading')[i].style.color = "red";
        $('.table__column__heading')[i].style.fontWeight="bold";
        if (countga>0 && countpuz>0){
          $('.table__column__heading')[i].style.backgroundColor = "lime";
          $('.table__column__heading')[i].text = $('.table__column__heading')[i].text + " ((" + countga + " GA and " + countpuz + " Puzzle inside))";
        } else if (countga>0){
          $('.table__column__heading')[i].style.backgroundColor = "yellow";
          $('.table__column__heading')[i].text = $('.table__column__heading')[i].text + " ((" + countga + " GA inside))";
        } else {
          $('.table__column__heading')[i].style.backgroundColor = "aqua";
          $('.table__column__heading')[i].text = $('.table__column__heading')[i].text + " ((" + countpuz + " Puzzle inside))";
        }
      }
    } else {
      count++;
      $('.table__column__heading')[i].text = $('.table__column__heading')[i].text + " (((?)))";
    }
  }
  if (count>0){ gabox.children[0].innerHTML = "Search GA [+" + count + "]"; } else { gabox.children[0].innerHTML = "Searched GA"; }
}

if(timer){ console.timeEnd('SGGAL'); }