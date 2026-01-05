// ==UserScript==
// @name        IMDb Altyazı, Torrent
// @author      Hasan KÖROĞLU
// @namespace   hasankoroglu.com
// @description IMDb üzerinde bir filmin sayfasında, PlanetDP sitesindeki ilgili filmin sayfasına direk erişim sağlayan bir link ekliyor. Ek olarak Türkçe Altyazı, The Movie DB, Zamunda ve IPT üzerinde de arama yapıyor
// @include     https://www.imdb.com/title/*
// @version     5.7
// @grant       none
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/5230/IMDb%20Altyaz%C4%B1%2C%20Torrent.user.js
// @updateURL https://update.greasyfork.org/scripts/5230/IMDb%20Altyaz%C4%B1%2C%20Torrent.meta.js
// ==/UserScript==

function adsRemovalReference() {
    if (Boolean($('.aux-content-widget-2').first().text().match("IMDb Answers"))) {
      $('.aux-content-widget-2').first().remove();
    }
    $('.cornerstone_slot').remove();
    $('.imdb-footer').remove();
    $('#social-share-widget').remove();
    $('.navbar__imdbpro').remove();
    $('[class^=Root__Separator]').remove();
  }
  
  function adsRemoval() {
    // removing 5th ".nas-slot" breaks dynamic reflow when window is resized.
    if ($('.nas-slot').length == 7) {
      $('.nas-slot')[0].remove();
      $('.nas-slot')[0].remove();
      $('.nas-slot')[0].remove();
      $('.nas-slot')[0].remove();
      $('.nas-slot')[1].remove();
      $('.nas-slot')[1].remove();
      $('#inline40_wrapper').remove();
    } else {
      $('.nas-slot').remove();
    }
  
    $('[class^=Banner]').remove();
    $('[id^=taboola]').remove();
    $('[class*=ProLink]').remove();
    $('[class^=IMDbPro]').remove();
    $('.imdb-editorial-single').remove();
    $('.imdb-footer').remove();
    $('.navbar__imdbpro').remove();
    $('[class^=Root__Separator]').remove();
  }


    function startObserver() {
    addDummyElem();
    if ($("h1[data-testid='hero__pageTitle']").length) {
      const obscfg = { childList: true};
      const obs = new MutationObserver(checkDummyElem);
      obs.observe($("h1[data-testid='hero__pageTitle']")[0], obscfg);
    } else {
      console.log("Start Error: Element not found! Please report it.");
    }
  }
  
  function addDummyElem() {
    const temp = $('<temp />').attr('id','temp_scout').css({'display':'none'});
    $("h1[data-testid='hero__pageTitle']").append(temp);
    setTimeout(function(){
      temp.remove();
    }, 2000);
  }
  
  function checkDummyElem(mutation, observer) {
    if (!$('#temp_scout').length) {
      observer.disconnect();
      adsRemoval();
      startIMDbScout();
    }
  }

  function startIMDbScout() {
    var IMDbID = document.URL.split("/")[4];
    var IMDbID4TA = IMDbID.replace("tt","");
    var movieTitle = encodeURIComponent(document.title.replace(/^(.+) \((.*)([0-9]{4})(.*)$/gi, '$1'));
    var movieYear = encodeURIComponent(document.title.replace(/^(.+) \((.*)([0-9]{4})(.*)$/gi, '$3'));

    var sites = {
        turkceAltyazi : {
            title: 'TurkceAltyazi.org',
            href: 'http://turkcealtyazi.org/mov/' + IMDbID4TA + '/',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAxlBMVEXs5uDYmFjej0LYlVTs5Nzaq376fAD7fQDapXLdoWbxgRTmlkvpizPsiCfqgyHnlUnnlEb3ewDfoGLnk0X////pwJzptYbcoG327+n38e7udgLv2snveQfotYbppWfkhSz7+ff28e7tdgLnk0Tnn1zppmf5fADpxqjugRfquo/vfQ/qjDPnsYD2egDtegvoxqnmupTvegncoWjjuZXu39Xu39TlsIDarYL4ewD1eQD5ewDaqXjw7Ojao27eoGLao2zu6eT///+9dV4WAAAAQXRSTlMcpbuoIX79/YqW/f39/f39/f2a/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/ZT9/f39e/39/YYUjpqQGHUulP4AAAABYktHRBSS38k1AAAAB3RJTUUH4gEfDA8XrxMePAAAAIlJREFUGNOdzdcOAkEIQFFsoI51xV7Wuvbeu///VcJo4jx7Hwg5IQEgFHaKRCGG5IRxSCSNSaWNlMmaXN4Dr8BcLLFUrnC1ZqHeaCq0/HanK9DjPloYBEN7MRpP6AM0nc0FSN58QVYF+gH9DbhYKqzWFjZEwXan7Q+ocJR5OtsucnyF2/3h9Hy9Acj/Ff/423BoAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE4LTAxLTMxVDEyOjE1OjIzLTA3OjAwC521fwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOC0wMS0zMVQxMjoxNToyMy0wNzowMHrADcMAAAAASUVORK5CYII='
        },
OpenSubtitles : {
            title: 'OpenSubtitles.org',
            href: 'https://www.opensubtitles.org/en/search/sublanguageid-tur/imdbid-' + IMDbID4TA + '/',
            icon: 'data:image/x-icon;base64,AAABAAEAEBAAAAEAGABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAAAAAAEgAAABIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///////8AAAD///////8AAAD///////8AAAD///////8AAAD///////8AAAAAAAD///////8AAAD///////8AAAD///////8AAAD///////8AAAD///////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACqqqr///////+qqqoAAAAAAADMzMzu7u7///////9VVVUAAAAAAAAAAAAAAAB3d3eZmZkAAAAAAACZmZmIiIgAAACIiIgAAAAAAABERETd3d0AAAAAAAAAAAAAAADu7u4REREAAAAAAAARERHu7u4AAABERET////////d3d0zMzMAAAAAAAAAAAAAAADd3d0iIiIAAAAAAAARERHd3d0AAADd3d1EREQAAAAAAAAAAAAAAAAAAAAAAAAAAAB3d3eZmZkAAAAAAACqqqp3d3cAAADMzMxEREQAAAARERHd3d0AAAAAAAAAAAAAAAAAAACZmZn///////+qqqoAAAAAAAAiIiLu7u7////////u7u4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///////8AAAD///////8AAAD///////8AAAD///////8AAAD///////8AAAAAAAD///////8AAAD///////8AAAD///////8AAAD///////8AAAD///////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
        },
        planetDP : {
            title: 'planetdp.org',
            href: 'https://www.planetdp.org/movie/search?title=' + IMDbID + '/',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACI0lEQVQ4jZ2TvU8TcRjHf5faF3rX68v17rg2Tk4MxjARBwdjCHEyDE6OxMk4dHI0/gXMDC4uxiZqGpDm+iK9UugrlLZWUhgdvEYiCZTWtvf7fR1ImxgQrMN3eJ48zyd5nuf7EABc/4DMWC3y0KwRHgA3icg4OCDz9JC87jdtT/4PAHCdBlHR4pK0ZWv3m7ZHEwHMGuFPikQCwOGr/Rn27aDNG9/7dcftawG/KuTW4Tpxsrq7Rmv88rig4Wig6QRrODdP846ZvwK6RcciosRm7QnvUXOBVfkfg8rUHACO7k1FUHcDX9wY7Lq2zsr22QuAftH9srJC7MOSuMx2ebAdYaQmAM7UCd8r8AaqAlAVMKzw6V7OdS8aJbZzwLb47mfS76W5QISVPWBFEah4gR3Pvqmfn/YoKTxnZREoi0BFBCuLsIrCYwKAG+Z8ta4RuGllpEUUfEDJR3sZ330AXDvuudvNetso+cEKfrBtP9iWPz/Ii3PjESxDOh0Y8iyyysIw54+N5jtJBD4hLwF5CXRTAs0Gvg2zgYU/dmC+ITzNyLA25KVR8ng9+IoaCpCTwTIyaEZuWxvBSw1GjlalMDLT6MSDEfOj9GCYUnswVLDPKmhKoTQtv7jSB8cflDsspcFKaGCpaYq0BprUYCW1FVNXr/0N0okp8ywRAkuEwPQQLD30thNT1H/+hbNV7Sn0MKx4ON9f0y5125WA3lpoCboWmbRxpN+LnLX+CQnBkgAAAABJRU5ErkJggg=='
        },
        zamunda : {
            title: 'Zamunda.Net',
            href: 'http://zamunda.net/bananas?search=' + movieTitle + '&incldead=&field=name',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACyklEQVR42k1UXU8TQRTd/4eGYMFI9Mk3E6I++GBMjPqi8cEXNcHSiNIWJBjQECJCbAgK5UM+LVALtAu0hZay22/b7tyd451pQSc5DzP33nPOnZ27hmwt15VSCCFPcgW5GjuRy3uWXNnPy9V4Xv4yLRk/zstytSZd4kRXXizD5UoiguMIxNM2oodn2E9ZSFl1WBXCWdnBsV1DIlNCLGkjmS2AhcB1cKULo+64slZv4Gc0ia1kCY5wOCigSJM2IWEJ1BzSexXbMIv4bWZY0NEkRrVWl0o1mq42WRkqeS5BuDFM6AwI9IaJSViVz9k1IodFdmlznoARSeTkQsxGpSbAbiA4qc6KL3+oYlfj5gjhwFIEyrZkJwLrCRuFcg3Gx4UT+S1awWmJYJcJRd03q38gdA1KDU+AsJki7t3VaDQIS7t5mGkLxquQLb/HBfZPuec8Ic2Y2W2qnxN0BiTmTSavEkp/SOcumgLTqykYd0aLcmKbsJYk7BwT4hx8GvpH0Bl0ccXvYvmQcFwQ2M0SNtIuVo5c+GeZoPt9Xj6fIXzdIQyvs7UDwqMp0rab6oSHvJ9nlxspRprFuJ3xLb6nyQMYPYNJeS3g4AWTPGPlx9OE13OkbZ8TKHQFBT5FSDvxLREefCH0TcVh9E3uyg6fja5A8+bvc8Ab/s8Bt6DBe98CxycI14cI3QNlhFZNGGvRI9kTTMHjFzrp1hhxz9RSdpmoCX0nQSZuxW4PpWGmTmEUikU5MhtDm7ekgx6/qwmUAw3/eVHLCZNc9pUwyjXVagWGGqBcLoe344u41FeGZ0BcPKCLzxhs7pXLNm8Rb8YWoWrUTBhqCuuNOjLZLD7PbuPekImr/Rba3znaSccAob2/jm7fCe4G4hgJRZDJZPkxNZqzoEZSvX11kLd5GvcSmApvoXd8A0+GGMMReMfXMR3exE4sDsuy4bSK+R+Av2zpb/iEe4yjAAAAAElFTkSuQmCC'
        },
        IPTorrents : {
            title: 'IPTorrents',
            href: 'https://iptorrents.com/t?q=' + IMDbID + '/',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAqFBMVEUAAAAZGRsZGRtBQUJISElAQEFCQkMZGRsZGRsZGRstLS8ZGRtHR0lFRUdHR0kZGRtCQkQrKy1CQkNDQ0UZGRsZGRtGRkgZGRsjIyUxMTM1NTc2NTdCQUNGRkhHR0lSUlNSUlRpaWtvbm+AgIGLiouMi4yXlpeYl5iZmJmamZmioaKura65uLm/vr7Fw8TMysvQz8/T0dLb2trl4+Pn5eXw7u7y8PH9+/sAlp/OAAAAF3RSTlMAMDM0NjtydXh+foGDhoaHi4yTlJn8/WhZUs4AAACJSURBVBgZVcHLDoIwEEDR2+kgT6Nu/P8fxMRgoJTSURYGOMdROHa2qD4qdqH3zZUDRYQTr1C2r2vBGDMbgaKkgEfLswPU2MTPvcQ3bjBZjZ9LV80jYTTTvKwkU9/PmRQsK7ay2nvgx2UQdrFrwWslcyQlYEq2JFfdOApinESJmYMcHFLX/E1T/gLDGzwhNRbwQQAAAABJRU5ErkJggg=='
        },
        TMDB : {
            title: 'TMDB',
            href: 'https://www.themoviedb.org/redirect?external_source=imdb_id&external_id=' + IMDbID,
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAH+SURBVDhPnZNPSBRRHMe/b3ZnzJatYQrRdC1DYfEiKCRmHboURGSCl40IivKS1CVIWToVogWepEU8RB2yi10Do0TNSFG01oNEpKYsirs4uk2z7r/Xb8d32GmWwD6PHwO/3+995zff94ZxYkifx9XVISCzC4BR/AsOuA7glS+AgFoHpqdNrk5fx3P/A5wqrkCSZ0RjYRTmxpT5EzcXn0BvfAmM7HzjmLuXG2RfYP4uf0d7JTeThPYeH38vg4U7oSwE8TQ6juHtsJVvj7yxnvm4INH6izMHT+B1ZQChY1fQoTWhbbEH3ZujGIy8FR15kF0OgRw72V3EKbYyJi6XnsdaahtVh2pE1U5BgWImW2YleBpmNo1nNM1SMiaqdhwCOr0V5FGz5zhOKhoGylvRH/sEo/ax6LDjEJhNRNAbHcPttWGEYp8R3BhBimfhCd8XHXYcApzWRa8f09UdeLT5HpWKSqcxBq+sig47BT2YMJbRsvICd7TTWE3q6Cu7hHhyS1QFdCFzOATqispwwVuDa2o9giXn0K414qu5ji/+LtEhYIysIpUP8e//dxNnbvHxXz+4e09OzEM8JNMmjCU6RpfI2JEpP2ms0AQunPVUQUrlfh5JtooLiXWKDVQrR+Aj83xkXEVelMuHcdTtwQ2tAZn6kLUHo/QJ0bQhBtsvnP8BlZ5M84Jv60QAAAAASUVORK5CYII='
        },
        YTS : {
            title: 'YTS',
            href: 'https://yts.mx/browse-movies/' + movieTitle + '/all/all/0/latest',
            icon: 'data:image/png;base64,AAABAAEAEBAAAAAAAABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAAAAvwAAHjMdABpTFgAeKxsAAMUAAAqdDQAhKxsAAMsAABZfFgAFtQQAHjQbACQfHAALmAsAEX8PAA2UDgAjHh8AICEfACAlHAAWZRYAAbACAAOwAgAQdhAAAagAABhdFAAcHx0ACqgIABw1GQAWYBQAHh8dAB4xHAAYYBQAA8sBABo7GQAfHiAAIR4gACMeIAAWbBQAEYkNABwgGwACtgMAIyAbAAqrCQASXBAAE1QWACEfHgAMmQoAAMAAABlRFgAExwUACqAHACMfHgAHnwoAJB8eABdQGQAhIh4ADYkOACAoHgADwgMACaUKABRzEgAHrAcAAMwAAAPXAgAfIBwAHR8fABw5GAAhIBwAHjEeAB8fHwAXURcAIR8fAB4mHAAZWxQAB5cJABCJDwAVcBMAHEEbAAK6AgAfIx0AEIAQAAmcDAAVWBUAEHERAAyKDQAfKR0AAr8FAASxAwAEtQAAFV4VABN3EQALlwoAFmEVACEhGwAdIB4AEowQAB8gHgAGuQYAE3ESAB8sHgAdMxsAALsBACAdHwACvgEAIiAfAA6IDAAPhA8AJCAfAAydCwAVahYABMQBAAK1AgAHqggAGkkYAAqmCwAgHh0AB7EFAAO4AgAiHh0ACpsJACAhHQAWZRQAICAgACIgIAADvQUAGVUYAAerBgAgKh0ACJkHACAfGwAcHh4AG0YZABJ0FAAdMB0AALwAAB4eHgAgHh4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARIcjJk4kfTlte2sXZ4csREY/LFgJPToNYTtpKTwvQDIhC4MuM3BGcoZ5XYYIUAJqcluFXiwiVEwdgDJGHIRKQzhudkYmPyA+BV+HMix1BlFSTQEjRF9nMHtjRF9GhmVib2gmRBAyHHEfKkJlX0JGclYeRFwyRl8lB1pdEEZ1RkQTRV8PLECGLQRVGodGRCxGFDVCh19EEWBmABk2h3IcXzEbh3ksNCsAJ3N0FRgiLEYSWXccQmUOFgxBV2RILCIsR1N+LHlfN0l4LEt/T4ZfXyx8bEYsQnIoRiGBHCwscjREdUWCRCwsRj9yMiEsh3qGX3oyCgMsRkBfEA8sX19dXwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='
        },
        rutracker : {
            title: 'rutracker',
            href: 'http://rutracker.org/forum/tracker.php?nm=' + movieTitle + ' ' + movieYear,
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAB+UExURUxpcewYPjVL7jJO6+MfRCOQpDhD8wDNY7EzdTdN6OcbPuQeROYeQQDOYzVN6dooQQDWXwDSXQXVXwDQYTZN6gDPY+MfRADOYgDRZOccQgDXXiFe7jdN6OgdPukaQwDNYwDTZTdN6QDNYzdN6PsLOBpU/+MfRDdN6ADNY+MfRFL0/qQAAAAndFJOUwA/hEv9BSv9A/wr7b3svhWZFC7IqtzUtIWsSRnra435d3Jj0VJohJbObYsAAAGvSURBVDjLfVOLkoIwEFughVKegqg8FHycbf//B2+3Leo5eqvM4CQm2VAAPowQ8N8IOOb/4wEzEsR3vNoZc/xMEDggesNM/11B5oibrHpnCJC7PO/7HSOcmdPfVTi31ggZZnFK8bYuhkeQYDvM5MELfFlQBe7GwVmeWaHsFHgDqPV+gyLeJBhl5rww60rQxQUbNBQxj9PoxuhuJ1eFg5617hZpQx5/0mnEMth9DcFh0Uky61ZaB1kqVVYZCx5bkEKCnzqgLdBBpSqUgS1WOMLeEoYT7RmEihjb8dkSNIlGvENZlt2gRJg45RYnJJy33sH0t2oZSEHZi4To/4TjFE3VHLqkjh2o0jRVJQcYCocjo0OnRDehZyg1xUALzJ5AMBK6zXY1iNDg0haEOJyuWe/51eW8ukOxGQ4PF0uhGFYgRAH6ImfvIT13bdvWsdvj7FA8LuCrKpbNGOP4KkJPsF2RfNEAnNeANsPLUBkDMiMq0XPSGJ4P9KJ1DXg0I1tQOk2vIWzOpKNDZRWm88h5HF5V+Xr4D2RABFX6Bymi6MOLF6lQkBUI/ob53zx+vg508wvG0Dc0OR2vqAAAAFd6VFh0UmF3IHByb2ZpbGUgdHlwZSBpcHRjAAB4nOPyDAhxVigoyk/LzEnlUgADIwsuYwsTIxNLkxQDEyBEgDTDZAMjs1Qgy9jUyMTMxBzEB8uASKBKLgDqFxF08kI1lQAAAABJRU5ErkJggg=='
        },
        X1337 : {
            title: 'X1337',
            href: 'https://1337x.to/search/' + movieTitle + ' ' + movieYear + '/1/',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB/ElEQVQ4jc2QzW/ScBjHf8JGaetpcQcjcthmgrqZEWIFWlo6M5niBoH4MhIyHIjxhQQlnMXEg/4hetB49ODJiwcPZp0RA9K1/ZUCbSHeTNxi5uPFedkLnozP9ZvP53meL0L/zRhXfWm7GFy3i2HJLLJ1vHyqspPhzGnRLsfe25X4er+61OxlzzzeJWjFvRPG8vQnM89ArxCE7kpANa54jtUQcvQKoZeDyiUYVBehfz+2raUnk3tesbHkWTBXZjetPAPWzRAY13wlNXWCN++K3/sPLsKgughGganVEHLs98mh7nXf814uAN3Vs9DJBdqdVeajVToP/UocenfEOk6dPHpgF0rCM2Nkpr92cgGwiiyYtwWwyzGw7ok/tMTxG39VqJ6eeGLmz4F1iwO7NAdmngE8P/buLUIjQ+EaQg4jM/PMLAShm52FTtILukiDyo421/xofKhAvTA2rye9W/rCEcBRCnCEgPbcYdBFGjSBenQgLE8hQhepNxpPAOYJUHmXpPDEa12kfwvIthxGk/sKWqwzhQVyG0cp0AQSvoSdWTmE/Krg/oYFErBIQ4tzPX2BkHMX/DmEpmTO1diBVZ5orPnReA0hxwZHvMJRClTeDUqE+NkMOxN7btcEStIEUtIEd11mR8t/Mo64rETcHxTOJeEo3ZDDIw+HlvnP5heCh+ZBZ0Cl7QAAAABJRU5ErkJggg=='
        }
    };
		
    var marginLeft;
    var heroSubnavBarLeftBlock = $("div[data-testid='hero-subnav-bar-left-block']");
    if (heroSubnavBarLeftBlock[0].childNodes.length){
    	marginLeft = 340;
    }else{
      marginLeft = 540;
    }
    
    heroSubnavBarLeftBlock.after("<div id='linksContainer' style='margin-left:-"+ marginLeft +"px;'></div>");
    
    var linksContainer = $("div#linksContainer")
    
    var newLink, site;
    
    for (const key in sites) {
      site = sites[key];
      newLink = "<a href='"+ site.href +"' target='_blank' style='margin-left:10px;'><img width='16' src='"+ site.icon +"' title='"+ site.title +"'></a>"
      linksContainer.append(newLink);
    }

  }
  
  if ($('html[xmlns\\:og="http://ogp.me/ns#"]').length) {
    document.addEventListener('DOMContentLoaded', adsRemovalReference);
    document.addEventListener('DOMContentLoaded', startIMDbScout);
  } else {
    document.addEventListener('DOMContentLoaded', startObserver);
  }