// ==UserScript==
// @name Gazsify444
// @version 1.5.5
// @author Herr Otto Flick
// @namespace https://greasyfork.org/hu/users/323718-%C3%A1d%C3%A1m-francz
// @description Szabad kommentelés 444-en
// @run-at document-end
// @match https://*.444.hu/*
// @match https://444.hu/*
// @downloadURL https://update.greasyfork.org/scripts/388215/Gazsify444.user.js
// @updateURL https://update.greasyfork.org/scripts/388215/Gazsify444.meta.js
// ==/UserScript==


setTimeout(function() {
    //highlight cinkoczi
    var posters = document.getElementsByClassName("byline__authors");
    for (var i = 0; i < posters.length; i++) {
        var as = posters[i].getElementsByTagName('a');
        for (var j = 0; j < as.length; j++) {
            if(as[j].textContent === 'Czinkóczi Sándor'){
                as[j].textContent = '⚠️Czinkóczi Sándor⚠️';
                as[j].style.color = 'red';
            }
        }
    }
    //check is there Disqus, if no, we are adding it
    if(! document.querySelector(".gae-comment-click-open")){
        //html code for Comments button and comment policy link etc.
        var inhtml = `
	<section id="comments">
    <!-- comments -->
    <div class="subhead"> <span>Uralkodj magadon!</span> </div>
    <div> <b>Új kommentelési szabályok érvényesek 2019. december 2-től.</b><a href="https://444.hu/2019/12/02/valtoznak-a-kommenteles-szabalyai-a-444-en" target="_blank">Itt olvashatod el</a>, hogy mik azok, és <a href="https://444.hu/2019/12/02/ezert-valtoztatunk-a-kommenteles-szabalyain" target="_blank">itt azt</a>, hogy miért vezettük be őket.</div>
    <button class="gae-comment-click-open" style="background-color: rgb(201, 76, 76); width: 100%; margin: inherit; border: 0; padding: .3125rem; font-family: league; font-size: 1.625rem; color: #fff; cursor: pointer;">Hozzászólások (Gazsify444)</button>
    <div class="ad">
        <div id="444_aloldal_kommentek"></div>
    </div>
    <div id="disqus_thread" class="freehand layout"></div>
    <script>
        var disqus_url = "'+window.location.href+'";
    </script>
</section>`;

        var div=document.createElement("div");
        //check, is there comment container
        if(document.querySelector("#ap-article-footer1")){
            //get comment div container
            //document.querySelector(".tag-list").appendChild(div);
            document.querySelector("#ap-article-footer1").parentNode.insertBefore(div, document.querySelector("#ap-article-footer1").nextSibling);
            div.innerHTML=inhtml;

            //get comments button te remove once clicked
            var toogle = document.querySelector(".gae-comment-click-open");
            //onclick function to remove comments button, and add comment section instead
            var onclfunction = function() {
                var doc;
                var selement;
                var sname;
                sname = window.disqus_shortname;
                doc = document;
                //embed disqus.com comment section
                (selement = doc.createElement("script")).src = "https://444hu.disqus.com/embed.js";
                selement.setAttribute("data-timestamp", +new Date);
                (doc.head || doc.body).appendChild(selement);
                //remove comments button
                toogle.remove();
            };
            //auto open comments by url
            if ("#comments" === window.location.hash) {
                onclfunction();
            } else {
                toogle.addEventListener("click", function(toogle) {
                    onclfunction();
                });
            }
        }
    }

    var cbutton = document.querySelector(".gae-comment-click-open");
    var rbutton = document.createElement("button");
    //rbutton.setAttribute('class','comments-toggle');
    rbutton.style = 'background-color: #00BFFF; width: 100%; margin: inherit; border: 0; padding: .3125rem; font-family: league; font-size: 1.625rem; color: #fff; cursor: pointer;';
    rbutton.innerText = 'REDDIT';
    rbutton.addEventListener("click", function(toogle) {
        onclfunction2();
    });
    cbutton.parentNode.insertBefore(rbutton, cbutton);
}, 2000);

//add Reddit button
var onclfunction2 = function() {
    var url = 'http://www.reddit.com/'+window.location;
    window.open(url, '_blank');
};