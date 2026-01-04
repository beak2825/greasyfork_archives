// ==UserScript==
// @name         NewFaceForDokiitoys
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  New Face For Dokiitoys
// @author       Mesak
// @match        https://www.dokiitoys.com/faq
// @match        https://www.dokiitoys.com/member/wishlist
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/template7/1.4.1/template7.min.js
// @license      MIT
// @grant        GM_addElement
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/443585/NewFaceForDokiitoys.user.js
// @updateURL https://update.greasyfork.org/scripts/443585/NewFaceForDokiitoys.meta.js
// ==/UserScript==

(function($) {
    //'use strict';
    const BaseUrl = 'https://www.dokiitoys.com/'
    $('link[href^="https://hinetcdn.waca.ec"]').remove();

    GM_addElement('link', {
        href: 'https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css',
        rel: 'stylesheet'
    });
    GM_addElement('link', {
        href: 'https://cdnjs.cloudflare.com/ajax/libs/admin-lte/3.2.0/css/adminlte.min.css',
        rel: 'stylesheet'
    });


const appMainTmpl = `
<aside class="main-sidebar sidebar-dark-primary elevation-4">
    <section class="sidebar os-host os-theme-light os-host-overflow os-host-overflow-y os-host-resize-disabled os-host-scrollbar-horizontal-hidden os-host-transition" id="sidebar">
    </section>
</aside>
<div class="content-wrapper">
    <section class="content-header">
    <div class="container-fluid">
      <div class="well well-sm">
        <strong>Category Title</strong>
        <div class="btn-group">
            <a href="#" id="list" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-th-list">
            </span>List</a> <a href="#" id="grid" class="btn btn-default btn-sm"><span
                class="glyphicon glyphicon-th"></span>Grid</a>
        </div>
      </div>
    </div>
    </section>
    <section class="content" id="content">
      <div class="container-fluid">
        <div class="card card-solid">
          <div class="card-body pb-0">
            <div class="row" id="productList"></div>
            <div id="moreProduct"></div>
          </div>
        </div>
      </div>
    </section>
</div>
`;
const productListTmpl = `
{{#each list}}
<div class="col-12 col-sm-6 col-md-4 d-flex align-items-stretch flex-column">
    <div class="card bg-light d-flex flex-fill">
        <div class="card-header text-muted border-bottom-0">
            {{title}}
        </div>
        <div class="card-body pt-0">
            <div class="row">
                <div class="col">
                    <img src="{{photo}}" alt="{{title}}" class="img-fluid w-100">
                </div>
            </div>
        </div>
        <div class="card-footer">
            <div class="text-right">
                <p class="lead">{{product_price price}}</p>
                <a href="{{link}}" class="btn btn-sm btn-primary">
                    <i class="fas fa-cart"></i> 產品連結
                </a>
            </div>
        </div>
    </div>
</div>
{{/each}}
`
const btnMoreProductTmpl = `<button class="btn btn-success" id="btnLoadMore" data-cid="{{cid}}" data-type="{{type}}" data-page="{{page}}">more</button>`
    GM_addStyle(`.glyphicon { margin-right:5px; }
`)
    Template7.registerHelper('product_price', function (price) {
       return price.toString() == '0' ? '完售' : price;
    });

    let $sidebarHTML = $('.el_nav_aside_inner').clone().attr('class','nav nav-pills nav-sidebar flex-column');
    $sidebarHTML.find('li').attr('class','nav-item');
    $sidebarHTML.find('ul').attr('class','nav');
    $sidebarHTML.find('a').attr('class','nav-link').removeAttr('style');
    $sidebarHTML.find('input').remove();

    document.querySelector('body').setAttribute('class','sidebar-mini layout-fixed')
    document.querySelector('body').setAttribute('style','height: auto;')
    document.querySelector('body').innerHTML = Template7.compile(`<div id="app" class="wrapper">{{ body }}</div>`)({body:appMainTmpl});
    var resource = new Map();
    var $eleContent = $('#content')
    var $eleSidebar = $('#sidebar')
    var $eleProductList = $('#productList')
    var $eleMoreProduct = $('#moreProduct')

    $eleSidebar.append( $sidebarHTML );
    $eleSidebar.on('click' , 'a', (e)=>{
        let url = $(e.currentTarget).attr('href')
        getContent( getUrl( url ) )
        e.preventDefault()
    })
    $eleMoreProduct.on('click','#btnLoadMore' , ()=>{
        if( $('#btnLoadMore').data('type') == 'category'){
            runGetCategory( $('#btnLoadMore').data('cid') , $('#btnLoadMore').data('page') )
        }else{
            runGetNew($('#btnLoadMore').data('page') )
        }
    })
    runGetNew( 1 )
    function getUrl( url ){
        return BaseUrl + url.replace(BaseUrl,'');
    }
    function getContent( url ){
        let RegExpObject = /category\/(\d+)/
        if( url.indexOf( 'category/' ) != -1 && RegExpObject.test(url)){
            let categoryId = url.match(RegExpObject)[1];
            $eleProductList.empty();
            runGetCategory(categoryId,1);
        }
    }

    function runGetNew( page ){
        getProductList('newest', null , page).then( (result) => {
            $.each(result, (index,item) => {
                resource.set(item.id, item);
            })
            return {list:result}
        }).then( (data) => {
            //console.log( data )
            if( data.list.length == 20){
                $eleMoreProduct.html(Template7.compile(btnMoreProductTmpl)({page : (page+1), 'type':'newest'}))
            }else{
                $eleMoreProduct.empty();
            }
            $eleProductList.append( Template7.compile(productListTmpl)(data))
        })
    }
    function runGetCategory(cid, page ){
        getProductList('category',cid , page).then( (result) => {
            $.each(result, (index,item) => {
                resource.set(item.id, item);
            })
            return {list:result}
        }).then( (data) => {
            //console.log( data )
            if( data.list.length == 20){
                $eleMoreProduct.html(Template7.compile(btnMoreProductTmpl)({cid: cid , page : (page+1) , 'type':'category'}))
                setTimeout( ()=>{
                    $('#btnLoadMore').click();
                },500)

            }else{
                $eleMoreProduct.empty();
            }
            $eleProductList.append( Template7.compile(productListTmpl)(data))
        })
    }

    function getProductList(type = 'category',categoryId = null , page = 1){
       return new Promise((resolve, reject) => {
       $.post( 'https://www.dokiitoys.com/productlist' ,{
                type: type,
                value: categoryId,
                sort: 'newest',
                page: page
            } , (response)=>{
                let oFragmeng = $(document.createDocumentFragment());
                oFragmeng.append(response);
                let result = [];
                $('li.item_block', oFragmeng).each( (key,node) => {
                    let itemPhoto = $('span.item_photo',node);
                    let itemLink = $('a.clearfix:first',node);
                    let itemBtn = $('button.js_wishlist_add',node);
                    let item = {
                        id : itemBtn.attr('data-pid'),
                        link : itemLink.attr('href'),
                        photo : itemPhoto.attr('data-src'),
                        title : itemPhoto.attr('title'),
                        price : 0 ,
                    }
                    if( $('span.font_montserrat',node).length )
                    {
                       item.price = $('span.font_montserrat',node).text()
                    }
                    result.push(item)
                })
                resolve(result);
            })
       });
    }

})(window.jQuery);