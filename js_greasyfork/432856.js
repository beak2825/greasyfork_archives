// ==UserScript==
// @name        Reslator - LNMTL Plugin
// @author      Spawner
// @version     1.2.7
// @namespace   reader_translators
// @match       https://lnmtl.com/chapter/*
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @license     MIT
// @run-at      document-start
// @connect     fanyi.sogou.com
// @connect     fanyi.baidu.com
// @connect     test.niutrans.vip
// @connect     translate.googleapis.com
// @connect     fanyi.yeekit.com
// @require     http://code.jquery.com/jquery-3.4.1.min.js
// @description 6/1/2020, 1:51:50 PM
// @downloadURL https://update.greasyfork.org/scripts/432856/Reslator%20-%20LNMTL%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/432856/Reslator%20-%20LNMTL%20Plugin.meta.js
// ==/UserScript==

/*

        | Plugin      : Reslator
        | Version     : 1.2.7
        | Author      : Spawner

        | Description : Reader & Translator, which gives the user a better experience.


        CHANGELOG :

        1.0     -   Initial release
        
        1.1     -   Add Glossary support
        
        1.2     -   + Fixed : Word higlighter 
                    + Raw on click delay
        
        1.2.1   -   Fixed comments section
          
        1.2.2   -   + Improve performance 
                    + Fixing a small issue in the glossary
        
        1.2.3   -   + Performance improvement
                    + Add secondary theme switcher 
                    + Save raw/original text state
        
        1.2.4   -   Improve baidu speed + Fix translation display
        
        1.2.5   -   Fix niutrans API
          
        1.2.6   -   Added a new provider
        
        1.2.7   -   + Navigation between chapters has become much smoother.
                    + Changing the main font of the reader for a better a better one.
                    + Adding a font size controller.
                    + Fixed font delay problem.
*/

let iframeHandler;

let uniqueWords             = new Map();

let autoThemeState          = GM_SuperValue.get( 'autoThemeState' , false );
let autoReaderState         = GM_SuperValue.get( 'autoReaderState', false );
let autoRawState            = GM_SuperValue.get( 'autoRawState'   , false );

let providerOriginalState   = GM_SuperValue.get( 'providerOriginalState', false );
let providerGoogleState     = GM_SuperValue.get( 'providerGoogleState'  , false );
let providerSogouState      = GM_SuperValue.get( 'providerSogouState'   , false );
let providerNiutransState   = GM_SuperValue.get( 'providerNiutransState', false );
let providerBaiduState      = GM_SuperValue.get( 'providerBaiduState'   , false );
let providerYeekitState     = GM_SuperValue.get( 'providerYeekitState'  , false );

let secondaryTheme          = GM_SuperValue.get( 'secondaryTheme'       , "" );
let fontSizeValue           = GM_SuperValue.get( 'fontSizeValue'        , "" );
let fontSizeValueDefault    = GM_SuperValue.get( 'fontSizeValueDefault' , "" );

const providers             = [ "Google", "Sogou", "Niutrans", "Baidu", "Yeekit" ];

let isTranslated    =
{
    Google    : [providerGoogleState  , false],
    Niutrans  : [providerNiutransState, false],
    Sogou     : [providerSogouState   , false],
    Baidu     : [providerBaiduState   , false],
    Yeekit    : [providerYeekitState  , false]
};

const providerObject =
{
    Google:
    {
        maxSize   : 5000,
        timeout   : 0,
        color     : ['48, 175, 219', 0.04]
    },
    Niutrans:
    {
        maxSize   : 4000,
        timeout   : 400,
        color     : ['235, 77, 75', 0.06]
    },
    Sogou:
    {
        maxSize   : 4000,
        timeout   : 1700,
        color     : ['255, 164, 58', 0.06]
    },
    Baidu:
    {
        maxSize   : 2000,
        timeout   : 30,
        color     : ['140, 122, 230', 0.1]
    },
    Yeekit:
    {
        maxSize   : 4000,
        timeout   : 500,
        color     : ['120, 224, 143', 0.1]
    },    
    DeepL:
    {
        maxSize   : 4000,
        timeout   : 500,
        color     : ['75, 75, 75', 0.1]
    },
}

/**
     *   Show text
     *
     *   If no translation is enabled, show the original text
     *   otherwise hide it.
*/
if( !providerGoogleState && !providerSogouState && !providerNiutransState && !providerBaiduState )
    providerOriginalState = true;

if( fontSizeValue === "" || fontSizeValueDefault === "" )
{
    fontSizeValue = "20"; 
    fontSizeValueDefault = "19";
}

/**
     *   Apply the theme properly.
     *
     *   The reason to set the display as 'none' and opacity as '0'
     *   is to avoid the iframe onload screen flash, we also need to hide the scrollbar
     *   since we will be using the iframe one.
*/
if ( autoReaderState )
{
    GM_addStyle(
        `
        html
        {
            background-color  : ${autoThemeState ? '#E9E9E9' : '#25282F'};
        }
        #app
        {
            display           : none;
            opacity           : 0;
            overflow-y        : hidden;
        }
      `
    );
}

/*
    *   Initializing our CSS Styles
    *
    *   The iframe ( #pageContainer ) needs to be created at document-start
    *   to avoid any performance issues.
*/
GM_addStyle( `
    #pageContainer, #pagePreload
    {
        font-family     : Open sans;
        position        : fixed;
        top             : 0px;
        left            : 0px;
        overflow-y      : scroll;
        width           : 100%;
        height          : 100%;
        display         : block;
        border-width    : 0px;
    }
`);

/*  *   Global variables for theme & settings Colors
    *
    *   Using the :root selector to easily
    *   switch between colors.
*/
let CSSRoot = `
    :root
    {
        --background-color          : #E9E9E9;
        --close-btn-back-color      : #fff;
        --close-btn-fore-color      : #000;
        --title-color               : #000;
        --chapter-color             : #000;
        --raw-color                 : #424242;
        --settings-t-clicked-color  : #E9E9E9;
        --settings-label-color      : rgba(51, 47, 53, 0.4);
        --settings-check-back-color : linear-gradient(to right, #000000, #434343);

        --checked-background        : #029992;
        --checked-background-rgb    : 2, 153, 146;
    }

    [data-theme="dark"]
    {
        --background-color          : #25282F;
        --close-btn-back-color      : #000;
        --close-btn-fore-color      : #fff;
        --title-color               : #fff;
        --chapter-color             : #E9E9E9;
        --raw-color                 : #424242;
        --settings-t-clicked-color  : #25282F;
        --settings-label-color      : #E9E9E9;
        --settings-check-back-color : #E9E9E847;

        --checked-background        : #029992;
        --checked-background-rgb    : 2, 153, 146;
    }

    [data-sec-theme="gold"]
    {
        --checked-background        : #F39B3A;
        --checked-background-rgb    : 243, 155, 58;
    }

    [data-sec-theme="moon"]
    {
        --checked-background        : #9c88ff;
        --checked-background-rgb    : 156, 136, 255;
    }

    [data-sec-theme="bomb"]
    {
        --checked-background        : #eb4d4b;
        --checked-background-rgb    : 235, 77, 75;
    }

    [data-sec-theme="default"]
    {
        --checked-background        : #029992;
        --checked-background-rgb    : 2, 153, 146;
    }
`;

/*  *  Our iframe body styles
    *
    *  Note : To avoid the scroll flickering issue we will
    *  be using will-change : transform as a temporary solution.
*/
let CSSContainer = `

    html
    {
        background-color    : var(--background-color);
    }

    @keyframes fadein
    {
        from
        {
            opacity        : 0;
        }
        to
        {
            opacity        : 1;
        }
    }

    .chapterBody
    {
        position          : relative    !important;
        font-family       : "Source Sans Pro" !important;
        text-align        : justify     !important;
        animation         : fadein 3s;
        will-change       : transform;
        overflow          : visible;
        color             : var(--chapter-color);
        max-width         : 72%;
        min-height        : 100%;
        margin            : 0 auto;
        padding-bottom    : 80px;
    }

    .pageContainerBackground
    {
        animation         : fadein 1s;
        min-height        : 100%;
    }

    .pageContainerSettings
    {
        transition        : all 0.35s ease-in-out;
        background-color  : transparent !important;
        margin            : auto;
    }

    .pageSplit
    {
        animation         : fadein 3s;
        border-bottom     : 1px solid rgba(var(--checked-background-rgb), 0.3)  !important;
        /*margin            : 0px 0px 10px;*/
    }

    h1.header-title
    {
        color             : var(--checked-background);
        animation         : fadein 3s;
        font-family       : Poppins;
        font-weight       : 300;
        font-size         : 2.25em;
        text-align        : center;
        padding-bottom    : .3em;
        line-height       : 1.2;
        margin            : 3em auto .2em;
        color             : var(--title-color);
        text-shadow       : 0 0 4px rgba(0, 0, 100,.5);
    }
`;

