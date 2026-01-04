// ==UserScript==
// @name         FV - Stud selector
// @version      0.3.1
// @description  Better dropdown and checkbox selection for Animal Husbandry
// @author       msjanny (#7302)
// @match        https://www.furvilla.com/career/breeder/*
// @match        https://www.furvilla.com/career/stables/*
// @match        https://www.furvilla.com/career/forest/*
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace https://greasyfork.org/users/319295
// @downloadURL https://update.greasyfork.org/scripts/422259/FV%20-%20Stud%20selector.user.js
// @updateURL https://update.greasyfork.org/scripts/422259/FV%20-%20Stud%20selector.meta.js
// ==/UserScript==

var stud = GM_getValue('stud', '');
var findfem = GM_getValue('findfem', false);
var lastChecked = null;

(function () {
  'use strict';
  /* globals $:false */

  function loadScripts(func) {
    //check every 300ms if modal has loaded before continuing
    if ($('#modal').prop('style').display != 'block' || $('#modal').find('img[src="/img/loading.gif"]').length) {
      setTimeout(function () {
        loadScripts(func);
      }, 300);
    } else func();
  }

  function selectStud() {
    var studbtn = $(
      '<a class="btn" style="margin-left: 20px">Remember Stud</a>'
    );
    studbtn.click(function () {
      stud = $('.stable-select select[name=male_id]').val();
      GM_setValue('stud', stud);
    });
    $("h2:contains('Male')").append(studbtn);

    var findfem_cb = $(
      '<input type="checkbox" class="form-check-input" style="height: 24px; width: 24px; margin-left: 20px">'
    );
    if (findfem) {
      findfem_cb.prop('checked', true);
    }
    findfem_cb.change(function () {
      findfem = !findfem;
      GM_setValue('findfem', findfem);
      if (findfem) findFem();
    });
    $("h2:contains('Female')").append(findfem_cb);

    if (stud) {
      $('.stable-select select[name=male_id]').val(stud);
      var option = $(`.stable-select select option[value=${stud}]`);
      if (option.length) {
        updateStablePreview(option);
        if (findfem) findFem();
      }
    }
  }
  function findFem() {
    var species = $('.stable-select select[name=male_id] option:selected')
      .text()
      .match(/\b[a-zA-Z\-]+$/g);
    var females = $(
      `.stable-select select[name=female_id] option:contains(${species})`
    );
    if (!females.length) {
      return;
    }
    var female = females.eq(0);
    updateStablePreview(female);
    $('.stable-select select[name=female_id]').val(female.attr('value'));
  }

  function imAnimals() {
    $('.modal .pagination a').click(function () {
      loadScripts(imAnimals);
    });
    checkAll();
    checkRTB();
  }
  function imStables() {
    $('.modal .pagination a').click(function () {
      loadScripts(imStables);
    });
    checkAll();
  }
  function forest() {
    $('.modal .pagination a').click(function () {
      loadScripts(forest);
    });

    // ctrl+select
    $('#modal .css-checkbox').click(function (e) {
      if (e.ctrlKey || e.shiftKey) {
        var from = $('#modal .css-checkbox').index(this);
        var to = $('#modal .css-checkbox').index(lastChecked);
        if (to < 0)  to = from;

        var start = Math.min(from, to) + 1;
        var end = Math.max(from, to) + 1;
        if (from < to)  end--;

        $('#modal .css-checkbox')
          .slice(start, end)
          .click();
      }
      lastChecked = $(this);
    });

    // check common males
    var RTBbtn = $(
      '<a class="pull-right label label-primary" style="margin-right: 10px;"><i class="fas fa-mars"></i> Check Common Males</a>'
    );
    RTBbtn.click(function () {
      $('.modal .inventory-table tr').each(function () {
        var txt = $(this).find('td:nth-child(2)').text();
        if (
          txt.includes('(Male)') &&
          $(this).find('br + span > .label-default').length
        ) {
          $(this).find('.css-checkbox').click();
        }
      });
    });
    $('.modal-body .serpent-all').after(RTBbtn);
    $('.modal-body .serpent-all').after(document.createTextNode('Use ctrl + click to select range.'));
  }

  function checkAll() {
    // create check all button
    var cbbtn = $(
      '<a class="pull-right label label-primary" style="margin-bottom: 15px;"><i class="fa fa-check-square-o"></i> Check All</a>'
    );
    cbbtn.click(function () {
      $('#modal .css-checkbox').click();
    });
    $('.modal-body > .clearfix').prepend(cbbtn);
    $('.modal-body > .clearfix').prepend(document.createTextNode('Use ctrl + click to select range.'));

    // ctrl+select
    $('#modal .css-checkbox').click(function (e) {
      if (e.ctrlKey || e.shiftKey) {
        var from = $('#modal .css-checkbox').index(this);
        var to = $('#modal .css-checkbox').index(lastChecked);
        if (to < 0)  to = from;

        var start = Math.min(from, to) + 1;
        var end = Math.max(from, to) + 1;
        if (from < to)  end--;

        $('#modal .css-checkbox')
          .slice(start, end)
          .click();
      }
      lastChecked = $(this);
    });
  }
  function checkRTB() {
    // create check all button
    var RTBbtn = $(
      '<a class="pull-right label label-primary" style="margin-right: 10px; margin-bottom: 15px;"><i class="fas fa-venus"></i> Check RTB</a>'
    );
    RTBbtn.click(function () {
      $('.modal .inventory-table tr').each(function () {
        var txt = $(this).find('td:nth-child(2)').text();
        if (txt.includes('(Female)') && txt.includes('Breedable Now')) {
          $(this).find('.css-checkbox').click();
        }
      });
    });
    $('.modal-body .inventory-table').before(RTBbtn);
  }

  function stables() {
    // ctrl+select
    $('.css-checkbox').click(function (e) {
      if (e.ctrlKey || e.shiftKey) {
        // get the column
        var cbclass = $(this).prop('class').includes("export-animal-input") ? ".export-animal-input" : ".export-stable-input";

        var from = $(cbclass).index(this);
        var to = $(cbclass).index(lastChecked);
        if (to < 0)  to = from;

        var start = Math.min(from, to) + 1;
        var end = Math.max(from, to) + 1;
        if (from < to)  end--;

        $(cbclass)
          .slice(start, end)
          .click();
      }
      lastChecked = $(this);
    });

    $('h1 + p').text($('h1 + p').text() + ' Use ctrl + click to select range.');

    // select all buttons
    var tr = $('<tr> <td colspan="2" class="text-right"> Select All </td> <td align="center" class="tooltipster tooltipstered"> <a class="label label-primary all-stables" data-action=""><i class="fa fa-check-square-o"></i></a> </td> <td align="center" class="tooltipster tooltipstered"> <a class="label label-primary all-animals" data-action="storage"><i class="fa fa-check-square-o"></i></a> </td> </tr>');
    $('.stables-list tbody').append(tr);
    $('.all-animals').click(function () {
      $('.export-animal-input').prop('checked', true);
    });
    $('.all-stables').click(function () {
      $('.export-stable-input').prop('checked', true);
    });
  }

  $(document).ready(function () {
    var url = window.location.href;
    if (url.includes('breeder')) {
      $('.breed-a').click(function () {
        loadScripts(selectStud);
      });
      $('.import-animals-btn').click(function () {
        loadScripts(imAnimals);
      });
      $('.import-stables-btn').click(function () {
        loadScripts(imStables);
      });
    } else if (url.includes('stables')) {
      stables();
    } else if (url.includes('forest')) {
      $('.import-animals-btn').click(function () {
        loadScripts(forest);
      });
    }
  });
})();