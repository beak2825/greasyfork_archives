// ==UserScript==
// @name         cdnjs importer
// @namespace    durr
// @version      0.3
// @description  Imports scripts into current document
// @author       fsuchodolski
// @require      https://cdnjs.cloudflare.com/ajax/libs/nanoajax/0.4.3/nanoajax.min.js
// @match        *://*/*
// @noframes
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/30541/cdnjs%20importer.user.js
// @updateURL https://update.greasyfork.org/scripts/30541/cdnjs%20importer.meta.js
// ==/UserScript==

    const addHeadScript = (code) => {
        const scriptNode = document.createElement('script');
        scriptNode.innerHTML = code;
        document.head.appendChild(scriptNode);
    };
        
    const importLib = (url, cb) => {
        nanoajax.ajax({url}, (status, code) => {
            if(status == 200){
               addHeadScript(code);
				
               if(!cb){ 
				   console.log(':: ' + url + ' loaded ::');
			   } else {
				   cb();
			   }
				
            } else {
               console.error('error loading: ' + url);   
            }
        });
    };

   const cdnGetUrlByName = (name, cb) => {
      nanoajax.ajax({url: `https://api.cdnjs.com/libraries/${name}`, method: 'GET'}, (status, responseStr) => {
		  if(status!=200){
			  console.error('cnd get url fail');
			  return;
		  }
		  if(responseStr.length <= 2) {
			  console.error(`"${name}" not found on cdnjs.com`);
			  return;
		  }
		  
		  const r = JSON.parse(responseStr);
		  cb(`https://cdnjs.cloudflare.com/ajax/libs/${r.name}/${r.version}/${r.filename}`);
	   });
   };

   const importByNameOrUrl = (query) => {
	   const isUrl = !!query.match(/^http/);
	   
	   if(!isUrl) {
		   return cdnGetUrlByName(query, (url) => {importLib(url);});
	   }
	   
	   return importLib(query);
   };

   const cdnSearch = (query) => {
	   nanoajax.ajax({url: `https://api.cdnjs.com/libraries?search=${query}&fields=description`, method: 'GET'}, (status, response) => {
		   console.log(':: cdnjs importer :: ', JSON.parse(response).results);
	   });
   };

   document.addEventListener("DOMContentLoaded", function(event) { 
       const w = event.target.defaultView;
     
       if(w.cdnjs) return;
       
       w.cdnjs = {
           import: importByNameOrUrl,
		   search: cdnSearch
       };
       console.log(':: cdnjs importer loaded :: ');
   });

