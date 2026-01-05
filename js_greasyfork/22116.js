// ==UserScript==
// @name         Contrast booster
// @namespace    xpasza
// @version      4.5
// @description  This script increase contrast betwen background, border and font colors
// @author       Pavel.Agarkov
// @run-at       document-body
// @match        *
// @include      *
// @exclude      https://mail.google.com*
// @exclude      https://docs.google.com/spreadsheets/*/edit*
// @exclude      https://keep.google.com*
// @exclude      https://docs.google.com/forms/*/edit*
// @exclude      https://docs.google.com/document/*/edit*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22116/Contrast%20booster.user.js
// @updateURL https://update.greasyfork.org/scripts/22116/Contrast%20booster.meta.js
// ==/UserScript==

var debug = false;
var colors, frontColors;
var removeBackgroundImages, runOnThisSite, saturation, backgroundSaturation, frontLightnessLimit, borderLightnessLimit,
	lightness, borderLightness, backgroundLightnessLimit, fontGrayHue, backgroundGrayHue,
	cbDialogTop, cbDialogLeft;
var startX,startY,avgTime;
var excludeTags = ["BR", "SCRIPT", "NOSCRIPT", "STYLE", "HEAD", "TITLE", "LINK", "META", "HTML", "PARAM", "BDO", "BASE"];
var grayHues =
	[
		{ value: 4, name: "Red", bgrColor: "#F44336", fntColor: "rgba(255,255,255,0.87)" },
		{ value: 340, name: "Pink", bgrColor: "#E91E63", fntColor: "rgba(255,255,255,0.87)" },
		{ value: 291, name: "Purple", bgrColor: "#9C27B0", fntColor: "rgba(255,255,255,0.87)" },
		{ value: 262, name: "Deep Purple", bgrColor: "#673AB7", fntColor: "rgba(255,255,255,0.87)" },
		{ value: 231, name: "Indigo", bgrColor: "#3F51B5", fntColor: "rgba(255,255,255,0.87)" },
		{ value: 207, name: "Blue", bgrColor: "#2196F3", fntColor: "#fff" },
		{ value: 199, name: "Light Blue", bgrColor: "#03A9F4", fntColor: "rgba(0,0,0,0.87)" },
		{ value: 187, name: "Cyan", bgrColor: "#00BCD4", fntColor: "rgba(0,0,0,0.87)" },
		{ value: 174, name: "Teal", bgrColor: "#009688", fntColor: "#fff" },
		{ value: 122, name: "Green", bgrColor: "#4CAF50", fntColor: "rgba(0,0,0,0.87)" },
		{ value: 88, name: "Light Green", bgrColor: "#8BC34A", fntColor: "rgba(0,0,0,0.87)" },
		{ value: 66, name: "Lime", bgrColor: "#CDDC39", fntColor: "rgba(0,0,0,0.87)" },
		{ value: 54, name: "Yellow", bgrColor: "#FFEB3B", fntColor: "rgba(0,0,0,0.87)" },
		{ value: 45, name: "Amber", bgrColor: "#FFC107", fntColor: "rgba(0,0,0,0.87)" },
		{ value: 36, name: "Orange", bgrColor: "#FF9800", fntColor: "rgba(0,0,0,0.87)" },
		{ value: 14, name: "Deep Orange", bgrColor: "#FF5722", fntColor: "#fff" },
		{ value: 16, name: "Brown", bgrColor: "#795548", fntColor: "rgba(255,255,255,0.87)" },
		{ value: 0, name: "Grey", bgrColor: "#9E9E9E", fntColor: "rgba(0,0,0,0.87)" },
		{ value: 200, name: "Blue Grey", bgrColor: "#607D8B", fntColor: "rgba(255,255,255,0.87)" }
	];
var classObserverConfig = { attributes: true,  attributeFilter: ["class"] };
var classObserver = new MutationObserver(
	function(mutations)
	{
		mutations.forEach(
			function(mutation)
			{
				if(mutation.target.is && mutation.target.is.checked && mutation.target.cbBgColor)
				{
					if(mutation.target.hasChildNodes())
					{
						reCalcRootElement(mutation.target, true);
					}
					else
					{
						mutation.target.cbBgColor = null;
						restoreElementColors(mutation.target);
						procElement(mutation.target);
					}
				}
			});
	});

var childObserverConfig = { childList: true, subtree: true };
var childObserver = new MutationObserver(
	function(mutations)
	{
		var allChildTags = [], childTags, allNewTags = [];

		mutations.forEach(
			function(mutation)
			{
				mutation.addedNodes.forEach(
					function(newNode)
					{
						if(!newNode.done && checkElement(newNode))
						{
							allNewTags.push(newNode);
							newNode.done = true;
							childTags = newNode.getElementsByTagName("*");
							for (var ct in childTags)
							{
								if(!childTags[ct].done && checkElement(childTags[ct]))
								{
									allChildTags.push(childTags[ct]);
									childTags[ct].done = true;
								}
							}
						}
					});
			});
		procAllElements(allNewTags);
		procAllElements(allChildTags);
	});
var nameResources =
	{
		htm :
		{
			dom :
			{
				bgrColor : "backgroundColor",
				brdColor : "borderColor"
			},
			css :
			{
				bgrColor : "background-color",
				brdColor : "border-color"
			},
			img : "IMG"
		},
		svg :
		{
			dom :
			{
				bgrColor : "fill",
				brdColor : "stroke"
			},
			css :
			{
				bgrColor : "fill",
				brdColor : "stroke"
			},
			img : "IMAGE"
		}
	};

initSettings();
getSettings();
//createStyles();
//createDialog();
//createEnsign();
resetPrevColors();
cbMain(document);
setTimeout(
	function()
	{
		createStyles();
		createEnsign();
	}, runOnThisSite ? 3000 : 5000);

function initSettings()
{
	removeBackgroundImages = 10000;
	runOnThisSite = true;
	saturation = 25.0;
	backgroundSaturation = 10.0;
	lightness = 50;
	borderLightness = 30;
	backgroundLightnessLimit = 20;
	frontLightnessLimit = 90;
	borderLightnessLimit = 70;
	fontGrayHue = 16;
	backgroundGrayHue = 200;
	cbDialogLeft = "30%";
	cbDialogTop = "30%";
}

function resetPrevColors()
{
	colors = {};
	frontColors = {};
}

function cbMain(doc)
{
	doc.hasContrastBooster = true;

	if(doc.body && runOnThisSite)
	{
		doc.oncopy = onCopy;
		doc.dorm = {};
		createLoadingShadow(doc);

		setTimeout(
			function()
			{
				var allTags, bodyChildren, bgLight, style;

				initSelectors(doc);

				style = doc.defaultView.getComputedStyle(doc.body, "");

				bgLight = procElement(doc.body, undefined, style);
				if(!doc.body.observed)
				{
					classObserver.observe(doc.body, classObserverConfig);
					doc.body.observed = true;
				}

				bodyChildren = Array.prototype.slice.call(doc.body.childNodes).filter(checkElement);
				procAllElements(bodyChildren);

				if(!doc.body.childObserved)
				{
					childObserver.observe(doc.body, childObserverConfig);
					doc.body.childObserved = true;
				}

				allTags = Array.prototype.slice.call(doc.getElementsByTagName("*")).filter(checkElement);
				procAllElements(allTags, doc);

				createScrollbarStyle(doc);
			}, 1);
	}
}

function onCopy()
{
	var sel = this.defaultView.getSelection(), rootElem, allTags;
	if(sel && !sel.isCollapsed)
	{
		rootElem = sel.getRangeAt(0).commonAncestorContainer;
		rootElem.cbBgColor = null;
		if(!checkElement(rootElem))
		{
			rootElem = rootElem.parentElement;
		}
		rootElem = getColoredParent(rootElem, true, true);
		reCalcRootElement(rootElem);
	}
}

function initSelectors(doc)
{
	if(!doc.selectors)
	{
		doc.selectors = [];
		var styles = doc.styleSheets;
		for (var sheet = 0; sheet < styles.length; sheet++)
		{
			var rules = styles[sheet].cssRules;
			if(rules && rules.length > 0)
			{
				for (var rule = 0; rule < rules.length; rule++)
				{
					if(rules[rule].selectorText)
					{
						doc.selectors.push(rules[rule].selectorText);
					}
				}
			}
		}
	}
}

function initSimilarRules(tag)
{
	if(tag.className)
	{
		if(!tag.similarRules)
		{
			tag.similarRules = {};
		}
		if(!tag.similarRules[tag.className])
		{
			var selectorRegExp = new RegExp(tag.className.replace(/>/g, " ").replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s/g, "|").replace(/[||]/g, "|"));
			tag.similarRules[tag.className] = tag.ownerDocument.selectors.filter(function(s){ return selectorRegExp.test(s); });
		}
	}
}

