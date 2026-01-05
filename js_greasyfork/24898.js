// ==UserScript==
// @name         frisch's Custom Search
// @namespace    http://null.frisch-live.de/
// @version      0.13
// @description  Custom Search Engines added to the custom context menu. Requires my Userscript Extender https://greasyfork.org/en/scripts/24896-frisch-s-userscript-extender
// @author       frisch
// @grant        GM_openInTab
// @grant   GM_getValue
// @grant   GM_setValue
// @include        *
// @downloadURL https://update.greasyfork.org/scripts/24898/frisch%27s%20Custom%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/24898/frisch%27s%20Custom%20Search.meta.js
// ==/UserScript==
console.log("Initializing frisch's Custom Search Context Entries...");
var jq = document.fExt.jq;

// Variables
var searchEngines = [
	{
		category: "General",
		name: "Google",
		url: "https://www.google.com/search?q=SEARCHSTRING&oq=SEARCHSTRING",
		enabled: true
	},
];
var selectedText;
var searchSub = document.fExt.ctxMenu.addCtxSub("Search by Engine");
var entryHeight = 32;

// Styles
document.fExt.createStyle("#fcsEngines { position: fixed; width: 900px; border: 1px solid black; display: block; padding: 12px; z-index: 1000; background-color: #FEFEFE; top: 0; bottom: 0; right: 0; left: 0; margin: auto; }");
document.fExt.createStyle("#fcsEngines * { z-index: 1000; margin: 4px; }");
document.fExt.createStyle("#fcsEngines input, #fcsEngines input, #fcsEngines select { height: 20px !important; }");
document.fExt.createStyle("#fcsEngines input[type=button] { width: 100px !important; }");
document.fExt.createStyle("#fcsEngines a { padding: 4px; border: 1px solid grey; float: right; }");
document.fExt.createStyle("#fcsEngines #fcsAddEngine { width: 100px; }");
document.fExt.createStyle("#fcsEngines td * { width: 100%; float: left; }");
document.fExt.createStyle("#fcsEngines td { padding: 0 4px; }");

// Initialization
function Initialize(){
	LoadEngines();

	SortEngines();

	SetCtxEntries();
}

// Functions
function SetCtxEntries(){
	searchSub.Clear();

	for(i = 0; i < searchEngines.length; i++) {
		var engine = searchEngines[i];
		if(engine.enabled) {
			var ctxItem = document.fExt.ctxMenu.addCtxItem(engine.category + " - " + engine.name, searchSub);
			ctxItem.ClickCloses = false;
			engine.ctxItem = ctxItem;
			engine.ctxItem.Engine = engine;
			engine.ctxItem.Action = function(event, sender, actor) {
				var searchStrings = selectedText.split("\n");
				if(searchStrings.length > 10){
					document.fExt.popup("Searching for more than 10 keywords is not supported.");
				}
				for(i = 0; i < searchStrings.length; i++) {
					if(searchStrings[i] !== "")
						Search(this.Engine, searchStrings[i]);
				}

				return false;
			};
		}
	}

	document.fExt.ctxMenu.addSeparator(searchSub);
	var settingsItem = document.fExt.ctxMenu.addCtxItem("Settings", searchSub);
	settingsItem.Action = function(){
		ShowEngines();
	};
}
function Search(engine, text){
	var url = engine.url;
	var sText = encodeURI(text.replace(" ", "+"));
	// sText = escape(sText);
	while(url.indexOf("SEARCHSTRING") >= 0)
		url = url.replace("SEARCHSTRING", sText);

	console.log("Opening: '" + url + "'");
	GM_openInTab(url, true);
}

function SortEngines(){
	searchEngines.sort(function(a, b){
		if(a.category > b.category)
			return 1;
		else if(a.category < b.category)
			return -1;

		if(a.name > b.name)
			return 1;
		else if(a.name < b.name)
			return -1;

		return 0;
	});
}

function LoadEngines(){
	var lEngines = GM_getValue("fcsSearchEngines");

	if(lEngines !== undefined){
		searchEngines = JSON.parse(lEngines.toString());
		for(var i = 0; i < searchEngines.length; i++){
			if(searchEngines[i].enabled === undefined)
				searchEngines[i].enabled = true;
		}
		document.fExt.popup("Search Engines loaded.");
	}
}

function SaveEngines() {
	var saveEngines = [];

	for(var i = 0; i < searchEngines.length; i++) {
		var saveEngine = {
			category: searchEngines[i].category,
			enabled: searchEngines[i].enabled,
			name: searchEngines[i].name,
			url: searchEngines[i].url,
		};

		saveEngines.push(saveEngine);
	}

	GM_setValue("fcsSearchEngines", JSON.stringify(saveEngines));
	document.fExt.popup("Search Engines saved.");
}

