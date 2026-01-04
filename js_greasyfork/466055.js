// ==UserScript==
// @namespace    i2p.schimon.hashcode
// @exclude      *

// ==UserLibrary==
// @name         Hash Code
// @description  Javascript implementation of Java’s String.hashCode() method
// @author       wes (Manwe Security Consulting)
// @copyright    2010, wes
// @homepageURL  https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
// @license      MIT
// @version      1.0.0

// ==/UserScript==

// ==/UserLibrary==

// ==OpenUserJS==
// @author sjehuda
// ==/OpenUserJS==

String.prototype.hashCode = function(){
  let hash = 0;
  if (this.length == 0) return hash;
  for (let i = 0; i < this.length; i++) {
    let char = this.charCodeAt(i);
    hash = ((hash<<5)-hash)+char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};