let CSSForm = `

    .settingsForm
    {
        will-change       : transform;
        position          : relative;
        justify-content   : center;
        margin-left       : -16;
        margin-top        : 20;
        flex-wrap         : wrap;
    }

    form
    {
        font-size         : 13px;
        letter-spacing    : .2em;
        font-family       : sans-serif;
        display           : flex;
        margin-top        : 0em;
    }

    label
    {
        user-select       : none;
        color             : var(--settings-label-color);
        text-transform    : uppercase;
        font-family       : sans-serif;
        display           : flex;
        font-weight       : bold;
        padding           : 7px 16px;
        /* margin-right   : -4px; */
    }

    input[type=checkbox],
    input[type=radio]
    {
        color             : #000;
        position          : normal;
        visibility        : hidden;
        display           : none;
    }

    input[type=checkbox][value=o-translator-p]:checked+label
    {
        background        : #fff;
        cursor            : pointer;
    }
    input[type=checkbox][value=o-translator-p]:hover+label
    {
        color             : #000;
        cursor            : pointer;
    }

    input[type=checkbox][value=g-translator-p]:checked+label
    {
        color             : #fff;
        background        : var(--settings-check-back-color);
        cursor            : pointer;
    }

    input[type=checkbox][value=s-translator-p]:checked+label
    {
        color             : #fff;
        background        : var(--settings-check-back-color);
        cursor            : pointer;
    }

    input[type=checkbox][value=n-translator-p]:checked+label
    {
        color             : #fff;
        background        : var(--settings-check-back-color);
        cursor            : pointer;
    }

    input[type=checkbox][value=b-translator-p]:checked+label
    {
        color             : #fff;
        background        : var(--settings-check-back-color);
        cursor            : pointer;
    }

    input[type=checkbox][value=y-translator-p]:checked+label
    {
        color             : #fff;
        background        : var(--settings-check-back-color);
        cursor            : pointer;
    }

    input[type=checkbox][name=g-translator-p]:checked+label,
    input[type=radio][name=g-translator-p]:checked+label
    {
        color             : #fff;
        background        : #000;
        cursor            : pointer;
    }

    input[type=checkbox]+label:hover,
    input[type=radio]+label:hover
    {
        /* transition     : all 0.25s ease-in-out; */
        color             : #fff;
        cursor            : pointer;
    }

    input[type=checkbox]+label,
    input[type=radio]+label
    {
        transition        : all 0.15s cubic-bezier(0.4, 0, 0.6, 1) 0s;
        background        : var(--settings-t-clicked-color);
        color             : #545454;
    }

    input[type=radio][value=raw]:checked+label
    {
        color             : #fff;
        background        : #7DD7FB;
        cursor            : default;
    }

    input[type=radio][value=mode-enabled]:checked+label
    {
        transition        : all 200ms ease;
        background        : var(--checked-background);
        color             : #fff;
        cursor            : default;
    }

    input[type=radio][value=mode-disabled]:checked+label
    {
        background        : #25282F;
        color             : #fff;
        cursor            : default;
    }

    input[type=radio][value=theme-enabled]:checked+label
    {
        background        : #fff;
        color             : #000;
        cursor            : default;
    }

    input[type=radio][value=theme-disabled]:checked+label
    {
        background        : #000;
        color             : #fff;
        cursor            : default;
    }

    .radio-group,
    .checkbox-group
    {
        font-size         : 9px;
        letter-spacing    : .2em;
        border            : solid 0px rgb(125, 214, 255);
        display           : flex;
        margin            : 0px 0px 30px;
        border-radius     : 20px;
        overflow          : hidden;
        box-shadow        : rgba(0, 0, 0, 0.3) 0px 8px 16px 0px;
        opacity           : 0.7;
    }

    .radio-group:hover,
    .checkbox-group
    {
        opacity           : 1;
        transition        : 1.0s;
    }
`;

let CSSChapterBody = `

    .sentence
    {
              animation         : fadein 2s;
    }
    .sentence.or
    {
        margin-block-end: -0.5em !important;
        word-spacing      : 1px;
        text-align        : initial;
        font-weight       : 300;
        line-height       : 1.7;
        margin-top        : 3.1em;
        font-size         : 20px;
    }

    .sentence.google.default
    {
        padding           : 0px;
        background        : transparent;
        border-left-style : none;
        word-spacing      : 1px;
        text-align        : initial;
        font-weight       : 300;
        line-height       : 1.7;
        margin-top        : 3.1em;
        font-size         : 20px;
    }

    .sentence.sogou.default
    {
        padding           : 0px;
        background        : transparent;
        border-left-style : none;
        word-spacing      : 1px;
        text-align        : initial;
        font-weight       : 300;
        line-height       : 1.7;
        margin-top        : 3.1em;
        font-size         : 20px;
    }

    .sentence.niutrans.default
    {
        padding           : 0px;
        background        : transparent;
        border-left-style : none;
        word-spacing      : 1px;
        text-align        : initial;
        font-weight       : 300;
        line-height       : 1.7;
        margin-top        : 3.1em;
        font-size         : 20px;
    }

    .sentence.baidu.default
    {
        padding           : 0px;
        background        : transparent;
        border-left-style : none;
        word-spacing      : 1px;
        text-align        : initial;
        font-weight       : 300;
        line-height       : 1.7;
        margin-top        : 3.1em;
        font-size         : 20px;
    }

    .sentence.yeekit
    {
        margin-block-end: -0.5em !important;
        word-spacing      : 1px;
        text-align        : initial;
        animation         : fadein 0.4s;
        line-height       : 1.7;
        font-size         : 17px;
        border-left-style : solid;
        border-color      : transparent transparent transparent rgb(${providerObject["Yeekit"]["color"][0]});
        padding           : 10 10px;
        background        : rgba(${providerObject["Yeekit"]["color"][0]}, ${providerObject["Yeekit"]["color"][1]});
        margin            : 25 0;
    }

    .sentence.yeekit.default
    {
        padding           : 0px;
        background        : transparent;
        border-left-style : none;
        word-spacing      : 1px;
        text-align        : initial;
        font-weight       : 300;
        line-height       : 1.7;
        margin-top        : 3.1em;
        font-size         : 20px;
    }

    .sentence.sogou
    {
        margin-block-end: -0.5em !important;
        word-spacing      : 1px;
        text-align        : initial;
        animation         : fadein 1s;
        line-height       : 1.7;
        font-size         : 17px;
        border-left-style : solid;
        border-color      : transparent transparent transparent rgb(${providerObject["Sogou"]["color"][0]});
        padding           : 10 10px;
        background        : rgba(${providerObject["Sogou"]["color"][0]}, ${providerObject["Sogou"]["color"][1]});
        margin            : 25 0;
    }

    .sentence.google
    {
        margin-block-end: -0.5em !important;
        word-spacing      : 1px;
        text-align        : initial;
        animation         : fadein 1s;
        line-height       : 1.7;
        font-size         : 18px;
        border-left-style : solid;
        border-color      : transparent transparent transparent rgb(${providerObject["Google"]["color"][0]});
        padding           : 10 10px;
        background        : rgba(${providerObject["Google"]["color"][0]}, ${providerObject["Google"]["color"][1]});
        margin            : 25 0;
    }

    .sentence.niutrans
    {
        margin-block-end: -0.5em !important;
        animation         : fadein 1s;
        line-height       : 1.7;
        font-size         : 18px;
        border-left-style : solid;
        border-color      : transparent transparent transparent rgb(${providerObject["Niutrans"]["color"][0]});
        padding           : 10 10px;
        background        : rgba(${providerObject["Niutrans"]["color"][0]}, ${providerObject["Niutrans"]["color"][1]});
        margin            : 25 0;
    }

    .sentence.baidu
    {
        margin-block-end: -0.5em !important;
        word-spacing      : 1px;
        text-align        : initial;
        animation         : fadein 1s;
        line-height       : 1.7;
        font-size         : 18px;
        border-left-style : solid;
        border-color      : transparent transparent transparent rgb(${providerObject["Baidu"]["color"][0]});
        padding           : 10 10px;
        background        : rgba(${providerObject["Baidu"]["color"][0]}, ${providerObject["Baidu"]["color"][1]});
        margin            : 25 0;
    }

    .sentence.deepl
    {
        margin-block-end: -0.5em !important;
        word-spacing      : 1px;
        text-align        : initial;
        animation         : fadein 1s;
        line-height       : 1.7;
        font-size         : 18px;
        border-left-style : solid;
        border-color      : transparent transparent transparent rgb(${providerObject["DeepL"]["color"][0]});
        padding           : 10 10px;
        background        : rgba(${providerObject["DeepL"]["color"][0]}, ${providerObject["DeepL"]["color"][1]});
        margin            : 25 0;
    }

    .sentence.edit 
    {
        overflow: hidden;
        background: none;
        outline: none;
        resize: none;
        margin-block-end: -0.5em !important;
        word-spacing: 1px;
        text-align: initial;
        animation: fadein 0.5s;
        line-height: 1.7;
        font-size: 18px;
        border-left-style: solid;
        padding: 10 20px;
        margin: 25 0;
        background-color: var(--background-color);
        box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.1), 0 0 1px 0 rgba(0, 0, 0, 0.2);
        color: var(--title-color);
        border-radius: 13px;
        border-left-color: var(--checked-background);
    }

    .original
    {
        display           : inline;
        word-spacing      : 1px;
        text-align        : initial;
        font-weight       : 600;
        font-size         : 19px;
        /*margin-bottom     : 3.8em;*/
        color             : var(--checked-background);
    }

    .highlighter
    {
        font-weight       : 500;
        /*animation         : fadein 1s;*/
    }
`;

