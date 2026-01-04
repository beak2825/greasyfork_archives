// ==UserScript==
// @name             IMDB to RARBG Torrent Search
// @description      When on IMDB click this small button to search for the movie/series torrent/magnet links on RARBG
// @namespace        nickpapoutsis
// @author           nickpapoutsis
// @copyright        2019, nickpapoutsis (https://openuserjs.org/users/nickpapoutsis)
// @contributionURL  https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=A6EL76QADA2YY&source=url
// @license          MIT
// @include          https://www.imdb.com/*
// @version          0.5
// @grant            none
// @icon             data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALwAAABGCAMAAABBng7mAAAA3lBMVEUAAAD+/v////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////84YLv///9TdcSiteDc4/NPc8O5x+iWq9tbfMesveN6ldJohsz09vv+/v9wjc9JbsHs8Pnj6fY9ZL2wwOSAmtTL1u5Dab9hgcm/zOnX3/LG0uyPpdmIoNZ2ktHQ2u+csN5Xeca1xObl2PI1AAAAKHRSTlMA/N5PhvHq98DXx+QqHbtAM9AZrY9uFHVjRw0D2qaXswhdIlc6oH6o47OqVgAAB9tJREFUaN7tmmlz2jAQhm3A3OWGcJMAoRgI92UgmDOB//+Hysq2JEsWdZNOZzrD+6Et9lr7eLVaSValhx566KGHHnrooYf+lUrF1I9U7vl3ZsVowUurEG9GcyVn0wQ2ij4zN5g2EvViiXnWrZfneiHry1RqsVq66mvlmzkxerwaCsiUAooSSaYzT4UfrGmu8eqxrJRk1YvxU3m4YWvD7wlXMtk49vsjCyaMl5qDl1I9nwkqKqVIuoWtGMU9qrOUWDZqZ/cFbAb+F4u9Kgva8Fe8KYO94tJLKhub3beijdOqWOECbdoAdloRs8G8rAoVSCfAJHvPS5zq29pMYJV0wPcyRAzeS5FkYpW7/Wp0dEa9p1ABPyvy4i2ZuZWhaKZaT9OW9Ety9E9wedS1aX09aLIZuCec2NHk7beMjQ4QDeQ0B523tDcxWvc/tJnJVjCe7dmdrK/vPdOL3yuB6j9NTPlw1LdtpNVlvLbeIMaOXB9cfWtzWs37qGXlxbJ8gd8HbNCBmwkUryCQtXltNx8GfSLuv/3Vd/QyMyyA3czg5WDBmM13iEVuiOB5XT5wuzg5NuR27/Yzw8BzOqOoBRsYntOwh4L6LKVeEfpstHWw6qwBvyKE57W6onZLRp+GoWUqJp+Qhgw8rwWwzdIYntf2HfowXmzJKOwTQUMb5E4Mz+uAcoOM7A86ZJCsdQIv0NsUOpzA81pA7/yMRxD7pf3X4BfguYqypgWGR/qmdrvQIvAijeFBITxogGYiVGGG7e/D87mRinGGXchmAi/UHrrvHvwbGo3wx9l+XR8u3MO/rdfrbveoU4P2dtcD1bIAWbNv05pARH+w8HNo4/NEveYRXNDwm5vJ6EgliFULr3SFuaKry9155Q5+qBp6Jy88vUUtas0Hn/gy9vnEwg9Us2hgM52FHxkWJ2zxYU5LxO3ioGJpG/fwoIOtz72SlENrEyYj15A3AnhqfCw4eJN1y8B3SWXUVFqHhXt4uiRCHbvNU2iW0di5AwZaTgBPcmwlgFfnZMoAyTjVtog9UC6XwS0qoAg+eB8eHoErExIUFPksHRndopreXjPvAO+PQGAxigj+bLUj4+4mBnI6jhaZSWNyPR3JJCWGV2I0PKRNICEV0exnQR+s/u7DHOYA70nS8AsR/JD0IOiEqwzwxhpPSL6Qaklu3Ie31CEDFjKjCaFc4kCNqRLuKQrSRsNVSQC/J1Mh0oWuz3JZ5tenOVfwGr38CklSHq09caCuVkLINy9eAfyILpUyBz/bWePqbI5fatXkrMqzG3h5TjuuScUqGV/ge0nHrOYMry3wsGFn2Mt8Pp/gUjOcqkg9MkYEUhIu4LU5HQQ5LyXKEJkVXhbg7D9B3kSd4N/fMOqMgue1mbLleaKK5LsHvxgMBqexTrUMcDnIGuJ7SM1WixtYIG+D16GNc4e0sYMSJoTXDzI7vY5VpN3Ypk9xqXTWBaLiMzdxYyq0ezolghQ8rxOwV4XwsCZhxsiGmbJIf4T+AP5Ng8DXYRNHzYfv9CR2hJS4B3+GwL7inZTA5u/D60sI2ou5AdyRCnPThqpGclIMfwLr8g8ML6CHYbHGafN9+NWnDOy3MfKMN4Ck6T5d1hQR/NsOFYmGZIfXIYeh3mCt6duTb8GT/Y0a5jaAV3tR/oRfIvj5zPhAAvD8JCX3cTXtzKhdWue78GANniNNSWrIUPpwRg6QLL9DITyoiwKQ4uCth1bUwNfIMvxL8J39fq+3bUFNRkvI5NgWSGPgN/v9+xbn3gcqzyJ49Uxdmm1JcQVpOyTdLfwQntna9wgVtAGcgYkwuOwkdbVvv5UCD6/4bbubI70YPKuU5u7hsWec9kqV3gDymrDweE4gIJ4sB18OzujUONFvstK+CA+emQEHGrSFWjrAT6FFKkf8grQ50U/1KL9fgmc8d1VTFzH8moPH4xu02qNdkSO8vLBdIsNt8FV43jNUArHmDDzbVZ2paDMib+zDq08v174Iz3smubl7xxpSm0EeXtYJiCP8tDci3bmQ0RJ/SOg7ffkr8MQzGfk6Y2CrFH0OHqStSGJheFbMVLdfUde24+4tVAfdPTzvGcK0tJMxu7gxDw9ak+TrCeFJQcU9zMs9fCCMPeO0H9EfQrjPI1uZhfd77N/uhlMRPJnKlAiaC78HX45jz3hRP6cwlZebftq+1R9Y+Bo6pVou6EW9GH6Ftit59MxscA8++Vt4ifW8wRvAsfXVqhmhYU4cfCpNNnZIfWQvPl2QM1KqooJ2W/HH5tjv4EMS53lOjzwfPoYiH2ZmDHxaSoTsSbDVBPCXNaoqlZIkwV4YwnZa8YPiiGr2k9OB2qRjaI4ia3oedDgtYQdPHjtb12+x06x/d40X9CoQzwl+dDxTd/bG9Mn8eDU/9FVy6MiuFjDwuzpddSbdHjk6vX+UmZGQZ0eRtCuILYwXLGZU11JaJkwxC+mI+A+jwel0OnZ3PRmfeOYlRvUgc2bdhCPXlvBMOCshpX6qYsVQGMMu0QPBBsFJhGWBWaQalTjFQzZ2A67+qjg7yhAvQpiYkVnNpJugl9OATlRsBP18k55YNiU5qe4Llj1I5XCmaR13NytJD6tQ7UXCSuXTSXw9A9asTb0VC1mPlmNVpsFyKBROO/2PglI0E46QZFY84WqhJP1HKjafXmuxWKxWzUf/K/CHHnrooYcekn4BP1SLjzAI1FoAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/392236/IMDB%20to%20RARBG%20Torrent%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/392236/IMDB%20to%20RARBG%20Torrent%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    getMovieId();

    if (movieId) {

        let div = document.createElement('div');
        div.innerHTML = '<a id="rarbgSearchButton">RARBG</a>';

        div.style.display = "inline-block";
        div.style.position = "fixed";
        div.style.left = "1%";
        div.style.top = "3%";
        div.style.zIndex = '999';

        document.body.append(div);

        let icon = document.getElementById('rarbgSearchButton');

        icon.style.background = 'white';
        icon.style.color = 'blue';
        icon.style.fontWeight = '800';
        icon.style.padding = '5px';
        icon.style.border = 'solid 2px black';
        icon.style.borderRadius = '7px';
        icon.style.textDecoration = 'none';
        icon.style.fontSize = '0.8em';

        icon.href = 'https://rarbgmirror.com/torrents.php?imdb=' + movieId;
        icon.target = '_blank';
    }

    var movieId;

    function getMovieId() {
        let x = window.location.pathname;
        let arr = x.split('/');

        for (let i = 0; i < arr.length; i++){
            if (arr[i].substring(0,2) === 'tt' || arr[i].substring(0,2) === 'TT') {
                movieId = arr[i];
            }
        }
    }

})();
