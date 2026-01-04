// ==UserScript==
// @name 		Youtube Video Filters   
// @author 		Xavier Bouhours
// @version 		2024-05-25
// @description     	Ehance Youtube video player with filters (see "FX" button near "Fullscreen")
// @description:fr 	Ajout de filtres vidéos au player. La propriété css filter est exploitée pour le rendu.
// @description:en 	Luminosity and contrast for Youtube site player.
// @run-at       	document-end
// @compatible 		firefox
// @license		MIT
// @homepage 		https://greasyfork.org/fr/scripts/495951-youtube-video-filters
// @match        	https://*.youtube.com/*
// @namespace https://greasyfork.org/users/1306337
// @downloadURL https://update.greasyfork.org/scripts/495951/Youtube%20Video%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/495951/Youtube%20Video%20Filters.meta.js
// ==/UserScript==


(function(W,D,undefined)
{
	const V = W.videoFx =
	{
		// On récupère le player html5 de Youtube
 		video 	: D.querySelector("video.html5-main-video"),
 		controls: D.querySelector(".ytp-right-controls"),

 		// On crée le bouton d'appel de la fenêtre des filtres
		fx 		: D.createElement("button"),

 		// On crée le panneau de manipulation des filtres
 		panel 	: D.createElement("div"),
 		header	: D.createElement("header"),

 		// On crée le set de boutons
 		close 	: D.createElement("button"),
 		fxswitch: D.createElement("input"),
 	
 		// Filters store : On initialise les filtres
 		filters : 
 				{ 
 					brightness	: { min:0, val:100, max:200, unit:"%", step: 1 },
 					contrast	: { min:0, val:100, max:200, unit:"%", step: 1 },
 					saturate	: { min:0, val:100, max:300, unit:"%", step: 1 },
					grayscale	: { min:0, val:0, max:100, unit:"%", step: 1 },
					'hue-rotate': { min:-360, val:0, max:360, unit:"deg", step: 1 },
					invert		: { min:0, val:0, max:100, unit:"%", step: 1 },
					sepia		: { min:0, val:0, max:100, unit:"%", step: 1 },
					blur		: { min:0, val:0, max:10, unit:"px", step: 1 }
 				},

 		// Application des filtres à la vidéo
		refresh : function()
				{
					var k, c = "";

					// On compile chaque filtre pour la propriété css
					for( k in V.filters )
					{
						var f = V.filters[k];
						c+= k+'('+ f.val + f.unit +') ';
					};

					// On applique le style à la vidéo
					V.video.style.filter = c ;
					// console.log(c);
				},

		// Ajouter un réglage de filtre au panneau
		// @see: https://blog.hubspot.com/website/html-slider
		// @ex: <input type='range' min='0' value='1' max='3' name='contrast'>
		addfilter : function( name, min, val, max )
		{
				let 
					C = D.createElement("div"), 	// Conteneur
					I = D.createElement("input"),	// Slider
					L = D.createElement("label");	// Titre
					
				I.type 	= "range"; 
				I.name 	= I.title = I.style.content = name;
				I.min 	= min;
				I.value	= val;
				I.max	= max;
				
				// On ajoute le conteneur pour le label et le curseur
				V.panel.append(C);

				// On ajoute le titre
				C.append(L);
					L.append(name);

				//… et le curseur de réglage
				C.append(I);

				I.addEventListener("change", function()
				{
					// On sauvegarde la valeur
					// console.log(this,I);
					V.filters[I.name].val = I.value ;

					// On applique les modifications
					V.refresh();
				});
		},

		initialized : false,

		// Initialisation du module
		init	: function()
				{
					if(!!V.initialized) return true ;

					// On ajoute le bouton "FX" aux contrôles du player
					V.controls.append(V.fx);
						V.fx.classList.add("ytp-button");
						V.fx.classList.add("video-fx");
						V.fx.append("FX");
						V.fx.addEventListener("click", () => 
						{
	  						V.panel.classList.remove(V.panel.classList.item(1)); // item(0) = "video-filters" ; item(1) = "hidden"
						});

					// On ajoute le panneau des filtres…
					// V.controls.append(V.panel);
					D.querySelector("body").append(V.panel);
					V.panel.classList.add("video-filters");
					V.panel.classList.add("hidden");
					
						// … avec son header (draggable zone)
						V.panel.append(V.header);
							V.header.append("Video Filters");

						// … avec ses filtres,
						var n ;
						for( n in V.filters )
						{
							var f = V.filters[n];
							V.addfilter( n, f.min, f.val, f.max, f.step );
						};

						// … et son bouton de fermeture
						V.header.append(V.close);
							V.close.append("X");
							V.close.setAttribute("title","Close");
							V.close.classList.add("close");
							V.close.addEventListener("click", () => 
							{
	  							V.panel.classList.add("hidden");
							});

						// … et le bouton switch dpour la désactivation des filtres
						V.header.append(V.fxswitch);
							V.fxswitch.classList.add("switch");
							V.fxswitch.setAttribute("type","checkbox");
							V.fxswitch.setAttribute("checked","true");
							V.fxswitch.addEventListener("click", () => 
							{
	  							// set On
	  							if( V.fxswitch.checked == 1 )
	  							{
	  								V.refresh();
	  								V.panel.setAttribute("class","video-filters"); // restore
	  							}
	  							// set Of
	  							else
	  							{
	  								V.video.style.filter = "none";
	  								V.panel.classList.add("of");
	  							}
							});


					// On installe le theme
					V.panel.append( V.mkstyles() );

					// … et on ajoute la fonctionnalité de déplacement
					V.draggable(V.panel);

					V.initialized = true ;
				},
		
		// UI theme
		theme 	: `	/* Couleurs du theme en accord avec navigateur */
					:root
					{
						--vf-back-r: 255;
						--vf-back-v: 255;
						--vf-back-b: 255;
						--vf-back-c: rgb( var(--vf-back-r), var(--vf-back-v), var(--vf-back-b) );
						--vf-txt-c: black;
						--vf-active-c: #3e94f6; /* ff def value */
					}
					@media (prefers-color-scheme: dark)
					{
						:root
						{
					    	--vf-back-r: 0;
							--vf-back-v: 0;
							--vf-back-b: 0;
					    	--vf-txt-c: white
					    }
					}

					/* On positionne le bouton "FX" */
					button.video-fx
					{
						transform: translateY(-1.5em)
					}

					/* On optimise le panneau des filtres */
					.video-filters
					{
						position: absolute;
						z-index: 1000;
						width: clamp(30em,30vw,100%);
						background: rgba(var(--vf-back-r), var(--vf-back-v), var(--vf-back-b), .4 );
						backdrop-filter: blur(.3em) brightness(50%);
						border-radius: 1em;
						display: flex;
						justify-content: space-evenly;
						flex-wrap: wrap;
						top: 40vh;
						left: 10vw;
						font-weight: bold;
						margin-bottom: 1em;
						overflow: hidden;
						box-shadow: 0 0 .4em var(--vf-txt-c)
					}
					.video-filters.hidden
					{
						display:none
					}

						/* On ajoute la zone de drag */
						.video-filters header
						{
							text-align: center;
							padding: 1em;
							cursor: move;
							z-index: +1;
							background: var(--vf-back-c);
							color: var(--vf-txt-c);
							width:100%
						}

						/* On positionne les conteneurs pour chaque filtre */
						.video-filters > div
						{
							box-sizing: border-box;
							margin-bottom: 1em;
							max-width: 20em;
							transition:	all .5s ease-out
						}
						.video-filters.of > div
						{
							user-select: none;
  							opacity: .4;
  							filter: grayscale(100%) blur(1px);
							pointer-events:none;
						}

							/* On positionne les filtres */
							.video-filters label,
							.video-filters input
							{
								display: block;
								width: 100%
							}

							/* On règle les intitulés des filtres */
							.video-filters label
							{
								transform: translate(1em,0);
								color: white;
								text-transform: capitalize
							}

						/* Boutons, etc */
            			.video-filters .close,
            			input[type='checkbox'].switch
            			{
	           				border-radius: 1em;
							width:1em;
							height: 1em;
							border: 2px solid var(--vf-txt-c)
            			}

						/* On positionne le bouton de fermeture */
						.video-filters .close
						{
							display: block ;
							position: absolute ;
							top: .7em ;
							right: .7em;
							line-height: 0;
							color:transparent;
							font-size: 1.3em;
						}

						/* On crée le bouton switch pour les filtres */
						input[type='checkbox'].switch
						{
							display: inline-block;
							appearance:none;
							text-align: center;
							font-size: 2em;
							background: #777;
							transform: translate(0em,.2em) ;
							box-shadow: 0 0 0 var(--vf-txt-c), .3em 0 0 var(--vf-txt-c), .6em 0 0 var(--vf-txt-c);
						}
						input[type='checkbox'].switch:checked
						{
							transform: translate(1em,.2em) ;
							box-shadow: 0 0 0 var(--vf-txt-c), -.3em 0 0 var(--vf-txt-c), -.6em 0 0 var(--vf-txt-c);
							background: var(--vf-active-c)
						}
						`,
		// Constructeur pour la feuille de styles
		mkstyles : function()
				{
					const s = D.createElement('style');
					s.type = 'text/css';
					s.id = 'video-fx-theme';
					s.innerHTML = V.theme;
					return s;
					// D.getElementsByTagName('head')[0].appendChild(s);
				},


		// Make element draggable
		// @see https://stackoverflow.com/questions/65022204/make-a-popup-modal-dialog-movable-draggable-once-it-has-appeared
		draggable: function(el)
		{
			var
				p1 = p2 = p3 = p4 = 0;

			// el.querySelector("header")
			V.header.onmousedown = startDrag;

			function startDrag(e)
			{
				e = e || W.event;
				e.preventDefault();
				// Get the mouse cursor position at startup
				p3 = e.clientX;
				p4 = e.clientY;
				D.onmouseup = stopDrag;
				// Call a function whenever the cursor moves
				D.onmousemove = drag;
			}

			function drag(e)
			{
				e = e || W.event;
				e.preventDefault();
				// Calculate the new cursor position
				p1 = p3 - e.clientX;
				p2 = p4 - e.clientY;
				p3 = e.clientX;
				p4 = e.clientY;
				// Set the element's new position:
				el.style.top = (el.offsetTop - p2) + "px";
				el.style.left = (el.offsetLeft - p1) + "px";
			}

			function stopDrag()
			{
				// Stop moving when mouse button is released
				D.onmouseup = D.onmousemove = null;
			}
		}
}

})( window, document );


// Appliquer
// @see: https://addons.mozilla.org/fr/firefox/addon/greasemonkey/

if(document.location.host==="www.youtube.com")
	videoFx.init();

// @todo: extend to embed and other player