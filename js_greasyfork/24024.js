// ==UserScript==
// @name        Mirkoplugin
// @namespace   http://localhost/
// @description Robi dobrze
// @include     http://www.wykop.pl/*
// @version     1
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/24024/Mirkoplugin.user.js
// @updateURL https://update.greasyfork.org/scripts/24024/Mirkoplugin.meta.js
// ==/UserScript==

var getClass = function(clssName, rootNode /*optional root node to start search from*/){

  var root = rootNode || document,
      clssEls = [],
      elems,
      clssReg = new RegExp("\\b"+clssName+"\\b");

  // use the built in getElementsByClassName if available
  if (document.getElementsByClassName){
    return root.getElementsByClassName(clssName);
  }
  
  // otherwise loop through all(*) nodes and add matches to clssEls
  elems = root.getElementsByTagName('*');
  for (var i = 0, len = elems.length; i < len; i+=1){
    if (clssReg.test(elems[i].className)) clssEls.push(elems[i])
  }

  return clssEls;
  
};

GM_addStyle ( "\
    .content-box {\
        background-color: transparent;\
        width: 100px;\
        height: 22px;\
        overflow: hidden;\
        z-index: 5;\
        margin: 0 auto;\
    }\
    .p-up {\
    	text-align: center;\
    	line-height: 22px;\
    }\
" );

function addDiv(){
	var x = 0;
	var post= getClass('entry iC');
	while(x < post.length){
	var newHTML         = document.createElement('div');
	newHTML.className = "plugin-container";
	newHTML.innerHTML   = '             \
    	<div class="content-box">             \
        	<a><p class="p-up"><i class="fa fa-chevron-up"></i> Do Góry</p></a>       \
    	</div>                          \
	';
	post[x].appendChild(newHTML);
	getClass('plugin-container')[x].addEventListener("click", function(){
		window.scrollTo(0, this.parentElement.offsetTop - 50);
	});
	x++;
	//document.querySelector('.entry.iC').appendChild(newHTML);
}

}

addDiv();