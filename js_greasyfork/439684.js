// ==UserScript==
// @name         mod
// @namespace    http://tampermonkey.net/
// @version      1.21
// @description  Locks aim to the nearest player in shellshock.io. Comes with an ESP too. Press B, V, N to toggle aimbot, esp, esp lines.
// @author       shell shock modder
// @match        *://*.shellshock.io/*
// @icon         https://www.google.com/s2/favicons?domain=shellshock.io
// @grant        none
// @run-at       document-start
// @antifeature  ads
// @downloadURL https://update.greasyfork.org/scripts/439684/mod.user.js
// @updateURL https://update.greasyfork.org/scripts/439684/mod.meta.js
// ==/UserScript==



//you should allow user to change team colors
window.XMLHttpRequest = class extends window.XMLHttpRequest {

	open( method, url ) {

		if ( url.indexOf( 'shellshock.js' ) > - 1 ) {

			this.run = true;

		}

		return super.open( ...arguments );

	}

	get response() {

		if ( this.run ) {
//console.log("KJHDFSLKJDSLKJHDFKJHDSFLKJBDNFSLKFDSKHFDSKHFSKHBFDSKJHBDSKBFKHBFDSKHBFDSKHBKHFSKHBFDSKHBFDS")
            if(document.getElementById('progress-outer')){
             document.getElementById('progress-outer').style.background='rgb(255,0,0)'
            }
setTimeout(function(){if(document.getElementById('progress-outer')){document.getElementById('progress-outer').style.background='rgb(255,0,0)'}},500)
localStorage.removeItem('lastVersionPlayed');
  
var code = super.response;

           //console.log(super.response);
           

			let b,
				p,
				m,
                aimAssistClassName,
                rays,
                rayFunc,
                updateFunc,
                fireFunc,
				sceneVarName,
				cullFuncName;

			try {
                var variableLocations=['.prototype._loadVertexShader','[this.spatula.controlledBy]','.weapon.subClass.weaponName','.detectControllerType','.forwardRay.origin','.rayCollidesWithMap','.sortPlayerList','.prototype.collectAmmo']
                var variableNames=[]
                for(let i=0;i<variableLocations.length;i++){
                    var varLength=/\w/.test(code.charAt(code.indexOf(variableLocations[i])-2))?2:1
                    variableNames.push(code.substring(code.indexOf(variableLocations[i])-varLength,code.indexOf(variableLocations[i])))
                }
                for(let i=0;i<variableNames.length;i++){
                 console.log(variableNames[i]);
                }

				b = variableNames[0]
				p =variableNames[1]
                m = variableNames[2]
                aimAssistClassName=variableNames[3]
                rays=variableNames[4];
                rayFunc=variableNames[5]
                updateFunc=variableNames[6]
                fireFunc=variableNames[7]
				sceneVarName = /createMapCells\(([^,]+),/.exec( code )[ 1 ];
				cullFuncName = /=([a-zA-Z_$]+)\(this\.mesh,\.[0-9]+\)/.exec( code )[ 1 ];

			} catch ( error ) {

				alert( 'Script failed to inject. Report the issue to the script developer.\n' + JSON.stringify( getVars(), undefined, 2 ) );

				return code;

			}

			function getVars() {

				return {
					b,
					p,
					m,
                    rays,
                    rayFunc,
                    aimAssistClassName,
					sceneVarName,
					cullFuncName
				};

			}

			console.log( '%cInjecting code...', 'color: red; background: black; font-size: 2em;', getVars() );

const [adLine, adVar1, adVar2] = /function (.{2})\(e.{2}\){.\?.+?(?=}f)}function (.{2})/.exec(code);
    const [timer, timerVar, timerVar2, timerVar3] = /function (.{2})\(e\){(.{2})=M.+?(?=1,)1,(.{17}).+?(?=var)/.exec(code);
    window.localStorage.setItem("lastPreRoll", Date.now());
    window.localStorage.setItem("showBigAd", Date.now()+432e5);
    if(!adLine || !adVar1 || !adVar2) {
        console.log('error doing anti adblock')
    } else {
        console.log("[INJECTING] - Adblock popup block");
        const replaceAd = `function ${adVar1}(e){console.log("[ADBLOCK]-blocked"),${adVar2}()}function ${adVar2}`
        code = code.replace(adLine, replaceAd);
    }
    if(!timer || !timerVar || !timerVar2 || !timerVar3) {
        console.log('error doing timer block');
    }
    else {
        console.log("[INJECTING] - Timer block");
        code = code.replace(timer, `function ${timerVar}(e){localStore.setItem("showBigAd",Date.now()+432e5),localStore.setItem("lastPreRoll",Date.now()),setTimeout(()=>{${timerVar2}=-1,${timerVar3}},3000)}`);
    }


            localStorage.removeItem('lastVersionPlayed');
          

            code = code.replace(/t\[i\]\.setVisible\(\w\)\}/, `
               {
                if(window.espEnabled&&t[i].randomvariable===undefined&&i!=0&&i!=1){
	            t[i].renderingGroupId=2;
	            }
                else{
                t[i].renderingGroupId=0;
                }
                t[i].setVisible(${b});
                }}`);
              // code = code.replace('this.renderingGroupId=0','this.renderingGroupId=1');
           // code=code.replace('this._debugMesh.renderingGroupId=this.renderingGroupId','this._debugMesh.renderingGroupId=1')
          //  code=code.replace('i.renderingGroupId=t.renderingGroupId','i.renderingGroupId=1')
          //  code=code.replace('t.renderingGroupId=i.renderingGroupId','t.renderingGroupId=1');
           // code=code.replace('var r=t.renderingGroupId','var r=1');
//code=code.replace('var t=e.renderingGroupId||0','var t=1');
window.sceneCheckVar=0
code=code.replace('var s=this._scene.spriteManagers[o];','var s=this._scene.spriteManagers[o];if(window.espEnabled&&(o==0||o==1||o==3||o==6||o==7)){s.renderingGroupId=1;}else{s.renderingGroupId=0;}if(window.hadskfb===undefined){window.mySceneManagers=this._scene.spriteManagers;window.hadskfb=true}');
            /*
0 is names
1 is 5 kill sparkle
2 is smoke
3 is explosions
4 is egg shatter on death
5 is egg yoke on death
6 is egg whites on death
7 is egg splatter on damage
*/
            var circle = document.createElement('div');
   // circle.className = 'circle';

    // Position the circle in the middle of the screen
    circle.style.width = '5px'; // Adjust the size of the circle as needed
    circle.style.height = '5px';
    circle.style.borderRadius = '50%';
    circle.style.backgroundColor = 'red';
    circle.style.position = 'absolute';
    circle.style.top = '50%';
    circle.style.left = '50%';
    circle.style.transform = 'translate(-50%, -50%)';

    // Append the circle to the body element
    document.body.appendChild(circle);
/*
            const variableDiv = document.createElement('div');

// Set the styles for the div element
variableDiv.style.position = 'fixed';
variableDiv.style.top = '50%';
variableDiv.style.left = '50%';
variableDiv.style.transform = 'translate(-50%, -50%)';
variableDiv.style.fontSize = '48px';

// Append the div element to the body
document.body.appendChild(variableDiv);

// Function to update the variable value
function updateVariable() {
  // Replace this with your own variable or logic to get the updated value
  const newValue = Math.random();
//window.matRotation.x+'<br>'+window.matRotation.y+'<br>'+window.matRotation.z+'<br>';
  // Update the content of the div element with the new value
  variableDiv.textContent = newValue;

  // Call the function recursively to update the value constantly
  requestAnimationFrame(updateVariable);
}

// Start updating the variable initially
updateVariable();
*/

            code=code.replace(/\w\w\.show\(\),this.gunContainer/,'this.gunContainer')
//window.espEnabled?1:0
            code = code.replace('clearInterval(this.assistInterval),','');
            code=code.replace(/calculateAssist\(\)\{[^:]+:1}/,`
            calculateAssist()
    {
          if (!${m} || !${m}.playing) return 1;
	var saved1 = ${aimAssistClassName}.v1,
		saved2 = ${aimAssistClassName}.v2,
		mePosition = ${rays}.forwardRay.origin,
	//	rayDirection2 = ${rays}.forwardRay.direction,
        rayDirection = ${rays}.forwardRay.direction,
		savedPlayer = null,
		savedAngle = null,
		savedDistance = 1e7;
	for (var player of ${p})
		if (player && player.id != u&&player.playing && player.actor && player.actor.mesh.isVisible && (0 == player.team || player.team != ${m}.team)){
        player.isBeingLookedAt=false
        player.lines.alpha=.2;
        player.isVisible=false
        if(window.${rayFunc}===undefined){
        window.${rayFunc}=${rayFunc}
        }
        if(window.a===undefined){
        window.a=a
        }

            var distance=${b}.Vector3.Distance(player.actor.mesh.position, mePosition);
			saved1.copyFrom(player.actor.mesh.position), saved1.y += .3, saved1.subtractToRef(mePosition, saved2), saved2.normalize(), rayDirection.normalize();
			var lookAngleCheck = (1 - ${b}.Vector3.Dot(saved2, rayDirection)) *distance *.5;
distance<a.forwardRay.range+1&&lookAngleCheck<=.05&&distance<savedDistance&&(savedPlayer=player,savedDistance=distance,savedAngle=lookAngleCheck)
var savedRayX=rayDirection.x
var savedRayY=rayDirection.y
var savedRayZ=rayDirection.z
            rayDirection.x=player.actor.mesh.position.x-${m}.actor.mesh.position.x; rayDirection.y=player.actor.mesh.position.y-${m}.actor.mesh.position.y; rayDirection.z=player.actor.mesh.position.z-${m}.actor.mesh.position.z;
            rayDirection.normalize();
            rayDirection.scaleInPlace(1e3);
            var collideDistance=${rayFunc}.rayCollidesWithMap(mePosition, rayDirection, window.${rayFunc}.projectileCollidesWithCell);
            (!collideDistance||distance<${b}.Vector3.Distance(mePosition,collideDistance.pick.pickedPoint)+0.99) && (player.lines.alpha=1,player.isVisible=true,savedDistance=distance,savedAngle=lookAngleCheck);
            rayDirection.x=savedRayX;rayDirection.y=savedRayY;rayDirection.z=savedRayZ
            } if(savedPlayer){savedPlayer.isBeingLookedAt=true;if(window.targetPlayer===undefined){window.targetPlayer=savedPlayer}}  return savedPlayer?Math.max(20 *savedAngle, .2) : 1
}
`)
//if(savedPlayer){savedPlayer.isBeingLookedAt=true;}
 //if(window.targetPlayer===undefined){window.targetPlayer=savedPlayer}} else{window.targetPlayer=undefined}
// if(window.targetPlayer===undefined && window.targeting){window.targetPlayer=savedPlayer}

            /*
                    code=code.replace(/calculateAssist\(\)\{[^:]+:1}/,`
            calculateAssist()
    {
          if (!${m} || !${m}.playing) return 1;
	var saved1 = ${aimAssistClassName}.v1,
		saved2 = ${aimAssistClassName}.v2,
		mePosition = ${rays}.forwardRay.origin,
		rayDirection = ${rays}.forwardRay.direction,
  //      rayDirection2 = ${rays}.forwardRay.direction,
		savedPlayer = null,
		savedAngle = null,
		savedDistance = 1e7;
	for (var player of ${p})
		if (player && player.id != u&&player.playing && player.actor && player.actor.mesh.isVisible && (0 == player.team || player.team != ${m}.team)){
       // player.isBeingLookedAt=false
        player.lines.alpha=0.2;
        if(window.${rayFunc}===undefined){
        window.${rayFunc}=${rayFunc}
        }
        if(window.a===undefined){
        window.a=a
        }

            var distance=${b}.Vector3.Distance(player.actor.mesh.position, mePosition);
			saved1.copyFrom(player.actor.mesh.position), saved1.y += .3, saved1.subtractToRef(mePosition, saved2), saved2.normalize(), rayDirection.normalize();
			var lookAngleCheck = (1 - ${b}.Vector3.Dot(saved2, rayDirection)) *distance *.5;
distance<a.forwardRay.range+1&&lookAngleCheck<=.05&&distance<savedDistance&&(savedPlayer=player)
			rayDirection.x=player.actor.mesh.position.x-${m}.actor.mesh.position.x; rayDirection.y=player.actor.mesh.position.y-${m}.actor.mesh.position.y; rayDirection.z=player.actor.mesh.position.z-${m}.actor.mesh.position.z;
            rayDirection.normalize();
            rayDirection.scaleInPlace(1e3);
            var collideDistance=${rayFunc}.rayCollidesWithMap(mePosition, rayDirection, window.${rayFunc}.projectileCollidesWithCell);
            (!collideDistance||distance<${b}.Vector3.Distance(mePosition,collideDistance.pick.pickedPoint)+0.99) && (player.lines.alpha=1,savedDistance=distance,savedAngle=lookAngleCheck);
            		} if(savedPlayer){savedPlayer.isBeingLookedAt=true;} return savedPlayer?Math.max(20 *savedAngle, .2) : 1
}
`)
            */
          //  code=code.replace('.prototype.getFloat=function(e,t){return e=e||0,t=t||1,this.seed=(9301*this.seed+49297)%233280,e+this.seed/233280*(t-e)',
             //                 '.prototype.getFloat=function(e,t){return e=e||0,t=t||1,window.logFloat?console.log("randomGen:"+window.m.randomGen.seed+" e:"+e+" t:"+t):void[0],this.seed=(9301*this.seed+49297)%233280,e+this.seed/233280*(t-e)')

         //   if(window.logFloat){console.log("randomGen:"+window.m.randomGen.seed+" e:"+e+" t:"+t)
window.targeting=false
window.changeColor=true
            window.playersColor="#e70a0a"

            code=code.replace(/\.prototype\.setShellColor=function\(\w\)\{\(\w<0\|\|\w>=shellColors\.length\)\&\&\(console\.log\("Shell color out of bounds: "\+\w\),\w=0\);var \w=\w\.Color3\.FromHexString\(shellColors\[\w\]\);this\.bodyMesh\.colorMult=\w,this\.hands\.colorMult=\w\}/,
            `
            .prototype.setShellColor = function(colorChangeInput)
	{
		(colorChangeInput < 0 || colorChangeInput >= shellColors.length) && (console.log("Shell color out of bounds: " + colorChangeInput), colorChangeInput = 0);
       if(${m}){
          window.mId=${m}.uniqueId
      //  ${m}.actor.hands.colorMult = ${b}.Color3.FromHexString("#0000ff")
       // ${m}.actor.hands.colorMult = ${b}.Color3.FromHexString("#0000ff")
       }
        if(window.changeColor==false){
		var changeColor = ${b}.Color3.FromHexString(shellColors[colorChangeInput]);
        }
        else if(this.player.uniqueId==window.mId){
        var changeColor = ${b}.Color3.FromHexString("#0000ff")
        }
        else{
        var changeColor = ${b}.Color3.FromHexString(window.playersColor)
        }

		this.bodyMesh.colorMult = changeColor, this.hands.colorMult = changeColor
        }
            `)


            /*
            Dt =[
		{
			name: "Soldier", weapon: ft
		},
		{
			name: "Scrambler", weapon: _t
		},
		{
			name: "Free Ranger", weapon: gt
		},
		{
			name: "Eggsploder", weapon: yt
		},
		{
			name: "Whipper", weapon: bt
		},
		{
			name: "Crackshot", weapon: xt
		},
		{
			name: "TriHard", weapon: Pt
		}],
        xt.prototype.fireMunitions = function(e, t)
	{
		lt.fire(this.player, e, t, xt)
	}
            */
          // code=code.replace( '!0,this.fire()','!0,this.weapon.myFire()');
            window.saveRotation=false;
            code=code.replace(fireFunc+'.prototype.fire=function(){'//var e=t.Matrix.RotationYawPitchRoll(this.player.yaw,this.player.pitch,0),i=t.Matrix.Translation(0,0,this.subClass.range).multiply(e),r=i.getTranslation(),n=this.player.shotSpread+this.inaccuracy;isNaN(n)&&(this.player.shotSpread=0,n=0),this.subClass.burst&&this.burstQueue<=0&&(this.burstQueue=(this.subClass.burst-1)*this.subClass.burstRof);var a=t.Matrix.RotationYawPitchRoll((this.player.randomGen.getFloat()-.5)*n,(this.player.randomGen.getFloat()-.5)*n,(this.player.randomGen.getFloat()-.5)*n),o=(r=(i=i.multiply(a)).getTranslation(),t.Matrix.Translation(0,.1,0)),s=(o=(o=o.multiply(e)).add(t.Matrix.Translation(this.player.x,this.player.y+.3,this.player.z))).getTranslation();if(s.x=Math.floor(256*s.x)/256,s.y=Math.floor(256*s.y)/256,s.z=Math.floor(256*s.z)/256,r.x=Math.floor(256*r.x)/256,r.y=Math.floor(256*r.y)/256,r.z=Math.floor(256*r.z)/256,this.ammo.rounds--,this.player.shotSpread+=.5*this.instability,this.actor)return this.player.id==u&&Vn(),this.actor.fire(),this.fireMunitions(s,r),void(--this.tracer<0&&(this.tracer=this.subClass.tracer));var l=ki.getBuffer();l.packInt8(ze.fire),l.packInt8(this.player.id),l.packFloat(s.x),l.packFloat(s.y),l.packFloat(s.z),l.packFloat(r.x),l.packFloat(r.y),l.packFloat(r.z),sendToAll(l),this.fireMunitions(s,r)}'
                              ,`
     ${fireFunc}.prototype.myFire = function()
	{
    if(window.backToTarget){
    // console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')

    var n = this.player.shotSpread + this.inaccuracy;
    var p = Math.max(0, Math.length3(window.m.dx, window.m.dy, window.m.dz) - .012);
				if(window.m.climbing || window.m.jumping){(p *= 2)}
				var m2 = this.instability *(this.subClass.movementInstability || 1);
				n += m2 *p *2;
                n = Math.max(n *this.instability - .01 *this.subClass.stability, 0);



    var e = t.Matrix.RotationYawPitchRoll(this.player.yaw, this.player.pitch, 0),
			i = t.Matrix.Translation(0, 0, this.subClass.range).multiply(e),
			r = i.getTranslation()
            //0.22968814968814963
            window.myBloom=n
		isNaN(n) && (this.player.shotSpread = 0, n = 0);
       var seed1 = (9301 *this.player.randomGen.seed + 49297) % 233280
       var seed2 = (9301 *seed1 + 49297) % 233280
       var seed3 = (9301 *seed2 + 49297) % 233280
		var a = t.Matrix.RotationYawPitchRoll(
        (seed1/233280 - .5) *n,
        (seed2/233280 - .5) *n,
        (seed3/233280 - .5) *n);
        	o = (r = (i = i.multiply(a)).getTranslation(), t.Matrix.Translation(0, .1, 0)),
			s = (o = (o = o.multiply(e)).add(t.Matrix.Translation(this.player.x, this.player.y + .3, this.player.z))).getTranslation();
		if (s.x = Math.floor(256 *s.x) / 256, s.y = Math.floor(256 *s.y) / 256, s.z = Math.floor(256 *s.z) / 256, r.x = Math.floor(256 *r.x) / 256, r.y = Math.floor(256 *r.y) / 256, r.z = Math.floor(256 *r.z) / 256,this.actor)
        window.bulletOrigin=s
        window.newYaw = Math.radAdd( Math.atan2( r.x, r.z ), 0 );
	    window.newPitch = - Math.atan2( r.y, Math.hypot( r.x, r.z ) ) % 1.5;
        window.zero = 0
       // this.player.yaw = 2*this.player.yaw-newYaw
		//this.player.pitch = 2*this.player.pitch-newPitch
        window.myFired=true
        window.backToTarget=false
        window.savedRotation=true
      //  window.saveRotation=false
        }

        },${fireFunc}.prototype.fire = function(){
        /*
    console.log(window.myBloom)
		var e = t.Matrix.RotationYawPitchRoll(this.player.yaw, this.player.pitch, 0),
			i = t.Matrix.Translation(0, 0, this.subClass.range).multiply(e),
			r = i.getTranslation(),
			n = this.player.shotSpread + this.inaccuracy;
		isNaN(n) && (this.player.shotSpread = 0, n = 0), this.subClass.burst && this.burstQueue <= 0 && (this.burstQueue = (this.subClass.burst - 1) *this.subClass.burstRof);
		var a = t.Matrix.RotationYawPitchRoll((this.player.randomGen.getFloat() - .5) *n, (this.player.randomGen.getFloat() - .5) *n, (this.player.randomGen.getFloat() - .5) *n),
			o = (r = (i = i.multiply(a)).getTranslation(), t.Matrix.Translation(0, .1, 0)),
			s = (o = (o = o.multiply(e)).add(t.Matrix.Translation(this.player.x, this.player.y + .3, this.player.z))).getTranslation();
		if (s.x = Math.floor(256 *s.x) / 256, s.y = Math.floor(256 *s.y) / 256, s.z = Math.floor(256 *s.z) / 256, r.x = Math.floor(256 *r.x) / 256, r.y = Math.floor(256 *r.y) / 256, r.z = Math.floor(256 *r.z) / 256, this.ammo.rounds--, this.player.shotSpread += .5 *this.instability, this.actor) return this.player.id == u && Vn(), this.actor.fire(), this.fireMunitions(s, r), void(--this.tracer < 0 && (this.tracer = this.subClass.tracer));
		var l = ki.getBuffer();
		l.packInt8(ze.fire), l.packInt8(this.player.id), l.packFloat(s.x), l.packFloat(s.y), l.packFloat(s.z), l.packFloat(r.x), l.packFloat(r.y), l.packFloat(r.z), sendToAll(l), this.fireMunitions(s, r)
	}
    */
            `)
            /*
            code=code.replace('lt.prototype.fireThis=function(e,i,r,n){this.player=e,this.x=i.x,this.y=i.y,this.z=i.z,this.origin.set(this.x,this.y,this.z),this.direction.copyFrom(r).normalize().scaleInPlace(n.velocity),this.dx=this.direction.x,this.dy=this.direction.y,this.dz=this.direction.z,this.weaponClass=n,this.damage=n.damage,this.active=!0,this.range=n.range,this.velocity=n.velocity,this.hitsMap=!1,this.powerful=!1,this.dmgTypeId=n.dmgTypeId;var a=ht.rayCollidesWithMap(i,r,ht.projectileCollidesWithCell);a&&(this.end.copyFrom(a.pick.pickedPoint),this.range=t.Vector3.Distance(i,a.pick.pickedPoint),this.hitsMap=!0),e.activeShellStreaks&qe.EggBreaker&&(this.powerful=!0,this.damage*=1.5),this.actor&&(0==this.player.weapon.tracer?this.actor.fire(this.powerful):this.actor.delayFrames=Number.MAX_SAFE_INTEGER)}',`
            lt.prototype.fireThis = function(e, i, r, n)
	{
  //  if(window.logFloat){
   // window.N=N
  //  }
   // var newRotation={x:2*this.player.rotation.x-r.x,y:2*this.player.rotation.y-r.y,z:2*this.player.rotation.z-r.z}

		this.player = e, this.x = i.x, this.y = i.y, this.z = i.z, this.origin.set(this.x, this.y, this.z), this.direction.copyFrom(r).normalize().scaleInPlace(n.velocity), this.dx = this.direction.x, this.dy = this.direction.y, this.dz = this.direction.z, this.weaponClass = n, this.damage = n.damage, this.active = !0, this.range = n.range, this.velocity = n.velocity, this.hitsMap = !1, this.powerful = !1, this.dmgTypeId = n.dmgTypeId;
		var a = ht.rayCollidesWithMap(i, r, ht.projectileCollidesWithCell);
		a && (this.end.copyFrom(a.pick.pickedPoint), this.range = t.Vector3.Distance(i, a.pick.pickedPoint), this.hitsMap = !0), e.activeShellStreaks &qe.EggBreaker && (this.powerful = !0, this.damage *= 1.5), this.actor && (0 == this.player.weapon.tracer ? this.actor.fire(this.powerful) : this.actor.delayFrames = Number.MAX_SAFE_INTEGER)
	}
            `)
            */
//y difference: 0.3974375
          //  code=code.replace('#0984e3','#00ff00')
            window.soloOutlineColor='#ff000000'
            window.blueTeamOutlineColor='#00BFFFff'
            window.redTeamOutlineColor='#FF3F3Fff'
            window.soloNameColor='#ff0000ff'
            window.blueTeamNameColor='#00BFFFff'
            window.redTeamNameColor='#FF3F3Fff'
code=code.replace('outline:[new t.Color4(1,1,1,0),new t.Color4(0,.75,1,1),new t.Color4(1,.25,.25,1)],textColor:[new t.Color4(1,1,1,1),new t.Color4(0,.75,1,1),new t.Color4(1,.25,.25,1)]',
                  'outline:[new t.Color4.FromHexString(window.soloOutlineColor),new t.Color4.FromHexString(window.blueTeamOutlineColor),new t.Color4.FromHexString(window.redTeamOutlineColor)],textColor:[new t.Color4.FromHexString(window.soloNameColor),new t.Color4.FromHexString(window.blueTeamNameColor),new t.Color4.FromHexString(window.redTeamNameColor)]')
//window.playerUpdated=false
           // code=code.replace('Li.prototype.send=function(e){','Li.prototype.send=function(e){if(window.savedRotation){window.playerUpdated=true}')
//code=code.replace('0&&this.fire(),','');
//code=code.replace('.chw-progress-bar-inner"','.chw-progress-bar-wrap"');
         //   code=code.replace('this.fire())','this.weapon.myFire())')
          //  code=code.replace('this.triggerPulled&&this.fire()','this.triggerPulled&&this.weapon.myFire()')
// window.savedRotation2=0
           //code=code.replace('if(this.scope&&this.player.isAtReady(!0))','if(this.scope&&this.player.isAtReady(!0))window.aaa=a,')
          //code=code.replaceAll('t.prototype.attachControl=function(t,i){var r=this,','t.prototype.attachControl=function(t,i){var r=this;window.r=r;console.log("r saved");var ')
           // code=code.replace('if(o.attachedMesh){','if(o.attachedMesh){console.log("ran");');
/*
            code=code.replace('this.rotation.asArray()','window.b.Vector3.Zero()')
            code=code.replace('l.rotation.asArray()','window.b.Vector3.Zero()')
            code=code.replace('e.Vector3.FromArray(t.rotation)','e.Vector3.Zero()')
            code=code.replace('e.Vector3.FromArray(c.rotation)','e.Vector3.Zero()')
            code=code.replace('this._storedRotation.clone()','window.b.Vector3.Zero()')
            code=code.replace('e.Vector3(_,m,u)','e.Vector3.Zero()')
            code=code.replace('.rotation=m','.rotation=window.b.Vector3.Zero()')
            code=code.replace('.rotation=e.rotation','.rotation=window.b.Vector3.Zero()')
            code=code.replace('o.rotation.clone()','window.b.Vector3.Zero()')
*/
            //code=code.replaceAll('(this.rotation.y,this.rotation.x,this.rotation.z)','(0,0,0)')
           // var n=0
            //code=code.replace(/Quaternion\.copyFrom\([^)]+\)/g,match => n++ < 4 ? 'Quaternion.copyFrom(new window.b.Quaternion(0,0,0,0))' : match);

//code = code.replace(/this\.rotationQuaternion([^=\?:])/g, function(match, group) {return group;});
           // code=code.replace('.copyFrom(this.rotationQuaternion)','.copyFrom(new window.b.Quaternion(0,0,0,0))');
            /*
            code=code.replace(',a=new t.TargetCamera("camera",t.Vector3.Zero(),hr),hr.activeCameras.push(a),a.maxZ=100,a.fov=1.25,a.minZ=.05,Ai.attach(a.globalPosition,Lr),(Wi=new t.FreeCamera("uiCamera",new t.Vector3(0,0,-1),hr)).mode=t.Camera.ORTHOGRAPHIC_CAMERA,Wi.layerMask=536870912,Wi.autoClear=!1,hr.activeCameras.push(Wi)',`
            ,a = new t.TargetCamera("camera", t.Vector3.Zero(), hr)
           , hr.activeCameras.push(a)
            ,a.maxZ = 100, a.fov = 2, a.minZ = .05
          //  ,Ai.attach(a.globalPosition, Lr)
          //  ,(Wi = new t.FreeCamera("uiCamera", new t.Vector3(0, 0, -1), hr)).mode = t.Camera.ORTHOGRAPHIC_CAMERA
          //  ,Wi.layerMask = 536870912, Wi.autoClear = !1
           // ,hr.activeCameras.push(Wi)
            `);
            */
           // code=code.replace('a.fov=1.25,','a.fov=1.25,');
          //  code=code.replace('a.fov=a.fov+(1.25-a.fov)*l;','');
          //  code=code.replace('a.fov=a.fov+(this.player.weapon.actor.scopeFov-a.fov)*l,','');
           // code=code.replace('this.fov=this._storedFov,','');
           // code=code.replace(',this.computeWorldMatrix(!0)','');
            //code=code.replace('&&this.computeWorldMatrix(!0)','');
          // code=code.replace(',this._rigCameras[e].fov=this.fov',',this._rigCameras[e].fov=2');
          //  code=code.replace('a.fov=a.fov+(this.player.weapon.actor.scopeFov-a.fov)*l,','a.fov=a.fov+(this.player.weapon.actor.scopeFov-a.fov)*l,window.a2=a,');
          //  code=code.replace('this._globalCurrentTarget.copyFrom(i),','');
           // code=code.replace('this._globalPosition.copyFrom(t),','');
           // code=code.replace(',this._globalCurrentUpVector.copyFrom(r)',',this._globalCurrentUpVector=new e.Vector3(0, -1, 0)')
            // code=code.replace('r.rotation.copyFrom(i.rotation),','');
         //  code=code.replaceAll(/,[^,&(]+\.rotation\.copyFrom\([^)]+\)/g,'');
         //  code=code.replaceAll(/,[^,&(?;]+\.rotationQuaternion\.copyFrom\([^)]+\)/g,'');
         //  code=code.replace('e.rotationQuaternion.copyFrom(this._deviceRoomRotationQuaternion),','');
           //code=code.replaceAll(/RotationYawPitchRollToRef\([^,]+,[^,]+,[^,]+/g,'RotationYawPitchRollToRef(0,0,0');
       //    code=code.replace(':e.Matrix.RotationYawPitchRollToRef(this.rotation.y,this.rotation.x,this.rotation.z',':e.Matrix.RotationYawPitchRollToRef(0,0,0');

            //code=code.replace('&&this.computeWorldMatrix()','&&(window.myBool3=true,this.computeWorldMatrix(),window.myBool3=false)')
           // code=code.replace('i.prototype.computeWorldMatrix=function(t){','i.prototype.computeWorldMatrix=function(t){if(window.myBool3){console.log(this._isWorldMatrixFrozen||(!t && this.isSynchronized()));window.myBool3=false;}')

            let match = code.match(/computeWorldMatrix\(!?0?\)/g);
            for(let i=1;i<=match.length;i++){
            if (match) code = code.replace(match[i-1], 'computeWorldMatrix('+i+')');
              //  console.log(match[2])
            }

         //   let match2 = code.match(/e\.Quaternion\.RotationYawPitchRoll\(this.rotation\.y,this.rotation\.x,this.rotation\.z\)/g);
          //  for(let i=0;i<match2.length;i++){
          //  if (match2) code = code.replace(match2[i], 'window.camRotation?e.Quaternion.RotationYawPitchRoll(window.camRotation.y, window.camRotation.x, window.camRotation.z):'+match2[i]);
              //  console.log(match[2])
          //  }

          //  window.rotationArr=[]
          //     let match2 = code.match(/\.rotation\.x,/g);
           // for(let i=5;i<10;i++){
           // if (match2) code = code.replace(match2[i], '.rotation.x*window.rotationArr['+(i-5)+'],');
           //     window.rotationArr.push(1)
              //  console.log(match[2])
          //  }
            /*
            window.rotationArr2=[]
             let match3 = code.match(/\.rotation\.y,/g);
            for(let i=4;i<5;i++){
            if (match3) code = code.replace(match3[i], '.rotation.y*window.rotationArr2['+0+'],');
                window.rotationArr2.push(1)
              //  console.log(match[2])
            }
*/
//code=code.replaceAll('e.Quaternion.RotationYawPitchRollToRef(this.rotation.y,this.rotation.x,this.rotation.z,this.rotationQuaternion)','(window.camRotation?e.Quaternion.RotationYawPitchRollToRef(window.camRotation.y, window.camRotation.x, window.camRotation.z,this.rotationQuaternion):e.Quaternion.RotationYawPitchRollToRef(this.rotation.y,this.rotation.x,this.rotation.z,this.rotationQuaternion))')
   //code=code.replace('e.Quaternion.RotationYawPitchRollToRef(this.rotation.y,this.rotation.x,this.rotation.z,n)','window.camRotation?e.Quaternion.RotationYawPitchRollToRef(window.camRotation.y, window.camRotation.x, window.camRotation.z, n):e.Quaternion.RotationYawPitchRollToRef(this.rotation.y, this.rotation.x, this.rotation.z, n)')


            code=code.replace('i.prototype.computeWorldMatrix=function(t){if(this._isWorldMatrixFrozen)return this._worldMatrix;if(!t&&this.isSynchronized())return this._currentRenderId=this.getScene().getRenderId(),this._worldMatrix;(this._updateCache(),this._cache.position.copyFrom(this.position),this._cache.scaling.copyFrom(this.scaling),this._cache.pivotMatrixUpdated=!1,this._cache.billboardMode=this.billboardMode,this._currentRenderId=this.getScene().getRenderId(),this._childRenderId=this.getScene().getRenderId(),this._isDirty=!1,e.Matrix.ScalingToRef(this.scaling.x*this.scalingDeterminant,this.scaling.y*this.scalingDeterminant,this.scaling.z*this.scalingDeterminant,e.Tmp.Matrix[1]),this.rotationQuaternion)&&(this.rotation.length()&&(this.rotationQuaternion.multiplyInPlace(e.Quaternion.RotationYawPitchRoll(this.rotation.y,this.rotation.x,this.rotation.z)),this.rotation.copyFromFloats(0,0,0)));this.rotationQuaternion?(this.rotationQuaternion.toRotationMatrix(e.Tmp.Matrix[0]),this._cache.rotationQuaternion.copyFrom(this.rotationQuaternion)):(e.Matrix.RotationYawPitchRollToRef(this.rotation.y,this.rotation.x,this.rotation.z,e.Tmp.Matrix[0]),this._cache.rotation.copyFrom(this.rotation));var r=this.getScene().activeCamera;',`
            i.prototype.computeWorldMatrix = function(t)
				{
                window.ipro=this;
					if (this._isWorldMatrixFrozen) return this._worldMatrix;
					if (t>0 && this.isSynchronized()) return this._currentRenderId = this.getScene().getRenderId(), this._worldMatrix;
					(this._updateCache(), this._cache.position.copyFrom(this.position), this._cache.scaling.copyFrom(this.scaling), this._cache.pivotMatrixUpdated = !1,
                    this._cache.billboardMode = this.billboardMode, this._currentRenderId = this.getScene().getRenderId(), this._childRenderId = this.getScene().getRenderId(),
                    this._isDirty = !1, e.Matrix.ScalingToRef(this.scaling.x *this.scalingDeterminant, this.scaling.y *this.scalingDeterminant, this.scaling.z *this.scalingDeterminant,
                    e.Tmp.Matrix[1]), this.rotationQuaternion) && (this.rotation.length() &&
                    (this.rotationQuaternion.multiplyInPlace(e.Quaternion.RotationYawPitchRoll(this.rotation.y, this.rotation.x, this.rotation.z)), this.rotation.copyFromFloats(0, 0, 0)));
					this.rotationQuaternion ? (this.rotationQuaternion.toRotationMatrix(e.Tmp.Matrix[0]), this._cache.rotationQuaternion.copyFrom(this.rotationQuaternion)) :
                    (t==1&&window.camRotation)?(e.Matrix.RotationYawPitchRollToRef(this.rotation.y*window.camRotation.y, this.rotation.x*window.camRotation.x, this.rotation.z, e.Tmp.Matrix[0]),this._cache.rotation.copyFrom(this.rotation)):(e.Matrix.RotationYawPitchRollToRef(this.rotation.y, this.rotation.x, this.rotation.z, e.Tmp.Matrix[0])),
                    this._cache.rotation.copyFrom(this.rotation);

					var r = this.getScene().activeCamera;
            `)

//code=code.replaceAll("RotationYawPitchRoll((this.player.randomGen.getFloat()-.5)*n,(this.player.randomGen.getFloat()-.5)*n,(this.player.randomGen.getFloat()-.5)*n)",'RotationYawPitchRoll(0,0,0aaaaaaaaaaaaa)')


            //window.camRotation ?(e.Matrix.RotationYawPitchRollToRef(window.camRotation.y, window.camRotation.x, window.camRotation.z, e.Tmp.Matrix[0])):(e.Matrix.RotationYawPitchRollToRef(this.rotation.y, this.rotation.x, this.rotation.z, e.Tmp.Matrix[0])),
//i.prototype.computeWorldMatrix = function(t)


         //  code=code.replaceAll('RotationYawPitchRollToRef(t,i,r','RotationYawPitchRollToRef(0,0,0');
          // code=code.replaceAll('RotationYawPitchRollToRef(t,r,n','RotationYawPitchRollToRef(0,0,0');
          // code=code.replaceAll('','');
           //code=code.replace('RotationYawPitchRollToRef(c+r,h+n,a','RotationYawPitchRollToRef(0,0,0');
         //  code=code.replace('RotationYawPitchRollToRef(o.y,o.x,o.z','RotationYawPitchRollToRef(0,0,0');
         //  code=code.replace('RotationYawPitchRollToRef(i,t,r','RotationYawPitchRollToRef(0,0,0');

            //code=code.replace('RotationYawPitchRollToRef(this.vAng,this.uAng,this.wAng','RotationYawPitchRollToRef(0,0,0');
          // code=code.replace('RotationYawPitchRollToRef(this.adjustYaw,this.adjustPitch,this.adjustRoll','RotationYawPitchRollToRef(0,0,0');

           // code=code.replaceAll('RotationYawPitchRollToRef(t.rotation.y,t.rotation.x,t.rotation.z','RotationYawPitchRollToRef(0,0,0');
           //code=code.replaceAll('RotationYawPitchRollToRef(x.y,-x.x,-x.z','RotationYawPitchRollToRef(0,0,0');
           //code=code.replace('RotationYawPitchRollToRef(e.Tools.ToRadians(this._alpha),e.Tools.ToRadians(this._beta),-e.Tools.ToRadians(this._gamma)','RotationYawPitchRollToRef(0,0,0');
           //code=code.replace('RotationYawPitchRollToRef(this._workingVector.y,this._workingVector.x,this._workingVector.z','RotationYawPitchRollToRef(0,0,0');
           //code=code.replace('RotationYawPitchRollToRef(a,n,o','RotationYawPitchRollToRef(0,0,0');

 //code=code.replace('this._cache.rotation.copyFrom(this.rotation));','this._cache.rotation.copyFrom(this.rotation));');
 //code=code.replaceAll(/,\w\.computeWorldMatrix\(!0/g,`,window.myBool=true,$1`);

            //if(window.logUPosition){
 //console.log(code.match(/,\w\.computeWorldMatrix\(!0/g));
           // let match3 = code.match(/a\.rotation\.[xyz]/g);
          //  for(let i=2;i<=match3.length;i++){
           // if (match3) code = code.replace(match3[i], '0');
         //       console.log(match3)
          //  }
 //code=code.replaceAll(/,\w\.rotation\.[xyz]/g,'');
 //code=code.replaceAll('=this.pitch','=0');
// code=code.replaceAll('=this.yaw','=0');
 //code=code.replace('=_r.pitch','=0');
 //code=code.replace('=_r.pitch','=0');
 //code=code.replace('=this.player.pitch','=0');
 //code=code.replace('=this.player.yaw','=0');
// code=code.replace('i.prototype._rotateUpVectorWithCameraRotationMatrix=function(){','i.prototype._rotateUpVectorWithCameraRotationMatrix=function(){window.ipro=this;');
 //code=code.replace('n.setParent(s)','n.setParent(window.m.actor.eye)');
// code=code.replace('','');
// code=code.replace('','');
// code=code.replace('','');
// code=code.replace('','');

window.resetRotation=true

            localStorage.removeItem('lastVersionPlayed');

            code=code.replace(/if\(\w\w?\)return!0/,'return!0');

			return code.replace(updateFunc+'.render()}))}',`
            ${updateFunc}.render(),myFunction()}))}
             function myFunction() {

                window.hr=hr
				const players = ${p};
                window.players=players
				const myPlayer = ${m};
				const BABYLON = ${b};
                window.b=BABYLON
                window.p=players
                window.m=myPlayer

				if ( ! myPlayer ) {

					return;

				}


				if ( ! window.lineOrigin ) {

					window.lineOrigin = new BABYLON.Vector3();
					window.lines = [];

				}
if(window.AimAssisstFunctionStarted===undefined){
${aimAssistClassName}.assistInterval=setInterval(${aimAssistClassName}.calculateAssist, 67);
window.AimAssisstFunctionStarted=true;
}
				window.lineOrigin.copyFrom( myPlayer.actor.mesh.position );
                const pitch = myPlayer.pitch;
				const yaw = myPlayer.actor.mesh.rotation.y;

                var direction = {
  x: -Math.cos(pitch) * Math.sin(yaw),
  y: Math.sin(pitch),
  z: -Math.cos(pitch) * Math.cos(yaw)
};

var length = Math.sqrt(direction.x * direction.x + direction.y * direction.y + direction.z * direction.z);
direction.x /= length;
direction.y /= length;
direction.z /= length;

window.distance = 4; // Desired distance from the player's position
var displacement = {
  x: direction.x * window.distance,
  y: direction.y * window.distance,
  z: direction.z * window.distance
};

                window.lineOrigin.x -= displacement.x
				window.lineOrigin.z -= displacement.z
				window.lineOrigin.y -= displacement.y
                if(window.myPlayer === undefined){
                window.myPlayer = myPlayer;
                }

				for ( let i = 0; i < window.lines.length; i ++ ) {
					window.lines[ i ].playerExists = false;
				}


				for ( let i = 0; i < players.length; i ++ ) {
					const player = players[ i ];
					if ( ! player || player === myPlayer ) {
						continue;
					}

                    //player.name=window.matRotation


 window.middleColor=player.hp/100

                    if ( player.middle === undefined ) {
                       const material9 = new BABYLON.StandardMaterial( 'myMaterial9', player.actor.scene );
                       material9.emissiveColor = new BABYLON.Color3( window.middleColor, 0, 0 );
                       material9.disableLighting = true;

                       const middle = BABYLON.MeshBuilder.CreateSphere("sphere9",{diameter:0.1,color:BABYLON.Color3.Red()}, player.actor.scene);
                       middle.position.y = 0.3;


                       middle.parent = player.actor.mesh;
                       player.middle = middle;
                       player.middle.material=material9
                    }
                    player.middle.material.emissiveColor=new BABYLON.Color3( window.middleColor, 0, 0 );





if(window.Mo===undefined){
window.Mo=Mo;
}

                     if ( player.skyline === undefined ) {

                       const material5 = new BABYLON.StandardMaterial( 'myMaterial2', player.actor.scene );
                        material5.alpha = .8;
                        material5.emissiveColor = new BABYLON.Color3( 1, .1, .1 );
                        material5.diffuseColor = new BABYLON.Color3(1, 0, 0);
                        material5.disableLighting = true;

                       const points = [
                       new BABYLON.Vector3(0,-100, 0),
                       new BABYLON.Vector3(0, 100, 0),
                       ]

                       const skyline = BABYLON.MeshBuilder.CreateLines( 'lines', {points:points}, player.actor.scene );
                       skyline.material = material5;

                       skyline.parent = player.actor.mesh;
                       player.skyline = skyline;
                    }




                    if ( player.outline === undefined) {
                  //  console.log(window.XMLHttpRequest);
                        const material4 = new BABYLON.StandardMaterial( 'myMat', player.actor.scene );
                        material4.alpha = .8;
                        material4.emissiveColor = new BABYLON.Color3( 1, .1, .1 );
                        material4.diffuseColor = new BABYLON.Color3(1, 0, 0);



                        material4.disableLighting = true;

                        const outline1 = BABYLON.Mesh.CreateGround("ground1", .75,.75,1,player.actor.scene);
                        outline1.material = material4;
                        outline1.rotation = new BABYLON.Vector3(0,0,0);
                        outline1.position.y = 0.07;
                        outline1.position.y = 0.02;

                        const outline2 = BABYLON.Mesh.CreateGround("ground1", .75,.75,1, player.actor.scene);
                        outline2.material = material4;
                        outline2.rotation = new BABYLON.Vector3(0,0,Math.PI/2);
                        outline2.position.y = 0.3;
                        outline2.position.x = 0.375;

                        const outline3 = BABYLON.Mesh.CreateGround("ground1", .75,.75,1, player.actor.scene);
                        outline3.material = material4;
                        outline3.rotation = new BABYLON.Vector3(0,0,3*Math.PI/2);
                        outline3.position.y = 0.3;
                        outline3.position.x = -0.375;

                        const outline4 = BABYLON.Mesh.CreateGround("ground1", .75,.75,1, player.actor.scene);
                        outline4.material = material4;
                        outline4.rotation = new BABYLON.Vector3(0,Math.PI/2,3*Math.PI/2);
                        outline4.position.y = 0.3;
                        outline4.position.z = 0.375;

                        const outline5 = BABYLON.Mesh.CreateGround("ground1", .75,.75,1, player.actor.scene);
                        outline5.material = material4;
                        outline5.rotation = new BABYLON.Vector3(0,3*Math.PI/2,3*Math.PI/2);
                        outline5.position.y = 0.3;
                        outline5.position.z = -0.375;

                        const outline6 = BABYLON.Mesh.CreateGround("ground1", .75,.75,1, player.actor.scene);
                        outline6.material = material4;
                        outline6.rotation = new BABYLON.Vector3(0,0,Math.PI);
                        outline6.position.y = 0.675;

                        var outline = BABYLON.Mesh.MergeMeshes([outline1, outline2, outline3, outline4, outline5, outline6]);;

                        outline.parent = player.actor.mesh;
                        player.outline = outline;
                    }

					if ( player.lines === undefined) {

						    const options = {
							points: [ window.lineOrigin, player.actor.mesh.position ],
							updatable: true
						};

						const lines = options.instance = BABYLON.MeshBuilder.CreateLines( 'lines', options, player.actor.scene );
						lines.alwaysSelectAsActiveMesh = true;
						lines.renderingGroupId = 1;
                        lines.alpha=0.5

						player.lines = lines;
						player.lineOptions = options;

						window.lines.push( lines );

						console.log( '%cAdding line...', 'color: green; background: black; font-size: 2em;' );
					}
                    var distance1;
                    distance1 = 1-(Math.hypot(player.x - myPlayer.x, player.y - myPlayer.y, player.z - myPlayer.z)-10)/10;
                    if(distance1>1){
                    distance1 = 1;
                    }
                    if(distance1<=0){
                    distance1 = 0;
                    }

                    var distance2;
                    distance2 = Math.hypot(player.x - myPlayer.x, player.y - myPlayer.y, player.z - myPlayer.z)/10;
                    if(distance2>1){
                    distance2 = 1;
                    }
                    if(distance2<=0){
                    distance2 = 0;
                    }
                        const x2 = player.actor.mesh.position.x - myPlayer.actor.mesh.position.x;
						const y2 = player.actor.mesh.position.y - myPlayer.actor.mesh.position.y;
						const z2 = player.actor.mesh.position.z - myPlayer.actor.mesh.position.z;
                        const thisDistance=Math.hypot(x2,y2,z2)
                        /*
                        var yaw2 = Math.pow((player.yaw - Math.radAdd( Math.atan2( x2, z2 ), 0 )),2);
                        var pitch2 = Math.pow((player.pitch -(- Math.atan2( y2, Math.hypot( x2, z2 ) ) % 1.5)),2);
                        var distance3;
					    distance3 = Math.sqrt(yaw2+pitch2)/7.5;
                        if(distance3>1){
                        distance3 = 1;
                        }
                        if(distance3<=0){
                        distance3 = 0;
                        }
                        
                        if(player.myColor3===undefined){
                        player.myColor3=0;
                        myPlayer.myColor3=0;
                        }
                        if(thisDistance<=20){
                        player.myColor3=1
                        }
                        else{
                        player.myColor3=0
                        }
*/
					player.lines.playerExists = true;
					player.lines = BABYLON.MeshBuilder.CreateLines( 'lines', player.lineOptions);
                    if(player.charClass!=2&&player.charClass!=5){
                    player.lines.color = new BABYLON.Color3(distance1, distance2, player.isBeingLookedAt?1:0);
                    }
                    else{
                    player.lines.color=new BABYLON.Color3(player.isBeingLookedAt?1:0, distance2,.5+distance1/2);
                    }

				
                   
                    player.middle.renderingGroupId = 1;
				    player.middle.visibility = window.espEnabled;//window.everythingtoggle && ( window.aimbotEnabled || window.espEnabled ) && myPlayer !== player && ( myPlayer.team === 0 || myPlayer.team !== player.team );
                
                    player.outline.visibility = window.everythingtoggle && window.redbox && ( myPlayer.team === 0 || myPlayer.team !== player.team );
                    player.outline.randomvariable=0;

                    player.skyline.visibility = window.everythingtoggle && window.skyline && ( myPlayer.team === 0 || myPlayer.team !== player.team );
                    player.skyline.randomvariable=0;

					player.lines.visibility = (!window.onlyWhileVisible||player.isVisible)&&player.playing && window.showLines && myPlayer !== player && ( myPlayer.team === 0 || myPlayer.team !== player.team );;
				}
/*
                if(window.savedRotation){
                        setTimeout(function(){
                        myPlayer.fire();
                        window.playerUpdated=false
                        },15)
                        setTimeout(function(){window.savedRotation=false},25)
                }
*/
                
				for ( let i = 0; i < window.lines.length; i ++ ) {
					if ( ! window.lines[ i ].playerExists ) {
						console.log( '%cRemoving line...', 'color: red; background: black; font-size: 2em;' );
						window.lines[ i ].dispose();
						window.lines.splice( i, 1 );
					}
				}
//if(true||!window.savedRotation){
				if ( myPlayer.playing ) {

					let minDistance = Infinity;
					//let targetPlayer;

					for ( let i = 0; i < players.length; i ++ ) {

						const player = players[ i ];


						if ( !window.targeting&&window.everythingtoggle && player && player !== myPlayer && player.playing && ( myPlayer.team === 0 || player.team !== myPlayer.team ) ) {

                            if(player.isBeingLookedAt){
                        minDistance = -100;
                        window.targetPlayer=player
                        i=1000
                        }
                        else if(!window.aimAssist){
                        const x1 = player.actor.mesh.position.x - myPlayer.actor.mesh.position.x;
						const y1 = player.actor.mesh.position.y - myPlayer.actor.mesh.position.y;
						const z1 = player.actor.mesh.position.z - myPlayer.actor.mesh.position.z;
                        var yaw1 = Math.pow((myPlayer.yaw - Math.radAdd( Math.atan2( x1, z1 ), 0 )),2);
                        yaw1=Math.min(yaw1,Math.PI2-yaw1)
                        var pitch1 = Math.pow((myPlayer.pitch -(- Math.atan2( y1, Math.hypot( x1, z1 ) ) % 1.5)),2);
                        //if(window.log){
                        //window.log=false
                        //console.log(myPlayer.pitch)
                        //console.log(myPlayer.yaw)
                        //}
                        var distance;
                        var d = Math.hypot( player.x - myPlayer.x, player.y - myPlayer.y, player.z - myPlayer.z );
                      //  if(!window.closest){
					     distance = Math.sqrt(yaw1+pitch1) //- Math.atan(1.0/d);
                      //  }
                      //  else{
                       // distance = d;
                       // }

							if ( distance < minDistance ) {
								minDistance = distance;
                                window.targetPlayer=player
							}
                       }

						}

					}
window.camRotation=undefined

//console.log(myPlayer.actor.head.rotation)

					if ( window.aimbotEnabled&& window.targetPlayer) {
                  //  window.resetRotation=true
                   // myPlayer.actor.eye.rotation.x=1

                   // if(!window.firstSaved){

                   // }
                   /*
                   if(!window.firstSaved){
                   window.firstSaved={x:0,y:0,x2:myPlayer.pitch,y2:myPlayer.yaw}
                 //  window.firstSaved={x:myPlayer.pitch,y:myPlayer.yaw}
}
//window.rotationArr[4]=0
                    myPlayer.actor.eye.rotation.x=firstSaved.x+myPlayer.pitch-firstSaved.x2
                    myPlayer.actor.eye.rotation.y=firstSaved.y+myPlayer.yaw-firstSaved.y2

                    window.firstSaved.x+=myPlayer.pitch-firstSaved.x2
                    window.firstSaved.y+=myPlayer.yaw-firstSaved.y2
                    myPlayer.pitch=firstSaved.x2
                    myPlayer.yaw=firstSaved.y2
                    
*/

                    myPlayer.weapon.myFire();
                    if(window.newPitch&&window.newYaw&&window.bulletOrigin){
                    window.targeting=true
                    var targetPlayerY=window.targetPlayer.y+.27//-myPlayer.actor.mesh.position.y
                    let d = Math.hypot( window.targetPlayer.x - window.bulletOrigin.x, targetPlayerY - window.bulletOrigin.y, window.targetPlayer.z - window.bulletOrigin.z);


                        const gravity = 0.006;
                        const pow = 1.4;

                        const old_x = (window.targetPlayer.x - myPlayer.x)
                        const old_y =(targetPlayerY - window.bulletOrigin.y);
						const old_z = (window.targetPlayer.z - myPlayer.z)

                    const mult = 1.56 / myPlayer.weapon.subClass.velocity;
                    let t = (d+pow) * mult;
                    let v_t = (d+pow) / myPlayer.weapon.subClass.velocity;
                    let addend = (window.targetPlayer.dy * v_t) - (gravity * (v_t**2));

                    if(window.targetPlayer.climbing && window.targetPlayer.dy > 0) { addend = (window.targetPlayer.dy * 4 * t); }
                    if(window.targetPlayer.climbing && window.targetPlayer.dy < 0) { addend = (-window.targetPlayer.dy * 4 * t); }


                    let x = old_x + (window.targetPlayer.dx * d);
                    let y = old_y //- 0.08;
                    let z = old_z + (window.targetPlayer.dz * d);
 //y += addend;

                    if(!window.targetPlayer.onGround) {
                        y += addend;
                        //var savedy=y
                       // if(!window.swap){
                        const start_ray = {x:window.targetPlayer.x, y:window.targetPlayer.y, z:window.targetPlayer.z, l:addend, length: function() {return 1000; }}//new raypoint(window.targetPlayer.x, window.targetPlayer.y, window.targetPlayer.z, addend);
                        const end_ray = {x:0, y:addend, z:0, l:addend, length: function() {return 1000; }}//new raypoint(0, addend, 0, addend);
                        const impact_point = ${rayFunc}.rayCollidesWithMap(start_ray, end_ray, ${rayFunc}.projectileCollidesWithCell);
                        if(impact_point && impact_point.pick.pickedPoint.y > y) {
                            y = (impact_point.pick.pickedPoint.y - 0.08) - myPlayer.y;
                            //console.log(y-savedy)
                        }
                      //  }
                       // window.swap=!window.swap
                    } else if (Math.abs(window.targetPlayer.dy) > 0.01) {
                        y += (window.targetPlayer.dy * t);
                    }

/*

                        var targetPlayerY=window.targetPlayer.y+0.27
                        const t = Math.hypot( window.targetPlayer.x - window.bulletOrigin.x, targetPlayerY - window.bulletOrigin.y, window.targetPlayer.z - window.bulletOrigin.z);
						const x = (window.targetPlayer.actor.mesh.position.x - window.bulletOrigin.x) + window.targetPlayer.dx*t/2*myPlayer.weapon.subClass.velocity;
                        const y =(targetPlayerY - window.bulletOrigin.y); + window.targetPlayer.dy*t*.8/2*myPlayer.weapon.subClass.velocity;
                       // if(!window.targetPlayer.onGround&&!window.targetPlayer.climbing){
						//y+=1.0/2.0*(-0.36)*(t/50)*(t/50);
                       // }
						const z = (window.targetPlayer.actor.mesh.position.z - window.bulletOrigin.z) + window.targetPlayer.dz*t/2*myPlayer.weapon.subClass.velocity;
*/
                     
						window.targetYaw= Math.radAdd( Math.atan2( x, z ), 0 );
						window.targetPitch= - Math.atan2( y, Math.hypot( x, z ) ) % 1.5;

                    //    var savedYaw=myPlayer.yaw
                    //    var savedPitch=myPlayer.pitch
                    //    var savedNewPitch=window.newPitch
                    //    var savedNewYaw=window.newYaw

                        myPlayer.pitch+=(window.targetPitch-window.newPitch)
                        myPlayer.yaw+=(window.targetYaw-window.newYaw)
                   //     if(!window.firstSaved){
                        // window.rotationArr[4]=0
                //   window.firstSaved={x:0,y:0,x2:myPlayer.pitch,y2:myPlayer.yaw}
                 //  window.firstSaved={x:myPlayer.pitch,y:myPlayer.yaw}
                //   }
                  // window.rotationArr[4]=0
                       // myPlayer.actor.eye.rotation.y=window.targetYaw-myPlayer.yaw//(window.newYaw-window.targetYaw)
                      // myPlayer.actor.eye.rotation.x=window.targetPitch-myPlayer.pitch
                     //   myPlayer.weapon.actor.gunMesh.rotation=myPlayer.actor.eye.rotation
                        window.camRotation={x:myPlayer.pitch?targetPitch/myPlayer.pitch:0,y:myPlayer.yaw?targetYaw/myPlayer.yaw:0,z:myPlayer.actor.eye.rotation.z}
                      
                        }
                        window.backToTarget=true

                        /*
                        if(window.savedRotation2){
                        if(Math.abs(window.savedPlayerPosition.x-myPlayer.actor.mesh.position.x)>0.01||Math.abs(window.savedPlayerPosition.y-myPlayer.actor.mesh.position.y)>0.01||Math.abs(window.savedPlayerPosition.z-myPlayer.actor.mesh.position.z)>0.01){
                        myPlayer.fire();
                        window.aimbotEnabled=false
                        window.savedRotation2=false
                        }
                        }
                        else{
                        window.savedRotation2=true
                        window.savedPlayerPosition=Object.assign({}, myPlayer.actor.mesh.position);
                        //console.log(window.savedRotation2)
                        }
           */
			//		}
                   // else{
                   // if(window.resetRotation){
                //    window.rotationArr[4]=1//window.rotationArr[4]?0:1
                   // window.resetRotation=false
                   // }
                   // myPlayer.actor.eye.rotation.y=0
                   //myPlayer.actor.eye.rotation.x=0
                    //window.firstSaved=undefined
                    }
                    if(window.targetPlayer){
                    if(!window.targetPlayer.playing){
                    console.log('aimbot reset');
                    myPlayer.pitch=window.targetPitch
                    myPlayer.yaw=window.targetYaw
                    window.targetPlayer=undefined
                    window.targeting=false
                    window.aimbotEnabled=false
                    }
}
				}
              //  }
				
			}` )
          localStorage.removeItem('lastVersionPlayed');

		}
		return super.response;
	}
};






















