// ==UserScript==
// @name         ptp_show_name1
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  show ptp group name
// @author       tomorrow505
// @match        https://greasyfork.org/zh-CN/script_versions/new
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @grant        none
// ==/UserScript==

const boldfont = true;
const coloredfont = true;
const groupnamecolor = '#20B2AA';

const showblankgroups = true;
const placeholder = 'Null';

const delimiter = ' / ';
const blockedgroup = 'TBB';
const moviesearchtitle = 'Browse Torrents ::';
const douban_prex = 'https://www.bfdz.ink/tools/ptgen/?imdb=tt';

function formatText(str, color){
    var style = [];
    if(boldfont) style.push('font-weight:bold');
    if(coloredfont && color) style.push(`color:${groupnamecolor}`);
    return `<span style="${style.join(';')}">${str}</span>`;
}

function setGroupName(groupname, target){
    var color = true;
    if ($(target).parent().find('.golden-popcorn-character').length) {
        color = false;
    }
    if ($(target).parent().find('.torrent-info__download-modifier--free').length) {
        color = false;
    }
    if ($(target).parent().find('.torrent-info-link--user-leeching').length) {
        color = false;
    }
    if ($(target).parent().find('.torrent-info-link--user-seeding').length) {
        color = false;
    }
    if ($(target).parent().find('.torrent-info-link--user-downloaded').length) {
        color = false;
    }

    if(isEmptyOrBlockedGroup(groupname)){
        if($(target).text().split(delimiter).includes(blockedgroup)){
            $(target).html(function(i, htmlsource){
                return htmlsource.replace(delimiter + blockedgroup, '');
            });
            groupname = blockedgroup;
        }
        else if(showblankgroups){
            groupname = placeholder;
        }
    }
    if(!isEmpty(groupname)){
        var location = 1; 
        try{ location = ptp_name_location; } catch(err) {console.log(err)}
        if (location == 1) {
            return $(target).append(delimiter).append(formatText(groupname, color));
        } else {
            return $(target).prepend(delimiter).prepend(formatText(groupname, color));
        }
        
    }
}

function setDoubanLink(imdb_id, target){
    if(!isEmpty(imdb_id)){
        try{
            var td = target.parentNode.parentNode.getElementsByTagName('td')[1];
            var div = td.getElementsByClassName('basic-movie-list__movie__ratings-and-tags')[0];
            var new_div = document.createElement('div');
            new_div.setAttribute('class', 'basic-movie-list__movie__rating-container');
            new_div.style.fontweight = 'bold';
            var span = document.createElement('span');
            span.setAttribute('class', 'basic-movie-list__movie__rating__title');
            var a = document.createElement('a');
            a.href = douban_prex + imdb_id;
            a.text = 'PtGen';
            a.target = "_blank";
            span.appendChild(a);
            new_div.appendChild(span);
            div.insertBefore(new_div, div.firstElementChild);
            a.onclick = function(e){
                e.preventDefault();
                var url = 'tt' + imdb_id;
                var req = 'https://movie.douban.com/j/subject_suggest?q={url}'.format({ 'url': url });
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: req,
                    onload: function(res) {
                        var response = JSON.parse(res.responseText);
                        if (response.length > 0) {
                            a.href = 'https://www.bfdz.ink/tools/ptgen/?imdb=' + response[0].id;
                        } else {
                            a.href = douban_prex + imdb_id;
                        }
                        window.open(a.href, target="_blank")
                    }
                });
            }
        } catch(err){}
    }
}

//Covers undefined, null, blank and whitespace-only strings
function isEmpty(str){
    return (!str || String(str).trim().length === 0);
}
//I can't even...
function isEmptyOrBlockedGroup(str){
    return (isEmpty(str) || str === blockedgroup);
}

if(document.title.indexOf(moviesearchtitle) !== -1){
    var movies = PageData.Movies;
    var releases = [];
    var imdb_urls = [];
    movies.forEach(function(movie){
        imdb_urls[movie.GroupId] = movie.ImdbId;
        movie.GroupingQualities.forEach(function(torrentgroup){
            torrentgroup.Torrents.forEach(function(torrent){
                releases[torrent.TorrentId] = torrent.ReleaseGroup;
            });
        });
    });
    if(PageData.ClosedGroups != 1){
        releases.forEach(function(groupname, index){
            $(`tbody a.torrent-info-link[href$="torrentid=${index}"]`).each(function(){
                setGroupName(groupname, this);
            });
        });
        imdb_urls.forEach(function(imdbid, groupid){
            $(`tbody a.basic-movie-list__movie__cover-link[href$="id=${groupid}"]`).each(function(){
                setDoubanLink(imdbid, this);
            });
        })
    }
    else{
        var targetNodes = $('tbody');
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        var myObserver = new MutationObserver(mutationHandler);
        var obsConfig = {childList: true, characterData: false, attributes: false, subtree: false};

        targetNodes.each(function (){
            myObserver.observe (this, obsConfig);
        });

        function mutationHandler (mutationRecords) {
            mutationRecords.forEach ( function (mutation) {
                if (mutation.addedNodes.length > 0) {
                    $(mutation.addedNodes).find('a.torrent-info-link').each(function(){
                        var mutatedtorrentid = this.href.match(/\btorrentid=(\d+)\b/)[1];
                        var groupname = releases[mutatedtorrentid];
                        setGroupName(groupname, this);
                    });
                }
            });
        }

    }
}
else{
    $('table#torrent-table a.torrent-info-link').each(function(){
        var groupname = $(this).parent().parent().data('releasegroup');
        setGroupName(groupname, this);
    });
}

$('.torrent-info__reported').each(function(){
    $(this).css('color', '#FFAD86');
});

$('.torrent-info__download-modifier--free').each(function(){
    $(this).parent().css('color', '#4DFFFF');
});

$('.golden-popcorn-character').each(function(){
    var val=$(this).next().attr("class");
    if (val && !val.match(/torrent-info-link--user-leeching|torrent-info-link--user-seeding|torrent-info-link--user-downloaded/i)){
        $(this).parent().css('color', '#FFD700');
        $(this).next().css('color', '#FFD700');
    }else {
         $(this).attr('class', val)
    }
});

$('.torrent-info__trumpable').each(function(){
    $(this).css('color', '#E8FFC4');
});

$('.torrent-info-link--user-seeding').each(function(){
    $(this).css('color', 'red');
});

$('.torrent-info-link--user-downloaded').each(function(){
    $(this).css('color', 'green');
});

$('.torrent-info-link--user-leeching').each(function(){
    $(this).css('color', 'MediumSpringGreen');
});

if (location.href.match(/id=\d+/)){
    $('.group_torrent_header').each(function(){
        var $img = $(this).find('a').eq(3).find('img');
        var $old_url = $img.prop('src');
        $img.prop('src', $old_url)
    })
}