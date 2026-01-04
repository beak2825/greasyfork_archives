// ==UserScript==
// @name           Meetic
// @author         anonyme
// @version        1.3
// @namespace      Meetic
// @description    Affiche dans la liste de recherche les profils déjà observés + note perso + retire les pubs
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_xmlhttpRequest
// @grant          GM_openInTab
// @include        https://www.meetic.fr*
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/376891/Meetic.user.js
// @updateURL https://update.greasyfork.org/scripts/376891/Meetic.meta.js
// ==/UserScript==

//****************************************************************
//		C h e c k   u p d a t e
//	Source code : https://greasyfork.org/fr/scripts/1939-allocine-zap : Merci
//****************************************************************
var AZ_today = new Date();
var BD_currentVersion, i_cV;
var AZ_today_YYYYMMDD = parseInt(AZ_today.getFullYear()*10000+AZ_today.getMonth()*100+AZ_today.getDate());
if (!GM_getValue('BDM_Version')) GM_setValue('BDM_Version', 0);
if (!GM_getValue('BDM_date')) GM_setValue('BDM_date', 0);
if (!GM_getValue('BDM_paramVuSup')) GM_setValue('BDM_paramVuSup', 0);
function check_BD_version(evt){
    GM_xmlhttpRequest({
		method: 'GET',
		url: 'https://greasyfork.org/scripts/376891/code/meetic.meta.js',
		onload: function(responseDetails){
			try{
				BD_currentVersion = responseDetails.responseText.match(/\@version\s+(\d+\.\d+\.?\d?)/)[1];
				BD_currentVersion = BD_currentVersion.replace(/\./g,'');
				for (i_cV = BD_currentVersion.length; i_cV < 4; i_cV++) BD_currentVersion +=0;
				BD_currentVersion = parseInt(BD_currentVersion);
				if(GM_getValue('BDM_Version') === 0) {
                    GM_setValue('BDM_Version', BD_currentVersion);
                }
				if (GM_getValue('BDM_Version') < BD_currentVersion){
                    GM_setValue('BDM_Version', BD_currentVersion);
                    GM_openInTab('https://greasyfork.org/scripts/376891/code/meetic.user.js');
				}
			}
			catch(Err) {}
		}
	});
}
if(AZ_today_YYYYMMDD>GM_getValue('BDM_date')){//test verification version à la premiere connexion de chaque jour
    check_BD_version();
    GM_setValue('BDM_date',AZ_today_YYYYMMDD);
}
//****************************************************************
//		F I N  C h e c k   u p d a t e
//****************************************************************

