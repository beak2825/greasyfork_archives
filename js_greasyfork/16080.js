// ==UserScript==
// @name          Javascript Link Fixer
// @namespace     DoomTay
// @description   Converts Javascript links that open new windows into regular old links
// @include       *
// @version       1.2.5
// @grant         none

// @downloadURL https://update.greasyfork.org/scripts/16080/Javascript%20Link%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/16080/Javascript%20Link%20Fixer.meta.js
// ==/UserScript==

var links = document.querySelectorAll("[href *= 'javascript:'],a[onclick]");

var paramTable = {};
	paramTable["open"] = 0;
	paramTable["window.open"] = 0;

for (var l = 0; l < links.length; l++)
{
	if(links[l].href == undefined) continue;
	if(links[l].href.indexOf("void") > -1) continue;
	if(links[l].href.substring(11) != "" && links[l].href.substring(11) != ";")
	{
		var hrefSplitter = /javascript:(\S+)\((\S+(?:,(?: )\S+)*)?\)/.exec(links[l].href);
		if(hrefSplitter != null)
		{
			var functionName = decodeURIComponent(hrefSplitter[1]).trim();
			var params = hrefSplitter[2] ? eval("[" + decodeURIComponent(hrefSplitter[2]) + "]") : [];
			var functionDig = deconstructFunction(functionName,params);
			if(functionDig != null)
			{
				links[l].setAttribute("onclick",decodeURIComponent(links[l].href).substring(links[l].href.indexOf("javascript:") + 11) + "; return false");
				if(functionDig.indexOf("/") == 0 && window.location.href.indexOf("archive.org/web") > -1 && functionDig.indexOf("/web") != 0)
				{
					links[l].href = window.location.href.substring(0,window.location.href.indexOf("/",window.location.href.lastIndexOf("//") + 2)) + functionDig;
				}
				else links[l].href = functionDig;
				continue;
			}
		}
	}
	if(links[l].getAttribute("onclick"))
	{
		if(links[l].getAttribute("onclick").indexOf("void") > -1) continue;
		if(links[l].getAttribute("onclick").substring(11) != "" && links[l].getAttribute("onclick").substring(11) != ";")
		{
			var funcSplitter = /(\S+)\(([^;]+)\)/.exec(links[l].getAttribute("onclick"));
			if(funcSplitter != null)
			{
				var functionName = decodeURIComponent(funcSplitter[1]).trim();
				var params = funcSplitter[2] ? eval("[" + decodeURIComponent(funcSplitter[2]) + "]") : [];
				if(links[l].getAttribute("csclick"))
				{
					if(CSAct[params][1].indexOf("/") == 0 && window.location.href.indexOf("archive.org/web") > -1 && CSAct[params][1].indexOf("/web") != 0)
					{
						links[l].href = window.location.href.substring(0,window.location.href.indexOf("/",window.location.href.lastIndexOf("//") + 2)) + CSAct[params][1];
					}
					else links[l].href = CSAct[params][1];
					continue;
				}
				var functionDig = deconstructFunction(functionName,params);
				if(functionDig != null)
				{
					if(functionDig.indexOf("/") == 0 && window.location.href.indexOf("archive.org/web") > -1 && functionDig.indexOf("/web") != 0)
					{
						links[l].href = window.location.href.substring(0,window.location.href.indexOf("/",window.location.href.lastIndexOf("//") + 2)) + functionDig;
					}
					else links[l].href = functionDig;
					continue;
				}
			}
		}
	}
}

function deconstructFunction(functionName,params)
{
	if(functionName == "history.go") return null;
	if(functionName == "window.close") return null;
	var sourceCode = uneval(window[functionName]);
	var functionBody = sourceCode.substring(sourceCode.indexOf("{") + 1,sourceCode.lastIndexOf("}")).trim();
	while(functionBody.indexOf(functionName + ".arguments") > -1) functionBody = functionBody.replace(functionName + ".arguments","params");
	if(functionBody.indexOf("for") > -1) return null;
	var args = /\(((?: )?\S+(?:,(?: )\S+)*)?(?: )?\)/.exec(sourceCode);
	args = args && args[1] ? args[1].split(/\s*,\s*/) : [];
	var containedFunctions = functionBody.match(/(\S+\(\S+(?:,(?: )?\S+)*\))/g) || [];
	var ifCollection = functionBody.match(/if ?\([a-zA-z '?=+&.<>!()0-9;]+\)[ \n\t]+?{[\s\S][\na-zA-z '?=+.,">\/()0-9;!@#$%^&*\t]+[\s]+}/g);
	var variableMatches = functionBody.match(/(\S+ ?[+\-*\/]?= ?.+)/g);

	for(var a = 0; a < params.length; a++)
	{
		eval(args[a] + "= \"" + params[a] + "\"");
	}
	if(variableMatches)
	{
		for(var m = 0; m < variableMatches.length; m++)
		{
			if(variableMatches[m].indexOf("==") > -1 || variableMatches[m].indexOf("!=") > -1 || variableMatches[m].indexOf("//") > -1 || variableMatches[m].indexOf(">=") > -1 || variableMatches[m].indexOf("<=") > -1) continue;
			if(containedFunctions != null && containedFunctions.some(elem => variableMatches[m].substring(variableMatches[m].indexOf("=") + 1).trim().indexOf(elem) > -1)) continue;
			if(ifCollection != null && ifCollection.some(elem => elem.indexOf(variableMatches[m]) > -1)) continue;
			if(/.+\(/.test(variableMatches[m]) && variableMatches[m].indexOf("eval(") == -1) continue;
			var varSplitter = /(?!["'=><!])? ?[+\-*\/]?= ?(?!["'=><!])/;
			var splitVars = [variableMatches[m].substring(0,variableMatches[m].search(varSplitter)).trim(),variableMatches[m].substring(variableMatches[m].search(varSplitter) + 2).trim()];
			//Making sure we're not altering any properties
			if(splitVars[0].indexOf(".location") > -1 || /location(?:.href)? ?= ? (?!yes|no)/.test(variableMatches[m])) return eval(splitVars[1]);
			else if(splitVars[0].indexOf(".") == -1) eval(variableMatches[m]);
		}
	}

	if(ifCollection)
	{
		for(var i = 0; i < ifCollection.length; i++)
		{
			eval(ifCollection[i]);
		}
	}

	if(containedFunctions)
	{
		for(var f = 0; f < containedFunctions.length; f++)
		{
			var capture = /(\S+)\((\S+(?:,(?: )?\S+)*)?\);?/.exec(containedFunctions[f]);
			var statementName = capture[1];
			if(statementName == "if") continue;
			var statementParams = capture[2];
			statementParams = eval("[" + statementParams + "]");
			if(paramTable.hasOwnProperty(statementName)) return(statementParams[paramTable[statementName]]);
			var digDeeper = deconstructFunction(statementName,statementParams);
			if(digDeeper) return digDeeper;
		}
	}
	if(functionBody.includes(".location = "))
	{
		var test = /\.location ?= ?(\S+);/.exec(functionBody)[1];
		for(var p = 0; p < params.length; p++)
		{
			if(test == args[p]) return params[p];
		}
	}
	return null;
}