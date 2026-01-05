// ==UserScript==
// @name         prodpad
// @namespace    proximis
// @version      1.18
// @description  hehe :)
// @author       teles
// @match        https://app.prodpad.com/*
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27343/prodpad.user.js
// @updateURL https://update.greasyfork.org/scripts/27343/prodpad.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var manual = false;
    var sheet = (function() {
        var style = document.createElement("style");
        style.appendChild(document.createTextNode(""));
        document.head.appendChild(style);
        return style.sheet;
    })();
    sheet.insertRule(".roadmap-column__body { display: none; }", 0);
    sheet.insertRule(".roadmap-column-wrapper .roadmap-column { padding-bottom: 0; }", 0);
    sheet.insertRule(".roadmap-column { min-height: inherit !important; }", 0);
    sheet.insertRule(".pxroadmap { margin-bottom: 100px; margin-top: 20px; }", 0);
    sheet.insertRule(".pxms { display: none; }", 0);
    sheet.insertRule(".pxload { margin: 30px; }", 0);
    sheet.insertRule(".pxidea select, .input-select.small::after { opacity: 0.3; }", 0);
    sheet.insertRule(".pnewidea { background: #d9534f; }", 0);
    sheet.insertRule(".p037b4910498411e5b90322000a23849c { background: #d9534f; }", 0);
    sheet.insertRule(".p037b4f5a498411e5b90322000a23849c { background: #f0ad4e; }", 0);
    sheet.insertRule(".p037b50ae498411e5b90322000a23849c { background: #5cb85c; }", 0);
    sheet.insertRule(".p037b51da498411e5b90322000a23849c { background: #5cb85c; }", 0);
    sheet.insertRule(".p037b5482498411e5b90322000a23849c { background: black; }", 0);
    sheet.insertRule(".pxfilter { background: white; position: absolute; top: 10px; right: 120px; height: 42px; width:100px; padding:5px; }", 0);
    sheet.insertRule(".pxalert { background: chartreuse; transform: scale(2.0); transition: transform 0.3s; }", 0);
    sheet.insertRule(".pxstats > td { padding-top: 0; padding-bottom: 0; }", 0);
    sheet.insertRule(".pxfilterstatepnewidea { border-bottom-color: #d9534f; }", 0);
    sheet.insertRule(".pxfilterstatep037b4910498411e5b90322000a23849c { border-bottom-color: #d9534f; }", 0);
    sheet.insertRule(".pxfilterstatep037b4f5a498411e5b90322000a23849c { border-bottom-color: #f0ad4e; }", 0);
    sheet.insertRule(".pxfilterstatep037b50ae498411e5b90322000a23849c { border-bottom-color: #5cb85c; }", 0);
    sheet.insertRule(".pxfilterstatep037b51da498411e5b90322000a23849c { border-bottom-color: #5cb85c; }", 0);
    sheet.insertRule(".pxfilterstatep037b5482498411e5b90322000a23849c { border-bottom-color: black; }", 0);
    sheet.insertRule(".pxfilterstate { cursor: pointer; border: 40px solid #f4f4f4; border-bottom-width: 4px; border-top-width: 4px; }", 0);

    var session = JSON.parse(localStorage.getItem('pp_sess'));
    var role = session.current_roles ? session.current_roles[0].role : '';
    var apiKey = localStorage.getItem('apikey') || '', apiRoadmaps, apiUsers;
    if (apiKey) {
        $.get('https://api.prodpad.com/v1/roadmaps/10435?apikey='+apiKey).then(function(json){
            apiRoadmaps = json;
            console.log(json);
        }, function(){
            $('#apikey').show();
        });
        $.get('https://api.prodpad.com/v1/users?apikey='+apiKey).then(function(json){
            apiUsers = json;
        });
    } else {
        $.ajax({
            method: 'GET',
            url: 'https://api-beta.prodpad.com/api/v2/user/'+session.user.id+'/apikey',
            headers: {
                'X-API-Token': session.token
            }
        }).then(function(json){
           apiKey = json.apikey;
           $('#apikey').val(apiKey);
           localStorage.setItem('apikey', apiKey);
           $.get('https://api.prodpad.com/v1/roadmaps/10435?apikey='+apiKey).then(function(json){
               apiRoadmaps = json;
           }, function(){
               $('#apikey').show();
           });
           $.get('https://api.prodpad.com/v1/users?apikey='+apiKey).then(function(json){
               apiUsers = json;
           });
        }, function(){
            $('#apikey').show();
        });
    }
    var api = setInterval(function(){
        if (!$('#apikey').length) {
            $('.main-head__right').prepend('<li><input id="apikey" placeholder="API Key"/></li>');
            $('#apikey').val(apiKey);
            $('#apikey').hide();
            $('#apikey').keyup(function(){
                localStorage.setItem('apikey', $('#apikey').val());
                if ($('#apikey').val()) {
                    apiKey = $('#apikey').val();
                    $.get('https://api.prodpad.com/v1/roadmaps/10435?apikey='+apiKey).then(function(json){
                        apiRoadmaps = json;
                    }, function(){
                        $('#apikey').show();
                    });
                }
            });
        } else {
            clearInterval(api);
        }
    }, 200);

    var linkify = function(txt) {
        return txt.replace(/([^"]https?:\/\/[^\s<\)]*)/g, '<a href="$1">$1</a>').replace(/&nbsp;/g, ' ');
    };

    var enhanceRoadmap = function() {
        if ($('.pxroadmap').length) {
            return;
        }
        $('select').each(function(){
            $('option[value="'+$(this)[0].value+'"]', this).attr('selected', 'selected');
        });
        $('.card__pipeline > button').each(function() {
            if (!$(this).parent().find('.card__pipeline-list').length) {
                $(this).click();
            }
        });
        var roadmaps = {};
        $('.roadmap-column').each(function(){
            var version = $('.roadmap-column__head-title', this).text();
            if (!version || $.trim(version) == 'Enter a name...') {
                version = $('.roadmap-column__head-title textarea', this)[0]._value;
            }
            version = $.trim(version);
            $('.roadmap-column__head-title', this).attr('version', version);
            roadmaps[version] = [];
            $('.card', this).each(function(){
                var ideas = {};
                var title = $('.card__body .card__title', this).text();
                if (!title || $.trim(title) == 'Enter a card name...') {
                    title = $('.card__body .card__title textarea', this)[0]._value;
                }
                $('.idea-list-item', this).each(function(){
                    var id = $('.idea-list-item__body-header a', this).attr('href').split('/')[2];
                    ideas[id] = {
                        id: id,
                        num: $('.idea-list-item__body-header', this).text().replace(/IDEA ([0-9]*) .*/, '<strong style="font-size:1.3em"><a href="/ideas/$1"><u>$1</u></a> <a href="/ideas/$1" target="_blank"><u>➚</u></a></strong>'),
                        title: $('.idea-list-item__body-header', this).text().replace(/IDEA [0-9]*[ ]+-[ ]+/, ''),
                        status: $('.idea-list-item__status div:first', this).html(),
                        state: $('.idea-list-item__status div:first select option[selected]', this).text(),
                        class: 'p' + ($('.idea-list-item__status div:first option[selected]', this).attr('value').replace(/-/g, '') || 'newidea')
                    };
                });
                roadmaps[version].push({title: title, ideas: ideas});
            });
        });
        //console.log(roadmaps);
        var html = '<table class="pxroadmap">';
        var versionStats = {};
        for (var v in roadmaps) {
            versionStats[v] = {};
            for(var c=0; c<roadmaps[v].length; c++) {
                if (Object.keys(roadmaps[v][c].ideas).length) {
                    html += '<tr class="pxtitle pxms '+btoa(v).replace(/=/g, '')+'"><th colspan="2" style="font-size:1.3em">'+roadmaps[v][c].title+'</th></tr>';
                    for(var id in roadmaps[v][c].ideas) {
                        var idea = roadmaps[v][c].ideas[id];
                        html += '<tr class="pxidea pxidea'+idea.id+' pxms '+btoa(v).replace(/=/g, '')+' pxIdea'+idea.class+'">';
                        html += '<td width="140px" class="idea-list-item__status '+idea.class+'"><div class="input-select small" style="pointer-events: none;">'+idea.status+'</div></td>';
                        html += '<td style="vertical-align:top">'+idea.num+' - <a href="javascript:;" num="'+$(idea.num).find('u').text()+'" class="pxideatitle" style="font-size:1.2em; color:black">'+idea.title+'</a></td>';
                        html += '</tr>';
                        if (!versionStats[v][roadmaps[v][c].ideas[id].state]) {
                            versionStats[v][roadmaps[v][c].ideas[id].state] = { n: 1, c: roadmaps[v][c].ideas[id].class };
                        } else {
                            versionStats[v][roadmaps[v][c].ideas[id].state].n += 1;
                        }
                    }
                }
            }
        }
        html += '</table>';
        for (var vv in versionStats) {
            var nb = Object.keys(versionStats[vv]).length;
            var shtml = '<table class="pxroadmapfilter"><tr class="pxstats pxms '+btoa(vv).replace(/=/g, '')+'">';
            for(var s in versionStats[vv]) {
                shtml += '<td class="pxfilterstate pxfilterstate'+versionStats[vv][s].c+'" state="'+versionStats[vv][s].c+'" width="'+(100/nb)+'%">'+s+' : <strong style="font-size:1.2em;">'+versionStats[vv][s].n+'</strong></td>';
            }
            shtml += '</tr></table>';
            html = shtml + html;
        }
        $('.pxload').hide();
        var prefix;
        $('.roadmap-main').append(html);
        if (!$('#pxskip').length) {
            $('.right--btns .padded-content').prepend('<button id="pxskip" class="btn--small from-tablet" style="float:left"><span class="fa fa-undo"></span> <span>Revenir à l\'interface par défaut</span></button>');
        }
        if (!$('#pxreload').length) {
            $('.right--btns .padded-content').prepend('<button id="pxreload" class="btn--small from-tablet" style="float:left"><span class="fa fa-refresh"></span> <span>Recharger l\'interface qui déchire</span></button>');
        }
        $('.roadmap-column__head-title').append('<input placeholder="IDEA..." class="pxfilter"/>');
        $('.roadmap-column__head-title').click(function(){
            $('.roadmap-column__head-title').css('border-bottom', 'none').css('color', 'black').css('padding', '5px');
            $('.pxfilter').hide().val('');
            $('.pxfilter', this).show().focus();
            $(this).css('border-bottom', '4px solid #25a7d9');
            $('.pxms, .pxidealoaded').hide();
            $('.'+btoa($(this).attr('version')).replace(/=/g, '')).show();
            prefix = btoa($(this).attr('version')).replace(/=/g, '');
        });
        var sectionToShow = 'eq(1)';
        if ($('.roadmap-candidates-section .roadmap-column__body').length) {
            sectionToShow = 'last';
        } else if ($('.roadmap-completed .roadmap-column__body').length) {
            sectionToShow = 'first';
        }
        $('.roadmap-column__head-title:'+sectionToShow).click();
        $('.pxfilter').keyup(function(){
            if ($(this).val()) {
                $('.'+prefix+'.pxidea, .'+prefix+'.pxtitle').hide();
                $('.'+prefix+'.pxidea'+$(this).val()).show();
                $('.'+prefix+'.pxidea'+$(this).val()).prevAll('.pxtitle:first').show();
            } else {
                $('.'+prefix+'.pxidea, .'+prefix+'.pxtitle').show();
            }
            $('.pxidealoaded').hide();
        });
        $('.pxfilterstate').click(function(){
            $('.'+prefix+'.pxidea, .'+prefix+'.pxtitle').hide();
            $('.'+prefix+'.pxidea.pxIdea'+$(this).attr('state')).show();
            $('.'+prefix+'.pxidea.pxIdea'+$(this).attr('state')).each(function(){
                $(this).prevAll('.pxtitle:first').show();
            });
        });
        $('#pxreload').click(function(){
            $('.pxroadmap, .pxroadmapfilter').remove();
            $('.roadmap-column__body').hide();
            $('.pxload').show();
            if (manual) {
                enhanceRoadmap();
                if ($.trim($(this).text()) == 'View candidate cards') {
                    console.log('auto');
                    setTimeout(function(){
                        $('.roadmap-candidates-section .roadmap-column__head-title').click();
                    }, 300);
                }
            }
            manual = false;
        });
        $('div.from-tablet button, .multi-menu a').click(function(){
            $('.pxroadmap, .pxroadmapfilter').remove();
            $('.roadmap-column__body').hide();
            $('.pxload').show();
        });
        $('#pxskip').click(function(){
            manual = true;
            $('.pxroadmap, .pxroadmapfilter').remove();
            $('.roadmap-column__body').show();
            $('.roadmap-column__head-title').css('border', 'none').css('color', 'black').css('padding', '5px');
            $('.pxfilter').remove();
            $('.roadmap-column__head-title').off('click');
        });
        $('.pxideatitle').click(function(){
            if ($(this).parents('tr:first').next().hasClass('pxidealoaded')) {
                $(this).parents('tr:first').next().toggle();
            } else if (!apiKey) {
                $('#apikey').addClass('pxalert');
                $('.main-head__user .multi-menu').addClass('is-active');
                $('.main-head__user .multi-menu__body ul li:first a').css('color', '#25a7d9');
                setTimeout(function(){ $('#apikey').removeClass('pxalert'); }, 2000);
            } else {
                var found = false;
                var num = $(this).attr('num');
                var rnd = Math.random().toString().substring(3, 10);
                $('<tr class="pxidea pxidealoaded"><td></td><td id="pxi'+rnd+'">Chargement...</td></tr>').insertAfter($(this).parents('tr:first'));
                dance:
                for(var r=0; r<apiRoadmaps.length; r++) {
                    for(var c=0; c<apiRoadmaps[r].cards.length; c++) {
                        for(var i=0; i<apiRoadmaps[r].cards[c].pipeline.ideas.length; i++) {
                            if ($(this).text() == apiRoadmaps[r].cards[c].pipeline.ideas[i].title) {
                                var id = apiRoadmaps[r].cards[c].pipeline.ideas[i].id;
                                $.get('https://api.prodpad.com/v1/ideas/'+id+'?expand&apikey='+apiKey).then(function(json){
                                    //console.log(json);
                                    var html = '<table>';
                                    html += '<tr><th width="120">Creator :</th><th style="font-weight:normal">'+(json.creator?json.creator.display_name:'-')+'</th></tr>';
                                    html += '<tr><th>Onwer :</th><th style="font-weight:normal">'+(json.owner?json.owner.display_name:'-')+'</th></tr>';
                                    if (json.description) {
                                        html += '<tr><th>Description :</th><th style="font-weight:normal">'+linkify(json.description)+'</th></tr>';
                                    }
                                    if (json.functional_spec) {
                                        html += '<tr><th>Specifications :</th><th style="font-weight:normal">'+linkify(json.functional_spec)+'</th></tr>';
                                    }
                                    if (json.notes) {
                                        html += '<tr><th>Notes :</th><th style="font-weight:normal">'+linkify(json.notes)+'</th></tr>';
                                    }
                                    if (json.comments && json.comments.length) {
                                        html += '<tr><th>Commentaires :</th><th style="font-weight:normal">';
                                        for(var c=0; c<json.comments.length; c++) {
                                            html += '<div style="margin-bottom:20px">Le <u>'+json.comments[c].created_at + '</u> par <strong>' + json.comments[c].created_by.display_name + '</strong> :<br/>' + linkify(json.comments[c].comment)+'</div>';
                                        }
                                        html += '</th></tr>';
                                    }
                                    if (json.mockups && json.mockups.length) {
                                         html += '<tr><th>Images :</th><th style="font-weight:normal"><a href="/ideas/'+num+'/mockups">Voir l' + (json.mockups.length > 1 ? 'es '+ json.mockups.length +' images' : '\'image') + '</a></th></tr>';
                                    }
                                    html += '</table>';
                                    $('#pxi'+rnd).html(html);
                                }, function() {
                                    $('#pxi'+rnd).html('Erreur ProdPad lors du chargement.&nbsp;&nbsp;<a href="/ideas/'+num+'">Voir le détail de de l\'idée</a>&nbsp;&nbsp;&nbsp;<a href="/ideas/'+num+'" target="_blank">➚</a>');
                                });
                                found = true;
                                break dance;
                            }
                        }
                    }
                }
                if (!found) {
                    $('#pxi'+rnd).html('Cette idée n\'est pas dans l\'api de la roadmap et donc le détail n\'est pas affichable ici.&nbsp;&nbsp;<a href="/ideas/'+num+'">Voir le détail de de l\'idée</a>&nbsp;&nbsp;&nbsp;<a href="/ideas/'+num+'" target="_blank">➚</a>');
                }
            }
        });
    };
    setInterval(function(){
        if ($('.roadmap-column-wrapper').length) {
            if (!$('.pxload').length) {
                $('.roadmap-main').append('<h1 class="pxload">Chargement de l\'interface qui déchire...</h1>');
            }
            if (!$('.pxroadmap').length && !manual) {
                setTimeout(enhanceRoadmap, 1000);
            }
        }
    }, 200);
})();