function getElementMatchedSelectors(tag)
{
	var key = tag.tagName + "#" + tag.id + "." + tag.className;
	tag.ownerDocument.preFilteredSelectors = tag.ownerDocument.preFilteredSelectors || {};
	var preFilteredSelectors = tag.ownerDocument.preFilteredSelectors[key];
	if(!preFilteredSelectors)
	{
		var tagNameExp = "(?:" + tag.tagName + ")";
		var idExclude = tag.id ? "(?!(?:#" + tag.id + "))" : "";
		var classExclude = tag.className ? "(?!(?:\\." + tag.className.replace(/ /g, "|\\.") + "))" : "";

		var excludeRegExp = "^(?!" + tagNameExp + ")\\w+(\\.[\\w-]*)*(:\\w+)*$";           // otherTagName.className1.className2:hover:active
		excludeRegExp += "|^" + tagNameExp + "?" + classExclude + "\\.[\\w-]*(?::\\w+)*$"; // thisTagName.otherClassName:hover:active
		excludeRegExp += "|^" + idExclude + "#[\\w-]*(?::\\w+)*$";                         // #otherTagId:hover:active

		excludeRegExp = new RegExp(excludeRegExp, "i");
		tag.ownerDocument.preFilteredSelectors[key] = preFilteredSelectors =
			tag.ownerDocument.selectors.filter(function(selector) { return !excludeRegExp.test(selector); });
	}
	return preFilteredSelectors.filter(function(selector) { return tag.matches(selector); });
}

function checkElementsHasRelatedStyles(rootElem, childElem)
{
	return rootElem.similarRules[rootElem.className].find(
		function(selector)
		{
			return childElem.matches(selector);
		}
	);
}

function reCalcRootElement(rootElem, onlyWithRelatedStyles)
{
	if(rootElem)
	{
		var allTags;
		rootElem.cbBgColor = null;
		allTags = rootElem.hasChildNodes() ? Array.prototype.slice.call(rootElem.getElementsByTagName("*")) : null;
		if(allTags && allTags.length > 0)
		{
			if(onlyWithRelatedStyles) initSimilarRules(rootElem);
			allTags = allTags.filter(function(el) { return el.is && el.is.checked && el.cbBgColor && (!onlyWithRelatedStyles || checkElementsHasRelatedStyles(rootElem, el)); });
			allTags.forEach(function(el) { el.cbBgColor = null; });
			allTags.push(rootElem);
		}
		else
		{
			allTags = [ rootElem ];
		}
		allTags.forEach(restoreElementColors);
		if(allTags.length < 100)
		{
			for (x = 0; x < allTags.length; x++)
			{
				procElement(allTags[x]);
			}
		}
		else
		{
			createLoadingShadow(rootElem.ownerDocument);
			setTimeout(
				function()
				{
					procAllElements(allTags, rootElem.ownerDocument);
				}, 1);
		}
	}
}

function getColoredParent(tag, checkBackground, checkForeground)
{
	if(tag)
	{
		var bgOk = !checkBackground || tag.style.backgroundColor !== "",
			fgOk = !checkForeground || tag.style.color !== "";
		if(bgOk && fgOk)
		{
			return tag;
		}
		else
		{
			return getColoredParent(tag.parentElement, !bgOk, !fgOk);
		}
	}
}

function procAllElements(allTags, doc)
{
	if(allTags.length > 0)
	{
		var coloredTags = [], transparentTags = [], style, nr, isSvg, bgrColor, altText, tag;
		for (ct = 0; ct < allTags.length; ct++)
		{
			tag = allTags[ct];
			isSvg = tag instanceof tag.ownerDocument.defaultView.SVGElement;
			nr = isSvg ? nameResources.svg : nameResources.htm;
			style = tag.ownerDocument.defaultView.getComputedStyle(tag, "");
			bgrColor = style[nr.dom.bgrColor];

			if(bgrColor && bgrColor != "rgba(0, 0, 0, 0)" && bgrColor != "transparent")
			{
				coloredTags.push({ tag: tag, style: style });
			}
			else
			{
				transparentTags.push({ tag: tag, style: style });
			}
		}

		procElementsByParts(coloredTags, true);
		if (doc) removeLoadingShadow(doc);
		procElementsByParts(transparentTags, true);
	}
	else
	{
		if (doc) removeLoadingShadow(doc);
	}
}

function procLatedElements(procLater)
{
	setTimeout(
		function()
		{
			procElementsByParts(procLater, false);
		}, 1000);
}

function procElementsByParts(tags, checkOffset)
{
	if(tags.length > 0)
	{
		setTimeout(
			function(cos, tags1)
			{
				var stepSize = 10, speed = 3;
				tags1 = tags1.sort(
					function(e1, e2)
					{
						return  e2.tag.clientWidth * e2.tag.clientHeight - e1.tag.clientWidth * e1.tag.clientHeight;
					}
				);

				for (step = 0; step < tags1.length;)
				{
					setTimeout(
						function(f, t, check, tags2)
						{
							procElementsFromTo(tags2, f, t, check);
						}, 1, step, step += (stepSize *= speed), cos, tags1);
				}
			}, 1, checkOffset, tags);
	}
}

function procElementsFromTo(tags, from, to, checkOffset)
{
	var procLater = [], forObservation = [];
	for (x = from; x < to && x < tags.length; x++)
	{
		if(!checkOffset || checkOffset && (tags[x].tag.offsetParent !== null || tags[x].style.position == "fixed"))
		{
			procElement(tags[x].tag, undefined, tags[x].style);
			forObservation.push(tags[x].tag);
		}
		else
		{
			procLater.push(tags[x]);
		}
	}
	procLatedElements(procLater);
	startObservation(forObservation);
}

function startObservation(forObservation)
{
	setTimeout(
		function(tags)
		{
			var tag;
			for (x = 0; x < tags.length; x++)
			{
				tag = forObservation[x];
				if(!tag.observed)
				{
					classObserver.observe(tag, classObserverConfig);
					tag.observed = true;
				}
			}
		}, 100, forObservation);
}

function procElement(tag, bgLight, style)
{
	if(!tag.cbBgColor)
	{
		var sDiff = saturation / 100.0,
			sDiffBg = backgroundSaturation / 100.0,
			lDiff = lightness / 100.0,
			lDiffBrd = borderLightness / 100.0,
			lFntMax = frontLightnessLimit / 100,
			lBrdMax = borderLightnessLimit / 100;
		var result = {}, brdColor, roomRules, room;
		var tagName, altText, isSvg = tag instanceof SVGElement;
		var nr = isSvg ? nameResources.svg : nameResources.htm;
		var doc = tag.ownerDocument;

		//if(tag.hasAttribute("debug")) debugger;

		calcElementPath(tag);
		var selectors = getElementMatchedSelectors(tag).join(";"),
			inlineCssText = tag.style.cssText;

		room = [tag.path, selectors, inlineCssText, tag.bgColor, tag.color, tag.background, isSvg].join("\n");
		roomRules = doc.dorm[room];

		if(!roomRules)
		{
			roomRules = {};
			style = style ? style: doc.defaultView.getComputedStyle(tag, "");
			if(tag.tagName == nr.img || tag.tagName == "INPUT" && tag.type == "checkbox" || tag.tagName == "IFRAME" && tag.src.indexOf("chrome-search") === 0 ||
			   style.backgroundImage != "none" && !tag.hasChildNodes() && tag.tagName != "INPUT")
			{
				roomRules.opacity = { value: scaleImgLight(style.opacity) };
			}
			if(!isSvg && removeBackgroundImages > 0 && style.backgroundImage != "none" && (tag.clientWidth * tag.clientHeight > removeBackgroundImages))
			{
				roomRules.backgroundImage = { value: "none" };
			}
			roomRules[nr.dom.bgrColor] = calcColor(style[nr.dom.bgrColor], sDiffBg, bgLight, tag, style);
			bgLight = roomRules[nr.dom.bgrColor].light;
			if(!isSvg)
			{
				roomRules.color = calcFrontColor(style.color, sDiff, lDiff, bgLight, lFntMax, tag);
			}
			brdColor = style[nr.dom.brdColor];
			if (brdColor.indexOf(" r") == -1)
			{
				result =  calcFrontColor(brdColor, sDiff, lDiffBrd, bgLight, lBrdMax, tag);
				roomRules[nr.dom.brdColor] = result.color ? result : null;
			}
			else if (!isSvg)
			{
				result =  calcFrontColor(style.borderTopColor, sDiff, lDiffBrd, bgLight, lBrdMax, tag);
				roomRules.borderTopColor = result.color ? result : null;
				result =  calcFrontColor(style.borderRightColor, sDiff, lDiffBrd, bgLight, lBrdMax, tag);
				roomRules.borderRightColor = result.color ? result : null;
				result =  calcFrontColor(style.borderBottomColor, sDiff, lDiffBrd, bgLight, lBrdMax, tag);
				roomRules.borderBottomColor = result.color ? result : null;
				result =  calcFrontColor(style.borderLeftColor, sDiff, lDiffBrd, bgLight, lBrdMax, tag);
				roomRules.borderLeftColor = result.color ? result : null;
			}
			doc.singleCount = doc.singleCount ? doc.singleCount + 1 : 1;
		}
		else
		{
			roomRules.applied = roomRules.applied ? roomRules.applied + 1 : 1;
			doc.dormCount = doc.dormCount ? doc.dormCount + 1 : 1;
		}

		applyRoomRules(tag, roomRules, nr);

		doc.dorm[room] = roomRules;

		return bgLight;
	}
}

