// ==UserScript==
// @name            Helper to return of Kindle Unlimited loans
// @name:ja         Kindle Unlimited 返却支援
// @namespace       https://furyutei.work
// @license         MIT
// @version         0.1.1
// @description     Help with the return of Kindle Unlimited loans in Amazon.co.jp.
// @description:ja  Amazon.co.jp の Kindle Unlimited の返却を支援
// @author          furyu
// @match           https://www.amazon.co.jp/*
// @grant           none
// @compatible      chrome
// @compatible      firefox
// @supportURL      https://github.com/furyutei/amzKindleUnlimitedHelper/issues
// @contributionURL https://memo.furyutei.work/about#%E6%B0%97%E3%81%AB%E5%85%A5%E3%81%A3%E3%81%9F%E5%BD%B9%E3%81%AB%E7%AB%8B%E3%81%A3%E3%81%9F%E3%81%AE%E3%81%8A%E6%B0%97%E6%8C%81%E3%81%A1%E3%81%AF%E3%82%AE%E3%83%95%E3%83%88%E5%88%B8%E3%81%A7
// @downloadURL https://update.greasyfork.org/scripts/410107/Helper%20to%20return%20of%20Kindle%20Unlimited%20loans.user.js
// @updateURL https://update.greasyfork.org/scripts/410107/Helper%20to%20return%20of%20Kindle%20Unlimited%20loans.meta.js
// ==/UserScript==

