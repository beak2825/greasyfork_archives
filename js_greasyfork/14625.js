// ==UserScript==
// @name         WME Mass Unlock
// @namespace    broosgert@gmail.com
// @version      0.1.2
// @description  Mass unlock segemtns on-screen per type
// @author       Broos Gert '2015
// @match        https://editor-beta.waze.com/*editor/*
// @match        https://www.waze.com/*editor/*
// @grant        none
// @icon		 data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAA8KCgsLCw8MDA8WDw0PFhkTDw8TGR4XFxcXFx4eFxoaGhoXHh0iIyQjIh0sLC8vLCw7Ojo6Ozs7Ozs7Ozs7Ozv/2wBDARAPDxESERYSEhYXEhQSFx0YGBgYHScdHR0dHScuJCAgICAkLiotJycnLSozMy4uMzM7Ozo7Ozs7Ozs7Ozs7Ozv/wAARCAAgACADAREAAhEBAxEB/8QAGQABAAIDAAAAAAAAAAAAAAAABQAEAgMH/8QALxAAAgAFAQQHCQAAAAAAAAAAAQIAAwQREiEFFCIxE0FSYXGRoQYjJFFTcoGx4f/EABkBAAMBAQEAAAAAAAAAAAAAAAADBAIFAf/EACsRAAEEAAMGBQUAAAAAAAAAAAEAAgMRBCFBEjEyUXGBBWGRscETIlJyof/aAAwDAQACEQMRAD8A6HAhV6uqMnGXLUNOe+IJsoA5sx+WsKmmEYW2M2ugQW1ElTZp3+sEwDU0q8FvtvmL+OvfCYsS55oN2u1f3NaLG/r3+Eh7PGaadzdjS5fC56tjr/PzeK0pKwIRW0b72Qur9EpC9dlZr/v0jmeIguoN4qBA1NXfuqsPVZ7rq1TVKN528TJQM0DiZjddOvE6RCzFP2BE2286O/smvh19EtsvLdQ5GPSM8xVPUrsWX0MduAH6YvWz6qOTi6UPRbauqSlkma2p5Ig5sx0CjxjckgjaXHReNaXGkFMaYoLscqmewF17V7cPcvIRwnkzSi8y92nx0VzQA3kGjVLy9lU66uZk631XLDy5R2W4aMZ5ur8jajMzvIdArkPS0ftaWfcT9cZJbO2uIZCudh2TEmMYXMBF/adOm9OhNEjnXvuWGyqaYWaqqJYU2VZCnmqga+F/OMYKBzRtyNAceHmAtTvHC0kjXzKTi5TqQIX/2Q==
// @downloadURL https://update.greasyfork.org/scripts/14625/WME%20Mass%20Unlock.user.js
// @updateURL https://update.greasyfork.org/scripts/14625/WME%20Mass%20Unlock.meta.js
// ==/UserScript==

// initialize MassUnlock and do some checks
function MassUnlock_bootstrap() {
    MassUnlock_init();
}

