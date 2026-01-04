// ==UserScript==
// @name            Cantr Visual Enhancer
// @description     Extends the functionality of Cantr II's user interface by adding features that can help improve the user experience.
// @icon			http://mirror.anicator.com/cantr_visual_icon.png
// @version         1.5.1.6
// @author		    AniCator, Natso (original)
// @include       	http://www.cantr.net/*
// @include       	http://cantr.net/*
// @include       	https://cantr.net/*
// @include       	https://www.cantr.net/*
// @include       	cantr.net/*
// @include       	*cantr.loc/*
// @include       	intro.cantr.net/*
// @include       	https://intro.cantr.net/*
// @include       	http://intro.cantr.net/*
// @include       	http://test.cantr.net/*
// @grant         	none
// @exclude       	http://cantr.net/*?page=login*
// @include       	www.cantr.net/*
// @copyright       2013-2021, AniCator (http://www.anicator.com), Natso (original script, 2013)
// @license			MIT
// @namespace       http://www.anicator.com
// @downloadURL https://update.greasyfork.org/scripts/375746/Cantr%20Visual%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/375746/Cantr%20Visual%20Enhancer.meta.js
// ==/UserScript==

/**
Changelog
1.5.1.6
* Added support for the intro server domain. (Genesis)

1.5.1.5
* Improved the performance of the event parsing.
	Removed the 200 events limit.
	There is still room for more performance improvements.
* Partial code refactor.
* Wiki data is loaded using the HTTPS protocol when connected via SSL.

1.5.1.4
* Improved name color preview support in the name coloring tab.
	This means you won't have to scroll through the event list to find a name that you have changed the color of.
* Improved validation of color fields.
	It will now zero-fill when there are too few characters when using hexadecimal colors.
	If a hexadecimal color entry has too many characters it will trim it down.

1.5.1.3
* Fixed bug that caused new asynchronously received events to no longer be processed by CVE.

1.5.1.2
* Improved usability of name colouring feature
* Fixed a couple of minor bugs
* Fixed issue that caused the page to scroll back to the top every time you switched option tabs

1.5.1.1
* Fixed typo for some NaN checks

1.5.1
* Added name coloring feature that allows you to color individual names and a default name color (may not work together with Cantr Enhanced, untested)
* Improved detection of character names

1.5.0.2
* Fixed bug that prevented the script from analyzing new incoming events in Firefox

1.5.0.1
* Fixed various bugs that stopped the addon from working in Firefox

1.5.0
* Added option that enables the retrieval of information from the wiki (requires browser permissions to fetch unsafe data)
* It is now possible to toggle the font styles of the emotes (i.e. enabling bolding and/or italics)

1.4.9
* Updated the addon to support the updated Cantr events

1.4.8
* Added support for enabling and disabling the different modes of emote detection.
* Cleaned up the CVE UI.
* Made the CVE bar light up when the mouse is hovering over it.
* Added sound that plays when an event is received. (disabled by default, tested on Chrome only)
* Removed the slideUp and slideDown code, replaced it with the snappier display:none and display:block (for compatibility reasons)
* Added code that should detect if the user has written their own cvee_emote, cvee_character and cvee_event classes in Player Settings -> Interface

Note: Javascript code doesn't always execute when the Cantr tab isn't the active tab. Sounds may not play after having switched tabs.

1.4.7
* Fixed sorting bug. (caused dynamic character description boxes to render on top of the CVE interface)

1.4.6
* Fixed bug that caused CVE to override pretty much all event handlers.

1.4.5a
* Removed a bunch of console.log calls.

1.4.5
* Moved options to the bottom of the screen. (clicking on the bar makes the CVE options pop up)
* Added experimental color picker.
* Added preview text.
* Enabled CVE on all Cantr pages.

1.4.4
* Emote color changes now update instantly (no page reload required)
*/

var VersionString = "1.5.1.6";

var scriptStartTime = new Date().getTime();
//var $ = unsafeWindow.jQuery;

function EmptyFunctionBody() {};

if (typeof showCharDescBox !== "function")
{
	showCharDescBox = EmptyFunctionBody;
}

var CVELogPrefix = "Cantr Visual Enhancer | ";
function CVELog( msg )
{
    console.log( CVELogPrefix, msg );
}

// Property functions
function IsStorageAvailable()
{
	if(typeof(Storage) !== undefined)
		return true;
	return false;
}

function SetUseNameColor(Bool)
{
	SetStoredValue("cve_name_color_enabled", Bool);
}

function ShouldUseNameColor()
{
	var Value = GetStoredValue("cve_name_color_enabled");
	return Value !== null ? (Value == "true") : true;
}

function SetUseWikiInfo(Bool)
{
	SetStoredValue("cve_wiki_info_enabled", Bool);
}

function ShouldUseWikiInfo()
{
	var Value = GetStoredValue("cve_wiki_info_enabled");
	return Value !== null ? (Value == "true") : false;
}

function SetUnlockEventMessageField(Bool)
{
    SetStoredValue("cve_unlock_chatbox", Bool);
}

function ShouldUnlockEventMessageField()
{
    var Value = GetStoredValue("cve_unlock_chatbox");
    return Value !== null ? (Value == "true") : false;
}

function SetUseSound(Bool)
{
	if(Bool)
		EventSound.play();
	SetStoredValue("cve_snd_enabled", Bool);
}

function ShouldUseSound()
{
	var Value = GetStoredValue("cve_snd_enabled");
	return Value !== null ? (Value == "true") : false;
}

function SetUseAsterisks(Bool)
{
	SetStoredValue("cve_quotes_asterisks", Bool);
}