//setInterval(myTimer, 1);

//function myTimer() {
//  window.timer = true;
//}
window.log=false
window.savedScope=false
setInterval(function(){window.log=true},500)
setInterval(function (){

    if(window.m!==undefined){
       // console.log('m is defined')
        if(m.playing){
           // console.log(window.matRotation);
 // if(!m.onGround){
     // m.onGround = true;
           // extern.lo.calculateAssist();
            //console.log("ran");
  // }

   if(m.grenadeCountdown!=0){
        m.grenadeCountdown = 0;
    }

            if((window.aimbotOnScope||m.weaponIdx==1)&&m.actor.scope!==window.savedScope){
                if(m.actor.scope){
                window.aimbotEnabled=true
                }
                else{
                window.targetPlayer=undefined
                window.aimbotEnabled=false
                window.targeting=false
                }
                window.savedScope=m.actor.scope
            }


     //   m.meleCountdown = 0;
//m.actor.meleCountdown=0
//m.actor.meleeCountdown=0
  //if(window.stopInterval){
   // clearInterval(myInterval);
  //}
           // console.log(m.weaponIdx)
            if(window.aimbotEnabled&&m.weapon.ammo.rounds!=0&&m.weaponIdx==1){
            m.fire();
            }

        //if(myPlayer.weapon.ammo.rounds==0&&window.shouldReload){
       // myPlayer.reload();
        //window.shouldReload=false;
        //}
        //if(myPlayer.weapon.ammo.rounds==1&&!window.shouldReload){
        //    window.shouldReload=true;
       // }
       // myPlayer.reloaded();
    }
    }

},1);
window.aimbotOnScope=true
window.aimAssist=false
window.changeNameSize=false;
window.nameBaseSize=1;
window.nameMultiplyer=10;
window.onlydoonce = true;
window.shouldReload=true;
window.stopRuberbanding = false;
window.myRespawn = false;
window.myRespawn2 = false;
window.reload = false;
window.pastDy = 0;
window.timer = false;
window.espEnabled = true;
window.onlyWhileVisible=false
window.aimbotEnabled = false;
window.showLines = true;
window.skyline = false;
window.redbox = false;
window.closest = false;
window.everythingtoggle = true;
window.myColor3=0;
document.addEventListener('mousedown', function(event) {
  if (event.button === 2) { // 0 corresponds to the left mouse button
   window.aimbotEnabled=true
    window.targeting=false
  }
});