function applyRoomRules(tag, roomRules, nr)
{
	tag.cbBgColor = roomRules[nr.dom.bgrColor];
	var	bgLight = tag.cbBgColor.light;

	if(tag.tagName == "IFRAME" && tag.src.indexOf("chrome-search") == -1)
	{
		tag.onload = onIframeLoaded;
		setTimeout(function(t) { onIframeLoaded.call(t); }, 1, tag);
	}
	if(tag.contentEditable == "true") { overrideInnerHtml(tag); }
	if(tag.id == "hc_extension_bkgnd") { tag.style.cssText += "display:none!important;"; }

	if(roomRules.opacity)
	{
		tag.originalOpacity = tag.style.opacity;
		tag.style.opacity = null;
		tag.style.cssText += ";opacity:" + roomRules.opacity.value + " !important;-webkit-filter: drop-shadow(0px 0px 1px rgba(128,128,128,1))";
	}

	if(roomRules.backgroundImage)
	{
		tag.originalBackgroundImage = tag.style.backgroundImage;
		tag.style.backgroundImage = null;
		tag.style.cssText += ";background-image:" + roomRules.backgroundImage.value + "!important;";
	}

	if (roomRules[nr.dom.bgrColor] && roomRules[nr.dom.bgrColor].color)
	{
		tag.originalBackgroundColor = tag.style[nr.dom.bgrColor];
		tag.style[nr.dom.bgrColor] = null;
		tag.style.cssText += ";" + nr.css.bgrColor + ":" + roomRules[nr.dom.bgrColor].color + " !important";
	}

	if (roomRules.color && roomRules.color.color)
	{
		tag.originalColor = tag.style.color;
		tag.style.color = null;
		tag.style.cssText += ";color:" + roomRules.color.color + " !important";
	}
	else if (roomRules.color && roomRules.color.reason.indexOf("inherited") > -1 && tag.style.color !== "")
	{
		tag.originalColor = "";
	}

	if (roomRules[nr.dom.brdColor])
	{
		tag.originalBorderColor = tag.style[nr.dom.brdColor];
		tag.style[nr.dom.brdColor] = null;
		tag.style.cssText += ";" + nr.css.brdColor + ":" + roomRules[nr.dom.brdColor].color + " !important";
	}
	else
	{
		if (roomRules.borderTopColor)
		{
			tag.originalBorderTopColor = tag.style.borderTopColor;
			tag.style.borderTopColor = null;
			tag.style.cssText += ";border-top-color:" + roomRules.borderTopColor.color + " !important";
		}

		if (roomRules.borderRightColor)
		{
			tag.originalBorderRightColor = tag.style.borderRightColor;
			tag.style.borderRightColor = null;
			tag.style.cssText += ";border-right-color:" + roomRules.borderRightColor.color + " !important";
		}

		if (roomRules.borderBottomColor)
		{
			tag.originalBorderBottomColor = tag.style.borderBottomColor;
			tag.style.borderBottomColor = null;
			tag.style.cssText += ";border-bottom-color:" + roomRules.borderBottomColor.color + " !important";
		}

		if (roomRules.borderLeftColor)
		{
			tag.originalBorderLeftColor = tag.style.borderLeftColor;
			tag.style.borderLeftColor = null;
			tag.style.cssText += ";border-left-color:" + roomRules.borderLeftColor.color + " !important";
		}
	}
	return bgLight;
}

function calcElementPath(tag)
{
	var parentPath = "";
	if(tag.parentElement)
	{
		parentPath = tag.parentElement.path ? tag.parentElement.path : calcElementPath(tag.parentElement);
	}
	tag.path = (parentPath !== "" ? parentPath + " " : "") + tag.tagName + (tag.className && tag.className.replace ? "." + tag.className.replace(/\s/g, ".") : "");
	return tag.path;
}

function onIframeLoaded()
{
	try
	{
		var childDoc = (this.contentDocument || this.contentWindow.document);
		if(!childDoc.hasContrastBooster)
		{
			childDoc.addEventListener("DOMContentLoaded", onIframeDocumentLaoded);
			setTimeout(
				function(doc)
				{
					onIframeDocumentLaoded.call(doc);
				}, 1, childDoc);
		}
	}
	catch(ex)
	{
		console.log(ex);
	}
}

function onIframeDocumentLaoded()
{
	if(this.readyState != "loading" && this.readyState != "uninitialized")
	{
		this.body.style.cssText += "; color: rgb(5,5,5) !important;";
		cbMain(this);
	}
}

function overrideInnerHtml(tag)
{
	if(!tag.innerHtmlOverriden)
	{
		var doc = tag.ownerDocument;
		tag.InnerHtmlGetter = tag.__lookupGetter__('innerHTML');
		tag.InnerHtmlSetter = tag.__lookupSetter__('innerHTML');
		Object.defineProperty(
			tag, "innerHTML",
			{
				get : function ()
				{
					if(!this.innerHtmlCache || Date.now() - this.innerHtmlCache.time > 5000)
					{
						restoreAllColors(doc);
						var innerHtml = this.InnerHtmlGetter();
						this.innerHtmlCache = { time: Date.now(), value: innerHtml };
						setTimeout(function(){cbMain(doc);}, 1);
					}
					return this.innerHtmlCache.value;
				},
				set : function (val)
				{
					this.InnerHtmlSetter(val);
				}
			});
		tag.innerHtmlOverriden = true;
	}
}

function restoreAllColorsInCurrentDocument()
{
	restoreAllColors(this.ownerDocument);
}

function restoreAllColors(doc)
{
	var scrollbarStyle = doc.getElementById("cbScrollbarStyle");
	if(scrollbarStyle)
	{
		doc.body.removeChild(scrollbarStyle);
	}
	var tags = doc.getElementsByTagName("*");
	for(el = 0; el < tags.length; el++)
	{
		tags[el].cbBgColor = null;
		restoreElementColors(tags[el]);
	}
}

function restoreElementColors(tag)
{
	var nr = tag instanceof SVGElement ? nameResources.svg : nameResources.htm;

	if(tag.originalBackgroundColor !== undefined)
	{
		tag.style[nr.dom.bgrColor] = tag.originalBackgroundColor;
	}
	if(tag.originalColor !== undefined)
	{
		tag.style.color = tag.originalColor;
	}
	if(tag.originalBorderColor !== undefined)
	{
		tag.style[nr.dom.brdColor] = tag.originalBorderColor;
	}
	if(tag.originalBorderTopColor !== undefined)
	{
		tag.style.borderTopColor = tag.originalBorderTopColor;
	}
	if(tag.originalBorderRightColor !== undefined)
	{
		tag.style.borderRightColor = tag.originalBorderRightColor;
	}
	if(tag.originalBorderBottomColor !== undefined)
	{
		tag.style.borderBottomColor = tag.originalBorderBottomColor;
	}
	if(tag.originalBorderLeftColor !== undefined)
	{
		tag.style.borderLeftColor = tag.originalBorderLeftColor;
	}
	if(tag.originalOpacity !== undefined)
	{
		tag.style.opacity = tag.originalOpacity;
	}
	if(tag.originalBackgroundImage !== undefined)
	{
		tag.style.backgroundImage = tag.originalBackgroundImage;
	}
}

function checkElement(tag)
{
	tag.is = { checked:
			  (tag instanceof Element || tag.ownerDocument && tag.ownerDocument.defaultView && tag instanceof tag.ownerDocument.defaultView.Element) &&
			  !tag.cbBgColor && tag.tagName && excludeTags.indexOf(tag.tagName) == -1 && !tag.cbIgnore
			 };
	return tag.is && tag.is.checked;
}

// ------------------------------------- CALCULATIONS ------------------------------------- //

