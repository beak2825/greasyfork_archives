//
// Written by Glenn Wiking
// Script Version: 0.2.62
//
//
// ==UserScript==
// @name        Shuttle Pro
// @namespace   SP
// @description Professional usability extras and features for Shuttle CMS
// @version     0.2.62
// @icon        https://dlw0tascjxd4x.cloudfront.net/assets/img/symbol.svg

// @include		*.com*
// @include		*.be/admin*
// @include		*.be/login
// @include		*.be/sites
// @require		https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js 
// @require		https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js
// @require		https://cdnjs.cloudflare.com/ajax/libs/mark.js/8.11.1/jquery.mark.es6.js
// @require		https://greasyfork.org/scripts/442287-royal-tag-detector/code/Royal%20Tag%20Detector.user.js

// @downloadURL https://update.greasyfork.org/scripts/434923/Shuttle%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/434923/Shuttle%20Pro.meta.js
// ==/UserScript==

$(window).on("load", function() {
if ( $(".shuttle").length || $(".shuttle-App").length ) {
  let Indentation = 
 	'.shuttle-Tree .shuttle-Tree-title {color: #EDEDED;}'
  +
  '.shuttle-Tree ul ul .shuttle-Tree-title {color: #CCC !important; opacity: .9}'
  +
  '.shuttle-Tree ul ul ul .shuttle-Tree-title {color: #AAA !important; opacity: .8}'
  +
  '.shuttle-Tree ul ul ul ul .shuttle-Tree-title {color: #898989 !important; opacity: .7}'
  +
  '.shuttle-Tree .is-selected .shuttle-Tree-title {color: #FFF !important; opacity: 1 !important;}'
  
  /****/
  
  let username = $(".shuttle-Header .Button:last").text();
  let version = "0.2.62";
  
  $(".shuttle-Header .Button:last").attr("version","Pro");
  $(".shuttle-Header .Button:last").on("mouseenter", function() {
  	$(this).attr("version", version);
  });
  $(".shuttle-Header .Button:last").on("mouseleave", function() {
  	$(this).attr("version", "Pro");
  });
  

  $("head").append("<script src='https://cdnjs.cloudflare.com/ajax/libs/mark.js/8.11.1/jquery.mark.es6.js'></script>");
  /* Dark mode */
  	let proClone;
  	if ( localStorage.getItem("pro-dark-mode-default") != null ) {
    	if ( localStorage.getItem("pro-dark-mode-default") == "false" ) {
      	localStorage.setItem("pro-dark-mode", true);
      } else {
        localStorage.setItem("pro-dark-mode", false);
      }
      if ( username.includes("Glenn Heyse") ) {
        localStorage.setItem("pro-dark-mode-default", true);
        localStorage.setItem("pro-dark-mode", true);
        console.log("Me");
      }
    } else {
      localStorage.setItem("pro-dark-mode", false);
      localStorage.setItem("pro-dark-mode-default", true);
      if ( username.includes("Glenn Heyse") ) {
        localStorage.setItem("pro-dark-mode-default", true);
        localStorage.setItem("pro-dark-mode", true);
        console.log("Me");
      }
    }
  
  	function toggleMode() {
      if ( localStorage.getItem("pro-dark-mode") == "false" ) {
        proClone = $(".dark").clone();
        $(".dark").remove();
        //$(".shuttle-PRO .dark-mode").removeClass("on");
      } else {
        $("head").append(proClone);
        proClone = $(".dark").clone();
        //$(".shuttle-PRO .dark-mode").addClass("on");
      }
      console.log("Dark mode: " + localStorage.getItem("pro-dark-mode"));
    };
  	$(".shuttle-Header").addClass("pro");
  
  	console.log("Dark mode: " + Cookies.get("Dark"));
  	let modeSwitch = document.createElement("div");
  	modeSwitch.className = "modeswitch";
  	if ( window.location.href == "https://app.shuttle.be/sites" ) {
      $(".shuttle-Header > .Container > div:last-child").prepend(modeSwitch);
    } else {
      $("#open_website").parents(".ButtonGroup").prepend(modeSwitch);
    }  	
  	$(".modeswitch").html('<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 40 40" style="enable background:new 0 0 40 40;" xml:space="preserve"> <path class="st1" d="M20,0"/> <path class="st0" d="M14.1,39.1c10.6,3.2,21.7-2.7,25-13.3s-2.7-21.7-13.3-25L14.1,39.1z"/> </svg>');
		
  	if ( localStorage.getItem("pro-dark-mode-toggler") != null ) {
    	if ( localStorage.getItem("pro-dark-mode-toggler") == "true" ) {
        $(".modeswitch").show();
      } else {
     		$(".modeswitch").hide();
      }
    } else {
      localStorage.setItem("pro-dark-mode-toggler", true);
    }
    
  	
  	$(".modeswitch").on("click", function() {
      if ( localStorage.getItem("pro-dark-mode") == "false" ) {
        //Cookies.set("Dark",1);
        localStorage.setItem("pro-dark-mode",true);
        toggleMode();
        if ( $(".projector-mode-toggle.on").length ) { $(".projector-mode-toggle").trigger("click") }
      } else {
        //Cookies.set("Dark",0);
        localStorage.setItem("pro-dark-mode",false);
        toggleMode();
      }
    });
  
  	toggleMode();
  /* Settings menu */
  	let settingsExists = 0;
  	let inSettings = 0;
  	let settings = document.createElement("div");
  	settings.className = "settings";
  
  	function beInSettings() {
      let ifInSettings = setInterval( function() {
        if ( $("a[data-active-id='general']").length > 0 ) {
          console.log("Found");
          inSettings = 1;
          clearInterval(ifInSettings);
        };
      });
    }
  	
  	let ifSettingsExists = setInterval( function() {
      $(".shuttle-MainNav-itemTarget[data-active-id='settings']").on("click", function() {
        beInSettings();
      });
      
      	//console.log("D");
      if ( $("a[data-active-id='settings']").length > 0 ) {
        settingsExists = 1;
        if ( $("a[data-active-id='settings']").attr("class").includes("is-selected") ) {
          beInSettings();
        };
        clearInterval(ifSettingsExists);
      }
    }, 100);
  
  /* Auto select dark style bg */
  	let inEdit = 0;
  	
  	function ifStyleButtons() {
      //console.log("Running");
      $("button[data-original-title='Edit style']").on("click", function() {
        console.log("Style");
        let ifInEdit = setInterval( function() {
          if ( $("#element_swatches").length > 0 ) {
            console.log("S");
            inEdit = 1;
            $("#element_swatches > div:last-child").trigger("click");
            clearInterval(ifInEdit);
          }
        }, 100);
      });
    }
  
  	$(".shuttle-Panel *, .preview-style tr").on("click", function() {
    	ifStyleButtons();
    });
  	
  	ifStyleButtons();
  
  	$("html.theme-light").addClass("theme-dark").removeClass("theme-light");
  	
  /* Adjust Title */
  /*$("body").on("click", function() {
  	$("head title").html("Shuttle - " + location.hostname.split(".")[0]);
  })*/
  
  // Title Replacer (On Blur)
  $(window).on("blur", function() {
  	$("title").text( $("button[data-active-id='sites']").text().split("\n\n\n\n\n\n\n")[1] );
  });
  
  // SEO Form Element Characters
  setInterval( function() {
    let descs = $("textarea[name*='meta_description']:not(.affected), textarea[id^='languages']:not(.affected), input#og_description:not(.affected), input[name*='meta_title']:not(.affected), input[name*='og_title']:not(.affected), input[name*='seo_titel']:not(.affected), textarea[name*='seo_omschrijving']:not(.affected)");
    descs.each( function() {
      $(this).parent().attr("limit", 150);
      if ( $(this).closest("form").find("input#key").length ) {
        if ( $(this).closest("form").find("input#key").val().includes("title") ) {
        	$(this).parent().attr("limit", 60);
        }
      }
      if ( $(this).attr("name").includes("meta_title") || $(this).attr("name").includes("og_title") || $(this).attr("name").includes("seo_titel") ) {
        $(this).parent().attr("limit", 60);
      }
    });
    $(".seo-parent[limit='150']").attr("lowerlimit",50);
    
    /*function check() {
      const limit = parseInt( $(this).parent().attr("limit") );
      const lowerLimit = parseInt( $(this).parent().attr("lowerlimit") );
      $(this).parent().attr("length", $(this).val().length );
      $(this).parent().addClass("seo-parent");
      if ( $(this).val().includes("@") ) {
        console.log("Dynamic");
        $(this).closest(".seo-parent").addClass("dyn");
      	if ( ! $(this).val().includes("truncate(") ) {
          console.log("Not Truncated");
        	$(this).parent().addClass("unknown").removeClass("known");
        } else {
          //console.log("Truncated");
          //let trimmed = parseInt( $(this).val().split("truncate(")[1].substr(0,5) ); // 2 Characters Over, Should Be: ") "
          let trimmed = 0;
          let totalTrunc = 0;
          let truncations = 0;
          $(this).val().split(" ").forEach( function(val, i) {
            if ( val.substr(0,1) == "@" ) {
              //console.log( "%c" + val, "color:#B66" );
              let trunc = parseInt( val.split("truncate(")[1].substr(0,5) );
              trimmed = trimmed + trunc;
              totalTrunc = totalTrunc + trunc;
              if ( val.includes("truncate(") ) {
              	truncations = truncations + 1;
              }
            } else {
              //console.log( "%c" + val, "color:#66B" );
              trimmed = trimmed + val.length;
            }
            //console.log(truncations);
          });
          trimmed = trimmed + ( $(this).val().split(" ").length - 1 )
          $(this).parent().attr("remainder", trimmed - totalTrunc).attr("trunc", totalTrunc);
          console.log( trimmed );
          $(this).parent().attr("length", trimmed);
        	$(this).parent().removeClass("unknown").addClass("known");
          if ( truncations > 1 ) { $(this).parent().addClass("multi") } else { $(this).parent().removeClass("multi") }
          //if ( remainder == 0 ) { $(this).parent().removeAttr("remainder") }
        }
      } else {
      	$(this).closest(".seo-parent").removeClass("dyn known unknown");
      }
      if ( $(this).val().length == 0 ) { $(this).closest(".seo-parent").addClass("empty") } else { $(this).closest(".seo-parent").removeClass("empty") }
      
      console.log( $(this).val() );
     	let length = parseInt( $(this).parent().attr("length") );
      
      if ( length > limit ) {
        $(this).parent().removeClass("tooshort").addClass("toolong");
      } else if ( length < lowerLimit ) {
        $(this).parent().removeClass("toolong").addClass("tooshort");
      } else {
       	$(this).parent().removeClass("toolong tooshort");
      }
      console.log( $(this) );
      console.log( parseInt( $(this).parent().attr("length") ) + " | " + $(this).val().length + " - " + limit + " | " +  lowerLimit );
      $(this).addClass("affected");
      //$(this).closest(".seo-parent.dyn[length='NaN']").removeclass("known");
      
    }
		descs.off("click change input");
    descs.on("click change input", check);
    descs.each(check);*/
	}, 1000);
 	
  
  setInterval( function() {
    $(".shuttle-Panels--nested > .shuttle-Panel:visible:last:not(.spacer-affected)").each( function() {
      // Spacer Naming
      //console.log( $(this).find(".shuttle-Panel-title") );
      if ( localStorage.getItem("pro-spacer-name") != null ) {
      	if ( localStorage.getItem("pro-spacer-name") == "true" ) {
          if ( $(this).closest(".shuttle-Panel").find(".shuttle-Panel-title").text() == "Spacer" ) {
            let input = $(this).find("label[for='height'] + div > input");
            console.log(input);
            input.on("change input", function() {
              //console.log( $(this).val() );
              let currentName = $(this).closest("#tab_settings").find("input[name='name']").val();
              if ( currentName.length > 0 && isNaN(currentName) == false ) {
                $(this).closest("#tab_settings").find("input[name='name']").val( $(this).val() );
              } else if ( currentName.length == 0 ) {
                $(this).closest("#tab_settings").find("input[name='name']").val( $(this).val() );
              }
              //$(this).closest("#tab_settings").find("input[name='name']").val( $(this).val() );
              //console.log( currentName + " + " + currentName.length + " + " + isNaN(currentName) );
            });
            input.closest(".spacer-affected").find(".Button").on("click", function() {
            	$(this).removeClass("affected");
            });
            //console.log( $(this).find("label[for='height'] + div > input") );
            $(this).addClass("affected");
          }
        	//console.log( "Looking for Spacer" );
        }
      }
      // Spacing Height Focus
      if ( localStorage.getItem("pro-spacer-focus") != null ) {
      	if ( localStorage.getItem("pro-spacer-focus") == "true" ) {
        	if ( $(this).closest(".shuttle-Panel").find(".shuttle-Panel-title").text() == "Spacer" ) {
          	let input = $(this).find("label[for='height'] + div > input:not(.focused)");
            input.focus();
            input.select();
            input.addClass("focused");
            if ( input.val() == "0" ) {
            	input.val("");
            }
          }
        }
      }
    });
  }, 250);
  

  /*$(".Button--primary[value='Save']:visible").each( function() {
  	console.log( $(this) );
  });*/
  
  // Style Number Revealer
  
  	// In Pages - Layout Menu
  	setInterval( function() {
    	$(".All-Styles-Container:visible:not(.affected)").each( function() {
        $(this).find(".single .item").each( function() {
          let styleID = parseInt( $(this).attr("data-value") );
          console.log( styleID );
          if ( isNaN( styleID ) == false && styleID != 0 ) {
          	$(this).closest(".single").attr("styleid", styleID);
          }
          console.log( $(this).closest(".single").prev() );
          //$(this).closest(".single").prev().show();
          //$(this).closest(".single").prev().off("change")
          $(this).closest(".single").prev().on("DOMSubtreeModified change", function() {
            styleID = parseInt( $(this).val() );
          	$(this).find("+ .single").attr("styleID", styleID);
          });
          
        });
        
       	//console.log( $(this) );
        $(this).addClass("affected");
      });
    }, 500);
  
  	// In Style Designer
  	setInterval( function() {
    	$("#title_css.Style-title:visible:not(.affected)").each( function() {
        let styleID = parseInt( $(this).closest("form[method='POST']").attr("action").split("/")[ $(this).closest("form[method='POST']").attr("action").split("/").length - 1 ].split("?")[0] );
        $(this).closest("form").parent().nextAll(".shuttle-Panel-header").attr("styleid", styleID);
        console.log( styleID );
        $(this).addClass("affected");
        
        // If StyleFinder Memory Records All Visits
        let sfMemAll = localStorage.getItem("pro-style-finder-memory-all");
        let styleName = $(".shuttle-Panel-header[styleid='"+ styleID +"'] .shuttle-Panel-title").text();
        //console.log( sfMemAll );
        if ( $(".style[styleid='"+ styleID +"']").length == 0 ) {
        	if ( sfMemAll == "true" ) {
          	$(".finder-mem ul").prepend("<li class='style' styleid='"+ styleID +"'><span class='styleid'>"+ styleID +"</span><span class='stylename'>"+ styleName +"</span><span class='style-closer'></span></li>");

            // Save in Memory
            let memCache = styleID + "|" + styleName + "," + localStorage.getItem("memCache");
            localStorage.setItem("memCache", memCache);
          }
        }
      });
    }, 500);
  
  // Show Style Numbers in Styles Menu
  setInterval( function() {
    if ( localStorage.getItem("pro-style-numbers") != null ) {
      if ( localStorage.getItem("pro-style-numbers") == "true" ) {
        $(".preview-style:visible:not(.affected):not(#group_0)").each( function() {
          if ( $(this).length ) {
            $(this);
            //$(".preview-style.affected:not(:visible)").removeClass("affected");
            $(this).addClass("affected");
          }
        });
      }
    }
  }, 500);
  
  // Page / File Folder Indent Colors
  if ( localStorage.getItem("pro-indent") == null ) {
    localStorage.setItem("pro-indent", false);
  } else {
    if ( localStorage.getItem("pro-indent") == "true" ) {
      console.log( "Pro Indent" );
      $(".indent-toggle").addClass("on");
      $("head").append("<style class='indent'>"+ Indentation +"</style>");
      $(".indent").show();
    } else {
      $(".indent-toggle").removeClass("on");
      $("head .indent").remove();
      $(".indent").hide();
    }
  };
  
  /*****/
  // Style Finder
  $(window).on("keydown", function(k) {
  	let held = k.key;
    if ( held == "Meta" || held == "Control" ) {
    	if ( $(".style-finder:visible").length ) {
      	$(".style-finder").addClass("ctrl");
      }
    }
    if ( held == "Shift" ) {
    	if ( $(".style-finder:visible").length ) {
      	$(".style-finder").addClass("shift");
      }
    }
    if ( held == "Alt" ) {
    	if ( $(".style-finder:visible").length ) {
      	$(".style-finder").addClass("alt");
      }
    }
  });
  $(window).on("keyup", function(k) {
  	let held = k.key;
    if ( held == "Meta" || held == "Control" ) {
    	if ( $(".style-finder:visible").length ) {
      	$(".style-finder").removeClass("ctrl");
      }
    }
    if ( held == "Shift" ) {
    	if ( $(".style-finder:visible").length ) {
      	$(".style-finder").removeClass("shift");
      }
    }
    if ( held == "Alt" ) {
    	if ( $(".style-finder:visible").length ) {
      	$(".style-finder").removeClass("alt");
      }
    }
  });
  setInterval( function() {
    let sf = localStorage.getItem("pro-style-finder");
    let sfMem = localStorage.getItem("pro-style-finder-memory");
    let sfMemAll = localStorage.getItem("pro-style-finder-memory-all");
    let sfCache = localStorage.getItem("pro-style-finder-cache");
    let sfTall = localStorage.getItem("pro-style-finder-tall");
    let memCache = [];
    
    if ( sf != null ) {
    	if ( sf == "true" ) {
      	if ( $(".style-finder").length == 0 && $("#open_website").length ) {
          $(".shuttle-Header.pro .ButtonGroup:last").prepend("<div class='style-finder-cont Form-controls'><input class='style-finder' type='text'></div>");
          if ( $(".modeswitch").length ) { $(".style-finder-cont").addClass("push1") } else { $(".style-finder-cont").removeClass("push1") }
          
          // Menu
          if ( sfMem == "true" || sfCache == "true" ) {
          	$(".style-finder-cont").append("<div class='style-finder-menu'></div>");
          } /*else if ( sfMem == "false" || sfCache == "false" ) {
          	$(".style-finder-cont .style-finder-menu").remove();
          }*/
          
          // Spawn & Populate
          if ( sfMem == "true" ) {
          	$(".style-finder-menu").append("<div class='finder-mem'><ul></ul></div>");
            $(".style-finder-menu").append("<div class='finder-cache'><ul></ul></div>");
            $(".style-finder-menu").append("<div class='finder-search'><ul></ul></div>");
            $(".finder-cache").append("<div class='cache-footer'><button class='button-cache'>Cache</button></div>");
            if ( localStorage.getItem("memCache") == null ) {
            	localStorage.setItem("memCache", memCache);
            } else {
            	memCache = localStorage.getItem("memCache").split(",");
            }
            for ( i = 0; i < memCache.length; i ++ ) {
              let memStyleID = memCache[i].split("|")[0];
              let memStyleName = memCache[i].split("|")[1];
              //console.log( memStyleName );
              if ( $(".finder-mem li[styleid='"+ memStyleID +"']").length == 0 ) {
           			$(".finder-mem ul").append("<li class='style' styleid='"+ memStyleID +"'><span class='styleid'>"+ memStyleID +"</span><span class='stylename'>"+ memStyleName +"</span><span class='style-closer'></span></li>");
              }
            }
          }
          // Make Openable from Memory List
          $(".style").off("click");
          $(".style").on("click", function() {
            $(".style-finder").val( $(this).attr("styleid") );
            styleOpen();
          });
          
          // Make Deletable
          $(".style-closer").on("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            let curStyle = $(this);
            //delStyle( curStyle );
          });
          $(".style-closer").on("mouseenter", function() {
          	$(".finder-mem").addClass("hold");
          });
          $(".style-closer").on("mouseleave", function() {
          	$(".finder-mem").removeClass("hold");
          });
          
          $(".finder-mem").scrollTop(0);
          $(".style-finder").on("blur", function() {
         		$(".finder-mem:not(.hold)").removeClass("on");
            $(".finder-search, .finder-cache:not(.hold)").removeClass("on");
            $(".style-finder").removeClass("searching");
            $(".del").removeClass("del");
            //$(".target").removeClass("target");
          });
          
          // Delete Style
          function delStyle(curStyle, cont) {
            let curID = curStyle.parent().find(".styleid").text();
            let curKey = curStyle.parent().find(".stylename").text();
            let memPos = memCache.indexOf( curID + "|" + curKey );
          	//console.log( curStyle );
            console.log( curID + "|" + curKey );
            $(".finder-mem, .finder-search").addClass("hold");
            setTimeout( function() { $(".finder-mem, .finder-search").removeClass("hold") }, 400);
            if ( curStyle.parent().hasClass("del") ) {
            	curStyle.parent().hide();
              $(".style[styleid='"+ curID +"']").remove();
                // Delete from Memory
                console.log( memPos );
              	//console.log( curID + "|" + curKey );
                memCache.splice( memPos, 1 );
                console.log( memCache );
            		localStorage.setItem("memCache", memCache);
              	$(".target").removeClass("target");
            } else {
            	curStyle.parent().addClass("del");
            }
            cont.addClass("on");
            $(".style-finder").focus();
          }
          
          // Searcher
          $(".style-finder").on("input", function() {
          	let search = $(this).val().toLowerCase();
            let results = [];
          	console.log( search );
            if ( search.length ) {
              $(".style-finder").addClass("searching");
              $(".finder-mem").removeClass("on");
              $(".finder-search").addClass("on");
            } else {
            	$(".style-finder").removeClass("searching");
              $(".finder-search").removeClass("on");
            }
            $(".finder-search ul").html("");
            $(".style").removeClass("highlight");
            $(".finder-mem .style, .finder-cache .style").each( function() {
            	if ( $(this).find(".styleid").text().toLowerCase().includes( search ) || $(this).find(".stylename").text().toLowerCase().includes( search ) ) {
              	$(this).addClass("highlight");
                if ( $(this).hasClass("highlight") ) {
                  // Sort First
                  if ( results.includes( $(this).attr("styleid") ) == false ) {
	                	results.push( $(this).attr("styleid") );
                	}
                  function sortCompare(compA, compB) { return compA - compB }
                  results.sort().sort(sortCompare);
                  //console.log( results );
                  /*let highlightClone = $(this).clone();
                  $(".finder-search ul").append( highlightClone );
                  $(".finder-search .style:last").removeClass("style target").addClass("result");*/
                }
              }
              $(".finder-cache").removeClass("on hold");
            });
            for (i = 0; i < results.length; i++) {
              let highlightClone = $(".finder-mem .style[styleid='" + results[i] + "']").clone();
            	$(".finder-search ul").append( highlightClone );
              $(".finder-search .style:last").removeClass("style target").addClass("result");
            }
            
            $(".finder-search").attr("results", $(".result").length );
            if ( search.length == 0 ) { $(".finder-search ul").html("") }
            
            // Highlight
            /*$(".result").each( function() {
            	$(this).find(".styleid").mark( search );
              $(this).find(".stylename").mark( search );
            });*/
            
            // Make Openable
            $(".result").off("click");
            $(".result").on("click", function() {
            	$(".style[styleid='"+ $(this).attr("styleid") +"']").trigger("click");
            });
          });
          
          if ( sfTall == "true" ) {
          	$(".style-finder").addClass("tall");
          } else {
          	$(".style-finder").removeClass("tall");
          }
          
          // Stylefinder Keypresses Global
          let keysOverall = [];
          let keyString;
          $(window).on("keydown", function(k) {
          	let keyOverall = k.key;
            keysOverall.push( keyOverall );
            keyString = keysOverall.toString();
            //console.log( keyString );
            
            if ( keyString.includes("Control,*") || keyString.includes("Control,/") ) {
            	$(".style-finder").focus();
              $(".style-finder").removeClass("ctrl shift alt");
            }
          });
          $(window).on("keyup", function(k) {
          	setTimeout( function() {
          		keysOverall = [];
          	}, 1000);
          });
          
          /*****/
          // Stylefinder Keypresses Specific
          $(".style-finder").on("keydown", function(k) {
            let val = $(this).val();
            let isNum = isNaN(parseInt( val )) == false;
            let ctrl;
            let alt;
            if ( $(this).hasClass("ctrl") ) { ctrl = true } else { ctrl = false }
            if ( $(this).hasClass("alt") ) { alt = true } else { alt = false }
            
            key = k.key;
            code = k.keyCode;
            //console.log( key + " + " + code );
           	if ( key == "Enter" ) {
            	styleOpen();
            }
            //console.log( code );
            //console.log( ctrl );
            //console.log( isNum );
            if ( code == 38 && ctrl && isNum ) {
            	$(this).val( parseInt(val) + 1 );
            }
            if ( code == 38 && alt && isNum ) {
            	$(this).val( parseInt(val) + 1 );
            }
            if ( code == 40 && ctrl && isNum ) {
           		$(this).val( parseInt(val) - 1 );
            }
            if ( code == 40 && alt && isNum ) {
           		$(this).val( parseInt(val) - 1 );
            }
            
            if ( key == "ArrowDown" && $(".style-finder.ctrl").length == 0 ) {
              if ( $(".finder-cache").hasClass("on") ) {
             		styleCacheDown();
              }
              
              if ( $(".style-finder.shift").length == 0 ) {
                if ( $(".finder-search").hasClass("on") ) {
                  styleSearchDown();
                } else if ( $(".finder-cache").hasClass("on") ) {
                  return false;
                } else {
                  styleMemDown();
                }
              } else { // Shift
              	$(".finder-cache").addClass("on");
                $(".finder-mem, .finder-search").removeClass("on");
                cacheButton();
              }
              console.log( "C Down" );
            }
            if ( key == "ArrowUp" && $(".style-finder.ctrl").length == 0 ) {
              if ( $(".finder-cache").hasClass("on") ) {
             		styleCacheUp();
              }
              
              if ( $(".style-finder.shift").length == 0 ) {
                if ( $(".finder-search").hasClass("on") ) {
                  styleSearchUp();
                } else if ( $(".finder-cache").hasClass("on") ) {
               		return false;
                } else {
                  styleMemUp();
                }
              } else { // Shift
                $(".finder-cache").addClass("on");
                $(".finder-mem, .finder-search").removeClass("on");
                cacheButton();
              }
              console.log( "C Up" );
            }
            if ( key == "Delete" ) {
              k.preventDefault();
              delStyle( $(".target .style-closer"), $(".style-finder-menu > div.on") );
            }
            if ( key == "Backspace" ) { // Prevents Searching when Only Trying to Keyboard Navigate and Using Backspace
              k.preventDefault();
              let selStart = $(".style-finder")[0].selectionStart;
              let selEnd = $(".style-finder")[0].selectionEnd;
              
              //if ( $(".style-finder.searching").length == 0 ) {
                if ( selStart == selEnd ) {
                	if ( selStart == $(".style-finder").val().length ) {
                  	$(".style-finder").val( $(".style-finder").val().substr( 0, $(".style-finder").val().length - 1) );
                  } else {
                    let v = $(".style-finder").val();
                  	$(".style-finder").val( v.substring( 0,selStart -1 ) + v.substring(selEnd, v.length) );
                    $(".style-finder")[0].setSelectionRange(selStart -1, selStart -1);
                  }
                } else {
                	clearSelection();
                }
                //console.log( "Not Searching" );
              /*} else {
                clearSelection();
                //console.log( "Searching" );
              }*/
              function clearSelection() {
                let v = $(".style-finder").val();
                let sel = $(".style-finder").val().substring( selStart, selEnd );
                let cleared = v.substring(0, selStart) + v.substring(selEnd, v.length);
                $(".style-finder").val( cleared );
                $(".style-finder")[0].setSelectionRange(selStart, selStart);
              	console.log( sel );
              }
              if ( $(".style-finder").val().length == 0 ) { $(".finder-search ul").html("") }
            }
            if ( key == "Escape") {
            	$(".finder-mem, .finder-cache, .finder-search").removeClass("on");
              $(".style-finder").removeClass("searching");
              $(".del").removeClass("del");
            }
          });
          /*****/
          
          // Toggle Cache Button Avail
          function cacheButton() {
          	if ( location.pathname.includes("/admin/layout/styles") ) {
              $(".finder-cache .button-cache").addClass("avail").removeAttr("disabled");
            } else {
              $(".finder-cache .button-cache").removeClass("avail").attr("disabled","disabled");
            }
          }

          // Open Style
          function styleOpen() {
            //let prefix = window.location.href.split("/admin")[0] + "/admin/layout/styles#/layout/themes/1/styles/";
            let prefix = window.location.href + "#/layout/themes/1/styles/";
            if ( location.pathname == "/admin/pages" ) { prefix = window.location.href + "/#/layout/themes/1/styles/" }
            let style = $(".style-finder").val();
            if ( style.length ) {
              window.location.href = prefix + style +"/edit";
              $(".style-finder").removeClass("ctrl shift alt");

              $(".shuttle-App").addClass("mem-searching");

              let memSearch = setInterval( function() {
                if ( $("#title_css").length && $(".mem-searching").length ) {
                  $(".shuttle-App").removeClass("mem-searching");
                  clearInterval( memSearch );

                  setTimeout( function() {
                    let styleName = $(".shuttle-Panel-header[styleid] > div").text();
                    // Add to localStorage if not Already There
                    if ( memCache.indexOf( style + "|" + styleName ) == -1 ) {
                      memCache.push(style + "|" + styleName);
                    }
                    console.log( style );
                    // Add to Memory List if not Already There
                    if ( $(".finder-mem li[styleid='"+ style +"']").length == 0 ) { // If not Already There
                      if ( styleName.length ) {// If not An Invalid Style
                        $(".finder-mem ul").prepend("<li class='style' styleid='"+ style +"'><span class='styleid'>"+ style +"</span><span class='stylename'>"+ styleName +"</span><span class='style-closer'></span></li>");
                      }
                    } else {
                      // Put at Top of List
                      $(".style[styleid='"+ style +"']").prependTo( $(".finder-mem ul") );
                      setTimeout( function() { $(".finder-mem").scrollTop(0) }, 500 );
                      // Security Measures
                      $(".finder-mem .style[styleid='NaN']").remove();
                      $(".finder-mem .style").each( function() {
                        if ( $(this).find(".style-closer").length == 0 || $(this).find(".stylename:empty").length ) {
                          $(this).remove();
                        }
                      });
                    }

                    console.log( style + "|" + styleName );
                    console.log( memCache );
                    if ( memCache.toString().substr(0,1) == "," ) { memCache = memCache.toString().substr(1) }
                    localStorage.setItem("memCache", memCache);
                  }, 200);
                }
                //console.log( $(".mem-searching") );
              }, 250);
            }
            $(".finder-mem, .finder-search, .finder-cache").removeClass("on");
            $(".style-finder").removeClass("searching");
          }
          
          // Search Memory
          function styleMemDown() {
            // Targeting Memory
            if ( $(".finder-mem").hasClass("on") ) {
              if ( $(".finder-mem li.target").next().length ) {
                $(".finder-mem li.target").next("li").addClass("target");
                $(".finder-mem li.target:first").removeClass("target");
              }
            } else {
              $(".finder-mem").addClass("on");
              $(".finder-mem li").removeClass("target");
              $(".finder-mem li:first").addClass("target");
              $(".finder-mem").scrollTop(0);
            }
            $(".style-finder").val( $(".style.target").attr("styleid") );

            //console.log( $(".style.target").offset().top );
            if ( $(".style.target").offset().top > $(".finder-mem").height() + 40 ) {
              $(".finder-mem").scrollTop( $(".finder-mem").scrollTop() + $(".style.target").height() );
            }

            $(".style").off("click");
            $(".style").on("click", function() {
              $(".style-finder").val( $(this).attr("styleid") );
              styleOpen();
            });
            $(".finder-cache").removeClass("on");
            console.log( "Mem Down" );
          }
          function styleMemUp() {
         		// Targeting Memory
            if ( $(".finder-mem").hasClass("on") ) {
              if ( $(".finder-mem li.target").prev().length ) {
                $(".finder-mem li.target").prev("li").addClass("target");
                $(".finder-mem li.target:last").removeClass("target");
              } else {
                $(".finder-mem li.target").removeClass("target");
                $(".finder-mem").removeClass("on");
              }
            } else {
              $(".finder-mem").addClass("on");
              $(".finder-mem li").removeClass("target");
              $(".finder-mem li:last").addClass("target");
              $(".finder-mem").scrollTop( $(".style:first").height() * $(".style").length );
            }

            //console.log( $(".style.target").offset().top );
            if ( $(".style.target").offset().top < 0 ) {
              $(".finder-mem").scrollTop( $(".finder-mem").scrollTop() - $(".style.target").height() );
            }
						
            $(".style").off("click");
            $(".style").on("click", function() {
              $(".style-finder").val( $(this).attr("styleid") );
              styleOpen();
            });
            
            $(".style-finder").val( $(".style.target").attr("styleid") );
            $(".finder-cache").removeClass("on");
            console.log( "Mem Up" );
          }
          
          function styleSearchDown() {
          	// Targeting Result
            if ( $(".finder-search .result.target").length ) {
              if ( $(".finder-search li.target").next().length ) {
                $(".finder-search li.target").next("li").addClass("target");
                $(".finder-search li.target:first").removeClass("target");
              }
            } else {
              $(".finder-search").addClass("on");
              $(".finder-search li").removeClass("target");
              $(".finder-search li:first").addClass("target");
              $(".finder-search").scrollTop(0);
            }
            $(".style-finder").val( $(".result.target").attr("styleid") );
            
            //console.log( $(".result.target").offset().top );
            if ( $(".result.target").offset().top > $(".finder-search").height() + 40 ) {
              $(".finder-search").scrollTop( $(".finder-search").scrollTop() + $(".result.target").height() );
            }
            $(".finder-cache").removeClass("on");
						console.log( "Search Down" );
          }
          function styleSearchUp() {
          	// Targeting Result
            if ( $(".finder-search .result.target").length ) {
            	if ( $(".finder-search li.target").prev().length ) {
                $(".finder-search li.target").prev("li").addClass("target");
                $(".finder-search li.target:last").removeClass("target");
              } else {
                $(".finder-search li.target").removeClass("target");
                $(".finder-search").removeClass("on");
              }
            } else {
            	$(".finder-search").addClass("on");
              $(".finder-search li").removeClass("target");
              $(".finder-search li:last").addClass("target");
              $(".finder-search").scrollTop( $(".style:first").height() * $(".style").length );
            }
            //console.log( $(".result.target").offset().top );
            if ( $(".result.target").offset().top < 0 ) {
              $(".finder-search").scrollTop( $(".finder-search").scrollTop() - $(".result.target").height() );
            }
            $(".style-finder").val( $(".result.target").attr("styleid") );
            $(".finder-cache").removeClass("on");
            console.log( "Search Up" );
          }
          function styleCacheUp() {
            console.log( "GG" );
          	// Targeting Cached Styles
            if ( $(".finder-cache").hasClass("on") ) {
              if ( $(".finder-cache li.target").prev().length ) {
                $(".finder-cache li.target").prev("li").addClass("target");
                $(".finder-cache li.target:last").removeClass("target");
              } else {
                $(".finder-cache li.target").removeClass("target");
                $(".finder-cache").removeClass("on");
              }
              
            } else {
              $(".finder-cache").addClass("on");
              $(".finder-cache li").removeClass("target");
              $(".finder-cache li:last").addClass("target");
              $(".finder-cache").scrollTop( $(".style:first").height() * $(".style").length );
            }

            //console.log( $(".style.target").offset().top );
            if ( $(".style.target").offset().top < 0 ) {
              $(".finder-cache").scrollTop( $(".finder-cache").scrollTop() - $(".style.target").height() );
            }
						
            $(".style").off("click");
            $(".style").on("click", function() {
              $(".style-finder").val( $(this).attr("styleid") );
              styleOpen();
            });
            
            $(".style-finder").val( $(".finder-cache .style.target").attr("styleid") );
            $(".finder-mem").removeClass("on");
            console.log( "Cache Up" );
          }
          function styleCacheDown() {
          	// Targeting Cached Styles
            if ( $(".finder-cache").hasClass("on") ) {
              if ( $(".finder-cache li.target").next().length ) {
                $(".finder-cache li.target").next("li").addClass("target");
                $(".finder-cache li.target:first").removeClass("target");
              } else {
              	$(".finder-cache li:first").addClass("target");
              }
            } else {
              $(".finder-cache").addClass("on");
              $(".finder-cache li").removeClass("target");
              $(".finder-cache li:first").addClass("target");
              $(".finder-cache").scrollTop(0);
            }
            $(".style-finder").val( $(".finder-cache .style.target").attr("styleid") );

            //console.log( $(".style.target").offset().top );
            if ( $(".style.target").offset().top > $(".finder-cache").height() + 40 ) {
              $(".finder-cache").scrollTop( $(".finder-cache").scrollTop() + $(".style.target").height() );
            }

            $(".style").off("click");
            $(".style").on("click", function() {
              $(".style-finder").val( $(this).attr("styleid") );
              styleOpen();
            });
            $(".finder-mem, .finder-search").removeClass("on");
            console.log( "Cache Down" );
          }
          
          // Cache
          if ( sfCache == "true" ) {
            let iconCog = "<svg viewBox='410.9 287.6 20 20'><path d='M429,297.6c0-1.2,0.8-2.2,1.9-2.9c-0.2-0.7-0.5-1.4-0.8-2c-1.3,0.3-2.3-0.2-3.2-1.1c-0.9-0.9-1.2-1.9-0.8-3.2c-0.6-0.3-1.3-0.6-2-0.8c-0.7,1.2-1.9,1.9-3.1,1.9 c-1.2,0-2.5-0.8-3.1-1.9c-0.7,0.2-1.4,0.5-2,0.8c0.3,1.3,0.1,2.3-0.8,3.2 c-0.9,0.9-1.9,1.4-3.2,1.1c-0.3,0.6-0.6,1.3-0.8,2c1.2,0.7,1.9,1.7,1.9,2.9c0,1.2-0.8,2.5-1.9,3.1c0.2,0.7,0.5,1.4,0.8,2 c1.3-0.3,2.3-0.1,3.2,0.8c0.9,0.9,1.2,1.9,0.8,3.2c0.6,0.3,1.3,0.6,2,0.8c0.7-1.2,1.9-1.9,3.1-1.9c1.2,0,2.5,0.8,3.1,1.9 c0.7-0.2,1.4-0.5,2-0.8c-0.3-1.3-0.1-2.3,0.8-3.2c0.9-0.9,1.9-1.4,3.2-1.1c0.3-0.6,0.6-1.3,0.8-2C429.8,299.9,429,298.9,429,297.6z M420.9,302c-2.4,0-4.3-1.9-4.3-4.3c0-2.4,1.9-4.3,4.3-4.3c2.4,0,4.3,1.9,4.3,4.3C425.3,300,423.3,302,420.9,302z'></path></svg>";
            let cachedStyles = [];
            let tryCount = 0;
            
            $(".style-finder").parent().prepend("<div class='mem-toggler-cont'><div class='mem-toggler'></div></div>");
            $(".style-finder").parent().prepend("<div class='cache-toggler-cont'><div class='cache-toggler'></div></div>");
            setTimeout( function() {
              $(".mem-toggler-cont").on("click", function() {
                styleMemDown();
                $(".style-finder").focus();
              });
              $(".cache-toggler-cont").on("click", function() {
                styleCacheDown();
                $(".style-finder").focus();
              });
            }, 500);
            
        		$(".button-cache").on("mouseenter", function() {
            	$(".finder-cache").addClass("hold");
            });
            $(".button-cache").on("click", function() {
              $(this).toggleClass("on");
              $(".finder-cache ul").html("");
              
              if ( $(this).hasClass("on") ) {
                $(this).html( iconCog );
                cacheSrc = "//" + location.host + "/admin/layout/styles?sub=true";
                $(".cache-footer").append("<iframe class='cacher' src='"+ cacheSrc +"'></iframe>");
                let cacheStyles = setInterval( function() {
                  let cacher = $(".cacher").contents();
                  // Check 1 (if Not in Styles Menu) /* God damnit, it doesn't work */
                  /*if ( cacher.find("#group_0").length == 0 && $(".cacher").contents().find(".shuttle-MainNav-itemTarget[href$='/layout']") ) {
                  	//$(".cacher").contents().find(".shuttle-MainNav-itemTarget[href$='/layout']").trigger("click");
                    let script = "console.log( 'http://' + location.host + '/admin/layout/styles?sub=true' ); ";
                    script = script + "location.pathname = '/admin/layout/styles?sub=true'";
                    setTimeout( function() { $(".cacher").contents().find("head").append("<script>"+ script +"</script>")}, 500 );
                  }*/
                	if ( cacher.find("#group_0").length ) {
                  	cacher.find("body").addClass("loaded");
                    clearInterval( cacheStyles );
                    console.log( "Loaded" );
                    $(".preview-style tr").each( function() {
                      if ( $(this).attr("data-id") != undefined ) {
                    		cachedStyles.push( $(this).attr("data-id") + "|" + $(this).find("> td:not(.Table--actions-handle):not(:empty):first").text() );
                      }
                    });
                    console.log( cachedStyles );
                    localStorage.setItem( "memCacheAll", cachedStyles.toString() );
                    for ( i = 0; i < cachedStyles.length; i++ ) {
                      let cacheID = cachedStyles[i].split("|")[0];
                      let cacheName = cachedStyles[i].split("|")[1];
                    	$(".finder-cache ul").append("<li class='style' styleid='"+ cacheID +"'><span class='styleid'>"+ cacheID +"</span><span class='stylename'>"+ cacheName +"</span></li>");
                    }
                    $(".cacher").remove();
                    $(".button-cache").text("Cache");
                    $(".button-cache").removeClass("on");
                    $(".finder-cache").attr("all", $(".finder-cache .style").length);
                    $(".style-finder").focus();
                    
                    // Make Clickable
                   	$(".finder-cache .style").on("click", function() {
                    	$(".style-finder").val( $(this).attr("styleid") );
                    	styleOpen();
                    });
                    
                    console.log( $(".finder-cache .style").length + " styles cached." );
                    
                  }
                  tryCount = tryCount + 1;
                  
                  if ( tryCount >= 10 ) { clearInterval( cacheStyles ); }
                }, 500);
            	} else {
              	$(this).text("Cache");
                $(".cache-footer .cacher").remove();
              }
            });
          }
          // Update Cache Button
          setTimeout( function() {
            $(".shuttle-MainNav-itemTarget").on("click", function() {
              if ( $(this).attr("href").includes("/admin/layout") ) {
                $(".button-cache").addClass("avail").removeAttr("disabled");
              } else {
                $(".finder-cache .button-cache").removeClass("avail").attr("disabled","disabled");
              }
              console.log( "GG" );
            });
          }, 500);
          
          // Load from Cache
          if ( localStorage.getItem("memCacheAll") != null ) {
            let cachedStylesMem = localStorage.getItem("memCacheAll").split(",");
            for (i = 0; i < cachedStylesMem.length ; i++) {
							let cacheID = cachedStylesMem[i].split("|")[0];
              let cacheName = cachedStylesMem[i].split("|")[1];
              $(".finder-cache ul").append("<li class='style' styleid='"+ cacheID +"'><span class='styleid'>"+ cacheID +"</span><span class='stylename'>"+ cacheName +"</span></li>");
            }
            $(".finder-cache").attr("all", $(".finder-cache .style").length);
          }
          
        }
      }
    }   
  });
 	
  // ---------------------
  
  // Local Storage Initialization Pro
  
  console.log("-------");
  let rules = [
  "pro-dark-mode:false"
  ,
  "pro-dark-mode-default:true"
  ,
  "pro-dark-mode-toggler:true"
  ,
  "pro-spacer-name:true"
 	,
  "pro-spacer-focus:true"
  ,
  "pro-projector-mode:false"
	,
  "pro-style-finder:true"
  ,
  "pro-style-numbers:true"
  ,
  "pro-style-finder-memory:true"
  ,
  "pro-style-finder-cache:true"
  ,
  "pro-style-finder-memory-all:false"
  ,
  "pro-style-finder-tall:false"
  ,
 	"pro-indent:false"
  ]
  function init(rule) {
    let label = rule.split(":")[0];
    let state = rule.split(":")[1];
    //console.log(rule);
    //console.log( localStorage.getItem(label) );
    if ( localStorage.getItem(label) == null ) {
    	localStorage.setItem(label, state);
      console.log("Initialized " + label + " as " + state);
    }
  }
  rules.forEach( rule => init(rule) )
  
  // ---------------------
  
  // Settings
  let iconCog = "<svg viewBox='410.9 287.6 20 20'><path d='M429,297.6c0-1.2,0.8-2.2,1.9-2.9c-0.2-0.7-0.5-1.4-0.8-2c-1.3,0.3-2.3-0.2-3.2-1.1c-0.9-0.9-1.2-1.9-0.8-3.2c-0.6-0.3-1.3-0.6-2-0.8c-0.7,1.2-1.9,1.9-3.1,1.9 c-1.2,0-2.5-0.8-3.1-1.9c-0.7,0.2-1.4,0.5-2,0.8c0.3,1.3,0.1,2.3-0.8,3.2 c-0.9,0.9-1.9,1.4-3.2,1.1c-0.3,0.6-0.6,1.3-0.8,2c1.2,0.7,1.9,1.7,1.9,2.9c0,1.2-0.8,2.5-1.9,3.1c0.2,0.7,0.5,1.4,0.8,2 c1.3-0.3,2.3-0.1,3.2,0.8c0.9,0.9,1.2,1.9,0.8,3.2c0.6,0.3,1.3,0.6,2,0.8c0.7-1.2,1.9-1.9,3.1-1.9c1.2,0,2.5,0.8,3.1,1.9 c0.7-0.2,1.4-0.5,2-0.8c-0.3-1.3-0.1-2.3,0.8-3.2c0.9-0.9,1.9-1.4,3.2-1.1c0.3-0.6,0.6-1.3,0.8-2C429.8,299.9,429,298.9,429,297.6z M420.9,302c-2.4,0-4.3-1.9-4.3-4.3c0-2.4,1.9-4.3,4.3-4.3c2.4,0,4.3,1.9,4.3,4.3C425.3,300,423.3,302,420.9,302z'></path></svg>";
  let iconLog = "<svg viewBox='0 0 20 20'><g><path d='M16.3,8.6H8c-0.8,0-0.9,0.6-0.9,1.4s0.1,1.4,0.9,1.4h8.3c0.8,0,0.9-0.6,0.9-1.4S17.1,8.6,16.3,8.6z M19.1,15.7H8 c-0.8,0-0.9,0.6-0.9,1.4s0.1,1.4,0.9,1.4h11.1c0.8,0,0.9-0.6,0.9-1.4S19.9,15.7,19.1,15.7z M8,4.3h11.1c0.8,0,0.9-0.6,0.9-1.4 s-0.1-1.4-0.9-1.4H8c-0.8,0-0.9,0.6-0.9,1.4S7.2,4.3,8,4.3z M3.4,8.6H0.9C0.1,8.6,0,9.2,0,10s0.1,1.4,0.9,1.4h2.6 c0.8,0,0.9-0.6,0.9-1.4S4.2,8.6,3.4,8.6z M3.4,15.7H0.9c-0.8,0-0.9,0.6-0.9,1.4s0.1,1.4,0.9,1.4h2.6c0.8,0,0.9-0.6,0.9-1.4 S4.2,15.7,3.4,15.7z M3.4,1.4H0.9C0.1,1.4,0,2.1,0,2.9s0.1,1.4,0.9,1.4h2.6c0.8,0,0.9-0.6,0.9-1.4S4.2,1.4,3.4,1.4z'></path></g></svg>";
  let iconPage = "<svg viewBox='0 0 384 512'><path d='M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm64 236c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-64c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-72v8c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm96-114.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z'/></svg>";
  let iconImport = "<svg viewBox='0 0 20 20'><path d='M15,7h-3V1H8v6H5l5,5L15,7z M19.338,13.532c-0.21-0.224-1.611-1.723-2.011-2.114C17.062,11.159,16.683,11,16.285,11h-1.757 l3.064,2.994h-3.544c-0.102,0-0.194,0.052-0.24,0.133L12.992,16H7.008l-0.816-1.873c-0.046-0.081-0.139-0.133-0.24-0.133H2.408 L5.471,11H3.715c-0.397,0-0.776,0.159-1.042,0.418c-0.4,0.392-1.801,1.891-2.011,2.114c-0.489,0.521-0.758,0.936-0.63,1.449 l0.561,3.074c0.128,0.514,0.691,0.936,1.252,0.936h16.312c0.561,0,1.124-0.422,1.252-0.936l0.561-3.074 C20.096,14.468,19.828,14.053,19.338,13.532z'></path></svg>";
  let iconHelp = "<svg x='0px' y='0px' viewBox='0 0 20 20' xml:space='preserve'><g><path d='M19,10c0,5-4,9-9,9c-5,0-9-4-9-9c0-5,4-9,9-9C15,1,19,5,19,10z M14.1,7.4c0-2.2-1.9-3.8-4.1-3.8c-2.2,0-3.8,1.9-3.8,1.9 L7.8,7c0,0,1.1-1.1,2.2-1.1s1.9,0.8,1.9,1.5c0,1.5-3,1.5-3,3.8v0.7h2.3v-0.4C11.1,10.4,14.1,10.4,14.1,7.4z M11.5,15.3 c0-0.8-0.7-1.5-1.5-1.5s-1.5,0.7-1.5,1.5c0,0.8,0.7,1.5,1.5,1.5S11.5,16.1,11.5,15.3z'></path></g></svg>";
  
  let Projector = 
	'.shuttle-Panel--subNav, .shuttle-MainNav-itemTarget.is-selected {background-color: #FAFAFA !important;}'
  +
  '.shuttle-SubNav--alt .shuttle-SubNav-itemTarget {border-bottom: 1px solid #DDD !important;}'
  +
  '.shuttle-Panel > .shuttle-SubNav-CreateButtons {background: linear-gradient(180deg,rgba(255,255,255,0) 0,#FFF 20%,#FFF) !important;}'
  +
  '.shuttle-SubNav-title {color: #555 !important;}'
  +
  '.shuttle-SubNav-itemTarget, .shuttle-MainNav-itemTitle, .shuttle-Panel--subNav .Button--link {color: #333 !important;}'
  +
  '.shuttle-SubNav--alt .shuttle-SubNav-itemTarget .Icon, .shuttle-MainNav-itemIcon > .Icon, .shuttle-Panel--subNav .Button--link .Icon *, .shuttle-Header .Button--withIcon .Icon > svg, .modeswitch svg {fill: #333 !important; opacity: 1 !important;}'
  +
  'path[fill="#FFFFFF"] {filter: invert(.8) !important;}'
  +
  '.shuttle-Header {background-color: #F1F1F1 !important;}'
  +
  '.Logo-icon > .Icon {fill: #333 !important; opacity: 1 !important;}'
  +
  '.ButtonGroup-item > .Button {color: #333 !important;}'
  +
 	'.style-finder {background: #FFF !important; border: 1px solid #F1F1F1 !important;}'
  +
 	'.shuttle-Panels .ButtonGroup-item .Button--withIcon {color: #FFF !important;}'
  +
  '.shuttle-Panel--mainNav {background-color: #FFF !important;}';
  
  function settingsPro() {
 		let panel = $("a[data-active-id='cookies']").closest(".shuttle-Panel-inner");
    if ( panel.find(".heading-addons").length == 0 ) {
      panel.append("<div class='shuttle-SubNav shuttle-SubNav--alt heading-addons'></div>");
      panel.find(".heading-addons").append("<div class='shuttle-SubNav-title'>Add-ons</div>");
      panel.find(".heading-addons").append("<ul class='shuttle-SubNav-wrapItems Nav Nav--stacked'></ul>");
    }
  }
  function settingsProRun() {
   	let panel = $("a[data-active-id='cookies']").closest(".shuttle-Panel-inner");
    let menuItems = [];
    menuItems.push({"label":"Settings", "icon":iconCog}, {"label":"Documentation", "icon":iconPage}, {"label":"Changelog", "icon":iconLog}, {"label":"Import/export Settings", "icon":iconImport});
  	$(".heading-addons ul").append("<li class='shuttle-SubNav-item'><a class='shuttle-SubNav-itemTarget settings-pro' href=''><div class='Icon'></div>Shuttle Pro</a></li>");
    $(".heading-addons .settings-pro .Icon").append( iconCog );
    $(".settings-pro").on("click", function() {
    	if ( $(".panel-pro").length == 0 ) {
        $(".shuttle-Panel--mainNav").nextAll(".shuttle-Panels:visible").append("<div class='shuttle-Panels shuttle-Panels--nested panel-pro' style='margin-left: 250px; top: 0px;'></div>")
        $(".panel-pro").append("<div class='shuttle-Panel shuttle-Panel--withTabs'></div>");
        $(".panel-pro > .shuttle-Panel").append("<div class='shuttle-Panel-inner' style='top: 115px; bottom: 0px;'></div>");
        $(".panel-pro > .shuttle-Panel").append("<div class='shuttle-Panel-header'></div>");
      } else {
      	$(".panel-pro").parent().find("> .shuttle-Panels--nested:not(.panel-pro)").hide();
        $(".shuttle-Panels.affected:hidden").remove();
      }
      
      // Open Settings
      panel.find(".is-selected:visible").removeClass("is-selected");
      $(this).addClass("is-selected");
      // Fill with Appliccable Settings
      if ( $(".panel-pro.affected").length == 0 ) {
        $(".panel-pro .shuttle-Panel-header").append("<div class='shuttle-Panel-title u-textTruncate'>Shuttle Pro</div>");
        $(".panel-pro .shuttle-Panel-header").append("<div class='shuttle-Panel-toolbar'></div>");
        $(".panel-pro .shuttle-Panel-header").append("<ul class='PanelNav Nav'></ul>");
        for ( i = 0; i < menuItems.length; i++ ) {
          let menuLabel = menuItems[i].label;
          let menuIcon = menuItems[i].icon;
          $(".panel-pro .shuttle-Panel-header ul").append("<li class='PanelNav-item'><a class='PanelNav-itemTarget' href='' data-tab='"+ menuLabel +"'><div class='Icon'>" + menuIcon + "</div>"+ menuLabel +"</a></li>");
        }
        $(".panel-pro .shuttle-Panel-header ul a").on("click", function(e) {
					e.preventDefault();
       		$(".panel-pro .shuttle-Panel-header ul a").removeClass("is-selected");
          $(this).addClass("is-selected");
        });
    		
        $(".panel-pro").addClass("affected");
      }
      // Settings Menus
      $(".PanelNav-itemTarget").on("click", function() {
      	let which = $(this).attr("data-tab");
        function addPanel() { // Clean up and Add Panel
          $(".panel-pro .shuttle-PRO, .panel-pro .Form-item--actions").remove();
          $(".panel-pro .shuttle-Panel-inner").append("<div class='shuttle-PRO'></div>");
        };
        console.log(which + " Shuttle Pro");
        
        // Settings
        if ( which == "Settings" ) {
        	addPanel();
         	$(".shuttle-PRO").parent().parent().append("<div class='Form-item Form-item--actions'><div class='Form-controls'><input class='Button Button--primary' type='submit' value='Save'></div></div>");
          
          // Enable Dark Mode by Default
          $(".shuttle-PRO").append("<div class='Form-item'><label for='dark-mode' class='Form-label'>Enable dark mode by default</label> <div class='Form-controls'> <span class='switchery switchery-default dark-mode'><small></small></span> </div> </div>");
          $(".shuttle-PRO label[for='dark-mode']").append( "<span class='Form-help-icon' data-toggle='tooltip' data-original-title='Enables dark mode by default throughout all Shuttle sites, the site overview and subsidiary pages'></span>" );
          $(".shuttle-PRO label[for='dark-mode'] .Form-help-icon").append( iconHelp );
          
          $(".shuttle-PRO .dark-mode").on("click", function() {
          	$(this).toggleClass("on");
            if ( $(this).hasClass("on") ) {
            	localStorage.setItem("pro-dark-mode-default",true);
              localStorage.setItem("pro-dark-mode", true);
              //$(".modeswitch").trigger("click");
            } else {
              localStorage.setItem("pro-dark-mode-default",false);
              localStorage.setItem("pro-dark-mode", false);
              //$(".modeswitch").trigger("click");
            }
          });
          
          if ( localStorage.getItem("pro-dark-mode-default") != null ) {
            if ( localStorage.getItem("pro-dark-mode-default") == "true" ) {
              $(".shuttle-PRO .dark-mode").addClass("on");
              localStorage.setItem("pro-dark-mode", true);
            } else {
              $(".shuttle-PRO .dark-mode").removeClass("on");
              localStorage.setItem("pro-dark-mode", false);
            }
        	} else {
          	localStorage.setItem("pro-dark-mode-default", false);
            $(".shuttle-PRO .dark-mode").removeClass("on");
          }
          
          /*if ( localStorage.getItem("pro-dark-mode") == null ) {
            localStorage.setItem("pro-dark-mode", true);
          } else {
            if ( localStorage.getItem("pro-dark-mode") == "true" ) {
              $(".dark-mode").addClass("on");
            } else {
              $(".dark-mode").removeClass("on");
            }
          };*/
          
          
          // Enable Dark Mode Button
          $(".shuttle-PRO").append("<div class='Form-item'><label for='dark-mode-toggler' class='Form-label'>Show dark mode button</label> <div class='Form-controls'> <span class='switchery switchery-default dark-mode-toggler on'><small></small></span> </div> </div>");
          $(".shuttle-PRO label[for='dark-mode-toggler']").append( "<span class='Form-help-icon' data-toggle='tooltip' data-original-title='Shows the dark mode toggle button at the top right'></span>" );
          $(".shuttle-PRO label[for='dark-mode-toggler'] .Form-help-icon").append( iconHelp );
          
          $(".shuttle-PRO .dark-mode-toggler").on("click", function() {
          	$(this).toggleClass("on");
            if ( $(this).hasClass("on") ) {
            	localStorage.setItem("pro-dark-mode-toggler",true);
              $(".modeswitch").show();
            } else {
              localStorage.setItem("pro-dark-mode-toggler",false);
              $(".modeswitch").hide();
            }
          });
          
          if ( localStorage.getItem("pro-dark-mode-toggler") == null ) {
            localStorage.setItem("pro-dark-mode-toggler", true);
          } else {
            if ( localStorage.getItem("pro-dark-mode-toggler") == "true" ) {
              $(".dark-mode-toggler").addClass("on");
            } else {
              $(".dark-mode-toggler").removeClass("on");
            }
          };
          
          
          // Enable Spacer Height to Name
          $(".shuttle-PRO").append("<div class='Form-item'><label for='spacer-name' class='Form-label'>Name Spacers by height</label> <div class='Form-controls'> <span class='switchery switchery-default spacer-name on'><small></small></span> </div> </div>");
          $(".shuttle-PRO label[for='spacer-name']").append( "<span class='Form-help-icon' data-toggle='tooltip' data-original-title='Allows unnamed Spacers to use their height for a name while typing'></span>" );
          $(".shuttle-PRO label[for='spacer-name'] .Form-help-icon").append( iconHelp );
          
          $(".shuttle-PRO .spacer-name").on("click", function() {
          	$(this).toggleClass("on");
            if ( $(this).hasClass("on") ) {
            	localStorage.setItem("pro-spacer-name",true);
            } else {
              localStorage.setItem("pro-spacer-name",false);
            }
          });
          
          if ( localStorage.getItem("pro-spacer-name") == null ) {
            localStorage.setItem("pro-spacer-name", true);
          } else {
            if ( localStorage.getItem("pro-spacer-name") == "true" ) {
              $(".spacer-name").addClass("on");
            } else {
              $(".spacer-name").removeClass("on");
            }
          };
          
          // Focus Spacer Height
          $(".shuttle-PRO").append("<div class='Form-item'><label for='spacer-focus' class='Form-label'>Focus Spacer Height</label> <div class='Form-controls'> <span class='switchery switchery-default spacer-focus on'><small></small></span> </div> </div>");
          $(".shuttle-PRO label[for='spacer-focus']").append( "<span class='Form-help-icon' data-toggle='tooltip' data-original-title='When editing a spacer, focus the height field initially, so as to write it first'></span>" );
          $(".shuttle-PRO label[for='spacer-focus'] .Form-help-icon").append( iconHelp );
          
          $(".shuttle-PRO .spacer-focus").on("click", function() {
          	$(this).toggleClass("on");
            if ( $(this).hasClass("on") ) {
            	localStorage.setItem("pro-spacer-focus",true);
            } else {
              localStorage.setItem("pro-spacer-focus",false);
            }
          });
          
          if ( localStorage.getItem("pro-spacer-focus") == null ) {
            localStorage.setItem("pro-spacer-focus", true);
          } else {
            if ( localStorage.getItem("pro-spacer-focus") == "true" ) {
              $(".spacer-focus").addClass("on");
            } else {
              $(".spacer-focus").removeClass("on");
            }
          };
          
          // Show Style Numbers in Layout > Styles
          $(".shuttle-PRO").append("<div class='Form-item'><label for='style-numbers' class='Form-label'>Show style numbers in Layout > Styles</label> <div class='Form-controls'> <span class='switchery switchery-default style-numbers on'><small></small></span> </div> </div>");
          $(".shuttle-PRO label[for='style-numbers']").append( "<span class='Form-help-icon' data-toggle='tooltip' data-original-title='Shows style numbers for all non-basic styles in the Layout > Styles menu'></span>" );
          $(".shuttle-PRO label[for='style-numbers'] .Form-help-icon").append( iconHelp );
          
          $(".shuttle-PRO .style-numbers").on("click", function() {
          	$(this).toggleClass("on");
            if ( $(this).hasClass("on") ) {
            	localStorage.setItem("pro-style-numbers",true);
            } else {
              localStorage.setItem("pro-style-numbers",false);
            }
          });
          
          if ( localStorage.getItem("pro-style-numbers") == null ) {
            localStorage.setItem("pro-style-numbers", true);
          } else {
            if ( localStorage.getItem("pro-style-numbers") == "true" ) {
              $(".style-numbers").addClass("on");
            } else {
              $(".style-numbers").removeClass("on");
            }
          };
          
          // Show Style Finder
          $(".shuttle-PRO").append("<div class='Form-item'><label for='style-finder' class='Form-label'>Show Style Finder</label> <div class='Form-controls'> <span class='switchery switchery-default style-finder-toggle on'><small></small></span> </div> </div>");
          $(".shuttle-PRO label[for='style-finder']").append( "<span class='Form-help-icon' data-toggle='tooltip' data-original-title='Shows the Style Finder in the Shuttle Header'></span>" );
          $(".shuttle-PRO label[for='style-finder'] .Form-help-icon").append( iconHelp );
          
          $(".shuttle-PRO .style-finder-toggle").on("click", function() {
          	$(this).toggleClass("on");
            if ( $(this).hasClass("on") ) {
            	localStorage.setItem("pro-style-finder",true);
              $(".style-finder-cont").show();
            } else {
              localStorage.setItem("pro-style-finder",false);
              $(".style-finder-cont").hide();
            }
          });
          
          if ( localStorage.getItem("pro-style-finder") == null ) {
            localStorage.setItem("pro-style-finder", true);
          } else {
            if ( localStorage.getItem("pro-style-finder") == "true" ) {
              $(".style-finder-toggle").addClass("on");
            } else {
              $(".style-finder-toggle").removeClass("on");
            }
          };
          
              // Show Style Finder Internal Memory
              $(".shuttle-PRO").append("<div class='Form-item' indent='1' belongsto='style-finder'><label for='style-finder-memory' class='Form-label'>Use Style Finder internal memory</label> <div class='Form-controls'> <span class='switchery switchery-default style-finder-memory-toggle on'><small></small></span> </div> </div>");
              $(".shuttle-PRO label[for='style-finder-memory']").append( "<span class='Form-help-icon' data-toggle='tooltip' data-original-title='Enables memorization of previous search entries'></span>" );
              $(".shuttle-PRO label[for='style-finder-memory'] .Form-help-icon").append( iconHelp );
							
              $(".shuttle-PRO .style-finder-memory-toggle").on("click", function() {
                $(this).toggleClass("on");
                if ( $(this).hasClass("on") ) {
                  localStorage.setItem("pro-style-finder-memory",true);
                  $(".style-finder-memory").show();
                } else {
                  localStorage.setItem("pro-style-finder-memory",false);
                  $(".style-finder-memory").hide();
                }
              });

              if ( localStorage.getItem("pro-style-finder-memory") == null ) {
                localStorage.setItem("pro-style-finder-memory", true);
              } else {
                if ( localStorage.getItem("pro-style-finder") == "true" ) {
                  $(".style-finder-memory-toggle").addClass("on");
                } else {
                  $(".style-finder-memory-toggle").removeClass("on");
                }
              };
          
                  // Remember All Visits
                  $(".shuttle-PRO").append("<div class='Form-item' indent='1' belongsto='style-finder-memory'><label for='style-finder-memory-all' class='Form-label'>Remember all editor visits</label> <div class='Form-controls'> <span class='switchery switchery-default style-finder-memory-all-toggle on'><small></small></span> </div> </div>");
                  $(".shuttle-PRO label[for='style-finder-memory-all']").append( "<span class='Form-help-icon' data-toggle='tooltip' data-original-title='If enabled, remembers all visits. If disabled, remembers only visits through Style Finder'></span>" );
                  $(".shuttle-PRO label[for='style-finder-memory-all'] .Form-help-icon").append( iconHelp );

                  $(".shuttle-PRO .style-finder-memory-all-toggle").on("click", function() {
                    $(this).toggleClass("on");
                    if ( $(this).hasClass("on") ) {
                      localStorage.setItem("pro-style-finder-memory-all",true);
                      $(".style-finder-memory-all").show();
                    } else {
                      localStorage.setItem("pro-style-finder-memory-all",false);
                      $(".style-finder-memory-all").hide();
                    }
                  });

                  if ( localStorage.getItem("pro-style-finder-memory-all") == null ) {
                    localStorage.setItem("pro-style-finder-memory-all", true);
                  } else {
                    if ( localStorage.getItem("pro-style-finder") == "true" ) {
                      $(".style-finder-memory-all-toggle").addClass("on");
                    } else {
                      $(".style-finder-memory-all-toggle").removeClass("on");
                    }
                  };
          		
          		// Show Style Finder Real Style Caching
              $(".shuttle-PRO").append("<div class='Form-item' indent='1' belongsto='style-finder'><label for='style-finder-cache' class='Form-label'>Use Style Finder caching</label> <div class='Form-controls'> <span class='switchery switchery-default style-finder-cache-toggle on'><small></small></span> </div> </div>");
              $(".shuttle-PRO label[for='style-finder-cache']").append( "<span class='Form-help-icon' data-toggle='tooltip' data-original-title='Enables caching of existing styles for use in Style Finder search by name. Visit documentation to learn how to use.'></span>" );
              $(".shuttle-PRO label[for='style-finder-cache'] .Form-help-icon").append( iconHelp );
							
              $(".shuttle-PRO .style-finder-cache-toggle").on("click", function() {
                $(this).toggleClass("on");
                if ( $(this).hasClass("on") ) {
                  localStorage.setItem("pro-style-finder-cache",true);
                  $(".style-finder-cache").show();
                } else {
                  localStorage.setItem("pro-style-finder-cache",false);
                  $(".style-finder-cache").hide();
                }
              });

              if ( localStorage.getItem("pro-style-finder-cache") == null ) {
                localStorage.setItem("pro-style-finder-cache", true);
              } else {
                if ( localStorage.getItem("pro-style-finder") == "true" ) {
                  $(".style-finder-cache").show();
                } else {
                  $(".style-finder-cache").hide();
                }
              };
          
          		// Tall Style Finder
              $(".shuttle-PRO").append("<div class='Form-item' indent='1' belongsto='style-finder'><label for='style-finder-tall' class='Form-label'>Tall Style Finder</label> <div class='Form-controls'> <span class='switchery switchery-default style-finder-tall-toggle on'><small></small></span> </div> </div>");
              $(".shuttle-PRO label[for='style-finder-tall']").append( "<span class='Form-help-icon' data-toggle='tooltip' data-original-title='Use the tall version of Style Finder'></span>" );
              $(".shuttle-PRO label[for='style-finder-tall'] .Form-help-icon").append( iconHelp );
							
              $(".shuttle-PRO .style-finder-tall-toggle").on("click", function() {
                $(this).toggleClass("on");
                if ( $(this).hasClass("on") ) {
                  localStorage.setItem("pro-style-finder-tall",true);
                  $(".style-finder").addClass("tall");
                } else {
                  localStorage.setItem("pro-style-finder-tall",false);
                  $(".style-finder").removeClass("tall");
                }
              });

              if ( localStorage.getItem("pro-style-finder-tall") == null ) {
                localStorage.setItem("pro-style-finder-tall", false);
              } else {
                if ( localStorage.getItem("pro-style-finder") == "true" ) {
                  $(".style-finder").addClass("tall");
                } else {
                  $(".style-finder").removeClass("tall");
                }
              };
          
          // Enable Projector Mode
          $(".shuttle-PRO").append("<div class='Form-item'><label for='projector-mode' class='Form-label'>Projector mode</label> <div class='Form-controls'> <span class='switchery switchery-default projector-mode-toggle'><small></small></span> </div> </div>");
          $(".shuttle-PRO label[for='projector-mode']").append( "<span class='Form-help-icon' data-toggle='tooltip' data-original-title='Adjusts the color pallette for harder to see elements when using a projector. DISABLES DARK MODE!'></span>" );
          $(".shuttle-PRO label[for='projector-mode'] .Form-help-icon").append( iconHelp );
          
          $(".shuttle-PRO .projector-mode-toggle").on("click", function() {
          	$(this).toggleClass("on");
            if ( $(this).hasClass("on") ) {
            	localStorage.setItem("pro-projector-mode",true);
              $("head").append("<style class='projector'>"+ Projector +"</style>");
              if ( $("head style.dark").length ) {
                $(".modeswitch").trigger("click");
              }
              $(".projector-mode").show();
            } else {
              localStorage.setItem("pro-projector-mode",false);
              $("head .projector").remove();
              $(".projector-mode").hide();
            }
          });
          
          if ( localStorage.getItem("pro-projector-mode") == null ) {
            localStorage.setItem("pro-projector-mode", true);
          } else {
            if ( localStorage.getItem("pro-projector-mode") == "true" ) {
              $(".projector-mode-toggle").addClass("on");
            } else {
              $(".projector-mode-toggle").removeClass("on");
            }
          };
          
          // Enable Page/file Indentation
          console.log( "Pro-indent" );
          $(".shuttle-PRO").append("<div class='Form-item'><label for='indent' class='Form-label'>Page/file indent colors</label> <div class='Form-controls'> <span class='switchery switchery-default indent-toggle'><small></small></span> </div> </div>");
          $(".shuttle-PRO label[for='indent']").append( "<span class='Form-help-icon' data-toggle='tooltip' data-original-title='Makes pages in Pages and folders in Files easier to differentiate when in different levels'></span>");
          $(".shuttle-PRO label[for='indent'] .Form-help-icon").append( iconHelp );
          
          $(".shuttle-PRO .indent-toggle").on("click", function() {
          	$(this).toggleClass("on");
            if ( $(this).hasClass("on") ) {
            	localStorage.setItem("pro-indent",true);
              $("head").append("<style class='indent'>"+ Indentation +"</style>");
              $(".indent").show();
            } else {
              localStorage.setItem("pro-indent",false);
              $("head .indent").remove();
              $(".indent").hide();
            }
          });
          
          if ( localStorage.getItem("pro-indent") == null ) {
            localStorage.setItem("pro-indent", false);
          } else {
            if ( localStorage.getItem("pro-indent") == "true" ) {
              $(".indent-toggle").addClass("on");
              $("head").append("<style class='indent'>"+ Indentation +"</style>");
              $(".indent").show();
            } else {
              $(".indent-toggle").removeClass("on");
              $("head .indent").remove();
              $(".indent").hide();
            }
          };
          
          
          // -----------
          // Tooltips
          $(".shuttle-PRO .Form-help-icon").on("mouseenter", function() {
            let tooltipContent = $(this).attr("data-original-title");
            let oTop = $(this).offset().top;
            let oLeft = $(this).offset().left;
          	$("body").append("<div class='Tooltip fade in Tooltip--top Tooltip-pro'> <div class='Tooltip-item'>"+ tooltipContent +"</div> </div>");
            $(".Tooltip-pro").css({"top": oTop, "left": oLeft});
          });
          $(".shuttle-PRO .Form-help-icon").on("mouseleave", function() {
          	$(".Tooltip").remove();
          });
          $(".shuttle-PRO .switchery, .shuttle-PRO .switchery small").addClass("animatable");
          
          // Save
          $(".shuttle-Panels.affected .Button[value='Save']").off("click");
          $(".shuttle-Panels.affected .Button[value='Save']").on("click", function() {
          	$(".shuttle-Panels.affected .shuttle-Panel-inner:visible").addClass("loading");
            setTimeout( function() {
            	$(".shuttle-Panels.affected .shuttle-Panel-inner:visible").removeClass("loading");
            }, 500);
          });
          
          // Adjust Visibility for Settings that Belong to Others
          $(".shuttle-PRO:visible .Form-item[belongsto]").each( function() {
          	let cur = $(this).attr("belongsto");
            console.log( $(this) );
            console.log( $(".shuttle-PRO:visible .Form-label[for='"+ cur +"']").parent() );
            $(this).appendTo( $(".shuttle-PRO:visible .Form-label[for='"+ cur +"']").parent() );
          });
          
          $(".shuttle-PRO:visible .switchery:visible").on("click", function() {
          	let cur = $(this).closest(".Form-controls").prev("label").attr("for");
            if ( $(this).hasClass("on") ) {
            	$(".Form-item[belongsto='"+ cur +"']").show();
            } else {
              $(".Form-item[belongsto='"+ cur +"']").hide();
            }
            
            // Hide Left Behind
   					$(".Form-item[belongsto]:visible").each( function() {
              //console.log( $(this) );
              let leftBehind = $(this).attr("belongsto");
            	if ( $(".Form-label[for='"+ leftBehind +"']:visible").length == 0 ) {
            		$(this).hide();
            	}
            });
            
            // Show Left Behind
            /*$(".Form-item[belongsto]:not(:visible)").each( function() {
              console.log( $(this) );
              let leftBehind = $(this).attr("belongsto");
            	if ( $(".Form-label[for='"+ leftBehind +"']:visible").length ) {
            		$(this).show();
            	}
            });*/
            
          });
        }
        // ------------
        // Documentation
        const documentation =
       	"<p><strong>Shuttle Pro</strong> is a tool that lends you more control over what Shuttle can do. While many changes are visual, some reduce the amount of actions required to get to the same end.</p>"
        +
        "<p>Almost all features are <strong>optional</strong> and can be toggled on/off at will. The only downside is that settings are on a per-site basis. They cannot be contained in the cloud and reused when logging into another site's admin dashboard automatically. If you wish to retain your settings, use the <strong>Import/export</strong> feature (coming soon).</p>"
        +
        '<p>Settings are stored in local storage. This means they will persist after you close Shuttle and re-enter at a later date.</p>'
        +
        '<p><strong>Shuttle Pro</strong> is entirely developed using Javascript and CSS. There is no server communication baked in. This means that every feature is limited to what is possible with Shuttle\'s HTML and newly added HTML and CSS. Adjusting data programmatically will not be possible.</p>'
        +
        '<h3>Style finder</h3>'
        +
       	'<p>The key feature of <strong>Shuttle Pro</strong> is the Style finder. It makes getting to styles easier, as you can visit any style from anywhere in Shuttle.</p>'
        +
        '<p>When enabled, Style finder will appear on the top bar on the right. It\'s very easy to use and can be navigated entirely using your mouse, entirely using your keyboard or any combination. It can be accessed by clicking on it or by pressing CTRL+* or CTRL+/ and beginning to type. You can visit a style by pressing ENTER.</p>'
        +
        '<p>Style finder stores links to styles in 3 ways:</p>'
        +
        '<ul><li>Memory</li></ul><p>This is where any style you visit ends up. Most recent visits end up on top. This can be accessed by clicking the single arrow button or by pressing the UP or DOWN arrow keys. Scroll through the list or continue to navigate with the arrow keys and click on a style or press ENTER in order to visit it.</p>'
        +
        '<ul><li>Search</li></ul><p>If you start typing, Style finder will list all the styles that match your query. This list is populated from a combination of Memory and Cache (if enabled).</p>'
        +
        '<ul><li>Cache</li></ul><p>It is also possible to cache all styles currently in a site. Visit Layout > Styles in order to enable caching and then press the double arrow button or SHIFT+DOWN or SHIFT+UP and click the Cache button. Style finder will cache all existing styles, allowing you to search through them at will.</p>'
        +
        '<p>It is also possible to delete a style from Memory. Target a style by using the arrow keys and press DELETE to mark it for deletion. Then press DELETE again to confirm you are sure you want to delete that style.</p>'
        ;
        
        if ( which == "Documentation" ) {
       		addPanel();
          console.log( "Doc" );
          $(".shuttle-PRO").append("<div class='shuttle-Panel-title full-width no-float'>Documentation</div><div class='doc-text'>"+ documentation +"</div>");
        }
        // Changelog
        if ( which == "Changelog" ) {
        	addPanel();
          $(".shuttle-PRO").append("<div class='shuttle-Panel-title full-width no-float'>Changelog</div><div class='doc-text'> Coming soon! </div>");
        }
        // Import/Export
        if ( which == "Import/export Settings" ) {
       		addPanel();
          $(".shuttle-PRO").append("<div class='shuttle-Panel-title full-width no-float'>Import / Export settings</div><div class='doc-text'> Coming soon! </div>");
        }
      });
      $(".panel-pro .PanelNav-itemTarget[data-tab='Settings']").trigger("click");
    });
  }
  
  function settingsProClose() {
  	let panel = $("a[data-active-id='cookies']").closest(".shuttle-Panel-inner");
   	let otherLink = panel.find(".shuttle-SubNav:not(.heading-addons) .shuttle-SubNav-wrapItems .shuttle-SubNav-itemTarget");
    otherLink.off("click");
    otherLink.on("click", function() {
      $(".heading-addons a").removeClass("is-selected");
      $(".panel-pro").remove();
    });
    $(".shuttle-Panel--mainNav li a").off("click");
    $(".shuttle-Panel--mainNav li a").on("click", function() {
   		$(".heading-addons a").removeClass("is-selected");
      if ( $(this).attr("data-active-id") == "settings" && $(this).hasClass("is-selected") == false ) {
        console.log("Settings clicked while inactive");
      	if ( $(".panel-pro").length ) {
          console.log("Pro Panel existed");
          setTimeout( function() {
        	$(".shuttle-SubNav-itemTarget").removeClass("is-selected");
          $(".settings-pro").addClass("is-selected");
          }, 150);
        }
      }
    });
  };
  
  setInterval( function() {
    if ( $(".cke:not(.affected):not([style*='z-index: 10001']):visible").length ) {
  		apply( $(".cke:not(.affected):not([style*='z-index: 10001']):visible") );
    }
    if ( $("a[data-active-id='settings'].is-selected").length && $("a[data-active-id='cookies']").length && $(".heading-addons").length == 0 ) {
      settingsPro();
    }
    if ( $(".heading-addons").length && $(".settings-pro").length == 0 ) {
      settingsProRun();
      settingsProClose();
    }
  }, 1000);

}
});

