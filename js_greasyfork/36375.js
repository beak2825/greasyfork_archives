// ==UserScript==
// @name ChangePhoto
// @description Меняет фотографию в вк (зайти в "Фоторедактор" внизу будет кнопка "заменить фото", потом выбираете фото и все)
// @namespace smmboxposttovk
// @version 1.0
// @include *vk.com*
// @include *pu.vk.com*
// @downloadURL https://update.greasyfork.org/scripts/36375/ChangePhoto.user.js
// @updateURL https://update.greasyfork.org/scripts/36375/ChangePhoto.meta.js
// ==/UserScript==

// =============================================
// funcs for vk.com

function wPM(win,mess){
	win.postMessage(mess,'*');
}

puvk=window;
upl=null;
function gm_replacevkphoto(){
	upl=cur.filterSaveOptions.upload_url;
	puvk=window.open('https://pu.vk.com/#gm_vkphrepl',"puvk","menubar=no,toolbar=no,location=no,directories=no,status=no,left=0,top=90,height=500,width=350");
}

// =============================================
// funcs for pu.vk.com

function oPM(mess){
	opener.postMessage(mess,'*');
}

// =============================================
// main

window.addEventListener('message',function(e){
	if(e.source==puvk){
		var d=JSON.parse(e.data);
		if(d.status=='init'){
			wPM(puvk,JSON.stringify({
				'status':"getupl",
				'data':upl
			}));
		}else
		if(d.status=='loaded'){
			FiltersPE.save(d.data);
			puvk.close();
		}
	}else
	if(e.source==opener){
		var d=JSON.parse(e.data);
		if(d.status=='getupl'){
			upl=d.data;
			document.body.innerHTML='<form method="post" enctype="multipart/form-data" action="'+upl+'#gm_vkphreplf"><input type=file name=photo accept="image/png,image/jpeg"><input type="hidden" name="Filename" value="Filtered.jpg"><input type="submit" name="Upload" value="Submit Query"></form>';
		}
	}
});

setTimeout(function(){
	if(location.host=='vk.com'){ // for vk.com
		setInterval(function(){
			var peb=document.querySelector('.pe_filter_buttons');
			if(peb!==null){
				var a=document.createElement('button');
				a.classList.add('flat_button');
				a.classList.add('gm_replacephoto');
				a.innerText="Заменить фото";
				if(peb.querySelector('.gm_replacephoto')===null) peb.appendChild(a);
				a.addEventListener('click',function(){
					gm_replacevkphoto();
				});
			}
		},100);
	}else
	if(location.host=='pu.vk.com' && location.hash=='#gm_vkphrepl'){
		oPM(JSON.stringify({
			'status':'init'
		}));
	}else
	if(location.host=='pu.vk.com' && location.hash=='#gm_vkphreplf'){
		oPM(JSON.stringify({
			'status':"loaded",
			'data':document.body.innerText
		}));
	}
},100);