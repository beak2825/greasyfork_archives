// ==UserScript==
// @name        bamhaneul 2016.12 Map Patch
// @namespace   map Patch
// @match       https://kharus.com/town/move*
// @match       http://kharus.com/town/move*
// @version     201612.012

// @description bamhaneul 2016.12 Map Patch_
// @downloadURL https://update.greasyfork.org/scripts/25644/bamhaneul%20201612%20Map%20Patch.user.js
// @updateURL https://update.greasyfork.org/scripts/25644/bamhaneul%20201612%20Map%20Patch.meta.js
// ==/UserScript==

function mapPatch() {
$('#new_map').css({'width': '720px','height':'720px','background-position':'0px'});
$('#map_up_btn').hide();
$('#map_left_btn').hide();
$('#map_right_btn').hide();
$('#map_down_btn').hide();
$('#new_map_select_bar').css({'width': '480px'});
$('#new_map_select_bar').append("<a href='#' id='allMapView' onclick='allMap();'>전체밝게보기</a><script type='text/javascript'>function allMap(){$('[data-id=1]').css({'top': '230px','left':'310px','opacity':''});$('[data-id=2]').css({'top': '275px','left':'600px','opacity':''});$('[data-id=3]').css({'top': '470px','left':'210px','opacity':''});$('[data-id=4]').css({'top': '390px','left':'220px','opacity':''});$('[data-id=5]').css({'top': '50px','left':'240px','opacity':''});$('[data-id=6]').css({'top': '462px','left':'111px','opacity':''});$('[data-id=7]').css({'top': '80px','left':'20px','opacity':''});$('[data-id=8]').css({'top': '370px','left':'380px','opacity':''});$('[data-id=9]').css({'top': '260px','left':'145px','opacity':''});$('[data-id=10]').css({'top': '180px','left':'560px','opacity':''});$('[data-id=11]').css({'top': '247px','left':'490px','opacity':''});$('[data-id=12]').css({'top': '210px','left':'660px','opacity':''});$('[data-id=13]').css({'top': '360px','left':'560px','opacity':''});$('[data-id=14]').css({'top': '410px','left':'140px','opacity':''});$('[data-id=15]').css({'top': '110px','left':'660px','opacity':''});$('[data-id=16]').css({'top': '560px','left':'200px','opacity':''});$('[data-id=17]').css({'top': '170px','left':'20px','opacity':''});$('[data-id=18]').css({'top': '195px','left':'200px','opacity':''});$('[data-id=19]').css({'top': '630px','left':'350px','opacity':''});$('[data-id=20]').css({'top': '10px','left':'15px','opacity':''});$('[data-id=21]').css({'top': '110px','left':'120px','opacity':''});$('[data-id=22]').css({'top': '410px','left':'630px','opacity':''});$('[data-id=23]').css({'top': '20px','left':'350px','opacity':''});$('[data-id=24]').css({'top': '260px','left':'400px','opacity':''});$('[data-id=25]').css({'top': '470px','left':'20px','opacity':''});$('[data-id=26]').css({'top': '470px','left':'470px','opacity':''});$('[data-id=27]').css({'top': '570px','left':'580px','opacity':''});$('[data-id=28]').css({'top': '10px','left':'120px','opacity':''});$('[data-id=29]').css({'top': '100px','left':'220px','opacity':''});$('[data-id=30]').css({'top': '600px','left':'270px','opacity':''});$('[data-id=31]').css({'top': '300px','left':'310px','opacity':''});$('[data-id=32]').css({'top': '90px','left':'350px','opacity':''});$('[data-id=33]').css({'top': '200px','left':'400px','opacity':''});$('[data-id=34]').css({'top': '280px','left':'220px','opacity':''});}</script>");

$('[data-id=1]').css({'top': '230px','left':'310px'});
$('[data-id=2]').css({'top': '275px','left':'600px'});
$('[data-id=3]').css({'top': '470px','left':'210px'});
$('[data-id=4]').css({'top': '390px','left':'220px'});
$('[data-id=5]').css({'top': '50px','left':'240px'});
$('[data-id=6]').css({'top': '462px','left':'111px'});
$('[data-id=7]').css({'top': '80px','left':'20px'});
$('[data-id=8]').css({'top': '370px','left':'380px'});
$('[data-id=9]').css({'top': '260px','left':'145px'});
$('[data-id=10]').css({'top': '180px','left':'560px'});
$('[data-id=11]').css({'top': '247px','left':'490px'});
$('[data-id=12]').css({'top': '210px','left':'660px'});
$('[data-id=13]').css({'top': '360px','left':'560px'});
$('[data-id=14]').css({'top': '410px','left':'140px'});
$('[data-id=15]').css({'top': '110px','left':'660px'});
$('[data-id=16]').css({'top': '560px','left':'200px'});
$('[data-id=17]').css({'top': '170px','left':'20px'});
$('[data-id=18]').css({'top': '195px','left':'200px'});
$('[data-id=19]').css({'top': '630px','left':'350px'});
$('[data-id=20]').css({'top': '10px','left':'15px'});
$('[data-id=21]').css({'top': '110px','left':'120px'});
$('[data-id=22]').css({'top': '410px','left':'630px'});
$('[data-id=23]').css({'top': '20px','left':'350px'});
$('[data-id=24]').css({'top': '260px','left':'400px'});
$('[data-id=25]').css({'top': '470px','left':'20px'});
$('[data-id=26]').css({'top': '470px','left':'470px'});
$('[data-id=27]').css({'top': '570px','left':'580px'});
$('[data-id=28]').css({'top': '10px','left':'120px'});
$('[data-id=29]').css({'top': '100px','left':'220px'});
$('[data-id=30]').css({'top': '600px','left':'270px'});
$('[data-id=31]').css({'top': '300px','left':'310px'});
$('[data-id=32]').css({'top': '90px','left':'350px'});
$('[data-id=33]').css({'top': '200px','left':'400px'});
$('[data-id=34]').css({'top': '280px','left':'220px'});
}


mapPatch();