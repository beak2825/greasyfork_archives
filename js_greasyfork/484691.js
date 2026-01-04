// ==UserScript==
// @name        Sheezy Image Viewer
// @namespace   Violentmonkey Scripts
// @match       https://sheezy.dev/*/gallery/*
// @match       https://sheezy.art/*/gallery/*
// @homepageURL https://github.com/Exodus-Drake/Redeviated-Advanced-Image-Viewer-Sheezy
// @version     2024.01.12.0
// @author      Edael
// @description 1/8/2024, 9:16:09 PM
// @downloadURL https://update.greasyfork.org/scripts/484691/Sheezy%20Image%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/484691/Sheezy%20Image%20Viewer.meta.js
// ==/UserScript==

(function() {
	setTimeout(() => {
    console.clear();
    //DOM path to image
    const _config = {
      ImgDOM: '#artwork',
    };

		if (document.querySelector(`${_config.ImgDOM} canvas`) || document.querySelector(`${_config.ImgDOM} img`)) {
			const css = `
        #content > section:first-child > div:first-child > div:nth-child(2) > div > div > div > div{
          cursor:zoom-in
        }
        #my-img-modal{
          min-height: 100%;
          min-width: 100%;
          margin: 0;
          padding: 0;
          background: none;
          border: 0 transparent;
          overflow-x: hidden;
          overflow-y: scroll;
          transition: 0.25s ease;
          opacity: 1;
          background-color: rgba(55, 63, 61, .75);
          scrollbar-width: thin;
          scrollbar-color: white transparent;
          color: white;
        }
        #my-img-modal::backdrop{background-color: transparent;}
        #my-img-modal > div:first-child{
          top: 12px;
          right: 12px;
        }
        #my-img-modal > div:nth-child(3){
          top: 12px;
          left: 12px;
        }
        #my-img-modal > div:nth-child(4){
          bottom: 12px;
          right: 12px;
        }
        #my-img-modal > div:last-child{
          position: fixed;
          display: block;
          width: 50%;
          left: 150vw;
          top: 50%;
          translate: -50% -50%;
          box-shadow:
            rgba(0, 0, 0, 0.5) 0px 1px 4px,
            rgb(255, 255, 255) 0px 1px 1px inset;
          border-radius: 2rem;
          background-color: #A2B8C6;
          transition: 0.45s ease-in-out;
          font-size: 16px;
          overflow: hidden;
        }
        #my-img-modal > div:last-child > div{
          position: relative;
        }
        #my-img-modal > div:last-child > div:first-child{
          padding: 15px 20px;
          font-size: 1.6rem;
          font-weight: 600;
          border-radius: 1.6rem 1.6rem 0 0;
          box-shadow:
            rgba(0, 0, 0, 0.6) 0px 1px 1px,
            rgb(255, 255, 255) 0px 1px 1px inset;
          background-image: linear-gradient(to top, #526B83, #5B7690);
          z-index: 1;
        }
        #my-img-modal > div:last-child > div:last-child{
          padding: 12px 16px;
          display: grid;
          row-gap: 16px;
          overflow-y: auto;
          height: 50vh;
          overflow-x: hidden;
          scrollbar-color: white transparent;
          scrollbar-width: thin;
        }
        #my-img-modal > div:last-child > div:last-child > div:last-child{
          display: grid;
          row-gap: 12px;
        }
        .mdl-btns{
          padding: 8px 16px;
          position: fixed;
          display: grid;
          justify-content: space-evenly;
          transition: 0.25s ease;
          row-gap: 8px;
          z-index: 1;
          opacity: 0.5;
        }
        .mdl-btns:hover{
          opacity: 1.0;
        }
        .mdl-btns-help{
          display: grid;
          transition: 0.25s ease;
          column-gap: 10px;
          row-gap: 8px;
          grid-template-rows: auto auto;
          grid-template-columns: repeat(7, auto);
          justify-content: center;
        }
        .mdl-btns-help::after{
          content:""
          width: 100%;
        }
        .mdl-btns > span, .mdl-btns-help > span{
          display: flex;
          padding: 6px;
          width: 100%;
          cursor: pointer;
          border-radius: .6em;
          transition: 0.1s ease !important;
          --tw-shadow:
            0 .1em .3em rgba(0, 0, 0, .2),
            inset 0 1px rgba(255, 255, 255, .2),
            inset 0 -1px rgba(0, 0, 0, .05);
          box-shadow:
            var(--tw-ring-offset-shadow, 0 0 #0000),
            var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
          text-shadow: 0 1px rgba(0, 0, 0, .15), 0 -1px rgba(255, 255, 255, .15);
          background-color: var(--button-background, #7c9db1);
          height: 38px;
          width: 52px;
          max-width: unset;
          user-select: none;
        }
        .mdl-btns > span:hover{
          transform: scale(1.3);
          box-shadow:
            rgba(0, 0, 0, 0.5) 0px 1px 4px,
            rgba(255, 255, 255, 1.0) 0px 1px 2px inset;
          background-color: var(--button-background-hover, #88a7ba);
          color: var(--button-text-hover, #fff) !important;
        }
        .mdl-btns > span:active:hover{
          transform: scale(0.9);
          background-color: rgb(236 242 246 / var(--tw-bg-opacity));
        }
        .mdl-btns-help > span:hover{
          translate: 0 -4px;
          box-shadow:
            rgba(0, 0, 0, 0.5) 0px 1px 4px,
            rgba(255, 255, 255, 1.0) 0px 1px 2px inset;
          background-color: var(--button-background-hover, #88a7ba);
          color: var(--button-text-hover, #fff) !important;
        }
        .mdl-btns-help > span:active:hover{
          background-color: rgb(236 242 246 / var(--tw-bg-opacity));
          translate: 0 2px;
        }
        .mdl-btns > span > img, .mdl-btns-help > span > img{
          filter:
            invert(26%)
            sepia(30%)
            saturate(665%)
            hue-rotate(169deg)
            brightness(91%)
            contrast(83%);
          margin: auto;
        }
        .btn-img-viw{
          padding: 6px;
          margin-inline: 2px;
          width: 36px;
          height: 36px;
          border: 0;
          background-color: rgba(165, 255, 123, 0.0);
          box-shadow:
            rgba(0, 0, 0, 0.0) 0px 1px 4px,
            rgba(255, 255, 255, 0.0) 0px 1px 1px inset;
          border-radius: 5px;
          bottom: 0;
          transition: 0.25s ease !important;
        }
        .btn-img-viw:hover{
          translate: 0 -4px;
          background-color: rgba(165, 255, 123, 0.5);
          box-shadow:
            rgba(0, 0, 0, 0.5) 0px 1px 4px,
            rgba(255, 255, 255, 1.0) 0px 1px 2px inset;
        }
        .btn-img-viw:active:hover{
          background-color: #82fc49cc;
          translate: 0 2px;
          transition: 0.1s ease;
        }
        /*.btn-img-viw:focus{
          outline: none;
        }*/
        .btn-img-viw > img, .btn-example > img{
          width: 100%;
          filter: invert(1);
          cursor: pointer;
          filter:
            invert(99%)
            sepia(1%)
            saturate(1265%)
            hue-rotate(10deg)
            brightness(116%)
            drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.8))
            drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.8))
            drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.4))
            contrast(100%);
        }
        .btn-example{
          display: inline-block;
          padding: 4px;
          width: 24px;
          height: 24px;
          background-color: rgba(0, 0, 0, 0.5);
          box-shadow:
            rgba(0, 0, 0, 0.5) 0px 1px 4px,
            rgba(255, 255, 255, 1.0) 0px 1px 1px inset;
          border-radius: 5px;
        }
        .darkbox-cont{
          padding: 6px;
          background-color: #c0d0da;
          border-radius: 5px;
          color: #4a647d;
        }
        .spread-align{
          text-align: right;
          padding: 0 12px;
        }
        .spread-align > span:first-child{
          float:left;
        }
        .spread-align > :not(:first-child){
          margin: 0;
        }
        #arrow-exit{
          position: absolute;
          right: 22px;
          top: 12px;
          width: 32px;
          height: 32px;
          cursor: pointer;
          filter:
            invert(99%)
            sepia(1%)
            saturate(1265%)
            hue-rotate(10deg)
            brightness(116%)
            drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.8))
            drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.8))
            drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.4))
            contrast(100%);
        }
        #my-img-modal input:active{cursor: grabbing;}
        #my-img-modal > div:nth-child(2){
          position: absolute;
          width: fit-content;
          height: fit-content;
          line-height: 0;
        }
        #my-img-modal > div:nth-child(2) > img{
          position: relative;
          max-width: 66vw;
          max-height: 90vh;
          image-rendering: auto;
          transition: 0.1s ease;
          filter: drop-shadow(0px 0px 6px rgba(0, 0, 0, 0.7));
          rotate: 0deg;
        }
        #my-img-modal > div:nth-child(2):hover{cursor: all-scroll}
        #my-img-modal > div:nth-child(2):active{cursor: none}
        .janky-workaround{cursor:zoom-in !important}
        @media (max-width: 900px){
          .mdl-btns-help {
            grid-template-rows: repeat(4, auto);
            grid-template-columns: repeat(4, auto);
          }
        }
      `;

			let styleNode = document.createElement("style");
			styleNode.innerHTML = css;
			document.head.appendChild(styleNode);

			function getContainerType() {
        if (document.querySelector(`${_config.ImgDOM} canvas`)) {
          return document.querySelector(`${_config.ImgDOM} canvas`).getAttribute('style').match(/--src:url\('(.*?)'\)/)[1];
				} else {
          return document.querySelector(`${_config.ImgDOM} img`).src;
				};
			};

      const modalBtn = `
        <div onclick="openImage(getContainerType());"
          class="absolute translate-center bottom-0 flex h-2x w-2x cursor-pointer items-center justify-center rounded-50 bg-black/75 text-20 font-normal text-white opacity-0 transition-opacity group-hover:opacity-100" style="right: 48px;">
          <i class="not-prose material-symbols-outlined Icon-module__icon__Ykfh8">
            expand_content
          </i>
        </div>
      `;
			
			//TODO
      //document.querySelector(_config.ImgDOM).insertAdjacentHTML("afterbegin", modalBtn);

      document.querySelector(_config.ImgDOM).addEventListener('click', () => {
				openImage(getContainerType());
			});

      var _dom = {}
		  var _eStop = []
      var	_iConf = {
			  Width: '28',
			  Height: '28'
		  };

			function buildModal() {
        const btnsModal = `
          <span>
            <img
              title="Reset"
              draggable="false"
              src="https://www.svgrepo.com/show/510837/arrows-reload-01.svg"
              width="${_iConf.Width}" height="${_iConf.Height}">
          </span>
          <span>
            <img
              Title="Zoom-In"
              draggable="false"
              src="https://www.svgrepo.com/show/511061/magnifying-glass-plus.svg"
              width="${_iConf.Width}" height="${_iConf.Height}">
          </span>
          <span>
            <img
              Title="Zoom-Out"
              draggable="false"
              src="https://www.svgrepo.com/show/511056/magnifying-glass-minus.svg"
              width="${_iConf.Width}" height="${_iConf.Height}">
          </span>
          <span>
            <img
              Title="Rotate Left"
              draggable="false"
              src="https://www.svgrepo.com/show/511181/undo.svg"
              width="${_iConf.Width}" height="${_iConf.Height}">
          </span>
          <span>
            <img
              Title="Rotate Right"
              draggable="false"
              src="https://www.svgrepo.com/show/511181/undo.svg"
              width="${_iConf.Width}" height="${_iConf.Height}"
              style="scale: -1;">
          </span>
          <span>
            <img
              Title="Real Size"
              draggable="false"
              src="https://www.svgrepo.com/show/510968/expand.svg"
              width="${_iConf.Width}" height="${_iConf.Height}">
          </span>
          <span>
            <img
              Title="Fit Width to Screen"
              draggable="false"
              src="https://www.svgrepo.com/show/511082/move-horizontal.svg"
              width="${_iConf.Width}" height="${_iConf.Height}">
          </span>
          <span>
            <img
              Title="Fit Height to Screen"
              draggable="false"
              src="https://www.svgrepo.com/show/511081/move-vertical.svg"
              width="${_iConf.Width}" height="${_iConf.Height}">
          </span>
          <span>
            <img
              Title="To-Top"
              draggable="false"
              src="https://www.svgrepo.com/show/510911/chevron-up.svg"
              width="${_iConf.Width}" height="${_iConf.Height}">
          </span>
          <span>
            <img
              Title="To-Bottom"
              draggable="false"
              src="https://www.svgrepo.com/show/510905/chevron-down.svg"
              width="${_iConf.Width}" height="${_iConf.Height}">
          </span>
          <span>
            <img
              Title="Flip Horizontally"
              draggable="false"
              src="https://www.svgrepo.com/show/510812/arrow-left-right.svg"
              data-toggle="true"
              width="${_iConf.Width}" height="${_iConf.Height}">
          </span>
          <span>
            <img
              Title="Flip Vertically"
              draggable="false"
              src="https://www.svgrepo.com/show/510808/arrow-down-up.svg"
              data-toggle="true"
              width="${_iConf.Width}" height="${_iConf.Height}">
          </span>
          <span>
            <img
              Title="Background Transparency"
              draggable="false"
              src="https://www.svgrepo.com/show/510903/checkbox-fill.svg"
              data-toggle="true"
              width="${_iConf.Width}" height="${_iConf.Height}">
          </span>
          <span>
            <img
              Title="Toggle Rendering"
              draggable="false"
              src="https://www.svgrepo.com/show/510899/check-big.svg"
              data-toggle="true"
              width="${_iConf.Width}" height="${_iConf.Height}">
          </span>
        `;

				const helpModal = `
          <div>
            <div>
              <h3><b>Button Controls</b></h3>
              <img id="arrow-exit" src="https://www.svgrepo.com/show/533605/arrow-narrow-right.svg">
            </div>
            <div>
              <div class="mdl-btns-help">
                ${btnsModal}
              </div>
              <div class="darkbox-cont">
                <b>Reset</b>
                <p>Resets image position and scale, toggle settings remain active.</p>
              </div>
              <div>
                <h3><b>Hot Keys</b></h3>
                <p class="spread-align">
                  <span>Hide / Show Interface</span><span class="darkbox-cont">H</span>
                </p>
                <hr class="divider line-white">
                <p class="spread-align">
                  <span>Reset</span><span class="darkbox-cont">Double Click</span>
                </p>
                <hr class="divider line-white">
                <p class="spread-align">
                  <span>Zooming In / Out</span><span class="darkbox-cont">=</span> <span class="darkbox-cont">-</span> or <span class="darkbox-cont">Shift + Mousewheel</span>
                </p>
                <hr class="divider line-white">
                <p class="spread-align">
                  <span>Toggle Background</span><span class="darkbox-cont">C</span>
                </p>
                <hr class="divider line-white">
                <p class="spread-align">
                  <span>Toggle Rendering</span><span class="darkbox-cont">V</span>
                </p>
                <hr class="divider line-white">
              </div>
            </div>
          </div>
        `;

				const createModal = `
          <dialog id="my-img-modal">
            <div class="mdl-btns">
              <span><img
                title="Exit"
                draggable="false"
                src="https://www.svgrepo.com/show/510924/close-md.svg"
                width="${_iConf.Width}" height="${_iConf.Height}">
              </span>
            </div>
            <div>
              <img
                ondragstart="return false"
                id="drag-img"
                loading="lazy"
                src="">
            </div>
            <div class="mdl-btns" data-toggle="true">
              ${btnsModal}
            </div>
            <div class="mdl-btns" data-toggle="true">
              <span>
              <img
                Title="Controls and Hotkeys"
                draggable="false"
                src="https://www.svgrepo.com/show/511031/info.svg"
                width="${_iConf.Width}" height="${_iConf.Height}">
              </span>
            </div>
            ${helpModal}
          </dialog>
        `;

				if (document.getElementById('my-img-modal')) {
					document.getElementById('my-img-modal').remove()
				};

				document.body.insertAdjacentHTML("beforeend", createModal);

				_dom = {
					ImgModal: document.getElementById('my-img-modal'),
					ModalCloseBtn: document.getElementById('my-img-modal').children[0],
					ModalImage: document.getElementById('my-img-modal').children[1],
					ModalDock: document.getElementById('my-img-modal').children[2],
					ModalInfoBtn: document.getElementById('my-img-modal').children[3],
					ModalInfoField: document.getElementById('my-img-modal').children[4],
          ModalHelpBtns: document.getElementById('my-img-modal').children[4].children[1].children[0],
				};

				_eStop = [
					_dom.ModalImage,
					_dom.ModalDock,
					_dom.ModalInfoBtn,
					_dom.ModalInfoField
				];

				_eStop.forEach((ele) =>
					ele.addEventListener("click", (e) => e.stopPropagation())
				);
			};
			buildModal();

			const toggleElement = (num) => {
				return _dom.ModalDock.children[num].children[0]
			};

			function openImage(img) {
				_dom.ModalImage.children[0].src = img;
				_dom.ImgModal.showModal();
				_dom.ImgModal.style.opacity = '1';
				_dom.ImgModal.style.backgroundColor = 'rgba(55, 63, 61, .75)';
				document.body.style = `
                  overflow: hidden;
                  position: fixed;
                  width: 100%;
                `;
				document.querySelector('main').style.marginRight = '17px';
				callModalFunc();
			};

			function reset() {
				_dom.ImgModal.style.backgroundColor = 'rgba(55, 63, 61, .75)';
				_dom.ModalImage.children[0].style = null;
				document.body.style = null;
				document.querySelector('main').style.marginRight = null;
				toggleElement(12).setAttribute('data-toggle', 'true');
				toggleElement(12).src = `https://www.svgrepo.com/show/510903/checkbox-fill.svg`;
				toggleElement(13).setAttribute('data-toggle', 'true');
				toggleElement(13).src = `https://www.svgrepo.com/show/510899/check-big.svg`;
				toggleElement(10).setAttribute('data-toggle', 'true');
				toggleElement(10).style.scale = '1 1';
				toggleElement(11).setAttribute('data-toggle', 'true');
				toggleElement(11).style.scale = '1 1';
				showHelp("reset");
			};

      function showHelp(att) {
        if (att === "reset"){
          _dom.ModalInfoField.style.left = '150vw';
          _dom.ModalInfoBtn.setAttribute('data-toggle', 'true');
        }
        else {
          let getAttr = _dom.ModalInfoBtn.getAttribute('data-toggle');
          move = getAttr == 'true' ? '50%' : '150vw';
          toggle = getAttr == 'true' ? 'false' : 'true';
          _dom.ModalInfoField.style.left = move;
          _dom.ModalInfoBtn.setAttribute('data-toggle', toggle);
        }
			};

			function callModalFunc() {
				var contRect = _dom.ImgModal.getBoundingClientRect()
				var imgRect = _dom.ModalImage.getBoundingClientRect();
				var centerX = (contRect.width * 0.5) - (imgRect.width * 0.5);
				var centerY = (contRect.height * 0.5) - (imgRect.height * 0.5);

				console.log(contRect)

				//Heavily modified and adapted from https://stackoverflow.com/a/60235061/22552292
				const view = (() => {
					const matrix = [1, 0, 0, 1, 0, 0]; // current view transform
					var m = matrix; // alias
					var scale = 1; // current scale
					var pos = {
						x: centerX,
						y: centerY
					}; // current position of origin
					var flipX = '1';
					var flipY = '1';
					var dirty = true;
					const API = {
						applyTo(el) {
							if (dirty) {
								this.update()
							}
							el.style.transform = `matrix(${m[0]},${m[1]},${m[2]},${m[3]},${m[4]},${m[5]})`;
						},
						update() {
							dirty = false;
							m[3] = m[0] = scale;
							m[2] = m[1] = 0;
							m[4] = pos.x;
							m[5] = pos.y;
						},
						updateVariables() {
							if (dirty) {
								this.update()
							}
							contRect = _dom.ImgModal.getBoundingClientRect();
							imgRect = _dom.ModalImage.getBoundingClientRect();
							centerX = (contRect.width * 0.5) - (imgRect.width * 0.5);
							centerY = (contRect.height * 0.5) - (imgRect.height * 0.5);
							pos.x = centerX;
							pos.y = centerY;
							console.log(centerX, centerY);
							dirty = true;
						},
						pan(amount) {
							if (dirty) {
								this.update()
							}
							if (_dom.ModalImage.style.transition != 'unset') _dom.ModalImage.style.transition = 'unset'
							pos.x += amount.x;
							pos.y += amount.y;
							dirty = true;
						},
						scaleAt(at, amount) { // at in screen coords
							if (dirty) {
								this.update()
							}
							if (_dom.ModalImage.style.transition != '0.15s ease') _dom.ModalImage.style.transition = '0.15s ease'
							scale *= amount;
							pos.x = at.x - (at.x - pos.x) * amount;
							pos.y = at.y - (at.y - pos.y) * amount;
							dirty = true;
						},
						reset() {
							if (dirty) {
								this.update()
							}
							if (_dom.ModalImage.style.transition != '0.25s ease') _dom.ModalImage.style.transition = '0.25s ease';
							if (_dom.ModalImage.children[0].style.transition != 'unset') _dom.ModalImage.children[0].style.transition = 'unset';
							_dom.ModalImage.children[0].style.maxWidth = null;
							_dom.ModalImage.children[0].style.maxHeight = null;
							_dom.ModalImage.children[0].style.rotate = null;
							scale = 1;
							pos.x = centerX;
							pos.y = centerY;
							//realSize = true
							dirty = true;
						},
						realSize() {
							if (dirty) {
								this.update()
							}
							if (_dom.ModalImage.style.transition != '0.25s ease') _dom.ModalImage.style.transition = '0.25s ease';
							this.reset;
							amount = _dom.ModalImage.children[0].naturalWidth / _dom.ModalImage.children[0].width;
							scale = amount;
							console.log(centerX, centerY);
							dirty = true;
						},
						rotateLeft() {
							if (dirty) {
								this.update()
							}
							if (_dom.ModalImage.children[0].style.transition != '0.1s ease') _dom.ModalImage.children[0].style.transition = '0.1s ease';
							var getDeg = parseInt(window.getComputedStyle(_dom.ModalImage.children[0], null).getPropertyValue("rotate").replace('deg', ''));
							let setDeg = getDeg - 45;
							_dom.ModalImage.children[0].style.rotate = `${setDeg}deg`;
							dirty = true;
						},
						rotateRight() {
							if (dirty) {
								this.update()
							}
							if (_dom.ModalImage.children[0].style.transition != '0.1s ease') _dom.ModalImage.children[0].style.transition = '0.1s ease';
							var getDeg = parseInt(window.getComputedStyle(_dom.ModalImage.children[0], null).getPropertyValue("rotate").replace('deg', ''));
							let setDeg = getDeg + 45;
							_dom.ModalImage.children[0].style.rotate = `${setDeg}deg`;
							dirty = true;
						},
						zoomIn() {
							if (dirty) {
								this.update();
							}
							if (_dom.ModalImage.style.transition != '0.15s ease') _dom.ModalImage.style.transition = '0.15s ease'
							amount = 1.2;
							scale *= amount;
							dirty = true;
						},
						zoomOut() {
							if (dirty) {
								this.update()
							}
							if (_dom.ModalImage.style.transition != '0.15s ease') _dom.ModalImage.style.transition = '0.15s ease';
							amount = 1 / 1.2;
							scale *= amount;
							dirty = true;
						},
						imgTop() {
							if (dirty) {
								this.update()
							}
							if (_dom.ModalImage.style.transition != 'unset') _dom.ModalImage.style.transition = 'unset';
							if (_dom.ModalImage.children[0].style.rotate != '0deg') _dom.ModalImage.children[0].style.rotate = '0deg';
							//oldY = centerY;
							contRect = _dom.ImgModal.getBoundingClientRect();
							imgRect = _dom.ModalImage.getBoundingClientRect();
							newY = ((contRect.height * 0.5) - (imgRect.height * 0.5));
							pos.x = centerX;
							pos.y = centerY - newY;
							dirty = true;
						},
						imgBottom() {
							if (dirty) {
								this.update()
							}
							if (_dom.ModalImage.style.transition != 'unset') _dom.ModalImage.style.transition = 'unset';
							if (_dom.ModalImage.children[0].style.rotate != '0deg') _dom.ModalImage.children[0].style.rotate = '0deg';
							contRect = _dom.ImgModal.getBoundingClientRect();
							imgRect = _dom.ModalImage.getBoundingClientRect();
							newY = ((contRect.height * 0.5) - (imgRect.height * 0.5));
							pos.x = centerX;
							pos.y = centerY + newY;
							dirty = true;
						},
						toggleBG() {
							let getAttr = toggleElement(12).getAttribute('data-toggle');
							let buttonBG = getAttr == 'true' ? '1' : '0.75';
							let imgSrc = getAttr == 'true' ?
								`https://www.svgrepo.com/show/510902/checkbox-unchecked.svg` :
								`https://www.svgrepo.com/show/510903/checkbox-fill.svg`;
							let buttonValue = getAttr == 'true' ? 'false' : 'true';
							_dom.ImgModal.style.backgroundColor = `rgba(55, 63, 61, ${buttonBG})`;
							toggleElement(12).src = imgSrc;
							toggleElement(12).setAttribute('data-toggle', buttonValue);
						},
						toggleRender() {
							let getAttr = toggleElement(13).getAttribute('data-toggle');
							let buttonRender = getAttr == 'true' ? 'crisp-edges' : 'auto';
							let imgSrc = getAttr == 'true' ?
								`https://www.svgrepo.com/show/377238/check.svg` :
								`https://www.svgrepo.com/show/510899/check-big.svg`;
							let buttonValue = getAttr == 'true' ? 'false' : 'true';
							_dom.ModalImage.children[0].style.imageRendering = buttonRender;
							toggleElement(13).src = imgSrc;
							toggleElement(13).setAttribute('data-toggle', buttonValue);
						},
						hFlip() {
							let getAttr = toggleElement(10).getAttribute('data-toggle');
							if (_dom.ModalImage.children[0].style.transition != 'unset') _dom.ModalImage.children[0].style.transition = 'unset';
							flipX = getAttr == 'true' ? '-1' : '1';
							buttonValue = getAttr == 'true' ? 'false' : 'true';
							toggleElement(10).style.scale = `${flipX} ${flipY}`;
							_dom.ModalImage.children[0].style.scale = `${flipX} ${flipY}`;
							toggleElement(10).setAttribute('data-toggle', buttonValue);
						},
						vFlip() {
							let getAttr = toggleElement(11).getAttribute('data-toggle');
							if (_dom.ModalImage.children[0].style.transition != 'unset') _dom.ModalImage.children[0].style.transition = 'unset';
							flipY = getAttr == 'true' ? '-1' : '1';
							buttonValue = getAttr == 'true' ? 'false' : 'true';
							toggleElement(11).style.scale = `${flipX} ${flipY}`;
							_dom.ModalImage.children[0].style.scale = `${flipX} ${flipY}`;
							toggleElement(11).setAttribute('data-toggle', buttonValue);
						},
            hFitScreen() {
              if (dirty) {
								this.update()
							};
							if (_dom.ModalImage.style.transition != '0.25s ease') _dom.ModalImage.style.transition = '0.25s ease';
							this.reset;
							amount = window.innerWidth / _dom.ModalImage.children[0].width;
							scale = amount;
							console.log(centerX, centerY);
							dirty = true;
            },
            vFitScreen() {
              if (dirty) {
								this.update()
							};
							if (_dom.ModalImage.style.transition != '0.25s ease') _dom.ModalImage.style.transition = '0.25s ease';
							this.reset;
							amount = window.innerHeight / _dom.ModalImage.children[0].height;
							scale = amount;
							console.log(centerX, centerY);
							dirty = true;
            }
					};
					return API;
				})();
				_dom.ModalImage.style.transform = `matrix(1,0,0,1,${centerX},${centerY}`;

				const Apply = () => {
					view.applyTo(_dom.ModalImage);
				};
				const proceedTo = {
					UpdateVars: () => {
						view.updateVariables();
						Apply()
					},
					Reset: () => {
						view.reset();
						Apply()
					},
					RealSize: () => {
						view.realSize();
						Apply()
					},
					RotateLeft: () => {
						view.rotateLeft();
						Apply()
					},
					RotateRight: () => {
						view.rotateRight();
						Apply()
					},
					ZoomIn: () => {
						view.zoomIn();
						Apply()
					},
					ZoomOut: () => {
						view.zoomOut();
						Apply()
					},
					TopOfImg: () => {
						view.imgTop();
						Apply()
					},
					BottomOfImg: () => {
						view.imgBottom();
						Apply()
					},
					toggleBG: () => {
						view.toggleBG();
						Apply()
					},
					toggleRender: () => {
						view.toggleRender();
						Apply()
					},
					hFlip: () => {
						view.hFlip();
						Apply()
					},
					vFlip: () => {
						view.vFlip();
						Apply()
					},
          vFitScreen: () => {
            view.vFitScreen();
						Apply()
          },
          hFitScreen: () => {
            view.hFitScreen();
						Apply()
          }
				};

        var _iFuncs = [
					proceedTo.Reset,
          proceedTo.ZoomIn,
					proceedTo.ZoomOut,
					proceedTo.RotateLeft,
					proceedTo.RotateRight,
					proceedTo.RealSize,
          proceedTo.hFitScreen,
          proceedTo.vFitScreen,
					proceedTo.TopOfImg,
					proceedTo.BottomOfImg,
					proceedTo.hFlip,
					proceedTo.vFlip,
          proceedTo.toggleBG,
					proceedTo.toggleRender,
				];

				function setEvents() {
          ["cancel", "click"].forEach((types) =>
          // Since you also want to be a chocolate starfish, fine have it your way you knob jocky.
						_dom.ImgModal.addEventListener(types, proceedTo.Reset)
					);

					["cancel", "click"].forEach((types) =>
          // Twotty knob goblins...
						_dom.ImgModal.addEventListener(types, modalClose)
					);

					["mousemove", "mousedown", "mouseup", "mouseout"].forEach((types) =>
						_dom.ModalImage.addEventListener(types, mouseEvent, {
							passive: false
						})
					);
					_dom.ModalImage.addEventListener("wheel", mouseWheelEvent, {
						passive: false
					});
					_dom.ModalImage.addEventListener("dblclick", proceedTo.Reset, {
						passive: false
					});

					_iFuncs.forEach((events) =>
						_dom.ModalDock.children[_iFuncs.indexOf(events)].addEventListener("click", events, false)
					);

					document.addEventListener("keydown", keyPressEvent);
					window.addEventListener("resize", proceedTo.UpdateVars);
					_dom.ModalInfoBtn.addEventListener("click", showHelp);
					_dom.ModalInfoField.children[0].children[1].addEventListener("click", showHelp);
					//addEvent(infoArrow, "click", showHelp, {once: true});
				};
				setEvents()

				function removeEvents() { //Since you want to be a piece of #$%@, fine, @#$% you...
          ["cancel", "click"].forEach((types) =>
						_dom.ImgModal.removeEventListener(types, proceedTo.Reset)
					);

					["cancel", "click"].forEach((types) =>
						_dom.ImgModal.removeEventListener(types, modalClose)
					);

					["mousemove", "mousedown", "mouseup", "mouseout"].forEach((types) =>
						_dom.ModalImage.removeEventListener(types, mouseEvent, {
							passive: false
						})
					);
					_dom.ModalImage.removeEventListener("wheel", mouseWheelEvent, {
						passive: false
					});
					_dom.ModalImage.removeEventListener("dblclick", proceedTo.Reset, {
						passive: false
					});

					_iFuncs.forEach((events) =>
						_dom.ModalDock.children[_iFuncs.indexOf(events)].removeEventListener("click", events, false)
					);

					document.removeEventListener("keydown", keyPressEvent);
					window.removeEventListener("resize", proceedTo.UpdateVars);
					_dom.ModalInfoBtn.removeEventListener("click", showHelp);
					_dom.ModalInfoField.children[1].removeEventListener("click", showHelp);
					//addEvent(infoArrow, "click", showHelp, {once: true});
				};

				const mouse = {
					x: 0,
					y: 0,
					oldX: 0,
					oldY: 0,
					button: false
				};

				function mouseEvent(e) {
					if (e.type === "mousedown") {
						mouse.button = true
					};
					if (e.type === "mouseup" || e.type === "mouseout") {
						mouse.button = false
					};
					mouse.oldX = mouse.x;
					mouse.oldY = mouse.y;
					mouse.x = e.pageX;
					mouse.y = e.pageY;
					if (mouse.oldX != 0 || mouse.oldY != 0) {
						if (mouse.button) { // pan
							view.pan({
								x: mouse.x - mouse.oldX,
								y: mouse.y - mouse.oldY
							});
							view.applyTo(_dom.ModalImage);
						};
					};
					e.preventDefault();
				};

				function mouseWheelEvent(e) {
					if (e.shiftKey) {
						const x = e.pageX - (_dom.ModalImage.children[0].width / 2);
						const y = e.pageY - (_dom.ModalImage.children[0].height / 2);
						if (e.deltaY < 0) {
							view.scaleAt({
								x,
								y
							}, 1.1);
							view.applyTo(_dom.ModalImage);
						} else {
							view.scaleAt({
								x,
								y
							}, 1 / 1.1);
							view.applyTo(_dom.ModalImage);
						};
						e.preventDefault();
					};
				};

				function toggleInterfaceEvent() {
					let getAttr = _dom.ModalDock.getAttribute('data-toggle');
					let result = getAttr == 'true' ? 'opacity: 0.0' : null;
					let toggle = getAttr == 'true' ? 'false' : 'true';
					_dom.ModalDock.style = _dom.ModalInfoBtn.style = _dom.ModalCloseBtn.style = result;
					_dom.ModalDock.setAttribute('data-toggle', toggle);
				};

				var isOnDiv = false;
				_dom.ModalImage.addEventListener("mouseenter", () => {
					isOnDiv = true
				});
				_dom.ModalImage.addEventListener("mouseleave", () => {
					isOnDiv = false
				});

				_dom.ImgModal.addEventListener("mousedown", cursorHold, {
					passive: true
				});
				_dom.ImgModal.addEventListener("mouseup", cursorReset);
				document.addEventListener("keyup", cursorReset);

				function cursorReset(e) {
					if (e.repeat) return;
					_dom.ModalImage.style.cursor = 'all-scroll';
				};

				function cursorHold(e) {
					if (e.repeat) return;
					_dom.ModalImage.style.cursor = 'none';
				};

				function cursorMagnify() {
					if (_dom.ModalImage.style.cursor == 'zoom-in') return;
					_dom.ModalImage.style.cursor = 'zoom-in';
				};

				const KEY_HANDLERS = {
					F1: () => console.log('You pressed F1.'),
					ArrowUp: () => console.log('You pressed ↑.'),
					Escape: () => modalClose(),
					KeyH: () => toggleInterfaceEvent(),
					KeyC: () => proceedTo.toggleBG(),
					KeyV: () => proceedTo.toggleRender(),
					ShiftLeft: () => cursorMagnify(),
					ShiftRight: () => cursorMagnify(),
					Minus: () => proceedTo.ZoomOut(),
					Equal: () => proceedTo.ZoomIn(),
          KeyK: () => proceedTo.hFlip(),
				};

				function keyPressEvent(e) {
					e.preventDefault();
					const handler = KEY_HANDLERS[e.code];
					if (e.repeat) return;
					if (handler) {
						handler();
						return;
					};
					console.log('Pressed a key without a handler.');
				};

				infoKeys = [{
						"Reset": "Resets image position and scale, toggle settings remain active."
					},
          {
						"Zoom-In": "Increases image size by set amount. Zooms from Center."
					},
					{
						"Zoom-Out": "Decreases image size by set amount. Zooms from Center."
					},
					{
						"Rotate Left": "Rotates image left."
					},
					{
						"Rotate Right": "Rotates image Right."
					},
					{
						"Real Size": "Shows image at true size, removing page scaling."
					},
          {
						"Fit Height to Screen": "Expands Image Height to the edges of the screen."
					},
          {
						"Fit Width to Screen": "Expands Image width to the edges of the screen."
					},
					{
						"To-Top": "Goes to the top of an image, Zoom remains intitial size."
					},
					{
						"To-Bottom": "Goes to the bottom of an image, Zoom remains intitial size."
					},
					{
						"Flip Horizontally": "Flips the Image Horizontally."
					},
					{
						"Flip Vertically": "Flips the Image Vertically."
					},
          {
						"Toggle Background": "Toggles between image view background being a solid color to transparent."
					},
					{
						"Toggle Rendering": "Toggles between image rendering smooth and pixelated."
					},
				];

				for (var key in infoKeys) {
					let mTitle = Object.keys(infoKeys[key]);
					let mDesc = Object.values(infoKeys[key]);
					_dom.ModalHelpBtns.children[key].addEventListener("click", () => {
						if (_dom.ModalInfoField.children[1].children[1].querySelector('b').innerText != mTitle) {
							_dom.ModalInfoField.children[1].children[1].querySelector('b').innerText = mTitle;
							_dom.ModalInfoField.children[1].children[1].querySelector('p').innerText = mDesc;
						};
					});
				};

				function modalClose() {
					if (_dom.ModalImage.style.transition != 'unset') _dom.ModalImage.style.transition = 'unset';
					_dom.ImgModal.style.opacity = '0';
					_dom.ImgModal.style.backgroundColor = 'rgba(55, 63, 61, 0)';
					removeEvents();
					setTimeout(() => {
            reset();
						_dom.ImgModal.close();
					}, "300");
				};
			};
			buildModal();
		};
	}, 2500);
})();
