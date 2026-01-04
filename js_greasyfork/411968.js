// ==UserScript==
// @name JNP Tweaks bundle
// @namespace myfonj
// @version 0.0.0
// @description UI improvements for jNetPublish CMS by etnetera
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:https?://([^/]+/){1,3}edit/.*)$/
// @include /^(?:https?://(?:[^/]+/)+edit/.*AssetListFilter.*)$/
// @include /^(?:https?://(?:[^/]+/)+edit/.*QuickSearchFilter-search.*)$/
// @include /^(?:https?://(?:[^/]+/)+edit/TransactionListPage-undoTransaction\?tid=.*)$/
// @include /^(?:https?://(?:[^/]+/)+tangle/.*)$/
// @include /^(?:h(t)\1ps?:(/)\2(?:[^.]+\.)*(i)f(o)r\1(?!for)u[n]a\.cz\2ed\3t\2.*)$/
// @downloadURL https://update.greasyfork.org/scripts/411968/JNP%20Tweaks%20bundle.user.js
// @updateURL https://update.greasyfork.org/scripts/411968/JNP%20Tweaks%20bundle.meta.js
// ==/UserScript==

(function() {
let css = "";
if (new RegExp("^(?:https?://([^/]+/){1,3}edit/.*)\$").test(location.href)) {
		css += `
		/*
		základ psaný pro verze Eris (3.5) a Limos (3.6) (a nejspíš i potenciální vyšší ne-NG)
		pro starší verze (Vetis, 3.4) overrides na konci

		Primárně laděno na Eris jNP na MHMP a All, a Vetis na Ftn

		TOC lze vygenerovat přes regexp: ^\\s*[§¶].*
		(je dlouhej a nudnej je přepastovaný na userstyles stránce kdyby něco)

		*/

		/*_________________________________________
		§§	blok pro \`jakýkoli //../edit/.. \`
		*/




		/*
		§	odkazy
			¶	navštívené odlišit
			editační URL v rámci editace jsou sice nevyzpytatelné,
			ale i tak tohle může ledaskde pomoci v orientaci
		*/
		a:link {
			color: #069; /* pro informaci, bez importantu */
		}
		a:visited {
			color: #370 !important;
		}

		/*
			¶	při hoveru/focusu podbarvit
		*/
		input[type=button]:focus ,
		input[type=submit]:focus ,
		input[type=button]:hover ,
		input[type=submit]:hover ,
		a.button:hover ,
		a.button:focus {
			background-image: none !important;
		}

		a:link:hover ,
		a:link:focus {
			color: #000 !important;
			background-color: #cef !important;
		}
		a:link:hover:before ,
		a:link:focus:before {
			background-color: rgba(0,200,255,0.2) !important;
		}
		a:visited:hover ,
		a:visited:focus {
			color: #000 !important;
			background-color: #efc !important;
		}
		a:visited:hover:before ,
		a:visited:focus:before {
			background-color: rgba(0,255,0,.2) !important;
		}

		.button.plain.active {
			background-color: #fff8d9 !important;
		}

		/*
		§	textrareas: čitelný font, 4mezerové tabulátory
			pro inputy možno taky, ale neosvědčilo se mi to
		*/
		/*
		input ,
		input[type="text"] ,
		input[type="password"] ,
		input:not([type]) ,
		*/
		textarea {
			-moz-tab-size: 4;
			tab-size: 4;
			font-family: "Courier new", monospace !important;
			font-size: 11pt !important;
			/* tohle dělá psí kusy v Chrome, a beztak obstarává GM */
			/* white-space: nowrap !important; */
		}
		#inputBg, #searchBg {
			font-size: 11pt !important
		}


		/*
		§	checkboxy: větší
		*/
		input[type="checkbox"] {
			width: 1.5em !important;
			height: 1.5em !important;
		}

		/* 
		§	horní rámec (login, projekt, sezení atd): na jeden řádek
		*/
		#topFrame { padding: 0 !important; }
		#topFrame td { width: auto !important; }
		#logo img { height: 22px; }
		body:hover #logo img {
			z-index: 1;
			position: relative;
		}
		#userInfo  *, 
		#projectInfo * { display: inline !important; }
		/* to by člověk neřek, jak tohle bude efektivní */
		#projectInfo th { display: none !important; }
		#topFrame:not(:hover) { opacity: 0.75; }

		/*
		§	levé menu
		*/
		/*
			¶	editovaný asset: nezalamovat id a jméno
			#132 - assetID
		*/
		#edited-asset-header {
			white-space: nowrap;
		}

		/*
			¶	strom "složek": velké odkazy, menší výška (scroll)
			@note: výška stromu by optimálně měla korespondovat s výškou oblíbených?
		*/
		.tree {
			max-height: 200px;
			display: block !important;
			margin:  0 !important;
			overflow: auto !important;
			transition-property: max-height;
			transition-duration: .3s;
			transition-timing-function: ease;
			transition-delay: .1s;
		}
		.tree:hover {
			max-height: 800px;
			transition-property: max-height;
			transition-duration: .5s;
			transition-timing-function: ease;
			transition-delay: .3s;
		}
		/*
			u loginu by to zase bylo jenom k zlosti
		*/
		#assetTypeList.tree, /* vetis */
		#loginDialogBox .tree { max-height: none; }
			
		.tree-ni { float: left !important; }
		.tree-nc ,
		.tree-nc .assetName ,
		.tree-nc a:only-child {
			display: block !important;
			width: auto !important;
		}
		.tree-n > ul {
			clear: both !important;
		}


		/*
			¶	levý horní panel editace (šablona, odkazy, doplňky, ..): zmenšit na tlačítka v řádcích
		*/
		#panel-dock-contents {
			position: relative;
		}
		#panel-dock-contents:after {
			content: "";
			display: table !important;
			clear: both !important;
		}
		/*
				¶	šířka tlačítka: sedm v řadě vypadá ok
		*/
		#panel-dock-contents .panel-item {
			float: right;
			width: 10%; /* 100 / 10 :] */
			width: 7.6923076923%; /* 100 / 13 */
			width: 14.2857142857%; /* 100 / 7 */
		}
		#panel-dock-contents .panel-item a {
			width: auto !important;
			padding: 5px !important;
			text-align: center !important;
		}
		#panel-dock-contents .img-icon-image {
			display: inline !important;
		}
		#panel-dock-contents .img-icon-image img {
			display: inline !important;
			padding: 0 !important;
		}
		/*
				¶	barvy aktivního a hoverovaného tlačítka
		*/
		#panel-dock-contents  a:link:hover ,
		#panel-dock-contents  a:link:focus {
			background-color: #669 !important;
		}
		#panel-dock-contents a:visited:hover ,
		#panel-dock-contents a:visited:focus {
			background-color: #246a0a !important;
		}

		#panel-dock-contents .active-panel-item a {
			background-color: #0a246a !important;
		}

		/*
				¶	opět blokovatění (něco z tohoto je i pro Vetis)
		*/
		#MUF-editor .panel-dock-holder H1 .assetName ,
		td#sidebar dd table.list a.assetName strong ,
		td#sidebar dd table#favouriteAssets-list a.assetName strong ,
		#MUF-EDITOR #panel-docks a.assetName strong {
			width: auto !important;
			font-weight: normal
		}
			
		/*
				¶	popisek tlačítka: při hoveru překryje header (následujícího) boxu
		*/
		#panel-dock-contents .panel-item a:focus .img-icon-text ,
		#panel-dock-contents .panel-item a:hover .img-icon-text {
			visibility: visible;
		}
		#panel-dock-contents .img-icon-text {
			visibility: hidden;
			position: absolute;
			top: 100%;
			left: 0;
			width: 100%;
			white-space: nowrap;
			text-align: center !important;
			background-color: #359 !important;
			color: #fff !important;
			z-index: 1;
			text-decoration: none !important;
			padding: 5px 0 !important;
		}
		/*
			pro jistotu: skrýt při hoveru samotného popisku
			by řešily pointer events, ale co.
		*/
		#panel-dock-contents .panel-item a .img-icon-text:hover {
			visibility: hidden !important
		}
		/*
			nějaké podivnosti na o2, zbytečnosti na Fortuně
			a kotvy na bloky atributů v obecném editoru na fortuně
		*/
		.panel-item	ul {
			display: none;
			position: absolute;
		}

		/*
			¶	dock oblíbené
		*/
		/*
				¶   manipulace (přesun, smazat): skrýt
					zabírá moc místa, nepoužívá se často
		*/
		#favouriteAssets-list .short:last-child a:first-child ,
		#favouriteAssets-list .short ~ .short:not(:last-child) a {
			display: none !important;
		}
		#favouriteAssets-list .short:last-child a:first-child img,
		#favouriteAssets-list .short ~ .short:not(:last-child) a img {
			position: relative;
			left: -4px;
		}


		/*
				¶	tlačítko "Přidat" do pravého horního rohu vedle nadpisu
					každý vertikální pixel se počítá
		*/
		#fav-dock-contents .buttons {
			position: absolute;
			top: 2px;
			right: 2px;
			padding: 0!important;
		}
		/*
			¶	nedostupné položky:	skrýt
				informace "položka není dostupná" je postradatelná
		*/
		#favouriteAssets-list td.small[colspan="4"],
		#favouriteAssets-list td.small[colspan="4"] + td {
			display: none;
		}

		/*
				¶	nadpisy sloupců "ID" a "NÁZEV":	skrýt
					tahle informace je myslím také opravdu zřejmá
		*/
		#panel-docks thead ,
		#sidebar thead {
			display: none;
		}


		/*
				¶	\`docks\` v editaci: rozbalit natvrdo
				(v editaci se otravně 'náhodně' sbalují, persistence)
		*/
		#panel-docks .box-c {
			display: block !important
		}

		/*
				¶	"Naposledy změněné/zobrazené položky": nižší a scrollovatelné 
				#last.. - list
				#Last.. - editace
				tahle schizofrenie je fakt legrační
		*/
		#lastEdited-dock-contents ,
		#LastEditedAssets-dock-contents ,
		#lastVisited-dock-contents ,
		#LastVisitedAssets-dock-contents {
			max-height: 21em !important;
			overflow-x: hidden;
			overflow-y: auto;
		}
		#lastedit-dock-contents { 
			max-height: 40em ;
			overflow-x: hidden;
			overflow-y: auto;
		}
			
		#lastVisited-dock-contents td:last-child a  ,
		#lastEdited-dock-contents td:last-child a  ,
		#LastVisitedAssets-dock-contents td:last-child a ,
		#LastEditedAssets-dock-contents td:last-child a {
		/*	padding-right: 1.3em !important; */
		/* @FIXME zalejzáme pod scrollbary a gradienty stejně nesedí */
		}


		/*
		§	buňky v tabulkách: komprimovat (line-height místo paddingu)
			tohle je nejspíš overkill, ale ...
		*/
		form th,
		form td,
		table.list td,
		table.list th,
		table.form td,
		table.form th {
			padding-top: 0px !important;
			padding-bottom: 0px !important;
			padding-left: 0px !important;
			padding-right: 0px !important;
			line-height: 1.7 !important;
		}
		form th:first-child,
		form td:first-child,
		table.list td:first-child,
		table.list th:first-child,
		table.form td:first-child,
		table.form th:first-child {
			padding-left: 4px !important;
		}


		/*
		§	fix pro pozici ikonek
			top left není ideální
		*/
		.muf-icon, .icon-16, .i-16 {
			background-position: center left !important;
		}


		/*
		§	assetové linky blokové (!!)
			tyjo, proč TOHLE tak není defaultně?
			zase pár Vetisových infikací
		*/
		tbody.enhancedCheckboxes td.name strong {
			display: block;
			position: relative;
		}
		tbody.enhancedCheckboxes td.name strong img {
			position: absolute;
		}
		tbody.enhancedCheckboxes td.name strong a {
			display: block;
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			margin-left: 20px;
			/*
			vinou &nbsp;  se to musí takhle prasit.
			*/
			text-align: left !important;
		}
		td > .assetName {
			width: auto !important;
			display: block !important;
		}
		td > .assetName > span {
			float: left;
			padding-top: 3px !important;
			padding-right: 3px !important;
			display: block;
		}
		#sidebar .box .assetName  ,
		#panel-dock-sidebar .box .assetName {
			max-width: 193px !important;
			/*
			jinak dlouhé názvy moc rozšíří sidebar
			*/
		}

		.buttons a ,
		td > .assetName a {
			display: block !important;
			padding: 2px 2px !important;
		}
		.short a {
			padding: 2px 2px !important;
		}

		/*
			¶	maximální šířka linky v #sidebar
			jinak může sidebar při hodně dlouhých názvech zobrazených assetů dost nabobtnat
		*/	
		#sidebar .assetName a {
			max-width: 250px;
		}	
			
		/*
		§	důležité (editační) "buttony" ve výpisu větší, snazší pro click
		*/
		a[href*="undoTransaction"] ,
		.master table.list td.short:last-child a[href*="EditorPage-init?assetId="] {
			width: 6em !important;
			display: block;
		}

		/*
		§	delete maličkatý
		*/
		a[href*="delete"]{
			max-width: 2em !important;
		}

		/*
		§	button na editaci pravidla šablony: přes celý řádek tabulky
			kdo se na to má pořád strefovat
			pravidla šablony mají na konci URL 'PanelFull$FULL-editRule?'
			pro pravidla překladových map to zkusím vypustit to 'Rule?'.
		*/
		.box form a[href*="/edit/EditorPage-init?assetId="] ,
		a[href*="/edit/EditorPage$EditorContainer$PanelFull$FULL-edit"] {
		}
		.box form a[href*="/edit/EditorPage-init?assetId="]:hover ,
		a[href*="/edit/EditorPage$EditorContainer$PanelFull$FULL-edit"]:hover{
			outline: 1px solid #ccf9ae;
		}
		.box form a[href*="/edit/EditorPage-init?assetId="]:before ,
		a[href*="/edit/EditorPage$EditorContainer$PanelFull$FULL-edit"]:before,
		a[href*="/edit/HistoryPreviewPage$EditorContainer$PanelFull$FULL-editRule?index="]:before
		{
			content: '…edit';
			color: transparent;
			text-align: right;
			position: absolute;
			left: 0%;
			width: 100%;
			opacity: 1;
			z-index: 1;
			margin-top: -3px;
			padding-top: 4px;
			line-height: 1.8;
			/* 
			aktivace pouze při *hovernutí seshora*:
			moc se to neosvědčilo, ale zase to umožňuje výběr textu, který je jinak myši nepřístupný
			* OFF /
			height: 3px;
			/* */
		}
		.box form a[href*="/edit/EditorPage-init?assetId="]:focus:before ,
		a[href*="/edit/EditorPage$EditorContainer$PanelFull$FULL-edit"]:focus:before ,
		.box form a[href*="/edit/EditorPage-init?assetId="]:hover:before ,
		a[href*="/edit/EditorPage$EditorContainer$PanelFull$FULL-edit"]:hover:before {
			opacity: 1;
		}
		/*
			¶	přesouvací a mazací buttony z-indexem NAD editovací
		*/
		.buttons a[href*=-delete] ,
		.buttons a[href*=-move] {
			position: relative !important;
			z-index: 2 !important;
		}

			
		/*
			¶  ^ v sidebaru toto změnit na poloviční \`gradient\`
			aby přeci jen zůstaly přístupné linky na vstup do mateřksé složky
		*/
		.box form { position: relative; }
		.box form a[href*="/edit/EditorPage-init?assetId="] { display: block; }
		.box form a[href*="/edit/EditorPage-init?assetId="]:before {
			width: 30%;
			right: 18px;
			left: auto;
			opacity: 0;
			overflow: visible;
			z-index: 1000;
			background-color: transparent !important;
			background-image: linear-gradient( to right, rgba(204,249,174,0) 0%, rgba(204,249,174,1) 100%);
		}
		.box form a[href*="/edit/EditorPage-init?assetId="]:focus ,
		.box form a[href*="/edit/EditorPage-init?assetId="]:hover {
			background-color:  rgba(204,249,174,1) !important;
		}
			
		/*
		§	smrsknout prázdné textaras v editaci
			ulehčí "prázdným" editacím s hromadou vstupů
			+ mnozí efektové aby se dalo zase myší submitovat a tlačítko neujíždělo
		*/
		textarea:not(:focus):not(:hover):empty {
			height: 3em !important;
		}
		/*
		@pokus vyzkoumat, jestli by nešly vymyslet jště nějaké sereptičky s více stavy 'pozornosti'
		*/
		/* */
		textarea {
			transition-property: height;
			transition-delay: 0s;
			transition-timing-function: ease-in-out;
			transition-duration: 0.1s;
		}
		textarea:not(:focus) {
			height: 20rem !important;
			transition-delay: 0.4s;
			/* tenhle delay je nutný aby se dalo bez obav klikat na save */
			border-color: red !important; }
		textarea:focus {
			height: 42rem !important;
			transition: none;
			border-color: black !important;
		}
		/* malé obražofky */
		@media only screen and (max-height: 800px)
		{
			textarea:not(:focus) {
				height: 5em !important;
				transition-duration: 0s;
			}
			textarea:focus {
				height: 20em !important;
				transition-duration: 0s;
			}
		}

			
		/*
			¶	ovladací panel na zvětšování textarey: shovat (je takto zbytečný)
		*/
		.areaTools {
			display: none;
			
		}

		/*
		§	iframe přidávaný GM skriptem (pokud používáte): hover roztahování pro peek
			delay abyto furt nezaclánělo
			pokud není JNP_editor.user.js, možno vyhodit
		*/
		.artificial_iframe_for_background_submitting:hover {
			height: 30em !important;
			transition-property: height;
			transition-duration: 1.5s;
			transition-timing-function: ease;
			transition-delay: 0.6s;
		}
		.artificial_iframe_for_background_submitting {
			transition-delay: 0.0s;
		}


		/*
		§	float:right -> float:left
			je to legrační, ale mnohé tohle opravdu zpřehlední
			otočí to pořadí, ale to není na škodu
		*/
		/*
			in: editace assetu - reference
		*/
		#cw_genFromTitle_holder {
			float: left;
			display: inline;
		}
		#cw_asset_name_holder {
			margin-right: 0;
			margin-left: 200px;
		}
		.text-field.fr ,
		.text-field.fr + .reference-details  ,
		.floatRight ,
		.fr , /* vlastně nevím, proč jsem tohle nepoužil rovnou (?) nejspíš to rozbíjí něco, co si nevybavuju */
		/*
			v tomhle je type picker ve formátovači, a dost možná ledacos ještě (?)
		*/
		.tools 
		{
			float: left !important;
		}
		div.ref-popup-control {
			float: none !important;
			text-align: left !important;
		}
			
			

		/*
		§	u referencí / asset listů rozáhnout input co to dá a vybírací šipečku na začátek
			podle stejné filosofie jako předchozí.
		*/
		.text-field.fr {
			display: block;
			float: none !important;
			width: auto;
			padding-left: 15px;
			position: relative;
		}
		.text-field.fr a {
			position: absolute;
			left: 0;
		}
		.text-field.fr input {
			width: 100%;
		}
			

		/*
		§	editace slovníku: široké editační pole
		*/
		/*
			¶   smrsknout sloupce mimo editačního
		*/
		#dictionaryEntries tbody td.ddh + td + td ~ td ,
		#dictionaryEntries tbody td.ddh + td {
			width: 1%;
		}
		/*
			¶   natáhnout editační input
		*/
		#dictionaryEntries tbody td input.input, /* tohle je případ překladového */
		td > input[type="text"]:only-child , 
		td > input[type="hidden"]:first-child + input:last-child  /* tohle je taky případ překladového, možná by se mohlo vyskytnout i jinde */
		{
			display: block !important;
			width: 100% !important;
		}


		/*
		§	zobrazit (redundantní) ukládací buttony nad formem
			ukládací buttony jsou na některých editorech duplicitně nad i pod
			tenhle je nad, a mnohdy užitečný
		*/
		.awayFromViewport {
			height: auto !important;
			overflow: visible !important;
			position: static !important;
			width: auto !important;
		}


		/*
		§	výpis transakcí: rozbalit sbalené řádky
			thank me later
		*/
		table.list tbody tr.dontHighlight {
			display: table-row !important;
		}

		/*
		§	highlightovaná řádka výraznější než hoverovaná
		*/
		tr.selected ,
		tr.hl {
			background-color: #ffdd99 !important;
		}

		/*
		§   ovládací panely do popupu místo nudle
		*/
		.layoutHolder,
		.box.m0.dark {
			position: relative;
		}
		a[href$="$TabbedPanel-togglePin?name=controlPanel&_ajax=true"] {
			position: relative;
			background-image: none !important;
		}
		a[href$="$TabbedPanel-togglePin?name=controlPanel&_ajax=true"].expand-icon-light:after {
			content: '»';
			display: block;
			position: absolute;
			top: 0;
			right: 0;
			z-index: 111;
			color: red;
			font-size: 3em;
		}
		a[href$="$TabbedPanel-togglePin?name=controlPanel&_ajax=true"].collapse-icon-light:after {
			content: '×';
			display: block;
			position: absolute;
			top: 0;
			right: 0;
			z-index: 111;
			color: red;
			font-size: 3em;
		}
		#controlPanel-dock-contents {
			position: absolute;
			left: 100%;
			width: 1300px;
			border: 1px solid #6a6a6a;
			counter-reset: foo;
			z-index: 1000;
			box-shadow: 0 0 50px 5px rgba(0,0,0,0.5);
			margin-top: -2.3em;
		}
		#controlPanel-dock-contents li {
			float: left;
			width: 20%;
			position: relative;
			font-size: 0;
		}
			
		#controlPanel-dock-contents a {
			height: 100%;
			position: relative;
			font-size: 12px !important;
		}

		#controlPanel-dock-contents
		{
			background-color: #fff;
		}
		#controlPanel-dock-contents a .desc.aux-lo {
			display: none;
			pointer-events: none;
		}
		/*
		§	vybrané ovládací prvky:	zvýraznit
		*/
		#controlPanel-dock-contents li a[href$='ManageUsersPage'] ,
		#controlPanel-dock-contents li a[href$='LogViewerPage'] ,
		#controlPanel-dock-contents li a[href$='OnlineDeploymentPage'] ,
		#controlPanel-dock-contents li a[href$='UserPreferencesPage'] ,
		#controlPanel-dock-contents li a[href$='ManageProjectsPage'] {
				font-size: 22px !important
		}
			
			
		/*
		§   aktivní vyhledávání: mega zvýraznit neprázdný input
			kdo se má pořád divit, že nic nevidí, když má odfiltrováno
			škoda že se na to nedá moc spolehnout :(
		*/
		#quickSearchFilter input[name="query"][value]:not([value=""]) {
			background-color: #c00 !important;
			color: #fff !important;
			width: 500px !important;
		}


		/*
		§	zvýraznění sebereferencí (classu opět obstarává userscript)
			¶ řádky v tabuli
		*/
		.self_referrence {
			background-color: #ffdd99;
		}
		.self_referrence td:first-child {
			font-weight: bold;
		}
		.self_referrence .details:after {
			content: '(self-referrence)' !important;
			font-style: italic;
		}
		/* tr ... a */
		.self_referrence  .details .self_referrence {
			display: none;
		}
		/*
			¶ odkazy (v levém boxu)
		*/
		a.self_referrence {
			background-image: linear-gradient(to right, rgba(255,221,153,0) 0%, rgba(255,221,153,1) 100% )
		}
		/*
		§	skryté inputy, odkrývané javascriptem
			pokud je to zrovna zaplé
		*/
		.hidden_input {
			border-color: #966 !important;
			text-align: right !important;
		}
		.hidden_input:focus ,
		.hidden_input:hover	{
			background-color: #fcc;
		}
		input[name="assetId"] ,
		tbody > .hidden_input {
			border: 1px solid red !important;
			position: absolute;
			right: 0;
		}

		/*
			§	outline pro form
		*/
		form { outline: 1px solid #fcc !important; }
			

		/*
			???
		*/
		input[name="asset_type"] {
			width: 30em;
		}
		/*
		§	disablované inputy čitelné
			v historyPreview se jinak nedalo číst
		*/
		input[disabled], input[readonly],
		input.readonly,
		textarea[disabled],
		textarea[readonly],
		textarea.readonly {
			background-color: #fff !important;
			color: #666 !important;
			border-color: #933 !important;
			box-shadow: 0 0 2px #933 inset;
		}


		/*
		§	zčitelnit DIFFy historie
		*/
		/*
			¶	první sloupec ("pole"/režimy): pevná menší šířka
		*/
		table.diff colgroup col:nth-child(1) {
			width: 7em !important;
		}
		/*
			¶	druhý sloupec ("změna"): úplně skrýt (barvy v řádcích snad stačí)
		*/
		table.diff td:nth-last-child(3) , /* řádek má buď 4 nebo 2 buňky (rowspany)  */
		table.diff colgroup col:nth-child(2) {
			font-size: 0px !important;
			width: 0;
			height: 0;
		}
		/*
			¶	DATA tím pádem nechat co největší
		*/
		table.diff colgroup col:nth-child(3) ,
		table.diff colgroup col:nth-child(4) {
			width: auto !important;
		}
		/*
			¶	nezměněné řádky: zmenšit písmo
		*/
		table.diff td.EQUAL pre {
			font-size: 0.85em !important
		}
		/*
			¶	změněné řádky: povolit zalamování
				aby se daly přečíst i konce
		*/
		table.diff td.DELETE pre ,
		table.diff td.CHANGE pre ,
		table.diff td.INSERT pre {
			white-space: pre-wrap
		}
		table.diff td:first-child strong {
		/**/
			display: block;
		/**/
		}

		/*
			¶	pokus
		*/
		td > strong:only-child ,
		td > strong:only-child > a:only-child {
			display: inline-block;
		}
		/*	EO:
		|	§§	blok pro \`jakýkoli //../edit/.. \`
		\\_________________________________________*/


		:not(#\\0):not(#\\0)[style="background-image: url(../images/icons/actions/save-project-disabled-16.png);"] {
		 border: 1px solid red;
			display: none !important;
		}

		#userInfo select {
			max-width: 9em !important;
		}


		`;
}
if (new RegExp("^(?:https?://(?:[^/]+/)+edit/.*AssetListFilter.*)\$").test(location.href) || new RegExp("^(?:https?://(?:[^/]+/)+edit/.*QuickSearchFilter-search.*)\$").test(location.href)) {
		css += `
		/*_________________________________________\\
		§§	ve FILTRU vypsat cesty (z titlů)
			tohle zdaleka není stoprocentní
			kdybyste měli binec v contentové tabuli, vlezte na stejné místo přes breacrumb nebo tak nějak
		*/



			.enhancedCheckboxes .assetName[title] a {
				text-align: right;
				color: transparent;
			}
			.enhancedCheckboxes .assetName[title]:before
			{
				content: attr(title);
				float: left;
				z-index: 1;
				pointer-events: none;
			}

			/*
				§	to samé u listu modulů
				tady to ale musím otočit, jinak cesta leze do typu assetu
			*/
			.moduleEditorHolder .assetName[title] a {
				text-align: left;
			}
			.moduleEditorHolder .assetName[title]:after
			{
				content: attr(title);
				float: right;
				z-index: 1;
				margin-top: -1.5em;
				pointer-events: none;
			}
		/* EO:
		|	§§	ve FILTRU vypsat cesty (z titlů)
		\\_________________________________________*/
		`;
}
if (new RegExp("^(?:https?://(?:[^/]+/)+edit/TransactionListPage-undoTransaction\\?tid=.*)\$").test(location.href)) {
		css += `
		/*_________________________________________\\
		§§	blok pouze pro undoTransaction dialog
		*/


			/*
				¶	potvrzovací checkboxy napravo a veliké
			*/
			.msg.alert input {
					float: right;
					width: 3em !important;
					height: 3em !important;
					position: relative;
					top: -1em;
			}
			.buttons { text-align: right !important; }
			.buttons input { float: right !important; }
		/*	EO:
		|	§§	blok pouze pro undoTransaction dialog
		\\_________________________________________*/
		`;
}
if (new RegExp("^(?:https?://(?:[^/]+/)+tangle/.*)\$").test(location.href)) {
		css += `
		/*_________________________________________\\
		§§	blok pouze pro tangle
		*/


			/*
				¶	focus viditelný
			*/
			:focus {
					background-color: #dddddd !important;
					outline: 1px dotted;
			}
			.ref-popup-control{
				float: none;
				text-align: left;
			}
		/*	EO:
		|	§§	blok pouze pro tangle
		\\_________________________________________*/
		`;
}
if (new RegExp("^(?:h(t)\\1ps?:(/)\\2(?:[^.]+\\.)*(i)f(o)r\\1(?!for)u[n]a\\.cz\\2ed\\3t\\2.*)\$").test(location.href)) {
		css += `
		/*_________________________________________\\
		§§	blok pouze pro VETIS
		*/

		/*
		jNP Tweaks bundle (myf) overrides for VETIS

		toto jsou pouze divoké přepisy věcí ze základního bundlu, které by jinak dělaly binec, nebo věci, které jsou specifické pouze pro Vetis

		Primárně laděné na Vetisu pro Fortunu.

		Takřka bez dokumentace; punk voe!
		*/




		/*
			¶	font: de-segoeizovat
			"Segoe UI" není úplně špatné, ale Arial má svoje výhody:
			-	je v Limosu
			-	je (lépe) hintovaný: 1px čára -> méně dat
			-	je prostorově úspornější
		*/
		body, table, select, input, textarea, button {
			font-family: Arial, sans-serif;
		}
			
		/*
			¶	cosi s MUFem
		*/
		#MUF-editor #panel-dock-contents .dock-link {
			overflow: hidden !important;
		}
		#MUF-editor #panel-dock-contents .muf-icon {
			white-space: nowrap !important;
		}
		#MUF-editor #panel-dock-contents a:link:hover ,
		#MUF-editor #panel-dock-contents a:link:focus ,
		#MUF-editor #panel-dock-contents a:visited:hover ,
		#MUF-editor #panel-dock-contents a:visited:focus {
			background-image: none !important;
		}

		/*
			¶	ještě cosi s mufem	
		*/
		#MUF-editor #panel-dock-contents .dock-link:active ,
		#MUF-editor #panel-dock-contents .dock-link:hover {
			overflow: visible !important;
			color: #fff;
			text-decoration: none !important;
		}
		#MUF-editor #panel-dock-contents .dock-link span {
			color: transparent;
			position: relative;
			z-index: 1000;
			pointer-events: none;
			padding-left: 30px !important;
			padding-right: 30px !important;
		}
			
		#MUF-editor #panel-dock-contents .dock-link:active span ,
		#MUF-editor #panel-dock-contents .dock-link:hover span {
			text-shadow: -30px -27px 0 #000;
			box-shadow: -30px -27px 0 3px #ffdd99,-30px -27px 10px 3px #747474;
			background-color: transparent;
		}
		td#sidebar dd table.list a.assetName:hover ,
		#MUF-EDITOR #panel-docks table.list a.assetName:hover {
			text-decoration: none !important;
		}

		#MUF-EDITOR #panel-docks table.list a.assetName,
		td#sidebar dd table.list a.assetName{
			word-wrap: break-word;
			word-break: break-all;
		}
			
		#MUF-EDITOR #panel-docks table.list a.assetName strong ,
		td#sidebar dd table.list a.assetName strong {
			display: inline !important;
			width: auto !important;
		}
			

		/*
			/¶	jakýsi fix pro starý	
		*/
		table.form th {
			width: 120px;
			
		}
		table.form th ~ td {
		}
			
		/*
			¶	editační buttony v sidebaru; override vetisových pravidel	
		*/
		/* tohle roztáhne editační buttony přes více řádků pokud je třeba
			popravdě nevím proč neroztáhne i mateřskou buňku (ale to stejně nechceme)
		*/
		#panel-docks form a[href*="/edit/EditorPage-init?assetId="] ,
		#sidebar form a[href*="/edit/EditorPage-init?assetId="] {
			padding-top: 10px !important;
			padding-bottom: 50px !important;
		}
		.layoutHolder form td.short a[href*="/edit/EditorPage-init?assetId="]:after {
			content: 'Editovat';
			opacity: 0;
		}
		.layoutHolder form td.short a[href*="/edit/EditorPage-init?assetId="]:hover:after {
			opacity: 1;
		}
		/*
			¶	zeroBreak nonsense
		*/
		.zeroBreak {
			display: none;
		}

		/*
			¶	nedostupné položky:	schovat
				informace "položka není dostupná" je postradatelná
		*/
		#favouriteAssets-list td.small[colspan="3"],
		#favouriteAssets-list td.small[colspan="3"] + td ,
		#favouriteAssets-list td:nth-last-child(3):first-child
		{
			display: none;
		}

		/*
			¶	docky násilně otevřít (také občas odmítají zůstat jinak otevřené)
		*/
		[id*=dock][style*="display:"][style*="none"]:not([id="controlPanel-dock-contents"]):not(#panel-dock-sidebar-contents) {
			display: block !important;
		}

		/*
			¶	opět float:left -> float: right
		*/
		#assetInputHolder {
			float: left;
		}

		/*
			¶	fix výšky řádku s editačními	buttony
		*/
		.master-content .list .buttons a img {
			border: 2px solid transparent;
			
		}

		/*
			¶	přidat/odebrat oblíbený: dorava nahoru
		*/
		#fav-dock-contents {
			position: relative;
		}
		#fav-dock-contents .links {
			position: absolute;
			top: -30px;
			right: -5px;
		}
		#fav-dock-contents .links span {
			overflow: hidden;
			display: block;
			width: 0;
			height: 20px;
		}
		/*
			¶	neprázdný a focusnutý search/filter input: širší
		*/
		input.filterInput:not([value=""]){
			min-width: 500px;
		}

		/* 
			§ control panel overrides
		*/
			#controlPanel-dock-contents li {
				padding: 0;
			}
			#controlPanel-dock-contents strong {
				border: 1px solid green !important;
			}
			#controlPanel-dock-contents strong a {
				display: block;
				padding: 5px 10px 5px 25px;
			}

		/*	EO:
		|	§§	blok pouze pro VETIS
		\\_________________________________________*/
		`;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
