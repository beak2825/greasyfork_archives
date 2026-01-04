// ==UserScript==
// @name         king1490
// @match        https://*.tankionline.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tankionline.com
// @version      4.0
// @author       king1490
// @description  sus
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/914747
// ==/UserScript==

var button = document.getElementById('iMouseTrick');

setInterval(function(){
   button.click(); 
},150)
class commons{
    getRoot = null
    getReactRoot = null
    getChatState = null
    searchObject = null
    }


    class game{
    getTankPhysics = null
    getTank = null
    getWorld = null
    getPlayers = null
    getMapBoundary = null
    getBattleState = null
    }


    class hacks{
    rapidUpdate = null
    hopper = null
    rico = null
    //oldSmoky (with elevation increase) = null
    //Paladin = null
    //clicker = null
    //



    }



    commons.searchObject = function(object,item){
    try {
    for(let i=0; i<object.length;i++){
    if(object[i].hasOwnProperty(item))
    return object[i]

    }
    } catch (error) {

    }
    }
    commons.getRoot = function(){
    root = document.querySelector("#root")
    return root
    }

    commons.getReactRoot = function(){
    return root._reactRootContainer._internalRoot.current.memoizedState.element.type.prototype.store.subscribers.array_hd7ov6$_0

    }


    game.getTank = function(){
    return commons.searchObject(commons.getReactRoot(),"tank").tank




    }

    game.getWorld = function(){
    return game.getTank().world

    }


    game.getPlayers = function(){
    return game.getWorld().physicsScene_0.bodies_0.array_hd7ov6$_0



    }
    game.getBattleState = function(){

    return commons.getReactRoot().at(1).state.inBattle
    }

    game.isNotOpenChat = function ()
    {
        return (document.getElementsByClassName("sc-bwzfXH iokmvL").item(0) == null);
    }

    game.getTankPhysics = function(){
    return game.getTank().components_0.array[5].tankPhysicsComponent_tczrao$_0
    }


let zhpressCount = 0
    hacks.hopper = function(){
            for (let i = 0; i < game.getTank().components_0.array.length; i++)
        try{game.getTank().components_0.array[i].params_m76zm3$_0.tiltStabilityMaxAngle = 1.5
            game.getTank().components_0.array[i].params_m76zm3$_0.tiltStabilityMaxScale = 8
            game.getTank().components_0.array[i].params_m76zm3$_0.optimalSurfaceDistance = 50
           } catch (error) {
           }}
           document.addEventListener('keydown', function (event) { if (event.key === '8'){
            zhpressCount ++
            if(zhpressCount%2==1){
            window.dh = setInterval(hacks.hopper,1)

            }

            if(zhpressCount%2==0){

            clearInterval(window.dh)

            }
            }})

hacks.rico = function(){
    for (let i = 0; i < game.getTank().components_0.array.length; i++)
try{game.getTank().components_0.array[i].recoilForce_0 = 7000000
   } catch (error) {
   }}
let yhpressCount = 0

  document.addEventListener('keydown', function (event) { if (event.key === '9'){
            yhpressCount ++
            if(yhpressCount%2==1){
            window.bh = setInterval(Clicker,1)

            }

            if(yhpressCount%2==0){

            clearInterval(window.bh)

            }
            }})



root = document.querySelector("#root")
stateWindow = document.createElement("div")
stateWindow_style={
    display: "flex",
    backgroundColor: "rgb(12 12 12 / 28%)",
    height:"40%",
    width:"20%",
    position:"fixed",
    right:"40%",
    transform:"translate(-50%,-50%)",
    borderRadius:"40px",
    borderBottom:"2px solid purple",
    borderLeft:"2px solid purple",
    borderTop:"2px solid purple",
    borderRight:"2px solid purple",
    borderWidth:"2px",
    top: "70%",
    backdropFilter: "10px blur"

}
stateWindow.style.outline = "3px solid blue"
//Object.assign():
Object.assign(stateWindow.style,stateWindow_style);
root.appendChild(stateWindow)

function draggable(el) {
  el.addEventListener('mousedown', function(e) {
    var offsetX = e.clientX - parseInt(window.getComputedStyle(this).left);
    var offsetY = e.clientY - parseInt(window.getComputedStyle(this).top);

    function mouseMoveHandler(e) {
      el.style.top = (e.clientY - offsetY) + 'px';
      el.style.left = (e.clientX - offsetX) + 'px';
    }

    function reset() {
      window.removeEventListener('mousemove', mouseMoveHandler);
      window.removeEventListener('mouseup', reset);
    }

    window.addEventListener('mousemove', mouseMoveHandler);
    window.addEventListener('mouseup', reset);
  });
}

draggable(stateWindow)


title = document.createElement("span")
title.innerText = "Hunter's"
stateWindow.appendChild(title)

title_style = {

color:"white",
textAlign:"fixed",
fontSize : "20px",
padding: "16px 20%",
fontWeight: "1000"





}



Object.assign(title.style,title_style)


Scrusader = document.createElement("span")
Sshaft = document.createElement("span")
Sares = document.createElement("span")
Sstriker = document.createElement("span")
Smammoth = document.createElement("span")
Sgauss = document.createElement("span")
Srico = document.createElement("span")
Shopper = document.createElement("span")
Sclose = document.createElement("span")



label_style = {
position:"fixed",
fontSize:"13px",
padding:"10px 5%",
color:"white",
fontWeight: "1000"
}

