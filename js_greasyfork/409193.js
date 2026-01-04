// Cornflower Client v1.0.0
// Fork of "the travelers tools" by LightningWB
//Extends that >>> https://github.com/pfgithub/customizations/blob/master/userscripts/thetravelers.online/animatemovement.user.js
// Modified by Prim_us for personal use

// ==UserScript==
// @name         animate movement
// @namespace    https://pfg.pw/
// @version      1.0
// @description  animate movement in the travelers
// @author       pfg
// @match        https://thetravelers.online/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409193/animate%20movement.user.js
// @updateURL https://update.greasyfork.org/scripts/409193/animate%20movement.meta.js
// ==/UserScript==

{

window.el = (nme) => document.createElement(nme);
window.txt = (txt) => document.createTextNode(txt);
Node.prototype.attr = function(atrs) {Object.entries(atrs).forEach(([k, v]) => this.setAttribute(k, v)); return this;};
Node.prototype.adto = function(prnt) {prnt.appendChild(this); return this;};
Node.prototype.adch = function(chld) {this.appendChild(chld); return this;};
Node.prototype.atxt = function(txta) {this.appendChild(txt(txta)); return this;};
Node.prototype.onev = function(evnm, cb) {this.addEventListener(evnm, cb); return this;};
Node.prototype.clss = function(clss) {clss.split(".").filter(q => q).map(itm => this.classList.add(itm)); return this;};
function raw(string) {
	return { __raw: "" + string };
}
function templateGenerator(helper) {
    return (strings, ...values) => {
        if (!strings.raw && !Array.isArray(strings)) {
            return helper(strings);
        }
        const result = [];
        strings.forEach((str, i) => {
            result.push(raw(str), i in values ? values[i] : "");
        });
        return result
            .map(el =>
            typeof el.__raw === "string"
                ? el.__raw
                : helper(el),
            )
            .join("");
    };
}
const css = templateGenerator(a => ""+a);
const html = templateGenerator(a => ""+a);

const ccnaamr = v => v === -1 ? "a" : v === 1 ? "b" : v === 2 ? "e" : v === -2 ? "f" : v === 0 ? "c" : "u";
const ccnme = (dx, dy) => "goX"+ccnaamr(dx)+"Y"+ccnaamr(dy);

if(window.styleElem) window.styleElem.remove();
window.styleElem = el("style").atxt(css`
/*#world-box {
    transform: rotate3d(10, 0, 0, 25deg);
}
.mid-screencontainer.scrollbar {
    perspective: 800px;
}*/
#world-box{
    overflow: hidden !important;
}
.worldtile.is-you {
    animation: none !important;
    transform: none !important;
}
` + [[-1, -1], [-1, 0], [-1, 1], [0, 1], [0, -1], [1, -1], [1, 0], [1, 1],
     [-2, -2], [-2, 0], [-2, 2], [0, 2], [0, -2], [2, -2], [2, 0], [2, 2]].map(([dx, dy]) => css`
    .run-animation.${ccnme(dx, dy)} .worldtile{
        transform: translate(${dx * 100}%, ${dy * 100}%);
        animation: ${ccnme(dx, dy)} 0.5s forwards;
    }
    @keyframes ${ccnme(dx, dy)} {
        0% {
            transform: translate(${dx * 100}%, ${(-dy) * 100}%);
        }
        100% {
            transform: translate(0, 0);
        }
    }
`).join("\n")).adto(document.head);


if(window.existingbuild) WORLD.build = window.existingbuild;
window.existingbuild = WORLD.build;
var oldPos = {x: YOU.x || 0, y: YOU.y || 0};
WORLD.build = () => {
    const newPos = {x: YOU.x, y: YOU.y};
    const diff = {x: newPos.x - oldPos.x, y: newPos.y - oldPos.y};
    oldPos = newPos;

	window.existingbuild.call(WORLD);
	let count = 0;
	for (let i = -1 * WORLD.gridRadius; i <= WORLD.gridRadius; i++) {
		for (let j = -1 * WORLD.gridRadius; j <= WORLD.gridRadius; j++) {
			const thisTile = WORLD.tilemap[count];
			thisTile.classList.remove("is-you");

			if (i === 0 && j === 0) {
				thisTile.classList.add("is-you");
			}

			count++;
		}
	}

    window.existingbuild.call(WORLD);

    WORLD.boxElem.className = "";
    void WORLD.boxElem.offsetWidth;
    WORLD.boxElem.classList.add("run-animation");
    WORLD.boxElem.classList.add(ccnme(diff.x, diff.y));
};


}


// SpiralFind Algorithm
// VVV All credit goes to guy below VVV
// https://stackoverflow.com/a/46852039 

