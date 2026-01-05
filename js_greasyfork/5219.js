// ==UserScript==
// @name            Facebook Old Chat Sidebar
// @namespace       rocki
// @description     Replaces new Facebook sidebar with one like the original.
// @version         2.6.2
// @grant           none
// @include         http://*.facebook.com/*
// @include         https://*.facebook.com/*
// @match           http://*.facebook.com/*
// @match           https://*.facebook.com/*
// @exclude         http://*.facebook.com/ajax/*
// @exclude         https://*.facebook.com/ajax/*
// @downloadURL https://update.greasyfork.org/scripts/5219/Facebook%20Old%20Chat%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/5219/Facebook%20Old%20Chat%20Sidebar.meta.js
// ==/UserScript==

// Author: rocki.hack@gmail.com
// License: GNU General Public License v3 (GPL)

// contentEval (http://wiki.greasespot.net/Content_Script_Injection)
(function(source) {
    // Check for function input.
    if ('function' == typeof source) {
        // Execute this function with no arguments, by adding parentheses.
        // One set around the function, required for valid syntax, and a
        // second empty set calls the surrounded function.
        source = '(' + source + ')();'
    }

    // Create a script node holding this  source code.
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = source;

    // Insert the script node into the page, so it will run, and immediately
    // remove it to clean up.
    document.body.appendChild(script);
    document.body.removeChild(script);
})

