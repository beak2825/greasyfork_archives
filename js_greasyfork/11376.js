// ==UserScript==
// @name        "Este usuário não participou do fórum + Erro buscando a página" Reloader
// @description Recarrega a página se aparecerem as mensagens: "Este usuário não participou do fórum" ou "Erro buscando a página ... do tópico ..."
// @include     http://forum.jogos.uol.com.br/*
// @version     2.0
// @namespace https://greasyfork.org/users/13894
// @downloadURL https://update.greasyfork.org/scripts/11376/%22Este%20usu%C3%A1rio%20n%C3%A3o%20participou%20do%20f%C3%B3rum%20%2B%20Erro%20buscando%20a%20p%C3%A1gina%22%20Reloader.user.js
// @updateURL https://update.greasyfork.org/scripts/11376/%22Este%20usu%C3%A1rio%20n%C3%A3o%20participou%20do%20f%C3%B3rum%20%2B%20Erro%20buscando%20a%20p%C3%A1gina%22%20Reloader.meta.js
// ==/UserScript==

init = function () 
{	
	if (document.title === 'Fórum UOL Jogos :: Índice do fórum')
	{
		location.reload(false);
	}
	if (document.getElementsByClassName('user-no-messages')[0].innerHTML === 'Este usuário não participou do fórum.')
	{
		location.reload(false);
	}
}

init();
