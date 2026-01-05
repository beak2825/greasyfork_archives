// ==UserScript==
// @name           fishh
// @description    http://www.bloodyworld.com
// @include http://www.bloodyworld.com/?file=fish*
// @include http://www.bloodyworld.com/index.php?file=fish*
// @include http://www.bloodyworld.com/?file=cave_room3*
// @include http://www.bloodyworld.com/index.php?file=cave_room3*

// @version 0.0.1.20150604004834
// @namespace https://greasyfork.org/users/12000
// @downloadURL https://update.greasyfork.org/scripts/10254/fishh.user.js
// @updateURL https://update.greasyfork.org/scripts/10254/fishh.meta.js
// ==/UserScript==




function fishh()
{
  id_b=document.getElementById('f_st');
  id_b2=document.getElementById('f_st2');
  id_b3=document.getElementById('f_st3');
  id_b5=document.getElementById('f_st5');

  if (!id_b2 || !id_b5)
  	{
  		setTimeout("fishh()",1000);
  		return;
  	}

  if (id_b5)
  	if (id_b5.style.display == 'block') Go();


setTimeout("fishh()",1000);
}

setTimeout("fishh()",500);