let spiralFind = (x, y, step, count, target, target2=null, exempt=[]) => {
    let distance = 0;
    let range = 1;
    let direction = 'up';

    for ( let i = 0; i < count; i++ ) {
        // stuff Lightning made
        if (!doesArrayIncludeArray(exempt,[YOU.x+x,YOU.y+y])){
            if(document.getElementById((YOU.x+x)+'|'+(YOU.y+y)).textContent==target || document.getElementById((YOU.x+x)+'|'+(YOU.y+y)).textContent==target2){
                return {found:true, relX:x, relY:y};
            }
        }
        // stuff Lightning ripped off
        distance++;
        switch ( direction ) {
            case 'up':
                y += step;
                if ( distance >= range ) {
                    direction = 'right';
                    distance = 0;
                }
                break;
            case 'right':
                x += step;
                if ( distance >= range ) {
                    direction = 'bottom';
                    distance = 0;
                    range += 1;
                }
                break;
            case 'bottom':
                y -= step;
                if ( distance >= range ) {
                    direction = 'left';
                    distance = 0;
                }
                break;
            case 'left':
                x -= step;
                if ( distance >= range ) {
                    direction = 'up';
                    distance = 0;
                    range += 1;
                }
                break;
            default:
                break;
        }
    }
    return {found:false, relX:null, relY:null};
};

