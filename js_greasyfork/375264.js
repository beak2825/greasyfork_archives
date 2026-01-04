// ==UserScript==
// @name        Youtube to Invidious
// @author      OdinBrood
// @namespace   Krul & Brood
// @description Scan page for Youtube embeds and urls and replace with Invidious.
// @include     *
// @exclude     /^http(s|)://(www\.|)invidio\.us/.*$/
// @exclude     /^http(s|)://(www\.|)invidious\.snopyta\.org/.*$/
// @exclude     /^http(s|)://(www\.|)vid.wxzm\.sx/.*$/
// @exclude     /^http(s|)://(www\.|)invidious\.kabi\.tk/.*$/
// @exclude     /^http(s|)://(www\.|)invidiou\.sh/.*$/
// @exclude     /^http(s|)://(www\.|)invidious\.enkirton\.net/.*$/
// @exclude     /^http(s|)://(www\.|)tube\.poal\.co/.*$/
// @exclude     /^http(s|)://(www\.|)invidious\.13ad\.de/.*$/
// @grant       GM_xmlhttpRequest
// @version     8.4
// @downloadURL https://update.greasyfork.org/scripts/375264/Youtube%20to%20Invidious.user.js
// @updateURL https://update.greasyfork.org/scripts/375264/Youtube%20to%20Invidious.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

var instance='invidio.us'; //set you favorite Invidious instance! (https://github.com/omarroth/invidious/wiki/Invidious-Instances)

//change script options, default values recommended
var a=1; //set to 0 to force autoplay off, set to 1 to keep embed's value [default 1]
var b=1; //set to 0 to not replace all youtube links to Invidious [default 1]
var c=1; //set to 0 to disable DASH playback (beta feature) [default 1]
var d=1; //set to 0 to disable Invidious proxy [default 1]
var e=1; //set to 0 to disable bypass of url shorteners [default 1]

var logo='url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEwAAABQCAYAAACzg5PLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGe2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxOS0wNS0xNlQxNToyNDo0NiswMjowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOS0wNS0xNlQxNToyNDo0NiswMjowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTktMDUtMTZUMTU6MjQ6NDYrMDI6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ZDEwOTAzM2MtOWY3Ny0yNTQ5LTk1N2QtNzk0OTllYjJiYmU5IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6YWU3Y2E5NzctYzdkNC0wNDQxLTg4MGItNzViNjI2M2NmNWU2IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MTZiYjg0NjUtNDRjYy1lNDRkLTgyY2YtYmVjZDViYTQ0ODBmIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoxNmJiODQ2NS00NGNjLWU0NGQtODJjZi1iZWNkNWJhNDQ4MGYiIHN0RXZ0OndoZW49IjIwMTktMDUtMTZUMTU6MjQ6NDYrMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmQxMDkwMzNjLTlmNzctMjU0OS05NTdkLTc5NDk5ZWIyYmJlOSIgc3RFdnQ6d2hlbj0iMjAxOS0wNS0xNlQxNToyNDo0NiswMjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHBob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8cmRmOkJhZz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJMb2FkaW5nLi4uIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJMb2FkaW5nLi4uIi8+IDwvcmRmOkJhZz4gPC9waG90b3Nob3A6VGV4dExheWVycz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6R2EWnAAAONUlEQVR4nO1ce0xbV5r/nXv9NiYOD4N5BJK0hEdAvqmqNhRSd1K1gioN3japVjO7k6rRjEbVzGSkfUizu2qiXWm1s48k6h/d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)';
var ytdomains=new RegExp(/http(s|)\:\/\/(m\.|i\.|www\.|img\.|)(youtu(|be|be-nocookie)|.*ytimg)\.(com|be)\/.*/);
var shorteners=new RegExp(/^http(s|):\/\/(bit.ly|goo.gl|tinyurl.com|t.co|ow.ly|is.gd|buff.ly|deck.ly|su.pr|lnk.co|fur.ly|moourl.com|)\/.*/);
var params=new RegExp(/^(autoplay|channel|v|playlist|list)$/);
var current=window.location.href.match(ytdomains)===null;
var frames,thumbs,links,skip;

if(current){
    frames=Array.prototype.slice.call(document.getElementsByTagName('iframe')).filter(ytel);
    thumbs=Array.prototype.slice.call(document.getElementsByTagName('img')).filter(ytel);
    if(b==1)links=Array.prototype.slice.call(document.getElementsByTagName('a')).filter(ythref);
    if(frames.length>0)embed();
    if(thumbs.length>0)thumb();
    if(links.length>0)link();
}else{
    var title=Array.prototype.slice.call(document.getElementsByTagName('h1'));
    addbtn();
}