let CSSTooltip = `
    .tooltip
    {
        position          : relative;
        display           : inline;
    }

    .tooltip .tooltip-text
    {
        visibility        : hidden;
        width             : 120px;
        background-color  : #555;
        color             : #fff;
        text-align        : center;
        /* border-radius  : 6px; */
        padding           : 3px 0;
        position          : absolute;
        z-index           : 1;
        opacity           : 0;
        transition        : opacity 0.3s;
    }

    /* Tooltip top content */
    .top .tooltip-text
    {
        bottom            : 100%;
        left              : 50%;
        margin-left       : -60px; /* 120/2 = 60 */
    }

    .tooltip .tooltip-text::after
    {
        content           : "";
        position          : absolute;
        border-width      : 5px;
        border-style      : solid;
    }

    /* Tooltip top arrow */
    .top .tooltip-text::after
    {
        margin-left       : -5px;
        left              : 50%;
        top               : 100%;
        border-color      : var(--checked-background) transparent transparent transparent;
    }

    .tooltip:hover .tooltip-text
    {
        visibility        : visible;
        opacity           : 1;
    }

    .highlighter-default
    {
          
        /* animation         : fadein 1s; */
        /* font-weight       : 600; */
    }
`;

let CSSNextPrevArrow = `

    .arrow
    {
        position          : fixed;
        top               : 90%;
        width             : 4vmin;
        height            : 4vmin;
        background        : transparent;
        border-top        : 1vmin solid gray;
        border-right      : 1vmin solid black;
        box-shadow        : 0 0 0 black;
        transition        : all 200ms ease;
        opacity           : 0.4;
    }

    .arrow.left
    {
        cursor            : pointer;
        /* left           : 55px; */
        right             : 3%;
        top               : 88%;
        transform         : translate3d(0, -50%, 0) rotate(-135deg);
    }

    .arrow.right
    {
        cursor            : pointer;
        right             : 4%;
        top               : 78%;
        transform         : translate3d(0,-50%,0) rotate(45deg);
    }

    .arrow:hover
    {
        border-color      : #2d3436;
        box-shadow        : 0.5vmin -0.5vmin 0 white;
        opacity           : 1;
    }

    .arrow: before
    {
        content           : '';
        position          : absolute;
        top               : 50%;
        left              : 50%;
        transform         : translate(-40%,-60%) rotate(45deg);
        width             : 200%;
        height            : 200%;
    }
`;

let CSSCloseBtn =
    `
    .close-button
    {
        box-shadow        : rgba(0, 0, 0, 0.4) 0px 8px 16px 0px;
        width             : 5vmin;
        height            : 5vmin;
        box-shadow        : 0px 10 10px 10px rgba(0, 0, 0, 0.25);
        border-radius     : 50%;
        background        : var(--close-btn-back-color);
        position          : fixed;
        right             : 3.6%;
        top               : 67%;
        display           : block;
        z-index           : 200;
        text-indent       : -9999px;
        cursor            : pointer;
    }

    .close-button:before,
    .close-button:after
    {
        content           : '';
        width             : 55%;
        height            : 2px;
        background        : var(--close-btn-fore-color);
        position          : absolute;
        top               : 48%;
        left              : 22%;
        -webkit-transform : rotate(-45deg);
        -moz-transform    : rotate(-45deg);
        -ms-transform     : rotate(-45deg);
        -o-transform      : rotate(-45deg);
        transform         : rotate(-45deg);
        -webkit-transition: all 0.3s ease-out;
        -moz-transition   : all 0.3s ease-out;
        -ms-transition    : all 0.3s ease-out;
        -o-transition     : all 0.3s ease-out;
        transition        : all 0.3s ease-out;
    }

    .close-button:after
    {
        -webkit-transform : rotate(45deg);
        -moz-transform    : rotate(45deg);
        -ms-transform     : rotate(45deg);
        -o-transform      : rotate(45deg);
        transform         : rotate(45deg);
        -webkit-transition: all 0.3s ease-out;
        -moz-transition   : all 0.3s ease-out;
        -ms-transition    : all 0.3s ease-out;
        -o-transition     : all 0.3s ease-out;
        transition        : all 0.3s ease-out;
    }

    .close-button:hover:before,
    .close-button:hover:after
    {
        -webkit-transform: rotate(180deg);
        -moz-transform   : rotate(180deg);
        -ms-transform    : rotate(180deg);
        -o-transform     : rotate(180deg);
        transform        : rotate(180deg);
    }
`;

let CSSBtnTheme = `
    .fa,
    .fab,
    .fal,
    .far,
    .fas 
    {
        line-height: 0;
    }

    ul 
    {
        animation: fadein 2s;
        padding: 0;
        position: relative;
        margin: 0 0 100 0;
        transform: scale(0.65);
        justify-content: start;
        display: inline-block;
        flex-direction: row;
        flex-wrap: nowrap;
        /* justify-content: end; */
        align-items: unsafe;
        /* align-content: end; */
        margin: 0 -5vmin;
        /* margin: 0 500px; */
        /* margin-bottom: 7.8em !important; */
        padding-inline-start: 0px !important;
        display: inline-flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: baseline;
        align-content: stretch;
    }


    ul li 
    {
        animation    : fadein 1s;

        list-style   : none;
        margin       : 0 7px;
        display      : block;
    }

    ul li:after, .rr-font--update.rr-inc:after
    {
        pointer-events: none;
        content: "";
        position: absolute;
        top: -140px;
        bottom: -230px;
        right: 0;
        z-index: 10;
        /* padding-left: 320; */
        border-right: 1.0px solid rgba(var(--checked-background-rgb), 0.3);
        transform: rotate(30deg);
    }

    ul li a 
    {
        position     : relative;
        display      : list-item;
        width        : 60px;
        height       : 60px;
        text-align   : center;
        line-height  : 63px;
        background   : var(--background-color);
        border-radius: 50%;
        font-size    : 35px;
        color        : darkgray;
        transition   : .5s;
    }

    ul li a:hover 
    {
        cursor       : pointer;
    }

    ul li a::before 
    {
        content      : '';
        position     : absolute;
        top          : 0;
        left         : 0;
        width        : 100%;
        height       : 100%;
        border-radius: 50%;
        background   : #009992;
        transition   : .5s;
        transform    : scale(.9);
        z-index      : -1;
    }
    
    ul li a:hover
    {
        color      : black;
    }

    ul li a:hover::before 
    {
        transform : scale(1.1);
        background: #009992;
    }

    ul li:nth-child(1) a::before 
    {
        background: #ffee10;
    }

    ul li:nth-child(1) a:hover::before 
    {
        box-shadow: 0 0 10px #e67e22;
    }

    ul li:nth-child(1) a:hover 
    {
        box-shadow : 0 0 5px #e67e22;
        text-shadow: 0 0 5px #e67e22;
    }

    ul li:nth-child(2) a::before 
    {
        background: #95a5a6;
    }

    ul li:nth-child(2) a:hover::before 
    {
        box-shadow: 0 0 10px #9b59b6;
    }

    ul li:nth-child(2) a:hover 
    {
        box-shadow : 0 0 5px #9b59b6;
        text-shadow: 0 0 5px #9b59b6;
    }

    ul li:nth-child(3) a::before 
    {
        background: #e74c3c;
    }

    ul li:nth-child(3) a:hover::before 
    {
        box-shadow: 0 0 10px #e74c3c;
    }

    ul li:nth-child(3) a:hover 
    {
        box-shadow : 0 0 5px #e74c3c;
        text-shadow: 0 0 5px #e74c3c;
    }

    ul li:nth-child(4) a:hover::before 
    {
        box-shadow: 0 0 10px #029992;
    }

    ul li:nth-child(4) a:hover 
    {
        box-shadow : 0 0 5px #029992;
        text-shadow: 0 0 5px #029992;
    }


    /*ul li a
    {
        color: transparent;
    }*/
`;

