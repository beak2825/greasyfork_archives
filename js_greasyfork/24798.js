// ==UserScript==
// @name        WF science paste to select box
// @namespace   http://www.war-facts.com/
// @description Adds a textarea for pasting in scientist names to select for a given project
// @include     http://www.war-facts.com/science.php
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24798/WF%20science%20paste%20to%20select%20box.user.js
// @updateURL https://update.greasyfork.org/scripts/24798/WF%20science%20paste%20to%20select%20box.meta.js
// ==/UserScript==
$(document).ready(function () {
	var textarea = '<textarea id="pasted-scientists-box" rows="4" cols="50" placeholder="Paste your scientists names here"></textarea>'
	var button = '<button id="pasted-scientists-btn">Select from textarea</button>'
	var newDiv = '<div>' + textarea + button + '</div>'
	$('#scitable').before(newDiv)
	
	$('#pasted-scientists-btn').on('click', function () {
		if ($('#location').val() == 0) {
			console.log('Unable to select scientists. You must pick a lab first')
		}
		
		var text = $('#pasted-scientists-box').val()
		if (text == '')
			return false
		
		var scientistsSplit = text.split(/[\n\t]+/)

		try {
			var added = 0
			for (var i = 0; i < scientistsSplit.length; i++) {
				var scientist = scientistsSplit[i]
				var scientistRow = $('#scitable').find('a')
					.filter(function(index) { return $.trim($(this).text()).toLowerCase() === $.trim(scientist).toLowerCase(); })
					.parents('tr')
					.first()
				
				if (scientistRow.length == 0) {
					console.log('We cant find the row for ' + scientist)
					continue
				}
				
				var id = scientistRow.attr('id').replace(/[a-zA-Z]/g, "")
				addSci(id)
				added++
			}
			console.log('Added %d scientists to project', added)
		} catch (err) {
			console.log('Error executing scientists selection from textarea')
			console.log(err)
		}

		return false // don't submit the form
	})
})