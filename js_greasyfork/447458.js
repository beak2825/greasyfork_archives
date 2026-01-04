// ==UserScript==
// @name        Smile @ UK diskprices
// @namespace   EliotScripts
// @match       https://diskprices.com/
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @grant       none
// @license     MIT
// @version     2.0
// @author      EliotCole
// @description 05/07/2022, 13:36:24
// @downloadURL https://update.greasyfork.org/scripts/447458/Smile%20%40%20UK%20diskprices.user.js
// @updateURL https://update.greasyfork.org/scripts/447458/Smile%20%40%20UK%20diskprices.meta.js
// ==/UserScript==
const pramzo = (new URL(document.location)).searchParams;
const loczy = pramzo.get('locale');

(function (){
  if (loczy == "uk") {
      $("a[href^='https://www.amazon.co.uk']").each(function (){
        let hreffy = new URL( $(this).attr( "href" ) );
        let hosty = "smile.amazon.co.uk";
        let newUrl = new URL ( hreffy.protocol+"//"+hosty+hreffy.pathname+hreffy.search );
        
        $(this).prop("href", newUrl).prop("target", "_new");
      });
    console.log("The locale for this page is '"+loczy+"' so I have done the thing, sir.");
  } else {
    console.log("The locale for this page is not 'uk' so nothing has been done.");
  };
})();