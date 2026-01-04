// ==UserScript==
// @name         TagPro Groups on Homepage
// @version      2.4
// @description  Show available groups *of all servers* on the homepage, joiner page and inside a group
// @author       Ko
// @supportURL   https://www.reddit.com/message/compose/?to=Wilcooo
// @website      https://redd.it/no-post-yet
// @download     https://raw.githubusercontent.com/wilcooo/TagPro-GroupsOnHomepage/master/tpgoh.user.js
// @match        http://*.koalabeast.com*
// @match        http://tagpro.gg/
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @icon         https://raw.githubusercontent.com/wilcooo/TagPro-GroupsOnHomepage/master/icon.png
// @require      https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.0/socket.io.slim.js
// @require      https://greasyfork.org/scripts/371240/code/TagPro%20Userscript%20Library.js
// @connect      koalabeast.com
// @namespace https://greasyfork.org/users/152992
// @downloadURL https://update.greasyfork.org/scripts/40189/TagPro%20Groups%20on%20Homepage.user.js
// @updateURL https://update.greasyfork.org/scripts/40189/TagPro%20Groups%20on%20Homepage.meta.js
// ==/UserScript==



/* global tagpro, io, tpul */



var short_name = 'groups_on_homepage'; // An alphabetic (no spaces/numbers, preferably lowercase) distinctive name for the script.
var version = GM_info.script.version; // The version number is automatically fetched from the metadata.
tagpro.ready(function(){ tagpro.scripts = Object.assign( tagpro.scripts || {}, {short_name:{version:version}} ); });
console.log('START: ' + GM_info.script.name + ' (v' + version + ' by ' + GM_info.script.author + ')');


// Userscripts load in the order that they appear in Tamermonkey.
// Set this option to true if you want this script to be inserted to
// the page above than previously load scripts, instead of below.
const insertBefore = false;


var settings = tpul.settings.addSettings({
    id: short_name,
    title: "Configure Groups on Homepage",
    tooltipText: "Groups on Homepage",
    icon: "https://raw.githubusercontent.com/wilcooo/TagPro-GroupsOnHomepage/master/icon.png",

    fields: {
        groups_on_home: {
            label: 'Show all public groups (worldwide) on the homepage',
            type: 'checkbox',
            default: true,
        },
        groups_on_find: {
            label: 'Show all public groups (worldwide) while finding a game',
            type: 'checkbox',
            default: true,
        },
        groups_on_groups: {
            label: 'Show all public groups (worldwide) on the /groups page, instead of just the current server\'s groups',
            type: 'checkbox',
            default: true,
        },
        groups_in_group: {
            label: 'Show all public groups (worldwide) while in a group',
            type: 'checkbox',
            default: true,
        },
        position: {
            label: 'Position of the groups on the homepage',
            type: 'select',
            options: ['top','bottom'],
            default: 'top',
        },
        interval: {
            label: 'How often should this script update the groups, so you don\'t have to F5 all the time? Choose an amount of seconds, or set to 0 to never update',
            type: 'int',
            min: 0,
            max: 600,
            default: 60
        },
    },

    events: {
        open: function () {

            // Changing the layout a bit after the config panel is opened...

            [...this.frame.getElementsByClassName('field_label')].forEach( function(el) {
                el.classList.remove('col-xs-4');
                el.classList.add('col-xs-8');
                el.nextElementSibling.classList.remove('col-xs-8');
                el.nextElementSibling.classList.add('col-xs-4');
            } );
        },
        save: function() {

            // Making sure (most) options take effect immediately after a save...

            position = settings.get("position");
            groups_on_home = settings.get("groups_on_home");
            groups_on_find = settings.get("groups_on_find");
            groups_on_groups = settings.get("groups_on_groups");
            groups_in_group = settings.get("groups_in_group");
            interval = settings.get("interval");


            // Update the position of the groups if necessary:

            var groups_div = document.getElementById('GroPro-groups');

            update_groups();

            groups_div.classList.remove('hidden');

            if (window.location.pathname === '/' && !groups_on_home ||
                window.location.pathname.match(/^\/groups\/[a-z]{8}$/) && !groups_in_group ||
                window.location.pathname === '/groups' && !groups_on_groups ||
                window.location.pathname === '/games/find' && !groups_on_find ) {

                groups_div.classList.add('hidden');
            }

        }
    }
});