function ShowEngines(){
	var height = 100;
	var settingsDiv = jq("<div id='fcsEngines'><input type='button' style='float: left;' value='+ New' id='fcsAddEngine'/><div style='vertical-align: middle; height: 20px;'>(Use SEARCHSTRING to be replaced as the search query.)</div><br/></div>");
	var settingsTable = jq("<table id='fcsEngineTable'>" +
						   "<colgroup><col width='150px' /><col width='200px' /><col width='50%' /><col width='75px' /><col width='125px' />" +
						   "<tr><td>Name</td><td>Category</td><td>Url</td><td>Enabled</td><td></td></tr>");
	for(i = 0; i < searchEngines.length; i++){
		var engine = searchEngines[i];
		jq("<tr class='fcsEngine'>" +
		   "<td><input class='fcsEngineName' type='text' value='" + engine.name + "' /></td>" +
		   "<td>" + CreateCategoryDropDown(engine.category) + "</td>" +
		   "<td><input type='text' class='fcsEngineUrl' value='" + engine.url + "' /></td>" +
		   "<td><input type='checkbox' " + (engine.enabled ? 'checked' : '') + " class='fcsEngineEnabled' /></td>" +
		   "<td><input type='button' value='Delete' class='fcsEngineDelete' /></td>" +
		   "</tr>").appendTo(settingsTable);
		height += entryHeight;
	}
	settingsTable.appendTo(settingsDiv);
	jq("<div style='float: right;'><input type='button' value='Save' id='fcsSetEngines' /><input type='button' value='Close' id='fcsCloseEngines' /></div>").appendTo(settingsDiv);
	settingsDiv.appendTo("body");
	settingsDiv.css("height", height + "px");
	document.fExt.show(settingsDiv);
}

function CreateCategoryDropDown(selectedCat) {
	var dropDown = "<select class='fcsCategory'>";

	var categories = ["Gaming", "General", "Images", "Shopping", "Translation", "Videos", "XXX"];
	for(j = 0; j < categories.length; j++){
		var category = categories[j];
		var selected = "";
		if(selectedCat == category)
			selected = "selected='selected'";

		dropDown += "<option value='" + category + "' " + selected + ">" + category + "</option>";
	}
	dropDown += "</select>";
	return dropDown;
}

function SetEnginesFromSettings(){
	searchEngines = [];
	jq("#fcsEngineTable tr.fcsEngine").each(function(){
		var engine = {};
		engine.name = jq(this).find(".fcsEngineName").val();
		engine.url = jq(this).find(".fcsEngineUrl").val();
		engine.category = jq(this).find(".fcsCategory").val();
		engine.enabled = jq(this).find(".fcsEngineEnabled").is(":checked");
		searchEngines.push(engine);
	});
}

// Events
jq("#fExtContextMenu").on("fExtContextMenuOpening", function(event, actor){
	selectedText = document.fExt.getSelection() || document.fExt.getSource(actor.get(0));

	jq(searchEngines).each(function(){
		if(this.enabled)
			this.ctxItem.Toggle(selectedText.length > 0);
	});
});

jq(document).on("click", ".fcsEngineDelete", function(){
	if(confirm("Delete this Engine?") === true) {
		jq(this).parents("tr:first").remove();
		var height = parseInt(jq("#fcsEngines").css("height").replace("px",""));
		height -= entryHeight;
		jq("#fcsEngines").css("height", height + "px");
	}
});

jq(document).on("click", "#fcsAddEngine", function(){
	jq("<tr class='fcsEngine'>" +
	   "<td><input class='fcsEngineName' type='text' value='' /></td>" +
	   "<td>" + CreateCategoryDropDown() + "</td>" +
	   "<td><input type='text' class='fcsEngineUrl' value='' /></td>" +
	   "<td><input type='checkbox' checked class='fcsEngineEnabled' /></td>" +
	   "<td><input type='button' value='Delete' class='fcsEngineDelete' /></td></tr>").appendTo("#fcsEngineTable");

	var height = parseInt(jq("#fcsEngines").css("height").replace("px",""));
	height += entryHeight;
	jq("#fcsEngines").css("height", height + "px");
});

jq(document).on("click", "#fcsSetEngines", function(){
	SetEnginesFromSettings();
	SortEngines();
	SetCtxEntries();
	SaveEngines();
});

jq(document).on("click", "#fcsCloseEngines", function(){
	jq("#fcsEngines").remove();
});

Initialize();