function MassUnlock_init() {
    // Check initialisation
    if (typeof Waze == 'undefined' || typeof I18n == 'undefined') {
        setTimeout(MassUnlock_init, 660);
        console.log('MassUnlock: Waze object unavailable, map still loading');
        return;
    }

    //console.log("unlockObject WAZE: " , Waze);

    // Setting up all variables
    var UpdateObject = require("Waze/Action/UpdateObject"),
        VERSION = '0.1',
        loader = 'data:image/gif;base64,R0lGODlhEAAQAPQAAP///wAAAPj4+Dg4OISEhAYGBiYmJtbW1qioqBYWFnZ2dmZmZuTk5JiYmMbGxkhISFZWVgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH+GkNyZWF0ZWQgd2l0aCBhamF4bG9hZC5pbmZvACH5BAAKAAAAIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAEAAQAAAFUCAgjmRpnqUwFGwhKoRgqq2YFMaRGjWA8AbZiIBbjQQ8AmmFUJEQhQGJhaKOrCksgEla+KIkYvC6SJKQOISoNSYdeIk1ayA8ExTyeR3F749CACH5BAAKAAEALAAAAAAQABAAAAVoICCKR9KMaCoaxeCoqEAkRX3AwMHWxQIIjJSAZWgUEgzBwCBAEQpMwIDwY1FHgwJCtOW2UDWYIDyqNVVkUbYr6CK+o2eUMKgWrqKhj0FrEM8jQQALPFA3MAc8CQSAMA5ZBjgqDQmHIyEAIfkEAAoAAgAsAAAAABAAEAAABWAgII4j85Ao2hRIKgrEUBQJLaSHMe8zgQo6Q8sxS7RIhILhBkgumCTZsXkACBC+0cwF2GoLLoFXREDcDlkAojBICRaFLDCOQtQKjmsQSubtDFU/NXcDBHwkaw1cKQ8MiyEAIfkEAAoAAwAsAAAAABAAEAAABVIgII5kaZ6AIJQCMRTFQKiDQx4GrBfGa4uCnAEhQuRgPwCBtwK+kCNFgjh6QlFYgGO7baJ2CxIioSDpwqNggWCGDVVGphly3BkOpXDrKfNm/4AhACH5BAAKAAQALAAAAAAQABAAAAVgICCOZGmeqEAMRTEQwskYbV0Yx7kYSIzQhtgoBxCKBDQCIOcoLBimRiFhSABYU5gIgW01pLUBYkRItAYAqrlhYiwKjiWAcDMWY8QjsCf4DewiBzQ2N1AmKlgvgCiMjSQhACH5BAAKAAUALAAAAAAQABAAAAVfICCOZGmeqEgUxUAIpkA0AMKyxkEiSZEIsJqhYAg+boUFSTAkiBiNHks3sg1ILAfBiS10gyqCg0UaFBCkwy3RYKiIYMAC+RAxiQgYsJdAjw5DN2gILzEEZgVcKYuMJiEAOwAAAAAAAAAAAA==',
        imglock1 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAcCAYAAAB75n/uAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOwwAADsMBx2+oZAAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAWdEVYdENyZWF0aW9uIFRpbWUAMTIvMDQvMTWj+6ROAAAEw0lEQVRIidWU229UVRTGv3OZM5d2pDO0FBlCp0AbiNAySgEJNg0tFYQYY0hUMNEHBTUqMagx+sQfoCYmvppgoiEQGy5tFcQH0IoQSosRIW2ZFmnrdGin9znXvZYPc2Ys08hAjA+u5GTvs/c+32+fvde3JGZGobh+/fdAYuTPh8dSqbBtWZrfH0hHlkSG6uo2JAt9KxUCnGw9UdvfH+9OJpMYHx/H1NQUHMdBKBRCbU3tzqbG5vaVK1c+OKC1/dTaq1e7YpElkcOlZWUIFhfD5/OBGUin0xgcHER3dxfi/f14asfO1fte3X/jvgHHT7Y8Ojh4u3NbYzMWloah6wZGx0aRnk1DVVUsWLAAZaWlEEQ4d/4cWlpasGnjpvUH3n6nM19LzR+4ebNP7bvZ2/ninpegaSouXPgZp8+cwfDwMIgosytJQjgcRkNDAzY/vglEAkePHrtcX9+gxNbF6J6Ay52XNqx9pAaLyxfjVOsJHP7yMLZubdz1xmtv/rBq1SoDAHp7e7TzP56vP3LkyPdTU5NYX/cYotEKtLW3bo2ti529J2Dg1q2Kp2timJmZQlt7G5qbn9y+75X9p+euqaqqtqqqqs/6/f4t337X/lNV9QpEo1F0dXVvAXAXQM4HpMZS4VBJCPF4HIlEAvnic2PPC3s7dF3/dGJ8EiWhEui67s9fM+8Ppmemg4qiYGJyArKs/JN2LjRNszweDarqARHN2/A8QDqdDhATLMsqKJ6NYPFDsIUNZpYKAkzT9igeP0whwXQKu1zX04FQKAzD0KHrhi9/fp4PNh//4pdoTcPGEdvGUDKJZyorUSTLyOYeM4MAMACDCKcGBlAXiSDlOOgbGMDndbGlTaGyoXmAfv2O/GzvuVsz/Z6lank5wAwWArBtsBBgokyfCOw4gONk+kKALQsggpidhTM6iuf3Nn78SXX9uzlAx1Q8dnDIvJIWAociEZR7PBDMsJhhMsMigsUMgwgGM0y3NYigE2Vad/zi5CTGjx3DZwf2bdy9qOKSCgDfpPo+uHM1hY+amqBKEk5OTICY4QAwiWBnQXNgJhFsABYRTGYYQsCvKHiipARnVq/G18O/Htq9qGKHCgBpEkWSz4eFioK4aeK2ZUGRJDiuYBZgZyHZcSKQbWeOSAhM2zbSy5ZBCQZhCOEHXKNJAIMZAkChzP9jx5qCmcXMkDN5kAEwA3ALWeHEfLBwnccSiEDM/w2AGWCiXH7/DwEu5X6OaNm3vz04QDDLEAISMhnwb0KSJEgAhKutAsBizZdgx0GPYaCuqAgmMxz3yea/6RrKdPuWO295vTl/BGQZmiTBSiRQuiKaANxScWVscNHryemRVDyO3bW1qPJ6/y4Tc0pDtrWI4LhgBwAxQzDDYMaNa9cw3dGBrz58f2ljqGwoV+wuDQ2GXx5Jjs1evJjxBFGumCFb7Bznrncmck0EQJLAtg3f8uV4a/uW5w5G1xzNHREAeGTFeE9Td53Ytq31tmXBJALbNti2QaYJtu2MsCsoyTIgSZA8HkiKAsnjgVpUhM3FxVgXDLbl7iT/Unt6ejRd1/2GYfhM0/RalqXZtu1xHEcVQigAIMsyKYoiVFV1NE2zvF6v6fV6TZ/PZwQCgdnKysqc3l8M9vIwHm7d2QAAAABJRU5ErkJggg==',
        imglock2 = 'data:image/png;base64,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',
        imglock3 = 'data:image/png;base64,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',
        imglock4 = 'data:image/png;base64,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',
        imglocks = [imglock1,imglock2,imglock3,imglock4],
        strt = '',
        fwy_lvl = 4, rmp_lvl = 4, maj_lvl = 3, min_lvl = 2, pri_lvl = 1,
        fwy_cnt = 0, rmp_cnt = 0, maj_cnt = 0, min_cnt = 0, pri_cnt = 0,
        absolute = false,
        unlockObject = null,
        userlevel = Waze.loginManager.user.normalizedLevel,
        unlockTab = document.createElement('li'),
        userInfo = document.getElementById('user-info'),
        navTabs = userInfo.querySelector('.nav-tabs'),
        tabContent = userInfo.querySelector('.tab-content'),
        unlockContent = document.createElement('div'),
        unlockTitle = document.createElement('h3'),
        unlockSubTitle = document.createElement('h4'),
        unlockScanbutton = document.createElement('input'),
        includeAllSegments = document.createElement('input'),
        includeAllSegmentsLabel = document.createElement('label'),
        resultsCntr = document.createElement('div'),
        hidebutton = document.createElement('div'),
        dotscntr = document.createElement('div'),
        readable = {'pri':'Primary Streets (L2)','min':'Minor Highways (L3)', 'maj':'Major Highways (L4)',  'rmp':'Ramps (L5)', 'fwy':'Freeways (L5)'},
        revertButton = document.createElement('input'),
        percentageLoader = document.createElement('div');

    // Begin building
    unlockContent.id = 'sidepanel-unlockTab';
    unlockContent.className = 'tab-pane';
    unlockTitle.appendChild(document.createTextNode('Unlock segments'));
    unlockTitle.style.cssText = 'margin-bottom:0';
    unlockTab.innerHTML = '<a href="#sidepanel-unlockTab" data-toggle="tab" title="Mass unlock segments">Un - <span class="fa fa-lock"></span></a>';

    // fill tab
    dotscntr.style.cssText = 'width:16px;height:16px;margin-left:5px;background:url("'+ loader + '");display:none';
    dotscntr.id = 'unlockLoader';
    unlockSubTitle.innerHTML = 'Results';
    includeAllSegments.type = 'checkbox';
    includeAllSegments.name = "name";
    includeAllSegments.value = "value";
    includeAllSegments.id = "_allSegments"; 
    includeAllSegments.onclick = function() { scanArea(); };
    includeAllSegmentsLabel.htmlFor = "_allSegments";
    includeAllSegmentsLabel.innerHTML = 'Include higher locked segments';
    includeAllSegmentsLabel.style.cssText = 'font-size:85%;margin-left:5px;vertical-align:middle';
    unlockScanbutton.type = 'button';
    unlockScanbutton.value = 'Rescan area';
    unlockScanbutton.style.cssText = 'margin: 10px 3px 0 0';
    unlockScanbutton.onclick = function() { scanArea(); };
    revertButton.type = 'button';
    revertButton.id = 'revertButton';
    revertButton.style.cssText = 'margin: 10px 3px 0 0;display:none';
    revertButton.value = 'Revert changes';
    revertButton.onclick = function() { revertChanges(); };
    percentageLoader.id = 'percentageLoader';
    percentageLoader.style.cssText = 'width:1px;height:10px;background-color:green;margin-top:10px;border:1px solid:#333333;display:none';

    // add to stage
    navTabs.appendChild(unlockTab);
    tabContent.appendChild(unlockContent);
    unlockContent.appendChild(unlockTitle);
    unlockContent.appendChild(includeAllSegments);
    unlockContent.appendChild(includeAllSegmentsLabel);
    unlockContent.appendChild(unlockSubTitle);
    unlockContent.appendChild(resultsCntr);
    unlockContent.appendChild(revertButton);
    unlockContent.appendChild(dotscntr);
    unlockContent.appendChild(percentageLoader);    

    // Functions ....
    function onScreen(obj) {
        if (obj.geometry) {
            return(Waze.map.getExtent().intersectsBounds(obj.geometry.getBounds()));
        }
        return(false);  
    }

    function getId(node) {
        return document.getElementById(node); 
    }

    function unlockSegments(type, newlvl) {
        var objects = unlockObject[type];
        var _i = 0;

        // update GUI
        function RunLocal() {
            Waze.model.actionManager.add(new UpdateObject(objects[_i] , {lockRank: newlvl}));
            _i++;

            if (_i < objects.length) {
                setTimeout(RunLocal, 1);
                var newWidth = (_i / objects.length) * $('#sidepanel-unlockTab').css('width').replace('px', '');
                $('#unlockLoader').css('display', 'inline-block');
                $('#revertButton').css('display', 'inline-block');
                $('#percentageLoader').show();
                $('#percentageLoader').css('width', newWidth + 'px');
            } else {
                $('#unlockLoader').css('display', 'none');
                $('#percentageLoader').css('display', 'none');
                $('#percentageLoader').hide('slow');
            }
        }
        RunLocal();
    }

    function revertChanges() {
        $('#unlockLoader').css('display', 'inline-block');
        var changes = Waze.model.actionManager.getActions();
        var _i = changes.length;

        // update GUI
        function RunLocal() {
            Waze.model.actionManager.undo();
            _i--;
            var newWidth = (_i / changes.length) * $('#sidepanel-unlockTab').css('width').replace('px', '');
            $('#percentageLoader').show();
            $('#percentageLoader').css('width', newWidth + 'px');

            if (_i > 0) {
                setTimeout(RunLocal, 1);
            } else {
                $('#unlockLoader').hide('fast');
                $('#revertButton').hide('fast');
                $('#percentageLoader').hide('fast');
            }
        }
        RunLocal();
    }


    // The large scan function
    function scanArea() {
        // Object with array of roadtypes, to collect each wrongly locked segment, for later use        
        unlockObject = {'pri':[], 'min':[], 'maj':[], 'rmp':[], 'fwy':[]};
        var foundBadlocks = false;
        var count = 0;

        if (Waze.map.zoom >= 3) {
            // Do a count on how many segments ther are per type (limit to 150 to save CPU)
            $.each(Waze.model.segments.objects, function( k, v ) {
                if (count < 150 && v.type == "segment" && onScreen(v) && v.isGeometryEditable()) {
                    strt = Waze.model.streets.get(v.attributes.primaryStreetID);
                    // Primary (Lock 2)
                    if (v.attributes.roadType == 2) {
                        if (v.attributes.lockRank == pri_lvl) {
                            unlockObject.pri.push(v);
                            foundBadlocks = true;
                            count++;
                        }
                        if (v.attributes.lockRank > pri_lvl && includeAllSegments.checked) {
                            unlockObject.pri.push(v);
                            foundBadlocks = true;
                            count++;
                        }
                    }
                    // Minor Highway
                    if (v.attributes.roadType == 7) {
                        if (v.attributes.lockRank == min_lvl) {
                            unlockObject.min.push(v);
                            foundBadlocks = true;
                            count++;
                        }
                        if (v.attributes.lockRank > min_lvl && includeAllSegments.checked) {
                            unlockObject.min.push(v);
                            foundBadlocks = true;
                            count++;
                        }                    
                    }
                    // Major Highway
                    if (v.attributes.roadType == 6) {
                        if (v.attributes.lockRank == maj_lvl) {
                            unlockObject.maj.push(v);
                            foundBadlocks = true;
                            count++;
                        }
                        if (v.attributes.lockRank > maj_lvl && includeAllSegments.checked) {
                            unlockObject.maj.push(v);
                            foundBadlocks = true;
                            count++;
                        }                    
                    }
                    // Ramps Highway
                    if (v.attributes.roadType == 4) {
                        if (v.attributes.lockRank == rmp_lvl) {
                            strt = Waze.model.streets.get(v.attributes.primaryStreetID);
                            unlockObject.rmp.push(v);
                            foundBadlocks = true;
                            count++;
                        }
                        if (v.attributes.lockRank > rmp_lvl && includeAllSegments.checked) {
                            strt = Waze.model.streets.get(v.attributes.primaryStreetID);
                            unlockObject.rmp.push(v);
                            foundBadlocks = true;
                            count++;
                        }                    
                    }
                    // Ramps Highway
                    if (v.attributes.roadType == 3) {
                        if (v.attributes.lockRank == fwy_lvl) {
                            unlockObject.fwy.push(v);
                            foundBadlocks = true;
                            count++;
                        }
                        if (v.attributes.lockRank > fwy_lvl && includeAllSegments.checked) {
                            unlockObject.fwy.push(v);
                            foundBadlocks = true;
                            count++;
                        }                    
                    }

                }
            });

            // Build result to users tabpanel
            resultsCntr.innerHTML = '';
            var lvlCnt = 2; // start at 2 (pri) because we can't unlock lower then 1 :-)

            $.each(unlockObject, function( key, value ) {
                var __cntr = document.createElement('div'),
                    __keyLeft = document.createElement('div'),
                    __cntRight = document.createElement('div'),
                    __cleardiv = document.createElement("div"),
                    __actiondiv = document.createElement("div");

                // Building...
                __keyLeft.style.cssText = 'float:left';
                __keyLeft.innerHTML = readable[key];
                __cntRight.style.cssText = 'float:right';
                __cntRight.innerHTML =  ((value.length !==0) ? '<span style="font-weight:bold">'+value.length+'</span>' : '-');
                __cntRight.id = 'cnt_'+key;
                __cleardiv.style.cssText ='clear:both;';
                __actiondiv.style.cssText = 'border:1px solid #FFBB00;background:#FFE599;color:#664C00;border-radius:0 5px 5px 5px;padding:3px;';

                // Add to stage...
                __cntr.appendChild(__keyLeft);
                __cntr.appendChild(__cntRight);
                __cntr.appendChild(__cleardiv);

                //if (lvlCnt <= userlevel && value.length != 0) {
                if (value.length !== 0) {
                    $.each(imglocks, function( _key, _lockimg ) {
                        if (_key < (lvlCnt-1)) {
                            var __lock = document.createElement("div");
                            __lock.style.cssText = 'display:inline-block;background:url('+ _lockimg +');width:24px;height:28px;margin:0 10px;cursor:pointer;';
                            __lock.onclick = function() {
                                unlockSegments(key, (_key)); 
                            };
                            __actiondiv.appendChild(__lock);
                        }      
                    });
                    __cntr.appendChild(__actiondiv);
                }
                resultsCntr.appendChild(__cntr);
                lvlCnt++;
            });
        } // if at allowed zoom...
        else
        {
            resultsCntr.innerHTML = '<div style="font-weight:bold;color:red;">Function disabled at zoom level 1 & 2</div>';
        }
    }

    // Do a default scan once at startup
    scanArea();

    // Register some eventlisteners
    Waze.map.events.register("moveend", null, scanArea);
    Waze.model.actionManager.events.register("afteraction", null, scanArea);
    Waze.model.actionManager.events.register("afterundoaction", null, scanArea);
    Waze.model.actionManager.events.register("noActions", null, scanArea);
}
setTimeout(MassUnlock_bootstrap, 2000);