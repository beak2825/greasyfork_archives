// ==UserScript==
// @name     Comments Everywhere
// @version  6
// @grant    none
// @match    https://*/*
// @match    http://*/*
// @description Pissed about media outlets that choose on what news you can or not comment? No more, this script will put a small "C" button on all pages footers, upon clicking on it you'll gain the ability to comment and read comments from other people on any page!
// @namespace https://greasyfork.org/users/212682
// @downloadURL https://update.greasyfork.org/scripts/372176/Comments%20Everywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/372176/Comments%20Everywhere.meta.js
// ==/UserScript==

if(window!=window.top) return false;

// Holder
var cBox = document.createElement('div');
cBox.style = `display:none; z-index:9998; position:fixed; bottom:30px; left:1%; width:98%; overflow-y:scroll; background-color:white; height:400px; box-shadow: inset 0px 0px 5px 0px rgba(0,0,0,0.75); border-radius:5px; padding: 0px 15px 0px 15px; box-sizing: border-box;`;
document.body.appendChild(cBox);

var cBut = document.createElement('div');
cBut.style = `z-index:9999; position:fixed; bottom:5px; right:1%; cursor:pointer; background-color: #ddd; border-radius:5px; width:30px; text-align:center; border:1px solid gray; font-family: arial, sans-serif; font-size: 13px;`;
cBut.innerHTML = 'C';
document.body.appendChild(cBut);

cBut.onclick=(evt)=>
{
    if(cBox.style.display!='none') cBox.style.display='none';
    else { cBox.style.display='block';

          if(cBox.children.length!=0) return false;

          // htmlcommentbox
          cBox.innerHTML = `<div id="HCB_comment_box"><a href="http://www.htmlcommentbox.com">HTML Comment Box</a> is loading comments...</div><link rel="stylesheet" type="text/css" href="//www.htmlcommentbox.com/static/skins/simple/skin.css" />`;
          if(!window.hcb_user){hcb_user={};} (function(){var s=document.createElement("script"), l=hcb_user.PAGE || (""+window.location).replace(/'/g,"%27"), h="//www.htmlcommentbox.com";s.setAttribute("type","text/javascript");s.setAttribute("src", h+"/jread?page="+encodeURIComponent(l).replace("+","%2B")+"&opts=16862&num=50&ts=1536839262742");if (typeof s!="undefined") document.getElementsByTagName("head")[0].appendChild(s);})();
}
};
