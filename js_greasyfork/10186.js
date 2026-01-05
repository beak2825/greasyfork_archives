// ==UserScript==
// @name            CebulaDealsTrollRemoval
// @description     Szybkie zgłaszanie trolli w tagu cebuladeals
// @description:en  none
// @namespace       report_CebuladealsTrolls
// @include         http://www.wykop.pl/mikroblog/*
// @include         http://www.wykop.pl/wpis/*
// @include         http://www.wykop.pl/tag/*
// @include         http://www.wykop.pl/moj/*
// @version         1.1
// @downloadURL https://update.greasyfork.org/scripts/10186/CebulaDealsTrollRemoval.user.js
// @updateURL https://update.greasyfork.org/scripts/10186/CebulaDealsTrollRemoval.meta.js
// ==/UserScript==


'Stworzone przez printf na podstawie koodu Gnidena. Nie jestem uber pro js wiec nie komentować kodu bo zrobilem to na szybko nie znając podstaw js';

var script = document.createElement('script');
script.textContent = '(' + main.toString() + ')();';
document.body.appendChild(script);


function main() {
  
  
  function reportUser(name, tag)
  {

    $.get('http://www.wykop.pl/ajax/violations/form/profile/' + name).success(function (data)
    {
      var action_url = $(data.html).find('form').attr('action');
      var object_type = $(data.html).find('input[name=\'violation[object_type]\']').attr('value');
      var object_id = $(data.html).find('input[name=\'violation[object_id]\']').attr('value');
      
      $.ajax({
        type: 'POST',
        url: action_url,
        data: {
          'violation[reason]': '1',
          'violation[info]': 'Ta osoba spamuje specjalnie tagiem #' + tag + ' przez co uniemozliwa korzytanie z serwisu. Łamie to punkt 5 podpunkt 6 regulaminu.',
          'violation[object_type]': object_type,
          'violation[object_id]': object_id
        }
      }).success(function (data)
      {
        alert('Zgłoszono ' + name + 'za spam w tagu #' + tag + ' !');
      });
    });
    
  }
  
  
  function createTagReportType() {
    return function reportPoliticsClick(e) {
      e.preventDefault();
      var username = $(this).parents('div[data-type="entry"]').find('a.profile').attr('href').split('/ludzie/') [1].replace('/', '');
      reportUser(username, 'cebuladeals')
      return false;
    }
  }
  
  
  var $reportTroll = $('<a href="#" class="affect hide btnNotify"><i class="fa fa-flag-o"></i> Cebuladeals Troll</a>');
  $reportTroll.click(createTagReportType()).attr('title', 'Zgłoś trolowanie cebuladeals');
  
  
  function addButtons() {
    [
    ].forEach.call(document.querySelectorAll('div[data-type="entry"]:not(.gr_improved) a.btnNotify'), function (el) {
      var parent = el.parentNode;
      var $parent = $(parent);
      if ($parent.closest('div[data-type]').hasClass('gr_improved') === false) {
        $parent.closest('div[data-type]').toggleClass('gr_improved', true);
        $parent.after($('<li class="report_entry_immproved" />').append($reportTroll.clone(true))
        );
      }
    });
  }
  
  
  function throttle(fn, ms) {
    var lastTime = - Infinity;
    return function cloq() {
      if ((Date.now() - ms) > lastTime) {
        fn.apply(this, arguments);
        lastTime = Date.now();
      }
      return undefined;
    }
  }
  
  
  addButtons();
  
  
  var mutationObserver = new MutationObserver(throttle(addButtons, 64));
  mutationObserver.observe(document.querySelector('#itemsStream'), {
    childList: true,
    subtree: true
  });
}
