// ==UserScript==
// @name         Better Editor
// @version      2.3.1
// @author       Apx
// @description  Makes editor a bit better
// @match        https://bonk.io/gameframe-release.html
// @match        https://bonkisback.io/gameframe-release.html
// @run-at       document-start
// @grant        none
// @namespace    https://greasyfork.org/users/1272759
// @downloadURL https://update.greasyfork.org/scripts/504131/Better%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/504131/Better%20Editor.meta.js
// ==/UserScript==

// for use as a userscript ensure you have Excigma's code injector userscript
// https://greasyfork.org/en/scripts/433861-code-injector-bonk-io

let injector = (src) => {
	let newSrc = src;

	function patch (src, newsrc) {
		newSrc = newSrc.replace(src, newsrc);
	};
	function log (regex) {
		console.log(typeof(regex) == "string"?regex:(Array.isArray(regex)?regex:newSrc.match(regex)));
	};
	function escapeRegExp (string) {
		return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	};
	function buildRegex (pattern, options) {
		return new RegExp(pattern.replace(/(?<!\\)\$var/g, '[a-zA-Z0-9\\$_]{3}')       // var - variable
		.replace(/(?<!\\)\$elem/g, '\\[[0-9]+]')                                       // elem - array element
		.replace(/(?<!\\)\$prop/g, '\\[[a-zA-Z0-9\\$_]{3}\\[[0-9]+](?:\\[[0-9]+])?]')  // prop - object property
		, options);
	}
	
window.bonkEditor = {};

window.bonkEditor.rangeView = 1024; // in kilobytes
window.bonkEditor.bypassMergeIntoNewMap = false;
window.bonkEditor.disablePositionRounding = false;
window.bonkEditor.tutorial = true; // Shows up tutorial messages in chat when player joins or creates a game
window.bonkEditor.toStore = Object.keys(window.bonkEditor);

const updateLocalStorage = function () {
    localStorage.setItem("bonkEditor", JSON.stringify(Object.fromEntries(window.bonkEditor.toStore.map( value => [value, window.bonkEditor[value]] ))));
};

/* BONK TRANSPARENCY */
window.bonkEditor.fromHEX = function fromHEX (color) {
	return {
		hex: color & 0xffffff,
		// get 127 bits before the last. If the value is 0, show as 100 to make the mod compatible with non transparent shapes 
		transparency: (color >> 24 & 127) == 0? 1 : ((color >> 24 & 127) - 1) / 100,
		// last bit
		noshadow: !!(color >> 31 & 1),
	};
};
window.bonkEditor.toHEX = function () {
	return (document.getElementById('mapeditor_colorpicker_transparency_slider').value != '1'? (document.getElementById('mapeditor_colorpicker_transparency_slider').valueAsNumber * 100 + 1) * 0x01000000 : 0) + (document.getElementById('mapeditor_colorpicker_noshadow').checked? 0x80000000 : 0);
};
window.bonkEditor.elements = function () {
	return {
		slider: document.getElementById('mapeditor_colorpicker_transparency_slider'),
		noshadow: document.getElementById('mapeditor_colorpicker_noshadow'),
	};
};
window.bonkEditor.updateElements = function (hex) {
	if(hex){
		document.getElementById('mapeditor_colorpicker_noshadow').checked = window.bonkEditor.fromHEX(hex).noshadow;
		document.getElementById('mapeditor_colorpicker_transparency_slider').value = window.bonkEditor.fromHEX(hex).transparency;
	}
	let label = document.getElementById('mapeditor_colorpicker_transparencylabel');
	switch (parseFloat(document.getElementById('mapeditor_colorpicker_transparency_slider').value)) {
		case 1:
			label.textContent = 'Transparency: opaque';
			break;
		case 0:
			label.textContent = 'Transparency: transparent';
			break;
		default:
			label.textContent = `Transparency: ${document.getElementById('mapeditor_colorpicker_transparency_slider').valueAsNumber * 100}%`;
	}
};

/* BETTER EDITOR */
window.bonkEditor.isCrashed = false;
window.bonkEditor.lineWidth = function lineWidth (width, editor) {
	if(editor.getStageScale) return width / editor.getStageScale();
	return width;
};
window.bonkEditor.distance = function distance (a, b) {
	let cX = a[0] - b[0];
	let cY = a[1] - b[1];
	return Math.sqrt(cX * cX + cY * cY);
};
window.bonkEditor.holdingShift = false;
window.bonkEditor.alignmentMode = 0;
window.bonkEditor.vertexData = null;
window.bonkEditor.createVertexMap = physics => {
	let vertexData = [];
	const bodies = physics.bodies;
	const shapes = physics.shapes;
	const fixtures = physics.fixtures;
	let calcPos = (vertice, shape, body) => {
		let pos = {x: vertice[0] * Math.cos(shape.a) - vertice[1] * Math.sin(shape.a) + shape.c[0], y: vertice[0] * Math.sin(shape.a) + vertice[1] * Math.cos(shape.a) + shape.c[1]};
		return {x: pos.x * Math.cos(body.a) - pos.y * Math.sin(body.a) + body.p[0], y: pos.x * Math.sin(body.a) + pos.y * Math.cos(body.a) + body.p[1]};
	}
	for(let body in bodies) {
		for(let fx in bodies[body].fx) {
			let shId = fixtures[bodies[body].fx[fx]];
			let shape = shapes[fixtures[bodies[body].fx[fx]].sh];
			if(shape.type == "po") {
				shape.v.forEach(v => {
					vertexData.push({
						c: calcPos(v, shape, bodies[body]),
						sh: shId
					});
				});
			}
			else if(shape.type == "bx") {
				vertexData.push(
					{c: calcPos([shape.w / 2, shape.h / 2], shape, bodies[body]), sh: shId},
					{c: calcPos([-shape.w / 2, shape.h / 2], shape, bodies[body]), sh: shId},
					{c: calcPos([-shape.w / 2, -shape.h / 2], shape, bodies[body]), sh: shId},
					{c: calcPos([shape.w / 2, -shape.h / 2], shape, bodies[body]), sh: shId}
				);
			}
		}
	}
	window.bonkEditor.vertexData = vertexData;
};
window.bonkEditor.findClosestVertice = function (point, max = 20) {
	if(!this.vertexData) return null;
	let data = this.vertexData;
	let closest = null;
	data.forEach(elem => {
		let distance = this.distance(point, [elem.c.x, elem.c.y]);
		if(distance < max) {
			if(!closest || closest.d > distance) closest = {d: distance, c: elem.c};
		}
	});
	return closest;
};
window.bonkEditor.calcPos = (vertice, body) => {
	vertice = [vertice.x - body.p[0], vertice.y - body.p[1], -body.a];
	return [vertice[0] * Math.cos(vertice[2]) - vertice[1] * Math.sin(vertice[2]), vertice[0] * Math.sin(vertice[2]) + vertice[1] * Math.cos(vertice[2])];
};
window.bonkEditor.editorTools = null; // injected from aplpha2s
window.bonkEditor.canvas = document.createElement('canvas');

const betterEditorCSS = document.createElement('style');
betterEditorCSS.innerHTML = `
#mapeditor_colorpicker_transparency_slider{
    margin-left: 0px;
    background-color: transparent;
    margin-top: -2px;
}

#mapeditor_colorpicker_transparencylabel, #mapeditor_colorpicker_shadowlabel {
    color: #ffffff;
}

#mapeditor_colorpicker_noshadow {
    position: relative;
    top: 1px;
    margin-left: 6px;
    margin-bottom: 11px;
}

.mapeditor_colorpicker_existingtile {
    background-repeat: no-repeat;
}

#mapeditor_colorpicker_existingcontainer {
    margin-top: 11px;
}

.mapeditor_colorpicker_button {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg' fill='%23fff' transform='matrix(-1,0,0,1,0,0)'%3E%3Cpath d='M6.5,16.5 38,48 50,50 45,45 40,44 11,15 l4,-4 29,29 1,5 5,5 L48,38 16.5,6.5 20,3 17,0 11,6 5,0 0,5 6,11 0,17 3,20'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    width: 30px;
    height: 22px;
    background-size: 18px;
    background-position-x: calc(15px - 9px);
    background-position-y: calc(11px - 9px);
    border: 1px solid #fff;
    border-radius: 4px;
}

.mapeditor_colorpicker_button:hover {
    background-color: rgba(50, 66, 84, 0.5);
}

.mapeditor_colorpicker_button_on {
    pointer-events: none !important;
    background-color: rgba(50, 66, 84, 1);
    border: 1px solid #00000000 !important;
}

.mapeditor_midbox_leftbutton_sub {
    display: inline-block;
    height: 24px;
}

.mapeditor_midbox_leftbutton_sub_checkbox {
    display: inline-block;
    height: 24px;
    margin: 0;
    margin-left: 5px;
}

.mapeditor_midbox_leftbutton_sub_text {
    padding-left: 5px;
    position: absolute;
    width: max-content;
}`;
document.getElementsByTagName('head')[0].appendChild(betterEditorCSS);

let transparencylabel = document.createElement('span');
document.getElementById('mapeditor_colorpicker').insertBefore(transparencylabel, document.getElementById('mapeditor_colorpicker_existingcontainer'));
transparencylabel.outerHTML = `<span id="mapeditor_colorpicker_transparencylabel">Transparency: Opaque</span>`;
let slider = document.createElement('input');
document.getElementById('mapeditor_colorpicker').insertBefore(slider, document.getElementById('mapeditor_colorpicker_existingcontainer'));
slider.outerHTML = `<input type="range" class="compactSlider compactSlider_classic" min="0" max="1" value="1" step="0.01" id="mapeditor_colorpicker_transparency_slider">`;
let shadowlabel = document.createElement('span');
document.getElementById('mapeditor_colorpicker').insertBefore(shadowlabel, document.getElementById('mapeditor_colorpicker_existingcontainer'));
shadowlabel.outerHTML = `<span id="mapeditor_colorpicker_shadowlabel">No Shadow</span>`;
let shadowcheckbox = document.createElement('input');
document.getElementById('mapeditor_colorpicker').insertBefore(shadowcheckbox, document.getElementById('mapeditor_colorpicker_existingcontainer'));
shadowcheckbox.outerHTML = `<input type="checkbox" id="mapeditor_colorpicker_noshadow"></input>`;
let droppercheckbox = document.createElement('input');
document.getElementById('mapeditor_colorpicker').insertBefore(droppercheckbox, document.getElementById('mapeditor_colorpicker_existingcontainer'));
droppercheckbox.outerHTML = `<div id="mapeditor_colorpicker_dropper" class="mapeditor_colorpicker_button"></div>`;
// thanks salama
const chatHandler = e => {
    if(e.keyCode === 13) {
        if(e.target.value.length > 0) {
            if(e.target.value[0] === '/') {
                let command = e.target.value.split(' ')[0].substring(1);
                let args = e.target.value.split(' ').slice(1);
                newArgs = [];
                for(let i = 0; i < args.length; i++) {
                    if(args[i][0] === '"' && args[i][args[i].length - 1] !== '"') {
                        let str = args[i];
                        for(let j = i + 1; j < args.length; j++) {
                            str += ' ' + args[j];
                            if(args[j][args[j].length - 1] === '"') {
                                i = j;
                                break;
                            }
                        }
                        newArgs.push(str.substring(1, str.length - 1));
                    }
                    else if(args[i][0] === '"' && args[i][args[i].length - 1] === '"') {
                        newArgs.push(args[i].substring(1, args[i].length - 1));
                    }
                    else {
                        newArgs.push(args[i]);
                    }
                }
                args = newArgs;

                let oldMsg = e.target.value + '';

                // set value to empty string so it wont display a command misspelling error
                e.target.value = '';
                if(command == 'editorhelp') {
                    window.bonkEditor.menu.showStatusMessage('/rangeview 0 to 1048576 -- Sets rangeview for maps (for loading huge maps). Default value is 100KB', '#b53030');
                    window.bonkEditor.menu.showStatusMessage('/toggletutorial -- Toggles tutorial mode, which displays messages in chat when you join or create room', '#b53030');
                    return;
                }
                else if(command == 'toggletutorial') {
                    window.bonkEditor.tutorial = !window.bonkEditor.tutorial;
                    window.bonkEditor.menu.showStatusMessage(`* Tutorial mode is now ${window.bonkEditor.tutorial? 'enabled' : 'disabled'}.`, '#b53030');
                    //return;
                }
                else if(command == 'rangeview') {
                    if(isNaN(parseInt(args[0]))) {
                        bonkEditor.menu.showStatusMessage('* Invalid parameters', '#b53030');
                        return;
                    }
                    window.bonkEditor.rangeView = Math.max(0, Math.min(1048576, parseInt(args[0])));
                    bonkEditor.menu.showStatusMessage(`* RangeView has been set to ${window.bonkEditor.rangeView} kilobytes.`, '#b53030');
                    updateLocalStorage();
                }
                else {
                    e.target.value = oldMsg;
                }
            }
        }
    }
}

document.getElementById('newbonklobby_chat_input').addEventListener('keydown', chatHandler, true);
document.getElementById('ingamechatinputtext').addEventListener('keydown', chatHandler, true);

// also make a message that appears when player joins or creates lobby
let newRoomRegex = newSrc.match(buildRegex('($var$elem)=new $var\\($var$elem,$var$elem,$var$elem,$var\\[0]\\[1]\\);'));
patch(newRoomRegex[0], newRoomRegex[0] +
`
if(window.bonkEditor.tutorial) {
    window.bonkEditor.menu.showStatusMessage("* Type '/editorhelp' in chat to show the list of all Better Editor's commands.", '#b53030');
    window.bonkEditor.menu.showStatusMessage("* If you don't want to display this message again, type '/toggletutorial' in chat.", '#b53030');
}
`);	
// I don't like it |
//                 v

// add 4th channel
patch(/<= 0xffffff\){/, `<= 0xffffffff){`);

// add shape transparency to map preview
const mapPreviewFixtColor = newSrc.match(/(?<=\(0xff0000\);).*?;/);
let color = mapPreviewFixtColor[0].match(/(?<=\().*?\)/)[0].replace(")", "");
patch(mapPreviewFixtColor, `${mapPreviewFixtColor[0].split("(")[0]}(window.bonkEditor.fromHEX(${color}).hex, window.bonkEditor.fromHEX(${color}).transparency);`);

// add shape transparency to in game & editor map
const mapFixtColor = newSrc.match(/\];}}}else {this.*?(?=\))/);
color = mapFixtColor[0].split("(")[1];
patch(mapFixtColor,`${mapFixtColor[0].split("(")[0]}(window.bonkEditor.fromHEX(${color}).hex, window.bonkEditor.fromHEX(${color}).transparency`);

