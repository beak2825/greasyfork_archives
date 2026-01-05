// ==UserScript==
// @name         WME LevelReset - USA
// @namespace    https://greasyfork.org/users/23100
// @version      2019.05.11.01
// @description  Script version of the WME LevelReset tool, to make relocking segments to their appropriate lock level easy & quick.
// @author       Broos Gert '2015 / Blaine "herrchin" Kahle
// @include             https://www.waze.com/editor*
// @include             https://www.waze.com/*/editor*
// @include             https://beta.waze.com/*
// @exclude             https://www.waze.com/*user/*editor/*
// @grant        none
// @icon		 data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAA+VBMVEX///93PgHX19fTgQfFZgLLcwTrxYDDgA3nqBj5+fmwr6+Yl5f8/PzExMTl5eX114vv7+/e3t68vLzOzs6saRKARQSLTgeioqK2tbX72XfU1NT515fxz4b54b3RmySYWAv31aTpwIHgrn9/f3/75qPZsEvuuC/utx3psVP13KizbhXuuVj745bfoEzzwzDxwDXTjknpxqDPfhzWih7PhUaObErowqDJchrmqCfprRjbmUvblCLZjAv71WnhnyTfmA7hrmbjsm7qxpPv06vYljj305776MvLkD3XkjFwcHCMi4v6zk/6z1P2wVDYqzr3y3j2xWnrrl761X3u0VhGAAABv0lEQVQ4jZWTXXuaMBiGY7bZQUhIoBaKsIK0KkVqtd+2tJ2gnVJs9f//mAW78uHYwe6TXE+em/flJAD8D0RVdF3HTKqvGcaMAiAQVYd1vaEASikhhFKA1ZoeA8Iwct2lCAnAxl/zdcAMbeGipbtwMQM62xFEFUJtoWEIsbh0CVTF3QGqqrjax2cq4kkkFQFjTJD2eYeXBoa4uoEoBOU/RhBUWHWHJukUCZ9JQFCnWkVAQJRQniREyvGPANA/YzazRhBKwjSOg+DZmdoRZ+r8XAfxr5eo1AfzuW1HljXfYkX2zJ5b8TQXXtbWzPff38x2hvn27qf+zFrHubC39tppGoabjczZHIZpmra9/jgXTn2vnSTJaxgecsLwNRkmsueflgV5eLZarU4y+Lk6G9YIg8HxB4PBYEfY3woZQ0529rjQ3y+Evid3ez9K9LpmWTjqe2b3Ti5xlwlHhRDYzdvvFW5NOyiEAy48Pu2VeHps2sFBIUwi5/6hWeLh3okmhdCajJyLLxUunNGktS0lgdLW+agz/lZh3Bmdt6ggZS/NUBqX152brxVuOteXDZVRafsUrxq1XGHIBb6CwHoY4Tt+A1eiQ8S/AAv7AAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/16410/WME%20LevelReset%20-%20USA.user.js
// @updateURL https://update.greasyfork.org/scripts/16410/WME%20LevelReset%20-%20USA.meta.js
// ==/UserScript==

