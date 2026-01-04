// ==UserScript==
// @name         so_link_change
// @namespace    fxqy/so_link_change
// @version      0.13
// @description  so链接修改 
// @author       xyz
// @match        *://*.so.com/s*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAfJJREFUSEu1lc1Rw0AMhSWnAFICNJA4Q+BK0kE6ACrApgGgAbxUQOgAKsBcIUw2VEAHJGcmFk/BzhhnbfNjdsYny/q0T08y0z8f/uf8VAnwn4KBMB0SsY9C9NFjicSy0I3dM3FdgU6A/xj44nGEjwc1CWJOJLT7BlD32QCkye8R3sazYGFDktxmSfQ9sTcSlgDvt/DMARmWQb4A8smF6MZrSWB7Zu6qzZ8G7WTJBgkgYTnkC6DzHMbQ9kCTv/Sjozp99X1nEo5TSDzrR8PiN2vAZ0NZpVlwS7bLKi8m0JvIkl9VLhZIVWj8GpBVAs0v7N7l+Xeqz2L8p9Nz9OTMdfM1oDsJ1QldNKxX5QpnPz5dN1ULQ6ZePiYPQAFECPjV8KFA5/eNANI+vGn/UKDae32akSg1CKb+4WU3GjgBf2ryJDTQ5wTVXtl+pAO4eYOcTeew6c4PbLoNm2qD25U2XQ1NOmhYZuNZ3xx/x6p1w+laFbEOjUK4RWHFqtDKrxG70rzM3mXLLoXQHANkvCXd6WyoW/idu0uWETMfqSy5W1pIOywWVLqukxYWGfZSlUyrhZiIwZCNEdfVQStCan84CSpFkP5sNMECVrSe4KcjcpvtnXQO9NYbkF9NretWZZDGAArNIJDOZuu+UUAGyTe6cUBRvg8tAh8oizHBwwAAAABJRU5ErkJggg==
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/432913/so_link_change.user.js
// @updateURL https://update.greasyfork.org/scripts/432913/so_link_change.meta.js
// ==/UserScript==

function $QA(a) {
    return document.querySelectorAll(a);
}

(function() {
    'use strict';
  
    window.addEventListener("load", function() {
        on_window_loaded();
      	window.setTimeout(on_window_loaded, 2000);
    });

})();


function on_window_loaded() {

    var ls = $QA("#warper>#container>#main>.result>.res-list>.res-title>a");
    for(var i=0; i<ls.length; i++){
    	var itm = ls[i];
      	var durl = itm.getAttribute("data-mdurl");
      	if(durl) itm.setAttribute("href", durl);
      	//itm.onclick=function(){
        //  window.open("https://"+this.innerHTML, "_blank");
        //};
    }

}
