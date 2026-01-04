// ==UserScript==
// @name        Image Alt to Title
// @namespace   myfonj
// @include     *
// @grant       none
// @version     1.10.0
// @run-at      document-start
// @description Hover tooltip of image displaying alt attribute, original title, some accessibility-related properties, and URL info.
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @license     CC0
// @downloadURL https://update.greasyfork.org/scripts/418348/Image%20Alt%20to%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/418348/Image%20Alt%20to%20Title.meta.js
// ==/UserScript==
/*
 * https://greasyfork.org/en/scripts/418348/versions/new
 *
 * Changelog:
 * 1.10.0 (2024-12-02): Adding titles to SVG now only behind pref (toggle in menu).
 * 1.9.2 (2024-11-04): Another fix for SVG titles. Titled SVG (non-root) elements still take precedence over ours "view source" amendments.
 * 1.9.1 (2024-11-04): Fix for SVG source overshadowing parent (possibly HTML) title.
 * 1.9.0 (2024-10-31): SVG source to its title. Crude, but how I needed this, goddamit!
 * 1.8.9 (2024-01-24): better optical formatting of location search (URLSearchParams)
 * 1.8.8 (2023-09-12): no "none" background, further tab stop adjustments
 * 1.8.7 (2023-09-11): unified tab stop across devices (hopefuly)
 * 1.8.6 (2023-09-04): values separated by tab stops from labels
 * 1.8.5 (2023-09-04): for multiline string, break them below label, so the first line aligns with rest
 * 1.8.4 (2022-11-04): trim long strings
 * 1.8.3 (2022-11-02): ~ minor, omit empty filename from info.
 * 1.8.2 (2022-10-23): ~ minor, bail out from image-only page also in Chrome / Edge.
 * 1.8.1 (2022-10-19): ~ minor text corrections.
 * 1.8.0 (2022-10-18): + 'generator-unable-to-provide-required-alt' https://html.spec.whatwg.org/multipage/images.html#guidance-for-markup-generators.
 *
 * § Trivia:
 * ¶ Hover tooltip displays content of nearest element's title attribute (@title).
 * ¶ Alt attribute (@alt) is possible only at IMG element.
 * ¶ IMG@alt is not displayed in tooltip.
 * ¶ IMG cannot have children.
 * ¶ @title is possible on any element, including IMG.
 * ¶ IMG@src is also valuable.
 *
 * Goal:
 * Display image alt attribute value in images hover tooltip, add valuable @SRC chunks.
 *
 * Details
 * Pull @alt from image and set it so it is readable as @title tooltip
 * so that produced title value will not obscure existing parent title
 * that would be displayed otherwise.  Also include image filename from @src,
 * and additionally path or domain.
 *
 * Means
 * Upon "hover" set image's title attribute. Luckily tooltips delay catches augmented value.
 *
 * § Tastcases
 *
 * FROM:
 * <a>
 *  <img>
 * </a>
 * TO:
 * <a>
 *  <img title="Alt missing.">
 * </a>
 *
 * FROM:
 * <a>
 *  <img alt="">
 * </a>
 * TO:
 * <a>
 *  <img alt="" title="Alt: ''">
 * </a>
 *
 * FROM:
 * <a>
 *  <img alt="░">
 * </a>
 * TO:
 * <a>
 *  <img alt="░" title="Alt: ░">
 * </a>
 *
 * FROM:
 * <a>
 *  <img alt="░" title="▒">
 * </a>
 * TO:
 * <a>
 *  <img title="Alt: ░, title: ▒">
 * </a>

 * FROM:
 * <a title="▒">
 *  <img alt="░">
 * </a>
 * TO:
 * <a>
 *  <img title="Alt: ░, title: ▒">
 * </a>
 *
 */

const DEFAULT_PREFS = {
    includesSvg: false,
};
let menuCommandId;