(function(){
    var w = window,
        d = w.document;

    var settings = {
        // open buddylist on load
        Onload:        true,

        // set buddylist sticky ( stay opened )
        Sticky:        true,

        // show online friends
        Online:        true,

        // show idle friends
        Idle:        true,

        // show mobile friends
        Mobile:        true,

        // buddylist style
        Margin:        '0px 10px',
        MinHeight:    '140px',
        Width:        '200px'
    };

    function ajax(url){
        this.Url = url;
        this.XMLHttpRequest = new w.XMLHttpRequest();
    }

    ajax.prototype = {
        'send':function(type,data,callback){
            try{
                this.Callback = callback;
                this.XMLHttpRequest.open(type,this.Url,true);
                this.XMLHttpRequest.onreadystatechange = this.stdcallback.bind(this);
                this.XMLHttpRequest.send(data);
                return true;
            }catch(e){
                return false;
            }
        },

        'stdcallback':function(){
            if(this.XMLHttpRequest.readyState === 4 && this.XMLHttpRequest.status === 200){
                if(typeof this.Callback === 'function') this.Callback(this.XMLHttpRequest);
            }
        }
    };

    var util = {
        'insertRule':function(rule){
            if(!this.css){
                this.css = d.createElement('style');
                d.querySelector('head').appendChild(this.css);
            }

            return this.css.appendChild(d.createTextNode(rule));
        },

        'getItem':function(key){
            return unescape(d.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + escape(key).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
        },

        'setItem':function(key,value){
            d.cookie = escape(key) + '=' + escape(value) + '; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/';
        },

        'removeItem':function(key){
            d.cookie = escape(key) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        }
    };

    var rocki = {
        'DOMContentLoaded':function(){
            w.toggle_list = function(r){
                if(util.getItem('toggle' + r) === 'true'){
                    util.setItem('toggle' + r,'false');
                }else{
                    util.setItem('toggle' + r,'true');
                }
                w.render_chat();
            };

            w.change_order = function(r){
                var f = d.querySelectorAll('ul.fbChatOrderedList li.separator[id]');
                for(var i = 1, j = f.length; i < j; i++){
                    if(f.item(i).id === r){
                        util.setItem('order' + f.item(i).id,i-1);
                        util.setItem('order' + f.item(i-1).id,i);
                    }else{
                        util.setItem('order' + f.item(i).id,i);
                    }
                }
                w.render_chat();
            };

            w.Arbiter.subscribe('sidebar/initialized',function(a,d){
                var csv = w.require('ChatSidebarVisibility');
                csv.isViewportCapable = function(){ return false; };
                csv.shouldShowSidebar = function(){ return false; };
                d.hide();
            });

            var user_data = w.require('CurrentUserInitialData');
            rocki.user_id = user_data.id || user_data.USER_ID;

            w.Arbiter.subscribe('sidebar/initialized',function(a,c){
                var av = w.require('AvailableList'),
                    sp = w.require('ShortProfiles'),
                    ol = w.require('ChatOrderedList'),
                    tl = w.require('Toggler'),
                    oa = w.require('debounceAcrossTransitions'),
                    ps = w.require('PresenceStatus'),
                    at = w.require('LastMobileActiveTimes');

                w.ChatOpenTab = w.require('ChatOpenTab');

                var getAvailableList = function(){
                    return ps.getAvailableIDs().filter(function(r){
                        switch(av.get(r)){
                            case av.ACTIVE: return settings.Online;
                            case av.IDLE: return settings.Idle;
                            default: return false;
                        }
                    });
                };

                var sortAlpha = function(x,y){
                    var r = sp.getNow(x), s = sp.getNow(y);
                    if(!r || !s) return 0;
                    var t = r.name.toLowerCase(),
                        u = s.name.toLowerCase();
                    return t < u ? -1 : 1;
                };

                var sortLists = function(x,y){
                    if(!x.member || !y.member) return 0;
                    var r = Number(util.getItem('order' + x.uid)),
                        s = Number(util.getItem('order' + y.uid));
                    if(r === s) return 0;
                    return r < s ? -1 : 1;
                };

                ol.prototype._getListItem = function(id){
                    this.itemCache = this.itemCache || {};
                    if(!this.itemCache.hasOwnProperty(id)){
                        var usr = sp.getNow(id);
                        this.itemCache[id] = d.createElement('li');
                        this.itemCache[id].setAttribute('onclick', 'ChatOpenTab.openUserTab(' + usr.id + ');');
                        this.itemCache[id].className = '__42fz';
                        this.itemCache[id].innerHTML =
                            '<a class="_55ln" rel="ignore" tabindex="0">\
                            <div class="__55lp">\
                                <div class="__56p9">\
                                    <div size="28" style="width:28px;height:28px;">\
                                        <img width="28" height="28" src="' + usr.thumbSrc +'">\
                                    </div>\
                                </div>\
                                <div class="__5bon">\
                                    <div class="__568z">\
                                        <div class="__5t35"></div>\
                                        <i class="_sp_online"></i>\
                                    </div>\
                                </div>\
                                <div class="__55lr">' + usr.name + '</div>\
                            </div></a>';
                        var status = this.itemCache[id].querySelector('.__568z');
                        this.itemCache[id]._text = status.querySelector(':first-child');
                        this.itemCache[id]._img = status.querySelector(':last-child');
                    }
                    if(av.get(id) === av.MOBILE){
                        this.itemCache[id]._text.innerHTML = at.getShortDisplay(id);
                        this.itemCache[id]._img.className = '_sp_mobile';
                        this.itemCache[id]._text.style.color = '#898F9C';
                    }else{
                        this.itemCache[id]._text.innerHTML = ps.getDetailedActivePresence(id);
                        this.itemCache[id]._img.className = '_sp_online';
                        this.itemCache[id]._text.style.color = '#63A924';
                    }
                    return this.itemCache[id];
                };

                ol.prototype._renderOrderedList = function(){
                    this.render = this._renderOrderedList = oa(function(){
                        if(!rocki.lists) return setTimeout(this.render.bind(this),300);
                        var a = getAvailableList(), b = [], cc, d, e = {};
                        rocki.lists.sort(sortLists);
                        if(a.length > 0){
                            a.sort(sortAlpha);
                            for(var f = 0, g = rocki.lists.length; f < g; f++){
                                if(!rocki.lists[f].member) return setTimeout(this.render.bind(this),300);
                                cc = a.filter(function(r){ return rocki.lists[f].member.hasOwnProperty(r); });
                                if(cc.length > 0){
                                    b.push('<li class="separator" id="' + rocki.lists[f].uid + '" onclick="toggle_list(\'' + rocki.lists[f].uid + '\');"><div class="outer"><div class="inner"><span class="text">' +
                                        rocki.lists[f].text + ' (' + cc.length + ') <a href="#" onclick="change_order(\'' + rocki.lists[f].uid + '\');return false;">+</a> <a href="#" onclick="requireLazy([\'Dialog\'],function(a){new a().setAsyncURL(\'/ajax/choose/?type=friendlist&flid=' + rocki.lists[f].uid + '\').setAutohide(true).show();});return false;">~</a></span><div class="dive"><span class="bar"></span></div></div></div></li>');

                                    if(util.getItem('toggle' + rocki.lists[f].uid) !== 'true'){
                                        for(var k = 0, l = cc.length; k < l; k++){
                                            b.push(this._getListItem(cc[k]));
                                            e[cc[k]] = 1;
                                        }
                                    }
                                }
                            }
                            cc = a.filter(function(r){ return !e.hasOwnProperty(r); });
                            if(cc.length > 0){
                                b.push('<li class="separator" onclick="toggle_list(\'other\');"><div class="outer"><div class="inner"><span class="text">' +
                                    'Other (' + cc.length + ')</span><div class="dive"><span class="bar"></span></div></div></div></li>');

                                if(util.getItem('toggleother') !== 'true'){
                                    for(var k = 0, l = cc.length; k < l; k++){
                                        b.push(this._getListItem(cc[k]));
                                    }
                                }
                            }
                            if(settings.Mobile){
                                cc = ps.getAvailableIDs().filter(function(r){ return av.get(r) === av.MOBILE; });
                                if(cc.length > 0){
                                    b.push('<li class="separator" onclick="toggle_list(\'mobile\');"><div class="outer"><div class="inner"><span class="text">' +
                                        'Mobile (' + cc.length + ')</span><div class="dive"><span class="bar"></span></div></div></div></li>');
    
                                    if(util.getItem('togglemobile') !== 'true'){
                                        cc.sort(sortAlpha);
                                        for(var k = 0, l = cc.length; k < l; k++){
                                            b.push(this._getListItem(cc[k]));
                                        }
                                    }
                                }
                            }
                        }else{
                            b.push('<div style="padding:10px;">No friends online.</div>');
                        }
                        if(b.length > 0){
                            var ul = this._root.firstChild;
                            ul.innerHTML = '';
                            for(var s = 0, t = b.length; s < t; s++){
                                if(typeof b[s] === 'string'){
                                    ul.innerHTML += b[s];
                                }else{
                                    ul.appendChild(b[s]);
                                }
                            }
                            if(!this._arbiter){
                                // Search for arbiter instance.
                                for(var i in this){
                                    if('arbiter' === i.substr(0, 7)){
                                        this._arbiter = this[i];
                                        this._arbiter.inform('render',{},this.BEHAVIOR_PERSISTENT);
                                        break;
                                    }
                                }
                            }else{
                                this._arbiter.inform('render',{},this.BEHAVIOR_PERSISTENT);
                            }
							document.querySelector('div.fbNubFlyoutTitlebar div.titlebarTextWrapper').innerHTML =
								'Chat (' + getAvailableList().length + ')';
                            console.log('Chat rendered.');
                        }
                    }.bind(this),300,false);
                    w.render_chat = this.render.bind(this);
					tl.getInstance(this._root).setSticky(settings.Sticky);
                    console.log('Chat initialized.');
                    this.render();
                }

                sp.fetchAll();

                util.setItem('togglemobile',true);

                //if(!w.PresencePrivacy.isUserOffline() && settings.Onload)
				//	tl.show(document.getElementById('fbDockChatBuddylistNub'));
            });
        },

        'getflid':function(){
            var a = new ajax('/ajax/typeahead/first_degree.php?__a=1&filter[0]=friendlist&lazy=0&viewer=' + rocki.user_id + '&__user=' + rocki.user_id);
            a.send('GET',null,function(b){
                var typeahead = eval('(' + b.responseText.substr(9) + ')');
                if(!!typeahead.payload){
                    this.lists = typeahead.payload.entries;
                    this.getmember();
                }
            }.bind(this));
        },

        'getmember':function(){
            var regex = /\\?"(\d+)\\?":1/g, a;
            for(var i = 0, j = this.lists.length; i < j; i++){
                a = new ajax('/ajax/choose/?type=friendlist&flid=' + this.lists[i].uid + '&view=all&__a=1&__d=1&__user=' + rocki.user_id);
                a.send('GET',null,function(b,c){
                    var d; this.lists[c].member = {};
                    while(d = regex.exec(b.responseText)){
                        this.lists[c].member[d[1]] = 1;
                    }
                }.bind(this,a.XMLHttpRequest,i));
            }
        }
    };

    if(w && w.Arbiter){
        util.insertRule('\
        .fbDock {\
        margin:' + settings.Margin + '!important;\
        }\
        #fbDockChatBuddylistNub {\
        width:' + settings.Width + '!important;\
        }\
        .fbNubFlyout {\
        min-height:' + settings.MinHeight + '!important;\
        }\
        .fbNubFlyoutBodyContent .separator {\
            float: left;\
            width: 100%;\
        }\
        .fbNubFlyoutBodyContent .separator {\
            -moz-user-select: none;\
            display: table;\
            height: 32px;\
        }\
        .fbNubFlyoutBodyContent .separator .outer {\
            display: table-cell;\
            vertical-align: middle;\
        }\
        .fbNubFlyoutBodyContent .separator .outer .inner {\
            cursor: pointer;\
            position: relative;\
            text-align: center;\
            top: -50%;\
            z-index: 1;\
        }\
        .fbNubFlyoutBodyContent .separator .text {\
            background-color: #FFFFFF;\
            color: #989DB3;\
            display: inline-block;\
            font-size: 10px;\
            font-weight: bold;\
            padding: 0 5px;\
            text-transform: uppercase;\
        }\
        .fbNubFlyoutBodyContent .separator .dive {\
            left: 0;\
            position: absolute;\
            top: 50%;\
            width: 100%;\
            z-index: -1;\
        }\
        .fbNubFlyoutBodyContent .separator .dive .bar {\
            border-bottom: 2px solid #CCD0DA;\
            display: block;\
            margin: 0 5px;\
        }\
        .__42fz {\
            float: left;\
            width: 100%;\
        }\
        .__55ln {\
            color: #333333;\
            display: block;\
            height: 28px;\
            line-height: 28px;\
            padding: 2px 8px 2px 5px;\
            position: relative;\
        }\
        .__55lp {\
            position: relative;\
        }\
        .__56p9 {\
            float: left;\
            height: 28px;\
            position: relative;\
            width: 28px;\
        }\
        .__5bon {\
            float: right;\
            line-height: 24px;\
            margin: 0 4px;\
            text-align: right;\
        }\
        .__568z {\
            display: inline-block;\
        }\
        .__5t35 {\
            color: #A8A8A8;\
            display: inline-block;\
            font-size: 9px;\
            font-weight: bold;\
            line-height: 12px;\
            text-shadow: none;\
            vertical-align: middle;\
        }\
        .__5t35 {\
            color: #63A924;\
            font-weight: 500;\
        }\
        ._sp_online {\
            background-position: -304px -133px;\
            background-image: url("/rsrc.php/v2/yY/r/wCCsu-AifQa.png");\
            background-repeat: no-repeat;\
            background-size: auto auto;\
            display: inline-block;\
            height: 7px;\
            width: 7px;\
        }\
        .__55lr {\
            overflow: hidden;\
            padding-left: 8px;\
            text-overflow: ellipsis;\
            white-space: nowrap;\
        }\
        ._sp_mobile {\
            background-position: -304px -70px;\
            background-image: url("/rsrc.php/v2/yY/r/wCCsu-AifQa.png");\
            background-repeat: no-repeat;\
            background-size: auto auto;\
            display: inline-block;\
            height: 11px;\
            width: 7px;\
        }\
        ');

        rocki.DOMContentLoaded();
        rocki.getflid();
    }
});