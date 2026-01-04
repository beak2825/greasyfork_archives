/*// ==UserScript==
// @name         Check availability of some products on Product page
// @namespace    http://meblujdom.pl/
// @version      0.5.94
// @description  Adds Check button on product page to check availability directly on product page and copy product ID and combination ID to clipboard
// @author       Eryk Wróbel
// @exclude      https://meblujdom.pl/admin*
// @match        https://meblujdom.pl/*.html*
// @match        http://localhost/prestashop/*.html*
// @match        https://meblujdom.test/*.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33412/Check%20availability%20of%20some%20products%20on%20Product%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/33412/Check%20availability%20of%20some%20products%20on%20Product%20page.meta.js
// ==/UserScript==

 /* Changelog */
// 0.1 - Script created
// 0.2 - Add red notification when combinations does not have reference code filled, jezu weź to kiedyś przepisz bo wstyd
// 0.3.1 - Try to add Bogfran manufacturer to check
// 0.3.2 - Changed position due to live chat
// 0.3.3 - fixed Signal manufacturer name
// 0.4.0 - rewritten and added id_product_attribute as combination
// 0.5.0 - some improvements, ability to copy combination id to clipboard, added Bogart
// 0.5.2 - minor fix of product['reference']
// 0.5.3 - Moved element to right side of the website and added id_product to copy like "id_product-id_combination"
// 0.5.4 - fixed combinationFromController is not defined on products without it
// 0.5.5 - added Kinghome b2b and if failed to get reference then look for ean13
// 0.5.6 - Fix on load.
// 0.5.7 - fix URL reference when combination change
// 0.5.8 - add BlackPoint & small undefined fix
// 0.5.81 - just exclusion from admin
// 0.5.82 - visual changes, kopiowanie samego ID produktu po kliknięciu na "combination"
// 0.5.90 - added Mebel Elite and Levano
// 0.5.92 - added Lenart B2B to fast links
// 0.5.93 - added B2B Dywany Łuszczów to fast links
// 0.5.94 - added Angel Chairs and some fixes