// color picker (transparency slider and no shadow checkbox)
const colorPicker = newSrc.match(/,[a-zA-Z0-9\$_]{3}[[0-9]{1,3}]\);}}}(?=(?!catch)...[[0-9]{1,3}](?=\[))/);
const onColorPicker = newSrc.match(/(?:...\[[0-9]{1,3}]=...\[0]\[[0-9]{1,3}];){3}(?=...\(false)/);
const saveColor = newSrc.match(/\)\);}...\[[0-9]{1,3}]=null/);
patch(colorPicker, colorPicker + `
window.bonkEditor.elements().slider.oninput = function(){
	${newSrc.match(new RegExp(`(?<=${escapeRegExp(colorPicker[0])}.*?0.73;).*?false\\)`))};
};
window.bonkEditor.elements().slider.onchange=window.bonkEditor.elements().slider.oninput;
window.bonkEditor.elements().noshadow.onchange=window.bonkEditor.elements().slider.oninput;
`);
patch(onColorPicker, onColorPicker[0] + `window.bonkEditor.updateElements(arguments[0]);`);
patch(saveColor, saveColor[0].replace("))",`),window.bonkEditor.toHEX())`));

// right color picker
const rightColorPicker = newSrc.match(/\]\],function\(...\){(?:[^\.]*?;){3}/);
color = rightColorPicker[0].split("]]=");
patch(rightColorPicker, `${color[0]}]]=${color[1].replace(";","")} + (arguments[1] == undefined? 0 : arguments[1]);window.bonkEditor.updateElements();`);

