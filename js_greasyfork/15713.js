// ==UserScript==
// @name         Ver baneados
// @namespace    Wixie
// @version      2.0
// @description  [v7] Te muestra si un user esta ban o no.
// @author       wixie
// @include      http*://*.taringa.net/*
// @include      http*://*.taringa.net/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15713/Ver%20baneados.user.js
// @updateURL https://update.greasyfork.org/scripts/15713/Ver%20baneados.meta.js
// ==/UserScript==

(function(){
    var buttonBannedV7 = '<button type="button" class="btn-svg btn-svg-outline btn btn-default" style="margin-top: 5px"><span class="reloco" title="Baneado"><svg style="width:24px;height:24px" viewBox="0 0 24 24"> <path fill="#000000" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12C4,13.85 4.63,15.55 5.68,16.91L16.91,5.68C15.55,4.63 13.85,4 12,4M12,20A8,8 0 0,0 20,12C20,10.15 19.37,8.45 18.32,7.09L7.09,18.32C8.45,19.37 10.15,20 12,20Z"></path> </svg></span></button>';
    var buttonOkayV7 = '<button type="button" class="btn-svg btn-svg-outline btn btn-default" style="margin-top: 5px"><span class="reloco" title="Activo"><svg style="width:24px;height:24px" viewBox="0 0 24 24"> <path fill="#000000" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"></path> </svg> </span></button>';
    var perfilButtonParentClass = null;

    function call(data) {
        var state;
        var buttonInfo;

        data = JSON.parse(data);
        console.log(data);
        if (data.status === 10) {
            state = data.gender == 'f' ? "Activa" : "Activo";
            document.getElementsByClassName(perfilButtonParentClass)[0].insertAdjacentHTML('beforeend', buttonOkayV7); // https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
        }
        else if (data.status === 5) {
            state = data.gender == 'f' ? "Baneada" : "Baneado";
            document.getElementsByClassName(perfilButtonParentClass)[0].insertAdjacentHTML('beforeend', buttonBannedV7); // https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
        }
    }

    function banAsync(user)
    {
        // robado de: https://stackoverflow.com/questions/247483/http-get-request-in-javascript
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                call(xmlHttp.responseText);
        };
        xmlHttp.open("GET", "https://api.taringa.net/user/nick/view/" + user, true); // true para que sea req asyncrona
        xmlHttp.send(null);
    }

    function start() {
        if(document.getElementsByClassName('reloco').length > 0) return; // osea si ya esta el botonsito cargado en el perfil.

        var userName = (document.querySelector('span[data-role="user-username"]').innerText).replace("@", "");
        perfilButtonParentClass = document.getElementsByClassName("btn-svg")[0].parentElement.className; // el contenedor de los botonsitos de acciones de perfil.
        banAsync(userName);
    }

    setInterval(start, 500);

})();