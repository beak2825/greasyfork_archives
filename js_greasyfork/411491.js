// ==UserScript==
// @name            YN-SearchOrigin
// @name:ja         Yahoo!ニュースの元記事を探す
// @namespace       https://furyutei.work
// @license         MIT
// @version         0.1.16
// @description     Find the original article of the article of Yahoo News Japan.
// @description:ja  Yahoo!ニュースの記事の、元となった記事探しを助けます
// @author          furyu
// @match           https://news.yahoo.co.jp/*
// @match           https://www.google.com/search*
// @grant           none
// @compatible      chrome
// @compatible      firefox
// @supportURL      https://github.com/furyutei/YN-SearchOrigin/issues
// @contributionURL https://memo.furyutei.work/about#send_donation
// @downloadURL https://update.greasyfork.org/scripts/411491/YN-SearchOrigin.user.js
// @updateURL https://update.greasyfork.org/scripts/411491/YN-SearchOrigin.meta.js
// ==/UserScript==

( async () => {
'use strict';

const
    SCRIPT_NAME = 'YN-SearchOrigin',
    DEBUG = false,
    
    IMAGE_ALT_TO_HOSTNAME_MAP = Object.assign( Object.create( null ), {
        'THE PAGE' : null,
        '47NEWS' : 'www.47news.jp',
        'テレビ朝日系（ANN）' : 'news.tv-asahi.co.jp',
        'Impress Watch' : 'watch.impress.co.jp',
    } ),
    
    HOSTNAME_TO_VALID_HOSTNAME_MAP = Object.assign( Object.create( null ), {
        'news.yahoo.co.jp' : null,
        'www.watch.impress.co.jp' : 'watch.impress.co.jp',
        'japanese.yonhapnews.co.kr' : 'jp.yna.co.kr',
    } ),
    
    CONTROL_CONTAINER_CLASS = SCRIPT_NAME + '-control-container',
    SEARCH_BUTTON_CLASS = SCRIPT_NAME + '-search-button',
    MODE_SELECTOR_CLASS = SCRIPT_NAME + '-mode-selector',
    SEARCHING_CLASS = SCRIPT_NAME + '-searching',
    CSS_STYLE_CLASS = SCRIPT_NAME + '-css-rule',
    
    SEARCH_BUTTON_TEXT = '元記事検索',
    MODE_SELECTOR_AUTO_TEXT = '自動',
    
    PAGE_TRANSITION_DELAY = 800, // TODO: Chromeで、ページ遷移までの時間が短すぎると(?) history に記録されない場合がある模様→止むをえず、遅延させている
    
    self = undefined,
    
    format_date = ( date, format, is_utc ) => {
        if ( ! format ) {
            format = 'YYYY-MM-DD hh:mm:ss.SSS';
        }
        
        let msec = ( '00' + ( ( is_utc ) ? date.getUTCMilliseconds() : date.getMilliseconds() ) ).slice( -3 ),
            msec_index = 0;
        
        if ( is_utc ) {
            format = format
                .replace( /YYYY/g, date.getUTCFullYear() )
                .replace( /MM/g, ( '0' + ( 1 + date.getUTCMonth() ) ).slice( -2 ) )
                .replace( /DD/g, ( '0' + date.getUTCDate() ).slice( -2 ) )
                .replace( /hh/g, ( '0' + date.getUTCHours() ).slice( -2 ) )
                .replace( /mm/g, ( '0' + date.getUTCMinutes() ).slice( -2 ) )
                .replace( /ss/g, ( '0' + date.getUTCSeconds() ).slice( -2 ) )
                .replace( /S/g, ( all ) => {
                    return msec.charAt( msec_index ++ );
                } );
        }
        else {
            format = format
                .replace( /YYYY/g, date.getFullYear() )
                .replace( /MM/g, ( '0' + ( 1 + date.getMonth() ) ).slice( -2 ) )
                .replace( /DD/g, ( '0' + date.getDate() ).slice( -2 ) )
                .replace( /hh/g, ( '0' + date.getHours() ).slice( -2 ) )
                .replace( /mm/g, ( '0' + date.getMinutes() ).slice( -2 ) )
                .replace( /ss/g, ( '0' + date.getSeconds() ).slice( -2 ) )
                .replace( /S/g, ( all ) => {
                    return msec.charAt( msec_index ++ );
                } );
        }
        
        return format;
    },
    
    get_gmt_datetime = ( time, is_msec ) => {
        let date = new Date( ( is_msec ) ? time : 1000 * time );
        
        return format_date( date, 'YYYY-MM-DD_hh:mm:ss_GMT', true );
    },
    
    get_log_timestamp = () => format_date( new Date() ),
    
    log_debug = ( ... args ) => {
        if ( ! DEBUG ) {
            return;
        }
        console.debug( '%c[' + SCRIPT_NAME + '] ' + get_log_timestamp(), 'color: gray;', ... args );
    },
    
    log = ( ... args ) => {
        console.log( '%c[' + SCRIPT_NAME + '] ' + get_log_timestamp(), 'color: teal;', ... args );
    },
    
    log_info = ( ... args ) => {
        console.info( '%c[' + SCRIPT_NAME + '] ' + get_log_timestamp(), 'color: darkslateblue;', ... args );
    },
    
    log_error = ( ... args ) => {
        console.error( '%c[' + SCRIPT_NAME + '] ' + get_log_timestamp(), 'color: purple;', ... args );
    },
    
    current_url_object = new URL( location.href ),
    
    WindowNameStorage = class {
        constructor( target_window, storage_name ) {
            const
                self = this;
            
            self.init( target_window, storage_name );
        }
        
        init( target_window, storage_name ) {
            const
                self = this;
            
            Object.assign( self, {
                target_window,
                storage_name,
            } );
            
            return self;
        }
        
        get value() {
            const
                self = this,
                target_window = self.target_window,
                storage_name = self.storage_name;
            
            if ( ( ! target_window ) || ( ! storage_name ) ) {
                return {};
            }
            
            try {
                return JSON.parse( target_window.name )[ storage_name ] || {};
            }
            catch ( error ) {
                return {};
            }
        }
        
        set value( spec_value ) {
            this.target_window.name = this.get_name( spec_value );
        }
        
        get_name( spec_value ) {
            const
                self = this,
                target_window = self.target_window,
                storage_name = self.storage_name;
            
            let original_name_params = {};
            
            if ( target_window ) {
                try {
                    original_name_params = JSON.parse( target_window.name );
                    if ( ! ( original_name_params instanceof Object ) ) {
                        original_name_params = {};
                    }
                }
                catch ( error ) {
                    original_name_params = {};
                }
            }
            
            try {
                if ( storage_name ) {
                    if ( spec_value === undefined ) {
                        delete original_name_params[ storage_name ];
                    }
                    else {
                        original_name_params[ storage_name ] = spec_value;
                    }
                }
                return JSON.stringify( original_name_params );
            }
            catch ( error ) {
                return '';
            }
        }
    },
    
    WindowControl = class {
        constructor( url = null, options = {} ) {
            const
                self = this;
            
            self.initial_url = url;
            self.child_window_counter = 0;
            self.existing_window = null;
            
            if ( ! url ) {
                return;
            }
            
            self.open( url, options );
        }
        
        open( url, options ) {
            const
                self = this;
            
            if ( ! options ) {
                options = {};
            }
            
            let child_window = options.existing_window || self.existing_window;
            
            if ( ! options.child_call_parameters ) {
                options.child_call_parameters = {};
            }
            
            try {
                Object.assign( options.child_call_parameters, {
                    script_name : SCRIPT_NAME,
                    child_window_id : '' + ( new Date().getTime() ) + '-' + ( ++ self.child_window_counter ),
                    transition_complete : false,
                } );
            }
            catch ( error ) {
                log_error( error );
            }
            
            if ( child_window ) {
                new WindowNameStorage( child_window, SCRIPT_NAME ).value = options.child_call_parameters;
                
                if ( child_window.location.href != url ) {
                    setTimeout( () => {
                        child_window.location.href = url;
                    }, PAGE_TRANSITION_DELAY );
                }
            }
            else {
                child_window = window.open( url, new WindowNameStorage( null, SCRIPT_NAME ).get_name( options.child_call_parameters ) );
                //new WindowNameStorage( child_window, SCRIPT_NAME ).value = options.child_call_parameters;
            }
            
            self.existing_window = child_window;
            
            return self;
        }
        
        close() {
            const
                self = this;
            
            if ( ! self.existing_window ) {
                return self;
            }
            
            try {
                self.existing_window.close();
            }
            catch ( error ) {
            }
            self.existing_window = null;
            
            return self;
        }
    },
    
    ModeControl = class {
        constructor() {
            this.storage_mode_info_name = SCRIPT_NAME + '-mode_info';
            this.load_mode_info();
        }
        
        load_mode_info() {
            try {
                this.mode_info = JSON.parse( localStorage.getItem( this.storage_mode_info_name ) );
            }
            catch ( error ) {
            }
            
            if ( ! this.mode_info ) {
                this.mode_info = {};
            }
            
            if ( Object.keys( this.mode_info ).length <= 0 ) {
                this.mode_info = {
                    is_automode : false,
                };
            }
        }
        
        save_mode_info() {
            localStorage.setItem( this.storage_mode_info_name, JSON.stringify( this.mode_info ) );
        }
        
        get is_automode() {
            return this.mode_info.is_automode;
        }
        
        set is_automode( specified_mode ) {
            this.mode_info.is_automode = !! specified_mode;
            this.save_mode_info();
        }
        
        create_control_element() {
            const
                self = this,
                control_element = document.createElement( 'label' ),
                automode_checkbox = document.createElement( 'input' );
            
            
            control_element.className = MODE_SELECTOR_CLASS;
            control_element.textContent = MODE_SELECTOR_AUTO_TEXT;
            
            automode_checkbox.type = 'checkbox';
            automode_checkbox.checked = self.is_automode;
            
            automode_checkbox.addEventListener( 'change', ( event ) => {
                event.stopPropagation();
                event.preventDefault();
                self.is_automode = automode_checkbox.checked;
            } );
            
            control_element.firstChild.before( automode_checkbox );
            
            return control_element;
        }
    },
    
    searching_icon_control = new class {
        constructor() {
            const
                self = this;
            
            self.searching_container = null;
        }
        
        create() {
            const
                self = this;
            
            if ( self.searching_container ) {
                return self;
            }
            
            const
                searching_icon_svg = '<svg version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" fill="none" r="10" stroke-width="4" style="stroke: currentColor; opacity: 0.4;"></circle><path d="M 12,2 a 10 10 -90 0 1 9,5.6" fill="none" stroke="currentColor" stroke-width="4" />',
                searchin_icon = document.createElement( 'div' ),
                searching_container = self.searching_container = document.createElement( 'div' );
            
            searchin_icon.className = 'icon';
            searchin_icon.insertAdjacentHTML( 'beforeend', searching_icon_svg );
            
            searching_container.className = SEARCHING_CLASS;
            searching_container.appendChild( searchin_icon );
            
            document.documentElement.appendChild( searching_container );
            return self;
        }
        
        hide() {
            const
                self = this;
            
            if ( ! self.searching_container ) {
                return self;
            }
            
            self.searching_container.classList.add( 'hidden' );
            return self;
        }
        
        show() {
            const
                self = this;
            
            if ( ! self.searching_container ) {
                return self;
            }
            
            self.searching_container.classList.remove( 'hidden' );
            return self;
        }
    },
    
    get_search_hostname = ( site_link ) => {
        let image_alt = ( site_link.querySelector( 'img[alt]' ) || {} ).alt,
            hostname = ( image_alt in IMAGE_ALT_TO_HOSTNAME_MAP ) ? IMAGE_ALT_TO_HOSTNAME_MAP[ image_alt ] : new URL( site_link.href ).hostname;
        
        if ( hostname ) {
            hostname = hostname.replace( /^www\./, '' );
        }
        
        if ( hostname && ( hostname in HOSTNAME_TO_VALID_HOSTNAME_MAP ) ) {
            hostname = HOSTNAME_TO_VALID_HOSTNAME_MAP[ hostname ];
        }
        
        return hostname;
    },
    
    get_search_info = () => {
        const
            site_link = document.querySelector( 'main[id="contents"] div[id="contentsWrap"] > article > header > div > div:last-child > a' );
        
        if ( ! site_link ) {
            return null;
        }
        
        const
            hostname = get_search_hostname( site_link );
        
        if ( ! hostname ) {
            return null;
        }
        
        const
            keyword = ( ( document.querySelector( 'main[id="contents"] div[id="contentsWrap"] > article > header > h1' ) || {} ).textContent || ( ( document.querySelector( 'meta[property="og:title"]' ) || {} ).content || document.title ).replace( /([(（].*?[）)])?\s*-[^\-]*$/, '' ) || '' ).trim();
        
        return {
            site_link,
            hostname,
            keyword,
            search_url : 'https://www.google.com/search?ie=UTF-8&q=' + encodeURIComponent( 'site:' + hostname + ' ' + keyword ),
        };
    },
    
    create_control_container = ( parameters ) => {
        if ( ! parameters ) {
            parameters = {};
        }
        
        let container = document.createElement( 'div' );
        
        container.className = CONTROL_CONTAINER_CLASS;
        
        return container;
    },
    
    create_button = ( parameters ) => {
        if ( ! parameters ) {
            parameters = {};
        }
        let button = document.createElement( 'a' );
        
        button.className = SEARCH_BUTTON_CLASS;
        button.textContent = SEARCH_BUTTON_TEXT;
        button.href = parameters.url ? parameters.url : '#';
        
        if ( parameters.onclick ) {
            button.addEventListener( 'click', parameters.onclick );
        }
        
        return button;
    },
    
    child_called_parameters = new WindowNameStorage( window, SCRIPT_NAME ).value,
    is_child_page = child_called_parameters.script_name,
    is_auto_transition_page = ! child_called_parameters.transition_complete,
    
    check_pickup_page = () => {
        log_debug( 'check_pickup_page()' );
        
        if ( document.querySelector( '.' + SEARCH_BUTTON_CLASS ) ) {
            return true;
        }
        
        const
            readmore_link = document.querySelector( '[data-ylk^="rsec:tpc_main;slk:headline;pos:"]' );
        
        if ( ! readmore_link ) {
            return false;
        }
        
        let
            container = create_control_container(),
            mode_control = new ModeControl(),
            button = create_button( {
                url : readmore_link.href,
                onclick : ( event ) => {
                    event.stopPropagation();
                    event.preventDefault();
                    
                    new WindowControl( readmore_link.href );
                },
            } );
        
        container.appendChild( button );
        button.after( mode_control.create_control_element() );
        readmore_link.after( container );
        
        if ( is_auto_transition_page && mode_control.is_automode ) {
            new WindowControl( readmore_link.href, {
                existing_window : window,
            } );
        }
        
        return true;
    },
    
    check_article_page = () => {
        log_debug( 'check_article_page()' );
        
        if ( document.querySelector( '.' + SEARCH_BUTTON_CLASS ) ) {
            return true;
        }
        
        const
            search_info = get_search_info();
        
        log_debug( 'search_info', search_info );
        
        if ( ! search_info ) {
            return false;
        }
        
        let
            container = create_control_container(),
            mode_control = new ModeControl(),
            button = create_button( {
                url : search_info.search_url,
                onclick : ( event ) => {
                    event.stopPropagation();
                    event.preventDefault();
                    
                    new WindowControl( search_info.search_url, {
                        child_call_parameters : {
                            hostname : search_info.hostname,
                            keyword : search_info.keyword,
                        },
                    } );
                },
            } );
        
        container.appendChild( button );
        button.after( mode_control.create_control_element() );
        search_info.site_link.after( container );
        
        if ( is_auto_transition_page && mode_control.is_automode ) {
            new WindowControl( search_info.search_url, {
                existing_window : window,
                child_call_parameters : {
                    hostname : search_info.hostname,
                    keyword : search_info.keyword,
                },
            } );
        }
        
        return true;
    },
    
    check_child_article_page = () => {
        log_debug( 'check_child_article_page()' );
        
        const
            search_info = get_search_info();
        
        log_debug( 'search_info', search_info );
        
        if ( ! search_info ) {
            return false;
        }
        
        setTimeout( () => {
            location.href = search_info.search_url;
        }, PAGE_TRANSITION_DELAY );
        
        return false;
    },
    
    check_search_page = () => {
        log_debug( 'check_search_page()' );
        
        const
            query = current_url_object.searchParams.get( 'q' ) || '',
            hostname = ( query.match( /(?:^|\s)site:([^\s]+)/ ) || [] )[ 1 ];
        
        if ( ! hostname ) {
            return true;
        }
        
        const
            site_link = [ ... document.querySelectorAll( '#rso .g > .rc > div > a, #rso .g a[ping]:not(.fl)' ) ].filter( link => {
                let url_object = new URL( link.href, location.href );
                
                if ( url_object.hostname.slice( - hostname.length ) == hostname ) {
                    return true;
                }
                
                let url = ( [ ... url_object.searchParams ].filter( param => param[ 0 ] == 'url' )[ 0 ] || [] )[ 1 ];
                
                if ( url && ( new URL( url ).hosname.slice( - hostname.length ) == hostname ) ) {
                    return true;
                }
                
                return false;
            } )[ 0 ];
        
        let name_storage = new WindowNameStorage( window, SCRIPT_NAME );
        
        name_storage.value = Object.assign( name_storage.value, {
            transition_complete : true,
        } );
        
        if ( ! site_link ) {
            current_url_object.searchParams.set( 'q', query.replace( /(^|\s)site:[^\s]+/, '$1-site:news.yahoo.co.jp' ) );
            setTimeout( () => {
                location.href = current_url_object.href;
            }, PAGE_TRANSITION_DELAY );
            return false;
        }
        
        setTimeout( () => {
            location.href = site_link.href;
        }, PAGE_TRANSITION_DELAY );
        
        return false;
    },
    
    check_page = ( () => {
        if ( /^\/pickup\//.test( current_url_object.pathname ) ) {
            return check_pickup_page;
        }
        
        if ( /^\/articles\//.test( current_url_object.pathname ) ) {
            if ( is_child_page && is_auto_transition_page ) {
                searching_icon_control.create().show();
                return check_child_article_page;
            }
            else {
                return check_article_page;
            }
        }
        
        if ( /(^www\.)?google\.com/.test( current_url_object.hostname ) && ( current_url_object.pathname == '/search' ) ) {
            if ( ! is_child_page ) {
                return null;
            }
            
            if ( ! is_auto_transition_page ) {
                return null;
            }
            
            searching_icon_control.create().show();
            
            return check_search_page;
        }
        return null;
    } )();

if ( ! check_page ) {
    return;
}

const
    insert_css_rule = () => {
        const
            css_rule_text = `
                .${CONTROL_CONTAINER_CLASS} {
                    background: lightblue !important;
                    text-align: center;
                }
                
                .${SEARCH_BUTTON_CLASS} {
                    display: inline-block !important;
                    margin: auto 8px !important;
                    text-align: center !important;
                    font-weight: bolder !important;
                    color: navy !important;
                    background: lightblue !important;
                }
                
                .${SEARCH_BUTTON_CLASS}:hover {
                    text-decoration: underline !important;
                }
                
                .${MODE_SELECTOR_CLASS} {
                    display: inline-block !important;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: bolder;
                }
                
                .${MODE_SELECTOR_CLASS} > input {
                    margin-right: 6px;
                }
                
                .${SEARCHING_CLASS} {
                    position: fixed;
                    top: 0px;
                    left: 0px;
                    z-index: 10000;
                    width: 100%;
                    height: 100%;
                    background: black;
                    opacity: 0.5;
                }
                
                .${SEARCHING_CLASS} .icon {
                    position: absolute;
                    top: 0px;
                    right: 0px;
                    bottom: 0px;
                    left: 0px;
                    margin: auto;
                    width: 100px;
                    height: 100px;
                    color: #f3a847;
                }
                
                .${SEARCHING_CLASS} .icon svg {
                    animation: searching 1.5s linear infinite;
                }
                
                @keyframes searching {
                    0% {transform: rotate(0deg);}
                    100% {transform: rotate(360deg);}
                }
                
                .${SEARCHING_CLASS}.hidden {
                    display: none;
                }
        `;
        
        let css_style = document.querySelector( '.' + CSS_STYLE_CLASS );
        
        if ( css_style ) css_style.remove();
        
        css_style = document.createElement( 'style' );
        css_style.classList.add( CSS_STYLE_CLASS );
        css_style.textContent = css_rule_text;
        
        document.querySelector( 'head' ).appendChild( css_style );
    },
    
    observer = new MutationObserver( ( records ) => {
        let stop_request = false;
        
        try {
            stop_observe();
            stop_request = check_page();
        }
        finally {
            if ( stop_request ) {
                searching_icon_control.hide();
            }
            else {
                start_observe();
            }
        }
    } ),
    start_observe = () => observer.observe( document.body, { childList : true, subtree : true } ),
    stop_observe = () => observer.disconnect();

document.body.addEventListener( 'click', ( event ) => {
    new WindowNameStorage( window, SCRIPT_NAME ).value = undefined;
}, true );

insert_css_rule();
start_observe();
check_page();

} )();
