// ==UserScript==
// @name         TW6 ネームコピペフォーム
// @namespace    https://greasyfork.org/ja/scripts/377216
// @version      0.9
// @match        https://tw6.jp/scenario/show*
// @grant        none
// @description try to take over the world!
// @downloadURL https://update.greasyfork.org/scripts/377216/TW6%20%E3%83%8D%E3%83%BC%E3%83%A0%E3%82%B3%E3%83%94%E3%83%9A%E3%83%95%E3%82%A9%E3%83%BC%E3%83%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/377216/TW6%20%E3%83%8D%E3%83%BC%E3%83%A0%E3%82%B3%E3%83%94%E3%83%9A%E3%83%95%E3%82%A9%E3%83%BC%E3%83%A0.meta.js
// ==/UserScript==
(function() {

  var url = window.location.href ;

  //リプレイ作成ページ
  if(url.match(/show\?scenario_id/g)){
	//名前コピペフォーム
	var get_pc = document.getElementsByTagName('a');
	var name = [];
	var name_count = [];
	var dice = [];
	for(var gp1=0;gp1<get_pc.length;gp1++){
	  if(get_pc[gp1].href.match(/jp\/character\/status\/f/g)&&get_pc[gp1].className != "mychr"){

		/*リンクを別タブ化＆顔アイコンもリンク化*/
		get_pc[gp1].setAttribute('target', '_blank');
		if(get_pc[gp1].parentNode.parentNode.getElementsByTagName('img')[0]){
		  get_pc[gp1].parentNode.parentNode.getElementsByTagName('img')[0]
			.setAttribute('onclick', 'window.open("'+get_pc[gp1].href+'", "_blank")');

		  name[gp1] = get_pc[gp1].innerHTML.replace(/<("[^"]*"|'[^']*'|[^'">])*>|[💠]/g,'');
		  if(!name_count[name[gp1]]){
			name_count[name[gp1]] = 0;
		  }
		  name_count[name[gp1]]++;
		  //成功度を蓄積
		  /*
		  if(get_pc[gp1].parentNode.parentNode.className == "border"){
　　　　　//get_pc[gp1].parentNode.parentNode.style.display="none";
		  }
		  */
		  var div = document.createElement('div');
		  get_pc[gp1].parentNode.parentNode.insertBefore(div, get_pc[gp1].parentNode.nextSibling);

		  var input_full = document.createElement('input');
		  input_full.setAttribute('type', 'text');
		  input_full.setAttribute('onclick', 'this.select();document.execCommand(\'copy\');');
		  input_full.style.width="300px";
		  input_full.style.height="2em";
		  input_full.setAttribute('value', name[gp1]);
		  var input_1 = document.createElement('input');
		  input_1.setAttribute('type', 'text');
		  input_1.setAttribute('onclick', 'this.select();document.execCommand(\'copy\');');
		  input_1.style.width="100px";
		  input_1.style.height="2em";
		  input_1.setAttribute('value', name[gp1].split('・')[0]);
		  var input_2 = document.createElement('input');
		  input_2.setAttribute('type', 'text');
		  input_2.setAttribute('onclick', 'this.select();document.execCommand(\'copy\');');
		  input_2.style.width="100px";
		  input_2.style.height="2em";
		  input_2.setAttribute('value', name[gp1].split('・')[1]);
		  var br = document.createElement('br');
		  var span = document.createElement('span');
		  span.innerHTML = '（登場'+name_count[name[gp1]]+'回目）';
		  div.appendChild(input_full);
		  div.appendChild(br);
		  div.appendChild(input_1);
		  div.appendChild(input_2);
		  div.appendChild(span);



		}
	  }
	  if(get_pc[gp1].href.match(/jp\/scenario\/master\/show/g)){
		var ms_name = get_pc[gp1].innerHTML;
	  }
	}

	//宿敵イラスト別窓リンク
	var syou_img = document.querySelectorAll('th img');
	//        var syou_a = document.createElement('a');
	var syou_link = 'window.open("'+syou_img[syou_img.length-1].src+'", "_blank")';
	syou_img[syou_img.length-1].setAttribute('onclick', syou_link);

	//章頭スクローラー
	var scroll_div = document.createElement('div');
	var body = document.getElementsByTagName('body')[0];
//	var openhelp = document.getElementsByClassName('openhelp');
	var openhelp = document.querySelectorAll('.border.bgc08 h3 .openhelp');
	openhelp[openhelp.length-1].setAttribute('id', 'scroll_a1');
	var scroll_a1 = document.createElement('a');
	scroll_a1.href = "#scroll_a1";

	//→宿敵画像
	var scroll_img = document.createElement('img');
	scroll_img.setAttribute('src', syou_img[syou_img.length-1].src);
	scroll_a1.appendChild(scroll_img);

	//宿敵名称
	var boss_title = openhelp[openhelp.length-1]
	.parentNode.parentNode.parentNode;
	if(boss_title.innerHTML.match(/第[0-9]章 (集団戦|ボス戦)/)){

	  var boss_name = boss_title.innerHTML.replace(/『(.+)』|第\d章\s(ボス戦|集団戦|冒険|日常)\s|\s|<("[^"]*"|'[^']*'|[^'">])*>|❓/g,"$1");


	  var scroll_span = document.createElement('input');
	  scroll_span