// left color picker
const leftColorPicker = newSrc.match(/;...\(\);},null\);};/);
patch(leftColorPicker, ` + (arguments[1] == undefined? 0 : arguments[1]);window.bonkEditor.updateElements();` + leftColorPicker);

// no shadows in game
const gameShadow = newSrc.match(/if\(this.shapes\[...\].shadowTexture/);
patch(gameShadow, `if(window.bonkEditor.fromHEX(arguments[0].physics.fixtures[${gameShadow[0].match(/(?<=\[)...(?=\])/)}].f).noshadow){}else ` + gameShadow);

// no shadows in preview
const shadow = newSrc.match(/\){...\[[0-9]{1,3}]=0\.17;/);
patch(shadow, `&&!window.bonkEditor.fromHEX(${newSrc.match(new RegExp(`if\\([^;]*?` + escapeRegExp(shadow[0])))[0].match(/(?<=if\()...\[[0-9]{1,3}]/)}.f).noshadow` + shadow[0]);

// existing tiles
const tile = newSrc.match(/(?:...\[[0-9]{1,3}]=...\[[0-9]{1,3}]\[...\[[0-9]{1,5}]\[[0-9]{1,5}]];){3}[a-zA-Z0-9\$_]{3}\(false\);};}}function ...\(...(?:,...){3}\)/)[0];
patch(tile, `
window.bonkEditor.updateElements(this.name);
` + tile.split("}}")[0] + `
let elem = document.getElementById("mapeditor_colorpicker_existingcontainer").lastChild;
let color = window.bonkEditor.fromHEX(elem.name);
if(color.transparency < 1) {
	elem.style.backgroundImage = \`url("data:image/svg+xml,%3Csvg viewBox='0 0 23 10' xmlns='http://www.w3.org/2000/svg' fill='\${elem.style.backgroundColor}'%3E%3Cpath d='m23,0 l-23,0v10'/%3E\${color.noshadow? "%3Ccircle style='fill:%23000' cx='11.5' cy='5' r='3.5'/%3E" : ''}%3C/svg%3E")\`;
	elem.style.backgroundColor = elem.style.backgroundColor.replace("rgb", "rgba").replace(")", \`, \${color.transparency})\`);
}
if(color.noshadow && elem.style.backgroundImage.length == 0) {
	elem.style.backgroundImage = \`url("data:image/svg+xml,%3Csvg viewBox='0 0 23 10' xmlns='http://www.w3.org/2000/svg' fill='%23000'%3E%3Ccircle style='fill:%23000' cx='11.5' cy='5' r='3.5'/%3E%3C/svg%3E")\`;
}
}}` + tile.split("}}")[1]);

