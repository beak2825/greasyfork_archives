// ==UserScript==
// @name         FC - Hitman
// @license MIT
// @namespace    https://greasyfork.org/es/scripts/14670-fc-hitman
// @version      2.4
// @description  Borra los temas (políticos, fútbol, apuestas, etc..) que quieras de Forocoches (FC)
// @author       DonNadie
// @match        http://*.forocoches.com/*
// @match        https://*.forocoches.com/*
// @match        http://www.forocoches.com/*
// @match        https://www.forocoches.com/*
// @exclude      http://www.forocoches.com/foro/private.php*
// @exclude      https://*.forocoches.com/foro/private.php*
// @exclude      http://*.forocoches.com/foro/private.php*
// @exclude      http://www.forocoches.com/foro/newthread.php*
// @exclude      https://*.forocoches.com/foro/newthread.php*
// @exclude      http://*.forocoches.com/foro/newthread.php*
// @exclude      http://www.forocoches.com/foro/newreply.php*
// @exclude      https://*.forocoches.com/foro/newreply.php*
// @exclude      http://*.forocoches.com/foro/newreply.php*
// @exclude      http://www.forocoches.com/foro/showthread.php?t=*
// @exclude      https://*.forocoches.com/foro/showthread.php?t=*
// @exclude      http://*.forocoches.com/foro/showthread.php?t=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14670/FC%20-%20Hitman.user.js
// @updateURL https://update.greasyfork.org/scripts/14670/FC%20-%20Hitman.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

class Hitman {

    constructor() {
        this.words = {
            politics: ["ayuso", "vox", "partido popular", " C'S", "votado", "podemita","pudremitas", "riverita", "peperro","político", "Saenz de Santamaria", "Sáenz de Santamaría", "votantes", "pdr snchz", "partidos politicos", "partidos políticos", "partido político", "partido politico", "Pedro Sánchez", "Pedro Sanchez", "rajoy","soraya", "falange", "pableras", "upyd", "coletas","psoe","debate", "carmena", "voto", "pablemos", "ciudadanos", "ciutadans", "discurso", "albert", "rivera", "iglesias", "elecciones", "votar", "votación", "votacion", "pedro sanchez", "pedro sánchez", "podemos", "podemitas", " pp"],
            catalan: ["lazis", "independencia", "puigdemont", " cup", "catalufos", "pantumaker", "indepes", "pruses", "prusés", "tv3", "cataluña", "catalunya", "catalanes", "pugdemon", "catalana", "independentista", "catalán", "catalan"],
            consoles: ["PlayStation", "XBOX", "PS5", "Xbox", "Ps5", "xbox", "ps5"],
            football: ["Peña Real Valladolid","Peña Bética", "Peña Athletic", "PEÑA COLCHONERA", "PENYA BLAUGRANA", "piqué", "PEÑA CELTISTA", "real madrid", "futbol", "fútbol", "porra", "apuesta", "penya culer", "peña culer", "culers", "culeros", "culerdos", "FC Barcelona", "barça", "Barsa", "atleti", "PEÑA VALENCIANISTA", "merengue", "penya culer", "Real Sporting"],
            vaccines: ["vacuna", "pcr"]
        };
        this.censorList = [];

        if (document.getElementById('vB_Editor_001_iframe') != null) {
		       return;
		}
		this.getCensoredWords();
		this.removeThreads();
		this.setupPanel();
    }