(function() {
    $(document).ready(function() {
        setTimeout(function() {
            if (typeof page_name !== 'undefined' && page_name === 'product' && typeof id_manufacturer !== 'undefined' && id_manufacturer) {

                let btn_style = 'btn btn-hollow btn-md hint--left';
                let container_style = 'position:fixed; right: 2em; bottom: 1em;';
                let manufacturer_url = createManufacturerCheckLink(id_manufacturer);

                if (manufacturer_url) {
                    $(document.body).append('<a id="checkmanufactureravailability"' +
                        'style="'+ container_style +'" target="_blank">' +
                        '<i class="icon-eye cdarkgreen"></i> <strong id="product_ref" class="hint--top" data-hint="Zobacz u producenta"></strong> ' +
                        '&nbsp; <strong>ID:</strong> <span id="product_id_2_copy" class="hint--top" data-hint="Skopiuj ID produktu">'+ id_product + '</span>'+
                        '&nbsp; <strong>Comb:</strong> <span id="product_id_attr" class="hint--top" data-hint="Skopiuj ID kombinacji i produktu"></span>'
                    );
                } else {
                    $(document.body).append('<a id="checkmanufactureravailability"' +
                        'style="'+ container_style +'" target="_blank">' +
                        '<i class="icon-eye cdarkgreen"></i>' +
                        '&nbsp; <strong>ID:</strong> <span id="product_id_2_copy" class="hint--top" data-hint="Skopiuj ID produktu">'+ id_product + '</span>'+
                        '&nbsp; <strong>Comb:</strong> <span id="product_id_attr" class="hint--top" data-hint="Skopiuj ID produktu i kombinacji"></span>'
                    );
                }

                $(window).bind('hashchange', function() {
                    setData(getReference(), getIdAttribute(), btn_style);
                });

                setTimeout(function() {
                    $(window).trigger('hashchange');
                }, 250);

                function getReference() {
                    let pointer = false;

                    if (typeof product['reference'] !== 'undefined' && product['reference'] !== '') {
                        pointer = product['reference'];
                    } else {
                        if (typeof combinationsFromController !== 'undefined') {
                            pointer = selectedCombination['reference'];
                            if (!pointer || pointer === ''){
                                pointer = selectedCombination['ean13'];
                            }
                        } else {
                            return false;
                        }
                    }

                    return pointer;
                }

                function createManufacturerCheckLink(id_manufacturer, selected_ref = '') {
                    let main_product_ref = (product.reference !== '') ? product.reference.replace('LSCW#','') : '';

                    let manufacturer_url = {
                        1: 'https://zamowienie.signal.pl/Oferta/Type/ProductDetails/ProductID/'+ selected_ref,
                        2: 'https://halmar.pl/szukaj/?search_lang=pl&search=product&string='+ selected_ref +'&search_button=Szukaj',
                        3: 'http://www.sklep.liveomeble.pl/inkontrahent.php?qq=' + selected_ref + '&qq=2',
                        10: 'https://b2b.fernity.com/ProduktyWyszukiwanie.aspx?search=' + selected_ref + '',
                        25: 'http://old.unique-meble.pl/dostepnosc.html?keyword=' + selected_ref + '&cid=',
                        33: 'https://b2b.kinghome.pl/ProduktyWyszukiwanie.aspx?search=' + selected_ref + '',
                        43: 'https://b2b.lenartmeble.pl/pl/Products?catId=0&p=1&pc=50&p1=' + selected_ref + '&p2=',
                        48: 'https://www.meble-bogart.pl/dost-p-'+selected_ref+'-1-1.html',
                        49: 'https://furnitex.pl/products/' + selected_ref,
                        51: 'https://panel.marbex.pl/produkt/' + selected_ref,
                        54: 'https://b2b.eko-light.com/pl/p?szukane=' + selected_ref,
                        58: 'https://sklep.blackpoint.pl/pl/search?text=' + selected_ref,
                        61: 'https://b2b.eko-light.com/pl/p?szukane=' + selected_ref,
                        62: 'https://mebelelite.pl/jolisearch?s=' + selected_ref,
                        64: 'https://kabis.eu/pl/'+ main_product_ref +'-.html',
                        65: 'https://angel-chairs.com/pl/search.html?text='+selected_ref +'&pricelimitmin=0&pricelimitmax=&category_alt%5B1%5D=&sort=price&order=d&onlyVisibleElements=true',
                    };

                    if (typeof manufacturer_url[id_manufacturer] !== 'undefined') {
                        return manufacturer_url[id_manufacturer];
                    } else {
                        return false;
                    }
                }

                function getIdAttribute() {
                    let  id_attribute;

                    if ($idCombinationObj.val() !== ''){
                        id_attribute = parseInt($idCombinationObj.val());
                    } else if (typeof selectedCombination['reference'] !== 'undefined') {
                        id_attribute = idAttrByReference(selectedCombination['reference'], combinationsJS);
                    } else if (typeof selectedCombination['ean13'] !== 'undefined') {
                        id_attribute = idAttrByEan13(selectedCombination['ean13'], combinationsJS);
                    } else {
                        id_attribute = 0;
                    }

                    return id_attribute;
                }

                function setData(reference = '', id_attribute = 0, btn_class = 'btn btn-default hint--right') {
                    if (reference === '' || typeof reference == 'undefined'){
                        $('#checkmanufactureravailability')
                            .removeClass().addClass('btn btn-danger btn-md hint--left')
                            .attr('href', '')
                            .attr('title', false)
                            .attr('data-hint', 'No chyba czerwone wystarczająco...');

                        $('#product_ref').text('BRAK KODU REFERENCYJNEGO!');
                        $('#product_id_attr').text(id_attribute);
                    } else {
                        $('#checkmanufactureravailability')
                            .removeClass()
                            .addClass(btn_class)
                            .attr('href', createManufacturerCheckLink(id_manufacturer, reference));

                        $('#product_ref').text(reference);
                        $('#product_id_attr').text(id_attribute);

                    }
                }

                function idAttrByReference(reference, combinations) {
                    for (var i=0 ; i < combinations.length; i++) {
                        if (combinations[i]['reference'] === reference) {
                            return combinations[i]['idCombination'];
                        }
                    }
                }

                function idAttrByEan13(ean13, combinations) {
                    for (var i=0 ; i < combinations.length; i++) {
                        if (combinations[i]['ean13'] === ean13) {
                            return combinations[i]['idCombination'];
                        }
                    }
                }

                $(document).on('click', '#product_id_2_copy', function(e) {
                    e.preventDefault();
                    let prodId = $(this).text();
                    copyToClipboard($(this));
                    ttGrowl('Skopiowano  <strong>' + prodId  + '</strong> do schowka', $(this), 3000, 'success');
                });

                $(document).on('click', '#product_id_attr', function(e) {
                    e.preventDefault();
                    let tempElement = '<span style="display:none" id="tempIdVal">'+ id_product +'-' + $(this).text() + '</span>';
                    $('#checkmanufactureravailability').after(tempElement);
                    copyToClipboard($('#tempIdVal'));
                    $('#tempIdVal').remove();

                    ttGrowl(
                        'Skopiowano atrybutu <strong>' + id_product + '-' + $(this).text() + '</strong> do schowka',
                        $(this), 3000, 'success'
                    );
                });
            }
        }, 1500);
    });
})();