const particles = newSrc.match(buildRegex('0\\.03;($var)=1;(?=this$prop$prop\\({graphics:($var))'));
patch(particles[0], particles[0] +
`let color = window.bonkEditor.fromHEX(${particles[2]}.tint);
${particles[2]}.tint = color.hex;
${particles[1]} = color.transparency;`);const updateRenderer = newSrc.match(/Error\(\);break;}...\(true\)/)[0].split("}")[1].split("(")[0];
const widthRoundingRegex = newSrc.match(/[a-zA-Z0-9\$_]{3}\[[0-9]{1,3}]]\[[a-zA-Z0-9\$_]{3}\[[0-9]{1,3}]\[[0-9]{1,3}]]=Math\[[a-zA-Z0-9\$_]{3}\[[0-9]{1,3}]\[[0-9]{1,3}]]\([a-zA-Z0-9\$_]{3}\[[0-9]{2,3}]\);[a-zA-Z0-9\$_]{3}\(true\)/)[0];
const rectPosRegex = newSrc.match(/[a-zA-Z0-9\$_]{3}\[[0-9]{1,3}]\[[a-zA-Z0-9\$_]{3}\[[0-9]{1,3}]\[[0-9]{1,3}]]\[[0-1]]=Math\[[a-zA-Z0-9\$_]{3}\[[0-9]{1,3}]\[[0-9]{1,3}]]\([a-zA-Z0-9\$_\[\]]+\);/g).map((x) => {return x.split("=")});
const platZindex = newSrc.match(/function [a-zA-Z0-9\$_]{3}\(\){[a-zA-Z0-9-+=_ \$;\(\)[\]{}\.,!]*?}}[a-zA-Z0-9\$_]{3}\(\);[a-zA-Z0-9\$_]{3}\(true\);}/g)[0];
const spawnId = newSrc.match(/[a-zA-Z0-9\$_]{3}\[[0-9]{1,3}](?=--;}else {(?!if))/)[0];

// Important vars
const editorPreview = newSrc.match(buildRegex('\\< 3\\){return;}($var$elem)'))[1]; // get editor map preview

// render editor
const resetFunction = newSrc.match(new RegExp("function ...\\(\\){.{0,40}\(...\\[\\d+\\]=-1;){2}.{0,40}(...\\(true\\);).{0,40}(...\\(\\);){2}[^}]+\\}"))[0]; // thanks kklkkj & salama
let regExp = newSrc.match(new RegExp(`}}...\\(\\);${RegExp.escape(resetFunction.match(/...\(true\);/)[0])}}`,"g"));
patch(regExp, regExp + `window.bonkEditor.renderEditor = ${resetFunction.match(/...\(true\);/)[0].replace('(true)', '')}`);

// gameObject
//const gameObject = newSrc.match(/[a-zA-Z0-9\$_]{3}\[[0-9]{1,3}]\[0]={userName:[a-zA-Z0-9\$_]{3}\[[0-9]{1,3}]/)[0].split(":")[1];

