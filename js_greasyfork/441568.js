// ==UserScript==
// @name					Rolagem Preguiçosa
// @description				Role as páginas ao passar o mouse na barra de rolagem.
// @author					EvilSpark - Mod By: JarEdMaster
// @namespace				EvilSpark
// @version					1.1.1
// @license					MIT
// @grant					GM_getValue
// @grant					GM_setValue
// @grant					GM_addStyle
// @run-at					document-end
// @include					*
// @include					http://*
// @include					https://*
// @downloadURL https://update.greasyfork.org/scripts/441568/Rolagem%20Pregui%C3%A7osa.user.js
// @updateURL https://update.greasyfork.org/scripts/441568/Rolagem%20Pregui%C3%A7osa.meta.js
// ==/UserScript==

//Ed: Traduzi(com ajuda do google ;-;) os comentários do autor, eles são os que não tem a marca de quem comenta ex: "Ed:" dps do "//".

function scrollPlus() {
	/*###Customization:
    Tradu: ###Customização:

	Show the scrolling indicator box or not, "1" to show. |
    Trad: Mostra a caixa do indicador de rolagem ou não, "1" para mostrar. |
    Ed: Obviamente outro valor vai ocultar.
    */
	var scrollShowIndicator = 1;

	/*
    Set the width of scroll-sensitive zone, "100" as full width, "10" as one tenth.
    Trad: Defina a largura da zona sensível à rolagem, "100" como largura total, "10" como um décimo.
    Ed: Trocando em miudos, 1=10%, 2=20% e assim por diante.
    */

	var VScrollonWidth = 1;

	/*
    Set the background of the indicator bar.
    Trad: Defina o plano de fundo da barra indicadora.
	*/
    var IndicBarBG = '#8f8f8f';

	/*Set the height of "thickness" of the indicator bar.
    Trad: Defina a altura da "espessura" da barra indicadora.
	*/
    var IndicBarH = 30;

	/*
    Write here the width of the scrollbar (set in display properties) for highest accuracy.
    Trad: aqui a largura da barra de rolagem (definida nas propriedades de exibição) para maior precisão.
    */

	var ScrollbarWidth = 7;

	/*
    Set a trigger for activation, 1-none, 2-Ctrl key, 3-middle 100px range.
    Trad: Defina um gatilho para ativação, 1-nenhum, 2-Ctrl chave, 3-médio intervalo de 100px.
    */

	var activateCond = 1;

	/*###Customization ends.
    Trad: ###Fim das customizações.
    */

	var scrollStartSWTM = -1;

	var factor;
	var b = null;
	var VScrollOn = 0;
	var delayed = 0;

	document.addEventListener(
		'mousemove',
		function(event) {
			if (document.body.contentEditable == 'true') {
				return;
			}

			var dheightMax = Math.max(
				document.body.scrollHeight,
				document.documentElement.scrollHeight
			);
			var cwidthMax =
				Math.max(
					document.body.clientWidth,
					document.documentElement.clientWidth
				) - ScrollbarWidth;
			var cwinHeight = window.innerHeight;
			var scrollboxHeight = window.innerHeight - 2 * ScrollbarWidth;

			if (dheightMax > cwinHeight) {
				if (event.clientX > cwidthMax) {
					switch (activateCond) {
						case 1:
							VScrollOn = 1;
							break;
						case 2:
							if (event.ctrlKey) VScrollOn = 1;
							break;
						case 3:
							if (
								event.clientY > cwinHeight / 2 - 50 &&
								event.clientY < cwinHeight / 2 + 50
							){ //Ed: só add esse "{" nesse "if", e "}" antes do break,pq o tamp fica dando exclamação, e isso me incomoda, apesar do cód funcionar sem, vai saber.
								VScrollOn = 1;
                            }
							break;
					}
				}

				if (event.clientX < (1 - VScrollonWidth / 100) * cwidthMax){ //Ed: Msm problema que teve um pouco mais acima.
					VScrollOn = 0;
                }
			}

			if (VScrollOn && !delayed) {
				setTimeout(function() {
					if (VScrollOn) {
						delayed = 1;
					} else {
						delayed = 0;
					}
				}, 200);

				return;
			}

			if (VScrollOn) {
				if (scrollShowIndicator == 1) make_boxes();

				if (scrollStartSWTM != -1) {
					factor = event.ctrlKey
						? dheightMax / scrollboxHeight / 2
						: dheightMax / scrollboxHeight;
					if (b) {
						b.style.top = event.clientY - IndicBarH / 2 + 'px';
					}

					var delta = factor * (event.clientY - scrollStartSWTM);
					document.body.scrollTop += delta;
					document.documentElement.scrollTop += delta;
					if (event.clientY + 20 > cwinHeight) {
						document.body.scrollTop += factor * 10;
						document.documentElement.scrollTop += factor * 10;
					}
					if (event.clientY > 0 && event.clientY < 20) {
						document.body.scrollTop -= factor * 10;
						document.documentElement.scrollTop -= factor * 10;
					}
				}
				scrollStartSWTM = event.clientY;
			} else {
				scrollStartSWTM = -1;
				if (b){ //Parece que o autor não gosta dos "{}", kkkkkkkjkkk
					setTimeout(function() {
						b.style.top = -200 + 'px';
					}, 200);
                }
				delayed = 0;
			}
		},
		false
	);

	document.addEventListener(
		'click',
		function() {
			VScrollOn = 0;
		},
		false
	);

	function make_boxes() {
		if (!b) {
			b = document.createElement('div');
			b.setAttribute('id', 'IndicatorBox');
			b.setAttribute(
				'style',
				'width:' +
					VScrollonWidth +
					'%;background:' +
					IndicBarBG +
					';min-height:' +
					IndicBarH +
					'px;text-align:center;position: fixed; top: -40px; right: 0;overflow: hidden; z-index: 102400;font-family:Arial !important;cursor:n-resize;cursor:ns-resize;'
			);
			document.body.appendChild(b);
			b.addEventListener(
				'click',
				function() {
					VScrollOn = 0;
				},
				false
			);
			return true;
		}
	}
}

if (!(window !== window.top || window.document.title === '')) {
	setTimeout(scrollPlus, 100);
}