//AutoMine
var automine={
    startMine(){
        this.running=true;
        this.pos=1;
        this.automineDefaultDir=document.getElementById('automineDefaultDir').value;
        this.timer=setInterval(function(){automine.mine();}, 1000);
        this.autominedefaultDir=document.getElementById('automineDefaultDir').value
        this.running=true;
    },
    mine(){
        
        if(WORLD.deriveTile(YOU.x, YOU.y)==' ' ||WORLD.deriveTile(YOU.x, YOU.y)=='W'){
        SUPPLIES.open('small_boat');
        }
        else{
        SUPPLIES.open('metal_detector'); //Automatically equips metal detector; error if none in inventory
        }
        
        EQUIP.open();
        
        this.lastMessage=document.getElementById('enginelog-latestmessage');
        if (this.lastMessage.textContent.includes('the metal detector pings.')){
            ENGINE.log('mined');
            SOCKET.send({action: "equipment", option: "dig_with_shovel"});
            this.nextMove='take all';
        }
        else if(this.nextMove=='take all'){
            SOCKET.send({action: "loot_takeall"});
            SOCKET.send({action: "loot_next"});
            this.nextMove='move';
        }
        else if (this.pos>=1000){// Rebound
            SOCKET.send({action: "event_choice", option: "__leave__"}); //Fixes getting stuck on events
            this.automineDefaultDir=this.autominedefaultDir;
            this.pos--;
            setDir(this.autominedefaultDir);        }
        else if(this.pos<=0){
            SOCKET.send({action: "event_choice", option: "__leave__"});
            this.automineDefaultDir=this.autominedefaultDir;
            this.pos++;
            setDir(this.autominedefaultDir);
        }
        else{
            SOCKET.send({action: "event_choice", option: "__leave__"});
            setDir(this.automineDefaultDir);
            if(this.automineDefaultDir==this.autominedefaultDir){this.pos++;}
            else{this.pos--;}
            this.nextMove='dig';
        }
    },
    endMine(){
        clearInterval(this.timer);
        this.running=false;
    }
};
// travel
var travelBot={
    start(){
        if(this.xDes=undefined){
            this.xDest=YOU.x;
            this.yDest=YOU.y;
        }
        this.running=true;
        this.timer=setInterval(function(){travelBot.travel();}, 1000);
    },
    travel(){
            
        this.xDest=Number(this.xDest);
        this.yDest=Number(this.yDest);
        
        SOCKET.send({action: "event_choice", option: "__leave__"});

        if (document.getElementById('travelMower').checked===true){
            HANDS.gettree(document.getElementById('hands-tree'));
        }
        else{

        }
        
        if (document.getElementById('travelMiner').checked===true){
            if(WORLD.deriveTile(YOU.x, YOU.y)==' ' ||WORLD.deriveTile(YOU.x, YOU.y)=='W'){
        SUPPLIES.open('small_boat');
        }
            else{
            SUPPLIES.open('metal_detector'); //Automatically equips metal detector; error if none in inventory
            }

            EQUIP.open();

            this.lastMessage=document.getElementById('enginelog-latestmessage');
            if (this.lastMessage.textContent.includes('the metal detector pings.')){
                ENGINE.log('mined');
                SOCKET.send({action: "equipment", option: "dig_with_shovel"});
                this.nextMove='take all';
            }
            else if(this.nextMove=='take all'){
                SOCKET.send({action: "loot_takeall"});
                SOCKET.send({action: "loot_next"});
                this.nextMove='move';
        }
            
        }
        else{
            
        }
           
        if (this.yDest>YOU.y){// north south
            this.travelDir='n';
        }
        else if (this.yDest<YOU.y){
            this.travelDir='s';
        }
        else{
            this.travelDir='';
        }
        if (this.xDest>YOU.x){// east west
            this.travelDir=this.travelDir+'e';
        }
        else if (this.xDest<YOU.x){
            this.travelDir=this.travelDir+'w';
        }
        else{
            this.travelDir=this.travelDir+'';
        }
        if(this.travelDir==''){controller.toggle('travel');return;}
        if(EQUIP.current!='small boat'){// water no boat
            if (this.travelDir=='ne'){this.dest=[1,1];}
            else if (this.travelDir=='e'){this.dest=[1,0];}
            else if (this.travelDir=='se'){this.dest=[1,-1];}
            else if (this.travelDir=='s'){this.dest=[0,-1];}
            else if (this.travelDir=='sw'){this.dest=[-1,-1];}
            else if (this.travelDir=='w'){this.dest=[-1,0];}
            else if (this.travelDir=='nw'){this.dest=[-1,1];}
            else if (this.travelDir=='n'){this.dest=[0,1];}
            this.destTile=this.waterAt(this.dest[0], this.dest[1]);
            if (this.destTile=='w'){
                solutionFound=false;
                if (this.dest[0]>-1){
                    if (!this.waterAt(this.dest[0]-1, this.dest[1])){
                        this.travelDir=this.numToDir(this.dest[0]-1, this.dest[1]);
                        solutionFound=true;
                    }
                }
                else if (this.dest[0]<1){
                    if (!this.waterAt(this.dest[0]+1, this.dest[1])){
                        this.travelDir=this.numToDir(this.dest[0]+1, this.dest[1]);
                        solutionFound=true;
                    }
                }
                else if (this.dest[1]>-1){
                    if (!this.waterAt(this.dest[0], this.dest[1]-1)){
                        this.travelDir=this.numToDir(this.dest[0], this.dest[1]-1);
                        solutionFound=true;
                    }
                }
                else if (this.dest[1]<1){
                    if (!this.waterAt(this.dest[0], this.dest[1]+1)){
                        this.travelDir=this.numToDir(this.dest[0], this.dest[1]+1);
                        solutionFound=true;
                    }
                }
                if (solutionFound){}
                else{// try again
                if (this.dest[0]==1){
                    if (!this.waterAt(this.dest[0]-2, this.dest[1])){
                        this.travelDir=this.numToDir(this.dest[0]-2, this.dest[1]);
                        solutionFound=true;
                    }
                }
                else if (this.dest[0]==-1){
                    if (!this.waterAt(this.dest[0]+2, this.dest[1])){
                        this.travelDir=this.numToDir(this.dest[0]+2, this.dest[1]);
                        solutionFound=true;
                    }
                }
                else if (this.dest[1]==1){
                    if (!this.waterAt(this.dest[0], this.dest[1]-2)){
                        this.travelDir=this.numToDir(this.dest[0], this.dest[1]-2);
                        solutionFound=true;
                    }
                }
                else if (this.dest[1]==-1){
                    if (!this.waterAt(this.dest[0], this.dest[1]+2)){
                        this.travelDir=this.numToDir(this.dest[0], this.dest[1]+2);
                        solutionFound=true;
                    }
                }
                }
            }
        }
        DSTEP.click();
        setDir(this.travelDir);
    },
    stop(){
        this.running=false;
        clearInterval(this.timer);
    },
    changeDestinationX(x){
        this.xDest=x;
    },
    changeDestinationY(y){
        this.yDest=y;
    },
    waterAt(relX, relY){
        if (WORLD.deriveTile(YOU.x+relX, YOU.y+relY)=='w'){
            return 'w';
        }
        else{
            return '';
        }
    },
    numToDir(x, y){
        if (y==1){
            dest='n';
        }
        else if(y==-1){
            dest='s';
        }
        else{
            dest='';
        }
        if (x==1){
            dest=dest+'e';
        }
        else if(x==-1){
            dest=dest+'w';
        }
        else{
            dest=dest+'';
        }
        return dest;
    }
};
// tree farmer
var treeBot={
    start(){
        this.running=true;
        this.timer=setInterval(function(){treeBot.tree()}, 1000);
    },
    
    
    tree(){
        
        SOCKET.send({action: "event_choice", option: "__leave__"});
        
        if(this.nextMove==='collect'){
            HANDS.gettree(document.getElementById('hands-tree'));
            this.nextMove='back';
            spiralResults=spiralFind(0, 0, 1, 961, 't');
            if (spiralResults.found===true){
                this.nextMove='move';
                this.targetX=spiralResults.relX;
                this.targetY=spiralResults.relY;
                this.prevCoords={x:YOU.x, y:YOU.y};
            }
        }
        else if (this.nextMove==='move'){
            this.goto(this.targetX, this.targetY)
        }
        else if(this.nextMove==='back'){
            this.goto(this.targetX, this.targetY)
        }
        else{
            spiralResults=spiralFind(0, 0, 1, 961, 't');
            if (spiralResults.found===true){
                this.nextMove='move';
                this.targetX=spiralResults.relX;
                this.targetY=spiralResults.relY;
                this.prevCoords={x:YOU.x, y:YOU.y};
            }
            else{
                setDir('e');
            }
        }
    },
    
    stop(){
        clearInterval(this.timer);
        this.running=false;
        this.nextMove='travel'
    },
    goto(x, y){
        if (YOU.y+y>YOU.y){// north south
            travelDir='n';
            this.targetY=y-1;
        }
        else if (YOU.y+y<YOU.y){
            travelDir='s';
            this.targetY=y+1;
        }
        else{
            travelDir='';
        }
        if (YOU.x+x>YOU.x){// east west
            travelDir=travelDir+'e';
            this.targetX=x-1;
        }
        else if (YOU.x+x<YOU.x){
            travelDir=travelDir+'w';
            this.targetX=x+1;
        }
        else{
            travelDir=travelDir+'';
        }
        if(travelDir===''){
            if (this.nextMove=='move'){
                this.nextMove='collect';
            }
            else if (this.nextMove=='back'){
                this.nextMove='travel';
            }
            return'there';
        }
        else{
            setDir(travelDir);
            return'notThere';
        }
    }
};
// Auto city and house
var autoLoot={
    getUMF:false,
    exemptList:[],
    beenThroughHazDoor:false,
    doneTreasuryDesk:false,
    doneTreasuryWoodCloset:false,
    beenInSkyscraper:false,
    beenInTent:false,
    lootedBody:false,
    readyToLeave:false,
    gottenUMF:false,
    beenEastLoot:false,
    defaultDir:'e',
    start(){
        this.running=true;
        this.defaultDir=document.getElementById('defaultDir').value
        this.timer=setInterval(function(){autoLoot.raid()}, 1200);// I am doing 1.2 seconds because some cycles take longer and getting stuck in events is annoying. It will be slightly slower but less prone to getting stuck
    },
    raid(){
        if(this.nextMove=='steal'){
            if (POPUP.isOpen==true||LOOT.mainEl.style.display==''){// stops if there is a little lag
                if(POPUP.evTitle.innerHTML=='a desolate city'){// cities
                    this.placeType='desolate'
                }
                else if(POPUP.evTitle.innerHTML=='a walled city'){
                    this.placeType='walled'
                }
                else if(POPUP.evTitle.innerHTML=='a withered city'){
                    this.placeType='withered'
                }
                else if(POPUP.evTitle.innerHTML=='a governing city'){
                    this.placeType='governing'
                }
                else if(POPUP.evTitle.innerHTML=='a blasted city'){
                    this.placeType='blasted'
                }
                else if(POPUP.evTitle.innerHTML=='a barn'){// houses
                    this.placeType='barn'
                }
                else if(POPUP.evTitle.innerHTML=='a cabin'){
                    this.placeType='cabin'
                }
                else if(POPUP.evTitle.innerHTML=='a garage'){
                    this.placeType='garage'
                }
                else if(POPUP.evTitle.innerHTML=='a childcare center'){
                    this.placeType='childcare'
                }
                else if(POPUP.evTitle.innerHTML=='a church'){
                    this.placeType='church'
                }
                else if(POPUP.evTitle.innerHTML=='a humble residence'){
                    this.placeType='humble'
                }
                else if(POPUP.evTitle.innerHTML=='a low home'){
                    this.placeType='low'
                }
                else if(POPUP.evTitle.innerHTML=='an old home'){
                    this.placeType='old'
                }
                else if(POPUP.evTitle.innerHTML=='a pet store'){
                    this.placeType='pet'
                }
                else if(POPUP.evTitle.innerHTML=='a ruined house'){
                    this.placeType='ruined'
                }
                else if(POPUP.evTitle.innerHTML=='a run-down shack'){
                    this.placeType='run-down'
                }
                else if(POPUP.evTitle.innerHTML=='a weathered house'){
                    this.placeType='weathered'
                }
                this.collect();
            }
            if(POPUP.isOpen==false&&LOOT.mainEl.style.display=='none'){this.leaveEvent()}
            if(POPUP.isOpen==false&&LOOT.mainEl.style.display=='none'&&this.left==true){
                this.left=false;
                this.nextMove='back';
            }
        }
        else if(this.nextMove==='collect'){
            if(this.goto(this.targetX,this.targetY)=='there'){
                this.nextMove='steal';
                this.exemptList.push([this.targetX+YOU.x,this.targetY+YOU.y]);
                this.targetX=this.prevCoords.x-YOU.x;
                this.targetY=this.prevCoords.y-YOU.y;
            }
        }
        else if (this.nextMove=='move'){
            this.goto(this.targetX, this.targetY)
        }
        else if(this.nextMove=='back'){
            this.goto(this.targetX, this.targetY)
        }
        else{
            spiralResults=spiralFind(0, 0, 1, 961, 'C', target2='H', exempt=this.exemptList);
            if (spiralResults.found===true){
                this.nextMove='move';
                this.targetX=spiralResults.relX;
                this.targetY=spiralResults.relY;
                this.prevCoords={x:YOU.x, y:YOU.y};
            }
            else{
                setDir(this.defaultDir);
                DSTEP.click();
                SOCKET.send({
                    action:'event_choice',
                    option:'__leave__'
                })
            }
        }
    },
    stop(){
        clearInterval(this.timer);
        this.running=false;
        this.nextMove='travel'
    },
    goto(x, y){
        if (YOU.y+y>YOU.y){// north south
            travelDir='n';
            this.targetY=y-1;
        }
        else if (YOU.y+y<YOU.y){
            travelDir='s';
            this.targetY=y+1;
        }
        else{
            travelDir='';
        }
        if (YOU.x+x>YOU.x){// east west
            travelDir=travelDir+'e';
            this.targetX=x-1;
        }
        else if (YOU.x+x<YOU.x){
            travelDir=travelDir+'w';
            this.targetX=x+1;
        }
        else{
            travelDir=travelDir+'';
        }
        if(travelDir===''){
            if (this.nextMove=='move'){
                this.nextMove='collect';
            }
            else if (this.nextMove=='back'){
                this.nextMove='travel';
            }
            return'there';
        }
        else{
            this.leaveEvent();
            setDir(travelDir);
            return'notThere';
        }
    },
    collect(){
        if(WORLD.deriveTile(YOU.x, YOU.y)=='C'){// city paths
            switch(this.placeType){
                case 'desolate':
                    this.handelEvent('a desolate city', 'the highway');
                    if(this.beenInTent==false){
                        this.handelEvent('the midst of the towers', 'the tent')
                    }
                    if(this.lootAll('a camping tent')){this.beenInTent=true;}
                    if(this.beenInTent==true&&this.beenInSkyscraper==false&&this.handelEvent('the midst of the towers', 'the skyscraper')){
                        this.beenInSkyscraper=true;
                        break;
                    }
                    this.handelEvent("the tower's bones", 'the corner');
                    if(this.lootedBody==false&&this.handelEvent('the ruined office', 'the body')){
                        this.lootedBody=true;
                    }
                    this.lootAll('a dead man');
                    if(this.lootedBody==true){
                        this.handelEvent('the ruined office', 'go back');
                    }
                    if(this.beenInTent==true&&this.beenInSkyscraper==true&&this.lootedBody==true){
                        this.handelEvent('the midst of the towers', 'the subway');
                    }
                    this.handelEvent('the subway', 'the railway');
                    this.handelEvent('the tunnel', 'keep walking');
                    this.handelEvent('another platform', 'check the bodies');
                    this.lootAll('homeless bodies');
                    this.handelEvent('the buried platform', 'the tunnel')
                    this.leaveEvent(name='the continuing dark tunnel');
                    break;
                case 'walled':
                    this.leaveEvent();// a walled city just isnt worth it
                    /*this.handelEvent('a walled city', 'the eastern side')
                    this.handelEvent('the collapsed eastern wall', 'swim to the refinery')
                    this.handelEvent('ashen waters', 'circle the perimeter')
                    if(!this.beenThroughHazDoor){
                        this.handelEvent('the perimeter', 'the main entrance')
                        this.handelEvent('the main area', 'the hazard door')
                    }
                    if(this.handelEvent('the hazard door', 'the control panel')){this.beenThroughHazDoor=true;}
                    this.handelEvent('the control panel', 'the gap in the wall')
                    this.handelEvent('the gap', 'check wood box')
                    this.lootAll('a rotten wood box')
                    this.handelEvent('the dark room','activate button')
                    this.handelEvent('a flood of water','escape up the stairs')
                    this.handelEvent('a flood of water','back up stairs')
                    if(this.beenThroughHazDoor){
                        this.handelEvent('a flood of water','back up stairs')
                        this.handelEvent('the main area','back out toward the city')
                        if(this.leaveEvent()){this.beenThroughHazDoor=false;}
                    }*/
                    break;
                case 'withered':
                    this.handelEvent('a withered city', 'the tunnel');
                    this.handelEvent('the tunnel', 'enter sewage system');
                    this.handelEvent('dark tunnels', 'go east');
                    this.handelEvent('the east path', 'continue');
                    if(this.getUMF==true&&this.gottenUMF==false){
                        this.handelEvent('a frigid intersection', 'north');
                    }
                    if(this.gottenUMF==true||this.getUMF==false){
                        this.handelEvent('a frigid intersection', 'south');
                    }
                    if(this.lootAll('a strange cube')){
                        this.gottenUMF=true;
                    }
                    this.lootAll('an abandoned backpack');
                    if(this.beenEastLoot==false&&this.handelEvent('discolored liquid', 'east')){
                        this.beenEastLoot=true;
                    }
                    this.handelEvent('discolored liquid', 'south');
                    this.handelEvent('dim daylight', 'west');
                    if(this.leaveEvent(name='outside')){
                        this.gottenUMF=false;
                        this.beenEastLoot=false;
                    }
                    break;
                case 'governing':
                    this.handelEvent('a governing city', 'the tunnel')
                    this.handelEvent('strong stone', 'continue')
                    this.handelEvent('a concrete path', 'continue')
                    this.handelEvent('the winding path', 'continue')
                    this.handelEvent('the treasury', 'enter')
                    if(!this.doneTreasuryDesk){
                        this.handelEvent("the treasury's lobby", 'the desk')
                        if(this.lootAll('the desk')){this.doneTreasuryDesk=true;}
                    }
                    if(!this.doneTreasuryWoodCloset&&this.doneTreasuryDesk){
                        if(this.handelEvent("the treasury's lobby", 'the wooden closet')){this.doneTreasuryWoodCloset=true;}
                    }
                    this.lootAll('the wooden closet')
                    if(this.doneTreasuryDesk&&this.doneTreasuryWoodCloset){
                        this.handelEvent("the treasury's lobby", 'back outside')
                        if(this.leaveEvent()){this.doneTreasuryDesk=false;this.doneTreasuryWoodCloset=false;}
                    }
                    break;
                case 'blasted':
                    this.handelEvent('a blasted city', 'the road')
                    this.handelEvent('black and red', 'the tower')
                    if(!this.doneElevator){
                        this.handelEvent('the tower lobby', 'the elevator')
                        if(this.lootAll('the elevator shaft')){this.doneElevator=true;}
                    }
                    if(!this.doneOffice){
                        this.handelEvent('the tower lobby', 'the exit sign')
                        this.handelEvent('the exit sign', 'the fire escape')
                        this.handelEvent('the fire escape', 'the eighth floor')
                        this.handelEvent('the eighth floor', 'the office')
                        this.handelEvent('the office', 'loot area')
                        this.lootAll('the blasted office')
                        this.handelEvent('the office', 'return to tower base')
                        if(this.handelEvent('descent', 're-enter tower')){this.doneOffice=true;}
                    }
                    if(this.doneOffice, this.doneElevator, POPUP.evTitle.innerHTML=='the tower lobby'){
                        this.doneElevator=false;
                        this.doneOffice=false;
                        this.leaveEvent();
                    }
                    break;
            }
        }
        else if(WORLD.deriveTile(YOU.x, YOU.y)=='H'){// house paths
            switch(this.placeType){
                case 'barn':
                    this.leaveEvent();
                    break;
                case 'cabin':
                    this.handelEvent('a cabin', 'check the back');
                    this.handelEvent('the backyard', 'a plastic container');
                    this.lootAll('a plastic container')  
                    break;
                case 'childcare':
                    this.leaveEvent();
                    break;
                case 'church':
                    this.handelEvent('a church', 'investigate')
                    this.handelEvent('rows of pews', 'the book')
                    this.handelEvent('a withered book', 'the back halls')
                    this.handelEvent('the back halls', 'the control room')
                    this.lootAll('the control room')
                    break;
                case 'garage':
                    this.leaveEvent();
                    break;
                case 'humble':
                    this.leaveEvent();
                    break;
                case 'low':
                    this.leaveEvent();
                    break;
                case 'old':
                    this.handelEvent('an old home', 'enter')
                    this.handelEvent('the living room', 'the back room')
                    this.handelEvent('the back room', 'the closet')
                    this.handelEvent('the closet', 'search')
                    this.lootAll('a cardboard box')
                    break;
                case 'pet':
                    this.handelEvent('a pet store', 'enter');
                    this.handelEvent('inside', 'the aisles');
                    this.handelEvent('the aisles', 'the adoption center');
                    this.handelEvent('the adoption center', 'the stocking room');
                    this.handelEvent('the stocking room', 'look around');
                    this.lootAll('the shelves');
                    break;
                case 'ruined':
                    this.handelEvent('a ruined house', 'the kitchen')
                    this.handelEvent('the kitchen', 'an old note')
                    this.handelEvent('an old note', 'the top floor')
                    this.handelEvent('the top floor', 'search')
                    this.lootAll('an old trash bag')
                    break;
                case 'run-down':
                    this.handelEvent('a run-down shack', 'check shack')
                    this.lootAll('inside the shack')
                    break;
                case 'weathered':
                    this.handelEvent('a weathered house','enter')
                    this.handelEvent('the entrance hall','the kitchen')
                    this.handelEvent('the kitchen', 'the backyard')
                    this.lootAll('the backyard')
                    break;
            }
        }
    },
    leaveEvent(name=undefined){//I added in name this way so I wouldn't have to rewrite code that worked
        if(!name==undefined&&!POPUP.evTitle.innerHTML==name){
            return;
        }
        classList=document.getElementsByClassName('popup-button')
        for(i=0;i<classList.length;i++){
            if(classList[i].value=='exit event'){
                classList[i].click();
                return true;
            }
        }
        this.left=true;
    },
    lootAll(name){
        if(name==LOOT.titleEl.innerHTML){
            SOCKET.send({action: "loot_takeall"});
            SOCKET.send({action: "loot_next"});
            return true;
        }
    },
    handelEvent(name,solution){
        if(POPUP.evTitle.innerHTML==name){
            classList=document.getElementsByClassName('popup-button')
            otherList=document.getElementsByClassName('popup-reqbutton');
            for(i=0;i<classList.length;i++){
                if(classList[i].value==solution){
                    //console.log(solution) //quite useful for debugging
                    classList[i].click();
                    return true;
                }
                if(otherList.length>0&&otherList[i].toString.includes(solution)){
                    otherList[i].click();
                    return true;
                }
            }

        }
    },
    changeUMF(){
        if (document.getElementById('UMF').checked===true){
            this.getUMF=true;
        }
        else{
            this.getUMF=false
        }
    },
    checkItem(item){
        if (SUPPLIES.current.hasOwnProperty(item)){
            return true;
        }
        else{
            return false;
        }
    }
}
//auto Reconnect
var autoReconnect={
    running:false,
    toggle(){
        if (this.running==false){
            this.running=true;
            this.timer=setInterval(function(){autoReconnect.run()}, 1000*10);
        }
        else{this.stop()}
        controller.toggelColor('reconnect')
    },
    run(){
        if (SOCKET.isOpen==false||POPUP.evTitle.innerHTML=="disconected"){//changed detection as it is unlikely to socket will close and more likely you will be cut
            SOCKET.open();
            setTimeout(()=>{//has to wait a little bit to connect to server
            POPUP.hide();
            SOCKET.send({
                "action": "setDir",
                "dir": YOU.dir,
                "autowalk": YOU.autowalk
            });}, 1000)
        }
    },
    stop(){
        this.running=false;
        clearInterval(this.timer);
    }
}


