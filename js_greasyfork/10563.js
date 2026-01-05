// ==UserScript==
// @name        TFS en couleur
// @namespace   hiddenfield
// @description Ajoute des couleurs à TFS
// @include     http://tfs.grics.qc.ca:8080/tfs/Grics/*/*/_backlogs/taskboard/*
// @grant       none
// @version 0.0.1.20150622174005
// @downloadURL https://update.greasyfork.org/scripts/10563/TFS%20en%20couleur.user.js
// @updateURL https://update.greasyfork.org/scripts/10563/TFS%20en%20couleur.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

var refreshTime = 1000;

addGlobalStyle('.witTypeBug             .tbTileContent    { border-left-color: #FF3300 !important; backgroundremoved: #FFCBBE !important; }');
addGlobalStyle('.witTypeTest             .tbTileContent    { border-left-color: #FF9D00 !important; backgroundremoved:#FFE5CC !important; }');
addGlobalStyle('.witTypeAnalysis         .tbTileContent    { border-left-color: cadetblue !important; backgroundremoved:#90DAD5 !important; }');
addGlobalStyle('.witTypeDevelopment     .tbTileContent     { border-left-color: steelblue !important; backgroundremoved:#E3C7FF !important; }');
addGlobalStyle('.witTypeIntegration     .tbTileContent     { border-left-color: salmon !important; backgroundremoved:#E3C7FF !important; }');
addGlobalStyle('.witMyWork.tbTile .tbTileContent[style] { background: lightblue !important; }');
addGlobalStyle('tbody .taskboard-cell                    { padding-bottom:8px; }');
addGlobalStyle('.tbTile                                    { height:105px; }');
addGlobalStyle('.witTitle                                { height:80px !important; }');
addGlobalStyle('.tbPivotItem .witTitle                    { font-size: 9pt; }');
addGlobalStyle('.tbTileContent                            { box-shadow:         2px 2px 5px 0px rgba(50, 50, 50, 0.75); }');

addGlobalStyle('.taskFilters a { font-weight: bold; border: 1px solid black; color: black; margin-left:2em; padding: .1em .8em; border-radius: 5px; font-size: .9em; }');
addGlobalStyle('.taskFilters a.Development { background: steelblue; }');
addGlobalStyle('.taskFilters a.Analysis { background: cadetblue; }');
addGlobalStyle('.taskFilters a.Testing { background: #FF9D00; }');
addGlobalStyle('.taskFilters a.Integration { background: salmon; }');
addGlobalStyle('.taskFilters a.Bugs { background: #FF3300; }');
addGlobalStyle('.taskFilters a.off { background: none; }');

addGlobalStyle('.ui-tooltip { background: black; border: 2px solid white; padding: 10px 20px; color: white; border-radius: 20px; font: bold 14px "Helvetica Neue", Sans-Serif; box-shadow: 0 0 7px black; width: 30%; }');

function updateTasks() {
    var items = document.getElementsByClassName('taskboard');
    if (items.length == 0) {
        return;
      }
    else {
        var tfsContext = $.parseJSON($('.tfs-context').text())
        
        var $taskFilters = $('.taskFilters');
        
        if ($taskFilters.length === 0)
        {
            $taskFilters = $('<span class="taskFilters" />');
            $('.hub-title').append($taskFilters);
        }
        
        $taskFilters.empty();
        
        var filterTasks = function() {
            var taskType = $(this).data('taskType');
            $(this).toggleClass('off');
            $('.' + taskType).toggle();
        };

        $taskFilters.append($('<a title="Heures restantes sur les tâches d\'analyse" />')
            .addClass('Analysis')
            .data('taskType', 'witTypeAnalysis')
            .append('Analyses')
            .click(filterTasks))
      
        $taskFilters.append($('<a title="Heures restantes sur des tâches de développement" />')
            .addClass('Development')
            .data('taskType', 'witTypeDevelopment')
            .append('Tâches')
            .click(filterTasks));  
        
        $taskFilters.append($('<a title="Heures restantes sur des tâches de test" />')
            .addClass('Testing')
            .data('taskType', 'witTypeTest')
            .append('Tests')
            .click(filterTasks));

        $taskFilters.append($('<a title="Heures restantes sur des tâches d\'intégration" />')
            .addClass('Integration')
            .data('taskType', 'witTypeIntegration')
            .append('Integrations')
            .click(filterTasks));
      
        $taskFilters.append($('<a title="Heures restantes sur des tâches de bogue" />')
            .addClass('Bugs')
            .data('taskType', 'witTypeBug')
            .append('Bogues')
            .click(filterTasks));
      
           
        var devWorkRemaining = 0;
        var analysisWorkRemaining = 0;
        var testingWorkRemaining = 0;
        var bugWorkRemaining = 0;
        var integrationWorkRemaining = 0;
        
       $(".tbTile").each(function() {
           var $this = $(this);
           var $title = $('.witTitle', this);
           var $content = $('.tbTileContent', this);
           
           var titleText = $title.text();
           var assignedTo = $('.witAssignedTo', this).text();
           var workRemaining = $('.witRemainingWork', this).text().replace(/,/g, '.') * 1;
                  
           if (titleText.toLowerCase().indexOf('tester') > -1 || titleText.indexOf('[T]') > -1) {
               $this.addClass('witTypeTest');
               testingWorkRemaining += workRemaining;
           } else if (titleText.toLowerCase().indexOf('analyse') > -1 || titleText.indexOf('[A]') > -1) {
               $this.addClass('witTypeAnalysis');
               analysisWorkRemaining += workRemaining;
           } else if(titleText.toLowerCase().indexOf('bogue') > -1 || titleText.indexOf('[B]') > -1) {
               $this.addClass('witTypeBug');
               bugWorkRemaining += workRemaining;
           } else if(titleText.toLowerCase().indexOf('intégrer') > -1 || titleText.indexOf('[I]') > -1) {
               $this.addClass('witTypeIntegration');
               integrationWorkRemaining += workRemaining;
           } else {
               $this.addClass('witTypeDevelopment');
               devWorkRemaining += workRemaining;
           }
               
           if (assignedTo == tfsContext.currentUser) {
               $this.addClass('witMyWork');
           }
           else {
               $this.removeClass('witMyWork');
           } 
               
               
       });
        
        $('a.Development').append(' [' + devWorkRemaining + ']');
        $('a.Analysis').append(' [' + analysisWorkRemaining + ']');
        $('a.Testing').append(' [' + testingWorkRemaining + ']');
        $('a.Integration').append(' [' + integrationWorkRemaining + ']');
        $('a.Bugs').append(' [' + bugWorkRemaining + ']');
        
    }
    $taskFilters.tooltip({
        position: {
            my: "left top",
            at: "left bottom"
        },
        hide: { duration: 0 }
    });
};

window.setInterval(function() {    
   updateTasks();
}, refreshTime);