function ShouldUseAsterisks()
{
	var Value = GetStoredValue("cve_quotes_asterisks");
	return Value !== null ? (Value == "true") : true;
}

function SetUseDashes(Bool)
{
	SetStoredValue("cve_quotes_dashes", Bool);
}

function ShouldUseDashes()
{
	var Value = GetStoredValue("cve_quotes_dashes");
	return Value !== null ? (Value == "true") : true;
}

function SetUseHashtags(Bool)
{
	SetStoredValue("cve_quotes_hashtags", Bool);
}

function ShouldUseHashtags()
{
	var Value = GetStoredValue("cve_quotes_hashtags");
	return Value !== null ? (Value == "true") : true;
}

function SetUseBold(Bool)
{
	SetStoredValue("cve_style_bold", Bool);
}

function ShouldUseBold()
{
	var Value = GetStoredValue("cve_style_bold");
	return Value !== null ? (Value == "true") : false;
}

function SetUseItalics(Bool)
{
	SetStoredValue("cve_style_italics", Bool);
}

function ShouldUseItalics()
{
	var Value = GetStoredValue("cve_style_italics");
	return Value !== null ? (Value == "true") : true;
}

function SetParseAmount(NewParseAmount)
{
	SetStoredValue("cve_parse_amount", NewParseAmount);
}

function GetParseAmount()
{
	var Value = GetStoredValue("cve_parse_amount");
	return Value !== null ? parseInt(Value) : 100;
}

function SetDefaultNameColor(NewColor)
{
	SetStoredValue("cve_color_name_default", NewColor);
}

function GetDefaultNameColor()
{
	var Value = GetStoredValue("cve_color_name_default");
	return Value !== null ? Value : "#cccccc";
}

function SetEmoteColor(NewColor)
{
	SetStoredValue("cve_color_emote", NewColor);
}

function GetEmoteColor()
{
	var Value = GetStoredValue("cve_color_emote");
	return Value !== null ? Value : "#cccccc";
}

function SetStoredValue(Item, Value)
{
	if(IsStorageAvailable())
		localStorage.setItem(Item, Value);
}

function GetStoredValue(StoredItem)
{
	if(IsStorageAvailable())
	{
		var Value = localStorage.getItem(StoredItem);
		return Value;
	}
	return null;
}

// Other functions

function GetDefinedCSS(s){
    if(!document.styleSheets) return '';
    if(typeof s== 'string') s= RegExp('\\b'+s+'\\b','i'); // IE capitalizes html selectors 

    var A, S, DS= document.styleSheets, n= DS.length, SA= [];
	try
	{
    while(n){
    	S= DS[--n];
    	A= (S.rules)? S.rules: S.cssRules;
    	for(var i= 0, L= A.length; i<L; i++){
    		tem= A[i].selectorText? [A[i].selectorText, A[i].style.cssText]: [A[i]+''];
    		if(s.test(tem[0])) SA[SA.length]= tem;
    	}
    }
	}
	catch(e)
	{
		
	}
	
    return SA.join('\n\n');
}

// -

var PlayerSettingsOverride = false;

var cveStyle = document.createElement('style');
cveStyle.type = 'text/css';
cveStyle.innerHTML = ".cve_column { background-color:rgba(0,0,0,0.1); display:inline-block; position:relative; width:450px; padding:5px; margin:5px; float:left; text-align:left; }" +
".cve_column_wide { background-color:rgba(0,0,0,0.1); display:inline-block; position:relative; padding:5px; margin:5px; float:left; text-align:left; }" +
".cve_column h1 { font-size:1.2em; }" +
".cve_column_wide h1 { font-size:1.2em; }" +
".cve_main_bar{ background-color: #060;-webkit-transition: background 100ms ease;-moz-transition: background 100ms ease;-ms-transition: background 100ms ease;-o-transition: background 100ms ease;transition: background 100ms ease;}" +
".cve_main_bar:hover{ background-color: #55BB55; color:#000; font-weight:bold;}" + 
".cve_column_menu { background-color:rgba(0,0,0,0.1); display:inline-block; float:left; min-width:200px;}" + 
".cve_column_menu ul{ list-style:none; margin:0; padding:0; }" + 
".cve_column_menu li{ background-color:rgba(0,0,0,0.1); margin:2px; padding:0; color:#FFF; display:block; width:100%; line-height:2em; }" + 
".cve_column_menu li:hover{ background:rgba(255,255,255,0.1); margin:2px; padding:0; text-decoration:none; }" + 
".cve_splitter { min-height:200px; min-width:450px; max-width:1000px; display:inline-block; overflow:hidden; overflow-y:scroll;}" + 
".cve_column_menu { transition: 300ms ease-out; }" + 
".cve_column { transition: 300ms ease-out; }" + 
".cve_options { transition: 300ms ease-out; }" + 
".cve_options_panel { transition: 300ms ease-out; }" + 
".cve_select        { border: 3px solid #660; margin:0 0.2em 0 0.2em; padding:0.1em; }" + 
".cve_select:hover  { border: 3px solid #FF0; margin:0 0.5em 0 0.5em; padding:0.1em; }" + 
".name_color_element:nth-child(odd) { background:#020; }" + 
".name_color_element { padding: 5px 0 5px 0; }" + 
".name_color_element span { margin: 0 1em 0 1em; min-width:300px; display: inline-block; }" + 
"@media (min-width: 400px) { .cve_column_menu{ width:100%; } .cve_column{ width:100%; } .cve_column_wide{ width:100%; } .cve_splitter{ display:block; width:100%; height:300px; overflow:hidden; overflow-y:scroll; } }" + 
"@media (min-width: 960px) { .cve_column_menu{ width:200px; } .cve_column{ width:450px; } .cve_column_wide{ width:100%; } .cve_splitter{ }}";

