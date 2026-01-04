// ==UserScript==
// @name         ficUpdate
// @namespace    ficscript
// @version      3.0.0
// @description  bulk copy-paste all the chapters from Word on ficbook
// @author       Dimava
// @license MIT
// @match        https://ficbook.net/home/myfics*
// @grant        none
// @require https://greasyfork.org/scripts/439153-poopjs/code/PoopJs.js?version=1012736
// @downloadURL https://update.greasyfork.org/scripts/370967/ficUpdate.user.js
// @updateURL https://update.greasyfork.org/scripts/370967/ficUpdate.meta.js
// ==/UserScript==

FicUpdate = class FicUpdate {
	debug = true;
	strings = {
		infoRoot: 'ⓘFicUpdate: Для обновления глав перейдите на страницу одного из фанфиков',
		infoEditor: 'ⓘFicUpdate: Скопируйте текст сюда',
		style: `
			.fu-container{display:grid;grid-template-areas: "buttons buttons" "infoEditor infoPrepared" "editor prepared";grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);overflow:hidden;}
			.fu-editor{background:white;border:1px dotted gray; grid-area:editor;}
			.fu-prepared{background:hsl(0,0%,95%);border:1px dotted gray;grid-area:prepared;}
			.fu-infoEditor{grid-area:infoEditor;}
			.fu-buttons{grid-area: buttons;}
			.fu-summary-buttons{display:inline-block;}
			.fu-rotate{animation:anim-fu-rotate 1s linear infinite;display:inline-block;}
			@keyframes anim-fu-rotate{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
		`,
		errNoHeaders: 'ⓘFicUpdate: Текст не содержит заголовков глав! (<H1>)',
		sucPrepared: 'ⓘFicUpdate: Текст подготовлен',
		infoStep: `ⓘFicUpdate: Преобразование текста`,
		infoPasted: `ⓘFicUpdate: Нажмите на эту кнопку чтобы подготовить текст`,
		statusTextSame: `ⓘтекст совпадает`,
		statusTextFromTo: (a, b) => `${a}ch↦${b}ch${b > a ? '' : ` (-${a - b})`}`,
		chReload: '⟳',
		chUpload: '⇑',
		chDownload: '⇓',
	};
	els = {};


	elm(s, ...a) {
		return elm(s+'.fic-update', ...a);
	}
	elmake(key, ...a) {
		if (key.startsWith('.fu-')) {
			return this.els[key.match(/\w{3,}/)[0]] = elm(key + '.fic-update', ...a);
		} else {
			return this.els[key] = elm(a[0] + '.fic-update', ...a.slice(1));
		}
	}
	constructor() {
		if (!location.pathname.startsWith('/home/myfics')) {
			return;
		}
		__init__;
		if (location.pathname == '/home/myfics') {
			this.elmake('.fu-infoRoot.btn.btn-info', this.strings.infoRoot);
			q('h1').after(this.els.infoRoot);
			return;
		}
		const els = this.els;

		this.elmake('.fu-container');
		q('.myfic').after(els.container);
	
		this.elmake('style', 'style').appendTo('head').innerHTML = this.strings.style;


		this.elmake('.fu-buttons').appendTo(els.container);
		this.elmake('.fu-infoEditor.btn.btn-info', this.strings.infoEditor
			, click=>this.prepareText()
			, paste=>this.onpaste).appendTo(els.container);
		this.elmake('.fu-editor').appendTo(els.container);
		els.editor.contentEditable = true;
		this.elmake('.fu-prepared').appendTo(els.container);
		
	}
	onpaste() {
		this.els.infoEditor.innerText = this.strings.infoPasted;
	}
	remove() {
		qq('.fic-update').map(e=>e.remove());
	}


	prepareTextStep(id, f) {
		let before = this.text;
		let after = f(before);
		this._textSteps[id] = {before, after};
		return this.text = after;
	}

	prepareText() {
		this.text = this.els.editor.innerHTML;
		this._textSteps = {init: this.text};
		this.refs = {};

		if (!this.text.match(/<h1/)) {
			this.els.infoEditor.innerText = this.strings.errNoHeaders;
			this.els.infoEditor.classList.toggle('btn-warning', true);
			return;
		}
		
		this.prepareTextStep('extractFootnotes1', t => {
			return t.replace(/<a\s+[^>]*name="_ftn[^]*?a>/g, s=>{
				let refm = s.match(/_ftn(ref)?(\d+)/);
				let refn = +refm[2];
				if (refm[1]) {
					refs[refn] = {
						n: refn,
						t: this.tosupnum(refn),
					};
				}
				return refm[1] ? '' : this.tosupnum(refn);
			});
		});

		this.prepareTextStep('extractFootnotes2', t => {
			return t.replace(/<div id="ftn(\d+)"[^]*?div>/g, (s,n)=>{
				this.refs[n].s = this.htmlToText(s).trim();
				return '';
			});
		});

		this.prepareTextStep('removeBadTags', t => {
			return t.replace(/<(?!\/?(h1|br|p|b|s|i|center|right)[\s|>])[^>]*>/g, '');
		});
		
		this.prepareTextStep('removeAttributes', t => {
			return t.replace(/<(\/?)(h1|br|b|s|i|center|right)(?=[\s|>])[^>]*>/g, '<$1$2>');
		});
		
		this.prepareTextStep('split', t => {
			return this.parts = t.split(/<h1[^>]*>/).map(e=>e.split('</h1>')).slice(1).map(([name, text])=>{
				name = this.htmlToText(name).replace(/\s+/g, ' ').trim()
				text = this.tabber(text);
				let o = {
					name,
					text,
					com: '',
					comp: true,
					refs: [],
				};
				text = text.replace(/\s*\/\*\s*([^]*?)\s*\*\/\s*/, (s,a,i,t)=>{
					o.com = a;
					o.comp = i > 100;
					return '';
				});
				let supi = 1;
				text = text.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (s,i,t)=>{
					let n = fromsupnum(s);
					let ref = refs[n];
					ref.n = supi;
					ref.t = tosupnum(supi);
					o.refs.push(ref);
					supi++;
					return ref.t;
				});
				o.text = text;
				return o;
			});
		});
		
		this.prepareTextStep('join', t => {
			return t
				.map(p => {
					let t = p.text.replace(/\n/g, '\n<br>');
					if (p.com || p.refs.length) {
						let com = p.com;
						let ref = p.refs.map(r=>r.t + this.htmlToText('&nbsp;') + r.s).join('\n<br>');
						let brc = com && ref ? '<br><br>' : '';
						t = p.comp ? `${t}<br><br><u>${ref}${brc}${com}</u>` : `<u>${com}${brc}${ref}</u><br><br>${t}`;
					}
					return `<details class="fu-chapter"><summary class="fu-summary" chapter="${p.name}">\n${p.name}\n</summary>${t}</details>\n`;
				})
				.join('\n');
		});
		
		this.prepareTextStep('display', t => {
			return this.els.prepared.innerHTML = t;
		});

		this.prepared = true;
		
		this.els.infoEditor.innerText = this.strings.sucPrepared;
		this.els.infoEditor.classList.toggle('btn-info', false);
		this.els.infoEditor.classList.toggle('btn-success', true);

		this.makePreparedButtons();

	}

	makePreparedButtons() {
		qq('.fu-summary').map(e => {
			let name = e.getAttribute('chapter');
			let chapter = this.parts.find(e => e.name == name);
			let a = qq('.parts .title a').find(e=>e.innerText == name);
			chapter.a = a;
			chapter.summary = e;
			console.log({chapter, a, name});

			chapter.buttons = elm('.fu-summary-buttons').appendTo(e);
			chapter.status = elm('sup.fu-chapter-status').appendTo(chapter.buttons);

			if (chapter.a) {
				elm('button.fu-sync-chapter', this.strings.chReload+this.strings.chDownload, click => {click.preventDefault(); this.syncChapter(chapter)})
				.appendTo(chapter.buttons);
			} else {
				chapter.status.innerText = this.strings.statusTextFromTo(0, chapter.text.length);
				elm('button.fu-chapter-make', this.strings.chUpload, click => {click.preventDefault(); this.makeChapter(chapter)})
				.appendTo(chapter.buttons);
			}
		});
	}

	async syncChapter(chapter) {
		console.log(chapter);
		chapter.summary.q('.fu-sync-chapter').classList.add('fu-rotate');
		console.log(window.chap = chapter);

		if (!chapter.a) {
			throw alert('wrong button!');
		}

		chapter.doc = await fetch.doc(chapter.a.href);
		chapter.summary.q('.fu-sync-chapter').remove();
		chapter.oldText = chapter.doc.q('textarea#content').value;
		console.log(chapter);
		chapter.isSame = chapter.text == chapter.oldText;

		chapter.status.innerText = 
			chapter.isSame ? this.strings.statusTextSame: this.strings.statusTextFromTo(chapter.oldText.length, chapter.text.length);

		chapter.btnUpdate = elm('button.fu-chapter-update', this.strings.chUpload, click=>this.updateChapter(chapter));
		chapter.buttons.append(chapter.status);
		if (!chapter.isSame) {
			chapter.buttons.append(chapter.btnUpdate);
		}
	}

	async updateChapter(chapter) {
		console.log('upload', chapter);
		chapter.buttons.q('.fu-chapter-update').classList.add('fu-rotate');
		chapter.iframe = elm('iframe').appendTo(chapter.buttons);

		await this.iframeLoad(chapter.iframe, chapter.a.href);

		let ta = chapter.iframe.contentDocument.querySelector('textarea#content');
		ta.scrollIntoView();
		console.log('oldText: ', ta.value == chapter.oldText)
		if (ta.value != chapter.oldText) {
			alert('Error: can\'t update, chapter text has changed');
			throw new Error('oldText has changed!');
		}
		await Promise.frame(30);
		ta.value = chapter.text;
		console.log('text: ', ta.value == chapter.text);
		await Promise.frame(30);

		let bsave = chapter.iframe.contentDocument.querySelector('#save_part')
		bsave.scrollIntoView();
		await Promise.frame(30);

		await this.iframeLoad(chapter.iframe, () => bsave.click())

		console.log('frame loaded, chapter updated!');

		ta = chapter.iframe.contentDocument.querySelector('textarea#content');
		chapter.newText = ta.value;
		if (ta.value != chapter.text) {
			alert('Error: failed to update dunno why');
			throw new Error('failed to update dunno why!');
		}
		await Promise.frame(30);

		chapter.status.innerText = this.strings.statusTextSame;
		chapter.buttons.q('.fu-chapter-update').remove();

		chapter.iframe.remove();
		chapter.iframe = null;
	}

	async makeChapter(chapter) {
		console.log('upload', window.chap=chapter);
		chapter.buttons.q('.fu-chapter-make').classList.add('fu-rotate');
		chapter.iframe = elm('iframe').appendTo(chapter.buttons);
		let href = q('.add-part a[href*="addpart"]').href;
		await this.iframeLoad(chapter.iframe, href);

		let ta = chapter.iframe.contentDocument.querySelector('textarea#content');
		let ti = chapter.iframe.contentDocument.querySelector('#titleInput');
		let cb = chapter.iframe.contentDocument.querySelector('#not_published_chb');

		ti.scrollIntoView();
		ti.value = chapter.name;
		await Promise.frame(30);

		ta.scrollIntoView();
		await Promise.frame(30);
		ta.value = chapter.text;
		await Promise.frame(30);

		cb.scrollIntoView();
		cb.checked = true;
		await Promise.frame(30);

		let bsave = chapter.iframe.contentDocument.querySelector('button[type="submit"]')
		if (bsave?.innerText != 'Добавить часть') {
			alert('Кнопка не найдена, нажмите сами');
		}
		bsave?.scrollIntoView();
		await Promise.frame(30);
		
		await this.iframeLoad(chapter.iframe, () => bsave?.click());
		console.log('frame loaded, chapter updated!');
		await Promise.frame(30);

		chapter.status.innerText = this.strings.statusTextSame;
		chapter.buttons.q('.fu-chapter-make').remove();

		chapter.iframe.remove();
		chapter.iframe = null;
	}


	async iframeLoad(iframe, src='') {
		return new Promise(r => {
			iframe.addEventListener('load', r);
			if (src) {
				if (typeof src == 'string') iframe.src = src;
				if (typeof src == 'function') src(iframe);
			}
		});
	}

	htmlToText(h) {
		let a = document.createElement('a');
		a.innerHTML = h;
		return a.innerText;
	}		
	tosupnum(t) {
		let num = '⁰¹²³⁴⁵⁶⁷⁸⁹'.split('');
		return (t + '').match(/\d/g).map(e=>num[e]).join('');
	}
	fromsupnum(t) {
		let num = '⁰¹²³⁴⁵⁶⁷⁸⁹'.split('');
		return +(t + '').match(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g).map(e=>num.indexOf(e)).join('');
	}
	tabber(s) {
		let hTexts = {};

		function hText(s) {
			if (hTexts[s])
				return hTexts[s];
			let a = document.createElement('a');
			a.innerHTML = s;
			return hTexts[s] = a.innerText;
		}
		const nbsp = '\xa0';
		//hText('&nbsp;');
		const emsp = '\u2003';
		//hText('&emsp;');
		const ndash = '\u2013';
		//hText('&ndash;');
		const replacers = [
			[/\n/g, ' '],
			[/^\s+|\s+$/gm, '\n\n\n'],
			[/&[^;]{2,7};/g, hText],
			[/<br>|<.div><div[^>]*>|<.div>|<div[^>]*>/g, '\n'],
			[/<p[^>]*(center|right)[^>]*>([^]*?)<\/p>/g, '\n<$1>\n$2\n</$1>\n'],
			[/<\/p>\s*<p[^>]*>/g, '\n'],
			[/<\/p>\s*|\s*<p[^>]*>/g, '\n'],
			[/<script>[^]*?<.script>/, ''],
			[/\s*\n{4,}/g, '\n\n\n'], [/(\s*)(<(b|i|s)>)/g, '$2$1'],
			[/(^|[^\.])(…|\.{2,4}(?!\.))(?!\n\s)? /gm, '$1… '],
			[/(–|—|―)/gm, ' - '],
			[/--?(?![\-\wа-яёА-ЯЁ])|([^\-\wа-яёА-ЯЁ])-(?![\->\w])/g, `$1 - `],
			[/^((?=.)\s)*/gm, emsp + emsp],
			[/((?!\n)\s)+-\s+/gm, ' ' + ndash + nbsp],
			[/^\s*–/gm, emsp + nbsp + ndash],
			[/\n<center>\n([^]*?)\n<\/center>\n/g, s=>s.replace(/^\s*/gm, '')],
			[/\n<right>\n([^]*?)\n<\/right>\n/g, s=>s.replace(/^\s*/gm, '')],
			[/\s*<center>\s*([*][\s*]*[*])\s*<\/center>\n*|\n+\s*([*][\s*]*[*])\s*\n+/g, '\n\n\n<center>\n$1$2\n</center>\n\n'],
			[/\n(<.?(center|right)>)\n/g, '$1'],
			[/(<(b|i|s)>)(\s*)/g, '$3$1'],
			[/<(?!\/?(b|i|s|center|right))/g, '&lt;'],
			[/^\s*\n|\n\s*$/g, '']
		];
		replacers.forEach(rpl=>{
			s = s.replace(rpl[0], rpl[1]);
		});
		return s;
	}

}

window.ficUpdate = new FicUpdate();