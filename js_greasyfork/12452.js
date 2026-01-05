// ==UserScript==
// @name          OutOfMilk.com Shopping List Enhancements
// @version       0.2.9
// @description   Collection of HTML/CSS enhancements for various bugs and/or shortcomings of the Shopping Lists page (/ShoppingList.aspx)
// @namespace     https://greasyfork.org/en/users/15562
// @author        Jonathan Brochu (https://greasyfork.org/en/users/15562)
// @license       GPLv3 or later (http://www.gnu.org/licenses/gpl-3.0.en.html)
// @match         https://outofmilk.com/shoppinglist.aspx*
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/12452/OutOfMilkcom%20Shopping%20List%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/12452/OutOfMilkcom%20Shopping%20List%20Enhancements.meta.js
// ==/UserScript==

/***
 * History:
 *
 * 0.2.9  Change made:
 *        - Removed legacy URLs, including unsecured ones.
 *        - Updated matched URL to "https://outofmilk.com/shoppinglist.aspx"
 *        - Within the mySaveProductHistory() fix, defining $.growlUIStatic()
 *          in case it isn't found when scoped back into unsecure content
 *          (but mostly, so JSLint can shut up about it not being defined).
 *        - Also in mySaveProductHistory(), just as with myAddShoppingItem(),
 *          now using $.growlUIStatic() for showing dialogs just as by the
 *          original code being replaced.
 *        (2022-04-21)
 * unrel  Changes made:
 *        - Commented out fix implemented through shoppingeditpopup_fix1(), as
 *          the related issue seems to have been fixed on the target page.
 *        - Fixed proper linking to "icon-taxfree.png" images used by templates
 *          by retrieving the relative path directly from them.
 *        - Before injecting re-implemented handlers & fixing functions, now
 *          making sure they exist.
 *        (2020-07-23)
 * 0.2.8  Change made:
 *        - For method mySaveProductHistory(), fixed how an item's properties
 *          are parsed, namely where the wrong jQuery function was being used
 *          to evaluate its value (e.g. {}.html() where it should have been
 *          {}.text()) and for integer/float values left as strings (where
 *          parseInt()/parseFloat() should have been used).
 *        (2020-04-27)
 * 0.2.7  Changes made:
 *        - Modified part where we reference the outside window.console object
 *          so we don't redefine the log() function of window.console with an
 *          empty function but instead define a local-scope console object.
 *        - Now using @match instead of @include in the metadata block.
 *        - For iconTaxFreeURLs_fix(), not using eval() anymore.
 *        - Made code cleanups here and there.
 *        (2019-10-09)
 * 0.2.6  Changes made:
 *        - Improved declarations of tool methods injectCode(), injectFuncCode()
 *          and replaceUnsafeFunc() to denote optional arguments supported for
 *          each. Also, reworked their code a bit.
 *        - For method replaceUnsafeFunc(), added support for two new optional
 *          arguments: the first one to specify the parent object whose function
 *          must be replaced, when it's not in the global scope (i.e. window);
 *          and the second to specify a delay before which the function
 *          replacement should be done, i.e. for objects or functions created
 *          (or exposed) through deferred scripts.
 *        - For methods injectCode() and injectFuncCode(), added as new optional
 *          argument the possibility to specify an execution delay, just like
 *          for replaceUnsafeFunc().
 *        - Added the possibility to specify a UPC when adding a new item to the
 *          shopping list. To do so, we add a new UPC field to the "New Item"
 *          form and then replace that form's handling method with a version
 *          supporting the new field.
 *          Unfortunately, for the time being it seems like the web service
 *          ignores any value used as the UPC (though to begin with the spec was
 *          already there to show how it should be passed when making the call).
 *        (2018-08-06)
 * 0.2.5  Changes made:
 *        - Tweaked the UPC parsing code a bit.
 *        - In the future, this script should be modified to allow users to
 *          provide their own link templates for looking up products by their
 *          stored UPC codes.
 *        (2016-08-09) *not publicly released
 * 0.2.4  Change made:
 *        - Completed the UPC parsing code, including expanding UPC-E barcodes,
 *          as part of the product links building added in version 0.2.3.
 *        (2016-06-21) *not publicly released
 * 0.2.3  Change made:
 *        - On the "Product History Management" dialog, added a column for
 *          links to the corresponding product on a (personally-used) grocery
 *          store website (IGA.net).
 *        (2016-06-02) *not publicly released
 * 0.2.2  Change made:
 *        - For the fix around the "Tax Free" checkbox of the "Edit Product
 *          History" dialog, a jQuery function call was failing so we're now
 *          using its DOM native equivalent.
 *        (2016-05-06)
 * 0.2.1  Changes made:
 *        - Fixed the always-unchecked "Tax Free" checkbox for the dialog
 *          "Edit Product History".
 *        - Updated element id for the "Description" field of the dialog
 *          "Edit Product History".
 *        (2016-01-24)
 * 0.2.0  Changes made:
 *        - Updated the "producthistory-template" template to match column
 *          names recently added by outofmilk.com, while at the same time
 *          disabling the CSS code previously used to display custom column
 *          headers.
 *        - Updated the "producthistory-template" template so that, like the
 *          original one, "Yes" & "No" are used as values for the "Tax Free?"
 *          column instead of "true" & "false".
 *        - Fixed the non-working "Tax Free" checkbox and empty "How Much?"
 *          dropdown list for dialog "shoppingeditpopup".
 *        - Fixed the URL used for the "icon-taxfree.png" image whenever
 *          adding or editing an item that is tax free.
 *        (2015-09-17)
 * 0.1.7  Changes made:
 *        - Updated script for use with the repository [greasyfork.org].
 *        - No change made to the code.
 *        (2015-09-14)
 * 0.1.6  Changes made:
 *        - Kept being annoyed that everytime I added/changed a UPC from the
 *          product history it wouldn't update, so now I re-implement method
 *          saveProductHistory() (from "ProductManagement.js?v=...") with the
 *          added tweaks (after all, I'm the one adding the column). Also,
 *          updated the producthistory template with a new class for that
 *          column.
 *          NOTE: I'll have to watch out for any updates/changes to the site
 *                as I replace the whole function, since obviously I cannot
 *                just patch the existing code. Oh, wait...
 *          NODO: I know they say "eval() is evil()", but what if I'd say the
 *                words "toString()", "String.replace()" and "eval()" in that
 *                particular order... OK, I'll leave that hanging in the air.
 *        - Took the opportunity to fix the call that sets the initial width
 *          of the "Product History Management" dialog, which was failing with
 *          errors of the sort "Permission denied to access property".
 *        (2015-06-30)
 * 0.1.5  Change made:
 *        - Added outofmilk.com as a possible domain for include URLs.
 *        (2015-04-02)
 * 0.1.4  Changes made:
 *        - Changed how the initial width of the "Product History Management"
 *          dialog is set.
 *        - Implemented changes to add a "UPC" column to the product history
 *          table (by changing its jQuery UI dialog template; this is possible
 *          since the web service's "GetAllProductHistoryItems" method already
 *          returns the stored UPC value for each history item).
 *        - Removed keep-alive code since no longer necessary.
 *        (2013-08-19)
 * 0.1.3  Changes made:
 *        - Removed "!important" when setting the (initial) width property of
 *          the "Product History Management" dialog (since the specified width
 *          isn't meant to be permanent).
 *        (2013-04-05)
 * 0.1.2  Changes made:
 *        - Added javascript code to keep the session alive (without the
 *          need to refresh the page).
 *        (2013-04-04)
 * 0.1.1  Changes made:
 *        - Added column names for dialog "Product History Management".
 *        - Changed text alignment for (newly-named) column "Tax Exempt".
 *        (2013-04-04)
 * 0.1.0  First implementation. (2013-04-02)
 *
 */

