// ==UserScript==
// @name            amzOrderHistoryFilter
// @name:ja         アマゾン注文履歴フィルタ
// @namespace       http://furyu.hatenablog.com/
// @author          furyu
// @version         0.1.2.6
// @include         https://www.amazon.co.jp/gp/your-account/order-history*
// @include         https://www.amazon.co.jp/gp/legacy/order-history*
// @include         https://www.amazon.co.jp/gp/css/order-history*
// @include         https://www.amazon.co.jp/your-orders/orders*
// @include         https://www.amazon.co.jp/gp/digital/your-account/order-summary.html*
// @include         https://www.amazon.co.jp/gp/css/summary/print.html*
// @include         https://www.amazon.co.jp/ap/signin*
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require         https://greasyfork.org/scripts/398566-concurrent-promise/code/concurrent_promise.js?version=784632
// @grant           GM_setValue
// @grant           GM_getValue
// @description     You will be able to view your Amazon (amazon.co.jp) order history by month, and view and print receipts by month or year at a time.
// @description:ja  アマゾン(amazon.co.jp)の注文履歴を月別表示したり、月別もしくは通年の領収書をまとめて表示・印刷したりできるようになります。
// @license         MIT
// @compatible      chrome
// @compatible      firefox
// @supportURL      https://github.com/furyutei/amzOrderHistoryFilter/issues
// @contributionURL https://memo.furyutei.work/about#send_donation
// @downloadURL https://update.greasyfork.org/scripts/398796/amzOrderHistoryFilter.user.js
// @updateURL https://update.greasyfork.org/scripts/398796/amzOrderHistoryFilter.meta.js
// ==/UserScript==

/*
■ 外部ライブラリ
- [jQuery](https://jquery.com/)
    The MIT License
    [License | jQuery Foundation](https://jquery.org/license/)

■ 関連記事など
- [【アマゾン注文履歴フィルタ】Kindle 等のデジタルコンテンツの領収書をまとめて表示する拡張機能／アドオン／ユーザースクリプト](http://furyu.hatenablog.com/entry/amzOrderHistoryFilter)
- [furyutei/amzOrderHistoryFilter](https://github.com/furyutei/amzOrderHistoryFilter)
*/

/*
The MIT License (MIT)

Copyright (c) 2018 furyu <furyutei@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/


( function () {

'use strict';

// ■ パラメータ {
var OPTIONS = {
    OPEN_PRINT_DIALOG_AUTO : false, // true: 印刷ダイアログを自動で起動
    REMOVE_REISSUE_STRINGS : false, // true: 「再発行」を取り除く
    ADDRESSEE_CHANGEABLE : true, // true: 宛名を設定・変更可
    ENABLE_PRINT_PREVIEW_BUTTON : true, // true: 印刷プレビューボタンを表示(Firefox用)
    GET_PRODUCT_DETAIL_URL_FOR_CSV : true, // true: CSV用に商品の詳細URLを取得
    MAX_CONCURRENT_FETCH_NUMBER_HISTORY : 5, // 注文履歴を並行してFETCH/IFRAMEでの読み込みを行う最大数
    MAX_CONCURRENT_FETCH_NUMBER_RECEIPT : 5, // 領収書を並行してFETCH/IFRAMEでの読み込みを行う最大数
    
    DEFAULT_FILTER_INCLUDE_DIGITAL : true, // フィルタ対象(デジタルコンテンツ)のデフォルト値(true: 有効)
    DEFAULT_FILTER_INCLUDE_NONDIGITAL : false, // フィルタ対象(デジタルコンテンツ以外)のデフォルト値(true: 有効)
    DEFAULT_FILTER_INCLUDE_RESERVATION : true, // フィルタ対象(予約)のデフォルト値(true: 有効)
    DEFAULT_FILTER_INCLUDE_PRICE_ZERO : true, // フィルタ対象(合計￥0)のデフォルト値(true: 有効)
    
    OPERATION : true // true: 動作中、false: 停止中
};

// }


// ■ 共通変数 {
var SCRIPT_NAME = 'amzOrderHistoryFilter',
    DEBUG = false;

if ( typeof jQuery != 'function' ) {
    console.error( SCRIPT_NAME + ':', 'Library not found - ', 'jQuery:', typeof jQuery );
    return;
}

var $ = jQuery,
    IS_WEB_EXTENSION = !! ( window.is_web_extension ),
    IS_FIREFOX = ( 0 <= navigator.userAgent.toLowerCase().indexOf( 'firefox' ) ),
    IS_EDGE = ( 0 <= navigator.userAgent.toLowerCase().indexOf( 'edge' ) ),
    WEB_EXTENSION_INIT = window.web_extension_init,
    ORDER_HISTORY_FILTER = null,
    DEFAULT_OPTIONS = {},
    IS_TOUCHED = ( function () {
        var touched_id = SCRIPT_NAME + '_touched',
            jq_touched = $( '#' + touched_id );
        
        if ( 0 < jq_touched.length ) {
            return true;
        }
        
        $( '<b>' ).attr( 'id', touched_id ).css( 'display', 'none' ).appendTo( $( document.documentElement ) );
        
        return false;
    } )();

if ( IS_TOUCHED ) {
    console.error( SCRIPT_NAME + ': Already loaded.' );
    return;
}

OPTIONS.SELECT_MONTH_LABEL_TEXT = '対象月選択';
OPTIONS.SELECT_MONTH_NO_SELECT_TEXT = '未選択';
OPTIONS.SELECT_MONTH_ALL_TEXT = '全て';
OPTIONS.CHECKBOX_FILTER_INCLUDE_DIGITAL_TEXT = 'デジタル';
OPTIONS.CHECKBOX_FILTER_INCLUDE_NONDIGITAL_TEXT = 'デジタル以外';
OPTIONS.CHECKBOX_FILTER_INCLUDE_RESERVATION_TEXT = '予約分を含む';
OPTIONS.CHECKBOX_FILTER_INCLUDE_PRICE_ZERO = '合計￥0の注文を含む';
OPTIONS.COUNTER_LABEL_DIGITAL_TEXT = 'デジタル';
OPTIONS.COUNTER_LABEL_NONDIGITAL_TEXT = 'デジタル以外';
OPTIONS.SELECT_DESTINATION_LABEL_TEXT = 'お届け先';
OPTIONS.SELECT_DESTINATION_ALL_TEXT = '全て';
OPTIONS.SELECT_DESTINATION_NON_TEXT = '宛先無し'; // TODO: 宛先無しのときに適切なキーがわからないため保留（住所の氏名欄は割と何でも受け付けてしまうため、被らないのが思いつかない）
OPTIONS.PRINT_RECEIPT_BUTTON_TEXT = '領収書印刷用画面';
OPTIONS.LOGIN_REQUIRED_MESSAGE = 'サーバーよりログインを要求されたため、取得を中止しました。リロードしますか？';
OPTIONS.RECEIPT_READ_TIMEOUT_MESSAGE = '応答がないままタイムアウトしたものがありました。領収書の取得を最初からやり直しますか？';
OPTIONS.CSV_DOWNLOAD_BUTTON_TEXT = '注文履歴CSV(参考用)ダウンロード';
OPTIONS.REFUND_CSV_DOWNLOAD_BUTTON_TEXT = '返金情報CSV(参考用)ダウンロード';
OPTIONS.CHANGE_ADDRESSEE_BUTTON_TEXT = '宛名変更';
OPTIONS.CHANGE_ADDRESSEE_PROMPT_MESSAGE = '宛名を指定してください';
OPTIONS.PRINT_PREVIEW_BUTTON_TEXT = '印刷プレビュー';
OPTIONS.TEXT_FILTER_LABEL_TEXT = '絞り込み';
OPTIONS.TEXT_FILTER_PLACEHOLDER_TEXT = 'キーワード、または、注文番号を入力';
OPTIONS.TEXT_FILTER_HELP_TEXT = '" "(スペース)区切→AND検索、" OR "区切→OR検索';
OPTIONS.TEXT_FILTER_KEYWORDS_RULED_OUT_CHECKBOX_LABEL_TEXT = '除外';
OPTIONS.TEXT_FILTER_APPLY_BUTTUON_TEXT = '適用';
OPTIONS.TEXT_FILTER_CLEAR_BUTTUON_TEXT = 'クリア';

// }


// ■ 関数 {
function to_array( array_like_object ) {
    return Array.prototype.slice.call( array_like_object );
} // end of to_array()


if ( typeof console.log.apply == 'undefined' ) {
    // MS-Edge 拡張機能では console.log.apply 等が undefined
    // → apply できるようにパッチをあてる
    // ※参考：[javascript - console.log.apply not working in IE9 - Stack Overflow](https://stackoverflow.com/questions/5538972/console-log-apply-not-working-in-ie9)
    
    [ 'log', 'info', 'warn', 'error', 'assert', 'dir', 'clear', 'profile', 'profileEnd' ].forEach( function ( method ) {
        console[ method ] = this.bind( console[ method ], console );
    }, Function.prototype.call );
    
    console.log( 'note: console.log.apply is undefined => patched' );
}


function log_debug() {
    if ( ! DEBUG ) {
        return;
    }
    var arg_list = [ '[' + SCRIPT_NAME + ']', '(' + ( new Date().toISOString() ) + ')' ];
    
    console.log.apply( console, arg_list.concat( to_array( arguments ) ) );
} // end of log_debug()


function log_info() {
    var arg_list = [ '[' + SCRIPT_NAME + ']', '(' + ( new Date().toISOString() ) + ')' ];
    
    console.info.apply( console, arg_list.concat( to_array( arguments ) ) );
} // end of log_error()


function log_error() {
    var arg_list = [ '[' + SCRIPT_NAME + ']', '(' + ( new Date().toISOString() ) + ')' ];
    
    console.error.apply( console, arg_list.concat( to_array( arguments ) ) );
} // end of log_error()


var set_value = ( function () {
    if ( typeof GM_setValue != 'undefined' ) {
        return function ( name, value ) {
            return GM_setValue( name, value );
        };
    }
    return function ( name, value ) {
        return localStorage.setItem( name, value );
    };
} )(); // end of set_value()


var get_value = ( function () {
    if ( typeof GM_getValue != 'undefined' ) {
        return function ( name ) {
            var value = GM_getValue( name );
            
            // メモ： 値が存在しない場合、GM_getValue( name ) は undefined を返す
            return ( value === undefined ) ? null : value;
        };
    }
    return function ( name ) {
        // メモ： 値が存在しない場合、localStorage[ name ] は undefined を、localStorage.getItem( name ) は null を返す
        return localStorage.getItem( name );
    };
} )(); // end of get_value()


function zen_to_han( source_string ) {
    return source_string
        .replace( /[Ａ-Ｚａ-ｚ０-９]/g, function( match_string ) {
            return String.fromCharCode( match_string.charCodeAt( 0 ) - 0xFEE0 );
        } )
        .replace( /[\u3000]/g, ' ' );
} // end of zen_to_han()


function get_safefilename( source_filename ) {
    return source_filename.replace( /[\\\/:*?"<>|;]/g, '_' );
} // end of get_safefilename()


var object_extender = ( function () {
    // 参考: [newを封印して、JavaScriptでオブジェクト指向する(1): Architect Note](http://blog.tojiru.net/article/199670885.html?seesaa_related=related_article)
    function object_extender( base_object ) {
        var template = object_extender.template,
            mixin_object_list = Array.prototype.slice.call( arguments, 1 ),
            expanded_object;
        
        template.prototype = base_object;
        
        expanded_object = new template();
        
        mixin_object_list.forEach( function ( object ) {
            Object.keys( object ).forEach( function ( name ) {
                expanded_object[ name ] = object[ name ];
            } );
        } );
        
        return expanded_object;
    } // end of object_extender()
    
    
    object_extender.template = function () {};
    
    return object_extender;
} )(); // end of object_extender()


function get_origin_url( url ) {
    if ( ! url ) {
        url = window.location.href;
    }
    
    try {
        return url.match(/^[^:]+:\/{2}[^/]+/)[ 0 ];
    }
    catch ( error ) {
        return url;
    }
} // end of get_origin_url()


function get_absolute_url( path, base_url ) {
    if ( ! base_url ) {
        base_url = window.location.href;
    }
    
    if ( ! path ) {
        return '';
    }
    
    try {
        return new URL( path, base_url ).href;
    }
    catch ( error ) {
        return path;
    }
} // end of get_absolute_url()


var {
    open_child_window,
    //get_child_window_iframe,
    //remove_child_window_iframe,
} = ( () => {
    var child_window_counter = 0,
        
        jq_iframe_template = $( '<iframe/>' ).css( {
            'width' : '0',
            'height' : '0',
            'visibility' : 'hidden',
            'position' : 'absolute',
            'top' : '0',
            'left' : '0',
            'pointerEvents' : 'none'
        } ).css( DEBUG ? {
            'width' : '500px',
            'height' : '500px',
            'visibility' : 'visible'
        } : {} ),
        
        name_to_iframe_map = {},
        
        open_child_window = ( url, options ) => {
            if ( ! options ) {
                options = {};
            }
            
            var child_window = options.existing_window,
                name = '',
                open_parameters = ( options.open_parameters ) ? options.open_parameters : {};
            
            open_parameters.child_window_id = SCRIPT_NAME + '-' + ( new Date().getTime() ) + '-' + ( ++ child_window_counter ); // window.name が被らないように細工
            
            try {
                name = JSON.stringify( open_parameters );
            }
            catch ( error ) {
                log_debug( error );
            }
            
            var result_info = options.result_info = {
                    name : name,
                };
            
            if ( child_window ) {
                if ( child_window.name != name ) {
                    child_window.name = name;
                }
                if ( child_window.location.href != url ) {
                    child_window.location.href = url;
                }
            }
            else {
                if ( options.is_iframe ) {
                    var jq_iframe = jq_iframe_template.clone();
                    
                    $( document.documentElement ).append( jq_iframe );
                    
                    child_window = jq_iframe[ 0 ].contentWindow;
                    
                    try {
                        child_window.name = name;
                        child_window.location.href = url;
                    }
                    catch ( error ) {
                        log_error( 'set failure', error );
                        
                        // TODO: MS-Edge 拡張機能だと、name が設定できないことがある
                        jq_iframe.attr( {
                            'name' : name,
                            'src' : url
                        } );
                    }
                    
                    //result_info.iframe = name_to_iframe_map[ name ] = jq_iframe[ 0 ];
                    result_info.iframe = jq_iframe[ 0 ];
                }
                else {
                    child_window = window.open( url, name );
                }
            }
            
            result_info.child_window = child_window;
            
            return child_window;
        }; // end of open_child_window()
        
        /*
        //get_child_window_iframe = ( child_window ) => name_to_iframe_map[ child_window.name ],
        //// TODO: child_window.name にアクセスした際、Uncaught TypeError: no access エラーになるケース有り
        */
        
        /*
        //remove_child_window_iframe = ( child_window ) => {
        //    var target_iframe = get_child_window_iframe( child_window );
        //    
        //    if ( target_iframe ) {
        //        target_iframe.remove();
        //    }
        //};
        */
       
    return {
        open_child_window,
        //get_child_window_iframe,
        //remove_child_window_iframe,
    };
} )();


var get_jq_html_fragment = ( function () {
    if ( typeof DOMParser == 'function' ) {
        return ( html ) => $( new DOMParser().parseFromString( html, "text/html" ) );
    }
    
    return function ( html ) {
        return $( '<div/>' ).html( html );
    };
    /*
    //if ( ( ! document.implementation ) || ( typeof document.implementation.createHTMLDocument != 'function' ) ) {
    //    return function ( html ) {
    //        return $( '<div/>' ).html( html );
    //    };
    //}
    //
    //// 解析段階での余分なネットワークアクセス（画像等の読み込み）抑制
    //var html_document = document.implementation.createHTMLDocument(''),
    //    range = html_document.createRange();
    //
    //return function ( html ) {
    //    return $( range.createContextualFragment( html ) );
    //};
    */
} )(); // end of get_jq_html_fragment()


var get_formatted_date_string = ( function () {
    var reg_date = /(?:^|[^\d]+)(\d{4})[^\d]+(\d{1,2})[^\d]+(\d{1,2})/;
    
    return function ( source_date_string ) {
        if ( ( ! source_date_string ) || ( ! source_date_string.trim().match( reg_date ) ) ) {
            return '';
        }
        return ( RegExp.$1 + '/' + RegExp.$2 + '/' + RegExp.$3 );
    };
} )(); // end of get_formatted_date_string()


function get_child_text_from_jq_element( jq_element ) {
    var child_text_list = [];
    
    jq_element.contents().each( function () {
        if ( this.nodeType == 3 ) {
            child_text_list.push( this.nodeValue.replace( /[\s\u00a0\ufffd]+/g, ' ' ).trim() );
        }
    } );
    
    return child_text_list.join( ' ' ).trim();
} // end of get_child_text_from_jq_element()


function $join_child_text($element) {
    const
        text_value_list = [];
    
    $element.contents().each(function () {
        const
            $child = $(this),
            node_type = this.nodeType;
        
        switch (node_type) {
            case 1:
            case 3:
                text_value_list.push($child.text().trim());
                break;
        }
    });
    
    return text_value_list.join(' ').replace(/\s+/g, ' ').trim();
} // end of $join_child_text()


function get_price_number( price_string ) {
    if ( ! price_string ) {
        return '';
    }
    
    var price_number_string = price_string.replace( /[(（].*?[)）]/g, '' ).replace( /[^\d.\-]/g, '' ),
        price = parseInt( price_number_string, 10 );
    
    if ( isNaN( price ) ) {
        return '';
    }
    
    return price;
} // end of get_price_number()


function wait_for_rendering( callback, options ) {
    if ( ! options ) {
        options = {};
    }
    
    log_debug( options.is_digital ? '[DIGITAL]' : '[NON-DIGITAL]', '*** wait_for_rendering(): begin', location.href );
    
    var min_wait_ms = ( options.min_wait_ms ) ? options.min_wait_ms : 3000,
        max_wait_ms = ( options.max_wait_ms ) ? options.max_wait_ms : 120000,  // [2024/02/06] 6000→120000
        target_element = ( options.target_element ) ? options.target_element : document.body,
        
        jq_payment_breakdown_container = $( '#docs-order-summary-payment-breakdown-container' ),
        
        finish = function () {
            var is_timeover = false;
            
            if ( watch_timer_id ) {
                clearTimeout( watch_timer_id );
                watch_timer_id = null;
            }
            
            if ( timeover_timer_id ) {
                //var jq_payment_breakdown_container = $( '#docs-order-summary-payment-breakdown-container' );
                
                if ( 0 < jq_payment_breakdown_container.length ) {
                    // デジタルの領収書の場合、この部分を書き換えている→3秒待っても書き換え完了しない場合があるため、チェックしておく
                    if (
                        ( jq_payment_breakdown_container.children.length <= 0 ) ||
                        ( 0 < jq_payment_breakdown_container.find( '.a-popover-loading' ).length ) ||
                        ( jq_payment_breakdown_container.find( '.a-row .a-column' ).length <= 0 )
                    ) {
                        log_debug( options.is_digital ? '[DIGITAL]' : '[NON-DIGITAL]', '** payment information not found => retry' );
                        watch_timer_id = setTimeout( finish, min_wait_ms );
                        return;
                    }
                }
                
                clearTimeout( timeover_timer_id );
                timeover_timer_id = null;
            }
            else {
                is_timeover = true;
            }
            
            observer.disconnect();
            
            if ( typeof callback == 'function' ) {
                var jq_target = $( target_element ).clone();
                
                jq_target.find( 'script,iframe' ).remove();
                
                if ( OPTIONS.REMOVE_REISSUE_STRINGS ) {
                    var jq_receipt_header = jq_target.find( 'b.h1' ),
                        jq_reissue_receipt_date_label = jq_target.find( 'table:first table[align="center"]:first td[valign="top"][align="left"]:first b' );
                    
                    jq_receipt_header.text( jq_receipt_header.text().replace( /（再発行）/, '' ) );
                    jq_reissue_receipt_date_label.text( jq_reissue_receipt_date_label.text().replace( /^再/, '' ) );
                }
                
                callback( {
                    html : jq_target.html(),
                    is_timeover : is_timeover
                } );
                log_debug( options.is_digital ? '[DIGITAL]' : '[NON-DIGITAL]', '*** wait_for_rendering(): end', location.href );
            }
        }, // end of finish()
        
        timeover = function () {
            log_error( options.is_digital ? '[DIGITAL]' : '[NON-DIGITAL]', '*** wait_for_rendering(): timeover', location.href, options );
            
            timeover_timer_id = null;
            
            finish();
        }, // end of timeover()
        
        last_payment_breakdown_html = '',
        
        observer = new MutationObserver( function ( records ) {
            log_debug( options.is_digital ? '[DIGITAL]' : '[NON-DIGITAL]', 'records changed', location.href );
            
            if ( 0 < jq_payment_breakdown_container.length ) {
                var payment_breakdown_html = jq_payment_breakdown_container.html();
                
                if ( last_payment_breakdown_html != payment_breakdown_html ) {
                    log_debug( 'payment_breakdown_html changed:', payment_breakdown_html );
                    last_payment_breakdown_html = payment_breakdown_html;
                    finish();
                    return;
                }
            }
            
            if ( watch_timer_id ) {
                clearTimeout( watch_timer_id );
            }
            watch_timer_id = setTimeout( finish, min_wait_ms );
            
            log_debug( 'records.length=', records.length );
            
            if ( DEBUG ) {
                records.forEach( function ( record ) {
                    log_debug( record.target );
                } );
            }
        } ),
        
        watch_timer_id = setTimeout( finish, min_wait_ms ),
        timeover_timer_id = setTimeout( timeover, max_wait_ms );
    
    //observer.observe( target_element, { childList : true, subtree : true } );
    observer.observe( ( 0 < jq_payment_breakdown_container.length ) ? jq_payment_breakdown_container[ 0 ] : target_element, { childList : true, subtree : true } );
    
    if ( jq_payment_breakdown_container.length <= 0 ) {
        // 2020/03/27現在、'#docs-order-summary-payment-breakdown-container' (ViewPaymentPlanSummary WIDGET)がない場合には後から要素が追加されることはなさそう（AD等は除く）
        finish();
    }
} // end of wait_for_rendering()


