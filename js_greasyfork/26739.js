// ==UserScript==
// @name		[Konachan / yande.re / LB] Avatar: Storage
// @namespace	Zolxys
// @description	Lets you save a list of avatars in your browser's local storage for later use. Save avatars from the "Set avatar" page. Avatars are accessible from the "Profile" and "Set Avatar" pages. Drag avatars to reorder. Click on avatars for options.
// @include		/^https?://konachan\.com/(user/(show|set_avatar)/\d+($|\?|#)|images/blank\.gif\#Zolxys_AvatarStorage)/
// @include		/^https?://konachan\.net/(user/(show|set_avatar)/\d+($|\?|#)|images/blank\.gif\#Zolxys_AvatarStorage)/
// @include		/^https?://yande\.re/user/(show|set_avatar)/\d+($|\?|#)/
// @include		/^https?://lolibooru\.moe/user/(show|set_avatar)/\d+($|\?|#)/
// @version		1.4
// @downloadURL https://update.greasyfork.org/scripts/26739/%5BKonachan%20%20yandere%20%20LB%5D%20Avatar%3A%20Storage.user.js
// @updateURL https://update.greasyfork.org/scripts/26739/%5BKonachan%20%20yandere%20%20LB%5D%20Avatar%3A%20Storage.meta.js
// ==/UserScript==
spacing = 3;
upwardList = false;