var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
var imgVu = 'data:image/bmp;base64,Qk12BQAAAAAAADYAAAAoAAAAFQAAABUAAAABABgAAAAAAEAFAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////////////////////////AP///////////////////////////////////////////////////////////////////////////////////wD////////////////////////////////////09/rc4eXS1trT1dfn6Or9/f3///////////////////////8A////////////////////////zMzMjo+PV1VSRDgsSC8ZQiQJQS8eKyMbamtskpKS6urq////////////////AP////////////39/cPDw4KCg1hYWRwJAGUzB6FVFrBZEc+gd/Xv6KqekVxUTb6/wImJiefn5////////////wD////////+/v7W1taysrLs7OyIh4VfLwO7ZyK4ZSGwWRLs2sr///////0+JArFxsf39/fl5eX///////////8A/////////////v7+////////U0c7nFESuWUiuGUiqlkXxIdU8+HS3rWScjQCbmto////////////////////AP///////////////////+Dk6VA1HbZiHblmIms9FiIVCTQaA5xUGblfGJ5SElZJPPz+/////////////////wD////////////////////Gy89XMQ/BaSGdWB4HBQMAAAAAAABNLA6/aSKqWhhSPir3+/7Y2NjU1NT///////8A////////////////////vcHFWzAMx2wjfkcZAAAAAAAAAAAAJhYJuGYjqlsZTzsp8vX58fHxcnJy+fn5////AP///////////////////8fLzkopDMVrIn1GGQAAAAAAAAAAAB4SB75oI5hQE05BNPn8/f///2pqapCQkP///wD////////////////////n6uw6KhmEShVoOREAAAAICAgAAAAPBACQUh5YLQRkXVb///////+SkpISEhL39/cA////////////////////////YVlRPhwAXEMquLi44uLizs/QXVJISyoJNBgAo6Ki////////ampqAAAAxMTEAP///////////////////////8DBwyULAIhuVP///////////+nj3UcjAEk4KfHz9f///7u7uwAAADAwMO3t7QD////39/f///////////////////+Gg342GQDh2tL///////+smoo1HAbGxsb///+urq4AAAAtLS23t7fb29sA////3t7e3Nzc////////////////////kIuHX0s4nY1/gW5cXkw80tHQ////iomJAQEBUVFRaWlpVVVV4eHhAPv7++Hh4aysrMPDw////////////////////+Tk5L22stjU0P///+Xm50VFRQAAADQ0NKmpqerq6srKyrCwsAD9/f3T09PMzMyOjo6EhITe3t7////////////////////e399ra2sBAQEaGhpZWVm2traurq6wsLD9/f39/f0A////////4+Pj0dHRjY2NT09PWlpadHR0eXl5X19fMDAwDAwMLS0tl5eX4uLi1dXV4ODg/////////Pz8////AP////////////r6+unp6cvLy4uLi1xcXEtLS1NTU3Z2dq+vr9/f3+3t7fHx8f///////////////////////wD////////////////////////////////9/f3+/v7////9/f39/f3///////////////////////////////8A';
var imgRetirer = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAKlSURBVHjanJNPSJNxHMaf3/u+S9/t3d53bu9o6cHWxCZIq6k1NAxEEluHvAge7BBU0kqijS4euvQHFcRZCQphh9Cbp7QgQ/Ei6SEwwciDIExisuna2r/33bdDLBQ89Ry/D5/L83wfRkT4bxER7ni9CNbVdb6z27cuS9KjkndFkjDqcGBIUTCpKPcW3e4tH2NdR+C79fXXPrlceRofp68+HzWLYrgEj6gqIhZLcD0QIG1ujn60t+tNHNdlAEQQEd6qaowGBii1sUHpmRla9XjoYnl5qNFoxGtVDX5pbqaD2VlKra4STU/TkseT8TPWx4gIl6zWRxMOx/Dp3l7kKytRjEbxbWoKi/H4h7aqqo7anh4IFRXg02kUlpZwa34+8jmbfcmICIwxNJjN4QlFGaxsa4OuqsjGYoiurMDp90O0WoFsFvnNTfQtL4/NFwoPAOAfDADnJSk8ZjY/P1VTw8NkAgCwYhGapiF9cIDH6+uRj7lcfykvRkQ4a7OBKxaRI8J1WZ6/ub/fwSQJ4DgUGYNgsWB6d3ftRTzeeLgpAQA6qqvBdB2SpgU7otG2bDKJaDKJBACzLEMtK0N3dfW59Uwm9D6TGS7BHAD8LhZBun4/sLMzdjKRMGgAeABORQHPcdB1HUwQDK8aGoYC5eXhI7BR14O929uRM8kksgAMAES7HQuiuCorCgTGkC8UwJlMeNPaOnjDaAxJgIMDAG8i8eRCKoUsgBMAyGbDU00bG9ndbRre2wtZRBEGnkcun4fd6cRDt/tZPc93g4jgUpSuBZtN/wXQWkUF+a3WyOFgrppM4Y3GRooFAvS9pYV8gtAvACpKw3DJctek0/nTL8ujx22g02QKzXk8MS/H9R/57b+lMb5Wlm/zPO86Di4DrE0GQx8ApXT7MwC3lg0rJwpHAgAAAABJRU5ErkJggg==';

