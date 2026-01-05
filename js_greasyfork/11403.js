// ==UserScript==
// @author      Mturk Nerds
// @name        Mturk Larger Radio Buttons and Checkboxes
// @version     1.70
// @icon        http://i.imgur.com/YdoHcfq.png
// @descrption  Updates the size of bubbles on surveys to a larger size. Forked and updated by swole_hamster
// @license     Simplified BSD
// @namespace   https://greasyfork.org/users/2291
// @description Makes radio buttons and checkboxes larger. Applies to only certain survey related pages and Mturk itself.
// @include        https://www.mturk.com/mturk/dashboard
// @include     https://*.mturk.com/mturk/preview*
// @include      https://*.mturk.com/mturk/accept*
// @include       https://*.mturk.com/mturk/continue*
// @include       https://*.mturk.com/mturk/submit*
// @include       https://*.mturk.com/mturk/return*
// @include       https://*.mturk.com/*
// @include       https://*.mturkcontent.com/dynamic/hit?*
// @include      https://*.amazonaws.com/mturk_bulk/hits*
// @include        https://www.amazon.com/*
// @include	   http://*.qualtrics.com/*
// @include	   https://*.qualtrics.com/*
// @include        https://*.*.qualtrics.com/*
// @include        http://*.*.qualtrics.com/*
// @include        http://*.surveygizmo.com/*
// @include        https://*.surveygizmo.com/*
// @include        https://docs.google.com/forms/*
// @include        https://*.surveymonkey.com/*
// @include        https://*.vennliapp.com/*
// @include        https://*.*.*.de/*
// @include        http://*.*.*.de/*
// @include        https://*.*.de/*
// @include        http://*.*.de/*
// @include        https://*.de/*
// @include        http://*.de/*
// @include        http://*.*.*.edu/*
// @include        https://*.*.*.edu/*
// @include        http://*.*.edu/*
// @include        https://*.*.edu/*
// @include        http://*.*.*.ca/*
// @include        https://*.*.*.ca/*
// @include        http://*.*.ca/*
// @include        https://*.*.ca/*
// @include        http://www.marshlabduke.com/*
// @include        https://*.typeform.com/*
// @include        http://surveys*.surveyanalytics.com/*
// @include        http://*.cspurdue.com/*
// @include        http://questionpro.com/*
// @include        https://questionpro.com/*
// @include        https://*.kwiksurveys.com/*
// @include        https://*.wonderliconline.com/*
// @include        http://*.lab42.com/*
// @include        http://turkitron.com/*
// @include        http://sgiz.mobi/*
// @include        http://www.consumerbehaviorlab.com/*
// @include        https://www.psychdata.com/*
// @include        https://*.*.*.ac.uk/*
// @include        https://*.*.ac.uk/*
// @include        http://*.*.*.ac.uk/*
// @include        http://*.*.ac.uk/*
// @include        http://survey.psy.unipd.it/*
// @include        https://www.predikkta.com/*
// @include        https://*.userzoom.com/*
// @include        https://www.vopspsy.ugent.be/*
// @include        http://crsi.byethost33.com/*
// @include        https://www.psychdata.com/*
// @include        http://hospitalityexperiments.net/*
// @include        http://www.dise-online.net/*
// @include        https://www.descil.ethz.ch/apps/mturk/*
// @include        https://www.tfaforms.com/*
// @include        https://*.shinyapps.io/*
// @include        https://mutual-science.org/*
// @include        http://*/TurkGate/*
// @include        http://jbfreeman.net/webmt/*
// @include        http://*.fluidsurveys.com/*
// @include        https://gate.aon.com/*
// @include        https://www.cvent.com/Surveys/*
// @include        http://*/limesurvey/*
// @include        http://www.mturkgrind.com/*
// @include        http://mturkforum.com/*
// @include        https://*.usertesting.com/*
// @include        https://*.newrelic.com/*
// @include        https://*.crowdsource.com/*
// @include        http://*.crowdflower.com/*
// @include        https://prolificacademic.co.uk/*
// @include        https://www.google.com/*
// @include        http://www.google.com/*
// @include        http://www.ets-research.org/*
// @include        https://www.psychsurveys.org/*
// @include        https://*.herokuapp.com/*
// @include        http://twittergamertagging.azurewebsites.net/*
// @include        https://*.wufoo.com/*
// @include        http://studies.sticky.ad/*
// @include        https://www.turkprime.com/*
// @include        http://www.turkprime.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_addStyle 
// @grant       unsafeWindow 
// @downloadURL https://update.greasyfork.org/scripts/11403/Mturk%20Larger%20Radio%20Buttons%20and%20Checkboxes.user.js
// @updateURL https://update.greasyfork.org/scripts/11403/Mturk%20Larger%20Radio%20Buttons%20and%20Checkboxes.meta.js
// ==/UserScript==

/* Function that injects CSS rules */
function injectStyles( rule ) {
    var div = $( '<div />', {
        html: '&shy;<style>' + rule + '</style>'
    } ).appendTo( 'body' );
}

/*Individual calls to add styles */
injectStyles( 'input[type=radio] { width: 1.5em; height: 1.5em;}' );
injectStyles( 'input[type=checkbox] { width: 1.5em; height: 1.5em;}' );