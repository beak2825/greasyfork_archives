// ==UserScript==
// @name        Market presets
// @namespace   buldozeer
// @description Быстрые ссылки на рынке
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @include        *//*heroeswm.ru/auction.php*
// @include        *//178.248.235.15/auction.php*
// @include        *//*lordswm.com/auction.php*
// @exclude     /.+cat=(res|elements|skeletons|dom|cert).*/
// @grant       GM_addStyle

// @version     1.0.1
// @downloadURL https://update.greasyfork.org/scripts/388009/Market%20presets.user.js
// @updateURL https://update.greasyfork.org/scripts/388009/Market%20presets.meta.js
// ==/UserScript==

"use strict";

//----------------------------------------------------------------------------//

(function(){ // wrapper start
    var txt = `
<table border=1 style="border-collapse: collapse;">
<tr>
<td><p></p></td>
<td><p><b>правая<b/></p></td>
<td><p><b>левая<b/></p></td>
<td><p><b>стрелы<b/></p></td>
<td><p><b>плащ<b/></p></td>
<td><p><b>лук<b/></p></td>
<td><p><b>амулет<b/></p></td>
<td><p><b>кольцо<b/></p></td>
<td><p><b>кольцо<b/></p></td>
<td><p><b>шлем<b/></p></td>
<td><p><b>броня<b/></p></td>
<td><p><b>сапог<b/></p></td>
</tr>
<tr>
	<td><p><b>охотник</b></p></td>

<td><a href='/auction.php?cat=weapon&art_type=hunter_sword1'>меч</a></td>
<td><a href='/auction.php?cat=shield&art_type=hunter_shield1'>щит</a></td>
<td></td>
<td></td>
<td><a href='/auction.php?cat=weapon&art_type=hunter_bow1'>лук</a></td>
<td><a href='/auction.php?cat=necklace&art_type=hunter_pendant1'>амуль</a></td>
<td><a href='/auction.php?cat=other&art_type=hunter_gloves1'>перчатка</a></td>
<td></td>
<td><a href='/auction.php?cat=helm&art_type=hunter_hat1'>шлем</a></td>
<td><a href='/auction.php?cat=cuirass&art_type=hunter_jacket1'>броня</a></td>
<td><a href='/auction.php?cat=boots&art_type=hunter_boots1'>сапоги</a></td>
</tr>
<tr>
	<td><p><b>мастер</b></p></td>
<td><a href='/auction.php?cat=weapon&art_type=hunterdsword'>меч</a> /
<a href='/auction.php?cat=weapon&art_type=hunter_sword2'>меч</a></td>
<td><a href='/auction.php?cat=shield&art_type=huntershield2'>щит</a> /
<a href='/auction.php?cat=weapon&art_type=hunterdagger'>кинжал</a></td>
<td><a href='/auction.php?cat=other&art_type=hunter_arrows1'>стрелы</a></td>
<td><a href='/auction.php?cat=cloack&art_type=hunter_mask1'>плащ</a></td>
<td><a href='/auction.php?cat=weapon&art_type=hunter_bow2'>лук</a></td>
<td><a href='/auction.php?cat=necklace&art_type=hunter_amulet1'>амуль</a></td>
<td><a href='/auction.php?cat=ring&art_type=hunter_ring2'>кольцо1</a></td>
<td><a href='/auction.php?cat=ring&art_type=hunter_ring1'>кольцо2</a></td>
<td><a href='/auction.php?cat=helm&art_type=hunter_roga1'>шлем</a> /
<a href='/auction.php?cat=helm&art_type=hunter_helm'>шлем</a></td>
<td><a href='/auction.php?cat=cuirass&art_type=hunter_armor1'>броня</a></td>
<td><a href='/auction.php?cat=boots&art_type=hunter_boots2'>сапоги</a> /
<a href='/auction.php?cat=boots&art_type=hunter_boots3'>сапоги</a></td>
</tr>
<tr>
	<td><p><b>великого</b></p></td>
<td><a href='/auction.php?cat=weapon&art_type=gm_sword'>меч</a> /
<a href='/auction.php?cat=weapon&art_type=gm_kastet'>кастет</a></td>
<td><a href='/auction.php?cat=shield&art_type=gm_defence'>щит</a></td>
<td><a href='/auction.php?cat=other&art_type=gm_3arrows'>стрелы</a></td>
<td><a href='/auction.php?cat=cloack&art_type=gm_protect'>плащ</a></td>
<td><a href='/auction.php?cat=weapon&art_type=gm_abow'>лук</a></td>
<td><a href='/auction.php?cat=necklace&art_type=gm_amul'>амуль</a></td>
<td><a href='/auction.php?cat=ring&art_type=gm_rring'>кольцо1</a></td>
<td><a href='/auction.php?cat=ring&art_type=gm_sring'>кольцо2</a></td>
<td><a href='/auction.php?cat=helm&art_type=gm_hat'>шлем</a></td>
<td><a href='/auction.php?cat=cuirass&art_type=gm_arm'>броня</a></td>
<td><a href='/auction.php?cat=boots&art_type=gm_spdb'>сапоги</a></td>
</tr>

<tr>
	<td><p><b>зверобоя</b> </p></td>
<td><a href='/auction.php?cat=weapon&art_type=sh_sword'>меч</a> /
<a href='/auction.php?cat=weapon&art_type=sh_spear'>копьё</a></td>
<td><a href='/auction.php?cat=shield&art_type=sh_shield'>щит</a></td>
<td><a href='/auction.php?cat=other&art_type=sh_4arrows'>стрелы</a></td>
<td><a href='/auction.php?cat=cloack&art_type=sh_cloak'>плащ</a></td>
<td><a href='/auction.php?cat=weapon&art_type=sh_bow'>лук</a></td>
<td><a href='/auction.php?cat=necklace&art_type=sh_amulet2'>амуль</a></td>
<td><a href='/auction.php?cat=ring&art_type=sh_ring1'>кольцо1</a></td>
<td><a href='/auction.php?cat=ring&art_type=sh_ring2'>кольцо2</a></td>
<td><a href='/auction.php?cat=helm&art_type=sh_helmet'>шлем</a></td>
<td><a href='/auction.php?cat=cuirass&art_type=sh_armor'>броня</a></td>
<td><a href='/auction.php?cat=boots&art_type=sh_boots'>сапоги</a></td>
</tr>

<tr>
	<td><p><b>бомж</b> 14 </p></td>
<td><a href='/auction.php?cat=weapon&art_type=ssword13'>меч</a></td>
<td><a href='/auction.php?cat=shield&art_type=sshield11'>щит</a></td>
<td></td>
<td><a href='/auction.php?cat=cloack&art_type=scloack8'>плащ</a></td>
<td></td>
<td><a href='/auction.php?cat=necklace&art_type=samul14'>амуль</a></td>
<td><a href='/auction.php?cat=ring&art_type=sring10'>кольцо1</a></td>
<td></td>
<td><a href='/auction.php?cat=helm&art_type=shelm12'>шлем</a></td>
<td><a href='/auction.php?cat=cuirass&art_type=sarmor13'>броня</a></td>
<td><a href='/auction.php?cat=boots&art_type=sboots12'>сапоги</a></td>
</tr>

<tr>
	<td><p><b>фулл</b> 15 </p></td>
<td><a href='/auction.php?cat=weapon&art_type=firsword15'>меч</a></td>
<td><a href='/auction.php?cat=shield&art_type=shield13'>щит</a></td>
<td></td>
<td></td>
<td><a href='/auction.php?cat=weapon&art_type=bow14'>лук</a></td>
<td><a href='/auction.php?cat=necklace&art_type=wzzamulet13'>амуль</a></td>
<td><a href='/auction.php?cat=ring&art_type=warring13'>кольцо1</a></td>
<td><a href='/auction.php?cat=ring&art_type=dring15'>кольцо2</a></td>
<td><a href='/auction.php?cat=helm&art_type=myhelmet15'>шлем</a></td>
<td><a href='/auction.php?cat=cuirass&art_type=armor15'>броня</a></td>
<td><a href='/auction.php?cat=boots&art_type=boots15'>сапоги</a></td>
</tr>


`;

$("[cellpadding=4]").before(txt);

})(); // wrapper end

//----------------------------------------------------------------------------//