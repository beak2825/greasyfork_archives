// ==UserScript==
// @name           Amazon Pivot - amazon.de
// @name:de        Amazon Hochkant - amazon.de
// @namespace      meyerk.com
// @match          https://*.amazon.*/*
// @grant          none
// @version        1.6
// @author         MeyerK
// @description    On click enlarges the amamzon search bar in portrait mode
// @description:de Vergrößert auf Klick die Suchleiste im Portät Modus (Desktop)
// @runat          document-end
// @downloadURL https://update.greasyfork.org/scripts/402995/Amazon%20Pivot%20-%20amazonde.user.js
// @updateURL https://update.greasyfork.org/scripts/402995/Amazon%20Pivot%20-%20amazonde.meta.js
// ==/UserScript==


class AmazonPivot
{
  constructor()
  {
    this.ttstb = null;
    this.navSearch = null;
    this.navSearchStyle = null;
  }
  
  init()
  {
    this.ttstb = document.getElementById('twotabsearchtextbox');
    this.navSearch = document.getElementById('nav-search');
    this.navSearchStyle = this.navSearch.style;
    
    this.ttstb.addEventListener('focus', this.scaleUp.bind(this));
    this.ttstb.addEventListener('blur', this.scaleDown.bind(this));
    document.addEventListener('keyup', this.handleEsc.bind(this));
  }
  
  handleEsc(ev)
  {
    if (ev.key === "Escape")
    {
      this.scaleDown();
    }
  }
  
  scaleUp()
  {
    this.navSearchStyle.position = 'fixed';
    this.navSearchStyle.left = '10px';
    this.navSearchStyle.right = '10px';
    this.navSearchStyle.zIndex = 100000000000;
  }
  
  scaleDown()
  {
    this.navSearchStyle.position = '';
    this.navSearchStyle.left = '';
    this.navSearchStyle.right = ''; 
    this.navSearchStyle.zIndex = '';    
  }
}

let ap = new AmazonPivot()
ap.init();