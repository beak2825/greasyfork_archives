// ==UserScript==
// @name        Letterboxd Search Bars
// @description Adds a search bar to torrent- and other websites on Letterboxd
// @author      Lelobster
// @namespace   https://github.com/LeLobster/userscripts/
// @locale      English
// @include     https://letterboxd.com/film/*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/30547/Letterboxd%20Search%20Bars.user.js
// @updateURL https://update.greasyfork.org/scripts/30547/Letterboxd%20Search%20Bars.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', main);

function main() {

    // Get title and year from an already existing array (filmData) in letterboxd
    // How convenient
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
    } else {
        // In the rare case where a film doesn't have a imdb page
        // use just the title instead
        var imdbId = filmTitle
        console.log('Film has no IMDb page, using filmTitle')
    }

    // Also remove the backdrop because it's annoying to scroll past every time
    backdrop = document.getElementById('backdrop');
    if (backdrop != null) {
        var container = document.getElementById('content');
        content = backdrop.getElementsByClassName('content-wrap')[0];
        container.replaceChild(content, backdrop);
        container.classList.remove('has-backdrop');
        console.log('Backdrop removed.')
    } else {
        console.log('No backdrop present.')
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
    
    // The Pirate Bay
    img = 'data:text/html;charset=utf-8;base64,Qk04AwAAAAAAADYAAAAoAAAAEAAAABAAAAABABgAAAAAAAAAAADgTAAA4EwAAAAAAAAAAAAA////'+
    '/////////////////////////////////////////////////v7+/////////////Pz8vb297Ozs'+
    '////////////////////////////////4uLiSUlJ3d3d////////8/PzEhIScnJy8fHx////////'+
    '////////////8fHxwsLCWFhYAAAAyMjI////////5+fnEBAQICAgQkJCV1dXZWVli4uLiYmJUlJS'+
    'KioqPT09bm5uHh4eYWFhwcHBubm5bGxsQEBAp6end3d3FBQUAAAAFBQUOTk5ISEhGRkZPT09WVlZ'+
    'QkJCKioqJycnenp6AAAAQUFBPz8/YGBgjo6O0dHR+/v7////////7+/vxcXFnZ2dg4ODExMTQEBA'+
    'v7+/AAAAgoKCjo6OpaWltra2qqqqpqampaWlpKSkra2tr6+vsbGx5eXll5eXW1tb1NTUcXFxmJiY'+
    'AwMDAAAANzc3VFRUGxsbAAAAX19fPDw8ERERAAAAQUFB/v7+/Pz8////////nJycAAAAAAAAAAAA'+
    'Hx8fCwsLAAAAJiYmBQUFAAAAAAAAKysr+vr6////////////nJycAAAAAAAADw8PAAAAAAAAAAAA'+
    'AAAADQ0NAwMDAAAANjY2+vr6////////////rq6uAAAANjY25eXlWVlZHx8fJycnIyMj0dHRhoaG'+
    'AAAAV1dX////////////////r6+vAAAALS0t0tLSX19fsrKy2dnZZWVlsrKyiIiIAAAAWVlZ////'+
    '////////////r6+vAAAAAAAABQUFAgICExMTEBAQAwMDAwMDAQEBAAAAWlpa////////////////'+
    'q6urAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVFRU////////////////19fXSUlJQUFB'+
    'Q0NDQ0NDQ0NDQ0NDQ0NDQ0NDQkJCQkJCqKio/////////////////////////v7+/v7+/v7+/v7+'+
    '/v7+/v7+/v7+/v7+/v7+////////////AAA=';

    createIcon(tr, 'The Pirate Bay','https://thepiratebay.se/search/'+filmTitle+' '+filmYear+'/0/5/200', img); 

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

    createIcon(tr, 'MkvCage','http://www.mkvcage.com/?s='+filmTitle, img); 

    // TorrentProject
    img = 'data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEB'+
    'AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEB'+
    'AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAQABADASIA'+
    'AhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAwUH/8QAHhAAAgIDAQEBAQAAAAAAAAAABAUDBgEC'+
    'BwkIFBX/xAAUAQEAAAAAAAAAAAAAAAAAAAAI/8QAIhEAAQMDBAMBAAAAAAAAAAAAAQIEBgMFFBES'+
    'ExUABxYX/9oADAMBAAIRAxEAPwDCvMHyaafRdZ530NlzpZ0dPdLRW9r3Yz3tKYYoFReMF8xB2tPe'+
    'NcsdpYK2ww73OKrbLJxmZBln7IxsxSP6XeUj75kW3jqaGki8tAolrsElDtCuy1FZteaggYMZhG0d'+
    'Sr7qNuKVmuAZeas11eVbjEY1CaYF2JHwLI8nfTeifK4zM62RBB9YqnKm3K6FBbCZE9AJOMb1/Ch1'+
    'aW8bFfvKAhTJJRjKlgkEt8xHGnEdpdYcmiJ6t+m3PfqbRYxrcivfqVo5aj5f0jWskkuefqZxG9g/'+
    's2NAz0MalwKXaJviEWo6btGSBhsfKS1eZk0KNB5bSxMuNRLr2f8AsivZCqpaZtzMEMEN6xOfeY4b'+
    'AIv0e1wmzG5ZiaujoXTOCbb4NRSnInBUK0x+0M4KeILuPyhhhcAcupZ9T1mKRo05SrYBVDsPwGY/'+
    '/9k=';

    createIcon(tr, 'TorrentProject', 'https://torrentproject.se/?hl=en&safe=off&num=20&start=0&orderby=sizeD&s='+filmTitle+' '+filmYear+'&filter=2000', img);
    
    // Zooqle
    img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAABWUlEQVQoz42RTytEYRTGD0MJ5QtYy'+
    'AKNaea+z3nfe2fkzy3KSlmYNUlTo6woZaOklCym7IiSpITsfICxYUEWmlB2FmyGKGO4c3TvDMvJsz'+
    'mnnt85nc5D9D8prcfA5b67WfVjmLv+zLYGbCOPa+R5Mxky7ZzFE3L8gtXf6XktPEchLBixxtUmS7T'+
    'PbcApPlU4AHCHgu4kQhQejvgWOaolQsoIpwOAH1CIdRBFI/yNY9zjRmqI1KQWa7q8YdEITxOptBGk'+
    'eAeef67a02IGAiDapA7xxmd4xi7X2x18jkdc4AMe4pUz3TrLNRP2TC8TDbUkRnlGDaoVlFQisEcak'+
    'yEie1nn+d1Z01l4+qonYiW1WCYAnHB83d5igShhUWL59cHs21+V17l1JqMFwgLPbOhLH4RwiYuVDT'+
    '4SnzIHZjeRJHJbnSV9YjJmVnnarpJOTKHITrX4wnitCvzqB+tLeV5MwSPnAAAAAElFTkSuQmCC';
    
    createIcon(tr, 'Zooqle', 'https://zooqle.com/search?q='+filmTitle+' '+filmYear+' category%3AMovies%2CTV&s=sz&v=t&sd=d', img);
    
    //1337x
    img = 'data:text/html;charset=utf-8;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEB'+
    'AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEB'+
    'AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAQABADASIA'+
    'AhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAgUHCf/EACEQAAEEAgICAwAAAAAAAAAAAAQBAgMF'+
    'BgcIEhEUABMV/8QAFQEBAQAAAAAAAAAAAAAAAAAABwj/xAAhEQACAgICAwADAAAAAAAAAAABAgME'+
    'BQYHERIUFQgWIf/aAAwDAQACEQMRAD8Awh4oat09vWgz/Wt9TvA3E2nPt9e5Sl5cQDluSBGNEJqI'+
    'zW1Uq1JzR5SPIUspFYcVL17gfYj7ldqDSHHzXWttcV1Z+3yFsq0K82FlEGR3E9fRi9ZVlChpPcWp'+
    'bJZnPkFBV4URENZVKZMxCD43pLOPOzcK03TZpmj7ghNmmVJlPitbBW2CoNA+JJFc+0jGUWBLMxB0'+
    'K6FRSMCCfF38lOjcO9dkYFt3E8Oyltgou060EevyWtSqsGRWUUqOcS9tm6D03ema2QwXuQ9zhz5o'+
    'fKyxonwCe1uA5WES1d0OhNmYopZ+sl6i5r47urwqE9k6gbQSOxKWGIGRJ77pn+WFFj+NG/HhrD5H'+
    'i5OYE1izYgp+WD+jJq37PFE0ViUyikvJQx5lmqVwjbI+DA68cmD3/9k=';

    createIcon(tr, '1337x','https://1337x.to/sort-search/'+filmTitle+'/size/desc/1/', img); 
    
    //KickAss
    img = 'data:text/html;charset=utf-8;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAABMLAAATCwAAAAAA'+
    'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHUFLcyFLV74bO0UuAAAAAAAAAAAAAAAA'+
    'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeQEthLmNy+DVzhf81c4X/NXOF/ydUYdsc'+
    'PEUdAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkTFeuN3WG/zh2iP84doj/OHaI/zh2'+
    'iP84doj/M2t7/B9BS1IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlS1ecPHmM/zx5jP88eYz/WIyc'+
    '/3OfrP9BfI//PHmM/zx5jP83b4D9IEFLPgAAAAAAAAAAAAAAAAAAAAAiQ0wzPXiJ/kB9j/9AfY//'+
    'XZGg//b5+v//////4uvu/2iZp/9AfY//QH2P/zNkcu4AAAAAAAAAAAAAAAAAAAAAMl1q2UWBlP9F'+
    'gZT/RYGU/73T2f///////f7+//L29//p8PL/RYGU/0WBlP9FgZT/KUxXgAAAAAAAAAAAJ0ZPHUeB'+
    'k/9Khpj/SoaY/0qGmP/b5+r//////7vR2P9Khpj/bp6t/0qGmP9Khpj/SoaY/zlndOcAAAAAAAAA'+
    'AC9SXIBPi53/T4ud/0+Lnf9Pi53/0eHm///////F2d//T4ud/0+Lnf9Pi53/T4ud/0+Lnf9Mhpf/'+
    'KEZPEgAAAAA4YGu+VJCh/1SQof9UkKH/VJCh/8HX3f//////6/L0/1SQof9UkKH/VJCh/1SQof9U'+
    'kKH/VJCh/y9QWVwAAAAAQGp31lmUpv9ZlKb/aZ6u/5u/yv/W5en////////////C2N//3urt/3Sm'+
    'tf9ZlKb/WZSm/1mUpv81WWOIAAAAAENseNRemar/Xpmq/3Wntv//////////////////////////'+
    '//////+VvMf/Xpmq/16Zqv9emar/OFtlhAAAAABCaHS+Y52v/2Odr/9nn7H/iLTC/4Kxv//0+Pn/'+
    '/////6zL1f9jna//Y52v/2Odr/9jna//Y52v/zdXYVwAAAAAPF5od2ehsv9nobL/Z6Gy/2ehsv9n'+
    'obL/xtzi///////f6+//Z6Gy/2ehsv9nobL/Z6Gy/2Wdrv80UVoSAAAAADZTXBJkmqr+a6W2/2ul'+
    'tv9rpbb/a6W2/2ultv9rpbb/a6W2/2ultv9rpbb/a6W2/2ultv9SfovlAAAAAAAAAAAAAAAAS3J9'+
    'xG+ouf9vqLn/XIuZ9GGTovpvqLn/b6i5/2+ouf9gkqD5Zpqp/W+ouf9vqLn/QWJsdwAAAAAAAAAA'+
    'AAAAADtZYhdbipfxQWJrbgAAAAAAAAAAR2t2p2CRn/dBYmtuAAAAAAAAAABGanSgVH6L3wAAAAAA'+
    'AAAA/j8AAPgPAADwBwAA4AMAAMADAADAAQAAgAEAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAB'+
    'AADAAQAAxjMAAA==';

    createIcon(tr, 'KickAssTorrents','https://katcr.co/new/torrents-search.php?search='+filmTitle+'&sort=size&order=desc', img);
    
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

    createIcon(tr, 'Nyaa','https://nyaa.pantsu.cat/search?order=false&q='+filmTitle+'&sort=4', img);    

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
