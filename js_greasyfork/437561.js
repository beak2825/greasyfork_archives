// ==UserScript==
// @name         bonk-pool
// @version      1.0.11
// @author       Blu
// @description  A userscript to add custom gamemode Pool to bonk.io
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/826975
// @downloadURL https://update.greasyfork.org/scripts/437561/bonk-pool.user.js
// @updateURL https://update.greasyfork.org/scripts/437561/bonk-pool.meta.js
// ==/UserScript==

// for use as a userscript ensure you have Excigma's code injector userscript
// https://greasyfork.org/en/scripts/433861-code-injector-bonk-io

// Credit to:
// Excigma, Oo 0 oO, Bunjalis, and SneezingCactus for help with testing this gamemode
// kklkkj for help resolving potential cross-browser desync issue
// helloim0_0 for updating

const injectorName = `Pool`;
const errorMsg = `Whoops! ${injectorName} was unable to load.
This may be due to an update to Bonk.io. If so, please report this error!
This could also be because you have an extension that is incompatible with \
${injectorName}`;

function injector(src){
	let newSrc = src;
  const modeName = "p";

  // locate beginning of requirejs function
  const REQUIREJS_REGEX = /"use strict";.{0,1000}var ([\w]+)=([\w]+);.{0,20}var ([\w\$]+)=\[arguments\];/;
  let requirejsMatch = newSrc.match(REQUIREJS_REGEX);
  let localObject = requirejsMatch[1];
  let globalObject = requirejsMatch[2];
  let argumentsObject = requirejsMatch[3];
  let replacedArgumentsObject = argumentsObject.replaceAll("$", "\\$");

  // get string function indices of each vanilla mode
  const MODENAME_REGEX = /(\d+)\)]={lobbyName:/g;
  let modenameMatch = newSrc.match(MODENAME_REGEX).map(x=>x.split(")")[0]);
  let modeIndices = {
    b: modenameMatch[0],
    v: modenameMatch[1],
    sp: modenameMatch[2],
    ar: modenameMatch[3],
    ard: modenameMatch[4],
    bs: modenameMatch[5],
    f: modenameMatch[6]
  };

  // locate lobbyModes array initialisation
  const LASTMODE_REGEX = `${localObject}\\.[\\w$]{1,3}\\(${modeIndices.f}\\)`;
  const MODEARRAY_REGEX = new RegExp(`=\\[(${localObject}\\.[\\w$]{1,3}\\(${modeIndices.b}\\).*?),(${LASTMODE_REGEX})]`);
  let modearrayMatch = newSrc.match(MODEARRAY_REGEX);
  // add Pool to list of lobby modes
  newSrc = newSrc.replace(modearrayMatch[0], `=[${modearrayMatch[1]},${modearrayMatch[2]},"${modeName}"]`);

  // locate Football mode metadata initialisation
  const FOOTBALLDATA_REGEX = new RegExp(`${replacedArgumentsObject}\\[(\\d{1,3})\\]\\[${replacedArgumentsObject}.{5,10}\\]\\[.{5,10}${modeIndices.f}\\)]={lobbyName:${localObject}\\.[\\w$]{1,3}\\(.*?,editorCanTarget:false}`);
  let footballdataMatch = newSrc.match(FOOTBALLDATA_REGEX);
  let metadataIndex = footballdataMatch[1];
  // add Pool mode metadata
  newSrc = newSrc.replace(footballdataMatch[0], `${footballdataMatch[0]}; ${argumentsObject}[${metadataIndex}].modes.${modeName} = ${MODE_METADATA};`);

  let lobbyArgObj = newSrc.match(/function [\w$]{2}\((?:[\w$]{3},){3}[\w$]{3}\)\{var ([\w$]{3})=.{10,50}(?:function [\w$]{3}\(\)\{.*}})?this/)[1];

  // Create pool button
  let poolModeButton = document.createElement("div");
  poolModeButton.id = "newbonklobby_mode_pool";
  poolModeButton.className = "newbonklobby_settings_button_mode brownButton brownButton_classic buttonShadow";
  poolModeButton.innerText = "Pool";
  document.getElementById("newbonklobby_mode_menu").appendChild(poolModeButton);
  document.getElementById("newbonklobby_mode_menu").insertBefore(poolModeButton, document.getElementById("newbonklobby_mode_football"));
  const onclickFunc = newSrc.match(new RegExp(`document\\[${lobbyArgObj}.{1,200}([\\w$]{3}\\(1\\);.{0,50}[\\w$]{3}\\(\\))`))[1].replace("(1", `(${argumentsObject}[${metadataIndex}].lobbyModes.indexOf("${modeName}")`);
  newSrc = newSrc.replace(new RegExp(`(document\\[${lobbyArgObj}.{1,200}[\\w$]{3}.{1,50}\})`), `$1;document.getElementById("newbonklobby_mode_pool").onclick=()=>{${onclickFunc}};`);

  // Change ga to p when changing mode, compatibility with bonk-host dropdown regex
  newSrc = newSrc.replaceAll(new RegExp(`if\\(${lobbyArgObj}\\[0\\]\\[2\\]\\[[\\w$]{3}\\[\\d\\]\\[\\d{3}\\]\\] == [\\w$]{3}\\.`, "g"), `if(${lobbyArgObj}[0][2].mo == "${modeName}"){${lobbyArgObj}[0][2].ga = "${modeName}"} else $&`);
  newSrc = newSrc.replace(/\{ga:(.{1,100}),mo:(.{1,100}?)\}\);/, `{ga:$2=="${modeName}"?$2:$1,mo:$2});if(window.bonkHost&&$2=="${modeName}"){window.bonkHost.gameInfo[2].ga="${modeName}"};`);
  newSrc = newSrc.replace(/(bonkSetMode.{1,100}m === "f".+?\})/gs, `$1 else if (m === "${modeName}") {window.bonkHost.gameInfo[2].ga = "${modeName}"}`);

  // Hide unnecessary buttons and force no-teams
  newSrc = newSrc.replace(/if\([\w$]{3}\[\d\d\]\[[\w$]{3}\[\d\]\[\d{3}\]\]\[[\w$]{3}\[0\]\[2\]\[[\w$]{3}\[\d\]\[\d{3}\]\]\]\[[\w$]{3}\[\d\]\[\d{4}\]\]\){/, `
    document.getElementById('newbonklobby_roundsinput').style.visibility = 'inherit';
    document.getElementById('newbonklobby_roundslabel').style.visibility = 'inherit';
    if(${lobbyArgObj}[0][2].mo == "${modeName}"){
      document.getElementById("newbonklobby_mapbutton").style.visibility = "hidden";
      document.getElementById("newbonklobby_teamsbutton").style.visibility = "hidden";
      document.getElementById("newbonklobby_editorbutton").style.visibility = "hidden";
      document.getElementById("newbonklobby_maptext").style.visibility = "hidden";
      document.getElementById("newbonklobby_mapauthortext").style.visibility = "hidden";
      document.getElementById('newbonklobby_roundsinput').style.visibility = 'hidden';
      document.getElementById('newbonklobby_roundslabel').style.visibility = 'hidden';
      if(${lobbyArgObj}[0][2].tea) document.getElementById("newbonklobby_teamsbutton").onclick();
    } else $&`);
  // Replace map preview with Pool logo
  newSrc = newSrc.replace(/([\w$]{3}\[\d\])=.{10,50}[\w$]{3}\[\d\],true\);/, `$&
  if(${lobbyArgObj}[0][2].mo == "${modeName}"){
    $1.src = 'https://upload.wikimedia.org/wikipedia/commons/f/fd/8-Ball_Pool.svg';
    $1.style.boxShadow = "none";
  }`);
  // Replace bg map thumbnail with Pool colour
  newSrc = newSrc.replace(/([\w$]{3}\[\d\])=.{10,50},1,false\);/, `$&
  if(${lobbyArgObj}[0][2].mo == "${modeName}"){
    $1.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYlWPgymH+DwACdgF5mFPNGwAAAABJRU5ErkJggg==';
  }`);


  BALL_PHYSICS = BALL_PHYSICS.replaceAll(`BOX2D_GOES_HERE`, `${argumentsObject}[0][2]`);
  PLAYER_PHYSICS = PLAYER_PHYSICS.replaceAll(`BOX2D_GOES_HERE`, `${argumentsObject}[0][2]`);
  POOL_PHYSICS = POOL_PHYSICS.replaceAll(`BOX2D_GOES_HERE`, `${argumentsObject}[0][2]`);
  STEP = STEP.replaceAll(`BOX2D_GOES_HERE`, `${argumentsObject}[0][2]`);

  let footballRenderer = newSrc.match(/else if\([\w$]{3}\[\d\d\]\[.{1,15} == [\w$]{3}\..{1,15}\)\{.{1,15}=new [\w$]{1,2}\(\);[\w$]{3}\[\d\d\]=new ([\w$]{2})\(.{1,10}?\)/)[1];
  let soundManager = newSrc.match(new RegExp(`function ${footballRenderer}\\(.{1,200}[\\w$]{3}\\[\\d\\]=new ([\\w$]{2})\\(\\);`))[1];
  let oldRenderer = newSrc.match(/function ([\w$])\(.{1,20}use strict/)[1];
  let countdown = newSrc.match(/([\w$]{3}\[\d\d\])=class [\w$]{3}\{.{200,500}cfd8dc/)[1];
  let gameDocument = newSrc.match(/\[\{userName:([\w$]{3}\[\d\d\])/)[1];
  POOL_RENDERER = POOL_RENDERER.replace(`SOUNDMANAGER_GOES_HERE`, soundManager);
  POOL_RENDERER = POOL_RENDERER.replace(`OLDRENDERER_GOES_HERE`, oldRenderer);
  POOL_RENDERER = POOL_RENDERER.replace(`COUNTDOWN_GOES_HERE`, countdown);
  POOL_RENDERER = POOL_RENDERER.replace(`GAMEDOCUMENT_GOES_HERE`, gameDocument);

  // Create custom physics classes, initial state creator, physics step, and renderer
  newSrc = newSrc.replace(new RegExp(`${replacedArgumentsObject}\\[\\d\\]=[\\w$]{5};`), SAFE_EXPONENTIATION + SAFE_SQRT + BALL_PHYSICS + PLAYER_PHYSICS + POOL_PHYSICS + CREATE_NEW_STATE + STEP + POOL_RENDERER + `$&`);
  // On receiving go packet (15) or goInProgress (48) create Pool physics and renderer
  newSrc = newSrc.replaceAll(/else if\(([\w$]{3}\[\d\d\])\[.{1,15} == [\w$]{3}\..{1,15}\)\{(.{1,15})=new [\w$]{1,2}\(\);([\w$]{3}\[\d\d\])=new [\w$]{2}\((.{1,10}?)\)/g, `
    else if($1.ga == "${modeName}"){
      $2 = new Pool();
      $3 = new PoolRenderer($4);
    } $&`);
  // On game start, pass the custom game object
  newSrc = newSrc.replace(/if\(([\w$]{3}\[\d\d\]).{5,30}\)\)\{([\w$]{3}\[\d\])=[\w$]{1,2};\}/, `$& else if ($1.ga == "${modeName}") {
    $2 = Pool;
  }`);

	if(src === newSrc) throw "Injection failed!";
	console.log(injectorName+" injector run");
	return newSrc;
}

let MODE_METADATA = `{lobbyName:"Pool",gameStartName:"POOL",lobbyDescription:"Classic billiards. Aim your shot like you would an arrow and sink some balls (8 ball last!). Hold heavy for more precision.",tutorialTitle:"Pool Mode",tutorialText:"•You are the cue ball!\\r\\n•Hold Z to aim your shot\\r\\n•Hold X for more precision\\r\\n•Sink all the balls, and other players",forceTeams:false,forceTeamCount:null,editorCanTarget:false}`;
let SAFE_EXPONENTIATION = `function safeExponentiation(a, b){
  let r = a ** b;
  r *= 10000000;
	r = Math.round(r);
	r /= 10000000;
  return r;
};`;

let SAFE_SQRT = `function safeSqrt(a){
  let r = Math.sqrt(a);
  r *= 10000000;
	r = Math.round(r);
	r /= 10000000;
  return r;
}`;

let BALL_PHYSICS = `class BallPhysics {
        constructor(world, ballData) {
          let ballRadius = 0.9;
          this.world = world;
          let b2body = new BOX2D_GOES_HERE.Dynamics.b2BodyDef();
          b2body.type = BOX2D_GOES_HERE.Dynamics.b2Body.b2_dynamicBody;
          b2body.position.Set(ballData.x, ballData.y);

          let ballFixture = new BOX2D_GOES_HERE.Dynamics.b2FixtureDef();
          ballFixture.shape = new BOX2D_GOES_HERE.Collision.Shapes.b2CircleShape(ballRadius);
          ballFixture.restitution = 0.9;
          ballFixture.density = 0.6 / (Math.PI * ballRadius * ballRadius);
          ballFixture.friction = 0;
          ballFixture.filter.categoryBits = 4;

          let ballUserData = {
            type: "ball",
            ballReference: this
          };

          let ballBody = this.world.CreateBody(b2body);
          ballBody.CreateFixture(ballFixture);
          ballBody.SetUserData(ballUserData);
          ballBody.SetLinearVelocity(new BOX2D_GOES_HERE.Common.Math.b2Vec2(ballData.xv, ballData.yv));
          ballBody.SetFixedRotation(true);
          ballBody.SetLinearDamping(0.6);
          ballBody.SetBullet(true);

          this.body = ballBody;
          this.id = ballData.id;
        }

        output() {
          let outputData = {
            x: this.body.GetPosition().x,
            y: this.body.GetPosition().y,
            xv: this.body.GetLinearVelocity().x,
            yv: this.body.GetLinearVelocity().y,
            id: this.id
          };
          return outputData;
        }

        destroy() {
          this.world.DestroyBody(this.body);
          this.world = null;
        }
      };`;

let PLAYER_PHYSICS = `class PlayerPhysics {
        constructor(world, playerData, ppm) {
          this.world = world;
          this.radius = 0.9;
          this.ppm = ppm;

          let b2Body = new BOX2D_GOES_HERE.Dynamics.b2BodyDef();
          b2Body.type = BOX2D_GOES_HERE.Dynamics.b2Body.b2_dynamicBody;
          b2Body.position.Set(playerData.x, playerData.y);
          b2Body.fixedRotation = true;
          b2Body.linearDamping = 0.6;
          b2Body.linearVelocity.x = playerData.xv;
          b2Body.linearVelocity.y = playerData.yv;
          b2Body.bullet = true;

          let playerUserData = {
            type: "disc",
            discReference: this
          };

          let playerFixture = new BOX2D_GOES_HERE.Dynamics.b2FixtureDef();
          playerFixture.shape = new BOX2D_GOES_HERE.Collision.Shapes.b2CircleShape(this.radius);
          playerFixture.friction = 0;
          playerFixture.restitution = 0.9;
          playerFixture.density = 0.6 / (Math.PI * this.radius * this.radius);
          playerFixture.filter.categoryBits = 2;

          let playerBody = world.CreateBody(b2Body);
          playerBody.CreateFixture(playerFixture);
          playerBody.SetUserData(playerUserData);

          this.body = playerBody;
          this.dashDir = playerData.dashDir;
          this.dashCharge = playerData.dashCharge;
          this.dashCharging = playerData.dashCharging;
          this.inputState = playerData;
        }

        applyInputs(inputs) {
          let newForce = new BOX2D_GOES_HERE.Common.Math.b2Vec2(0, 0);
          let movementSpeed = 32;
          let previousCharge = this.dashCharging;
          this.dashCharging = inputs.action2;
          let playerFired = false;

          if(this.dashCharging){
            let turningSpeed = 5;
            let chargeSpeed = 1;
            if (inputs.action) {
              newForce.Multiply(0.7);
              turningSpeed = 0.5;
              chargeSpeed = 0.1;
            }
            if (inputs.left) {
              this.dashDir -= turningSpeed;
            }
            if (inputs.right) {
              this.dashDir += turningSpeed;
            }
            if (inputs.up) {
              this.dashCharge += chargeSpeed;
              this.dashCharge = Math.min(30, this.dashCharge);
            }
            if (inputs.down) {
              this.dashCharge -= chargeSpeed;
              this.dashCharge = Math.max(0, this.dashCharge);
            }
            newForce.x = 0;
            newForce.y = 0;
            if(this.dashDir < 0) this.dashDir += 360;
            this.dashDir %= 360;
          } else {
            if (previousCharge && !this.dashCharging && this.dashCharge > 0) {
              let force = this.dashCharge*(1100/30);
              newForce.x = SafeTrig.safeSin(this.dashDir * (Math.PI/180)) * force;
              newForce.y = -SafeTrig.safeCos(this.dashDir * (Math.PI/180)) * force;
              this.dashCharge = 30;
              playerFired = true;
            }
          }
          this.body.ApplyForce(newForce, this.body.GetWorldCenter());
          return playerFired;
        }

        output() {
          let outputData = {
            x: this.body.GetPosition().x,
            y: this.body.GetPosition().y,
            xv: this.body.GetLinearVelocity().x,
            yv: this.body.GetLinearVelocity().y,
            team: this.inputState.team,
            dashDir: this.dashDir,
            dashCharge: this.dashCharge,
            dashCharging: this.dashCharging,
          };
          return outputData;
        }

        destroy() {
          this.world.DestroyBody(this.body);
          this.world = null;
          this.inputState = null;
        }
      };`;

let POOL_PHYSICS = `class PoolPhysics {
        constructor(world) {
          this.world = world;
          let ppm = 11;
          let borderThickness = 5;
          let borderThicknessXInner = 25;
          let borderThicknessYInner = 70+15/2;

          let fieldWidth = (730 - borderThickness * 2 - borderThicknessXInner * 2) / ppm;
          let fieldHeight = (500 - borderThickness * 2 - borderThicknessYInner * 2) / ppm;
          let borderWidth = 19/ppm;
          let pocketWidth = 56/ppm;
          let middlePocketWidth = (safeSqrt(2*safeExponentiation((pocketWidth/2), 2)))*1.1;

          let topLeftBorder = [new BOX2D_GOES_HERE.Common.Math.b2Vec2(-middlePocketWidth/2 - borderWidth/5, -fieldHeight/2), new BOX2D_GOES_HERE.Common.Math.b2Vec2(-fieldWidth/2 + pocketWidth/2, -fieldHeight/2), new BOX2D_GOES_HERE.Common.Math.b2Vec2(-fieldWidth/2 + pocketWidth/2 - borderWidth, -fieldHeight/2 - borderWidth), new BOX2D_GOES_HERE.Common.Math.b2Vec2(-middlePocketWidth/2, -fieldHeight/2 - borderWidth)];
          let topRightBorder = [new BOX2D_GOES_HERE.Common.Math.b2Vec2(fieldWidth/2 - pocketWidth/2, -fieldHeight/2), new BOX2D_GOES_HERE.Common.Math.b2Vec2(middlePocketWidth/2 + borderWidth/5, -fieldHeight/2), new BOX2D_GOES_HERE.Common.Math.b2Vec2(middlePocketWidth/2, -fieldHeight/2 - borderWidth), new BOX2D_GOES_HERE.Common.Math.b2Vec2(fieldWidth/2 - pocketWidth/2 + borderWidth, -fieldHeight/2 - borderWidth)];
          let bottomLeftBorder = [new BOX2D_GOES_HERE.Common.Math.b2Vec2(-middlePocketWidth/2, fieldHeight/2 + borderWidth), new BOX2D_GOES_HERE.Common.Math.b2Vec2(-fieldWidth/2 + pocketWidth/2 - borderWidth, fieldHeight/2 + borderWidth), new BOX2D_GOES_HERE.Common.Math.b2Vec2(-fieldWidth/2 + pocketWidth/2, fieldHeight/2), new BOX2D_GOES_HERE.Common.Math.b2Vec2(-middlePocketWidth/2 - borderWidth/5, fieldHeight/2)];
          let bottomRightBorder = [new BOX2D_GOES_HERE.Common.Math.b2Vec2(fieldWidth/2 - pocketWidth/2 + borderWidth, fieldHeight/2 + borderWidth), new BOX2D_GOES_HERE.Common.Math.b2Vec2(middlePocketWidth/2, fieldHeight/2 + borderWidth), new BOX2D_GOES_HERE.Common.Math.b2Vec2(middlePocketWidth/2 + borderWidth/5, fieldHeight/2), new BOX2D_GOES_HERE.Common.Math.b2Vec2(fieldWidth/2 - pocketWidth/2, fieldHeight/2)];
          let leftBorder = [new BOX2D_GOES_HERE.Common.Math.b2Vec2(-fieldWidth/2, fieldHeight/2 - pocketWidth/2), new BOX2D_GOES_HERE.Common.Math.b2Vec2(-fieldWidth/2 - borderWidth, fieldHeight/2 - pocketWidth/2 + borderWidth), new BOX2D_GOES_HERE.Common.Math.b2Vec2(-fieldWidth/2 - borderWidth, -fieldHeight/2 + pocketWidth/2 - borderWidth), new BOX2D_GOES_HERE.Common.Math.b2Vec2(-fieldWidth/2, -fieldHeight/2 + pocketWidth/2)];
          let rightBorder = [new BOX2D_GOES_HERE.Common.Math.b2Vec2(fieldWidth/2 + borderWidth, fieldHeight/2 - pocketWidth/2 + borderWidth), new BOX2D_GOES_HERE.Common.Math.b2Vec2(fieldWidth/2, fieldHeight/2 - pocketWidth/2), new BOX2D_GOES_HERE.Common.Math.b2Vec2(fieldWidth/2, -fieldHeight/2 + pocketWidth/2), new BOX2D_GOES_HERE.Common.Math.b2Vec2(fieldWidth/2 + borderWidth, -fieldHeight/2 + pocketWidth/2 - borderWidth)];

          let pitchDefinition = new BOX2D_GOES_HERE.Dynamics.b2BodyDef();
          pitchDefinition.type = BOX2D_GOES_HERE.Dynamics.b2Body.b2_staticBody;
          pitchDefinition.position.Set(730/2/ppm, 500/2/ppm);
          let pitchBody = world.CreateBody(pitchDefinition);

          let borderDefinition = new BOX2D_GOES_HERE.Dynamics.b2FixtureDef();
          let polygonShape = new BOX2D_GOES_HERE.Collision.Shapes.b2PolygonShape();
          borderDefinition.friction = 0;
          borderDefinition.restitution = 0;
          borderDefinition.filter.maskBits = 6;
          borderDefinition.shape = polygonShape;

          polygonShape.SetAsArray(topLeftBorder);
          pitchBody.CreateFixture(borderDefinition);
          polygonShape.SetAsArray(topRightBorder);
          pitchBody.CreateFixture(borderDefinition);
          polygonShape.SetAsArray(bottomLeftBorder);
          pitchBody.CreateFixture(borderDefinition);
          polygonShape.SetAsArray(bottomRightBorder);
          pitchBody.CreateFixture(borderDefinition);

          polygonShape.SetAsArray(leftBorder);
          pitchBody.CreateFixture(borderDefinition);
          polygonShape.SetAsArray(rightBorder);
          pitchBody.CreateFixture(borderDefinition);

          pitchBody.SetUserData({type: "wall"});
          this.body = pitchBody;
        }
        destroy() {
          this.world.DestroyBody(this.body);
          this.world = null;
        }
      };`;

let CREATE_NEW_STATE = `function Pool() {};
  Pool.createNewState = function (players, map, seed, instantFTU, y4i, gameSettings, A4i) {
        let borderThickness = 5;
        let borderThicknessXInner = 25;
        let borderThicknessYInner = 70+15/2;
        let middlePocketWidth = ((safeSqrt(2*safeExponentiation((56/2), 2)))*1.1)/2;
        let goals = [[11, 63.5, 56/2, "l"], [730/2, 63.5-5, middlePocketWidth, "m"], [719, 63.5, 56/2, "r"], [11, 436.5, 56/2, "l"], [730/2, 436.5+5, middlePocketWidth, "m"], [719, 436.5, 56/2, "r"]];
        let initialState = {
          scores: [0, 0, 0, 0],
          ppm: 11,
          fte: -1,
          ftu: 120,
          lscr: -1,
          ni: true,
          balls: [],
          ballsSunk: [],
          playerFired: false,
          ballsStationary: false,
          players: players,
          seed: seed,
          discs: [],
          sts: []
        };

        for(let p in players){
          initialState.playerTurn = p;
          break;
        }

        // make 5x5 triangle of balls
        // some random noise to create realistic breaks
        for(let i=0; i<5; i++){
          for(let j=0; j<=i; j++){
            initialState.balls.push({
              x: ((730-(borderThicknessXInner+borderThickness)*2)*(6/8)+borderThicknessXInner+borderThickness+(i*(0.9*initialState.ppm*2-2))+ Math.random(seed)) / initialState.ppm,
              y: ((500 / 2)+(j*(0.9*initialState.ppm*2))-(i*(0.9*initialState.ppm*2)/2)) / initialState.ppm,
              xv: 0,
              yv: 0,
              id: i*((1+i)/2)+j+1
            });
          }
        }
        // randomise balls
        let swap = (a, b) => {
          let tmp = a.id;
          a.id = b.id;
          b.id = tmp;
        }
        let swapRepeat = 50;
        for(let i=0; i<swapRepeat; i++){
          let random1 = Math.floor(Math.random()*initialState.balls.length);
          let random2 = Math.floor(Math.random()*initialState.balls.length);
          swap(initialState.balls[random1], initialState.balls[random2]);
        }
        // ensure two corner balls are different suits
        while(!((initialState.balls[10].id > 8) ^ (initialState.balls[14].id > 8))){
          let random1 = Math.floor(Math.random()*initialState.balls.length);
          let random2 = Math.floor(Math.random()*initialState.balls.length);
          swap(initialState.balls[random1], initialState.balls[random2]);
        }
        // ensure middle ball is 8 ball
        swap(initialState.balls[initialState.balls.map(x=>x.id).indexOf(8)], initialState.balls[4]);

        // initialise player disc objects
        let teamCount = [0, 0, 0, 0];
        let playerArrLen = players.filter(x=>x).length;
        for (let p in players) {
          let currPlayer = players[p];
          let currTeam = currPlayer.team;
          if (currTeam != 1) continue;
          let xOffset = (30+(670/4))-730/2;
          let playerX = 730/2 + xOffset;
          let yOffset = 75+(15/2);
          let playerY = (500-yOffset*2)/(playerArrLen+1)*(teamCount[currTeam]+1)+yOffset;
          initialState.discs[p] = {
            x: playerX / initialState.ppm,
            y: playerY / initialState.ppm,
            xv: 0,
            yv: 0,
            team: currTeam,
            dashDir: 90,
            dashCharge: 30,
            dashCharging: false,
          };
          teamCount[currTeam]++;
        }
        // randomise player positions
        swap = (a, b) => {
          if(a && b){
            let tmp = a.y;
            a.y = b.y;
            b.y = tmp;
          }
        }
        swapRepeat = 50;
        for(let i=0; i<swapRepeat; i++){
          let random1 = Math.floor(Math.random()*playerArrLen);
          let random2 = Math.floor(Math.random()*playerArrLen);
          swap(initialState.discs.filter(x=>x)[random1], initialState.discs.filter(x=>x)[random2]);
        }
        // ensure first player is in the middle
        let firstPlayer = Math.ceil(playerArrLen/2);
        for(let p in initialState.discs){
          firstPlayer = p;
          break;
        }
        let yOffset = 75+(15/2);
        let middleY = (500-yOffset*2)/(playerArrLen+1)*Math.ceil(playerArrLen/2)+yOffset;
        swap(initialState.discs[initialState.discs.map(x=>x.y).indexOf(middleY/initialState.ppm)], initialState.discs[firstPlayer]);

        return initialState;
      };`;

let STEP = `Pool.prototype.step = function (currentFrame, playerInputs, playersChange, b2FPS, gameSettings, V4i) {
        // create contact listeners for sfx
        Pool.soundsThisStep = [];
        if (!Pool.world) {
          Pool.world = new BOX2D_GOES_HERE.Dynamics.b2World(new BOX2D_GOES_HERE.Common.Math.b2Vec2(0, 0));
          Pool.world.SetWarmStarting(false);
          Pool.contactListener = {};
          Pool.world.SetContactListener(Pool.contactListener);

          Pool.contactListener.EndContact = function () {};
          Pool.contactListener.PreSolve = function () {};
          Pool.contactListener.BeginContact = function () {};
          Pool.contactListener.PostSolve = function (b2Contact, b2ContactImpulse) {
            let fixtureTypeA = b2Contact.GetFixtureA().GetBody().GetUserData().type;
            let fixtureTypeB = b2Contact.GetFixtureB().GetBody().GetUserData().type;
            let typeCount = [];
            typeCount[fixtureTypeA] = 1;
            typeCount[fixtureTypeB] ? typeCount[fixtureTypeB]++ : typeCount[fixtureTypeB] = 1;
            let volume = b2ContactImpulse.normalImpulses[0];
            if(volume > 1){
              if (typeCount.ball) {
                let whichIsBall = fixtureTypeA == "ball" ? b2Contact.GetFixtureA().GetBody() : b2Contact.GetFixtureB().GetBody();
                let binaural = whichIsBall.GetPosition().x * currentFrame.ppm;
                if(typeCount.ball > 1 || typeCount.disc){
                  Pool.soundsThisStep.push({i: "clink", v: volume, f: 5, b: binaural});
                }
                if(typeCount.wall){
                  Pool.soundsThisStep.push({i: "thump", v: volume, f: 5, b: binaural});
                }
              }
              else if(typeCount.disc){
                let whichIsDisc = fixtureTypeA == "disc" ? b2Contact.GetFixtureA().GetBody() : b2Contact.GetFixtureB().GetBody();
                let binaural = whichIsDisc.GetPosition().x * currentFrame.ppm;
                if(typeCount.disc > 1) {
                  Pool.soundsThisStep.push({i: "clink", v: volume, f: 5, b: binaural});
                }
                if(typeCount.wall){
                  Pool.soundsThisStep.push({i: "thump", v: volume, f: 5, b: binaural});
                }
              }
            }
          }
        }

        gameSettings.wl = 8;
        let middleGoalWidth = ((safeSqrt(2*safeExponentiation((56/2), 2)))*1.1)/2;
        let goals = [[11, 63.5, 56/2, "l"], [730/2, 63.5-5, middleGoalWidth, "m"], [719, 63.5, 56/2, "r"], [11, 436.5, 56/2, "l"], [730/2, 436.5+5, middleGoalWidth, "m"], [719, 436.5, 56/2, "r"]];
        let world = Pool.world;
        world.novakReset();
        world.SetContactListener(Pool.contactListener);

        // register physics objects
        let poolPhysics = new PoolPhysics(world);
        let ballPhysics = [];
        for(let ball in currentFrame.balls){
          ballPhysics[ball] = new BallPhysics(world, currentFrame.balls[ball]);
        }
        let playerPhysics = [];
        // as long as player hasn't left, create player objects
        for (let p in currentFrame.discs) {
          if (currentFrame.discs[p]) {
            if (!playerHasLeft(p)) {
              playerPhysics[p] = new PlayerPhysics(world, currentFrame.discs[p], currentFrame.ppm);
            }
          }
        }

        // if game has begun and is players turn, apply inputs on player
        let playerTurn = currentFrame.playerTurn;
        let playerFired = currentFrame.playerFired;
        if (currentFrame.ftu == -1 && currentFrame.fte == -1) {
          for (let i = 0; i < playerPhysics.length; i++) {
            if (playerPhysics[i] && playerInputs[i] && i == playerTurn) {
              playerFired = playerFired || playerPhysics[i].applyInputs(playerInputs[i]);
            }
          }
        }

        // update world
        if (currentFrame.ftu == -1) {
          world.Step(1/b2FPS, 2, 6);
        }
        world.ClearForces();

        // calculate whether scored goal
        let scores = currentFrame.scores.slice();
        let teamLastScored = currentFrame.lscr;
        let nextPlayerTurn = false;
        let sunkMyself = currentFrame.sunkMyself;
        if (currentFrame.ftu == -1 && currentFrame.fte == -1) {
          for(let ball in ballPhysics){
            let ballPosition = {x: ballPhysics[ball].body.GetPosition().x, y: ballPhysics[ball].body.GetPosition().y};
            ballPosition.x *= currentFrame.ppm;
            ballPosition.y *= currentFrame.ppm;
            for(let goal in goals){
              let goalRadius = goals[goal][2];
              let distanceToGoal = Math.abs(safeSqrt(safeExponentiation((goals[goal][0]-ballPosition.x), 2) + safeExponentiation((goals[goal][1]-ballPosition.y), 2)));
              if (distanceToGoal < goalRadius) {
                currentFrame.ballsSunk.push(ballPhysics[ball].id);
                if(ballPhysics[ball].id == 8){
                  let eightBallTeam = currentFrame.discs[playerTurn].team;
                  if(eightBallTeam != 2 && eightBallTeam != 3){
                    // FOUL!
                    scores[eightBallTeam] = 999;
                    teamLastScored = -1;
                    nextPlayerTurn = true;
                  }
                  // if its the last ball
                  else if(scores[eightBallTeam] == 7){
                    // player win
                    scores[eightBallTeam]++;
                    teamLastScored = eightBallTeam;
                    nextPlayerTurn = true;
                  } else {
                    // player lose
                    eightBallTeam = eightBallTeam == 2 ? 3 : 2;
                    scores[eightBallTeam] = 999;
                    teamLastScored = eightBallTeam;
                    nextPlayerTurn = true;
                  }
                } else if(ballPhysics[ball].id > 8){
                  // stripes
                  scores[2]++;
                  teamLastScored = 2;
                } else {
                  // solids
                  scores[3]++;
                  teamLastScored = 3;
                }
                Pool.soundsThisStep.push({ i: "sink", v: 1, p: goals[goal][3], f: 5 });
                // teleport offscreen
                ballPhysics[ball].body.GetPosition().x *= 100;
                ballPhysics[ball].body.GetPosition().y *= 100;
                ballPhysics[ball].body.SetLinearVelocity({x:0, y:0});
              }
            }
          }
          for(let player in playerPhysics){
            let playerPosition = {x: playerPhysics[player].body.GetPosition().x, y: playerPhysics[player].body.GetPosition().y};
            playerPosition.x *= currentFrame.ppm;
            playerPosition.y *= currentFrame.ppm;
            for(let goal in goals){
              let goalRadius = goals[goal][2];
              let distanceToGoal = Math.abs(safeSqrt(safeExponentiation((goals[goal][0]-playerPosition.x), 2) + safeExponentiation((goals[goal][1]-playerPosition.y), 2)));
              if (distanceToGoal < goalRadius) {
                if(player == playerTurn) sunkMyself = true;
                Pool.soundsThisStep.push({ i: "sink", v: 1, p: goals[goal][3], f: 5 });
                playerPhysics[player].body.SetPosition({x:(730/2+((30+(670/4))-730/2))/currentFrame.ppm, y:500/2/currentFrame.ppm})
                playerPhysics[player].body.SetLinearVelocity({x:0, y:0})
              }
            }
          }
        }

        // calculate whether balls stationary
        let ballsStationary = currentFrame.ballsStationary;
        if(playerFired){
          let anyBallMoving = false;
          for(let ball in ballPhysics){
            let ballSpeed = ballPhysics[ball].body.GetLinearVelocity().Copy();
            ballSpeed = Math.abs(ballSpeed.x) + Math.abs(ballSpeed.y);
            if(ballSpeed > 0.5){
              anyBallMoving = true;
            }
          }
          for(let player in playerPhysics){
            let ballSpeed = playerPhysics[player].body.GetLinearVelocity().Copy();
            ballSpeed = Math.abs(ballSpeed.x) + Math.abs(ballSpeed.y);
            if(ballSpeed > 0.5){
              anyBallMoving = true;
            }
          }
          if(!anyBallMoving){
            for(let ball in ballPhysics){
              ballPhysics[ball].body.SetLinearVelocity({x:0, y:0});
            }
            for(let player in playerPhysics){
              playerPhysics[player].body.SetLinearVelocity({x:0, y:0});
            }
            ballsStationary = true;
          }
        }
        let playerWon = Math.max(...scores) >= 8;

        // end turn
        if(playerFired && ballsStationary){
          // give suit of first ball if sunk balls
          let assignedTeam = false;
          if(currentFrame.ballsSunk.length){
            if(currentFrame.discs[playerTurn].team == 1){
              if(currentFrame.ballsSunk[0] > 8){
                // stripes
                currentFrame.discs[playerTurn].team = 2;
                assignedTeam = true;
              } else {
                // solids
                currentFrame.discs[playerTurn].team = 3;
                assignedTeam = true;
              }
            }
          }

          // attempt to assign teams to other players
          if(assignedTeam){
            let unChazzed = [];
            for(let p in currentFrame.discs){
              unChazzed.push(currentFrame.discs[p].team);
            }
            let total = unChazzed.length;
            let stripes = unChazzed.filter(x => x == 2).length;
            let solids = unChazzed.filter(x => x == 3).length;
            // potential candidate for force-select team
            if(stripes + solids >= total/2){
              // can force everyone undecided onto solids
              if(stripes >= total/2){
                for(let p in currentFrame.discs){
                  if(currentFrame.discs[p].team == 1) currentFrame.discs[p].team = 3;
                }
              }
              // can force everyone undecided onto stripes
              else if(solids >= total/2){
                for(let p in currentFrame.discs){
                  if(currentFrame.discs[p].team == 1) currentFrame.discs[p].team = 2;
                }
              }
            }
          }

          // calculate if player sunk any wrong balls
          let wrongBall = false;
          if(currentFrame.ballsSunk.length){
            // stripes
            if(currentFrame.discs[playerTurn].team == 2){
              for(let b in currentFrame.ballsSunk){
                if(currentFrame.ballsSunk[b] <= 8) wrongBall = true;
              }
            }
            // solids
            if(currentFrame.discs[playerTurn].team == 3){
              for(let b in currentFrame.ballsSunk){
                if(currentFrame.ballsSunk[b] > 8) wrongBall = true;
              }
            }
          }

          // give turn to next player
          if((!currentFrame.ballsSunk.length || wrongBall || sunkMyself) && !playerWon){
            let flag, flag2 = false;
            nextPlayerTurn = true;
            for(let player in playerPhysics){
              if(flag){
                flag2 = true;
                playerTurn = player;
                break;
              }
              flag = player == playerTurn;
            }
            // .: player must be first in the list
            if(!flag2){
              for(let player in playerPhysics){
                playerTurn = player;
                break;
              }
            }
          }

          // reset turn variables
          playerFired = false;
          ballsStationary = false;
          currentFrame.ballsSunk = [];
          sunkMyself = false;
        }

        // if player left, give to next player
        if(playerHasLeft(playerTurn)){
          nextPlayerTurn = true;
          let idGreater = false;
          for(let player in playerPhysics){
            if(player > playerTurn){
              playerTurn = player;
              idGreater = true;
              break;
            }
          }
          if(!idGreater){
            for(let player in playerPhysics){
              playerTurn = player;
              break;
            }
          }
        }

        // return updated values for next step
        let nextFrame = {
          scores: scores,
          ppm: currentFrame.ppm,
          lscr: teamLastScored,
          seed: currentFrame.seed,
          ni: false,
          sts: [],
          players: [],
          playerTurn: playerTurn,
          ballsSunk: currentFrame.ballsSunk,
          playerFired: playerFired,
          ballsStationary: ballsStationary,
          sunkMyself: sunkMyself
        };
        for (let p in currentFrame.players) {
          if (currentFrame.players[p]) {
            if (playerHasLeft(currentFrame.players[p].id) == false) {
              nextFrame.players[p] = currentFrame.players[p];
            }
          }
        }
        for (let s in currentFrame.sts) {
          if (currentFrame.sts[s] && currentFrame.sts[s].f > 0) {
            let sts = currentFrame.sts[s];
            nextFrame.sts.push({
              i: sts.i,
              f: sts.f - 1,
              v: sts.v,
              p: sts.p,
              pl: sts.pl
            });
          }
        }
        for (let s in Pool.soundsThisStep) {
          nextFrame.sts.push(Pool.soundsThisStep[s]);
        }
        if (nextPlayerTurn || (playerWon && currentFrame.fte == -1)) {
          nextFrame.fte = 70;
        } else {
          nextFrame.fte = Math.max(-1, currentFrame.fte - 1);
        }
        nextFrame.ftu = Math.max(-1, currentFrame.ftu - 1);
        nextFrame.balls = [];
        for(let ball in ballPhysics){
          nextFrame.balls[ball] = ballPhysics[ball].output();
        }
        nextFrame.discs = [];
        for (let p in playerPhysics) {
          if (playerPhysics[p]) {
            nextFrame.discs[p] = playerPhysics[p].output();
          }
        }

        // destroy physics objects
        poolPhysics.destroy();
        for(let ball in ballPhysics){
          ballPhysics[ball].destroy();
        }
        for (let p in playerPhysics.length) {
          if (playerPhysics[p]) {
            playerPhysics[p].destroy();
          }
        }

        function playerHasLeft(playerID) {
          if (playersChange && playersChange.playersLeft && playersChange.playersLeft.length > 0) {
            for (let p in playersChange.playersLeft) {
              if (playersChange.playersLeft[p] == playerID) {
                return true;
              }
            }
          }
          return false;
        }

        return nextFrame;
      };`;

let POOL_RENDERER = `function PoolRenderer(gameRendererElement) {
        let howler = new SOUNDMANAGER_GOES_HERE();
        let xpBarElement = document.getElementById("xpbar");
        let xpBarContainerElement = document.getElementById("xpbarcontainer");
        let gameRendererGraphics = OLDRENDERER_GOES_HERE.gameRenderer;
        gameRendererElement.appendChild(gameRendererGraphics.view);
        gameRendererGraphics.view.classList.add("gamecanvas");
        let elementWidth = 0;
        let elementHeight = 0;
        let lastCorrectedHeight = 0;
        let gameContainer = new PIXI.Container();
        gameContainer.y = 0;
        gameContainer.x = 0;
        gameContainer.scale.x = 1;
        gameContainer.scale.y = 1;
        let resolution = 2;
        let playerGraphics = [];
        let ballGraphics = undefined;
        let playerArray = [];
        let localPlayerID = -1;
        let animationsGroup = new TWEEN.Group();
        let frameLag = 0;

        // draw green
        let pitchGraphics = new PIXI.Graphics().beginFill(0x0a6c03).drawRect(0, 0, 730, 500);
        gameContainer.addChild(pitchGraphics);

        let textureSize = 64;
        let poolTexture = PIXI.RenderTexture.create({width: textureSize, height: textureSize});
        let textureGraphics = new PIXI.Graphics();
        textureGraphics.lineStyle(24, 0xffffff, 0.025);
        textureGraphics.moveTo(0, textureSize);
        textureGraphics.lineTo(textureSize, 0);
        textureGraphics.moveTo(-textureSize, textureSize);
        textureGraphics.moveTo(0, 2*textureSize);
        textureGraphics.moveTo(0, 0);
        textureGraphics.lineTo(64, 64);
        let textureContainer = new PIXI.Container().addChild(textureGraphics);
        gameRendererGraphics.render(textureContainer, poolTexture);

        // draw pitch outline
        pitchGraphics.lineStyle();
        pitchGraphics.beginTextureFill({ texture: poolTexture });
        pitchGraphics.drawRect(30-19, 75+(15/2)-19, 730-((30-19)*2), 335+19*2);
        pitchGraphics.endFill();

        // draw cushions
        pitchGraphics.lineStyle(1, 0xffffff, 0.5);
        pitchGraphics.beginFill(0x0c8603);
        // top left border
        pitchGraphics.drawPolygon([339.4211111394543, 82.5, 58.00000000000001, 82.5, 39.000000000000014, 63.50000000000001, 343.2211111394543, 63.50000000000001]);
        // top right border
        pitchGraphics.drawPolygon([672, 82.5, 390.57888886054565, 82.5, 386.7788888605457, 63.50000000000001, 691, 63.50000000000001]);
        // left border
        pitchGraphics.drawPolygon([29.999999999999993, 389.5, 11, 408.49999999999994, 11, 91.5, 29.999999999999993, 110.5]);
        // right border
        pitchGraphics.drawPolygon([719, 408.49999999999994, 700, 389.5, 700, 110.5, 719, 91.5]);
        // bottom left border
        pitchGraphics.drawPolygon([343.2211111394543, 436.5, 39.000000000000014, 436.5, 58.00000000000001, 417.5, 339.4211111394543, 417.5]);
        // bottom right border
        pitchGraphics.drawPolygon([691, 436.5, 386.7788888605457, 436.5, 390.57888886054565, 417.5, 672, 417.5]);

        // draw head string
        pitchGraphics.moveTo(30+(670/4), 75+(15/2));
        pitchGraphics.lineTo(30+(670/4), 500-75-(15/2));

        // draw head and foot spot
        pitchGraphics.lineStyle();
        pitchGraphics.beginFill(0x88b885);
        pitchGraphics.drawCircle(30+(670*(2/8)), 500/2, 5);
        pitchGraphics.drawCircle(30+(670*(6/8)), 500/2, 5);
        pitchGraphics.endFill();

        // draw pockets
        pitchGraphics.beginFill(0x000000);
        // top left pocket
        pitchGraphics.drawCircle(11, 63.5, 56/2);
        // top middle pocket
        pitchGraphics.drawCircle(730/2, 63.5-5, ((Math.sqrt(2*((56/2) ** 2)))*1.1)/2);
        // top right pocket
        pitchGraphics.drawCircle(719, 63.5, 56/2);
        // bottom left pocket
        pitchGraphics.drawCircle(11, 436.5, 56/2);
        // bottom middle pocket
        pitchGraphics.drawCircle(730/2, 436.5+5, ((Math.sqrt(2*((56/2) ** 2)))*1.1)/2);
        // bottom right pocket
        pitchGraphics.drawCircle(719, 436.5, 56/2);
        pitchGraphics.lineStyle(1, 0xffffff, 0.5);

        // draw rails
        pitchGraphics.beginFill(0x7B311F);
        // top left rail
        pitchGraphics.drawRect(58, 63.5-30, 340-58, 30);
        // top right rail
        pitchGraphics.drawRect(390.57888886054565, 63.5-30, 340-58, 30);
        // right rail
        pitchGraphics.drawRect(719, 110.5, 30, 389.5-110.5);
        // left rail
        pitchGraphics.drawRect(11-30, 110.5, 30, 389.5-110.5);
        // bottom left rail
        pitchGraphics.drawRect(58, 436.5, 340-58, 30);
        // bottom right rail
        pitchGraphics.drawRect(390.57888886054565, 436.5, 340-58, 30);

        // draw pocket guard
        pitchGraphics.beginFill(0x444444);
        let pocketGuardShape = [11, 110.5, 11-30-2, 110.5, 11-30-2, 63.5, 11-20-1, 63.5-20-1, 11, 63.5-30-2, 58, 63.5-30-2, 58, 63.5, 39, 63.5, (39+11)/2, (63.5-30+63.5)/2, ((39+11)/2+(11-30+11)/2)/2-5, ((63.5-30+63.5)/2+(63.5+91.5)/2)/2-5,(11-30+11)/2, (63.5+91.5)/2, 11, 91.5];
        let middleGuardShape = [343.2211111394543, 63.5, 343.2211111394543-20, 63.5, 343.2211111394543-20, 63.5-32, 386.7788888605457+20, 63.5-32, 386.7788888605457+20, 63.5, 386.7788888605457, 63.5, 386.7788888605457, 63.5-10, 730/2, 63.5-18, 343.2211111394543, 63.5-10];
        // top left pocket guard
        pitchGraphics.drawPolygon(pocketGuardShape);
        // top middle pocket guard
        pitchGraphics.drawPolygon(middleGuardShape);
        // top right pocket guard
        pitchGraphics.drawPolygon(pocketGuardShape.map((x,i) => i%2==0 ? 730-x : x));
        // bottom left pocket guard
        pitchGraphics.drawPolygon(pocketGuardShape.map((x,i) => i%2==1 ? 500-x : x));
        // bottom middle pocket guard
        pitchGraphics.drawPolygon(middleGuardShape.map((x,i) => i%2==1 ? 500-x : x));
        // bottom right pocket guard
        pitchGraphics.drawPolygon(pocketGuardShape.map((x,i) => i%2==0 ? 730-x : 500-x));

        let ballsContainer = new PIXI.Container();
        gameContainer.addChild(ballsContainer);

        let playersContainer = new PIXI.Container();
        gameContainer.addChild(playersContainer);

        let animationsContainer = new PIXI.Container();
        gameContainer.addChild(animationsContainer);
        animationsContainer.visible = false;
        let roundOverAnimationContainer = new PIXI.Container();
        animationsContainer.addChild(roundOverAnimationContainer);

        let userText = new PIXI.Text("SOLIDS", {fontFamily: "futurept_medium", fontSize: 40, fill: 0xffffff});
        userText.anchor.set(1, 0.5);
        userText.resolution = resolution;
        userText.x = 695;
        userText.y = 375;
        roundOverAnimationContainer.addChild(userText);

        let winFont = {fontFamily: "futurept_medium", fontSize: 77, fill: 0xffffff};
        let winText = new PIXI.Text("WIN", winFont);
        let scoreText = new PIXI.Text("TURN", winFont);
        winText.anchor.set(1, 0.5);
        scoreText.anchor.set(1, 0.5);
        winText.resolution = resolution;
        scoreText.resolution = resolution;
        roundOverAnimationContainer.addChild(winText);
        roundOverAnimationContainer.addChild(scoreText);
        winText.x = scoreText.x = 700;
        winText.y = scoreText.y = 445;
        let teamNameYOffset = 25;
        let teamNameXOffset = 8;
        let scoreBoardContainer = new PIXI.Container();
        gameContainer.addChild(scoreBoardContainer);
        scoreBoardContainer.x = 365 + 1.1;
        scoreBoardContainer.y = 30;
        let scoreFont = {fontFamily: "futurept_book", fontSize: 40, fill: 0xffffff, align: "center", dropShadow: true, dropShadowDistance: 3, dropShadowAlpha: 0.35, dropShadowBlur: 4};
        let solidsScoreText = new PIXI.Text("0", scoreFont);
        solidsScoreText.resolution = resolution;
        scoreBoardContainer.addChild(solidsScoreText);
        solidsScoreText.anchor.set(1, 0.5);
        solidsScoreText.x = -teamNameXOffset;

        let stripesScoreText = new PIXI.Text("0", scoreFont);
        stripesScoreText.resolution = resolution;
        scoreBoardContainer.addChild(stripesScoreText);
        stripesScoreText.anchor.set(0, 0.5);
        stripesScoreText.x = teamNameXOffset;

        let teamFont = {fontFamily: "futurept_book", fontSize: 17, fill: 0xffffff, align: "center", dropShadow: true, dropShadowDistance: 3, dropShadowAlpha: 0.35, dropShadowBlur: 4};
        let solidsTeamText = new PIXI.Text("Solids", teamFont);
        solidsTeamText.resolution = resolution;
        scoreBoardContainer.addChild(solidsTeamText);
        solidsTeamText.anchor.set(1, 0.5);
        solidsTeamText.x = teamNameXOffset - 1;
        solidsTeamText.y = teamNameYOffset;

        let stripesTeamText = new PIXI.Text("Stripes", teamFont);
        stripesTeamText.resolution = resolution;
        scoreBoardContainer.addChild(stripesTeamText);
        stripesTeamText.anchor.set(0, 0.5);
        stripesTeamText.x = teamNameXOffset + 1;
        stripesTeamText.y = teamNameYOffset;

        let countdown = new COUNTDOWN_GOES_HERE(gameContainer, resolution);

        this.resizeRenderer = function () {
          elementWidth = gameRendererElement.offsetWidth;
          elementHeight = gameRendererElement.offsetHeight;
          let ratio = 730/500;
          let changedRatio = elementWidth / elementHeight;
          let newWidth = 0;
          let newHeight = 0;
          let scaleBy = 0;
          if (changedRatio > ratio) {
            // if too fat, make thinner
            newHeight = elementHeight;
            newWidth = newHeight * ratio;
          } else {
            // if too tall, make shorter
            newWidth = elementWidth;
            newHeight = newWidth / ratio;
          }
          newWidth -= 10;
          newHeight -= 10;
          scaleBy = newWidth/730;
          if (newWidth > 1200) {
            resolution = 4;
          } else {
            resolution = 2;
          }

          // apply new sizes
          gameRendererGraphics.resize(newWidth, newHeight);
          gameContainer.scale.x = scaleBy;
          gameContainer.scale.y = scaleBy;
          xpBarElement.style.width = newWidth * 0.9 + "px";
        };

        this.destroy = function () {
          gameRendererGraphics.clear();
          gameRendererElement.removeChild(gameRendererGraphics.view);
          gameRendererElement = null;
          gameRendererGraphics = null;
        };

        this.setPlayerArray = function (pArr) {
          playerArray = pArr;
        };

        this.setLocalPlayerID = function (id) {
          localPlayerID = id;
        };

        this.enableTutorialText = function () {};
        this.clearAfkWarn = function () {};
        this.showAfkWarn = function () {};

        function lightify(colour, lightLevel){
          let rgb = '#' + colour.toString(16).padStart(6, "0");
          let hsl = rgbToHSL(rgb);
          rgbToHSL("1234");
          hsl.l = lightLevel;
          return hslToRGB(hsl.h, hsl.s, hsl.l);
        }

        function rgbToHSL(rgb) {
          let r = 0;
          let g = 0;
          let b = 0;
          if (rgb.length == 4) {
            r = "0x" + rgb[1] + rgb[1];
            g = "0x" + rgb[2] + rgb[2];
            b = "0x" + rgb[3] + rgb[3];
          } else if (rgb.length == 7) {
            r = "0x" + rgb[1] + rgb[2];
            g = "0x" + rgb[3] + rgb[4];
            b = "0x" + rgb[5] + rgb[6];
          }
          r /= 255;
          g /= 255;
          b /= 255;

          let smallestRGB = Math.min(r, g, b);
          let biggestRGB = Math.max(r, g, b);
          let rangeRGB = biggestRGB - smallestRGB;

          let hue = 0;
          let saturation = 0;
          let luminance = 0;
          if (rangeRGB == 0) {
            hue = 0;
          } else if (biggestRGB == r) {
            hue = ((g - b) / rangeRGB) % 6;
          } else if (biggestRGB == g) {
            hue = (b - r) / rangeRGB + 2;
          } else {
            hue = (r - g) / rangeRGB + 4;
          }
          hue = Math.round(hue * 60);
          if (hue < 0) {
            hue += 360;
          }
          luminance = (biggestRGB + smallestRGB) / 2;
          saturation = (rangeRGB == 0 ? 0 : rangeRGB / (1 - Math.abs(2 * luminance - 1)));
          saturation = +(saturation * 100).toFixed(1);
          luminance = +(luminance * 100).toFixed(1);
          return {h: hue, s: saturation, l: luminance};
        }

        function hslToRGB(h, s, l) {
          s /= 100;
          l /= 100;
          let max = (1 - Math.abs(2 * l - 1)) * s;
          let transient = max * (1 - Math.abs(((h / 60) % 2) - 1));
          let strength = l - max/2;
          let r = 0;
          let g = 0;
          let b = 0;
          if (h > 0 && h < 60) {
            r = max;
            g = transient;
            b = 0;
          } else if (h > 60 && h < 120) {
            r = transient;
            g = max;
            b = 0;
          } else if (h > 120 && h < 180) {
            r = 0;
            g = max;
            b = transient;
          } else if (h > 180 && h < 240) {
            r = 0;
            g = transient;
            b = max;
          } else if (h > 240 && h < 300) {
            r = transient;
            g = 0;
            b = max;
          } else if (h > 300 && h < 360) {
            r = max;
            g = 0;
            b = transient;
          }
          r = Math.round((strength + r) * 255);
          g = Math.round((strength + g) * 255);
          b = Math.round((strength + b) * 255);

          r *= 65536;
          g *= 256;
          b *= 1;
          return r + g + b;
        }

        this.render = function (previousFrame, nextFrame, timeFromLastFrame, gameSettings, inputs, frameNo) {
          if (gameRendererGraphics.view.parentNode != gameRendererElement) {
            gameRendererElement.appendChild(gameRendererGraphics.view);
          }
          let hasResized = false;
          if (elementWidth != gameRendererElement.offsetWidth || elementHeight != gameRendererElement.offsetHeight) {
            this.resizeRenderer();
            hasResized = true;
          }
          let correctHeight = GAMEDOCUMENT_GOES_HERE.getPageHeight();
          if (correctHeight != lastCorrectedHeight || hasResized) {
            xpBarContainerElement.style.top = (correctHeight - elementHeight) / 2 + 8 + "px";
            lastCorrectedHeight = correctHeight;
          }
          let ppm = nextFrame.ppm;
          if (nextFrame.ni) {
            previousFrame = nextFrame;
          }
          // register new ball graphic
          if (!ballGraphics) {
            let balls = nextFrame.balls;
            ballGraphics = [];
            for(let ball in balls){
              ballGraphics[ball] = new PIXI.Graphics();
              ballGraphics[ball].lineStyle(undefined);

              // shadow
              ballGraphics[ball].beginFill(0, 0.3);
              ballGraphics[ball].drawCircle(1, 1, ppm * 0.9);

              // ball
              if(balls[ball].id > 8){
                ballGraphics[ball].beginFill(0xf2ebd0);
                ballGraphics[ball].drawCircle(0, 0, ppm * 0.9);
              }
              switch(balls[ball].id){
                case 1:
                case 9:
                  ballGraphics[ball].beginFill(0xf9c62d);
                  break;
                case 2:
                case 10:
                  ballGraphics[ball].beginFill(0x1c49d2);
                  break;
                case 3:
                case 11:
                  ballGraphics[ball].beginFill(0xd92719);
                  break;
                case 4:
                case 12:
                  ballGraphics[ball].beginFill(0x352969);
                  break;
                case 5:
                case 13:
                  ballGraphics[ball].beginFill(0xff7040);
                  break;
                case 6:
                case 14:
                  ballGraphics[ball].beginFill(0x13975e);
                  break;
                case 7:
                case 15:
                  ballGraphics[ball].beginFill(0x83121a);
                  break;
                case 8:
                  ballGraphics[ball].beginFill(0x000000);
                  break;
              }
              if(balls[ball].id > 8){
                // smaller = bigger
                let wedge = Math.PI * 0.25;
                // left wedge
                ballGraphics[ball].arc(0, 0, ppm * 0.9, Math.PI - wedge, Math.PI + wedge);
                // right wedge
                ballGraphics[ball].arc(0, 0, ppm * 0.9, - wedge, wedge);
              } else {
                ballGraphics[ball].drawCircle(0, 0, ppm * 0.9);
              }
              ballGraphics[ball].beginFill(0xf2ebd0);
              ballGraphics[ball].drawCircle(0, 0, ppm * 0.5);
              let fonts = {
                  fontFamily: "futurept_book",
                  fontSize: 0.9 * ppm * 0.8,
                  fill: 0x000000,
                  align: "center"
              };
              let ballNumber = new PIXI.Text(balls[ball].id, fonts);
              ballNumber.x = -ballNumber.width / 2;
              ballNumber.y = -ballNumber.height / 2;
              ballGraphics[ball].addChild(ballNumber);
              ballGraphics[ball].endFill();

              ballsContainer.addChild(ballGraphics[ball]);
            }
          }

          // register player graphics
          for (let i = 0; i < nextFrame.discs.length; i++) {
            if (nextFrame.discs[i] && !playerGraphics[i]) {
              playerGraphics[i] = {
                container: null,
                inner: null,
                nametext: null,
                outline: null,
                totalRadius: 0.9,
              };
              let playerSkin = new PIXI.Graphics();
              playerGraphics[i].inner = playerSkin;
              let baseColour = 0x448aff;
              let playerContainer = new PIXI.Container();
              playerGraphics[i].container = playerContainer;
              playerContainer.addChild(playerSkin);
              let playerRadius = playerGraphics[i].totalRadius;
              if (playerArray[i] && playerArray[i].avatar && typeof playerArray[i].avatar.bc == "number") {
                baseColour = playerArray[i].avatar.bc;
              } else {
                baseColour = 0x448aff;
              }
              baseColour = lightify(baseColour, 85);
              playerSkin.beginFill(baseColour);
              playerSkin.drawCircle(0, 0, ppm * playerRadius);

              // red arrow to indicate current turn
              let arrowSize = 0.7;
              let arrowDistance = 1.8;
              let redArrow = new PIXI.Graphics();
              redArrow.beginFill(0xff0000);
              redArrow.moveTo(0, ppm * playerRadius * -arrowDistance);
              redArrow.lineTo(ppm * playerRadius * arrowSize * 0.8, ppm * playerRadius * -(arrowDistance + arrowSize));
              redArrow.lineTo(ppm * playerRadius * -arrowSize * 0.8, ppm * playerRadius * -(arrowDistance + arrowSize));
              playerSkin.addChild(redArrow);

              // question mark - team not yet decided
              let fonts = {
                fontFamily: "futurept_book",
                fontSize: playerRadius * ppm * 2,
                fill: 0xf0000d,
                align: "center"
              };
              let toBeDecided = new PIXI.Text("?", fonts);
              toBeDecided.x = -toBeDecided.width / 2;
              toBeDecided.y = -toBeDecided.height / 2;
              playerSkin.addChild(toBeDecided);

              // red ring to indicate stripes
              let ring = new PIXI.Graphics();
              ring.beginFill(0xf0000d);
              ring.drawCircle(0, 0, ppm * playerRadius * 0.5);
              ring.beginFill(baseColour);
              ring.drawCircle(0, 0, ppm * playerRadius * (0.5-0.15));
              playerSkin.addChild(ring);

              // red dot to indicate solids
              let dot = new PIXI.Graphics();
              dot.beginFill(0xf0000d);
              dot.drawCircle(0, 0, ppm * playerRadius * 0.5);
              playerSkin.addChild(dot);
              playerSkin.endFill();
              playerSkin.skinRendered = false;

              // charging bow graphic
              let bowSVG = new PIXI.resources.SVGResource(GameResources.bowSVG, { scale: playerRadius*4*ppm/255, autoload: true });
              let bowTexture = PIXI.Texture.from(bowSVG);
              let bowSprite = new PIXI.Sprite(bowTexture);
              bowSprite.anchor.y = 0.5;
              bowSprite.anchor.x = 0;
              bowSprite.x = playerRadius / 2 * ppm;
              let bowAimGraphics = new PIXI.Graphics();
              bowAimGraphics.lineStyle(1, 0xffffff, 0.3)
              bowAimGraphics.moveTo(0.6 * playerRadius * ppm, -1.6 * playerRadius * ppm);
              bowAimGraphics.lineTo(-playerRadius*ppm, 0);
              bowAimGraphics.moveTo(0.6 * playerRadius * ppm, 1.6 * playerRadius * ppm);
              bowAimGraphics.lineTo(-playerRadius*ppm, 0);
              bowAimGraphics.moveTo(0,0);
              bowAimGraphics.lineTo(playerRadius*ppm*50, 0);

              let bowAimContainer = new PIXI.Container();
              bowAimContainer.addChild(bowSprite);
              bowAimContainer.addChild(bowAimGraphics);
              playerGraphics[i].bow = bowAimContainer;
              playerContainer.addChild(bowAimContainer);

              let playerOutline = new PIXI.Graphics();
              playerOutline.lineStyle(1.5, 0xffffff, 1);
              playerOutline.drawCircle(0, 0, playerRadius * ppm + 0.5);
              playerGraphics[i].outline = playerOutline;
              playerContainer.addChild(playerOutline);

              let playerShadow = new PIXI.Graphics();
              playerShadow.beginFill(0, 0.25);
              playerShadow.drawCircle(1, 1, ppm * playerRadius);
              playerShadow.endFill();
              playerContainer.addChildAt(playerShadow, 0);

              let usernameString = "";
              if (playerArray[i]) {
                usernameString = playerArray[i].userName;
              }
              let usernameFont = {fontFamily: "futurept_book", fontSize: 11, fill: 14737632, align: "center", dropShadow: false, dropShadowDistance: 2, dropShadowAlpha: 0.2};
              if (i == localPlayerID) {
                usernameFont.fill = 0xffffff;
                usernameFont.dropShadowDistance = 2;
                usernameFont.dropShadowAlpha = 0.3;
              }
              let usernameText = new PIXI.Text(usernameString, usernameFont);
              playerGraphics[i].container.addChild(usernameText);
              usernameText.x = -usernameText.width / 2 + 1;
              usernameText.y = ppm * playerRadius * 1.2;
              usernameText.resolution = resolution;
              playerGraphics[i].nametext = usernameText;
              playersContainer.addChild(playerGraphics[i].container);
            }
            if (nextFrame.discs[i]) {
              if (playerArray[i] && playerArray[i].userName != playerGraphics[i].nametext.text) {
                playerGraphics[i].nametext.text = playerArray[i].userName;
                playerGraphics[i].nametext.x = -playerGraphics[i].nametext.width / 2;
                playerGraphics[i].nametext.y = -playerGraphics[i].nametext.height / 2;
              }
            }
          }

          // update bow container and team/turn indicators each frame
          for(let disc in nextFrame.discs){
            playerGraphics[disc].bow.rotation = nextFrame.discs[disc].dashDir * Math.PI / 180 - Math.PI/2;
            playerGraphics[disc].bow.visible = nextFrame.discs[disc].dashCharging;

            // change based on strength
            playerGraphics[disc].bow.children[1].clear();
            let playerRadius = 0.9;
            playerGraphics[disc].bow.children[1].lineStyle(1, 0xffffff, 0.3)
            playerGraphics[disc].bow.children[1].moveTo(0.6 * playerRadius * ppm, -1.6 * playerRadius * ppm);
            playerGraphics[disc].bow.children[1].lineTo((-playerRadius)*ppm*(nextFrame.discs[disc].dashCharge/30 + 1), 0);
            playerGraphics[disc].bow.children[1].moveTo(0.6 * playerRadius * ppm, 1.6 * playerRadius * ppm);
            playerGraphics[disc].bow.children[1].lineTo((-playerRadius)*ppm*(nextFrame.discs[disc].dashCharge/30 + 1), 0);
            playerGraphics[disc].bow.children[1].moveTo(0,0);
            // 3.62 is a magic number that just so happens to line up closely to the actual distance
            // however the distance per power is not a linear curve so this is just an approximation
            playerGraphics[disc].bow.children[1].lineTo(playerRadius*ppm*nextFrame.discs[disc].dashCharge*3.62, 0);

            // red arrow
            if((nextFrame.playerTurn == disc) ^ playerGraphics[disc].inner.children[0].visible){
              playerGraphics[disc].inner.children[0].x = 0;
              playerGraphics[disc].inner.children[0].alpha = 1;
            }
            playerGraphics[disc].inner.children[0].visible = nextFrame.playerTurn == disc;
            // bob up and down sine wave
            // uses method similar to LSB steganography to hide direction data within y value
            // this allows the bobbing to remain stateless
            let xChangeSpeed = 0.1;
            let distanceTillChange = 0.05;
            let booleanBitDepth = 100;
            let heightChange = 5;
            if(Math.round(playerGraphics[disc].inner.children[0].y*booleanBitDepth)%2 == 0){
              let y = (1 - (playerGraphics[disc].inner.children[0].y/heightChange)*2);
              // derive the x pos
              let x = Math.acos(y);
              x += xChangeSpeed;
              // derive new y from incremented x
              playerGraphics[disc].inner.children[0].y = (1-Math.cos(x))/2*heightChange;
              // keep it going same direction
              if(Math.round(playerGraphics[disc].inner.children[0].y*booleanBitDepth)%2 != 0) playerGraphics[disc].inner.children[0].y += 1/booleanBitDepth;
              // if reached max height then change direction
              // if(Math.abs(heightChange - playerGraphics[disc].inner.children[0].y) < distanceTillChange) playerGraphics[disc].inner.children[0].y += 1/booleanBitDepth;
              if(y<-1 || Math.cos(x) > Math.cos(Math.acos(y))){
                playerGraphics[disc].inner.children[0].y = heightChange - 1/booleanBitDepth;
              }
            } else {
              let y = (1 - (playerGraphics[disc].inner.children[0].y/heightChange)*2);
              // derive the x pos
              let x = Math.acos(y);
              x -= xChangeSpeed;
              // derive new y from incremented x
              playerGraphics[disc].inner.children[0].y = (1-Math.cos(x))/2*heightChange;
              // keep it going same direction
              if(Math.round(playerGraphics[disc].inner.children[0].y*booleanBitDepth)%2 == 0) playerGraphics[disc].inner.children[0].y -= 1/booleanBitDepth;
              // if reached max height then change direction
              // if(playerGraphics[disc].inner.children[0].y < distanceTillChange) playerGraphics[disc].inner.children[0].y += 1/booleanBitDepth;
              if(y>1 || Math.cos(x) < Math.cos(Math.acos(y))){
                playerGraphics[disc].inner.children[0].y = 0;
              }
            }
            playerGraphics[disc].inner.children[0].x += 0.00001;
            if(playerGraphics[disc].inner.children[0].x > 0.00001*240){
              playerGraphics[disc].inner.children[0].alpha = Math.max(1 - (playerGraphics[disc].inner.children[0].x - 0.00001*240)*(1/0.00001)/120, 0.6);
            }
            // undecided
            playerGraphics[disc].inner.children[1].visible = nextFrame.discs[disc].team == 1;
            // stripes
            playerGraphics[disc].inner.children[2].visible = nextFrame.discs[disc].team == 2;
            // solids
            playerGraphics[disc].inner.children[3].visible = nextFrame.discs[disc].team == 3;
          }
          // remove player graphic if left game
          for (let i = 0; i < playerGraphics.length; i++) {
            if (playerGraphics[i] && !nextFrame.discs[i]) {
              playersContainer.removeChild(playerGraphics[i].container);
              playerGraphics[i] = null;
            }
          }
          // interpolate ball positions
          for(let ball in ballGraphics){
            let ballX = previousFrame.balls[ball].x * ppm;
            let ballY = previousFrame.balls[ball].y * ppm;
            let ballXNext = nextFrame.balls[ball].x * ppm;
            let ballYNext = nextFrame.balls[ball].y * ppm;
            ballGraphics[ball].x = ((1 - timeFromLastFrame) * ballX + (timeFromLastFrame * ballXNext));
            ballGraphics[ball].y = ((1 - timeFromLastFrame) * ballY + (timeFromLastFrame * ballYNext));
          }
          // interpolate player positions
          for (let i = 0; i < nextFrame.discs.length; i++) {
            if (nextFrame.discs[i]) {
              let previousFrameX = void 0;
              let previousFrameY = void 0;
              let nextFrameX = nextFrame.discs[i].x * ppm;
              let nextFrameY = nextFrame.discs[i].y * ppm;
              if (previousFrame.discs[i]) {
                previousFrameX = previousFrame.discs[i].x * ppm;
                previousFrameY = previousFrame.discs[i].y * ppm;
              } else {
                previousFrameX = nextFrameX;
                previousFrameY = nextFrameY;
              }
              playerGraphics[i].container.x = (1 - timeFromLastFrame) * previousFrameX + timeFromLastFrame * nextFrameX;
              playerGraphics[i].container.y = (1 - timeFromLastFrame) * previousFrameY + timeFromLastFrame * nextFrameY;
              if (inputs[i] && inputs[i].action) {
                playerGraphics[i].outline.visible = true;
              } else {
                playerGraphics[i].outline.visible = false;
              }
            }
          }
          if (solidsScoreText.text != nextFrame.scores[3].toString()) {
            solidsScoreText.text = nextFrame.scores[3].toString();
          }
          if (stripesScoreText.text != nextFrame.scores[2].toString()) {
            stripesScoreText.text = nextFrame.scores[2].toString();
          }
          let startFTU = 120;
          let frameFade = 10;
          // last 10 frames of fte
          if (nextFrame.fte > -1 && nextFrame.fte <= frameFade) {
          // first 10 frames of ftu
          } else if (nextFrame.ftu >= startFTU - frameFade) {
            let newAlpha = 1 - (nextFrame.ftu - (startFTU - frameFade)) / frameFade;
            ballsContainer.alpha = newAlpha;
            playersContainer.alpha = newAlpha;
          } else {
            ballsContainer.alpha = 1;
            playersContainer.alpha = 1;
          }
          if (nextFrame.ftu >= -1 || nextFrame.fte >= -1) {
            animationsGroup.removeAll();
            let animationStats = { textY: -500 };

            // text drops down
            let animationTextDown = new TWEEN.Tween(animationStats, animationsGroup);
            animationTextDown.to({ textY: 0 }, 9);
            animationTextDown.easing(TWEEN.Easing.Quartic.In);
            animationTextDown.delay(13);
            animationTextDown.start(0);

            // text comes up
            let animationTextUp = new TWEEN.Tween(animationStats, animationsGroup);
            animationTextUp.to({ textY: -500 }, 10);
            animationTextUp.easing(TWEEN.Easing.Cubic.In);
            animationTextUp.delay(45);
            animationTextDown.chain(animationTextUp);

            let framesLeft = 0;
            if (nextFrame.ftu > -1) {
              framesLeft += 90;
              framesLeft += 120 - nextFrame.ftu;
            } else if (nextFrame.fte > -1) {
              framesLeft += 90 - nextFrame.fte;
            }
            animationsGroup.update((1 - timeFromLastFrame) * (framesLeft - 1) + (timeFromLastFrame * framesLeft));
            animationsContainer.visible = true;
            roundOverAnimationContainer.y = animationStats.textY;

            if (Math.max(...nextFrame.scores) >= 8) {
              userText.text = nextFrame.scores.indexOf(Math.max(...nextFrame.scores)) == 2 ? "STRIPES" : "SOLIDS";
              winText.visible = true;
              scoreText.visible = false;
            } else {
              if(playerArray[nextFrame.playerTurn]){
                userText.text = playerArray[nextFrame.playerTurn].userName+"'s";
              } else {
                userText.text = "UNKNOWN's";
              }
              winText.visible = false;
              scoreText.visible = true;
            }
            if(nextFrame.scores[1] > 0){
              winText.visible = true;
              winText.text = "FOUL!"
              scoreText.visible = false;
              userText.visible = false;
            } else {
              userText.visible = true;
              winText.text = "WIN";
            }
          } else {
            animationsContainer.visible = false;
          }
          countdown.do(nextFrame.ftu);
          if (nextFrame.sts) {
            for (let i = 0; i < nextFrame.sts.length; i++) {
              let s = nextFrame.sts[i];
              if (s.pl) {
                continue;
              }
              let vol = 0;
              let binaural = 0;
              if (s.i == "clink") {
                vol = s.v * 0.07;
                binaural = ((s.b - (730/2)) / (730/2)) * 0.7;
              }
              if (s.i == "thump") {
                vol = s.v * 0.03;
                binaural = ((s.b - (730/2)) / (730/2)) * 0.7;
              }
              if (s.i == "sink") {
                vol = s.v;
                if (s.p == "l") {
                  binaural = -0.7;
                } else if(s.p == "r"){
                  binaural = 0.7;
                } else {
                  binaural = 0;
                }
              }
              if(!binaural) binaural = 0;
              howler.playSound(s.i, binaural, vol, frameNo + s.f);
              s.pl = true;
            }
          }
          if (nextFrame.fte == 70 && frameLag < Date.now() - 500) {
            if(scoreText.visible){
              howler.playSound("newTurn", 0, 0.5, frameNo);
            } else if(userText.visible){
              howler.playSound("win", 0, 0.5, frameNo);
            } else {
              howler.playSound("foul", 0, 1, frameNo);
            }
            frameLag = Date.now();
          }
          gameRendererGraphics.render(gameContainer);
          gameRendererGraphics.view.style.visibility = "inherit";
          howler.resetSumVols();
        };

        GameResources.soundStrings.clink = 'data:audio/mp3;base64,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';
        GameResources.soundStrings.thump = 'data:audio/mp3;base64,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';
        GameResources.soundStrings.sink = 'data:audio/mp3;base64,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MTEFHZlJmZSCo8CxOCABIB/lhP////////////////+KIS0r5QuuPOIy+f1hzD////////////////////////////////////////////9c/87GxxQg1nt4mAk0yEDVe5TBypqLSppEOAgWNp5OA4D8OsyYhoXzTqSMjwNj4hohdl002ImIXHe3nVo5cJ4cw8LkUhf/BgA3jDsjuDVAHpputV1XTfhe4GxgC1uRMWwQnUpVNPopOmipiJiCYxwcoKMOwXOAoH/qZv0haQ28QaFw4g8kDhOEAIh////m5aIGRMjyDn0EGNDn/////plEB0vJpfd/jNwBIgYFK6IC+C0sQCRmEaQoaQoUAS0JrxQy3AowFHAMTLyjJJmBucNIg0ROoyKwIW3IDGNMZW05bUSfFgLNYrdykc9PPQ1pu77S3sPSqmo4dsye34cGJIAoVBhuRgBv1b7bod2db+m4l4CVm1TVguuXFnqePT1Stet47zu2rT1QFKE0qzJnZq9v1u43bFyXWauHOVsnfZDcZ2+rWrTZKkau2btLSYWud1DXMpVevY8puwbAMzFZLGZDZq3cvypK3bFPSX8v/LXawK5jnzABgWX+IDUGk7EQHHQOsxKWuNORuGoFcmljNd/L5KD1ZpCJAHBMblWO2XFI8jt4ZMa00bN/Z/XqJUmCCp///+CEA6DEfSlUtbTd7K+nTdl7x0qIqqINmzU61qU/8X2iken+Hf/////+8wHUelWkQkSNPF9KINkst1+0AOPDAVITUDT/+7RoBwAEhENQHmngAjWhSjPMDAAWYRs7WayAAYaa5k8wsAD03rIeGhQaMvDFgCAcXoLcDQ+AEIl8Q7Dwrhgj4SithmEYqSGMoG1Ssavc25TTRG733DSCvgQVqJG1aytlg9RODlBT9IdHKdqkhN8aX5SbyHGizPmXUudazFkh1rGzSPjEV612kke2h7piNvO/necq1x1Gp4cOans5B9/RYijoC23fwAICQf/bgBSMEhBmnNJgS1K6lei1S6q53OwYMxyzQcs/9P/e96f3iRa5abHkhGVRcjXdISbWgAAAAMJq973bWwNmIvjwgLDAkeFoAGTGEFqnM2LMBPMOLKrFUhEBM6gIELVCgIl4s8+LzjAR6IslwOzF0KTADTWSMVujUDXIKRvYC9E5V7NPzhli5bWYext4U0O49zsfamZh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';
        GameResources.soundStrings.newTurn = 'data:audio/mp3;base64,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VVVVVVVVVVVVVVVVVVVVVVVV//sYaOUN4HUKxSgAaSAOoTiAAC0kAWApEgAA5IA5hSJEAAiQVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sYSOGP8I8IwAAAGKASQUhwACkkAAABpAAAACAuAB7AAIyQVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sYaMmP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8=';
        GameResources.soundStrings.win = 'data:audio/mp3;base64,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';
        GameResources.soundStrings.foul = 'data:audio/mp3;base64,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';
      }`;

// Compatibility with Excigma's code injector userscript
if(!window.bonkCodeInjectors) window.bonkCodeInjectors = [];
window.bonkCodeInjectors.push(bonkCode => {
	try {
		return injector(bonkCode);
	} catch (error) {
		alert(errorMsg);
		throw error;
	}
});

console.log(injectorName+" injector loaded");