if(!GetDefinedCSS("cvee_emote"))
{
	var fontStyle = ShouldUseItalics() ? "italic" : "normal";
	var fontWeight = ShouldUseBold() ? "bold" : "normal";
	cveStyle.innerHTML += ".cvee_emote {font-style:" + fontStyle + ";font-weight:" + fontWeight + ";color:" + GetEmoteColor() + ";}";
}
if(!GetDefinedCSS("cvee_event"))
	cveStyle.innerHTML += ".cvee_event {color:#999999;}";
if(!GetDefinedCSS("cvee_character"))
	cveStyle.innerHTML += ".cvee_character { transition:0.1s; }";
	
if(GetDefinedCSS("cvee_emote") || GetDefinedCSS("cvee_event") || GetDefinedCSS("cvee_character"))
	PlayerSettingsOverride = true;

document.getElementsByTagName('head')[0].appendChild(cveStyle);

var ColorGrid = [
];

var ColorIdPrefix = "cve_color_";

var EventSound = null;
if(EventSound === null)
	EventSound = new Audio("http://mirror.anicator.com/omni_interface04.wav");

var hilight_emotes = function(i) {return '<span class="cvee_emote">' + i + '</span>';};
var hilight_characters = function(i, a, b, c) {return a + '<span class="cvee_character">' + b + '</span>'+c;};
var hilight_events = function(i) {return '<span class="cvee_event">' + i + '</span>';};
	
// Functions
function rgbToHex(R,G,B) { return toHex(R)+toHex(G)+toHex(B); }
function toHex(n) {
 n = parseInt(n,10);
 if (isNaN(n)) return "00";
 n = Math.max(0,Math.min(n,255));
 return "0123456789ABCDEF".charAt((n-n%16)/16) + "0123456789ABCDEF".charAt(n%16);
}

function GenerateColors()
{
	// Color blocks
	var BlockCounter = 0;
	for(var g=0;g < 8; g++)
	{
		for(var b=0;b < 8; b++)
		{
			for(var r=0;r < 8; r++)
			{
				if(BlockCounter < (8*8*8))
				{
					ColorGrid.push("#" + rgbToHex(r * 33,g * 33,b * 33));
					BlockCounter++;
				}
				else
					break;
			}
		}
	}
	
	// Greyscale blocks
	for(var v=1;v < 257; v++)
	{
		var GreyscaleValue = (v / 32);
		ColorGrid.push("#" + rgbToHex(GreyscaleValue * 33,GreyscaleValue * 33,GreyscaleValue * 33));
	}
}

function MakeColorPicker(TargetId)
{
	var ColorPickerString = "<span style='display:inline-block'>";
	for(var i=0; i < ColorGrid.length; i++)
	{
		ColorPickerString += "<button id='" + ColorIdPrefix + ColorGrid[i] + "' style='background-color:" + ColorGrid[i] + ";width:12px;height:12px;border:none;'></button>";
		if((i + 1) % 8 === 0)
			ColorPickerString += "<br/>";
		if((i + 1) % 64 === 0)
			ColorPickerString += "</span><span style='display:inline-block'>";
	}
	
	ColorPickerString += "</span>";
	
	return ColorPickerString;
}

function CreateColorListeners(TargetId)
{
	var Target = document.getElementById(TargetId);
	for(var i=0; i < ColorGrid.length; i++)
	{
		new ColorListener(Target, i);
	}
}

function ColorListener(Target, Id)
{
	if(document.getElementById(ColorIdPrefix + ColorGrid[Id]) === null)
		return;
	document.getElementById(ColorIdPrefix + ColorGrid[Id]).addEventListener('click', function(){
			Target.value = ColorGrid[Id];
			var event = new Event('change');
			Target.dispatchEvent(event);
			ApplyOptions();
		}, false);
}

var objects = document.getElementsByClassName("obj_name");
function ParseObjectNames()
{
	CVELog("Parsing object names");
	var httpString = "";
	
	for(var j=0;j<objects.length;j++)
        (function(j)
        {
            var object_name = objects[j].innerText;
			if(object_name === undefined)
				return;
            var index = object_name.indexOf("of ");
            if(index == -1)
                return;

            index += 3;

            object_name = object_name.substring(index);
            var ajax_url = httpString + "//wiki.cantr.net/api.php/?format=json&action=query&titles="+ object_name +"&prop=revisions&rvprop=content";

            $.ajax({
              url: ajax_url,
              dataType: 'jsonp'
            })
            .done(function( response ) {
              new ObjectWikiLink(response, j, object_name);
            });
        })(j);
}

