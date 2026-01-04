// ==UserScript==
// @name         Ajout rapide d'ingrédient RecipeShopping - Migros
// @namespace    http://tampermonkey.net/
// @version      2025.04.24
// @description  Ajoute un bouton sur le site de la Migros (et de la coop) pour facilement ajouter un ingrédient sur l'app RecipeShopping
// @author       cLineLy
// @include      https://produits.migros.ch/*
// @include      https://www.migros.ch/*
// @include      https://migros.ch/*
// @include      https://coop.ch/*
// @include      https://www.coop.ch/*
// @icon         https://www.google.com/s2/favicons?domain=migros.ch
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437361/Ajout%20rapide%20d%27ingr%C3%A9dient%20RecipeShopping%20-%20Migros.user.js
// @updateURL https://update.greasyfork.org/scripts/437361/Ajout%20rapide%20d%27ingr%C3%A9dient%20RecipeShopping%20-%20Migros.meta.js
// ==/UserScript==

(function() {

    console.log('clinely is watching u');
    var API = `https://ace-developement.ch/API/openuri.php?r=ingredient%2Fcreate-from-${window.location.hostname.includes('coop') ? 'coop' : 'migros'}`;
    //  API = `https://ace-developement.ch/API/debug/openuri.php?r=ingredient%2Fcreate-from-${window.location.hostname.includes('coop') ? 'coop' : 'migros'}`;
    var safetyNet = 0;
    var previousHref = location.href;
    var checkExistActicles;
    var checkExistSingle;
    var checkHref;
    var cssAdded=false;
    var htmlAdded=false;
    var params;

    let isMobile = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) isMobile = true;})(navigator.userAgent||navigator.vendor||window.opera);


    function handleDropdownPosition(button) {
        const screenPadding =((!isMobile) ? 50 : 5); ;

        //const placeholderRect = button.parentElement.getBoundingClientRect();
        const placeholderRect = button.getBoundingClientRect();
        var ddR = document.querySelector('.clinely-ingredient-popup');
        ddR.style.transform = `translateX(0)`;
        ddR.style.display = 'block';
        const dropdownRect = ddR.getBoundingClientRect();
        ddR.style.display = '';

        const dropdownRightX = dropdownRect.x + dropdownRect.width;
        const placeholderRightX = placeholderRect.x + placeholderRect.width;

        if (dropdownRect.x < screenPadding) {
            ddR.style.transform = `translateX(${-placeholderRect.x + screenPadding}px)`;
        } else if (dropdownRightX + screenPadding > window.outerWidth) {
            ddR.style.transform = `translateX(${(window.outerWidth - dropdownRightX) - screenPadding}px)`;
        }
    }
    var setPopupPosition = function(e,button =null){
        var pageX, pageY;
        if(e.pageX==null){
            pageX = e.originalEvent.touches[0].pageX;
            pageY = e.originalEvent.touches[0].pageY;
        }
        else{
            pageX = e.pageX;
            pageY = e.pageY;
        }
        document.querySelectorAll('.clinely-ingredient-popup').forEach(div=>{
            div.style.left = (pageX-20) + 'px'
            div.style.top = (pageY+20) + 'px'
        })
        if(this.parentElement != null)
            button = this;
        handleDropdownPosition(button);
        document.querySelectorAll('.clinely-ingredient-popup,.clinely-ingredient-popup-wrapper').forEach(div =>div.classList.add('open'));
        document.querySelectorAll('.clinely-link-wrapper').forEach(div =>div.classList.remove('active'));
        button.classList.add('active');
        return false;
    }
    var setRightClickWatcher = function(){
        var wrappers = document.querySelectorAll('.clinely-link-wrapper:not(.right-click-watched)');
        if(wrappers.length){
            wrappers.forEach(div=>div.classList.add('right-click-watched'))
            if(!isMobile)
                wrappers.forEach(div=>div.addEventListener('contextmenu', e =>{e.preventDefault();setPopupPosition(e,div);}));
            else if(typeof wrappers.on !== "undefined"){
                var timeoutId = 0;
                wrappers.on('touchstart', function(ev) {
                    var button = this;
                    timeoutId = setTimeout(function() {setPopupPosition(ev,button);}, 500);
                }).on('touchend', function() {
                    clearTimeout(timeoutId);
                }).contextmenu(function() {return false;});
                $('.clinely-ingredient-popup-wrapper').contextmenu(function() {return false;});
            }


        }
    };
    var addButtonsArticles = function() {
        var multiSelector = ['div[data-testid=msrc-articles--article-list] article[data-testid="msrc-articles--article"]',
                             'ul[data-product-container] >li > div',
                             'lsp-grid-display ul.subcat li.item',
                             'aside.sidebar',
                             '.productBasicInfo--newTile',
                             '.product-core-container',
                             '.productBasicInfo--compact',
                             'article.product-card',
                            ];
        waitForElm(multiSelector.join(':not(.clinely-watching),')+':not(.clinely-watching)').then((div) => {
            console.log('addButtonsArticles on',div);
            injectCSS();
            injectHTML();
            var url = div.querySelector('a[data-testid="msrc-articles--article-link"]');
            if(!url) url = div.querySelector('a');
            if(url) url = url.getAttribute('href');
            if(!url){
                url = document.head.querySelector('[property~="og:url"][content]');
                if(url) url = url.content;
                else url = window.location.href; /* for single selector pages (detail of an article)*/
            }

            if(url.substring(0,1) == '/')url = window.origin+url;
            if(url.split('?').length>1)url = url.split('?')[0];
            if(url.includes('/mo/')){
                console.log('MO !');
                var title = div.querySelector('mo-product-detail-title') //main ingr title
                if(!title)
                    title = div.querySelector('mo-product-name') // small card title
                console.log('title',title)
                if(title){
                    url += '&name='+title.textContent.trim().replace("'",'&#39;')
                    console.log('name',title.textContent,url)
                }
            }
            var RS_icon = '<div class="clinely-link-wrapper" onclick=\'loadpopunder("'+API+'&url='+url+'")\'><div><svg class="svg-inline--fa fa-receipt fa-w-12" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="receipt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><path fill="currentColor" d="M358.4 3.2L320 48 265.6 3.2a15.9 15.9 0 0 0-19.2 0L192 48 137.6 3.2a15.9 15.9 0 0 0-19.2 0L64 48 25.6 3.2C15-4.7 0 2.8 0 16v480c0 13.2 15 20.7 25.6 12.8L64 464l54.4 44.8a15.9 15.9 0 0 0 19.2 0L192 464l54.4 44.8a15.9 15.9 0 0 0 19.2 0L320 464l38.4 44.8c10.5 7.9 25.6.4 25.6-12.8V16c0-13.2-15-20.7-25.6-12.8zM320 360c0 4.4-3.6 8-8 8H72c-4.4 0-8-3.6-8-8v-16c0-4.4 3.6-8 8-8h240c4.4 0 8 3.6 8 8v16zm0-96c0 4.4-3.6 8-8 8H72c-4.4 0-8-3.6-8-8v-16c0-4.4 3.6-8 8-8h240c4.4 0 8 3.6 8 8v16zm0-96c0 4.4-3.6 8-8 8H72c-4.4 0-8-3.6-8-8v-16c0-4.4 3.6-8 8-8h240c4.4 0 8 3.6 8 8v16z"></path></svg></a></div>';
            div.insertAdjacentHTML('afterbegin', RS_icon);
            div.classList.add('clinely-watching');
            setRightClickWatcher();
            addButtonsArticles();
        });
    };
    addButtonsArticles();



    function injectCSS() {
        if(!cssAdded){
            cssAdded=true;
            var css = `
                body{
                	overflow-x:hidden !important;
                	--icon-color:#f60;
                }
                body.pageHeader__document-body{
                	--icon-color:#ff8c00;
                }
                .product-core-container{
                	position:relative;
                }
                .product-core-container .clinely-link-wrapper {
                    top: -5px;
                    right: -5px;
                }
                .clinely-link-wrapper {
                    position:absolute;
                    bottom: 0px;
                    right: 0px;
                    height: 30px;
                    width: 30px;
                    border-radius: .6153846154em 0 .6153846154em;
                    background: rgb(51, 51, 51);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow:hidden;
                    cursor:pointer;
                    z-index: 5;
                }
                .clinely-link-wrapper *{
                    pointer-events: none;
                }
                .sidebar-container aside .clinely-link-wrapper {
                    top: -22px;
                    right: -89%;
                    position: relative;
                    margin-bottom: -45px;
                    z-index: 5;
                    height: 35px;
                    width: 35px;
                    border: rgb(71, 71, 71) 2px solid;
                }
                .clinely-link-wrapper:before {
                    content: "";
                    position: absolute;
                    top: 200%;
                    left: 150%;
                    height: 60px;
                    width: 60px;
                    border-radius: 50%;
                    background: var(--icon-color);
                    transition: all .2s ease-out;
                }
                .clinely-link-wrapper:hover,
                .clinely-link-wrapper.active{
                    background: var(--icon-color);
                    transition:background .1s ease-in-out .2s;
                }
                .clinely-link-wrapper:hover:before,
                .clinely-link-wrapper.active:before {
                    top:0;
                    left: -50%;
                }
                .clinely-link-wrapper div{
                    color: white;
                    width: 55%;
                    height: 55%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2;
                    transform: translateZ(0);
                }

                .clinely-link-wrapper:hover div,
                .clinely-link-wrapper.active div {
                    -webkit-animation-name: hvr-icon-push;
                    animation-name: hvr-icon-push;
                    -webkit-animation-duration: 0.2s;
                    animation-duration: 0.2s;
                    -webkit-animation-timing-function: linear;
                    animation-timing-function: linear;
                    -webkit-animation-iteration-count: 1;
                    animation-iteration-count: 1;
                    transform: rotate(10deg);
                    transition:transform .1s ease-in-out .2s;
                }

                .clinely-watching .clinely-link-wrapper + article .clinely-link-wrapper {
                    display: none;
                }

                @keyframes hvr-icon-push {
                80% {
                    -webkit-transform: scale(0.8);
                    transform: scale(0.8);
                }
                }
                .clinely-link-wrapper div svg{
                    max-width: 100%;
                    max-height: 100%;
                }
                /*coop*/
                .productTile__wrapper .clinely-link-wrapper,
                .productBasicInfo--newTile .clinely-link-wrapper{
                    right: unset;
                    left: -5px;
                    top: -5px;
                }
                .clinely-ingredient-popup{
                    position: absolute;
                    top: 50%;
                    left: auto;
                    right:0;
                    width: 235px !important;
                    height: unset !important;
                    background: white;
                    border: var(--icon-color) 3px solid;
                    border-radius: 3px;
                    z-index: 50 !important;
                    box-shadow: 0px 2px 3px 0px #4a4a4a;
                    transform:translateX(0);
                    opacity:0;
                    pointer-events:none;
                    transition: opacity .2s ease-out;
                }
                .clinely-ingredient-popup.open{
                    opacity:1;
                    pointer-events:initial;
                }
                .clinely-ingredient-popup-wrapper{
                    display:none;
                    width:100vw !important;
                    height:100vh !important;
                    position:fixed !important;
                    top:0 !important;
                    left:0 !important;
                    z-index:49 !important;
                }

                .clinely-ingredient-popup-wrapper.open{
                    display:block;
                }


                .clinely-ingredient-popup .clinely-title{
                    background: var(--icon-color);
                    color: white;
                    width: 100%;
                    padding: 15px 10px 6px 10px;
                    font-family: Helvetica Now Text,Helvetica,arial,sans-serif;
                    margin-bottom: 10px;
                }
                .clinely-ingredient-popup .clinely-title span{
                    font-family: 'RocknRoll One', Helvetica Now Text,Helvetica,arial,sans-serif;
                    font-style: italic;
                    font-size: 10px;
                    position: absolute;
                    left: 10px;
                    top: 4px;
                }

                .clinely-ingredient-popup .clinely-content{
                    padding:10px;
                }
                .clinely-ingredient-popup .clinely-content .clinely-incrementor{
                    display:flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    align-items: stretch;
                    max-width: 100%;
                    margin-bottom: 5px;
                }
                .clinely-ingredient-popup .clinely-content .clinely-incrementor button{
                    background: #333;
                    color: white;
                    padding: 0 10px;
                    display: flex;
                    align-items: baseline;
                    justify-content: center;
                    align-content: center;
                }
                .clinely-ingredient-popup .clinely-content .clinely-incrementor button:first-child{
                    border-radius: 4px 0 0 4px;
                }
                .clinely-ingredient-popup .clinely-content .clinely-incrementor button:last-child{
                    border-radius: 0 4px 4px 0;
                }


                .clinely-ingredient-popup .clinely-content .clinely-incrementor input{
                    width: 100%;
                    border-radius:0;
                    text-align: center;
                }
                .clinely-ingredient-popup .clinely-content select{
                    background-color: transparent;
                    border: 2px solid #cfcac7;
                    padding: 6px 10px 4px;
                    line-height: 100%;
                    border-radius: 4px;
                    font-family: Helvetica Now Text,Helvetica,arial,sans-serif;
                    font-weight: 700;
                    text-transform: capitalize;
                    letter-spacing: 0;
                    font-size: 1.4rem;
                    color: #767676;
                    border-color: #767676;
                    padding-bottom: 5px;
                    width: 100%;
                }`;

            var style = document.createElement("style");
            style.type = "text/css";
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }

            document.documentElement.appendChild(style);
        }
    }
    function injectHTML() {
        if(!htmlAdded){
            htmlAdded=true;
            var amount = Cookies.get('clinely-amount');
            var list = Cookies.get('clinely-list');
            if(!amount)amount = '1';
            if(!list)list = 'globale';

            document.body.insertAdjacentHTML('beforeend', `
                    <div class="clinely-ingredient-popup-wrapper"></div>
                    <div class="clinely-ingredient-popup">
                        <div class="clinely-title">Options <span>RecipeShopping</span></div>
                        <div class="clinely-content">
                            <div class="clinely-incrementor">
                                <button onclick="changeIncrementor(this,-1)">-</button>
                                <input class="clinely-param-field" id="clinely-ingredient-amount" param-field="amount" type="number" min="1" value="${amount}" />
                                <button onclick="changeIncrementor(this,1)">+</button>
                            </div>
                            <select class="clinely-param-field clinely-cookie-field" id="clinely-ingredient-list" param-field="list">
                                <option value="globale">Liste globale</option>
                                <option value="perso">Liste perso</option>
                                <option value="secondary">Liste secondaire</option>
                            </select>
                        </div>
                    </div>`);

            var clinelyScript = document.createElement('script');
            clinelyScript.innerHTML = `
                    function changeIncrementor(btn,amount){
                        var field = btn.parentElement.querySelector('input'),
                            current = field.value,
                            newNbrPers = parseFloat(current) + amount;
                        if(newNbrPers > 0){
                            field.value = newNbrPers;
                            if ("createEvent" in document) {
                                var evt = document.createEvent("HTMLEvents");
                                evt.initEvent("change", false, true);
                                field.dispatchEvent(evt);
                            }
                            else
                                field.fireEvent("onchange");
                        }
                    }function loadpopunder(url){
                        console.log("opening");
                        var params = '';
                        document.querySelectorAll('.clinely-param-field').forEach(div =>params += '&'+div.getAttribute('param-field')+'='+div.value);

                        let win2=window.open(url+params/*,'',"width=800,height=510,scrollbars=1,resizable=1,toolbar=1,location=1,menubar=1,status=1,directories=0"*/);
                        win2.blur();
                        window.focus();
                    }`;

            document.head.appendChild(clinelyScript);
            document.querySelectorAll('#clinely-ingredient-list option[value='+list+']').forEach(div => div.setAttribute('selected',true))
            document.querySelectorAll('.clinely-cookie-field').forEach(div => {
                div.addEventListener('change', (event) => {
                    Cookies.set('clinely-'+this.getAttribute('param-field'),this.value);
                })
            })

            document.querySelectorAll('.clinely-ingredient-popup-wrapper').forEach(div => {
                div.addEventListener('click', (event)=>{
                    document.querySelectorAll('.clinely-ingredient-popup,.clinely-ingredient-popup-wrapper').forEach(div =>div.classList.remove('open'));
                    document.querySelectorAll('.clinely-link-wrapper').forEach(div =>div.classList.remove('active'));
                })
            });
        }
    }

    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    /*! js-cookie v3.0.1 | MIT */
    !function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self,function(){var n=e.Cookies,o=e.Cookies=t();o.noConflict=function(){return e.Cookies=n,o}}())}(this,(function(){"use strict";function e(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)e[o]=n[o]}return e}return function t(n,o){function r(t,r,i){if("undefined"!=typeof document){"number"==typeof(i=e({},o,i)).expires&&(i.expires=new Date(Date.now()+864e5*i.expires)),i.expires&&(i.expires=i.expires.toUTCString()),t=encodeURIComponent(t).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape);var c="";for(var u in i)i[u]&&(c+="; "+u,!0!==i[u]&&(c+="="+i[u].split(";")[0]));return document.cookie=t+"="+n.write(r,t)+c}}return Object.create({set:r,get:function(e){if("undefined"!=typeof document&&(!arguments.length||e)){for(var t=document.cookie?document.cookie.split("; "):[],o={},r=0;r<t.length;r++){var i=t[r].split("="),c=i.slice(1).join("=");try{var u=decodeURIComponent(i[0]);if(o[u]=n.read(c,u),e===u)break}catch(e){}}return e?o[e]:o}},remove:function(t,n){r(t,"",e({},n,{expires:-1}))},withAttributes:function(n){return t(this.converter,e({},this.attributes,n))},withConverter:function(n){return t(e({},this.converter,n),this.attributes)}},{attributes:{value:Object.freeze(o)},converter:{value:Object.freeze(n)}})}({read:function(e){return'"'===e[0]&&(e=e.slice(1,-1)),e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(e){return encodeURIComponent(e).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}},{path:"/"})}));


})();