// controller
var controller={
    runningList:[],
    // starts
    start(job){
        if (this.runningList.length>0){// stops multiple task from running and conflicting
            for (i=0; i<this.runningList.length; i++){
                this.toggle(this.runningList[i]);
            }
        }

        if(job=='dig'){
            automine.startMine();
        }
        else if(job=='travel'){
            travelBot.start();
        }
        else if(job=='treeBot'){
            treeBot.start();
        }
        else if(job=='autoLoot'){
            autoLoot.start();
        }
        this.runningList.push(job);
    },
    // stops
    stop(job){

        if(job=='dig'){
            automine.endMine();
        }
        else if(job=='travel'){
            travelBot.stop();
        }
        else if(job=='treeBot'){
            treeBot.stop();
        }
        else if(job=='autoLoot'){
            autoLoot.stop();
        }
        this.runningList.splice(this.runningList.indexOf(job), 1);// clears list
    },
    //toggle to have one function
    toggle(job){

        if(job=='dig'){// mine
            if (automine.running==true){
                this.stop('dig');
            }
            else{
                this.start('dig');
            }
        }
        else if(job=='travel'){// travel
            if (travelBot.running==true){
                this.stop('travel');
            }
            else{
                this.start('travel');
            }
        }
        else if(job=='treeBot'){// tree
            if (treeBot.running==true){
                this.stop('treeBot');
            }
            else{
                this.start('treeBot');
            }
        }
        else if(job=='autoLoot'){// city and house
            if (autoLoot.running==true){
                this.stop('autoLoot');
            }
            else{
                this.start('autoLoot');
            }
        }
        else{
            window.alert('Error: Job not found');
        }
        this.toggelColor(job);
    },
    toggelColor(id){
        if (document.getElementById(id).classList.contains('toolUnClicked')){
            document.getElementById(id).classList.remove('toolUnClicked');
            document.getElementById(id).classList.add('toolClicked');
            if (id=='travel'){//  because travel has i=child classes those have to be accessed seprately
                document.getElementById('travel').children[0].classList.remove('toolUnClicked');
                document.getElementById('travel').children[0].classList.add('toolClicked');
            }
        }
        else if (document.getElementById(id).classList.contains('toolClicked')){
            document.getElementById(id).classList.add('toolUnClicked');
            document.getElementById(id).classList.remove('toolClicked');
            if (id=='travel'){
                document.getElementById('travel').children[0].classList.add('toolUnClicked');
                document.getElementById('travel').children[0].classList.remove('toolClicked');
            }
        }
    }
};
// color
var color={
    getColor(){
        if (SETTINGS.darkmode=='true'){
            this.textColor='rgb(255, 255, 255)';//white
            this.background='rgb(40, 40, 40)';//gray
            this.clickedTextColor ='rgb(215, 215, 215)';
            this.clickedBackground='rgb(83, 83, 83)';
        }
        else{
            this.textColor='rgb(0, 0, 0)';//black
            this.background='rgb(255, 255, 255)';//white
            this.clickedTextColor ='rgb(0, 0, 0)';
            this.clickedBackground='rgb(215, 215, 215)';
        }
    }
};