function getPrefs() {
    const savedPrefs = GM_getValue('scriptPrefs');
    return savedPrefs ? JSON.parse(savedPrefs) : DEFAULT_PREFS;
}
function savePrefs(prefs) {
    GM_setValue('scriptPrefs', JSON.stringify(prefs));
}

// Function to update menu command
function updateMenuCommand() {
    const prefs = getPrefs();
    const commandText = prefs.includesSvg ? 'Exclude SVG Elements' : 'Include SVG Elements';
    if (menuCommandId) {
        GM_unregisterMenuCommand(menuCommandId);
    }
    menuCommandId = GM_registerMenuCommand(commandText, toggleSvgProcessing);
}
function toggleSvgProcessing() {
    const prefs = getPrefs();
    prefs.includesSvg = !prefs.includesSvg;
    savePrefs(prefs);
    updateMenuCommand();
}
updateMenuCommand();

// do not run at image-only pages
// Firefox is adding alt same as location
if (
  document.querySelector(`body > img[src="${document.location.href}"]:only-child`)
) {
  // @ts-ignore (GreaseMonkey script is in fact function body)
  return
}

const originalTitles = new WeakMap();
const amendedSVG = new WeakMap();

let lastSetTitle = '';
const docEl = document.documentElement;
const listenerConf = { capture: true, passive: true };

docEl.addEventListener('mouseenter', altToTitle, listenerConf);
docEl.addEventListener('mouseleave', restoreTitle, listenerConf);

const hoverLoadHandlerConf = { passive: true, once: false, capture: true };
function hoverLoadHandler (event) {
  const tgt = event.target;
  // console.log('load', tgt)
  altPic(tgt, 'prepend');
}


function altToTitle (event) {
  const tgt = event.target;
  const tag = tgt.tagName;
  if(!tag) {
    return
  }
  if(getPrefs().includesSvg && (tgt.namespaceURI === 'http://www.w3.org/2000/svg')){
    const origTitle = getClosestTitle(tgt);
    const s = tgt.closest('svg');
    if(amendedSVG.has(s)) {
      return
    }
    let st = s.querySelector('& > title');
    // FIXME: add handling for nested titled SVG elements
    // not clear how exactly: to always show the full source
    // wou would have to temp-remove title elements a hoist
    // their text to our root constructed.
    let origSource = s.outerHTML;
    if( st  ) {
      amendedSVG.set(s,st.textContent);
    } else {
      amendedSVG.set(s,null);
      st = s.appendChild(
        document.createElementNS(
          'http://www.w3.org/2000/svg',
          'title'
        )
      );
    }
    if(origTitle){
      origSource = origTitle + '\n\n---\n\n' + origSource
    }
    st.textContent = origSource;
    return
  }
  if (tag == 'IMG') {
    if (originalTitles.has(tgt) || (tgt.title && tgt.title === lastSetTitle)) {
      // few times I got situations when mouseout was not triggered
      // presumably because something covered the image
      // or whole context was temporarily replaced or covered
      // or perhaps it was reconstructed from dirty snapshot
      // so this should prevent exponentially growing title
      return
    }
    tgt.addEventListener('load', hoverLoadHandler, hoverLoadHandlerConf);
    originalTitles.set(tgt, tgt.getAttribute('title'));
    altPic(tgt);
  }

}

function restoreTitle (event) {
  const tgt = event.target;
  if(tgt.namespaceURI==='http://www.w3.org/2000/svg'){
    const s = tgt.closest('svg');
    if(amendedSVG.has(s)) {
      const ot = amendedSVG.get(s);
      const te = s.querySelector('& > title');
      if(ot) {
        te.textContent = ot;
      } else {
        te.remove();
      }
      amendedSVG.delete(s);
    }
    return
  }

  if (originalTitles.has(tgt)) {
    let ot = originalTitles.get(tgt);
    if (ot === null) {
      tgt.removeAttribute('title');
    } else {
      tgt.title = ot;
    }
    originalTitles.delete(tgt);
  }
  tgt.removeEventListener('load', hoverLoadHandler, hoverLoadHandlerConf);
}