(function() {
    'use strict';

    // constants
    var USERSCRIPT_NAME = 'OutOfMilk.com Shopping List Enhancements';

/*
 * The Payload
 */

    // css definitions
    var css_fixes =
            '@namespace url(http://www.w3.org/1999/xhtml);\n' +
        // Changes & Overrides
            // background overlays for modal dialog with fixed postion
            '.ui-widget-overlay { position: fixed /* original: absolute */ !important ; }\n' +
            // "Product History Management" dialog - increase initial width
            //  '-> now done through javascript
            // //'div[aria-describedby="manageproducthistoryform"] { width: 80% /* original: 600px */ ; }\n' +
            // "Product History Management" dialog - take full parent's width for table within dialog
            'table.producthistory-table { width: 100% /* original: 550px */ !important ; }\n' +
            // "Product History Management" dialog - column headers
            // 2015-09-17: Column headers not needed anymore (done through the template itself)
            ///'table#producthistorytable.table-default > tr:nth-child(1) > th:nth-child(1) > strong:before { ' +
            ///        'content: "Item" /* original: (none specified) */ !important ; }\n' +
            ///'table#producthistorytable.table-default > tr:nth-child(1) > th:nth-child(3) > strong:before { ' +
            ///        'content: "Tax Exempt" /* original: (none specified) */ !important ; }\n' +
            ///'table#producthistorytable.table-default > tr:nth-child(1) > th:nth-child(4) > strong:before { ' +
            ///        'content: "Category" /* original: (none specified) */ !important ; }\n' +
            ///'table#producthistorytable.table-default > tr:nth-child(1) > th:nth-child(5) > strong:before { ' +
            ///        'content: "UPC" /* original: (none specified) */ !important ; }\n' +
            'table#producthistorytable.table-default > tr:nth-child(1) > th:nth-child(6):before { ' +
            ///        'content: "Actions" /* original: (none specified) */ !important ; ' +
                    'text-align: center /* original: left (through inheritance) */ !important ; ' +
                '}\n' +
            'table#producthistorytable.table-default > tr:nth-child(1) > th:nth-child(5) { ' +
                    'text-align: center /* original: left (through inheritance) */ !important ; ' +
                '}\n' +
            // "Product History Management" dialog - values for column "Tax Exempt" centered horizontally
            'td.producthistorytaxfree { text-align: center /* original: left (through inheritance) */ !important ; }\n' +
            // "Edit Product History" dialog - wider "Description" field
            '#txtEditProductHistoryDescription { ' +
                    'width: 380px /* original: (none specified) */ !important ; }\n' +
        // <END>
            '';

    // new "producthistory-template" template
    var templateProductHistory = function() {
/**HEREDOC
    <script type="producthistory-template">
        <##
        if (!String.prototype.reverse) {
            String.prototype.reverse = function() {
                return this.split('').reverse().join('');
            };
        }
        var eanCheckDigit = function(s) {
            var result = 0;
            var rs = s.reverse();
            for (counter = 0; counter < rs.length; counter++) {
                result = result + parseInt(rs.charAt(counter)) * Math.pow(3, ((counter+1) % 2));
            }
            return (10 - (result % 10)) % 10;
        };
        ##>
        <# if(this.dataobjects.length > 0) { #>
            <tr>
                <th><strong>Description</strong></th>
                <th><strong>Price</strong></th>
                <th><strong>Tax Free?</strong></th>
                <th><strong>Category</strong></th>
                <th><strong>UPC</strong></th>
                <th><strong>Links</strong></th>
                <th colspan="3">Actions</th>
            </tr>
            <# $.each(this.dataobjects, function(i, object) { #>
            <tr>
                <td class="producthistoryid hidden"><#= object.ID #></td>
                <td>
                    <span class="producthistorydescription"><#= trimDescription(object.Description,60,"<acronym title=\"" + object.Description + "\">...</acronym>") #></span>
                </td>
                <td class="producthistoryprice">
                    <span><#= FormatNumberCurrency(object.Price) #></span>
                </td>
                <td class="producthistorytaxfree">
                    <span>
                        <# if (object.TaxFree) { #>
                        Yes
                        <# } else { #>
                        No
                        <# } #>
                    </span>
                </td>
                <td class="producthistorycategory">
                    <span><#= object.CategoryName #></span>
                </td>
                <td class="producthistoryupc">
                    <span><#= object.UPC #></span>
                    <##
                    object.UPC = String(object.UPC);
                    if (object.UPC.length >= 12) {
                        object.UPC12 = object.UPC.substr(-12,12);
                        if (object.UPC12.substr(0,2) === '00') {
                            object.UPC12 = object.UPC12.substr(1,11);
                            object.UPC12 += eanCheckDigit(object.UPC12);
                        }
                    } else if (object.UPC.length === 6 && object.UPC.substr(0,1) === "F") {
                        object.UPC12 = '000000' + object.UPC.substr(1,5);
                        object.UPC12 += eanCheckDigit(object.UPC12);
                    } else if (object.UPC.length === 8) {
                        object.UPC12 = object.UPC.charAt(0);
                        switch (object.UPC.charAt(6)) {
                            case '0':
                            case '1':
                            case '2':
                                object.UPC12 += object.UPC.substr(1, 2) + object.UPC.substr(6, 1) + '0000' + object.UPC.substr(3, 3) + object.UPC.substr(7, 1);
                                break;
                            case '3':
                                object.UPC12 += object.UPC.substr(1, 3) + '00000' + object.UPC.substr(4, 2) + object.UPC.substr(7, 1);
                                break;
                            case '4':
                                object.UPC12 += object.UPC.substr(1, 4) + '00000' + object.UPC.substr(5, 1) + object.UPC.substr(7, 1);
                                break;
                            case '5':
                            case '6':
                            case '7':
                            case '8':
                            case '9':
                                object.UPC12 += object.UPC.substr(1, 5) + '0000' + object.UPC.substr(6, 1) + object.UPC.substr(7, 1);
                                break;
                            default: object.UPC12 = '';
                        }
                    } else {
                        object.UPC12 = '';
                    }
                    ##>
                </td>
                <td class="producthistorylink">
                    <span><# if (object.UPC12.length > 0) { #>
                        <a target="_blank" href="https://www.iga.net/en/search?k=00<#= object.UPC12.substr(0, 11) #>"><strong>IGA</strong></a>
                    <# } else { #>
                        &nbsp;
                    <# } #></span>
                </td>
                <td>
                    <a href="javascript:void(0);" class="btn-default addproducthistory"><span>Add To List</span></a>
                </td>
                <td>
                    <a href="javascript:void(0);" class="btn-default editproducthistory"><span>Edit</span></a>
                </td>
                <td class="last-column">
                    <a href="javascript:void(0);" class="btn-default deleteproducthistory"><span>Delete</span></a>
                </td>
            </tr>
            <# }); #>
        <# } else { #>
            <tr>
                <td colspan="5">There are no items to display</td>
            </tr>
        <# } #>
    </script>
HEREDOC**/
    };

    var validateProductHistoryForm = validateProductHistoryForm || window.validateProductHistoryForm || function() {},
        $ = $ || window.$ || function() {},
        FormatNumberCurrency = FormatNumberCurrency || window.FormatNumberCurrency || function() {},
        ShoppingEngine = ShoppingEngine || window.ShoppingEngine || { validateShoppingItemForm: function() {} },
        usedAutoComplete = usedAutoComplete || window.usedAutoComplete || false,
        ListID = ListID || window.ListID || {},
        gettext = gettext || window.gettext || {},
        globalRes = globalRes || window.globalRes || { TaxFree: false },
        STATIC_URL = STATIC_URL || window.STATIC_URL || "",
        FormatNumber = FormatNumber || window.FormatNumber || function() {},
        ListEngine = ListEngine || window.ListEngine || { bindListItemsEdit: function() {}, bindContextMenus: function() {} },
        sortLists = sortLists || window.sortLists || function() {},
        Apprise = Apprise || window.Apprise || function() {},
        jQuery = jQuery || window.jQuery || function() {};

    // new implementation of saveProductHistory()
    var mySaveProductHistory = function($this) {
        // new implementation:
        if(validateProductHistoryForm()){
            var ID = parseInt($(".editproducthistoryid").text(), 10);
            var description = $(".editproducthistorydescription").val();
            var price = parseFloat($(".editproducthistoryprice").val());
            var taxfree = $(".editproducthistorytaxfree input").is(":checked");
            var upc = $(".editproducthistoryupc").val();

            var Params = { "ID": ID, "description": description, "price": price, "upc": upc, "taxfree": taxfree };
            var jQueryParams = JSON.stringify(Params);

            $.growlUIStatic = (typeof $.growlUIStatic === 'function')
                ? $.growlUIStatic
                : function(title, message, onClose) {
                    var $m = $('<div class="growlUI"></div>');
                    if (title) $m.append('<h1>'+title+'</h1>');
                    if (message) $m.append('<h2>'+message+'</h2>');
                    $.blockUI({
                        message: $m, fadeIn: 700, fadeOut: 1000, centerY: false,
                        timeout: 0, showOverlay: false,
                        onUnblock: onClose,
                        css: $.blockUI.defaults.growlCSS
                    });
                };
            $.growlUIStatic(gettext('Please wait...'), gettext('Saving changes to product history item...'));

            $.ajax({
                type: "POST",
                url: "Services/GenericService.asmx/UpdateProductHistoryItem",
                data: jQueryParams,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (msg) {
                    $.unblockUI();
                    if(msg.d === false){
                        $(".producthistoryitemvalidation").html(gettext("An item already exists with this description and price!"));
                    } else {
                        var $element = $(".producthistoryid:contains("+ID+")").parents("tr");
                        $element.find(".producthistorydescription").html(description);
                        $element.find(".producthistoryprice").html(FormatNumberCurrency(price));
        /* added --> */ $element.find(".producthistoryupc").html(upc);
                        if(taxfree) {
                            $element.find(".producthistorytaxfree").html("Yes");
                        } else {
                            $element.find(".producthistorytaxfree").html("No");
                        }
                        $.growlUI(gettext('Success!'), gettext('Changes to product history item saved'));
                        $this.dialog("close");
                    }
                },
                failure: function (data) {
                    $.unblockUI();
                    $.growlUI(gettext('Warning'), gettext('Deleting product history item failed!'));
                }
            });
        }
    };
    // of course, I could also do something like:
    /*
        eval('var mySaveProductHistory = ' +
            unsafeWindow.saveProductHistory.toString().replace(/(html\(FormatNumberCurrency\(price\)\);)/, '$1\n$$element.find(".producthistoryupc").html(upc);')
        );
    */
    // but, would blindly patching code be actually better than
    //   replacing a whole function? Yeah, I thought so.

    // 2018-08-06: new implementation of ShoppingEngine.addShoppingItem() to add a UPC field
    // NOTE: Not my code; I only added not even half a line
    var myAddShoppingItem = function() {
        // new implementation:
        if (ShoppingEngine.validateShoppingItemForm($(".shoppinglistitem"), false) != false) {
            var $element = $(".shoppinglistitem");

            var description = $element.find(".itemdescription").val();
            var quantity = $element.find(".itemquantity").val();
            var unit = $element.find(".itemunit").val();
            var unittext = $element.find(".itemunit option:selected").text();
            var price = $element.find(".itemprice").val();
            var note = $element.find(".itemnote").val();
            var taxfree = $element.find(".taxfree input").is(":checked");
            var category = $element.find(".itemcategory").val();
            // 2018-08-06: Added a UPC field
            var UPC = $element.find(".itemupc").val() || '';

            if (usedAutoComplete == undefined) { usedAutoComplete = false; }

            var Params = { "ID": ListID, "usedAutoComplete": usedAutoComplete, "description": description, "quantity": quantity, "unit": unit, "price": price, "note": note, "taxfree": taxfree, "upc": UPC, "category": category, "promoproviderpromotionid": "", "promoproviderstaticid": 0, "useMinOrdinal": false, "isEmailPromo": false };
            var jQueryParams = JSON.stringify(Params);

            $.growlUI(gettext('Please Wait...'), gettext('Adding your item to the list!'));

            $.ajax({
                type: "POST",
                url: "Services/GenericService.asmx/AddShoppingItem",
                data: jQueryParams,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (msg) {
                    var Data = JSON.parse(msg.d);

                    var $template = $(".itemtemplate").clone();

                    var flagsText = "";
                    if (taxfree || note.length > 0) {
                        flagsText = "<div class='additionalitems clearfix'>";
                        if (taxfree) {
                            flagsText = flagsText + "&nbsp; <acronym title='" + globalRes.TaxFree + "'><img src='"+ STATIC_URL +"images/icon-taxfree.png' /></acronym>";
                        }
                        if (note.length > 0) {
                            flagsText = flagsText + "&nbsp; <acronym title=\"" + note.replace(/\"/g, '\'') + "\"><img src='"+ STATIC_URL +"images/icon-note.png' /></acronym>";
                        }
                        flagsText = flagsText + "</div>";
                    }

                    $template.find(".cell-title").html(flagsText).text(description);
                    $template.find(".cell-qty").html(FormatNumber(quantity) + " " + unittext);
                    $template.find(".cell-price").html(FormatNumberCurrency(Data.Price));
                    $template.find(".productid").html(Data.ID);
                    $template.find(".itemguid").html(Data.GUID);
                    $template.find(".createddate").html(Data.Created);
                    $template.removeClass("hidden");
                    $template.removeClass("itemtemplate");
                    $template.attr("id", "item_" + Data.ID);

                    //Find all categories on the list and then insert before if we have a category, and insert after the beginning if we don't.

                    //if we have a category but it's not actually on the list, that means it was a newly created category list from the add item
                    //so we will check for that and do a full list refresh if that's the case
                    var foundCategory = false;
                    if (Data.Category) {
                        $(".category").each(function () {
                            var catID = $(this).attr("id").split("cat_")[1];
                            if (Data.Category == catID) {
                                $template.insertAfter($(this));
                                foundCategory = true;
                            }
                        })
                    } else {
                        //if there was no category set this to true so that we dont have a full refresh
                        foundCategory = true;
                        $template.insertAfter("#table_totals");
                    }

                    $("#sortable tbody").sortable('refresh', { items: 'tr:not(.tabletop):not(.itemtemplate)' });
                    ListEngine.bindListItemsEdit();
                    ShoppingEngine.updateShoppingListPrice();
                    ListEngine.bindContextMenus();

                    sortLists(true);

                    usedAutoComplete = false;

                    if (!foundCategory) {
                        $("#btn-refresh-list").click();
                    }

                    //Bind the click event for toggling an items status
                    ListEngine.toggleItemStatus();
                },
                error: function (msg) {
                    Apprise(gettext("Failed to insert item. Please try again.") + "<br /><br />" + gettext("If this problem persists, please contact us at") + " <a href='https://outofmilk.zendesk.com/hc/en-us/requests/new'>Support Request</a>", { 'confirm': true });
                }
            });

            return true;
        } else {
            return false;
        }
    };

    // 2015-09-17: fix for the "Tax Free" checkbox not working in the "shoppingeditpopup" dialog
/*
    var shoppingeditpopup_fix1 = function() {
        // find the "Tax Free" checkbox and its <div> container
        var $element = $(".shoppingeditpopup"),
            taxfree = $element.find("input#checkbox1"),
            taxfreeParentDiv = taxfree.parent();
        // add the missing "taxfree" class, such that in method
        // ShoppingEngine.updateShoppingItem() the line:
        // ---
        // var taxfree = $element.find(".taxfree input").is(":checked");
        // ---
        // works properly
        taxfreeParentDiv.addClass('taxfree');
    };
*/
    // 2015-09-17: fix for the empty <select> element in the "shoppingeditpopup" dialog
    var shoppingeditpopup_fix2 = function() {
        // find the "How Much?" <select> element for units (removing any children in the process)
        var $element = $(".shoppingeditpopup"),
            editUnits = $element.find("select#drpUnitsEdit").find("option").remove().end(),
            itemUnitOptions = $(".shoppinglistitem").find("select.itemunit").find("option");
        // copy the options for the "shoppinglistitem" dialog
        $.each(itemUnitOptions, function() {
            editUnits.append($("<option />").val($(this).val()).text($(this).text()));
        });
    };

    // 2015-09-17: methods ShoppingEngine.addShoppingItem() & ShoppingEngine.updateShoppingItem()
    //             don't use proper links for "icon-taxfree.png"; fix that
    var iconTaxFreeURLs_fix = function() {
        // 2020-07-23: now retrieving link to "icon-taxfree.png" directly from template
        var templateSrc = $("script[type='product-template']"),
            toReplaceSrc = "src='../static/images/icon-taxfree.png'",
            taxfreeIconRE = /<# *if\(object\.TaxFree\) *\{ *#>\s+((?:.(?!<#))+)\s*<# *\} *#>/m,
            taxFreeIconResult = taxfreeIconRE.exec(templateSrc.html()),
            taxFreeIconHTML = (typeof taxFreeIconResult[1] !== 'undefined' ? taxFreeIconResult[1] : ''),
            taxFreeIconSrc = '';
        if (taxFreeIconHTML) {
            try {
                taxFreeIconSrc = /src="([^"]+\/icon-taxfree.png)"/.exec(taxFreeIconHTML)[1];
                console.log(taxFreeIconSrc);
            } catch(e) { /* ignore */ }
        }
        $.each(['updateShoppingItem'], function() {
            (new Function("this.ShoppingEngine." + this + " = " +
                          ShoppingEngine[this].toString().replace(
                              toReplaceSrc,
                              (taxFreeIconSrc ? "src='" + taxFreeIconSrc + "'" : "src='\"+ STATIC_URL +\"images/icon-taxfree.png'")
                          ))
            ).call(window);
        });
    };

    // 2016-01-24: fix for the missing "producthistorytaxfree" class in the "editproducthistoryform" dialog
    var editproducthistory_fix1 = function() {
        // find the "Tax Free" <input type="checkbox"> element and its <td> parent
        var taxfree = $("#txtEditProductHistorytaxfree"),
            taxfreeParentTD = taxfree.parent();
        // add the missing "producthistorytaxfree" class, so that the lines
        //   $(".editproducthistorytaxfree input").attr("checked", true);
        //   $(".editproducthistorytaxfree input").attr("checked", false);
        // work as intended
        taxfreeParentTD.addClass('editproducthistorytaxfree');
    };

    // 2016-01-24: fix for the "Tax Free" checkbox being always unchecked in the "editproducthistoryform" dialog
    var editproducthistory_fix2 = function() {
        // hook the "Manage Product History" button/link at right
        $(".manageproducts").on("click", function() {
            $(".editproducthistory").off();
            $(".editproducthistory").on("click", function() {
                var $parent = $(this).parents("tr");
                var ID = $parent.find(".producthistoryid").html();
                var description = $parent.find(".producthistorydescription").html();
                var price = $parent.find(".producthistoryprice").html();
                var Params = { "ID": ID };
                var jQueryParams = JSON.stringify(Params);
                $.growlUI('<img src="' + STATIC_URL + 'images/monster-help.png" />Please Wait...', 'Loading Product History item...');
                $.ajax({
                    type: "POST",
                    url: "Services/GenericService.asmx/GetProductHistoryItem",
                    data: jQueryParams,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (msg) {
                        $(".editproducthistorydescription").val(msg.d.Description);
                        $(".editproducthistoryprice").val(FormatNumber(msg.d.Price));
                        $(".editproducthistoryid").html(msg.d.ID);
                        $(".editproducthistoryupc").val(msg.d.UPC);
                        $(".editproducthistorytaxfree input").removeAttribute("checked");
                        if (msg.d.TaxFree) {
                            $(".editproducthistorytaxfree input").checked = true;
                        } else {
                            $(".editproducthistorytaxfree input").checked = false;
                        }
                        $("#editproducthistoryform").find('input').keypress(function (e) {
                            if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
                                $(".ui-dialog[aria-labelledby='ui-dialog-title-editproducthistoryform']").find('.ui-dialog-buttonpane').find('button:first').click();
                                return false;
                            }
                        });
                        $("#editproducthistoryform").dialog("open");
                    },
                    failure: function (msg) {
                    }
                });
            });
        });
    };

    // 2018-08-06: fix for adding a UPC field to the "New Item" form
    var listadditemform_fix = function() {
        // get form
        var $element = jQuery('.shoppinglistitem').first();
        // make sure we don't already have the UPC field present
        if ($element.length > 0 && $element.find('.itemupc').length == 0) {
            var itemPriceElem = $element.find('.itemprice').first();
            if (!itemPriceElem) { return; }
            itemPriceElem.parent().after('<strong><span>UPC (if any)</span><input type="text" value="" class="textbox itemupc"></strong>');
        }
    };

