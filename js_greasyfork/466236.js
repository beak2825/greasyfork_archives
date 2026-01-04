

    // ==UserScript==
    // @name        Letterboxd Searchbar
    // @description Adds a search bar that allows quick and easy in-site searches to trackers and other websites, updated with additional entries and working links
    // @author      ctyd
    // @namespace   ctyd
    // @locale      English
    // @include     https://letterboxd.com/film/*
    // @version     1.0
    // @grant       none
// @downloadURL https://update.greasyfork.org/scripts/466236/Letterboxd%20Searchbar.user.js
// @updateURL https://update.greasyfork.org/scripts/466236/Letterboxd%20Searchbar.meta.js
    // ==/UserScript==

    if( document.readyState == "complete" || document.readyState == "loaded" || document.readyState == "interactive" ) {
        main();
    } else {
        document.addEventListener('DOMContentLoaded', main);
    }


    function main() {
        // Get title and year from an already existing array (filmData) in letterboxd
        var filmTitle = filmData['name']
        filmTitle = filmTitle.replace(/[\/\\#,+()$~%.":*?<>{}!]/g, ''); // remove chars
        filmTitle = filmTitle.replace(/&/g, '%26')
        var filmYear = filmData['releaseYear']
        // Also maybe get the original title if present
        // Don't know how to implement it yet though
            // var originalTitle = document.querySelector('[itemprop='datePublished']')
            // originalTitle = originalTitle.nextSibling.nextSibling.innerText.replace(/[‘’]/g, '');

        console.log(filmTitle, '(' + filmYear + ')')

        // Look for the IMDb ID in the button
        var imdbElement =  document.querySelector('[data-track-action="IMDb"]')
        if (imdbElement != 'undefined' && imdbElement != null) {
            // Get imdb id from the button
            buttons = document.getElementsByClassName('micro-button track-event');
            imdbBtn = buttons[0].href.match(/tt(\d{7})/);
            var imdbId = imdbBtn[1]
            console.log('IMDb ID:', imdbId)
        } else {ad
            var imdbId = filmTitle
            console.log('Film has no IMDb page, using filmTitle')
        }

        // Function used to build icons
        function createIcon(cont, title, href, icon) {
            var a = document.createElement('a');

            a.href = href;
            a.title = title;
            a.setAttribute('target','_blank');
            var img = document.createElement('img');
            img.src = icon;
            img.setAttribute('height','16');
            img.setAttribute('witdh','16');

            a.appendChild(img);
            var cell = cont.insertCell(-1);
            cell.appendChild(a);
            console.log(title,'icon built succesfully.')
        }

        // Function to apply CSS to each icon to make it look nicer
        function applyCSS() {
            iconElt = document.querySelectorAll('#tor-icons');
            iconElt[0].style = 'display: table; margin: 0 auto;'
            iconElt[1].style = 'display: table; margin: 0 auto;'

            iconRow = iconElt[0].childNodes[0].childNodes
            for (i = 0, j = iconRow.length; i < j; i++) {
                iconRow[i].style = 'padding: 2px 4px 0px 4px;'
                iconRow[i].id = 'tor-icon';
            }
            iconRow2 = iconElt[1].childNodes[0].childNodes
            for (i = 0, j = iconRow2.length; i < j; i++) {
                iconRow2[i].style = 'padding: 2px 4px 0px 4px;'
                iconRow2[i].id = 'tor-icon';
            }
            console.log('CSS applied.')
        }

        // Create a new element for the tor icons to fit in
        li = document.querySelector('.js-actions-panel');
        tab = li.insertBefore(document.createElement('li'), li.lastChild);
        div = tab.appendChild(document.createElement('div'));
            div.id = 'tor-icons'
        tr = div.appendChild(document.createElement('tr'));

        // TorrentLeech
        img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA'+
        'AXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHUSURBVDhP'+
        'YxRR56v+/5+hjpGRgc3DyYvBydaZYd2WNQwnzh5ngANGBoa/Vr8Y/kv9Y2A6xcrA9JCZAajnF1BP'+
        'E6OIGt9PoAI2ZUUVhmNbTzMwMTExfPv+jUHbRpXhy9cvYP1/zX8z/In7DmYz/AAqruRhYPwFNBVo'+
        'CBNIM0hcXkYBrBkEuDi5GMRExMFsEPgv8g/KAgKO/wwMPEAMAkC9YB2y0nIMkUHRYDEYqMivZgjx'+
        'DYPycANQGPzfvHQHg4WxJVQIFfhEuTMclTzI8NfrJ1SEgYGtFuiFdxDXgklWFhYwBxtgYWGFsrAD'+
        'sAE55RkMO/dvBwvAwM79OxhKG4oYjp46DBXBDsAG3Hlwh2HesjlgARio66hiWLBiLpSHG0A8QgEY'+
        'TAYA0yY5AG7Auw/voCwImNg2lSE8IArCQUqIIPDXHpgvuCEWghMSiMECTAvn9l5mkBSXAkuAwH+g'+
        'q0xdDRjui9xm+J0KzQtQwHSBhYF1NhfQBcAMARL48+cPQ2ZpGsOnL5/ACkDg1+9fDN9/fGdgusTK'+
        'wHiDGSqKBEA5EpSdgYw6WKYSFRZj8PcMZFCUU2TYvncbw5GTh8BqQZ79p/+b4Z/CX6DJjAzMB1l/'+
        'MX5hagIAIZeHtL3VWm4AAAAASUVORK5CYII='

        createIcon(tr, 'TorrentLeech','https://www.torrentleech.org/torrents/browse/index/categories/8,9,11,37,43,14,12,13,47,15,29/query/'+filmTitle+' '+filmYear, img);

        // RARBG
        img = 'data:text/html;charset=utf-8;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAflJREFU'+
        'OI2F0z9oXEcQx/HPCSWY22DcvFe4CK9KoYOQIhZxE1/j5lQLUpig2lIVIhchsY1xZadIYR8uXKhX'+
        'fZUhnFOeXAVOhBDCI+XbJjHsEozRpjid/OdsMrDMsMN+5/eDnV4ppYePcQ0f4cRq/IWf8cdKp5Ry'+
        'uZTypPx//FNK+aGU8kEppbc86/gCn0/nnfFBS3hzQB9VFWwNq/PDQX0HF/Dtsr++LFKijVk/k9Nb'+
        'Mtvs6VG0v8P2sL6Ox/jtDUBAPyzypUFl60oFJkfR8XGUMJm2RsP6XODLFQCE/iI3DcPNGk42mnpt'+
        'bzwjZRmpI9QurlhYqng7ck76MqgCoQZ/vhOwpMQumc46Kee16VEnp6SLjIaVwHP88h5AInEUo8On'+
        'x2dXsD3asLM1gAdoVwApZ/PjVkpZXfc1/WDexoWo0F8+fo6D10eunXlNSdu2Yuxc2qhNDnZsDRsx'+
        'dmJs7d4/hPP4CR+uABZaMykuPgXu7Y8MmiClbDqZ2r19CCPcfAcgyynKOUsL4y9DCP8+uLcjnMLH'+
        '40MPDybwHb7G+hkgZcSO1Mk5w9+4uzloXtza35bzord3Y2wyncEdfNUrpVzF3a5Lm23bymjqStPU'+
        'v+Iz/IhvZvM5iYwqBINB8zu+752u86e47tU6n2CMmcU+3cAneHlq+wUe4dl/EuoEoSZWymEAAAAA'+
        'SUVORK5CYII=';

        createIcon(tr, 'RARBG','https://rarbg.to/torrents.php?search=tt'+imdbId+'&order=size&by=DESC', img);

        // YTS
        img = 'data:text/html;charset=utf-8;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAACXBIWXMAAAsTAAALEwEAmpwYAAAB'+
        'mklEQVR42pVSy24TQRCs6pl9GYxJtI5FFBksgrIKQiBxsTgg8QOI7+CD+Cg4EMQRFCCvC5bijZLI'+
        'u57p5pBNDoCE6VMfurq6qotVVeF/Sm463wP9vwHdSD4kgHBpKzG4nIOHbvHTVj2pfOovjnRFDZ7E'+
        '+raf7QV/L9patEMv24EGI0HoAWVsSCzsOTQOgLiUeV80wFrifpSdZXsWtIZNNNRBHoUoy/iD1rI7'+
        'iR5pQRI6lyJJ3K3I/VzOk1yo3xI3S29P0mxAWuenWESSS3ZHLOJumuoXT5PeBvvRibpwIPbRbUyd'+
        'MXaA2Fhb67Dy4rE5SrQWAKNx2rt0+YDTt8Wz173w1WjuCsCqqh68zLam2ft357HRuAQAl8LUNNBn'+
        'MFhsCICEXdl6/KGl2u6bAuiUxRYaCCA06KYFyRAAXFmWGnB2rJNX2WDs5981NL9/0BfsV7I4MQtw'+
        'ZVkCWNR6uh83n6fjF0nWF1NA4HMWQ1l/4ootzj+bNtcabja5jKPHvtxNsjUabdlYfRhmn+LFido1'+
        'K/8abwpImMH+SMwvNoOtXGRANwcAAAAASUVORK5CYII=';

        createIcon(tr, 'YTS','https://yts.ag/browse-movies/'+filmTitle+'/all/all/0/latest', img);

        // MkvCage
        img = 'data:text/html;charset=utf-8;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAbFBMVEUAAAAUeKoUeKoUeKoUeKoU'+
        'eKoUeKoUeKoUeKoUeKoUeKoUeKoUeKoUeKoUeKoUeKoUeKoUeKoUeKoUeKoUeKoUeKoUeKoUeKoU'+
        'eKoUeKoUeKoUeKoUeKoUeKoUeKoUeKoUeKoUeKoUeKoUeKou68KCAAAAI3RSTlMAAv36BijZHNKF'+
        'USX2yLamjjMQ6+ChinxZRTwKrpmYgHJjSiJ9rqkAAACjSURBVBjTJY6HEsMgDEMFCWQ2e6db//+P'+
        'lRsO39MhIxvA4GDHoT8vFgHOmOXZJfL54oO7CaQTeziH3XNBCiCr2chJc/ImAgcTlsAq1P+QTSq6'+
        'UNN7bvbnxcTz3dLLeNpDK8FEpY7cMm7W4XWtAjBMHCXV1jXkBwiMVZStmYfnDHw1s5Q/VhYXTxR3'+
        'JXdkKYTE9ygqWzN2SMWFK4LoUA2AkDXFD6SFC3pnz1FmAAAAAElFTkSuQmCC';

        createIcon(tr, 'Blutopia','https://blutopia.xyz/torrents?perPage=50&name='+filmTitle, img);

        // Blutopia
        img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA'+
        'AXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKJSURBVDhP'+
        'bVNNSFRRFP7ue/Oe4/gzKdSIIyrtMslkSEopEIKwaBGFRBERtKhNRJS5STBXFRKh1aKINlqbNoHt'+
        'CiqisJQQqUWINE9n/MmasRl15r15t3Pvu6ND9cHjnfOdv3vOPZfhf7g6VYucfhzcPYl0jBMzBMP3'+
        'BAO7ZzyHDWwk6P5eAYcfA9wTcPk+smiST8fkj1xzAH8Dpg/BLH6GO80JyeLy9E5w3kPyQXIoEmQe'+
        '3e2bYLq/cf2FBUaluDiLBFsjYgQa66UqrJFMR/4Obqvzo6+jEtcO1aKjoQLbQwFEakrw/HwDqssN'+
        'P7V3FK7boEHXoipGQvTUGDJwYW85Hn5IYvBVDGdaQ5icW8HYTBpPPy4im3M9ZzBLg+NaSkOxwRCp'+
        'NvF1wUZzuAjnWoO4uD+Mlvoy5QGMR1NIrNA4RCmfHtVQWjdLimDQVGXiUywLUaDM781QIFisg1H/'+
        'ps5gk9GRw+A2KlfnNPSyLCnzOyj4c5xEAUq+aq9PjGQXfkNDuNzE1FJGsYiht91RZVg0QMdfc7yg'+
        '05FS1Ff4pCxQFTRxti2E6V/rwRTizS6fwPpCfbfUFGEXfQ86N8try0OItzu3oilc4hESXM5OJeDW'+
        'csbF6EwG337YFMyQWHUxPJ7C8OgifqYdycWTqkUPBQk0ff0qE2suxqwMbrxMIEVJs9R/30gUE3SF'+
        'CylbeQmwwhbwjoh5JePwozn0v00ituxgNpnB4Os4DgxMKqsAi8NnvJeS1AWuLJaBp7powy6RFhDU'+
        'ti0GAs4SnSglVIE01eyHFryFe42SLBiVQpdVg5zdR3M5RZquHhPtifYYur8HdyP51yXxb4I8xCMD'+
        'v0kJaK30LtzfM6EsBQD+AOuk7f5Ez5JjAAAAAElFTkSuQmCC'

        createIcon(tr, 'TorrentProject', 'https://torrentproject.cc/?t'+filmTitle+' '+filmYear+'&filter=2000', img);

        // Zooqle
        img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAABWUlEQVQoz42RTytEYRTGD0MJ5QtYy'+
        'AKNaea+z3nfe2fkzy3KSlmYNUlTo6woZaOklCym7IiSpITsfICxYUEWmlB2FmyGKGO4c3TvDMvJsz'+
        'mnnt85nc5D9D8prcfA5b67WfVjmLv+zLYGbCOPa+R5Mxky7ZzFE3L8gtXf6XktPEchLBixxtUmS7T'+
        'PbcApPlU4AHCHgu4kQhQejvgWOaolQsoIpwOAH1CIdRBFI/yNY9zjRmqI1KQWa7q8YdEITxOptBGk'+
        'eAeef67a02IGAiDapA7xxmd4xi7X2x18jkdc4AMe4pUz3TrLNRP2TC8TDbUkRnlGDaoVlFQisEcak'+
        'yEie1nn+d1Z01l4+qonYiW1WCYAnHB83d5igShhUWL59cHs21+V17l1JqMFwgLPbOhLH4RwiYuVDT'+
        '4SnzIHZjeRJHJbnSV9YjJmVnnarpJOTKHITrX4wnitCvzqB+tLeV5MwSPnAAAAAElFTkSuQmCC';

        createIcon(tr, '1337x','https://1337x.to/sort-search/'+filmTitle+'/size/desc/1/', img);

        // Nyaa
        img = 'data:text/html;charset=utf-8;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAMFBMVEUJN280qPs83f4Sb+UVkPt6'+
        's/S73vs/wf4ffuwBYOyt7f9A9f6Gxvp23/z1+v45jOtFQINHAAAACXBIWXMAAC4jAAAuIwF4pT92'+
        'AAABjUlEQVR42mWSMUjDQBSGD7K0kz0odFEpWbsYnkKyGAtBF0G6iFMVxCAiAbNksYNchRMKHbo4'+
        'iquLuHbRoa2U6lB3ccog+lCiUkSM7xLqoG+5e9/9/3/v4Bj7WxlIy5b6HS0zY2DGhdodHFzkxuCV'+
        'B1PDUrt9ziaoa8Eb57yWAk0CyLqT54WaXyopICT1DikKut5OgZCOs/LK9wJdKTLH5KjHcMB5QBJS'+
        'HElTOgLsyb3AVyBrghDSAiPg3C+dEqBL7AjAqPBC7/6MLC0zEhaNnueDPg4JkEWNOlfh+4/PwyJd'+
        'CxaNCg2+NNjZ0YssY9rJYz7y1avJ0D9hmg0tioDDspfv9+4fmJa+VhhlDL0bVECdN2F2GTFEJItK'+
        'pBotoqqTscWufybgkmlWCuJGAn5D4/iL2kfcSIApYBR9eej9KiJzBNOrrpuGfqwL0ZTvXgIo1ES8'+
        'tlrvuxTh4dYL0+Zo1+2gF2IYVuIc0+YJuLdqSnTXjAWW/aZdB/GJ+t1NI8eytwSqyo/dcLv+8u83'+
        '/ACtd9urh4GQJQAAAABJRU5ErkJggg==';

        createIcon(tr, 'Nyaa','https://nyaa.si/?order=false&q='+filmTitle+'&sort=4', img);

        // Create a new element for the second set
        tab = li.insertBefore(document.createElement('li'), li.lastChild);
        div = tab.appendChild(document.createElement('div'));
            div.id = 'tor-icons'
        tr = div.appendChild(document.createElement('tr'));

        // OpenSubtitles
        img = 'data:text/html;charset=utf-8;base64,AAABAAEAEBAAAAEAGABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAAAAAAEgAAABIAAAAAAAA'+
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/'+
        '//////8AAAD///////8AAAD///////8AAAD///////8AAAD///////8AAAAAAAD///////8AAAD/'+
        '//////8AAAD///////8AAAD///////8AAAD///////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACqqqr///////+qqqoAAAAAAADMzMzu7u7///////9V'+
        'VVUAAAAAAAAAAAAAAAB3d3eZmZkAAAAAAACZmZmIiIgAAACIiIgAAAAAAABERETd3d0AAAAAAAAA'+
        'AAAAAADu7u4REREAAAAAAAARERHu7u4AAABERET////////d3d0zMzMAAAAAAAAAAAAAAADd3d0i'+
        'IiIAAAAAAAARERHd3d0AAADd3d1EREQAAAAAAAAAAAAAAAAAAAAAAAAAAAB3d3eZmZkAAAAAAACq'+
        'qqp3d3cAAADMzMxEREQAAAARERHd3d0AAAAAAAAAAAAAAAAAAACZmZn///////+qqqoAAAAAAAAi'+
        'IiLu7u7////////u7u4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
        'AAAAAAD///////8AAAD///////8AAAD///////8AAAD///////8AAAD///////8AAAAAAAD/////'+
        '//8AAAD///////8AAAD///////8AAAD///////8AAAD///////8AAAAAAAAAAAAAAAAAAAAAAAAA'+
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

        createIcon(tr, 'OpenSubtitles', 'https://www.opensubtitles.org/en/search/sublanguageid-eng/imdbid-'+imdbId+'/sort-5/asc-0', img);

        // Subscene
        img = 'data:text/html;charset=utf-8;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEB'+
        'AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEB'+
        'AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAQABADASIA'+
        'AhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAACAUH/8QAHBAAAgMBAQEBAAAAAAAAAAAABAUDBgcC'+
        'CAEJ/8QAFAEBAAAAAAAAAAAAAAAAAAAACP/EABwRAAMBAQADAQAAAAAAAAAAAAIDBAEFBhMUEf/a'+
        'AAwDAQACEQMRAD8ANH5gYrhvoz1D3mu3Rgv+JcyvjrJsxb3phmSLbNsUjASUXI3uhp45HVQWWjmZ'+
        'sRK3S8dt/syocFYOYUZGGQYfcKSpUT0PdaZVPPl68tfaxCoVWjFL/eptFPqNygXQSWHlDazVoh7W'+
        'mGkzcF1NgafYe3SeQawjPZl7cIFfN8s3Hywg0Jx99YqNllpjKrMAKhdMLdq193y3Q/pQU9c0KBK3'+
        'IWB2oZF3BPJKo6eLO4/snJsMTMgeEP7pv6he0KF7D1zLXOc8aE6ruOYPRcQ61TY4UUOx7UzqJLow'+
        '/R9B4rpRqyE5nM4+jgQzHs20w40rh0w+HtZlitPW3Vh3yMfrZGyL1lhtaEk7Q3CFiQB+zON27q2Y'+
        '1A1KIcNbSn3REe8/nQl4uCiyFfQV0PaGglLLalMHAJdDDn+pAz/ntUSaiicJkDEhSOGX/9k=';

        createIcon(tr, 'Subscene', 'https://subscene.com/subtitles/title?q='+filmTitle, img);

        //Youtube
        img = 'data:text/html;charset=utf-8;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEB'+
        'AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEB'+
        'AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAQABADASIA'+
        'AhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQYJ/8QAIRAAAgMAAgICAwAAAAAAAAAAAgQDBQYB'+
        'BwgSERMAFCP/xAAVAQEBAAAAAAAAAAAAAAAAAAAICf/EACQRAAEDAQcFAAAAAAAAAAAAAAECAxIR'+
        'AAQFBhMUIgcIFSRR/9oADAMBAAIRAxEAPwDJnqHwkzHbWsyvWOLzVvsOwdPwwrVV46IagrexRqnL'+
        'ZqKE2W0q9YyVRZKAJmIgLkQi4k5kIfknsTw8yOFtb3GafJavC7Op4NZqtuW7GF+tdKHiVcmEH+S9'+
        '4jEgkAuP5MQmJxS+pif5F9YeZLPVupznYeI0dxjt1neWGKq5TronWapt2taq25V/2VXFCkJN1uCO'+
        'UoDKL7Rni+qaOMwG1/latq7K30+g0Wi1uotZJWnbS65ebsbJso+OAkcfsCOU+ePgI/eQy9IxABH0'+
        'ERE0Ku2fy0mjmPeTVezJUvUDHECgoOZVIGhiUUH21uEXrtH3ThWjpKclHAGgy2GqZjOJyXrKU5IB'+
        'LO3LUQE7jWkSoAgH/9k=';
        // Extra space is needed after youtube else it won't show, not sure why, but who cares
        createIcon(tr, 'Youtube ', 'https://www.youtube.com/results?search_query='+filmTitle+' '+filmYear, img);

        //Vimeo
        img = 'data:text/html;charset=utf-8;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC'+
        'JElEQVR42pWTzWsTQRjGfzM7iWm6btNNLKnkUIpE7aGoiMSLgoggFJQeCiIKevLkVfDo1T/AgzcP'+
        'gp6rlFqkiAdti6BeqrYl1UJLKTUfaxo3uzMesttGCEpfGAae9+t5v4QxRrgzOKHLmAY7IVH8Q1qa'+
        'QCXYyK0x9e0yvuhfNn2iznMMBfYhxvBp+CQ3ZVDj6n6dAYRgtDzPOWkZcp2KQxZqIouTEMhO/FoW'+
        '516e3IleUjEWJHAVCk3YBi46pB8PUXAk6kofS9dX8AFeHGGoZJMGuDtA5uhnFjxDBtjLMpHFeTZM'+
        'wY6aeMkhbQy1W1kyJXuvsSlJstjDJoBQBLsBLthsP9rkdaAjeprDWYutp9usnFnkbWzX1PhlHw/A'+
        'BKjdyHdWUUBhpAfvbC92UkLpIMmXVdy8RTqKSzVgZitkJM4sRYgfgKcFTYBXdTwVac/bOAD3BxmI'+
        '6m3cWOU7GmkMNWHhq5YmsCQNHaI0NKbr+A8gr4HxfoalQJbsNoPZGk/mfnEMQUVrlNVESwCjUUIS'+
        'AHzdobLut9m4ioHbOXIaqIZMjy+3O79rfyCagpDoGDQa9cZjG0BHL4SFU4uUwy4LFzOQsbOQBA/X'+
        'WfN1eweqPlPHP/LhZ4tit41UEryYfizLv/FPf2F2UFB+v0NeCoqdDOO/ZahJK8Ok1lTgbxY/dkjP'+
        'NykKg9v1GCRL+Q3eCWOMcOZwSTJmifbY/nuJsJkSTG6M0vgDh+7cG4NkXB0AAAAASUVORK5CYII=';

        createIcon(tr, 'Vimeo','https://vimeo.com/search?q='+filmTitle, img);

        //Movie-Censorship
        img = 'data:text/html;charset=utf-8;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABZUlEQVR42u2TsWoUYRSFv//OP/8I'+
        'M7vz7xATSSUhoIWmScDKRiys0mUqq+AD2CdlUkSwsxFERLCwWSRFnsBKFvEBljyCxbKQZWcyxyJm'+
        'CQSrNBY53T333gPnHq6T5LgBjBvifxHo9Zbo96tr3Rgjvd7Sot7a8uT5PWKM1PXFrjY3U5kdyeyr'+
        '0vSJJCfJyfunMvsisyPt7CQK4bHM3spsT2aHMnuvLHvgGY1akuQUWOX8/CV1PQKg62qgw7kxx8f3'+
        'adt9zN7RNN8B8P4VbfvIX7FiQGQ43AXmQARmSAVN8wKAEMYLO2374eoRAzF+An4hPUdaJsuGwJ2/'+
        'MwGA+fzhv1IISD9I028A5PlHpJ+AB6ak6Qkwp+tqimIZgKrqE8LGpUDFdLrGbHaKc5+ZTH7TNBtI'+
        'Hlhje3uM928Az9nZAUnymsnkGVU1vkihKO6qLAeLBCSnshxc49fXM+X5igaD8pJzt7/AH7Q3jhMe'+
        'rfP3AAAAAElFTkSuQmCC';

        createIcon(tr, 'Movie-Censorship','http://www.movie-censorship.com/list.php?s='+filmTitle, img);

        // BluRay
        img = 'data:text/html;charset=utf-8;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEB'+
        'AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEB'+
        'AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAQABADASIA'+
        'AhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAABAYHCv/EACMQAAEFAQABBAMBAAAAAAAAAAQCAwUG'+
        'BwEIERITFAAJFSH/xAAVAQEBAAAAAAAAAAAAAAAAAAAICf/EAB8RAAIDAQACAwEAAAAAAAAAAAID'+
        'AQQFBgcRExQVEv/aAAwDAQACEQMRAD8A0P8AhjnVXvGc7xYjsmh9etlUVVeVCsSpiwOHkEszi3gG'+
        'jVvNjhdL+Jp1x51vv+DtcV68Sn8l/wCwTOMyzSv4xNQVEaybS7pDSMhd85jZgifioplhiO+NX9L3'+
        'uRvDQpB8gDqor4WT2+uPuMcWyh8gHxP2jGapk3kHnep6wfk8hpSKuJAWGNrFvsZwqAWpn7pgiarH'+
        'FqaeFWQOjrZJoC3eE+rK3fa91KN5ueTeSaBkWP4Zl1quWqu5wcRIy+tXUAqPkJjnI4qOZCE5MMDz'+
        'xDZKzFOv8OCDQIFFwov2JZ/hD4z3TU6yPL7HrR0ZYkbkQwoXv18icg+PqL+X7j2FzFimvYgvdGvW'+
        'jVnQGWjZEB+OJ9ifIl4ar1WN5sdqcH2Hs+efsfsD2dp0qmnXUPU1rrMb+J+++1OT+cYqKqZFDJ//'+
        '2Q==';

        createIcon(tr, 'BluRay', 'http://www.blu-ray.com/search/?quicksearch=1&quicksearch_country=US&quicksearch_keyword='+filmTitle+'&section=theatrical', img);

        applyCSS();

    }

