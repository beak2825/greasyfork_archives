// ==UserScript==
// @name         e-c Externals
// @namespace    http://tampermonkey.net/
// @version      0.19
// @description  Close external product tabs
// @author       e-c
// @include      https://electro.md/index.php?route=product/search&search=*
// @include      https://hamster.md/shop/shop_item/search/query:*
// @include      https://accent.md/search/?search=*
// @include      https://alo.md/ro/search?query=*
// @include      https://extratel.md/index.php?route=product/search&search=*
// @include      https://smarti.md/ro/search?query=*
// @include      https://kub.md/search/?search=*
// @include      https://gorilla.md/?product_cat=&post_type=product&s=*
// @include      https://www.netmarket.md/ro/cautare_*
// @include      https://clic.md/rom/catalog?fltr_lk__title=*
// @include      https://unicom.md/index.php?route=product/search&search=*
// @include      https://www.texet.md/product/search.html?search=*
// @include      https://gig.md/?match=all&subcats=Y&pcode_from_q=Y&pshort=Y&pfull=Y&pname=Y&pkeywords=Y&search_performed=Y&pshort=N&pfull=N&pname=Y&pkeywords=Y&match=all&pcode_from_q=Y&dispatch=products.search&q=*
// @include      https://www.cactus.md/ro/search/?q=*
// @include      https://casashop.md/search/?search=*
// @include      https://meserias.md/index.php?route=product/search&search=*
// @include      https://xiaomistore.md/ro/search/all-products/?query=*
// @include      https://costel.md/?post_type=product&s=*
// @include      https://24mag.md/ro/search/-1_1.html?category=all&search=*
// @include      https://www.gsmshop.md/product/search.html?search=*
// @include      https://itunexx.md/ro/?option=com_virtuemart&page=shop.browse&search=true&view=category&limitstart=0&keyword=*
// @include      https://grandshop.md/index.php?route=product/search&search=*
// @include      https://nanoteh.md/ro/?cat=0&q=*
// @include      https://uno.md/search/*
// @include      https://eshop.moldcell.md/index.php?route=product/search&search=*
// @include      https://eshop.orange.md/ro?query=*
// @include      http://bestdeal.md/index.php?route=product/search&search=*
// @include      https://eshop.md/md/search.aspx?search_string=*
// @include      http://www.dostavka.md/ro/search?object=14&q=*
// @include      https://www.fantastic.md
// @include      https://www.fantastic.md/
// @include      https://www.fantastic.md/catalog?search=*
// @include      https://doxyterra.md/ro/search?query=*
// @include      https://maxmart.md/ro/produse/?q=*
// @include      http://www.desire.md/ro/search?searchText=*
// @include      https://www.desire.md/error.htm?aspxerrorpath=/default.aspx
// @include      https://www.zap.md/search*
// @include      https://www.pandashop.md/ro/search/?text=*
// @include      https://smadshop.md/ro/search/?search=*
// @include      https://smadshop.md/poisk/?search=*
// @include      https://maximum.md/ro/search?query=*
// @include      https://master-lux.md/search?for=*
// @include      https://andromeda.md/search?&text=*
// @include      https://chasov.md/?post_type=product&s=*
// @include      https://arcticaservice.md/?match=all&subcats=Y&pcode_from_q=Y&pshort=Y&pfull=Y&pname=Y&pkeywords=Y&search_performed=Y&dispatch=products.search&q=*
// @include      https://h-t.md/?match=all&subcats=Y&pcode_from_q=Y&pshort=N&pfull=N&pname=Y&pkeywords=Y&search_performed=Y&dispatch=products.search&q=*
// @include      https://www.metroterm.md/products/search?q=*
// @include      https://magicshop.md/cauta?search=*
// @include      https://watt.md/ro/cautare/*
// @include      https://kamoto.md/?post_type=product&s=*
// @include      https://prime-pc.md/search?searchfield=*
// @include      https://yaki.md/rom/catalog?fltr_lk__title=*
// @include      https://unitools.md/ro/catalog?search=*
// @include      https://flexmag.md/cautare/dupa?search=*
// @include      http://wildmart.md/index.php?route=product/search&search=*
// @include      https://is.md/ro/product/search;search;*
// @include      https://makeup.md/search/?q=*
// @include      https://climatec.md/?post_type=product&dgwt_wcas=1&s=*
// @include      https://bestbuy.md/?post_type=product&s=*
// @include      https://smart-climat.md/ro/search?query=*
// @include      https://bumerang.md/ro/component/virtuemart/results,1-20?x=0&y=0&limitstart=0&option=com_virtuemart&view=category&virtuemart_category_id=0&keyword=*
// @include      http://www.bilgicom.md/search/index.php?q=*
// @include      https://4elements.md/index.php?match=all&subcats=Y&pcode_from_q=Y&pshort=Y&pfull=Y&pname=Y&pkeywords=Y&search_performed=Y&dispatch=products.search&sl=ro&q=*
// @include      https://cazan.md/ro/cautare?orderby=position&orderway=desc&search_category=all&s=*
// @include      http://automarket.md/search/?search=*
// @include      https://idvr.md/index.php?category_id=0&submit_search=&route=product%2Fsearch&search=*
// @include      https://electromotor.md/?post_type=product&product_cat=0&s=*
// @include      https://electrolux.com.md/ro/cautare/*
// @include      https://autoshina.md/poisk/?search=*
// @include      https://gipfel.md/ro/search?query=*
// @include      https://stilis.md/?s=*
// @include      https://bigshop.md/search/iphone?page=1*
// @include      https://tehnoconduct.md/ro/catalogsearch/result/?q=*
// @include      https://www.verix.md/ro/search?q=*
// @include      https://nanu.md/ro/cautare?orderby=position&orderway=desc&s=*
// @include      https://supraten.md/poisk&category_id=0&search=*
// @include      http://www.all4office.md/ro/search/?action=searchresult&searchwhere=name&query=*
// @include      https://monacu.md/ro/search/?search=Caut%C4%83%C2%A0&quicksearch=*
// @include      https://instalatii.md/?product_cat=0&post_type=product&s=*
// @include      https://pigeon.md/?match=all&subcats=Y&pcode_from_q=Y&pshort=Y&pfull=Y&pname=Y&pkeywords=Y&search_performed=Y&dispatch=search.results&q=*
// @include      https://rebor.md/search/?search=*
// @include      http://www.euroterm.md/ro/search?search=*
// @include      https://mobileexpert.md/?post_type=product&s=*
// @include      https://ergoform.md/index.php?route=product/search&search=*
// @include      https://mamico.md/ro/search/?q=*
// @include      https://tehnoinstrument.md/magazin/?product_cat&post_type=product&s=*
// @include      https://garmin.md/?s=*
// @include      https://www.kazane.md/ro/catalog/cautare?q=*
// @include      https://euroelitstal.md/shop/search?text=*
// @include      https://ogogo.md/?subcats=Y&pcode_from_q=Y&pshort=Y&pfull=Y&pname=Y&pkeywords=Y&search_performed=Y&search_id=&dispatch=products.search&q=*
// @include      https://papirus.md/ldbslpb829cz/?search=*
// @include      https://geek.md/md/search?search=*
// @include      https://automall.md/Catalog/Search?number=*
// @include      http://emall.md/catalog/item/index?fltr_lk__title=*
// @include      https://cap-cap.md/ro/cautare/*
// @include      https://hikoki.md/ro/search?query=*
// @include      https://costel.md/?post_type=product&s=*
// @include      https://agropiese.md/cautare?for=*
// @include      https://www.baby-boom.md/ro/search?s=*
// @include      https://dicon.md/ro/cautare/?category=0&search=*
// @include      https://catollux.md/ro/?match=all&subcats=Y&pcode_from_q=Y&pshort=Y&pfull=Y&pname=Y&pkeywords=Y&search_performed=Y&dispatch=products.search&q=*
// @include      https://simplex.md/search/?search=*
// @include      https://www.moldclima.md/ro/catalog/cautare?q=*
// @include      https://www.bomba.md/ro/product/search/?search=*
// @include      http://www.aiea.md/ro/catalogsearch/result/?q=*
// @include      https://printeq.md/ro/component/virtuemart/results,1-24?keyword=*
// @include      https://mvc.md/ro/search?query=*
// @include      https://agroteh.md/ro/search/?search=*
// @include      https://sad.md/ro/cautare/*
// @include      https://cablu.md/search/?search=*
// @include      https://volta.md/category/search/*
// @include      https://mcs.md/ro/?product_cat=0&post_type=product&lang=ro&s=*
// @include      https://tina.md/advanced_search_result.php?keywords=*
// @include      https://altavista.md/ro/catalogsearch/result/?q=*
// @include      https://savor.md/index.php?route=product/search&search=*
// @include      https://instrumente.md/ro/cautare?orderby=position&controller=search&orderway=desc&search_query=*
// @include      https://integramarket.md/ro/search/?q=*
// @include      https://lumeainstrumentelor.md/?product_cat=0&post_type=product&s=*
// @include      https://www.artmobila.md/ro/search/?q=*
// @include      https://ascara.md/ro/search?query=*
// @include      https://www.nitro.md/ro/search/?query=*
// @include      https://rozetka.md/search/?inner=1&section=%2F&text=*
// @include      https://viral.md/ro/search?query=*
// @include      https://trivent.md/index.php?route=product/search&search=*
// @include      https://www.printerra.md/index.php?route=product/search&category_id=0&search=*
// @include      https://premiumstore.md/ro/search/?query=*
// @include      https://optim.md/?post_type=product&s=*
// @include      https://teplomall.md/ro/cautare/*
// @include      http://baieplus.md/ro/cautare?controller=search&orderby=position&orderway=desc&search_query=*
// @include      https://atehno.md/search/catalog?keywords=*
// @include      https://zanussi.com.md/ro/cautare/*
// @include      https://aircomfort.md/ro/search?query=*
// @include      https://damicom.md/all-products?keyword=*
// @include      http://www.inksystem.md/?s=*
// @include      https://www.pride.md/ru/index.php?route=product/search&search=*
// @include      https://zumarket.md/ro/cautare_*
// @include      https://karchershop.md/ro/?post_type=product&dgwt_wcas=1&trp-form-language=ro&s=*
// @include      http://daikin-shop.md/ro/search/*
// @include      https://limon.md/ro/search?query=*
// @include      https://altep.md/busca&category_id=0&search=*
// @include      http://avemdetoate.md/search/?search=*
// @include      https://fabrikhome.md/ro/search?query=*
// @include      https://gefest.md/ro/search/?search=*
// @include      https://jara.md/ro/cautare/*
// @include      https://amber.md/?post_type=product&dgwt_wcas=1&lang=ro&s=*
// @include      https://muncitorul.md/ro/search?search=*
// @include      https://mediamusic.md/index.php/catalogsearch/result/?q=*
// @include      https://termoformat.md/ro/search/*
// @include      https://promstore.md/ro/search?query=*
// @include      https://tehnoterm.md/ro/search?query=*
// @include      https://shoptools.md/ro/search?query=*
// @include      https://leoshop.md/toate-categoriile/search/?q=*
// @include      https://www.termostar.md/ro/search/*
// @include      https://xstyle.md/catalogsearch/result/?q=*
// @include      https://nord-line.md/shop/search?text=*
// @include      https://econstruct.md/ro/katalog/search/?q=*
// @include      https://shopit.md/ro/catalog/search/?query=*
// @include      https://termalex.md/shop/search?text=*
// @include      https://www.foxmart.md/search?q=*
// @include      https://teploplus.md/index.php?route=product/search&search=*
// @include      https://robertino.md/?post_type=product&v=7dc10e66da55&s=*
// @include      https://www.cauciucuri.md/ro/cautare.html?search=*
// @include      https://daikin.com.md/ro/cautare/*
// @include      https://imperia.md/ro/search/?search=*
// @include      https://electroplus.md/ro/search?text=*
// @include      https://refurb.md/ro/search/?query=*
// @include      https://uniplast.md/ro/search?query=*
// @include      https://casamea.md/ro/search/?search=*
// @include      http://proglobus.md/index.php?route=product/search&search=*
// @include      https://gtm.md/catalog/item/index?fltr_lk__title=*
// @include      https://comp.md/search?search=*
// @include      https://eurosanteh.md/ro/cautare/*
// @include      https://mastertool.md/ro/search/?search=*
// @include      https://termoplus.md/ro/search?query=*
// @include      https://termo.md/?subcats=Y&pcode_from_q=Y&pshort=Y&pfull=Y&pname=Y&pkeywords=Y&search_performed=Y&dispatch=products.search&security_hash=dd3b90ee0b1d3b97f4ba04bfcbdb3279&q=*
// @include      https://term.md/search/index.php?q=*
// @include      https://tehnoline.md/ro/cautare?controller=search&s=*
// @include      https://santehmarket.md/?post_type=product&s=*
// @include      https://robinet.md/ro/search?query=*
// @include      https://printer.md/index.php?route=product/search&sub_category=true&search=*
// @include      https://magstore.md/?post_type=product&s=*
// @include      https://megabait.md/search?search=*
// @include      https://toybox.md/ro/search/*
// @include      https://f24.md/ro/search?category=&query=*
/*@include      https://neocomputer.md/ro/index.php?route=product/search&search=**/
// @include      https://neocomputer.md/ro/index.php?route=product/search&route=product/search&search=*
// @include      https://flexmag.md/cautare/dupa?search=*
// @include      https://www.s-comp.md/ro/catalogsearch/result/?q=*
// @include      https://matrix.md/?subcats=Y&pcode_from_q=Y&pshort=Y&pfull=Y&pname=Y&pkeywords=Y&search_performed=Y&pshort=N&pfull=N&pname=Y&pkeywords=N&match=all&pcode_from_q=Y&pcode=Y&dispatch=products.search&q=*
// @include      http://mgh.md/index.php?route=product/search&search=*
// @include      https://tshop.md/ro/search/?search=*
// @include      https://zummer.md/products/search
// @include      https://computers.md/search
// @include      http://tehnomag.md/ro/search/item?query=*
// @include      http://iremax.md/?subcats=Y&pcode_from_q=Y&pshort=Y&pfull=Y&pname=Y&pkeywords=Y&search_performed=Y&dispatch=products.search&q=*
// @include      https://nonstop.md/search/?key=*
// @include      https://casacurata.md/?match=all&subcats=Y&pcode_from_q=Y&pshort=Y&pfull=Y&pname=Y&pkeywords=Y&search_performed=Y&dispatch=products.search&q=*
// @include      https://tisam.md/search/?search=*
// @include      https://teplokom.md/shop/search?text=*
// @include      https://www.practic.md/?product_cat=&post_type=product&s=*
// @include      https://xstore.md/search?search=*
// @include      http://www.impreso.md/ro/search?text=*
// @include      https://elcora.md/?numberposts=5&results_hide_fields=post_titles%2Cmeta%2Cimage&s=*
// @include      https://darwin.md/search?search=*
// @include      https://byone.md/ro/search-catalog-result?search=*
// @include      https://deliver.md/index.php?route=product/search&search=*
// @include      https://exterior.md/ro/catalog/search?q=*
// @include      https://electron.md/ro/search?query=*
// @include      https://expertsecurity.md/?post_type=product&s=*
// @include      https://www.musicshop.md/produse/categorie?cid=-1&q=*
// @include      https://livrez.md/search/?search=*
// @include      https://www.technodom.md/index.php?route=product/search&search=*
// @include      https://kazinst.md/?post_type=product&s=*
// @include      https://overlock.md/ro/search?query=*