function ObjectWikiLink(Content, Id, ObjectName)
{
    var heal_amount = 0;
    var food_amount = 0;
	var gather_amount = 0;

    var health_str = "heals=";
    var food_str = "eaten=";
	var gather_str = "gathered=";
    for(var key in Content.query.pages)
    {
        if(key == -1)
            continue;

        var revision = Content.query.pages[key].revisions[0];
        var revision_str = revision["*"].replace(/\s/g, "");
        revision_str = revision_str.substring(revision_str.indexOf("Infobox:Resource"));
        var index = revision_str.indexOf(health_str);
        if(index != -1)
        {
            heal_amount = parseFloat(revision_str.substring(index + health_str.length,index + health_str.length + 3));
            if(isNaN( heal_amount ))
                heal_amount = parseFloat(revision_str.substring(index + health_str.length,index + health_str.length + 2));
            if(isNaN( heal_amount ))
                heal_amount = parseFloat(revision_str.substring(index + health_str.length,index + health_str.length + 1));
        }

        index = revision_str.indexOf(food_str);
        if(index != -1)
        {
            food_amount = parseFloat(revision_str.substring(index + food_str.length,index + food_str.length + 3));
            if(isNaN( food_amount ))
                food_amount = parseFloat(revision_str.substring(index + food_str.length,index + food_str.length + 2));
            if(isNaN( food_amount ))
                food_amount = parseFloat(revision_str.substring(index + food_str.length,index + food_str.length + 1));
        }
		
		index = revision_str.indexOf(gather_str);
        if(index != -1)
        {
            gather_amount = parseFloat(revision_str.substring(index + gather_str.length,index + gather_str.length + 4));
            if(isNaN( gather_amount ))
                gather_amount = parseFloat(revision_str.substring(index + gather_str.length,index + gather_str.length + 3));
            if(isNaN( gather_amount ))
                gather_amount = parseFloat(revision_str.substring(index + gather_str.length,index + gather_str.length + 2));
			if(isNaN( gather_amount ))
                gather_amount = parseFloat(revision_str.substring(index + gather_str.length,index + gather_str.length + 1));
        }
    }

    if(isNaN(heal_amount)) heal_amount = 0;
    if(isNaN(food_amount)) food_amount = 0;
	if(isNaN(gather_amount)) gather_amount = 0;

    if(heal_amount === 0 && food_amount === 0 && gather_amount === 0)
        return;
	objects[Id].innerHTML += "|<span style='color:greenyellow'> heals: " + heal_amount + "g | feeds: " + food_amount + "g | gathered: " + gather_amount + "g</span> <a href=\"http://wiki.cantr.net/index.php/" + ObjectName + "\" target=\"_blank\">(wiki)</a> |";
}

function GetColorValue( Color )
{
	if(Color[0] === '#')
	{
		var ZeroString = '0';
		var ZeroCount = 7 - Color.length;
		
		if(ZeroCount > 0)
		{
			ZeroString = ZeroString.repeat(ZeroCount);
			Color += ZeroString;
		}
		
		Color = Color.substring(0,7);
	}
	
	return Color;
}

function GetCheckboxValue( Boolean )
{
	if( Boolean )
	{
		return "checked";
	}
	
	return "unchecked";
}

// Name Color Entry object
function NameColorEntry( CharacterID, CharacterName, Color )
{
    this.CharacterID = CharacterID;
    this.CharacterName = CharacterName;
    this.Color = Color;
}

var NameColorEntries = [];

function HasNameEntryForID( CharacterID )
{
    for( var i = 0; i < NameColorEntries.length; i++ )
    {
        if( CharacterID === NameColorEntries[i].CharacterID )
        {
            return NameColorEntries[i];
        }
    }
    
    return false;
}

function GetNameEntryIndexForID( CharacterID )
{
    for( var i = 0; i < NameColorEntries.length; i++ )
    {
        if( CharacterID === NameColorEntries[i].CharacterID )
        {
            return i;
        }
    }
    
    return -1;
}

function AddNameColorField( CharacterID, CharacterName, Color )
{  
    var NameColorList = document.getElementById("name_color_list");
    var NameColorElement = document.createElement("div");
    
    NameColorElement.className = "name_color_element";
    
    var RemoveButtonElement = document.createElement("button");
    RemoveButtonElement.innerHTML = "X";
    RemoveButtonElement.addEventListener( "click", function(e) {
        e.target.parentElement.parentElement.removeChild( e.target.parentElement );
        var NameIdx = GetNameEntryIndexForID( CharacterID );
        CVELog( NameIdx + " " + CharacterID );
        CVELog( NameColorEntries );
        if( NameIdx > -1 )
        {
            NameColorEntries.splice( NameIdx, 1 );
        }
        
        CVELog( NameColorEntries );
        StoreNameColorEntries();
        ApplyOptions();
    });
    
    var InfoElement = document.createElement("span");
	InfoElement.style.color = Color;
    InfoElement.innerHTML = "" + CharacterID + " | " + CharacterName;
	InfoElement.setAttribute( "id", "info-" + CharacterID );
    
    var ColorField = document.createElement("input");
    ColorField.value = Color;
    ColorField.className = "name_color_input_field";
    ColorField.setAttribute( "type", "text" );
    ColorField.setAttribute( "id", CharacterID );

    NameColorElement.appendChild( RemoveButtonElement );
    NameColorElement.appendChild( InfoElement );
    NameColorElement.appendChild( ColorField );
    NameColorList.appendChild( NameColorElement );
    
    ColorField.addEventListener( "change", function(e) {
        var NameEntry = HasNameEntryForID( e.target.id );
        if( NameEntry !== false )
        {
			e.target.value = GetColorValue(e.target.value);
			
            NameEntry.Color = e.target.value;
			document.getElementById( "info-" + CharacterID ).style.color = NameEntry.Color;
            StoreNameColorEntries();
            ApplyOptions();
        }
	});
	
	// var CharacterStyleIdentifier = "charstyle_" + CharacterID;
	// var CharacterStyleElement = document.getElementById(CharacterStyleIdentifier);
	// if(typeof CharacterStyleElement === 'undefined')
	// {
	// 	CharacterStyleElement = document.createElement("style");
	// 	CharacterStyleElement.setAttribute("id", "charstyle_" + CharacterID);
	// 	CharacterStyleElement.type = 'text/css';

	// 	document.getElementsByTagName('head')[0].appendChild(CharacterStyleElement);
	// }

	// CharacterStyleElement.innerHTML = ".char_" + CharacterID + "{ color: " + NameEntry.Color + "; }";
}

