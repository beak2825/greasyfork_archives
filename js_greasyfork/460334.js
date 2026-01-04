// ==UserScript==
// @name         USOa - Show source code
// @namespace    https://github.com/Procyon-b
// @version      0.3.1
// @description  Display the source code of the userstyle's on its "UserStyles.org Archive" page
// @author       Achernar
// @match        https://uso.kkx.one/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460334/USOa%20-%20Show%20source%20code.user.js
// @updateURL https://update.greasyfork.org/scripts/460334/USOa%20-%20Show%20source%20code.meta.js
// ==/UserScript==

(function() {
"use strict";

var RJ=Response.prototype.json;
Response.prototype.json=function(){
  var e=this;
  var r=RJ.apply(e, ...arguments)
  return r.then(function (o) {
    uCSS='';
    if (o && o.style) {
      if (o.style.settings) uCSS=toUsercss(o);
      else uCSS=o.style.css;
      setTimeout(init, 0);
      }
    return o;
    });
  }

var uCSS='';

function init() {
  var r=document.querySelectorAll('.col-12'), R;
  if (R=r[1]) {
    R=R.parentNode.appendChild(document.createElement('div'));
    R.className='source';
    R.appendChild(document.createElement('h2')).textContent='Source code';
    R.appendChild(document.createElement('style')).textContent=`
html {
  --bdcol: #6c757d;
}
html.dark {
  --bdcol: #626262;
}
.source {
  order: 9;
}
.source pre {
  padding: 0.5rem;
  overflow: auto;
  resize: vertical;
  border: 1px solid var(--bdcol);
  border-radius: .25rem;
  min-height: 20rem;
  height: 20rem;
  font-size: 13px;
}
`;
    let S=document.createElement('div');
    S.className='Style-source';
    R.appendChild(S);
    S.appendChild(document.createElement('pre')).appendChild(document.createElement('code')).textContent=uCSS;
    }
  }


/* source code imported from https://github.com/uso-archive/data/blob/flomaster/lib/converters.js */
/* 2023-02-19 */
function toUsercss(style) {
	let replaces = [];
	const settings = toUsercssSettings(style.style.settings);

	function processKey(key) {
		if (/^[\w-_]+$/.test(key)) {
			return key;
		}
		else {
			const result = key.replace(/[^\w-_]/g, "-");
			const c = replaces.filter(v => v.r === result).length || null;
			replaces.push({ from: new RegExp(utils.escapeRegExp(`/*[[${key}]]*/`), "gi"), to: `/*[[${result}${c ? "-" + c : ""}]]*/`, r: result });
			return result;
		}
	}

	function toUsercssDropdownOptions(options) {
		let result = "";
		for (const option of options) {
			if (option.default) result = `${processKey(option.key)} "${option.label.replace(/"/g, "\\\"")}${option.default ? "*" : ""}" <<<EOT ${option.value} EOT;\r\n` + result;
			else result += `${processKey(option.key)} "${option.label.replace(/"/g, "\\\"")}${option.default ? "*" : ""}" <<<EOT ${option.value} EOT;\r\n`;
		}
		return result;
	}

	function toUsercssSetting(setting) {
		switch (setting.type) {
		case "dropdown":
			return `@advanced dropdown ${processKey(setting.key)} "${setting.label.replace(/"/g, "\\\"")}" {
	${toUsercssDropdownOptions(setting.options)}
}`;
		case "color":
			return `@advanced color ${processKey(setting.key)} "${setting.label.replace(/"/g, "\\\"")}" ${setting.options[0].value}`;
		case "image":
			const key = processKey(setting.key);
			return `@advanced dropdown ${key} "${setting.label.replace(/"/g, "\\\"")}" {
${toUsercssDropdownOptions(setting.options)}
	${processKey(key)}-custom-dropdown "Custom" <<<EOT /*[[${processKey(key)}-custom]]*/ EOT;
}
@advanced text ${processKey(key)}-custom "${setting.label.replace(/"/g, "\\\"")} (Custom)" "https://example.com/image.png"`;
		case "text":
			return `@advanced text ${processKey(setting.key)} "${setting.label.replace(/"/g, "\\\"")}" "${setting.options[0].value}"`;
		}
	}

	function toUsercssSettings(settings) {
		if (!settings) return "";
		let result = "";
		for (const setting of settings) {
			result += `${toUsercssSetting(setting).replace(/\*\//g, "*\\/")}\r\n`;
		}
		return result;
	}

	let result = `/* ==UserStyle==
@name           ${style.info.name}
@namespace      USO Archive
@author         ${style.info.author ? style.info.author.name || "unknown" : "unknown"}
@description    \`${style.info.description ? style.info.description.replace(/[\r\n]/gm, "") : "none"}\`
@version        ${versionFromTimestamp(style.info.updatedAt)}
@license        ${style.info.license}
@preprocessor   uso${settings ? "\n" + settings : ""}
==/UserStyle== */
${style.style.css}`;

	for (const replace of replaces) {
		result = result.replace(replace.from, replace.to);
	}

	return result;
}

function versionFromTimestamp(timestamp) {
	const date = new Date(timestamp);
	return `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, 0)}${date.getDate().toString().padStart(2, 0)}.${date.getHours()}.${date.getMinutes()}`;
}

// source code from https://github.com/uso-archive/data/blob/flomaster/lib/utils.js
/* 2023-02-19 */
function escapeRegExp(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
var utils={escapeRegExp};

})();