	setupPanel () {
        let td = document.createElement('td');
        td.innerHTML = '<div id="hitman-config" title="Configuración de Hitman (borrado de temas)">Hitman</div>';

		document.querySelector(".cajasprin:nth-of-type(1) tr tr").append(td);

		this.parseTemplate(function()
		{/* <div>
			<div id="hitman-panel">
				Esconder temas de:
				<ul>
					<li>
						<label>
							<input type="checkbox" value="politics"> Política
						</label>
					</li>
					<li>
						<label>
							<input type="checkbox" value="football"> Fútbol
						</label>
					</li>
					<li>
						<label>
							<input type="checkbox" value="catalan"> Cataluña
						</label>
					</li>
                    <li>
						<label>
							<input type="checkbox" value="consoles"> Consolas
						</label>
					</li>
                    <li>
						<label>
							<input type="checkbox" value="vaccines"> Vacunas
						</label>
					</li>
					<li>
						<br>
						<label>
							Filtro propio:<br>
							<textarea name="hitman-custom" placeholder="gore,movistar"></textarea>
						</label>
					</li>
				</ul>
				<button>Guardar cambios</button>
				<br>
				<a href="https://greasyfork.org/es/scripts/14670-fc-hitman/versions">Ver actualizaciones</a>
			</div>
			<style>
				#hitman-config {
					cursor: pointer;
					color: #1CC4F9;
				}
				#hitman-panel {
					display: none;
					position: fixed;
				    background: white;
				    padding: 5px;
				    border: 1px solid;
				    margin-left: 74%;
				    margin-top: 6%;
				}
				#hitman-panel  ul {
					list-style-type: none;
			    	padding: 0px;
			    	margin-top: 0px;
				}
			</style>
            </div>
		*/}).then($html => {
            document.body.prepend($html);

            const $hitmanPanel = document.getElementById("hitman-panel");

            document.getElementById("hitman-config").addEventListener("click", () => {
                $hitmanPanel.style.display = $hitmanPanel.style.display === 'block' ? 'none' : 'block';
            });

            $hitmanPanel.querySelectorAll("input").forEach(el => {
                el.addEventListener("change", () => {
                    this.updateCensor(el.value, el.checked);
                });
            })

            $hitmanPanel.querySelector("textarea").addEventListener("change", (e) => {
                this.updateCensor("custom", e.srcElement.value);
            })

            $hitmanPanel.querySelector("button").addEventListener("click", () => {
                location.reload();
            });

            this.loadConfig();
        });
	}

	loadConfig () {
		const config = this.getConfig();
        let k;

		for (k in config) {
			if (config[k]) {
				if (k == "custom") {
					document.querySelector('#hitman-panel textarea[name="hitman-custom"]').value = config[k];
				} else {
					document.querySelector("#hitman-panel input[value=" + k + "]").checked = true;
				}
			}
		}
	}
	parseTemplate (func) {
        return new Promise((resolve, deny) => {
            let div = document.createElement('div');
            div.innerHTML = func.toString().replace(/^[^\/]+\/\*!?/, '').replace(/\*\/[^\/]+$/, '');
            resolve(div.firstElementChild);
        });
	}

	updateCensor (type, status) {
		let config = this.getConfig();

		config[type] = status;

		this.setConfig(config);
	}

	getConfig () {
		let config = localStorage.hitman;

		if (config === undefined) {
			// default config
			return {
				politics: true,
			};
		}
		return JSON.parse(config);
	}

	setConfig (config) {
		localStorage.hitman = JSON.stringify(config);
	}