/**
 * @param {HTMLImageElement} img
 * @param {'prepend'} [mode]
 */
function altPic (img, mode) {
  // console.log('altPic', mode);
  try {
    let titleToAppend = '';
    if (mode == 'prepend') {
      titleToAppend = img.title;
      if (titleToAppend == lastSetTitle) {
        img.removeAttribute('title');
      }
    }
    const separator = '---';
    const info = [];
    const alt = img.getAttribute('alt');
    let altText = alt || '';
    const title = getClosestTitle(img);
    const role = img.getAttribute('role');
    const isPresentation = role === 'presentation';

    if (role) {
      info.push('Role:\t' + role);
    }

    switch (alt) {
      case null:
        info.push(isPresentation ? `(Alt missing but not needed for this role.)` : `⚠ Alt missing`);
        break;
      case '':
        info.push(`Alt: ""`);
        break;
      default:
        if (alt != alt.trim()) {
          // "quote" characters are generally useful only to reveal leading/trailing whitespace
          altText = `»${alt}«`;
        }
        if (alt == title) {
          info.push(`Alt (=title):\t${altText}`);
        } else {
          // break first line below "Alt:" label when alt also contains breaks.
          if(altText.includes('\n')){
            altText = '\n' + altText;
          }
          info.push(`Alt:\t${altText}`);
        }
    }

    // https://html.spec.whatwg.org/multipage/images.html#guidance-for-markup-generators
    const gutpra = img.getAttribute('generator-unable-to-provide-required-alt');
    if (gutpra !== null) {
       info.push(separator);
       info.push('generator-unable-to-provide-required-alt');
    }

    if (title && alt != title) {
      info.push(separator);
      info.push('Title:\t' + title);
    }

    const descby = img.getAttribute('aria-describedby');
    if (descby) {
      info.push(separator);
      info.push('Described by (ARIA)`' + descby + '`:\t' + (document.getElementById(descby) || { textContent: '(element not found)' }).textContent);
    }

    // deprecated, but let's see
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/longDesc
    // https://www.stylemanual.gov.au/format-writing-and-structure/content-formats/images/alt-text-captions-and-titles-images
    const longdesc = img.getAttribute('longdesc');
    if (longdesc) {
      info.push(separator);
      info.push('Long Description (deprecated):\t' + longdesc);
    }

    const arialabel = img.getAttribute('aria-label');
    if (arialabel) {
      info.push(separator);
      info.push('Label (ARIA):\t' + arialabel);
    }

    // https://html5accessibility.com/stuff/2021/02/09/aria-description-by-public-demand-and-to-thunderous-applause/
    const histeve = img.getAttribute('aria-description');
    if (histeve) {
      info.push(separator);
      info.push('Description (ARIA):\t' + histeve);
    }

    var fig = img.closest('FIGURE');
    if (fig) {
      let capt = fig.querySelector('figcaption');
      if (capt && capt.textContent) {
        info.push(separator);
        info.push('Caption:\t' + capt.textContent.trim());
      }
    }

    info.push(separator);

    const srcURI = new URL(img.currentSrc || img.src, img.baseURI);
    const slugRx = /[^/]+$/;
    switch (srcURI.protocol) {
      case 'http:':
      case 'https:': {
        if (srcURI.hash) {
          info.push('Hash:\t' + trimString(decodeURIComponent(srcURI.hash)));
        }
        if (srcURI.search) {
          info.push('Search Params:\t' + formatParams(srcURI.search));
        }
        let filename = srcURI.pathname.match(slugRx);
        if (filename) {
          info.push('File:\t' + trimString(decodeURIComponent(String(filename))));
        }
        let path = srcURI.pathname.replace(slugRx, '');
        if (path && path != '/') {
          info.push('Path:\t' + trimString(decodeURIComponent(srcURI.pathname.replace(slugRx, ''))));
        }
        if (document.location.hostname != srcURI.hostname || window != window.top) {
          info.push('Host:\t' + trimString(srcURI.hostname));
        }
        break;
      }
      case 'data:': {
        info.push(trimString(srcURI.href));
        break;
      }
      default:
        info.push('Src:\t' + trimString(srcURI.href));
    }
    // ↔ ↕
    var CSSsizes = `${img.width} × ${img.height} CSSpx${findRatio(img.width, img.height)}`;
    var _width_ratio, _height_ratio;
    if (img.naturalWidth && img.naturalHeight) {
      // SVG have zero naturals
      if (img.naturalWidth == img.width && img.naturalHeight == img.height) {
        CSSsizes += ` (Natural)`;
      } else {
        _width_ratio = '~' + (img.width / img.naturalWidth * 100).toFixed(0) + '% of ';
        _height_ratio = '~' + (img.height / img.naturalHeight * 100).toFixed(0) + '% of ';
        if (_height_ratio == _width_ratio) {
          _height_ratio = '';
        }
        CSSsizes += ` (${_width_ratio}${img.naturalWidth} × ${_height_ratio}${img.naturalHeight} natural px${findRatio(img.naturalWidth, img.naturalHeight)})`;
      }
    }
    info.push('Size:\t' + CSSsizes);
    const cs = getComputedStyle(img);
    if (cs.backgroundImage && cs.backgroundImage != 'none') {
      info.push(separator);
      info.push('Background:\t' + cs.backgroundImage);
    }
    // unified tab stop across devices (hopefuly)
    // hotfix for label length and tab widths
    // add bunch of spaces to get uniform lengths
    // to tab aligns values in all browsers
    // (each value has the label at the begining, or not at all)
    const labelRgx = /^([A-Z].*?:)(\t)/;
    const longestLength = 3 + info.reduce((acc,msg)=>{
      if(!msg.startsWith('Background:\t') && labelRgx.test(msg)) {
        const l = msg.match(labelRgx)[1].length;
        if( acc < l ) {
          acc = l;
        }
      };
      return(acc);
    },0);
    const finalTitle = info.map(msg=>{
      if(labelRgx.test(msg)) {
        return msg.replace(labelRgx,(m0, m1, m2)=>{
          return m1.padEnd(longestLength, '\u2002') + m2
        });
      };
      return msg;
    }).join('\n');
    img.title = finalTitle;
    if (titleToAppend && (finalTitle != titleToAppend)) {
      img.title += '\n\n-- Previously --\n\n'
        + titleToAppend;
    }
    lastSetTitle = img.title;
  } catch (e) {
    // console.error('altPic ERROR', e, img);
  }
}

