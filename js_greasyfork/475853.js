// ==UserScript==
// @name        Direct Install UserScript via Links
// @namespace   UserScripts
// @match       https://*/*
// @grant       none
// @version     1.0.0
// @author      CY Fung
// @license     MIT
// @description Install UserScript with the Greasy Fork Links using Shift Key
// @allFrames true
// @unwrap
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/475853/Direct%20Install%20UserScript%20via%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/475853/Direct%20Install%20UserScript%20via%20Links.meta.js
// ==/UserScript==

(()=>{

  const svg100 = (x)=>`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='${x}'/%3E%3C/svg%3E`;
  const svgFileWhite=svg100(`M60 4a2 2 90 0 0 0 0H14v92h72v-2-64a2 2 90 0 0 0 0v-1h0a2 2 90 0 0-1-1L62 5a2 2 90 0 0-1-1h0-1a2 2 90 0 0 0 0zM18 8h40v24h24v60H18V8zm44 3l17 17H62V11zM52 44l-8 32h4l8-32h-4zm-16 5l-6 11 6 11 4-2-6-9 6-9-4-2zm28 0l-4 2 6 9-6 9 4 2 6-11-6-11z`)
  const svgFileBlack =svg100(`M61 4H14v92h72V29L61 4zM36 71l-6-11 6-11 4 2-6 9 6 9-4 2zm12 5h-4l8-32h4l-8 32zm16-5l-4-2 6-9-6-9 4-2 6 11-6 11zm-4-41V9l21 21H60z`)

  let tmpLinks = [];
  let keys = new Set();
  let isCssAdded = false;

  const divMouseEnter =(evt)=>{
    const target = (evt||0).target;
    if(!(target instanceof HTMLElement)) return;
    let clink = target.getAttribute('data-control-link');
    let elements = HTMLElement.prototype.querySelectorAll.call(target.parentNode, `a[href="${clink}"]`);
    for(const element of elements){
      element.classList.add('kds1e-hover');
    }
    // document.documentElement.setAttribute ('data-kds1e-cl', `${clink}`);
  }

  const divMouseLeave =(evt)=>{
    const target = (evt||0).target;
    if(!(target instanceof HTMLElement)) return;
    let clink = target.getAttribute('data-control-link');
    let elements = HTMLElement.prototype.querySelectorAll.call(target.parentNode, `a[href="${clink}"]`);
    for(const element of elements){
      element.classList.remove('kds1e-hover');
    }
    // document.documentElement.setAttribute ('data-kds1e-cl', `${clink}`);
  }

  const asyncFuncRun = async (baselink)=>{



      const statusForUserScript = await new Promise(resolve=>{
        fetch(baselink+'/code/UserScript.user.js').then(e=>{
          resolve(e && e.status >= 200 && e.status <400 && e.ok);
        }).catch(e=>{
          resolve(false);
        })
      });

      const statusForUserStyle = statusForUserScript ? false : await new Promise(resolve=>{
        fetch(baselink+'/code/UserStyle.user.css').then(e=>{
          resolve(e && e.status >= 200 && e.status <400 && e.ok);
        }).catch(e=>{
          resolve(false);
        })
      });

      if(statusForUserScript){
        window.open(baselink+'/code/UserScript.user.js');
      }else if(statusForUserStyle){
        window.open(baselink+'/code/UserStyle.user.css');

      }


  }

  const divClick = (evt)=>{
    const target = (evt||0).target;
    let clink = target.getAttribute('data-control-link');
    if(!clink) return;
    let m = /https\:\/\/greasyfork\.org\/([-\w]+\/)?scripts\/\d+(\-[-\w]+)?/.exec(clink);
    if(m && m[0]){

      asyncFuncRun(m[0])
      // window.open(m[0]+'/code/UserScript.user.js');
    }
  }

  function onKeyDown(evt){
    if(!evt || !evt.isTrusted) return;
    if(!(evt instanceof KeyboardEvent)) return;


    if(!document.querySelector('a[href*="https://greasyfork.org/"][href*="scripts/"]')) return;

        keys.add(evt.code);

    if(evt.key !== 'Shift') return;

    if(tmpLinks.length>0) return;

    if(!isCssAdded){
      isCssAdded = true;
      document.head.appendChild(document.createElement('style')).textContent = `

      .kds1e-div{
        cursor: pointer !important;
        display: inline-flex !important;
        min-width: calc(1rem + 4px) !important;
        min-height: initial !important;
        max-width: initial !important;
        max-height: initial !important;
        margin: 0 !important;
        padding: 0 !important;
        background-color: white !important;
        background-image: url("${svgFileWhite}") !important;
        background-repeat: no-repeat !important;
        background-size: contain !important;
        background-position: center !important;
        position: absolute !important;
        z-index: 999999 !important;
        user-select: none !important;
        filter: drop-shadow(1px 1px 3px rgba(0, 0, 0, 0.5)) !important;
      }

      [dark] .kds1e-div{

        background-color: black !important;
        background-image: url("${svgFileBlack}") !important;
      }


      .kds1e-hover {
          color: #d5e4f4 !important;
          background-color: #d42b14 !important;
      }

      `
    }


    let links = document.querySelectorAll('a[href*="https://greasyfork.org/"][href*="scripts/"]');

    for(const link of links){
      const div = document.createElement('div');
      div.classList.add('kds1e-div');
      div.setAttribute('data-control-link', link.getAttribute('href'));
      div.addEventListener('mouseenter', divMouseEnter, false);
      div.addEventListener('mouseleave', divMouseLeave, false);
      div.addEventListener('click', divClick, false);
      div.appendChild(document.createElement('a')).textContent='\u200B';
      tmpLinks.push(div);
      link.parentNode.insertBefore(div, link.nextSibling);
    }


  }

  function onKeyUp(evt){
    if(keys.size > 0){
          keys.delete(evt.code);
    if(keys.size === 0){
      if(tmpLinks.length===0) return;
      for(const s of document.querySelectorAll('.kds1e-hover')) s.classList.remove('kds1e-hover')

      for(const link of tmpLinks) link.remove();
      tmpLinks.length=0;
    }
    }

  }

  let mz = 0;
    document.addEventListener("visibilitychange", () => {

      if(keys.size>0 || tmpLinks.length>0){

        if(!mz){
        mz=1;
        window.requestAnimationFrame(()=>{

          mz = 0;
          keys.clear();
          for(const s of document.querySelectorAll('.kds1e-hover')) s.classList.remove('kds1e-hover')

          for(const link of tmpLinks) link.remove();
          tmpLinks.length=0;

        })
        }


      }

  }, false);

  document.addEventListener('keydown', onKeyDown, true);
  document.addEventListener('keyup', onKeyUp, true);

})();