let CSSTagBtn = `

    .settings-container 
    {
        animation: fadein 3s;
        overflow: hidden;
        border-bottom: 1px solid rgba(var(--checked-background-rgb), 0.3);
        margin-bottom: 150px;
          display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: center;
        align-content: stretch;
    }

    .raw-block 
    {
        /* margin-bottom: 4.8em; */
        margin: 16px 0;
        /* display: -webkit-box; */
        align-items: center;
        margin-bottom: 4.5em;
    }

    .tag-num
    {
        user-select   : none;
        font-size     : 10px;
        line-height   : 18px;
        position      : relative;
        display       : inline-flex;
        height        : 18px;
        padding       : 0 6px;
        letter-spacing: .25px;
        color         : black;
        border-radius : 18px;
        background    : #c0c2cc;
        margin        : 0 7px;
    }

    .tag-num:hover
    {
        cursor      : pointer;
        transition  : all 400ms ease;
        background  : black;
        color       : white;
    }

    .rr-font--update.rr-dec {
        font-size: 15px;
        margin-left: 30px;
    }

    .rr-font--update.rr-inc 
    {
        font-size: 22px;
        margin-right: 20px;
        position: relative;
        margin-left: 15px;
    }

    .rr-font--update.rr-inc:hover 
    {
        /*transform: scale(1.3);*/
        color: var(--checked-background);
        transition: all 0.3s ease-out;
    }

    .rr-font--update.rr-dec:hover 
    {
        color: var(--checked-background);
        transition: all 0.3s ease-out;
    }

    .rr-font--update 
    {
        user-select : none;
        color       : darkgray;
        font-family : Open sans;
        width       : 30px;
        font-weight : 700;
        font-size   : 18px;
        cursor      : pointer;
    }

    .btn-custom 
    {
        font-family: "Source sans Pro";
        outline: 0;
        border-radius: 16px;
        border: 1px solid var(--checked-background);
        background: transparent;
        color: var(--checked-background);
        width: 120px;
        height: 24px;
        cursor: pointer;
        text-transform: uppercase;
        margin-left: 30px;
    }

    .btn-custom:hover
    {
        transition: background 0.3s ease-in-out;
        background: white;
    }

    #font-indicator
    {
        color: var(--checked-background);
        font-family: Source sans pro;
        font-weight: 600;
    }
    .sentence.or,[class^="default"]
    {
        font-size: ${fontSizeValue};
    }
    
    [class^="sentence"]:not(.or)
    {
        font-weight: 300;
        font-size: ${fontSizeValueDefault};
    }
`;
/*
    | Plugin Mobile support.
*/
let CSSMediaQuery = `
    @media only screen and (max-width: 600px)
    {
        label
            { display: inline-block; font-size: 95%; }

        .radio-group, .checkbox-group
            { display: grid; }

        .chapterBody
            { margin: 7%;max-width: 82%; }

        .sentence.or
            { font-size: 92%; text-align: initial; font-weight: 300; }

        .settingsForm
            { flex-wrap: wrap; display: contents; }

        .original
            { font-size: 87%; text-align: initial; font-weight: 500; }

        .sentence.google
            { font-size: 87%; text-align: initial; font-weight: 300; }
        .sentence.google.default
            { font-size: 92%; text-align: initial; font-weight: 300; }

        .sentence.niutrans
            { font-size: 87%; text-align: initial; font-weight: 300;}
        .sentence.niutrans.default
            { font-size: 92%; text-align: initial; font-weight: 300; }

        .sentence.baidu
            { font-size: 87%; text-align: initial; font-weight: 300; }
        .sentence.baidu.default
            { font-size: 92%; text-align: initial; font-weight: 300; }

        .sentence.sogou
            { font-size: 87%; text-align: initial; font-weight: 300; }
        .sentence.sogou.default
            { font-size: 92%; text-align: initial; font-weight: 300; }

        .sentence.yeekit
            { font-size: 87%; text-align: initial; font-weight: 300; }
        .sentence.yeekit.default
            { font-size: 92%; text-align: initial; font-weight: 300; }

        .close-button
            { max-width: 7vmin; max-height: 7vmin; min-width: 7vmin; min-height: 7vmin; right: 3%; top: 57%; background: #393A3D; border-radius: 50%; }

        .close-button:before, .close-button:after
            { background:white; }

        .arrow.left
            { top: 76%; }

        .arrow.right
            { top: 68%; right: 5%; }

        .tooltip
            { display: inline; }

        h1.header-title
            { font-size: 150% }

        .rr-font--update.rr-dec 
            { font-size: 15px !important; margin-left: 35px !important; }

        .rr-font--update.rr-inc 
            { margin-right: 15px !important; margin-left: 5px !important; }

        .btn-custom 
            { height: 54px !important; text-align: center !important;}

        ul li 
            { margin: 0 12px 4 !important; }

        ul li:after, .rr-font--update.rr-inc:after 
            { border-right: 2px solid rgba(var(--checked-background-rgb), 1); }
        ul
            { animation:fadein 2s;padding:0!important;position:relative!important;margin:0 0 100!important;transform:scale(.65)!important;justify-content:center!important;display:flex!important;flex-direction:row!important;align-items:unsafe!important;margin:0 -10vm!important;margin:0 -10vmin!important;flex-wrap:wrap!important;justify-content:space-evenly!important;align-items:baseline!important;align-content:center!important}
    }
`
;

