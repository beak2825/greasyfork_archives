// ==UserScript==
// @name Clean Blue 9anime Theme
// @namespace userstyles.world/user/adap
// @version 20220530.13.48
// @description Changes 9anime to have a much cleaner theme that’s nicer on the eyes. Also changes the color theme to be blue rather than purple.
// @author adap
// @license No License
// @grant GM_addStyle
// @run-at document-start
// @include https://9anime*/*
// @include https://9anime**/*
// @include http://9anime*/*
// @include http://9anime**/*
// @downloadURL https://update.greasyfork.org/scripts/448248/Clean%20Blue%209anime%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/448248/Clean%20Blue%209anime%20Theme.meta.js
// ==/UserScript==

(function() {
let css = `
    /* 9anime has crazy CSS so I couldn't be bothered to do it from scratch
(I've already deleted 8/10 of the non-essential CSS) */
    .dropdown-menu > li > label
    {
        display: block;
        padding: 3px 20px;
        clear: both;
        font-weight: 400;
        line-height: 1.42857143;
        color: #333;
        white-space: nowrap
    }

    .dropdown-menu > li > label:focus,
    .dropdown-menu > li > label:hover
    {
        text-decoration: none;
        color: #262626;
        background-color: #f5f5f5
    }

    .dropdown-menu > .active > label,
    .dropdown-menu > .active > label:focus,
    .dropdown-menu > .active > label:hover,
    .dropdown-menu > li > input:checked ~ label,
    .dropdown-menu > li > input:checked ~ label:focus,
    .dropdown-menu > li > input:checked ~ label:hover
    {
        color: #fff;
        text-decoration: none;
        outline: 0;
        background-color: #933ec8
    }

    .dropdown-menu > .disabled > label,
    .dropdown-menu > .disabled > label:focus,
    .dropdown-menu > .disabled > label:hover,
    .dropdown-menu > li > input[disabled] ~ label,
    .dropdown-menu > li > input[disabled] ~ label:focus,
    .dropdown-menu > li > input[disabled] ~ label:hover
    {
        color: #999
    }

    .dropdown-menu > .disabled > label:focus,
    .dropdown-menu > .disabled > label:hover,
    .dropdown-menu > li > input[disabled] ~ label:focus,
    .dropdown-menu > li > input[disabled] ~ label:hover
    {
        text-decoration: none;
        background-color: transparent;
        background-image: none;
        cursor: not-allowed
    }

    .dropdown-menu > li > label
    {
        margin-bottom: 0;
        cursor: pointer
    }

    .dropdown-menu > li > input[type=checkbox],
    .dropdown-menu > li > input[type=radio]
    {
        display: none;
        position: absolute;
        top: -9999em;
        left: -9999em
    }

    .dropdown-menu > li > input:focus ~ label,
    .dropdown-menu > li > label:focus
    {
        outline: thin dotted;
        outline: 5px auto -webkit-focus-ring-color;
        outline-offset: -2px
    }

    .dropdown-menu.pull-right
    {
        right: 0;
        left: auto
    }

    .dropdown-menu.pull-top
    {
        bottom: 100%;
        top: auto;
        margin: 0 0 2px;
        -webkit-box-shadow: 0 -6px 12px rgba(0, 0, 0, .175);
        box-shadow: 0 -6px 12px rgba(0, 0, 0, .175)
    }

    .dropdown-menu.pull-center
    {
        right: 50%;
        left: auto
    }

    .dropdown-menu.pull-middle
    {
        right: 100%;
        margin: 0 2px 0 0;
        box-shadow: -5px 0 10px rgba(0, 0, 0, .2);
        left: auto
    }

    .dropdown-menu.pull-middle.pull-right
    {
        right: auto;
        left: 100%;
        margin: 0 0 0 2px;
        box-shadow: 5px 0 10px rgba(0, 0, 0, .2)
    }

    .dropdown-menu.pull-middle.pull-center
    {
        right: 50%;
        margin: 0;
        box-shadow: 0 0 10px rgba(0, 0, 0, .2)
    }

    .dropdown-menu.bullet
    {
        margin-top: 8px
    }

    .dropdown-menu.bullet:before
    {
        width: 0;
        height: 0;
        content: '';
        display: inline-block;
        position: absolute;
        border-color: transparent;
        border-style: solid;
        -webkit-transform: rotate(360deg);
        border-width: 0 7px 7px;
        border-bottom-color: #ccc;
        border-bottom-color: rgba(0, 0, 0, .15);
        top: -7px;
        left: 9px
    }

    .dropdown-menu.bullet:after
    {
        width: 0;
        height: 0;
        content: '';
        display: inline-block;
        position: absolute;
        border-color: transparent;
        border-style: solid;
        -webkit-transform: rotate(360deg);
        border-width: 0 6px 6px;
        border-bottom-color: #fff;
        top: -6px;
        left: 10px
    }

    .dropdown-menu.bullet.pull-right:before
    {
        left: auto;
        right: 9px
    }

    .dropdown-menu.bullet.pull-right:after
    {
        left: auto;
        right: 10px
    }

    .dropdown-menu.bullet.pull-top
    {
        margin-top: 0;
        margin-bottom: 8px
    }

    .dropdown-menu.bullet.pull-top:before
    {
        top: auto;
        bottom: -7px;
        border-bottom-width: 0;
        border-top-width: 7px;
        border-top-color: #ccc;
        border-top-color: rgba(0, 0, 0, .15)
    }

    .dropdown-menu.bullet.pull-top:after
    {
        top: auto;
        bottom: -6px;
        border-bottom: 0;
        border-top-width: 6px;
        border-top-color: #fff
    }

    .dropdown-menu.bullet.pull-center:before
    {
        left: auto;
        right: 50%;
        margin-right: -7px
    }

    .dropdown-menu.bullet.pull-center:after
    {
        left: auto;
        right: 50%;
        margin-right: -6px
    }

    .dropdown-menu.bullet.pull-middle
    {
        margin-right: 8px
    }

    .dropdown-menu.bullet.pull-middle:before
    {
        top: 50%;
        left: 100%;
        right: auto;
        margin-top: -7px;
        border-right-width: 0;
        border-bottom-color: transparent;
        border-top-width: 7px;
        border-left-color: #ccc;
        border-left-color: rgba(0, 0, 0, .15)
    }

    .dropdown-menu.bullet.pull-middle:after
    {
        top: 50%;
        left: 100%;
        right: auto;
        margin-top: -6px;
        border-right-width: 0;
        border-bottom-color: transparent;
        border-top-width: 6px;
        border-left-color: #fff
    }

    .dropdown-menu.bullet.pull-middle.pull-right
    {
        margin-right: 0;
        margin-left: 8px
    }

    .dropdown-menu.bullet.pull-middle.pull-right:before
    {
        left: -7px;
        border-left-width: 0;
        border-right-width: 7px;
        border-right-color: #ccc;
        border-right-color: rgba(0, 0, 0, .15)
    }

    .dropdown-menu.bullet.pull-middle.pull-right:after
    {
        left: -6px;
        border-left-width: 0;
        border-right-width: 6px;
        border-right-color: #fff
    }

    .dropdown-menu.bullet.pull-middle.pull-center
    {
        margin-left: 0;
        margin-right: 0
    }

    .dropdown-menu.bullet.pull-middle.pull-center:before
    {
        border: 0;
        display: none
    }

    .dropdown-menu.bullet.pull-middle.pull-center:after
    {
        border: 0;
        display: none
    }

    .dropdown-submenu
    {
        position: relative
    }

    .dropdown-submenu > .dropdown-menu
    {
        top: 0;
        left: 100%;
        margin-top: -6px;
        margin-left: -1px;
        border-top-left-radius: 0
    }

    .dropdown-submenu > a:before
    {
        display: block;
        float: right;
        width: 0;
        height: 0;
        content: "";
        margin-top: 6px;
        margin-right: -8px;
        border-width: 4px 0 4px 4px;
        border-style: solid;
        border-left-style: dashed;
        border-top-color: transparent;
        border-bottom-color: transparent
    }

    @media (max-width: 767px)
    {
        .navbar-nav .dropdown-submenu > a:before
        {
            margin-top: 8px;
            border-color: inherit;
            border-style: solid;
            border-width: 4px 4px 0;
            border-left-color: transparent;
            border-right-color: transparent
        }

        .navbar-nav .dropdown-submenu > a
        {
            padding-left: 40px
        }

        .navbar-nav > .open > .dropdown-menu > .dropdown-submenu > .dropdown-menu > li > a,
        .navbar-nav > .open > .dropdown-menu > .dropdown-submenu > .dropdown-menu > li > label
        {
            padding-left: 35px
        }

        .navbar-nav > .open > .dropdown-menu > .dropdown-submenu > .dropdown-menu > li > .dropdown-menu > li > a,
        .navbar-nav > .open > .dropdown-menu > .dropdown-submenu > .dropdown-menu > li > .dropdown-menu > li > label
        {
            padding-left: 45px
        }

        .navbar-nav > .open > .dropdown-menu > .dropdown-submenu > .dropdown-menu > li > .dropdown-menu > li > .dropdown-menu > li > a,
        .navbar-nav > .open > .dropdown-menu > .dropdown-submenu > .dropdown-menu > li > .dropdown-menu > li > .dropdown-menu > li > label
        {
            padding-left: 55px
        }

        .navbar-nav > .open > .dropdown-menu > .dropdown-submenu > .dropdown-menu > li > .dropdown-menu > li > .dropdown-menu > li > .dropdown-menu > li > a,
        .navbar-nav > .open > .dropdown-menu > .dropdown-submenu > .dropdown-menu > li > .dropdown-menu > li > .dropdown-menu > li > .dropdown-menu > li > label
        {
            padding-left: 65px
        }

        .navbar-nav > .open > .dropdown-menu > .dropdown-submenu > .dropdown-menu > li > .dropdown-menu > li > .dropdown-menu > li > .dropdown-menu > li > .dropdown-menu > li > a,
        .navbar-nav > .open > .dropdown-menu > .dropdown-submenu > .dropdown-menu > li > .dropdown-menu > li > .dropdown-menu > li > .dropdown-menu > li > .dropdown-menu > li > label
        {
            padding-left: 75px
        }
    }

    .navbar-default .navbar-nav .open > .dropdown-menu > .dropdown-submenu.open > a,
    .navbar-default .navbar-nav .open > .dropdown-menu > .dropdown-submenu.open > a:focus,
    .navbar-default .navbar-nav .open > .dropdown-menu > .dropdown-submenu.open > a:hover
    {
        background-color: #e7e7e7;
        color: #555
    }

    @media (max-width: 767px)
    {
        .navbar-default .navbar-nav .open > .dropdown-menu > .dropdown-submenu.open > a:before
        {
            border-top-color: #555
        }
    }

    .navbar-inverse .navbar-nav .open > .dropdown-menu > .dropdown-submenu.open > a,
    .navbar-inverse .navbar-nav .open > .dropdown-menu > .dropdown-submenu.open > a:focus,
    .navbar-inverse .navbar-nav .open > .dropdown-menu > .dropdown-submenu.open > a:hover
    {
        background-color: #080808;
        color: #fff
    }

    @media (max-width: 767px)
    {
        .navbar-inverse .navbar-nav .open > .dropdown-menu > .dropdown-submenu.open > a:before
        {
            border-top-color: #fff
        }
    }

    .tooltipster-fall,
    .tooltipster-grow.tooltipster-show
    {
        -webkit-transition-timing-function: cubic-bezier(.175, .885, .32, 1);
        -moz-transition-timing-function: cubic-bezier(.175, .885, .32, 1.15);
        -ms-transition-timing-function: cubic-bezier(.175, .885, .32, 1.15);
        -o-transition-timing-function: cubic-bezier(.175, .885, .32, 1.15)
    }

    .tooltipster-base
    {
        display: flex;
        pointer-events: none;
        position: absolute
    }

    .tooltipster-box
    {
        flex: 1 1 auto
    }

    .tooltipster-content
    {
        box-sizing: border-box;
        max-height: 100%;
        max-width: 100%;
        overflow: auto
    }

    .tooltipster-ruler
    {
        bottom: 0;
        left: 0;
        overflow: hidden;
        position: fixed;
        right: 0;
        top: 0;
        visibility: hidden
    }

    .tooltipster-fade
    {
        opacity: 0;
        -webkit-transition-property: opacity;
        -moz-transition-property: opacity;
        -o-transition-property: opacity;
        -ms-transition-property: opacity;
        transition-property: opacity
    }

    .tooltipster-fade.tooltipster-show
    {
        opacity: 1
    }

    .tooltipster-grow
    {
        -webkit-transform: scale(0, 0);
        -moz-transform: scale(0, 0);
        -o-transform: scale(0, 0);
        -ms-transform: scale(0, 0);
        transform: scale(0, 0);
        -webkit-transition-property: -webkit-transform;
        -moz-transition-property: -moz-transform;
        -o-transition-property: -o-transform;
        -ms-transition-property: -ms-transform;
        transition-property: transform;
        -webkit-backface-visibility: hidden
    }

    .tooltipster-grow.tooltipster-show
    {
        -webkit-transform: scale(1, 1);
        -moz-transform: scale(1, 1);
        -o-transform: scale(1, 1);
        -ms-transform: scale(1, 1);
        transform: scale(1, 1);
        -webkit-transition-timing-function: cubic-bezier(.175, .885, .32, 1.15);
        transition-timing-function: cubic-bezier(.175, .885, .32, 1.15)
    }

    .tooltipster-swing
    {
        opacity: 0;
        -webkit-transform: rotateZ(4deg);
        -moz-transform: rotateZ(4deg);
        -o-transform: rotateZ(4deg);
        -ms-transform: rotateZ(4deg);
        transform: rotateZ(4deg);
        -webkit-transition-property: -webkit-transform, opacity;
        -moz-transition-property: -moz-transform;
        -o-transition-property: -o-transform;
        -ms-transition-property: -ms-transform;
        transition-property: transform
    }

    .tooltipster-swing.tooltipster-show
    {
        opacity: 1;
        -webkit-transform: rotateZ(0);
        -moz-transform: rotateZ(0);
        -o-transform: rotateZ(0);
        -ms-transform: rotateZ(0);
        transform: rotateZ(0);
        -webkit-transition-timing-function: cubic-bezier(.23, .635, .495, 1);
        -webkit-transition-timing-function: cubic-bezier(.23, .635, .495, 2.4);
        -moz-transition-timing-function: cubic-bezier(.23, .635, .495, 2.4);
        -ms-transition-timing-function: cubic-bezier(.23, .635, .495, 2.4);
        -o-transition-timing-function: cubic-bezier(.23, .635, .495, 2.4);
        transition-timing-function: cubic-bezier(.23, .635, .495, 2.4)
    }

    .tooltipster-fall
    {
        -webkit-transition-property: top;
        -moz-transition-property: top;
        -o-transition-property: top;
        -ms-transition-property: top;
        transition-property: top;
        -webkit-transition-timing-function: cubic-bezier(.175, .885, .32, 1.15);
        transition-timing-function: cubic-bezier(.175, .885, .32, 1.15)
    }

    .tooltipster-fall.tooltipster-initial
    {
        top: 0!important
    }

    .tooltipster-fall.tooltipster-dying
    {
        -webkit-transition-property: all;
        -moz-transition-property: all;
        -o-transition-property: all;
        -ms-transition-property: all;
        transition-property: all;
        top: 0!important;
        opacity: 0
    }

    .tooltipster-slide
    {
        -webkit-transition-property: left;
        -moz-transition-property: left;
        -o-transition-property: left;
        -ms-transition-property: left;
        transition-property: left;
        -webkit-transition-timing-function: cubic-bezier(.175, .885, .32, 1);
        -webkit-transition-timing-function: cubic-bezier(.175, .885, .32, 1.15);
        -moz-transition-timing-function: cubic-bezier(.175, .885, .32, 1.15);
        -ms-transition-timing-function: cubic-bezier(.175, .885, .32, 1.15);
        -o-transition-timing-function: cubic-bezier(.175, .885, .32, 1.15);
        transition-timing-function: cubic-bezier(.175, .885, .32, 1.15)
    }

    .tooltipster-slide.tooltipster-initial
    {
        left: -40px!important
    }

    .tooltipster-slide.tooltipster-dying
    {
        -webkit-transition-property: all;
        -moz-transition-property: all;
        -o-transition-property: all;
        -ms-transition-property: all;
        transition-property: all;
        left: 0!important;
        opacity: 0
    }

    @keyframes tooltipster-fading
    {
        0%
        {
            opacity: 0
        }

        100%
        {
            opacity: 1
        }
    }

    .tooltipster-update-fade
    {
        animation: tooltipster-fading .4s
    }

    @keyframes tooltipster-rotating
    {
        25%
        {
            transform: rotate(-2deg)
        }

        75%
        {
            transform: rotate(2deg)
        }

        100%
        {
            transform: rotate(0)
        }
    }

    .tooltipster-update-rotate
    {
        animation: tooltipster-rotating .6s
    }

    @keyframes tooltipster-scaling
    {
        50%
        {
            transform: scale(1.1)
        }

        100%
        {
            transform: scale(1)
        }
    }

    .tooltipster-update-scale
    {
        animation: tooltipster-scaling .6s
    }

    .tooltipster-sidetip .tooltipster-box
    {
        background: #565656;
        border: 2px solid #000;
        border-radius: 4px
    }

    .tooltipster-sidetip.tooltipster-bottom .tooltipster-box
    {
        margin-top: 8px
    }

    .tooltipster-sidetip.tooltipster-left .tooltipster-box
    {
        margin-right: 8px
    }

    .tooltipster-sidetip.tooltipster-right .tooltipster-box
    {
        margin-left: 8px
    }

    .tooltipster-sidetip.tooltipster-top .tooltipster-box
    {
        margin-bottom: 8px
    }

    .tooltipster-sidetip .tooltipster-content
    {
        color: #fff;
        line-height: 18px;
        padding: 6px 14px
    }

    .tooltipster-sidetip .tooltipster-arrow
    {
        overflow: hidden;
        position: absolute
    }

    .tooltipster-sidetip.tooltipster-bottom .tooltipster-arrow
    {
        height: 10px;
        margin-left: -10px;
        top: 0;
        width: 20px
    }

    .tooltipster-sidetip.tooltipster-left .tooltipster-arrow
    {
        height: 20px;
        margin-top: -10px;
        right: 0;
        top: 0;
        width: 10px
    }

    .tooltipster-sidetip.tooltipster-right .tooltipster-arrow
    {
        height: 20px;
        margin-top: -10px;
        left: 0;
        top: 0;
        width: 10px
    }

    .tooltipster-sidetip.tooltipster-top .tooltipster-arrow
    {
        bottom: 0;
        height: 10px;
        margin-left: -10px;
        width: 20px
    }

    .tooltipster-sidetip .tooltipster-arrow-background,
    .tooltipster-sidetip .tooltipster-arrow-border
    {
        height: 0;
        position: absolute;
        width: 0
    }

    .tooltipster-sidetip .tooltipster-arrow-background
    {
        border: 10px solid transparent
    }

    .tooltipster-sidetip.tooltipster-bottom .tooltipster-arrow-background
    {
        border-bottom-color: #565656;
        left: 0;
        top: 3px
    }

    .tooltipster-sidetip.tooltipster-left .tooltipster-arrow-background
    {
        border-left-color: #565656;
        left: -3px;
        top: 0
    }

    .tooltipster-sidetip.tooltipster-right .tooltipster-arrow-background
    {
        border-right-color: #565656;
        left: 3px;
        top: 0
    }

    .tooltipster-sidetip.tooltipster-top .tooltipster-arrow-background
    {
        border-top-color: #565656;
        left: 0;
        top: -3px
    }

    body
    {
        background-color: #202125
    }

    kbd
    {
        background-color: #212121;
    }

    .table .thead-dark th
    {
        color: #fff;
        background-color: #343434;
        border-color: #474747
    }

    .table .thead-light th
    {
        color: #494949;
        background-color: #eee;
        border-color: #d5d5d5
    }

    .table-dark
    {
        color: #fff;
        background-color: #343434
    }

    .table-dark td,
    .table-dark th,
    .table-dark thead th
    {
        border-color: #474747
    }

    .table-dark.table-bordered
    {
        border: 0
    }

    .table-dark.table-striped tbody tr:nth-of-type(odd)
    {
        background-color: rgba(255, 255, 255, .05)
    }

    .table-dark.table-hover tbody tr:hover
    {
        color: #fff;
        background-color: rgba(255, 255, 255, .075)
    }

    @media (max-width: 575.98px)
    {
        .table-responsive-sm
        {
            display: block;
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch
        }

        .table-responsive-sm > .table-bordered
        {
            border: 0
        }
    }

    @media (max-width: 767.98px)
    {
        .table-responsive-md
        {
            display: block;
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch
        }

        .table-responsive-md > .table-bordered
        {
            border: 0
        }
    }

    @media (max-width: 991.98px)
    {
        .table-responsive-lg
        {
            display: block;
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch
        }

        .table-responsive-lg > .table-bordered
        {
            border: 0
        }
    }

    @media (max-width: 1199.98px)
    {
        .table-responsive-xl
        {
            display: block;
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch
        }

        .table-responsive-xl > .table-bordered
        {
            border: 0
        }
    }

    .table-responsive
    {
        display: block;
        width: 100%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch
    }

    .table-responsive > .table-bordered
    {
        border: 0
    }

    .form-control
    {
        display: block;
        width: 100%;
        height: calc(1.275em + .75rem + 2px);
        padding: .375rem .75rem;
        font-size: .94rem;
        font-weight: 400;
        line-height: 1.5;
        color: #494949;
        background-color: transparent;
        background-clip: padding-box;
        border: 1px solid #363636;
        border-radius: .25rem;
        transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out
    }

    @media (prefers-reduced-motion: reduce)
    {
        .form-control
        {
            transition: none
        }
    }

    .form-control::-ms-expand
    {
        background-color: transparent;
        border: 0
    }

    .form-control:-moz-focusring
    {
        color: transparent;
        text-shadow: 0 0 0 #494949
    }

    .form-control:focus
    {
        color: #494949;
        background-color: transparent;
        border-color: #5c5c5c;
        outline: 0
    }

    .form-control::placeholder
    {
        color: #fff;
        opacity: 1
    }

    .form-control:disabled,
    .form-control[readonly]
    {
        background-color: #212121;
        opacity: 1
    }

    .btn-primary
    {
        color: #000;
        background-color: #933ec8;
        border-color: #933ec8
    }

    .btn-primary:hover
    {
        color: #000;
        background-color: #933ec8;
        border-color: #933ec8
    }

    .btn-primary.focus,
    .btn-primary:focus
    {
        color: #fff;
        background-color: #933ec8;
        border-color: #933ec8;
        box-shadow: 0 0 0 .2rem rgba(61, 180, 242, .5)
    }

    .btn-primary.disabled,
    .btn-primary:disabled
    {
        color: #fff;
        background-color: #933ec8;
        border-color: #933ec8
    }

    .btn-primary:not(:disabled):not(.disabled).active,
    .btn-primary:not(:disabled):not(.disabled):active,
    .show > .btn-primary.dropdown-toggle
    {
        color: #fff;
        background-color: #933ec8;
        border-color: #933ec8
    }

    .btn-primary:not(:disabled):not(.disabled).active:focus,
    .btn-primary:not(:disabled):not(.disabled):active:focus,
    .show > .btn-primary.dropdown-toggle:focus
    {
        box-shadow: 0 0 0 .2rem rgba(61, 180, 242, .5)
    }

    .btn-secondary
    {
        color: #fff;
        background-color: #2a2c31;
        border-color: #2a2c31
    }

    .btn-secondary:hover
    {
        color: #fff;
        background-color: #090909;
        border-color: #030303
    }

    .btn-secondary.focus,
    .btn-secondary:focus
    {
        color: #fff;
        background-color: #090909;
        border-color: #030303;
        box-shadow: 0 0 0 .2rem rgba(62, 62, 62, .5)
    }

    .btn-secondary.disabled,
    .btn-secondary:disabled
    {
        color: #fff;
        background-color: #2a2c31;
        border-color: #2a2c31
    }

    .btn-secondary:not(:disabled):not(.disabled).active,
    .btn-secondary:not(:disabled):not(.disabled):active,
    .show > .btn-secondary.dropdown-toggle
    {
        color: #fff;
        background-color: #030303;
        border-color: #000
    }

    .btn-secondary:not(:disabled):not(.disabled).active:focus,
    .btn-secondary:not(:disabled):not(.disabled):active:focus,
    .show > .btn-secondary.dropdown-toggle:focus
    {
        box-shadow: 0 0 0 .2rem rgba(62, 62, 62, .5)
    }

    .btn-success
    {
        color: #fff;
        background-color: #28a745;
        border-color: #28a745
    }

    .btn-success:hover
    {
        color: #fff;
        background-color: #218838;
        border-color: #1e7e34
    }

    .btn-success.focus,
    .btn-success:focus
    {
        color: #fff;
        background-color: #218838;
        border-color: #1e7e34;
        box-shadow: 0 0 0 .2rem rgba(72, 180, 97, .5)
    }

    .btn-success.disabled,
    .btn-success:disabled
    {
        color: #fff;
        background-color: #28a745;
        border-color: #28a745
    }

    .btn-success:not(:disabled):not(.disabled).active,
    .btn-success:not(:disabled):not(.disabled):active,
    .show > .btn-success.dropdown-toggle
    {
        color: #fff;
        background-color: #1e7e34;
        border-color: #1c7430
    }

    .btn-success:not(:disabled):not(.disabled).active:focus,
    .btn-success:not(:disabled):not(.disabled):active:focus,
    .show > .btn-success.dropdown-toggle:focus
    {
        box-shadow: 0 0 0 .2rem rgba(72, 180, 97, .5)
    }

    .btn-info
    {
        color: #fff;
        background-color: #933ec8;
        border-color: #933ec8
    }

    .btn-info:hover
    {
        color: #fff;
        background-color: #933ec8;
        border-color: #933ec8
    }

    .btn-info.focus,
    .btn-info:focus
    {
        color: #fff;
        background-color: #933ec8;
        border-color: #933ec8;
        box-shadow: 0 0 0 .2rem rgba(58, 176, 195, .5)
    }

    .btn-info.disabled,
    .btn-info:disabled
    {
        color: #fff;
        background-color: #933ec8;
        border-color: #933ec8
    }

    .btn-info:not(:disabled):not(.disabled).active,
    .btn-info:not(:disabled):not(.disabled):active,
    .show > .btn-info.dropdown-toggle
    {
        color: #fff;
        background-color: #933ec8;
        border-color: #933ec8
    }

    .btn-info:not(:disabled):not(.disabled).active:focus,
    .btn-info:not(:disabled):not(.disabled):active:focus,
    .show > .btn-info.dropdown-toggle:focus
    {
        box-shadow: 0 0 0 .2rem rgba(58, 176, 195, .5)
    }

    .btn-warning
    {
        color: #212121;
        background-color: #ffc107;
        border-color: #ffc107
    }

    .btn-warning:hover
    {
        color: #212121;
        background-color: #e0a800;
        border-color: #d39e00
    }

    .btn-warning.focus,
    .btn-warning:focus
    {
        color: #212121;
        background-color: #e0a800;
        border-color: #d39e00;
        box-shadow: 0 0 0 .2rem rgba(222, 169, 11, .5)
    }

    .btn-warning.disabled,
    .btn-warning:disabled
    {
        color: #212121;
        background-color: #ffc107;
        border-color: #ffc107
    }

    .btn-warning:not(:disabled):not(.disabled).active,
    .btn-warning:not(:disabled):not(.disabled):active,
    .show > .btn-warning.dropdown-toggle
    {
        color: #212121;
        background-color: #d39e00;
        border-color: #c69500
    }

    .btn-warning:not(:disabled):not(.disabled).active:focus,
    .btn-warning:not(:disabled):not(.disabled):active:focus,
    .show > .btn-warning.dropdown-toggle:focus
    {
        box-shadow: 0 0 0 .2rem rgba(222, 169, 11, .5)
    }

    .btn-danger
    {
        color: #fff;
        background-color: #dc3545;
        border-color: #dc3545
    }

    .btn-danger:hover
    {
        color: #fff;
        background-color: #c82333;
        border-color: #bd2130
    }

    .btn-danger.focus,
    .btn-danger:focus
    {
        color: #fff;
        background-color: #c82333;
        border-color: #bd2130;
        box-shadow: 0 0 0 .2rem rgba(225, 83, 97, .5)
    }

    .btn-danger.disabled,
    .btn-danger:disabled
    {
        color: #fff;
        background-color: #dc3545;
        border-color: #dc3545
    }

    .btn-danger:not(:disabled):not(.disabled).active,
    .btn-danger:not(:disabled):not(.disabled):active,
    .show > .btn-danger.dropdown-toggle
    {
        color: #fff;
        background-color: #bd2130;
        border-color: #b21f2d
    }

    .btn-danger:not(:disabled):not(.disabled).active:focus,
    .btn-danger:not(:disabled):not(.disabled):active:focus,
    .show > .btn-danger.dropdown-toggle:focus
    {
        box-shadow: 0 0 0 .2rem rgba(225, 83, 97, .5)
    }

    .btn-light
    {
        color: #212121;
        background-color: #f8f8f8;
        border-color: #f8f8f8
    }

    .btn-light:hover
    {
        color: #212121;
        background-color: #e5e5e5;
        border-color: #dfdfdf
    }

    .btn-light.focus,
    .btn-light:focus
    {
        color: #212121;
        background-color: #e5e5e5;
        border-color: #dfdfdf;
        box-shadow: 0 0 0 .2rem rgba(216, 216, 216, .5)
    }

    .btn-light.disabled,
    .btn-light:disabled
    {
        color: #212121;
        background-color: #f8f8f8;
        border-color: #f8f8f8
    }

    .btn-light:not(:disabled):not(.disabled).active,
    .btn-light:not(:disabled):not(.disabled):active,
    .show > .btn-light.dropdown-toggle
    {
        color: #212121;
        background-color: #dfdfdf;
        border-color: #d8d8d8
    }

    .btn-light:not(:disabled):not(.disabled).active:focus,
    .btn-light:not(:disabled):not(.disabled):active:focus,
    .show > .btn-light.dropdown-toggle:focus
    {
        box-shadow: 0 0 0 .2rem rgba(216, 216, 216, .5)
    }

    .btn-dark
    {
        color: #fff;
        background-color: #343434;
        border-color: #343434
    }

    .btn-dark:hover
    {
        color: #fff;
        background-color: #212121;
        border-color: #1b1b1b
    }

    .btn-dark.focus,
    .btn-dark:focus
    {
        color: #fff;
        background-color: #212121;
        border-color: #1b1b1b;
        box-shadow: 0 0 0 .2rem rgba(82, 82, 82, .5)
    }

    .btn-dark.disabled,
    .btn-dark:disabled
    {
        color: #fff;
        background-color: #343434;
        border-color: #343434
    }

    .btn-dark:not(:disabled):not(.disabled).active,
    .btn-dark:not(:disabled):not(.disabled):active,
    .show > .btn-dark.dropdown-toggle
    {
        color: #fff;
        background-color: #1b1b1b;
        border-color: #141414
    }

    .btn-dark:not(:disabled):not(.disabled).active:focus,
    .btn-dark:not(:disabled):not(.disabled):active:focus,
    .show > .btn-dark.dropdown-toggle:focus
    {
        box-shadow: 0 0 0 .2rem rgba(82, 82, 82, .5)
    }

    .btn-outline-primary
    {
        color: #933ec8;
        border-color: #933ec8
    }

    .btn-outline-primary:hover
    {
        color: #fff;
        background-color: #933ec8;
        border-color: #933ec8
    }

    .btn-outline-primary.focus,
    .btn-outline-primary:focus
    {
        box-shadow: 0 0 0 .2rem rgba(90, 46, 152, .5)
    }

    .btn-outline-primary.disabled,
    .btn-outline-primary:disabled
    {
        color: #933ec8;
        background-color: transparent
    }

    .btn-outline-primary:not(:disabled):not(.disabled).active,
    .btn-outline-primary:not(:disabled):not(.disabled):active,
    .show > .btn-outline-primary.dropdown-toggle
    {
        color: #fff;
        background-color: #933ec8;
        border-color: #933ec8
    }

    .btn-outline-primary:not(:disabled):not(.disabled).active:focus,
    .btn-outline-primary:not(:disabled):not(.disabled):active:focus,
    .show > .btn-outline-primary.dropdown-toggle:focus
    {
        box-shadow: 0 0 0 .2rem rgba(90, 46, 152, .5)
    }

    .btn-outline-secondary
    {
        color: #2a2c31;
        border-color: #2a2c31
    }

    .btn-outline-secondary:hover
    {
        color: #fff;
        background-color: #2a2c31;
        border-color: #2a2c31
    }

    .btn-outline-secondary.focus,
    .btn-outline-secondary:focus
    {
        box-shadow: 0 0 0 .2rem rgba(28, 28, 28, .5)
    }

    .btn-outline-secondary.disabled,
    .btn-outline-secondary:disabled
    {
        color: #2a2c31;
        background-color: transparent
    }

    .btn-outline-secondary:not(:disabled):not(.disabled).active,
    .btn-outline-secondary:not(:disabled):not(.disabled):active,
    .show > .btn-outline-secondary.dropdown-toggle
    {
        color: #fff;
        background-color: #2a2c31;
        border-color: #2a2c31
    }

    .btn-outline-secondary:not(:disabled):not(.disabled).active:focus,
    .btn-outline-secondary:not(:disabled):not(.disabled):active:focus,
    .show > .btn-outline-secondary.dropdown-toggle:focus
    {
        box-shadow: 0 0 0 .2rem rgba(28, 28, 28, .5)
    }

    .btn-outline-success
    {
        color: #28a745;
        border-color: #28a745
    }

    .btn-outline-success:hover
    {
        color: #fff;
        background-color: #28a745;
        border-color: #28a745
    }

    .btn-outline-success.focus,
    .btn-outline-success:focus
    {
        box-shadow: 0 0 0 .2rem rgba(40, 167, 69, .5)
    }

    .btn-outline-success.disabled,
    .btn-outline-success:disabled
    {
        color: #28a745;
        background-color: transparent
    }

    .btn-outline-success:not(:disabled):not(.disabled).active,
    .btn-outline-success:not(:disabled):not(.disabled):active,
    .show > .btn-outline-success.dropdown-toggle
    {
        color: #fff;
        background-color: #28a745;
        border-color: #28a745
    }

    .btn-outline-success:not(:disabled):not(.disabled).active:focus,
    .btn-outline-success:not(:disabled):not(.disabled):active:focus,
    .show > .btn-outline-success.dropdown-toggle:focus
    {
        box-shadow: 0 0 0 .2rem rgba(40, 167, 69, .5)
    }

    .btn-outline-info
    {
        color: #933ec8;
        border-color: #933ec8
    }

    .btn-outline-info:hover
    {
        color: #fff;
        background-color: #933ec8;
        border-color: #933ec8
    }

    .btn-outline-info.focus,
    .btn-outline-info:focus
    {
        box-shadow: 0 0 0 .2rem rgba(23, 162, 184, .5)
    }

    .btn-outline-info.disabled,
    .btn-outline-info:disabled
    {
        color: #933ec8;
        background-color: transparent
    }

    .btn-outline-info:not(:disabled):not(.disabled).active,
    .btn-outline-info:not(:disabled):not(.disabled):active,
    .show > .btn-outline-info.dropdown-toggle
    {
        color: #fff;
        background-color: #933ec8;
        border-color: #933ec8
    }

    .btn-outline-info:not(:disabled):not(.disabled).active:focus,
    .btn-outline-info:not(:disabled):not(.disabled):active:focus,
    .show > .btn-outline-info.dropdown-toggle:focus
    {
        box-shadow: 0 0 0 .2rem rgba(23, 162, 184, .5)
    }

    .btn-outline-warning
    {
        color: #ffc107;
        border-color: #ffc107
    }

    .btn-outline-warning:hover
    {
        color: #212121;
        background-color: #ffc107;
        border-color: #ffc107
    }

    .btn-outline-warning.focus,
    .btn-outline-warning:focus
    {
        box-shadow: 0 0 0 .2rem rgba(255, 193, 7, .5)
    }

    .btn-outline-warning.disabled,
    .btn-outline-warning:disabled
    {
        color: #ffc107;
        background-color: transparent
    }

    .btn-outline-warning:not(:disabled):not(.disabled).active,
    .btn-outline-warning:not(:disabled):not(.disabled):active,
    .show > .btn-outline-warning.dropdown-toggle
    {
        color: #212121;
        background-color: #ffc107;
        border-color: #ffc107
    }

    .btn-outline-warning:not(:disabled):not(.disabled).active:focus,
    .btn-outline-warning:not(:disabled):not(.disabled):active:focus,
    .show > .btn-outline-warning.dropdown-toggle:focus
    {
        box-shadow: 0 0 0 .2rem rgba(255, 193, 7, .5)
    }

    .btn-outline-danger
    {
        color: #dc3545;
        border-color: #dc3545
    }

    .btn-outline-danger:hover
    {
        color: #fff;
        background-color: #dc3545;
        border-color: #dc3545
    }

    .btn-outline-danger.focus,
    .btn-outline-danger:focus
    {
        box-shadow: 0 0 0 .2rem rgba(220, 53, 69, .5)
    }

    .btn-outline-danger.disabled,
    .btn-outline-danger:disabled
    {
        color: #dc3545;
        background-color: transparent
    }

    .btn-outline-danger:not(:disabled):not(.disabled).active,
    .btn-outline-danger:not(:disabled):not(.disabled):active,
    .show > .btn-outline-danger.dropdown-toggle
    {
        color: #fff;
        background-color: #dc3545;
        border-color: #dc3545
    }

    .btn-outline-danger:not(:disabled):not(.disabled).active:focus,
    .btn-outline-danger:not(:disabled):not(.disabled):active:focus,
    .show > .btn-outline-danger.dropdown-toggle:focus
    {
        box-shadow: 0 0 0 .2rem rgba(220, 53, 69, .5)
    }

    .btn-outline-light
    {
        color: #f8f8f8;
        border-color: #f8f8f8
    }

    .btn-outline-light:hover
    {
        color: #212121;
        background-color: #f8f8f8;
        border-color: #f8f8f8
    }

    .btn-outline-light.focus,
    .btn-outline-light:focus
    {
        box-shadow: 0 0 0 .2rem rgba(248, 248, 248, .5)
    }

    .btn-outline-light.disabled,
    .btn-outline-light:disabled
    {
        color: #f8f8f8;
        background-color: transparent
    }

    .btn-outline-light:not(:disabled):not(.disabled).active,
    .btn-outline-light:not(:disabled):not(.disabled):active,
    .show > .btn-outline-light.dropdown-toggle
    {
        color: #212121;
        background-color: #f8f8f8;
        border-color: #f8f8f8
    }

    .btn-outline-light:not(:disabled):not(.disabled).active:focus,
    .btn-outline-light:not(:disabled):not(.disabled):active:focus,
    .show > .btn-outline-light.dropdown-toggle:focus
    {
        box-shadow: 0 0 0 .2rem rgba(248, 248, 248, .5)
    }

    .btn-outline-dark
    {
        color: #343434;
        border-color: #343434
    }

    .btn-outline-dark:hover
    {
        color: #fff;
        background-color: #343434;
        border-color: #343434
    }

    .btn-outline-dark.focus,
    .btn-outline-dark:focus
    {
        box-shadow: 0 0 0 .2rem rgba(52, 52, 52, .5)
    }

    .btn-outline-dark.disabled,
    .btn-outline-dark:disabled
    {
        color: #343434;
        background-color: transparent
    }

    .btn-outline-dark:not(:disabled):not(.disabled).active,
    .btn-outline-dark:not(:disabled):not(.disabled):active,
    .show > .btn-outline-dark.dropdown-toggle
    {
        color: #fff;
        background-color: #343434;
        border-color: #343434
    }

    .btn-outline-dark:not(:disabled):not(.disabled).active:focus,
    .btn-outline-dark:not(:disabled):not(.disabled):active:focus,
    .show > .btn-outline-dark.dropdown-toggle:focus
    {
        box-shadow: 0 0 0 .2rem rgba(52, 52, 52, .5)
    }

    .btn-link
    {
        font-weight: 400;
        color: #fff;
        text-decoration: none
    }

    .btn-link:hover
    {
        color: #e0d3f2;
        text-decoration: none
    }

    .btn-link.focus,
    .btn-link:focus
    {
        text-decoration: none
    }

    .btn-link.disabled,
    .btn-link:disabled
    {
        color: #fff;
        pointer-events: none
    }

    .btn-group-lg > .btn,
    .btn-lg
    {
        padding: .45rem 2.8rem;
        font-size: .99875rem;
        line-height: 1.5;
        border-radius: .3rem
    }

    .btn-group-sm > .btn,
    .btn-sm
    {
        padding: .25rem 1.75rem;
        font-size: .69912rem;
        line-height: 1.5;
        border-radius: .2rem
    }

    .btn-block
    {
        display: block;
        width: 100%
    }

    .btn-block + .btn-block
    {
        margin-top: .5rem
    }

    input[type=button].btn-block,
    input[type=reset].btn-block,
    input[type=submit].btn-block
    {
        width: 100%
    }

    .fade
    {
        transition: opacity .15s linear
    }

    @media (prefers-reduced-motion: reduce)
    {
        .fade
        {
            transition: none
        }
    }

    .fade:not(.show)
    {
        opacity: 0
    }

    .collapse:not(.show)
    {
        display: none
    }

    .collapsing
    {
        position: relative;
        height: 0;
        overflow: hidden;
        transition: height .35s ease
    }

    @media (prefers-reduced-motion: reduce)
    {
        .collapsing
        {
            transition: none
        }
    }

    .dropdown,
    .dropleft,
    .dropright,
    .dropup
    {
        position: relative
    }

    .dropdown-toggle
    {
        white-space: nowrap
    }

    .dropdown-toggle::after
    {
        display: inline-block;
        margin-left: .255em;
        vertical-align: .255em;
        content: "";
        border-top: .3em solid;
        border-right: .3em solid transparent;
        border-bottom: 0;
        border-left: .3em solid transparent
    }

    .dropdown-toggle:empty::after
    {
        margin-left: 0
    }

    .dropdown-menu
    {
        position: absolute;
        top: 100%;
        left: 0;
        z-index: 1000;
        display: none;
        float: left;
        min-width: 10rem;
        padding: .5rem 0;
        margin: .125rem 0 0;
        font-size: .94rem;
        color: #fff;
        text-align: left;
        list-style: none;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid rgba(0, 0, 0, .15);
        border-radius: .25rem
    }

    .dropdown-menu-left
    {
        right: auto;
        left: 0
    }

    .dropdown-menu-right
    {
        right: 0;
        left: auto
    }

    @media (min-width: 576px)
    {
        .dropdown-menu-sm-left
        {
            right: auto;
            left: 0
        }

        .dropdown-menu-sm-right
        {
            right: 0;
            left: auto
        }
    }

    @media (min-width: 768px)
    {
        .dropdown-menu-md-left
        {
            right: auto;
            left: 0
        }

        .dropdown-menu-md-right
        {
            right: 0;
            left: auto
        }
    }

    @media (min-width: 992px)
    {
        .dropdown-menu-lg-left
        {
            right: auto;
            left: 0
        }

        .dropdown-menu-lg-right
        {
            right: 0;
            left: auto
        }
    }

    @media (min-width: 1200px)
    {
        .dropdown-menu-xl-left
        {
            right: auto;
            left: 0
        }

        .dropdown-menu-xl-right
        {
            right: 0;
            left: auto
        }
    }

    .dropup .dropdown-menu
    {
        top: auto;
        bottom: 100%;
        margin-top: 0;
        margin-bottom: .125rem
    }

    .dropup .dropdown-toggle::after
    {
        display: inline-block;
        margin-left: .255em;
        vertical-align: .255em;
        content: "";
        border-top: 0;
        border-right: .3em solid transparent;
        border-bottom: .3em solid;
        border-left: .3em solid transparent
    }

    .dropup .dropdown-toggle:empty::after
    {
        margin-left: 0
    }

    .dropright .dropdown-menu
    {
        top: 0;
        right: auto;
        left: 100%;
        margin-top: 0;
        margin-left: .125rem
    }

    .dropright .dropdown-toggle::after
    {
        display: inline-block;
        margin-left: .255em;
        vertical-align: .255em;
        content: "";
        border-top: .3em solid transparent;
        border-right: 0;
        border-bottom: .3em solid transparent;
        border-left: .3em solid
    }

    .dropright .dropdown-toggle:empty::after
    {
        margin-left: 0
    }

    .dropright .dropdown-toggle::after
    {
        vertical-align: 0
    }

    .dropleft .dropdown-menu
    {
        top: 0;
        right: 100%;
        left: auto;
        margin-top: 0;
        margin-right: .125rem
    }

    .dropleft .dropdown-toggle::after
    {
        display: inline-block;
        margin-left: .255em;
        vertical-align: .255em;
        content: ""
    }

    .dropleft .dropdown-toggle::after
    {
        display: none
    }

    .dropleft .dropdown-toggle::before
    {
        display: inline-block;
        margin-right: .255em;
        vertical-align: .255em;
        content: "";
        border-top: .3em solid transparent;
        border-right: .3em solid;
        border-bottom: .3em solid transparent
    }

    .dropleft .dropdown-toggle:empty::after
    {
        margin-left: 0
    }

    .dropleft .dropdown-toggle::before
    {
        vertical-align: 0
    }

    .dropdown-menu[x-placement^=bottom],
    .dropdown-menu[x-placement^=left],
    .dropdown-menu[x-placement^=right],
    .dropdown-menu[x-placement^=top]
    {
        right: auto;
        bottom: auto
    }

    .dropdown-divider
    {
        height: 0;
        margin: .5rem 0;
        overflow: hidden;
        border-top: 1px solid #eee
    }

    .dropdown-item
    {
        display: block;
        width: 100%;
        padding: .25rem 1.5rem;
        clear: both;
        font-weight: 400;
        color: #212121;
        text-align: inherit;
        white-space: nowrap;
        background-color: transparent;
        border: 0
    }

    .dropdown-item:focus,
    .dropdown-item:hover
    {
        color: #141414;
        text-decoration: none;
        background-color: #f8f8f8
    }

    .dropdown-item.active,
    .dropdown-item:active
    {
        color: #fff;
        text-decoration: none;
        background-color: #f8f8f8
    }

    .dropdown-item.disabled,
    .dropdown-item:disabled
    {
        color: #fff;
        pointer-events: none;
        background-color: transparent
    }

    .dropdown-menu.show
    {
        display: block
    }

    .dropdown-header
    {
        display: block;
        padding: .5rem 1.5rem;
        margin-bottom: 0;
        font-size: .8225rem;
        color: #fff;
        white-space: nowrap
    }

    .dropdown-item-text
    {
        display: block;
        padding: .25rem 1.5rem;
        color: #212121
    }

    .btn-group,
    .btn-group-vertical
    {
        position: relative;
        display: inline-flex;
        vertical-align: middle
    }

    .btn-group-vertical > .btn,
    .btn-group > .btn
    {
        position: relative;
        flex: 1 1 auto
    }

    .btn-group-vertical > .btn:hover,
    .btn-group > .btn:hover
    {
        z-index: 1
    }

    .btn-group-vertical > .btn.active,
    .btn-group-vertical > .btn:active,
    .btn-group-vertical > .btn:focus,
    .btn-group > .btn.active,
    .btn-group > .btn:active,
    .btn-group > .btn:focus
    {
        z-index: 1
    }

    .btn-toolbar
    {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start
    }

    .btn-toolbar .input-group
    {
        width: auto
    }

    .btn-group > .btn-group:not(:first-child),
    .btn-group > .btn:not(:first-child)
    {
        margin-left: -1px
    }

    .btn-group > .btn-group:not(:last-child) > .btn,
    .btn-group > .btn:not(:last-child):not(.dropdown-toggle)
    {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0
    }

    .btn-group > .btn-group:not(:first-child) > .btn,
    .btn-group > .btn:not(:first-child)
    {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0
    }

    .dropdown-toggle-split
    {
        padding-right: 1.96875rem;
        padding-left: 1.96875rem
    }

    .dropdown-toggle-split::after,
    .dropright .dropdown-toggle-split::after,
    .dropup .dropdown-toggle-split::after
    {
        margin-left: 0
    }

    .dropleft .dropdown-toggle-split::before
    {
        margin-right: 0
    }

    .btn-group-sm > .btn + .dropdown-toggle-split,
    .btn-sm + .dropdown-toggle-split
    {
        padding-right: 1.3125rem;
        padding-left: 1.3125rem
    }

    .btn-group-lg > .btn + .dropdown-toggle-split,
    .btn-lg + .dropdown-toggle-split
    {
        padding-right: 2.1rem;
        padding-left: 2.1rem
    }

    .btn-group-vertical
    {
        flex-direction: column;
        align-items: flex-start;
        justify-content: center
    }

    .btn-group-vertical > .btn,
    .btn-group-vertical > .btn-group
    {
        width: 100%
    }

    .btn-group-vertical > .btn-group:not(:first-child),
    .btn-group-vertical > .btn:not(:first-child)
    {
        margin-top: -1px
    }

    .btn-group-vertical > .btn-group:not(:last-child) > .btn,
    .btn-group-vertical > .btn:not(:last-child):not(.dropdown-toggle)
    {
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0
    }

    .btn-group-vertical > .btn-group:not(:first-child) > .btn,
    .btn-group-vertical > .btn:not(:first-child)
    {
        border-top-left-radius: 0;
        border-top-right-radius: 0
    }

    .btn-group-toggle > .btn,
    .btn-group-toggle > .btn-group > .btn
    {
        margin-bottom: 0
    }

    .btn-group-toggle > .btn input[type=checkbox],
    .btn-group-toggle > .btn input[type=radio],
    .btn-group-toggle > .btn-group > .btn input[type=checkbox],
    .btn-group-toggle > .btn-group > .btn input[type=radio]
    {
        position: absolute;
        clip: rect(0, 0, 0, 0);
        pointer-events: none
    }

    .input-group
    {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        align-items: stretch;
        width: 100%
    }

    .input-group > .custom-file,
    .input-group > .custom-select,
    .input-group > .form-control,
    .input-group > .form-control-plaintext
    {
        position: relative;
        flex: 1 1 auto;
        width: 1%;
        min-width: 0;
        margin-bottom: 0
    }

    .input-group > .custom-file + .custom-file,
    .input-group > .custom-file + .custom-select,
    .input-group > .custom-file + .form-control,
    .input-group > .custom-select + .custom-file,
    .input-group > .custom-select + .custom-select,
    .input-group > .custom-select + .form-control,
    .input-group > .form-control + .custom-file,
    .input-group > .form-control + .custom-select,
    .input-group > .form-control + .form-control,
    .input-group > .form-control-plaintext + .custom-file,
    .input-group > .form-control-plaintext + .custom-select,
    .input-group > .form-control-plaintext + .form-control
    {
        margin-left: -1px
    }

    .input-group > .custom-file .custom-file-input:focus ~ .custom-file-label,
    .input-group > .custom-select:focus,
    .input-group > .form-control:focus
    {
        z-index: 3
    }

    .input-group > .custom-file .custom-file-input:focus
    {
        z-index: 4
    }

    .input-group > .custom-select:not(:last-child),
    .input-group > .form-control:not(:last-child)
    {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0
    }

    .input-group > .custom-select:not(:first-child),
    .input-group > .form-control:not(:first-child)
    {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0
    }

    .input-group > .custom-file
    {
        display: flex;
        align-items: center
    }

    .input-group > .custom-file:not(:last-child) .custom-file-label,
    .input-group > .custom-file:not(:last-child) .custom-file-label::after
    {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0
    }

    .input-group > .custom-file:not(:first-child) .custom-file-label
    {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0
    }

    .input-group-append,
    .input-group-prepend
    {
        display: flex
    }

    .input-group-append .btn,
    .input-group-prepend .btn
    {
        position: relative;
        z-index: 2
    }

    .input-group-append .btn:focus,
    .input-group-prepend .btn:focus
    {
        z-index: 3
    }

    .input-group-append .btn + .btn,
    .input-group-append .btn + .input-group-text,
    .input-group-append .input-group-text + .btn,
    .input-group-append .input-group-text + .input-group-text,
    .input-group-prepend .btn + .btn,
    .input-group-prepend .btn + .input-group-text,
    .input-group-prepend .input-group-text + .btn,
    .input-group-prepend .input-group-text + .input-group-text
    {
        margin-left: -1px
    }

    .input-group-prepend
    {
        margin-right: -1px
    }

    .input-group-append
    {
        margin-left: -1px
    }

    .input-group-text
    {
        display: flex;
        align-items: center;
        padding: .375rem .75rem;
        margin-bottom: 0;
        font-size: .94rem;
        font-weight: 400;
        line-height: 1.5;
        color: #494949;
        text-align: center;
        white-space: nowrap;
        background-color: #eee;
        border: 1px solid #363636;
        border-radius: .25rem
    }

    .input-group-text input[type=checkbox],
    .input-group-text input[type=radio]
    {
        margin-top: 0
    }

    .input-group-lg > .custom-select,
    .input-group-lg > .form-control:not(textarea)
    {
        height: calc(1.275em + .9rem + 2px)
    }

    .input-group-lg > .custom-select,
    .input-group-lg > .form-control,
    .input-group-lg > .input-group-append > .btn,
    .input-group-lg > .input-group-append > .input-group-text,
    .input-group-lg > .input-group-prepend > .btn,
    .input-group-lg > .input-group-prepend > .input-group-text
    {
        padding: .45rem .8rem;
        font-size: 1.175rem;
        line-height: 1.5;
        border-radius: .3rem
    }

    .input-group-sm > .custom-select,
    .input-group-sm > .form-control:not(textarea)
    {
        height: calc(1.275em + .5rem + 2px)
    }

    .input-group-sm > .custom-select,
    .input-group-sm > .form-control,
    .input-group-sm > .input-group-append > .btn,
    .input-group-sm > .input-group-append > .input-group-text,
    .input-group-sm > .input-group-prepend > .btn,
    .input-group-sm > .input-group-prepend > .input-group-text
    {
        padding: .25rem .5rem;
        font-size: .8225rem;
        line-height: 1.5;
        border-radius: .2rem
    }

    .input-group-lg > .custom-select,
    .input-group-sm > .custom-select
    {
        padding-right: 1.6375rem
    }

    .input-group > .input-group-append:last-child > .btn:not(:last-child):not(.dropdown-toggle),
    .input-group > .input-group-append:last-child > .input-group-text:not(:last-child),
    .input-group > .input-group-append:not(:last-child) > .btn,
    .input-group > .input-group-append:not(:last-child) > .input-group-text,
    .input-group > .input-group-prepend > .btn,
    .input-group > .input-group-prepend > .input-group-text
    {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0
    }

    .input-group > .input-group-append > .btn,
    .input-group > .input-group-append > .input-group-text,
    .input-group > .input-group-prepend:first-child > .btn:not(:first-child),
    .input-group > .input-group-prepend:first-child > .input-group-text:not(:first-child),
    .input-group > .input-group-prepend:not(:first-child) > .btn,
    .input-group > .input-group-prepend:not(:first-child) > .input-group-text
    {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0
    }

    .custom-control
    {
        position: relative;
        z-index: 1;
        display: block;
        min-height: 1.41rem;
        padding-left: 1.5rem
    }

    .custom-control-inline
    {
        display: inline-flex;
        margin-right: 1rem
    }

    .custom-control-input
    {
        position: absolute;
        left: 0;
        z-index: -1;
        width: 1rem;
        height: 1.205rem;
        opacity: 0
    }

    .custom-control-input:checked ~ .custom-control-label::before
    {
        color: #fff;
        border-color: #f8f8f8;
        background-color: #f8f8f8
    }

    .custom-control-input:focus ~ .custom-control-label::before
    {
        box-shadow: 0 0 0 .2rem rgba(248, 248, 248, .08)
    }

    .custom-control-input:focus:not(:checked) ~ .custom-control-label::before
    {
        border-color: #5c5c5c
    }

    .custom-control-input:not(:disabled):active ~ .custom-control-label::before
    {
        color: #fff;
        background-color: #fff;
        border-color: #fff
    }

    .custom-control-input:disabled ~ .custom-control-label,
    .custom-control-input[disabled] ~ .custom-control-label
    {
        color: #fff
    }

    .custom-control-input:disabled ~ .custom-control-label::before,
    .custom-control-input[disabled] ~ .custom-control-label::before
    {
        background-color: #212121
    }

    .nav-tabs .nav-item.show .nav-link,
    .nav-tabs .nav-link.active
    {
        color: #494949;
    }

    .badge-primary
    {
        color: #fff;
        background-color: #933ec8
    }

    a.badge-primary:focus,
    a.badge-primary:hover
    {
        color: #fff;
        background-color: #933ec8
    }

    .badge-secondary
    {
        color: #fff;
        background-color: #2a2c31
    }

    .badge-warning
    {
        color: #212121;
    }

    a.badge-warning:focus,
    a.badge-warning:hover
    {
        color: #212121;
    }

    .badge-light
    {
        color: #212121;
        background-color: #f8f8f8
    }

    a.badge-light:focus,
    a.badge-light:hover
    {
        color: #212121;
        background-color: #dfdfdf
    }

    .badge-dark
    {
        color: #fff;
        background-color: #343434
    }

    .alert-light .alert-link
    {
        color: #686868
    }

    .progress-bar
    {
        background-color: #933ec8;
    }

    .list-group-item.disabled,
    .list-group-item:disabled
    {
        color: #fff;
        pointer-events: none;
        background-color: #2a2c31
    }

    ul.anime-list li .poster .tag.ep
    {
        color: #000;
        background: #933ec8;
    }

    .bg-primary
    {
        background-color: #933ec8!important
    }

    a.bg-primary:focus,
    a.bg-primary:hover,
    button.bg-primary:focus,
    button.bg-primary:hover
    {
        background-color: #933ec8!important
    }

    .bg-secondary
    {
        background-color: #2a2c31!important
    }

    .bg-dark
    {
        background-color: #343434!important
    }

    .border-primary
    {
        border-color: #933ec8!important
    }

    .border-secondary
    {
        border-color: #2a2c31!important
    }

    .border-dark
    {
        border-color: #343434!important
    }

    .text-primary
    {
        color: #933ec8!important
    }

    .text-secondary
    {
        color: #2a2c31!important
    }

    .dropdown-item.active,
    .dropdown-item:active
    {
        color: #933ec8
    }

    header #menu.show .toggler,
    header #menu:focus .toggler,
    header #menu:focus-within .toggler,
    header #menu:hover .toggler
    {
        color: #933ec8
    }

    header #menu .menu > ul
    {
        background: #2a2c31;
    }

    header #menu .menu > ul > li:first-child:before
    {
        background: #933ec8;
    }

    header #menu .menu > ul > li:last-child:after
    {
        background: #933ec8;
    }

    header #menu .menu > ul > li > a
    {
        color: #000;
        background: #933ec8;
    }

    header #menu .menu > ul > li.show > a,
    header #menu .menu > ul > li:focus-within > a,
    header #menu .menu > ul > li:focus > a,
    header #menu .menu > ul > li:hover > a
    {
        background: #933ec8
    }

    header #menu .menu > ul > li > ul
    {
        background: #2a2c31;
    }

    header #menu .menu > ul > li > ul > li > a
    {
        color: #6c6c6c;
    }

    header #menu .menu > ul > li > ul > li > a:hover
    {
        color: #ccc;
        background: #242424
    }

    header #logo
    {
        margin-right: 10px;
        width: 11.1rem;
        height: 3.3rem
    }

    header #logo h1
    {
        font-size: 0;
        display: block;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0
    }

    header #logo a
    {
        display: block;
        width: 100%;
        height: 100%;
        position: relative
    }

    header #search form button:hover
    {
        color: #933ec8
    }

    .search .suggestions
    {
        background: #2a2c31;
        box-shadow: 0 2px 10px #2a2c31;
    }

    .search .suggestions a.more
    {
        background: #933ec8;
    }

    .search .suggestions a.more:hover
    {
        background: #933ec8
    }

    #slider .swiper-pagination > span.swiper-pagination-bullet-active
    {
        background: #933ec8
    }

    #slider .item .info
    {
        background: #2a2c31;
    }

    #slider .item .info .watch,
    .tooltipster-sidetip .tooltipster-box .tooltipster-content .watch
    {
        background: #933ec8;
        color: #212121;
    }

    .tooltipster-sidetip .tooltipster-box .tooltipster-content .watch:hover
    {
        color: black;
        background: rgba(4, 159, 223, .8);
    }

    #slider .item .info .watch:hover
    {
        color: #000;
    }

    #slider .item .info p
    {
        color: white;
    }

    section
    {
        background: #2a2c31;
        padding: 15px;
        border-radius: .3rem;
        margin-bottom: 1.66rem
    }

    section.nobg
    {
        background: 0 0;
        padding: 0
    }

    section.nobg .head .title
    {
        font-size: 1.6em;
        margin-top: 0
    }

    section .head .title.sm
    {
        font-size: .9em
    }

    section .head
    {
        position: relative;
        margin-bottom: 10px
    }

    section .head:after
    {
        display: block;
        clear: both;
        content: ""
    }

    section .head div,
    section .head > .title
    {
        display: inline-block;
        color: #eee
    }

    section .head .title
    {
        margin: 0;
        padding: 0;
        font-size: 1.28em;
        margin-top: -2px;
        font-weight: 500
    }

    section .head .paging
    {
        position: absolute;
        right: 0
    }

    section .head .paging + .tabs
    {
        margin-right: 60px
    }

    section .head .paging > span
    {
        padding: 3px 8px;
        cursor: pointer;
        color: #525252;
        float: left;
        border-radius: .25rem
    }

    section .head .paging > span.active,
    section .head .paging > span:hover
    {
        color: #ccc
    }

    section .head .paging > span:active:not(.disabled)
    {
        box-shadow: 0 0 0 .2rem rgba(248, 248, 248, .08)
    }

    section .head .paging > span.disabled
    {
        color: #343434;
        cursor: unset
    }

    section .head .tabs
    {
        float: right;
        margin-top: 2px
    }

    section .head .tabs a,
    section .head .tabs span
    {
        color: #525252;
        cursor: pointer;
        padding: 2px 5px;
        border-radius: .25rem;
        font-weight: 500;
        font-size: .98em;
        -webkit-transition: all .15s;
        -moz-transition: all .15s;
        transition: all .15s
    }

    section .head .tabs a:hover,
    section .head .tabs span:hover
    {
        color: #933ec8
    }

    section .head .tabs a:active,
    section .head .tabs span:active
    {
        box-shadow: 0 0 0 .2rem rgba(248, 248, 248, .08)
    }

    section .head .tabs a.active,
    section .head .tabs span.active
    {
        color: #eee
    }

    section .head .more
    {
        background: #343434;
        color: #d5d5d5;
        float: right;
        padding: 3px 8px;
        border-radius: .25rem;
        font-size: .85em;
        -webkit-transition: all .15s;
        -moz-transition: all .15s;
        transition: all .15s
    }

    section .head .more:hover
    {
        color: #f8f8f8
    }

    section .body:after
    {
        display: block;
        clear: both;
        content: ""
    }

    section.schedule .body .slider .days .items
    {
        margin-left: .75%;
        margin-right: .75%
    }

    section.schedule .body .slider .days .items .day
    {
        width: 12.57143%;
        margin: 0 .75%
    }

    section.schedule .body .slider
    {
        position: relative
    }

    section.schedule .body .slider:after
    {
        display: block;
        clear: both;
        content: ""
    }

    section.schedule .body .slider > div
    {
        height: 65px;
        float: left;
        line-height: 65px;
        border-radius: .25rem;
        overflow: hidden
    }

    section.schedule .body .slider .next,
    section.schedule .body .slider .prev
    {
        text-align: center;
        width: 35px;
        background: #303030;
        cursor: pointer;
        -webkit-transition: all .15s;
        -moz-transition: all .15s;
        transition: all .15s;
        position: relative;
        z-index: 3
    }

    section.schedule .body .slider .next:hover,
    section.schedule .body .slider .prev:hover
    {
        background: #3b3b3b
    }

    section.schedule .body .slider .prev
    {
        float: left
    }

    section.schedule .body .slider .days
    {
        position: absolute;
        top: 0;
        left: 35px;
        right: 35px
    }

    section.schedule .body .slider .days .items
    {
        width: 100%
    }

    section.schedule .body .slider .days .items .day
    {
        text-align: center;
        float: left;
        height: 65px;
        line-height: 1.2em;
        background: #242424;
        border-radius: .25rem;
        padding-top: 15px;
        cursor: pointer;
        -webkit-transition: all .15s;
        -moz-transition: all .15s;
        transition: all .15s
    }

    section.schedule .body .slider .days .items .day:last-child
    {
        margin-right: 17.5px
    }

    section.schedule .body .slider .days .items .day span
    {
        display: block;
        font-weight: 600;
        text-transform: uppercase
    }

    section.schedule .body .slider .days .items .day time
    {
        display: block;
        font-size: .85em;
        color: #fff
    }

    section.schedule .body .slider .days .items .day:hover
    {
        background: #2e2e2e
    }

    section.schedule .body .slider .days .items .day.active
    {
        background: #933ec8;
        color: #000
    }

    section.schedule .body .slider .days .items .day.active time
    {
        color: #000
    }

    section.schedule .body .slider .next
    {
        float: right
    }

    section.schedule .body .scheduled
    {
        margin-top: 20px;
        margin-left: -15px;
        margin-right: -15px
    }

    section.schedule .body .scheduled .empty
    {
        text-align: center;
        padding: 10px;
        color: #525252
    }

    section.schedule .body .scheduled a
    {
        display: block;
        padding: 8px 15px
    }

    section.schedule .body .scheduled a:after
    {
        display: block;
        clear: both;
        content: ""
    }

    section.schedule .body .scheduled a:nth-child(2n-1)
    {
        background: #191919
    }

    section.schedule .body .scheduled a:hover
    {
        background: #212121
    }

    section.schedule .body .scheduled a:hover time
    {
        color: #d5d5d5
    }

    section.schedule .body .scheduled a:hover span
    {
        color: #fff
    }

    section.schedule .body .scheduled a:hover button
    {
        background: #933ec8;
        color: #000;
    }

    section.schedule .body .scheduled a time
    {
        color: #fff;
        min-width: 60px;
        display: inline-block;
        font-size: 1.28em;
        font-weight: 300;
        -webkit-transition: all .15s;
        -moz-transition: all .15s;
        transition: all .15s
    }

    section.schedule .body .scheduled a span
    {
        color: #fff;
        -webkit-transition: all .15s;
        -moz-transition: all .15s;
        transition: all .15s;
        font-size: 1.01em
    }

    section.schedule .body .scheduled a button
    {
        background: #2b2b2b;
    }

    section.top .body ul li.top1:hover .rank
    {
        color: #933ec8
    }

    section.top .body ul li.top1 .rank
    {
        background: #f8f8f8;
        color: #212121;
        z-index: 2;
        font-weight: 700;
        border: none;
        margin-top: 0
    }

    section.top .body ul li.top1 .anime
    {
        position: relative;
        z-index: 3
    }

    section.top .body ul li.top1 .anime .thumb
    {
        display: none
    }

    section.top .body ul li.top1 .anime .info
    {
        margin-left: 0
    }

    section.top .body ul li.top1 .anime .info .name
    {
        color: #f8f8f8;
        line-height: 1em;
        margin-bottom: 5px
    }

    section.top .body ul li.top1 .anime .info .meta
    {
        color: #fff
    }

    section.top .body ul li:hover:not(.top1) .rank
    {
        border: 1px solid #fff;
        color: #fff
    }

    section.top .body ul li a
    {
        display: block;
        color: #fff
    }

    section.top .body ul li a:after
    {
        display: block;
        clear: both;
        content: ""
    }

    section.top .body ul li a:hover
    {
        color: #d5d5d5
    }

    section.top .body ul li .rank
    {
        position: absolute;
        margin-top: 12px;
        width: 38px;
        height: 38px;
        line-height: 38px;
        text-align: center;
        border: 1px solid #fff;
        border-radius: .25rem;
        color: #fff;
        font-size: 1.7em;
        font-weight: 300;
        -webkit-transition: all .15s;
        -moz-transition: all .15s;
        transition: all .15s
    }

    section.top .body ul li .anime
    {
        margin-left: 48px
    }

    section.top .body ul li .anime .thumb
    {
        float: left;
        width: 18%
    }

    section.top .body ul li .anime .thumb div
    {
        position: relative;
        padding-bottom: 130%;
        border-radius: 2px;
        overflow: hidden
    }

    section.top .body ul li .anime .thumb div img
    {
        position: absolute;
        width: 100%;
        height: 100%
    }

    section.top .body ul li .anime .info
    {
        margin-left: 22%
    }

    section.top .body ul li .anime .info .name
    {
        -webkit-transition: all .15s;
        -moz-transition: all .15s;
        transition: all .15s;
        font-size: 1.01em
    }

    section.top .body ul li .anime .info .meta
    {
        color: #525252;
        font-size: .96em
    }

    section.top .body ul li .anime .info .meta span + span
    {
        margin-left: 10px
    }

    @media screen and (max-width: 1279px)
    {
        section.top .body ul li:not(.top1)
        {
            width: 50%;
            float: left
        }
    }

    @media screen and (max-width: 992px)
    {
        section.top .body ul li:not(.top1) .anime .info .name
        {
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical
        }
    }

    @media screen and (max-width: 576px)
    {
        section.top .body ul li:not(.top1)
        {
            width: 100%;
            float: none
        }

        section.top .body ul li:not(.top1) .anime .info .name
        {
            display: block
        }
    }

    ol.navbc
    {
        list-style: none;
        padding: 0;
        margin: 0 0 8px;
        font-size: .96em
    }

    ol.navbc:after
    {
        display: block;
        clear: both;
        content: ""
    }

    ol.navbc li
    {
        float: left;
        vertical-align: middle
    }

    ol.navbc li + li a:before
    {
        content: '\\f054';
        font-family: "Font Awesome 5 Free";
        display: inline-block;
        font-weight: 900;
        font-size: .64em;
        margin: 0 6px;
        vertical-align: 1px;
        color: #fff
    }

    ol.navbc li a h1,
    ol.navbc li a h2,
    ol.navbc li a span
    {
        font-size: 1.06em;
        margin: 0;
        padding: 0;
        line-height: 1em;
        font-weight: 400;
        display: inline-block;
        color: #fff
    }

    ol.navbc li a h1,
    ol.navbc li a h2
    {
        color: #fff
    }

    ol.navbc li a:hover h1,
    ol.navbc li a:hover span
    {
        color: #ccc
    }

    footer
    {
        background: #2a2c31;
        padding: 0;
        position: relative;
        margin-top: -20.3rem
    }

    footer:after
    {
        display: block;
        clear: both;
        content: ""
    }

    footer .container
    {
        position: relative
    }

    footer .options
    {
        padding-top: 8px;
        margin-bottom: 20px;
        font-size: .8em
    }

    footer .options span
    {
        margin-right: 10px;
        display: inline-block
    }

    footer .content
    {
        position: relative;
        z-index: 2
    }

    footer .azlist
    {
        margin-bottom: 30px
    }

    footer .azlist:after
    {
        display: block;
        clear: both;
        content: ""
    }

    footer .azlist .head
    {
        margin-bottom: 10px
    }

    footer .azlist .head .title
    {
        font-weight: 500
    }

    footer .azlist .head .desc
    {
        font-size: .85em;
        color: #fff
    }

    footer .azlist .head .desc:before
    {
        content: '';
        width: 1px;
        height: 1em;
        display: inline-block;
        background: #ccc;
        margin-left: 10px;
        margin-right: 15px;
        vertical-align: middle
    }

    footer .azlist ul
    {
        list-style: none;
        margin: 0;
        padding: 0
    }

    footer .azlist ul li
    {
        float: left
    }

    footer .azlist ul li a
    {
        padding: 2px 5px;
        background: #363636;
        min-width: 30px;
        display: block;
        text-align: center;
        border-radius: 2px;
        margin: 0 8px 8px 0;
        color: #ccc;
        -webkit-transition: all .15s;
        -moz-transition: all .15s;
        transition: all .15s
    }

    footer .azlist ul li a:hover
    {
        background: #933ec8;
        color: #fff
    }

    footer .info
    {
        width: 50%;
        float: left;
        font-size: .96em
    }

    footer .info .logo
    {
        width: 165px;
        height: 40px;
        display: block;
        margin-bottom: 8px
    }

    footer .info .socials
    {
        margin-top: 10px;
        margin-bottom: 10px
    }

    footer .info .socials a
    {
        display: inline-block;
        color: #fff
    }

    footer .info .socials a + a
    {
        margin-left: 10px
    }

    footer .info .socials a:hover
    {
        color: #fff
    }

    footer .info .socials a i
    {
        font-size: 2.13em
    }

    footer .info .socials a i.fa-discord
    {
        vertical-align: -4%
    }

    footer .info .copyright
    {
        color: #fff;
        margin-bottom: 8px
    }

    footer .info .disclaim
    {
        color: #fff;
        font-size: .8em;
        max-width: 480px
    }

    footer .links
    {
        float: left;
        width: 50%
    }

    footer .links .block
    {
        float: left;
        width: 35%;
        margin-bottom: 20px
    }

    footer .links .block .head
    {
        color: #fff;
        font-size: 1.17em
    }

    footer .links .block ul
    {
        margin: 0;
        padding: 0;
        list-style: none
    }

    footer .links .block ul li a
    {
        font-size: .96em;
        color: #fff;
        -webkit-transition: all .15s;
        -moz-transition: all .15s;
        transition: all .15s
    }

    footer .links .block ul li a:hover
    {
        color: #fff
    }

    footer .textlinks
    {
        text-align: center;
        font-size: .65em;
        padding: 10px 0
    }

    footer .textlinks a
    {
        color: #494949;
        background: #212121;
        border-radius: 10px;
        padding: 2px 10px;
        text-transform: lowercase;
        margin: 0 3px
    }

    footer .textlinks a:hover
    {
        color: #565656;
        background: #242424
    }

    @media screen and (max-width: 1279px)
    {
        footer .icon
        {
            display: none
        }
    }

    @media screen and (max-width: 768px)
    {
        footer .azlist
        {
            display: none
        }

        footer .info
        {
            width: 100%;
            text-align: center;
            margin-bottom: 20px
        }

        footer .info .logo
        {
            margin: 0 auto;
            margin-bottom: 15px
        }

        footer .info .disclaim
        {
            max-width: unset
        }

        footer .links
        {
            width: 100%
        }

        footer .links .block
        {
            width: 50%;
            margin: 0;
            display: block
        }
    }

    .letter-filters
    {
        margin-bottom: 20px
    }

    .letter-filters ul
    {
        list-style: none;
        margin: 0;
        padding: 0
    }

    .letter-filters ul:after
    {
        display: block;
        clear: both;
        content: ""
    }

    .letter-filters ul li
    {
        width: 7.14286%;
        float: left
    }

    .letter-filters ul li a
    {
        display: block;
        background: #262626;
        color: #d5d5d5;
        margin: 2px;
        padding: 3px 0;
        text-align: center;
        border-radius: .25rem
    }

    .letter-filters ul li a:hover
    {
        background: #363636
    }

    .letter-filters ul li a.active
    {
        background: #933ec8;
        color: #f8f8f8
    }

    @media screen and (max-width: 576px)
    {
        .letter-filters ul li
        {
            width: 14.28571%
        }
    }

    .filters
    {
        background: #2a2c31;
        padding: 15px;
        border-radius: .3rem;
        margin-bottom: 10px
    }

    .filters:after
    {
        display: block;
        clear: both;
        content: ""
    }

    .filters .opt1
    {
        width: 76%;
        float: left
    }

    .filters .opt1 > div
    {
        float: left;
        width: 24%;
        margin-left: .5%;
        margin-right: .5%
    }

    .filters .opt2
    {
        width: 23.5%;
        float: right
    }

    .filters .opt2 > div
    {
        float: left;
        width: 100%;
        margin-left: 0 2%;
        margin-right: 0 2%
    }

    .filters .filter
    {
        vertical-align: middle;
        margin-bottom: 8px
    }

    .filters a,
    .filters button,
    .filters input
    {
        width: 100%;
        border: 1px solid #262626;
        outline: 0;
        height: 30px;
        border-radius: .25rem;
        background: #262626;
        font-size: .85em;
        color: #fff
    }

    .filters a
    {
        line-height: 30px
    }

    .filters a,
    .filters button
    {
        -webkit-transition: all .15s;
        -moz-transition: all .15s;
        transition: all .15s;
        padding: 0 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block
    }

    .filters a span,
    .filters button span
    {
        color: #d5d5d5
    }

    .filters a.dropdown-toggle::after,
    .filters button.dropdown-toggle::after
    {
        content: '\\f078';
        font-family: "Font Awesome 5 Free";
        font-weight: 900;
        border: none;
        vertical-align: middle;
        font-size: .85em;
        color: #d5d5d5
    }

    .filters a[type=submit],
    .filters button[type=submit]
    {
        background: #933ec8;
        border-color: #933ec8;
        color: #000;
    }

    .filters a[type=submit]:hover,
    .filters button[type=submit]:hover
    {
        background: #933ec8;
        border-color: #933ec8
    }

    .filters a:hover,
    .filters button:hover
    {
        background: #2d2d2d;
        border-color: #2d2d2d
    }

    .filters .dropdown.show button
    {
        background: #212121;
        border-color: #212121
    }

    .filters input
    {
        padding: 0 10px;
        background: 0 0;
        border-color: #363636;
        -webkit-transition: all .15s;
        -moz-transition: all .15s;
        transition: all .15s
    }

    .filters input:focus,
    .filters input:hover
    {
        color: #d5d5d5;
        border-color: #404040
    }

    .filters .dropdown-menu
    {
        background: #212121;
        box-shadow: 0 2px 10px #171717;
        padding: 10px;
        margin-top: 8px;
        font-size: .9em
    }

    .filters .dropdown-menu.lg
    {
        width: 500px
    }

    .filters .dropdown-menu.md
    {
        width: 300px
    }

    .filters .dropdown-menu.c1 > li
    {
        width: 100%
    }

    .filters .dropdown-menu.c2 > li
    {
        width: 50%
    }

    .filters .dropdown-menu.c3 > li
    {
        width: 33.33333%
    }

    .filters .dropdown-menu.c4 > li
    {
        width: 25%
    }

    .filters .dropdown-menu li
    {
        float: left
    }

    .filters .dropdown-menu li label
    {
        color: #fff;
        line-height: 23px;
        padding: 2px 5px;
        background: 0 0!important;
        border-radius: 2px
    }

    .filters .dropdown-menu li input[type=checkbox]:checked + label:hover,
    .filters .dropdown-menu li label:hover
    {
        background: #2e2e2e!important;
        color: #d5d5d5
    }

    .filters .dropdown-menu li label:before
    {
        font-family: "Font Awesome 5 Free";
        font-weight: 900;
        width: 20px;
        text-align: center;
        font-size: .85em;
        content: '';
        display: inline-block;
        color: #343434
    }

    .filters .dropdown-menu li input:checked + label:before
    {
        color: #d5d5d5
    }

    .filters .dropdown-menu li input[type=checkbox] + label:before
    {
        content: '\\f0c8'
    }

    .filters .dropdown-menu li input[type=radio] + label:before
    {
        content: '\\f111'
    }

    .filters .dropdown-menu li input[type=checkbox]:checked + label:before
    {
        content: '\\f00c'
    }

    .filters .dropdown-menu li input[type=radio]:checked + label:before
    {
        content: '\\f111'
    }

    .player-wrapper #controls
    {
        background: #2a2c31;
        font-size: .8em;
        padding: 0;
        border-radius: 0 0 .3rem .3rem
    }

    #episodes ul.episodes li a.visited,
    #episodes ul.episodes li a:visited
    {
        background: #933ec8;
        color: #933ec8
    }

    #episodes ul.episodes li a:hover
    {
        background: #363636
    }

    #episodes ul.episodes li a:active
    {
        box-shadow: 0 0 0 .2rem rgba(248, 248, 248, .08)
    }

    #episodes ul.episodes li a.active
    {
        background: #933ec8;
        color: #fff
    }

    @media screen and (max-width: 576px)
    {
        #episodes .tabs.servers
        {
            display: block;
            width: 100%;
            text-align: center
        }

        #episodes .tabs.servers > a,
        #episodes .tabs.servers > span
        {
            margin: 5px
        }

        #episodes ul.ranges li
        {
            min-width: 5em
        }

        #episodes ul.episodes
        {
            max-height: 300px;
            overflow-y: scroll
        }
    }

    section#info:after
    {
        display: block;
        clear: both;
        content: ""
    }

    section#info .thumb
    {
        width: 22%;
        float: left
    }

    section#info .thumb div
    {
        padding-bottom: 130%;
        position: relative;
        overflow: hidden;
        border-radius: .3rem
    }

    section#info .thumb div img
    {
        position: absolute;
        width: 100%;
        height: 100%
    }

    section#info .info
    {
        margin-left: 24%
    }

    section#info .info .title
    {
        margin: 0;
        padding: 0;
        text-transform: uppercase;
        font-size: 1.28em;
        font-weight: 400
    }

    section#info .info .alias
    {
        color: #fff;
        font-size: .85em;
        font-style: italic
    }

    section#info .info p
    {
        color: #fff;
        font-size: .87em;
        margin-top: 20px
    }

    section#info .info .rating
    {
        float: right;
        margin-top: 5px
    }

    section#info .info .rating .stars
    {
        display: inline-block;
        font-size: 1.1em
    }

    section#info .info .rating .stars span
    {
        position: relative;
        color: #343434;
        cursor: pointer;
        float: left;
        padding: 0 3px
    }

    section#info .info .rating .stars span i
    {
        position: absolute;
        color: #bf9900;
        top: 0;
        left: 3px
    }

    section#info .info .rating .stars span i.active
    {
        color: #bf9900
    }

    section#info .info .rating .stars span i.none
    {
        color: transparent
    }

    section#info .info .rating .text
    {
        color: #494949;
        font-size: .85em;
        display: block;
        text-align: center;
        font-style: italic
    }

    section#info .info .rating:hover .text
    {
        color: #494949
    }

    section#info .info .meta
    {
        color: #fff;
        font-size: .85em
    }

    section#info .info .meta .col1,
    section#info .info .meta .col2
    {
        float: left;
        width: 50%
    }

    section#info .info .meta span
    {
        color: #fff;
        margin-left: 5px
    }

    section#info .info .meta a
    {
        color: #fff
    }

    section#info .info .meta a:hover
    {
        color: #933ec8
    }

    section#info .tags
    {
        font-size: .8em;
        margin-top: 15px
    }

    section#info .tags a,
    section#info .tags span
    {
        color: #525252
    }

    section#info .tags a:hover
    {
        color: #fff
    }

    @media screen and (max-width: 576px)
    {
        section#info .thumb
        {
            display: none
        }

        section#info .info
        {
            margin-left: 0
        }

        section#info .info .meta .col1,
        section#info .info .meta .col2
        {
            width: 100%
        }
    }

    .userpage aside.sidebar
    {
        float: left;
        width: 23%
    }

    .userpage aside.main
    {
        float: right;
        width: 75%;
        margin: 0;
        padding: 0
    }

    .userpage .sidebar .menu
    {
        list-style: none;
        margin: 0;
        padding: 0
    }

    .userpage .sidebar .menu li a
    {
        display: block;
        padding: 8px 20px;
        border-radius: .3rem;
        margin: 3px 0;
        color: #fff
    }

    .userpage .sidebar .menu li a:hover
    {
        background: #292929
    }

    .userpage .sidebar .menu li a.active
    {
        background: #933ec8;
        color: black;
    }

    .userpage .form h4,
    .userpage .form h5,
    .userpage .form h6
    {
        color: #d5d5d5
    }

    .userpage .form label
    {
        color: #fff
    }

    .userpage .filters
    {
        padding: 0
    }

    .userpage .filters .filter
    {
        width: auto;
        display: inline-block
    }

    @media screen and (max-width: 1279px)
    {
        .userpage aside.sidebar
        {
            float: none;
            width: 100%
        }

        .userpage aside.main
        {
            float: none;
            width: 100%
        }

        .userpage .user-icon
        {
            display: none
        }

        .userpage .sidebar ul.menu li
        {
            width: auto;
            float: left;
            margin: 0 5px
        }
    }

    input[type=checkbox]:not(.simple)
    {
        position: relative;
        -webkit-appearance: none;
        width: 35.2px;
        height: 22px;
        background-color: #494949;
        border-radius: 22px;
        -webkit-transition: .4s;
        transition: .4s;
        vertical-align: -25%;
        display: inline-block;
        cursor: pointer;
        border: 0;
        outline: 0
    }

    input[type=checkbox]:not(.simple):after
    {
        content: "";
        position: absolute;
        background: #fff;
        width: 16px;
        top: 3px;
        left: 3px;
        bottom: 3px;
        border-radius: 50%;
        transition: .4s
    }

    input[type=checkbox]:not(.simple):checked
    {
        background: #933ec8
    }

    input[type=radio]:not(.simple):checked:before
    {
        background: #933ec8
    }

    .modal.sign .modal-content
    {
        padding-left: 280px
    }

    .modal.sign .modal-content:before
    {
        background-size: contain;
        background-repeat: no-repeat;
        display: block;
        width: 280px;
        height: 100%;
        content: '';
        position: absolute;
        left: -10px;
        top: 0
    }

    @media screen and (max-width: 768px)
    {
        .modal.sign .modal-dialog
        {
            max-width: 360px!important
        }

        .modal.sign .modal-content
        {
            padding-left: 0
        }

        .modal.sign .modal-content:before
        {
            display: none
        }
    }

    .modal-content
    {
        border-radius: 8px;
        color: #fff;
        font-size: .9em
    }

    .modal-content a
    {
        color: #933ec8
    }

    .modal-content a:hover
    {
        color: #933ec8
    }

    .modal-content .modal-header
    {
        border: none;
        padding-bottom: 0
    }

    .modal-content .modal-header .close
    {
        position: absolute;
        top: 0;
        right: 0;
        margin: 0
    }

    .modal-content .modal-header .modal-title
    {
        color: #933ec8;
        font-size: 2.13em;
        font-weight: 600;
        margin: 0 auto
    }

    .modal-content .modal-body
    {
        border: none;
        padding-top: 0;
        padding-bottom: 0
    }

    .modal-content .modal-body .form-group
    {
        position: relative
    }

    .modal-content .modal-body .form-group .input,
    .modal-content .modal-body .form-group textarea
    {
        background: #2a2c31;
        border: none;
        border-radius: 0;
        width: 100%;
        padding: 10px 15px;
        color: #933ec8
    }

    .modal-content .modal-body .form-group .input::placeholder,
    .modal-content .modal-body .form-group textarea::placeholder
    {
        color: #2a2c31
    }

    .modal-content .modal-body .form-group .input:focus,
    .modal-content .modal-body .form-group textarea:focus
    {
        background: #2a2c31
    }

    .modal-content .modal-body .form-group textarea
    {
        border: 1px solid #d2c0ec;
        height: 100px
    }

    .modal-content .modal-body .form-group button
    {
        width: 100%;
        padding: 10px;
        font-size: 1.33em
    }

    .modal-content .modal-body .suggestions a
    {
        color: #343434
    }

    .modal-content .modal-body .suggestions a:hover
    {
        color: #933ec8
    }

    .modal-content .modal-body .suggestions ol,
    .modal-content .modal-body .suggestions ul
    {
        margin: 0;
        padding: 0;
        margin-left: 10px
    }

    .modal-content .modal-footer
    {
        padding-top: 0;
        border: none;
        justify-content: center
    }

    .bs-tooltip-auto[x-placement^=top] .arrow::before,
    .bs-tooltip-top .arrow::before
    {
        border-top-color: #eee
    }

    .tooltip-inner
    {
        background: #eee;
        color: #212121;
        font-size: .9em
    }

    .error-page
    {
        display: block;
        width: auto;
        text-align: center;
        padding: 200px 0 0
    }

    .error-page h2
    {
        font-size: 7.45em;
        font-weight: 600
    }

    .error-page .message
    {
        font-size: 1.91em;
        font-weight: 300
    }

    .error-page .home
    {
        margin-top: 15px
    }

    #toast-wrapper
    {
        position: fixed;
        z-index: 1055;
        bottom: 10px;
        right: 10px
    }

    #toast-wrapper > div
    {
        color: #fff;
        background: #933ec8;
        padding: 8px 15px;
        display: block;
        margin-bottom: 10px;
        cursor: pointer;
        border-radius: .25rem
    }

    #md-report .name
    {
        font-size: 1.5em;
        font-weight: 500;
        color: #933ec8
    }

    #md-report label
    {
        font-weight: 600
    }

    #md-report .options label
    {
        font-weight: 400;
        font-size: .95em
    }

    .shorting .more
    {
        background: #343434;
        border-radius: .2rem;
        font-size: .8em;
        display: inline-block;
        padding: 0 8px;
        color: #fff;
        -webkit-transition: all .15s;
        -moz-transition: all .15s;
        transition: all .15s;
        cursor: pointer;
        margin-left: 3px;
        line-height: 1.8em
    }

    .shorting .more i
    {
        font-size: .8em
    }

    .shorting .more:hover
    {
        background: #494949;
        color: #d5d5d5
    }

    @-webkit-keyframes kfloading
    {
        0%,
        100%,
        80%
        {
            -webkit-transform: scale(0)
        }

        40%
        {
            -webkit-transform: scale(1)
        }
    }

    @keyframes kfloading
    {
        0%,
        100%,
        80%
        {
            -webkit-transform: scale(0);
            transform: scale(0)
        }

        40%
        {
            -webkit-transform: scale(1);
            transform: scale(1)
        }
    }

    .loading
    {
        margin: 10px auto;
        width: 70px;
        text-align: center
    }

    .loading > div
    {
        width: 18px;
        height: 18px;
        background-color: #933ec8;
        border-radius: 100%;
        display: inline-block;
        -webkit-animation: kfloading 1.2s infinite ease-in-out both;
        animation: kfloading 1.2s infinite ease-in-out both
    }

    .loading > div:first-child
    {
        -webkit-animation-delay: -.3s;
        animation-delay: -.3s
    }

    .loading > div:nth-child(2)
    {
        -webkit-animation-delay: -.15s;
        animation-delay: -.15s
    }

    section.schedulefull .tz
    {
        margin-bottom: 15px;
        text-align: center
    }

    section.schedulefull .tz:after
    {
        display: block;
        clear: both;
        content: ""
    }

    section.schedulefull .tz form
    {
        width: auto;
        display: inline-block
    }

    section.schedulefull .month-nav
    {
        border-bottom: 1px solid #292929;
        font-size: 1.2em;
        font-weight: 500;
        color: #8c5ece;
        margin-bottom: 15px
    }

    section.schedulefull .month-nav:after
    {
        display: block;
        clear: both;
        content: ""
    }

    section.schedulefull .month-nav a
    {
        color: #fff
    }

    section.schedulefull .month-nav a:hover
    {
        color: #933ec8
    }

    section.schedulefull .month-nav .prev
    {
        float: left
    }

    section.schedulefull .month-nav .next
    {
        float: right
    }

    section.schedulefull .month-nav .current
    {
        text-align: center;
        display: block
    }

    section.schedulefull .day-head
    {
        display: none
    }

    section.schedulefull .day-head > div
    {
        float: left;
        width: 14.08571%;
        margin: 0 .1%;
        text-align: center;
        background: #0f0f0f;
        padding: 4px 6px;
        border-radius: .25rem
    }

    section.schedulefull .day-head > div.active
    {
        background: #933ec8;
        color: #fff
    }

    section.schedulefull .days .day
    {
        width: 14.08571%;
        margin: 3px .1%;
        float: left;
        border-radius: .25rem
    }

    section.schedulefull .days .day:nth-child(7n + 1)
    {
        clear: both
    }

    section.schedulefull .days .day > .heading
    {
        background: #292929;
        border-radius: .25rem;
        text-align: center;
        padding: 4px 6px
    }

    section.schedulefull .days .day > .heading:after
    {
        display: block;
        clear: both;
        content: ""
    }

    section.schedulefull .days .day > .heading.active
    {
        background: #933ec8;
        color: #fff
    }

    section.schedulefull .days .day > .heading .nday
    {
        float: right;
        font-weight: 500;
        color: #fff
    }

    section.schedulefull .days .day > .heading .wday
    {
        text-align: center
    }

    section.schedulefull .days .day .items
    {
        font-size: .9em;
        border-radius: .25rem;
        margin-top: 3px;
        overflow: hidden
    }

    section.schedulefull .days .day .items .item
    {
        background: #1a1a1a;
        padding: 3px;
        -webkit-transition: all .15s;
        -moz-transition: all .15s;
        transition: all .15s
    }

    section.schedulefull .days .day .items .item:nth-child(2n-1)
    {
        background: #181818
    }

    section.schedulefull .days .day .items .item:hover
    {
        background: #212121
    }

    section.schedulefull .days .day .items .item:after
    {
        display: block;
        clear: both;
        content: ""
    }

    section.schedulefull .days .day .items .item time
    {
        float: left;
        width: 35px;
        display: block;
        font-size: .8em;
        font-weight: 500;
        padding: 3px 0;
        color: #525252
    }

    section.schedulefull .days .day .items .item .name
    {
        margin-left: 35px;
        display: block;
        color: #fff;
        font-weight: 500;
        font-size: .95em
    }

    section.schedulefull .days .day .items .item .name:hover
    {
        color: #999
    }

    section.schedulefull .days .day .items .item .name .ep
    {
        color: #525252;
        font-size: .9em
    }

    @media screen and (max-width: 1279px)
    {
        section.schedulefull .days .day
        {
            width: 19.8%;
            margin: 3px .1%
        }

        section.schedulefull .days .day:nth-child(7n + 1)
        {
            clear: none
        }

        section.schedulefull .days .day:nth-child(5n + 1)
        {
            clear: both
        }
    }

    @media screen and (max-width: 992px)
    {
        section.schedulefull .days .day
        {
            width: 24.8%;
            margin: 3px .1%
        }

        section.schedulefull .days .day:nth-child(5n + 1),
        section.schedulefull .days .day:nth-child(7n + 1)
        {
            clear: none
        }

        section.schedulefull .days .day:nth-child(4n + 1)
        {
            clear: both
        }
    }

    @media screen and (max-width: 576px)
    {
        section.schedulefull .days .day
        {
            width: 99.8%;
            margin: 3px .1%
        }

        section.schedulefull .days .day:nth-child(4n + 1),
        section.schedulefull .days .day:nth-child(5n + 1),
        section.schedulefull .days .day:nth-child(7n + 1)
        {
            clear: none
        }

        section.schedulefull .days .day:nth-child(1n + 1)
        {
            clear: both
        }
    }

    .tooltipster-sidetip.tooltipster-top .tooltipster-arrow-background
    {
        border-top-color: #171717
    }

    .tooltipster-sidetip.tooltipster-bottom .tooltipster-arrow-background
    {
        border-bottom-color: #171717
    }

    .tooltipster-sidetip.tooltipster-right .tooltipster-arrow-background
    {
        border-right-color: #171717
    }

    .tooltipster-sidetip.tooltipster-left .tooltipster-arrow-background
    {
        border-left-color: #171717
    }

    .tooltipster-sidetip .tooltipster-box
    {
        background: #171717;
    }

    .tooltipster-sidetip .tooltipster-box .tooltipster-content .bookmark
    {
        float: right;
        color: #933ec8;
        font-size: 1.2em;
        cursor: pointer
    }

    .tooltipster-sidetip .tooltipster-box .tooltipster-content .tags,
    {
        background: #212121;
    }

    .tooltipster-sidetip .tooltipster-box .tooltipster-content .tags .taglist .tv
    {
        background: #424242
    }

    .tooltipster-sidetip .tooltipster-box .tooltipster-content p
    {
        color: #595959;
    }

    .tooltipster-sidetip .tooltipster-box .tooltipster-content .watch
    {
        background: #933ec8;
    }

    .tooltipster-sidetip .tooltipster-box .tooltipster-content .watch:hover
    {
        background: #933ec8
    }

    .index-content a
    {
        color: #933ec8
    }

    .index-content a:hover,
    a,
    a:hover
    {
        color: #933ec8;
    }

    .index-content .search form button
    {
        background: #933ec8;
    }

    #episodes ul.episodes li a.visited,
    #episodes ul.episodes li a:visited
    {
        color: black
    }

    .alert-info
    {
        color: #fff;
        background-color: #2a2c31;
        border-color: #2a2c31;
    }

    .anime .info .name:hover,
    ul.anime-list-s li .info a:hover,
    #malStatus,
    #malTotal,
    #malEpisodes,
    #malUserRating,
    #malRating,
    #malVolumes,
    #malTotalVol,
    #malTotalCha,
    #AddMal,
    .modal-content .modal-body .form-group .fas,
    .fa-plus:hover
    {
        color: #933ec8
    }

    #slider .paging > div
    {
        background: rgba(43, 43, 43, .5);
    }

    #slider .paging > div i
    {
        color: rgba(213, 213, 213, .5);
    }

    #slider .paging > div:hover
    {
        background: rgba(43, 43, 43, .8);
    }

    #slider .paging > div:hover i
    {
        color: rgba(61, 180, 242, .8);
    }

    .modal-content,
    .modal-content .modal-body .form-group .input::placeholder,
    .modal-content .modal-body .form-group textarea::placeholder
    {
        background-color: #202125;
        color: #fff
    }

    .alert-warning
    {
        display: none;
    }

    #logo,
    .logo
    {
        background: url(https://9anime.vc/images/logo.png) no-repeat !important;
        background-size: contain !important;
    }

    *
    {
        scrollbar-color: #933ec8 #202125;
        scrollbar-width: thin;
    }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
