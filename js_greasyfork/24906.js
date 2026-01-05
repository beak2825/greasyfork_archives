// ==UserScript==
// @name        EBS loading indicator
// @namespace   github.com/4O4
// @description Cool spinner which lets you know if Oracle EBS is making any async request
// @include     /^https?://.*/OA_HTML/OA.jsp\?.*(OAFunc=OAHOMEPAGE|\/HomePG|homePage=Y).*$/
// @version     1.0.1
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24906/EBS%20loading%20indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/24906/EBS%20loading%20indicator.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

injectStyles();

var spinner = new Spinner(document.body);

$(document.body)
    .on('xhrInterceptor:open', function () {
        spinner.show();
    })
    .on('xhrInterceptor:load', function () {
        spinner.hide();
    });

/////////////////

function Spinner(parentDOMElement) {
    this.element = document.createElement('div');
    var spinner = this.$element = $(this.element);
    spinner
        .hide()
        .appendTo(parentDOMElement)
        .css({
            position: "fixed",
            zIndex: "10000",
            left: -1,
            top: 50,
            background: "rgba(0, 0, 0, 0.65)",
            padding: "16px 0px 20px 28px",
            width: "110px",
            height: "25px",
            border: "1px solid rgb(104, 104, 104)",
            color: "white",
            fontFamily: "Arial",
            fontWeight: "bold",
            fontSize: "11px"
        })
        .html(`
            <div style="position: absolute; right: 8px;top: 9px; width: 60px;">
                <div class="circle"></div>
                <div class="circle1"></div>
            </div>
            <div style="margin-top: 9px;margin-left: -12px;">
            Loading
            </div>
        `);
}

Spinner.prototype.show = function () {
    this.$element.fadeIn('fast');
};

Spinner.prototype.hide= function () {
    this.$element.fadeOut('fast');
};

var xhrOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function xhrInterceptor() {
    $(document.body).trigger('xhrInterceptor:open');
    
    this.addEventListener('load', function() {
       $(document.body).trigger('xhrInterceptor:load');
    });
    
    xhrOpen.apply(this, arguments);
};

function injectStyles() {
    // CSS taken from  http://www.alessioatzeni.com/blog/css3-loading-animation-loop/
    $('head').append(`
    <style type="text/css">
        .circle {
            background-color: rgba(0,0,0,0);
            border: 5px solid rgba(0,183,229,0.9);
            opacity: .9;
            border-right: 5px solid rgba(0,0,0,0);
            border-left: 5px solid rgba(0,0,0,0);
            border-radius: 50px;
            box-shadow: 0 0 35px #2187e7;
            width: 35px;
            height: 35px;
            margin: 0 auto;
            -moz-animation: spinPulse 1s infinite ease-in-out;
            -webkit-animation: spinPulse 1s infinite linear;
        }

        .circle1 {
            background-color: rgba(0,0,0,0);
            border: 5px solid rgba(0,183,229,0.9);
            opacity: .9;
            border-left: 5px solid rgba(0,0,0,0);
            border-right: 5px solid rgba(0,0,0,0);
            border-radius: 50px;
            box-shadow: 0 0 15px #2187e7;
            width: 20px;
            height: 20px;
            margin: 0 auto;
            position: relative;
            top: -37px;
            -moz-animation: spinoffPulse 1s infinite linear;
            -webkit-animation: spinoffPulse 1s infinite linear;
        }

        @-moz-keyframes spinPulse {
            0% {
                -moz-transform: rotate(160deg);
                opacity: 0;
                box-shadow: 0 0 1px #2187e7;
            }

            50% {
                -moz-transform: rotate(145deg);
                opacity: 1;
            }

            100% {
                -moz-transform: rotate(-320deg);
                opacity: 0;
            };
        }

        @-moz-keyframes spinoffPulse {
            0% {
                -moz-transform: rotate(0deg);
            }

            100% {
                -moz-transform: rotate(360deg);
            };
        }

        @-webkit-keyframes spinPulse {
            0% {
                -webkit-transform: rotate(160deg);
                opacity: 0;
                box-shadow: 0 0 1px #2187e7;
            }

            50% {
                -webkit-transform: rotate(145deg);
                opacity: 1;
            }

            100% {
                -webkit-transform: rotate(-320deg);
                opacity: 0;
            };
        }

        @-webkit-keyframes spinoffPulse {
            0% {
                -webkit-transform: rotate(0deg);
            }

            100% {
                -webkit-transform: rotate(360deg);
            };
        }
    </style>`);
}