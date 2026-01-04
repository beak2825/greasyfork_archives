// ==UserScript==
// @name        Drupal QA now
// @namespace   drupal-qa-now
// @description  Tool to help our daily work with Drupal
// @include     http*://*.ibm.com/*
// @include     http*://localhost*
// @exclude     https://cms.ibm.com/*/edit
// @exclude     https://cms.ibm.com/admin/*

// @version     1.14
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/389770/Drupal%20QA%20now.user.js
// @updateURL https://update.greasyfork.org/scripts/389770/Drupal%20QA%20now.meta.js
// ==/UserScript==

var customCss = `<style>
#checkPage {
	position: fixed;
	left: 15px;
	bottom: 15px;
	padding: 0 5px 5px;
	border: 1px solid rgba(147,147,147,0);
	border-top: 0;
	border-radius: 0 0 55px 55px;
	transition: 0.3s ease;
	transition-property: border-color;
	transition-delay: 0.1s;
	z-index: 99999;
}
#qa-functions {
	position: absolute;
	left: -1px;
	bottom: 100%;
	display: block;
	height: 0;
	overflow: hidden;
	padding: 5px 5px 0;
	border: 1px solid rgba(198,198,198,0);
	border-bottom: 0;
	border-radius: 55px 55px 0 0;
	transition-property: height, border-color;
    transition-duration: .3s, .3s;
    transition-timing-function: ease, ease;
    transition-delay: 0s, .1s;
}
#checkPage:hover, #checkPage:hover #qa-functions {
	background: rgba(255,255,255,0.6);
	border-color: rgba(198,198,198,1);
}
#checkPage:hover #qa-functions {
	display: block;
	height: 160px;
}
#checkPage #qa-functions div {
	margin-bottom: 15px;
}
#checkPage #qa-functions div div {
	margin-top: 5px;
	display: flex;
}
#checkPage #qa-functions div div button {
	width: 25px;
	height: 25px;
	font-size: 10px;
	line-height: 23px;
	padding: 0;
	font-weight: normal;
}
#checkPage:hover #qa-functions button {
	cursor: pointer;
	transition: 0.3s ease;
}
#checkPage:hover #qa-functions button:hover {
	background: #d9d9d9;
}
#checkPage:hover #qa-functions button.checked {
	color: #ba00fd;
	border-color: #ba00fd;
}
#checkPage button {
	display: block;
	background: #ececec;
	color: #939393;
	width: 50px;
	height: 50px;
	line-height: 48px;
	text-align: center;
	padding: 0;
	border-radius: 50%;
	border: 1px solid #939393;
	text-decoration: none;
}
#checkPage button:focus {
	outline: 0;
}
.ibm-highlight-error {
	position: relative;
	display: inline-block;
}
.ibm-highlight-error.ibm-fluid {
	display: flex;
}
.ibm-icon-nolink span.ibm-highlight-error:after {
	width: calc(100% + 42px);
	left: -39px;
}
.ibm-icon-nolink span.ibm-highlight-error:before {
	left: -33px;
}

.ibm-duo-carousel .ibm-highlight-error {
	position: static;
}

.ibm-duo-carousel .ibm-highlight-error:after {
	left: 0; top: 0;
	width: 100%; height: 100%;
	border-radius: 0px;
}

.ibm-duo-carousel .ibm-highlight-error .ibm-error-label {
	top: 0; right: 0;
	z-index: 2;
	text-indent: 0;
}

.error-inside {
	display: inline-block;
	background: white;
	padding: 0px 7px;
	color: #f2354f;
	position: absolute;
	right: 4px;
	font-size: 12px;
	line-height: 20px;
	z-index: 1;
	border: 2px solid #f2354f;
	margin-left: 5px;
}
.ibm-highlight-error .ibm-error-label {
	display: block;
	background: white;
	padding: 0px 7px;
	color: #f2354f;
	position: absolute;
	top: -23px;
	right: 4px;
	font-size: 12px;
	line-height: 20px;
	z-index: 1;
	border: 2px solid #f2354f;
	cursor: help;
}

.ibm-highlight-error .ibm-error-label:hover {
	border-bottom-width: 2px;
}

.ibm-highlight-error:after {
	position: absolute;
	display: block;
	content: "";
	width: calc(100% + 10px);
	height: calc(100% + 10px);
	left: -5px;
	top: -5px;
	border: 2px solid #f2354f;
	border-radius: 4px;
	pointer-events: none;
	box-sizing: border-box;
}
.ibm-highlight-error.warn > .ibm-error-label, .ibm-highlight-error.warn:after {
  border-color: #b3b3b3;
}
.ibm-highlight-error.warn > .ibm-error-label {
	color: #b3b3b3;
}
.ibm-highlight-error img {
	display: block;
	margin-bottom: 5px;
}
.ibm-icononly .ibm-highlight-error .ibm-error-label {
	margin: 0;
	top: 0;
	left: 0;
	padding: 0;
	width: 100%;
	box-sizing: border-box;
	font-size: 0px;
	height: 100%;
	background: none;
}
.ibm-icononly .ibm-highlight-error::after {
	width: 100%;
	height: 100%;
	left: 0;
	top: 0;
	border-radius: 0;
}
.special-info {
	color: #222;
	background: #fff;
	border: 1px solid #cecece;
	border-radius: 2px;
	font-size: 0.7em;
	padding: 3px 5px;
	display: inline-block;
	box-shadow: 0px 0px 2px rgba(55, 16, 66, 0.41);
	line-height: 1.3em;
}
.ibm-duo-u--ratio--sixteen-nine,
.ibm-card__image {
	position: relative;
}
.ibm-duo-u--ratio--sixteen-nine .special-info,
.ibm-card__image .special-info {
	position: absolute;
	z-index: 20;
	top: 0;
}
.padding-top-0-important {
	padding-top: 0px !important;
}
.showErrorsNumber {
	position: fixed;
	top: 0;
	left: 0;
	display: block;
	width: 100%;
	height: 70px;
	z-index: 901;
	background: #ff4f4f;
	line-height: 70px;
	text-align: center;
	color: white;
	display: none;
}
.showErrorsNumber.errorNoError {
	background: #9be895;
	color: #3e6f2c;
}
.ibm-card > div:first-child, [class*="ibm-col-"] > a, .ibm-card .ibm-blocklink > div:first-child {
	position: relative;
	display: block;
}
.ibm-card > div:first-child .special-info, .ibm-card .ibm-blocklink > div:first-child .special-info, .ibm-video-placeholder .special-info, [class*="ibm-col-"] > a .special-info {
	position: absolute;
	top: 0;
	left: 0;
	max-width: 100%;
}
</style>`;