// @include      https://www.oneshop.md/?product_cat=0&post_type=product&s=*
// @include      https://melon.md/?match=all&subcats=Y&pcode_from_q=Y&pshort=Y&pfull=Y&pname=Y&pkeywords=Y&search_performed=Y&dispatch=products.search&q=*
// @include      https://relaxe.md/search/result?country=*
// @include      https://damalio.md/?s=*
// @include      https://centrale.md/?post_type=product&s=*
// @include      https://www.telemarket.md/search/?search=*
// @include      https://power-tools.md/ro/search*
// @include      https://ultra.md/search?inStock=1&search=*
// @include      https://lamashop.md/search/?description=true&search=*
// @include      https://gamestop.md/ro/search?search=*
// @include      https://termocontrol.md/all-products?keyword=*

// comments
// @include      https://www.eldorado.ru/search/catalog.php?q=*
// @include      https://www.eldorado.ru/cat/detail/*
// @include      https://www.compari.ro/CategorySearch.php?st=*
// @include      https://www.emag.ro/search/*
// @include      https://www.emag.ro/*
// @include      https://www.mvideo.ru/product-list-page?q=*
// @include      https://www.mvideo.ru/products/*
// searchInputs
//https://enter.online/
// @include      https://enter.online/search?query=*
// @include      https://www.smart.md/
// @include      https://www.smart.md/s?query=*
// @include      https://www.magico.md/
// @include      https://zummer.md/
// @include      https://computers.md/
// @include      https://fotomax.md/ro/search?query=*
// @include      https://termotrade.md/ro/
//https://termocontrol.md/

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411677/e-c%20Externals.user.js
// @updateURL https://update.greasyfork.org/scripts/411677/e-c%20Externals.meta.js
// ==/UserScript==

