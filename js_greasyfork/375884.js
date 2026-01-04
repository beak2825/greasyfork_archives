// ==UserScript==
// @name         Shiny New MCStacker 2
// @version      1.0
// @description  Makes small changes to MCStacker so it's easier to write styles for. Needed for a userstyle by the same name to function optimally.
// @author       Ruby Rosario
// @grant        none
// @include      https://mcstacker.net/*
// @namespace https://greasyfork.org/users/139367
// @downloadURL https://update.greasyfork.org/scripts/375884/Shiny%20New%20MCStacker%202.user.js
// @updateURL https://update.greasyfork.org/scripts/375884/Shiny%20New%20MCStacker%202.meta.js
// ==/UserScript==
function scriptFunction() {
  
  function extend(f1, f2) {
    return function() {
      var _this = this;
      var _args = arguments;
      
      f1.apply(_this, _args);
      f2.apply(_this, _args);
    };
  }
  
  window.loadForm = extend(window.loadForm, function(form) {
    $('#executePane').removeClass('roundedDiv');
    wrapSelects();
    
    if (form === "summon") {
      // Move only the first set of passengers outside of their entity box.
      $('#entityPane0B').insertAfter('#rootEntity');
      movePassengers();
    }
  });
  
  window.entityChange = extend(window.entityChange, function() {
    wrapSelects();
    movePassengers();
  });

  window.createExecuteForm = extend(window.createExecuteForm, function(form) {
    $('#executePane').addClass('roundedDiv');
    wrapSelects();
  });

  window.removeExecute = extend(window.removeExecute, function(form) {
    $('#executePane').removeClass('roundedDiv');
  });
  
  function wrapSelects() {
    $("select").not(".selectLabel select").wrap("<label class='selectLabel'></label>");
  }

  window.showHide = function(container, hideButton){
    if($('#'+container).is(":visible")){
      $('#'+container+', #'+hideButton).addClass('hiding').removeClass('shown');
      $('#'+container).hide();
      $('#'+hideButton).html("<span>S</span>");
      $('#'+hideButton).prev().addClass('hiding').removeClass('shown');
    }else{
      $('#'+container+', #'+hideButton).addClass('shown').removeClass('hiding');
      $('#'+container).show();
      $('#'+hideButton).html("<span>H</span>");
      $('#'+hideButton).prev().addClass('shown').removeClass('hiding');
    }
  }
  
  function movePassengers() {
    // Move all of the passengers outside of their entity box.
    /*$('.entityWrapper > .entityB').each(function() {
      var $this = $(this);
      $this.insertAfter($this.closest('.roundedDiv'));
    });*/
    
    // Move add passenger buttons to the end.
    $('.greenPlus[href^="javascript:addPassenger"]').each(function() {
      var $this = $(this);
      $this.parent().append($this);
    });
    
    // Remove extra
    setTimeout(function() {
    	$('#rootEntity > .entityWrapper > .entityB').remove();
    }, 100);
  }

  window.addPassenger = extend(window.addPassenger, function(pane) {
    movePassengers();
  });

  window.removePassenger = extend(function(entityID, num) {
    $('#'+entityID+' + .entityB').remove();
  }, window.removePassenger);
}

var script = document.createElement('script'); 
script.type = "text/javascript"; 
script.innerHTML = scriptFunction.toString() + "\nscriptFunction();";
document.getElementsByTagName('head')[0].appendChild(script);