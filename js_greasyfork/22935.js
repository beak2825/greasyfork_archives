// ==UserScript==
// @name         Better Trakt
// @version      1.2.4
// @description  Simplify trakt.tv progress list
// @author       mBartek89
// @match        https://trakt.tv/users/mbartek/progress*
// @namespace    https://greasyfork.org/users/30602
// @downloadURL https://update.greasyfork.org/scripts/22935/Better%20Trakt.user.js
// @updateURL https://update.greasyfork.org/scripts/22935/Better%20Trakt.meta.js
// ==/UserScript==

var services =
    [
        {name:"RARBG", link:"https://rarbgmirror.org/torrents.php?search=%T%20S%SnE%En&order=size&by=DESC", icon:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABR1BMVEX///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+/1OlVdMlVf8lff8l0lNS0yek1X78/ar+qv+m/yelKar90itT0//9KdL+UqtTp6f9VdL/f3/Rff79qislVf79/lMm0v990islVdLQ/X7SftNRKaqoqVZ8qSp8qSpQfP4o1VZRKX5+qtNQKKnRqf6oVNXRKap+qtMkKKmoKH19qdJ/09PQ1Sn+qtL8AH1UAFVVfdJTJ1N8VKl8KH1WUn7Sfqr8ACj9VaooAFT8AFUq0v8np6fTJydS/ydTf3+nJ1NTU1N99yrtlAAAAK3RSTlMBH3uHhWclObvxfQVx7433Kf2BXyG1B/vr+eFdRcnR2VUvmaWjoTcLp58DpphvfgAAANxJREFUGNNjYGBkYmYBAVY2BjBg59CGAk4ubpAAD6+Orh4Q6BvoaPNBBAyNjI3AwIRfACxgamxmbmpqYGasb8EKEbC0tNIWtNaz1LMWggjY2AAFbO1s7C2EoQIOjqZOzi6ubpwiEAEXF3cPD09PR20WiC1OXt4+vt7eXracbBABP3//AO0A/8AgbVExsEBwSGiYdnhESGgAWA8Pb2RUdIw4f2xcfHSCtjA3UCAxKSlZgkkyISUpNU1KmkFGNj0jM0uOgU87OyMzR16BgUFRSVlFVY1BXUhDRVlTTQsAcDspXgMNtgsAAAAASUVORK5CYII="},
        {name:"1337x", link:"https://1337x.to/sort-search/%T%20S%SnE%En/size/desc/1/", icon:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABhlBMVEX////hUyPgVSfeTBvhUB/hVyjiUB/dSBTdSRbhTRzhTRvZPQjZPAjdQxDdQg/ZOAPdQw/cPAbdPQfbPAbbOgTbOwXkWCjqZjnpZzvnZzviWiziWy7qcUjqdEzqdk7mXS/gTx7kWizlYDPjVSXfUyTmZDnqcUfhVCXfUB/oXzHjWCngVSbobELlZDfhVifiUB/lWCnlYDPlYjbma0HhWCnhUB7kWy3obELgTx3hUyPgRhPYOAPfSxrkWy3ePAXZOQTfSBXiUB7gQArdPQjhQQrePgfePgjgQArbPAbcPAbgQArbOwXcOwXePwnbPAbaOwXZOQPcPQfePgjaOgTbPAbcPQjdPgjbOwXfQArfPwnfPwncPAbdPQfePgjdPQfhQQvbPAbnYzbmZDjrc0rrdU3oYzboZTnqcknmYDPlYjXobUPqc0vkYDPoZjvnaT/pcEfnYzfoZzzpbULnZDjlXTDkUB7hQQvhSBTgQArgPQfiQgzfPgfgPgffPwngPwngQQvePgj///85rpkjAAAAYXRSTlMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU9DP1HNByNDYhCLT3hsCq/1QSPhtPveAAgGm4tHUGS3t+2GIxAQCpdgVRfmBB7nPteIjUv1dMfSJAyTX1xUCrf5Pz8/UcEzMz9d/3cdAwAAAAAFiS0dEAIgFHUgAAAAHdElNRQfhCAQRGhr+dXT3AAAAs0lEQVQY02NgIAKIiUtISjEyScvIysmDBRQUE5OUlFVUk1PU1MECzBqaqWla2jrpKbp6YAEWfYOMTEOjrGxjE1awABubqVlObl6+uQU7B1iAk5PLsqCwKNHKmpsHLMDLZ2NbXFJaZmfPzw8WEBBwcCyvqKwqcxIUBAsIObtU17i6lZW5ewiDBUQ8vSpqvX186+r9/MECAYEVtUHBIaEVDWHhYAHPiMioaFHhmNi4+ARivAoAiKok6EBPp+kAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTctMDgtMDRUMTc6MjY6MjYrMDI6MDD8wuTpAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE3LTA4LTA0VDE3OjI2OjI2KzAyOjAwjZ9cVQAAAABJRU5ErkJggg=="},
        {name:"Netflix", link:"https://www.netflix.com/search?q=%T", icon:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAACXBIWXMAAAsTAAALEwEAmpwYAAABLklEQVQokY2QwUrDUBBF77zE5Fltu6hmUXGloKv6AYILURQqCCKi36MgfokoKARcCIIg6D/URXepgVoXVVuS2rxx8UisaWu8q3thDnNnwLH8kzNPljxZ8hcrrBQzP21UXavoWsXa8WkyJhCrzaoPAIi8RvjwiDESg6HJSpvuxdU/AdYmuHY5CFQm0GH+BANQ7x/BzW0vE7AInopbnV9244VjAQG8xGeEd/ftZmu4lUjlCHhlBsBffbv2PNwqDeRAdRVpvyCMjkq3SgMWobe8RBMmAIfIyNwggLwzY2+u61gWQv0NAJgkyh0daD9PIvz9qxGABcidbVHIA5gmmiLKAAyApJR7uzo6lH79aOUO9xNgsJOZODJMOVeWzmxhpQLAXluV1a2o4RutN1v8jH0DpOt20T1f6lMAAAAASUVORK5CYII="},
        {name:"HBO GO", link:"https://hbogo.pl/search/%T", icon:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuM40k/WcAAAH7SURBVDhPpZPvS1pRGMftH9irXokouV5I0fBFG2w16AfFXghb3RYDQYYhSPtJDWcJwQYjcIviEtpY4BiXbbi25ArFlMna9S4So4EgiCAiIvjjjSCICH7rHPLSnUVBB74czsP5fp7nPOccxdFoU6vVNpVKlTsSLqgc8RCv4th82qZzRSFKpfLCmbVarWxNvIrmwm63I5lMwmw2o1AoIBqNolqtolQqwWQyIRAIoNFoIJvNgmEYCSIBHA4H8vk8nE4nyuUyYrEY3G43BdVqNaTTaQiCAFEUKeRUQL1eR7FYlABkY6VSoWBiJBUQCJmbx5EBMpkMLBaLBPD5fIjH40gkEvQ44XAYqVQKwWCwtQKj0QiPxwODwQCv1wuXywW/3w+O46DX62G1WsHzPFiWhU6nawU01dNzDQ+nLJiYfACNRkNjd8cYPHk+i4HBIXT8dxMyQO/1G/j5W8S7lVV8+c7Dvf4RM7Y5hMQIPnBeCHsHGGPunw148XIeS6wLff23YX30FAuv3yAUjuAeu4ErP4qwvf9KoSc9MsDjZzNY//QZI6N3sPh2GX/3Ywju7GJ67Rval0NY4jZpgpMeGYA0h5S+wW9j69cfzC+8wvjEJHZ29yFE/tHYzVt9LQDZUyaNGxgcpv1oxrq6uzE8MoqrnZ1S7Fi5y3+my31nRdshxWryqXdnXZ4AAAAASUVORK5CYII="},
        {name:"JustWatch", link:"https://www.justwatch.com/pl/search?q=%T", icon:" data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIqSURBVDhPlVNLaBNRFD3vPWYmpmlIiTaFpqQp7aJaqSAGslHoB5GKC0FwoQsxuFIRFNwGRQVB6qK4EBF/CwUXtXZRrd0US1FQBF1JLS2h0QaxGJtJmum88b5JMoIUUw9c5s2de+6ccx+XtXb0xMq2fYcxtpdCxybgOE6ZYloXIiV8wfBTzvkAkUX1e12oWoqOdSl7uPqzSh5Karh3MYDB3ToVuHV1obiqgSu70c/Q3iJwtM+Hg0kD+xO+uo0UVwSamtPqJRQApt5bGBk1EW/RcOVUCIN7GvA5YyG3YruEjcCrT0S3CvTt0tDWLKizg5VfEmOvCzA0jufXYziQbMRGgrwGgkbYT/5vnw+CU/b0zR94+GIVZctBZ9TAjTNRHOkPIbHdX2VU4Floj3B8ydpI3zfRSmpGzoXRFtGw9N3GalHi7PAS5rNlTAx3IdHtx4c5k1TafxRIB7ClumM1nEoYOiNlDFLlKWpQOcErhlgkvoMowLEBHamhLTDXOG6NFbH4zcbHeQu9nQaeXI5hXQpcuvsVmWULs58KLlnBs7AzLpAvOLj6qICmIEf6RIhUMeRNB71dPlx7kMPo9E9kcpZLrMGzkMlJTL6zsLBc0RqmJof3NWCNhjh0YRHjM3nX3t/wLBwnCyfJwlzWwbOZMiy6+pdvS+5s/gWuFkMd8kUHC+T78VQJ47MlTLypT1Zcti3WPamWqZr7L0gpX3G1kupQU7IZqFrF0YVI/QYmMNGPfvRVrQAAAABJRU5ErkJggg=="}
    ];

var cachedEpisodes = [];

function AddServices()
{
    var section = document.getElementById("progress-wrapper");
    if(!section)
        return;

    var divServices = document.createElement("div");
    divServices.setAttribute("id", "servicesForm");

    var inner = "<form style='float:left; margin-left: 370px'>";

    for(var i = 0; i < services.length; i++)
    {
        inner += "<input id='" + services[i].name + "' type='radio' name='serviceName' style='float:left; margin-left: 20px'";
        if(i === 0)
            inner += " checked";
        inner += ">" + "<label  style='float:left; margin-left: 5px' for='" + services[i].name + "'><img alt='Embedded Image' height='16' width='16' src='" + services[i].icon + "'/></label>";
    }

    inner += "</form><br><br>";

    divServices.innerHTML = inner;
    section.insertBefore(divServices, section.firstChild);

    for(var j = 0; j < services.length; j++)
        document.getElementById(services[j].name).addEventListener("click", RefreshEpisodesLinks);
}

function RefreshEpisodesLinks()
{
    var link = "";
    var servs = document.getElementsByName("serviceName");
    for(var i = 0; i < servs.length; i++)
    {
        if(servs[i].checked)
        {
            link = services[i].link;
            break;
        }
    }

    for(var j = 0; j < cachedEpisodes.length; j++)
    {
        var ep = document.getElementById(cachedEpisodes[j].id);
        if(ep)
            ep.setAttribute("href", GetEpisodeLink(cachedEpisodes[j].showTitle, cachedEpisodes[j].seasonNum, cachedEpisodes[j].episodeNum, link));
    }
}

function DeleteElement(element)
{
    if (element)
    {
        var parent = element.parentNode;
        if (parent)
            parent.removeChild(element);
    }
}

function DeleteAllElements(elements)
{
    for (var i = elements.length - 1; i >= 0; i--)
        DeleteElement(elements[i]);
}

function ToggleEpisode(e)
{
    var sender = e.target;

    if (sender.parentNode.className == 'episode delete')
    {
        actionWatch($(sender).closest('.episode'), 'watch', false, 'now', false);
        sender.parentNode.className = 'episode check';
        sender.children[0].className = 'trakt-icon-check';
        RefreshProgressBars(sender.parentNode, true);
    }
    else
    {
        actionWatch($(sender).closest('.episode'), 'watch', true);
        sender.parentNode.className = 'episode delete';
        sender.children[0].className = 'trakt-icon-delete';
        RefreshProgressBars(sender.parentNode, false);
    }
}

function RefreshProgressBars(episode, add)
{
    var show = document.getElementsByName("bar" + episode.getAttribute("data-show-id"));
    var season = document.getElementsByName(episode.getAttribute("data-season-id"));
    var watchedSeason = season[0].getAttribute("watched");
    var watchedShow = show[0].getAttribute("watched");
    var totalSeason = season[0].getAttribute("total");
    var totalShow = show[0].getAttribute("total");

    if (add)
    {
        watchedSeason = parseInt(watchedSeason) + 1;
        watchedShow = parseInt(watchedShow) + 1;
    }
    else
    {
        watchedSeason = parseInt(watchedSeason) - 1;
        watchedShow = parseInt(watchedShow) - 1;
    }

    season[0].setAttribute("watched", parseInt(watchedSeason));
    show[0].setAttribute("watched", parseInt(watchedShow));

    var showBar = show[0].getElementsByClassName("progress-bar")[0];
    var showPer = parseInt(100.0 * parseFloat(watchedShow) / parseFloat(totalShow));
    var showPercentage = show[0].getElementsByClassName("percentage")[0];
    showPercentage.innerHTML = showPer + "%";
    showBar.setAttribute("aria-valuenow", showPer);
    showBar.setAttribute("style", "width: " + showPer + "%;");

    var seasonBar = season[0].getElementsByClassName("progress-bar")[0];
    var seasonPer = parseInt(100.0 * parseFloat(watchedSeason) / parseFloat(totalSeason));
    var seasonPercentage = season[0].getElementsByClassName("percentage")[0];
    var episodeCount = season[0].getElementsByClassName("episode-count")[0];
    seasonPercentage.innerHTML = seasonPer + "%";
    seasonBar.setAttribute("aria-valuenow", seasonPer);
    seasonBar.setAttribute("style", "width: " + seasonPer + "%;");
    episodeCount.innerHTML = watchedSeason + "/" + totalSeason + " episodes, " + watchedSeason + " plays";
}

function GetEpisodeLink(title, season, episode, link)
{
    var l = link;

    l = l.replace("%T", title);
    if (season.length == 1 && season[0] != '0')
        season = "0" + season;
    l = l.replace("%Sn", season);
    l = l.replace("%En", episode);

    return l;
}

var icoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAARCMAAEQjARIjYisAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTCtCgrAAAABQ0lEQVQ4T42TvWrDQBCEVQUCAXdpUgpioxQG/YDdx0UeSIXfIK/iFG4CLm3yAGryAgK7SJvOpfKNM4klnW08MKCb3Vnt7d1F1yBJkps0TUtYZVlWwwUcOXwZmO8wbjA0PX7Dy0VkJulDBors8jx/gUPWS2lw4dQQfTOMHYqKonh0gdpSiMlkckvCAM7aZkGduHBl6QgPbA4/4RdcYSgcjljHcOcCpeVfeGBrBdtE20+n03ubt9bW+pmtJwf2PB6PH/h+RXtn309/ZuUp39bAvFWyTDKriIqp6Dmz9nxoW2YYu929De2tqO2jWUAsHewclQbHegU1SA10rp85fAQBXc9GR2PpAPQYfQYHOlLLIUjQ3W50OSx1jgp299wHCW9OXNLFUJ1cbRZIGkE9jP9hiRQJB3YOGFRET7TGWMHy5MACRNEPMxqshw3yOLQAAAAASUVORK5CYII=";

var shows = document.getElementsByClassName("row posters fanarts twenty-four-cols grid-item no-overlays");

for (var i = 0; i < shows.length; i++)
{
    var showId = shows[i].getAttribute("data-show-id");

    var stats = shows[i].getElementsByClassName("col-md-15 col-sm-8 main-info");
    DeleteAllElements(stats[0].getElementsByTagName("p"));
    var showTitle = stats[0].getElementsByClassName("show-title")[0].getElementsByTagName("a")[0].innerHTML;

    var barShow = shows[i].getElementsByClassName("row");
    barShow[0].setAttribute("name", "bar" + showId);
    barShow[0].setAttribute("watched", 0);
    barShow[0].setAttribute("total", 0);

    DeleteAllElements(shows[i].getElementsByClassName("grid-item col-md-6 col-sm-4 no-border"));

    var links = shows[i].getElementsByClassName("season-toggle link");
    DeleteAllElements(links);

    var seasonsSection = shows[i].getElementsByClassName("seasons");
    var collapses = seasonsSection[0].getElementsByClassName("collapse");
    if (collapses.length > 0)
        collapses[0].className = "collapse in";

    var seasons = seasonsSection[0].getElementsByClassName("grid-item");
    for (var j = seasons.length - 1; j >= 0; j--)
    {
        var seasonId = seasons[j].getAttribute("data-season-id");
        seasons[j].setAttribute("name", seasonId);

        var counterInfo = seasons[j].getElementsByClassName("episode-count")[0].innerHTML;
        var counter = counterInfo.substr(0, counterInfo.indexOf(" "));
        var watched = counter.substr(0, counter.indexOf("/"));
        var total = counter.substr(counter.indexOf("/") + 1);

        seasons[j].setAttribute("watched", watched);
        seasons[j].setAttribute("total", total);

        var prevWatched = barShow[0].getAttribute("watched");
        var prevTotal = barShow[0].getAttribute("total");
        barShow[0].setAttribute("watched", parseInt(prevWatched) + parseInt(watched));
        barShow[0].setAttribute("total", parseInt(prevTotal) + parseInt(total));

        var item = seasons[j].getElementsByClassName("row")[1].getElementsByClassName("col-xs-1 percentage")[0];
        if (item && item.innerHTML == "100%")
        {
            DeleteElement(seasons[j]);
            continue;
        }
        var colapsedEpisodes = seasons[j].getElementsByClassName("row collapse");
        //if (colapsedEpisodes[0])
        //    colapsedEpisodes[0].className = "row collapse in";
        var episodes = colapsedEpisodes[0].getElementsByClassName("episode");
        for (var k = 0; k < episodes.length; k++)
        {
            var episodeId = episodes[k].getAttribute("data-episode-id");
            episodes[k].setAttribute("data-season-id", seasonId);
            episodes[k].setAttribute("data-show-id", showId);
            episodes[k].setAttribute("data-type", "episode");
            episodes[k].setAttribute("data-url", "/episodes/" + episodeId);
            var a = episodes[k].getElementsByTagName("a");
            a[0].removeAttribute("href");
            a[0].addEventListener("click", ToggleEpisode);
            a[0].setAttribute("style", "cursor: pointer;");

            var str = a[0].innerHTML;
            str = str.substr(str.lastIndexOf('>') + 1);
            var seasonNum = str.substr(0, str.indexOf('x'));
            var episodeNum = str.substr(str.indexOf('x') + 1);
            var linkElement = document.createElement("a");
            linkElement.setAttribute("id", showTitle + seasonNum + episodeNum);
            linkElement.setAttribute("target", "_blank");
            linkElement.setAttribute("style", "margin-left: 7px;");
            linkElement.innerHTML = "<img alt='Embedded Image' height='16' width='16' src='" + icoBase64 + "'/>";
            cachedEpisodes.push({id:showTitle + seasonNum + episodeNum, showTitle:showTitle, seasonNum:seasonNum, episodeNum:episodeNum});
            episodes[k].appendChild(linkElement);
        }
    }
    var seasons = seasonsSection[0].getElementsByClassName("grid-item");
    var colapsedEpisodes = seasons[0].getElementsByClassName("row collapse");
    if (colapsedEpisodes[0])
        colapsedEpisodes[0].className = "row collapse in";
}
AddServices();
RefreshEpisodesLinks();