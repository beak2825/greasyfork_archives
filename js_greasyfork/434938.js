//
// Written by Glenn Wiking
// Script Version: 0.2.45
//
//
// ==UserScript==
// @name        Shuttle SEO Master
// @namespace   SSM
// @description Adds automatic h1, h2 and h3 tag conversion from custom styles in Shuttle Data WYSIWYG-editors
// @version     0.2.45
// @icon        https://dlw0tascjxd4x.cloudfront.net/assets/img/symbol.svg
// @license			MIT

// @include     *.shuttle.be/admin/*
// @include			*app.shuttle.be/*
// @require			https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js 
// @require			https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js


// @downloadURL https://update.greasyfork.org/scripts/434938/Shuttle%20SEO%20Master.user.js
// @updateURL https://update.greasyfork.org/scripts/434938/Shuttle%20SEO%20Master.meta.js
// ==/UserScript==

$(window).on("load", function() {
  // Documentation
  let documentation =
  "<p>SEO Master is a tool that lets you more easily control <strong>SEO essentials</strong> within Shuttle. Its features are documented in more detail below.</p>"
  +
  "<p>The primary feature of SEO Master is the <strong>SEO button</strong>. When enabled, this button will appear in a WYSIWYG editors throughout Shuttle. Its behavior can be mapped in settings.</p>"
  +
  "<p>You can also map this behavior to selecting an item from the Styles dropdown menu.</p>"
  +
  "<br><p><img src='https://shuttle-storage.s3.amazonaws.com/addons/Flavor/SEO-Button-Doc1.png'></p>"
  +
  "<p>It's also possible to disable the SEO button, in which case the mapped behavior will be automatically applied to all WYSIWYG fields when a data entry or text editor in pages is opened. If you want per-context control, the SEO button is what you're after.</p>"
  +
  "<p>Currently supported features:</p>"
  +
	"<ul>"
  +
  "<li>Replacing <code>span.custom-style-h<em>x</em></code> with <code>h<em>x</em>.custom-style-h<em>x</em></code> in the current editor.</li>"
  +
  "</ul>"
  +
  "<br>"
  +
  "<p>More features coming soon!</p>"
  
  
  // Apply CKE
  function apply(cke) {
  	console.log( cke );
		cke.addClass("affected");
    
    // Appearance
    cke.find(".cke_top").append("<span id='cke_seo' class='cke_toolbar' role='toolbar'></span>");
    cke.find("#cke_seo").append("<span class='cke_toolbar_start'></span><span class='cke_toolgroup hidden'></span><span class='cke_toolbar_end'></span>");
    cke.find("#cke_seo .cke_toolgroup").append("<a id='cke_seo_button' class='cke_button cke_button_seo cke_button_off' title='SEO' tabindex='-1' hideonfocus='true' role='button' onkeypress='return false;'></a>");
    cke.find("#cke_seo_button").append("<span class='cke_button_icon cke_button__seo_icon'></span>");
    cke.find("#cke_seo_button").append("<span class='cke_button_label cke_button__seo_label'></span>");
    cke.find(".cke_button__seo_label").text("SEO");
    
    if ( localStorage.getItem("SEO-button-active") == null ) {
      localStorage.setItem("SEO-button-active", true);
    } else {
    	if ( localStorage.getItem("SEO-button-active") == "true" ) {
      	$(".cke_button_seo").parent().removeClass("hidden");
      }
    }
    
    console.log( "GG" );
    // Headings Clean (SEO Button)
    function clean() {
      cke.find(".cke_wysiwyg_frame").contents().find("span[class^='custom-style-h']").each( function() {
        let classes = $(this).attr("class").split(" ");
        let h;
        let content;
        for ( i = 0; i < classes.length; i++ ) {
          console.log( classes[i] );
          if ( classes[i].includes("custom-style-h") ) {
            h = classes[i].replace("custom-style-h","");
            content = $(this).html();
          }
        }
        //$(this).parent().prepend("<h"+ h +" class='" + classes.toString().replace(/,/g," ") + "'>"+ content +"</h"+ h +">");
        $(this).parent("p").before("<h"+ h +" class='" + classes.toString().replace(/,/g," ") + "'>"+ content +"</h"+ h +">");
        //$(this).addClass("gg");
        console.log( classes.toString().replace(/,/g," ") );
        console.log( $(this).parent() );
        $(this).parent("p").remove();
      });
    }
    if ( localStorage.getItem("SEO-button-active") != null ) { 
    	if ( localStorage.getItem("SEO-button-active") == "false" ) { clean(); };
    };
    console.log("G");
    cke.find("#cke_seo_button").on("click", clean);
    cke.find(".cke_toolbar a.cke_combo_button[aria-haspopup]").on("click", function() {
     	cke.addClass("style-open");
    	console.log("Styles");
      
    });
  };
  /*let applyOnStyles = setInterval( function() {
    $(".cke_combopanel[style*='z-index: 10001']").on("click", function() {
      if ( localStorage.getItem("SEO-style-apply-active") != null ) { 
        if ( localStorage.getItem("SEO-style-apply-active") == "false" ) {
          setTimeout( function() {
            clean();
          }, 200);
        };
      };
    });
    $(".cke_combopanel[style*='z-index: 10001']").attr("g","gg");
    $("[g]").on("click", function() {
    	console.log("GGG");
    });
    if ( $(".cke_combopanel[style*='z-index: 10001'].affected").length == 1 ) { clearInterval(applyOnStyles) }
   	console.log( $(".cke_combopanel[style*='z-index: 10001']:not(.affected)") );
    //$(".cke_combopanel[style*='z-index: 10001']").addClass("affected");
  }, 500);*/
  
  // Apply Settings
  let iconCog = "<svg viewBox='410.9 287.6 20 20'><path d='M429,297.6c0-1.2,0.8-2.2,1.9-2.9c-0.2-0.7-0.5-1.4-0.8-2c-1.3,0.3-2.3-0.2-3.2-1.1c-0.9-0.9-1.2-1.9-0.8-3.2c-0.6-0.3-1.3-0.6-2-0.8c-0.7,1.2-1.9,1.9-3.1,1.9 c-1.2,0-2.5-0.8-3.1-1.9c-0.7,0.2-1.4,0.5-2,0.8c0.3,1.3,0.1,2.3-0.8,3.2 c-0.9,0.9-1.9,1.4-3.2,1.1c-0.3,0.6-0.6,1.3-0.8,2c1.2,0.7,1.9,1.7,1.9,2.9c0,1.2-0.8,2.5-1.9,3.1c0.2,0.7,0.5,1.4,0.8,2 c1.3-0.3,2.3-0.1,3.2,0.8c0.9,0.9,1.2,1.9,0.8,3.2c0.6,0.3,1.3,0.6,2,0.8c0.7-1.2,1.9-1.9,3.1-1.9c1.2,0,2.5,0.8,3.1,1.9 c0.7-0.2,1.4-0.5,2-0.8c-0.3-1.3-0.1-2.3,0.8-3.2c0.9-0.9,1.9-1.4,3.2-1.1c0.3-0.6,0.6-1.3,0.8-2C429.8,299.9,429,298.9,429,297.6z M420.9,302c-2.4,0-4.3-1.9-4.3-4.3c0-2.4,1.9-4.3,4.3-4.3c2.4,0,4.3,1.9,4.3,4.3C425.3,300,423.3,302,420.9,302z'></path></svg>"
  let iconLog = "<svg viewBox='0 0 20 20'><g><path d='M16.3,8.6H8c-0.8,0-0.9,0.6-0.9,1.4s0.1,1.4,0.9,1.4h8.3c0.8,0,0.9-0.6,0.9-1.4S17.1,8.6,16.3,8.6z M19.1,15.7H8 c-0.8,0-0.9,0.6-0.9,1.4s0.1,1.4,0.9,1.4h11.1c0.8,0,0.9-0.6,0.9-1.4S19.9,15.7,19.1,15.7z M8,4.3h11.1c0.8,0,0.9-0.6,0.9-1.4 s-0.1-1.4-0.9-1.4H8c-0.8,0-0.9,0.6-0.9,1.4S7.2,4.3,8,4.3z M3.4,8.6H0.9C0.1,8.6,0,9.2,0,10s0.1,1.4,0.9,1.4h2.6 c0.8,0,0.9-0.6,0.9-1.4S4.2,8.6,3.4,8.6z M3.4,15.7H0.9c-0.8,0-0.9,0.6-0.9,1.4s0.1,1.4,0.9,1.4h2.6c0.8,0,0.9-0.6,0.9-1.4 S4.2,15.7,3.4,15.7z M3.4,1.4H0.9C0.1,1.4,0,2.1,0,2.9s0.1,1.4,0.9,1.4h2.6c0.8,0,0.9-0.6,0.9-1.4S4.2,1.4,3.4,1.4z'></path></g></svg>"
  let iconPage = "<svg viewBox='0 0 384 512'><path d='M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm64 236c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-64c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-72v8c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm96-114.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z'/></svg>"
  let iconImport = "<svg viewBox='0 0 20 20'><path d='M15,7h-3V1H8v6H5l5,5L15,7z M19.338,13.532c-0.21-0.224-1.611-1.723-2.011-2.114C17.062,11.159,16.683,11,16.285,11h-1.757 l3.064,2.994h-3.544c-0.102,0-0.194,0.052-0.24,0.133L12.992,16H7.008l-0.816-1.873c-0.046-0.081-0.139-0.133-0.24-0.133H2.408 L5.471,11H3.715c-0.397,0-0.776,0.159-1.042,0.418c-0.4,0.392-1.801,1.891-2.011,2.114c-0.489,0.521-0.758,0.936-0.63,1.449 l0.561,3.074c0.128,0.514,0.691,0.936,1.252,0.936h16.312c0.561,0,1.124-0.422,1.252-0.936l0.561-3.074 C20.096,14.468,19.828,14.053,19.338,13.532z'></path></svg>"
  let iconHelp = "<svg x='0px' y='0px' viewBox='0 0 20 20' xml:space='preserve'><g><path d='M19,10c0,5-4,9-9,9c-5,0-9-4-9-9c0-5,4-9,9-9C15,1,19,5,19,10z M14.1,7.4c0-2.2-1.9-3.8-4.1-3.8c-2.2,0-3.8,1.9-3.8,1.9 L7.8,7c0,0,1.1-1.1,2.2-1.1s1.9,0.8,1.9,1.5c0,1.5-3,1.5-3,3.8v0.7h2.3v-0.4C11.1,10.4,14.1,10.4,14.1,7.4z M11.5,15.3 c0-0.8-0.7-1.5-1.5-1.5s-1.5,0.7-1.5,1.5c0,0.8,0.7,1.5,1.5,1.5S11.5,16.1,11.5,15.3z'></path></g></svg>";
  function settings() {
 		let panel = $("a[data-active-id='cookies']").closest(".shuttle-Panel-inner");
    panel.append("<div class='shuttle-SubNav shuttle-SubNav--alt heading-addons'></div>");
    panel.find(".heading-addons").append("<div class='shuttle-SubNav-title'>Add-ons</div>");
    panel.find(".heading-addons").append("<ul class='shuttle-SubNav-wrapItems Nav Nav--stacked'></ul>");
  }
  function settingsSEO() {
   	let panel = $("a[data-active-id='cookies']").closest(".shuttle-Panel-inner");
    let menuItems = [];
    menuItems.push({"label":"Settings", "icon":iconCog}, {"label":"Documentation", "icon":iconPage}, {"label":"Changelog", "icon":iconLog}, {"label":"Import/export Settings", "icon":iconImport});
  	$(".heading-addons ul").append("<li class='shuttle-SubNav-item'><a class='shuttle-SubNav-itemTarget settings-seo' href=''><div class='Icon'></div>SEO Master</a></li>");
    $(".heading-addons .settings-seo .Icon").append( iconCog );
    $(".settings-seo").on("click", function() {
    	if ( $(".panel-seo").length == 0 ) {
        $(".shuttle-Panel--mainNav").nextAll(".shuttle-Panels:visible").append("<div class='shuttle-Panels shuttle-Panels--nested panel-seo' style='margin-left: 250px; top: 0px;'></div>")
        $(".panel-seo").append("<div class='shuttle-Panel shuttle-Panel--withTabs'></div>");
        $(".panel-seo > .shuttle-Panel").append("<div class='shuttle-Panel-inner' style='top: 115px; bottom: 0px;'></div>");
        $(".panel-seo > .shuttle-Panel").append("<div class='shuttle-Panel-header'></div>");
      } else {
      	$(".panel-seo").parent().find("> .shuttle-Panels--nested:not(.panel-seo)").hide();
      }
      
      // Open Settings
      panel.find(".is-selected:visible").removeClass("is-selected");
      $(this).addClass("is-selected");
      // Fill with Appliccable Settings
      if ( $(".panel-seo.affected").length == 0 ) {
        $(".panel-seo .shuttle-Panel-header").append("<div class='shuttle-Panel-title u-textTruncate'>SEO Master</div>");
        $(".panel-seo .shuttle-Panel-header").append("<div class='shuttle-Panel-toolbar'></div>");
        $(".panel-seo .shuttle-Panel-header").append("<ul class='PanelNav Nav'></ul>");
        for ( i = 0; i < menuItems.length; i++ ) {
          let menuLabel = menuItems[i].label;
          let menuIcon = menuItems[i].icon;
          $(".panel-seo .shuttle-Panel-header ul").append("<li class='PanelNav-item'><a class='PanelNav-itemTarget' href='' data-tab='"+ menuLabel +"'><div class='Icon'>" + menuIcon + "</div>"+ menuLabel +"</a></li>");
        }
        $(".panel-seo .shuttle-Panel-header ul a").on("click", function(e) {
					e.preventDefault();
       		$(".panel-seo .shuttle-Panel-header ul a").removeClass("is-selected");
          $(this).addClass("is-selected");
        });
    		
        $(".panel-seo").addClass("affected");
      }
      // Settings Menus
      $(".PanelNav-itemTarget").on("click", function() {
      	let which = $(this).attr("data-tab");
        function addPanel() { // Clean up and Add Panel
          $(".panel-seo .shuttle-SEO, .panel-seo .Form-item--actions").remove();
          $(".panel-seo .shuttle-Panel-inner").append("<div class='shuttle-SEO'></div>");
        };
        console.log(which);
        
        // Settings
        if ( which == "Settings" ) {
        	addPanel();
         	$(".shuttle-SEO").parent().parent().append("<div class='Form-item Form-item--actions'><div class='Form-controls'><input class='Button Button--primary' type='submit' value='Save'></div></div>");
          
          // Show SEO Button
          $(".shuttle-SEO").append("<div class='Form-item'><label for='seo-button-toggler' class='Form-label'>Show SEO Button</label> <div class='Form-controls'> <span class='switchery switchery-default seo-button-toggler'><small></small></span> </div> </div>");
          $(".shuttle-SEO label[for='seo-button-toggler']").append( "<span class='Form-help-icon' data-toggle='tooltip' data-original-title='Disabling the SEO Button will cause the selected behavior to apply automatically to all open WYSIWYG-editors'></span>" );
          $(".shuttle-SEO label[for='seo-button-toggler'] .Form-help-icon").append( iconHelp );
          
          $(".shuttle-SEO .seo-button-toggler").on("click", function() {
          	$(this).toggleClass("on");
            if ( $(this).hasClass("on") ) {
            	localStorage.setItem("SEO-button-active",true);
            } else {
              localStorage.setItem("SEO-button-active",false);
            }
          });
          
          if ( localStorage.getItem("SEO-button-active") == null ) {
            localStorage.setItem("SEO-button-active", true);
          } else {
            if ( localStorage.getItem("SEO-button-active") == "true" ) {
              $(".seo-button-toggler").addClass("on");
            }
          };
          // Apply on Style Change Button
          $(".shuttle-SEO").append("<div class='Form-item'><label for='seo-style-apply-toggler' class='Form-label'>Apply on style choice</label> <div class='Form-controls'> <span class='switchery switchery-default seo-style-apply-toggler'><small></small></span> </div> </div>");
          $(".shuttle-SEO label[for='seo-style-apply-toggler']").append( "<span class='Form-help-icon' data-toggle='tooltip' data-original-title='Immediately applies the selected feature to all appropriate elements in the open editor when selecting a Header style from the Styles dropdown'></span>" );
          $(".shuttle-SEO label[for='seo-style-apply-toggler'] .Form-help-icon").append( iconHelp );
          
          $(".shuttle-SEO .seo-style-apply-toggler").on("click", function() {
          	$(this).toggleClass("on");
            if ( $(this).hasClass("on") ) {
            	localStorage.setItem("SEO-style-apply-active",true);
            } else {
              localStorage.setItem("SEO-style-apply-active",false);
            }
          });
          
          if ( localStorage.getItem("SEO-style-apply-active") == null ) {
            localStorage.setItem("SEO-apply-active-active", true);
          } else {
            if ( localStorage.getItem("SEO-style-apply-active") == "true" ) {
              $(".seo-style-apply-toggler").addClass("on");
            }
          };
          // Enable character limit visualizer
          $(".shuttle-SEO").append("<div class='Form-item'><label for='seo-limit-toggler' class='Form-label'>Enable character limit visualizer</label> <div class='Form-controls'> <span class='switchery switchery-default seo-limit-toggler'><small></small></span> </div> </div>");
          $(".shuttle-SEO label[for='seo-limit-toggler']").append( "<span class='Form-help-icon' data-toggle='tooltip' data-original-title='Shows character limits in a number of relevant input and textarea elements'></span>" );
          $(".shuttle-SEO label[for='seo-limit-toggler'] .Form-help-icon").append( iconHelp );
          
          $(".shuttle-SEO .seo-limit-toggler").on("click", function() {
          	$(this).toggleClass("on");
            if ( $(this).hasClass("on") ) {
            	localStorage.setItem("SEO-limit-active",true);
            } else {
              localStorage.setItem("SEO-limit-active",false);
            }
          });
          
          if ( localStorage.getItem("SEO-limit-active") == null ) {
            localStorage.setItem("SEO-limit-active", true);
          } else {
            if ( localStorage.getItem("SEO-limit-active") == "true" ) {
              $(".seo-limit-toggler").addClass("on");
            }
          };
          
          $(".shuttle-SEO .Form-help-icon").on("mouseenter", function() {
            let tooltipContent = $(this).attr("data-original-title");
            let oTop = $(this).offset().top;
            let oLeft = $(this).offset().left;
          	$("body").append("<div class='Tooltip fade in Tooltip--top Tooltip-seo'> <div class='Tooltip-item'>"+ tooltipContent +"</div> </div>");
            $(".Tooltip-seo").css({"top": oTop, "left": oLeft});
          });
          $(".shuttle-SEO .Form-help-icon").on("mouseleave", function() {
          	$(".Tooltip").remove();
          });
          $(".shuttle-SEO .switchery, .shuttle-SEO .switchery small").addClass("animatable");
          
        }
        // Documentation
        if ( which == "Documentation" ) {
       		addPanel();
          $(".shuttle-SEO").append("<div class='shuttle-Panel-title full-width no-float'>Documentation</div><div class='doc-text'>"+ documentation +"</div>");
        }
        // Changelog
        if ( which == "Changelog" ) {
        	addPanel();
          $(".shuttle-SEO").append("<div class='shuttle-Panel-title full-width no-float'>Changelog</div><div class='doc-text'> Coming soon! </div>");
        }
        // Import/Export
        if ( which == "Import/export Settings" ) {
       		addPanel();
          $(".shuttle-SEO").append("<div class='shuttle-Panel-title full-width no-float'>Import / Export settings</div><div class='doc-text'> Coming soon! </div>");
        }
      });
      $(".panel-seo .PanelNav-itemTarget[data-tab='Settings']").trigger("click");
    });
  };
  function settingsClose() {
  	let panel = $("a[data-active-id='cookies']").closest(".shuttle-Panel-inner");
   	let otherLink = panel.find(".shuttle-SubNav:not(.heading-addons) .shuttle-SubNav-wrapItems .shuttle-SubNav-itemTarget");
    otherLink.off("click");
    otherLink.on("click", function() {
      $(".heading-addons a").removeClass("is-selected");
      $(".panel-seo").remove();
    });
    $(".shuttle-Panel--mainNav li a").off("click");
    $(".shuttle-Panel--mainNav li a").on("click", function() {
   		$(".heading-addons a").removeClass("is-selected");
      if ( $(this).attr("data-active-id") == "settings" && $(this).hasClass("is-selected") == false ) {
        console.log("Settings clicked while inactive");
      	if ( $(".panel-seo").length ) {
          console.log("SEO Panel existed");
          setTimeout( function() {
        	$(".shuttle-SubNav-itemTarget").removeClass("is-selected");
          $(".settings-seo").addClass("is-selected");
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
      settings();
    }
    if ( $(".heading-addons").length && $(".settings-seo").length == 0 ) {
      settingsSEO();
      settingsClose();
    }
  }, 1000);
  
  
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
    
    function check() {
      if ( localStorage.getItem("SEO-limit-active") == null ) {
        localStorage.setItem("SEO-limit-active", true);
      } else {
        if ( localStorage.getItem("SEO-limit-active") == "true" ) {
          $(".seo-check-toggler").addClass("on");
          
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
      };
      
    }
		descs.off("click change input");
    descs.on("click change input", check);
    descs.each(check);
	}, 1000);
  
  
  let css =
  ".seo-avail {border: 1px solid #7d03ab !important}"
  +
  ".cke_top .cke_seo .cke_button__source_icon {background-position: 0 -624px !important;}"
  +
  ".cke_top .cke_seo .cke_button {width: 46px !important;}"
  +
  ".cke_combo__styles {margin-right: 6px !important}"
  +
  ".cke_button_seo {width: 46px !important}"
  +
  ".cke_button__seo_label {display: block !important}"
  +
  "#cke_seo_button .cke_button__seo_icon {background: url(https://shuttle-assets-new.s3.amazonaws.com/assets/js/vendor/ckeditor/skins/moono/icons.png) no-repeat 0 -624px !important;}"
  +
  '.full-width {width: 100%}'
  +
  '.cke_toolgroup.hidden {height: 0; width: 0; opacity: 0; pointer-events: none;}'
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
  +
  ".Tooltip-seo {transform: translateX( calc(-50% + 10px)) translateY(-100%);}"
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
  '.seo-parent.unknown:not([length="NaN"]):not(.dyn)::after {content: attr(length) " / " attr(limit) !important;}';
  
  
  $("head").append("<style class='seo-master' type='text/css'></style>");
  $(".seo-master").html( css );
});
  