// ==UserScript==
// @name		115 Download Helper
// @authuer		ted423
// @description	115网盘下载帮手，能自动帮忙点普通下载，少点一次鼠标，能够批量复制下载链接
// @include		http://115.com/?ct=*
// @version		2016.02.20.0
// @grant		GM_xmlhttpRequest
// @grant		GM_setClipboard
// @run-at		document-end
// @license		MIT
// @namespace	https://greasyfork.org/users/85
// downloadURL	https://github.com/ted423/rules-GM-stylish-UC/raw/master/GM/115%20Download%20Helper.user.js
// @downloadURL https://update.greasyfork.org/scripts/423674/115%20Download%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/423674/115%20Download%20Helper.meta.js
// ==/UserScript==
if(self.document.URL.indexOf('http://115.com/?ct=')!=-1){
	var	callback = function(records){
		records.map(function(record){
			if(record.addedNodes[0]){
				/*
				if(record.addedNodes[0].baseURI.indexOf('http://115.com/?ct=download')!=-1&&record.addedNodes[0].nodeName=='#text'){
					var target=self.document.querySelector('.btn-green');
					target.removeAttribute('target');
					target.click();
				}
				*/
				if(record.target.id=='js_operate_box'){
					if(!document.querySelector('li[menu="export"]')){
						var li = document.createElement('li');
						li.innerHTML = '<span>批量复制下载链接</span>';
						li.onclick=function(){
							var arr=[];
							i=0;
							[].forEach.call(selected,function(oneSelected){
								URL="http://web.api.115.com/files/download?pickcode="+oneSelected.getAttribute('pick_code')+"&_="+(new Date()).valueOf();
								console.log(URL);
								getDownloadUrl(URL,arr,li,selected.length);
							})
						}
						record.target.firstChild.appendChild(li);
						var selected = document.querySelectorAll('li.selected');	
					}
				}	
			}
		})
	}

	var	option = {
		'childList': true,
		'subtree': true,
	};
	function getDownloadUrl(URL,arr,li,length){
		GM_xmlhttpRequest({
			method:'GET',
			url:URL,
			headers:{
				"Referer":"http://web.api.115.com/bridge_2.0.html?namespace=Core.DataAccess&api=UDataAPI&_t=v5",
				"Accept":"*/*",
			},
			onload:function(response){
				//console.log(response.responseText);
				geturl=JSON.parse(response.responseText).file_url;
				//console.log(geturl);
				arr.push(geturl);
				i++;
				if(i==length){
					//console.log(arr.join('\n'));
					GM_setClipboard(arr.join('\n'),'text');
					li.style.fontWeight='bold';
					setTimeout(function(){li.style.fontWeight=''},2000)
				}
			},
		});
	}

	if(self.document.URL.indexOf('http://115.com/?ct=pickcode')!=-1)
	{
		var	click	=	new	MutationObserver(callback);

		click.observe(document,	option);
	}
	else{
		var	Firstload	=	new	MutationObserver(callback);
		Firstload.observe(document,	option);
		//console.log(self.document.URL);
	}
}
