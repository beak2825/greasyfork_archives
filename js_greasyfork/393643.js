// ==UserScript==
// @name         WME LevelReset_Test
// @namespace    https://greasyfork.org/scripts/393643-wme-levelreset-test/code/WME%20LevelReset_Test.user.js
// @version      2019.12.13.003
// @description  Script version of the WME LevelReset tool, to make relocking segments to their appropriate lock level easy & quick.
// @author       Broos Gert '2015
// @match        https://beta.waze.com/*editor*
// @match        https://www.waze.com/*editor*
// @exclude      https://www.waze.com/*user/*editor/*
// @grant        none
// @icon		 data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAA+VBMVEX///93PgHX19fTgQfFZgLLcwTrxYDDgA3nqBj5+fmwr6+Yl5f8/PzExMTl5eX114vv7+/e3t68vLzOzs6saRKARQSLTgeioqK2tbX72XfU1NT515fxz4b54b3RmySYWAv31aTpwIHgrn9/f3/75qPZsEvuuC/utx3psVP13KizbhXuuVj745bfoEzzwzDxwDXTjknpxqDPfhzWih7PhUaObErowqDJchrmqCfprRjbmUvblCLZjAv71WnhnyTfmA7hrmbjsm7qxpPv06vYljj305776MvLkD3XkjFwcHCMi4v6zk/6z1P2wVDYqzr3y3j2xWnrrl761X3u0VhGAAABv0lEQVQ4jZWTXXuaMBiGY7bZQUhIoBaKsIK0KkVqtd+2tJ2gnVJs9f//mAW78uHYwe6TXE+em/flJAD8D0RVdF3HTKqvGcaMAiAQVYd1vaEASikhhFKA1ZoeA8Iwct2lCAnAxl/zdcAMbeGipbtwMQM62xFEFUJtoWEIsbh0CVTF3QGqqrjax2cq4kkkFQFjTJD2eYeXBoa4uoEoBOU/RhBUWHWHJukUCZ9JQFCnWkVAQJRQniREyvGPANA/YzazRhBKwjSOg+DZmdoRZ+r8XAfxr5eo1AfzuW1HljXfYkX2zJ5b8TQXXtbWzPff38x2hvn27qf+zFrHubC39tppGoabjczZHIZpmra9/jgXTn2vnSTJaxgecsLwNRkmsueflgV5eLZarU4y+Lk6G9YIg8HxB4PBYEfY3woZQ0529rjQ3y+Evid3ez9K9LpmWTjqe2b3Ti5xlwlHhRDYzdvvFW5NOyiEAy48Pu2VeHps2sFBIUwi5/6hWeLh3okmhdCajJyLLxUunNGktS0lgdLW+agz/lZh3Bmdt6ggZS/NUBqX152brxVuOteXDZVRafsUrxq1XGHIBb6CwHoY4Tt+A1eiQ8S/AAv7AAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/393643/WME%20LevelReset_Test.user.js
// @updateURL https://update.greasyfork.org/scripts/393643/WME%20LevelReset_Test.meta.js
// ==/UserScript==

// ==/UserScript==
// require https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// initialize LevelReset and do some checks
function LevelReset_bootstrap() {
    LevelReset_init();
    // re-init when switching back from MTE mode
    W.app.modeController.model.bind('change:mode', LevelReset_init);
}