//POPUPS




function popupInfo(){
    POPUP.new('Info',"MAIN BASE: -3000 -5838", undefined);
};
function doesArrayIncludeArray(array1,array2){//js doesnt compare arrays well
    for(i=0;i<array1.length;i++){
        if(array1[i].join('')==array2.join('')){
            return true;
        }
    }
    
    return false;
};               
           

document.getElementById('event-desc').style.maxHeight=1000
document.getElementById('event-desc').style.maxWidth=1500

function popupExplorer(){
    
    
    POPUP.new('Map Explorer','<iframe src="https://pfg.pw/mapexplorer" style="border:15px #6495ED dashed;" name="explorer" scrolling="no" frameborder="1" marginheight="400px" marginwidth="640px" height="400px" width="600px" allowfullscreen></iframe>',undefined);
};

function popupLeaderboard(){
        
        POPUP.new('Leaderboard','<iframe src="https://pfg.pw/travelersleaderboard/player" style="border:15px #6495ED dashed;" name="leaderboard" scrolling="no" frameborder="1" marginheight="400px" marginwidth="600px" height="400px" width="600px" allowfullscreen></iframe>',undefined);                 
};              
                
// new change dir to work with buttons
function setDir(dir){
    ENGINE.dir(dir, document.getElementById('arrow-'+dir))
};
function init(){
    color.getColor();
    var insertedHTML=document.createElement("div");
    insertedHTML.innerHTML=
    //this is the html added to the bottom of the webpage
   `<div id="Utility Hot Bar" style="margin:auto;width:636px;">
        <style>
        .tool{
            margin:2px 2px;
            border-width:1px;
            border-style:solid;
            width:200px;
            height:100px;
            cursor:pointer;
            float:left;
        }   
        .toolUnClicked{
            color:`+color.textColor+`;
            border-color:`+color.textColor+`;
            background-color:#6495ED;
        }
        .toolClicked{
            color:`+color.clickedTextColor+`;
            border-color:`+color.clickedTextColor+`;
            background-color:#054d95 ;
        }
        .label{
            color
        }
        iframe{
            border-color:#6495ED;
        }

}

        </style>
        
        <div class="tool toolUnClicked" id="dig">
        
            <span onclick=controller.toggle('dig')><br>AutoMine<br></span>
            
            <label for="Automine Dir">Direction: </label>
            <select name="defaultDir" id="automineDefaultDir" style="background:inherit;">
                    <option value="n">North</option>
                    <option value="e">East</option>
                    <option value="s">South</option>
                    <option value="w">West</option>
                </select>
        </div>
        
                
        <div class="tool toolUnClicked" id="travel">
            <span onclick=controller.toggle("travel")><br>Travel<br></span>
            <input type="number" id="x" placeholder="X" onchange="travelBot.changeDestinationX(this.value)" style="width:88px;">
            <input type="number" id="y" placeholder="Y" onchange="travelBot.changeDestinationY(this.value)" style="width:88px;">

            <label for='Mower'>Woodcutter</label>
            <input type="checkbox" id='travelMower' onchange="travelBot.travelMower()" style="margin-bottom:0px;">
            <label for='Miner'><br>Miner</label>
            <input type="checkbox" id='travelMiner' onchange="travelBot.travelMiner()" style="margin-bottom:0px;">
        </div>
        
        <div class="tool toolUnClicked" id="treeBot" onclick=controller.toggle('treeBot')><br><br>Woodcutter</div>
            
        <div class="tool toolUnClicked" id="autoLoot">
        
            <span onclick=controller.toggle('autoLoot')><br>AutoLoot<br></span>
            <label for='UMF'>Get UMF</label>
            <input type="checkbox" id='UMF' onchange="autoLoot.changeUMF()" style="margin-bottom:0px;">
            
            <label for="defaultDir"><br>Direction: </label>
            <select name="Travel Direction" id="defaultDir" style="background:inherit;">
                <option value="n">North</option>
                <option value="e">East</option>
                <option value="s">South</option>
                <option value="w">West</option>
            </select>
        </div>
        
        <div class="tool toolUnClicked" onclick=autoReconnect.toggle() id="reconnect"><br><br>Reconnect</div>
        
        <div class="tool toolUnClicked" onclick=popupInfo() id="info"><br><br>Info</div>

        <div class="tool toolUnClicked" onclick=popupLeaderboard() id="leaderboard"><br><br>Leaderboard</div>

        <div class="tool toolUnClicked" onclick=popupExplorer() id="explorer"><br><br>Explorer</div>

    </div>`;
    
    
    var target=document.getElementById('game-content').getElementsByClassName('mid-screencontainer scrollbar')[0];
    target.appendChild(insertedHTML);
    EQUIP.menuEl.style.width="420px";
    BUILD.boxEl.style.width="420px";
}
init();

