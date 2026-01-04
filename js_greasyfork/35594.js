// ==UserScript==
// @name        Mafia Returns scripts
// @namespace   mafiareturns.com
// @include     https://mafiareturns.com/war/jail.php
// @version     1
// @grant       none
// @description SDI must be 'On'
// @downloadURL https://update.greasyfork.org/scripts/35594/Mafia%20Returns%20scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/35594/Mafia%20Returns%20scripts.meta.js
// ==/UserScript==

alert("hi");

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
    
    var JailAutoBustOut = {
        counter: 0, // click counter
        enabled: false, // is autoclick enabled   
        
        _clickTimer: null,
        _tickTimer: null,
        _onAjaxCompleteHandler: null,
        _lastClickDate: null,
        _events: null,
        _previousUsers: null,
        
        sortUsers: function(userSearchMethod) {
            return $('#jail_table tbody').find('tr').sort(function(a, b) {
                var guardsA = parseInt($(a).find('td:eq(0)').text());
                var guardsB = parseInt($(b).find('td:eq(0)').text());
                                
                if (guardsA < guardsB) {
                    return (userSearchMethod == 'high' ? 1 : -1);
                }
                else if (guardsA > guardsB) {                    
                    return (userSearchMethod == 'high' ? -1 : 1);                    
                }
                else //equal guards number
                {                    
                    // alphabetical sort by prisoner name
                    return ($(b).find('td:eq(1)').text()) < ($(a).find('td:eq(1)').text()) ? 1 : -1;
                }
            });
        },

        /*
         * Start autoclicking
         */
        start: function(intervalSec, userSearchMethod, skipPreviousUsers, eventCallbacks) {            
            if (this.enabled) return;
            this.enabled = true;
            this.counter = 0;
            this._events = eventCallbacks;
            this._previousUsers = [];

            var that = this;            

            var clickButton = function() {   
                
                var users = that.sortUsers(userSearchMethod);                
                if (skipPreviousUsers) {                    
                    users = users.filter(function() {
                        var name = $(this).find('td:eq(1)').text();                        
                        return (that._previousUsers.indexOf(name) == -1);
                    });
                }
                
                var user = users.first();
                                
                if (user.length == 0) {                    
                    alert('User not found. Stop.');
                    that.stop();
                    return;
                }
                
                var userData = {
                    name: user.find('td:eq(1)').text(),
                    guards: user.find('td:eq(0)').text()
                };
                
                that._previousUsers.push(userData.name);
                
                //alert('Bust Out, user=' + user.find('td:eq(1)').text() + ', guards=' + user.find('td:eq(0)').text());                
                
                that._lastClickDate = new Date();

                user.find('a.button').click();
                that.counter++;

                if (that._events.onClick) {
                    that._events.onClick(userData);
                }
            };

            this._onAjaxCompleteHandler = function(event, request, settings) {   
                
                if (settings.url.indexOf('/war/jail.php') == 0 && that.enabled) {
                    //alert('on _onAjaxCompleteHandler - JAIL PAGE');
                                        
                    if (that._clickTimer) {
                        clearTimeout(that._clickTimer);
                        that._clickTimer = null;
                    }
                    
                    var func, 
                        interval = intervalSec*1000;
                                        
                    if ($("#all .msg").length > 0) { // if there's a message
                        //alert('on _onAjaxCompleteHandler - have message');
                        
                        func = function() {
                            //alert('on _onAjaxCompleteHandler - before redirect to JAIL page');
                            $('<a href="/war/jail.php"> </a>').appendTo(document.body).click();
                        };                        
                        
                        //alert('setTimeout - redirect to Jail ' + interval);
                    }
                    else {
                        func = clickButton;
                        
                        if (that._lastClickDate) {
                            interval = interval - (new Date()).getTime() - that._lastClickDate.getTime();
                            if (interval < 0) interval = 0;
                        }
                        
                        //alert('setTimeout - click ' + interval);
                    }
                    
                    that._clickTimer = setTimeout(function() {
                        clearInterval(that._tickTimer);                        
                        that._clickTimer = null;
                        func();
                    }, 100 + interval);
                    
                    var timeLeft = interval;
                    that._tickTimer = setInterval(function() {
                        timeLeft -= 1000;
                        if (that._events.onTick) {
                            that._events.onTick(timeLeft);
                        }
                    }, 1000);
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

            clearInterval(this._tickTimer);
            
            if (this._clickTimer) {
                clearTimeout(this._clickTimer);
                this._clickTimer = null;
            }

            $(document).unbind("ajaxComplete", this._onAjaxCompleteHandler);
            
            if (this._events.onStop) {
                this._events.onStop();
            }
        }

    };
    
    // ******************************************************************************



    function JailAutoBustOutInjection() {
        // Button 'Auto Bust Out'
        var $btnAutoclick = $('<input>', {type: 'button'}).val('Auto Bust Out: off');
        var $inputInterval = $('<input type="text" size="2" value="20">');
        var $spanTimeleft = $('<div>');
        var $divSelectedUser = $('<div>');
        var $divClickCounter = $('<div>');
        var $selectUserSearchMethod = $('<select><option value="high">high-to-low</option><option value="low">low-to-high</option></select>');
        var $checkboxSkipPreviousUsers = $('<input type="checkbox" value="1">');



        // Add 'Autoclick' block to the page
        var $block = $('<div>', {"style": 'padding-top: 40px; text-align: center; background-color: #999999;'})
        .append($btnAutoclick)
        .append($('<div>').append('&nbsp;&nbsp;Interval, sec: ').append($inputInterval))
        .append($('<div>').append('User search method: ').append($selectUserSearchMethod))
        .append($('<div>').append('Skip previous users: ').append($checkboxSkipPreviousUsers))        
        .append($divClickCounter)
        .append($divSelectedUser)
        .append($spanTimeleft)
        .insertBefore($('#all'));


        // Click handler
        $btnAutoclick.click(function(e) {
            e.preventDefault();
            
            var onStop = function() {         
                //alert('Stop');
                $btnAutoclick.val('Auto Bust Out: off');
                $inputInterval.attr('disabled', false);
                $checkboxSkipPreviousUsers.attr('disabled', false);
                $selectUserSearchMethod.attr('disabled', false);
            };

            if (JailAutoBustOut.enabled) {
                JailAutoBustOut.stop();                
            }
            else {                
                $inputInterval.attr('disabled', true);
                $checkboxSkipPreviousUsers.attr('disabled', true);
                $selectUserSearchMethod.attr('disabled', true);
                $btnAutoclick.val('Auto Bust Out: on');
                
                var interval = parseInt($inputInterval.val()),
                    userSearchMethod = $selectUserSearchMethod.val(),
                    skipPreviousUsers = !!$checkboxSkipPreviousUsers.attr('checked');
                
                JailAutoBustOut.start(interval, userSearchMethod, skipPreviousUsers,
                                      {
                                          onClick: function(userData) {                                              
                                              $divClickCounter.text('Click counter: ' + JailAutoBustOut.counter);
                                              $divSelectedUser.text( 'Last user clicked: ' + userData.name + ' (' + userData.guards + ' guards)' );
                                          },
                                          
                                          onStop: onStop,
                                          
                                          onTick: function(timeLeft) {
                                              $spanTimeleft.html('Repeat timer: ' + Math.floor(timeLeft/1000) + ' sec.');
                                          }
                                      }
                                     ); 
            }
        });

        // Remove elements from the page
        this.remove = function() {
            if (JailAutoBustOut.enabled) {
                JailAutoBustOut.stop();        
            }
            $block.remove();
        };


    }
    
    // ******************************************************************************
    
    // Check for URL change
    // Since the web site is using HTML History API for navigation (when SDI is On), it needs to monitor URL changes
    var PageWatcher = {
        _prevPath: null,
        _init: false,
        _watched: {},
        
        init: function() {
            if (this._init) return;
            this._init = true;
            
            var that = this;
            setInterval(function() {
                var path = window.location.pathname;                
                if (path == that._prevPath) return;
                
                if (that._watched[ path ]) {
                    that._watched[ path ].onOpen(that._prevPath);
                }
                
                if (that._watched[ that._prevPath ]) {
                    that._watched[ that._prevPath ].onClose(path);
                }                
                
                that._prevPath = path;
            }, 100);
        },
        
        set: function(path, onOpen, onClose) {
            this._watched[ path ] = {
                onOpen: onOpen,
                onClose: onClose
            };
        }
    };
    
    // ******************************************************************************

    
    var autoClickInjection = null;
    var jailBustOutInjection = null;
      
    PageWatcher.set('/manage/dfp.php', 
                    function() { // open
                        autoClickInjection = new AutoClickInjection();
                    }, 
                    function() { // close
                        if (autoClickInjection) {
                            autoClickInjection.remove();
                            autoClickInjection = null;
                        }
                    }
     );
    
    PageWatcher.set('/war/jail.php', 
                    function(prevPage) { // open
                        if (!jailBustOutInjection) {
                            jailBustOutInjection = new JailAutoBustOutInjection();
                        }                        
                    }, 
                    function(newPage) { // close
                        if (newPage == '/jail.php') return; // do not remove jailBustOutInjection if we are thrown in jail

                        if (jailBustOutInjection) {
                            jailBustOutInjection.remove();
                            jailBustOutInjection = null;
                        }
                    }
                   );
                        
     PageWatcher.init();

})();