function ShuttlePro(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
  	style.className = "pro";
    head.appendChild(style);
}

function Dark(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
  	style.className = "dark";
    head.appendChild(style);
}

if ( $(".shuttle").length || $(".shuttle-App").length ) {
ShuttlePro(
  '@keyframes spinner {0% {transform: rotate(0)} 100% {transform: rotate(359deg)}}'
  +
  '.shuttle-PRO {margin-bottom: 100px;}'
  +
  '.Form-help-icon {max-height: 25px; max-width: 15px; display: inline-block;}'
  +
  '.shuttle-Header > div > div:last-child > div > div:last-child .Button::after {content: attr(version); position: absolute; text-transform: uppercase; font-size: 10.5px; color: #EEE !important; background: #3788ff; opacity: 1 !important; padding: 1px 4px; border-radius: 7px; top: 1px; right: -3px; pointer-events: none;}'
  +
  '.shuttle-Header > div > div:last-child > div > div:last-child .Button {opacity: 1 !important; color: #939393 !important;}'
  +
  '.shuttle-Header > div > div:last-child > div > div:last-child .Button svg {fill: #939393 !important;}'
  +
  '.shuttle-Header > div > div:last-child > div > div:last-child .Button:hover {opacity: 1 !important; color: #D5D5D5 !important;}'
  +
  '.shuttle-Header > div > div:last-child > div > div:last-child .Button:hover svg {fill: #D5D5D5 !important;}'
  +
  '.modeswitch {height: 28px; width: 28px; position: absolute; fill: #FFF; left: -30px; opacity: .5; top: 9px; padding: 5px; cursor: pointer; transition: all 175ms ease-in-out 0s;}'
  +
  '.modeswitch:hover {opacity: 1; transition: all 175ms ease-in-out 0s;}'
  +
  '.modeswitch svg {position: absolute; top: 0; transform: scale(1.05); border: 2px solid #FFF; border-radius: 50%; height: 16px; width: 16px;}'
  +
  '.seo-parent::after {content: attr(length) " / " attr(limit); position: absolute; bottom: 0; left: 0; transform: translateY(100%); font-size: 15px;}'
  +
  '.seo-parent.toolong::after, .seo-parent.tooshort:not(.unknown)::after, .seo-parent.empty[lowerlimit]::after, .seo-parent.empty[length="0"] {color: #F14949;}'
  +
  '.seo-parent.unknown::after {content: "? / " attr(limit)}'
  +
  '.seo-parent.known::after, .seo-parent.known.multi[trunc="NaN"]::after {content: "Truncated to: " attr(length) " / " attr(limit)}'
  +
  '.seo-parent.known.multi::after {content: "Truncated to " attr(trunc) " (+" attr(remainder) ") : " attr(length) " / " attr(limit)}'
  +
  '.seo-parent.known:not(.multi):not([remainder="0"])::after {content: "Truncated to " attr(trunc) " (+" attr(remainder) ") : " attr(length) " / " attr(limit)}'
  +
  '.seo-parent.unknown[length="NaN"]::after, .seo-parent.known[length="NaN"]::after, .seo-parent.dyn:not(.known)::after, .seo-parent.dyn.known[length="NaN"] {content: "? / " attr(limit) !important;}'
  +
  '.seo-parent.unknown:not([length="NaN"]):not(.dyn)::after {content: attr(length) " / " attr(limit) !important;}'
  +
  '.shuttle-widget-properties > a[data-tab="layout"][data-original-title*="Content style:"] .Icon, .shuttle-widget-properties > a[data-tab="dynamic"][data-original-title="Field"] .Icon {fill: #559FEC !important;}'
  +
  '.shuttle-widget-properties > a[data-tab="layout"][data-original-title*="Content style:"][data-original-title*="Widget style:"] .Icon {fill: #1872AC !important}'
  +
  '.selectize-control.single::after {content: attr(styleid); position: absolute; z-index: 2; right: 32px; top: 50%; transform: translateY(-50%); color: #143663;}'
  +
  '.selectize-control.single .selectize-input::after {right: 12px !important;}'
  +
  '.shuttle-Panel-header[styleid]::after {content: attr(styleid); position: absolute; right: 64px; top: calc( 50% + 0px); transform: translateY(-50%); color: #143663; font-weight: 600; font-size: 17px;}'
  +
  '.shuttle-Panel-header[styleid="NaN"]::after, .selectize-control.single[styleid="NaN"]::after {opacity: 0; pointer-events: none;}'
  +
  '.Tooltip-pro {transform: translateX( calc(-50% + 10px)) translateY(-100%);}'
  +
  '.preview-style.affected .ui-sortable-handle {opacity: .2 !important;}'
  +
  '.preview-style.affected tr[data-id]::after {content: attr(data-id); position: absolute; left: 0; transform: translateX(100%); margin-top: 10px; font-weight: 700; width: 25px; text-align: center; pointer-events: none; color: #666;}'
  +
  '.preview-style.affected .ui-sortable-helper::after {opacity: 0;}'
  +
  'label[for*="filterType"] + .Form-controls .Button--default {font-size: 14px;}'
  +
  '.shuttle-Panel--sub[style*="width: 440px"] .shuttle-Panel-inner[style*="bottom: 71px"] {top: 108px !important}'
  +
  '.style-finder-cont {position: absolute; transform: translateX(-100%); max-width: 380px;}'
  +
  '.style-finder-cont.push1 {margin-left: -50px}'
  +
  '.style-finder {min-width: 250px; padding: 5px 8px !important; margin-top: 1px !important; position: relative !important; background-color: #2B2E33 !important; border: 1px solid #4B5057 !important; color: #B8B8B8 !important;}'
  +
  '.Form-item[indent="1"] {margin-left: 36px; margin-top: 12px;}'
  +
  '.Form-item[indent="2"] {margin-left: 72px; margin-top: 12px;}'
  +
  '.style-finder-menu {border-radius: 5px; overflow: hidden; max-width: 380px;}'
  +
  '.style-finder-menu .finder-mem, .style-finder-menu .finder-search {max-height: 0; overflow: hidden; background: #222; border: 1px solid transparent; transition: max-height 200ms ease-in-out 0s, border 50ms linear 0s; overflow-y: auto}'
  +
  '.style-finder-menu ul {margin: 0 !important;}'
  +
  '.style-finder-menu .finder-mem, .style-finder-menu .finder-search {padding-top: 1px; margin-top: -2px;}'
  +
  '.style-finder-menu .finder-mem.on, .style-finder-menu .finder-search.on {max-height: 146px; border: 1px solid #40464B; transition: max-height 150ms ease-in-out 0s, border 50ms linear 0s;}'
  +
  '.style-finder-menu .style, .style-finder-menu .result {height: auto; width: 100%; display: inline-block; padding: 0px 4px; font-size: 15px; background: #222; color: #BEBEBE; transition: all 150ms ease-in-out 0s; cursor: pointer;}'
  +
  '.style-finder-menu .style:hover, .style-finder-menu .result:hover {background: #424242; transition: all 60ms ease-in-out 0s;}'
  +
  '.style-finder-menu .style.target, .style-finder-menu .result.target {background: #555; color: #FFF; transition: all 200ms ease-in-out 0s;}'
  +
  '.style-finder-menu .style.target:hover, .style-finder-menu .result.target:hover {background: #686868; transition: all 60ms ease-in-out 0s;}'
  +
  '.style-finder-menu .styleid {user-select: none;}'
  +
  '.style-finder-menu .stylename::before {content: none; opacity: 0; position: absolute; height: 32px; margin-top: -4px; border-left: 1px solid #919294; margin-left: -6px;}'
  +
  '.style-finder-menu .style-closer {float: right; height: 22px; width: auto; font-size: 18px;}'
  +
  '.style-finder-menu .style-closer::after {content: "x"; font-weight: 800; text-align: right; position: relative; top: -4px; transition: all 100ms ease-in-out 0s; min-width: 22px; display: block; z-index: 5; position: relative; text-align: right;}'
  +
  '.style-finder-menu .style-closer:hover::after {color: #FFF; transition: all 100ms ease-in-out 0s;}'
  +
  '.style-finder-menu .style.del .style-closer::after, .style-finder-menu .result.del .style-closer::after {content: "Delete"; font-size: 15px; top: 0;}'
  +
  '.style-finder-menu .finder-mem.on .stylename::before {opacity: 1}'
  +
  '.style-finder-menu .stylename {margin-left: 6px; border-left: 1px solid #919294; padding: 2px 0 2px 6px; user-select: none;}'
  +
  '.style-finder-menu .finder-cache {height: auto; max-height: 0; background: #2b2e33; border-top: 0px solid #2B2E33; padding: 0px 6px; box-sizing: content-box; text-align: right; overflow: hidden; transition: all 200ms ease-in-out 0s;}'
  +
  '.style-finder-menu .finder-cache.on {max-height: 146px; padding: 2px 6px 6px; border-top: 1px solid #2B2E33; transition: all 200ms ease-in-out 0s;}'
  +
  '.style-finder-menu .button-cache {padding: 4px 8px; background: #359FE3; border-radius: 3px; float: right; margin-top: 5px; transition: all 50ms ease-in-out 0s;}'
  +
  '.style-finder-menu .button-cache:hover {background: #52B2F0; transition: all 50ms ease-in-out 0s;}'
  +
  '.style-finder-menu .button-cache:active {background: #218ACD; transition: all 50ms ease-in-out 0s;}'
  +
  '.style-finder-menu .button-cache.on svg {height: 16px; width: 16px; fill: #FFF; margin-top: -3px; animation: spinner 500ms linear 0s infinite;}'
  +
  '.style-finder-menu .finder-cache {overflow-y: scroll;}'
  +
  '.style-finder-menu .finder-cache .style {text-align: left;}'
  +
  '.style-finder.tall + .style-finder-menu > div.on {max-height: 366px;}'
  +
  '.style-finder-menu .button-cache:not(.avail) {filter: grayscale(1); cursor: not-allowed; opacity: .8;}'
  +
  '.style-finder-menu .cacher {opacity: 0; max-height: 0; max-width: 0; overflow: hidden; pointer-events: none;}'
  +
  '.cache-toggler-cont {position: absolute; top: 4px; right: 6px; z-index: 2; height: 28px; width: 24px; cursor: pointer;}'
  +
  '.cache-toggler {display: block; z-index: 200; height: 14px; width: 14px; top: 7px; position: relative; margin: 0 auto; pointer-events: none; background: url("https://shuttle-storage.s3.amazonaws.com/glenn/ShuttlePro/CaretDouble.svg"); background-repeat: no-repeat; background-position: center center;}'
  +
  '.mem-toggler-cont {position: absolute; top: 4px; right: 28px; z-index: 2; height: 28px; width: 24px; cursor: pointer;}'
  +
  '.mem-toggler {display: block; z-index: 200; height: 14px; width: 14px; top: 7px; position: relative; margin: 0 auto; pointer-events: none; background: url("https://shuttle-storage.s3.amazonaws.com/glenn/ShuttlePro/CaretSingle.svg"); background-repeat: no-repeat; background-position: center center;}'
  +
  '.finder-search::before {content: "Results (" attr(results) "):"; font-size: 15px; padding: 2px 5px; border-bottom: 1px solid #666; display: block; width: 100%; background: #2b2e33;}'
  +
  '.finder-cache::before {content: "All styles (" attr(all) "):"; font-size: 15px; padding: 2px 5px; border-bottom: 1px solid #666; display: block; width: 100%; background: #2b2e33; text-align: left;}'
  +
  '.shuttle-Panel-inner.loading::before {content: ""; position: absolute; top: 0; left: 0; height: 100%; width: 100%; background: #222528; z-index: 5;}'
  +
  '.shuttle-Panel-inner.loading::after {content: "\f110"; position: absolute; left: 50%; top: 50%; transform: translateY(-50%) translateX(-50%); font-size: 22px; color: #FFF; z-index: 5; font: normal 600 32px/1 Font Awesome\ 5 Pro; animation: spinner 500ms linear 0s infinite;}'
  +
  '.no-float {float: unset !important}'
  +
  '.doc-text {margin-top: 10px; max-width: 720px; width: 60vw !important;}'
  +
  ".doc-text code {background: #444445; padding: 4px 6px; border: 1px solid #537488; border-radius: 4px; margin: 0 3px;}"
  +
  ".doc-text code em {color: #77c3f4; font-weight: 600;}"
  +
  ".switchery {background-color: #E2E2E2;}"
  +
  ".switchery.on {background-color: #359FE3 !important; border-color: #5ca1e8 !important;}"
  +
  ".animatable {transition: all 200ms ease-in-out 0s;}"
  +
  ".switchery.on small {margin-left: 20px;}"
  +
  ".Form-help-icon svg {height: 18px; width: 20px;}"
  /*+
  '.Arrange-sizeFill {z-index: 10200 !important; position: relative}'*/
);
Dark(
  'body {background: #222528 !important;}'
  +
	'body, .Table--actions thead th a, .selectize-control {color: #E2E2E2 !important}'
  +
  '::selection {background-color: #359fe3; color: #0F1115;}'
  +
  '.shuttle-Panels, #element_container {background: #222528 !important;}'
  +
  '.shuttle-Panel {background: #222528 !important; scrollbar-color: #666 #2b2e33 !important;}'
  +
  '.style-finder-menu {scrollbar-color: #666 #2b2e33 !important;}'
  +
  '.shuttle-Panel--subNav, .TokenDropdown li {background-color: #2b2E33 !important;}'
  +
  '.shuttle-Panel-header {background-color: #2B2E33 !important; border-bottom: 1px solid #1B1E20 !important;}'
  +
  '.shuttle-Panel > .Form-item--actions {background-color: #2B2E33 !important; border-top: 1px solid #1B1E20 !important;}'
  +
  '.shuttle-page {border: 3px solid #666 !important;}'
  +
  '.PanelNav-itemTarget {color: #77c3f4 !important;}'
  +
  '.PanelNav-itemTarget .Icon svg {fill: #77c3f4;}'
  +
  '.PanelNav-itemTarget.is-selected {color: #4192EC !important;}' /* #3A93F6 */
  +
  '.PanelNav-itemTarget.is-selected .Icon svg, .PanelNav-itemTarget:hover .Icon svg {fill: #4192EC !important;}'
  +
  '.PanelNav .Button .Icon svg {fill: #E9E9E9 !important;}'
  +
  'body a:active, body a:focus, body a:hover {color: #73c0f9;}'
  +
  '.selectize-dropdown {background: #222528 !important;}'
  +
  '.selectize-dropdown .optgroup-header, .selectize-dropdown [data-selectable] {background: #2B2E33 !important; color: #D5D5D5 !important;}'
  +
  '.selectize-input, input[type="date"], input[type="email"], input[type="number"], input[type="password"], input[type="search"], input[type="text"], textarea {color: #E2E2E2 !important; background-color: #2B2E33 !important; border: 1px solid #5B6268;}'
  +
  '.selectize-dropdown .selected, .TokenDropdown li.is-selected {background-color: #0f2E57 !important;}'
  +
  '.selectize-control.single .selectize-input::after {border-color: #5B6268 transparent transparent !important;}'
  +
  '.selectize-dropdown-content .active {background: #454545 !important; color: #E9E9E9 !important;}'
  +
  '.selectize-dropdown .optgroup {border-top: 1px solid #666 !important;}'
  +
  '.selectize-input.dropdown-active::before {background: #666 !important;}'
  +
  '.Table--actions tbody, .SiteList-image {background: #2B2E33 !important;}'
  +
  '.Table--actions tbody tr td {border-top: 1px solid #5B6268 !important;}'
  +
  '.Table--actions tbody tr.ui-sortable-helper td, .Table--actions tbody tr:last-child td {border-bottom: 1px solid #5B6268 !important;}'
  +
  '.Table--actions tbody tr td:last-child {border-right: 1px solid #5B6268 !important;}'
  +
  '.Table--actions tbody tr td:first-child, .Pagination-item + .Pagination-item {border-left: 1px solid #5B6268 !important;}'
  +
  '.Table--actions tbody tr.is-selected td {border-bottom: 1px solid #359fe3 !important; border-color: #225198 !important; background: #143663 !important;}'
  +
  '.Table--actions tbody tr.is-selected:hover td {border-bottom: 1px solid #359fe3 !important; border-color: #225198 !important; background: #143663 !important; filter: brightness(1.15);}'
  +
  '.Table--actions .is-disabled td {color: #666 !important;}'
  +
  '.shuttle-block-title-col {background: #666 !important;}'
  +
  '.shuttle-block-title:hover > div {background: #393C42 !important;}'
  +
  '.shuttle-widget, .TokenDropdown {background: #2B2E33 !important; border: 1px solid #5B6268 !important;}'
  +
  '.shuttle-widget:hover, .Table--actions tbody tr:hover td {border-top: 1px solid #888 !important; background: #323435 !important; border-bottom: 1px solid #888 !important;}'
  +
  '.shuttle-widget.selected, .Drop-menu-itemTarget.is-selected {background: #143663 !important; border-color: #2B6BCC !important;}'
  +
  '.shuttle-widget .shuttle-widget-properties a .Icon, .Drop-menu-itemTarget .Icon {fill: #E9E9E9 !important;}'
  +
  '.shuttle-widget-icon .Icon, .Button--default > .Icon > svg, div[data-original-title="Row settings"] svg {fill: #E9E9E9 !important;}'
  +
  '.shuttle-widget img.shuttle-widget-thumbnail[src*="/thumbnails/"], .shuttle-widget img.shuttle-widget-thumbnail[src*="/assets/img/"], .Table tr[data-id] > td > img[onerror], .shuttle-widget-icon svg {filter: brightness(2.4);}'
  +
  '.shuttle-widget.selected:hover, .Drop-menu-itemTarget.is-selected:hover {filter: brightness(1.15) !important;}'
  +
  '.TokenDropdown ul li.is-system {border-top: 1px solid #666 !important;}'
  +
  'svg.svg-DeleteAlt, .Close > .Icon {fill: #FFF !important; opacity: 1 !important;}'
  +
  '.Button--default, .Pagination-wrapItems {color: #D9D9D9 !important; background-color: #143663 !important; border-color: #225198 !important;}'
  +
  '.Button--default.is-active, .Button--default.is-focused, .Button--default.is-hovered, .Button--default:active, .Button--default:focus, .Button--default:hover {border-color: #AAA !important; background: #323435 !important;}'
  +
  '.Form-controls #criteria_segment_id > div[style]:nth-of-type(2n+1), #criteria > div[class*="js"], .shuttle-EntryAssets .FieldGroup-field, #conditions > div[style]:nth-of-type(2n+1), .TreeScroller + #criteria > div:nth-of-type(2n+1), div[id^="criteria"] > div[style]:nth-of-type(2n+1) {border: 1px solid #225198 !important; background: #283141 none repeat scroll 0% 0% !important;}'
  +
  '.FieldGroup .FieldGroup-button:hover {filter: brightness(1.15);}'
  +
  '.SiteList .SiteList-url a {opacity: 1 !important; color: #D5D5D5 !important;}'
  +
  '.SiteList-image {border: 1px solid #666 !important;}'
  +
  'img#logo {opacity: .25 !important;}'
  +
  '#Level_down, .shuttle-col div[class*="Spinner"] * {fill: #FFF !important;}'
  +
  '.Pagination-itemTarget {color: #D5D5D5 !important;}'
  +
  '.Pagination-itemTarget.is-disabled {background-color: #2b2e33 !important; color: #D5D5D5 !important;}'
  +
  '.shuttle-col-splitter-inner {background: #666 !important;}'
  +
  '.switchery[style*="rgb(91, 183, 83)"] {background-color: #359FE3 !important; border-color: #5ca1e8 !important; box-shadow: #359fe3 0px 0px 0px 15.5px inset !important;}'
  +
  '.switchery[style="box-shadow: rgb(91, 183, 83) 0px 0px 0px 15.5px inset; border-color: rgb(91, 183, 83); background-color: rgb(91, 183, 83); transition: border 0.4s ease 0s, box-shadow 0.4s ease 0s, background-color 1.2s ease 0s;"] {background-color: #359FE3 !important; border-color: #5ca1e8 !important; box-shadow: #359fe3 0px 0px 0px 15.5px inset !important;}'
  +
  '.switchery[style="box-shadow: rgb(223, 223, 223) 0px 0px 0px 0px inset; border-color: rgb(223, 223, 223); background-color: rgb(255, 255, 255); transition: border 0.4s ease 0s, box-shadow 0.4s ease 0s;"] {background: #373c44 !important; border: 1px solid #747a80 !important;}'
  +
  '.switchery[style="background-color: rgb(255, 255, 255); border-color: rgb(223, 223, 223); box-shadow: rgb(223, 223, 223) 0px 0px 0px 0px inset; transition: border 0.4s ease 0s, box-shadow 0.4s ease 0s;"] {background: #373c44 !important; border: 1px solid #747a80 !important;}'
  +
  '.switchery small {background: #E9E9E9 !important;}'
  +
  '.shuttle-Panel-inner .TreeScroller {border: 1px solid #43484e !important; background: #2b2e33 !important;}'
  +
  '.shuttle-Tree--dark .is-selected .shuttle-Tree-title {color: #D5D5D5 !important;}'
  +
  '.shuttle-Tree-level {filter: brightness(2.4);}'
  +
  '.shuttle-Panel--subNav #tree .shuttle-Tree-level {filter: brightness(1) !important;}'
  +
  '.shuttle-Tree--dark .shuttle-Tree-title {color: #D5D5D5 !important;}'
  +
  '.cke_top {background-image: linear-gradient(to bottom,#CFCFCF,#F5F5F5) !important; filter: invert(0.92) !important;}'
  +
  '.cke_chrome {border: 1px solid #626771 !important;}'
  +
  '.shuttle-widget .shuttle-widget-properties a.is-disabled {opacity: 0.3 !important;}'
  +
  '.FormSlider-slider {background: #666 !important; border: 12px solid #222528 !important;}'
  +
  '.Drop-menu {background-color: #2b2e33 !important; border: 1px solid #666 !important;}'
  +
  '.Drop-menu a {color: #D5D5D5 !important;}'
  +
  '.Drop-menu-itemTarget:focus, .Drop-menu-itemTarget:hover {background: #143663 !important;}'
  +
  '.Table--actions .Icon--check svg {fill: #359fe3 !important;}'
  +
  '.shuttle-Panel--login .shuttle-Panel-inner {background: #393939 !important;}'
  +
  '.Drop-menu-item--divider {background-color: #666 !important;}'
  +
  '.cke_reset.cke_inner {opacity: .8;}'
  +
  '.cke_button:hover {filter: brightness(0.85) !important;}'
  +
  'label[for="settings[backgroundPosition]"] + .Form-controls .FieldGroup-button button, label[for="settings[watermark][position]"] + .Form-controls .FieldGroup-button button {border: 0px !important;}'
  +
  '.ace_scrollbar-inner {background: #FFF !important;}'
  +
  '.ace_scrollbar-h, .ace_scrollbar-v {filter: invert(0.85);}'
  +
  '.Style-title {background: #2B2E33 !important; border-top: 1px solid #666 !important;}'
  +
  '.Style-title#title_name {border-top: none !important;}'
  +
  '.Style-title.Style-title--last, .Style-title.Style-title--open {border-bottom: #666 !important;}'
  +
  '.Style-title:hover {background: #143663 !important; color: #E9E9E9 !important;}'
  +
  '.js-preview {color: #E9E9E9 !important;}'
  +
  '#element_container > div:not(.js-preview) {color: #E9E9E9 !important; font-size: 12px !important;}'
  +
  '.Progress {background: #2B2E33 !important;}'
  +
  '.Alert--default {color: #D5D5D5 !important; background-color: #2b2e33 !important; border-color: #666 !important;}'
  +
  '.shuttle-block-empty.shuttle-block-empty-hover .shuttle-block-inner {background: #333 !important;}'
  +
  '.ace-monokai .ace_marker-layer .ace_bracket {border: 1px solid #C8BC45 !important;}'
  +
  '.cke_dialog_background_cover {background-color: #000 !important;}'
  +
  '.Alert--danger {color: #359fe3; background-color: #2b2e33; border-color: #359FE3;}'
  +
  '.Form-controls input::placeholder {color: #CCC !important; opacity: 1 !important;}'
  +
  '.shuttle-ImportData-column {border-color: #25406c !important; background: #283141 !important;}'
  +
  '.ace_search {background-color: #222528 !important; border-bottom: 1px solid #919294 !important; border-left: 1px solid #919294 !important;}'
  +
  '.ace_search_field {background-color: #272822 !important; color: #CCC;}'
  +
  '.ace_searchbtn, .ace_replacebtn {filter: invert(.9);}'
  +
  '.ace_button {color: #CCC !important; background: #242424 !important; border: 1px solid #7B7B7B !important;}'
  +
  '.ace_button:hover {opacity: .7;}'
  +
  'table + div[style="float:right;"] + .Pagination {position: fixed; bottom: 14px;}'
  +
  '.shuttle-Panel--sub .shuttle-Panel-inner table + div[style="float:right;"] + .Pagination {bottom: 88px !important;}'
  +
  '.Table--actions tbody tr.system td {background: #232528 !important;}'
  +
  '.shuttle-ImportData-column ul li.is-title {font-weight: 700; white-space: pre-wrap; text-overflow: inherit; overflow: visible; word-break: break-word;}'
  +
  '.dashboard-container {background: #2B2E33 !important;}'
  +
  '.multiselect__tags {background-color: #1872AC !important; border-color: #12547F !important;}'
  +
  '.multiselect__input, .multiselect__single {background-color: #1872AC !important; color: #E2E2E2 !important}'
  +
  '.multiselect__content {background: #1C1C1C !important; border: 1px solid #343434 !important; color: #E2E2E2 !important}'
  +
  '.multiselect__option--selected {background: #25404D !important; color: #EDEDED !important;}'
  +
  '.topProduct, .topCustomer, .topCountry {background: rgba(0, 112, 255, 0.11) !important; border-bottom: solid #1C1C1C 1px !important; border-top: solid #2B2E33 5px !important; transition: all 150ms ease-in-out 0s;}'
  +
  '.topProduct:hover, .topCustomer:hover, .topCountry:hover {transition: all 150ms ease-in-out 0s; background: rgba(20, 123, 254, 0.28) !important}'
  +
  '#pie-chart {position: relative; z-index: 2 filter: brightness(1.1);}'
  +
  '#line-chart {filter: brightness(1.5);}'
  +
  '.pieChartContainer::before {content: ""; height: 80px; width: 340px; position: absolute; margin: 5px 15px 0 50px; left: 0; background: linear-gradient(to bottom, #FFF 0%, #FFF 50%, transparent 100%); z-index: 0; filter: blur(1px);}'
  +
  '.shuttle-widget-properties > a[data-tab="layout"][data-original-title*="Content style:"] .Icon, .shuttle-widget-properties > a[data-tab="dynamic"][data-original-title="Field"] .Icon {#2C85E2 !important}'
  +
  '.shuttle-widget-properties > a[data-tab="layout"][data-original-title*="Content style:"][data-original-title*="Widget style:"] .Icon {fill: #8DD7FB !important}'
  +
  '.selectize-control.single::after {color: #4192EC;}'
  +
  '.shuttle-Panel-header[styleid]::after {color: #359FE3}'
  +
  '.preview-style.affected tr[data-id]::after {color: #359FE3;}'
  +
  '.style-finder-cont .style-finder {color: #b3b5b7 !important;}'
);
}