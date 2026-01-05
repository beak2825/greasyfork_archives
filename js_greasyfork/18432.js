// ==UserScript==
// @name        Ignora hilos
// @namespace   Ignora hilos
// @description Ignora hilos en 33bits
// @version     0.5
// @include     http://33bits.gamestribune.com/foro*
// @include     http://www.33bits.gamestribune.com/foro*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18432/Ignora%20hilos.user.js
// @updateURL https://update.greasyfork.org/scripts/18432/Ignora%20hilos.meta.js
// ==/UserScript==    

/* 

                                        *********************** Legend *********************

addThread:
    name -> saves the content of the prompt
    t -> selectors we want modify
    link -> find and saves the link of the name provided
    
ignoreThread:
    t -> saves the content of the thread we want to ignoreThread
    i and j -> controls the loop
   
seeIgnoredThreads:

    body -> saves the selector of the body to control it

main:
    m -> saves the selector of the menu link in the header of the forum
    l -> creates a li element for concatenate in the ul of the variable 'm'
    l2 -> creates another li element we append in the first li element
    a -> selector of addThread link
    s -> selector of seeIgnoredThreads link
    
*/
window.onload = function() {


        function addThread() {
            
            var name = prompt("Añade el hilo (NOMBRE)");

            /* Save the link of the thread */
            var t = document.querySelectorAll('div span span a');
            var link; 

            if (t.length != 0) {

                for (i = 0; i < t.length; i++) {

                    if (t[i].text == name) {
                        link = t[i].href;
                        break;
                    }

                    //If we want to add a thread from the own thread
                    else {
                        link = window.location.protocol + "//" + window.location.hostname + window.location.pathname;
                        
                    }

                }
            }

            else {
                    link = window.location.protocol + "//" + window.location.hostname + window.location.pathname;
                    if (link == "http://33bits.gamestribune.com/foro/" || link == "http://33bits.gamestribune.com/foro/index.php") {
                        link = undefined;
                    }
            }

            /*---- Add thread to localStorage ------*/
            if (name != null && link != undefined) {
                    localStorage.setItem(name, link);
                    location.reload();
            }          

            else {
                alert("No has introducido un nombre válido");
            }

        } //end addThread
        

        function ignoreThread(){
            
            var t = document.querySelectorAll('div span span a');        
            
            for (var i = 0; i < localStorage.length;i++){
                
                
                for (var j = 0; j < t.length; j++) {
                    
                    if (localStorage.key(i) == t[j].text) {
                    
                        t[j].parentNode.parentNode.parentNode.parentNode.parentNode.innerHTML = "<td>-</td><td>-</td><td>HILO IGNORADO</td>" +
                        "<td>-</td><td>-</td>";
                    }
                  
                }
                            

            }

        } //end ignoreThread  


        function ignoreURL() {

            var currentURL = window.location.protocol + "//" + window.location.hostname + window.location.pathname; 
            var body = document.querySelector('body');

            for (i = 0; i < localStorage.length; i++) {

                if (currentURL == localStorage.getItem(localStorage.key(i))) {

                    body.innerHTML = "¡¡Hilo ignorado!!";
                }

            }

        } //end ignoreURL


        function ignoreIndex() {

            var t2 = document.querySelectorAll('span.smalltext a');             
            
             for (i = 0; i < localStorage.length; i++) {
                 
                for (j = 0; j < t2.length; j++) {

                    if (t2[j].title == localStorage.key(i)) {
                        t2[j].parentNode.innerHTML = "HILO IGNORADO";
                    }
                }
            }
        } //end ignoreIndex



       function seeIgnoredThreads() {
            
            var body = document.querySelector('body');

            
            body.innerHTML = "";

            if (localStorage.length == 0) {

                body.innerHTML += "<center>No hay hilos ignorados</center>" +
                 "<li style='list-style: none'><button onclick='location.reload();'>Salir</button></li>";
            }

            else {

                for (var i = 0; i < localStorage.length; i++) {               
                    
                         body.innerHTML += "<li style='list-style: none;'>" + localStorage.key(i) + "</li>" 
                         + "<button onclick='localStorage.removeItem(localStorage.key(" + i + ")); alert(\"Borrado\");'>Eliminar hilo ignorado</button>";
                }

                body.innerHTML += "<li style='list-style:none'><button onclick='location.reload();'>Salir</button></li>";


            }        

        } //end SeeIgnoredThreads


        function deleteAll() {

            localStorage.clear();
            alert("Borrados todos los hilos ignorados");
        } //end deleteAll


        
        
 /* Create buttons and append them */
 var m = document.querySelector('.panel_links');
 var l = document.createElement("li");
 var l2 = document.createElement("li");
 l2.classList.add(".parentMenu");
 m.appendChild(l);
 l.appendChild(l2);
 
 //Create the structure of the dropDown menu
 l2.innerHTML = "<a href='#' style='cursor: pointer'>- Ignorar hilos -</a>" + 
 "<ul class='dropDown'>" + 
 "<li><a class='addThread'>Añadir hilo</a></li>" +
 "<li><a class='seeIgnoredThreads'>Borrar hilos ignorados</a></li>" +
 "<li><a class='deleteAll'>Borrar todos los hilos ignorados</a></li>" +
 "</ul>";
 
 
 /*Add style and events*/
 var a = document.querySelector('.addThread');
 var s = document.querySelector('.seeIgnoredThreads');
 var d = document.querySelector('.dropDown');
 var e = document.querySelector('.deleteAll');
 
 //If we want menu will be dropdownable we have to append a style tag in the head with the CSS
 var c = document.createElement("style");
 var css = "li:hover li:hover .dropDown { display: inline-block; }" + 
 ".dropDown { display: none; background-color: #333; position: absolute;" +
 " margin-top: 17px; margin-left: -100px; padding: 5px; width: 180px; }" +
 ".parentMenu { position: relative; }" +
 "button { border-radius: 0px !important; }";
 c.appendChild(document.createTextNode(css));
 document.querySelector('head').appendChild(c);
 
 //The rest of the CSS
 s.style.cursor = "pointer";
 a.style.cursor = "pointer";
 e.style.cursor = "pointer";
 document.querySelector(".dropDown li").style.display = "block";
 
 
 
 a.addEventListener("click", addThread);
 s.addEventListener("click", seeIgnoredThreads);
 e.addEventListener("click", deleteAll);
 
 //Callback the ignoreThread() function
 ignoreThread();
 ignoreURL();
 ignoreIndex();
 
}