Object.assign(Scrusader.style,label_style)
Object.assign(Sshaft.style,label_style)
Object.assign(Sstriker.style,label_style)
Object.assign(Sares.style,label_style)
Object.assign(Smammoth.style,label_style)
Object.assign(Sgauss.style,label_style)
Object.assign(Srico.style,label_style)
Object.assign(Shopper.style,label_style)

Scrusader.innerText = "NULL [NULL]:"
Sshaft.innerText = "NULL [NULL]:"
Sstriker.innerText = "NULL [NULL]:"
Sares.innerText = "NULL [NULL]:"
Sclose.innerText = "Close [0]"
Smammoth.innerText = "NULL [NULL]:"
Sgauss.innerText = "NULL [NULL]:"
Shopper.innerText = "Clicker [8]:"
Srico.innerText = "battle clicker [9]:"


Scrusader.style.bottom = "75%"
Sshaft.style.bottom = "70%"
Sstriker.style.bottom = "65%"
Sares.style.bottom = "60%"
Sclose.style.bottom = "60%"
Smammoth.style.bottom = "55%"
Sgauss.style.bottom = "50%"
Shopper.style.bottom = "45%"
Srico.style.bottom = "40%"


stateWindow.appendChild(Scrusader)
stateWindow.appendChild(Sshaft)
stateWindow.appendChild(Sares)
stateWindow.appendChild(Sstriker)
stateWindow.appendChild(Sclose)
stateWindow.appendChild(Smammoth)
stateWindow.appendChild(Sgauss)
stateWindow.appendChild(Shopper)
stateWindow.appendChild(Srico)


onOff_style = {
position:"fixed",
fontSize:"13px",
padding:"10px 5%",
color:"red",
right:"0%",
fontWeight: "1000"

}


State1 = document.createElement("span")
State7 = document.createElement("span")
State10 = document.createElement("span")
State6 = document.createElement("span")
state2 = document.createElement("span")
State3 = document.createElement("span")
State4 = document.createElement("span")
State8 = document.createElement("span")
State9 = document.createElement("span")



Object.assign(State1.style,onOff_style)
Object.assign(State7.style,onOff_style)
Object.assign(State10.style,onOff_style)
Object.assign(State6.style,onOff_style)
Object.assign(State3.style,onOff_style)
Object.assign(State4.style,onOff_style)
Object.assign(State8.style,onOff_style)
Object.assign(State9.style,onOff_style)



State1.innerText = "NULL"
State7.innerText = "NULL"
State6.innerText = "NULL"
State10.innerText = "NULL"
State3.innerText = "NULL"
State4.innerText = "NULL"
State8.innerText = "OFF"
State9.innerText = "OFF"


stateWindow.appendChild(State1)
stateWindow.appendChild(State7)
stateWindow.appendChild(State6)
stateWindow.appendChild(State10)
stateWindow.appendChild(State3)
stateWindow.appendChild(State4)
stateWindow.appendChild(State8)
stateWindow.appendChild(State9)



State1.style.bottom = "75%"
State7.style.bottom = "70%"
State6.style.bottom = "65%"
State10.style.bottom = "60%"
State3.style.bottom = "55%"
State4.style.bottom = "50%"
State8.style.bottom = "45%"
State9.style.bottom = "40%"




s5p = 0
s7p = 0
s10p = 0
s6p = 0
s3p = 0
s4p = 0
s8p = 0
s9p = 0


document.addEventListener('keydown', (e) => { if (e.keyCode === 35 && game.isNotOpenChat()){
s6p+=1
if(s6p%2==1){
State6.innerText = "NULL"
State6.style.color = "#00D000"
window.hy = setInterval(hacks.striker,1)


}

if(s6p%2==0){

clearInterval(window.hy)
State6.innerText = "NULL"
State6.style.color = "#FF0000"
}







}})





document.addEventListener('keydown', (e) => { if (e.keyCode === 117 && game.isNotOpenChat()){
s4p+=1
if(s4p%2==1){
State4.innerText = "NULL"
State4.style.color = "#00D000"
window.hq = setInterval(hacks.gauss,1)


}

if(s4p%2==0){

clearInterval(window.hq)
State4.innerText = "NULL"
State4.style.color = "#FF0000"
}







}})


document.addEventListener('keydown', (e) => { if (e.keyCode === 56 && game.isNotOpenChat()){
s8p+=1
if(s8p%2==1){
State8.innerText = "ON"
State8.style.color = "#00D000"
window.hv = setInterval(hacks.hopper,1)


}

if(s8p%2==0){

clearInterval(window.hv)
State8.innerText = "OFF"
State8.style.color = "#FF0000"
}







}})


document.addEventListener('keydown', (e) => { if (e.keyCode === 57 && game.isNotOpenChat()){
s9p+=1
if(s9p%2==1){
State9.innerText = "ON"
State9.style.color = "#00D000"
window.ha = setInterval(hacks.rico,1)


}

if(s9p%2==0){

clearInterval(window.ha)
State9.innerText = "OFF"
State9.style.color = "#FF0000"
}







}})

WpressCount = 0
document.addEventListener('keydown', (e) => { if (e.keyCode === 48 && game.isNotOpenChat()){
WpressCount ++
if(WpressCount%2==1){
root.appendChild(stateWindow)


}

if(WpressCount%2==0){

root.removeChild(stateWindow)

}


}})
         