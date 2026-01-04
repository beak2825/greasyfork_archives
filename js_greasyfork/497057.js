// ==UserScript==
// @name        DramaLINK - Episode Link Extractor
// @namespace   https://greasyfork.org/en/users/781076-jery-js
// @version     1.2.2
// @description Stream or download your favorite drama effortlessly with DramaLINK! Unlock the power to play any drama directly in your preferred video player or download entire seasons in a single click using popular download managers like IDM. DramaLINK generates direct download links for all episodes, conveniently sorted by quality. Elevate your drama-watching experience now!
// @icon        https://www.google.com/s2/favicons?domain=asianc.to
// @author      Jery
// @license     MIT
// @match       https://asianc.*/*-episode-*
// @match       https://asianc.sh/*-episode-*
// @match       https://runasian.*/*-episode-*
// @match       https://runasian.net/*-episode-*
// @match       https://dramanice.*/*-episode-*
// @match       https://dramanice.la/*-episode-*
// @match       https://watchasia.*/*-episode-*
// @match       https://watchasia.to/*-episode-*
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/497057/DramaLINK%20-%20Episode%20Link%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/497057/DramaLINK%20-%20Episode%20Link%20Extractor.meta.js
// ==/UserScript==

class Episode {
    constructor(number, title, links, type, thumbnail) {
        this.number = number;
        this.title = title;
        this.links = links;
        this.type = type;
        this.thumbnail = thumbnail;
        this.name = `${this.title} - ${this.number}`;
    }
}

