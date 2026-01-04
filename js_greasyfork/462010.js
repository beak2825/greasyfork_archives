// ==UserScript==
// @name         Solr tasks
// @namespace    dedeman
// @version      1.1
// @description  Actualizare produse in masa
// @author       Dragos
// @icon         https://i.dedeman.ro/dedereact/design/images/small-logo.svg
// @match        http*://stage-search.dedeman.link/*
// @match        http*://search.dedeman.ro/*
// @require	     https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/462010/Solr%20tasks.user.js
// @updateURL https://update.greasyfork.org/scripts/462010/Solr%20tasks.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
(function() {
    'use strict';
    var config = { attributes: false, childList: true, subtree: false };
    var callback = function(mutationsList, observer) {
        action();
    };
    var observer = new MutationObserver(callback);
    observer.observe($('#app > div')[0], config);
    function action() {
       if (location.href.includes('tasks')) {
            if ($('#execute_original').length == 0) {
                function changeValue(input,value) {
                    var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                    nativeInputValueSetter.call(input, value);
                    var inputEvent = new Event("input", { bubbles: true });
                    input.dispatchEvent(inputEvent);
                }
                $('.input-group > input.form-control').attr('placeholder','1234567 3213213');
                $('.input-group > .input-group-btn > button').attr('id', 'execute_original');
                $('.input-group > .input-group-btn').after('<span class="input-group-btn" id="execute"><button type="button" class="btn btn-primary"><span class="glyphicon glyphicon-arrow-right"></span><span> Execute</span></button></span>').hide();
                $('#execute').click(function() {
                    if ($('.input-group > input.form-control').val()) {
                        var values = $('.input-group > input.form-control').val().split(' ');
                        if (values.length) {
                            var i = 0;
                            update();
                            function update() {
                                if (/^(\d{7})((-\d+)+)?$/g.test(values[i])) {
                                    changeValue($('.input-group > input.form-control')[0],values[i]);
                                    setTimeout(function(){ $('#execute_original').click(); }, 500);
                                    i = i + 1;
                                    if (i < values.length) setTimeout(function(){ update(); }, 1500);
                                    else if (i > 1) alert('Done!');
                                }
                            }
                        }
                    }
                });
            }
        }
    }
    action();
})();