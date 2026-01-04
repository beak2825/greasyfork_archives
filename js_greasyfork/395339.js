// ==UserScript==
// @name         Slate Theme for JR Panda Crazy
// @namespace    https://greasyfork.org/en/users/434272-realalexz
// @version      0.6
// @description  Slate Theme (similar to that in MTS) for JR Panda Crazy.
// @author       RealAlexZ
// @icon         https://i.imgur.com/NouzJ6b.jpg
// @include      https://worker.mturk.com/requesters/PandaCrazy/projects*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/395339/Slate%20Theme%20for%20JR%20Panda%20Crazy.user.js
// @updateURL https://update.greasyfork.org/scripts/395339/Slate%20Theme%20for%20JR%20Panda%20Crazy.meta.js
// ==/UserScript==

GM_addStyle('html, body, body input, body select, body td, body li, body div, body textarea, body p { color: #aaaaaa; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important; font-weight: normal; }' +
    'body .tabContents { background-color: #272b30 !important; }' +
    'body .ui-layout-north .thControls, body .ui-layout-north #JrMainStatus, body .ui-layout-center .thControls { border: 2px solid  #000000 !important; }' +
    'body .JRHitCell { border-width: 3px !important; border-color: #515960 !important; font-weight: 400; border-width: 5px !important; margin-top: 10px !important; }' +
    'body #JRMainTabs ul, body #JRMainTabs li { background-color: #515960 !important; border-color: #000000 !important; border-width: 2px !important; }' +
    'body #JRMainTabs li a { color: #ffffff !important; }' +
    'body #JRMainTabs .JRTAddButton { background-color: #515960 !important; color: #ffffff !important; border-color: #000000 !important; }' +
    'body #JRMainTabs .ui-tabs-panel, body #JRMainTabs .ui-widget-content { background-color: #272b30 !important; border-color: #000000 !important; }' +
    'body .ui-state-default .ui-icon { background-image: url("https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/themes/black-tie/images/ui-icons_ededed_256x240.png") !important; }' +
    'body .ui-layout-pane { background-color: #3a3f44 !important; border-color: #000000 !important; }' +
    'body .ui-tabs { border-color: #000000 !important; }' +
    'body .ui-widget-content { background-color: #272b30 !important; border-color: #000000 !important; }' +
    'body .thControls { background-color: #32383e !important; }' +
    'body .JROffButton { background-color: #383c41 !important; color: #ffffff !important; border: 1px solid  #000000 !important; padding-left: 5px !important; padding-right: 5px !important; padding-top: 1px !important; padding-bottom: 2px !important; font-size: 11px !important; font-weight: 500 !important; }' +
    'body .JROnButton { background-color: #ffffff !important; color: #383c41 !important; border: 1px solid  #000000 !important; padding-left: 5px !important; padding-right: 5px !important; padding-top: 1px !important; padding-bottom: 2px !important; font-size: 11px !important; font-weight: 500 !important; }' +
    'body .ui-layout-resizer { background-color: #272b30 !important; border-color: #000000 !important; }' +
    'body .ui-layout-toggler-north { background-color: #3a3f44 !important; border-color: #000000 !important; }' +
    'body .ui-layout-toggler-south { background-color: #3a3f44 !important; border-color: #000000 !important; }' +
    'body .thControls, body .thControls .JRStatusText { color: #aaaaaa !important; font-weight: 700 !important; padding-top: 8px !important; }' +
    'body .JRDialog { color: #aaaaaa !important; }' +
    'body .ui-dialog-titlebar { background-color: #32383e !important; border-color: #000000 !important; color: #aaaaaa !important; }' +
    'body .myButtonArea .JROffButton { box-shadow: none !important; background-color: #383c41 !important; color: #ffffff !important; border: 1px solid  #000000 !important; padding-left: 5px !important; padding-right: 5px !important; padding-top: 1px !important; padding-bottom: 2px !important; font-size: 11px !important; font-weight: 600 !important; }' +
    'body .myButtonArea .JROnButton { box-shadow: 0 0 0 1px #515960 !important; background-color: #ffffff !important; color: #383c41 !important; border: 1px solid  #000000 !important; padding-left: 5px !important; padding-right: 5px !important; padding-top: 1px !important; padding-bottom: 2px !important; font-size: 11px !important; font-weight: 600 !important; }' +
    'body .JRHitCell .myExtra, body .JRHitCell .myDescription, body .JRHitCell .myStatus { color: #383c41; }' +
    'body .JRHitCell .myDescription, body .JRHitCell .myStatus { font-weight: 400 !important; font-size: 0.75rem !important; }' +
    'body .JRHitCell .myfloater, body .JRHitCell .myTitle { color: #383c41 !important; }' +
    'body .JRHitCell .myTitle { text-decoration: underline !important; }' +
    'body { background-color: #3a3f44; }' +
    'body .ui-tabs-nav { background-color: #515960 !important; border-color: #000000 !important; border-width: 2px !important; color: #aaaaaa !important; }' +
    'body #JRStatusTabs .JRTabs { background-color: #515960 !important; border-color: #000000 !important; border-width: 2px !important; color: #aaaaaa !important; }' +
    'body #JRStatusTabs .JRTabs .JRTabLabel { color: #ffffff !important; }' +
    'body .tabContents .JRContents { background-color: #272b30 !important; border-color: #000000 !important; }' +
    'body .muteQueueWatch { color: #ffffff; }' +
    'body .tabContents .JRContents .logDiv div { font-size: 9px !important; color: #aaaaaa !important; font-weight: 500 !important; }' +
    'body #muteQueueWatchAlarm { margin-right: 2px !important; }' +
    'body #JRjqModalDialog-Search .nonselectable, .JRDialog .nonselectable, body .JRDialog .nonselectable.JROffButton { background-color: #383c41 !important; color: #ffffff !important; border: 1px solid  #000000 !important; padding-left: 7px !important; padding-right: 7px !important; padding-top: 1px !important; padding-bottom: 2px !important; font-size: 11px !important; font-weight: 500 !important; }' +
    'body .JRDialog .JREditRadioB { background-color: #383c41 !important; border-color: #000000 !important; }' +
    'body .JRDialog .JREditRadioB .ui-button-text { color: #ffffff !important; padding-left: 7px !important; padding-right: 7px !important; padding-top: 1px !important; padding-bottom: 2px !important; font-size: 11px !important; font-weight: 800 !important; }' +
    'body .JRDialog .JRDropdown { background-color: #383c41 !important; color: #ffffff !important; border: 1px solid  #000000 !important; padding-left: 7px !important; padding-right: 7px !important; padding-top: 1px !important; padding-bottom: 2px !important; font-size: 11px !important; font-weight: 500 !important; }' +
    'body .ui-dialog-buttonpane .ui-button { background-color: #383c41 !important; color: #ffffff !important; border: 1px solid  #000000 !important; padding-left: 7px !important; padding-right: 7px !important; padding-top: 1px !important; padding-bottom: 2px !important; font-size: 11px !important; font-weight: 500 !important; }' +
    'body .JRContents .addJobArea div { margin-bottom: 25px !important; }' +
    'body .JRDialog .nonselectable.JROnButton { background-color: #ffffff !important; color: #383c41 !important; border: 1px solid  #000000 !important; padding-left: 7px !important; padding-right: 7px !important; padding-top: 1px !important; padding-bottom: 2px !important; font-size: 11px !important; font-weight: 500 !important; }' +
    'body #JRjqModalDialog-waiting { background-color: #32383e !important; color: #aaaaaa !important; font-weight: 700 !important; }' +
    'body .JRCycleButton { padding-left: 0px !important; padding-right: 0px !important; }' +
    'body #JRjqModalDialog-Search { background-color: #32383e !important; color: #aaaaaa !important; font-weight: 700 !important; }' +
    'body #JRjqModalDialog-Search .searchingResultsArea div:not(.hitRow) { background-color: #32383e !important; }' +
    'body #JRjqModalDialog-Search .searchingResultsArea .column1, body #JRjqModalDialog-Search .searchingResultsArea .column2, body #JRjqModalDialog-Search .searchingResultsArea .column3, body #JRjqModalDialog-Search .searchingResultsArea .column4 { background-color: #515960 !important; border-color: #000000 !important; border-width: 1px !important; color: #ffffff !important; margin-left: 2px !important; margin-right: 2px !important; padding-left: 3px !important; padding-right: 3px !important; }' +
    'body #JRjqModalDialog-Search #searchControlArea input, body #JRjqModalDialog-Search #searchControlArea span { margin-top: 5px !important; margin-bottom: 12px !important; }' +
    'body #JRjqModalDialog-Search #searchControlArea .searchingInput { margin-right: 6px !important; }' +
    'body #JRjqModalDialog-Search #searchControlArea input { margin-left: 10px !important; }' +
    'body #JRjqModalDialog-Search .searchingResultsArea .hitRow { margin-bottom: 5px !important; }');