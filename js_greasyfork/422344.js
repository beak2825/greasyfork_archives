// ==UserScript==
// @name        Ente
// @namespace   meyerk.com
// @match       *://*/*
// @grant       none
// @version     0.6
// @author      MeyerK
// @description Übersetze ausgewählte englische Worte nach Deutsch mit dict.cc.
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/422344/Ente.user.js
// @updateURL https://update.greasyfork.org/scripts/422344/Ente.meta.js
// ==/UserScript==

class ente
{
  
  constructor()
  {
    this.rightAltKeyIsOn = false;
    this.isVisible = false;
    this.frame = document.createElement('iframe');      
    this.width = 300;
  }
  
  setup()
  {
    this.frame.id = 'enteFrame';
    this.frame.style.position = 'fixed';
    this.frame.style.top = '10px';
    this.frame.style.width = this.width+'px';
    this.frame.style.padding = '5px';
    this.frame.style.height = '100px';
    this.frame.style.border = '1px solid blue';
    this.frame.style.backgroundColor = 'aliceblue';
    this.frame.style.display = 'none';
    this.frame.style.borderRadius = '5px';
    this.frame.style.zIndex = '2147483646';
        
    document.getElementsByTagName('body')[0].appendChild(this.frame);
  }
  
  handleKeys(ev)
  {     
    if (this.rightAltKeyIsOn)
    {
      if (ev.code == 'KeyU')
      {
        let text = window.getSelection().toString();
        this.frame.src = "//syn.dict.cc/dcc-gadget.php?s=" + encodeURIComponent(text);
        this.show();
        
        return false;
      }
    }
    
    if (ev.code == 'AltRight')
    {
      this.rightAltKeyIsOn = (ev.type == 'keydown') ? true : false; 
    }    
  }

  handleMouse(ev)
  {
    if (this.isVisible)
    {      
      this.hide();    
      
      ev.preventDefault();
      return false;
    }    
  }
  
  show()
  {
    let leftPos = parseInt(window.innerWidth / 2) - parseInt(this.width / 2);    
    this.frame.style.left = leftPos+'px';    
    this.frame.style.display = 'block';
    this.isVisible = true;    
  }
  
  hide()
  {
    this.frame.style.display = 'none';
    this.isVisible = false;
  }
    
}

var en2de = new ente();
en2de.setup();
document.addEventListener('keydown', en2de.handleKeys.bind(en2de));
document.addEventListener('keyup',   en2de.handleKeys.bind(en2de));
document.addEventListener('click',   en2de.handleMouse.bind(en2de));