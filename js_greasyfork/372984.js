// ==UserScript==
// @name Specter: Defaults & Hints
// @namespace Vapes Scripts
// @description Toggle and input default values for Specter
// @version  2.1.4
// @grant    none
// @require  https://code.jquery.com/jquery-3.3.1.min.js
// @match https://specter.se/*
// @match https://*.specter.se/*
// @downloadURL https://update.greasyfork.org/scripts/372984/Specter%3A%20Defaults%20%20Hints.user.js
// @updateURL https://update.greasyfork.org/scripts/372984/Specter%3A%20Defaults%20%20Hints.meta.js
// ==/UserScript==

var params = {}

function load () {
	params.frame = document.getElementsByName('main')[0] || false
  params.target = params.frame ? params.frame.contentDocument : window.document
  params.url = params.frame ? params.frame.contentWindow.location.href : window.location.href

  params.querystrings = (key) => {
    const search = (new URL(params.url)).search.substring(1)
    var obj = search ? JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}') : {}
    return key ? obj[key] : obj
  }

  runScript(params)
}

var $ = (selector, target) => {
  return jQuery(selector, target ? target : (params.frame ? jQuery(params.frame)[0].contentWindow.document : window.document))
}

load()

function toggle (selector, state) {
  $(selector).each(function(){ this.checked = state; });
}

function setValue (selector, val) {
	$(selector).each(function(){ this.value = val; });
}

function setCSS (selector, styleObj) {
	$(selector).each(function(){ $(this).css(styleObj) });
}

