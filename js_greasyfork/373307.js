// ==UserScript==
// @name         bangumi角色(人物)收藏
// @namespace    https://github.com/bangumi/scripts/tree/master/liaune
// @version      1.5
// @description  简单方便地收藏角色(人物)，条目页面高亮显示已收藏的角色(人物)，在我的角色(人物)收藏页面进行管理
// @author       Liaune
// @license      MIT
// @include      /^https?:\/\/(bgm\.tv|chii\.in|bangumi\.tv)\/.*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/373307/bangumi%E8%A7%92%E8%89%B2%28%E4%BA%BA%E7%89%A9%29%E6%94%B6%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/373307/bangumi%E8%A7%92%E8%89%B2%28%E4%BA%BA%E7%89%A9%29%E6%94%B6%E8%97%8F.meta.js
// ==/UserScript==
(function() {
	GM_addStyle(`
.Collect{
-webkit-box-shadow: 1px 0px 1px 1px #ff0000;
-moz-box-shadow: 1px 0px 1px 1px #ff0000;
box-shadow: 1px 0px 1px 1px rgba(185, 195, 38, 0.7);
border-color: #fd8a95;
border-style: solid;
border-width: 2px;
border-radius: 5px;
}
`);
	let localData,securitycode,UID;
	localData= JSON.parse(localStorage.getItem('bgm_user_detail_by_yonjar')) || {characters:[],friends:[],groups:[],persons:[],uid:UID,updateTime: now.getTime()};
	UID = document.querySelectorAll('#headerNeue2 .idBadgerNeue a.avatar')[0].href.split('/user/')[1];
	let badgeUserPanel=document.querySelectorAll('#badgeUserPanel a');
	badgeUserPanel.forEach( (elem, index) => {
		if(elem.href.match(/logout/))
			securitycode = elem.href.split('/logout/')[1].toString();
	});
	let now = new Date();

	if(document.location.href.match(/character\/\d+/)){
		let collectBtn = document.querySelector('#headerSubject .subjectNav .navTabs li.collect .collect a');
		let charaId = document.location.href.match(/character\/(\d+)/)[1].toString();
		collectBtn.href = 'javascript:;';
		collectBtn.addEventListener('click', function(){
			if(localData.characters.indexOf(charaId)== -1){
				localData.characters.push(charaId);
				let xmlhttp=new XMLHttpRequest();xmlhttp.open("GET",location.origin+"/character/"+charaId+"/collect?gh="+securitycode+"",true);xmlhttp.send();
				collectBtn.className='break';collectBtn.textContent='取消收藏';}
			else{
				localData.characters.splice(localData.characters.indexOf(charaId),1);
				let xmlhttp=new XMLHttpRequest();xmlhttp.open("GET",location.origin+"/character/"+charaId+"/erase_collect?gh="+securitycode+"",true);xmlhttp.send();
				collectBtn.className='';collectBtn.textContent='加入收藏';}
			localStorage.setItem('bgm_user_detail_by_yonjar',JSON.stringify(localData));
		});
	}

	if(document.location.href.match(/person\/\d+/)){
		let collectBtn = document.querySelector('#headerSubject .subjectNav .navTabs li.collect .collect a');
		collectBtn.href = 'javascript:;';
		let personId = document.location.href.match(/person\/(\d+)/)[1].toString();
		collectBtn.addEventListener('click', function(){
			if(localData.persons.indexOf(personId)== -1){
				localData.persons.push(personId);
				let xmlhttp=new XMLHttpRequest();xmlhttp.open("GET",location.origin+"/person/"+personId+"/collect?gh="+securitycode+"",true);xmlhttp.send();
				collectBtn.className='break';collectBtn.textContent='取消收藏';}
			else{
				localData.persons.splice(localData.persons.indexOf(personId),1);
				let xmlhttp=new XMLHttpRequest();xmlhttp.open("GET",location.origin+"/person/"+personId+"/erase_collect?gh="+securitycode+"",true);xmlhttp.send();
				collectBtn.className='';collectBtn.textContent='加入收藏';}
			localStorage.setItem('bgm_user_detail_by_yonjar',JSON.stringify(localData));
		});
	}

	function chara_collect(charaId, showBtn){
		if (localData.characters.indexOf(charaId) == -1){
			let flag = 0;
			showBtn.addEventListener('click', function(){
				flag = flag==1?0:1;
				if(flag){
					localData.characters.push(charaId);
					let xmlhttp=new XMLHttpRequest();xmlhttp.open("GET",location.origin+"/character/"+charaId+"/collect?gh="+securitycode+"",true);xmlhttp.send();
					$(showBtn).css({"color":"red"});}
				else{
					localData.characters.splice(localData.characters.indexOf(charaId),1);
					let xmlhttp=new XMLHttpRequest();xmlhttp.open("GET",location.origin+"/character/"+charaId+"/erase_collect?gh="+securitycode+"",true);xmlhttp.send();
					$(showBtn).css({"color":"grey"});}
				localStorage.setItem('bgm_user_detail_by_yonjar',JSON.stringify(localData));
			});
		}
		else{
			$(showBtn).css({"color":"red"});
			let flag = 1;
			showBtn.addEventListener('click', function(){
				flag = flag==1?0:1;
				if(flag){
					localData.characters.push(charaId);
					let xmlhttp=new XMLHttpRequest();xmlhttp.open("GET",location.origin+"/character/"+charaId+"/collect?gh="+securitycode+"",true);xmlhttp.send();
					$(showBtn).css({"color":"red"});}
				else{
					localData.characters.splice(localData.characters.indexOf(charaId),1);
					let xmlhttp=new XMLHttpRequest();xmlhttp.open("GET",location.origin+"/character/"+charaId+"/erase_collect?gh="+securitycode+"",true);xmlhttp.send();
					$(showBtn).css({"color":"grey"});}
				localStorage.setItem('bgm_user_detail_by_yonjar',JSON.stringify(localData));
			});
		}
	}

	function person_collect(personId, showBtn){
		if (localData.persons.indexOf(personId) == -1){
			let flag = 0;
			showBtn.addEventListener('click', function(){
				flag = flag==1?0:1;
				if(flag){
					localData.persons.push(personId);
					let xmlhttp=new XMLHttpRequest();xmlhttp.open("GET",location.origin+"/person/"+personId+"/collect?gh="+securitycode+"",true);xmlhttp.send();
					$(showBtn).css({"color":"red"});}
				else{
					localData.persons.splice(localData.persons.indexOf(personId),1);
					let xmlhttp=new XMLHttpRequest();xmlhttp.open("GET",location.origin+"/person/"+personId+"/erase_collect?gh="+securitycode+"",true);xmlhttp.send();
					$(showBtn).css({"color":"grey"});}
				localStorage.setItem('bgm_user_detail_by_yonjar',JSON.stringify(localData));
			});
		}
		else{
			$(showBtn).css({"color":"red"});
			let flag = 1;
			showBtn.addEventListener('click', function(){
				flag = flag==1?0:1;
				if(flag){
					localData.persons.push(personId);
					let xmlhttp=new XMLHttpRequest();xmlhttp.open("GET",location.origin+"/person/"+personId+"/collect?gh="+securitycode+"",true);xmlhttp.send();
					$(showBtn).css({"color":"red"});}
				else{
					localData.persons.splice(localData.persons.indexOf(personId),1);
					let xmlhttp=new XMLHttpRequest();xmlhttp.open("GET",location.origin+"/person/"+personId+"/erase_collect?gh="+securitycode+"",true);xmlhttp.send();
					$(showBtn).css({"color":"grey"});}
				localStorage.setItem('bgm_user_detail_by_yonjar',JSON.stringify(localData));
			});
		}
	}

	if(document.location.href.match(/mono\/character/)){
		//$('#columnA').css({"width": "100%",});
		
		$('#columnA .section h2').append(`<a id="add_collect" class="chiiBtn" href="javascript:;" style="font-size: 12px; margin-left: 20px;">收藏</a>`);
        $('#add_collect').on('click', () => {
			let characterlist = document.querySelectorAll('#columnA .section ul li');
			characterlist.forEach( (elem, index) => {
                let href = elem.querySelector('a.l').href;
                let ID = href.split('/character/')[1].toString();
                if(localData.characters.indexOf(ID) == -1) localData.characters.push(ID);
            });
            $(this).text('收藏成功！');
            localStorage.setItem('bgm_user_detail_by_yonjar',JSON.stringify(localData));
        });
		
		$('#columnA .section h2').append(`<a id="edit_collect" class="chiiBtn" href="javascript:;" style="font-size: 12px; margin-left: 20px;">管理收藏</a>`);
		$('#edit_collect').on('click', () => {
			let charasList = document.querySelectorAll('#columnA .section ul li');
			charasList.forEach( (elem, index) => {
				let charaId = elem.querySelector('a.l').href.split('/character/')[1].toString();
				let showBtn = document.createElement('a');showBtn.className = 'l';showBtn.href='javascript:;';showBtn.textContent = '❤';$(showBtn).css({"font-size":"12px","color":"grey"});
				$(elem.querySelector('a.l')).append(showBtn);
				chara_collect(charaId, showBtn);
			});
		});
	}
	if(document.location.href.match(/mono\/person/)){
		//$('#columnA').css({"width": "100%",});
		
        $('#columnA .section h2').append(`<a id="add_collect" class="chiiBtn" href="javascript:;" style="font-size: 12px; margin-left: 20px;">收藏</a>`);
        $('#add_collect').on('click', () => {
            let personlist = document.querySelectorAll('#columnA .section ul li');
            personlist.forEach( (elem, index) => {
                let href = elem.querySelector('a.l').href;
                let ID = href.split('/person/')[1].toString();
                if(localData.persons.indexOf(ID) == -1) localData.persons.push(ID);
            });
             $(this).text('收藏成功！');
            localStorage.setItem('bgm_user_detail_by_yonjar',JSON.stringify(localData));
        });
		
		$('#columnA .section h2').append(`<a id="edit_collect" class="chiiBtn" href="javascript:;" style="font-size: 12px; margin-left: 20px;">管理收藏</a>`);
		$('#edit_collect').on('click', () => {
			let personsList = document.querySelectorAll('#columnA .section ul li');
			personsList.forEach( (elem, index) => {
				let personId = elem.querySelector('a.l').href.split('/person/')[1].toString();
				let showBtn = document.createElement('a');showBtn.className = 'l';showBtn.href='javascript:;';showBtn.textContent = '❤';$(showBtn).css({"font-size":"12px","color":"grey"});
				$(elem.querySelector('a.l')).append(showBtn);
				person_collect(personId, showBtn);
			});
		});
	}

	if(document.location.href.match(/subject\/\.*/)){
		let charasList = document.querySelectorAll('#browserItemList li a.avatar');
		charasList.forEach( (elem, index) => {
			let charaId = elem.href.split('/character/')[1].toString();
			let showBtn = document.createElement('a');showBtn.className = 'l';showBtn.href='javascript:;';showBtn.textContent = '❤';$(showBtn).css({"font-size":"12px","color":"grey"});
			$(elem).append(showBtn);
			chara_collect(charaId, showBtn);
		});
		let cvList = document.querySelectorAll('#browserItemList li span.tip_j a');
		cvList.forEach( (elem, index) => {
			let personId = elem.href.split('/person/')[1].toString();
			let showBtn = document.createElement('a');showBtn.className = 'l';showBtn.href='javascript:;';showBtn.textContent = '❤';$(showBtn).css({"font-size":"12px","color":"grey"});
			$(elem).append(showBtn);
			person_collect(personId, showBtn);
		});
		let staffList = document.querySelectorAll('#infobox li a');
		staffList.forEach( (elem, index) => {
			let personID = elem.href.split('/person/')[1];
			if (localData.persons.includes(personID)){
				$(elem).css({"font-weight": "bold","color":"#fe8d98"});
			}
		});
	}
	if(window.location.href.match(/characters/)){
		let charasList = document.querySelectorAll('#columnInSubjectA .light_odd');
		charasList.forEach( (elem, index) => {
			let chara = elem.querySelectorAll('.clearit h2 a')[0];
			let charaId = chara.href.split('/character/')[1].toString();
			let showBtn = document.createElement('a');showBtn.className = 'l';showBtn.href='javascript:;';showBtn.textContent = '❤';$(showBtn).css({"font-size":"12px","color":"grey"});
			$(chara).append(showBtn);
			chara_collect(charaId, showBtn);
		});

		let cvList = document.querySelectorAll('.clearit .actorBadge');
		cvList.forEach( (elem,index)=> {
			let cv = elem.querySelectorAll('p a')[0];
			let personId = cv.href.split('/person/')[1].toString();
			let showBtn = document.createElement('a');showBtn.className = 'l';showBtn.href='javascript:;';showBtn.textContent = '❤';$(showBtn).css({"font-size":"12px","color":"grey"});
			$(cv).append(showBtn);
			person_collect(personId, showBtn);
		});
	}
	if(document.location.href.match(/character/)){
		let charasList = document.querySelectorAll('#columnCrtBrowserB .browserCrtList h3 a');
		charasList.forEach( (elem, index) => {
			let charaId = elem.href.split('/character/')[1].toString();
			let showBtn = document.createElement('a');showBtn.className = 'l';showBtn.href='javascript:;';showBtn.textContent = '❤';$(showBtn).css({"font-size":"12px","color":"grey"});
			$(elem).append(showBtn);
			chara_collect(charaId, showBtn);
		});
	}
	if(document.location.href.match(/person/)){
		let cvList = document.querySelectorAll('#columnCrtBrowserB .browserCrtList h3 a');
		cvList.forEach( (elem, index) => {
			let personId = elem.href.split('/person/')[1].toString();
			let showBtn = document.createElement('a');showBtn.className = 'l';showBtn.href='javascript:;';showBtn.textContent = '❤';$(showBtn).css({"font-size":"12px","color":"grey"});
			$(elem).append(showBtn);
			person_collect(personId, showBtn);
		});
	}
})();
