// ==UserScript==
// @name        Steam ARG SEARCH button
// @namespace   reddit/defproc/steam-arg-search
// @description SEARCH button
// @include     http://store.steampowered.com/app/*
// @include     https://store.steampowered.com/app/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/15748/Steam%20ARG%20SEARCH%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/15748/Steam%20ARG%20SEARCH%20button.meta.js
// ==/UserScript==

var btn = document.createElement("button");
btn.addEventListener('click', function(){
				g_strBuffer == '';
				var strPassword = prompt();
				if( !strPassword )
				{
					return;
				}

				$J.ajax({
					url: "http:\/\/store.steampowered.com\/actions\/clues",
					dataType: "json",
					cache: false,
					data: {key: strPassword}
				}).done(function( result ) {
					if( result && result.url )
						window.location = result.url;
					else if( result.response )
						alert(result.response);
				});  
});

btn.setAttribute("style", "top:0;left:0;position:absolute;color:#fff;background:#444;padding:10px 20px;border:none");
btn.innerHTML = "SEARCH";
document.body.appendChild(btn);