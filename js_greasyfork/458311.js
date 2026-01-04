// ==UserScript==
// @name         ShellShockers Aimbot and ESP
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  stuff
// @author       PacyTense
// @match        *://shellshock.io/*
// @run-at       document-start
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/458311/ShellShockers%20Aimbot%20and%20ESP.user.js
// @updateURL https://update.greasyfork.org/scripts/458311/ShellShockers%20Aimbot%20and%20ESP.meta.js
// ==/UserScript==




window.settings = {
    blueTeam: "#4254f5",
    redTeam: "#eb3326",
    orangeTeam: "#fca503",
    aimbotKey: "ShiftLeft",
    angleOrDistance: true,
    aimbotSmoothness: 2,
    maxAngle: 3,
    fov: 1.25,
}


window.aimbotToggled = false;

window.addEventListener('keydown', function(e){
    if(e.code == window.settings.aimbotKey){
        window.aimbotToggled = true;
    }

})

window.addEventListener('keyup', function(e){
    if(e.code == window.settings.aimbotKey){
        window.aimbotToggled = false;
    }

})

window.dist3d = (player1, player2)=>{return Math.sqrt((player1.x-player2.x)**2 + (player1.y-player2.y)**2 + (player1.z-player2.z)**2)};

window.angleDistance =(player1, player2)=>{


    let angle = window.getAngle(player1, player2);

    const angleDist = Math.sqrt((player1.yaw - angle.yaw)**2 + (player1.pitch - angle.pitch)**2);
    return angleDist*window.dist3d(player1, player2);

}


window.getNearestPlayer = function(us, enemies){

    let nearestPlayer = {distance: null, player: null} //we leave it empty to start

    enemies.forEach(them=>{

        if(them){ //sometimes a glitched player slips thorugh, so lets make sure they are valid before we do anything

            if(them.id != us.id){ //our own player is in here, so lets make sure to filter it out

                if(them.hp > 0 && them.playing && (!us.team || (us.team != them.team)) && window.visiblePlayers[them.id]){
                    //firstly lets make sure they arent dead hp > 0, then make sure they are playing and not spectating
                    //then lets check if our team is equal to their team
                    //one thing to note, in FFA both our teams are 0, so it would never run cause it would think we are on their team
                    //so what we do is if(us.team) will return false for team = 0 and true for team != 0
                    // so it is effectivly if our team is 0 (FFA) or our team isnt equal to their team```

                    let distance = 999;
                    if(window.settings.angleOrDistance){
                        distance = window.angleDistance(us,them) || 0;
                    }else{
                        distance = window.dist3d(us,them) || 0;
                    }
                    if(  !nearestPlayer.distance || distance < nearestPlayer.distance  ){
                        nearestPlayer.distance = distance;
                        nearestPlayer.player = them;
                    }
                }
            }
        }
    })
    if(nearestPlayer.player){
        return nearestPlayer;
    }
    return null;
}

window.calcAngle = function(us, them, dist){
    let delta = {x: them.x - us.x + 2*(them.dx * dist / us.weapon.subClass.velocity),
                 y: them.y-us.y - 0.072,
                 z: them.z - us.z + 2*(them.dz * dist / us.weapon.subClass.velocity)
                };

    delta = new BABYLON.Vector3(delta.x, delta.y, delta.z).normalize();
    const newYaw = Math.radRange(-Math.atan2(delta.z, delta.x) + Math.PI / 2)

    const newPitch = Math.clamp(-Math.asin(delta.y), -1.5, 1.5);



    us.pitch += ((newPitch || 0)-us.pitch)/window.settings.aimbotSmoothness;
    us.yaw += ((newYaw || 0)-us.yaw)/window.settings.aimbotSmoothness;


    return 0;
}

window.getAngle = function(us, them){
    let delta = {x: them.x - us.x ,
                 y: them.y-us.y - 0.072,
                 z: them.z - us.z,
                };

    delta = new BABYLON.Vector3(delta.x, delta.y, delta.z).normalize();
    const newYaw = Math.radRange(-Math.atan2(delta.z, delta.x) + Math.PI / 2)

    const newPitch = Math.clamp(-Math.asin(delta.y), -1.5, 1.5);


    return {pitch: newPitch || 0, yaw: newYaw || 0};
}



//aimbot function
window.otherPlayer;
window.myPlayer;

