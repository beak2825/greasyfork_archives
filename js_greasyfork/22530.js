// ==UserScript==
// @name        PRF Sistema SEI - Abrir Documento em Nova Página
// @namespace   br.gov.prf.sei.scripts.documentonovapagina
// @description Cria um botão que permite abrir um documento SEI em uma nova página
// @include     /^https?:\/\/sei\.prf\.gov\.br\/sei\/controlador\.php\?.*acao=arvore_visualizar.*$/
// @author      Marcelo Barros
// @run-at      document-idle
// @version     1.0.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22530/PRF%20Sistema%20SEI%20-%20Abrir%20Documento%20em%20Nova%20P%C3%A1gina.user.js
// @updateURL https://update.greasyfork.org/scripts/22530/PRF%20Sistema%20SEI%20-%20Abrir%20Documento%20em%20Nova%20P%C3%A1gina.meta.js
// ==/UserScript==

function adicionarBotao() {

	var iframe = document.getElementById('ifrArvoreHtml');
	if (iframe) {

		var divBotoes = document.getElementById('divArvoreAcoes');
		if (divBotoes) {

			var img = document.createElement('img');
			img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AgSEBExDtHlrQAAAjFJREFUWMPtmM+K2lAUxr8jJpPin4mj5OLCldAqExmJu25cFkq7EboqfYnupItCQvEd7KYFoZtuqvs+QQQHWmtXWbiYmpJChRGJmNtFzSBFMTOO1dJ8EEhuzrn8cu/J4ZwLhAoV6t8WbeOsKIoEQAbAb+A+s237xyaj6DaAiUTiMYDXAKY3cD+3bfvBTgFTqZQE4HhxXVcnQYy2AuSc7zwGowFjLe15Xn4ymXj+2Hw+HxMR3zVkIEDG2CNZlt9Uq1V43m9GIvrc6XQMQRD2DyiKoidJ0jfDMJ4v+didTidzEFsMAI7jOET0bnmsUqk82zVgJHDCJMI+FMGBKwQMAUPAEDAEDG4nHCxgJpN5L4riw30AbiwWcrnccb/ff7W4fzEcDn/670ql0sYPJKJ1ha3Q7Xa3b5rK5TID8GnxqPZ6vdFSRZ0GkAfgrSq42+123jTNU13XP6zYrUsi+rL1CsZisdl0Op0DgCRJsz9WxwHgrPMtFounAJ4ahvHy1reYMfYVwNiyLIExdgIAlmV9ZIzNACRHo9E9RVGeAJDWTOFxzu/H4/HLncRgNpu9e/UnRSJ+b3Lmj7VaLbHZbL4FcGft5NEoJEk6N03z9hv3wWDAAWA8HqNerwMAGo0GkskkAKBQKBDn/CxA+gkUa9dtJ5fBjzRNu9A07QLA0Rqbv5sHiegqL6iqKruuS67rkqqq8iqbveZBXdc9AN/9wK/Vaod1eMQ5jwBI+80dEXkIFeo/0i9hv6eW21lV5QAAAABJRU5ErkJggg==';
			img.className = 'infraCorBarraSistema';
			img.alt = 'Nova Página';
			img.title = 'Nova Página';

			var a = document.createElement('a');
			a.href = iframe.src;
			a.target = '_blank';

			a.appendChild(img);
			divBotoes.appendChild(a);
		}
	}
}

(function() {
	'use strict';
	setTimeout(adicionarBotao, 500);
})();