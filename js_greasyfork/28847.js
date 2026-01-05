// ==UserScript==
// @name         FA SubFilter
// @namespace    FurAffinity
// @version      3.0.0
// @description  Enable/Disable custom submission types with keywords
// @author       JaysonHusky
// @grant        GM_getValue
// @grant        GM_setValue
// @match        *://www.furaffinity.net/msg/submissions*
// @match        *://www.furaffinity.net/gallery*
// @match        *://www.furaffinity.net/favorites*
// @match        *://www.furaffinity.net/browse*
// @match        *://www.furaffinity.net/controls/user-settings/*
// @require      https://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/28847/FA%20SubFilter.user.js
// @updateURL https://update.greasyfork.org/scripts/28847/FA%20SubFilter.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var target_mode="on";
    
    var TemplateStyle=$('body').attr('data-static-path');
    if(TemplateStyle===undefined){throw new Error("SubFilter: An error occured. [Code: ERR_TPL_VARS_MIS]");}
    // Setup keywords
    var SubFilter_Keywords;
    var sf_ud_keywords;
	// Begin loading
		function FASFM_Load(){
			sf_ud_keywords=GM_getValue('fasfm');
			if(sf_ud_keywords>""){
				SubFilter_Keywords=sf_ud_keywords.split(",");
				$('#fafsm_settings').val(sf_ud_keywords.replace(/,/g,", "));
			}
			else {
				console.log("SubFilter: An error occured while attempting to retrieve keywords. [Code: ERR_KEYS_UNDEFINED]");
			}
		}
	  // Add Special Stylesheet for keywords
		var JaysCSS=document.createElement('style');
		var jayStyle=document.createTextNode(`
			i.fafsm{
				margin-right:5px;
				padding:1px;
			}
			span.fafx-update-status{
				font-weight:bold;
				color:#04fd04;
				float:right;
				clear:right;
				display:none;
			}
			#customfacontrolpanel{
				/*border:1px dashed white;
				background:rgba(1,0,0,0.1);
				padding:5px;
				border-radius:5px;*/
				margin-top:20px;
			}
			.JaySB{
				background: #36393d;
				padding: 7px 14px 14px 14px;
			}
			#speciallisting li{
				margin-left:20px;
			}
		`);
		JaysCSS.appendChild(jayStyle);
		document.getElementsByTagName('body')[0].appendChild(JaysCSS);
	// Save settings
	function FAFSM_SaveSettings(fasfm){
		GM_setValue('fasfm',fasfm);
	}
	// Load Control Panel
		var pathx=window.location.pathname;
		if(~pathx.indexOf("/controls/user-settings/")){
			// Update
			$(document.body).on('click','#fafsm_saveit',function(){
				var fafsm_set=$("input[name='fafsm_setting']").val().replace(/ /g,"").replace(/  /g,"");
				FAFSM_SaveSettings(fafsm_set);
				$('.fafx-update-status').fadeIn('slow');
					setTimeout(function(){
						$('.fafx-update-status').fadeOut('slow');
					}, 5000);
				});
				if(TemplateStyle=="/themes/beta"){
				$('.content .section-body').after(`
					<div id="customfacontrolpanel" class="JaySB">
						<h2>SubFilter Control Panel <span class="fafx-update-status">Update successful!</span></h2>
						<br/>
						<h4>Custom Keywords to blacklist in submissions inbox</h4>
						<div class="control-panel-option">
							<div class="control-panel-item-1">
								<p>
								<ul id="speciallisting">
								<li>Keywords must be comma seperated.</li>
								<li>Case insensitive</li>
								<li>Singular terms will match plurals.</li>
								</ul>
								</p>
							</div>
							<div class="control-panel-item-2">
								<input type="text" name="fafsm_setting" id="fafsm_settings" class="textbox" placeholder="Example: free,fender,commission" style="height:36px;padding:5px; width:300px" />
							</div>
						</div>
						<div class="button-nav">
							<div class="button-nav-item">
								<input class="button mobile-button" id="fafsm_saveit" type="button" value="Save SubFilter Settings*">
							</div>
						</div>
						<br/><b>*Updates take effect from the next page load.</b><br/><span style="font-size:10px;position:relative;bottom:0;right:0;">SubFilter (A user controlled FA Blacklisting tool) by <a href="https://www.furaffinity.net/user/feralfrenzy" style="border-bottom:1px dotted white;">JaysonHusky</a></span>
					</div><br/><br/>`);
				}
				else {
					$('.footer').before(`<table cellpadding="0" cellspacing="1" border="0" class="section maintable" style="width: 60%; margin: 0 auto;">
					<tbody>
						<tr>
							<td height="22" class="cat links">&nbsp;
								<strong>SubFilter - Control Panel</strong>
								<span class="fafx-update-status">Update successful!</span>
							</td>
						</tr>
						<tr>
							<td class="alt1 addpad ucp-site-settings" align="center">
								<table cellpadding="0" cellspacing="1" border="0">
									<tbody>
										<tr>
											<th><strong>Custom Keywords to bblock in submissions inbox</strong></th>
											<td>
												<input type="text" name="fafsm_setting" id="fafsm_settings" class="textbox" placeholder="Example: free,fender,commission" style="padding:5px; width:250px" />
											</td>
											<td class="option-description">
												<p>Enter keywords here for the addon to identify in journal titles. <br/>Keywords must be comma seperated.<br/>Case insensitive<br/>Singular terms will match plurals.</p>
											</td>
										</tr>
										<th class="noborder">&nbsp;</th>
										<td class="noborder">&nbsp;</td>
										<td class="option-description noborder">
											<br><input class="button mobile-button" id="fafsm_saveit" type="button" value="Save Settings*"><br/>
											<span style="font-size:10px;">FA Journal Breakdown by <a href="https://www.furaffinity.net/user/feralfrenzy" style="border-bottom:1px dotted white;">JaysonHusky</a></span><br/><br/>
											<b>*Updates take effect from the next page load</b>
										</td>
									</tr>
								</tbody>
							</table>`);
				}
        }
		FASFM_Load();
    // Setup the hook
    // Adapt JQuery :contains to function without case restriction
    jQuery.expr[':'].icontains=function(a,i,m){return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase())>=0;};
    // JS equiv of PHPs ucwords() for better presentation (Credit: rickycheers @ Github)
    String.prototype.ucwords=function(){
        st2uc=this.toLowerCase();
        return st2uc.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,function(s){
            return s.toUpperCase();
        });
    };
    function subcount(inp){if(isNaN(inp)===true){return "0";}else{return inp;}}
    // Search for custom keywords
    if(SubFilter_Keywords===undefined){}
    else{
        SubFilter_Keywords.forEach(function(keyword){
           if(target_mode=="on"){
                // Message Center ( Submissions Only )
                $("#messagecenter-submissions section figure figcaption").find("label a:icontains('"+keyword+"')").parent().parent().parent().parent().css('display','none');
                // User Profile Gallery
                $("#gallery-gallery figure figcaption").find("a:icontains('"+keyword+"')").parent().parent().parent().css('display','none');
                // User Profile Favourites
                $("#gallery-favorites figure figcaption").find("a:icontains('"+keyword+"')").parent().parent().parent().css('display','none');
                // Browse Page
                $("#gallery-browse figure figcaption").find("a:icontains('"+keyword+"')").parent().parent().parent().css('display','none');
                // Deactivate on Search page as the user can filter by themselves there.
           }
            else {
                // Message Center ( Submissions Only )
                $("#messagecenter-submissions section figure figcaption").find("label p:first a:icontains('"+keyword+"')").parent().parent().parent().parent().css('display','none');
                // User Profile Gallery
                $("#gallery-gallery figure figcaption").find("p:first a:icontains('"+keyword+"')").parent().parent().parent().css('display','none');
                // User Profile Favourites
                $("#gallery-favorites figure figcaption").find("p:first a:icontains('"+keyword+"')").parent().parent().parent().css('display','none');
                // Browse Page
                $("#gallery-browse figure figcaption").find("p:first a:icontains('"+keyword+"')").parent().parent().parent().css('display','none');
                // Deactivate on Search page as the user can filter by themselves there.
            }
        });
    }
})();