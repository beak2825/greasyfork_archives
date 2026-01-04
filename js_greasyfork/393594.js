// ==UserScript==
// @name     Google Slides - Offline Presentation
// @description It allows you to save a Google Slides presentation as a working html file using the browser's "complete webpage save" feature
// @version  1
// @grant    none
// @include  https://docs.google.com/presentation/d/e/*/pub*
// @include  https://docs.google.com/presentation/d/*/present*
// @namespace https://greasyfork.org/users/396351
// @downloadURL https://update.greasyfork.org/scripts/393594/Google%20Slides%20-%20Offline%20Presentation.user.js
// @updateURL https://update.greasyfork.org/scripts/393594/Google%20Slides%20-%20Offline%20Presentation.meta.js
// ==/UserScript==

// Utils
const loadImage = src => {
  const img = document.createElement('img');
	img.src = src;
	img.style.display = 'none';
  document.body.appendChild(img);
}
const getFilename = path => path.split('/').slice(-1)[0];

// Load slide images as img tags so that they're saved
const viewerData = window.eval('viewerData');
[].concat.apply(this, viewerData.docData[1]).filter(a => Array.isArray(a) && a.length > 0).flatMap(a => a).filter(h => h.startsWith && h.startsWith('https')).forEach(async h => {
  loadImage(h);

  const scripts = Array.from(document.querySelectorAll('script'));
  const svgs = scripts.filter(s => s.innerHTML.startsWith('SK_svgData'));
  const type = await fetch(h, {method: 'HEAD'}).then(r => r.headers.get('Content-Type').split('/')[1]);
  const local = `' + localStorage.getItem('loc') + '/${getFilename(h).substring(0, 60)}.${type.replace('jpeg', 'jpg')}`;
  const escapedLink = h.replace(/\//g, '\\/');
  svgs.forEach(s => s.innerHTML = s.innerHTML.replace(escapedLink, local));

  const vdScript = scripts.filter(s => s.innerHTML.includes('var viewerData'))[0];
  vdScript.innerHTML = vdScript.innerHTML.replace(new RegExp(h, 'g'), local.replace(/'/g, '"'));
});

// Load button images as img tags
const [viewerStyle, style, media] = Array.from(document.styleSheets[0].cssRules).filter(r => {
  return r.cssText.match(/punch_viewer_sprite|\/viewer-/) && r.cssText.includes('nav');
});
const mediaStyle = Array.from(media.cssRules).filter(r => r.cssText.includes('sprite'))[0];
const [viewer, sprite, mediaSprite] = [viewerStyle, style, mediaStyle].map(s => getFilename(s.style['background-image'].slice(4, -2)));

const staticImageURL = 'https://ssl.gstatic.com/docs/presentations/images/';
loadImage(staticImageURL + mediaSprite);
loadImage(staticImageURL + sprite);
loadImage(staticImageURL + viewer)

// Function whose source to load as a script tag
const source = () => {
  // Remove overlay
  document.addEventListener('DOMContentLoaded', (e) => {
    document.querySelectorAll('.punch-viewer-container')[1].parentNode.remove();
  });
  
  window.addEventListener('load', e => {
    if (!location.href.startsWith('file')) return;
    
    // Hack to find the location of the local file
    const loc = Array.from(document.querySelectorAll('link')).filter(l => l.rel == 'stylesheet')[0].getAttribute('href').split('/')[0];
    const prevLoc = localStorage.getItem('loc');
    if (!prevLoc || prevLoc != loc) {
      localStorage.setItem('loc', loc);
      location.reload();
    }
      
    //Fix main window styling
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML =` 
		.punch-viewer-nav-v2 .punch-viewer-nav-logo-image,
    .punch-viewer-nav-v2 .punch-viewer-icon,
    .punch-viewer-nav-v2 .punch-viewer-icon-large,
    .punch-viewer-nav-v2 .punch-viewer-laser-icon,
    .punch-viewer-nav-v2 .goog-flat-menu-button-dropdown,
    .punch-viewer-body-v2 .goog-option-selected .goog-menuitem-checkbox,
    .punch-viewer-body-v2 .punch-viewer-menuitem-skippedslide .goog-menuitem-checkbox,
    .lmwd-dialog .punch-viewer-icon,
    .lmwd-dialog .punch-viewer-icon-large {
     background-image:url(${loc}/${sprite})
    }
                         
		@media screen and (min-resolution:2dppx),(-webkit-min-device-pixel-ratio:2) {
      .punch-viewer-nav-v2 .punch-viewer-nav-logo-image,
       .punch-viewer-nav-v2 .punch-viewer-icon,
       .punch-viewer-nav-v2 .punch-viewer-icon-large,
       .punch-viewer-nav-v2 .punch-viewer-laser-icon,
       .punch-viewer-nav-v2 .goog-flat-menu-button-dropdown,
       .punch-viewer-body-v2 .goog-option-selected .goog-menuitem-checkbox,
       .punch-viewer-body-v2 .punch-viewer-menuitem-skippedslide .goog-menuitem-checkbox,
       .lmwd-dialog .punch-viewer-icon,
       .lmwd-dialog .punch-viewer-icon-large {
          background-image:url(${loc}/${mediaSprite});
      }
		}

    `;
    document.head.appendChild(style);
    
		// Fix speaker notes window styling
    window._open = window.open;
    window.open = function(){
      const win = window._open.apply(this, arguments);
      const $ = (selector) => win.document.querySelector(selector);
  		
      const link = document.querySelector('link[href*=viewer_css_ltr]').cloneNode();
      win.document._write = win.document.write;
      win.document.write = function() {
        const val = win.document._write.apply(this, arguments);
				win.document.head.appendChild(link);
      
        setTimeout(() => {
          const sidePanelLength = 331;
          const dragger = '.punch-viewer-speakernotes-dragger';
          const drag = () => {
            const rect = $(dragger).getBoundingClientRect();
            const evArgs = { buttons:1, clientX: rect.x + rect.width/2, clientY: 100, bubbles: true };
            const mouse = (selector, type, args) => $(selector).dispatchEvent(new MouseEvent('mouse' + type, args));
            mouse(dragger, 'down', evArgs);
            mouse('.punch-viewer-speakernotes-text-body-scrollable', 'move', {...evArgs, clientX: sidePanelLength, movementX: 1});
            mouse('.punch-viewer-speakernotes-dragger', 'up', {...evArgs, clientX: sidePanelLength});
          }
          drag(); drag();

          Array.from(win.document.querySelectorAll('.punch-viewer-speakernotes-page-iframe')).forEach(i => {
            i.contentDocument.head.appendChild(link.cloneNode());
          });

          $('#punch-viewer-speakernotes').addEventListener('mousemove', e => {
            const currentSidePanelLength = parseInt($('.punch-viewer-speakernotes-side-panel').style.width.slice(0, -2));
            if(e.buttons == 1 && (e.movementX <= 0 &&  currentSidePanelLength <= sidePanelLength || e.clientX <= sidePanelLength)) {
              e.stopPropagation();
            }
          }, true);


          const style = win.document.createElement('style');
          style.type = 'text/css';
          style.innerHTML = `
          .punch-viewer-nav-logo-image,
          .punch-viewer-icon,
          .punch-viewer-icon-large,
          .punch-viewer-laser-icon,
          .punch-viewer-nav .goog-flat-menu-button-dropdown {
            background-image:url(${win.localStorage.getItem('loc')}/${viewer})
          }
          `;
          win.document.head.appendChild(style);
        }, 500);
        return val;
      }
      return win;
    }
  });
}

const extractVariables = vars => Object.keys(vars).map(name => {
  return `${name} = ${vars[name].toSource()}`;
}).join(';') + ';';

const script = document.createElement('script');
script.type = 'text/javascript';
const scriptSource = source.toSource().split('\n').slice(1, -1).join('\n')
script.innerHTML = extractVariables({viewer, sprite, mediaSprite}) + scriptSource;
document.body.appendChild(script);
