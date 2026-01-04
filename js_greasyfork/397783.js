// ==UserScript==
// @name        MargoBot
// @namespace   OwnScripts
// @match       http://jaruna.margonem.pl/
// @version     1.1
// @grant       none
// @author      Dave322
// @description 5.03.2020, 13:14:41
// @downloadURL https://update.greasyfork.org/scripts/397783/MargoBot.user.js
// @updateURL https://update.greasyfork.org/scripts/397783/MargoBot.meta.js
// ==/UserScript==
function simulate(element, eventName)
{
    var options = extend(defaultOptions, arguments[2] || {});
    var oEvent, eventType = null;

    for (var name in eventMatchers)
    {
        if (eventMatchers[name].test(eventName)) { eventType = name; break; }
    }

    if (!eventType)
        throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

    if (document.createEvent)
    {
        oEvent = document.createEvent(eventType);
        if (eventType == 'HTMLEvents')
        {
            oEvent.initEvent(eventName, options.bubbles, options.cancelable);
        }
        else
        {
            oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
            options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
            options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
        }
        element.dispatchEvent(oEvent);
    }
    else
    {
        options.clientX = options.pointerX;
        options.clientY = options.pointerY;
        var evt = document.createEventObject();
        oEvent = extend(evt, options);
        element.fireEvent('on' + eventName, oEvent);
    }
    return element;
}

function extend(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
}

var eventMatchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
}
var defaultOptions = {
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
}

function mobileAndTabletcheck() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };

//-----------------------------------

function Enemy(id, name, lvl, left, top, isFocused = false) {
    this.id = id;
    this.name = name;
    this.lvl = lvl;
    this.left = left-document.getElementById("hero").style.left.substring(0,document.getElementById("hero").style.left.length-2);
    this.top = top-document.getElementById("hero").style.top.substring(0,document.getElementById("hero").style.top.length-2);
    this.isFocused = isFocused;
}

function Node_status(status,nodes)
{
    this.status = status;
    this.nodes = Array.from(nodes);
}

function getProperty(element,regex,exclude_start,exclude_end)
{
    var match = element.outerHTML.match(regex);
    if(match != null) return match[0].substring(exclude_start, match[0].length-exclude_end);
}

function getDistance(enemy)
{
    if(enemy == undefined) return false;
    return Math.sqrt(Math.pow(enemy.left,2)+Math.pow(enemy.top,2)); 
}

function getClosestTarget()
{
    var enemies;
    if(window.Bot_focusedEnemies.length > 0)
    {
        enemies = getEnemies(true,window.Bot_focusedEnemies[0].name);
        if(enemies.length == 0) enemies = getEnemies();
    }
    else enemies = getEnemies();

    var lowest_index = 0;
    var lowest_value = 999999;

    enemies.forEach(enemy => {
        if(getDistance(enemy) < lowest_value)
        {
            lowest_index = enemies.indexOf(enemy);
            lowest_value = getDistance(enemy);
        }
    });

    return enemies[lowest_index];
}

function getEnemies(ignoreLevel=false,name)
{
    var npcs = document.getElementsByClassName("npc");
    var enemies_total = new Array(0);
    Array.prototype.forEach.call(npcs, function(npc) {
        var group_lvl_unicreased_str = getProperty(npc,/<span >\d+? lvl, grp<\/span>/gm,7,16);

        var temp_enemy = new Enemy(npc.id,getProperty(npc,/<b>.+?<\/b>/gm,3,4),
        (group_lvl_unicreased_str!=undefined)?(parseInt(group_lvl_unicreased_str)+group_lvl_increase):getProperty(npc,/<span >\d+? lvl<\/span>/gm,7,11),
        getProperty(npc,/left: .+?px;/gm,6,3),
        getProperty(npc,/top: .+?px;/gm,5,3),
        (name==undefined)?false:true);

            var isValid = true;
            if(temp_enemy.name == undefined) isValid = false;
            if(temp_enemy.lvl == undefined) isValid = false;
            if(name != undefined && temp_enemy.name != name) isValid = false;
            if(!ignoreLevel && min_lvl > temp_enemy.lvl) isValid = false; //only if cares for lvls
            if(temp_enemy.lvl > max_lvl) isValid = false;
            if(blacklistedEnemyIDs.includes(temp_enemy.id)) isValid = false;

            if(isValid) enemies_total.push(temp_enemy);
    });
    return enemies_total;
}

