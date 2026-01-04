// ==UserScript==
// @name NetSuite email template helper
// @namespace netsuite.com
// @author dandyer
// @description auto-update data-center specific urls in templates on load
// @version 0.12
// @include *
// @downloadURL https://update.greasyfork.org/scripts/31806/NetSuite%20email%20template%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/31806/NetSuite%20email%20template%20helper.meta.js
// ==/UserScript==

jQuery(function() {
	// email template find+replace
	var isEmailTemplatePage = window.location.pathname == '/app/crm/common/merge/emailtemplate.nl',
		isEditMode = window.location.search.indexOf('e=T') > 0;
	if (isEmailTemplatePage && isEditMode)
	{
		jQuery('h1.uir-record-type').click(function(e){
			(console || { log: function(e) {} } ).log('NetSuite-email-template-helper.init()');
			var baseNetSuiteDomains = [
					'http://system.netsuite.com',
					'https://system.netsuite.com',
					'https://checkout.netsuite.com',
					'https://forms.netsuite.com',
					'https://shopping.netsuite.com'
				],
				hasChanges = false;

			if (jQuery('#cke_1_contents > textarea').length === 0)
		  		jQuery('#cke_15').click();

		  	for (var i = 0; i < baseNetSuiteDomains.length; ++i) {
		  		var baseNetSuiteDomain = baseNetSuiteDomains[i],
		  			cssSelector = '.CodeMirror-code .cm-string:contains("' + baseNetSuiteDomain + '")';
				jQuery(cssSelector).each(function() {
				    var html = jQuery(this).html();
				    if (html.indexOf(baseNetSuiteDomain) > 0)
				    	hasChanges = true;
				    jQuery(this).html(html.replace(baseNetSuiteDomain, ''));
				});
			}

			var notifyHtml = '<i> - no changes</i>';
			if (hasChanges)
				notifyHtml = '<i style="color:red"> - auto-updated</i>';

			jQuery('h1.uir-record-type').append(jQuery(notifyHtml));
		});

		//jQuery('h1.uir-record-type').click();
	}
});