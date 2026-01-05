// ==UserScript==
// @name         FA Fixes Control Panel
// @namespace    FurAffinity.net
// @version      1.5.1
// @description  Adds a control panel of fixes to the FurAffinity website, so you can enable/disable them at will.
// @author       JaysonHusky
// @match        *://www.furaffinity.net/*
// @exclude      *://www.furaffinity.net/login/
// @exclude      *://www.furaffinity.net/logout/
// @exclude      *://www.furaffinity.net/controls/submissions/
// @exclude      *://www.furaffinity.net/controls/settings/
// @grant       GM_getValue
// @grant       GM_setValue
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/24515/FA%20Fixes%20Control%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/24515/FA%20Fixes%20Control%20Panel.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var TemplateStyle=$('body').attr('data-static-path');
    // Load Current Settings
    function FAFCP_LoadCP(i){
        var setting_returned = GM_getValue(i);
        if(setting_returned=="yes"){
            $('#'+i+'_yes').prop("checked", true);
        }
        else if(setting_returned=="no") {
             $('#'+i+'_no').prop("checked", true);
        }
        else {
             console.log('[DEBUG}: Setting: '+i+' Returned: '+setting_returned+' (Result not valid, or control not set)');
        }
    }
    function FAFCP_Load_Tweaks(i){
        var setting_returned = GM_getValue(i);
        if(setting_returned=="yes"){
            return "yes";
        }
        else if(setting_returned=="no") {
             return "no";
        }
        else {
             return "undefined";
        }
    }
    function FAFCP_SaveSettings(fafcp_nct,fafcp_sbg,fafcp_hs,fafcp_os,fafcp_sst,fafcp_sstpo,fafcp_fn,fafcp_tp,fafcp_nf,fafcp_bbf){
        GM_setValue('fafcp_nct',fafcp_nct);GM_setValue('fafcp_sbg',fafcp_sbg);GM_setValue('fafcp_hs',fafcp_hs);GM_setValue('fafcp_os',fafcp_os);
        GM_setValue('fafcp_sst',fafcp_sst);GM_setValue('fafcp_sstpo',fafcp_sstpo);GM_setValue('fafcp_fn',fafcp_fn);GM_setValue('fafcp_tp',fafcp_tp);
        GM_setValue('fafcp_nf',fafcp_nf);GM_setValue('fafcp_bbf',fafcp_bbf);
    }
	function ExecuteTweak(tweak){
		switch(tweak) {
			case "NoCustomThumbnails":
				$("img[src*='t.facdn.net']").each(function(index){
					var thumburl=$(this).attr('src').replace("@150","@400");
					$(this).attr("src",thumburl);
				});
			break;
			case "SidebarBeGone":
				$("<style>#submission_page .submission-sidebar{position:fixed;top:50px;bottom:0px;right:-290px;z-index:1000000;background:rgba(1,0,0,0.6);transition: 0.5s all;height: 800px;}#submission_page .submission-sidebar:hover{position:absolute;top:50px;bottom:0px;right:0px;z-index:1000000;background:rgba(1,0,0,0.9);transition: 0.5s all;height:800px;}</style>").appendTo("head");
			break;
			case "HiddenStreams":
				$("<style>div#messagecenter-other ul.message-stream li.stream-notification{display:none;}</style>").appendTo("head");
			break;
			case "ObviousStreams":
				$("<style>div#messagecenter-other ul.message-stream li.stream-notification{background: rgba(255,255,255,0.5);color: black;border: 0.5px dashed black;}div#messagecenter-other ul.message-stream li.stream-notification a {color: black;}</style>").appendTo("head");
			break;
			case "SameSizeThumbnails":
				$("<style>figure.r-general u a img,figure.r-mature u a img,figure.r-adult u a img{height:150px !important;width:150px !important;}</style>").appendTo("head");
			break;
            case "SameSizeThumbnailsPO":
				$("<style>.userpage-gallery-item img,.userpage-favorites-item img{height: 150px;width: 150px;}</style>").appendTo("head");
			break;
			case "FixedNavigation":
				$("<style>nav#ddmenu{position:fixed;background:black;}.site-banner{margin-top:50px;}</style>").appendTo("head");
			break;
			case "TidyProfile":
				var ProfileSize=480;
				if ($('.userpage-layout-profile-container').height()>ProfileSize){
					$('.userpage-layout-profile-container').css('height',''+ProfileSize+'px');
					$('.userpage-layout-profile-container').css('overflow-y','auto');
				}
			break;
            case "NoteFix":
                $('<style>#JSMessage{background: #3c3c3c !important;}.textbox, .textarea{background: #3c3c3c !important;border-radius:5px;}</style>').appendTo("head");
            break;
            case "BringBackButtons":
                $('.flex-submission-container').before('<div style="width:31%;margin:5px auto;">'+$('.sidebar-section').html()+'</div>');
                $('.sidebar-section').first().hide();
            break;
			default:
			/* No Code */
		}
	}
     var pathx = window.location.pathname;
        if(~pathx.indexOf("/controls/user-settings/")){
    // Update
	$(document.body).on('click', '#fafcp_saveit', function() {
		var fafcp_set_nct = $("input[name='fafcp_nct']:checked").val();		var fafcp_set_sbg = $("input[name='fafcp_sbg']:checked").val();
		var fafcp_set_hs = $("input[name='fafcp_hs']:checked").val();		var fafcp_set_os = $("input[name='fafcp_os']:checked").val();
		var fafcp_set_sst = $("input[name='fafcp_sst']:checked").val();     var fafcp_set_sstpo = $("input[name='fafcp_sst']:checked").val();
        var fafcp_set_fn = $("input[name='fafcp_fn']:checked").val();       var fafcp_set_tp = $("input[name='fafcp_tp']:checked").val();
        var fafcp_set_nf = $("input[name='fafcp_nf']:checked").val();       var fafcp_set_bbf = $("input[name='fafcp_bbf']:checked").val();
		FAFCP_SaveSettings(fafcp_set_nct,fafcp_set_sbg,fafcp_set_hs,fafcp_set_os,fafcp_set_sst,fafcp_set_sstpo,fafcp_set_fn,fafcp_set_tp,fafcp_set_nf,fafcp_set_bbf);
		$('.faf-update-status_x').fadeIn('slow');
			setTimeout(function(){
				$('.faf-update-status_x').fadeOut('slow');
			}, 5000);
		});
		if(TemplateStyle=="/themes/beta"){
            $('.content .section-body').after(`
		<div id="customfacontrolpanel" style="border:1px dashed white; background: rgba(1,0,0,0.1); padding: 5px; border-radius: 5px; margin-top: 20px;">
			<h2>FA Fixes Control Panel <span class="faf-update-status_x" style="font-weight: bold; color: #02cc02; float:right; clear:right; display: none;">Update successful!</span></h2>
			<br/>
			<strong>No Custom Thumbnails</strong>
			<div class="control-panel-option">
				<div class="control-panel-item-1">
					<p>Disables Furaffinity from showing custom thumbnails on all submissions. Replacing the original thumbnails with a scaled down version of the actual submission.</p>
				</div>
				<div class="control-panel-item-2">
					<input type="radio" id="fafcp_nct_yes" name="fafcp_nct" value="yes" /><label for="fafcp_nct_yes">Enable</label><br/>
					<input type="radio" id="fafcp_nct_no" name="fafcp_nct" value="no"/><label for="fafcp_nct_no">Disable</label>
				</div>
			</div>
			<strong>Sidebar-Be-Gone</strong>
			<div class="control-panel-option">
				<div class="control-panel-item-1">
					<p>Relocates the sidebar off the screen, so it can be activated by hovering over it. <br/><i>Fixes the fullscreen submission bug</i></p>
				</div>
				<div class="control-panel-item-2">
					<input type="radio" id="fafcp_sbg_yes" name="fafcp_sbg" value="yes"/><label for="fafcp_sbg_yes">Enable</label><br/>
					<input type="radio" id="fafcp_sbg_no" name="fafcp_sbg" value="no"/><label for="fafcp_sbg_no">Disable</label>
				</div>
			</div>
			<strong>No Streams</strong>
			<div class="control-panel-option">
				<div class="control-panel-item-1">
					<p>Hides all stream notifications in the notifications centre.<br/><i><b>Important:</b> Does not change the notifications counter!</i></p>
				</div>
				<div class="control-panel-item-2">
					<input type="radio" id="fafcp_hs_yes" name="fafcp_hs" value="yes"/><label for="fafcp_hs_yes">Enable</label><br/>
					<input type="radio" id="fafcp_hs_no" name="fafcp_hs" value="no"/><label for="fafcp_hs_no">Disable</label>
				</div>
			</div>
			<strong>Obvious Streams</strong>
				<div class="control-panel-option">
					<div class="control-panel-item-1">
						<p>Re-styles stream notifications to make them more obvious in the notification's centre.</p>
					</div>
					<div class="control-panel-item-2">
						<input type="radio" id="fafcp_os_yes" name="fafcp_os" value="yes"/><label for="fafcp_os_yes">Enable</label><br/>
						<input type="radio" id="fafcp_os_no" name="fafcp_os" value="no"/><label for="fafcp_os_no">Disable</label>
					</div>
				</div>
				<strong>Same Size Thumbnails Submissions Only</strong>
				<div class="control-panel-option">
					<div class="control-panel-item-1">
						<p>Adjusts all thumbnails of submissions to be of the same size (150px x 150px)</p>
					</div>
					<div class="control-panel-item-2">
						<input type="radio" id="fafcp_sst_yes" name="fafcp_sst" value="yes"/><label for="fafcp_sst_yes">Enable</label><br/>
						<input type="radio" id="fafcp_sst_no" name="fafcp_sst" value="no"/><label for="fafcp_sst_no">Disable</label>
					</div>
				</div>
				<strong>Same Size Thumbnails Profiles Only</strong>
				<div class="control-panel-option">
					<div class="control-panel-item-1">
						<p>Adjusts all thumbnails on profile pages to be of the same size (150px x 150px)</p>
					</div>
					<div class="control-panel-item-2">
						<input type="radio" id="fafcp_sstpo_yes" name="fafcp_sstpo" value="yes"/><label for="fafcp_sstpo_yes">Enable</label><br/>
						<input type="radio" id="fafcp_sstpo_no" name="fafcp_sstpo" value="no"/><label for="fafcp_sstpo_no">Disable</label>
					</div>
				</div>
				<strong>Fixed Navigation</strong>
				<div class="control-panel-option">
					<div class="control-panel-item-1">
						<p>Places the navigation bar in a fixed position, so it scrolls with the page</p>
					</div>
					<div class="control-panel-item-2">
						<input type="radio" id="fafcp_fn_yes" name="fafcp_fn" value="yes"/><label for="fafcp_fn_yes">Enable</label><br/>
						<input type="radio" id="fafcp_fn_no" name="fafcp_fn" value="no"/><label for="fafcp_fn_no">Disable</label>
					</div>
				</div>
				<strong>Tidy Profile</strong>
				<div class="control-panel-option">
					<div class="control-panel-item-1">
						<p>Add's a scroll bar to the the user profile section, if it's determined to be too long, to avoid unnesscessary scrolling.</p>
					</div>
					<div class="control-panel-item-2">
						<input type="radio" id="fafcp_tp_yes" name="fafcp_tp" value="yes"/><label for="fafcp_tp_yes">Enable</label><br/>
						<input type="radio" id="fafcp_tp_no" name="fafcp_tp" value="no"/><label for="fafcp_tp_no">Disable</label>
					</div>
				</div>
				<strong>NoteFix</strong>
				<div class="control-panel-option">
					<div class="control-panel-item-1">
						<p>Fixes the almost invisible textboxes/textarea's</p>
					</div>
					<div class="control-panel-item-2">
						<input type="radio" id="fafcp_nf_yes" name="fafcp_nf" value="yes"/><label for="fafcp_nf_yes">Enable</label><br/>
						<input type="radio" id="fafcp_nf_no" name="fafcp_nf" value="no"/><label for="fafcp_nf_no">Disable</label>
					</div>
				</div>
				<strong>Bring Back Buttons</strong>
				<div class="control-panel-option">
					<div class="control-panel-item-1">
						<p>Brings back the submission buttons when the sidebar is hidden <br/> For widths between 480px &amp; 1070px</p>
					</div>
					<div class="control-panel-item-2">
						<input type="radio" id="fafcp_bbf_yes" name="fafcp_bbf" value="yes"/><label for="fafcp_bbf_yes">Enable</label><br/>
						<input type="radio" id="fafcp_bbf_no" name="fafcp_bbf" value="no"/><label for="fafcp_bbf_no">Disable</label>
					</div>
				</div>
				<div class="button-nav">
					<div class="button-nav-item">
						<input class="button mobile-button" id="fafcp_saveit" type="button" value="Save FAFCP Settings*">
					</div>
				</div>
						<br/><b>*Updates take effect from the next page load</b><br/><span style="font-size:10px;">FAFCP by <a href="https://www.furaffinity.net/user/feralfrenzy" style="border-bottom:1px dotted white;">JaysonHusky</a></span>
		</div>
	`);
    }
            else {
                $('.footer').before(`<table cellpadding="0" cellspacing="1" border="0" class="section maintable" style="width: 60%; margin: 0 auto;">
	<tbody>
		<tr>
			<td height="22" class="cat links">&nbsp;
				<strong>FurAffinity Fixes - Control Panel</strong> 
				<span class="faf-update-status" style="font-weight: bold; color: #7cfc00; float:right; clear:right; display: none;">Update successful!</span>
			</td>
		</tr>
		<tr>
			<td class="alt1 addpad ucp-site-settings" align="center">
				<table cellpadding="0" cellspacing="1" border="0">
					<tbody>
						<tr>
							<th><strong>No Streams</strong></th>
							<td>
								<input type="radio" id="fafcp_hs_yes" name="fafcp_hs" value="yes"/><label for="fafcp_hs_yes">Enable</label><br/>
								<input type="radio" id="fafcp_hs_no" name="fafcp_hs" value="no"/><label for="fafcp_hs_no">Disable</label>
							</td>
							<td class="option-description">
								<p>Hides all stream notifications in the notifications centre.<br/><i><b>Important:</b> Does not change the notifications counter!</i></p>
							</td>
						</tr>
						<tr>
							<th><strong>Obvious Streams</strong></th>
							<td>
								<input type="radio" id="fafcp_os_yes" name="fafcp_os" value="yes"/><label for="fafcp_os_yes">Enable</label><br/>
								<input type="radio" id="fafcp_os_no" name="fafcp_os" value="no"/><label for="fafcp_os_no">Disable</label>
							</td>
							<td class="option-description">
								<p>Re-styles stream notifications to make them more obvious in the notification's centre.</p>
							</td>
						</tr>
						<th class="noborder">&nbsp;</th>
							<td class="noborder">&nbsp;</td>
							<td class="option-description noborder">
								<br>
								<input class="button mobile-button" id="fafcp_saveit" type="button" value="Save FAFCP Settings*">
								<br/>
								<span style="font-size:10px;">FAFCP by <a href="https://www.furaffinity.net/user/feralfrenzy" style="border-bottom:1px dotted white;">JaysonHusky</a></span><br/><br/>
								<b>*Updates take effect from the next page load</b>
							</td>
					</tr>
				</tbody>
			</table>
`);
            }
        }
    // Load the users settings
    $.each(["fafcp_nct","fafcp_sbg","fafcp_hs","fafcp_os","fafcp_sst","fafcp_sstpo","fafcp_fn","fafcp_tp","fafcp_nf","fafcp_bbf"],function(i,l){
        FAFCP_LoadCP(l);
    });
    // Check and Run the Tweaks if required
   if(FAFCP_Load_Tweaks('fafcp_nct')=="yes"){ExecuteTweak('NoCustomThumbnails');}else{/* Do Nothing */}
    if(FAFCP_Load_Tweaks('fafcp_sbg')=="yes"){ExecuteTweak('SidebarBeGone');}else{/* Do Nothing */}
    if(FAFCP_Load_Tweaks('fafcp_hs')=="yes"){ExecuteTweak('HiddenStreams');}else{/* Do Nothing */}
    if(FAFCP_Load_Tweaks('fafcp_os')=="yes"){ExecuteTweak('ObviousStreams');}else{/* Do Nothing */}
    if(FAFCP_Load_Tweaks('fafcp_sst')=="yes"){ExecuteTweak('SameSizeThumbnails');}else{/* Do Nothing */}
    if(FAFCP_Load_Tweaks('fafcp_sstpo')=="yes"){ExecuteTweak('SameSizeThumbnailsPO');}else{/* Do Nothing */}
    if(FAFCP_Load_Tweaks('fafcp_fn')=="yes"){ExecuteTweak('FixedNavigation');}else{/* Do Nothing */}
    if(FAFCP_Load_Tweaks('fafcp_tp')=="yes"){ExecuteTweak('TidyProfile');}else{/* Do Nothing */}
    if(FAFCP_Load_Tweaks('fafcp_nf')=="yes"){ExecuteTweak('NoteFix');}else{/* Do Nothing */}
    if(FAFCP_Load_Tweaks('fafcp_bbf')=="yes"){ExecuteTweak('BringBackButtons');}else{/* Do Nothing */}
})();