(function() {
    'use strict';

const selectors = {
        'electro.md': '.product-layout',
        'hamster.md': '.shop_item.list',
		'www.bomba.md': '.catalog-item-product',
		'maximum.md': '.product__item',
		'www.foxmart.md': '.tm-product-list',
		'darwin.md': '.item-products .col-6 > .card-product',
		'karchershop.md': '.products .product',
		'smadshop.md': '.product-grid > div',
		'www.pandashop.md': '.card-inner',
		'www.zap.md': '.views-view-grid tbody tr td',
		'www.desire.md': '.cardsList .card',
		'maxmart.md': '.card-item',
		'doxyterra.md': '.product-item-container .product__item',
		'rozetka.md': '.g-i-tile-i',
		'refurb.md': '.bi6_item',
		'www.fantastic.md': '.Content_Goods_ItemBlock',
		'www.dostavka.md': '#products-container li',
		'agropiese.md': '.tyres-block',
		'eshop.md': '#ctl00_ContentPlaceHolder1_PanelSearchResults .listing li',
		'bestdeal.md': '.product-grid',
		'instrumente.md': '.product-container',
		'imperia.md': '.product-layout',
		'altavista.md': '.products .product',
		'emall.md': '.products .product',
		'gipfel.md': '.search_products .products_list',
		'eshop.orange.md': '.ais-Hits-list .ais-Hits-item',
		'eshop.moldcell.md': '.phone-info',/*.phone-info,.item-search .item'*/
		'electroplus.md': '.product-teaser-wrap',
		'uno.md': '.products .product',
		'nanoteh.md': '.respl-item',
		'grandshop.md': '.product__list__item',
		'matrix.md': '.ty-grid-list__item',
		'itunexx.md': '.product-box',
		'www.gsmshop.md': '.phone_bls',
		'amber.md': '.products .product',
		'premiumstore.md': '#product-list .item',
		'ronin.md': '',
		'termoformat.md': '.products-grid .product',
		'www.baby-boom.md': '.product-item',
		'24mag.md': '.product-card',
		'casamea.md': '.product-layout',
		'tehno.md': '',
		'costel.md': '.products .product-item',
		'xiaomistore.md': '.catalog__item',
		'is.md': '.three.columns',
		'meserias.md': '.product-grid',//hh
		'yaki.md': '.product-block',
		'vesta.md': '',
		'mgh.md': '.product-list > div',
		'optim.md': '.product-wrapper',
		'casashop.md': '.product-layout',
		'www.aiea.md': '.products-grid .item',
		'www.cactus.md': '.catalog__pill',
		'gig.md': '.ut2-gl__item .ut2-gl__body',
		'www.texet.md': '.phone_bls',
		'unicom.md': '.product-layout',
		'clic.md': '.product-container',
		'www.netmarket.md': '.produs_box',
		'gorilla.md': '.product-content',
		'magicshop.md': '.products-list .product-layout',
		'kub.md': '.product-grid .product',
		'smarti.md': '.product-item-container',
		'ogogo.md': '.ty-grid-list__item',
		'extratel.md': '.product-grid',
		'alo.md': '.product__item',
		'accent.md': '.product-layout',
		'papirus.md': '.line-item',
		'shopit.md': '#catalog-items .product',
		'market.odido.md': '',
		'avemdetoate.md': '.product-layout',
		'www.pride.md': '.product-grid',
		'leoshop.md': '.catalogCard-view',
		'xstyle.md': '.products-grid .item',
		'moldflowers.md': '',
		'www.deti.md': '',
		'www.best-shop.md': '',
		'limon.md': '.product-item-container',
		'geek.md': '.main_item_lg',
		'www.nitro.md': '.preview.clearfix',
		'mediamusic.md': '.products-grid .item',
		'zumarket.md': '#produs_box',
		'viral.md': '.product-item-container',
		'wildmart.md': '.box-product > div',
		'mobileexpert.md': '.yit-wcan-container .products .product-item',
		'bestbuy.md': '.product-grid-item',
		'comp.md': '.produse .product',
		'depozit.md': '',
		'www.all4office.md': '.cat_img +td',
		'proglobus.md': '#products .product-block',
		'gtm.md': '.products .product',
		'www.bilgicom.md': '.product-cat-container',
		'proit.md': '',
		'www.printerra.md': '.product-layout',
		'printeq.md': '.browse-view .sp-vmproduct-wrapper',
		'garmin.md': '.type-product',
		'www.flynet.md': '',
		'savor.md': '.product-container .product-layout',
		'www.ghervisav.md': '',
		'www.euroterm.md': '.products .product',
		'monacu.md': '.search-results-products .listimage',
		'gefest.md': '.filtered-products .bi1_item',
		'integramarket.md': '.productList',
		'ergoform.md': '.product-grid',
		'tornadocom.md': '',
		'www.artmobila.md': '.search-items .search-item',
		'indart.md': '',
		'tina.md': '.ProductsListList',
		'metro.zakaz.md': '',
		'realmarket.md': '',
		'fabrichome.md': '.products_list',
		'agroteh.md': '.products_category .product-layout',
		'teplomall.md': '.product-item',
		'sad.md': '#produs_box',
		'watt.md': '.product-item',
		'eurosanteh.md': '.product-item',
		'www.moldclima.md': '.shop-item',
		'trivent.md': '.grid-list__item',
		'jara.md': '.product-item',
		'electrolux.com.md': '.produse_list > div.w-full',
		'aircomfort.md': '.product-item-container',
		'mvc.md': '.product-wrapper',
		'climatec.md': '.products .product',
		'smart-climat.md': '.product-container',
		'www.termostar.md': '.products .product',
		'www.kazane.md': '.single-product',
		'daikin-shop.md': '.product-block',
		'andromeda.md': '.products .product',
		'zanussi.com.md': '.produse_list > div.w-full',
		'4elements.md': '#products_search_pagination_contents .ty-column3',
		'climatherm.md': '',
		'konditioner.md': '',
		'sanigrup.md': '',
		'www.verix.md': '.product-item',
		'altep.md': '.product-thumb',
		'baieplus.md': '.ajax_block_product',
		'www.metroterm.md': '.produse-div .produs',
		'termalex.md': 'article.product-cut',
		'electromotor.md': '.products .product',
		'overlock.md': '.product_card',
		'remington.md': 'div.product',
		'www.elefant.md': '',
		'makeup.md': '.simple-slider-list__item',
		'shop.brilliant-smile.md': '',
		'topcar.md': '',
		'www.practic.md': '.products-grid .product-block',
		'cablu.md': '.product-block',
		'ascara.md': '.product-image-wrapper',
		'mastertool.md': '.product-layout',
		'hikoki.md': '.product-list-item',
		'rebor.md': '.product-grid',
		'instrumente-accesorii.md': '',
		'kamoto.md': '.product-item',
		'lumeainstrumentelor.md': '.product_list .product-container',
		'automarket.md': '.product-grid .item',
		'construct.md': '',
		'casaagriculturii.md': '',
		'unitools.md': '.product-wrapper',
		'nanu.md': '.laberProducts .item',
		'dicon.md': '.item_grid',
		'damicom.md': '.product_item',
		'master-lux.md': '.item .product',
		'autoshina.md': '.list-prod .sing-prod',
		'www.cauciucuri.md': '.product-grid .image',
		'4kolesa.md': '',
		'catollux.md': '.ut2-gl__item',
		'automall.md': '.tile .tile-border',
		'idvr.md': '.product-item-container',
		'shoptools.md': '.product-item-container',
		'muncitorul.md': '.search_products .card__img-wrap',
		'www.s-comp.md': '.products .item.product',
		'arcticaservice.md': '.ty-product-list',
		'daikin.com.md': '.produse_list > div.w-full',
		'volta.md': '.product-card',
		'promstore.md': '.products_list',
		'h-t.md': '.ty-grid-list__item-name',
		'chasov.md': '.products .product',
		'tehnoinstrument.md': '.products .products-entry',
		'econstruct.md': '.catalog-grid__item',
		'www.inksystem.md': '.catalog_list .more_li',
		'robertino.md': '.products .product',
		'mamico.md': '',
		'acumulatoare.md': '',
		'prime-pc.md': '.price_bl_in .price_it',
		'flexmag.md': '.product-box',
		'cazan.md': '.product-miniature',
		'stilis.md': '.woocom-list-content',
		'bigshop.md': '.card.product-card',
		'tehnoconduct.md': '.product-item',
		'supraten.md': '.sp-card-product',
		'instalatii.md': '.products .product-col',
		'pigeon.md': '#pagination_contents .ty-search-result',
		'euroelitstal.md': '.product-cut__main-info',
		'mamico.md': '.catalog__pills__row .catalog__pill',
		'cap-cap.md': '#produse_list .produs_box',
		'simplex.md': '.product-column',
		'mcs.md': '.products .product',
		'atehno.md': '.product-item',
		'tehnoterm.md': '.product-item-container',
		'nord-line.md': '.product-cut__main-info',
		'teploplus.md': '.product-layout',
		'uniplast.md': '.product-list-item',
		'www.eldorado.ru': 'ul[data-dy="productsList"] li[data-dy="product"]',
		'www.compari.ro': '.product-box',
		'www.emag.ro': '.card-collection .card-item',
		'www.mvideo.ru': '.product-cards-layout__item',
		'termoplus.md': '.products_list',
		'termo.md': '.ty-grid-list__item',
		'term.md': '.search-item',
		'tehnoline.md': '.item-product',
		'tehnoline.md': '.item-product',
		'santehmarket.md': '.product-grid-item',
		'robinet.md': '.search_products .product_card',
		'printer.md': '.product-layout',
		'magstore.md': '.wd-shop-product .products .product',
		'megabait.md': '.product-layout',
		'toybox.md': '.products-grid .product',
		'f24.md': '.products .product-item',
		'neocomputer.md': '.products-list .col-lg-4',
		'tshop.md': '.product-grid .product-layout',
		//'enter.online': '.search-product ul  > li > a',
		'enter.online': '.product-list .grid-item',
		'www.smart.md': '.search-item',
		'termotrade.md': '.mls-results ul li',
		'www.magico.md': '.search__result .catalog__pill.aos-init a',
		'zummer.md' : '.product',
		// 'computers.md' : '.product .h3 a',
		'computers.md' : '.autocomplete-w1 > div > div a,.cont .product',
		'tehnomag.md' : '.block_item .item',
        'fotomax.md' : '.product_card_container', // input
        'iremax.md' : '.grid-list .ty-grid-list__item',
        'nonstop.md' : '.block_element',
        'casacurata.md' : '#products_search_pagination_contents .ut2-gl__item',
        'tisam.md' : '.product-layout', // old bestdostavka
        'teplokom.md' : '.product-cut',
        'xstore.md' : '.category-prods .card-product',
        'www.impreso.md' : '.catlst tr td',
        'elcora.md' : '.post-title a',
        'fabrikhome.md' : '.products_list',
        'byone.md' : '.product-grid .product-grid-item',
        'deliver.md' : '.main-products .product-layout',
        'www.zap.md' : '.views-view-grid tr td',
        'exterior.md' : '.product_list .product',
        'electron.md' : '.search_products .product_card',
        'expertsecurity.md' : '.products .product',
        'www.musicshop.md' : '.product_grid_display .product_card',
        'livrez.md' : '.item_cat',
        'www.technodom.md' : '.product-layout',
        'kazinst.md' : '.pagination-pagination .product',
        'telemarket.md' : '.products__item',
        'www.oneshop.md' : '.products .product',
        'melon.md' : '.ut2-gl__body',
        'relaxe.md' : '.product-block',
        'damalio.md' : '#posts-container .product',
        'centrale.md' : '.products .product',
        'termocontrol.md' : '.product_item',
        'power-tools.md' : '.search-product .product-box',
        'ultra.md' : '.products-list .grid > .w-full',
        'lamashop.md' : '.product-grid .product-layout',
        'gamestop.md' : '.cf-item',
    };

    const includes = [
		'https://electro.md/index.php?route=product/search&search=*',
		'https://hamster.md/shop/shop_item/search/query:*',
		'https://accent.md/search/?search=*',
		'https://alo.md/ro/search?query=*',
		'https://extratel.md/index.php?route=product/search&search=*',
		'https://smarti.md/ro/search?query=*',
		'https://kub.md/search/?search=*',
		'https://gorilla.md/?product_cat=&post_type=product&s=*',
		'https://www.netmarket.md/ro/cautare_*',
		'https://clic.md/rom/catalog?fltr_lk__title=*',
		'https://unicom.md/index.php?route=product/search&search=*',
		'https://www.texet.md/product/search.html?search=*',
		'https://gig.md/?match=all&subcats=Y&pcode_from_q=Y&pshort=Y&pfull=Y&pname=Y&pkeywords=Y&search_performed=Y&pshort=N&pfull=N&pname=Y&pkeywords=Y&match=all&pcode_from_q=Y&dispatch=products.search&q=*',
		'https://www.cactus.md/ro/search/?q=*',
		'https://casashop.md/search/?search=*',
		'https://meserias.md/index.php?route=product/search&search=*',
		'https://xiaomistore.md/ro/search/all-products/?query=*',
		'https://costel.md/?post_type=product&s=*',
		'https://24mag.md/ro/search/-1_1.html?category=all&search=*',
		'https://www.gsmshop.md/product/search.html?search=*',
		'https://itunexx.md/ro/?option=com_virtuemart&page=shop.browse&search=true&view=category&limitstart=0&keyword=*',
		'https://grandshop.md/index.php?route=product/search&search=*',
		'https://nanoteh.md/ro/?cat=0&q=*',
		'https://uno.md/search/*',
		'https://eshop.moldcell.md/index.php?route=product/search&search=*',
		'https://eshop.orange.md/ro?query=*',
		'http://bestdeal.md/index.php?route=product/search&search=*',
		'https://eshop.md/md/search.aspx?search_string=*',
		'http://www.dostavka.md/ro/search?object=14&q=*',
		'https://www.fantastic.md',
		'https://www.fantastic.md/catalog?search=*',
		'https://doxyterra.md/ro/search?query=*',
		'https://maxmart.md/ro/produse/?q=*',
		'http://www.desire.md/ro/search?searchText=*',
		'https://www.zap.md/search*',
		'https://www.pandashop.md/ro/search/?text=*',
		'https://smadshop.md/ro/search/?search=*',
		'https://smadshop.md/poisk/?search=*',
		'https://maximum.md/ro/search?query=*',
		'https://master-lux.md/search?for=*',
		'https://andromeda.md/search?&text=*',
		'https://chasov.md/?post_type=product&s=*',
		'https://arcticaservice.md/?match=all&subcats=Y&pcode_from_q=Y&pshort=Y&pfull=Y&pname=Y&pkeywords=Y&search_performed=Y&dispatch=products.search&q=*',
		'https://h-t.md/?match=all&subcats=Y&pcode_from_q=Y&pshort=N&pfull=N&pname=Y&pkeywords=Y&search_performed=Y&dispatch=products.search&q=*',
		'https://www.metroterm.md/products/search?q=*',
		'https://magicshop.md/cauta?search=*',
		'https://watt.md/ro/cautare/*',
		'https://kamoto.md/?post_type=product&s=*',
		'https://prime-pc.md/search?searchfield=*',
		'https://yaki.md/rom/catalog?fltr_lk__title=*',
		'https://unitools.md/ro/catalog?search=*',
		'https://flexmag.md/cautare/dupa?search=*',
		'http://wildmart.md/index.php?route=product/search&search=*',
		'https://is.md/ro/product/search;search;*',
		'https://makeup.md/search/?q=*',
		'https://climatec.md/?post_type=product&dgwt_wcas=1&s=*',
		'https://bestbuy.md/?post_type=product&s=*',
		'https://smart-climat.md/ro/search?query=*',
		'https://bumerang.md/ro/component/virtuemart/results,1-20?x=0&y=0&limitstart=0&option=com_virtuemart&view=category&virtuemart_category_id=0&keyword=*',
		'http://www.bilgicom.md/search/index.php?q=*',
		'https://4elements.md/index.php?match=all&subcats=Y&pcode_from_q=Y&pshort=Y&pfull=Y&pname=Y&pkeywords=Y&search_performed=Y&dispatch=products.search&sl=ro&q=*',
		'https://cazan.md/ro/cautare?orderby=position&orderway=desc&search_category=all&s=*',
		'http://automarket.md/search/?search=*',
		'https://idvr.md/index.php?category_id=0&submit_search=&route=product%2Fsearch&search=*',
		'https://electromotor.md/?post_type=product&product_cat=0&s=*',
		'https://electrolux.com.md/ro/cautare/*',
		'https://autoshina.md/poisk/?search=*',
		'https://gipfel.md/ro/search?query=*',
		'https://stilis.md/?s=*',
		'https://bigshop.md/search/iphone?page=1*',
		'https://tehnoconduct.md/ro/catalogsearch/result/?q=*',
		'https://www.verix.md/ro/search?q=*',
		'https://nanu.md/ro/cautare?orderby=position&orderway=desc&s=*',
		'https://supraten.md/poisk&category_id=0&search=*',
		'http://www.all4office.md/ro/search/?action=searchresult&searchwhere=name&query=*',
		'https://monacu.md/ro/search/?search=Caut%C4%83%C2%A0&quicksearch=*',
		'https://instalatii.md/?product_cat=0&post_type=product&s=*',
		'https://pigeon.md/?match=all&subcats=Y&pcode_from_q=Y&pshort=Y&pfull=Y&pname=Y&pkeywords=Y&search_performed=Y&dispatch=search.results&q=*',
		'https://rebor.md/search/?search=*',
		'http://www.euroterm.md/ro/search?search=*',
		'https://mobileexpert.md/?post_type=product&s=*',
		'https://ergoform.md/index.php?route=product/search&search=*',
		'https://mamico.md/ro/search/?q=*',
		'https://tehnoinstrument.md/magazin/?product_cat&post_type=product&s=*',
		'https://garmin.md/?s=*',
		'https://www.kazane.md/ro/catalog/cautare?q=*',
		'https://euroelitstal.md/shop/search?text=*',
		'https://ogogo.md/?subcats=Y&pcode_from_q=Y&pshort=Y&pfull=Y&pname=Y&pkeywords=Y&search_performed=Y&search_id=&dispatch=products.search&q=*',
		'https://papirus.md/ldbslpb829cz/?search=*',
		'https://geek.md/md/search?search=',
		'https://automall.md/Catalog/Search?number=*',
		'http://emall.md/catalog/item/index?fltr_lk__title=*',
		'https://cap-cap.md/ro/cautare/*',
		'https://hikoki.md/ro/search?query=*',
		'https://costel.md/?post_type=product&s=*',
		'https://agropiese.md/cautare?for=*',
		'https://www.baby-boom.md/ro/search?s=*',
		'https://dicon.md/ro/cautare/?category=0&search=*',
		'https://catollux.md/ro/?match=all&subcats=Y&pcode_from_q=Y&pshort=Y&pfull=Y&pname=Y&pkeywords=Y&search_performed=Y&dispatch=products.search&q=*',
		'https://simplex.md/search/?search=*',
		'https://www.moldclima.md/ro/catalog/cautare?q=*',
		'https://www.bomba.md/ro/product/search/?search=*',
		'http://www.aiea.md/ro/catalogsearch/result/?q=*',
		'https://printeq.md/ro/component/virtuemart/results,1-24?keyword=*',
		'https://mvc.md/ro/search?query=*',
		'https://agroteh.md/ro/search/?search=*',
		'https://sad.md/ro/cautare/*',
		'https://cablu.md/search/?search=*',
		'https://volta.md/category/search/*',
		'https://mcs.md/ro/?product_cat=0&post_type=product&lang=ro&s=*',
		'https://tina.md/advanced_search_result.php?keywords=*',
		'https://altavista.md/ro/catalogsearch/result/?q=*',
		'https://savor.md/index.php?route=product/search&search=*',
		'https://instrumente.md/ro/cautare?orderby=position&controller=search&orderway=desc&search_query=*',
		'https://integramarket.md/ro/search/?q=*',
		'https://lumeainstrumentelor.md/?product_cat=0&post_type=product&s=*',
		'https://www.artmobila.md/ro/search/?q=*',
		'https://ascara.md/ro/search?query=*',
		'https://www.nitro.md/ro/search/?query=*',
		'https://rozetka.md/search/?inner=1&section=%2F&text=*',
		'https://viral.md/ro/search?query=*',
		'https://trivent.md/index.php?route=product/search&search=*',
		'https://www.printerra.md/index.php?route=product/search&category_id=0&search=*',
		'https://premiumstore.md/ro/search/?query=*',
		'https://optim.md/?post_type=product&s=*',
		'https://teplomall.md/ro/cautare/*',
		'http://baieplus.md/ro/cautare?controller=search&orderby=position&orderway=desc&search_query=*',
		'https://atehno.md/search/catalog?keywords=*',
		'https://zanussi.com.md/ro/cautare/*',
		'https://aircomfort.md/ro/search?query=*',
		'https://damicom.md/all-products?keyword=*',
		'http://www.inksystem.md/?s=*',
		'https://www.pride.md/ru/index.php?route=product/search&search=*',
		'https://zumarket.md/ro/cautare_*',
		'https://karchershop.md/ro/?post_type=product&dgwt_wcas=1&trp-form-language=ro&s=*',
		'http://daikin-shop.md/ro/search/*',
		'https://limon.md/ro/search?query=*',
		'https://altep.md/busca&category_id=0&search=*',
		'http://avemdetoate.md/search/?search=*',
		'https://fabrikhome.md/ro/search?query=*',
		'https://gefest.md/ro/search/?search=*',
		'https://jara.md/ro/cautare/*',
		'https://amber.md/?post_type=product&dgwt_wcas=1&lang=ro&s=*',
		'https://muncitorul.md/ro/search?search=*',
		'https://mediamusic.md/index.php/catalogsearch/result/?q=*',
		'https://termoformat.md/ro/search/*',
		'https://promstore.md/ro/search?query=*',
		'https://tehnoterm.md/ro/search?query=*',
		'https://shoptools.md/ro/search?query=*',
		'https://leoshop.md/toate-categoriile/search/?q=*',
		'https://www.termostar.md/ro/search/*',
		'https://xstyle.md/catalogsearch/result/?q=*',
		'https://nord-line.md/shop/search?text=*',
		'https://econstruct.md/ro/katalog/search/?q=*',
		'https://shopit.md/ro/catalog/search/?query=*',
		'https://termalex.md/shop/search?text=*',
		'https://www.foxmart.md/search?q=*',
		'https://teploplus.md/index.php?route=product/search&search=*',
		'https://robertino.md/?post_type=product&v=7dc10e66da55&s=*',
		'https://www.cauciucuri.md/ro/cautare.html?search=*',
		'https://daikin.com.md/ro/cautare/*',
		'https://imperia.md/ro/search/?search=*',
		'https://electroplus.md/ro/search?text=*',
		'https://refurb.md/ro/search/?query=*',
		'https://uniplast.md/ro/search?query=*',
		'https://casamea.md/ro/search/?search=*',
		'http://proglobus.md/index.php?route=product/search&search=*',
		'https://gtm.md/catalog/item/index?fltr_lk__title=*',
		'https://comp.md/search?search=*',
		'https://eurosanteh.md/ro/cautare/*',
		'https://mastertool.md/ro/search/?search=*',
		'https://termoplus.md/ro/search?query=*',
		'https://termo.md/?subcats=Y&pcode_from_q=Y&pshort=Y&pfull=Y&pname=Y&pkeywords=Y&search_performed=Y&dispatch=products.search&security_hash=dd3b90ee0b1d3b97f4ba04bfcbdb3279&q=*',
		'https://term.md/search/index.php?q=*',
		'https://tehnoline.md/ro/cautare?controller=search&s=*',
		'https://santehmarket.md/?post_type=product&s=*',
		'https://robinet.md/ro/search?query=*',
		'https://printer.md/index.php?route=product/search&sub_category=true&search=*',
		'https://magstore.md/?post_type=product&s=*',
		'https://megabait.md/search?search=*',
		'https://toybox.md/ro/search/*',
		'https://f24.md/ro/search?category=&query=*',
		'https://neocomputer.md/ro/index.php?route=product/search&search=*',
		'https://neocomputer.md/ro/index.php?route=product/search&route=product/search&search=*',
		'https://flexmag.md/cautare/dupa?search=*',
		'https://www.s-comp.md/ro/catalogsearch/result/?q=*',
		'https://matrix.md/?subcats=Y&pcode_from_q=Y&pshort=Y&pfull=Y&pname=Y&pkeywords=Y&search_performed=Y&pshort=N&pfull=N&pname=Y&pkeywords=N&match=all&pcode_from_q=Y&pcode=Y&dispatch=products.search&q=*',
		'http://mgh.md/index.php?route=product/search&search=*',
		'https://tshop.md/ro/search/?search=*',
		'https://zummer.md/products/search',
		'https://computers.md/search',
		'http://tehnomag.md/ro/search/item?query=*',
		'http://iremax.md/?subcats=Y&pcode_from_q=Y&pshort=Y&pfull=Y&pname=Y&pkeywords=Y&search_performed=Y&dispatch=products.search&q=*',
		'https://nonstop.md/search/?key=*',
		'https://casacurata.md/?match=all&subcats=Y&pcode_from_q=Y&pshort=Y&pfull=Y&pname=Y&pkeywords=Y&search_performed=Y&dispatch=products.search&q=*',
		'https://tisam.md/search/?search=*',
		'https://teplokom.md/shop/search?text=*',
		'https://www.practic.md/?product_cat=&post_type=product&s=*',
		'https://xstore.md/search?search=*',
		'http://www.impreso.md/ro/search?text=*',
		'https://elcora.md/?numberposts=5&results_hide_fields=post_titles%2Cmeta%2Cimage&s=*',
		'https://darwin.md/search?search=*',
		'https://byone.md/ro/search-catalog-result?search=*',
		'https://deliver.md/index.php?route=product/search&search=*',
		'https://exterior.md/ro/catalog/search?q=*',
		'https://electron.md/ro/search?query=*',
		'https://expertsecurity.md/?post_type=product&s=*',
		'https://www.musicshop.md/produse/categorie?cid=-1&q=*',
		'https://livrez.md/search/?search=*',
		'https://www.technodom.md/index.php?route=product/search&search=*',
		'https://kazinst.md/?post_type=product&s=*',
		'https://overlock.md/ro/search?query=*',
		'https://www.telemarket.md/search/?search=*',
		'https://power-tools.md/ro/search#/?q=*',
		'https://www.oneshop.md/?product_cat=0&post_type=product&s=*',
		'https://melon.md/?match=all&subcats=Y&pcode_from_q=Y&pshort=Y&pfull=Y&pname=Y&pkeywords=Y&search_performed=Y&dispatch=products.search&q=*',
		'https://relaxe.md/search/result?country=*',
		'https://damalio.md/?s=*',
		'https://centrale.md/?post_type=product&s=*',
		'https://ultra.md/search?inStock=1&search=*',
		'https://lamashop.md/search/?description=true&search=*',
		'https://gamestop.md/ro/search?search=*',
		'https://www.eldorado.ru/search/catalog.php?q=*',
		'https://www.compari.ro/CategorySearch.php?st=*',
		'https://www.emag.ro/search/*',
		'https://www.mvideo.ru/product-list-page?q=*',
		// 'https://enter.online/#',
		'https://enter.online/search?query=*',
		// 'https://www.smart.md/#',
        'https://www.smart.md/s?query=*',
		'https://termotrade.md/ro/#',
		'https://www.magico.md/ro/#',
		'https://zummer.md/#',
		'https://computers.md/#',
		'https://fotomax.md/ro/search?query=*',
		//'https://termocontrol.md/#',
		'https://termocontrol.md/all-products?keyword=*',
    ];

    const searchInputs = {
		//'enter.online': '.search-input',
		// 'www.smart.md': '.__new_input_search_home',
		// 'www.magico.md': '#search-component input',
		'zummer.md': '#search_input',
		// 'termocontrol.md': '#story,#searchinput',
		//'termocontrol.md': '.search-field1 input,.searchtable input.textin',
		'computers.md': '.input_search',
		// 'fotomax.md': '.sns-searchwrap .proinput .orig',//
		'termotrade.md': '#mod-mls-searchword-mls_mod_187',//
		'eshop.moldcell.md': '#search #input-search',//
    }

    let sleepBool = false;
    if(searchInputs[location.hostname] !== undefined && location.hash) {
        let search = decodeURI(location.hash.substring(1).split('&')[0]);
        /*if (['fotomax.md'].includes(location.hostname)) {
			// load jQuery and execute the main function
			// addJQuery(main);
			document.querySelector(searchInputs[location.hostname]).value=search;
			document.querySelector('.sns-searchwrap .innericon').click();
        }else */if(['termotrade.md'].includes(location.hostname)) {
        	// addJQuery(main);
			jQuery(searchInputs[location.hostname]).val(search);
			jQuery(searchInputs[location.hostname]).trigger('mouseup');
        }
        else {
        	if ($(searchInputs[location.hostname]).last().val() != search)
				$(searchInputs[location.hostname]).val(search).trigger('keyup').trigger('change').click().parents('form').submit();
        }
		//$('#search_input').val('iphone 11').trigger('keyup').trigger('change').click();
		sleepBool = true;
    }

    //new add sleep for ajax reslut websites like zap.md
    if (['www.zap.md','bigshop.md','f24.md','power-tools.md', 'alo.md', 'www.smart.md'].includes(location.hostname)) {sleepBool = true;}
	var close = true;
    if(['www.mvideo.ru','www.eldorado.ru'].includes(location.hostname)) close=false;

    let searchText;
    var str = location.href;
	const urlParams = new URLSearchParams(window.location.search);
	let hashSlipt = location.hash.split('&');
    includes.forEach((product) => {
        if(!product.includes(location.origin)) return;
        product = product.replace('*', '');
        str = str.replace(product, '');
        str = str.replace('%21', '!');
        // alert(str);
        // alert(encodeURI(urlParams.get('dopsearch')));
        // alert(encodeURIComponent(urlParams.get('dopsearch')));
        // str = str.replaceAll('/', '');

		if(urlParams.has('ns')) str = str.replace('&ns='+encodeURI(urlParams.get('ns')), '').replace('?ns='+encodeURI(urlParams.get('ns')), '');//mb encodeURIComponent
		if(urlParams.has('dopsearch')) str = str.replace('&dopsearch='+encodeURI(urlParams.get('dopsearch')), '').replace('?dopsearch='+encodeURI(urlParams.get('dopsearch')), '');//mb encodeURIComponent
		if(hashSlipt.length>1) str = str.replace('&'+hashSlipt[1], '');//mb encodeURIComponent
	});

	// alert(str);
	// alert(decodeURIComponent(str));
	searchText = decodeURIComponent(str.replace(/\+/g, '%20'));
	searchText = searchText.split('&dopsearch')[0];

	if (['eshop.moldcell.md'].includes(location.hostname)) {
		$('.search .fa.fa-search').click();
		$(searchInputs[location.hostname]).val(searchText).trigger('keydown').trigger('keyup');
		sleepBool = true;
	}

	async function searchResults() {
		if(sleepBool) await sleep(7500);
	    var products = document.querySelectorAll(selectors[location.hostname]);
	    if(!products.length && close) {
	    	//return window.close();
	    }

	    //new some websites give results even if keywords were not found. Search products text to find keywords or close.
		if(['www.zap.md'].includes(location.hostname)) {
			var hash = window.location.hash.substr(1);
			var result = hash.split('&');
			str = result[0].substring(5);
			searchText = decodeURI(str.replace(/\+/g, '%20'));
		}

		if(['zummer.md'].includes(location.hostname)) {
			searchText = '';
		}

		// alert(str);
		console.log(products);
		/*NEW smadshop search by ID enter product*/
		if (location.hostname === 'smadshop.md' || location.pathname === '/poisk/') {return products[0].querySelectorAll('a')[0].click();}


		// if (/*(location.hostname === 'enter.online' && products.length === 10) || */location.hostname === 'www.smart.md' && products.length === 5) close = false;

	    let found = 0;
	    products.forEach((product) => {
	    	let href = products[0].querySelectorAll('a')[0].getAttribute('href');
	    	href ? href.toLowerCase() : '';
    		if(product.textContent.toLowerCase().includes(searchText.toLowerCase())) {
    			found++;
    		}else if(product.textContent.toLowerCase().includes(searchText.replace(' ', '').toLowerCase()) || product.textContent.toLowerCase().includes(searchText.replace(' ', '-').toLowerCase())){
    			found++;
			}else if(href.includes(searchText.replace(' ', '_').toLowerCase()) || href.includes(searchText.replace(' ', '-').toLowerCase())){
				found++;
			}else {
    			if(!['www.mvideo.ru'].includes(location.hostname))
					product.remove();
    		}
		});

		products.forEach((product) => {
			let href = products[0].querySelectorAll('a')[0].getAttribute('href');
			href ? href.toLowerCase() : '';
			if(product.textContent.toLowerCase().includes(searchText.toLowerCase())) {
				found++;
			}else if(product.textContent.toLowerCase().includes(searchText.replace(' ', '').toLowerCase()) || product.textContent.toLowerCase().includes(searchText.replace(' ', '-').toLowerCase())){
				found++;
			}else if(href.includes(searchText.replace(' ', '_').toLowerCase()) || href.includes(searchText.replace(' ', '-').toLowerCase())){
				found++;
			}else {
				product.remove();
			}
		});


		var products = document.querySelectorAll(selectors[location.hostname]);
		console.log(products);
		console.log(searchText);
		// if search 1 word then find exact that word
		var searchTextSplit = searchText.split(" ");
		if(products.length > 1 && searchTextSplit.length == 1) {
		    products.forEach((product) => {
		    	// console.log(product.textContent.replace(/\r?\n|\r/g, " ").replace(/['"]+/g, '').replace(',', '').toLowerCase())
	    		if(product.textContent.replace(/\r?\n|\r/g, " ").replace(/['"]+/g, '').replace(',', '').toLowerCase().split(" ").includes(searchText.toLowerCase())) {
	    			found++;
	    		}else {
					//product.remove();
	    		}
			});

			products = document.querySelectorAll(selectors[location.hostname]);
		}

		if(products.length == 2 && selectors[location.hostname].includes(',')) {
			let selectorsSplit = selectors[location.hostname].split(",");
			products = document.querySelectorAll(selectorsSplit[0]);
			if(!products.length) products = document.querySelectorAll(selectorsSplit[1]);
		}



		//NEW. search by dop keywords
		if (products.length) {
			const urlParams = new URLSearchParams(window.location.search);
			let dopSearches = [];
			if(urlParams.has('dopsearch')) {
				dopSearches.push(urlParams.get('dopsearch').split('|'));
			}else if(location.hash.split('&').length > 1 && location.hash.includes('dopsearch')) {
				dopSearches.push(decodeURIComponent(location.hash.split('&')[1].replace('dopsearch=', '')).split('|'));
			}
			if (dopSearches.length) {
				found=0;
			    dopSearches[0].forEach((s) => {
			    	products = document.querySelectorAll(selectors[location.hostname]);
			    	console.log(s);
				    products.forEach((product) => {
				    	//NEW search OR search
			    		if(s.includes(' OR ')) {
			    			var s1 = s.split(' OR ');
			    			var foundOR = false;
							s1.forEach((searchEachOr) => {
								if (product.textContent.toLowerCase().includes(searchEachOr.toLowerCase()) || product.textContent.toLowerCase().includes(searchEachOr.replace(' ', '').toLowerCase()) || product.textContent.toLowerCase().includes(searchEachOr.replace(' ', '').toLowerCase())) foundOR=true;
							});
							if (!foundOR) product.remove();
							return;
			    		}

				    	if(s[0] === '!') {
				    		var s2 = s.replace('!','');
				    		console.log(s2);
		    				var searchTextSplit2 = s2.split(" ");
							// if(searchTextSplit.length == 1) {
							// }
							if(searchTextSplit2.length == 1 && product.textContent.replace(/\r?\n|\r/g, " ").replace(/['"]+/g, '').replace(',', '').toLowerCase().split(" ").includes(s2.toLowerCase())) {
				    		// if(product.textContent.toLowerCase().includes(s2.toLowerCase()) || product.textContent.toLowerCase().includes(s2.replace(' ', '').toLowerCase()) || product.textContent.toLowerCase().includes(s2.replace(' ', '').toLowerCase())) {
				    			// console.log(product.textContent.toLowerCase());
				    			product.remove();
				    		}else {
								found++;
				    		}
				    	}else {
				    		if(product.textContent.toLowerCase().includes(s.toLowerCase()) || product.textContent.toLowerCase().includes(s.replace(' ', '').toLowerCase()) || product.textContent.toLowerCase().includes(s.replace(' ', '').toLowerCase())) {
				    			found++;
				    		}else {
								product.remove();
				    		}
				    	}

					});
				});
				console.log(dopSearches);
			}
		}

		products = document.querySelectorAll(selectors[location.hostname]);
	    if(products.length == 1) {
	    	let element = products[0];
			if (location.hostname === 'www.dostavka.md' || location.hostname === 'amber.md' || location.hostname === 'www.mvideo.ru' || location.hostname === 'www.eldorado.ru') element = element.querySelectorAll('a')[2];
			else if (location.hostname === 'www.eldorado.ru') element = element.querySelectorAll('a')[4];
			else if (location.hostname === 'extratel.md' || location.hostname === 'ultra.md' || location.hostname === 'casamea.md' || location.hostname === 'mastertool.md' || location.hostname === 'arcticaservice.md' || location.hostname === 'tshop.md' || location.hostname === 'deliver.md' || location.hostname === 'lamashop.md' || location.hostname === 'www.oneshop.md' || location.hostname === 'xiaomistore.md') element = element.querySelectorAll('a')[1];
			else if(location.hostname === 'prime-pc.md' )  element = element.querySelectorAll('a[href^="/"]')[0];
			// else if(location.hostname === 'electroplus.md' )  element = element.querySelectorAll('a[href^="https://electroplus.md/produs"]')[0];
			else if(products[0].tagName !== 'A') element = element.querySelectorAll('a')[0];
			// new item can be wrapped in a tag so check parent.
			if(!element && products[0].parentElement.tagName === 'A') element = products[0].parentElement;

			if(['www.eldorado.ru'].includes(location.hostname)) {
				if(element.getAttribute('href').indexOf('?show=response') < 0) return location.href = element.getAttribute('href')+'?show=response';
				return location.href = element.getAttribute('href');
			}
			element.removeAttribute('target');
			element.click();

	    	// console.log(element);
	    }



		// console.log(found);
		const urlParams = new URLSearchParams(window.location.search);

		if(!found && close/* && !urlParams.has('dopsearch')*/) {
			// NEW. try to search another keyword
			if(!sleepBool) {
				if(urlParams.has('ns') && urlParams.get('ns') !== str && urlParams.get('ns') !== searchText) return location.href = location.href.replace(str, urlParams.get('ns'));

				if(searchTextSplit.length == 1 && searchText.includes('-')) {
					// var url = new URL(location.href.replace(str, str.replace('-', '')));
					// url.searchParams.append('ns', searchText.replace('-', '%20'));
					var url = location.href.replace(str, str.replace('-', ''));
					if(url.includes('?')) url+= '&ns='+str.replace('-', ' ');
					else url+= '?ns='+str.replace('-', ' ');


					return location.href = url;
				}
			}

			return window.close();
		}

	}

    if ((['www.emag.ro'].includes(location.hostname) && location.pathname.indexOf('/pd/') > 0) || (['www.mvideo.ru'].includes(location.hostname) && location.pathname.indexOf('/products/') == 0) || (['www.eldorado.ru'].includes(location.hostname) && location.pathname.indexOf('/cat/detail/') == 0)) {
    	let data = [];
    	let timeOut = 0;
    	if(['www.emag.ro'].includes(location.hostname)) {
    		var selector = {"container":".product-review-item","comment":".review-body-container","name":".product-review-author","date":"mrg-sep-none","stars":".star-rating","starsClass":1,"search_products":".card-collection .card-item"};
    	}
    	else if(['www.mvideo.ru'].includes(location.hostname)) {
    		// if(location.pathname.indexOf('/reviews') < 0)  {
    		// 	return $('mvid-reviews .mv-main-button div').click();
    		// 	return location.href = location.href+'/reviews';
    		// }
    		var selector = {"container":".review-ext-wrapper ","comment":".review-ext-item-description-item:last-of-type > p > span","name":".review-ext-item-author-name","date":".review-ext-item-date","stars":".review-ext-stars-ratings-all span","starsTxt":1,"search_products":".product-card__title-line"};
    		var selector = {"container":"mvid-extended-review","comment":".review-text__item:last-of-type span","name":".head__name","date":".head__dateNO","stars":".total-rating,.rating-value","starsTxt":1,"search_products":".product-card__title-line"};
    		timeOut = 5000;
		}
    	else if(['www.eldorado.ru'].includes(location.hostname)) {
    		if(location.href.indexOf('?show=response') < 0)  {return location.href = location.href+'?show=response';}
    		var selector = {"container":".usersReviewsListItem","comment":".usersReviewsListItemInnerContainer .middleBlockItem","name":".topBlockItem .userName","date":".topBlockItem .userReviewDate","stars":"meta","starsEq":1,"search_products":"ul[data-dy='productsList'] li[data-dy='product']"};
		}
		setTimeout(function() {
		window.scrollTo(100,1900);
		},500);
		setTimeout(function() {
			// alert($('mvid-reviews .mv-main-button').length);
			// if(['www.mvideo.ru'].includes(location.hostname))
			// 	$('mvid-reviews .mv-main-button div').click();

			// $('mvid-reviews .mv-main-button div').on('click',function(e){
   //              e.preventDefault();
   //              e.stopPropagation();
   //              alert(77);
			// });

			// var element = document.querySelector('mvid-reviews .mv-main-button div');
			// element.addEventListener("click", function(e) {
			//     alert('something');
			// }, false);

			setTimeout(function() {
				var comments = document.querySelectorAll(selector.container);
		    	console.log(comments);
		    	if(!comments.length) return window.close();
			    comments.forEach((comment) => {
		    		var name = comment.querySelector(selector.name).textContent;
		    		var date = comment.querySelector(selector.date);
		    		if(date) date = date.innerText
					else date = false;
		    		// var commentT = comment.querySelector(selector.comment).firstChild.textContent.trim();
		    		var commentNodes = comment.querySelector(selector.comment).childNodes;
		    		commentNodes.forEach((commentI, i) => {
			    		if(commentI.nodeType == 1) comment.querySelector(selector.comment).removeChild(commentNodes[i]);
					});
					var commentT = comment.querySelector(selector.comment).innerText.replace(/['"]+/g, '');
		    		var stars = comment.querySelectorAll(selector.stars);
		    		//stars
		    		if (selector.starsEq) stars = stars[selector.starsEq].getAttribute('content');
		    		else if (selector.starsTxt) stars = stars[0].textContent;
		    		else if (selector.starsClass) {
		    			stars = stars[0].getAttribute('class');
		    			stars = stars.replace(/[^0-9.]+/, '',)[0];
		    		}
		    		else stars = stars.length;

		    		data.push([name,date,commentT,stars]);
				});
				// location.href=data;
				let dataJ = JSON.stringify(data);
				console.log(data);
				window.history.pushState({}, '', '/1');
				window.history.pushState({}, '', dataJ);
			},500);

		// window.open(data, '_blank');
		}, timeOut);


    }else {
		searchResults();
    }


    //sleep helper
    function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	function addJQuery(callback) {
		var script = document.createElement("script");
		script.setAttribute("src", "//code.jquery.com/jquery-3.4.1.min.js");
		script.addEventListener('load', function() {
		var script = document.createElement("script");
		script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
		document.body.appendChild(script);
		}, false);
		document.body.appendChild(script);
	}

	// the guts of this userscript
	function main() {
		let search = decodeURI(location.hash.substring(1));
		jQuery('#mod-mls-searchword-mls_mod_187').val(search).trigger('mouseup').trigger('keyup').trigger('change').click().parent().submit();
		jQuery('#mod-mls-searchword-mls_mod_187').trigger('mouseup').trigger('keyup').trigger('change').click().parent().submit();

	}

	// window.addEventListener('message', event => {
	//     // IMPORTANT: check the origin of the data!
	//     if (event.origin.startsWith('https://e-catalog.md')) {
	//         // The data was sent from your site.
	//         // Data sent with postMessage is stored in event.data:
	//         console.log(event.data);
	//         alert(event.data);
	//     } else {
	//         // The data was NOT sent from your site!
	//         // Be careful! Do not use it. This else branch is
	//         // here just for clarity, you usually shouldn't need it.
	//         return;
	//     }
	// });
})();