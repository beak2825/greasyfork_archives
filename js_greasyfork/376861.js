// ==UserScript==
// @name         WME Find Deleted Objects
// @namespace    https://greasyfork.org/users/32336-joyriding
// @version      2022.08.13.01
// @description  Attempts to show the history of a venue that has been deleted in an area.
// @author       Joyriding
// @include      https://beta.waze.com/*
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @exclude      https://www.waze.com/user/editor*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAABY1JREFUeNqcl22MlNUVx3/nPjM7u+yKi4AsC2UNMSAfmmCwxsbERGliW0Pw5YOGGBJCYjTFREJrJGpLSH2JrbYGq7UJbT+obY0vIGg0UQyaIBFiSjCGLAhlYXdnUXFZ2J2deZ57Tj/cZ2aeHWZ3aW9yMvflOed/zzn/e+4dMTMARITJWv/WPYWZve/fImqrIXcdJN2Im+18/J26aAA4aE52jiz56Z4Fv76lPJmdKhaATAV8ctvB3OzP3lwvGm/BrCv9EGoGFHB1BZGiufyW73581/aeB69L/i/gC2s294iv7BAfL0cIAKYgKZApE+YhrIX5f2u+/faO1546+T8Bl+7acD2wG9zculYjqGOadgZ0VdubL3x+ScAX1mzuiUrnDogxFxRzOUTrUWsch1Br0745d8a3XnZ91fMssGvMaW707A5RPxfziE8QHyM+ATPEJ7h4fMIY82CG65lPy8tbcT3zAwfM4+LxK3Nj53ac3HYw1xiOCR6XV913P+hLE/ajWutWZl3J+fUPcPnyLgodEePnPSOHisz85H3aN62B9hkwOkb86HPY8VNZnAcKu/7y56ahLq++t+B8238w7cqwIXikyvDym7j8N+tpmTFNbkdLJI88gx3vy5DNFTUqXVXY+Ur5olA737YSX+lCE9AE4nFIKuAhbp9N59bpQa00TvLwk9ix4+DLkJSDLV/pcr5tJQ3MCK5XSqtRj3iPxDFiFnhSLnH2FxvJF8KnSUXp2/YR5x57CS1PPKpne0fh6AnEe7DAfvEe1Af7mZZN+goxAqAZ+AQ8qDk6r+2uV7Htn9J9YBf5Pz0BhYmcaV/cGfQBSdNpIjg1TGRFU2Ax60Z9yIvGYAJxBfFG68w6wKwzR8m/+AR0tAfDY+PIjFYA8m0u5YXW8lutDuKi7uah9skcUR+OjwmSeFBDvDI+Ug9px+Z1NVAujFJ876va2ti3cdCv2lFflySe0xQYHw+jIR/4GHyMJMHA8KHBukJLFDwdr1D8tI95d1xbJ/SJ76nZUGuQeLg5sDGIgaghmi6JgHna9++9iMHS2kLXz5bhonqpLbz2aqpvKbnS8moKRIPNQ222T1TTHMUIhphHll7NrA13TFeXOTdQpvOLT2pnXzRJRdNfv28Sj+0DLEl3aKAVZMki3Pbfw2UdU59fNaJfbQGt1D20pC5V+82AT93z+G5R+sMOQXCI5EK4Ac6P8u0f3m4KXHzuXTqOHUI81PSVMPaA0W8Lhnc3BU4v7qdRAyQQovdrWL8JBobQtQ9yxcvPc/q3b2Far7mn/7qP+f98MXwvGTJ5X7tARPXp6PW9yaSXhP1rg+PZ4/sx+1HtclCFSgxJDN4wgbM3raL1d5sY+eMbzN/1N4iikB7nUkZlHxV2gF9efYPc/YJOdR+L3bB6HknpY4xrai+LxAdRCRUNDy0zILIAikHUEjwEkCj0hSPk2m6W/TuHwnU8BTAg5c4fdrcsnvchyFLUh2kzSDSc8SgfAEVCMp1LVa3usFlv5cSZlYXhwwPVgzXpQ6AKXBg+PNR/ZOBWvD8Qdp9aixzk8wHIhcMfSmO6sardJPl88MiRWwvDh4eqNhsJOek9t3Dsq6FlA6dWUixuxFxfyHm6ARHw6bgKqAqJ9lEc2rhssP8n3aX+4lRHsDHU1Zg5IKrKwpkLcn1SuFt6Fj0PLn+xFZdY36mHFvkL/zg90p+SoCbVHeu0OU4BXWYDDnC+fcnP3eLuvwfw6ptaEzs5sM6N9O5OQTQDWO3bpZCr0XOXGaNzlt4mXfNeAcmDS+ybb9a6oS/fqVX8OqBmxjQCY2bZZ6c0CXUOaMlIwX6w4na75sb9tnD5nUChYT2X0XVZclWxzGzSfxLSyPQm8xeV7MyvNZmf8K7OTWNEmhi61Dalzn8HAB4VQHAYFYLdAAAAAElFTkSuQmCC
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// @license      GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376861/WME%20Find%20Deleted%20Objects.user.js
// @updateURL https://update.greasyfork.org/scripts/376861/WME%20Find%20Deleted%20Objects.meta.js
// ==/UserScript==

/* global W */
/* global OpenLayers */
/* global I18n */
/* global $ */
/* global WazeWrap */
/* global require */
/* global google */
/* global Backbone */

