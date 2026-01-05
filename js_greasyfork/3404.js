// ==UserScript==
// @name        Solr Admin Helper
// @author      Hang Yuan
// @namespace   hyuan.solr
// @description Options
// @include     //cdnjs.cloudflare.com/ajax/libs/require.js/2.1.14/require.min.js
// @version     1.1.9
// @match       */solr/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/3404/Solr%20Admin%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/3404/Solr%20Admin%20Helper.meta.js
// ==/UserScript==

require.config({
    packages: [
        { name: 'jquery', location: '//code.jquery.com/jquery-2.1.1.min', main: 'jquery-2.1.1.min' }
        , { name: 'jqueryui', location: '//code.jquery.com/ui/1.11.0', main: 'jquery-ui' }
		, { name: 'css', location: '//cdnjs.cloudflare.com/ajax/libs/require-css/0.1.1', main: 'css' }
        , { name: 'domReady', location: '//cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1', main: 'domReady.min' }
    ]
    , shim: {
        'jquery': { exports: 'jquery' }
        , 'jqueryui': { exports: 'jqueryui', deps: ['jquery', 'css!jqueryui/themes/smoothness/jquery-ui'] }
    }
	, map: {
		'*': {
			'css': 'css' // or whatever the path to require-css is
		}
	}
});

require(['jquery', 'jqueryui', 'css!jqueryui/themes/smoothness/jquery-ui', 'domReady'], 
		function($) {
   $(document).ready(function() {
		console.log('initializing ...');

		function addCss(cssString) {
			var head = document.getElementsByTagName('head')[0];
			//text-alignreturn unless head;
			var newCss = document.createElement('style');
			newCss.type = "text/css";
			newCss.innerHTML = cssString;
			head.appendChild(newCss);
		}

		function getSelection() {
			if (window.getSelection) {
				return window.getSelection().toString();
			} else if (document.selection && document.selection.type != "Control") {
				return document.selection.createRange().text;
			}
		}
		
		var ID_REGEXP = /<str name="id">(.*?)<\/str>/gi;
		function extractId(val) {
			var match = ID_REGEXP.exec($.trim(val));
			ID_REGEXP.lastIndex = 0; // XXX need to reset the lastIndex to make the RegExp object reusable
			return (match && match[1] || '').replace(/([\/:])/g, '\\$1');
		}
		
		function getRecordIds(q) {
			var command = {
				'q': q
				,'fl': 'id'
			};
			
			return $.ajax({
				url: location.protocol + '//' + location.host + '/solr/feedback/select/?wt=json&' + $.param(command)
				, type  : 'GET'
				, contentType : 'application/json'
				, dataType : 'json'
			});
		}
		
		function deleteRecord(id) {
			var command = {
				"delete": { "id": id }
			};
			
			return $.ajax({
				url: location.protocol + '//' + location.host + '/solr/feedback/update/?commit=true'
				, type  : 'POST'
				, contentType : 'application/json'
				, dataType : 'json'
				, data: JSON.stringify(command)
			});
		}
		
		function modifyRecord(id, field, value) {
			var record = {};
			record.id = id;
			if (value == 'NULL') {
				record[field] = { "set": null };
			} else {
				record[field] = { "set": value };
			}

			return $.ajax({
				url: location.protocol + '//' + location.host + '/solr/feedback/update/?commit=true'
				, type  : 'POST'
				, contentType : 'application/json'
				, dataType : 'json'
				, data: JSON.stringify([record])
			});
		}
			
		function setUpModifyButton() {
			var $modifyRecordDialog = $('<div title="Modify Record">'
					+ '<form><fieldset>'
					+ '<label for="solrRecordModifier_id">ID</label>'
					+ '<input type="text" name="solrRecordModifier_id" id="solrRecordModifier_id" value="" class="text ui-widget-content ui-corner-all" size="70">'
					+ '<label for="solrRecordModifier_field">Field</label>'
					+ '<input type="text" name="solrRecordModifier_field" id="solrRecordModifier_field" value="" class="text ui-widget-content ui-corner-all" size="70">'
					+ '<label for="solrRecordModifier_value">New Value</label>'
					+ '<input type="text" name="solrRecordModifier_value" id="solrRecordModifier_value" value="" class="text ui-widget-content ui-corner-all" size="70">'
					+ '<input type="submit" tabindex="-1" style="position:absolute; top:-1000px">'
					+ '</fieldset></from>'
					+ '</div>');
			
			$modifyRecordDialog.dialog({
				autoOpen: false,
				resizable: true,
				width:530,
				modal: true,
				buttons: {
					"Submit": function() {
						var dialog = this;
						modifyRecord($idInput.val(), $fieldInput.val(), $valueInput.val())
						.done(function() {
							$( dialog ).dialog( "close" );
						})
						.fail(function(jqXHR, textStatus) {
								alert('Failed to modify the specified record. \n\n' + jqXHR.responseText);
						});
					},
					Cancel: function() {
						$( this ).dialog( "close" );
					}
				}
			})
			
			var $idInput = $modifyRecordDialog.find('#solrRecordModifier_id');
			var $fieldInput = $modifyRecordDialog.find('#solrRecordModifier_field');
			var $valueInput = $modifyRecordDialog.find('#solrRecordModifier_value');
			
			var modifyBtn = $('<button id="solrRecordModifier">Modify</button>');
			modifyBtn.insertAfter($('#form button:last'));
			modifyBtn.click(function(event) {
				event.preventDefault();
				$idInput.val(extractId(getSelection()));
				$modifyRecordDialog.dialog('open');
			});
		}
		
		function setUpDeleteButton() {
			var $deleteRecordDialog = $('<div title="Delete Record">'
					+ '<p>Are sure to delete the record</p>'
					+ '<div class="form"><form><fieldset><div class="fieldset">'
					+ '<label for="solrRecordDeleter_id">ID</label>'
					+ '<input type="text" name="solrRecordDeleter_id" id="solrRecordDeleter_id" value="" class="text ui-widget-content ui-corner-all" size="70">'
					+ '</div></fieldset></from></div>'
					+ '</div>');
			
			$deleteRecordDialog.dialog({
				autoOpen: false,
				resizable: true,
				width:530,
				modal: true,
				buttons: {
					"Delete": function() {
						var dialog = this;
						if ($idInput.val()) {
							deleteRecord($idInput.val())
							.done(function() {
								$( dialog ).dialog( "close" );
							})
							.fail(function(jqXHR, textStatus) {
								alert('Failed to delete the specified record. \n\n' + jqXHR.responseText);
							});
						}
					},
					Cancel: function(jqXHR, textStatus, errorThrown ) {
						$( this ).dialog( "close" );
					}
				}
			});
			
			var $idInput = $deleteRecordDialog.find('#solrRecordDeleter_id');
			
			var deleteBtn = $('<button id="solrRecordDeleter">Delete</button>');
			deleteBtn.insertAfter($('#form button:last'));
			deleteBtn.click(function(event) {
				event.preventDefault();
			
				$idInput.val(extractId(getSelection()));
				$deleteRecordDialog.dialog('open');
			});
		}
		
       $(document).one('click', function() {
			addCss (
				'.ui-dialog-content fieldset { border: 0; text-align: left ! important; }'
				+ '.ui-dialog-content label, .ui-dialog-content input { display: block; }'
				+ '.ui-dialog-content input.text { margin-bottom: 12px; padding: 0.4em; width: 95%; }'
			);
			
			setUpModifyButton();
			setUpDeleteButton();
       });
   });

});