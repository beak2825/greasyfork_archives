// ==UserScript==
// @name         Easier Burlington EDI Coat Routing AutoFill
// @namespace    https://greasyfork.org/users/4756
// @author       saibotshamtul (Michael Cimino)
// @version      0.3
// @description  try to take over the world!
// @match        https://edi.coat.com/gateway/new_shipment.do*
// @match        https://edi.coat.com/gateway/search_po.do*
// @match        https://edi.coat.com/gateway/selected_pos.do*
// @match        https://edi.coat.com/gateway/search_items.do*
// @match        https://edi.coat.com/gateway/search_sites.do*
// @match        https://edi.coat.com/gateway/customized_qty_cartons.do*
// @match        https://edi.coat.com/gateway/drafts.do*
// @match        https://edi.coat.com/gateway/asn.do*
// @match        https://edi.coat.com/gateway/invoices.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369226/Easier%20Burlington%20EDI%20Coat%20Routing%20AutoFill.user.js
// @updateURL https://update.greasyfork.org/scripts/369226/Easier%20Burlington%20EDI%20Coat%20Routing%20AutoFill.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (location.href.indexOf('new_shipment.do')>-1){
        setTimeout(function(){
            //choose LTL
            OptTransMethod.children[10].selected = true;
            //choose Ship to DC
            OptShippingType.children[3].selected = true;
            //choose the scac code UNKN
            let SCACs = OptSCACCode.children;
            for (var a of SCACs){
                let scac = a.innerText.slice(0,4);
                if (scac==="UNKN"){
                    a.selected = true;
                    break
                }
            }
            txtFromName.value = "American Stitch";
            txtFromAddress1.value = "265 Coles Street";
            txtFromCity.value = "Jersey City";
            txtFromState.value = "NJ";
            txtFromZip.value = "07310";
            //choose US
            let countries = txtFromCountry.children;
            for (var b of countries){
                if (b.value==="US"){
                    b.selected = true;
                    break
                }
            }

        },1000);
    }
    if (location.href.indexOf('search_po.do')>-1){
        setTimeout(function(){
            //replace the confirm dialog box with one that alsays choses ok
            let window_confirm = confirm;
            console.log('original confirm function stored');
            window.confirm = function(x){
                console.log('replacement confirm function called');
                return true;
            }
            try {
                // choose Customized qtys & ctns
                let containertablecollapsible = document.querySelector('#containertable.collapsible').children[1].children[1].children[5].children[0].children;

                let firstrun = containertablecollapsible[0].selected;

                for (var c of containertablecollapsible){
                    if (c.innerText.slice(0,6)==="Custom"){
                        c.selected = true;
                        break
                    }
                }
                // choose solid carton
                let pack_code_children = pack_code.children;
                for (var d of pack_code_children){
                    if (d.innerText.indexOf("Solid Carton")>-1){
                        d.selected = true;
                        break
                    }
                }

                //save these changes
                if (firstrun){
                    document.querySelectorAll('#containertable.collapsible input')[1].click();
                }
            }
            catch(e){}

        },1000);
    }
    if (location.href.indexOf('selected_pos.do')>-1){
        setTimeout(function(){
            //replace the confirm dialog box with one that alsays choses ok
            let window_confirm = confirm;
            console.log('original confirm function stored');
            window.confirm = function(x){
                console.log('replacement confirm function called');
                return true;
            }

            try {
                // choose Customized qtys & ctns
                let containertablecollapsible = document.querySelector('#containertable.collapsible').children[1].children[1].children[5].children[0].children;

                let firstrun = containertablecollapsible[0].selected;

                for (var c of containertablecollapsible){
                    if (c.innerText.slice(0,6)==="Custom"){
                        c.selected = true;
                        break
                    }
                }
                // choose solid carton
                let pack_code_children = pack_code.children;
                for (var d of pack_code_children){
                    if (d.innerText.indexOf("Solid Carton")>-1){
                        d.selected = true;
                        break
                    }
                }

                //save these changes
                if (firstrun){
                    document.querySelectorAll('#containertable.collapsible input')[1].click();
                }
            }
            catch(e){}

        },1000);
        }

    if (location.href.indexOf('search_items.do')>-1){
        setTimeout(function(){
            //replace the confirm dialog box with one that alsays choses ok
            let window_confirm = confirm;
            console.log('original confirm function stored');
            window.confirm = function(x){
                console.log('replacement confirm function called');
                return true;
            }
            //choose the DC
            document.querySelector("#pos").children[1].children[0].children[0].children[0].checked = true;
            let inputfields = document.querySelectorAll("#containertable.simple input.field");
            for (let a of inputfields){
                if (a.value=="Add Selected"){
                    a.click();
                }
            }
        },250);
    }
    if (location.href.indexOf('search_sites.do')>-1){
        setTimeout(function(){
            //replace the confirm dialog box with one that alsays choses ok
            let window_confirm = confirm;
            console.log('original confirm function stored');
            window.confirm = function(x){
                console.log('replacement confirm function called');
                return true;
            }

            /*
            let packagingCodeSelect = document.querySelector("[name=packagingCodeSelect]").children;
            let firstrun = packagingCodeSelect[0].selected;
            for (var f of packagingCodeSelect){
                if (f.innerText.indexOf("Physical Container - Carton")>-1){
                    //f.selected = true;
                    //break;
                }
            }
            //save these changes
            if (firstrun){
                //document.querySelector("[name=SaveCarton]").click();
            }*/
        },1000);
    }
    if (location.href.indexOf('customized_qty_cartons.do')>-1){
        setTimeout(function(){
            //replace the confirm dialog box with one that alsays choses ok
            let window_confirm = confirm;
            console.log('original confirm function stored');
            window.confirm = function(x){
                console.log('replacement confirm function called');
                return true;
            }
        },1000);
    }
//2018-06-14
    if (location.href.indexOf('drafts.do')>-1){
        setTimeout(function(){
            //replace the confirm dialog box with one that alsays choses ok
            let window_confirm = confirm;
            console.log('original confirm function stored');
            window.confirm = function(x){
                console.log('replacement confirm function called');
                return true;
            }
            webshipmentid.focus();
        },1000);
    }
    if (location.href.indexOf('asn.do')>-1){
        setTimeout(function(){
            /*
            //replace the confirm dialog box with one that alsays choses ok
            let window_confirm = confirm;
            console.log('original confirm function stored');
            window.confirm = function(x){
                console.log('replacement confirm function called');
                return true;
            }
            */
            document.location.href = document.location.href.replace("asn","invoices") + "&showInvoiceTab=Y";
        },250);
    }

    if (location.href.indexOf('invoices.do')>-1){
        setTimeout(function(){

            //replace the confirm dialog box with one that alsays choses ok
            let window_confirm = confirm;
            console.log('original confirm function stored');
            window.confirm = function(x){
                console.log('replacement confirm function called');
                return true;
            }

            //document.querySelector('[value="Edit Invoice"]').click();
            //setTimeout(function(){
            try {
                var firstrun = document.querySelector('#containertable #filtertable .odd :nth-Child(2) :nth-child(1)').value
                if (firstrun===""){
                    //copy the PO to the invoice number
                    //document.querySelector('#containertable #filtertable .odd :nth-Child(2) :nth-child(1)').value = document.querySelector('#containertable #filtertable .odd :nth-Child(8)').innerText;
                    document.querySelector('#containertable #filtertable .odd :nth-Child(2) :nth-child(1)').focus();
                    //click save
                    //document.querySelector('[name=saveButton]').click()
                    //},1000);
                }
            }
            catch(e){}
        },1000);
    }

})();