// move up / down spawns
let vars = platZindex.match(/(?<![\.a-zA-Z])(?:[a-zA-Z0-9\$_]{3})(?=[\[=]{1})(?:\[[0-9]{1,3}])?/g);
const modifiedPlatZindex = platZindex
.replace(/}}(?!else)/, `
			}
		}
	}
	else{
		if(this==${vars[10]}){
			if(${vars[4]}.spawns[${spawnId}-1]!=undefined){
				${vars[15]}=${vars[4]}.spawns[${spawnId}-1];
				${vars[4]}.spawns[${spawnId}-1]=${vars[0]}[100];
				${vars[4]}.spawns[${spawnId}]=${vars[15]};
				${spawnId}--;
			}
		}
		else if(this==${vars[33]}){
			if(${vars[4]}.spawns[${spawnId}+1]!=undefined){
				${vars[38]}=${vars[4]}.spawns[${spawnId}+1];
				${vars[4]}.spawns[${spawnId}+1]=${vars[0]}[100];
				${vars[4]}.spawns[${spawnId}]=${vars[38]};
				${spawnId}++;
			}
		}
	}`)
.replace(/if\(.*?\){.*?}/, "")
.replace(/;if\(.*?\){.*?}/, `;${vars[0]}[100]=${vars[4]}.spawns[${spawnId}];if(${vars[3]} == -1 && ${vars[4]}.spawns.indexOf(${vars[0]}[100]) == -1){return;}if(${vars[3]}!=-1){`);
patch(platZindex,modifiedPlatZindex);

// disable width rounding to integers
patch(widthRoundingRegex.split(";")[0] + ";", `${widthRoundingRegex.split("=")[0]}=${widthRoundingRegex.split("=")[1].split(";")[0].match(/.{7}(?=\))/)};`);

// disable rectangle position rounding to integers
for(let i = 0; i < 4; i++) patch(rectPosRegex[i].join("="), `${rectPosRegex[i][0]}=${rectPosRegex[i][1].match(/.{6}(?=\))/)};`);

// replace the minimum allowed value of width, height and radius to 0.0001
const precission = newSrc.match(/function [a-zA-Z0-9\$_]{3}\([a-zA-Z0-9\$_]{3}\){[a-zA-Z0-9\$_\[\]= ]+;[a-zA-Z0-9\$_\[\]=]+;[a-zA-Z0-9\$_\[\]=]+\*=10000;[a-zA-Z0-9\$_\[\]=]+\([a-zA-Z0-9\$_\[\]=]+\);[a-zA-Z0-9\$_\[\]=]+\/=10000;return [a-zA-Z0-9\$_\[\]=]+;}/)[0];
patch(`min:1,`, `min:0.0001,`);
patch(precission ,`function ${precission.split(" ")[1].substring(0,3)}(arg_){return arg_;}`);

// replace constant to variable
const arrayBufferRegex = newSrc.match(/(?<=new ArrayBuffer\().*?(?=\);)/)[0];
patch(arrayBufferRegex ,`1024 * window.bonkEditor.rangeView`);

// alignment
let mousePosRounding = newSrc.match(buildRegex(`(?:$var$elem$prop=Math$prop\\($var$elem$prop\\);){2}if\\(`));
patch(mousePosRounding,
`if(window.bonkEditor.holdingShift) {
	let rect = arguments[0].target.getBoundingClientRect();
	let pos = [(arguments[0].clientX - rect.left) / rect.width, (arguments[0].clientY - rect.top) / rect.height];
	pos = window.bonkEditor.editorTools.screenRatioToPhysicsCoordinate(...pos);
	let closestVertice = window.bonkEditor.findClosestVertice([pos.x, pos.y], 20 / ${editorPreview}.getStageScale());
	if(closestVertice) {
		return closestVertice.c;
	}
} else if(!window.bonkEditor.disablePositionRounding) {${mousePosRounding}false){}}
if(!window.bonkEditor.holdingShift && `);

let newPolyPlat = newSrc.match(buildRegex(`$prop\\($var$elem\\);}(?:$var$elem=($var$elem)$prop$prop\\[$var$elem];){2}`));
const mapObject = newPolyPlat[1];
patch(newPolyPlat[0], newPolyPlat[0] +
`window.bonkEditor.createVertexMap(${mapObject}.physics);
function keyUpdate (e) {
	window.bonkEditor.holdingShift = e.shiftKey;
	if(window.bonkEditor.polygonPreviewArgs) ${editorPreview}.drawPolygonPreview(...window.bonkEditor.polygonPreviewArgs);
}
document.addEventListener("keydown", keyUpdate);
document.addEventListener("keyup", keyUpdate);`);

const createPolygon = newSrc.match(buildRegex(`return;}}if\\($var$elem$prop`));
patch(createPolygon,
`window.bonkEditor.polygonPreviewArgs = null;
document.removeEventListener("keydown", keyUpdate);
document.removeEventListener("keyup", keyUpdate);`
+ createPolygon);

const polygonPreviewGraphics = newSrc.match(buildRegex('($var$elem)$prop=$var\\[0]\\[4];}'))[1];
const polygonPreview = newSrc.match(buildRegex('$var\\[0]\\[1]\\[$var$elem]\\[1]\\);}'))[0];
patch(polygonPreview, polygonPreview +
`window.bonkEditor.polygonPreviewArgs = arguments;
if(arguments[1].length > 0) {
let vertices = arguments[1].slice().reverse();
if(window.bonkEditor.distance(vertices[0], arguments[1][0]) < 20 / this.getStageScale() && arguments[1].length > 3) {
	let line = new PIXI.Graphics();
	line.lineStyle(window.bonkEditor.lineWidth(4, true), 0x7777ff, 0.75);
	line.moveTo(...arguments[1][0]);
	line.lineTo(...vertices[1]);
	${polygonPreviewGraphics}.addChild(line);
}
}`);

