
// ==UserScript==
// @name        Spoiler-free Tapology
// @description Hide results on Tapology fighter/event/search pages. On event pages, the left/right position of the fighters will be randomized on each load.
// @author      Andreas Wahlqvist
// @version     1.0.0
// @homepageURL https://github.com/deepfriedmind/spoiler-free-tapology-userscript/
// @supportURL  https://github.com/deepfriedmind/spoiler-free-tapology-userscript/issues
// @namespace   https://github.com/deepfriedmind
// @match       https://www.tapology.com/fightcenter/events/*
// @match       https://www.tapology.com/fightcenter/fighters/*
// @match       https://www.tapology.com/search*
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALIAAACWCAMAAABNaSJ6AAAAYFBMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABzK7FeAAAAIHRSTlMAKFBncUUVMV5ECzZ82/+xhecejfSizv6pmSqTuT+anIdJqcQAAALCSURBVHgB7dvXjqNAFIThIrWJhxzGhtn3f8sVk4NtTo9oLbOq77pk/SbdNeiYPD8Irwgig2tOcXh1nqQ28zjDT6V5ITeVPr4wVX1nHuGLpr097/oMH2XtMH5XlDE+i2sZ5Y7J4KOgk7v6FB+Fo9z1gDdpL7fUn6Ir2VKc8a6VLUODdxfZMA4Gz86F3NHiTS7bisbiD4oURl+8NqdYmULuqvDCF43Zbj7hRSwKY4/VJBt8PBtEJcCzQl7ofr3Wz5Ptu6G/DCvL+QysQot5L5sWrEpRyuzmDVazxbyWTTlWnSiFdvMYAFJRGmMY7StiROsBABrRqgDgLFo5POXz8zJUfwQy0XoEgEW0Wpz/efIfAEiYzGQmM5nJTGYyk5nMZCYzmclMZjKTmcxkJjOZyUxmMpOZzGQmM5nJTGYyk5nMZCYzmclMZjKTmcxkJjOZyUz+LcmNbCuPlYxOtTpU8iyb/IMlx7KlxsGSMciG8HDJi+blO1byxqMxpwdMRlQojrgeKxkIB7mm6xccNRkwWfTV4gE4YLLaf53cA8DJ7kTj4iLZ2P1oI1o5AHgWc71alGK7uY9Vp5/r9XZHfidRMliV+rmeLzqz3by0O7Y9wcYsKpHd4fjFbp7BRqb/Zuk/Ahe8iESjgp1Y/1isArt5uPtjoWueU9g0l4BNcw972Wx135LB6hvrF3JPF+JH/LKTG4rWw1fx7f9YVA2+Cm7Ph9zgx7wluiJrcFV6Sq7Ojc08OaUgIq0ovDzs55JHcMu0neytuzRwx69llP11MVwJxJUQbvjiTgwX0lrc6Ro4UIlLFzhQi0sd9peJW5Gzz8Vv+mjk4lbLZCYzmclMZjKTmewAk5nMZCYz2U4obuXYnS9u+didEbcM9jeJSzMcWMSlCC604s4j3CgdPhau9OJGmcKZoJb9dTmciqdilHE/dRmm+K3+AvT3Srj7wkCqAAAAAElFTkSuQmCC
// @require     https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@2,npm/@violentmonkey/ui@0.7
// @run-at      document-start
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/436640/Spoiler-free%20Tapology.user.js
// @updateURL https://update.greasyfork.org/scripts/436640/Spoiler-free%20Tapology.meta.js
// ==/UserScript==