window.onload = async function ()
{     
    /*
        | Adding Glossary support
    */
    await new Promise( resolve => setTimeout( resolve, 10 ) );
    
    if (   $('style[type="text/css"]').text().includes( 'noWordWrapping' )  &&
           !(  window.sessionStorage.getItem("userjs_UGMTLComplete") &&
               window.sessionStorage.getItem("userjs_UGMTLComplete") > window.performance.timing.fetchStart )
       )
    {
        await new Promise ( resolve => document.addEventListener( 'userjs_UGMTLComplete' , resolve ) );
    }
    else
    {
        /*
            | Swaping Chinese/English words to have a better translation.
        */
        mainBodyWordsReplacer( );
    }

    /*
        | Inject the iframe to the DOM.
    */
    $( '#app' ).get( 0 ).insertAdjacentHTML( 'afterEnd', `<iframe id="pageContainer" style="display:${autoReaderState ? 'block' : 'none'}">` );

    /*
        | Get raw & original text from main page.
    */
    const originalSentences = $( '.chapter-body' ).find( '.translated' ).text().replace( /(\xAD)/g, '' ).trim().split( '\n' );
    const originalRaw       = $( '.chapter-body' ).find( '.original' ).text().trim().split( '\n' );
    const chapterTitle      = $( '.chapter-title' )[ 0 ].textContent;
    /*
        | Add a button for the reader mode.
    */
    $( '.js-toggle-original' ).after( '<button class="btn btn-enabled reader-mode">READER MODE</button>' );
    $( '.btn.btn-enabled.reader-mode' ).css( 'boxShadow', 'rgb(236, 240, 241) 0px 0px 8px' );
    $( '.btn.btn-enabled.reader-mode' ).css( 'color'    , 'black' );

    /*
        | Reader btn onClick event.
    */
    $( '.reader-mode' ).click( function ()
    {
        $( '#app' ).css( { 'display': 'none', 'opacity': '0' } );
        $( '#pageContainer' ).show();
    } );

    /*
          | We will need this for the tooltip & highlighting words.
          | The values produces non-ut8 characters so we must remove them
          | so that there will be no problem replacing them using regex.
    */
    $( '.translated t' ).each( function ( index )
    {
        let chineseValue  = $( this ).attr( 'data-title' );
        let value         = $( this )
                            .attr( 'data-title', $( this ).text() )
                            .text()
                            .trimLeft()
        ;

        const replacedValue = value.replace( /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/(\xAD)]/g, '' );
        
        if( replacedValue != "" || replacedValue.length != 0 )
            uniqueWords.set( replacedValue , chineseValue );
    } );
    
    /*
        | This what will be using to control the iframe DOM
    */
    iframeHandler = $( "#pageContainer" ).contents();

    /*
        | Toggle theme state.
    */
    autoThemeState ?

        iframeHandler.find( ':root' ).eq( 0 ).attr( 'data-theme', 'light' ) :
        iframeHandler.find( ':root' ).eq( 0 ).attr( 'data-theme', 'dark' )

    ;

    /*
        | Append the needed styles for the iframe.
    */
    addStyles( );
      
    /*
        | Add iframe form.
    */
    addForm( );

    /*
        | Apply secondary theme.
    */
    iframeHandler.find( ':root' ).eq( 0 ).attr( 'data-sec-theme', secondaryTheme );

    /*
        | Toggle secondary colors.
    */
    iframeHandler.find( '.drag' ).click( function()   { iframeHandler.find( ':root' ).eq( 0 ).attr( 'data-sec-theme', 'gold'    ); GM_SuperValue.set( 'secondaryTheme', "gold" );  });
    iframeHandler.find( '.moon' ).click( function()   { iframeHandler.find( ':root' ).eq( 0 ).attr( 'data-sec-theme', 'moon'    ); GM_SuperValue.set( 'secondaryTheme', "moon" ); });
    iframeHandler.find( '.bomb' ).click( function()   { iframeHandler.find( ':root' ).eq( 0 ).attr( 'data-sec-theme', 'bomb'    ); GM_SuperValue.set( 'secondaryTheme', "bomb" ); });
    iframeHandler.find( '.norm' ).click( function()   { iframeHandler.find( ':root' ).eq( 0 ).attr( 'data-sec-theme', 'default' ); GM_SuperValue.set( 'secondaryTheme', "" ); });

    /*
        | If one provider is running then removed color/border translation identifier.
    */
    iframeHandler.find( "input[name='items[]']" ).change(function(e)  { onlyOneRunning(); });
  
    for( let index in providers )
    {
        let provider = providers[ index ];
        
        if( eval( 'provider' + provider + 'State' ) )
        {
            providerSelector( originalRaw, provider.toLowerCase() , providerObject[ provider ][ "maxSize" ] );
        }
    }
    
    iframeHandler.find( '.close-button' ).click( function ()
    {
          $( '#app' ).css( { 'display': 'block', 'opacity': '1', 'overflow-y': 'scroll' } );
          $( '#pageContainer' ).hide();
    } );

    /*
        | Hooking next/prev page on click
        | Replacing href results a bug, so I'll be using this approach.
    */
    iframeHandler.find( '.arrow.right' ).click( function ()   { window.location.assign( $( this ).attr( 'value' ) );  } );
    iframeHandler.find( '.arrow.left' ).click(  function ()   { window.location.assign( $( this ).attr( 'value' ) );  } );

    /*
        | Add original and raw text ( with display:none )
        | Also there is a non-utf8 coming out of nowhere so we must clean that
    */
    for ( let i in originalSentences )
    {
        for ( const [key, value] of uniqueWords.entries() )
        {
              originalSentences[i] = originalSentences[i].replace
              (
                      new RegExp( '(?<![<>])(' + key + ')(?![<>])' , 'g' ),
                      `<span class="highlighter"><div class="tooltip top">$&<span class="tooltip-text">${value}</span></div></span>`
              )
            ;
        }
        
        iframeHandler.find( '.chapterBody' ).append( `<div class="sentence or">${originalSentences[i]}</div>` );
        iframeHandler.find( '.chapterBody' ).append( `<div class="raw-block"><p class="original">${originalRaw[i]}</p><a class="tag-num">${i}</a></div>` );
    }
  
    if( !autoRawState )
        iframeHandler.find( '.raw-block' ).hide();
  
    if ( !providerOriginalState )
        iframeHandler.find( '.sentence.or' ).hide();
    
    // Should be optimized... 
    iframeHandler.find( '.rr-dec' ).click( function() 
    {
        let currentFontSize         = parseInt( iframeHandler.find( '.sentence.or,[class^="default"]' ).css('font-size') ) - 1;  
        let currentFontSizeDefault  = parseInt( iframeHandler.find( '[class^="sentence"]:not(.or,.default)' ).css('font-size') ) - 1;  
        
        if ( currentFontSize <= 17 )
            return;
        
        iframeHandler.find( '[class^="sentence"]:not(.or)' ).css( 'font-size', currentFontSizeDefault );
        iframeHandler.find( '.sentence.or,[class^="default"]' ).css( 'font-size', currentFontSize );
      
        iframeHandler.find( '#font-indicator' ).text( currentFontSize );
        
        GM_SuperValue.set( 'fontSizeValueDefault', currentFontSizeDefault );
        GM_SuperValue.set( 'fontSizeValue', currentFontSize );
    } );
    iframeHandler.find( '.rr-inc' ).click( function() 
    {
        let currentFontSize         = parseInt( iframeHandler.find( '.sentence.or,[class^="default"]' ).css('font-size') ) + 1;  
        let currentFontSizeDefault  = parseInt( iframeHandler.find( '[class^="sentence"]:not(.or,.default)' ).css('font-size') ) + 1;  

        if ( currentFontSize >= 30 )
            return;
        
        iframeHandler.find( '[class^="sentence"]:not(.or)' ).css( 'font-size', currentFontSizeDefault );
        iframeHandler.find( '.sentence.or' ).css( 'font-size', currentFontSize );
      
        iframeHandler.find( '#font-indicator' ).text( currentFontSize );

        GM_SuperValue.set( 'fontSizeValueDefault', currentFontSizeDefault );
        GM_SuperValue.set( 'fontSizeValue', currentFontSize );
    } );

    providerChangedEvent( originalRaw );
    settingsChangedEvent( );
    
    iframeHandler.find( '.btn-custom' ).on( 'click', function()
    {
        let self = $( this );
        let stringBuilder = `${chapterTitle}\n\n\n`;

        self.text( 'Copied ;-)' );
        
        setTimeout( function ( ) { self.text( 'Copy Edited Text' ); }, 600 );

        let rawEdits = iframeHandler.find( '.sentence.edit' ).toArray( ).map( ( p ) => p.textContent );

        for ( let index in rawEdits )
        {
            stringBuilder += `${rawEdits[ index ]}\n\n\n`;
        }

        window.navigator.clipboard.writeText( stringBuilder );
    } );
    
  
    iframeHandler.find( '.tag-num' ).on( 'click', function()
    {
        let index = parseInt( this.textContent );

        if ( $( this ).attr( 'value' ) )
        {
            iframeHandler.find( '.tag-num' ).eq( index ).next( ).filter( '.sentence.edit' ).fadeToggle(
                200 );
            return;
        }

        iframeHandler.find( '.raw-block' ).eq( index ).append(
            '<div class="sentence edit" contenteditable="plaintext-only" spellcheck="false"/>'
        );

        $( this ).attr( 'value', 'clicked' );
    } );  
}

function addStyles()
{
      iframeHandler.find( 'head' ).append( $
        (
            `
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <link rel="preload" onload="this.rel = 'stylesheet'" as="style" href='https://fonts.googleapis.com/css?family=Open+Sans:300,400,600|Poppins|Source+Sans+Pro:300,400,500,600'>
                <link rel="preload" onload="this.rel = 'stylesheet'" as="style" href='https://use.fontawesome.com/releases/v5.6.3/css/all.css'>  
                ${$( '.next > a' ).attr( 'href' ) != undefined ? `<link rel="prefetch" href="${$( '.next > a' ).attr( 'href' )}">` : '' }
                <style type='text/css'>
                          ${CSSRoot}
                          ${CSSContainer}
                          ${CSSCloseBtn}
                          ${CSSForm}
                          ${CSSChapterBody}
                          ${CSSTooltip}
                          ${CSSNextPrevArrow}
                          ${CSSMediaQuery}
                          ${CSSBtnTheme}
                          ${CSSTagBtn}
                </style>
            `
        )
    );
}

