// ==UserScript==
// @name         5etoolsR20
// @namespace    https://github.com/astranauta/
// @license      MIT (https://opensource.org/licenses/MIT)
// @version      0.5.18
// @description  Enhance your Roll20 experience
// @author       5egmegaanon/astranauta/MrLabRat/TheGiddyLimit
// @match        https://app.roll20.net/editor/
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/35601/5etoolsR20.user.js
// @updateURL https://update.greasyfork.org/scripts/35601/5etoolsR20.meta.js
// ==/UserScript==



var D20plus = function(version) {

	var monsterdataurl = "https://raw.githubusercontent.com/astranauta/astranauta.github.io/master/data/bestiary.json";
	var monsterdataurlTob = "https://raw.githubusercontent.com/astranauta/astranauta.github.io/master/data/bestiary-tob.json";
	var spelldataurl = "https://raw.githubusercontent.com/astranauta/astranauta.github.io/master/data/spells.json";
	var itemdataurl = "https://raw.githubusercontent.com/astranauta/astranauta.github.io/master/data/items.json";
	var jsUtilsUrl = "https://raw.githubusercontent.com/astranauta/astranauta.github.io/master/js/utils.js";
	var jsRenderUrl = "https://raw.githubusercontent.com/astranauta/astranauta.github.io/master/js/entryrender.js";

	var d20plus = {
		sheet: "ogl",
		version: version,
		timeout: 500,
		remaining: 0,
		scriptsLoaded: false,
		monsters: {},
		spells: {},
		items: {},
		initiative: {}
	};

	// Window loaded
	window.onload = function() {
		window.unwatch("d20");

		var checkLoaded = setInterval(function() {
			if (!$("#loading-overlay").is(":visible")) {
				clearInterval(checkLoaded);
				d20plus.Init();
			}
		}, 1000);
	};

	// Page fully loaded and visible
	d20plus.Init = function() {
		d20plus.log("> Init (v" + d20plus.version + ")");
		d20plus.bindDropLocations();

		// Firebase will deny changes if we're not GM. Better to fail gracefully.
		if (window.is_gm) {
			d20plus.log("> Is GM");
		} else {
			d20plus.log("> Not GM. Exiting.");
			return;
		}

		d20plus.log("> Add JS");
		d20plus.addScripts();

		d20plus.log("> Add CSS");
		_.each(d20plus.cssRules, function(r) {
			d20plus.addCSS(window.document.styleSheets[window.document.styleSheets.length - 1], r.s, r.r);
		});

		d20plus.log("> Add HTML");
		d20plus.addHTML();
		d20plus.setSheet();

		d20plus.log("> Bind Graphics");
		d20.Campaign.pages.each(d20plus.bindGraphics);
		d20.Campaign.activePage().collection.on("add", d20plus.bindGraphics);
	};

	// Bind Graphics Add on page
	d20plus.bindGraphics = function(page) {
		try {
			if (page.get("archived") == false) {
				page.thegraphics.on("add", function(e) {
					var character = e.character;
					if (character) {
						var npc = character.attribs.find(function(a) {
								return a.get("name").toLowerCase() == "npc";
							}),
							isNPC = npc ? parseInt(npc.get("current")) : 0;
						if (isNPC) {
							var hpf = character.attribs.find(function(a) {
								return a.get("name").toLowerCase() == "npc_hpformula";
							});
							if (hpf) {
								var hpformula = hpf.get("current");
								if (hpformula) {
									d20plus.randomRoll(hpformula, function(result) {
										e.attributes.bar3_value = result.total;
										e.attributes.bar3_max = result.total;
										d20plus.log("> Rolled HP for [" + character.get("name") + "]");
									}, function(error) {
										d20plus.log("> Error Rolling HP Dice");
										console.log(error);
									});
								}
							}
						}
					}
				});
			}
		} catch (e) {
			console.log("D20Plus bindGraphics Exception", e);
			console.log("PAGE", page);
		}
	};

	// Create new Journal commands
	d20plus.addJournalCommands = function() {
		var $selector = $("#journalitemmenu ul li"),
			first = $selector.first();

		first.after("<li data-action-type=\"cloneitem\">Duplicate</li>");
		first.after("<li style=\"height: 10px;\">&nbsp;</li>");
		$("#journalitemmenu ul").on(window.mousedowntype, "li[data-action-type=cloneitem]", function() {
			var id = $currentItemTarget.attr("data-itemid"),
				character = d20.Campaign.characters.get(id),
				handout = d20.Campaign.handouts.get(id);

			d20plus.log("> Duplicating..");

			if (character) {
				character.editview.render();
				character.editview.$el.find("button.duplicate").trigger("click");
			}

			if (handout) {
				handout.view.render();
				var json = handout.toJSON();
				delete json.id;
				json.name = "Copy of " + json.name;
				handout.collection.create(json, {
					success: function(h) {
						handout._getLatestBlob("gmnotes",
							function(gmnotes) {
								h.updateBlobs({
									gmnotes: gmnotes
								});
							}
						);
						handout._getLatestBlob("notes",
							function(notes) {
								h.updateBlobs({
									notes: notes
								});
							}
						);
					}
				});
			}
		});
	};

	// Determine difficulty of current encounter (iniativewindow)
	d20plus.getDifficulty = function() {
		var difficulty = "Unknown",
			partyXPThreshold = [0, 0, 0, 0],
			players = [],
			npcs = [];

		try {
			$.each(d20.Campaign.initiativewindow.cleanList(), function(i, v) {
				var token, char,
					page = d20.Campaign.pages.get(v._pageid);
				if (page) token = page.thegraphics.get(v.id);
				if (token) char = token.character;
				if (char) {
					var npc = char.attribs.find(function(a) {
						return a.get("name").toLowerCase() === "npc";
					});
					if (npc && npc.get("current") == "1") {
						npcs.push(char);
					} else {
						var level = char.attribs.find(function(a) {
							return a.get("name").toLowerCase() === "level";
						});
						// Can't determine difficulty without level
						if (!level || partyXPThreshold == null) {
							partyXPThreshold = null;
							return;
						}

						// Total party threshold
						for (i = 0; i < partyXPThreshold.length; i++) {
							partyXPThreshold[i] += d20plus.getXPbyLevel(level.get("current"))[i];
						}
						players.push(players.length + 1);
					}
				}
			});

			if (!players.length) {
				return difficulty;
			}

			// If a player doesn't have level set, fail out.
			if (partyXPThreshold !== null) {
				var len = npcs.length,
					multiplier = 0,
					adjustedxp = 0,
					xp = 0,
					index = 0;

				// Adjust for number of monsters
				if (len < 2) index = 0;
				else
				if (len < 3) index = 1;
				else
				if (len < 7) index = 2;
				else
				if (len < 11) index = 3;
				else
				if (len < 15) index = 4;
				else
					index = 5;

				// Adjust for smaller parties
				if (players.length < 3)
					index++;

				// Set multiplier
				multiplier = d20plus.multipliers[index];

				// Total monster xp
				$.each(npcs, function(i, v) {
					var cr = v.attribs.find(function(a) {
						return a.get("name").toLowerCase() === "npc_challenge";
					});
					if (cr) {
						xp += parseInt(d20plus.getXPbyCR(cr.get("current")));
					}
				});

				// Encounter's adjusted xp
				adjustedxp = xp * multiplier;

				console.log("Party XP Threshold", partyXPThreshold);
				console.log("Adjusted XP", adjustedxp);

				// Determine difficulty
				if (adjustedxp < partyXPThreshold[0]) difficulty = "Trivial";
				else
				if (adjustedxp < partyXPThreshold[1]) difficulty = "Easy";
				else
				if (adjustedxp < partyXPThreshold[2]) difficulty = "Medium";
				else
				if (adjustedxp < partyXPThreshold[3]) difficulty = "Hard";
				else
					difficulty = "Deadly";
			}

		} catch (e) {
			console.log("D20Plus getDifficulty Exception", e);
		}

		return difficulty;
	};

	// Determine if folder contains monster by that name
	d20plus.objectExists = function(folderObj, folderId, name) {
		var container = folderObj.find(function(a) {
			return a.id == folderId;
		});
		result = false;

		$.each(container.i, function(i, v) {
			var char = d20.Campaign.characters.get(v);
			var handout = d20.Campaign.handouts.get(v);
			if (char && char.get("name") === name) result = true;
			if (handout && handout.get("name") === name) result = true;
		});
		return result;
	};

	// Find and delete object in folder of given name
	d20plus.deleteObject = function(folderObj, folderId, name) {
		var container = folderObj.find(function(a) {
			return a.id == folderId;
		});
		result = false;

		$.each(container.i, function(i, v) {
			var char = d20.Campaign.characters.get(v);
			var handout = d20.Campaign.handouts.get(v);
			if (char && char.get("name") === name) {
				char.destroy();
				result = true;
			}
			if (handout && handout.get("name") === name) {
				handout.destroy();
				result = true;
			}

		});
		return result;
	};

	// Inject HTML
	d20plus.addHTML = function() {
		$("#mysettings > .content").children("hr").first().before(d20plus.settingsHtml);

		$("#mysettings > .content #button-monsters-select").change(function() { $("#import-monster-url").val(this.value); });
		$("#mysettings > .content a#button-monsters-load").on(window.mousedowntype, d20plus.monsters.button);
		$("#mysettings > .content a#button-spells-load").on(window.mousedowntype, d20plus.spells.button);
		$("#mysettings > .content a#import-items-load").on(window.mousedowntype, d20plus.items.button);
		$("#mysettings > .content a#bind-drop-locations").on(window.mousedowntype, d20plus.bindDropLocations);

		$("#initiativewindow .characterlist").before(d20plus.initiativeHeaders);

		d20plus.getInitTemplate();

		d20.Campaign.initiativewindow.rebuildInitiativeList();
		d20plus.hpAllowEdit();

		d20.Campaign.initiativewindow.model.on("change:turnorder", function() {
			d20plus.updateDifficulty();
		});
		d20plus.updateDifficulty();

		d20plus.addJournalCommands();

		const altBindButton = $(`<button id="bind-drop-locations-alt" class="btn bind-drop-locations" href="#" title="Bind drop locations and handouts" style="margin-right: 0.5em;">Bind</button>`);
		altBindButton.on("click", function(){d20plus.bindDropLocations()});
		$("#journal > .content:eq(1) > button.btn.superadd").after(altBindButton);
		$("#journal > .content:eq(1) btn#bind-drop-locations").on(window.mousedowntype, d20plus.bindDropLocations);

		$("body").append(d20plus.importDialogHtml);
		$("body").append(d20plus.importListHTML);
		$("#d20plus-import").dialog({
			autoOpen: false,
			resizable: false
		});
		$("#d20plus-importlist").dialog({
			autoOpen: false,
			resizable: true
		});

		// Removed until I can figure out a way to show the new version without the certificate error
		/*$("body").append(d20plus.dmscreenHtml);
	var $dmsDialog = $("#dmscreen-dialog");
	$dmsDialog.dialog({
	title: "DM Screen",
	width: 700,
	height: 515,
	autoOpen: false
});

$("#floatingtoolbar > ul").append(d20plus.dmscreenButton);
$("#dmscreen-button").on(window.mousedowntype, function(){
if($dmsDialog.dialog("isOpen"))
$dmsDialog.dialog("close");
else
$dmsDialog.dialog("open");
});*/
	};

	d20plus.updateDifficulty = function() {
		var $span = $("div#initiativewindow").parent().find(".ui-dialog-buttonpane > span.difficulty");
		var $btnpane = $("div#initiativewindow").parent().find(".ui-dialog-buttonpane");
		if (!$span.length) {
			$btnpane.prepend(d20plus.difficultyHtml);
			$span = $("div#initiativewindow").parent().find(".ui-dialog-buttonpane > span.difficulty");
		}
		$span.text("Difficulty: " + d20plus.getDifficulty());
	};

	// Inject external JS libraries
	d20plus.addScripts = function() {
		$.each(d20plus.scripts, function(i, v) {
			$.ajax({
				type: "GET",
				url: v.url,
				success: function(js) {
					try {
						window.eval(js);
						d20plus.log("> JS [" + v.name + "] Loaded");
					} catch (e) {
						d20plus.log("> Error loading " + v.name);
					}
				}
			});
		});
	};

	// bind drop locations on sheet to accept custom handouts
	d20plus.bindDropLocations = function() {

		// first off: bind Spells and Items, add compendium-item to each of them
		var journalFolder = d20.Campaign.get("journalfolder");
		if (journalFolder === "") {
			d20.journal.addFolderToFolderStructure("Spells");
			d20.journal.addFolderToFolderStructure("Items");
			d20.journal.refreshJournalList();
			journalFolder = d20.Campaign.get("journalfolder");
		}
		var journalFolderObj = JSON.parse(journalFolder);

		var handouts = journalFolderObj.find(function(a) {
			return a.n && (a.n == "Spells" || a.n == "Items")
		});

		$("#journalfolderroot > ol.dd-list > li.dd-folder > div.dd-content:contains('Spells')").parent().find("ol li[data-itemid]").addClass("compendium-item").addClass("ui-draggable");
		$("#journalfolderroot > ol.dd-list > li.dd-folder > div.dd-content:contains('Items')").parent().find("ol li[data-itemid]").addClass("compendium-item").addClass("ui-draggable");

		d20.Campaign.characters.models.each(function(v, i) {
			v.view.rebindCompendiumDropTargets = function() {
				// ready character sheet for draggable
				$(".sheet-compendium-drop-target").each(function() {
					$(this).droppable({
						hoverClass: "dropping",
						tolerance: "pointer",
						activeClass: "active-drop-target",
						accept: ".compendium-item",
						drop: function(t, i) {
							var characterid = $(".characterdialog").has(t.target).attr("data-characterid");
							var character = d20.Campaign.characters.get(characterid).view;
							if ($(i.helper[0]).hasClass("handout")) {
								console.log("Handout item dropped onto target!");
								t.originalEvent.dropHandled = !0;
								var id = $(i.helper[0]).attr("data-itemid");
								var handout = d20.Campaign.handouts.get(id);
								console.log(character);
								var data = "";

								handout._getLatestBlob("gmnotes", function(gmnotes) {
									data = gmnotes;
									handout.updateBlobs({
										gmnotes: gmnotes
									});
									data = JSON.parse(data);
									inputData = data.data;
									inputData.Name = data.name;
									inputData.Content = data.content;

									const r = $(t.target);
									r.find("*[accept]").each(function() {
										const $this = $(this);
										const acceptTag = $this.attr("accept");

										if (inputData[acceptTag] !== undefined) {
											if ("input" === this.tagName.toLowerCase()) {
												if ("checkbox" === $this.attr("type")) {
													if (inputData[acceptTag]) {
														$this.attr("checked", "checked")
													} else {
														$this.removeAttr("checked")
													}
												} else if ("radio" === $this.attr("type")) {
													if (inputData[acceptTag]) {
														$this.attr("checked", "checked")
													} else {
														$this.removeAttr("checked")
													}
												} else {
													$this.val(inputData[acceptTag]);
												}
											} else if ("select" === this.tagName.toLowerCase()) {
												$this.find("option").each(function () {
													const $this = $(this);
													if ($this.attr("value") === inputData[acceptTag] || $this.text() === inputData[acceptTag]) {
														$this.attr("selected", "selected")
													}
												})
											} else {
												$this.val(inputData[acceptTag]);
											}

											// persist the value
											character.saveSheetValues(this);
										}
									});
								});
							} else {
								console.log("Compendium item dropped onto target!"), t.originalEvent.dropHandled = !0;
								var inputData = $(i.helper[0]).attr("data-pagename");
								console.log("https://app.roll20.net/compendium/" + COMPENDIUM_BOOK_NAME + "/" + inputData + ".json?plaintext=true"), $.get("https://app.roll20.net/compendium/" + COMPENDIUM_BOOK_NAME + "/" + inputData + ".json?plaintext=true", function(i) {
									var n = i.data;
									n.Name = i.name, n.Content = i.content;
									var r = $(t.target);
									r.find("*[accept]").each(function() {
										var t = $(this),
											i = t.attr("accept");
										n[i] && ("input" === t[0].tagName.toLowerCase() && "checkbox" === t.attr("type") ? t.attr("value") == n[i] ? t.attr("checked", "checked") : t.removeAttr("checked") : "input" === t[0].tagName.toLowerCase() && "radio" === t.attr("type") ? t.attr("value") == n[i] ? t.attr("checked", "checked") : t.removeAttr("checked") : "select" === t[0].tagName.toLowerCase() ? t.find("option").each(function() {
											var e = $(this);
											(e.attr("value") === n[i] || e.text() === n[i]) && e.attr("selected", "selected")
										}) : $(this).val(n[i]), character.saveSheetValues(this))
									})
								})
							}
						}
					})
				})
			}
		})
	};

	// Import monsters button click event
	// d20plus.buttonMonsterClicked = function() {
	d20plus.monsters.button = function() {
		var url = $("#import-monster-url").val();
		if (url != null) {
			d20plus.monsters.load(url);
		}
	};

	// Fetch monster data from XML url and import it
	d20plus.monsters.load = function(url) {
		$("a.ui-tabs-anchor[href='#journal']").trigger("click");
		var x2js = new X2JS();
		var datatype = $("#import-datatype").val();
		if (datatype === "json") datatype = "text";
		$.ajax({
			type: "GET",
			url: url,
			dataType: datatype,
			success: function(data) {
				try {
					d20plus.log("Importing Data (" + $("#import-datatype").val().toUpperCase() + ")");
					monsterdata = (datatype === "XML") ? x2js.xml2json(data) : JSON.parse(data.replace(/^var .* \= /g, ""));

					var length = monsterdata.monster.length;

					monsterdata.monster.sort(function(a,b) {
						if (a.name < b.name) return -1;
						if (a.name > b.name) return 1;
						return 0;
					});

					// building list for checkboxes
					$("#import-list .list").html("");
					$.each(monsterdata.monster, function(i, v) {
						try {
							$("#import-list .list").append(`<label><input type="checkbox" data-listid="` + i + `"> <span class="name">` + v.name + `</span></label>`);
						} catch (e) {
							console.log("Error building list!", e);
							d20plus.addImportError(v.name);
						}
					});

					var options = {
						valueNames: [ 'name' ]
					}

					var importList = new List ("import-list", options);

					$("#import-options label").hide();
					$("#import-overwrite").parent().show();
					$("#import-monster-organizebysource").parent().show();

					$("#d20plus-importlist").dialog("open");

					$("#d20plus-importlist input#importlist-selectall").unbind("click");
					$("#d20plus-importlist input#importlist-selectall").bind("click", function() {
						$("#import-list .list input").prop("checked", $(this).prop("checked"));
					});

					$("#d20plus-importlist button").unbind("click");
					$("#d20plus-importlist button#importstart").bind("click", function() {
						$("#d20plus-importlist").dialog("close");
						$("#import-list .list input").each(function() {
							if (!$(this).prop("checked")) return;
							var monsternum = parseInt($(this).data("listid"));
							var curmonster = monsterdata.monster[monsternum];
							try {
								console.log("> " + (monsternum + 1) + "/" + length + " Attempting to import monster [" + curmonster.name + "]");
								d20plus.monsters.import(curmonster);
							} catch (e) {
								console.log("Error Importing!", e);
								d20plus.addImportError(curmonster.name);
							}
						});
					});
				} catch (e) {
					console.log("> Exception ", e);
				}
			},
			error: function(jqXHR, exception) {
				var msg = "";
				if (jqXHR.status === 0) {
					msg = "Could not connect.\n Check Network";
				} else if (jqXHR.status == 404) {
					msg = "Page not found [404]";
				} else if (jqXHR.status == 500) {
					msg = "Internal Server Error [500]";
				} else if (exception === 'parsererror') {
					msg = "Data parse failed";
				} else if (exception === 'timeout') {
					msg = "Timeout";
				} else if (exception === 'abort') {
					msg = "Request aborted";
				} else {
					msg = "Uncaught Error.\n" + jqXHR.responseText;
				}
				d20plus.log("> ERROR: " + msg);
			}
		});

		d20plus.timeout = 500;
	};

	// Create monster character from js data object
	d20plus.monsters.import = function(data) {
		var typeArr = data.type.split(",");
		var source = ($("#import-monster-organizebysource").prop("checked")) ? typeArr[typeArr.length - 1] : typeArr[0].toLowerCase().replace(/\((any race)\)/g, "");
		var fname = source.trim().capFirstLetter(),
			findex = 1,
			folder;

		d20.journal.refreshJournalList();
		var journalFolder = d20.Campaign.get("journalfolder");
		if (journalFolder === "") {
			d20.journal.addFolderToFolderStructure("Characters");
			d20.journal.refreshJournalList();
			journalFolder = d20.Campaign.get("journalfolder");
		}
		var journalFolderObj = JSON.parse(journalFolder),
			monsters = journalFolderObj.find(function(a) {
				return a.n && a.n == "Monsters"
			});

		if (!monsters) {
			d20.journal.addFolderToFolderStructure("Monsters");
		}

		d20.journal.refreshJournalList();
		journalFolder = d20.Campaign.get("journalfolder");
		journalFolderObj = JSON.parse(journalFolder);
		monsters = journalFolderObj.find(function(a) {
			return a.n && a.n == "Monsters"
		});

		var name = data.name || "(Unknown Name)";

		// check for duplicates
		var dupe = false;
		$.each(monsters.i, function(i, v) {
			if (d20plus.objectExists(monsters.i, v.id, name)) dupe = true;
			if ($("#import-overwrite").prop("checked")) d20plus.deleteObject(monsters.i, v.id, name);
		});
		if (dupe) {
			console.log("Already Exists");
			if (!$("#import-overwrite").prop("checked")) return;
		}

		var timeout = 0;

		d20plus.remaining++;
		if (d20plus.timeout == 500) {
			$("#d20plus-import").dialog("open");
			$("#import-remaining").text(d20plus.remaining);
		}
		timeout = d20plus.timeout;
		d20plus.timeout += 2500;

		setTimeout(function() {
			d20plus.log("Running import of [" + name + "]");
			$("#import-remaining").text(d20plus.remaining);
			$("#import-name").text(name);

			d20.journal.refreshJournalList();
			journalFolder = d20.Campaign.get("journalfolder");
			journalFolderObj = JSON.parse(journalFolder);
			monsters = journalFolderObj.find(function(a) {
				return a.n && a.n == "Monsters"
			});

			for (i = -1; i < monsters.i.length; i++) {
				var theFolderName = (findex == 1) ? fname : fname + " " + findex;
				folder = monsters.i.find(function(f) {
					return f.n == theFolderName;
				});
				if (folder) {
					if (folder.i.length >= 90) {
						findex++;
					} else {
						break;
					}
				} else {
					d20.journal.addFolderToFolderStructure(theFolderName, monsters.id);
					d20.journal.refreshJournalList();
					journalFolder = d20.Campaign.get("journalfolder");
					journalFolderObj = JSON.parse(journalFolder);
					monsters = journalFolderObj.find(function(a) {
						return a.n && a.n == "Monsters"
					});
					folder = monsters.i.find(function(f) {
						return f.n == theFolderName;
					});
					break;
				}
			}

			if (!folder) {
				console.log("> Failed to find or create source folder!");
				return;
			}

			d20.Campaign.characters.create({
				name: name
			}, {
				success: function(character) {
					/* OGL Sheet */
					try {
						
						let type = data.type;
						let source = data.source;

						let avatar = "https://astranauta.github.io/img/" + source + "/" + name + ".png";

						character.size = data.size;
						character.name = name;
						character.senses = data.senses;
						character.hp = data.hp.match(/^\d+/);

						$.ajax({
							url: avatar,
							type: 'HEAD',
							error: function() {
								//file not exists
								getSetAvatarImage("https://astranauta.github.io/img/blank.png");
							},
							success: function() {
								//file exists
								getSetAvatarImage(avatar);
							}
						});

						function getSetAvatarImage(avatar) {
							character.attributes.avatar = avatar;

							var tokensize = 1;
							if (character.size === "T") tokensize = 1;
							if (character.size === "L") tokensize = 2;
							if (character.size === "H") tokensize = 3;
							if (character.size === "G") tokensize = 4;

							var lightradius = 5;
							if(character.senses && character.senses.toLowerCase().match(/(darkvision|blindsight|tremorsense|truesight)/)) {
								lightradius = Math.max.apply(Math, character.senses.match(/\d+/g));
							}

							var lightmin = 0;

							if(character.senses && character.senses.toLowerCase().match(/(blindsight|tremorsense|truesight)/)) {
								lightmin = lightradius;
							}

							var defaulttoken = {
								represents: character.id,
								name: character.name,
								showname: 1,
								imgsrc: avatar,
								width: 70 * tokensize,
								height: 70 * tokensize,
								bar2_value: data.ac.match(/^\d+/),
								bar3_value: character.hp,
								bar3_max: character.hp,
								light_hassight: true,
								light_radius: lightradius,
								light_dimradius: lightmin
							}

							character.updateBlobs({ avatar: avatar, defaulttoken: JSON.stringify(defaulttoken) });
							character.save({defaulttoken: (new Date).getTime()});
						}

						var ac = data.ac.match(/^\d+/),
							actype = /\(([^)]+)\)/.exec(data.ac),
							hp = data.hp.match(/^\d+/),
							hpformula = /\(([^)]+)\)/.exec(data.hp),
							passive = data.passive != null ? data.passive : "",
							passiveStr = passive !== "" ? "passive Perception " + passive : "",
							senses = data.senses || "",
							sensesStr = senses !== "" ? senses + ", " + passiveStr : passiveStr,
							size = d20plus.getSizeString(data.size || ""),
							alignment = data.alignment || "(Unknown Alignment)",
							cr = data.cr != null ? data.cr : "",
							xp = d20plus.getXPbyCR(cr);

						character.attribs.create({
							name: "npc",
							current: 1
						});
						character.attribs.create({
							name: "npc_toggle",
							current: 1
						});
						character.attribs.create({
							name: "npc_options-flag",
							current: 0
						});
						character.attribs.create({
							name: "wtype",
							current: "@{whispertoggle}"
						});
						character.attribs.create({
							name: "rtype",
							current: "@{advantagetoggle}"
						});
						character.attribs.create({
							name: "advantagetoggle",
							current: "{{query=1}} {{advantage=1}} {{r2=[[@{d20}"
						});
						character.attribs.create({
							name: "whispertoggle",
							current: "/w gm "
						});
						character.attribs.create({
							name: "dtype",
							current: "full"
						});
						character.attribs.create({
							name: "npc_name",
							current: name
						});
						character.attribs.create({
							name: "npc_size",
							current: size
						});
						character.attribs.create({
							name: "type",
							current: type
						});
						character.attribs.create({
							name: "npc_type",
							current: size + " " + type + ", " + alignment
						});
						character.attribs.create({
							name: "npc_alignment",
							current: alignment
						});
						character.attribs.create({
							name: "npc_ac",
							current: ac != null ? ac[0] : ""
						});
						character.attribs.create({
							name: "npc_actype",
							current: actype != null ? actype[1] || "" : ""
						});
						character.attribs.create({
							name: "npc_hpbase",
							current: hp != null ? hp[0] : ""
						});
						character.attribs.create({
							name: "npc_hpformula",
							current: hpformula != null ? hpformula[1] || "" : ""
						});
						data.npc_speed = data.speed;
						if (d20plus.sheet === "shaped") {
							data.npc_speed = data.npc_speed.toLowerCase();
							var match = data.npc_speed.match(/^\s*(\d+)\s?(ft\.?|m\.?)/);
							if (match && match[1]) {
								data.speed = match[1] + ' ' + match[2];
								character.attribs.create({
									name: "speed",
									current: match[1] + ' ' + match[2]
								});
							}
							data.npc_speed = data.speed;
							var regex = /(burrow|climb|fly|swim)\s+(\d+)\s?(ft\.?|m\.?)/g;
							var speeds = void 0;
							while ((speeds = regex.exec(data.npc_speed)) !== null) {
								character.attribs.create({
									name: "speed_"+speeds[1],
									current: speeds[2] + ' ' + speeds[3]
								});
							}
							if (data.npc_speed && data.npc_speed.includes('hover')) {
								character.attribs.create({
									name: "speed_fly_hover",
									current: 1
								});
							}
							data.npc_speed = '';
						}
						character.attribs.create({
							name: "npc_speed",
							current: data.speed != null ? data.speed : ""
						});
						character.attribs.create({
							name: "strength_base",
							current: data.str
						});
						character.attribs.create({
							name: "dexterity_base",
							current: data.dex
						});
						character.attribs.create({
							name: "constitution_base",
							current: data.con
						});
						character.attribs.create({
							name: "intelligence_base",
							current: data.int
						});
						character.attribs.create({
							name: "wisdom_base",
							current: data.wis
						});
						character.attribs.create({
							name: "charisma_base",
							current: data.cha
						});
						character.attribs.create({
							name: "passive",
							current: passive
						});
						character.attribs.create({
							name: "npc_languages",
							current: data.languages != null ? data.languages : ""
						});
						character.attribs.create({
							name: "npc_challenge",
							current: cr
						});
						character.attribs.create({
							name: "npc_xp",
							current: xp
						});
						character.attribs.create({
							name: "npc_vulnerabilities",
							current: data.vulnerable != null ? data.vulnerable : ""
						});
						character.attribs.create({
							name: "npc_resistances",
							current: data.resist != null ? data.resist : ""
						});
						character.attribs.create({
							name: "npc_immunities",
							current: data.immune != null ? data.immune : ""
						});
						character.attribs.create({
							name: "npc_condition_immunities",
							current: data.conditionImmune != null ? data.conditionImmune : ""
						});
						character.attribs.create({
							name: "npc_senses",
							current: sensesStr
						});

						if (data.save != null && data.save.length > 0) {
							var savingthrows;
							if (data.save instanceof Array) {
								savingthrows = data.save;
							} else {
								savingthrows = data.save.split(", ");
							}
							character.attribs.create({
								name: "npc_saving_flag",
								current: 1
							});
							$.each(savingthrows, function(i, v) {
								var save = v.split(" ");
								character.attribs.create({
									name: "npc_" + save[0].toLowerCase() + "_save_base",
									current: parseInt(save[1])
								});
							});
						}

						if (data.skill != null && data.skill.length > 0) {
							var skills;
							if (data.skill instanceof Array) {
								skills = data.skill[0].split(", ");
							} else {
								skills = data.skill.split(", ");
							}
							character.attribs.create({
								name: "npc_skills_flag",
								current: 1
							});
							$.each(skills, function(i, v) {
								if (v.length > 0) {
									var skill = v.match(/([\w+ ]*[^+-?\d])([+-?\d]+)/);
									character.attribs.create({
										name: "npc_" + $.trim(skill[1]).toLowerCase().replace(/ /g,"_") + "_base",
										current: parseInt($.trim(skill[2])) || 0
									});
								}
							});
						}

						if (data.trait != null) {
							if (!(data.trait instanceof Array)) {
								var tmp = data.trait;
								data.trait = [];
								data.trait.push(tmp);
							}
							$.each(data.trait, function(i, v) {
								var newRowId = d20plus.generateRowId(),
									text = "";
								character.attribs.create({
									name: "repeating_npctrait_" + newRowId + "_name",
									current: v.name
								});
								if (v.text instanceof Array) {
									$.each(v.text, function(z, x) {
										if (!x) return;
										text += (z > 0 ? "\r\n" : "") + x;
									});
								} else {
									text = v.text;
								}
								character.attribs.create({
									name: "repeating_npctrait_" + newRowId + "_desc",
									current: text
								});
							});
						}

						if (data.action != null) {
							if (!(data.action instanceof Array)) {
								var tmp = data.action;
								data.action = [];
								data.action.push(tmp);
							}

							var npc_exception_actions = ["Web (Recharge 5-6)"];
							$.each(data.action, function(i, v) {
								var newRowId = d20plus.generateRowId();

								var text = "";
								if (v.text instanceof Array) {
									$.each(v.text, function(z, x) {
										if (!x) return;
										text += (z > 0 ? "\r\n" : "") + x;
									});
								} else {
									text = v.text;
								}

								var actiontext = "";
								if (v.text instanceof Array) {
									actiontext = v.text[0];
								} else {
									actiontext = v.text;
								}

								var action_desc = actiontext; // required for later reduction of information dump.

								var rollbase = "@{wtype}&{template:npcaction} @{attack_display_flag} @{damage_flag} {{name=@{npc_name}}} {{rname=@{name}}} {{r1=[[1d20+(@{attack_tohit}+0)]]}} @{rtype}+(@{attack_tohit}+0)]]}} {{dmg1=[[@{attack_damage}+0]]}} {{dmg1type=@{attack_damagetype}}} {{dmg2=[[@{attack_damage2}+0]]}} {{dmg2type=@{attack_damagetype2}}} {{crit1=[[@{attack_crit}+0]]}} {{crit2=[[@{attack_crit2}+0]]}} {{description=@{description}}} @{charname_output}";

								// attack parsing
								if (actiontext.indexOf(" Attack:") > -1) {

									var name = v.name;

									var attacktype = "";
									var attacktype2 = "";
									if (actiontext.indexOf(" Weapon Attack:") > -1) {
										attacktype = actiontext.split(" Weapon Attack:")[0];
										attacktype2 = " Weapon Attack:";
									} else if (actiontext.indexOf(" Spell Attack:") > -1) {
										attacktype = actiontext.split(" Spell Attack:")[0];
										attacktype2 = " Spell Attack:";
									}

									var attackrange = "";
									var rangetype = ""
									if (attacktype.indexOf("Melee") > -1) {
										attackrange = (actiontext.match(/reach (.*?),/) || ["", ""])[1]
										rangetype = "Reach";
									} else {
										attackrange = (actiontext.match(/range (.*?),/) || ["", ""])[1];
										rangetype = "Range";
									}

									var tohit = (actiontext.match(/\+(.*) to hit/) || ["", ""])[1];

									var damage = "",
										damagetype = "",
										damage2 = "",
										damagetype2 = "";

									var onhit = "";

									damageregex = /\d+ \((\d+d\d+\s?(?:\+|\-)?\s?\d*)\) (\S+ )?damage/g;
									damagesearches = damageregex.exec(actiontext);
									if (damagesearches) {
										onhit = damagesearches[0];
										damage = damagesearches[1];
										damagetype = (damagesearches[2] != null) ? damagesearches[2].trim() : "";
										damagesearches = damageregex.exec(actiontext);
										if (damagesearches) {
											onhit += " plus " + damagesearches[0];
											damage2 = damagesearches[1];
											damagetype2 = (damagesearches[2] != null) ? damagesearches[2].trim() : "";
										}
									}
									onhit = onhit.trim();

									var attacktarget = (actiontext.match(/\.,(?!.*\.,)(.*)\. Hit:/) || ["", ""])[1];

									// Cut the information dump in the description
									var atk_desc_simple_regex = /Hit: \d+ \((\d+d\d+\s?(?:\+|\-)?\s?\d*)\) (\S+ )?damage\.(.*)/g;
									var atk_desc_complex_regex = /(Hit:.*)/g;

									// is it a simple attack (just 1 damage type)?
									var match_simple_atk = atk_desc_simple_regex.exec(actiontext);
									if (match_simple_atk != null) {
										//if yes, then only display special effects, if any
										action_desc = match_simple_atk[3].trim();
									} else {
										//if not, simply cut everything before "Hit:" so there are no details lost.
										var match_compl_atk = atk_desc_complex_regex.exec(actiontext);
										if (match_compl_atk != null) {
											action_desc = match_compl_atk[1].trim();
										}
									}

									var tohitrange = "+" + tohit + ", " + rangetype + " " + attackrange + ", " + attacktarget + ".";


									character.attribs.create({
										name: "repeating_npcaction_" + newRowId + "_name",
										current: name
									});
									character.attribs.create({
										name: "repeating_npcaction_" + newRowId + "_attack_flag",
										current: "on"
									});
									character.attribs.create({
										name: "repeating_npcaction_" + newRowId + "_npc_options-flag",
										current: 0
									});
									character.attribs.create({
										name: "repeating_npcaction_" + newRowId + "_attack_display_flag",
										current: "{{attack=1}}"
									});
									character.attribs.create({
										name: "repeating_npcaction_" + newRowId + "_attack_options",
										current: "{{attack=1}}"
									});
									character.attribs.create({
										name: "repeating_npcaction_" + newRowId + "_attack_tohit",
										current: tohit
									});
									character.attribs.create({
										name: "repeating_npcaction_" + newRowId + "_attack_damage",
										current: damage
									});
									character.attribs.create({
										name: "repeating_npcaction_" + newRowId + "_attack_damagetype",
										current: damagetype
									});
									character.attribs.create({
										name: "repeating_npcaction_" + newRowId + "_attack_damage2",
										current: damage2
									});
									character.attribs.create({
										name: "repeating_npcaction_" + newRowId + "_attack_damagetype2",
										current: damagetype2
									});
									character.attribs.create({
										name: "repeating_npcaction_" + newRowId + "_name_display",
										current: name
									});
									character.attribs.create({
										name: "repeating_npcaction_" + newRowId + "_rollbase",
										current: rollbase
									});
									character.attribs.create({
										name: "repeating_npcaction_" + newRowId + "_attack_type",
										current: attacktype
									});
									character.attribs.create({
										name: "repeating_npcaction_" + newRowId + "_attack_type_display",
										current: attacktype + attacktype2
									});
									character.attribs.create({
										name: "repeating_npcaction_" + newRowId + "_attack_tohitrange",
										current: tohitrange
									});
									character.attribs.create({
										name: "repeating_npcaction_" + newRowId + "_attack_range",
										current: attackrange
									});
									character.attribs.create({
										name: "repeating_npcaction_" + newRowId + "_attack_target",
										current: attacktarget
									});
									character.attribs.create({
										name: "repeating_npcaction_" + newRowId + "_damage_flag",
										current: "{{damage=1}} {{dmg1flag=1}} {{dmg2flag=1}}"
									});
									character.attribs.create({
										name: "repeating_npcaction_" + newRowId + "_attack_onhit",
										current: onhit
									});

								} else {
									character.attribs.create({
										name: "repeating_npcaction_" + newRowId + "_name",
										current: v.name
									});
									character.attribs.create({
										name: "repeating_npcaction_" + newRowId + "_npc_options-flag",
										current: 0
									});
									character.attribs.create({
										name: "repeating_npcaction_" + newRowId + "_rollbase",
										current: rollbase
									});
									character.attribs.create({
										name: "repeating_npcaction_" + newRowId + "_name_display",
										current: v.name
									});
								}

								var descriptionFlag = Math.max(Math.ceil(text.length / 57), 1);
								character.attribs.create({
									name: "repeating_npcaction_" + newRowId + "_description",
									current: action_desc
								});
								character.attribs.create({
									name: "repeating_npcaction_" + newRowId + "_description_flag",
									current: descriptionFlag
								});
							});
						}

						if (data.reaction != null) {
							if (!(data.reaction instanceof Array)) {
								var tmp = data.reaction;
								data.reaction = [];
								data.reaction.push(tmp);
							}
							character.attribs.create({
								name: "reaction_flag",
								current: 1
							});
							character.attribs.create({
								name: "npcreactionsflag",
								current: 1
							});
							$.each(data.reaction, function(i, v) {
								var newRowId = d20plus.generateRowId();
								var text = "";
								character.attribs.create({
									name: "repeating_npcreaction_" + newRowId + "_name",
									current: v.name
								});
								if (v.text instanceof Array) {
									$.each(v.text, function(z, x) {
										if (!x) return;
										text += (z > 0 ? "\r\n" : "") + x;
									});
								} else {
									text = v.text;
								}
								character.attribs.create({
									name: "repeating_npcreaction_" + newRowId + "_desc",
									current: text
								});
								character.attribs.create({
									name: "repeating_npcreaction_" + newRowId + "_description",
									current: text
								});
							});
						}

						if (data.legendary != null) {
							if (!(data.legendary instanceof Array)) {
								var tmp = data.legendary;
								data.legendary = [];
								data.legendary.push(tmp);
							}
							character.attribs.create({
								name: "legendary_flag",
								current: "1"
							});
							character.attribs.create({
								name: "npc_legendary_actions",
								current: "(Unknown Number)"
							});
							$.each(data.legendary, function(i, v) {
								var newRowId = d20plus.generateRowId(),
									actiontext = "",
									text = "";

								var rollbase = "@{wtype}&{template:npcaction} @{attack_display_flag} @{damage_flag} {{name=@{npc_name}}} {{rname=@{name}}} {{r1=[[1d20+(@{attack_tohit}+0)]]}} @{rtype}+(@{attack_tohit}+0)]]}} {{dmg1=[[@{attack_damage}+0]]}} {{dmg1type=@{attack_damagetype}}} {{dmg2=[[@{attack_damage2}+0]]}} {{dmg2type=@{attack_damagetype2}}} {{crit1=[[@{attack_crit}+0]]}} {{crit2=[[@{attack_crit2}+0]]}} {{description=@{description}}} @{charname_output}";
								if (v.attack != null) {
									if (!(v.attack instanceof Array)) {
										var tmp = v.attack;
										v.attack = [];
										v.attack.push(tmp);
									}
									$.each(v.attack, function(z, x) {
										if (!x) return;
										var attack = x.split("|"),
											name = "";
										if (v.attack.length > 1)
											name = (attack[0] == v.name) ? v.name : v.name + " - " + attack[0] + "";
										else
											name = v.name;

										var onhit = "",
											damagetype = "";

										if (attack.length == 2) {
											damage = "" + attack[1];
											tohit = "";
										} else {
											damage = "" + attack[2],
												tohit = attack[1] || 0;
										}

										character.attribs.create({
											name: "repeating_npcaction-l_" + newRowId + "_name",
											current: name
										});
										character.attribs.create({
											name: "repeating_npcaction-l_" + newRowId + "_attack_flag",
											current: "on"
										});
										character.attribs.create({
											name: "repeating_npcaction-l_" + newRowId + "_npc_options-flag",
											current: 0
										});
										character.attribs.create({
											name: "repeating_npcaction-l_" + newRowId + "_attack_display_flag",
											current: "{{attack=1}}"
										});
										character.attribs.create({
											name: "repeating_npcaction-l_" + newRowId + "_attack_options",
											current: "{{attack=1}}"
										});
										character.attribs.create({
											name: "repeating_npcaction-l_" + newRowId + "_attack_tohit",
											current: tohit
										});
										character.attribs.create({
											name: "repeating_npcaction-l_" + newRowId + "_attack_damage",
											current: damage
										});
										character.attribs.create({
											name: "repeating_npcaction-l_" + newRowId + "_name_display",
											current: name
										});
										character.attribs.create({
											name: "repeating_npcaction-l_" + newRowId + "_rollbase",
											current: rollbase
										});
										character.attribs.create({
											name: "repeating_npcaction-l_" + newRowId + "_attack_type",
											current: ""
										});
										character.attribs.create({
											name: "repeating_npcaction-l_" + newRowId + "_attack_tohitrange",
											current: ""
										});
										character.attribs.create({
											name: "repeating_npcaction-l_" + newRowId + "_damage_flag",
											current: "{{damage=1}} {{dmg1flag=1}} {{dmg2flag=1}}"
										});
										if (damage !== "") {
											damage1 = damage.replace(/\s/g, "").split(/d|(?=\+|\-)/g);
											if (damage1[1])
												damage1[1] = damage1[1].replace(/[^0-9-+]/g, "");
											damage2 = isNaN(eval(damage1[1])) === false ? eval(damage1[1]) : 0;
											if (damage1.length < 2) {
												onhit = onhit + damage1[0] + " (" + damage + ")" + damagetype + " damage";
											} else if (damage1.length < 3) {
												onhit = onhit + Math.floor(damage1[0] * ((damage2 / 2) + 0.5)) + " (" + damage + ")" + damagetype + " damage";
											} else {
												onhit = onhit + (Math.floor(damage1[0] * ((damage2 / 2) + 0.5)) + parseInt(damage1[2], 10)) + " (" + damage + ")" + damagetype + " damage";
											};
										};
										character.attribs.create({
											name: "repeating_npcaction-l_" + newRowId + "_attack_onhit",
											current: onhit
										});
									});
								} else {
									character.attribs.create({
										name: "repeating_npcaction-l_" + newRowId + "_name",
										current: v.name
									});
									character.attribs.create({
										name: "repeating_npcaction-l_" + newRowId + "_npc_options-flag",
										current: 0
									});
									character.attribs.create({
										name: "repeating_npcaction-l_" + newRowId + "_rollbase",
										current: rollbase
									});
									character.attribs.create({
										name: "repeating_npcaction-l_" + newRowId + "_name_display",
										current: v.name
									});
								}


								if (v.text instanceof Array) {
									$.each(v.text, function(z, x) {
										if (!x) return;
										text += (z > 0 ? "\r\n" : "") + x;
									});
								} else {
									text = v.text;
								}

								var descriptionFlag = Math.max(Math.ceil(text.length / 57), 1);
								character.attribs.create({
									name: "repeating_npcaction-l_" + newRowId + "_description",
									current: text
								});
								character.attribs.create({
									name: "repeating_npcaction-l_" + newRowId + "_description_flag",
									current: descriptionFlag
								});
							});
						}

						character.view._updateSheetValues();
						var dirty = [];
						$.each(d20.journal.customSheets.attrDeps, function(i, v) {
							dirty.push(i);
						});
						d20.journal.notifyWorkersOfAttrChanges(character.view.model.id, dirty, true);

					} catch (e) {
						d20plus.log("> Error loading [" + name + "]");
						d20plus.addImportError(name);
						console.log(data);
						console.log(e);
					}
					/* end OGL Sheet */

					//character.updateBlobs({gmnotes: gmnotes});
					d20.journal.addItemToFolderStructure(character.id, folder.id);
				}
			});
			d20plus.remaining--;
			if (d20plus.remaining == 0) {
				setTimeout(function() {
					$("#import-name").text("DONE!");
					$("#import-remaining").text("0");
				}, 1000);
			}
		}, timeout);
	};

	// Import dialog showing names of monsters failed to import
	d20plus.addImportError = function(name) {
		var $span = $("#import-errors");
		if ($span.text() == "0") {
			$span.text(name);
		} else {
			$span.text($span.text() + ", " + name);
		}
	}

	// Return XP based on monster cr
	d20plus.getXPbyCR = function(cr) {
		var xp = "";
		switch (cr.toString()) {
			case "0":
				xp = "10";
				break;
			case "1/8":
				xp = "25";
				break;
			case "1/4":
				xp = "50";
				break;
			case "1/2":
				xp = "100";
				break;
			case "1":
				xp = "200";
				break;
			case "2":
				xp = "450";
				break;
			case "3":
				xp = "700";
				break;
			case "4":
				xp = "1100";
				break;
			case "5":
				xp = "1800";
				break;
			case "6":
				xp = "2300";
				break;
			case "7":
				xp = "2900";
				break;
			case "8":
				xp = "3900";
				break;
			case "9":
				xp = "5000";
				break;
			case "10":
				xp = "5900";
				break;
			case "11":
				xp = "7200";
				break;
			case "12":
				xp = "8400";
				break;
			case "13":
				xp = "10000";
				break;
			case "14":
				xp = "11500";
				break;
			case "15":
				xp = "13000";
				break;
			case "16":
				xp = "15000";
				break;
			case "17":
				xp = "18000";
				break;
			case "18":
				xp = "20000";
				break;
			case "19":
				xp = "22000";
				break;
			case "20":
				xp = "25000";
				break;
			case "21":
				xp = "33000";
				break;
			case "22":
				xp = "41000";
				break;
			case "23":
				xp = "50000";
				break;
			case "24":
				xp = "62000";
				break;
			case "25":
				xp = "75000";
				break;
			case "26":
				xp = "90000";
				break;
			case "27":
				xp = "105000";
				break;
			case "28":
				xp = "120000";
				break;
			case "29":
				xp = "135000";
				break;
			case "30":
				xp = "155000";
				break;
		}
		return xp;
	};

	// Return XP based on character level
	d20plus.getXPbyLevel = function(level) {
		var xp = [0, 0, 0, 0];
		switch (level.toString()) {
			case "1":
				xp = [25, 50, 75, 100];
				break;
			case "2":
				xp = [50, 100, 150, 200];
				break;
			case "3":
				xp = [75, 150, 225, 400];
				break;
			case "4":
				xp = [125, 250, 375, 500];
				break;
			case "5":
				xp = [250, 500, 750, 1100];
				break;
			case "6":
				xp = [300, 600, 900, 1400];
				break;
			case "7":
				xp = [350, 750, 1100, 1700];
				break;
			case "8":
				xp = [450, 900, 1400, 2100];
				break;
			case "9":
				xp = [550, 1100, 1600, 2400];
				break;
			case "10":
				xp = [600, 1200, 1900, 2800];
				break;
			case "11":
				xp = [800, 1600, 2400, 3600];
				break;
			case "12":
				xp = [1000, 2000, 3000, 4500];
				break;
			case "13":
				xp = [1100, 2200, 3400, 5100];
				break;
			case "14":
				xp = [1250, 2500, 3800, 5700];
				break;
			case "15":
				xp = [1400, 2800, 4300, 6400];
				break;
			case "16":
				xp = [1600, 3200, 4800, 7200];
				break;
			case "17":
				xp = [2000, 3900, 5900, 8800];
				break;
			case "18":
				xp = [2100, 4200, 6300, 9500];
				break;
			case "19":
				xp = [2400, 4900, 7300, 10900];
				break;
			case "20":
				xp = [2800, 5700, 8500, 12700];
				break;
		}
		return xp;
	};

	// Get NPC size from chr
	d20plus.getSizeString = function(chr) {
		switch (chr) {
			case "F":
				return "Fine";
			case "D":
				return "Diminutive";
			case "T":
				return "Tiny";
			case "S":
				return "Small";
			case "M":
				return "Medium";
			case "L":
				return "Large";
			case "H":
				return "Huge";
			case "G":
				return "Gargantuan";
			case "C":
				return "Colossal";
			default:
				return "(Unknown Size)";
		}
	};

	// Create ID for repeating row
	d20plus.generateRowId = function() {
		return window.generateUUID().replace(/_/g, "Z");
	};

	// Create ID for item
	d20plus.generateId = function() {
		return window.generateUUID();
	};

	// Create editable HP variable and autocalculate + or -
	d20plus.hpAllowEdit = function() {
		$("#initiativewindow").on(window.mousedowntype, ".hp.editable", function() {
			if ($(this).find("input").length > 0)
				return void $(this).find("input").focus();
			var val = $.trim($(this).text());
			$(this).html("<input type='text' value='" + val + "'/>");
			$(this).find("input").focus();
		});
		$("#initiativewindow").on("keydown", ".hp.editable", function(event) {
			if (event.which == 13) {
				var total = 0,
					el, token, id, char, hp,
					val = $.trim($(this).find("input").val()),
					matches = val.match(/[+\-]*(\.\d+|\d+(\.\d+)?)/g) || [];
				while (matches.length) {
					total += parseFloat(matches.shift());
				}
				el = $(this).parents("li.token");
				id = el.data("tokenid");
				token = d20.Campaign.pages.get(d20.Campaign.activePage()).thegraphics.get(id);
				char = token.character;
				npc = char.attribs.find(function(a) {
					return a.get("name").toLowerCase() === "npc";
				});
				if (npc && npc.get("current") == "1") {
					token.attributes.bar3_value = total;
				} else {
					hp = char.attribs.find(function(a) {
						return a.get("name").toLowerCase() === "hp";
					});
					if (hp) {
						hp.syncedSave({
							current: total
						});
					} else {
						char.attribs.create({
							name: "hp",
							current: total
						});
					}
				}
				d20.Campaign.initiativewindow.rebuildInitiativeList();
			}
		});
	};

	// Cross-browser add CSS rule
	d20plus.addCSS = function(sheet, selector, rules) {
		index = sheet.cssRules.length;
		if ("insertRule" in sheet) {
			sheet.insertRule(selector + "{" + rules + "}", index);
		} else if ("addRule" in sheet) {
			sheet.addRule(selector, rules, index);
		}
	};

	// Send string to chat using current char id
	d20plus.chatSend = function(str) {
		d20.textchat.doChatInput(str);
	};

	// Get character by name
	d20plus.charByName = function(name) {
		var char = null;
		d20.Campaign.characters.each(function(c) {
			if (c.get("name") == name) char = c;
		});
		return char;
	};

	// Prettier log
	d20plus.log = function(arg) {
		console.log("%cD20Plus", "color: #3076b9; font-size: xx-large", arg);
	};

	// Return random result from rolling dice
	d20plus.randomRoll = function(roll, success, error) {
		d20.textchat.diceengine.process(roll, success, error);
	};

	// Return random integer between [0,int)
	d20plus.randomInt = function(int) {
		return d20.textchat.diceengine.random(int);
	};

	// Change character sheet formulas
	d20plus.setSheet = function() {

		d20plus.sheet = "ogl";
		if (d20.journal.customSheets.layouthtml.indexOf("shaped_d20") > 0) d20plus.sheet = "shaped";
		if (d20.journal.customSheets.layouthtml.indexOf("DnD5e_Character_Sheet") > 0) d20plus.sheet = "community";

		d20plus.log("> Switched Character Sheet Template to " + d20plus.sheet);
	};

	// Return Initiative Tracker template with formulas
	d20plus.getInitTemplate = function() {
		var cachedFunction = d20.Campaign.initiativewindow.rebuildInitiativeList;
		d20.Campaign.initiativewindow.rebuildInitiativeList = function() {
			var html = d20plus.initiativeTemplate;
			_.each(d20plus.formulas[d20plus.sheet], function(v, i) {
				html = html.replace("||" + i + "||", v);
			});
			$("#tmpl_initiativecharacter").replaceWith(html);
			var results = cachedFunction.apply(this, []);

			setTimeout(function() {
				$(".initmacrobutton").unbind("click");
				$(".initmacrobutton").bind("click", function() {
					console.log("Macro button clicked");
					tokenid = $(this).parent().parent().data("tokenid");
					var token, char;
					var page = d20.Campaign.activePage();
					if (page) token = page.thegraphics.get(tokenid);
					if (token) char = token.character;
					if (char) {
						char.view.showDialog();
						// d20.textchat.doChatInput(`%{` + char.id + `|` + d20plus.formulas[d20plus.sheet]["macro"] + `}`)
					}
				});
			}, 100);
			return results;
		}
	};


	// Import spell button was clicked
	// d20plus.buttonSpellClicked = function() {
	d20plus.spells.button = function() {
		var url = $("#import-spell-url").val();
		// window.prompt("Input the URL of the Monster XML file");
		if (url != null) {
			d20plus.spells.load(url);
		}
	};

	// Fetch spell data from file
	d20plus.spells.load = function(url) {
		$("a.ui-tabs-anchor[href='#journal']").trigger("click");
		var x2js = new X2JS();
		var datatype = $("#import-datatype").val();
		if (datatype === "json") datatype = "text";

		$.ajax({
			type: "GET",
			url: url,
			dataType: datatype,
			success: function(data) {
				try {
					d20plus.log("Importing Data (" + $("#import-datatype").val().toUpperCase() + ")");
					spelldata = (datatype === "XML") ? x2js.xml2json(data) : JSON.parse(data.replace(/^var .* \= /g, ""));
					var length = spelldata.spell.length;

					spelldata.spell.sort(function(a,b) {
						if (a.name < b.name) return -1;
						if (a.name > b.name) return 1;
						return 0;
					});

					// building list for checkboxes
					$("#import-list .list").html("");
					$.each(spelldata.spell, function(i, v) {
						try {
							var vname = v.name;
							var vsource = v.source;
							$("#import-list .list").append(`<label><input type="checkbox" data-listid="` + i + `"> <span class="name">` + vname + `</span> <span class="source">` + "- " + vsource + `</span></label>`);
						} catch (e) {
							console.log("Error building list!", e);
							d20plus.addImportError(v.name);
						}
					});

					var options = {
						valueNames: [ 'name' ]
					}

					var importList = new List ("import-list", options);

					$("#import-options label").hide();
					$("#import-overwrite").parent().show();
					$("#import-showplayers").parent().show();

					$("#d20plus-importlist").dialog("open");

					$("#d20plus-importlist input#importlist-selectall").unbind("click");
					$("#d20plus-importlist input#importlist-selectall").bind("click", function() {
						$("#import-list .list input").prop("checked", $(this).prop("checked"));
					});

					$("#d20plus-importlist button").unbind("click");
					$("#d20plus-importlist button#importstart").bind("click", function() {
						$("#d20plus-importlist").dialog("close");
						var overwritespells = $("#import-overwrite").prop("checked");

						$("#import-list .list input").each(function() {
							if (!$(this).prop("checked")) return;
							var spellnum = parseInt($(this).data("listid"));
							var curspell = spelldata.spell[spellnum];
							try {
								console.log("> " + (spellnum + 1) + "/" + length + " Attempting to import spell [" + curspell.name + "]");
								d20plus.spells.import(curspell, overwritespells);
							} catch (e) {
								console.log("Error Importing!", e);
								d20plus.addImportError(curspell.name);
							}
						});
					});
				} catch (e) {
					console.log("> Exception ", e);
				}
			},
			error: function(jqXHR, exception) {
				var msg = "";
				if (jqXHR.status === 0) {
					msg = "Could not connect.\n Check Network";
				} else if (jqXHR.status == 404) {
					msg = "Page not found [404]";
				} else if (jqXHR.status == 500) {
					msg = "Internal Server Error [500]";
				} else if (exception === 'parsererror') {
					msg = "Data parse failed";
				} else if (exception === 'timeout') {
					msg = "Timeout";
				} else if (exception === 'abort') {
					msg = "Request aborted";
				} else {
					msg = "Uncaught Error.\n" + jqXHR.responseText;
				}
				d20plus.log("> ERROR: " + msg);
			}
		});

		d20plus.timeout = 500;
	};

	// Import individual spells
	d20plus.spells.import = function(data, overwritespells) {

		var level = Parser.spLevelToFull(data.level);
		if (level !== "cantrip") level += " level";
		var fname = level.trim().capFirstLetter();
		var findex = 1;
		var folder;

		d20.journal.refreshJournalList();
		var journalFolder = d20.Campaign.get("journalfolder");
		if (journalFolder === "") {
			d20.journal.addFolderToFolderStructure("Characters");
			d20.journal.refreshJournalList();
			journalFolder = d20.Campaign.get("journalfolder");
		}
		var journalFolderObj = JSON.parse(journalFolder),
			spells = journalFolderObj.find(function(a) {
				return a.n && a.n == "Spells"
			});

		if (!spells) {
			d20.journal.addFolderToFolderStructure("Spells");
		}

		d20.journal.refreshJournalList();
		journalFolder = d20.Campaign.get("journalfolder");
		journalFolderObj = JSON.parse(journalFolder);
		spells = journalFolderObj.find(function(a) {
			return a.n && a.n == "Spells"
		});

		var datas = data.source ? data.source : "PHB";
		var name = data.name + " " + datas || "(Unknown Name)";

		// check for duplicates
		var dupe = false;
		$.each(spells.i, function(i, v) {
			if (d20plus.objectExists(spells.i, v.id, name)) dupe = true;
			if (overwritespells) d20plus.deleteObject(spells.i, v.id, name);
		});
		if (dupe) {
			console.log("Already Exists");
			if (!overwritespells) return;
		}

		d20plus.remaining++;
		if (d20plus.timeout == 500) {
			$("#d20plus-import").dialog("open");
			$("#import-remaining").text("d20plus.remaining");
		}
		timeout = d20plus.timeout;
		d20plus.timeout += 2500;

		setTimeout(function() {
			d20plus.log("Running import of [" + name + "]");
			$("#import-remaining").text(d20plus.remaining);
			$("#import-name").text(name);

			d20.journal.refreshJournalList();
			journalFolder = d20.Campaign.get("journalfolder");
			journalFolderObj = JSON.parse(journalFolder);
			spells = journalFolderObj.find(function(a) {
				return a.n && a.n == "Spells"
			});


			// make source folder
			for (i = -1; i < spells.i.length; i++) {
				var theFolderName = (findex == 1) ? fname : fname + " " + findex;
				folder = spells.i.find(function(f) {
					return f.n == theFolderName;
				});
				if (folder) {
					if (folder.i.length >= 90) {
						findex++;
					} else {
						break;
					}
				} else {
					d20.journal.addFolderToFolderStructure(theFolderName, spells.id);
					d20.journal.refreshJournalList();
					journalFolder = d20.Campaign.get("journalfolder");
					journalFolderObj = JSON.parse(journalFolder);
					spells = journalFolderObj.find(function(a) {
						return a.n && a.n == "Spells"
					});
					folder = spells.i.find(function(f) {
						return f.n == theFolderName;
					});
					break;
				}
			}

			if (!folder) {
				console.log("> Failed to find or create source folder!");
				return;
			}

			// build spell handout
			d20.Campaign.handouts.create({
				name: name
			}, {
				success: function(handout) {

					if (!data.school) data.school = "A";
					if (!data.range) data.range = "Self";
					if (!data.duration) data.duration = "Instantaneous"
					if (!data.components) data.components = "";
					if (!data.time) data.components = "1 action";

					var r20json = {
						name: data.name,
						content: "",
						htmlcontent: "",
						data: {
							"Level": String(data.level),
							"Range": Parser.spRangeToFull(data.range),
							"School": Parser.spSchoolAbvToFull(data.school),
							"Source": "5etoolsR20",
							"Classes": Parser.spClassesToFull(data.classes),
							"Category": "Spells",
							"Duration": Parser.spDurationToFull(data.duration),
							"Material": "",
							"Components": parseComponents(data.components),
							"Casting Time": Parser.spTimeListToFull(data.time)
						}
					};

					if (data.components.m && data.components.m.length) {
						r20json.data["Material"] = data.components.m;
					}

					if (data.meta) {
						if (data.meta.ritual) {
							r20json.data["Ritual"] = "Yes";
						}
					}

					var notecontents = "";
					var gmnotes = "";

					notecontents += `<p><h3>` + data.name + `</h3>`;

					notecontents += `<em>` + Parser.spLevelSchoolMetaToFull(data.level, data.school, data.meta) + `</em></p><p>`;

					notecontents += `<strong>Casting Time:</strong> ` + Parser.spTimeListToFull(data.time) + `<br>`;
					notecontents += `<strong>Range:</strong> ` + Parser.spRangeToFull(data.range) + `<br>`;
					notecontents += `<strong>Components:</strong> ` + Parser.spComponentsToFull(data.components) + `<br>`;
					notecontents += `<strong>Duration:</strong> ` + Parser.spDurationToFull(data.duration) + `<br>`;
					notecontents += `</p>`;

					const renderer = new EntryRenderer();
					const renderStack = [];
					const entryList = {type: "entries", entries: data.entries};

					renderer.recursiveEntryRender(entryList, renderStack, 1);
					r20json.content = renderStack.join(" ");
					if (data.entriesHigherLevel) {
						const hLevelRenderStack = [];
						const higherLevelsEntryList = {type: "entries", entries: data.entriesHigherLevel};
						renderer.recursiveEntryRender(higherLevelsEntryList, hLevelRenderStack, 2);
						r20json.data["Higher Spell Slot Bonus"] = hLevelRenderStack.join(" ");
						notecontents += hLevelRenderStack.join("");
					}

					notecontents += renderStack.join("");

					notecontents += `<p><strong>Classes:</strong> ` + Parser.spClassesToFull(data.classes) + `</p>`;
					gmnotes = JSON.stringify(r20json);

					console.log(notecontents);
					handout.updateBlobs({
						notes: notecontents,
						gmnotes: gmnotes
					});

					var injournals = ($("#import-showplayers").prop("checked")) ? ["all"].join(",") : "";
					handout.save({
						notes: (new Date).getTime(),
						inplayerjournals: injournals
					});

					d20.journal.addItemToFolderStructure(handout.id, folder.id);
				}
			});
			d20plus.remaining--;
			if (d20plus.remaining == 0) {
				setTimeout(function() {
					$("#import-name").text("DONE!");
					$("#import-remaining").text("0");
				}, 1000);
			}
			d20plus.log("finished import of [" + name + "]");
		}, timeout);

	};

	// parse spell components
	function parseComponents(components) {
		const out = [];
		if (components.v) out.push("V");
		if (components.s) out.push("S");
		if (components.m) out.push("M");
		return out.join(" ");
	}

	// Import spell button was clicked
	// d20plus.buttonSpellClicked = function() {
	d20plus.items.button = function() {
		var url = $("#import-items-url").val();
		if (url != null) {
			d20plus.items.load(url);
		}
	};

	// Fetch items data from file
	d20plus.items.load = function(url) {
		$("a.ui-tabs-anchor[href='#journal']").trigger("click");
		var x2js = new X2JS();
		var datatype = $("#import-datatype").val();
		if (datatype === "json") datatype = "text";

		$.ajax({
			type: "GET",
			url: url,
			dataType: datatype,
			success: function(data) {
				try {
					d20plus.log("Importing Data (" + $("#import-datatype").val().toUpperCase() + ")");
					itemdata = (datatype === "XML") ? x2js.xml2json(data) : JSON.parse(data.replace(/^var .* \= /g, ""));
					var length = itemdata.item.length;

					itemdata.item.sort(function(a,b) {
						if (a.name < b.name) return -1;
						if (a.name > b.name) return 1;
						return 0;
					});


					// building list for checkboxes
					$("#import-list .list").html("");
					$.each(itemdata.item, function(i, v) {
						try {
							$("#import-list .list").append(`<label><input type="checkbox" data-listid="` + i + `"> <span class="name">` + v.name + `</span></label>`);
						} catch (e) {
							console.log("Error building list!", e);
							d20plus.addImportError(v.name);
						}
					});
					var options = {
						valueNames: [ 'name' ]
					}

					var importList = new List ("import-list", options);

					$("#import-options label").hide();
					$("#import-overwrite").parent().show();
					$("#import-showplayers").parent().show();

					$("#d20plus-importlist").dialog("open");

					$("#d20plus-importlist input#importlist-selectall").unbind("click");
					$("#d20plus-importlist input#importlist-selectall").bind("click", function() {
						$("#import-list .list input").prop("checked", $(this).prop("checked"));
					});

					$("#d20plus-importlist button").unbind("click");
					$("#d20plus-importlist button#importstart").bind("click", function() {
						$("#d20plus-importlist").dialog("close");
						var overwriteitems = $("#import-overwrite").prop("checked");

						$("#import-list .list input").each(function() {
							if (!$(this).prop("checked")) return;
							var itemnum = parseInt($(this).data("listid"));
							var curitem = itemdata.item[itemnum];
							try {
								console.log("> " + (itemnum + 1) + "/" + length + " Attempting to import item [" + curitem.name + "]");
								d20plus.items.import(curitem, overwriteitems);
							} catch (e) {
								console.log("Error Importing!", e);
								d20plus.addImportError(curitem.name);
							}
						});
					});
				} catch (e) {
					console.log("> Exception ", e);
				}
			},
			error: function(jqXHR, exception) {
				var msg = "";
				if (jqXHR.status === 0) {
					msg = "Could not connect.\n Check Network";
				} else if (jqXHR.status == 404) {
					msg = "Page not found [404]";
				} else if (jqXHR.status == 500) {
					msg = "Internal Server Error [500]";
				} else if (exception === 'parsererror') {
					msg = "Data parse failed";
				} else if (exception === 'timeout') {
					msg = "Timeout";
				} else if (exception === 'abort') {
					msg = "Request aborted";
				} else {
					msg = "Uncaught Error.\n" + jqXHR.responseText;
				}
				d20plus.log("> ERROR: " + msg);
			}
		});

		d20plus.timeout = 500;
	};

	// Import individual items
	d20plus.items.import = function(data, overwriteitems) {
		var fname = d20plus.items.parseType(data.type ? data.type.split(",")[0] : (data.wondrous ? "Wondrous Item" : data.technology));
		var findex = 1;
		var folder;

		d20.journal.refreshJournalList();
		var journalFolder = d20.Campaign.get("journalfolder");
		if (journalFolder === "") {
			d20.journal.addFolderToFolderStructure("Characters");
			d20.journal.refreshJournalList();
			journalFolder = d20.Campaign.get("journalfolder");
		}
		var journalFolderObj = JSON.parse(journalFolder),
			items = journalFolderObj.find(function(a) {
				return a.n && a.n == "Items"
			});

		if (!items) {
			d20.journal.addFolderToFolderStructure("Items");
		}

		d20.journal.refreshJournalList();
		journalFolder = d20.Campaign.get("journalfolder");
		journalFolderObj = JSON.parse(journalFolder);
		items = journalFolderObj.find(function(a) {
			return a.n && a.n == "Items"
		});

		var name = data.name || "(Unknown Name)";

		// check for duplicates
		var dupe = false;
		$.each(items.i, function(i, v) {
			if (d20plus.objectExists(items.i, v.id, name)) dupe = true;
			if ($("#import-overwrite").prop("checked")) d20plus.deleteObject(items.i, v.id, name);
		});
		if (dupe) {
			console.log("Already Exists");
			if (!overwriteitems) return;
		}

		d20plus.remaining++;
		if (d20plus.timeout == 500) {
			$("#d20plus-import").dialog("open");
			$("#import-remaining").text("d20plus.remaining");
		}
		timeout = d20plus.timeout;
		d20plus.timeout += 2500;

		setTimeout(function() {
			d20plus.log("Running import of [" + name + "]");
			$("#import-remaining").text(d20plus.remaining);
			$("#import-name").text(name);

			d20.journal.refreshJournalList();
			journalFolder = d20.Campaign.get("journalfolder");
			journalFolderObj = JSON.parse(journalFolder);
			items = journalFolderObj.find(function(a) {
				return a.n && a.n == "Items"
			});

			// make source folder
			for (i = -1; i < items.i.length; i++) {
				var theFolderName = (findex == 1) ? fname : fname + " " + findex;
				folder = items.i.find(function(f) {
					return f.n == theFolderName;
				});
				if (folder) {
					if (folder.i.length >= 90) {
						findex++;
					} else {
						break;
					}
				} else {
					d20.journal.addFolderToFolderStructure(theFolderName, items.id);
					d20.journal.refreshJournalList();
					journalFolder = d20.Campaign.get("journalfolder");
					journalFolderObj = JSON.parse(journalFolder);
					items = journalFolderObj.find(function(a) {
						return a.n && a.n == "Items"
					});
					folder = items.i.find(function(f) {
						return f.n == theFolderName;
					});
					break;
				}
			}

			if (!folder) {
				console.log("> Failed to find or create source folder!");
				return;
			}

			// build item handout
			d20.Campaign.handouts.create({
				name: name
			}, {
				success: function(handout) {
					var notecontents = "";

					var ismagicitem = false;
					if (data.rarity || data.wondrous || data.name.search(/((Devastation Orb)|(Storm Boomerang)|(\s?Spiked Armor\s?)(Bottled Breath))/g) > 0) ismagicitem = true;
					// if (data.text.search(/(Requires Attunement)/g) > 0) ismagicitem = true;

					var type = data.type ? data.type.split(",") : "";
					var source = data.text ? data.text[data.text.length - 1].split(",")[0].split(":")[1] : "";
					var rarity = data.rarity;
					if (!rarity) {
						rarity = "None";
					} else rarity = data.rarity.replace("Rarity: ", "");


					var damage = "";
					var armorclass = "";

					var typestring = ""
					for (var n = 0; n < type.length; n++) {
						var curtype = type[n];
						if (n > 0) typestring += `, `;
						typestring += d20plus.items.parseType(type[n]);
						if (curtype === "M" || curtype === "R" || curtype === "GUN") {
							damage = data.dmg1 + " " + data.dmgType;
						}

						if (curtype === "S") armorclass = "+" + data.ac;
						if (curtype === "LA") armorclass = data.ac + " + Dex";
						if (curtype === "MA") armorclass = data.ac + " + Dex (max 2)";
						if (curtype === "HA") armorclass = data.ac;
					}
					for (var j = 0; j < type.length; j++) {
						type[j] = d20plus.items.parseType(type[j]);
					}

					var properties = "";
					if (data.property) {
						var propertieslist = data.property.split(",");
						for (var i = 0; i < propertieslist.length; i++) {
							var a = d20plus.items.parseProperty(propertieslist[i]);
							var b = propertieslist[i];
							if (b === "V") a = a + " (" + data.dmg2 + ")";
							if (b === "T" || b === "A") a = a + " (" + data.range + "ft.)";
							if (b === "RLD") a = a + " (" + data.reload + " shots)";
							if (i > 0) a = ", " + a;
							properties += a;
						}
					}

					var textstring = "";
					var attunementstring = ""
					var itemtext = data.text ? data.text : "";
					for (var n = 0; n < itemtext.length; n++) {
						if (!itemtext[n]) continue;
						if (itemtext[n].trim().toLowerCase() === "requires attunement") attunementstring = " (Requires Attunement)";
						if (itemtext[n].toLowerCase().match(/^((rarity\:)|(requires attunement)|(source: ))/g)) continue;
						textstring += `<p>` + itemtext[n] + `</p>`;
					}

					notecontents += `<p><h3>` + data.name + `</h3></p><em>`;
					notecontents += typestring;
					if (ismagicitem) notecontents += ", " + rarity;
					if (attunementstring) notecontents += attunementstring;
					notecontents += `</em>`;
					if (damage) notecontents += `<p><strong>Damage: </strong>` + damage + `</p>`;
					if (properties) notecontents += `<p><strong>Properties: </strong>` + properties + `</p>`;
					if (armorclass) notecontents += `<p><strong>Armor Class: </strong>` + armorclass + `</p>`;
					if (data.weight) notecontents += `<p><strong>Weight: </strong>` + data.weight + ` lbs.</p>`;
					if (textstring) {
						notecontents += `<hr>`;
						notecontents += textstring;
					}

					handout.updateBlobs({
						notes: notecontents
					});

					var injournals = ($("#import-showplayers").prop("checked")) ? ["all"].join(",") : "";
					handout.save({
						notes: (new Date).getTime(),
						inplayerjournals: injournals
					});

					d20.journal.addItemToFolderStructure(handout.id, folder.id);
				}
			});
			d20plus.remaining--;
			if (d20plus.remaining == 0) {
				setTimeout(function() {
					$("#import-name").text("DONE!");
					$("#import-remaining").text("0");
				}, 1000);
			}
		}, timeout);
	};

	d20plus.items.parseType = function(type) {
		if (type === "$") return "Treasure"
		if (type === "G") return "Adventuring Gear"
		if (type === "SCF") return "Spellcasting Focus"
		if (type === "AT") return "Artisan Tool"
		if (type === "T") return "Tool"
		if (type === "GS") return "Gaming Set"
		if (type === "INS") return "Instrument"
		if (type === "A") return "Ammunition"
		if (type === "M") return "Melee Weapon"
		if (type === "R") return "Ranged Weapon"
		if (type === "LA") return "Light Armor"
		if (type === "MA") return "Medium Armor"
		if (type === "HA") return "Heavy Armor"
		if (type === "S") return "Shield"
		if (type === "W") return "Wondrous Item"
		if (type === "P") return "Potion"
		if (type === "ST") return "Staff"
		if (type === "RD") return "Rod"
		if (type === "RG") return "Ring"
		if (type === "WD") return "Wand"
		if (type === "SC") return "Scroll"
		if (type === "EXP") return "Explosive"
		if (type === "GUN") return "Firearm"
		if (type === "SIMW") return "Simple Weapon"
		if (type === "MARW") return "Martial Weapon"
		return "n/a"
	}

	d20plus.items.parseDamageType = function(damagetype) {
		if (damagetype === "B") return "bludgeoning"
		if (damagetype === "P") return "piercing"
		if (damagetype === "S") return "slashing"
		if (damagetype === "N") return "necrotic"
		if (damagetype === "R") return "radiant"
		return false;
	}

	d20plus.items.parseProperty = function(property) {
		if (property === "A") return "ammunition"
		if (property === "LD") return "loading"
		if (property === "L") return "light"
		if (property === "F") return "finesse"
		if (property === "T") return "thrown"
		if (property === "H") return "heavy"
		if (property === "R") return "reach"
		if (property === "2H") return "two-handed"
		if (property === "V") return "versatile"
		if (property === "S") return "special"
		if (property === "RLD") return "reload"
		if (property === "BF") return "burst fire"
		return "n/a"
	}

	String.prototype.capFirstLetter = function() {
		return this.replace(/\w\S*/g, function(w) {
			return w.charAt(0).toUpperCase() + w.substr(1).toLowerCase();
		});
	};

	/*  */
	d20plus.dmscreenButton = `<li id="dmscreen-button" tip="DM Screen">
                                                                                                                                                            <span class="pictos">N</span>
                                                                                                                                                            </li>`;

	// This is an older version of the repo. The newer version has a security error when loaded over SSL :(
	d20plus.dmscreenHtml = `<div id="dmscreen-dialog">
    <iframe src="//ftwinston.github.io/5edmscreen/mobile"></iframe>
    </div>`;

	d20plus.difficultyHtml = `<span class="difficulty" style="position: absolute"></span>`;

	d20plus.multipliers = [1, 1.5, 2, 2.5, 3, 4, 5];

	d20plus.formulas = {
		"ogl": {
			"CR": "@{npc_challenge}",
			"AC": "@{ac}",
			"NPCAC": "@{npc_ac}",
			"HP": "@{hp}",
			"PP": "@{passive_wisdom}",
			"macro": ""
		},
		"community": {
			"CR": "@{npc_challenge}",
			"AC": "@{AC}",
			"NPCAC": "@{AC}",
			"HP": "@{HP}",
			"PP": "10 + @{perception}",
			"macro": ""
		},
		"shaped": {
			"CR": "@{challenge}",
			"AC": "@{AC}",
			"NPCAC": "@{AC}",
			"HP": "@{HP}",
			"PP": "@{repeating_skill_$11_passive}",
			"macro": "shaped_statblock"
		}
	};

	d20plus.scripts = [
		{
			name: "xml2json",
			url: "https://cdnjs.cloudflare.com/ajax/libs/x2js/1.2.0/xml2json.min.js"
		},
		{
			name: "listjs",
			url: "https://raw.githubusercontent.com/javve/list.js/v1.5.0/dist/list.min.js"
		},
		{
			name: "5etoolsutils",
			url: jsUtilsUrl
		},
		{
			name: "5etoolsrender",
			url: jsRenderUrl
		}
	];

	d20plus.importListHTML = `<div id="d20plus-importlist" title="Import...">
    <p><input type="checkbox" title="Select all" id="importlist-selectall"></p>
    <p>
    <span id="import-list"><input class="search" autocomplete="off" placeholder="Search list..."><br><span class="list" style="max-height: 600px; overflow-y: scroll; display: block; margin-top: 1em;"></span></span>
    </p>
    <p id="import-options">
    <label><input type="checkbox" title="Import by source" id="import-monster-organizebysource"> Import by source instead of type?</label>
    <label><input type="checkbox" title="Make items visible to all players" id="import-showplayers" checked> Make handouts visible to all players?</label>
    <label><input type="checkbox" title="Overwrite existing" id="import-overwrite"> Overwrite existing entries?</label>
    </p>

    <button type="button" id="importstart" alt="Load" title="Load Monsters" class="btn" role="button" aria-disabled="false">
    <span>Load</span>
    </button>
    </div>`

	d20plus.importDialogHtml = `<div id="d20plus-import" title="Importing...">
    <p>
    <h3 id="import-name"></h3>
    </p>
    <span id="import-remaining"></span> remaining
    <p></p>
    Errors: <span id="import-errors">0</span>
    </div>`;

	d20plus.refreshButtonHtml = `<button type="button" alt="Refresh" title="Refresh" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only pictos bigbuttonwithicons" role="button" aria-disabled="false">
    <span class="ui-button-text" style="">1</span>
    </button>`;

	d20plus.settingsHtml = `<hr>
    <p>
    <h3>5etoolsR20 v` + d20plus.version + `</h3>
    </p>
    <p>
    <label>Data Type:</label>
    <select id="import-datatype" value="json">
    <option value="json">JSON</option>
    <option value="xml">XML</option>
    </select>
    </p>
    <p>
    <h4>Monster Importing</h4>
    <label for="import-monster-url">Monster Data URL:</label>
    <p>
    <select id="button-monsters-select">
		<option value="${monsterdataurl}">Default</option>
		<option value="${monsterdataurlTob}">Tome of Beasts</option>
		<option value="">Custom</option>
	</select>
    </p>
    <input type="text" id="import-monster-url" value="` + monsterdataurl + `">
    <a class="btn" href="#" id="button-monsters-load">Import Monsters</a>
    </p>
    <p>
    <h4>Spell Importing</h4>
    <label for="import-spell-url">Spell Data URL:</label>
    <input type="text" id="import-spell-url" value="` + spelldataurl + `">
    <a class="btn" href="#" id="button-spells-load">Import Spells</a>
    </p>
    <p>
    <h4>Item Importing</h4>
    <label for="import-items-url">Item Data URL:</label>
    <input type="text" id="import-items-url" value="` + itemdataurl + `">
    <a class="btn" href="#" id="import-items-load">Import Items</a>
    </p>
    <p>
    <a class="btn bind-drop-locations" href="#" id="bind-drop-locations">Prepare Drag-and-Drop Spells/Items</a>
    </p>`;

	d20plus.cssRules = [
		{
			s: "#initiativewindow ul li span.initiative,#initiativewindow ul li span.ac,#initiativewindow ul li span.hp,#initiativewindow ul li span.pp,#initiativewindow ul li span.cr,#initiativewindow ul li span.initmacro",
			r: "font-size: 25px;font-weight: bold;text-align: right;float: right;padding: 2px 5px;width: 10%;min-height: 20px;"
		},
		{
			s: "#initiativewindow ul li span.editable input",
			r: "width: 100%; box-sizing: border-box;height: 100%;"
		},
		{
			s: "#initiativewindow div.header",
			r: "height: 30px;"
		},
		{
			s: "#initiativewindow div.header span",
			r: "cursor: default;font-size: 15px;font-weight: bold;text-align: right;float: right;width: 10%;min-height: 20px;padding: 5px;"
		},
		{
			s: ".ui-dialog-buttonpane span.difficulty",
			r: "display: inline-block;padding: 5px 4px 6px;margin: .5em .4em .5em 0;font-size: 18px;"
		},
		{
			s: ".ui-dialog-buttonpane.buttonpane-absolute-position",
			r: "position: absolute;bottom: 0;box-sizing: border-box;width: 100%;"
		},
		{
			s: ".ui-dialog.dialog-collapsed .ui-dialog-buttonpane",
			r: "position: initial;"
		},
		{
			s: "#dmscreen-dialog iframe",
			r: "width: 100%;height: 100%;position: absolute;top: 0;left: 0;border: 0;"
		},
		{
			s: ".token .cr,.header .cr",
			r: "display: none!important;"
		},
		{
			s: "li.handout.compendium-item .namecontainer",
			r: "box-shadow: inset 0px 0px 25px 2px rgb(195, 239, 184);"
		},
		{
			s: ".bind-drop-locations:active",
			r: "box-shadow: inset 0px 0px 25px 2px rgb(195, 239, 184);"
		}
	];

	d20plus.initiativeHeaders = `<div class="header">
  <span class="ui-button-text initmacro">Sheet</span>
  <span class="initiative" alt="Initiative" title="Initiative">Init</span>
  <span class="pp" alt="Passive Perception" title="Passive Perception">PP</span>
  <span class="ac" alt="AC" title="AC">AC</span>
  <span class="cr" alt="CR" title="CR">CR</span>
  <span class="hp" alt="HP" title="HP">HP</span>
  </div>`;

	d20plus.initiativeTemplate = `<script id="tmpl_initiativecharacter" type="text/html">
  <![CDATA[
  <li class='token <$ if (this.layer == "gmlayer") { $>gmlayer<$ } $>' data-tokenid='<$!this.id$>' data-currentindex='<$!this.idx$>'>
  <span alt='Sheet Macro' title='Sheet Macro' class='initmacro'>
  <button type='button' class='initmacrobutton ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only pictos' role='button' aria-disabled='false'>
  <span class='ui-button-text'>N</span>
  </button>
  </span>
  <span alt='Initiative' title='Initiative' class='initiative <$ if (this.iseditable) { $>editable<$ } $>'>
  <$!this.pr$>
  </span>
  <$ var token = d20.Campaign.pages.get(d20.Campaign.activePage()).thegraphics.get(this.id); $>
  <$ var char = (token) ? token.character : null; $>
  <$ if (char) { $>
    <$ var npc = char.attribs.find(function(a){return a.get("name").toLowerCase() == "npc" }); $>
    <$ var passive = char.autoCalcFormula('@{passive}') || char.autoCalcFormula('||PP||'); $>
    <span class='pp' alt='Passive Perception' title='Passive Perception'><$!passive$></span>
    <span class='ac' alt='AC' title='AC'>
    <$ if(npc && npc.get("current") == "1") { $>
        <$!char.autoCalcFormula('||NPCAC||')$>
        <$ } else { $>
            <$!char.autoCalcFormula('||AC||')$>
            <$ } $>
            </span>
            <span class='cr' alt='CR' title='CR'>
            <$ if(npc && npc.get("current") == "1") { $>
                <$!char.attribs.find(function(e) { return e.get("name").toLowerCase() === "npc_challenge" }).get("current")$>
                <$ } $>
                </span>
                <span class='hp editable' alt='HP' title='HP'>
                <$ if(npc && npc.get("current") == "1") { $>
                   <$!token.attributes.bar3_value$>
                   <$ } else { $>
                    <$!char.autoCalcFormula('||HP||')$>
                    <$ } $>
                    </span>
                    <$ } $>
                    <$ if (this.avatar) { $><img src='<$!this.avatar$>' /><$ } $>
                    <span class='name'><$!this.name$></span>
                    <div class='clear' style='height: 0px;'></div>
                    <div class='controls'>
                    <span class='pictos remove'>#</span>
                    </div>
                    </li>
                    ]]>
                    </script>`;
	/*  */

	/* object.watch polyfill by Eli Grey, http://eligrey.com */
	if (!Object.prototype.watch) {
		Object.defineProperty(Object.prototype, "watch", {
			enumerable: false,
			configurable: true,
			writable: false,
			value: function(prop, handler) {
				var
					oldval = this[prop],
					newval = oldval,
					getter = function() {
						return newval;
					},
					setter = function(val) {
						oldval = newval;
						return (newval = handler.call(this, prop, oldval, val));
					};

				if (delete this[prop]) {
					Object.defineProperty(this, prop, {
						get: getter,
						set: setter,
						enumerable: true,
						configurable: true
					});
				}
			}
		});
	}

	if (!Object.prototype.unwatch) {
		Object.defineProperty(Object.prototype, "unwatch", {
			enumerable: false,
			configurable: true,
			writable: false,
			value: function(prop) {
				var val = this[prop];
				delete this[prop];
				this[prop] = val;
			}
		});
	}
	/* end object.watch polyfill */

	window.d20ext = {};
	window.watch("d20ext", function(id, oldValue, newValue) {
		d20plus.log("> Set Development");
		newValue.environment = "development";
		return newValue;
	});

	window.d20 = {};
	window.watch("d20", function(id, oldValue, newValue) {
		d20plus.log("> Obtained d20 variable");
		window.unwatch("d20ext");
		window.d20ext.environment = "production";
		newValue.environment = "production";
		return newValue;
	});

	d20plus.log("> Injected");
};

// Inject
if (window.top == window.self)
	unsafeWindow.eval("(" + D20plus.toString() + ")('" + GM_info.script.version + "')");