const websites = [
    {
        name: 'DramaCool',
        url: ['asianc', 'runasian', 'watchasia'],
        epLinks: 'ul.all-episode > li > a',
        epTitle: '.name > h1',
        linkElems: '.cf-download > a',
        thumbnail: '.logo > a > img',
        addStartButton: function() {
            const button = document.createElement('a');
            button.id = "DramaLINK_startBtn";
            button.style.cssText = `cursor: pointer; background-color: #145132;`;
            button.innerHTML = '<i class="icongec-dowload"></i> Generate Download Links';
            button.addEventListener('click', extractEpisodes);

            // Add the button to the page if user is logged in otherwise show placeholder
            if (document.querySelector('.cf-download')) {
                document.querySelector('.cf-download').appendChild(button);
            } else {
                const loginMessage = document.querySelector('.watch-drama > .plugins2').nextElementSibling;
                loginMessage.innerHTML = `<b style="color:#FFC119;">DramaLINK:</b> Please <a href="/login.html" title="login"><u>log in</u></a> to be able to batch download the series.`;
            }
        },
		_proxyKey: "temp_2ed7d641dd52613591687200e7f7958b",
        extractEpisodes: async function (status) {
            status.textContent = 'Starting...';
            let episodes = {};
            const episodePromises = Array.from(document.querySelectorAll(this.epLinks)).map(async epLink => { try {
                const response = await fetchHtml(epLink.href);
                const page = (new DOMParser()).parseFromString(response, 'text/html');

                // Workaround for runasian.net
                let epTitleElemText = page.querySelector(this.epTitle) 
                    ? page.querySelector(this.epTitle).textContent 
                    : page.querySelector('.block.watch-drama > h1').textContent;
                
                const [, epTitle, epNumber] = epTitleElemText.match(/(.+?) Episode (\d+)(?:.+)$/);
                const episodeTitle = `${epNumber.padStart(3, '0')} - ${epTitle}`;
                const thumbnail = page.querySelector(this.thumbnail).src;
                const linkElems = [...page.querySelectorAll(this.linkElems)];
                status.textContent = `Extracting ${epTitle} - ${epNumber.padStart(3, '0')}...`;
                let links = {};
                for (const elem of linkElems) {
                    try {
                        const html = await (await fetch('https://proxy.cors.sh/'+elem.href, {headers: {"x-cors-api-key": this._proxyKey}} )).text();
                        const directLink = html.match(/window\.location="([^"]+)";/)[1];
                        links[elem.textContent.trim()] = directLink;
                    } catch (error) {
                        console.error(`Failed to fetch ${elem.href}: ${error}`);
                        status.textContent += `Failed to fetch ${elem.href}: ${error}`;
                    }
                }
                status.textContent = `Parsed ${epTitle} - ${epNumber.padStart(3, '0')}...`;

                episodes[episodeTitle] = new Episode(epNumber.padStart(3, '0'), epTitle, links, 'mp4', thumbnail);
            } catch (error) {alert(error)}} );
            await Promise.all(episodePromises);
            return episodes;
        }
    },
    {
        name: 'DramaNice',
        url: ['dramanice'],
        epLinks: 'ul.list_episode > li > a',
        epTitle: 'h1.label_coming',
        linkElems: '.cf-download > a',
        thumbnail: 'img',
        addStartButton: function() {
            const button = document.createElement('a');
            button.id = "DramaLINK_startBtn";
            button.style.cssText = `cursor: pointer; background-color: #145132;`;
            button.innerHTML = '<i class="icongec-dowload"></i> Generate Download Links';
            button.addEventListener('click', extractEpisodes);

            // Add the button to the page if user is logged in otherwise show placeholder
            if (document.querySelector('.cf-download')) {
                document.querySelector('.cf-download').appendChild(button);
            } else {
                const loginMessage = document.querySelector('.drama_video_body > .clr').nextElementSibling;
                loginMessage.innerHTML = `<b style="color:#FFC119;">DramaLINK:</b> Please <a href="/login.html" title="login"><u>log in</u></a> to be able to batch download the series.`;
            }
        },
		_proxyKey: "temp_2ed7d641dd52613591687200e7f7958b",
        extractEpisodes: async function (status) {
            status.textContent = 'Starting...';
            let episodes = {};
            const episodePromises = Array.from(document.querySelectorAll(this.epLinks)).map(async epLink => { try {
                const response = await fetchHtml(epLink.href);
                const page = (new DOMParser()).parseFromString(response, 'text/html');
                
                const [, epTitle, epNumber] = page.querySelector(this.epTitle).textContent.match(/(.+?) Episode (\d+)(?:.+)$/);
                const episodeTitle = `${epNumber.padStart(3, '0')} - ${epTitle}`;
                const thumbnail = page.querySelector(this.thumbnail).src;
                const linkElems = [...page.querySelectorAll(this.linkElems)]
                // const links = linkElems.reduce((obj, elem) => ({ ...obj, [elem.textContent.trim()]: elem.href }), {});
                status.textContent = `Extracting ${epTitle} - ${epNumber.padStart(3, '0')}...`;
                let links = {};
                for (const elem of linkElems) {
                    try {
                        const html = await (await fetch('https://proxy.cors.sh/'+elem.href, {headers: {"x-cors-api-key": this._proxyKey}} )).text();
                        const directLink = html.match(/window\.location="([^"]+)";/)[1];
                        links[elem.textContent.trim()] = directLink;
                    } catch (error) {
                        console.error(`Failed to fetch ${elem.href}: ${error}`);
                        status.textContent += `Failed to fetch ${elem.href}: ${error}`;
                    }
                }
                status.textContent = `Parsed ${epTitle} - ${epNumber.padStart(3, '0')}...`;

                episodes[episodeTitle] = new Episode(epNumber.padStart(3, '0'), epTitle, links, 'mp4', thumbnail);
            } catch (error) {alert(error)}} );
            await Promise.all(episodePromises);
            return episodes;
        }
    }
];

async function fetchHtml(url) {
    const response = await fetch(url);
    if (response.ok) {
        return response.text();
    } else {
        alert(`Failed to fetch HTML for ${url}`);
        throw new Error(`Failed to fetch HTML for ${url}`);
    }
}

GM_registerMenuCommand('Extract Episodes', extractEpisodes);

// initialize
console.log('Initializing DramaLINK...');
const site = websites.find(site => site.url.some(url => window.location.href.includes(url)));

// attach button to page
site.addStartButton();

// append site specific css styles
document.body.style.cssText += (site.styles || '');

