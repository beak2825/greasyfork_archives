// ==UserScript==
// @name        Designer V2
// @namespace   Eliot Cole Scripts
// @match       https://make.powerautomate.com/*
// @grant       none
// @license MIT
// @version     5
// @author      Eliot Cole
// @description 26/09/2024, 15:28:00
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @require     https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/485735/Designer%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/485735/Designer%20V2.meta.js
// ==/UserScript==

//const PaUrlOrig = 1;
console.log('PAutoData: HEWWO');

const PaUrlOrig = location.origin; //.origin;
console.log('PAutoData: Host (etc) is: '+PaUrlOrig);
const PaUrlPath = location.pathname;
console.log('PAutoData: Path is: '+PaUrlPath);
const PaPageIsCreate = PaUrlPath.endsWith('/create');
console.log('PAutoData: Page is Create page: '+PaPageIsCreate);
const PaPageIsRun = PaUrlPath.includes('/runs/');
console.log('PAutoData: Page is an individual Runs page: '+PaPageIsRun);
const PaPageIsRuns = PaUrlPath.endsWith('/runs');
console.log('PAutoData: Page is Runs collection page: '+PaPageIsRuns);
const PaPageIsFlows = PaUrlPath.endsWith('/flows');
console.log('PAutoData: Page is Flows collection page: '+PaPageIsFlows);
const PaPageHasFlowId = PaUrlPath.includes('/flows/');
console.log('PAutoData: Page is a Flow page of sorts: '+PaPageHasFlowId);
const PaPageIsDeets = PaUrlPath.endsWith('/details');
console.log('PAutoData: Page is Flow Details page: '+PaPageIsDeets);
const PaEnv = PaUrlPath.split('/environments/')[1].split('/')[0];
console.log('PAutoData: Environment is: '+PaEnv);
const PaUrlHasQueries = (location.search !== null && location.search !== '');
console.log('PAutoData: It is '+PaUrlHasQueries+' that the URL has a query already');
//const PaUrlOrigQueries = location.search;
//console.log('PAutoData: Those query details are: '+PaUrlOrigQueries);
const PaQueries = {
  "v3": false,
  "v3survey": false
};
const PaUrlQry = decodeURIComponent( $.param(PaQueries) );
console.log('PAutoData: URL Query is: ' + PaUrlQry);
var PaPageIsEdit = false;
if (PaPageHasFlowId) {
  const PaFlowId = PaUrlPath.split('/flows/')[1].split('/')[0];
  console.log('PAutoData: Flow ID is: '+PaFlowId);
  PaPageIsEdit = PaUrlPath.endsWith(PaFlowId);
  console.log('PAutoData: Page is Flows collection page: '+PaPageIsEdit);
  const PaFlowUrlDeet = new URL(PaUrlOrig+'/environments/'+PaEnv+'/flows/'+PaFlowId+'/details');
  console.log('PAutoData: URL Details is: '+PaFlowUrlDeet);
  const PaFlowUrlEdit = new URL(PaUrlOrig+'/environments/'+PaEnv+'/flows/'+PaFlowId+'?'+PaUrlQry);
  console.log('PAutoData: URL Edit is: ' + PaFlowUrlEdit);
} else {
  const PaFlowId = '';
  const PaFlowUrlDeet = '';
  const PaFlowUrlEdit = '';
  console.log('PAutoData: Flow ID is not present.');
};

var PaPageType = '';
if ( PaPageIsEdit ){
  PaPageType = 'edit';
} else if ( PaPageIsRun ) {
  PaPageType = 'run';
} else {
  PaPageType = PaUrlPath.split('/').pop();
};
console.log('PAutoData: This is a '+PaPageType+' page and the appropriate observers will now run.');

function openEditorV2Grr(){
  window.location.href = PaFlowUrlEdit;
};

// This should hopefully replace the links to the new editor when creating flows.
// Add an 'if url =' condition to this ... it doesn't need to be on all the time
// Dev - Cannot get the create to work as it changes the url based on the selection ... need to find out how they used to do it before v3
//     - ... For now this will mean that you just use 'skip' and work from there.
//
//     ,a.ms-Button.fl-DefaultButton[aria-label="Create"]

VM.observe(document.body, () => {
  // Find the target node
  const $node = $('a.ms-Button.fl-DefaultButton[aria-label="Skip"],a.ms-Button.fl-DefaultButton[aria-label="Create"]');

  if ($node.length) {
    console.log('PAutoData: running the CREATE converter');
    let hreffah =  $node.attr('href').replace('v3=true', 'v3=false');
    $node.attr('href', hreffah);
    console.log('PAutoData: CREATE converter is DONE');
    // disconnect observer
    //return true;
  }
}
/* THE BELOW CONTROLS GRANULAR OPTIONS USE IN EXTREME CASES
,{
  attributes: true,
  childList: false,
  subtree: false,
  // any other options here
}
*/
);