function LoadNameColorEntries()
{
    var Entries = JSON.parse( GetStoredValue( "cve_name_color_entries" ) );
    if( Entries !== null )
    {
        NameColorEntries = Entries;
    }
}

function StoreNameColorEntries()
{
    SetStoredValue( "cve_name_color_entries", JSON.stringify( NameColorEntries ) );
}

function SelectNameForColoring( EventObject )
{
    var ChildNode = EventObject.target;
    var ParentNode = ChildNode.parentElement;
    
    var CharacterIDClass = ParentNode.className.split(" ")[1];
    if( CharacterIDClass !== undefined )
    {
        var CharacterID = CharacterIDClass.split("_")[1];
        if( isNaN( CharacterID ) === false )
        {
            if( HasNameEntryForID( CharacterID ) === false )
            {
                CVELog( "Add name colour field for character ID #" + CharacterID );
                AddNameColorField( CharacterID, $(ChildNode).text(), GetDefaultNameColor() );
                
                NameColorEntries.push( new NameColorEntry( CharacterID, $(ChildNode).text(), GetDefaultNameColor() ) );
                StoreNameColorEntries();
            }
            else
            {
                CVELog( "Name colour field already exists for character ID #" + CharacterID );
            }
            
            showCharDescBox( EventObject );
        }
    }
    
    EnableNameSelection( false );
}

function ParseCharacters()
{
	var CharacterNodes = document.getElementsByClassName("cvee_character");
	for( var i = 0; i < CharacterNodes.length; i++ )
	{
		StyleCharacter(CharacterNodes[i]);
	}
}

function GetCharacterIDFromClassName(ClassName)
{
	var CharacterIDClass = ClassName.split(" ")[1];
	if(CharacterIDClass !== undefined && CharacterIDClass.indexOf( "char_" ) === 0)
	{
		var CharacterID = CharacterIDClass.split("_")[1];
		if( isNaN( CharacterID ) === false )
		{
			return CharacterID;
		}
	}

	return -1;
}

function StyleCharacter(ChildNode)
{
	var ParentNode = ChildNode.parentElement;
	var CharacterID = GetCharacterIDFromClassName(ParentNode.className);
	if(CharacterID > 0)
	{
		if( ShouldUseNameColor() )
		{
			var NameEntry = HasNameEntryForID( CharacterID );
			if( NameEntry !== false )
			{
				ChildNode.style.color = NameEntry.Color;
			}
			else
			{
				ChildNode.style.color = GetDefaultNameColor();
			}
		}
		else
		{
			ChildNode.style.color = "inherit";
		}
	}
}

function ApplyOptions()
{
	if(!PlayerSettingsOverride)
	{
        // Emote colouring
		var EmoteElements = document.getElementsByClassName("cvee_emote");
		var EmoteColor = GetEmoteColor();
		for(var i=0; i < EmoteElements.length; i++)
		{
			var newFontStyle = ShouldUseItalics() ? "italic" : "normal";
			var newFontWeight = ShouldUseBold() ? "bold" : "normal";
			
			EmoteElements[i].style.fontStyle = newFontStyle;
			EmoteElements[i].style.fontWeight = newFontWeight;
			
			EmoteElements[i].style.color = EmoteColor;
		}
        
        ParseCharacters();
	}
	else
	{
		document.getElementById("cve_message_box").innerHTML = "Style is being overridden by Player Settings.";
	}

    if(ShouldUnlockEventMessageField())
    {
        GameMessageField.removeAttribute("style");
    }
}

var OptionsDisplayed = false;
function Options(ShouldDisplay)
{
	var cveOptionsPanel = document.getElementById('cve_options_panel');
	if(ShouldDisplay)
	{
		document.getElementById('cve_options_button_text').innerHTML = '<a href="#" style="font-size:12pt;font-weight:bold;color:#FF9700;padding:5px;">Save CVE Options</a>';
		OptionsDisplayed = true;
		
		cveOptionsPanel.style.display = "block";
		//$(cveOptionsPanel).slideDown(200);
	}
	else
	{
		document.getElementById('cve_options_button_text').innerHTML = 'Show CVE Options';
		OptionsDisplayed = false;
        
        EnableNameSelection( false );
		
		cveOptionsPanel.style.display = "none";
		//$(cveOptionsPanel).slideUp(200);
		
		ApplyOptions();
	}
}

var MenuPanels = new Array();
function DisplayPanel(panel_name)
{
	var panel = document.getElementById(panel_name);
	if(panel === null)
	{
		CVELog("Panel " + panel_name + " does not exist.");
		return;
	}
	
	for(var i=0;i<MenuPanels.length;i++)
	{
		var iter_panel = document.getElementById(MenuPanels[i]);
		if(iter_panel === null) continue;
		
		iter_panel.style.display = "none";
	}
	
	panel.style.display = "inline-block";
}

function CreatePanelContainer(panel_name)
{
	var PanelContainer = document.createElement('div');
	PanelContainer.className = "cve_splitter";
	PanelContainer.id = panel_name;
	PanelContainer.style.display = "none";
	
	MenuPanels.push(PanelContainer.id);
	
	return PanelContainer;
}

function CreatePanel(panel_container)
{
	var PanelContent = document.createElement('div');
	PanelContent.className = "cve_column";
	
	panel_container.appendChild(PanelContent);
	
	return PanelContent;
}

function CreateWidePanel(panel_container)
{
	var PanelContent = document.createElement('div');
	PanelContent.className = "cve_column_wide";
	
	panel_container.appendChild(PanelContent);
	
	return PanelContent;
}