function LevelReset_init() {
    // Check initialisation
    if (typeof W == 'undefined' || typeof I18n == 'undefined') {
        setTimeout(LevelReset_init, 660);
        console.log('LevelReset: Waze object unavailable, map still loading');
        return;
    }

    function onScreen(obj) {
        if (obj.geometry) {
            return(W.map.getExtent().intersectsBounds(obj.geometry.getBounds()));
        }
        return(false);
    }

    // Country database --------------------------------------------------------------------------------------------------------------
    var cntryDB = {
       // BE:     { str_lvl:-1, pri_lvl:1, min_lvl:2, maj_lvl:3,  rmp_lvl:4, fwy_lvl:4}, //--------------------------------- Belgium
      //  NL:     { str_lvl:0, pri_lvl:1, min_lvl:2, maj_lvl:3,  rmp_lvl:4, fwy_lvl:4}, //--------------------------------- Netherlands
      //  LU:     { str_lvl:-1, pri_lvl:1, min_lvl:2, maj_lvl:3,  rmp_lvl:4, fwy_lvl:4}, //--------------------------------- Luxemburg
      //  PL:     { str_lvl:0, pri_lvl:1, min_lvl:2, maj_lvl:3,  rmp_lvl:3, fwy_lvl:3},  //--------------------------------- Poland
       // TU:     { str_lvl:0, pri_lvl:1, min_lvl:2, maj_lvl:3,  rmp_lvl:4, fwy_lvl:4},  //--------------------------------- Turkey
        FR:     { street_lvl:0, pri_lvl:2, min_lvl:3, maj_lvl:4,  rmp_lvl:4, fwy_lvl:4, priv_lvl:0, park_lvl:0, rr_lvl:0, nar_lvl:0, offr_lvl:0}, //--------------------------------- France
        AL:     { street_lvl:0, pri_lvl:1, min_lvl:2, maj_lvl:3,  rmp_lvl:3, fwy_lvl:3, priv_lvl:0, park_lvl:0, rr_lvl:0, nar_lvl:0, offr_lvl:0}  //--------------------------------- Albania
    };
    // Country database --------------------------------------------------------------------------------------------------------------


    // Setting up all variables
    var UpdateObject = require("Waze/Action/UpdateObject"),
        VERSION = GM_info.script.version,//'2019.12.08.01',
        loader = 'data:image/gif;base64,R0lGODlhEAAQAPQAAP///wAAAPj4+Dg4OISEhAYGBiYmJtbW1qioqBYWFnZ2dmZmZuTk5JiYmMbGxkhISFZWVgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH+GkNyZWF0ZWQgd2l0aCBhamF4bG9hZC5pbmZvACH5BAAKAAAAIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAEAAQAAAFUCAgjmRpnqUwFGwhKoRgqq2YFMaRGjWA8AbZiIBbjQQ8AmmFUJEQhQGJhaKOrCksgEla+KIkYvC6SJKQOISoNSYdeIk1ayA8ExTyeR3F749CACH5BAAKAAEALAAAAAAQABAAAAVoICCKR9KMaCoaxeCoqEAkRX3AwMHWxQIIjJSAZWgUEgzBwCBAEQpMwIDwY1FHgwJCtOW2UDWYIDyqNVVkUbYr6CK+o2eUMKgWrqKhj0FrEM8jQQALPFA3MAc8CQSAMA5ZBjgqDQmHIyEAIfkEAAoAAgAsAAAAABAAEAAABWAgII4j85Ao2hRIKgrEUBQJLaSHMe8zgQo6Q8sxS7RIhILhBkgumCTZsXkACBC+0cwF2GoLLoFXREDcDlkAojBICRaFLDCOQtQKjmsQSubtDFU/NXcDBHwkaw1cKQ8MiyEAIfkEAAoAAwAsAAAAABAAEAAABVIgII5kaZ6AIJQCMRTFQKiDQx4GrBfGa4uCnAEhQuRgPwCBtwK+kCNFgjh6QlFYgGO7baJ2CxIioSDpwqNggWCGDVVGphly3BkOpXDrKfNm/4AhACH5BAAKAAQALAAAAAAQABAAAAVgICCOZGmeqEAMRTEQwskYbV0Yx7kYSIzQhtgoBxCKBDQCIOcoLBimRiFhSABYU5gIgW01pLUBYkRItAYAqrlhYiwKjiWAcDMWY8QjsCf4DewiBzQ2N1AmKlgvgCiMjSQhACH5BAAKAAUALAAAAAAQABAAAAVfICCOZGmeqEgUxUAIpkA0AMKyxkEiSZEIsJqhYAg+boUFSTAkiBiNHks3sg1ILAfBiS10gyqCg0UaFBCkwy3RYKiIYMAC+RAxiQgYsJdAjw5DN2gILzEEZgVcKYuMJiEAOwAAAAAAAAAAAA==',
        strt = '',
        fwy_lvl = 4,
        rmp_lvl = 4,
        maj_lvl = 3,
        min_lvl = 2,
        pri_lvl = 1, //str_lvl = 0,
        street_lvl = 0,
        priv_lvl = 0, // ajout laurent
        park_lvl = 0, // laurent
        rr_lvl = 0, // laurent
        nar_lvl = 0, // laqurent
        offr_lvl = 0, //laurent
        absolute = false,
        fwy_cnt = 0,
        rmp_cnt = 0,
        maj_cnt = 0,
        min_cnt = 0,
        pri_cnt = 0, //str_cnt = 0,
        street_cnt = 0,
        priv_cnt = 0, //laurent
        park_cnt = 0, //laurent
        rr_cnt = 0, //laurent
        nar_cnt = 0, //laurent
        offr_cnt = 0, //laurent
        relockObject = {},//null, //=================== madnut ligne 111
        userlevel = W.loginManager.user.normalizedLevel,
        //userlevel = 6, // for testing purposes (NOTE: this does not enable you to lock higher!)
        relockTab = document.createElement('li'),
        userInfo = document.getElementById('user-info'),
        navTabs = userInfo.querySelector('.nav-tabs'),
        tabContent = userInfo.querySelector('.tab-content'),
        relockContent = document.createElement('div'),
        relockTitle = document.createElement('h3'),
        relockSubTitle = document.createElement('h4'),
        relockAllbutton = document.createElement('input'),
        lvlSetTitle = document.createElement('h4'),//======= laurent for add numeric button
        streetLvlSet = document.createElement('input'),//======= laurent for add numeric button
        streetLvlSetLabel = document.createElement('label'),//======= laurent for add numeric button
        priLvlSet = document.createElement('input'),//======= laurent for add numeric button
        priLvlSetLabel = document.createElement('label'),//======= laurent for add numeric button
        rrLvlSet = document.createElement('input'),//======= laurent for add numeric button
        rrLvlSetLabel = document.createElement('label'),//======= laurent for add numeric button
        privLvlSet = document.createElement('input'),//======= laurent for add numeric button
        privLvlSetLabel = document.createElement('label'),//======= laurent for add numeric button
        minLvlSet = document.createElement('input'),//======= laurent for add numeric button
        minLvlSetLabel = document.createElement('label'),//======= laurent for add numeric button
        majLvlSet = document.createElement('input'),//======= laurent for add numeric button
        majLvlSetLabel = document.createElement('label'),//======= laurent for add numeric button
        rmpLvlSet = document.createElement('input'),//======= laurent for add numeric button
        rmpLvlSetLabel = document.createElement('label'),//======= laurent for add numeric button
        fwyLvlSet = document.createElement('input'),//======= laurent for add numeric button
        fwyLvlSetLabel = document.createElement('label'),//======= laurent for add numeric button
        parkLvlSet = document.createElement('input'),//======= laurent for add numeric button
        parkLvlSetLabel = document.createElement('label'),//======= laurent for add numeric button
        narLvlSet = document.createElement('input'),//======= laurent for add numeric button
        narLvlSetLabel = document.createElement('label'),//======= laurent for add numeric button
        offrLvlSet = document.createElement('input'),//======= laurent for add numeric button
        offrLvlSetLabel = document.createElement('label'),//======= laurent for add numeric button
        relockSub = document.createElement('p'),
        versionTitle = document.createElement('p'),
        resultsCntr = document.createElement('div'),
        alertCntr = document.createElement('div'),
        hidebutton = document.createElement('div'),
        dotscntr = document.createElement('div'),
        includeAllSegments = document.createElement('input'),
        includeAllSegmentsLabel = document.createElement('label'),
        inputDiv1 = document.createElement('div'),// pour segmentRadar
        inputDiv2 = document.createElement('div'),// pour les checkboxes devant les segments
        segmentRadar = document.createElement('input'),
        segmentRadarLabel = document.createElement('label'),
        saveLockLevelsBox = document.createElement('input'),
        saveLockLevelsBoxLabel = document.createElement('label'),
        percentageLoader = document.createElement('div'),
        readable = {'str':'Streets (#)', 'street':'Streets Auto (#)', 'pri':'Primary Streets (#)','min':'Minor Highways (#)', 'maj':'Major Highways (#)', 'rmp':'Ramps (#)', 'fwy':'Freeways (#)', 'priv':'Privates (#)', 'rr':'Railroad (#)', 'park':'Parking Lot Roads (#)', 'offr':'Offroads (#)', 'nar':'Narrows (#)'};

    // Begin building
    relockContent.id = 'sidepanel-relockTab';
    relockContent.className = 'tab-pane';
    relockTitle.appendChild(document.createTextNode('Relock segments'));
    relockTitle.style.cssText = 'margin-bottom:0';
    relockTab.innerHTML = '<a href="#sidepanel-relockTab" data-toggle="tab" title="Relock segments">Re - <span class="fa fa-lock" id="lockcolor" style="color:green"></span></a>';

    // fill tab
    relockSub.innerHTML = 'Your on-screen area is automatically scanned when you load or pan around. Pressing the lock behind each type will relock only those results, or you can choose to relock all.<br/><br/>You can only relock segments lower or equal to your current editor level. Segments locked higher than normal are left alone.';
    relockSub.style.cssText = 'font-size:85%;padding:15px;border:1px solid red;border-radius:5px;position:relative';
    relockSub.id = 'sub';
    hidebutton.style.cssText ='cursor:pointer;width:16px;height:16px;position:absolute;right:3px;top:3px;background-image:url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAWdEVYdENyZWF0aW9uIFRpbWUAMTEvMjAvMTVnsXrkAAADTUlEQVQ4jW2TW0xbZQCAv3ODnpYWegEGo1wKwzBcxAs6dONSjGMm3kjmnBqjYqLREE2WLDFTIBmbmmxRpzHy4NPi4zRLfNBlZjjtnCEaOwYDJUDcVqC3UzpWTkt7fp80hvk9f/nePkkIwWb+gA5jMXLQjK50Zc2cuKVp4wlX2UevtAYubnal/waWoTI1N38keu7ck2uTl335ZFJCkpE8XlGob4ibgeZvMl7P8MtdO6/dFohDe/Sn0LdzJ457MuHfUYqLkYtsSIqMJASyIiNv30Gm6+G1zNbqvpf6gqF/AwaUXx+/MDdz6KArH4ujVVRAbgPVroMsQz6P6nJiGUnUGj/pR/tTyx2dtW+11t2UAa5Pz34w//GHLitpsG1wkODp0xQ11GOZJpgmzq5uqo8ew76zAxFPUDJxscwzFR4BkGfh/tj58/3Zq9OoFZU0PHsAd00NnWNj6IEApd3duA48g2nXKenpQSl1oceWsUeuPfdp+M9GZf/zA5+lz3x9lxRbAUli+dIlKnt7Ud1uCk1NJH0+VnMmq6EQfw0NUzCSULBQfT4HVf4iNRO50VlIGSi6jup0sj5zlTO7d9N48iRLa2vkCwWsyTArbx/GAaSBm/MLyLm85OjZs0c2zawQsoRmt5NeXCRyeRLh9rBkGBSEwF6i09h+L96GemyAx2bDK4ENkGRJkbM2fVy4PRhT08RmZvH09VE29C6ixEFuahL3hklLby9PhEKUt7VRZln4kHD669Bqtl6Q7W07jqWL9FQiEkHTdUoGBsgXF5EPh0m8M8Tc62/CSoLSqmqaR4ZxaRpenxfbgw8lCy2Nx5Uv3xuNXEll7shO/HI38Rjr09NImkriyCgOy0JZTZM4+x3C7SY+epTaLZWsdwXJPNV/6jF/9ReSEIKzmcKWpbHPF9OHDxUr6xksoAiQJAmnpuEWAqeq4G9uRr7nPpZeeDG10NqybV+5Ly4DPGJXlsv79u51v38iK22/EwmwACEEIpdD2tjApmncan8A49XX4qtNgeC+cl/8tpm+jxoBY+K3N7I/jj+dvxKuIhZV7KpKWV295dy1K6YEg1/NO2wj+/210f+98R9+hub0wo1BOZnslRVV16orf0hVeD55HH7d7P4N0V1gY9/zcaEAAAAASUVORK5CYII=\');';
    hidebutton.onclick = function() {
        localStorage.msgHide = 1;
        $('#sub').hide('slow');
    };
    dotscntr.style.cssText = 'width:16px;height:16px;margin-left:5px;background:url("'+ loader + '");vertical-align:text-top;display:none';
    dotscntr.id = 'dotscntr';
    relockSubTitle.innerHTML = 'Results';
    versionTitle.innerHTML = 'Version ' + VERSION;
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
    includeAllSegments.checked = (localStorage.getItem('Relock_allSegments') == 'true');
    includeAllSegments.id = "_allSegments";
    includeAllSegments.onclick = function () {
        localStorage.setItem('Relock_allSegments', includeAllSegments.checked.toString());
        scanArea();
        relockShowAlert();
    };
    includeAllSegmentsLabel.htmlFor = "_allSegments";
    includeAllSegmentsLabel.innerHTML = 'Also reset higher locked segments';
    includeAllSegmentsLabel.style.cssText = 'font-size:95%;margin-left:5px;vertical-align:middle';

    // Segments with ASC in France?
        segmentRadar.type = 'checkbox';
        segmentRadar.name = "name";
        segmentRadar.value = "value";
        segmentRadar.checked = localStorage.getItem('Relock_segmentRadar') == 'false' ? false : true;
        segmentRadar.id = "_segmentRadar";
        segmentRadar.onclick = function () {
            localStorage.setItem('Relock_segmentRadar', segmentRadar.checked.toString());
            scanArea();
        };
        segmentRadarLabel.htmlFor = "_segmentRadar";
        segmentRadarLabel.innerHTML = 'Segments with ASC in France';
        segmentRadarLabel.style.cssText = 'font-size:95%;margin-left:5px;vertical-align:middle';
    // Alert box
    alertCntr.id = "alertCntr";
    alertCntr.style.cssText = 'border:1px solid #EBCCD1;background-color:#F2DEDE;color:#AC4947;font-weight:bold;font-size:90%;border-radius:5px;padding:10px;margin:5px 0;display:none';
    alertCntr.innerHTML = 'Watch out for map exceptions, some higher locks are there for a reason!';

    // Save manually-set lock levels?//======================================================== for numeric button ======================================================================
    saveLockLevelsBox.type = 'checkbox';
    saveLockLevelsBox.name = "name";
    saveLockLevelsBox.value = "value";
    saveLockLevelsBox.checked = localStorage.getItem('Relock_saveLockLevelsBox') == 'true' ? false : true;
    saveLockLevelsBox.id = "_saveLockLevelsBox";
    saveLockLevelsBox.onclick = function () {
        localStorage.setItem('_saveLockLevelsBox', saveLockLevelsBox.checked.toString());
        scanArea();
        //relockShowAlert();
    };
    saveLockLevelsBoxLabel.htmlFor = "_saveLockLevelsBoxLabel";
    saveLockLevelsBoxLabel.innerHTML = 'Save manual lock levels';
    saveLockLevelsBoxLabel.style.cssText = 'font-size:95%;margin-left:5px;vertical-align:middle';//======================================================== for numeric button ======================================================================

    // change the lock values
    //lvlSetTitle.style.cssText = 'display: block;';//original
    lvlSetTitle.innerHTML = "Set Lock Levels";

    priLvlSet.type = 'number';
    priLvlSet.min = '1';
    priLvlSet.max = '6';
    priLvlSet.title = 'Primary';
    priLvlSet.id = 'priLvlSet';
    if (localStorage._saveLockLevelsBox == true) {
        priLvlSet.value = localStorage.saveLockLevelsBoxpriLvl;
    } else {
        priLvlSet.value = pri_lvl + 1;
    }
    priLvlSet.className = "lvlSetStyle";
    priLvlSet.style.cssText = 'width: 28px';
    priLvlSet.onchange = function() { saveLockLevels(); };
    priLvlSetLabel.htmlFor = 'priLvlSet';
    priLvlSetLabel.innerHTML = 'PS:';
    priLvlSetLabel.style.cssText = 'font-size:90%';

    rrLvlSet.type = 'number';
    rrLvlSet.min = '1';
    rrLvlSet.max = '6';
    rrLvlSet.title = 'Railroad';
    rrLvlSet.id = 'rrLvlSet';
    if (localStorage._saveLockLevelsBox == true) {
        rrLvlSet.value = localStorage.saveLockLevelsBoxrrLvl;
    } else {
        rrLvlSet.value = rr_lvl + 1; // internal values are indexed at zero
    }
    rrLvlSet.className = "lvlSetStyle";
    rrLvlSet.style.cssText = 'width: 28px';
    rrLvlSet.onchange = function() { saveLockLevels(); };
    rrLvlSetLabel.htmlFor = 'rrLvlSet';
    rrLvlSetLabel.innerHTML = 'RR:';
    rrLvlSetLabel.style.cssText = 'font-size:90%';

    privLvlSet.type = 'number';
    privLvlSet.min = '1';
    privLvlSet.max = '6';
    privLvlSet.title = 'Private';
    privLvlSet.id = 'privLvlSet';
    if (localStorage._saveLockLevelsBox == true) {
        privLvlSet.value = localStorage.saveLockLevelsBoxprivLvl;
    } else {
        privLvlSet.value = priv_lvl + 1;
    }
    privLvlSet.className = "lvlSetStyle";
    privLvlSet.style.cssText = 'width: 28px';
    privLvlSet.onchange = function() { saveLockLevels(); };
    privLvlSetLabel.htmlFor = 'privLvlSet';
    privLvlSetLabel.innerHTML = 'PR:';
    privLvlSetLabel.style.cssText = 'font-size:90%';

    minLvlSet.type = 'number';
    minLvlSet.min = '1';
    minLvlSet.max = '6';
    minLvlSet.title = 'Minor';
    minLvlSet.id = 'minLvlSet';
    if (localStorage._saveLockLevelsBox == true) {
        minLvlSet.value = localStorage.saveLockLevelsBoxminLvl;
    } else {
        minLvlSet.value = min_lvl + 1; // internal values are indexed at zero
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
    majLvlSet.title = 'Major';
    majLvlSet.id = 'majLvlSet';
    if (localStorage._saveLockLevelsBox == true) {
        majLvlSet.value = localStorage.saveLockLevelsBoxmajLvl;
    } else {
        majLvlSet.value = maj_lvl + 1; // internal values are indexed at zero
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
    if (localStorage._saveLockLevelsBox == true) {
        rmpLvlSet.value = localStorage.saveLockLevelsBoxrmpLvl;
    } else {
        rmpLvlSet.value = rmp_lvl + 1; // internal values are indexed at zero
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
    fwyLvlSet.title = 'Freeway';
    fwyLvlSet.id = 'fwyLvlSet';
    if (localStorage._saveLockLevelsBox == true) {
        fwyLvlSet.value = localStorage.saveLockLevelsBoxfwyLvl;
    } else {
        fwyLvlSet.value = fwy_lvl + 1; // internal values are indexed at zero
    }
    fwyLvlSet.class = 'prefElement';
    fwyLvlSet.style.cssText = 'width: 28px';
    fwyLvlSet.onchange = function() { saveLockLevels(); };
    fwyLvlSetLabel.htmlFor = 'fwyLvlSet';
    fwyLvlSetLabel.innerHTML = 'Fwy:';
    fwyLvlSetLabel.style.cssText = 'font-size:90%';

    parkLvlSet.type = 'number';
    parkLvlSet.min = '1';
    parkLvlSet.max = '6';
    parkLvlSet.title = 'Parking';
    parkLvlSet.id = 'parkLvlSet';
    if (localStorage._saveLockLevelsBox == true) {
        parkLvlSet.value = localStorage.saveLockLevelsBoxfwyLvl;
    } else {
        parkLvlSet.value = park_lvl + 1; // internal values are indexed at zero
    }
    parkLvlSet.class = 'prefElement';
    parkLvlSet.style.cssText = 'width: 28px';
    parkLvlSet.onchange = function() { saveLockLevels(); };
    parkLvlSetLabel.htmlFor = 'parkLvlSet';
    parkLvlSetLabel.innerHTML = 'park:';
    parkLvlSetLabel.style.cssText = 'font-size:90%';

    narLvlSet.type = 'number';
    narLvlSet.min = '1';
    narLvlSet.max = '6';
    narLvlSet.title = 'narrow';
    narLvlSet.id = 'narLvlSet';
    if (localStorage.LevelResetUSAsaveLocks == 1) {
        narLvlSet.value = localStorage.saveLockLevelsBoxfwyLvl;
    } else {
        narLvlSet.value = nar_lvl + 1; // internal values are indexed at zero
    }
    narLvlSet.class = 'prefElement';
    narLvlSet.style.cssText = 'width: 28px';
    narLvlSet.onchange = function() { saveLockLevels(); };
    narLvlSetLabel.htmlFor = 'narLvlSet';
    narLvlSetLabel.innerHTML = 'nar:';
    narLvlSetLabel.style.cssText = 'font-size:90%';

    offrLvlSet.type = 'number';
    offrLvlSet.min = '1';
    offrLvlSet.max = '6';
    offrLvlSet.title = 'Offroad';
    offrLvlSet.id = 'offrLvlSet';
    if (localStorage.LevelResetUSAsaveLocks == 1) {
        narLvlSet.value = localStorage.saveLockLevelsBoxfwyLvl;
    } else {
        narLvlSet.value = offr_lvl + 1; // internal values are indexed at zero
    }
    offrLvlSet.class = 'prefElement';
    offrLvlSet.style.cssText = 'width: 28px';
    offrLvlSet.onchange = function() { saveLockLevels(); };
    offrLvlSetLabel.htmlFor = 'offrLvlSet';
    offrLvlSetLabel.innerHTML = 'offr:';
    offrLvlSetLabel.style.cssText = 'font-size:90%';

    streetLvlSet.type = 'number';
    streetLvlSet.min = '1';
    streetLvlSet.max = '6';
    streetLvlSet.title = 'Street';
    streetLvlSet.id = 'streetLvlSet';
    if (localStorage.LevelResetUSAsaveLocks == 1) {
        streetLvlSet.value = localStorage.saveLockLevelsBoxfwyLvl;
    } else {
        streetLvlSet.value = street_lvl + 1; // internal values are indexed at zero
    }
    streetLvlSet.class = 'prefElement';
    streetLvlSet.style.cssText = 'width: 28px';
    streetLvlSet.onchange = function() { saveLockLevels(); };
    streetLvlSetLabel.htmlFor = 'streetLvlSet';
    streetLvlSetLabel.innerHTML = 'stre:';
    streetLvlSetLabel.style.cssText = 'font-size:90%';

    // add to stage
    navTabs.appendChild(relockTab);
    tabContent.appendChild(relockContent);
    relockContent.appendChild(relockTitle);
    relockContent.appendChild(versionTitle);

    // Loader bar
    percentageLoader.id = 'percentageLoader';
    percentageLoader.style.cssText = 'width:1px;height:10px;background-color:green;margin-top:10px;border:1px solid:#333333;display:none';

    // only show if user didn't hide it before
    if (localStorage.msgHide != 1) {
        relockSub.appendChild(hidebutton);
        relockContent.appendChild(relockSub);
    }
    inputDiv1.appendChild(segmentRadar);
    inputDiv1.appendChild(segmentRadarLabel);
    inputDiv2.appendChild(includeAllSegments);
    inputDiv2.appendChild(includeAllSegmentsLabel);
    relockContent.appendChild(inputDiv1);
    relockContent.appendChild(inputDiv2);

    relockContent.appendChild(includeAllSegments);/////////////////////////////////////////  revoir ces 2 lignes  avec FR ?==========================================================================
    relockContent.appendChild(includeAllSegmentsLabel);
    relockContent.appendChild(alertCntr);
    relockContent.appendChild(lvlSetTitle);// Rest Level FR
    relockContent.appendChild(document.createElement('div'));// Rest Level FR
    relockContent.appendChild(priLvlSetLabel);// Rest Level FR
    relockContent.appendChild(priLvlSet);// Rest Level FR
    relockContent.appendChild(privLvlSetLabel);// Rest Level FR
    relockContent.appendChild(privLvlSet);// Rest Level FR
    relockContent.appendChild(minLvlSetLabel);// Rest Level FR
    relockContent.appendChild(minLvlSet);// Rest Level FR
    relockContent.appendChild(majLvlSetLabel);// Rest Level FR
    relockContent.appendChild(majLvlSet);// Rest Level FR
    relockContent.appendChild(rmpLvlSetLabel);// Rest Level FR
    relockContent.appendChild(rmpLvlSet);// Rest Level FR
    relockContent.appendChild(fwyLvlSetLabel);// Rest Level FR
    relockContent.appendChild(fwyLvlSet);// Rest Level FR
    relockContent.appendChild(rrLvlSetLabel);// Rest Level FR
    relockContent.appendChild(rrLvlSet);// Rest Level FR
    relockContent.appendChild(narLvlSetLabel);// Rest Level FR
    relockContent.appendChild(narLvlSet);// Rest Level FR
    relockContent.appendChild(parkLvlSetLabel);// Rest Level FR
    relockContent.appendChild(parkLvlSet);// Rest Level FR
    relockContent.appendChild(offrLvlSetLabel);// Rest Level FR
    relockContent.appendChild(offrLvlSet);// Rest Level FR
    relockContent.appendChild(streetLvlSetLabel);// Rest Level FR
    relockContent.appendChild(streetLvlSet);// Rest Level FR
    relockContent.appendChild(relockSubTitle);
    relockContent.appendChild(resultsCntr);
    relockContent.appendChild(relockAllbutton);
    relockContent.appendChild(dotscntr);
    relockContent.appendChild(percentageLoader);

    // Some functions
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
        var includeAllSegments = document.getElementById('_allSegments'); //=================================== de madnut ligne 484
        if (includeAllSegments.checked)
            $('#alertCntr').show("fast");
        else
            $('#alertCntr').hide("fast");
    }

    function saveLockLevels() {
        if (saveLockLevelsBox.checked) {
            localStorage.saveLockLevelsBoxpriLvl = priLvlSet.value;
            localStorage.saveLockLevelsBoxminLvl = minLvlSet.value;
            localStorage.saveLockLevelsBoxmajLvl = majLvlSet.value;
            localStorage.saveLockLevelsBoxrmpLvl = rmpLvlSet.value;
            localStorage.saveLockLevelsBoxfwyLvl = fwyLvlSet.value;
            localStorage.saveLockLevelsBoxprivLvl = privLvlSet.value;
            localStorage.saveLockLevelsBoxrrLvl = rrLvlSet.value;
            localStorage.saveLockLevelsBoxrrLvl = streetLvlSet.value;
            localStorage.saveLockLevelsBoxrrLvl = parkLvlSet.value;
            localStorage.saveLockLevelsBoxrrLvl = offrLvlSet.value;
            localStorage.saveLockLevelsBoxrrLvl = narLvlSet.value;
        }
    }

    function scanArea() {
        // Object with array of roadtypes, to collect each wrongly locked segment, for later use
        relockObject = {'street':[], 'pri':[], 'min':[], 'maj':[], 'rmp':[], 'fwy':[], 'priv':[], 'park':[], 'rr':[], 'offr':[], 'nar':[]};
        var foundBadlocks = false;
        var count = 0;

        // Choose country lock settings. If country selection fails
        // or country isn't in this list, WME default values are used.
        try {
            var ABBR =  cntryDB[W.model.getTopCountry().abbr];
            fwy_lvl = ABBR.fwy_lvl;
            rmp_lvl = ABBR.rmp_lvl;
            maj_lvl = ABBR.maj_lvl;
            min_lvl = ABBR.min_lvl;
            pri_lvl = ABBR.pri_lvl;
            //str_lvl = ABBR.str_lvl;
            street_lvl = ABBR.street_lvl;
            rr_lvl = ABBR.rr_lvl;
            park_lvl = ABBR.park_lvl;
            priv_lvl = ABBR.priv_lvl;
            offr_lvl = ABBR.offr_lvl;
            nar_lvl = ABBR.nar_lvl;
            console.log("LevelReset: ", ABBR);
        } catch(err) {
            console.log("LevelReset ERROR: ", err);
        }

        // Do a count on how many segments are in need of a correct lock (limit to 150 to save CPU)
        // Count also depends on the users editor level
        var limitCount = 150;
        relockSubTitle.innerHTML = 'Results (limit: ' + limitCount + ')';

        $.each(W.model.segments.objects, function( k, v ) {
            if (count < limitCount && v.type == "segment" && onScreen(v) && v.isGeometryEditable()) {
                strt = W.model.streets.get(v.attributes.primaryStreetID);
                // Street (L1)
              /*  if ((v.attributes.roadType == 1 || v.attributes.roadType == 5 || v.attributes.roadType == 8 || v.attributes.roadType == 10 || v.attributes.roadType == 17 || v.attributes.roadType == 20) && v.attributes.restrictions.length == 0) {
                    if (v.attributes.lockRank > str_lvl && includeAllSegments.checked && v.attributes.lockRank != null) {
                        if(str_lvl==-1) {
                            relockObject.str.push(new UpdateObject(v, {lockRank: null})); //null
                            }
                        else{
                            relockObject.str.push(new UpdateObject(v, {lockRank: str_lvl}));
                            }
                        foundBadlocks = true;
                        count++;
                    }
                }*/
                // street private narrow parking AL(L1 manuel pas auto)
                if (street_lvl && W.model.getTopCountry().abbr == AL){// id == 2
                if ((v.attributes.roadType == 1 || v.attributes.roadType == 17 || v.attributes.roadType == 20 || v.attributes.roadType == 22) && (userlevel >= (street_lvl+1)) ) {
                    if ((v.attributes.lockRank !== street_lvl) && (v.attributes.lockRank < street_lvl+1)) {
                        relockObject.street.push(new UpdateObject(v, {lockRank: street_lvl}));
                        foundBadlocks = true;
                        count++;
                    }
                    if ((v.attributes.lockRank == -1) &&(v.attributes.lockRank !== -1)) {
                        relockObject.street.push(new UpdateObject(v, {lockRank: street_lvl}));
                        foundBadlocks = true;
                        count++;
                    }
                    if (v.attributes.lockRank > street_lvl && includeAllSegments.checked) {
                        relockObject.street.push(new UpdateObject(v, {lockRank: street_lvl}));
                        foundBadlocks = true;
                        count++;
                    }}}
                // Route fr streets(L1 manuel pas auto)
                if (street_lvl && W.model.getTopCountry().abbr == FR){
                if ((v.attributes.roadType == 1) && (userlevel >= (street_lvl+1)) ) {
                    if ((v.attributes.lockRank !== street_lvl) && (v.attributes.lockRank < street_lvl+1)) {
                        relockObject.street.push(new UpdateObject(v, {lockRank: street_lvl}));
                        foundBadlocks = true;
                        count++;
                    }
                    if ((v.attributes.lockRank == -1) &&(v.attributes.lockRank!== -1)) {
                        relockObject.street.push(new UpdateObject(v, {lockRank: street_lvl}));
                        foundBadlocks = true;
                        count++;
                    }
                    if (v.attributes.lockRank > street_lvl && includeAllSegments.checked) {
                        relockObject.street.push(new UpdateObject(v, {lockRank: street_lvl}));
                        foundBadlocks = true;
                        count++;
                    }}}
                // Primary
                if (v.attributes.roadType == 2 && (userlevel >= (pri_lvl+1)) ) {
                    if (v.attributes.lockRank < pri_lvl) {
                        relockObject.pri.push(new UpdateObject(v, {lockRank: pri_lvl}));
                        foundBadlocks = true;
                        count++;
                    }
                    if (pri_lvl && W.model.getTopCountry().abbr == fr){
                        if (segmentRadar.checked && (v.attributes.lockRank < (pri_lvl + 2)) && (v.attributes.fwdFlags || v.attributes.revFlags)) {
                        relockObject.pri.push(new UpdateObject(v, {lockRank: (pri_lvl + 2)}));
                        foundBadlocks = true;
                        count++;
                    }}
                    if (v.attributes.lockRank > pri_lvl && includeAllSegments.checked) {
                        relockObject.pri.push(new UpdateObject(v, {lockRank: pri_lvl}));
                        foundBadlocks = true;
                        count++;
                    }
                }
                // Minor Highway
                if (v.attributes.roadType == 7 && (userlevel >= (min_lvl+1)) ) {
                    if (v.attributes.lockRank < min_lvl) {
                        relockObject.min.push(new UpdateObject(v, {lockRank: min_lvl}));
                        foundBadlocks = true;
                        count++;
                    }
                    if (min_lvl && W.model.getTopCountry().id == 73){
                        if (segmentRadar.checked && (v.attributes.lockRank < (min_lvl + 1)) && (v.attributes.fwdFlags || v.attributes.revFlags)) {
                        relockObject.min.push(new UpdateObject(v, {lockRank: (min_lvl + 1)}));
                        foundBadlocks = true;
                        count++;
                    }}
                    if (v.attributes.lockRank > min_lvl && includeAllSegments.checked) {
                        relockObject.min.push(new UpdateObject(v, {lockRank: min_lvl}));
                        foundBadlocks = true;
                        count++;
                    }
                }
                // Major Highway
                if (v.attributes.roadType == 6 && (userlevel >= (maj_lvl+1)) ) {
                    if (v.attributes.lockRank < maj_lvl) {
                        relockObject.maj.push(new UpdateObject(v, {lockRank: maj_lvl}));
                        foundBadlocks = true;
                        count++;
                    }
                    if (v.attributes.lockRank > maj_lvl && includeAllSegments.checked) {
                        relockObject.maj.push(new UpdateObject(v, {lockRank: maj_lvl}));
                        foundBadlocks = true;
                        count++;
                    }
                }
                // Ramps
                if (v.attributes.roadType == 4 && (userlevel >= (rmp_lvl+1)) ) {
                    if (v.attributes.lockRank < rmp_lvl) {
                        relockObject.rmp.push(new UpdateObject(v, {lockRank: rmp_lvl}));
                        foundBadlocks = true;
                        count++;
                    }
                    if (v.attributes.lockRank > rmp_lvl && includeAllSegments.checked) {
                        relockObject.rmp.push(new UpdateObject(v, {lockRank: rmp_lvl}));
                        foundBadlocks = true;
                        count++;
                    }
                }
                // Freeways
                if (v.attributes.roadType == 3  && (userlevel >= (fwy_lvl+1)) ) {
                    if (v.attributes.lockRank < fwy_lvl) {
                        relockObject.fwy.push(new UpdateObject(v, {lockRank: fwy_lvl}));
                        foundBadlocks = true;
                        count++;
                    }
                    if (v.attributes.lockRank > fwy_lvl && includeAllSegments.checked) {
                        relockObject.fwy.push(new UpdateObject(v, {lockRank: fwy_lvl}));
                        foundBadlocks = true;
                        count++;
                    }
                }
                // Parking Lot Road
                if (v.attributes.roadType == 20  && (userlevel >= (park_lvl+1)) ) {
                    if (v.attributes.lockRank < park_lvl) {
                        relockObject.park.push(new UpdateObject(v, {lockRank: park_lvl}));
                        foundBadlocks = true;
                        count++;
                    }
                    if (v.attributes.lockRank > park_lvl && includeAllSegments.checked) {
                        relockObject.park.push(new UpdateObject(v, {lockRank: park_lvl}));
                        foundBadlocks = true;
                        count++;
                    }
                }
                // Offroad
                if (v.attributes.roadType == 8  && (userlevel >= (offr_lvl+1)) ) {
                    if (v.attributes.lockRank < offr_lvl) {
                        relockObject.offr.push(new UpdateObject(v, {lockRank: offr_lvl}));
                        foundBadlocks = true;
                        count++;
                    }
                    if (v.attributes.lockRank > offr_lvl && includeAllSegments.checked) {
                        relockObject.offr.push(new UpdateObject(v, {lockRank: offr_lvl}));
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
          /*  if (key == 'str' && !includeAllSegments.checked) {
                return;
            }*/

            var __cntr = document.createElement('div'),
                __keyLeft = document.createElement('div'),
                __lckRight = document.createElement('div'),
                __cntRight = document.createElement('div'),
                __cleardiv = document.createElement("div");

            // Begin building
            __keyLeft.style.cssText = 'float:left';
            __keyLeft.innerHTML = readable[key].replace ( '#', 'Lock ' + (eval(key+'_lvl')+1)); // No eval is not evil :)
            __lckRight.className = ((value.length !==0) ? 'fa fa-lock' : '');
            __cntRight.style.cssText = 'float:right';
            __cntRight.innerHTML =  ((value.length !==0) ? '<b>'+value.length+'</b>' : '-');
            __cleardiv.style.cssText ='clear:both;';

            // only add relock function if the editor's level allows it...
            if (userlevel < 5) {
                if (userlevel >= lvlCnt) {
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
            }
            else
            {
                // User is an L5/L6 so he can edit all road types (exceptions possible)
                __lckRight.style.cssText = 'width:15px;float:right;padding:3px 0 0 8px;cursor:pointer;' + ((value.length!== 0) ? 'color:red' : '' );
                __lckRight.onclick = function() {
                    relock(relockObject, key);
                };
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

    // Do a default scan once at startup
    scanArea();

    // Register some eventlisteners
    W.map.getMapEventsListener().register("moveend", null, scanArea);
    W.model.actionManager.events.register("afteraction", null, scanArea);
    W.model.actionManager.events.register("afterundoaction", null, scanArea);
    W.model.actionManager.events.register("noActions", null, scanArea);
}
setTimeout(LevelReset_bootstrap, 2000);