function calcFrontColor(rgbStr, sDiff, lDiff, bgLight, lMax, tag)
{
	var set = [sDiff, lDiff, bgLight].join("-");
	var prevColor = frontColors[rgbStr];
	var isInherited = find(frontColors, function(pc) { return pc[set] && pc[set].color == rgbStr; });

	if (isInherited)
	{
		return saveFrontColor(null, rgbStr, set, rgbStr + ".inherited", tag, isInherited[set]);
	}
	else if (prevColor && prevColor[set] !== undefined)
	{
		return { color: prevColor[set].color, reason: rgbStr + ".prevColor:[" + prevColor[set].color + "]", owner: tag, base: prevColor[set] };
	}
	else
	{
		var rgbColor = convertToRgbaColor(rgbStr);

		if (rgbColor.alpha === 0)
		{
			return saveFrontColor(null, rgbStr, set, rgbStr + ".transparent", tag);
		}
		else
		{
			var hslColor = rgbToHsl(rgbColor.red, rgbColor.green, rgbColor.blue);

			changeFrontHslColor(hslColor, sDiff, lDiff, bgLight, lMax);

			var newRgbColor = hslToRgb(hslColor.h, hslColor.s, hslColor.l);

			newRgbColor.alpha = rgbColor.alpha;

			return saveFrontColor(newRgbColor, rgbStr, set, rgbStr + ".ok", tag);
		}
	}
}

function calcColor(rgbStr, sDiff, bgLight, tag, style)
{
	var prevColor = colors[rgbStr], rgbColor;

	if (prevColor)
	{
		return { color: prevColor.color, light: prevColor.light, reason: rgbStr + ".prevColor:[" + prevColor.color + "]" };
	}
	else
	{
		rgbColor = convertToRgbaColor(rgbStr);

		if(tag.tagName == "BODY" && rgbColor.alpha === 0)
		{
			rgbStr = "bodyTrans";
			rgbColor = { red: 255, green: 255, blue: 255, alpha: 1 };
		}

		if (rgbColor.alpha === 0)
		{
			var parentBgColor = getParentBackground(tag, style);
			return { color: null, parentColor: parentBgColor.color, light: parentBgColor.light, reason: parentBgColor.color + ".parent" };
		}
		else
		{
			var hslColor = rgbToHsl(rgbColor.red, rgbColor.green, rgbColor.blue);

			changeHslColor(hslColor, sDiff);

			var newRgbColor = hslToRgb(hslColor.h, hslColor.s, hslColor.l);

			newRgbColor.alpha = rgbColor.alpha;

			return saveColor(newRgbColor, rgbStr, hslColor.l, rgbStr + ".ok");
		}
	}
}

function calcScrollbarThumbColor(light)
{
	var hslColor = { h: fontGrayHue, s: 0.1, l: light };
	changeFrontHslColor(hslColor, saturation / 100.0, borderLightness / 100.0, backgroundLightnessLimit / 100.0, borderLightnessLimit / 100);
	var rgbColor = hslToRgb(hslColor.h, hslColor.s, hslColor.l);
	rgbColor.alpha = 1;
	return convertToRgbString(rgbColor);
}

function calcScrollbarTrackColor()
{
	var hslColor = { h: backgroundGrayHue, s: 0.1, l: 1 };
	changeHslColor(hslColor, saturation / 100.0);
	var rgbColor = hslToRgb(hslColor.h, hslColor.s, hslColor.l);
	rgbColor.alpha = 1;
	return convertToRgbString(rgbColor);
}

function calcLoadingShadowColor()
{
	var hslColor = { h: backgroundGrayHue, s: 0.1, l: 1 };
	changeHslColor(hslColor, saturation / 100.0);
	var rgbColor = hslToRgb(hslColor.h, hslColor.s, hslColor.l);
	rgbColor.alpha = 1 - backgroundLightnessLimit / 100.0;
	return convertToRgbString(rgbColor);
}

function saveFrontColor(rgbColor, rgbStr, set, reason, tag, base)
{
	var prevColor = rgbColor ? convertToRgbString(rgbColor) : null;
	frontColors[rgbStr] = frontColors[rgbStr] || {};
	frontColors[rgbStr][set] = { color: prevColor, reason: reason, owner: tag, base: base };

	return frontColors[rgbStr][set];
}

function saveColor(rgbColor, rgbStr, bgLight, reason)
{
	var prevColor = rgbColor ? convertToRgbString(rgbColor) : null;
	colors[rgbStr] = { color: prevColor, light: bgLight, reason: reason };

	return colors[rgbStr];
}

function changeFrontHslColor(hslColorObject, sDiff, lDiffMin, bgLight, lMax)
{
	hslColorObject.h  = hslColorObject.s === 0 ? fontGrayHue : hslColorObject.h;
	hslColorObject.s = Math.max(Math.min(hslColorObject.s + sDiff, 1.0), 0.0);
	bgLight = bgLight ? bgLight : (backgroundLightnessLimit / 100.0);
	hslColorObject.l = scaleLight(hslColorObject.l, lMax * 100);
	var lDiffCur = hslColorObject.l - bgLight,
		down = Math.max(bgLight - Math.min(Math.max(bgLight - lDiffMin, 0), lMax), 0),
		up = Math.max(Math.min(bgLight + lDiffMin, lMax) - bgLight, 0);
	if(lDiffCur < 0) // background is lighter
	{
		if(down >= up)
		{
			hslColorObject.l = bgLight + Math.min(lDiffCur, -lDiffMin);
		}
		else // invert
		{
			hslColorObject.l = Math.min(bgLight + lDiffMin, lMax);
		}
	}
	else // background is darker
	{
		if(up >= down)
		{
			hslColorObject.l = bgLight + Math.max(lDiffCur, lDiffMin);
		}
		else // invert
		{
			hslColorObject.l = Math.max(bgLight - lDiffMin, 0);
		}
	}
}

function changeHslColor(hslColorObject, sDiff)
{
	hslColorObject.h  = hslColorObject.s === 0 ? backgroundGrayHue : hslColorObject.h;
	hslColorObject.s = Math.max(Math.min(hslColorObject.s + sDiff, 1.0), 0.0);
	hslColorObject.l = scaleLight(hslColorObject.l, backgroundLightnessLimit);
}

function scaleLight(lCur, lMax)
{
	var lScale = Math.max(Math.min(lMax / 100.0, 1.0), 0.0);
	return Math.min(Math.min(lCur, lScale * Math.atan(Math.PI/2 * lCur)), lScale);
}

function scaleImgLight(lCur)
{
	var lScale = Math.max(Math.min(backgroundLightnessLimit / 85.0, 1.0), 0.6);
	return Math.min(Math.min(lCur, lScale * Math.atan(Math.PI/2 * lCur)), lScale);
}

function getParentBackground(tag, style, probeRect)
{
	var childNodes, bgColor;
	var result = { color: null, light: undefined, reason: "not found" };
	var nr = tag instanceof SVGElement ? nameResources.svg : nameResources.htm;
	var doc = tag.ownerDocument;
	style = style ? style : doc.defaultView.getComputedStyle(tag, "");

	if(style.position == "absolute" || style.position == "relative")
	{
		probeRect = probeRect ? probeRect : (tag.rect = tag.rect || tag.getBoundingClientRect());
		if(probeRect.width !== 0)
		{
			childNodes = Array.prototype.slice.call(tag.parentElement.childNodes).filter(
				function(otherTag)
				{
					if(otherTag != tag && (otherTag.is && otherTag.is.checked || checkElement(otherTag)))
					{
						otherTag.rect = otherTag.rect || otherTag.getBoundingClientRect();
						otherTag.zIndex = otherTag.zIndex || doc.defaultView.getComputedStyle(otherTag, "").zIndex;
						otherTag.zIndex = otherTag.zIndex == "auto" ? -999 : otherTag.zIndex;
						if (otherTag.cbBgColor && otherTag.cbBgColor.color &&
							otherTag.zIndex < style.zIndex &&
							otherTag.rect.left <= probeRect.left &&
							otherTag.rect.top <= probeRect.top &&
							otherTag.rect.right >= probeRect.right &&
							otherTag.rect.bottom >= probeRect.bottom )
							return true;
					}
					return false;
				});
			if(childNodes.length > 0)
			{
				childNodes = childNodes.sort(
					function(e1, e2)
					{
						return e2.zIndex - e1.zIndex;
					});
				bgColor = childNodes[0].cbBgColor; //childNodes[0].style[nr.dom.bgrColor];
			}
		}
	}
	bgColor = bgColor ? bgColor : tag.parentElement.cbBgColor;
	if(bgColor)
	{
		result = bgColor;
	}
	else
	{
		probeRect = probeRect ? probeRect : (tag.rect = tag.rect || tag.getBoundingClientRect());
		result = getParentBackground(tag.parentElement, null, probeRect);
	}
	return result;
}