// REPLACE V3 EDIT FLOW BUTTON WITH <A> LINK
VM.observe(document.body, () => {
  const $node = $('button#editFlow');

  if ($node.length) {
    if ( PaPageIsRun ) {
      //width: 55px; height: 40px;
      //let HtmlLinkConstructor = '<a href="'+PaFlowUrlEdit+'&converted=true" id="PautoEditedEditLink" aria-label="Edit" data-automation-id="flowCommand-editV2" style="width:94%; height:94%; margin: 1px 4px; padding: 0px 4px; border-radius: 2px; border: 0px solid; display: flex; flex-flow: row nowrap; background-color: #ffccffdd; justify-content: center; align-items: center; color: black;">EDIT &#9998;</a>';
      let HtmlLinkConstructor = '<button  id="PautoEditedEditLink" style="outline: transparent; position: relative; font-family: Roboto, sans-serif; -moz-osx-font-smoothing: grayscale; font-size: 14px; font-weight: 400; border: medium; border-radius: 0px; box-sizing: border-box; cursor: pointer; display: inline-block; padding: 0px 4px; text-decoration: none; text-align: center; min-width: 40px; background-color: #ffccffdd; color: rgb(51, 51, 51); height: 100%; user-select: auto;">EDIT &#9998;</button>';
      console.log("PAutoData: New HTML is: "+HtmlLinkConstructor);
      $node.before(HtmlLinkConstructor);
      $node.remove ();
      document.getElementById ("PautoEditedEditLink").addEventListener (
        "click", openEditorV2Grr, false
      );
      console.log("PAutoData: New EDIT button is completed");
      // disconnect observer
      return true;
    } else {
      return true;
    }
  }
}
/*
,{
  attributes: true,
  childList: false,
  subtree: false,
  // any other options here
}
*/
);

// REPLACE V3 RUN LINKS
/* Couldn't get this to work for the runs items
$('a[href*="/runs/"]').attr('href', function( i, val ) {
  return val + "?v3=false";
});
*/
// This should replace the now V3'd run links
// This might still require the 'disconnect' to be turned off / commented out
VM.observe(document.body, () => {
  const $node = $('a.ms-Link.fl-Link[href*="/runs/"]');

  if ($node.length) {
    console.log('PAutoData: running the RUNS converter');
    $node.each(function(){
      let hreffahOrig = $(this).attr('href');
      console.log("PAutoData: RUNS href is: "+hreffahOrig);
      let isConverted = hreffahOrig.endsWith('&converted=true');
      let isUnConverted = !isConverted;
      console.log("PAutoData: RUNS URL is "+isUnConverted+" that the href is unconverted");
      if(isUnConverted){
        let hreffah = ""+$(this).attr('href')+"?v3=false&converted=true";
        console.log("PAutoData: RUNS new href is: "+hreffah);
        $(this).attr('href', hreffah);
    }
    });
    // disconnect observer
    return true;
  }
}
/* THE BELOW CONTROLS GRANULAR OPTIONS USE IN EXTREME CASES
,{
  attributes: true,
  childList: false,
  subtree: false,
  // any other options here
}
*/
);


VM.observe(document.body, () => {
  const $node = $('a[name="Edit"][href*="?v3=true"], a[aria-label="Edit"][href*="?v3=true"]');

  if ($node.length) {
    console.log('PAutoData: running the main edit link converter');

    $node.each(function(){

      if ( $(this).is('a[name="Edit"][href*="?v3=true"]') ) {
        //console.log('It is a link - nameStylee.');
        renameEditorLink(this);
      } else if ( $(this).is('[aria-label="Edit"][href*="?v3=true"]') ) {
        //console.log('It is a link - ariaLabelStylee.');
        renameEditorLink(this);
      }

      function renameEditorLink (aEle){
        let LinkEditor = $(aEle).attr('href');
        LinkEditor = LinkEditor.replace('v3=true', 'v3=false');
        LinkEditor = LinkEditor.replace('v3survey=true', 'v3survey=false');
        $(aEle).attr('href', LinkEditor);

        let ValueDAI = $(aEle).attr('data-automation-id');
        ValueDAI = ValueDAI.replace('flowCommand-editV3', 'flowCommand-editV2');
        $(aEle).attr('data-automation-id', ValueDAI);
        //console.log('v2 DUN!');
      }
    });

    // // disconnect observer - This is disabled as if you disconnect you cannot enter more comments
    // return true;
  }
}
/* THE BELOW CONTROLS GRANULAR OPTIONS USE IN EXTREME CASES
,{
  attributes: true,
  childList: false,
  subtree: false,
  // any other options here
}
*/
);