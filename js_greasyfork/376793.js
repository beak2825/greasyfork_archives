// ==UserScript==
// @name             IMDB to RARBG Torrent Search
// @description      When on IMDB, click the small buttons to search for the movie/series on TorrentGalaxy, 1337x or RARBG Dump.
// @namespace        nickpapoutsis
// @author           nickpapoutsis
// @copyright        2025, nickpapoutsis (https://openuserjs.org/users/nickpapoutsis)
// @contributionURL  https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=A6EL76QADA2YY&source=url
// @license          MIT
// @match            https://www.imdb.com/*
// @version          0.8
// @grant            none
// @icon             data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALwAAABGCAMAAABBng7mAAAA3lBMVEUAAAD+/v////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////84YLv///9TdcSiteDc4/NPc8O5x+iWq9tbfMesveN6ldJohsz09vv+/v9wjc9JbsHs8Pnj6fY9ZL2wwOSAmtTL1u5Dab9hgcm/zOnX3/LG0uyPpdmIoNZ2ktHQ2u+csN5Xeca1xObl2PI1AAAAKHRSTlMA/N5PhvHq98DXx+QqHbtAM9AZrY9uFHVjRw0D2qaXswhdIlc6oH6o47OqVgAAB9tJREFUaN7tmmlz2jAQhm3A3OWGcJMAoRgI92UgmDOB//+Hysq2JEsWdZNOZzrD+6Et9lr7eLVaSValhx566KGHHnrooYf+lUrF1I9U7vl3ZsVowUurEG9GcyVn0wQ2ij4zN5g2EvViiXnWrZfneiHry1RqsVq66mvlmzkxerwaCsiUAooSSaYzT4UfrGmu8eqxrJRk1YvxU3m4YWvD7wlXMtk49vsjCyaMl5qDl1I9nwkqKqVIuoWtGMU9qrOUWDZqZ/cFbAb+F4u9Kgva8Fe8KYO94tJLKhub3beijdOqWOECbdoAdloRs8G8rAoVSCfAJHvPS5zq29pMYJV0wPcyRAzeS5FkYpW7/Wp0dEa9p1ABPyvy4i2ZuZWhaKZaT9OW9Ety9E9wedS1aX09aLIZuCec2NHk7beMjQ4QDeQ0B523tDcxWvc/tJnJVjCe7dmdrK/vPdOL3yuB6j9NTPlw1LdtpNVlvLbeIMaOXB9cfWtzWs37qGXlxbJ8gd8HbNCBmwkUryCQtXltNx8GfSLuv/3Vd/QyMyyA3czg5WDBmM13iEVuiOB5XT5wuzg5NuR27/Yzw8BzOqOoBRsYntOwh4L6LKVeEfpstHWw6qwBvyKE57W6onZLRp+GoWUqJp+Qhgw8rwWwzdIYntf2HfowXmzJKOwTQUMb5E4Mz+uAcoOM7A86ZJCsdQIv0NsUOpzA81pA7/yMRxD7pf3X4BfguYqypgWGR/qmdrvQIvAijeFBITxogGYiVGGG7e/D87mRinGGXchmAi/UHrrvHvwbGo3wx9l+XR8u3MO/rdfrbveoU4P2dtcD1bIAWbNv05pARH+w8HNo4/NEveYRXNDwm5vJ6EgliFULr3SFuaKry9155Q5+qBp6Jy88vUUtas0Hn/gy9vnEwg9Us2hgM52FHxkWJ2zxYU5LxO3ioGJpG/fwoIOtz72SlENrEyYj15A3AnhqfCw4eJN1y8B3SWXUVFqHhXt4uiRCHbvNU2iW0di5AwZaTgBPcmwlgFfnZMoAyTjVtog9UC6XwS0qoAg+eB8eHoErExIUFPksHRndopreXjPvAO+PQGAxigj+bLUj4+4mBnI6jhaZSWNyPR3JJCWGV2I0PKRNICEV0exnQR+s/u7DHOYA70nS8AsR/JD0IOiEqwzwxhpPSL6Qaklu3Ie31CEDFjKjCaFc4kCNqRLuKQrSRsNVSQC/J1Mh0oWuz3JZ5tenOVfwGr38CklSHq09caCuVkLINy9eAfyILpUyBz/bWePqbI5fatXkrMqzG3h5TjuuScUqGV/ge0nHrOYMry3wsGFn2Mt8Pp/gUjOcqkg9MkYEUhIu4LU5HQQ5LyXKEJkVXhbg7D9B3kSd4N/fMOqMgue1mbLleaKK5LsHvxgMBqexTrUMcDnIGuJ7SM1WixtYIG+D16GNc4e0sYMSJoTXDzI7vY5VpN3Ypk9xqXTWBaLiMzdxYyq0ezolghQ8rxOwV4XwsCZhxsiGmbJIf4T+AP5Ng8DXYRNHzYfv9CR2hJS4B3+GwL7inZTA5u/D60sI2ou5AdyRCnPThqpGclIMfwLr8g8ML6CHYbHGafN9+NWnDOy3MfKMN4Ck6T5d1hQR/NsOFYmGZIfXIYeh3mCt6duTb8GT/Y0a5jaAV3tR/oRfIvj5zPhAAvD8JCX3cTXtzKhdWue78GANniNNSWrIUPpwRg6QLL9DITyoiwKQ4uCth1bUwNfIMvxL8J39fq+3bUFNRkvI5NgWSGPgN/v9+xbn3gcqzyJ49Uxdmm1JcQVpOyTdLfwQntna9wgVtAGcgYkwuOwkdbVvv5UCD6/4bbubI70YPKuU5u7hsWec9kqV3gDymrDweE4gIJ4sB18OzujUONFvstK+CA+emQEHGrSFWjrAT6FFKkf8grQ50U/1KL9fgmc8d1VTFzH8moPH4xu02qNdkSO8vLBdIsNt8FV43jNUArHmDDzbVZ2paDMib+zDq08v174Iz3smubl7xxpSm0EeXtYJiCP8tDci3bmQ0RJ/SOg7ffkr8MQzGfk6Y2CrFH0OHqStSGJheFbMVLdfUde24+4tVAfdPTzvGcK0tJMxu7gxDw9ak+TrCeFJQcU9zMs9fCCMPeO0H9EfQrjPI1uZhfd77N/uhlMRPJnKlAiaC78HX45jz3hRP6cwlZebftq+1R9Y+Bo6pVou6EW9GH6Ftit59MxscA8++Vt4ifW8wRvAsfXVqhmhYU4cfCpNNnZIfWQvPl2QM1KqooJ2W/HH5tjv4EMS53lOjzwfPoYiH2ZmDHxaSoTsSbDVBPCXNaoqlZIkwV4YwnZa8YPiiGr2k9OB2qRjaI4ia3oedDgtYQdPHjtb12+x06x/d40X9CoQzwl+dDxTd/bG9Mn8eDU/9FVy6MiuFjDwuzpddSbdHjk6vX+UmZGQZ0eRtCuILYwXLGZU11JaJkwxC+mI+A+jwel0OnZ3PRmfeOYlRvUgc2bdhCPXlvBMOCshpX6qYsVQGMMu0QPBBsFJhGWBWaQalTjFQzZ2A67+qjg7yhAvQpiYkVnNpJugl9OATlRsBP18k55YNiU5qe4Llj1I5XCmaR13NytJD6tQ7UXCSuXTSXw9A9asTb0VC1mPlmNVpsFyKBROO/2PglI0E46QZFY84WqhJP1HKjafXmuxWKxWzUf/K/CHHnrooYcekn4BP1SLjzAI1FoAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/376793/IMDB%20to%20RARBG%20Torrent%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/376793/IMDB%20to%20RARBG%20Torrent%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('So long, and thanks for all the fish RARBG team. o7');

    function fn_getMovieYear() {
        let scripts = document.querySelectorAll('script[type="application/ld+json"]');
        for (let script of scripts) {
            try {
                let jsonContent = JSON.parse(script.innerHTML);
                if (jsonContent && jsonContent.datePublished) {
                    return jsonContent.datePublished.split('-')[0];
                }
            } catch (e) {
                console.error('Error parsing JSON LD script:', e);
            }
        }
        return null;
    }

    function fn_getMovieName() {
        let scripts = document.querySelectorAll('script[type="application/ld+json"]');
        for (let script of scripts) {
            try {
                let jsonContent = JSON.parse(script.innerHTML);
                if (jsonContent && jsonContent.name) {
                    return jsonContent.name;
                }
            } catch (e) {
                console.error('Error parsing JSON LD script:', e);
            }
        }
        return null;
    }

    function fn_createSearchableMovieName(movieName, movieYear) {
        if (!movieName) return null;
        let name = movieName.replace(/[^\w\s]/g, '');
        if (movieYear) name += ' ' + movieYear;
        return name.replace(/\s+/g, '+');
    }

    function fn_getMovieId() {
        let x = window.location.pathname.toLowerCase();
        let arr = x.split('/');
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].substring(0, 2) === 'tt') {
                return arr[i];
            }
        }
        return null;
    }

    function fn_fromTrailerGetMovieData() {
        const script = document.getElementById('__NEXT_DATA__');
        if (script) {
            const rawContent = script.textContent;
            // Safely handle the truncated content
            // Trim up to the last valid closing brace
            const safeContent = rawContent.substring(0, rawContent.lastIndexOf('}') + 1);
            try {
                const jsonContent = JSON.parse(safeContent);
                // console.log(jsonContent);
                let mov_id = jsonContent.props.pageProps.videoPlaybackData.video.primaryTitle.id;
                let mov_name = jsonContent.props.pageProps.videoPlaybackData.video.primaryTitle.titleText.text;
                let mov_year = jsonContent.props.pageProps.videoPlaybackData.video.primaryTitle.releaseYear.year;
                return {
                    id: mov_id,
                    name: mov_name,
                    year: mov_year
                };
            } catch (e) {
                console.error("Unable to parse JSON after truncation fix:", e);
            }
        } else {
            console.error("Script with id '__NEXT_DATA__' not found.");
        }
         return null;
    }

    function fn_createServiceButton(serviceName, searchUrl, urlParams, identifier, container) {
        let a = document.createElement('a');
        a.href = `${searchUrl}${identifier}${urlParams}`;
        a.target = '_blank';
        a.style.background = '#ffffff';
        a.style.color = 'blue';
        a.style.display = 'block';
        a.style.margin = '6px';
        a.style.padding = '4px 6px';
        a.style.border = '1px solid deepskyblue';
        a.style.borderRadius = '4px';
        a.style.textDecoration = 'none';
        a.style.fontWeight = '500';
        a.style.fontSize = '0.75em';
        a.style.textAlign = 'center';
        a.style.transition = 'all 0.2s ease';
        a.innerText = serviceName;

        a.onmouseover = function() {
            this.style.background = 'deepskyblue';
            this.style.color = '#ffffff';
            this.style.border = '1px solid deepskyblue';
        };

        a.onmouseout = function() {
            this.style.background = '#ffffff';
            this.style.color = 'blue';
            this.style.border = '1px solid deepskyblue';
        };

        container.appendChild(a);
    }
 
    var movieId = fn_getMovieId();
    var movieName = fn_getMovieName();
    var movieYear = fn_getMovieYear();
    var searchableMovieName = fn_createSearchableMovieName(movieName, movieYear);

    if (!movieId) {
        const fromTrailerData = fn_fromTrailerGetMovieData();
        if (fromTrailerData) {
            movieId = fromTrailerData.id;
            movieName = fromTrailerData.name;
            movieYear = fromTrailerData.year;
            searchableMovieName = fn_createSearchableMovieName(movieName, movieYear);
        }
    }

    if (movieId || searchableMovieName) {
        let services = [
            // { name: "RARBG", url: "https://rarbgprx.org/torrents.php?imdb=", urlParams: "&order=size&by=ASC", use: 'id' },
            { name: "TorrentGalaxy", url: "https://torrentgalaxy.to/torrents.php?search=", urlParams: "&lang=1&nox=2#results", use: 'id' },
            { name: "1337x", url: "https://1337x.to/search/", urlParams: "/1/", use: 'name' },
            { name: "RARBG Dump", url: "https://rarbgdump.com/search/", urlParams: "", use: 'name' }
        ];

        let container = document.createElement('div');
        container.style.position = "fixed";
        container.style.left = "1%";
        container.style.top = "8%";
        container.style.zIndex = '9999';

        document.body.append(container);

        services.forEach(service => {
            let identifier = service.use === 'id' ? movieId : searchableMovieName;
            if (identifier) {
                fn_createServiceButton(service.name, service.url, service.urlParams, identifier, container);
            }
        });
    }

})();