var get_error_html = ( error_message ) => {
    return '<html><head><title>#ERROR#</title></head><body><h3 style="color:red; font-weight:bolder;">#ERROR#</h3></body></html>'.replace( /#ERROR#/g, $( '<div/>' ).text( error_message ).html() );
}; // end of get_error_html()


// }


// ■ オブジェクトテンプレート {
var TemplateLoadingDialog = {
    //loading_icon_url : 'https://images-na.ssl-images-amazon.com/images/G/01/payments-portal/r1/loading-4x._CB338200758_.gif',
    loading_icon_svg : '<svg version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" fill="none" r="10" stroke-width="4" style="stroke: currentColor; opacity: 0.4;"></circle><path d="M 12,2 a 10 10 -90 0 1 9,5.6" fill="none" stroke="currentColor" stroke-width="4" />',
    
    init : function ( options ) {
        if ( ! options ) {
            options = {};
        }
        
        var self = this,
            jq_loading = $( '<div/>' ).addClass( SCRIPT_NAME + '-loading' ).css( {
                /*
                //'width' : '100%',
                //'height' : '100%',
                //'background' : 'url(' + self.loading_icon_url + ') center center no-repeat'
                */
                'position' : 'absolute',
                'top' : '0',
                'right' : '0',
                'bottom' : '0',
                'left' : '0',
                'margin' : 'auto',
                'width' : '100px',
                'height' : '100px',
                'color' : '#F3A847',
            } ).html( self.loading_icon_svg ),
            
            jq_loading_dialog = self.jq_loading_dialog = $( '<div/>' ).addClass( SCRIPT_NAME + '-mask' ).css( {
                'display' : 'none',
                'position' : 'fixed',
                'top' : '0',
                'left' : '0',
                'z-index' : '10000',
                'width' : '100%',
                'height' : '100%',
                'background' : 'black',
                'opacity' : '0.5',
            } ).append( jq_loading );
        
        $( '<style type="text/css"/>' )
            .text( [
                '.' + SCRIPT_NAME + '-loading svg {animation: now_loading 1.5s linear infinite;}',
                '@keyframes now_loading {0% {transform: rotate(0deg);} 100% {transform: rotate(360deg);}}',
            ].join( '\n' ) )
            .appendTo( $( 'head' ) );
        
        $( 'body' ).append( jq_loading_dialog );
        
        if ( options.counter_required ) {
            self.init_counter( options.max_number, options.initial_number );
        }
        
        return self;
    }, // end of init()
    
    
    show : function () {
        var self = this;
        
        self.jq_loading_dialog.show();
        self.counter_show();
        
        return self;
    }, // end of show()
    
    
    hide : function () {
        var self = this;
        
        self.counter_hide();
        self.jq_loading_dialog.hide();
        
        return self;
    }, // end of hide()
    
    
    init_counter : function ( max_number, initial_number ) {
        if ( ! initial_number ) {
            initial_number = 0;
        }
        
        var self = this,
            current_number = self.current_number = initial_number,
            jq_counter = self.jq_counter = $( '<div/>' ).addClass( 'counter' ).css( {
                'display' : 'none',
                'position' : 'fixed',
                'top' : '8px',
                'right' : '8px',
                'z-index' : '10001',
                'min-width' : '100px',
                'height' : '24px',
                'padding' : '2px 4px',
                'background' : 'white',
                'text-align' : 'center',
                'font-size' : '16px',
                'font-weight' : 'bolder',
                //'align-items' : 'center',
                //'justify-content' : 'center'
            } );
        
        self.max_number = max_number;
        self.initial_number = initial_number;
        
        self.counter_update_display();
        
        $( 'body' ).append( jq_counter );
        
        return self;
    }, // end of init_counter()
    
    
    counter_reset : function () {
        var self = this;
        
        self.current_number = self.initial_number;
        
        self.counter_update_display();
        
        return self;
    }, // end of counter_reset()
    
    
    counter_set : function ( number ) {
        var self = this;
        
        self.current_number = number;
        
        self.counter_update_display();
        
        return self;
    }, // end of counter_set()
    
    
    counter_increment : function () {
        var self = this;
        
        self.current_number ++;
        
        self.counter_update_display();
        
        return self;
    }, // end of counter_increment()
    
    
    counter_decrement : function () {
        var self = this;
        
        self.current_number --;
        
        self.counter_update_display();
        
        return self;
    }, // end of counter_decrement()
    
    
    counter_update_display : function () {
        var self = this,
            counter_text = '' + self.current_number;
        
        if ( self.max_number ) {
            counter_text += ' / ' + self.max_number;
        }
        
        self.jq_counter.text( counter_text );
        
        return self;
    }, // end of counter_update_display()
    
    
    counter_show : function () {
        var self = this;
        
        if ( self.jq_counter ) {
            //self.jq_counter.css( 'display', 'flex' );
            self.jq_counter.show();
        }
        
        return self;
    }, // end of counter_show()
    
    
    counter_hide : function () {
        var self = this;
        
        if ( self.jq_counter ) {
            self.jq_counter.hide();
        }
        
        return self;
    } // end of counter_hide()
    
}; // end of TemplateLoadingDialog


var TemplateOrderHistoryFilter = {
    filter_control_template : [
        '<div class="clearfix">',
        '  <div class="parameter-container">',
        '    <label><span class="month-label label left"></span><select name="month"></select></label>',
        '    <label><input name="include-digital" type="checkbox" /><span class="include-digital-label label"></span></label>',
        '    <label><input name="include-nondigital" type="checkbox" /><span class="include-nondigital-label label"></span></label>',
        '    (',
        '    <label><input name="include-reservation" type="checkbox" /><span class="include-reservation-label label"></span></label>',
        '    <label><input name="include-price-zero" type="checkbox" /><span class="include-price-zero-label label"></span></label>',
        '    )',
        '    <br />',
        '    <label><span class="destination-label label left"></span><select name="destination"></select></label>',
        '    <br />',
        '    <label><span class="text-filter-label label left"></span><form>',
        '       <input name="text-filter-keywords" type="text" />',
        '       <label><input name="text-filter-keywords-ruled-out" type="checkbox" /><span class="text-filter-keywords-ruled-out-label label"></span></label>',
        '       <button name="text-filter-apply" /><button name="text-filter-clear" />',
        '    </form><label>',
        '  </div>',
        '  <div class="operation-container">',
        '    <div class="counter-container">',
        '      <div class="counter digital"><span class="label"></span>:<span class="number">-</span><button name="print-receipt"></button></div>',
        '      <div class="counter nondigital"><span class="label"></span>:<span class="number">-</span><button name="print-receipt"></button></div>',
        '    </div>',
        '    <div class="message"></div>',
        '  </div>',
        '</div>'
    ].join( '\n' ),
    
    
    filter_option_keys : {
        include_digital : SCRIPT_NAME + '_include_digital',
        include_nondigital : SCRIPT_NAME + '_include_nondigital',
        include_reservation : SCRIPT_NAME + '_include_reservation',
        include_price_zero : SCRIPT_NAME + '_include_price_zero',
    },
    
    
    init : function ( under_suspension, order_history_page_info ) {
        var self = this;
        
        self.under_suspension = !! under_suspension;
        
        var is_legacy_page = self.is_legacy_page = (order_history_page_info.legacy_order_page_content_container != null);
        var $order_page_content_container = self.$order_page_content_container = $( order_history_page_info.order_page_content_container ?? order_history_page_info.legacy_order_page_content_container );
        
        var $order_filter = $order_page_content_container.find( is_legacy_page ? 'select#orderFilter' : 'select#time-filter' );
        if ( $order_filter.length <= 0 ) {
            return self;
        }
        
        var target_period = $order_filter.val() || '';
        
        try {
            if ( target_period.match( /^year-(\d{4})$/ ) ) {
                target_period = RegExp.$1;
            }
            else if ( target_period.match( /^months-(\d+)$/ ) ) {
                target_period = 'last-' + RegExp.$1 + 'months';
            }
            else if ( target_period.match( /^last(\d+)$/ ) ) {
                target_period = 'last-' + RegExp.$1 + 'days';
            }
            else {
                return self;
            }
        }
        catch ( error ) {
            log_error( error );
            return self;
        }
        
        self.target_period = target_period;
        
        var target_month = self.target_month = -1,
            order_information = self.order_information = {
                is_ready : false,
                total_order_number : 0,
                error_order_number : 0,
                month_order_info_lists : {},
                destination_infos : {},
                current_order_info_list : []
            },
            loading_dialog = self.loading_dialog = object_extender( TemplateLoadingDialog ).init();
        
        self.init_filter_options().init_filter_control();
        
        $( '<style type="text/css"/>' )
            .text( [
                //'#' + SCRIPT_NAME + '-filter-control button[name="print-receipt"] {background: lightblue;}',
                '#' + SCRIPT_NAME + '-filter-control button[name="print-receipt"][disabled] {background: lightgray; color: white; border-style: dotted;}',
            ].join( '\n' ) )
            .appendTo( $( 'head' ) );
        
        return self;
    }, // end of init()
    
    
    is_under_suspension : function () {
        var self = this;
        
        return self.under_suspension;
    }, // end of is_under_suspension()
    
    
    activate : function () {
        var self = this;
        
        if ( ! self.under_suspension ) {
            return self;
        }
        
        self.under_suspension = false;
        
        if ( self.jq_filter_control ) {
            self.jq_filter_control.show();
        }
        
        return self;
    }, // end of activate()
    
    
    suspend : function () {
        var self = this;
        
        if ( self.under_suspension ) {
            return self;
        }
        
        if ( self.order_information.is_ready ) {
            // 動作停止要求があったときに既に準備完了（ページ内容改変）済み→リロードを行う
            window.location.reload( false );
            return self;
        }
        
        self.under_suspension = true;
        
        if ( self.jq_filter_control ) {
            self.jq_filter_control.hide();
        }
        
        return self;
    }, // end of suspend()
    
    
    init_filter_options : function () {
        var self = this,
            filter_option_keys = self.filter_option_keys,
            filter_options = self.filter_options = {},
            init_value = function ( name, default_value ) {
                if ( get_value( filter_option_keys[ name ] ) !== null ) {
                    filter_options[ name ] = ( get_value( filter_option_keys[ name ] ) !== '0' );
                }
                else {
                    filter_options[ name ] = default_value;
                    set_value( filter_option_keys[ name ], ( filter_options[ name ] ) ? '1' : '0' );
                }
            }; // end of init_value()
        
        init_value( 'include_digital', OPTIONS.DEFAULT_FILTER_INCLUDE_DIGITAL );
        init_value( 'include_nondigital', OPTIONS.DEFAULT_FILTER_INCLUDE_NONDIGITAL );
        init_value( 'include_reservation', OPTIONS.DEFAULT_FILTER_INCLUDE_RESERVATION );
        init_value( 'include_price_zero', OPTIONS.DEFAULT_FILTER_INCLUDE_PRICE_ZERO );
        
        return self;
    }, // end of init_filter_options()
    
    
    init_filter_control : function () {
        var self = this,
            month_number = 0,
            filter_options = self.filter_options,
            
            jq_filter_control = self.jq_filter_control = $( self.filter_control_template ).attr( 'id', SCRIPT_NAME + '-filter-control' ).css( {
                'position' : 'relative',
                'margin' : self.is_legacy_page ? '0 0 4px 0' : '12px 0 4px 0',
                'min-height' : '80px'
            } ),
            
            jq_parameter_container = jq_filter_control.find( '.parameter-container' ).css( {
                'position' : 'absolute',
                'top' : '0',
                'left' : '0',
                'z-index' : 1
            } ),
            
            jq_select_month = self.jq_select_month = jq_parameter_container.find( 'select[name="month"]' ).css( {
                'background' : '#fff0f5'
            } ),
            jq_select_month_option_no_select = self.jq_select_month_option_no_select = $( '<option />' ).val( -1 ).text( OPTIONS.SELECT_MONTH_NO_SELECT_TEXT ).appendTo( jq_select_month ).css( {
                'background' : '#fff0f5'
            } ),
            jq_select_month_option_all = self.jq_select_month_option_all = $( '<option />' ).val( 0 ).text( OPTIONS.SELECT_MONTH_ALL_TEXT ).appendTo( jq_select_month ).css( {
                'background' : 'white'
            } ),
            jq_select_month_option,
            
            jq_checkbox_include_digital = self.jq_checkbox_include_digital = jq_parameter_container.find( 'input[name="include-digital"]' ),
            jq_checkbox_include_nondigital = self.jq_checkbox_include_nondigital = jq_parameter_container.find( 'input[name="include-nondigital"]' ),
            jq_checkbox_include_reservation = self.jq_checkbox_include_reservation = jq_parameter_container.find( 'input[name="include-reservation"]' ),
            jq_checkbox_include_price_zero = self.jq_checkbox_include_price_zero = jq_parameter_container.find( 'input[name="include-price-zero"]' ),
            
            jq_select_destination = self.jq_select_destination = jq_parameter_container.find( 'select[name="destination"]' )
                .prop( 'disabled', 'disabled' )
                .css( {
                    'opacity' : '0.5'
                } ),
            jq_select_destination_option_all = $( '<option />' ).val( '' ).text( OPTIONS.SELECT_DESTINATION_ALL_TEXT ).appendTo( jq_select_destination ),
            jq_select_destination_option,
            
            jq_input_text_filter = self.jq_input_text_filter = jq_parameter_container.find( 'input[name="text-filter-keywords"]' )
                .attr( 'placeholder', OPTIONS.TEXT_FILTER_PLACEHOLDER_TEXT )
                .attr( 'title', OPTIONS.TEXT_FILTER_HELP_TEXT )
                .prop( 'disabled', 'disabled' )
                .css( {
                    'min-width' : '500px',
                    'height' : '24px',
                    'margin-right' : '8px',
                    'opacity' : '0.5'
                } ),
            jq_checkbox_text_filter_keywords_ruled_out = self.jq_checkbox_text_filter_keywords_ruled_out = jq_parameter_container.find( 'input[name="text-filter-keywords-ruled-out"]' ),
            jq_button_text_filter_apply = self.jq_button_text_filter_apply = jq_parameter_container.find( 'button[name="text-filter-apply"]' )
                .text( OPTIONS.TEXT_FILTER_APPLY_BUTTUON_TEXT )
                .prop( 'disabled', 'disabled' )
                .css( {
                    'cursor' : 'pointer',
                    'margin-right' : '8px'
                } ),
            jq_button_text_filter_clear = self.jq_button_text_filter_clear = jq_parameter_container.find( 'button[name="text-filter-clear"]' )
                .text( OPTIONS.TEXT_FILTER_CLEAR_BUTTUON_TEXT )
                .prop( 'disabled', 'disabled' )
                .css( {
                    'cursor' : 'pointer',
                    'margin-right' : '8px'
                } ),
            
            jq_counter_container = self.jq_counter_container = jq_filter_control.find( '.counter-container' ).css( {
                'color' : 'lightgray',
                'vertical-align' : 'top'
            } ),
            jq_counter_digital = jq_counter_container.find( '.counter.digital' ).css( {
                'padding-bottom' : '4px',
            } ),
            jq_counter_nondigital = jq_counter_container.find( '.counter.nondigital' ).css( {
            } ),
            jq_counter_digital_number = self.jq_counter_digital_number = jq_counter_digital.find( '.number' ),
            jq_counter_nondigital_number = self.jq_counter_nondigital_number = jq_counter_nondigital.find( '.number' ),
            
            jq_operation_continer = jq_filter_control.find( '.operation-container' ).css( {
                'position' : 'absolute',
                //'top' : '0',
                //'top' : '-24px',
                //'top' : '-42px',
                'top' : '-54px',
                'right' : '0',
                'text-align' : 'right'
            } ),
            jq_button_print_receipt_digital = self.jq_button_print_receipt_digital = jq_counter_digital.find( 'button[name="print-receipt"]' )
                .text( OPTIONS.PRINT_RECEIPT_BUTTON_TEXT )
                .attr( 'title', OPTIONS.CHECKBOX_FILTER_INCLUDE_DIGITAL_TEXT )
                .prop( 'disabled', 'disabled' ),
            
            jq_button_print_receipt_nondigital = self.jq_button_print_receipt_nondigital = jq_counter_nondigital.find( 'button[name="print-receipt"]' )
                .text( OPTIONS.PRINT_RECEIPT_BUTTON_TEXT )
                .attr( 'title', OPTIONS.CHECKBOX_FILTER_INCLUDE_NONDIGITAL_TEXT )
                .prop( 'disabled', 'disabled' ),
            
            jq_message = self.jq_message = jq_filter_control.find( '.message' ).css( {
                'color' : 'red',
                'min-width' : '50px',
                'padding' : '4px 0 4px 4px',
                'font-weight' : 'bolder',
                'text-align' : 'right',
                'margin-top' : '14px',
            } ),
            
            current_date = new Date(),
            target_period = self.target_period,
            current_year_number = current_date.getFullYear(),
            current_month_number = ( ( target_period == current_year_number ) || isNaN( target_period ) ) ? ( 1 + current_date.getMonth() ) : 0,
            jq_select_month_option_this_year = $();
            
        
        jq_filter_control.find( 'label' ).css( {
            'display' : 'inline-block',
            'margin' : '0 4px'
        } );
        
        jq_filter_control.find( 'div,form' ).css( {
            'display' : 'inline-block'
        } );
        
        jq_filter_control.find( 'div.counter' ).css( {
            'font-weight' : 'bolder'
        } );
        
        jq_filter_control.find( 'span.label' ).css( {
            'margin' : '0 0 0 4px'
        } );
        
        jq_filter_control.find( 'span.label.left' ).css( {
            'margin' : '0 4px 0 0'
        } );
        
        jq_filter_control.find( 'span.number' ).css( {
            'margin' : '0',
            'display' : 'inline-block',
            //'min-width' : '32px',
            'min-width' : '64px',
            'text-align' : 'center'
        } );
        
        jq_counter_container.css( {
            'display' : 'flex',
            'flex-direction' : 'column',
        } );
        
        jq_parameter_container.find( '.month-label' ).text( OPTIONS.SELECT_MONTH_LABEL_TEXT );
        jq_parameter_container.find( '.include-digital-label' ).text( OPTIONS.CHECKBOX_FILTER_INCLUDE_DIGITAL_TEXT );
        jq_parameter_container.find( '.include-nondigital-label' ).text( OPTIONS.CHECKBOX_FILTER_INCLUDE_NONDIGITAL_TEXT );
        jq_parameter_container.find( '.include-reservation-label' ).text( OPTIONS.CHECKBOX_FILTER_INCLUDE_RESERVATION_TEXT );
        jq_parameter_container.find( '.include-price-zero-label' ).text( OPTIONS.CHECKBOX_FILTER_INCLUDE_PRICE_ZERO );
        jq_parameter_container.find( '.destination-label' ).text( OPTIONS.SELECT_DESTINATION_LABEL_TEXT );
        jq_parameter_container.find( '.text-filter-label' ).text( OPTIONS.TEXT_FILTER_LABEL_TEXT );
        jq_parameter_container.find( '.text-filter-keywords-ruled-out-label' ).text( OPTIONS.TEXT_FILTER_KEYWORDS_RULED_OUT_CHECKBOX_LABEL_TEXT );
        
        jq_counter_digital.find( '.label' ).text( OPTIONS.COUNTER_LABEL_DIGITAL_TEXT );
        jq_counter_nondigital.find( '.label' ).text( OPTIONS.COUNTER_LABEL_NONDIGITAL_TEXT );
        
        for ( month_number = 12; 1 <= month_number ; month_number -- ) {
            jq_select_month_option = $( '<option />' ).val( month_number ).text( month_number ).css( 'background', 'white' ).appendTo( jq_select_month );
            
            if ( ! current_month_number ) {
                continue;
            }
            
            if ( target_period == current_year_number ) {
                if ( current_month_number < month_number ) {
                    jq_select_month_option.prop( 'disabled', true ).css( 'background', '#cccccc' );
                }
            }
            else {
                if ( month_number <= current_month_number ) {
                    jq_select_month_option_this_year = jq_select_month_option_this_year.add( jq_select_month_option );
                }
            }
        }
        
        if ( 0 < jq_select_month_option_this_year.length ) {
            jq_select_month_option_all.after( jq_select_month_option_this_year );
        }
        
        jq_select_month.val( -1 );
        
        if ( IS_EDGE ) {
            // MS-Edge では、なぜか jQuery の change イベントが発火しない
            jq_select_month[ 0 ].addEventListener( 'change', function ( event ) {
                self.onchange_month( event );
            } );
        }
        else {
            jq_select_month.change( function ( event ) {
                self.onchange_month( event );
            } );
        }
        
        jq_checkbox_include_digital
            .prop( 'checked', filter_options.include_digital )
            .change( function ( event ) {
                self.onchange_include_digital( event );
            } );
        
        jq_checkbox_include_nondigital
            .prop( 'checked', filter_options.include_nondigital )
            .change( function ( event ) {
                self.onchange_include_nondigital( event );
            } );
        
        jq_checkbox_include_reservation
            .prop( 'checked', filter_options.include_reservation )
            .change( function ( event ) {
                self.onchange_include_reservation( event );
            } );
        
        jq_checkbox_include_price_zero
            .prop( 'checked', filter_options.include_price_zero )
            .change( function ( event ) {
                self.onchange_include_price_zero( event );
            } );
        
        jq_select_destination.val( '' );
        
        if ( IS_EDGE ) {
            // MS-Edge では、なぜか jQuery の change イベントが発火しない
            jq_select_destination[ 0 ].addEventListener( 'change', function ( event ) {
                self.onchange_destination( event );
            } );
        }
        else {
            jq_select_destination.change( function ( event ) {
                self.onchange_destination( event );
            } );
        }
        
        jq_checkbox_text_filter_keywords_ruled_out
            .prop( 'checked', false )
            .prop( 'disabled', 'disabled' )
            .change( function ( event ) {
                self.onchange_text_filter_keywords_ruled_out( event );
            } )
            .parent( 'label' )
            .css( 'opacity', '0.5' );
        
        jq_button_text_filter_apply
            .click( function ( event ) {
                self.onclick_text_filter_apply_button( event );
            } )
            .parent( 'form' )
            .on( 'submit', function( event ) {
                self.onclick_text_filter_apply_button( event );
            } );
        
        jq_button_text_filter_clear
            .click( function ( event ) {
                self.onclick_text_filter_clear_button( event );
            } );
        
        jq_button_print_receipt_digital
            .click( function ( event ) {
                self.onclick_button_print_receipt_digital( event );
            } );
        
        jq_button_print_receipt_nondigital
            .click( function ( event ) {
                self.onclick_button_print_receipt_nondigital( event );
            } );
        
        if ( self.under_suspension ) {
            jq_filter_control.hide();
        }
        
        var $parent_container = self.is_legacy_page ? self.$order_page_content_container.find( '#controlsContainer' ) : self.$order_page_content_container.find( '.js-time-filter-form ' ).parent();
        $parent_container.append( jq_filter_control );
        
        return self;
    }, // end of init_filter_control()
    
    
    onchange_month : function ( event ) {
        var self = this,
            jq_select_month = self.jq_select_month;
        
        event.stopPropagation();
        event.preventDefault();
        
        jq_select_month.blur();
        
        self.update_order_container();
        
        return self;
    }, // end of onchange_month()
    
    
    onchange_include_digital : function ( event ) {
        var self = this,
            filter_option_keys = self.filter_option_keys,
            filter_options = self.filter_options,
            jq_checkbox_include_digital = self.jq_checkbox_include_digital,
            is_checked = jq_checkbox_include_digital.is( ':checked' );
        
        event.stopPropagation();
        event.preventDefault();
        
        filter_options.include_digital = is_checked;
        set_value( filter_option_keys.include_digital, ( is_checked ) ? '1' : '0' );
        
        self.update_order_container();
        
        return self;
    }, // end of onchange_include_digital()
    
    
    onchange_include_nondigital : function ( event ) {
        var self = this,
            filter_option_keys = self.filter_option_keys,
            filter_options = self.filter_options,
            jq_checkbox_include_nondigital = self.jq_checkbox_include_nondigital,
            is_checked = jq_checkbox_include_nondigital.is( ':checked' );
        
        event.stopPropagation();
        event.preventDefault();
        
        filter_options.include_nondigital = is_checked;
        set_value( filter_option_keys.include_nondigital, ( is_checked ) ? '1' : '0' );
        
        self.update_order_container();
        
        return self;
    }, // end of onchange_include_nondigital()
    
    
    onchange_include_reservation : function ( event ) {
        var self = this,
            filter_option_keys = self.filter_option_keys,
            filter_options = self.filter_options,
            jq_checkbox_include_reservation = self.jq_checkbox_include_reservation,
            is_checked = jq_checkbox_include_reservation.is( ':checked' );
        
        event.stopPropagation();
        event.preventDefault();
        
        filter_options.include_reservation = is_checked;
        set_value( filter_option_keys.include_reservation, ( is_checked ) ? '1' : '0' );
        
        self.update_order_container();
        
        return self;
    }, // end of onchange_include_reservation()
    
    
    onchange_include_price_zero : function ( event ) {
        var self = this,
            filter_option_keys = self.filter_option_keys,
            filter_options = self.filter_options,
            jq_checkbox_include_price_zero = self.jq_checkbox_include_price_zero,
            is_checked = jq_checkbox_include_price_zero.is( ':checked' );
        
        event.stopPropagation();
        event.preventDefault();
        
        filter_options.include_price_zero = is_checked;
        set_value( filter_option_keys.include_price_zero, ( is_checked ) ? '1' : '0' );
        
        self.update_order_container();
        
        return self;
    }, // end of onchange_include_price_zero()
    
    
    onchange_destination : function ( event ) {
        var self = this,
            jq_select_destination = self.jq_select_destination;
        
        event.stopPropagation();
        event.preventDefault();
        
        jq_select_destination.blur();
        
        self.update_order_container();
        
        return self;
    }, // end of onchange_destination()
    
    
    onchange_text_filter_keywords_ruled_out : function ( event ) {
        var self = this;
        
        event.stopPropagation();
        event.preventDefault();
        
        self.update_order_container();
        
        return self;
    }, // end of onchange_text_filter_keywords_ruled_out()
    
    
    onclick_text_filter_apply_button  : function ( event ) {
        var self = this;
        
        event.stopPropagation();
        event.preventDefault();
        
        self.update_order_container();
        
        return self;
    }, // end of onclick_text_filter_apply_button()
    
    
    onclick_text_filter_clear_button  : function ( event ) {
        var self = this;
        
        event.stopPropagation();
        event.preventDefault();
        
        self.jq_checkbox_text_filter_keywords_ruled_out.prop( 'checked', false );
        self.jq_input_text_filter.val( '' );
        
        self.update_order_container();
        
        return self;
    }, // end of onclick_text_filter_clear_button()
    
    
    onclick_button_print_receipt_digital : function ( event ) {
        var self = this;
        
        event.stopPropagation();
        event.preventDefault();
        
        if ( ! self.order_information.is_ready ) {
            return self;
        }
        
        self.open_order_receipts_for_print_digital();
        
        return self;
    }, // end of onclick_button_print_receipt_digital()
    
    
    onclick_button_print_receipt_nondigital : function ( event ) {
        var self = this;
        
        event.stopPropagation();
        event.preventDefault();
        
        if ( ! self.order_information.is_ready ) {
            return self;
        }
        
        self.open_order_receipts_for_print_nondigital();
        
        return self;
    }, // end of onclick_button_print_receipt_nondigital()
    
    
    update_order_container : function () {
        var self = this,
            is_legacy_page = self.is_legacy_page,
            jq_select_month = self.jq_select_month,
            jq_select_destination = self.jq_select_destination,
            target_month = self.target_month = parseInt( jq_select_month.val(), 10 ),
            target_destination = self.target_destination = jq_select_destination.val(),
            text_filter_info = self.text_filter_info = self.get_text_filter_info(),
            target_keyword_string = self.target_keyword_string = text_filter_info.keyword_string,
            target_keyword_is_ruled_out = self.target_keyword_is_ruled_out = self.jq_checkbox_text_filter_keywords_ruled_out.is( ':checked' ),
            order_information = self.order_information;
            
        if ( isNaN( target_month ) || ( target_month < 0 ) || ( 12 < target_month ) ) {
            return self;
        }
        
        if ( ! order_information.is_ready ) {
            self.get_order_information();
            
            return self;
        }
        
        var filter_options = self.filter_options,
            month_order_info_lists = order_information.month_order_info_lists,
            current_order_info_list = order_information.current_order_info_list = [],
            target_month_order_info_list = month_order_info_lists[ target_month ],
            jq_order_container = is_legacy_page ? self.$order_page_content_container.find('#ordersContainer') : self.$order_page_content_container,
            jq_insert_point = jq_order_container.children( '.a-row:last' ),
            jq_counter_digital_number = self.jq_counter_digital_number,
            jq_counter_nondigital_number = self.jq_counter_nondigital_number,
            jq_button_print_receipt_digital = self.jq_button_print_receipt_digital,
            jq_button_print_receipt_nondigital = self.jq_button_print_receipt_nondigital,
            digital_counter = 0,
            nondigital_counter = 0,
            digital_reservation_counter = 0,
            nondigital_reservation_counter = 0,
            
            step_index_number = 10,
            lazy_index = step_index_number,
            
            on_scroll = function ( event ) {
                var jq_window = $ ( this ),
                    jq_document = $( document ),
                    index_counter = 0;
                
                if ( jq_document.height() < jq_document.scrollTop() + ( 2.0 * jq_window.height() )  ) {
                    for ( ; ( index_counter < step_index_number ) && ( lazy_index < current_order_info_list.length ); index_counter ++, lazy_index ++ ) {
                        current_order_info_list[ lazy_index ].jq_order.show();
                    }
                }
            }; // end of on_scroll()
        
        if ( ! target_month_order_info_list ) {
            return self;
        }
        
        self.loading_dialog.show();
        
        $( window ).off( 'scroll.update_order_container resize.update_order_container' );
        
        jq_order_container.children( '.js-order-card,.order-card__list' ).remove();
        
        target_month_order_info_list.forEach( function ( order_info ) {
            if ( ( ! filter_options.include_digital ) && ( order_info.is_digital ) ) {
                return;
            }
            if ( ( ! filter_options.include_nondigital ) && ( ! order_info.is_digital ) ) {
                return;
            }
            if ( ( ! filter_options.include_reservation ) && ( order_info.is_reservation ) ) {
                return;
            }
            if ( ( ! filter_options.include_price_zero ) && ( order_info.order_price_number === 0 ) ) {
                return;
            }
            
            if ( target_destination ) {
                if ( ! order_info.recipient_map[ target_destination ] ) {
                    return;
                }
            }
            
            var is_hit = self.check_text_filter_is_hit( order_info.search_index_text, text_filter_info );
            
            if ( ( target_keyword_is_ruled_out && is_hit ) || ( ( ! target_keyword_is_ruled_out ) && ( ! is_hit ) ) ) {
                return;
            }
            
            if ( order_info.is_digital ) {
                digital_counter ++;
                
                if ( order_info.is_reservation ) {
                    digital_reservation_counter ++;
                }
            }
            else {
                nondigital_counter ++;
                
                if ( order_info.is_reservation ) {
                    nondigital_reservation_counter ++;
                }
            }
            
            current_order_info_list.push( order_info );
            
            if ( current_order_info_list.length <= step_index_number ) {
                order_info.jq_order.show();
            }
            else {
                order_info.jq_order.hide();
            }
            
            if ( IS_EDGE ) {
                // MS-Edge で書影アイコンが二重に表示される→一つ目以外は隠す
                order_info.jq_order.find( '.item-view-left-col-inner a.a-link-normal' ).each( function () {
                    var jq_icon_link = $( this );
                    
                    jq_icon_link.find( 'img' ).slice( 1 ).hide();
                } );
            }
            
            jq_insert_point.before( order_info.jq_order );
        } );
        
        jq_counter_digital_number.text( digital_counter );
        jq_counter_nondigital_number.text( nondigital_counter );
        
        jq_button_print_receipt_digital.prop( 'disabled', ( digital_counter <= 0 ) );
        jq_button_print_receipt_nondigital.prop( 'disabled', ( nondigital_counter <= 0 ) );
        
        var scroll_top = $( window ).scrollTop();
        
        $( window ).scrollTop( scroll_top + 1 );
        // TODO: 注文内容を書き換えた際、スクロールさせないとサムネイル画像が表示されない→とりあえず強制的にスクロールさせておく
        
        setTimeout( function () {
            $( window ).scrollTop( scroll_top );
            
            self.loading_dialog.hide();
        }, 1 );
        
        $( '#rhf' ).hide();
        //$( '#rightRail' ).hide();
        
        $( window ).on( 'scroll.update_order_container resize.update_order_container', on_scroll );
        
        return self;
    }, // end of update_order_container()
    
    
    get_order_information : function () {
        var self = this,
            order_information = self.order_information,
            is_legacy_page = self.is_legacy_page,
            $order_page_content_container = self.$order_page_content_container,
            page_index = 0,
            max_page_index = 0,
            order_info_page_url_list = [],
            start_ms = new Date().getTime(),
            last_page_url = $order_page_content_container.find( is_legacy_page ? 'div.pagination-full ul.a-pagination li.a-normal:last a' : 'div.a-row ul.a-pagination li.a-normal:last a' ).attr( 'href' ),
            error_button = $( '<button/>' ).css( {
                'margin-left' : '8px',
                'color' : 'red'
            } ),
            download_text = function ( filename, text ) {
                var blob = new Blob( [ text ], { type : 'text/plain' } ),
                    $link = $( '<a>' ).attr( {
                        'download' : filename,
                        'href' : URL.createObjectURL( blob )
                    } ).css( {
                        'display' : 'inline-block',
                        'width' : '0',
                        'height' : '0',
                        'visibility' : 'hidden'
                    } ).appendTo( 'body' );
                
                $link[ 0 ].click();
                
                $link.remove();
            };
        
        self.loading_dialog.show();
        self.jq_message.text( '' );
        
        ( async () => {
            if ( ! last_page_url ) {
                //last_page_url = window.location.href;
                // Error logged with the Track&Report JS errors API(http://tiny/1covqr6l8/wamazindeClieUserJava): {"m":"[CSM] Ajax request to same page detected xmlhttprequest : ～ }
                last_page_url = window.location.href.replace( /&_aohtimestamp=\d+/g, '' ) + '&_aohtimestamp=' + new Date().getTime() ;
            }
            
            let last_page_url_obj = new URL(last_page_url, location.href);
            
            if ( (last_page_url_obj.pathname == '/your-orders/orders') && (! last_page_url_obj.searchParams.has('disableCsd')) ) {
                // [備忘] パラメータ"disableCsd=missing-library"の付加で（例: /your-orders/orders?_encoding=UTF8&disableCsd=missing-library&ref_=ppx_yo2ov_dt_b_pagination_1_1&startIndex=0）暗号化されないページを取得できそう？(2025/02)
                last_page_url_obj.searchParams.set('disableCsd', 'missing-library'); // ページの暗号化抑制用パラメータを設定
            }
            
            last_page_url = last_page_url_obj.href;
            
            if ( last_page_url_obj.searchParams.has('startIndex') ) {
                max_page_index = parseInt( last_page_url_obj.searchParams.get('startIndex'), 10 );
                let work_url_obj = new URL(last_page_url);
                
                // [メモ] 注文が多いと(自分の環境だと5000件より多いと(startIndex>500))最後のページがわからない（※1ページあたりの注文件数は10件固定）
                // →大きいページ番号(startIndex)を指定して取得したページのナビゲーションから、最終ページを取得
                try {
                    work_url_obj.searchParams.set('startIndex', '100000'); // TODO:とりあえず100000ページ(~100万件)あれば十分と考えたが、妥当かは不明
                    const
                        test_url = work_url_obj.href,
                        response = await fetch( test_url );
                    
                    if ( response.ok ) {
                        const
                            jq_html_fragment = get_jq_html_fragment( await response.text() );
                        
                        last_page_url = jq_html_fragment.find(is_legacy_page ? 'div.pagination-full ul.a-pagination li.a-normal:last a' : 'div.a-row ul.a-pagination li.a-normal:last a' ).attr( 'href' );
                        last_page_url_obj = new URL(last_page_url, location.href);
                        max_page_index = parseInt( last_page_url_obj.searchParams.get('startIndex'), 10 );
                    }
                }
                catch ( error ) {
                    log_error( error );
                }
                work_url_obj = new URL(last_page_url, location.href);
                for ( page_index = 0; page_index <= max_page_index; page_index += 10 ) {
                    work_url_obj.searchParams.set('startIndex', page_index);
                    order_info_page_url_list.push( work_url_obj.href );
                }
            }
            else {
                order_info_page_url_list.push( last_page_url );
            }
            
            log_info( `[*] max_page_index: ${max_page_index} (last_page_url: ${last_page_url})` );
            
            //self.loading_dialog.show();
            //self.jq_message.text( '' );
            
            self.fetch_all_html( order_info_page_url_list, function ( result ) {
                log_debug( 'elapsed time:', ( new Date().getTime() - start_ms ) / 1000, 's', result );
                
                if ( ! result.success ) {
                    self.jq_message.text( result.error_message );
                    self.loading_dialog.hide();
                    return;
                }
                
                if ( 0 < result.fetch_failure_list.length ) {
                    var failure_urls_text = result.fetch_failure_list.map( function ( fetch_failure_result ) {
                            return get_absolute_url( fetch_failure_result.url );
                        } ).join( '\n' );
                    
                    error_button.text( 'Download failure list' ).click( function ( event ) {
                        download_text( 'download-error-urls.txt', failure_urls_text );
                    } );
                    self.jq_message.text( 'Partial download failure' ).append( error_button );
                }
                
                self.analyze_order_information( result.fetch_result_list );
                
                if ( ( result.fetch_failure_list.length <= 0 ) && ( 0 < order_information.order_error_urls.length ) ) {
                    var error_urls_text = order_information.order_error_urls.join( '\n' );
                    
                    error_button.text( 'Download error list' ).click( function ( event ) {
                        download_text( 'order-error-urls.txt', error_urls_text );
                    } );
                    self.jq_message.text( 'Partial order error' ).append( error_button );
                }
                
                var destination_infos = order_information.destination_infos,
                    destination_info_list = [],
                    month_number = 0,
                    month_order_info_lists = order_information.month_order_info_lists,
                    jq_select_month = self.jq_select_month,
                    jq_select_month_option,
                    jq_num_orders = $order_page_content_container.find( '.num-orders' ),
                    original_order_number_string = jq_num_orders.text().trim();
                
                Object.keys( order_information.destination_infos ).forEach( function ( name ) {
                    destination_info_list.push( order_information.destination_infos[ name ] );
                } );
                
                destination_info_list.sort( function ( a, b ) {
                    return ( a.order_info_list.length < b.order_info_list.length );
                } );
                
                destination_info_list.forEach( function ( destination_info ) {
                    $( '<option />' ).val( destination_info.name ).text( destination_info.name ).appendTo( self.jq_select_destination );
                } );
                
                for ( month_number = 1; month_number <= 12; month_number ++ ) {
                    jq_select_month_option = jq_select_month.children( 'option[value=' + month_number + ']' );
                    
                    if ( month_order_info_lists[ month_number ].length <= 0 ) {
                        //jq_select_month_option.remove();
                        if ( jq_select_month_option.is( ':selected' ) ) {
                            jq_select_month.val( 0 );
                        }
                        jq_select_month_option.prop( 'disabled', true ).css( 'background', '#cccccc' );
                    }
                    else {
                        jq_select_month_option.css( 'background', 'white' );
                    }
                }
                
                order_information.is_ready = true;
                
                self.jq_select_month.css( 'background', 'transparent' );
                self.jq_select_month_option_no_select.prop( 'disabled', true ).css( 'background', '#cccccc' );
                self.jq_select_destination.css( 'opacity', '1' ).prop( 'disabled', false );
                self.jq_input_text_filter.css( 'opacity', '1' ).prop( 'disabled', false );
                self.jq_checkbox_text_filter_keywords_ruled_out.prop( 'disabled', false ).parent( 'label' ).css( 'opacity', '1' );
                self.jq_button_text_filter_apply.prop( 'disabled', false );
                self.jq_button_text_filter_clear.prop( 'disabled', false );
                //self.jq_button_print_receipt.prop( 'disabled', false );
                self.jq_button_print_receipt_digital.prop( 'disabled', false );
                self.jq_button_print_receipt_nondigital.prop( 'disabled', false );
                self.jq_counter_container.css( 'color', 'gray' );
                
                if ( is_legacy_page ) {
                    $order_page_content_container.find( 'div.pagination-full' ).hide();
                }
                else {
                    $order_page_content_container.find( 'div.a-row' ).filter( function () {
                        return ( 0 < $( this ).find( 'ul.a-pagination' ).length );
                    } ).hide();
                }
                
                jq_num_orders.html( `${order_information.total_order_number}件 <span class="error-num-orders">(内、エラー: ${order_information.error_order_number}件)</span>` );
                jq_num_orders.find( '.error-num-orders' ).css( {
                    'display': ( 0 < order_information.error_order_number ) ? 'inline' : 'none',
                    'color': '#ff0000',
                } );
                log_info(`[*] original total: ${original_order_number_string} => counted total: ${order_information.total_order_number} / error: ${order_information.error_order_number}`);
                
                $( window ).on( 'beforeunload', function ( jq_event ) {
                    jq_event.preventDefault();
                    jq_event.returnValue = "";
                    return '';
                } );
                
                self.loading_dialog.hide();
                
                self.update_order_container();
            } );
        } )();
        
        return self;
    },  // end of get_order_information()
    
    
    analyze_order_information : function ( order_info_page_fetch_result_list ) {
        var self = this,
            month_number = 0,
            total_order_number = 0,
            error_order_number = 0,
            order_information = self.order_information,
            month_order_info_lists = order_information.month_order_info_lists = {},
            destination_infos = order_information.destination_infos = {},
            order_error_urls = order_information.order_error_urls = [],
            order_id_map = {};
        
        for ( month_number = 0; month_number <= 12; month_number ++ ) {
            month_order_info_lists[ month_number ] = [];
        }
        
        order_info_page_fetch_result_list.forEach( function ( fetch_result ) {
            const
                jq_html_fragment = get_jq_html_fragment( fetch_result.html );
            
            // [2025/02] 「お届け先」が隠されている場合はこれを表示する処理を追加
            jq_html_fragment.find('[id^="shipToData-"]').each(function(){
                const
                    jq_encryptedDataNode = $(this),
                    encryptedDataNode_html = jq_encryptedDataNode.html(),
                    insertionNodeId = jq_encryptedDataNode.attr('id').replace(/^shipToData-/, 'shipToInsertionNode-');
                
                jq_html_fragment.find(`[id="${insertionNodeId}"]`).each(function(){
                    const 
                        jq_insertionNode = $(this);
                    
                    jq_insertionNode.html(encryptedDataNode_html);
                });
            });
            jq_html_fragment.find('script').remove();
            
            const
                order_history_page_info = get_order_history_page_info(jq_html_fragment.get(0)),
                is_legacy_page = (order_history_page_info.legacy_order_page_content_container != null),
                $order_page_content_container = $( order_history_page_info.order_page_content_container ?? order_history_page_info.legacy_order_page_content_container ),
                jq_orders = $order_page_content_container.find( is_legacy_page ? '#ordersContainer > .js-order-card' : '> .js-order-card, > .order-card__list > .js-order-card' );
            
            total_order_number += jq_orders.length;
            
            jq_orders.each( function () {
                var jq_order = $( this ),
                    individual_order_info;
                
                try {
                    if ( is_legacy_page ) {
                        individual_order_info = self.get_individual_order_info_legacy( jq_order );
                    }
                    else {
                        individual_order_info = self.get_individual_order_info( jq_order );
                    }
                }
                catch ( error ) {
                    log_error( '*** [BUG] ***' );
                    log_info( 'jq_order.html()\n', jq_order.html() );
                    error_order_number ++;
                    return;
                }
                if ( individual_order_info.order_date_info.month < 0 ) {
                    log_info( '[malformed order info]\n', individual_order_info );
                    
                    if ( individual_order_info.order_detail_url ) {
                        order_error_urls.push( get_absolute_url( individual_order_info.order_detail_url ) );
                    }
                    error_order_number ++;
                    return;
                }
                if (order_id_map[individual_order_info.order_id]) {
                    log_info(`[duplicated order] order_id: ${individual_order_info.order_id}`);
                    return;
                }
                order_id_map[individual_order_info.order_id] = individual_order_info;
                
                month_order_info_lists[ 0 ].push( individual_order_info );
                month_order_info_lists[ individual_order_info.order_date_info.month ].push( individual_order_info );
                
                Object.keys( individual_order_info.recipient_map ).forEach( function ( order_destination ) {
                    var destination_info = destination_infos[ order_destination ];
                    
                    if ( ! destination_info ) {
                        destination_infos[ order_destination ] = destination_info = {
                            name : order_destination,
                            order_info_list : []
                        };
                    }
                    destination_info.order_info_list.push( individual_order_info );
                } );
            } );
        } );
        
        order_information.total_order_number = total_order_number;
        order_information.error_order_number = error_order_number;
        
        return self;
    }, // end of analyze_order_information()
    
    
    get_individual_order_info_legacy : function ( jq_order ) {
        var self = this,
            jq_order_info = jq_order.children( '.order-info' ),
            individual_order_info = self.get_individual_order_info_common( jq_order, jq_order_info );
        
        return individual_order_info;
    }, // end of get_individual_order_info_legacy()
    
    
    get_individual_order_info : function ( jq_order ) {
        var self = this,
            jq_order_info = jq_order.find( '> .order > .order-info' ),
            individual_order_info = {};
        
        if (0 < jq_order_info.length) {
            individual_order_info = self.get_individual_order_info_common( jq_order_info.parent(), jq_order_info );
            return individual_order_info;
        }
        
        var jq_box_group = jq_order.find('> .a-box-group'),
            jq_order_header = jq_box_group.children( '.order-header' ),
            jq_delivery_box_list = jq_box_group.children( '.delivery-box' ),
            jq_order_footer = jq_box_group.children( '.order-footer' ),
            jq_order_info_left = jq_order_header.find( '.a-col-left' ),
            jq_a_span3_list = jq_order_info_left.find( '.a-span3' ),
            jq_order_date = jq_a_span3_list.first().find( '.a-row:last .a-color-secondary' ),
            order_date = jq_order_date.text().trim(),
            order_date_info = { year : -1, month : -1, date : -1 },
            order_year,
            order_month,
            order_day,
            order_price = jq_order_info_left.find( '.yohtmlc-order-total,.a-span2 > .a-row:last > .a-color-secondary' ).first().text().trim(),
            order_price_number = ( typeof order_price == 'string' ) ? parseInt( order_price.replace( /[^\d.\-]/g, '' ), 10 ) : 0,
            order_destination = jq_order_info_left.find( '.yohtmlc-recipient .a-declarative .a-popover-trigger' ).text().trim(),
            jq_order_info_actions = jq_order_header.find( '.a-col-right' ),
            order_id = jq_order_info_actions.find( '.yohtmlc-order-id [dir="ltr"]' ).text().trim(),
            jq_order_info_actions_base = jq_order_info_actions.find( '.yohtmlc-order-level-connections' ),
            order_detail_url = jq_order_info_actions_base.find( 'a.a-link-normal:first' ).attr( 'href' ),
            //order_receipt_url = jq_order_info_actions_base.find( '.hide-if-js a.a-link-normal' ).attr( 'href' ),
            // TODO: '.hide-if-js a.a-link-normal'な要素が無くなっている（2024/11/08）
            // →'.a-declarative[data-action="a-popover"]'のdata-a-popover(JSON)の'url'か、'.a-declarative[data-action="a-popover"] > a.a-link-normal'のhrefから、ポップアップ用のページを取得し、さらに「領収書／購入明細書」のリンクから実際の領収書ページのURLを取得するのが本来の方法だが、処理が煩雑で待ち時間が増える
            // →URLを決め打ち（うまくいかない可能性もある？）
            order_receipt_url = (() => {
                let order_receipt_url = jq_order_info_actions_base.find( '.hide-if-js a.a-link-normal' ).attr( 'href' );
                if (! order_receipt_url) {
                    if (/^D/.test(order_id)) {
                        order_receipt_url = '/gp/digital/your-account/order-summary.html/?print=1&orderID=' + encodeURIComponent(order_id);
                    }
                    else {
                        order_receipt_url = '/gp/css/summary/print.html/ref=oh_aui_ajax_invoice?ie=UTF8&orderID=' + encodeURIComponent(order_id);
                    }
                }
                return order_receipt_url;
            })(),
            jq_cancel_button = jq_delivery_box_list.find( '.a-fixed-right-grid-col.a-col-right .yohtmlc-shipment-level-connections a[role="button"]' ).filter( [
                '[href*="/your-account/order-edit.html"][href*="type=e"]',
                '[href*="/order/edit.html"][href*="useCase=cancel"]',
                '[href*="/ss/help/contact/"][href*="cancelRequest=1"]'
            ].join( ',' ) ),
            jq_order_item_infos = jq_delivery_box_list.find( [
                '.a-fixed-right-grid .a-fixed-right-grid-col.a-col-left > .a-row.a-spacing-top-base .a-fixed-left-grid-col.a-col-right > .a-row',
                '.a-fixed-right-grid .a-fixed-right-grid-col.a-col-left .a-row.a-spacing-top-base .a-fixed-left-grid-col.a-col-right > .a-row:has(.yohtmlc-product-title)',
            ].join(',') ).filter( function () {
                return ( $( this ).find( '.a-button' ).length <= 0 );
            } ).clone(),
            jq_gift_card_recipient_list = jq_order_item_infos.find( '.gift-card-instance .recipient' ),
            recipient_map = {},
            order_shipment_info_text = jq_delivery_box_list.find( '.yohtmlc-shipment-status-primaryText' ).text().trim().replace( /\s+/g, ' ' ),
            order_item_info_text = '',
            search_index_text = '';
        
        if ( ( typeof order_date == 'string' ) && ( order_date.match( /^[^\d]*(\d+)[^\d]+(\d+)[^\d]+(\d+)[^\d]*$/ ) ) ) {
            order_year = parseInt( RegExp.$1, 10 );
            order_month = parseInt( RegExp.$2, 10 );
            order_day = parseInt( RegExp.$3, 10 );
            try {
                if ( ! isNaN( new Date( '' + order_year + '-' + order_month + '-' + order_day ).getTime() ) ) {
                    order_date_info.year = order_year;
                    order_date_info.month = order_month;
                    order_date_info.day = order_day;
                    order_date_info.date = order_day;
                }
            }
            catch ( error ) {
            }
        }
        
        if ( order_date_info.month < 0 ) {
            log_error( '[malformed order date]\n', order_date, '\n', jq_order_date.html() );
            log_info( jq_order.html() );
        }
        
        if ( order_receipt_url ) {
            // /ref=oh_aui_dpi_o*_ になっていると、まれにページが読み込まれないことがある
            // → /ref=oh_aui_ajax_dpi に置換
             order_receipt_url = order_receipt_url.replace( /\/ref=oh_aui_.*?\?/, '/ref=oh_aui_ajax_dpi?' );
        }
        
        //jq_order_item_infos.remove( 'script, noscript' );
        jq_order_item_infos.find( 'script, noscript' ).remove();
        order_item_info_text = zen_to_han( jq_order_item_infos.text().trim().replace( /\s+/g, ' ' ) );
        
        search_index_text = ( order_id + ' ' + order_date + ' ' + order_shipment_info_text + ' ' + order_item_info_text ).toLowerCase();
        
        if ( order_destination ) {
            recipient_map[ order_destination ] = order_destination;
        }
        
        if ( order_destination ) {
            // 商品券タイプのギフト券等でお届け先が存在する場合には重複するため、jq_gift_card_recipient_list（ギフト注文のシリアル番号が入っている）からは探さない
        }
        else {
            // E メールタイプのギフト券等の送信先を取得
            jq_gift_card_recipient_list.each( function() {
                var recipient = $( this ).text().replace( /\s+/, ' ' ).trim();
                
                if ( recipient ) {
                    recipient_map[ recipient ] = recipient;
                }
            } );
        }
        
        individual_order_info = {
            order_date : order_date,
            order_date_info : order_date_info,
            order_price : order_price,
            order_price_number : order_price_number,
            order_destination : order_destination,
            order_id : order_id,
            order_detail_url : order_detail_url,
            order_receipt_url : order_receipt_url,
            is_digital : ( order_receipt_url ) ? /\/gp\/digital\//.test( order_receipt_url ) : /^D/.test( order_id ),
            is_reservation : ( ( 0 < jq_cancel_button.length ) && ( jq_delivery_box_list.length <= jq_cancel_button.length ) ),
            search_index_text : search_index_text,
            recipient_map : recipient_map,
            jq_order : jq_order
        };
        
        return individual_order_info;
    }, // end of get_individual_order_info()
    
    
    get_individual_order_info_common : function ( jq_order, jq_order_info ) {
        var self = this,
            individual_order_info = {},
            jq_order_info_left = jq_order_info.find( '.a-col-left' ),
            // [2022/01/18] プライム・ワードローブ（Prime Try Before You Buy）の場合に日付と価格が正常に取得できず、「Partial order error」表示が出る不具合
            //  通常の注文だと
            //  「注文日」(.a-span3)「合計」(.a-span2)「お届け先」(.a-span4)「注文番号」
            //  となっているところが、プライム・ワードローブ等の場合は
            //  「注文日」(.a-span3)「注文の合計」(.a-span2)「請求の合計」(.a-span3)「お届け先」(.a-span4)「注文番号」
            //  となっているため、状況に応じて場合分けするように修正
            jq_a_span3_list = jq_order_info_left.find( '.a-span3' ),
            jq_order_date = jq_a_span3_list.first().find( '.value' ),
            order_date = jq_order_date.text().trim(),
            order_date_info = { year : -1, month : -1, date : -1 },
            order_year,
            order_month,
            order_day,
            order_price = ( ( 1 < jq_a_span3_list.length ) ? jq_a_span3_list.last() : jq_order_info_left.find( '.a-span2' ).first() ).find( '.value' ).text().trim(),
            order_price_number = ( typeof order_price == 'string' ) ? parseInt( order_price.replace( /[^\d.\-]/g, '' ), 10 ) : 0,
            //order_destination = jq_order_info_left.find( '.recipient .a-size-base a.a-popover-trigger > .trigger-text' ).text().trim(),
            order_destination = jq_order_info_left.find( '.recipient .a-size-base a.a-popover-trigger' ).clone().remove('i').text().trim(), // 「お届け先」がa.a-popover-trigger > span.trigger-text中にある場合とa.a-popover-trigger直下の場合あり
            jq_order_info_actions = jq_order_info.find( '.actions' ),
            order_id = jq_order_info_actions.find( '.a-size-mini .value' ).text().trim(),
            jq_order_info_actions_base = jq_order_info_actions.find( '.a-size-base' ),
            order_detail_url = jq_order_info_actions_base.find( 'a.a-link-normal:first' ).attr( 'href' ),
            //order_receipt_url = jq_order_info_actions_base.find( '.hide-if-js a.a-link-normal' ).attr( 'href' ),
            //[メモ] ここに来た場合は存在するはずだが、念の為決め打ちもできるようにしておく
            order_receipt_url = (() => {
                let order_receipt_url = jq_order_info_actions_base.find( '.hide-if-js a.a-link-normal' ).attr( 'href' );
                if (! order_receipt_url) {
                    if (/^D/.test(order_id)) {
                        order_receipt_url = '/gp/digital/your-account/order-summary.html/?print=1&orderID=' + encodeURIComponent(order_id);
                    }
                    else {
                        order_receipt_url = '/gp/css/summary/print.html/ref=oh_aui_ajax_invoice?ie=UTF8&orderID=' + encodeURIComponent(order_id);
                    }
                }
                return order_receipt_url;
            })(),
            jq_cancel_button = jq_order.find( 'a[role="button"]' ).filter( [
                '[href*="/your-account/order-edit.html"][href*="type=e"]',
                '[href*="/order/edit.html"][href*="useCase=cancel"]',
                '[href*="/ss/help/contact/"][href*="cancelRequest=1"]'
            ].join( ',' ) ),
            //jq_order_details = jq_order.children( '.a-box:not(.order-info)' ),
            jq_order_details = jq_order.children( '.a-box:not(.order-info)' ).filter(function(){return ($(this).find('a[href*="archiveRequest=1"]').length < 1);}),
            //jq_order_shipment_info_container = jq_order_details.find( '.js-shipment-info-container' ).clone(),
            jq_order_shipment_info_container = ( () => {
                let jq_order_shipment_info_container = jq_order_details.filter( '.shipment' );
                if ( jq_order_shipment_info_container.length < 1 ) {
                    //jq_order_shipment_info_container = jq_order_shipment_info_container.find('.js-shipment-info-container') // TODO: ←意味がないな…？
                    jq_order_shipment_info_container = jq_order_details.find('.js-shipment-info-container'); // TODO: こっちでいいのかな…？
                }
                return jq_order_shipment_info_container.clone();
            })(),
            //jq_order_item_infos = jq_order_details.find( '.a-fixed-right-grid .a-fixed-right-grid-col.a-col-left .a-row:first .a-fixed-left-grid-col.a-col-right .a-row:not(:has(.a-button))' ).clone(),
            jq_order_item_infos = jq_order_details.find( '.a-fixed-right-grid .a-fixed-right-grid-col.a-col-left .a-row:first .a-fixed-left-grid-col.a-col-right .a-row' ).filter( function () {
                return ( $( this ).find( '.a-button' ).length <= 0 );
            } ).clone(),
            jq_gift_card_recipient_list = jq_order_item_infos.find( '.gift-card-instance .recipient' ),
            recipient_map = {},
            order_shipment_info_text = '',
            order_item_info_text = '',
            search_index_text = '';
        
        if ( jq_cancel_button.length < 1 ) {
            jq_cancel_button = jq_order_shipment_info_container.find( 'a[role="button"]' ).filter( [
                '[href*="/your-account/order-edit.html"][href*="type=e"]',
                '[href*="/order/edit.html"][href*="useCase=cancel"]',
                '[href*="/ss/help/contact/"][href*="cancelRequest=1"]'
            ].join( ',' ) );
        }
        
        if ( ( typeof order_date == 'string' ) && ( order_date.match( /^[^\d]*(\d+)[^\d]+(\d+)[^\d]+(\d+)[^\d]*$/ ) ) ) {
            order_year = parseInt( RegExp.$1, 10 );
            order_month = parseInt( RegExp.$2, 10 );
            order_day = parseInt( RegExp.$3, 10 );
            try {
                if ( ! isNaN( new Date( '' + order_year + '-' + order_month + '-' + order_day ).getTime() ) ) {
                    order_date_info.year = order_year;
                    order_date_info.month = order_month;
                    order_date_info.day = order_day;
                    order_date_info.date = order_day;
                }
            }
            catch ( error ) {
            }
        }
        
        if ( order_date_info.month < 0 ) {
            log_error( '[malformed order date]\n', order_date, '\n', jq_order_date.html() );
            log_info( jq_order.html() );
        }
        
        if ( order_receipt_url ) {
            // /ref=oh_aui_dpi_o*_ になっていると、まれにページが読み込まれないことがある
            // → /ref=oh_aui_ajax_dpi に置換
             order_receipt_url = order_receipt_url.replace( /\/ref=oh_aui_.*?\?/, '/ref=oh_aui_ajax_dpi?' );
        }
        
        //jq_order_shipment_info_container.remove( 'script, noscript, .a-declarative' );
        jq_order_shipment_info_container.find( 'script, noscript, .a-declarative, .a-button' ).remove();
        order_shipment_info_text = zen_to_han( jq_order_shipment_info_container.find( '.js-shipment-info-container' ).addBack( '.js-shipment-info-container' ).text().trim().replace( /\s+/g, ' ' ) );
        
        //jq_order_item_infos.remove( 'script, noscript' );
        jq_order_item_infos.find( 'script, noscript' ).remove();
        order_item_info_text = zen_to_han( jq_order_item_infos.text().trim().replace( /\s+/g, ' ' ) );
        
        search_index_text = ( order_id + ' ' + order_date + ' ' + order_shipment_info_text + ' ' + order_item_info_text ).toLowerCase();
        
        if ( order_destination ) {
            recipient_map[ order_destination ] = order_destination;
        }
        
        if ( order_destination ) {
            // 商品券タイプのギフト券等でお届け先が存在する場合には重複するため、jq_gift_card_recipient_list（ギフト注文のシリアル番号が入っている）からは探さない
        }
        else {
            // E メールタイプのギフト券等の送信先を取得
            jq_gift_card_recipient_list.each( function() {
                var recipient = $( this ).text().replace( /\s+/, ' ' ).trim();
                
                if ( recipient ) {
                    recipient_map[ recipient ] = recipient;
                }
            } );
        }
        
        individual_order_info = {
            order_date : order_date,
            order_date_info : order_date_info,
            order_price : order_price,
            order_price_number : order_price_number,
            order_destination : order_destination,
            order_id : order_id,
            order_detail_url : order_detail_url,
            order_receipt_url : order_receipt_url,
            is_digital : ( order_receipt_url ) ? /\/gp\/digital\//.test( order_receipt_url ) : /^D/.test( order_id ),
            is_reservation : ( ( 0 < jq_cancel_button.length ) && ( jq_order_details.length <= jq_cancel_button.length ) ),
            search_index_text : search_index_text,
            recipient_map : recipient_map,
            jq_order : jq_order
        };
        
        return individual_order_info;
    }, // end of get_individual_order_info_common()
    
    
    fetch_all_html : function ( url_list, callback ) {
        var self = this,
            
            max_concurrent_number = OPTIONS.MAX_CONCURRENT_FETCH_NUMBER_HISTORY,
            
            loading_dialog = self.loading_dialog.init_counter( url_list.length, 0 ).counter_show(),
            
            _fetch_url = ( url ) => {
                return new Promise( ( resolve, reject ) => {
                    $.ajax( {
                        url : get_absolute_url( url ),
                        type : 'GET',
                        dataType : 'html',
                        headers : { 'Accept' : "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*\/\*;q=0.8" },
                        //beforeSend : function( xhr ) {
                        //    xhr.setRequestHeader( 'X-Requested-With', { toString : function () { return '';} } );
                        //},
                        crossDomain : true
                        // リクエストヘッダに X-Requested-With : XMLHttpRequest が含まれると、Amazon から HTML ではない形式で返されてしまう
                        // → crossDomain を true にして X-Requested-With を送信しないようにする
                        // ※参考: 
                        //   [jquery - can i remove the X-Requested-With header from ajax requests? - Stack Overflow](https://stackoverflow.com/questions/3372962/can-i-remove-the-x-requested-with-header-from-ajax-requests)
                        //   [javascript - jQueryのcrossDomainオプションが効かない - スタック・オーバーフロー](https://ja.stackoverflow.com/questions/5406/jquery%E3%81%AEcrossdomain%E3%82%AA%E3%83%97%E3%82%B7%E3%83%A7%E3%83%B3%E3%81%8C%E5%8A%B9%E3%81%8B%E3%81%AA%E3%81%84)
                    } )
                    .done( ( html, textStatus, jqXHR ) => {
                        loading_dialog.counter_increment();
                        
                        resolve( {
                            url : url,
                            success : true,
                            html : html,
                            textStatus : textStatus,
                            jqXHR : jqXHR
                        } );
                    } )
                    .fail( ( jqXHR, textStatus, errorThrown ) => {
                        // TODO: HTML 取得に失敗することがあるらしい(バージョン 0.1.0.12にて発生報告有り)
                        // →当該 URL について、エラー確認用出力追加＆とりあえず無視する
                        log_error( '[Fetch Failure]\n', url, '\n', jqXHR.status, jqXHR.statusText );
                        try {
                            log_info( '[Header]\n', jqXHR.getAllResponseHeaders() );
                            log_debug( jqXHR.responseText );
                        }
                        catch ( error ) {
                        }
                        
                        loading_dialog.counter_increment();
                        
                        reject( {
                            url : url,
                            success : false,
                            html : '',
                            textStatus : textStatus,
                            jqXHR : jqXHR
                        } );
                    } );
                } );
            },
            
            use_ajax = false;
        
        // TODO: 2020/09半ばより、環境によっては注文履歴が暗号化されて含まれるようになった（デコード方法が不明）
        // → 暗号化されている場合には、IFRAMEを用いた方法に変更（ただし、パフォーマンスが落ちてしまう）
        var test_url = get_absolute_url( url_list[ 0 ] );
        
        $.ajax( {
            url : test_url,
            type : 'GET',
            dataType : 'html',
            headers : { 'Accept' : "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*\/\*;q=0.8" },
            crossDomain : true,
        } )
        .done( ( html, textStatus, jqXHR ) => {
            const
                test_url_object = new URL(test_url);
            
            if ( (test_url_object.pathname == '/your-orders/orders') && test_url_object.searchParams.has('disableCsd') ) {
                // [備忘] パラメータ"disableCsd=missing-library"の付加で（例: /your-orders/orders?_encoding=UTF8&disableCsd=missing-library&ref_=ppx_yo2ov_dt_b_pagination_1_1&startIndex=0）暗号化されないページを取得できそう？(2025/02)
                const
                    jq_html_fragment = get_jq_html_fragment( html ),
                    //shipping_address_elements = jq_html_fragment.find( '[id^="shipToInsertionNode-shippingAddress"]' ),
                    // TODO: [2024/02] 「お届け先」も秘匿化されるケースがある（その際、注文内容の暗号化は必ずしも行われない模様）
                    // → [2025/02] 単にidで検索して置換している模様→analyze_order_information()内に復元処理追加
                    encrypted_elements = jq_html_fragment.find( '.csd-encrypted-sensitive' );
                
                if ( encrypted_elements.length <= 0 ) {
                    use_ajax = true;
                }
                else {
                    use_ajax = false;
                    log_debug( 'encrypted elements found' );
                }
            }
            else {
                use_ajax = false; // 常にIFRAMEを使用する方法で取得（ただし遅い）
            }
        } )
        .fail( ( jqXHR, textStatus, errorThrown ) => {
            log_error( '[Fetch Failure]\n', test_url, '\n', jqXHR.status, jqXHR.statusText );
            use_ajax = false;
        } )
        .always( () => {
            if ( use_ajax ) {
                log_info( '[*] Fetch order history via Ajax' );
            }
            else {
                log_info( '[*] Fetch order history via IFRAME' );
                var _callback_map = {},
                    _url_map = {};
                
                _fetch_url = ( url ) => {
                    return new Promise( ( resolve, reject ) => {
                        var check_timeout = 120000, // [2024/02/06] 6000→120000
                            
                            start_time = Date.now(),
                            
                            child_window_options = {
                                is_iframe : true,
                                open_parameters : {
                                    type : 'ORDER_HISTORY_PART',
                                    request_page_url : url,
                                    parent_page_url : location.href,
                                }
                            },
                            
                            child_window = open_child_window( url, child_window_options ),
                            child_window_id = child_window_options.open_parameters.child_window_id,
                            iframe = child_window_options.result_info.iframe,
                            
                            timeout_time_id = setTimeout( () => {
                                log_error( '[Fetch Failure] Timeout:', url );
                                _callback_map[ child_window_id ] = null;
                                iframe.remove(); iframe = null;
                                loading_dialog.counter_increment();
                                
                                reject( {
                                    url : url,
                                    success : false,
                                    html : '',
                                    textStatus : 'Timeout',
                                } );
                                
                            }, check_timeout );
                        
                        delete child_window_options.result_info.iframe;
                        delete child_window_options.result_info;
                        
                        log_debug( '_fetch_url() start:', url );
                        
                        _url_map[ child_window_id ] = get_absolute_url( url );
                        
                        _callback_map[ child_window_id ] = ( result ) => {
                            log_debug( '_fetch_url() end:', Date.now() - start_time, 'ms', url, result );
                            clearTimeout( timeout_time_id );
                            _callback_map[ child_window_id ] = null;
                            iframe.remove(); iframe = null;
                            loading_dialog.counter_increment();
                            
                            resolve( {
                                url : url,
                                success : true,
                                html : result.html,
                                textStatus : 'OK',
                            } );
                        };
                        
                    } );
                };
                
                $( window ).on( 'message', function ( jq_event ) {
                    var event = jq_event.originalEvent,
                        child_window_id = event.data.child_window_id;
                    
                    log_debug( 'message received: event=', event );
                    
                    if ( event.origin != get_origin_url( _url_map[ child_window_id ] ) ) {
                        log_error( 'origin error:', event.origin, ' vs ', get_origin_url( _url_map[ child_window_id ] ), _url_map[ child_window_id ] );
                        return;
                    }
                    
                    var callback = _callback_map[ child_window_id ];
                    
                    if ( callback ) {
                        callback( event.data );
                    }
                } );
            }
            
            var promise_functions = url_list.map( ( url ) => _fetch_url.bind( self, url ) );
            
            window.concurrent_promise.execute( promise_functions, max_concurrent_number )
            .then( ( result_info ) => {
                var fetch_result_list = result_info.success_list.map( worker => worker.result ),
                    fetch_failure_list = result_info.failure_list.map( worker => worker.result );
                
                log_debug( 'fetch_all_html() url_list:', url_list );
                log_debug( 'result_info:', result_info );
                log_debug( 'fetch_result_list:', fetch_result_list );
                log_debug( 'fetch_failure_list:', fetch_failure_list );
                
                $( window ).off( 'message' );
                
                callback( {
                    success : true,
                    fetch_result_list : fetch_result_list,
                    fetch_failure_list : fetch_failure_list,
                } );
            } )
            .catch( ( result_info ) => {
                // ※ここには入らないはず
                log_error( '*** [BUG] ***\n', result_info );
                
                $( window ).off( 'message' );
                
                callback( {
                    success : false,
                    error_message : 'Fetch Failure',
                } );
            } );
        } );
        
        return self;
    }, // end of fetch_all_html()
    
    
    get_text_filter_info : function () {
        var self = this,
            is_type_or = false,
            keyword_string = zen_to_han( self.jq_input_text_filter.val().replace( /\s+/, ' ' ) ).trim(),
            filter_keywords = keyword_string.split( /\s+OR\s+(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/ ),
            text_filter_info = {};
        
        if ( 1 < filter_keywords.length ) {
            is_type_or = true;
        }
        else {
            is_type_or = false;
            filter_keywords = keyword_string.split( /\s+(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/ );
        }
        
        filter_keywords  = filter_keywords
            .map( function ( filter_keyword ) {
                return filter_keyword.replace( /(?:^"|"$)/g, '' ).trim().toLowerCase();
            } )
            .filter( function ( filter_keyword ) {
                return ( filter_keyword != '' );
            } );
        
        text_filter_info = {
            keyword_string : keyword_string,
            is_type_or : is_type_or,
            filter_keywords : filter_keywords
        };
        
        return text_filter_info;
    }, // end of get_text_filter_info()
    
    
    check_text_filter_is_hit : function ( search_index_text, text_filter_info ) {
        var self = this,
            is_hit = false;
        
        if ( text_filter_info.filter_keywords.length <= 0 ) {
            return true;
        }
        
        if ( text_filter_info.is_type_or ) {
            $.each( text_filter_info.filter_keywords, function ( index, filter_keyword ) {
                if ( 0 <= search_index_text.indexOf( filter_keyword ) ) {
                    is_hit = true;
                    
                    return false;
                }
            } );
        }
        else {
            is_hit = true;
            
            $.each( text_filter_info.filter_keywords, function ( index, filter_keyword ) {
                if ( search_index_text.indexOf( filter_keyword ) < 0 ) {
                    is_hit = false;
                    
                    return false;
                }
            } );
        }
        return is_hit;
    }, // end of check_text_filter_is_hit()
    
    
    open_order_receipts_for_print : function ( is_digital ) {
        var self = this,
            order_information = self.order_information,
            current_order_info_list = order_information.current_order_info_list,
            order_urls = [],
            order_detail_urls = [],
            show_print_dialog = true;
        
        current_order_info_list.forEach( function ( order_info ) {
            var order_receipt_url = order_info.order_receipt_url;
            
            if ( ! order_receipt_url ) {
                return;
            }
            
            if ( is_digital ^ order_info.is_digital ) {
                return;
            }
            
            order_urls.push( order_receipt_url );
            order_detail_urls.push( order_info.order_detail_url );
        } );
        
        if ( order_urls.length <= 0 ) {
            return self;
        }
        
        order_urls.reverse();
        order_detail_urls.reverse();
        
        var first_order_url = order_urls.shift();
       
        open_child_window( self.get_signin_url( first_order_url ), {
            open_parameters : {
                is_digital : is_digital,
                target_period : self.target_period,
                target_month : self.target_month,
                target_destination : self.target_destination,
                target_keyword_string : self.target_keyword_string,
                target_keyword_is_ruled_out : self.target_keyword_is_ruled_out,
                first_order_url : first_order_url,
                additional_order_urls : order_urls,
                order_detail_urls : order_detail_urls,
                show_print_dialog : show_print_dialog
            }
        } );
        
        return self;
    }, // end of open_order_receipts_for_print()
    
    
    open_order_receipts_for_print_digital : function () {
        return this.open_order_receipts_for_print( true );
    }, // end of open_order_receipts_for_print_digital()
    
    
    open_order_receipts_for_print_nondigital : function () {
        return this.open_order_receipts_for_print( false );
    }, // end of open_order_receipts_for_print_nondigital()
    
    
    // 領収書読込中に認証を要求されてしまう場合がある
    // → 開始時に予め強制的に認証させる
    // ※参考：[Final: OpenID Provider Authentication Policy Extension 1.0](http://openid.net/specs/openid-provider-authentication-policy-extension-1_0.html#anchor8)
    get_signin_url : ( function () {
        var signin_base_url = [
                'https://www.amazon.co.jp/ap/signin?_encoding=UTF8',
                'accountStatusPolicy=P1',
                'showRmrMe=1',
                'openid.assoc_handle=jpflex',
                'openid.claimed_id=' + encodeURIComponent( 'http://specs.openid.net/auth/2.0/identifier_select' ),
                'openid.identity=' + encodeURIComponent( 'http://specs.openid.net/auth/2.0/identifier_select' ),
                'openid.mode=checkid_setup',
                'openid.ns=' + encodeURIComponent( 'http://specs.openid.net/auth/2.0' ),
                'openid.ns.pape=' + encodeURIComponent( 'http://specs.openid.net/extensions/pape/1.0' ),
                'openid.pape.max_auth_age=0', // 認証有効時間(秒)（元の値は 900 → 0 の場合、強制的に認証用のログイン画面が開く）
                'openid.return_to='
            ].join( '&' );
        
        return function ( return_to_url ) {
            var signin_page_url = signin_base_url + encodeURIComponent( get_absolute_url( return_to_url ) );
            
            log_debug( '** signin_page_url =', signin_page_url );
            
            return signin_page_url;
        };
    } )() // end of get_signin_url()

}; // end of TemplateOrderHistoryFilter


var TemplateReceiptOutputPage = {
    timeout_ms : 180000,
    limit_parallel_request_number : OPTIONS.MAX_CONCURRENT_FETCH_NUMBER_RECEIPT,
    
    jq_header_template : $( '<h2 class="receipt noprint"><a/></h2>' ),
    jq_hr_template : $( '<hr class="receipt"/>' ),
    
    csv_header_columns : [ "注文日", "注文番号", "商品名", "付帯情報", "価格", "個数", "商品小計", "注文合計", "お届け先", "状態", "請求先", "請求額", "クレカ請求日", "クレカ請求額", "クレカ種類", "注文概要URL", "領収書URL", "商品URL" ],
    
    refund_csv_header_columns : [ "注文日", "注文番号", "返金日", "返金額", "返金先", "クレカ種類", "備考", "注文概要URL", "領収書URL", "返金明細書URL" ],
    
    
    init : function ( open_parameters ) {
        var self = this,
            
            request_order_urls = self.request_order_urls = [ open_parameters.first_order_url ].concat( open_parameters.additional_order_urls ),
            order_detail_urls = self.order_detail_urls = open_parameters.order_detail_urls,
            display_complete_index = self.display_complete_index = -1,
            max_receipt_number = self.max_receipt_number = request_order_urls.length,
            
            loading_dialog = self.loading_dialog = object_extender( TemplateLoadingDialog ).init( {
                counter_required : true,
                max_number : max_receipt_number
            } ).show(),
            
            jq_body = self.jq_body = $( 'body' ),
            
            url_to_page_info = self.url_to_page_info = {},
            
            addressee = get_value( SCRIPT_NAME + '-addressee' ),
            
            process_controller = self.process_controller = new class {
                constructor() {
                    this.reset();
                    this._AbortException = class extends DOMException {
                        constructor( message = 'The user aborted a request.', ...params ) {
                            super( message, 'AbortError', ...params );
                        }
                    };
                }
                
                get is_canceled() {
                    return this._is_canceled;
                }
                
                get abort_signal() {
                    return this._abort_signal;
                }
                
                reset() {
                    this._abort_controller = new AbortController();
                    this._abort_signal = this._abort_controller.signal;
                    this._is_canceled = false;
                }
                
                cancel() {
                    this._is_canceled = true;
                    this._abort_controller.abort();
                }
                
                abort_exception( message ) {
                    return new this._AbortException( message );
                }
                
                abort_if_canceled( message ) {
                    if ( this.is_canceled ) {
                        throw this.abort_exception( message );
                    }
                }
            }();
        
        if ( OPTIONS.ADDRESSEE_CHANGEABLE ) {
            self.addressee = ( addressee ) ? addressee : '';
        }
        
        self.open_parameters = open_parameters;
        self.result_waiting_counter = max_receipt_number;
        
        self.is_timeout = false;
        self.signin_request = false;
        
        self.jq_csv_download_link = null;
        self.jq_refund_csv_download_link = null;
        
        $( '<style type="text/css"/>' )
            .text( [
                'h2.receipt a {font-size:14px;}',
                '@media print {',
                '  .noprint {display: none;}',
                '  hr.receipt {page-break-after: always; margin: 0 0 0 0; padding: 0 0 0 0; height: 0; border: none; visibility: hidden;}',
                '}',
                'td.addressee-container {position: relative;}',
                'div.addressee {position: absolute; width: 200%; bottom: 3px; right: 16px; font-size: 14px; text-align: right;}',
                'div.addressee.digital {bottom: 6px; right: 24px; font-size: 16px;}',
                '#navFooter {display: none;}',
            ].join( '\n' ) )
            .appendTo( $( 'head' ) );
        
        self.create_jq_header( 1, open_parameters.first_order_url ).prependTo( jq_body );
        
        $( window ).on( 'message', function ( event ) {
            self.on_receive_message( event );
        } );
        
        var promise_functions = [
                // 現在のページの描画待ち
                () => {
                    return new Promise( ( resolve, reject ) => {
                        wait_for_rendering( function ( result ) {
                            self.on_rendering_complete( result.html );
                            resolve( 'The first page has been rendered.' );
                        }, {
                            is_digital : open_parameters.is_digital,
                        } );
                    } );
                }
            ].concat(
                // 領収書を IFRAME 経由で取得
                request_order_urls.map( ( request_order_url, index ) => self.call_by_iframe.bind( self, request_order_url, order_detail_urls[ index ], 1 + index ) )
            );
        
        window.concurrent_promise.execute( promise_functions, self.limit_parallel_request_number )
        .then( ( result_info ) => {
            log_debug( 'TemplateReceiptOutputPage#init()', result_info );
            
            if ( self.is_timeout || self.signin_request ) {
                self.loading_dialog.hide();
                
                if ( confirm( self.is_timeout ? OPTIONS.RECEIPT_READ_TIMEOUT_MESSAGE : OPTIONS.LOGIN_REQUIRED_MESSAGE ) ) {
                    //window.location.reload( true );
                    var replace_url = open_parameters.first_order_url;
                    
                    log_info( 'Transitions to URL:', replace_url );
                    window.location.replace( replace_url );
                    return;
                }
                //return;
            }
            
            self.finish();
        } )
        .catch( ( result_info ) => {
            // ※ここには入らないはず
            log_error( '*** [BUG] ***\n', result_info );
            
            self.loading_dialog.hide();
            
            alert( 'Sorry, there was an unexpected bug.' );
        } );
        
        return self;
    }, // end of init()
    
    
    create_jq_header : function ( receipt_number, receipt_url ) {
        var self = this,
            jq_header = self.jq_header_template.clone(),
            jq_link = jq_header.find( 'a' ).attr( {
                'href' : receipt_url,
                'target' : '_blank'
            } ).text( 'No. ' + receipt_number + ' / ' + self.max_receipt_number );
        
        return jq_header;
    }, // end of create_jq_header()
    
    
    insert_jq_addressee : function ( jq_receipt_body ) {
        var self = this;
        
        if ( ! OPTIONS.ADDRESSEE_CHANGEABLE ) {
            return self;
        }
        
        //var jq_addressee_container = jq_receipt_body.find( 'table:first td[align="right"]:first:has(b:contains("様"))' );
        var jq_addressee_container = jq_receipt_body.find( 'table:first td[align="right"]:first' ).filter( function () {
            return ( 0 <= $( this ).find( 'b' ).text().indexOf( '様' ) );
        } );
        
        if ( jq_addressee_container.length <= 0 ) {
            return self;
        }
        
        var jq_addressee = $( '<div class="addressee"/>' );
        
        if ( self.open_parameters.is_digital ) {
            jq_addressee.addClass( 'digital' );
        }
        
        if ( self.addressee ) {
            jq_addressee.text( self.addressee );
        }
        
        jq_addressee_container
            .addClass( 'addressee-container' )
            .append( jq_addressee );
        
        return self;
    }, // end of create_jq_addressee()
    
    
    create_jq_receipt_body : function ( html, receipt_number, receipt_url ) {
        var self = this,
            jq_receipt_body = $( '<div/>' );
        
        jq_receipt_body
            .html( html )
            .prepend( self.create_jq_header( receipt_number, receipt_url ) )
            .prepend( self.jq_hr_template.clone() );
        
        self.insert_jq_addressee( jq_receipt_body );
        
        return jq_receipt_body;
    }, // end of create_jq_receipt_body()
    
    
    update_display_page_body : function () {
        var self = this,
            request_order_urls = self.request_order_urls,
            url_to_page_info = self.url_to_page_info,
            jq_body = self.jq_body,
            display_complete_index = self.display_complete_index;
        
        for ( var index = display_complete_index + 1; index < request_order_urls.length; index++ ) {
            var order_url = request_order_urls[ index ],
                page_info = url_to_page_info[ order_url ];
            
            if ( ( ! page_info ) || ( ! page_info.jq_receipt_body ) ) {
                break;
            }
            if ( 0 < index ) {
                jq_body.append( page_info.jq_receipt_body.children() );
            }
            delete page_info.jq_receipt_body;
            delete page_info.html;
            page_info.display_complete = true;
            display_complete_index = index;
        }
        self.display_complete_index = display_complete_index;
    }, // update_display_page_body()
    
    
    call_by_iframe : function ( request_order_url, order_detail_url, receipt_number ) {
        var self = this;
        
        return new Promise( ( resolve, reject ) => {
            var process_controller = self.process_controller,
                abort_signal = process_controller.abort_signal,
                
                page_info = self.url_to_page_info[ request_order_url ] = {
                    receipt_number : receipt_number,
                    order_url : request_order_url,
                    order_detail_url : order_detail_url,
                    resolve : resolve,
                    reject : reject,
                    display_complete : false,
                },
                
                call_reject = ( error_info, error_message ) => {
                    page_info.error_info = error_info;
                    
                    var html = get_error_html( error_message );
                    
                    page_info.html = html;
                    page_info.jq_receipt_body = self.create_jq_receipt_body( html, page_info.receipt_number, request_order_url );
                    page_info.order_parameters = null;
                    
                    self.update_display_page_body();
                    
                    self.loading_dialog.counter_increment();
                    self.result_waiting_counter --;
                    
                    reject( page_info );
                };
            
            if ( process_controller.is_canceled ) {
                call_reject(
                    process_controller.abort_exception(),
                    'Request has been canceld.'
                );
                return;
            }
            
            var child_window_options = {
                    is_iframe : true,
                    open_parameters : {
                        first_order_url : self.open_parameters.first_order_url,
                        request_order_url : request_order_url,
                        order_detail_url : order_detail_url,
                        is_digital : self.open_parameters.is_digital
                    }
                },
                
                child_window = open_child_window( request_order_url, child_window_options ),
                
                iframe = child_window_options.result_info.iframe,
                
                timeout_timer_id = setTimeout( () => {
                    self.is_timeout = true;
                    timeout_timer_id = null;
                    remove_event_listener();
                    
                    //process_controller.cancel();
                    
                    call_reject(
                        new DOMException( 'Receipt read timeout', 'TimeoutError' ),
                        'Receipt read timeout.'
                    );
                }, self.timeout_ms ),
                
                remove_event_listener = () => {
                    if ( timeout_timer_id ) {
                        clearTimeout( timeout_timer_id );
                        timeout_timer_id = null;
                    }
                    abort_signal.removeEventListener( 'abort', on_abort );
                    
                    //remove_child_window_iframe( child_window );
                    // TODO: child_window.name にアクセスした際、Uncaught TypeError: no access エラーになるケース有り
                    iframe.remove(); iframe = null;
                    delete page_info.child_window;
                    delete page_info.remove_event_listener;
                },
                
                on_abort = ( event ) => {
                    remove_event_listener();
                    
                    call_reject(
                        process_controller.abort_exception(),
                        'Request has been canceld.'
                    );
                };
            
            delete child_window_options.result_info.iframe;
            delete child_window_options.result_info;
            
            Object.assign( page_info, {
                child_window : child_window,
                remove_event_listener : remove_event_listener,
            } );
            
            abort_signal.addEventListener( 'abort', on_abort );
        } );
    }, // end of call_by_iframe()
    
    
    on_rendering_complete : function ( html ) {
        var self = this,
            open_parameters = self.open_parameters,
            jq_body = self.jq_body;
        
        log_debug( '*** on_rendering_complete: result_waiting_counter=', self.result_waiting_counter );
        
        self.result_waiting_counter --;
        
        if ( OPTIONS.REMOVE_REISSUE_STRINGS ) {
            var jq_receipt_header = jq_body.find( 'b.h1' ),
                jq_reissue_receipt_date_label = jq_body.find( 'table:first table[align="center"]:first td[valign="top"][align="left"]:first b' );
            
            jq_receipt_header.text( jq_receipt_header.text().replace( /（再発行）/, '' ) );
            jq_reissue_receipt_date_label.text( jq_reissue_receipt_date_label.text().replace( /^再/, '' ) );
        }
        
        self.insert_jq_addressee( jq_body );
        
        return self;
    }, // end of on_rendering_complete()
    
    
    on_receive_message : function ( jq_event ) {
        var self = this,
            event = jq_event.originalEvent,
            url_to_page_info = self.url_to_page_info;
        
        log_debug( '*** on_receive_message: result_waiting_counter=', self.result_waiting_counter, 'event=', event );
        
        if ( event.origin != get_origin_url() ) {
            log_error( 'origin error:', event.origin );
            return;
        }
        
        var error = event.data.error,
            signin_request = event.data.signin_request,
            request_order_url = event.data.request_order_url,
            page_info = self.url_to_page_info[ request_order_url ];
        
        if ( ! page_info ) {
            return;
        }
        
        if ( self.process_controller.is_canceled ) {
            return;
        }
        
        if ( typeof page_info.remove_event_listener != 'function' ) {
            log_info( 'pageinfo.remove_event_listener() not found (it has probably already been completed): page_info=', page_info );
            return;
        }
        
        page_info.remove_event_listener();
        
        page_info.html = event.data.html;
        page_info.jq_receipt_body = self.create_jq_receipt_body( event.data.html, page_info.receipt_number, request_order_url );
        
        if ( event.data.error ) {
            page_info.order_parameters = null;
        }
        else {
            try {
                page_info.order_parameters = self.get_order_parameters( page_info.jq_receipt_body, event.data.order_detail_page_info );
            }
            catch ( error ) {
                log_error( 'on_receive_message():', error, page_info.jq_receipt_body, event.data.order_detail_page_info );
                page_info.order_parameters = null;
            }
        }
        
        self.update_display_page_body();
        
        self.loading_dialog.counter_increment();
        self.result_waiting_counter --;
        
        if ( event.data.error ) {
            log_error( event.data.error_message );
            
            if ( event.data.signin_request ) {
                log_error( 'sign-in required' );
                
                page_info.error_info = new DOMException( event.data.error_message, 'NotAllowedError' );
                
                self.signin_request = true;
                self.process_controller.cancel();
            }
            else {
                page_info.error_info = new DOMException( event.data.error_message, 'UnknownError' );
            }
            page_info.reject( page_info );
        }
        else {
            page_info.resolve( page_info );
        }
        
        return self;
    }, // end of on_receive_message()
    
    
    finish :  function () {
        var self = this,
            open_parameters = self.open_parameters,
            
            jq_body = self.jq_body,
            jq_toolbox = $( '<div class="toolbox noprint"/>' ).css( {
                'position' : 'fixed',
                'top' : '8px',
                'right' : '8px',
                'z-index' : '100',
                'background' : 'rgba( 255, 255, 224, 0.5 )',
                'padding' : '4px'
            } ).appendTo( jq_body ),
            
            url_to_page_info = self.url_to_page_info,
            refund_info_container_list = self.refund_info_container_list = [];
        
        self.update_display_page_body();
        
        self.request_order_urls.forEach( function ( order_url, index ) {
            var page_info = url_to_page_info[ order_url ];
            
            try {
                if ( 0 < page_info.order_parameters.order_detail_page_info.refund_info.refund_list.length ) {
                    refund_info_container_list.push( {
                        refund_info : page_info.order_parameters.order_detail_page_info.refund_info,
                        page_info : page_info,
                        order_parameters : page_info.order_parameters
                    } );
                }
            }
            catch ( error ) {
            }
            
            /*
            //if ( 0 < index ) {
            //    jq_body.append( page_info.jq_receipt_body.children() );
            //}
            */
        } );
        
        self.create_csv_download_button( jq_toolbox );
        self.create_refund_csv_download_button( jq_toolbox );
        self.create_change_addressee_button( jq_toolbox );
        self.create_print_preview_button( jq_toolbox );
        
        self.loading_dialog.hide();
        
        if ( open_parameters.show_print_dialog ) {
            if ( OPTIONS.OPEN_PRINT_DIALOG_AUTO ) {
                window.print();
            }
        }
        
        return self;
    }, // end of finish()
    
    
    get_order_parameters : function ( jq_receipt_body, order_detail_page_info ) {
        var self = this,
            order_parameters = {};
        
        if ( self.open_parameters.is_digital ) {
            order_parameters = self.get_order_parameters_digital( jq_receipt_body, order_detail_page_info.item_info_list );
        }
        else {
            if ( 0 < jq_receipt_body.find( '#pos_view_content' ).length ) {
                order_parameters = self.get_order_parameters_nondigital(
                    jq_receipt_body,
                    order_detail_page_info.order_parameters
                );
            }
            else {
                order_parameters = self.get_order_parameters_nondigital_legacy(
                    jq_receipt_body,
                    order_detail_page_info.item_info_list
                );
            }
        }
        
        order_parameters.order_detail_page_info = order_detail_page_info;
        
        log_debug( 'get_order_parameters()', order_parameters );
        
        return order_parameters;
    }, // end of get_order_parameters()
    
    
    get_order_parameters_digital : function ( jq_receipt_body, item_info_list ) {
        var self = this,
            order_parameters = {},
            order_date = '',
            order_id = '',
            item_list = [],
            other_price_info_list = [],
            order_subtotal_price = '',
            order_total_price = '',
            order_destination = '',
            order_status = '',
            order_billing_amount = '',
            order_billing_destination = '',
            card_info = {
                card_type : '',
                card_billing_date : '',
                card_billing_amount : ''
            },
            order_url = '',
            receipt_url = '',
            
            jq_order_summary = jq_receipt_body.find( '.orderSummary:first' ),
            jq_order_summary_header = jq_order_summary.find( 'table:eq(0)' ),
            jq_order_summary_content = jq_order_summary.find( 'table.sample' );
        
        /*
        //order_date = get_formatted_date_string( get_child_text_from_jq_element( jq_order_summary_header.find( 'td:has(b:contains("注文日")):first' ) ) );
        //order_id = get_child_text_from_jq_element( jq_order_summary_header.find( 'td:has(b:contains("注文番号")):first' ) );
        */
        order_date = get_formatted_date_string( get_child_text_from_jq_element(
            jq_order_summary_header.find( 'td' ).filter( function () {
                return ( 0 <= $( this ).find( 'b' ).text().indexOf( '注文日' ) );
            } ).first()
        ) );
        order_id = get_child_text_from_jq_element( 
            jq_order_summary_header.find( 'td' ).filter( function () {
                return ( 0 <= $( this ).find( 'b' ).text().indexOf( '注文番号' ) );
            } ).first()
        );
        
        jq_order_summary_content.find( 'table table tr:gt(0)' ).each( function () {
            var jq_item = $( this ),
                /*
                jq_item_info = jq_item.find( 'td[align="left"]' ),
                jq_item_price = jq_item.find( 'td[align="right"]' );
                */
                // 2020/10初旬頃から微妙に変更があった模様
                jq_item_info = jq_item.find( '> td:eq(0)' ),
                jq_item_price = jq_item.find( '> td:eq(1)' );
            
            if ( ( jq_item_info.length <= 0 ) || ( jq_item_price.length <= 0 ) ) {
                return;
            }
            
            var jq_item_name = jq_item_info.find( 'b:first' ),
                jq_item_link = jq_item_name.find( 'a' );
            
            item_list.push( {
                name : jq_item_name.text().trim(),
                remarks : get_child_text_from_jq_element( jq_item_info ),
                price : get_price_number( get_child_text_from_jq_element( jq_item_price ) ),
                number : 1,
                url : ( 0 < jq_item_link.length ) ? get_absolute_url( jq_item_link.attr( 'href' ) ) : ''
            } );
        } );
        
        /*
        //order_subtotal_price = get_price_number( get_child_text_from_jq_element( jq_order_summary_content.find( 'tr:last td[colspan][align="right"]:contains("商品小計")' ) ) );
        */
        // 2020/10初旬頃から微妙に変更があった模様
        order_subtotal_price = get_price_number( get_child_text_from_jq_element( jq_order_summary_content.find( 'tr:last td[colspan].a-text-right:contains("商品小計")' ) ) );
        order_total_price = get_price_number( get_child_text_from_jq_element( jq_order_summary_header.find( 'b:contains("注文の合計")' ) ) );
        
        var jq_payment_summary,
            jq_payment_summary_price_infos;
        
        jq_payment_summary = jq_receipt_body.find( '[data-pmts-component-id][class*="-root-"]' );
        
        if ( 0 < jq_payment_summary.length ) {
            // 2020/09頃からフォーマットが変わった模様
            // - 2020/04頃以降の、これまで入っていた<!-- BEGIN ViewPaymentPlanSummary WIDGET -->ものもこちらに置き換わっている？
            // - ポイントで購入したものの明細が無くなっている？
            var card_type_list = [];
            
            jq_payment_summary.find( '.pmts-payment-instrument-billing-address .pmts-payments-instrument-details ul li.pmts-payments-instrument-detail-box-paystationpaymentmethod' ).each( function () {
                var jq_li = $( this ),
                    jq_card_img = jq_li.find( '.pmts-payment-credit-card-instrument-logo' ),
                    text = jq_li.text().trim();
                
                if ( 0 < jq_card_img.length ) {
                    card_type_list.push( jq_card_img.attr( 'alt' ) + ' ' + text );
                }
                // 2020.09.29: Amazonポイントが再び明細に反映されるようになったため、（注意をうながす目的で記載していた）『クレカ種類』欄からは削除
                /*
                //else if ( /Amazon\s*ポイント/.test( text ) ) {
                //    card_type_list.push( text );
                //}
                */
            } );
            
            card_info.card_type = card_type_list.join( '\n' );
            card_info.card_billing_amount = get_price_number( jq_payment_summary.find( '.pmts-amount-breakdown .pmts-grand-order-total .a-span-last' ).text() );
            order_billing_destination = jq_payment_summary.find( '.pmts-billing-address-details ul li.pmts-billing-address-fullname' ).text().trim();
            
            //order_billing_amount = get_price_number( jq_payment_summary.find( '.pmts-amount-breakdown .pmts-amount-breakdown-sub-totals .a-span-last' ).text() );
            order_billing_amount = card_info.card_billing_amount;
            
            jq_payment_summary.find( '.pmts-amount-breakdown .pmts-amount-breakdown-sub-totals' ).each( function () {
                var jq_price_info = $( this ),
                    jq_price_info_columns = jq_price_info.find( 'div.a-column' ),
                    jq_price_info_name = jq_price_info_columns.eq( 0 ),
                    jq_price_info_price = jq_price_info_columns.eq( 1 ),
                    name = jq_price_info_name.text().trim().replace( /(?:の金額)?[：:]+\s*$/g, '' ),
                    price = get_price_number( jq_price_info_price.text() );
                
                if ( ( ! name ) || ( price === '' ) ) return;
                
                if ( /(?:小|合|総|)計/.test( name ) ) return;
                
                other_price_info_list.push( {
                    name : name,
                    price : price
                } );
            } );
            
            log_debug( 'order_billing_amount:', order_billing_amount,  'card_info.card_billing_amount:', card_info.card_billing_amount, 'card_info.card_type:', card_info.card_type, 'order_billing_destination:', order_billing_destination );
        }
        else {
            jq_payment_summary = jq_receipt_body.children( 'table.sample' ).find( '#docs-order-summary-payment-breakdown-container' );
            
            if ( 0 < jq_payment_summary.length  ) {
                // 新しい(2014/04頃以降の)ものは、<!-- BEGIN ViewPaymentPlanSummary WIDGET --> というマークが入っている
                // ※ Amazonアプリストアなど、一部旧式のままのものもある模様
                
                order_billing_amount = get_price_number( get_child_text_from_jq_element( jq_payment_summary.find( '.pmts-summary-preview-single-item-total .a-color-price' ) ) );
                
                jq_payment_summary_price_infos = jq_payment_summary.find( '.pmts-summary-preview-single-item-amount' );
                
                jq_payment_summary_price_infos.each( function () {
                    var jq_price_info = $( this ),
                        jq_price_info_columns = jq_price_info.find( 'div.a-column' ),
                        jq_price_info_name = jq_price_info_columns.eq( 0 ),
                        jq_price_info_price = jq_price_info_columns.eq( 1 ),
                        name = jq_price_info_name.text().trim().replace( /(?:の金額)?[：:]+\s*$/g, '' ),
                        price = get_price_number( jq_price_info_price.text() );
                    
                    if ( price === '' ) {
                        return;
                    }
                    
                    if ( /(?:小|合|総|)計/.test( name ) ) {
                        return;
                    }
                    
                    other_price_info_list.push( {
                        name : name,
                        price : price
                    } );
                } );
                
                var jq_card_type = jq_payment_summary.find( 'table.pmts_payment_method_table .pmts_view_payment_plan_payment_method .pmts-aui-account-number-display:last .pmts-inst-tail' );
                
                card_info.card_type = jq_card_type.text().trim();
                card_info.card_billing_amount = get_price_number( get_child_text_from_jq_element( jq_card_type.parents( 'tr:first' ).find( '.pmts_view_payment_plan_payment_method_coverage_amount' ) ) );
                order_billing_destination = get_child_text_from_jq_element( jq_payment_summary.find( '.pmts_billing_address_block .pmts-account-holder-name' ) );
            }
            else {
                // 古い領収書の場合、支払い情報欄のフォーマットが異なる(2014/04頃を境に変化)
                
                jq_payment_summary = jq_receipt_body.children( 'table.sample' ).find( 'table tr' );
                
                var is_card_type = false,
                    is_billing_destination = false,
                    card_type_text = '',
                    billing_destination_text = '',
                    br_counter = 0;
                
                jq_payment_summary.find( 'td:eq(0)' ).contents().each( function () {
                    var text_value = '',
                        node_type = this.nodeType;
                    
                    if ( node_type == 1 ) {
                        switch ( this.tagName ) {
                            case 'B' :
                                text_value = this.textContent;
                                
                                if ( /支払い?方法/.test( text_value ) ) {
                                    is_card_type = true;
                                    is_billing_destination = false;
                                    br_counter = 0;
                                }
                                else if ( /請求先/.test( text_value ) ) {
                                    is_card_type = false;
                                    is_billing_destination = true;
                                    br_counter = 0;
                                }
                                break;
                                
                            case 'BR' :
                                br_counter ++;
                                break;
                        }
                        return;
                    }
                    
                    if ( node_type != 3 ) {
                        return;
                    }
                    
                    if ( br_counter == 1 ) {
                        text_value = this.nodeValue.trim();
                        
                        if ( is_card_type ) {
                            card_type_text += text_value;
                        }
                        else if ( is_billing_destination ) {
                            billing_destination_text += text_value;
                        }
                    }
                } );
                
                card_info.card_type = card_type_text.trim();
                order_billing_destination = billing_destination_text.trim();
                
                var jq_price_info_container = jq_payment_summary.find( 'td[align="right"]' ),
                    price_info_text = '';
                
                jq_price_info_container.contents().each( function () {
                    var text_value = '',
                        node_type = this.nodeType;
                    
                    if ( node_type == 1 ) {
                        switch ( this.tagName ) {
                            case 'B' :
                                text_value = this.textContent;
                                
                                if ( /総計/.test( text_value ) ) {
                                    order_billing_amount =  get_price_number( text_value );
                                    return false;
                                }
                                break;
                                
                            case 'BR' :
                                var parts = price_info_text.split( /[:：]/ ),
                                    name = '',
                                    price = 0;
                                
                                price_info_text = '';
                                
                                if ( parts.length < 2 ) {
                                    return;
                                }
                                
                                name = parts[ 0 ].trim();
                                price = get_price_number( parts[ 1 ] );
                                
                                if ( ! price ) {
                                    return;
                                }
                                
                                if ( /(?:小|合|総|)計/.test( name ) ) {
                                    return;
                                }
                                
                                other_price_info_list.push( {
                                    name : name,
                                    price : price
                                } );
                                break;
                        }
                        return;
                    }
                    
                    if ( node_type == 3 ) {
                        price_info_text += this.nodeValue.trim();
                    }
                } );
                
                if ( order_billing_amount ) {
                    card_info.card_billing_amount = order_billing_amount;
                }
            }
        }
        order_status = get_child_text_from_jq_element( jq_order_summary_content.find( 'tr:first td[align="center"] font b' ) );
        
        let jq_return_to_order_summary_container = jq_receipt_body.children( 'center:eq(-1)' );
        if ( jq_return_to_order_summary_container.length < 1 ) {
            jq_return_to_order_summary_container = jq_receipt_body.find('#a-page > center:eq(-1)' );
        }
        order_url = get_absolute_url( jq_return_to_order_summary_container.find( 'p > a' ).attr( 'href' ) );
        receipt_url = get_absolute_url( jq_receipt_body.children( 'h2.receipt' ).find( 'a' ).attr( 'href' ) );
        
        order_parameters = {
            order_date : order_date,
            order_id : order_id,
            item_list : item_list,
            other_price_info_list : other_price_info_list,
            order_subtotal_price : order_subtotal_price,
            order_total_price : order_total_price,
            order_destination : order_destination,
            order_status : order_status,
            order_billing_amount : order_billing_amount,
            order_billing_destination : order_billing_destination,
            card_info : card_info,
            order_url : order_url,
            receipt_url : receipt_url
        };
        
        return order_parameters;
    }, // end of get_order_parameters_digital()
    
    
    get_order_parameters_nondigital : function ($receipt_body, order_parameters) {
        // TODO: 基本的には注文詳細画面の情報を使用するが、それだと取得できない情報もある
        // →やむを得ず、一部情報は領収書画面から取得
        const
            self = this,
            $order_container = $receipt_body.find('#pos_view_content'),
            $receipt_body_eu_invoice = $receipt_body.find('#eu-invoice');
        
        if ( 0 < $receipt_body_eu_invoice.length ) {
            // [メモ] 以下のような警告が表示されるケース
            // 「領収書／購入明細書 | 利用可能なお支払明細がありません 理由は？」
            // ※ https://www.amazon.co.jp/gp/help/customer/display.html/ref=noinvoice_why?ie=UTF8&nodeId=201986650
            //    へリンクされている
            order_parameters.error_message = [
                order_parameters.error_message ?? '',
                $receipt_body_eu_invoice.parents('td[align="right"]:first').text(),
                get_absolute_url($receipt_body_eu_invoice.find('a:last').attr('href')),
            ].join(' ').trim().replace(/\s+/g, ' ');
        }
        
        {
            // [メモ] 注文詳細画面から発送日付が取得できなくなったため、こちらで取得(2025/02)
            const
                $status_infos = $order_container.find('b.sans > center'),
                status_info_map = {};
            
            $status_infos.each(function() {
                const
                    $status_info = $(this),
                    status = $status_info.text().trim(),
                    status_date = get_formatted_date_string(status),
                    status_date_ms_base = status_date ? new Date(status_date).getTime() : 32503680000000,
                    $item_name_list = $status_info.parents('table').eq(1).find('i');
                
                $item_name_list.each(function() {
                    const
                        item_name = $(this).text().trim();
                    
                    status_info_map[item_name] = {
                        status,
                        status_date,
                        status_date_ms_base,
                    };
                });
            });
            
            // [メモ] 商品名をキーにして発送日付情報と結びつけ
            // TODO: 簡易的な処理なので、例えば同一商品がある場合は誤動作してしまう（個数と金額を考慮すれば精度は上がるが、処理が煩雑なので現状は行っていない）
            order_parameters.item_group_list.forEach((item_group, group_index) => {
                let status_info;
                const
                    matched_item_list = item_group.item_list.filter(item => {
                        status_info = status_info_map[item.name];
                        return (status_info !== undefined);
                    });
                
                if (matched_item_list.length < 1) {
                    return;
                }
                if (matched_item_list.length == item_group.item_list.length) {
                    delete status_info_map[item_group.item_list[0].name];
                    item_group.status = status_info.status;
                    item_group.status_date_ms = status_info.status_date_ms_base + group_index;
                    item_group.item_list.forEach(item => {
                        item.status = status_info.status;
                    });
                }
            });
            order_parameters.item_group_list.sort((a, b) => a.status_date_ms - b.status_date_ms);
        }
        
        if (order_parameters.card_info_list.length < 1) {
            // [メモ] 注文詳細画面からカード履歴が取得できなくなったため、こちらで取得(2025/02)
            const
                card_info_list = [],
                $charge_to_card_infos = $order_container.find('#pos_view_section table td > div').filter(function(){return (($(this).parent().children().length == 1) && $(this).text('カードへの請求'));}).parents('table').first().find('td[align="right"] table tr');
            
            $charge_to_card_infos.each(function(list_index) {
                const
                    $charge_to_card_info = $(this),
                    $charge_to_card_data = $charge_to_card_info.children('td');
                
                if ($charge_to_card_data.length != 2) {
                    return;
                }
                const
                    card_date_infos = ($charge_to_card_data.first().text() ?? '').split(/:/),
                    card_type = (card_date_infos[0] ?? '').trim(),
                    card_billing_date = get_formatted_date_string(card_date_infos[1] ?? '');
                
                if ((card_type != '') && (card_billing_date != '')) {
                    const
                        card_billing_amount = get_price_number($charge_to_card_data.last().text());
                    if (card_billing_amount != '') {
                        card_info_list.push({
                            card_type,
                            card_billing_date,
                            card_billing_amount,
                            card_billing_date_ms : new Date(card_billing_date).getTime() + 23 * 3600000 + list_index,
                        });
                    }
                }
            });
            if (0 < card_info_list.length) {
                card_info_list.sort((a, b) => a.card_billing_date_ms - b.card_billing_date_ms);
                //order_parameters.card_info_list = card_info_list;
                // [メモ] ↑は、Firefox だと「Error: Not allowed to define cross-origin object as property on [Object] or [Array] XrayWrapper」となってしまう
                
                if (typeof cloneInto == 'function') {
                    order_parameters.card_info_list = cloneInto(card_info_list, order_parameters);
                }
                else {
                    order_parameters.card_info_list = card_info_list;
                }
            }
        }
        
        const
            order_billing_destination = $receipt_body.find('.displayAddressFullName').text().trim();
        
        order_parameters.order_billing_destination = order_billing_destination;
        
        if (order_parameters.is_except_page) {
            // ネットスーパーのページなど
            if (0 < order_parameters.item_group_list.length) {
                const
                    item_group = order_parameters.item_group_list[0],
                    status = $receipt_body.find('[id="pos_view_section"]:first b.sans center').text().trim(),
                    status_date = get_formatted_date_string(status),
                    status_date_ms = status_date ? new Date(status_date).getTime() : 32503680000000;
                
                item_group.status = status;
                item_group.status_date_ms = status_date_ms;
            }
            if (0 < order_parameters.card_info_list.length) {
                const
                    card_info = order_parameters.card_info_list[0],
                    card_billing_date = get_formatted_date_string($receipt_body.find('[id="pos_view_section"]:last tr:last').text().split(/:/)[1]);
                card_info.card_billing_date = card_billing_date;
            }
        }
        
        return order_parameters;
    }, // end of get_order_parameters_nondigital()
    
    
    get_order_parameters_nondigital_legacy : function ( jq_receipt_body, item_info_list ) {
        var self = this,
            order_parameters = {},
            order_date = '',
            order_id = '',
            item_group_list = [],
            order_subtotal_price = '',
            order_total_price = '',
            order_billing_destination = '',
            order_billing_amount = '',
            order_url = '',
            receipt_url = '',
            
            card_info_list = [],
            payment_method_list = [],
            payment_method = '',
            error_message = '',
            
            jq_order_container = jq_receipt_body.find( 'table:eq(0) > tbody > tr > td' ),
            jq_order_summary_header = jq_order_container.children( 'table:eq(0)' ),
            jq_order_summary_content_list = jq_order_container.children( 'table:gt(0):lt(-1)' ),
            jq_payment_content = jq_order_container.children( 'table:eq(-1)' ).find( 'table > tbody' ),
            jq_payment_summary = jq_payment_content.children( 'tr:eq(1)' ).find( 'table:first > tbody > tr > td' ),
            jq_payment_billing_destination = jq_payment_summary.find( '.displayAddressDiv .displayAddressUL' ),
            jq_payment_total = jq_payment_summary.find( 'table > tbody > tr > td[align="right"]' ),
            jq_payment_card_info_list = jq_payment_content.children( 'tr:eq(2)' ).find( 'table table tr' ),
            jq_receipt_body_eu_invoice = jq_receipt_body.find( '#eu-invoice' ),
            
            payment_info_list = [];
        
        if ( 0 < jq_receipt_body_eu_invoice.length ) {
            error_message = ( jq_receipt_body_eu_invoice.parents( 'td[align="right"]:first' ).text() + ' ' + get_absolute_url( jq_receipt_body_eu_invoice.find( 'a:last' ).attr( 'href' ) ) ).replace( /\s+/g, ' ' );
        }
        
        /*
        //order_date = get_formatted_date_string( get_child_text_from_jq_element( jq_order_summary_header.find( 'td:has(b:contains("注文日")):first' ) ) );
        //if ( ! order_date ) {
        //    order_date = get_formatted_date_string( get_child_text_from_jq_element( jq_order_summary_header.find( 'td:has(b:contains("定期おトク便")):first' ) ) );
        //}
        //order_id = get_child_text_from_jq_element( jq_order_summary_header.find( 'td:has(b:contains("注文番号")):first' ) );
        */
        order_date = get_formatted_date_string( get_child_text_from_jq_element(
            jq_order_summary_header.find( 'td' ).filter( function () {
                return ( 0 <= $( this ).find( 'b' ).text().indexOf( '注文日' ) );
            } ).first()
        ) );
        if ( ! order_date ) {
            order_date = get_formatted_date_string( get_child_text_from_jq_element(
                jq_order_summary_header.find( 'td' ).filter( function () {
                    return ( 0 <= $( this ).find( 'b' ).text().indexOf( '定期おトク便' ) );
                } ).first()
            ) );
        }
        order_id = get_child_text_from_jq_element(
            jq_order_summary_header.find( 'td' ).filter( function () {
                return ( 0 <= $( this ).find( 'b' ).text().indexOf( '注文番号' ) );
            } ).first()
        );
        
        order_billing_destination = get_child_text_from_jq_element( jq_payment_billing_destination.find( '.displayAddressFullName' ) );
        
        jq_payment_total.find( '> table > tbody > tr' ).each( function () {
            var $payment_info = $( this ),
                $payment_header = $payment_info.find( '> td[align="right"]:first' ),
                $payment_price = $payment_info.find( '> td[align="right"]:last' ),
                payment_header = get_child_text_from_jq_element( $payment_header ),
                payment_price = get_price_number( get_child_text_from_jq_element( $payment_price ) );
            
            if ( 0 <= payment_header.indexOf( '商品の小計' ) ) {
                order_subtotal_price = payment_price;
            }
            else if ( 0 <= payment_header.indexOf( '注文合計' ) ) {
                order_total_price = payment_price;
            }
            else if ( payment_header ) {
                payment_info_list.push( {
                    header : payment_header.replace( /[:：]\s*$/g, '' ),
                    price : payment_price,
                } );
            }
        } );
        /*
        //order_subtotal_price = get_price_number( get_child_text_from_jq_element( jq_payment_total.find( 'tr:has(td[align="right"]:contains("商品の小計")) > td[align="right"]:eq(-1)' ) ) );
        //order_total_price = get_price_number( get_child_text_from_jq_element( jq_payment_total.find( 'tr:has(td[align="right"]:contains("注文合計")) > td[align="right"]:eq(-1)' ) ) );
        */
        //order_billing_amount = get_price_number( get_child_text_from_jq_element( jq_payment_total.find( 'tr:has(td[align="right"] > b:contains("ご請求額")) > td[align="right"]:eq(-1) b' ) ) );
        order_billing_amount = get_price_number( get_child_text_from_jq_element(
            jq_payment_total.find( 'tr' ).filter( function () {
                return ( 0 <= $( this ).find( 'td[align="right"] > b' ).text().indexOf( 'ご請求額' ) );
            } ).find( '> td[align="right"]:eq(-1) b' )
        ) );
        
        jq_payment_summary.contents().each( function () {
            var text_value = '',
                node_type = this.nodeType;
            
            if ( node_type == 1 ) {
                switch ( this.tagName ) {
                    case 'B' :
                        text_value = this.textContent;
                        
                        if ( payment_method ) {
                            payment_method_list.push( payment_method );
                        }
                        
                        payment_method = '';
                        
                        if ( /請求先/.test( text_value ) ) {
                            return false;
                        }
                        break;
                        
                    case 'BR' :
                        if ( payment_method ) {
                            payment_method_list.push( payment_method );
                        }
                        
                        payment_method = '';
                        break;
                    case 'NOBR' : 
                        text_value = this.textContent;
                        
                        payment_method += text_value.trim();
                        break;
                }
                return;
            }
            
            if ( node_type == 3 ) {
                payment_method += this.nodeValue.trim();
            }
        } );
        
        jq_payment_card_info_list.each( function ( list_index ) {
            var jq_payment_card_info = $( this ),
                card_info_parts = get_child_text_from_jq_element( jq_payment_card_info.find( 'td:eq(0)') ).split( ':' ),
                card_type = '',
                card_billing_date = '',
                card_billing_amount = '';
            
            if ( card_info_parts.length == 3 ) {
                card_type = card_info_parts[ 0 ].trim();
                card_billing_date = get_formatted_date_string( card_info_parts[ 1 ] );
            }
            card_billing_amount = get_price_number( get_child_text_from_jq_element( jq_payment_card_info.find( 'td:eq(1)') ) );
            
            card_info_list.push( {
                card_type : card_type,
                card_billing_date : card_billing_date,
                card_billing_amount : card_billing_amount,
                card_billing_date_ms : ( ( card_billing_date ) ? new Date( card_billing_date ).getTime() : 32503680000000 ) + 23 * 3600000 + list_index,
            } );
        } );
        
        card_info_list.sort( ( a, b ) => a.card_billing_date_ms - b.card_billing_date_ms );
        
        jq_order_summary_content_list.each( function ( list_index ) {
            var item_list = [],
                
                jq_order_summary_content = $( this ).find( 'table > tbody' ),
                jq_order_summary_items = jq_order_summary_content.children( 'tr:eq(1)' ).find( 'table:eq(0) td:eq(0) table:eq(1) tr:gt(0)' ),
                
                jq_order_summary_container = jq_order_summary_content.children( 'tr:eq(2)' ).find( 'table > tbody > tr' ),
                jq_order_summary_destination = jq_order_summary_container.find( '.displayAddressDiv .displayAddressUL' ),
                jq_order_summary_total = jq_order_summary_container.find( 'td[align="right"]' ),
                jq_order_summary_price_infos = jq_order_summary_total.find( 'table:first > tbody > tr' ),
                
                destination = get_child_text_from_jq_element( jq_order_summary_destination.find( '.displayAddressFullName' ) ),
                status = get_child_text_from_jq_element( jq_order_summary_content.children( 'tr:eq(0)' ).find( 'b.sans center' ) ),
                status_date = get_formatted_date_string( status ),
                status_date_ms = ( ( status_date ) ? new Date( status_date ).getTime() : 32503680000000 ) + list_index,
                
                is_gift_token = /^Amazonギフト券$/.test( status ),
                
                subtotal_price = 0,
                total_price = 0,
                billing_amount = 0,
                
                gift_token_info_list = [],
                other_price_info_list = [],
                
                card_info = {
                    card_type : '',
                    card_billing_date : '',
                    card_billing_amount : ''
                },
                min_time_lag_ms = 31622400000;  // 366 * 24 * 60 * 60 * 1000
            
            if ( is_gift_token ) {
                card_info.card_billing_amount = order_billing_amount;
                
                if ( 0 < payment_method_list.length ) {
                    //card_info.card_type = payment_method_list[ 0 ];
                    card_info.card_type = payment_method_list.join('、');
                }
                
                jq_order_summary_items = jq_order_summary_content.children( 'tr:eq(1)' ).find( 'table:eq(0) td:eq(0) table:gt(0)' );
                
                jq_order_summary_items.each( function () {
                    var jq_item = $( this ),
                        //jq_item_columns = jq_item.find( 'tbody:first > tr > td:not(:has(hr[noshade]))' );
                        jq_item_columns = jq_item.find( 'tbody' ).first().find( '> tr > td' ).filter( function () {
                            return ( $( this ).find( 'hr[noshade]' ).length <= 0 );
                        } );
                    
                    if ( jq_item_columns.length < 2 ) {
                        return;
                    }
                     
                    var jq_item_info = jq_item_columns.eq( 0 ).clone(),
                        jq_item_price = jq_item_columns.eq( 1 ),
                        jq_send_to = jq_item_info.children( 'b:contains("ギフト券を")' ),
                        send_to_parts = jq_send_to.text().split( /[:：]/ ),
                        destination = ( 1 < send_to_parts.length ) ? send_to_parts[ 1 ].trim() : '',
                        item_status = get_child_text_from_jq_element( jq_item_info.find( 'b.h1' ).remove() ),
                        price = get_price_number( get_child_text_from_jq_element( jq_item_price ) ),
                        remarks = jq_item_info.text().replace( /\s+/g, ' ' ).trim(),
                        url = jq_item_info.find( 'a[name="address"]' ).attr( 'href' );
                    
                    
                    gift_token_info_list.push( {
                        name : status,
                        remarks : remarks,
                        price : price,
                        number : 1,
                        status : item_status,
                        destination : destination,
                        url : ( url ) ? url : ''
                    } );
                } );
            }
            else {
                jq_order_summary_items.each( function () {
                    var jq_item = $( this ),
                        jq_item_info = jq_item.find( 'td:eq(0)' ),
                        jq_item_price = jq_item.find( 'td:eq(1)' ),
                        remarks = '',
                        orig_remarks = '',
                        number = 1,
                        price = 0,
                        item_name = '',
                        item_name_for_search = '',
                        item_url = '';
                    
                    if ( ( jq_item_info.length <= 0 ) || ( jq_item_price.length <= 0 ) ) {
                        return;
                    }
                    
                    orig_remarks = ( get_child_text_from_jq_element( jq_item_info ) + ' ' + get_child_text_from_jq_element( jq_item_info.find( '.tiny' ) ).replace( /\(\s*\)/, '' ) ).trim();
                    remarks = orig_remarks.replace( /^(\d+)\s*点\s*,?\s*/, '' );
                    
                    if ( remarks != orig_remarks ) {
                        number = parseInt( RegExp.$1, 10 );
                    }
                    
                    item_name = get_child_text_from_jq_element( jq_item_info.find( 'i' ) );
                    item_name_for_search = item_name.replace( /\s+/g, '' );
                    item_url = '';
                    
                    if ( item_name_for_search != '' ) {
                        $( item_info_list ).each( function () {
                            var item_info = this,
                                item_info_item_name = item_info.item_name.replace( /\s+/g, '' );
                            
                            if ( ( item_info_item_name != '' ) && ( 0 <= item_info_item_name.indexOf( item_name_for_search ) || 0 <= item_name_for_search.indexOf( item_info_item_name ) ) ) {
                                item_url = item_info.item_url;
                                return false;
                            }
                        } );
                    }
                    price = get_price_number( get_child_text_from_jq_element( jq_item_price ) );
                    item_list.push( {
                        name : item_name,
                        remarks : remarks,
                        price : price,
                        number : number,
                        status : status,
                        url : item_url
                    } );
                    
                    subtotal_price += price * number;
                    
                    if ( ! item_url ) {
                        log_error( '(*) item_url not found: item=', item_list[ item_list.length - 1 ], 'item_info_list=', item_info_list );
                    }
                } );
                
                // 2019.10: 発送毎の明細が記載されなくなった
                /*
                //jq_order_summary_price_infos.each( function () {
                //    var jq_price_info = $( this ),
                //        jq_price_info_columns = jq_price_info.find( 'td' ),
                //        jq_price_info_name = jq_price_info_columns.eq( 0 ),
                //        jq_price_info_price = jq_price_info_columns.eq( 1 ),
                //        name = jq_price_info_name.text().trim().replace( /(?:の金額)?[：:]+\s*$/g, '' ),
                //        price = get_price_number( jq_price_info_price.text() );
                //    
                //    if ( price === '' ) {
                //        return;
                //    }
                //    
                //    if ( /商品の小計/.test( name ) ) {
                //        subtotal_price = price;
                //        return;
                //    }
                //    
                //    if ( /注文合計/.test( name ) ) {
                //        total_price = price;
                //        return;
                //    }
                //    
                //    if ( /請求額/.test( name ) ) {
                //        billing_amount = price;
                //        return;
                //    }
                //    
                //    if ( /支払い合計/.test( name ) ) {
                //        return;
                //    }
                //    
                //    other_price_info_list.push( {
                //        name : name,
                //        price : price
                //    } );
                //} );
                //
                //if ( billing_amount !== '' ) {
                //    $.each( card_info_list, function ( index, temp_card_info ) {
                //        // TODO: カード請求が同じ金額で複数ある場合におかしくなってしまう（発送日と請求日にもずれがある）
                //        // → とりあえず、発送日と請求日の差が一番小さいものを選択することにして、様子見
                //        if ( temp_card_info.card_billing_amount == billing_amount ) {
                //            if ( ( ! status_date ) || ( ! temp_card_info.card_billing_date ) ) {
                //                card_info = temp_card_info;
                //                return;
                //            }
                //            
                //            var time_lag_ms = Math.abs( new Date( temp_card_info.card_billing_date ).getTime() - status_date_ms );
                //            
                //            if ( time_lag_ms < min_time_lag_ms ) {
                //                min_time_lag_ms = time_lag_ms;
                //                card_info = temp_card_info;
                //            }
                //        }
                //    } );
                //}
                */
            }
            
            item_group_list.push( {
                is_gift_token : is_gift_token,
                item_list : item_list,
                gift_token_info_list : gift_token_info_list,
                other_price_info_list : other_price_info_list,
                subtotal_price : subtotal_price,
                total_price : total_price,
                destination : destination,
                status : status,
                billing_amount : billing_amount,
                card_info : card_info,
                status_date_ms : status_date_ms,
            } );
        } );
        
        item_group_list.sort( ( a, b ) => a.status_date_ms - b.status_date_ms );
        
        order_url = get_absolute_url( jq_receipt_body.children( 'center:eq(-1)' ).find( 'p > a' ).attr( 'href' ) );
        receipt_url = get_absolute_url( jq_receipt_body.children( 'h2.receipt' ).find( 'a' ).attr( 'href' ) );
        
        order_parameters = {
            order_date : order_date,
            order_id : order_id,
            item_group_list : item_group_list,
            order_subtotal_price : order_subtotal_price,
            order_total_price : order_total_price,
            order_billing_destination : order_billing_destination,
            order_billing_amount : order_billing_amount,
            order_url : order_url,
            receipt_url : receipt_url,
            card_info_list : card_info_list,
            payment_method_list : payment_method_list,
            payment_info_list : payment_info_list,
            error_message : error_message,
        };
        
        return order_parameters;
    }, // end of get_order_parameters_nondigital_legacy()
    
    
    create_csv_download_button : function ( jq_parent ) {
        var self = this,
            jq_csv_download_button = self.jq_csv_download_button = $( '<button class="noprint"/>' );
        
        /*
        //if ((! self.open_parameters.is_digital) && document.querySelector('#pos_view_content')) {
        //    jq_csv_download_button
        //        .attr( 'id', SCRIPT_NAME + '-csv-download-button' )
        //        .attr( 'title', 'ページ構造が大きく変化したため対応できておりません(2024年02月現在)')
        //        .text( 'CSVダウンロードはご利用いただけません' )
        //        .css( {
        //            'color' : 'red',
        //            'margin' : '4px',
        //            'cursor' : 'pointer'
        //        } )
        //        .click( function ( event ) {
        //            if (! confirm('現在、適切なCSV内容が取得できない不具合があります。このまま続行しますか？')) {
        //                event.stopPropagation();
        //                event.preventDefault();
        //                return;
        //            }
        //            self.onclick_csv_download_button( event );
        //        } )
        //        .prependTo( jq_parent );
        //    return self;
        //}
        */
        
        jq_csv_download_button
            .attr( 'id', SCRIPT_NAME + '-csv-download-button' )
            .text( OPTIONS.CSV_DOWNLOAD_BUTTON_TEXT )
            .css( {
                'margin' : '4px',
                'cursor' : 'pointer'
            } )
            .click( function ( event ) {
                self.onclick_csv_download_button( event );
            } )
            .prependTo( jq_parent );
        return self;
    }, // end of create_csv_download_button()
    
    
    create_refund_csv_download_button : function ( jq_parent ) {
        var self = this;
        
        if ( self.refund_info_container_list.length <= 0 ) {
            return self;
        }
        
        var jq_refund_csv_download_button = self.jq_refund_csv_download_button = $( '<button class="noprint"/>' );
        
        jq_refund_csv_download_button
            .attr( 'id', SCRIPT_NAME + '-refund-csv-download-button' )
            .text( OPTIONS.REFUND_CSV_DOWNLOAD_BUTTON_TEXT )
            .css( {
                'margin' : '4px',
                'cursor' : 'pointer'
            } )
            .click( function ( event ) {
                self.onclick_refund_csv_download_button( event );
            } )
            .prependTo( jq_parent );
        
        return self;
    }, // end of create_refund_csv_download_button()
    
    
    create_change_addressee_button : function ( jq_parent ) {
        var self = this;
        
        if ( ! OPTIONS.ADDRESSEE_CHANGEABLE ) {
            return self;
        }
        
        var jq_change_addressee_button = self.jq_change_addressee_button = $( '<button class="noprint"/>' );
        
        jq_change_addressee_button
            .attr( 'id', SCRIPT_NAME + '-change-addressee-button' )
            .text( OPTIONS.CHANGE_ADDRESSEE_BUTTON_TEXT )
            .css( {
                'margin' : '4px',
                'cursor' : 'pointer'
            } )
            .click( function ( event ) {
                self.onclick_change_addressee_button( event );
            } )
            .prependTo( jq_parent );
        
        return self;
    }, // end of create_change_addressee_button()
    
    
    create_print_preview_button : function ( jq_parent ) {
        var self = this;
        
        if ( ( ! OPTIONS.ENABLE_PRINT_PREVIEW_BUTTON ) || ( ! IS_FIREFOX ) || ( ! IS_WEB_EXTENSION ) ) {
            return self;
        }
        
        var jq_print_preview_button = self.jq_print_preview_button = $( '<button class="noprint"/>' );
        
        jq_print_preview_button
            .attr( 'id', SCRIPT_NAME + '-print-preview-button' )
            .text( OPTIONS.PRINT_PREVIEW_BUTTON_TEXT )
            .css( {
                'margin' : '4px',
                'cursor' : 'pointer'
            } )
            .click( function ( event ) {
                self.onclick_print_preview_button( event );
            } )
            .prependTo( jq_parent );
        
        return self;
    }, // end of create_print_preview_button()
    
    
    onclick_csv_download_button : function ( event ) {
        var self = this;
        
        event.stopPropagation();
        event.preventDefault();
        
        self.download_csv();
        
        return self;
    }, // end of onclick_csv_download_button()
    
    
    onclick_refund_csv_download_button : function ( event ) {
        var self = this;
        
        event.stopPropagation();
        event.preventDefault();
        
        self.download_refund_csv();
        
        return self;
    }, // end of onclick_refund_csv_download_button()
    
    
    onclick_change_addressee_button : function ( event ) {
        var self = this,
            new_addressee;
        
        event.stopPropagation();
        event.preventDefault();
        
        new_addressee = prompt( OPTIONS.CHANGE_ADDRESSEE_PROMPT_MESSAGE, self.addressee );
        
        if ( ( new_addressee === null ) || ( new_addressee === self.addressee ) ) {
            return self;
        }
        
        self.addressee = new_addressee;
        set_value( SCRIPT_NAME + '-addressee', self.addressee );
        
        self.jq_body.find( '.addressee' ).text( new_addressee );
        
        return self;
    }, // end of onclick_change_addressee_button()
    
    
    onclick_print_preview_button : function ( event ) {
        var self = this,
            new_addressee;
        
        event.stopPropagation();
        event.preventDefault();
        
        browser.runtime.sendMessage( {
            type : 'PRINT_PREVIEW_REQUEST'
        }, function ( response ) {
            log_debug( response );
        } );
        
        return self;
    }, // end of onclick_print_preview_button()
    
    
    download_csv : function () {
        var self = this;
        
        if ( ! self.jq_csv_download_link ) {
            self.create_csv();
        }
        
        self.jq_csv_download_link[ 0 ].click();
        
        return self;
    }, // end of download_csv()
    
    
    download_refund_csv : function () {
        var self = this;
        
        if ( ! self.jq_refund_csv_download_link ) {
            self.create_refund_csv();
        }
        
        self.jq_refund_csv_download_link[ 0 ].click();
        
        return self;
    }, // end of download_refund_csv()
    
    
    create_csv : function () {
        var self = this,
            open_parameters = self.open_parameters,
            url_to_page_info = self.url_to_page_info,
            csv_lines = [],
            order_url_list = [ open_parameters.first_order_url ].concat( open_parameters.additional_order_urls ),
            filename = self.get_csv_filename( 'amazon-order' );
        
        csv_lines.push( self.create_csv_line( self.csv_header_columns ) );
        
        if ( open_parameters.is_digital ) {
            order_url_list.forEach( function ( order_url ) {
                var order_parameters = url_to_page_info[ order_url ].order_parameters;
                
                if ( ! order_parameters ) {
                    return;
                }
                
                order_parameters.item_list.forEach( function ( item, item_index ) {
                    csv_lines.push( self.create_csv_line( [
                        order_parameters.order_date, // 注文日
                        order_parameters.order_id, // 注文番号
                        item.name, // 商品名
                        item.remarks, // 付帯情報
                        item.price, // 価格
                        item.number, // 個数
                        ( item_index == 0 ) ? order_parameters.order_subtotal_price : '', // 商品小計
                        /*
                        //( item_index == 0 ) ? order_parameters.order_total_price : '', // 注文合計(送料・手数料含む)
                        // TODO: order_total_price は、手数料・割引などが反映されている場合（プロモーション等）とされていない場合（Amazonポイント等）がある
                        */
                        ( item_index == 0 ) ? order_parameters.order_subtotal_price : '', // 注文合計(送料・手数料含む)
                        order_parameters.order_destination, // お届け先
                        order_parameters.order_status, // 状態
                        order_parameters.order_billing_destination, // 請求先
                        ( item_index == 0 ) ? order_parameters.order_billing_amount : '', // 請求額
                        order_parameters.card_info.card_billing_date, // クレカ請求日
                        ( item_index == 0 ) ? order_parameters.card_info.card_billing_amount : '', // クレカ請求額
                        ( order_parameters.card_info.card_billing_amount ) ? order_parameters.card_info.card_type : '', // クレカ種類
                        order_parameters.order_url, // 注文概要URL
                        order_parameters.receipt_url, // 領収書URL
                        item.url // 商品URL
                    ] ) );
                } );
                
                order_parameters.other_price_info_list.forEach( function ( other_price_info ) {
                    if ( other_price_info.price == 0 ) {
                        return;
                    }
                    
                    csv_lines.push( self.create_csv_line( [
                        order_parameters.order_date, // 注文日
                        order_parameters.order_id, // 注文番号
                        '（' + other_price_info.name + '）', // 商品名
                        ( other_price_info.price < 0 ) ? '※カード外支払→請求額に反映' : '※注文合計に反映', // 付帯情報
                        /*
                        //other_price_info.price, // 価格
                        //1, // 個数
                        //'', // 商品小計
                        //'', // 注文合計(送料・手数料含む)
                        */
                        '', // 価格
                        '', // 個数
                        ( 0 < other_price_info.price ) ? other_price_info.price : '', // 商品小計
                        ( other_price_info.price < 0 ) ? other_price_info.price : '', // 注文合計
                        order_parameters.order_destination, // お届け先
                        order_parameters.order_status, // 状態
                        order_parameters.order_billing_destination, // 請求先
                        '', // 請求額
                        order_parameters.card_info.card_billing_date, // クレカ請求日
                        '', // クレカ請求額
                        ( order_parameters.card_info.card_billing_amount ) ? order_parameters.card_info.card_type : '', // クレカ種類
                        order_parameters.order_url, // 注文概要URL
                        order_parameters.receipt_url, // 領収書URL
                        '' // 商品URL
                    ] ) );
                } );
            } );
        }
        else {
            order_url_list.forEach( function ( order_url ) {
                var order_parameters = url_to_page_info[ order_url ].order_parameters;
                
                if ( ! order_parameters ) {
                    return;
                }
                
                var card_billing_amount = 0,
                    card_type = '',
                    card_type_map = {},
                    current_card_info_index = 0,
                    current_card_info;
                
                if (0 < order_parameters.card_info_list.length) {
                    order_parameters.card_info_list.forEach( ( card_info ) => {
                        card_type_map[ card_info.card_type ] = card_info.card_type;
                        card_billing_amount += card_info.card_billing_amount || 0;
                    } );
                    
                    card_type = Object.keys( card_type_map ).join( '、' );
                }
                else {
                    card_type = order_parameters.payment_method_list.join('、');
                    // TODO: 気付いたら取引履歴が記載されなくなっていたので、カード明細もわからない(2024/11)
                }
                csv_lines.push( self.create_csv_line( [
                    order_parameters.order_date, // 注文日
                    order_parameters.order_id, // 注文番号
                    '（注文全体）', // 商品名
                    ( order_parameters.error_message ) ? order_parameters.error_message : '', // 付帯情報
                    '', // 価格
                    '', // 個数
                    '', // 商品小計
                    order_parameters.order_total_price, // 注文合計
                    '', // お届け先
                    '', // 状態
                    order_parameters.order_billing_destination, // 請求先
                    order_parameters.order_billing_amount, // 請求額
                    '', // クレカ請求日
                    '', // クレカ請求額
                    card_type, // クレカ種類
                    order_parameters.order_url, // 注文概要URL
                    order_parameters.receipt_url, // 領収書URL
                    '', // 商品URL
                ] ) );
                
                order_parameters.item_group_list.forEach( function ( item_group ) {
                    for ( ; current_card_info_index < order_parameters.card_info_list.length; current_card_info_index ++ ) {
                        current_card_info = order_parameters.card_info_list[ current_card_info_index ];
                        
                        if ( item_group.status_date_ms < current_card_info.card_billing_date_ms ) {
                            break;
                        }
                        
                        csv_lines.push( self.create_csv_line( [
                            order_parameters.order_date, // 注文日
                            order_parameters.order_id, // 注文番号
                            '（クレジットカードへの請求）', // 商品名
                            '', // 付帯情報
                            '', // 価格
                            '', // 個数
                            '', // 商品小計
                            '', // 注文合計
                            '', // お届け先
                            '', // 状態
                            order_parameters.order_billing_destination, // 請求先
                            '', // 請求額
                            current_card_info.card_billing_date, // クレカ請求日
                            current_card_info.card_billing_amount, // クレカ請求額
                            current_card_info.card_type, // クレカ種類
                            order_parameters.order_url, // 注文概要URL
                            order_parameters.receipt_url, // 領収書URL
                            '', // 商品URL
                        ] ) );
                    }
                    
                    item_group.item_list.forEach( function ( item, item_index ) {
                        csv_lines.push( self.create_csv_line( [
                            order_parameters.order_date, // 注文日
                            order_parameters.order_id, // 注文番号
                            item.name, // 商品名
                            item.remarks, // 付帯情報
                            item.price, // 価格
                            item.number, // 個数
                            ( item_index == 0 ) ? item_group.subtotal_price : '', // 商品小計 // TODO: 発送毎の小計になるので不自然に見えるかも？単純に(item.price*item.number)の方がわかりやすいか？
                            /*
                            // 2019.10: 発送毎の明細が記載されなくなった
                            //( item_index == 0 ) ? item_group.total_price : '', // 注文合計(送料・手数料含む)
                            */
                            '', // 注文合計
                            item_group.destination, // お届け先
                            item_group.status, // 状態
                            order_parameters.order_billing_destination, // 請求先
                            /*
                            // 2019.10: 発送毎の明細が記載されなくなった
                            //( item_index == 0 ) ? item_group.billing_amount : '', // 請求額
                            //item_group.card_info.card_billing_date, // クレカ請求日
                            //( item_index == 0 ) ? item_group.card_info.card_billing_amount : '', // クレカ請求額
                            //( item_group.card_info.card_billing_amount ) ? item_group.card_info.card_type : '', // クレカ種類
                            */
                            '', // 請求額
                            '', // クレカ請求日
                            '', // クレカ請求額
                            card_type, // クレカ種類
                            order_parameters.order_url, // 注文概要URL
                            order_parameters.receipt_url, // 領収書URL
                            item.url, // 商品URL
                        ] ) );
                    } );
                    
                    item_group.gift_token_info_list.forEach( function ( item, item_index ) {
                        csv_lines.push( self.create_csv_line( [
                            order_parameters.order_date, // 注文日
                            order_parameters.order_id, // 注文番号
                            item.name, // 商品名
                            item.remarks, // 付帯情報
                            item.price, // 価格
                            item.number, // 個数
                            /*
                            // 2019.10: 発送毎の明細が記載されなくなった
                            //( item_index == 0 ) ? order_parameters.order_subtotal_price : '', // 商品小計
                            //( item_index == 0 ) ? order_parameters.order_total_price : '', // 注文合計(送料・手数料含む)
                            */
                            ( item_index == 0 ) ? order_parameters.order_total_price : '', // 商品小計
                            '', // 注文合計
                            item.destination, // お届け先
                            item.status, // 状態
                            order_parameters.order_billing_destination, // 請求先
                            /*
                            // 2019.10: 発送毎の明細が記載されなくなった
                            //( item_index == 0 ) ? order_parameters.order_billing_amount : '', // 請求額
                            //item_group.card_info.card_billing_date, // クレカ請求日
                            //( item_index == 0 ) ? item_group.card_info.card_billing_amount : '', // クレカ請求額
                            //( item_group.card_info.card_billing_amount ) ? item_group.card_info.card_type : '', // クレカ種類
                            */
                            '', // 請求額
                            '', // クレカ請求日
                            '', // クレカ請求額
                            card_type, // クレカ種類
                            order_parameters.order_url, // 注文概要URL
                            order_parameters.receipt_url, // 領収書URL
                            item.url, // 商品URL
                        ] ) );
                    } );
                    
                    // 2019.10: 発送毎の明細が記載されなくなった
                    /*
                    //item_group.other_price_info_list.forEach( function ( other_price_info ) {
                    //    if ( other_price_info.price == 0 ) {
                    //        return;
                    //    }
                    //    
                    //    csv_lines.push( self.create_csv_line( [
                    //        order_parameters.order_date, // 注文日
                    //        order_parameters.order_id, // 注文番号
                    //        '（' + other_price_info.name + '）', // 商品名
                    //        ( other_price_info.price < 0 ) ? '※カード外支払→請求額に反映' : '※注文合計に反映', // 付帯情報
                    //        other_price_info.price, // 価格
                    //        1, // 個数
                    //        '', // 商品小計
                    //        '', // 注文合計(送料・手数料含む)
                    //        item_group.destination, // お届け先
                    //        item_group.status, // 状態
                    //        order_parameters.order_billing_destination, // 請求先
                    //        '', // 請求額
                    //        item_group.card_info.card_billing_date, // クレカ請求日
                    //        '', // クレカ請求額
                    //        ( item_group.card_info.card_billing_amount ) ? item_group.card_info.card_type : '', // クレカ種類
                    //        order_parameters.order_url, // 注文概要URL
                    //        order_parameters.receipt_url, // 領収書URL
                    //        '', // 商品URL
                    //    ] ) );
                    //} );
                    */
                } );
                
                for ( ; current_card_info_index < order_parameters.card_info_list.length; current_card_info_index ++ ) {
                    current_card_info = order_parameters.card_info_list[ current_card_info_index ];
                    csv_lines.push( self.create_csv_line( [
                        order_parameters.order_date, // 注文日
                        order_parameters.order_id, // 注文番号
                        '（クレジットカードへの請求）', // 商品名
                        '', // 付帯情報
                        '', // 価格
                        '', // 個数
                        '', // 商品小計
                        '', // 注文合計
                        '', // お届け先
                        '', // 状態
                        order_parameters.order_billing_destination, // 請求先
                        '', // 請求額
                        current_card_info.card_billing_date, // クレカ請求日
                        current_card_info.card_billing_amount, // クレカ請求額
                        current_card_info.card_type, // クレカ種類
                        order_parameters.order_url, // 注文概要URL
                        order_parameters.receipt_url, // 領収書URL
                        '', // 商品URL
                    ] ) );
                }
                
                order_parameters.payment_info_list.forEach( ( payment_info ) => {
                    if ( payment_info.price == 0 ) {
                        return;
                    }
                    
                    csv_lines.push( self.create_csv_line( [
                        order_parameters.order_date, // 注文日
                        order_parameters.order_id, // 注文番号
                        '（' + payment_info.header + '）', // 商品名
                        '※（注文全体）' + ( ( payment_info.price < 0 ) ? '請求額に反映' : '注文合計に反映' ), // 付帯情報
                        '', // 価格
                        '', // 個数
                        ( 0 < payment_info.price ) ? payment_info.price : '', // 商品小計
                        ( payment_info.price < 0 ) ? payment_info.price : '', // 注文合計
                        '', // お届け先
                        '', // 状態
                        order_parameters.order_billing_destination, // 請求先
                        '', // 請求額
                        '', // クレカ請求日
                        '', // クレカ請求額
                        card_type, // クレカ種類
                        order_parameters.order_url, // 注文概要URL
                        order_parameters.receipt_url, // 領収書URL
                        '', // 商品URL
                    ] ) );
                } );
            } );
        }
        
        self.jq_csv_download_link = self.creat_csv_download_link( csv_lines, filename )
            .prependTo( self.jq_body );
        
        return self;
    }, // end of create_csv()
    
    
    create_refund_csv : function () {
        var self = this,
            open_parameters = self.open_parameters,
            csv_lines = [],
            filename = self.get_csv_filename( 'amazon-refund' );
        
        csv_lines.push( self.create_csv_line( self.refund_csv_header_columns ) );
        
        self.refund_info_container_list.forEach( function ( refund_info_container ) {
            var order_parameters = refund_info_container.order_parameters,
                refund_info = refund_info_container.refund_info,
                card_type = '';
            
            if ( open_parameters.is_digital ) {
                card_type = order_parameters.card_info.card_type;
            }
            else {
                if ( 0 < order_parameters.payment_method_list.length ) {
                    //card_type = order_parameters.payment_method_list[ 0 ];
                    card_type = order_parameters.payment_method_list.join('、');
                }
            }
            
            refund_info.refund_list.forEach( function ( refund ) {
                csv_lines.push( self.create_csv_line( [
                    order_parameters.order_date, // 注文日
                    order_parameters.order_id, // 注文番号
                    refund.date, // 返金日
                    refund.price, // 返金額
                    order_parameters.order_billing_destination, // 返金先
                    card_type, // クレカ種類
                    refund.remarks, // 備考
                    order_parameters.order_url, // 注文概要URL
                    order_parameters.receipt_url, // 領収書URL
                    refund_info.refund_invoice_url // 返金明細書URL
                ] ) );
            } );
        } );
        
        self.jq_refund_csv_download_link = self.creat_csv_download_link( csv_lines, filename )
            .prependTo( self.jq_body );
        
        return self;
    }, // end of create_refund_csv()
    
    
    create_csv_line : function ( source_csv_columns ) {
        var output_csv_columns = [];
        
        source_csv_columns.forEach( function ( source_csv_column ) {
            source_csv_column = ( '' + source_csv_column ).trim();
            
            if ( /^[\-+]?\d+\.?\d*(?:E[\-+]?\d+)?$/.test( source_csv_column ) ) {
                output_csv_columns.push( source_csv_column );
            }
            else {
                output_csv_columns.push( '"' + source_csv_column.replace( /"/g, '""' ) + '"' );
            }
        } );
        
        return output_csv_columns.join( ',' );
    }, // end of create_csv_line()
    
    
    get_csv_filename : function ( prefix ) {
        var self = this,
            open_parameters = self.open_parameters,
            filename_parts = [ prefix ],
            keyword_string = open_parameters.target_keyword_string;
        
        filename_parts.push( ( ( open_parameters.is_digital ) ? '' : 'non-' ) + 'digital' );
        
        filename_parts.push( open_parameters.target_period + ( ( 0 < open_parameters.target_month ) ? '-' + open_parameters.target_month : ''  ) );
        
        if ( open_parameters.target_destination ) {
            filename_parts.push( 'to-' + open_parameters.target_destination );
        }
        
        if ( keyword_string ) {
            if ( 50 < keyword_string.length ) {
                keyword_string = keyword_string.substr( 0, 49 ) + '…';
            }
            filename_parts.push( 'filter' + ( ( open_parameters.target_keyword_is_ruled_out ) ? '-not' : '' ) + '(' + keyword_string + ')' );
        }
        
        return get_safefilename( filename_parts.join( '_' ) ) + '.csv';
    }, // end of get_csv_filename()
    
    
    creat_csv_download_link : function ( csv_lines, filename ) {
        var csv = csv_lines.join( '\r\n' ),
            bom = new Uint8Array( [ 0xEF, 0xBB, 0xBF ] ),
            blob = new Blob( [ bom, csv ], { 'type' : 'text/csv' } ),
            blob_url = URL.createObjectURL( blob ),
            jq_csv_download_link = $( '<a/>' );
        
        jq_csv_download_link
            .attr( {
                'download' : filename,
                'href' : blob_url
            } )
            .addClass( 'noprint' )
            .css( {
                'display' : 'inline-block',
                'width' : '0',
                'height' : '0',
                'visibility' : 'hidden',
                'position' : 'absolute',
                'top' : '0',
                'left' : '0',
                'pointerEvents' : 'none'
            } );
        
        return jq_csv_download_link;
    } // end of create_csv_download_link()
    
}; // end of TemplateReceiptOutputPage

// }


// ■ ページ初期化処理 {
/*
//function is_order_history_page() {
//    return /^https?:\/\/[^\/]+\/gp\/(?:your-account|css|legacy)\/order-history/.test( window.location.href );
//} // end of is_order_history_page()
//
//
//function is_unsupported_order_history_page() {
//    return /^\/gp\/css\/order-history\/?$/.test(new URL(location.href).pathname);
//} // end of is_unsupported_order_history_page()
//
//
//function get_supported_order_history_page_top_url() {
//    return `${new URL(location.href).origin}/gp/your-account/order-history?opt=ab&digitalOrders=1&unifiedOrders=1&returnTo=&__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&orderFilter=months-3`;
//} // get_supported_order_history_page_top_url()
*/
const
    get_order_history_page_info = (target_document) => {
        if (! target_document) {
            target_document = document;
        }
        const
            legacy_order_page_content_container = target_document.querySelector('#yourOrders > #yourOrdersContent'),
            order_page_content_container = target_document.querySelector('.your-orders-content-container > .your-orders-content-container__content');
        return {
            legacy_order_page_content_container,
            order_page_content_container,
            is_order_history_page : (
                (
                    legacy_order_page_content_container?.querySelector(':scope > #controlsContainer > #orderTypeMenuContainer > [role="tablist"] > [role^="tab"].selected')?.textContent ??
                    order_page_content_container?.querySelector(':scope > .page-tabs > ul > li.page-tabs__tab.page-tabs__tab--selected, :scope > .page-tabs > [role="tablist"] > [role^="tab"].page-tabs__tab--selected')?.textContent ?? ''
                    // [2025/01/31] 選択された要素(.page-tabs__tab--selected)のroleが"tab"→"tabpanel"に変更された
                    // [2025/02/26] [role="tablist"]や[role^="tab"]がつかなくなった
                ).trim() == '注文'
            ),
        };
    };

function is_receipt_page() {
    return /^https?:\/\/[^\/]+\/gp\/(?:digital\/your-account\/order-summary\.html|css\/summary\/print\.html)/.test( window.location.href );
} // end of is_receipt_page()


function is_signin_page() {
    return /^https?:\/\/[^\/]+\/ap\/signin/.test( window.location.href );
} // end of is_signin_page()


function init_order_history_page() {
    if ( ! OPTIONS.OPERATION ) {
        return;
    }
    
    /*
    //if ( ! is_order_history_page() ) {
    //    return;
    //}
    //
    //if (typeof WEB_EXTENSION_INIT != 'function') {
    //    if (is_unsupported_order_history_page()) {
    //        location.replace(get_supported_order_history_page_top_url());
    //        return;
    //    }
    //}
    */
    const
        order_history_page_info = get_order_history_page_info();
    
    if (! order_history_page_info.is_order_history_page) {
        return;
    }
    
    ORDER_HISTORY_FILTER = object_extender( TemplateOrderHistoryFilter ).init( ! OPTIONS.OPERATION, order_history_page_info );
    
} // end of init_order_history_page()


function init_first_order_page( open_parameters ) {
    if ( ! OPTIONS.OPERATION ) {
        return;
    }
    
    if ( ! is_receipt_page() ) {
        return;
    }
    
    object_extender( TemplateReceiptOutputPage ).init( open_parameters );

} // end of init_first_order_page()


function init_order_page_in_iframe( open_parameters ) {
    if ( ! OPTIONS.OPERATION ) {
        return;
    }
    
    if ( is_signin_page() ) {
        window.parent.postMessage( {
            request_order_url : open_parameters.request_order_url,
            html : get_error_html( 'Please Sign-in !!' ),
            error : true,
            error_message : 'Sign-in requested',
            signin_request : true
        }, get_origin_url() );
        return;
    }
    
    if ( ! is_receipt_page() ) {
        window.parent.postMessage( {
            request_order_url : open_parameters.request_order_url,
            html : get_error_html( 'Unknown Error.' ),
            error : true,
            error_message : 'Unknown Error'
        }, get_origin_url() );
        return;
    }
    
    var order_detail_url = get_absolute_url( open_parameters.order_detail_url ),
        //order_detail_url = get_absolute_url( $( 'body > center:eq(-1) p > a, #pos_view_content a[href*="/edit.html"][href*="orderID"]' ).attr( 'href' ) ),
        
        order_detail_page_info = null,
        rendering_result = null,
        
        on_rendering_complete = function ( result ) {
            rendering_result = result;
            
            finish();
        },
        
        get_refund_invoice_url = function ( $invoceLinksList ) {
            return get_absolute_url( $invoceLinksList.find('li .a-link-normal:contains("返金明細書")').first().attr('href') );
        },
        
        get_refund_info_digital = function ( jq_html_fragment ) {
            var refund_list = [],
                refund_info = {
                    refund_invoice_url : '',
                    refund_list : refund_list
                },
                //refund_invoice_url = jq_html_fragment.find( 'a.a-link-normal[href*="/invoice/download"]:contains("返金通知書")' ).attr( 'href' );
                refund_invoice_url = jq_html_fragment.find( 'a.a-link-normal[href*="/invoice/download"]' ).attr( 'href' );
            
            if ( refund_invoice_url ) {
                refund_info.refund_invoice_url = get_absolute_url( refund_invoice_url );
            }
            
            //jq_html_fragment.find( '#digitalOrderSummaryContainer > .orderSummary:has(.section-header:contains("払い戻し")) > table.sample > tbody > tr' )
            jq_html_fragment.find( '#digitalOrderSummaryContainer > .orderSummary' ).filter( function () {
                return ( 0 <= $( this ).find( '.section-header' ).text().indexOf( '払い戻し' ) );
            } ).find( '> table.sample > tbody > tr' )
            .each( function () {
                var jq_refund = $( this );
                
                refund_list.push( {
                    date : get_formatted_date_string( jq_refund.find( 'td > strong' ).text() ),
                    price : get_price_number( jq_refund.find( 'td[align="right"]' ).text() ),
                    remarks : ''
                } );
            } );
            
            return refund_info;
        }, // end of get_refund_info_digital()
        
        get_refund_info_nondigital = function ( jq_html_fragment ) {
            var refund_list = [],
                refund_info = {
                    refund_invoice_url : '',
                    refund_list : refund_list
                };
            
            //jq_html_fragment.find( '#orderDetails .a-spacing-base .a-row.a-expander-container:has(.a-expander-prompt:contains("取引履歴")) .a-expander-content .a-color-success:has(.a-text-bold:contains("返金"))' )
            jq_html_fragment.find( '#orderDetails .a-spacing-base .a-row.a-expander-container' ).filter( function () {
                return ( 0 <= $( this ).find( '.a-expander-prompt' ).text().indexOf( '取引履歴' ) );
            } ).find( '.a-expander-content .a-color-success' ).filter( function () {
                return ( 0 <= $( this ).find( '.a-text-bold' ).text().indexOf( '返金' ) );
            } )
            .each( function () {
                var jq_refund = $( this ),
                    refund_text = jq_refund.find( '.a-text-bold:contains("返金")' ).text().trim();
                
                refund_list.push( {
                    date : get_formatted_date_string( refund_text ),
                    price : get_price_number( refund_text.replace( /^[^￥]+/, '' ) ),
                    remarks : ( refund_text.match( /^\s*([^:]+:\s*[^\s]+)/ ) ) ? RegExp.$1 : ''
                } );
            } );
            
            return refund_info;
        }, // end of get_refund_info_nondigital()
        
        get_item_info_list_digital = function ( jq_html_fragment ) {
            var item_info_list = [];
            
            jq_html_fragment.find( '.orderSummary a[href*="/dp/"]' ).each( function () {
                var jq_item_link = $( this );
                
                item_info_list.push( {
                    item_url : get_absolute_url( jq_item_link.attr( 'href' ) ),
                    item_name : jq_item_link.text().replace( /[\s\u00a0\ufffd]+/g, ' ' ).trim()
                } );
            } );
            
            return item_info_list;
        }, // end of get_item_info_digital()
        
        get_item_info_list_nondigital = function ( jq_html_fragment ) {
            var item_info_list = [],
                item_url_map = {};
            
            //jq_html_fragment.find( '.shipment:not(:has(.a-text-bold:contains("返品"))) a.a-link-normal[href*="/gp/product/"]:not(:has(img))' )
            jq_html_fragment.find( '.shipment' ).filter( function () {
                return ( $( this ).find( '.a-text-bold' ).text().indexOf( '返品' ) <  0 );
            } ).find( 'a.a-link-normal[href*="/gp/product/"]' ).filter( function () {
                return ( $( this ).find( 'img' ).length <= 0 );
            } ).each( function () {
                var jq_item_link = $( this ),
                    item_url = get_absolute_url( jq_item_link.attr( 'href' ) );
                
                item_info_list.push( {
                    item_url : item_url,
                    item_name : jq_item_link.text().replace( /[\s\u00a0\ufffd]+/g, ' ' ).trim()
                } );
                item_url_map[ item_url ] = true;
            } );
            
            // [2022/01] ネットスーパー(ライフ)の商品情報が取得できるように対応
            jq_html_fragment.find( '.a-row' ).filter( function () {
                return ( $( this ).find( '.ufpo-item-image-column' ).length > 0 );
            } ).find( 'a.a-link-normal[href*="/gp/product/"]' ).each( function () {
                var jq_item_link = $( this ),
                    item_url = get_absolute_url( jq_item_link.attr( 'href' ) );
                
                if ( item_url_map[ item_url ] ) {
                    return;
                }
                item_info_list.push( {
                    item_url : item_url,
                    item_name : jq_item_link.find( 'span' ).text().replace( /[\s\u00a0\ufffd]+/g, ' ' ).trim()
                } );
                item_url_map[ item_url ] = true;
            } );
            
            return item_info_list;
        }, // end of get_item_info_list_nondigital()
        
        
        get_order_parameters_nondigital_from_order_detail_page = function ($html_fragment) {
            const
                $orderDetails = $html_fragment.find('#orderDetails');
            
            if ($orderDetails.length < 1) {
                // [メモ] ネットスーパー(ライフ)等のページ構造は全く異なるため、別処理で行う
                return get_order_parameters_nondigital_from_except_order_detail_page($html_fragment);
            }
            
            const
                $orderSummay = $orderDetails.find('[data-component="orderSummary"]'),
                // [メモ] お届け先住所・支払い方法・領収書/購入明細書が含まれる要素は今のところ[data-component="orderSummary"]だけのようだが、例外もあるかも知れないため、以下ではもっと下の要素セレクタで検索している
                $subtotals = (() => {
                    const
                        $subtotals = $orderDetails.find('#od-subtotals'),
                        $orderSubtotals = $subtotals.find('[data-component="orderSubtotals"]');
                    
                    return (0 < $orderSubtotals.length) ? $orderSubtotals : $subtotals;
                })();
            
            if ($subtotals.length < 1) {
                return get_order_parameters_nondigital_from_giftcard_order_detail_page($html_fragment);
            }
            
            const
                $orderDateInvoice = $orderDetails.find('[data-component="orderDateInvoice"]'),
                $briefOrderInfoInvoice = $orderDetails.find('[data-component="briefOrderInfoInvoice"]');
                // [メモ] 注文日・注文番号・領収書等が含まれる要素は、[data-component="orderDateInvoice"]と[data-component="briefOrderInfoInvoice"]の少なくとも二つは存在し、かつ、中身の構造も異なっている

            const
                $shipping_address_container = $orderDetails.find('.od-shipping-address-container'),
                $payments_instrument_list = $orderDetails.find('.pmts-payments-instrument-list'),
                $transaction_history = $orderDetails.find('.a-expander-container').filter(function () {
                    return (/取引履歴/.test($(this).find('.a-expander-prompt').text().trim()));
                }).find('> .a-expander-inner'), // TODO: 気付いたら取引履歴が記載されなくなっていた(2024/11)
                $shipments = (() => {
                    let $shipments = $orderDetails.find('.od-shipments').children('.shipment');
                    if (0 < $shipments.length) {
                        return $shipments;
                    }
                    $shipments = $orderDetails.find('.shipment');
                    if (0 < $shipments.length) {
                        return $shipments;
                    }
                    return $orderDetails.find('[data-component="orderCard"] > [data-component="shipments"] > .a-box-group > .a-box');
                })();
            
            const
                order_url = order_detail_url,
                receipt_url = get_absolute_url(open_parameters.request_order_url),
                item_group_list = [],
                payment_method_list = [],
                payment_info_list = [];
            
            let order_date = '',
                order_id = '',
                order_subtotal_price = '',
                order_total_price = '',
                order_billing_destination = '',
                order_billing_amount = '',
                order_refund_amount = '',
                order_refund_invoice_url = '',
                order_invoice_links_request_url = '',
                common_shipping_destination = '',
                card_info_list = [],
                error_message = '';
            
            if (0 < $orderDateInvoice.get(0).children.length) {
                const
                    $order_date_invoice_items = $orderDetails.find('.order-date-invoice-item');
                order_date = get_formatted_date_string($order_date_invoice_items.eq(0).text());
                order_id = get_child_text_from_jq_element($order_date_invoice_items.eq(1).find('bdi'));
                order_refund_invoice_url = get_refund_invoice_url($orderDateInvoice.find('#a-popover-invoiceLinks ul'));
            }
            else if (0 < $briefOrderInfoInvoice.get(0).children.length) {
                const
                    $briefOrderInfoInvoiceLeftGrid = $briefOrderInfoInvoice.find('[data-component="briefOrderInfoInvoiceLeftGrid"]'),
                    $orderDate = $briefOrderInfoInvoiceLeftGrid.find('[data-component="orderDate"] > span'),
                    $orderId = $briefOrderInfoInvoiceLeftGrid.find('[data-component="orderId"] > span');
                
                if (0 < $orderDate.length) {
                    order_date = get_formatted_date_string($orderDate.text().trim());
                }
                if (0 < $orderId.length) {
                    order_id = $orderId.text().trim();
                }
                
                if ((order_date === '') || (order_id === '')) {
                    const
                        $date_orderid_info = $briefOrderInfoInvoice.find('[data-component="briefOrderInfo"] .a-icon-text-separator').parent();
                    
                    $date_orderid_info.contents().each(function(){
                        if (this.nodeType != 3) {
                            return;
                        }
                        const
                            work_text = this.nodeValue;
                        
                        if (order_date === '') {
                            order_date = get_formatted_date_string(work_text);
                        }
                        else if (order_id === '') {
                            order_id = work_text.match(/[\d\-]+/)[0] ?? '';
                        }
                    });
                }
                order_invoice_links_request_url = (() => {
                    try {
                        return get_absolute_url(JSON.parse($briefOrderInfoInvoice.find('[data-component="orderInvoice"] .a-declarative').attr('data-a-popover')).url);
                    }
                    catch (error) {
                        log_error(error);
                        return '';
                    }
                })();
            }
            else {
                log_error('(*) unknown format: order_date/order_id not found');
            }
            
            $subtotals.children('.a-row').each(function () {
                const
                    $a_row = $(this),
                    $text_left = $a_row.find('.a-text-left'),
                    $text_right = $a_row.find('.a-text-right.a-span-last');
                
                if (($text_left.length < 1) || ($text_right.length < 1)) {
                    return;
                }
                
                const
                    name = $text_left.text().replace(/[:：]/g, '').trim(),
                    price = get_price_number($text_right.text());
                
                if (/商品の小計/.test(name)) {
                    order_subtotal_price = price;
                    return;
                }
                if (/注文合計/.test(name)) {
                    order_total_price = price;
                    return;
                }
                if (/請求額/.test(name)) {
                    order_billing_amount = price;
                    return;
                }
                if (/返金額の合計/.test(name)) {
                    order_refund_amount = price;
                    return;
                }
                payment_info_list.push( {
                    header: name,
                    price: price,
                } );
            });
            
            common_shipping_destination = get_child_text_from_jq_element($shipping_address_container.find('.displayAddressFullName'));
            
            $payments_instrument_list.find('.pmts-payments-instrument-detail-box-paystationpaymentmethod > .a-list-item').each( function () {
                const
                    $payments_instrument_detail_item = $(this);
                
                payment_method_list.push($join_child_text($payments_instrument_detail_item));
            });
            
            // TODO: 気付いたら取引履歴が記載されなくなっていたため、カードの支払い明細等が取得できなくなってしまった(2024/11)
            let
                collation_billing_amount = get_price_number($transaction_history.text().replace(/\s+/g, ' ').split(/合計\s*[:：]/)[1]),
                work_billing_amount = 0;
            
            if (collation_billing_amount === '') {
                //log_info(`[${order_id}] collation_billing_amount is not found`); // [メモ] collation_billing_amountが無い：予約や搬送中、合計￥0注文などでこうなるので、基本的には異常ではない模様
                //collation_billing_amount = order_billing_amount;
                collation_billing_amount = 0;
            }
            
            $transaction_history.find('> .a-row').each(function (list_index) {
                const
                    $a_row = $(this),
                    status = $a_row.find('> .a-color-secondary').text().replace(/[:：]/g, '').trim(),
                    info = $a_row.find('> span:last').text().trim(),
                    [date_text, payment_info] = info.split(/-/, 2),
                    [card_type, amount_text] = payment_info.split(/[:：]/, 2),
                    card_billing_amount = get_price_number(amount_text);
                
                if ((card_billing_amount === '')) {
                    return;
                }
                work_billing_amount += card_billing_amount;
                
                const
                    card_billing_date = get_formatted_date_string(date_text);
                
                card_info_list.push({
                    card_type: card_type.trim(),
                    card_billing_date,
                    card_billing_amount,
                    card_billing_date_ms: (card_billing_date ? new Date(card_billing_date).getTime() : 32503680000000) + 23*3600000 + list_index,
                });
            });
            
            card_info_list.sort((a, b) => a.card_billing_date_ms - b.card_billing_date_ms);
            
            if (collation_billing_amount && (work_billing_amount != collation_billing_amount)) {
                // TODO: 取引履歴に同じ取引が複数回表示される場合がある模様（→合計と一致しなくなる）
                // → Amazon.co.jp側の問題なので、拡張機能側では対応困難
                //   ※日付が一番新しいものが怪しい(余分に追加されている)ことが多いように思われるが、確証がない→必ずしもそうとは限らないようで、自動で補正することは困難（2024/02/07）
                log_error(`[${order_id}] billing amount unmatch: ${work_billing_amount} != ${collation_billing_amount}`);
                log_info('card_info_list', JSON.stringify(card_info_list, null, 4));
                
                // [メモ] 余分なものを除去する試み（保留中）
                // アイデアとしては
                // - 合計が超えたらそれ以降は除去→不正な複製データが最初に出てきたらダメ
                // - 同じ金額が複数回出てきたら除去→同じ金額かつ正しいデータの場合に対応できないのでダメ
                /*
                //work_billing_amount = 0;
                //card_info_list = card_info_list.reduce((work_list, card_info) => {
                //    work_billing_amount += card_info.card_billing_amount;
                //    if (work_billing_amount <= collation_billing_amount) {
                //        work_list.push(card_info);
                //    }
                //    return work_list;
                //}, []);
                */
            }
            
            const
                get_shipment_item_group_default = (list_index, $shipment) => {
                    const
                        $order_info_left = $shipment.find('.a-col-left:first');
                    
                    const
                        item_list = [],
                        gift_token_info_list = [],
                        other_price_info_list = [],
                        card_info = {
                            card_type : '',
                            card_billing_date : '',
                            card_billing_amount : '',
                        },
                        status = $shipment.find('.js-shipment-info-container').text().trim(),
                        status_date = get_formatted_date_string(status), // TODO: 気付いたら年が省略されるようになってしまったので実質日付として取得できなくなっている(2025/02)
                        status_date_ms = (status_date ? new Date(status_date).getTime() : 32503680000000) + list_index;
                    
                    let is_gift_token = false,
                        subtotal_price = 0,
                        total_price = 0,
                        billing_amount = 0,
                        destination = common_shipping_destination;
                    
                    $order_info_left.find('.a-fixed-left-grid').each(function () {
                        const
                            remark_list = [];
                        
                        let name = '',
                            url = '',
                            remarks = '',
                            price = 0,
                            number = 1;
                        
                        const
                            $order_info = $(this),
                            $quantity = $order_info.find('.item-view-left-col-inner .item-view-qty'),
                            $yohtmlc = $order_info.find('.yohtmlc-item');
                        
                        if (0 < $quantity.length) {
                            number = parseInt($quantity.text().trim(), 10);
                        }
                        
                        $yohtmlc.children('.a-row').each(function () {
                            const
                                $a_row = $(this);
                            
                            if (0 < $a_row.find('[role="button"]').length) {
                                return;
                            }
                            
                            const
                                $product_link = $a_row.find('a.a-link-normal[href*="/product/"]');
                            
                            if (0 < $product_link.length) {
                                name = $product_link.text().trim();
                                url = get_absolute_url($product_link.attr('href'));
                                return;
                            }
                            
                            if (0 < price) {
                                // TODO: ギフトラッピング等の金額が商品価格の後に現れる場合がある
                                // →ラッピング価格等は$subtotals以下にも出ているのでとりあえず無視する(要検討)
                                return;
                            }
                            
                            const
                                $price = $a_row.find('.a-color-price');
                            
                            if (0 < $price.length) {
                                price = get_price_number($price.text());
                                return;
                            }
                            
                            remark_list.push($a_row.text().trim().replace(/\s+/, ' '));
                        });
                        
                        subtotal_price += price * number;
                        
                        remarks = remark_list.join(' ').trim();
                        
                        item_list.push({
                            name,
                            url,
                            remarks,
                            price,
                            number,
                            status,
                        });
                    });
                    
                    return {
                        is_gift_token,
                        subtotal_price,
                        total_price,
                        destination,
                        billing_amount,
                        status,
                        status_date_ms,
                        card_info,
                        item_list,
                        gift_token_info_list,
                        other_price_info_list,
                    };
                },
                
                get_shipment_item_group_variation1 = (list_index, $shipment) => {
                    const
                        $shipment_status = $shipment.find('[data-component="shipmentStatus"]'),
                        $purchased_items = $shipment.find('[data-component="purchasedItems"] .a-fixed-left-grid');
                    
                    const
                        item_list = [],
                        gift_token_info_list = [],
                        other_price_info_list = [],
                        card_info = {
                            card_type : '',
                            card_billing_date : '',
                            card_billing_amount : '',
                        },
                        status = $shipment_status.find('.od-status-message').text().trim(),
                        status_date = get_formatted_date_string(status), // TODO: 気付いたら年が省略されるようになってしまったので実質日付として取得できなくなっている(2025/02)
                        status_date_ms = (status_date ? new Date(status_date).getTime() : 32503680000000) + list_index;
                    
                    let is_gift_token = false,
                        subtotal_price = 0,
                        total_price = 0,
                        billing_amount = 0,
                        destination = common_shipping_destination;
                    
                    $purchased_items.each(function () {
                        let name = '',
                            url = '',
                            remarks = '',
                            price = 0,
                            number = 1;
                        
                        const
                            $purchased_item = $(this),
                            $image_container = $purchased_item.find('[data-component="purchasedItemsLeftGrid"]'),
                            $info_container = $purchased_item.find('[data-component="purchasedItemsRightGrid"]'),
                            $quantity = $image_container.find('.od-item-view-qty');

                        if (0 < $quantity.length) {
                            number = parseInt($quantity.text().trim(), 10);
                        }
                        
                        const
                            $itemTitle = $info_container.find('[data-component="itemTitle"]'),
                            $orderedMerchant = $info_container.find('[data-component="orderedMerchant"]'),
                            $itemReturnEligibility = $info_container.find('[data-component="itemReturnEligibility"]'),
                            $serviceAppointmentStatus = $info_container.find('[data-component="serviceAppointmentStatus"]'),
                            $unitPrice = $info_container.find('[data-component="unitPrice"]'),
                            $deliveryFrequency = $info_container.find('[data-component="deliveryFrequency"]'),
                            $customizedItemDetails = $info_container.find('[data-component="customizedItemDetails"]'),
                            $purchasedVariationDetails = $info_container.find('[data-component="purchasedVariationDetails"]'),
                            $giftcardsSender = $info_container.find('[data-component="giftcardsSender"]'),
                            $itemConnections = $info_container.find('[data-component="itemConnections"]'),
                            $giftCardDetails = $info_container.find('[data-component="giftCardDetails"]');
                            // TODO: 新しいフォーマットになった影響でどういう情報が入るのか精査できていない（2025/02現在）
                        
                        const
                            $product_link = $itemTitle.find('.a-link-normal');
                        
                        if (0 < $product_link.length) {
                            name = $product_link.text().trim();
                            url = get_absolute_url($product_link.attr('href'));
                        }
                        
                        const
                            $prices = $unitPrice.find('.a-price > span');
                            // TODO: '.a-offscreen'と'[aria-hidden="true"]'の二種類があり、どちらを採用してよいか不明→とりあえず、もし値に違いがあれば安い方を採用
                        
                        $prices.each(function () {
                            const
                                $price = $(this),
                                work_price = get_price_number($price.text());
                            
                            if ((price <= 0) || (work_price < price)) {
                                price = work_price;
                            }
                        });
                        
                        subtotal_price += price * number;
                        
                        remarks = [
                            $orderedMerchant, 
                            $itemReturnEligibility,
                            $serviceAppointmentStatus,
                            $deliveryFrequency,
                            $customizedItemDetails,
                            $purchasedVariationDetails,
                            $giftcardsSender,
                        ].reduce((remark_list, $part) => {
                            const
                                part_text = $part.text().trim().replace(/\s+/, ' ');
                            
                            if (part_text != '') {
                                remark_list.push(part_text);
                            }
                            return remark_list;
                        },[]).join(' ').trim();
                        
                        item_list.push({
                            name,
                            url,
                            remarks,
                            price,
                            number,
                            status,
                        });
                    });
                    
                    return {
                        is_gift_token,
                        subtotal_price,
                        total_price,
                        destination,
                        billing_amount,
                        status,
                        status_date_ms,
                        card_info,
                        item_list,
                        gift_token_info_list,
                        other_price_info_list,
                    };
                };
            
            $shipments.each(function (list_index) {
                const
                    $shipment = $(this);
                
                let shipment_pattern = 'default',
                    item_group;
                
                if (0 < $shipment.find('[data-component="shipmentsLeftGrid"]').length) {
                    shipment_pattern = 'variation1';
                }
                switch (shipment_pattern) {
                    case 'variation1':
                        item_group = get_shipment_item_group_variation1(list_index, $shipment);
                        break;
                    
                    default:
                        item_group = get_shipment_item_group_default(list_index, $shipment);
                        break;
                }
                
                item_group_list.push(item_group);
            });
            
            item_group_list.sort((a, b) => a.status_date_ms - b.status_date_ms);
            
            const
                order_parameters = {
                    is_except_page : false,
                    order_date,
                    order_id,
                    item_group_list,
                    order_subtotal_price,
                    order_total_price,
                    order_billing_destination,
                    order_billing_amount,
                    order_refund_amount,
                    order_refund_invoice_url,
                    order_invoice_links_request_url,
                    order_url,
                    receipt_url,
                    card_info_list,
                    payment_method_list,
                    payment_info_list,
                    error_message,
                };
            
            return order_parameters;
        }, // get_order_parameters_nondigital_from_order_detail_page()
        
        
        get_order_parameters_nondigital_from_giftcard_order_detail_page = function ($html_fragment) {
            const
                $orderDetails = $html_fragment.find('#orderDetails'),
                $order_date_invoice_items = $orderDetails.find('.order-date-invoice-item'),
                $summary_container = $orderDetails.find('.a-box-group.a-spacing-base'),
                $subtotals_container = $summary_container.find('.a-fixed-right-grid-col.a-col-right'),
                $subtotals = (() => {
                    let $subtotals = $subtotals_container.children('[data-component="orderSubtotals"]');
                    if ($subtotals.length < 1) {
                        $subtotals = $subtotals_container.filter(function () {
                            return /領収書/.test($(this).children('h5.a-text-left').text());
                        });
                    }
                    return $subtotals;
                })(),
                $payments_instrument_list = $summary_container.find('.pmts-payments-instrument-list'),
                $shipments = (() => {
                    let $shipments = $orderDetails.children('.a-box').filter(function () {
                            return (0 < $(this).find('.js-shipment-info-container').length);
                        });
                    
                    if ($shipments.length < 1) {
                        $shipments = $orderDetails.find('[data-component="shipments"] > .a-box').filter(function () {
                            return (0 < $(this).find('.js-shipment-info-container').length);
                        });
                    }
                    return $shipments;
                })();
            
            const
                order_url = order_detail_url,
                receipt_url = get_absolute_url(open_parameters.request_order_url),
                item_group_list = [],
                payment_method_list = [],
                payment_info_list = [];
            
            let order_date = '',
                order_id = '',
                order_subtotal_price = '',
                order_total_price = '',
                order_billing_destination = '',
                order_billing_amount = '',
                card_info_list = [],
                error_message = '';
            
            order_date = get_formatted_date_string($order_date_invoice_items.eq(0).text()),
            order_id = get_child_text_from_jq_element($order_date_invoice_items.eq(1).find('bdi')),
            
            $subtotals.children('.a-row').each(function () {
                const
                    $a_row = $(this),
                    $text_left = $a_row.find('.a-text-left'),
                    $text_right = $a_row.find('.a-text-right.a-span-last');
                
                if (($text_left.length < 1) || ($text_right.length < 1)) {
                    return;
                }
                
                const
                    name = $text_left.text().replace(/[:：]/g, '').trim(),
                    price = get_price_number($text_right.text());
                
                if (/商品の小計/.test(name)) {
                    order_subtotal_price = price;
                    return;
                }
                if (/注文合計/.test(name)) {
                    order_total_price = price;
                    return;
                }
                if (/請求額/.test(name)) {
                    order_billing_amount = price;
                    return;
                }
                payment_info_list.push( {
                    header: name,
                    price: price,
                } );
            });
            
            $payments_instrument_list.find('.pmts-payments-instrument-detail-box-paystationpaymentmethod > .a-list-item').each( function () {
                const
                    $payments_instrument_detail_item = $(this);
                
                payment_method_list.push($join_child_text($payments_instrument_detail_item));
            });
            
            $shipments.each(function (list_index) {
                const
                    $shipment = $(this),
                    $yohtmlc = $shipment.find('.yohtmlc-item'),
                    $yohtmlc_rows = $yohtmlc.children('.a-row'),
                    $product_link = $yohtmlc.find('a.a-link-normal[href*="/product/"]'),
                    $message_row = (2 < $yohtmlc_rows.length) ? $yohtmlc_rows.eq(1) : $(),
                    $gift_list_row = $yohtmlc_rows.eq(-1);
                
                const
                    item_list = [],
                    gift_token_info_list = [],
                    other_price_info_list = [],
                    card_info = {
                        card_type : payment_method_list.join('、'), // TODO: 支払い方法が複数あった場合には特定不可
                        card_billing_date : '',
                        card_billing_amount : order_billing_amount,
                    },
                    status = $shipment.find('.js-shipment-info-container').text().trim(),
                    status_date = '',
                    status_date_ms = 32503680000000 + list_index,
                    product_name = $product_link.text().trim(),
                    product_url = get_absolute_url($product_link.attr('href')),
                    message = $message_row.text().replace(/\s+/g, ' ').trim();
                
                let is_gift_token = true,
                    subtotal_price = 0,
                    total_price = 0,
                    billing_amount = 0,
                    destination = '';
                
                $gift_list_row.find('.gift-card-instance').each(function () {
                    const
                        $gift_card_instance = $(this),
                        price = get_price_number($gift_card_instance.children('.a-span2').text()),
                        destination = $gift_card_instance.children('.recipient').text().trim(),
                        status = $gift_card_instance.children('.a-span5.a-span-last').text().trim();
                    
                    gift_token_info_list.push({
                        name: product_name,
                        remarks: message,
                        price,
                        number: 1,
                        status,
                        destination,
                        url: product_url,
                    });
                });
                
                item_group_list.push({
                    is_gift_token,
                    subtotal_price,
                    total_price,
                    destination,
                    billing_amount,
                    status,
                    status_date_ms,
                    card_info,
                    item_list,
                    gift_token_info_list,
                    other_price_info_list,
                });
            });
            
            const
                order_parameters = {
                    is_except_page : false,
                    order_date,
                    order_id,
                    item_group_list,
                    order_subtotal_price,
                    order_total_price,
                    order_billing_destination,
                    order_billing_amount,
                    order_url,
                    receipt_url,
                    card_info_list,
                    payment_method_list,
                    payment_info_list,
                    error_message,
                };
            
            return order_parameters;
        }, // get_order_parameters_nondigital_from_giftcard_order_detail_page()
        
        
        get_order_parameters_nondigital_from_except_order_detail_page = function ($html_fragment) {
            const
                $order_summary = $html_fragment.find('#order-summary'),
                $delivery_destination = $html_fragment.find('#delivery-destination'),
                $line_items = $html_fragment.find('#line-items'),
                $item_list = $html_fragment.find('#item-list-page');
            
            const
                order_url = order_detail_url,
                receipt_url = get_absolute_url( open_parameters.request_order_url ),
                item_group_list = [],
                payment_method_list = [],
                payment_info_list = [];
            
            let order_date = '',
                order_id = '',
                order_subtotal_price = '',
                order_total_price = '',
                order_billing_destination = '',
                order_billing_amount = '',
                common_shipping_destination = '',
                card_info_list = [],
                error_message = '';
            
            const
                $order_date_items = $order_summary.children('.a-row').eq(1).find('.a-color-tertiary');
            
            order_id = ($order_date_items.eq(0).text().split(/[:：]/)[1] ?? '').trim();
            order_date = get_formatted_date_string($order_date_items.eq(1).text());
            
            common_shipping_destination = $delivery_destination.children('.a-row').eq(1).children('.a-size-base').contents().eq(0).text().trim();
            
            order_subtotal_price = get_price_number($order_summary.find('#ufpo-itemsSubtotal-amount').text());
            order_total_price = get_price_number($order_summary.find('#ufpo-total-amount').text());
            order_billing_amount = get_price_number($order_summary.find('#ufpo-grand-total-amount').text());
            payment_info_list.push({
                header: $order_summary.find('#ufpo-shippingTaxInclusive-label').text().trim().replace(/[:：]/g, ''),
                price: get_price_number($order_summary.find('#ufpo-shippingTaxInclusive-amount').text()),
            });
            
            $order_summary.find('.pmts-payments-instrument-list > .pmts-payments-instrument-detail-box-paystationpaymentmethod > .a-list-item').each(function (list_index) {
                const
                    $item = $(this),
                    card_type = $join_child_text($item);
                
                payment_method_list.push(card_type);
                
                card_info_list.push({
                    card_type,
                    card_billing_date: '', // TODO: 取得できない
                    card_billing_amount: order_billing_amount,
                    card_billing_date_ms: 32503680000000 + 23*3600000 + list_index,
                });
            });
            
            card_info_list.sort((a, b) => a.card_billing_date_ms - b.card_billing_date_ms);
            
            order_billing_destination = $order_summary.find('.pmts-billing-address-fullname > .a-list-item').text().trim();
            {
                const
                    item_list = [],
                    gift_token_info_list = [],
                    other_price_info_list = [],
                    card_info = {
                        card_type : '',
                        card_billing_date : '',
                        card_billing_amount : '',
                    },
                    status = '',
                    status_date = '',
                    status_date_ms = (status_date ? new Date(status_date).getTime() : 32503680000000);
                
                let is_gift_token = false,
                    subtotal_price = 0,
                    total_price = 0,
                    billing_amount = 0,
                    destination = common_shipping_destination;
                
                $item_list.find('[id$="-item-grid-row"]').each(function () {
                    const
                        remark_list = [];
                    
                    let name = '',
                        url = '',
                        remarks = '',
                        price = 0,
                        number = 1;
                    
                    const
                        $item = $(this),
                        $product_link = $item.find('a.a-link-normal[href*="/product/"]'),
                        number_string = $item.find('.a-column.a-span1').text().trim();
                    
                    name = $product_link.find('span').text().trim();
                    url = get_absolute_url($product_link.attr('href'));
                    let mult_price = get_price_number($item.find('[id$="-item-total-price"]').text()); // [メモ] 合計であることに注意
                    price = Math.ceil(mult_price / 2);
                    
                    if (/^\d+$/.test(number_string)) {
                        number = parseInt(number_string, 10);
                    }
                    subtotal_price += mult_price;
                    
                    remark_list.push($join_child_text($item.find('.ufpo-item-weight-column')));
                    remark_list.push($item.find('.ufpo-item-status-column.a-span-last .ufpo-item-status .a-box-inner').text().trim());
                    remarks = remark_list.join(' ').trim();
                    
                    item_list.push({
                        name,
                        url,
                        remarks,
                        price,
                        number,
                        status,
                    });
                });
                
                item_group_list.push({
                    is_gift_token,
                    subtotal_price,
                    total_price,
                    destination,
                    billing_amount,
                    status,
                    status_date_ms,
                    card_info,
                    item_list,
                    gift_token_info_list,
                    other_price_info_list,
                });
            }
            
            const
                order_parameters = {
                    is_except_page : true, // TODO: ページ内で拾えない情報がある(特に発送状態、請求日)
                    order_date,
                    order_id,
                    item_group_list,
                    order_subtotal_price,
                    order_total_price,
                    order_billing_destination,
                    order_billing_amount,
                    order_url,
                    receipt_url,
                    card_info_list,
                    payment_method_list,
                    payment_info_list,
                    error_message,
                };
            
            return order_parameters;
        }, // get_order_parameters_nondigital_from_except_order_detail_page()
        
        
        finish = function () {
            if ( ( ! order_detail_page_info ) || ( ! rendering_result ) ) {
                return;
            }
            
            var rendering_result_html = rendering_result.html;
            
            delete rendering_result.html;
            
            window.parent.postMessage( {
                request_order_url : open_parameters.request_order_url,
                html : rendering_result_html,
                order_detail_page_info : order_detail_page_info,
                rendering_result : rendering_result
            }, get_origin_url() ); // ※第二引数は targetOrigin（window.parentの生成元）→同一ドメインのため、簡略化
        }; // end of finish()
    
    wait_for_rendering( on_rendering_complete, {
        is_digital : open_parameters.is_digital,
    } );
    
    if ( ! OPTIONS.GET_PRODUCT_DETAIL_URL_FOR_CSV ) {
        order_detail_page_info = {
            url : order_detail_url,
            success : true,
            error_message : 'Omit getting product detail URL',
            refund_info : [],
            item_info_list : [],
        };
        
        finish();
        
        return;
    }
    
    $.ajax( {
        url : order_detail_url,
        type : 'GET',
        dataType : 'html',
        headers : { 'Accept' : "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8" },
        crossDomain : true // リクエストヘッダに X-Requested-With : XMLHttpRequest を含まないようにしないと、Amazon から HTML ではない形式で返されてしまう
    } )
        .done( function ( html ) {
            var jq_html_fragment = get_jq_html_fragment( html ),
                refund_info = ( open_parameters.is_digital ) ? get_refund_info_digital( jq_html_fragment ) : get_refund_info_nondigital( jq_html_fragment ),
                item_info_list = ( open_parameters.is_digital ) ? get_item_info_list_digital( jq_html_fragment ) : get_item_info_list_nondigital( jq_html_fragment ),
                order_parameters = ( open_parameters.is_digital ) ? null : get_order_parameters_nondigital_from_order_detail_page( jq_html_fragment );
            
            order_detail_page_info = {
                url : order_detail_url,
                success : true,
                //html : html,
                refund_info : refund_info,
                item_info_list : item_info_list,
                order_parameters : order_parameters,
            };
            
            if (
                (! refund_info) ||
                (0 < refund_info.refund_list.length) ||
                (order_parameters?.order_refund_amount === undefined)
            ) {
                finish();
                return;
            }
            
            (async () => {
                if (
                    (order_parameters.order_refund_amount !== '') && 
                    (order_parameters.order_refund_invoice_url === '') && 
                    (order_parameters.order_invoice_links_request_url !== '')
                ) {
                    const
                        response = await fetch(order_parameters.order_invoice_links_request_url);
                    if (response.ok) {
                        const
                            invoice_links_html = await response.text(),
                            $invoceLinksList = get_jq_html_fragment(invoice_links_html);
                        
                        order_parameters.order_refund_invoice_url = get_refund_invoice_url($invoceLinksList);
                    }
                }
                
                if (order_parameters.order_refund_invoice_url !== '') {
                    refund_info.refund_invoice_url = order_parameters.order_refund_invoice_url; // TODO: 返金明細書のURLはワンタイムのものかも知れない（参照するたびに変化し、古いものでアクセスするとエラーになる模様）
                    refund_info.refund_list.push({
                        date : '',
                        price : order_parameters.order_refund_amount,
                        remarks : '※詳細は注文概要を参照',
                    });
                }
                
                finish();
            })();
        } )
        .fail( function ( jqXHR, textStatus, errorThrown ) {
            log_error( order_detail_url, textStatus );
            
            order_detail_page_info = {
                url : order_detail_url,
                success : false,
                error_message : 'Fetch Failure'
            };
            
            finish();
        } );
    
} // end of init_order_page_in_iframe()


function init_order_history_part_in_iframe( open_parameters ) {
    log_debug( 'init_order_history_part_in_iframe() start:', location.href, open_parameters );
    
    var start_time = Date.now(),
        callback = ( records ) => {
            var stop_request = false;
            
            stop_observe();
            try {
                var encrypted_elements = document.querySelectorAll( '.csd-encrypted-sensitive' ),
                    order_infos = document.querySelectorAll( '.your-orders-content-container__content .order-card, #ordersContainer .order .order-info' ),
                    shipping_address_elements = document.querySelectorAll('[id^="shipToInsertionNode-shippingAddress"]'); // [2024/02] 「お届け先」も暗号化されるケースがある（その際、注文内容の暗号化は必ずしも行われない模様）
                
                log_debug( location.href, 'encrypted_elements:', encrypted_elements.length, 'order_infos:', order_infos.length, 'shipping_address_elements:', shipping_address_elements.length );
                
                if ( ( encrypted_elements.length <= 0 ) && ( 0 < order_infos.length ) && ( shipping_address_elements.length == [ ... shipping_address_elements ].filter( element => element.querySelector('.a-declarative') != null ).length ) ) {
                    log_debug( 'init_order_history_part_in_iframe() start:', Date.now() - start_time, 'ms', location.href );
                    
                    stop_request = true;
                    window.parent.postMessage( {
                        child_window_id : open_parameters.child_window_id,
                        request_page_url : open_parameters.request_page_url,
                        html : document.doctype.valueOf() + '\n' + document.documentElement.outerHTML,
                        error : false,
                    }, get_origin_url( open_parameters.parent_page_url ) );
                }
            }
            catch ( error ) {
                log_error( '***', error );
            }
            finally {
                if ( ! stop_request ) {
                    start_observe();
                }
            }
        },
        observer = new MutationObserver( callback ),
        start_observe = () => observer.observe( document.body, { childList : true, subtree : true } ),
        stop_observe = () => observer.disconnect();
    
    callback();
} // end of init_order_history_part_in_iframe()


function on_update_options( updated_options ) {
    if ( updated_options ) {
        Object.keys( updated_options ).forEach( function ( name ) {
            if ( updated_options[ name ] === null ) {
                OPTIONS[ name ] = DEFAULT_OPTIONS[ name ];
                return;
            }
            OPTIONS[ name ] = updated_options[ name ];
        } );
    }
    
    if ( ! ORDER_HISTORY_FILTER ) {
        init_order_history_page();
        return;
    }
    
    if ( Object.hasOwnProperty.call( updated_options, 'OPERATION' ) ) {
        if ( OPTIONS.OPERATION ) {
            ORDER_HISTORY_FILTER.activate();
        }
        else {
            ORDER_HISTORY_FILTER.suspend();
        }
    }
    
} // end of on_update_options()


function initialize( user_options ) {
    Object.keys( OPTIONS ).forEach( function ( name ) {
        DEFAULT_OPTIONS[ name ] = OPTIONS[ name ];
    } );
    
    if ( user_options ) {
        Object.keys( user_options ).forEach( function ( name ) {
            if ( user_options[ name ] === null ) {
                return;
            }
            OPTIONS[ name ] = user_options[ name ];
        } );
    }
    
    var open_parameters = ( function () {
            var open_parameters = {};
            
            try {
                open_parameters = JSON.parse( window.name );
                // TODO: MS-Edge 版 Tampermonkey だと、子 の window.name が undefined となってしまう
                
                if ( ! open_parameters ) {
                    return {};
                }
                
                if ( ( open_parameters.child_window_id === undefined ) || ( open_parameters.child_window_id.indexOf( SCRIPT_NAME + '-' ) != 0 ) ) {
                    return {};
                }
            }
            catch ( error ) {
                return {};
            }
            
            return open_parameters;
        } )();
    
    log_debug( 'open_parameters:', open_parameters );
    
    if ( open_parameters.child_window_id ) {
        switch ( open_parameters.type ) {
            case 'ORDER_HISTORY_PART' :
                init_order_history_part_in_iframe( open_parameters );
                break;
            
            default:
                if ( typeof open_parameters.additional_order_urls != 'undefined' ) {
                    init_first_order_page( open_parameters );
                }
                else {
                    init_order_page_in_iframe( open_parameters );
                }
                break;
        }
    }
    else {
        init_order_history_page();
    }

} // end of initialize()

// }


// ■ エントリポイント {
if ( typeof WEB_EXTENSION_INIT == 'function' ) {
    // 拡張機能から実行した場合、ユーザーオプションを読み込む
    WEB_EXTENSION_INIT( function ( user_options ) {
        initialize( user_options );
    }, function ( updated_options ) {
        on_update_options( updated_options );
    } );
}
else {
    initialize();
}

// }


} )();

// ■ end of file
