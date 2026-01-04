// ==UserScript==
// @name         WHMCS - SolusVM Config Migration
// @namespace    Digimol
// @version      0.1
// @description  SolusVM Config Import/Export
// @author       Dave Mol
// @match        https://shop.idfnv.com/beheer/configproducts.php*
// @match        https://shop.wdmsh.com/beheer/configproducts.php*
// @match        https://sales.microglollc.com/beheer/configproducts.php*
// @match        https://pay4fee.net/bill/beheer/configproducts.php*
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/427815/WHMCS%20-%20SolusVM%20Config%20Migration.user.js
// @updateURL https://update.greasyfork.org/scripts/427815/WHMCS%20-%20SolusVM%20Config%20Migration.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let e = setInterval(()=> {
        if($('#tblModuleSettings .configoption_group').length) {
            clearInterval(e);
            let $row = $('<tr>');
            let $field = $('<input>').attr('id', 'dsm-migrate').appendTo($row);

            let $import = $('<button>').text('Import').click((e)=> {
                e.preventDefault();
                let config = JSON.parse($field.val());
                $.each(config, (k,v)=> {
                    if($('[name="'+k+'"]').attr('type') === 'checkbox') {
                        $('[name="'+k+'"]').prop('checked', v);
                    } else {
                        $('[name="'+k+'"]').val(v);
                    }
                });
            }).appendTo($row);

            let $export = $('<button>').text('Export').click((e)=> {
                e.preventDefault();
                let config = {};
                $('#tblModuleSettings').find('select').each((k,v)=> {
                    config[v.name] = $(v).val();
                });
                $('#tblModuleSettings').find('input:not(#dsm-migrate)').each((k,v)=> {
                    if($(v).attr('type') === 'checkbox') {
                        config[v.name] = $(v).is(':checked');
                    } else {
                        config[v.name] = $(v).val();
                    }
                });
                console.log(config);
                $field.val(JSON.stringify(config));
            }).appendTo($row);

            $('#noModuleSelectedRow').after($row);
        }
    }, 10);
    // Your code here...
})();