	// find and delete threads containing the censored words
	removeThreads () {
        let $mainForum = null;

        document.querySelectorAll('#threadslist tbody').forEach(el => {
            if (el.id.includes("threadbits_forum_")) {
                $mainForum = el;
            }
        });

		if ($mainForum != null)
		{
			let deletedCount = 0;

			this.parseTemplate(function(){/*
            <table><tbody>
				<tr class="hitman-separator">
					<td></td>
					<td></td>
  					<td></td>
				  	<td></td>
				  	<td></td>
				</tr>
				<tr class="hitman-separator">
					<td></td>
					<td></td>
  					<td><a id="hitman-next-page" href="#">Siguiente página &gt;</a></td>
				  	<td></td>
				  	<td></td>
				</tr>
				<tr class="hitman-separator">
					<td></td>
					<td></td>
  					<td></td>
				  	<td></td>
				  	<td></td>
				</tr>
				<tr class="hitman-separator">
					<td class="thead"></td>
					<td class="thead"></td>
  					<td class="thead">&nbsp;</td>
				  	<td class="thead"></td>
				  	<td class="thead"></td>
				</tr>
				<tr class="hitman-separator">
					<td class="tcat"></td>
					<td class="tcat"></td>
					<td class="tcat">Posts eliminados por Hitman</td>
				  	<td class="tcat" id="hitman-count" align="right">0</td>
				  	<td class="tcat"></td>
				</tr>
				<tr class="hitman-separator">
				    <td class="thead" colspan="2" width="57">&nbsp;</td>
				    <td class="thead" width="100%">
				        <span style="float:right"><a href="#" rel="nofollow">Calificación</a> </span>
				        <a href="#">Tema</a> /
				        <a href="#" rel="nofollow">Autor</a>
				    </td>
				    <td class="thead" width="150" align="center" nowrap="nowrap"><span style="white-space:nowrap"><a href="#">Último Mensaje</a></span></td>
				    <td class="thead" align="center" nowrap="nowrap">
				    	<span style="white-space:nowrap">
				    		<a href="#" rel="nofollow" title="Respuestas">R.</a> </span> / <span style="white-space:nowrap"><a href="#" rel="nofollow" title="Visitas">V.</a>
				    	</span>
				    </td>
				</tr>
            </tbody></table>
			*/}).then($html => {
                [...$html.firstElementChild.children].forEach(el => {
                    $mainForum.append(el);
                });

                // General section
                document.querySelectorAll('#' + $mainForum.id + ' tr:not(.hitman-separator)').forEach($tr => {
                    const intro = $tr.querySelector("td[title]").title;
                    let censoredWord = false,
                        $title;
                    $tr.querySelectorAll('td[title] a[id]').forEach(el => {
                        if (el.id.includes("thread_title_")) {
                            $title = el;
                        }
                    });

                    if ($title.innerText.length == 0) {
                        return true;
                    }

                    censoredWord = this.mustBeRemoved($title.innerText + " " + intro);

                    if (censoredWord !== false)
                    {
                        $tr.style.opacity = 0.2;
                        $title.append(" (" + censoredWord + ")");

                        // move tr to bottom
                        $mainForum.append($tr);
                        deletedCount++;
                    }
                });

                document.getElementById('hitman-count').innerText = deletedCount;
                document.getElementById('hitman-next-page').href = document.querySelector('a[rel="next"]').href;
            });
		} else if(document.querySelector('.cajasnews') != null) { // Homepage
			document.querySelectorAll('table[border="0"][cellpadding="2"][cellspacing="0"][width="100%"]')[3].querySelectorAll('tr:not([bgcolor="#f5f5f5"])').forEach((el) =>
			{
				const $thread = el.querySelectorAll('td[align="left"] a')[1],
					text = $thread.innerText + " " + $thread.title;

				if (this.mustBeRemoved(text)) {
					el.remove();
				}
			});
		}
	}

	getCensoredWords () {
		if (this.censorList.length > 0) {
			return this.censorList;
		}

		const config = this.getConfig();
        let k;

		// setup the word censorship list
		for (k in config) {
			if (config[k]) {
				if (k == "custom" && config[k].length > 0) {
					this.censorList = this.censorList.concat(config[k].split(","));
				} else {
					this.censorList = this.censorList.concat(this.words[k]);
				}
			}
		}
		return this.censorList;
	}

	mustBeRemoved (text) {
		let regex,
			k;

		for (k in this.censorList)
		{
            if (this.censorList[k].length < 1) {
                continue;
            }
			regex = new RegExp(this.censorList[k], "i");

			if (text.search(regex) !== -1) {
				return this.censorList[k];
			}
		}
		return false;
	}
}

new Hitman();