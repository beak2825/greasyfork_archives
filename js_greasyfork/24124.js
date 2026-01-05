// ==UserScript==
// @name        gazellegames GGN 1click collection add + unfold all filelists
// @namespace   https://gazellegames.net/torrents
// @description unfolds all filelists | Greasemonkey 4.1: ✕ Tampermonkey 4.4: ✔ 
// @include     https://gazellegames.net/torrents.php?id=*
// @version     3.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24124/gazellegames%20GGN%201click%20collection%20add%20%2B%20unfold%20all%20filelists.user.js
// @updateURL https://update.greasyfork.org/scripts/24124/gazellegames%20GGN%201click%20collection%20add%20%2B%20unfold%20all%20filelists.meta.js
// ==/UserScript==


//unfold stuff
var unfoldLink = document.createElement('a');
var linkText = document.createTextNode('[Unfold all filelists]');
unfoldLink.appendChild(linkText);
unfoldLink.id = 'unfoldLink';
unfoldLink.title = 'Unfold all filelists';
unfoldLink.href = '#';
unfoldLink.setAttribute('onclick', 'unfoldAll()');
document.getElementsByClassName('linkbox groupoptions') [0].appendChild(unfoldLink);




var topBox = document.getElementsByClassName('linkbox groupoptions')[0];
topBox.innerHTML = topBox.innerHTML + '<a href="javascript:;" onclick="document.getElementById(\'vr_add\').style.display=\'block\'">[Show Collection Add]</a> <br> <div id="vr_add" style="display:none;"> <br>VR--> <a href="javascript:;" id="vive_excl" >[Vive Excl.]</a> <a href="javascript:;" id="ocul_excl">[Ocul Excl.]</a><a href="javascript:;" id="both_excl">[Both Excl.]</a> <a href="javascript:;" id="ocul_supp">[Ocul Supp.]</a><a href="javascript:;" id="vive_supp">[Vive Supp.]</a><a href="javascript:;" id="both_supp">[Both Vr Supp.]</a><a href="javascript:;" id="osvr_supp_coll" >[osvr]</a><br> <br>Store --> <a href="javascript:;" id="humble_coll">[HUMBLE]</a><a href="javascript:;" id="gog_coll" >[GOG]</a><br><br>Features --> <a href="javascript:;" id="native_gamepad_coll">[Native Gamepad]</a><a href="javascript:;" id="early_access_coll" >[Early Access]</a><a href="javascript:;" id="single_mp_coll" >[Singlescreen MP]</a><a href="javascript:;" id="cracked_online_coll">[Cracked Online]</a><a href="javascript:;" id="lan_supp_coll" >[LAN Supp.]</a><a href="javascript:;" id="loc_mp_supp_coll" >[local MP]</a><a href="javascript:;" id="loc_coop_supp_coll" >[local CO-OP]</a><a href="javascript:;" id="coop_supp_coll" >[CO-OP]</a><br> <br>Themes --> <a href="javascript:;" id="procedural_coll" >[Procedural Gen]</a><a href="javascript:;" id="adult_coll" >[Adult]</a><a href="javascript:;" id="zombie_coll">[Zombie]</a><a href="javascript:;" id="female_prot_coll">[Female Prot.]</a><br><br>Engine --> <a href="javascript:;" id="unreal_coll">[Unreal]</a><a href="javascript:;" id="unity_coll">[Unity]</a></div>'; 



var ggnAuth = authkey