( async () => {
'use strict';

const
    SCRIPT_NAME = 'amzKindleUnlimitedHelper',
    DEBUG = false,
    
    CSS_STYLE_CLASS = SCRIPT_NAME + '-css-rule',
    
    TIME_INTERVAL_TO_CONFIRM_RETURN_FIRST = 5000, // 初回返却確認までの遅延時間(ミリ秒)
    TIME_INTERVAL_TO_CONFIRM_RETURN = 1000, // 返却確認間隔(ミリ秒)
    MAX_RETURN_CONFIRM_RETRY_NUMBER = 50, // 最大返却再確認回数
    
    get_log_timestamp = () => {
        return new Date().toISOString();
    },
    
    log_debug = ( ... args ) => {
        if ( ! DEBUG ) {
            return;
        }
        console.debug( '%c' + '[' + SCRIPT_NAME + '] ' + get_log_timestamp(), 'color: gray;', ... args );
    },
    
    log = ( ... args ) => {
        console.log( '%c' + '[' + SCRIPT_NAME + '] ' +  + get_log_timestamp(), 'color: teal;', ... args );
    },
    
    log_info = ( ... args ) => {
        console.info( '%c' +  '[' + SCRIPT_NAME + '] ' + get_log_timestamp(), 'color: darkslateblue;', ... args );
    },
    
    log_error = ( ... args ) => {
        console.error( '%c' + '[' + SCRIPT_NAME + '] ' + get_log_timestamp(), 'color: purple;', ... args );
    },
    
    get_csrf_token = ( doc ) => {
        if ( ! doc ) {
            doc = document;
        }
        return Array.from( doc.querySelectorAll( 'script' ) ).map( script => script.textContent.match( /\s*csrfToken\s*=\s*"(.*?)"/i ) && RegExp.$1 ).filter( csrfToken => csrfToken )[ 0 ];
    },
    
    PAGE_TYPE = {
        unknown : undefined,
        my_contents : 'My Contents',
        loaned_book : 'Loaned Book',
        orderd_product : 'Orderd Product',
    },
    
    CURRENT_PAGE_INFO = await ( async () => {
        if ( /^\/(?:hz\/mycd\/myx|mn\/dcw\/myx\.html)/.test( new URL( location.href ).pathname ) ) {
            return {
                type : PAGE_TYPE.my_contents,
                csrf_token : get_csrf_token(),
            };
        }
        
        let ebooksInstantOrderUpdate = document.querySelector( '#ebooksInstantOrderUpdate' );
        
        if ( ! ebooksInstantOrderUpdate ) {
            return { type : PAGE_TYPE.unknown };
        }
        
        let asin = ( ( document.querySelector('link[rel="canonical"]') || {} ).href || '' ).match( /\/dp\/([^/]+)/ ) && RegExp.$1,
            my_contents_url = ( ebooksInstantOrderUpdate.parentNode.querySelector( 'a.a-link-normal[href*="/mn/dcw/myx.html"]' ) || {} ).href;
        
        if ( ! my_contents_url ) {
            return { type : PAGE_TYPE.orderd_product, asin };
        }
        
        let csrf_token = await fetch( my_contents_url.replace( /#.*$/, '' ), {
                method : 'GET',
                mode : 'cors',
                credentials : 'include',
            } )
            .then( response => {
                if ( ! response.ok ) {
                    throw new Error( 'Network response was not ok' );
                }
                return response.text();
            } )
            .then( html => get_csrf_token( ( new DOMParser() ).parseFromString( html, 'text/html' ) ) )
            .catch( error => {
                log_error( 'fetch() error: url=', my_contents_url, error );
            } );
        
        return {
            type : PAGE_TYPE.loaned_book,
            asin,
            csrf_token,
        };
    } )() || {};

log_debug( 'CURRENT_PAGE_INFO=', CURRENT_PAGE_INFO );

switch ( CURRENT_PAGE_INFO.type ) {
    case PAGE_TYPE.my_contents :
    case PAGE_TYPE.loaned_book :
        if ( ! CURRENT_PAGE_INFO.csrf_token ) {
            log_error( 'CSRF token was not found' );
            return;
        }
        break;
    
    default:
        log_debug( 'This page is not supported' );
        return;
}

const
    wait = async ( wait_msec ) => await new Promise( resolve => setTimeout( resolve, ( ( ! Number.isInteger( wait_msec ) ) || wait_msec <= 0 ) ? 1 : wait_msec ) ),
    
    insert_css_rule = () => {
        const
            loading_mask_class = SCRIPT_NAME + '-loading-mask',
            css_rule_text = `
                .${loading_mask_class} {
                    position : fixed;
                    top : 0;
                    left : 0;
                    z-index : 10000;
                    width : 100%;
                    height : 100%;
                    background : black;
                    opacity : 0.5;
                }
                
                .${loading_mask_class} .loading {
                    position : absolute;
                    top : 0;
                    right : 0;
                    bottom : 0;
                    left : 0;
                    margin : auto;
                    width : 100px;
                    height : 100px;
                    color : #F3A847;
                }
                
                .${loading_mask_class} .loading svg {
                    animation: ${SCRIPT_NAME}_now_loading 1.5s linear infinite;
                }
                
                @keyframes ${SCRIPT_NAME}_now_loading {
                    0% {transform: rotate(0deg);}
                    100% {transform: rotate(360deg);}
                }
            `;
        
        let css_style = document.querySelector( '.' + CSS_STYLE_CLASS );
        
        if ( css_style ) css_style.remove();
        
        css_style = document.createElement( 'style' );
        css_style.classList.add( CSS_STYLE_CLASS );
        css_style.textContent = css_rule_text;
        
        document.querySelector( 'head' ).appendChild( css_style );
    },
    
    loading_mask = ( () => {
        const
            loading_icon_svg = '<svg version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" fill="none" r="10" stroke-width="4" style="stroke: currentColor; opacity: 0.4;"></circle><path d="M 12,2 a 10 10 -90 0 1 9,5.6" fill="none" stroke="currentColor" stroke-width="4" />',
            loading_mask = document.createElement( 'div' );
        
        loading_mask.className = SCRIPT_NAME + '-loading-mask';
        loading_mask.insertAdjacentHTML( 'beforeend', '<div class="loading">' + loading_icon_svg + '</div>' );
        loading_mask.style.display = 'none';
        
        document.body.appendChild( loading_mask );
        
        return loading_mask;
    } )(),
    
    show_loading_mask = () => {loading_mask.style.display = 'block';},
    hide_loading_mask = () => {loading_mask.style.display = 'none';},
    
    get_loaned_info = async () => {
        let loaned_info = await fetch( 'https://www.amazon.co.jp/hz/mycd/ajax', {
                method : 'POST',
                mode : 'cors',
                credentials : 'include',
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body : ( () => {
                    let search_params = new URLSearchParams();
                    
                    search_params.append( 'csrfToken', CURRENT_PAGE_INFO.csrf_token );
                    search_params.append( 'data', JSON.stringify( {
                        param : {
                            OwnershipData : {
                                sortOrder : 'DESCENDING',
                                sortIndex : 'DATE',
                                startIndex : 0,
                                batchSize : 100, // default: 18 / ～725あたりで不安定になる（GET https://www.amazon.co.jp/500 404）
                                contentType : 'ALL',
                                totalContentCount : 0,
                                itemStatus : [ 'Active', ],
                                originType : [ 'ku', ],
                            },
                        },
                    } ) );
                    return search_params;
                } )(),
            } )
            .then( response => {
                if ( ! response.ok ) {
                    throw new Error( 'Network response was not ok' );
                }
                return response.json();
            } )
            .catch( error => {
                log_error( 'get_loaned_info(): fetch() error:', error );
            } ) || {};
       
       return loaned_info;
    },
    
    get_loaned_book_info = ( asin, loaned_info ) => {
        return ( ( ( loaned_info || {} ).OwnershipData || {} ).items || [] ).filter( book_info => book_info.asin == asin )[ 0 ];
    },
    
    return_loaned_book = async ( asin, loaned_info ) => {
        if ( ! loaned_info ) {
            loaned_info = await get_loaned_info();
        }
        
        log_debug( 'loaned_info=', loaned_info );
        
        let loaned_book_info = get_loaned_book_info( asin, loaned_info );
        
        log_debug( 'loaned_book_info=', loaned_book_info );
        
        if ( ! loaned_book_info ) {
            return null;
        }
        
        let result = await fetch( 'https://www.amazon.co.jp/hz/mycd/ajax', {
                method : 'POST',
                mode : 'cors',
                credentials : 'include',
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body : ( () => {
                    let search_params = new URLSearchParams();
                    
                    search_params.append( 'csrfToken', CURRENT_PAGE_INFO.csrf_token );
                    search_params.append( 'data', JSON.stringify( {
                        param : {
                            ReturnKULoan : {
                                returnLoanID : loaned_book_info.lendingId,
                            },
                        },
                    } ) );
                    return search_params;
                } )(),
            } )
            .then( response => {
                if ( ! response.ok ) {
                    throw new Error( 'Network response was not ok' );
                }
                return response.json();
            } )
            .catch( error => {
                log_error( 'get_loaned_info(): fetch() error:', error );
            } ) || {};
        
        log_debug( 'result=', result );
        
        return result;
    },
    
    update_my_contents_page = () => {
        log_debug( 'update_my_contents_page(): start' );
        
        if ( document.querySelector( '#contentAction_return_ku_myx' ) ) {
            return;
        }
        
        const
            content_ul = document.querySelector( '.contentTableList_myx > ul.nav' ),
            deliver_myx = document.querySelector( [
                '#contentAction_deliver_myx',
                '#contentAction_dummy_dlr_myx',
                '.myx-column.myx-span10 .myx-float-left:first-child > .inline_myx.button_myx:first-child > .inline_myx.button_myx .pointer_myx[bo-switch="action.type"][bo-id="action.id"]',
            ].join( ',' ) );
        
        if ( ( ! content_ul ) || ( ! deliver_myx ) ) {
            return;
        }
        
        const
            deliver_container = deliver_myx.closest( '.button_myx' ),
            return_container = deliver_container.cloneNode( true ),
            
            bulk_action = return_container.querySelector( '[type="bulkAction"]' ),
            button_action = bulk_action.querySelector( '[type="button"][action="action"]' ),
            pointer_myx = button_action.querySelector( '.pointer_myx' ),
            action_text = pointer_myx.querySelector( '[bo-text="action.text"]' ),
            counter_span = action_text.parentNode.querySelector( '.ng-binding[ng-hide]' ),
            button_link = pointer_myx.querySelector( 'a.myx-button.myx-button-primary' ),
            
            get_selected_content_list = () => {
                return Array.from( content_ul.querySelectorAll( 'i.myx-icon.icon-selected' ) ).filter( icon => icon.style.display != 'none' ).map( icon => icon.closest( 'li.myx-active' ) );
            },
            
            get_selected_ku_loan_list = () => get_selected_content_list().filter( content => content.querySelector( '[ng-switch-when="KULoan"]' ) ),
            
            update_return_container = () => {
                let selected_contents = get_selected_ku_loan_list();
                
                log_debug( 'selected_contents:', selected_contents.length, selected_contents );
                
                if ( selected_contents.length <= 0 ) {
                    button_link.classList.add( 'myx-button-disabled' );
                    counter_span.style.display = 'none';
                }
                else {
                    button_link.classList.remove( 'myx-button-disabled' );
                    counter_span.textContent = '(' + selected_contents.length + ')';
                    counter_span.style.display = 'inline';
                }
            },
            
            observer = new MutationObserver( ( records ) => {
                stop_observe();
                
                try {
                    update_return_container();
                }
                catch ( error ) {
                    log_error( error );
                }
                finally {
                    if ( content_ul.closest( '#a-page' ) && return_container.closest( '#a-page' ) ) {
                        start_observe();
                    }
                    else {
                        return_container.remove();
                    }
                }
            } ),
            start_observe = () => observer.observe( content_ul, { childList : true, subtree : true, attributes : true } ),
            stop_observe = () => observer.disconnect();
        
        bulk_action.setAttribute( 'add-directive-dmyx', 'return-ku-dmyx' );
        button_action.removeAttribute( 'deliver-dmyx' );
        button_action.removeAttribute( 'dummy-deliver-dmyx' );
        button_action.setAttribute( 'return-ku-dmyx', '' );
        pointer_myx.setAttribute( 'id', 'contentAction_return_ku_myx' );
        action_text.textContent = '返却';
        
        button_link.addEventListener( 'click', ( event ) => {
            event.preventDefault();
            event.stopPropagation();
            
            stop_observe();
            show_loading_mask();
            
            button_link.classList.add( 'myx-button-disabled' );
            
            ( async () => {
                let selected_asin_list = get_selected_ku_loan_list()
                        .map( content => ( ( content.querySelector( '[src="responsiveView"][name]' ) || document.createElement( 'b' ) ).getAttribute( 'name' ) || '' ).match( /contentTabList_(.+)/ ) && RegExp.$1 )
                        .filter( asin => asin ),
                    loaned_info = await get_loaned_info();
                
                log_debug( 'selected_asin_list=', selected_asin_list, 'loaned_info=', loaned_info );
                
                if ( ( selected_asin_list.length <= 0 ) || ( ! loaned_info ) ) {
                    update_return_container();
                    hide_loading_mask();
                    start_observe();
                    return;
                }
                
                let returned_asin_list = [];
                
                for ( let asin of selected_asin_list ) {
                    let result = await return_loaned_book( asin, loaned_info );
                    
                    if ( ( ! result ) || ( ! ( result.ReturnKULoan || {} ).success ) ) {
                        log_error( 'Failed to return book: asin=', asin );
                        continue;
                    }
                    returned_asin_list.push( asin );
                }
                
                log_debug( returned_asin_list.length, 'returned_asin_list=', returned_asin_list );
                
                if ( returned_asin_list.length <= 0 ) {
                    log_error( 'No book returned' );
                    update_return_container();
                    hide_loading_mask();
                    start_observe();
                    return;
                }
                
                // TODO: 返却をしたものが借用中リストから消えるまでタイムラグ有り
                // →暫定的に、最大( 1 + MAX_RETURN_CONFIRM_RETRY_NUMBER ) 回確認することで対処
                // TODO: 借用中リストからいったん消えたあと、再び現れることもある模様、対処困難なため保留
                await wait( TIME_INTERVAL_TO_CONFIRM_RETURN_FIRST );
                for ( let counter = 0; counter <= MAX_RETURN_CONFIRM_RETRY_NUMBER; counter ++ ) {
                    let loaned_info = await get_loaned_info(),
                        removed_counter = 0;
                    
                    for ( let asin of returned_asin_list ) {
                        let loaned_book_info = get_loaned_book_info( asin, loaned_info );
                        
                        if ( loaned_book_info ) {
                            continue;
                        }
                        
                        removed_counter ++;
                    }
                    log_debug( 'counter=', counter, 'removed_counter=', removed_counter, 'loaned_info=', loaned_info );
                    
                    if ( returned_asin_list.length <= removed_counter ) {
                        break;
                    }
                    await wait( TIME_INTERVAL_TO_CONFIRM_RETURN );
                }
                
                //update_return_container();
                //hide_loading_mask();
                //start_observe();
                location.reload( true ); // TODO: リロードせずに情報を更新したい
            } )();
        } );
        
        deliver_container.parentNode.appendChild( return_container );
        
        update_return_container();
        start_observe();
    },
    
    update_loaned_book_page = () => {
        log_debug( 'update_loaned_book_page(): start' );
        
        if ( document.querySelector( '.' + SCRIPT_NAME + '-return-button' ) ) {
            return;
        }
        
        let return_button = document.createElement( 'button' );
        
        return_button.textContent = '返却';
        return_button.className = SCRIPT_NAME + '-return-button a-text-center';
        
        return_button.addEventListener( 'click', ( event ) => {
            return_button.disabled = true;
            show_loading_mask();
            
            event.preventDefault();
            event.stopPropagation();
            
            ( async () => {
                let asin = CURRENT_PAGE_INFO.asin,
                    result = await return_loaned_book( asin );
                
                if ( ( ! result ) || ( ! ( result.ReturnKULoan || {} ).success ) ) {
                    return_button.disabled = false;
                    hide_loading_mask();
                    log_error( 'Failed to return book: asin=', asin );
                    alert( '返却できませんでした' );
                    return;
                }
                
                // TODO: 返却をしたものが借用中リストから消えるまでタイムラグ有り
                // →暫定的に、最大( 1 + MAX_RETURN_CONFIRM_RETRY_NUMBER ) 回確認することで対処
                await wait( TIME_INTERVAL_TO_CONFIRM_RETURN_FIRST );
                for ( let counter = 0; counter <= MAX_RETURN_CONFIRM_RETRY_NUMBER; counter ++ ) {
                    let loaned_info = await get_loaned_info(),
                        loaned_book_info = get_loaned_book_info( asin, loaned_info );
                    
                    log_debug( 'counter=', counter, 'loaned_info=', loaned_info, 'loaned_book_info=', loaned_book_info );
                    
                    if ( ! loaned_book_info ) {
                        break;
                    }
                    await wait( TIME_INTERVAL_TO_CONFIRM_RETURN );
                }
                
                //return_button.disabled = false;
                //hide_loading_mask();
                location.reload( true ); // TODO: リロードせずに情報を更新したい
            } )();
        } );
        
        document.querySelector( '#ebooksInstantOrderUpdate' ).after( return_button );
    },
    
    update_page = () => {
        switch ( CURRENT_PAGE_INFO.type ) {
            case PAGE_TYPE.my_contents :
                update_my_contents_page();
                break;
            case PAGE_TYPE.loaned_book :
                update_loaned_book_page();
                break;
        }
    },
    
    observer = new MutationObserver( ( records ) => {
        let initialized = false;
        
        stop_observe();
        
        try {
            update_page();
        }
        catch ( error ) {
            log_error( error );
        }
        finally {
            start_observe();
        }
    } ),
    start_observe = () => observer.observe( document.body, { childList : true, subtree : true } ),
    stop_observe = () => observer.disconnect();

insert_css_rule();
update_page();
start_observe();

} )();
