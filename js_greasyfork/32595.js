// ==UserScript==
// @name         Add edit product/category/blog button in front office
// @namespace    http://meblujdom.pl/
// @version      0.55
// @description  Creates edit product link in front office, with wrong token but this will still works.
// @author       Eryk Wróbel
// @match        http://meblujdom.pl/*
// @match        https://meblujdom.pl/*
// @match        http://meblujdom.test/*
// @exclude      http://meblujdom.test/admin8*
// @exclude      https://meblujdom.pl/admin8*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32595/Add%20edit%20productcategoryblog%20button%20in%20front%20office.user.js
// @updateURL https://update.greasyfork.org/scripts/32595/Add%20edit%20productcategoryblog%20button%20in%20front%20office.meta.js
// ==/UserScript==

/* Changelog */

// 0.2 - Script now define and filter edit url if there attribute selected or url contains search mark
// 0.3 - added edit of blog pages
// 0.4 - added category edit
// 0.53 - added manufacturers
// 0.54 - visual changes
// 0.55 - added edit button even if product is not active

(function () {
    $(document).ready(function () {
        if (typeof baseUri !== 'undefined') {

             /* Edit those values  */
             let admin_url = baseUri + 'admin801rklmbd1/'; // full addres to back office with "/" on the end

             let alternative_id_product = '';
             if (typeof page_name !== 'undefined' && page_name == 'product') {

               let splitted_url = window.location.href.split('-');
               splitted_url.forEach((value) => {
                   if (value.includes('.html')) {
                       let almost_id = value.split('.');
                       alternative_id_product = almost_id[0].replace('id', '');
                   }
               });
            }

            if (typeof id_product !== 'undefined' && page_name == 'product') {
                let edit_url = admin_url + 'index.php?controller=AdminProducts&token=' + token + '&id_product=' + id_product + '&updateproduct';
                $(document.body).append("<a href=\'" + edit_url + "'\ class='btn btn-md btn-info editproduct' style='position:fixed; left: 2em; bottom: 15px;'><i class='icon-pencil'></i> Edit this product</a>");
            } else {
                let edit_url = admin_url + 'index.php?controller=AdminProducts&token=' + token + '&id_product=' + alternative_id_product + '&updateproduct';
                $(document.body).append("<a href=\'" + edit_url + "'\ class='btn btn-md btn-info editproduct' style='position:fixed; left: 2em; bottom: 15px;'><i class='icon-pencil'></i> Edit this product</a>");
            }

            if (typeof id_cms != 'undefined' && page_name == 'cms') {
                let edit_url_cms = admin_url + 'index.php?controller=AdminCmsContent&id_cms=' + id_cms + '&updatecms&token=' + token;
                $(document.body).append("<a href=\'" + edit_url_cms + "'\ class='btn btn-md btn-info' style='position:fixed; left: 2em; bottom: 15px;'><i class='icon-pencil'></i> Edit this page</a>");
            } else if (typeof id_category != 'undefined' && page_name == 'category') {
                let edit_cat = admin_url + 'index.php?controller=AdminCategories&id_category=' + id_category + '&updatecategory&token=' + token;
                $(document.body).append("<a href=\'" + edit_cat + "'\ class='btn btn-md  btn-warning' style='position:fixed; left: 2em; bottom: 15px;'><i class='icon-pencil'></i> Edytuj kategorie</a>");
            } else if (typeof id != 'undefined' && page_name == 'manufacturer') {
                let edit_man = admin_url + 'index.php?controller=AdminManufacturers&id_manufacturer=' + id + '&updatemanufacturer&token=' + token;
                $(document.body).append("<a href=\'" + edit_man + "'\ class='btn btn-md btn-warning' style='position:fixed; left: 2em; bottom: 15px;'><i class='icon-pencil'></i> Edytuj producenta</a>");
            }
        }
    });
})();