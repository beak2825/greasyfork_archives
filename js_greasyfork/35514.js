// ==UserScript==
// @name        stuff 1
// @namespace   mafiareturns.com
// @include     https://mafiareturns.com/*
// @version     1.1
// @grant       none
// @description Autoclicking on 'Purchase Drug Front Property' button. !! note: SDI must be 'On'
// @downloadURL https://update.greasyfork.org/scripts/35514/stuff%201.user.js
// @updateURL https://update.greasyfork.org/scripts/35514/stuff%201.meta.js
// ==/UserScript==


(function() {

    var Autoclick = {
        counter: 0, // click counter
        
        enabled: false, // is autoclick enabled   
        failText: 'There aren\'t any DFP\'s available at this time',

        _clickTimer: null,
        _onAjaxCompleteHandler: null,

        /*
       * Start autoclicking
       */
        start: function(intervalSec, onClick, onSuccess) {
            if (this.enabled) return;
            this.enabled = true;
            this.counter = 0;

            var that = this;

            var clickButton = function() {
                var $msg = $('#all .msg'),
                    $btn = $('input[name="purchase"]');
                
                if ($btn.length == 0 || ($msg.length > 0 && $msg.text().indexOf(that.failText) == -1)) { // success
                    that.stop();
                    if (onSuccess) {
                        onSuccess();
                    }
                    return;
                }

                $btn.click();
                that.counter++;

                if (onClick) {
                    onClick();
                }
            };

            this._onAjaxCompleteHandler = function(event, request, settings) {
                if (settings.url == '/manage/dfp.php' && that.enabled) {
                    that._clickTimer = setTimeout(clickButton, 100 + intervalSec*1000);
                }  
            };

            $(document).bind("ajaxComplete", this._onAjaxCompleteHandler);

            clickButton();
        },

        /*
         * Stop
         */
        stop: function() {
            if (!this.enabled) return;      
            this.enabled = false;

            if (this._clickTimer) {
                clearTimeout(this._clickTimer);
                this._clickTimer = null;
            }

            $(document).unbind("ajaxComplete", this._onAjaxCompleteHandler);
        }

    };
    // ******************************************************************************

    function AutoClickInjection() {

        // Button 'Autoclick'
        var $btnAutoclick = $('<input>', {type: 'button'}).val('Autoclick: off');
        var $inputInterval = $('<input type="text" size="2" value="0">');

        // Add 'Autoclick' block to the page
        var $block = $('<div>', {"style": 'padding-top: 40px; text-align: center; background-color: #999999;'})
        .append($btnAutoclick)
        .append('&nbsp;&nbsp;Interval, sec: ')
        .append($inputInterval)
        .insertBefore($('#all'));

        // Click handler
        $btnAutoclick.click(function(e) {
            e.preventDefault();

            if (Autoclick.enabled) {
                Autoclick.stop();
                $btnAutoclick.val('Autoclick: off');
                $inputInterval.attr('disabled', false);
            }
            else {
                var interval = parseInt($inputInterval.val());
                $inputInterval.attr('disabled', true);        
                Autoclick.start(interval, 
                                function() {  // on click       
                                    $btnAutoclick.val('Autoclick: on (' + Autoclick.counter + ')');
                                },
                                function() { // on success
                                    $btnAutoclick.val('Autoclick: SUCCESS (' + Autoclick.counter + ')');
                                    alert('Success');
                                }); 
            }
        });

        // Remove autoclick button from the page
        this.remove = function() {
            if (Autoclick.enabled) {
                Autoclick.stop();        
            }
            $block.remove();
        };
    }  

    // ******************************************************************************

    // Check for URL change
    // Since the web site is using HTML History API for navigation (when SDI is On), it needs to monitor URL changes
    var autoClickInjection = null;
    var isDFPpage = false;  
    setInterval(function() {
        // Check if purchase dfp page is open
        var _isDFPpageNew = (window.location.pathname == '/manage/dfp.php');

        // if dfp page is open - show autoclick, else - remove
        if (isDFPpage != _isDFPpageNew) {

            isDFPpage = _isDFPpageNew;

            if (isDFPpage) {
                autoClickInjection = new AutoClickInjection();
            }
            else {
                if (autoClickInjection) {
                    autoClickInjection.remove();
                }
            }
        }    
    }, 100);

})();