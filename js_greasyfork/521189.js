// ==UserScript==
// @name Add-ons for 2014-esque ROBLOX by melongirl April 2015 ROBLOX
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description Add On for 2014esque ROBLOX by melongirl April 2015
// @author ME
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/521189/Add-ons%20for%202014-esque%20ROBLOX%20by%20melongirl%20April%202015%20ROBLOX.user.js
// @updateURL https://update.greasyfork.org/scripts/521189/Add-ons%20for%202014-esque%20ROBLOX%20by%20melongirl%20April%202015%20ROBLOX.meta.js
// ==/UserScript==

(function() {
let css = `#catalog-react-page .catalog-content .radio input[type="radio"] + label::before {
  display: inline-block;
  position: absolute;
  width: 15.9px;
  height: 16.0px;
  left: -2px;
  margin-top: -00px;
  border: 2.3px solid #908f9d ;
  border-radius: 2px;
  background-color: #fff !important;
  cursor: pointer;
}

#catalog-react-page .catalog-content .radio input[type="radio"] + label:hover::before {
  display: inline-block;
  position: absolute;
  width: 15.9px;
  height: 16.0px;
  left: -2px;
  margin-top: -00px;
  border: 2.3px solid #676674 ;
  border-radius: 2px;
  background-color: #fff !important;
  cursor: pointer;
}

.radio input[type="radio"] + label::after, .radio input[type="radio"]:checked + label::after {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAMAAABFNRROAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAIpQTFRFAAAA5O786vL81eX6pcf09vn+////5e/8r8319Pj+/f7/6/L81uX55u/70+P57PP9+fv+1uX66fH88/f9tdH10uP5/v7/8Pb9fq/v9fn+4e37vNX35O77/f7/0+P5wNj37/X98/j+9/r+0OL54+77/f7/6PH8osXz1+b69Pj++fv+2uj6ttL2wNj3FQzucAAAAC50Uk5TAFC/SCj3/3gg298kEBgIr/dQj9MQk/9cDL/LFGD/qyDn56cILO/bGET70xg4GD1Ifk4AAABoSURBVHicY2RABowIFiPjXziPBcj7CeNxMP5lYfzKyMDD+JmBgY/xOxfje6A+IUbGNwyijB8EXwL1SjC+FQFp4XgENlOe8Zn0n5cyjHchNqgwPmRQYLwJs08DqPIqwnYdxsvobsHkAQDihxUO9ZsxBwAAAABJRU5ErkJggg==);
display: inline-block;
  position: absolute;
  width: 15.9px;
  height: 16.0px;
  left: -2px;
  margin-top: -3px;
  border: 2px solid #0160e0 ;
  border-radius: 2px;
  background-color: #0160e0 !important;
  cursor: pointer;
}

.radio input[type="radio"] + label:hover::after, .radio input[type="radio"]:checked + label:hover::after {
  display: inline-block;
  position: absolute;
  width: 15.9px;
  height: 16.0px;
  left: -2px;
  margin-top: -3px;
  border: 2px solid #2375ff ;
  border-radius: 2px;
  background-color: #2375ff !important;
  cursor: pointer;
}


.catalog-content .search-options .radio {
  padding-left: 1.0px;
}

.c{
visibility: hidden!important;
}

#radio-creator-0 {
visibility: hidden!important;
}

#radio-creator-custom {
visibility: hidden!important;
}

#radio-price-3 {
visibility: hidden!important;
}

#radio-price-0 {
visibility: hidden!important;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
