// ==UserScript==
// @name         Solr boost rules
// @namespace    dedeman
// @version      1.1
// @description  Add bulk rules
// @author       Dragos
// @icon         https://i.dedeman.ro/dedereact/design/images/small-logo.svg
// @match        http*://stage-search.dedeman.link/*
// @match        http*://search.dedeman.link/*
// @match        http*://search.dedeman.ro/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/466646/Solr%20boost%20rules.user.js
// @updateURL https://update.greasyfork.org/scripts/466646/Solr%20boost%20rules.meta.js
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
        if (location.href.includes('boost-rules')) {
            // function reactJSSetValue(elm, value) {
            //     elm.value = value;
            //     elm.defaultValue = value;
            //     elm.dispatchEvent(new Event("input", {bubbles: true, target: elm, data: value}));
            // }
            function changeValue(input, value, type) {
                var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                if (type == 'textarea') nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
                nativeInputValueSetter.call(input, value);
                input.dispatchEvent(new Event("input", { bubbles: true }));
            }
            var waitForEl = function(selector, length, callback) {
                if (jQuery(selector).length == length) {
                    callback();
                } else {
                    setTimeout(function() {
                        waitForEl(selector, length, callback);
                    }, 200);
                }
            };
            var stop;
            $('.panel-default.panel > .panel-body').append(`<div class="row" id="my_row"><div class="col-xs-6"><label>Add rules from excel</label><textarea id='list_values' style="resize: vertical;" type="textarea" placeholder="Category	Rule	Start Date	End Date" rows="3" class="form-control"></textarea></div><div class="col-xs-2"><label>Type</label><select type="select" id="my_type" name="type" class="form-control"><option value="search">Search</option><option value="category">Category</option></select></div><div class="col-xs-2"><label>&nbsp;</label><div class="btn-toolbar"><button id="my_start" type="button" class="btn btn-sm btn-primary" style="height: 34px;width: -moz-available;width: -webkit-fill-available;width: fill-available;"><span class="glyphicon glyphicon-play"></span><span> Start</span></button><button type="button" style="display:none;height: 34px;width: -moz-available;width: fill-available;width: -webkit-fill-available;" id="my_stop" class="btn btn-sm btn-danger"><span class="glyphicon glyphicon-stop"></span><span> Stop</span></button></div></div><div class="col-xs-2"><label>&nbsp;</label><div class="btn-toolbar"><div id="myProgress" class="progress" style="height: 34px; display: none; position: relative;"><div id="progressbar" role="progressbar" style="width: 0%;color: black;" class="progress-bar progress-bar-warning"><span id="progress-bar-text" style="position: absolute;width: 100%;display: block;text-align: center;line-height: 34px;font-size: 14px;">0%</span></div></div></div></div></div>`);
            $('#my_type').val(0);
            $(document).on('click', '#my_start', function() {
                if ($('#list_values').val().trim()) {
                    if ($('#my_type').val()) {
                        var index = 1;
                        if ($('#my_type').val() == 'category') index = 2;
                        var rows = $('#list_values').val().trim().split(/\r?\n/gm);
                        if (rows.length) {
                            $('#progress-bar-text').html('0%');
                            $('#progressbar').width('0%');
                            $('#myProgress').fadeIn();
                            var i = 0;
                            stop = 0;
                            $('#my_start').hide();
                            $('#my_stop').show();
                            update();
                            function update() {
                                var row_info = rows[i].split('\t');
                                if (row_info.length == 4) {
                                    changeValue($('.panel-default.panel > .panel-body > div.row:nth-of-type(1) > div.col-xs-2:nth-of-type('+index+') > .form-group > .form-control')[0], row_info[0], 'input');
                                    setTimeout(function() {changeValue($('.panel-default.panel > .panel-body > div.row:nth-of-type(1) > div.col-xs-2:nth-of-type(3) > .form-group > .form-control')[0], row_info[1], 'textarea');}, 100);
                                    setTimeout(function() {changeValue($('div.col-xs-2:nth-of-type(4) > .react-datepicker__input-container > .form-control')[0], '', 'input');}, 200);
                                    setTimeout(function() {changeValue($('div.col-xs-2:nth-of-type(5) > .react-datepicker__input-container > .form-control')[0], '', 'input');}, 300);
                                    setTimeout(function() {changeValue($('div.col-xs-2:nth-of-type(4) > .react-datepicker__input-container > .form-control')[0], row_info[2], 'input');}, 400);
                                    setTimeout(function() {changeValue($('div.col-xs-2:nth-of-type(5) > .react-datepicker__input-container > .form-control')[0], row_info[3], 'input');}, 500);
                                    setTimeout(function() {
                                        if ($('.btn-success.btn:not(:disabled)').length) {
                                            var callback = function(mutationsList, observer) {
                                                observer.disconnect();
                                                clearTimeout(timeout);
                                                i = i + 1;
                                                var progres = Math.floor((i/rows.length*100));
                                                $('#progress-bar-text').html(progres + '% - '+i+'/'+rows.length);
                                                $('#progressbar').width(progres + '%');
                                                if (stop == 0) {
                                                    if (i < rows.length) setTimeout(function(){ update(); }, 500);
                                                    else {
                                                        setTimeout(function(){
                                                            alert('Done!');
                                                            $('#myProgress').fadeOut();
                                                            $('#my_stop').hide();
                                                            $('#my_start').show();
                                                        }, 500);
                                                    }
                                                }
                                            };
                                            var observer = new MutationObserver(callback);
                                            observer.observe($('.panel-primary.panel > .panel-body')[0], {attributes: false, childList: true, subtree: false});
                                            const timeout = setTimeout(() => {
                                                // when the timeout expires, stop watching…
                                                observer.disconnect();
                                                alert(`Server error! The script stopped at line ${i+1}!\n${rows[i]}`);
                                                $('#my_stop').hide();
                                                $('#my_start').show();
                                            }, 30000);
                                            $('.btn-success.btn').click();
                                        }
                                        else {
                                            alert(`Error on line ${i+1}!\n${rows[i]}`);
                                            $('#my_stop').hide();
                                            $('#my_start').show();
                                        }
                                    }, 600);
                                }
                                else {
                                    alert(`Line ${i+1} does not contain all the information!\n${rows[i]}`);
                                    $('#my_stop').hide();
                                    $('#my_start').show();
                                }
                            }
                        }
                    }
                    else alert('Choose type!');
                }
                else alert('Enter some text!');
            });
            $(document).on('click', '#my_stop', function() {
                stop = 1;
                $('#my_stop').hide();
                $('#my_start').show();
            });
        }
    }
    action();
})();