function addForm( )
{
    const chapterTitle      = $( '.chapter-title' )[ 0 ].textContent.split( ':' );

    const readerState       = autoReaderState ? '' : 'checked';
    const themeState        = autoThemeState  ? '' : 'checked';
    const rawState          = autoRawState    ? '' : 'checked';

    const pageNext          = $( '.next > a' ).attr( 'href' );
    const pagePrevious      = $( '.previous > a' ).attr( 'href' );
    const nextChapterButton = pageNext != null      ? (   '<a value="'  + pageNext      + '" class="arrow right"></a>'  ) : '';
    const prevChapterButton = pagePrevious != null  ? (   '<a value="'  + pagePrevious  + '" class="arrow left"></a>'   ) : '';

    const isOriginalEnabled = providerOriginalState ? 'checked' : '';
    const isGoogleEnabled   = providerGoogleState   ? 'checked' : '';
    const isSogouEnabled    = providerSogouState    ? 'checked' : '';
    const isNiutransEnabled = providerNiutransState ? 'checked' : '';
    const isBaiduEnabled    = providerBaiduState    ? 'checked' : '';
    const isYeekitEnabled   = providerYeekitState   ? 'checked' : '';

    iframeHandler.find( 'body' ).append
        (
            `
              <div id="clean-reader">
              <div class="pageContainerBackground">
                    <a class="close-button">Close</a>
                    ${prevChapterButton}
                    ${nextChapterButton}
                    <form class="settingsForm">

                          <label>Provider</label>
                          <div class="radio-group">

                              <input type="checkbox" id="Original-translator" value="o-translator-p" name="items[]" ${isOriginalEnabled}>
                              <label for="Original-translator">Original</label>

                              <input type="checkbox" id="Google-translator" value="g-translator-p" name="items[]" ${isGoogleEnabled}>
                              <label for="Google-translator"><span style="color:rgb(${providerObject["Google"]["color"][0]});text-shadow: 0 0 3px #30AFDB, 0 0 5px #30AFDB;padding-right: 6">◼ </span> Google</label>

                              <input type="checkbox" id="Sogou-translator" value="s-translator-p" name="items[]" ${isSogouEnabled}>
                              <label for="Sogou-translator"><span style="color:rgb(${providerObject["Sogou"]["color"][0]});text-shadow: 0 0 3px #e74c3c, 0 0 5px #e74c3c;padding-right: 6">◼ </span> Sogou</label>

                              <input type="checkbox" id="Niutrans-translator" value="n-translator-p" name="items[]" ${isNiutransEnabled}>
                              <label for="Niutrans-translator"><span style="color:rgb(${providerObject["Niutrans"]["color"][0]});text-shadow: 0 0 3px #e74c3c, 0 0 5px #e74c3c;padding-right: 6">◼ </span> Niutrans</label>

                              <input type="checkbox" id="Baidu-translator" value="b-translator-p" name="items[]" ${isBaiduEnabled}>
                              <label for="Baidu-translator"><span style="color:rgb(${providerObject["Baidu"]["color"][0]});text-shadow: 0 0 3px #6F68F2, 0 0 5px #6F68F2;padding-right: 6">◼ </span> Baidu</label>
                              
                              <input type="checkbox" id="Yeekit-translator" value="y-translator-p" name="items[]" ${isYeekitEnabled}>
                              <label for="Yeekit-translator"><span style="color:rgb(${providerObject["Yeekit"]["color"][0]});text-shadow: 0 0 3px #6F68F2, 0 0 5px #78e08f;padding-right: 6">◼ </span> Yeekit</label>

                          </div>

                          <label>Raw</label>
                          <div class="radio-group">
                              <input type="radio" id="option-one-a" name="raw" value="mode-enabled" checked>
                              <label for="option-one-a">Enable</label>

                              <input type="radio" id="option-two-2" name="raw" value="mode-disabled" ${rawState}>
                              <label for="option-two-2">Disable</label>
                          </div>

                          <label>Reader</label>
                          <div class="radio-group">
                              <input type="radio" id="option-1" name="mode" value="mode-enabled" data-theme="dark" checked>
                              <label for="option-1">Always</label>
                              <input type="radio" id="option-2" name="mode" value="mode-disabled" data-theme="light" ${readerState}>
                              <label for="option-2">Never</label>
                          </div>

                          <label>Theme</label>
                          <div class="radio-group theme">
                              <input type="radio" id="option-1-1" name="theme" value="theme-enabled" checked>
                              <label for="option-1-1">Light</label>
                              <input type="radio" id="option-2-2" name="theme" value="theme-disabled" ${themeState}>
                              <label for="option-2-2">Dark</label>
                          </div>

                    </form>
                    <h1 class="header-title">${chapterTitle[1]} - <span style="transition : all 200ms ease;color:var(--checked-background);font-weight:bold">${chapterTitle[0].replace( '#', '' )}</h1>
                    <div class="pageSplit"></div>
                    <div class="settings-container">
                    <ul>
                      <li>
                        <a class="drag"><i class="fab fa-d-and-d"></i></a>
                      </li>
                      <li>
                        <a class="moon"><i class="fas fa-bowling-ball"></i></a>
                        </li>
                      <li>
                        <a class="bomb"><i class="fas fa-bomb"></i></a>
                      </li>
                      <li>
                        <a class="norm"><i class="fas fa-tint"></i> </a>
                      </li>
                    </ul><span class="rr-font--update rr-dec">A-</span><div id="font-indicator">${fontSizeValue}</div><span class="rr-font--update rr-inc">A+</span>
                      <button class="btn-custom">Copy edited text</button></div>
                  <div class="chapterBody">
                  </div>
              </div>
            </div>
            `
        )
    ;

}

function providerChangedEvent ( raws )
{
    const addEventHandler = ( iframe, provider ) =>
    {
        const capitalizeProvider = provider.charAt( 0 ).toUpperCase( ) + provider.slice( 1 );

        iframe.find( `#${capitalizeProvider}-translator` ).change( function ( )
        {
            GM_SuperValue.set( `provider${capitalizeProvider}State`, this.checked );

            this.checked && !isTranslated[ capitalizeProvider ][ 1 ] ? 
              
                providerSelector( raws, provider, providerObject[ capitalizeProvider ][ 'maxSize' ] ) : 
                iframe.find( `.sentence.${provider}` ).fadeToggle( 300 )
            ;
        } );
    };

    addEventHandler( iframeHandler, 'google' );
    addEventHandler( iframeHandler, 'sogou' );
    addEventHandler( iframeHandler, 'niutrans' );
    addEventHandler( iframeHandler, 'baidu' );
    addEventHandler( iframeHandler, 'yeekit' );

    iframeHandler.find( '#Original-translator' ).change( function ( )
    {
        GM_SuperValue.set( 'providerOriginalState', this.checked );
        iframeHandler.find( '.sentence.or' ).delay( 100 ).fadeToggle( 100 );
    } );
}

function settingsChangedEvent ( )
{
    /* READER CHANGING STATE */
    iframeHandler.find( 'input[type=radio][name=mode]' ).change( function ( )
    {
        autoReaderState = $( this ).val( ).includes( 'enabled' );
        GM_SuperValue.set( 'autoReaderState', autoReaderState );
    } );

    /* RAW CHANGING STATE */
    iframeHandler.find( 'input[type=radio][name=raw]' ).click( function ( )
    {
        autoRawState = $( this ).val( ).includes( 'enabled' );
        GM_SuperValue.set( 'autoRawState', autoRawState );

        autoRawState ? 
          
          iframeHandler.find( '.raw-block' ).delay( 100 ).fadeIn( 300 ) :
          iframeHandler.find( '.raw-block' ).fadeOut( 200 );
    } );

    /* THEME CHANGING STATE */
    iframeHandler.find( 'input[type=radio][name=theme]' ).click( function ( )
    {
        autoThemeState = $( this ).val( ).includes( 'enabled' );
        GM_SuperValue.set( 'autoThemeState', autoThemeState );

        autoThemeState ? 
          
            iframeHandler.find( ':root' ).eq( 0 ).attr( 'data-theme', 'light' ) :
            iframeHandler.find( ':root' ).eq( 0 ).attr( 'data-theme', 'dark' );
    } );
}

function onlyOneRunning ()
{
    let runningProviders = [];

    iframeHandler.find( "input[name='items[]']:checked" ).each( function () { runningProviders.push( $( this ).attr( 'id' ).replace( '-translator', '' ).toLowerCase() ); } );
    
    if( runningProviders.length == 1 )
    {
        iframeHandler.find( `.sentence.${ runningProviders[0] }` ).attr( 'class', `sentence ${ runningProviders[0] } default` );
        iframeHandler.find( '.highlighter-default' ).css( 'font-weight', '500' );
    }
    else
    {
        for( let id in runningProviders )
        {
            iframeHandler.find( `.sentence.${ runningProviders[ id ] }.default` ).attr( 'class', `sentence ${ runningProviders[ id ] }` );
            iframeHandler.find( '.highlighter-default' ).css( 'font-weight', '500' );
        }
    }
        
    return runningProviders.length;
}

