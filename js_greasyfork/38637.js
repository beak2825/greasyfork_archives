// ==UserScript==
// @name         MFC Manager+
// @namespace    https://myfigurecollection.net/profile/tharglet
// @version      1.3
// @description  Mass-editing controls for the MFC Manager
// @author       Tharglet
// @match        https://myfigurecollection.net/manager/collection/owned/
// @match        https://myfigurecollection.net/manager/collection/
// @match        https://myfigurecollection.net/manager.v4.php?*mode=collection*&tab=owned*
// @require      http://code.jquery.com/jquery-2.1.3.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery.form/4.2.2/jquery.form.min.js
// @require      https://code.jquery.com/color/jquery.color-2.1.2.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.20.1/moment.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/38637/MFC%20Manager%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/38637/MFC%20Manager%2B.meta.js
// ==/UserScript==

////////LICENCE////////
//This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/.
//Please credit 'Tharglet' for the original code, and provide a link to my MFC profile: https://myfigurecollection.net/profile/tharglet
///////////////////////

//Polyfill for GM_addStyle for Greasemonkey...
if(typeof GM_addStyle == 'undefined') {
    GM_addStyle = (aCss) => {
        'use strict';
        let head = document.getElementsByTagName('head')[0];
        if (head) {
            let style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.textContent = aCss;
            head.appendChild(style);
            return style;
        }
        return null;
    };
}

GM_addStyle(`.quickadd-input {
background: #fff;
border: 1px solid #ccc;
border-radius: 2px;
box-sizing: border-box;
display: block;
float: left;
margin: 0 4px 0 0;
padding: 3px 8px;
position: relative;
}

.quickadd-option {
box-sizing: border-box;
display: block;
float: left;
position: relative;
margin: 4px 4px 4px 0;
padding: 4px;
background: #eee;
border-radius: 12px;
}

.quickadd-option label {
margin: 0 16px 0 4px;
}

.quickadd-label {
clear: both;
display: block;
float: left;
line-height: 28px;
margin: 0 4px 0 0;
padding: 3px 8px;
width: 100px;
}

ul.quickadd li {
border-bottom: none;
}

.save-counter {
display: none;
padding-left: 10px;
}

.listing-item-meta.collection-meta.error {
color:firebrick;
}

.quickadd-input.invalid {
border-color: firebrick;
}

.quickadd-error {
float: left;
color: firebrick;
line-height: 28px;
margin: 0 4px 0 0;
padding: 3px 8px;
}`);