var position = settings.get("position"),
    groups_on_home = settings.get("groups_on_home"),
    groups_on_find = settings.get("groups_on_find"),
    groups_on_groups = settings.get("groups_on_groups"),
    groups_in_group = settings.get("groups_in_group"),
    interval = settings.get("interval");






const servers = ['centra','pi','chord','diameter','origin','sphere','radius','orbit'];

// We don't use this api anymore, since anonymous xmlhttpRequests are now possible.
//const groups_api = 'https://script.google.com/macros/s/AKfycbxF5kcVoFbqmLlbHB2_nJ_dCRoh2iOXDpFyzAq0Kw2UDjM7qEHf/exec';


var warned = false;

function get_groups() {return new Promise(function(resolve,reject) {

    var parser = new DOMParser(),
        groups = [],
        pending = 0;

    servers.forEach(function(server) {

        pending ++;

        GM_xmlhttpRequest({
            url: 'http://tagpro-'+server+'.koalabeast.com/groups/',
            anonymous: true,
            onload: done,
            onerror: done,
            timeout: 5000,
            context: server,
        });
    });

    function done(response){

        pending --;

        if (response.finalUrl.includes('groupAuth')) {
            //if (!warned) warned = tagpro.helpers.displayError("Sorry, your IP address has been flagged - so the GroupsOnHome script can't yet show you the groups. No worries though, I'm working on a fix for this.");
            console.error("Sorry, your IP address has been flagged - so the GroupsOnHome script can't yet show you the groups. No worries though, I'm working on a fix for this.");
            groups.flagged = true;
        }

        if (response.response) {

            var groups_doc = parser.parseFromString(response.response, "text/html");
            for (var group_item of groups_doc.getElementsByClassName('group-item')) {

                var group = { server: response.context };
                groups.push(group);

                for (var el of group_item.querySelectorAll("*") ) {
                    if (el.classList.contains('group-type')) {
                        group.type = el.innerText.trim();
                    } else if (el.classList.contains('group-name')) {
                        group.name = el.innerText.trim();
                    } else if (el.tagName == "A") {
                        if (el.href.startsWith("http")) group.link = el.href;
                        else group.link = "http://tagpro-"+group.server+".koalabeast.com"+el.href;
                    } else if (el.innerText.trim().startsWith('Leader')) {
                        group.leader = el.innerText.slice(el.innerText.indexOf(":")+1);
                    } else if (el.innerText.trim().startsWith('Players')) {
                        group.players = el.innerText.slice(el.innerText.indexOf(":")+1);
                    }
                }
            }
        }

        else console.error("Couldn't get groups on "+response.context, response);

        if (pending === 0) resolve(groups);
    }
});}



