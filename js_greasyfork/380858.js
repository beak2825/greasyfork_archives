// ==UserScript==
// @name         interventions hebdomadaires sur fond noir
// @namespace    https://greasyfork.org/fr/users/30595-deicide
// @version      0.1
// @description  Better Readability
// @match        https://michelonfray.com/interventions-hebdomadaires/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// @icon          data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QBmRXhpZgAATU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAMAAAExAAIAAAAQAAAATgAAAAAAAJOjAAAD6AAAk6MAAAPocGFpbnQubmV0IDQuMS41AP/bAEMAAgEBAgEBAgICAgICAgIDBQMDAwMDBgQEAwUHBgcHBwYHBwgJCwkICAoIBwcKDQoKCwwMDAwHCQ4PDQwOCwwMDP/bAEMBAgICAwMDBgMDBgwIBwgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDP/AABEIAEAAQAMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AP38ooooAKKKKACiiigAooooA8Y/aq/4KG/BX9iZYo/id8Q9A8MahcQC6t9Md2udTuYizKJI7SFXndSyMoYIQSpGcg15T+zr/wAF0P2bf2jzqws/HDeE/wCyXVc+LLRtFW8Vs4eFpsK44ORkMvGVAIJ+eP8Agvl/wTK8D/Fz4w/Cv9pHXLrVLnUfB2saH4P1XRZfLbStT0i51GVHEi7RIshe9ZS2/aVONufmr9KvAnw48PfC7wlY6B4Z0LR/D+h6bGIbTT9Ns47W1tkH8KRoAqj2AoA8nj/4Kafs7STeX/wvD4Vq3+34mtEH5lwK9L+Ffxr8G/HTQJNV8E+LPDXjDS4pDC93ompw38CSAZKF4mYBsEcE5roW0+3f70MLfVBXwn/wVi/Ys8Q/tEfEb4Z6V8CvGFx8FPjNrF9Pc6p4z0RpbaZfDltCwuY7mOFk+1r9qnsVjjlPyu5IZRvyAfanxJ+Kvhf4NeF5Nc8X+JNB8K6LCypJf6vfxWNqjN0BklZVBPYZ5ry2f/gpn+ztBKFPxw+FTMenl+J7OQfmshr5k/4JmfsGeM/2cf2p/HGnftD/ABIvf2gvHUOm2mq+B/E2vebItjprNJDeRW1rM8iW0yzCLzWiJLJNb/NyVH6Cpp1vGPlt4V+iCgD5T/aJ/wCC3X7N/wCzl4estQuvH1r4u+3XHkLbeEo/7anhGMmSQQkrGg4GWIJJwAcHHcfso/8ABTz4EftsX0dh8OfiNomsa48TTHRLjzLDVlVRlz9kuFSYhe7KpUdc45r2rxH4R0nxhoN3pWraXp+qaXqERgurO7tkmguYzwUdGBVlPcEEV+YP/BJb/glf8OvDn/BSX47fH3Q/tmgzeAfG2sfD/wAPeHdNjig0i1tVt7d5X2bC2QblkVUZVQJjB4AAPtz9vLwD4J/aA+C2qfDPxh4k1DwuusW6eIIL60g3SwDS7u2vDIhZGjYq8cW6P77IzbR/EOAkufjJpfhC81iD9obwjcWNnA00Sah8No/tl4Bapc7UVdRh3P5bqdpVCD1AFe6fFf8AZ70n4x69Y3+rXWobtKjYWUURRUtpiGHnDKklsNjaxKEAZU855yz/AGOtMs47xV8R+IG+32EmnTl0tW3xvaWttnBhwHC2cLhhg7t3UEBeGpPFKT5Iq3Tv8/mfRYWjk7owdapJTt7ytpe+ysr7b367aarzXxH/AMLp0XwNJr8n7RHw9nsVs5r1E0/4co09xHCpabyw2qsGZAGyBnGDXWfs96dpfw28c65rHjD4kXHjjxprSPYNrd9paaVp9tbWTt5lnaBR5KiOV5XkxIzs2dxIiATc1D9jDQdRl1SSTVdU83VrS5s5JDb2jvAkyupMJaEmJgJZeUwW34bcAAL2tfsmaNruhXmlzarrH9mzPqM1rAPJIsJb/wAz7S8ZMZJz5020PuC+cwAwECz7TF/yr7/6/q3qafV8ksk6st3rbZW00s72du11d6OyOZ/aWOifE/xH4Z/4R/x03g3xjoKtqGneJrJrO5t7K1uA8TxXEc7hZ7edoduxASJIYmypVTWLZeDvjdLcRw2v7SHw1vHkYoiy/D1JJHIcoR+71NMneCvA6gjGa9Bt/wBlPS4NZkvDrOrSedfR37xPHbMhZL+5vwv+qztMt1Ip5ztCjOQWNDwb+yungjxNayWusaxKlnBdyQ6pPNC13HPcJBFgRiERsqLBvBcEBmwF28VUamJT96K/yM6mFymUX7Oq00uqeujfbTXTTprZu5xreDvjbd3f2eT9pH4bwt5z2zJafD+NJvMQAug8zUpAHUEEgqcA8iuo/Yl+Cfhn9njwVrmi6P43XxxrHijXb3xZrOoyTW3m3d3dOvnSCOHCpGCqqBzjpk1q2/7JGjwfY1bWNaljsTGsauLc7o4rmK6gRiIgT5csKYYncy5DluMXfhX+zJpfwk12xvtP1TVLhrG1NoI51g2yJ9ksbX5tsanOzT4DwR8xfsQBUamI5leKt11MamFytU5OFaTlZ293Rv8AS/4d+i9KooorsPDCiiigAooooAKKKKAP/9k=
// @downloadURL https://update.greasyfork.org/scripts/380858/interventions%20hebdomadaires%20sur%20fond%20noir.user.js
// @updateURL https://update.greasyfork.org/scripts/380858/interventions%20hebdomadaires%20sur%20fond%20noir.meta.js
// ==/UserScript==

var pre = true;

function sombre() {
    pre = false;
    $('<div class="container" style="display:-webkit-box"><p class="font-size-label">Font Size : </p>  <button id="up" style="width:18px">+</button>  <p id="font-size"></p>  <button id="down" style="width:18px">-</button></div>').insertBefore('.container:eq(1)');
    var contenu = $( "div.video-contents-description:nth-child(1)" ).text();
    $('header').css("background-color","black");
    $('body').css("background-color","black");
    $('.one-third-col').hide();
    $('.two-third-col').css("width","100%");
    $('.video-contents-full-row-content.video-contents-full-row-content-recos-toggled').css({"position":"unset"});
    $('.video-contents-full-box .video-contents-text-description').css({"background-color":"black"});
}

$('body').delegate(".two-third-col", "click", function() {
    if (pre) { sombre(); }
});

function getSize() {
  var size = $( ".video-wrapper" ).css( "font-size" );
  size = parseInt(size, 10);
  return(size);
}

$( "body" ).delegate("#up", "click", function() {
  var size = getSize();
  if ((size + 2) <= 50) {
    $( ".video-wrapper" ).css( "font-size", size + 2+'px' );
  }
});

$( "body" ).delegate("#down", "click", function() {
  var size = getSize();
  if ((size - 2) >= 8) {
    $( ".video-wrapper" ).css( "font-size", size - 2+'px' );
  }
});