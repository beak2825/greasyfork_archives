// ==UserScript==
// @name        GC World Challenge Ping Generator
// @namespace   grundos.cafe
// @version     1.1.8
// @description Adds a button to the World Challenges page to copy gameplay pings for The Game Controller discord
// @author      Sphere
// @match       https://www.grundos.cafe/games/challenges/
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/503483/GC%20World%20Challenge%20Ping%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/503483/GC%20World%20Challenge%20Ping%20Generator.meta.js
// ==/UserScript==

const roleIds = {
    'Advert Attack': '1222664883712032846',
    'Attack of the Revenge': '1222664883712032845',
    'Carnival of Terror': '1222664883712032844',
    'Destruct-O-Match II': '1222664883712032843',
    'Dubloon Disaster': '1222664883712032842',
    'Escape from Meridell Castle': '1222664883712032841',
    'Extreme Herder': '1222664883712032840',
    'Faerie Bubbles': '1222664883712032839',
    'Faerie Cloud Racers': '1222664883712032838',
    'GC Staff Smasher': '1233071344216703217',
    'Hannah and the Pirate Caves': '1335290116863823966',
    'Hasee Bounce': '1272641969402941590',
    'Ice Cream Machine': '1222664883691327587',
    'Igloo Garage Sale - The Game': '1222664883691327586',
    'Jelly Blobs of Doom': '1222664883691327585',
    'Jubble Bubble': '1387084598449541201',
    'Kass Basher': '1350462600193769544',
    'Korbats Lab': '1222664883691327584',
    'Magma Blaster': '1403040667558608956',
    'Meepit Juice Break': '1222664883691327583',
    'Meerca Chase II': '1222664883691327582',
    'Pterattack': '1292518364966682684',
    'Revel Roundup': '1222664883691327581',
    'Snowmuncher': '1456672247820320924',
    'Splat-A-Sloth': '1222664883691327580',
    "Sutek's Tomb": '1222664883691327579',
    'Swarm - The Bugs Strike Back': '1373697126588219402',
    'The Buzzer Game': '1237583967302058004',
    'Turmac Roll': '1350582444750802994',
    'Ultimate Bullseye': '1222664883691327578',
    'Usuki Frenzy': '1222664883682934833',
    'Volcano Run': '1222664883682934832',
    'Web of Vernax': '1234872115333828628',
    'Zurroball': '1222664883682934831'
};

(() => {

    const links = document.querySelector('#other_links');
    if (!links) {
        // no active round
        return;
    }

    // thanks to daylight savings there can be 3 to 5 hours between rounds.
    // go back one hour at a time to find the last round
    let date = new Date();
    let dateString = '';
    const msPerHour = 1000 * 60 * 60;
    while (true) {
        dateString = date.toLocaleString('en-US', {
            timeZone: 'America/Los_Angeles',
            month: 'long',
            day: 'numeric',
            hour: 'numeric'
        }).replace(' at ', ', ');
        const hour = parseInt(dateString.split(' ')[2]);
        if (hour % 4 === 0) {
            break;
        }
        date = new Date(date.getTime() - msPerHour);
    }

    let copyText = dateString;

    const gameDivs = links.querySelectorAll(':scope > div > div');
    gameDivs.forEach(div => {
        const url = div.querySelector('a').href;
        const name = div.textContent.trim().split('\n')[0];
        const ping = roleIds[name] ? `<@&${roleIds[name]}>` : name;
        copyText += `\n\n${ping}\n<${url}>`;
    });

    const input = document.createElement('input');
    input.type = 'button';
    input.classList.add('form-control');
    input.value = 'Copy TGC Discord Pings';
    input.addEventListener('click', () => {
        navigator.clipboard.writeText(copyText);
    });

    document.querySelector('.button-group').appendChild(input);

})();
