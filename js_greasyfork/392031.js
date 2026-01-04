// ==UserScript==
// @name         WME Chat
// @version      0.8.2
// @description  Live Chat for WME
// @namespace    https://greasyfork.org/fr/scripts/392031-wme-chat
// @icon		 data:image/png;base64,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
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com/*
// @exclude      https://www.waze.com/user/*editor/*
// @exclude      https://www.waze.com/*/user/*editor/*
// @connect      limageenboite.fr
// @copyright    Sebiseba 2019
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/392031/WME%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/392031/WME%20Chat.meta.js
// ==/UserScript==

(function() {
    var nick='', y=false, idx=0, chatLink={}, liveUsers_Layer=[], activeCountry='', count=0, nativeQtyMsg=1, lastNativeMsg='', lastIdMsg='';
    var alertSound="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4jKQIiEAhAmZ9zXONKALIZ2jlSWJgjv/kTQ2MCo0CX9H+N3X//tUZOMAEQ4eU2lGLYQi48nVFe1CBPR7SaOs8hCYjyn01BbCkL2uJ3AQWABJpDTZ2erI4nhaW2rmJi0BUPbWHE+sssv0sjUUiyxOJQrzT9T+goMByQAT5o040p3awmNTzWvKAyho0/lvMPnqgcNGjZkJCwsKrYZMGtYt7mAwGZcO1xmy00aUWNMjVgoYE4l20NIlUGphqqgxcWBokhIky4vNk44uAsLCwZMxYXZWK8VFG/qF/8UVTEFNRTMuOTgu//tUZOeAETweVmiiUPwnI8oqNAeghRR7Q6Uk8ICUjylwcx7GMlVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy45OC4yVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tUZOcAETQeVWjpPY4mo9rNHSexhOB7VaOM5TiXDyj0dJ7GVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tUROgFAT8XTDGDNKAsIbpaGCNig3Q7ACMEbih6hWEAYJhAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tUZO6P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
    var notificationSound="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qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/+1JkkQ/xoxRS6GYTJiBhKhoAIwLAAAGkAAAAIAAANIAAAASqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7UmS9D/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq";
    var snd=new Audio("data:audio/mp3;base64," + alertSound);
    var ntf=new Audio("data:audio/mp3;base64," + notificationSound);
    var smileys={":)":"https://www.waze.com/forum/images/smilies/icon_e_smile.gif", ":D":"https://www.waze.com/forum/images/smilies/icon_e_biggrin.gif", ";)":"https://www.waze.com/forum/images/smilies/icon_e_wink.gif", ":(":"https://www.waze.com/forum/images/smilies/icon_e_sad.gif", ":o":"https://www.waze.com/forum/images/smilies/icon_e_surprised.gif", ":?":"https://www.waze.com/forum/images/smilies/icon_e_confused.gif", ":S":"https://www.waze.com/forum/images/smilies/icon_e_confused.gif", "8-)":"https://www.waze.com/forum/images/smilies/icon_cool.gif",
                 ":x":"https://www.waze.com/forum/images/smilies/icon_mad.gif", ":P":"https://www.waze.com/forum/images/smilies/icon_razz.gif", ":p":"https://www.waze.com/forum/images/smilies/icon_razz.gif", ":|":"https://www.waze.com/forum/images/smilies/icon_neutral.gif", ":lol:":"https://www.waze.com/forum/images/smilies/icon_lol.gif", "=D":"https://www.waze.com/forum/images/smilies/icon_lol.gif", "oO":"https://www.waze.com/forum/images/smilies/icon_eek.gif", ":shock:":"https://www.waze.com/forum/images/smilies/icon_eek.gif",
                 ":oops:":"https://www.waze.com/forum/images/smilies/icon_redface.gif", ":\u00b0":"https://www.waze.com/forum/images/smilies/icon_redface.gif", ":cry:":"https://www.waze.com/forum/images/smilies/icon_cry.gif", ":'":"https://www.waze.com/forum/images/smilies/icon_cry.gif", ":evil:":"https://www.waze.com/forum/images/smilies/icon_evil.gif", ">:(":"https://www.waze.com/forum/images/smilies/icon_evil.gif", ":twisted:":"https://www.waze.com/forum/images/smilies/icon_twisted.gif", ">:)":"https://www.waze.com/forum/images/smilies/icon_evil.gif",
                 ":roll:":"https://www.waze.com/forum/images/smilies/icon_rolleyes.gif", "\u00b0\u00b0":"https://www.waze.com/forum/images/smilies/icon_rolleyes.gif", ":!:":"https://www.waze.com/forum/images/smilies/icon_exclaim.gif", ":?:":"https://www.waze.com/forum/images/smilies/icon_question.gif", ":idea:":"https://www.waze.com/forum/images/smilies/icon_idea.gif", ":arrow:":"https://www.waze.com/forum/images/smilies/icon_arrow.gif", "->>":"https://www.waze.com/forum/images/smilies/icon_arrow.gif", ":mrgreen":"https://www.waze.com/forum/images/smilies/icon_mrgreen.gif",
                 "^^":"https://www.waze.com/forum/images/smilies/icon_mrgreen.gif", ":geek:":"https://www.waze.com/forum/images/smilies/icon_e_geek.gif", "B|":"https://www.waze.com/forum/images/smilies/icon_e_geek.gif", "ugeek":"https://www.waze.com/forum/images/smilies/icon_e_ugeek.gif", "B|-":"https://www.waze.com/forum/images/smilies/icon_e_ugeek.gif", "xD":"https://s3.amazonaws.com/tapatalk-emoji/emoji38.png"};

    function ChatdownloadHelperInjected() {
        window.ChatDownloadHelper={
            jobs: [], _waitForData: function (id)
            {
                if (this.jobs.length <= id) {
                    this.jobs[id].callback({
                        url: null,
                        data: null,
                        callback: this.jobs[id].callback,
                        status: 'error',
                        error: 'Request not found'
                    });
                }
                else
                {
                    if (this.jobs[id].status == 'success' || this.jobs[id].status == 'error')
                        this.jobs[id].callback(this.jobs[id]);
                    else
                    {
                        if (this.jobs[id].status == 'downloading' && this.jobs[id].progressCallback) {
                            this.jobs[id].progressCallback(this.jobs[id]);
                        }
                        var _this=this;
                        window.setTimeout(function () {
                            _this._waitForData(id);
                        }, 500);
                    }
                }
            },
            add: function (params, callback, progressCallback)
            {
                this.jobs.push({
                    params: params,
                    data: null,
                    callback: callback,
                    progressCallback: progressCallback,
                    status: 'added',
                    progression: 0,
                    error: ''
                });
                var id=this.jobs.length - 1;
                var _this=this;
                window.setTimeout(function () { _this._waitForData(id); }, 500);
            }
        };
    }
    var ChatdownloadHelperInjectedScript=document.createElement('script');
    ChatdownloadHelperInjectedScript.textContent='' + ChatdownloadHelperInjected.toString() + ' \n' + 'ChatdownloadHelperInjected();';
    ChatdownloadHelperInjectedScript.setAttribute('type', 'application/javascript');
    document.body.appendChild(ChatdownloadHelperInjectedScript);
    if (typeof unsafeWindow === "undefined") {
        unsafeWindow=function() {
            var dummyElem=document.createElement("p");
            dummyElem.setAttribute("onclick", "return window;");
            return dummyElem.onclick();
        }();
    }
    /******** SANDBOX PART ***************/
    function lookFordownloadHelperJob() {
        for (var i=0; i < unsafeWindow.ChatDownloadHelper.jobs.length; i++) {
            if (unsafeWindow.ChatDownloadHelper.jobs[i].status == 'added') {
                unsafeWindow.ChatDownloadHelper.jobs[i].status=cloneInto('downloading', unsafeWindow.ChatDownloadHelper.jobs[i]);
                var f=function () {
                    var job=i;
                    GM_xmlhttpRequest({
                        method: unsafeWindow.ChatDownloadHelper.jobs[job].params.method,
                        headers: unsafeWindow.ChatDownloadHelper.jobs[job].params.headers,
                        data: unsafeWindow.ChatDownloadHelper.jobs[job].params.data,
                        synchronous: false,
                        timeout: 3000,
                        url: unsafeWindow.ChatDownloadHelper.jobs[job].params.url,
                        //job: i,
                        onerror: function (r) { unsafeWindow.ChatDownloadHelper.jobs[job].status=cloneInto('error', unsafeWindow.ChatDownloadHelper.jobs[job]); },
                        ontimeout: function (r) { unsafeWindow.ChatDownloadHelper.jobs[job].status=cloneInto('error', unsafeWindow.ChatDownloadHelper.jobs[job]); },
                        onload: function (r) {
                            unsafeWindow.ChatDownloadHelper.jobs[job].status=cloneInto('success', unsafeWindow.ChatDownloadHelper.jobs[job]);
                            unsafeWindow.ChatDownloadHelper.jobs[job].data=cloneInto(r.responseText, unsafeWindow.ChatDownloadHelper.jobs[job]);
                        },
                        onprogress: function (r) { unsafeWindow.ChatDownloadHelper.jobs[job].progression=cloneInto(r.total == 0 ? 0 : (r.loaded / r.total), unsafeWindow.ChatDownloadHelper.jobs[job]); }
                    });
                }();
            }
        }
        window.setTimeout(lookFordownloadHelperJob, 500);
    }
    window.setTimeout(lookFordownloadHelperJob);

    /********* Functions ***********/
    Number.prototype.padLeft=function(base,chr){
        var  len=(String(base || 10).length - String(this).length)+1;
        return len > 0? new Array(len).join(chr || '0')+this : this;
    }
    function getId(node) {
        return document.getElementById(node);
    }
    function getElementsByClassName(classname, node) {
        node || (node=document.getElementsByTagName('body') [0]);
        for (var a=[], re=new RegExp('\\b' + classname + '\\b'), els=node.getElementsByTagName('*'), i=0, j=els.length; i < j; i++) { re.test(els[i].className) && a.push(els[i]); }
        return a;
    }
    function getFunctionWithArgs(func, args) {
        return function() {
            var json_args=JSON.stringify(args);
            return function() {
                var args=JSON.parse(json_args);
                func.apply(this, args);
            };
        }();
    }
    function isJsonString(str) {
        try { JSON.parse(str); }
        catch (e) { return false; }
        return true;
    }
    function getLink(pl) {
        var a=pl.split('?'), b=a[1].split('&');
        chatLink.MP="0", chatLink.UR="0", chatLink.MC="0";
        for (var i=0; b[i]; i++) {
            var e=b[i].split('=');
            switch(e[0]){
                case "lat": chatLink.lat=e[1]; break;
                case 'lon': chatLink.lon=e[1]; break;
                case 'zoom': chatLink.zoom=e[1]; break;
                case 'mapProblem': chatLink.MP=e[1]; break;
                case 'mapUpdateRequest': chatLink.UR=e[1]; break;
                case 'mapComments': chatLink.MC=e[1]; break;
                case 'segments': chatLink.segments=e[1]; break;
                case 'nodes': chatLink.nodes=e[1]; break;
                case 'venues': chatLink.venues=e[1]; break;
                default: break;
            }
        }
    } // From Bookmarks
    function initIdle() {
        var a=JSON.parse(localStorage.WMEChat);
        a.me=Date.now();
        localStorage.setItem('WMEChat', JSON.stringify(a));
    }
    function openClose(action) {
        var a=JSON.parse(localStorage.WMEChat);
        if (action == 'mini') {
            getId('Schat-overlay').className='visible-true connected multiple-rooms';
            getId('Schat').style.display='none';
            getId('Schat-toggle').style.display='block';
            a.open=false;
        } else {
            getId('Schat-overlay').className='visible-true connected multiple-rooms open';
            getId('Schat').style.display='block';
            getId('Schat-toggle').style.display='none';
            getId('Schat-toggle').children[0].style.backgroundColor='#fff';
            getId('message-list').scrollTop=getId('message-list').scrollHeight;
            getElementsByClassName('message-input')[0].focus();
            a.open=true;
        }
        localStorage.setItem('WMEChat', JSON.stringify(a));
    }
    function update1() {
        if (getId('_cbReduceChatMove').checked == true && getId('Schat').style.display == 'block' && y == false) { openClose('mini'); }
        resestIdle();
    }
    function resestIdle() {
        initIdle();
        sendIdle();
    }
    function urlify(text) {
        return text.replace(/(https?:\/\/[^\s]+)/g, function(url) {
            var a='';
            if (/waze/.test(url) && /editor/.test(url) && /lon/.test(url) && /lat/.test(url)) {
                idx++;
                a='<a href="#" title="'+url+'" id="chatlink_'+idx+'"><i class="crosshair fa fa-crosshairs icon-screenshot"></i></a>';
            } else if (/(.png|.gif|.jpg|.jpeg|.bmp)/.test(url) || /(venue-image.waze.com)/.test(url)) {
                a='<br><a href="'+url+'" target="_blank"><img src="'+url+'" style="max-height:200px;max-width:200px;" /></a><br>';
            } else {
                a='<a href="'+url+'" target="_blank">'+url+'</a>';
            }
            return a;
        })
    }
    function chatMoveTo(url,type) {
        W.selectionManager.unselectAll();
        if (type == "url") { chatLink={}; getLink(url); } else { chatLink = url; }
        var k=chatLink;
        W.map.olMap.setCenter(OpenLayers.Layer.SphericalMercator.forwardMercator(parseFloat(k.lon), parseFloat(k.lat)));
        W.map.olMap.zoomTo(k.zoom);
        if (typeof (k.segments)   != 'undefined') { chatObjIsLoaded('sg:'+ k.segments); }
        else if (typeof (k.nodes) != 'undefined') { chatObjIsLoaded('nd:'+ k.nodes); }
        else if (typeof (k.venues)!= 'undefined') { chatObjIsLoaded('vn:'+ k.venues); }
        else if (typeof (k.MC) != 'undefined' && k.MC != 0) { chatObjIsLoaded('mc:'+ k.MC); }
        else if (typeof (k.UR) != 'undefined' && k.UR != 0) { chatObjIsLoaded('ur:'+ k.UR); }
        else if (typeof (k.MP) != 'undefined' && k.MP != 0) { chatObjIsLoaded('mp:'+ k.MP); }
    } // From Bookmarks
    function chatObjIsLoaded(selObjects) {
        if (selObjects) {
            var objectsList=[], idObj=selObjects.substring(3).split(',');
            try {
                for (var i=0; idObj[i]; i++) {
                    // Identify type
                    switch (selObjects.substring(0, 2)) {
                        case 'sg':
                            var objType=W.selectionManager.model.segments.objects[idObj[i]];
                            var type=I18n.translations[I18n.locale].layers.name.segments;
                            break;
                        case 'nd':
                            var objType=W.selectionManager.model.nodes.objects[idObj[i]];
                            var type=I18n.translations[I18n.locale].layers.name.nodes;
                            break;
                        case 'vn':
                            var objType=W.selectionManager.model.venues.objects[idObj[i]];
                            var type=I18n.translations[I18n.locale].layers.name.landmarks;
                            break;
                        case 'ur':
                            var objType="ur";
                            var type=I18n.translations[I18n.locale].layers.name.update_requests;
                            break;
                        case 'mp':
                            var objType="mp";
                            var type=I18n.translations[I18n.locale].layers.name.problems;
                            break;
                        case 'mc':
                            var objType=W.selectionManager.model.mapComments.objects[idObj[i]];
                            var type=I18n.translations[I18n.locale].layers.name.comments;
                            break;
                        default : break;
                    }
                    // Try to select
                    if ((typeof objType === 'undefined' || typeof objType === 'string') &&
                        typeof W.map.updateRequestLayer.featureMarkers[idObj[i]] === 'undefined' &&
                        typeof W.map.problemLayer.featureMarkers[String(idObj[i].replace('%2F','/'))] === 'undefined'
                       ) {
                        count++;
                        console.info('LOOP (' + count + '): try to select '+type+' :' + idObj[i]);
                        if (count >= 10) {
                            alert(type +'\n'+ I18n.translations[I18n.locale].problems.panel.more_info.not_available);
                            count=0;
                            return;
                        }
                        setTimeout((function(){ chatObjIsLoaded(selObjects); }), 750);
                        return;
                    }
                    else {
                        if (selObjects.substring(0, 2) === 'ur') { W.map.updateRequestLayer.featureMarkers[idObj[i]].marker.icon.$div[0].click(); }
                        else if (selObjects.substring(0, 2) === 'mp') { W.map.problemLayer.featureMarkers[String(idObj[i].replace('%2F','/'))].marker.icon.$div[0].click(); }
                        else if (selObjects.substring(0, 2) === 'vn') { objectsList.push(W.model.venues.objects[idObj[i]]); }
                        else if (selObjects.substring(0, 2) === 'nd') { objectsList.push(W.model.nodes.objects[idObj[i]]); }
                        else if (selObjects.substring(0, 2) === 'mc') { objectsList.push(W.model.mapComments.objects[idObj[i]]); }
                        else { objectsList.push(W.model.segments.objects[idObj[i]]); }
                        count=0;
                    }
                }
            } catch (e) {
                console.log("error while getting selected item: ", e);
            }
            selObjects='';
            if (objType !== "none") {
                W.selectionManager.unselectAll();
                W.selectionManager.setSelectedModels(objectsList);
            }
        }
    } // From Bookmarks
    function replaceSmileys(text) {
        var regex;
        for (var k in smileys) {
            if (smileys.hasOwnProperty(k)) {
                regex=new RegExp(escapeRegExp(k), "g");
                text=text.replace(regex, function() {
                    if (isInsideLink(arguments[arguments.length - 1], arguments[arguments.length - 2])) {
                        return arguments[0];
                    } else {
                        return '<img title="' + arguments[0] + '" src="' + smileys[arguments[0]] + '" />';
                    }
                });
            }
        }
        regex=new RegExp("emoji([0-9]{1,3})", "g");
        text=text.replace(regex, function() {
            if (isInsideLink(arguments[arguments.length - 1], arguments[arguments.length - 2])) {
                return arguments[0];
            } else {
                return '<img title="' + arguments[0] + '" src="https://s3.amazonaws.com/tapatalk-emoji/' + arguments[0] + '.png" />';
            }
        });
        return text;
    } // From chat-addon
    function isInsideLink(text, pos) {
        var res=false;
        var tmp=text.replace(/(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/g, function() {
            var position=arguments[arguments.length - 2];
            if (pos >= position && pos < position + arguments[0].length) {
                res=true;
            }
        });
        return res;
    } // From chat-addon
    function escapeRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    } // From chat-addon
    function alertTo(user) {
        getElementsByClassName('message-input')[0].value += ""+user.replace(' *','')+" ";
        getElementsByClassName('message-input')[0].focus();
    }
    function checkActiveCountry() {
        if (JSON.parse(localStorage.WMEChat).autoChangeCtry == true && W.model.getTopCountry() != null && typeof(W.model.getTopCountry()) != 'undefined') {
            if (activeCountry != W.model.getTopCountry().name) {
                activeCountry=W.model.getTopCountry().name;
                getId('activeCountry').value=W.model.getTopCountry().name;
                getId('message-list').innerHTML='';
                LoadLastMessages();
                sendIdle();
            }
        }
        setTimeout(checkActiveCountry, 2000);
    } // Check active Country

    /********* Fix UI Functions ***********/
    function moveChatIcon() {
        var fname=arguments.callee.toString().match(/function ([^(]+)/)[1];
        var styles="";
        if (getId('_cbMoveChatIcon').checked) {
            styles += '#Schat-overlay { left: inherit !important; right: 60px !important; z-index: 1 !important;}';
            styles += '#Schat-overlay #Schat-toggle { right: 0px !important; }';
            addStyle('WMEChat' + fname,styles);
        } else {
            removeStyle('WMEChat' + fname);
        }
    }
    function enhanceChat() {
        var fname=arguments.callee.toString().match(/function ([^(]+)/)[1];
        var styles="";
        if (getId('_cbEnhanceChat').checked) {
            var contrast, compress;
            removeStyle('WMEChat' + fname);
            (getId('_inpUIContrast') ? contrast=getId('_inpUIContrast').value : contrast=1);
            (getId('_inpUICompression') ? compress=getId('_inpUICompression').value : compress=1);
            var mapY=getId('map').clientHeight;
            var chatY=Math.floor( mapY * 0.5);
            var chatHeaderY=[50,35,20][compress];
            var chatMessageInputY=[39,31,23][compress];
            var chatMessagesY=chatY - chatHeaderY - chatMessageInputY;
            var chatUsersY=chatY - chatHeaderY;
            //change chat width to 35% of whole window
            styles += '#Schat .messages { width: calc(25vw); min-width: 200px;}';
            styles += '#map.street-view-mode #Schat .messages { width: calc(25vw); }';
            styles += '#Schat .messages .message-list { margin-bottom: 0px; }';
            styles += '#Schat .messages .new-message { position: inherit; width: unset; }';
            styles += '#map.street-view-mode #Schat .messages .new-message { position: inherit; width: unset; }';
            styles += '#Schat .users { width: calc(10vw); min-width: 120px; }';
            styles += '#Schat .messages .message-list .message.normal-message { max-width: unset; }';
            //change chat height to 50% of map view
            styles += '#Schat .messages .message-list { min-height: ' + chatMessagesY + 'px; }';
            styles += '#Schat .users { max-height: ' + chatUsersY + 'px; }';

            //		#chat .messages .unread-messages-notification width=70%, bottom64px>
            if (compress > 0) {
                //do compression
                //header
                styles += '#Schat .header { line-height: ' + chatHeaderY + 'px; }';
                styles += '#Schat .header .dropdown .dropdown-toggle { line-height: ' + ['','30px','22px'][compress] + '; }';
                styles += '#Schat .header button { line-height: ' + ['','20px','19px'][compress] + '; font-size: ' + ['','13px','11px'][compress] + '; height: ' + ['','20px','19px'][compress] + '; }';
                //message list
                styles += '#Schat .messages .message-list { padding: ' + ['','9px','3px'][compress] + '; }';
                styles += '#Schat .messages .message-list .message.normal-message { padding: ' + ['','6px','2px'][compress] + '; }';
                styles += '#Schat .messages .message-list .message { margin-bottom: ' + ['','8px','2px'][compress] + '; line-height: ' + ['','16px','14px'][compress] + '; font-size: ' + ['','12px','11px'][compress] + '; }';
                styles += '#Schat .messages .new-message input { height: ' + chatMessageInputY + 'px; }';
                //user list
                styles += '#Schat .users { padding: ' + ['','8px','1px'][compress] + '; }';
                styles += '#Schat ul.user-list a.user { padding: ' + ['','2px','1px'][compress] + '; }';
                styles += '#Schat ul.user-list a.user .rank { width: ' + ['','25px','20px'][compress] + '; height: ' + ['','20px','16px'][compress] + '; margin-right: ' + ['','3px','1px'][compress] + '; }';
                styles += '#Schat ul.user-list a.user .username { line-height: ' + ['','21px','17px'][compress] + '; }';
                styles += '#Schat ul.user-list a.user:hover .crosshair { margin-top: ' + ['','3px','1px'][compress] + '; right: ' + ['','3px','1px'][compress] + '; }';
                //fix for WME Chat Addon
                styles += '#Schat .users > ul > li > a { margin: 0px !important; }';
            }
            if (contrast > 0) {
                //header
                styles += '#Schat .header { color: black; background-color: ' + ['','#d9d9d9','#bfbfbf'][contrast] + '; }';
                styles += '#Schat .messages .message-list { background-color: ' + ['','#e8e8e8','lightgrey'][contrast] + '; }';
                styles += '#Schat .messages .message-list .message.normal-message { color: black; float: left; }';
                styles += '#Schat .messages .message-list .message.normal-message .from { color: dimgrey; font-weight: bold; font-style: italic; }';
                styles += '#Schat .messages .message-list .message.own-message .from { color: black; background-color: #a1dcf5; }';
                //user message timestamps
                styles += '#Schat > div.Schat-body > div.messages > div.message-list > div > div.from > span { color: ' + ['','dimgrey','black'][contrast] + ' !important; }';
                //system message timestamps
                styles += '#Schat > div.Schat-body > div.messages > div.message-list > div > div.body > div > span { color: ' + ['','dimgrey','black'][contrast] + ' !important; }';
                //fix for WME Chat Addon
                styles += '#Schat .body > div { color: black !important; }';
            }
            //fix for Chat Addon timestamps running up against names
            styles += '#Schat > div.Schat-body > div.messages > div.message-list > div > div.from > span { margin-left: 5px; }';
            addStyle('WMEChat' + fname,styles);
        } else {
            removeStyle('WMEChat' + fname);
        }
    }
    function addStyle(ID, css) {
        var head, style;
        head=document.getElementsByTagName('head')[0];
        if (!head) {
            return;
        }
        removeStyle(ID); // in case it is already there
        style=document.createElement('style');
        style.type='text/css';
        style.innerHTML=css;
        style.id=ID;
        head.appendChild(style);
    }
    function removeStyle(ID) {
        var style=document.getElementById(ID);
        if (style) { style.parentNode.removeChild(style); }
    }

    /********* Live User Layer ***********/
    function checklayer(layer) {
        if(W.map.getLayersBy("uniqueName",layer).length === 0) {
            var LU_style=new OpenLayers.Style({
                pointRadius: 2,
                fontWeight: "normal",
                label : "${labelText}",
                fontFamily: "Tahoma, Courier New",
                labelOutlineColor: "#FFFFFF",
                labelOutlineWidth: 2,
                fontColor: '#000000',
                fontSize: "10px"
            });
            if (layer=="__WME_LiveUser") {
                liveUsers_Layer=new OpenLayers.Layer.Vector("Editeurs", {
                    displayInLayerSwitcher: true,
                    uniqueName: layer,
                    shortcutKey: "S+q"
                    //styleMap: new OpenLayers.StyleMap(LU_style)
                });
                liveUsers_Layer.setVisibility(false);
                W.map.addLayer(liveUsers_Layer);
                I18n.translations[I18n.locale].layers.name[layer]="Editeurs Connectés";
            }
        }
    }
    function createToggler(){
        // Layers switcher
        // test with script toggler----------------
        var oldTogglers=document.querySelectorAll('.togglers');
        oldTogglers.forEach(function(elt,indx){
            if(elt.id != "toolboxUl"){
                if (oldTogglers[indx].querySelector('.layer-switcher-group_scripts') === null) {
                    var newScriptsToggler=document.createElement('li');
                    newScriptsToggler.className='group';
                    newScriptsToggler.innerHTML='<div class="controls-container main toggler">\<input class="layer-switcher-group_scripts toggle" id="layer-switcher-group_scripts" type="checkbox">\<label for="layer-switcher-group_scripts">\<span class="label-text">Scripts</span>\</label>\</div>\<ul class="children">\</ul>';
                    oldTogglers[indx].appendChild(newScriptsToggler);
                }

                var groupScripts=document.querySelector('.layer-switcher-group_scripts').parentNode.parentNode;
                var newScriptsChildren=getElementsByClassName("children", groupScripts)[0];

                var WMECS_toggleUser=document.createElement('li');
                WMECS_toggleUser.innerHTML='<div class="controls-container toggler">\<input class="layer-switcher-item_WME_liveUsers toggle" id="layer-switcher-item_WME_liveUsers" type="checkbox">\<label for="layer-switcher-item_WME_liveUsers">\<span class="label-text">Éditeurs (LiveUsers)</span>\</label>\</div>';
                newScriptsChildren.appendChild(WMECS_toggleUser);
                var toggleUser=getId('layer-switcher-item_WME_liveUsers');

                newScriptsChildren.appendChild(WMECS_toggleUser);

                var groupToggler=getId('layer-switcher-group_scripts');
                groupToggler.checked=(typeof(localStorage.groupScriptsToggler) !=="undefined" ?
                                      JSON.parse(localStorage.groupScriptsToggler) : true);

                toggleUser.disabled=!groupToggler.checked;
                toggleUser.addEventListener('click', function(e) {
                    liveUsers_Layer.setVisibility(e.target.checked);
                    var a=JSON.parse(localStorage.WMEChat);
                    a.liveUsers=e.target.checked;
                    localStorage.setItem('WMEChat', JSON.stringify(a));
                });

                groupToggler.addEventListener('click', function(e) {
                    toggleUser.disabled=!e.target.checked;
                    liveUsers_Layer.setVisibility(toggleUser.checked ? e.target.checked : toggleUser.checked);
                    localStorage.setItem('groupScriptsToggler', e.target.checked);
                });
            }
        });

    }
    function update_liveuser(listNicknames) {
        if (liveUsers_Layer.visibility == true && listNicknames.length != 0) {
            liveUsers_Layer.destroyFeatures();
            for (var k=0; k < listNicknames.length; k++) {
                if (listNicknames[k].user != nick) {
                    var marker=new OpenLayers.Feature.Vector(Geometrize(listNicknames[k].user, listNicknames[k].lon, listNicknames[k].lat), null, {
                        fillOpacity: 1,
                        fontSize: 15,
                        fontColor: "#ffff00",
                        label: listNicknames[k].user,
                        labelYOffset: 22,
                        labelOutlineColor: "#ff0000",
                        labelOutlineWidth: 5,
                        stroke: true,
                        strokeColor: "#ff0000",
                        strokeWidth: 15,
                        strokeDashstyle: "solid"
                    });
                    var showLiveUsers_Layer=W.map.layers.find(function (l) { return l.uniqueName == "__WME_LiveUser"; });
                    showLiveUsers_Layer.addFeatures(marker);
                }
            }
        }
    }
    function Geometrize(Name, lon, lat) {
        var polyPoints= new OpenLayers.Geometry.Point(lon,lat).transform( new OpenLayers.Projection("EPSG:4326") , W.map.getProjectionObject());
        var polygon=new OpenLayers.Geometry.Polygon(new OpenLayers.Geometry.LinearRing(polyPoints));
        return polygon;
    }

    /********* THE French Chat ***********/
    function Chatinit() {
        if (!getId('map')) { setTimeout(Chatinit, 1000); return; }
        if (typeof(W.model) === 'undefined') { setTimeout(Chatinit, 500); return; }
        if (typeof(W.loginManager.user) === 'undefined' || W.loginManager.user === null) { setTimeout(Chatinit, 500); return; }
        if(typeof(W.model.getTopCountry()) === 'undefined' || W.model.getTopCountry() === null) { setTimeout(Chatinit, 500); return; }
        if(typeof(W.model.chat.messages) === 'undefined' || W.model.getTopCountry() === null) { setTimeout(Chatinit, 500); return; }
        if (typeof (getId('user-info')) === 'undefined') { setTimeout(Chatinit, 500); return; }
        if (typeof (getId('chat')) === 'undefined') { setTimeout(Chatinit, 500); return; }
        if (typeof (getElementsByClassName('nav-tabs', getId('user-info')) [0]) === 'undefined') { setTimeout(Chatinit, 500); return; }
        if(typeof(OL) === 'undefined'){ setTimeout(Chatinit, 500); return; }
        if(document.querySelector('.togglers') === null){ setTimeout(Chatinit, 500); return; }

        Chathtml();
    }
    function Chathtml() {
        if ('undefined' === typeof localStorage.WMEChat || !isJsonString(localStorage.WMEChat)) { localStorage.setItem('WMEChat', '{"open":true, "me":'+Date.now()+', "lastMsg":'+Date.now()+', "alertSound": true, "alertNewMsg": false}'); }
        if ('undefined' === typeof localStorage.WMEChatNick || !isJsonString(localStorage.WMEChatNick)) { localStorage.setItem('WMEChatNick', '[]'); }
        //chat-addon settings backup
        var a=JSON.parse(localStorage.WMEChat);
        if (!a.alertMatch) { if ('undefined' === typeof localStorage.WMEChatAddon_settings) {  a.alertMatch=nick; } else { var b=JSON.parse(localStorage.WMEChatAddon_settings); a.alertMatch=b.alertMatch; } }
        if (!a.alertBGColor) { if ('undefined' === typeof localStorage.WMEChatAddon_settings) {  a.alertBGColor='#ffcccc'; } else { var b=JSON.parse(localStorage.WMEChatAddon_settings); a.alertBGColor='#'+b.alertBGColor; } }
        if (!a.messageBGColor) { if ('undefined' === typeof localStorage.WMEChatAddon_settings) {  a.messageBGColor='#eeeeee'; } else { var b=JSON.parse(localStorage.WMEChatAddon_settings); a.messageBGColor='#'+b.messageBGColor; } }
        localStorage.setItem('WMEChat', JSON.stringify(a));
        activeCountry=W.model.getTopCountry().name;

        //LiverUsers layer
        /*createToggler();
        checklayer("__WME_LiveUser");
        (JSON.parse(localStorage.WMEChat).liveUsers == true ? getId('layer-switcher-item_WME_liveUsers').checked=true : false);
        liveUsers_Layer.setVisibility(JSON.parse(localStorage.WMEChat).liveUsers);*/

        //CSS part
        var Scss=document.createElement('style');
        Scss.type='text/css';
        var css='#Schat-overlay { z-index:9000 !important; bottom:26px; left:20px; display:none; position:absolute; pointer-events:none; font-weight:400; }';
        css += '#Schat-overlay.visible-true.has-unread-messages #Schat-toggle button { background-image:url(//editor-assets.waze.com/production/img/status-msg-v267d6b462a32327fb1bf722dbfb8763b.png); }';
        css += '#Schat-overlay.visible-false .messages .message-list { margin-bottom:0px; }';
        css += '#Schat-overlay.visible-false .messages .new-message { display:none; }';
        css += '#Schat-overlay.visible-false #Schat-toggle button { -webkit-filter:grayscale(100%); filter:grayscale(100%); }';
        css += '#Schat-overlay.visible-false #Schat-toggle button:after { opacity:0.5; }';
        css += '#Schat-overlay.visible-false.has-unread-messages #Schat-toggle button { background-image:url(//editor-assets.waze.com/production/img/status-msga23027f611d1e8a683f16c485ed5a05a.png); }';
        css += '#Schat-overlay #Schat-toggle { height:40px; position:absolute; bottom:0; -webkit-transition:all 0.3s; -o-transition:all 0.3s; transition:all 0.3s; opacity:1; pointer-events:auto; }';
        css += '#Schat-overlay #Schat-toggle button { border:none; background-color:white; color:white; border-radius:5px 5px 0px 0px; width:43px; height:40px; }';
        css += '#Schat-overlay #Schat-toggle button:after { content:""; background-image: url(//editor-assets.waze.com/production/img/buttons756c103910d73f4d45328e08f6016871.png); background-position:0px 0px; width:24px; height:24px; position:absolute; left:10px; top:8px; }';
        css += '@media (-webkit-min-device-pixel-ratio: 2), (-o-min-device-pixel-ratio: 2/1), (min-resolution: 192dpi) { #Schat-overlay #Schat-toggle button:after { background-image:url(//editor-assets.waze.com/production/img/buttons@2xe486884f6841e9520d047738a688f357.png); background-size:96px 81px; } }';
        css += '#Schat-overlay #Schat-toggle button:focus { outline:none; }';
        css += '#Schat-overlay #Schat { display:none; }';
        css += '#Schat-overlay.open { pointer-events:auto; }';
        css += '#Schat-overlay.open #Schat-toggle { display:none; pointer-events:none; }';
        css += '#Schat-overlay.open #Schat { display:block; }';
        css += '#Schat-overlay.connected .not-connected-message { display:none; }';
        css += '#Schat-overlay.connected .Schat-body { display:-webkit-box; display:-ms-flexbox; display:flex; }';

        css += '#Schat { position:relative; overflow:hidden; border-radius:5px 5px 0px 0px; }';
        css += '#Schat .header { width:100%; background-color:#f1f1f1; line-height:35px; font-size:14px; color:#354148; padding-left:0px; padding-right:10px; }';
        css += '#Schat .header .dropdown.room-selector { display:none; }';
        css += '#Schat .header .single-room-label { padding-left:15px; }';
        css += '#Schat .header .room-name, #Schat .header .status { font-size:13px; }';
        css += '.multiple-rooms #Schat .header .dropdown.room-selector { display:inline-block; }';
        css += '.multiple-rooms #Schat .header .single-room-label { display:none; }';
        css += '#Schat .header .dropdown { display:inline-block; }';
        css += '#Schat .header .dropdown .dropdown-toggle { text-decoration:none; line-height:41px; display:inline-block; padding-left:15px; padding-right:10px; cursor:pointer; }';
        css += '#Schat .header .dropdown .dropdown-toggle span { text-decoration:underline; }';
        css += '#Schat .header .dropdown .dropdown-toggle .fa-angle-down { margin-left:5px; }';
        css += '#Schat .header .dropdown .dropdown-menu { border:none; padding:0; }';
        css += '#Schat .header .dropdown .dropdown-menu li:first-child { border-bottom:1px solid #e9e9e9; }';
        css += '#Schat .header .dropdown .dropdown-menu li a { line-height:30px; padding:0px; text-decoration:none; cursor:pointer; }';
        css += '#Schat .header .dropdown .dropdown-menu li a:hover { background:#eff4f4; }';
        css += '#Schat .header .dropdown .dropdown-menu li a::before { content:"\00a0"; display:block; float:left; width:20px; text-align:center; }';
        css += '#Schat .header .dropdown .dropdown-menu li.checked { pointer-events:none; }';
        css += '#Schat .header .dropdown .dropdown-menu li.checked a::before { display:inline-block; font:normal normal normal 14px/1 FontAwesome; font-size:inherit; text-rendering:auto; -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale; content:""; font-size:10px; line-height:inherit; }';
        css += '#Schat .header .dropdown li.radio-toggle { position:relative; }';
        css += '#Schat .header .dropdown li.radio-toggle a { padding-left:25px; }';
        css += '#Schat .header .dropdown li.radio-toggle i { display:none; position:absolute; left:5px; top:2px; }';
        css += '#Schat .header .dropdown li.radio-toggle input { display:none; }';
        css += '#Schat .header button { float:right; color:white; font-weight:normal; line-height:30px; font-size:16px; background:none; opacity:1; text-shadow:none; border:0; margin-left:5px; }';
        css += '#Schat .header button:focus { outline:none; }';
        css += '#Schat .header button.minimize { color:#354148; }';
        css += '#Schat .messages { width:427px; border-right:1px solid rgba(126, 126, 126, 0.26); margin-right:-2px; }';
        css += '#Schat .messages .unread-messages-notification { display:none; position:absolute; bottom:64px; padding:2px 10px; left:0px; width:427px; color:#59899e; background-color:#e9e9e9; font-size:11px; font-weight:bold; font-weight:600; text-align:center; }';
        css += '#Schat .messages .unread-messages-notification:hover { color:#f1f1f1; }';
        css += '.visible-false #Schat .messages .unread-messages-notification { bottom:0px; }';
        css += '#Schat .messages .message-list { padding:15px; min-height:323px; max-height:250px; overflow-y:auto; overflow-x:hidden; margin-bottom:39px; }';
        css += '#Schat .messages .message-list .message { margin-bottom:14px; clear:both; }';
        css += '#Schat .messages .message-list .message.system-message .body { font-size:12px; color:#8c8c8c; text-align:center; }';
        css += '#Schat .messages .message-list .message.system-message .body > div { display:block; text-align:center !important; }';
        css += '#Schat .messages .message-list .message.system-message .body > div:after, #Schat .messages .message-list .message.system-message .body > div:before { display:inline-block; content:""; width:20px; height:1px; background:#dadada; position:relative; margin-left:5px; margin-right:5px; top:-3px; }';
        css += '#Schat .messages .message-list .message .from { display:block; color:#59899e; font-size:13px; font-weight:bold; font-weight:600; }';
        css += '#Schat .messages .message-list .message.normal-message { background:#fbfdff; border:1px solid #d7e4f9; border-radius:8px; padding:10px; padding-top:8px; max-width:320px; min-width:150px; float:right; }';
        css += '#Schat .messages .message-list .message.normal-message .from { color:#8c8c8c; font-size:13px; font-weight:normal; }';
        css += '#Schat .messages .message-list .message.own-message { background:#ffffff; border:1px solid rgba(181, 181, 181, 0.15); float:left; }';
        css += '#Schat .messages .message-list .message.own-message .from { color:#00c6ff; }';
        css += '#Schat .messages .new-message { position:absolute; bottom:0; width:427px; }';
        css += '#Schat .messages .new-message input { width:100%; height:39px; border:0 none; border-top:1px solid rgba(126, 126, 126, 0.26); border-right:1px solid rgba(126, 126, 126, 0.26); padding:0 15px; -webkit-box-shadow:0px 2px 0px #e9e9e9 inset; box-shadow:0px 2px 0px #e9e9e9 inset; margin:0px; }';
        css += '#Schat .messages .new-message input:focus { outline:none; }';
        css += '#Schat .users { min-height:110px; padding:15px; max-height:407px; width:195px; vertical-align:top; overflow-y:auto; overflow-x:hidden; }';
        css += '#Schat ul.user-list a.user { display:block; color:#354148; text-decoration:none !important; border:1px solid transparent; padding:3px; padding-left:8px; border-radius:5px; cursor:pointer; -webkit-transition:all 0.2s; -o-transition:all 0.2s; transition:all 0.2s; }';
        css += '#Schat ul.user-list a.user .crosshair { display:none; }';
        css += '#Schat ul.user-list a.user .username { font-size:12px; font-weight:bold; font-weight:600; white-space:nowrap; overflow:hidden; -o-text-overflow:ellipsis; text-overflow:ellipsis; line-height:25px; text-decoration:none !important; }';
        css += '#Schat ul.user-list a.user .rank { float:left; margin-right:5px; background-image:url(//editor-assets.waze.com/production/img/chatconeaff200748fb8b9db2a2ebfefdf7dce01.png); background-size:100% 100%; width:25px; height:20px; font-size:10px; /*rtl:ignore*/ text-align:right; line-height:normal; color:#bf5e1f; /*rtl:ignore*/ padding-right:5px; padding-top:1px; }';
        css += '#Schat ul.user-list a.user.current-user { pointer-events:none; color:#26bae8; }';
        css += '#Schat ul.user-list a.user:hover { border:1px solid #dadada; }';
        css += '#Schat ul.user-list a.user:hover .crosshair { display:block; float:right; margin-top:5px; right:5px; position:relative; }';
        css += '#Schat ul.user-list a.user:hover.current-user .crosshair { display:none; }';
        css += '#Schat .not-connected-message { min-width:250px; text-align:center; padding:20px 40px; color:#999; font-style:italic; background-color:white; }';
        css += '#Schat .Schat-body { display:none; min-height:100px; background-color:white; }';
        css += '#Schat .Schat-body:before, #Schat .chat-body:after { content:" "; display:table; }';
        css += '#Schat .Schat-body:after { clear:both; }';
        css += '.fieldset { clear:both; border:1px solid #ccc; padding:5px; border-radius:4px; margin-bottom:5px; }';
        css += '.fieldset input { margin:0; }';
        css += '.fieldsetlegend { margin-bottom:0px; border-bottom-style:none; width:auto; }';
        css += '.beta { float:right; margin-right:5px; font-style:italic;font-size:10px; }';
        css += '.deezer {  width:calc(12vw); position:absolute; bottom:-5px; right:-4px; }';
        Scss.innerHTML=css;
        document.body.appendChild(Scss);

        //TAB part
        var newTab=document.createElement('li');
        newTab.innerHTML='<a href="#sidepanel-wmechat" data-toggle="tab" id="tabchat"><span class="fa fa-commenting" title="WME Chat"></span></a>';
        getElementsByClassName('nav-tabs', getId('user-info')) [0].appendChild(newTab);
        var addon=document.createElement('section');
        addon.id='wmechat-addon';
        var content='<div style="float:left;margin:10px 5px;"><b><a href="https://greasyfork.org/fr/scripts/392031-wme-chat" target="_blank"><u>WME Chat</u></a></b> v' + GM_info.script.version + '</div><br>'
        +'<fieldset class="fieldset"><legend class="fieldsetlegend"><h6><i class="fa fa-bell"></i> Sons</h6></legend>'
        +'Alerte sur :<br>'
        +'<input id="alarmList" style="width:100%;height:28px;padding-left:5px;margin:3px 0 10px;background-color:#fff;border:1px solid #bbb;border-radius:5px;font-size:12px;" />'
        +'<br><input type="checkbox" id="activealarm" style="margin-right:5px;"/><label for="activealarm" style="font-weight:normal;">Jouer un son sur l\'alerte</label>'
        +'<br><input type="checkbox" id="newmsg" style="margin-right:5px;"/><label for="newmsg" style="font-weight:normal;">Jouer un son &agrave; chaque nouveau message</label></fieldset>'

        +'<fieldset class="fieldset"><legend class="fieldsetlegend"><h6><i class="fa fa-paint-brush"></i> Couleurs</h6></legend>'
        +'<input type="color" id="messageBGColor" style="height:30px;margin:3px 10px 0 0;border:1px solid #bbb;border-radius:5px;" value="'+JSON.parse(localStorage.WMEChat).messageBGColor+'" />'
        +'<label for="messageBGColor" style="font-weight:normal;">Couleur de fond de mes messages</label><br>'
        +'<input type="color" id="alertBGColor" style="height:30px;margin:3px 10px 0 0;border:1px solid #bbb;border-radius:5px;" value="'+JSON.parse(localStorage.WMEChat).alertBGColor+'" />'
        +'<label for="alertBGColor" style="font-weight:normal;">Couleur d\'alerte</label></fieldset>'

        +'<fieldset class="fieldset"><legend class="fieldsetlegend"><h6><i class="fa fa-gear"></i> Options</h6></legend>'
        +'<input type="checkbox" id="_cbEnhanceChat" /><label for="_cbEnhanceChat" style="font-weight:normal;"> Compresser / Améliorer le Chat</label><br>'
        +'<input type="checkbox" id="_cbMoveChatIcon" /><label for="_cbMoveChatIcon" style="font-weight:normal;"> Déplacer l\'icône du Chat à droite</label><br>'
        +'<input type="checkbox" id="_cbReduceChatMove" /><label for="_cbReduceChatMove" style="font-weight:normal;"> Réduire le chat quand on édite</label><br>'
        +'<input type="checkbox" id="_cbautoChangeCtry" /><label for="_cbautoChangeCtry" style="font-weight:normal;"> Changement de pays automatique</label><br>'
        +'<input type="checkbox" id="_cbaddDate" /><label for="_cbaddDate" style="font-weight:normal;"> Ajouter jour et mois</label><br>'
        +'<input type="checkbox" id="_cbShowInac" /><label for="_cbShowInac" style="font-weight:normal;"> Afficher les inactifs du chat natif</label></fieldset>'

        +'<fieldset class="fieldset"><legend class="fieldsetlegend"><h6><i class="fa fa-music"></i> Deezer</h6></legend>'
        +'<input type="checkbox" id="activeDeezer" style="margin-right:5px;"/><label for="activedeez" style="font-weight:normal;">Afficher le lecteur</label>'
        +'<br>ID Playlist :<br>'
        +'<input id="deezerPlayList" style="width:90%;height:28px;padding-left:5px;margin:3px 0 10px;background-color:#fff;border:1px solid #bbb;border-radius:5px;font-size:12px;" value="'+JSON.parse(localStorage.WMEChat).deezerPlayList+'"/>'
        +'<i id="deezerRefresh" class="fa fa-refresh" style="margin-left:10px;color:lightgrey;"></i></fieldset>';
        addon.innerHTML=content;

        if (/B/.test(GM_info.script.version) === true) {
            var beta='<fieldset class="fieldset"><legend class="fieldsetlegend"><h6><i class="fa fa-flask"></i> Beta (Info du natif)</h6></legend>'
            +'Pays actif : <div id="nativeCountry" class="beta"></div><br>'
            +'Visible ? <div id="invisible" class="beta"></div><br>'
            +'Chat affiché ? <div id="reduce" class="beta"></div><br>'
            +'Nb éditeurs connectés : <div id="nbConnect" class="beta"></div><br>'
            +'Nb messages : <div id="nbMessage" class="beta"></div><br>'
            +'Type message : <div id="typemessage" class="beta"></div><br>'
            +'Auteur : <div id="lastAuthor" class="beta"></div><br>'
            +'Dernier message : <div id="lastMessage" class="beta"></div></fieldset>';
            addon.innerHTML=content+beta;
        }

        addon.id='sidepanel-wmechat';
        addon.className='tab-pane';
        getElementsByClassName('tab-content', getId('user-info')) [0].appendChild(addon);

        getId('alarmList').onkeyup=(function () {
            var a=JSON.parse(localStorage.WMEChat);
            if (getId('alarmList').value == '') { v.value=nick; }
            a.alertMatch=getId('alarmList').value=getId('alarmList').value.replace(';', ',').replace(' ', ',').replace(',,', ',');
            localStorage.setItem('WMEChat', JSON.stringify(a));
        });

        getId('activealarm').onclick=(function(){
            var a=JSON.parse(localStorage.WMEChat);
            (getId('activealarm').checked == true ? a.alertSound=true : a.alertSound=false)
            localStorage.setItem('WMEChat', JSON.stringify(a));
        });
        (JSON.parse(localStorage.WMEChat).alertSound == true ? getId('activealarm').checked=true : false);

        getId('newmsg').onclick=(function(){
            var a=JSON.parse(localStorage.WMEChat);
            (getId('newmsg').checked == true ? a.alertNewMsg=true : a.alertNewMsg=false)
            localStorage.setItem('WMEChat', JSON.stringify(a));
        });
        (JSON.parse(localStorage.WMEChat).alertNewMsg == true ? getId('newmsg').checked=true : false);

        getId('messageBGColor').onchange=(function(){
            var a=JSON.parse(localStorage.WMEChat);
            a.messageBGColor=getId('messageBGColor').value;
            localStorage.setItem('WMEChat', JSON.stringify(a));
        });

        getId('alertBGColor').onchange=(function(){
            var a=JSON.parse(localStorage.WMEChat);
            a.alertBGColor=getId('alertBGColor').value;
            localStorage.setItem('WMEChat', JSON.stringify(a));
        });

        getId('_cbEnhanceChat').onclick=(function(){
            var a=JSON.parse(localStorage.WMEChat);
            (getId('_cbEnhanceChat').checked == true ? a.enhanceChat=true : a.enhanceChat=false)
            localStorage.setItem('WMEChat', JSON.stringify(a));
            enhanceChat();
        });
        (JSON.parse(localStorage.WMEChat).enhanceChat == true ? getId('_cbEnhanceChat').checked=true : false);

        getId('_cbMoveChatIcon').onclick=(function(){
            var a=JSON.parse(localStorage.WMEChat);
            (getId('_cbMoveChatIcon').checked == true ? a.moveChatIcon=true : a.moveChatIcon=false)
            localStorage.setItem('WMEChat', JSON.stringify(a));
            moveChatIcon();
        });
        (JSON.parse(localStorage.WMEChat).moveChatIcon == true ? getId('_cbMoveChatIcon').checked=true : false);

        getId('_cbReduceChatMove').onclick=(function(){
            var a=JSON.parse(localStorage.WMEChat);
            (getId('_cbReduceChatMove').checked == true ? a.reduceChat=true : a.reduceChat=false)
            localStorage.setItem('WMEChat', JSON.stringify(a));
        });
        (JSON.parse(localStorage.WMEChat).reduceChat == true ? getId('_cbReduceChatMove').checked=true : false);

        getId('_cbautoChangeCtry').onclick=(function(){
            var a=JSON.parse(localStorage.WMEChat);
            (getId('_cbautoChangeCtry').checked == true ? a.autoChangeCtry=true : a.autoChangeCtry=false)
            localStorage.setItem('WMEChat', JSON.stringify(a));
        });
        (JSON.parse(localStorage.WMEChat).autoChangeCtry == true ? getId('_cbautoChangeCtry').checked=true : false);

        getId('_cbaddDate').onclick=(function(){
            var a=JSON.parse(localStorage.WMEChat);
            (getId('_cbaddDate').checked == true ? a.addDate=true : a.addDate=false)
            localStorage.setItem('WMEChat', JSON.stringify(a));
        });
        (JSON.parse(localStorage.WMEChat).addDate == true ? getId('_cbaddDate').checked=true : false);

        getId('_cbShowInac').onclick=(function(){
            var a=JSON.parse(localStorage.WMEChat);
            (getId('_cbShowInac').checked == true ? a.showInac=true : a.showInac=false)
            localStorage.setItem('WMEChat', JSON.stringify(a));
        });
        (JSON.parse(localStorage.WMEChat).showInac == true ? getId('_cbShowInac').checked=true : false);

        getId('activeDeezer').onclick=(function(){
            var a=JSON.parse(localStorage.WMEChat);
            if (getId('activeDeezer').checked == true && getId('deezerPlayList').value != '') {
                a.activeDeezer=true;
                getElementsByClassName('users', getId('Schat'))[0].style.maxHeight='348px';
                getId('deezerRefresh').style.color='inherit';
                getId('deezer').innerHTML='<iframe scrolling="no" frameborder="0" allowTransparency="true" src="https://www.deezer.com/plugins/player?format=classic&autoplay=false&playlist=true&width=200&height=58&color=0400ff&layout=&size=medium&type=playlist&id='+getId('deezerPlayList').value+'&app_id=1" width="200" height="58"></iframe>';
            }
            else {
                a.activeDeezer=false;
                getElementsByClassName('users', getId('Schat'))[0].style.maxHeight='407px';
                getId('deezerRefresh').style.color='lightgrey';
                getId('deezer').innerHTML='';
            }
            localStorage.setItem('WMEChat', JSON.stringify(a));
        });
        (JSON.parse(localStorage.WMEChat).activeDeezer == true ? getId('activeDeezer').checked=true : false);

        getId('deezerPlayList').onkeyup=(function () {
            if (getId('deezerPlayList').value == '') { getId('deezerRefresh').style.color='lightgrey'; }
            var a=JSON.parse(localStorage.WMEChat);
            //getId('deezerPlayList').value=a.deezerPlayList;
            a.deezerPlayList=getId('deezerPlayList').value=getId('deezerPlayList').value;
            localStorage.setItem('WMEChat', JSON.stringify(a));
        });

        getId('deezerRefresh').onclick=(function(){
            if (getId('activeDeezer').checked == true && getId('deezerPlayList').value != '') {
                getId('deezer').innerHTML='<iframe scrolling="no" frameborder="0" allowTransparency="true" src="https://www.deezer.com/plugins/player?format=classic&autoplay=false&playlist=true&width=200&height=58&color=0400ff&layout=&size=medium&type=playlist&id='+getId('deezerPlayList').value+'&app_id=1" width="200" height="58"></iframe>';
            }
        });

        //Chat part
        var chato=document.createElement('div');
        chato.id='Schat-overlay';
        chato.className='visible-true connected multiple-rooms open';
        chato.style.display='block';
        getId('chat-overlay').appendChild(chato);

        var chatt=document.createElement('div');
        chatt.id='Schat-toggle';
        chatt.style.width='42px';
        chatt.style.height='40px';
        chatt.innerHTML='<button id="chatbutton" class="toggle" style="background-color=lightgrey;"></button>';
        chatt.onclick=function() { openClose('maxi'); }
        chato.appendChild(chatt);

        var chat=document.createElement('div');
        chat.id='Schat';
        chato.appendChild(chat);

        //HEADER
        var chath=document.createElement('div');
        chath.className='header';
        chath.style.lineHeight='35px';
        chath.style.paddingLeft='10px';
        chat.appendChild(chath);

        var chatsy=document.createElement('div');
        chatsy.id='chatsy';
        chatsy.innerHTML='<i class="fa fa-random" title="Synch with native chat"></i>';
        chatsy.style.marginRight ='7px';
        chatsy.style.float ='left';
        chath.appendChild(chatsy);

        var chaths=document.createElement('input');
        chaths.id='activeCountry';
        chaths.style.width='200px';
        chaths.style.height='25px';
        chaths.style.paddingLeft='5px';
        chaths.value=activeCountry;
        chath.appendChild(chaths);

        var chathb=document.createElement('button');
        chathb.id='changeCountry';
        chathb.style.position='absolute';
        chathb.style.left='225px';
        chathb.style.top='5px';
        chathb.style.height='25px';
        chathb.style.lineHeight='25px';
        chathb.style.color='#666666';
        chathb.style.fontSize='26px';
        chathb.innerHTML='<i class="fa fa-caret-right"></i>';
        chathb.onclick=(function(){
            if (getId('activeCountry').value == '') { getId('activeCountry').value='France'; }
            activeCountry=getId('activeCountry').value;
            getId('message-list').innerHTML='';
            LoadLastMessages();
            sendIdle();
        });
        chath.appendChild(chathb);

        var chathm=document.createElement('button');
        chathm.className='minimize';
        chathm.type='button';
        chathm.innerHTML='_';
        chathm.style.position ='absolute';
        chathm.style.right ='5px';
        chathm.style.top ='-5px';
        chathm.onclick=function () { openClose('mini'); };
        chath.appendChild(chathm);

        //BODY
        var chatb=document.createElement('div');
        chatb.className='Schat-body';
        chat.appendChild(chatb);

        var chatm=document.createElement('div');
        chatm.className='messages';
        chatm.style.marginBottom='5px';
        chatm.style.padding='5px';
        chatb.appendChild(chatm);

        var chatml=document.createElement('div');
        chatml.className='message-list';
        chatml.id='message-list';
        chatml.style.maxHeight='290px';
        chatml.style.padding='5px';
        chatml.style.backgroundColor='#f6f6f6';
        chatm.appendChild(chatml);

        var chatpl=document.createElement('i');
        chatpl.className='fa fa-link';
        chatpl.style.float='right';
        chatpl.style.marginTop='16px';
        chatpl.style.fontSize='16px';
        chatpl.style.zIndex='1';
        chatpl.style.position='relative';
        chatpl.onclick=(function () {
            getElementsByClassName('message-input')[0].value += getElementsByClassName('permalink')[0].href;
            getElementsByClassName('message-input')[0].focus();
        });
        chatm.appendChild(chatpl);

        var chatnm=document.createElement('div');
        chatnm.className='new-message';
        chatnm.style.paddingRight='30px';
        chatnm.innerHTML='<input class="message-input" placeholder="Le message va ici..." data-auto-rtl="" style="direction: ltr; text-align: left;">';
        chatnm.onkeypress=function(e){
            if (!e) e=window.event;
            var keyCode=e.keyCode || e.which;
            if (keyCode == '13' && e.target.value != ''){
                if (getId('chat-overlay').style.display == 'block') { W.model.chat.sendMessage(e.target.value); } // send to the native chat
                var msg=e.target.value.replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/%/g,'&percnt;').replace(/\|/g,'&ndash;');
                SendMessage(encodeURIComponent(msg));
                e.target.value="";
            }
        }
        chatm.appendChild(chatnm);

        var chatu=document.createElement('div');
        chatu.className='users';
        chatu.style.padding='5px';
        chatu.style.width='calc(12vw)';
        chatb.appendChild(chatu);

        var chatdz=document.createElement('div');
        chatdz.className='deezer';
        chatdz.id='deezer';
        chatdz.style.width='calc(12vw)';
        chatb.appendChild(chatdz);

        var chatul=document.createElement('ul');
        chatul.className='list-unstyled user-list';
        chatul.id='user-list';
        chatu.appendChild(chatul);

        nick=W.loginManager.user.userName;

        if (/B/.test(GM_info.script.version) === false) {
            if (W.model.chat.attributes.visible === false) { getElementsByClassName("dropdown-menu visibility", getId("chat"))[0].children[0].children[0].click(); } // Force visibility
            getElementsByClassName("minimize", getId("chat"))[0].click(); // Force reduce native chat
            getId('chat-toggle').style.display='none'; // Force hide reduced native chat
            getId('chat').style.display='none'; // Force hide native chat
        }

        (a.open ? openClose('maxi') : openClose('mini'))
        getId('alarmList').value=a.alertMatch;
        if (getId('alarmList').value == "") { getId('alarmList').value=nick; }
        localStorage.setItem('WMEChat', JSON.stringify(a));

        W.map.events.register('moveend', W.map, update1);
        W.map.events.register("zoomend", W.map, update1);
        window.addEventListener('resize', enhanceChat, true);

        checkActiveCountry();
        enhanceChat();
        moveChatIcon();
        connecting();
    }
    function connecting() { // T'ajoute à la liste des connectés
        initIdle();
        chatLink={};
        getLink(getElementsByClassName('permalink')[0].href);
        var me={};
        me.id=W.loginManager.user.id;
        me.country=activeCountry;
        me.user=nick;
        me.rank=(W.loginManager.user.rank+1);
        me.idle=Date.now();
        me.lon=chatLink.lon;
        me.lat=chatLink.lat;
        me.zoom=chatLink.zoom;

        var params={
            url: 'http://limageenboite.fr/chat_connect.php',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            data: 'nickname='+ JSON.stringify(me),
            method: 'POST'
        };
        ChatDownloadHelper.add(params, function (data) {
            if (data.data == 'Check') {
                LoadLastMessages();
            }
        });
    }
    function sendIdle() { // Met à jour ton Idle sur le serveur
        chatLink={};
        getLink(getElementsByClassName('permalink')[0].href);
        var me={};
        me.id=W.loginManager.user.id;
        me.idle=Date.now();
        me.country=activeCountry;
        me.lon=chatLink.lon;
        me.lat=chatLink.lat;
        me.zoom=chatLink.zoom;

        var params={
            url: 'http://limageenboite.fr/chat_connect.php',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            data: 'idle='+ JSON.stringify(me),
            method: 'POST'
        };
        ChatDownloadHelper.add(params, function (data) {
            if (data.data == 'Check') { initIdle(); }
        });
    }
    function LoadLastMessages() {
        //console.log("Load Last 20 Messages");
        var params={
            url: 'http://limageenboite.fr/chat_connect.php?loadlast='+activeCountry,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            data: null,
            method: 'GET'
        };
        ChatDownloadHelper.add(params, function (data) {
            if (data.status == 'success') {
                if (data.data != 'undefined') {
                    getId('message-list').innerHTML ='';
                    ShowMessage('no',data);
                    setTimeout(LoadInfos, 1500);
                }
            }
        }, null);
    }
    function LoadInfos() {

        //------------------------------- SYNC ROOM -------------------------------
        if (getElementsByClassName("room-name single-room-label", getId('chat'))[0].innerHTML != activeCountry) {
            var rooms = getElementsByClassName("dropdown-menu rooms", getId('chat'))[0].children;
            for (var i = 0; i < rooms.length; i++) {
                var aelement = rooms[i].firstChild;
                if (aelement.innerHTML == activeCountry) { aelement.click(); break; }
            }
        }
        //------------------------------- GET NICKLIST -------------------------------
        const ordered={};
        var listNicknames=new Array();
        var values={};
        values.time=Date.now();
        values.country=activeCountry;
        if (getId('chat-overlay').style.display != 'block') { getId('chatsy').style.color='red'; } else { getId('chatsy').style.color='green'; }

        var params={
            url: 'http://limageenboite.fr/chat_connect.php',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            data: 'loadconnected2='+ JSON.stringify(values),
            method: 'POST'
        };
        ChatDownloadHelper.add(params, function (data) {
            if (data.status == 'success') {
                // From Script
                var json=JSON.parse(data.data);
                for (var i=0; json[i]; i++) {
                    listNicknames[(8-json[i]["rank"])+json[i]["user"].toLowerCase()]='{"id":"'+json[i]["id"]+'", "user":"'+json[i]["user"]+'", "rank":"'+json[i]["rank"]+'", "lon":"'+json[i]["lon"]+'", "lat":"'+json[i]["lat"]+'", "zoom":"'+json[i]["zoom"]+'", "idle":"'+json[i]["idle"]+'"}';
                }

                // From Native Chat
                if (W.model.chat.attributes.roomName == getId('activeCountry').value) { // Sync if same country
                    if (W.model.chat.users.length != 0) { // Nick list
                        for (var n=0; n < W.model.chat.users.length; n++) {
                            var chatNickAttr=W.model.chat.users.models[n].attributes;
                            if (typeof(listNicknames[(7-chatNickAttr.rank)+chatNickAttr.name.toLowerCase()]) == "undefined") {
                                if (typeof(chatNickAttr.center) != "undefined") {
                                    listNicknames[(7-chatNickAttr.rank)+chatNickAttr.name.toLowerCase()]='{"id":"'+chatNickAttr.id+'", "user":"'+chatNickAttr.name+' *", "rank":"'+(chatNickAttr.rank+1)+'", "lon":"'+chatNickAttr.center.lon.toFixed(5)+'", "lat":"'+chatNickAttr.center.lat.toFixed(5)+'", "idle":"'+new Date(chatNickAttr.lastUpdate).getTime()+'"}';
                                } else {
                                    listNicknames[(7-chatNickAttr.rank)+chatNickAttr.name.toLowerCase()]='{"id":"'+chatNickAttr.id+'", "user":"'+chatNickAttr.name+' *", "rank":"'+(chatNickAttr.rank+1)+'"}';
                                }
                            }
                        }
                    }
                } else { getId('chatsy').style.color='red'; }

                Object.keys(listNicknames).sort().forEach(function(key) { ordered[key]=listNicknames[key]; });
                getId('user-list').innerHTML='';

                for (let id in ordered) {
                    var uclass='', idlevalue='', idleColor='red', visib='block', dataUser=JSON.parse(ordered[id]);
                    if (dataUser.idle) {
                        var t=(Date.now()-dataUser.idle), n=new Date(t);
                        switch (true) {
                            case (t<120000): idleColor='green'; visib='block'; break; // < 2 min
                            case (t>120000 && t<600000): idleColor='orange'; visib='block'; break; // 2 > 10 min
                            case (t>600000 && t<1200000): idleColor='red'; visib='block'; break; // 10 > 20 min
                            case (t>1200000): idleColor='lightgrey'; (JSON.parse(localStorage.WMEChat).showInac ? visib='block' : visib='none'); break; // >20 min
                        }
                        idlevalue=[(n.getHours()-1).padLeft(), n.getMinutes().padLeft(), n.getSeconds().padLeft()].join(':');
                    } else {
                        idleColor='lightgrey'; visib='block'; idlevalue='?';
                    }
                    (dataUser.user == nick ? uclass ='current-user user' : uclass ='user') // It's me ?

                    getId('user-list').innerHTML += '<li style="display:'+visib+';"><a id="goto_'+dataUser.id+'" style="clear:both;float:left;height:25px;" class="'+uclass+'" href="#" data-id="'+dataUser.id+'">'
                        +'<div class="rank" style="clear:both; float:left;">'+dataUser.rank+'</div>'
                        +'<div style="float:left;max-width:95px;" class="username" title="'+dataUser.user+'" style="color: crimson; text-decoration: underline;">'+dataUser.user+'</div></a>'
                        +'<i id="alert_'+dataUser.id+'" style="color:'+idleColor+'; line-height:24px; margin-right:5px; font-size:15px; float:right;" class="fa fa-bell" title="'+idlevalue+'"></i></li>';
                }
                for (let id in ordered) {
                    var dataUser=JSON.parse(ordered[id]);
                    var coord={};
                    coord.lon=dataUser.lon;
                    coord.lat=dataUser.lat;
                    coord.zoom=dataUser.zoom;
                    getId("alert_" + dataUser.id).onclick=getFunctionWithArgs(alertTo, [dataUser.user]);
                    if(typeof(dataUser.lon) != "undefined" && typeof(dataUser.lat) != "undefined") { getId("goto_" + dataUser.id).onclick=getFunctionWithArgs(chatMoveTo, [coord,""]); }
                }
            }
        }, null);

        //------------------------------- GET MESSAGES -------------------------------
        if (W.model.chat.attributes.roomName == getId('activeCountry').value && getId('chat-overlay').style.display == 'block') { // Sync if same country and native chat active
            if (W.model.chat.messages.length != 0 && W.model.chat.users.length != 0) {
                var chatAttrib=W.model.chat.messages.models[(W.model.chat.messages.length-1)].attributes;
                if (W.model.chat.messages.length != nativeQtyMsg || chatAttrib.body != lastNativeMsg) {
                    if (chatAttrib.type != "system") { // Not a system message

                        var data=[], values={};
                        values.msgtime=Date.now();
                        values.user=chatAttrib.from.name;
                        values.rank=(W.model.chat.users._byId[chatAttrib.from.id].attributes.rank+1);
                        values.message=chatAttrib.body;
                        data.push(values);
                        if (W.model.chat.messages.length != nativeQtyMsg) { ShowMessage('new',data); }
                        else if (chatAttrib.body != lastNativeMsg) { ShowMessage('add',data); }
                        nativeQtyMsg=W.model.chat.messages.length;
                        lastNativeMsg=chatAttrib.body;
                    }
                }
            }
        }
        //------------------------------- NATIVE HS -------------------------------
        if (getId('chat-overlay').style.display != 'block') {
            var values={};
            values.time=JSON.parse(localStorage.WMEChat).lastMsg;
            values.country=activeCountry;

            var params={
                url: 'http://limageenboite.fr/chat_connect.php',
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                data: 'loadmessages2='+ JSON.stringify(values),
                method: 'POST'
            };
            ChatDownloadHelper.add(params, function (data) {
                if (data.status == 'success') {
                    if (data.data != 'undefined') {
                        ShowMessage('msg',data);
                    }
                }
            }, null);
        }

        // Beta Infos
        if (/B/.test(GM_info.script.version) === true) {
            if (getId('chat-overlay').style.display == 'block') {
                getId('nativeCountry').innerHTML=W.model.chat.attributes.roomName+' ('+W.model.chat.rooms.length+')';
                getId('invisible').innerHTML=W.model.chat.attributes.visible;
                getId('reduce').innerHTML=W.model.chat.attributes.open;
                getId('nbConnect').innerHTML=W.model.chat.users.length;
                getId('nbMessage').innerHTML=W.model.chat.messages.length+"/"+nativeQtyMsg;
                var m=W.model.chat.messages.models[W.model.chat.messages.length-1].attributes;
                getId('lastMessage').innerHTML=m.body+"<br>"+lastNativeMsg;
                if (m.type == 'system') {
                    getId('lastAuthor').innerHTML=m.type;
                } else {
                    getId('lastAuthor').innerHTML=m.from.name;
                }
            } else {
                getId('nativeCountry').innerHTML='<span style="color:red;"><b>Chat HS</b></span>';
            }
        }
        setTimeout(LoadInfos, 2000);
    }
    function ShowMessage(type,data) {
        if (type != 'new' && type != 'add') { var json=JSON.parse(data.data); } else { var json=data; }
        var content='', lastNick='';
        var l=JSON.parse(localStorage.WMEChat), c='';

        for (var i=0; json[i]; i++) {
            if (json[i].msgtime > l.lastMsg || type == 'no') {
                l.lastMsg=(parseInt(json[i].msgtime)+10);
                localStorage.setItem('WMEChat', JSON.stringify(l));
                getId('chatbutton').style.backgroundColor='#fff';

                //Convert timestamp to date/hour
                var d=new Date(parseInt(json[i].msgtime)), ddays='', dhours=[d.getHours().padLeft(), d.getMinutes().padLeft(), d.getSeconds().padLeft()].join(':');
                if (JSON.parse(localStorage.WMEChat).addDate == true) { var ddays=[d.getDate().padLeft(), I18n.translations[I18n.locale].date.abbr_month_names[(d.getMonth()+1)]].join(' ')+' - '; }

                //convert url ans smileys
                var msg=replaceSmileys(urlify(decodeURI(json[i].message)));

                //new message when reduce
                if (l.open == false && json.length != 0 && type != "no") { getId('chatbutton').style.backgroundColor='#9ef'; }

                // it's my message ?
                if (json[i].user == nick) { var bckcolor=l.messageBGColor, ownmsgclass='own-message'; } else { var bckcolor='#fff', ownmsgclass=''; }

                //Update alert list
                var k=getId('alarmList').value;
                if (k.substr(-1) == ',') {
                    k=k.slice(0, -1);
                    l.alertMatch=k;
                    localStorage.setItem('WMEChat', JSON.stringify(l));
                }

                if (type == "no" || type == "msg") {
                    var a=getId('message-list').children.length, type2='';
                    if (a == 0) { type2="new"; c=msg; }
                    else {
                        var b=getId('message-list').children[a-1].children[0].innerHTML.split(" ");
                        if (b[0] === json[i].user) { type2="add"; msg=c+'<br>'+msg; c=msg; } else { type2="new"; c=msg; }
                    }
                }

                //highlight if word in alert list
                if (msg.match(new RegExp(k.replace(/,/g,"|"),'gi')) && json[i].user != nick) {
                    if (getId('alarmList').value != "") {
                        var bckcolor=l.alertBGColor;
                        if (type != "no" && l.alertSound == true) { snd.play(); }
                    }
                    if (l.open == false) { getId('chatbutton').style.backgroundColor='#800'; }
                }

                if (type == "new" || type2 == "new") {
                    if (/B/.test(GM_info.script.version) === true) { getId('typemessage').innerHTML ="New message and different user"; }
                    lastIdMsg=Date.now();
                    getId('message-list').innerHTML += '<div id="msg_'+lastIdMsg+'" class="message normal-message '+ownmsgclass+'" style="background-color:'+bckcolor+'">'
                        +'<div class="from">'+json[i].user+' ('+json[i].rank+')<span id="date_'+lastIdMsg+'" style="float:right; color:#A0A0A0; font-size:smaller; margin:1px 0 0 5px;">'+ddays+dhours+'</span></div>'
                        +'<div class="body" id="id_'+lastIdMsg+'"><div style="direction: ltr; text-align: left;">'+msg+'</div></div></div>';
                }
                else if (type == "add" || type2 == "add") {
                    if (/B/.test(GM_info.script.version) === true) { getId('typemessage').innerHTML ="New message but same user"; }
                    var txt=msg.split(/\n/ig);
                    getId('id_'+lastIdMsg).innerHTML='';
                    getId('date_'+lastIdMsg).innerHTML=ddays+dhours;
                    getId('msg_'+lastIdMsg).style.backgroundColor=bckcolor;
                    for (var o=0; txt[o]; o++) { getId('id_'+lastIdMsg).innerHTML +='<div style="direction: ltr; text-align: left;">'+txt[o]+'</div>'; }
                }

                //Play sound each message
                if (type != 'no' && json.length != 0 && l.alertNewMsg && json[i].user != nick) { ntf.play(); }
            }
        }

        if (idx != 0) {
            for (var l=1; l<=idx; l++) {
                console.log(l, getId("chatlink_" + l).title);
                //getId("chatlink_" + l).onclick=getFunctionWithArgs(chatMoveTo, [getId("chatlink_" + l).title,"url"]);
            }
        }

        //------------------------------- AUTO-SCROLL -------------------------------
        if (type == "no") { getId('message-list').scrollTop=getId('message-list').scrollHeight; }
        if ((getId('message-list').scrollHeight - 560) < getId('message-list').scrollTop) {
            getId('message-list').style.backgroundColor='#fff';
            if (json.length != 0) { getId('message-list').scrollTop=getId('message-list').scrollHeight; }
        } else {
            getId('message-list').style.backgroundColor='#ccc';
        }
    }
    function SendMessage(message) {
        var values={};
        values.time=Date.now();
        values.country=activeCountry;
        values.user=nick;
        values.rank=W.loginManager.user.rank+1;
        values.message=message;
        var params={
            url: 'http://limageenboite.fr/chat_connect.php',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            data: 'sendmessage='+ JSON.stringify(values),
            method: 'POST'
        };
        ChatDownloadHelper.add(params, function (data) {
            if (data.data == 'Added') { resestIdle(); }
        });
    }

    console.log('WME Chat : ' + GM_info.script.version + ' starting');
    Chatinit();
})();