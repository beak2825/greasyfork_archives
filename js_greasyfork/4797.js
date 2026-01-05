// ==UserScript==
// @name         Forum(Discuz! X) Base-Profile One-Clicked Filler
// @description  Discuz! X-论坛-基本资料-一键填写
// @version      1.0.17012102
// @author       DanoR
// @namespace    http://weibo.com/zheung
// @grant        none
// @include      *://*op=base*
// @downloadURL https://update.greasyfork.org/scripts/4797/Forum%28Discuz%21%20X%29%20Base-Profile%20One-Clicked%20Filler.user.js
// @updateURL https://update.greasyfork.org/scripts/4797/Forum%28Discuz%21%20X%29%20Base-Profile%20One-Clicked%20Filler.meta.js
// ==/UserScript==

(function() {
	const info = {
		birthdate: {
			data: [1993, 8, 10],
			privacy: 3
		},
		realname: {
			data: '',
			privacy: 3
		},
		gender: {
			data: 1,
			privacy: 3
		},
		bloodtype: {
			data: 'O',
			privacy: 3
		},
		lookingfor: {
			data: '婚姻',
			privacy: 3
		},
		affective: {
			data: '单身',
			privacy: 3
		},
		birthplace: {
			data: ['广东省', '广州市'],
			privacy: 3
		},
		resideplace: {
			data: ['广东省', '广州市'],
			privacy: 3
		}
	};

	document.querySelector('button#profilesubmitbtn.pn.pnc').parentNode.innerHTML +=
		'<button id="fill" type="button" class="pnc pn"><strong>填写</strong></button>';
	document.querySelector('button#fill.pn.pnc').onclick = fill;

	function fill() {
		const privacys = document.querySelectorAll('td.p>select');
		for(let i = 0; i < privacys.length; i++) privacys[i].value = 3;

		document.querySelector('input#realname.px').value = info.realname.data;
		document.querySelector('input#affectivestatus.px').value = info.affective.data;
		document.querySelector('input#lookingfor.px').value = info.lookingfor.data;

		document.querySelector('select#gender.ps').value = info.gender.data;
		document.querySelector('select#bloodtype.ps').value = info.bloodtype.data;

		const year = document.querySelector('select#birthyear.ps');
		year.value = info.birthdate.data[0]; year.onchange();
		const month = document.querySelector('select#birthmonth.ps');
		month.value = info.birthdate.data[1]; month.onchange();
		document.querySelector('select#birthday.ps').value = info.birthdate.data[2];

		const provinceBirth = document.querySelector('select#birthprovince.ps');
		provinceBirth.value = info.birthplace.data[0];
		provinceBirth.onchange();

		const provinceReside = document.querySelector('select#resideprovince.ps');
		provinceReside.value = info.resideplace.data[0];
		provinceReside.onchange();

		const intervalID = setInterval(function() {
			const cityBirth = document.querySelector('select#birthcity.ps');
			if(cityBirth) cityBirth.value = info.birthplace.data[1];
			const cityReside = document.querySelector('select#residecity.ps');
			if(cityReside) cityReside.value = info.resideplace.data[1];

			if(cityBirth.value == info.birthplace.data[1] && cityReside.value == info.resideplace.data[1]) clearInterval(intervalID);
		}, 2014);
	}
})();