function convertToRgbaColor(rgbString)
{
	var hasAlfa = rgbString[3] == "a";
	rgbString = rgbString.substr(hasAlfa?5:4,rgbString.length-1);
	var colorArr = rgbString.split(",");
	var rgbaColor =
		{
			red   : parseInt(colorArr[0]),
			green : parseInt(colorArr[1]),
			blue  : parseInt(colorArr[2])
		};
	rgbaColor.alpha = hasAlfa ? parseFloat(colorArr[3]) : 1.0;
	return rgbaColor;
}

function convertToRgbString(rgbColorObject)
{
	if (rgbColorObject.alpha == 1)
	{
		return "rgb(" + Math.round(rgbColorObject.red) + ", " + Math.round(rgbColorObject.green) + ", " + Math.round(rgbColorObject.blue) + ")";
	}

	return "rgba(" + Math.round(rgbColorObject.red) + ", " + Math.round(rgbColorObject.green) + ", " + Math.round(rgbColorObject.blue) + ", " + rgbColorObject.alpha + ")";
}

function convertToHslString(hslColorObject)
{
	return "hsl(" + hslColorObject.h + ", " + hslColorObject.s + ", " + hslColorObject.l + ")";
}

function getElementColor(element, propertyName)
{
	return element.ownerDocument.defaultView.getComputedStyle(element, "").getPropertyValue(propertyName);
}

function rgbToHsl(r, g, b)
{
	var min, max, i, l, s, maxcolor, h, rgb = [];
	rgb[0] = r / 255;
	rgb[1] = g / 255;
	rgb[2] = b / 255;
	min = rgb[0];
	max = rgb[0];
	maxcolor = 0;
	for (i = 0; i < rgb.length - 1; i++) {
		if (rgb[i + 1] <= min) {min = rgb[i + 1];}
		if (rgb[i + 1] >= max) {max = rgb[i + 1];maxcolor = i + 1;}
	}
	if (maxcolor === 0) {
		h = (rgb[1] - rgb[2]) / (max - min);
	}
	if (maxcolor == 1) {
		h = 2 + (rgb[2] - rgb[0]) / (max - min);
	}
	if (maxcolor == 2) {
		h = 4 + (rgb[0] - rgb[1]) / (max - min);
	}
	if (isNaN(h)) {h = 0;}
	h = h * 60;
	if (h < 0) {h = h + 360; }
	l = (min + max) / 2;
	if (min == max) {
		s = 0;
	} else {
		if (l < 0.5) {
			s = (max - min) / (max + min);
		} else {
			s = (max - min) / (2 - max - min);
		}
	}
	s = s;
	return {h : h, s : s, l : l};
}

function hslToRgb(hue, sat, light)
{
	var t1, t2, r, g, b;
	hue = hue / 60;
	if ( light <= 0.5 ) {
		t2 = light * (sat + 1);
	} else {
		t2 = light + sat - (light * sat);
	}
	t1 = light * 2 - t2;
	r = hueToRgb(t1, t2, hue + 2) * 255;
	g = hueToRgb(t1, t2, hue) * 255;
	b = hueToRgb(t1, t2, hue - 2) * 255;
	return {red : r, green : g, blue : b};
}

function hueToRgb(t1, t2, hue)
{
	if (hue < 0) hue += 6;
	if (hue >= 6) hue -= 6;
	if (hue < 1) return (t2 - t1) * hue + t1;
	else if (hue < 3) return t2;
	else if (hue < 4) return (t2 - t1) * (4 - hue) + t1;
	else return t1;
}

function find(object, predicate)
{
	var value;
	for (var key in object)
	{
		value = object[key];
		if (predicate.call(key, value))
		{
			return value;
		}
	}
	return undefined;
}

