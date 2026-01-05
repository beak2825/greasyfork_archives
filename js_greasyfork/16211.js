// ==UserScript==
// @name		SoundCloud Downloader 2
// @version		0.1
// @description	Download musics from SoundCloud, track and playlist.
// @author		o0xXx0o
// @include		http://soundcloud.com/*
// @include		https://soundcloud.com/*
// @include		http://www.soundcloud.com/*
// @include		https://www.soundcloud.com/*
// @require		http://code.jquery.com/jquery-1.11.1.min.js
// @grant       none
// @namespace https://greasyfork.org/users/24448
// @downloadURL https://update.greasyfork.org/scripts/16211/SoundCloud%20Downloader%202.user.js
// @updateURL https://update.greasyfork.org/scripts/16211/SoundCloud%20Downloader%202.meta.js
// ==/UserScript==

var _arrive_unique_id_=0;
(function(n,u,p){function h(a){return a._shouldBeIgnored===p?-1!=(" "+a.className+" ").indexOf(" ignore-arrive ")?a._shouldBeIgnored=!0:null==a.parentNode?a._shouldBeIgnored=!1:a._shouldBeIgnored=h(a.parentNode):a._shouldBeIgnored}function q(a,c,e){for(var d=0,b;b=a[d];d++)h(b)||(f.matchesSelector(b,c.selector)&&(b._id===p&&(b._id=_arrive_unique_id_++),-1==c.firedElems.indexOf(b._id)&&(c.firedElems.push(b._id),e.push({callback:c.callback,elem:b}))),0<b.childNodes.length&&q(b.childNodes,c,e))}function v(a){for(var c=
  0,e;e=a[c];c++)e.callback.call(e.elem)}function x(a,c){a.forEach(function(a){if(!h(a.target)){var d=a.addedNodes,b=a.target,r=[];null!==d&&0<d.length?q(d,c,r):"attributes"===a.type&&f.matchesSelector(b,c.selector)&&(b._id===p&&(b._id=_arrive_unique_id_++),-1==c.firedElems.indexOf(b._id)&&(c.firedElems.push(b._id),r.push({callback:c.callback,elem:b})));v(r)}})}function y(a,c){a.forEach(function(a){if(!h(a.target)){a=a.removedNodes;var d=[];null!==a&&0<a.length&&q(a,c,d);v(d)}})}function z(a){var c=
{attributes:!1,childList:!0,subtree:!0};a.fireOnAttributesModification&&(c.attributes=!0);return c}function A(a){return{childList:!0,subtree:!0}}function g(a){a.arrive=k.bindEvent;f.addMethod(a,"unbindArrive",k.unbindEvent);f.addMethod(a,"unbindArrive",k.unbindEventWithSelectorOrCallback);f.addMethod(a,"unbindArrive",k.unbindEventWithSelectorAndCallback);a.leave=l.bindEvent;f.addMethod(a,"unbindLeave",l.unbindEvent);f.addMethod(a,"unbindLeave",l.unbindEventWithSelectorOrCallback);f.addMethod(a,"unbindLeave",
  l.unbindEventWithSelectorAndCallback)}if(n.MutationObserver&&"undefined"!==typeof HTMLElement){var f=function(){var a=HTMLElement.prototype.matches||HTMLElement.prototype.webkitMatchesSelector||HTMLElement.prototype.mozMatchesSelector||HTMLElement.prototype.msMatchesSelector;return{matchesSelector:function(c,e){return c instanceof HTMLElement&&a.call(c,e)},addMethod:function(a,e,d){var b=a[e];a[e]=function(){if(d.length==arguments.length)return d.apply(this,arguments);if("function"==typeof b)return b.apply(this,
  arguments)}}}}(),B=function(){var a=function(){this._eventsBucket=[];this._beforeRemoving=this._beforeAdding=null};a.prototype.addEvent=function(a,e,d,b){a={target:a,selector:e,options:d,callback:b,firedElems:[]};this._beforeAdding&&this._beforeAdding(a);this._eventsBucket.push(a);return a};a.prototype.removeEvent=function(a){for(var e=this._eventsBucket.length-1,d;d=this._eventsBucket[e];e--)a(d)&&(this._beforeRemoving&&this._beforeRemoving(d),this._eventsBucket.splice(e,1))};a.prototype.beforeAdding=
  function(a){this._beforeAdding=a};a.prototype.beforeRemoving=function(a){this._beforeRemoving=a};return a}(),w=function(a,c,e){function d(a){"number"!==typeof a.length&&(a=[a]);return a}var b=new B;b.beforeAdding(function(b){var c=b.target,d;if(c===n.document||c===n)c=document.getElementsByTagName("html")[0];d=new MutationObserver(function(a){e.call(this,a,b)});var m=a(b.options);d.observe(c,m);b.observer=d});b.beforeRemoving(function(a){a.observer.disconnect()});this.bindEvent=function(a,e,t){"undefined"===
typeof t&&(t=e,e=c);for(var m=d(this),f=0;f<m.length;f++)b.addEvent(m[f],a,e,t)};this.unbindEvent=function(){var a=d(this);b.removeEvent(function(b){for(var c=0;c<a.length;c++)if(b.target===a[c])return!0;return!1})};this.unbindEventWithSelectorOrCallback=function(a){var c=d(this);b.removeEvent("function"===typeof a?function(b){for(var d=0;d<c.length;d++)if(b.target===c[d]&&b.callback===a)return!0;return!1}:function(b){for(var d=0;d<c.length;d++)if(b.target===c[d]&&b.selector===a)return!0;return!1})};
  this.unbindEventWithSelectorAndCallback=function(a,c){var e=d(this);b.removeEvent(function(b){for(var d=0;d<e.length;d++)if(b.target===e[d]&&b.selector===a&&b.callback===c)return!0;return!1})};return this},k=new w(z,{fireOnAttributesModification:!1},x),l=new w(A,{},y);u&&g(u.fn);g(HTMLElement.prototype);g(NodeList.prototype);g(HTMLCollection.prototype);g(HTMLDocument.prototype);g(Window.prototype)}})(this,"undefined"===typeof jQuery?null:jQuery);