var hilight_quotes = function(i, a, b) {
    // There are several styles of emotes that vary by region.  If you enable them all, you will probably get a mis-identified emote on occasion, sorry!
    // To enable one, remove from the "//" beginning of the line.  To Disable, put a // at the beginning of the line.
    
    // *Paired Astrisks*
	if(ShouldUseAsterisks())
		b = b.replace(/\*[^<>]*?\*/g,hilight_emotes);
    
    // -Paired Dashes-
	if(ShouldUseDashes())
		b = b.replace(/-[^<>]*?-/g,hilight_emotes);
    
    // #Paired Hashtags#
	if(ShouldUseHashtags())
		b = b.replace(/#[^<>]*?#/g,hilight_emotes);
    
    return a + '<span style="color:#FFFFFF">' + b + '</span>';
};

// --

// Options
GenerateColors();

var cveOptionsLocation = document.getElementById("player_menu");
if(cveOptionsLocation === null)
	cveOptionsLocation = document.getElementsByTagName("div")[0];
cveOptionsLocation.innerHTML += '<div id="cve_options" style="position:fixed;left:0;bottom:0;background-color:rgba(0, 58, 0, 1.0);"><div id="cve_options_button" class="button_charmenu cve_main_bar" style="text-align:center;display:inline-block;opacity:0.75;font-weight:normal;"><div id="cve_options_button_text" style="font-size:10pt;padding:0px 10px 0px 10px;">Show CVE Options</div></div><br/><div id="cve_options_panel" style="display:none;margin:0 auto 0 auto;max-width:1500px;padding:10px;font-size:10pt;font-weight:normal;text-shadow:none;">' + 
'<p style="position:absolute;right:5px;bottom:0;font-size:9pt;opacity:0.1;">Cantr Visual Enhancer ' + VersionString + ' &copy; 2013-2018, AniCator</p>'+
'</div></div>';

var cveOptions = document.getElementById('cve_options');
cveOptions.style.width = "100%";

var cveExampleString = '9001-0.42: Bob says: "*he smiles* That\'s a good joke. *he ruffles his hands through his hair* Tell us another one, Jim."</p>';
cveExampleString = cveExampleString.replace(/(: )("[\s\S]*")/g,hilight_quotes);
cveExampleString = hilight_events(cveExampleString);

var cveOptionsPanel = document.getElementById('cve_options_panel');

var cveMenuColumn = document.createElement('div');

cveMenuColumn.className = "cve_column_menu";

var cveMenuList = document.createElement('ul');

var cveMenuButtonGeneral = document.createElement('li');
cveMenuButtonGeneral.innerHTML = "General";
cveMenuButtonGeneral.addEventListener('click', function(){
DisplayPanel("panel_general");
}, false);
cveMenuList.appendChild(cveMenuButtonGeneral);

var cveMenuButtonTest = document.createElement('li');
cveMenuButtonTest.innerHTML = "Color+";
cveMenuButtonTest.addEventListener('click', function(){
DisplayPanel("panel_color_plus");
}, false);
cveMenuList.appendChild(cveMenuButtonTest);

var cveMenuButtonInfo = document.createElement('li');
cveMenuButtonInfo.innerHTML = "About";
cveMenuButtonInfo.addEventListener('click', function(){
DisplayPanel("panel_info");
}, false);
cveMenuList.appendChild(cveMenuButtonInfo);

cveMenuColumn.appendChild(cveMenuList);
cveOptionsPanel.appendChild(cveMenuColumn);

var cveColumnContainer = document.createElement('div');
var cveColumnContainer = CreatePanelContainer("panel_general");
cveColumnContainer.style.display = "inline-block";

var cveColumn = CreatePanel(cveColumnContainer);
cveColumn.innerHTML += '<p>Emote color <input id="cve_options_panel_emote_color" type="text" value="' + GetEmoteColor() + '"></p><div id="cve_options_panel_emote_color_picker" style="margin:0 auto 0 auto;">' + MakeColorPicker("cve_options_panel_emote_color") + '</div>';

var cveColumn = CreatePanel(cveColumnContainer);

cveColumn.innerHTML += '<p>Preview</p>';
cveColumn.innerHTML += '<p>' + cveExampleString + '</p>';
cveColumn.innerHTML += '<p id="cve_message_box"></p>';

var cveColumn = CreatePanel(cveColumnContainer);

var use_asterisks = GetCheckboxValue(ShouldUseAsterisks());
var use_dashes = 	GetCheckboxValue(ShouldUseDashes());
var use_hashtags = 	GetCheckboxValue(ShouldUseHashtags());
var use_bold =		GetCheckboxValue(ShouldUseBold());
var use_italics = 	GetCheckboxValue(ShouldUseItalics());

cveColumn.innerHTML += 'Emote styling <em>(requires page refresh)</em><br/>';
cveColumn.innerHTML += '<input id="use_asterisks" type="checkbox" '+ use_asterisks +'>Style asterisks<br/>';
cveColumn.innerHTML += '<input id="use_dashes" type="checkbox" '+ use_dashes +'>Style dashes<br/>';
cveColumn.innerHTML += '<input id="use_hashtags" type="checkbox" '+ use_hashtags +'>Style hashtags<br/>';
cveColumn.innerHTML += '<div style="height:1px;background:#060;width:100%;margin:0.6em 0 0.5em 0;"></div>';
cveColumn.innerHTML += '<input id="use_bold" type="checkbox" '+ use_bold +'>Enable bolding<br/>';
cveColumn.innerHTML += '<input id="use_italics" type="checkbox" '+ use_italics +'>Enable italics<br/>';

var cveColumn = CreatePanel(cveColumnContainer);

var use_sound = GetCheckboxValue(ShouldUseSound());
var unlock_chatbox = GetCheckboxValue(ShouldUnlockEventMessageField());
var show_wiki_info = GetCheckboxValue(ShouldUseWikiInfo());

cveColumn.innerHTML += 'Extra<br/>';
cveColumn.innerHTML += '<input id="use_sound" type="checkbox" '+ use_sound +'>Enable sound<br/>';
//cveColumn.innerHTML += '<input id="unlock_chatbox" type="checkbox" '+ unlock_chatbox +'>Unlock message event field size<br/>';
cveColumn.innerHTML += '<div style="height:1px;background:#060;width:100%;margin:0.6em 0 0.5em 0;"></div>';
cveColumn.innerHTML += '<input id="show_wiki_info" type="checkbox" '+ show_wiki_info +'>Show healing, feeding and gathering amounts for food <em>(requires page refresh)</em><br/>';

cveOptionsPanel.appendChild(cveColumnContainer);

var cveColumnContainerInfo = CreatePanelContainer("panel_info");

var cvePanelTestColumn1 = document.createElement('div');
cvePanelTestColumn1.className = "cve_column_wide";
cvePanelTestColumn1.innerHTML += "<h1>Cantr Visual Enhancer " + VersionString + "</h1>";
cvePanelTestColumn1.innerHTML += "<p><em>Written by AniCator (original 2013 script by Natso)</em></p>";
cvePanelTestColumn1.innerHTML += "<strong>Updates</strong>";
cvePanelTestColumn1.innerHTML += "<p>The script will be updated automatically when new updates are available.</p>";
cvePanelTestColumn1.innerHTML += "<p>The frequency of update checks depends on which extension, addon or plugin you're using to run userscripts.</p>";
cvePanelTestColumn1.innerHTML += "<p>This userscript probably will be updated once or twice each month if new features are implemented.</p>";
cvePanelTestColumn1.innerHTML += "<p>Outside of that the frequency of updates will probably be very low.</p>";

cvePanelTestColumn1.innerHTML += "<strong>Changelog</strong>";

cvePanelTestColumn1.innerHTML += "<p>1.5.1.4</p>";
cvePanelTestColumn1.innerHTML += "<p><ul><li>Improved name color preview support in the name coloring tab.</li><li>Improved validation of color fields.</li></ul></p>";

cveColumnContainerInfo.appendChild(cvePanelTestColumn1);

cveOptionsPanel.appendChild(cveColumnContainerInfo);

var cveColumnContainerColorPlus = CreatePanelContainer("panel_color_plus");

var cveColumnContainerColorPlusPanel = CreateWidePanel(cveColumnContainerColorPlus);
cveColumnContainerColorPlusPanel.innerHTML += "<h1>Name coloring</h1>";

var use_name_color = GetCheckboxValue(ShouldUseNameColor());

cveColumnContainerColorPlusPanel.innerHTML += "<p>";
cveColumnContainerColorPlusPanel.innerHTML += '<input id="use_name_color" type="checkbox" ' + use_name_color + '>Enable name coloring';
cveColumnContainerColorPlusPanel.innerHTML += '<br/><br/>Default name color: <input id="cve_options_panel_default_name_color" type="text" value="' + GetDefaultNameColor() + '">';
cveColumnContainerColorPlusPanel.innerHTML += '</p>';

cveColumnContainerColorPlusPanel.innerHTML += "<p>Names</p>";
cveColumnContainerColorPlusPanel.innerHTML += '<p><button id="name_color_add_name">Add name</button><span style="display:inline-block;width:2em;"></span><button id="name_color_clear">Clear all</button> <small id="name_color_click_info"><em>Click on character names in your events page to add them</em></small></p>';
cveColumnContainerColorPlusPanel.innerHTML += '<p id="name_color_list"></p>';

cveOptionsPanel.appendChild(cveColumnContainerColorPlus);

function EnableNameSelection(Bool)
{
    if( Bool === true )
    {
        $('.cvee_character').addClass('cve_select');
        $('.cvee_character').bind( 'click.nameSelect', SelectNameForColoring);
        $('#name_color_click_info').css('display', 'inline');
    }
    else
    {
        $('.cvee_character').removeClass('cve_select');
        $('.cvee_character').unbind( 'click.nameSelect' );
        $('#name_color_click_info').css('display', 'none');
    }
}

document.getElementById("name_color_add_name").addEventListener('click', function(e){
    if( $('.cvee_character').hasClass('cve_select') )
    {
        EnableNameSelection( false );
    }
    else
    {
        EnableNameSelection( true );
    }
    ApplyOptions();
}, false);

$('#name_color_click_info').css('display', 'none');

document.getElementById("name_color_clear").addEventListener('click', function(e){
    NameColorEntries = [];
    StoreNameColorEntries();
    $('#name_color_list').empty();
    ApplyOptions();
}, false);

document.getElementById("use_name_color").addEventListener('change', function(e){
    SetUseNameColor(e.target.checked);
    ApplyOptions();
}, false);

document.getElementById("use_asterisks").addEventListener('change', function(e){
	SetUseAsterisks(e.target.checked);
	ApplyOptions();
	}, false);

document.getElementById("use_dashes").addEventListener('change', function(e){
	SetUseDashes(e.target.checked);
	ApplyOptions();
	}, false);
	
document.getElementById("use_hashtags").addEventListener('change', function(e){
	SetUseHashtags(e.target.checked);
	ApplyOptions();
	}, false);
	
document.getElementById("use_bold").addEventListener('change', function(e){
	SetUseBold(e.target.checked);
	ApplyOptions();
	}, false);
	
document.getElementById("use_italics").addEventListener('change', function(e){
	SetUseItalics(e.target.checked);
	ApplyOptions();
	}, false);
	
document.getElementById("use_sound").addEventListener('change', function(e){
	SetUseSound(e.target.checked);
	ApplyOptions();
	}, false);

//document.getElementById("unlock_chatbox").addEventListener('change', function(e){
    //SetUnlockEventMessageField(e.target.checked);
    //ApplyOptions();
//}, false);

document.getElementById("show_wiki_info").addEventListener('change', function(e){
    SetUseWikiInfo(e.target.checked);
    ApplyOptions();
}, false);

CreateColorListeners("cve_options_panel_emote_color");

var cveEmoteColorField = document.getElementById('cve_options_panel_emote_color');
cveEmoteColorField.addEventListener('change', function(e){
	e.target.value = GetColorValue(e.target.value);
	SetEmoteColor(e.target.value);
	cveEmoteColorField.value = GetEmoteColor();
	ApplyOptions();
	}, false);
	
var cveDefaultNameColorField = document.getElementById('cve_options_panel_default_name_color');
cveDefaultNameColorField.addEventListener('change', function(e){
	SetDefaultNameColor(e.target.value);
	cveDefaultNameColorField.value = GetDefaultNameColor();
	ApplyOptions();
	}, false);

var cveOptionsButton = document.getElementById('cve_options_button');
cveOptionsButton.style.width = "100%";
cveOptionsButton.addEventListener('click', function(){Options(!OptionsDisplayed);}, false);

if(ShouldUseWikiInfo())
{
	ParseObjectNames();
}

var EventObjects = [];

var EventsList = document.getElementById('eventsList');
if(EventsList === null)
{
	PrintExecutionTime();
}
else
{
	var GameMessageField = document.getElementById("messageField");
	var GameEvents = EventsList.getElementsByTagName('div');
	var PageLoadEventCount = GameEvents.length;

	CVELog("Parsing " + GameEvents.length + " events.");

	if(ShouldUnlockEventMessageField())
	{
		GameMessageField.removeAttribute("style");
	}

	// Grab any saved name color entries.
	LoadNameColorEntries();

	for( var i = 0; i < NameColorEntries.length; i++ )
	{
		var NameEntry = NameColorEntries[i];
		var CharacterID = NameEntry.CharacterID;
		var CharacterName = NameEntry.CharacterName;
		var Color = NameEntry.Color;
		
		AddNameColorField( CharacterID, CharacterName, Color );
	}

	var ParseGameEvent = function( GameEvent )
	{
		GameEvent.innerHTML = GameEvent.innerHTML.replace(/(: )("[\s\S]*")/g,hilight_quotes);
		
		var CharacterNodes = [ GameEvent.childNodes[3], GameEvent.childNodes[5] ];
		for( var j = 0; j < CharacterNodes.length; j++ )
		{
			var CharacterNode = CharacterNodes[j];
			if( CharacterNode !== undefined && CharacterNode.className !== undefined )
			{
				var IsValidCharacterNode = CharacterNode.className.indexOf("character") === 0 ? true : false;
				if( IsValidCharacterNode )
				{
					CharacterNode.outerHTML = CharacterNode.outerHTML.replace(/(<a.*?>)([\s\S]*?)(<\/a>)/g,hilight_characters);
				}
			}
		}
	
		GameEvent.innerHTML = hilight_events(GameEvent.innerHTML);
	
		$(GameEvent).find(".character").click(function(){
			showCharDescBox(GameEvent);
		});
	}

	var MaximumEventCount = -1;
	var ParsingInterval = 100;
	var EntriesPerParse = 20;
	var QueueEvents = function(limit){
		for(var i = 0; i < GameEvents.length && i != limit; i+=1)
		{
			EventObjects.push(GameEvents[i]);
		}
	};

	var ParseEvents = function(){
		var GameEvents = EventObjects.splice(0, EntriesPerParse);
		GameEvents.forEach(GameEvent => {
			ParseGameEvent(GameEvent);
		});

		ApplyOptions();
	};

	QueueEvents(MaximumEventCount);
	setInterval(ParseEvents,ParsingInterval);

	ApplyOptions();

	var OnNewEventOriginal = undefined;
	if(typeof unsafeWindow === 'undefined')
	{
		CVELog("Accessing events in global scope.");
		
		if(typeof onNewEvent !== 'undefined')
		{
			OnNewEventOriginal = onNewEvent;
		}

		if(OnNewEventOriginal !== undefined)
		{
			CVELog("Attached to event function.");
		}
		
		onNewEvent = function(t){
			OnNewEventOriginal(t);
			if (t.events.length > 0)
			{
				QueueEvents(t.events.length);
				if(ShouldUseSound())
					EventSound.play();
			}
		};
	}
	else
	{
		CVELog("Accessing events in unsafeWindow scope.");
		OnNewEventOriginal = unsafeWindow.onNewEvent;

		if(OnNewEventOriginal !== undefined)
		{
			CVELog("Attached to event function.");
		}
		
		unsafeWindow.onNewEvent = function(t){
			OnNewEventOriginal(t);
			if (t.events.length > 0)
			{
				QueueEvents(t.events.length);
				if(ShouldUseSound())
					EventSound.play();
			}
		};
	}

	function PrintExecutionTime()
	{
		CVELog( "Execution time: " + (new Date().getTime() - scriptStartTime) + "ms" );
	}
	PrintExecutionTime();
}