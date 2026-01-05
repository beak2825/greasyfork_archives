// ==UserScript==
// @name        IMDB Tweaks
// @namespace   Alpe
// @include     http://www.imdb.com/*
// @include     https://www.imdb.com/*
// @version     4.3
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @connect     imdb.com
// @run-at      document-end
// @description Some tweaks for IMDB
// @downloadURL https://update.greasyfork.org/scripts/29846/IMDB%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/29846/IMDB%20Tweaks.meta.js
// ==/UserScript==

var uid = document.getElementById("nbusername");
var uid = (uid ? uid.href.match(/\/(ur\d{8})\//) : false);
var uid = (uid ? uid[1] : "ur00000000");

function savedata(a,b){
  GM_setValue(a, JSON.stringify(b));
}

function loaddata(a,b){
  var val = GM_getValue(a,null);
  return (val !== null ? JSON.parse(val) : (b !== undefined ? b : false));
}

function clearoldentries(){
    console.log("Cleaning database.");
    var count = 0;
    var e = GM_listValues();
    for (var i=0; i<e.length; i++){
        if(Date.now() - loaddata(e[i]).time >= 24*60*60*1000){
            GM_deleteValue(e[i]);
            count++;
        }
    }
    console.log("Removed " + count + " entries older than 24h.");
}

function processpage(id, actor, req){
    checklist(id);
    var extras = [];
    if (actor){
        var bio = req.getElementById('name-bio-text');
        if (bio){
            var bio = bio.innerText.replace('See full bio »','').trim();
        }
        var photo = req.getElementById('name-poster');
        if (photo && photo["src"].indexOf('/nopicture/')===-1){
            var photo = photo["src"].replace(/_V1_.*/,"").split('/images/M/')[1];
        }
        var birth = req.getElementById('name-born-info');
        if (birth){
            var birthday = birth.querySelector('time[datetime]');
            if (birthday){
                var birthday = birthday.getAttribute('datetime');
                var dead = req.getElementById('name-death-info');
                if (dead){
                    var dead = dead.querySelector('time[itemprop=deathDate]').getAttribute('datetime');
                }
                if (birthday.match(/\b0\b/) === null){
                    var birthday = new Date(birthday);
                    extras.push(birthday.toLocaleDateString('en-US', {timeZone: 'UTC', year: 'numeric', month: 'short', day: 'numeric'}) + (dead ? ' - ' + dead.split('-')[0] : ''));
                    var birthday = parseInt((new Date() - birthday)/1000/60/60/24/365);
                    if (!isNaN(birthday) && !dead){
                        extras.push(birthday + 'yo');
                    } else if (dead){
                        var dead = req.getElementById('name-death-info').textContent.match(/\(age\s([0-9]+)\)/);
                        if (dead){
                            extras.push(dead[1] + 'yo');
                        }
                    }
                } else {
                    var birthday = birthday.split('-');
                    var birthday = ((birthday[1] !== "0") ? birthday[0] + '-' + birthday[1] : birthday[0]);
                    extras.push((birthday.indexOf('-') !== -1 ? new Date(birthday).toLocaleString('en-US', {timeZone: 'UTC', month:'long'}) + ', ': '') + birthday.split('-')[0] + (dead ? ' - ' + dead.split('-')[0] : ''));
                    if (!dead){
                        extras.push('~' + parseInt((new Date() - new Date(birthday))/1000/60/60/24/365) + 'yo');
                    } else {
                        var dead = req.getElementById('name-death-info').textContent.match(/\(age\s([0-9]+)\)/);
                        if (dead){
                            extras.push(dead[1] + 'yo');
                        }
                    }
                }
            }
            var birthplace = birth.lastElementChild;
            if (birthplace && birthplace.tagName == 'a'){
                var birthplace = birthplace.innerText.match(/[^,]+,\s[^,]+$/);
                if (birthplace){
                    extras.push(birthplace[0].trim());
                }
            }
        }
        if (typeof bio === "object"){ var bio = ''; }
        if (typeof photo === "object"){ var photo = ''; }
        if (!Array.isArray(extras)){ var extras = []; }
        var saved = {};
        if(bio) saved["plotbio"] = bio;
        if(photo) saved["posterphoto"] = photo;
        if(extras.length > 0) saved["extras"] = extras.join(' | ');
        saved["time"] = Date.now();
        savedata(id, saved)
    } else {
        var overview = req.getElementById('title-overview-widget');

        var poster = overview.getElementsByClassName("poster")[0];
        var plot = req.getElementById('titleStoryLine').getElementsByTagName('p')[0];
        var rating = overview.getElementsByClassName('imdbRating')[0];
        var userrating = req.getElementById('star-rating-widget');

        if (plot){
            var plot = plot.textContent.replace(/\s{2,}Written\sby(.|\n)+$/,'').trim();
        }
        if (rating){
            var rating = rating.getElementsByClassName('ratingValue')[0];
            if (rating){
                if (userrating){
                    var userrating = userrating.getAttribute('data-rating');
                }
                var rating = rating.children[0].title;
            }
        }
        if (poster){
            var poster = poster.getElementsByTagName("img")[0];
            if (poster["src"].indexOf('/nopicture/')===-1){
                var poster = poster["src"].replace(/_V1\.*_.*/,"").split('/images/M/')[1];
            }
        }
        
        var subtext = overview.getElementsByClassName('subtext')[0];

        var episodes = overview.getElementsByClassName("np_episode_guide")[0];
        if (episodes){
            var episodes = episodes.getElementsByTagName('span')[0];
            if (episodes){
                var episodes = episodes.textContent;
            }
        }
        
        if (subtext){
            var duration = subtext.getElementsByTagName('time')[0];
            if (duration){
                var duration = duration.textContent.trim();
                if (episodes) {
                    var duration = [duration, Number((duration.match(/\b(\d+)h\b/)||[0,0])[1]), Number((duration.match(/\b(\d+)min\b/)||[0,0])[1])];
                    var duration = episodes.match(/\d+/)[0] + 'x' + duration[0] + ' (' + parseFloat(((duration[1]+duration[2]/60)*episodes.match(/\d+/)[0]).toFixed(2)) + 'h)';
                }
                extras.push(duration);
            } else if (episodes){
                extras.push(episodes);
            }
            
            var year = subtext.querySelector('a[href*=\\/releaseinfo]');
            if (year){
                var year = year.textContent.match(/\d{1,4}(.+\d{4}|\–)?/);
                if (year){
                    extras.push(year[0]);
                }
            }
        }
        if (typeof plot === "object"){ var plot = ''; }
        if (typeof rating === "object"){ var rating = ''; }
        if (typeof userrating === "object" || !(userrating && userrating > 0)){ var userrating = ''; }
        if (typeof poster === "object"){ var poster = ''; }
        if (!Array.isArray(extras)){ var extras = []; }
        var saved = {};
        if(plot) saved["plotbio"] = plot;
        if(rating) saved["rating"] = rating;
        if(userrating) saved["userrating"] = userrating;
        if(poster) saved["posterphoto"] = poster;
        if(extras.length > 0) saved["extras"] = extras.join(' | ');
        saved["time"] = Date.now();
        var isepisode = !(overview.getElementsByClassName('np_all').length === 0);
        if (!isepisode){
            savedata(id, saved)
        } else console.log(id + ' is episode. Not saving.');
    }
    fill(id, actor, saved, null, isepisode);
}

function fill(id, actor, saved, div = null, isepisode = false){
    if (div === null){
        var div = document.getElementById(id);
        if (div === null){ console.log('no div to fill'); return; }
    }
    if (Object.keys(saved).length === 1){ div.innerHTML = '<div class="extra">No info to show.</div>'; console.log(id + ' no info to show'); return; }
    if (saved.plotbio){
        div.innerHTML = "<span>" + saved.plotbio + "</span>";
    } else {
        div.innerHTML = "";
    }
    if (!actor && saved.rating){
        if (saved.userrating){
            div.innerHTML += '<div><span class="bluestar">' + saved.userrating + '</span><span class="star">' + saved.rating + '</span></div>';
        } else {
            div.innerHTML += '<div><div class="stars"><div></div><div style="width: ' + ((parseFloat(saved.rating)*10)-1) + '%;"></div></div><span class="rating">' + saved.rating + '</span></div>';
        }
    }
    if (saved.posterphoto){
        var img = document.createElement("img");
        img.style.minHeight = (isepisode ? '217px' : '482px');
        img.onload = function() { this.style.minHeight = null; }
        img.onerror = function() { this.style.minHeight = null; }
        img.src = 'https://images-na.ssl-images-amazon.com/images/M/' + saved.posterphoto + '_V1_SX325_.jpg';
        div.appendChild(img);
    }
    if (saved.extras){
        var extradiv = document.createElement("div");
        extradiv.innerHTML = saved.extras;
        extradiv.className = (saved.posterphoto || !(saved.rating && saved.plotbio)) ? "extra" : "extra2";
        div.appendChild(extradiv);
    }
}

function xmlrequest(id, actor){
    GM_xmlhttpRequest({
        method:  'GET',
        url:     "https://www.imdb.com/" + (actor ? "name" : "title") + "/" + id + "/",
        onload:  function(req) {
            processpage(id, actor, (new DOMParser()).parseFromString(req.response, "text/html"));
        }
    });
}

function xmlfilerequest(urls, data = []){
    if (urls.length === 0){
        //localStorage.IMDB_Mark = JSON.stringify(data);
        //localStorage.IMDB_Mark = data.join(';');
        return;
    }
    GM_xmlhttpRequest({
        method:  'GET',
        url:     urls.pop(),
        onload:  function(req) {
            data.push(req.finalUrl.match(/\/(ls[0-9]+)/i)[1] + req.response.match(/,(tt|nm)[0-9]+/gi).join(''));
            if (urls.length === 0){
                document.getElementById("scan").parentNode.removeChild(document.getElementById("scan"));
                savedata(uid, data.join(",~"));
            } else {
                xmlfilerequest(urls, data);
            }
        }
    });
}
function bigmov(id){
    var div = document.getElementById(id);
    if (div !== null){
        div.style.display = null;
    } else {
        var div = document.createElement("div");
        div.id = id;
        document.getElementById("alpe").appendChild(div);
        var actor = id.startsWith("nm");
        var saved = loaddata(id,false);
        if (!!saved){
            fill(id, actor, saved, div);
            if ((Date.now()-saved.time) >= 1000*60*60*(actor ? 48 : 8)){
                console.log(id + ' expired (checked ' + parseFloat(((Date.now()-saved.time)/1000/60).toFixed(1)) + 'm ago). Updating.');
                xmlrequest(id, actor);
            } else {
                console.log(id + ' cached ' + parseFloat(((Date.now()-saved.time)/1000/60).toFixed(1)) + 'm ago (' + (actor ? 48 : 8)*60 + 'm max)');
            }
        } else {
            xmlrequest(id, actor);
        }
    }
}

function smallmov(id){
    document.getElementById(id).style.display = "none";
}

function creatediv(){
    var css = document.createElement('style');
    css.type = 'text/css';
    var styles = '#alpe { position: fixed; bottom: 0px; right: 0px; background-color: rgba(0, 0, 0, 0.8); color: rgb(255, 255, 255); max-width: 325px; min-width: 195px; width: calc(calc(100% - 1008px)/2); z-index: 1000; text-align: center; max-height: 100%; display: flex; }';
    styles += '#alpe > div { line-height: 125%; display: inline-flex; max-height: 100%; flex-flow: column; }';
    styles += '#alpe .stars { width: 65px; height: 13px; position: relative; display: inline-block; margin-right: 0.5em; }';
    styles += '#alpe .stars > div { height: 100%; width: 100%; top: 0; position: absolute; }';
    styles += '#alpe .stars > div:first-child { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAABH0lEQVQokcWOvUoDURSEDykCxkotbIQQtLIRUwmCYBOJiBIQIf6EKFgIKSSNdt7Gh0iZhc09M2c3y90+pEibh7IKaFwhnVPOzDeMyL8KwBOAt5WB4XC4ZWadJEnaJPdWglS1OZlM6tPpdIfkbWFpPB4fJEly5r2/BHAP4INkWUSE5DvJB1W9MrOGqh6JiIiZvZLsk6yp6i7JzcXgYDCoRFFUS9O0SrIL4FNERJxzJQA3eZ5f/HU5hHBiZo8k134EAM6zLGsvA3meNwG0nXOlX2uj0WibZHfZJ3lNcr/wQpqmp6pad86VSbbM7C6KovU4jqskW4WQ976rqs0QQg/Asff+MITQU9UGyZdCCMCzqnZms9nGwpvP5xWSLZL9790vkqmYqNEY3lcAAAAASUVORK5CYII=); }';
    styles += '#alpe .stars > div:last-child, #alpe .star:before { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAABc0lEQVQokWNgoBaYVCYks7BVwpOBgYGZaE27Z8rknFkuf3ZKtYA8URoqMvkFz62S33t/m9LfHTNlUojStKZH0v32FqUPT3ar/D+zTH5LtCcDH4ailV1SSQfmytYeWSjbfXSR/LQzyxVOPt6l8v/pbpX/tzYrfTy+SGHF8SVyE4/Ml23dPUO2ZFKZsBnD1qkyFdfXK718tEvl/2MofrIbgWFiD7Yr/Tu1TH7vzCoRIwZjYwbWDZOkQ66sVbiOrgGG721T/nF8sdziaQ3iSsiuZFzSIm5xaa3iZXQND7Yr/Tk0T7avIEFAAMNvxWm8IhdWK5zA0LRD6d+uWXL5WENteYeU1c1Nim+e7Fb5f3uL8ser6xXuP9yu9OfJbpX/p5YqrPBUYWDH0LR3pkzO7a3Kvy+uVjy5ebJU+IxKIa3D8+V7b25SfHN5rcL1ieWCcuh6mLZMkW09MEd22tQKURWYoKcnA/uGiZKBB+fKbVnYJGYJEwcA1/HLKMOgZMUAAAAASUVORK5CYII=); }';
    styles += '#alpe .star:before, #alpe .bluestar:before { background-repeat: no-repeat; width: 13px; height: 13px; display: inline-block; padding-right: 3px; content: ""; }';
    styles += '#alpe .bluestar:before { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAANCAYAAAB2HjRBAAABx0lEQVQokWNgwAFcUle6e+VsmyAjE8qJSw0OoM0WWnV6ZkzrnadOyUvNSNJqG7dQL7bt/v3k3tf/g8qOtTEwMDATrdm/5GB5UvfLvyn97/9HNd+8aOhULY9VoUPCYg/fgl2x/kUHswPKj5f5lx5qjW66cSOl/93/lP53/xO7nv0Iqji5JKj8ZJV/6aFC3+K9KZ5Zm0MMfLpUGbwLdnbHtt1/k9T96m9S76v/Sb2v/if3vf0P05zS/+5/ct+b/0m9r/4n9r76l9j9/FdY9bmDNhEzzRmMXcr5A4oP5se1P3iKrAETv/+f2PPyT0T9xY0OCUsNGBgYGGGuZ/ZI3+AV3XTjVHLvm7/YNMd3PXkfVH600zioXxKr/z2zNkbHdz35ltL/HkNzWO2FXQoGCQK4ApkpoOxofWLvq39wTUh+j2m5e8MqfJIyVp0q5rl8EfWXd6b0v/uf3Pv6f0zL7cthtRe3J3Q+/ZTS/+5/QufTr965W4KwaraOX6Ad23L3UXz741fBlaemOCcu0VJwKBDwzdsRG91480R857PfQRUn2hgYGJgwNDslrfAMLju+zStjUzB6ejaPmqEaWHZ0om/BnhlSxmlcMHEAJTMKt30faS4AAAAASUVORK5CYII=); }';
    styles += '#alpe .star, #alpe .bluestar, #alpe .rating { line-height: 1.5;font-family: segoe ui; padding-right: 8px; }';
    styles += '#alpe > div > img { max-width: 100%; display: block; margin: auto; flex-grow: 0; min-height: 150px; }';
    styles += '#alpe > div .extra { position: absolute; background-color: rgba(0, 0, 0, 0.5); padding: 0px 4px; bottom: 0px; left: 50%; transform: translate(-50%, 0%); white-space: nowrap; }';
    styles += '#alpe > div .extra2 { background-color: rgba(0, 0, 0, 0.5); margin-top: 1em; }';
    styles += '#alpe > div > span:first-child { overflow: hidden; flex: 1 1; min-height: 4em; display: inline-flex; }';
    if (css.styleSheet){ css.styleSheet.cssText = styles; } else { css.appendChild(document.createTextNode(styles)); }
    (document.head||document.getElementsByTagName("head")[0]).appendChild(css);
    
    var div = document.createElement("div");
    div.id = "alpe";
    document.body.appendChild(div);
}


///////////////////////////////////////////////////////
//////////////Remove actor ref links///////////////////
///////////////////////////////////////////////////////
function refandmark(elements = document, ref = true, mark = false, skip = false){
    if(!NodeList.prototype.isPrototypeOf(elements)){
        var elements = (
            elements === null ? [] :
            elements.getElementsByTagName === undefined ? [] :
            elements.nodeName === "A" ? [elements] :
            elements.querySelectorAll('a[href]')
        );
    }
    if (mark && (skip || document.getElementById('alpe') === null)){ creatediv(); }
    for (var i=0; i<elements.length; i++){
        var element = elements[i];
        var isnametitle = (element.href.indexOf("/name/") !== -1 || element.href.indexOf("/title/") !== -1);
        if (isnametitle || (ref && element.href.indexOf("/character/") !== -1)){
            if (ref && element.href.indexOf("?") !== -1){
                element.href = element.href.split("?")[0] + element.href.split("?")[1].split("&").filter(reftest => !reftest.startsWith("ref")).join("&").replace(/(^.+)/,"?$1");
            }
            if (mark && isnametitle){
                if (skip || element.onmouseenter === null && (element.offsetParent === null || element.offsetParent.className !== 'mediaviewer__footer') && (element.children.length === 0 || (element.children.length > 0 && element.children[0].onmouseenter === null))){
                    //console.log(['mark',element,ref,mark])
                    element.onmouseenter = function(){ bigmov(this.href.match(/(tt|nm)[0-9]+/)[0]); }
                    element.onmouseleave = function(){ smallmov(this.href.match(/(tt|nm)[0-9]+/)[0]); }
                }
            }
        }
    }
}

function markmousehover(elements = document, skip = false){
    refandmark(elements, false, true, skip);
}

function removeref(elements = document){
    refandmark(elements);
}

removeref();
var counter = 0;
var delayed = setInterval(function(){
    counter++;
    if(counter >= 12 || (document.getElementById('titleAdClick') !== null && (document.getElementById('lateload-recs-widget') === null || document.getElementById('lateload-recs-widget').children.length >= 6))){
        clearInterval(delayed);
        removeref(document.getElementById('consumer_main_nav'));
        removeref(document.getElementById('lateload-recs-widget'));
    };
},250);

///////////////////////////////////////////////////////
////////////////Bigger Actor Images////////////////////
///////////////////////////////////////////////////////
function bigImg(e,stat){
    if(e.parentNode.lastChild.title!==""){
        var img = document.createElement("img");
        img.src = e.src.replace(/_V1_.+/, "_V1_UY317.jpg");
        img.style.position = "absolute";
        img.style.marginLeft = "6px";
        img.style.borderStyle = "ridge";
        e.parentNode.appendChild(img);
        var test = stat.clientY-document.documentElement.clientHeight;
        if((test+317)>0 || (test+img.clientHeight>0)){ img.style.bottom = "0px"; img.style.position = "fixed"; }
    }
}

function smallImg(e){
    if(e.parentNode.lastChild.title===""){
        e.parentNode.removeChild(e.parentNode.lastChild);
    }
}

var path = window.location.pathname;

function checklist(id){
    var data = loaddata(uid);
    if (data && data.indexOf(id)){
        var test = data.match(new RegExp('(ls\\d+)[^~]*' + id, 'g'));
        if (test){
            var div = document.createElement("div");
            div.style.float = "right";
            div.innerHTML = '<span style="font-weight: bold">Lists:</span>';
            for (var i=0; i<test.length; i++){
                var listid = test[i].split(',')[0];
                var listaliase = loaddata(uid + "al").match(new RegExp(listid + '=([^~]+)'));
                div.innerHTML += (i !== 0 ? ', ' : ' ') + '<a href="/list/' + listid + '">' + (listaliase ? listaliase[1] : listid) + '</a>';
            }
            var test = document.getElementById("name-job-categories");
            if (!test){
                var test = document.getElementsByClassName('plot_summary')[0];
                if (test){
                    div.style.float = null;
                    div.style.color = "#666666";
                    div.children[0].style.padding = "0 0.5em 0 0";
                }
                if (!test) var test = document.getElementsByClassName('title_wrapper')[0];
            }
            if (test) test.appendChild(div);
        } else console.log("Not present in any list.");
    }
}

if (path.startsWith("/title/")){
    var pathtest = path.match(/^\/title\/(tt\d+)\/?$/);
    if (pathtest){ processpage(pathtest[1], false, document); }
    ///////////////////////////////////////////////////////
    ////////////////Bigger Actor Images////////////////////
    ///////////////////////////////////////////////////////
    var elements = document.getElementsByClassName("loadlate");
    for (var i=0; i<elements.length; i++){
        var element = elements[i];
        if (element.parentNode.href.indexOf("/name/") !== -1){
            element.onmouseenter = function(stat){ bigImg(this,stat) };
            element.onmouseleave = function(){ smallImg(this) };
        }
    }
  
  
  
  
  ///////////////////////////////////////////////////////
  ////////////////////Full Summary///////////////////////
  ///////////////////////////////////////////////////////
  var summary = document.querySelector("#title-overview-widget .plot_summary_wrapper .plot_summary .summary_text a[href*=plotsummary]");
  if (summary){
    var summary = summary.parentNode;
    var storyline = document.querySelector("#titleStoryLine .inline.canwrap span");
    if (storyline && storyline.innerText.indexOf(summary.innerText.split("...")[0]) === 0){
      summary.innerHTML = storyline.firstChild.data.trim();
      console.log("summary expanded");
    }
  }
  
    ///////////////////////////////////////////////////////
    ///////////////////Highlight AKA///////////////////////
    ///////////////////////////////////////////////////////
    if (path.indexOf('releaseinfo') !== -1){
        var elements = document.querySelectorAll('table#release_dates tr, table#akas tr');
        if (elements.length > 0){
            for (var i=0; i<elements.length; i++){
                if (elements[i].children[0].textContent.match(/^usa|brazil|world|.?original/i)){
                    elements[i].style.fontWeight = "bold";
                }
            }
        }
    }
}
//else if (path === "/" || path === "/chart/boxoffice" || path.startsWith('/name/') || path.startsWith('/list/')){
else {
    var pathtest = path.match(/^\/name\/(nm\d+)\/?$/);
    if (pathtest){ processpage(pathtest[1], true, document); }
    ///////////////////////////////////////////////////////
    ///////////////////Bigger Posters//////////////////////
    ///////////////////////////////////////////////////////
    var elements = (
        path === "/" ? document.querySelectorAll("#sidebar .rhs-row .title a[href*=\\/title\\/tt]") :
        path.startsWith('/name/') ? document.querySelectorAll('#filmography .filmo-row a:not([class]), #knownfor > div > a') :
        path.startsWith('/list/') ? document.querySelectorAll('#main div.info a[href*=\\/title\\/tt], #main div.info div.item_description a[href*=\\/name\\/nm]') :
        path.startsWith('/movies-coming-soon/') ? document.querySelectorAll('div#main div.list.detail div.txt-block a[href*=\\/name\\/nm]') :
        path.match(/^\/chart\/[A-Za-z]+\/?$/i) ? document.querySelectorAll("#main table.chart > tbody > tr > * > a[href*=\\/title\\/tt]") :
        ""
    );
    if (typeof(elements) === "object"){
        refandmark(elements, false, true, true);
    }
    ///////////////////////////////////////////////////////
    //////////////////////Observer/////////////////////////
    ///////////////////////////////////////////////////////
    var elements = (
        //path.startsWith('/name/') ? [document.getElementById('photo-container'),{subtree: true, attributes: true}] :
        (path.startsWith('/user/') && path.endsWith('watchlist') && document.getElementsByClassName('load-more').length > 0) ? document.getElementById('center-1-react') :
        document.getElementById('photo-container') ? [document.getElementById('photo-container'),{attributes: true}] :
        ''
    );
    if (typeof(elements) === "object"){
        if(!Array.isArray(elements)){
            var elements = [elements,{ childList: true, subtree: true }];
        } else {
            var elements = [elements[0],Object.assign({ childList: true, subtree: true, attributeFilter: ['href'] },elements[1])]
        }
        var observer = new MutationObserver(function(mutations) {
            var markall = (document.getElementById('markall') === null);
            mutations.forEach(function(mutation) {
                var attmutation = (mutation.type === "attributes");
                var mutation = (attmutation ? [mutation.target] : mutation.addedNodes);
                mutation.forEach(function(el) {
                    refandmark(el, true, markall);
                });
            });
        });
        observer.observe(elements[0], elements[1]);
    } else {
        console.log('not starting observer for ' + path);
    }
    if (path.match(/^\/user\/ur\d+\/lists$/)){
        var el = document.createElement("a");
        el.id = "scan";
        el.textContent = "Scan";
        el.href = "javascript:void(0)";
        el.style.float = "right";
        el.onclick = function(){
            var listA = document.getElementsByClassName("user-lists")[0].querySelectorAll("a.list-name");
            savedata(uid + "al", Array.prototype.map.call(listA,function (el) { return el.href.match(/\/list\/(ls\d+)\//i)[1] + '=' + el.textContent; }).join('~'));
            var lists = [];
            for (var i=0; i<listA.length; i++){
                lists.push('https://www.imdb.com/list/export?list_id=' + listA[i].href.match(/\/list\/(ls\d+)\//i)[1] + '&author_id=' + document.getElementById("navUserMenu").querySelector("a[href*='/user/ur']").href.match(/\/user\/(ur\d+)\//i)[1]);
            }
            xmlfilerequest(lists);
            this.removeAttribute("href");
            this.textContent = "Scanning";
            this.onclick = null;
        }
        document.getElementById("main").appendChild(el);
    }
}

GM_registerMenuCommand("Mark actors",function(){markmousehover(document.querySelectorAll("a[href*=\\/name\\/nm]"))});
GM_registerMenuCommand("Mark titles",function(){markmousehover(document.querySelectorAll("a[href*=\\/title\\/tt]"))});
GM_registerMenuCommand("Mark both",function(){markmousehover()});

var wid = ((window.innerWidth - (document.getElementById('root')||document.getElementsByTagName('div')[0]).clientWidth)/4)-64;
var el = document.createElement("a");
el.id = 'markall';
el.style.cssText = "position: fixed;bottom: 32px;right: " + wid + "px;";
el.href = "javascript:void(0)";
el.onclick = function(){markmousehover(); this.remove(); };
el.innerHTML = '<img src="data:image/png;base64,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">';
document.body.appendChild(el);