/*
 * The Tools
 */

    // heredoc parser
    var getHeredoc = function(container, identifier) {
        // **WARNING**: Inputs not filtered (e.g. types, illegal chars within regex, etc.)
        var re = new RegExp("/\\*\\*" + identifier + "[\\n\\r]+[\\s\\S]*?[\\n\\r]+" + identifier + "\\*\\*/", "m");
        var str = container.toString();
        str = re.exec(str).toString();
        str = str.replace(new RegExp("/\\*\\*" + identifier + "[\\n\\r]+",'m'),'').toString();
        return str.replace(new RegExp("[\\n\\r]+" +identifier + "\\*\\*/",'m'),'').toString();
    };

    // template substitution
    var replaceDialogTemplate = function(templateName, newContent) {
        var scripts = document.getElementsByTagName('script');
        if (scripts.length > 0) {
            for (var i = 0; i < scripts.length; i++) {
                if (scripts[i].getAttribute('type') == templateName) {
                    var newText = newContent.toString();
                    // remove comments
                    newText = newText.replace(/\/\*(?:\r\n|\r|\n|.)+?\*\//gm, '').replace(/\/\/.+$/g, '');
                    // remove empty lines
                    newText = newText.replace(/$\s*\r\n/g, '');
                    // make sure switch() blocks have their first case statement on the same line
                    newText = newText.replace(/switch\s*\([^\{]+\)(\s*)\{(\s*)case/gm, function(match, p1, p2) {
                        return match.replace(p1, ' ').replace(p2, ' ');
                    });
                    // process custom <## [..] ##> blocks
                    newText = newText.replace(/\<##\s*((?:\r\n|\r|\n|.)+?)\s*##\>/gm, function(match, p) {
                            return p.split(/\r\n|\r|\n/g).map(function(item, idx) {
                                return item.replace(/^(\s*)(.*)/g, function(match, p1, p2) {
                                    return p1 + '<# ' + p2.trim() + ' #>';
                                });
                            }).join("\r\n");
                        });
                    // replace template content
                    newText = newText.replace(/^[\r\n\s]*<script[^>]*>|<\/script>[\r\n\s]*$/g, '');
                    scripts[i].innerHTML = newText;
                    return;
                }
            }
        }
    };

    // code injection
    var injectCode = function(code /* , idUniq = '', execDelay = 0 */){
        // get call arguments
        var idUniq = '',
            execDelay = 0,
            tmpScript = document.createElement('script');
        tmpScript.id = '__iC_script-'+Math.random().toString().slice(2);
        // argument #2 (optional): <script> element ID suffix
        if (arguments.length > 1) {
            idUniq = '_' + /[$_a-zA-Z][$_a-zA-Z0-9]*/.exec(arguments[1])[0] || '';
        }
        tmpScript.id = tmpScript.id + idUniq;
        // argument #3 (optional): execution delay
        if (arguments.length > 2) {
            execDelay = (arguments[2] === 'domready' ? arguments[2] : (parseInt(arguments[2]) || 0));
        }
        tmpScript.type = 'text/javascript';
        tmpScript.textContent = (function() {
            return [
                ';'+(
                    execDelay === 'domready' ? '$(document).ready(' :
                    (0+execDelay > 0 ? 'window.setTimeout(' : '(')
                )+(function () {
                    /*code*/
                    var thisScript = document.getElementById('/*scriptId*/');
                    if (thisScript) { thisScript.parentNode.removeChild(thisScript); } // <-- oh no, you didn't!!
                }).toString()+(
                    execDelay === 'domready' ? ')' :
                    (0+execDelay > 0 ? ', '+execDelay+')' : ')()')
                )+';',
                { k: 'code', v: (typeof(code) == 'string' && code.trim().length > 0 ? code : '/*failed*/') },
                { k: 'scriptId', v: tmpScript.id }
            ].reduce(function(base, mapping){
                return base.replace('/*'+mapping.k+'*/', mapping.v);
             });
        })();
        // inject temporary script
        document.head.appendChild(tmpScript);
    };
    var injectFuncCode = function(func /* , idUniq = '', execDelay = 0 */){
        // make sure we got passed a function
        if (typeof(func) !== 'function') return;
        // get call arguments
        var idUniq = (arguments.length > 1 ? arguments[1] : ''),
            execDelay = (arguments.length > 2 ? (arguments[2] === 'domready' ? arguments[2] : (parseInt(arguments[2]) || 0)) : 0),
            wrapper = '('+func.toString()+')();';
        // inject temporary script
        injectCode(wrapper, idUniq, execDelay);
    };

    // code injection, specialized
    // inspiration: https://greasyfork.org/en/scripts/2599-gm-2-port-function-override-helper/code
    var replaceUnsafeFunc = function(targetName, newFuncImpl /* , idUniq = '', thisScope = 'window', execDelay = 0 */){
        // get call arguments
        var idUniq = '',
            thisScope = 'window',
            execDelay = 0,
            tmpScript = document.createElement('script');
        tmpScript.id = '__rUF_script-'+Math.random().toString().slice(2);
        // argument #3 (optional): <script> element ID suffix
        if (arguments.length > 2) {
            idUniq = '_' + /[$_a-zA-Z][$_a-zA-Z0-9]*/.exec(arguments[2])[0] || '';
        }
        tmpScript.id = tmpScript.id + idUniq;
        // argument #4 (optional): scope of function to replace; by default, window (global)
        if (arguments.length > 3) {
            thisScope = ''+arguments[3].replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '') || 'window';
        }
        // argument #5 (optional): execution delay
        if (arguments.length > 4) {
            execDelay = (arguments[4] === 'domready' ? arguments[4] : (parseInt(arguments[4]) || 0));
        }
        tmpScript.type = 'text/javascript';
        tmpScript.textContent = (function() {
            return [
                ';'+(
                    execDelay === 'domready' ? '$(document).ready(' :
                    (0+execDelay > 0 ? 'window.setTimeout(' : '(')
                )+(function () {
                    try {
                        window/*scope*/ /*target*/ = /*newFunc*/window;
                    } catch(_err) {
                        console.log('Error in replaceUnsafeFunc() payload with id "/*scriptId*/": ' + _err.message);
                    }
                    var thisScript = document.getElementById('/*scriptId*/');
                    if (thisScript) { thisScript.parentNode.removeChild(thisScript); } // <-- oh no, you didn't!!
                }).toString()+(
                    execDelay === 'domready' ? ')' :
                    (0+execDelay > 0 ? ', '+execDelay+')' : ')()')
                )+';',
                { k: 'scope', v: '.'+thisScope },
                { k: 'target', v: '.'+(typeof(targetName) == 'string' && targetName.trim().length > 0 ? targetName : '_void') },
                { k: 'newFunc', v: (typeof(newFuncImpl) == 'function' ? newFuncImpl : function(){}).toString()+';//' },
                { k: 'scriptId', v: tmpScript.id }
            ].reduce(function(base, mapping){
                // 2018-08-06: replaced [String].replace() with [String].split().join()
                ///return base.replace('/*'+mapping.k+'*/', mapping.v);
                return base.split('/*'+mapping.k+'*/').join(''+mapping.v);
             });
        })();
        // inject temporary script
        document.head.appendChild(tmpScript);
    };

    // reference some outside objects
    var console = window.console || (function() {
        if (typeof(unsafeWindow) == 'undefined') return { 'log': function() {} };
        return unsafeWindow.console;
    })();

    // self-explanatory
    document.addStyle = function(css /*, media */) {
        var media = (arguments.length > 1 ? arguments[1] : false);
        if (typeof(GM_addStyle) != 'undefined' && !media) {
            GM_addStyle(css);
            return true;
        } else {
            if (!media) { media = 'all'; }
            var heads = this.getElementsByTagName('head');
            if (heads.length > 0) {
                var node = this.createElement('style');
                node.type = 'text/css';
                if (media) node.media = media;
                if (node.appendChild(this.createTextNode(css))) {
                    return (typeof heads[0].appendChild(node) != 'undefined');
                }
            }
            return false;
        }
    };

/*
 * The Action
 */

    // css injection
    document.addStyle(css_fixes);

    // javascript patching
    try {
        // replace template "producthistory-template"
        if (templateProductHistory) {
            replaceDialogTemplate('producthistory-template', getHeredoc(templateProductHistory, 'HEREDOC'));
        }

        // replace saveProductHistory()
        if (typeof mySaveProductHistory === 'function') {
            replaceUnsafeFunc('saveProductHistory', mySaveProductHistory, 'mySaveProductHistory');
        }

        // 2018-08-06: replace ShoppingEngine.addShoppingItem()
        if (typeof myAddShoppingItem === 'function') {
            replaceUnsafeFunc('addShoppingItem', myAddShoppingItem, 'myAddShoppingItem', 'ShoppingEngine', 'domready');
        }

        // 2018-08-06: add the UPC text field to the "New Item" form
        if (typeof listadditemform_fix === 'function') {
            injectFuncCode(listadditemform_fix, 'listadditemform_fix');
        }

        // set initial width of "Product History Management" dialog
        ///replaceUnsafeFunc('onload', function(){ $("#manageproducthistoryform").dialog("option", "width", "80%"); }, 'onload');
        // 2018-08-06: now making use of new features added to injectCode() and injectFuncCode()
        injectFuncCode(function(){ $("#manageproducthistoryform").dialog("option", "width", "80%"); }, 'manageproducthistoryform_fix', 'domready');

        // 2015-09-17: fixes for the "shoppingeditpopup" dialog
        if (typeof shoppingeditpopup_fix1 === 'function') {
            injectFuncCode(shoppingeditpopup_fix1, 'shoppingeditpopup_fix1');
        }
        if (typeof shoppingeditpopup_fix2 === 'function') {
            injectFuncCode(shoppingeditpopup_fix2, 'shoppingeditpopup_fix2');
        }

        // 2016-01-24: fixes for the "editproducthistoryform" dialog
        if (typeof editproducthistory_fix1 === 'function') {
            injectFuncCode(editproducthistory_fix1, 'editproducthistory_fix1');
        }
        if (typeof editproducthistory_fix2 === 'function') {
            injectFuncCode(editproducthistory_fix2, 'editproducthistory_fix2');
        }

        // 2015-09-17: fixes for "icon-taxfree.png" URLs
        if (typeof iconTaxFreeURLs_fix === 'function') {
            injectFuncCode(iconTaxFreeURLs_fix, 'iconTaxFreeURLs_fix');
        }
    } catch(err) {
        console.log(err);
    }

/*
 * The End
 */

    console.log('User script "' + USERSCRIPT_NAME + '" has completed.');
})();