const disableCheckbox = ( elementId, status ) => iframeHandler.find( elementId ).prop( 'disabled', status );
async function providerSelector ( raw, name, chunksize )
{
    const taskDelay = ( m ) => new Promise( r => setTimeout( r, m ) )

    let translatedChunks = [];
    let chunks = []

    chunks = separateIntoChunks( raw, chunksize );
    chunks[0] = chunks[0].trimLeft();

    switch ( name )
    {
        case "sogou":
            {
                disableCheckbox( '#Sogou-translator', true );

                for ( let id in chunks )
                {
                    let value = await sogouSetCookies();
                    translatedChunks[id] = await sogouTranslator( chunks[id], value );

                    await taskDelay( providerObject["Sogou"]["timeout"] );
                }

                // Translation is finished.
                isTranslated["Sogou"][1] = true;
                disableCheckbox( '#Sogou-translator', false );
            }
            break;
        case "google":
            {
                disableCheckbox( '#Google-translator', true );

                for ( let id in chunks )
                {
                    translatedChunks[id] = await googleTranslator( chunks[id] );
                    await taskDelay( providerObject["Google"]["timeout"] );
                }

                // Translation is finished.
                isTranslated["Google"][1] = true;
                disableCheckbox( '#Google-translator', false );
            }
            break;
        case "niutrans":
            {
                disableCheckbox( '#Niutrans-translator', true );

                for ( let id in chunks )
                {
                    translatedChunks[id] = await niutransTranslator( chunks[id] );
                    await taskDelay( providerObject["Niutrans"]["timeout"] );
                }

                // Translation is finished.
                isTranslated["Niutrans"][1] = true;
                disableCheckbox( '#Niutrans-translator', false );
            }
            break;
        case "baidu":
            {
                disableCheckbox( '#Baidu-translator', true );

                let timer = -performance.now();

                const tokens = await baiduReceiveTokens();
                for ( let id in chunks )
                {
                    translatedChunks[id] = await baiduTranslator( chunks[id], tokens );
                    await taskDelay( providerObject["Baidu"]["timeout"] );
                }

                timer += performance.now();
                console.log( "Time: " + ( timer / 1000 ).toFixed( 5 ) + " sec." )

                // Translation is finished.
                isTranslated["Baidu"][1] = true;
                disableCheckbox( '#Baidu-translator', false );
            }
        case "yeekit":
            {
                disableCheckbox( '#Yeekit-translator', true );

                for ( let id in chunks )
                {
                    translatedChunks[id] = await yeekitTranslator( chunks[id] );
                    await taskDelay( providerObject["Yeekit"]["timeout"] );
                }

                // Translation is finished.
                isTranslated["Yeekit"][1] = true;
                disableCheckbox( '#Yeekit-translator', false );
            }
            break;
    }

    let finalResult = seperateChunksIntoPars( translatedChunks );
    createSentence( finalResult, name, onlyOneRunning() );
}

function mainBodyWordsReplacer ()
{
    $( '.original t' ).each
        (
            function ()
            {
                const textSpace = $( this ).get( 0 ).previousSibling.nodeName == 'T' ? ' ' : '';
                const textValue = $( this ).text( );

                $( this ).text( textSpace + $( this ).attr( 'data-title' ) );
                $( this ).attr( 'data-title', textValue );
            }
        );
}

function createSentence ( paragraphs, provider, runningProviders )
{
    if( runningProviders == 1 )
    {
        provider.concat( " default" ); 
    }   
    
    paragraphs.forEach( ( sentence, index ) =>
    {
        for ( const [key, value] of uniqueWords.entries() )
            sentence = sentence.replace( new RegExp( '(?<![<>])(' + key + ')(?![<>])' , 'g' ), `<span class="highlighter-default">$&</span>` );

        iframeHandler.find( '.raw-block' ).eq( index ).before( `<p class="sentence ${provider}">` + sentence + '</p>' );
    } );
    
    onlyOneRunning( );
}

function googleTranslator ( text )
{
    return new Promise(
        ( resolve ) => $.ajax( 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=en&dt=t',
            {
                method: 'POST',
                data  : { q: text },
                dataType: "json"
            } ).done( ( t ) =>
            {
                let paragraph = "";

                for ( let i = 0; i < t[0].length; i++ )
                {
                    paragraph += t[0][i][0];
                }

                resolve( paragraph );
            } )
                .fail( function( xhr, textStatus, errorThrown )
                {
                    GM_SuperValue.set( 'providerGoogleState', false );
                    disableCheckbox( '#Google-translator', false );
                    iframeHandler.find( '#Google-translator' ).prop( 'checked', false );
                } )
    );
}

function sogouTranslator ( text, id )
{
    const userId = () =>
    {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace( /[xy]/g, function ( name )
        {
            let M   = 0 | 16 * Math.random();
            var pid = "x" == name ? M : 8 | 3 & M;
            return pid.toString( 16 );
        } );
    };

    return new Promise( ( resolve, reject ) =>
    {
        var formData =
        {
            'from'        : 'zh-CHS',
            'to'          : 'en',
            'text'        : text,
            'client'      : 'pc',
            'fr'          : 'browser_pc',
            'pid'         : 'sogou-dict-vr',
            'dict'        : 'true',
            'word_group'  : 'true',
            'second_query': 'true',
            'uuid'        : userId,
            'needQc'      : '1',
            's'           : md5( 'zh-CHS' + 'en' + text + '8511813095152' )
        };

        GM_xmlhttpRequest(
            {
                method : "POST",
                url    : "https://fanyi.sogou.com/reventondc/translateV2",
                data   : $.param( formData ),
                headers:
                {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "Accept"      : "application/json",
                    "Referer"     : "https://fanyi.sogou.com/",
                    "User-agent"  : window.useragent,
                    "Cookie"      : "SNUID=" + id
                }
                ,
                onload: function ( result )
                {
                    try
                    {
                        var jsonObj = JSON.parse( result.response );
                        resolve( jsonObj.data.translate.dit );
                    }
                    catch ( error )
                    {
                        GM_SuperValue.set( 'providerSogouState', false );
                        disableCheckbox( '#Sogou-translator', false );
                        iframeHandler.find( '#Sogou-translator' ).prop( 'checked', false );
                    }
                }
            } );
    } );
}

function sogouSetCookies ()
{
    let dateExpires = new Date;
    let match       = ".sogou.com";
    //let random = Math.floor( Math.random() * ( 9000000 - 1000 ) ) + 1000
    let id = "1";  // Must be randomized in the next version

    return new Promise( ( resolve ) =>
    {
        GM_xmlhttpRequest(
            {
                method : "GET",
                url    : "https://fanyi.sogou.com/",
                headers:
                {
                    "User-agent": window.useragent,
                    "Cookie"    : setCookie( "SNUID", id, dateExpires.toGMTString(), match, "/" )
                }
                ,
                onload: function ( result )
                {
                    resolve( id )
                }
            } );
    } );
}

function niutransTranslator ( text )
{
    return new Promise( ( resolve ) =>
    {
        GM_xmlhttpRequest(
            {
                method : "GET",
                url    : "http://test.niutrans.vip/NiuTransServer/testtrans?&from=auto&to=en&src_text=" + encodeURIComponent( text ),
                headers:
                {
                    "Accept-Encoding" : "gzip, deflate",
                    "User-Agent": window.useragent
                }
                ,
                onload: function ( result )
                {
                    try
                    {
                        var myResponse = JSON.parse( result.response ).tgt_text;
                        resolve( [...myResponse.split( '\n \n' )].join( '\n\n' ) );
                        //console.log(result);
                    }
                    catch ( error )
                    {
                        GM_SuperValue.set( 'providerNiutransState', false );
                        disableCheckbox( '#Niutrans-translator', false );
                        iframeHandler.find( '#Niutrans-translator' ).prop( 'checked', false );
                    }
                }
            } );
    } );
}

async function baiduTranslator ( text, _tokens )
{
    const formData =
    {
        'from'             : 'zh',
        'to'               : 'en',
        'query'            : text,
        'transtype'        : 'realtime',
        'simple_means_flag': 3,
        'sign'             : sign( text, _tokens[0] ),
        'token'            : _tokens[1],
        'domain'           : 'common'
    };

    return new Promise( ( resolve ) =>
    {
        GM_xmlhttpRequest(
            {
                method : "POST",
                url    : "https://fanyi.baidu.com/v2transapi",
                data   : $.param( formData ),
                headers:
                {
                    "Content-Type"    : "application/x-www-form-urlencoded; charset=UTF-8",
                    "Accept"          : "application/json",
                    "Referer"         : "https://fanyi.baidu.com",
                    "Accept-Encoding" : "gzip, deflate",
                    "User-Agent"      : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"
                }
                ,
                onload: function ( result )
                {
                    try
                    {
                        const jsonObj = JSON.parse( result.responseText )
                        resolve( jsonObj.trans_result.data.map( p => p.dst ).join( '\n\n' ) );
                    }
                    catch ( error )
                    {
                        GM_SuperValue.set( 'providerBaiduState', false );
                        disableCheckbox( '#Baidu-translator', false );
                        iframeHandler.find( '#Baidu-translator' ).prop( 'checked', false );
                    }
                }
            } );
    } );
}