(function() {
    'use strict';
    function validateDate(dateToValidateEntity) {
        var dateToValidate = dateToValidateEntity.val();
        if(dateToValidate == '0000-00-00' || dateToValidate == '') return true;
        if(!dateToValidate.match(/(\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/)) {
            dateToValidateEntity.parent().addClass("invalid");
            return false;
        } else {
            try {
                new Date(dateToValidate);
            } catch(err) {
                dateToValidateEntity.parent().addClass("invalid");
                return false;
            }
            return true;
        }
    }

    function validateForm(listItem) {
        var formValid = true;
        var ownedDate = listItem.find("input[name=ownedDate]");
        var paidDate = listItem.find("input[name=paidDate]");
        var shippedDate = listItem.find("input[name=shippedDate]");
        var count = listItem.find("input[name=count]");
        var price = listItem.find("input[name=orderedPrice]");
        ownedDate.parent().removeClass("invalid");
        paidDate.parent().removeClass("invalid");
        shippedDate.parent().removeClass("invalid");
        count.parent().removeClass("invalid");
        price.parent().removeClass("invalid");
        if(!validateDate(ownedDate)) {
            formValid = false;
        }
        if(!validateDate(paidDate)) {
            formValid = false;
        }
        if(!validateDate(shippedDate)) {
            formValid = false;
        }
        if(!Number.isInteger(parseInt(count.val()))) {
            formValid = false;
            count.parent().addClass("invalid");
        } else if(count.val() > 99 || count.val() < 1) {
            formValid = false;
            count.parent().addClass("invalid");
        }
        if(!(price.val() == '' || price.val().match(/^\d{1,7}(\.\d{1,2})?$/))) {
            formValid = false;
            price.parent().addClass("invalid");
        }
        return formValid;
    }

    function updateCollectionMetadata(listItem, dateFormat, currency) {
        var collectionItems = listItem.find(".collection-meta-item");
        collectionItems.each(function() {$(this).empty();});
        //DIV ONE
        //Update Date
        var date = listItem.find("input[name=ownedDate]").val();
        if(date == '0000-00-00' || date == '') {
            $(collectionItems.get(0)).removeClass('time').append('<span class="tiny-icon-before icon-calendar-times-o"></span>No Date');
        } else {
            var formattedDate = moment(date, 'YYYY-mm-DD').format(dateFormat);
            $(collectionItems.get(0)).addClass('time').append('<span class="tiny-icon-before icon-calendar-check-o"></span>' + formattedDate);
        }
        //DIV TWO
        //Update count
        $(collectionItems.get(1)).append('<span class="tiny-icon-before icon-check-circle"></span>×' + listItem.find("input[name=count]").val());
        //Update Various
        var various = listItem.find("input[name=subStatus]:checked").val();
        switch(various) {
            case '1':
                $(collectionItems.get(1)).append('<br/><span class="tiny-icon-before icon-users"></span>Second-hand');
                break;
            case '2':
                $(collectionItems.get(1)).append('<br/><span class="tiny-icon-before icon-certificate"></span>Sealed');
                break;
            case '3':
                $(collectionItems.get(1)).append('<br/><span class="tiny-icon-before icon-archive"></span>Stored');
                break;
        }
        //DIV THREE
        //if price, show shop and price
        //if shop, just show shop
        var location = listItem.find("input[name=orderedLocation]").val();
        var price = listItem.find("input[name=orderedPrice]").val();
        var displayPrice = price;
        var priceAsFloat = parseFloat(price);
        if(Number.isInteger(priceAsFloat)) {
            displayPrice = priceAsFloat.toFixed(0);
        } else {
            displayPrice = priceAsFloat.toFixed(2);
        }
        if(price > 0) {
            //Update location
            $(collectionItems.get(2)).append('<span class="tiny-icon-before icon-map-marker"></span>');
            if(location == '') {
                $(collectionItems.get(2)).append('?');
            } else {
                $(collectionItems.get(2)).append(location);
            }
            //Update price
            $(collectionItems.get(2)).append('<br/><span class="tiny-icon-before icon-tag"></span>' + displayPrice + ' ' + currency);
        } else {
            if(location != '') {
                $(collectionItems.get(2)).append('<span class="tiny-icon-before icon-map-marker"></span>' + location);
            }
        }
        listItem.find("input[name=orderedPrice]").val(priceAsFloat.toFixed(2));
    }

    $().ready(function() {
        var dateFormat = 'Y/mm/DD';
        var currency = '';
        $.get('https://myfigurecollection.net/settings/', function(data) {
            dateFormat = $(data).find("input[name=dateFormat]:checked").val().replace('d', 'DD').replace('m', 'mm');
            currency = $(data).find("select[name=currency]").find(":selected").val();
        });
        $("form.tbx-window li.listing-filter").append("<input id='save-all' value='Save all' type='button' style='display:inline-block'/><div class='save-counter'>Saved: <span id='save-all-counter'></span>, Failures: <span id='save-all-counter-fails'>0</span></div>");
        $("#save-all").click(function() {
            var count = $(".quickadd-form").size();
            $("#save-all-counter").text("0/" + count);
            var counter = 0;
            var fails = 0;
            $("#save-all-counter-fails").text("0");
            $(".quickadd-form").each(function() {
                var theForm = $(this).parent().parent();
                theForm.find(".quickadd-error").text('');
                if(validateForm(theForm)) {
                    $(this).ajaxSubmit({
                        url: "/item/" + $(this).attr("data-id"),
                        type: 'post',
                        success: function() {
                            $(".save-counter").css("display", "inline-block");
                            counter++;
                            $("#save-all-counter").text(counter + "/" + count);
                            theForm.animate({backgroundColor: '#ccffcc'}, 'fast').delay(2000).animate({backgroundColor: '#ffffff'}, 'slow');
                        },
                        error: function() {
                            $(".save-counter").css("display", "inline-block");
                            counter++;
                            fails++;
                            $("#save-all-counter").text(counter + "/" + count);
                            $("#save-all-counter-fails").text(fails);
                            theForm.find(".quickadd-error").text('Failed to communicate with MFC');
                            theForm.animate({backgroundColor: '#ffcccc'}, 'fast');
                        }
                    });
                } else {
                    $(".save-counter").css("display", "inline-block");
                    counter++;
                    fails++;
                    $("#save-all-counter").text(counter + "/" + count);
                    $("#save-all-counter-fails").text(fails);
                    theForm.animate({backgroundColor: '#ffcccc'}, 'fast');
                }
            });
        });
        $(".listing-item").each(function() {
            var itemId = $(this).find("div.listing-checkable meta").attr("content");
            $(this).append('<div id="loader-' + itemId + '" class="listing-item-meta collection-meta"><img src="https://static.myfigurecollection.net/ressources/loading.svg" alt="Loading"></div>');
        });
        var taborder = 1;
        var fieldCount = 13;
        $(".listing-item").each(function() {
            var itemId = $(this).find("div.listing-checkable meta").attr("content");
            var listItem = $(this);
            var formData = {"commit":"loadWindow", "window":"collectItem"};
            var tabs = taborder;
            $.ajax({
                url:"https://myfigurecollection.net/item/" + itemId,
                type:"POST",
                data: formData,
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                dataType: "json",
                success: function(data){
                    var windowContents = $.parseHTML("<form><div>" + data.htmlValues.WINDOW);
                    $("#loader-" + itemId).remove();
                    var shippingMethod = $(windowContents).find("select[name=shippingMethod]").find(":selected").val();
                    var various = $(windowContents).find("input[name=subStatus]:checked").val();
                    listItem.append("<div class='listing-item-meta collection-meta'><form class='quickadd-form' data-id='" + itemId + "' id='quickadd-" + itemId + "' method='post' action='/item/" + itemId + "'>" +
                                    '<input type="hidden" name="targets[]" value="COLLECT" class="tbx-targets">'+
                                    '<input type="hidden" name="targets[]" value="COLLECTION" class="tbx-targets">' +
                                    '<input type="hidden" name="status" value="2">' +
                                    '<input type="hidden" name="previousStatus" value="2">' +
                                    '<input type="hidden" name="commit" value="collectItem">' +
                                    '<input type="hidden" name="targets[]" value="ITEM' + itemId + '" class="tbx-targets">' +
                                    '<ul class="quickadd">' +
                                    "<li><div class='quickadd-label'>Ordered Date: </div><div class='quickadd-input'><input name='ownedDate' type='text' tabindex=" + tabs++ + " value='" + $(windowContents).find("input[name=ownedDate]").val() + "'></div></li>" +
                                    "<li><div class='quickadd-label'>Paid Date: </div><div class='quickadd-input'><input name='paidDate' type='text' tabindex=" + tabs++ + " value='" + $(windowContents).find("input[name=paidDate]").val() + "'></div></li>" +
                                    "<li><div class='quickadd-label'>Shipped Date: </div><div class='quickadd-input'><input name='shippedDate' type='text' tabindex=" + tabs++ + " value='" + $(windowContents).find("input[name=shippedDate]").val() + "'></div></li>" +
                                    "<li><div class='quickadd-label'>Count: </div><div class='quickadd-input'><input name='count' type='text' tabindex=" + tabs++ + " value='" + $(windowContents).find("input[name=count]").val() + "'></div></li>" +
                                    "<li><div class='quickadd-label'>Price: </div><div class='quickadd-input'><input name='orderedPrice' type='text' tabindex=" + tabs++ + " value='" + $(windowContents).find("input[name=orderedPrice]").val() + "'></div></li>" +
                                    "<li><div class='quickadd-label'>Shop: </div><div class='quickadd-input'><input name='orderedLocation' type='text' maxlength=32 tabindex=" + tabs++ + " value='" + $(windowContents).find("input[name=orderedLocation]").val() + "'></div></li>" +
                                    "<li><div class='quickadd-label'>Tracking: </div><div class='quickadd-input'>" +
                                    "<select name='shippingMethod' tabindex=" + tabs++ + ">" +
                                    "<option value='0'" + (shippingMethod==0?" selected='selected'":"") + ">n/a</option>" +
                                    "<option value='1'" + (shippingMethod==1?" selected='selected'":"") + ">EMS</option>" +
                                    "<option value='2'" + (shippingMethod==2?" selected='selected'":"") + ">SAL</option>" +
                                    "<option value='3'" + (shippingMethod==3?" selected='selected'":"") + ">AIRMAIL</option>" +
                                    "<option value='4'" + (shippingMethod==4?" selected='selected'":"") + ">SURFACE</option>" +
                                    "<option value='5'" + (shippingMethod==5?" selected='selected'":"") + ">FEDEX</option>" +
                                    "<option value='6'" + (shippingMethod==6?" selected='selected'":"") + ">DHL</option>" +
                                    "<option value='7'" + (shippingMethod==7?" selected='selected'":"") + ">Colissimo</option>" +
                                    "<option value='8'" + (shippingMethod==8?" selected='selected'":"") + ">UPS</option>" +
                                    "<option value='9'" + (shippingMethod==9?" selected='selected'":"") + ">Domestic</option></select>" +
                                    " | <input name='trackingNumber' type='text' maxlength=32 tabindex=" + tabs++ + " value='" + $(windowContents).find("input[name=trackingNumber]").val() + "'></div></li>" +
                                    "<li><div class='quickadd-label'>Various:</div>" +
                                    "<div class='quickadd-option'><input name='subStatus' id='rd-rd-subStatus-0' tabindex=" + tabs++ + " type='radio'" + (various==0?" checked='checked'":"") + " value='0'>&nbsp;<label for='rd-rd-subStatus-0'>-</label></div>" +
                                    "<div class='quickadd-option'><input name='subStatus' id='rd-rd-subStatus-1' tabindex=" + tabs++ + " type='radio'" + (various==1?" checked='checked'":"") + " value='1'>&nbsp;<label for='rd-rd-subStatus-1'>Second-hand</label></div>" +
                                    "<div class='quickadd-option'><input name='subStatus' id='rd-rd-subStatus-2' tabindex=" + tabs++ + " type='radio'" + (various==2?" checked='checked'":"") + " value='2'>&nbsp;<label for='rd-rd-subStatus-2'>Sealed</label></div>" +
                                    "<div class='quickadd-option'><input name='subStatus' id='rd-rd-subStatus-3' tabindex=" + tabs++ + " type='radio'" + (various==3?" checked='checked'":"") + " value='3'>&nbsp;<label for='rd-rd-subStatus-3'>Stored</label></div>" +
                                    "</li>" +
                                    "<li><div class='quickadd-label'><input id='save-" + itemId + "' tabindex=" + tabs++ + " value='Save' type='button' style='display:inline-block'/></div><div class='quickadd-error'></div></li>" +
                                    '</ul>' +
                                    "</div></form>");
                    $("#save-" + itemId).click(function() {
                        listItem.find(".quickadd-error").text('');
                        if(validateForm(listItem)) {
                            $("#quickadd-" + itemId).ajaxSubmit({
                                url: "/item/" + itemId, type: 'post',
                                success: function() {
                                    listItem.animate({backgroundColor: '#ccffcc'}, 'fast').delay(2000).animate({backgroundColor: '#ffffff'}, 'slow');
                                    updateCollectionMetadata(listItem, dateFormat, currency);
                                },
                                error: function() {
                                    listItem.find(".quickadd-error").text('Failed to communicate with MFC');
                                    listItem.animate({backgroundColor: '#ffcccc'}, 'fast').delay(2000).animate({backgroundColor: '#ffffff'}, 'slow');
                                }
                            });
                        } else {
                            listItem.animate({backgroundColor: '#ffcccc'}, 'fast').delay(2000).animate({backgroundColor: '#ffffff'}, 'slow');
                        }
                    });
                },
                error: function() {
                    $("#loader-" + itemId).remove();
                    listItem.append("<div class='listing-item-meta collection-meta error'>Failed to load mass-editor fragment!</div>");
                }
            });
            taborder += fieldCount;
        });
    });
})();