function LevelReset_init() {
    // versioning
    var LevelResetUSAversion = '2019.05.11.01';
    var LRUSAchanges = 'LevelReset - USA has been updated to version ' + LevelResetUSAversion + '\n';
    LRUSAchanges += 'Changes:\n';
    LRUSAchanges += '[*] fixed logging bug\n';

    if (window.localStorage &&
		    ('undefined' === window.localStorage.LevelResetUSAversion ||
		     window.localStorage.LevelResetUSAversion !== LevelResetUSAversion))
    {
	    alert(LRUSAchanges);
	    window.localStorage.LevelResetUSAversion = LevelResetUSAversion;
    }

    // Check initialisation
    if (document.getElementById('user-info') == null) {
      setTimeout(LevelReset_init, 500);
      console.log('user-info element not yet available, page still loading');
      return;
    }
    if (typeof W.loginManager == 'undefined') {
        setTimeout(LevelReset_init, 300);
        console.log('LevelReset: W object unavailable, map still loading');
        return;
    }
    if (!W.loginManager.user) {
      W.loginManager.events.register('login', null, init);
      W.loginManager.events.register('loginStatus', null, init);
      // Double check as event might have triggered already
      if (!W.loginManager.user) {
        return;
      }
    }

    // handle switching to and from Event mode
    if (W.app.modeController) {
      W.app.modeController.model.bind('change:mode', function(model, modeId) {
        if (modeId == 0) {
          setupTab(relockContent);
        }
      });
    }

    // Setting up all variables
    var UpdateObject = require("Waze/Action/UpdateObject"),
        loader = 'data:image/gif;base64,R0lGODlhEAAQAPQAAP///wAAAPj4+Dg4OISEhAYGBiYmJtbW1qioqBYWFnZ2dmZmZuTk5JiYmMbGxkhISFZWVgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH+GkNyZWF0ZWQgd2l0aCBhamF4bG9hZC5pbmZvACH5BAAKAAAAIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAEAAQAAAFUCAgjmRpnqUwFGwhKoRgqq2YFMaRGjWA8AbZiIBbjQQ8AmmFUJEQhQGJhaKOrCksgEla+KIkYvC6SJKQOISoNSYdeIk1ayA8ExTyeR3F749CACH5BAAKAAEALAAAAAAQABAAAAVoICCKR9KMaCoaxeCoqEAkRX3AwMHWxQIIjJSAZWgUEgzBwCBAEQpMwIDwY1FHgwJCtOW2UDWYIDyqNVVkUbYr6CK+o2eUMKgWrqKhj0FrEM8jQQALPFA3MAc8CQSAMA5ZBjgqDQmHIyEAIfkEAAoAAgAsAAAAABAAEAAABWAgII4j85Ao2hRIKgrEUBQJLaSHMe8zgQo6Q8sxS7RIhILhBkgumCTZsXkACBC+0cwF2GoLLoFXREDcDlkAojBICRaFLDCOQtQKjmsQSubtDFU/NXcDBHwkaw1cKQ8MiyEAIfkEAAoAAwAsAAAAABAAEAAABVIgII5kaZ6AIJQCMRTFQKiDQx4GrBfGa4uCnAEhQuRgPwCBtwK+kCNFgjh6QlFYgGO7baJ2CxIioSDpwqNggWCGDVVGphly3BkOpXDrKfNm/4AhACH5BAAKAAQALAAAAAAQABAAAAVgICCOZGmeqEAMRTEQwskYbV0Yx7kYSIzQhtgoBxCKBDQCIOcoLBimRiFhSABYU5gIgW01pLUBYkRItAYAqrlhYiwKjiWAcDMWY8QjsCf4DewiBzQ2N1AmKlgvgCiMjSQhACH5BAAKAAUALAAAAAAQABAAAAVfICCOZGmeqEgUxUAIpkA0AMKyxkEiSZEIsJqhYAg+boUFSTAkiBiNHks3sg1ILAfBiS10gyqCg0UaFBCkwy3RYKiIYMAC+RAxiQgYsJdAjw5DN2gILzEEZgVcKYuMJiEAOwAAAAAAAAAAAA==',
        strt = '',
        userlevel = W.loginManager.user.normalizedLevel,
        //userlevel = 6, // for testing purposes (this does not enable you to lock higher!)
	locklevels = {
		'str' : 0,
		'pri' : 1,
		'min' : 2,
		'maj' : 3,
		'rmp' : 4,
		'fwy' : 4,
	};
        absolute = false,
        fwy_cnt = 0,
        rmp_cnt = 0,
        maj_cnt = 0,
        min_cnt = 0,
        pri_cnt = 0,
        str_cnt = 0,
        relockObject = null,
        relockTitle = document.createElement('h3'),
        relockSubTitle = document.createElement('h4'),
        relockAllbutton = document.createElement('input'),
        lvlSetTitle = document.createElement('h4'),
        priLvlSet = document.createElement('input'),
        priLvlSetLabel = document.createElement('label'),
        minLvlSet = document.createElement('input'),
        minLvlSetLabel = document.createElement('label'),
        majLvlSet = document.createElement('input'),
        majLvlSetLabel = document.createElement('label'),
        rmpLvlSet = document.createElement('input'),
        rmpLvlSetLabel = document.createElement('label'),
        fwyLvlSet = document.createElement('input'),
        fwyLvlSetLabel = document.createElement('label'),
        relockSub = document.createElement('p'),
        versionTitle = document.createElement('p'),
        resultsCntr = document.createElement('div'),
        alertCntr = document.createElement('div'),
        hidebutton = document.createElement('div'),
        dotscntr = document.createElement('div'),
        includeAllSegments = document.createElement('input'),
        includeAllSegmentsLabel = document.createElement('label'),
        saveLockLevelsBox = document.createElement('input'),
        saveLockLevelsBoxLabel = document.createElement('label'),
        percentageLoader = document.createElement('div'),
        readable = {'str':'Streets (L1)', 'pri':'Primary Streets','min':'Minor Highways', 'maj':'Major Highways',  'rmp':'Ramps', 'fwy':'Freeways'};


    relockTitle.appendChild(document.createTextNode('Relock segments'));
    relockTitle.style.cssText = 'margin-bottom:0';

    // fill tab
    relockSub.innerHTML = 'Your on-screen area is automatically scanned when you load or pan around. Pressing the lock behind each type will relock only those results, or you can choose to relock all.<br/><br/>You can only relock segments lower or equal to your current editor level. Segments locked higher than normal are left alone.';
    relockSub.style.cssText = 'font-size:85%;padding:15px;border:1px solid red;border-radius:5px;position:relative';
    relockSub.id = 'sub';
    hidebutton.style.cssText ='cursor:pointer;width:16px;height:16px;position:absolute;right:3px;top:3px;background-image:url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAWdEVYdENyZWF0aW9uIFRpbWUAMTEvMjAvMTVnsXrkAAADTUlEQVQ4jW2TW0xbZQCAv3ODnpYWegEGo1wKwzBcxAs6dONSjGMm3kjmnBqjYqLREE2WLDFTIBmbmmxRpzHy4NPi4zRLfNBlZjjtnCEaOwYDJUDcVqC3UzpWTkt7fp80hvk9f/nePkkIwWb+gA5jMXLQjK50Zc2cuKVp4wlX2UevtAYubnal/waWoTI1N38keu7ck2uTl335ZFJCkpE8XlGob4ibgeZvMl7P8MtdO6/dFohDe/Sn0LdzJ457MuHfUYqLkYtsSIqMJASyIiNv30Gm6+G1zNbqvpf6gqF/AwaUXx+/MDdz6KArH4ujVVRAbgPVroMsQz6P6nJiGUnUGj/pR/tTyx2dtW+11t2UAa5Pz34w//GHLitpsG1wkODp0xQ11GOZJpgmzq5uqo8ew76zAxFPUDJxscwzFR4BkGfh/tj58/3Zq9OoFZU0PHsAd00NnWNj6IEApd3duA48g2nXKenpQSl1oceWsUeuPfdp+M9GZf/zA5+lz3x9lxRbAUli+dIlKnt7Ud1uCk1NJH0+VnMmq6EQfw0NUzCSULBQfT4HVf4iNRO50VlIGSi6jup0sj5zlTO7d9N48iRLa2vkCwWsyTArbx/GAaSBm/MLyLm85OjZs0c2zawQsoRmt5NeXCRyeRLh9rBkGBSEwF6i09h+L96GemyAx2bDK4ENkGRJkbM2fVy4PRhT08RmZvH09VE29C6ixEFuahL3hklLby9PhEKUt7VRZln4kHD669Bqtl6Q7W07jqWL9FQiEkHTdUoGBsgXF5EPh0m8M8Tc62/CSoLSqmqaR4ZxaRpenxfbgw8lCy2Nx5Uv3xuNXEll7shO/HI38Rjr09NImkriyCgOy0JZTZM4+x3C7SY+epTaLZWsdwXJPNV/6jF/9ReSEIKzmcKWpbHPF9OHDxUr6xksoAiQJAmnpuEWAqeq4G9uRr7nPpZeeDG10NqybV+5Ly4DPGJXlsv79u51v38iK22/EwmwACEEIpdD2tjApmncan8A49XX4qtNgeC+cl/8tpm+jxoBY+K3N7I/jj+dvxKuIhZV7KpKWV295dy1K6YEg1/NO2wj+/210f+98R9+hub0wo1BOZnslRVV16orf0hVeD55HH7d7P4N0V1gY9/zcaEAAAAASUVORK5CYII=\');'; 
    hidebutton.onclick = function() {
        localStorage.LevelResetUSAmsgHide = 1;
        $('#sub').hide('slow');
    };
    dotscntr.style.cssText = 'width:16px;height:16px;margin-left:5px;background:url("'+ loader + '");vertical-align:text-top;display:none';
    dotscntr.id = 'dotscntr';
    relockSubTitle.innerHTML = 'Results';
    versionTitle.innerHTML = 'Version ' + LevelResetUSAversion;
    versionTitle.style.cssText = 'margin:2px;font-size:85%;font-weight:bold';
    relockAllbutton.type = 'button';
    relockAllbutton.value = 'Relock All';
    relockAllbutton.style.cssText = 'margin: 10px 3px 0 0';
    relockAllbutton.onclick = function() {
        relockAll();
    };

    // Also reset higher locked segments?
    includeAllSegments.type = 'checkbox';
    includeAllSegments.name = "name";
    includeAllSegments.value = "value";
    includeAllSegments.id = "_allSegments";
    includeAllSegments.onclick = function() {
        scanArea();
        relockShowAlert();
    };
    includeAllSegmentsLabel.htmlFor = "_allSegments";
    includeAllSegmentsLabel.innerHTML = 'Also reset higher locked segments';
    includeAllSegmentsLabel.style.cssText = 'font-size:95%;margin-left:5px;vertical-align:middle';

    // Save manually-set lock levels?
    saveLockLevelsBox.type = 'checkbox';
    if (localStorage.LevelResetUSAsaveLocks == 1) { saveLockLevelsBox.checked = true; }
    saveLockLevelsBox.id = '_saveLockLevelsBox';
    saveLockLevelsBox.onclick = function() {
        if (this.checked) {
            localStorage.LevelResetUSAsaveLocks = 1;
            saveLockLevels();
        } else {
            localStorage.LevelResetUSAsaveLocks = 0;
        }
    };
    saveLockLevelsBoxLabel.htmlFor = '_saveLockLevelsBox';
    saveLockLevelsBoxLabel.innerHTML = 'Save manual lock levels';
    saveLockLevelsBoxLabel.style.cssText = 'font-size:95%;margin-left:5px;vertical-align:middle';

    // Alert box
    alertCntr.id = "alertCntr";
    alertCntr.style.cssText = 'color:red;border:1px solid #EBCCD1;background-color:#F2DEDE;color:#AC4947;font-weight:bold;font-size:90%;border-radius:5px;padding:10px;margin:5px 0;display:none';
    alertCntr.innerHTML = 'Watch out for map exceptions, some higher locks are there for a reason!';

    // change the lock values
    //lvlSetTitle.style.cssText = 'display: block;';
    lvlSetTitle.innerHTML = "Set Lock Levels";

    priLvlSet.type = 'number';
    priLvlSet.min = '1';
    priLvlSet.max = '6';
    priLvlSet.title = 'PS';
    priLvlSet.id = 'priLvlSet';
    if (localStorage.LevelResetUSAsaveLocks == 1) {
        priLvlSet.value = localStorage.LevelResetUSApriLvl;
    } else {
        priLvlSet.value = locklevels.pri + 1; // internal values are indexed at zero
    }
    priLvlSet.className = "lvlSetStyle";
    priLvlSet.style.cssText = 'width: 28px';
    priLvlSet.onchange = function() { saveLockLevels(); };
    priLvlSetLabel.htmlFor = 'priLvlSet';
    priLvlSetLabel.innerHTML = 'PS:';
    priLvlSetLabel.style.cssText = 'font-size:90%';

    minLvlSet.type = 'number';
    minLvlSet.min = '1';
    minLvlSet.max = '6';
    minLvlSet.title = 'mH';
    minLvlSet.id = 'minLvlSet';
    if (localStorage.LevelResetUSAsaveLocks == 1) {
        minLvlSet.value = localStorage.LevelResetUSAminLvl;
    } else {
        minLvlSet.value = locklevels.min + 1; // internal values are indexed at zero
    }
    minLvlSet.class = 'prefElement';
    minLvlSet.style.cssText = 'width: 28px';
    minLvlSet.onchange = function() { saveLockLevels(); };
    minLvlSetLabel.htmlFor = 'minLvlSet';
    minLvlSetLabel.innerHTML = 'mH:';
    minLvlSetLabel.style.cssText = 'font-size:90%';

    majLvlSet.type = 'number';
    majLvlSet.min = '1';
    majLvlSet.max = '6';
    majLvlSet.title = 'MH';
    majLvlSet.id = 'majLvlSet';
    if (localStorage.LevelResetUSAsaveLocks == 1) {
        majLvlSet.value = localStorage.LevelResetUSAmajLvl;
    } else {
        majLvlSet.value = locklevels.maj + 1; // internal values are indexed at zero
    }
    majLvlSet.class = 'prefElement';
    majLvlSet.style.cssText = 'width: 28px';
    majLvlSet.onchange = function() { saveLockLevels(); };
    majLvlSetLabel.htmlFor = 'majLvlSet';
    majLvlSetLabel.innerHTML = 'MH:';
    majLvlSetLabel.style.cssText = 'font-size:90%';

    rmpLvlSet.type = 'number';
    rmpLvlSet.min = '1';
    rmpLvlSet.max = '6';
    rmpLvlSet.title = 'Ramp';
    rmpLvlSet.id = 'rmpLvlSet';
    if (localStorage.LevelResetUSAsaveLocks == 1) {
        rmpLvlSet.value = localStorage.LevelResetUSArmpLvl;
    } else {
        rmpLvlSet.value = locklevels.rmp + 1; // internal values are indexed at zero
    }
    rmpLvlSet.class = 'prefElement';
    rmpLvlSet.style.cssText = 'width: 28px';
    rmpLvlSet.onchange = function() { saveLockLevels(); };
    rmpLvlSetLabel.htmlFor = 'rmpLvlSet';
    rmpLvlSetLabel.innerHTML = 'Ramp:';
    rmpLvlSetLabel.style.cssText = 'font-size:90%';

    fwyLvlSet.type = 'number';
    fwyLvlSet.min = '1';
    fwyLvlSet.max = '6';
    fwyLvlSet.title = 'Fwy';
    fwyLvlSet.id = 'fwyLvlSet';
    if (localStorage.LevelResetUSAsaveLocks == 1) {
        fwyLvlSet.value = localStorage.LevelResetUSAfwyLvl;
    } else {
        fwyLvlSet.value = locklevels.fwy + 1; // internal values are indexed at zero
    }
    fwyLvlSet.class = 'prefElement';
    fwyLvlSet.style.cssText = 'width: 28px';
    fwyLvlSet.onchange = function() { saveLockLevels(); };
    fwyLvlSetLabel.htmlFor = 'fwyLvlSet';
    fwyLvlSetLabel.innerHTML = 'Fwy:';
    fwyLvlSetLabel.style.cssText = 'font-size:90%';

    // build it all out
    var relockContent = setupTab();
    relockContent.appendChild(relockTitle);
    relockContent.appendChild(versionTitle);

    // Loader bar
    percentageLoader.id = 'percentageLoader';
    percentageLoader.style.cssText = 'width:1px;height:10px;background-color:green;margin-top:10px;border:1px solid:#333333;display:none';

    // only show if user didn't hide it before
    if (localStorage.LevelResetUSAmsgHide != 1) {
        relockSub.appendChild(hidebutton);
        relockContent.appendChild(relockSub);
    }
    relockContent.appendChild(includeAllSegments);
    relockContent.appendChild(includeAllSegmentsLabel);
    relockContent.appendChild(alertCntr);
    relockContent.appendChild(lvlSetTitle);
    relockContent.appendChild(saveLockLevelsBox);
    relockContent.appendChild(saveLockLevelsBoxLabel);
    relockContent.appendChild(document.createElement('div'));
    relockContent.appendChild(priLvlSetLabel);
    relockContent.appendChild(priLvlSet);
    relockContent.appendChild(minLvlSetLabel);
    relockContent.appendChild(minLvlSet);
    relockContent.appendChild(majLvlSetLabel);
    relockContent.appendChild(majLvlSet);
    relockContent.appendChild(rmpLvlSetLabel);
    relockContent.appendChild(rmpLvlSet);
    relockContent.appendChild(fwyLvlSetLabel);
    relockContent.appendChild(fwyLvlSet);
    relockContent.appendChild(relockSubTitle);
    relockContent.appendChild(resultsCntr);
    relockContent.appendChild(relockAllbutton);
    relockContent.appendChild(dotscntr);
    relockContent.appendChild(percentageLoader);

    // Do a default scan once at startup
    scanArea();

    // Register some eventlisteners
    W.map.events.register("moveend", null, scanArea);
    W.model.actionManager.events.register("afteraction", null, scanArea);
    W.model.actionManager.events.register("afterundoaction", null, scanArea);
    W.model.actionManager.events.register("noActions", null, scanArea);

    // Some functions

    // add our tab, or use a previous one from before Event Mode
    function setupTab(recoveredTab) {
        var userInfo = document.getElementById('user-info'),
           navTabs = userInfo.querySelector('.nav-tabs'),
	   tabContent = userInfo.querySelector('.tab-content'),
	   relockTab = document.createElement('li'),
	   relockContent = document.createElement('div');
	relockTab.innerHTML = '<a href="#sidepanel-relockTab" data-toggle="tab" title="Relock segments">Re - <span class="fa fa-lock" id="lockcolor" style="color:green"></span></a>';
	if (recoveredTab) {
		relockContent = recoveredTab;
	} else {
		relockContent.id = 'sidepanel-relockTab';
		relockContent.className = 'tab-pane';
	}
	navTabs.appendChild(relockTab);
	tabContent.appendChild(relockContent);
	return relockContent;
    }

    function onScreen(obj) {
        if (obj.geometry) {
            return(W.map.getExtent().intersectsBounds(obj.geometry.getBounds()));
        }
        return(false);
    }

    function relock(obj, key) {
        var objects = obj[key];
        var _i = 0;

        // update GUI
        function RunLocal() {
            W.model.actionManager.add(objects[_i]);
            _i++;

            if (_i < objects.length) {
                setTimeout(RunLocal, 1);
                var newWidth = (_i / objects.length) * $('#sidepanel-relockTab').css('width').replace('px', '');
                $('#percentageLoader').show();
                $('#percentageLoader').css('width', newWidth + 'px');
                $('#dotscntr').css('display', 'inline-block');
            } else {
                $('#dotscntr').css('display', 'none');
                $('#percentageLoader').hide();
            }
        }
        RunLocal();
    }

    function relockAll() {
        // only lock "all" until the current editors level is reached, then stop...
        $('#dotscntr').css('display', 'inline-block');

        $.each(relockObject, function( key, value ) {
            if (value.length !== 0) {
                // loop trough each segmentType
                var _i = 0;
                var RunLocal5 = function() {
                    W.model.actionManager.add(value[_i]);
                    _i++;

                    // Did not iterate with $.each, so the GUI can update with larger arrays
                    if (_i < value.length) {
                        setTimeout(RunLocal5, 1);
                        var newWidth = (_i / value.length) * $('#sidepanel-relockTab').css('width').replace('px', '');
                        $('#percentageLoader').show();
                        $('#percentageLoader').css('width', newWidth + 'px');
                        $('#dotscntr').css('display', 'inline-block');
                    } else {
                        $('#dotscntr').css('display', 'none');
                        $('#percentageLoader').hide();
                    }
                };
                RunLocal5();
            }
        });
        scanArea();
        $('#dotscntr').hide('slow');
    }

    function relockShowAlert() {
        if (includeAllSegments.checked)
            $('#alertCntr').show("fast");
        else
            $('#alertCntr').hide("fast");
    }

    function saveLockLevels() {
        if (saveLockLevelsBox.checked) {
            localStorage.LevelResetUSApriLvl = priLvlSet.value;
            localStorage.LevelResetUSAminLvl = minLvlSet.value;
            localStorage.LevelResetUSAmajLvl = majLvlSet.value;
            localStorage.LevelResetUSArmpLvl = rmpLvlSet.value;
            localStorage.LevelResetUSAfwyLvl = fwyLvlSet.value;
        }
    }

    function scanArea() {
        // use any changed lock levels, remember zero index
	locklevels = {
		'str' : 0,
		'pri' : priLvlSet.value - 1,
		'min' : minLvlSet.value - 1,
		'maj' : majLvlSet.value - 1,
		'rmp' : rmpLvlSet.value - 1,
		'fwy' : fwyLvlSet.value - 1,
	};

        // Object with array of roadtypes, to collect each wrongly locked segment, for later use
        relockObject = {'str':[], 'pri':[], 'min':[], 'maj':[], 'rmp':[], 'fwy':[]};
        var foundBadlocks = false;
        var count = 0;

        // Do a count on how many segments are in need of a correct lock (limit to 150 to save CPU)
        // Count also depends on the users editor level
        $.each(W.model.segments.objects, function( k, v ) {
            if (count < 150 && v.type == "segment" && onScreen(v) && v.isGeometryEditable()) {
                strt = W.model.streets.get(v.attributes.primaryStreetID);

                // Street (L1)
                if (v.attributes.roadType == 1) {
                    if (v.attributes.lockRank > locklevels.str && includeAllSegments.checked) {
                        relockObject.str.push(new UpdateObject(v, {lockRank: locklevels.str}));
                        foundBadlocks = true;
                        count++;
                    }
                }
                // Primary (L2)
                if (v.attributes.roadType == 2 && (userlevel >= (locklevels.pri + 1)) ) {
                    if (v.attributes.lockRank < locklevels.pri) {
                        relockObject.pri.push(new UpdateObject(v, {lockRank: locklevels.pri}));
                        foundBadlocks = true;
                        count++;
                    }
                    if (v.attributes.lockRank > locklevels.pri && includeAllSegments.checked) {
                        relockObject.pri.push(new UpdateObject(v, {lockRank: locklevels.pri}));
                        foundBadlocks = true;
                        count++;
                    }
                }
                // Minor Highway (L3)
                if (v.attributes.roadType == 7 && (userlevel >= (locklevels.min + 1)) ) {
                    if (v.attributes.lockRank < locklevels.min) {
                        relockObject.min.push(new UpdateObject(v, {lockRank: locklevels.min}));
                        foundBadlocks = true;
                        count++;
                    }
                    if (v.attributes.lockRank > locklevels.min && includeAllSegments.checked) {
                        relockObject.min.push(new UpdateObject(v, {lockRank: locklevels.min}));
                        foundBadlocks = true;
                        count++;
                    }
                }
                // Major Highway (L4)
                if (v.attributes.roadType == 6 && (userlevel >= (locklevels.maj + 1)) ) {
                    if (v.attributes.lockRank < locklevels.maj) {
                        relockObject.maj.push(new UpdateObject(v, {lockRank: locklevels.maj}));
                        foundBadlocks = true;
                        count++;
                    }
                    if (v.attributes.lockRank > locklevels.maj && includeAllSegments.checked) {
                        relockObject.maj.push(new UpdateObject(v, {lockRank: locklevels.maj}));
                        foundBadlocks = true;
                        count++;
                    }
                }
                // Ramps (L5)
                if (v.attributes.roadType == 4 && (userlevel >= (locklevels.rmp + 1)) ) {
                    if (v.attributes.lockRank < locklevels.rmp) {
                        relockObject.rmp.push(new UpdateObject(v, {lockRank: locklevels.rmp}));
                        foundBadlocks = true;
                        count++;
                    }
                    if (v.attributes.lockRank > locklevels.rmp && includeAllSegments.checked) {
                        relockObject.rmp.push(new UpdateObject(v, {lockRank: locklevels.rmp}));
                        foundBadlocks = true;
                        count++;
                    }
                }
                // Freeways (L5)
                if (v.attributes.roadType == 3  && (userlevel >= (locklevels.fwy + 1)) ) {
                    if (v.attributes.lockRank < locklevels.fwy) {
                        relockObject.fwy.push(new UpdateObject(v, {lockRank: locklevels.fwy}));
                        foundBadlocks = true;
                        count++;
                    }
                    if (v.attributes.lockRank > locklevels.fwy && includeAllSegments.checked) {
                        relockObject.fwy.push(new UpdateObject(v, {lockRank: locklevels.fwy}));
                        foundBadlocks = true;
                        count++;
                    }
                }
            }
        });

        // Build result to users tabpanel
        resultsCntr.innerHTML = '';
        var lvlCnt;
        if (includeAllSegments.checked)
            lvlCnt = 1;
        else
            lvlCnt = 2;

        $.each(relockObject, function( key, value ) {
            // Only show streets (L1) if needed -> checkbox checked. L1 streets cannot be locked too low, only too high :)
            if (key == 'str' && !includeAllSegments.checked) {
                return;
            }

            var __cntr = document.createElement('div'),
                __keyLeft = document.createElement('div'),
                __lckRight = document.createElement('div'),
                __cntRight = document.createElement('div'),
                __cleardiv = document.createElement("div");

            // Begin building
            __keyLeft.style.cssText = 'float:left';
            __keyLeft.innerHTML = readable[key];
            __lckRight.className = ((value.length !==0) ? 'fa fa-lock' : '');
            __cntRight.style.cssText = 'float:right';
            __cntRight.innerHTML =  ((value.length !==0) ? '<b>'+value.length+'</b>' : '-');
            __cleardiv.style.cssText ='clear:both;';

            // only add relock function if the editor's level allows it...
	    if (userlevel >= locklevels[key] + 1) {
		    __lckRight.style.cssText = 'width:15px;float:right;padding:3px 0 0 8px;cursor:pointer;' + ((value.length!== 0) ? 'color:red' : '' );
                    __lckRight.onclick = function() {
                        relock(relockObject, key);
                    };
	    } else {
                    // Grey out options to make it more visible
                    __lckRight.className = '';
                    __keyLeft.style.cssText = 'float:left;color:#777';
                    __cntRight.style.cssText = 'float:right;color:#777';
                    __lckRight.style.cssText = 'float:right;padding:3px 0 0 8px;color:#777;width:15px';
		}

            // Add to stage
            __cntr.appendChild(__keyLeft);
            __cntr.appendChild(__lckRight);
            __cntr.appendChild(__cntRight);
            __cntr.appendChild(__cleardiv);
            resultsCntr.appendChild(__cntr);
            lvlCnt++;
        });

        // Color the small lock icon red, if errors are found, so people can decide what to do...
        if (foundBadlocks) {
            relockAllbutton.removeAttribute('disabled');
            $('#lockcolor').css('color', 'red');
        } else {
            relockAllbutton.setAttribute('disabled', true);
            $('#lockcolor').css('color', 'green');
        }
    }
}
setTimeout(LevelReset_init, 2000);