// ==UserScript==
// @name        maxscriptSyntaxHighlighter
// @namespace   mxs
// @description Maxscript syntax highlighter
// @include     http://forums.cgsociety.org/showthread.php?*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/30609/maxscriptSyntaxHighlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/30609/maxscriptSyntaxHighlighter.meta.js
// ==/UserScript==

window.document.body.onload = function(){	

	var useMxsHighlighter = getCookie( 'useMxsHighlighter' ),
		code_window_width  = 950,
		code_window_height = 400,
		code_window_line_height = 20,
		code_window_lines = 15,
		post_right_padding = 20,		
		posts = [].slice.call(window.document.getElementsByTagName('pre')); // <-- this is html elements collection that contain maxscript code
		
		
		
	// Maxscript functions, keywords etc...
	var maxscript_keywords  = "pi by selection tick with undo off on for in to where while do as string int ineger float rollout if not else then try catch polyop meshop pos width height pressed changed local global using",
		maxscript_values    = "false true null unsupplied undefined (\#\\\(\\\))",
		maxscript_functions = "gc heapfree setproperty getproperty getpropnames hasproperty isproperty show messagebox free superclassof classof iskindof snapshotasmesh snapshot instance copy getFiles clearListener cos sin atan atan2 degtorad radtodeg normalize cross globalvars dotnetclass dotnetobject dotnet\.addEventHandler dot updateshape getSourceFileName update addmodifier addnewspline join makedir collect matchpattern substring delete open close filterstring trimright trimleft trim print getdir sort random format timestamp appendifunique uniquename append tolower getnodebyname finditem execute destroydialog createdialog",
		maxscript_controls  = "angle slider spinner group button checkbutton mapbutton materialbutton pickbutton checkbox colorpicker listbox multilistbox dropdownlist combobox edittext hyperlink label groupBox progressbar radiobuttons bitmap imgTag SubRollout curvecontrol";
	

	// css style classes used to colorize maxscript syntax
	var maxscript_styles = [".tmp",".mxsFunction",".mxsFunctionName",".mxsFunctionArgs",".mxsFunctions",".mxsComments",".mxsKeywords",".mxsString",".mxsValue",".mxsNumber",".mxsSelection",".mxsControls"];
	
	var default_styles = {
			
			"tmp":{},
			"mxsFunction":		{"color":"steelblue;","font-weight":"bolder;"	},
			"mxsFunctionName":	{"color":"lightblue;","font-weight":"bolder;"	},
			"mxsFunctionArgs":	{"color":"sandybrown;"							},
			"mxsFunctions":		{"color":"skyblue;"								},
			"mxsComments":		{"color":"green;","font-style":"italic;"		},
			"mxsKeywords":		{"color":"Tan;"									},
			"mxsString":		{"color":"pink;"								},
			"mxsValue":			{"color":"skyblue;"								},
			"mxsNumber":		{"color":"palegreen;"							},
			"mxsSelection":		{"color":"MediumSpringGreen;"					},
			"mxsControls":		{"color":"MediumPurple;"						}

		};
		
	
	//	set empty user style cookie at first run
	for ( var mxsClass in default_styles ){
		
		if ( getCookie( mxsClass ) == null ) setCookie( mxsClass, "" );
		
	}
	

	
	// style constructor
	function Style(){
		
		var _this = this;
		var openTag  = "<style class='mxsStyle'>\n";
		var closeTag = "</style>";
		
		this.classes = {};
		
		this.initStyle = function(){
			
			for ( var mxsClass in default_styles ) {
				
				this.addClass( mxsClass );
				
				for ( var prop in default_styles[ mxsClass ] ){
					
					this.setClassCssValue( mxsClass, prop, default_styles[ mxsClass ][ prop ] );
					
				}
				
			}			
			
		};
		
		this.modifyStyle = function(){
			
			for ( var mxsClass in default_styles ){
		
				var userStyle = getCookie( mxsClass );
				
				if ( userStyle != "" ){
										
					var props = userStyle.split(';');
										
					props.forEach( function( prop ){
						
						var line = prop.split(':');
						
						 _this.setClassCssValue( mxsClass, line[0], line[1] );
												
					});									
					
				}
		
			}			
						
		};
		
		this.addClass = function( className ){
			
			this.classes[ className ] = {};			
			
		};
		
		this.setClassCssValue = function( className, property, value ){			
		
			this.classes[ className ][ property ] = value;			
			
		};
		
		this.removeClassCssValue = function( className, property ){
		
			delete this.classes[ className ][ property ];			
			
		};
		
		this.buildStyle = function(){
			
			var style = openTag;
			
			for ( var mxsclass in this.classes ){
				
					style += "." + mxsclass + " {";
				
				for ( var prop in this.classes[ mxsclass ] ){					
					
					style += prop +": " + this.classes[ mxsclass ][ prop ] + ";";					
					
				}
				
					style += "}\n";
				
			}
			
			style = style.replace(/\;\;/g, ";");
			
			style += closeTag;
			
			return style;
			
		};
		
		this.initStyle();
		this.modifyStyle();
		
	}	
	
	// this function taken from here url:https://books.google.ru/books?id=6k7IfACN_P8C&pg=PA206&lpg=PA206&dq=regex+find+double+quote+outside+tags&source=bl&ots=CpKf4Lql4M&sig=eqL2-We3xTnI6Y0G8bos36sOUKg&hl=ru&sa=X&ved=0ahUKEwiPo9jTmMvNAhWIBZoKHcuTBzwQ6AEIPjAE#v=onepage&q=regex%20find%20double%20quote%20outside%20tags&f=false
	function regexOuterQuotes( str ){
		
		str = str.replace( /(\@\".*?\")/gmi, "<font class='mxsString'>$1</font>");
		
		var result = "",
			outerRegex = /<[^<>]*>/g,
			innerRegex = /"([^"]*)"/g,
			outerMatch = null,
			lastIndex = 0;
		
		while (outerMatch = outerRegex.exec(str)){
			
			if ( outerMatch.index == outerRegex.lastIndex ) outerRegex.lastIndex++;
			
			var textBetween = str.slice(lastIndex, outerMatch.index);

			result += textBetween.replace( innerRegex, "<font class='mxsString'>\"$1\"</font>");
			lastIndex = outerMatch.index + outerMatch[0].length;
			result += outerMatch[0];			
			
		}
		
		var textAfter = str.slice(lastIndex);
		result += textAfter.replace( innerRegex, "<font class='mxsString'>\"$1\"</font>");
		
		return result;
	}
	
	function regexOuter( str, regex, replacement ){
		
		var result = "",
			outerRegex = /<[^<>]*>/g,
			innerRegex = regex, //   /"([^"]*)"/g; <-- regex for what we need
			outerMatch = null,
			lastIndex = 0;
		
		while (outerMatch = outerRegex.exec(str)){
			
			if ( outerMatch.index == outerRegex.lastIndex ) outerRegex.lastIndex++;
			var textBetween = str.slice(lastIndex, outerMatch.index);
			result += textBetween.replace( innerRegex, replacement );
			lastIndex = outerMatch.index + outerMatch[0].length;
			result += outerMatch[0];			
			
		}
		
		var textAfter = str.slice(lastIndex);
		result += textAfter.replace( innerRegex, replacement );
		
		return result;
		
		
		
	}
	
	function codeWindowDimensions( codeElement, maxWidth, maxHeight, lineHeight, linesCount ){
		
		var magicNumber = 2,
			totalLines  = codeElement.textContent.replace("\n\n","\n").split('\n').length,
			totalHeight = (lineHeight + magicNumber) * Math.max( 2.5, totalLines),
			maxHeight   = Math.min( maxHeight, totalHeight);
		
			codeElement.style.lineHeight = lineHeight + "px";
			codeElement.style.height	 = maxHeight  + "px";
			codeElement.style.width 	 = maxWidth   + "px";
		
			codeElement.style.color = "#ccc";
		
		// move text slightly from right border
		// $("td.alt1:not(td.alt1:contains('share'))").css("paddingRight", post_right_padding + "px");
		
	}		

	function showColorChangeMenu( className, y_coord ){
		
		var colorMenu = document.getElementById('mxsColorChange');
		
		if ( typeof colorMenu == undefined || colorMenu == null ){
			
			colorMenu = document.createElement("div");
			colorMenu.id = "mxsColorChange";
			
			colorMenu.style.display = "block";
			colorMenu.style.position = "absolute";
				
			colorMenu.style.width  = "150px";
			colorMenu.style.height = "150px";
			
			colorMenu.style.backgroundColor = "#222";
			colorMenu.style.padding = "10px 10px";
			
			colorMenu.style.border = "Solid 1px #888";
			colorMenu.style.borderRadius = "10px";
			
			
			document.body.appendChild( colorMenu ); 

		} else { $( colorMenu ).toggle(); }
		
		var classColor = $( "." + className ).eq(0).css('color');
		
		var menuHTML = "";	
			menuHTML += "<div style='padding-bottom:10px; text-align:center;'><b>" + className + "</b></div>";
			menuHTML += "<div id='ccColor' style='padding:10px 10px;width:130px;height:90px;background-color:" + classColor + ";'></div>";
			menuHTML += "<div onclick='$(this).parent().toggle();' style='text-align:center; padding-top:5px;'><b>click to close</b></div>";
			
			colorMenu.innerHTML = menuHTML;
			
			colorMenu.style.left = "150px";
			colorMenu.style.top = y_coord + "px";
			
			

			$('#ccColor').colorPicker({ renderCallback: function( $elm, toggled ){ 
			
					
					$( "." + className ).css('color', "#" + this.color.colors.HEX ); // colorize on change
					
					var cookie = getCookie( className );													// redo						
					cookie = cookie.replace(/(color\:.*?)/gi, "color: " + "#" + this.color.colors.HEX);		// redo					
					cookie = "color: " + "#" + this.color.colors.HEX;										// redo								
					
					setCookie( className, cookie );
					
				}			
			});
					
	}
	
	// Cookie get/set
	function setCookie( key, value ){
		
            var expires = new Date();
            expires.setTime(expires.getTime() + (365 * 24 * 60 * 60 * 1000));
            document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
			
	}

	function getCookie( key ){
		
	  var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
	  return keyValue ? keyValue[2] : null;
	  
	}

/*	// expose functions to browser DEBUG
	window.getCookie = getCookie;
	window.setCookie = setCookie;
	window.Style = Style;
*/

	if ( useMxsHighlighter == null ){
		
			setCookie( "useMxsHighlighter", "true" );
			useMxsHighlighter = getCookie( 'useMxsHighlighter' ); 
			
	}
	
	
	if ( useMxsHighlighter == "true" && posts.length > 0 ){ // main party goes here
	
		function wrap( mxsClass, value ){
						
			return "<font class='" + mxsClass + "'>" + value + "</font>";
			
		}
		
		
		// string regex	
		var re_keywords  = new RegExp( "\\b(" + maxscript_keywords.replace(/\s+/gmi, "|")  + ")\\b" , "gmi" ),
			re_values 	 = new RegExp( "(" 	  + maxscript_values.replace(/\s+/gmi, "|")    + ")"    , "gmi" ),
			re_functions = new RegExp( "\\b(" + maxscript_functions.replace(/\s+/gmi, "|") + ")\\b" , "gmi" ),
			re_controls  = new RegExp( "\\b(" + maxscript_controls.replace(/\s+/gmi, "|")  + ")\\b" , "gmi" );
			
		var re_assignment = new RegExp( /(\w|\d|\))(\s*(\>*|\<*)\=+)(\w|\d|\#|\()/gmi					 	),
			re_quotes     = new RegExp( /(\@*'([^']*)')/gmi													),
			re_numbers    = new RegExp( /([^\w])(\-*\d*\.*\d+f*)/gmi										),
			re_selections = new RegExp( /(\$(\w+\**)*)/gmi													),
			re_names      = new RegExp( /(\#\w+\d*\w*)/gmi												 	),
			re_globalVars = new RegExp( /(\:{2}\w+)/gmi 												 	),
			re_funcArgs   = new RegExp( /(\w+\d*\:+)/gmi 												 	),
			re_comments   = new RegExp( /((--|^\s--|^--)+.*(?!\n\r))|(\/\*(?:(?!\*\/).|[\n\r])*\*\/)/gmi 	),
			re_funcDefine = new RegExp( /(mapped\s+fn|mapped\s+function|fn|function)\s+(\w+)((\s\w+\:*)*)(?!\r)/gmi);
		
		posts.forEach( function( post ){
			
			
				codeWindowDimensions( post, code_window_width, code_window_height, code_window_line_height, code_window_lines );
			
			
			var html = post.innerHTML;			
				
				html = regexOuterQuotes( html ); 															// coloring strings doublequotes
				html = regexOuter( html, re_assignment,		"$1 $2 $4"    					);				// beautify value assignment				
				html = regexOuter( html, re_quotes,			wrap( "mxsString", "$1" )		); 			    // coloring strings quotes
				html = regexOuter( html, re_numbers,   "$1"+wrap( "mxsNumber", "$2" )		);				// coloring numbers
				html = regexOuter( html, re_selections,		wrap( "mxsSelection", "$1" )	);				// coloring selections 
				html = regexOuter( html, re_functions,		wrap( "mxsFunctions", "$1" )	);				// coloring native functions
				html = regexOuter( html, re_names,          wrap( "mxsString", "$1" )		);				// coloring names
				html = regexOuter( html, re_globalVars,		wrap( "mxsFunctionArgs", "$1" )	);				// coloring global vars ::var
				html = regexOuter( html, re_funcArgs, 		wrap( "mxsFunctionArgs", "$1" )	);				// coloring function arguments
				html = regexOuter( html, re_controls, 		wrap( "mxsControls", "$1" )		);				// coloring maxscript ui controls
				html = html.replace( re_values, 			wrap( "mxsValue", "$1" )		);				// coloring values, operators				
				html = html.replace(re_comments,			wrap( "mxsComments", " $1 " )	); 				// coloring comments
				
																											// coloring functions
				html = regexOuter( html, re_funcDefine, wrap('mxsFunction','$1 ')+wrap('mxsFunctionName','$2')+wrap('mxsFunctionArgs','$3')); 
				html = html.replace( re_keywords, wrap('mxsKeywords','$1'));								// coloring keywords

				post.innerHTML = html;
				
				$(post).find(".mxsComments").find("font").each(function(){$(this).contents().unwrap();});	// remove all mxsClass tags inside
				$(post).find(".mxsString").find("font").each(function(){$(this).contents().unwrap();});		// remove all mxsClass tags inside
				
		});
		
		
		// generate style for processed document 		
		var st = document.createElement( 'style' );			
			st.innerHTML = (new Style( maxscript_styles )).buildStyle();
			document.body.appendChild( st );
		
		// use user backround color for code elements
		if ( getCookie( "mxsCodeBackgroundColor" ) != null ){ 
		
			$( posts ).css( 'background-color', getCookie( "mxsCodeBackgroundColor" )  );		
		
		}
	
			
		// Here goes handler and a menu for changing default color style		
		$("body").bind( 'click', function(e){ 
		
			if ( e.altKey && e.target.tagName == "FONT" ) { 		

				e.stopPropagation();
				showColorChangeMenu( e.target.className, e.pageY ); 
		
			} else if ( e.altKey && e.target.tagName == "DIV" ){
			
				
				$( e.target ).colorPicker({ 
				
					renderCallback: function( $elm, toggled ){ 
					
						setCookie( 'mxsCodeBackgroundColor', "#" + this.color.colors.HEX );
						
						$( posts ).css( 'background-color', "#" + this.color.colors.HEX );
					},
					
					positionCallback: function($elm) {
						
						var $UI      = this.$UI, 						// this is the instance; this.$UI is the colorPicker DOMElement
							position = $elm.offset(), 					// $elm is the current trigger that opened the UI
							gap      = this.color.options.gap, 			// this.color.options stores all options
							top      = position.top + $elm.height()/2,
							left     = position.left + $elm.width()/2;

						// $UI.appendTo('#somwhereElse');
						// do here your calculations with top and left and then...
						return { // the object will be used as in $('.something').css({...});
							left: left,
							top: top
						}
					}
					
				});						
			
				
			}
			
			
		});
		
		
		// Third party colorpicker
		var colorPickerScript = document.createElement("script");			
			colorPickerScript.src = "https://cdnjs.cloudflare.com/ajax/libs/tinyColorPicker/1.1.0/jqColorPicker.min.js";
			
		document.body.appendChild( colorPickerScript ); 
		

		
	} else {
			
		if ( useMxsHighlighter != "true" ){		// if highlighter is disabled add handler for enabling 
			
			
			$("body").bind( 'click', function(e){ 
			
					if ( e.altKey ) { 
						
						if ( confirm("enable maxscript highlighter?") ) setCookie( "useMxsHighlighter", "true");
						
					} 
			});
		
		}
		
		
	}
	


}
