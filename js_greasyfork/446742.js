// ==UserScript==
// @name Anti key and mouse hijacking on sites
// @description Prevent web apps from capturing and muting vital keyboard shortcuts. This will break some sites so use it on case by case situation.
// @author        Someone
// @version       1.8.9
// @grant         GM_registerMenuCommand
// @license       BSD
// @include     *example.com*
// @namespace https://greasyfork.org/users/927418
// @downloadURL https://update.greasyfork.org/scripts/446742/Anti%20key%20and%20mouse%20hijacking%20on%20sites.user.js
// @updateURL https://update.greasyfork.org/scripts/446742/Anti%20key%20and%20mouse%20hijacking%20on%20sites.meta.js
// ==/UserScript==

//Right Click
window.pointers = window.pointers || {
  run: new Set(),
  scripts: new Set(),
  cache: new Map(),
  status: ''
};

window.pointers.record = (e, name, value) => {
  window.pointers.cache.set(e, {name, value});
};

window.pointers.inject = code => {
  const script = document.createElement('script');
  script.textContent = 'document.currentScript.dataset.injected = true;' + code;
  document.documentElement.appendChild(script);
  script.remove();
  if (script.dataset.injected !== 'true') {
    const s = document.createElement('script');
    s.src = 'data:text/javascript;charset=utf-8;base64,' + btoa(code);
    s.onload = () => s.remove();
    document.documentElement.appendChild(s);

    window.pointers.scripts.add(s);
    return s;
  }
  else {
    window.pointers.scripts.add(script);
    return script;
  }
};


// allow context-menu
window.pointers.inject(`
  try {
    const ogs = {
      removed: false,
      misc: {}
    };

    // alert
    ogs.misc.alert = window.alert;
    Object.defineProperty(window, 'alert', {
      get() {
        return ogs.removed ? ogs.misc.alert : (...args) => console.log('[alert is blocked]', ...args);
      },
      set(c) {
        ogs.misc.alert ||= c;
      }
    });

    // unblock contextmenu and more
    ogs.misc.mp = MouseEvent.prototype.preventDefault;
    Object.defineProperty(MouseEvent.prototype, 'preventDefault', {
      get() {
        return ogs.removed ? ogs.misc.mp : () => {};
      },
      set(c) {
        console.log('a try to overwrite "preventDefault"', c);
        ogs.misc.mp ||= c;
      }
    });
    Object.defineProperty(MouseEvent.prototype, 'returnValue', {
      get() {
        return ogs.removed && 'v' in this ? this.v : true;
      },
      set(c) {
        console.log('a try to overwrite "returnValue"', c);
        this.v = c;
      }
    });

    ogs.misc.cp = ClipboardEvent.prototype.preventDefault;
    Object.defineProperty(ClipboardEvent.prototype, 'preventDefault', {
      get() {
        return ogs.removed ? ogs.misc.cp : () => {};
      },
      set(c) {
        ogs.misc.cp ||= c;
      }
    });

    document.currentScript.addEventListener('remove', () => ogs.removed = true);
    document.currentScript.addEventListener('install', () => ogs.removed = false);
  }
  catch (e) {}
`);


{
  const skip = e => e.stopPropagation();
  // bypass all registered listeners
  document.addEventListener('dragstart', skip, true);
  document.addEventListener('selectstart', skip, true);
  document.addEventListener('copy', skip, true);
  document.addEventListener('paste', skip, true);
  document.addEventListener('contextmenu', skip, true);
  document.addEventListener('mousedown', skip, true);

  window.pointers.run.add(() => {
    document.removeEventListener('dragstart', skip, true);
    document.removeEventListener('selectstart', skip, true);
    document.removeEventListener('copy', skip, true);
    document.removeEventListener('paste', skip, true);
    document.removeEventListener('contextmenu', skip, true);
    document.removeEventListener('mousedown', skip, true);
  });
}





function handler(e){
	if(e.button == 1 || (e.button == 0 && e.ctrlKey)){
		e.stopPropagation();
	}
}

function handler(e){
	if(e.button == 1 || (e.button == 0 && e.AltlKey)){
		e.stopPropagation();
	}
}
 
addEventListener('click', handler, true);
addEventListener('mousedown', handler, true);
addEventListener('mouseup', handler, true);



document.addEventListener("click", function(e){
    if (e.button === 1 || e.button === 2){
        e.stopPropagation();
    }
}, true);


ctrlkeycodes = [70, 78, 82, 83, 84];  
keycodes = [70, 76, 78, 82, 83, 84];  
 
 
(window.opera ? document.body : document).addEventListener('keydown', function(e) {
reclaim_all = false; // Turn this to true to kill ALL keyboard shortcuts
allow = true;
 
    if (keycodes.indexOf(e.keyCode) != -1)
    {
        allow = false;
    }
    
    if(ctrlkeycodes.indexOf(e.keyCode) != -1 && e.ctrlKey)
    {
        allow = false;
    }
    
    if (reclaim_all  || (! allow))
    {
        e.cancelBubble = true;
        e.stopImmediatePropagation();
    
    }
    return false;
}, !window.opera);