// anti-crash type 1
const anticrash1 = newSrc.match(/(?<=null)\){var [a-zA-Z0-9\$_]{3}=[a-zA-Z0-9\$_]{3}\..*?;/g);
for(let i = 1; i < anticrash1.length; i++) {
	patch(anticrash1[i], `&&this.shapes[${anticrash1[i].split("=")[1].replace(";","")}]!=undefined${anticrash1[i]}`);
}
// anti-crash capFill
const anticrash2 = newSrc.match(/(?<=0xccbbaa;)if\(this...../);
patch(anticrash2,`if(this.capFill==null){return;}${anticrash2}`);

// 0fps fix
const gameExit = newSrc.match(/\(\);[a-zA-Z0-9\$_]{3}\[[0-9]{1,3}]=false;}else {.*?}/);
const frame = newSrc.match(/requestAnimationFrame\([a-zA-Z0-9\$_]{1,3}\);(?=})/);
const frameDispatch = newSrc.match(/[a-zA-Z0-9\$_]{1,3}\(\){}(;window.*?;(?=func))?function [a-zA-Z0-9\$_]{1,3}\(\){.*?;.*?;.*?(?=;)/)[0].split(";").reverse()[0];
const visibilityChange = newSrc.match(/}\);}document.*?{/);
patch(visibilityChange, visibilityChange + `window.bonkEditor.visibilityStateChanged = true;`);
patch(frameDispatch, `try{${frameDispatch}}catch(e){window.bonkEditor.isCrashed = true;throw e;}`);
patch(gameExit, gameExit + `if(window.bonkEditor.isCrashed){window.bonkEditor.isCrashed = false;${frame}}`);

// anti circle crash
let antiCircleCrash = newSrc.match(/createTexture\(...,...\) {/);
patch(antiCircleCrash, antiCircleCrash + `return;`);

// dropper
const getEditor = newSrc.match(/};};};}/);
patch(getEditor, getEditor + `window.bonkEditor.map = function(){return ${mapObject};};window.bonkEditor.editor = ${editorPreview};`);
const mapRenderer = newSrc.match(/if\(...\[[0-9]{1,3}]\){[^;]*?;return ...\[[0-9]{1,3}];}(?=};})/);
//const tile = newSrc.match(/(?:...\[[0-9]{1,3}]=...\[[0-9]{1,3}]\[...\[[0-9]{1,5}]\[[0-9]{1,5}]];){3}[a-zA-Z0-9\$_]{3}\(false\);};}}function ...\(...(?:,...){3}\)/)[0];
let thing = tile.match(/(?:.*?;){3}/)[0].split(";").map(x => x.split("=")[0]);
patch(mapRenderer, mapRenderer + `
if(classArguments[1] == "editor" && document.getElementById("mapeditor_colorpicker_dropper").classList.contains("mapeditor_colorpicker_button_on")) {
	let ctx = window.bonkEditor.canvas.getContext("2d");

	let img = new Image();
	img.src = ${mapRenderer[0].split(";")[0].split("=")[1].match(/...\[[0-9]{1,3}]/)}.extract.base64();
	img.onload = function () {
		ctx.drawImage(img,0,0);
	}
	document.getElementsByClassName("gamecanvas")[0].style.outline = "2px solid red";
}
`)
const toHSV = newSrc.match(/...\[[0-9]{1,3}]=...\....\(...\[[0-9]{1,3}],256,65536,...\[[0-9]{1,3}],...\[[0-9]{1,3}]\);return ...\[[0-9]{1,3}];}function .../)[0].split("function ")[1];
//const colorPicker = newSrc.match(/,[a-zA-Z0-9\$_]{3}[[0-9]{1,3}]\);}}}(?=(?!catch)...[[0-9]{1,3}](?=\[))/);
patch(colorPicker, colorPicker + `
document.getElementById("mapeditor_colorpicker_dropper").onclick = function () {
	let editorCanvas = document.getElementsByClassName("gamecanvas")[0];
	let canvas = window.bonkEditor.canvas;
	let ctx = canvas.getContext("2d");
	let normalColor = null;
	let mapMouseDown = function (e) {
		let a = e.target.getBoundingClientRect();
		let x = Math.round(e.clientX - a.left);
		let y = Math.round(e.clientY - a.top);
		let color = ctx.getImageData(x, y, 1, 1).data;
		color = color[0] * 65536 + color[1] * 256 + color[2];
		let hsv = ${toHSV}(color);

		${thing[0]} = hsv.hue;
		${thing[1]} = hsv.brightness;
		${thing[2]} = hsv.saturation;
		${tile.match(/...\(false\);/)}

		//document.getElementById("mapeditor_colorpicker_lefttile").style.backgroundColor = color;
	};
	let mapMouseMove = function (e) {
		let a = e.target.getBoundingClientRect();
		let x = Math.round(e.clientX - a.left) - 2;
		let y = Math.round(e.clientY - a.top) - 2;
		let color = ctx.getImageData(x, y, 1, 1).data;
		color = \`rgb(\${color[0]}, \${color[1]}, \${color[2]})\`;
		document.getElementById("mapeditor_colorpicker_lefttile").style.backgroundColor = color;
	};
	let docMouseDown = () => {
		editorCanvas.style.cursor = "grab";
		editorCanvas.style.outline = "none";
		editorCanvas.removeEventListener("mousedown", mapMouseDown);
		editorCanvas.removeEventListener("mousemove", mapMouseMove);
		document.removeEventListener("mousedown", docMouseDown);
		//document.getElementById("mapeditor_colorpicker_lefttile").style.backgroundColor = normalColor;
		this.classList.remove("mapeditor_colorpicker_button_on");
	};
	if(this.classList.contains("mapeditor_colorpicker_button_on")) {
		this.classList.remove("mapeditor_colorpicker_button_on");
	} else {
		this.classList.add("mapeditor_colorpicker_button_on");
		normalColor = document.getElementById("mapeditor_colorpicker_lefttile").style.backgroundColor;
		window.bonkEditor.renderEditor();
		let base64 = window.bonkEditor.extractedMapPreview;
		editorCanvas.style.cursor = "crosshair";
		editorCanvas.style.outline = "2px solid red";
		canvas.width = parseFloat(editorCanvas.style.width);
		canvas.height = parseFloat(editorCanvas.style.height);

		editorCanvas.addEventListener("mousedown", mapMouseDown);
		editorCanvas.addEventListener("mousemove", mapMouseMove);
		document.addEventListener("mousedown", docMouseDown);
	}
}
`);