function runScript (params) {
  if (params.frame) {
		console.log('load')
    params.frame.addEventListener('load', load, true)
  }

	var css = {
		error: {background: 'red', color: 'white'},
		warning: {background: '#ffce73', color: 'black'},
		accepted: {background: 'green', color: 'white'}
	}

  if (window.location.href == 'https://login.specter.se/') {
    $('#SystemName').val('vapes')
  }

	if ((params.querystrings().action === "newTradeInvoice")) {
		var EORI = "SE5590795265"
		var incoterm = "DDU 022"
		setCSS($('#termsOfSale, #totalNoOfPackages, #emballageWeight, #eoriNo'), css.warning)
		$('#eoriNo').val(EORI)
		$('#termsOfSale').val(incoterm)
		$('#totalNoOfPackages').val(1)
		//$('#emballageWeight').bind("click", function (e) {
		//	var totalweight = parseFloat(prompt('Ange total vikt för att beräkna extra-emballage automatiskt.'))
		//	var productsweight = jQuery('#emballageWeight').parent().text().match(/\S*$/)[0].replace('kg)', '')
		//	$(this).val((totalweight-productsweight).toFixed(2))
		//});
	}

	if ((params.querystrings().action === "doInventory")) {
		toggle($('#toggleNoItems'), true)
		$('#noItems').prop('disabled', false)
		var barcode = $('#barcode')
		barcode.bind("keyup change", function(e) {
			barcode.val($(this).val().replace('+', '-'))
		})
	}

	if ((params.querystrings()).action === "newDelivery" && window.location.href.indexOf("purchaseDelivery") > -1) {
		toggle('#deliveryToggleCheckboxes', false)
		toggle('[id^=toDeliverId]', false)
		setValue('[id^=noItemsRowId]', '')
		setCSS('[id^=noItemsRowId]', css.error)

		$('[name^=noItemsRowId]').bind("keyup change blur", function(e) {
			var toggle_element = $(this).parent().parent().find('[id^=toDeliverId]').first()
			var max_qty = $(this).siblings('[name^=maxNoItemsRowId]').first().val()
			var qty = $(this).val()

			var isEmpty = !qty || qty == 0 || qty == ''
			var isOver = qty > max_qty
			var isUnder = qty < max_qty
			var isEqual = qty == max_qty
			var isNumeric = !isNaN(qty)

			if (!isNumeric) {
				setValue($(this), '')
			}

			if (!isEmpty && isNumeric) {
				toggle(toggle_element, true)
			} else {
				toggle(toggle_element, false)
			}

			if (!isEmpty && isEqual && isNumeric) {
				setCSS($(this), css.accepted)
			} else if (!isEmpty && !isEqual && isNumeric) {
				setCSS($(this), css.warning)
			} else {
				setCSS($(this), css.error)
			}
		})
	}

  if ((params.querystrings()).action === "viewPicklistCollection") {
    toggle('#picklistCollection-showArticleNumber', true)
    toggle('#picklistCollection-showArticleGroup', false)
    toggle('#orderConfirmation-generateBarcodeOnOrder', true)
    toggle('#picklistCollection-showSupplierArticleNumber', false)
    toggle('#picklistCollection-showPickingTrolleyBasketNumbers', true)
    toggle('#orderConfirmation-showInvoicePositionOnOrder', true)
  }
  if ((params.querystrings()).action === "newDelivery") {

		var order = {
			weightInput: null,
			weight: null,
			newWeight: null,
			lowFromStart: false,
			deliveryMethod: null,
			calculatedWeight: null
		}

		var additionalWeight = {
			boxSmall: {
				weight: 0.06,
				paper: 0.04
			},
			boxMedium: {
				weight: 0.096,
				paper: 0.045
			},
			boxMediumTall: {
				weight: 0.116,
				paper: 0.05
			},
			boxLarge: {
				weight: 0.141,
				paper: 0.55
			},
			envelopeSmall: {
				weight: 0.009
			},
			envelopeMedium: {
				weight: 0.013
			},
			envelopeLarge: {
				weight: 0.020
			},
			envelopeExtraLarge: {
				weight: 0.033
			},
			bagSmall: {
				weight: 0.009
			},
			bagLarge: {
				weight: 0.005
			}
		}

    var toggleEmailNotification = function () {
      toggle($('input[name="FS_emailNotification"]'), false)
      switch(order.deliveryMethodVal) {
        case "3": // 'PostNord Varubrev 1:a Klass'
        case "4": //'PostNord MyPack Collect'
        case "6": //'PostNord Rekommenderat Brev'
          toggle($('input[name="FS_emailNotification"]'), true)
          break;
      }
    }

		var autocomplete = function () {
			order.weightInput.focus()
			var formRows = $('#newDelivery .centerTable.table-container tbody tr')
	    $(formRows[1]).css({opacity: 0.1})
	    $(formRows[5]).css({opacity: 0.1})
	    $(formRows[7]).css({opacity: 0.1})
	    $(formRows[9]).css({opacity: 0.1})
	    toggle($('input[name="deliveryDoPrint"]'), false)
	    toggle($('input[name="deliverySendToFS"]'), true)
	    toggle($('input[name="deliveryOpenFS"]'), false)
	    toggle($('input[name="deliveryReturnlabel"]'), false)
		}

		var calculate = function () {
			order.weightInput = $('#FS_weight')
			order.weight = order.weightInput.val()
			order.lowFromStart = false
			order.deliveryMethodEl = $('#deliveryMethodId')
			order.deliveryMethodVal = order.deliveryMethodEl.val()
			order.calculatedWeight = 0

			$('[name^=productWeightRowId]').each(function () {
				var articleRow = $(this).closest('tr')
				var weight = $(this).val()
				var sku = $(articleRow).children('td').first().text()
				var toDeliver = $(articleRow).find('[name^=noItemsRowId]').val()
				var totalWeight = weight * toDeliver
				order.calculatedWeight += totalWeight
			});

	    if (order.weight < 0.15) {
	      $('<span id="weightOriginal"> - ('+order.weight+' kg från början. Lägsta värde är 0.15 kg)</span>').appendTo($(order.weightInput).parent())
	      order.lowFromStart = true
	      $(order.weightInput).css(css.warning)
	      $(order.weightInput).val(0.15)
	    } else {
	      $('<span id="weightOriginal"> - ('+order.weight+' kg från början. Lägsta värde är 0.15 kg)</span>').appendTo($(order.weightInput).parent())
	      order.lowFromStart = false
	      $(order.weightInput).css(css.accepted)
			}

			order.weightInput.bind("keyup change", function(e) {
				order.newWeight = parseFloat(order.weightInput.val().replace(',', '.'))
				if (order.newWeight < 0.15) {
					$(this).css(css.error)
					$('#createDel').prop('disabled',true)
					$('#createDelAndInv').prop('disabled',true)
				} else if (order.newWeight > 0.14 && order.lowFromStart) {
					$(this).css(css.accepted)
					$('#createDel').prop('disabled',false)
					$('#createDelAndInv').prop('disabled',false)
				} else {
					$(this).css(css.accepted)
					$('#createDel').prop('disabled',false)
					$('#createDelAndInv').prop('disabled',false)
				}
			})

			console.log(order)
		}

		calculate()
    toggleEmailNotification()
    autocomplete()

    order.deliveryMethodEl.change( () => {
      toggleEmailNotification()
			calculate()
    })

		order.weightInput.bind("keyup change blur", function(e) {
			toggleEmailNotification()
		})



  }
}
