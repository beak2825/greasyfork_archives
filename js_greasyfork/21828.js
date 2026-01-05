// ==UserScript==
// @name         INARA Cargo Ext
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @author       DrFreez
// @match        http://inara.cz/cmdr-cargo/*
// @match        http://inara.cz/cmdr-cargo
// @match        https://inara.cz/cmdr-cargo/*
// @match        https://inara.cz/cmdr-cargo
// @description Cargo Calc
// @downloadURL https://update.greasyfork.org/scripts/21828/INARA%20Cargo%20Ext.user.js
// @updateURL https://update.greasyfork.org/scripts/21828/INARA%20Cargo%20Ext.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    var $conteiner = $('.inventorymaterialcont');
    var $input = $('<input class="spinner retries inara-cargo-ext" type="number" step="1" />');
    
    var materialType = {};
    var lastType;
    $('> div', $conteiner).each(function(){
        var $el = $(this);
        if($el.hasClass('inventorytitle')){
            lastType = $el.text();
        } else if ($el.hasClass('inventorymaterial')) {
            materialType[$('a', $el).text()] = lastType;
        }
    });
    
    $('.flexmiddle').prepend('<h2 class="header">crafting materials</h2><div class="mainblock tableblocksub"><table class="subtable tablesorter" id="inara-cargo-ext"><thead><tr><th class="lineright">Material</th><th class="lineright">Type</th><th class="lineright">Need</th><th class="lineright">Have</th><th></th></tr></thead><tbody></tbody></table></div>');
    var $blueprintList = $('.flexrightwide .mainblock');
    var $table = $('#inara-cargo-ext');
    var $tbody = $('tbody', $table);
    
    var checkHaveNeed = function() {
        $('tr', $tbody).each(function(){
            var $tr = $(this);
            if (parseInt($('td:eq(3) input', $tr).val()) >= parseInt($('td:eq(2)', $tr).text())) {
                $('td:eq(0) a', $tr).addClass('positive');
                $('td:eq(4) span', $tr).html('✔').removeClass('negative').addClass('positive');
            } else {
                $('td:eq(0) a', $tr).removeClass('positive');
                $('td:eq(4) span', $tr).html('✘').removeClass('positive').addClass('negative');
            }
        });
    };
    
    var calculateNeed = function () {
        var materials = {};
        $blueprintList.each(function(){
            var $block = $(this);
            var $input = $('input', $block);
            var blueprintsTries = parseInt($input.val());
            
            var tmpMaterials = [];
            $('a[href^="/galaxy-component/"]', $block).each(function(){
                var $el = $(this);
                
                var materialName;
                if ($el.data('name') === undefined) {
                    materialName = 'Material ' + $el.text();
                    $el.data('name', materialName);
                } else {
                    materialName = $el.data('name');
                }
                
                var materialNeed = parseInt(($el.parent().prev('span').text().replace(/x$/i, '')));
                if (materials[materialName] === undefined) {
                    materials[materialName] = 0;
                }
                materials[materialName] += blueprintsTries * materialNeed;
            });
        });
        
        $.each(materials, function(materialName, need){
            $('tr[data-name="' + materialName + '"] td:eq(2)', $tbody).empty().append(need);
        });
    };
    
    var saveValues = function() {
        var data = {};
        $('input.inara-cargo-ext').each(function(){
            var $input = $(this);
            data[$input.attr('name')] = $input.val();
        });
        
        localStorage.setItem('inara-cargo-ext', JSON.stringify(data));
    };
    
    var loadValues = {
        data: JSON.parse(localStorage.getItem('inara-cargo-ext')),
        get: function(name, defaultValue) {
            if (loadValues.data !== null && loadValues.data[name] !== undefined) {
                return loadValues.data[name];
            }
            
            return defaultValue;
        }
    };
    
    $blueprintList.each(function(){
        var $block = $(this);
        var blueprintName = 'Blueprint ' + $block.prev('h3').text();
        
        $('.textright:eq(0)', $block).empty().append($input.clone().attr('name', blueprintName).val(loadValues.get(blueprintName, 1))).css('height', 20);
        
        $('a[href^="/galaxy-component/"]', $block).each(function(){
            var $el = $(this);
            var $elClone = $el.parent().clone();
            var materialName = 'Material ' + $('a', $elClone).text();
            var $tr = $('tr[data-name="' + materialName + '"]', $table);
            if ($tr.length === 0) {
                $tr = $('<tr data-name="' + materialName + '"><td class="lineright"></td><td class="lineright"></td><td class="lineright"></td><td class="lineright"></td><td></td></tr>');
                $('td:eq(0)', $tr).css({height: 20}).append($el.parent().prev().prev('img').clone()).append($elClone);
                $('td:eq(1)', $tr).append(materialType[$('a', $elClone).text()]);
                $('td:eq(2)', $tr).css({textAlign: 'center'});
                $('td:eq(3)', $tr).css({width: 70}).append($input.clone().attr('name', materialName).val(loadValues.get(materialName, 0)));
                $('td:eq(4)', $tr).css({textAlign: 'center'}).append('<span></span>');
                $tbody.append($tr);
            }
        });
    });
    
    $('input.inara-cargo-ext').parent().hover(function() {
        $(this).find(".spinner").spinner({min: 0});
    }, function() {
        $(this).find(".spinner").spinner("destroy");
    });
    
    $('body').on('click', '.ui-spinner-button', function(){
        $('input.inara-cargo-ext', $(this).parent()).change();
    });
    
    $('body').on('change', 'input.inara-cargo-ext', function(){
        saveValues();
        calculateNeed();
        checkHaveNeed();
    });
    
    calculateNeed();
    checkHaveNeed();
})();