function hashCode(str)
{
	var hash = 0, i, chr, len;
	if (!str && str.length === 0) return hash;
	for (i = 0, len = str.length; i < len; i++)
	{
		chr   = str.charCodeAt(i);
		hash  = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
}

// ------------------------------------- COOKIE & LOG ------------------------------------- //

function getCBCookie(cName)
{
	var i, x, y, arrCookies = document.cookie.split(";");
	for (i = 0; i < arrCookies.length; i++) {
		x = arrCookies[i].substr(0, arrCookies[i].indexOf("="));
		y = arrCookies[i].substr(arrCookies[i].indexOf("=") + 1);
		x = x.replace(/^\s+|\s+$/g, "");
		if (x == cName) {
			return unescape(y);
		}
	}
}

function setCBCookie(cName, value, exdays)
{
	var cValue = escape(value) + ";domain=" + window.location.hostname + ";path=/";
	document.cookie = cName + "=" + cValue;
}

function print(msg, start)
{
	if(debug)
	{
		console.log(msg + ": " + (start ? (Date.now() - start) / 1000.0 + " sec" : ""));
	}
}

// ------------------------------------- INTERFACE ------------------------------------- //

function createEnsign()
{
	var ensign = document.createElement("button");
	ensign.className = "cb-button cb-dialog-open";
	ensign.title = "Press to open [Contrast booster] settings";
	var ensignText = document.createTextNode("≡");
	ensign.appendChild(ensignText);
	ensign.onclick = createDialog;

	document.body.appendChild(ensign);
}

function createDialog()
{
	if(document.getElementsByClassName("cb-dialog-root").length === 0)
	{
		var dialog = document.createElement("div");
		dialog.className = "cb-dialog-root";
		dialog.style.left =	cbDialogLeft;
		dialog.style.top = cbDialogTop;

		var content = document.createElement("div");
		content.className = "cb-dialog-content";

		var title = document.createElement("div");
		title.className = "cb-dialog-title";
		title.addEventListener("mousedown", onDialogMouseDown, false);
		window.addEventListener('mouseup', onMouseUp, false);
		var titleText = document.createTextNode("Contrast booster settings");
		title.appendChild(titleText);

		var runOnThisSiteChBox = document.createElement("input");
		runOnThisSiteChBox.className = "cb-dialog-input";
		runOnThisSiteChBox.id = "runOnThisSiteChBox";
		runOnThisSiteChBox.type = "checkbox";
		runOnThisSiteChBox.checked = runOnThisSite;

		var runOnThisSiteLbl = document.createElement("label");
		runOnThisSiteLbl.className = "cb-dialog-label";
		runOnThisSiteLbl.htmlFor = "runOnThisSiteChBox";
		var runOnThisSiteLblText = document.createTextNode("Run on this site");
		runOnThisSiteLbl.appendChild(runOnThisSiteLblText);

		var saturationTxt = document.createElement("input");
		saturationTxt.className = "cb-dialog-input cb-dialog-input-text";
		saturationTxt.id = "saturationTxt";
		saturationTxt.type = "text";
		saturationTxt.value = saturation;

		var saturationLbl = document.createElement("label");
		saturationLbl.className = "cb-dialog-label";
		saturationLbl.htmlFor ="saturationTxt";
		saturationLbl.title = "Change saturation of fonts and borders by this value";
		var saturationLblText = document.createTextNode("Saturation of font and border");
		saturationLbl.appendChild(saturationLblText);

		var backgroundSaturationTxt = document.createElement("input");
		backgroundSaturationTxt.className = "cb-dialog-input cb-dialog-input-text";
		backgroundSaturationTxt.id = "backgroundSaturationTxt";
		backgroundSaturationTxt.type = "text";
		backgroundSaturationTxt.value = backgroundSaturation;

		var backgroundSaturationLbl = document.createElement("label");
		backgroundSaturationLbl.className = "cb-dialog-label";
		backgroundSaturationLbl.htmlFor ="backgroundSaturationTxt";
		backgroundSaturationLbl.title = "Change saturation of backgrounds by this value";
		var backgroundSaturationLblText = document.createTextNode("Saturation of background");
		backgroundSaturationLbl.appendChild(backgroundSaturationLblText);

		var lightnessTxt = document.createElement("input");
		lightnessTxt.className = "cb-dialog-input cb-dialog-input-text";
		lightnessTxt.id = "lightnessTxt";
		lightnessTxt.type = "text";
		lightnessTxt.value = lightness;

		var lightnessLbl = document.createElement("label");
		lightnessLbl.className = "cb-dialog-label";
		lightnessLbl.htmlFor ="lightnessTxt";
		lightnessLbl.title = "Minimal difference between font and background lightness";
		var lightnessLblText = document.createTextNode("Font lightness difference");
		lightnessLbl.appendChild(lightnessLblText);

		var borderLightnessTxt = document.createElement("input");
		borderLightnessTxt.className = "cb-dialog-input cb-dialog-input-text";
		borderLightnessTxt.id = "borderLightnessTxt";
		borderLightnessTxt.type = "text";
		borderLightnessTxt.value = borderLightness;

		var borderLightnessLbl = document.createElement("label");
		borderLightnessLbl.className = "cb-dialog-label";
		borderLightnessLbl.htmlFor ="borderLightnessTxt";
		borderLightnessLbl.title = "Minimal difference between border and background lightness";
		var borderLightnessLblText = document.createTextNode("Border lightness difference");
		borderLightnessLbl.appendChild(borderLightnessLblText);

		var backgroundLightnessLimitTxt = document.createElement("input");
		backgroundLightnessLimitTxt.className = "cb-dialog-input cb-dialog-input-text";
		backgroundLightnessLimitTxt.id = "backgroundLightnessLimitTxt";
		backgroundLightnessLimitTxt.type = "text";
		backgroundLightnessLimitTxt.value = backgroundLightnessLimit;

		var backgroundLightnessLimitLbl = document.createElement("label");
		backgroundLightnessLimitLbl.className = "cb-dialog-label";
		backgroundLightnessLimitLbl.htmlFor ="backgroundLightnessLimitTxt";
		backgroundLightnessLimitLbl.title = "Limit of background and images lightness";
		var backgroundLightnessLimitLblText = document.createTextNode("Limit of background lightness");
		backgroundLightnessLimitLbl.appendChild(backgroundLightnessLimitLblText);

		var frontLightnessLimitTxt = document.createElement("input");
		frontLightnessLimitTxt.className = "cb-dialog-input cb-dialog-input-text";
		frontLightnessLimitTxt.id = "frontLightnessLimitTxt";
		frontLightnessLimitTxt.type = "text";
		frontLightnessLimitTxt.value = frontLightnessLimit;

		var frontLightnessLimitLbl = document.createElement("label");
		frontLightnessLimitLbl.className = "cb-dialog-label";
		frontLightnessLimitLbl.htmlFor ="frontLightnessLimitTxt";
		frontLightnessLimitLbl.title = "Limit of font lightness";
		var frontLightnessLimitLblText = document.createTextNode("Limit of font lightness");
		frontLightnessLimitLbl.appendChild(frontLightnessLimitLblText);

		var borderLightnessLimitTxt = document.createElement("input");
		borderLightnessLimitTxt.className = "cb-dialog-input cb-dialog-input-text";
		borderLightnessLimitTxt.id = "borderLightnessLimitTxt";
		borderLightnessLimitTxt.type = "text";
		borderLightnessLimitTxt.value = borderLightnessLimit;

		var borderLightnessLimitLbl = document.createElement("label");
		borderLightnessLimitLbl.className = "cb-dialog-label";
		borderLightnessLimitLbl.htmlFor ="borderLightnessLimitTxt";
		borderLightnessLimitLbl.title = "Limit of border lightness";
		var borderLightnessLimitLblText = document.createTextNode("Limit of border lightness");
		borderLightnessLimitLbl.appendChild(borderLightnessLimitLblText);

		var removeBackgroundImagesTxt = document.createElement("input");
		removeBackgroundImagesTxt.className = "cb-dialog-input cb-dialog-input-text";
		removeBackgroundImagesTxt.id = "removeBackgroundImagesTxt";
		removeBackgroundImagesTxt.type = "text";
		removeBackgroundImagesTxt.value = removeBackgroundImages;

		var removeBackgroundImagesLbl = document.createElement("label");
		removeBackgroundImagesLbl.className = "cb-dialog-label";
		removeBackgroundImagesLbl.htmlFor ="removeBackgroundImagesTxt";
		removeBackgroundImagesLbl.title = "Remove background images bigger than this square pixels value.\nSpecify 0 to avoid removing anything.";
		var removeBackgroundImagesLblText = document.createTextNode("Remove background images");
		removeBackgroundImagesLbl.appendChild(removeBackgroundImagesLblText);

		var fontGrayHueSel = document.createElement("select");
		fontGrayHueSel.className = "cb-dialog-input cb-dialog-input-text";
		fontGrayHueSel.cbIgnore = true;
		fontGrayHueSel.id = "fontGrayHueSel";
		addHueOptions(fontGrayHueSel);
		fontGrayHueSel.onchange = onHueSelected;
		fontGrayHueSel.value = fontGrayHue;
		fontGrayHueSel.onchange.apply(fontGrayHueSel);

		var fontGrayHueLbl = document.createElement("label");
		fontGrayHueLbl.className = "cb-dialog-label";
		fontGrayHueLbl.htmlFor ="fontGrayHueSel";
		fontGrayHueLbl.title = "Hue to be used to increase saturation of gray font and border colors";
		var fontGrayHueLblText = document.createTextNode("Hue for gray font and border");
		fontGrayHueLbl.appendChild(fontGrayHueLblText);

		var backgroundGrayHueSel = document.createElement("select");
		backgroundGrayHueSel.className = "cb-dialog-input cb-dialog-input-text";
		backgroundGrayHueSel.cbIgnore = true;
		backgroundGrayHueSel.id = "backgroundGrayHueSel";
		addHueOptions(backgroundGrayHueSel);
		backgroundGrayHueSel.onchange = onHueSelected;
		backgroundGrayHueSel.value = backgroundGrayHue;
		backgroundGrayHueSel.onchange.apply(backgroundGrayHueSel);

		var backgroundGrayHueLbl = document.createElement("label");
		backgroundGrayHueLbl.className = "cb-dialog-label";
		backgroundGrayHueLbl.htmlFor ="backgroundGrayHueSel";
		backgroundGrayHueLbl.title = "Hue to be used to increase saturation of gray background colors";
		var backgroundGrayHueLblText = document.createTextNode("Hue for gray background");
		backgroundGrayHueLbl.appendChild(backgroundGrayHueLblText);

		var settings = document.createElement("div");
		settings.className = "cb-dialog-settings";
		var settingsLeft = document.createElement("div");
		settingsLeft.className = "cb-dialog-settings-left";
		var settingsRight = document.createElement("div");
		settingsRight.className = "cb-dialog-settings-right";

		var commands = document.createElement("div");
		commands.className = "cb-dialog-commands";

		var restoreSettingsBtn = document.createElement("button");
		restoreSettingsBtn.value = "Restore settings";
		restoreSettingsBtn.title = "Restore default settings";
		var restoreSettingsBtnText = document.createTextNode(restoreSettingsBtn.value);
		restoreSettingsBtn.appendChild(restoreSettingsBtnText);
		restoreSettingsBtn.onclick = restoreDefaultSettings;
		restoreSettingsBtn.className = "cb-button";

		var restoreBtn = document.createElement("button");
		restoreBtn.value = "Restore colors";
		restoreBtn.title = "Restore original page colors";
		var restoreBtnText = document.createTextNode(restoreBtn.value);
		restoreBtn.appendChild(restoreBtnText);
		restoreBtn.onclick = restoreAllColorsInCurrentDocument;
		restoreBtn.className = "cb-button";

		var applyBtn = document.createElement("button");
		applyBtn.value = "Apply";
		applyBtn.title = "Apply current settings";
		var applyBtnText = document.createTextNode(applyBtn.value);
		applyBtn.appendChild(applyBtnText);
		applyBtn.onclick = applyNewSettings;
		applyBtn.className = "cb-button";

		var closeBtn = document.createElement("button");
		closeBtn.value = "Close";
		closeBtn.title = "Close this dialog";
		var closeBtnText = document.createTextNode(closeBtn.value);
		closeBtn.appendChild(closeBtnText);
		closeBtn.onclick = closeDialog;
		closeBtn.className = "cb-button";

		dialog.appendChild(content);
		content.appendChild(title);

		content.appendChild(settings);
		settings.appendChild(settingsLeft);
		settings.appendChild(settingsRight);

		settingsLeft.appendChild(saturationLbl);
		settingsLeft.appendChild(br());
		settingsLeft.appendChild(saturationTxt);
		settingsLeft.appendChild(br());

		settingsLeft.appendChild(backgroundSaturationLbl);
		settingsLeft.appendChild(br());
		settingsLeft.appendChild(backgroundSaturationTxt);
		settingsLeft.appendChild(br());

		settingsLeft.appendChild(lightnessLbl);
		settingsLeft.appendChild(br());
		settingsLeft.appendChild(lightnessTxt);
		settingsLeft.appendChild(br());

		settingsLeft.appendChild(borderLightnessLbl);
		settingsLeft.appendChild(br());
		settingsLeft.appendChild(borderLightnessTxt);
		settingsLeft.appendChild(br());

		settingsLeft.appendChild(fontGrayHueLbl);
		settingsLeft.appendChild(br());
		settingsLeft.appendChild(fontGrayHueSel);
		settingsLeft.appendChild(br());

		settingsRight.appendChild(removeBackgroundImagesLbl);
		settingsRight.appendChild(br());
		settingsRight.appendChild(removeBackgroundImagesTxt);
		settingsRight.appendChild(br());

		settingsRight.appendChild(backgroundLightnessLimitLbl);
		settingsRight.appendChild(br());
		settingsRight.appendChild(backgroundLightnessLimitTxt);
		settingsRight.appendChild(br());

		settingsRight.appendChild(frontLightnessLimitLbl);
		settingsRight.appendChild(br());
		settingsRight.appendChild(frontLightnessLimitTxt);
		settingsRight.appendChild(br());

		settingsRight.appendChild(borderLightnessLimitLbl);
		settingsRight.appendChild(br());
		settingsRight.appendChild(borderLightnessLimitTxt);
		settingsRight.appendChild(br());

		settingsRight.appendChild(backgroundGrayHueLbl);
		settingsRight.appendChild(br());
		settingsRight.appendChild(backgroundGrayHueSel);
		settingsRight.appendChild(br());

		settings.appendChild(commands);

		commands.appendChild(runOnThisSiteChBox);
		commands.appendChild(runOnThisSiteLbl);
		commands.appendChild(br());
		commands.appendChild(br());

		commands.appendChild(applyBtn);
		commands.appendChild(br());
		commands.appendChild(restoreSettingsBtn);
		commands.appendChild(br());
		commands.appendChild(restoreBtn);
		commands.appendChild(br());
		commands.appendChild(closeBtn);

		document.body.appendChild(dialog);
	}
}

function onDialogMouseDown(e)
{
	var dialog = document.getElementsByClassName("cb-dialog-root")[0];
	var style = document.defaultView.getComputedStyle(dialog, "");
	dialog.style.top = style.top;
	dialog.style.left = style.left;
	startX = e.clientX;
	startY = e.clientY;
	window.addEventListener('mousemove', onMouseMove, true);
}

function onMouseUp()
{
	var dialog = document.getElementsByClassName("cb-dialog-root")[0];
	if(dialog && dialog.style.cursor == "move")
	{
		dialog.style.cursor = "initial";
		window.removeEventListener('mousemove', onMouseMove, true);

		cbDialogLeft = dialog.style.left;
		cbDialogTop = dialog.style.top;
		setCBCookie("cb_DialogLeft", cbDialogLeft);
		setCBCookie("cb_DialogTop", cbDialogTop);
	}
}

function onMouseMove(e)
{
	var dialog = document.getElementsByClassName("cb-dialog-root")[0];
	dialog.style.cursor = "move";
	dialog.style.top = (parseInt(dialog.style.top) + e.clientY - startY) + 'px';
	dialog.style.left = (parseInt(dialog.style.left) + e.clientX - startX) + 'px';
	startX = e.clientX;
	startY = e.clientY;
}

function onHueSelected()
{
	this.style.cssText = this.options[this.selectedIndex].style.cssText;
}

function addHueOptions(select)
{
	var hOpt;
	grayHues.forEach(
		function(h)
		{
			hOpt = document.createElement("option");
			hOpt.value = h.value;
			hOpt.text = hOpt.label = h.name;
			hOpt.style.cssText += "background-color:" + h.bgrColor + "!important;";
			hOpt.style.cssText += "color:" + h.fntColor + "!important;";
			hOpt.cbIgnore = true;
			select.options.add(hOpt);
		});
}

function br()
{
	return document.createElement("br");
}

function restoreDefaultSettings()
{
	initSettings();

	document.getElementById("runOnThisSiteChBox").checked = runOnThisSite;
	document.getElementById("saturationTxt").value = saturation;
	document.getElementById("backgroundSaturationTxt").value = backgroundSaturation;
	document.getElementById("lightnessTxt").value = lightness;
	document.getElementById("borderLightnessTxt").value = borderLightness;
	document.getElementById("backgroundLightnessLimitTxt").value = backgroundLightnessLimit;
	document.getElementById("frontLightnessLimitTxt").value = frontLightnessLimit;
	document.getElementById("borderLightnessLimitTxt").value = borderLightnessLimit;
	document.getElementById("removeBackgroundImagesTxt").value = removeBackgroundImages;

	var fontGrayHueSel = document.getElementById("fontGrayHueSel");
	fontGrayHueSel.value = fontGrayHue;
	fontGrayHueSel.onchange.apply(fontGrayHueSel);

	var backgroundGrayHueSel = document.getElementById("backgroundGrayHueSel");
	backgroundGrayHueSel.value = backgroundGrayHue;
	backgroundGrayHueSel.onchange.apply(backgroundGrayHueSel);
}

function applyNewSettings()
{
	runOnThisSite = document.getElementById("runOnThisSiteChBox").checked;
	saturation = parseFloat(document.getElementById("saturationTxt").value);
	backgroundSaturation = parseFloat(document.getElementById("backgroundSaturationTxt").value);
	lightness = parseFloat(document.getElementById("lightnessTxt").value);
	borderLightness = parseFloat(document.getElementById("borderLightnessTxt").value);
	backgroundLightnessLimit = parseFloat(document.getElementById("backgroundLightnessLimitTxt").value);
	removeBackgroundImages = parseInt(document.getElementById("removeBackgroundImagesTxt").value);

	fontGrayHue = parseFloat(document.getElementById("fontGrayHueSel").value);
	backgroundGrayHue = parseFloat(document.getElementById("backgroundGrayHueSel").value);
	frontLightnessLimit = parseFloat(document.getElementById("frontLightnessLimitTxt").value);
	borderLightnessLimit = parseFloat(document.getElementById("borderLightnessLimitTxt").value);

	saveSettings();
	restoreAllColors(document);
	resetPrevColors();
	setTimeout(function(){ cbMain(document); }, 1000);
}

function saveSettings()
{
	setCBCookie("cb_runOnThisSite", runOnThisSite);
	setCBCookie("cb_saturation", saturation);
	setCBCookie("cb_backgroundSaturation", backgroundSaturation);
	setCBCookie("cb_lightness", lightness);
	setCBCookie("cb_borderLightness", borderLightness);
	setCBCookie("cb_backgroundLightnessLimit", backgroundLightnessLimit);
	setCBCookie("cb_removeBackgroundImages", removeBackgroundImages);

	setCBCookie("cb_fontGrayHue", fontGrayHue);
	setCBCookie("cb_backgroundGrayHue", backgroundGrayHue);
	setCBCookie("cb_frontLightnessLimit", frontLightnessLimit);
	setCBCookie("cb_borderLightnessLimit", borderLightnessLimit);

	setCBCookie("cb_DialogLeft", cbDialogLeft);
	setCBCookie("cb_DialogTop", cbDialogTop);
}

function getSettings()
{
	var val;

	val = getCBCookie("cb_runOnThisSite");
	if(val)
	{
		runOnThisSite = val == "true";
	}

	val = getCBCookie("cb_saturation");
	if(val)
	{
		saturation = parseFloat(val);
	}

	val = getCBCookie("cb_backgroundSaturation");
	if(val)
	{
		backgroundSaturation = parseFloat(val);
	}

	val = getCBCookie("cb_lightness");
	if(val)
	{
		lightness = parseFloat(val);
	}

	val = getCBCookie("cb_borderLightness");
	if(val)
	{
		borderLightness = parseFloat(val);
	}

	val = getCBCookie("cb_backgroundLightnessLimit");
	if(val)
	{
		backgroundLightnessLimit = parseFloat(val);
	}

	val = getCBCookie("cb_removeBackgroundImages");
	if(val)
	{
		removeBackgroundImages = parseInt(val);
	}

	val = getCBCookie("cb_fontGrayHue");
	if(val)
	{
		fontGrayHue = parseFloat(val);
	}

	val = getCBCookie("cb_backgroundGrayHue");
	if(val)
	{
		backgroundGrayHue = parseFloat(val);
	}

	val = getCBCookie("cb_frontLightnessLimit");
	if(val)
	{
		frontLightnessLimit = parseFloat(val);
	}

	val = getCBCookie("cb_borderLightnessLimit");
	if(val)
	{
		borderLightnessLimit = parseFloat(val);
	}

	val = getCBCookie("cb_DialogLeft");
	if(val)
	{
		cbDialogLeft = val;
	}

	val = getCBCookie("cb_DialogTop");
	if(val)
	{
		cbDialogTop = val;
	}
}

function closeDialog()
{
	document.body.removeChild(document.getElementsByClassName("cb-dialog-root")[0]);
}

function createStyles()
{
	var sheet = document.createElement('style');
	sheet.id = "cbStyle";

	sheet.innerHTML += ".cb-dialog-root {"+
		"z-index: 999;position: fixed;top: 300px;left: 300px;padding: 1px;"+
		"border: 1px solid rgba(140,140,140,1);-webkit-border-radius: 2px;border-radius: 2px;"+
		"font: normal 12px/1 Arial, Helvetica, sans-serif;color: rgb(25,25,25);background: #ffffff;"+
		"-webkit-box-shadow: 1px 1px 8px rgba(0,0,0,0.5);;box-shadow: 1px 1px 8px rgba(0,0,0,0.5)"+
		"}";

	sheet.innerHTML += ".cb-dialog-content {"+
		"width: 100%;height: 100%;-webkit-border-radius: 1px;border-radius: 1px;background: rgb(245,245,245);"+
		"}";

	sheet.innerHTML += ".cb-dialog-title {"+
		"padding: 6px;margin-bottom: 10px;font: normal 16px Arial, Helvetica, sans-serif; text-align: center;background: rgb(230,230,230);"+
		"}";

	sheet.innerHTML += ".cb-dialog-commands {"+
		"display: table-cell;padding: 10px;vertical-align: bottom;"+
		"}";

	sheet.innerHTML += ".cb-dialog-settings {"+
		"display: table;width: 100%;z-index: 99;"+
		"}";

	sheet.innerHTML += ".cb-dialog-settings-left {"+
		"display: table-cell;padding: 10px;vertical-align: bottom;"+
		"}";

	sheet.innerHTML += ".cb-dialog-settings-right {"+
		"display: table-cell;padding: 10px;vertical-align: bottom;"+
		"}";

	sheet.innerHTML += ".cb-dialog-commands > .cb-button {"+
		"width: 120px;margin: 3px 10px 30px 5px!important;"+
		"}";

	sheet.innerHTML += ".cb-button {"+
		"-webkit-box-sizing: content-box;-moz-box-sizing: content-box;box-sizing: content-box;"+
		"margin: 5px;padding: 3px 3px;border: 1px solid rgb(200,200,200);-webkit-border-radius: 1px;border-radius: 1px;"+
		"font: normal normal bold 12px Arial, Helvetica, sans-serif;color: rgb(80,80,80);-o-text-overflow: clip;"+
		"text-overflow: clip;white-space: nowrap;background: rgba(234,234,234,1);-webkit-box-shadow: 0 0 1px 1px rgba(255,255,255,0.8);"+
		"box-shadow: 0 0 1px 1px rgba(255,255,255,0.8);"+
		//"text-shadow: 0 1px 0 rgba(255,255,255,0.8);"+
		"-webkit-transition: all 200ms cubic-bezier(0.42, 0, 0.58, 1) 10ms;-moz-transition: all 200ms cubic-bezier(0.42, 0, 0.58, 1) 10ms;"+
		"-o-transition: all 200ms cubic-bezier(0.42, 0, 0.58, 1) 10ms;transition: all 200ms cubic-bezier(0.42, 0, 0.58, 1) 10ms;"+
		"}";

	sheet.innerHTML += ".cb-button:hover {"+
		"cursor: pointer;border: 1px solid rgba(178,178,178,1);color: rgb(50,50,50);"+
		"-webkit-box-shadow: 0 0 1px 1px rgba(255,255,255,0.8) inset;"+
		"box-shadow: 0 0 1px 1px rgba(255,255,255,0.8) inset;"+
		"}";

	sheet.innerHTML += ".cb-button:active {"+
		"cursor: default;border: 1px solid rgba(211,211,211,1);color: rgba(114,114,114,1);"+
		"background: rgba(247,247,247,1);-webkit-box-shadow: 0 0 1px 1px rgba(255,255,255,0.8) inset, 0 1px 0 0 rgba(0,0,0,0.298039) inset;"+
		"box-shadow: 0 0 1px 1px rgba(255,255,255,0.8) inset, 0 1px 0 0 rgba(0,0,0,0.298039) inset;"+
		"-webkit-transition: none;-moz-transition: none;-o-transition: none;transition: none;"+
		"}";

	sheet.innerHTML += ".cb-dialog-open {"+
		"margin: 0!important;padding: 0px 3px!important;font-size: 16px;border-radius: 0 2px 0 0!important;"+
		"position: fixed!important;bottom: 0px!important;left: 0px!important; z-index: 1000;-webkit-border-radius: 0 2px 0 0!important;"+
		"}";

	sheet.innerHTML += ".cb-dialog-input {"+
		"margin: 3px 0px 15px 8px!important;"+
		"}";

	sheet.innerHTML += ".cb-dialog-input[type='checkbox'] {"+
		"vertical-align: sub;"+
		"}";

	sheet.innerHTML += ".cb-dialog-label {"+
		"margin: 10px!important;"+
		"}";

	sheet.innerHTML += ".cb-dialog-input-text {"+
		"display: inline-block;-webkit-box-sizing: content-box;-moz-box-sizing: content-box;box-sizing: content-box;"+
		"padding: 3px 3px!important;border: 1px solid #bebebe!important;-webkit-border-radius: 2px;border-radius: 2px;width: 135px!important;"+
		"font: normal 12px/normal Arial, Helvetica, sans-serif!important;font-size: 12px!important;color: rgb(80,80,80)!important;-o-text-overflow: clip;"+
		"text-overflow: clip;background: rgb(255,255,255)!important;-webkit-box-shadow: 1px 1px 1px 0 rgba(0,0,0,0.1) inset;"+
		"box-shadow: 1px 1px 1px 0 rgba(0,0,0,0.1) inset;"+
		"}";

	sheet.innerHTML += ".cb-dialog-input-text option {"+
		"font-size: 14px!important;"+
		"}";

	document.body.appendChild(sheet);
}

function removeLoadingShadow(doc)
{
	setTimeout(
		function()
		{
			var shadow = doc.getElementById("cbLoadingShadow");
			if(shadow)
			{
				doc.body.removeChild(shadow);
			}
		}, 1);
}

function createLoadingShadow(doc)
{
	var shadow = doc.createElement('div');
	shadow.id = "cbLoadingShadow";
	shadow.cbIgnore = true;
	var color = calcLoadingShadowColor();
	shadow.style.cssText = "background-color:"+color+"!important;pointer-events:none;position:fixed;left:0;top:0;right:0;bottom:0;z-index:999";

	doc.body.appendChild(shadow);
}

function createScrollbarStyle(doc)
{
	var sheet = doc.getElementById("cbScrollbarStyle") || doc.createElement('style');
	sheet.id = "cbScrollbarStyle";
	sheet.innerHTML = "";

	var thumbHoverColor = calcScrollbarThumbColor(0.8);
	var thumbNormalColor = calcScrollbarThumbColor(0.6);
	var thumbActiveColor = calcScrollbarThumbColor(0.4);
	var trackColor = calcScrollbarTrackColor();

	sheet.innerHTML += "::-webkit-scrollbar {"+
		"width: 12px!important;height: 12px!important;background: "+thumbNormalColor+"!important;"+
		"}";

	sheet.innerHTML += "::-webkit-scrollbar-button {"+
		"background: "+thumbNormalColor+"!important;width:5px!important;height:5px!important;"+
		"}";

	sheet.innerHTML += "::-webkit-scrollbar-button:hover {"+
		"background: "+thumbHoverColor+"!important;"+
		"}";

	sheet.innerHTML += "::-webkit-scrollbar-button:active {"+
		"background: "+thumbActiveColor+"!important;"+
		"}";

	sheet.innerHTML += "::-webkit-scrollbar-thumb {"+
		"background: "+thumbNormalColor+"!important;border-radius: 6px!important;"+
		"-webkit-box-shadow: inset 0 0 8px rgba(0,0,0,0.5);box-shadow: inset 0 0 8px rgba(0,0,0,0.5);"+
		"border: none!important;"+
		"}";

	sheet.innerHTML += "::-webkit-scrollbar-thumb:hover {"+
		"background: "+thumbHoverColor+"!important;"+
		"}";

	sheet.innerHTML += "::-webkit-scrollbar-thumb:active {"+
		"background: "+thumbActiveColor+"!important;-webkit-box-shadow: inset 0 0 8px rgba(0,0,0,0.3);box-shadow: inset 0 0 8px rgba(0,0,0,0.3);"+
		"}";

	sheet.innerHTML += "::-webkit-scrollbar-track {"+
		"background: "+trackColor+"!important;border-radius: 6px!important;-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);box-shadow: inset 0 0 6px rgba(0,0,0,0.3);"+
		"}";

	sheet.innerHTML += "::-webkit-scrollbar-corner {"+
		"background: "+thumbNormalColor+"!important;"+
		"}";

	if(!sheet.parentNode)
	{
		doc.body.appendChild(sheet);
	}
}