// menu
const menuRegex = newSrc.match(/== 13\){...\(\);}}/)[0];
patch(menuRegex, menuRegex + "window.bonkEditor.menu = this;");

// anti lobby kick
const ws = window.WebSocket.prototype.send;
window.WebSocket.prototype.send = function(args){
	if(this.url.includes("socket.io/?EIO=3&transport=websocket&sid=") && typeof(args) == "string" && args.length > 250000){
		window.bonkEditor.menu.showStatusMessage("* Protected from being kicked out of the room.","#b53030",false);
		return;
	}
	ws.call(this,args);
}

// cap zone highlight
const capZoneColor = newSrc.match(/}else if\(...\[[0-9]{1,3}] == ...\[[0-9]{1,3}] \|\| ...\[[0-9]{1,3}] == ...\[[0-9]{1,3}]\){...\[[0-9]{1,3}]/)[0];
const hasCZ = newSrc.match(/if\(...\[[0-9]{1,3}]\[...\[[0-9]{1,3}]]\){[^;]*?\(3,0x/)[0].substring(3).split(")")[0];
patch(capZoneColor, `if(${capZoneColor.split("(")[1].split(")")[0]} || window.bonkEditor.highlightedCapZone == ${hasCZ}.capID){${capZoneColor.split("{")[1]}.lineStyle(3, 0xff0000, 1);}` + capZoneColor);
const capZoneSelection = newSrc.match(/...\[[0-9]{1,3}],1\);...\[[0-9]{1,3}]=-1/)[0].split(",")[0];
const addCZHighlightFunction = newSrc.match(/false;};...\[[0-9]{1,3}]=new TWEEN/);
patch(addCZHighlightFunction, `false;};this.highlightCapZone=function(capZone){window.bonkEditor.highlightedCapZone=capZone};this.clearHighlightCapZone=function(){window.bonkEditor.highlightedCapZone=null};` + addCZHighlightFunction[0].split(";};")[1]);
const onHoverCZFunction = newSrc.match(/};[^;]*?=function\(\){};[^;]*?=function\(\){};};for/);
patch(onHoverCZFunction, onHoverCZFunction[0].replaceAll("function(){}", `(e)=>{if(e.type == "mouseover"){${editorPreview}.highlightCapZone(arguments[0]);${updateRenderer}(true);}else if(e.type == "mouseout"){${editorPreview}.clearHighlightCapZone();${updateRenderer}(true);}}`));

// update render on zoom in/out/reset
const getClassArguments = newSrc.match(/[a-zA-Z0-9\$_]{3}\[[0-9]{1,3}]=0.5;[a-zA-Z0-9\$_]{3}\[[0-9]{1,3}]=\[];/)
patch(getClassArguments, getClassArguments[0] + `let classArguments = arguments;`);
const zoom = newSrc.match(/return {x:.{1,4}\[[0-9]{1,3}],y:.{1,4}\[[0-9]{1,3}]};};(?=this)/g);
patch(zoom, zoom + `
let originalScale = this.scaleStage;
window.bonkEditor.editorTools = this;
this.scaleStage = function () {
	originalScale.call(this, ...arguments);
	window.bonkEditor.renderEditor(true);
};
let originalReset = this.resetStage;
this.resetStage = function () {
	originalReset.call(this, ...arguments);
	window.bonkEditor.renderEditor(true);
};`);

// Allow users to disable map merging so they can load maps without losing anything
let mergeIntoNewMapRegex = newSrc.match(buildRegex('\\($var$elem\\);};[A-Za-z_]$prop=function\\($var\\){'));
// Old or b1 maps will have path and rotating joints' lines off
patch(mergeIntoNewMapRegex, mergeIntoNewMapRegex + 'if(window.bonkEditor.bypassMergeIntoNewMap){return arguments[0];}');

// make line width scale
patch(/2,0x7777ff/, `window.bonkEditor.lineWidth(2, this),0x7777ff`);
patch(/1,0xcccccc,0\.5\);(?!...\....\([0-9]{1,10}\))(?!this)/g, `window.bonkEditor.lineWidth(1, this),0xcccccc, 0.5);`);
patch(/1(?=,0xf4a7a7)/g, `window.bonkEditor.lineWidth(1, this)`);