var observer=new MutationObserver(function(mutations){
    mutations.forEach(function(mutation){
        if(current){
            frames=Array.prototype.slice.call(mutation.target.getElementsByTagName('iframe')).filter(ytel);
            thumbs=Array.prototype.slice.call(mutation.target.getElementsByTagName('img')).filter(ytel);
            if(frames.length>0)embed();
            if(thumbs.length>0)thumb();
            if(b==1){
                links=Array.prototype.slice.call(mutation.target.getElementsByTagName('a')).filter(ythref);
                if(links.length>0)link();
            }
        }else{
            skip=Array.prototype.slice.call(mutation.target.getElementsByClassName('skipinv'));
            if(skip<1){
                title=Array.prototype.slice.call(mutation.target.getElementsByTagName('h1'));
                addbtn();
            }
        }
    });
});
observer.observe(document.body,{childList:true,subtree:true});

function embed(){
    for(var i=0;i<frames.length;i++){
        frames[i].style.backgroundColor='rgba(35,35,35,1)';
        frames[i].style.backgroundImage=logo;
        frames[i].style.backgroundRepeat='no-repeat';
        frames[i].style.backgroundPosition='center center';
        frames[i].style.backgroundSize='auto';
        for(var j=0;j<frames[i].attributes.length;j++) {
            if(frames[i].attributes[j].value.match(ytdomains)){
                var url=new URL(frames[i].attributes[j].value);
                if(!url.hostname.match(/youtube/)){
                    url=new URL(decodeURIComponent(url.href).match(ytdomains)[0]);
                    url.searchParams.set('autoplay',0);
                }
                for(var key of url.searchParams.keys()){
                    if(!(key.match(params)))url.searchParams.delete(key);
                }
                url.hostname=instance;
                if(a==1){
                    if(!url.searchParams.has('autoplay')||url.searchParams.get('autoplay')==='')url.searchParams.set('autoplay',0);
                }else{
                    url.searchParams.set('autoplay',0);
                }
                if(c==1)url.searchParams.set('quality','dash');
                if(d==1)url.searchParams.set('local',true);
                frames[i].setAttribute(frames[i].attributes[j].name,url);
            }
        }
    }
}

function thumb(){
    for(var i=0;i<thumbs.length;i++){
        var url=new URL(thumbs[i].src.match(ytdomains)[0]);
        url.hostname=instance;
        thumbs[i].src=url;
    }
}

function link(){
    for(var i=0;i<links.length;i++){
        var url=new URL(links[i].href.match(ytdomains)[0]);
        url.hostname=instance;
        links[i].href=url;
    }
}

function addbtn(){
    for(var i=0;i<title.length;i++){
        var btn=document.createElement('a');
        btn.innerHTML='<h2>Watch on '+instance+'</h2>';
        btn.href='javascript:void(0)';
        btn.onclick=function(){redir();};
        btn.className='skipinv';
        title[i].parentNode.appendChild(btn);
    }
}

function redir(){
    var url=new URL(window.location.href);        
    url.hostname=instance;
    location.href=url;
}

function unshorten(long,short){
    frames=Array.prototype.slice.call(document.getElementsByTagName('iframe'));
    for(var k=0;k<frames.length;k++){
        for(var l=0;l<frames[k].attributes.length;l++) {
            if(frames[k].attributes[l].value==long){
                frames[k].attributes[l].value=short;
                frames=[frames[k]];
                embed();
                return;
            }
        }
    }
}

function ytel(el){
    for(var i=0;i<el.attributes.length;i++){
        var val=el.attributes[i].value;
        if(val.substring(0,2)=='//')val='https:'+val;
        try{val=decodeURIComponent(val);}catch(e){}
        if(val.match(shorteners)&&e==1){
            var long=el.attributes[i].value=val;
            GM_xmlhttpRequest({
                method:'GET',url:long,onload:function(response){
                    var short=response.finalUrl;
                    if(short.match(ytdomains))unshorten(long,short);
                }
            });
        }
        if(val.match(ytdomains)){
            el.attributes[i].value=val;
            return true;
        }
    }
}

function ythref(el){
    return(decodeURIComponent(el.href).match(ytdomains));
}