jQuery("head").append(customCss);
var tooltipIndex = 0;
var countErrors = 0;
var countWarns  = 0;

function showError(e, errorInfo, errorType) {
    console.log(errorInfo);
  errorInfo = "→ " + errorInfo;
	if(errorType == "warn") { e.addClass("warn"); countWarns++; }
	else { countErrors++; }
  // Checking if element already has error info to add more
  if(e.hasClass("ibm-highlight-error") || e.is("img") && e.parent().hasClass("ibm-highlight-error")) {
    if(e.is("img")) {
      e = e.parent();
    }
    errorInfo = e.children(".ibm-tooltip-content").html() + "<br /><br />" + errorInfo;
    e.children(".ibm-tooltip-content").html(errorInfo);
  }
  // Adding new error info
  else {
    if(e.is("img")) {
      e.wrap("<div></div>");
      e = e.parent();
    }
    e.addClass("ibm-highlight-error");
    if(errorType == "warn") { e.addClass("warn"); }
    e.append(" <span class='ibm-error-label' data-widget=\"tooltip\" data-contentid=\"ibm-error-info-" + tooltipIndex + "\" title=\"" + errorInfo + "\">info</span>");
    e.append(" <span class='ibm-tooltip-content' id=\"ibm-error-info-" + tooltipIndex + "\">" + errorInfo + "</span>");
    if(jQuery(".ibm-show-hide").parents(e).length >= 1 && !(e.is(".ibm-show-hide > h2"))) {
      e.closest(".ibm-show-hide").find(" > h2 a").append('<span class="error-inside">open for info</span>');
    }
    if(jQuery(".ibm-tabs-content").parents(e).length >= 1) {
      jQuery(".ibm-tabs #dtitem-" + e.closest(".ibm-tabs-content").attr("id")).append('<span class="error-inside">open for info</span>');
    }
    tooltipIndex++;
  }
}