/*** End arrive.js ***/

console.info('Thanks for using SoundTake! :)');

(function(document) {
    var versi = '0.4',
        jQ = jQuery.noConflict(true);
    
    var options = {
        fireOnAttributesModification: false
    };
    
    function DownloadButton(e) {
        if (jQ(e).find('.sc-button-download').length > 0) {
            jQ(e).find('.sc-button-download').remove();
        }
        var button_size = jQ(e).find('div.sc-button-group').hasClass('sc-button-group-medium') || jQ(e).find('div.sc-button-group').find('button').eq(0).hasClass('sc-button-medium') ? 'sc-button-medium' : 'sc-button-small',
            d = jQ(e).find('.soundTitle__title').eq(0),
            link = null,
            btngroup = jQ(e).find('div.sc-button-group').eq(0);
        link = (d.attr('href') == undefined) ? document.location.href : d.attr('href');
        if (jQ(e).hasClass('userNetwork__share')) {
            link = document.location.href;
            jQ(e).append('<button style="margin-left:5px;" class=\'sc-button sc-button-download ' + button_size + ' sc-button-responsive\' title=\'Download list no soportado\' onclick=\'window.open("no-soportado' + link + '", "_blank")\'>Download This List </button>')
        }
        else if (jQ(e).hasClass('playlist') || jQ(e).find('.sc-button-like[title=\'Like Playlist\']').length > 0) {
            btngroup.append('<button class=\'sc-button sc-button-download ' + button_size + ' sc-button-responsive\' title=\'Download this playlist\' onclick=\'window.open("https://savedeo.com/download?url=' + 'https://soundcloud.com' + link + '", "_blank")\'>Download Playlist </button>')
        }
        else if (jQ(e).find('.trackItem__content').length > 0) {
            link = 'https://soundcloud.com' + jQ(e).find('.trackItem__trackTitle').eq(0).attr('href');
            btngroup.append('<button class=\'sc-button sc-button-download ' + button_size + ' sc-button-responsive sc-button-icon\' title=\'Download this track\' onclick=\'window.open("http://sc-downloader.com/download' + link + '.mp3' + '", "_blank")\'>Download </button>')
        }
        else if (jQ(e).hasClass('soundBadge')) {
            btngroup.append('<button class=\'sc-button sc-button-download ' + button_size + ' sc-button-responsive sc-button-icon\' title=\'Download this track\' onclick=\'window.open("http://sc-downloader.com/download' + link + '.mp3' + '", "_blank")\'>Download </button>')
        }
        else {
            btngroup.append('<button class=\'sc-button sc-button-download ' + button_size + ' sc-button-responsive\' title=\'Download this track\' onclick=\'window.open("http://sc-downloader.com/download/' + link.split('https://soundcloud.com/' ).join('') + '.mp3' + '", "_blank")\'>Download </button>')
        }
        jQ(e).leave('.sc-button-download', function () {
            jQ(e).unbindLeave();
            DownloadButton(e);
        });
    }

    function eksekusi() {
        jQ('.sound').each(function (a, b) {
            addDownloadButton(b)
        });
        jQ(document).arrive('.sound', options, function(){
            DownloadButton(this);
        });
        jQ(document).arrive('.trackList__item', options, function(){
            DownloadButton(this);
        });
        jQ(document).arrive('.l-listen-engagement', options, function(){
            DownloadButton(this);
        });
        jQ(document).arrive('.listenEngagement__actions', options, function(){
            DownloadButton(this);
        });
        jQ(document).arrive('.soundBadge', options, function(){
            DownloadButton(this);
        });
        jQ(document).arrive('.userNetwork__share', options, function(){
            DownloadButton(this);
        });
    }
    eksekusi();
})(document);