function baiduReceiveTokens ()
{
    return new Promise( ( resolve ) =>
    {
        GM_xmlhttpRequest(
            {
                method : "GET",
                url    : "https://fanyi.baidu.com/",
                headers:
                {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"
                }
                ,
                onload: function ( result )
                {
                    try
                    {
                        const windowToken = result.responseText.match( /window\.gtk = '(.*?)'/ )[1];
                        const commonToken = result.responseText.match( /token: '(.*?)',/ )[1];

                        resolve( [windowToken, commonToken] );
                    }
                    catch ( error )
                    {
                        disableCheckbox( '#Baidu-translator', false );
                        iframeHandler.find( '#Baidu-translator' ).prop( 'checked', false );
                    }
                }
            } );
    } );
}

function yeekitTranslator( text )
{
    return new Promise( ( resolve ) =>
    {
        GM_xmlhttpRequest(
          {
              method: 'POST',
              url: 'http://fanyi.yeekit.com/zyyt/translate/translate',
              data: JSON.stringify(
                  {
                      "srcl"      : "nzh",
                      "tgtl"      : "nen",
                      "app_source": 9001,
                      "text"      : text,
                      "domain"    : "auto"
                  }),
              headers: 
              {
                "Content-Type": "application/json;charset=UTF-8", 
                "Referer"     : "http://fanyi.yeekit.com/",
                "Origin"      :"http://fanyi.yeekit.com",
                "User-Agent"  : window.useragent
              },

              onload: function ( result ) 
              {
                  try
                  {
                      let jsonObj = JSON.parse( result.response );
                      resolve( jsonObj.data )
                  }
                  catch (error)
                  {
                      GM_SuperValue.set( 'providerYeekitState', false );
                      disableCheckbox( '#Yeekit-translator', false );
                      iframeHandler.find( '#Yeekit-translator' ).prop( 'checked', false );
                  }
              }

          });
    } );
}

/*
    | Utilities
*/

function setCookie ( a, val, url, c, name )
{
    return a = [a, "=", val], url && a.push( ";expires=", url ), c && a.push( ";domain=", c ), name && a.push( ";path=", name ), document.cookie = a.join( "" ), a.join( "" );
}

function separateIntoChunks ( paragraphs, size )
{
    let chunks = [];
    let currentchunk = "";
    for ( let i = 0; i < paragraphs.length; i++ )
    {
        if ( ( currentchunk + paragraphs[i] ).length >= size )
        {
            chunks.push( currentchunk );
            currentchunk = paragraphs[i];
        }
        else
        {
            currentchunk = currentchunk + "\n\n" + paragraphs[i];
        }
    }
    if ( paragraphs.length != 0 )
    {
        chunks.push( currentchunk );
    }
    return chunks;
}

function seperateChunksIntoPars ( chunks, splitby = "\n\n" )
{
    let pars = [];
    chunks.forEach( ( chunk ) => chunk.split( splitby ).forEach( ( par ) => pars.push( par ) ) );
    return pars;
}

function a ( r )
{
    if ( Array.isArray( r ) )
    {
        for ( var o = 0, t = Array( r.length ); o < r.length; o++ )
            t[o] = r[o];
        return t
    }
    return Array.from( r )
}

function n ( a, o )
{
    var s = 0;
    for ( ; s < o.length - 2; s = s + 3 )
    {
        var d = o.charAt( s + 2 );
        d = d >= "a" ? d.charCodeAt( 0 ) - 87 : Number( d );
        d = "+" === o.charAt( s + 1 ) ? a >>> d : a << d;
        a = "+" === o.charAt( s ) ? a + d & 4294967295 : a ^ d;
    }
    return a;
}

function sign ( r, gtk = 0 )
{
    var i = null;
    var o = r.match( /[\uD800-\uDBFF][\uDC00-\uDFFF]/g );
    if ( null === o )
    {
        var t = r.length;
        t > 30 && ( r = "" + r.substr( 0, 10 ) + r.substr( Math.floor( t / 2 ) - 5, 10 ) + r.substr( -10, 10 ) )
    } else
    {
        for ( var e = r.split( /[\uD800-\uDBFF][\uDC00-\uDFFF]/ ), C = 0, h = e.length, f = []; h > C; C++ )
            "" !== e[C] && f.push.apply( f, a( e[C].split( "" ) ) ),
                C !== h - 1 && f.push( o[C] );
        var g = f.length;
        g > 30 && ( r = f.slice( 0, 10 ).join( "" ) + f.slice( Math.floor( g / 2 ) - 5, Math.floor( g / 2 ) + 5 ).join( "" ) + f.slice( -10 ).join( "" ) )
    }
    var u = void 0
        , l = "" + String.fromCharCode( 103 ) + String.fromCharCode( 116 ) + String.fromCharCode( 107 );
    u = null !== i ? i : ( i = gtk || "" ) || "";
    for ( var d = u.split( "." ), m = Number( d[0] ) || 0, s = Number( d[1] ) || 0, S = [], c = 0, v = 0; v < r.length; v++ )
    {
        var A = r.charCodeAt( v );
        128 > A ? S[c++] = A : ( 2048 > A ? S[c++] = A >> 6 | 192 : ( 55296 === ( 64512 & A ) && v + 1 < r.length && 56320 === ( 64512 & r.charCodeAt( v + 1 ) ) ? ( A = 65536 + ( ( 1023 & A ) << 10 ) + ( 1023 & r.charCodeAt( ++v ) ),
            S[c++] = A >> 18 | 240,
            S[c++] = A >> 12 & 63 | 128 ) : S[c++] = A >> 12 | 224,
            S[c++] = A >> 6 & 63 | 128 ),
            S[c++] = 63 & A | 128 )
    }
    for ( var p = m, F = "" + String.fromCharCode( 43 ) + String.fromCharCode( 45 ) + String.fromCharCode( 97 ) + ( "" + String.fromCharCode( 94 ) + String.fromCharCode( 43 ) + String.fromCharCode( 54 ) ), D = "" + String.fromCharCode( 43 ) + String.fromCharCode( 45 ) + String.fromCharCode( 51 ) + ( "" + String.fromCharCode( 94 ) + String.fromCharCode( 43 ) + String.fromCharCode( 98 ) ) + ( "" + String.fromCharCode( 43 ) + String.fromCharCode( 45 ) + String.fromCharCode( 102 ) ), b = 0; b < S.length; b++ )
        p += S[b],
            p = n( p, F );
    return p = n( p, D ),
        p ^= s,
        0 > p && ( p = ( 2147483647 & p ) + 2147483648 ),
        p %= 1e6,
        p.toString() + "." + ( p ^ m )
}

function md5 ( str )
{
    var k = [],
        i = 0;

    for ( i = 0; i < 64; )
        k[i] = 0 | ( Math.abs( Math.sin( ++i ) ) * 4294967296 );

    var b, c, d, j,
        x = [],
        str2 = unescape( encodeURI( str ) ),
        a = str2.length,
        h = [( b = 1732584193 ), ( c = -271733879 ), ~b, ~c];

    for ( i = 0; i <= a; )
        x[i >> 2] |= ( str2.charCodeAt( i ) || 128 ) << ( 8 * ( i++ % 4 ) );

    x[( str = ( ( a + 8 ) >> 6 ) * 16 + 14 )] = a * 8;
    i = 0;

    for ( ; i < str; i += 16 )
    {
        a = h;
        j = 0;

        for ( ; j < 64; )
        {
            a = [
                ( d = a[3] ),
                ( b = a[1] | 0 ) +
                ( ( ( d =
                    a[0] + [
                        ( b & ( c = a[2] ) ) | ( ~b & d ),
                        ( d & b ) | ( ~d & c ),
                        b ^ c ^ d,
                        c ^ ( b | ~d )
                    ][( a = j >> 4 )] +
                    ( k[j] + ( x[( [j, 5 * j + 1, 3 * j + 5, 7 * j][a] % 16 ) + i] | 0 ) ) ) <<
                    ( a = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21][
                        4 * a + ( j++ % 4 )
                    ] ) ) |
                    ( d >>> ( 32 - a ) ) ),
                b,
                c
            ];
        }

        for ( j = 4; j; )
        {
            h[--j] = h[j] + a[j];
        }
    }

    str = "";

    for ( ; j < 32; )
    {
        str += ( ( h[j >> 3] >> ( ( 1 ^ ( j++ & 7 ) ) * 4 ) ) & 15 ).toString( 16 );
    }

    return str;
}