jQuery(document).ready(function(){

  if(jQuery("#toolbar-item-administration").hasClass("is-active")) { jQuery("#toolbar-item-administration")[0].click(); }
  setTimeout(function(){
    jQuery(".ibm-localpagen10n-buttons button").first().trigger("click");
  }, 3000);

  var headHTML = jQuery("head").html();
	var contentDelivery = headHTML.slice(headHTML.indexOf("\"", headHTML.indexOf(":", headHTML.indexOf("contentDelivery")))+1, headHTML.indexOf("\n", headHTML.indexOf("\"", headHTML.indexOf(":", headHTML.indexOf("contentDelivery")))+1)-2);
	var contentProducer = headHTML.slice(headHTML.indexOf("\"", headHTML.indexOf(":", headHTML.indexOf("contentProducer")))+1, headHTML.indexOf("\n", headHTML.indexOf("\"", headHTML.indexOf(":", headHTML.indexOf("contentProducer")))+1)-2);
	var version = headHTML.slice(headHTML.indexOf("\"", headHTML.indexOf(":", headHTML.indexOf("version")))+1, headHTML.indexOf("\n", headHTML.indexOf("\"", headHTML.indexOf(":", headHTML.indexOf("contentProducer")))+1)-2);

	//if(contentDelivery.indexOf("Drupal") >= 0 && jQuery('#ibm-content-main').length > 0) {
	if(version.indexOf("v18") >= 0 || version.indexOf("v19") >= 0) {
    var checkerButton = `
        <div id='checkPage'>
          <button>🔧</button>
          <div id='qa-functions'>
            <div>
              <button id='qa-page-now'><b>QA</b></button>
              <div>
                <button id='qa-kaltura'>kalt</button>
                <button id='qa-alt-text'>alt</button>
              </div>
            </div>`;
		if(contentDelivery.indexOf("Drupal") >= 0) checkerButton += `
						<div>
							<button id='remove-drupal'>hide</button>
						</div>`;
    checkerButton += `
					</div>
        </div>`;
    jQuery("body").append(checkerButton);

    jQuery("#remove-drupal").click(function(){
        if(!jQuery("[id ^=block-][id $=-local-tasks], #content-moderation-entity-moderation-form").hasClass("ibm-hide")) {
            jQuery("#remove-drupal").addClass("checked");
            jQuery("[id ^=block-][id $=-local-tasks], #content-moderation-entity-moderation-form").addClass("ibm-hide");
            jQuery(".messages-wrapper").parent().addClass("ibm-hide");
            jQuery("#toolbar-administration").addClass("ibm-hide");
            jQuery("body").addClass("padding-top-0-important");
        } else {
            jQuery("#remove-drupal").removeClass("checked");
            jQuery("[id ^=block-][id $=-local-tasks], #content-moderation-entity-moderation-form").removeClass("ibm-hide");
            jQuery(".messages-wrapper").parent().removeClass("ibm-hide");
            jQuery("#toolbar-administration").removeClass("ibm-hide");
            jQuery("body").removeClass("padding-top-0-important");
        }
    });
    jQuery("#qa-kaltura").click(function(){
        if(!jQuery("#qa-kaltura").hasClass("checked")) {
            jQuery("#qa-kaltura").addClass("checked");
            jQuery(".ibm-video-player-con[data-videotype=youtube]").each(function(){
							if(jQuery(this).attr("data-kaltura-fallbackid") == null || jQuery(this).attr("data-kaltura-fallbackid") == undefined || jQuery(this).attr("data-kaltura-fallbackid") == "") {
								jQuery(this).after(" <span class='display-kaltura special-info'>missing kaltura id</span>");
							} else {
                jQuery(this).after(" <span class='display-kaltura special-info'>"+jQuery(this).attr("data-kaltura-fallbackid")+"</span>");
							}
            });
            jQuery(".ibm-video-player-con[data-videotype=kaltura]").each(function(){
							if(jQuery(this).attr("data-videoid") == null || jQuery(this).attr("data-videoid") == undefined || jQuery(this).attr("data-videoid") == "") {
								jQuery(this).after(" <span class='display-kaltura special-info'>missing kaltura id</span>");
							} else {
                jQuery(this).after(" <span class='display-kaltura special-info'>"+jQuery(this).attr("data-videoid")+"</span>");
							}
            });
        } else {
            jQuery("#qa-kaltura").removeClass("checked");
            jQuery(".display-kaltura").remove();
        }
    });
    jQuery("#qa-alt-text").click(function(){
        if(!jQuery("#qa-alt-text").hasClass("checked")) {
            jQuery("#qa-alt-text").addClass("checked");
            jQuery("img").each(function(){
                jQuery(this).after(" <span class='display-alt-text special-info'>"+jQuery(this).attr("alt")+"</span>");
            });
            jQuery("div[aria-label]").each(function(){
                jQuery(this).append("<span class='display-alt-text special-info'>"+jQuery(this).attr("aria-label")+"</span>");
            });
        } else {
            jQuery("#qa-alt-text").removeClass("checked");
            jQuery(".display-alt-text").remove();
        }
    });
    jQuery("#qa-page-now").click(function(){
      if(!jQuery("#qa-page-now").hasClass("checked")) {

        jQuery(this).addClass("checked");
        // Check dots consistance on cards
        function lastCharacterF(e) {
          var lastParagraph = e.find("p:not(.ibm-ind-link):not(.ibm-btn-row):not(.ibm-button-link)").last().text().trim();
          return lastParagraph.charAt(lastParagraph.length-1);
        }
        jQuery(".ibm-band").has(".ibm-card").each(function(){
          var thisBand = jQuery(this);
          var cardsNumber = thisBand.find(".ibm-card").has("p:not(.ibm-ind-link):not(.ibm-btn-row):not(.ibm-button-link)").length;
          var cardsDots = 0;
          thisBand.find(".ibm-card").each(function(){
            var thisCard = jQuery(this);
            var lastCharacter = lastCharacterF(thisCard);
            if(lastCharacter == ".") {
              cardsDots++;
            }
          });
          if(cardsNumber - cardsDots == 1) {
            thisBand.find(".ibm-card").each(function(){
	            var thisCard = jQuery(this);
              var lastCharacter = lastCharacterF(thisCard);
              if(lastCharacter != ".") {
                //showError(thisCard, "Please check if you need to add a dot on the end of the copy on this card or to remove the dots from the other cards", "warn");
              }
            });
          }
          if(cardsDots == 1 && cardsNumber >= 1) {
            thisBand.find(".ibm-card").each(function(){
	            var thisCard = jQuery(this);
              var lastCharacter = lastCharacterF(thisCard);
              if(lastCharacter == ".") {
                //showError(thisCard, "Please check if you need to remove the dot on the end of the copy on this card or to add dots on the end of the other cards", "warn");
              }
            });
          }
          if(cardsDots >= 2 && cardsNumber - cardsDots >= 2) {
            //showError(thisBand.find(".ibm-card").eq(0).closest(".ibm-fluid"), "Please check the consistance of dots in the end of the card's copy", "warn");
          }
        });
        // Check quotes
        jQuery("p,h1,h2,h3,h4").each(function(){
          if(jQuery(this).text().indexOf("'") >= 0) {
            showError(jQuery(this), "Replace normal quote \' by the fancy one \’ ", "warn");
          }
        });
        // Check external icons
        jQuery(".ibm-ind-link a:not([class*='ibm-btn-']):not([class*='-mono-link']):not([class*='-encircled-link'])").each(function(){
          if(contentProducer.indexOf("Product Page") == -1 && jQuery(this).attr("href").indexOf(".ibm.") == -1 && jQuery(this).attr("href").indexOf("//") >= 0 && jQuery(this).attr("href").indexOf(".youtube.") == -1 && jQuery(this).attr("href") != "" && jQuery(this).attr("href").search("#") != 0 && jQuery(this).attr("href").indexOf("youtu.be") == -1 && jQuery(this).hasClass("ibm-external-link") == false) {
            showError(jQuery(this), "Consider adding external icon", "error");
          }
        });
        jQuery("a.ibm-blocklink").each(function(){
          if(contentProducer.indexOf("Product Page") == -1 && jQuery(this).attr("href").indexOf(".ibm.") == -1 && jQuery(this).attr("href").indexOf("//") >= 0 && jQuery(this).attr("href").indexOf(".youtube.") == -1 && jQuery(this).attr("href") != "" && jQuery(this).attr("href").search("#") != 0 && jQuery(this).attr("href").indexOf("youtu.be") == -1 && jQuery(this).find(".ibm-icon-nolink span").hasClass("ibm-external-link") == false && jQuery(this).find(".ibm-ind-link").length > 0) {
            showError(jQuery(this), "Consider adding external icon", "error");
          }
        });
        // Check Kaltura ID
        jQuery("a[data-widget=videoplayer]:not(:has(> img)), span[data-widget=videoplayer]").not("[data-videotype=kaltura]").not("").each(function(){
          if((jQuery(this).attr("data-kaltura-fallbackid") == null || jQuery(this).attr("data-kaltura-fallbackid") == "") && jQuery(this).hasClass("ibm-blocklink") == false && jQuery(this).closest(".ibm-blocklink").length == 0) {
            showError(jQuery(this), "Please add Kaltura ID", "error");
          }
          if((jQuery(this).attr("data-kaltura-fallbackid") == null || jQuery(this).attr("data-kaltura-fallbackid") == "") && jQuery(this).hasClass("ibm-blocklink") == true) {
            if(jQuery(this).find("[data-widget=videoplayer]").attr("data-kaltura-fallbackid") == null && jQuery(this).find("[data-widget=videoplayer]").hasClass("ibm-blocklink") == false) {
                if(contentDelivery.indexOf("Drupal") >= 0) {
                    showError(jQuery(this), "Please add Kaltura ID, but note that Drupal is not adding Kaltura ID on blockclinks", "error");
                } else {
                    showError(jQuery(this), "Please add Kaltura ID", "error");
                }
            } else {
              showError(jQuery(this), "Note that Drupal is not adding Kaltura ID on blockclinks", "warn");
            }
          }
        });
        jQuery("#ibm-content-wrapper #ibm-leadspace-head a, #ibm-content-wrapper #ibm-content-body a, #ibm-content-wrapper main a").each(function(){
	          var thisLink = jQuery(this).attr('href');
	          if(thisLink != "" && thisLink != null && thisLink != undefined && !(jQuery(this).find("*").length == 1 && jQuery(this).find("img").length == 1)) {
	          // Check relative links
	          if(thisLink.indexOf("www\.ibm\.com\/blockchain") > -1 && thisLink.indexOf("www\.ibm\.com\/blockchain/resources") == -1) {
	            showError(jQuery(this), "Check if it needs to be a relative link", "error");
	          }
	          // Check cms links
	          if(thisLink.indexOf("cms\.ibm\.com") > -1) {
	            showError(jQuery(this), "Fix link with \'cms\' to a relative link", "error");
	          }
	          // Check link opening guidance
	          if(thisLink.indexOf("/blockchain") != 0
	             && contentProducer.indexOf("Product Page") == -1
	             && thisLink.indexOf("www\.ibm\.com\/blockchain\/") == -1
	             && thisLink.indexOf("\/cloud\/blockchain") == -1
	             && jQuery(this).attr("target") != "_blank"
	             && thisLink.indexOf("#") != 0
	             && thisLink != ""
	             && !jQuery(this).is("a[data-widget=videoplayer]")
	             && thisLink.indexOf("youtu.be") == -1
	             && thisLink.indexOf(".youtube.") == -1
	             && thisLink != "javascript:void();"
	             && jQuery(this).is(".ibm-ind-link a, .ibm-btn-row a, .ibm-button-link a")) {
	            if(!jQuery(this).is(".ibm-card a:not(.ibm-blocklink)") && jQuery(this).find("img").length <= 0) {
	              showError(jQuery(this), "Consider setting this link to open on a new window", "error");
	            }
	          }
	          // Check link opening guidance
	          if(thisLink.indexOf("/reg/us-en/") >= 0) {
	            showError(jQuery(this), "Remove country and language code from this link", "error");
	          }
	          if(jQuery(this).attr("href").charAt(jQuery(this).attr("href").length - 1) == "/") {
	            showError(jQuery(this), "Remove slash from the end of url", "error");
                  console.log(jQuery(this).attr("href"));
	          }
	        }
        });
        // Check ALT text
        jQuery("#ibm-content-wrapper img").each(function(){
          if((jQuery(this).attr("alt") == "" || jQuery(this).attr("alt") == null) && (jQuery(this).width > 100 && jQuery(this).heigth > 80)) {
            showError(jQuery(this), "Add ALT text on the image", "error");
          }
        });
        // Check Blockchain grid
        var socialBand = jQuery(".ibm-band").has(".ibm-icononly").last();
				if(socialBand.length > 0) {
	        var convertBand = socialBand.prev();
	        if(socialBand.css("backgroundColor") == convertBand.css("backgroundColor") && convertBand.has("img").length == 0) {
	          showError(convertBand.find(".ibm-fluid"), "Add the Blockchain grid on the convert band", "error");
	        }
	        if(socialBand.css("backgroundColor") == convertBand.css("backgroundColor") && convertBand.has("img").length == 1 && convertBand.find("img").is(".ibm-resize")) {
	          showError(convertBand.find("img"), "Grid should use downsize class, not resize", "error");
	        }
				}


        jQuery("span.ibm-error-label[data-widget=tooltip]").tooltip();


        // Check metadata
        var metaDescription = jQuery("meta[name=description]").attr("content");
        //var metaKeywords = jQuery("meta[name=keywords]").attr("content");
        var metaTitle = jQuery("title").html();
        var metaMessage = "";
        if(metaTitle.indexOf(" | IBM") == -1) {
          metaMessage += "→ Check meta title tag";
        }
        if(metaDescription == "" || metaDescription == null) {
          if(metaMessage != "") metaMessage += "\n";
          metaMessage += "→ Check meta description tag";
        }
        //if(metaKeywords == "" || metaKeywords == null) {
        //  if(metaMessage != "") metaMessage += "\n";
        //  metaMessage += "→ Check meta keywords tag";
        //}
        if(metaMessage != "") alert(metaMessage);


				// Showing number of errors on top of screen
				var topMessage = '<div class="showErrorsNumber">';
				var noErrors = "errorsNo";
				if(countErrors > 0 || countWarns > 0) {
					var spaceBetween = 0;
					noErrors = "errorsYes";
					if(countErrors > 0) {
						topMessage += countErrors + " errors found";
						spaceBetween = 1;
					}
					if(countWarns > 0) {
						if(spaceBetween == 1) {
							topMessage += " | ";
						}
						topMessage += countWarns + " warns found";
					}
				} else {
					topMessage += "No errors found";
				}
				topMessage += "</div>";
				jQuery("body").append(topMessage);
				if(countErrors == 0 && countWarns == 0) {
					jQuery(".showErrorsNumber").addClass("errorNoError");
				}
				jQuery(".showErrorsNumber").slideDown("slow").delay(5000).slideUp("show");
      }
      // ENDS CHECKING

      // REMOVES INFO
      else {
        jQuery(this).removeClass("checked");
        countErrors = "0";
        countWarns  = "0";
        jQuery(".ibm-highlight-error.warn").removeClass("warn");
        jQuery(".ibm-highlight-error").removeClass("ibm-highlight-error");
        jQuery("span.ibm-error-label[data-widget=tooltip]").data("widget").destroy();
        jQuery(".ibm-error-label").remove();
        jQuery(".error-inside").remove();
        jQuery(".ibm-tooltip-content").remove();
      }
    });
  }

});
