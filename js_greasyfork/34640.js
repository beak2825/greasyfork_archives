// ==UserScript==
// @name         worker.mturk updater
// @namespace    saqfish
// @version      0.1
// @description  Scrape right on the site
// @author       saqfish
// @match        https://worker.mturk.com/projects*
// @require     http://code.jquery.com/jquery-3.1.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34640/workermturk%20updater.user.js
// @updateURL https://update.greasyfork.org/scripts/34640/workermturk%20updater.meta.js
// ==/UserScript==

(function() {
    'use strict';
        var oldhits, runs =0;
        var Main = {
            numHits: 30, rewardAmount: 0.01, setMasters : false, setQualified: true, sortType: 'updated_desc', mturkURL:"https://worker.mturk.com/",
            refreshDelay : 1, results :null, _template : null, _header : null, _tags: null,
            getQueries: function(a){
                var result = {};
                console.log(a);
                a.split("&").forEach(function(part) {
                    var item = part.split("=");
                    result[decodeURIComponent(item[0])] = decodeURIComponent(item[1]);
                });
                return result;
            },
            load: ()=>{
                var _worker = { url: $(location).attr('href')};
                var _queries= Main.getQueries(_worker.url);
                console.log(_queries);
                Main.rewardAmount = _queries['filters[min_reward]'];
                Main.setMasters = _queries['filters[masters]'];
                Main.setQualified = _queries['filters[qualified]'];
                Main.sortType = _queries.sort;
              //  Main. = _queries.;
                Main._tags = { results : 'ol.table-frame.hit-set-table', requester: ".4.1:$0.0.$requester0.0.1" ,title: ".4.1:$0.0.$title1", tasks:".4.1:$0.0.$tasksRemaining2", rewardAmount: ".4.1:$0.0.$rewardAmount3", preview: ".4.1:$0.0.$actions5.0.0", accept: ".4.1:$0.0.$actions5.0.1.0"};
                Main.results = $(Main._tags.results);
                Main._template = $(Main.results.find('li')[1]).clone();
                Main._header = $(Main.results.find('li')[0]).clone();
                $('div.projects-controls').append('<div id="tingScrape"><label class="m-b-0 items-per-page-container"><span class="supportive-label m-r-sm">Update:</span> <span id="scrapeSpan" class="accept-qualify-container"><a id="scrapeButton" class="btn work-btn hidden-sm-down" >GO</a></span></div>');
                $('#scrapeButton').click(function() {
                   $('div.projects-controls').children().not('#tingScrape').remove();
                    $('.mturk-pagination').remove();
                    var ting = $(scrapeSpan);
                    var ting2 = $(this);
                    if(!Scraper.scraping){
                        ting.removeClass('accept-qualify-container');
                        ting2.addClass('btn btn-secondary');
                        ting2.text('STOP');
                    Scraper.start();
                    }else{
                        ting.addClass('accept-qualify-container');
                        ting2.text('GO');
                        Scraper.stop();
                    }

                });
            }

        };
        var Scraper = {
            scraping: false, sInterval : null, highInterval : null, resultTable : null,
            start: function(){
                Scraper.scraping = true;
                Scraper.sInterval = setInterval(function(){
                    Scraper.scrape(Main.numHits, Main.rewardAmount, Main.setMasters, Main.setQualified, Main.sortType, Main.mturkURL);
                }, Main.refreshDelay*1000);
            },
            stop: function(){
                Scraper.scraping = false;
                clearInterval(Scraper.sInterval);
            },
            scrape: function(numHits,rewardAmount,setMasters, setQualified, sortType, mturkURL){
                $.getJSON( mturkURL, {
                    'filters[search_term]': '',
                    'page_size' : numHits,
                    'filters[qualified]': setQualified,
                    'filters[masters]': setMasters,
                    'sort': sortType,
                    'filters[min_reward]': rewardAmount,
                })
                    .done(function( data ) {
                    var idz = Array();
                    $.each(data.results,function (i,v){
                        idz[i] = sit(v.requester_id);
                    });
                    if(Main.showTO)
                        Scraper.getTO(idz,data);
                    else
                        Scraper.format(data);
                });
            },
            format: function(data){
                var found = false;
                var results = Main.results;
                var _header = Main._header;
                if(runs < 1){
                    oldhits = data;
                    results.empty();
                    results.append(_header);
                }
                $.each(data.results,(e,v)=>{
                    var hit = data.results[e];
                    for(var eye = 0, len = oldhits.results.length; eye < len; eye++) {
                        if (oldhits.results[eye].hit_set_id === hit.hit_set_id){
                            found = true;
                        }
                    }
                    if(!found){
                        var _template = Main._template.clone();
                        _template.find(`span[data-reactid="${Main._tags.title}"]`).text(hit.title);
                        _template.find(`a[data-reactid="${Main._tags.requester}"]`).text(hit.requester_name);
                        _template.find(`a[data-reactid="${Main._tags.requester}"]`).attr('href',hit.requester_url);
                        _template.find(`span[data-reactid="${Main._tags.tasks}"]`).text(hit.assignable_hits_count);
                        _template.find(`span[data-reactid="${Main._tags.rewardAmount}"]`).text(hit.monetary_reward.amount_in_dollars);
                        _template.find(`span[data-reactid="${Main._tags.preview}"]`).attr('href',hit.project_tasks_url);
                        _template.find(`span[data-reactid="${Main._tags.accept}"]`).attr('href',hit.accept_project_task_url);
                        _header.after(_template);
                    }
                });

                oldhits = data;
                runs++;
            }
        };
        function sit(ting){
            var ting2 = JSON.stringify(ting).replace(/\"/g, "");
            return ting2;
        }
        Main.load();
})();