function update_groups() {


    if (!(window.location.pathname === '/groups' && groups_on_groups || // If we are on the groups selection page
    window.location.pathname.match(/^\/groups\/[a-z]{8}$/) && groups_in_group || // If we are in a group
    window.location.pathname === '/games/find' && groups_on_find || // In the process of joining a game
    window.location.pathname === '/' && groups_on_home )) // If we are on the homepage
    { return; }


    // Relocate the groups container
    // Add the container to the userscript-div and make unhide that
    if (groups_list.parentElement.id == "GroPro-groups") {
        var pos =
            document.getElementById('userscript-'+position) ||
            document.getElementById('userscript-home') ||
            document.getElementById('userscript-top') ||
            (location.host.startsWith("tagpro.") && document.getElementsByClassName('header')[0]);
        if (!pos) return tagpro.helpers.displayError('Sorry, something went wrong while trying to show you the groups of all servers. Error code: Giraffe (inform /u/Wilcooo if you want me to fix it)');
        if (insertBefore) pos.insertBefore(container, pos.firstChild);
        else pos.append(container);
        pos.classList.remove('hidden');
    }

    groups_list.className = 'row groups-list';

    var groups_list_cache = GM_getValue('groups-list-cache',{});

    groups_list.innerHTML = '<div class=spinner align=center> <div class=spinner-item></div> <div class=spinner-item></div> <div class=spinner-item></div> <div class=spinner-item></div>';

    if (Date.now() - groups_list_cache.time < 65e3) groups_list.innerHTML += groups_list_cache.html;

    // Get ping and server stats for each server
    window.addEventListener('load',function(){

        servers.forEach( function(server) {
            var host = 'http://tagpro-'+server+'.koalabeast.com:80';

            var connection = io.connect(host, {transports: ["websocket"]});

            connection.on('connect',function(){
                var ping = -Date.now();
                connection.emit('stats',{},function(stats) {
                    ping += Date.now();

                    styleSheet.insertRule('.'+server+'-stats:after { content:"(ping: '+ping+', '+stats.players+' players in '+stats.games+' games)"; color:#868686; font-style:italic; font-size:small; }');
                    styleSheet.insertRule('.'+server+'-stats .spinner { display:none !important; }');
                });
            });
        });
    });


    get_groups().then(function(groups) {

        groups_list.innerHTML = '';

        for (var group of groups) {
            var group_html =
                    `<div class="col-sm-6 col-md-4">
                        <div class="group-item">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="pull-right group-type"> `+group.type+` </div>
                                    <div class="group-name ellipsis"> `+group.name+` </div>
                                </div>
                                <div class="col-xs-6">
                                    <div class="ellipsis"> Leader: `+group.leader+` </div>
                                    <div class="ellipsis"> Players: `+group.players+` </div>
                                </div>
                                <div class="col-xs-6">
                                    <a class="btn btn-primary pull-right ellipsis" href="`+group.link+`"> Join Group </a>
                                </div>
                                <div class="col-xs-12 ellipsis `+group.server+`-stats">
                                    Server: `+group.server[0].toUpperCase() + group.server.slice(1)+`
                                    <div class=spinner style="display:inline">
                                        <div class=spinner-item></div>
                                        <div class=spinner-item></div>
                                        <div class=spinner-item></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
            groups_list.innerHTML += group_html;
        }

        if (groups.flagged) {
            groups_list.innerHTML = `
                    <div class="col-sm-6 col-md-4">
                        <div class="group-item" style="height:118px; font-size:smaller; color:lightgray">
                            Sorry, your IP address has been flagged by TagPro - so the GroupsOnHome script can't yet show you the groups. No worries though, I'm working on a fix for this.
                        </div>
                    </div>`;
        } else if (groups.length === 0) {
            groups_list.innerHTML = `
                    <div class="col-sm-6 col-md-4">
                        <div class="group-item" style="height:118px">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="group-name">No public groups available. Create one!</div>
                                </div>
                            </div>
                        </div>
                    </div>`;
        }

        if (window.location.pathname !== '/groups') {
            groups_list.innerHTML +=
                `<div class="col-sm-6 col-md-4">
                     <div class="group-item">
                         <div class="row">
                             <form method="post" action="/groups/create">
                                 <div class="col-md-12">
                                     <input name="name" class="group-name" style="background:0;border:0;width:100%;height:27px" value="Your group">
                                 </div>
                                 <div class="col-md-12"><br></div>
                                 <div class="col-xs-6">
                                     <label tabindex="0" class="btn btn-default input-label ellipsis">
                                         <input tabindex="-1" type="checkbox" name="public"> Public Group
                                     </label>
                                 </div><div class="col-xs-6">
                                     <button class="btn btn-primary ellipsis pull-right" style="">Create Group</button>
                                 </div>
                             </form>
                         </div>
                     </div>
                 </div>`;
        }

        for (var label of document.getElementsByClassName('input-label')) {
            label.onkeydown = function(keydown) {
                if (keydown.code == 'Space') {
                    keydown.preventDefault();
                    keydown.target.firstElementChild.checked ^= true;
                }
                if (keydown.code == 'Enter') {
                    keydown.preventDefault();
                    keydown.target.closest('form').submit();
                }
            };
        }

        GM_setValue('groups-list-cache', {'html': groups_list.innerHTML, 'time': Date.now()});
    });


    clearTimeout(timeout);
    if (interval) timeout = setTimeout(update_groups, 1000*interval);
}


var timeout = -1,
    groups_list = document.querySelector(".groups-list") || document.createElement('div');

// Create a container for the groups
if (!groups_list.parentElement) {
    var container = document.createElement('div');
    container.id = 'GroPro-groups';
    container.className = 'container';

    container.appendChild(groups_list);
}

update_groups();


document.head.appendChild( document.createElement('style' ));
var styleSheet = document.styleSheets[ document.styleSheets.length -1 ];

styleSheet.insertRule( '.ellipsis { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }' );