patch(/4(?=,0x[F0]{6})/g, `window.bonkEditor.lineWidth(4, this)`);
patch(/(?<=\(-?)10(?=,0\))/g, `window.bonkEditor.lineWidth(10, this)`);
patch(/(?<=\(0,-?)10(?=\))/g, `window.bonkEditor.lineWidth(10, this)`);

patch(/1,0xffffff,0.5/g, `window.bonkEditor.lineWidth(1, this),0xffffff,0.5`);
patch(/0\.5,0xffffff/g, `window.bonkEditor.lineWidth(0.5, this),0xffffff`);
	if (window.bonkHUD) {
const guiSettings = {
    noWindow: true,
    settingsContent: null,
    bonkLIBVersion: '1.1.3',
    modVersion: '2.3.1',
}

let storage = localStorage.getItem('bonkEditor');
if(storage != null) {
    storage = JSON.parse(storage);
    Object.keys(storage).forEach( key => {
        window.bonkEditor[key] = storage[key];
    });
} else storage = {};

const label = (target, ...elements) => {
    let div = document.createElement('div');
    div.margin = '5px';
    target.appendChild(div);
    for(let element in elements) {
        if(typeof(elements[element]) == 'string'){
            let labelElement = document.createElement('span');
            labelElement.classList.add('bonkhud-settings-label');
            labelElement.textContent = elements[element];
            labelElement.style.padding = '0 5px';
            labelElement.style.display = 'inline-block';
            div.appendChild(labelElement);
        } else div.appendChild(elements[element]);
        div.lastChild.style.verticalAlign = 'middle';
    }
}
// functions
const checkbox = value => {
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = value;
    checkbox.style.verticalAlign = 'middle';
    return checkbox;
}
const inputText = value => {
    let text = document.createElement('input');
    text.style.width = '60px';
    text.style.height = '19px';
    text.style.verticalAlign = 'middle';
    text.style.textAlign = 'end';
    text.value = value;
    return text;
}
let settings = window.bonkHUD.generateSection();
guiSettings.settingsContent = settings;
const ind = window.bonkHUD.createMod('better editor', guiSettings);

// section

let rangeView = inputText(parseInt(storage.rangeView ?? window.bonkEditor.rangeView));
rangeView.oninput = (event) => {
    event.target.value = event.target.value.replaceAll(/[^0-9]+/g, '');
    event.target.value = String(Math.min(Math.max(parseInt(event.target.value) ?? 0, 0), 1048576));
    window.bonkEditor.rangeView = event.target.value;
    updateLocalStorage();
};

let bypassMerge = checkbox(storage.bypassMergeIntoNewMap ?? window.bonkEditor.bypassMergeIntoNewMap);
bypassMerge.onchange = (event) => {
    window.bonkEditor.bypassMergeIntoNewMap = event.target.checked;
    updateLocalStorage();
};

let disablePositionRounding = checkbox(storage.disablePositionRounding ?? window.bonkEditor.disablePositionRounding);
disablePositionRounding.oninput = (event) => {
    window.bonkEditor.disablePositionRounding = event.target.checked;
    updateLocalStorage();
    roundPosCheckbox.checked = !event.target.checked;
};

let clearStorageButton = window.bonkHUD.generateButton("Clear Storage");
clearStorageButton.style.display = "inline-block";
clearStorageButton.style.padding = "0 5px";
clearStorageButton.onclick = () => {
    localStorage.removeItem("bonkEditor");
}

let roundPosContainer = document.createElement('div')
roundPosContainer.className = 'mapeditor_midbox_leftbutton_sub';
let roundPosCheckbox = checkbox(!(storage.disablePositionRounding ?? window.bonkEditor.disablePositionRounding));
roundPosCheckbox.className = 'mapeditor_midbox_leftbutton_sub_checkbox';
roundPosCheckbox.style.verticalAlign = 'unset';
let roundPosText = document.createElement('span');
roundPosText.textContent = 'round positions'
roundPosText.className = 'mapeditor_midbox_leftbutton_sub_text';

roundPosCheckbox.oninput = (event) => {
    window.bonkEditor.disablePositionRounding = !event.target.checked;
    updateLocalStorage();
    disablePositionRounding.checked = !event.target.checked;
}

roundPosContainer.appendChild(roundPosCheckbox);
roundPosContainer.appendChild(roundPosText);
document.getElementById('mapeditor_midbox_leftbuttoncontainer').appendChild(roundPosContainer);

label(settings, 'Array buffer range view', rangeView, 'KB', '(setting this parameter to value higher than 1024kb may cause longer maps loading in Level Select menu)');
label(settings, 'Bypass map normalizing', bypassMerge, '(can cause very long map loading or page crashing)');
label(settings, 'Disable position rounding', disablePositionRounding);
label(settings, clearStorageButton);


window.bonkHUD.updateStyleSettings();
	}

	if(src === newSrc) throw "Injection failed!";
	console.log("Better Editor injector run");
	return newSrc;
}

if(!window.bonkCommands) window.bonkCommands = [];

if(!window.bonkCodeInjectors) window.bonkCodeInjectors = [];
window.bonkCodeInjectors.push(bonkCode => {
	try {
		return injector(bonkCode);
	} catch (error) {
		alert(
`Whoops! Better Editor was unable to load.
This may be due to an update to Bonk.io. If so, please report this error!`);
		throw error;
	}
});

console.log("Better Editor injector loaded");