// This function creates an overlay on the page and displays a list of episodes extracted from a website.
// The function is triggered by a user command registered with `GM_registerMenuCommand`.
// The episode list is generated by calling the `extractEpisodes` method of a website object that matches the current URL.
async function extractEpisodes() {
    // Restore last overlay if it exists
    if (document.getElementById("DramaLINK_Overlay")) {
        document.getElementById("DramaLINK_Overlay").style.display = "flex";
        return;
    }

    // Create an overlay to cover the page
    const overlayDiv = document.createElement("div");
    overlayDiv.id = "DramaLINK_Overlay";
    overlayDiv.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.6); z-index: 999; display: flex; align-items: center; justify-content: center;";
    document.body.appendChild(overlayDiv);
    overlayDiv.onclick = event => linksContainer.contains(event.target) ? null : overlayDiv.style.display = "none";

    // Create a form to display the Episodes list
    const linksContainer = document.createElement('div');
    linksContainer.id = "DramaLINK_LinksContainer";
    linksContainer.style.cssText = "position:relative; height:70%; width:60%; color:cyan; background-color:#0b0b0b; overflow:auto; border: groove rgb(75, 81, 84); border-radius: 10px; padding: 10px 5px; resize: both; scrollbar-width: thin; scrollbar-color: cyan transparent; display: flex; justify-content: center; align-items: center;";
    overlayDiv.appendChild(linksContainer);

    // Create a progress bar to display the progress of the episode extraction process
    const statusBar = document.createElement('span');
    statusBar.id = "DramaLINK_StatusBar";
    statusBar.textContent = "Extracting Links..."
    statusBar.style.cssText = "background-color: #0b0b0b; color: cyan;";
    linksContainer.appendChild(statusBar);

    // Extract episodes
    const episodes = await site.extractEpisodes(statusBar);

    console.log(episodes);

    // Get all links into format - {[qual1]:[ep1,2,3,4], [qual2]:[ep1,2,3,4], ...}
    const sortedEpisodes = Object.values(episodes).sort((a, b) => a.number - b.number);
    const sortedLinks = sortedEpisodes.reduce((acc, episode) => {
        for (let quality in episode.links) (acc[quality] ??= []).push(episode);
        return acc;
    }, {});
    console.log('sorted', sortedLinks);


    const qualityLinkLists = Object.entries(sortedLinks).map(([quality, episode]) => {
        const listOfLinks = episode.map(ep => {
            return `<li id="EpisodeLink" style="list-style-type: none;">
                      <span style="user-select:none; color:cyan;">
                      Ep ${ep.number.replace(/^0+/, '')}: </span>
                      <a title="${ep.title.replace(/[<>:"/\\|?*]/g, '')}" download="${encodeURI(ep.name)}.${ep.type}" href="${ep.links[quality]}" style="color:#FFC119;">
                      ${ep.links[quality]}</a>
                  </li>`;
        }).join("");

        return `<ol style="white-space: nowrap;">
                      <span id="Quality" style="display:flex; justify-content:center; align-items:center;">
                        <b style="color:#58FFA9; font-size:25px; cursor:pointer; user-select:none;">
                          -------------------${quality}-------------------\n
                        </b>
                      </span>
                      ${listOfLinks}
                    </ol><br><br>`;
    });

    // Update the linksContainer with the finally generated links under each quality option header
    linksContainer.style.cssText = "position:relative; height:70%; width:60%; color:cyan; background-color:#0b0b0b; overflow:auto; border: groove rgb(75, 81, 84); border-radius: 10px; padding: 10px 5px; resize: both; scrollbar-width: thin; scrollbar-color: cyan transparent;";
    linksContainer.innerHTML = qualityLinkLists.join("");

    // Add hover event listeners to update link text on hover
    linksContainer.querySelectorAll('#EpisodeLink').forEach(element => {
        const episode = element.querySelector('a');
        const link = episode.href;
        const name = decodeURIComponent(episode.download);
        element.addEventListener('mouseenter', () => window.getSelection().isCollapsed && (episode.textContent = name));
        element.addEventListener('mouseleave', () => episode.textContent = decodeURIComponent(link));
    });

    // Add hover event listeners to quality headers to transform them into speed dials
    document.querySelectorAll('#Quality b').forEach(header => {
        const style = `style="background-color: #00A651; padding: 5px 10px; border: none; border-radius: 5px; cursor: pointer; user-select: none;"`
        const sdHTML = `
            <div style="display: flex; justify-content: center; padding: 10px;">
                <ul style="list-style: none; display: flex; gap: 10px;">
                    <button type="button" ${style} id="DramaLINK_selectLinks">Select</button>
                    <button type="button" ${style} id="DramaLINK_copyLinks">Copy</button>
                    <button type="button" ${style} id="DramaLINK_exportLinks">Export</button>
                    <button type="button" ${style} id="DramaLINK_playLinks">Play with VLC</button>
                </ul>
            </div>`

        let headerHTML = header.innerHTML;
        header.parentElement.addEventListener('mouseenter', () => (header.innerHTML = sdHTML, attachBtnClickListeners()));
        header.parentElement.addEventListener('mouseleave', () => (header.innerHTML = headerHTML));
    });

    // Attach click listeners to the speed dial buttons
    function attachBtnClickListeners() {
        const buttonIds = [
            { id: 'DramaLINK_selectLinks', handler: onSelectBtnPressed },
            { id: 'DramaLINK_copyLinks', handler: onCopyBtnClicked },
            { id: 'DramaLINK_exportLinks', handler: onExportBtnClicked },
            { id: 'DramaLINK_playLinks', handler: onPlayBtnClicked }
        ];

        buttonIds.forEach(({ id, handler }) => {
            const button = document.querySelector(`#${id}`);
            button.addEventListener('click', () => handler(button));
        });

        // Select Button click event handler
        function onSelectBtnPressed(it) {
            const links = it.closest('ol').querySelectorAll('li');
            const range = new Range();
            range.selectNodeContents(links[0]);
            range.setEndAfter(links[links.length - 1]);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            it.textContent = 'Selected!!';
            setTimeout(() => { it.textContent = 'Select'; }, 1000);
        }

        // copySelectedLinks click event handler
        function onCopyBtnClicked(it) {
            const links = it.closest('ol').querySelectorAll('li');
            const string = [...links].map(link => link.children[1].href).join('\n');
            navigator.clipboard.writeText(string);
            it.textContent = 'Copied!!';
            setTimeout(() => { it.textContent = 'Copy'; }, 1000);
        }

        // exportToPlaylist click event handler
        function onExportBtnClicked(it) {
            // Export all links under the quality header into a playlist file
            const links = it.closest('ol').querySelectorAll('li');
            let string = '#EXTM3U\n';
            links.forEach(link => {
                const episode = decodeURIComponent(link.children[1].download);
                string += `#EXTINF:-1,${episode}\n` + link.children[1].href + '\n';
            });
            const fileName = links[0].querySelector('a').title + '.m3u';
            const file = new Blob([string], { type: 'application/vnd.apple.mpegurl' });
            const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(file), download: fileName });
            a.click();
            it.textContent = 'Exported!!';
            setTimeout(() => { it.textContent = 'Export'; }, 1000);
        }

        // PlayWithVLC click event handler
        function onPlayBtnClicked(it) {
            // Export all links under the quality header into a playlist file
            const links = it.closest('ol').querySelectorAll('li');
            let string = '#EXTM3U\n';
            links.forEach(link => {
                const episode = decodeURIComponent(link.children[1].download);
                string += `#EXTINF:-1,${episode}\n` + link.children[1].href + '\n';
            });
            const file = new Blob([string], { type: 'application/vnd.apple.mpegurl' });
            const fileUrl = URL.createObjectURL(file);
            window.open(fileUrl);
            it.textContent = 'Launching VLC!!';
            setTimeout(() => { it.textContent = 'Play with VLC'; }, 2000);
            alert("Due to browser limitations, there is a high possibility that this feature may not work correctly.\nIf the video does not automatically play, please utilize the export button and manually open the playlist file manually.");
        }

        return {
            onSelectBtnPressed,
            onCopyBtnClicked,
            onExportBtnClicked,
            onPlayBtnClicked
        };
    }
}