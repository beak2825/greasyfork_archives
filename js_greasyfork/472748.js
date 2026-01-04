// ==UserScript==
// @name            What's New for Web
// @description     Adds Spotify's What's New feature to the web version
// @version         1.0.0
// @author          j-weatherwax
// @homepageURL     https://github.com/j-weatherwax
// @match           https://open.spotify.com/*
// @license         MIT
// @namespace       https://github.com/j-weatherwax/whats-new-for-web
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/472748/What%27s%20New%20for%20Web.user.js
// @updateURL https://update.greasyfork.org/scripts/472748/What%27s%20New%20for%20Web.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var mainCss = `
/**** What's New Button ****/
#sidebar { z-index: 9999; position: fixed; inset: 0px 0px auto auto; margin: 0px; transform: translate(-40px, 64px); top: 0; right: 0; padding: 20px; width: 400px; max-height: 70%; border: 5px solid black; background-color: #121212; overflow: auto; }
`;

    var buttonHtml = `
<button class="Button-sc-1dqy6lx-0 fXEXug encore-over-media-set SFgYidQmrqrFEVh65Zrg" data-testid="user-widget-link" aria-label="What's New" data-encore-id="buttonTertiary" aria-expanded="false">
  <figure class="tp8rO9vtqBGPLOhwcdYv" title="What's New" style="width: 32px; height: 32px;">
    <div class="" style="width: 32px; height: 32px; inset-inline-start: 0px;">
      <div class="KdxlBanhDJjzmHfqhP0X m95Ymx847hCaxHjmyXKX" data-testid="placeholder-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bell" viewBox="0 0 16 16">
          <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
        </svg>
      </div>
    </div>
  </figure>