document.getElementById('vive_excl').addEventListener('click', vive_excl, false);
document.getElementById('ocul_excl').addEventListener('click', ocul_excl, false);
document.getElementById('both_excl').addEventListener('click', both_excl, false);
document.getElementById('ocul_supp').addEventListener('click', ocul_supp, false);
document.getElementById('vive_supp').addEventListener('click', vive_supp, false);
document.getElementById('both_supp').addEventListener('click', both_supp, false);
document.getElementById('humble_coll').addEventListener('click', humble_coll, false);
document.getElementById('gog_coll').addEventListener('click', gog_coll, false);
document.getElementById('native_gamepad_coll').addEventListener('click', native_gamepad_coll, false);
document.getElementById('early_access_coll').addEventListener('click', early_access_coll, false);
document.getElementById('single_mp_coll').addEventListener('click', single_mp_coll, false);
document.getElementById('cracked_online_coll').addEventListener('click', cracked_online_coll, false);
document.getElementById('lan_supp_coll').addEventListener('click', lan_supp_coll, false);
document.getElementById('procedural_coll').addEventListener('click', procedural_coll, false);
document.getElementById('adult_coll').addEventListener('click', adult_coll, false);
document.getElementById('zombie_coll').addEventListener('click', zombie_coll, false);
document.getElementById('female_prot_coll').addEventListener('click', female_prot_coll, false);
document.getElementById('unity_coll').addEventListener('click', unity_coll, false);
document.getElementById('unreal_coll').addEventListener('click', unreal_coll, false);
document.getElementById('coop_supp_coll').addEventListener('click', coop_supp_coll, false);
document.getElementById('loc_coop_supp_coll').addEventListener('click', loc_coop_supp_coll, false);
document.getElementById('loc_mp_supp_coll').addEventListener('click', loc_mp_supp_coll, false);
document.getElementById('osvr_supp_coll').addEventListener('click', osvr_supp_coll, false);






function coop_supp_coll(){
	postToColl("961");}
function loc_coop_supp_coll(){
	postToColl("962");
	postToColl("961");
	postToColl("963");}
function loc_mp_supp_coll(){
	postToColl("963");}
function osvr_supp_coll(){	
	postToColl("968");
	vr_support();}



function vive_excl(){
	postToColl("739");
	vr_support();
	vr_exclusive();
}
function ocul_excl(){
	postToColl("738");
	vr_support();
	vr_exclusive();
}
function both_excl(){
	postToColl("739");
	postToColl("738");
	vr_support();
	vr_exclusive();
}
function ocul_supp(){
	postToColl("738");
	vr_support();
}
function vive_supp(){
	postToColl("739");
	vr_support();
}
function both_supp(){
	postToColl("739");
	postToColl("738");
	vr_support();
}
function humble_coll(){postToColl("133");}
function gog_coll(){postToColl("25");}
function native_gamepad_coll(){postToColl("551");}
function early_access_coll(){postToColl("152");}
function single_mp_coll(){postToColl("476");postToColl("963");}
function cracked_online_coll(){postToColl("23");}
function lan_supp_coll(){postToColl("77");postToColl("963");}
function procedural_coll(){postToColl("902");}
function adult_coll(){postToColl("849");}
function zombie_coll(){postToColl("586");}
function female_prot_coll(){postToColl("856");}
function unreal_coll(){postToColl("245");}
function unity_coll(){postToColl("263");}


function vr_support(){postToColl("559");}
function vr_exclusive(){postToColl("683");}

function postToColl(collId){
	
	var http = new XMLHttpRequest();
	var url = "collections.php";
	var params = "action=add_torrent&auth="+ggnAuth+"&collageid="+collId+"&url="+window.location.href;
	http.open("POST", url, true);

	//Send the proper header information along with the request
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	http.onreadystatechange = function() {//Call a function when the state changes.
		if(http.readyState == 4 && http.status == 200) {
			addSuccess();
			return true;
		}

	}
	http.send(params);
	return true;
}

var wholeThing = document.getElementById("content");
function addSuccess(){
	wholeThing.innerHTML="GOOD____"+wholeThing.innerHTML;
	}






document.getElementById('unfoldLink').addEventListener('click', unfoldAll, false);
var folded = true;
function unfoldAll() {
  var torrentGroups = document.getElementsByClassName('pad hidden');
  for (var i = 0; i < torrentGroups.length; i++) {
    var re = /torrent_(.*)/;
    var id = torrentGroups[i].id.match(re) [1];
    if (folded == true) {
      jQuery('#torrent_' + id).show();
      jQuery('#files_' + id).show();
    } 
    else {
      jQuery('#torrent_' + id).hide();
      jQuery('#files_' + id).hide();
    }
  }
  folded=!folded;
}