//		.setAttribute('onclick', "document.getSelection().selectAllChildren(this);document.execCommand('copy');");
		.setAttribute('onclick', 'this.select();document.execCommand(\'copy\');');

	  scroll_span.value = boss_name;
	  var boss_ubc1 = document.createElement('span');
	  boss_ubc1.textContent = "(Ｐ)";
	  var boss_ubc2 = document.createElement('span');
	  boss_ubc2.textContent = "(Ｓ)";
	  var boss_ubc3 = document.createElement('span');
	  boss_ubc3.textContent = "(Ｗ)";
	  var boss_tr = boss_title
	  .parentNode.parentNode.parentNode.getElementsByTagName('tr');
	  boss_ubc1
		.setAttribute('data-tooltip', boss_tr[2].getElementsByTagName('td')[0].innerHTML
					  .replace(/\s/g,"").replace(/<br>/g,"//"));
	  boss_ubc1.setAttribute('target', "_blank");
	  boss_ubc1.setAttribute('class', "psw");
	  boss_ubc2
		.setAttribute('data-tooltip', boss_tr[3].getElementsByTagName('td')[0].innerHTML
					  .replace(/\s/g,"").replace(/<br>/g,"//"));
	  boss_ubc2.setAttribute('target', "_blank");
	  boss_ubc2.setAttribute('class', "psw");
	  boss_ubc3
		.setAttribute('data-tooltip', boss_tr[4].getElementsByTagName('td')[0].innerHTML
					  .replace(/\s/g,"").replace(/<br>/g,"//"));
	  boss_ubc3.setAttribute('target', "_blank");
	  boss_ubc3.setAttribute('class', "psw");

	  scroll_div.appendChild(scroll_span);
	  scroll_div.appendChild(scroll_a1);
	  scroll_div.appendChild(boss_ubc1);
	  scroll_div.appendChild(boss_ubc2);
	  scroll_div.appendChild(boss_ubc3);

	}else{
	  scroll_div.appendChild(scroll_a1);
	}



	body.insertBefore(scroll_div, body.firstChild);
	scroll_div.setAttribute('class', 'scroll_div');

	document.getElementsByTagName('style')[0].innerHTML
	  +=".scroll_div{"
	  +"position:fixed;z-index:9999;left:auto;right:0;background-color:#bed3ca;"
	  +"font-size:14px;width:100px;text-align:center;"
	  +"}"
	  +"span.psw:hover:after {position: absolute;content: attr(data-tooltip);"
	  +"top: 1em;right: 0;width: 200px;background: gold;}"
	  +"span.psw:hover {position: relative;}"

	  +".scroll_div input{width:90px;height:2em;font-size:inherit;padding:inherit;}"
	;

	//ツイッターリンクの拡張
	var footer = document.getElementsByClassName('footer')[0].getElementsByTagName('a')[0];
	var op_title = document.title.replace(/(\s\-\s第六猟兵\s\-\sJAEGER\sSIXTH\s\-)/g,'');
	var syou = "";
	if(openhelp.length > 0){
	  syou = "第一章";
	}
	if(openhelp.length > 1){
	  syou = "第二章";
	}
	if(openhelp.length > 2){
	  syou = "第三章";
	}

	footer.href = footer.href+"&text=【"+ms_name+"】『"+op_title+"』"+syou+"%0A%0A";


  }
})();