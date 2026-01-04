// ==UserScript==
// @name         Kibana improvements
// @namespace https://greasyfork.org/users/887711
// @match       *://*/app/data-explorer*
// @grant       none
// @version     1.7
// @author      -
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @description improvements
// @downloadURL https://update.greasyfork.org/scripts/441539/Kibana%20improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/441539/Kibana%20improvements.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var checkLevel = function(t, txt){
        return $(t).find('td').filter(function() {
            return $(this).text().trim() === txt;
        }).length;
    };

    var colors = function() {
        var elements = $('.osd-table').first().children('tbody').children('tr');
        elements.each(function() {
            if(checkLevel(this,'WARN')){
                $(this).css("background-color","#fff14c4f");
            }
            if(checkLevel(this,'ERROR')){
                $(this).css("background-color","#ff544c4f");
            }
            if(checkLevel(this,'DEBUG')){
                $(this).css("background-color","#4954ff29");
            }
            if(checkLevel(this,'TRACE')){
                $(this).css("background-color","#49ff9429");
            }
        });
    }

    var highlightFields = function() {
        var elements = $('.sidebar-list').children('.euiSplitPanel__inner').find('div');
        elements.each(function() {
            if($(this).attr("data-attr-field") == "kubernetes.namespace_name" ||
               $(this).attr("data-attr-field") == "kubernetes.pod_name" ||
               $(this).attr("data-attr-field") == "kubernetes.container_name" ||
               $(this).attr("data-attr-field") == "level" ||
               $(this).attr("data-attr-field") == "loggerName" ||
               $(this).attr("data-attr-field") == "threadName" ||
               $(this).attr("data-attr-field") == "aggregateId" ||
               $(this).attr("data-attr-field") == "stackTrace" ||
               $(this).attr("data-attr-field") == "message"
              ){
                $(this).css("background-color","#ffd99f");
            }
        });
    }


    var setColumns = function() {
        var bar = $('.globalFilterGroup__filterBar');
        var filter = $('.globalFilterBar__addButton').first().clone();
        filter.find('.euiButtonEmpty__text').text("SetCols");
        filter.click(function() {
            var replaceStr = "columns:!(kubernetes.namespace_name,kubernetes.pod_name,kubernetes.container_name,level,loggerName,message)"
            var url = window.location.href.replace(/columns:!\(.*?\)/, replaceStr);
            window.location.href = url;
        });
        filter.appendTo(bar);
    }

    var setColumnsAxon = function() {
        var bar = $('.globalFilterGroup__filterBar');
        var filter = $('.globalFilterBar__addButton').first().clone();
        filter.find('.euiButtonEmpty__text').text("SetColsAxon");
        filter.click(function() {
            var replaceStr = "columns:!(kubernetes.pod_name,kubernetes.container_name,level,logger,message)"
            var url = window.location.href.replace(/columns:!\(.*?\)/, replaceStr);
            window.location.href = url;
        });
        filter.appendTo(bar);
    }

    // negate can either be f for false or t for true
    var addExtraFilter = function(name, key, value, negate = "f") {
        var bar = $('.globalFilterGroup__filterBar');
        var filter = $('.globalFilterBar__addButton').first().clone();
        filter.addClass("extra-button");
        filter.find('.euiButtonEmpty__text').text("+ " + name);
        filter.click(function() {
            var val = value;
            if (val == "!PROMPT!") {
              val = prompt("Enter container name");
            }
            var filterIndex = window.location.href.lastIndexOf('filters:!')+10;
            var filterStr = "('$state':(store:appState),meta:(alias:!n,disabled:!f,key:"+key+",negate:!"+negate+",params:(query:"+val+"),type:phrase),query:(match_phrase:("+key+":"+val+")))"
            if (window.location.href[filterIndex] != ")"){  // if this is not the first filter
                filterStr = filterStr + ","
            }
            var url = window.location.href.slice(0,filterIndex)
                + filterStr
                + window.location.href.slice(filterIndex);
            window.location.href = url;
        });
        filter.appendTo(bar);
    }

    var addExtraTextFilter = function(name, textFilter) {
        var bar = $('.globalFilterGroup__filterBar');
        var filter = $('.globalFilterBar__addButton').first().clone();
        filter.addClass("extra-button");
        filter.find('.euiButtonEmpty__text').text("+ " + name);
        filter.click(function() {
            var textarea = document.querySelector(".osdQueryBar__textarea");
            const eventKey = Object.keys(textarea).find(key => key.startsWith('__reactEventHandlers$'));
            const reactProps = textarea[eventKey];
            reactProps.onChange({ target: { value: textFilter } }); // Simulate React state update
        });
        filter.appendTo(bar);
    }

    var waitForElem = function(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    var attachExtraFeatures = function() {
        waitForElem('.dscSidebarField').then((elm) => { // wait for any field to be present
            highlightFields();
        });
        waitForElem('.globalFilterGroup__filterBar').then((elm) => {
            setColumns();
            setColumnsAxon();
            addExtraFilter("KU ns", "kubernetes.namespace_name", "ku-");
            addExtraFilter("Axon ns", "kubernetes.namespace_name", "ku-axon");
            addExtraTextFilter("Axon filters", 'not logger:"io.axoniq.axonserver.message.event.EventDispatcher" and not logger:"io.axoniq.axonserver.cluster.replication.file.Synchronizer" and not logger:"io.axoniq.axonserver.logging.TopologyEventsLogger" and not logger:"io.axoniq.axonserver.grpc.DefaultClientIdRegistry"');
            addExtraFilter("NS", "kubernetes.namespace_name", "!PROMPT!");
            addExtraFilter("Cont", "kubernetes.container_name", "!PROMPT!");
            addExtraFilter("Msg", "message", "!PROMPT!");
            addExtraFilter("AS", "kubernetes.container_name", "axon-server");
            addExtraFilter("!INFO", "level", "INFO", "t");
            addExtraFilter("Level", "level", "!PROMPT!");
        });
        waitForElem('.dscCanvas').then((elem) => {
          $(".dscCanvas").scroll(() => {
            colors();
          });
        });
    }

    var attachExtraFeaturesIfNotPresent = function() {
      // if we have already added some extra buttons, then don't add them again
      if ($('.extra-button').first().length == 0) {
        console.log("attaching extra features");
        attachExtraFeatures();
      }

      waitForElem('.globalFilterGroup__filterBar').then((elm) => {
        setTimeout(function(){
        // we try to add the features after a second because sometimes they disappear
        attachExtraFeaturesIfNotPresent();
        }, 1000);
      });
    }

    $(window).ready(function() {
      attachExtraFeaturesIfNotPresent();
    });
})();