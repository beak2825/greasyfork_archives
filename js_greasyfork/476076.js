// ==UserScript==
// @name        mtoast
// @version     0.1.1
// @author      gortik
// @description toast
// ==/UserScript==

var mtoast = {
	css: `
		.mtoast {

			/* (B) DIMENSION */
			//width: 200px;
			padding: 10px;

			/* (C) COLORS */
			border: 1px solid #c52828;
			background: #ffebe1;
			border: 1px solid #000;

			border-radius: 5px;
			margin-bottom: 20px;
		}

		.mtoast.show {
			display:block
		}

		#mtoast-holder {
			position: fixed;
			z-index: 9999;
			right: 20px;
			top: 50px;
			width: 200px;
			display: flex;
			flex-direction: column;
		}

		.fade-in {
			animation: fadeIn linear .8s;
		}

		.fade-out {
			animation: fadeOut linear .5s;
		}
		@keyframes fadeIn {
			0% {
				opacity: 0;
				max-height: 0px;
			}

			100% {
				opacity: 1;
				max-height: 100px;
			}
		}

		@keyframes fadeOut {
			0% {
				opacity: 1;
				max-height: 100px;
			}
			100% {
				opacity: 0;
				max-height: 0;
			}
		}
	`,
	container: null,

	addCSStyle: (styleText) => {
		let style = document.createElement('style');
		style.type = 'text/css';
		document.head.appendChild(style);
		style.appendChild(document.createTextNode(styleText));
	},

	init: () => {
		mtoast.addCSStyle(mtoast.css);
		let container = document.createElement('div');
		container.setAttribute('id', 'mtoast-holder');
		document.body.insertAdjacentElement('afterbegin', container);
		mtoast.container = container;
		console.log( 'mtoast loaded' );
	},


	removeMToast: (e) => {
		e.target.classList.add('fade-out');
		setTimeout(() => e.target.remove(), 500);
	},

	createMToast: () => {
		let toast = document.createElement('div');
		toast.classList.add('mtoast');
		toast.classList.add('fade-in');
		mtoast.container.insertAdjacentElement('afterbegin', toast);
		return toast;
	},

	msg: (msg) => {
		if (!mtoast.container) {
			toast.init();
		}
		let toast = mtoast.createMToast();
		console.log(msg);
		toast.innerHTML = msg;
		toast.classList.add('show');
		toast.addEventListener('click', mtoast.removeMToast);
	}
}

mtoast.init()
 