function parse(s, b = false) {
	try {
		var a = JSON.parse(s);
		if (!Array.isArray(a))
			throw '';
	}
	catch (e) {
		if (b)
			alert('Invalid JSON data found in localStorage.Zolxys_AvatarStorage');
		return null;
	}
	for (var i = a.length - 1; i >= 0; --i)
		if (typeof a[i] != 'object')
			a.splice(i,1);
	return a;
}
function avatarList() {
	return (localStorage.Zolxys_AvatarStorage)? parse(localStorage.Zolxys_AvatarStorage, true) : [];
}
function openMenu(e) {
	if (e.ctrlKey || e.altKey || e.shiftKey)
		return;
	e.stopPropagation();
	e.preventDefault();
	var o = document.getElementById('zol_AvatarStorage_Menu');
	if (o.visible() && e.button != 2 && document.getElementById('zol_AvatarStorage_Remove').getAttribute('zol_id') == this.id)
		o.style.display = 'none';
	else {
		document.getElementById('zol_AvatarStorage_Set').href = this.parentNode.href;
		document.getElementById('zol_AvatarStorage_Remove').setAttribute('zol_id', this.id);
		o.style.display = 'inline-block';
		document.getElementById('zol_AvatarStorage_Import').focus();
		o.style.marginLeft = 0;
		o.style.marginLeft = (e.clientX - o.getBoundingClientRect().x - Math.max(e.clientX + o.getBoundingClientRect().width - document.body.clientWidth, 0)) +'px';
		o.style.marginTop = 0;
		o.style.marginTop = (e.clientY - o.getBoundingClientRect().y - Math.max(e.clientY + o.getBoundingClientRect().height - innerHeight, 0)) +'px';
	}
	document.getElementById('zol_AvatarStorage').style.display = 'inline-block';
}
function checkAvatar(o) {
	try {
		var r = /^(?:https?:)?\/\/[^/]+(\/.+)/.exec(o.img);
		if (r)
			o.img = r[1];
		r = /^(\/.+\/)[^/]+(\.[^./]+)($|\?|#)/.exec(o.img);
		if (r)
			o.img = r[1] +'z'+ r[2];
		if (!isNaN(o.id) && !isNaN(o.x) && !isNaN(o.y) && !isNaN(o.x2) && !isNaN(o.y2) && !isNaN(o.w) && !isNaN(o.h) && o.img)
			return {id: o.id, x: o.x, y: o.y, x2: o.x2, y2: o.y2, w: o.w, h: o.h, img: o.img};
	} catch (e) {}
	return null;
}
function addAvatar(add, a) {
	for (var i = 0; i < a.length; ++i)
		if (a[i].id == add.id && a[i].x == add.x && a[i].y == add.y && a[i].x2 == add.x2 && a[i].y2 == add.y2)
			return a;
	if (add = checkAvatar(add))
		a.push(add);
	return a;
}
function save(a, ts = null) {
	localStorage.Zolxys_AvatarStorage = JSON.stringify(a);
	if (kona) {
		localStorage.Zolxys_AvatarStorage_ts = (tsm[0] & 15) +' '+ (lts = ((ts == null)? Date.now() : ts));
		if (ts == null)
			mrg = [[[], 0]];
		for (var i = fa.length - 1; i >= 0; --i)
			fa[i][1].contentWindow.postMessage(['Zolxys_AvatarStorage', localStorage.Zolxys_AvatarStorage_ts, localStorage.Zolxys_AvatarStorage], fa[i][0]);
	}
	var o = document.getElementById('zol_AvatarStorage');
	if (o.visible()) {
		o.style.display = 'none';
		document.getElementById('zol_AvatarStorage_Menu').style.display = 'none';
		document.getElementById('zol_AvatarStorage_Link').click();
	}
}
function importAvatars(e) {
	e.stopPropagation();
	e.preventDefault();
	var a, aa;
	var s = e.clipboardData.getData('text');
	try {
		a = (s)? JSON.parse(s) : null;
	}
	catch (e) {
		alert('Invalid JSON data found in pasted input');
		return;
	}
	if (!a || !(aa = avatarList()))
		return;
	var i = 0;
	var r = null, x;
	if (typeof a[0] == 'string') {
		r = /(?:^|\.)(([^.]+)\.[^.]+)$/;
		x = r.exec(location.hostname);
		r = r.exec(a[0]);
		if (!r || !x || r[2] != x[2]) {
			alert('The pasted input is labeled for use on '+ a[0]);
			return;
		}
		++i;
	}
	for (; i < a.length; ++i)
		aa = addAvatar(a[i], aa);
	save(aa);
}
function newStoragePopupLink(before) {
	var ne = document.createElement('a');
	ne.id = 'zol_AvatarStorage_Link';
	ne.href = '#';
	ne.textContent = 'Avatar storage';
	ne.addEventListener('click', function (e) { // Main Link EL: Open List
		e.stopPropagation();
		e.preventDefault();
		if (document.getElementById('zol_AvatarStorage').visible()) {
			document.getElementById('zol_AvatarStorage').style.display = 'none';
			document.getElementById('zol_AvatarStorage_Menu').style.display = 'none';
		}
		else {
			var a = document.getElementById('zol_AvatarStorage').childNodes;
			for (var i = a.length-1; i >= 0; --i)
				a[i].parentNode.removeChild(a[i]);
			var o = document.getElementById('zol_AvatarStorage');
			if (!(a = avatarList()))
				return;
			var r = /^\/user\/show\/(\d+)/.exec(location.pathname);
			if (!r)
				r = /[&?]user_id=(\d+)(&|$)/.exec(location.search);
			var uid = (r)? '&user_id='+ r[1] : '';
			var col = Math.floor((innerHeight - 10 + spacing) / (125 + spacing));
			if (!a.length) {
				var ne = document.createElement('span');
				ne.textContent = 'There are no saved avatars for this domain: '+ location.hostname;
				o.appendChild(ne);
				o.appendChild(document.createElement('br'));
				o.appendChild(document.createElement('hr'));
				o.appendChild(document.createTextNode('Import from text:'));
				o.appendChild(document.createElement('br'));
				ne = o.appendChild(document.createElement('input'));
				ne.id = 'zol_AvatarStorage_Import';
				ne.addEventListener('paste', importAvatars);
				o.style.width = '';
				o.style.height = '';
				o.style.display = 'inline-block';
				ne.focus();
			}
			else {
				for (var i = 0; i < a.length; ++i) {
					var w = (a[i].x2 - a[i].x) * a[i].w;
					var h = (a[i].y2 - a[i].y) * a[i].h;
					var sc = Math.min(125/w, 125/h);
					var ne = document.createElement('img');
					ne.style.backgroundColor = '#222';
					ne.src = a[i].img;
					ne.style.width = Math.round(a[i].w * sc) +'px';
					ne.style.height = Math.round(a[i].h * sc) +'px';
					ne.style.left = Math.round(a[i].x * a[i].w * sc * -1) +'px';
					ne.style.top = Math.round(a[i].y * a[i].h * sc * -1) +'px';
					ne.setAttribute('zol_id', a[i].id);
					ne.setAttribute('zol_x', a[i].x);
					ne.setAttribute('zol_y', a[i].y);
					ne.setAttribute('zol_x2', a[i].x2);
					ne.setAttribute('zol_y2', a[i].y2);
					ne.setAttribute('zol_w', a[i].w);
					ne.setAttribute('zol_h', a[i].h);
					ne.setAttribute('zol_img', a[i].img);
					ne.id = 'zol_AvatarStorage_Img'+ i;
					ne.addEventListener('click', openMenu);
					ne.addEventListener('contextmenu', openMenu);
					ne.addEventListener('dragover', function (e) { // Image Drag-Over EL
						if (/^zol_AvatarStorage_Img\d+$/.test(this.id))
							e.preventDefault();
					});
					ne.addEventListener('drop', function (e) { // Image Drop EL
						e.preventDefault();
						var o = document.getElementById(e.dataTransfer.getData('text')); // Warning: dataTransfer will be null if an alert is used prior to this
						var fr = null, to = null;
						var a = avatarList();
						if (!a)
							return;
						var d = {
							id: o.getAttribute('zol_id'),
						 	x: o.getAttribute('zol_x'),
						 	y: o.getAttribute('zol_y'),
						 	x2: o.getAttribute('zol_x2'),
						 	y2: o.getAttribute('zol_y2'),
							w: o.getAttribute('zol_w'),
							h: o.getAttribute('zol_h'),
							img: o.getAttribute('zol_img')
						};
						for (var i = 0; i < a.length; ++i)
						 if (a[i].id == d.id && a[i].x == d.x && a[i].y == d.y && a[i].x2 == d.x2 && a[i].y2 == d.y2 && a[i].w == d.w && a[i].h == d.h && a[i].img == d.img) {
						 	fr = i;
							break;
						}
						d = {
							id: this.getAttribute('zol_id'),
						 	x: this.getAttribute('zol_x'),
						 	y: this.getAttribute('zol_y'),
						 	x2: this.getAttribute('zol_x2'),
						 	y2: this.getAttribute('zol_y2'),
							w: this.getAttribute('zol_w'),
							h: this.getAttribute('zol_h'),
							img: this.getAttribute('zol_img')
						};
						for (var i = 0; i < a.length; ++i)
						 if (a[i].id == d.id && a[i].x == d.x && a[i].y == d.y && a[i].x2 == d.x2 && a[i].y2 == d.y2 && a[i].w == d.w && a[i].h == d.h && a[i].img == d.img) {
						 	to = i;
							break;
						}
						if (fr != null && to != null) {
							a.splice(to, 0, a.splice(fr, 1)[0]);
							save(a);
						}
					});
					var ee = ne;
					ne = document.createElement('a');
					ne.appendChild(ee);
					ne.href = location.protocol +'//'+ location.host +'/user/set_avatar/'+ a[i].id +'?x='+ a[i].x * a[i].w +'&y='+ a[i].y * a[i].h +'&x2='+ a[i].x2 * a[i].w +'&y2='+ a[i].y2 * a[i].h + uid;
					ne.addEventListener('dragstart', function (e) { // Image (<a>) Drag EL
						e.dataTransfer.setData("text", this.getElementsByTagName('img')[0].id);
					});
					ee = ne;
					ne = document.createElement('div');
					ne.appendChild(ee);
					ne.className = 'imgCrop_previewWrap';
					ne.style.width = Math.round(w * sc) +'px';
					ne.style.height = Math.round(h * sc) +'px';
					ne.style.position = 'absolute';
					ne.style.marginTop = ((125 + spacing) * (i%col)) +'px';
					ne.style.marginLeft = ((125 + spacing) * Math.floor(i/col)) +'px';
					o.appendChild(ne);
				}
				o.style.width = ((125 + spacing) * Math.ceil(a.length / col) - spacing) +'px';
				o.style.height = ((125 + spacing) * Math.min(col, a.length) - spacing) +'px';
			}
			o = document.getElementById('zol_AvatarStorage');
			o.style.display = 'inline-block';
			o.style.marginTop = 0;
			if (upwardList)
				o.style.marginTop = (-1 * Math.min(o.getBoundingClientRect().height, o.getBoundingClientRect().y)) +'px';
			else
				o.style.marginTop = Math.min(innerHeight - o.getBoundingClientRect().bottom, 0) +'px';
			o.style.marginLeft = 0;
			o.style.marginLeft = Math.max(Math.min(document.body.clientWidth - o.getBoundingClientRect().right, 0), 10 - o.getBoundingClientRect().x) +'px';
		}
	});
	before.parentNode.insertBefore(ne, before);
	ne = document.createElement('ul');
	ne.id = 'zol_AvatarStorage';
	ne.className = 'submenu';
	ne.style.background = 'none repeat scroll 0 0 black';
	ne.style.border = '1px solid #666';
	ne.style.display = 'none';
	ne.style.margin = '0';
	ne.style.padding = '4px';
	ne.style.position = 'absolute';
	ne.style.textAlign = 'left';
	ne.style.whiteSpace = 'pre';
	ne.style.zIndex = '1000';
	ne.addEventListener('click', function (e) {
		e.stopPropagation();
	});
	before.parentNode.insertBefore(ne, before);
	ne = document.createElement('ul');
	ne.id = 'zol_AvatarStorage_Menu';
	ne.className = 'submenu';
	ne.style.background = 'none repeat scroll 0 0 black';
	ne.style.border = '1px solid #666';
	ne.style.display = 'none';
	ne.style.margin = '0';
	ne.style.padding = '3px 4px 5px';
	ne.style.position = 'absolute';
	ne.style.textAlign = 'left';
	ne.style.whiteSpace = 'nowrap';
	ne.style.zIndex = '1001';
	ne.addEventListener('click', function (e) {
		e.stopPropagation();
	});
	before.parentNode.insertBefore(ne, before);
	document.addEventListener('click', function (e) { // This is only really needed for yande.re (2017-01-21)
		if (e.button)
			return;
		document.getElementById('zol_AvatarStorage').style.display = 'none';
		document.getElementById('zol_AvatarStorage_Menu').style.display = 'none';
	});
	var o = ne;
	ne = o.appendChild(document.createElement('a'));
	ne.textContent = 'Set avatar';
	ne.id = 'zol_AvatarStorage_Set';
	o.appendChild(document.createElement('br'));
	ne = o.appendChild(document.createElement('a'));
	ne.textContent = 'Remove avatar';
	ne.id = 'zol_AvatarStorage_Remove';
	ne.href = '#';
	ne.addEventListener('click', function (e) { // Remove EL
		e.stopPropagation();
		e.preventDefault();
		if (confirm('Are you sure you want to remove this avatar?')) {
			var a = avatarList();
			if (!a)
				return;
			for (var i = 0; i < a.length; ++i) {
				var id = document.getElementById(this.getAttribute('zol_id'));
				if (a[i].id == id.getAttribute('zol_id')
				 	&& a[i].x == id.getAttribute('zol_x')
				 	&& a[i].y == id.getAttribute('zol_y')
				 	&& a[i].x2 == id.getAttribute('zol_x2')
				 	&& a[i].y2 == id.getAttribute('zol_y2')
					&& a[i].w == id.getAttribute('zol_w')
					&& a[i].h == id.getAttribute('zol_h')
					&& a[i].img == id.getAttribute('zol_img')
				) {
				 	a.splice(i, 1);
					save(a);
					break;
				}
			}
		}
	});
	o.appendChild(document.createElement('br'));
	o.appendChild(document.createElement('hr'));
	ne = o.appendChild(document.createElement('a'));
	ne.textContent = 'Export list to clipboard';
	ne.href = '#';
	ne.addEventListener('click', function (e) { // Export EL
		e.stopPropagation();
		e.preventDefault();
		var a = avatarList();
		if (!a)
			return;
		a.unshift(location.hostname);
		var ne = document.createElement('textarea');
		ne.textContent = JSON.stringify(a);
		document.body.appendChild(ne);
		ne.select();
		document.execCommand('copy');
		document.body.removeChild(ne);
	});
	o.appendChild(document.createElement('br'));
	o.appendChild(document.createTextNode('Import from text:'));
	o.appendChild(document.createElement('br'));
	ne = o.appendChild(document.createElement('input'));
	ne.id = 'zol_AvatarStorage_Import';
	ne.addEventListener('paste', importAvatars);
}
function checkRemote(s, b = false) {
	var sa = parse(s, b);
	if (!sa)
		return null;
	var a = [];
	var o;
	for (var i = 0; i < sa.length; ++i)
		if (o = checkAvatar(sa[i]))
			a.push(o);
	return a;
}
function mergeData(aa, a) {
	if (!a)
		return aa;
	for (var i = 0; i < a.length; ++i)
		addAvatar(a[i], aa);
	return aa;
}
function recieve(e) {
	var r = /^http(s?):\/\/konachan\.(com|net)$/;
	var x = r.exec(e.origin);
	if (!kona || !Array.isArray(e.data) || e.data[0] != 'Zolxys_AvatarStorage' || !x)
		return;
	if (sub) {
		localStorage.Zolxys_AvatarStorage = e.data[2];
		localStorage.Zolxys_AvatarStorage_ts = e.data[1];
		return;
	}
	var o = document.getElementById('zol_AvatarStorage_'+ e.origin);
	if (!o)
		return;
	var a = checkRemote((localStorage.Zolxys_AvatarStorage || '[]'), true);
	if (!a)
		return;
	x = [x, r.exec(location.protocol +'//'+ location.host)];
	if (!e.data[1])
		e.data[1] = '0 0';
	var ts = (Number(e.data[1].substr(2)) || 0);
	lts = (localStorage.Zolxys_AvatarStorage_ts || '0 0');
	tsm = [
		((Number(e.data[1].substr(0,2)) || 0) | (((x[0][1])? 2 : 1) * ((x[0][2] == 'com')? 4 : 1))) & 15,
		((Number(	lts.substr(0,2))	|| 0) | (((x[1][1])? 2 : 1) * ((x[1][2] == 'com')? 4 : 1))) & 15,
	];
	tsm[0] |= tsm[1];
	lts = (Number(lts.substr(2)) || 0);
	var i = fa.length - 1;
	while (i >= 0)
		if (fa[i--][1] == o)
			break;
	if (i == -1)
		fa.push([e.origin, o]);
	var rec = localStorage.Zolxys_AvatarStorage;
	if (lts == 0)
		mrg.push(rec);
	if (ts == 0 && tsm[0] != tsm[1])
		mrg.push(e.data[2]);
	else if (ts < lts) {
		localStorage.Zolxys_AvatarStorage_ts = tsm[0] +' '+ lts;
		o.contentWindow.postMessage(['Zolxys_AvatarStorage', localStorage.Zolxys_AvatarStorage_ts, JSON.stringify(a)], e.origin);
		return;
	}
	else if (localStorage.Zolxys_AvatarStorage != e.data[2] && parse(e.data[2])) {
		rec = e.data[2];
		mrg[0][1] = 0;
	}
	a = checkRemote(rec);
	if (!a) {
		rec = '[]';
		a = [];
	}
	ts = (ts || 1);
	for (var i = mrg[0][1] + 1; i < mrg.length; ++i) {
		mrg[0][1] = i;
		if (!mrg[i] || mrg[i] == '[]' || mrg[i] == rec || i != mrg.indexOf(mrg[i]))
			continue;
		mrg[0][0] = mergeData(mrg[0][0], checkRemote(mrg[i]));
	}
	a = mergeData(a, mrg[0][0]);
	save(a, ts);
}
function init() {
	if (!kona || fa)
		return;
	fa = [];
	for (var i = 0; i < 4; ++i) {
		var p = ((i & 1)? 'https:' : 'http:');
		var d = ((i & 2)? '.com' : '.net');
		if (location.protocol == p && location.hostname.substr(-4) == d)
			continue;
		var ne = document.body.appendChild(document.createElement('iframe'));
		ne.style.display = 'none';
		ne.id = 'zol_AvatarStorage_'+ p +'//konachan'+ d;
		ne.name = location.protocol +'//'+ location.host;
		ne.src = p +'//konachan'+ d +'/images/blank.gif#Zolxys_AvatarStorage';
	}
}
function replaceCropper(x1, y1, x2, y2) {
	document.getElementsByClassName('avatar-crop')[0].appendChild(document.getElementById('image'));
	var o = document.getElementsByClassName('imgCrop_wrap')[0]; o.parentNode.removeChild(o);
	var options =
	{
		displayOnInit: true,
		onEndCrop: onEndCrop,
		previewWrap: 'crop-preview',
		minWidth: 1,
		minHeight: 1,
		onloadCoords: {x1: x1, y1: y1, x2: x2, y2: y2},
		resizePreview: function(dim)
		{
			var sc = Math.min(125/dim.x, 125/dim.y);
			return {x: Math.round(dim.x * sc), y: Math.round(dim.y * sc)};
		}
	}
	new Cropper.ImgWithPreview('image', options);
}
var kona = /^konachan\.(com|net)$/.test(location.hostname);
var sub = false;
var fa = null;
var mrg = [[[], 0]];
var lts = (localStorage.Zolxys_AvatarStorage_ts || '0 0');
var tsm = [(Number(lts.substr(0,2)) || 0)];
lts = (Number(lts.substr(2)) || 0);
if (location.pathname == '/images/blank.gif') {
	sub = true;
	window.addEventListener('message', function(e) {
		recieve(e);
	});
	var ne = document.body.appendChild(document.createElement('iframe'));
	parent.postMessage(['Zolxys_AvatarStorage', localStorage.Zolxys_AvatarStorage_ts, localStorage.Zolxys_AvatarStorage], name);
}
else {
	var a = avatarList();
	if (!a)
		return;
	window.addEventListener('message', function(e) {
		recieve(e);
	});
	init();
	var r = /^\/user\/show\/(\d+)/.exec(location.pathname);
	if (r) {
		var b = /\sBan\s/.test(document.getElementById('subnavbar').textContent);
		if (!b) {
			var x = /\/user\/show\/(\d+)/.exec(document.getElementById('main-menu').getElementsByClassName('user')[0].getElementsByTagName('li')[0].getElementsByTagName('a')[0].href);
			b = (r[1] == x[1]);
		}
		if (b)
			newStoragePopupLink(document.getElementById('content').getElementsByTagName('table')[0]);
	}
	else if (/^\/user\/set_avatar\//.test(location.pathname)) {
		var o = document.getElementById('crop-preview-box');
		var ne = document.createElement('a');
		ne.href = '#';
		ne.textContent = 'Save in storage';
		ne.addEventListener('click', function (e) { // Save EL
			e.stopPropagation();
			e.preventDefault();
			var o = document.getElementById('image');
			var r = /^\/user\/set_avatar\/(\d+)/.exec(location.pathname);
			var id = r[1];
			var x = document.getElementById('left').value;
			var y = document.getElementById('top').value;
			var x2 = document.getElementById('right').value;
			var y2 = document.getElementById('bottom').value;
			var a = avatarList();
			if (!a)
				return;
			addAvatar({id: id, x: x, y: y, x2: x2, y2: y2, w: o.naturalWidth, h: o.naturalHeight, img: o.src}, a);
			save(a);
		});
		o.appendChild(ne);
		o.appendChild(document.createElement('br'));
		o.appendChild(document.createElement('br'));
		ne = o.appendChild(document.createElement('a'));
		newStoragePopupLink(ne);
		var ra = [(/(^\?|&)x=((\d*\.)?\d+)(&|$)/.exec(location.search)), (/(^\?|&)y=((\d*\.)?\d+)(&|$)/.exec(location.search)), (/(^\?|&)x2=((\d*\.)?\d+)(&|$)/.exec(location.search)), (/(^\?|&)y2=((\d*\.)?\d+)(&|$)/.exec(location.search))];
		if (!ra[0] || !ra[1] || !ra[2] || !ra[3])
			return;
		if (document.readyState == 'complete')
			replaceCropper(parseFloat(ra[0][2]), parseFloat(ra[1][2]), parseFloat(ra[2][2]), parseFloat(ra[3][2]));
		else
			window.addEventListener('load', function () {
				replaceCropper(parseFloat(ra[0][2]), parseFloat(ra[1][2]), parseFloat(ra[2][2]), parseFloat(ra[3][2]));
			});
	}
}