</button>
`;

    // -------------------------- OATH ------------------------------- //

    // Cryptographic helper functions
    function generateRandomString(length) {
        let text = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    async function generateCodeChallenge(codeVerifier) {
        function base64encode(string) {
            return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');
        }

        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        const digest = await window.crypto.subtle.digest('SHA-256', data);

        return base64encode(digest);
    }

    // ClientID can be public
    const clientId = 'cfeacce0918d4802964bffedd31b22b8';
    const redirectUri = 'https://open.spotify.com/';

    //Finish this later
    async function APIKeyInvalid(accessToken){
        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        });

        const data = await response.json();
        //console.log(data)

        if (response.status == 401) {
            return true;
        }
        return false;
    }

    //If token is valid, return token. If it is not valid, request a new token and return that
    async function getAndValidateAccessToken(){
        const token = localStorage.getItem("access_token");
        if (APIKeyInvalid(token)){
            await requestNewAccessToken();
        }
        return localStorage.getItem("access_token");
    }

    async function requestNewAccessToken(){
        await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            body: new URLSearchParams({
                client_id: clientId,
                grant_type: 'refresh_token',
                refresh_token:localStorage.getItem("refresh_token"),
            }),
        }).then(response=>{
            return response.json();
        })
            .then(data=>{
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
        })
    }

    if (localStorage.getItem('access_token') == null) {
        // get the "code" from the URL.
        // After allowing access, the URL will contain a code stored in a URL parameter called "code"
        // Using this code, we can send a POST request to get our access token.
        const urlParams = new URLSearchParams(window.location.search);
        let code = urlParams.get('code');

        // 2 cases
        // case 1: User has just pressed "allow access", in this case the URL will contain the "code" parameter,
        // and we need to use it to fetch the access token.
        // case 2: User has previously granted access and we already generated and stored the access token in local storage.
        // In this case, we don't need to send a request to get the access token, instead we just read the token from local storage.
        if(code != null){
            let codeVerif = localStorage.getItem('code_verifier');

            let body = new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirectUri,
                client_id: clientId,
                code_verifier: codeVerif
            });

            const response = fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: body
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('HTTP status ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('refresh_token', data.refresh_token);
                //console.log(data)
                // If user has just authenticated, move on to main logic
                Main();
            })
            .catch(error => {
                console.error('Error:', error);
            });

        } else {
            // generate codeVerifier
            let codeVerifier = generateRandomString(128);

            // Generate CodeChallenge value, and open the spotify popup
            generateCodeChallenge(codeVerifier).then(codeChallenge => {
                let state = generateRandomString(16);
                let scope = 'user-read-private user-read-email user-follow-read';

                localStorage.setItem('code_verifier', codeVerifier);

                let args = new URLSearchParams({
                    response_type: 'code',
                    client_id: clientId,
                    scope: scope,
                    redirect_uri: redirectUri,
                    state: state,
                    code_challenge_method: 'S256',
                    code_challenge: codeChallenge
                });

                window.location = 'https://accounts.spotify.com/authorize?' + args;
            });
        }
    } else {
        //If authenticated sometime in the past, move on to main logic function
        localStorage.removeItem('market');
        Main();
    }

    // function to get user's info
    async function getProfile() {
        let accessToken = await getAndValidateAccessToken();
        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        });

        const data = await response.json();
        localStorage.setItem('market', data.country);
    }

    // -------------------------- Logic ------------------------------- //
    // Fetch user's followed artists
    async function getFollowedArtists() {
        let accessToken = await getAndValidateAccessToken();

        const response = await fetch('https://api.spotify.com/v1/me/following?type=artist', {
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP status ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
        });
        return response;
    }

    // Fetch artist's released from the last two months
    const fetchArtistReleases = async (artistId) => {
        let accessToken = localStorage.getItem('access_token');
        let market = localStorage.getItem('market');

        const date = new Date();
        const twoMonthsAgo = new Date().setMonth(date.getMonth() - 2);

        const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single&market=${market}&limit=50`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const data = await response.json();
        const albums = data.items.filter(album => Date.parse(album.release_date) >= twoMonthsAgo);
        return albums;
    };

    const fetchAlbums = async () => {
        const followedArtists = await getFollowedArtists();

        const newAlbums = [];

        let artistList = Object.values(followedArtists)[0];
        for (const i in artistList.items) {
            const artist = artistList.items[i];
            const albums = await fetchArtistReleases(artist.id);
            newAlbums.push(...albums);
        }

        return newAlbums;
    };

    function setDate(album){
        const releaseDate = document.createElement('p');
        releaseDate.classList.add('Type__TypeElement-sc-goli3j-0', 'ieTwfQ');
        releaseDate.setAttribute("data-encore-id", "type");

        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        const today = new Date();
        const release = new Date(album.release_date);
        const difference = Math.floor((today - release)/ (1000 * 3600 * 24));
        if (difference < 1){
            releaseDate.innerHTML = "Today";
        } else if (difference == 1) {
            releaseDate.innerHTML = "1 day ago";
        } else if (difference <= 7) {
            releaseDate.innerHTML = `${difference} days ago`;
        } else {
            releaseDate.innerHTML = months[release.getMonth()] + ' ' + release.getDate();
        }
        return releaseDate;
    }

    function setArtists(album){
        const tempDiv = document.createElement('span');
        let counter = 1;
        for (const idx in album.artists){
            const artist = album.artists[idx];
            const artistInfo = document.createElement('a');
            artistInfo.setAttribute("draggable", "true");
            artistInfo.setAttribute("dir", "auto");
            artistInfo.setAttribute("href", artist.external_urls.spotify);
            artistInfo.setAttribute("tabindex", "-1");
            artistInfo.textContent = artist.name;
            tempDiv.appendChild(artistInfo)
            if (counter != album.artists.length){
                const comma = document.createElement('a');
                comma.style.textDecoration = "none";
                comma.innerHTML = ", ";
                tempDiv.appendChild(comma);
            }
            counter += 1;
        }
        return tempDiv;
    }

    function render(data) {
       return fetchAlbums()
            .then(albums => {
            //sort the fetched releases by recency
            albums.sort((a,b) => (Date.parse(a.release_date) < Date.parse(b.release_date)) ? 1 : -1)

            const sidebarContainer = document.createElement('div')

            //make the html for each release to insert into the sidebar
            const albumDivs = albums.map(album => {
                const albumDiv = document.createElement('div');
                var albumDivContainer = `
<div role="row sidebar-row" aria-rowindex="2" aria-selected="false">
    <div data-testid="tracklist-row" class="h4HgbO_Uu1JYg5UGANeQ wTUruPetkKdWAR1dd6w4" draggable="true" role="presentation" style="height: 72px;">
        <div class="gvLrgQXBFVW6m9MscfFA" role="gridcell" aria-colindex="2" tabindex="-1">
            <div class="iCQtmPqY0QvkumAOuCjr sidebar-info-row">
                <div class="CmkY1Ag0tJDfnFXbGgju n1EzbHQahSKztskTUAm3 album-art-div" aria-hidden="true" style="width: 100%; float: left; height: 64px;">
                </div>
                <div class="release-info" style="width: 100%; float: left; margin: 0px 16px; ">
                    <a draggable="false" class="t_yrXoUO3qGsJS4Y6iXX standalone-ellipsis-one-line" data-testid="internal-track-link" tabindex="-1"></a>
                    <span class="artistInfoList Type__TypeElement-sc-goli3j-0 bDHxRN rq2VQ5mb9SDAFWbBIUIn standalone-ellipsis-one-line" data-encore-id="type">

                    </span>
                </div>
            </div>
        </div>
    </div>
</div>`;
                albumDiv.innerHTML = albumDivContainer;
                albumDiv.style.padding = "2px 0px";

                const sidebarInfoRow = albumDiv.querySelector('.iCQtmPqY0QvkumAOuCjr')
                const albumArtDiv = albumDiv.querySelector('.album-art-div')

                const albumImage = document.createElement('img');
                albumImage.src = album.images[2].url;
                albumImage.alt = album.name;
                albumArtDiv.appendChild(albumImage);
                //albumImage.classList.add("mMx2LUixlnN_Fu45JpFB", "FqmFsMhuF4D0s35Z62Js", "Yn2Ei5QZn19gria6LjZj")

                const albumName = albumDiv.querySelector('.t_yrXoUO3qGsJS4Y6iXX')
                albumName.setAttribute("href", album.external_urls.spotify)
                albumName.textContent = album.name;

                const artistList = albumDiv.querySelector('.artistInfoList');
                artistList.appendChild(setArtists(album));

                //add release date for each album
                const release_info = albumDiv.querySelector('.release-info');
                //release_info.style.height = "64px";

                release_info.insertBefore(setDate(album), release_info.firstElementChild);
                //sidebarInfoRow.appendChild(albumName);

                return albumDiv;
            });
            albumDivs.forEach(albumDiv => {
                sidebarContainer.appendChild(albumDiv);
            })
            return sidebarContainer;
        })
            .catch(error => {
            console.error(error);
        });
    }

    // -------------------------- User interface ------------------------------- //
    function insertCss(css) {
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
        return style;
    }
    async function createUI(buttonHtml) {
        let sidebarOpen = false
        const mainContainer = document.createElement('div');
        mainContainer.innerHTML = buttonHtml;
        // Get the button element within the div
        const whatsnewBtn = mainContainer.querySelector('button');
        whatsnewBtn.setAttribute('id','whats-new-btn');
        whatsnewBtn.addEventListener('mouseover', function () {
            whatsnewBtn.setAttribute('data-context-menu-open', 'true');
        });
        whatsnewBtn.addEventListener('mouseout', function () {
            whatsnewBtn.removeAttribute('data-context-menu-open');
        });

        //Create the sidebar
        const sidebar = document.createElement('div');
        sidebar.setAttribute('id','sidebar');
        sidebar.classList.add('EZFyDnuQnx5hw78phLqP');
        sidebar.style.display = 'none';
        document.body.appendChild(sidebar);

        // Add content to the sidebar
        render()
            .then(result => {
            sidebar.appendChild(result);
        })
            .catch(error => {
            console.error('Error:', error);
        });

        function toggleSidebar() {
            if (sidebarOpen) {
                // Close the sidebar
                sidebar.style.display = 'none';
                sidebarOpen = false;
            } else {
                // Open the sidebar
                sidebar.style.display = 'block';
                sidebarOpen = true;
            }
        }

        whatsnewBtn.addEventListener('click', toggleSidebar);

        let header = document.getElementsByClassName("facDIsOQo9q7kiWc4jSg")[0];
        header.insertBefore(mainContainer, header.lastElementChild);
    };

    // -------------------------- Main ------------------------------- //
    //Creates button for sidebar. If header div for button does not exist yet, wait 100ms before trying again.
    function Init() {
        if (document.getElementsByClassName("facDIsOQo9q7kiWc4jSg")[0] != null){
            createUI(buttonHtml);
        } else {
            setTimeout(() => {Init();}, 100);
        }
    }

    function Main() {
        insertCss(mainCss);
        Init();
        getProfile();
    }

})();