(function () {
'use strict';

var css_248z = "#content h1.prorecord:not(:active),#stats>ul>li:nth-child(2)>span:not(:active),#stats>ul>li:nth-child(4)>span:not(:active){color:transparent}#content h1.prorecord:before,#stats>ul>li:nth-child(2)>span:before,#stats>ul>li:nth-child(4)>span:before{color:initial;content:\"⚠️\";cursor:pointer;font-size:1.2em;margin-right:.3em;vertical-align:top}.result-types label[for=showDraws],.result-types label[for=showLosses],.result-types label[for=showNoContests],.result-types label[for=showWins]{overflow:hidden;white-space:nowrap}.result-types label[for=showWins]{width:4ch}.result-types label[for=showLosses]{width:6ch}.result-types label[for=showDraws]{width:5ch}.result-types label[for=showNoContests]{width:10ch}.fighterFightResults .result:only-child:not([data-result=cancelled]){border-color:transparent!important}.fighterFightResults .result:only-child:not([data-result=cancelled]) .lead,.fighterFightResults .result:only-child:not([data-result=cancelled]) .record,.fighterFightResults .result:only-child:not([data-result=cancelled]):before{display:none!important}.fighterFightResults .result:only-child:not([data-result=cancelled]) .notes{margin-top:0!important}section#sidebar .eventQuickCardSidebar>ul{transition:filter .2s}section#sidebar .eventQuickCardSidebar>ul:not(:active){cursor:help;filter:blur(10px) saturate(0)}section#sidebar .eventQuickCardSidebar>ul:not(:active) a:hover,section#sidebar .eventQuickCardSidebar>ul:not(:active) a:link,section#sidebar .eventQuickCardSidebar>ul:not(:active) a:visited{border-bottom:initial!important;color:initial!important}section#sidebar .eventQuickCardSidebar>ul:not(:active) *{pointer-events:none}ul.fightCard{visibility:hidden}ul.fightCard.was-flipped{visibility:visible}ul.fightCard.hide-results .fightCardBout{cursor:help;display:flex!important;flex-wrap:wrap}ul.fightCard.hide-results .fightCardBout .fightCardResultHolder{order:1}ul.fightCard.hide-results .fightCardBout .fightCardBoutNumber{order:2}ul.fightCard.hide-results .fightCardBout .fightCardFighterImage:nth-child(3){order:3}ul.fightCard.hide-results .fightCardBout.flip .fightCardFighterImage:nth-child(3){order:7}ul.fightCard.hide-results .fightCardBout .fightCardFighterBout.left{order:4}ul.fightCard.hide-results .fightCardBout.flip .fightCardFighterBout.left{order:6;text-align:left}ul.fightCard.hide-results .fightCardBout .fightCardMatchup{order:5}ul.fightCard.hide-results .fightCardBout .fightCardFighterBout.right{order:6}ul.fightCard.hide-results .fightCardBout.flip .fightCardFighterBout.right{order:4;text-align:right}ul.fightCard.hide-results .fightCardBout .fightCardFighterImage:nth-child(7){order:7}ul.fightCard.hide-results .fightCardBout.flip .fightCardFighterImage:nth-child(7){order:3}ul.fightCard.hide-results .fightCardBout .fightCardFighterName{display:flex}ul.fightCard.hide-results .fightCardBout .fightCardFighterName .resultIcon,ul.fightCard.hide-results .fightCardBout .fightCardFighterName>a{margin:0 .2em}ul.fightCard.hide-results .fightCardBout .fightCardFighterName.left,ul.fightCard.hide-results .fightCardBout.flip .fightCardFighterName.right{justify-content:flex-end}ul.fightCard.hide-results .fightCardBout.flip .fightCardFighterName.left{justify-content:flex-start}ul.fightCard.hide-results .fightCardBout.flip .fightCardFighterName.right>a{order:1}ul.fightCard.hide-results .fightCardBout.flip .fightCardFighterName.left>a,ul.fightCard.hide-results .fightCardBout.flip .fightCardFighterName.right .resultIcon{order:2}ul.fightCard.hide-results .fightCardBout.flip .fightCardFighterName.left .resultIcon{order:1}ul.fightCard.hide-results .fightCardBout:not(:active) .fightCardFighterRank,ul.fightCard.hide-results .fightCardBout:not(:active) .result,ul.fightCard.hide-results .fightCardBout:not(:active) .time{visibility:hidden}ul.fightCard.hide-results .fightCardBout:not(:active) .resultIcon{display:none}ul.fightCard.hide-results .fightCardBout:not(:active) .fightCardFighterBout.loss,ul.fightCard.hide-results .fightCardBout:not(:active) .fightCardFighterBout.nc,ul.fightCard.hide-results .fightCardBout:not(:active) .fightCardFighterBout.win{background-color:initial}.eventAwardDescription:not(:active){cursor:help;filter:blur(10px)}.results-toggle{align-items:center;display:flex;justify-content:flex-end;margin-top:1.25rem}.results-toggle_label{align-items:center;cursor:pointer;display:flex}.results-toggle_label-text{font-size:1rem;line-height:1.5rem;margin-right:.75rem}.results-toggle_wrapper{position:relative}.results-toggle_input{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.results-toggle_track{--tw-bg-opacity:1;--tw-shadow:inset 0 2px 4px 0 rgba(0,0,0,.06);background-color:rgba(229,231,235,var(--tw-bg-opacity));height:1rem;width:2.5rem}.results-toggle_knob,.results-toggle_track{border-radius:9999px;box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.results-toggle_knob{--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-bg-opacity:1;--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px 0 rgba(0,0,0,.06);background-color:rgba(239,68,68,var(--tw-bg-opacity));height:1.5rem;left:-.25rem;position:absolute;top:-.25rem;transform:translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));transition-duration:.15s;transition-property:background-color,border-color,color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1);width:1.5rem}.results-toggle input:checked~.results-toggle_knob{--tw-translate-x:1.25rem;--tw-bg-opacity:1;background-color:rgba(16,185,129,var(--tw-bg-opacity))}.searchResultsFighter td:nth-child(5):not(:active){color:transparent}.searchResultsFighter td:nth-child(5):before{color:initial;content:\"⚠️\";cursor:pointer;font-size:1.2em;margin-right:.3em;vertical-align:top}";

GM_addStyle(css_248z);
let container;

const toggleAllResults = event => {
  var _container;

  (_container = container) == null ? void 0 : _container.classList.toggle('hide-results', event.target.checked);
};

const eventPage = () => {
  document.querySelectorAll('.fightCardBout').forEach(elem => {
    var _elem$querySelector, _elem$querySelector2;

    const fighterLeftName = (_elem$querySelector = elem.querySelector('.fightCardFighterName.left > a')) == null ? void 0 : _elem$querySelector.textContent;
    const fighterRightName = (_elem$querySelector2 = elem.querySelector('.fightCardFighterName.right > a')) == null ? void 0 : _elem$querySelector2.textContent;
    if (fighterLeftName == null || fighterRightName == null) return;
    let title = 'Click and hold to show result of\n';

    if (Math.round(Math.random()) === 1) {
      title += `${fighterRightName} vs. ${fighterLeftName}`;
      elem.classList.add('flip');
    } else {
      title += `${fighterLeftName} vs. ${fighterRightName}`;
    }

    elem.setAttribute('title', title);
  });
  container = document.querySelector('ul.fightCard');
  if (container === null) return;
  container.classList.add('hide-results', 'was-flipped');
  container.insertAdjacentElement('beforebegin', VM.hm("div", {
    className: "results-toggle"
  }, VM.hm("label", {
    htmlFor: "toggle-results",
    className: "results-toggle_label"
  }, VM.hm("div", {
    className: "results-toggle_label-text"
  }, "Hide all results"), VM.hm("div", {
    className: "results-toggle_wrapper"
  }, VM.hm("input", {
    id: "toggle-results",
    type: "checkbox",
    className: "results-toggle_input",
    onChange: toggleAllResults,
    checked: true
  }), VM.hm("div", {
    className: "results-toggle_track"
  }), VM.hm("div", {
    className: "results-toggle_knob"
  })))));
};

document.addEventListener('DOMContentLoaded', () => {
  if (location.pathname.includes('/events/')) {
    eventPage();
  }
});

})();
