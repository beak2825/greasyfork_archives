// ==UserScript==
// @name        mastown18edited
// @namespace   mafia.christmas <- he made it. not me!
// @author      Mafia[6.1.0.3.5.7] <- he made it. not me!
// @description Notification for items near you in christmas town map
// @match       https://www.torn.com/christmas_town.php
// @version     seemafia1
// @require     http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js
// @require     https://greasyfork.org/scripts/39572/code/mafia-helper.js
// @require     https://greasyfork.org/scripts/375903/code/wshook.js
// @require     https://greasyfork.org/scripts/375735/code/achex.js
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/376145/mastown18edited.user.js
// @updateURL https://update.greasyfork.org/scripts/376145/mastown18edited.meta.js
// ==/UserScript==

'use strict';

var ct = JSON.parse(localStorage.ct || '{}');

if(typeof ct.user == 'undefined') {
    $(document).ready(function() {
        uid = $("script[src*='js/chat/chat']").attr("uid");
        name = $("script[src*='js/chat/chat']").attr("name");
        ct.user = name + "[" + uid + "]";
        localStorage.ct = JSON.stringify(ct);

        alert('Initializing CT 2018 script. Press OK to reload page.');
        location.reload();
    });
}
else {
    var npcs = ['Grinch','Santa'];
    wsHook.after = function(messageEvent, url) {
        obj = JSON.parse(messageEvent.data);    
        if(url.indexOf('websocket') !== -1) {
            if(obj.body.hasOwnProperty('data')) {
                if(obj.body.data.message.action == "openChest") {                
                    $("#ctchest li#" + obj.body.data.message.hash).attr("class","chestOpened").removeAttr("id").find(".cttime").text(obj.body.data.message.user.playername+" has unlocked a chest")
                    .closest("li").fadeOut(7000, function(){
                        $(this).remove();
                        if(!$("#ctchest ul li").length)
                            $("#ctchest ul").before('<p>No chest found at a moment.</p>');
                    });
                }
            }
    
        }   
        if(url.indexOf('chat') !== -1) {
            if(obj.hasOwnProperty('data')) {
                s = obj.proc;
                if(s == "people/faction" || s == "people/friends") {
                    if(typeof ct[s.substr(s.indexOf("/")+1)] == 'undefined') ct[s.substr(s.indexOf("/")+1)] = []; 
                    ct[s.substr(s.indexOf("/")+1)] = [];       
                     $.each(obj.data, function(){
                        ct[s.substr(s.indexOf("/")+1)].push(parseInt(this.Id));
                    });
                    localStorage.ct = JSON.stringify(ct);
                }
            }    
        }
        return messageEvent;
    }


    $.achex({
        facebook: false,
        username: ct.user,
        password: 'none',
        url: 'wss://ws.achex.ca',
        port: 443,
        reconnect: 3000,
        callback: function(o, d, e)
        {
            var o = o;
            if(o.type == "NPC" && npcs.indexOf(o.npcName) != -1) {
                if($("#ctnpc p").length) $("#ctnpc p").remove();
                if($("#npc"+o.npcName).length){
                    $("#npc"+o.npcName+" span:eq(0)").html(o.npcName + ' at <strong>' + o.x + ',' + o.y + '</strong>');
                    $("#npc"+o.npcName+" .cttime").attr("by", moment().unix());
                }
                else {
                    $("#ctnpc ul").append('<li id="npc'+o.npcName+'"><img src="/images/v2/christmas_town/users/new/'+o.npcName.toLowerCase()+'.png"/> <div><span>' + o.npcName + ' at <strong>' + o.x + ',' + o.y + '</strong></span><br/><span class="cttime" by="'+moment().unix()+'">a few seconds ago</span></div><div class="clear"></div></li>');
                    setInterval(() => {
                        $("#npc" + o.npcName + " .cttime").text(moment.unix(parseInt($("#npc" + o.npcName + " .cttime").attr("by"))).fromNow());
                    }, 5000);
                }
            }
            if(o.type == "CTitems" && (o.itemID > 0 && o.itemID < 5)) {
                switch (o.itemID) {
                    case 1:
                        if(o.itemName == "wooden" && o.ctID == "chests.1") {                            
                            o.itemName = "Wooden";
                            valid = true;
                        }
                        break;
                    case 2:
                    if(o.itemName == "bronze" && o.ctID == "chests.2") {                            
                        o.itemName = "Bronze";
                        valid = true;
                    }
                        break;
                    case 3:
                    if(o.itemName == "silver" && o.ctID == "chests.3") {                            
                        o.itemName = "Silver";
                        valid = true;
                        break;
                    }
                        break;
                    case 4:
                    if(o.itemName == "golden" && o.ctID == "chests.4") {                            
                        o.itemName = "Golden";
                        valid = true;
                    }
                    default:
                        valid= true;
                        break;
                }

                if(valid) {
                    if($("#ctchest p").length) $("#ctchest p").remove();
                    if(!$(".chest" + o.x + '_' + o.y).length) {
                        $("#ctchest ul").prepend("<li id='"+o.hash+"' class='chest"+o.x+"_"+o.y+"'><img src='/images/items/christmas_town/chests/"+o.ctID.replace(/\./g,'-')+".png'/> <div><span>" + o.itemName + " Chest</spantext-transform:> at <strong>" + o.x + ',' + o.y + "</strong><br/><span class='cttime' by='"+moment().unix()+"'>Now</span></div><div class='clear'></div></li>");
                        setInterval(() => {
                            diff = (moment().unix() - parseInt($(".chest"+o.x+"_"+o.y+" .cttime").attr("by")));
                            $(".chest"+o.x+"_"+o.y+" .cttime").text(diff <= 5 ? 'Now' : diff + ' seconds ago');
                            if(moment().unix() - parseInt($(".chest"+o.x+"_"+o.y+" .cttime").attr("by")) > 45) {
                                $(".chest"+o.x+"_"+o.y).fadeOut(15000,function(){ 
                                    $(".chest"+o.x+"_"+o.y).remove();                                
                                    if(!$("#ctchest ul li").length)
                                        $("#ctchest ul").before('<p>No chest found at a moment.</p>');                                
                                });
                            }
                        }, 1000);
                    }
                    else {
                        $(".chest"+o.x+"_"+o.y).stop(true, true).show();
                        $(".chest"+o.x+"_"+o.y+" .cttime").attr("by", moment().unix());
                        if($(".chest"+o.x+"_"+o.y).attr("id") == 'undefined')
                        $(".chest"+o.x+"_"+o.y).attr("id", o.hash);
                    }
                }
            }
            
            if(o.type == "openChest" || o.type == "openChest2") {
                unlocker = o.type == "openChest" ? o.FROM.substr(0,o.FROM.indexOf('[')) : "Someone";
                $("#ctchest li#" + o.hash).attr("class","chestOpened").removeAttr("id").find(".cttime").text(unlocker+" has unlocked a chest")
                .closest("li").fadeOut(7000, function(){
                    $(this).remove();
                    if(!$("#ctchest ul li").length)
                        $("#ctchest ul").before('<p>No chest found at a moment.</p>');
                });
            }
        }
    });
    $.achex.join('CT2018');

    var $achex = $.achex;
    var mypos;    
                
    var inRadius = function(pos) {
        diff = {x: (mypos.x - parseInt(pos.x)), y: (mypos.y - parseInt(pos.y))};
        return (diff.x > -8 && diff.x < 8) && (diff.y > -8 && diff.y < 8);
    };

    var xmastown = function(response) {
        if(typeof ct.friends == 'undefined') {
            ct.friends = [610357];
            localStorage.ct = JSON.stringify(ct);
            alert('Added faction mate and friends color feature in CT map. Please visit once tab Friends and Faction under Torn chat panel to enable color your faction mate as red and friends as yellow in CT map. Cheers');
        }
        if(response.hasOwnProperty('mapData')) {
            
            if(response.mapData.users !== null) {
                npc = response.mapData.users.filter(u=>typeof u.user_id=='string');
                users = response.mapData.users.filter(u=>typeof u.user_id=='number');
                if(users.length) {
                    var utime = moment().unix();
                    if(typeof ct.friends != 'undefined') {
                        $.each(ct.friends, function(){
                            $("#ctUser"+this+":not(.friends)").addClass("friends");
                        });
                    }
                    if(typeof ct.faction != 'undefined') {                        
                        $.each(ct.faction, function(){
                            $("#ctUser"+this+":not(.factionmate)").addClass("factionmate");
                        });
                    }
                    $.each(users, function() {
                        var uid = this.user_id;
                        if(!$("#ctusers ul li."+uid).length) {
                            $("#ctusers ul").append($('<li class="'+uid+'" batch="'+utime+'" style="display: none;">'+this.playername+'</li>').hover(function(){
                                $("#ctUser"+uid+" path:eq(1)").css("fill","gold");
                            },function(){
                                $("#ctUser"+uid+" path:eq(1)").css("fill","");
                            }).fadeIn());
                        }
                        else {
                            $("#ctusers ul li."+uid).attr("batch", utime);
                        }
                    });
                    $("#ctusers ul li:not([batch='"+utime+"'])").fadeOut(function(){$(this).remove()});
                }
                
                if(npc.length) {
                    var ctnpc = '';
                    $.each(npc,function() {
                        if($("#ctnpc p").length) $("#ctnpc p").remove();        
                        $achex.send({
                            toH:'CT2018',
                            type: 'NPC',
                            npcName: this.playername,
                            x: this.position.x,
                            y: this.position.y,
                            v: GM_info.script.version
                        });
                        
                        if($("#npc"+this.playername).length){
                            $("#npc"+this.playername+" span:eq(0)").html(this.playername + ' at <strong>' + this.position.x + ',' + this.position.y + '</strong>');
                            $("#npc"+this.playername+" .cttime").attr("by", moment().unix());
                        }
                        else {
                            $("#ctnpc ul").append('<li id="npc'+this.playername+'"><img src="/images/v2/christmas_town/users/new/'+this.playername.toLowerCase()+'.png"/> <div><span>' + this.playername + ' at <strong>' + this.position.x + ',' + this.position.y + '</strong></span><br/><span class="cttime" by="'+moment().unix()+'">a few seconds ago</span></div><div class="clear"></div></li>');
                            setInterval(() => {
                                $("#npc" + this.playername + " .cttime").text(moment.unix(parseInt($("#npc" + this.playername + " .cttime").attr("by"))).fromNow());
                            }, 5000);
                        }
                    });
                }
            }
        
            // Item Spawned
            if(response.mapData.items !== null) {
                items = response.mapData.items;
                var ctspawn = '';               
                mypos = response.mapData.position;

                $.each($("#ctchest li"), function(){
                    chest = $(this).attr("class").replace("chest","").split("_");
                    chest = { x: chest[0], y: chest[1] };

                    if(inRadius(chest)){
                        hash = $(this).attr("id");
                        if(items.find(c=>c.hash == hash) == undefined) {
                            $achex.send({
                                toH:'CT2018',
                                type: 'openChest2',
                                hash: hash                   
                            });
                            $("#ctchest li#" + hash).attr("class","chestOpened").find(".cttime").text("Someone has unlocked a chest")
                            .closest("li").fadeOut(7000, function(){
                                $(this).remove();
                                if(!$("#ctchest ul li").length)
                                    $("#ctchest ul").before('<p>No chest found at a moment.</p>');
                            });
                        }
                    }
                });
    
                $.each(items,function() {
                    if(this.category != 'tornItems' && this.category != 'keys' && this.category != 'combinationChest') {
                        $achex.send({
                            toH:'CT2018',
                            type: 'CTitems',
                            ctID: this.item_id,
                            itemID: this.type,
                            itemName: this.name,
                            hash: this.hash,
                            v: GM_info.script.version,
                            x: this.position.x,
                            y: this.position.y                            
                        });
                    }
    
                    switch (this.category) {
                        case 'keys':
                            custompadding = '18px';
                            break;
                    
                        case 'combinationChest':
                            custompadding = '6px';
                            break;
                        default:
                            custompadding = '0px';
                            break;
                    }
                    ctspawn += '<li><img src="/images/items/'+(this.category == 'tornItems' ? this.type + '/small': 'christmas_town/'+this.category+'/'+this.item_id.replace(/\./g,'-'))+'.png" style="padding-right:'+custompadding+';"> <div>[' + this.position.x + ',' + this.position.y + ']<br/>' + this.name + (this.category == 'chests' ? ' chest' : '') + '</div></li>';    
                });
                $("#ctspawn ul").html(ctspawn ? ctspawn : 'No item around you.');
            }

            //POI (Shop / Games)
            if(typeof response.mapData.cellEvent !== 'undefined') {
                place = response.mapData.cellEvent;
                if(place.type !== 'gameCombinationChest' && place.type != 'NPC') {
                    place = place.miniGameType.split(/(?=[A-Z])/).join(" ");
                    x = response.mapData.position.x;
                    y = response.mapData.position.y;
                    if(place == 'Teleport'){
                        place = 'Trap';
                        lastpos = $("span[class^='position___']").text().split(",")
                        x = parseInt(lastpos[0]);
                        y = parseInt(lastpos[1]);
                        ct.traps.push({id:'poi'+x+'_'+y,name: place, x: x,y: y});
                        localStorage.ct = JSON.stringify(ct);
                    }
                    if(!ct.hasOwnProperty('places')) ct.places = [];
                    if(!$("#ctpoi li.poi"+x+'_'+y).length) {
                        ct.places.push({id:'poi'+x+'_'+y,name: place, x: x,y: y});
                        localStorage.ct = JSON.stringify(ct);
                        $.post('https://itsibitsi.blog/christmastown', {place: place, x: x, y: y});
                    }
                }
            }

            // Traps
            if(ct.traps.length) {
                $.each(ct.traps, function() {
                    if(inRadius(this)) {
                        if(!$("#"+this.id).length) {
                            $(".objects-layer").append(`<div id="${this.id}" class="ct-object traps" style="left: ${this.x * 30}px; top: ${this.y * (-30)}px;">
                                <img src="/images/v2/christmas_town/library/Road%20Blocks/32.png">
                            </div>`);
                        }
                    }
                });
            }

            lastpos = response.mapData.position;
        }       

        if(response.hasOwnProperty('prizes') && response.hasOwnProperty('message')) {
            if(response.message.indexOf('You unlock the chest') != -1 && response.status == 'success') {
                position = $("span[class^='resetButton___']").next().text().split(',');
                var x = parseInt(position[0]);
                var y = parseInt(position[1]);
                $achex.send({
                    toH:'CT2018',
                    type: 'openChest',
                    hash: response.hash,
                    x: x,
                    y: y                            
                });
                $("#ctchest li#" + response.hash).attr("class","chestOpened").find(".cttime").text("You has unlocked a chest")
                .closest("li").fadeOut(7000, function(){
                    $(this).remove();
                    if(!$("#ctchest ul li").length)
                        $("#ctchest ul").before('<p>No chest found at a moment.</p>');
                });
            }
        }

    };

    fetching('christmas_town.php', xmastown);

    $(document).ready(function() {
        $("head").append(`<style>
        .d .user-map-container .user-map:before {background: none !important;}@keyframes pulse {0% {opacity: 0;}50% {opacity: 1;}100% {opacity: 0;}}div.items-layer div.ct-item::after {background-image: radial-gradient(rgba(0, 0, 0, 0), #ff9a00);border-radius: 100%;content: "";display: block;position: relative;bottom: 200%;right: 200%;height: 500%;width: 500%;animation-name: pulse;animation-duration: 2s;animation-iteration-count: infinite;}
        #ctusers ul li { padding: 2px 2px; float: left; cursor: default; }
        #ctusers ul li:hover { background-color: gold; }
        #ctusers ul li:nth-child(n+2):before { content: "|  "; }
        #ctspawn, #ctchest, #ctnpc { float: left; }
        #ctspawn div.bottom-round, #ctchest div.bottom-round, #ctnpc div.bottom-round { min-height: 60px; max-height: 60px; overflow: auto; }
        #ctchest, #ctnpc { min-height: 60px; padding: 0px 0px 0px 10px;}
        #ctusers, #ctpoi { background-color: hsla(0, 0%, 100%, 0.73); height: 408px; width: 394px; position: absolute; margin-top: 35px; padding: 30px; color: #668fa3; }
        #ctusers p, #ctpoi p { font-family: monospace; font-weight: 900; font-size: 20px; text-transform: uppercase; }
        #ctusers ul, #ctpoi ul { font-size: 15px; font-family: cursive; }
        #ctnpc .cttime, #ctchest .cttime { font-size: x-small; color: #8c8a8a; }
        #ctnpc img, #ctchest img, #ctspawn img { vertical-align: middle; float: left; }
        #ctspawn img { max-height: 20px; }
        #ctchest img { max-width: 30px; }
        #ctspawn li { padding: 7px 0px; }
        #ctspawn div { text-transform: capitalize; }
        div.ct-user.friends path:nth-child(1){ fill:#e91e63; }
        div.ct-user.factionmate path:nth-child(1){ fill: #ffffff; }
        div.ct-user.friends path:nth-child(2){ fill: #ffeb3b; }
        div.ct-user.factionmate path:nth-child(2){ fill: #de1010; }
        div.traps { width: 30px; height: 30px; mix-blend-mode: color-burn; animation: pulse 3s infinite; }
        </style`);

        $("#christmastownroot").prepend('<div id="ctusers" style="display: none;"><p>Active peoples around you</p><ul></ulfont-size:></div>');
        $("#christmastownroot").prepend('<div id="ctpoi" style="display: none;"><p>Places in Christmas Town</p><ul></ul></div>');
        $('div.content-title').after(`<div id='ctspawn' class="m-top10 m-bottom10" style="width:324px;">
                                                <div class="title-green top-round" role="heading" aria-level="5">
                                                <i class="ct-christmastown-icon"></i>
                                                <span>Near Items</span>
                                                </div>
                                                <div class="bottom-round cont-gray p10">
                                                    <ul></ul>
                                                </div>
                                                <div class="clear"></div>
                                            </div>
                                            <div id='ctchest' class="m-top10 m-bottom10" style="width:240px;">
                                                <div class="title-green top-round" role="heading" aria-level="5">
                                                <i class="ct-christmastown-icon"></i>
                                                <span>Chests</span>
                                                </div>
                                                <div class="bottom-round cont-gray p10">
                                                    <p>No chest found at a moment.</p>
                                                    <ul></ul>
                                                </div>
                                            </div>
                                        <div id='ctnpc' class="m-top10 m-bottom10" style="width:200px;">
                                            <div class="title-green top-round" role="heading" aria-level="5">
                                            <i class="ct-christmastown-icon"></i>
                                            <span>Moving NPC</span>
                                            </div>
                                            <div class="bottom-round cont-gray p10">
                                                <p>Searching...</p>
                                                <ul></ul>
                                            </div>
                                        </div>
                                        <div class="clear"></div>`);

        setTimeout(() => {
            $poi = $('<span class="icon-wrap" style="margin-left: 15px;"><i class="city-icon"></i></span>').click(function() {
                if($("#ctpoi").is(':hidden')) {
                    $("#ctpoi ul").empty();
                    $.each(ct.places, function(){
                        $("#ctpoi ul").append('<li class="poi'+this.x+'_'+this.y+'">'+this.name+' - ' + this.x + ', ' + this.y + '</li>');
                    });
                    $("#ctpoi").fadeIn();
                }
                else $("#ctpoi").fadeOut();
            });
            $users = $('<span class="icon-wrap" style=" margin-left: 150px; "><i class="team-icon"></i></span>').click(function() {
                if($("#ctusers").is(':hidden')) {
                    $("#ctusers").fadeIn();
                }
                else $("#ctusers").fadeOut();
            });
            $("#makeGesture").before($users).before($poi);
            $.getJSON('https://itsibitsi.blog/christmastown', {ct: 'places'}, function(data) {
                ct.places = [];
                ct.traps = [];
                $.each(data, function() {
                    if(this.name == "Trap") ct.traps.push(this);
                    else ct.places.push(this);
                });
                localStorage.ct = JSON.stringify(ct);   
            });
        }, 5000);

    });
}