window.espColourSettings = function(that){
    if(that.player.team==1){
        that.bodyMesh.overlayColor = hexToRgb(window.settings.blueTeam);
    }else if(that.player.team==2){
        that.bodyMesh.overlayColor = hexToRgb(window.settings.redTeam);
    }else{
        that.bodyMesh.overlayColor = hexToRgb(window.settings.orangeTeam);
    }
    that.bodyMesh.setRenderingGroupId(1);
}

window.doAimbot = (ourPlayer,otherPlayers)=>{

    if(!window.aimbotToggled){return};
    if(!window.myPlayer){
        otherPlayers.forEach(player=>{
            if(player){
                if(player.ws){
                    window.myPlayer = player;
                }}
        })
    };
    //loop through other palyers
    let nearest = window.getNearestPlayer(ourPlayer, otherPlayers);
    if(nearest){
        //console.log(nearest.name);
        calcAngle(window.myPlayer, nearest.player, nearest.distance)
    }

};
window.visiblePlayers = {};


//The game Does hack check, where if a hack is detected, it sets ur uuid to 255 which stiops u from doing damage
//what we do here is redefine the varaible to always return 0 so they can never flag us hehehe
Object.defineProperty(window, "uuid", {get: ()=>{return 0}});


//stuff from here on is code used to extract code from the games code, trippy right?
const request = url => fetch(url).then(res => res.text());
const injectInline = (data) => {
    let s = document.createElement('script');
    s.type = 'text/javascript';
    s.innerText = data;
    document.getElementsByTagName('head')[0].appendChild(s);
}


window.hexToRgb =(hex)=>{
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16)/255,
        g: parseInt(result[2], 16)/255,
        b: parseInt(result[3], 16)/255,
        a: 1,
    } : null;
}

const attemptPatch = (source) => {
    const patches = new Map()


    //we get a copy of theg games code, and search for specific location. We found our player stuff and then call our external function where we can run our aimbot logic!
    .set("RENDERHOOK", [/var (\w+)=([a-zA-Z$]+)\(this\.mesh,\.(\d+)\);/, "rep = `var ${match[1]} = ${match[2]}(this.mesh,.31);window.visiblePlayers[this.player.id]=${match[1]};${match[1]}=true;this.bodyMesh.renderOverlay = !0;window.espColourSettings(this);`", true])
    .set("PLAYERHOOK", [/if\([^(\/.,)]+\)([^(\/.,)]+)\.actor\.update\([^(\/.,)]+\);/, false])
    .set("ENEMYHOOK", [/var [^(\/.,=]+\=([^(\/.,\[\]]+)\[[^(\/.,\[\]]\];[^(\/.,=&]+\&\&\([^(\/.,=]+\.chatLineCap/, false])
    .set("AIMBOTHOOK", [/[^(\/.,]+\([^(\/.,]+,[^(\/.,]+\/\d+\),[^(\/.,]+\.runRenderLoop\(\(function\(\)\{/, "rep = `${match[0]}window.doAimbot(${variables.PLAYERHOOK[1]}, ${variables.ENEMYHOOK[1]});`", true])

    variables = {};

    for (const [name, item] of patches) {
        let match = source.match(item[0]);

        if(!item[1]){
            if(match){
                variables[name] = match;
            }else{
                alert(`Failed to variable ${name}`);
                continue;
            }
        }else{
            let rep;
            try{
                eval(item[1]);
            }catch(e){
                alert(`Failed to patch ${name}`);
                continue;
            }
            console.log(rep);

            const patched = source.replace(item[0], rep);
            if (source === patched) {
                alert(`Failed to patch ${name}`);
                continue;
            } else console.log("Successfully patched ", name);
            source = patched;
        }
    }

    return source;
}

(async function() {
    let script = await request(`https://shellshock.io/src/shellshock.min.js`);
    console.log(script);
    injectInline(attemptPatch(script)) //modify the games code and then apply it :))
})();



//using a mutation observer oooohhh fancy ik! we can detect scripts before they run and patch them.
let observer = new MutationObserver(mutations => {

    for (const mutation of mutations) {

        for (let node of mutation.addedNodes) {

            if (node.tagName == 'HEAD') {
            } else if (node.tagName == 'SCRIPT' && node.src.includes("shellshock.min.js")) {
                node.outerHTML = ``
                //or we can make it point towards our own custom JS file...
                //node.src = "https://ourFileLocation/code.js"
            }
        }
    }
});

observer.observe(document, {
    childList: true,
    subtree: true
})