function updateHeroStats()
{
    heroHP = getProperty(document.getElementById("life1"),/<\/B>\d+ \//gm,4,2);
    heroMaxHP = getProperty(document.getElementById("life1"),/\/ \d+/gm,2,0);
    heroLVL = getProperty(document.getElementById("nick"),/\d+\w<\/h1>/gm,0,6);
    heroEXP = getProperty(document.getElementById("exp1"),/<\/B>\d+/gm,4,0);
    heroEXPtillNextLvl = getProperty(document.getElementById("exp1"),/<br>[\W|\d]+?">/gm,4,2);
    heroMaxEXP = getProperty(document.getElementById("exp1"),/\/ \d+<br>/gm,2,4);
    try {heroEXPEnergy = document.documentElement.innerHTML.match(/tip="Limit 6h\/dzień">\d+/gm)[0].substring(21);}
    catch(err) { heroEXPEnergy = -1; }
    document.title = `Lvl:${heroLVL} ${heroEXPtillNextLvl.replace(/\s/g,'')} to next lvl! ${(heroEXPEnergy > -1)?heroEXPEnergy:"??"} min left`;
}

function behaviour_core()
{
    behaviourIdle = false;
    var target = getClosestTarget();

    timeout_blacklistEnemy = setTimeout(function(){
        if(target != undefined)
        {
            if(!blacklistedEnemyIDs.includes(target.id))
            {
                blacklistedEnemyIDs.push(target.id);
                console.log("Blacklisted:");
                console.log(target);
            }
        }
        target = getClosestTarget();
        
    },60000);

    interval_tryBattle=setInterval(function(){
        if(document.getElementById("battle").style.display == "none" || document.getElementById("battle").style.display == "")
        {
            if(target != undefined && document.getElementById(target.id) != undefined)
            {
                var viewportOffset = document.getElementById(target.id).getBoundingClientRect();
                simulate(document.getElementById(target.id),"click",
                { pointerX: viewportOffset.left + document.getElementById(target.id).style.width.substring(0,document.getElementById(target.id).style.width.length-2)/2,
                pointerY: viewportOffset.top + document.getElementById(target.id).style.height.substring(0,document.getElementById(target.id).style.height.length-2)/2 });
            } else {
                clearTimeout(timeout_blacklistEnemy);
                target = getClosestTarget();
                if(target == undefined)
                {
                    target = getClosestTarget(true);
                    if(target == undefined) console.log("Awaiting enemies!");
                }
            }
        }
        else
        {
            clearTimeout(timeout_blacklistEnemy);
            clearInterval(interval_tryBattle);
            setTimeout(function(){
                interval_tryLeave=setInterval(
                    function(){
                        if(document.getElementById("battle").style.display == "block")
                        {
                            _g('fight&a=f');
                            if(document.getElementById("loots").style.display == "block")
                                try { sendLoots(1,false); } catch(err) {}
                            canLeave();
                            updateHeroAppearance();
                        }
                        else {
                            clearTimeout(timeout_blacklistEnemy);
                            clearInterval(interval_tryLeave); 
                            if(target != undefined)
                            if(target.isFocused)
                            {
                                window.Bot_focusedEnemies.forEach(enemy=>{
                                    var enemyIndex = window.Bot_focusedEnemies.indexOf(enemy);
                                    if(enemy.name == target.name) window.Bot_focusedEnemies[enemyIndex].count = window.Bot_focusedEnemies[enemyIndex].count - 1;
                                    if(window.Bot_focusedEnemies[enemyIndex].count==0) window.Bot_focusedEnemies.splice(enemyIndex,1);
                                });
                                console.log(`Defeated an objective: ${target.name}(lvl:${target.lvl})`);
                                console.log("focused Enemies:")
                                console.log(window.Bot_focusedEnemies);
                            }
                            if(repeat_behaviour) behaviour();
                            else
                            {
                                console.log("Ready!");
                                behaviourIdle = true;
                            }
                        }
                    },window.Bot_action_interval/2);
                }, 3000);
        }
    },window.Bot_action_interval);
}

async function behaviour()
{
    updateHeroStats();
    if(heroEXPEnergy == 0)
    {
        window.Bot_window.Bot_stop("Hero exhausted! No more point in playing anymore!");
        return;
    } else if (heroEXPEnergy < 0) console.log("Could not load exhaustion value!\nPlease switch stats to page 2!");

    if(heroHP/heroMaxHP >= window.Bot_hero_health_threshold) behaviour_core();
    else
    {
        console.log("Healing!");
        interval_tryHeal=setInterval(function(){
            var healing_left = healWithConsumable();
            updateHeroStats();
            setTimeout(function(){
                if(heroHP/heroMaxHP >= window.Bot_hero_health_threshold || !healing_left)
                {
                    clearInterval(interval_tryHeal);
                    if(heroHP/heroMaxHP >= window.Bot_hero_health_threshold) behaviour_core();
                    else window.Bot_stop("Health low! Not enough healing! Actual threshold: " + window.Bot_hero_health_threshold);
                }
            },100);
        });
    }
}

window.Bot_getEnemyLevelDistribution = function()
{
    var enemies = getEnemies(true);
    for(var l = 1; l < 999; l++) if(enemies.filter(enemy => enemy.lvl==l).length > 0) console.log(`Level ${l}: ${enemies.filter(x => x.lvl==l).length} occurences`)
}

window.Bot_focusedEnemy = function(name,count)
{
    this.name = name;
    this.count = count;
}

window.Bot_start = function(lvl_min=1,lvl_max=999) { console.log("Script started!"); window.Bot_setLvlRange(lvl_min,lvl_max); repeat_behaviour = true; behaviour(); }
window.Bot_stop = function(message="Script stopped!") {
    clearAllIntervals();

    clearTimeout(timeout_blacklistEnemy);
    repeat_behaviour = false;
    console.log(message);
    this.sessionStorage.removeItem("minLvl");
    this.sessionStorage.removeItem("maxLvl");
}

window.Bot_setLvlRange = function(min,max) {

    this.sessionStorage.setItem("minLvl",min);
    this.sessionStorage.setItem("maxLvl",max);

    var old_min =  min_lvl;
    var old_max =  max_lvl;
    
    min_lvl = min;
    max_lvl = max;

    if(getEnemies().length > 0) console.log("Success! There are " + getEnemies().length + " enemies at levels " + min_lvl + "-" + max_lvl);
    else 
    {
        console.log("No enemies found! Back to level range " + old_min + "-" + old_max);
        min_lvl = old_min;
        max_lvl = old_max;
    }
}

function getItems(regexPattern)
{
var draggables = document.getElementsByClassName("item ui-draggable");
var items = Array.from(draggables).filter(draggable => draggable.id.substring(0,4)=="item");
return items.filter(item => item.outerHTML.match(regexPattern) != null);
}

window.Bot_sellItems = function(contain)
{
    getItems(new RegExp(contain,"gm")).forEach(item => {
    
        simulate(item,"click");
    });
}

function healWithConsumable()
{
    if(getItems(/Typ:  Konsumpcyjne<\/span><br \/>Leczy \d+ punktów życia/gm).length > 0)
    {
       simulate(getItems(/Typ:  Konsumpcyjne<\/span><br \/>Leczy \d+ punktów życia/gm)[0],"dblclick");
       return true;
    }
    else return false;
}

window.Bot_travelToLocation = function(location)
{
    var gateways = document.querySelectorAll("[class^='gw']");

    var nextStop = Array.from(gateways).filter(gateway => gateway.attributes.tip.value.includes(location))[0];

    if(nextStop != undefined)
    {
            window.Bot_stop("Stopping regular behaviour!");
            console.log(`On my way to \"${location}\"!`)
            interval_tryTraveling=setInterval(function(){
                if(nextStop != undefined)
                {
                    if(behaviourIdle)
                    {
                        if(document.getElementById("battle").style.display != "block")
                        {
                            var viewportOffset = document.getElementById(nextStop.id).getBoundingClientRect();
                            simulate(document.getElementById(nextStop.id),"click",{ pointerX: viewportOffset.left + 16, pointerY: viewportOffset.top + 16 });
                            //_g("walk"); (nie działa jesli nie jest sie na waypoincie)
                        } else {
                            _g('fight&a=f');
                            if(document.getElementById("loots").style.display == "block")
                                try { sendLoots(1,false); } catch(err) {}
                            canLeave();
                            updateHeroAppearance();
                        }
                    }
                }
                else clearInterval(interval_tryTraveling);
            },window.Bot_action_interval);
    } else console.log(`No gateway to ${location}!`);
}

function updateHeroAppearance()
{document.getElementById("hero").style = "background-image: url(" + skin_url + "); width: 32px; height: 48px; left: " + document.getElementById("hero").style.left + "; top: " + document.getElementById("hero").style.top + "; background-position: 0px 0px; z-index: 94;";}

window.Bot_setWaypoints = function()
{
    this.console.log(arguments[0]);
    sessionStorage.removeItem("waypoints");
    sessionStorage.setItem("waypoints", arguments[0]);
    stop();
    window.Bot_travelToLocation(arguments[0][0]);
}

var min_lvl = 1;
var max_lvl = 999;
var repeat_behaviour = false;
var skin_url = "https://www.margonem.pl/obrazki/postacie//paid/cdam2.gif";
var group_lvl_increase = 3;
var blacklistedEnemyIDs = new Array(0);

//public
window.Bot_focusedEnemies = new Array(0);
window.Bot_action_interval = 2000;
window.Bot_hero_health_threshold = 0.3;

var timeout_blacklistEnemy;
var interval_tryBattle;
var interval_tryHeal;
var interval_tryLeave;
var interval_tryTraveling;

var map_travel_waypoints = Array(0);

var loading_timeout = 1000;

var heroHP;
var heroMaxHP;
var heroLVL;
var heroEXP;
var heroMaxEXP;
var heroEXPEnergy;
var behaviourIdle = true;

function getLocation(){return document.getElementById("botloc").attributes.tip.value;}

function clearAllIntervals()
{
    clearInterval(interval_tryBattle);
    clearInterval(interval_tryHeal);
    clearInterval(interval_tryLeave);
    clearInterval(interval_tryTraveling);
}

function handleMapMaker()
{
    var last_location = localStorage.getItem("lastLocation");
    var actual_location = getLocation();

    if(last_location != actual_location)
    {
        var listOfConnections = (localStorage.getItem("listOfConnections").length>0)?JSON.parse(localStorage.getItem("listOfConnections")):null;

        var updateList = false;
        if(listOfConnections==null)
        {
            updateList = true;
            listOfConnections = new Array(0);
        }
        else if(!listOfConnections.some(connection=>(connection[0]==actual_location && connection[1]==last_location)||
                                                    (connection[1]==actual_location && connection[0]==last_location))) updateList = true;

        if(updateList == true) listOfConnections.push([last_location,actual_location]);

        localStorage.setItem("listOfConnections",JSON.stringify(listOfConnections));
    }
}

{/*function getNextWaypointIndex(location,endlocation,connections,waypoint_indexes,blacklisted_waypoint_indexes) //returns array [int,[waypoints]] -1 -> blacklist 0->continue 1->accept
{
    var result = trackPivot(location,waypoint_indexes,connections);
    var pivot = result[0];
    var locationsTraveled = result;
    locationsTraveled.splice(0,1);
    //if(locationsTraveled==undefined) locationsTraveled = new Array(0);

    var waypoint_indexes_new = waypoint_indexes;
    waypoint_indexes_new.push(0);
    
    avaible_connections = connections.filter(connection=>(connection[0]==pivot||connection[1]==pivot));

    while(blacklisted_waypoint_indexes.includes(waypoint_indexes_new) || locationsTraveled.includes(trackPivot(location,waypoint_indexes_new,connections)[0]))
    {
        console.log(avaible_connections);
        console.log(waypoint_indexes_new);
        console.log(blacklisted_waypoint_indexes);

        var avaible_connections_locationsTraveled_exclusive = avaible_connections.filter(
            connection=>((connection[0]==pivot&&!locationsTraveled.includes(connection[1])
                       ||(connection[1]==pivot&&!locationsTraveled.includes(connection[0])))
                       &&!blacklisted_waypoint_indexes.includes(waypoint_indexes_new)));

                      console.log(avaible_connections);
                      console.log(avaible_connections_locationsTraveled_exclusive);
        

        if(avaible_connections_locationsTraveled_exclusive.length <= waypoint_indexes_new[waypoint_indexes_new.length-1])
        {
            waypoint_indexes_new.splice(waypoint_indexes_new.length-1,1,waypoint_indexes_new[waypoint_indexes_new.length-1] + 1);
        }
        else
        {
            console.log("blacklisted: ",waypoint_indexes);
            return new Node_status(-1,waypoint_indexes);  
        }

        locationsTraveled = trackPivot(location,waypoint_indexes_new,connections);
        locationsTraveled.splice(0,1);
        console.log(locationsTraveled);
        console.log(trackPivot(location,waypoint_indexes_new,connections)[0]);
    }

    {
        console.log(avaible_connections);
        console.log(waypoint_indexes_new);
    var connection_temp = avaible_connections[waypoint_indexes_new[waypoint_indexes_new.length-1]];
    if(connection_temp[0] == endlocation || connection_temp[1] == endlocation) return new Node_status(1,waypoint_indexes_new);
    }

    console.log(new Node_status(0,waypoint_indexes_new));

    return new Node_status(0,waypoint_indexes_new);

}

function trackPivot(location,waypoint_indexes,connections)
{
    var pivot = location;
    var avaible_connections = new Array(0);
    var locationsTraveled = new Array(0);

    waypoint_indexes.forEach(index=>{
        avaible_connections = connections.filter(connection=>(connection[0]==pivot || connection[1]==pivot));

        console.log(avaible_connections);
        console.log(waypoint_indexes);
        console.log(index);
        console.log(pivot);

        if(avaible_connections[waypoint_indexes[index]][0]==pivot)
        {
            pivot = avaible_connections[waypoint_indexes[index]][1];
            locationsTraveled.push(avaible_connections[waypoint_indexes[index]][0])
        } else {
            
            pivot = avaible_connections[waypoint_indexes[index]][0];
            locationsTraveled.push(avaible_connections[waypoint_indexes[index]][1])
        }});

        var result = new Array(0);
        result.push(pivot);
        result2 = result.concat(locationsTraveled);
        
        return result2;
}

window.Bot_autoTravelTo = function(location,maxlvl)
{
    var connectionsStr = localStorage.getItem("listOfConnections");
    if(!connectionsStr.length > 0)
    {
        console.log("Can't load connection pairs!");
        return;
    }

    var connections = Array.from(JSON.parse(connectionsStr));
    var actual_location = getLocation();

    var blacklistedNodes = new Array(0);
    var actual_node = getNextWaypointIndex(actual_location,location,connections,new Array(0),blacklistedNodes).nodes;

    this.console.log(actual_node);

    var iteration = 0;

    while(true)
    {
        iteration++;
        if(iteration>18) { this.console.log("Iteration reached over 18!"); break; }

        var result = trackPivot(actual_location,actual_node,connections);
        var pivot = result[0];

        var avaible_connections = connections.filter(connection=>(connection[0]==pivot || connection[1]==pivot));
        
        this.console.log(result);

        var connectionavaible = false;
        for(var i = 0; i < avaible_connections.length; i++) if(!blacklistedNodes.includes([i])) connectionavaible = true;
        if(!connectionavaible) 
        {
            console.log("Can't find connections to the destination!");
            break;
        } else {
            do{
                var result = getNextWaypointIndex(actual_location,location,connections,actual_node,blacklistedNodes);
                if(result.status==-1)
                {
                    blacklistedNodes.push(result.nodes);
                    result.nodes.splice(result.nodes.length-1,1);
                    actual_node = result.nodes;
                    this.console.log(blacklistedNodes);
                }
            } while(result.status==-1)

            if(result.status==1)
            {
                this.console.log(result.nodes);
            }
        }
    }
}*/}//nie wypaliło :(

window.onload = function()
{
    this.setTimeout(function(){
        var alert = document.getElementById("alert");
        alert.parentNode.removeChild(alert);

        //is mobile: start console

        if(mobileAndTabletcheck())
        {
            window.toggleConsole();
        } else
        {
            var targetNode = document.getElementById('console');
            var observer = new MutationObserver(function(){if(targetNode.style.display == 'block') location.reload();});
            observer.observe(targetNode, { attributes: true, childList: true });
        }

        document.getElementById("inmap2").onclick = function(){  
            if(document.getElementById("inmap2").querySelector("#maptip").style.display != "none")
            {
                map_travel_waypoints.push(document.getElementById("inmap2").querySelector("#maptip").innerHTML);
                console.log("Added to waypoints: " + document.getElementById("inmap2").querySelector("#maptip").innerHTML);
            }
                 //stara wersja: window.Bot_autoTravelTo(document.getElementById("inmap2").querySelector("#maptip").innerHTML);
        };

        var targetNode = document.getElementById('minimap');
        var observer = new MutationObserver(function(){
            if(targetNode.style.display == 'none'){
                if(map_travel_waypoints.length!=0)
                {
                    Bot_setWaypoints(map_travel_waypoints);
                    map_travel_waypoints = new Array(0);
                }
            }
        });
        observer.observe(targetNode, { attributes: true, childList: true });

        console.clear();
        updateHeroAppearance();
    
        handleMapMaker();

        var waypointsStr = this.sessionStorage.getItem("waypoints");
        var waypoints = (waypointsStr!=null)?waypointsStr.split(","):new Array(1);

        waypoints.splice(0,1);

        sessionStorage.setItem("waypoints",waypoints);

        if(waypoints.length > 0)
        {
            console.log("Waypoints: ");
            console.log(waypoints);

            if(!parseInt(waypoints[0],10)>0)
            {
                this.console.log("Waypoints: " + waypoints);
                var delayedTravel = setTimeout(window.Bot_travelToLocation(waypoints[0]),loading_timeout);
            }
            else var delayedStart = setTimeout(window.Bot_start(1,waypoints[0]),loading_timeout);
        } else if(this.sessionStorage.getItem("minLvl") != undefined)
        {
            console.log("Autostart!");
            var delayedStart2 = setTimeout(window.Bot_start(sessionStorage.getItem("minLvl"),sessionStorage.getItem("maxLvl")),5000);
        }
    },3000);
}

window.onbeforeunload = function()
{
localStorage.setItem("lastLocation",getLocation());
}