TM = {
	affiche : function(id,profil,iddom,page){
        if(page == "search" || page == "visitors" || page == "decouvre"){
            if(profil!==undefined){
                var profilPlus='';
                if(GM_getValue('BDM_paramVuSup')===0 && profil.vote==-1){
                    $(iddom).remove();
                }else{
					if(profil.vu=="oui"){
						profilPlus+='<img class="img_vu" src="'+imgVu+'" style="vertical-align: bottom;"/></a>';
					}

					if(page == "search" && $('.img_vu', iddom).html()!="") $('.member-card__info-nickname', iddom).append(profilPlus);
					if(page == "visitors" && $('.img_vu', iddom).html()!="") $('.member-card__info-nickname', iddom).append(profilPlus);
                    if(page == "decouvre" && $('.img_vu', iddom).html()!="") $('.member-card__info-nickname', iddom).append(profilPlus);
                }
            }
            if(page == "search" || page == "visitors" || page == "decouvre"){
                if($('select', iddom).html()===null){
                    $('.member-card__info-more', iddom).append('<label for="vote" style="position: relative;float: left;"> </label>'+
                                                                   '<select style="position: relative;z-index: 1;float: left;" name="vote" class="vote" onchange="TM.getBDD(\''+id+'\',this,\'vote\');">'+
                                                                   '<option value=""></option>'+
                                                                   '<option value="0">0</option>'+
                                                                   '<option value="1">1</option>'+
                                                                   '<option value="2">2</option>'+
                                                                   '<option value="3">3</option>'+
                                                                   '<option value="4">4</option>'+
                                                                   '<option value="5">5</option>'+
                                                                   '<option value="6">6</option>'+
                                                                   '<option value="7">7</option>'+
                                                                   '<option value="8">8</option>'+
                                                                   '<option value="9">9</option>'+
                                                                   '<option value="10">10</option>'+
                                                                   '</select>'+
                                                                   '<a href="#" id="retirer" class="b-link" style="position: relative;float: left;" onclick="TM.setDB(\''+id+'\',\'\',\'\',\'\',-1);$(this).remove();return false;"><div class="member-card__info-nickname" style="display: inline-flex;"><img class="img_Retirer" alt="retirer" src="'+imgRetirer+'" style="vertical-align: bottom;"  width="15" height="15"></div></a>');
                }
                if(GM_getValue('BDM_paramVuSup')===0 && profil!==undefined){
                    $("select",iddom).val(profil.vote);
                }
            }
            if(window.scrollY<200){
                window.scrollBy(0,1000);
                window.scrollBy(0,-1000);
            }
        }
        if(page == "profil"){
			if(profil!==undefined){
				TM.setDB(id,"","","",profil.vote,"oui");
			}else{
				TM.setDB(id,"","","","","oui");
			}
        }
    },
    setDB : function(id, info1, info2, info3, vote, vu){
		var open = indexedDB.open('BDDM', '1');
		open.onupgradeneeded = function() {
			var db = open.result;
			var store = db.createObjectStore("infosM", {keyPath: "id"});
			var index = store.createIndex("filtre", ["info1", "info2","info3","vote","vu"]);
		};
		open.onsuccess = function() {
			var db = open.result;
			var tx = db.transaction("infosM", "readwrite");
			var store = tx.objectStore("infosM");
			var index = store.index("filtre");
            store.put({id: id, info1:info1, info2:info2, info3:info3, vote:vote, vu:vu});
			tx.oncomplete = function() {
				db.close();
			};
		};
	},
    getBDD : function(id,iddom,page){
		var open = indexedDB.open('BDDM', '1');
		open.onsuccess = function() {
			var db = open.result;
			var tx = db.transaction("infosM", "readwrite");
			var store = tx.objectStore("infosM");
			var res = store.get(id);
			tx.oncomplete = function() {
					db.close();
			};
			res.onsuccess = function() {
				var profil= res.result;
                if(page=='vote'){
                    if(profil!==undefined){
                        TM.setDB(id, profil.info1, profil.info2, profil.info3, $('option:selected', iddom).val(), profil.vu);
                    }else{
                        TM.setDB(id, "?", "?", "?", $('option:selected', iddom).val(), "");
                    }
                }else{
                    TM.affiche(id,profil,iddom,page);
                }
            };
		};
        open.onupgradeneeded = function() {
			var db = open.result;
			var store = db.createObjectStore("infosM", {keyPath: "id"});
			var index = store.createIndex("filtre", ["info1", "info2","info3","vote","vu"]);
		};
	},
    changeCheckSearch : function(check){
        if(check===true){
            GM_setValue('BDM_paramVuSup', 1);
        }else{
            GM_setValue('BDM_paramVuSup', 0);
        }
        window.location.reload();
    },
    boucle : function(Msec){
        var url = window.location.href;
		var idUser="";
		var idU="";
        //On profite pour virer les pub ^^
        $('.adblocker-cross-sell').each(function(){
            $(this).parent().parent().remove();
        });
        $('.auto-promo-card').each(function(){
            $(this).parent().parent().remove();
        });
        $('.cross-sell-card').each(function(){
            $(this).parent().parent().remove();
        });
        $('.shuffle-promo').each(function(){
            $(this).parent().parent().remove();
        });
        $('nrc-promo-card').each(function(){
            $(this).parent().remove();
        });
        $('lara-card').each(function(){
            $(this).parent().remove();
        });
        var heightOutput = document.querySelector('#height');
        var widthOutput = document.querySelector('#width');

        function resize() {
            heightOutput.textContent = window.innerHeight;
            widthOutput.textContent = window.innerWidth;
        }

        window.onresize = resize;
        //voila voila
        if(url.substring(0, 30)=="https://www.meetic.fr/d/search"){
            if($('#paramSearch').html()===null){
                var check="";
                if(GM_getValue('BDM_paramVuSup')!==0){check="checked='checked'";}
                $(".search__search-bar-container").append("<div id='paramSearch'>Affichage des profils supprimés? <input type='checkbox' id='cbox' onchange='TM.changeCheckSearch(this.checked);' "+check+"></div>");
            }
            $('.grid-list-item').each( function(){
                idUser = $(this).html().split('ref="/d/profile-display/');
                if(idUser.length>1){
                    idUser=idUser[1].split('?')[0];
					TM.getBDD(idUser,this,"search");
                }
            });
        }else if(url.substring(0, 50)=="https://www.meetic.fr/d/activities/visits/received"){
            $('.grid-list-item').each( function(){
                idUser = $(this).html().split('ref="/d/profile-display/');
                if(idUser.length>1){
                    idU=idUser[1].split('?')[0];
					TM.getBDD(idU,this,"visitors");
                }
            });
        }else if(url.substring(0, 31)=="https://www.meetic.fr/d/onlines"){
            $('.grid-list-item').each( function(){
                idUser = $(this).html().split('ref="/d/profile-display/');
                if(idUser.length>1){
                    idU=idUser[1].split('?')[0];
					TM.getBDD(idU,this,"decouvre");
                }
            });
        }else if(url.substring(0, 40)=="https://www.meetic.fr/d/profile-display/"){
            idU=url.substring(40, url.length);
            idU=idU.split('?')[0];
			TM.getBDD(idU,"","profil");
        }
        window.setTimeout(function(){TM.boucle(Msec);}, Msec);
    }
};
TM.boucle(1000);