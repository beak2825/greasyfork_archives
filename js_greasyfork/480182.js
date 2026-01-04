// ==UserScript==
// @name         ALE+
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Improves level editor
// @author       You
// @match        https://www.plazmaburst2.com/level_editor/map_edit.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=plazmaburst2.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480182/ALE%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/480182/ALE%2B.meta.js
// ==/UserScript==

let script = document.createElement("script");

script.src = "data:text," + escape(`

// Style

let saveMap = document.getElementsByClassName("field_btn")[0];
let leftPanel = document.getElementById("left_panel");
let download = document.createElement("a");
let p = document.createElement("p");

p.style.fontSize = "16px";
p.style.fontFamily = "monospace";
p.style.color = "#eee";
p.style.backgroundColor = "#000";
p.style.padding = "6px";
p.style.width = "fit-content";
p.style.borderRadius = "4px";
p.style.wordBreak = "break-all";
p.style.position = "absolute";
p.style.left = "-100px";
p.style.top = "-100px";

document.body.append(p);

function updateStyle() {
	let topPanel = document.getElementById("top_panel");
	let rightPanel = document.getElementById("right_panel");
	let objectBoxHider = document.getElementById("objboxhider");
	let versionRights = document.getElementById("version_rights");
	let editAsText;
	let snapping5;
	let snapping10;
	let rights = document.getElementsByClassName("field_dis_left")[1];
	let mapRights = document.getElementById("maprights");
	let parambox = document.getElementById("parambox");
	let versionText = versionRights.childNodes[0];

	let buttonElements = document.getElementsByClassName("tool_btn tool_wid");

	for (let i = 0; i < buttonElements.length; i++) {
		if (buttonElements[i].style.width == "100%") {
			editAsText = buttonElements[i];
		}
	}

	document.querySelectorAll("a").forEach(elem => {
		if (elem.onmousedown == "function onmousedown(event) {\\nGridSnappingSet(50);\\n}") {
			snapping5 = elem;
		}

		if (elem.onmousedown == "function onmousedown(event) {\\nGridSnappingSet(100);\\n}") {
			snapping10 = elem;
		}
	});

	topPanel.style.backgroundColor = "rgb(8, 8, 8)";
	leftPanel.style.backgroundColor = "rgb(8, 8, 8)";
	rightPanel.style.backgroundColor = "rgb(8, 8, 8)";

	topPanel.style.backgroundImage = "none";
	leftPanel.style.backgroundImage = "none";
	rightPanel.style.backgroundImage = "none";

	objectBoxHider.style.marginBottom = "4px";

	if (editAsText) {
		editAsText.style.marginTop = "4px";
	}

	versionRights.style.marginTop = "4px";
	versionText.style.fontSize = "16px";
	versionText.style.fontFamily = "monospace";
	versionText.style.fontWeight = "bold";
	versionText.style.color = "#00FF00";
	versionText.innerHTML = "ALE+ by gCP5o";

	if (innerWidth >= 1400) {
		versionRights.style.display = "block";
	} else {
		versionRights.style.display = "none";
	}

	if (innerWidth >= 1250) {
		rights.style.display = "inline-block";
		mapRights.style.display = "inline-block";
	} else {
		rights.style.display = "none";
		mapRights.style.display = "none";
	}

	topPanel.style.height = "48px";

	leftPanel.style.top = "48px";
	rightPanel.style.top = "48px";

	if (snapping5) {
		snapping5.onmousedown = function() {
			GridSnappingSet(40);
		}

		snapping5.innerHTML = "4";
	}

	if (snapping10) {
		snapping10.onmousedown = function() {
			GridSnappingSet(50);
		}

		snapping10.innerHTML = "5";
	}

	document.querySelectorAll("*").forEach(elem => {
		if (elem.className != "notediv" && elem != versionText && elem != p) {
			if (elem.parentElement) {
				if (elem.parentElement.parentElement) {
					if (elem.parentElement.parentElement != parambox && elem.parentElement.className != "pa2 p_u2" && elem.parentElement.parentElement.className != "pa2 p_u2") {
						elem.style.color = "#aaa";
						elem.style.opacity = 1;
					}
				} else {
					if (elem.parentElement.parentElement != parambox && elem.parentElement.className != "pa2 p_u2") {
						elem.style.color = "#aaa";
						elem.style.opacity = 1;
					}
				}
			}

			if (elem.style.marginTop == "-100px") {
				elem.style.marginTop = "";
			}

			if (elem.getBoundingClientRect().y == 48 && elem.className == "field_btn") {
				elem.style.marginTop = "-100px";
			}

			if (elem.title) {
				elem.dataset.title = elem.title;
				elem.title = "";
			}
		}
	});
}

function downloadXML() {
	let newstr = "";

	for (let i = 0; i < es.length; i++) {
		if (es[i].exists) {
			newstr += compi_obj(i);
		}
	}

	download.href = "data:text," + escape(newstr);
	download.download = mapid_field.value + ".xml";

	download.click();
	download.href = "";
}

document.querySelectorAll("input").forEach(elem => {
	if (elem.onclick == "function onclick(event) {\\nwindow.open('../level_editor_manual/','_blank');\\n}") {
		elem.onclick = function() {
			window.open("https://eaglepb2.gitbook.io/pb2-editor-manual/");
		}

		elem.dataset.title = "Editor Manual by EaglePB2";
	}

	if (elem.onclick == "function onclick(event) {\\nTestMap()\\n}") {
		elem.onclick = function() {
			downloadXML();
		}

		elem.value = "Download XML";
	}
});

llcGIODil = "#111";
licOIODIl = "48px";

need_redraw = 1;

document.onmousedown = function() {
	setTimeout(function() {
		updateStyle();
	}, 10);
}

document.onmouseup = function() {
	setTimeout(function() {
		updateStyle();
	}, 10);
}

document.addEventListener("mousemove", e => {
	if (e.target.dataset.title) {
		p.style.left = e.clientX + 20 + "px";
		p.style.top = e.clientY + "px";
		p.innerHTML = e.target.dataset.title;

		if (p.getBoundingClientRect().height != 31) {
			p.style.left = "0px";
			p.style.left = e.clientX - 20 - p.getBoundingClientRect().width + "px";
		}
	} else if (e.target.parentElement) {
		if (e.target.parentElement.dataset.title) {
			p.style.left = e.clientX + 20 + "px";
			p.style.top = e.clientY + "px";
			p.innerHTML = e.target.parentElement.dataset.title;

			if (p.getBoundingClientRect().height != 31) {
				p.style.left = "0px";
				p.style.left = e.clientX - 20 - p.getBoundingClientRect().width + "px";
			}
		} else {
			p.style.left = "-100px";
			p.style.top = "-100px";
		}
	} else {
		p.style.left = "-100px";
		p.style.top = "-100px";
	}
});

document.body.onresize = function() {
	updateStyle();
	resize();
}

document.body.onload = function() {
	ThemeSet(THEME_DARK);
	updateStyle();
}

function findObjects(name) {
	let notFound = 1;

	for (let i = 0; i < es.length; i++) {
		es[i].selected = 0;

		if (es[i].pm.uid) {
			if (es[i].pm.uid.includes(name) && MatchLayer(es[i])) {
				es[i].selected = 1;
				notFound = 0;
			}
		}
	}

	need_GUIParams_update = 1;
	need_redraw = 1;

	setTimeout(function() {
		updateStyle();
	}, 100);

	return notFound;
}

document.addEventListener("keydown", e => {
	if (e.ctrlKey && e.code == "KeyS") {
		e.preventDefault();
		saveMap.click();
	}

	if (e.ctrlKey && e.code == "KeyF") {
		e.preventDefault();

		let name = prompt("Find objects:", "");

		if (name !== null && name !== "") {
			let notFound = findObjects(name);

			if (notFound) {
				alert("Nothing found.");
			}
		}
	}

	if (e.ctrlKey && e.code == "KeyZ") {
		setTimeout(function() {
			updateStyle();
		}, 100);
	}

	if (e.ctrlKey && e.code == "KeyY") {
		setTimeout(function() {
			updateStyle();
		}, 100);
	}
});

document.addEventListener("keyup", e => {
	if (e.key == "Alt") {
		e.preventDefault();
	}
});

active_layers = "";

NewNote("ALE+ by gCP5o", "#FF0");

// Logic

function CopyToClipBoard(ClipName) {
    var str = llcDlCl;
    var clipboard = new Array();
    for (var i = 0; i < es.length; i++)
        if (es[i].exists)
            if (es[i].selected)
                if (MatchLayer(es[i])) {
                    clipboard[clipboard.length] = es[i];
                }
    str = serialize(clipboard);
    localStorage[ClipName] = str;
}

function PasteFromClipBoard(ClipName) {
    var clipboard = new Object();
    if (localStorage[ClipName] == undefined) {
        return false;
    }
    clipboard = unserialize(localStorage[ClipName]);
    lcz();
    for (var i = 0; i < es.length; i++)
        if (es[i].exists) {
            if (es[i].selected) {
                ldn(llCGIcGIl + i + liOGlOGIl);
                lnd(llCGIcGIl + i + llODiCOil);
                es[i].selected = false;
            }
        }
    var min_x = 0;
    var max_x = 0;
    var min_y = 0;
    var max_y = 0;
    i = 0;
    var from_obj = es.length;
    while (typeof (clipboard[i]) !== llcGiOl) {
        var newparam = es.length;
        ldn(llCGIcGIl + newparam + licGICDll);
        lnd(llCGIcGIl + newparam + llcGiCDil);
        es[newparam] = new E(clipboard[i]._class);
        for (param in clipboard[i]) {
            es[newparam][param] = clipboard[i][param];
        }
        if (typeof (es[newparam].pm.x) !== llcGiOl)
            if (typeof (es[newparam].pm.y) !== llcGiOl) {
                if (i == 0) {
                    min_x = es[newparam].pm.x;
                    min_y = es[newparam].pm.y;
                    max_x = es[newparam].pm.x;
                    max_y = es[newparam].pm.y;
                    if (typeof (es[newparam].pm.w) !== llcGiOl)
                        if (typeof (es[newparam].pm.h) !== llcGiOl) {
                            min_x += es[newparam].pm.w / 2;
                            max_x += es[newparam].pm.w / 2;
                            min_y += es[newparam].pm.h / 2;
                            max_y += es[newparam].pm.h / 2;
                        }
                } else {
                    min_x = Math.min(min_x, es[newparam].pm.x);
                    min_y = Math.min(min_y, es[newparam].pm.y);
                    max_x = Math.max(max_x, es[newparam].pm.x);
                    max_y = Math.max(max_y, es[newparam].pm.y);
                    if (typeof (es[newparam].pm.w) !== llcGiOl)
                        if (typeof (es[newparam].pm.h) !== llcGiOl) {
                            max_x = Math.max(max_x, es[newparam].pm.x + es[newparam].pm.w);
                            max_y = Math.max(max_y, es[newparam].pm.y + es[newparam].pm.h);
                        }
                }
            }
        i++;
    }
    ldn(lICGicDll);
    ldn(llODiCGil);
    ldn(lICOIcDIl);
    lnd(llCOlcDIl);
    lnd(llOGiODIl);
    lnd(lICDiCOIl);
    ldis = true;
    paint_draw_mode = true;
    quick_pick_ignore_one_click = true;
    m_drag_x = mouse_x;
    m_drag_y = mouse_y;
    lmdrwa = lmwa;
    lmdrwb = lmwb;
    var lo_x = lmwa - (max_x + min_x) / 2;
    var lo_y = lmwb - (max_y + min_y) / 2;
    for (var i2 = from_obj; i2 < es.length; i2++) {
        if (typeof (es[i2].pm.uid) !== llcGiOl) {
            var old_uid = es[i2].pm.uid;
            es[i2].exists = false;
            es[i2].pm.uid = RandomizeName(es[i2].pm.uid);
            es[i2].exists = true;
            for (var i3 = from_obj; i3 < es.length; i3++) {
                for (param in es[i3].pm) {
                    if (typeof (es[i3].pm[param]) == llcGICl) {
                        if (es[i3].pm[param] == old_uid) {
                            es[i3].pm[param] = es[i2].pm.uid;
                        }
                    }
                }
            }
        }
        if (typeof (es[i2].pm.x) !== llcGiOl)
            if (typeof (es[i2].pm.y) !== llcGiOl) {
                lnd(llCGIcGIl + i2 + llcGiODil + es[i2].pm.x + liODlcGIl);
                lnd(llCGIcGIl + i2 + liODlcDil + es[i2].pm.y + liODlcGIl);
                es[i2].pm.x += lo_x;
                es[i2].pm.y += lo_y;
                es[i2].fixPos();
                ldn(llCGIcGIl + i2 + llcGiODil + es[i2].pm.x + liODlcGIl);
                ldn(llCGIcGIl + i2 + liODlcDil + es[i2].pm.y + liODlcGIl);
            }
    }
    lfz(false);
    return true;
}

function setletedit(val1, val2, defval) {
    quick_pick = false;
    quick_pick_ignore_one_click = false;
	if (val1.indexOf) {
		if (val1.indexOf(lIOGiCOl) != -1) {
			defval = Math.abs(Number(defval));
			var txt = prompt(lIODlODil, defval);
			var gotval;
			if (txt == null || txt == llcDlCl) {
				gotval = Math.abs(defval);
			} else {
				gotval = Math.abs(txt);
			}
			val1 = eval(val1.replace(lIOGiCOl, gotval));
			val2 = val2.replace(llOGICDil, gotval);
		} else if (val1.indexOf(lICOlCOil) != -1) {
			defval = Math.abs(Number(defval));
			var gotval = prompt(liCDlcDil, defval);
			if (gotval.charAt(0) != llOGICDil) {
				gotval = llOGICDil + gotval;
			}
			if (gotval.length != 7)
				alert(liCGICDll + gotval + licOiOOil);
			val1 = val1.replace(lICOlCOil, gotval);
			val2 = val2.replace(llOGICDil, gotval);
		}
	}
    ff.value = llOGIcDIl + val1 + llCGICOIl + val2 + llOOICDll;
    lettarget.innerHTML = ff.value;
    ff.style.display = lIOGIOGll;
    ff_drop.style.display = lIOGIOGll;
    letediting = false;
    UpdatePhysicalParam((lettarget.id.replace(lIcDIOOIl, llcDlCl)), val1);
    var parameter_updated = lettarget.id.replace(lIcDIOOIl, llcDlCl);
    if (parameter_updated == lICGICl || (parameter_updated.indexOf(llCDiOOl) != -1 && parameter_updated.indexOf(licOIcGl) != -1))
        StreetMagic();
}

function stopedit(e) {
	if (e) {
		if (e.keyCode == 13 && e.type == "keydown") {
			let chvalue = ff.value;

			if (!isNaN(Number(chvalue))) {
				UpdatePhysicalParam((lettarget.id.replace(lIcDIOOIl, llcDlCl)), Number(chvalue));

				lettarget.innerHTML = chvalue;

				need_GUIParams_update = 1;

				setTimeout(function() {
					updateStyle();
				}, 100);
			} else {
				chvalue = chvalue.replaceAll("<", "&lt;");
				chvalue = chvalue.replaceAll(">", "&gt;");
				chvalue = chvalue.replaceAll('"', "&quot;");

				UpdatePhysicalParam((lettarget.id.replace(lIcDIOOIl, llcDlCl)), chvalue);

				lettarget.innerHTML = chvalue;

				need_GUIParams_update = 1;

				setTimeout(function() {
					updateStyle();
				}, 100);
			}
		}
	}
}

function UpdatePhysicalParam(paramname, chvalue) {
    lcz();
    var layer_mismatch = false;
    var list_changes = llcDlCl;
    for (var elems = 0; elems < es.length; elems++)
        if (es[elems].exists)
            if (es[elems].selected) {
                if (es[elems].pm.hasOwnProperty(paramname)) {
                    if (MatchLayer(es[elems])) {
                        var lup = (typeof (paramname) == llcGICl) ? llcOIODll + paramname + llcOIODll : paramname;
                        if (typeof (chvalue) == lICDIODIl || chvalue == 0) {
                            lnd(llCGIcGIl + elems + llCDlODll + lup + licDICOIl + es[elems].pm[paramname] + liODlcGIl);
                            ldn(llCGIcGIl + elems + llCDlODll + lup + licDICOIl + chvalue + liODlcGIl);

							if (chvalue !== "") {
								es[elems].pm[paramname] = Number(chvalue);
							} else {
								es[elems].pm[paramname] = "";
							}
                        } else if (typeof (chvalue) == llcGICl) {
                            lnd(llCGIcGIl + elems + llCDlODll + lup + llCGicOIl + es[elems].pm[paramname] + llOGicGIl);
                            ldn(llCGIcGIl + elems + llCDlODll + lup + llCGicOIl + chvalue + llOGicGIl);
                            es[elems].pm[paramname] = chvalue;
                        } else {
                            alert(llOOlCOll + typeof (chvalue));
                        }
                        list_changes += llODlOOIl + paramname + lIcOicDil + (es[elems].pm.uid != null ? es[elems].pm.uid : es[elems]._class) + llOGIOGil + chvalue + llcGICOil;
                    } else
                        layer_mismatch = true;
                }
            }
    need_redraw = true;
    NewNote(llCGicDll + list_changes, note_passive);
    if (layer_mismatch)
        NewNote(liCDlcGll, note_neutral);
    lfz(false);
}

document.addEventListener("keydown", e => {
	if (e.code == "AltLeft" && letediting) {
		let value = prompt("Enter string-value:", "");

		if (value !== null) {
			setletedit(value, "Custom Value", "");

			need_GUIParams_update = 1;

			setTimeout(function() {
				updateStyle();
			}, 100);
		}
	}

	if (e.code == "AltRight") {
		let value = prompt("Enter snapping:", "");

		if (value !== null) {
			GridSnappingSet(Math.round(value * 10));

			setTimeout(function() {
				updateStyle();
			}, 10);
		}
	}
});

function UpdateTools() {
    var str = llCOIOGIl;
    str += lIcOICGll;
    for (var i = 0; i < possible_tools.length; i++) {
        if (possible_tools[i] == active_tool)
            str += lIODIOOil + possible_tools_descr[i] + llCGICOIl + lrpc(possible_tools[i]) + lIcOiCDll;
        else
            str += lIcGIOGil + possible_tools_descr[i] + lIODlOOil + i + llOOlcOil + lrpc(possible_tools[i]) + lIcOiCDll;
        if (i % 2 == 1)
            str += llOOlCl;
    }
    str += llcOICGll;
    str += lIcOICGll;
    if (ADVANCED_LAYERS)
        str += liOGicOIl;
    else
        str += lIOOiOGll;
    var seltot = 0;
    for (var i = 0; i < known_class.length; i++) {
        if (lacl[i])
            seltot++;
        if (ADVANCED_LAYERS)
            str += liCGIOGIl + (lacl[i] ? '2' : llcDlCl) + liCDIOGil + i + llOGICDll + name_layers[i] + lIOGlODIl;
    }
    str += liCGIOGIl + (seltot == known_class.length ? '2' : llcDlCl) + llcGIcGil;
    str += liCGIOGIl + (seltot == 0 ? '2' : llcDlCl) + lIcOIcDll;
    if (!ADVANCED_LAYERS) {
        str += liCGIOGIl + (last_clicked_layer == -3 ? '2' : llcDlCl) + llODicOll;
        str += liCGIOGIl + (last_clicked_layer == -4 ? '2' : llcDlCl) + llCGlCOil;
        str += liCGIOGIl + (last_clicked_layer == -5 ? '2' : llcDlCl) + llOGIcGIl;
    }
    str += llcGicGll;
    str += lIcOICGll;
    str += liCGIOGIl + (GRID_ALPHA == 0 ? '2' : llcDlCl) + liCGiOOll;
    str += liCGIOGIl + (GRID_ALPHA == 0.5 ? '2' : llcDlCl) + lIOGlODll;
    str += liCGIOGIl + (GRID_ALPHA == 1 ? '2' : llcDlCl) + lIcGiOGll;
    str += lICGlOOil;
    str += lIcOICGll;
    str += liCGIOGIl + (GRID_SNAPPING == 10 ? '2' : llcDlCl) + lIOGiOGil;
    str += liCGIOGIl + (GRID_SNAPPING == 40 ? '2' : llcDlCl) + licGiCGll;
    str += liCGIOGIl + (GRID_SNAPPING == 50 ? '2' : llcDlCl) + lIOGlOGIl;
    str += liODiODIl;
    str += lIcOICGll;
    str += liCGIOGIl + (SHOW_CONNECTIONS == false ? '2' : llcDlCl) + lIODiOGIl;
    str += liCGIOGIl + (SHOW_CONNECTIONS == true ? '2' : llcDlCl) + llcOICGil;
    str += llCGiCOll;
    str += lIcOICGll;
    str += liCGIOGIl + (THEME == THEME_BLUE ? '2' : llcDlCl) + lIcOlcOll;
    str += liCGIOGIl + (THEME == THEME_DARK ? '2' : llcDlCl) + lIOOIODll;
    str += liCGIOGIl + (THEME == THEME_PURPLE ? '2' : llcDlCl) + liCOicDil;
    str += liCGIOGIl + (THEME == THEME_GREEN ? '2' : llcDlCl) + llOOiOOIl;
    str += llOOIOOll;
    str += lIcOICGll;
    str += liCGIOGIl + (SHOW_TEXTURES == false ? '2' : llcDlCl) + llcOIODIl;
    str += liCGIOGIl + (SHOW_TEXTURES == true ? '2' : llcDlCl) + licGICOil;
    str += lICGICDil;
    str += lIcOICGll;
    str += liCGIOGIl + (ctx.imageSmoothingEnabled == false ? '2' : llcDlCl) + lIcDlCDll;
    str += liCGIOGIl + (ctx.imageSmoothingEnabled == true ? '2' : llcDlCl) + llOOIOGIl;
    tools_box.innerHTML = str;
}

function DeleteSelection() {
    lcz();
    for (var i = 0; i < es.length; i++)
        if (es[i].exists)
            if (es[i].selected)
                if (MatchLayer(es[i])) {
                    ldn(llCGIcGIl + i + liCDlODIl + i + llcGiCDil);
                    lnd(llCGIcGIl + i + llCOlODIl + es[i].selected + liOGicGll + i + lIcOICDll + es[i].exists + liODlcGIl);
                }
    lfz(true);
    need_GUIParams_update = true;
    need_redraw = true;

	setTimeout(function() {
		updateStyle();
	}, 100);
}

console.clear();

`);

document.body.append(script);