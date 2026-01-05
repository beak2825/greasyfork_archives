// ==UserScript==
// @name        NPR.org HTML5 player
// @description Listen to NPR without having to install Flash, downloads, no ads.
// @namespace   https://greasyfork.org/users/4813-swyter
// @match       *://www.npr.org/player/v2/mediaPlayer.html*
// @version     2016.04.14
// @grant       GM_addStyle
// @run-at      document-start
// @icon        http://i.imgur.com/2qswvLC.png
// @downloadURL https://update.greasyfork.org/scripts/17811/NPRorg%20HTML5%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/17811/NPRorg%20HTML5%20player.meta.js
// ==/UserScript==

// https://api.npr.org/query?id=466555217&format=json&apiKey=MDAzMzQ2MjAyMDEyMzk4MTU1MDg3ZmM3MQ010

// http://www.npr.org/player/v2/mediaPlayer.html?action=1&t=1&islist=false&id=466555217&m=468149502
// http://www.npr.org/player/v2/mediaPlayer.html?action=1&t=1&islist=false&id=468901493&m=468940337
// http://www.npr.org/player/v2/mediaPlayer.html?action=1&t=1&islist=false&id=468933562&m=469337177&live=1
// http://www.npr.org/player/v2/mediaPlayer.html?action=2&t=1&islist=false&id=469027281&m=469383445

/* if there's no ID just redirect to this neat HTML5 page with 24h news */
try
{
  id = location.search.split('id=')[1].split('&')[0];
}
catch(e)
{
  location.href = 'https://npr.today';
}

window.xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.npr.org/query?id=' + id + '&format=json&apiKey=MDAzMzQ2MjAyMDEyMzk4MTU1MDg3ZmM3MQ010');
xhr.responseType = 'json';
xhr.onload = function(e)
{
  console.log(this.response);

  container = document.createElement("fieldset");
  divholder = document.createElement("article");
  selector = document.createElement("select");
  aplayer = document.createElement("audio");

  /* replace the Flash warning with our HTML5 player */
  flash_sucks = document.querySelector('#homepageFlash, body');
  flash_sucks.parentElement.replaceChild(container, flash_sucks);

  /* add our visible title */
  legend = document.createElement("legend");
  legend.textContent = this.response.list.story[0].title.$text;

  /* set a related image in the left side */
  divholder.style.backgroundImage = "url(" + this.response.list.story[0].image[0].src + ")";

  /* set a default song */
  aplayer.controls = true;

  /* ten songs seen at once */
  selector.size = 10;

  audios=this.response.list.story[0].audio;

  /* fill out the list box with the tracklist */
  for(var entry in audios)
  {
    console.log("=> ", entry % 11, audios[entry]);

    elem = document.createElement("option");
    elem.value = audios[entry].title.$text;
    
    len = audios[entry].duration.$text;
    
    len = (len / 60|0) + ":" + ('00' + (len % 60 | 0)).substr(-2);
    

    selector.add(new Option(((entry|0) + 1) + ". " + audios[entry].title.$text + " — " + len, entry));
  }

  container.appendChild(legend);
  container.appendChild(divholder);
  
  divholder.appendChild(selector);
  divholder.appendChild(aplayer);
  
  /* play the sound track selected in the list box */
  selector.onchange = function(e)
  {
    index = e.explicitOriginalTarget.value;
    
    console.log("(*)", e, xhr.response.list.story[0].audio[index].format.mp3[0].$text);

    aplayer.src = xhr.response.list.story[0].audio[index].format.mp3[0].$text;
    aplayer.play();
  };

  /* skip to the next song/audio in the playlist once the current one has finished */
  aplayer.addEventListener('ended', function(e)
  {
    console.log("(/)", e, selector.value, ((selector.value|0) + 1), (selector.options.length), ((selector.value|0) + 1) % (selector.options.length) );

    /* don't do anything if there's just a single item */
    if (selector.length <= 1)
      return;

    /* wrap around with the modulo operator looping back last->first */
    //selector.value++; //selector %= selector.options.length;
    selector.value = ((selector.value|0) + 1) % selector.options.length;
    
    console.log(selector.value, selector.options[selector.value]);
    
    /* as stupid as it looks like, javascript is a flaming pit of madness */
    selector.onchange({explicitOriginalTarget: selector.options[selector.value]});
  });
  
  /* autostart from the first song */
  selector.options[0].selected = true;
  selector.onchange({explicitOriginalTarget: selector.options[0]});
};

xhr.send();

GM_addStyle("audio, select {display:block; width:100%;} \
                   article {padding-left:240px; background-size: 240px auto; background-repeat: no-repeat;} \
                    legend {font-size: medium; padding: 5px; color: #4067b2; background: #EBEBEB url('http://media.npr.org/chrome/news/npr-home.png') repeat-y scroll 0px 0px / 88px auto; padding-left: 93px; left: -88px; background-position: left bottom; margin-left: 152px;} \
                         * {font-family: 'Gotham SSm',Helvetica,Arial,sans-serif !important;} \
  @media(max-width: 480px) {article {padding-left:0}  legend {margin-left:0}}");

/* will this generated stylesheet used in the main site last? who knows */
document.querySelector("link[rel=stylesheet]").href = 'https://s.npr.org/templates/css/generated/fingerprint/persistent-73cb243d716b971f095c14e7dfdb3432d2ecb623.css';