document.addEventListener('mouseup', function(event) {
  if (event.button === 2) { // 0 corresponds to the left mouse button
     window.targetPlayer=undefined
    window.aimbotEnabled=false
    window.targeting=false
  }
});


window.addEventListener( 'keyup', function ( event ) {
    
//console.log(event.keyCode)
	if ( document.activeElement && document.activeElement.tagName === 'INPUT' ) {

		return;

	}

if(event.keyCode==16){//shift key

  //  window.targetPlayer=undefined
   // window.aimbotEnabled=false
   // window.targeting=false

    // m.weapon.myFire()

}
	switch ( String.fromCharCode( event.keyCode ) ) {

		case 'B':

			window.aimbotEnabled = ! window.aimbotEnabled;

			break;

		case 'O':

			window.espEnabled = ! window.espEnabled;
            window.onlyWhileVisible=!window.onlyWhileVisible

			break;

		case 'N':

			window.showLines = ! window.showLines;

			break;

            case 'L':

			window.skyline = ! window.skyline;

			break;

            case 'K':

			window.redbox = ! window.redbox;

			break;

            case 'J':

			//window.closest = ! window.closest;

			break;

            case 'H':

			window.everythingtoggle = ! window.everythingtoggle;

			break;

            case '1':
           // console.log(m.randomGen.seed)
           // m.weapon.myFire()
           // console.log(m.randomGen.seed)
           // window.nameMultiplyer/=1.1
           // vueApp.showGameMenu();
           // vueApp.switchToEquipUi();
			//vueApp.$refs.equipScreen.$refs.weapon_select.selectClass(0);
           //myPlayer.equip();
            //vo.prototype.equip();
            //window.myPlayer.changeWeaponLoadout();
            //window.myRespawn=true;
           // extern.respawn();
           // window.myRespawn=false;

			break;

            case '2':
           // window.logFloat=true
         //   window.saveRotation=true
           // m.weapon.myFire()
           // window.logFloat=false
           // window.nameMultiplyer*=1.1
          //  myPlayer.enableShield();
			//vueApp.$refs.equipScreen.$refs.weapon_select.selectClass(1);
           // window.myPlayer.changeWeaponLoadout();
           // window.myRespawn=true;
           // extern.respawn();
           // window.myRespawn=false;

			break;

            case '3':
            window.aimbotEnabled=!window.aimbotEnabled
           // window.nameBaseSize/=1.2
			//vueApp.$refs.equipScreen.$refs.weapon_select.selectClass(2);
            //window.myPlayer.changeWeaponLoadout();

			break;

            case '4':
            extern.respawn();
			//vueApp.$refs.equipScreen.$refs.weapon_select.selectClass(3);
           // window.myPlayer.changeWeaponLoadout();

			break;

            case '5':
         //   window.changeNameSize=!window.changeNameSize;
		//	vueApp.$refs.equipScreen.$refs.weapon_select.selectClass(4);
           // window.myPlayer.changeWeaponLoadout();

			break;

            case '6':

          //  vueApp.$refs.equipScreen.$refs.weapon_select.selectClass(5);
           // window.myPlayer.changeWeaponLoadout();

			break;

            case '7':

			//vueApp.$refs.equipScreen.$refs.weapon_select.selectClass(6);
          //  window.myPlayer.changeWeaponLoadout();

			break;

            case '8':
          //  window.myRespawn=!window.myRespawn;
           // console.log(window.myRespawn);
            break;

            case '9':
            canvas.requestPointerLock();
           // kr();

            break;

            case '0':
          //  window.myRespawn=true;
           // extern.respawn();
            //myPlayer.myRespawnFunc();//window.mym,window.myg,window.myy);
          //  window.myRespawn=false;
            //var mye=extern.Ai.getBuffer();mye.packInt8(tt.respawn);
            //console.log(extern.Ai);
            //extern.respawn();

            break;

            case 'F':
          //  myPlayer.myRespawnFunc();
            //document.exitPointerLock();
            //Ii.getBuffer().packInt8(nt.requestRespawn)
            //myPlayer.reloaded();
            //myPlayer.fire();
            //window.myColor3 = 0;
            break;

            case 'P':
          //  window.myRespawn=!window.myRespawn;
          //  console.log(window.myRespawn);
            //document.onpointerlockchange();
            break;

            case 'Y':
           // window.stopRuberbanding=!window.stopRuberbanding;
           // console.log(window.stopRuberbanding);
            break;



	}

} );

window.addEventListener('keydown', function(event){
if(event.keyCode == 16){
//window.aimbotEnabled=true
   // window.targeting=false
}
});





