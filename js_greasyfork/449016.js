// ==UserScript==
// @name         Playlists buttons V3
// @version      3.1.1
// @description  Adds Buttons to your favorite playlists, and extra functionality.
// @author       Bliwi
// @match        https://soundcloud.com/*
// @grant        none
// @run-at       document-end
// @noframes
// @license MIT
// @namespace https://greasyfork.org/en/scripts/449016-playlists-buttons-v3
// @downloadURL https://update.greasyfork.org/scripts/449016/Playlists%20buttons%20V3.user.js
// @updateURL https://update.greasyfork.org/scripts/449016/Playlists%20buttons%20V3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let smallArtglobal = '';
    let globalAccent = '';
    var root = document.documentElement;
    //Load things

    setTimeout(function welcome(){
        root.style.setProperty('--welcome', 'none');
    }, 100);
    var savedUrls = JSON.parse(localStorage.getItem('urls'));
    var savedNames = JSON.parse(localStorage.getItem('names'));
    let currentPage = location.href;
    setTimeout(playlistsLoad, 500);
    setInterval(function()
                {

        // Interval function. Put stuff you want to check every 500 miliseconds.
        if(!document.querySelector('.pinbutton')){
        if(window.location.href.indexOf("com/you/sets") != -1){
    pinToSidebar();
    }
    var parentElement = document.querySelector('.playbackSoundBadge');
    let small = parentElement.querySelector('span.sc-artwork.sc-artwork-4x');
    let localAccent = getComputedStyle(document.documentElement).getPropertyValue('--accent');
    let smallArt = small.style.backgroundImage;
    const styles = getComputedStyle(document.documentElement);
    const floating = styles.getPropertyValue('--floating-accent');
    if(smallArt != smallArtglobal && floating == 1){
        console.log('they are not equal',smallArtglobal);
        smallArtglobal = smallArt;
        let filteredUrl = smallArt.replace('url("', '').replace('")', '');

        generateAccentColor(filteredUrl, function(accentColor) {
        console.log('Accent Color:', accentColor);
        let rgbAccent = 'rgb('+accentColor+')'
        root.style.setProperty('--accent', rgbAccent);
        var meta = document.querySelector('meta[name="theme-color"]');
        setTimeout(meta.setAttribute("content", rgbAccent),30);
       });
    } else if (localAccent != globalAccent) {
    console.log('they are not equal',localAccent);
    globalAccent = localAccent;
    var meta = document.querySelector('meta[name="theme-color"]');
    meta.setAttribute("content", localAccent);
    }
        };
        //add the future lazy load fix in here
    }, 500);

    //console.log(savedNames);

    // Floating-app theme frame

        appTheme('app-theme-top','#app');
        appTheme('app-theme-background','#app');
        setTimeout(appTheme('app-theme-corner-1','.app-theme-top'), 1);
        setTimeout(appTheme('app-theme-corner-2','.app-theme-top'), 1);
        setTimeout(appTheme('app-theme-corner-3','.app-theme-top'), 1);
        setTimeout(appTheme('app-theme-corner-4','.app-theme-top'), 1);
        setTimeout(appTheme('app-theme-shadow','.app-theme-top'), 1);
        setTimeout(appTheme('app-theme-bottom','.app-theme-top'), 1);
        setTimeout(appTheme('app-theme-left','.app-theme-top'), 1);
        setTimeout(appTheme('app-theme-right','.app-theme-top'), 1);
            function appTheme(a,b){
            let thing = document.createElement('a');
            let parent = document.querySelector(b);
            thing.className = a;
            parent.insertBefore(thing, parent.children[2]);
    };

    //add new playlist button
    function pinToSidebar() {
        //Pin button

        let button = document.createElement('a');
        let header = document.querySelector('.collectionSection__flexFill');
        button.className = 'pinbutton';
        button.innerHTML = '📌';
        button.title = 'Pin all the playlists';
        header.insertBefore(button, header.children[2]);


        //Clear

        setTimeout(function clear(){
        let button = document.createElement('a');
        let header = document.querySelector('.collectionSection__flexFill');
        button.className = 'pinbutton';
        button.innerHTML = '🗑️';
        button.title = 'Remove all the playlists from the sidebar';
        header.insertBefore(button, header.children[2]);
        button.onclick = function (){
        if (confirm("Are you sure you want to remove all the pinned playlists?")){
            var savedUrls = [];
            var savedNames = [];
            localStorage.setItem('names', JSON.stringify(savedNames));
            localStorage.setItem('urls', JSON.stringify(savedUrls));
            location.reload();}
        }
        },10)

        //Plus Button

        setTimeout(
        function plus() {
        let button = document.createElement('a');
        let header = document.querySelector('.collectionSection__flexFill');
        button.className = 'pinbutton';
        button.innerHTML = '➕';
        button.title = 'Add a single playlist to the sidebar.';
        header.insertBefore(button, header.children[2]);
        button.onclick = function (){
            var newName = prompt('Enter the name of the playlist:');
            if (newName) {
                var newURL = prompt('Enter the URL for the playlist:');
                if (newURL) {

                var modifiedUrl = newURL.replace('https://soundcloud.com', '').replace('http://soundcloud.com', '');
                savedUrls.push(modifiedUrl);
                savedNames.push(newName);
                console.log(savedNames);
                console.log(savedUrls);

                localStorage.setItem('names', JSON.stringify(savedNames));
                localStorage.setItem('urls', JSON.stringify(savedUrls));
                    if (confirm("Done pinning,Soundfy will now reload to take effect.")){location.reload();}
                }
            }
        }
        },
        10);

         //Extract the playlists
        button.onclick = function (){
            setInterval(window.scrollTo(0,document.body.scrollHeight - 1200), 10);
            button.innerHTML = 'Extracting the playlists';
            setTimeout(function done(){
                if (confirm("Done pinning,Soundfy will now reload to take effect.")){location.reload();}
        },1000)
            // Query the elements on the page
            var elements = document.querySelectorAll('a.sc-link-primary.sc-link-dark.sc-type-light.sc-text-secondary.playableTile__mainHeading.playableTile__heading.audibleTile__audibleHeading.sc-truncate.sc-font-light.sc-text-h4');
            // Store the URLs in variables
            //
            var urls = [];
            var names = [];
            for (var i = 0; i < elements.length; i++) {
                let button = document.createElement('a');
                let header = document.querySelector('.collectionSection__top');
                header.style.display = "block !important";
                button.innerHTML = modnames3;
                header.insertBefore(button, header.children[2]);
                button.className = 'playlist-name';
                var url = elements[i].href;
                var modifiedUrl = url.replace('https://soundcloud.com', '').replace('http://soundcloud.com', '');
                var modnames = url.replace('https://soundcloud.com/', '').replace('http://soundcloud.com/', '');
                var modnames2 = modnames.replace('-', ' ').replace('-', ' ');
                var modnames3 = modnames2.replace('/sets/', ' - ').replace('/sets/', ' - ');
                names.push(modnames3);
                urls.push(modifiedUrl);
            }
            console.log(urls);
            console.log(names);
            //Save the Urls and names to the local storage
            //
            localStorage.setItem('urls', JSON.stringify(urls));
            localStorage.setItem('names', JSON.stringify(names));

        };

    }

        //functions
    //Load the playlists
    function playlistsLoad() {
        let container = document.createElement('div');
        let header = document.querySelector('.header');
        container.className = 'container';
        container.id = 'iframe-container';
        header.insertBefore(container, header.children[2]);
        for (var i = 0; i < savedUrls.length; i++) {
        var url = savedUrls[i];
        var name = savedNames[i];
        insertButton(name,url);
    }
    }
    //Insert the buttons
    function insertButton(playlistname,playlistlink) {
        let playlist = document.createElement('a');
        let header = document.querySelector('.container');
        const i = savedNames.indexOf(playlistname);
        playlist.id = i;
        playlist.innerHTML = playlistname;
        playlist.className = 'playlist-button';
        playlist.href = playlistlink;

        //Delete or rename
        playlist.ondblclick = function() {
            var newName = prompt('Enter a new name(del to delete):');
            if (newName === 'del') {
                //delete savedNames[i];
                savedNames.splice(i, 1);
                savedUrls.splice(i, 1);
                playlist.className = '';
                playlist.innerHTML = '';
                playlist.href = '';
                console.log(savedNames);
                localStorage.setItem('names', JSON.stringify(savedNames));
                localStorage.setItem('urls', JSON.stringify(savedUrls));
            } else if (newName) {
                // Rename
                playlist.innerHTML = newName;
                savedNames[i] = newName;
                console.log(savedNames);
                localStorage.setItem('names', JSON.stringify(savedNames));
            }
        }
        if (header) {
        header.insertBefore(playlist, header.children[2]);

    } else {setTimeout(playlistsLoad, 1000);}
    }

    //Generate accent color

    function generateAccentColor(imageUrl, callback) {
  var img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function() {
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;

    var colorCounts = {};
    var maxCount = 0;
    var dominantColor;

    // Loop through the image pixels and count the occurrences of each color
    for (var i = 0; i < data.length; i += 4) {
      var r = data[i];
      var g = data[i + 1];
      var b = data[i + 2];

      var rgb = r + ',' + g + ',' + b;

      if (colorCounts[rgb]) {
        colorCounts[rgb]++;
      } else {
        colorCounts[rgb] = 1;
      }

      if (colorCounts[rgb] > maxCount) {
        maxCount = colorCounts[rgb];
        dominantColor = rgb;
      }
    }

    // Return the dominant color
    callback(dominantColor);
  };

  // Load the image
  img.src = imageUrl;
}

})();