/**
 * @param {HTMLElement|SVGElement} el
 */
function getClosestTitle (el) {
  let _ = el;
  do {
    let isSVG = _.namespaceURI === 'http://www.w3.org/2000/svg';
    if(isSVG){
      let svgTitle = _.querySelector('& > title');
      if(svgTitle) {
        return svgTitle.textContent;
      }
    } else {
      if (_.title) {
        return _.title;
      }
    }
  } while (_.parentElement && (_ = _.parentElement));
  return ''
}

function findRatio (x, y) {
  var smallest = Math.min(x, y);
  var n = 0;
  var res = n;
  while (++n <= smallest) {
    if (x % n == 0 && y % n == 0) res = n;
  }
  if (res == 1) {
    return ''
  }
  return ' [' + x / res + ':' + y / res + ']'
}

function trimString (str) {
  const limit = 524;
  if(str.length < limit) {
    return str;
  }
  return str.slice(0, limit) + ' (…+ '+ (str.length - limit) + ' characters)';
}

function formatParams(search) {
	let result = [];
	for ( const [k, v] of new URLSearchParams(search) ) {
		result.push(trimString(`${k}${v?`\t=\t${v}`:``}`))
	}
  if( result.length === 1) {
    return result
  } else if (result.length > 1){
    return '\n' + result.map(_=>`\t${_}`).join('\n')
  }
  return ''
}