// ==UserScript==
// @name        Enhance
// @namespace   meyerk.com
// @match       *://*/*
// @grant       none
// @version     1.6
// @author      MeyerK
// @description Enlarge all p-Tags on a page with AltGr+p, reduce with AltGr+l, reset with AltGr-o. ALtGr+b sets all p-Tags to have black text and a white background. AltGr+m tries to apply some styles that should make any page look better.
// @downloadURL https://update.greasyfork.org/scripts/403477/Enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/403477/Enhance.meta.js
// ==/UserScript==

class enhance
{
  constructor()
  {
    this.rightAltKeyIsOn = false;
    this.zoomInc = 3;
    this.currentZoomStep = 0;
    this.maxZoomSteps = 7;
  }

  toggleAltGr(ev)
  {
    if (ev.code == 'AltRight')
    {
      this.rightAltKeyIsOn = (ev.type == 'keydown') ? true : false;
    }
  }

  do(ev)
  {
    if (this.rightAltKeyIsOn)
    {
      if (ev.code == 'KeyP')
      {
        if (this.currentZoomStep < this.maxZoomSteps)
        {
          this.currentZoomStep = this.currentZoomStep + 1;
          this.setFontSize('inc');
        }
        else
        {
          this.currentZoomStep = this.maxZoomSteps;
        }
      }

      if (ev.code == 'KeyL')
      {
        if (this.currentZoomStep > 0)
        {
          this.currentZoomStep = this.currentZoomStep - 1;
          this.setFontSize('dec');
        }
        else
        {
          this.currentZoomStep = 0;
        }
      }

      if (ev.code == 'KeyO')
      {
        this.currentZoomStep = 0;
        this.resetFontSize();
      }

      if (ev.code == 'KeyB')
      {
        this.setPropertyOfPs('color', 'black');
        this.setPropertyOfPs('backgroundColor', 'white');
      }

      if (ev.code == 'KeyM')
      {
        let htmlEl = document.getElementsByTagName('html')[0];
        if (htmlEl.style.maxWidth != "70ch")
        {
          htmlEl.style.maxWidth = "70ch";
          htmlEl.style.padding = "3em 1em";
          htmlEl.style.margin = "auto";
          htmlEl.style.lineHeight = "1.75";
          htmlEl.style.fontSize = "1.25em";
        }
        else
        {
          htmlEl.style.maxWidth = "";
          htmlEl.style.padding = "";
          htmlEl.style.margin = "";
          htmlEl.style.lineHeight = "";
          htmlEl.style.fontSize = "";
        }
      }
    }
  }

  setFontSize(act)
  {
    let newSize = null;
    let currentSize = null;
    let pElems = document.querySelectorAll('p');

    pElems.forEach((pElem) =>
    {
      currentSize = parseInt(window.getComputedStyle(pElem).fontSize, 10);

      if (this.currentZoomStep == 0)
      {
        newSize = '';
      }
      else
      {
        if (act == 'inc')
        {
          newSize = (currentSize + this.zoomInc) + 'px';
        }
        else if (act == 'dec')
        {
          newSize = (currentSize - this.zoomInc) + 'px';
        }
      }

      pElem.style.fontSize = newSize;

    });
  }

  resetFontSize()
  {
    this.setPropertyOfPs('fontSize', '');
  }

  setPropertyOfPs(propName, val)
  {
    var i = 0;
    var pElems = null;

    pElems = document.querySelectorAll('p');
    pElems.forEach((pElem) =>
    {
      pElem.style[propName] = val;
    });
  }
}

var e = new enhance();
document.addEventListener('keydown', e.toggleAltGr.bind(e));
document.addEventListener('keyup',   e.toggleAltGr.bind(e));
document.addEventListener('keyup',   e.do.bind(e));