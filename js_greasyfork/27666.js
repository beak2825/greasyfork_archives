// ==UserScript==
// @name         TW External Links
// @namespace    ILLEGAL
// @version      1.0
// @description  External links on tw village view
// @author       mojo
// @include      http*://gr*.fyletikesmaxes.gr/game.php?*screen=info_village*
// @icon         http://s3.amazonaws.com/uso_ss/icon/129407/large.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27666/TW%20External%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/27666/TW%20External%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    (function($) {    
        if ($.fn.style) {
            return;
        }

        // Escape regex chars with \
        var escape = function(text) {
            return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        };

        // For those who need them (< IE 9), add support for CSS functions
        var isStyleFuncSupported = !!CSSStyleDeclaration.prototype.getPropertyValue;
        if (!isStyleFuncSupported) {
            CSSStyleDeclaration.prototype.getPropertyValue = function(a) {
                return this.getAttribute(a);
            };
            CSSStyleDeclaration.prototype.setProperty = function(styleName, value, priority) {
                this.setAttribute(styleName, value);
                var priority = typeof priority != 'undefined' ? priority : '';
                if (priority != '') {
                    // Add priority manually
                    var rule = new RegExp(escape(styleName) + '\\s*:\\s*' + escape(value) +
                                          '(\\s*;)?', 'gmi');
                    this.cssText =
                        this.cssText.replace(rule, styleName + ': ' + value + ' !' + priority + ';');
                }
            };
            CSSStyleDeclaration.prototype.removeProperty = function(a) {
                return this.removeAttribute(a);
            };
            CSSStyleDeclaration.prototype.getPropertyPriority = function(styleName) {
                var rule = new RegExp(escape(styleName) + '\\s*:\\s*[^\\s]*\\s*!important(\\s*;)?',
                                      'gmi');
                return rule.test(this.cssText) ? 'important' : '';
            }
        }

        // The style function
        $.fn.style = function(styleName,index, value, priority) {
            if(index===-1){
                this.each(function(i, node) {
                    // DOM node
                    //var node = this.get(0);
                    // Ensure we have a DOM node
                    if (typeof node == 'undefined') {
                        return this;
                    }
                    // CSSStyleDeclaration
                    //var style = this.get(1).style;
                    var style = node.style;
                    // Getter/Setter
                    if (typeof styleName != 'undefined') {
                        if (typeof value != 'undefined') {
                            // Set style property
                            priority = typeof priority != 'undefined' ? priority : '';
                            style.setProperty(styleName, value, priority);
                            return this;
                        } else {
                            // Get style property
                            return style.getPropertyValue(styleName);
                        }
                    } else {
                        // Get CSSStyleDeclaration
                        return style;
                    }
                });
            }else{
                // DOM node
                var node = this.get(index);
                // Ensure we have a DOM node
                if (typeof node == 'undefined') {
                    return this;
                }
                // CSSStyleDeclaration
                //var style = this.get(1).style;
                var style = node.style;
                // Getter/Setter
                if (typeof styleName != 'undefined') {
                    if (typeof value != 'undefined') {
                        // Set style property
                        priority = typeof priority != 'undefined' ? priority : '';
                        style.setProperty(styleName, value, priority);
                        return this;
                    } else {
                        // Get style property
                        return style.getPropertyValue(styleName);
                    }
                } else {
                    // Get CSSStyleDeclaration
                    return style;
                }
            }
        };
    })(jQuery);

    function getParameter(url,param){
        var regex = new RegExp("("+param+"=)(\\w+)","g");
        var match = regex.exec(url);
        return match[2];
    }

    var villagelink = document.URL;
    var playerlink = $('#content_value > table > tbody > tr > td:nth-child(1) > table:nth-child(1) > tbody > tr:nth-child(5) > td:nth-child(2) > a').attr("href");
    var tribelink = $('#content_value > table > tbody > tr > td:nth-child(1) > table:nth-child(1) > tbody > tr:nth-child(6) > td:nth-child(2) > a').attr("href");
    
    var villageID = getParameter(villagelink,"id");
    
    if (typeof playerlink !== 'undefined') {
        var playerID = getParameter(playerlink,"id");
    }
    if (typeof tribelink !== 'undefined') {
        var tribeID = getParameter(tribelink,"id");
    }
    
    $('#content_value > table > tbody > tr > td:nth-child(1) > table:nth-child(1) > tbody > tr:nth-child(1) > th').attr('colspan', '3');
    $('#embedmap_village').attr('colspan', '3');
    $('#content_value > table > tbody > tr > td:nth-child(1) > table:nth-child(1) > tbody > tr:nth-child(3) > td:nth-child(2)').attr('colspan', '2');

    $("#content_value > table > tbody > tr > td:nth-child(1) > table:nth-child(1) > tbody > tr:nth-child(4) > td:nth-child(2)").after(
        $('<td id="ex1"><a class="external" href="http://gr.twstats.com/gr45/index.php?page=village&id='+villageID+'" target="_blank"></a></td>'));

    if (typeof playerlink !== 'undefined') {
        $("#content_value > table > tbody > tr > td:nth-child(1) > table:nth-child(1) > tbody > tr:nth-child(5) > td:nth-child(2)").after(
            $('<td><a class="external" href="http://gr.twstats.com/gr45/index.php?page=player&id='+playerID+'" target="_blank"></a></td>'));
    }else{
        $('#content_value > table > tbody > tr > td:nth-child(1) > table:nth-child(1) > tbody > tr:nth-child(5) > td:nth-child(2)').attr('colspan', '3');
    }
    
    if (typeof tribelink !== 'undefined') {
        $("#content_value > table > tbody > tr > td:nth-child(1) > table:nth-child(1) > tbody > tr:nth-child(6) > td:nth-child(2)").after(
            $('<td><a class="external" href="http://gr.twstats.com/gr45/index.php?page=tribe&id='+tribeID+'" target="_blank"></a></td>'));
    }else{
        $('#content_value > table > tbody > tr > td:nth-child(1) > table:nth-child(1) > tbody > tr:nth-child(6) > td:nth-child(2)').attr('colspan', '3');
    }
    $(".external").css({
        'width':'15px',
        'height': '19px',
        'display': 'block'
    });

    $('.external').style('background',-1,'black url("http://www.iconsdb.com/icons/preview/white/link-xxl.png") no-repeat','important');
    $('.external').style('background-size',-1,'15px 15px','important');
    $('.external').style('background-position',-1,'center center','important');
    
    $('#ds_body').prepend('<div class="f"></div>');
    
    setTimeout(function () {
        $('.f').style('background',-1,'black url("https://s17.postimg.org/ckjm5vqbj/link_s.png") no-repeat','important');
        $('.f').style('background-size',-1,'15px 15px','important');
        $('.f').style('background-position',-1,'center center','important');
    }, 500);
    setTimeout(function () {
        $('.f').style('background',-1,'black url("http://www.iconsdb.com/icons/preview/white/link-xxl.png") no-repeat','important');
        $('.f').style('background-size',-1,'15px 15px','important');
        $('.f').style('background-position',-1,'center center','important');
    }, 1000);

    $('.external').hover(function(){
        $('.external').style('background',$('.external').index(this),'black url("https://s17.postimg.org/ckjm5vqbj/link_s.png") no-repeat','important');
        $('.external').style('background-size',$('.external').index(this),'15px 15px','important');
        $('.external').style('background-position',$('.external').index(this),'center center','important');
    },
    function(){
        $('.external').style('background',$('.external').index(this),'black url("http://www.iconsdb.com/icons/preview/white/link-xxl.png") no-repeat','important');
        $('.external').style('background-size',$('.external').index(this),'15px 15px','important');
        $('.external').style('background-position',$('.external').index(this),'center center','important');
    });
    
    setTimeout(function () {
        $('.f').style('background',-1,'black url("https://s17.postimg.org/ckjm5vqbj/link_s.png") no-repeat','important');
        $('.f').style('background-size',-1,'15px 15px','important');
        $('.f').style('background-position',-1,'center center','important');
    }, 500);
    setTimeout(function () {
        $('.f').style('background',-1,'black url("http://www.iconsdb.com/icons/preview/white/link-xxl.png") no-repeat','important');
        $('.f').style('background-size',-1,'15px 15px','important');
        $('.f').style('background-position',-1,'center center','important');
    }, 1000);
})();