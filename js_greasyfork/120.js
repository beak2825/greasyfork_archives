// ==UserScript==
// @name	Tieba Imagizer
// @namespace	http://gera2ld.blog.163.com/
// @author	Gerald <gera2ld@163.com>
// @icon	http://s.gravatar.com/avatar/a0ad718d86d21262ccd6ff271ece08a3?s=80
// @version	1.2.7.1
// @description	贴吧图化 - Gerald倾情打造
// @homepageURL	http://geraldl.net/userjs/TiebaImagizer
// @include	http://tieba.baidu.com/*
// @exclude	http://tieba.baidu.com/tb/*
// @require	https://greasyfork.org/scripts/144/code.user.js
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/120/Tieba%20Imagizer.user.js
// @updateURL https://update.greasyfork.org/scripts/120/Tieba%20Imagizer.meta.js
// ==/UserScript==

var loadingURL='http://tieba.baidu.com/tb/static-ihome/img/loading2.gif';
// 初始化颜色选择面板
function initColorPanel() {
	if(utils.colorInput) return;
	// Check support for input[type=color]
	var i=document.createElement('input');
	i.setAttribute('type','color');
	if(i.type=='color')
		return utils.colorInput=function(id,key,def,func){
			return utils.bindProp($('<input type=color id='+id+' class="ge_rsep colorbox">'),'value',key,def,func,['change','keyup']);
		};

	utils.addStyle('\
#colors{display:none;position:absolute;background:white;border:2px ridge;padding:10px;cursor:default;}\
#colors .colors{width:261px;cursor:pointer;margin:2px;border-collapse:separate;border-spacing:1px;background:black;}\
#colors .colors td{display:table-cell !important;width:12px;height:12px;border:none;emptycells:show;}\
.colorbox{width:12px;height:12px;border:1px solid;display:inline-block;position:relative;top:3px;}\
');
	var cp=$('<div id=colors>').click(function(e){e.stopPropagation();}),r,c,t;
	r=function(e){
		var d=$(e.target).attr('data');
		if(d) {
			if(e.type=='mouseover') {
				if(c) c.css('outline','none');
				c=$(e.target).css('outline','1px outset yellow');
				$('#ge_vcolor').val(d);
			} else cp.owner.setColor(d);
		}
	};
	t=$('<table class=colors>').appendTo(cp).mouseover(r).click(r);
	var k=['00','33','66','99','cc','ff'],p=['#ffffff','#ff0000','#00ff00','#0000ff','#ffff00','#00ffff','#ff00ff'];
	for(var i=0;i<12;i++) {
		r=$('<tr>').appendTo(t);
		if(i<6) c='#'+k[i]+k[i]+k[i]; else c=p[i-6];
		$('<td>').appendTo(r).css({background:c}).attr('data',c);
		if(!i) $('<td rowspan=12 style="background:white;">').appendTo(r);
		for(var j=0;j<18;j++) {
			c='#'+k[Math.floor(i/6)*3+Math.floor(j/6)]+k[j%6]+k[i%6];
			$('<td>').appendTo(r).css({background:c}).attr('data',c);
		}
	}
	t=$('<form>').appendTo(cp);
	$('<span id=ge_scolor class="ge_rsep colorbox">').appendTo(t);
	r=function(){$('#ge_scolor').css('background',this.value);};
	$('<input type=text id=ge_vcolor style="width:60px" class=ge_rsep>').appendTo(t).change(r).keyup(r);
	r=function(e){e.preventDefault();cp.owner.setColor($('#ge_scolor').css('background-color'));};
	$('<span class=ge_sbtn>OK</span>').appendTo(t).click(r);t.submit(r);
	c=null;
	utils.colorInput=function(id,key,def,func){
		var o=$('<span id='+id+' class=colorbox>'),c=utils.getObj(key,def);
		o.css({border:'1px outset white',cursor:'pointer',background:c}).attr('data',c).click(function(e){
			if(cp.owner!=o) {
				cp.owner=o;cp.appendTo(o).css({top:'auto',bottom:'auto'}).show();
				if(cp.offset().top+cp.height()>pageYOffset+innerHeight) cp.css('bottom','14px');
				else cp.css('top','14px');
				$('#ge_scolor').css('background',e=o.attr('data'));
				$('#ge_vcolor').val(e);
			} else {cp.owner=null;cp.hide();}
		});
		o.setColor=function(v){
			v=v.replace(/rgb\((\d+),\s?(\d+),\s?(\d+)\)/i,function(v,g1,g2,g3){
				v=[g1,g2,g3];for(g1 in v) {v[g1]=parseInt(v[g1]).toString(16);if(v[g1].length<2) v[g1]='0'+v[g1];}
				return '#'+v.join('');
			});
			o.attr('data',v).css('background',v);
			utils.setObj(key,v);
			cp.owner=null;cp.hide();func();
		};
		o[0].val=function(){return o.attr('data');};
		return o[0];
	};
}
function dataURL2Blob(dataURL) {
	var data=dataURL.match(/^data:(.*?);base64,(.*)$/),
			raw=atob(data[2]),
			buf=new ArrayBuffer(raw.length),
			intarr=new Uint8Array(buf),i;
	for(i=0;i<raw.length;i++) intarr[i]=raw.charCodeAt(i);
	return new Blob([buf], {type:data[1]});
}
function initImagizer(editor){
	var st=utils.addStyle(),content=null,ebody=editor.$body,
			op=utils.addRPopup(utils.addSButton('图 化')).panel;
	function getStyle() {
		var s={},t=[];
		if($('#w2iitalic').prop('checked')) t.push('italic');
		if($('#w2ibold').prop('checked')) t.push('bold');
		t.push($('#w2isize').val()+'px');
		if(f.val()) t.push(f.val());
		s.font=t.join(' ');
		s.color=cf.val();
		s.background=$('#w2iabgclr').prop('checked')?cb.val():'inherit';
		return s;
	}
	function undo(){
		if(!content) return;
		ebody.html(content);content=null;
		bUndo.addClass('ge_disabled');
	}
	utils.uploadImage=function(dataURL,node) {
		function error(){
			alert('图片上传发生错误！');
			undo();
		}
		$.get('/dc/common/imgtbs',function(r) {
			var data=new FormData();
			data.append('tbs',r.data.tbs);
			data.append('file',dataURL2Blob(dataURL));
			$.ajax({
				type:'POST',
				url:'http://upload.tieba.baidu.com/upload/pic',
				contentType:false,
				processData:false,
				data:data,
				dataType:'json',
				xhrFields:{
					withCredentials:true,
				},
				success:function(c){
					if(c.error_code) error(); else {
						var e='http://imgsrc.baidu.com/forum/pic/item/'+c.info.pic_id_encode+'.jpg';
						$(node).replaceWith('<img class="BDE_Image" src="'+e+'" pic_type="0" onload="EditorUI.resizeImage(this,560)">');
					}
				},
				error:error,
			});
		},'json');
	};
	var u=$('<div class=ge_sbtn style="margin:0 0 2px;">开始图化</div>').appendTo(op).click(word2Image);
	// Extracted from ueditor.js
	function extractContents(H) {
		function remove(i){i.parentNode.removeChild(i);}
		function findParents(i){
			var a=[i];
			while(i.parentNode!==editor.body&&(i=i.parentNode)) a.unshift(i);
			return a;
		}
		var F = H.startContainer, E = H.endContainer, N = H.startOffset, G = H.endOffset, T = H.document, B = T.createDocumentFragment(), I, K;
		if (F.nodeType == 1) {
				F = F.childNodes[N] || (I = F.appendChild(T.createTextNode("")))
		}
		if (E.nodeType == 1) {
				E = E.childNodes[G] || (K = E.appendChild(T.createTextNode("")))
		}
		if (F === E && F.nodeType == 3) {
				B.appendChild(T.createTextNode(F.substringData(N, G - N)));
				F.deleteData(N, G - N);
				H.collapse(true)
				return B
		}
		var J, P, R = B, Q = findParents(F), C = findParents(E);
		for (var O = 0; Q[O] == C[O]; ) {
				O++
		}
		for (var M = O, S; S = Q[M]; M++) {
				J = S.nextSibling;
				if (S == F) {
						if (!I) {
								if (H.startContainer.nodeType == 3) {
										R.appendChild(T.createTextNode(F.nodeValue.slice(N)));
								} else {
										R.appendChild(F)
								}
						}
				} else {
						P = S.cloneNode(false);
						R.appendChild(P)
				}
				while (J) {
						if (J === E || J === C[M]) {
								break
						}
						S = J.nextSibling;
						R.appendChild(J);
						J = S
				}
				R = P
		}
		R = B;
		if (!Q[O]) {
				R.appendChild(Q[O - 1].cloneNode(false));
				R = R.firstChild
		}
		for (var M = O, D; D = C[M]; M++) {
				J = D.previousSibling;
				if (D == E) {
						if (!K && H.endContainer.nodeType == 3) {
								R.appendChild(T.createTextNode(E.substringData(0, G)));
								E.deleteData(0, G)
						}
				} else {
						P = D.cloneNode(false);
						R.appendChild(P)
				}
				if (M != O || !Q[O]) {
						while (J) {
								if (J === F) {
										break
								}
								D = J.previousSibling;
								R.insertBefore(J, R.firstChild);
								J = D
						}
				}
				R = P
		}
		H.setStartBefore(!C[O] ? C[O - 1] : !Q[O] ? Q[O - 1] : C[O]).collapse(true);
		I && remove(I);
		K && remove(K);
		return B
	}
	function innerText(o) {
		return $('<div>').append(o.childNodes||o.html()).html(function(i,h){return h.replace(/<br>(<\/p>)?|<\/p>/gi,'\n');}).text().replace(/\s+$/,'');
	}
	function word2Image(){
		content=ebody.html();
		bUndo.removeClass('ge_disabled');
		var fz=parseInt($('#w2isize').val()),loading=$('<img title="双击撤销">').attr('src',loadingURL),
				r=editor.selection.getRange(),s=null;
		if(!r.collapsed) s=innerText(extractContents(r));
		if(s&&/\S/.test(s)) {
			r.insertNode(loading[0]);
		} else {
			s=innerText(ebody);
			if(!/\S/.test(s)) return;
			ebody.html(loading);
		}
		var lines=s.split('\n'),w=0,c=document.createElement('canvas'),d=c.getContext('2d'),lh=Math.round(1.5*fz),data=[];
		s=getStyle();
		d.font=s.font;
		lines.forEach(function(line){
			line=line.replace(/\s+$/,'');
			do {
				for(var l=0,j=0;j<line.length;j++) {
					l+=d.measureText(line[j]).width;
					if(l>560) break; else if(w<l) w=l;
				}
				data.push(line.substr(0,j));
				line=line.substr(j);
			} while(line);
		});
		c.height=lh*data.length;
		c.width=w;
		if($('#w2ishadow').prop('checked')) {
			d.shadowColor='gray';
			d.shadowBlur=d.shadowOffsetY=d.shadowOffsetX=Math.ceil(fz/25);
		}
		if($('#w2iabgclr').prop('checked')) {
			d.fillStyle=s.background;
			d.fillRect(0,0,w,c.height);
		}
		d.font=s.font;
		d.fillStyle=d.strokeStyle=s.color;
		e=$('#w2istroke').prop('checked')?d.strokeText:d.fillText;
		i=0;data.forEach(function(j){e.call(d,j,0,fz+lh*(i++));});
		utils.uploadImage(c.toDataURL(),loading);
	}
	function checkFont(e) {
		e=getStyle();var i,s='';
		for(i in e) e[i]+=' !important';
		if($('#w2ipreview').prop('checked')) st.html('#ueditor_replace{font:'+e.font+';color:'+e.color+';background:'+e.background+'}');
		else st.html('');
		for(i in e) s+=i+':'+e[i]+';';
		f.css('cssText',s);
	}
	utils.addStyle('#w2iface{max-width:800px;max-height:400px;}');
	var ff=utils.list('w2ifaces','w2ifaceid',null,['微软雅黑']).load();
	var f=$('<select id=w2iface>').appendTo($('<label>字体：</label>').appendTo(op)).change(function(e){ff.load(f.prop('selectedIndex'));checkFont();});
	ff.list.forEach(function(i){$('<option>'+i+'</option>').appendTo(f);});f.prop('selectedIndex',ff.last);
	$('<span class=ge_sbtn>+</span>').appendTo(op).click(function(e){
		if(e=prompt('请输入字体名称：')) {
			ff.load(ff.push(e));
			$('<option>').text(e).appendTo(f);
			f.val(e);checkFont();
		}
	});
	$('<span class=ge_sbtn>-</span>').appendTo(op).click(function(e){
		e=f.prop('selectedIndex');
		f.children(':eq('+e+')').remove();
		ff.pop(e);ff.load(f.prop('selectedIndex'));checkFont();
	});
	initColorPanel();
	var cf,cb;
	utils.bindProp($('<input type=checkbox id=w2ipreview>').appendTo(op),'checked','w2ipreview',false,checkFont);
	$('<label for=w2ipreview>预览</label><br><label for=w2icolor>颜色：</label>').appendTo(op);
	$(cf=utils.colorInput('w2icolor','w2icolor','#2222ff',checkFont)).appendTo(op).addClass('ge_rsep');
	$('<label for=w2isize>大小：</label>').appendTo(op);
	utils.bindProp($('<input type=number id=w2isize min=9 class=ge_rsep style="height:18px;width:40px;">').appendTo(op),'value','w2isize',22,checkFont);
	utils.bindProp($('<input type=checkbox id=w2iabgclr>').appendTo(op),'checked','w2iabgclr',false,checkFont);
	$('<label for=w2iabgclr>背景色：</label>').appendTo(op);
	$(cb=utils.colorInput('w2ibgclr','w2ibgclr','#efe4b0',checkFont)).appendTo(op);
	$('<br>').appendTo(op);
	utils.bindProp($('<input type=checkbox id=w2ibold>').appendTo(op),'checked','w2ibold',false,checkFont);
	$('<label for=w2ibold class=ge_rsep>加粗</label>').appendTo(op);
	utils.bindProp($('<input type=checkbox id=w2iitalic>').appendTo(op),'checked','w2iitalic',false,checkFont);
	$('<label for=w2iitalic class=ge_rsep>倾斜</label>').appendTo(op);
	utils.bindProp($('<input type=checkbox id=w2ishadow>').appendTo(op),'checked','w2ishadow',false,checkFont);
	$('<label for=w2ishadow class=ge_rsep>阴影</label>').appendTo(op);
	utils.bindProp($('<input type=checkbox id=w2istroke>').appendTo(op),'checked','w2istroke',false,checkFont);
	$('<label for=w2istroke class=ge_rsep>镂空</label>').appendTo(op);
	var bUndo=$('<span class="ge_sbtn ge_disabled" title="回到最后一次图化前的状态">撤销图化</span>').appendTo(op).click(undo);
	f.prop('selectedIndex',ff.last);checkFont();
}

if(unsafeWindow.PosterContext&&unsafeWindow.PosterContext.isPostAllowed()) utils.wait(unsafeWindow,'test_editor',initImagizer);
