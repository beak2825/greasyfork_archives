// ==UserScript==
// @name         Redmine Extension Filter
// @namespace    JHU
// @version      0.1
// @description  Ajoute des filtres dans la liste des tickets
// @author       JHU
// @match        https://redmine.alkor-groupe.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395543/Redmine%20Extension%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/395543/Redmine%20Extension%20Filter.meta.js
// ==/UserScript==

(function() {


    var config = [
        {
            'name': 'Cacher Pourcentage',
            'type': 'percent',
            'buttons': [
                {'value':'100', 'label':'>= 100%'},
                {'value':'50', 'label':'>= 50%'},
                {'value':'25', 'label':'>= 25%'},
            ]
        },
        {
            'name': 'Cacher Assigné à',
            'type': 'assigned_to',
            'buttons': [
                {'value':'Digital & E-business', 'label':'Digital & E-business'},
                {'value':'Dev-Digital', 'label':'Dev-Digital'},
            ]
        },

        {
            'name': 'Cacher Status',
            'type': 'status',
            'buttons': [
                {'value':'A livrer en prod', 'label':'A livrer en prod'},
                {'value':'Fermé', 'label':'Fermé'},
                {'value':'En test utilisateur (préprod)', 'label':'Préprod'},
                {'value':'En cours', 'label':'En cours'},
                {'value':'Résolu', 'label':'Résolu'},
                {'value':'Commentaire', 'label':'Commentaire'},
                {'value':'A reprendre', 'label':'A reprendre'},
                {'value':'En attente', 'label':'En attente'},
                {'value':'Nouveau', 'label':'Nouveau'},
            ]
        },
        {
            'name': 'Cacher Priorité',
            'type': 'priority',
            'buttons': [
                {'value':'Basse', 'label':'Basse'},
                {'value':'Normale', 'label':'Normale'},
            ]
        },
    ];

    var cssBlock = "padding: 5px;background: #eee; border: #ddd 1px solid; margin-bottom: 9px; border-radius: 5px; float: none;";
    var cssButton = "padding: 5px;background: #eee; border: #ddd 1px solid; margin-bottom: 9px; border-radius: 5px;";
    var cssButtonInit = "padding: 10px;margin: 5px;display: block;font-weight: bold;";

    if ($('.list.issues').length > 0)
    {
        var container = $("<div class='containerFilter' style='padding: 0 20px;'></div>");
        $('.list.issues').before(container);
        addButtonIssueTree(container);
    }


    function addButtonIssueTree(container)
    {
        for(var i in config)
        {
            var theContainer = $("<div style='"+cssBlock+"' class='contextual'><label>"+ config[i].name +" :</label></div>");
            for(var j in config[i].buttons)
            {
                var theButton = '<a href="#" class="hideButton icon" data-state="off" data-type="'+config[i].type+'" data-content="'+config[i].buttons[j].value+'">'+config[i].buttons[j].label+'</a>';

                $(theContainer).append(theButton);
            }
            var clearButton = '<a href="#" class="clearButton icon" data-type="'+config[i].type+'">(clear)</a>';
            $(theContainer).append(clearButton);
            $(container).prepend(theContainer);

        }

        var buttonShowAll = '<a href="#" class="showAllIssues icon"style="'+cssButtonInit+'" >Ré-initialiser</a>';
        $(container).prepend(buttonShowAll);
    }

    $('body').on('click', '.hideButton', function(e) {
       e.preventDefault();
        var theType = $(this).attr('data-type');
        var currentState = $(this).attr('data-state');
        if (currentState == 'on')
        {
            $(this).css('font-weight', 'normal');
            nextState = 'off';
        }
        if (currentState == 'off')
        {
            $(this).css('font-weight', 'bold');
            nextState = 'on';
        }

        $(this).attr('data-state', nextState);

        switch(theType)
        {
            case 'percent':
                processPercent($(this).attr('data-content'), nextState);
                break;

            default:
                processContent(theType, $(this).attr('data-content'), nextState);
                break;
        }
    });

    $('body').on('click', '.clearButton', function(e) {
       e.preventDefault();
       $(this).parent().find('.hideButton[data-state="on"]').each(function(button) {
          $(this).click();
       });
    });

    $('body').on('click', '.showAllIssues', function(e) {
       e.preventDefault();
       showAllIssues();
    });

    function processPercent(percent, nextState)
    {
        $('.list.issues tr').each(function() {
            var theTr = $(this);
            var theTableProgressClasses = $(this).find('table.progress').attr('class');
            if (theTableProgressClasses)
            {
                var thePercent = theTableProgressClasses.replace('progress progress-', '');
                thePercent = parseInt(thePercent);

                if (thePercent >= percent)
                {
                    if (nextState == 'on')
                        theTr.hide();
                    else
                        theTr.show();
                }
            }

        });
    }

    function processContent(label, content, nextState)
    {
        $('.list.issues tr').each(function() {
            var theTr = $(this);
            var theContent = theTr.find('td.' + label).text();
            if (theContent == content)
            {
                if (nextState == 'on')
                    theTr.hide();
                else
                    theTr.show();
            }
        });
    }

    function showAllIssues()
    {
        $('.list.issues tr').show();
    }



})();