(function() {
    'use strict';

    var settings = {};
    var _wmeFdoFeatureLayer;
    var _wmeFdoMarkerLayer;

    var projection=new OpenLayers.Projection("EPSG:900913");
    var displayProjection=new OpenLayers.Projection("EPSG:4326");

    var requestStatus = [];
    var seenVenueIds = [];
    var subcategoryToParentCategories = [];

    var flags = {
        venue: { }
    };

    var externalProviderDetails = { };

    var idMappings = {
        users: [],
        streets: [],
    }

    let userCache = [];
    var userProgress = [];
    let earliestScanDate = parseInt(new Date('2016-12-31').getTime());

    let googleMapsApi = {
        map: document.createElement('div'),
        service: null
    }

    const DAY_MS = 1000 * 60 * 60 * 24;
    const WEEK_MS = DAY_MS * 7;

    function bootstrap(tries) {
        tries = tries || 1;

        if (W && W.map &&
            W.model && W.loginManager.user &&
            WazeWrap.Ready && $ ) {
            init();
        } else if (tries < 1000)
            setTimeout(function () {bootstrap(tries++);}, 200);
    }

    function init()
    {
        let styleElements = getWmeStyles();

        var $style = $("<style>");
        $style.html([
            '<style>',
            '#wmeFdoStatusDate { margin-top:10px;margin-bottom:10px; }',
            '.spinner-disable { opacity: 0; }',
            '.wmeFdoFormInputLabel { display:inline-block;margin-right:10px;}',
            '.wmeFdoFormInput { display:inline-block; width:150px;}',
            '.wmeFdoButtonArea {margin-top:10px;margin-bottom:10px; }',
            '.wmeFdoGoogleBtn { margin-top:10px;margin-bottom:10px; }',
            '.wmeFdoRecreate a { color: #b5b5b5; cursor: pointer; text-decoration:none;}',
            '.wmeFdoRecreate a:hover { text-decoration:underline; }',
            '.wmeFdoResultDetail { position: relative; }',
            '.wmeFdoDetailControls {position: absolute;right: 17px;top: 10px;}',
            '.wmeFdoFlag a { text-decoration: none; }',
            '.wmeFdoFlag { cursor:pointer; opacity:0.2; margin-right:5px;}',
            '.wmeFdoFlag:hover { color:red; opacity:.75}',
            '.wmeFdoFlag.flagged { color: red; opacity:1}',
            '.wmeFdoHistoryContent { padding-left: 14px;padding-right: 14px; }',
            '.wmeFdo-element-history-item:not(:last-child) { margin-bottom: 5px; }',
            '.wmeFdo-element-history-item.closed .wmeFdo-tx-header {border-radius: 2px;background: #ededed;}',
            '.wmeFdo-element-history-item.closed .wmeFdo-tx-header:hover {background: rgba(255, 255, 255, 0.5);}',
            '.wmeFdo-element-history-item .wmeFdo-tx-header {display: flex;flex-direction: row; justify-content: space-between;padding: 10px;border: 1px solid #e4e4e4;border-radius: 2px 2px 0px 0px;font-size: 11px;color: #687077;line-height: 14px;background: white;transition: all 0.3s;cursor: pointer;}',
            '.wmeFdo-element-history-item .wmeFdo-tx-content {display: block;padding: 10px;padding-left: 22px; background-color: white;border: 1px solid #e4e4e4;border-top: none; font-size: 11px;}',
            '.wmeFdo-element-history-item.closed .wmeFdo-tx-content {display: none;}',
            '.wmeFdo-element-history-item.wmeFdo-tx-has-related .wmeFdo-tx-changed-attribute:last-child {margin-bottom: 10px;}',
            '.wmeFdo-element-history-item.wmeFdo-tx-has-related .wmeFdo-tx-changed-attribute:last-child { margin-bottom: 10px;}',
            '.wmeFdo-element-history-item .tx-toggle-closed {width: 30px;height: 30px;text-align: center;}',
            '.wmeFdo-element-history-item:not(.tx-has-content) .tx-content, .element-history-item:not(.tx-has-content) .tx-toggle-closed {display: none;}',
            '.wmeFdo-element-history-item .tx-toggle-closed {width: 30px;height: 30px;text-align: center;}',
            '.wmeFdo-element-history-item.closed .wmeFdo-tx-toggle-closed::after { content: "\\F107";top: 8px;}',
            '.wmeFdo-element-history-item .wmeFdo-tx-toggle-closed::after {display: inline-block;font: normal normal normal 14px/1 FontAwesome;font-size: inherit;text-rendering: auto;-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;color: #3d3d3d;display: block;position: relative;top: 8px;content: "\\F106";font-size: 19px;}',
            '.historySummaryItem { margin-left:10px; color:#a7a7a7; }',
            '.historySummaryItem a, .historySummaryItem a:visited { color:#a7a7a7; }',
            '.wmeFdo-place-delete { filter: saturate(17) hue-rotate(65deg); }',
            '.wmeFdo-place-delete:hover { filter: brightness(110%) saturate(17) hue-rotate(65deg) !important; }',
            '.wmeFdo-place-delete:after {',
            'border-top: 3px solid #ffffff;',
            'width: 69%;',
            'height: 49%;',
            'position: absolute;',
            'bottom: 6px;',
            'left: 8px;',
            'content: "";',
            'transform: rotate(-45deg);',
            '}',
            '#wmeFdoSubTabs, .wmeFdoFlag { display: none!important; }',
            '.wmeFdoResultTypeVenue { opacity:0.5; margin-left:-3px;margin-right:5px;position:relative;top:3px;' + styleElements.resultTypeVenueStyle + '}',
            '.wmeFdoResultTypeCamera { opacity:0.5; margin-left:-3px;margin-right:5px;position:relative;top:3px;' + styleElements.resultTypeCameraStyle + '}',
            '.wmeFdoResultTypeArea { opacity:0.5; margin-left:-3px;margin-right:5px;position:relative;top:10px;' + styleElements.resultTypeAreaStyle + '}',
            // '.wmeFdoResultTypeResidential { opacity:0.65; margin-left:-3px;margin-right:5px;position:relative;top:4px;' + styleElements.resultTypeResidentialNew + '}',
            // '.wmeFdoResultTypeParking { opacity:0.65; margin-left:-1px;margin-right:3px;margin-bottom:6px;position:relative;top:4px;filter: saturate(0%);' + styleElements.resultTypeParkingNew + '}',
            '.wmeFdoResultTypeResidential { filter:invert(.35); margin-left:-11px;margin-right:-1px;position:relative;top:-6px;' + styleElements.resultTypeResidentialNew + '}',
            '.wmeFdoResultTypeParking { filter:invert(.35); margin-left:-11px;margin-right:-1px;position:relative;top:-6px;' + styleElements.resultTypeParkingNew + '}',
            '.wmeFdoResultDeletedNewPlace:after { position:relative;content:"+";color:black;font-size:17px;font-weight:900;text-shadow: 0px 0px 2px white;top:7px;left:8px; }',
            '.wmeFdoResultDeletedNewPlaceAlt:after { position:relative;content:"+";color:black;font-size:17px;font-weight:900;top:14px;left:20px; }',
            '.wmeFdoResultDeletedFromRequest:after { position:relative;content:"\\002b06";color:black;font-size:13px;font-weight:900;text-shadow: 0px 0px 3px white;top:7px;left:8px; }',
            '.wmeFdoResultDeletedFromRequestAlt:after { position:relative;content:"\\002b06";color:black;font-size:13px;font-weight:900;top:14px;left:20px;opacity: .8; }',


            '.wmeFdoIconFilter { transform:rotate(90deg);margin-left:-1px;margin-right:3px;margin-bottom:6px;position:relative;top:4px;filter: saturate(0%);' + styleElements.iconFilter + '}',
            //'.wmeFdoIconFilterInline { font-size:15px;margin-top:5px; }',
            '.wmeFdoIconFilterInline:before { transform:rotate(90deg);filter:saturate(0%);content:"";position:relative;display:inline-block;top:3px;margin-right:10px;' + styleElements.iconFilter + '}',
            '.wmeFdoScanAttributesDropdown { font-size:15px;margin-top:5px; }',
            '.wmeFdoScanAttributesLabel { margin-left:10px; }',
            '#wmeFdoStatusUsersList > li { margin-bottom:10px }',
            '.wmeFdoStatusUserDates { width:200px; }',
            '.wmeFdoStatusUserLatest { float:left; }',
            '.wmeFdoStatusUserEarliest { float:right; }',
            '.wmeFdoProgress {width:200px;height:5px;border:1px solid gray;border-radius:3px; }',
            '#wmeFdoScanStatusHeader .wmeFdoProgress { margin-top: 5px;margin-left: 27px; }',
            '.wmeFdoComplete { width:0%;height:4px;background-color:#5a7990; }',
            '.wmeFdoProgressIcon { transform: scale(1.3,-1) rotate(90deg); }',
            '.wmeFdoDropdownHeader { width: 80%; }',
            '#wmeFdoStatusSummary { margin-bottom:10px; }',
            '.wmeFdoHistorySummaryList > li { margin-bottom:2px; }',
            '</style>'
        ].join(' '));


        var $section = $('<div id="wmeFdoPanel">');
        $section.html(
            '<div id="wmeFdoHead">',

            '</div>'
        );

        var $navTabs = $('<ul id="wmeFdoSubTabs" class="nav nav-tabs"><li class="active"><a data-toggle="tab" href="#wmeFdoTabFind">Find</a></li>' +
                         '<li><a data-toggle="tab" href="#wmeFdoTabFlagged" id="wmeFdoTabFlagEvent">Flagged</a></li>' +
                         '<li><a data-toggle="tab" href="#wmeFdoTabSettings"><span class="fa fa-gear"></span></a></li></ul>');
        var $tabContent = $('<div class="tab-content" style="padding:5px;">');
        var $fdoTabFind = $('<div id="wmeFdoTabFind" class="tab-pane active">');
        $fdoTabFind.append([
            '<h4 style="margin-top:0px;">Find Deleted Objects</h4>',
            '<h6 style="margin-top:0px;">' + GM_info.script.version + '</h6>'
        ].join(' '));
        createSettingsCheckbox($fdoTabFind, 'wmeFdoNearbyEditors','Nearby Editors');
        $fdoTabFind.append([
            '<div class="controls-container" style="padding-top: 2px;"><div class="wmeFdoFormInputLabel">Editor Name</div><input type="text" id="wmeFdoEditorName" class="form-control wmeFdoFormInput"><label for="wmeFdoEditorName"></label></div><br>',
        ].join(' '));
        createSettingsCheckbox($fdoTabFind, 'wmeFdoIncludeSelf','Include Deletes By This Editor');
        createSettingsCheckbox($fdoTabFind, 'wmeFdoLimitToScreen','Limit to Screen');
        $fdoTabFind.append([
            '<div class="controls-container" style="padding-top: 2px;"><div class="wmeFdoFormInputLabel">Find Prior To</div><input type="text" id="wmeFdoFindDate" class="form-control wmeFdoFormInput"><label for="wmeFdoFindDate"></label></div><br>',
        ].join(' '));


        var $fdoTabFlagged = $('<div id="wmeFdoTabFlagged" class="tab-pane">');
        $fdoTabFlagged.html('<h4>Flagged Objects<h4>');
        let $fdoTabFlaggedResults = $('<div id="wmeFdoFlaggedResults>');
        $fdoTabFlagged.append($fdoTabFlaggedResults);

        var $fdoTabSettings = $('<div id="wmeFdoTabSettings" class="tab-pane">');
        $fdoTabSettings.append([
            '<h4>Settings</h4>',
            '<div id="wmeFdoSettings">',
            '<div class="controls-container" style="padding-top: 2px;">Rate Limit Delay: <input type="text" id="wmeFdoRateLimitDelay" ><label for="wmeFdoRateLimitDelay"></label></div>',
            '</div>'
        ].join(' '));

        $('#wmeFdoTabSettings').append('div').append('Reset Settings');

        $tabContent.append($fdoTabFind,$fdoTabFlagged,$fdoTabSettings);
        $section.append($navTabs, $tabContent);
        $section.append($style);

        let updateDesc = "<style>#wmeFdoUpdate > li {margin-top:6px;margin-left: -22px;}</style>This update addresses most known issues of the initial release:"
        + "<ul id='wmeFdoUpdate'>"
        + "<li><b>Better Rate Limiting</b><br>Completely rewritten API request layer.</li>"
        + "<li><b>Recreate Places</b><br>External Providers can now be added from Prod WME.</li>"
        + "<li><b>New Status Display</b><br>Shows the list of nearby editors used and the current progress. Completed scans now show correctly.</li>"
        + "<li><b>Filtering</b><br> </li>"
        + "<li><b>Result Type Icons</b><br>Different icons for Parking and Residential places</li>"
        + "</ul>"
        + "<span style='color:red'>Reminder that this is an SM+ script!</span>";

        updateDesc = 'Fixes browser freeze when starting a scan.<br><br>';

        //WazeWrap.Interface.ShowScriptUpdate("Find Deleted Objects", GM_info.script.version, updateDesc, "https://greasyfork.org/scripts/376861-wme-find-deleted-objects", "https://www.waze.com/forum/viewtopic.php?f=1286&t=275164&p=1922116#p1922116");

        new WazeWrap.Interface.Tab('FiDO', $section.html(), initializeSettings);
        prepareTab();

        WazeWrap.Interface.AddLayerCheckbox("display", "Deleted Objects", settings.Enabled, onLayerCheckboxChanged);
        onLayerCheckboxChanged(settings.Enabled);

        buildFilterSection('#wmeFdoTabFind');


        let buttons = document.createElement('div');
        buttons.className = 'wmeFdoButtonArea';
        $('#wmeFdoTabFind').append(buttons);

        var findButton = document.createElement('button');
        findButton.id = 'wmeFdoFindButton';
        findButton.textContent = 'Start Scan';
        findButton.className = 'btn btn-success center-block';
        buttons.append(findButton);

        var cancelButton = document.createElement('button');
        cancelButton.id = 'wmeFdoCancelButton';
        cancelButton.textContent = 'Cancel Scan';
        cancelButton.className = 'btn btn-warning center-block hidden';
        buttons.append(cancelButton);

        findButton.addEventListener('click', function() {
            findButton.className = 'btn btn-success center-block hidden';
            cancelButton.className = 'btn btn-danger center-block ';

            let tab = document.getElementById('wmeFdoTab');
            tab.innerHTML = 'FiDO <span class="spinner-enable"><i class="icon-spinner icon-spin fa fa-spinner fa-spin"></i></span>';
            $('#wmeFdoTabFind').data("status","running");

            settings.Enabled = true;
            onLayerCheckboxChanged(settings.Enabled); // TODO: Fix this so the Layer menu checkbox gets updated
            clearResults();
            beginScanNew();
            findObjects();
        });

        cancelButton.addEventListener('click', function() {
            cancelButton.textContent = 'Cancelling...';
            cancelButton.className = 'btn btn-warning center-block disabled';
            $('#wmeFdoTabFind').data("status","cancelled");
            let tab = document.getElementById('wmeFdoTab');
            tab.innerHTML = 'FiDO <span class="spinner-disable"><i class="icon-spinner icon-spin fa fa-spinner fa-spin"></i></span>';
            cancelScanNew();
            cancelScan(0);
        });

        $("#wmeFdoEditorName").keyup(function(event) {
            if (event.keyCode === 13) {
                $("#wmeFdoFindButton").click();
            }
        });

        $("#wmeFdoFindDate").keyup(function(event) {
            if (event.keyCode === 13) {
                $("#wmeFdoFindButton").click();
            }
        });

        $('#wmeFdoNearbyEditors').change(function() {
            var settingName = $(this)[0].id.substr(6);
            settings[settingName] = this.checked;
            saveSettings();
            if(this.checked)
            {
                $("#wmeFdoEditorName").prop('disabled', true);
                $("#wmeFdoIncludeSelf").prop('disabled', true);
                $("#wmeFdoLimitToScreen").prop('disabled', true);

            }
            else
            {
                $("#wmeFdoEditorName").prop('disabled', false);
                $("#wmeFdoIncludeSelf").prop('disabled', false);
                $("#wmeFdoLimitToScreen").prop('disabled', false);
            }
        });


        let flaggedTab = document.getElementById('wmeFdoTabFlagEvent');
        flaggedTab.addEventListener('click', function() {
            let flagList = '';
            for (var id in flags.venue) {
                flagList = flagList + id + '<br>';
                console.log(id);
            }
            let results = document.getElementById('wmeFdoTabFlagged');
            results.append(flagList);
        });

        var $usersDiv = $( '<div id="fdoUsersPanel"></div>');

        //var dateSpan = document.createElement('div');
        //dateSpan.id = 'wmeFdoStatusDate';
        //$('#wmeFdoTabFind').append(dateSpan);

        let inputDate = document.getElementById('wmeFdoFindDate');
        inputDate.value = formatCurrentDate();

        $('#wmeFdoTabFind').append(buildResultsPanel());

        console.log($('#wmeFdoFilterResidential')[0].id);
        $('#wmeFdoFilterResidential').change(function() {
            var settingName = $(this)[0].id.substr(6);
            settings[settingName] = this.checked;
            saveSettings();
            applyFiltersToResults();
        });
        $('#wmeFdoFilterParkingLot').change(function() {
            var settingName = $(this)[0].id.substr(6);
            settings[settingName] = this.checked;
            saveSettings();
            applyFiltersToResults();
        });
        $('#wmeFdoFilterAnyType').change(function() {
            var settingName = $(this)[0].id.substr(6);
            settings[settingName] = this.checked;
            saveSettings();
            applyFiltersToResults();
        });
        $('#wmeFdoFilterNewRejected').change(function() {
            var settingName = $(this)[0].id.substr(6);
            settings[settingName] = this.checked;
            saveSettings();
            applyFiltersToResults();
        });
        $('#wmeFdoFilterDeleteRequest').change(function() {
            var settingName = $(this)[0].id.substr(6);
            settings[settingName] = this.checked;
            saveSettings();
            applyFiltersToResults();
        });

        initializeSettings();
        console.log('FiDO: done');
    }

    function initializeSettings()
    {
        loadSettings();
        setChecked('wmeFdoIncludeSelf', settings.IncludeSelf);
        setChecked('wmeFdoLimitToScreen', settings.LimitToScreen);
        setChecked('wmeFdoNearbyEditors', settings.NearbyEditors);
        setChecked('wmeFdoFilterResidential', settings.FilterResidential);
        setChecked('wmeFdoFilterParkingLot', settings.FilterParkingLot);
        setChecked('wmeFdoFilterAnyType', settings.FilterAnyType);
        setChecked('wmeFdoFilterNewRejected', settings.FilterNewRejected);
        setChecked('wmeFdoFilterDeleteRequest', settings.FilterDeleteRequest);


        //   if(settings.Enabled)
        //      W.selectionManager.events.register("selectionchanged", null, drawSelection);

        $('.wmeFdoSettingsCheckbox').change(function() {
            var settingName = $(this)[0].id.substr(6);
            settings[settingName] = this.checked;
            saveSettings();
            if(this.checked)
            {
                //   W.selectionManager.events.register("selectionchanged", null, drawSelection);
                //   processVenues(W.model.venues.getObjectArray());
            }
            else
            {
                //  W.selectionManager.events.unregister("selectionchanged", null, drawSelection);
                //   wmeFdoSelectedLayer.removeAllFeatures();
                // processVenues(W.model.venues.getObjectArray());
            }
        });


        if(settings.NearbyEditors)
        {
            $("#wmeFdoEditorName").prop('disabled', true);
            $("#wmeFdoIncludeSelf").prop('disabled', true);
            $("#wmeFdoLimitToScreen").prop('disabled', true);

        }
        else
        {
            $("#wmeFdoEditorName").prop('disabled', false);
            $("#wmeFdoIncludeSelf").prop('disabled', false);
            $("#wmeFdoLimitToScreen").prop('disabled', false);
        }

        $('.wmeFdoSettingsText').on('input propertychange paste', function() {
            var settingName = $(this)[0].id.substr(6);
            settings[settingName] = parseInt($(this).val());
            saveSettings();

            //W.selectionManager.events.unregister("selectionchanged", null, drawSelection);
            //processVenues(W.model.venues.getObjectArray());
        });


    }

    function getWmeStyles() {
        // Get the sprite icons from the native WME CSS so that we can use our own document structure

        let styleElements = { };

        let $tempDiv = null;
        let tempQuerySelector = null;
        let tempComputedStyle = null;

        //.form-search .search-result-region .search-result .icon {
        //background-image: url(//editor-assets.waze.com/production/img/toolbare2f6b31….png);
        $tempDiv = $('<div class="form-search">').append($('<div class="search-result-region">').append($('<div class="search-result">').append($('<div class="icon">'))));
        $('body').append($tempDiv);
        tempQuerySelector = document.querySelector('.form-search .search-result-region .search-result .icon');
        tempComputedStyle = window.getComputedStyle(tempQuerySelector);
        styleElements.resultTypeVenueStyle =
            `background-image:${tempComputedStyle.getPropertyValue('background-image')};`
            + `background-size:${tempComputedStyle.getPropertyValue('background-size')};`
            + `background-position:${tempComputedStyle.getPropertyValue('background-position')};`
            + `width:${tempComputedStyle.getPropertyValue('width')};`
            + `height:${tempComputedStyle.getPropertyValue('height')};`;
        $tempDiv.remove();

        //#edit-buttons .camera .item-icon::after {
        //background-image: url(//editor-assets.waze.com/production/img/toolbare2f6b31….png);
        tempQuerySelector = document.querySelector("#primary-toolbar > div > div.toolbar-group.toolbar-group-drawing > wz-menu > div > wz-menu-item.toolbar-group-item.camera.WazeControlDrawFeature > div > div.item-icon");
        tempComputedStyle = window.getComputedStyle(tempQuerySelector,'::after');
        styleElements.resultTypeCameraStyle =
            `background-image:${tempComputedStyle.getPropertyValue('background-image')};`
            + `background-size:${tempComputedStyle.getPropertyValue('background-size')};`
            + `background-position:${tempComputedStyle.getPropertyValue('background-position')};`
            + `width:${tempComputedStyle.getPropertyValue('width')};`
            + `height:${tempComputedStyle.getPropertyValue('height')};`;

        //#edit-buttons .toolbar-group .toolbar-group-item .drawing-controls .drawing-control.polygon:after {
        //background-image: url(//editor-assets.waze.com/production/img/toolbare2f6b31….png);
        tempQuerySelector = document.querySelector("#primary-toolbar > div > div.toolbar-group.toolbar-group-venues > wz-menu > div > wz-menu-item.toolbar-group-item.car-services.WazeControlDrawFeature > div > div.drawing-controls > wz-basic-tooltip:nth-child(2) > wz-tooltip > wz-tooltip-source > wz-button").shadowRoot.querySelector("button")
        tempComputedStyle = window.getComputedStyle(tempQuerySelector,'::after');
        styleElements.resultTypeAreaStyle =
            `background-image:${tempComputedStyle.getPropertyValue('background-image')};`
            + `background-size:${tempComputedStyle.getPropertyValue('background-size')};`
            + `background-position:${tempComputedStyle.getPropertyValue('background-position')};`
            + `width:${tempComputedStyle.getPropertyValue('width')};`
            + `height:${tempComputedStyle.getPropertyValue('height')};`;

        // .toolbar .toolbar-button.add-house-number .item-icon {
        //background-image: url(//editor-assets.waze.com/production/img/toolbarcad3e90….png);
        //$tempDiv = $('<div class="toolbar">').append($('<div class="toolbar-button add-house-number">').append($('<div class="item-icon">')));
        //$('body').append($tempDiv);
        //tempQuerySelector = document.querySelector('.toolbar .toolbar-button.add-house-number .item-icon');
        //tempComputedStyle = window.getComputedStyle(tempQuerySelector);
        //styleElements.resultTypeResidential = `background-image:${tempComputedStyle.getPropertyValue('background-image')};`
        //    + `background-size:${tempComputedStyle.getPropertyValue('background-size')};`
        //    + `background-position:${tempComputedStyle.getPropertyValue('background-position')};`
        //    + `width:${tempComputedStyle.getPropertyValue('width')};`
        //    + `height:${tempComputedStyle.getPropertyValue('height')};`;
        //$tempDiv.remove();

        //#edit-buttons .parking-lot .item-icon::after {
        //background-image: url(//editor-assets.waze.com/production/img/toolbarcad3e90….png);
        //tempQuerySelector = document.querySelector('#edit-buttons .parking-lot .item-icon');
        //tempComputedStyle = window.getComputedStyle(tempQuerySelector,'::after');
        //styleElements.resultTypeParking = `background-image:${tempComputedStyle.getPropertyValue('background-image')};`
        //    + `background-size:${tempComputedStyle.getPropertyValue('background-size')};`
        //    + `background-position:${tempComputedStyle.getPropertyValue('background-position')};`
        //    + `width:${tempComputedStyle.getPropertyValue('width')};`
        //    + `height:${tempComputedStyle.getPropertyValue('height')};`;

        //#edit-panel .merge-landmarks .merge-item .do-merge:before, .edit-panel .merge-landmarks .merge-item .do-merge:before {
        //background-image: url(//editor-assets.waze.com/production/img/buttons756c103….png);
        $tempDiv = $('<div id="edit-panel">').append($('<div class="merge-landmarks">').append($('<div class="merge-item">').append($('<div class="do-merge">'))));
        $('body').append($tempDiv);
        tempQuerySelector = document.querySelector('#edit-panel .merge-landmarks .merge-item .do-merge');
        tempComputedStyle = window.getComputedStyle(tempQuerySelector, '::before');
        styleElements.iconFilter =
            `background-image:${tempComputedStyle.getPropertyValue('background-image')};`
            + `background-size:${tempComputedStyle.getPropertyValue('background-size')};`
            + `background-position:${tempComputedStyle.getPropertyValue('background-position')};`
            + `width:${tempComputedStyle.getPropertyValue('width')};`
            + `height:${tempComputedStyle.getPropertyValue('height')};`;
        $tempDiv.remove();

        //#edit-panel .merge-landmarks .merge-item .icon.parking_lot:after
        $tempDiv = $('<div id="edit-panel">').append($('<div class="merge-landmarks">').append($('<div class="merge-item">').append($('<div class="icon parking_lot">'))));
        $('body').append($tempDiv);
        tempQuerySelector = document.querySelector('#edit-panel .merge-landmarks .merge-item .icon.parking_lot');
        tempComputedStyle = window.getComputedStyle(tempQuerySelector, '::after');
        styleElements.resultTypeParkingNew =
            `background-image:${tempComputedStyle.getPropertyValue('background-image')};`
            + `background-size:${tempComputedStyle.getPropertyValue('background-size')};`
            + `background-position:${tempComputedStyle.getPropertyValue('background-position')};`
            + `width:${tempComputedStyle.getPropertyValue('width')};`
            + `height:${tempComputedStyle.getPropertyValue('height')};`;
        $tempDiv.remove();

        //#edit-panel .merge-landmarks .merge-item .icon.parking_lot:after
        $tempDiv = $('<div id="edit-panel">').append($('<div class="merge-landmarks">').append($('<div class="merge-item">').append($('<div class="icon residential_home">'))));
        $('body').append($tempDiv);
        tempQuerySelector = document.querySelector('#edit-panel .merge-landmarks .merge-item .icon.residential_home');
        tempComputedStyle = window.getComputedStyle(tempQuerySelector, '::after');
        styleElements.resultTypeResidentialNew =
            `background-image:${tempComputedStyle.getPropertyValue('background-image')};`
            + `background-size:${tempComputedStyle.getPropertyValue('background-size')};`
            + `background-position:${tempComputedStyle.getPropertyValue('background-position')};`
            + `width:${tempComputedStyle.getPropertyValue('width')};`
            + `height:${tempComputedStyle.getPropertyValue('height')};`;
        $tempDiv.remove();

        return styleElements;
    }

    function getWmeStyle(selector) {
        let $tempDiv = null;
        let tempQuerySelector = null;
        let tempComputedStyle = null;
        let returnedStyle = null;

        //.form-search .search-result-region .search-result .icon {
        //background-image: url(//editor-assets.waze.com/production/img/toolbare2f6b31….png);
        $tempDiv = $('<div class="form-search">').append($('<div class="search-result-region">').append($('<div class="search-result">').append($('<div class="icon">'))));
        $('body').append($tempDiv);
        tempQuerySelector = document.querySelector('.form-search .search-result-region .search-result .icon');
        tempComputedStyle = window.getComputedStyle(tempQuerySelector);
        returnedStyle =
            `background-image:${tempComputedStyle.getPropertyValue('background-image')};`
            + `background-size:${tempComputedStyle.getPropertyValue('background-size')};`
            + `background-position:${tempComputedStyle.getPropertyValue('background-position')};`
            + `width:${tempComputedStyle.getPropertyValue('width')};`
            + `height:${tempComputedStyle.getPropertyValue('height')};`;
        $tempDiv.remove();

        return returnedStyle;
    }

//historyContent
    //element-history-item


    function buildResultsPanel() {
        return $('<div id="fdoResultsPanel">')
            .append($('<div class="elementHistoryContainer">')
                    .append($('<div class="wmeFdoHistoryContent">')
                            .append($('<div class="transactions">')
                                    .append($('<ul id="wmeFdoTransactionList">'))
                                   )
                           )
                   );
    }

    function buildFilterSection(parentDivName) {
        let $section = $('<div id="wmeFdoFilterSection">')
        .append($('<div class="elementHistoryContainer">')
                .append($('<div class="wmeFdoHistoryContent">')
                        .append($('<div class="transactions">')
                                .append($('<ul id="wmeFdoFilter">')
                                        .append($('<li id="wmeFdoFilterDetails" class="wmeFdo-element-history-item wmeFdo-tx-has-content wmeFdo-tx-has-related closed">')
                                                .append($('<div id="wmeFdoFilterDetailsHeader" class="wmeFdo-tx-header">')
                                                        //   .append($('<div class="flex-noshrink wmeFdoIconFilter">')
                                                        //  )
                                                        //.append($('<div class="flex-noshrink">'))
                                                        .append($('<div class="wmeFdo-tx-summary wmeFdoDropdownHeader">')
                                                                .append($('<div class="wmeFdoIconFilterInline wmeFdoScanAttributesDropdown">Filter Results</div>'))
                                                               )
                                                        .append($('<div class="flex-noshrink wmeFdo-tx-toggle-closed">')
                                                               )
                                                       )
                                                .append($('<div class="wmeFdo-tx-content">')
                                                        .append($('<div id="wmeFdoFilterDetailsUsers">'))
                                                        .append($('<div id="wmeFdoFilterDetailsPlaces">'))
                                                        .append($('<div id="wmeFdoFilterDetailsCameras">')) //<ul><li class="tx-changed-attribute">'))
                                                       )
                                               )

                                        .append($('<li id="wmeFdoScanStatus" class="wmeFdo-element-history-item wmeFdo-tx-has-content wmeFdo-tx-has-related closed">')
                                                .append($('<div id="wmeFdoScanStatusHeader" class="wmeFdo-tx-header">')
                                                        //.append($('<div class="flex-noshrink">'))
                                                        .append($('<div class="wmeFdo-tx-summary wmeFdoDropdownHeader">')
                                                                .append($('<div class="wmeFdoScanAttributesDropdown">')
                                                                        .append($('<i class="fa fa-bar-chart wmeFdoProgressIcon" aria-hidden="true"></i>')

                                                                               ).append($('<span class="wmeFdoScanAttributesLabel"><span id="wmeFdoScanCurrentStatus">Status</span></span>'))
                                                                       ).append($('<div class="wmeFdoProgress hidden"><div class="wmeFdoComplete"></div></div>')
                                                                               ))
                                                        .append($('<div class="flex-noshrink wmeFdo-tx-toggle-closed">')
                                                               )
                                                       )
                                                .append($('<div class="wmeFdo-tx-content">')
                                                        .append($('<div id="wmeFdoStatusSummary">')
                                                                .append($('<div><span>Total Requests: </span><span id="wmeFdoRequests">0<span></div>'))
                                                                .append($('<div><span>Requests per second: </span><span id="wmeFdoRequestsPerSecond">0<span></div>'))
                                                               )
                                                        .append($('<div id="wmeFdoStatusUsers">')
                                                                .append($('<ul id="wmeFdoStatusUsersList">')
                                                                       ))
                                                       )
                                               )
                                       )
                               )
                       )
               );

        let $parentDiv = $(parentDivName);
        $parentDiv.append($section);

        //   $('#wmeFdoFilterDetailsUsers').append([
        //       '<div class="controls-container" style="padding-top: 2px;"><div class="wmeFdoFormInputLabel">Editor Name</div><input type="text" id="wmeFdoFilterEditorName" class="form-control wmeFdoFormInput"><label for="wmeFdoFilterEditorName"></label></div><br>',
        //   ].join(' '));
        let $placeTypes = $('<ul>');
        let $placeTypeLi = $('<li class="tx-changed-attribute">');
        $placeTypes.append($placeTypeLi);
        $('#wmeFdoFilterDetailsPlaces').append($placeTypes);
        $placeTypeLi.append(['<div class="ca-name">Place Types</div>'].join(' '));
        createSettingsCheckbox($placeTypeLi, 'wmeFdoFilterResidential','Residential');
        createSettingsCheckbox($placeTypeLi, 'wmeFdoFilterParkingLot','Parking Lots');
        createSettingsCheckbox($placeTypeLi, 'wmeFdoFilterAnyType','All Other Types');

        let $purTypes = $('<ul>');
        let $purTypeLi = $('<li class="tx-changed-attribute">');
        $purTypes.append($purTypeLi);
        $('#wmeFdoFilterDetailsPlaces').append($purTypes);
        $purTypeLi.append(['<div class="ca-name">Deleted From PUR</div>'].join(' '));
        createSettingsCheckbox($purTypeLi, 'wmeFdoFilterNewRejected','New Place Rejected PUR');
        createSettingsCheckbox($purTypeLi, 'wmeFdoFilterDeleteRequest','Existing Place Delete Request');
        //   $('#wmeFdoFilterDetailsPlaces').append([
        //       '<div class="controls-container" style="padding-top: 2px;"><div class="wmeFdoFormInputLabel">Place Name</div><input type="text" id="wmeFdoFilterPlaceName" class="form-control wmeFdoFormInput"><label for="wmeFdoFilterPlaceName"></label></div><br>',
        //   ].join(' '));

        document.getElementById('wmeFdoFilterDetailsHeader').onclick = function () {
            toggleFilterDropDown();
        }

        document.getElementById('wmeFdoScanStatusHeader').onclick = function () {
            toggleScanStatusDropDown();
        }
    }

    function onLayerCheckboxChanged(checked) {
        settings.Enabled = checked;
        if (settings.Enabled && _wmeFdoFeatureLayer != undefined) {
            _wmeFdoFeatureLayer.setVisibility(true);
            _wmeFdoMarkerLayer.setVisibility(true);
        } else if (_wmeFdoFeatureLayer != undefined) {
            _wmeFdoFeatureLayer.setVisibility(false);
            _wmeFdoMarkerLayer.setVisibility(false);
        }
        saveSettings();
    }

    function clearResults() {
        if (_wmeFdoFeatureLayer != undefined) {
            _wmeFdoFeatureLayer.removeAllFeatures();
            _wmeFdoMarkerLayer.clearMarkers();
        }
        apiEndpointWazeCom = {};
        userProgress = [];
        userCache = [];
        seenVenueIds = [];
        requestStatus = {};
        document.getElementById('wmeFdoTransactionList').innerHTML = '';
        $('#wmeFdoStatusUsersList').empty();
        $('#wmeFdoScanStatusHeader .wmeFdoProgress .wmeFdoComplete').css('width','0%');
    }

    function cancelScan(tries) {
        //TODO: Move rest of cancel code into here

        tries = tries || 1;
        //console.log('incomplete: ' + incompleteRequestCount());
        if (incompleteRequestCount() > 0 && tries < 10) {
            console.log('Cancel requested, waiting for ' + incompleteRequestCount() + ' requests to complete');
            setTimeout(function () {cancelScan(tries++);}, 500);
        } else {
            // TODO: Change button to Start Scan
            let findButton = document.getElementById('wmeFdoFindButton');
            let cancelButton = document.getElementById('wmeFdoCancelButton');
            findButton.className = 'btn btn-success center-block';
            cancelButton.className = 'btn btn-warning center-block hidden';
            cancelButton.textContent = 'Cancel Scan';
            //$('#wmeFdoStatusDate')[0].innerText = 'Scan Cancelled';
            console.log('Cancelled');
        }
    }

    function incompleteRequestCount() {
        let incompleteCount = 0;
        let failedCount = 0;
        Object.keys(requestStatus).forEach(function (url) {
            if (requestStatus[url].status != 'successful') {
                if (Date.now() - requestStatus[url].lastAttempt < 10000) {
                    incompleteCount++;
                } else {
                    failedCount++;
                }
            }
        });
        return incompleteCount;
    }

    function defaultRequestStatus() {
        return {
            status: 'initial',
            attempts: 0,
            lastAttempt: null
        };
    }

    function requestParams(url) {
        return {
            url: url,
            iteration: 0,
            nextTransactionDate: null,
            initiated: Date.now()
        }
    }

    async function beginFind(lookFor, transactionLookup) {
        // var findCenterPoint = new OL.Geometry.Point(lookFor.locationCenter.coordinates[0], lookFor.locationCenter.coordinates[1]).transform(W.map.displayProjection, W.map.projection);

        if ( $('#wmeFdoTabFind').data("status") == "running"
            && transactionLookup.iteration < transactionLookup.maxIterations
           )
        {
            transactionLookup.iteration++;

            let requestParamsTransactions = requestParams(getApiUrlTransactions(transactionLookup.userId, transactionLookup.nextTransactionDate));
            requestStatus[requestParamsTransactions.url] = defaultRequestStatus();
            apiEndpointWazeCom.requests.push(requestParamsTransactions);
            getEndpointResult(apiEndpointWazeCom, requestParamsTransactions, data => {
                if (apiEndpointWazeCom.isRunning) {

                    if (typeof(data) == 'undefined') {
                        console.log('Request failed.');

                    }

                    transactionLookup.nextTransactionDate = data.nextTransactionDate
                    let nextDate = 'Complete';
                    if (data.nextTransactionDate != null)
                    {
                        nextDate = uuidToDate(data.nextTransactionDate);
                        //$('#wmeFdoStatusDate')[0].innerText = 'Scanning thru ' + nextDate + '...';
                        $('#wmeFdoScanCurrentStatus')[0].innerText = 'Scanning...';
                    }


                    var transactionCount = 0;
                    data.transactions.forEach(function(transaction) {
                        transaction.operations.forEach(async function(operation) {
                            if (operation.objectType == lookFor.objectType || operation.objectType == 'Camera')
                            {
                                transactionCount++;
                                var operationCenterPoint = new OpenLayers.Geometry.Point(operation.objectCentroid.coordinates[0], operation.objectCentroid.coordinates[1]).transform(displayProjection, projection);
                                //var distance = operationCenterPoint.distanceTo(findCenterPoint);
                                //if (distance < 1000)
                                if (!lookFor.limitToScreen || lookFor.searchArea.containsPoint(operationCenterPoint))
                                {
                                    if (operation.objectType == 'Camera') {
                                        console.log('camera: ' + operation.objectID);
                                    } else {
                                        if (!seenVenueIds.includes(operation.objectID))
                                        {
                                            getDeletedItemsVenue(operation, transactionLookup, lookFor, operationCenterPoint);
                                        } //else { console.log('already seen: ' + operation.objectID); }
                                    }
                                }
                            }
                        });
                    });

                    let earliestDate = userCache[transactionLookup.userId].earliestDate - DAY_MS;
                    let statusDate = 0;
                    let pctComplete = 100;

                    if (transactionLookup.nextTransactionDate != null) {
                        statusDate = uuidToUnixTime(transactionLookup.nextTransactionDate);
                        let latestDate = userCache[transactionLookup.userId].latestDate + DAY_MS;
                        //let earliestDate = userCache[transactionLookup.userId].earliestDate - DAY_MS;
                        let next = uuidToDate(transactionLookup.nextTransactionDate);

                        let totalTime = latestDate - earliestDate;
                        let progressTime = latestDate - statusDate;

                        pctComplete = (progressTime / totalTime) * 100;
                        // pctComplete = 100 - pctComplete;

                        let newCompletedMs = userCache[transactionLookup.userId].previousDate - statusDate;
                        apiEndpointWazeCom.progress.completeMs += newCompletedMs;
                        userCache[transactionLookup.userId].completeMs += newCompletedMs;
                    }

                    if (transactionLookup.nextTransactionDate == null || statusDate < earliestDate) {
                        apiEndpointWazeCom.users.complete++;
                        apiEndpointWazeCom.progress.completeMs -= userCache[transactionLookup.userId].completeMs;
                        apiEndpointWazeCom.progress.completeMs += userCache[transactionLookup.userId].totalMs;
                        updateStatusUser(transactionLookup.userId, 'Complete');

                        $('#wmeFdoStatusUser-' + transactionLookup.userId + ' .wmeFdoProgress .wmeFdoComplete').css('width','100%');

                        endScan("Scanning...", false);
                    } else {
                        updateStatusUser(transactionLookup.userId, uuidToDate(transactionLookup.nextTransactionDate));
                        $('#wmeFdoStatusUser-' + transactionLookup.userId + ' .wmeFdoProgress .wmeFdoComplete').css('width',pctComplete + '%');
                        userCache[transactionLookup.userId].previousDate = statusDate;
                        beginFind(lookFor, transactionLookup);
                    }
                }
            });
        } else {
            if (transactionLookup.iteration >= transactionLookup.maxIterations)
            {
                endScan("Transaction Limit Exceeded", false);
            }
        }
    }

    function updateStatusUser(userID, status) {
        $('#wmeFdoStatusUser-' + userID + ' .wmeFdoStatusUser').text(status);
        let pctComplete = (apiEndpointWazeCom.progress.completeMs / apiEndpointWazeCom.progress.totalMs) * 100;

        if (status == 'Complete') {
            $('#wmeFdoStatusUser-' + userID).appendTo('#wmeFdoStatusUsersList');
            userCache[userID].completeMs = userCache[userID].totalMs;
            //pctComplete = 100;
        }
        $('#wmeFdoScanStatusHeader .wmeFdoProgress .wmeFdoComplete').css('width',pctComplete + '%');
    }

    async function getDeletedItemsVenue(operation, transactionLookup, lookFor, operationCenterPoint) {
        //console.log('element history for ' + data.nextTransactionDate);
        let requestParamsElementHistory = requestParams(getApiUrlElementHistory('venue', operation.objectID, null));
        requestStatus[requestParamsElementHistory.url] = defaultRequestStatus();
        apiEndpointWazeCom.requests.push(requestParamsElementHistory);
        getEndpointResult(apiEndpointWazeCom, requestParamsElementHistory, venueHistory => {
            if (apiEndpointWazeCom.isRunning) {
                venueHistory.transactions.objects.forEach(function(venueTransaction) {
                    venueTransaction.objects.forEach(function(venueAction) {
                        if (venueAction.actionType == 'DELETE') {
                            //             console.log(venueAction);
                            if (venueAction.objectType == 'venue' && venueAction.oldValue != null)
                            {
                                let selfDelete = false;
                                if (transactionLookup.userId == venueTransaction.userID) {
                                    selfDelete = true;
                                }

                                if (lookFor.includeSelf || !selfDelete) {
                                    // Skip if searching for editor who deleted it
                                    if (!seenVenueIds.includes(venueAction.objectID))
                                    {
                                        seenVenueIds.push(venueAction.objectID);

                                        let historySummary = getVenueHistory(venueHistory);

                                        var record = document.createElement('div');
                                        record.id=venueTransaction.transactionID;
                                        let username = null;
                                        venueHistory.users.objects.forEach( function(user) {
                                            if (user.id == venueTransaction.userID) {
                                                let userRank = user.rank + 1;
                                                username = user.userName + '(' + userRank + ')';
                                            }
                                        });


                                        record.innerText = username + ": " + venueAction.oldValue.name + " - " + venueAction.objectID;

                                        var details = document.createElement('li');
                                        details.id = 'entry-' + venueAction.objectID;
                                        details.className = 'wmeFdo-element-history-item wmeFdo-tx-has-content wmeFdo-tx-has-related closed';

                                        var txHeader = document.createElement('div');
                                        txHeader.className = 'wmeFdo-tx-header';
                                        let detailsDisplayedOnce = false;
                                        txHeader.onclick = function () {

                                            if (!detailsDisplayedOnce && details.classList.contains('closed')) {
                                                detailsDisplayedOnce = true;
                                                displayExternalProviders(venueAction.objectID, venueItem.externalProviderIDs);
                                            }
                                            toggleDetailsDropDown(details.id, operationCenterPoint);
                                        };

                                        var txTypeDiv = document.createElement('div');
                                        txTypeDiv.className = 'flex-noshrink';
                                        txHeader.append(txTypeDiv);

                                        var txTypeIcon = document.createElement('div');
                                        // class name populated after venueItem is defined
                                        txTypeDiv.append(txTypeIcon);

                                        var txSummary = document.createElement('div');
                                        txSummary.className = 'wmeFdo-tx-summary wmeFdoDropdownHeader';
                                        txHeader.append(txSummary);

                                        var txCollapse = document.createElement('div');
                                        txCollapse.className = 'flex-noshrink wmeFdo-tx-toggle-closed';
                                        txHeader.append(txCollapse);

                                        var txAuthorDate = document.createElement('div');
                                        txAuthorDate.className = 'wmeFdo-tx-author-date';

                                        var txPreview = document.createElement('div');
                                        txPreview.className = 'wmeFdo-tx-preview';


                                        var txName = document.createElement('h4');
                                        //txName.className = 'type';
                                        txAuthorDate.append(txName);

                                        txSummary.append(txAuthorDate);
                                        txSummary.append(txPreview);

                                        var txContent = document.createElement('div');
                                        txContent.className = 'wmeFdo-tx-content wmeFdoResultDetail';

                                        var txContentClass = document.createElement('div');
                                        txContentClass.className = 'main-object-region wmeFdo-tx-changes';
                                        txContent.append(txContentClass);

                                        var txContentInfo = document.createElement('div');
                                        txContentInfo.className = 'related-objects-region wmeFdo-tx-changes';

                                        var txContentData = document.createElement('div');

                                        var controls = document.createElement('div');
                                        controls.className = 'wmeFdoDetailControls';
                                        txContent.append(controls);

                                        txContentInfo.append(txContentData);
                                        txContent.append(txContentInfo);

                                        details.append(txHeader);
                                        details.append(txContent);

                                        var venueItem = venueAction.oldValue;

                                        if (typeof(venueItem.geometry) == 'undefined') {
                                            // History does not contain any details for this place, other than it was deleted.
                                            // TODO: create empty record to at least show that there was something here at one point.
                                            console.log(`No history found for venue id ${venueAction.objectID}`);
                                        } else {
                                            if (typeof(venueItem.categories) != 'undefined' && venueItem.categories[0] == 'RESIDENCE_HOME') {
                                                txTypeIcon.className = 'flex-noshrink wmeFdoResultTypeResidential';
                                                if (historySummary.isRejectedNew) {
                                                    txTypeIcon.classList.add('wmeFdoResultDeletedNewPlaceAlt');
                                                } else if (historySummary.isAcceptedDelete) {
                                                    txTypeIcon.classList.add('wmeFdoResultDeletedFromRequestAlt');
                                                }
                                            } else if (typeof(venueItem.categories) != 'undefined' && venueItem.categories[0] == 'PARKING_LOT') {
                                                txTypeIcon.className = 'flex-noshrink wmeFdoResultTypeParking';
                                                if (historySummary.isRejectedNew) {
                                                    txTypeIcon.classList.add('wmeFdoResultDeletedNewPlaceAlt');
                                                } else if (historySummary.isAcceptedDelete) {
                                                    txTypeIcon.classList.add('wmeFdoResultDeletedFromRequestAlt');
                                                }
                                            } else {
                                                txTypeIcon.className = 'flex-noshrink wmeFdoResultTypeVenue';
                                                if (historySummary.isRejectedNew) {
                                                    txTypeIcon.classList.add('wmeFdoResultDeletedNewPlace');
                                                } else if (historySummary.isAcceptedDelete) {
                                                    txTypeIcon.classList.add('wmeFdoResultDeletedFromRequest');
                                                }
                                            }

                                            if (historySummary.isRejectedNew) {
                                                details.setAttribute("data-pur-new-rejected", "true");
                                            }

                                            if (venueItem.geometry.type == 'Polygon') {
                                                var txTypeArea = document.createElement('div');
                                                txTypeArea.className = 'flex-noshrink wmeFdoResultTypeArea';
                                                txTypeDiv.append(txTypeArea);
                                            }


                                            let streetName = formatFullStreetName(venueHistory, venueItem.streetID);
                                            let address = streetName;
                                            if (typeof(venueItem.houseNumber) != 'undefined') {
                                                address = venueItem.houseNumber + ' ' + address;
                                            }

                                            var venueName = venueItem.name;
                                            if (typeof venueName == 'undefined' || venueName == " " || venueName == "")
                                            {
                                                if (typeof(venueItem.categories) != 'undefined' && venueItem.categories[0] == 'RESIDENCE_HOME') {
                                                    let resiStreet = formatStreetName(venueHistory, venueItem.streetID);
                                                    if (typeof(venueItem.houseNumber) != 'undefined') {
                                                        resiStreet = venueItem.houseNumber + ' ' + resiStreet;
                                                    }
                                                    venueName = resiStreet;
                                                } else if (typeof(venueItem.categories) != 'undefined') {
                                                    venueName = 'unnamed ' + I18n.t("venues.categories." + venueItem.categories[0]);
                                                } else {
                                                    venueName = 'unnamed';
                                                    //console.log('No category: ' + venueAction.objectID);
                                                }
                                            }

                                            txName.innerText = venueName;

                                            if (historySummary.purDeletedBy != null)
                                            {
                                                username = historySummary.purDeletedBy;
                                            }

                                            txPreview.innerHTML = streetName + '<br>Deleted by ' + username + " " + timeConverterNoTime(venueTransaction.date);
                                            if (historySummary.isAcceptedDelete) {
                                                //txPreview.innerHTML += " via PUR";
                                                details.setAttribute("data-pur-delete-request", "true");
                                            }

                                            var info = document.createElement('div');
                                            info.id = 'details-' + venueAction.objectID;

                                            let flagControl = document.createElement('div');
                                            flagControl.className = 'focus-buttons';
                                            let flag = document.createElement('a');
                                            flag.className = 'wmeFdoFlag';
                                            if (flags['venue'][venueAction.objectID]) { flag.className = 'wmeFdoFlag flagged'; }
                                            flag.innerHTML = '<span class="fa fa-flag"></span>';
                                            flag.onclick = function () {
                                                toggleFlag(flag, 'venue', venueAction.objectID);
                                            };
                                            flagControl.append(flag);
                                            controls.append(flagControl);

                                            var focusButtons = document.createElement('div');
                                            focusButtons.className = 'focus-buttons';

                                            var focus = document.createElement('a');
                                            focus.className = 'focus';
                                            focus.onclick = function () {
                                                var lonLat = new OpenLayers.LonLat(operationCenterPoint.x, operationCenterPoint.y);
                                                W.map.setCenter(lonLat, 6);
                                                highlightPin(pin);
                                            };
                                            focusButtons.append(focus);
                                            controls.append(focusButtons);

                                            let lockRank = venueItem.lockRank +1;
                                            txContentData.append(info);
                                            let searchText = venueItem.name + " " + streetName;

                                            var searchButton = document.createElement('button');
                                            searchButton.textContent = 'Google';
                                            searchButton.className = 'wmeFdoGoogleBtn btn btn-default center-block';
                                            searchButton.addEventListener('click', function() {
                                                window.open('https://www.google.com/search?q=' + encodeURIComponent(searchText),'_blank');
                                            });

                                            let recreateDiv = document.createElement('div');
                                            recreateDiv.className = 'wmeFdoRecreate';

                                            let recreateButton = document.createElement('a');
                                            recreateButton.textContent = 'Recreate Place';
                                            recreateButton.className = 'focus';
                                            recreateButton.addEventListener('click', function() {
                                                recreatePlace(venueItem, venueHistory, operationCenterPoint);
                                            });
                                            recreateDiv.append(recreateButton);

                                            txContentData.append(searchButton);
                                            txContentData.append(recreateDiv);

                                            let panelHTML = '<ul>';
                                            //panelHTML += '<ul>';

                                            let venueIdReference = 'details-venue-id-' + venueAction.objectID;
                                            panelHTML+= '<li class="tx-changed-attribute"><div class="ca-name">Venue ID</div>';
                                            panelHTML += '<div class="ca-description ca-preview" id="' + venueIdReference + '">';
                                            panelHTML += '</div></li>';

                                            if (address != null && address != "" && address != " ") {
                                                panelHTML+= '<li class="tx-changed-attribute"><div class="ca-name">Address</div>';
                                                panelHTML += '<div class="ca-description ca-preview">';
                                                panelHTML += address;
                                                panelHTML += '</div></li>';
                                            }

                                            panelHTML+= '<li class="tx-changed-attribute"><div class="ca-name">Categories</div>';
                                            panelHTML += '<div class="ca-description ca-preview">';
                                            panelHTML += formatCategories(venueItem.categories);
                                            details.setAttribute("data-categories", formatCategoriesNative(venueItem.categories));
                                            panelHTML += '</div></li>';

                                            if (typeof(venueItem.description) != 'undefined') {
                                                panelHTML+= '<li class="tx-changed-attribute"><div class="ca-name">Description</div>';
                                                panelHTML += '<div class="ca-description ca-preview">';
                                                panelHTML += venueItem.description;
                                                panelHTML += '</div></li>';
                                            }

                                            if (typeof(venueItem.url) != 'undefined') {
                                                panelHTML+= '<li class="tx-changed-attribute"><div class="ca-name">Website</div>';
                                                panelHTML += '<div class="ca-description ca-preview">';
                                                panelHTML += venueItem.url;
                                                panelHTML += '</div></li>';
                                            }

                                            if (typeof(venueItem.phone) != 'undefined') {
                                                panelHTML+= '<li class="tx-changed-attribute"><div class="ca-name">Phone</div>';
                                                panelHTML += '<div class="ca-description ca-preview">';
                                                panelHTML += venueItem.phone;
                                                panelHTML += '</div></li>';
                                            }

                                            if (typeof(venueItem.lockRank) != 'undefined') {
                                                panelHTML+= '<li class="tx-changed-attribute"><div class="ca-name">Lock Rank</div>';
                                                panelHTML += '<div class="ca-description ca-preview">';
                                                panelHTML += lockRank;
                                                panelHTML += '</div></li>';
                                            }

                                            if (typeof(venueItem.externalProviderIDs) != 'undefined') {
                                                panelHTML+= '<li class="tx-changed-attribute"><div class="ca-name">External Provider IDs</div>';
                                                panelHTML += '<div class="ca-description ca-preview">';
                                                panelHTML += '<div id="wmeFdoExternalProviders-' + venueAction.objectID + '"></div>';
                                                panelHTML += '</div></li>';
                                            }

                                            panelHTML+= '<li class="tx-changed-attribute"><div class="ca-name">History</div>';
                                            panelHTML += '<div class="ca-description ca-preview">';
                                            panelHTML += historySummary.html;
                                            panelHTML += '</div></li>';


                                            panelHTML += '</ul>';
                                            info.innerHTML = panelHTML;



                                            //info.innerHTML += 'Changed from';
                                            //info.innerHTML += '<span class="ca-value ca-value-old">';
                                            //info.innerHTML += 'Walmart';
                                            //info.innerHTML += '</span>';
                                            //info.innerHTML += '<span>';
                                            //info.innerHTML += 'to';
                                            //info.innerHTML += '</span>';
                                            //info.innerHTML += '<span class="ca-value ca-value-new">';
                                            //info.innerHTML += 'Walmart Supercenter';
                                            //info.innerHTML += '</span>';

                                            $('#wmeFdoTransactionList').append(details);

                                            let venueIdDiv = document.getElementById(venueIdReference);
                                            let venueIdLi = document.getElementById(details.id);
                                            setFilteredState(venueIdLi);

                                            let venueIdDisplay = document.createElement('span');
                                            if (W.loginManager.user.userName == "Joyriding") {
                                                venueIdDisplay.innerHTML = `<a href="https://${window.location.host}${W.Config.api_base}/ElementHistory?objectType=venue&objectID=${venueAction.objectID}" target="_blank">${venueAction.objectID}</a> `;
                                            } else {
                                                venueIdDisplay.innerHTML = venueAction.objectID;
                                            }
                                            venueIdDiv.append(venueIdDisplay);

                                            let pin = displayPin(operation, venueAction.oldValue);
                                            let areaPreview = null;

                                            details.onmouseenter = function () {
                                                highlightPin(pin);
                                                areaPreview = showDeletedArea(operation, venueAction.oldValue);
                                            };
                                            details.onmouseleave = function () {
                                                returnPin(pin);
                                                //removeDeletedArea();
                                                _wmeFdoFeatureLayer.removeFeatures([areaPreview]);
                                            };
                                        }

                                    }
                                }

                            }
                        }
                    });

                });
            }
        });
    }

    function toggleFlag (control, objectType, objectID) {
        if (flags[objectType][objectID]) {
            delete flags[objectType][objectID];
            control.className = 'wmeFdoFlag';
        } else {
            flags[objectType][objectID] = true;
            control.className = 'wmeFdoFlag flagged';
        }
    }

    function displayDetails() {

    }

    async function recreatePlace(origVenue, venueHistory, operationCenterPoint) {
        let lonLat = new OpenLayers.LonLat(operationCenterPoint.x, operationCenterPoint.y);
        if(!W.map.getExtent().containsLonLat(lonLat)) {
            // Move to pin so that the City can be populated correctly
            W.map.setCenter(lonLat, 6);
            await wait(1000); //TODO: Check to see that cities have loaded before continuing rather than guessing a time delay
        }

        let wazeActionUpdateFeatureGeometry = require("Waze/Action/UpdateFeatureGeometry");
        let wazefeatureVectorLandmark = require("Waze/Feature/Vector/Landmark");
        let wazeActionAddLandmark = require("Waze/Action/AddLandmark");
        let wazeActionUpdateObject = require('Waze/Action/UpdateObject');
        let wazeActionUpdateFeatureAddress = require('Waze/Action/UpdateFeatureAddress');
        let wazeOpeningHour = require("Waze/Model/Objects/OpeningHour");

        let landmark = new wazefeatureVectorLandmark();
        if (origVenue.geometry.type == 'Polygon') {
            let points = [];
            origVenue.geometry.coordinates[0].forEach( function(coord) {
                let point = new OpenLayers.Geometry.Point(coord[0],coord[1]);
                point.transform(displayProjection,projection);
                points.push(point);
            });
            points.push(points[0]);
            let linearRing = new OpenLayers.Geometry.LinearRing(points);
            let polygon = new OpenLayers.Geometry.Polygon(linearRing);
            landmark.geometry = polygon;
        } else {
            let point = new OpenLayers.Geometry.Point(origVenue.geometry.coordinates[0],origVenue.geometry.coordinates[1]);
            point.transform(displayProjection,projection);
            landmark.geometry = point;
        }

        if (typeof(origVenue.name) != 'undefined') { landmark.attributes.name = origVenue.name; }
        if (typeof(origVenue.aliases) != 'undefined') { landmark.attributes.aliases = origVenue.aliases; }
        if (typeof(origVenue.categories) != 'undefined') { landmark.attributes.categories = origVenue.categories; }
        if (typeof(origVenue.description) != 'undefined') { landmark.attributes.description = origVenue.description; }
        if (typeof(origVenue.lockRank) != 'undefined') { landmark.attributes.lockRank = origVenue.lockRank; }
        if (typeof(origVenue.phone) != 'undefined') { landmark.attributes.phone = origVenue.phone; }
        if (typeof(origVenue.rank) != 'undefined') { landmark.attributes.rank = origVenue.rank; }
        if (typeof(origVenue.residential) != 'undefined') { landmark.attributes.residential = origVenue.residential; }
        if (typeof(origVenue.services) != 'undefined') { landmark.attributes.services = origVenue.services; }
        if (typeof(origVenue.url) != 'undefined') { landmark.attributes.url = origVenue.url; }

        if (origVenue.categories.indexOf('GAS_STATION') > -1 || origVenue.categories.indexOf('PARKING_LOT') > -1) {
            if (typeof(origVenue.brand) != 'undefined') { landmark.attributes.brand = origVenue.brand; }
        }

        if (origVenue.categories.indexOf('PARKING_LOT') > -1)
        {
            if (typeof(origVenue.categoryAttributes) != 'undefined') { landmark.attributes.categoryAttributes = origVenue.categoryAttributes; }
        }

        if (typeof(origVenue.entryExitPoints) != 'undefined') { //TODO: and if # entry points > 0
            origVenue.entryExitPoints.forEach(function(origEntryExitPoint) {
                let point = new OpenLayers.Geometry.Point(origEntryExitPoint.point.coordinates[0],origEntryExitPoint.point.coordinates[1]);
                point.transform(displayProjection, projection);
                let entryExitPoint = new NavigationPointMEP(point);

                entryExitPoint._name = origEntryExitPoint.name;
                entryExitPoint._entry = origEntryExitPoint.entry;
                entryExitPoint._exit = origEntryExitPoint.exit;
                entryExitPoint._isPrimary = origEntryExitPoint.primary;

                landmark.attributes.entryExitPoints.push(entryExitPoint);
            });
        }

        W.model.actionManager.add(new wazeActionAddLandmark(landmark));

        if (typeof(origVenue.openingHours) != 'undefined') {
            let hours = [];
            origVenue.openingHours.forEach(function (hourEntry) {
                hours.push(new wazeOpeningHour(hourEntry));
            });
            W.model.actionManager.add(new wazeActionUpdateObject(landmark, { openingHours: hours }));
        }

        if (typeof(origVenue.streetID) != 'undefined') {

            //TODO: Make this a separate function and use for all address building, cache after built by streetID
            var addressParts = {
                streetName: "",
                emptyStreet: false,
                cityName: "",
                emptyCity: false,
                streetID: origVenue.streetID,
                stateID: null,
                countryID: null,
                addressFormShown: false,
                editable: true,
                fullAddress: "",
                ttsLocales: [W.Config.tts.default_locale],
                altStreets: new Backbone.Collection,
                newAltStreets: new Backbone.Collection
            };

            venueHistory.streets.objects.forEach(function(street) {
                if (street.id == origVenue.streetID) {
                    if (street.name == "")
                        addressParts.emptyStreet = true;
                    addressParts.streetName = street.name;

                    venueHistory.cities.objects.forEach(function(city) {
                        if (street.cityID == city.id) {
                            if (city.name == "")
                                addressParts.emptyCity = true;
                            addressParts.cityName = city.name;
                            addressParts.stateID = city.stateID;
                            venueHistory.states.objects.forEach(function(state) {
                                if (city.stateID == state.id) {
                                    addressParts.countryID = state.countryID;

                                }
                            });
                        }
                    });
                }
            });


            W.model.actionManager.add(new wazeActionUpdateFeatureAddress(landmark, addressParts,{streetIDField: 'streetID'}));
        }

        if (typeof(origVenue.houseNumber) != 'undefined') {
            W.model.actionManager.add(new wazeActionUpdateObject(landmark,{houseNumber: origVenue.houseNumber}));
        }

        //console.log(landmark);

        let foundFeature = null;
        W.selectionManager._layers.forEach(function(layer) {
            if (layer.featureType == 'venue') {
                layer.features.forEach(function(feature) {
                    if (landmark.geometry.id == feature.geometry.id)
                    {
                        foundFeature = feature;
                    }
                });
            }
        });
        if (foundFeature != null) {
            W.selectionManager.selectFeature(foundFeature);
            W.selectionManager._triggerSelectionChanged()
        }


        var epm = Backbone.Model.extend({
            defaults: {
                uuid: null,
                name: null,
                url: null,
                location: null
            },
            initialize: function() {
                if (null === this.get("uuid")) return this.set({
                    uuid: this.id
                })
            },
            getDetails: function(e) {
                this.set({uuid: e});
                return this.set({
                    name: externalProviderDetails[e].name,
                    location: externalProviderDetails[e].geometry.location,
                    url: externalProviderDetails[e].url
                });

            },
            _getDetailsFromUuid: function(e) {
                return this.set({
                    name: this.get("uuid"),
                    location: "",
                    url: ""
                })
            },
            toJSON: function() {
                return this.get("uuid")
            }
        });

        if (typeof(origVenue.externalProviderIDs) != 'undefined') {
            let ids = [];
            origVenue.externalProviderIDs.forEach(function(externalProviderID) {
                let newID = new epm();
                newID.getDetails(externalProviderID);
                newID.collection = new Backbone.Collection();
                ids.push(newID);
            }); //10521
            W.model.actionManager.add(new wazeActionUpdateObject(landmark,{externalProviderIDs: ids}));
        }
    }

    function displayExternalProviders(venueID, externalProviderIDs) {
        if (typeof(externalProviderIDs) != 'undefined') {
            externalProviderIDs.forEach(function(externalProviderID) {
                let extProv = document.getElementById('wmeFdoExternalProviders-' + venueID);
                let div = document.createElement('div');
                div.innerHTML = externalProviderID;
                extProv.append(div);

                getExternalProviderDetail(externalProviderID, function(data) {
                    let closed = data.permanently_closed;
                    div.innerHTML = '<a href="' + data.url + '" target="_blank">' + externalProviderID + '</a>';
                    if (closed) {
                        div.innerHTML = div.innerHTML + ' <span style="color:red;">closed</span>';
                    }
                });
            });
        }
    }

    function getExternalProviderDetail(externalProviderID, callback) {
        if (googleMapsApi.service == null) {
            googleMapsApi.service = new google.maps.places.PlacesService(googleMapsApi.map);
        }

        if (typeof(externalProviderDetails[externalProviderID]) == 'undefined') {
            let request = {
                placeId: externalProviderID,
                fields: ['name','url','permanently_closed','geometry']
            }
            googleMapsApi.service.getDetails(request, function(place, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    externalProviderDetails[externalProviderID] = place;
                    callback(externalProviderDetails[externalProviderID]);
                } else {
                    //TODO: callback with error response
                    callback(null);
                }
            });
        } else {
            callback(externalProviderDetails[externalProviderID]);
        }

    }

    function toggleFilterDropDown() {
        let details = document.getElementById('wmeFdoFilterDetails');
        let openDropDown = false;
        if (details.classList.contains('closed')) {
            details.classList.remove('closed');
        } else {
            details.classList.add('closed');
        }
    }

    function toggleScanStatusDropDown() {
        let details = document.getElementById('wmeFdoScanStatus');
        let openDropDown = false;
        if (details.classList.contains('closed')) {
            details.classList.remove('closed');
        } else {
            details.classList.add('closed');
        }
    }

    function toggleDetailsDropDown(elementId, operationCenterPoint) {
        let details = document.getElementById(elementId);
        let openDropDown = false;
        if (details.classList.contains('closed')) {
            openDropDown = true;
        }
        closeAllDetailsDropDown();
        if (openDropDown) {
            details.classList.remove('closed');
            settings.Enabled = true;
            onLayerCheckboxChanged(settings.Enabled); // TODO: Fix this so the Layer menu checkbox gets updated
            let lonLat = new OpenLayers.LonLat(operationCenterPoint.x, operationCenterPoint.y);
            if(!W.map.getExtent().containsLonLat(lonLat)) {
                W.map.setCenter(lonLat, 6);
            }
        }
    }

    function openDetailsDropDown(elementId, operationCenterPoint) {
        let details = document.getElementById(elementId);
        //details.className = 'element-history-item tx-has-content';
        details.classList.remove('closed');
        details.classList.remove('hidden');
        //    var lonLat = new OpenLayers.LonLat(operationCenterPoint.x, operationCenterPoint.y);
        //W.map.setCenter(operationCenterPoint.toLonLat(), 6);
    }

    function closeDetailsDropDown(elementId) {
        let details = document.getElementById(elementId);
        details.classList.add('closed');
    }

    function closeAllDetailsDropDown() {
        let ul = document.getElementById('wmeFdoTransactionList');
        let items = ul.getElementsByTagName('li');
        for (var i = 0; i < items.length; ++i) {
            let elementId = items[i].id;
            if (elementId.startsWith('entry-')) {
                closeDetailsDropDown(elementId);
            }
        }
    }

    function displayPin(transactionOperation, deletedVenue) {
        let deletedPlacePt=new OpenLayers.Geometry.Point(transactionOperation.objectCentroid.coordinates[0], transactionOperation.objectCentroid.coordinates[1]);
        deletedPlacePt.transform(displayProjection, projection);
        let point = new OpenLayers.Geometry.Point(deletedPlacePt.x, deletedPlacePt.y);
        let style = {strokeColor: 'black',
                     strokeWidth: '5',
                     strokeDashstyle: 'solid',
                     pointRadius: '5',
                     fillOpacity: '1'};
        let feature = new OpenLayers.Feature.Vector(point, {id:transactionOperation.objectID}, style);

        var di = require("Waze/DivIcon");
        var iconA = new di("place-update add_venue low map-marker wmeFdo-place-delete");
        var lonlatA = new OpenLayers.LonLat(deletedPlacePt.x, deletedPlacePt.y);
        // let markerLayer = W.map.getLayerByUniqueName('__wmeFdoMarkerLayer');
        let marker = new OpenLayers.Marker(lonlatA, iconA);
        marker.id = 1;
        marker.events.register('click', marker, function(evt) {
            W.selectionManager.unselectAll();
            selectTab();
            let elementId = 'entry-' + transactionOperation.objectID;
            closeAllDetailsDropDown();
            openDetailsDropDown(elementId, deletedPlacePt);
            document.getElementById(elementId).scrollIntoView();
        });

        addLayers();
        _wmeFdoFeatureLayer.addFeatures([feature]);
        _wmeFdoMarkerLayer.addMarker(marker);
        return feature;
    }

    function addLayers() {
        if (_wmeFdoFeatureLayer == undefined) {
            _wmeFdoFeatureLayer = new OpenLayers.Layer.Vector("_wmeFdoFeatureLayer",{uniqueName: "__wmeFdoFeatureLayer"});
            _wmeFdoMarkerLayer = new OpenLayers.Layer.Markers("_wmeFdoMarkerLayer",{uniqueName: "__wmeFdoMarkerLayer"});
            W.map.addLayer(_wmeFdoFeatureLayer);
            W.map.addLayer(_wmeFdoMarkerLayer);
            if (settings.Enabled) {
                _wmeFdoFeatureLayer.setVisibility(true);
                _wmeFdoMarkerLayer.setVisibility(true);
            } else {
                _wmeFdoFeatureLayer.setVisibility(false);
                _wmeFdoMarkerLayer.setVisibility(false);
            }

        }
    }

    function showDeletedArea(transactionOperation, deletedVenue) {
        let polygon = null;
        if (deletedVenue.geometry.type == 'Polygon') {
            let points = [];
            deletedVenue.geometry.coordinates[0].forEach( function(coord) {
                let point = new OpenLayers.Geometry.Point(coord[0],coord[1]);
                point.transform(displayProjection,projection);
                points.push(point);
            });
            points.push(points[0]);
            let linearRing = new OpenLayers.Geometry.LinearRing(points);
            polygon = new OpenLayers.Geometry.Polygon(linearRing);
        }
        let style = {strokeColor: 'orange',
                     strokeWidth: '4',
                     strokeDashstyle: 'solid',
                     fillOpacity: '0.2'};
        let feature = new OpenLayers.Feature.Vector(polygon, {id:transactionOperation.objectID}, style);
        _wmeFdoFeatureLayer.addFeatures([feature]);
        return feature;
    }

    function getParentCategory(category) {
        // Build subcategory > parent category mapping once
        if (subcategoryToParentCategories.length == 0) {
            let index = 0;
            Object.keys(W.Config.venues.subcategories).forEach(function(parent) {
                let parentName = Object.getOwnPropertyNames(W.Config.venues.subcategories)[index];
                subcategoryToParentCategories[parentName] = parentName;
                W.Config.venues.subcategories[parentName].forEach(function(subcategory) {
                    subcategoryToParentCategories[subcategory] = parentName;
                });
                index++;
            });
        }

        return subcategoryToParentCategories[category];
    }

    function getCategoryIconClass(category) {
        let parentCategory = getParentCategory(category);

        // TODO: Lowercase and replace '_' with '-' instead?
        switch(parentCategory) {
            case 'TRANSPORTATION':
                return 'transportation';
                break;
            case 'PROFESSIONAL_AND_PUBLIC':
                return 'professional-and-public';
                break;
            case 'SHOPPING_AND_SERVICES':
                return 'shopping-and-services';
                break;
            case 'FOOD_AND_DRINK':
                return 'food-and-drink';
                break;
            case 'CULTURE_AND_ENTERTAINEMENT':
                return 'culture-and-entertainement';
                break;
            case 'LODGING':
                return 'lodging';
                break;
            case 'OUTDOORS':
                return 'outdoors';
                break;
            case 'NATURAL_FEATURES':
                return 'natural-features';
                break;
            case 'PARKING_LOT':
                return 'parking-lot';
            default:
                return 'OTHER';
        }

        // WME CSS Example:
        //     #edit-buttons .transportation .item-icon::after {
        //     background-image: url(//editor-assets.waze.com/production/img/toolbare2f6b31….png);
        //         background-position: -13px -70px;
        //        width: 12px;
        //         height: 12px;
        //        }
    }

    function formatStreetName(venueHistory, streetId) {
        // TODO: replace with address cache lookup/build function
        let streetName = null;
        venueHistory.streets.objects.forEach(function(street) {
            if (street.id == streetId) {
                streetName = street.name;
            }
        });

        if (streetName == null) {
            streetName = "";
        }
        return streetName;
    }

    function formatFullStreetName(venueHistory, streetId) {
        // TODO: replace with address cache lookup/build function
        let streetName = null;
        venueHistory.streets.objects.forEach(function(street) {
            if (street.id == streetId) {
                streetName = street.name;
                venueHistory.cities.objects.forEach(function(city) {
                    if (street.cityID == city.id) {
                        if (streetName != '') {
                            streetName = streetName + ", ";
                        }
                        streetName = streetName + city.name;
                        venueHistory.states.objects.forEach(function(state) {
                            if (city.stateID == state.id) {
                                if (city.name != '') {
                                    streetName = streetName + ", ";
                                }
                                streetName = streetName + state.name;
                            }
                        });
                    }
                });
            }
        });

        if (streetName == null) {
            streetName = "";
        }
        return streetName;
    }

    function formatCategories(categories) {
        let output = ''
        categories.forEach(function(category) {
            output = output + ", " + I18n.t("venues.categories." + category);
        });
        output = output.substring(2);

        return output;
    }

    function formatCategoriesNative(categories) {
        let output = ''
        categories.forEach(function(category) {
            output = output + "," + category;
        });
        output = output.substring(1);

        return output;
    }

    function formatExternalProviders(externalProviderIDs) {
        let output = "<ul>";
        if (typeof externalProviderIDs != 'undefined') {
            externalProviderIDs.forEach(function(externalProviderID) {
                output = output + "<li>" + externalProviderID + "</ul>";
            });
        }
        output = output + "</ul>";
        return output;
    }

    function getVenueHistory(venueHistory) {
        let historySummary = {
            html: null,
            isRejectedNew: false,
            isAcceptedDelete: false,
            purDeletedBy: null
        }

        let output = "<ul class='wmeFdoHistorySummaryList'>";
        let transactionCount = 0;
        venueHistory.transactions.objects.forEach(function(venueTransaction) {
            transactionCount++;
            let username = null;
            let usernameHtml = null;
            venueHistory.users.objects.forEach( function(user) {
                if (user.id == venueTransaction.userID) {
                    let userRank = user.rank + 1;
                    username = user.userName + '(' + userRank + ')';
                    usernameHtml = `<a target="_blank" href="https://${window.location.host}/user/editor/${user.userName}">${username}</a>`;
                }
            });

            let detailCount = 0;
            let requestType = venueTransaction.actionType;

            let purText = null;
            let addedPurNotation = false;
            let previousObjectType = null;
            venueTransaction.objects.forEach(function(venueSubObject) {
                purText = null;
                let addDate = false;
                if (venueSubObject.objectType == 'venueUpdateRequest') {

                    if (transactionCount == 2 && previousObjectType == 'venue') {
                        historySummary.purDeletedBy = username;
                    }
                    previousObjectType = venueSubObject.objectType;

                    if (!addedPurNotation) {
                        addedPurNotation = true;
                        requestType = requestType + " (PUR)";
                    }
                    if (typeof(venueSubObject.oldValue) != 'undefined') {
                        let rejected = false;
                        if (typeof(venueSubObject.oldValue.approve) == 'undefined') {
                            purText = "(Unknown Action) ";
                        } else if (venueSubObject.oldValue.approve) {
                            purText = "Approved ";
                        } else {
                            purText = "Rejected ";
                            rejected = true;
                        }

                        if (typeof(venueSubObject.oldValue.type) == 'undefined'
                            && (venueSubObject.oldValue.id.includes('-') && !venueSubObject.oldValue.id.includes('.'))
                           ) {
                            // Older entries did not contain the type, test to see if it's a rejected image
                            venueSubObject.oldValue.type = 'IMAGE';
                        }

                        if (venueSubObject.oldValue.type == 'VENUE') {
                            //rejectedNew = true;
                            purText = purText + "New Place";
                            addDate = true;
                            if (rejected) {
                                historySummary.isRejectedNew = true;
                            }

                        } else if (venueSubObject.oldValue.type == 'REQUEST') {
                            if (venueSubObject.oldValue.subType == 'DELETE') {
                                purText = purText + "Delete Request";
                                if (!rejected) {
                                    historySummary.isAcceptedDelete = true;
                                }
                            } else if (venueSubObject.oldValue.subType == 'UPDATE') {
                                purText = purText + "Update Request";
                            }

                            addDate = true;

                        } else if (venueSubObject.oldValue.type == 'IMAGE') {

                            purText += "Photo";
                            purText = `<a target="_blank" href="https://venue-image.waze.com/${venueSubObject.oldValue.id}">${purText}</a>`;
                        }

                        if (addDate) {
                            let origPurUnixTime = parseInt(venueSubObject.oldValue.id.split('.')[0]);
                            let newPurDate = timeConverter(origPurUnixTime);
                            purText = purText + " (" + newPurDate + ")";
                        }

                    } else if (typeof(venueSubObject.newValue) != 'undefined') {
                        purText = "Submitted ";
                        if (typeof(venueSubObject.newValue.type) != 'undefined') {
                            if (venueSubObject.newValue.type == 'VENUE') {
                                //rejectedNew = true;
                                purText = purText + "New Place";
                                addDate = true;

                            } else if (venueSubObject.newValue.type == 'REQUEST') {
                                if (venueSubObject.newValue.subType == 'DELETE') {
                                    purText = purText + "Delete Request";
                                } else if (venueSubObject.newValue.subType == 'UPDATE') {
                                    purText = purText + "Update Request";
                                }

                                addDate = true;
                            }
                        } else if (venueSubObject.newValue.id.includes('-') && !venueSubObject.newValue.id.includes('.')) {
                            // Older entries did not contain the type, test to see if it's a rejected image
                            //venueSubObject.oldValue.type = 'IMAGE';
                            purText += "Photo";
                            purText = `<li><a target="_blank" href="https://venue-image.waze.com/${venueSubObject.newValue.id}">Rejected Photo</a></li>`;
                        }
                        if (addDate) {
                            let origPurUnixTime = parseInt(venueSubObject.newValue.id.split('.')[0]);
                            let newPurDate = timeConverter(origPurUnixTime);
                            purText = purText + " (" + newPurDate + ")";
                        }
                    }


                }
            });

            output = output + "<li><div>" + timeConverter(venueTransaction.date) + " " + requestType + " " + usernameHtml + "</div>";
            output = output + '<ul class="historySummaryItem">';
            if (purText != null) {
                output = output + '<li>' + purText + '</li>';
            }
            if (typeof(venueTransaction.objects[0].newValue) != 'undefined' && typeof(venueTransaction.objects[0].newValue.name) != 'undefined')
            {
                detailCount++;
                output = output + '<li>Name: ' + venueTransaction.objects[0].newValue.name + '</li>';
                if (venueTransaction.objects[0].actionType == 'UPDATE') {
                    output = output + '<li>Was: ' + venueTransaction.objects[0].oldValue.name + '</li>';
                }

            }
            //    if (typeof(venueTransaction.objects[0].oldValue) != 'undefined' && venueTransaction.objects[0].oldValue.type == 'IMAGE') {
            //        output = output + `<li><a target="_blank" href="https://venue-image.waze.com/${venueTransaction.objects[0].oldValue.id}">Rejected Photo</a></li>`;
            //    }
            output = output + '</ul>';
            if (detailCount > 0) {
                output = output + '</li style="margin-bottom:4px">';
            } else {
                output = output + "</li>";
            }
            // console.log(venueTransaction);
        });
        output = output + "</ul>";
        historySummary.html = output;
        return historySummary;
    }

    function applyFiltersToResults() {
        let ul = document.getElementById('wmeFdoTransactionList');
        let items = ul.getElementsByTagName('li');
        for (var i = 0; i < items.length; ++i) {
            let elementId = items[i].id;
            let element = document.getElementById(elementId);
            if (elementId.startsWith('entry-')) {
                setFilteredState(element);
            }
        }

    }

    function setFilteredState(element) {
        let filtered = false;

        let filterTypeCount = 0;
        if (!settings.FilterResidential) {
            filterTypeCount++;
            if (element.getAttribute('data-categories') == 'RESIDENCE_HOME') {
                filtered = true;
            }
        }
        if (!settings.FilterParkingLot) {
            filterTypeCount++;
            if (element.getAttribute('data-categories') == 'PARKING_LOT') {
                filtered = true;
            }
        }
        if (!settings.FilterAnyType) {
            filterTypeCount++;
            if (element.getAttribute('data-categories') != 'RESIDENCE_HOME' && element.getAttribute('data-categories') != 'PARKING_LOT') {
                filtered = true;
            }
        }

        let allTypesFiltered = false;
        if (filterTypeCount == 3) {
            allTypesFiltered = true;
        }

        if (element.getAttribute('data-pur-new-rejected') == "true") {
            if (!settings.FilterNewRejected) {
                filtered = true;
            } else if (allTypesFiltered && filtered) {
                filtered = false;
            }
        }

        //
        if (element.getAttribute('data-pur-delete-request') == "true") {
            if (!settings.FilterDeleteRequest) {
                filtered = true;
            } else if (allTypesFiltered && filtered) {
                filtered = false;
            }
        }

        if (filtered) {
            element.classList.add('hidden');
        } else {
            element.classList.remove('hidden');
        }
    }

    function endScan(reasonText, setEndedFlag) {
        if (setEndedFlag) {
            var findButton = document.getElementById('wmeFdoFindButton');
            findButton.className = 'btn btn-success center-block';

            var cancelButton = document.getElementById('wmeFdoCancelButton');
            cancelButton.className = 'btn btn-warning center-block hidden';

            $('#wmeFdoTabFind').data("status","ended");

            let tab = document.getElementById('wmeFdoTab');
            tab.innerHTML = 'FiDO <span class="spinner-disable"><i class="icon-spinner icon-spin fa fa-spinner fa-spin"></i></span>';
            cancelScanNew();
        }
        $('#wmeFdoScanCurrentStatus')[0].innerText = reasonText;
    }

    async function findObjects() {

        let editorList = [];

        let searchAreaGeometry = getSearchArea();
        var lookFor = {
            objectType:'Venue',
            actionType:'DELETE',
            searchArea: searchAreaGeometry,
            limitToScreen: settings.LimitToScreen,
            includeSelf: settings.IncludeSelf

        }

        //var centerCoords = W.map.getCenter().clone().transform(W.map.projection, W.map.displayProjection);
        if (settings.NearbyEditors) {

            lookFor.limitToScreen = true;
            lookFor.includeSelf = true;

            //TODO: use W.model if zoom <= 3
            let editorListScreen = getNearbyEditors();

            let featuresList = await getScreenFeatures();

            let editorListFeatures = getNearbyEditorsFromFeatures(featuresList);

            let editorListTemp = [];

            editorListFeatures.forEach(function(userID) {
                editorListTemp[userID] = true;
                apiEndpointWazeCom.users.total++;
            });

            Object.keys(editorListTemp).forEach(function(userID) {
                editorList.push(userID);
            });

            processUsers(lookFor, editorList);

        } else {

            lookFor.limitToScreen = settings.LimitToScreen;
            lookFor.includeSelf = settings.IncludeSelf;

            Date.prototype.addDays = function(days) {
                var date = new Date(this.valueOf());
                date.setDate(date.getDate() + days);
                return date;
            }

            let startDate = null;
            let startDateInput = document.getElementById('wmeFdoFindDate');
            let dateInput = null;
            if (Date.parse(startDateInput.value) != null) {
                dateInput = new Date(startDateInput.value).addDays(1);
                startDate = dateToUuid(dateInput);
                dateInput = new Date(dateInput).getTime();
            } else {
                dateInput = new Date.now();
            }

            var transactionLookup = {
                username:$('#wmeFdoEditorName')[0].value,
                userId:null,
                nextTransactionDate:startDate,
                iteration:0,
                maxIterations:100000
            };

            if (transactionLookup.username == null || transactionLookup.username == "") {
                endScan('Please enter an editor name!', true);
            } else {
                let requestParamsUserProfile = requestParams(getApiUrlUserProfile(transactionLookup.username));
                requestStatus[requestParamsUserProfile.url] = defaultRequestStatus();

                apiEndpointWazeCom.requests.push(requestParamsUserProfile);
                getEndpointResult(apiEndpointWazeCom, requestParamsUserProfile, userProfile => {
                    if (typeof(userProfile.userID) == 'undefined') {
                        endScan('Editor name not found!', true);
                    } else {
                        apiEndpointWazeCom.users.total++;
                        addUserCache(userProfile.userID, userProfile.username, userProfile.rank)
                        if (userProfile.firstEditDate > earliestScanDate) {
                            userCache[userProfile.userID].earliestDate = userProfile.firstEditDate;
                        } else {
                            userCache[userProfile.userID].earliestDate = earliestScanDate;
                        }
                        userCache[userProfile.userID].latestDate = dateInput;
                        editorList.push(userProfile.userID);
                    }
                    processUsers(lookFor, editorList);
                });
            }
        }
    }

    function processUsers(lookFor, editorList) {
        $('#wmeFdoScanStatus .wmeFdoProgress').removeClass('hidden');
        apiEndpointWazeCom.gotFeatures = true;
        editorList.forEach(function (userID) {

            Date.prototype.addDays = function(days) {
                var date = new Date(this.valueOf());
                date.setDate(date.getDate() + days);
                return date;
            }

            let startDate = null;
            let startDateInput = document.getElementById('wmeFdoFindDate');
            if (Date.parse(startDateInput.value) != null) {
                let dateInput = new Date(startDateInput.value).addDays(1);
                startDate = dateToUuid(dateInput);
            }

            var transactionLookup = {
                username:null,
                userId:userID,
                nextTransactionDate:startDate,
                iteration:0,
                maxIterations:100000
            };

            let latestDate = timeConverter(userCache[userID].latestDate + DAY_MS);
            transactionLookup.nextTransactionDate = dateToUuid(latestDate);

            let username = `<a target="_blank" href="https://${window.location.host}/user/editor/${userCache[userID].username}">${userCache[userID].username}(${(userCache[userID].rank + 1)})</a>`;
            $('#wmeFdoStatusUsersList').append('<li id="wmeFdoStatusUser-' + userID + '">'
                                               + username + ': <span class="wmeFdoStatusUser">Not Started</span>'
                                               + '<div class="wmeFdoProgress"><div class="wmeFdoComplete"></div></div>'
                                               + '<div class="wmeFdoStatusUserDates">'
                                               + '<div class="wmeFdoStatusUserLatest">' + timeConverterNoTime(userCache[userID].latestDate) + '</div>'
                                               + '<div class="wmeFdoStatusUserEarliest">' + timeConverterNoTime(userCache[userID].earliestDate) + '</div>'
                                               + '<div style="clear:both;"></div>'
                                               + '</div>'
                                               + '</li>');
            userCache[userID].previousDate = userCache[userID].latestDate + DAY_MS;
            let totalMs = (userCache[userID].latestDate + DAY_MS) - (userCache[userID].earliestDate - DAY_MS);
            userCache[userID].totalMs = totalMs;
            apiEndpointWazeCom.progress.totalMs += userCache[userID].totalMs;

            beginFind(lookFor, transactionLookup);
        });
    }

    function getSearchArea() {
        var theVenue = null;
        var count = 0;
        for (var v in W.model.venues.objects) {
            if (W.model.venues.objects.hasOwnProperty(v) === false) {
                continue;
            }
            var venue = W.model.venues.objects[v];
            if (venue.isPoint() === true) {
                continue;
            }
            if ($.isNumeric(venue.attributes.id) && parseInt(venue.attributes.id) <= 0) {
                theVenue = venue;
                count++;
            }
        }

        if (count === 0) {
            console.log("using screen");
            return W.map.getExtent().toGeometry();
        }
        if (theVenue.geometry.components.length !== 1) {
            alert("Can't parse the geometry");
            return;
        } else {
            console.log("using unsaved place area");
            return theVenue.geometry.clone();

        }
    }

    function getNearbyEditors() {
        $('#wmeFdoScanCurrentStatus')[0].innerText = 'Finding Nearby Editors';

        //let earliestDate = parseInt(new Date('2016-12-31').getTime());
        let editorList = [];
        let editorListReturn = [];

        Object.keys(W.model.venues.objects).forEach(function (venueId) {
            let venue = W.model.venues.objects[venueId].attributes;
            if (typeof(venue.createdOn) != 'undefined' && venue.createdOn > earliestScanDate) {
                editorList[venue.createdBy] = venue.createdOn;
            }
            if (typeof(venue.updatedOn) != 'undefined' && venue.updatedOn > earliestScanDate) {
                editorList[venue.updatedBy] = venue.updatedBy;
            }
            //console.log(W.model.venues.objects[venueId].attributes.createdBy)
        });

        Object.keys(W.model.segments.objects).forEach(function (segmentId) {
            let segment = W.model.segments.objects[segmentId].attributes;
            if (typeof(segment.createdOn) != 'undefined' && segment.createdOn > earliestScanDate) {
                editorList[segment.createdBy] = segment.createdOn;
            }
            if (typeof(segment.updatedOn) != 'undefined' && segment.updatedOn > earliestScanDate) {
                editorList[segment.updatedBy] = segment.updatedBy;
            }
            //console.log(W.model.venues.objects[venueId].attributes.createdBy)
        });

        Object.keys(editorList).forEach(function (editorId) {
            if (editorId != 'undefined') {
                editorListReturn.push(editorId);
            }
        });

        return editorListReturn;
    }

    function getNearbyEditorsFromFeatures(featuresList) {
        $('#wmeFdoScanCurrentStatus')[0].innerText = 'Finding Nearby Editors';


        let editorList = [];
        let editorListReturn = [];

        featuresList.forEach(function (features) {
            if (typeof(features.error) == 'undefined') {

                if (typeof(features.venues) != 'undefined') {
                    features.users.objects.forEach(function (user) {
                        addUserCache(user.id, user.userName, user.rank);

                    });
                }

                if (typeof(features.venues) != 'undefined') {
                    features.venues.objects.forEach(function (venue) {
                        if (typeof(venue.createdOn) != 'undefined' && venue.createdOn > earliestScanDate) {
                            editorList[venue.createdBy] = venue.createdOn;
                            updateUserCache(venue.createdBy, venue.createdOn);

                        }
                        if (typeof(venue.updatedOn) != 'undefined' && venue.updatedOn > earliestScanDate) {
                            editorList[venue.updatedBy] = venue.updatedBy;
                            updateUserCache(venue.updatedBy, venue.updatedOn);
                        }
                        seenVenueIds.push(venue.id); // Venue exists, no need to check its history
                    });
                }

                if (typeof(features.segments) != 'undefined') {
                    features.segments.objects.forEach(function (segment) {
                        if (typeof(segment.createdOn) != 'undefined' && segment.createdOn > earliestScanDate) {
                            editorList[segment.createdBy] = segment.createdOn;
                            updateUserCache(segment.createdBy, segment.createdOn);
                        }
                        if (typeof(segment.updatedOn) != 'undefined' && segment.updatedOn > earliestScanDate) {
                            editorList[segment.updatedBy] = segment.updatedBy;
                            updateUserCache(segment.updatedBy, segment.updatedOn);
                        }
                    });
                }
            }
        });

        Object.keys(editorList).forEach(function (editorId) {
            if (editorId != 'undefined') {
                editorListReturn.push(editorId);
            }
        });

        return editorListReturn;
    }

    function addUserCache(userID, userName, rank) {
        if (typeof(userCache[userID]) == 'undefined') {
            userCache[userID] = defaultUserCache(userID, userName, rank);
        }
    }

    function updateUserCache(userID, actionDate) {
        if (typeof(userCache[userID]) == 'undefined') {
        } else {
            if (actionDate > userCache[userID].latestDate) {
                userCache[userID].latestDate = actionDate;
            }

            if (actionDate < userCache[userID].earliestDate) {
                userCache[userID].earliestDate = actionDate;
            }
        }
    }

    async function getScreenFeatures() {

        return new Promise( async resolve => {
            let urlList = [];
            let paramsList = [];
            let featuresList = [];
            let maxDegrees = 0.125;
            let minDegrees = 0.0625;
            let extent = W.map.getExtent().transform(projection,displayProjection);
            //NW: LT - left top
            //NE: RT - right top
            //SW: LB - left bottom
            //SE: RB - right bottom

            let geoLT = new OpenLayers.Geometry.Point(extent.left,extent.top);
            let geoRB = new OpenLayers.Geometry.Point(extent.right,extent.bottom);
            let geoLTSplit = new OpenLayers.Geometry.Point(geoLT.x,geoLT.y);
            let geoRBSplit = new OpenLayers.Geometry.Point(geoRB.x,geoRB.y);
            let geoTempY = new OpenLayers.Geometry.Point(geoLT.x,geoLT.y);

            let xSplit = geoLT.x;
            let ySplit = geoLT.y;

            //console.log(extent);
            //console.log(geoLT);
            //console.log(geoRB);

            while (ySplit >= geoRB.y) {
                geoTempY.y = geoTempY.y - maxDegrees;

                ySplit = geoTempY.y;
                let degreesFromGeoRBY = geoRB.y - ySplit;

                if (ySplit > geoRB.y)
                    geoRBSplit.y = ySplit
                else if (degreesFromGeoRBY <= minDegrees)
                    geoRBSplit.y = ySplit - (minDegrees - degreesFromGeoRBY);
                else
                    geoRBSplit.y = geoRB.y;

                while (xSplit <= geoRB.x) {
                    geoTempY.x = geoTempY.x + maxDegrees;

                    xSplit = geoTempY.x;
                    let degreesFromGeoRBX = geoRB.x - xSplit;
                    if (xSplit > geoRB.x)
                        geoRBSplit.x = xSplit
                    else if (degreesFromGeoRBX <= minDegrees)
                        geoRBSplit.x = xSplit - (minDegrees - degreesFromGeoRBX);
                    else
                        geoRBSplit.x = geoRB.x;

                    //  let bboxGeoLT = geoLTSplit.clone();
                    //  let bboxGeoEB = geoEBSplit.clone();
                    let bbox = `${geoLTSplit.x},${geoLTSplit.y},${geoRBSplit.x},${geoRBSplit.y}`;
                    let url = getApiUrlFeatures(bbox);
                    urlList.push(url);
                    //console.log(url);
                    let params = requestParams(url);
                    requestStatus[url] = defaultRequestStatus();
                    // let features = null;

                    //   features = await getApiRequest(params);
                    //   featuresList.push(features);

                    paramsList.push(params);
                    apiEndpointWazeCom.requests.push(params);

                    geoLTSplit.x = xSplit;
                }

                geoLTSplit.y = ySplit;
                geoLTSplit.x = geoLT.x;
                xSplit = geoLT.x;
                geoTempY.x = xSplit;
            }
            getEndpointResultFromArray(apiEndpointWazeCom, paramsList, featuresList => {
                resolve(featuresList);
            });

        });
    }

    function getApiUrlUserProfile(username) {
        return `https://${window.location.host}${W.Config.api_base}/UserProfile/Profile?username=${username}`;
    }

    function getApiUrlTransactions(userId, nextTransactionDate) {
        let url = `https://${window.location.host}${W.Config.api_base}/UserProfile/Transactions?userID=${userId}`;
        if (nextTransactionDate != null) {
            url = url + '&till=' + nextTransactionDate;
        }
        return url;
    }

    function getApiUrlElementHistory(objectType, objectId, nextTransactionDate) {
        let url = `https://${window.location.host}${W.Config.api_base}/ElementHistory?objectType=${objectType}&objectID=${objectId}`;
        if (nextTransactionDate != null) {
            url = url + '&till=' + nextTransactionDate;
        }
        return url;
    }

    function getApiUrlFeatures(bbox) {
        let url = `https://${window.location.host}${W.Config.api_base}/Features?language=en-US&bbox=${bbox}&roadTypes=2%2C3%2C4%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19%2C20%2C21%2C22&venueLevel=4&venueFilter=3%2C3%2C3`;
        return url;
    }

    async function highlightPin(pin) {
        if (pin.onScreen()) {
            let layer = W.map.getLayerByUniqueName('__wmeFdoFeatureLayer');

            let enableAnimation = false;
            if (enableAnimation) {
                pin.data.mouseout = false;
                pin.style.strokeColor = 'red';
                for (var i=100;i>=1;i--) {
                    await wait(10);
                    pin.style.strokeWidth = i;
                    layer.redraw();
                    if (pin.data.mouseout == true) {
                        i = 1;
                        returnPin(pin);
                    }
                }
                pin.style.strokeWidth = 4;
                pin.style.pointRadius = 5;
                pin.style.strokeColor = 'orange';
                layer.redraw();
                if (pin.data.mouseout == true) {
                    returnPin(pin);
                }
            } else {
                pin.style.strokeWidth = 4;
                pin.style.pointRadius = 5;
                pin.style.strokeColor = 'orange';
                layer.redraw();
            }
        }
    }

    function returnPin(pin) {
        let style = {strokeColor: 'black',
                     strokeWidth: '4',
                     strokeDashstyle: 'solid',
                     pointRadius: '4',
                     fillOpacity: '1'};

        if (pin.onScreen()) {
            let layer = W.map.getLayerByUniqueName('__wmeFdoFeatureLayer');
            pin.data.mouseout = true;
            //pin.style.strokeColor = 'black';
            //pin.style.strokeWidth = 5;
            pin.style = style;
            layer.redraw();
        }
    }

    function createSettingsCheckbox($div, settingID, textDescription) {
        let $checkbox = $('<input>', {type:'checkbox', id:settingID, class:'wmeFdoSettingsCheckbox'});
        $div.append(
            $('<div>', {class:'controls-container'}).css({paddingTop:'2px'}).append(
                $checkbox,
                $('<label>', {for:settingID}).text(textDescription).css({whiteSpace:'pre-line'})
            )
        );
        return $checkbox;
    }

    function setChecked(checkboxId, checked) {
        $('#' + checkboxId).prop('checked', checked);
    }

    function saveSettings() {
        if (localStorage) {
            var localsettings = {
                Enabled: settings.Enabled,
                IncludeSelf: settings.IncludeSelf,
                LimitToScreen: settings.LimitToScreen,
                NearbyEditors: settings.NearbyEditors,
                FilterResidential: settings.FilterResidential,
                FilterParkingLot: settings.FilterParkingLot,
                FilterAnyType: settings.FilterAnyType,
                FilterNewRejected: settings.FilterNewRejected,
                FilterDeleteRequest: settings.FilterDeleteRequest
            };

            localStorage.setItem("wmeFdo_Settings", JSON.stringify(localsettings));
        }
    }

    function loadSettings() {
        var loadedSettings = $.parseJSON(localStorage.getItem("wmeFdo_Settings"));
        var defaultSettings = {
            Enabled: true,
            IncludeSelf: true,
            LimitToScreen: true,
            NearbyEditors: true,
            FilterResidential: true,
            FilterParkingLot: true,
            FilterAnyType: true,
            FilterNewRejected: true,
            FilterDeleteRequest: true
        };
        settings = loadedSettings ? loadedSettings : defaultSettings;
        for (var prop in defaultSettings) {
            if (!settings.hasOwnProperty(prop))
                settings[prop] = defaultSettings[prop];
        }

    }

    function prepareTab() {
        let tabs = document.getElementById('user-tabs');
        let items = tabs.getElementsByTagName('li');
        for (var i = 0; i < items.length; ++i) {
            let a = items[i].getElementsByTagName('a')[0]
            if (a.href.includes('sidepanel-fido')) {
                a.id = "wmeFdoTab";
                a.innerHTML = 'FiDO <span class="spinner-disable"><i class="icon-spinner icon-spin fa fa-spinner fa-spin"></i></span>';
            }
        }
    }

    function selectTab() {
        let tabs = document.getElementById('user-tabs');
        let items = tabs.getElementsByTagName('li');
        for (var i = 0; i < items.length; ++i) {
            let a = items[i].getElementsByTagName('a')[0]
            if (a.href.includes('sidepanel-fido')) {
                items[i].getElementsByTagName('a')[0].click();
            }
        }
    }

    function dateToUuid(inputDate) {
        let timestamp = parseInt(new Date(inputDate).getTime());
        // uuid = "a02102cd-19df-11e9-bd87-1201fde9baf6"
        // timestamp = 1547678386643;
        let a = timestamp * 10000;
        let b = a + 122192928000000000;
        let c = b.toString(16);
        //if (c.length % 2) {
        //   c = '0' + c;
        //}
        let d = c.substring(7) + '-' + c.substring(3,7) + '-1' + c.substring(0,3) + '-bd87-1201fde9baf6';

        return d;
    }

    function get_time_int(uuid_str) {
        var uuid_arr = uuid_str.split( '-' ),
            time_str = [
                uuid_arr[ 2 ].substring( 1 ),
                uuid_arr[ 1 ],
                uuid_arr[ 0 ]
            ].join( '' );
        return parseInt( time_str, 16 );
    };

    function uuidToUnixTime(uuid_str) {
        var int_time = get_time_int( uuid_str ) - 122192928000000000,
            int_millisec = Math.floor( int_time / 10000 );
        return int_millisec;
    };

    function uuidToDate(uuid_str) {
        var int_time = get_time_int( uuid_str ) - 122192928000000000,
            int_millisec = Math.floor( int_time / 10000 );
        //return new Date( int_millisec );
        return timeConverter(int_millisec);
    };

    function formatCurrentDate() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd;
        }

        if (mm < 10) {
            mm = '0' + mm;
        }

        return yyyy + '-' + mm + '-' + dd;
    }

    function timeConverter(UNIX_timestamp){
        var a = new Date(UNIX_timestamp);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        if (date.toString().length == 1) {
            date = "0" + date;
        }
        var hour = a.getHours();
        if (hour.toString().length == 1) {
            hour = "0" + hour;
        }
        var min = a.getMinutes();
        if (min.toString().length == 1) {
            min = "0" + min;
        }
        var sec = a.getSeconds();
        if (sec.toString().length == 1) {
            sec = "0" + sec;
        }
        //Dec 08, 2018
        var time = month + ' ' + date + ', ' + year + ' ' + hour + ':' + min;
        return time;
    }

    function timeConverterNoTime(UNIX_timestamp){
        var a = new Date(UNIX_timestamp);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        if (date.toString().length == 1) {
            date = "0" + date;
        }
        var hour = a.getHours();
        if (hour.toString().length == 1) {
            hour = "0" + hour;
        }
        var min = a.getMinutes();
        if (min.toString().length == 1) {
            min = "0" + min;
        }
        var sec = a.getSeconds();
        if (sec.toString().length == 1) {
            sec = "0" + sec;
        }
        //Dec 08, 2018
        var time = month + ' ' + date + ', ' + year;
        return time;
    }

    async function wait(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }

    // ------------- Begin Web Request/Rate Limiting -----------

    var apiEndpointWazeCom = null;

    function defaultEndpointSettings() {
        return {
            state: 'idle',
            isRunning: false,
            requests: [],
            results: [],
            requestInterval: null,
            statusInterval: null,
            count: 0,
            beginTime: Date.now(),
            timeout: 100000,
            gotFeatures: false,
            rateLimit: {
                baseDelay: 50,
                addedDelay: 0,
                stepUp: 20,
                stepDown: 10,
                lastCheck: Date.now(),
                lastAdjusted: Date.now(),
                intervalDelay: 5000,
                checkInterval: null,
                errorCount: 0,
                errorCountMax: 50
            },
            users: {
                total: 0,
                complete: 0
            },
            progress: {
                totalMs: 0,
                completeMs: 0
            }
        };
    }

    function defaultUserCache(userID, username, rank) {
        return {
            userID: userID,
            username: username,
            rank: rank,
            isRunning: false,
            currentScanDate: null,
            earliestDate: Date.now(),
            latestDate: 0,
            previousDate: 0,
            totalMs: 0,
            completeMs: 0
        }
    }

    function defaultUserProgress(userID) {
        return {
            userID: userID,
            username: null,
            rank: null,
            isRunning: false,
            currentScanDate: null,
            earliestDate: Date.now(),
            previousDate: 0,
            latestDate: 0,
            totalMs: 0
        }
    }

    function beginScanNew() {
        // start api request handler
        apiEndpointWazeCom = defaultEndpointSettings();
        apiEndpointWazeCom.state = 'running';
        apiEndpointWazeCom.isRunning = true;
        apiEndpointWazeCom.requestInterval = setInterval(function() { apiHandlerWazeCom(apiEndpointWazeCom) }, getRateLimit(apiEndpointWazeCom));
        apiEndpointWazeCom.rateLimit.checkInterval = setInterval(function() { setRateLimitAdjustDown(apiEndpointWazeCom) }, apiEndpointWazeCom.rateLimit.intervalDelay);
        apiEndpointWazeCom.statusInterval = setInterval(function() { populateStatus(); }, 1000);
        //$('#wmeFdoScanStatus .wmeFdoProgress').removeClass('hidden');
    }

    function cancelScanNew() {
        // end api request handler
        apiEndpointWazeCom.state = 'cancelled';
        apiEndpointWazeCom.isRunning = false;
        clearInterval(apiEndpointWazeCom.requestInterval);
        clearInterval(apiEndpointWazeCom.rateLimit.checkInterval);
        clearInterval(apiEndpointWazeCom.statusInverval);
        $('#wmeFdoScanCurrentStatus')[0].innerText = 'Cancelled';
    }

    function apiHandlerWazeCom(apiEndpoint) {
        if (apiEndpoint.requests.length > 0) {
            //console.log("Handler " + apiEndpoint.count);
            let requestParams = apiEndpoint.requests.shift();
            getApiWebRequest(apiEndpoint, requestParams);
            //apiEndpointWazeCom.count++;
        }
    }

    function getApiWebRequest(apiEndpoint, requestParams) {
        apiEndpoint.count++;
        $.ajax({
            type: 'GET',
            url: requestParams.url,
            success: function(data) {
                //requestStatus[requestParams.url].status = 'successful';
                if (typeof(data) == 'undefined') {
                    debugger;
                }
                apiEndpoint.results[requestParams.url] = data;
            },
            statusCode: {
                406: function() { // Not Acceptable - bbox invalid?
                    apiEndpoint.results[requestParams.url] = {"error":true,reason:"error"};
                },
                429: function() { // Rate limit
                    setRateLimitAdjustUp(apiEndpoint);
                    apiEndpoint.requests.push(requestParams);
                },
                500: function() {
                    //debugger;
                    apiEndpoint.results[requestParams.url] = {"error":true,reason:"error"};
                }
            }
        });
    }

    function getRateLimit(apiEndpoint) {
        return apiEndpoint.rateLimit.baseDelay + apiEndpoint.rateLimit.addedDelay;
    }

    function setRateLimitAdjustUp(apiEndpoint) {
        let currentTime = Date.now();
        if (currentTime - apiEndpoint.rateLimit.lastAdjusted > 1000) {
            apiEndpoint.rateLimit.lastAdjusted = currentTime;
            apiEndpoint.rateLimit.errorCount++;
            apiEndpoint.rateLimit.addedDelay += apiEndpoint.rateLimit.stepUp;
            clearInterval(apiEndpoint.requestInterval);
            apiEndpoint.requestInterval = setInterval(function() { apiHandlerWazeCom(apiEndpoint) }, getRateLimit(apiEndpoint));
            console.log('rate limit adjusted up: ' + getRateLimit(apiEndpoint));
        }
    }

    function setRateLimitAdjustDown(apiEndpoint) {
        if (apiEndpoint.rateLimit.addedDelay > 0 && Date.now() - apiEndpoint.rateLimit.lastAdjusted > apiEndpoint.rateLimit.intervalDelay) { //&& apiEndpoint.rateLimit.errorCount <= apiEndpoint.rateLimit.errorCountMax) {
            apiEndpoint.rateLimit.addedDelay -= apiEndpoint.rateLimit.stepDown;
            clearInterval(apiEndpoint.requestInterval);
            apiEndpoint.requestInterval = setInterval(function() { apiHandlerWazeCom(apiEndpoint) }, getRateLimit(apiEndpoint));
            console.log('rate limit adjusted down: ' + getRateLimit(apiEndpoint));
        }
    }

    function getEndpointResultFromArray(apiEndpoint, paramsList, callback) {
        waitForAllUrlResults(apiEndpoint, paramsList, complete => {
            let resultList = [];
            paramsList.forEach(function (params) {
                getEndpointResult(apiEndpoint, params, result => {
                    resultList.push(result);
                });
            });
            callback(resultList);
        });
    }

    function populateStatus() {
        let runningSeconds = (Date.now() - apiEndpointWazeCom.beginTime) / 1000;
        let requestsPerSecond = apiEndpointWazeCom.count / runningSeconds;

        //console.log('queued requests: ' + Object.keys(apiEndpoint.requests).length + ', queued results: ' + Object.keys(apiEndpoint.results).length);
        //console.log('users: ' + apiEndpoint.users.complete + '/' + apiEndpoint.users.total + ' complete, ' + (apiEndpoint.users.total - apiEndpoint.users.complete) + ' remaining');
        //console.log('requests per second: ' + requestsPerSecond);
        let remainingUsers = apiEndpointWazeCom.users.total - apiEndpointWazeCom.users.complete;
        $('#wmeFdoRequests')[0].innerText = apiEndpointWazeCom.count;
        $('#wmeFdoRequestsPerSecond')[0].innerText = Math.round(requestsPerSecond);

        if (apiEndpointWazeCom.gotFeatures && remainingUsers == 0) {
            endScan('Complete', true);
        }
    }

    async function getEndpointResult(apiEndpoint, params, callback) {
        let timeSinceRequest = Date.now() - params.initiated;
        //console.log(typeof(apiEndpoint.results[params.url]));

        while ( typeof(apiEndpoint.results[params.url]) == 'undefined' && apiEndpoint.isRunning ) {
            // removed  && timeSinceRequest < apiEndpoint.timeout
            //console.log(typeof(apiEndpoint.results[params.url]));
            await wait(50);
            timeSinceRequest = Date.now() - params.initiated;
            //console.log('waiting for: ' + params.url);
        }
        //if (timeSinceRequest >= apiEndpoint.timeout) {
        //    console.log('request timeout'); //TODO: handle this condition better
        // }

        let result = apiEndpoint.results[params.url];
        delete apiEndpoint.results[params.url];
        callback(result);
    }

    async function waitForAllUrlResults(apiEndpoint, paramsList, callback) {
        let complete = false;
        let listCount = paramsList.length;

        while (!complete && apiEndpoint.isRunning) {
            let foundCount = 0;
            await wait(50);
            paramsList.forEach(function (params) {
                let foundUrl = false;
                if (typeof(apiEndpoint.requests[params.url]) == 'undefined' && typeof(apiEndpoint.results[params.url]) != 'undefined') {
                    foundUrl = true;
                    foundCount++;
                }
            });
            if (listCount == foundCount) {
                complete = true;
            }
        }
        callback(complete);
    }

    // ------------- End Web Request/Rate Limiting -----------

    bootstrap();
})();

class NavigationPointMEP
{
    constructor(point){
        this._point = point.clone();
        this._entry = true;
        this._exit = true;
        this._isPrimary = true;
        this._name = "";
    }

    with(){
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        if(e.point == null)
            e.point = this.toJSON().point;
        let val = new this.constructor((this.toJSON().point, e.point));
        val._entry = this._entry;
        val._exit = this._exit;
        val._isPrimary = this._isPrimary;
        val._name = this._name;
        return val;
    }

    getPoint(){
        return this._point.clone();
    }

    getEntry(){
        return this._entry;
    }

    getExit(){
        return this._exit;
    }

    getName(){
        return this._name;
    }

    isPrimary(){
        return this._isPrimary;
    }

    toJSON(){
        return  {
            point: this._point,
            entry: this._entry,
            exit: this._exit,
            primary: this._isPrimary,
            name: this._name
        };
    }

    clone(){
        return this.with();
    }
}
