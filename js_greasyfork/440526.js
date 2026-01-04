	// ==UserScript==
	// @name           JVChat Premium (fixed version)
	// @description    Outil de discussion instantanée pour les forums de Jeuxvideo.com
	// @author         Blaff / Fixed by Yhria [Yhn]
	// @namespace      JVChatPremium
	// @version        0.2.0
	// @match          http://*.jeuxvideo.com/forums/42-*
	// @match          https://*.jeuxvideo.com/forums/42-*
	// @match          http://*.jeuxvideo.com/forums/1-*
	// @match          https://*.jeuxvideo.com/forums/1-*
	// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/440526/JVChat%20Premium%20%28fixed%20version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/440526/JVChat%20Premium%20%28fixed%20version%29.meta.js
	// ==/UserScript==


	/*
	API : les développeurs peuvent créer des "plugins" pour JVChat à l'aide d'un système d'évènements.
	Cela permet par exemple à un deuxième userscript de modifier les messages au moment où ils sont
	ajoutés par JVChat, afin que chacun puisse personnaliser son affichage et ajouter de nouvelles
	fonctionnalités.

	Pour cela, il suffit d'écouter l'évènement "jvchat:newmessage". Celui-ci est émis chaque fois
	qu'un novueau message est ajouté, il contient l'identifiant dudit message à récupérer dans le DOM
	via le data-attribut "jvchat-id".

	Il existe aussi l'évènement "jvchat:activation" qui est émis une seule fois : à l'initialisation
	lorsque le topic pass en mode "JVChat" après appui sur le bouton.

	Exemple pour cacher les messages qui contiennent certains mot-clefs:

		// my_plugin.user.js
		let keywords = ["foobar", "barbaz"]

		addEventListener("jvchat:newmessage", function(event) {
			// L'id du message est stocké dans event.detail.id
			// L'attribut event.detail.isEdit est mis à "true" s'il s'agit d'un message édité
			let message = document.querySelector(`.jvchat-message[jvchat-id="${event.detail.id}"]`);
			let text = message.querySelector(".txt-msg").textContent;
			for (let keyword of keywords) {
				if (text.includes(keyword)) {
					message.style.display = "none";
					return;
				}
			}
		});

	*/


	/*
	TODO:
	- Smooth transition on append messages (slide-in plutôt que jump)
	- Détection captcha
	- Bouton actualiser les messages (+ afficher le delai courrant d'actualisation)
	- Notification avec @pseudo
	- Blacklist
	- Pouvoir voir les anciens messages
	- La leftbar ne se rétrécie pas si le titre du topic n'a pas d'espaces
	*/

	let CSS = `<style type="text/css" id="jvchat-css">
	#forum-right-col,
	#jv-footer,
	#middle,
	#zone-sponso,
	#header-top,
	#full-site,
	header.jv-header-menu,
	.titre-head-bloc,
	.bloc-pre-pagi-forum,
	.bloc-message-forum,
	.bloc-message-forum-anchor,
	.bloc-pagi-default,
	.bloc-outils-top,
	.bloc-outils-bottom,
	.option-previsu,
	.sondage-fofo,
	#dfp_pulse,
	.nu-context-menu,
	.message-lock-topic,
	.form-post-message > .row > div:nth-child(2),
	.conteneur-messages-pagi > a:last-of-type,
	#bloc-meta-titre-jeu,
	.gameHeaderBanner,
	.gameHeaderSubNav,
	.forumAnchorWrapper,
	.bloc-sondage::before,
	.layout__contextTop,
	.layout__breadcrumb,
	.layout__adHeader,
	.layout__videoFooter,
	.layout__contentAside,
	.layout__footer,
	.js-header,
	.layout__contentTop
	{
		display: none!important;
	}

	html,
	body,
	#jvchat-main,
	#page-messages-forum,
	#forum-main-col,
	#forum-main-col > .conteneur-messages-pagi
	{
		height: 100%;
		width: 100%;
	}

	.jvchat-hide {
		display: none!important;
	}

	.jvchat-hide-visibility {
		visibility: hidden;
	}

	body {
		overflow-y: unset;
	}

	.jvchat-disabled-form {
		opacity: 0.5;
		cursor: not-allowed;
		pointer-events: none;
	}

	#bloc-formulaire-forum > .form-post-message > .row {
		margin: 0;
	}

	.jv-editor > .conteneur-editor > .text-editor {
		border: 0;
		background: none;
		display: flex!important;
	}

	#jvchat-alerts {
		position: absolute;
		z-index: 3;
		right: 1rem;
		left: 0;
		overflow-y: hidden;
	}

	#jvchat-alerts .alert {
		margin: 1rem 2rem;
		border-radius: 0.5rem;
	}

	#jvchat-leftbar {
		max-width: 15rem;
		flex-grow: 100000;
		flex-shrink: 100;
		position: relative;
	}

	#jvchat-leftbar-button {
		display: flex;
		position: absolute;
		right: 0;
		top: 0;
	}

	#jvchat-leftbar-button span {
		font-size: 1.2rem;
		color: white;
		padding: 0 1rem 0 0rem;
		max-width: 100%;
		cursor: pointer;
		opacity: 0.3;
	}

	#jvchat-leftbar-button span:hover {
		opacity: 1;
	}

	#page-messages-forum {
		margin: 0;
		padding: 0;
		display: block;
	}

	#page-messages-forum > .layout__contentMain {
		display: flex;
		padding: 0!important;
		height: 100%;
		max-width: unset;
	}

	#page-messages-forum {
		margin: 0;
		display: flex;
	}

	#forum-main-col {
		flex-basis: 35rem;
		flex-grow: 100;
		overflow-x: auto;
		position: relative;
		min-width: 13rem;
	}

	#jvchat-right-padding {
		flex-shrink:1000;
		flex-grow:0;
	}

	#forum-main-col > .conteneur-messages-pagi {
		display: flex;
		flex-direction: column;
	}

	#page-messages-forum > .container-content {
		padding: 0;
		max-width: unset;
		min-width: unset;
		min-height: unset;
		max-height: unset;
	}

	.form-post-message {
		margin: 0;
	}

	#message_topic {
		resize: none;
		min-width: unset;
	}

	.jvchat-edition-textarea {
		resize: none;
		width: 100%;
		max-height: 6.5rem;
		min-height: 3.5rem;
	}

	.jvchat-reduced #message_topic {
		padding: 0.3rem;
		height: 1.7rem;
		max-height: 6.5rem;
		overflow: auto;
	}

	.jvchat-reduced .jv-editor .conteneur-editor > * {
		display: none;
	}

	#jvchat-buttons-main button {
		padding: 0;
		width: 2rem;
	}

	#jvchat-buttons-main button::before {
		font-size: 1.4rem;
	}

	#jvchat-buttons-main button.icon-reply::before {
		font-size: 1rem;
	}

	.jvchat-buttons {
		display: flex;
		flex-direction: column;
	}

	.jvchat-buttons button {
		border: 0.0625rem solid #BEBECC;
		border-left-width: 0;
		height: 100%;
		background: white;
		color: gray;
	}

	.jvchat-buttons .jvchat-button-solo {
		border-radius: 0 0.3rem 0.3rem 0;
	}

	.jvchat-buttons .jvchat-button-top {
		border-radius: 0 0.3rem 0 0;
	}

	.jvchat-buttons .jvchat-button-bottom {
		border-radius: 0 0 0.3rem 0;
		border-top: 0!important;
	}

	.jvchat-textarea {
		border-radius: 0.3rem 0 0 0.3rem!important;
		border: 0.0625rem solid #BEBECC!important;
		border-right-width: 0!important;
	}

	.jvchat-buttons button:hover {
		background: lightgray;
		color: black;
	}

	.jvchat-buttons button:focus {
		outline: none;
		border: dotted 1px!important;
		color: black;
		border: blue;
	}

	#forum-main-col {
		display: block;
		padding: 0;
		max-width: unset;
	}

	#jvchat-leftbar > .panel {
		margin: 0;
		padding: 0 0.5rem;
	}

	#jvchat-config {
		line-height: 1.40;
	}

	#jvchat-leftbar #jvchat-profil .titre-info-fofo,
	#jvchat-leftbar #jvchat-configuration .titre-info-fofo {
		margin-top: 0.5rem;
	}

	#jvchat-configuration-intro {
		color: grey;
		font-size: 0.84rem;
	}

	#jvchat-leftbar .titre-info-fofo {
		margin-top: 1rem;
	}


	.jvchat-config-option {
		margin-top: 2rem;
	}

	.jvchat-config-option p {
		font-size:0.83rem;
	}

	.jvchat-config-option > label {
		margin-bottom: 0.15rem;
	}

	.jvchat-range-option {
		display: flex;

	}

	.jvchat-range-option > span {
		white-space: nowrap;
		margin: 0px 10px;
	}

	.jvchat-range-option > input {
		width: 65%;
	}

	.jvchat-message {
		display: flex;
		margin-bottom: 0.35rem;
	}

	.jvchat-bloc-message {
		animation-duration:0.5s;
		animation-name: slidein;
	}

	.jvchat-message-deleted > div {
		opacity: 0.2;
		filter: grayscale(100%);
	}

	.jvchat-message-deleted {
		position: relative;
	}

	.jvchat-message-deleted:after {
		content: "Message supprimé";
		position: absolute;
		top: 40%;
		left: 50%;
		color: gray;
		font-weight: bold;
		opacity: 0.7;
	}

	.jvchat-message-deleted .jvchat-delete,
	.jvchat-message-deleted .jvchat-edit {
		display: none;
	}

	@keyframes slidein {
	from {
		opacity: 0;
	}

	to {
		opacity: 1;
	}
	}

	.jvchat-toolbar {
		margin: 0 0 .3rem 0;
	}

	.jvchat-author {
		margin: 0;
		display: inline-block;
	}

	.jvchat-tooltip {
		display: flex;
		float: right;
		color: gray;
	}

	.jvchat-picto {
		margin-right: 0.3rem;
		visibility: hidden;
	}

	.jvchat-bloc-message:hover .jvchat-picto {
		visibility: visible;
		cursor: pointer;
		opacity: 0.25;
	}

	.jvchat-picto:hover {
		opacity: 1!important;
	}

	.jvchat-edition {
		display: flex;
	}

	.jvchat-edition-check {
		color: darkgreen!important;
	}

	.jvchat-edition-cancel {
		color: darkred!important;
	}

	.jvchat-edition-textarea {
		outline: none;
		width: 100%;
	}

	hr.jvchat-ruler:first-of-type {
		margin-top: auto;
	}

	.jvchat-ruler {
		margin: 0rem 0rem .35rem 0rem;
		border-style: solid;
		border-top-width: 0.0625rem;
		border-bottom-width: 0.0625rem;
		border-block-end-color: #ddd;
	}

	#jvchat-ruler-new {
		border-bottom: 1px outset gray;
	}

	.jvchat-bloc-author-content {
		overflow: hidden;
		width: 100%;
		margin-left: .875rem;
	}

	.jvchat-content > .txt-msg > p:last-of-type {
		margin-bottom: 0;
	}

	.jvchat-content > .txt-msg p {
		margin-bottom: 0.2rem;
	}

	.jvchat-content .text-enrichi-forum blockquote.blockquote-jv {
		margin: 0.2rem 0;
		padding: 0rem 0.3rem 0 0.3rem;
	}

	.jvchat-content .text-enrichi-forum .nested-quote-toggle-box {
		position: relative!important;
	}

	.jvchat-rounded {
		overflow: hidden;
		border-radius: 50%;
		background-size:     cover;
		background-repeat:   no-repeat;
		background-position: center center;
	}

	.jvchat-bloc-avatar {
		min-width: 40px;
		min-height: 40px;
		width: 40px;
		height: 40px;
		box-shadow: -3px 3px 7px grey;
	}

	#jvchat-user-avatar-link {
		width: 60%;
		min-width: 3rem;
		min-height: 3rem;
		margin: auto;
	}

	.jvchat-user-avatar {
		width: 100%;
		padding-top: 100%;
	}

	.jvchat-content .img-shack {
		height: 39px;
		width: 52px;
		display: inline-block;
		vertical-align: bottom;
		margin-bottom:0.27rem;
		overflow: hidden;
	}

	.jvchat-content .img-stickers {
		max-height: 39px;
		min-height: 39px;
		width: auto;
		display: inline-block;
		vertical-align: bottom;
		margin-bottom:0.1rem;
	}

	#jvchat-main .bloc-spoil-jv .open-spoil {
		position: unset;
		display: none;
	}

	.new-stickers {
		background-color: unset;
	}

	#jvchat-user-mp {
		font-size: 1.3rem;
		margin: auto;
	}

	#jvchat-user-notif {
		font-size: 1.7rem;
		margin: auto;
	}

	#jvchat-user-pseudo {
		margin: 0.5rem;
		text-align: center;
		/* overflow-x: hidden; */
	}

	#jvchat-user-info {
		display: flex;
	}

	#jvchat-user-info .jv-header-menu {
		position: unset;
		display: flex;
		justify-content: center;
		flex-direction: column;
		margin: auto;
	}

	#jvchat-topic-link {
		color: white;
	}

	#jvchat-topic-info {
		display: flex;
		flex-direction: column;
	}

	#jvchat-topic-nb-connected {
		color: lightgray;
	}

	#jvchat-topic-nb-messages {
		color: lightgray;
	}

	#bloc-formulaire-forum .jv-editor > .conteneur-editor {
		margin: 0;
		border: 0;
		padding: 0.5rem;
		line-height: normal;
	}

	#jvchat-main {
		overflow-y: auto;
		padding: 0.35rem 0.875rem;
		display: flex;
		flex-direction: column;
	}

	#jvchat-leftbar > .panel-jv-forum {
		height: 100%;
		overflow-y: auto;
	}

	#jvchat-leftbar.jvchat-leftbar-reduced {
		flex-grow: 0;
	}

	#jvchat-leftbar.jvchat-leftbar-reduced > .panel > .panel-body {
		display: none;
	}

	#jvchat-leftbar.jvchat-leftbar-reduced #jvchat-leftbar-button {
		position: relative;
	}

	#jvchat-leftbar.jvchat-leftbar-reduced span {
		padding: 0;
	}

	#jvchat-leftbar > .panel {
		position: relative;
	}

	.disabled-content {
		opacity: 0.3;
		cursor: not-allowed;
		pointer-events: none;
	}

	#jvchat-sondage-bloc {
		background: unset;
		padding: 0;
	}

	#jvchat-sondage-bloc .pourcent {
		background: unset;
		width: 5rem;
	}

	#jvchat-sondage-bloc .back-barre {
		width: 5rem;
	}

	#jvchat-sondage-bloc .tab-choix {
		margin-bottom: 1rem;
	}

	#jvchat-sondage-choix.notanswered .result-pourcent {
		display: none;
	}

	#jvchat-sondage-choix.notanswered .reponse {
		background:  url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAICAYAAAAx8TU7AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAA5SURBVAiZbY7BDQAgDAKPTqaTOxp+rDaNvAhcAvLAACyLo0jDlF9YiCxk+0N+FJ1iWbrr5UH0AGADblEVRpZSAyQAAAAASUVORK5CYII=') no-repeat left 0.35rem;
		padding-left: 0.7rem;
	}

	#jvchat-sondage-choix.notanswered .reponse > div {
		cursor: pointer;
	}

	#jvchat-turbo {
		display: inline-block;
		cursor: pointer;
		margin-top: 0.3rem;
		-webkit-tap-highlight-color: transparent;
		position: relative;
	}

	#jvchat-turbo i {
		position: relative;
		display: inline-block;
		margin-right: .5rem;
		width: 46px;
		height: 26px;
		background-color: #e6e6e6;
		border-radius: 23px;
		vertical-align: text-bottom;
		transition: all 0.3s linear;
	}

	#jvchat-turbo i::before {
		content: "";
		position: absolute;
		left: 0;
		width: 42px;
		height: 22px;
		background-color: #fff;
		border-radius: 11px;
		transform: translate3d(2px, 2px, 0) scale3d(1, 1, 1);
		transition: all 0.25s linear;
	}

	#jvchat-turbo i::after {
		content: "";
		position: absolute;
		left: 0;
		width: 22px;
		height: 22px;
		background-color: #fff;
		border-radius: 11px;
		box-shadow: 0 2px 2px rgba(0, 0, 0, 0.24);
		transform: translate3d(2px, 2px, 0);
		transition: all 0.2s ease-in-out;
	}

	#jvchat-turbo:active i::after {
		width: 28px;
		transform: translate3d(2px, 2px, 0);
	}

	#jvchat-turbo:active input:checked + i::after {
		transform: translate3d(16px, 2px, 0);
	}

	#jvchat-turbo input {
		display: none;
	}

	#jvchat-turbo input:checked + i {
		background-color: #4BD763;
	}

	#jvchat-turbo input:checked + i::before {
		transform: translate3d(18px, 2px, 0) scale3d(0, 0, 0);
	}

	#jvchat-turbo input:checked + i::after {
		transform: translate3d(22px, 2px, 0);
	}

	#jvchat-turbo-span {
		position: absolute;
		margin-top: 4px;
	}

	#jvchat-alerts.jvchat-hide-alerts #jvchat-turbo-warning,
	#jvchat-alerts.jvchat-hide-alerts #jvchat-degraded-refresh-warning {
		display: none!important;
	}

	#jvchat-main.jvchat-hide-mosaics .jvchat-mosaic-root::before {
		content: "Mosaïque Cachée ¯\\\\_(ツ)_/¯";
		color:black;
		text-align:center;
		font-size:10px;
		display:block;
		height:55px;
		width:55px;
		background: white;
		border: solid #f00;
	}

	#jvchat-main.jvchat-hide-mosaics .jvchat-mosaic-root {
		pointer-events: none;
	}


	#jvchat-main.jvchat-hide-mosaics .jvchat-mosaic {
		display: none;
	}

	#jvchat-turbo-delay-range,
	#jvchat-max-width-range,
	#jvchat-hide-mosaic-checkbox,
	#jvchat-hide-mosaic-span,
	#jvchat-night-mode-checkbox,
	#jvchat-night-mode-span,
	#jvchat-load-images-checkbox,
	#jvchat-load-images-span,
	#jvchat-play-sound-checkbox,
	#jvchat-play-sound-span {
		cursor: pointer;
	}

	.jvchat-night-mode #jvchat-leftbar > .panel {
		background-color: #2F3136!important;
	}

	.jvchat-night-mode {
		color: #dcddde!important;
		scrollbar-color: #191A1C #2F3136!important;
	}

	.jvchat-night-mode .jvchat-ruler {
		border-color: #2e3035!important;
		border-top: 1px solid transparent !important;
	}

	.jvchat-night-mode .conteneur-editor,
	.jvchat-night-mode .bloc-editor-forum,
	.jvchat-night-mode .jvchat-bloc-message,
	.jvchat-night-mode .conteneur-messages-pagi {
		background-color: #36393F!important;
	}

	.jvchat-night-mode #message_topic,
	.jvchat-night-mode .btn-group {
		background: #484C52!important;
	}

	.jvchat-night-mode .jvchat-bloc-avatar {
		box-shadow: -3px 3px 7px black!important;
	}

	.jvchat-night-mode #jvchat-leftbar > .panel {
		background-color: #2F3136!important;
	}

	.jvchat-night-mode .jvchat-edition-textarea {
		background-color: #2a2a2a!important;
	}

	.jvchat-night-mode .jvchat-buttons button {
		background: #484c52!important;
	}

	.jvchat-night-mode .text-enrichi-forum blockquote.blockquote-jv {
		border-left-color: #484C52!important;
	}

	.jvchat-night-mode .text-enrichi-forum .nested-quote-toggle-box::after {
		background-color: #484c52!important;
		border-color: #737373!important;
		color: #737373!important;
	}

	.jvchat-night-mode .text-enrichi-forum .nested-quote-toggle-box:hover::before {
		color: #cbcdce!important;
	}

	.jvchat-night-mode .bloc-spoil-jv .contenu-spoil {
		background-color: #2d2d2d!important;
		border-color: #202020!important;
	}

	</style>`;

	let PANEL = `
	<div id='jvchat-leftbar'>
		<div class='panel panel-jv-forum'>
			<div id="jvchat-leftbar-button">
				<div id="jvchat-leftbar-config">
					<span id="jvchat-leftbar-config-open" class="nav-icon-config" title="Afficher les paramètres"></span>
					<span id="jvchat-leftbar-config-close" class="nav-icon-close jvchat-hide" title="Fermer les paramètres"></span>
				</div>
				<div id="jvchar-leftbar-size">
					<span id="jvchat-leftbar-reduce" class="icon-arrow-left" title="Masquer la sidebar"></span>
					<span id="jvchat-leftbar-extend" class="icon-arrow-right jvchat-hide" title="Afficher la sidebar"></span>
				</div>
			</div>
			<div class='panel-body'>
				<div id='jvchat-info'>
					<div id='jvchat-profil' class='jvchat-hide'>
						<h4 class='titre-info-fofo'>Profil</h4>
						<h4 id='jvchat-user-pseudo'></h4>
						<div id='jvchat-user-info'>
							<a title="Ouvrir le profil" id="jvchat-user-avatar-link" target="_blank"><div id='jvchat-user-avatar' class='jvchat-rounded jvchat-user-avatar'></div></a>
							<div class='jv-header-menu'>
								<a target="_blank" href="https://www.jeuxvideo.com/messages-prives/boite-reception.php" title="Ouvrir la boîte de réception" id="jvchat-user-mp-link"><span id="jvchat-user-mp" class="jv-account-number-mp" data-val="0"></span></a>
								<a target="_blank" title="Ouvrir les notifications" href="https://www.jeuxvideo.com/messages-prives/boite-reception.php" id="jvchat-user-notif-link"><span id="jvchat-user-notif" class="jv-account-number-notif" data-val="0"></span></a>
							</div>
						</div>
					</div>
					<div id='jvchat-topic'>
						<h4 class='titre-info-fofo'>Topic</h4>
						<div id="jvchat-topic-info">
							<div><strong><a title="Ouvrir le topic" id="jvchat-topic-title"></a></strong></div>
							<span id="jvchat-topic-nb-connected"></span>
							<span id="jvchat-topic-nb-messages"></span>
							<label id="jvchat-turbo" title="Actualise la liste des messages plus rapidement">
								<input id="jvchat-turbo-checkbox" type="checkbox">
								<i></i>
								<span id="jvchat-turbo-span">Mode Turbo</span>
							</label>
						</div>
					</div>
					<div id='jvchat-forum'>
						<h4 class='titre-info-fofo'>Forum</h4>
						<div id="jvchat-forum-info">
							<div><strong><a title="Ouvrir le forum" id="jvchat-forum-title"></a></strong></div>
						</div>
					</div>
					<div id='jvchat-sondage' class='jvchat-hide'>
						<h4 class='titre-info-fofo'>Sondage</h4>
						<div id="jvchat-sondage-bloc" class="bloc-sondage">
							<label><span id="jvchat-sondage-intitule"></span></label>
							<table class="tab-choix"><tbody id="jvchat-sondage-choix" class="notanswered"></tbody></table>
							<span id="jvchat-sondage-votes"></span>
						</div>
					</div>
				</div>
				<div id='jvchat-config' class='jvchat-hide'>
					<div id='jvchat-configuration'>
						<h4 class='titre-info-fofo'>Configuration</h4>
						<p id='jvchat-configuration-intro'><i>Les paramètres sont automatiquement sauvegardés et mis à jour lorsque vous les modifiez.</i></p>
						<div class="jvchat-config-option" id="jvchat-play-sound">
							<label>
								<input id="jvchat-play-sound-checkbox" type="checkbox">
								<span id="jvchat-play-sound-span">Alerte sonore</span>
							</label>
							<p>Joue un son de notification lorsqu'un nouveau message est posté et que vous êtes sur un onglet différent.</p>
						</div>
						<div class="jvchat-config-option" id="jvchat-night-mode">
							<label>
								<input id="jvchat-night-mode-checkbox" type="checkbox">
								<span id="jvchat-night-mode-span">Thème sombre</span>
							</label>
							<p>Active un mode nuit pour protéger vos petits yeux fatigués le soir.</p>
						</div>
						<div class="jvchat-config-option" id="jvchat-load-imagesc">
							<label>
								<input id="jvchat-load-images-checkbox" type="checkbox">
								<span id="jvchat-load-images-span">Charger les images</span>
							</label>
							<p>Remplace les miniatures NoelShack avec l'image source complète afin de laisser apparaître la transparence (cela sollicite davantage votre connexion Internet).</p>
						</div>
						<div class="jvchat-config-option" id="jvchat-hide-mosaic">
							<label>
								<input id="jvchat-hide-mosaic-checkbox" type="checkbox">
								<span id="jvchat-hide-mosaic-span">Masquer les mosaïques</span>
							</label>
							<p>Cache automatiquement les mosaïques d'images NoelShack pour réduire le flooding.</p>
						</div>
						<div class="jvchat-config-option" id="jvchat-turbo-delay">
							<label>
								<span>Délai Turbo</span>
							</label>
							<div class='jvchat-range-option'>
								<input id="jvchat-turbo-delay-range" type="range" min="0" max="1000" step="50">
								<span id="jvchat-turbo-delay-span">? ms</span>
							</div>
							<p>Ajuste le délai d'actualisation des messages en mode turbo (celui-ci permet une meilleure réactivité lors d'un quiz mais ne doit pas être activé continuellement).</p>
						</div>
						<div class="jvchat-config-option" id="jvchat-max-width">
							<label>
								<span>Largeur des messages</span>
							</label>
							<div class='jvchat-range-option'>
								<input id="jvchat-max-width-range" type="range" min="0" max="100" step="1">
								<span id="jvchat-max-width-span">? %</span>
							</div>
							<p>Configure l'espace utilisé horizontalement par les messages (une valeur réduite facilite la lecture sur les écrans larges).</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	`;

	let freshHash = undefined;
	let freshDeletionHash = undefined;
	let freshForm = undefined;
	let firstMessageId = undefined;
	let firstMessageDate = undefined;
	let lastEditionTime = {};  // id => [timestamp, edition, deleted]
	let messagesByPage = {};
	let userConnected = undefined;
	let updateIntervals = [2, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 10, 10, 10, 10, 10, 10, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 30, 30, 30, 30, 30, 30, 30, 30, 60];
	let transisitions = [0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 19, 19, 19, 19, 19, 19, 19, 19, 31];
	let updateIntervalIdx = 2;
	let updateIntervalMax = updateIntervals.length - 1;
	let isLocked = false;
	let isError = false;
	let isReduced = true;
	let nbNewMessage = 0;
	let topicNbMessages = 0;
	let favicon = undefined;
	let faviconLoaded = false;
	let faviconTextWhenLoaded = "";
	let currentUser = { notif: undefined, mp: undefined, author: undefined, avatar: undefined };
	let currentTopicTitle = undefined;
	let turboActivated = false;
	let turboDateActivated = undefined;
	let turboWarnTimeoutId = -1;
	let turboDateSessions = [];
	let refreshDegraded = false;
	let refreshDegradedTimeoutId = -1;
	let useMobileForUpdateMessages = false;
	let timeoutedDates = [];
	let refreshInfosAcceptable = [];
	let sondageChoices = undefined;
	let urlToFetch = undefined;
	let urlToRefreshInfos = undefined;
	let urlToCheckEdited = undefined;
	let currentFetchedPage = 1;
	let currentTimeoutId = -1;
	let shouldCheckEdited = false;
	let checkEditedInterval = 30000;
	let switchToMobileTimeoutId = -1;
	let refreshInfosTimeoutId = -1;
	let postingMessage = false;
	let fetchingMessages = false;
	let leavingTopic = false;
	let storageKey = "jvchat-premium-configuration";
	let ringBell = undefined;
	let configuration = undefined;

	function defaultConfig() {
		return {
			default_reduced: false,
			turbo_delay: 500,
			max_width: 100,
			hide_alerts: false,
			play_sound: false,
			night_mode: false,
			load_images: false,
			hide_mosaic: false,
			turbo_alerted: false,
			sound: "data:audio/mp3;base64, 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KZ+4/J4hhPMbxk9uZlkvh6/jLtS6T9noZlleNzM1apGt+7CwkdfONPpLpNT0rivtF6d5JRejlihnmuTMIf3OWsl7KKKapZHQ3IBmnFlUchyHaOIzN+Syuo2SUVYPlNqCn+n4xG78SrR1lD/QTSyWlcKHJychjdSVSWMwDAM3EY7Rf/////4vzXlEEQJGHKsO7LsZ6U2J2PwPQf/////wNDUARKBH5g6tXeyKSKCcnRpY3DcYAAEAAAMEoLwyQhqjAOAaMLkNqt00SR7TGnEwMCcLkwGAN/0YLQF4kEeYBQBxgMgDf5zDxADC4wy5TXmbBm6JJimNECMEY0V/+ZUKbI8RFS75hwiwRgQhhQ3//mSGBgiSmIDAYQ8RaowYaYQy///4FAgIFCFcICDBAACE//uSxO0AK+Iu+xnsAAT7PuBXPaAAsrSBICGWxf///q8USLIIaMqLIIUF1n1hhHpwYQrd////69i6hehbyJiOCcatiVjSXVaU3Fpsebiy2x/////+jW3RSxAe2JliKcPPIim67osRh10V2u7ALDWcx1hv///////DiG7T48oOzeXsjTHhtmap3fdFMdYWZaysLddlhtaIrlpqFlMSp//////////3Hh1Qdf8HMPUvasytPttG5svXpBLO1LJlr//////7WYlRuzEotEYCfqZiTvX4k5UPRJynekxBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqkxBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7ksQ5A8AAAaQcAAAgAAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo="
		};
	}

	function saveConfig() {
		let config = JSON.stringify(configuration);
		localStorage.setItem(storageKey, config);
	}

	function loadConfig() {
		let config = JSON.parse(localStorage.getItem(storageKey) || "{}");
		for (let key in config) {
			if (config.hasOwnProperty(key) && configuration.hasOwnProperty(key)) {
				configuration[key] = config[key];
			}
		}
	}

	function getTimestamp() {
		return new Date().getTime();
	}

	function getForm(doc) {
		return doc.getElementsByClassName('form-post-message')[0];
	}

	function getHash(doc) {
		let hash = doc.querySelector("#ajax_hash_liste_messages")
		if (!hash) {
			return undefined;
		}
		return hash.getAttribute("value");
	}

	function getDeletionHash(doc) {
		let hash = doc.querySelector("#ajax_hash_moderation_forum")
		if (!hash) {
			return undefined;
		}
		return hash.getAttribute("value");
	}


	function getTopicLocked(elem) {
		let lock = elem.getElementsByClassName("message-lock-topic")[0];
		if (lock === undefined) {
			return lock;
		}
		let reason = lock.getElementsByTagName("span")[0].textContent.trim();
		return `Le topic a été vérouillé pour la raison suivante : "${reason}"`;
	}

	function getTopicError(elem) {
		let error = elem.getElementsByClassName("img-erreur")[0];
		if (error === undefined) {
			return error;
		}
		return `Le topic présente une erreur: ${error.getAttribute("alt")}`;
	}

	function parseSondageMobile(elem) {
		let blocSondage = elem.getElementsByClassName("bloc-sondage")[0];
		if (!blocSondage) {
			return null;
		}
		let intitule = blocSondage.getElementsByClassName("sondage-titre")[0].textContent.trim().replace("Sondage : ", "");

		let results = [];
		let responses = blocSondage.getElementsByClassName("sondage-reponses")[0];
		let spans = responses.getElementsByTagName("span");
		for (let span of spans) {
			let pourcent = parseInt(span.textContent.trim().split(" ")[0]);
			results.push({ pourcent: pourcent });
		}
		return { answered: false, intitule: intitule, results: results, votes: undefined };
	}


	function parseSondage(elem) {
		let blocSondage = elem.getElementsByClassName("bloc-sondage")[0];
		if (!blocSondage) {
			return null;
		}
		let intitule = blocSondage.getElementsByClassName("intitule-sondage")[0].innerHTML;
		let answered = !!(blocSondage.getElementsByClassName("result-pourcent")[0]);

		let choix = blocSondage.getElementsByClassName("tab-choix")[0].getElementsByTagName("tr");
		let results = [];

		if (answered) {
			for (let ch of choix) {
				let pourcent = parseInt(ch.getElementsByClassName("pourcent")[0].innerHTML.trim().split(" ")[0]);
				let response = ch.getElementsByClassName("reponse")[0].innerHTML.trim();
				results.push({ response: response, pourcent: pourcent });
			}
		} else {
			for (let ch of choix) {
				let btnResponse = ch.getElementsByClassName("btn-sondage-reponse")[0];
				let response = btnResponse.innerHTML.trim();
				let sondageId = btnResponse.getAttribute("data-id-sondage");
				let responseId = btnResponse.getAttribute("data-id-reponse");
				results.push({ response: response, sondageId: sondageId, responseId: responseId });
			}
		}

		let votes = parseInt(blocSondage.getElementsByClassName("pied-result")[0].innerHTML.trim().split(" ")[0]);
		return { answered: answered, intitule: intitule, results: results, votes: votes };
	}

	function tryCatch(func) {
		function wrapped(optArg) {
			try {
				func(optArg);
			} catch (err) {
				let message = `Une erreur est survenue dans JVChat Premium: '${err.message}' (function '${func.name}', line ${err.lineNumber})`;
				console.error("===== JVCHAT ERROR =====");
				console.error(message)
				console.error(err);
				console.error("========================");
				try {
					addAlertbox("danger", message);
				} catch (e) {
					alert(message);
				}
			}
		}
		return wrapped;
	}

	function toggleTextarea() {
		isReduced = !isReduced;
		configuration["default_reduced"] = isReduced;
		saveConfig();

		let isDown = isScrollDown();
		document.getElementById("bloc-formulaire-forum").getElementsByClassName("jv-editor-toolbar")[0].classList.toggle("jvchat-hide");
		document.getElementById("jvchat-enlarge").classList.toggle("jvchat-hide");
		document.getElementById("jvchat-reduce").classList.toggle("jvchat-hide");
		document.getElementById("jvchat-post").classList.toggle("jvchat-hide");
		document.getElementById("bloc-formulaire-forum").classList.toggle("jvchat-reduced");

		setTextareaHeight();

		if (isDown) {
			setScrollDown();
		}
	}

	function parseURL(url) {
		let regex = /^(.*?)(\/\d+-\d+-\d+-)(\d+)(-\d+-\d+-\d+-)(.*?)(\.htm)(.*)$/i;
		let [_, domain, ids, page, nums, title, htm, anchor] = url.match(regex);
		return { domain: domain, ids: ids, page: page, nums: nums, title: title, htm: htm, anchor: anchor };
	}

	function buildURL(dict) {
		return `${dict.domain}${dict.ids}${dict.page}${dict.nums}${dict.title}${dict.htm}${dict.anchor}`;
	}

	function getForum(document) {
		let ariane = document.getElementsByClassName("js-layout")[0];
		let links = ariane.getElementsByTagName("a");
		let title = "";
		let forumLink = "";

		for (let i = links.length - 1; i >= 0; i--) {
			forumLink = links[i];
			title = forumLink.innerHTML.trim();
			if (title.startsWith("Forum ")) {
				break;
			}
		}

		return { href: forumLink.getAttribute("href"), title: title.replace("Forum ", "") };
	}

	function getLastPage(document) {
		let blocPages = document.getElementsByClassName("bloc-liste-num-page")[0];
		let spans = blocPages.getElementsByTagName("span");
		let lastPage = 1;
		for (let span of spans) {
			let page = parseInt(span.textContent.trim());
			if (!isNaN(page) && page > lastPage) {
				lastPage = page;
			}
		}
		return lastPage;
	}

	function parseMessageMobile(elem) {
		let author = elem.getElementsByClassName("text-auteur")[0].textContent.trim();
		let blacklisted = false;
		let avatar = elem.getElementsByClassName("user-avatar-msg")[0];
		if (avatar !== undefined) {
			avatar = avatar.getAttribute("data-srcset");
		}
		let date = elem.getElementsByClassName("date-post")[0].textContent.trim();
		let content = elem.getElementsByClassName("message")[0];
		content.setAttribute("class", "txt-msg  text-enrichi-forum");
		let id = parseInt(elem.getAttribute("id").split("_")[1]);
		let edited = undefined;
		return {
			author: author, dateString: date, date: parseDate(date), avatar: avatar, edited: edited,
			id: id, content: content, blacklisted: blacklisted
		};
	}

	function parseMessage(elem) {
		let conteneurs = elem.getElementsByClassName("conteneur-message");
		let conteneur = conteneurs[conteneurs.length - 1];
		let author = conteneur.getElementsByClassName("bloc-pseudo-msg")[0].textContent.trim();
		let blacklisted = conteneurs[0].classList.contains("conteneur-message-blacklist");
		let avatar = conteneur.getElementsByClassName("user-avatar-msg")[0];
		console.log(avatar)
		if (avatar !== undefined) {
			avatar = avatar.getAttribute("data-src");
		}
		console.log(avatar)
		let date = conteneur.getElementsByClassName("bloc-date-msg")[0].textContent.trim();
		let content = conteneur.getElementsByClassName("txt-msg")[0];
		let id = parseInt(elem.getAttribute("data-id"));
		let edited = elem.getElementsByClassName("info-edition-msg")[0];
		if (edited !== undefined) {
			let msgEdited = edited.textContent.trim();
			edited = msgEdited.match(/Message édité le .*? à (.*?) par/i)[1];
		}
		return {
			author: author, dateString: date, date: parseDate(date), avatar: avatar, edited: edited,
			id: id, content: content, blacklisted: blacklisted
		};
	}

	function parseUserInfo(elem) {
		let accountMp = elem.getElementsByClassName("header__globalUser")[0];
		if (accountMp === undefined) {
			return { author: undefined, avatar: undefined, mp: undefined, notif: undefined };
		}
		let numberMp = accountMp.getElementsByClassName("headerAccount__pm")[0];
		let accountNotif = elem.getElementsByClassName("headerAccount--notif")[0];
		let numberNotif = accountNotif.getElementsByClassName("headerAccount__notif")[0];
		let accountUser = elem.getElementsByClassName("headerAccount--user")[0];
		let avatarBox = accountUser.getElementsByClassName("headerAccount__avatar")[0];
		let authorBox = accountUser.getElementsByClassName("headerAccount__pseudo")[0];
		let mp = parseInt(numberMp.getAttribute("data-val"));
		let notif = parseInt(numberNotif.getAttribute("data-val"));
		let avatar = avatarBox.style["background-image"].slice(5, -2).replace("/avatar-md/", "/avatar/");
		let author = authorBox.textContent.trim();
		return { author: author, avatar: avatar, mp: mp, notif: notif };
	}

	function getPage(elem) {
		let pageActive = elem.getElementsByClassName("page-active")[0];
		let page = 1;
		if (pageActive !== undefined) {
			page = parseInt(pageActive.textContent.trim());
		}
		return page;
	}

	function parseTopicInfoMobile(elem) {
		let title = elem.getElementsByClassName("bloc-nom-sujet")[0].getElementsByTagName("span")[0].textContent.trim();
		let connected = undefined;
		let page = 1;
		let lastPage = 1;
		let pagination = elem.getElementsByClassName("pagination-b")[0];
		if (pagination !== undefined) {
			let numPage = pagination.getElementsByClassName("num-page")[0];
			if (numPage !== undefined) {
				page = parseInt(numPage.textContent.trim());
			}
			let rightElt = pagination.getElementsByClassName("right-elt")[0];
			let lastPageStr = rightElt.textContent.trim();
			if (lastPageStr !== "") {
				lastPage = parseInt(lastPageStr);
			} else {
				lastPage = page;
			}
		}
		return { title: title, connected: connected, lastPage: lastPage, page: page };
	}

	function parseTopicInfo(elem) {
		let title = elem.querySelector("#bloc-title-forum").textContent.trim();
		let connected = parseInt(elem.getElementsByClassName("nb-connect-fofo")[0].textContent.trim());
		let lastPage = getLastPage(elem);
		let page = getPage(elem);
		return { title: title, connected: connected, lastPage: lastPage, page: page };
	}

	function fixMessage(elem) {
		let jvcares = Array.from(elem.getElementsByClassName("JvCare"));
		for (let jvcare of jvcares) {
			let a = document.createElement("a");
			a.setAttribute("target", "_blank");
			a.setAttribute("href", jvCake(jvcare.getAttribute("class")));
			a.innerHTML = jvcare.innerHTML;
			jvcare.outerHTML = a.outerHTML;
		}
		let togglableQuotes = Array.from(elem.querySelectorAll(".text-enrichi-forum > blockquote > blockquote"));
		for (let togglableQuote of togglableQuotes) {
			let toggleButton = document.createElement("div");
			toggleButton.classList.add("nested-quote-toggle-box");
			togglableQuote.insertBefore(toggleButton, togglableQuote.firstChild);
			// The click event is bound in the "dontScrollOnExpand()" function
		}
	}

	function jvCake(cls) {
		let base16 = '0A12B34C56D78E9F', lien = '', s = cls.split(' ')[1];
		for (let i = 0; i < s.length; i += 2) {
			lien += String.fromCharCode(base16.indexOf(s.charAt(i)) * 16 + base16.indexOf(s.charAt(i + 1)));
		}
		return lien;
	}

	function detectMosaic(elem) {
		let imagesShack = elem.getElementsByClassName("img-shack");
		if (imagesShack.length < 4) {
			return;
		}
		let mosaics = {};
		let regex = /^.+\/(?:[0-9]+-)+[0-9]{1,2}-([a-z0-9]+)\.\w+$/i;
		for (let image of imagesShack) {
			let match = image.src.match(regex);
			if (!match) {
				continue;
			}
			[_, identifier] = match;
			if (mosaics.hasOwnProperty(identifier)) {
				mosaics[identifier].push(image);
			} else {
				mosaics[identifier] = [image]
			}
		}
		for (let identifier in mosaics) {
			let images = mosaics[identifier];
			if (images.length < 4) {
				continue;
			}
			images[0].parentNode.classList.add("jvchat-mosaic-root");
			images[0].classList.add("jvchat-mosaic");
			for (let image of images.slice(1)) {
				image.parentNode.classList.add("jvchat-mosaic");
			}
		}
	}

	function improveImages(elem) {
		let imagesShack = elem.getElementsByClassName("img-shack");
		for (let image of imagesShack) {
			let src = image.src;
			let parent = image.parentNode;
			let extension = parent.href.split(".").pop();
			let direct = src.replace(/(.*?)\/minis\/(.*)\.\w+/i, "$1/fichiers/$2." + extension);
			image.setAttribute("data-src-mini", src);
			image.setAttribute("data-src-direct", direct);
			image.classList.add("jvchat-loadable-image");
			parent.href = direct;
			if (extension.toUpperCase() === "GIF") {
				image.src = direct;
				image.classList.remove("jvchat-loadable-image");
			} else if (configuration["load_images"]) {
				image.src = direct;
			}
			src = image.src;
			image.setAttribute("onerror", `this.onerror=null;this.src=this.getAttribute("data-src-direct");this.classList.remove("jvchat-loadable-image");`);
		}
	}

	function clearPage(document) {
		let buttons = `
			<div id="jvchat-buttons-main" class='jvchat-buttons'>
				<button id='jvchat-post' tabindex="4" type="button" class='jvchat-hide jvchat-button-top icon-reply' title="Envoyer le message"></button>
				<button id='jvchat-reduce' tabindex="5" type="button" class='jvchat-hide jvchat-button-bottom icon-arrow-down-entypo' title="Réduire la zone de texte"></button>
				<button id='jvchat-enlarge' tabindex="4" type="button" class='jvchat-button-solo icon-arrow-up-entypo' title="Agrandir la zone de texte"></button>
			<div>`;

		document.head.insertAdjacentHTML("beforeend", CSS);

		let previsu = document.getElementById("bloc-formulaire-forum").getElementsByClassName("previsu-editor")[0];
		if (previsu) {
			previsu.parentElement.removeChild(previsu);
		}

		let messageTopic = document.getElementById("message_topic");
		if (messageTopic) {
			messageTopic.classList.add("jvchat-textarea");
			messageTopic.setAttribute("placeholder", "Hop hop hop, le message ne va pas s'écrire tout seul !");
			messageTopic.insertAdjacentHTML("afterend", buttons);
			messageTopic.addEventListener("keydown", tryCatch(postMessageIfEnter));
			document.getElementById("jvchat-post").addEventListener("click", tryCatch(postMessage));
			document.getElementById("jvchat-enlarge").addEventListener("click", tryCatch(toggleTextarea));
			document.getElementById("jvchat-reduce").addEventListener("click", tryCatch(toggleTextarea));
		}
		document.getElementsByClassName("conteneur-messages-pagi")[0].insertAdjacentHTML("afterbegin", "<div id='jvchat-main'><hr class='jvchat-ruler'></div>");
		document.getElementById("forum-main-col").insertAdjacentHTML("afterbegin", "<div id='jvchat-alerts'><div id='jvchat-fixed-alert' class='jvchat-hide'><div class='alert-row'></div></div><div id='jvchat-turbo-warning' class='jvchat-hide'><button class='close jvchat-alert-hide' aria-hidden='true' data-dismiss='alert' type='button'>×</button><div class='alert-row'></div></div><div id='jvchat-degraded-refresh-warning' class='jvchat-hide'><div class='alert-row'></div></div></div>");

		document.getElementsByClassName("layout__contentMain")[0].insertAdjacentHTML("afterbegin", PANEL);
		document.getElementsByClassName("layout__contentMain")[0].insertAdjacentHTML("beforeend", "<div id='jvchat-right-padding'></div>");

		document.getElementById("page-messages-forum").classList.add("jvchat-root");

		document.getElementById("bloc-formulaire-forum").classList.add("jvchat-reduced");
		document.getElementById("bloc-formulaire-forum").classList.add("jvchat-hide");

		let toolbar = document.getElementById("bloc-formulaire-forum").getElementsByClassName("jv-editor-toolbar")[0];
		if (toolbar) {
			toolbar.classList.add("jvchat-hide");
		}

		document.getElementById("jvchat-main").addEventListener("click", tryCatch(dontScrollOnExpand));

		document.getElementById("jvchat-alerts").addEventListener("click", tryCatch(closeAlert));

		document.getElementById("jvchat-leftbar-reduce").addEventListener("click", tryCatch(toggleSidebar));
		document.getElementById("jvchat-leftbar-extend").addEventListener("click", tryCatch(toggleSidebar));
		document.getElementById("jvchat-leftbar-config-open").addEventListener("click", tryCatch(toggleConfig));
		document.getElementById("jvchat-leftbar-config-close").addEventListener("click", tryCatch(toggleConfig));

		document.getElementById("jvchat-turbo-checkbox").addEventListener("change", tryCatch(toggleTurbo));

		document.getElementById("jvchat-play-sound-checkbox").checked = configuration["play_sound"];
		document.getElementById("jvchat-play-sound-checkbox").addEventListener("change", tryCatch(togglePlaySoundOption));

		document.getElementById("jvchat-night-mode-checkbox").checked = configuration["night_mode"];
		document.getElementById("jvchat-night-mode-checkbox").addEventListener("change", tryCatch(toggleNightModeOption));
		if (configuration["night_mode"]) {
			document.getElementById("page-messages-forum").classList.add("jvchat-night-mode");
		}

		document.getElementById("jvchat-hide-mosaic-checkbox").checked = configuration["hide_mosaic"];
		document.getElementById("jvchat-hide-mosaic-checkbox").addEventListener("change", tryCatch(toggleHideMosaicOption));
		if (configuration["hide_mosaic"]) {
			document.getElementById("jvchat-main").classList.add("jvchat-hide-mosaics");
		}

		if (configuration["hide_alerts"]) {
			document.getElementById("jvchat-alerts").classList.add("jvchat-hide-alerts");
		}

		document.getElementById("jvchat-load-images-checkbox").checked = configuration["load_images"];
		document.getElementById("jvchat-load-images-checkbox").addEventListener("change", tryCatch(toggleLoadImagesOption));

		document.getElementById("jvchat-turbo-delay-range").value = configuration["turbo_delay"];
		document.getElementById("jvchat-turbo-delay-span").innerHTML = `${configuration["turbo_delay"]} ms`;
		document.getElementById("jvchat-turbo-delay-range").addEventListener("input", tryCatch(changeTurboDelayOption));

		document.getElementById("jvchat-max-width-range").value = configuration["max_width"];
		document.getElementById("jvchat-max-width-span").innerHTML = `${configuration["max_width"]} %`;
		document.getElementById("jvchat-max-width-range").addEventListener("input", tryCatch(changeMaxWidthOption));
		adjustMaxWidth(configuration["max_width"]);

		let favs = Array.from(document.querySelectorAll("link[rel='icon'], link[rel='shortcut icon']"));
		for (let fav of favs) {
			fav.parentElement.removeChild(fav);
		}
		setFavicon("");

		document.addEventListener("visibilitychange", function () {
			let hidden = document.hidden;
			if (hidden) {
				let newHr = document.getElementById("jvchat-ruler-new");
				if (newHr) {
					newHr.removeAttribute("id");
				}
				nbNewMessage = 0;
			} else if (!isError && !isLocked) {
				setFavicon("");
			}
		});
	}

	function toggleSidebar(event) {
		let isDown = isScrollDown();
		document.getElementById("jvchat-leftbar-extend").classList.toggle("jvchat-hide");
		document.getElementById("jvchat-leftbar-reduce").classList.toggle("jvchat-hide");
		document.getElementById("jvchat-leftbar-config").classList.toggle("jvchat-hide");
		document.getElementById("jvchat-leftbar").classList.toggle("jvchat-leftbar-reduced");
		if (isDown) {
			setScrollDown();
		}
	}

	function toggleConfig(event) {
		document.getElementById("jvchat-leftbar-config-open").classList.toggle("jvchat-hide");
		document.getElementById("jvchat-leftbar-config-close").classList.toggle("jvchat-hide");
		document.getElementById("jvchat-info").classList.toggle("jvchat-hide");
		document.getElementById("jvchat-config").classList.toggle("jvchat-hide");
	}

	function forceUpdate() {
		// If waiting for next update, restart it immediately, otherwise just wait for the HTTP request to end
		if (!fetchingMessages) {
			clearTimeout(currentTimeoutId);
			updateMessages(currentFetchedPage, true);
		}
	}

	function scheduleTurboWarningDelay() {
		let now = getTimestamp();
		let maxAllowedTime = 60 * 1000;
		let lookupTime = now - 90 * 1000;
		let nbToCleanup = 0;
		let duration = 0;

		for (let session of turboDateSessions) {
			let begin = session[0];
			let end = session[1];
			if (end < lookupTime) {
				nbToCleanup++;
				continue;
			}
			duration += end - Math.max(lookupTime, begin);
		}

		for (let i = 0; i < nbToCleanup; i++) {
			turboDateSessions.shift();
		}

		let remainingTimeAllowed = Math.max(0, maxAllowedTime - duration);
		turboDateActivated = now;
		turboWarnTimeoutId = setTimeout(tryCatch(setTurboWarning), remainingTimeAllowed);
	}

	function toggleTurbo(event) {
		let checked = document.getElementById("jvchat-turbo-checkbox").checked;
		updateIntervalIdx = 2;
		if (!checked) {
			turboActivated = false;
			turboDateSessions.push([turboDateActivated, getTimestamp()]);
			clearTimeout(turboWarnTimeoutId);
			removeTurboWarning();
			turboDateActivated = undefined;
			turboWarnTimeoutId = -1;
		} else {
			turboActivated = true;

			if (!configuration["turbo_alerted"]) {
				configuration["turbo_alerted"] = true;
				saveConfig();
				alert(
					"Attention : le mode turbo va multiplier le nombre de requêtes effectuées pour récupérer les nouveaux messages.\n\n" +
					"Cependant, si trop de requêtes sont effecutées par minute, JVC va délibérement ralentir votre connexion.\n\n" +
					"N'activez le mode turbo que si vous participez à un quiz et qu'une question est sur le point d'être posée."
				);
			}

			scheduleTurboWarningDelay();
			forceUpdate();
		}
	}

	function togglePlaySoundOption(event) {
		let checked = document.getElementById("jvchat-play-sound-checkbox").checked;
		configuration["play_sound"] = checked;
		saveConfig();
	}

	function toggleNightModeOption(event) {
		let checked = document.getElementById("jvchat-night-mode-checkbox").checked;
		configuration["night_mode"] = checked;
		saveConfig();
		document.getElementById("page-messages-forum").classList.toggle("jvchat-night-mode");
	}

	function toggleHideMosaicOption(event) {
		let checked = document.getElementById("jvchat-hide-mosaic-checkbox").checked;
		configuration["hide_mosaic"] = checked;
		saveConfig();
		let isDown = isScrollDown();
		document.getElementById("jvchat-main").classList.toggle("jvchat-hide-mosaics");
		if (isDown) {
			setScrollDown();
		}
	}

	function toggleLoadImagesOption(event) {
		let checked = document.getElementById("jvchat-load-images-checkbox").checked;
		configuration["load_images"] = checked;
		saveConfig();
		for (let image of document.getElementsByClassName("jvchat-loadable-image")) {
			image.src = image.getAttribute(checked ? "data-src-direct" : "data-src-mini");
		}
	}

	function changeTurboDelayOption(event) {
		let ms = document.getElementById("jvchat-turbo-delay-range").value;
		document.getElementById("jvchat-turbo-delay-span").innerHTML = `${ms} ms`;
		configuration["turbo_delay"] = parseInt(ms);
		saveConfig();
	}

	function changeMaxWidthOption(event) {
		let maxWidth = parseInt(document.getElementById("jvchat-max-width-range").value);
		document.getElementById("jvchat-max-width-span").innerHTML = `${maxWidth} %`;
		configuration["max_width"] = maxWidth;
		saveConfig();
		adjustMaxWidth(maxWidth);
	}

	function adjustMaxWidth(maxWidth) {
		document.getElementById("forum-main-col").style["flex-grow"] = maxWidth;
		document.getElementById("jvchat-right-padding").style["flex-grow"] = 100 - maxWidth;
	}

	function closeAlert(event) {
		let target = event.target;
		if (!target) {
			return;
		}
		if (target.classList.contains("jvchat-alert-close")) {
			let parent = target.parentElement;
			parent.parentElement.removeChild(parent);
		} else if (target.classList.contains("jvchat-alert-hide")) {
			let parent = target.parentElement;
			parent.classList.add("jvchat-hide");
		}
	}

	function postMessage() {
		if (freshForm === undefined) {
			addAlertbox("danger", "Impossible de poster le message, aucun formulaire trouvé");
			return;
		}

		let textarea = document.getElementById("message_topic");

		let formData = serializeForm(freshForm);
		formData["message_topic"] = textarea.value;
		let formulaire = document.getElementById("bloc-formulaire-forum");

		formulaire.classList.add("jvchat-disabled-form");
		textarea.setAttribute("disabled", "true");

		let timestamp = getTimestamp();

		function onSuccess(res) {
			formulaire.classList.remove("jvchat-disabled-form");
			textarea.removeAttribute("disabled");
			let parsedPage = parsePage(res, timestamp);
			if (!parsedPage.alert) {
				textarea.value = "";
			}
			setTextareaHeight();
			setScrollDown();
			postingMessage = false;

			if (parsedPage.nbMessagesPage === 20) {
				// Bug si on poste un message générant une nouvelle page : la requête retourne la page
				// courante, donc notre nouveau message n'apparaît pas, il faut forcer un refetch()
				// MAIS il faut attendre un peu, car JVC galère à créer la page...
				setTimeout(tryCatch(forceUpdate), 3000);
			}
		}

		function onError(err, _) {
			addAlertbox("danger", err);
			formulaire.classList.remove("jvchat-disabled-form");
			textarea.removeAttribute("disabled");
			postingMessage = false;
		}

		function onTimeout(err) {
			addAlertbox("warning", err);
			formulaire.classList.remove("jvchat-disabled-form");
			textarea.removeAttribute("disabled");
			postingMessage = false;
		}


		let timeout = 20000;
		if (turboActivated) {
			timeout = 5000;
		}

		postingMessage = true;
		request("POST", document.URL, onSuccess, onError, onTimeout, makeFormData(formData), false, timeout, false);
	}

	function editMessage(bloc) {
		let textarea = bloc.getElementsByClassName("jvchat-edition-textarea")[0];

		let blocEdition = bloc.getElementsByClassName("jvchat-edition")[0];
		let formData = JSON.parse(blocEdition.getAttribute("data-form"));
		formData["message_topic"] = textarea.value;
		formData["id_message"] = bloc.getAttribute("jvchat-id");
		formData["ajax_hash"] = freshHash;
		formData["action"] = "post";
		let edition = bloc.getElementsByClassName("jvchat-edition")[0];

		edition.classList.add("jvchat-disabled-form");
		textarea.setAttribute("disabled", "true");

		let timestamp = getTimestamp();

		function onSuccess(res) {
			edition.classList.remove("jvchat-disabled-form");
			if (res['reset_form']) {
				let reset = document.createElement("html");
				reset.innerHTML = res["hidden_reset"];
				let resetData = serializeForm(reset);
				for (let key in resetData) {
					formData[key] = resetData[key];
				}
				blocEdition.setAttribute("data-form", JSON.stringify(formData));
			}

			textarea.removeAttribute("disabled");
			if (res.erreur.length > 0) {
				for (let err of res.erreur) {
					addAlertbox("danger", err);
				}
				return;
			}
			let dom = document.createElement("html");
			dom.innerHTML = res["html"];
			let message = getMessages(dom)[0];
			addMessages([message], true, timestamp, false);
		}

		function onError(err, _) {
			addAlertbox("danger", err);
			edition.classList.remove("jvchat-disabled-form");
			textarea.removeAttribute("disabled");
		}

		function onTimeout(err) {
			addAlertbox("warning", err);
			edition.classList.remove("jvchat-disabled-form");
			textarea.removeAttribute("disabled");
		}

		let url = "https://www.jeuxvideo.com/forums/ajax_edit_message.php";

		request("POST", url, onSuccess, onError, onTimeout, makeFormData(formData), true, 20000, false);
	}

	function requestEdit(bloc) {
		if (!bloc.getElementsByClassName("jvchat-edition")[0].classList.contains("jvchat-hide")) {
			return;
		}

		let contentClasses = bloc.getElementsByClassName("jvchat-content")[0].classList;
		contentClasses.add("disabled-content");

		function onSuccess(res) {
			contentClasses.remove("disabled-content");
			if (res.erreur.length > 0) {
				for (let err of res.erreur) {
					addAlertbox("danger", err);
				}
				return;
			}
			let dom = document.createElement("html");
			dom.innerHTML = res["html"];
			let textarea = dom.getElementsByTagName("textarea")[0]
			let txt = textarea.value;
			textarea.parentElement.removeChild(textarea);
			let form = dom.getElementsByTagName("form")[0];
			let formData = serializeForm(form);
			let editionBloc = bloc.getElementsByClassName("jvchat-edition")[0];
			editionBloc.setAttribute("data-form", JSON.stringify(formData));
			let height = computeHeight(countLines(txt));
			let isDown = isScrollDown();
			bloc.getElementsByClassName("jvchat-edition-textarea")[0].value = txt;
			bloc.getElementsByClassName("jvchat-edition-textarea")[0].style["height"] = `${height}rem`;
			bloc.getElementsByClassName("jvchat-content")[0].classList.add("jvchat-hide");
			editionBloc.classList.remove("jvchat-hide");
			if (isDown) {
				setScrollDown();
			}
		}

		function onError(err, _) {
			addAlertbox("danger", err);
			contentClasses.remove("disabled-content");
		}

		function onTimeout(err) {
			addAlertbox("warning", err);
			contentClasses.remove("disabled-content");
		}

		let id = bloc.getAttribute("jvchat-id");
		let url = `https://www.jeuxvideo.com/forums/ajax_edit_message.php?id_message=${id}&ajax_hash=${freshHash}&action=get`;
		request("GET", url, onSuccess, onError, onTimeout, undefined, true, 5000, false);
	}

	function requestDelete(bloc) {
		let contentClasses = bloc.getElementsByClassName("jvchat-content")[0].classList;
		contentClasses.add("disabled-content");

		let id = parseInt(bloc.getAttribute("jvchat-id"));

		function onSuccess(res) {
			contentClasses.remove("disabled-content");
			if (res.erreur.length > 0) {
				for (let err of res.erreur) {
					addAlertbox("danger", err);
				}
				return;
			}

			let [timestamp, edition, deleted] = lastEditionTime[id];

			if (deleted === true) {
				return;
			}

			let isDown = isScrollDown();

			if (!bloc.getElementsByClassName("jvchat-edition")[0].classList.contains("jvchat-hide")) {
				bloc.getElementsByClassName("jvchat-content")[0].classList.remove("jvchat-hide");
				bloc.getElementsByClassName("jvchat-edition")[0].classList.add("jvchat-hide");
			}

			bloc.closest(".jvchat-message").classList.add("jvchat-message-deleted");
			lastEditionTime[id] = [timestamp, edition, true];

			if (isDown) {
				setScrollDown();
			}
		}

		function onError(err, _) {
			addAlertbox("danger", err);
			contentClasses.remove("disabled-content");
		}

		function onTimeout(err) {
			addAlertbox("warning", err);
			contentClasses.remove("disabled-content");
		}


		let url = `https://www.jeuxvideo.com/forums/modal_del_message.php`;
		let deleteData = { "type": "delete", "ajax_hash": freshDeletionHash, "tab_message[]": id };
		request("POST", url, onSuccess, onError, onTimeout, makeFormData(deleteData), true, 5000, false);
	}

	function countLines(text) {
		return text.split(/\r|\r\n|\n/).length;
	}

	function computeHeight(lines) {
		return 1 * lines + 0.6;
	}

	function setTextareaHeight(plusOne) {
		let textarea = document.getElementById("message_topic");
		if (!isReduced) {
			textarea.style["height"] = "";
			return;
		}
		plusOne = !!plusOne;
		let lines = countLines(textarea.value);

		if (!plusOne && lines === 1) {
			textarea.style["height"] = "";
			return;
		}

		if (plusOne) {
			lines += 1;
		}

		let height = computeHeight(lines);
		textarea.style["height"] = `${height}rem`;
	}

	function postMessageIfEnter(event) {
		if (isReduced && (event.which == 13 || event.keyCode == 13)) {
			if (event.shiftKey) {
				let isDown = isScrollDown();
				setTextareaHeight(true);
				if (isDown) {
					setScrollDown();
				}
			} else {
				event.preventDefault();
				postMessage();
			}
		}
	}

	function serializeForm(form) {
		// Useless actually, just use new FormData(form)
		let dict = {};

		for (let select of form.getElementsByTagName("select")) {
			dict[select.name] = select.querySelector("option[selected]").value;
		}

		for (let input of form.getElementsByTagName("input")) {
			dict[input.name] = input.value;
		}

		for (let textarea of form.getElementsByTagName("textarea")) {
			dict[textarea.name] = textarea.value;
		}

		return dict;
	}

	function makeFormData(dict) {
		var formData = new FormData();
		for (let key in dict) {
			formData.append(key, dict[key]);
		}
		return formData;
	}

	function getMessages(document) {
		let blocMessages = document.getElementsByClassName("bloc-message-forum");
		let messages = [];
		for (let bloc of blocMessages) {
			messages.push(parseMessage(bloc));
		}
		return messages;
	}

	function getMessagesMobile(document) {
		let listMessages = document.getElementsByClassName("liste-messages")[0];
		if (listMessages === undefined) {
			return [];
		}
		let messages = [];
		let posts = listMessages.getElementsByClassName("post");
		for (let post of posts) {
			messages.push(parseMessageMobile(post));
		}
		return messages;
	}

	function findDeletedMessages(res, requestTimestamp) {
		let page = getPage(res);
		let blocMessages = res.getElementsByClassName("bloc-message-forum");

		let newIds = []
		let newDates = [];

		for (let bloc of blocMessages) {
			let id = parseInt(bloc.getAttribute("data-id"));
			let date = bloc.getElementsByClassName("bloc-date-msg")[0].textContent.trim();
			newIds.push(id);
			newDates.push(date);
		}

		if (!messagesByPage.hasOwnProperty(page)) {
			messagesByPage[page] = [newIds, newDates];
			return;
		}

		let [regIds, regDates] = messagesByPage[page];

		let regLength = regIds.length;
		let newLength = newIds.length;

		messagesByPage[page] = [newIds, newDates];

		if (regLength === 0) {
			return;
		}

		if (regLength <= newLength && regIds[0] === newIds[0] && regIds[regLength - 1] === newIds[regLength - 1]) {
			return;
		}

		// Problème : on ne prend pas en compte les messages "ressuscités" (est-ce possible ?), mais
		// c'est compliqué, car si on part du principe que la suppression est réversible, il peut y
		// avoir des data race entre deux requêtes (message supprimé entre les deux, mais la 2ème
		// arrive avant la première => message ressuscité alors qu'il ne devrait pas).

		let after = new Set(newIds);
		let isFirst = true;

		for (let i = 0; i < regIds.length; i++) {
			let id = regIds[i];
			if (after.has(id)) {
				isFirst = false;
				continue;
			}

			// Pas enregistré => blacklist
			if (!lastEditionTime.hasOwnProperty(id)) {
				continue;
			}

			let [timestamp, edition, deleted] = lastEditionTime[id];

			if (timestamp >= requestTimestamp) {
				continue;
			}

			// Message "ressuscité" (parfois bug, message peut disparaître)
			if (deleted) {
				let msg = document.querySelector(`.jvchat-message[jvchat-id="${id}"]`);
				if (msg) {
					msg.classList.remove("jvchat-message-deleted");
					lastEditionTime[id] = [timestamp, edition, true];
				}
			}

			// Si message en début de page : vérifier qu'il n'est pas sur la page précédente
			// Vérifier aussi les début/fin de page en cas de PEMT, car 2 messages peuvent être "swap"
			if (isFirst || (regDates[i] === newDates[0]) || (newLength === 20 && regDates[i] === newDates[19])) {
				checkDeleted(id);
				continue;
			}

			let msg = document.querySelector(`.jvchat-message[jvchat-id="${id}"]`);
			if (msg) {
				msg.classList.add("jvchat-message-deleted");
				lastEditionTime[id] = [timestamp, edition, false];
			}
		}
	}

	function formatDate(date) {
		let now = new Date();
		try {
			now = new Date(now.toLocaleString('en-US', { timeZone: "Europe/Paris" }));
		} catch (e) { }
		let day = date.getDate();
		let month = date.getMonth();
		let year = date.getFullYear();
		if (now.getDate() === day && now.getMonth() === month && now.getFullYear() === year) {
			return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
		} else {
			return `${day.toString().padStart(2, "0")}/${(month + 1).toString().padStart(2, "0")}/${year}`;
		}
	}

	function makeMessage(message) {
		let content = message.content;
		fixMessage(content);
		detectMosaic(content);
		improveImages(content);
		let id = message.id;
		let avatar = message.avatar;
		let toQuoteDate = message.dateString;
		let titleDate = message.dateString;
		let textDate = formatDate(message.date);
		if (message.edited !== undefined) {
			textDate += "*";
			titleDate += ` (édité à ${message.edited})`;
		}
		let exists = avatar !== undefined;
		let author = exists ? message.author : `<i>${message.author}</i>`;
		let authorHref = exists ? `href="https://www.jeuxvideo.com/profil/${author.toLowerCase()}?mode=infos"` : "";
		let authorTitle = exists ? `title="Ouvrir le profil de ${author}"` : "";
		let authorAvatarHidden = exists ? "" : "class='jvchat-hide-visibility'";
		let editionSpan = '<span class="jvchat-edit jvchat-picto picto-msg-crayon" title="Modifier"></span>';
		let deletionSpan = '<span class="jvchat-delete jvchat-picto picto-msg-croix" title="Supprimer"></span>';
		let deletion = (currentUser.author === undefined) || (message.author.toLowerCase() !== currentUser.author.toLowerCase()) ? "" : deletionSpan;
		let edition = (currentUser.author === undefined) || (message.author.toLowerCase() !== currentUser.author.toLowerCase()) ? "" : editionSpan;
		let html =
			`<div class="jvchat-bloc-message">
				<div class="jvchat-message" jvchat-id=${id}>
					<div>
						<a ${authorAvatarHidden} ${authorHref} target="_blank" ${authorTitle}>
							<div class="jvchat-bloc-avatar jvchat-rounded" style="background-image: url(${avatar})"></div>
						</a>
					</div>
					<div class="jvchat-bloc-author-content">
						<div class="jvchat-toolbar">
							<h5 class="jvchat-author">${author}</h5>
							<div class="jvchat-tooltip">
								${deletion}
								${edition}
								<span class="jvchat-picto jvchat-quote picto-msg-quote" title="Citer"></span>
								<small class="jvchat-date" to-quote="${toQuoteDate}" title="${titleDate}">${textDate}</small>
							</div>
						</div>
						<div class="jvchat-content">${content.outerHTML}</div>
						<div class="jvchat-edition jvchat-hide">
							<textarea class="jvchat-edition-textarea jvchat-textarea"></textarea>
							<div class="jvchat-buttons">
								<button tabindex="0" type="button" class='jvchat-edition-check icon-check-jv jvchat-button-top' title="Valider la modification"></button>
								<button tabindex="0" type="button" class='jvchat-edition-cancel icon-cancel-circle jvchat-button-bottom' title="Annuler la modification"></button>
							</div>
						</div>
					</div>
				</div>
				<hr class="jvchat-ruler">
			</div>`;
		return html;
	}

	function parseDate(string) {
		let [date, time] = string.toLowerCase().split("à");
		let [day, month, year] = date.trim().split(" ");
		let [hour, minute, second] = time.trim().split(":");
		let monthIndex = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"].indexOf(month.trim().toLowerCase());
		return new Date(parseInt(year), monthIndex, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second));
	}

	function addMessages(messages, editing, requestTimestamp, onMobile) {
		let main = document.getElementById("jvchat-main");
		let hasNewMessages = false;
		let init = true;
		let toInsert = "";
		let newMessagesIds = [];
		for (let message of messages) {
			let date = message.date;
			let id = message.id;

			if (init === true && !editing) {
				init = false;
				let now = new Date();
				let delta = now - date;
				if (delta > 5 * 60 * 1000 + checkEditedInterval) {
					shouldCheckEdited = false;
				} else {
					shouldCheckEdited = true;
				}
			}

			if (message.blacklisted) {
				continue;
			}

			if (firstMessageId === undefined) {
				firstMessageId = id;
				firstMessageDate = date;
			}

			// Attention à 2 choses: le changement d'heure et le fait qu'un message suivant un autre peut avoir un id inférieur au précédent
			if (id < firstMessageId && date < firstMessageDate) {
				continue;
			}

			let referenced = lastEditionTime.hasOwnProperty(id);
			let edited = message.edited;

			if (referenced) {
				let [timestamp, edition, deleted] = lastEditionTime[id];
				if (deleted) {
					continue;
				}
				if (timestamp >= requestTimestamp || edition === edited) {
					continue;
				}
			}

			let newBloc = makeMessage(message);

			// Si c'est un nouveau message, on l'ajoute sans équivoque
			// Sinon, on ne met à jour QUE si on est pas sur mobile (puisque sinon edited == undefined)
			if (!referenced || !onMobile) {
				lastEditionTime[id] = [requestTimestamp, edited, false];
			}

			// En gros : sur mobile on a pas accès à la date d'édition du message, donc on ignore
			// Il ne faut mettre à jour le message QUE si on est pas sur Mobile
			// Par contre, s'il a déjà été référence, il faut quand même "continue" pour ne pas
			// l'ajouter continuellement.
			if (referenced) {
				if (!onMobile) {
					let selector = `.jvchat-message[jvchat-id="${id}"]`;
					let oldBloc = main.querySelector(selector).closest(".jvchat-bloc-message");
					let isDown = isScrollDown();
					oldBloc.outerHTML = newBloc;
					if (isDown) {
						setScrollDown();
					}
					let event = new CustomEvent('jvchat:newmessage', { 'detail': { id: id, isEdit: true } });
					dispatchEvent(event);
				}
				continue;
			}

			hasNewMessages = true;
			if (nbNewMessage === 0 && document.hidden) {
				let hrs = document.getElementsByClassName("jvchat-ruler");
				let lastHr = hrs[hrs.length - 1];
				lastHr.setAttribute("id", "jvchat-ruler-new");
			}

			toInsert += newBloc;
			newMessagesIds.push(id);
			nbNewMessage++;
		}

		if (toInsert !== "") {
			let isDown = isScrollDown();
			main.insertAdjacentHTML("beforeend", toInsert);
			if (isDown) {
				setScrollDown();
			}
		}

		if (editing) {
			return;
		}

		if (isScrollDown()) {
			let blocMessages = main.getElementsByClassName("jvchat-bloc-message");
			let nb = blocMessages.length;
			if (nb > 100) {
				for (let i = 0; i < nb - 100; i++) {
					main.removeChild(blocMessages[0]);
				}
				setScrollDown();
			}
		}

		if (hasNewMessages) {
			if (!turboActivated && !refreshDegraded) {
				decreaseUpdateInterval();
			}
			if (document.hidden) {
				setFavicon(nbNewMessage > 99 ? 99 : nbNewMessage);
				if (configuration["play_sound"]) {
					ringBell.pause();
					ringBell.currentTime = 0;
					ringBell.play();
				}
			}
			for (let newMessageId of newMessagesIds) {
				let event = new CustomEvent('jvchat:newmessage', { 'detail': { id: newMessageId, isEdit: false } });
				dispatchEvent(event);
			}
		} else {
			if (!turboActivated && !refreshDegraded) {
				increaseUpdateInterval();
			}
		}
	}

	function submitSondageAnswer(event) {
		let target = event.target;
		if (!target) {
			return;
		}
		if (target.classList.contains("click-sondage")) {
			let reponseNum = parseInt(target.getAttribute("sondage-reponse-num"));
			let sondageId = sondageChoices[reponseNum]["sondageId"];
			let reponseId = sondageChoices[reponseNum]["responseId"];
			let topicId = urlToFetch["ids"].split("-")[2];
			let url = `https://www.jeuxvideo.com/forums/ajax_topic_sondage_vote.php?id_topic=${topicId}&id_sondage_reponse=${reponseId}&id_sondage=${sondageId}&ajax_hash=${freshHash}`;

			function onSuccess(res) {
				if (res.erreur.length > 0) {
					for (let err of res.erreur) {
						addAlertbox("danger", err);
					}
					return;
				}
				let dom = document.createElement("html");
				dom.innerHTML = res["html"];

				let sondage = parseSondage(dom);
				if (!sondage) {
					addAlertbox("warning", "Erreur lors de la récupération du sondage");
					return;
				}

				setSondage(sondage);
			}

			function onError(err, _) {
				addAlertbox("danger", err);
			}

			function onTimeout(err) {
				addAlertbox("warning", err);
			}

			request("POST", url, onSuccess, onError, onTimeout, undefined, true, 5000, false);
		}
	}

	function setSondage(sondage) {
		let choix = document.getElementById("jvchat-sondage-choix");

		if (sondage["answered"]) {
			choix.removeEventListener("click", submitSondageAnswer);
			choix.classList.remove("notanswered");
		} else {
			if (!sondageChoices) {
				sondageChoices = sondage["results"];
			}
			choix.addEventListener("click", submitSondageAnswer);
			choix.classList.add("notanswered");
		}

		if (!choix.firstChild) {
			document.getElementById("jvchat-sondage-intitule").innerHTML = sondage["intitule"];
			let results = sondage["results"];
			for (let i = 0; i < results.length; i++) {
				let res = results[i];
				let tr = `<tr><td class="result-pourcent"><div class="pourcent">${res["pourcent"]} %</div><div class="back-barre"><span style="width: ${res["pourcent"]}%;"></span></div></td><td class="reponse"><div class="click-sondage" sondage-reponse-num="${i}">${res["response"]}</div></td></tr>`;
				choix.insertAdjacentHTML("beforeend", tr);
			}
		} else {
			let trs = choix.getElementsByClassName("result-pourcent");
			for (let i = 0; i < trs.length; i++) {
				let res = sondage["results"][i];
				let tr = trs[i];
				tr.getElementsByClassName("pourcent")[0].innerHTML = `${res["pourcent"]} %`;
				tr.getElementsByTagName("span")[0].style["width"] = `${res["pourcent"]}%`;
			}
		}

		document.getElementById("jvchat-sondage-votes").innerHTML = `(${sondage["votes"]} votes)`;
	}

	function setUser(document, user) {
		let isConnected = (user.author !== undefined);

		if (isConnected) {
			if (user.author !== currentUser.author) {
				let pseudo = document.getElementById("jvchat-user-pseudo");
				pseudo.innerHTML = user.author;
				let avatarLink = document.getElementById("jvchat-user-avatar-link");
				let notifLink = document.getElementById("jvchat-user-notif-link");
				avatarLink.setAttribute("href", `https://www.jeuxvideo.com/profil/${user.author.toLowerCase()}?mode=infos`);
				notifLink.setAttribute("href", `https://www.jeuxvideo.com/profil/${user.author.toLowerCase()}?mode=abonnements`);
			}

			if (user.avatar !== currentUser.avatar) {
				let avatar = document.getElementById("jvchat-user-avatar");
				avatar.style["background-image"] = `url("${user.avatar}")`;
			}

			if (user.mp !== currentUser.mp) {
				let mp = document.getElementById("jvchat-user-mp");
				mp.setAttribute("data-val", user.mp);
				if (user.mp > 0) {
					mp.classList.add("has-notif");
				} else {
					mp.classList.remove("has-notif");
				}
			}

			if (user.notif !== currentUser.notif) {
				let notif = document.getElementById("jvchat-user-notif");
				notif.setAttribute("data-val", user.notif);
				if (user.notif > 0) {
					notif.classList.add("has-notif");
				} else {
					notif.classList.remove("has-notif");
				}
			}
		}

		if ((userConnected === undefined && isConnected) || (userConnected !== undefined && isConnected !== userConnected)) {
			document.getElementById("jvchat-profil").classList.toggle("jvchat-hide");
			let isDown = isScrollDown();
			document.getElementById("bloc-formulaire-forum").classList.toggle("jvchat-hide");
			if (isDown) {
				setScrollDown();
			}
		}

		if (userConnected !== undefined) {
			if (isConnected && !userConnected) {
				addAlertbox("success", "Vous êtes désormais connecté");
			} else if (!isConnected && userConnected) {
				addAlertbox("warning", "Vous avez été déconnecté");
			}
		}

		userConnected = isConnected;
		currentUser = user;
	}

	function setTopicTitle(document, topicTitle) {
		if (topicTitle !== currentTopicTitle) {
			currentTopicTitle = topicTitle;
			document.getElementById("jvchat-topic-title").innerHTML = topicTitle;
		}
	}

	function setTopicNbConnected(document, nbConnected) {
		let txt = `${nbConnected} connectés`;
		if (!(nbConnected > 1)) {
			if (nbConnected === undefined) {
				txt = "? connectés";
			} else {
				txt = txt.slice(0, -1);
			}
		}
		document.getElementById("jvchat-topic-nb-connected").innerHTML = txt;
	}

	function setTopicNbMessages(document, nbMessages) {
		let txt = `${nbMessages} messages`;
		if (!(nbMessages > 1)) {
			if (nbMessages === undefined) {
				txt = "? messages";
			} else {
				txt = txt.slice(0, -1);
			}
		}
		document.getElementById("jvchat-topic-nb-messages").innerHTML = txt;
		if (nbMessages !== undefined) {
			topicNbMessages = nbMessages;
		}
	}

	function triggerJVChat() {
		// TamperMonkey / Chrome bug: https://github.com/Tampermonkey/tampermonkey/issues/705#issuecomment-493895776
		if (window) {
			if (window.clearTimeout) {
				window.clearTimeout = window.clearTimeout.bind(window);
			}
			if (window.clearInterval) {
				window.clearInterval = window.clearInterval.bind(window);
			}
			if (window.setTimeout) {
				window.setTimeout = window.setTimeout.bind(window);
			}
			if (window.setInterval) {
				window.setInterval = window.setInterval.bind(window);
			}
			window.onbeforeunload = function (event) {
				leavingTopic = true;
			}
		}

		freshHash = getHash(document);
		freshDeletionHash = getDeletionHash(document);
		freshForm = getForm(document);

		favicon = makeFavicon();

		let topicUrl = document.URL;
		let topic = parseTopicInfo(document);
		let user = parseUserInfo(document);
		let sondage = parseSondage(document);

		urlToFetch = parseURL(topicUrl);
		urlToFetch.page = 1;
		urlToFetch.anchor = "";

		urlToRefreshInfos = parseURL(topicUrl);
		urlToRefreshInfos.page = 1;
		urlToRefreshInfos.anchor = "";

		urlToCheckEdited = parseURL(topicUrl);
		urlToCheckEdited.page = 1;
		urlToCheckEdited.anchor = "";

		configuration = defaultConfig();
		loadConfig();

		ringBell = new Audio(configuration["sound"]);

		clearPage(document);

		setUser(document, user);
		setTopicTitle(document, topic.title);
		setTopicNbMessages(document, undefined);
		setTopicNbConnected(document, topic.connected);

		if (sondage) {
			document.getElementById("jvchat-sondage").classList.remove("jvchat-hide")
			setSondage(sondage);
		}

		document.getElementById("jvchat-topic-title").setAttribute("href", buildURL(urlToFetch));

		let forum = getForum(document);
		let forumSide = document.getElementById("jvchat-forum-title");
		forumSide.setAttribute("href", forum.href);
		forumSide.innerHTML = forum.title;

		let defaultReduced = configuration["default_reduced"];
		let messageTopic = document.getElementById("message_topic");

		if (messageTopic && (defaultReduced === false || (messageTopic.value !== ""))) {
			toggleTextarea();
		}

		let event = new CustomEvent('jvchat:activation');
		dispatchEvent(event);

		let page = topic.lastPage > 1 ? topic.lastPage - 1 : topic.lastPage;
		updateMessages(page, true);

		setInterval(tryCatch(checkEdited), checkEditedInterval);
	}

	function activateUseMobileMode() {
		refreshInfosAcceptable = [];
		for (i = 0; i < 10; i++) {
			refreshInfosAcceptable.push(false);
		}
		refreshInfosTimeoutId = setInterval(tryCatch(refreshInfos), 30000);
		useMobileForUpdateMessages = true;
	}

	function deactivateUseMobileMode() {
		refreshInfosAcceptable = [];
		clearTimeout(refreshInfosTimeoutId);
		useMobileForUpdateMessages = false;
		switchToMobileTimeoutId = -1;
		refreshInfosTimeoutId = -1;
	}

	function refreshNoLongerDegraded() {
		removeDegradedRefreshWarning();
		if (switchToMobileTimeoutId !== -1) {
			clearTimeout(switchToMobileTimeoutId);
		}
		timeoutedDates = [];
		refreshDegraded = false;
		refreshDegradedTimeoutId = -1;
		switchToMobileTimeoutId = -1;
	}

	function scheduleDegradedRefreshWarning() {
		if (!refreshDegraded) {
			let now = getTimestamp();
			let lookupDate = now - 60 * 1000;
			let nbClean = 0;
			for (let date of timeoutedDates) {
				if (date < lookupDate) {
					nbClean++;
				} else {
					break;
				}
			}
			for (i = 0; i < nbClean; i++) {
				timeoutedDates.shift();
			}

			timeoutedDates.push(now);

			if (timeoutedDates.length >= 3) {
				refreshDegraded = true;
				updateIntervalIdx = 2;
				setDegradedRefreshWarning();
				if (!useMobileForUpdateMessages && switchToMobileTimeoutId === -1) {
					let delay = 90 * 1000 + Math.round(Math.random() * 30 * 1000);
					switchToMobileTimeoutId = setTimeout(tryCatch(activateUseMobileMode), delay);
				}
			} else {
				return;
			}
		}

		if (refreshDegradedTimeoutId !== -1) {
			clearTimeout(refreshDegradedTimeoutId);
		}

		refreshDegradedTimeoutId = setTimeout(tryCatch(refreshNoLongerDegraded), 30000);
	}

	function updateMessages(page, goToLast) {

		if (postingMessage && turboActivated) {
			// Postpone message fetching, posting the message is priorized
			fetchingMessages = false;
			currentTimeoutId = setTimeout(tryCatch(function postponedUpdate() {
				updateMessages(page, goToLast);
			}), 100);
			return;
		}

		let timestamp = getTimestamp();
		let isRequestMadeOnMobile = useMobileForUpdateMessages && !turboActivated;

		function scheduleNextUpdate(interval, p, goLast) {
			fetchingMessages = false;
			currentTimeoutId = setTimeout(tryCatch(function scheduledUpdate() {
				updateMessages(p, goLast);
			}), interval);
		};

		function onSuccess(res) {
			let parsed = isRequestMadeOnMobile ? parsePageMobile(res, timestamp) : parsePage(res, timestamp);
			let lastPage = parsed.lastPage;
			let currPage = parsed.page;
			let interval = turboActivated ? configuration["turbo_delay"] : updateIntervals[updateIntervalIdx] * 1000;

			if (page < lastPage && goToLast) {
				updateMessages(page + 1, true);
			} else if (currPage < page || parsed.nbMessagesPage === 0) {  // Bug des messages supprimés
				scheduleNextUpdate(interval, page - 1, false);
			} else if (page > lastPage) {
				updateMessages(lastPage, true);
			} else {
				scheduleNextUpdate(interval, page, true);
			}
		}

		function onError(err, code) {
			if (code === 0) {
				scheduleDegradedRefreshWarning();
				scheduleNextUpdate(turboActivated ? configuration["turbo_delay"] : 10000, page, true);
				return
			}
			if (!isError) {
				isError = true;
				setFixedAlert("danger", err);
			}
			scheduleNextUpdate(turboActivated ? configuration["turbo_delay"] : 60000, page, true);
		}

		function onTimeout(_) {
			scheduleDegradedRefreshWarning();
			scheduleNextUpdate(turboActivated ? configuration["turbo_delay"] : 5000, page, true);
		}

		let timeout = 10000;;
		if (turboActivated) {
			timeout = 5000;
		}

		fetchingMessages = true;
		currentFetchedPage = page;
		urlToFetch.page = page;
		urlToFetch.domain = isRequestMadeOnMobile ? "https://m.jeuxvideo.com/forums" : "https://www.jeuxvideo.com/forums";
		let urlLastPage = buildURL(urlToFetch);
		request("GET", urlLastPage, onSuccess, onError, onTimeout, undefined, false, timeout, turboActivated);
	}

	function refreshInfos() {
		if (isError) {
			return;
		}

		let timestamp = getTimestamp();

		function onSuccess(res) {
			let elapsed = getTimestamp() - timestamp;

			parsePage(res, timestamp);

			refreshInfosAcceptable.shift();

			if (elapsed > 10000) {
				refreshInfosAcceptable.push(false);
			} else {
				refreshInfosAcceptable.push(true);
				let allAcceptable = true;
				for (let acceptable of refreshInfosAcceptable) {
					allAcceptable &= acceptable;
				}
				if (allAcceptable) {
					deactivateUseMobileMode();
				}
			}
		}

		function onError(_, _) {
			refreshInfosAcceptable.shift();
			refreshInfosAcceptable.push(false);
		}

		function onTimeout(_) {
			refreshInfosAcceptable.shift();
			refreshInfosAcceptable.push(false);
		}

		let url = buildURL(urlToRefreshInfos);

		request("GET", url, onSuccess, onError, onTimeout, undefined, false, 20000, false);
	}

	function checkEdited() {
		if (!shouldCheckEdited || currentFetchedPage === 1 || isError || useMobileForUpdateMessages) {
			return;
		}

		urlToCheckEdited.page = currentFetchedPage - 1;
		let urlPrevLastPage = buildURL(urlToCheckEdited);
		let timestamp = getTimestamp();

		function onSuccess(res) {
			let newMessages = [];
			let edited = res.getElementsByClassName("info-edition-msg");
			for (let msg of edited) {
				let bloc = msg.closest(".bloc-message-forum");
				newMessages.push(parseMessage(bloc));
			}
			addMessages(newMessages, true, timestamp, false);
			findDeletedMessages(res, timestamp);
		}

		function onError(_, _) { }

		function onTimeout(_) { }

		request("GET", urlPrevLastPage, onSuccess, onError, onTimeout, undefined, false, 20000);
	}

	function checkDeleted(id) {
		let url = `https://www.jeuxvideo.com/jvchat/forums/message/${id}`;
		let requestTimestamp = getTimestamp();

		function onSuccess(_) {
			// Le message existe, il a disparu de la page car un message plus ancien a été supprimé
		}

		function onError(_, status) {
			let [timestamp, edition, deleted] = lastEditionTime[id];

			if (status === 410 && !deleted) {
				if (timestamp >= requestTimestamp) {
					return;
				}

				let msg = document.querySelector(`.jvchat-message[jvchat-id="${id}"]`);
				if (msg) {
					msg.classList.add("jvchat-message-deleted");
					lastEditionTime[id] = [timestamp, edition, true];
				}
			}
		}

		function onTimeout(_) { }

		request("GET", url, onSuccess, onError, onTimeout, undefined, false, 20000, false);
	}

	function parseAlerts(res) {
		let alerts = [];
		let alertsDiv = res.getElementsByClassName("alert");
		for (let a of alertsDiv) {
			let type = "danger";
			if (a.classList.contains("alert-warning")) {
				type = "warning";
			} else if (a.classList.contains("alert-success")) {
				type = "success";
			}
			let message = a.getElementsByClassName("alert-row")[0].textContent.trim();
			alerts.push({ type: type, message: message });
		}
		return alerts;
	}

	function increaseUpdateInterval() {
		if (updateIntervalIdx < updateIntervalMax) {
			updateIntervalIdx++;
		}
	}

	function decreaseUpdateInterval() {
		updateIntervalIdx = transisitions[updateIntervalIdx];
	}

	function parsePageMobile(res, requestTimestamp) {
		let error = getTopicError(res);
		if (error !== undefined) {
			if (!isError) {
				updateIntervalIdx = updateIntervalMax;
				isError = true;
				setFixedAlert("danger", error);
			}
			return { lastPage: undefined, page: undefined, alert: true, nbMessagesPage: 0 }
		}

		if (isError) {
			isError = false;
			updateIntervalIdx = 2;
			removeFixedAlert("Le topic ne retourne plus d'erreur");
		}

		// let form = getForm(res);
		// if (form !== undefined) {
		//     freshForm = form;
		// }

		// let hash = getHash(res);
		// if (hash !== undefined) {
		//     freshHash = hash;
		// }

		// let deletionHash = getDeletionHash(res);
		// if (deletionHash !== undefined) {
		//     freshDeletionHash = deletionHash;
		// }

		let messages = getMessagesMobile(res);
		addMessages(messages, false, requestTimestamp, true);

		// let user = parseUserInfo(res);
		// setUser(document, user);

		let topic = parseTopicInfoMobile(res);
		let nbMessages = (topic.lastPage - 1) * 20;
		if (topic.page === topic.lastPage) {
			nbMessages += messages.length;
		}
		if (topic.page === topic.lastPage || nbMessages > topicNbMessages) {
			setTopicNbMessages(document, nbMessages);
		}

		// Pas la peine d'implémenter le "findDeletedMessageMobile" car c'est pas fiable du tout
		// Des fois on fait F5 et des messages disparaissent puis réaparaissent au F5 suivant...

		// findDeletedMessages(res, requestTimestamp);

		//setTopicNbConnected(document, topic.connected);

		// let alerts = parseAlerts(res);
		// for (let alert of alerts) {
		//     addAlertbox(alert.type, alert.message);
		// }

		// let locked = getTopicLocked(res);
		// let isLocked_ = (locked !== undefined);

		// if (isLocked_ && !isLocked) {
		//     updateInterval = updateIntervalMax;
		//     setFixedAlert("warning", locked);
		// } else if (!isLocked_ && isLocked) {
		//     updateInterval = 0;
		//     removeFixedAlert("Le topic a été dévérouillé");
		// }
		// isLocked = isLocked_;

		// let sondage = parseSondage(res);
		// if (sondage) {
		//     setSondage(sondage);
		// }

		return {
			page: topic.page, lastPage: topic.lastPage,
			nbMessagesPage: messages.length, alert: false
		};
	}

	function parsePage(res, requestTimestamp) {
		let error = getTopicError(res);
		if (error !== undefined) {
			if (!isError) {
				updateIntervalIdx = updateIntervalMax;
				isError = true;
				setFixedAlert("danger", error);
			}
			return { lastPage: undefined, page: undefined, alert: true, nbMessagesPage: 0 }
		}

		if (isError) {
			isError = false;
			updateIntervalIdx = 2;
			removeFixedAlert("Le topic ne retourne plus d'erreur");
		}

		let form = getForm(res);
		if (form !== undefined) {
			freshForm = form;
		}

		let hash = getHash(res);
		if (hash !== undefined) {
			freshHash = hash;
		}

		let deletionHash = getDeletionHash(res);
		if (deletionHash !== undefined) {
			freshDeletionHash = deletionHash;
		}

		let messages = getMessages(res);
		addMessages(messages, false, requestTimestamp, false);

		let user = parseUserInfo(res);
		setUser(document, user);

		let topic = parseTopicInfo(res);

		findDeletedMessages(res, requestTimestamp);

		let nbMessages = (topic.lastPage - 1) * 20;
		if (topic.page === topic.lastPage) {
			nbMessages += messages.length;
		}
		if (topic.page === topic.lastPage || nbMessages > topicNbMessages) {
			setTopicNbMessages(document, nbMessages);
		}

		setTopicNbConnected(document, topic.connected);

		let alerts = parseAlerts(res);
		for (let alert of alerts) {
			addAlertbox(alert.type, alert.message);
		}

		let locked = getTopicLocked(res);
		let isLocked_ = (locked !== undefined);

		if (isLocked_ && !isLocked) {
			updateInterval = updateIntervalMax;
			setFixedAlert("warning", locked);
		} else if (!isLocked_ && isLocked) {
			updateInterval = 0;
			removeFixedAlert("Le topic a été dévérouillé");
		}
		isLocked = isLocked_;

		let sondage = parseSondage(res);
		if (sondage) {
			setSondage(sondage);
		}

		return {
			page: topic.page, lastPage: topic.lastPage,
			nbMessagesPage: messages.length, alert: isLocked_ || (alerts.length > 0)
		};
	}

	function addAlertbox(type, message) {
		// type: success / warning / danger
		let alert = `<div class="alert alert-${type}">
			<button class="close jvchat-alert-close" aria-hidden="true" data-dismiss="alert" type="button">×</button>
			<div class="alert-row">${message}</div>
			</div>`;
		document.getElementById("jvchat-fixed-alert").insertAdjacentHTML("afterend", alert);
	}

	function setFixedAlert(type, message) {
		setFavicon("⨯");
		if (configuration["hide_alerts"]) {
			addAlertbox(type, message);
			return
		}
		document.getElementById("jvchat-fixed-alert").getElementsByClassName("alert-row")[0].innerHTML = message;
		document.getElementById("jvchat-fixed-alert").setAttribute("class", `alert alert-${type}`);
	}

	function removeFixedAlert(message) {
		document.getElementById("jvchat-fixed-alert").classList.add("jvchat-hide");
		if (message !== undefined) {
			addAlertbox("success", message);
		}
		if (document.hidden && nbNewMessage > 0) {
			setFavicon(nbNewMessage > 99 ? 99 : nbNewMessage);
		} else {
			setFavicon("");
		}
	}

	function setTurboWarning() {
		let message = "Le mode turbo est resté activé pendant plus d'une minute, les requêtes pour récupérer les nouveaux messages risquent d'être ralenties";
		document.getElementById("jvchat-turbo-warning").getElementsByClassName("alert-row")[0].innerHTML = message;
		document.getElementById("jvchat-turbo-warning").setAttribute("class", "alert alert-warning");
	}

	function removeTurboWarning() {
		document.getElementById("jvchat-turbo-warning").classList.add("jvchat-hide");
	}

	function setDegradedRefreshWarning() {
		let message = "Les serveurs de JVC semblent surchargés, l'actualisation des nouveaux messages peut s'en voir dégradée";
		document.getElementById("jvchat-degraded-refresh-warning").getElementsByClassName("alert-row")[0].innerHTML = message;
		document.getElementById("jvchat-degraded-refresh-warning").setAttribute("class", "alert alert-warning");
	}

	function removeDegradedRefreshWarning() {
		document.getElementById("jvchat-degraded-refresh-warning").classList.add("jvchat-hide");
	}

	function makeJVChatButton() {
		let cls = 'btn-jvchat';
		let text = 'JVChat';
		let btn = `<button class="btn btn-actu-new-list-forum ${cls}">${text}</button>`;
		return btn;
	}

	function addJVChatButton(document) {
		let css = `<style type="text/css">
		#forum-main-col .bloc-pre-pagi-forum {
			display: flex;
		}

		#forum-main-col .bloc-pre-pagi-forum .bloc-pre-right {
			position: relative;
			right: unset;
			left: unset;
			top: unset;
			bottom: unset;
			overflow: hidden;
			display: flex;
			flex-wrap: wrap;
			justify-content: flex-end;
			margin-top: auto;
			flex: 1;
		}

		#forum-main-col .bloc-pre-pagi-forum .bloc-pre-right button {
			float: right;
			min-width: 5.25rem;
			margin-left: 0.3125rem;
		}
		</style>`
		document.head.insertAdjacentHTML("beforeend", css);
		let blocPreRight = document.getElementsByClassName("bloc-pre-right");
		let jvchatButton = makeJVChatButton();
		for (let bloc of blocPreRight) {
			bloc.insertAdjacentHTML('afterbegin', jvchatButton);
		}
	}

	function bindJVChatButton(document) {
		let buttons = document.getElementsByClassName('btn-jvchat');
		for (let btn of buttons) {
			btn.addEventListener('click', tryCatch(triggerJVChat));
		}
	}

	function request(mode, url, callbackSuccess, callbackError, callbackTimeout, data, json, timeout, nocache) {
		json = !!json;
		let xhr = new XMLHttpRequest();
		xhr.timeout = timeout;

		xhr.ontimeout = tryCatch(function xhrOnTimeout() {
			callbackTimeout(`La délai d'attente de la requête a expiré`);
		});

		xhr.onerror = tryCatch(function xhrOnError() {
			callbackError(`La requête a échoué (${xhr.status}): ${xhr.statusText}`, xhr.status);
		});

		xhr.onabort = tryCatch(function xhrOnAbort() {
			if (!leavingTopic) {
				callbackTimeout(`La requête a été interrompue pour une raison inconnue`);
			}
		});

		xhr.onload = tryCatch(function xhrOnLoad() {
			if (xhr.status !== 200) {
				callbackError(`La requête a retourné une erreur (${xhr.status}): ${xhr.statusText}`, xhr.status);
				return;
			}
			callbackSuccess(xhr.response);
		});

		if (data === undefined) {
			data = null;
		}

		if (json) {
			xhr.responseType = "json";
		} else {
			xhr.responseType = "document";
		}

		xhr.open(mode, url, true);

		if (nocache) {
			xhr.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate");
		}

		xhr.send(data);
	};

	// On copie/colle le code de TopicLive et on se sent développeur :)
	function makeFavicon() {
		let canvas = document.createElement("canvas");
		canvas.width = 16;
		canvas.height = 16;
		let context = canvas.getContext('2d');
		let image = new Image();
		image.onload = function () {
			faviconLoaded = true;
			setFavicon(faviconTextWhenLoaded);
		}
		image.src = 'data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABMLAAATCwAAAAAAAAAAAABkRgT/ZEYE/2RGBP9kRgT/ZEYE/2RGBf9lRgD/YEcV/zJW7v8tV///Llf+/y5X//8uV///Llf//y5X//8uV///ZEYE/2RGBP9kRgT/ZEYE/2RGBP9kRgX/ZUYA/2BHFf8yVu7/LVf//y5X/v8uV///Llf//y5X//8uV///Llf//2RGBP9kRgT/ZEYE/2VHBf9lRwX/ZEYF/2VGAP9gRxX/Mlbu/y1X//8uV/7/Llf//y5X//8uV///Llf//y5X//9kRgT/ZEcF/2ZIB/9iQwH/YkMB/2ZJCP9lRgD/YEcV/zJW7v8tV///L1f+/y1W//8tVv//L1j//y5X//8uV///ZUcE/2NFBP9ZOQD/bE8R/2xPEf9ZOQD/ZEQA/2FIFv8xVu7/Llj//yxV/v8uV///Llf//ytV//8vWP//Llf//2NFA/9kRgj/xLif/+7r5P/u6+T/w7if/2VGBP9fRhT/M1fv/yxW//8uV/7/1d3//9Xd//8uV///LVb//y9Y//9ZOQD/wLOZ/9/Yy/91WiD/dVog/97Yy//CtZj/VzsF/zFW8f8tV///L1f+/9Lb///S2///L1f//y5X//8rVf//bFAR/+nk2v91Wib/WzsA/1s7AP90Wif/7OfZ/2dQIv8wU+v/1d7//9Pb/v8tVv//LVb//9Pc///S2///Llf//2xQEf/p5Nr/dVom/1s7AP9bOwD/dFon/+zn2f9nUCL/MFPr/9Xe///T2/7/LVb//y1W///T3P//0tv//y5X//9ZOQD/wLOZ/9/Yy/91WiD/dVog/97Yy//CtZj/VzsF/zFW8f8tV///L1f+/9Lb///S2///L1f//y5X//8rVf//Y0UD/2RGCP/EuJ//7uvk/+7r5P/DuJ//ZUYE/19GFP8zV+//LFb//y5X/v/V3f//1d3//y5X//8tVv//L1j//2VHBP9jRQT/WTkA/2xPEf9sTxH/WTkA/2REAP9hSBb/MVbu/y5Y//8sVf7/Llf//y5X//8rVf//L1j//y5X//9kRgT/ZEcF/2ZIB/9iQwH/YkMB/2ZJCP9lRgD/YEcV/zJW7v8tV///L1f+/y1W//8tVv//L1j//y5X//8uV///ZEYE/2RGBP9kRgT/ZUcF/2VHBf9kRgX/ZUYA/2BHFf8yVu7/LVf//y5X/v8uV///Llf//y5X//8uV///Llf//2RGBP9kRgT/ZEYE/2RGBP9kRgT/ZEYF/2VGAP9gRxX/Mlbu/y1X//8uV/7/Llf//y5X//8uV///Llf//y5X//9kRgT/ZEYE/2RGBP9kRgT/ZEYE/2RGBf9lRgD/YEcV/zJW7v8tV///Llf+/y5X//8uV///Llf//y5X//8uV///AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==';
		return { canvas: canvas, context: context, image: image };
	};

	function setFavicon(txt) {
		if (!faviconLoaded) {
			faviconTextWhenLoaded = txt;
			return;
		}

		let fav = document.getElementById("jvchat-favicon");
		if (fav) {
			fav.parentElement.removeChild(fav);
		}

		favicon.context.clearRect(0, 0, favicon.canvas.width, favicon.canvas.height);
		favicon.context.drawImage(favicon.image, 0, 0);

		if (txt !== '') {
			let context = favicon.context;
			context.fillStyle = 'DodgerBlue';
			context.fillRect(0, 0, context.measureText(txt).width + 3, 11);
			context.fillStyle = 'white';
			context.font = 'bold 10px Verdana';
			context.textBaseline = 'bottom';
			context.fillText(txt, 1, 11);
		}

		let url = favicon.canvas.toDataURL('image/png');
		let icon = `<link id="jvchat-favicon" rel="shortcut icon" type="image/png" href="${url}">`;
		document.head.insertAdjacentHTML("beforeend", icon);
	}

	function reverseMessage(node, isInit, isUl) {
		let quote = "";
		let prevIsP = false;

		for (let child of node.childNodes) {
			let name = child.nodeName;

			switch (name) {
				case "P": {
					quote += reverseMessage(child) + "\n\n";
					break;
				}
				case "STRONG": {
					quote += "'''" + reverseMessage(child) + "'''";
					break;
				}
				case "U": {
					quote += "<u>" + reverseMessage(child) + "</u>";
					break;
				}
				case "S": {
					quote += "<s>" + reverseMessage(child) + "</s>";
					break;
				}
				case "EM": {
					quote += "''" + reverseMessage(child) + "''";
					break;
				}
				case "BR": {
					break;
				}
				case "UL": {
					quote += reverseMessage(child, false, true) + "\n\n";
					break;
				}
				case "OL": {
					quote += reverseMessage(child, false, false) + "\n\n";
					break;
				}
				case "LI": {
					if (isUl === true) {
						quote += "* " + reverseMessage(child) + "\n";
					} else {
						quote += "# " + reverseMessage(child) + "\n";
					}
					break;
				}
				case "DIV": {
					let classList = child.classList;
					if (classList.contains("bloc-spoil-jv")) {
						quote += "<spoil>" + reverseMessage(child) + "</spoil>\n\n"
					} else if (classList.contains("contenu-spoil")) {
						quote += reverseMessage(child);
					}
					break;
				}
				case "SPAN": {
					let classList = child.classList;
					if (classList.contains("bloc-spoil-jv")) {
						quote += "<spoil>" + reverseMessage(child) + "</spoil>";
					} else if (classList.contains("contenu-spoil")) {
						quote += reverseMessage(child);
					}
					break;
				}
				case "LABEL": {
					break;
				}
				case "INPUT": {
					break;
				}
				case "IMG": {
					quote += child.alt;
					break;
				}
				case "A": {
					if (child.href) {
						quote += child.href;
					} else {
						quote += reverseMessage(child);
					}
					break;
				}
				case "PRE": {
					quote += reverseMessage(child) + "\n\n";
					break;
				}
				case "CODE": {
					quote += "<code>" + child.textContent + "</code>";
					break;
				}
				case "BLOCKQUOTE": {
					if (prevIsP) {
						quote = quote.trimEnd() + "\n" + reverseMessage(child).replace(/^/gm, '> ') + "\n\n";
					} else {
						quote += reverseMessage(child).replace(/^/gm, '> ') + "\n\n";
					}

					break;
				}
				case "#text": {
					// The "isInit" check is to prevent the empty text surroudning message
					// However, it may happen that the root node contains valid text child, so it need to be added somehow
					// For some reason, an "new line" may be missing in this case, so just add it
					if (!isInit || child.textContent.trim() !== "") {
						quote += child.textContent;
						if (isInit && !quote.endsWith("\n")) {
							quote += "\n";
						}
					}
					break;
				}
				default: {
					break;
				}
			}

			if (name == "P") {
				prevIsP = true;
			} else {
				prevIsP = false;
			}
		}

		quote = quote.replace(/(\n){3,}/g, '\n\n').trim();

		if (isInit) {
			quote = quote.replace(/^/gm, '> ');
		}

		return quote;
	}

	function reverseQuote(blocMessage) {
		let author = blocMessage.getElementsByClassName("jvchat-author")[0].textContent.trim();
		let date = blocMessage.getElementsByClassName("jvchat-date")[0].getAttribute("to-quote");
		let header = `> Le ${date} ${author} a écrit :\n`;
		let quoted = reverseMessage(blocMessage.getElementsByClassName("txt-msg")[0], true);
		return header + quoted + '\n\n';
	}

	function insertAtCursor(input, textToInsert) {
		const value = input.value;
		const start = input.selectionStart;
		const end = input.selectionEnd;
		input.value = value.slice(0, start) + textToInsert + value.slice(end);
		input.selectionStart = input.selectionEnd = start + textToInsert.length;
	}

	function dontScrollOnExpand(event) {
		let target = event.target;
		if (!target) {
			return;
		}

		let classes = target.classList;

		if (classes.contains("nested-quote-toggle-box")) {
			let isDown = isScrollDown();
			let blockQuote = target.closest(".blockquote-jv");
			let visible = blockQuote.getAttribute("data-visible");
			let value = visible === "1" ? "" : "1";
			blockQuote.setAttribute('data-visible', value);
			if (isDown) {
				setScrollDown();
			}
		} else if (classes.contains("txt-spoil") || classes.contains("aff-spoil") || classes.contains("masq-spoil")) {
			event.preventDefault();
			let check = target.closest(".bloc-spoil-jv").getElementsByClassName("open-spoil")[0];
			let isDown = isScrollDown();
			check.checked = !check.checked;
			if (isDown) {
				setScrollDown();
			}
		} else if (classes.contains("jvchat-quote")) {
			let bloc = target.closest(".jvchat-message");
			let quote = reverseQuote(bloc);
			let textarea = document.getElementById("message_topic");
			if (isReduced) {
				toggleTextarea();
			}
			insertAtCursor(textarea, quote);
			textarea.focus();
		} else if (classes.contains("jvchat-edit")) {
			let bloc = target.closest(".jvchat-message");
			requestEdit(bloc);
		} else if (classes.contains("jvchat-delete")) {
			let bloc = target.closest(".jvchat-message");
			event.stopPropagation();
			requestDelete(bloc);
		} else if (classes.contains("jvchat-edition-check")) {
			let bloc = target.closest(".jvchat-message");
			editMessage(bloc);
		} else if (classes.contains("jvchat-edition-cancel")) {
			let bloc = target.closest(".jvchat-message");
			let isDown = isScrollDown();
			bloc.getElementsByClassName("jvchat-content")[0].classList.remove("jvchat-hide");
			bloc.getElementsByClassName("jvchat-edition")[0].classList.add("jvchat-hide");
			if (isDown) {
				setScrollDown();
			}
		}
	}

	function isScrollDown() {
		let element = document.getElementById("jvchat-main");
		return element.clientHeight + Math.floor(element.scrollTop) >= element.scrollHeight - 1;
	}

	function setScrollDown() {
		let element = document.getElementById("jvchat-main");
		element.scrollTop = element.scrollHeight + 10000;
	}

	function main() {
		addJVChatButton(document);
		bindJVChatButton(document);
	}

	main();
