// ==UserScript==
// @name         Multibox script enhanced (Up to 2 bots unless you use proxies)
// @namespace    http://tampermonkey.net/
// @version      20233
// @description  multibox
// @author       Brent Parker
// @match        https://diep.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_getValue
// @grant        GM_setValue
// @license      Do not plagerize the script, make sure to credit the original author (Mi300#4401).
// @downloadURL https://update.greasyfork.org/scripts/499958/Multibox%20script%20enhanced%20%28Up%20to%202%20bots%20unless%20you%20use%20proxies%29.user.js
// @updateURL https://update.greasyfork.org/scripts/499958/Multibox%20script%20enhanced%20%28Up%20to%202%20bots%20unless%20you%20use%20proxies%29.meta.js
// ==/UserScript==
//Disclaimer: All credit goes to the original author, Mi300#4401. I simply added some quality of life improvements.
 alert('Warning: Make sure to install the anti-anti cheat script on GreasyFork. Additionally, please note that unstable connections may fail to go undetected and you or your bots could be kicked from the server. Cheating can result in a permanent ban and I am not responsible for any punishment recieved by the use of this script. Game responsibly!');

let WTF = setInterval (function() {
    if (!document.querySelector('d-base').shadowRoot.children[0].shadowRoot.getElementById('username-input')) {
      return;
    }
    clearInterval (WTF)

    let canRespawn = false;
    let worldPosition = [0, 0];
    let overlay;
    let mouseOffset = [0, 0];
    let gui = true;
    let moveKeys = new Array(4)
    let tabId = Math.round(Math.random()*10000)
     GM_setValue('mouseDown', 0)
    let link = "";
    let iframes = 0;
    GM_setValue('multiboxEnabled', false)

    setInterval(function(){
      document.title = 'diep.io tab #' + tabId
    }, 1000)

    const canvas = document.getElementById ('canvas');
// Function to create an invisible iframe
function createInvisibleIframe(url) {
    var iframe = document.createElement('iframe');
    iframe.style.cssText = 'position: absolute; left: -9999px; top: -9999px; width: 10px; height: 10px; border: 0;';
    iframe.src = url;
    document.body.appendChild(iframe);
}
    function hook(target, callback){

      const check = () => {
        window.requestAnimationFrame(check)
        const func = CanvasRenderingContext2D.prototype[target]

        if(func.toString().includes(target)){

          CanvasRenderingContext2D.prototype[target] = new Proxy (func, {
            apply (method, thisArg, args) {
            callback(method, thisArg, args)

            return Reflect.apply (method, thisArg, args)
            }
          });
        }
      }
      check()
    }
    let dgg = 'i';

    function hookMinimapArrow () {

        let drawInstructions = 0;
        let minimapArrowVertex = [];
        hook ('beginPath', (method, thisArg, args) => {
            //console.log('beginPath', args)
            drawInstructions = 1;
            minimapArrowVertex = [];
        });
        hook ('moveTo', (method, thisArg, args) => {
            //console.log('moveTo', args)
            drawInstructions = 2;
            minimapArrowVertex.push ( args );
        });
        hook ('lineTo', (method, thisArg, args) => {
            //console.log('lineTo', args)
            if (drawInstructions >= 2 && drawInstructions <= 5) {
                drawInstructions ++;
                minimapArrowVertex.push ( args );

            } else {
                drawInstructions = 0;
            }
        });
        hook ('fill', (method, thisArg, args) => {
            //console.log('fill', args)
            if (thisArg.fillStyle != '#000000' || thisArg.globalAlpha < 1) {
                return;
            }
            if (drawInstructions === 4) {
                const pos = getAverage (minimapArrowVertex);
                //console.log(pos)
                worldPosition = getWorldPosition (pos);
            }
        });
    }
    let minimapPosition = [0, 0];
    let minimapDim = [0, 0];

    function hookMinimap () {
        hook ('strokeRect', (method, thisArg, args) => {
            const transform = thisArg.getTransform ();
            minimapPosition = [transform.e, transform.f];
            minimapDim = [transform.a, transform.d];
        });
    }

    function getWorldPosition (position) {
        const ret = [
            parseFloat((((position[0] - minimapPosition[0] - minimapDim[0] / 2) / minimapDim[0] * 100) * 460).toFixed (3)),
            parseFloat((((position[1] - minimapPosition[1] - minimapDim[1] / 2) / minimapDim[1] * 100) * 460).toFixed (3)),
        ]
        return ret;
    }
    const Mi = '';

    function getAverage (points) {
        let ret = [0, 0];
        points.forEach (point => {
            ret[0] += point[0];
            ret[1] += point[1];
        });
        ret[0] /= points.length;
        ret[1] /= points.length;

        return ret;
    }
    let dgh = 'M';


      const getDist = (t1, t2) => {
          const distX = t1[0] - t2[0];
          const distY = t1[1] - t2[1];

          return [Math.hypot(distX, distY), distX, distY];
      };

    function moveBot () {

        if (input.should_prevent_unload()) {
            canRespawn = true;
        }
        let masterMouse = GM_getValue('multiboxMouse');
        let masterMove = GM_getValue ('multiboxWorld');

        console.log(masterMove, worldPosition)
        const distanceMove = getDist (masterMove, worldPosition);
        if (!masterMouse[0] || !masterMouse[1] || !masterMove[0] || !masterMove[1]) {
            return;
        }



        if (GM_getValue('copyMovement')) {
            //console.log(distanceMove[0])
            if (distanceMove[0] > 800) {
              angleMove(distanceMove[1], distanceMove[2])
            } else {
              copyMove(GM_getValue('keys'))
            }
        }
        if (GM_getValue('copyMouse')) {
          angleShoot(...masterMouse)
        }
    }



    function angleMove(dX, dY){
      if (dX > 0) {
        input.key_up (65);
        input.key_down (68);
      } else if (dX < 0) {
        input.key_up (68);
        input.key_down (65);
      } else {
        input.key_up (68);
        input.key_up (65);
      }

      if (dY > 0) {
        input.key_up (87);
        input.key_down (83);
      } else if (dY < 0) {
        input.key_up (83);
        input.key_down (87);
      } else {
        input.key_up (83);
        input.key_up (87);
      }
    }
    function angleShoot(stepX, stepY){
      const x = stepX * canvas.width * window.devicePixelRatio;
      const y = stepY * canvas.height * window.devicePixelRatio;

      input.mouse(x, y)
    }
    function copyMove(keys){
      if(keys[0]){
        input.key_down(87)
      }
      else{
        input.key_up(87)
      }
      if(keys[1]){
        input.key_down(65)
      }
      else {
        input.key_up(65)
      }
      if(keys[2]){
        input.key_down(83)
      }
      else {
        input.key_up(83)
      }
      if(keys[3]){
        input.key_down(68)
      }
      else {
        input.key_up(68)
      }
    }



    function frame () {
        overlay.innerHTML = `
        <h1>MULTIBOX</h1>
        <br> <br>
        World position: <br> ${Math.round(worldPosition[0]) || 0} ${Math.round(worldPosition[1]) || 0}
        <br> <br>
        [P] Master Tab: #${GM_getValue('master') || 0}
        <br> <br>
        [F] Multibox Enabled: ${GM_getValue('multiboxEnabled') || false}
        <br> <br>
        [G] Copy Movement: ${GM_getValue('copyMovement') || false}
        <br> <br>
        [J] Copy Mouse: ${GM_getValue('copyMouse') || false}
        <br> <br>
        [Q] Toggle Gui: true
        <br> <br>
        [Z] Auto Respawn: ${GM_getValue('autoRespawn') || false}
        <br> <br>
        [,] Always Shoot: ${GM_getValue('autoShoot') || false}
        <br> <br>
        `
        if(GM_getValue('autoShoot') ||   GM_getValue('mouseDown') == 1){
          input.key_down(1)
        }
        else{
          input.key_up(1)
        }
        if (GM_getValue('autoRespawn')) {
            input.execute('game_spawn ' + localStorage.name)
        }
        if (GM_getValue('master') == tabId){
            GM_setValue('multiboxWorld', worldPosition)
            GM_setValue('multiboxMouse', mouseOffset)
            GM_setValue('keys', moveKeys)

        } else if (GM_getValue('multiboxEnabled')) {
            moveBot ();
        }
        window.requestAnimationFrame (frame);
    }


    document.addEventListener ('keydown', e => {
        if (e.key === 'f') {
            GM_setValue('multiboxEnabled', !GM_getValue('multiboxEnabled'))
            if(GM_getValue('multiboxEnabled')){
              GM_setValue('master', tabId)
            }
        }
        if (e.key === 'g') {
            GM_setValue('copyMovement', !GM_getValue('copyMovement'))
        }
        if (e.key === 'j') {
            GM_setValue('copyMouse', !GM_getValue('copyMouse'))
        }
        if (e.key === 'q') {
            gui = !gui;
            overlay.style.display = gui ? 'block' : 'none'
        }
        if (e.key === ',') {
            GM_setValue('autoShoot', !GM_getValue('autoShoot'))
        }
        if (e.key === 'z') {
            GM_setValue('autoRespawn', !GM_getValue('autoRespawn'))
        }
        if(e.key === 'p'){
          GM_setValue('master', tabId)
        }
        if(e.key === 'l'){
         link = prompt('Paste diep party link');
        }
        if(e.key === 'x'){
        var count = prompt('spawn n bots');
        count = parseInt(count);
        if (isNaN(count) || count <= 0) {
            alert('Invalid number of iframes.');
            return;
        }
            if (count + iframes > 1){
                 alert('Warning: Your second bot may be detected and kicked from the server by the anticheat. It is reccomended that you spawn only one.');
            } else{
            if(count + iframes > 2){
            alert('Too many connections! Additional connections will completely fail, choose a smaller number.');
            return;
            }
            }
        for (var i = 0; i < count; i++) {
            createInvisibleIframe(link);
        }
        }

        if(e.key === 'w'){
          moveKeys[0] = true;
        }
        if(e.key === 'a') {
          moveKeys[1] = true;
        }
        if(e.key === 's') {
          moveKeys[2] = true;
        }
        if(e.key === 'd') {
          moveKeys[3] = true;
        }
    })

    document.addEventListener('mousedown', e => {
          GM_setValue('mouseDown', 1)
    })
    document.addEventListener('mouseup', e => {
          GM_setValue('mouseDown', 0)
    })
    document.addEventListener('keyup', e => {
        if(e.key === 'w'){
          moveKeys[0] = false;
        }
        if(e.key === 'a') {
          moveKeys[1] = false;
        }
        if(e.key === 's') {
          moveKeys[2] = false;
        }
        if(e.key === 'd') {
          moveKeys[3] = false;
        }
    });

    document.addEventListener ('mousemove', e => {
        mouseOffset = [
            e.x / canvas.width,
            e.y / canvas.height,
        ]
    });
    function terminate () {
        overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '1px';
        overlay.style.left = '1px';
        overlay.style.fontFamily = 'Lucida Console, Courier, monospace';
        overlay.style.fontSize = '12px';
        overlay.style.color = '#ffffff';
        overlay.style.pointerEvents = 'none';
        overlay.style.userSelect = 'none';
        overlay.style.fontSize = '14px';
        overlay.style.backgroundColor = 'gray';
        overlay.style.height = '450px';
        overlay.style.width = '250px';
        overlay.style.borderRadius = '1px'
        overlay.style.borderStyle = 'solid'
        overlay.style.borderColor = '#404040'
        overlay.style.borderWidth = '5px'
        overlay.style.textAlign = 'center';
        document.body.appendChild(overlay);

        frame ();
        hookMinimapArrow ();
        hookMinimap ();



    }
    terminate ();
},400);