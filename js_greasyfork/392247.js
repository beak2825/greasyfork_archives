// ==UserScript==
// @name         Create Upinus PO To Shiphero
// @namespace    https://epacketexpress.com
// @version      0.3-dev
// @description  create Upinus Purchase Orders to Shiphero
// @author       Tom
// @match        https://supplier.upinus.com/ffris/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392247/Create%20Upinus%20PO%20To%20Shiphero.user.js
// @updateURL https://update.greasyfork.org/scripts/392247/Create%20Upinus%20PO%20To%20Shiphero.meta.js
// ==/UserScript==

'use strict';

function CreatePO(){
    
    function GetPO(){

        // generate the po confirm form at the HTML left side, once click submit button, send the po list to http://127.0.0.1:8000/createpo
        // res such like { 'po_dict': { '10BSLO_BL3951L0': 25, '10BSLO_BL3851L0': 3 }, err_dict: {} }
        function CreateForm(res){

            // post po form data to http://127.0.0.1:8000/createpo
            // po form data such like: {'po_number': 'FRI_1030ribungay13', 'po_date': '2019-10-30 18:04:39', '10HFLS_BK3551L0': 8, '10HFLS_BK3651L0', 2}
            function SubmitForm(){
                po_form.submit();
            }

            // generate the po confirm form at the HTML left side
            var father_node = document.getElementById('sidebar');
            var br = document.createElement('br');
            // generate the sourcing tracker ignore information
            var sourcing_list = document.createElement('div');
            father_node.appendChild(br);
            father_node.appendChild(sourcing_list);
            var sourcing_ignore = res.sourcing_ignore;
            if (JSON.stringify(sourcing_ignore) != "{}") {
                var ignore_title = document.createElement('h4');
                ignore_title.innerText = "Sourcing Ignore List";
                sourcing_list.appendChild(ignore_title);
                for (let sku in sourcing_ignore) {
                    var ignore_item = document.createElement("p");
                    ignore_item.innerText = `Sourcing Tracker Ignore SKU: ${sku}, Reason: ${sourcing_ignore[sku]}`;
                    sourcing_list.appendChild(ignore_item);
                    sourcing_list.appendChild(br);
                }
            }
            // generate the err list
            var err_list = document.createElement('div');
            father_node.appendChild(br);
            father_node.appendChild(err_list);
            var err_dict = res.err_dict;
            // if err_dict is not null, display it
            if (JSON.stringify(err_dict) != "{}"){
                var err_po_title = document.createElement('h4');
                err_po_title.innerText = "Error List";
                err_list.appendChild(err_po_title);
                for (let sku in err_dict) {
                    var err_item = document.createElement("p");
                    err_item.innerText = `Error Product: ${sku}, Reason: ${err_dict[sku]}`;
                    err_list.appendChild(err_item);
                    err_list.appendChild(br);
                }
            }
            // generate po_form
            var po_form = document.createElement('FORM');
            po_form.setAttribute("id", "po_form");
            po_form.setAttribute("name", "po_form");
            po_form.setAttribute("method", "post");
            po_form.setAttribute("action", "https://app.epacketexpress.com/createpo");
            father_node.appendChild(br);
            father_node.appendChild(po_form);
            // generate PO Number, such like: 'FRI_1030ribungay13'
            var po_number_title = document.createElement("h4");
            po_number_title.innerText = "PO Number";
            po_form.appendChild(po_number_title);
            po_form.appendChild(br);
            var po_number = document.createElement("INPUT");
            po_number.setAttribute("type", "text");
            po_number.setAttribute("name", "po_number");
            po_number.setAttribute("value", document.getElementsByTagName('h3')[0].getElementsByTagName('strong')[0].innerText);
            po_number.setAttribute("readonly", "true");
            po_form.appendChild(po_number);
            po_form.appendChild(br);
            // generate PO Date, such like: '2019-10-30 18:04:39'
            var po_date_title = document.createElement("h4");
            po_date_title.innerText = "PO Date";
            po_form.appendChild(po_date_title);
            po_form.appendChild(br);
            var po_date = document.createElement("INPUT");
            po_date.setAttribute("type", "text");
            po_date.setAttribute("name", "po_date");
            po_date.setAttribute("readonly", "true");
            var origin_date = document.getElementsByTagName('h3')[0].getElementsByTagName('strong')[1].innerText;
            var date = origin_date.replace(/^(\d{4})\/(\d{2})\/(\d{2}) (\d{2}:\d{2}:\d{2})/, "$1-$2-$3 $4");
            po_date.setAttribute("value", date);
            po_form.appendChild(po_date);
            po_form.appendChild(br);
            // generate sourcing tracker information
            var sourcing_dict = res.sourcing_dict;
            var sourcing_title = document.createElement("h4");
            sourcing_title.innerText = "Sourcing Tracker Product";
            po_form.appendChild(sourcing_title);
            po_form.appendChild(br);
            for (let name in sourcing_dict) {
                if (sourcing_dict[name] != '0') {
                    var sourcing_item = document.createElement("p");
                    sourcing_item.innerText = name;
                    var sourcing_quantity = document.createElement("INPUT");
                    sourcing_quantity.setAttribute("type", "text");
                    sourcing_quantity.setAttribute("name", name);
                    sourcing_quantity.setAttribute("value", sourcing_dict[name]);
                    sourcing_quantity.setAttribute("readonly", "true");
                    po_form.appendChild(br);
                    po_form.appendChild(sourcing_item);
                    po_form.appendChild(br);
                    po_form.appendChild(sourcing_quantity)
                } 
            }
            // generate PO List, include sku and quantity
            var po_form_title = document.createElement("h4");
            po_form_title.innerText = "PO List";
            po_form.appendChild(br);
            po_form.appendChild(po_form_title);
            po_form.appendChild(br);
            var po_dict = res.po_dict;
            // generate each row sku and quantity
            for (let sku in po_dict) {
                var item_sku = document.createElement("p");
                item_sku.innerText = sku;
                var item_quantity = document.createElement("INPUT");
                item_quantity.setAttribute("type", "text");
                item_quantity.setAttribute("name", sku);
                item_quantity.setAttribute("value", po_dict[sku]);
                item_quantity.setAttribute("readonly", "true");
                po_form.appendChild(br);
                po_form.appendChild(item_sku);
                po_form.appendChild(br);
                po_form.appendChild(item_quantity);

            }
            // generate submit button, once click call SubmitForm()
            var submit_button = document.createElement("INPUT");
            submit_button.setAttribute("type", "button");
            submit_button.setAttribute("value", "Submit");
            submit_button.addEventListener("click", SubmitForm, false);
            po_form.appendChild(br);
            po_form.appendChild(submit_button);
            po_form.style.display = "block";


        }

        // send original po list to http://127.0.0.1:8000/confirmpo, and get the single po list to the backend, once finish, call CreateForm()
        function SendPO(po_list){
            var xmlHttp;
            xmlHttp = new XMLHttpRequest();
            xmlHttp.open("post", "https://app.epacketexpress.com/confirmpo");
            xmlHttp.setRequestHeader("Content-Type","application/json");
            // data such like {"po_list": [{'sku': '10HFLS_BL3551L0', 'quantity': 1}, {'sku': '10HFLS_CF3651L0', 'quantity': 1}]}
            var data = { "po_list": po_list};
            var body = JSON.stringify(data);
            xmlHttp.onload = function () {
                // res such like { 'po_dict': { '10BSLO_BL3951L0': 25, '10BSLO_BL3851L0': 3 }, err_dict: {} }
                var res = JSON.parse(xmlHttp.response);
                CreateForm(res);
            };
            xmlHttp.send(body);
        }


        // get original po sku and quantity and store in po_list, such like [{'sku': '10HFLS_BK3551L0', 'quantity': 8}, {'sku': '10HFLS_BK3651L0', 'quantity': 2}]
        var po_list = [];
        var all_data_node = document.getElementById('main').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
        for (var i = 0; i < all_data_node.length; i+=2) {
            var row = all_data_node[i].getElementsByTagName('td');
            var po_sku = row[0].innerText;
            var po_quantity = row[2].getElementsByTagName('span')[1].innerText;
            var sku_quantity_dict = {}
            sku_quantity_dict.sku = po_sku;
            sku_quantity_dict.quantity = po_quantity;
            po_list.push(sku_quantity_dict);
        }

        SendPO(po_list);
    }


    // generate the 'Create PO' button at HTML, once click the button, call GetPO()
    var parent_node = document.getElementById('main').getElementsByClassName('field is-grouped is-grouped-right buttons')[0];
    var child_node = document.getElementById('main').getElementsByClassName('field is-grouped is-grouped-right buttons')[0].getElementsByTagName('a')[0];
    var create_po = document.createElement('button');
    create_po.id = 'create_po';
    create_po.innerText = 'Create PO';
    create_po.setAttribute('class', 'button is-primary');
    create_po.addEventListener("click", GetPO, false);
    parent_node.insertBefore(create_po, child_node);
}

CreatePO();
    